
(function ($, ej) {
    "use strict";

    //#region SVG
    var Svg = (function () {
        function Svg(attr) {
            this.xmlns = "http://www.w3.org/2000/svg";
            this.document = document.createElementNS(this.xmlns, "svg");
            this.id = attr.id;
            if (attr) {
                ej.datavisualization.Diagram.Util.attr(this.document, attr);
            }
            return this;
        }
        Svg.prototype.element = function (attr, tag) {
            var element;
            if (attr && attr.id) {
                element = this.document.getElementById(attr.id);
            }
            if (!element) {
                element = document.createElementNS(this.xmlns, tag);
            }
            if (attr)
                ej.datavisualization.Diagram.Util.attr(element, attr);
            return element;
        };
        Svg.prototype.g = function (attr) {
            return this.element(attr, "g");
        };
        Svg.prototype.defs = function (attr) {
            return this.element(attr, "defs");
        };
        Svg.prototype.image = function (attr) {
            return this.element(attr, "image");
        };
        Svg.prototype.path = function (attr) {
            return this.element(attr, "path");
        };
        Svg.prototype.text = function (attr) {
            return this.element(attr, "text");
        };
        Svg.prototype.textPath = function (attr) {
            return this.element(attr, "textPath");
        };
        Svg.prototype.tspan = function (attr) {
            return this.element(attr, "tspan");
        };
        Svg.prototype.rect = function (attr) {
            return this.element(attr, "rect");
        };
        Svg.prototype.ellipse = function (attr) {
            return this.element(attr, "ellipse");
        };
        Svg.prototype.circle = function (attr) {
            return this.element(attr, "circle");
        };
        Svg.prototype.title = function (attr) {
            return this.element(attr, "title");
        };
        Svg.prototype.line = function (attr) {
            return this.element(attr, "line");
        };
        Svg.prototype.polyline = function (attr) {
            return this.element(attr, "polyline");
        };
        Svg.prototype.polygon = function (attr) {
            return this.element(attr, "polygon");
        };
        Svg.prototype.foreignObject = function (attr) {
            return this.element(attr, "foreignObject");
        };
        Svg.prototype.linearGradient = function (attr) {
            return this.element(attr, "linearGradient");
        };
        Svg.prototype.radialGradient = function (attr) {
            return this.element(attr, "radialGradient");
        };
        Svg.prototype.stop = function (attr) {
            return this.element(attr, "stop");
        };
        Svg.prototype.pattern = function (attr) {
            return this.element(attr, "pattern");
        };
        Svg.prototype.appendChild = function (element) {
            this.document.appendChild(element);
        };
        Svg.prototype.removeChild = function (element, parent) {
            if (parent) {
                parent.removeChild(element);
            } else {
                this.document.removeChild(element);
            }
        };
        Svg.prototype.getElementById = function (id) {
            return this.document.getElementById(id);
        };
        Svg.prototype.getElementsByClassName = function (name) {
            return this.document.getElementsByClassName(name);
        };
        Svg.prototype.getElementsByTagName = function (name) {
            return this.document.getElementsByTagName(name);
        };
        Svg.prototype.pathBounds = function (data) {
            var attributes = { d: data };
            var path = this.path(attributes);
            var svg = new ej.datavisualization.Diagram.Svg({ "id": "TempSvg" });
            document.body.appendChild(svg.document);
            svg.document.appendChild(path);
            var bounds = path.getBBox();
            document.body.removeChild(svg.document);
            return bounds;
        };
        Svg.prototype.textBounds = function (text, attr, textElement) {
            var bounds = null;
            if (text && attr) {
                var svgText = this.text(attr);
                svgText.appendChild(document.createTextNode(text));
                this.document.appendChild(svgText);
                bounds = svgText.getBBox();
                this.document.removeChild(svgText);
            }
            else if (textElement) {
                this.document.appendChild(textElement);
                bounds = textElement.getBBox();
                this.document.removeChild(textElement);
            }
            return bounds;
        };
        Svg.prototype.absolutePath = function (path) {
            var x0, y0, x1, y1, x2, y2, segs = ej.datavisualization.Diagram.Util.convertPathToArray(path.getAttribute("d"));
            for (var x = 0, y = 0, i = 0, length = segs.length; i < length; ++i) {
                var seg = segs[i], char = seg.pathSegTypeAsLetter;
                if (/[MLHVCSQTA]/.test(char)) {
                    if ('x' in seg) x = seg.x;
                    if ('y' in seg) y = seg.y;
                } else {
                    if ('x1' in seg) x1 = x + seg.x1;
                    if ('x2' in seg) x2 = x + seg.x2;
                    if ('y1' in seg) y1 = y + seg.y1;
                    if ('y2' in seg) y2 = y + seg.y2;
                    if ('x' in seg) x += seg.x;
                    if ('y' in seg) y += seg.y;
                    var newSeg;
                    switch (char) {
                        case 'm':
                            newSeg = { pathSegTypeAsLetter: "M", x: x, y: y };
                            break;
                        case 'l':
                            newSeg = { pathSegTypeAsLetter: "L", x: x, y: y };
                            break;
                        case 'h':
                            newSeg = { pathSegTypeAsLetter: "H", x: x };
                            break;
                        case 'v':
                            newSeg = { pathSegTypeAsLetter: "V", y: y };
                            break;
                        case 'c':
                            newSeg = { pathSegTypeAsLetter: "C", x: x, y: y, x1: x1, y1: y1, x2: x2, y2: y2 };
                            break;
                        case 's':
                            newSeg = { pathSegTypeAsLetter: "S", x: x, y: y, x2: x2, y2: y2 };
                            break;
                        case 'q':
                            newSeg = { pathSegTypeAsLetter: "Q", x: x, y: y, x1: x1, y1: y1 };
                            break;
                        case 't':
                            newSeg = { pathSegTypeAsLetter: "T", x: x, y: y };
                            break;
                        case 'a':
                            newSeg = { pathSegTypeAsLetter: "A", x: x, y: y, r1: seg.r1, r2: seg.r2, angle: seg.angle, largeArcFlag: seg.largeArcFlag, sweepFlag: seg.sweepFlag };
                            break;
                        case 'z':
                        case 'Z':
                            x = x0; y = y0;
                            newSeg = segs[i];
                            break;
                    }
                    if (newSeg)
                        segs[i] = newSeg;
                }
                if (char === 'M' || char === 'm') x0 = x, y0 = y;
            }
            path.setAttribute("d", ej.datavisualization.Diagram.Util.pathSegArrayAsString(segs));
            return path;
        };
        return Svg;
    })();

    ej.datavisualization.Diagram.Svg = Svg;
    //#endregion

    //#region SVG Renderer
    ej.datavisualization.Diagram.SvgContext = {

        _renderDocument: function (view, diagram, isload) {
            if (window.SVGSVGElement) {
                var svgParent = $("#" + view.canvas.id + "_svgParent")[0];
                if (!svgParent)
                    svgParent = document.createElement("div");
                var rulerSize = ej.datavisualization.Diagram.ScrollUtil._getRulerSize(diagram);
                var attr = {
                    "id": view.canvas.id + "_svgParent",
                    "style": "height:auto;width:auto;position:absolute;overflow:hidden;left:" + rulerSize.left + "px;top:" + rulerSize.top + "px;bottom:0px;"
                }
                ej.datavisualization.Diagram.Util.attr(svgParent, attr);
                view.canvas.appendChild(svgParent);
                diagram._svgParent = svgParent;
                var attr = {
                    id: view.canvas.id + "_svg",
                    version: "1.1",
                    "style": "position:absolute;",
                    "class": "mainview_svg",
                    "role": "img",
                };
                if (ej.isMobile())
                    attr.style = "position: inherit";
                if (!isload)
                    var svg = new ej.datavisualization.Diagram.Svg(attr);
                else
                    svg = diagram._svg
                view.svg = svg;
                if (diagram) {
                    this._renderRulers(diagram, view.canvas, view.svg, isload)
                    diagram._svg = svg;
                    if (!isload && !document.getElementById(svg.document.id)) {
                        diagram._svgParent.appendChild(svg.document);
                    }
                    diagram._view = this._renderView(view.canvas, view.svg, isload);
                    diagram._page = this._renderPage(view.canvas, view.svg, diagram._view, isload);
                    this._renderBackground(diagram, view.canvas, view.svg, diagram._page, diagram.model, isload);
                    diagram._pageBackgroundLayer = this._renderBackgroundLayer(view.canvas, view.svg, diagram._page, isload);
                    this._renderGrid(view.canvas, view.svg, diagram._page, diagram);
                    diagram._diagramLayer = view.diagramLayer = this._renderDiagramLayer(view.canvas, view.svg, diagram._page);
                    diagram._htmlLayer = this._renderHtmlLayer(view.canvas, isload, diagram);
                    this._renderAdornerLayer(diagram, view.canvas, isload, view);
                }
                else {


                }
            }
        },
        _renderRulers: function (diagram, canvas, svg, isload) {
            if (diagram.model.rulerSettings.showRulers) {
                this._renderOverLappingElement(diagram, canvas, svg, isload);
                this._renderRuler(diagram, canvas, svg, false, isload);
                this._renderRuler(diagram, canvas, svg, true, isload);
            }
            else {
                var div
                div = document.getElementById(canvas.id + "_hRuler");
                if (div) div.parentNode.removeChild(div);
                div = document.getElementById(canvas.id + "_vRuler");
                if (div) div.parentNode.removeChild(div);
                div = document.getElementById(canvas.id + "_overlap-Ruler")
                if (div) div.parentNode.removeChild(div);

            }
        },
        _renderOverLappingElement: function (diagram, canvas, svg, isload) {
            var div = document.getElementById(canvas.id + "_overlap-Ruler"), rulerSize, style;
            if (!div) {
                div = document.createElement("div");
                rulerSize = ej.datavisualization.Diagram.ScrollUtil._getRulerSize(diagram);
                div.setAttribute("id", canvas.id + "_overlap-Ruler")
                style = "height: " + rulerSize.top + "px;width:" + rulerSize.left + "px;position:absolute;left:0;top:0";
                div.setAttribute("style", style)
                div.setAttribute("class", "sf-diagram_overlap");
            }
            canvas.insertBefore(div, canvas.firstChild)
        },
        _updateRulerSpace: function (diagram, rulerGeometry, isHorizontal) {
            var div = document.getElementById(diagram._canvas.id + (isHorizontal ? "_hRuler" : "_vRuler"));
            var ruler = isHorizontal ? diagram._hRulerInstance : diagram._vRulerInstance;
            if (div && diagram && rulerGeometry) {
                if (isHorizontal) {
                    div.style.width = (rulerGeometry.width + (diagram._hRulerInstance.model.segmentWidth * 2)) + "px";
                    div.style.height = ruler.model.thickness + "px";
                    div = document.getElementById(diagram._canvas.id + "_overlap-Ruler")
                    if (div)
                        div.style.height = ruler.model.thickness + "px";

                }
                else {
                    div.style.height = (rulerGeometry.height + (diagram._vRulerInstance.model.segmentWidth * 2)) + "px";
                    div.style.width = ruler.model.thickness + "px";
                    div = document.getElementById(diagram._canvas.id + "_overlap-Ruler")
                    if (div)
                        div.style.width = ruler.model.thickness + "px";
                }
            }
        },
        _renderRuler: function (diagram, canvas, svg, isHorizontal, isload) {
            var div = document.getElementById(canvas.id + (isHorizontal ? "_hRuler" : "_vRuler"));
            var rulerSize = ej.datavisualization.Diagram.ScrollUtil._getRulerSize(diagram);
            var rulerGeometry = ej.datavisualization.Diagram.ScrollUtil._getRulerGeometry(diagram);
            if (!div) {
                div = document.createElement("div");
                if (isHorizontal)
                    var style = "height: " + rulerSize.top + "px;width:" + (rulerGeometry.width) + "px;margin-left:" + rulerSize.left + "px;" + "";
                else
                    var style = "height:" + rulerGeometry.height + "px;width: " + rulerSize.left + "px;" + "float:left;top:" + rulerSize.top + "px;";
                div.setAttribute("id", canvas.id + (isHorizontal ? "_hRuler" : "_vRuler"))
                div.setAttribute("style", style)
                div.setAttribute("class", (isHorizontal ? "sf-diagram_hRuler" : "sf-diagram_hRuler"));
            }
            //canvas.appendChild(div);
            canvas.insertBefore(div, canvas.firstChild)
            var ruler = isHorizontal ? diagram.model.rulerSettings.horizontalRuler : diagram.model.rulerSettings.verticalRuler
            ruler = $.extend(true, {}, ruler);
            ruler.length = (isHorizontal ? rulerGeometry.width : rulerGeometry.height) + ruler.segmentWidth;
            ruler.orientation = isHorizontal ? "horizontal" : "vertical";
            var rulerObj = $("#" + div.id).ejRuler(ruler);
            var rulerInstance = $("#" + div.id).ejRuler("instance");
            if (isHorizontal) {
                diagram._hRuler = rulerObj;
                diagram._hRulerInstance = rulerInstance;
            }
            else {
                diagram._vRuler = rulerObj;
                diagram._vRulerInstance = rulerInstance;
            }
        },

        _renderView: function (canvas, svg, isload) {
            var view = svg.document.getElementById(canvas.id + "_view");
            if (!view) {
                var attr = { id: canvas.id + "_view" };
                view = svg.g(attr);
            }
            if (!isload)
                svg.appendChild(view);
            return view;
        },

        _renderHtmlLayer: function (canvas, isload, diagram) {
            var div = document.getElementById(canvas.id + "_htmlLayer");
            if (!div)
                div = document.createElement("div");
            var attr = { "id": canvas.id + "_htmlLayer", "class": "htmlLayer" };
            ej.datavisualization.Diagram.Util.attr(div, attr);
            var htmlLayer = div;
            div.style.pointerEvents = "none";
            if (!isload) {
                diagram._svgParent.appendChild(htmlLayer);
            }
            return htmlLayer;
        },

        _renderAdornerLayer: function (diagram, canvas, isload, view) {
            var div = document.getElementById(canvas.id + "_adorner");
            if (!div)
                div = document.createElement("div");
            var attr = { "id": canvas.id + "_adorner", "class": "adornerLayer", "style": "position:absolute;left:0px;top:0px" };
            ej.datavisualization.Diagram.Util.attr(div, attr);
            diagram._adornerLayer = this._renderAdornerSvg(diagram, canvas, div, isload, view);
            diagram._tooltipLayer = this._renderTooltipLayer(canvas, div, isload);
            if (!isload)
                diagram._svgParent.appendChild(div);
        },

        _renderTooltipLayer: function (canvas, parent, isload) {
            var div = document.getElementById(canvas.id + "_tooltip");
            if (!div)
                div = document.createElement("div");
            var attr = { "id": canvas.id + "_tooltip", "class": "diagram_tooltip" };
            ej.datavisualization.Diagram.Util.attr(div, attr);
            var tooltipdiv = div;
            div.style.pointerEvents = "none";
            if (!isload)
                parent.appendChild(tooltipdiv);
            return tooltipdiv;
        },

        _renderPage: function (canvas, svg, parent, isload) {
            var page = svg.document.getElementById(canvas.id + "_page");
            if (!page) {
                var attr = { "id": canvas.id + "_page", "class": "page" };
                page = svg.g(attr);
            }
            if (!isload)
                parent.appendChild(page);
            return page;
        },

        _renderDiagramLayer: function (canvas, svg, parent) {
            var diagramLayer = svg.document.getElementById(canvas.id + "_diagramLayer");
            if (!diagramLayer) {
                var attr = { "id": canvas.id + "_diagramLayer", "class": "DiagramLayer" };
                diagramLayer = svg.g(attr);
                parent.appendChild(diagramLayer);
            }
            return diagramLayer;
        },

        _renderAdornerSvg: function (diagram, canvas, parent, isload, view) {
            if (window.SVGSVGElement) {
                var attr = {
                    id: canvas.id + "_svg_adorner",
                    version: "1.1",
                    "style": "position:absolute",
                    "fill": "none",
                    "pointer-events": "none"
                };
                var svg;
                if (!isload)
                    svg = new ej.datavisualization.Diagram.Svg(attr);
                else
                    svg = diagram._adornerSvg;
                if (!isload && !document.getElementById(svg.document.id))
                    parent.appendChild(svg.document);
                var expander = svg.document.getElementById(canvas.id + "_expander");
                if (!expander) {
                    var attr = { "id": canvas.id + "_expander", "class": "ExpanderLayer", "pointer-events": "all" };
                    expander = svg.g(attr);
                    svg.document.appendChild(expander);
                }
                view._expander = diagram._expander = expander;
                var adornerLayer = svg.document.getElementById(canvas.id + "_adornerLayer");
                if (!adornerLayer) {
                    var attr = { "id": canvas.id + "_adornerLayer", "class": "AdornerLayer", "pointer-events": "none" };
                    adornerLayer = svg.g(attr);
                    svg.document.appendChild(adornerLayer);
                }
                var portLayer = svg.document.getElementById(canvas.id + "_portLayer");
                if (!portLayer) {
                    var attr = { "id": canvas.id + "_portLayer", "class": "portLayer", "pointer-events": "none" };
                    portLayer = svg.g(attr);
                    adornerLayer.appendChild(portLayer);
                }
                diagram._adornerSvg = svg;
                return adornerLayer;
            }
        },

        _renderBackgroundLayer: function (canvas, svg, parent, isload) {
            var pageBackgroundLayer = svg.document.getElementById(canvas.id + "_pageBackground");
            if (!pageBackgroundLayer) {
                var attr = {
                    "id": canvas.id + "_pageBackground",
                    "class": "PageBackgroundLayer",
                    "style": "pointer-events:none;",
                };
                pageBackgroundLayer = svg.g(attr);
            }
            if (!isload)
                parent.appendChild(pageBackgroundLayer);
            return pageBackgroundLayer;
        },

        _renderBackground: function (diagram, canvas, svg, parent, model, isload) {
            svg.document.style.msTouchAction = "none";
            svg.document.style.display = "block";
            svg.document.style.backgroundColor = "white";
            var attr = { id: canvas.id + "_backgroundLayer" };
            var g = svg.g(attr);
            var pageBounds = diagram._getDigramBounds();
            if (diagram._backgroundImage()) {
                var bgImg = diagram._backgroundImage();
                var alignment = ej.datavisualization.Diagram.Util._getImageAlignment(bgImg.alignment);
                var preserveAspectRatio = "none " + alignment != "none" && bgImg.scale != "none" ? alignment + " " + bgImg.scale : "none";
                attr = { "id": canvas.id + "_backgroundImage", "x": pageBounds.x, "y": pageBounds.y, "width": pageBounds.width, "height": pageBounds.height, "preserveAspectRatio": preserveAspectRatio, "pointer-events": "none" };
                var image = svg.image(attr);
                image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", bgImg.source);
                if (!svg.getElementById(canvas.id + "_backgroundImage")) {
                    g.appendChild(image);
                }
            }
            var bgColor = diagram._backgroundColor();
            var rect = svg.rect({
                "id": canvas.id + "_backgroundColor", "width": "100%", "height": "100%", "fill": bgColor, "pointer-events": "none"

            });
            if (bgColor) {
                if (!svg.getElementById(canvas.id + "_backgroundColor")) {
                    g.appendChild(rect);
                }
            }
            else {
                if (svg.getElementById(rect.id)) {
                    g.removeChild(svg.getElementById(rect.id));
                }
            }

            if (!svg.getElementById(g.id))
                parent.appendChild(g);

        },

        _renderGrid: function (canvas, svg, parent, diagram) {
            var defs = diagram._svg.document.getElementById(canvas.id + "patterndefinition")
            if (!defs) {
                defs = svg.defs({ "id": canvas.id + "patterndefinition" });
                svg.appendChild(defs);
            }
            var g;
            if (diagram._snapConstraints() & ej.datavisualization.Diagram.SnapConstraints.ShowHorizontalLines ||
                diagram._snapConstraints() & ej.datavisualization.Diagram.SnapConstraints.ShowVerticalLines) {
                var grid = document.getElementById(canvas.id + "_grid");
                var rect = document.getElementById(canvas.id + "pattern_gridline");
                var pattern = document.getElementById(canvas.id + "pattern_grid");
                if (pattern && pattern.parentNode)
                    pattern.parentNode.removeChild(pattern);
                var attr = { id: canvas.id + "_grid", "pointer-events": "none" };
                g = svg.g(attr);
                var height = 0;
                if (diagram.model.snapSettings.horizontalGridLines.linesInterval) {
                    diagram.model.snapSettings.horizontalGridLines.linesInterval.forEach(function (entry) {
                        height += entry;
                    });
                }
                var width = 0;
                if (diagram.model.snapSettings.verticalGridLines.linesInterval) {
                    diagram.model.snapSettings.verticalGridLines.linesInterval.forEach(function (entry) {
                        width += entry;
                    });
                }
                var scale = this._scaleSnapInterval(diagram.model, diagram._currZoom);;

                attr = { id: canvas.id + "pattern_grid", x: 0, y: 0, width: width * scale, height: height * scale, patternUnits: "userSpaceOnUse" };
                var pattern = svg.pattern(attr);
                //pattern.setAttribute("patternUnits", "userSpaceOnUse");
                scale = this._scaleSnapInterval(diagram.model, scale);
                this._renderHorizontalGridlines(scale, pattern, width, diagram, svg);
                this._renderVerticalGridlines(scale, pattern, height, diagram, svg);
                defs.appendChild(pattern);
                var rect = svg.rect({ id: canvas.id + "pattern_gridline", "x": diagram._hScrollOffset, "y": diagram._vScrollOffset, "width": "100%", "height": "100%", "fill": "url(#" + canvas.id + "pattern_grid)" });
                g.appendChild(rect);
                if (!grid) {
                    if (diagram._diagramLayer) { parent.insertBefore(g, diagram._diagramLayer); }
                    else
                        parent.appendChild(g);
                }
            }
            else {
                g = document.getElementById(canvas.id + "_grid");
                if (g) {
                    var grid = document.getElementById(canvas.id + "pattern_gridline");
                    if (grid && grid.parentNode)
                        grid.parentNode.removeChild(grid);
                }
            }
        },

        _updateBackground: function (hoffset, voffset, scale, diagram) {
            var attr = {
                x: hoffset,
                y: voffset
            };
            var bgClr = document.getElementById(diagram._id + "_canvas_backgroundColor");
            if (bgClr)
                ej.datavisualization.Diagram.Util.attr(bgClr, attr);
            var bgImg = document.getElementById(diagram._id + "_canvas_backgroundImage");
            var pageBounds = diagram._getDigramBounds();
            if (bgImg)
                ej.datavisualization.Diagram.Util.attr(bgImg, { "transform": "scale(" + scale + ")", "x": pageBounds.x, "y": pageBounds.y, "width": pageBounds.width, "height": pageBounds.height });
        },

        _updateGrid: function (hoffset, voffset, scale, diagram) {
            var grid = document.getElementById(diagram._canvas.id + "pattern_gridline");
            var i;
            if (grid) {
                var pattern = document.getElementById(diagram._canvas.id + "pattern_grid");
                var height = 0;
                if (diagram.model.snapSettings.horizontalGridLines.linesInterval) {
                    for (i = 0; i < diagram.model.snapSettings.horizontalGridLines.linesInterval.length; i++) {
                        height += diagram.model.snapSettings.horizontalGridLines.linesInterval[i];
                    }
                }
                var width = 0;
                if (diagram.model.snapSettings.verticalGridLines.linesInterval) {
                    for (i = 0; i < diagram.model.snapSettings.verticalGridLines.linesInterval.length; i++) {
                        width += diagram.model.snapSettings.verticalGridLines.linesInterval[i];
                    }
                }

                var attr = {
                    x: hoffset,
                    y: voffset
                };
                ej.datavisualization.Diagram.Util.attr(grid, attr);

                scale = this._scaleSnapInterval(diagram.model, scale);
                var svg = diagram._svg;
                var defs = svg.defs({ "id": diagram._canvas.id + "patterndefinition" });
                if (pattern)
                    defs.removeChild(pattern);
                var attr = { id: diagram._canvas.id + "pattern_grid", x: 0, y: 0, width: width * scale, height: height * scale, patternUnits: "userSpaceOnUse" };
                pattern = diagram._svg.pattern(attr);
                this._renderHorizontalGridlines(scale, pattern, width, diagram, diagram._svg);
                this._renderVerticalGridlines(scale, pattern, height, diagram, diagram._svg);
                defs.appendChild(pattern);
            }
        },

        _scaleSnapInterval: function (model, scale) {
            if (scale >= 2) {
                while (scale >= 2) {
                    scale /= 2;
                }
            }
            else if (scale <= 0.5) {
                while (scale <= 0.5) {
                    scale *= 2;
                }
            }
            var i;
            if (scale !== 1) {
                model.snapSettings.horizontalGridLines._snapinterval = [];
                for (i = 0; i < model.snapSettings.horizontalGridLines.snapInterval.length; i++) {
                    model.snapSettings.horizontalGridLines._snapinterval[i] =
                        model.snapSettings.horizontalGridLines.snapInterval[i] * scale;
                }
                model.snapSettings.verticalGridLines._snapinterval = [];
                for (i = 0; i < model.snapSettings.verticalGridLines.snapInterval.length; i++) {
                    model.snapSettings.verticalGridLines._snapinterval[i] =
                        model.snapSettings.verticalGridLines.snapInterval[i] * scale;
                }
            }
            return scale;
        },
        _updateRulerSegment: function (scale, pattern, value, diagram, svg, isVertical) {
            if (diagram.model.rulerSettings.showRulers) {
                var snapSettings = diagram.model.snapSettings;
                var ruler = $("#" + (isVertical ? diagram._hRuler[0].id : diagram._vRuler[0].id)).ejRuler("instance");
                var obruler = $("#" + (isVertical ? diagram._vRuler[0].id : diagram._hRuler[0].id)).ejRuler("instance");
                var segmentWidth = ruler._updateSegmentWidth(diagram._currZoom);
                var spaceWidth = obruler._updateSegmentWidth(diagram._currZoom);
                var tickInterval = segmentWidth / ruler.model.interval;
                var space = 0, i, line, thickness, d;
                var lines = isVertical ? snapSettings.verticalGridLines : snapSettings.horizontalGridLines;
                for (i = 0; i < ruler.model.interval; i++) {
                    thickness = (i == 0 ? 1.25 : .25)
                    d = Number(space + (thickness / 2));
                    if (!isVertical) {
                        line = svg.path({
                            "d": "M " + 0 + " " + d + " L " + spaceWidth + " " + d + " Z",
                            "stroke": lines.lineColor,
                            "stroke-width": thickness, "stroke-dasharray": lines.lineDashArray
                        })
                    }
                    else {
                        line = svg.path({
                            "d": "M " + d + " " + 0 + " L " + d + " " + spaceWidth + " Z",
                            "stroke": lines.lineColor,
                            "stroke-width": thickness, "stroke-dasharray": lines.lineDashArray
                        })
                    }
                    space += (tickInterval + (thickness / 2));
                    if (line)
                        pattern.appendChild(line);
                }
                if (!isVertical)
                    pattern.setAttribute("height", segmentWidth);
                else pattern.setAttribute("width", segmentWidth);
            }
        },
        _checkForDefaultGridlines: function (gridlines) {
            var defGridLine = [1.25, 18.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75], i;
            if (gridlines) {
                if (gridlines.length > 0 && defGridLine.length > 0 && gridlines.length != defGridLine.length)
                    return false;
                for (i = 0; i < defGridLine.length; i++) {
                    if (defGridLine[i] != gridlines[i])
                        return false;
                }
            }
            return true;
        },
        _renderHorizontalGridlines: function (scale, pattern, width, diagram, svg) {
            var model = diagram.model;
            var snapSettings = model.snapSettings;
            if (diagram._snapConstraints() & ej.datavisualization.Diagram.SnapConstraints.ShowHorizontalLines) {
                if (diagram.model.rulerSettings.showRulers && this._checkForDefaultGridlines(diagram.model.snapSettings.horizontalGridLines.linesInterval))
                    this._updateRulerSegment(scale, pattern, width, diagram, svg);
                else {
                    var space = 0, d;
                    var cnt = 0;
                    for (var i = 0; i < snapSettings.horizontalGridLines.linesInterval.length; i = i + 2) {
                        var thickness = snapSettings.horizontalGridLines.linesInterval[i];
                        d = Number(space + (thickness / 2));
                        var line = svg.path({
                            "d": "M " + 0 + " " + d * scale + " L " + width * scale + " " + d * scale + " Z",
                            "stroke": snapSettings.horizontalGridLines.lineColor,
                            "stroke-width": thickness, "stroke-dasharray": snapSettings.horizontalGridLines.lineDashArray
                        });
                        space += snapSettings.horizontalGridLines.linesInterval[i + 1] + thickness;
                        pattern.appendChild(line);
                        cnt++;
                    }
                }
            }
        },

        _renderVerticalGridlines: function (scale, pattern, height, diagram, svg) {
            var model = diagram.model;
            var snapSettings = model.snapSettings;
            if (snapSettings.snapConstraints & ej.datavisualization.Diagram.SnapConstraints.ShowVerticalLines) {
                if (diagram.model.rulerSettings.showRulers && this._checkForDefaultGridlines(diagram.model.snapSettings.verticalGridLines.linesInterval))
                    this._updateRulerSegment(scale, pattern, height, diagram, svg, true);
                else {
                    var space = 0, d;
                    var cnt = 0;
                    for (var i = 0; i < snapSettings.verticalGridLines.linesInterval.length; i = i + 2) {
                        var thickness = model.snapSettings.verticalGridLines.linesInterval[i];
                        d = Number(space + (thickness / 2));
                        var line = svg.path({
                            "d": "M " + d * scale + " " + 0 + " L " + d * scale + " " + height * scale + " Z",
                            "stroke": snapSettings.verticalGridLines.lineColor,
                            "stroke-width": thickness, "stroke-dasharray": snapSettings.verticalGridLines.lineDashArray
                        });
                        space += snapSettings.verticalGridLines.linesInterval[i + 1] + thickness;
                        pattern.appendChild(line);
                        cnt++;
                    }
                }
            }
        },
        //#region Transformation
        transformView: function (diagram, hOffset, vOffset) {
            var rulerSize = ej.datavisualization.Diagram.ScrollUtil._getRulerSize(diagram);
            var view = diagram._view;
            var attr = {
                "transform": "translate(" + hOffset + "," + vOffset + ")"
            };
            ej.datavisualization.Diagram.Util.attr(view, attr);
            ej.datavisualization.Diagram.Util.attr(diagram._adornerLayer, attr);
            ej.datavisualization.Diagram.Util.attr(diagram._expander, {
                "transform": "translate(" + hOffset + "," + vOffset + "),scale(" + diagram.model.scrollSettings.currentZoom + ")"
            });
            if (diagram._htmlLayer) {
                diagram._htmlLayer.style.left = hOffset + "px";
                diagram._htmlLayer.style.top = vOffset + "px";
                diagram._htmlLayer.style.position = "absolute";
            }
        },
        scaleContent: function (diagram, scale) {
            var diagramLayer = diagram._diagramLayer;
            ej.datavisualization.Diagram.Util.attr(diagramLayer, { "transform": "scale(" + scale + ")" });
            var hOffset1 = typeof diagram.model.scrollSettings.horizontalOffset === "function" ? diagram.model.scrollSettings.horizontalOffset() : diagram.model.scrollSettings.horizontalOffset;
            var vOffset1 = typeof diagram.model.scrollSettings.verticalOffset === "function" ? diagram.model.scrollSettings.verticalOffset() : diagram.model.scrollSettings.verticalOffset;
            ej.datavisualization.Diagram.Util.attr(diagram._expander, { "transform": "translate(" + (-hOffset1) + "," + (-vOffset1) + "),scale(" + scale + ")" });
            if (diagram._htmlLayer) {
                diagram._htmlLayer.style.webkitTransform = "scale(" + scale + ")";
                diagram._htmlLayer.style.MozTransform = "scale(" + scale + ")";
                diagram._htmlLayer.style.OTransform = "scale(" + scale + ")";
                diagram._htmlLayer.style.msTransform = "scale(" + scale + ")";
                diagram._htmlLayer.style.transform = "scale(" + scale + ")";
            }
            if (diagram.selectionList.length > 0)
                this.updateSelector(diagram.selectionList[0], diagram._adornerSvg, scale, diagram, diagram.model.selectedItems.constraints);
            if (diagram.selectionList[0]) {
                if ((diagram.model.selectedItems.userHandles && diagram.model.selectedItems.userHandles.length > 0)) {
                    var isMultipleSelection = false;
                    if (diagram.selectionList[0].type == "pseudoGroup")
                        isMultipleSelection = true;
                    if (diagram.model.selectedItems.constraints & ej.datavisualization.Diagram.SelectorConstraints.UserHandles)
                        ej.datavisualization.Diagram.SvgContext.updateUserHandles(diagram.model.selectedItems.userHandles, diagram.selectionList[0], diagram._adornerSvg, isMultipleSelection, false, scale, diagram);
                }
            }
            var nodes = diagram.nodes();
            for (var i = 0, len = nodes.length; i < len; ++i) {
                this._updatePortScale(nodes[i], diagram);
            }
        },

        _updatePortScale: function (node, diagram) {
            var children;
            node = diagram.nameTable[diagram._getChild(node)];
            this._updatePorts(node, diagram._adornerSvg, diagram);
            if (node.type != "pseudoGroup") {
                children = node.children;
                if (children && children.length > 0) {
                    for (var j = 0, clen = children.length; j < clen; ++j) {
                        this._updatePortScale(children[j], diagram);
                    }
                }
            }
        },

        setSize: function (diagram, width, height) {
            ej.datavisualization.Diagram.Util.attr(diagram._svg.document, { width: width + "px", height: height + "px" });
            if (!diagram._svgParentDimention) {
                var rulerSize = ej.datavisualization.Diagram.ScrollUtil._getRulerSize(diagram);
                diagram._svgParentDimention = {};
                diagram._svgParentDimention.width = diagram.element.width() - rulerSize.left;
                diagram._svgParentDimention.height = diagram.element.height() - rulerSize.top;
            }
            $(diagram._svgParent).css("width", diagram._svgParentDimention.width + "px").css("height", diagram._svgParentDimention.height + "px");
            ej.datavisualization.Diagram.Util.attr(diagram._adornerSvg.document, { width: width + "px", height: height + "px" });
        },
        //#endregion

        _findIndex: function (diagram, node) {
            var lastNode, newIndex = 1, index, elements;
            if (node.parent)
                elements = $("#" + node.parent.name).find(">.node,>.connector,>.group");
            else
                elements = $("#DiagramContent_canvas_svg").find(">.node,>.connector,>.group");
            if (node.name != "helper") {
                lastNode = elements[elements.length - 1];
                if (lastNode && lastNode.id == "helper")
                    lastNode = elements[elements.length - 2];
                if (lastNode) {
                    index = 0;
                    if (lastNode.className.animVal == "ej-d-node" || lastNode.className.animVal == "ej-d-group") {
                        newIndex = index + 1;
                    }
                    else if (lastNode.className.animVal == "ej-d-connector") {
                        newIndex = index + 1;
                    }
                }
            }
            return newIndex;
        },
        //#region Render Node

        //#region render
        renderNode: function (node, svg, parent, palette, diagram, isoverView) {
            var g;
            // if (node.visible) 
            {
                var g;

                var width = node.width ? node.width : node._width || 0;
                var height = node.height ? node.height : node._height || 0;
                var name = node.name;
                var offX = 0, offY = 0, x = 0, y = 0, rAngle = 0;
                var visible = node.visible && ej.datavisualization.Diagram.Util.enableLayerOption(node, "visible", diagram) ? "visible" : "hidden";
                if (!palette) {
                    x = node.offsetX - width * node.pivot.x;
                    y = node.offsetY - height * node.pivot.y;
                    offX = node.offsetX;
                    offY = node.offsetY;
                    rAngle = node.rotateAngle;
                }
                if (ej.datavisualization.Diagram.Util.canCrispEdges(node, diagram)) {
                    x = Math.floor(x) + 0.5;
                    y = Math.floor(y) + 0.5
                }
                var attr = {
                    "id": name, "class": "ej-d-node", "transform": "rotate(" + rAngle + "," + offX + "," + offY +
                            "),translate(" + x + "," + y + ")", "visibility": visible
                };
                if (!ej.datavisualization.Diagram.Util.canEnablePointerEvents(node, diagram))
                    attr["style"] = "pointer-events:none";
                if (node._isClassifier)
                    attr["class"] += " " + "ej-d-classifier";
                g = svg.g(attr);
                if (parent) {
                    parent.appendChild(g);
                }
                else {
                    svg.appendChild(g);
                }
                if (node._isDisabled)
                    ej.datavisualization.Diagram.Util.attr(g, { "style": "pointer-events:none;" });
                this._renderNode(node, svg, g, diagram, palette, isoverView);
                if (node && node.annotation)
                    ej.datavisualization.Diagram.DefautShapes.renderBPMNAnnotationShape(node, diagram);
            }
            if (node._isClassifier)
                delete node._isClassifier;
            return g;
        },

        _renderNode: function (node, svg, g, diagram, palette, isoverView) {
            this._renderShape(node, svg, g, diagram);
            this._renderLabels(node, svg, diagram, palette);
            this._renderPorts(node, (diagram._adornerSvg && !isoverView) ? diagram._adornerSvg : svg, diagram, isoverView);
            if (node.outEdges.length > 0) {
                this._renderIcons(node, diagram);
            }
        },

        _renderShadow: function (node, svg) {
            if (!node.segments) {

                var g = svg.document.getElementById(node.name);
                if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow) {
                    var fill = node.fillColor;
                    if (node.type === "image" || node.type === "text" || node.type === "html") {
                        var shape = svg.document.getElementById(node.name + "_backRect");
                    }
                    else if (node.type != "text" && node.type != "image") {
                        var shape = svg.document.getElementById(node.name + "_shape");
                    }
                    if (shape) {
                        var point = ej.datavisualization.Diagram.Geometry.transform({ x: 0, y: 0 }, node.shadow.angle, node.shadow.distance);
                        var attr = {
                            "id": node.name + "_shadow", "width": node.width, "height": node.height, "stroke": node.borderColor != "none" || node.borderColor != "transparent" ? "lightgrey" : "none", "fill": fill != "none" || fill != "transparent" ? "lightgrey" : "none",
                            "transform": "translate(" + point.x + "," + point.y + ")", "opacity": node.shadow.opacity, "stroke-dasharray": ""
                        };
                        if (node.type === "native" || node.type === "html")
                            g.insertBefore(svg.rect(attr), shape);
                        else {
                            var shadow = shape.cloneNode(true);
                            g.insertBefore(shadow, shape);
                            ej.datavisualization.Diagram.Util.attr(shadow, attr);
                        }
                    }
                }
            }
        },

        _updateShadow: function (node, svg) {
            var g = svg.document.getElementById(node.name);
            var point = ej.datavisualization.Diagram.Geometry.transform({ x: 0, y: 0 }, node.shadow.angle, node.shadow.distance);
            var attr = { id: node.name + "_shadow", transform: "translate(" + point.x + "," + point.y + ")", opacity: node.shadow.opacity };
            svg.g(attr);

        },
        _deleteLabel: function (node, label, diagram, svg, view) {
            var g;
            if (diagram.model.labelRenderingMode === "html") {
                var htmlLayer = view.svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                var nodeElement = this._findChild(htmlLayer.childNodes, node);
                if (nodeElement) {
                    var length = nodeElement.childNodes.length;
                    for (var i = 0; i < length; i++) {
                        if (nodeElement.childNodes[i].id == node.name + "_" + label.name + "_lblbg") {
                            nodeElement.childNodes[i].parentNode.removeChild(nodeElement.childNodes[i]);
                        }
                    }
                }
            }
            else {
                var label = svg.document.getElementById(node.name + "_" + label.name);
                if (label)
                    label.parentNode.removeChild(label);
            }
        },
        _deletePort: function (node, port, diagram, svg, view) {
            if (node) {
                var port = svg.document.getElementById(node.name + "_" + port.name);
                if (port)
                    port.parentNode.removeChild(port);
            }
        },
        _removeShadow: function (node, svg) {
            if (node.type != "text") {
                var g, shadow, nodeName = node.name;
                if (node.type === "bpmn" && node.children && (node.shape != "group")) {
                    nodeName = node.children[0].name;
                }
                g = svg.document.getElementById(nodeName);
                shadow = svg.document.getElementById(nodeName + "_shadow");
                if (g && shadow) {
                    g.removeChild(shadow);
                }
            }
        },

        _renderphase: function (node, svg, parent, diagram, parNode) {
            var g;
            g = svg.g({ "id": node.name + "_phase_g", "class": "ej-d-seperator" });
            if (node.parent) {
                //parent = svg.getElementById(node.parent);
                //if (parent)
                parent.appendChild(g);
            } else {
                svg.appendChild(g);
            }
            var visibility = "visible";
            var tx = 0, ty = 0;
            if (parNode) {
                var children = diagram._getChildren(parNode.children);
                if (children.length > 1)
                    var header = diagram.nameTable[children[0]];
                var bounds = ej.datavisualization.Diagram.Util.bounds(parNode);
                var points = [], nPoint;
                var top = bounds.top + 50;
                var left = bounds.left + 50;
                if (node.orientation == "vertical") {
                    points.push({ x: 0, y: 0 });
                    points.push({ x: bounds.width, y: 0 });
                    nPoint = this._convertToSVGPoints(points);
                    tx = bounds.x;
                    ty = bounds.y + node.offset + header.height;
                    if (header)
                        top += header.height;
                    if (!(ty < bounds.bottom && ty > top)) {
                        visibility = "hidden";
                    }
                } else {
                    points.push({ x: 0, y: header.height ? header.height : 0 });
                    points.push({ x: 0, y: bounds.height });
                    nPoint = this._convertToSVGPoints(points);
                    tx = bounds.x + node.offset;
                    ty = bounds.y;

                    if (!(tx < bounds.right && tx > left)) {
                        visibility = "hidden";
                    }
                }


                var attr = {
                    "id": node.name + "_phase",
                    "stroke": node.lineColor,
                    "stroke-width": node.lineWidth,
                    "stroke-dasharray": node.lineDashArray,
                    "points": nPoint,
                    //"transform": "translate(" + tx + "," + ty + ")",
                };
                var line = svg.polyline(attr);
                g.appendChild(line);

                attr = {
                    "id": node.name + "_phase_hitTest",
                    "class": "hitTest",
                    "stroke-width": 10,
                    "points": nPoint,
                    //"transform": "translate(" + tx + "," + ty + ")",
                    "stroke": "transparent",

                };
                line = svg.polyline(attr);
                g.appendChild(line);
                g.setAttribute("transform", "translate(" + tx + "," + ty + ")");
            }

        },

        renderphase: function (node, svg, parent, diagram, group) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view._canvas;
                if (parent)
                    parent = panel.document.getElementById(parent.id)
                view.context._renderphase(node, panel, parent || view.diagramLayer, diagram, group);
            });
        },

        _renderGroupBackground: function (group, g, svg, diagram) {
            if (group.fillColor != "none") {
                var x = group.offsetX - group.width * group.pivot.x;
                var y = group.offsetY - group.height * group.pivot.y;
                var fillColor = group.fillColor, borderColor = group.borderColor;
                if ((group.type == "bpmn" && group.shape != "group") || (group.classifier && group.classifier == "package")) {
                    fillColor = "transparent";
                    borderColor = "transparent";
                }
                if (ej.datavisualization.Diagram.Util.canCrispEdges(group, diagram)) {
                    x = Math.floor(x) + 0.5;
                    y = Math.floor(y) + 0.5;
                }
                var angle = group.rotateAngle;
                var pt = new ej.datavisualization.Diagram.Point(x + group.width * group.pivot.x, y + group.height * group.pivot.y);
                var attr = {
                    "id": group.name + "_shape",
                    "rx": group.cornerRadius,
                    "ry": group.cornerRadius,
                    "width": Math.round((group.width < 0) ? 0 : group.width),
                    "height": Math.round((group.height < 0) ? 0 : group.height),
                    "fill": fillColor,
                    "stroke": borderColor,
                    "stroke-width": group.borderWidth,
                    "opacity": group.opacity,
                    "stroke-dasharray": group.borderDashArray,
                    "transform": "rotate(" + angle + "," + pt.x + "," + pt.y + "),translate(" + x + "," + y + ")",
                };
                if (group.type == "umlclassifier" || group._isClassifier)
                    attr["class"] = "ej-d-group" + " " + "ej-d-classifier";
                if (group.gradient && group.type != "bpmn")
                    attr["fill"] = this._renderGradient(group.name, group.gradient, svg);
                this._addCssClass(group, attr);
                var rect = svg.rect(attr);
                g.appendChild(rect);
                if (group.type === "bpmn" && group.shape === "group" && (group.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow)) {
                    var point = ej.datavisualization.Diagram.Geometry.transform({ x: 0, y: 0 }, group.shadow.angle, group.shadow.distance);
                    if (group.shape === "group" && group.children.length === 0) {
                        point.x = (group.offsetX - group.width * group.pivot.x) + point.x;
                        point.y = (group.offsetY - group.height * group.pivot.y) + point.y;
                    }
                    var attr1 = {
                        "id": group.name + "_shadow", "width": group.width, "height": group.height, "stroke": group.borderColor != "none" || group.borderColor != "transparent" ? "lightgrey" : "none", "fill": fillColor != "none" || fillColor != "transparent" ? "lightgrey" : "none",
                        "transform": "translate(" + point.x + "," + point.y + ")", "opacity": group.shadow.opacity, "stroke-dasharray": ""
                    };
                    var shadow = rect.cloneNode(true);
                    g.insertBefore(shadow, rect);
                    ej.datavisualization.Diagram.Util.attr(shadow, attr1);

                }

            }
        },

        renderGroup: function (group, svg, parent, nameTable, diagram, isLoad, overView) {
            var g;
            var visible = group.visible && ej.datavisualization.Diagram.Util.enableLayerOption(group, "visible", diagram) ? "visible" : "hidden";
            //if (group.visible) 
            {
                var attr = { "id": group.name, "class": "ej-d-group", "visibility": visible };
                if (!ej.datavisualization.Diagram.Util.canEnablePointerEvents(group, diagram))
                    attr["style"] = "pointer-events:none";
                if (group.type == "umlclassifier" || group._isClassifier)
                    attr["class"] += " " + "ej-d-classifier";
                g = svg.g(attr);
                if (parent) {
                    parent.appendChild(g);
                } else {
                    svg.appendChild(g);
                }
                if (group.parent == "" && group.container) {
                    if (isLoad) {
                        group.height = 0;
                        group.width = 0;
                    }
                    if (!overView) {
                        diagram._updateChildAdjacentConnectors(group);
                    }
                }
                this._renderGroupBackground(group, g, svg, diagram);
                if (group.isSwimlane)
                    diagram._disableSwimlaneUptate = true;
                var children = group.children;
                if (children && children.length > 0) {
                    for (var i = 0, len = children.length; i < len; i++) {
                        var child = nameTable[ej.datavisualization.Diagram.Util.getChild(children[i])];
                        if (child) {
                            if (child._type === "group") {
                                if (group.type == "umlclassifier")
                                    child._isClassifier = true;
                                this.renderGroup(child, svg, g, nameTable, diagram, isLoad, overView);
                                ej.datavisualization.Diagram.Util._updateGroupBounds(child, diagram, true);
                                ej.datavisualization.Diagram.DiagramContext.update(child, diagram);
                            }
                            else if (child.segments) {
                                ej.datavisualization.Diagram.Util.updateBridging(child, diagram);
                                this.renderConnector(child, svg, g, diagram);
                            }
                            else {
                                if (group.type == "umlclassifier")
                                    child._isClassifier = true;
                                this.renderNode(child, svg, g, undefined, diagram, overView);
                                if (child._isService) {
                                    var child1 = $.extend(true, {}, child);
                                    child1.name = child.name + "service";
                                    child1.offsetX = child.offsetX + 7;
                                    child1.offsetY = child.offsetY + 5;
                                    this.renderNode(child1, svg, g, undefined, diagram, overView);
                            }
                        }
                    }
                }
                }
                this._renderLabels(group, svg, diagram);
                this._renderPorts(group, (diagram._adornerSvg && !overView) ? diagram._adornerSvg : svg, diagram, overView);
                if (group.isSwimlane)
                    delete diagram._disableSwimlaneUptate;
            }
            if (group && group.annotation)
                ej.datavisualization.Diagram.DefautShapes.renderBPMNAnnotationShape(group, diagram);
            if (group && group.isSwimlane) {
                var view, panel, parent;
                var phases = ej.datavisualization.Diagram.SwimLaneContainerHelper.getPhases(diagram, group);
                diagram._views.forEach(function (viewid) {
                    view = diagram._views[viewid];
                    panel = view.svg || view._canvas;
                    if (parent)
                        parent = panel.document.getElementById(parent.id)
                    for (var i = 0; phases && i < phases.length; i++) {
                        var node = diagram.nameTable[diagram._getChild(phases[i])];
                        if (node)
                            view.context._renderphase(node, panel, parent || view.diagramLayer, diagram, group);
                    }
                });
            }
            if (group._isClassifier)
                delete group._isClassifier;
            return g;
        },


        _renderGradient: function (name, gradient, svg) {

            var fill;
            var id;
            if (gradient.type === "linear") {
                id = this._renderLinearGradient(svg.id + "_" + name, gradient, svg);
                fill = "url(#" + id + ")";
            }
            else if (gradient.type === "radial") {
                id = this._renderRadialGradient(svg.id + "_" + name, gradient, svg);
                fill = "url(#" + id + ")";
            }
            return fill;
        },

        _checkGradientTag: function (name, svg, linear) {
            if (svg.getElementById(name + "_gradient")) {
                var gradTag = svg.getElementById(name + "_gradient")
                if ((linear && gradTag.localName === "radialGradient") || (!linear && gradTag.localName === "linearGradient"))
                    gradTag.parentNode.removeChild(gradTag);
            }
        },
        _renderLinearGradient: function (name, gradient, svg) {
            var defs = svg.document.getElementById(svg.document.parentNode.parentNode.id + "patterndefinition") || svg.document.getElementById(name + "patterndefinition");
            if (defs) {
                this._checkGradientTag(name, svg, true);
                var attr = { "id": name + "_gradient", "x1": gradient.x1 + "%", "y1": gradient.y1 + "%", "x2": gradient.x2 + "%", "y2": gradient.y2 + "%" };
                var linear = svg.linearGradient(attr);
                this._renderStops(gradient, svg, linear);
                defs.appendChild(linear);
                return linear.id;
            }
            return null;
        },

        _renderRadialGradient: function (name, gradient, svg) {
            var defs = svg.document.getElementById($(svg.document).parents()[1].id + "patterndefinition") || svg.document.getElementById(name + "patterndefinition");
            if (defs) {
                this._checkGradientTag(name, svg, false);
                var attr = {
                    "id": name + "_gradient", "cx": gradient.cx + "%", "cy": gradient.cy + "%",
                    "fx": gradient.fx + "%", "fy": gradient.fy + "%", "r": gradient.r + "%"
                };
                var radial = svg.radialGradient(attr);
                this._renderStops(gradient, svg, radial);
                defs.appendChild(radial);
                return radial.id;
            }
            return null;
        },

        _renderStops: function (gradient, svg, element) {
            if (svg.getElementById(element.getAttribute("id")) === element) {
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
            }
            var stops = gradient.stops;
            var stop;
            for (var i = 0, len = stops.length; i < len; i++) {
                stop = stops[i];
                element.appendChild(svg.stop({ "offset": stop.offset + "%", "stop-color": stop.color, "stop-opacity": stop.opacity }));
            }
        },

        _renderShape: function (node, svg, g, diagram) {
            var type = node._shape ? node._shape : node.type;
            switch (type) {
                case "rectangle":
                    this._renderRect(node, svg, g);
                    break;
                case "ellipse":
                    this._renderEllipse(node, svg, g);
                    break;
                case "image":
                    this._renderImage(node, svg, g);
                    break;
                case "path":
                    this._renderPath(node, svg, g);
                    break;
                case "polygon":
                    this._renderPolygon(node, svg, g);
                    break;
                case "text":
                    this._renderTextElement(node, svg, g, diagram);
                    break;
                case "html":
                    this._renderHtmlElement(node, svg, g, diagram);
                    break;
                case "native":
                    this._rendercontent(node, svg, g, diagram);
                    break;
            }
        },

        _renderHTMLTemplate: function (node, diagram) {
            if (node.templateId && $.templates) {
                return diagram._renderEjTemplate("#" + node.templateId, node);
            }
        },

        _renderSvgTemplate: function (node, svg, g, html) {
            var div = document.createElement('div');
            div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><g id="tempNative">' + html + '</g></svg>';
            document.body.appendChild(div);
            var tempContent = document.getElementById("tempNative");
            var content = tempContent.cloneNode(true);
            content.id = node.name + "_shape";
            g.appendChild(content);
            var attr = {
                "id": node.name + "_shape",
                "fill": node.fillColor, "stroke": node.borderColor,
                "stroke-width": node.borderWidth, "opacity": node.opacity, "stroke-dasharray": node.borderDashArray
            };
            this._addCssClass(node, attr);
            if (node.gradient)
                attr["fill"] = this._renderGradient(node.name, node.gradient, svg);
            svg.g(attr);
            var object = this._scaleNodeContent(node, tempContent);
            if (object)
                content.setAttribute("transform", "translate(" + object.x + "," + object.y + "),scale(" + object.sx + "," + object.sy + ")");
            content.setAttribute("id", node.name + "_shape");
            div.parentNode.removeChild(div);
        },

        _scaleNodeContent: function (node, content) {
            if (node.scale != "none") {
                if (content)
                    var bounds = node.type == "html" ? content.getBoundingClientRect() : content.getBBox();
                if (node.type == "html") { bounds.x = bounds.left; bounds.y = bounds.top };
                var width = node.width ? node.width : node._width;
                var height = node.height ? node.height : node._height;
                if (!content) var bounds = { x: node.offsetX - node.width * node.pivot.x, y: node.offsetY - node.height * node.pivot.y, width: width, height: height };
                var proportionX = bounds.width ? width / bounds.width : 1;
                var proportionY = bounds.height ? height / bounds.height : 1;
                var x = ((bounds.x * proportionX) * -1);
                var y = ((bounds.y * proportionY) * -1);
                if (node.scale != "stretch" && node.contentAlignment != "none") {
                    var proportion = node.scale == "meet" ? Math.min(proportionX, proportionY) : Math.max(proportionX, proportionY);
                    if (node.contentAlignment.indexOf("xmid") > -1) {
                        x = width / 2 - bounds.width * proportion / 2;
                    }
                    else if (node.contentAlignment.indexOf("xmax") > -1) {
                        x = bounds.x + width - bounds.width * proportion;
                    }
                    if (node.contentAlignment.indexOf("ymid") > -1) {
                        y = bounds.y + height / 2 - bounds.height * proportion / 2;
                    }
                    else if (node.contentAlignment.indexOf("ymax") > -1) {
                        y = bounds.y + height - bounds.height * proportion;
                    }
                    return { x: x, y: y, sx: proportion, sy: proportion };
                }
                return { x: x, y: y, sx: proportionX, sy: proportionY };
            }
            return null;
        },
        _rendercontent: function (node, svg, g, diagram) {
            if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow) {
                var fill = node.fillColor;
                var point = ej.datavisualization.Diagram.Geometry.transform({ x: 0, y: 0 }, node.shadow.angle, node.shadow.distance);
                var shadow = {
                    "id": node.name + "_shadow", "width": node.width, "height": node.height, "stroke": node.borderColor != "none" || node.borderColor != "transparent" ? "lightgrey" : "none", "fill": fill != "none" || fill != "transparent" ? "lightgrey" : "none",
                    "transform": "translate(" + point.x + "," + point.y + ")", "opacity": node.shadow.opacity
                };
                g.appendChild(svg.rect(shadow));
            }

            if (!node.segments && node.templateId && $.templates) {
                var width = node.width;
                var height = node.height;
                if (node._type === "node" && !node.height && !node.width) {
                    node.width = node._width;
                    node.height = node._height;
                }
                var html = diagram._renderEjTemplate("#" + node.templateId, node);
                node.width = width;
                node.height = height;
                this._renderSvgTemplate(node, svg, g, html);
            }
        },

        _fill: function (node, svg) {
            var fill;
            if (node.gradient) {
                fill = this._renderGradient(node.name, node.gradient, svg);
            }
            if (!fill) {
                fill = node.fillColor;
            }
            return fill;
        },

        _addCssClass: function (object, attr) {
            if (object.cssClass) {
                if (attr) {
                    if (attr["class"])
                        attr["class"] = attr["class"] + " " + object.cssClass;
                    else
                        attr["class"] = object.cssClass;
                }
            }
            object._cssClass = object.cssClass;
            return attr;
        },

        _updateCssClass: function (object, attr) {
            if ((object._cssClass != "" || (object._cssClass === "" && object.cssClass !== "")) && object._cssClass !== undefined && object.cssClass != object._cssClass) {
                var classTmp = attr["class"];
                if (classTmp)
                    attr["class"] = classTmp.replace(object._cssClass, "").trim();
                return this._addCssClass(object, attr);
            }
            return attr;
        },

        _renderRect: function (node, svg, g) {
            var fill = this._fill(node, svg);
            var width = node.width ? node.width : node._width;
            var height = node.height ? node.height : node._height;
            var attr = {
                "id": node.name + "_shape", "rx": node.cornerRadius, "ry": node.cornerRadius, "role": "presentation",
                "width": width, "height": height, "fill": fill, "stroke": node.borderColor,
                "stroke-width": node.borderWidth, "opacity": node.opacity, "stroke-dasharray": node.borderDashArray
            };
            if (node._isClassifier)
                var class1 = "ej-d-node" + " " + "ej-d-classifier";
            attr["class"] = class1;
            this._addCssClass(node, attr);
            if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow) {
                var point = ej.datavisualization.Diagram.Geometry.transform({ x: 0, y: 0 }, node.shadow.angle, node.shadow.distance);
                var shadow = {
                    "id": node.name + "_shadow", "rx": node.cornerRadius, "ry": node.cornerRadius,
                    "width": node.width, "height": node.height, "stroke": node.borderColor != "none" || node.borderColor != "transparent" ? "lightgrey" : "none", "fill": fill != "none" || fill != "transparent" ? "lightgrey" : "none",
                    "transform": "translate(" + point.x + "," + point.y + ")", "opacity": node.shadow.opacity
                };
                g.appendChild(svg.rect(shadow));
            }
            g.appendChild(svg.rect(attr));
        },

        _renderEllipse: function (node, svg, g) {
            var width = node.width ? node.width : node._width;
            var height = node.height ? node.height : node._height;
            var fill = this._fill(node, svg);
            var attr = {
                "id": node.name + "_shape", "rx": width / 2, "ry": height / 2, "role": "presentation",
                "cx": width / 2, "cy": height / 2,
                "fill": fill, "stroke": node.borderColor, "stroke-width": node.borderWidth,
                "opacity": node.opacity, "stroke-dasharray": node.borderDashArray

            };
            this._addCssClass(node, attr);
            if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow) {
                var point = ej.datavisualization.Diagram.Geometry.transform({ x: 0, y: 0 }, node.shadow.angle, node.shadow.distance);
                var shadow = {
                    "id": node.name + "_shadow", "rx": node.width / 2, "ry": node.height / 2,
                    "cx": node.width / 2, "cy": node.height / 2, "stroke": node.borderColor != "none" || node.borderColor != "transparent" ? "lightgrey" : "none", "fill": fill != "none" || fill != "transparent" ? "lightgrey" : "none",
                    "transform": "translate(" + point.x + "," + point.y + ")", "opacity": node.shadow.opacity
                };
                g.appendChild(svg.ellipse(shadow));
            }
            g.appendChild(svg.ellipse(attr));
        },

        _renderImage: function (node, svg, g) {
            var fill = node.fillColor;
            var backRect = this._renderBackgroundRect(node, svg, g);
            var width = node.width ? node.width : node._width;
            var height = node.height ? node.height : node._height;
            var alignment = ej.datavisualization.Diagram.Util._getImageAlignment(node.contentAlignment);
            var scale = node.scale == "none" ? "meet" : node.scale;
            var attr = {
                "id": node.name + "_shape",
                "opacity": node.opacity, "preserveAspectRatio": (scale != "stretch" && alignment != "none" ? alignment + " " + scale : "none"),
                "width": width, "height": height, "role": "img",
            };
            var image = new Image();
            image.src = node.source;
            if (node.scale == "none") {
                attr["width"] = image.width || width; attr["height"] = image.height || height;
            }
            var shape = svg.image(attr);
            shape.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", image.src);
            g.appendChild(shape);
        },

        _renderPolygon: function (node, svg, g) {
            var fill = this._fill(node, svg);
            ej.datavisualization.Diagram.Geometry.updatePolygonPoints(node);
            var points = this._convertToSVGPoints(node.points);
            var attr = {
                "id": node.name + "_shape", "fill": fill, "stroke": node.borderColor, "role": "presentation",
                "stroke-width": node.borderWidth, "opacity": node.opacity,
                "stroke-dasharray": node.borderDashArray, "points": points
            };
            this._addCssClass(node, attr);
            if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow) {
                var point = ej.datavisualization.Diagram.Geometry.transform({ x: 0, y: 0 }, node.shadow.angle, node.shadow.distance);
                var shadow = {
                    "id": node.name + "_shadow", "points": points, "stroke": node.borderColor != "none" || node.borderColor != "transparent" ? "lightgrey" : "none", "fill": fill != "none" || fill != "transparent" ? "lightgrey" : "none",
                    "transform": "translate(" + point.x + "," + point.y + ")", "opacity": node.shadow.opacity
                };
                g.appendChild(svg.polygon(shadow));
            }
            g.appendChild(svg.polygon(attr));
        },

        _renderPath: function (node, svg, g) {
            var fill = this._fill(node, svg);
            var width = node.width ? node.width : node._width;
            var height = node.height ? node.height : node._height;
            var d;
            if (!node._preventStretch && !node._polyline)
                node._absolutePath = d = ej.datavisualization.Diagram.Geometry.updatePath(0, 0, width, height, node.pathData, svg, null, node);
            else node._absolutePath = d = node.pathData;
            var attr = {
                "id": node.name + "_shape",
                "d": d, "opacity": node.opacity, "role": "presentation",
                "stroke-dasharray": node.borderDashArray, "stroke": node.borderColor,
                "stroke-width": node.borderWidth, "fill": fill

            };
            if (node._isClassifier)
                attr["class"] = "ej-d-node" + " " + "ej-d-classifier";
            this._addCssClass(node, attr);
            if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow) {
                var point = ej.datavisualization.Diagram.Geometry.transform({ x: 0, y: 0 }, node.shadow.angle, node.shadow.distance);
                var shadow = {
                    "id": node.name + "_shadow", "width": node.width,
                    "height": node.height, "d": d, "stroke": node.borderColor != "none" || node.borderColor != "transparent" ? "lightgrey" : "none", "fill": fill != "none" || fill != "transparent" ? "lightgrey" : "none",
                    "transform": "translate(" + point.x + "," + point.y + ")", "opacity": node.shadow.opacity
                };
                g.appendChild(svg.path(shadow));
            }
            g.appendChild(svg.path(attr));
        },

        _renderHtmlElement: function (node, svg, g, diagram) {
            var backRect = this._renderBackgroundRect(node, svg, g);
            if (!node.segments && node.templateId) {
                var htmlLayer = svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                var element = $(htmlLayer).children("#" + node.name + "_parentdiv")[0];
                if (element) htmlLayer.removeChild(element);
                var width = node.width ? node.width : node._width;
                var height = node.height ? node.height : node._height;
                var x = node.offsetX - width * node.pivot.x;
                var y = node.offsetY - height * node.pivot.y;
                var div = svg.document.getElementById(node.name + "_html")
                if (!div)
                    var div = document.createElement("div");
                var style = "width:" + width + "px;height:" + height + "px;padding:1px; left:" + x + "px; top:" + y + "px;position:absolute;";
                style += "display: block; border:0px; pointer-events: all; opacity:" + node.opacity + ";";
                style += "transform:" + "rotate(" + node.rotateAngle + "deg)";
                var attr = { "id": node.name + "_html", "class": "foreignObject", "style": style };
                this._addCssClass(node, attr);
                ej.datavisualization.Diagram.Util.attr(div, attr);
                if (!node.segments && node.templateId) {
                    var tmplString = this._renderHTMLTemplate(node, diagram)
                    div.innerHTML = tmplString;
                }
                var parentdiv = document.createElement("div");
                var attr1 = { "id": node.name + "_parentdiv", "class": "ej-d-node" };
                ej.datavisualization.Diagram.Util.attr(parentdiv, attr1);
                parentdiv.appendChild(div);
                var visibility = node.visible ? "visible" : "hidden";
                parentdiv.style.visibility = visibility;
                var htmlLayer = svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                if (htmlLayer)
                    htmlLayer.appendChild(parentdiv);
                else
                    svg.document.parentNode.appendChild(div);
            }
        },

        _initializeGuidelines: function (svg, attr, parent) {
            var g = svg.g(attr);
            parent.appendChild(g);
            return g;
        },

        _renderSideAlignmentLines: function (start, end, g, svg, scale) {
            var line = svg.line({
                "x1": start.x * scale, "y1": start.y * scale,
                "x2": end.x * scale, "y2": end.y * scale, "stroke": "#07EDE1", "stroke-width": 1
            });
            g.appendChild(line);
        },

        _renderCenterAlignmentLines: function (start, end, g, svg, scale) {
            var line = svg.line({
                "x1": start.x * scale, "y1": start.y * scale,
                "x2": end.x * scale, "y2": end.y * scale, "stroke": "#07EDE1", "stroke-width": 1,
            });
            g.appendChild(line);
        },

        _renderSpacingLines: function (start, end, g, svg, scale) {
            if (g) {
                var d, d1;
                var div1 = svg.g({});
                if (start.x == end.x) {
                    d = "M" + (start.x * scale - 5) + " " + (start.y * scale + 5) + " L" + start.x * scale + " " + start.y * scale + " L" + (start.x * scale + 5) + " " + (start.y * scale + 5) + "z";
                    d1 = "M" + (end.x * scale - 5) + " " + (end.y * scale - 5) + " L" + end.x * scale + " " + end.y * scale + " L" + (end.x * scale + 5) + " " + (end.y * scale - 5) + "z";
                    div1.appendChild(svg.line({ "x1": start.x * scale - 8, "x2": start.x * scale + 8, "y1": start.y * scale - 1, "y2": start.y * scale - 1, "stroke": "#07EDE1", "stroke-width": 1 }));
                    div1.appendChild(svg.line({ "x1": end.x * scale - 8, "x2": end.x * scale + 8, "y1": end.y * scale + 1, "y2": end.y * scale + 1, "stroke": "#07EDE1", "stroke-width": 1 }));
                }
                else {
                    d = "M" + (start.x * scale + 5) + " " + (start.y * scale + 5) + " L" + start.x * scale + " " + start.y * scale + " L" + (start.x * scale + 5) + " " + (start.y * scale - 5) + "z";
                    d1 = "M" + (end.x * scale - 5) + " " + (end.y * scale - 5) + " L" + end.x * scale + " " + end.y * scale + " L" + (end.x * scale - 5) + " " + (end.y * scale + 5) + "z";
                    div1.appendChild(svg.line({ "x1": start.x * scale - 1, "x2": start.x * scale - 1, "y1": start.y * scale - 8, "y2": start.y * scale + 8, "stroke": "#07EDE1", "stroke-width": 1 }));
                    div1.appendChild(svg.line({ "x1": end.x * scale + 1, "x2": end.x * scale + 1, "y1": end.y * scale - 8, "y2": end.y * scale + 8, "stroke": "#07EDE1", "stroke-width": 1 }));
                }
                div1.appendChild(svg.path({ "d": d, "fill": "#07EDE1" }));
                var line = svg.line({
                    "x1": start.x * scale, "y1": start.y * scale,
                    "x2": end.x * scale, "y2": end.y * scale, "stroke": "#07EDE1", "stroke-width": 0.6, "fill": "#07EDE1"
                });
                div1.appendChild(line);
                div1.appendChild(svg.path({ "d": d1, "fill": "#07EDE1" }));
                g.appendChild(div1);
            }
        },

        _removeGuidelines: function (parent, g) {
            if (g != null) {
                parent.removeChild(g);
            }
        },

        //#endregion

        //#region update
        update: function (data, diagram) {
            if (diagram && !diagram._isInit && data._status !== "new")
                data._status = "update";
            var svg = diagram._svg;
            if (data._type === "group")
                this.updateGroup(data, svg, diagram);
            else if (data.segments)
                this.updateConnector(data, svg, diagram);
            else
                this.updateNode(data, svg, diagram);
        },

        _updateGoupBackground: function (group, svg, diagram) {
            var x = group.offsetX - group.width * group.pivot.x;
            var y = group.offsetY - group.height * group.pivot.y;
            var angle = group.rotateAngle;
            var pt = new ej.datavisualization.Diagram.Point(x + group.width * group.pivot.x, y + group.height * group.pivot.y);
            var fillColor = group.fillColor, borderColor = group.borderColor;
            var nodeConstraints = ej.datavisualization.Diagram.NodeConstraints;
            if ((group.type == "bpmn" && group.shape != "group") || (group.classifier && group.classifier == "package")) {
                fillColor = "transparent";
                borderColor = "transparent";
            }
            if (ej.datavisualization.Diagram.Util.canCrispEdges(group, diagram)) {
                x = Math.floor(x) + 0.5;
                y = Math.floor(y) + 0.5;
            }
            var attr = {
                "id": group.name + "_shape",
                "rx": group.cornerRadius,
                "ry": group.cornerRadius,
                "width": Math.round((group.width < 0) ? 0 : group.width),
                "height": Math.round((group.height < 0) ? 0 : group.height),
                "fill": fillColor,
                "stroke": borderColor,
                "stroke-width": group.borderWidth,
                "opacity": group.opacity,
                "stroke-dasharray": group.borderDashArray,
                "transform": "rotate(" + angle + "," + pt.x + "," + pt.y + "),translate(" + x + "," + y + ")",
            };
            if (group.shape === "group" && (group.constraints & nodeConstraints.Shadow)) {
                var shadow = svg.document.getElementById(group.name + "_shadow");
                var point = ej.datavisualization.Diagram.Geometry.transform({ x: 0, y: 0 }, group.shadow.angle, group.shadow.distance);
                x = (group.offsetX - group.width * group.pivot.x) + point.x;
                y = (group.offsetY - group.height * group.pivot.y) + point.y;
                var attr1 = {
                    "id": group.name + "_shadow", "width": group.width, "height": group.height, "stroke": group.borderColor != "none" || group.borderColor != "transparent" ? "lightgrey" : "none",
                    "transform": "translate(" + x + "," + y + ")", "opacity": group.shadow.opacity, "stroke-dasharray": ""
                };
                if (shadow)
                    ej.datavisualization.Diagram.Util.attr(shadow, attr1);
            }
            if (group.gradient && group.type != "bpmn")
                attr["fill"] = this._renderGradient(group.name, group.gradient, svg);
            var element = svg.getElementById(group.name + "_shape");
            if (element) {
                attr["class"] = element.getAttribute("class");
                this._updateCssClass(group, attr);
                ej.datavisualization.Diagram.Util.attr(element, attr);
            }
        },

        updateGroup: function (group, svg, diagram, layout, isoverView) {
            var children = diagram._getChildren(group.children);
            var visible = group.visible && ej.datavisualization.Diagram.Util.enableLayerOption(group, "visible", diagram) ? "visible" : "hidden";
            var style = "display:block;"
            if (!(group.visible))
                style = "display:none;"
            if (!ej.datavisualization.Diagram.Util.canEnablePointerEvents(group, diagram))
                style = "pointer-events:none";

            svg.g({ "id": group.name, "visibility": visible, "style": style });
            for (var i = 0, len = children.length; i < len; i++) {
                var child = diagram.nameTable[children[i]];
                if (child) {
                    if (child._type === "group")
                        this.updateGroup(child, svg, diagram, layout, isoverView);
                    else if (child.segments) {
                        ej.datavisualization.Diagram.Util.updateBridging(child, diagram);
                        this.updateConnector(child, svg, diagram);
                    }
                    else {
                        this.updateNode(child, svg, diagram, layout, isoverView);
                        if (child._isService) {
                            var child1 = $.extend(true, {}, child);
                            child1.name = child.name + "service";
                            child1.offsetX = child.offsetX + 7;
                            child1.offsetY = child.offsetY + 5;
                            this.updateNode(child1, svg, diagram, layout, isoverView);
                }
            }
                }
            }
            svg.g({ "id": group.name, "visibility": visible, "style": style });
            this._updateGoupBackground(group, svg, diagram);

            this._updateAssociatedConnector(group, svg, diagram);
            this._updateLabels(group, svg, diagram);
            this._updatePorts(group, (diagram._adornerSvg && !isoverView) ? diagram._adornerSvg : svg, diagram, isoverView);
            if (group.isSwimlane) {
                var phases = ej.datavisualization.Diagram.SwimLaneContainerHelper.getPhases(diagram, group);
                var phase = null;
                if (phases && phases.length > 0) {
                    for (var j = 0; j < phases.length; j++) {
                        phase = diagram.nameTable[diagram._getChild(phases[j])];
                        if (phase)
                            this._updatephase(phase, diagram, group);
                        this._updatePhaseStyle(phase,{}, diagram)
                    }
                }
            }
        },

        _removephases: function (group, diagram) {
            if (group.isSwimlane) {
                var phases = ej.datavisualization.Diagram.SwimLaneContainerHelper.getPhases(diagram, group);
                if (phases) {
                    for (var j = phases.length ; j >= 0; j--) {
                        var phase = diagram.nameTable[diagram._getChild(phases[j])];
                        this._removePhase(diagram, phase);
                    }
                }
            }
        },
        _removePhase: function (diagram, phase) {
            if (phase) {
                diagram._views.forEach(function (viewid) {
                    var view = diagram._views[viewid];
                    var panel = view.svg || view._canvas;
                    var element = panel.document.getElementById(phase.name + "_phase_g");
                    if (element)
                        element.parentNode.removeChild(element);
                });
            }
        },
        _updatePhaseStyle: function (phase, options, diagram) {
            if (phase && options) {
                var visible = phase.visible && ej.datavisualization.Diagram.Util.enableLayerOption(phase, "visible", diagram) ? "visible" : "hidden";
                diagram._svg.g({ "id": phase.name + "_phase_g", "visibility": visible });
                options.id = phase.name + "_phase";
                diagram._svg.g(options);
            }
        },

        _updatephase: function (node, diagram, group) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view._canvas;
                view.context._updatephase1(node, diagram, panel, group);
            });
        },

        _updatephase1: function (node, diagram, svg, parNode) {
            svg = svg ? svg : diagram._svg;

            if (parNode) {
                var tx = 0, ty = 0, transform = null;
                var points = [], nPoint;
                var bounds = ej.datavisualization.Diagram.Util.bounds(parNode);
                var children = diagram._getChildren(parNode.children);
                if (children.length > 1)
                    var header = diagram.nameTable[children[0]];
                var top = bounds.top + 50;
                var left = bounds.left + 50;
                var visibility = "visible";
                if (node.orientation == "vertical") {
                    tx = bounds.x;
                    ty = bounds.y + header.height + node.offset;
                    if (header)
                        top += header.height;
                    if (ty - .1 <= bounds.bottom && ty - .1 >= top) {
                        transform = "translate(" + tx + "," + ty + ")";
                    }
                    points.push({ x: 0, y: 0 });
                    points.push({ x: bounds.width, y: 0 });
                    nPoint = this._convertToSVGPoints(points);
                }
                else {
                    tx = bounds.x + node.offset;
                    ty = bounds.y;
                    if (tx - .1 <= bounds.right && tx - .1 > left) {
                        transform = "translate(" + tx + "," + ty + ")";
                    }
                    if (header) {
                        points.push({ x: 0, y: header.height });
                        points.push({ x: 0, y: bounds.height });
                    }
                    nPoint = this._convertToSVGPoints(points);
                }

                var attr = {
                    "points": nPoint,
                    "id": node.name + "_phase",
                };
                svg.polyline(attr);
                attr = {
                    "points": nPoint,
                    "id": node.name + "_phase_hitTest",
                };
                svg.polyline(attr);
                if (transform)
                    attr = {
                        "id": node.name + "_phase_g",
                        "transform": transform,
                        //"visibility": visibility
                    }
                if (node.label && diagram.model.labelRenderingMode != ej.datavisualization.Diagram.LabelRenderingMode.Svg) {
                    this._updatePhaseLabel(node, node.label, diagram)
                }
                svg.g(attr);
                if (svg.getElementById(attr.id))
                    $('#' + attr.id).insertAfter($('#' + attr.id)[0].parentNode.lastChild);
            }
        },
        _updatePhaseLabel: function (node, label, diagram) {
            var svg = diagram._svg;
            var bounds = diagram._getPhaseBounds(node);
            var text = svg.getElementById(node.name + "_" + label.name);
            if (text) {
                text.setAttribute("fill", label.fontColor);
                if (!label.text)
                    return;
                text.textContent = label.text;
                var bounds = ej.datavisualization.Diagram.Util.bounds(node);
                this._wrapText(node, bounds, text, label, svg);
                this._alignTextOnPhase(node, bounds, text, label, svg);
            }
        },
        updateLabelStyle: function (node, label, svg, diagram) {
            if (!label.templateId) {
                if (diagram && diagram.model.labelRenderingMode == ej.datavisualization.Diagram.LabelRenderingMode.Svg) {
                    var attr = {
                        "id": node.name + "_" + label.name + "_lblbg",
                        "fill": label.fillColor,
                        "stroke": label.borderColor, "stroke-width": label.borderWidth,
                        "pointer-events": "none",
                        "visibility": label.visible && ej.datavisualization.Diagram.Util.enableLayerOption(node, "visible", diagram) ? "visible" : "hidden",
                        "fill-opacity": label.opacity,
                        "stroke-opacity": label.opacity,
                    };
                    svg.rect(attr);

                    attr = {
                        "id": node.name + "_" + label.name,
                        "class": "ej-d-label", "font-family": label.fontFamily,
                        "font-size": label.fontSize, "fill": label.fontColor,
                        "text-decoration": label.textDecoration,
                        "font-weight": label.bold ? "bold" : "normal",
                        "font-style": label.italic ? "italic" : "normal",
                        "visibility": label.visible && ej.datavisualization.Diagram.Util.enableLayerOption(node, "visible", diagram) ? "visible" : "hidden",
                        "fill-opacity": label.opacity,
                        "stroke-opacity": label.opacity,
                    };
                    var text = svg.text(attr);

                    attr["class"] = text.getAttribute("class");
                    this._updateCssClass(label, attr);
                    ej.datavisualization.Diagram.Util.attr(text, attr);

                }
                else {
                    var htmlLayer = svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                    var text = $(htmlLayer).find("#" + node.name + "_" + label.name)[0];
                    if (node && text && label && !label.templateId) {
                        if (label.bold) text.style.fontWeight = "bold"; else text.style.fontWeight = "";
                        if (label.italic) text.style.fontStyle = "italic"; else text.style.fontStyle = "";
                        if (label.visible) text.style.visibility = ""; else text.style.visibility = "hidden";
                        text.style.opacity = label.opacity;
                        text.style.textDecoration = label.textDecoration;
                        text.style.fontFamily = label.fontFamily;
                        text.style.fontSize = label.fontSize + "px";
                        text.style.color = label.fontColor;
                        text.style.backgroundColor = label.fillColor;
                        text.style.borderColor = label.borderColor;
                        text.style.borderWidth = label.borderWidth + "px";
                        text.style.borderStyle = "solid";
                        if (node._isHeader) {
                            text.style.borderWidth = 0 + "px";
                            text.style.backgroundColor = "transparent";
                        }
                        var attr = this._updateCssClass(label, { "class": text.className });
                        if (attr)
                            text.className = attr["class"];
                    }
                }
            }
            else {
                if (diagram && diagram.model.labelRenderingMode !== ej.datavisualization.Diagram.LabelRenderingMode.Svg) {
                    var htmlLayer = svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                    var text = $(htmlLayer).find("#" + node.name + "_" + label.name)[0];
                    if (node && text && label) {
                        text.style.opacity = label.opacity;
                        if (label.visible) text.style.visibility = ""; else text.style.visibility = "hidden";
                    }
                }
            }
        },

        updatePort: function (node, port, svg, diagram) {
            var portshape = svg.getElementById(node.name + "_" + port.name);
            if (portshape) {
                if (portshape && portshape.parentNode)
                    portshape.parentNode.removeChild(portshape);
                var g = svg.getElementById(node.name + "_ej_ports");;
                portshape = ej.datavisualization.Diagram.SvgContext._renderPort(node, port, diagram._adornerSvg, diagram);
                g.appendChild(portshape);
            }

        },

        _updateNodeStyle: function (node, svg) {
            if (node && svg) {
                var attr = {};
                attr["opacity"] = node.opacity;
                attr["fill"] = node.fillColor;
                attr["stroke"] = node.borderColor;
                attr["stroke-width"] = node.borderWidth;
                attr["stroke-dasharray"] = node.borderDashArray;
                if (node.gradient)
                    attr["fill"] = this._renderGradient(node.name, node.gradient, svg);
                if (node._type == "node") {
                    var type = node.type == "text" || node.type == "html" ? "_backRect" : "_shape";
                    if (node.type == "html") {
                        var htmlLayer = svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                        var element = $(htmlLayer).children("#" + node.name + "_parentdiv")[0].childNodes[0];
                        if (element) {
                            element.style.opacity = node.opacity;
                        }
                    }
                    var element = svg.getElementById(node.name + type);
                    if (element) {
                        attr["class"] = element.getAttribute("class");
                        this._updateCssClass(node, attr);
                        ej.datavisualization.Diagram.Util.attr(element, attr);
                    }

                    if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow) {
                        var shadow = svg.document.getElementById(node.name + "_shadow");
                        if (shadow)
                            ej.datavisualization.Diagram.Util.attr(shadow, { "fill": node.fillColor != "none" || node.fillColor != "transparent" ? "lightgrey" : "none" });
                    }
                }
            }
        },

        _updateConnectorStyle: function (connector, svg) {
            if (connector && svg) {
                var attr = {};
                attr["opacity"] = connector.opacity;
                attr["stroke"] = connector.lineColor;
                attr["stroke-width"] = connector.lineWidth;
                attr["stroke-dasharray"] = connector.lineDashArray;
                var element = svg.getElementById(connector.name + "_segments");
                if (element) {
                    attr["class"] = element.getAttribute("class");
                    this._updateCssClass(connector, attr);
                    ej.datavisualization.Diagram.Util.attr(element, attr);
                }

            }
        },

        updateTargetDecoratorStyle: function (connector, svg) {
            if (svg) {
                var attr = {};
                attr["stroke"] = connector.targetDecorator.borderColor;
                attr["fill"] = connector.targetDecorator.fillColor;
                var element = svg.getElementById(connector.name + "_targetDecorator");
                if (element) {
                    attr["class"] = element.getAttribute("class");
                    this._updateCssClass(connector.targetDecorator, attr);
                    ej.datavisualization.Diagram.Util.attr(element, attr);
                }
            }
        },

        updateSourceDecoratorStyle: function (connector, svg) {
            if (svg) {
                var attr = {};
                attr["stroke"] = connector.sourceDecorator.borderColor;
                attr["fill"] = connector.sourceDecorator.fillColor;
                var element = svg.getElementById(connector.name + "_sourceDecorator");
                if (element) {
                    attr["class"] = element.getAttribute("class");
                    this._updateCssClass(connector.sourceDecorator, attr);
                    ej.datavisualization.Diagram.Util.attr(element, attr);
                }
            }
        },

        updateNode: function (node, svg, diagram, layout, isoverView) {
            if (svg) {
                if (diagram && !diagram._isInit && node._status !== "new")
                    node._status = "update";
                this._updateLabels(node, svg, diagram);
                this._updateNode(node, svg, diagram);
                if (node.outEdges.length)
                    this._updateIcons(node, svg, diagram);
                node._scaled = false;
                if (diagram._layoutInAction) return;
                this._updateAssociatedConnector(node, svg, diagram);
                this._updatePorts(node, (diagram._adornerSvg && !isoverView) ? diagram._adornerSvg : svg, diagram, isoverView);
            }
        },

        updateTextBlock: function (node, label, svg, diagram) {
            var htmlLayer = svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
            var parent = $(htmlLayer).children("#" + node.name + "_label")[0];
            var textContainter = $(parent).children("#" + node.name + "_shape_lblbg")[0];
            var text = textContainter.childNodes[0];
            if (node && text && label) {
                if (label.bold) text.style.fontWeight = "bold"; else text.style.fontWeight = "";
                if (label.italic) text.style.fontStyle = "italic"; else text.style.fontStyle = "";
                text.style.textDecoration = label.textDecoration;
                text.style.fontFamily = label.fontFamily;
                text.style.fontSize = label.fontSize + "px";
                text.style.color = label.fontColor;
            }
            this._updateTextElement(node, svg, diagram);
        },

        _updateAssociatedConnector: function (node, svg, diagram) {
            var i, len;
            if (!diagram._associatedConnectorsUpdate) {
                if (node.inEdges && node.inEdges.length > 0) {
                    for (i = 0, len = node.inEdges.length; i < len; i++) {
                        if (diagram.nameTable[node.inEdges[i]]) {
                            if (diagram.nameTable[node.inEdges[i]] && ej.datavisualization.Diagram.Util.canBridge(diagram.nameTable[node.inEdges[i]], diagram)) {
                                ej.datavisualization.Diagram.Util.updateBridging(diagram.nameTable[node.inEdges[i]], diagram);
                                diagram._updateConnectorBridging(diagram.nameTable[node.inEdges[i]]);
                            }
                            if (!diagram._disableSegmentChange)
                                ej.datavisualization.Diagram.DiagramContext.update(diagram.nameTable[node.inEdges[i]], diagram);
                        }
                    }
                }
                if (node.outEdges && node.outEdges.length > 0) {
                    for (i = 0, len = node.outEdges.length; i < len; i++) {
                        if (diagram.nameTable[node.outEdges[i]]) {
                            if (diagram.nameTable[node.outEdges[i]] && ej.datavisualization.Diagram.Util.canBridge(diagram.nameTable[node.outEdges[i]], diagram)) {
                                ej.datavisualization.Diagram.Util.updateBridging(diagram.nameTable[node.outEdges[i]], diagram);
                                diagram._updateConnectorBridging(diagram.nameTable[node.outEdges[i]]);
                            }
                            if (!diagram._disableSegmentChange)
                                ej.datavisualization.Diagram.DiagramContext.update(diagram.nameTable[node.outEdges[i]], diagram);
                        }
                    }
                }
            }
        },

        _updateNode: function (node, svg, diagram, layout) {
            var width = node.width ? node.width : node._width;
            var height = node.height ? node.height : node._height;
            var x = node.offsetX - width * node.pivot.x;
            var y = node.offsetY - height * node.pivot.y;
            var angle = node.rotateAngle;
            var pt = ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY);
            var visible = node.visible && ej.datavisualization.Diagram.Util.enableLayerOption(node, "visible", diagram) ? "visible" : "hidden";
            if (ej.datavisualization.Diagram.Util.canCrispEdges(node, diagram)) {
                x = Math.floor(x) + 0.5
                y = Math.floor(y) + 0.5;
            }
            var attr = ({
                "id": node.name, "transform": "rotate(" + angle + "," + pt.x + "," + pt.y + "),translate(" + x + "," + y + ")",
                "visibility": visible
            });
            if (!(ej.datavisualization.Diagram.Util.canEnablePointerEvents(node, diagram)))
                attr["style"] = "pointer-events:none";
            else
                attr["style"] = "";
            svg.g(attr);
            var type = node._shape ? node._shape : node.type;
            switch (type) {
                case "rectangle":
                    svg.rect({
                        "id": node.name + "_shape", "width": (width < 0) ? 0 : width, "height": (height < 0) ? 0 : height,
                    });
                    if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow)
                        svg.rect({
                            "id": node.name + "_shadow", "width": node.width, "height": node.height,
                        });
                    break;
                case "ellipse":
                    svg.ellipse({
                        "id": node.name + "_shape", "rx": width / 2, "ry": height / 2,
                        "cx": width / 2, "cy": height / 2
                    });
                    if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow)
                        svg.ellipse({
                            "id": node.name + "_shadow", "rx": node.width / 2, "ry": node.height / 2,
                            "cx": node.width / 2, "cy": node.height / 2
                        });
                    break;
                case "image":
                    this._updateBackgroundRect(node, svg);
                    var alignment = ej.datavisualization.Diagram.Util._getImageAlignment(node.contentAlignment);
                    var scale = node.scale == "none" ? "meet" : node.scale;
                    var attr = {
                        "id": node.name + "_shape", "preserveAspectRatio": (scale != "stretch" && alignment != "none" ? alignment + " " + scale : "none")
                    };
                    if (node.scale != "none") {
                        attr["width"] = width; attr["height"] = height;
                    }

                    svg.image(attr);
                    if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow)
                        svg.rect({
                            "id": node.name + "_shadow", "width": node.width, "height": node.height,
                        });
                    break;
                case "path":
                    var d;
                    if (node._preventStretch)
                        d = node._absolutePath = node.pathData;
                    else {
                        if (node._scaled || !node._absolutePath) {
                            d = ej.datavisualization.Diagram.Geometry.updatePath(0, 0, width, height, node.pathData, svg, node._absoluteBounds);
                            node._absolutePath = d;
                            node._scaled = false;
                        }
                        else d = node._absolutePath;
                    }
                    svg.path({
                        "id": node.name + "_shape", "d": d,
                    });
                    if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow)
                        svg.path({
                            "id": node.name + "_shadow", "d": d,
                        });
                    break;
                case "polygon":
                    this._updatePolygon(node, svg);
                    break;
                case "text":
                    this._updateTextElement(node, svg, diagram);
                    if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow)
                        svg.rect({
                            "id": node.name + "_shadow", "width": node.width, "height": node.height,
                        });
                    break;
                case "html":
                    this._updateHtmlElement(node, svg, diagram);
                    if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow)
                        svg.rect({
                            "id": node.name + "_shadow", "width": node.width, "height": node.height
                        });
                    break;
                case "native":
                    var object = this._scaleNodeContent(node, $("#" + node.name + "_shape")[0]);
                    var attr = {
                        "id": node.name + "_shape",
                    }
                    if (node.width)
                        attr["width"] = node.width;
                    if (node.height)
                        attr["height"] = node.height;
                    if (object) attr["transform"] = "translate(" + object.x + "," + object.y + "),scale(" + object.sx + "," + object.sy + ")"
                    svg.g(attr);
                    if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow)
                        svg.rect({
                            "id": node.name + "_shadow", "width": node.width, "height": node.height
                        });
                    break;
            }
          
        },

        _updateHtmlElement: function (node, svg, diagram) {
            this._updateBackgroundRect(node, svg);
            var visibility = node.visible && ej.datavisualization.Diagram.Util.enableLayerOption(node, "visible", diagram) ? "visible" : "hidden";
            var width = node.width ? node.width : node._width;
            var height = node.height ? node.height : node._height;
            var x = node.offsetX - width * node.pivot.x;
            var y = node.offsetY - height * node.pivot.y;
            var div;
            var htmlLayer = svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
            var parentDiv = $(htmlLayer).children("#" + node.name + "_parentdiv");
            if (parentDiv) {
                div = $(parentDiv).children("#" + node.name + "_html")[0];
                if (div) {
                    div.style.left = x + "px";
                    div.style.top = y + "px";
                    div.style.webkitTransform = "rotate(" + node.rotateAngle + "deg)";
                    div.style.MozTransform = "rotate(" + node.rotateAngle + "deg)";
                    div.style.OTransform = "rotate(" + node.rotateAngle + "deg)";
                    div.style.msTransform = "rotate(" + node.rotateAngle + "deg)";
                    div.style.transform = "rotate(" + node.rotateAngle + "deg)";
                    div.style.opacity = node.opacity;
                    div.style.visibility = visibility;
                }
            }
            if (div) {
                div.style.width = node.width.toString() + "px";
                div.style.height = node.height.toString() + "px";
            }
        },

        _updatePolygon: function (node, svg) {
            ej.datavisualization.Diagram.Geometry.updatePolygonPoints(node);
            svg.polygon({
                "id": node.name + "_shape", "points": this._convertToSVGPoints(node.points)
            });
            if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow)
                svg.polygon({
                    "id": node.name + "_shadow", "points": this._convertToSVGPoints(node.points)
                });
        },

        _convertToSVGPoints: function (points) {
            var pts = "";
            for (var i = 0, len = points.length; i < len; i++) {
                pts += points[i].x + "," + points[i].y + " ";
            }
            return pts.trim();
        },



        _renderTextElement: function (node, svg, g, diagram) {
            if (diagram.model.labelRenderingMode == ej.datavisualization.Diagram.LabelRenderingMode.Svg) {
                this._renderBackgroundRect(node, svg, g);
                var label = node.textBlock;
                var nodeElement = svg.getElementById(node.name);

                var attr = {
                    "id": node.name + "_shape_lblbg", "class": "ej-d-label", "font-family": label.fontFamily, "font-size": label.fontSize, "fill": label.fontColor, "text-decoration": label.textDecoration, "font-weight": label.bold ? "bold" : "normal", "font-style": label.italic ? "italic" : "normal",
                };
                var textElement = svg.text(attr);
                nodeElement.appendChild(textElement);
                this._renderLabelSpanElement(textElement, node, label, svg, diagram, false);
            }
            else {
                var textElement = node.textBlock;
                if (textElement) {
                    var htmlLayer = svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                    this._renderBackgroundRect(node, svg, g);
                    var container = document.createElement("div");
                    var text = document.createElement("span");
                    ej.datavisualization.Diagram.Util.attr(text, { "id": node.name + "_label", "class": "ej-d-label", "style": "display: inline-block; position: absolute; pointer-events: all; line-height: normal; alignment-baseline:middle" });
                    if (textElement.bold) text.style.fontWeight = "bold";
                    if (textElement.italic) text.style.fontStyle = "italic";
                    text.style.textDecoration = textElement.textDecoration;
                    text.style.fontFamily = textElement.fontFamily;
                    text.style.fontSize = textElement.fontSize + "px";
                    text.style.color = textElement.fontColor;
                    text.textContent = textElement.text;
                    var style = "display: inline-block; position: absolute; width: inherit; height: inherit; pointer-events: none; ";
                    ej.datavisualization.Diagram.Util.attr(container, { "id": node.name + "_shape_lblbg", "style": style });
                    container.appendChild(text);

                    var element = $(htmlLayer).children("#" + node.name + "_label")[0];
                    if (element) htmlLayer.removeChild(element);
                    element = document.createElement("div");
                    var width = node.width ? node.width : node._width;
                    var height = node.height ? node.height : node._height;
                    var x = node.offsetX - width * node.pivot.x;
                    var y = node.offsetY - height * node.pivot.y;
                    var style = "width:" + width + "px; height:" + height + "px; left:" + x + "px; top:" + y + "px; display: block; position: absolute; pointer-events: none; ";
                    var class1 = "ej-d-node";
                    ej.datavisualization.Diagram.Util.attr(element, { "id": node.name + "_label", "class": class1, "style": style });
                    element.style.webkitTransform = "rotate(" + node.rotateAngle + "deg) ";
                    element.style.MozTransform = "rotate(" + node.rotateAngle + "deg) ";
                    element.style.OTransform = "rotate(" + node.rotateAngle + "deg) ";
                    element.style.msTransform = "rotate(" + node.rotateAngle + "deg)";
                    element.style.transform = "rotate(" + node.rotateAngle + "deg) ";
                    element.appendChild(container);

                    if (htmlLayer)
                        htmlLayer.appendChild(element);
                    var bounds = ej.datavisualization.Diagram.Util.bounds(node);
                    this._alignTextOnLabel(node, bounds, text, container, node.textBlock);
                    //this._renderShadow(node, svg, g);
                }
            }
        },

        _updateTextElement: function (node, svg, diagram) {
            if (diagram.model.labelRenderingMode == ej.datavisualization.Diagram.LabelRenderingMode.Svg) {
                this._updateBackgroundRect(node, svg);
                var label = node.textBlock;
                var nodeElement = svg.getElementById(node.name);

                var attr = {
                    "id": node.name + "_shape_lblbg",
                    "class": "ej-d-label", "font-family": label.fontFamily, "font-size": label.fontSize, "fill": label.fontColor, "text-decoration": label.textDecoration, "font-weight": label.bold ? "bold" : "normal", "font-style": label.italic ? "italic" : "normal",
                };
                var textElement = svg.text(attr);
                this._updateLabelSpanElement(node, label, svg, diagram, false);
            }
            else {
                this._updateBackgroundRect(node, svg);
                var htmlLayer = svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                if (htmlLayer) {
                    var parent = this._findChild(htmlLayer.childNodes, node);
                    var visible = node.visible && ej.datavisualization.Diagram.Util.enableLayerOption(node, "visible", diagram) ? "visible" : "hidden";
                    var bounds = ej.datavisualization.Diagram.Util.bounds(node);
                    var width, height, x, y;
                    if (parent) {
                        width = bounds.width; height = bounds.height;
                        x = node.offsetX - node.width * node.pivot.x; y = node.offsetY - node.height * node.pivot.y;
                        parent.style.width = width + "px";
                        parent.style.height = height + "px";
                        parent.style.left = x + "px";
                        parent.style.top = y + "px";
                        parent.style.visibility = visible;
                        parent.style.webkitTransform = "rotate(" + node.rotateAngle + "deg)";
                        parent.style.MozTransform = "rotate(" + node.rotateAngle + "deg)";
                        parent.style.OTransform = "rotate(" + node.rotateAngle + "deg)";
                        parent.style.msTransform = "rotate(" + node.rotateAngle + "deg)";
                        parent.style.transform = "rotate(" + node.rotateAngle + "deg)";

                    }
                    var textContainer = $(parent).children("#" + node.name + "_shape_lblbg")[0];
                    if (textContainer) {
                        var text = textContainer.childNodes[0];
                        text.textContent = node.textBlock.text;
                        this._alignTextOnLabel(node, bounds, text, textContainer, node.textBlock, diagram);
                    }
                }
            }
        },

        _renderBackgroundRect: function (node, svg, g) {
            var fill = this._fill(node, svg);
            var attr = {
                "id": node.name + "_backRect", "class": "backrect", "x": 0, "y": 0,
                "width": node.width, "height": node.height, "fill": fill,
                "stroke": node.borderColor, "stroke-width": node.borderWidth, "opacity": node.opacity,
                "stroke-dasharray": node.borderDashArray
            };
            this._addCssClass(node, attr);
            if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow) {
                var point = ej.datavisualization.Diagram.Geometry.transform({ x: 0, y: 0 }, node.shadow.angle, node.shadow.distance);
                var shadow = {
                    "id": node.name + "_shadow", "class": "backrect", "width": node.width, "height": node.height, "stroke": "lightgrey", "fill": fill != "none" || fill != "transparent" ? "lightgrey" : "none",
                    "transform": "translate(" + point.x + "," + point.y + ")", "opacity": node.shadow.opacity
                };
                g.appendChild(svg.rect(shadow));
            }
            g.appendChild(svg.rect(attr));

        },

        _updateBackgroundRect: function (node, svg) {
            var fill = this._fill(node, svg);
            var attr = {
                "id": node.name + "_backRect", "x": 0, "y": 0,
                "width": node.width, "height": node.height,
                "fill": fill, "stroke": node.borderColor, "stroke-width": node.borderWidth,
                "opacity": node.opacity, "stroke-dasharray": node.borderDashArray, "class": node.cssClass
            };
            svg.rect(attr);
        },

        _hideNode: function (node, svg) {
            var attr = { "id": node.name, "style": "pointer-events:none;" };
            svg.rect(attr);
        },

        _showNode: function (node, svg) {
            var attr = { "id": node.name, "style": "pointer-events:auto;" };
            svg.rect(attr);
        },
        _removePhasehelper: function (diagram) {
            if (diagram._adornerSvg.getElementById("phase_helper"))
                diagram._adornerSvg.removeChild(diagram._adornerSvg.getElementById("phase_helper"), diagram._adornerLayer);
        },
        _updatePhaseHelper: function (diagram, phase, bounds) {
            if (phase) {
                var svg = diagram._adornerSvg, scale = diagram._currZoom, attr;
                bounds.width = bounds.width < 0 ? 1 : bounds.width;
                bounds.height = bounds.height < 0 ? 1 : bounds.height;
                attr = {
                    "id": "phase_helper", "class": "helper", "pointer-events": "none", "width": bounds.width * scale, "height": bounds.height * scale
                };
                diagram._adornerSvg.rect(attr);
            }
        },
        _phasehelper: function (diagram, phase, bounds) {
            if (phase) {
                var svg = diagram._adornerSvg, scale = diagram._currZoom;
                var offsetX = (bounds.x + bounds.width / 2);
                var offsetY = (bounds.y + bounds.height / 2);
                var rect = svg.rect({
                    "id": "phase_helper", "class": "helper",
                    "stroke-width": 2, "stroke-dasharray": "3,3", "pointer-events": "none",
                    "width": bounds.width * scale, "height": bounds.height * scale, "fill": "transparent", "stroke": "green",
                    "transform": "translate(" + (offsetX - bounds.width / 2) * scale + "," + (offsetY - bounds.height / 2) * scale + "),rotate(" + 0 + "," + (bounds.width / 2) * scale + "," + (bounds.height / 2) * scale + ")"
                });
                diagram._adornerLayer.appendChild(rect);
            }
        },
        _drawContainerHelper: function (diagram) {
            var shape = diagram.activeTool.helper;
            var svg = diagram._adornerSvg;
            var scale = diagram._currZoom;
            if (shape)
                var bounds = ej.datavisualization.Diagram.Util.bounds(shape, true);
            var height = bounds.height;
            var width = bounds.width;
            var pivot;
            if (shape.pivot) pivot = { x: bounds.width * shape.pivot.x, y: bounds.height * shape.pivot.y };
            else pivot = { x: width / 2, y: height / 2 };
            var rotateAngle = shape.rotateAngle ? shape.rotateAngle : 0;
            var rect = svg.rect({
                "id": "helper", "class": "helper",
                "stroke-width": 1, "stroke-dasharray": "3,3", "pointer-events": "none",
                "width": width * scale, "height": height * scale, "fill": "transparent", "stroke": "red",
                "transform": "translate(" + (bounds.x) * scale + "," + (bounds.y) * scale + "),rotate(" + rotateAngle + "," + (pivot.x) * scale + "," + (pivot.y) * scale + ")"
            });
            diagram._adornerLayer.appendChild(rect);
        },

        _updateContainerHelper: function (diagram) {
            var attr;
            var shape = diagram.activeTool.helper;
            var scale = diagram._currZoom;
            if (shape)
                var bounds = ej.datavisualization.Diagram.Util.bounds(shape, true);
            var height = bounds.height;
            var width = bounds.width;
            var pivot;
            if (shape.pivot) pivot = { x: bounds.width * shape.pivot.x, y: bounds.height * shape.pivot.y };
            else pivot = { x: width / 2, y: height / 2 };
            diagram._raiseOffsetPropertyChange(shape, bounds.center.x, bounds.center.y, true);
            diagram._raiseSizePropertyChange(shape, bounds.width / shape.width, bounds.height / shape.height, true);
            var rotateAngle = shape.rotateAngle ? shape.rotateAngle : 0;
            attr = {
                "id": "helper", "class": "helper",
                "width": width * scale, "height": height * scale, "fill": "transparent", "stroke": "red",
                "transform": "translate(" + (bounds.x) * scale + "," + (bounds.y) * scale + "),rotate(" + rotateAngle + "," + (pivot.x) * scale + "," + (pivot.y) * scale + ")"
            };
            diagram._adornerSvg.rect(attr);
        },

        _removeContainerHelper: function (node, svg, parent) {
            if (svg.getElementById("helper"))
                svg.removeChild(svg.getElementById("helper"), parent);
        },
        //#endregion

        setNodeShape: function (node, svg, parent, diagram) {
            var g;
            if (parent) {
                var parentg = svg.getElementById(parent.name);
                g = $(parentg).find("#" + node.name)[0];
            }
            else {
                g = svg.getElementById(node.name);
            }
            if (g) {
                $(g).empty();
                this._renderNode(node, svg, g, diagram);
            }
        },

        setLine: function (connector, svg, parent, diagram) {
            var g;
            if (parent) {
                var parentg = svg.getElementById(parent.name);
                g = $(parentg).find("#" + connector.name)[0];
            }
            else {
                g = svg.getElementById(connector.name);
            }
            $(g).empty();

            this.renderConnector(connector, svg, g, diagram);
        },

        addNodeLabel: function (node, label, svg, parent, diagram) {
            this._renderLabels(node, svg, diagram);
        },
        //#endregion

        //#region Render Connector
        renderConnector: function (connector, svg, parent, diagram) {
            var g, attr;
            var visible = connector.visible && ej.datavisualization.Diagram.Util.enableLayerOption(connector, "visible", diagram) ? "visible" : "hidden";
            if (ej.datavisualization.Diagram.Util.canCrispEdges(connector, diagram))
                attr = { "id": connector.name, "class": "ej-d-connector", "visibility": visible, "opacity": connector.opacity, "transform": "translate(" + 0.5 + "," + 0.5 + ")" };
            else
                attr = { "id": connector.name, "class": "ej-d-connector", "visibility": visible, "opacity": connector.opacity };
            if (!ej.datavisualization.Diagram.Util.canEnablePointerEvents(connector, diagram))
                attr["style"] = "pointer-events:none";
            g = svg.g(attr);
            if (parent) {
                if (parent.id !== g.id) {
                    parent.appendChild(g);
                }
            }
            else {
                svg.appendChild(g);
            }
            var seg = svg.g({ "id": connector.name + "segments" });
            this._renderSegments(connector, svg, seg, diagram);
            g.appendChild(seg);
            this._renderLabels(connector, svg, diagram);
            this._renderDecorators(connector, svg, g, diagram);
            if (connector.shape) {
                ej.datavisualization.Diagram.DefautShapes.updateInlineDecoratorsShape(connector, diagram);
                for (var i = 0; i < connector._inlineDecorators.length; i++)
                    this.renderNode(connector._inlineDecorators[i], svg, g, undefined, diagram);
            }
            return g;
        },

        _renderSegments: function (connector, svg, g, diagram) {
            var visibility = connector.visible && ((diagram && diagram._browserInfo ? diagram._browserInfo.name : ej.browserInfo().name) === "msie") ? "collapse" : "hidden";
            var path = this._findPath(connector, diagram);
            var attr = {
                "id": connector.name + "_hitTest", "class": "hitTest", "stroke-width": connector.lineHitPadding, "d": path,
                "stroke": "transparent", "visibility": "hidden"
            };
            if (!ej.datavisualization.Diagram.Util.canEnablePointerEvents(connector, diagram))
                attr["pointer-events"] = "none";
            else
                attr["pointer-events"] = connector.visible ? "stroke" : "none";
            var line = svg.path(attr);
            g.appendChild(line);
            attr = {
                "id": connector.name + "_segments",
                "d": path, "fill": "none", "stroke": connector.lineColor,
                "stroke-width": connector.lineWidth, "stroke-dasharray": connector.lineDashArray, "opacity": connector.opacity
            };
            this._addCssClass(connector, attr);
            line = svg.path(attr);
            g.appendChild(line);
            if (connector.shape && connector.shape.type == "umlactivity" && connector.shape.activityFlow == "exception") {
                var attr = {
                    "id": connector.name + "_Activityflow", "class": "umlactivityflow", "fill": "none", "stroke": connector.lineColor, "pointer-events": "none", "stroke-width": connector.lineWidth, "stroke-dasharray": connector.lineDashArray, "opacity": connector.opacity, "d": connector._temppath,
                };
                var line1 = svg.path(attr);
                this._addCssClass(connector, attr);
                g.appendChild(line1);
            }
        },

        _findPath: function (connector, diagram) {
            var st, end, path;
            for (var i = 0; i < connector.segments.length; i++) {
                var seg = connector.segments[i];
                if (seg._bridges.length > 0) {
                    for (var n = 0; n < seg._bridges.length; n++) {
                        var bridge = seg._bridges[n];
                        bridge._rendered = false;
                    }
                }
                var points = seg.points;
                if (connector.shape && connector.shape.flow == "sequence" && connector.shape.sequence == "default" && i == 0) {
                    var beginningpoint = { x: seg.points[0].x, y: seg.points[0].y };
                    var distance = ej.datavisualization.Diagram.Geometry.distance(seg.points[0], seg.points[1]);
                    distance = Math.min(30, distance / 2);
                    var angle = ej.datavisualization.Diagram.Geometry.findAngle(seg.points[0], seg.points[1]);
                    var transferpoint = ej.datavisualization.Diagram.Geometry.transform({ x: beginningpoint.x, y: beginningpoint.y }, angle, distance);
                    var startpoint1 = ej.datavisualization.Diagram.Geometry.transform({ x: transferpoint.x, y: transferpoint.y }, angle + 45, -12);
                    var endpoint1 = ej.datavisualization.Diagram.Geometry.transform({ x: startpoint1.x, y: startpoint1.y }, angle + 45, 12 * 2);
                    if (ej.datavisualization.Diagram.Util.canCrispEdges(connector, diagram))
                        var path1 = "M" + Math.floor(startpoint1.x) + " " + Math.floor(startpoint1.y) + " L" + Math.floor(endpoint1.x) + " " + Math.floor(endpoint1.y);
                    else
                        var path1 = "M" + startpoint1.x + " " + startpoint1.y + " L" + endpoint1.x + " " + endpoint1.y;
                }
                if (connector.shape && connector.shape.type == "umlactivity" && connector.shape.activityFlow == "exception" && i == 0) {
                    var beginningpoint = { x: seg.points[0].x, y: seg.points[0].y };
                    var distance = ej.datavisualization.Diagram.Geometry.distance(seg.points[0], seg.points[1]);
                    distance = Math.max(30, distance / 2);
                    var angle = ej.datavisualization.Diagram.Geometry.findAngle(seg.points[0], seg.points[1]);
                    var transferpoint = ej.datavisualization.Diagram.Geometry.transform({ x: beginningpoint.x, y: beginningpoint.y }, angle, distance);
                    var startpoint1 = ej.datavisualization.Diagram.Geometry.transform({ x: transferpoint.x, y: transferpoint.y }, angle + 145, 9);
                    var endpoint1 = ej.datavisualization.Diagram.Geometry.transform({ x: startpoint1.x, y: startpoint1.y }, angle + 225, 7 * 2);
                    if (ej.datavisualization.Diagram.Util.canCrispEdges(connector, diagram))
                        var path1 = "M" + Math.floor(startpoint1.x) + " " + Math.floor(startpoint1.y) + " L" + Math.floor(endpoint1.x) + " " + Math.floor(endpoint1.y);
                    else
                        var path1 = "M" + endpoint1.x + " " + startpoint1.y + "L" + endpoint1.x + " " + endpoint1.y + " L" + startpoint1.x + " " + startpoint1.y + " L" + startpoint1.x + " " + endpoint1.y;
                }
                if (i == 0) {
                    if (diagram && connector.sourceNode) var node = diagram._findNode(connector.sourceNode);
                    points = this._clipDecorators(connector, seg, true, node);
                    if (seg.type == "bezier" && connector.sourceDecorator && connector.sourceDecorator.shape !== ej.datavisualization.Diagram.DecoratorShapes.None) {
                        points[0] = ej.datavisualization.Diagram.Util._adjustPoint(points[0], seg._point1, true, connector.lineWidth);
                    }
                    if (ej.datavisualization.Diagram.Util.canCrispEdges(connector, diagram))
                        path = "M" + Math.floor(points[0].x) + " " + Math.floor(points[0].y);
                    else
                        path = "M" + points[0].x + " " + points[0].y;
                }
                if (i == connector.segments.length - 1) {
                    if (diagram && connector.targetNode) var node = diagram._findNode(connector.targetNode);
                    points = this._clipDecorators(connector, seg, false, node);
                }
                if (seg.type != "bezier") {
                    if (connector.cornerRadius > 0) {
                        for (var j = 0; j < points.length - 1; j++) {
                            var segLength = ej.datavisualization.Diagram.Geometry.distance(points[j], points[j + 1]);
                            if (segLength > 0) {
                                if (i < connector.segments.length - 1 || j < points.length - 2) {
                                    if (segLength < connector.cornerRadius * 2) {
                                        end = ej.datavisualization.Diagram.Util._adjustPoint(points[j], points[j + 1], false, segLength / 2);
                                    }
                                    else end = ej.datavisualization.Diagram.Util._adjustPoint(points[j], points[j + 1], false, connector.cornerRadius);
                                }
                                else end = points[j + 1];

                                if (i > 0 || j > 0) {
                                    if (segLength < connector.cornerRadius * 2) {
                                        st = ej.datavisualization.Diagram.Util._adjustPoint(points[j], points[j + 1], true, segLength / 2);
                                        if (i < connector.segments.length - 1 || j < points.length - 2)
                                            end = null;
                                    }
                                    else st = ej.datavisualization.Diagram.Util._adjustPoint(points[j], points[j + 1], true, connector.cornerRadius);
                                }

                                if (st) {
                                    if (ej.datavisualization.Diagram.Util.canCrispEdges(connector, diagram))
                                        path += " Q" + Math.floor(points[j].x) + " " + Math.floor(points[j].y) + " " + Math.floor(st.x) + " " + Math.floor(st.y);
                                    else
                                        path += " Q" + points[j].x + " " + points[j].y + " " + st.x + " " + st.y;
                                }
                                if (end) {
                                    if (seg._bridges.length > 0) {
                                        path = this._updateBridging(seg, path, j);
                                        if (seg.type === "orthogonal")
                                            path = this._updateBridging(seg, path, j + 1);
                                    }
                                    if (ej.datavisualization.Diagram.Util.canCrispEdges(connector, diagram))
                                        path += " L" + Math.floor(end.x) + " " + Math.floor(end.y);
                                    else
                                        path += " L" + end.x + " " + end.y;
                                }
                            }
                        }
                    }
                    else {
                        for (var j = 0; j < points.length; j++) {
                            if (j > 0) {
                                path = this._updateBridging(seg, path, j);
                                if (ej.datavisualization.Diagram.Util.canCrispEdges(connector, diagram))
                                    path += " L" + Math.floor(points[j].x) + " " + Math.floor(points[j].y);
                                else
                                    path += " L" + points[j].x + " " + points[j].y;
                            }
                        }
                    }
                }
                else {
                    var endPoint = seg._endPoint;
                    if (connector.targetDecorator && connector.targetDecorator.shape !== ej.datavisualization.Diagram.DecoratorShapes.None) {
                        endPoint = ej.datavisualization.Diagram.Util._adjustPoint(seg._endPoint, seg._point2, true, connector.lineWidth);
                    }
                    if (connector.targetNode && diagram) {
                        var targetNode = diagram._findNode(connector.targetNode);
                        if (node.borderColor != "none")
                            endPoint = ej.datavisualization.Diagram.Util._adjustPoint(endPoint, seg._point2, true, targetNode.borderWidth / 2);
                    }
                    if (ej.datavisualization.Diagram.Util.canCrispEdges(connector, diagram))
                        path += " C" + Math.floor(seg._point1.x) + " " + Math.floor(seg._point1.y) + " " + Math.floor(seg._point2.x) + " " + Math.floor(seg._point2.y) + " " + Math.floor(endPoint.x) + " " + Math.floor(endPoint.y);
                    else
                        path += " C" + seg._point1.x + " " + seg._point1.y + " " + seg._point2.x + " " + seg._point2.y + " " + endPoint.x + " " + endPoint.y;
                }
            }
            if (connector.shape && connector.shape.flow == "sequence" && connector.shape.sequence == "default") {
                path += path1;
            }
            if (connector.shape && connector.shape.activityFlow == "exception" && connector.shape.type == "umlactivity") {
                path = path;
                connector._temppath = path1;
            }
            return path;
        },

        _updateBridging: function (seg, path, pointIndex) {
            var pathData = path;
            if (seg._bridges.length > 0) {
                if (seg.type === "straight") {
                    for (var n = 0; n < seg._bridges.length; n++) {
                        var bridge = seg._bridges[n];
                        if (!bridge._rendered) {
                            pathData += " L" + bridge.startPoint.x + " " + bridge.startPoint.y;
                            pathData += bridge.path;
                        }
                    }
                }
                else if (seg.type === "orthogonal") {
                    for (var n = 0; n < seg._bridges.length; n++) {
                        var bridge = seg._bridges[n];
                        if (bridge.segmentPointIndex === pointIndex && !bridge._rendered) {
                            pathData += " L" + bridge.startPoint.x + " " + bridge.startPoint.y;
                            pathData += bridge.path;
                            bridge._rendered = true;
                        }
                    }
                }
            }
            return pathData;
        },

        _refreshSegments: function (connector, svg, diagram) {
            this._updateConnector(connector, svg, diagram);
            this._updateDecorators(connector, svg, diagram);
        },

        _refreshOnlySegments: function (connector, svg, diagram) {
            var path = this._findPath(connector, diagram);
            var element = svg.document.getElementById(connector.name + "_segments");
            if (element) {
                element.setAttribute("d", path);
                element = svg.document.getElementById(connector.name + "_hitTest");
                element.setAttribute("d", path);
            }
        },

        _clipDecorators: function (connector, segment, source, node) {
            var points = [];
            if (!source && connector.targetDecorator && connector.targetDecorator.shape !== ej.datavisualization.Diagram.DecoratorShapes.None) {
                var start, end;
                for (var i = 0; i < segment.points.length; i++) {
                    points[i] = segment.points[i];
                }
                start = points[points.length - 1];
                end = points[points.length - 2];
                var len = ej.datavisualization.Diagram.Geometry.distance(start, end);
                len = (len == 0) ? 1 : len;
                var width = connector.lineWidth;
                var newPoint = ej.datavisualization.Diagram.Point();
                newPoint.x = start.x + width * (end.x - start.x) / len;
                newPoint.y = start.y + width * (end.y - start.y) / len;
                if (node && node.borderColor != "none")
                    newPoint = ej.datavisualization.Diagram.Util._adjustPoint(newPoint, end, true, node.borderWidth / 2);
                points[points.length - 1] = newPoint;
            }
            else if (source && connector.sourceDecorator && connector.sourceDecorator.shape !== ej.datavisualization.Diagram.DecoratorShapes.None) {
                for (var i = 0; i < segment.points.length; i++) {
                    points[i] = segment.points[i];
                }
                start = points[0];
                end = points[1];
                var len = ej.datavisualization.Diagram.Geometry.distance(start, end);
                len = (len == 0) ? 1 : len;
                var width = connector.lineWidth;
                var newPoint = ej.datavisualization.Diagram.Point();
                newPoint.x = start.x + width * (end.x - start.x) / len;
                newPoint.y = start.y + width * (end.y - start.y) / len;
                if (segment.type == "bezier") {
                    newPoint.x = start.x + (segment._point1.x - start.x) / len;
                    newPoint.y = start.y + (segment._point1.y - start.y) / len;
                }
                if (node && node.borderColor != "none")
                    newPoint = ej.datavisualization.Diagram.Util._adjustPoint(newPoint, segment.type != "bezier" ? end : segment._point1, true, node.borderWidth / 2);
                points[0] = newPoint;
            }
            else if (source) {
                for (var i = 0; i < segment.points.length; i++) {
                    points[i] = segment.points[i];
                }
                if (node && node.borderColor != "none")
                    points[0] = ej.datavisualization.Diagram.Util._adjustPoint(points[0], points[1], true, node.borderWidth / 2);
            }
            else {
                for (var i = 0; i < segment.points.length; i++) {
                    points[i] = segment.points[i];
                }
                if (node && node.borderColor != "none")
                    points[points.length - 1] = ej.datavisualization.Diagram.Util._adjustPoint(points[points.length - 1], points[points.length - 2], true, node.borderWidth / 2);
            }
            return points;
        },

        _updateConnector: function (connector, svg, diagram) {
            if (diagram && !diagram._isInit && connector._status !== "new")
                connector._status = "update";
            var path = this._findPath(connector, diagram);
            svg.path({ "id": connector.name + "_segments", "d": path });
            var attr = { "id": connector.name + "_hitTest", "d": path, "stroke-width": connector.lineHitPadding };
            if (!ej.datavisualization.Diagram.Util.canEnablePointerEvents(connector, diagram))
                attr["pointer-events"] = "none";
            else
                attr["pointer-events"] = (connector.isPhase || (diagram.activeTool.name === "move" && diagram.activeTool.inAction) ||
                        (diagram._selectedSymbol && diagram.selectionList[0] && diagram.selectionList[0].name == connector.name))
                        ? "none" : (connector.visible ? "stroke" : "none")
            svg.path(attr);
            if (connector.shape && connector.shape.type == "umlactivity" && connector.shape.activityFlow == "exception") {
                var attr = {
                    "id": connector.name + "_Activityflow", "class": "umlactivityflow", "fill": "none", "stroke": connector.lineColor, "pointer-events": "none", "stroke-width": connector.lineWidth, "stroke-dasharray": connector.lineDashArray, "opacity": connector.opacity, "d": connector._temppath,
                };
                svg.path(attr);
            }

        },

        updateConnector: function (connector, svg, diagram) {
            //var svg = diagram._svg;
            if (svg) {
                var visible = connector.visible && ej.datavisualization.Diagram.Util.enableLayerOption(connector, "visible", diagram) ? "visible" : "hidden";
                var attr;
                if (ej.datavisualization.Diagram.Util.canCrispEdges(connector, diagram))
                    attr = { "id": connector.name, "visibility": visible, opacity: connector.opacity, "transform": "translate(" + 0.5 + "," + 0.5 + ")" };
                else
                    attr = { "id": connector.name, "visibility": visible, opacity: connector.opacity };
                if (!ej.datavisualization.Diagram.Util.canEnablePointerEvents(connector, diagram))
                    attr["style"] = "pointer-events:none";
                else
                    attr["style"] = "";
                if (!diagram._animatingLayout)
                    svg.g(attr);
                this._updateConnector(connector, svg, diagram);
                this._updateLabels(connector, svg, diagram);
                this._updateDecorators(connector, svg, diagram);
                if (connector.shape) {
                    ej.datavisualization.Diagram.DefautShapes.updateInlineDecoratorsShape(connector, diagram);
                    for (var i = 0; i < connector._inlineDecorators.length; i++)
                        this.updateNode(connector._inlineDecorators[i], svg, diagram);
                }
            }
        },

        renderDecorators: function (connector, svg, diagram) {
            var g = svg.getElementById(connector.name);
            this._renderDecorators(connector, svg, g, diagram);
        },

        clearDecorators: function (connector, svg, diagram) {
            this._updateConnector(connector, svg, diagram);
            var g = svg.getElementById(connector.name);
            var dec = svg.getElementById(connector.name + "_targetDecorator");
            if (dec)
                svg.removeChild(dec, g);
            dec = svg.getElementById(connector.name + "_sourceDecorator");
            if (dec)
                svg.removeChild(dec, g);
        },
        //#endregion

        //#region Render Decorator
        _renderDecorators: function (connector, svg, g, diagram) {
            var startPoint;
            var endPoint;
            if (connector.targetDecorator && connector.targetDecorator.shape !== ej.datavisualization.Diagram.DecoratorShapes.None) {
                var segment = connector.segments[connector.segments.length - 1];
                startPoint = segment.points[segment.points.length - 2];
                endPoint = connector.targetPoint;
                if (segment.type == "bezier") {
                    startPoint = segment._point2;
                }
                if (connector.targetNode && diagram) {
                    var targetNode = diagram._findNode(connector.targetNode);
                    if (targetNode && targetNode.borderColor != "none")
                        endPoint = ej.datavisualization.Diagram.Util._adjustPoint(endPoint, startPoint, true, targetNode.borderWidth / 2);
                }
                this._renderDecorator(connector.name + "_targetDecorator", endPoint,
                    startPoint, connector, connector.targetDecorator, svg, g);
            }
            if (connector.sourceDecorator && connector.sourceDecorator.shape !== ej.datavisualization.Diagram.DecoratorShapes.None) {
                var segment = connector.segments[0];
                startPoint = connector.sourcePoint;
                endPoint = segment.points[1];
                if (segment.type == "bezier") {
                    endPoint = segment._point1;
                }
                if (connector.sourceNode && diagram) {
                    var sourceNode = diagram._findNode(connector.sourceNode);
                    if (sourceNode && sourceNode.borderColor != "none")
                        startPoint = ej.datavisualization.Diagram.Util._adjustPoint(startPoint, endPoint, true, sourceNode.borderWidth / 2);
                }
                this._renderDecorator(connector.name + "_sourceDecorator", startPoint,
                    endPoint, connector, connector.sourceDecorator, svg, g);
            }
        },
        _renderIcons: function (node, diagram) {
            var expandicon = node.expandIcon;
            var collapseicon = node.collapseIcon;
            if (expandicon.shape != "none" || collapseicon.shape != "none") {
                var g;
                var width = node.width ? node.width : node._width || 0;
                var height = node.height ? node.height : node._height || 0;
                var name = node.name;
                var offX = 0, offY = 0, x = 0, y = 0, rAngle = 0;
                var visible = node.visible ? "visible" : "hidden";
                x = node.offsetX - width * node.pivot.x;
                y = node.offsetY - height * node.pivot.y;
                offX = node.offsetX;
                offY = node.offsetY;
                rAngle = node.rotateAngle;
                var attr = {
                    "id": name, "transform": "rotate(" + rAngle + "," + offX + "," + offY +
                            "),translate(" + x + "," + y + ")", "visibility": visible
                };
                var svg = diagram._adornerSvg;
                g = svg.g(attr);
                var expander = svg.document.parentNode.getElementsByClassName("ExpanderLayer")[0] || diagram._expander;
                expander.appendChild(g);
                if (expandicon != undefined && node.isExpanded) {
                    this._renderIcon(node, svg, expandicon, g, diagram);
                } if (collapseicon != undefined && !node.isExpanded) {
                    this._renderIcon(node, svg, collapseicon, g, diagram);
                }
            }
        },
        _renderIcon: function (node, svg, icon, g, diagram) {
            var shape;
            var attr, point;
            if (icon != undefined) {
                point = ej.datavisualization.Diagram.Util._getIconPosition(icon, ej.datavisualization.Diagram.Util.bounds(node, true), true);
                if (icon.shape != "path") {
                    this._renderExpanderTemplate(node, svg, icon, g, diagram, point);
                }
                else
                    //path
                    if (icon.shape == "path") {
                        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                        g.setAttribute("id", node.name + "_expander");
                        g.setAttribute("class", "ej-d-icon-template");
                        var d = ej.datavisualization.Diagram.Geometry.updatePath(point.x - icon.width / 2, point.y - icon.height / 2, icon.width, icon.height, icon.pathData, svg);
                        var visible = node.visible ? "visible" : "hidden";
                        icon._absolutePath = d;
                        if (icon.margin.left && icon.margin.right)
                            icon.width -= (icon.margin.left || 0) + (icon.margin.right || 0);
                        if (icon.margin.top && icon.margin.bottom)
                            icon.height -= (icon.margin.top || 0) + (icon.margin.bottom || 0);
                        attr = {
                            "id": node.name + "_pathexpander",
                            "x": point.x, "y": point.y, "width": icon.width,
                            "height": icon.height, "fill": icon.borderColor, "stroke": icon.borderColor, "stroke-width": icon.borderWidth, "visibility": visible,
                            "d": d
                        };
                        this._addCssClass(g, attr);
                        var a = svg.path(attr);
                        g.appendChild(a);
                        return g;
                    }
                //image
                if (icon.shape == "image") {
                    var image = new Image();
                    image.src = icon.source;
                    var shape = svg.image(attr);
                    shape.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", image.src);
                    g.appendChild(shape);

                } return shape;
            }
        },
        _renderExpanderTemplate: function (node, svg, icon, g, diagram, point, update) {
            //drawing iconShape using template
            var temp = this.construct_template_iconshape(icon, node.isExpanded, diagram);
            if (temp != "undefined") {
                if (update)
                    g.removeChild(svg.document.getElementById(node.name + "_expander"));
                var div = document.createElement('div'); div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><g id="tempNative">' + temp + '</g></svg>';
                document.body.appendChild(div);
                var element = document.getElementById("tempNative");
                var content = element.cloneNode(true);
                content.id = node.name + "_expander";
                var bounds = element.getBBox();
                var width = icon.width;
                var height = icon.height;
                var delwidth = bounds.width ? width / (bounds.width) : 1;
                var delheight = bounds.height ? height / (bounds.height) : 1;
                div.parentNode.removeChild(div);
                g.appendChild(content);
                var ratio = Math.min(delwidth, delheight);
                var visible = node.visible ? "visible" : "hidden";
                if (icon.horizontalAlignment || icon.verticalAlignment) {
                    var x = 0, y = 0;
                    var offset = { x: icon.offset.x, y: icon.offset.y };
                    switch (icon.horizontalAlignment) {
                        case "left":
                            point.x += 0;
                            break;
                        case "center":
                            point.x -= icon.width / 2;
                            break;
                        case "right":
                            point.x -= icon.width;
                            break;
                    }
                    switch (icon.verticalAlignment) {
                        case "top":
                            point.y += 0;
                            break;
                        case "center":
                            point.y -= icon.height / 2;
                            break;
                        case "bottom":
                            point.y -= icon.height;
                            break;
                    }
                    var left = ((point.x) - bounds.x * delwidth);
                    var top = ((point.y) - bounds.y * delheight);
                    var attr = {
                        "id": node.name + "_expander", "class": "ej-d-icon-template",
                        "transform": "translate(" + left + "," + top + "),scale(" + delwidth + "," + delheight + ")",
                        "x": point.x, "y": point.y, "width": icon.width,
                        "height": icon.height, "fill": icon.borderColor, "stroke": icon.borderColor, "stroke-width": icon.borderWidth
                    }; svg.g(attr);
                }
            }
        },
        construct_template_iconshape: function (icon, expanded, diagram) {
            var content;
            if (icon.shape) {
                switch (icon.shape) {
                    case "arrowup":
                        content = '<rect  x="2.5" y="2.5" width="15" height="15" style="fill:#FFFFFF;stroke:#000000;stroke-miterlimit:10"/><path d="M8.7,7.2L8.9,7h2.2l0.2,0.2l0,0l4.8,4.8h-2.5L10,8.4L6.4,12H3.9L8.7,7.2L8.7,7.2z"/></path></rect>';
                        break;
                    case "arrowdown":
                        content = '<rect  x="2.5" y="2.5" width="15" height="15" style="fill:#FFFFFF;stroke:#000000;stroke-miterlimit:10"/><path d="M9,12.2l0.1,0.1h1.7l0.1-0.1l0,0l3.8-3.8h-2L10,11.2L7.2,8.4h-2L9,12.2L9,12.2z"/></path></rect>';
                        break;
                    case "plus":
                        content = '<rect x="2.5" y="2.5" width="15" height="15" style="fill:#FFFFFF;stroke:#000000;stroke-miterlimit:10"/><line style="fill:#FFFFFF;stroke:#000000;stroke-width:2;stroke-miterlimit:10" x1="6.1" y1="10" x2="13.9" y2="10"/></line><line style=" fill:#FFFFFF;stroke:#000000;stroke-width:2;stroke-miterlimit:10" x1="10" y1="6.1" x2="10" y2="13.9"/></line></rect>';
                        break;
                    case "minus":
                        content = ' <rect x="2.5" y="2.5" width="15" height="15" style="fill:#FFFFFF;stroke:#000000;stroke-miterlimit:10"/><line style="fill:#FFFFFF;stroke:#000000;stroke-width:2;stroke-miterlimit:10" x1="6.1" y1="10" x2="13.9" y2="10"/></line></rect>';
                        break;
                    case "template":
                        content = diagram._renderEjTemplate("#" + icon.templateId, icon);
                } return content;
            }
        },
        _updateIcons: function (node, svg, diagram) {
            var expandicon = node.expandIcon;
            var collapseicon = node.collapseIcon;
            if (expandicon.shape != "none" || collapseicon.shape != "none") {
                var g;
                var width = node.width ? node.width : node._width || 0;
                var height = node.height ? node.height : node._height || 0;
                var name = node.name;
                var offX = 0, offY = 0, x = 0, y = 0, rAngle = 0;
                var visible = node.visible ? "visible" : "hidden";
                x = node.offsetX - width * node.pivot.x;
                y = node.offsetY - height * node.pivot.y;
                offX = node.offsetX;
                offY = node.offsetY;
                rAngle = node.rotateAngle;
                var attr = {
                    "id": name, "transform": "rotate(" + rAngle + "," + offX + "," + offY +
                            "),translate(" + x + "," + y + ")", "visibility": visible
                };
                var svg = diagram._adornerSvg;
                g = svg.g(attr);
                var expander = svg.document.parentNode.getElementsByClassName("ExpanderLayer")[0] || diagram._expander;
                if (expandicon != undefined && node.isExpanded) {
                    this._updateIcon(node, diagram._adornerSvg, g, expandicon, diagram);
                } if (collapseicon != undefined && !node.isExpanded) {
                    this._updateIcon(node, diagram._adornerSvg, g, collapseicon, diagram);
                }
            }
        },
        _updateIcon: function (node, svg, g, icon, diagram) {
            var attr, point;
            var d, x;
            if (icon != undefined && (node._scaled || node._updateExpander)) {
                point = ej.datavisualization.Diagram.Util._getIconPosition(icon, ej.datavisualization.Diagram.Util.bounds(node, true), true);
                if (icon.shape != "path") {
                    if (node._scaled || node._updateExpander) {
                        //drawingtemplate
                        this._renderExpanderTemplate(node, svg, icon, g, diagram, point, true);
                    }
                }
                else {
                    if (icon.shape == "path") {
                        var d = ej.datavisualization.Diagram.Geometry.updatePath(point.x - icon.width / 2, point.y - icon.height / 2, icon.width, icon.height, icon.pathData, svg);
                        var visible = node.visible ? "visible" : "hidden";
                        icon._absolutePath = d;
                        if (icon.margin.left && icon.margin.right)
                            icon.width -= (icon.margin.left || 0) + (icon.margin.right || 0);
                        if (icon.margin.top && icon.margin.bottom)
                            icon.height -= (icon.margin.top || 0) + (icon.margin.bottom || 0);
                        attr = {
                            "id": node.name + "_pathexpander",
                            "x": point.x, "y": point.y, "width": icon.width,
                            "height": icon.height, "fill": icon.borderColor, "stroke": icon.borderColor, "stroke-width": icon.borderWidth, "visibility": visible,
                            "d": d
                        };
                        svg.path(attr);
                    }
                }
                //image
                if (icon.shape == "image") {
                    var image = new Image();
                    image.src = icon.source;
                    var shape = svg.image(attr);
                    shape.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", image.src);
                    g.appendChild(shape);
                }

                node._updateExpander = false;
            }

        },
        _renderDecorator: function (name, point1, point2, connector, decorator, svg, g) {
            var shape;
            var attr;
            var d, x;
            var size = ej.datavisualization.Diagram.Size(decorator.width, decorator.height);
            switch (decorator.shape) {
                case "arrow":
                    d = this._constructArrow(point1, size);
                    attr = { "id": name, "class": "decorator", "d": d, "fill": decorator.fillColor, "stroke": decorator.borderColor, "stroke-width": decorator.borderWidth };
                    this._addCssClass(decorator, attr);
                    shape = svg.path(attr);
                    x = 1.1 * decorator.borderWidth;
                    break;
                case "openarrow":
                    d = this._constructArrow(point1, size, true);
                    attr = { "id": name, "class": "decorator", "d": d, "fill": "transparent", "stroke": decorator.borderColor, "stroke-width": decorator.borderWidth };
                    this._addCssClass(decorator, attr);
                    shape = svg.path(attr);
                    x = 1.1 * decorator.borderWidth;
                    break;
                case "circle":
                    var rx = size.width / 2;
                    var ry = size.height / 2;
                    attr = {
                        "id": name, "class": "decorator", "rx": rx, "ry": ry, "cx": (point1.x + size.width / 2), "cy": (point1.y),
                        "fill": decorator.fillColor, "stroke": decorator.borderColor, "stroke-width": decorator.borderWidth
                    };
                    this._addCssClass(decorator, attr);
                    shape = svg.ellipse(attr);
                    x = 0.5 * decorator.borderWidth;
                    break;
                case "diamond":
                    d = this._constructDiamond(point1, size, svg);
                    attr = {
                        "id": name, "class": "decorator", "x": point1.x, "y": point1.y, "width": size.width,
                        "height": size.height, "d": d, "fill": decorator.fillColor, "stroke": decorator.borderColor, "stroke-width": decorator.borderWidth
                    };
                    this._addCssClass(decorator, attr);
                    shape = svg.path(attr);
                    x = 0.7 * decorator.borderWidth;
                    break;
                case "path":
                    d = ej.datavisualization.Diagram.Geometry.updatePath(point1.x, point1.y - size.height / 2, size.width, size.height, decorator.pathData, svg);
                    decorator._absolutePath = d;
                    attr = {
                        "id": name, "class": "decorator", "x": point1.x, "y": point1.y, "width": size.width,
                        "height": size.height, "d": d, "fill": decorator.fillColor, "stroke": decorator.borderColor, "stroke-width": decorator.borderWidth
                    };
                    this._addCssClass(decorator, attr);
                    shape = svg.path(attr);
                    x = 0.5 * decorator.borderWidth;
                    break;
            }
            //apply translate matrix and rotate matrix here
            if (shape) {
                if (decorator.borderColor != "none") {
                    var angle = ej.datavisualization.Diagram.Geometry.findAngle(point1, point2);
                    var extra = ej.datavisualization.Diagram.Geometry.transform({ x: 0, y: 0 }, angle, x);
                    shape.setAttribute("transform", "translate(" + extra.x + "," + extra.y + "),rotate(" + angle + " " + point1.x + " " + point1.y + ")");
                }
                else
                    shape.setAttribute("transform", "rotate(" + ej.datavisualization.Diagram.Geometry.findAngle(point1, point2) + " " + point1.x + " " + point1.y + ")");
                g.appendChild(shape);
            }
        },

        _updateDecorators: function (connector, svg, diagram) {
            var startPoint;
            var endPoint;
            if (connector.targetDecorator && connector.targetDecorator.shape !== ej.datavisualization.Diagram.DecoratorShapes.None) {
                var segment = connector.segments[connector.segments.length - 1];
                var points = segment.points;
                startPoint = points[points.length - 2];
                endPoint = connector.targetPoint;
                if (segment.type == "bezier") {
                    startPoint = segment._point2;
                }
                if (connector.targetNode && diagram) {
                    var targetNode = diagram._findNode(connector.targetNode);
                    if (targetNode && targetNode.borderColor != "none")
                        endPoint = ej.datavisualization.Diagram.Util._adjustPoint(connector.targetPoint, startPoint, true, targetNode.borderWidth / 2);
                }
                this._updateDecorator(connector.name + "_targetDecorator", endPoint, startPoint, connector, connector.targetDecorator, svg);
            }
            if (connector.sourceDecorator && connector.sourceDecorator.shape !== ej.datavisualization.Diagram.DecoratorShapes.None) {
                var segment = connector.segments[0];
                var points = segment.points;
                startPoint = connector.sourcePoint;
                endPoint = points[1];
                if (segment.type == "bezier") {
                    endPoint = segment._point1;
                }
                if (connector.sourceNode && diagram) {
                    var sourceNode = diagram._findNode(connector.sourceNode);
                    if (sourceNode.borderColor != "none")
                        startPoint = ej.datavisualization.Diagram.Util._adjustPoint(connector.sourcePoint, endPoint, true, sourceNode.borderWidth / 2);
                }
                this._updateDecorator(connector.name + "_sourceDecorator", startPoint, endPoint, connector, connector.sourceDecorator, svg);
            }
        },

        _updateDecorator: function (name, point1, point2, connector, decorator, svg) {
            var shape;
            var attr;
            var d, x;
            var size = ej.datavisualization.Diagram.Size(decorator.width, decorator.height);

            switch (decorator.shape) {
                case "arrow":
                    d = this._constructArrow(point1, size);
                    attr = { "id": name, "d": d };
                    shape = svg.path(attr);
                    x = 1.1 * decorator.borderWidth;
                    break;
                case "openarrow":
                    d = this._constructArrow(point1, size, true);
                    attr = { "id": name, "d": d, "fill": "transparent", "stroke": decorator.borderColor, "stroke-width": decorator.borderWidth };
                    shape = svg.path(attr);
                    x = 1.1 * decorator.borderWidth;
                    break;
                case "circle":
                    var rx = size.width / 2;
                    var ry = size.height / 2;
                    attr = { "id": name, "rx": rx, "ry": ry, "cx": (point1.x + size.width / 2), "cy": (point1.y), "fill": decorator.fillColor, "stroke": decorator.borderColor, "stroke-width": decorator.borderWidth };
                    shape = svg.ellipse(attr);
                    x = 0.5 * decorator.borderWidth;
                    break;
                case "diamond":
                    d = this._constructDiamond(point1, size, svg);
                    attr = { "id": name, "x": point1.x, "y": point1.y, "width": size.width, "height": size.height, "d": d, "fill": decorator.fillColor, "stroke": decorator.borderColor, "stroke-width": decorator.borderWidth };
                    shape = svg.path(attr);
                    x = 0.7 * decorator.borderWidth;
                    break;
                case "path":
                    d = ej.datavisualization.Diagram.Geometry.updatePath(point1.x, point1.y - size.height / 2, size.width, size.height, decorator.pathData, svg);
                    decorator._absolutePath = d;
                    attr = {
                        "id": name, "d": d
                    };
                    shape = svg.path(attr);
                    x = 0.5 * decorator.borderWidth;
                    break;
            }
            //apply translate matrix and rotate matrix here
            if (shape) {
                if (decorator.borderColor != "none") {
                    var angle = ej.datavisualization.Diagram.Geometry.findAngle(point1, point2);
                    var extra = ej.datavisualization.Diagram.Geometry.transform({ x: 0, y: 0 }, angle, x);
                    shape.setAttribute("transform", "translate(" + extra.x + "," + extra.y + "),rotate(" + angle + " " + point1.x + " " + point1.y + ")");
                }
                else
                    shape.setAttribute("transform", "rotate(" + ej.datavisualization.Diagram.Geometry.findAngle(point1, point2) + " " + point1.x + " " + point1.y + ")");
            }
        },

        _constructArrow: function (point, size, isOpen) {
            var path = new ej.datavisualization.Diagram.Path();
            path.moveTo(point.x + size.width, point.y + size.height / 2);
            path.lineTo(point.x, point.y);
            path.lineTo(point.x + size.width, point.y - size.height / 2);
            if (!isOpen) {
                path.close();
            }
            return path.toString();
        },

        _constructDiamond: function (point, size, svg) {
            var path = new ej.datavisualization.Diagram.Path();
            path.moveTo(point.x + size.width, point.y);
            path.lineTo(point.x + size.width / 2, point.y + size.height / 2);
            path.lineTo(point.x, point.y);
            path.lineTo(point.x + size.width / 2, point.y - size.height / 2);
            path.lineTo(point.x + size.width, point.y);
            var d = path.toString();
            return d;
        },
        //#endregion

        //#region Render Label
        _addLabel: function (node, label, panel, diagram, index) {
            if (diagram && diagram.model.labelRenderingMode == ej.datavisualization.Diagram.LabelRenderingMode.Svg) {
                var container = this._renderSVGLabel(node, label, panel, diagram);
                if (index != undefined) {
                    if (index != node.labels.length - 1 && !(index > node.labels.length - 1)) {
                        var currentLabel = node.labels[index];
                        if (currentLabel) {
                            var curLblElement = diagram._svg.document.getElementById(node.name + "_" + currentLabel.name + "_lblbg");
                            var labelBG = diagram._svg.document.getElementById(node.name + "_" + label.name + "_lblbg");
                            var labelEle = diagram._svg.document.getElementById(node.name + "_" + label.name);
                            if (curLblElement && labelBG)
                                curLblElement.parentNode.insertBefore(labelBG, curLblElement);
                            if (labelEle && labelEle)
                                curLblElement.parentNode.insertBefore(labelEle, curLblElement);
                        }
                    }
                }
            }
            else {
                var width, height, x, y;
                var bounds = ej.datavisualization.Diagram.Util.bounds(node);
                width = bounds.width;
                height = bounds.height;
                x = bounds.x; y = bounds.y;
                var element;
                var htmlLayer = panel.document.parentNode.getElementsByClassName("htmlLayer")[0];
                element = $(htmlLayer).children("#" + node.name + "_label")[0];
                var classname = node._type === "node" ? "ej-d-node" : (node._type === "group" ? "ej-d-group" : "ej-d-connector");
                if (!element) {
                    element = document.createElement("div");
                    var style = "width:" + width + "px; height:" + height + "px; left:" + x + "px; top:" + y + "px; display: block; position: absolute; pointer-events: none; " + "; padding: inherit;";
                    var class1 = node._type === "node" ? "ej-d-node" : (node._type === "group" ? "ej-d-group" : "ej-d-connector");
                    if (node._isClassifier)
                        class1 += " " + "ej-d-classifier";
                    ej.datavisualization.Diagram.Util.attr(element, { "id": node.name, "class": class1, "style": style });
                    if (node.rotateAngle) {
                        element.style.webkitTransform = "rotate(" + node.rotateAngle + "deg) ";
                        element.style.MozTransform = "rotate(" + node.rotateAngle + "deg) ";
                        element.style.OTransform = "rotate(" + node.rotateAngle + "deg) ";
                        element.style.msTransform = "rotate(" + node.rotateAngle + "deg)";
                        element.style.transform = "rotate(" + node.rotateAngle + "deg) ";
                        element.style["transform-origin"] = node.pivot.x * 100 + "% " + node.pivot.y * 100 + "%";

                    }
                    if (htmlLayer) htmlLayer.appendChild(element);
                }
                ej.datavisualization.Diagram.Util.attr(element, { "id": node.name + "_label", "class": classname });
                var container = this._renderLabel(node, bounds, label, element, htmlLayer, panel, width, height, diagram);
                if (index != undefined) {
                    element.insertBefore(container, element.childNodes[index]);
                }
            }
        },
        _getCharBoundsValues: function (char, label, svg, node, index) {

            var attr = {
                "id": node.name + "_" + label.name + "temp",
                "class": "ej-d-label", "font-family": label.fontFamily,
                "font-size": label.fontSize,

            };
            var textElement = svg.text(attr);
            svg.document.appendChild(textElement);
            var tspan = svg.tspan({
                "id": node.name + "_" + label.name + "temp_snap"
            });
            tspan.textContent = char;
            textElement.appendChild(tspan);
            var normal = textElement.childNodes[0].getComputedTextLength();

            attr["font-style"] = "normal";
            attr["font-weight"] = "bold";
            svg.text(attr);
            var bold = textElement.childNodes[0].getComputedTextLength();

            attr["font-style"] = "italic";
            attr["font-weight"] = "normal";
            svg.text(attr);
            var italic = textElement.childNodes[0].getComputedTextLength();

            attr["font-style"] = "italic";
            attr["font-weight"] = "bold";
            svg.text(attr);
            var boldItalic = textElement.childNodes[0].getComputedTextLength();
            svg.document.removeChild(textElement);
            if (char == " ") {
                if (label.text) {
                    var pre = label.text[index - 1] && label.text[index - 1] != "\n" ? label.text[index - 1] : "W";
                    var next = label.text[index + 1] && label.text[index + 1] != "\n" ? label.text[index + 1] : "W";
                }
                var forSpace1 = this._getCharBoundsValues(pre, label, svg, node, index);
                var forSpace2 = this._getCharBoundsValues(next, label, svg, node, index);
                var forSpace3 = this._getCharBoundsValues(pre + " " + next, label, svg, node, index);
                return {
                    normal: forSpace3.normal - (forSpace1.normal + forSpace2.normal),
                    bold: forSpace3.bold - (forSpace1.bold + forSpace2.bold),
                    italic: forSpace3.italic - (forSpace1.italic + forSpace2.italic),
                    boldItalic: forSpace3.boldItalic - (forSpace1.boldItalic + forSpace2.boldItalic)
                }
            }
            return {
                normal: normal, bold: bold, italic: italic, boldItalic: boldItalic
            }
            return Wbounds;
        },

        _updateHashTableValues: function (textSeries, fontTable, label, node, svg, diagram) {

            for (var j = 0; j < textSeries.length; j++) {
                if (!fontTable[textSeries[j]]) {
                    var cchar = textSeries[j] == "\n" ? "new_space_line" : textSeries[j];
                    fontTable[cchar] = this._getCharBoundsValues(textSeries[j], label, svg, node, j);
                }
            }
        },
        _updateHashTable: function (label, node, svg, diagram, isTextOverFlow) {
            if (label && svg && diagram) {
                if (label.wrapping == ej.datavisualization.Diagram.TextWrapping.Wrap || isTextOverFlow) {
                    if (label.text != "" || label.hyperlink != "") {
                        var text = label.text ? label.text : label.hyperlink;
                        var fontTable = diagram._labelHashTable[label.fontFamily];
                        if (!fontTable)
                            fontTable = diagram._labelHashTable[label.fontFamily] = {};
                        this._updateHashTableValues(text, fontTable, label, node, svg, diagram)
                    }
                }
                else if (label.wrapping == ej.datavisualization.Diagram.TextWrapping.WrapWithOverflow) {
                    var text = label.text ? label.text : label.hyperlink;
                    var newLines = text.split("\n");
                    for (var i = 0; i < newLines.length; i++) {
                        var newLine = newLines[i];
                        var textSeries = newLine.split(" ");
                        var fontTable = diagram._labelHashTable[label.fontFamily];
                        if (!fontTable)
                            fontTable = diagram._labelHashTable[label.fontFamily] = {};
                        this._updateHashTableValues(textSeries, fontTable, label, node, svg, diagram);
                        this._updateHashTableValues([" "], fontTable, label, node, svg, diagram);
                    }
                    fontTable["new_space_line"] = this._getCharBoundsValues(" ", label, svg, node);
                }
            }
        },

        _getSuitableLabelSize: function (label, char, diagram) {
            char = (char == "\n" || char === ".") ? "new_space_line" : char;
            var hashChar = diagram._labelHashTable[label.fontFamily][char];
            if (label.bold && label.italic)
                return hashChar.boldItalic;
            if (label.bold)
                return hashChar.bold;
            if (label.italic)
                return hashChar.italic;
            else
                return hashChar.normal;
            return;
        },
        _postionConnectorTextElement: function (node, label, textElement, svg, diagram) {
            var x = 0;
            var y = 0;
            var nodeBounds = ej.datavisualization.Diagram.Util.bounds(node);
            var textBounds = textElement.getBBox();
            var wideTextBounds = this._getCharBoundsValues("W", label, svg, node);
            var hAlign = label.horizontalAlignment;
            var vAlign = label.verticalAlignment;
            var relatetiveMode = false;
            if (node.segments && label.relativeMode == "segmentpath") {
                var obj = this._getConnectorHandlePosition(label, node, 1, diagram);
                var pt = obj.position;
                x = pt.x;
                y = pt.y;
                var alignment = ej.datavisualization.Diagram.Util._alignLabelOnSegments(node, label, diagram, obj);
                vAlign = alignment.vAlign; hAlign = alignment.hAlign
                relatetiveMode = true;
                switch (hAlign) {
                    case "left":
                        x = 0 + label.margin.left;
                        break;
                    case "right":
                        x = - textBounds.width - label.margin.right;
                        break;
                    case "center":
                        x = x + (-textBounds.width / 2) + (label.margin.left - label.margin.right);
                        break;
                    case "stretch":
                        x = (textBounds.width / 2);
                        break;
                }
                switch (vAlign) {
                    case "top":
                        y = 0 + label.margin.top;
                        break;
                    case "bottom":
                        y = -textBounds.height - label.margin.bottom;
                        break;
                    case "center":
                        y = y + (-textBounds.height / 2) + (label.margin.top - label.margin.bottom);
                        break;
                    case "stretch":
                        y = (textBounds.height / 2);
                        break;
                }
            }
            else {

                switch (hAlign) {
                    case "left":
                        x = textBounds.width / 2;
                        break;
                    case "right":
                        x = -textBounds.width / 2;
                        break;
                }
                switch (vAlign) {
                    case "top":
                        y = textBounds.height / 2;
                        break;
                    case "bottom":
                        y = -textBounds.height / 2;
                        break;
                }
                if (node.segments) {
                    x += nodeBounds.left;
                    y += nodeBounds.top;
                }
                x = x + (nodeBounds.width * label.offset.x);
                y = y + (nodeBounds.height * label.offset.y) - 2;
            }
            if (!label.relativeMode == "segmentpath") {
                x = x * (label.offset.x ? (label.offset.x / 0.5) : 0);
                y = y * (label.offset.y ? (label.offset.y / 0.5) : 0) + label.fontSize;
                var x = x + (nodeBounds.center.x - nodeBounds.width / 2);
                var y = y + (nodeBounds.center.y - nodeBounds.height / 2);
            }
            this._updateLabelBackground(x, y + label.fontSize, textBounds, node, label, textElement, svg, diagram);
            if (node.segments && node.segments.length > 0) {
                textElement.setAttribute("transform", "translate(" + x + "," + (y - 2) + ") rotate(" + label.rotateAngle + " " + (textBounds.x + (textBounds.width / 2)) + " " + (textBounds.y + (textBounds.height / 2)) + ")");
            }
            else {
                textElement.setAttribute("transform", "translate(" + x + "," + (y - 2) + ") rotate(" + label.rotateAngle + " " + (textBounds.x + (textBounds.width / 2)) + " " + (textBounds.y + (textBounds.height / 2)) + ")");
            }
        },

        _postionNodeTextElement: function (node, label, textElement, svg, diagram) {
            var x = 0;
            var y = 0;
            var nodeBounds = ej.datavisualization.Diagram.Util.bounds(node);
            var textBounds = textElement.getBBox();
            var textBounds1 = ej.datavisualization.Diagram.Rectangle(textBounds.x, textBounds.y, textBounds.width, textBounds.height);
            if (textBounds1.height >= 2)
                textBounds1.height -= 2;
            var wideTextBounds = this._getCharBoundsValues("W", label, svg, node);

            switch (label.horizontalAlignment) {
                case "left":
                    x = 0 + label.margin.left;
                    break;
                case "right":
                    x = -textBounds1.width - label.margin.right;
                    break;
                case "center":
                    x = (-textBounds1.width / 2) + (label.margin.left - label.margin.right);
                    break;
                case "stretch":
                    x = -(textBounds1.width / 2);
                    break;
            }
            switch (label.verticalAlignment) {
                case "top":
                    y = 0 + label.margin.top;
                    break;
                case "bottom":
                    y = -textBounds1.height - label.margin.bottom;
                    break;
                case "center":
                    y = (-textBounds1.height / 2) + (label.margin.top - label.margin.bottom);
                    break;
                case "stretch":
                    y = -(textBounds1.height / 2);
                    break;
            }
            x = x + (nodeBounds.width * label.offset.x);
            y = y + (nodeBounds.height * label.offset.y) - 2;

            this._updateLabelBackground(x, y + label.fontSize, textBounds1, node, label, textElement, svg, diagram);
            if (node.segments && node.segments.length > 0) {
                textElement.setAttribute("transform", "translate(" + (nodeBounds.center.x - (textBounds1.width / 2)) + "," + (nodeBounds.center.y - (textBounds1.height / 2) + label.fontSize) + ")");
            }
            else {
                if (node.type === "group" || (node.children && node.children.length > 0)) {
                    var pt = ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY);
                    var width = node.width ? node.width : node._width;
                    var height = node.height ? node.height : node._height;
                    var x = x + (node.offsetX - node.width / 2);
                    var y = y + (node.offsetY - node.height / 2);
                    var angle = node.rotateAngle + label.rotateAngle;
                    textElement.setAttribute("transform", "rotate(" + angle + "," + pt.x + "," + pt.y + "),translate(" + x + "," + y + ")");
                }
                else
                    textElement.setAttribute("transform", "translate(" + x + "," + y + ") rotate(" + label.rotateAngle + " " + (textBounds1.x + (textBounds1.width / 2)) + " " + (textBounds1.y + (textBounds1.height / 2)) + ")");
            }
        },
        _postionSpanElement: function (node, label, textElement, svg, diagram) {
            for (var i = 0; i < textElement.childNodes.length; i++) {
                var child = textElement.childNodes[i];
                if (child) {
                    var position = this._getSVGTextAlignPosition(child, node, label, textElement, svg, diagram);
                    child.setAttribute("x", position.x);
                }
            }
        },
        _getSVGTextAlignPosition: function (child, node, label, textElement, svg, diagram) {
            var x = 0, y = 0;
            if (child && label) {
                var width = child.getAttribute("totalWidth");
                if (width)
                    width = Number(width);
                else
                    width = child.getComputedTextLength();
                var textBounds = textElement.getBBox();
                switch (label.textAlign) {
                    case "left":
                        x = (textBounds.x);
                        break;
                    case "right":
                        x = (textBounds.x + textBounds.width) - (width);
                        break;
                    case "center":
                    case "justify":
                        x = (textBounds.x + textBounds.width / 2) - (width / 2);
                        break;
                }
            }
            return {
                x: x, y: y
            };

        },
        _updateTspanElement: function (node, label, textElement, svg, diagram) {
            this._postionSpanElement(node, label, textElement, svg, diagram);
            if (node.segments && node.segments.length > 0)
                this._postionConnectorTextElement(node, label, textElement, svg, diagram);
            else
                this._postionNodeTextElement(node, label, textElement, svg, diagram);
        },
        _updateLabelBackground: function (x, y, textBounds, node, label, textElement, svg, diagram) {
            var height = label.verticalAlignment === "stretch" ? node.height - 2 : textBounds.height;
            var width = label.horizontalAlignment === "stretch" ? node.width - 2 : textBounds.width;
            x = label.horizontalAlignment === "stretch" ? 1 : x;
            y = label.verticalAlignment === "stretch" ? 1 : y - label.fontSize;
            var labelbg = $("#" + node.name + "_" + label.name + "_lblbg")[0];
            var attr = {
                id: node.name + "_" + label.name + "_lblbg",
                height: height, width: width,
                x: x, y: y,
                "transform": "rotate(" + label.rotateAngle + " " + (x + width / 2) + " " + (y + height / 2) + ")"
            };
            if (node.type === "group" || (node.children && node.children.length > 0)) {
                var pt = ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY);
                var x = x + (node.offsetX - node.width / 2);
                var y = y + (node.offsetY - node.height / 2);
                var angle = node.rotateAngle + label.rotateAngle;
                attr.x = 0;
                attr.y = 0;
                attr.transform = "rotate(" + angle + "," + pt.x + "," + pt.y + "),translate(" + x + "," + y + ")";
            }
            svg.rect(attr);
        },
        _renderLabelSpanElement: function (textElement, node, label, svg, diagram, palette) {
            if (!label.templateId) {
                this._updateHashTable(label, node, svg, diagram);
                if (textElement)
                    textElement.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
                if (label.wrapping == ej.datavisualization.Diagram.TextWrapping.Wrap) {
                    this._svgTextWrapping(textElement, node, label, svg, diagram, palette);
                }
                else if (label.wrapping == ej.datavisualization.Diagram.TextWrapping.WrapWithOverflow) {
                    this._svgWordWrapping(textElement, node, label, svg, diagram, palette);
                }
                else {
                    var tspan = svg.tspan();
                    textElement.appendChild(tspan);
                    tspan.setAttribute("x", "0px");
                    tspan.setAttribute("y", "0px");
                    if (label.textOverflow) {
                        var labelSize = this._getLabelSize(label, node, diagram);
                        this._updateOverFlowTspan(textElement, node, label, svg, diagram, palette, label.text, tspan, labelSize)
                    }
                    else
                        tspan.textContent = label.text;

                }
                this._updateTspanElement(node, label, textElement, svg, diagram);
            }
        },
        _getLabelSize: function (label, node, diagram) {
            var bounds = ej.datavisualization.Diagram.Util.bounds(node);
            return Math.max(label.width, bounds.width);
        },
        _svgTextWrapping: function (textElement, node, label, svg, diagram, palette) {
            var nodeBounds = ej.datavisualization.Diagram.Util.bounds(node);
            var fontSize = label.fontSize + 2;
            var tspan = svg.tspan();
            tspan.setAttribute("x", "0px");
            if (textElement.childNodes && textElement.childNodes.length === 0)
                tspan.setAttribute("dy", fontSize - 2);
            else
                tspan.setAttribute("dy", fontSize);
            textElement.appendChild(tspan);
            var totawidth = 0
            var text = label.text ? label.text : label.hyperlink;
            tspan.textContent += text[0];
            var labelSize = this._getLabelSize(label, node, diagram);
            totawidth += (this._getSuitableLabelSize(label, text[0], diagram) * (label.fontSize / label.fontSize));
            for (var i = 1; i < text.length; i++) {
                if (text[i] == "\n" || totawidth + (this._getSuitableLabelSize(label, text[i], diagram) * (label.fontSize / label.fontSize)) >= labelSize) {
                    if (label.textOverflow) {
                        if (label.overflowType == "ellipsis") {
                            tspan.textContent = tspan.textContent.substr(0, tspan.textContent.length - 3);
                            tspan.textContent += "...";
                        }
                        return false;
                    }
                    else {
                        if (textSeries.length - 1 > j || totawidth > 0) {
                        tspan.setAttribute("totalWidth", totawidth);
                        var tspan = svg.tspan();
                        textElement.appendChild(tspan);
                        var textElementBounds = textElement.getBBox();
                        tspan.setAttribute("x", "0px");
                            tspan.setAttribute("y", fontSize);
                        }
                        if (text[i] != "\n") {
                            tspan.textContent += text[i];
                            totawidth = (this._getSuitableLabelSize(label, text[i], diagram) * (label.fontSize / label.fontSize));
                        }
                        else totawidth = 0;
                    }
                }
                else {
                    tspan.textContent += text[i];
                    totawidth += (this._getSuitableLabelSize(label, text[i], diagram) * (label.fontSize / label.fontSize));
                }
            }
        },
        _updateOverFlowTspan: function (textElement, node, label, svg, diagram, palette, newLine, tspan, labelSize) {
            var textSeries = newLine;
            this._updateHashTable(label, node, svg, diagram, true);
            var eTextWidth = 0, eText = "", eTspanText = "", eDotWidth = 0;
            if (label.overflowType == "ellipsis")
                eDotWidth = (this._getSuitableLabelSize(label, ".", diagram) * (label.fontSize / 12)) * 3;
            for (var e = 0; e < textSeries.length; e++) {
                eText = textSeries[e];
                eTextWidth += (this._getSuitableLabelSize(label, eText, diagram) * (label.fontSize / 12));
                if (eTextWidth + eDotWidth >= labelSize)
                    break;
                eTspanText += eText;
            }
            tspan.textContent = eTspanText + ((label.overflowType == "ellipsis") ? "..." : "");
        },
        _svgWordWrapping: function (textElement, node, label, svg, diagram, palette) {
            var nodeBounds, tspan, totawidth = 0, text;
            nodeBounds = ej.datavisualization.Diagram.Util.bounds(node);
            var newLines = label.text ? label.text.split("\n") : label.hyperlink.split("\n");
            var fontSize = label.fontSize + 2;
            for (var i = 0; i < newLines.length; i++) {
                var textElementBounds = textElement.getBBox();
                var tspan = svg.tspan();
                tspan.setAttribute("x", "0px");
                if (textElement.childNodes && textElement.childNodes.length === 0)
                    tspan.setAttribute("dy", fontSize - 2);
                else
                    tspan.setAttribute("dy", fontSize);
                textElement.appendChild(tspan);
                var newLine = newLines[i];
                totawidth = 0;
                var labelSize = this._getLabelSize(label, node, diagram);
                if (newLine === " ") {
                    tspan.textContent = '\u00a0';
                }
                else {
                    var textSeries = newLine.split(" ");
                    for (var j = 0; j < textSeries.length; j++) {
                        //totawidth += (this._getSuitableLabelSize(label, "new_space_line", diagram) * (label.fontSize / 12));
                        if (totawidth + (this._getSuitableLabelSize(label, textSeries[j], diagram) * (label.fontSize / label.fontSize)) >= labelSize) {
                            if (label.textOverflow) {
                                this._updateOverFlowTspan(textElement, node, label, svg, diagram, palette, newLine, tspan, labelSize);
                                break;
                            }
                            else {
                                if (textSeries.length - 1 > j || totawidth > 0) {
                                    tspan.setAttribute("totalWidth", totawidth);
                                    var tspan = svg.tspan();
                                    textElement.appendChild(tspan);
                                    var textElementBounds = textElement.getBBox();
                                    tspan.setAttribute("x", "0");
                                    tspan.setAttribute("dy", fontSize);
                                }
                                if (textSeries[j] != "\n") {
                                    tspan.textContent += textSeries[j];
                                    totawidth = (this._getSuitableLabelSize(label, textSeries[j], diagram) * (label.fontSize / label.fontSize));
                                }
                                else
                                    totawidth = 0;
                            }
                        }
                        else {
                            if (totawidth) {
                                tspan.textContent += " ";
                                totawidth += (this._getSuitableLabelSize(label, " ", diagram) * (label.fontSize / label.fontSize));
                            }
                            tspan.textContent += textSeries[j];
                            totawidth += (this._getSuitableLabelSize(label, textSeries[j], diagram) * (label.fontSize / label.fontSize));
                        }
                    }
                }
            }
        },
        _renderLabelSVG: function (node, label, svg, diagram, palette) {
            var nodeElement = svg.getElementById(node.name);
            var html = diagram._renderEjTemplate("#" + label.templateId, label);
            var div = document.createElement('div');
            div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><g class="ej-label-template" id=' + node.name + "_" + label.name + '>' + html + '</g></svg>';
            document.body.appendChild(div);
            var content = document.getElementById(node.name + "_" + label.name).cloneNode(true);
            nodeElement.appendChild(content);
            div.parentNode.removeChild(div);
            return content;
        },
        _renderSVGLabel: function (node, label, svg, diagram, palette) {
            var nodeElement = svg.getElementById(node.name);
            if (label.templateId && label.templateType === ej.datavisualization.Diagram.TemplateType.Svg) {
                this._renderLabelSVG(node, label, svg, diagram, palette);
                this._updateSVGTemplate(node, label, svg, diagram, palette);
            }
            else {
                var attr = {
                    "id": node.name + "_" + label.name + "_lblbg",
                    "fill": node._isHeader ? "transparent" : label.fillColor,
                    "stroke": label.borderColor, "stroke-width": label.borderWidth,
                    "pointer-events": "none",
                    "visibility": label.visible ? "visible" : "hidden",
                    "fill-opacity": label.opacity,
                    "stroke-opacity": label.opacity,
                };

                var background = svg.rect(attr);
                nodeElement.appendChild(background);
                attr = {
                    "id": node.name + "_" + label.name,
                    "class": "ej-d-label", "font-family": label.fontFamily,
                    "font-size": label.fontSize,
                    "fill": label.hyperlink !== "" ? "blue" : label.fontColor,
                    "text-decoration": label.hyperlink !== "" ? "underline" : label.textDecoration,
                    "font-weight": label.bold ? "bold" : "normal",
                    "font-style": label.italic ? "italic" : "normal",
                    "visibility": label.visible ? "visible" : "hidden",
                    "fill-opacity": label.opacity,
                    "stroke-opacity": label.opacity,
                };
                this._addCssClass(label, attr);
                if (label.hyperlink) {
                    var anchor = document.createElementNS("http://www.w3.org/2000/svg", "a");
                    anchor.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", label.hyperlink);
                    anchor.setAttribute("target", '_blank');
                    anchor.setAttribute("class", "ej-d-anchor");
                    var textElement = svg.text(attr);
                    anchor.appendChild(textElement);
                    nodeElement.appendChild(anchor);
                }
                else {
                    var textElement = svg.text(attr);
                    nodeElement.appendChild(textElement);
                }
                this._renderLabelSpanElement(textElement, node, label, svg, diagram, palette);
            }
            return nodeElement;
        },
        _renderSVGLabels: function (node, svg, diagram, palette) {
            if (node.labels.length && node.type != "text") {
                var labels = node.labels;
                for (var i = 0; i < labels.length; i++) {
                    this._renderSVGLabel(node, labels[i], svg, diagram, palette);
                }
            }
        },
        _updateLabelSpanElement: function (node, label, svg, diagram, palette) {
            var textElement = svg.getElementById(node.name + "_" + label.name);
            if (node.textBlock)
                textElement = svg.getElementById(node.name + "_shape_lblbg");
            if (textElement) {
                $(textElement).empty();
                this._updateHashTable(label, node, svg, diagram);
                if (label.wrapping == ej.datavisualization.Diagram.TextWrapping.Wrap) {
                    this._svgTextWrapping(textElement, node, label, svg, diagram, palette);
                }
                else if (label.wrapping == ej.datavisualization.Diagram.TextWrapping.WrapWithOverflow) {
                    this._svgWordWrapping(textElement, node, label, svg, diagram, palette);
                }
                else {
                    var tspan = svg.tspan();
                    textElement.appendChild(tspan);
                    tspan.setAttribute("x", "0px");
                    tspan.setAttribute("y", label.fontSize);
                    if (label.textOverflow) {
                        var labelSize = this._getLabelSize(label, node, diagram);
                        this._updateOverFlowTspan(textElement, node, label, svg, diagram, palette, label.text, tspan, labelSize)
                    }
                    else
                        tspan.textContent = label.text;
                }
                this._updateTspanElement(node, label, textElement, svg, diagram);
            }
        },
        _updateSVGTemplate: function (node, label, svg, diagram, palette) {

            var x = 0;
            var y = 0;
            var nodeBounds = ej.datavisualization.Diagram.Util.bounds(node);
            var templateElement = svg.document.getElementById(node.name + "_" + label.name)
            if (templateElement) {
                var templateBounds = templateElement.getBBox();
                if (node.segments && label.relativeMode == "segmentpath") {

                    var obj = this._getConnectorHandlePosition(label, node, 1, diagram);
                    var pt = obj.position;
                    x = pt.x;
                    y = pt.y;
                    var alignment = ej.datavisualization.Diagram.Util._alignLabelOnSegments(node, label, diagram, obj);
                    var vAlign = alignment.vAlign; var hAlign = alignment.hAlign
                    var relatetiveMode = true;
                    switch (hAlign) {
                        case "left":
                            x = x - templateBounds.x + label.margin.left;
                            break;
                        case "right":
                            x = x - templateBounds.width - label.margin.right;
                            break;
                        case "stretch":
                        case "center":
                            x = (x - (templateBounds.width / 2)) + label.margin.left - label.margin.right;
                            break;
                    }
                    switch (vAlign) {
                        case "top":
                            y = y - templateBounds.y + label.margin.top;
                            break;
                        case "bottom":
                            y = y - templateBounds.height + label.margin.bottom;
                            break;
                        case "stretch":
                        case "center":
                            y = (y - (templateBounds.height / 2)) + label.margin.top - label.margin.bottom;
                            break;
                    }
                }
                else {
                    switch (label.horizontalAlignment) {
                        case "left":
                            x = nodeBounds.width / 2 + label.margin.left;
                            break;
                        case "right":
                            x = nodeBounds.width / 2 - templateBounds.width;
                            break;
                        case "stretch":
                            x = (nodeBounds.width / 2) - (templateBounds.width / 2);
                            break;
                        case "center":
                            x = ((nodeBounds.width / 2)) - (templateBounds.width / 2);
                            break;
                    }
                    switch (label.verticalAlignment) {
                        case "top":
                            y = nodeBounds.height / 2;
                            break;
                        case "bottom":
                            y = nodeBounds.height / 2 - templateBounds.height;
                            break;
                        case "stretch":
                            y = (nodeBounds.height / 2) - (templateBounds.height / 2);
                            break;
                        case "center":
                            y = (nodeBounds.height / 2) - (templateBounds.height / 2);
                            break;
                    }
                    x = x * (label.offset.x ? (label.offset.x / 0.5) : 0) + label.margin.left - label.margin.right
                    y = y * (label.offset.y ? (label.offset.y / 0.5) : 0) + label.margin.top - label.margin.bottom;
                    if (node.segments) {
                        x += nodeBounds.left;
                        y += nodeBounds.top;
                    }
                }
                templateElement.setAttribute("transform", "translate(" + x + "," + y + ") rotate(" + label.rotateAngle + " " + (templateBounds.x + (templateBounds.width / 2)) + " " + (templateBounds.y + (templateBounds.height / 2)) + ")");
            }
        },
        _updateLabelTemplate: function (node, label, svg, diagram, palette) {
            if (label.templateId) {
                if (diagram && diagram.model.labelRenderingMode === ej.datavisualization.Diagram.LabelRenderingMode.Svg) {
                    var oldContent = svg.document.getElementById(node.name + "_" + label.name);
                    oldContent.parentNode.removeChild(oldContent);
                    var content = this._renderLabelSVG(node, label, svg, diagram, palette);
                    var attr = {
                        "visibility": label.visible && ej.datavisualization.Diagram.Util.enableLayerOption(node, "visible", diagram) ? "visible" : "hidden",
                        style: "opacity:" + label.opacity
                    }
                    ej.datavisualization.Diagram.Util.attr(content, attr);
                }
                else {
                    var htmlLayer = svg.document.parentNode.getElementsByClassName("htmlLayer")[0] || diagram._htmlLayer;
                    var parent = this._findChild(htmlLayer.childNodes, node);
                    var textContainter = $(parent).children("#" + node.name + "_" + label.name + "_lblbg")[0];
                    var html = diagram._renderEjTemplate("#" + label.templateId, label);
                    var templateContainer = textContainter.childNodes[0];
                    templateContainer.innerHTML = html;
                }
            }
        },
        _updateSVGLabel: function (node, label, svg, diagram, palette) {
            if (label.templateId) {
                var content = document.getElementById(node.name + "_" + label.name);
                if (content) {
                    var attr = {
                        "visibility": label.visible ? "visible" : "hidden",
                        style: "opacity:" + label.opacity
                    }
                }
                ej.datavisualization.Diagram.Util.attr(content, attr);
                this._updateSVGTemplate(node, label, svg, diagram, palette);
            }
            else {
                var attr = {
                    "id": node.name + "_" + label.name,
                    "class": "ej-d-label", "font-family": label.fontFamily,
                    "font-size": label.fontSize,
                    "fill": label.hyperlink !== "" ? "blue" : label.fontColor,
                    "text-decoration": label.hyperlink !== "" ? "underline" : label.textDecoration,
                };
                svg.text(attr);
                this._updateLabelSpanElement(node, label, svg, diagram, palette);
            }
        },
        _updateSVGLabels: function (node, svg, diagram, palette) {
            if (node.labels.length && node.type != "text") {
                var labels = node.labels;
                for (var i = 0; i < labels.length; i++) {
                    this._updateSVGLabel(node, labels[i], svg, diagram, palette);
                }
            }
        },
        _renderLabels: function (node, svg, diagram, palette) {
            if (diagram && diagram.model.labelRenderingMode != ej.datavisualization.Diagram.LabelRenderingMode.Svg) {
                if (node.labels.length && node.type != "text") {

                    var labels = node.labels;
                    var bounds = ej.datavisualization.Diagram.Util.bounds(node);
                    var width, height, x, y;
                    var element;
                    var isEleCreated = false;
                    for (var i = 0; i < labels.length; i++) {
                        if (node.labels[i].hyperlink)
                            this._renderSVGLabel(node, node.labels[i], svg, diagram, palette);
                        else {
                            if (!isEleCreated) {
                                isEleCreated = true;
                                var htmlLayer = svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                                element = $(htmlLayer).children("#" + node.name + "_label")[0];
                                if (element) htmlLayer.removeChild(element);
                                element = document.createElement("div");
                                if (!node.segments) {
                                    width = node.width ? node.width : node._width;
                                    height = node.height ? node.height : node._height;
                                    x = node.offsetX - width * node.pivot.x;
                                    y = node.offsetY - height * node.pivot.y;
                                }
                                else {
                                    width = bounds.width;
                                    height = bounds.height;
                                    x = bounds.x; y = bounds.y;
                                }
                                if (palette) {
                                    x = 0;
                                    y = 0;
                                }
                                var visibility = node.visible && ej.datavisualization.Diagram.Util.enableLayerOption(node, "visible", diagram) ? "visible" : "hidden";
                                var style = "width:" + width + "px; height:" + height + "px; left:" + x + "px; top:" + y + "px; display: block; position: absolute; pointer-events: none; " + "visibility:" + visibility + "; padding: inherit;";
                                var class1 = node._type === "node" ? "ej-d-node" : (node._type === "group" ? "ej-d-group" : "ej-d-connector");
                                if (node._isClassifier)
                                    class1 += " " + "ej-d-classifier";
                                ej.datavisualization.Diagram.Util.attr(element, {
                                    "id": node.name + "_label", "class": class1, "style": style
                                });
                                if (node.rotateAngle) {
                                    element.style.webkitTransform = "rotate(" + node.rotateAngle + "deg) ";
                                    element.style.MozTransform = "rotate(" + node.rotateAngle + "deg) ";
                                    element.style.OTransform = "rotate(" + node.rotateAngle + "deg) ";
                                    element.style.msTransform = "rotate(" + node.rotateAngle + "deg)";
                                    element.style.transform = "rotate(" + node.rotateAngle + "deg) ";
                                    element.style["transform-origin"] = node.pivot.x * 100 + "% " + node.pivot.y * 100 + "%";

                                }
                                if (htmlLayer) htmlLayer.appendChild(element);
                            }
                            this._renderLabel(node, bounds, labels[i], element, htmlLayer, svg, width, height, diagram)
                        }
                    }
                }
            }
            else {
                this._renderSVGLabels(node, svg, diagram, palette);
            }
        },
        _isParentVisible: function (name, svg) {
            var nodeEle = svg.document.getElementById(name);
            while (nodeEle && (nodeEle.getAttribute("class") != "DiagramLayer" || nodeEle.localName && nodeEle.localName !== "svg")) {
                if (nodeEle.localName && nodeEle.localName !== "svg")
                    break;
                if (nodeEle && (nodeEle.getAttribute("visibility") !== "visible"))
                    return true;
                nodeEle = nodeEle.parentNode;
            }
        },


        _renderLabel: function (node, nodeBounds, label, element, htmlLayer, svg, width, height, diagram) {
            var container = document.createElement("div");
            var text = document.createElement("span");
            if (label.templateId)
                var html = diagram._renderEjTemplate("#" + label.templateId, label);
            if (svg.document && svg.document.getAttribute("class") === "overview_svg")
                ej.datavisualization.Diagram.Util.attr(text, this._addCssClass(label, { "id": node.name + "_" + label.name, "class": "ej-d-label", "style": "display: inline-block; position: absolute; line-height: normal; pointer-events: none" }));
            else {
                var enabled = ej.datavisualization.Diagram.Util.canEnablePointerEvents(node, diagram);
                var class1 = "ej-d-label"
                if (node._isClassifier)
                    class1 += " " + "ej-d-classifier"
                ej.datavisualization.Diagram.Util.attr(text, this._addCssClass(label, { "id": node.name + "_" + label.name, "class": class1, "style": "display: inline-block; position: absolute; line-height: normal; pointer-events:" + (enabled ? "all" : "none") }));
            }
            if (label.horizontalAlignment == "stretch" || label.verticalAlignment == "stretch") {
                var actualDimensions = this._rotateLabel(width, height, label);
                if (label.horizontalAlignment == "stretch") text.style.width = Math.abs(actualDimensions.x) + "px";
                if (label.verticalAlignment == "stretch") {
                    text.style.alignItems = "center"; text.style.display = "flex"; text.style.justifyContent = "center"; text.style.height = Math.abs(actualDimensions.y) + "px";
                }
                if (label.textOverflow) {
                    text.style.display = "inline-block"
                    if (label.rotateAngle == 0 && node._isHeader) {
                        text.style.top = (Math.abs(actualDimensions.y) / 2 - label.fontSize / 2) + "px"
                        text.style.left = "0px"
                    }
                    else if (node._isHeader) {
                        text.style.left = (Math.abs(actualDimensions.y) / 2 - label.fontSize / 2) + "px"
                        text.style.top = "0px"
                    }
                }
            }
            if (label.bold) text.style.fontWeight = "bold";
            if (label.italic) text.style.fontStyle = "italic";
            if (!label.visible || this._isParentVisible(node.name, svg)) text.style.visibility = "hidden";
            text.style.opacity = label.opacity;
            text.style.textDecoration = label.textDecoration;
            text.style.fontFamily = label.fontFamily;
            text.style.fontSize = label.fontSize + "px";
            text.style.color = label.fontColor;
            text.style.backgroundColor = label.fillColor;
            text.style.borderColor = label.borderColor;
            text.style.borderWidth = label.borderWidth + "px";
            if (node._isHeader) {
                text.style.borderWidth = 0 + "px";
                text.style.backgroundColor = "transparent";
            }
            text.style.borderStyle = "solid";
            text.textContent = label.text;
            label.width =  width = width > label.width ? width : label.width;
            label.height =  height = height > label.height ? height : label.height;
            if (label.margin.left && label.margin.right) width -= (label.margin.left || 0) + (label.margin.right || 0);
            if (label.margin.top && label.margin.bottom) height -= (label.margin.top || 0) + (label.margin.bottom || 0);
            var style = "display: inline-block; position: absolute; pointer-events: none; " + "width:" + width + "px;height:" + height + "px;";
            ej.datavisualization.Diagram.Util.attr(container, { "id": node.name + "_" + label.name + "_lblbg", "style": style });
            if (!label.templateId) {
                container.appendChild(text);
                element.appendChild(container);
                this._alignTextOnLabel(node, nodeBounds, text, container, label, diagram, templateDiv);
            }
            if (label.templateId) {
                var templateDiv = document.createElement("div");
                templateDiv.setAttribute("class", "ej-label-template")
                templateDiv.setAttribute("id", node.name + "_" + label.name);
                templateDiv.innerHTML = html;
                container.appendChild(templateDiv);
                element.appendChild(container);
                var marginX, marginY;
                templateDiv.style.position = "absolute";
                this._alignTextOnLabel(node, nodeBounds, templateDiv, container, label, diagram);
            }

            return container;
        },

        _findChild: function (childNodes, node) {
            var length = childNodes.length;
            for (var i = 0; i < length; i++) {
                if (childNodes[i].id == node.name + "_label") {
                    return childNodes[i];
                }
            }
        },
        _updateLabels: function (node, svg, diagram) {
            if (diagram.model.labelRenderingMode == ej.datavisualization.Diagram.LabelRenderingMode.Svg) {
                if (!diagram._isSelectMode)
                    this._updateSVGLabels(node, svg, diagram);
            }
            else if (node.labels && node.type != "text") {
                var labels = node.labels;
                var bounds = ej.datavisualization.Diagram.Util.bounds(node);
                var width, height, x, y;
                var htmlLayer = diagram._htmlLayer ? diagram._htmlLayer : svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                if (htmlLayer) {
                    var parent = htmlLayer.childNodes[node.zOrder];
                    if (!parent || parent.id != node.name) {
                        var childNodes = htmlLayer.childNodes;
                        parent = this._findChild(childNodes, node, svg);
                    }
                }
                if (parent) {
                    if (!node.segments) {
                        width = node.width ? node.width : node._width;
                        height = node.height ? node.height : node._height;
                        x = node.offsetX - width * node.pivot.x;
                        y = node.offsetY - height * node.pivot.y;
                    }
                    else {
                        width = bounds.width; height = bounds.height;
                        x = bounds.x; y = bounds.y;
                    }
                    var visibility = node.visible && ej.datavisualization.Diagram.Util.enableLayerOption(node, "visible", diagram) ? "visible" : "hidden";
                    parent.style.width = width + "px";
                    parent.style.height = height + "px";
                    parent.style.left = x + "px";
                    parent.style.top = y + "px";
                    parent.style.opacity = node.opacity;
                    var transform = "rotate(" + node.rotateAngle + "deg) ";
                    var origin;
                    if (node.pivot)
                        origin = node.pivot.x * 100 + "% " + node.pivot.y * 100 + "%";
                    else
                        origin = 50 + "% " + 50 + "%";
                    parent.style.webkitTransform = transform;
                    parent.style.MozTransform = transform;
                    parent.style.OTransform = transform;
                    parent.style.msTransform = transform;
                    parent.style.transform = transform;
                    parent.style["transform-origin"] = parent.style["ms-transform-origin"] = parent.style["webkit-transform-origin"] =
                         parent.style["o-transform-origin"] = parent.style["moz-transform-origin"] = origin;
                    parent.style.visibility = visibility;
                }
                var textContainter, labelheight, labelwidth;
                for (var i = 0; i < labels.length; i++) {
                    if (node.labels[i].hyperlink) {
                        this._updateSVGLabel(node, node.labels[i], svg, diagram);
                    }
                    else if (parent) {
                        var label = labels[i];
                        textContainter = parent.childNodes[i];
                        if (textContainter) {
                            var text = textContainter.childNodes[0];
                            if (label.text || text.textContent) {
                                labelwidth = width > label.width ? width : label.width;
                                if (label.margin.left && label.margin.right) labelwidth -= (label.margin.left || 0) + (label.margin.right || 0);
                                if (label.margin.top && label.margin.bottom) labelheight -= (label.margin.top || 0) + (label.margin.bottom || 0);
                                textContainter.style.height = labelheight + "px";
                                textContainter.style.width = labelwidth + "px";
                                if (!label.templateId)
                                    text.textContent = label.text;
                                if (label.horizontalAlignment == "stretch" || label.verticalAlignment == "stretch") {
                                    var actualDimensions = this._rotateLabel(width, height, label);
                                    if (label.horizontalAlignment == "stretch") text.style.width = Math.abs(actualDimensions.x) + "px";
                                    if (label.verticalAlignment == "stretch") {
                                        text.style.alignItems = "center"; text.style.display = "flex"; text.style.justifyContent = "center"; text.style.height = Math.abs(actualDimensions.y) + "px";
                                    }
                                    if (label.textOverflow)
                                        text.style.display = "inline-block";
                                }
                                this._alignTextOnLabel(node, bounds, text, textContainter, label, diagram);
                            }
                            else if (node._isHeader) {
                                if (diagram && diagram.activeTool && diagram.activeTool.name === "move" && diagram.activeTool.inAction)
                                    text.style["pointer-events"] = "none";
                                else
                                    text.style["pointer-events"] = "all";
                            }
                        }
                    }
                }


            }
        },

        _alignTextOnPhase: function (node, bounds, text, label, svg) {
            if (svg.getElementById(node.name))
                var phaseBounds = svg.getElementById(node.name).getBoundingClientRect();
            if (phaseBounds) {
                var textbounds = text.getBBox();
                var background = svg.getElementById(node.name + "_" + label.name + "_lblbg");
                text.setAttribute("transform", "translate(" + -textbounds.width / 2 + "," + 50 + "), rotate(" + 0 + "," + 0 + "," + 0 + ")");
                text.setAttribute("pointer-events", "auto");
                if (background) {
                    var attr = {
                        "width": textbounds.width, "height": textbounds.height, "fill": label.fillColor,
                        "stroke": label.borderColor, "stroke-width": label.borderWidth,
                        "transform": "translate(" + -textbounds.width + "," + phaseBounds.top + "), rotate(" + 0 + "," + 0 + "," + 0 + ")"
                    };
                    ej.datavisualization.Diagram.Util.attr(background, attr);
                }
            }
        },

        updateLabel: function (node, label, svg, diagram) {
            if (typeof label.text === "string") {
                var textContainter, labelheight, labelwidth, width, height;
                var bounds = ej.datavisualization.Diagram.Util.bounds(node);
                var htmlLayer = diagram._htmlLayer || svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                var parent = $(htmlLayer).children("#" + node.name + "_label")[0];
                if (!node.segments) {
                    width = node.width ? node.width : node._width;
                    height = node.height ? node.height : node._height;
                }
                else {
                    width = bounds.width; height = bounds.height;
                }
                textContainter = $(parent).children("#" + node.name + "_" + label.name + "_lblbg")[0];
                if (textContainter) {
                    var text = textContainter.childNodes[0];
                    labelwidth = width > label.width ? width : label.width;
                    if (label.margin.left && label.margin.right) labelwidth -= (label.margin.left || 0) + (label.margin.right || 0);
                    if (label.margin.top && label.margin.bottom) labelheight -= (label.margin.top || 0) + (label.margin.bottom || 0);
                    textContainter.style.height = labelheight + "px";
                    textContainter.style.width = labelwidth + "px";
                    textContainter.style.opacity = node.opacity;
                    if (!label.templateId)
                        text.textContent = label.text;
                    text.style.opacity = label.opacity;
                    if (label.horizontalAlignment == "stretch" || label.verticalAlignment == "stretch") {
                        var actualDimensions = this._rotateLabel(width, height, label);
                        if (label.horizontalAlignment == "stretch") text.style.width = Math.abs(actualDimensions.x) + "px";
                        if (label.verticalAlignment == "stretch") {
                            text.style.alignItems = "center"; text.style.display = "flex"; text.style.justifyContent = "center"; text.style.height = Math.abs(actualDimensions.y) + "px";
                        }
                        if (label.textOverflow)
                            text.style.display = "inline-block";
                    } if (node.type == "node" && !node.width && !node.height)
                        this.updateNode(node, svg, diagram);
                    this._alignTextOnLabel(node, bounds, text, textContainter, label, diagram);
                }
                else {
                    this._updateLabelSpanElement(node, label, svg, diagram);
                }
            }
        },

        _alignTextOnLabel: function (node, nodeBounds, text, textContainter, label, diagram) {
            var actualDimensions, hAlign, vAlign, obj;
            if (node.segments && label.relativeMode == "segmentpath") {
                obj = this._getConnectorHandlePosition(label, node, 1, diagram);
                var pt = obj.position;
                var offset = {
                    x: (pt.x - nodeBounds.x) / nodeBounds.width,
                    y: (pt.y - nodeBounds.y) / nodeBounds.height
                };
                var alignment = ej.datavisualization.Diagram.Util._alignLabelOnSegments(node, label, diagram, obj);
                vAlign = alignment.vAlign; hAlign = alignment.hAlign;
            }
            else {
                var offset = { x: label.offset.x, y: label.offset.y };
                hAlign = label.horizontalAlignment;
                vAlign = label.verticalAlignment;
            }
            if (!ej.datavisualization.Diagram.Util.canEnablePointerEvents(node, diagram))
                text.style["pointer-events"] = "none";
            else if (diagram && diagram.activeTool && diagram.activeTool.name === "move" && diagram.activeTool.inAction)
                text.style["pointer-events"] = "none";
            else
                text.style["pointer-events"] = "all";
            var width = node.width ? node.width : node._width;
            var height = node.height ? node.height : node._height;
            width -= label.margin.left + label.margin.right;
            height -= label.margin.top + label.margin.bottom;
            actualDimensions = { x: width, y: height };
            if (label.textOverflow) {
                text.style.textOverflow = label.overflowType;
                text.style.overflow = "hidden";
                text.style.whiteSpace = "nowrap";
                text.style.width = width + "px";
            }
            if (label.rotateAngle) {
                var matrix = ej.Matrix.identity();
                ej.Matrix.rotate(matrix, label.rotateAngle, offset.x, offset.y);
                actualDimensions = ej.Matrix.transform(matrix, { x: width, y: height });
            }
            var x = 0, y = 0, marginX, marginY;
            var canMoveLabel = ej.datavisualization.Diagram.Util.canMoveLabel(node);
            if (label.wrapping == ej.datavisualization.Diagram.TextWrapping.NoWrap) {
                text.style.whiteSpace = "nowrap";
                text.style.wordWrap = "normal";
                text.style.maxWidth = "";
                text.style.maxHeight = "";
            }
            else {
                if (!label.templateId) {
                    if (!label.textOverflow) {
                        if (label.textAlign != "justify")
                            text.style.whiteSpace = "pre-wrap";
                        else text.style.whiteSpace = "pre-line";
                    }
                    if (label.wrapping == ej.datavisualization.Diagram.TextWrapping.Wrap) {
                        text.style.wordBreak = "break-all";
                        text.style.wordWrap = "break-word";
                        if (!node.segments) {
                            if (Math.abs(actualDimensions.x) < label.width) actualDimensions.x = label.width;
                            text.style.maxWidth = Math.abs(actualDimensions.x) + "px";
                            text.style.maxHeight = Math.abs(actualDimensions.y) + "px";
                        }
                        else text.style.maxWidth = (nodeBounds.width > label.width ? nodeBounds.width : label.width) + "px";
                    }
                    else {
                        text.style.wordWrap = "break-word";
                        text.style.maxWidth = "";
                        text.style.maxHeight = "";
                    }
                }
            }
            switch (hAlign) {
                case ej.datavisualization.Diagram.HorizontalAlignment.Left:
                    x = "0%";
                    marginX = label.margin.left + "px";
                    break;
                case ej.datavisualization.Diagram.HorizontalAlignment.Center:
                    x = "-50%";
                    marginX = label.margin.left - label.margin.right + "px";
                    break;
                case ej.datavisualization.Diagram.HorizontalAlignment.Right:
                    x = "-100%";
                    marginX = -label.margin.right + "px";
                    break;
                case ej.datavisualization.Diagram.HorizontalAlignment.Stretch:
                    x = "-50%";
                    break;
            }
            switch (vAlign) {
                case ej.datavisualization.Diagram.VerticalAlignment.Top:
                    y = "0%";
                    marginY = label.margin.top + "px";
                    break;
                case ej.datavisualization.Diagram.VerticalAlignment.Center:
                    y = "-50%";
                    marginY = label.margin.top - label.margin.bottom + "px";
                    break;
                case ej.datavisualization.Diagram.VerticalAlignment.Bottom:
                    y = "-100%";
                    marginY = -label.margin.bottom + "px";
                    break;
                case ej.datavisualization.Diagram.VerticalAlignment.Stretch:
                    y = "-50%";
                    break;
            }
            if (label.margin.left && label.margin.right && label.margin.top && label.margin.bottom && !node._isClassifier && !node._isClassMember) {
                text.style.marginLeft = marginX;
                text.style.marginTop = marginY;
            }
            else {
                textContainter.style.marginLeft = marginX;
                textContainter.style.marginTop = marginY;
            }
            offset.x *= 100;
            offset.y *= 100;
            text.style.textAlign = label.textAlign;
            text.style.webkitTransform = "translate(" + x + ", " + y + ") rotate(" + label.rotateAngle + "deg)";
            text.style.MozTransform = "translate(" + x + ", " + y + ") rotate(" + label.rotateAngle + "deg)";
            text.style.OTransform = "translate(" + x + ", " + y + ") rotate(" + label.rotateAngle + "deg)";
            text.style.msTransform = "translate(" + x + ", " + y + ") rotate(" + label.rotateAngle + "deg)";
            text.style.transform = "translate(" + x + ", " + y + ") rotate(" + label.rotateAngle + "deg)";

            if (label.horizontalAlignment != "stretch" && label.verticalAlignment != "stretch" && !(label.templateId)) {
                text.style.left = "0px";
                text.style.top = "0px";
            }
            if (textContainter) {
                textContainter.style.left = offset.x + "%";
                textContainter.style.top = offset.y + "%";
            }
        },

        _rotateLabel: function (width, height, label) {
            var actualDimensions = { x: width, y: height };
            if (label.rotateAngle) {
                var matrix = ej.Matrix.identity();
                ej.Matrix.rotate(matrix, label.rotateAngle, 0, 0);
                actualDimensions = ej.Matrix.transform(matrix, { x: width, y: height });
            }
            return actualDimensions;
        },
        _renderLabelGroup: function (node, svg, diagram) {
            if (node._type == "group") {
                for (var i = 0; i < node.children.length; i++) {
                    var child = diagram.nameTable[diagram._getChild(node.children[i])];
                    if (child._type == "group")
                        this._renderLabelGroup(child, svg, diagram);
                    else
                        this._renderLabelsAsSvg(child, svg, diagram);
                }
                this._renderLabelsAsSvg(node, svg, diagram);
            }
        },
        //#region Render labels as svg
        _renderLabelsAsSvg: function (node, svg, diagram) {
            var g = svg.document.getElementById(node.name);
            if (node.type === "text") {
                this._renderTextElementAsSvg(node, node.textBlock, g, svg, diagram);
            } else {
                for (var i = 0; i < node.labels.length; i++) {
                    this._renderTextElementAsSvg(node, node.labels[i], g, svg, diagram);
                }
            }
        },
        _renderTextElementAsSvg: function (node, label, g, svg, diagram) {
            var attr = {
                "id": node.name + "_" + label.name, "class": "ej-d-label", "font-family": label.fontFamily,
                "font-size": label.fontSize, "fill": label.fontColor, "text-decoration": label.textDecoration, "visibility": label.visible || node.type === "text" ? "visible" : "hidden",
                "pointer-events": "none"
            };
            if (label.bold)
                attr["font-weight"] = "bold";
            if (label.italic)
                attr["font-style"] = "italic";
            var text = svg.text(attr);
            text.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
            text.textContent = label.text;
            attr = {
                "id": node.name + "_" + label.name + "_lblbg",
                "fill": label.fillColor,
                "stroke": label.borderColor, "stroke-width": label.borderWidth, "transform": "translate(" + 0 + "," + 0 + ")"
            };
            var bg = svg.rect(attr);
            if (!label.text)
                return;
            g.appendChild(text);
            g.insertBefore(bg, text);
            var bounds = ej.datavisualization.Diagram.Util.bounds(node);
            var labelRotate = false;
            if (node._isHeader && label.rotateAngle) {
                if (diagram) {
                    var lane = diagram.nameTable[node.parent];
                    if (lane && lane.isLane) {
                        labelRotate = true;
                    }
                    var phaseStack = diagram.nameTable[node.parent];
                    if (phaseStack && phaseStack.isPhaseStack && !node.orientation == "vertical") {
                        labelRotate = true;
                    }
                }
            }

            this._wrapText(node, bounds, text, label, svg, labelRotate);
            this._alignTextOnSvgLabel(node, bounds, text, label, svg, diagram, labelRotate);
        },

        _alignTextOnSvgLabel: function (node, nodeBounds, text, label, svg, diagram, labelRotate) {
            var bounds = text.getBBox();
            var offset = ej.datavisualization.Diagram.Util._getLabelPosition(label, nodeBounds);
            if (labelRotate) {
                bounds = ej.datavisualization.Diagram.Util._rBounds(bounds, label.rotateAngle);
                offset = ej.datavisualization.Diagram.Util._getLabelPosition(label, nodeBounds, null, null, labelRotate, text);
            }
            if (labelRotate)
                point = offset;
            else
                var point = this._adjustOffsetWithTextBounds(node, label, text, offset, bounds, nodeBounds, diagram);
            var bWidth = label.borderWidth || 0;
            text.setAttribute("transform", "translate(" + (point.x + bWidth) + "," + (point.y + bWidth) + "), rotate(" + label.rotateAngle + "," + (offset.x - point.x) + "," + (offset.y - point.y) + ")");
            //Updates the label background
            var background = svg.getElementById(node.name + "_" + label.name + "_lblbg");
            if (background) {
                var x = point.x + bounds.x;
                var y = point.y;
                if (ej.browserInfo().name === "mozilla")
                    y = point.y + label.fontSize / 2;
                x = x + bWidth / 2;
                y = y + bWidth / 2;
                var attr = {
                    "width": bounds.width + bWidth, "height": bounds.height + bWidth, "transform": "translate(" + x + "," + y + "), rotate(" + label.rotateAngle + "," + (offset.x - x) + "," + (offset.y - y) + ")", "fill": label.fillColor ? label.fillColor : "transparent",
                    "stroke": label.borderColor, "stroke-width": label.borderWidth
                };
                if (labelRotate)
                    attr["fill"] = "transparent";
                ej.datavisualization.Diagram.Util.attr(background, attr);
            }
        },
        _adjustOffsetWithTextBounds: function (node, label, text, offset, bounds, nodeBounds, diagram) {
            var point = { x: 0, y: 0 };
            var y = 0;
            var vAlign, hAlign;
            if (node.segments && label.relativeMode === "segmentpath") {
                var obj = this._getConnectorHandlePosition(label, node, 1, diagram);
                var pt = obj.position;
                var ptt = {
                    x: (pt.x - nodeBounds.x) / nodeBounds.width,
                    y: (pt.y - nodeBounds.y) / nodeBounds.height
                };
                ptt = ej.datavisualization.Diagram.Util._getLabelPosition(label, nodeBounds, ptt);
                offset.x = ptt.x;
                offset.y = ptt.y;
                var alignment = ej.datavisualization.Diagram.Util._alignLabelOnSegments(node, label, diagram, obj);
                hAlign = alignment.hAlign;
                vAlign = alignment.vAlign;
            }
            else {
                hAlign = label.horizontalAlignment;
                vAlign = label.verticalAlignment;
            }
            if (vAlign == ej.datavisualization.Diagram.VerticalAlignment.Top)
                y = offset.y;
            else if (vAlign == ej.datavisualization.Diagram.VerticalAlignment.Center)
                y = offset.y - bounds.height / 2;
            else if (vAlign == ej.datavisualization.Diagram.VerticalAlignment.Bottom)
                y = offset.y - bounds.height;
            else if (vAlign == ej.datavisualization.Diagram.VerticalAlignment.Stretch)
                y = offset.y - bounds.height / 2;
            point.y = y;
            if (label.textAlign == "justify") {
                if (text.childNodes.length > 1) {
                    {
                        point.x = offset.x - node.width / 2;
                    }
                }
                else {
                    point.x = offset.x;
                }
            }
            else {
                switch (hAlign) {
                    case ej.datavisualization.Diagram.HorizontalAlignment.Left:
                        switch (label.textAlign) {
                            case ej.datavisualization.Diagram.TextAlign.Left:
                                point.x = offset.x;
                                break;
                            case ej.datavisualization.Diagram.TextAlign.Center:
                                point.x = offset.x + bounds.width / 2;
                                break;
                            case ej.datavisualization.Diagram.TextAlign.Right:
                                point.x = offset.x + bounds.width;
                                break;
                        }
                        break;
                    case ej.datavisualization.Diagram.HorizontalAlignment.Center:
                        switch (label.textAlign) {
                            case ej.datavisualization.Diagram.TextAlign.Left:
                                point.x = offset.x - bounds.width / 2;
                                break;
                            case ej.datavisualization.Diagram.TextAlign.Center:
                                point.x = offset.x;
                                break;
                            case ej.datavisualization.Diagram.TextAlign.Right:
                                point.x = offset.x + bounds.width / 2;
                                break;
                        }
                        break;
                    case ej.datavisualization.Diagram.HorizontalAlignment.Right:
                        switch (label.textAlign) {
                            case ej.datavisualization.Diagram.TextAlign.Left:
                                point.x = offset.x - bounds.width;
                                break;
                            case ej.datavisualization.Diagram.TextAlign.Center:
                                point.x = offset.x - bounds.width / 2;
                                break;
                            case ej.datavisualization.Diagram.TextAlign.Right:
                                point.x = offset.x;
                                break;
                        }
                        break;
                    case ej.datavisualization.Diagram.HorizontalAlignment.Stretch:
                        switch (label.textAlign) {
                            case ej.datavisualization.Diagram.TextAlign.Left:
                                point.x = offset.x - nodeBounds.width / 2;
                                break;
                            case ej.datavisualization.Diagram.TextAlign.Center:
                                point.x = offset.x;
                                break;
                            case ej.datavisualization.Diagram.TextAlign.Right:
                                point.x = offset.x + nodeBounds.width / 2;
                                break;
                        }
                        break;
                }
            }
            if (node.segments || node._type == "group") {
                point.x = point.x + nodeBounds.x;
                point.y = point.y + nodeBounds.y;
                offset.x += nodeBounds.x;
                offset.y += nodeBounds.y;
            }
            if (ej.browserInfo().name === "mozilla")
                point.y = point.y - label.fontSize / 2;
            return point;
        },

        _wrapText: function (node, textBBox, text, label, svg, labelRotate) {
            var str = label.text; var attr = null;
            while (text.hasChildNodes()) {
                text.removeChild(text.lastChild);
            }
            var bbWidth, bbHeight;
            if (node.segments) {
                bbWidth = textBBox.width;
                bbHeight = textBBox.height;
            }
            else {
                bbWidth = textBBox.width - label.margin.left - label.margin.right;
                bbHeight = textBBox.height - label.margin.top - label.margin.bottom;
            }
            if (labelRotate) {
                var temp = bbWidth;
                bbWidth = bbHeight;
                bbHeight = temp;
            }
            bbWidth -= 2 * (label.borderWidth ? label.borderWidth : 1);
            bbWidth = bbWidth < label.width ? label.width : bbWidth;
            var eachLine = str.split('\n');
            var x, y, tspan, j, string = "", childNodes, bounds, i, k, txt = "", spltWord;
            if (svg.getElementById(text.id))
                childNodes = svg.getElementById(text.id).childNodes;
            if (childNodes) {
                var wrap = label.wrapping == "wrapwithoverflow" ? true : false;
                for (j = 0; j < eachLine.length; j++) {
                    tspan = svg.tspan();
                    tspan.style.fontSize = label.fontSize;
                    text.appendChild(tspan);
                    if (label.wrapping != "nowrap") {
                        if (eachLine[j] === " ") {
                            tspan.textContent = '\u00a0';
                        }
                        else {
                            var words = label.wrapping == "wrapwithoverflow" ? eachLine[j].split(" ") : eachLine[j];
                            for (i = 0; i < words.length; i++) {
                                var newword = words[i];
                                if (newword.indexOf('-') >= 0 && wrap) {
                                    tspan = this._splitHyphenWord(tspan, newword, text, label, bbWidth, svg);
                                    if (i == words.length - 1) {
                                        if (!(i == words.length - 1)) {
                                            tspan = svg.tspan();
                                            text.appendChild(tspan);
                                        }
                                    }
                                    else {
                                        if (this._getTextLength(svg, text, tspan.textContent + " " + (words[i + 1] || "")).width > bbWidth) {
                                            tspan = svg.tspan();
                                            text.appendChild(tspan);
                                        }
                                    }
                                }
                                else {
                                    tspan.textContent += ((tspan.textContent && wrap) ? " " : "") + words[i];
                                    bounds = childNodes[childNodes.length - 1].getComputedTextLength();
                                    if (bounds >= bbWidth) {
                                        if (!(i == words.length - 1)) {
                                            tspan = svg.tspan();
                                            text.appendChild(tspan);
                                        }
                                    }
                                    else {
                                        if (wrap || (label && label.wrapping === "wrap")) {
                                            var newText = tspan.textContent;
                                            if (i < words.length - 1) {
                                                if (words[i + 1].indexOf("-") >= 0 && wrap) {
                                                    tspan = this._splitHyphenWord(tspan, words[i + 1], text, label, bbWidth, svg);
                                                    if (this._getTextLength(svg, text, tspan.textContent + " " + (words[i + 1] || "")).width > bbWidth) {
                                                        tspan = svg.tspan();
                                                        text.appendChild(tspan);
                                                    }
                                                    i++;
                                                }
                                                else {
                                                    tspan.textContent += (wrap ? " " : "") + (words[i + 1] || "");
                                                    bounds = childNodes[childNodes.length - 1].getComputedTextLength();
                                                    tspan.textContent = newText;
                                                    if (bounds > bbWidth) {
                                                        tspan = svg.tspan();
                                                        text.appendChild(tspan);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else tspan.textContent += eachLine[j];
                }
                this._wrapTextAlign(text, childNodes, label.fontSize, label.textAlign, node, label, svg);
            }
        },

        _splitHyphenWord: function (tspan, hyphenWord, text, label, bbWidth, svg) {
            var txt = tspan.textContent;
            var wrap = label.wrapping == "wrapwithoverflow" ? true : false;
            var newText = tspan.textContent ? tspan.textContent + " " : "";
            var splitWords = hyphenWord.split("-");
            for (var i = 0; i < splitWords.length; i++) {
                newText += splitWords[i];
                var bounds = this._getTextLength(svg, text, newText);
                if (bounds >= bbWidth) {
                    tspan.textContent = txt;
                    tspan = svg.tspan();
                    text.appendChild(tspan);
                    if (i < splitWords.length - 1) {
                        newText = splitWords[i] + "-";
                    }
                    else
                        newText = splitWords[i]
                    txt = newText;
                }
                else {
                    if (wrap || (label && label.wrapping === "wrap")) {
                        txt = newText;
                        if (i < splitWords.length - 1) {
                            newText += "-";
                            if (this._getTextLength(svg, text, newText) > bbWidth) {
                                tspan.textContent = txt;
                                tspan = svg.tspan();
                                text.appendChild(tspan);
                                newText = "-";
                            }
                            else {
                                txt = newText;
                            }
                        }
                    }
                }
            }
            tspan.textContent = txt;
            return tspan;
        },

        _getTextLength: function (svg, text, textContent) {
            var length;
            var tspan = svg.tspan();
            text.appendChild(tspan);
            tspan.textContent = textContent;
            length = tspan.getComputedTextLength();
            text.removeChild(tspan);
            return length;
        },

        _getTSpanLength: function (tspan, label, svg, node) {
            var length = 0;
            if (tspan && tspan.textContent) {
                for (var i = 0; i < tspan.textContent.length; i++) {
                    length += this._getCharBoundsValues(tspan.textContent[i], label, svg, node).bold
                }
            }
            return length;
        },
        _wrapTextAlign: function (text, childNodes, height, textAlign, node, label, svg) {
            var x, difspace, wordSpacing, txt, prevHeight, prevX = null, def = 2, removeChild = [], tspan;
            for (var i = 0; i < childNodes.length; i++) {
                var tspan = childNodes[i];
                if (textAlign == "justify" && i != childNodes.length - 1) {
                    txt = tspan.textContent;
                    if (txt[txt.length - 1] == " ") {
                        txt = txt.slice(0, txt.length - 1);
                    } if (txt[0] == " ") {
                        txt = txt.slice(1, txt.length);
                    }
                    tspan.textContent = txt;
                    x = tspan.getComputedTextLength();
                    difspace = node.width - x;
                    wordSpacing = difspace / (txt.split(" ").length - 1);
                    tspan.setAttribute("word-spacing", wordSpacing + "px");
                    x = tspan.getComputedTextLength();
                }
                else {
                    var length = this._getTSpanLength(tspan, label, svg, node)
                    x = length ? length : tspan.getComputedTextLength();

                }
                if (textAlign == "justify") {
                    childNodes.length > 1 ? textAlign = "left" : textAlign = "center";
                }
                switch (textAlign) {
                    case "left":
                        x = 0;
                        break;
                    case "center":
                        x = -x / 2;
                        break;
                    case "right":
                        x = -x;
                        break;
                }
                var attr = {
                    "x": Number(x), "dy": def > 2 ? (height * def) : height
                };
                if (x == 0 && tspan.textContent == "") {
                    def++;
                }
                else
                    def = 2;
                ej.datavisualization.Diagram.Util.attr(tspan, attr);
            }
        },
        //#endregion

        //#region Render Port
        _renderPorts: function (node, svg, diagram, isoverView) {
            var width = node.width ? node.width : node._width || 0;
            var height = node.height ? node.height : node._height || 0;
            var x = node.offsetX - width * node.pivot.x;
            var y = node.offsetY - height * node.pivot.y;
            var ports = node.ports;
            var port, shape, g_ports, p_ports, parentElement, attr;
            var scale = diagram._currZoom;
            if (diagram.model.palettes || isoverView) {
                g_ports = svg.getElementById(node.name);
            }
            else {
                attr = {
                    "id": node.name + "_ej_ports", "pointer-events": "all", "padding": "inherit",
                };
                if (node._type !== "group") {
                    attr["transform"] = "rotate(" + node.rotateAngle + "," + node.offsetX * scale + "," + node.offsetY * scale + "), translate(" + x * scale + "," + y * scale + ")";

                }
                g_ports = svg.g(attr);
            }
            for (var i = 0, len = ports.length; i < len; ++i) {
                port = ports[i];
                shape = this._renderPort(node, port, svg, diagram);
                g_ports.appendChild(shape)
            }
            parentElement = svg.getElementById(node.parent + "_ej_ports");
            if (node.parent != "") {
                if (!parentElement) {
                    p_ports = svg.g({
                        "id": node.parent + "_ej_ports", "pointer-events": "all", "padding": "inherit",
                    });
                    if (!diagram.model.palettes && !isoverView)
                        svg.getElementById(diagram._canvas.id + "_portLayer").appendChild(p_ports)
                    else svg.getElementById(node.name).appendChild(p_ports)
                    parentElement = p_ports
                }
            }
            if (!diagram.model.palettes && !isoverView) {
                if (!parentElement) {
                    svg.getElementById(diagram._canvas.id + "_portLayer").appendChild(g_ports);
                }
                else {
                    parentElement.appendChild(g_ports);
                }
            }
        },

        _renderPort: function (node, port, svg, diagram, isoverView) {
            var shape;
            var attr, visibility;
            var size = ej.datavisualization.Diagram.Size(port.size, port.size);
            var point;
            var scale = diagram._currZoom ? diagram._currZoom : 1;
            if (port.visibility & ej.datavisualization.Diagram.PortVisibility.Hidden || port.visibility & ej.datavisualization.Diagram.PortVisibility.Hover || port.visibility & ej.datavisualization.Diagram.PortVisibility.Connect)
                visibility = "hidden";
            else {
                if (ej.datavisualization.Diagram.Util.enableLayerOption(node, "visible", diagram))
                    visibility = "visible";
            else
                    visibility = "hidden";
            }
            if (node._type === "group")
                point = ej.datavisualization.Diagram.Util._getPortPosition(port, ej.datavisualization.Diagram.Util.bounds(node, true), false);
            else
                point = ej.datavisualization.Diagram.Util._getPortPosition(port, ej.datavisualization.Diagram.Util.bounds(node, true), true);
            if (node._type === "group" && node.rotateAngle) {
                var matrix = ej.Matrix.identity();
                ej.Matrix.rotate(matrix, node.rotateAngle, node.offsetX, node.offsetY);
                point = ej.Matrix.transform(matrix, point);
                port._absolutePoint = point;
            }
            switch (port.shape) {
                case "x":
                    var d = this._constructX(point, port.size, scale);
                    attr = {
                        "id": node.name + "_" + port.name, "class": "ej-d-port", "fill": port.fillColor, "visibility": visibility,
                        "stroke": port.borderColor, "stroke-width": port.borderWidth, "d": d
                    };
                    this._addCssClass(port, attr);
                    shape = svg.path(attr);
                    break;
                case "circle":
                    var rx = size.width / 2;
                    var ry = size.height / 2;
                    attr = {
                        "id": node.name + "_" + port.name, "class": "ej-d-port", "rx": rx, "ry": ry, "visibility": visibility,
                        "cx": (point.x * scale), "cy": (point.y * scale), "fill": port.fillColor, "stroke": port.borderColor,
                        "stroke-width": port.borderWidth
                    }
                    this._addCssClass(port, attr);
                    shape = svg.ellipse(attr);
                    break;
                case "square":
                    attr = {
                        "id": node.name + "_" + port.name, "class": "ej-d-port", "x": ((point.x * scale) - port.size / 2), "visibility": visibility,
                        "y": ((point.y * scale) - port.size / 2), "width": size.width, "height": size.height,
                        "fill": port.fillColor, "stroke": port.borderColor, "stroke-width": port.borderWidth
                    };
                    this._addCssClass(port, attr);
                    shape = svg.rect(attr);
                    break;
                case "path":
                    var width = size.width;
                    var height = size.height;
                    var d = port._absolutePath = ej.datavisualization.Diagram.Geometry.updatePath(((point.x * scale) - port.size / 2), ((point.y * scale) - port.size / 2), width, height, port.pathData, svg);
                    attr = {
                        "id": node.name + "_" + port.name, "width": width,
                        "height": height, "d": d, "stroke": port.borderColor,
                        "stroke-width": port.borderWidth, "fill": port.fillColor, "visibility": visibility
                    };
                    this._addCssClass(port, attr);
                    shape = svg.path(attr);
                    break;
            }
            return shape;
        },

        deleteLabel: function (node, label, diagram) {
            diagram._views.forEach(function (viewid) {
                var view = diagram._views[viewid];
                var panel = view.svg || view._canvas;
                view.context._deleteLabel(node, label, diagram, panel, view);
            });
        },
        deletePort: function (node, port, diagram) {
            diagram._views.forEach(function (viewid) {
                var view = diagram._views[viewid];
                var panel = view.svg || view._canvas;
                view.context._deletePort(node, port, diagram, view.type !== "overview" ? diagram._adornerSvg : panel, view);
            });
        },
        _insertPort: function (node, port, svg, index, diagram, isOverView) {
            var g;
            g = (!isOverView) ? svg.getElementById(node.name + "_ej_ports") : svg.getElementById(node.name);
            var portshape = ej.datavisualization.Diagram.SvgContext._renderPort(node, port, svg, diagram);
            var ports = [];
            for (var i = 0; i < g.childNodes.length; i++) {
                if (g.childNodes[i].className.animVal == "ej-d-port")
                    ports.push(g.childNodes[i]);
            }
            if (index != undefined) {
                if (ports.length == 0)
                    g.appendChild(portshape);
                else {
                    g.insertBefore(portshape, ports[index] ? ports[index] : ports[ports.length]);
                }
            }
            else
                g.appendChild(portshape);
            if (port.visibility & ej.datavisualization.Diagram.PortVisibility.Hidden || port.visibility & ej.datavisualization.Diagram.PortVisibility.Hover || port.visibility & ej.datavisualization.Diagram.PortVisibility.Connect) {
                portshape.setAttribute("visibility", "hidden");
            }

        },
        _updatePort: function (node, port, svg, diagram, isoverView) {
            var size = ej.datavisualization.Diagram.Size(port.size, port.size);
            var point = null;
            var visibility
            var scale = (!isoverView) ? diagram._currZoom : 1;
            if (node._type === "group")
                point = ej.datavisualization.Diagram.Util._getPortPosition(port, ej.datavisualization.Diagram.Util.bounds(node, true), false);
            else
                point = ej.datavisualization.Diagram.Util._getPortPosition(port, ej.datavisualization.Diagram.Util.bounds(node, true), true);
            var id = node.name + "_" + port.name;
            if (node._type === "group" && node.rotateAngle) {
                var matrix = ej.Matrix.identity();
                ej.Matrix.rotate(matrix, node.rotateAngle, node.offsetX, node.offsetY);
                point = ej.Matrix.transform(matrix, point);
                port._absolutePoint = point;
            }
            
            visibility = ((port.visibility & ej.datavisualization.Diagram.PortVisibility.Visible) &&
                ej.datavisualization.Diagram.Util.enableLayerOption(node, "visible", diagram)) ? "visible" : "hidden";

            switch (port.shape) {
                case "x": var d = this._constructX(point, port.size, scale);
                    svg.path({ "id": id, "d": d, "visibility": visibility });
                    break;
                case "circle":
                    var rx = size.width / 2;
                    var ry = size.height / 2;
                    if (node.type === "group") {
                        svg.ellipse({ "id": id, "rx": rx, "ry": ry, "cx": 0, "cy": 0, "visibility": visibility, "transform": "rotate(" + node.rotateAngle + "," + (point.x * scale) + "," + (point.y * scale) + "),translate(" + (point.x * scale) + "," + (point.y * scale) + ")" });
                    }
                    else
                        svg.ellipse({ "id": id, "rx": rx, "ry": ry, "visibility": visibility, "cx": (point.x * scale), "cy": (point.y * scale) });
                    break;
                case "square":
                    if (node.type === "group") {
                        svg.rect({ "id": id, "x": 0, "y": 0, "visibility": visibility, "transform": "rotate(" + node.rotateAngle + "," + (point.x * scale) + "," + (point.y * scale) + "),translate(" + ((point.x * scale) - port.size / 2) + "," + ((point.y * scale) - port.size / 2) + ")" });
                    }
                    else
                        svg.rect({ "id": id, "visibility": visibility, "x": (point.x * scale) - port.size / 2, "y": (point.y * scale) - port.size / 2 });
                    break;
                case "path":
                    var width = size.width;
                    var height = size.height;
                    var d = port._absolutePath = ej.datavisualization.Diagram.Geometry.updatePath((point.x * scale) - port.size / 2, (point.y * scale) - port.size / 2, width, height, port.pathData, svg);
                    var attr = {
                        "id": id, "visibility": visibility, "d": d
                    };
                    if (node.type === "group") {
                        attr = {
                            "id": id, "d": d, "visibility": visibility, "transform": "rotate(" + node.rotateAngle + "," + (point.x * scale) + "," + (point.y * scale) + ")"
                        };
                    }
                    svg.path(attr);
                    break;
            }
        },

        _updatePorts: function (node, svg, diagram, isoverView) {
            if (node.ports) {
                var ports = node.ports;
                var scale = diagram._currZoom;
                var width = (node.width ? node.width : node._width);
                var height = (node.height ? node.height : node._height);
                var x = node.offsetX - width * node.pivot.x;
                var y = node.offsetY - height * node.pivot.y;
                var port, g_port;
                g_port = (!isoverView) ? svg.getElementById(node.name + "_ej_ports") : svg.getElementById(node.name);
                for (var i = 0, len = ports.length; i < len; ++i) {
                    port = ports[i];
                    this._updatePort(node, port, svg, diagram);
                }
                if (g_port && node._type !== "group") {
                    if (!isoverView)
                        g_port.setAttribute("transform", "rotate(" + node.rotateAngle + "," + node.offsetX * scale + "," + node.offsetY * scale + "), translate(" + x * scale + "," + y * scale + ")");
                }
            }
        },

        _constructX: function (point, size, scale) {
            var path = new ej.datavisualization.Diagram.Path();
            path.moveTo(((point.x * scale) - size / 2), ((point.y * scale) - size / 2));
            path.lineTo(((point.x * scale) + size / 2), ((point.y * scale) + size / 2));
            path.moveTo(((point.x * scale) + size / 2), ((point.y * scale) - size / 2));
            path.lineTo(((point.x * scale) - size / 2), ((point.y * scale) + size / 2));
            return path.toString();
        },
        _enableSelectedNode: function (node, svg, diagram) {
            if (node) {
                if (node.type == "pseudoGroup") {
                    var children = node.children;
                    for (var i = 0, len = children.length; i < len; i++) {
                        var child = diagram.nameTable[diagram._getChild(children[i])];
                        if (child)
                            this._enableSelectedNode(child, svg, diagram);
                    }
                } else {
                    var attr = {
                        "id": node.name,
                        "pointer-events": "auto",
                        "style": "pointer-events:block",
                    }
                    if (node.segments) {
                        var element = svg.document.getElementById(node.name + "_hitTest");
                        if (element)
                            element.setAttribute("pointer-events", node.visible ? "stroke" : "none");
                    }
                    svg.g(attr);
                }

                if (node && node.type === "html") {
                    var htmlLayer = diagram._svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                    if (htmlLayer)
                        var htmlnode = $(htmlLayer).find("#" + node.name + "_parentdiv")[0];
                    if (htmlnode) {
                        htmlnode.style.pointerEvents = "all";
                        var html = htmlnode.children[0];
                        if (html) {
                            html.style.pointerEvents = "all";
                        }
                    }
                }

                if (diagram._adornerSvg) {
                    var selector = diagram._adornerSvg.document.getElementById(diagram._adornerSvg.document.id + "handle_g");
                    if (selector) selector.setAttribute("pointer-events", "visible");
                }
                if (node.isLane) {
                    $("#diagram").find(".s-resize").css("pointer-events", "visible");
                    $("#diagram").find(".e-resize").css("pointer-events", "visible");
                }
                $("#diagram").find(".ej-d-seperator").css("pointer-events", "visible");
            }
        },
        _disableSelectedNode: function (node, svg, diagram) {
            if (node) {
                if (node.type == "pseudoGroup") {
                    var children = node.children;
                    for (var i = 0, len = children.length; i < len; i++) {
                        var child = diagram.nameTable[diagram._getChild(children[i])];
                        if (child)
                            this._disableSelectedNode(child, svg, diagram);
                    }
                } else {
                    var attr = {
                        "id": node.name,
                        "style": "pointer-events:none",
                        "pointer-events": "none",
                    }
                    if (node.segments) {
                        var element = svg.document.getElementById(node.name + "_hitTest");
                        element.setAttribute("pointer-events", "none");
                    }
                    svg.g(attr);
                }
                if (diagram._adornerSvg) {
                    var selector = diagram._adornerSvg.document.getElementById(diagram._adornerSvg.document.id + "handle_g");
                    if (selector) selector.setAttribute("pointer-events", "none");
                }

                if (node && node.type === "html") {
                    var htmlLayer = diagram._svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                    if (htmlLayer)
                        var htmlnode = $(htmlLayer).find("#" + node.name + "_parentdiv")[0];
                    if (htmlnode) {
                        htmlnode.style.pointerEvents = "none";
                        var html = htmlnode.children[0];
                        if (html) {
                            html.style.pointerEvents = "none";
                        }
                    }
                }
                if (node.isLane) {
                    $("#diagram").find(".s-resize").css("pointer-events", "none");
                    $("#diagram").find(".e-resize").css("pointer-events", "none");
                }
                $("#diagram").find(".ej-d-seperator").css("pointer-events", "none");
            }
        },

        _drawStackHighlighter: function (node, svg, parent, scale, currentPoint, isVertcal) {
            var nPoint, points = [];
            var bounds = ej.datavisualization.Diagram.Util.bounds(node);
            if (isVertcal) {
                if (currentPoint.y >= bounds.y && currentPoint.y < bounds.center.y) {
                    points.push({ x: bounds.topLeft.x * scale - 5, y: bounds.topLeft.y * scale - 5 });
                    points.push({ x: bounds.topLeft.x * scale, y: bounds.topLeft.y * scale });
                    points.push({ x: bounds.topLeft.x * scale - 5, y: bounds.topLeft.y * scale + 5 });
                    points.push({ x: bounds.topLeft.x * scale, y: bounds.topLeft.y * scale });
                    points.push({ x: bounds.topRight.x * scale, y: bounds.topRight.y * scale });
                    points.push({ x: bounds.topRight.x * scale + 5, y: bounds.topRight.y * scale - 5 });
                    points.push({ x: bounds.topRight.x * scale, y: bounds.topRight.y * scale });
                    points.push({ x: bounds.topRight.x * scale + 5, y: bounds.topRight.y * scale + 5 });
                    points.push({ x: bounds.topRight.x * scale, y: bounds.topRight.y * scale });
                }
                else {
                    points.push({ x: bounds.bottomLeft.x * scale - 5, y: bounds.bottomLeft.y * scale - 5 });
                    points.push({ x: bounds.bottomLeft.x * scale, y: bounds.bottomLeft.y * scale });
                    points.push({ x: bounds.bottomLeft.x * scale - 5, y: bounds.bottomLeft.y * scale + 5 });
                    points.push({ x: bounds.bottomLeft.x * scale, y: bounds.bottomLeft.y * scale });
                    points.push({ x: bounds.bottomRight.x * scale, y: bounds.bottomRight.y * scale });
                    points.push({ x: bounds.bottomRight.x * scale + 5, y: bounds.bottomRight.y * scale - 5 });
                    points.push({ x: bounds.bottomRight.x * scale, y: bounds.bottomRight.y * scale });
                    points.push({ x: bounds.bottomRight.x * scale + 5, y: bounds.bottomRight.y * scale + 5 });
                    points.push({ x: bounds.bottomRight.x * scale, y: bounds.bottomRight.y * scale });
                }
            }
            else {
                if (currentPoint.x >= bounds.x && currentPoint.x < bounds.center.x) {
                    points.push({ x: bounds.topLeft.x * scale - 5, y: (bounds.topLeft.y) * scale - 5 });
                    points.push({ x: bounds.topLeft.x * scale, y: bounds.topLeft.y * scale });
                    points.push({ x: bounds.topLeft.x * scale + 5, y: (bounds.topLeft.y) * scale - 5 });
                    points.push({ x: bounds.topLeft.x * scale, y: bounds.topLeft.y * scale });
                    points.push({ x: bounds.bottomLeft.x * scale, y: bounds.bottomLeft.y * scale });
                    points.push({ x: bounds.bottomLeft.x * scale - 5, y: bounds.bottomLeft.y * scale + 5 });
                    points.push({ x: bounds.bottomLeft.x * scale, y: bounds.bottomLeft.y * scale });
                    points.push({ x: bounds.bottomLeft.x * scale + 5, y: bounds.bottomLeft.y * scale + 5 });
                    points.push({ x: bounds.bottomLeft.x * scale, y: bounds.bottomLeft.y * scale });
                    points.push({ x: bounds.bottomLeft.x * scale, y: bounds.bottomLeft.y * scale });
                }
                else {
                    points.push({ x: bounds.topRight.x * scale - 5, y: bounds.topRight.y * scale - 5 });
                    points.push({ x: bounds.topRight.x * scale, y: bounds.topRight.y * scale });
                    points.push({ x: bounds.topRight.x * scale + 5, y: (bounds.topRight.y) * scale - 5 });
                    points.push({ x: bounds.topRight.x * scale, y: bounds.topRight.y * scale });
                    points.push({ x: bounds.bottomRight.x * scale, y: bounds.bottomRight.y * scale });
                    points.push({ x: bounds.bottomRight.x * scale - 5, y: (bounds.bottomRight.y) * scale + 5 });
                    points.push({ x: bounds.bottomRight.x * scale, y: bounds.bottomRight.y * scale });
                    points.push({ x: bounds.bottomRight.x * scale + 5, y: (bounds.bottomRight.y) * scale + 5 });
                    points.push({ x: bounds.bottomRight.x * scale, y: bounds.bottomRight.y * scale });
                    points.push({ x: bounds.bottomRight.x * scale, y: bounds.bottomRight.y * scale });
                }

            }
            var nPoint = this._convertToSVGPoints(points);
            var attr = {
                "id": "nodeHighlighter",
                "points": nPoint,
                "fill": "transparent",
                "stroke": "red",
                "stroke-width": 2,
                "pointer-events": "none",
                "style": "pointer-events: none",
            };
            var line = svg.polyline(attr);
            parent.appendChild(line);
            return line;
        },

        _drawNodeHighlighter: function (node, svg, parent, scale) {
            var shape;
            var width = node.width ? node.width : node._width;
            var height = node.height ? node.height : node._height;
            var x = node.offsetX - width * node.pivot.x;
            var y = node.offsetY - height * node.pivot.y;
            var center = ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY);
            var transform = "rotate(" + node.rotateAngle + "," + center.x * scale + "," + center.y * scale + ")";
            var stroke = node.isLane || node.isSwimlane ? "red" : "#0dc923";
            var attr = {
                "id": "nodeHighlighter",
                "class": "ej-d-node",
                "x": x * scale,
                "y": y * scale,
                "width": width * scale,
                "height": height * scale,
                "fill": "transparent",
                "stroke": stroke,
                "stroke-width": 2,
                "pointer-events": "none",
                "transform": transform,
                "style": "pointer-events: none",
            };
            shape = svg.rect(attr);
            parent.appendChild(shape);
            return shape;
        },

        _drawNavigationHighlighter: function (bounds, svg, parent, scale) {
            var attr = {
                "id": "nodeHighlighter", "x": bounds.x * scale, "y": bounds.y * scale, "width": bounds.width * scale, "height": bounds.height * scale,
                "fill": "transparent", "stroke": "black", "stroke-dasharray": "2 2", "shape-rendering": "crispEdges", "style": "pointer-events: none"
            }
            parent.appendChild(svg.rect(attr));
        },
        _removeNodeHighlighter: function (svg, parent) {
            var highlighter = svg.getElementById("nodeHighlighter");
            if (highlighter) {
                svg.removeChild(highlighter, parent);
            }
        },
        _drawPortHighlighter: function (port, node, svg, parent, scale, diagram) {
            var shape, size, point, x, y, transform;
            var width = node.width ? node.width : node._width;
            var height = node.height ? node.height : node._height;
            var bounds;
            var fill = "#8CC63F";
            var border = "#1A1A1A";
            var borderWidth = 0.5;
            if (!port) {
                bounds = ej.datavisualization.Diagram.Util.bounds(node, true);
                size = ej.datavisualization.Diagram.Size(bounds.width, bounds.height);
                point = ej.datavisualization.Diagram.Point(bounds.x, bounds.y);
                x = point.x * scale;
                y = point.y * scale;
                border = fill;
                fill = "transparent";
                borderWidth = 2;
                var center = ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY);
                transform = "rotate(" + node.rotateAngle + "," + center.x * scale + "," + center.y * scale + ")";
            }
            else {
                size = ej.datavisualization.Diagram.Size(port.size * 2, port.size * 2);
                point = ej.datavisualization.Diagram.Util._getPortPosition(port, ej.datavisualization.Diagram.Util.bounds(node, true));
                var matrix = ej.Matrix.identity();
                ej.Matrix.rotate(matrix, node.rotateAngle, node.offsetX, node.offsetY);
                point = ej.Matrix.transform(matrix, point);
                x = (point.x - port.size) * scale;
                y = (point.y - port.size) * scale;
                transform = "rotate(" + 0 + "," + (x + size.width / 2) + "," + (y + size.height / 2) + ")";
                if(diagram)
                diagram.portHighlight = true;
            }
            var attr = {
                "id": "portHighlighter", "class": "ej-d-port", "x": x,
                "y": y, "width": size.width * scale, "height": size.height * scale,
                "fill": fill, "stroke": border, "stroke-width": borderWidth, "pointer-events": "none", "transform": transform
            };
            shape = svg.rect(attr);
            parent.appendChild(shape);
            return shape;
        },

        _drawConnectorHighlighter: function (connector, diagram, scale) {
            var svg = diagram._adornerSvg;
            var g = svg.g({ "id": "connector_highlighter", "visibility": "visible", transform: "scale(" + scale + ")" });
            diagram._adornerLayer.appendChild(g);
            var path = this._findPath(connector, diagram);
            var attr = {
                "id": "highlighter_segments",
                "d": path, "fill": "none", "stroke": "#0dc923",
                "stroke-width": connector.lineWidth, "pointer-events": "none"
            };
            var line = svg.path(attr);
            g.appendChild(line);
            return g;
        },

        _removeConnectorHighlighter: function (parent, svg) {
            var highlighter = svg.getElementById("connector_highlighter");
            if (highlighter) {
                parent.removeChild(highlighter);
            }
        },
        _removePortHighlighter: function (svg, parent) {
            var highlighter = svg.getElementById("portHighlighter");
            if (highlighter) {
                svg.removeChild(highlighter, parent);
            }
        },

        _renderPhaseResize: function (shape, svg, scale, constraints, parent) {
            var nPoint, points = [];
            var clName = "", isHorizon = false, isVerti = false;
            var bounds = ej.datavisualization.Diagram.Util.bounds(shape);
            //#region left
            nPoint, points = [];
            points.push({ x: bounds.topLeft.x * scale, y: bounds.topLeft.y * scale });
            points.push({ x: bounds.bottomLeft.x * scale, y: bounds.bottomLeft.y * scale });
            nPoint = this._convertToSVGPoints(points);
            var attr = {
                "id": "w-resize", "points": nPoint, "stroke-dasharray": "3,3", "fill": "transparent", "stroke": "red", "stroke-width": 2, "pointer-events": "none"
            };
            line = svg.polyline(attr);
            parent.appendChild(line);
            //#endregion  

            //#region Top
            nPoint, points = [];
            points.push({ x: bounds.topLeft.x * scale, y: bounds.topLeft.y * scale });
            points.push({ x: bounds.topRight.x * scale, y: bounds.topRight.y * scale });
            nPoint = this._convertToSVGPoints(points);
            var attr = {
                "id": "n-resize", "points": nPoint, "stroke-dasharray": "3,3", "fill": "transparent", "stroke": "red", "stroke-width": 2, "pointer-events": "none"
            };
            line = svg.polyline(attr);
            parent.appendChild(line);
            //#endregion 

            //#region right
            clName = "";
            if (shape.orientation == "vertical") {
                clName = "e-resize"
                isVerti = true;
            }
            nPoint, points = [];
            points.push({ x: bounds.topRight.x * scale, y: bounds.topRight.y * scale });
            points.push({ x: bounds.bottomRight.x * scale, y: bounds.bottomRight.y * scale });
            nPoint = this._convertToSVGPoints(points);
            if (isVerti) {
                attr = {
                    "id": "e-resize-hitTest", "class": clName, "points": nPoint, "fill": "transparent", "stroke": "transparent", "stroke-width": 10, "pointer-events": isVerti ? "stroke" : "none"
                };
                var line = svg.polyline(attr);
                parent.appendChild(line);
            }
            var attr = {
                "id": "e-resize", "class": clName, "points": nPoint, "stroke-dasharray": "3,3", "fill": "transparent", "stroke": "red", "stroke-width": 2, "pointer-events": isVerti ? "stroke" : "none"
            };
            line = svg.polyline(attr);
            parent.appendChild(line);
            //#endregion

            //#region bottom
            clName = "";
            if (shape.orientation == "horizontal") {
                clName = "s-resize"
                isHorizon = true;
            }
            nPoint, points = [];
            points.push({ x: bounds.bottomLeft.x * scale, y: bounds.bottomLeft.y * scale });
            points.push({ x: bounds.bottomRight.x * scale, y: bounds.bottomRight.y * scale });
            nPoint = this._convertToSVGPoints(points);
            if (isHorizon) {
                attr = {
                    "id": "s-resize-hitTest", "class": clName, "points": nPoint, "fill": "transparent", "stroke": "transparent", "stroke-width": 10, "pointer-events": isHorizon ? "stroke" : "none"
                };
                var line = svg.polyline(attr);
                parent.appendChild(line);
            }
            var attr = {
                "id": "s-resize", "class": clName, "points": nPoint, "stroke-dasharray": "3,3", "fill": "transparent", "stroke": "red", "stroke-width": 2, "pointer-events": isHorizon ? "stroke" : "none"
            };
            line = svg.polyline(attr);
            parent.appendChild(line);
            //#endregion
        },
        //#endregion

        //#region Render Selector

        renderSelector: function (shape, svg, parent, scale, constraints, bounds, diagram) {
            $(".phaseSelector").remove();
            var width = shape.width ? shape.width : shape._width;
            var height = shape.height ? shape.height : shape._height;
            var transform;
            if (shape.segments) {
                var g = svg.g({
                    "id": svg.document.id + "handle_g", "class": "handle", "pointer-events": "visible"
                });
                parent.appendChild(g);
                this._renderEndPointHandle(shape, svg, scale);
            }
            else if (shape.type != "phase") {
                if (!(shape.isLane || shape.isSwimlane)) {
                    transform = this._selectorLocation(shape, scale, diagram);
                    var g = svg.g({
                        "id": svg.document.id + "handle_g", "class": "handle", "pointer-events": "visible",
                        "transform": transform
                    });
                    parent.appendChild(g);
                    this._updateMultiSelectHandle(shape, scale, constraints, diagram);
                    this._renderResizeHandle(shape, svg, scale, constraints, diagram);
                }
                else {
                    var g = svg.g({
                        "id": svg.document.id + "handle_g", "class": "handle", "pointer-events": "visible"
                    });
                    parent.appendChild(g);
                    this._renderPhaseResize(shape, svg, scale, constraints, g, bounds);
                }
            }
            else if (shape.type == "phase" && bounds) {
                var g = svg.g({
                    "id": svg.document.id + "handle_g", "class": "handle", "pointer-events": "visible",
                    "transform": "translate(" + (bounds.x) * scale + "," + (bounds.y) * scale + "),rotate(0," + (bounds.width / 2) * scale + "," + (bounds.height / 2) * scale + ")"
                });
                if (!svg.document.getElementById(svg.document.id + "handle_g"))
                    parent.appendChild(g);
                var rect = svg.rect({
                    "id": "phaseSelector", "class": "phaseSelector",
                    "stroke-width": 2, "stroke-dasharray": "3,3", "pointer-events": "none",
                    "width": (bounds.width < 0) ? 1 : bounds.width * scale, "height": (bounds.height < 0) ? 1 : bounds.height * scale, "fill": "transparent", "stroke": "red",
                });
                g.appendChild(rect);
            }
        },
        _updateMultiSelectHandle: function (node, scale, constraints, diagram) {
            if (node.type === "pseudoGroup" && ej.datavisualization.Diagram.Util.canDragHelper(diagram)) {
                var width = node.width ? node.width : node._width;
                var height = node.height ? node.height : node._height;
                var pt = ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY);
                if (!diagram._svg.getElementById(diagram.element[0].id + "_multiselector")) {
                    var attr = {
                        "id": diagram.element[0].id + "_multiselector", "class": "ej-d-multiselector", "width": width, "height": height,
                        "transform": "rotate(" + node.rotateAngle + "," + pt.x + "," + pt.y + "),translate(" + (node.offsetX - width * node.pivot.x) + "," + (node.offsetY - height * node.pivot.y) + ")",
                        "fill": "transparent", opacity: ".5"
                    }
                    var dLayer, rect;
                    dLayer = diagram._svg.getElementById(diagram.element[0].id + "_canvas_diagramLayer");
                    rect = diagram._svg.rect(attr);
                    dLayer.insertBefore(rect, dLayer.firstChild);
                }
                else {
                    attr = {
                        "id": diagram.element[0].id + "_multiselector", "width": width, "height": height,
                        "transform": "rotate(" + node.rotateAngle + "," + pt.x + "," + pt.y + "),translate(" + (node.offsetX - width * node.pivot.x) + "," + (node.offsetY - height * node.pivot.y) + ")"
                    };
                    diagram._svg.rect(attr);
                }
            }
        },
        _renderResizeHandle: function (node, svg, scale, constraints, diagram) {
            var width = node.width ? node.width : node._width;
            var height = node.height ? node.height : node._height;
            var pivot = node.pivot ? node.pivot : { x: 0.5, y: 0.5 };
            var rotate = ej.datavisualization.Diagram.Point(width * pivot.x, -20 / scale);
            var visible = "visible", resizable;
            if (node._type !== "label") {
                if (ej.datavisualization.Diagram.Util.canShowResizeThumbs(diagram)) {
                    var rect1 = ej.datavisualization.Diagram.Rectangle(0, 0, 14, 14);
                    var rect2 = ej.datavisualization.Diagram.Rectangle(((width / 2) * scale), 0, 14, 14);
                    var rect3 = ej.datavisualization.Diagram.Rectangle(0, (height / 2) * scale, 14, 14);
                    visible = this._resizeHandleVisiblity(rect1, rect2, rect3);
                }
            }
            if (constraints & ej.datavisualization.Diagram.SelectorConstraints.Rotator && node.type != "umlclassifier") {
                var padding = 0;
                if (visible == "hidden")
                    padding = -20;
                this._renderPivotLine(node, svg, scale, padding);
                this._renderRotateThumb("rotateHandle", node, rotate.x, rotate.y + padding, scale, svg);
            }
            if (constraints & ej.datavisualization.Diagram.SelectorConstraints.Resizer) {
                this._renderResizeBorder("resizeBorder", node, svg, scale);
                if (node.type != "umlclassifier") {
                    if (node._type == "label")
                        resizable = !(node.constraints & ej.datavisualization.Diagram.LabelConstraints.Resizable);
                    this._renderResizeCorner("nw-resize", node, 0, 0, svg, node._type == "label" ? resizable : !(node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeNorthWest), undefined, visible);
                    this._renderResizeCorner("ne-resize", node, width * scale, 0, svg, node._type == "label" ? resizable : !(node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeNorthEast), undefined, visible);
                    this._renderResizeCorner("sw-resize", node, 0, height * scale, svg, node._type == "label" ? resizable : !(node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeSouthWest), undefined, visible);
                    this._renderResizeCorner("se-resize", node, width * scale, height * scale, svg, node._type == "label" ? resizable : !(node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeSouthEast), undefined, visible);
                    this._renderResizeCorner("n-resize", node, (width / 2) * scale, 0, svg, node._type == "label" ? resizable : !(node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeNorth), undefined, visible);
                    this._renderResizeCorner("w-resize", node, 0, (height / 2) * scale, svg, node._type == "label" ? resizable : !(node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeWest), undefined, visible);
                    this._renderResizeCorner("e-resize", node, (width * scale), (height / 2) * scale, svg, node._type == "label" ? resizable : !(node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeEast), undefined, visible);
                    this._renderResizeCorner("s-resize", node, (width / 2) * scale, (height * scale), svg, node._type == "label" ? resizable : !(node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeSouth), undefined, visible);
                }
            }
        },

        renderUserHandles: function (handles, shape, svg, isMultipleSelection, scale, parent, diagram) {
            if (shape) {
                if (shape.type === "phase" && diagram)
                    var bounds = diagram._getPhaseBounds(shape);
                if (handles.length) {
                    var g = svg.g({ "id": svg.document.id + "userHandle_g", "class": "userHandle", "pointer-events": "visible" });
                    parent.appendChild(g);
                    for (var handleIndex = 0; handleIndex < handles.length; handleIndex++) {
                        if ((isMultipleSelection && handles[handleIndex].enableMultiSelection) || !isMultipleSelection) {
                            this._renderUserHandle(handles[handleIndex], shape, svg, scale, g, bounds, diagram);
                        }
                    }
                }
            }
        },

        _renderUserHandle: function (handle, node, svg, scale, g, bounds, diagram) {
            var icon;
            var position = this._getHandlePosition(handle, node, scale, bounds, diagram);
            var x = position.x * scale;// - (node.segments ? 0 : handle.size / 4);
            var y = position.y * scale;// - (node.segments ? 0 : handle.size / 4)
            var shape = this._getHandleShape(handle, x, y);
            handle._size = handle.size;
            var circle = g.appendChild(svg.circle(shape));
            var titleattr = {
                "id": handle.name + "_title"
            };
            var title = svg.title(titleattr);
            title.innerHTML = handle.name;
            circle.appendChild(title);
            switch (handle.shape) {
                case "path":
                    var d = handle._absolutePath = ej.datavisualization.Diagram.Geometry.updatePath(0, 0, handle.size / 2, handle.size / 2, handle.pathData, svg);
                    icon = this._getHandleIcon(handle, x - handle.size / 4, y - handle.size / 4);
                    icon["d"] = d;
                    g.appendChild(svg.path(icon));
                    break;
                case "image":
                    icon = this._getHandleIcon(handle, x - handle.size / 4, y - handle.size / 4);
                    icon["preserveAspectRatio"] = "none";
                    var image = new Image();
                    image.src = handle.source;
                    var imageshape = svg.image(icon);
                    imageshape.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", image.src);
                    g.appendChild(imageshape);
                    break;
                case "native":
                    var visible = handle.visible ? "visible" : "hidden";
                    icon = this._getHandleIcon(handle, x - handle.size / 4, y - handle.size / 4);
                    var html = diagram._renderEjTemplate("#" + handle.templateId, handle);
                    var div = document.createElement('div');
                    div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><g id="tempNative">' + html + '</g></svg>';
                    document.body.appendChild(div);
                    var content = document.getElementById("tempNative").cloneNode(true);
                    content.id = handle.name + "_shape";
                    g.appendChild(content);
                    var bounds = content.getBBox();
                    var width = icon.width;
                    var height = icon.height;
                    var delwidth = bounds.width ? width / bounds.width : 1;
                    var delheight = bounds.height ? height / bounds.height : 1;
                    content.setAttribute("transform", "scale(" + delwidth + "," + delheight + ")");
                    div.parentNode.removeChild(div);
                    var nativecontent = svg.g(icon);
                    nativecontent.appendChild(content);
                    g.appendChild(nativecontent);
                    break;
            }
        },

        _getHandleIcon: function (handle, x, y) {
            var visible = handle.visible ? "visible" : "hidden";
            var icon = {
                "id": handle.name + "_icon", "class": "userHandle-icon", "fill": handle.pathColor, "transform": "translate(" + x + "," + y + ")",
                "visibility": visible, "width": handle.size / 2, "height": handle.size / 2
            };
            return icon;
        },

        _getHandlePosition: function (handle, node, scale, phsBounds, diagram) {
            if (node) {
                if (!node.segments || handle.offset) {
                    var positionPoints = ej.datavisualization.Diagram.Point();
                    if (node.type === "phase" && phsBounds)
                        var bounds = ej.datavisualization.Diagram.Util.bounds(phsBounds);
                    else
                        var bounds = ej.datavisualization.Diagram.Util.bounds(node, true);
                    var offset = handle.offset;
                    var size = handle.size;
                    var margin = handle.margin;
                    var point = ej.datavisualization.Diagram.Point(0, 0)
                    var matrix = ej.Matrix.identity();
                    ej.Matrix.rotate(matrix, node.rotateAngle, node.offsetX, node.offsetY);
                    switch (handle.position) {
                        case "topleft":
                            offset = { x: 0, y: 0 };
                            margin = { left: -25, top: -25, bottom: 0, right: 0 };
                            break;
                        case "topcenter":
                            offset = { x: 0.5, y: 0 };
                            margin = { left: 0, top: -25, bottom: 0, right: 0 };
                            break;
                        case "topright":
                            offset = { x: 1, y: 0 };
                            margin = { left: 0, top: -25, bottom: 0, right: -25 };
                            break;
                        case "middleleft":
                            offset = { x: 0, y: 0.5 };
                            margin = { left: -25, top: 0, bottom: 0, right: 0 };
                            break;
                        case "middleright":
                            offset = { x: 1, y: 0.5 };
                            margin = { left: 0, top: 0, bottom: 0, right: -25 };
                            break;
                        case "bottomleft":
                            margin = { left: -25, top: 0, bottom: -25, right: 0 };
                            offset = { x: 0, y: 1 };
                            break;
                        case "bottomcenter":
                            offset = { x: 0.5, y: 1 };
                            margin = { left: 0, top: 0, bottom: -25, right: 0 };
                            break;
                        case "bottomright":
                            offset = { x: 1, y: 1 };
                            margin = { left: 0, top: 0, bottom: -25, right: -25 };
                            break;
                    }

                    point.x += margin.left - margin.right;
                    point.y += margin.top - margin.bottom;

                    switch (handle.horizontalAlignment) {
                        case ej.datavisualization.Diagram.HorizontalAlignment.Left:
                            point.x += size / 2;
                            break;
                        case ej.datavisualization.Diagram.HorizontalAlignment.Right:
                            point.x -= size / 2;
                            break;
                    }
                    switch (handle.verticalAlignment) {
                        case ej.datavisualization.Diagram.VerticalAlignment.Top:
                            point.y += size / 2;
                            break;
                        case ej.datavisualization.Diagram.VerticalAlignment.Bottom:
                            point.y -= size / 2;
                            break;
                    }

                    positionPoints.x += bounds.x + bounds.width * offset.x + point.x / scale;
                    positionPoints.y += bounds.y + bounds.height * offset.y + point.y / scale;
                    if (!node.segments) {
                        var pt = ej.datavisualization.Diagram.Point(positionPoints.x, positionPoints.y);
                        positionPoints = ej.Matrix.transform(matrix, pt);
                    }
                    return positionPoints;
                }
            }
        },
        _getConnectorHandlePosition: function (handle, node, scale, diagram) {
            var length = 0;
            var position = ej.datavisualization.Diagram.Util._findOffsetOnConnector(node, handle, handle.segmentOffset, diagram);
            var i = position.segment;
            var j = position.point;
            var pt = position.offset;
            var targetSegment = node.segments[i]; var targetPoint = node.segments[i].points[j];
            var angle = ej.datavisualization.Diagram.Geometry.findAngle(targetPoint, node.segments[i].points[j + 1]);
            if (handle.alignment && handle.alignment != "auto") {
                if (handle.offset == 1) angle += 180;
                return {
                    position: ej.datavisualization.Diagram.Geometry.transform(position.offset, handle.offset != 0 && handle.offset != 1 ? angle + 45 : angle, this._getAlignedPosition(node, handle)), angle: angle
                };
            }
            else {
                //avoid overlapping
                var obj = this._avoidOverlapWithSourceAndTarget(node, handle.offset, handle.size, position.offset, angle, i, j, diagram);
                pt = {
                    position: obj.position, angle: handle.offset == 1 ? (180 + angle) % 360 : angle, direction: obj.direction
                };
            }
            return pt;
        },
        _getAlignedPosition: function (connector, handle) {
            var cnst = handle.text === undefined ? 10 : 0;
            switch (handle.alignment) {
                case "center":
                    return 0;
                case "before":
                    return -((handle.size || 0) / 2 + cnst);
                case "after":
                    return (handle.size || 0) / 2 + cnst;
            }
            return 0;
        },
        _avoidOverlapWithSourceAndTarget: function (connector, offset, size, position, angle, i, j, diagram) {
            var next, ang;
            var pt = position; var targetSegment = connector.segments[i];
            var cnst = 90;
            if (offset == 0) {
                next = connector.segments[i].points[j + 2] ? connector.segments[i].points[j + 2] : connector.segments[i + 1] ? connector.segments[i + 1].points[1] : null;
                if (next) {
                    ang = ej.datavisualization.Diagram.Geometry.findAngle(connector.segments[i].points[j], next);
                }
                if (connector.sourceNode) cnst = 45;
            }
            else if (offset == 1) {
                next = connector.segments[i].points[j - 1] ? connector.segments[i].points[j - 1] : connector.segments[i - 1] ? connector.segments[i - 1][connector.segments[i].points.length - 2] : null;
                if (next) {
                    ang = ej.datavisualization.Diagram.Geometry.findAngle(connector.segments[i].points[j + 1], next);
                }
                angle += 180;
                angle %= 360;
                if (connector.targetNode) cnst = 45;
            }
            if (next) {
                if (angle % 90 == 0) {
                    var direction;
                    if (ang > 270 && angle == 0) angle = 360;
                    if (angle == 90) {
                        if (ang < angle) {
                            angle += cnst; direction = "right";
                        }
                        else {
                            angle -= cnst; direction = "left";
                        }
                    }
                    else if (angle == 270) {
                        if (ang < angle) {
                            angle += cnst; direction = "left";
                        }
                        else {
                            angle -= cnst; direction = "right";
                        }
                    }
                    else if (angle == 180) {
                        if (ang < angle) {
                            angle += cnst; direction = "bottom";
                        }
                        else {
                            angle -= cnst; direction = "top";
                        }
                    }
                    else {
                        if (ang < angle) {
                            angle += cnst; direction = "top";
                        }
                        else {
                            angle -= cnst; direction = "bottom";
                        }
                    }
                    pt = ej.datavisualization.Diagram.Geometry.transform(pt, angle, size != undefined ? Math.max(5, size / 2 + 10) : 0);
                } else {
                    var fourty5 = 45;
                    var one35 = 135;
                    var two25 = 225;
                    var three15 = 315;
                    var bounds;
                    if (offset == 0 && connector.sourceNode || offset == 1 && connector.targetNode) {
                        var source = offset == 0 && connector.sourceNode ? diagram.nameTable[connector.sourceNode] : diagram.nameTable[connector.targetNode];
                        if (source) bounds = ej.datavisualization.Diagram.Util.bounds(source);
                        if (bounds) {
                            var part = 180 / (2 + 2 / (bounds.height / bounds.width));
                            fourty5 = part;
                            one35 = (180 - part);
                            two25 = one35 + (2 * part);
                            three15 = 360 - part;
                        }
                    }
                    if (angle >= fourty5 && angle <= one35 || angle >= two25 && angle <= three15) cnst = angle % 180 > 90 ? -cnst : cnst;
                    else if (angle > one35 && angle < two25) angle > 180 ? cnst = -45 : cnst = 45;
                    else angle > 0 ? cnst = -45 : cnst = 45;
                    pt = ej.datavisualization.Diagram.Geometry.transform(pt, angle + cnst, size != undefined ? Math.max(5, size / 2 + 10) : 0);
                }
            } else {
                var fourty5 = 45;
                var one35 = 135;
                var two25 = 225;
                var three15 = 315;
                var bounds;
                if (offset == 0 && connector.sourceNode || offset == 1 && connector.targetNode) {
                    var source = offset == 0 && connector.sourceNode ? diagram.nameTable[connector.sourceNode] : diagram.nameTable[connector.targetNode];
                    if (source) bounds = ej.datavisualization.Diagram.Util.bounds(source);
                    if (bounds) {
                        var part = 180 / (2 + 2 / (bounds.height / bounds.width));
                        fourty5 = part;
                        one35 = (180 - part);
                        two25 = one35 + (2 * part);
                        three15 = 360 - part;
                    }
                }
                if (angle >= fourty5 && angle <= one35 || angle >= two25 && angle <= three15) cnst = angle % 180 > 90 ? -cnst : cnst;
                else if (angle > one35 && angle < two25) angle > 180 ? cnst = -45 : cnst = 45;
                else angle <= fourty5 ? cnst = -45 : cnst = 45;
                angle += 360;
                angle %= 360;
                pt = ej.datavisualization.Diagram.Geometry.transform(pt, angle + cnst, size != undefined ? Math.max(5, size / 2 + (Math.abs(cnst % 45) > 0 ? 13 : 10)) : 0);
            }
            return {
                position: pt, direction: direction
            };
        },
        _getHandleShape: function (handle, cx, cy) {
            var visible = handle.visible ? "visible" : "hidden";
            var shape = {
                "id": handle.name + "_shape", "class": "userHandle", "cx": cx, "cy": cy, "r": handle.size / 2, "fill": handle.backgroundColor,
                "stroke": handle.borderColor, "stroke-width": handle.borderWidth || 0,
                "visibility": visible
            };
            return shape;
        },

        _updateHandleShape: function (handle, cx, cy, svg) {
            var visible = handle.visible ? "visible" : "hidden";
            var attr = {
                "id": handle.name + "_shape", "cx": cx, "cy": cy, "r": handle.size / 2, "fill": handle.backgroundColor,
                "stroke": handle.borderColor, "stroke-width": handle.borderWidth || 0, "visibility": visible
            };
            svg.circle(attr);
        },

        _updateHanleIcon: function (handle, d, svg, x, y) {
            var visible = handle.visible ? "visible" : "hidden";
            var attr = { "id": handle.name + "_icon", "d": d, "fill": handle.pathColor, "transform": "translate(" + x + "," + y + ")", "visibility": visible };
            svg.path(attr);
        },

        _getHanleIcon: function (handle, d, cx, cy) {
            var icon = {
                "id": handle.name, "d": d, "stroke": handle.borderColor,
                "stroke-width": handle.borderWidth, "fill": handle.fillColor
            };
            return icon;
        },

        renderPivotPoint: function (node, scale, svg, resizeCorner, dragging, diagram) {
            var x = node.width * (node.pivot ? node.pivot.x : 0.5);
            var y = node.height * (node.pivot ? node.pivot.y : 0.5);
            var visible = "visible";
            if (ej.datavisualization.Diagram.Util.canShowResizeThumbs(diagram)) {
                var width = node.width ? node.width : node._width;
                var height = node.height ? node.height : node._height;
                var rect1 = ej.datavisualization.Diagram.Rectangle(0, 0, 14, 14);
                var rect2 = ej.datavisualization.Diagram.Rectangle(((width / 2) * scale), 0, 14, 14);
                var rect3 = ej.datavisualization.Diagram.Rectangle(0, (height / 2) * scale, 14, 14);
                visible = this._resizeHandleVisiblity(rect1, rect2, rect3);
            }
            if (!svg.getElementById("pivot")) {
                ej.datavisualization.Diagram.SvgContext._renderResizeCorner("pivot", node, x * scale, y * scale, svg, undefined, 4, visible);
            }
            else
                ej.datavisualization.Diagram.SvgContext._updateResizeCorner("pivot", x * scale, y * scale, svg, visible, resizeCorner, dragging, diagram, undefined);
            this._updatePivotLine(node, svg, scale, true);
        },

        _removePivotPoint: function (node, svg, scale) {
            var pivot = svg.getElementById("pivot");
            if (pivot) {
                pivot.parentNode.removeChild(pivot);
                this._updatePivotLine(node, svg, scale, false);
            }
        },

        _renderPivotLine: function (node, svg, scale, padding) {
            if (!node.container) {
                var width = node.width ? node.width : node._width;
                var height = node.height ? node.height : node._height;
                var pivotPoint = node.pivot ? node.pivot : { x: 0.5, y: 0.5 };
                var rotateThumb = ej.datavisualization.Diagram.Point(width * pivotPoint.x, -20 / scale);
                if (padding)
                    rotateThumb.y += padding;
                var pivot = ej.datavisualization.Diagram.Point(width * pivotPoint.x, 0);
                var handle = svg.getElementById(svg.document.id + "handle_g");
                var line = svg.line({
                    "id": "pivotLine", "x1": rotateThumb.x * scale, "y1": rotateThumb.y * scale, "x2": pivot.x * scale, "y2": pivot.y * scale,
                    "stroke": node._type == "label" ? "red" : "black", "stroke-width": 1, "stroke-dasharray": "2,3", "fill": "none"
                });
                handle.appendChild(line);
            }
        },

        _renderResizeBorder: function (id, node, svg, scale) {
            var handle = svg.getElementById(svg.document.id + "handle_g");
            var width = node.width ? node.width : node._width;
            var height = node.height ? node.height : node._height;
            if (node.type == "umlclassifier")
                var rect = ej.datavisualization.Diagram.ClassifierHelper.renderResizeBorder(id, node, svg, scale);
            else {
                var rect = svg.rect({
                    "id": id, "class": "resizeRect", "width": width * scale, "height": height * scale, "stroke": node._type == "label" ? "red" : "#097F7F", "stroke-width": 0.6, "stroke-dasharray": "6,3", "fill": "none", "pointer-events": "none"
                });
            }
            handle.appendChild(rect);
        },

        _renderResizeCorner: function (corner, node, cx, cy, svg, state, r, visible) {
            var handle = svg.getElementById(svg.document.id + "handle_g");
            var pEvnts;
            var fill = "white";
            if (!(ej.datavisualization.Diagram.Util.canResize(node))) {
                fill = "darkgray";
            }
            if (state) {
                fill = "darkgray";
                pEvnts = "none";
            }
            var attr = { "id": corner, "class": "resizeCorners", "fill": fill, "stroke": node._type == "label" ? "#097F7F" : "black", "stroke-width": 1, "cx": cx, "cy": cy, "r": r || 7, "visibility": visible };
            attr = this._setPadding(attr);
            handle.appendChild(svg.circle(attr));
            attr = { "id": corner + "_transparent", "class": corner, "fill": "transparent", "cx": attr.cx, "cy": attr.cy, "r": r || 10, "visibility": attr.visibility };
            if (pEvnts) attr["pointer-events"] = pEvnts;
            handle.appendChild(svg.circle(attr));
        },
        _setPadding: function (attr) {
            if ((attr.id === "n-resize" || attr.id === "w-resize" || attr.id === "e-resize" || attr.id === "s-resize") && attr.visibility === "hidden") {
                var padding = 20;
                if (attr.id === "n-resize")
                    attr.cy = attr.cy - padding;
                if (attr.id === "w-resize")
                    attr.cx = attr.cx - padding;
                if (attr.id === "e-resize")
                    attr.cx = attr.cx + padding;
                if (attr.id === "s-resize")
                    attr.cy = attr.cy + padding;
                attr.visibility = "visible";
            }
            return attr;
        },
        _renderRotateThumb: function (corner, node, cx, cy, scale, svg) {
            if (!node.container) {
                var handle = svg.getElementById(svg.document.id + "handle_g");
                var d = "M 16.856 10.239 L 18 3.438 l -2.189 0.817 c -0.974 -1.694 -2.482 -2.995 -4.326 -3.696 C 9.375 -0.245 7.071" +
                    "-0.18 5.01 0.744 C 2.942 1.668 1.365 3.342 0.558 5.453 c -0.803 2.115 -0.738 4.414 0.185 6.478 c 0.925 2.064 " +
                "2.6 3.645 4.714 4.45 c 0.969 0.371 1.993 0.554 3.013 0.554 c 1.345 0 2.685 -0.317 3.897 -0.948 l -1.016 -1.962 c -1.584 0.822" +
                "-3.445 0.929 -5.114 0.293 c -1.56 -0.596 -2.793 -1.762 -3.479 -3.289 C 2.078 9.502 2.031 7.803 2.622 6.244 C 3.216 4.68 4.387" +
                " 3.443 5.914 2.761 C 7.437 2.079 9.137 2.03 10.7 2.626 c 1.246 0.475 2.271 1.328 2.986 2.424 L 11.54 5.851 L 16.856 10.239 Z";
                var fill = "#231f20";
                if (!(ej.datavisualization.Diagram.Util.canRotate(node)))
                    fill = "darkgray";
                var width = 20;
                var height = 20;
                var dist = 20;
                var attr = {
                    "id": "rotatehandle", "class": corner, "fill": fill, "stroke": "black", "stroke-width": 0.5, "width": width, "height": height, "d": d,
                    "transform": "translate(" + (cx * scale - width / 2) + "," + (cy * scale - height) + ")"
                };
                var path = svg.path(attr);
                var circle = svg.circle({
                    "id": "rotate", "class": corner, "fill": "transparent", "stroke": "none", "cx": width / 2, "cy": height / 2, "r": 13,
                    "transform": "translate(" + (cx * scale - width / 2) + "," + (cy * scale - height) + ")"
                });
                handle.appendChild(path);
                handle.appendChild(circle);
            }
        },

        _refreshEndPointHandles: function (shape, svg, scale) {
            if (shape && shape.segments) {
                var handle = svg.getElementById(svg.document.id + "handle_g");
                if (handle && handle.childNodes.length > 0) {
                    for (var i = handle.childNodes.length - 1; i >= 0 ; i--) {
                        var child = handle.childNodes[i];
                        if (child.id !== "sourceEndPoint" && child.id !== "targetEndPoint") {
                            child.parentNode.removeChild(child);
                        }
                    }
                }
                this._renderEndPointHandle(shape, svg, scale);
            }
        },
        _renderEndPointHandle: function (connector, svg, scale) {
            if (!connector.isPhase) {
                var enabled = ej.datavisualization.Diagram.Util.canDragSegmentThumbs(connector);
                for (var i = 0; i < connector.segments.length; i++) {
                    var segment = connector.segments[i];
                    if (segment.type == "bezier") {
                        this._renderBezierLine("bezierline1_" + i, segment._startPoint, segment._point1, scale, svg, enabled);
                        this._renderBezierLine("bezierline2_" + i, segment._endPoint, segment._point2, scale, svg, enabled);
                        this._renderEndPointCorner("bezierpoint1_" + i, segment._point1.x * scale, segment._point1.y * scale, false, svg, enabled);
                        this._renderEndPointCorner("bezierpoint2_" + i, segment._point2.x * scale, segment._point2.y * scale, false, svg, enabled);
                    }
                    var points = segment.points;
                    if (i == 0) {
                        this._renderEndPointCorner("sourceEndPoint", segment._startPoint.x * scale, segment._startPoint.y * scale, ej.datavisualization.Diagram.Util.isSourceConnected(connector), svg,
                              ej.datavisualization.Diagram.Util.canDragSourceEnd(connector));
                    }
                    if (i == connector.segments.length - 1) {
                        this._renderEndPointCorner("targetEndPoint", segment._endPoint.x * scale, segment._endPoint.y * scale, ej.datavisualization.Diagram.Util.isTargetConnected(connector), svg,
                            ej.datavisualization.Diagram.Util.canDragTargetEnd(connector));
                        if (segment.type == "orthogonal") {
                            this._renderTerminalOrthoThumbs(segment, svg, scale, i, enabled);
                        }
                    }
                    else {
                        if (segment.type != 'orthogonal') {
                            this._renderSegmentEndThumb("segmentEnd_" + i, segment._endPoint.x * scale, segment._endPoint.y * scale, ej.datavisualization.Diagram.Util.isSourceConnected(connector), svg,
                                   ej.datavisualization.Diagram.Util.canDragSourceEnd(connector));
                        } else {
                            this._renderTerminalOrthoThumbs(segment, svg, scale, i, enabled);
                        }

                    }
                }
            }
        },

        _renderTerminalOrthoThumbs: function (segment, svg, scale, index, isEnabled) {
            var orientation;
            if (segment.points.length > 2)
                for (var i = 0; i < segment.points.length - 1; i++) {
                    var length = ej.datavisualization.Diagram.Geometry.distance(segment.points[i], segment.points[i + 1]);
                    if (segment.points[i].y.toFixed(2) == segment.points[i + 1].y.toFixed(2)) {
                        orientation = "horizontal";
                    }
                    else orientation = "vertical";
                    var visible;
                    if (length >= 50) visible = "visible"; else visible = "hidden";
                    this._renderOrthogonalThumb(("OrthoThumb_" + i) + "_" + index, ((segment.points[i].x + segment.points[i + 1].x) / 2) * scale, ((segment.points[i].y + segment.points[i + 1].y) / 2) * scale, svg, visible, orientation, isEnabled);
                }
            else {
                var length = segment.length || ej.datavisualization.Diagram.Geometry.distance(segment._startPoint, segment._endPoint);
                if (length >= 50) visible = "visible"; else visible = "hidden";
                if (segment._startPoint.y.toFixed(2) == segment._endPoint.y.toFixed(2)) {
                    orientation = "horizontal";
                }
                else orientation = "vertical";
                this._renderOrthogonalThumb("OrthoThumb_" + index, ((segment._endPoint.x + segment._startPoint.x) / 2) * scale, ((segment._endPoint.y + segment._startPoint.y) / 2) * scale, svg, visible, orientation, isEnabled);
            }
        },

        _renderEndPointCorner: function (corner, x, y, isConnected, svg, isenabled) {
            var handle = svg.getElementById(svg.document.id + "handle_g");
            var fill = isConnected ? "#8CC63F" : "white";
            if (!isenabled) fill = "darkgray";
            var attr = { "id": corner, "class": corner, opacity: 0.75, "fill": fill, "stroke": "black", "stroke-width": 2, "cx": x, "cy": y, "r": 7 };
            if (!svg.getElementById(corner))
                handle.appendChild(svg.circle(attr));
            else
                svg.circle(attr);

        },

        _renderSegmentEndThumb: function (corner, x, y, isConnected, svg, isenabled) {
            var handle = svg.getElementById(svg.document.id + "handle_g");
            var fill = "#e2e2e2";
            if (!isenabled) fill = "darkgray";
            var attr = { "id": corner, "class": "segmentEnd", "fill": fill, "stroke": "black", "stroke-width": 2, "cx": x, "cy": y, "r": 5 };
            handle.appendChild(svg.circle(attr));
        },
        _renderOrthogonalThumb: function (corner, x, y, svg, visibility, orientation, isEnabled) {
            var path, h, v; if (orientation == "horizontal") {
                path = "M0,7 L15,0 L30,7 L15,14 z"; h = -15; v = -7;
            } else { path = "M7,0 L0,15 L7,30 L14,15 z"; h = -7; v = -15; };
            var handle = svg.getElementById(svg.document.id + "handle_g");
            var fill = "#e2e2e2";
            if (!isEnabled) fill = "darkgray";
            var attr = {
                "id": corner, "class": "segmentEnd", "fill": fill, "stroke": "black", "stroke-width": 1, d: path, transform: "translate(" + (x + h) + "," + (y + v) + ")",
                "visibility": visibility
            };
            handle.appendChild(svg.path(attr));
        },
        _renderBezierLine: function (id, start, end, scale, svg) {
            var line = svg.line({
                "id": id, "x1": start.x * scale, "y1": start.y * scale, "x2": end.x * scale, "y2": end.y * scale,
                "stroke": "black", "stroke-width": 1, "stroke-dasharray": "3,3", "fill": "none"
            });
            var handle = svg.getElementById(svg.document.id + "handle_g");
            handle.appendChild(line);
        },
        _renderControlPointCorner: function (corner, point, index, svg) {
            var g = svg.g({ "class": corner });
            svg.getElementById(svg.document.id + "handle_g").appendChild(g);
            var attr = {
                "id": corner + "_" + index, "fill": "white", "stroke": "black", "stroke-width": 2,
                "cx": point.x, "cy": point.y, "r": 5
            };
            g.appendChild(svg.circle(attr));
        },
        _selectorLocation: function (shape, scale, diagram) {
            var width = shape.width;
            var height = shape.height, transform;
            if (shape._type !== "label")
                transform = "translate(" + (shape.offsetX - width * shape.pivot.x) * scale + "," + (shape.offsetY - height * shape.pivot.y) * scale + "),rotate(" + shape.rotateAngle + "," + (width * shape.pivot.x) * scale + "," + (height * shape.pivot.y) * scale + ")";
            else {
                var node = diagram.findNode(shape._parent);
                height = height ? height : node.height;
                var location = diagram.activeTool._findLabelAtNode(node, shape);
                if (!node.segments)
                    transform = "translate(" + (location.x) * scale + "," + (location.y) * scale + "),rotate(" + node.rotateAngle + "),rotate(" + shape.rotateAngle + "," + (width / 2) * scale + "," + (height / 2) * scale + ")";
                else if (node.segments && shape.relativeMode !== "segmentpath")
                    transform = "translate(" + (location.x) * scale + "," + (location.y) * scale + "),rotate(" + shape.rotateAngle + "," + (width / 2) * scale + "," + (height / 2) * scale + ")";
                else {
                    var location = ej.datavisualization.Diagram.SvgContext._getConnectorHandlePosition(shape, node, scale, diagram)
                    location.position.x = location.position.x + shape.margin.left - shape.margin.right;
                    location.position.y = location.position.y + shape.margin.top - shape.margin.bottom;
                    transform = "translate(" + (location.position.x - width / 2) * scale + "," + (location.position.y - height / 2) * scale + "),rotate(" + location.angle + "," + (width / 2) * scale + "," + (height / 2) * scale + "),rotate(" + shape.rotateAngle + "," + (width / 2) * scale + "," + (height / 2) * scale + ")";
                }
            }
            return transform;
        },
        updateSelector: function (shape, svg, scale, diagram, constraints, resizeCorner, dragging) {
            if (shape) {
                var width = shape.width ? shape.width : shape._width;
                var height = shape.height ? shape.height : shape._height;
                var transform;
                if (shape.segments) {
                    this._updateEndPointHandle(shape, svg, scale);
                    if (constraints & ej.datavisualization.Diagram.SelectorConstraints.UserHandles)
                        this.updateUserHandles(diagram.model.selectedItems.userHandles, shape, svg, false, false, scale, diagram);
                } else if (shape.type === "phase") {
                    var bounds = diagram._getPhaseBounds(shape);
                    svg.g({
                        "id": svg.document.id + "handle_g", "class": "handle", "pointer-events": "visible",
                        "transform": "translate(" + (bounds.x) * scale + "," + (bounds.y) * scale + "),rotate(0," + (bounds.width / 2) * scale + "," + (bounds.height / 2) * scale + ")"
                    });
                    svg.rect({
                        "id": "phaseSelector", "class": "phaseSelector",
                        "stroke-width": 2, "stroke-dasharray": "3,3", "pointer-events": "none",
                        "width": (bounds.width < 0) ? 1 : bounds.width * scale, "height": (bounds.height < 0) ? 1 : bounds.height * scale, "fill": "transparent", "stroke": "red",
                    });
                } else {
                    if (!(shape.isSwimlane || shape.isLane)) {
                        transform = this._selectorLocation(shape, scale, diagram);
                        var g = svg.g({
                            "id": svg.document.id + "handle_g",
                            "transform": transform
                        });
                    }

                    if (ej.datavisualization.Diagram.Util.canShowResizeThumbs(diagram)) {
                        var rCorner = svg.document.parentNode.getElementsByClassName("resizeCorners");
                        var rotateHandle = svg.document.getElementById("rotatehandle");

                        var visibility = dragging ? "hidden" : "visible";
                        for (var i = 0; i < rCorner.length; i++) {
                            rCorner[i].setAttribute("visibility", visibility);
                        }

                        if (rotateHandle != null) {
                            var pivotPoint = svg.document.getElementById("pivotLine");
                            rotateHandle.setAttribute("visibility", visibility);
                            pivotPoint.setAttribute("visibility", visibility);
                        }
                    }

                    var type = diagram.getObjectType(shape);
                    if (type === "group" || shape.type === "pseudoGroup" || !((diagram.activeTool.name == "move" || diagram.activeTool.name == "rotate" || diagram.activeTool.name == "labelMove" || diagram.activeTool.name == "labelRotate") && diagram.activeTool.inAction)) {
                        this._updateMultiSelectHandle(shape, scale, constraints, diagram)
                        this._updateResizeHandle(shape, svg, scale, constraints, resizeCorner, dragging, diagram);
                    }
                    if ((diagram.activeTool.name == "rotatetool" || diagram.activeTool.name == "labelRotate") && diagram.activeTool.inAction) {
                        this.renderPivotPoint(shape, scale, svg, resizeCorner, dragging, diagram);
                    }
                    if (diagram.model.selectedItems.userHandles && diagram.model.selectedItems.userHandles.length > 0) {
                        var isMultipleSelection = false;
                        if (diagram.selectionList[0] && diagram.selectionList[0].name == "multipleSelection")
                            isMultipleSelection = true;
                        if (constraints & ej.datavisualization.Diagram.SelectorConstraints.UserHandles) {
                            this.updateUserHandles(diagram.model.selectedItems.userHandles, shape, svg, isMultipleSelection, false, scale, diagram);
                            return true;
                        }
                    }
                }
            }
        },

        _updatePhaseResize: function (node, svg, scale, constraints) {
            var nPoint, points = [], attr;
            var bounds = ej.datavisualization.Diagram.Util.bounds(node);
            //#region left
            nPoint, points = [];
            points.push({ x: bounds.topLeft.x * scale, y: bounds.topLeft.y * scale });
            points.push({ x: bounds.bottomLeft.x * scale, y: bounds.bottomLeft.y * scale });
            nPoint = this._convertToSVGPoints(points);
            attr = { "id": "w-resize", "points": nPoint, };
            svg.polyline(attr);
            //#endregion  

            //#region top
            nPoint, points = [];
            points.push({ x: bounds.topLeft.x * scale, y: bounds.topLeft.y * scale });
            points.push({ x: bounds.topRight.x * scale, y: bounds.topRight.y * scale });
            nPoint = this._convertToSVGPoints(points);
            attr = { "id": "n-resize", "points": nPoint };
            svg.polyline(attr);
            //#endregion 

            //#region right 
            nPoint, points = [];
            points.push({ x: bounds.topRight.x * scale, y: bounds.topRight.y * scale });
            points.push({ x: bounds.bottomRight.x * scale, y: bounds.bottomRight.y * scale });
            nPoint = this._convertToSVGPoints(points);
            attr = { "id": "e-resize-hitTest", "points": nPoint };
            svg.polyline(attr);
            attr = { "id": "e-resize", "points": nPoint };
            svg.polyline(attr);
            //#endregion


            //#region bottom
            nPoint, points = [];
            points.push({ x: bounds.bottomLeft.x * scale, y: bounds.bottomLeft.y * scale });
            points.push({ x: bounds.bottomRight.x * scale, y: bounds.bottomRight.y * scale });
            nPoint = this._convertToSVGPoints(points);
            attr = { "id": "s-resize-hitTest", "points": nPoint, };
            svg.polyline(attr);
            attr = { "id": "s-resize", "points": nPoint, };
            svg.polyline(attr);
            //#endregion

        },
        _updateResizeHandle: function (node, svg, scale, constraints, resizeCorner, dragging, diagram) {
            if (!(node.isSwimlane || node.isLane)) {
                var width = node.width ? node.width : node._width;
                var height = node.height ? node.height : node._height;
                var pivot = node.pivot ? node.pivot : { x: 0.5, y: 0.5 };
                var corner = node._corners;
                var visible = "visible", resizable;
                if (ej.datavisualization.Diagram.Util.canShowResizeThumbs(diagram)) {
                    var rect1 = ej.datavisualization.Diagram.Rectangle(0, 0, 14, 14);
                    var rect2 = ej.datavisualization.Diagram.Rectangle(((width / 2) * scale), 0, 14, 14);
                    var rect3 = ej.datavisualization.Diagram.Rectangle(0, (height / 2) * scale, 14, 14);
                    visible = this._resizeHandleVisiblity(rect1, rect2, rect3);
                }

                var rotate = ej.datavisualization.Diagram.Point(width * pivot.x, -20 / scale);
                if (constraints & ej.datavisualization.Diagram.SelectorConstraints.Rotator && node.type != "umlclassifier") {
                    var padding = 0;
                    if (visible == "hidden")
                        padding = -20;
                    this._updateRotateHandle("rotate", rotate.x, rotate.y + padding, scale, svg, node);
                    this._updatePivotLine(node, svg, scale, undefined, padding);
                }
                //this._updateResizeCorner("pivot", node.offsetX * scale, node.offsetY * scale, svg);
                if (constraints & ej.datavisualization.Diagram.SelectorConstraints.Resizer) {
                    if (node.type != "umlclassifier") {
                        if (node._type == "label") resizable = !(node.constraints & ej.datavisualization.Diagram.LabelConstraints.Resizable);
                        this._updateResizeCorner("nw-resize", 0, 0, svg, visible, resizeCorner, dragging, diagram, node._type == "label" ? resizable : !(node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeNorthWest));
                        this._updateResizeCorner("n-resize", (width / 2) * scale, 0, svg, visible, resizeCorner, dragging, diagram, node._type == "label" ? resizable : !(node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeNorth));
                        this._updateResizeCorner("ne-resize", width * scale, 0, svg, visible, resizeCorner, dragging, diagram, node._type == "label" ? resizable : !(node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeNorthEast));
                        this._updateResizeCorner("w-resize", 0, (height / 2) * scale, svg, visible, resizeCorner, dragging, diagram, node._type == "label" ? resizable : !(node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeWest));
                        this._updateResizeCorner("e-resize", (width * scale), (height / 2) * scale, svg, visible, resizeCorner, dragging, diagram, node._type == "label" ? resizable : !(node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeEast));
                        this._updateResizeCorner("sw-resize", 0, height * scale, svg, visible, resizeCorner, dragging, diagram, node._type == "label" ? resizable : !(node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeSouthWest));
                        this._updateResizeCorner("s-resize", (width / 2) * scale, (height * scale), svg, visible, resizeCorner, dragging, diagram, node._type == "label" ? resizable : !(node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeSouth));
                        this._updateResizeCorner("se-resize", width * scale, height * scale, svg, visible, resizeCorner, dragging, diagram, node._type == "label" ? resizable : !(node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeSouthEast));
                    }
                    this._updateResizeBorder("resizeBorder", node, svg, scale);
                }
            }
            else this._updatePhaseResize(node, svg, scale, constraints);
        },

        _resizeHandleVisiblity: function (rectangle1, rectangle2, rectangle3) {
            var overlap1 = ej.datavisualization.Diagram.Geometry.intersectsRect(rectangle1, rectangle2);
            var overlap2 = ej.datavisualization.Diagram.Geometry.intersectsRect(rectangle1, rectangle3);
            var visible = "visible";
            if (overlap1 === true || overlap2 === true) {
                visible = "hidden";
            }
            return visible;
        },

        _updateRotateHandle: function (thumb, cx, cy, scale, svg, node) {
            var width = 20;
            var height = 20;
            var dist = 20;
            var attr = {
                "id": "rotatehandle",
                "transform": "translate(" + (cx * scale - width / 2) + "," + (cy * scale - height) + ")"
            };
            svg.path(attr);
            svg.circle({
                "id": "rotate",
                "transform": "translate(" + (cx * scale - width / 2) + "," + (cy * scale - height) + ")"
            });
        },

        _updatePivotLine: function (node, svg, scale, considerpivot, padding) {
            var width = node.width ? node.width : node._width;
            var height = node.height ? node.height : node._height;
            var pivotPoint = node.pivot ? node.pivot : { x: 0.5, y: 0.5 };
            var rotateThumb = ej.datavisualization.Diagram.Point(width * pivotPoint.x, -20 / scale);
            if (padding)
                rotateThumb.y += padding;
            var pivot;
            if (considerpivot) {
                pivot = ej.datavisualization.Diagram.Point(width * pivotPoint.x, height * pivotPoint.y);
            } else pivot = ej.datavisualization.Diagram.Point(width * pivotPoint.x, 0);
            var line = svg.line({
                "id": "pivotLine", "x1": rotateThumb.x * scale, "y1": rotateThumb.y * scale, "x2": pivot.x * scale, "y2": pivot.y * scale
            });
        },
        _updateResizeBorder: function (id, node, svg, scale) {
            var width = node.width ? node.width : node._width;
            var height = node.height ? node.height : node._height;
            if (node.type == "umlclassifier")
                var rect = ej.datavisualization.Diagram.ClassifierHelper.renderResizeBorder(id, node, svg, scale);
            else
                svg.rect({
                    "id": id, "width": width * scale, "height": height * scale,
                });
        },

        _updateResizeCorner: function (corner, cx, cy, svg, visible, resizeCorner, dragging, diagram, constraints) {
            var attr = { "id": corner, "cx": cx, "cy": cy, "visibility": visible };
            attr = this._setPadding(attr);
            if (ej.datavisualization.Diagram.Util.canShowResizeThumbs(diagram)) {
                if (dragging && resizeCorner != corner)
                    attr.visibility = "hidden";
                else if (attr.visibility == "visible" || dragging)
                    attr.visibility = "visible";
            }
            svg.circle(attr);
            attr = { "id": corner + "_transparent", "cx": attr.cx, "cy": attr.cy, "visibility": attr.visibility };
            if (attr.visibility === "hidden" || constraints)
                attr["pointer-events"] = "none";
            else
                attr["pointer-events"] = "all";
            svg.circle(attr);
        },

        _updateEndPointHandle: function (connector, svg, scale) {
            var enabled = ej.datavisualization.Diagram.Util.canDragSegmentThumbs(connector);
            for (var i = 0; i < connector.segments.length; i++) {
                var segment = connector.segments[i];
                var points = segment.points;
                if (i == connector.segments.length - 1) {
                    this._updateEndPointCorner("targetEndPoint", points[points.length - 1].x * scale, points[points.length - 1].y * scale, ej.datavisualization.Diagram.Util.isTargetConnected(connector), svg,
                ej.datavisualization.Diagram.Util.canDragTargetEnd(connector));
                    if (segment.type == "orthogonal") {
                        this._updateTerminalOrthoThumbs(segment, svg, scale, i, enabled);
                    }
                }
                else {
                    if (segment.type != "orthogonal") {
                        this._updateSegmentEndThumb("segmentEnd_" + i, segment._endPoint.x * scale, segment._endPoint.y * scale, ej.datavisualization.Diagram.Util.isSourceConnected(connector), svg,
                            ej.datavisualization.Diagram.Util.canDragSourceEnd(connector));
                    }
                    else {
                        this._updateTerminalOrthoThumbs(segment, svg, scale, i, enabled);
                    }
                }
                if (i == 0)
                    this._updateEndPointCorner("sourceEndPoint", points[0].x * scale, points[0].y * scale, ej.datavisualization.Diagram.Util.isSourceConnected(connector), svg,
                        ej.datavisualization.Diagram.Util.canDragSourceEnd(connector));
                if (segment.type == "bezier") {
                    this._updateEndPointCorner("bezierpoint1_" + i, segment._point1.x * scale, segment._point1.y * scale, false, svg, enabled);
                    this._updateEndPointCorner("bezierpoint2_" + i, segment._point2.x * scale, segment._point2.y * scale, false, svg, enabled);
                    this._updateBezierLine("bezierline1_" + i, segment._startPoint, segment._point1, scale, svg);
                    this._updateBezierLine("bezierline2_" + i, segment._endPoint, segment._point2, scale, svg);
                }
            }
            //if (points.length > 2) {
            //    for (var i = 1, len = points.length; i < len - 1; ++i) {
            //        this._updateControlPointCorner("controlPoint", points[i], i, svg);
            //    }
            //}
        },

        _updateEndPointCorner: function (corner, x, y, isConnected, svg, isenabled) {
            var fill = isConnected ? "#8CC63F" : "white";
            if (!isenabled) fill = "darkgray";
            var attr = { "id": corner, "fill": fill, "cx": x, "cy": y };
            svg.circle(attr);
        },
        _updateSegmentEndThumb: function (corner, x, y, isConnected, svg, isenabled) {
            var attr = { "id": corner, "cx": x, "cy": y };
            svg.circle(attr);
        },
        _updateOrthoThumb: function (corner, x, y, svg, visibility, orientation, enabled) {
            var fill = "#e2e2e2";
            if (!enabled) fill = "darkgray";
            var path, h, v; if (orientation == "horizontal") {
                path = "M0,7 L15,0 L30,7 L15,14 z"; h = -15; v = -7;
            } else { path = "M7,0 L0,15 L7,30 L14,15 z"; h = -7; v = -15; };
            var attr = { "id": corner, visibility: visibility, transform: "translate(" + (x + h) + "," + (y + v) + ")", d: path, fill: fill };
            svg.path(attr);
        },
        _updateTerminalOrthoThumbs: function (segment, svg, scale, index, enabled) {
            var orientation;
            if (segment.points.length > 2)
                for (var i = 0; i < segment.points.length - 1; i++) {
                    var length = ej.datavisualization.Diagram.Geometry.distance(segment.points[i], segment.points[i + 1]);
                    if (segment.points[i].y.toFixed(2) == segment.points[i + 1].y.toFixed(2)) {
                        orientation = "horizontal";
                    }
                    else orientation = "vertical";
                    var visible;
                    if (length >= 50) visible = "visible"; else visible = "hidden";
                    this._updateOrthoThumb(("OrthoThumb_" + i) + "_" + index, ((segment.points[i].x + segment.points[i + 1].x) / 2) * scale, ((segment.points[i].y + segment.points[i + 1].y) / 2) * scale, svg, visible, orientation, enabled);

                }
            else {
                var length = segment.length || ej.datavisualization.Diagram.Geometry.distance(segment._startPoint, segment._endPoint);
                if (segment._startPoint.y.toFixed(2) == segment._endPoint.y.toFixed(2)) {
                    orientation = "horizontal";
                }
                else orientation = "vertical";
                if (length >= 50) visible = "visible"; else visible = "hidden";
                this._updateOrthoThumb("OrthoThumb_" + index, ((segment._endPoint.x + segment._startPoint.x) / 2) * scale, ((segment._endPoint.y + segment._startPoint.y) / 2) * scale, svg, visible, orientation, enabled);
            }
        },
        _updateBezierLine: function (id, start, end, scale, svg) {
            var line = svg.line({
                "id": id, "x1": start.x * scale, "y1": start.y * scale, "x2": end.x * scale, "y2": end.y * scale
            });
        },
        _updateControlPointCorner: function (corner, point, index, svg) {
            svg.circle({ "id": corner + "_" + index, "cx": point.x, "cy": point.y });
        },

        updateUserHandles: function (handles, node, svg, isMultipleSelection, isDragging, scale, diagram) {
            var userHandle = svg.document.getElementById(svg.document.id + "userHandle_g");
            if (diagram.model.selectedItems.constraints & ej.datavisualization.Diagram.SelectorConstraints.UserHandles) {
                if (!userHandle) {
                    this.renderUserHandles(handles, node, svg, isMultipleSelection, scale, diagram._adornerLayer, diagram);
                } else {
                    if (handles && handles.length > 0) {
                        for (var handleIndex = 0; handleIndex < handles.length; handleIndex++) {
                            if ((isMultipleSelection && handles[handleIndex].enableMultiSelection) || !isMultipleSelection)
                                this._updateHandle(handles[handleIndex], node, svg, isDragging, scale, diagram);
                        }
                    }
                }
            }
        },

        _updateHandle: function (handle, node, svg, isDragging, scale, diagram) {
            if (!isDragging && node && handle.visible) {
                var position = this._getHandlePosition(handle, node, scale, null, diagram);
                var d = handle._absolutePath;
                if (!d || handle.size != handle._size) d = handle._absolutePath = ej.datavisualization.Diagram.Geometry.updatePath(0, 0, handle.size / 2, handle.size / 2, handle.pathData, svg);
                handle._size = handle._size;
                var x = position.x * scale;// - (node.segments ? 0 : handle.size / 4);
                var y = position.y * scale;// - (node.segments ? 0 : handle.size / 4)
                this._updateHandleShape(handle, x, y, svg);
                this._updateHanleIcon(handle, d, svg, x - handle.size / 4, y - handle.size / 4);
                if (svg.getElementById(handle.name + "_shape") && handle.visible) {
                    svg.getElementById(handle.name + "_shape").style.display = "block";
                    svg.getElementById(handle.name + "_icon").style.display = "block";
                }
            }
            else {
                if (svg.getElementById(handle.name + "_shape")) {
                    svg.getElementById(handle.name + "_shape").style.display = "none";
                    svg.getElementById(handle.name + "_icon").style.display = "none";
                }
            }
        },

        clearSelector: function (svg, parent, diagram) {
            var handle = svg.getElementById(svg.document.id + "handle_g");
            if (handle)
                parent.removeChild(handle);
            handle = svg.getElementById(svg.document.id + "userHandle_g");
            if (handle)
                parent.removeChild(handle);
            if (diagram) {
                handle = diagram._svg.getElementById(diagram.element[0].id + "_multiselector");
                if (handle)
                    handle.parentNode.removeChild(handle);
            }
        },

        clearSegments: function (svg) {
            var handle = svg.getElementById(svg.document.id + "handle_g");
            $(handle).find(".segmentEnd").remove();
        },

        addSegments: function (svg, connector, scale) {
            var handle = svg.getElementById(svg.document.id + "handle_g");
            this._renderSegmentHandle(connector, svg, scale);
        },

        _renderSegmentHandle: function (connector, svg, scale) {
            if (!connector.isPhase) {
                var enabled = ej.datavisualization.Diagram.Util.canDragSegmentThumbs(connector);
                for (var i = 0; i < connector.segments.length; i++) {
                    var segment = connector.segments[i];
                    if (segment.type == "bezier") {
                        this._renderBezierLine("bezierline1_" + i, segment._startPoint, segment._point1, scale, svg, enabled);
                        this._renderBezierLine("bezierline2_" + i, segment._endPoint, segment._point2, scale, svg, enabled);
                        this._renderEndPointCorner("bezierpoint1_" + i, segment._point1.x * scale, segment._point1.y * scale, false, svg, enabled);
                        this._renderEndPointCorner("bezierpoint2_" + i, segment._point2.x * scale, segment._point2.y * scale, false, svg, enabled);
                    }
                    var points = segment.points;
                    if (!(i === 0 || i === connector.segments.length - 1)) {
                        if (segment.type != 'orthogonal') {
                            this._renderSegmentEndThumb("segmentEnd_" + i, segment._endPoint.x * scale, segment._endPoint.y * scale, ej.datavisualization.Diagram.Util.isSourceConnected(connector), svg,
                                   ej.datavisualization.Diagram.Util.canDragSourceEnd(connector));
                        } else {
                            this._renderTerminalOrthoThumbs(segment, svg, scale, i, enabled);
                        }
                    }
                }
            }
        },

        _initializePageBreaks: function (svg, attr, g) {
            var g1 = svg.g(attr);
            g.appendChild(g1);
            return g1;
        },

        _renderVPageBreakLine: function (start, end, svg, g) {
            var line = svg.line({
                "x1": start.x, "y1": start.y,
                "x2": end.x, "y2": end.y,
                "style": "stroke:#aaaaaa;stroke-width:1;stroke-dasharray:10,10 "
            });
            g.appendChild(line);
        },

        _renderPageSettingsRect: function (start, end, svg, g, _stroke, _fill, _strokewidth) {
            var rect = svg.rect({
                "id": "pageback",
                "x": start.x, "y": start.y, "width": end.x, "height": end.y,
                "style": "fill:" + _fill + ";stroke:" + _stroke + ";stroke-width:" + _strokewidth + ""
            });
            g.appendChild(rect);
        },

        _updatePageBakground: function (start, end, svg, g, _stroke, _fill, _strokewidth) {
            var rect = svg.document.getElementById("pageback");
            var attr = {
                "x": start.x, "y": start.y, "width": (end.x < 0) ? 0 : end.x, "height": (end.y < 0) ? 0 : end.y,
                "style": "fill:" + _fill + ";stroke:" + _stroke + ";stroke-width:" + _strokewidth + ""
            };
            if (rect)
                ej.datavisualization.Diagram.Util.attr(rect, attr);
        },

        _renderHPageBreakLine: function (start, end, svg, g) {
            var line = svg.line({
                "x1": start.x, "y1": start.y,
                "x2": end.x, "y2": end.y,
                "style": "stroke:#aaaaaa;stroke-width:1;stroke-dasharray:10,10 "
            });
            g.appendChild(line);
        },

        _removePageBreaks: function (svg, g, layer) {
            if (g != null) {
                if (layer != null) {
                    layer.removeChild(g);
                }
            }
        },
        removeChild: function (element, view) {
            var elementTar = view.svg.document.getElementById(element.name);
            var htmlLayer = view.svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
            var label = this._findChild(htmlLayer.childNodes, element);
            var adornerLayer = view.svg.document.parentNode.getElementsByClassName("AdornerLayer")[0];
            if (adornerLayer)
                var ports = adornerLayer.parentNode.getElementById(element.name + "_ej_ports");
            if (elementTar)
                elementTar.parentNode.removeChild(elementTar);
            if (ports)
                ports.parentNode.removeChild(ports);
            if (label)
                htmlLayer.removeChild(label);
            if (element._type === "node" && element.type === "html") {
                var htmlelement = htmlLayer.children[element.name + "_parentdiv"];
                if (htmlelement && htmlelement.parentNode)
                    htmlelement.parentNode.removeChild(htmlelement);
            }
        }
        //#endregion
    };
    //#endregion

    //#region Common Renderer
    ej.datavisualization.Diagram.DiagramContext = {

        _renderNodes: function (view, isLoad, isoverView, diagram) {
            if (diagram.nodes()) {
                var nodes = diagram.nodes();
                for (var i = 0, len = nodes.length; i < len; ++i) {
                    var node = diagram.nameTable[nodes[i].name];
                    var panel = view.svg || view._canvas;
                    this._renderNodeObject(node, view, isLoad, isoverView, diagram);
                }
            }
        },

        _renderNodeObject: function (node, view, isLoad, isoverView, diagram) {
            var panel = view.svg || view._canvas;
            if (node._type === "group" && !node.parent) {
                if (!node.container) {
                    //ej.datavisualization.Diagram.Util._updateGroupBounds(node, diagram, true);
                }
                view.context.renderGroup(node, panel, view.diagramLayer, diagram.nameTable, diagram, isLoad, isoverView);
                // ej.datavisualization.Diagram.Util._updateGroupBounds(node, diagram);
                ej.datavisualization.Diagram.DiagramContext.update(node, diagram);
            }
            else {
                if (!node.parent)
                    view.context.renderNode(node, panel, view.diagramLayer, null, diagram);
            }
        },

        _renderConnectors: function (view, diagram) {
            if (diagram.connectors()) {
                var connectors = diagram.connectors();
                var panel = view.svg || view._canvas;
                var connector;
                for (var i = 0, len = connectors.length; i < len; ++i) {
                    connector = connectors[i];
                    diagram._setZorder(connector);
                }
                for (var i = 0, len = connectors.length; i < len; ++i) {
                    connector = connectors[i];
                    this._renderConnectorObject(connector, view, diagram);
                }
            }
        },

        _renderConnectorObject: function (connector, view, diagram) {
            var panel = view.svg || view._canvas;
            ej.datavisualization.Diagram.Util.updateBridging(connector, diagram);
            if (!connector.parent)
                view.context.renderConnector(connector, panel, view.diagramLayer, diagram);
        },

        updateViewPort: function (diagram) {
            var view, panel;
            diagram._svgParentDimention = null;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                if (view.context == ej.datavisualization.Diagram.SvgContext && view.type == "mainview") {
                    ej.datavisualization.Diagram.PageUtil._updatePageSize(diagram);
                }
            });
        },
        renderNode: function (node, diagram, parent) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view._canvas;
                if (parent)
                    parent = panel.document.getElementById(parent.id)
                var isoverView = (view.type == "overview") ? true : false;
                view.context.renderNode(node, panel, parent || view.diagramLayer, undefined, diagram, isoverView);
            });
        },
        addLabel: function (node, label, diagram, index) {
            var view, panel;
            if (diagram._views) {
                diagram._views.forEach(function (viewid) {
                    view = diagram._views[viewid];
                    panel = view.svg || view.canvas;
                    view.context._addLabel(node, label, panel, diagram, index);
                });
            }
        },
        renderPort: function (node, port, diagram, index) {
            var view, panel, isOverView;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                isOverView = view.type === "overview" ? true : false;
                panel = view.svg || view._canvas;
                view.context._insertPort(node, port, !isOverView ? diagram._adornerSvg : panel, index, diagram, isOverView);
            });
        },
        renderConnector: function (connector, diagram, parent) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view._canvas;
                view.context.renderConnector(connector, panel, parent || view.diagramLayer, diagram);
            });
        },

        renderGroup: function (group, diagram, parent) {
            var view, panel;

            diagram._views.forEach(function (viewid) {
                var isOverView
                view = diagram._views[viewid];
                panel = view.svg || view._canvas;
                parent = view.svg.getElementById(group.parent);
                if (view.type == "overview") {
                    isOverView = true;
                }
                view.context.renderGroup(group, panel, parent || view.diagramLayer, diagram.nameTable, diagram, null, isOverView);
            });
        },
        update: function (data, diagram, layout) {
            var update = true;
            if (data.isSwimlane && diagram._disableSwimlaneUptate) {
                update = false;
            }
            if (update) {
                var view, panel;
                diagram._views.forEach(function (viewid) {
                    view = diagram._views[viewid];
                    panel = view.svg || view._canvas;
                    if (diagram && !diagram._isInit && data._status !== "new")
                        data._status = "update";
                    var isoverView = (view.type == "overview") ? true : false;
                    if (data._type === "group" || data.type === "pseudoGroup")
                        view.context.updateGroup(data, panel, diagram, layout, isoverView);
                    else if (data.segments)
                        view.context.updateConnector(data, panel, diagram);
                    else if (data._type == "label") {
                        var node = diagram.findNode(data._parent);
                        view.context.updateLabel(node, data, panel, diagram);
                    }
                    else
                        view.context.updateNode(data, panel, diagram, layout, isoverView);
                });
            }
        },
        _refreshSegments: function (connector, diagram) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view.canvas;
                if (connector.segments)
                    view.context._refreshSegments(connector, panel, diagram);
            });
        },
        _refreshOnlySegments: function (connector, diagram) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view.canvas;
                if (connector.segments)
                    view.context._refreshOnlySegments(connector, panel, diagram);
            });
        },
        renderShadow: function (node, diagram) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view._canvas;
                view.context._renderShadow(node, panel);
            });
        },
        updateShadow: function (node, diagram) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view._canvas;
                view.context._updateShadow(node, panel);
            });
        },
        removeShadow: function (node, diagram) {
            var view, panel;

            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view._canvas;
                view.context._removeShadow(node, panel);
            });
        },
        addNodeLabel: function (shape, label, parent, diagram) {
            var view, panel;
            if (diagram._views) {
                diagram._views.forEach(function (viewid) {
                    view = diagram._views[viewid];
                    panel = view.svg || view.canvas;
                    view.context.addNodeLabel(shape, label, panel, parent, diagram);
                });
            }
        },

        updateLabel: function (node, label, diagram) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view.canvas;
                if (diagram.model.labelRenderingMode == ej.datavisualization.Diagram.LabelRenderingMode.Svg) {
                    view.context._updateSVGLabel(node, label, panel, diagram);
                }
                else
                    view.context.updateLabel(node, label, panel, diagram);
            });
        },

        updatePort: function (node, port, diagram) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                var isoverView = (view.type === "overview") ? true : false
                panel = (!isoverView) ? diagram._adornerSvg : (view.svg || view.canvas);
                view.context.updatePort(node, port, panel, diagram);
            });
        },
        setLabelTemplate: function (node, label, diagram) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view.canvas;
                view.context._updateLabelTemplate(node, label, panel, diagram);
            });
        },
        setNodeShape: function (node, diagram, parent) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view.canvas;
                view.context.setNodeShape(node, panel, parent, diagram);
            });
        },

        setLine: function (connector, diagram, parent) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view.canvas;
                view.context.setLine(connector, panel, parent, diagram);
            });
        },

        renderDecorators: function (connector, diagram) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view.canvas;
                view.context.renderDecorators(connector, panel, diagram);
            });
        },

        clearDecorators: function (connector, diagram) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view.canvas;
                view.context.clearDecorators(connector, panel, diagram);
            });
        },

        updateTargetDecoratorStyle: function (node, diagram) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view.canvas;
                view.context.updateTargetDecoratorStyle(node, panel);
            });
        },

        updateSourceDecoratorStyle: function (node, diagram) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view.canvas;
                view.context.updateSourceDecoratorStyle(node, panel);
            });
        },

        updateNodeStyle: function (node, diagram) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view.canvas;
                view.context._updateNodeStyle(node, panel);
            });
        },

        updateLabelStyle: function (node, label, diagram) {
            diagram._views.forEach(function (viewid) {
                var view = diagram._views[viewid];
                var panel = view.svg || view.canvas;
                view.context.updateLabelStyle(node, label, panel, diagram);
            });
        },

        updateConnectorStyle: function (connector, diagram) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view.canvas;
                view.context._updateConnectorStyle(connector, panel);
            });
        },

        updateTextBlock: function (node, label, diagram) {
            var view, panel;
            diagram._views.forEach(function (viewid) {
                view = diagram._views[viewid];
                panel = view.svg || view.canvas;
                view.context.updateTextBlock(node, label, panel, diagram);
            });

        },

        updateBPMNNodeStyle: function (node, diagram) {
            var child, children, i = 0;
            node = ej.datavisualization.Diagram.Util._updateBpmnChild(node, diagram);
            if (node.children) {
                children = diagram._getChildren(node.children);
                for (i = 0; i < children.length; i++) {
                    child = diagram.nameTable[children[i]];
                    ej.datavisualization.Diagram.DiagramContext.updateNodeStyle(child, diagram, node);
                }
            } else ej.datavisualization.Diagram.DiagramContext.updateNodeStyle(node, diagram);
        },

        updateBPMNNodeShape: function (node, diagram) {
            var child, children, i = 0;
            node = ej.datavisualization.Diagram.Util._updateBpmnChild(node, diagram);
            children = diagram._getChildren(node.children);
            if (children.length > 0 && diagram.nameTable[children[0]]) {
                for (i = 0; i < children.length; i++) {
                    child = diagram.nameTable[children[i]];
                    if (child)
                        ej.datavisualization.Diagram.DiagramContext.setNodeShape(child, diagram, node);
                }
            }
            else {
                var element = diagram._svg.getElementById(node.name);
                element.parentNode.removeChild(element);
                diagram.add(node);
            }
        }
    };
    //#endregion
})(jQuery, Syncfusion);