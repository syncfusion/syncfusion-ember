
(function ($, ej) {
    "use strict";

    //#region ZoomAndPan
    ej.datavisualization.Diagram.ZoomUtil = {
        zoomPan: function (diagram, currentZoom, deltaX, deltaY, focusPoint, isZoom) {
            if ((isZoom && ej.datavisualization.Diagram.Util.canZooming(diagram)) || (!isZoom && ej.datavisualization.Diagram.Util.canPanning(diagram))) {
                var viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(diagram, true);
                var oVal = {
                    zoom: diagram._getCurrentZoom(), horizontalOffset: diagram._hScrollOffset,
                    verticalOffset: diagram._vScrollOffset, viewPort: viewPort
                };
                var matrix = ej.Matrix.identity();
                ej.Matrix.scale(matrix, diagram._currZoom, diagram._currZoom);
                ej.Matrix.translate(matrix, -diagram._hScrollOffset, -diagram._vScrollOffset);
                var newScale = diagram._currZoom * currentZoom;
                if (newScale > diagram.model.scrollSettings.maxZoom) {
                    currentZoom = diagram.model.scrollSettings.maxZoom / diagram._currZoom;
                }
                else if (newScale < diagram.model.scrollSettings.minZoom) {
                    currentZoom = diagram.model.scrollSettings.minZoom / diagram._currZoom;
                }
                var dMatrix = ej.Matrix.identity();
                var pivot;
                if (focusPoint) {
                    pivot = ej.Matrix.transform(matrix, focusPoint);
                }
                else {
                    pivot = ej.datavisualization.Diagram.Point($(diagram.element).width() / 2, $(diagram.element).height() / 2);
                }
                ej.Matrix.scale(dMatrix, currentZoom, currentZoom, pivot.x, pivot.y);
                newScale = diagram._currZoom * currentZoom;
                ej.Matrix.translate(dMatrix, deltaX, deltaY);
                ej.Matrix.multiply(matrix, dMatrix);
                var point = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(0, 0));
                diagram._compareModelProperty("scrollSettings", true);
                this._applyTransform(diagram, newScale, point, isZoom, viewPort);
                var nVal = {
                    zoom: diagram._getCurrentZoom(), horizontalOffset: diagram._hScrollOffset,
                    verticalOffset: diagram._vScrollOffset, viewPort: viewPort
                };
                diagram._eventCause["scrollChange"] = ej.datavisualization.Diagram.ScrollChangeCause.Zoom;
                if (!isZoom) diagram._eventCause["scrollChange"] = ej.datavisualization.Diagram.ScrollChangeCause.Pan;
                diagram._raiseEvent("scrollChange", { newValues: nVal, oldValues: oVal });
            }
        },
        _applyTransform: function (diagram, currentZoom, point, isZoom, viewPort) {
            diagram._currZoom = currentZoom;
            var zoomX = point.x * -1;
            var zoomY = point.y * -1;
            var bounds = diagram._getDigramBounds();
            if (!isZoom) {
                if (diagram._scrollLimit() !== ej.datavisualization.Diagram.ScrollLimit.Infinity) {
                    if (diagram._scrollLimit() === ej.datavisualization.Diagram.ScrollLimit.Diagram) {
                        bounds.x -= diagram.model.scrollSettings.padding.left;
                        bounds.y -= diagram.model.scrollSettings.padding.top;
                        bounds.width += diagram.model.scrollSettings.padding.left + diagram.model.scrollSettings.padding.right;
                        bounds.height += diagram.model.scrollSettings.padding.top + diagram.model.scrollSettings.padding.bottom;
                        var isBoundsWidthHigh = bounds.width * diagram._currZoom > viewPort.width;
                        var isBoundsHeightHigh = bounds.height * diagram._currZoom > viewPort.height;
                        var diffX = (bounds.width + bounds.x) * diagram._currZoom - viewPort.width;
                        var diffY = (bounds.height + bounds.y) * diagram._currZoom - viewPort.height;
                        if ((!isBoundsWidthHigh && zoomX > diagram._hScrollOffset && zoomX > bounds.x * diagram._currZoom) || (isBoundsWidthHigh && zoomX < diagram._hScrollOffset && zoomX < bounds.x * diagram._currZoom))
                            zoomX = diagram._hScrollOffset;
                        else if ((!isBoundsWidthHigh && zoomX < diagram._hScrollOffset && zoomX < diffX) || (isBoundsWidthHigh && zoomX > diagram._hScrollOffset && zoomX > diffX))
                            zoomX = diagram._hScrollOffset;
                        if ((!isBoundsHeightHigh && zoomY > diagram._vScrollOffset && zoomY > bounds.y * diagram._currZoom) || (isBoundsHeightHigh && zoomY < diagram._vScrollOffset && zoomY < bounds.y * diagram._currZoom))
                            zoomY = diagram._vScrollOffset;
                        else if ((!isBoundsHeightHigh && zoomY < diagram._vScrollOffset && zoomY < diffY) || (isBoundsHeightHigh && zoomY > diagram._vScrollOffset && zoomY > diffY))
                            zoomY = diagram._vScrollOffset;
                    }
                    else {
                        if (zoomX < diagram._hScrollbar.model.minimum && !(diagram._hScrollbar.model.minimum == 0 && -diagram._hScrollOffset > point.x))
                            zoomX = diagram._hScrollOffset;
                        else if (zoomX > diagram._hScrollbar.model.maximum) {
                            zoomX = diagram._hScrollbar.model.maximum;
                        }
                        if (zoomY < diagram._vScrollbar.model.minimum && !(diagram._vScrollbar.model.minimum == 0 && -diagram._vScrollOffset > point.y))
                            zoomY = diagram._vScrollOffset;
                        else if (zoomY > diagram._vScrollbar.model.maximum) {
                            zoomY = diagram._vScrollbar.model.maximum;
                        }
                    }
                }
            }
            diagram._updateScrollOffset(zoomX, zoomY, true, isZoom);
        }
    };
    //#endregion 

    //#region PageSettings
    ej.datavisualization.Diagram.PageUtil = {
        _createPageBreaks: function (diagram) {
            this._removePageBreaks(diagram);
            var attr = { id: diagram._canvas.id + "pagebreaks", "pointer-events": "none" };
            var g = ej.datavisualization.Diagram.SvgContext._initializePageBreaks(diagram._svg, attr, diagram._pageBackgroundLayer);
            this._updatePageBreaks(g, diagram);
        },
        _removePageBreaks: function (diagram) {
            var g = diagram._svg.getElementById(diagram._canvas.id + "pagebreaks");
            if (g) { ej.datavisualization.Diagram.SvgContext._removePageBreaks(diagram._svg, g, diagram._pageBackgroundLayer); }
        },
        _updatePageBreaks: function (g, diagram) {
            var bounds = diagram._getDigramBounds();
            var pageSettings = diagram.model.pageSettings;
            var left = bounds.x;
            var right = bounds.width + bounds.x;
            var top = bounds.y;
            var bottom = bounds.height + bounds.y;
            var zoom = diagram._currZoom;
            var pHeight = diagram._pageHeight();
            var pWidth = diagram._pageWidth();
            var pMargin = diagram._pageMargin();
            var columncount = parseInt(Math.ceil((right - left) / pWidth));
            var rowcount = parseInt(Math.ceil((bottom - top) / pHeight));
            left = -diagram._canvas.clientLeft + (pMargin + left) * zoom;
            top = -diagram._canvas.clientTop + (pMargin + top) * zoom;
            var width = (pWidth * columncount - pMargin * 2) * zoom;
            var height = (pHeight * rowcount - pMargin * 2) * zoom;
            ej.datavisualization.Diagram.SvgContext._renderVPageBreakLine(ej.datavisualization.Diagram.Point(left, top), ej.datavisualization.Diagram.Point(left + width, top), diagram._svg, g);
            ej.datavisualization.Diagram.SvgContext._renderHPageBreakLine(ej.datavisualization.Diagram.Point(left, top), ej.datavisualization.Diagram.Point(left, top + height), diagram._svg, g);
            for (var column = 1; column < columncount; column++) {
                ej.datavisualization.Diagram.SvgContext._renderVPageBreakLine(ej.datavisualization.Diagram.Point(left + (pWidth * column - pMargin) * zoom, top),
                    ej.datavisualization.Diagram.Point(left + (pWidth * column - pMargin) * zoom, top + height), diagram._svg, g);
            }
            for (var row = 1; row < rowcount; row++) {
                ej.datavisualization.Diagram.SvgContext._renderHPageBreakLine(ej.datavisualization.Diagram.Point(left, top + (pHeight * row - pMargin) * zoom),
                    ej.datavisualization.Diagram.Point(left + width, top + (pHeight * row - pMargin) * zoom), diagram._svg, g);
            }
            ej.datavisualization.Diagram.SvgContext._renderVPageBreakLine(ej.datavisualization.Diagram.Point(left + width, top), ej.datavisualization.Diagram.Point(left + width, top + height), diagram._svg, g);
            ej.datavisualization.Diagram.SvgContext._renderHPageBreakLine(ej.datavisualization.Diagram.Point(left, top + height), ej.datavisualization.Diagram.Point(left + width, top + height), diagram._svg, g);
        },
        _updatePageSize: function (diagram, updatePage) {
            var swap = false;
            var pageOrientation = typeof diagram.model.pageSettings.pageOrientation === "string" ? diagram.model.pageSettings.pageOrientation : diagram._pageOrientation();
            var pageWidth = typeof diagram.model.pageSettings.pageWidth === "string" ? diagram.model.pageSettings.pageWidth : diagram._pageWidth();
            var pageHeight = typeof diagram.model.pageSettings.pageHeight === "string" ? diagram.model.pageSettings.pageHeight : diagram._pageHeight();
            if (pageOrientation == ej.datavisualization.Diagram.PageOrientations.Landscape) {
                if (pageHeight > pageWidth) {
                    swap = true;
                }
            }
            else {
                if (pageWidth > pageHeight) {
                    swap = true;
                }
            }
            if (swap) {
                var temp = pageWidth;
                diagram._pageWidth(pageHeight);
                diagram._pageHeight(temp);
            }
            var bounds = diagram._getDigramBounds();
            var zoom = diagram._currZoom;
            var left = bounds.x * zoom;
            var top = bounds.y * zoom;
            var width = bounds.width * zoom;
            var height = bounds.height * zoom;
            var pageSettings = diagram.model.pageSettings;
            if (diagram._pageBackgroundLayer && diagram._pageBackgroundLayer.firstChild) {
                ej.datavisualization.Diagram.SvgContext._updatePageBakground(ej.datavisualization.Diagram.Point(left, top), ej.datavisualization.Diagram.Point(width, height), diagram._svg, diagram._pageBackgroundLayer, diagram._pageBorderColor(), diagram._pageBackgroundColor(), diagram._pageBorderWidth());
            }
            else {
                ej.datavisualization.Diagram.SvgContext._renderPageSettingsRect(ej.datavisualization.Diagram.Point(left, top), ej.datavisualization.Diagram.Point(width, height), diagram._svg, diagram._pageBackgroundLayer, diagram._pageBorderColor(), diagram._pageBackgroundColor(), diagram._pageBorderWidth());
            }
            if (diagram.model.backgroundImage && diagram.model.backgroundImage.source)
                ej.datavisualization.Diagram.SvgContext._updateBackground(diagram._hScrollOffset, diagram._vScrollOffset, diagram._currZoom, diagram);
            diagram._svg.document.style.left = 0;
            diagram._svg.document.style.top = 0;
            var check = false;
            if (!pageWidth) {
                if (!pageHeight) {
                    check = true;
                }
            }
            if (pageSettings.pageWidth && pageHeight) {
                if (diagram._showPageBreak()) {
                    this._createPageBreaks(diagram);
                }
                else {
                    this._removePageBreaks(diagram);
                }
            }
            if (!updatePage)
                ej.datavisualization.Diagram.ScrollUtil._setScrollContentSize(diagram);
        }
    };
    //#endregion

    //#region Scroller
    ej.datavisualization.Diagram.ScrollUtil = {
        _transform: function (diagram, hOffset, vOffset, canScale) {
            ej.datavisualization.Diagram.SvgContext.transformView(diagram, -hOffset, -vOffset);
            if (canScale) {
                ej.datavisualization.Diagram.SvgContext.scaleContent(diagram, diagram._currZoom);
            }
            this._updateRuler(diagram, hOffset, vOffset);
            ej.datavisualization.Diagram.PageUtil._updatePageSize(diagram);
            // ej.datavisualization.Diagram.SvgContext._updateBackground(hOffset, vOffset, diagram._currZoom, diagram);
            ej.datavisualization.Diagram.SvgContext._updateGrid(hOffset, vOffset, diagram._currZoom, diagram);
        },
        _updateRuler: function (diagram, hOffset, vOffset) {
            if (diagram && diagram.model.rulerSettings.showRulers) {
                var rulerSize = this._getRulerSize(diagram);
                var rulerGeometry = ej.datavisualization.Diagram.ScrollUtil._getRulerGeometry(diagram, true);

                if (hOffset != undefined && diagram._hRuler) {
                    ej.datavisualization.Diagram.SvgContext._updateRulerSpace(diagram, rulerGeometry, true);
                    $("#" + diagram._hRuler[0].id).ejRuler({ offset: hOffset, scale: diagram._currZoom, length: rulerGeometry.width + 100 });
                    diagram._hRuler[0].style.marginLeft = (rulerSize.left - diagram._hRulerInstance._hRulerDiff) + "px";
                }
                if (vOffset != undefined && diagram._vRuler) {
                    ej.datavisualization.Diagram.SvgContext._updateRulerSpace(diagram, rulerGeometry, false);
                    $("#" + diagram._vRuler[0].id).ejRuler({ offset: vOffset, scale: diagram._currZoom, length: rulerGeometry.height + 100 });
                    diagram._vRuler[0].style.marginTop = (-diagram._vRulerInstance._vRulerDiff) + "px";
                }


            }
        },
        _viewPort: function (diagram, update) {
            if (diagram._viewPort && !update) return diagram._viewPort;
            var element = diagram.element[0];
            var bRect = diagram.element[0].getBoundingClientRect();
            var eWidth = bRect.width;
            //var vScrollHeight = diagram._vScrollbar && diagram._vScrollbar.model.height ? diagram._vScrollbar.model.height : null;
            //var eHeight = vScrollHeight ? (bRect.height === vScrollHeight) ? vScrollHeight + 18 : bRect.height : bRect.height;
            var eHeight = bRect.height;
            var screenX = (window.screenX < 0) ? window.screenX * -1 : window.screenX;
            if (eWidth === 0) {
                eWidth = Math.floor(((window.innerWidth - screenX) - Math.floor(bRect.left)));
            }
            var screenY = (window.screenY < 0) ? window.screenY * -1 : window.screenY;
            if (eHeight === 0) {
                eHeight = Math.floor(((window.innerHeight - screenY) - Math.floor(bRect.window)));
            }
            var rulerSize = this._getRulerSize(diagram);
            return ej.datavisualization.Diagram.Size(eWidth - rulerSize.left, eHeight - rulerSize.top);
        },
        _getRulerSize: function (diagram) {
            var left = 0, top = 0;
            if (diagram.model.rulerSettings.showRulers) {
                if (diagram.model.rulerSettings.horizontalRuler.thickness)
                    top = diagram.model.rulerSettings.horizontalRuler.thickness
                if (diagram.model.rulerSettings.verticalRuler.thickness)
                    left = diagram.model.rulerSettings.verticalRuler.thickness
            }
            return { left: left, top: top };
        },
        _getRulerGeometry: function (diagram) {
            var rulerSize = this._getRulerSize(diagram);
            var height = diagram._viewPort.height;
            var width = diagram._viewPort.width;
            if (width < (diagram._canvas.clientWidth - rulerSize.left))
                width = diagram._canvas.clientWidth - rulerSize.left;
            if (height < (diagram._canvas.clientHeight - rulerSize.top))
                height = diagram._canvas.clientHeight - rulerSize.top;
            if (diagram.model.rulerSettings.horizontalRuler.length)
                width = diagram.model.rulerSettings.horizontalRuler.length;
            if (diagram.model.rulerSettings.verticalRuler.length)
                height = diagram.model.rulerSettings.verticalRuler.length;
            return { width: width, height: height }
        },
        _union: function (rect, rect1) {
            if (rect.width <= 0) {
                rect = rect1;
                return rect;
            }
            if (rect.width > 0) {
                var num = Math.min(rect.x, rect1.x);
                var num2 = Math.min(rect.y, rect1.y);
                if (rect1.width === Infinity || rect.width === Infinity) {
                    rect.width = Infinity;
                }
                else {
                    var num3 = Math.max(rect.x + rect.width, rect1.x + rect1.width);
                    rect.width = Math.max(num3 - num, 0);
                }
                if (rect1.height === Infinity || rect.height === Infinity) {
                    rect.height = Infinity;
                }
                else {
                    var num4 = Math.max(rect.y + rect.height, rect1.y + rect1.height);
                    rect.height = Math.max(num4 - num2, 0);
                }
                rect.x = num;
                rect.y = num2;
                return rect;
            }
        },

        _setScrollContentSize: function (diagram) {
            var scale = diagram._currZoom;
            var viewPort = this._viewPort(diagram);
            viewPort = ej.datavisualization.Diagram.Rectangle(diagram._hScrollOffset, diagram._vScrollOffset, viewPort.width, viewPort.height);
            var scrollPadding = diagram.model.scrollSettings.padding;
            var left = diagram._spatialSearch.pageLeft;
            var right = diagram._spatialSearch.pageRight;
            var top = diagram._spatialSearch.pageTop;
            var bottom = diagram._spatialSearch.pageBottom;
            var left1 = left;
            var top1 = top;
            if (left > right) {
                left = right = 0;
            }
            if (top > bottom) {
                top = bottom = 0;
            }

            if (diagram.model.pageSettings) {
                var pageWidth = Number(diagram._pageWidth());
                var pageHeight = Number(diagram._pageHeight());

                if (pageWidth > 0 && pageHeight > 0) {
                    if (diagram._multiplePage()) {
                        left = Math.floor(left / pageWidth) * pageWidth;
                        top = Math.floor(top / pageHeight) * pageHeight;
                        right = Math.ceil(right / pageWidth) * pageWidth;
                        bottom = Math.ceil(bottom / pageHeight) * pageHeight;
                    }
                    else {
                        left = 0;
                        top = 0;
                        right = pageWidth;
                        bottom = pageHeight;
                    }
                    left -= scrollPadding.left;
                    right += scrollPadding.right;
                    top -= scrollPadding.top;
                    bottom += scrollPadding.bottom;
                    left1 = left;
                    top1 = top;
                }
                else {
                    left = left < 0 ? left : 0;
                    top = top < 0 ? top : 0;
                    if ((diagram._spatialSearch.pageLeft - left) < scrollPadding.left)
                        left += diagram._spatialSearch.pageLeft - left - scrollPadding.left;

                    if ((diagram._spatialSearch.pageTop - top) < scrollPadding.top)
                        top += diagram._spatialSearch.pageTop - top - scrollPadding.top;

                    if (diagram._spatialSearch.pageRight + scrollPadding.right > viewPort.width && diagram._spatialSearch.pageRight < viewPort.width)
                        right += scrollPadding.right + diagram._spatialSearch.pageRight - viewPort.width;

                    else if (diagram._spatialSearch.pageRight > viewPort.width)
                        right += scrollPadding.right;

                    if (diagram._spatialSearch.pageBottom + scrollPadding.bottom > viewPort.height && diagram._spatialSearch.pageBottom < viewPort.height)
                        bottom += scrollPadding.bottom + diagram._spatialSearch.pageBottom - viewPort.height;

                    else if (diagram._spatialSearch.pageBottom > viewPort.height)
                        bottom += scrollPadding.bottom;

                    left1 -= scrollPadding.left;
                    top1 -= scrollPadding.top;
                }
            }
            left = left * scale;
            top = top * scale;
            right = right * scale;
            bottom = bottom * scale;

            var diagramArea = ej.datavisualization.Diagram.Rectangle(0, 0, 0, 0);
            diagramArea = this._union(diagramArea, ej.datavisualization.Diagram.Rectangle(0, 0, viewPort.width, viewPort.height));
            diagramArea = this._union(diagramArea, ej.datavisualization.Diagram.Geometry.rect([{ x: left, y: top }, { x: right, y: bottom }]));
            diagramArea.width -= (viewPort.width - 18);
            diagramArea.height -= (viewPort.height - 18);

            if (diagramArea.x > diagram._hScrollOffset) {
                var diff = diagramArea.x - diagram._hScrollOffset;
                diagramArea.x -= diff;
                diagramArea.width += diff;
            }
            if (diagram._hScrollOffset > diagramArea.x + diagramArea.width) {
                diagramArea.width = diagram._hScrollOffset - diagramArea.x;
            }

            var minimumX = diagramArea.x;
            var maximumX = Math.max(0, diagramArea.x + diagramArea.width);

            if (diagramArea.y > diagram._vScrollOffset) {
                var diff = diagramArea.y - diagram._vScrollOffset;
                diagramArea.y -= diff;
                diagramArea.height += diff;
            }
            if (diagram._vScrollOffset > diagramArea.y + diagramArea.height) {
                diagramArea.height = diagram._vScrollOffset - diagramArea.y;
            }
            var minimumY = diagramArea.y;
            var maximumY = Math.max(0, diagramArea.y + diagramArea.height);

            diagramArea.width = viewPort.width;
            diagramArea.height = viewPort.height;

            if (diagram._scrollLimit() === ej.datavisualization.Diagram.ScrollLimit.Limited) {
                var scrollableArea = diagram.model.pageSettings.scrollableArea;
                minimumX = scrollableArea.x * scale;
                minimumY = scrollableArea.y * scale;
                maximumX = (scrollableArea.x + scrollableArea.width) * scale - viewPort.width;
                maximumY = (scrollableArea.y + scrollableArea.height) * scale - viewPort.height;
                bottom = (scrollableArea.y + scrollableArea.height) * scale;
                right = (scrollableArea.x + scrollableArea.width) * scale;
                top = scrollableArea.y * scale;
                left = scrollableArea.x * scale;
            }

            var executeHorizontal = true, executeVertical = true;
            if (left >= diagram._hScrollOffset && right <= viewPort.width + diagram._hScrollOffset) {
                executeHorizontal = false;
                diagram._hScrollbar._remove();
                diagram._hScrollbar.model.width = 0;
                if (diagram._scrollLimit() === ej.datavisualization.Diagram.ScrollLimit.Limited) diagram._hScrollbar.model.minimum = Math.min(0, minimumX);
                else diagram._hScrollbar.model.minimum = 0;
                diagram._hScrollbar.model.maximum = 0;
            }  
            if (top >= diagram._vScrollOffset && bottom <= viewPort.height + diagram._vScrollOffset) {
                executeVertical = false;
                diagram._vScrollbar._remove();
                diagram._vScrollbar.model.height = 0;
                if (diagram._scrollLimit() === ej.datavisualization.Diagram.ScrollLimit.Limited) diagram._vScrollbar.model.minimum = Math.min(0, minimumY);
                else diagram._vScrollbar.model.minimum = 0;
                diagram._vScrollbar.model.maximum = 0;
            }  

            if (executeHorizontal) {
                var viewPortWidth = executeVertical ? viewPort.width - 18 : viewPort.width;
                maximumX = !executeVertical ? maximumX - 18 : maximumX;
                if (!diagram._preventScrollerUpdate) {
                    $("#" + diagram._canvas.id + "_hScrollbar").ejScrollBar({ width: viewPortWidth, viewportSize: viewPortWidth, maximum: maximumX, minimum: minimumX });
                    $("#" + diagram._canvas.id + "_hScrollbar").ejScrollBar("scroll", diagram._hScrollOffset);
                }
                else {
                    diagram._hScrollbar.model.minimum = minimumX;
                    diagram._hScrollbar.model.maximum = maximumX;
                }
                var hScroll = document.getElementById(diagram._canvas.id + "_hScrollbar");
                hScroll.style.marginTop = viewPort.height - 18 + "px";
                if (Math.round(left1 * scale) >= Math.round(diagram._hScrollOffset) && Math.round(right) <= Math.round(viewPort.width + diagram._hScrollOffset))
                    hScroll.style.visibility = "hidden";
                else {
                    hScroll.style.visibility = "visible";
                    if (diagramArea.height >= 18)
                        diagramArea.height -= 18;
                }
            }

            if (executeVertical) {
                var viewPortHeight = executeHorizontal ? viewPort.height - 18 : viewPort.height;
                maximumY = !executeHorizontal ? maximumY - 18 : maximumY;
                if (!diagram._preventScrollerUpdate) {
                    $("#" + diagram._canvas.id + "_vScrollbar").ejScrollBar({ height: viewPortHeight, viewportSize: viewPortHeight, maximum: maximumY, minimum: minimumY });
                    $("#" + diagram._canvas.id + "_vScrollbar").ejScrollBar("scroll", diagram._vScrollOffset);
                }
                else {
                    diagram._vScrollbar.model.minimum = minimumY;
                    diagram._vScrollbar.model.maximum = maximumY;
                }
                var vScroll = document.getElementById(diagram._canvas.id + "_vScrollbar");
                if (Math.round(top1 * scale) >= Math.round(diagram._vScrollOffset) && Math.round(bottom) <= Math.round(viewPort.height + diagram._vScrollOffset)) {
                    vScroll.style.visibility = "hidden";
                }
                else {
                    vScroll.style.visibility = "visible";
                    if (diagramArea.width >= 18)
                        diagramArea.width -= 18;
                }
            }
            if (diagram._isMobile) diagram._disableScrollbar();
            ej.datavisualization.Diagram.SvgContext.setSize(diagram, diagramArea.width, diagramArea.height);
        },

        _setMinMaxValues: function (diagram, minX, minY, maxX, maxY, viewPort, scale) {
            var scrollableArea = diagram.model.pageSettings.scrollableArea;
            minX = Math.max(minX, scrollableArea.x * scale);
            minY = Math.max(minY, scrollableArea.y * scale);
            maxX = Math.min((scrollableArea.x + scrollableArea.width) * scale - viewPort.width, maxX);
            maxY = Math.min((scrollableArea.y + scrollableArea.height) * scale - viewPort.height, maxY);
            maxX = maxX > 0 ? maxX : 0;
            maxY = maxY > 0 ? maxY : 0;
            return { minX: minX, minY: minY, maxX: maxX, maxY: maxY };
        },

        _initScrollbar: function (diagram) {
            var canvas = diagram._canvas;
            var hScrollbar = document.getElementById(canvas.id + "_hScrollbar");
            var vScrollbar = document.getElementById(canvas.id + "_vScrollbar");
            var viewPort = this._viewPort(diagram);
            $(hScrollbar).ejScrollBar({
                orientation: ej.ScrollBar.Orientation.Horizontal,
                width: viewPort.width - 18,
                viewportSize: viewPort.width - 18,
                scroll: function (e) {
                    if (e.source != null) {
                        if (e.source == "thumb" || e.source == "button" || e.source == "key") {
                            if (e.scrollData != null) {
                                var oVal = {
                                    zoom: diagram._getCurrentZoom(), horizontalOffset: diagram._hScrollOffset,
                                    verticalOffset: diagram._vScrollOffset, viewPort: diagram._viewPort
                                };
                                diagram._updateScrollOffset(e.scrollLeft, diagram._vScrollOffset);
                                var nVal = {
                                    zoom: diagram._getCurrentZoom(), horizontalOffset: diagram._hScrollOffset,
                                    verticalOffset: diagram._vScrollOffset, viewPort: diagram._viewPort
                                };
                                diagram._compareModelProperty("scrollSettings", true);
                                diagram._eventCause["scrollChange"] = ej.datavisualization.Diagram.ScrollChangeCause.Pan;
                                diagram._raiseEvent("scrollChange", { newValues: nVal, oldValues: oVal });
                            }
                        }
                    }
                }
            });
            diagram._hScrollbar = $(hScrollbar).ejScrollBar("instance");

            $(vScrollbar).ejScrollBar({
                orientation: ej.ScrollBar.Orientation.Vertical,
                height: viewPort.height - 18,
                viewportSize: viewPort.height - 18,
                scroll: function (e) {
                    if (e.source != null) {
                        if (e.source == "thumb" || e.source == "button" || e.source == "key") {
                            if (e.scrollData != null) {
                                var oVal = {
                                    zoom: diagram._getCurrentZoom(), horizontalOffset: diagram._hScrollOffset,
                                    verticalOffset: diagram._vScrollOffset, viewPort: diagram._viewPort
                                };
                                diagram._updateScrollOffset(diagram._hScrollOffset, e.scrollTop);
                                var nVal = {
                                    zoom: diagram._getCurrentZoom(), horizontalOffset: diagram._hScrollOffset,
                                    verticalOffset: diagram._vScrollOffset, viewPort: diagram._viewPort
                                };
                                diagram._compareModelProperty("scrollSettings", true);
                                diagram._eventCause["scrollChange"] = ej.datavisualization.Diagram.ScrollChangeCause.Pan;
                                diagram._raiseEvent("scrollChange", { newValues: nVal, oldValues: oVal });
                            }
                        }
                    }
                }
            });
            diagram._vScrollbar = $(vScrollbar).ejScrollBar("instance");

        },
    };
    //#endregion

    //#region Snapping
    ej.datavisualization.Diagram.SnapUtil = {
        _canConsider: function (nameTable, selectedObject, target) {
            var consider = false;
            if (selectedObject != target) {
                if (selectedObject._type == "group" || selectedObject._type == "pseudoGroup") {
                    consider = (target.isSwimlane && !selectedObject.isSwimlane) ? false : !this._contains(nameTable, selectedObject, target);
                }
                else if ((target._type == "group" && target.type != "bpmn") || target.type == "pseudoGroup")
                    consider = (target.isSwimlane && !selectedObject.isSwimlane) ? false : !this._contains(nameTable, target, selectedObject);
                else if (!selectedObject.segments) {
                    consider = !(selectedObject == target);
                }
            }
            return consider;
        },
        _contains: function (nameTable, group, target) {
            var name = target.name;
            var node = null;
            if (group.children.indexOf(name) >= 0) {
                node = nameTable[name];
                if (node == target)
                    return true;
            }
            else if (group.children.indexOf(target) >= 0) {
                return true;
            }
            if (group._type == "group" || group._type == "pseudoGroup") {
                var contains = false;
                for (var i = 0; i < group.children.length; i++) {
                    if (this.diagram) {
                        var child = typeof group.children[i] == "string" ? nameTable[group.children[i]] : nameTable[group.children[i].name];
                        if (child) {
                            if (typeof child == "string") child = nameTable[child];
                            if (child._type == "group")
                                contains = this._contains(nameTable, child, target);
                            if (contains) return contains;
                        }
                    }
                }
                return contains;
            }
            //return this._contains(nameTable, node, child);
            return false;
        },
        _getSnapIntervals:function(diagram, isVertical){
            var snapInterval = [];
            if (diagram.model.rulerSettings.showRulers) {
                var ruler = isVertical ? diagram.model.rulerSettings.horizontalRuler : diagram.model.rulerSettings.verticalRuler;
                var interval = (ruler.segmentWidth / ruler.interval);
                snapInterval.push(Math.round(interval * 100) / 100);
            }
            else
            {
                var snapSettings = diagram.model.snapSettings;
                if (isVertical)
                    snapInterval = snapSettings.verticalGridLines.snapInterval;
                else
                    snapInterval = snapSettings.horizontalGridLines.snapInterval;
            }
            return snapInterval;
        },
        _round: function (value, snapintervals, scale) {
            if (scale > 1) scale = Math.pow(2, Math.floor(Math.log(scale) / Math.log(2)));
            else scale = Math.pow(2, Math.ceil(Math.log(scale) / Math.log(2)));
            var cutoff = 0, i;
            for (i = 0; i < snapintervals.length; i++) {
                cutoff += snapintervals[i];
            }
            cutoff /= scale;
            var quotient = Math.floor(Math.abs(value) / cutoff);
            var bal = value % cutoff;
            var prev = quotient * cutoff;
            if (prev != value) {
                if (value >= 0) {
                    for (i = 0; i < snapintervals.length ; i++) {
                        if (bal <= snapintervals[i] / scale) {
                            return prev + (bal < (snapintervals[i] / (2 * scale)) ? 0 : snapintervals[i] / scale);
                        }
                        else {
                            prev += snapintervals[i] / scale;
                            bal -= snapintervals[i] / scale;
                        }
                    }
                }
                else {
                    prev = prev * -1;
                    for (i = snapintervals.length - 1; i >= 0; i--) {
                        if (Math.abs(bal) <= snapintervals[i] / scale) {
                            return prev - (Math.abs(bal) < (snapintervals[i] / (2 * scale)) ? 0 : snapintervals[i] / scale);
                        }
                        else {
                            prev -= snapintervals[i] / scale;
                            bal += snapintervals[i] / scale;
                        }
                    }
                }
            }
            return value;
        },
        _findNodes: function (spatialSearch, node, child, viewPort, nodesInView) {
            var nodes = [], quad, nd, bounds;
            var quads;
            quads = ej.datavisualization.Diagram.SpatialUtil.findQuads(spatialSearch, nodesInView ? viewPort : child);
            for (var i = 0; i < quads.length; i++) {
                quad = quads[i];
                if (quad.objects.length > 0) {
                    for (var j = 0; j < quad.objects.length; j++) {
                        nd = quad.objects[j];
                        if (!nd.segments && nd.visible) {
                            bounds = ej.datavisualization.Diagram.Util.bounds(nd);
                            if (nodes.indexOf(nd) == -1 && ej.datavisualization.Diagram.Geometry.intersectsRect(child, bounds))
                                nodes.push(nd);
                            if (nodesInView && nodesInView.indexOf(nd) && ej.datavisualization.Diagram.Geometry.intersectsRect(viewPort, bounds)) {
                                nodesInView.push(nd);
                            }
                        }
                    }
                }
            }
            return nodes;
        },
        _snapAngle: function (diagram, angle) {
            var snapAngle = diagram._snapAngle();
            var width = angle % snapAngle;
            if (width >= (snapAngle / 2)) {
                return angle + snapAngle - width;
            }
            else {
                return angle - width;
            }
        },
        _snapPoint: function (diagram, selectedObject, towardsLeft, towardsTop, del, endPoint, startPoint) {
            var snapSettings = diagram.model.snapSettings;
            var zoomFactor = diagram._currZoom;
            var offset = ej.datavisualization.Diagram.Point();
            var bounds = ej.datavisualization.Diagram.Util.bounds(selectedObject);
            var horizontallysnapped = { snapped: false, offset: 0 };
            var verticallysnapped = { snapped: false, offset: 0 };
            this.diagram = diagram;
            if (diagram._enableSnapToObject())
                this._snapObject(diagram, selectedObject, horizontallysnapped,
                    verticallysnapped, del, startPoint == endPoint);
            //original position
            var left = bounds.x + del.x;
            var top = bounds.y + del.y;
            var right = bounds.x + bounds.width + del.x;
            var bottom = bounds.y + bounds.height + del.y;
            //snapped positions
            var roundedRight = this._round(right, this._getSnapIntervals(diagram,true), zoomFactor);
            var roundedLeft = this._round(left, this._getSnapIntervals(diagram, true), zoomFactor);
            var roundedTop = this._round(top, this._getSnapIntervals(diagram, false), zoomFactor);
            var roundedBottom = this._round(bottom, this._getSnapIntervals(diagram, false), zoomFactor);
            //currentposition
            var currentright = bounds.x + bounds.width;
            var currentbottom = bounds.y + bounds.height;
            if (!horizontallysnapped.snapped) {
                if (diagram._snapConstraints() & ej.datavisualization.Diagram.SnapConstraints.SnapToVerticalLines) {
                    if (Math.abs(del.x) >= 1) {
                        if (towardsLeft) {
                            if (Math.abs(roundedRight - currentright) > Math.abs(roundedLeft - bounds.x)) {
                                offset.x += roundedLeft - bounds.x;
                            } else
                                offset.x += roundedRight - currentright;
                        } else {
                            if (Math.abs(roundedRight - currentright) < Math.abs(roundedLeft - bounds.x)) {
                                offset.x += roundedRight - currentright;
                            } else
                                offset.x += roundedLeft - bounds.x;
                        }
                    }
                } else {
                    offset.x = endPoint.x - startPoint.x;
                }
            } else {
                if (diagram._enableSnapToObject())
                    offset.x = horizontallysnapped.offset;
                else
                    offset.x = endPoint.x - startPoint.x;
            }
            if (!verticallysnapped.snapped) {
                if (diagram._snapConstraints() & ej.datavisualization.Diagram.SnapConstraints.SnapToHorizontalLines) {
                    if (Math.abs(del.y) >= 1) {
                        if (towardsTop) {
                            if (Math.abs(roundedBottom - currentbottom) > Math.abs(roundedTop - bounds.y)) {
                                offset.y += roundedTop - bounds.y;
                            }
                            else
                                offset.y += roundedBottom - currentbottom;
                        }
                        else {
                            if (Math.abs(roundedBottom - currentbottom) < Math.abs(roundedTop - bounds.y)) {
                                offset.y += roundedBottom - currentbottom;
                            }
                            else
                                offset.y += roundedTop - bounds.y;
                        }
                    }
                }
                else
                    offset.y = endPoint.y - startPoint.y;
            }
            else
                offset.y = verticallysnapped.offset;

            return offset;
        },
        _snapObject: function (diagram, selectedObject, hSnap, vSnap, del, ended) {
            var lengthX = null, lengthY = null;
            var hTarget, vTarget;
            var objectsAtLeft = [], objectsAtRight = [], objectsAtTop = [], objectsAtBottom = [];
            var bounds = ej.datavisualization.Diagram.Util.bounds(selectedObject);
            var scale = diagram._currZoom;
            var hoffset = diagram._hScrollOffset;
            var voffset = diagram._vScrollOffset;
            var snapObjDistance = diagram._snapObjectDistance();
            var viewPort = diagram._viewPort;
            var hIntersectRect = ej.datavisualization.Diagram.Rectangle(hoffset / scale, (bounds.y - snapObjDistance - 5), viewPort.width / scale,
                (bounds.height + 2 * snapObjDistance + 10));
            var vIntersectRect = ej.datavisualization.Diagram.Rectangle((bounds.x - snapObjDistance - 5), voffset / scale,
                (bounds.width + 2 * snapObjDistance + 10), viewPort.height / scale);
            viewPort = ej.datavisualization.Diagram.Rectangle(hoffset / scale, voffset / scale, viewPort.width / scale,
                viewPort.height / scale);
            var nodes = this._findNodes(diagram._spatialSearch, selectedObject, vIntersectRect, viewPort);
            var i, target, targetBounds;
            var nameTable = diagram.nameTable;
            for (i = 0; i < nodes.length; i++) {
                target = nodes[i];
                if (ej.datavisualization.Diagram.Util._canBeTarget(diagram, target)) {
                    if (!target.segments && this._canConsider(nameTable, selectedObject, target)) {
                        targetBounds = ej.datavisualization.Diagram.Util.bounds(target);
                        if (targetBounds.y + targetBounds.height < bounds.y + del.y) {
                            objectsAtTop.push({ object: target, distance: Math.abs(bounds.y + del.y - targetBounds.y - targetBounds.height) });
                        }
                        else if (targetBounds.y > bounds.y + del.y + bounds.height) {
                            objectsAtBottom.push({ object: target, distance: Math.abs(bounds.y + del.y + bounds.height - targetBounds.y) });
                        }
                        if (lengthX == null || lengthX > Math.abs(targetBounds.y - bounds.y - del.y)) {
                            if (Math.abs(targetBounds.x + targetBounds.width / 2 - (bounds.x + bounds.width / 2 + del.x)) <= snapObjDistance) {
                                hTarget = this._createSnapObject(targetBounds, bounds, "centerX");
                                lengthX = Math.abs(targetBounds.y - bounds.y);
                            } else if (Math.abs(targetBounds.x - (bounds.x + del.x)) <= snapObjDistance) {
                                hTarget = this._createSnapObject(targetBounds, bounds, "left");
                                lengthX = Math.abs(targetBounds.y - bounds.y);
                            } else if (Math.abs(targetBounds.x + targetBounds.width - (bounds.x + bounds.width + del.x)) <= snapObjDistance) {
                                hTarget = this._createSnapObject(targetBounds, bounds, "right");
                                lengthX = Math.abs(targetBounds.y - bounds.y);
                            } else if (Math.abs(targetBounds.x + targetBounds.width - (bounds.x + del.x)) <= snapObjDistance) {
                                hTarget = this._createSnapObject(targetBounds, bounds, "leftRight");
                                lengthX = Math.abs(targetBounds.y - bounds.y);
                            } else if (Math.abs(targetBounds.x - (bounds.x + bounds.width + del.x)) <= snapObjDistance) {
                                hTarget = this._createSnapObject(targetBounds, bounds, "rightLeft");
                                lengthX = Math.abs(targetBounds.y - bounds.y);
                            }
                        }
                    }
                }
            }
            nodes = this._findNodes(diagram._spatialSearch, selectedObject, hIntersectRect, viewPort);
            for (i = 0; i < nodes.length; i++) {
                target = nodes[i];
                if (ej.datavisualization.Diagram.Util._canBeTarget(diagram, target)) {
                    if (!target.segments && this._canConsider(nameTable, selectedObject, target)) {
                        targetBounds = ej.datavisualization.Diagram.Util.bounds(target);
                        if (targetBounds.x + targetBounds.width < bounds.x + del.x) {
                            objectsAtLeft[objectsAtLeft.length] = { object: target, distance: Math.abs((bounds.x + del.x) - targetBounds.x - targetBounds.width) };
                        }
                        if (targetBounds.x > bounds.x + del.x + bounds.width) {
                            objectsAtRight[objectsAtRight.length] = { object: target, distance: Math.abs(bounds.x + del.x + bounds.width - targetBounds.x) };
                        }
                        if (lengthY == null || lengthY > Math.abs(targetBounds.x - bounds.x - del.x)) {
                            if (Math.abs(targetBounds.y + targetBounds.height / 2 - (bounds.y + bounds.height / 2 + del.y)) <= snapObjDistance) {
                                vTarget = this._createSnapObject(targetBounds, bounds, "centerY");
                                lengthY = Math.abs(targetBounds.x - bounds.x);
                            } else if (Math.abs(targetBounds.y - bounds.y - del.y) <= snapObjDistance) {
                                vTarget = this._createSnapObject(targetBounds, bounds, "top");
                                lengthY = Math.abs(targetBounds.x - bounds.x);
                            } else if (Math.abs(targetBounds.y + targetBounds.height - (bounds.y + bounds.height + del.y)) <= snapObjDistance) {
                                vTarget = this._createSnapObject(targetBounds, bounds, "bottom");
                                lengthY = Math.abs(targetBounds.x - bounds.x);
                            } else if (Math.abs(targetBounds.y + targetBounds.height - bounds.y - del.y) <= snapObjDistance) {
                                vTarget = this._createSnapObject(targetBounds, bounds, "topBottom");
                                lengthY = Math.abs(targetBounds.x - bounds.x);
                            } else if (Math.abs(targetBounds.y - (bounds.y + bounds.height + del.y)) <= snapObjDistance) {
                                vTarget = this._createSnapObject(targetBounds, bounds, "bottomTop");
                                lengthY = Math.abs(targetBounds.x - bounds.x);
                            }
                        }
                    }
                }
            }
            var g = this._createGuidelines(diagram, hTarget, vTarget, hSnap, vSnap, ended);
            if (!hSnap.snapped) {
                this._createHSpacingLines(diagram, selectedObject, objectsAtLeft, objectsAtRight, hSnap, vSnap, ended, g, del, snapObjDistance);
            }
            if (!vSnap.snapped) {
                this._createVSpacingLines(diagram, selectedObject, objectsAtTop, objectsAtBottom, hSnap, vSnap, ended, g, del, snapObjDistance);
            }
        },

        _snapSize: function (diagram, hSnap, vSnap, delx, dely, selectedObject, ended) {
            var lengthX = null, lengthY = null;
            var hTarget;
            var vTarget;
            var bounds = ej.datavisualization.Diagram.Util.bounds(selectedObject);
            var nameTable = diagram.nameTable;
            var sameWidth = [];
            var sameHeight = [];
            var scale = diagram._currZoom;
            var hoffset = diagram._hScrollOffset;
            var voffset = diagram._vScrollOffset;
            var snapObjDistance = diagram._snapObjectDistance();
            var viewPort = diagram._viewPort;
            var hintersectedrect = ej.datavisualization.Diagram.Rectangle(hoffset / scale, (bounds.y - 5) / scale,
                viewPort.width / scale, (bounds.height + 10) / scale);
            var vintersectedrect = ej.datavisualization.Diagram.Rectangle((bounds.x - 5) / scale, voffset / scale,
                (bounds.width + 10) / scale, viewPort.height / scale);
            viewPort = ej.datavisualization.Diagram.Rectangle(hoffset / scale, voffset / scale, viewPort.width / scale,
               viewPort.height / scale);
            var nodesInView = [];
            var nodes = this._findNodes(diagram._spatialSearch, selectedObject, vintersectedrect, viewPort, nodesInView);
            var i, target, targetBounds;
            for (i = 0; i < nodes.length; i++) {
                target = nodes[i];
                if (this._canConsider(nameTable, selectedObject, target) && !target.segments) {
                    targetBounds = ej.datavisualization.Diagram.Util.bounds(target);
                    if (lengthX == null || lengthX > Math.abs(targetBounds.y - bounds.y)) {
                        if (hSnap.left) {
                            if (Math.abs(bounds.x + delx - targetBounds.x) <= snapObjDistance) {
                                hTarget = this._createSnapObject(targetBounds, bounds, "left");
                                lengthX = Math.abs(targetBounds.y - bounds.y);
                            }
                            else if (Math.abs(bounds.x + delx - targetBounds.x - targetBounds.width) <= snapObjDistance) {
                                hTarget = this._createSnapObject(targetBounds, bounds, "leftRight");
                                lengthX = Math.abs(targetBounds.y - bounds.y);
                            }
                        }
                        else if (hSnap.right) {
                            if (Math.abs(bounds.x + delx + bounds.width - targetBounds.x - targetBounds.width) <= snapObjDistance) {
                                hTarget = this._createSnapObject(targetBounds, bounds, "right");
                                lengthX = Math.abs(targetBounds.y - bounds.y);
                            }
                            else if (Math.abs(bounds.x + delx + bounds.width - targetBounds.x) <= snapObjDistance) {
                                hTarget = this._createSnapObject(targetBounds, bounds, "rightLeft");
                                lengthX = Math.abs(targetBounds.y - bounds.y);
                            }
                        }
                    }
                }
            }
            nodes = this._findNodes(diagram._spatialSearch, selectedObject, hintersectedrect, viewPort);
            for (i = 0; i < nodes.length; i++) {
                target = nodes[i];
                if (this._canConsider(nameTable, selectedObject, target) && !target.segments) {
                    targetBounds = ej.datavisualization.Diagram.Util.bounds(target);
                    if (lengthY == null || lengthY > Math.abs(targetBounds.x - bounds.x)) {
                        if (vSnap.top) {
                            if (Math.abs(bounds.y + dely - targetBounds.y) <= snapObjDistance) {
                                vTarget = this._createSnapObject(targetBounds, bounds, "top");
                                lengthY = Math.abs(targetBounds.x - bounds.x);
                            }
                            else if (Math.abs(bounds.y + dely - targetBounds.y - targetBounds.height) <= snapObjDistance) {
                                vTarget = this._createSnapObject(targetBounds, bounds, "topBottom");
                                lengthY = Math.abs(targetBounds.x - bounds.x);
                            }
                        }
                        else if (vSnap.bottom) {
                            if (Math.abs(bounds.y + bounds.height + dely - targetBounds.y - targetBounds.height) <= snapObjDistance) {
                                vTarget = this._createSnapObject(targetBounds, bounds, "bottom");
                                lengthY = Math.abs(targetBounds.x - bounds.x);
                            }
                            else if (Math.abs(bounds.y + bounds.height + dely - targetBounds.y) <= snapObjDistance) {
                                vTarget = this._createSnapObject(targetBounds, bounds, "bottomTop");
                                lengthY = Math.abs(targetBounds.x - bounds.x);
                            }
                        }
                    }
                }
            }
            for (i = 0; i < nodesInView.length; i++) {
                target = nodesInView[i];
                if (this._canConsider(nameTable, selectedObject, target)) {
                    var targetbounds = ej.datavisualization.Diagram.Util.bounds(target);
                    var del = hSnap.left ? -delx : delx;
                    var diff = Math.abs(bounds.width + del - targetbounds.width);
                    var actualDiff;
                    if (diff <= snapObjDistance) {
                        actualDiff = hSnap.left ? -targetbounds.width + bounds.width : targetbounds.width - bounds.width;
                        sameWidth[sameWidth.length] = { source: target, diff: diff, offset: actualDiff };
                    }
                    del = vSnap.top ? -dely : dely;
                    var dify = Math.abs(bounds.height + del - targetbounds.height);
                    if (dify <= snapObjDistance) {
                        actualDiff = vSnap.top ? -targetbounds.height + bounds.height : targetbounds.height - bounds.height;
                        sameHeight[sameHeight.length] = { source: target, diff: dify, offset: actualDiff };
                    }
                }
            }
            if (!diagram.activeTool.selectedSeperator)
                var g = this._createGuidelines(diagram, hTarget, vTarget, hSnap, vSnap, ended);
            if (!hSnap.snapped && sameWidth.length > 0 && (hSnap.left || hSnap.right)) {
                this._addSameWidthLines(diagram, sameWidth, hSnap, ended, g, selectedObject);
            }
            if (!vSnap.snapped && sameHeight.length > 0 && (vSnap.top || vSnap.bottom)) {
                this._addSameHeightLines(diagram, sameHeight, vSnap, ended, g, selectedObject);
            }
        },
        _createSnapObject: function (targetbounds, bounds, snap) {
            var snapObject;
            switch (snap) {
                case "left":
                    snapObject = {
                        start: ej.datavisualization.Diagram.Point(targetbounds.x, Math.min(targetbounds.y, bounds.y)),
                        end: ej.datavisualization.Diagram.Point(targetbounds.x, Math.max(targetbounds.y + targetbounds.height, bounds.y + bounds.height)),
                        offsetX: targetbounds.x - bounds.x, offsetY: 0, type: "sideAlign"
                    };
                    break;
                case "right":
                    snapObject = {
                        start: ej.datavisualization.Diagram.Point(targetbounds.x + targetbounds.width, Math.min(targetbounds.y, bounds.y)),
                        end: ej.datavisualization.Diagram.Point(targetbounds.x + targetbounds.width, Math.max(targetbounds.y + targetbounds.height, bounds.y + bounds.height)),
                        offsetX: targetbounds.x + targetbounds.width - bounds.x - bounds.width, offsetY: 0, type: "sideAlign"
                    };
                    break;
                case "top":
                    snapObject = {
                        start: ej.datavisualization.Diagram.Point(Math.min(targetbounds.x, bounds.x), targetbounds.y),
                        end: ej.datavisualization.Diagram.Point(Math.max(targetbounds.x + targetbounds.width, bounds.x + bounds.width), targetbounds.y),
                        offsetY: targetbounds.y - bounds.y, offsetX: 0, type: "sideAlign"
                    };
                    break;
                case "bottom":
                    snapObject = {
                        start: ej.datavisualization.Diagram.Point(Math.min(targetbounds.x, bounds.x), targetbounds.y + targetbounds.height),
                        end: ej.datavisualization.Diagram.Point(Math.max(targetbounds.x + targetbounds.width, bounds.x + bounds.width), targetbounds.y + targetbounds.height),
                        offsetY: targetbounds.y + targetbounds.height - bounds.y - bounds.height, offsetX: 0, type: "sideAlign"
                    };
                    break;
                case "topBottom":
                    snapObject = {
                        start: ej.datavisualization.Diagram.Point(Math.min(targetbounds.x, bounds.x), targetbounds.y + targetbounds.height),
                        end: ej.datavisualization.Diagram.Point(Math.max(targetbounds.x + targetbounds.width, bounds.x + bounds.width), targetbounds.y + targetbounds.height),
                        offsetY: targetbounds.y + targetbounds.height - bounds.y, offsetX: 0, type: "sideAlign"
                    };
                    break;
                case "bottomTop":
                    snapObject = {
                        start: ej.datavisualization.Diagram.Point(Math.min(targetbounds.x, bounds.x), targetbounds.y),
                        end: ej.datavisualization.Diagram.Point(Math.max(targetbounds.x + targetbounds.width, bounds.x + bounds.width), targetbounds.y),
                        offsetY: targetbounds.y - bounds.y - bounds.height, offsetX: 0, type: "sideAlign"
                    };
                    break;
                case "leftRight":
                    snapObject = {
                        start: ej.datavisualization.Diagram.Point(targetbounds.x + targetbounds.width, Math.min(targetbounds.y, bounds.y)),
                        end: ej.datavisualization.Diagram.Point(targetbounds.x + targetbounds.width, Math.max(targetbounds.y + targetbounds.height, bounds.y + bounds.height)),
                        offsetX: targetbounds.x + targetbounds.width - bounds.x, offsetY: 0, type: "sideAlign"
                    };
                    break;
                case "rightLeft":
                    snapObject = {
                        start: ej.datavisualization.Diagram.Point(targetbounds.x, Math.min(targetbounds.y, bounds.y)),
                        end: ej.datavisualization.Diagram.Point(targetbounds.x, Math.max(targetbounds.y + targetbounds.height, bounds.y + bounds.height)),
                        offsetX: targetbounds.x - bounds.x - bounds.width, offsetY: 0, type: "sideAlign"
                    };
                    break;
                case "centerX":
                    snapObject = {
                        start: ej.datavisualization.Diagram.Point(targetbounds.x + targetbounds.width / 2, Math.min(targetbounds.y, bounds.y)),
                        end: ej.datavisualization.Diagram.Point(targetbounds.x + targetbounds.width / 2, Math.max(targetbounds.y + targetbounds.height, bounds.y + bounds.height)),
                        offsetX: targetbounds.x + targetbounds.width / 2 - (bounds.x + bounds.width / 2), offsetY: 0, type: "centerAlign"
                    };
                    break;
                case "centerY":
                    snapObject = {
                        start: ej.datavisualization.Diagram.Point(Math.min(targetbounds.x, bounds.x), targetbounds.y + targetbounds.height / 2),
                        end: ej.datavisualization.Diagram.Point(Math.max(targetbounds.x + targetbounds.width, bounds.x + bounds.width), targetbounds.y + targetbounds.height / 2),
                        offsetY: targetbounds.y + targetbounds.height / 2 - (bounds.y + bounds.height / 2), offsetX: 0, type: "centerAlign"
                    };
                    break;
            }
            return snapObject;
        },
        _createGuidelines: function (diagram, hTarget, vTarget, hsnap, vsnap, ended) {
            var attr = { id: diagram._canvas.id + "guideline", "style": "pointer-events:none;" };
            var g = ej.datavisualization.Diagram.SvgContext._initializeGuidelines(diagram._adornerSvg, attr, diagram._adornerLayer);
            var scale = diagram._currZoom;
            var hOffset = diagram._hScrollOffset;
            var vOffset = diagram._vScrollOffset;
            if (hTarget) {
                hsnap.offset = hTarget.offsetX;
                hsnap.snapped = true;
                if (!ended) {
                    if (hTarget.type == "sideAlign") {
                        ej.datavisualization.Diagram.SvgContext._renderSideAlignmentLines(hTarget.start, hTarget.end, g, diagram._adornerSvg, scale, hOffset, vOffset);
                    }
                    else if (hTarget.type == "centerAlign") {
                        ej.datavisualization.Diagram.SvgContext._renderCenterAlignmentLines(hTarget.start, hTarget.end, g, diagram._adornerSvg, scale, hOffset, vOffset);
                    }
                }
            }
            if (vTarget) {
                vsnap.offset = vTarget.offsetY;
                vsnap.snapped = true;
                if (!ended) {
                    if (vTarget.type == "sideAlign") {
                        ej.datavisualization.Diagram.SvgContext._renderSideAlignmentLines(vTarget.start, vTarget.end, g, diagram._adornerSvg, scale, hOffset, vOffset);
                    }
                    else if (vTarget.type == "centerAlign") {
                        ej.datavisualization.Diagram.SvgContext._renderCenterAlignmentLines(vTarget.start, vTarget.end, g, diagram._adornerSvg, scale, hOffset, vOffset);
                    }
                }
            }
            diagram._guideline = g;
            return g;
        },
        _removeGuidelines: function (diagram) {
            var g = diagram._guideline ? diagram._guideline : diagram._adornerSvg.getElementById(diagram._canvas.id + "guideline");
            if (g != null) {
                ej.datavisualization.Diagram.SvgContext._removeGuidelines(diagram._adornerLayer, g);
                delete diagram._guideline;
            }
        },
        _sortByDistance: function (obj, value, asc) {
            var i, j, temp;
            if (asc) {
                for (i = 0; i < obj.length; i++) {
                    for (j = i + 1; j < obj.length; j++) {
                        if (obj[i][value] > obj[j][value]) {
                            temp = obj[i];
                            obj[i] = obj[j];
                            obj[j] = temp;
                        }
                    }
                }
            }
            else {
                for (i = 0; i < obj.length; i++) {
                    for (j = i + 1; j < obj.length; j++) {
                        if (obj[i][value] < obj[j][value]) {
                            temp = obj[i];
                            obj[i] = obj[j];
                            obj[j] = temp;
                        }
                    }
                }
            }
        },
        _createHSpacingLines: function (diagram, shape, objectsAtLeft, objectsAtRight, hSnap, vSnap, ended, g, del, snapObjDistance) {
            var top = null;
            this._sortByDistance(objectsAtLeft, "distance", true);
            this._sortByDistance(objectsAtRight, "distance", true);
            var equallySpaced = [];
            var bounds = ej.datavisualization.Diagram.Util.bounds(shape);
            var nearestleft, nearestright;
            var targetBounds;
            if (objectsAtLeft.length > 0) {
                equallySpaced[equallySpaced.length] = objectsAtLeft[0];
                nearestleft = ej.datavisualization.Diagram.Util.bounds(objectsAtLeft[0].object);
                top = nearestleft.y;
                if (objectsAtLeft.length > 1) {
                    targetBounds = ej.datavisualization.Diagram.Util.bounds(objectsAtLeft[1].object);
                    var equaldistance = nearestleft.x - targetBounds.x - targetBounds.width;
                    if (Math.abs(equaldistance - objectsAtLeft[0].distance) <= snapObjDistance) {
                        top = this._findEquallySpacedNodesAtLeft(objectsAtLeft, equaldistance, top, equallySpaced);

                    } else equaldistance = objectsAtLeft[0].distance;
                } else equaldistance = objectsAtLeft[0].distance;
            }
            this._sortByDistance(equallySpaced, "distance");
            equallySpaced[equallySpaced.length] = { object: shape, distance: 0 };
            top = bounds.y < top || !top ? bounds.y : top;
            if (objectsAtRight.length > 0) {
                var dist;
                nearestright = ej.datavisualization.Diagram.Util.bounds(objectsAtRight[0].object);
                top = nearestright.y < top ? nearestright.y : top;
                if (objectsAtRight.length > 1) {
                    targetBounds = ej.datavisualization.Diagram.Util.bounds(objectsAtRight[1].object);
                    dist = targetBounds.x - nearestright.x - nearestright.width;
                }
                if (objectsAtLeft.length > 0) {
                    if (Math.abs(objectsAtRight[0].distance - objectsAtLeft[0].distance) <= snapObjDistance) {
                        var adjustablevalue = Math.abs(objectsAtRight[0].distance - objectsAtLeft[0].distance) / 2;
                        (objectsAtRight[0].distance < objectsAtLeft[0].distance) ?
                        equaldistance -= adjustablevalue : equaldistance += adjustablevalue;
                        equallySpaced[equallySpaced.length] = objectsAtRight[0];
                    }
                    else if (objectsAtLeft.length == 1) {
                        nearestleft = undefined;
                        equallySpaced.splice(0, 1);
                        equallySpaced[equallySpaced.length] = objectsAtRight[0];
                        equaldistance = dist;
                    }
                }
                else {
                    equaldistance = dist;
                    equallySpaced[equallySpaced.length] = objectsAtRight[0];
                }
                if (objectsAtRight.length > 1 && nearestright.x + nearestright.width < targetBounds.x) {
                    top = this._findEquallySpacedNodesAtRight(objectsAtRight, dist, top, equallySpaced, snapObjDistance);
                }
            }
            if (equallySpaced.length > 2) {
                this._addHSpacingLines(diagram, equallySpaced, ended, g, top);
                var delta = 0;
                if (ended)
                    delta = del.x;
                if (nearestleft)
                    hSnap.offset = equaldistance - Math.abs(bounds.x + delta - nearestleft.x - nearestleft.width) + delta;
                else if (nearestright)
                    hSnap.offset = Math.abs(bounds.x + bounds.width + delta - nearestright.x) - equaldistance + delta;
                hSnap.snapped = true;
            }
        },
        _createVSpacingLines: function (diagram, shape, objectsAtTop, objectsAtBottom, hSnap, vSnap, ended, g, del, snapObjDistance) {
            var right = null;
            this._sortByDistance(objectsAtTop, "distance", true);
            this._sortByDistance(objectsAtBottom, "distance", true);
            var equallySpaced = [];
            var bounds = ej.datavisualization.Diagram.Util.bounds(shape);
            var nearesttop, nearestbottom;
            var targetBounds;
            if (objectsAtTop.length > 0) {
                equallySpaced[equallySpaced.length] = objectsAtTop[0];
                nearesttop = ej.datavisualization.Diagram.Util.bounds(objectsAtTop[0].object);
                right = nearesttop.x + nearesttop.width;
                if (objectsAtTop.length > 1) {
                    targetBounds = ej.datavisualization.Diagram.Util.bounds(objectsAtTop[1].object);
                    var equaldistance = nearesttop.y - targetBounds.y - targetBounds.height;
                    if (Math.abs(equaldistance - objectsAtTop[0].distance) <= snapObjDistance) {
                        right = this._findEquallySpacedNodesAtTop(objectsAtTop, equaldistance, right, equallySpaced);
                    } else equaldistance = objectsAtTop[0].distance;
                } else equaldistance = objectsAtTop[0].distance;
            }
            this._sortByDistance(equallySpaced, "distance");
            equallySpaced[equallySpaced.length] = { object: shape, distance: 0 };
            right = bounds.x + bounds.width > right || !right ? bounds.x + bounds.width : right;
            var dist;
            if (objectsAtBottom.length > 0) {
                nearestbottom = ej.datavisualization.Diagram.Util.bounds(objectsAtBottom[0].object);
                right = nearestbottom.x + nearestbottom.width > right ? nearestbottom.x + nearestbottom.width : right;
                if (objectsAtBottom.length > 1) {
                    targetBounds = ej.datavisualization.Diagram.Util.bounds(objectsAtBottom[1].object);
                    dist = targetBounds.y - nearestbottom.y - nearestbottom.height;
                }

                if (objectsAtTop.length > 0) {
                    if (Math.abs(objectsAtBottom[0].distance - objectsAtTop[0].distance) <= snapObjDistance) {
                        var adjustablevalue = Math.abs(objectsAtBottom[0].distance - objectsAtTop[0].distance) / 2;
                        (objectsAtBottom[0].distance < objectsAtTop[0].distance) ?
                        equaldistance -= adjustablevalue : equaldistance += adjustablevalue;
                        equallySpaced[equallySpaced.length] = objectsAtBottom[0];
                    }
                    else if (objectsAtTop.length == 1) {
                        nearesttop = undefined;
                        equallySpaced.splice(0, 1);
                        equallySpaced[equallySpaced.length] = objectsAtBottom[0];
                        equaldistance = dist;
                    }
                }
                else {
                    equaldistance = dist;
                    equallySpaced[equallySpaced.length] = objectsAtBottom[0];
                }
                if (objectsAtBottom.length > 1 && targetBounds.y > nearestbottom.y + nearestbottom.height) {
                    right = this._findEquallySpacedNodesAtBottom(objectsAtBottom, dist, right, equallySpaced, snapObjDistance);
                }

            }
            if (equallySpaced.length > 2) {
                this._addVSpacingLine(diagram, equallySpaced, ended, g, right);
                var delta = 0;
                if (ended)
                    delta = del.y;
                if (nearesttop)
                    vSnap.offset = equaldistance - Math.abs(bounds.y + delta - nearesttop.y - nearesttop.height) + delta;
                else if (nearestbottom)
                    vSnap.offset = Math.abs(bounds.y + bounds.height + delta - nearestbottom.y) - equaldistance + delta;
                vSnap.snapped = true;
            }
        },
        _addHSpacingLines: function (diagram, equallySpaced, ended, g, top) {
            var scale = diagram._currZoom;
            var hoffset = diagram._hScrollOffset;
            var voffset = diagram._vScrollOffset;
            if (equallySpaced.length > 2) {
                if (!ended) {
                    for (var i = 0; i < equallySpaced.length - 1; i++) {
                        var crnt = ej.datavisualization.Diagram.Util.bounds(equallySpaced[i].object);
                        var next = ej.datavisualization.Diagram.Util.bounds(equallySpaced[i + 1].object);
                        ej.datavisualization.Diagram.SvgContext._renderSpacingLines(ej.datavisualization.Diagram.Point(crnt.x + crnt.width, top - 15),
                       ej.datavisualization.Diagram.Point(next.x, top - 15), g, diagram._adornerSvg, scale, hoffset, voffset);
                    }
                }

            }
        },
        _addVSpacingLine: function (diagram, equallySpaced, ended, g, right) {
            var scale = diagram._currZoom;
            var hoffset = diagram._hScrollOffset;
            var voffset = diagram._vScrollOffset;
            if (equallySpaced.length > 2) {
                if (!ended) {
                    var crnt, next;
                    for (var i = 0; i < equallySpaced.length - 1; i++) {
                        crnt = ej.datavisualization.Diagram.Util.bounds(equallySpaced[i].object);
                        next = ej.datavisualization.Diagram.Util.bounds(equallySpaced[i + 1].object);
                        ej.datavisualization.Diagram.SvgContext._renderSpacingLines(ej.datavisualization.Diagram.Point(right + 15, crnt.y + crnt.height),
                      ej.datavisualization.Diagram.Point(right + 15, next.y), g, diagram._adornerSvg, scale, hoffset, voffset);
                    }
                }

            }
        },
        _addSameWidthLines: function (diagram, sameWidths, hSnap, ended, g, shape) {
            var scale = diagram._currZoom;
            var hOffset = diagram._hScrollOffset;
            var vOffset = diagram._vScrollOffset;
            this._sortByDistance(sameWidths, "offset");
            var bounds = ej.datavisualization.Diagram.Util.bounds(shape);
            var target = sameWidths[0];
            var targetBounds = ej.datavisualization.Diagram.Util.bounds(target.source);
            var sameSizes = [];
            sameSizes.push(sameWidths[0]);
            var i, crntbounds;
            for (i = 1; i < sameWidths.length; i++) {
                crntbounds = ej.datavisualization.Diagram.Util.bounds(sameWidths[i].source);
                if (crntbounds.width == targetBounds.width)
                    sameSizes.push(sameWidths[i]);
            }
            if (sameSizes.length > 0) {
                if (!ended) {
                    ej.datavisualization.Diagram.SvgContext._renderSpacingLines(ej.datavisualization.Diagram.Point(bounds.x + target.offset, bounds.y - 15),
                        ej.datavisualization.Diagram.Point(bounds.x + bounds.width + target.offset, bounds.y - 15), g, diagram._adornerSvg, scale, hOffset, vOffset);
                    for (i = 0; i < sameSizes.length; i++) {
                        bounds = ej.datavisualization.Diagram.Util.bounds(sameSizes[i].source);
                        ej.datavisualization.Diagram.SvgContext._renderSpacingLines(ej.datavisualization.Diagram.Point(bounds.x, bounds.y - 15),
                        ej.datavisualization.Diagram.Point(bounds.x + bounds.width, bounds.y - 15), g, diagram._adornerSvg, scale, hOffset, vOffset);
                    }
                }
            }
            hSnap.offset = target.offset;
            hSnap.snapped = true;
        },
        _addSameHeightLines: function (diagram, sameHeights, vSnap, ended, g, shape) {
            var scale = diagram._currZoom;
            var hOffset = diagram._hScrollOffset;
            var vOffset = diagram._vScrollOffset;
            this._sortByDistance(sameHeights, "offset");
            var bounds = ej.datavisualization.Diagram.Util.bounds(shape);
            var target = sameHeights[0];
            var targetBounds = ej.datavisualization.Diagram.Util.bounds(target.source);
            var sameSizes = [];
            sameSizes.push(sameHeights[0]);
            var i, crntBounds;
            for (i = 0; i < sameHeights.length; i++) {
                crntBounds = ej.datavisualization.Diagram.Util.bounds(sameHeights[i].source);
                if (crntBounds.height == targetBounds.height)
                    sameSizes.push(sameHeights[i]);
            }
            if (sameSizes.length > 0) {
                if (!ended) {
                    ej.datavisualization.Diagram.SvgContext._renderSpacingLines(ej.datavisualization.Diagram.Point(bounds.x + bounds.width + 15, bounds.y + target.offset),
                        ej.datavisualization.Diagram.Point(bounds.x + bounds.width + 15, bounds.y + bounds.height + target.offset), g, diagram._adornerSvg, scale, hOffset, vOffset);
                    for (i = 0; i < sameSizes.length; i++) {
                        bounds = ej.datavisualization.Diagram.Util.bounds(sameSizes[i].source);
                        ej.datavisualization.Diagram.SvgContext._renderSpacingLines(ej.datavisualization.Diagram.Point(bounds.x + bounds.width + 15, bounds.y),
                        ej.datavisualization.Diagram.Point(bounds.x + bounds.width + 15, bounds.y + bounds.height), g, diagram._adornerSvg, scale, hOffset, vOffset);

                    }
                }
                vSnap.offset = target.offset;
                vSnap.snapped = true;
            }
        },
        _findEquallySpacedNodesAtLeft: function (objectsAtLeft, equalDistance, top, equallySpaced) {
            var prevBounds, targetBounds, dist;
            for (var i = 1; i < objectsAtLeft.length; i++) {
                prevBounds = ej.datavisualization.Diagram.Util.bounds(objectsAtLeft[i - 1].object);
                targetBounds = ej.datavisualization.Diagram.Util.bounds(objectsAtLeft[i].object);
                dist = prevBounds.x - targetBounds.x - targetBounds.width;
                if (Math.abs(dist - equalDistance) <= 1) {
                    equallySpaced[equallySpaced.length] = objectsAtLeft[i];
                    if (targetBounds.y < top)
                        top = targetBounds.y;
                }
                else
                    break;
            }
            return top;
        },
        _findEquallySpacedNodesAtRight: function (objectsAtRight, equalDistance, top, equallySpaced, snapObjDistance) {
            var actualDistance = objectsAtRight[0].distance;
            var target, targetBounds, prevBounds, dist;
            if (Math.abs(equalDistance - actualDistance) <= snapObjDistance) {
                for (var i = 0; i < objectsAtRight.length - 1; i++) {
                    target = objectsAtRight[i].object;
                    targetBounds = ej.datavisualization.Diagram.Util.bounds(objectsAtRight[i + 1].object);
                    prevBounds = ej.datavisualization.Diagram.Util.bounds(target);
                    dist = targetBounds.x - prevBounds.x - prevBounds.width;
                    if (Math.abs(dist - equalDistance) <= 1) {
                        equallySpaced[equallySpaced.length] = objectsAtRight[i + 1];
                        if (prevBounds.y < top) {
                            top = prevBounds.y;
                        }
                    }
                    else
                        break;
                }
            }
            return top;
        },
        _findEquallySpacedNodesAtTop: function (objectsAtTop, equalDistance, right, equallySpaced) {
            var prevBounds, targetBounds, dist;
            for (var i = 1; i < objectsAtTop.length; i++) {
                prevBounds = ej.datavisualization.Diagram.Util.bounds(objectsAtTop[i - 1].object);
                targetBounds = ej.datavisualization.Diagram.Util.bounds(objectsAtTop[i].object);
                dist = prevBounds.y - targetBounds.y - targetBounds.height;
                if (Math.abs(dist - equalDistance) <= 1) {
                    equallySpaced[equallySpaced.length] = objectsAtTop[i];
                    if (targetBounds.x + targetBounds.width > right)
                        right = targetBounds.x + targetBounds.width;
                }
                else
                    break;
            }
            return right;
        },
        _findEquallySpacedNodesAtBottom: function (objectsAtBottom, equalDistance, right, equallySpaced, snapObjDistance) {
            var actualDistance = objectsAtBottom[0].distance;
            var target, targetBounds, prevBounds, dist;
            if (Math.abs(equalDistance - actualDistance) <= snapObjDistance) {
                for (var i = 0; i < objectsAtBottom.length - 1; i++) {
                    target = objectsAtBottom[i].object;
                    targetBounds = ej.datavisualization.Diagram.Util.bounds(objectsAtBottom[i + 1].object);
                    prevBounds = ej.datavisualization.Diagram.Util.bounds(target);
                    dist = targetBounds.y - prevBounds.y - prevBounds.height;
                    if (Math.abs(dist - equalDistance) <= 1) {
                        equallySpaced[equallySpaced.length] = objectsAtBottom[i + 1];
                        if (prevBounds.x + prevBounds.width > right)
                            right = prevBounds.x + prevBounds.width;
                    }
                    else
                        break;
                }
            }
            return right;
        },

    };
    //#endregion

    //#region SpatialSearch
    ej.datavisualization.Diagram.SpatialUtil = {
        findQuads: function (spatialSearch, viewPort) {
            spatialSearch.quads = [];
            var quad = spatialSearch.parentQuad;
            this._findQuads(spatialSearch, quad, viewPort);
            return spatialSearch.quads;
        },
        _addIntoAQuad: function (spatialSearch) {
            var isAdded = false;
            while (!isAdded) {
                isAdded = this._add(spatialSearch, spatialSearch.parentQuad);
            }
        },
        _setCurrentNode: function (spatialSearch, node, diagram) {
            spatialSearch.childnode = node;
            var bounds = ej.datavisualization.Diagram.Util.bounds(node);
            spatialSearch.childLeft = bounds.left;
            spatialSearch.childTop = bounds.top;
            spatialSearch.childRight = bounds.right;
            spatialSearch.childBottom = bounds.bottom;
            if (diagram) {
                var labels = node.labels;
                for (var j = 0; j < labels.length; j++) {
                    var label = labels[j];

                    if (label && label.visible && !diagram.activeTool.inAction) {
                        var labelbounds = ej.datavisualization.Diagram.Util.getLabelbounds(diagram, node, label);

                        if (labelbounds) {
                            bounds = diagram._union(labelbounds, bounds);
                            bounds = ej.datavisualization.Diagram.Util.bounds(bounds);
                            spatialSearch.childLeft = bounds.left;
                            spatialSearch.childTop = bounds.top;
                            spatialSearch.childRight = bounds.right;
                            spatialSearch.childBottom = bounds.bottom;
                        }
                    }
                }
            }
        },
        _add: function (spatialSearch, quad) {
            if (this._isContained(spatialSearch, quad)) {
                this._selectQuad(spatialSearch, quad);
                return true;
            } else {
                var newParent;
                var isEmpty = !quad.objects.length && quad.first == null && quad.second == null && quad.third == null && quad.fourth == null;
                if (spatialSearch.childLeft < quad.left) {
                    if (spatialSearch.childTop < quad.top) {
                        newParent = ej.datavisualization.Diagram.Quad(quad.left - quad.width, quad.top - quad.height, quad.width * 2, quad.height * 2);
                        if (!isEmpty)
                            newParent.fourth = quad;
                    }
                    else {
                        newParent = ej.datavisualization.Diagram.Quad(quad.left - quad.width, quad.top, quad.width * 2, quad.height * 2);
                        if (!isEmpty)
                            newParent.second = quad;
                    }
                }
                else if (spatialSearch.childTop < quad.top) {
                    newParent = ej.datavisualization.Diagram.Quad(quad.left, quad.top - quad.height, quad.width * 2, quad.height * 2);
                    if (!isEmpty)
                        newParent.third = quad;
                }
                else {
                    newParent = ej.datavisualization.Diagram.Quad(quad.left, quad.top, quad.width * 2, quad.height * 2);
                    if (!isEmpty)
                        newParent.first = quad;
                }
                quad.parent = newParent;
                spatialSearch.parentQuad = newParent;
                return false;
            }
        },
        _isContained: function (spatialSearch, quad) {
            if (spatialSearch.childLeft >= quad.left && spatialSearch.childRight <= quad.left + quad.width &&
                spatialSearch.childTop >= quad.top && spatialSearch.childBottom <= quad.top + quad.height) {
                return true;
            }
            return false;
        },
        _selectQuad: function (spatialSearch, quad) {
            var current = quad;
            while (current !== null) {
                current = this._getQuad(spatialSearch, current);
            }
        },
        _getQuad: function (spatialSearch, quad) {
            var halfWidth = quad.width / 2;
            var halfHeight = quad.height / 2;
            var height = spatialSearch._isRouting && spatialSearch._viewPortHeight > 0 ? spatialSearch._viewPortHeight : 100;
            var width = spatialSearch._isRouting && spatialSearch._viewPortWidth > 0 ? spatialSearch._viewPortWidth : 100;
            if (halfWidth >= width && halfHeight >= height) {
                var xCenter = quad.left + halfWidth;
                var yCenter = quad.top + halfHeight;
                if (spatialSearch.childRight <= xCenter) {
                    if (spatialSearch.childBottom <= yCenter) {
                        return quad.first ? quad.first :
                               quad.first = ej.datavisualization.Diagram.Quad(quad.left, quad.top, halfWidth, halfHeight, quad);
                    }
                    else if (spatialSearch.childTop >= yCenter) {
                        return quad.third ? quad.third :
                                quad.third = ej.datavisualization.Diagram.Quad(quad.left, yCenter, halfWidth, halfHeight, quad);
                    }
                }
                else if (spatialSearch.childLeft >= xCenter) {
                    if (spatialSearch.childBottom <= yCenter) {
                        return quad.second ? quad.second :
                               quad.second = ej.datavisualization.Diagram.Quad(xCenter, quad.top, halfWidth, halfHeight, quad);
                    }
                    else if (spatialSearch.childTop >= yCenter) {
                        return quad.fourth ? quad.fourth :
                                quad.fourth = ej.datavisualization.Diagram.Quad(xCenter, yCenter, halfWidth, halfHeight, quad);
                    }
                }
            }
            quad.objects.push(spatialSearch.childnode);
            spatialSearch.quadTable[spatialSearch.childnode.name] = quad;
            return null;
        },
        _findQuads: function (spatialSearch, quad, viewPort) {
            if (quad.first && this._isIntersect(quad.first, viewPort)) {
                this._findQuads(spatialSearch, quad.first, viewPort);
            }
            if (quad.second && this._isIntersect(quad.second, viewPort)) {
                this._findQuads(spatialSearch, quad.second, viewPort);
            }
            if (quad.third && this._isIntersect(quad.third, viewPort)) {
                this._findQuads(spatialSearch, quad.third, viewPort);
            }
            if (quad.fourth && this._isIntersect(quad.fourth, viewPort)) {
                this._findQuads(spatialSearch, quad.fourth, viewPort);
            }
            if (quad.objects.length > 0)
                spatialSearch.quads.push(quad);
        },
        _isIntersect: function (quad, viewPort) {
            if (quad.left + quad.width < viewPort.x || quad.top + quad.height < viewPort.y || quad.left > viewPort.x + viewPort.width || quad.top > viewPort.y + viewPort.height) {
                return false;
            }
            return true;
        },
        _update: function (quad) {
            if (quad.parent != null && quad.objects.length == 0 && quad.first == null &&
                quad.second == null && quad.third == null && quad.fourth == null) {
                var parent = quad.parent;
                if (parent.first == quad) {
                    parent.first = null;
                }
                else if (parent.second == quad) {
                    parent.second = null;
                }
                else if (parent.third == quad) {
                    parent.third = null;
                }
                else if (parent.fourth == quad) {
                    parent.fourth = null;
                }
                this._update(quad.parent);
            }
            else
                return;
        },
        _isWithinPageBounds: function (spatialSearch, bounds) {
            if (bounds.left >= spatialSearch.pageLeft && bounds.right <= spatialSearch.pageRight &&
                bounds.top >= spatialSearch.pageTop && bounds.bottom <= spatialSearch.pageBottom)
                return true;
            else
                return false;
        },
        _updateBounds: function (diagram, spatialSearch, node, update) {
            var modified = false;
            if (spatialSearch.topElement && node.name == spatialSearch.topElement.name) {
                modified = true;
                spatialSearch.pageTop = null;
                this._findQuadElement(spatialSearch, spatialSearch.parentQuad, "top");
            }
            if (spatialSearch.leftElement && node.name == spatialSearch.leftElement.name) {
                modified = true;
                spatialSearch.pageLeft = null;
                this._findQuadElement(spatialSearch, spatialSearch.parentQuad, "left");
            }
            if (spatialSearch.rightElement && node.name == spatialSearch.rightElement.name) {
                modified = true;
                spatialSearch.pageRight = null;
                this._findQuadElement(spatialSearch, spatialSearch.parentQuad, "right");
            }
            if (spatialSearch.bottomElement && node.name == spatialSearch.bottomElement.name) {
                modified = true;
                spatialSearch.pageBottom = null;
                this._findQuadElement(spatialSearch, spatialSearch.parentQuad, "bottom");
            }
            if (modified) {
                if (diagram._pageBackgroundLayer) {
                    ej.datavisualization.Diagram.PageUtil._updatePageSize(diagram, (update !== undefined) ? update : true);
                }
            }
        },
        _findQuadElement: function (spatialSearch, quad, direction) {
            switch (direction) {
                case "bottom":
                    if (quad.third != null || quad.fourth != null) {
                        if (quad.third != null) {
                            this._findQuadElement(spatialSearch, quad.third, direction);
                        }
                        if (quad.fourth != null) {
                            this._findQuadElement(spatialSearch, quad.fourth, direction);
                        }
                    }
                    else {
                        if (quad.first != null) {
                            this._findQuadElement(spatialSearch, quad.first, direction);
                        }
                        if (quad.second != null) {
                            this._findQuadElement(spatialSearch, quad.second, direction);
                        }
                    }
                    break;
                case "top":
                    if (quad.first != null || quad.second != null) {
                        if (quad.first != null) {
                            this._findQuadElement(spatialSearch, quad.first, direction);
                        }
                        if (quad.second != null) {
                            this._findQuadElement(spatialSearch, quad.second, direction);
                        }
                    }
                    else {
                        if (quad.third != null) {
                            this._findQuadElement(spatialSearch, quad.third, direction);
                        }
                        if (quad.fourth != null) {
                            this._findQuadElement(spatialSearch, quad.fourth, direction);
                        }
                    }
                    break;
                case "left":
                    if (quad.first != null || quad.third != null) {
                        if (quad.first != null) {
                            this._findQuadElement(spatialSearch, quad.first, direction);
                        }
                        if (quad.third != null) {
                            this._findQuadElement(spatialSearch, quad.third, direction);
                        }
                    }
                    else {
                        if (quad.second != null) {
                            this._findQuadElement(spatialSearch, quad.second, direction);
                        }
                        if (quad.fourth != null) {
                            this._findQuadElement(spatialSearch, quad.fourth, direction);
                        }
                    }
                    break;
                case "right":
                    if (quad.second != null || quad.fourth != null) {
                        if (quad.second != null) {
                            this._findQuadElement(spatialSearch, quad.second, direction);
                        }
                        if (quad.fourth != null) {
                            this._findQuadElement(spatialSearch, quad.fourth, direction);
                        }
                    }
                    else {
                        if (quad.third != null) {
                            this._findQuadElement(spatialSearch, quad.third, direction);
                        }
                        if (quad.first != null) {
                            this._findQuadElement(spatialSearch, quad.first, direction);
                        }
                    }

                    break;
            }

            var bounds, type;
            for (var i = 0; i < quad.objects.length; i++) {
                bounds = ej.datavisualization.Diagram.Util.bounds(quad.objects[i]);
                if (direction === "bottom" && (spatialSearch.pageBottom <= bounds.bottom || spatialSearch.pageBottom == null)) {
                    spatialSearch.pageBottom = bounds.bottom;
                    spatialSearch.bottomElement = quad.objects[i];
                }
                else if (direction === "top" && (spatialSearch.pageTop >= bounds.top || spatialSearch.pageTop == null)) {
                    spatialSearch.pageTop = bounds.top;
                    spatialSearch.topElement = quad.objects[i];
                }
                else if (direction === "left" && (spatialSearch.pageLeft >= bounds.left || spatialSearch.pageLeft == null)) {
                    spatialSearch.pageLeft = bounds.left;
                    spatialSearch.leftElement = quad.objects[i];
                }
                else if (direction === "right" && (spatialSearch.pageRight <= bounds.right || spatialSearch.pageRight == null)) {
                    spatialSearch.pageRight = bounds.right;
                    spatialSearch.rightElement = quad.objects[i];
                }
            }
        },
        _initializeNodes: function (diagram, spatialSearch) {
            var nodes = diagram.nodes();
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var type = this.getObjectType(node);
                if (type != "group") {
                    this._updateQuad(diagram, spatialSearch, node);
                }
            }
        },

        _initializeConnectors: function (diagram, spatialSearch) {
            var connectors = diagram.connectors();
            for (var i = 0; i < connectors.length; i++) {
                this._updateQuad(diagram, spatialSearch, connectors[i]);
            }
        },

        _updateQuad: function (diagram, spatialSearch, node, layoutinAction) {
            this._setCurrentNode(spatialSearch, node, diagram);
            var bounds = ej.datavisualization.Diagram.Util.bounds(node);
            var quad = spatialSearch.quadTable[node.name];
            if (quad) {
                if (!this._isContained(spatialSearch, quad)) {
                    this._removeFromaQuad(spatialSearch, quad, node);
                    this._addIntoAQuad(spatialSearch);
                }
            }
            else {
                if (!spatialSearch.parentQuad)
                    spatialSearch.parentQuad = ej.datavisualization.Diagram.Quad(0, 0, 200, 200);
                this._addIntoAQuad(spatialSearch);
            }
            if (!(this._isWithinPageBounds(spatialSearch, bounds) && spatialSearch.leftElement != node &&
                spatialSearch.topElement != node && spatialSearch.rightElement != node && spatialSearch.bottomElement != node)) {
                var modified = false, endElement = false;
                if (spatialSearch.pageLeft >= spatialSearch.childLeft || spatialSearch.pageLeft == null) {
                    spatialSearch.pageLeft = spatialSearch.childLeft;
                    spatialSearch.leftElement = node;
                    modified = true;
                }
                else if (node == spatialSearch.leftElement) {
                    spatialSearch.pageLeft = null;
                    this._findQuadElement(spatialSearch, spatialSearch.parentQuad, "left");
                    endElement = modified = true;
                }

                if (spatialSearch.pageTop >= spatialSearch.childTop || spatialSearch.pageTop == null) {
                    spatialSearch.pageTop = spatialSearch.childTop;
                    spatialSearch.topElement = node;
                    modified = true;
                }
                else if (node == spatialSearch.topElement) {
                    spatialSearch.pageTop = null;
                    this._findQuadElement(spatialSearch, spatialSearch.parentQuad, "top");
                    endElement = modified = true;
                }

                if (spatialSearch.pageBottom <= spatialSearch.childBottom || spatialSearch.pageBottom == null) {
                    modified = true;
                    spatialSearch.pageBottom = spatialSearch.childBottom;
                    spatialSearch.bottomElement = node;
                }
                else if (node == spatialSearch.bottomElement) {
                    spatialSearch.pageBottom = null;
                    this._findQuadElement(spatialSearch, spatialSearch.parentQuad, "bottom");
                    endElement = modified = true;
                }

                if (spatialSearch.pageRight <= spatialSearch.childRight || spatialSearch.pageRight == null) {
                    spatialSearch.pageRight = spatialSearch.childRight;
                    spatialSearch.rightElement = node;
                    modified = true;
                }
                else if (node == spatialSearch.rightElement) {
                    spatialSearch.pageRight = null;
                    this._findQuadElement(spatialSearch, spatialSearch.parentQuad, "right");
                    endElement = modified = true;
                }
            }
            var pageBounds = diagram.activeTool.diagramBounds;
            if (modified && diagram.model.pageSettings.multiplePage &&
                (diagram.model.pageSettings.pageWidth || diagram.model.pageSettings.pageHeight) && pageBounds) {
                modified = false;
                if (endElement || spatialSearch.pageLeft < pageBounds.x || spatialSearch.pageTop < pageBounds.y ||
                    spatialSearch.pageRight > pageBounds.x + pageBounds.width || spatialSearch.pageBottom > pageBounds.y + pageBounds.height) {
                    modified = true;
                    diagram.activeTool.diagramBounds = diagram._getDigramBounds();
                }
            }
            if (modified) {
                diagram._views.forEach(function (viewid) {
                    var view = diagram._views[viewid];
                    if (view.type == "overview") {
                        var ovw = $("#" + viewid).ejOverview("instance");
                        if (ovw)
                            ovw._updateOverview(view);
                    }
                });
                if (!diagram._layoutInAction && diagram._pageBackgroundLayer) {
                    ej.datavisualization.Diagram.PageUtil._updatePageSize(diagram, diagram.activeTool.inAction || diagram._selectedSymbol);
                }
            }
        },
        _removeFromaQuad: function (spatialSearch, quad, node) {
            if (quad) {
                var index = quad.objects.indexOf(node);
                quad.objects.splice(index, 1);
                this._update(quad);
                delete spatialSearch.quadTable[node.name];
            }
        }

    };

    ej.datavisualization.Diagram.Quad = function (left, top, width, height, parent) {
        return {
            left: left, top: top, width: width, height: height, parent: parent,
            first: null, second: null, third: null, fourth: null, objects: []
        };
    }
    ej.datavisualization.Diagram.SpatialSearch = function (diagram) {       
        var viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(diagram);
        var x = 0;
        var y = 0;
        var height = 200;
        var width = 200;
        if (ej.datavisualization.Diagram.Util.canRouteDiagram(diagram)) {
            x = -100; y = -100;
            height = viewPort.height > 0 ? viewPort.height : 1000;
            width = viewPort.width > 0 ? viewPort.width : 1000;
        }
        return {
            pageLeft: null, pageRight: null, pageTop: null, pageBottom: null,
            topElement: null, bottomElement: null, rightElement: null, leftElement: null,
            childLeft: null, childTop: null, childRight: null, childBottom: null, childNode: null,
            quads: null, parentQuad: ej.datavisualization.Diagram.Quad(x, y, width, height), quadTable: {}
        };
    };
    //#endregion
    ej.datavisualization.Diagram.ClassifierHelper = {
        getEditableElementUnderMouse: function (evt, diagram) {
            var element = diagram._findNodeUnderMouse(evt);
            if (element) {
                var type = element.name.match("_attribute") ? "attribute" : (element.name.match("_method") ? "method" : (element.name.match("_member") ? "member" : "header"));
                if (type && element.parent)
                    element = diagram.nameTable[element.parent];
            }
            return element;
        },
        getMovableElementUnderMouse: function (evt, diagram, defult) {
            var element = diagram._findNodeUnderMouse(evt);
            var className = evt.target.className;
            if (element && element.parent && !(element.type == "umlclassifier"))
                element = diagram.nameTable[element.parent]
            return element;
        },
        getSelectableElementUnderMouse: function (evt, diagram, skip) {
            var node = diagram._findNodeUnderMouse(evt);
            if (node && node.parent && !(node.type == "umlclassifier"))
                node = diagram.nameTable[node.parent];
            return node;
        },
        getDropableElementUnderMouse: function (evt, diagram) {
            var element = diagram._findNodeUnderMouse(evt);
            if (!diagram._nodeUnderMouse)
                diagram._nodeUnderMouse = element;
            if (element && ej.datavisualization.Diagram.Util.canAllowDrop(element))
                return element;
            else
                return true;
        },
        renderResizeBorder: function (id, node, svg, scale) {
            var width = node.width ? node.width : node._width;
            var height = node.height ? node.height : node._height;
            var rect = svg.rect({
                "id": id, "width": (width * scale) + node.borderWidth + 4, "height": height * scale + node.borderWidth + 4, x: -(node.borderWidth / 2 + 2), y: -(node.borderWidth / 2 + 2), "stroke": "#f93732", "stroke-width": 2, "stroke-dasharray": "0", "fill": "none", "pointer-events": "none"
            });
            return rect;
        },
        getEditboxValue: function (editBoxValue, shape, diagram) {
            for (var i = 0; i < shape.children.length; i++) {
                if (typeof shape.children[i] == "string")
                    shape.children[i] = diagram.nameTable[diagram._getChild(shape.children[i])];
                var type = shape.children[i].name.match("_attribute") ? "attribute" : (shape.children[i].name.match("_method") ? "method" : (shape.children[i].name.match("_member") ? "member" : "header"));
            }
            var text = editBoxValue.split("\n");
            for (var j = 0; j < text.length; j++) {
                text[j] = text[j].trim().replace(/\s+/g, " ");
                if (!text[j].indexOf("---") > -1 && text[j].charAt(0) == "+" || text[j].charAt(0) == "-" || text[j].charAt(0) == "#" || text[j].charAt(0) == "~")
                    text[j] = text[j];
                else if (j != text[j].length - text[j].length && !text[j].indexOf("---") > -1 && text[j].length > 0 && type != "member" && !shape.enumeration) {
                    text[j] = "+" + " " + text[j];
                }
                if (text[j].indexOf("---") > -1 && text[j].match(/\w|\d|\D|\s/g)) {
                    var spliter = text[j].match(/---/g);
                    text[j] = spliter[0];
                }
            }
            editBoxValue = text.join("\n");
            var editLabel = editBoxValue.split("\n---\n");
            for (var j = 0; j < editLabel.length; j++)
                editLabel[j] = editLabel[j].replace(/^\n+/g, "");
            if (editLabel[0].indexOf("+") > -1)
                editLabel[0] = editLabel[0].replace(/[+]/g, "");
            if (editLabel[0].length > 0)
                shape.children[0].labels[0].text = editLabel[0];
            if (shape.children[1] && !editLabel[2])
                shape.children[1].labels[0].text = editLabel[1];
            else if (shape.children[1] && editLabel[2]) {
                if (shape.children[1].name.indexOf("method") > -1) {
                    if (shape.children[1].labels[0].text.indexOf(editLabel[1]) > -1) {
                        shape.children[1].labels[0].text = editLabel[1];
                        editLabel.pop()
                    }
                    else
                        shape.children[1].labels[0].text = editLabel[2];
                }
                else {
                    var value = shape.children[1].name.indexOf("attribute") > -1 ? editLabel[1] : (shape.children[1].name.indexOf("member") > -1 ? editLabel[1] : editLabel[2]);
                    shape.children[1].labels[0].text = value;
                }
            }
            if (shape.children[2])
                shape.children[2].labels[0].text = editLabel[2];
            for (var i = 0; i < shape.children.length; i++) {
                var textEdit = shape.children[i].labels[0].text;
                if (textEdit && textEdit.indexOf("--") > -1) {
                    textEdit = textEdit.replace(/---\n*/g, "");
                    shape.children[i].labels[0].text = textEdit;
                }
                if (textEdit && textEdit.endsWith("\n")) {
                    var newText = textEdit.replace(/\n+$/g, "");
                    shape.children[i].labels[0].text = newText;
                }
                var labelLength = shape.children[i].labels[0].text ? shape.children[i].labels[0].text.length : null;
                if (!labelLength && labelLength <= 0) {
                    diagram._remove(shape.children[i]);
                    i--;
                }
                diagram.nameTable[shape.children[i].name] = shape.children[i];
            }
            if ((editLabel[2] && !shape.children[2]) || (editLabel[1] && !shape.children[1])) {
                var nodes = [];
                var constraints = ej.datavisualization.Diagram.NodeConstraints.Default & ~(ej.datavisualization.Diagram.NodeConstraints.Select | ej.datavisualization.Diagram.NodeConstraints.ResizeNorthEast | ej.datavisualization.Diagram.NodeConstraints.ResizeWest | ej.datavisualization.Diagram.NodeConstraints.ResizeSouthEast | ej.datavisualization.Diagram.NodeConstraints.ResizeNorthWest | ej.datavisualization.Diagram.NodeConstraints.ResizeSouthWest | ej.datavisualization.Diagram.NodeConstraints.ResizeNorth | ej.datavisualization.Diagram.NodeConstraints.ResizeSouth | ej.datavisualization.Diagram.NodeConstraints.Connect | ej.datavisualization.Diagram.NodeConstraints.Rotate | ej.datavisualization.Diagram.NodeConstraints.ResizeEast);
                var defaultProperty = { width: shape.width, offsetX: shape.offsetX, parent: shape.name, ports: [], fillColor: "transparent", borderColor: shape.borderColor, type: "node", labels: [{ margin: { left: 5, right: 5, top: 5, bottom: 5 } }], _isClassMember: true };
                for (var i = 0; i < shape.children.length; i++) {
                    if (i != 0 && shape.children[i].name.indexOf("_attribute") > -1 && editLabel[2].length > 0)
                        nodes.push({ name: shape.name + "_method" + "_classifier", labels: [{ text: editLabel[2], horizontalAlignment: "left", textAlign: "left", offset: { x: 0, y: 0.5 } }], constraints: constraints });
                    else if (i != 0 && shape.children[i].name.indexOf("_method") > -1 && editLabel[1].length > 0)
                        nodes.push({ name: shape.name + "_attribute" + "_classifier", labels: [{ text: editLabel[1], horizontalAlignment: "left", textAlign: "left", offset: { x: 0, y: 0.5 } }], constraints: constraints });
                }
                if (shape.children.length < 2) {
                    if (editLabel[1])
                        nodes.push({ name: shape.name + "_attribute" + "_classifier", labels: [{ text: editLabel[1], horizontalAlignment: "left", textAlign: "left", offset: { x: 0, y: 0.5 } }], constraints: constraints });
                    if (editLabel[2])
                        nodes.push({ name: shape.name + "_method" + "_classifier", labels: [{ text: editLabel[2], horizontalAlignment: "left", textAlign: "left", offset: { x: 0, y: 0.5 } }], constraints: constraints });
                }
                for (var j = 0; j < nodes.length; j++) {
                    nodes[j].labels[0] = $.extend(true, {}, shape.labels[0], nodes[j].labels[0]);
                    nodes[j] = ej.datavisualization.Diagram.Node($.extend(true, {}, defaultProperty, nodes[j]));
                    diagram._getNodeDimension(nodes[j], nodes[j].labels[0]);
                    nodes[j].offsetY += (shape.offsetY - shape.height / 2);
                    diagram.add(nodes[j]);
                    diagram.nameTable[nodes[j].name] = nodes[j];
                }
                if (shape.children[2] && shape.children[2].match("_attribute")) {
                    shape.children.splice(1, 0, shape.children[2]);
                    shape.children.pop();
                }
                if (typeof shape.children[1] == "string")
                    shape.children[1] = diagram.nameTable[shape.children[1]];
                if (typeof shape.children[2] == "string")
                    shape.children[2] = diagram.nameTable[shape.children[2]];
            }
            for (var i = 0; i < shape.children.length; i++) {
                if (shape.children.length == 1) {
                    if (shape["class"]) {
                        delete shape["class"].attributes;
                        delete shape["class"].methods;
                    }
                    if (shape["interface"]) {
                        delete shape["interface"].attributes;
                        delete shape["interface"].methods;
                    }
                    if (shape.enumeration)
                        delete shape.enumeration.members;
                }
                if (shape.children.length == 2) {
                    if (shape["class"]) {
                        if (shape.children[i].name.match("attribute"))
                            delete shape["class"].methods;
                        if (shape.children[i].name.match("method"))
                            delete shape["class"].attributes;
                    }
                    if (shape["interface"]) {
                        if (shape.children[i].name.match("attribute"))
                            delete shape["interface"].methods;
                        if (shape.children[i].name.match("method"))
                            delete shape["interface"].attributes;
                    }
                }
                this._updateClassNode(shape.children[i], shape);
            }
            return editBoxValue;
        },
        getUMLConnectorValue: function (shape, editBoxValue, label) {
            var available, option;
            if (label.name === shape.name + "_sourcelabel" || label.name === shape.name + "_targetlabel") {
                if (shape.shape.multiplicity.type == "onetoone" || shape.shape.multiplicity.type == "manytoone" || shape.shape.multiplicity.type == "onetomany") {
                    if (editBoxValue.length == 1 && (editBoxValue.indexOf("1") > -1 || editBoxValue.indexOf("*") > -1))
                        available = true;
                    option = false;
                    if ((label.name === shape.name + "_sourcelabel") && (shape.shape.multiplicity.type == "onetoone" || shape.shape.multiplicity.type == "onetomany")) {
                        editBoxValue = "1";
                        shape.shape.multiplicity = $.extend(true, {}, shape.shape.multiplicity, { source: { optional: option, lowerBounds: null, upperBounds: null } });
                    }
                    else if ((label.name === shape.name + "_targetlabel") && (shape.shape.multiplicity.type == "manytoone" || shape.shape.multiplicity.type == "onetoone")) {
                        editBoxValue = "1";
                        shape.shape.multiplicity = $.extend(true, {}, shape.shape.multiplicity, { target: { optional: option, lowerBounds: null, upperBounds: null } });
                    }
                }
                editBoxValue = this.umlConnectorEditBox(editBoxValue);
                if (editBoxValue.match(/\d\.{3}\d/g))
                    var text = editBoxValue.split("...");
                else if (!available) {
                    var labels = this.umlConnectorMultiplicity(shape);
                    if (label.name == shape.name + "_sourcelabel") {
                        var text = labels[0].text.split("...");
                        editBoxValue = labels[0].text;
                    }
                    else {
                        var text = labels[1].text.split("...");
                        editBoxValue = labels[1].text;
                    }
                }
                if (text) {
                    if (label.name == shape.name + "_sourcelabel")
                        shape.shape.multiplicity = $.extend(true, {}, shape.shape.multiplicity, { source: { optional: option, lowerBounds: text[0], upperBounds: text[1] } });
                    else
                        shape.shape.multiplicity = $.extend(true, {}, shape.shape.multiplicity, { target: { optional: option, lowerBounds: text[0], upperBounds: text[1] } });
                }
            }
            label.text = editBoxValue;
            return shape;
        },
        umlConnectorMultiplicity: function (options) {
            var labels = [], text, text1, sourceText, targetText, lower, upper;
            if (options.shape.multiplicity.source) {
                options.shape.multiplicity.source.lowerBounds = this.umlConnectorEditBox(options.shape.multiplicity.source.lowerBounds);
                options.shape.multiplicity.source.upperBounds = this.umlConnectorEditBox(options.shape.multiplicity.source.upperBounds);
            }
            if (options.shape.multiplicity.target) {
                options.shape.multiplicity.target.lowerBounds = this.umlConnectorEditBox(options.shape.multiplicity.target.lowerBounds);
                options.shape.multiplicity.target.upperBounds = this.umlConnectorEditBox(options.shape.multiplicity.target.upperBounds);
            }
            lower = options.shape.multiplicity.source;
            upper = options.shape.multiplicity.target;
            text = lower.upperBounds ? lower.lowerBounds + "..." + lower.upperBounds : lower.lowerBounds;
            text1 = upper.upperBounds ? upper.lowerBounds + "..." + upper.upperBounds : upper.lowerBounds;
            if (options.shape.multiplicity.type == "manytoone") {
                options.shape.multiplicity.target.optional = false;
                sourceText = text ? text : "*"; targetText = "1";
            }
            if (options.shape.multiplicity.type == "onetomany") {
                options.shape.multiplicity.source.optional = false;
                targetText = text1 ? text1 : "*"; sourceText = "1";
            }
            if (options.shape.multiplicity.type == "manytomany") {
                sourceText = text ? text : "*"; targetText = text1 ? text1 : "*";
            }
            if (options.shape.multiplicity.type == "onetoone") {
                options.shape.multiplicity.target.optional = false;
                options.shape.multiplicity.source.optional = false;
                sourceText = "1"; targetText = "1"
            }
            labels.push({ name: options.name + "_sourcelabel", text: sourceText, segmentOffset: 0, alignment: "before", margin: { left: 5, top: 5 } }, { name: options.name + "_targetlabel", text: targetText, segmentOffset: 1, alignment: "before", margin: { right: 5, bottom: 5 } });
            return labels;
        },
        umlConnectorEditBox: function (text) {
            if (typeof text == "string") {
                if (text.match(/[a-zA-Z]/g))
                    text = text.replace(/[a-zA-Z]/g, "");
            }
            return text;
        },
        EnableorDisableConnection: function (child, node, connector, diagram) {
            if (connector.shape) {
                if (connector.shape.type == "umlclassifier" && connector.shape.relationship != "association") {
                    if (connector.shape.relationship != "dependency" && connector.shape.relationship != "inheritance" && connector.shape.relationship != "realization") {
                        if (node && child) {
                            if (child["interface"] && node["class"])
                                child = null;
                        }
                    }
                    if (connector.shape.relationship == "dependency") {
                        if (node && child) {
                            if (child["class"] && node["interface"])
                                child = null;
                        }
                    }
                }
            }
            return child;
        },
        getClassifierNodeDimension: function (shape, diagram) {
            for (var i = 0; i < shape.children.length; i++)
                diagram._getNodeDimension(shape.children[i]);
            shape._height = 0;
            for (var i = 0; i < shape.children.length; i++) {
                var height = shape.children[i].height ? shape.children[i].height : shape.children[i]._height;
                shape.children[i].offsetY = shape._height + height / 2;
                shape._height += height;
                shape.height = shape._height;
            }
            var width = shape.children[0]._width;
            if (shape.children[1])
                var width = shape.children[0]._width > shape.children[1]._width ? shape.children[0]._width : shape.children[1]._width
            if (shape.children[2])
                width = shape.children[2]._width > width ? shape.children[2]._width : width;
            shape.children[0].width = width;
            if (shape.children[1])
                shape.children[1].width = width;
            if (shape.children[2])
                shape.children[2].width = width;
            shape.width = width;
            for (var j = 0; j < shape.children.length; j++)
                shape.children[j].offsetY += (shape.offsetY - shape.height / 2);
            diagram._updateAssociatedConnectorEnds(shape, diagram.nameTable);
            return shape;
        },
        _updateClassNode: function (node, parent) {
            if (node.name.match("_header")) {
                if (parent["class"]) parent["class"].name = node.labels[0].text;
                else if (parent["interface"]) parent["interface"].name = node.labels[0].text;
                else parent.enumeration.name = node.labels[0].text;
            }
            else {
                var type = node.name.match("_attribute") ? "attribute" : (node.name.match("_method") ? "method" : "member");
                var label = node.labels[0];
                var scopeValue, argument, classArgument = [], argumentText;
                var str = label.text.split("\n");
                var classMember = [], data, i;
                for (i = 0; i < str.length; i++) {
                    if (str[i].indexOf("+") > -1)
                        scopeValue = "public";
                    else if (str[i].indexOf("-") > -1)
                        scopeValue = "private";
                    else if (str[i].indexOf("#") > -1)
                        scopeValue = "protected";
                    else if (str[i].indexOf("~") > -1)
                        scopeValue = "package";
                    if (str[i].indexOf("+") > -1 || str[i].indexOf("-") > -1 || str[i].indexOf("#") > -1 || str[i].indexOf("~") > -1)
                        str[i] = str[i].replace(/[+|~|#|-]\s/g, "");
                    switch (type) {
                        case "attribute":
                            data = str[i].split(/:[ ]*/g);
                            classMember.push(ej.datavisualization.Diagram.ClassAttribute({ name: data[0], type: data[1], scope: scopeValue }));
                            break;
                        case "method":
                            argument = str[i].split(/["("|")"]/g);
                            for (var k = 0; k < argument.length; k++) {
                                if (argument[k].indexOf(",") > -1)
                                    data = argument[k].split(",");
                                if (k == argument.length - 1)
                                    argument[k] = argument[k].replace(/[:\s]|:/g, "");
                            }
                            if (data) {
                                for (var j = 0; j < data.length; j++) {
                                    argumentText = data[j].split(":");
                                    classArgument.push(ej.datavisualization.Diagram.ClassmethodArguments({ name: argumentText[0], type: argumentText[1] }))
                                }
                            }
                            if (argument.length == 3 && !data) {
                                if (argument[1].indexOf(":") > -1) {
                                    argumentText = argument[1].split(":");
                                    classArgument.push(ej.datavisualization.Diagram.ClassmethodArguments({ name: argumentText[0], type: argumentText[1] }))
                                }
                                else
                                    classArgument.push(ej.datavisualization.Diagram.ClassmethodArguments({ name: argument[1] }))
                            }
                            classMember.push(ej.datavisualization.Diagram.ClassMethod({ name: argument[0], arguments: classArgument, type: argument[argument.length - 1], scope: scopeValue }));
                            break;
                        case "member":
                            classMember.push(ej.datavisualization.Diagram.ClassMember({ name: str[i] }));
                            break;
                    }
                }
                if (type == "attribute") {
                    if (parent["class"])
                        parent["class"].attributes = classMember;
                    else if (parent["interface"])
                        parent["interface"].attributes = classMember;
                }
                else if (type == "method") {
                    if (parent["class"])
                        parent["class"].methods = classMember;
                    else if (parent["interface"])
                        parent["interface"].methods = classMember;
                }
                else parent.enumeration.members = classMember;
            }

        },

    }
    //#region Swimlane 
    ej.datavisualization.Diagram.SwimLaneContainerHelper = {
        //#region initDefaults
        _initSwimLane: function (diagram, node) {
            var node = ej.datavisualization.Diagram.SwimLane(node);
            node = this._initLaneCollection(diagram, node);
            this._swapPhaseSize(node);
            node = this._setPhaseMinValues(diagram, node);
            node = this._initPhaseCollection(diagram, node);

            return node;
        },
        _initLaneCollection: function (diagram, node) {
            if (node.lanes.length === 0)
                node.lanes = [ej.datavisualization.Diagram.Lane({ orientation: node.orientation })];
            for (var i = 0; i < node.lanes.length; i++) {
                node.lanes[i] = ej.datavisualization.Diagram.Lane(node.lanes[i]);
                node.lanes[i].container = { type: "canvas", orientation: node.orientation }
                node.lanes[i].borderColor = node.lanes[i].borderColor ? node.lanes[i].borderColor : "black",
                node.lanes[i].orientation = node.orientation ? node.orientation : "horizontal",
                node.lanes[i].horizontalAlign = node.orientation === "horizontal" ? "stretch" : "left",
                node.lanes[i].verticalAlign = node.orientation === "vertical" ? "stretch" : "top",
                node.lanes[i].addInfo = node.lanes[i].addInfo ? node.lanes[i].addInfo : {},
                node.lanes[i].fillColor = node.lanes[i].fillColor,
                node.lanes[i].paddingTop = 20,
                node.lanes[i].paddingRight = 20,
                node.lanes[i].paddingBottom = 20,
                node.lanes[i].paddingLeft = 20,
                node.lanes[i].constraints = node.lanes[i].constraints ? node.lanes[i].constraints | ej.datavisualization.Diagram.NodeConstraints.AllowDrop : (ej.datavisualization.Diagram.NodeConstraints.Default | ej.datavisualization.Diagram.NodeConstraints.AllowDrop & ~ej.datavisualization.Diagram.NodeConstraints.Connect),
                node.lanes[i].cssClass = node.lanes[i].cssClass,
                node.lanes[i]._laneHeader = node.lanes[i]._laneHeader ? node.lanes[i]._laneHeader : null

                if (node.lanes[i].labels && node.lanes[i].labels.length > 0) {
                    for (var h = 0; h < node.lanes[i].labels.length; h++) {
                        node.lanes[i].labels[h] = ej.datavisualization.Diagram.Label(node.lanes[i].labels[h]);
                    }
                }
                var laneHeader = node.lanes[i]._laneHeader = node.lanes[i]._laneHeader ? node.lanes[i]._laneHeader : node.lanes[i].header
                var header = this._initLaneHeader(diagram, node.lanes[i], laneHeader, node);
                node.lanes[i].children.splice(0, 0, header);

            }
            return node;
        },
        _initLaneHeader: function (diagram, lane, laneHeader, node) {
            var headObj = lane.header;
            var nodeOrientation = node.orientation;
            if (nodeOrientation === "horizontal") {
                var hAlign = "left";
                var vAlign = "stretch";
                headObj.rotateAngle = 270;
            }
            else {
                hAlign = "stretch";
                vAlign = "top";
                headObj.rotateAngle = 0;
            }

            var node = ej.datavisualization.Diagram.Node({
                _hidePorts: true,
                _isHeader: true,
                name: (diagram._isUndo && laneHeader.name) ? laneHeader.name : lane.name + "_Headerr_",
                type: "node",
                labels: [headObj],
                height: laneHeader.height ? laneHeader.height : 50,
                width: laneHeader.width ? laneHeader.width : 50,
                fillColor: headObj.fillColor ? headObj.fillColor : "white",
                rotateAngle: 0,
                horizontalAlign: hAlign,
                verticalAlign: vAlign,
                constraints: ej.datavisualization.Diagram.NodeConstraints.Default ^ ej.datavisualization.Diagram.NodeConstraints.Select ^ ej.datavisualization.Diagram.NodeConstraints.Connect,
                marginLeft: -20,
                marginTop: -20,
                marginRight: -20,
                marginBottom: -20,
            });
            if (headObj && headObj._labelName && diagram._isUndo)
                node.labels[0].name = headObj._labelName;
            else
                node.labels[0].name = node.name + "_label";
            return node;
        },
        _initPhaseCollection: function (diagram, node) {
            var offY = 0, offX = 0;
            if (node.phases.length === 0)
                node.phases = [ej.datavisualization.Diagram.Phase({ orientation: node.orientation })];
            for (var i = 0; i < node.phases.length; i++) {
                node.phases[i]._UndoRedo = diagram._UndoRedo;
                node.phases[i]._isUndo = diagram._isUndo;
                node.phases[i] = ej.datavisualization.Diagram.Phase(node.phases[i]);
                node.phases[i].isPhase = true;
                node.phases[i]._hidePorts = true,
                node.phases[i].constraints = ej.datavisualization.Diagram.NodeConstraints.Default ^ ej.datavisualization.Diagram.NodeConstraints.Select ^ ej.datavisualization.Diagram.NodeConstraints.Connect,
                node.phases[i].parent = "";
                node.phases[i]._isHeader = true;
                node.phases[i]._type = "node";
                //node.phases[i].fillColor = 'blue';
                node.phases[i].orientation = node.orientation;
                if (!diagram._isLoad) {
                    if (node.phases[i].label && node.phaseSize != 0) {
                        node.phases[i].label.rotateAngle = node.orientation === "vertical" ? 270 : 0;
                        node.phases[i].labels = [node.phases[i].label];
                    }
                }
                else {
                    if (node.phases[i].labels && node.phases[i].labels.length > 0) {
                        node.phases[i].label = [node.phases[i].labels[0]]
                    }
                }
                if (node.orientation === "horizontal") {
                    //node.phases[i].verticalAlign = "stretch";
                    node.phases[i].width = node.phases[i].offset - offX;
                    node.phases[i].height = node.phaseSize;
                    offX = node.phases[i].offset;
                }
                else {
                    //node.phases[i].horizontalAlign = "stretch";
                    node.phases[i].height = node.phases[i].offset - offY;
                    node.phases[i].width = node.phaseSize;
                    offY = node.phases[i].offset;
                }
            }

            return node;
        },
        _setPhaseMinValues: function (diagram, node) {
            var cphase, fphase;
            fphase = node.phases[0];
            if (fphase) {
                if (fphase.offset < 70)
                    fphase.offset = 70;
                for (var i = 1; i < node.phases.length; i++) {
                    cphase = node.phases[i];
                    fphase = node.phases[i - 1];
                    if (fphase.offset + 20 >= cphase.offset)
                        cphase.offset = fphase.offset + 20;
                }
            }
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
        _setLastPhaseSize: function (obj) {
            if (obj.phases.length > 0) {
                var lastPhase = obj.phases[obj.phases.length - 1];
                if (obj.orientation === "horizontal")
                    lastPhase.offset = obj.width;
                else
                    lastPhase.offset = obj.height;
            }
        },
        //#endregion

        //#region create
        _createSwimlane: function (diagram, node) {
            var header = this._createSwimlaneHeader(diagram, node);

            var stackOrientation = (node.orientation === "horizontal") ? "vertical" : "horizontal";
            var nodeOrientation = node.orientation;

            if (nodeOrientation === "horizontal") {
                var marginTop = Math.round(header.height + node.phaseSize);
                var marginLeft = 0;
            }
            else {
                marginTop = header.height;
                marginLeft = Math.round(node.phaseSize);
            }


            var phaseStack = {
                name: node.name + "phaseStack",
                isPhaseStack: true,
                container: { type: "stack", orientation: nodeOrientation },
                minHeight: 10,
                minWidth: 10,
                children: node.phases,
                marginTop: header.height,
                constraints: ej.datavisualization.Diagram.NodeConstraints.Default ^ ej.datavisualization.Diagram.NodeConstraints.Select ^ ej.datavisualization.Diagram.NodeConstraints.Connect & ~ej.datavisualization.Diagram.NodeConstraints.AllowDrop
                //verticalAlign: nodeOrientation === "vertical" ? "stretch" : "top",
                //horizontalAlign: nodeOrientation === "horizontal" ? "stretch" : "left",
            };
            var laneStack = {
                name: node.name + "laneStack",
                isLaneStack: true,
                container: { type: "stack", orientation: stackOrientation },
                children: node.lanes,
                marginTop: marginTop,
                marginLeft: marginLeft,
                verticalAlign: "stretch",
                horizontalAlign: "stretch",
                constraints: (ej.datavisualization.Diagram.NodeConstraints.Default | ej.datavisualization.Diagram.NodeConstraints.AllowDrop) & ~ej.datavisualization.Diagram.NodeConstraints.Connect
            };
            var swimlane = {
                _hidePorts: true,
                name: node.name,
                container: { type: "canvas" },
                children: [
                    header,
                    //phaseStack,
                    laneStack
                ],
                addInfo: node.addInfo ? node.addInfo : null,
                paletteItem: node.paletteItem ? node.paletteItem : null,
                constraints: node.constraints,
                cssClass: node.cssClass,
                offsetX: node.offsetX ? node.offsetX : 100,
                offsetY: node.offsetY ? node.offsetY : 100,
                orientation: node.orientation,
                phaseSize: node.phaseSize,
                isSwimlane: true,
                height: node.height ? node.height : 100,
                width: node.width ? node.width : 100,
            };

            swimlane.offsetX = node.offsetX ? node.offsetX : 100;
            swimlane.offsetY = node.offsetY ? node.offsetY : 100;
            //#region temp
            var cloneObj = ej.datavisualization.Diagram.containerCommon._cloneObject(diagram, swimlane, ej.datavisualization.Diagram.Util.randomId());
            cloneObj = ej.datavisualization.Diagram.ContainerHelper._initContainer(diagram, cloneObj);
            var cloneObjBounds = ej.datavisualization.Diagram.Util.bounds(cloneObj);

            cloneObjBounds = this._setSwimlaneSize(diagram, swimlane, cloneObjBounds);

            ej.datavisualization.Diagram.containerCommon._removeObject(diagram, cloneObj);
            //#endregion

            if (nodeOrientation === "horizontal") {
                phaseStack.maxHeight = node.phaseSize;
                phaseStack.minWidth = 10;
            }
            else {
                phaseStack.minHeight = 10;
                phaseStack.maxWidth = node.phaseSize;
            }
            swimlane.children.splice(1, 0, phaseStack);
            this._setPhaseValues(diagram, swimlane, cloneObjBounds);
            var canvas = ej.datavisualization.Diagram.ContainerHelper._initContainer(diagram, swimlane);
            return canvas;
        },
        _setSwimlaneSize: function (diagram, swimlane, cloneBounds) {
            if (swimlane.orientation === "horizontal") {
                if (swimlane.width > cloneBounds.width) {
                    var lanes = swimlane.children[1].children;
                    for (var i = 0; i < lanes.length; i++) {
                        lanes[i].minWidth = swimlane.width;
                    }
                    cloneBounds.width = swimlane.width;
                }

                if (swimlane.height > cloneBounds.height) {
                    var lanes = swimlane.children[1].children;
                    var lastLane = lanes[lanes.length - 1];
                    lastLane.minHeight += swimlane.height - cloneBounds.height;
                    cloneBounds.height = swimlane.height;
                }
            }
            else {
                if (swimlane.width > cloneBounds.width) {
                    var lanes = swimlane.children[1].children;
                    var lastLane = lanes[lanes.length - 1];
                    lastLane.minWidth += swimlane.width - cloneBounds.width;
                    cloneBounds.height = swimlane.height;
                }


                if (swimlane.height > cloneBounds.height) {
                    var lanes = swimlane.children[1].children;
                    for (var i = 0; i < lanes.length; i++) {
                        lanes[i].minHeight = swimlane.height - (2 * swimlane.children[0].height);
                    }
                    cloneBounds.height = swimlane.height;
                }
            }
            return cloneBounds;
        },
        _setPhaseValues: function (diagram, swimlane, bounds) {
            var phases = swimlane.children[1].children;
            var lastPhase = phases[phases.length - 1];
            var orientation = swimlane.orientation;
            if (orientation === "horizontal") {
                if (lastPhase.offset <= bounds.width) {
                    if (phases.length == 1) {
                        lastPhase.offset = bounds.width;
                        lastPhase.width = bounds.width;
                    }
                    else {
                        var prevPhase = phases[phases.indexOf(lastPhase) - 1];
                        lastPhase.offset = bounds.width;
                        lastPhase.width = bounds.width - prevPhase.offset;
                    }

                    var lanes = swimlane.children[2].children;
                    for (var i = 0; i < lanes.length; i++) {
                        lanes[i].minWidth = lastPhase.offset;
                    }
                }
                else {
                    var maxOffset = 0;
                    for (var i = 0; i < phases.length; i++) {
                        if (phases[i].offset >= maxOffset) {
                            maxOffset = phases[i].offset;
                        }
                    }
                    var lanes = swimlane.children[2].children;
                    for (var i = 0; i < lanes.length; i++) {
                        lanes[i].minWidth = maxOffset;
                    }
                }
            }
            else {
                var header = swimlane.children[0];
                if (lastPhase.offset <= bounds.height - header.height) {
                    if (phases.length == 1) {
                        lastPhase.offset = bounds.height - header.height;
                        lastPhase.height = lastPhase.offset;
                    }
                    else {
                        var prevPhase = phases[phases.indexOf(lastPhase) - 1];
                        lastPhase.offset = bounds.height - header.height;
                        lastPhase.height = bounds.height - prevPhase.offset - header.height;
                    }

                    var lanes = swimlane.children[2].children;
                    for (var i = 0; i < lanes.length; i++) {
                        lanes[i].minHeight = lastPhase.offset;
                    }
                }
                else {
                    var maxOffset = 0;
                    for (var i = 0; i < phases.length; i++) {
                        if (phases[i].offset >= maxOffset) {
                            maxOffset = phases[i].offset;
                        }
                    }
                    var lanes = swimlane.children[2].children;
                    for (var i = 0; i < lanes.length; i++) {
                        lanes[i].minHeight = maxOffset;
                    }
                }
            }

        },
        _createSwimlaneHeader: function (diagram, node) {
            var headObj = node.header;
            var laneHeader = node.lanes[0]._laneHeader ? node.lanes[0]._laneHeader : null;
            headObj.name = node.name + "_header_swimlane" + "_label"
            var header = ej.datavisualization.Diagram.Node({
                _type: "node",
                _hidePorts: true,
                _isHeader: true,
                name: node.name + "_header_swimlane",
                labels: [headObj],
                height: headObj.height != undefined ? headObj.height : 50,
                width: headObj.width != undefined ? headObj.width : 50,
                fillColor: node.header.fillColor ? node.header.fillColor : (laneHeader ? laneHeader.fillColor : "white"), // laneHeader ? laneHeader.fillColor : node.header.fillColor ? node.header.fillColor : "white",
                rotateAngle: 0,
                constraints: ej.datavisualization.Diagram.NodeConstraints.Default ^ ej.datavisualization.Diagram.NodeConstraints.Select ^ ej.datavisualization.Diagram.NodeConstraints.Connect,
                horizontalAlign: "stretch",
                parent: node.name,
            });
            header.labels[0].fillColor = "transparent";
            if (diagram._isLoad) {
                header.fillColor = node.header.fillColor;
            }
            return header;
        },
        //#endregion

        //#region update
        _updateSwimlane: function (diagram, node) {
            this._updateLaneStack(diagram, node);
            this._updatePhaseStack(diagram, node);
            ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, node);
        },
        _updateLaneStack: function (diagram, swimlane) {
            var lanes = this.getLanes(diagram, swimlane), lane;
            for (var i = 0; i < lanes.length; i++) {
                lane = diagram.nameTable[diagram._getChild(lanes[i])];
                if (lane) {
                    for (var j = 1; j < lane.children.length; j++) {
                        var child = typeof lane.children[j] == "string" ? diagram.nameTable[lane.children[j]] : lane.children[j];
                        child.marginBottom = child.marginRight = 0;
                    }
                    this._updateLane(diagram, lane);
                }
            }
        },
        _updatePhaseStack: function (diagram, swimlane) {
            var PhaseStack = diagram.nameTable[diagram._getChild(swimlane.children[1])];
            ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, PhaseStack);
        },
        _updateLane: function (diagram, node) {
            ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, node);
        },

        //#endregion 

        //#region helper
        getPhases: function (diagram, swimlane, childTable) {
            if (swimlane) {
                if (swimlane.children[1])
                    var phaseStack = childTable ? childTable[diagram._getChild(swimlane.children[1])] : diagram.nameTable[diagram._getChild(swimlane.children[1])];
                if (phaseStack) {
                    var phases = diagram._getChildren(phaseStack.children);
                    if (phases && phases.length > 0) {
                        return phases;
                    }
                }

            }
        },
        getLanes: function (diagram, swimlane) {
            if (swimlane && swimlane.isSwimlane && swimlane.children[2])
                var laneStack = diagram.nameTable[diagram._getChild(swimlane.children[2])];
            if (laneStack) {
                var lanes = laneStack.children;
                if (lanes && lanes.length > 0) {
                    return lanes;
                }
            }


        },

        _updateLanesMinValue: function (diagram, swimlane, prop, value) {
            var lanes = this.getLanes(diagram, swimlane), lane;
            for (var i = 0; i < lanes.length; i++) {
                lane = diagram.nameTable[diagram._getChild(lanes[i])];
                if (lane) {
                    lane[prop] = value;
                }
            }
        },
        _resizeLastPhase: function (diagram, swimlane) {
        },
        _getPhaseBounds: function (diagram, phase) {
            var bounds = null, group, phaseBounds, prevOffset, left = 0, right = 0, top = 0, bottom = 0;
            if (phase && phase.type == "phase" && phase.parent) {
                var prevPhase = this._getPrevPhase(diagram, phase);
                var nextPhase = this._getNextPhase(diagram, phase)
                group = diagram.nameTable[phase.parent.split("phaseStack")[0]];
                if (group && group.orientation) {
                    bounds = ej.datavisualization.Diagram.Util.bounds(group)
                    if (group.orientation == "horizontal") {
                        prevOffset = this._getPrevOffset(diagram, phase, prevPhase, nextPhase, group, bounds);
                        if (prevPhase && prevPhase.name === phase.name) {
                            left = prevOffset.left + bounds.left;
                            right = left + (phase.offset - left - prevOffset.left);
                        }
                        else {
                            if (prevPhase)
                                left = bounds.left + prevPhase.offset;
                            right = (phase.offset - left + bounds.left);
                        }
                        top = prevOffset.top + bounds.top;
                        bottom = bounds.bottom - top;
                        phaseBounds = ej.datavisualization.Diagram.Rectangle(left, top, right, bottom);
                    }
                    else {
                        prevOffset = this._getPrevOffset(diagram, phase, prevPhase, nextPhase, group, bounds);
                        if (prevPhase === phase) {

                            left = prevOffset.left + bounds.left;
                            bottom = phase.offset + top;

                            top = prevOffset.top + bounds.top;
                        }
                        else {
                            var head = diagram.nameTable[diagram._getChild(group.children[0])];

                            var headHeight = head ? head.height : 0;
                            left = prevOffset.left + bounds.left;
                            if (prevPhase)
                                top = (prevPhase.offset + bounds.top) + headHeight;
                            bottom = bounds.top + phase.offset - top + headHeight;
                        }
                        right = bounds.right - left;
                        phaseBounds = ej.datavisualization.Diagram.Rectangle(left, top, right, bottom);
                    }
                }
            }
            return phaseBounds;
        },
        _getPrevPhase: function (diagram, phase) {
            var prevPhase = null, index;
            var group = diagram.nameTable[phase.parent.split("phaseStack")[0]];
            var phases = ej.datavisualization.Diagram.SwimLaneContainerHelper.getPhases(diagram, group);
            if (group && phases && phases.length > 0) {
                index = this._getPhaseIndex(diagram, phase.name);
                if (index === 0)
                    prevPhase = diagram.nameTable[diagram._getChild(phases[0])];
                else
                    prevPhase = diagram.nameTable[diagram._getChild(phases[index - 1])];
            }
            return prevPhase;
        },
        _getPrevOffset: function (diagram, phase, prevPhase, nextPhase, parent, parentBounds) {
            var stckHeadWidth = 50, stack, firstCanvas, dleft = 0, dtop = 0;
            if (parent.children[0]) {
                var head = diagram.nameTable[diagram._getChild(parent.children[0])];
                if (head) {
                    dtop = head.height;
                }
            }
            if (parent.orientation == "horizontal") {
                if (parent.children[2])
                    stack = diagram.nameTable[diagram._getChild(parent.children[2])];
                if (stack && stack.children && stack.children.length > 0) {
                    firstCanvas = diagram.nameTable[diagram._getChild(stack.children[0])];
                    if (firstCanvas && firstCanvas.children && firstCanvas.children.length > 0) {
                        var _firstchild = diagram.nameTable[diagram._getChild(firstCanvas.children[0])]
                        if (_firstchild && _firstchild.name.indexOf("_Headerr") != -1) {
                            dleft = _firstchild.width;
                        }
                    }
                }
            }
            return { left: dleft, top: dtop };
        },
        _getNextPhase: function (diagram, phase) {
            var nxtPhase = null, index;
            var group = diagram.nameTable[phase.parent.split("phaseStack")[0]];
            var phases = ej.datavisualization.Diagram.SwimLaneContainerHelper.getPhases(diagram, group);
            if (group && phases && phases.length > 0) {
                index = diagram._getPhaseIndex(phase.name);
                if (index === phases.length - 1)
                    nxtPhase = diagram.nameTable[diagram._getChild(phases[index])];
                else
                    nxtPhase = diagram.nameTable[diagram._getChild(phases[index + 1])];
            }
            return nxtPhase;
        },
        _getPhaseIndex: function (diagram, name) {
            var phase, group, index = -1;
            phase = diagram.nameTable[name];
            if (phase && phase.parent) {
                group = diagram.nameTable[phase.parent.split("phaseStack")[0]];
                var phases = ej.datavisualization.Diagram.SwimLaneContainerHelper.getPhases(diagram, group);
                if (phases && phases.length > 0) {
                    index = phases.indexOf(name);
                }
            }
            return index;
        },
        _cloneLaneObj: function (diagram, obj, name, childTable) {
            var nameTable = childTable ? childTable : diagram.nameTable;
            obj = $.extend(true, {}, obj);
            var children = obj.children;
            if (children && children.length > 0) {
                for (var m = 0; m < children.length; m++) {
                    var child = nameTable[diagram._getChild(children[m])];
                    if (child) {
                        child = jQuery.extend(true, {}, child);
                        if (child && child.children && child.children.length) {
                            child = diagram._cloneLaneObj(child, name, childTable);
                        }
                        child.name += name;
                        child.parent = name;
                        obj.children[m] = child;
                        if (childTable)
                            diagram._preserveConnection(childTable, child);
                    }
                }
            }
            if (obj && obj.header) {
                obj.header.name += name;
            }
            obj.name += name;
            return obj;
        },
        _cloneSwimlaneObj: function (diagram, obj, name, data) {
            obj = $.extend(true, {}, obj);
            if (obj && obj.isSwimlane) {
                obj = jQuery.extend(true, {}, obj);
                obj.name += name;
                //update lanes
                if (obj.lanes && obj.lanes.length > 0) {
                    for (var i = 0; i < obj.lanes.length; i++) {
                        if (obj.lanes[i]) {
                            obj.lanes[i] = diagram._cloneLaneObj(obj.lanes[i], name, (data && data.childTable) ? data.childTable : null);
                        }
                    }
                }
                //update phases
                if (obj.phases && obj.phases.length > 0) {
                    for (var i = 0; i < obj.phases.length; i++) {
                        if (obj.phases[i]) {
                            obj.phases[i].name += name;
                            obj.phases[i].parent = "";
                        }
                    }
                }
            }
            return obj;
        },
        _pasteSwimlaneObj: function (diagram, node, data) {
            node = diagram._pasteSwimlane(node, data);
            if (node) {
                var dx = diagram._isUndo ? 0 : (diagram._pasteIndex * 10);
                diagram._translate(node, dx, dx, diagram.nameTable);
                ej.datavisualization.Diagram.DiagramContext.update(node, diagram);
            }
            return node;
        },
        _pasteSwimlane: function (diagram, node, data, mSelection, x) {
            diagram._pasteObj = true;
            if (node && node.isSwimlane) {
                var dx = diagram._isUndo ? 0 : diagram._pasteIndex * 10;
                var cloneObj = diagram._cloneSwimlaneObj(diagram._getNode(node.name, data ? data.childTable : null), diagram._swimlanePaste ? "" : ej.datavisualization.Diagram.Util.randomId(), data);
                cloneObj = ej.datavisualization.Diagram.ContainerHelper._initContainer(diagram, cloneObj, data);
                if (diagram._outOfBoundsOnNudge(cloneObj, dx, dx)) {
                    diagram.add(cloneObj);
                }
                else {
                    ej.datavisualization.Diagram.containerCommon._removeObject(diagram, cloneObj);
                    return null
                };
                diagram._pasteObj = false;
                return cloneObj;
            }
        },
        _updateNextPhase: function (diagram, swimlane, dif, index) {
            var phases = ej.datavisualization.Diagram.SwimLaneContainerHelper.getPhases(diagram, swimlane), phase;
            for (var i = index + 1; i < phases.length; i++) {
                phase = diagram.nameTable[diagram._getChild(phases[i])];
                if (phase) {
                    phase.offset += dif;
                }
            }
        },
        _getOuterNodes: function (diagram, swimlane, x, y) {
            var outerNodes = [];
            var lanes = ej.datavisualization.Diagram.SwimLaneContainerHelper.getLanes(diagram, swimlane);
            var prop = swimlane.orientation === "horizontal" ? "left" : "top";
            var value = swimlane.orientation === "horizontal" ? x : y;
            for (var i = 0; i < lanes.length; i++) {
                var lane = diagram.nameTable[diagram._getChild(lanes[i])];
                if (lane && lane.children.length > 1) {
                    for (var j = 0; j < lane.children.length; j++) {
                        var child = diagram.nameTable[diagram._getChild(lane.children[j])];
                        if (child) {
                            var childBounds = ej.datavisualization.Diagram.Util.bounds(child);
                            if (childBounds[prop] > value)
                                outerNodes.push(child);
                        }
                    }
                }
            }
            return outerNodes;
        },
        _getInnerNodes: function (diagram, swimlane, value1, value2) {
            var innerNodes = [];
            var lanes = ej.datavisualization.Diagram.SwimLaneContainerHelper.getLanes(diagram, swimlane);
            var prop1 = swimlane.orientation === "horizontal" ? "left" : "top";
            var prop2 = swimlane.orientation === "horizontal" ? "right" : "bottom";
            for (var i = 0; i < lanes.length; i++) {
                var lane = diagram.nameTable[diagram._getChild(lanes[i])];
                if (lane && lane.children.length > 1) {
                    for (var j = 0; j < lane.children.length; j++) {
                        var child = diagram.nameTable[diagram._getChild(lane.children[j])];
                        if (child) {
                            var bounds = ej.datavisualization.Diagram.Util.bounds(child);
                            if (bounds[prop1] >= value1 && bounds[prop2] <= value2)
                                innerNodes.push(child);
                        }
                    }
                }
            }
            return innerNodes;
        },
        _moveOuterNodes: function (diagram, swimlane, dif, index) {
            var phases = ej.datavisualization.Diagram.SwimLaneContainerHelper.getPhases(diagram, swimlane);
            var phase = diagram.nameTable[diagram._getChild(phases[index])];
            var bounds = ej.datavisualization.Diagram.Util.bounds(swimlane);
            var swimlaneHeader = diagram.nameTable[diagram._getChild(swimlane.children[0])];
            var x = bounds.left + phase.offset;
            var y = bounds.top + phase.offset + swimlaneHeader.height;

            var prop = swimlane.orientation === "horizontal" ? "offsetX" : "offsetY";
            var value = swimlane.orientation === "horizontal" ? x : y;
            var margin = swimlane.orientation === "horizontal" ? "marginLeft" : "marginTop";
            var nodes = diagram._getOuterNodes(swimlane, x, y);

            if (nodes && nodes.length > 0) {
                for (var i = 0; i < nodes.length; i++) {
                    var child = diagram.nameTable[diagram._getChild(nodes[i])];
                    //child[prop] += dif;
                    diagram._translate(child, (prop === "offsetX" ? dif : 0), (prop === "offsetY" ? dif : 0), diagram.nameTable);
                    child[margin] += dif;
                }
            }
        },
        _moveOnPhaseChange: function (diagram, phase, dif, index) {
            var lane;
            var swimlaneName = phase.parent.split('phaseStack')[0];
            if (swimlaneName)
                var swimlane = diagram.nameTable[swimlaneName];
            if (swimlane) {
                var lanes = ej.datavisualization.Diagram.SwimLaneContainerHelper.getLanes(diagram, swimlane);
                var swimlaneHeader = diagram.nameTable[diagram._getChild(swimlane.children[0])];
                for (var i = 0; i < lanes.length; i++) {
                    lane = diagram.nameTable[diagram._getChild(lanes[i])];
                    if (lane) {
                        if (phase.orientation === "horizontal") {
                            lane.width += dif;
                            lane.minWidth = lane.width;
                        }
                        else {
                            lane.height += dif;
                            lane.minHeight = lane.height
                        }
                    }
                }
                if (phase.orientation === "horizontal") {
                    swimlane.minWidth += dif;
                }
                else {
                    swimlane.minHeight = lane.height
                }
                //diagram._updateNextPhase(swimlane, dif, index);
                //diagram._moveOuterNoder(swimlane, dif, index);
                ej.datavisualization.Diagram.SwimLaneContainerHelper._updateSwimlane(diagram, swimlane);
            }
        },
        _getPhaseDifferece: function (diagram, swimlane, index, difference) {
            var phases = ej.datavisualization.Diagram.SwimLaneContainerHelper.getPhases(diagram, swimlane);
            var phase = diagram.nameTable[diagram._getChild(phases[index])];
            var swimlaneBounds = ej.datavisualization.Diagram.Util.bounds(swimlane);
            var prop = swimlane.orientation === "horizontal" ? "left" : "top";
            var swimlaneHeader = diagram.nameTable[diagram._getChild(swimlane.children[0])], head = 0;
            if (swimlane.orientation === "vertical")
                head = swimlaneHeader.height;
            if (index === 0) {
                var innerNodes = diagram._getInnerNodes(swimlane, swimlaneBounds[prop] + head, swimlaneBounds[prop] + phase.offset + head)
                if (innerNodes && innerNodes.length > 0) {
                    var pseudoGroup = ej.datavisualization.Diagram.Group({ "name": "multipleSelection", type: "pseudoGroup", children: innerNodes });
                    ej.datavisualization.Diagram.Util._updateGroupBounds(pseudoGroup, diagram);
                    var bounds = ej.datavisualization.Diagram.Util.bounds(pseudoGroup);
                }
                else {
                    var bounds = ej.datavisualization.Diagram.Util.bounds();
                    bounds.right = swimlaneBounds.left + 50;
                }
                if (swimlane.orientation === "horizontal") {
                    if (swimlaneBounds.left + (phase.offset + difference) >= bounds.right + 20) {
                    }
                    else {
                        var temp = (bounds.right + 20) - (swimlaneBounds.left + (phase.offset + difference));
                        difference = difference + temp;
                    }
                    if (phase.offset + difference < 100)
                        difference = 0;
                }
                else {
                    if (swimlaneBounds.top + swimlaneHeader.height + (phase.offset + difference) >= bounds.bottom + 20) {
                    }
                    else {
                        var temp = (bounds.bottom + 20) - (swimlaneBounds.top + head + (phase.offset + difference));
                        difference = difference + temp;
                    }
                    if (phase.offset + difference < 100)
                        difference = 0;
                }
            }
            else {
                var prevPhase = diagram.nameTable[diagram._getChild(phases[index - 1])];
                var innerNodes = diagram._getInnerNodes(swimlane, swimlaneBounds[prop] + prevPhase.offset + head, swimlaneBounds[prop] + phase.offset + head)
                if (innerNodes && innerNodes.length > 0) {
                    var pseudoGroup = ej.datavisualization.Diagram.Group({ "name": "multipleSelection", type: "pseudoGroup", children: innerNodes });
                    ej.datavisualization.Diagram.Util._updateGroupBounds(pseudoGroup, diagram);
                    var bounds = ej.datavisualization.Diagram.Util.bounds(pseudoGroup);
                }
                else {
                    bounds = ej.datavisualization.Diagram.Util.bounds();
                    bounds.bottom = swimlaneBounds.top + swimlaneHeader.height + prevPhase.offset;
                }
                if (swimlane.orientation === "horizontal") {
                    if (swimlaneBounds.left + (phase.offset + difference) >= bounds.right + 20) {
                    }
                    else {
                        var temp = (bounds.right + 20) - (swimlaneBounds.left + (phase.offset + difference));
                        difference = difference + temp;
                    }
                }
                else {
                    if (swimlaneBounds.top + swimlaneHeader.height + (phase.offset + difference) >= bounds.bottom + 20) {
                    }
                    else {
                        var temp = (bounds.bottom + 20) - (swimlaneBounds.top + swimlaneHeader.height + (phase.offset + difference));
                        difference = difference + temp;
                    }
                }
            }
            if (prevPhase && phase.offset - prevPhase.offset + difference < 20) {
                difference -= (phase.offset - prevPhase.offset + difference - 20);
            }
            return difference;
        },
        //#endregion
    };

    ej.datavisualization.Diagram.ContainerHelper = {
        _initContainer: function (diagram, node, data) {
            if (node.container) {
                switch (node.container.type) {
                    default:
                    case "canvas":
                        node = ej.datavisualization.Diagram.canvasHelper._initCanvas(diagram, node);
                        if (node.type == "bpmn") {
                            var parent = ej.datavisualization.Diagram.ContainerHelper.updateparent(node, diagram);
                            if (!parent)
                                ej.datavisualization.Diagram.bpmnHelper.updateCanvas(node, diagram);
                        }
                        break;
                    case "stack":
                        node = ej.datavisualization.Diagram.stackHelper._initStack(diagram, node);
                        break;
                }
            }
            else if (node.type === "swimlane" || node.isSwimlane) {
                node = ej.datavisualization.Diagram.SwimLaneContainerHelper._initSwimLane(diagram, node);
                node = ej.datavisualization.Diagram.SwimLaneContainerHelper._createSwimlane(diagram, node);
            }
            return node;
        },
        _add: function (diagram, node) {
            var parent;
            if (diagram.getObjectType(node) !== "connector") {
                parent = (node.parent) ? diagram.nameTable[node.parent] : null;
                if (parent && parent.container) {
                    for (var i = parent.children.length - 1; i >= 0; i--) {
                        var child = diagram.nameTable[diagram._getChild(parent.children[i])];
                        if (child.name === node.name)
                            ej.datavisualization.Diagram.Util.removeChildFromGroup(parent.children, parent.children[i]);
                    }
                    var cause = diagram._isUndo ? ej.datavisualization.Diagram.GroupChangeCause.HistoryChange : ej.datavisualization.Diagram.GroupChangeCause.Drop;
                    if (diagram._isLaneApi)
                        cause = ej.datavisualization.Diagram.GroupChangeCause.Unknown;

                    diagram._raiseGroupChangeEvent(node, null, parent, cause);
                    parent.children.push(node);
                    diagram._disableSwimlaneUptate = true;
                    ej.datavisualization.Diagram.canvasHelper._disableConnectorUpdate(diagram);
                    var prevObj = $.extend(true, {}, parent)
                    this._updateCollectionChange(diagram, parent, true);
                    ej.datavisualization.Diagram.canvasHelper._updateAddRemoveNodeConnectors(diagram, parent, prevObj);
                    delete diagram._disableSwimlaneUptate
                    ej.datavisualization.Diagram.canvasHelper._updateLastSwimlanePhase(diagram, node);
                    var parentObj = diagram._svg.document.getElementById(node.parent);
                    if (node._type === "group")
                        ej.datavisualization.Diagram.DiagramContext.renderGroup(node, diagram, parentObj);
                    else
                        ej.datavisualization.Diagram.DiagramContext.renderNode(node, diagram, parentObj);
                    ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdateNode(diagram, node);
                }
            }
        },
        updateparent: function (node, diagram) {
            var temp = node;
            if (diagram) {
                while (temp && temp.parent) {
                    temp = diagram.nameTable[temp.parent]
                    if (temp && temp.isLane)
                        return temp;
                }
            }
            return false;
        },
        _updateCollectionChange: function (diagram, node, updateOffset, parent) {
            if (!diagram._diagramClear) {
                var oldXY, currXY, update = true;
                if (node) {
                    var oldBounds = ej.datavisualization.Diagram.Util.bounds(node);
                    oldXY = { x: oldBounds.x, y: oldBounds.y };
                    if (node.container) {
                        if (node.container.type === "canvas") {
                            if (node._isBpmn) {
                                var parent = this.updateparent(node, diagram);
                                if (!parent) ej.datavisualization.Diagram.bpmnHelper.updateCanvas(node, diagram);
                                else ej.datavisualization.Diagram.canvasHelper._updateCollectionChange(diagram, node);
                            }
                            else ej.datavisualization.Diagram.canvasHelper._updateCollectionChange(diagram, node);
                        }
                        else
                            ej.datavisualization.Diagram.stackHelper._updateCollectionChange(diagram, node, null, parent);
                    }
                    if ((updateOffset && !node.isLane && !node._isBpmn) || node.isSwimlane) {
                        if (diagram._disableSwimlaneUptate)
                            update = false;
                        var currBounds = ej.datavisualization.Diagram.Util.bounds(node);
                        currXY = { x: currBounds.x, y: currBounds.y };
                        diagram._translate(node, oldXY.x - currXY.x, oldXY.y - currXY.y, diagram.nameTable)
                        if (update) {
                            ej.datavisualization.Diagram.DiagramContext.update(node, diagram);
                        }
                    }
                }
                if (node && node.container && !node.isLane && !node.isSwimlane && !node.isLaneStack && !node.isPhaseStack)
                    ej.datavisualization.Diagram.DiagramContext.update(node, diagram);
            }
        },
    };

    ej.datavisualization.Diagram.stackHelper = {
        _initStack: function (diagram, node) {
            node = ej.datavisualization.Diagram.Group(node);
            node = this._initGroupNode(diagram, node);
            node = this._initChildren(diagram, node);
            this._setSize(diagram, node);
            this._alignChildren(diagram, node);
            return node;
        },
        _initGroupNode: function (diagram, node) {
            return ej.datavisualization.Diagram.containerCommon._initGroupNode(diagram, node);
        },
        _initChildren: function (diagram, node) {
            return ej.datavisualization.Diagram.containerCommon._initChildren(diagram, node);
        },
        _setSize: function (diagram, node) {
            var pBounds = this._getStackBoundsBounds(diagram, node);
            if (pBounds.width >= node.minWidth && pBounds.width <= node.maxWidth)
                node.width = pBounds.width
            else if (pBounds.width <= node.minWidth)
                node.width = node.minWidth
            else if (pBounds.width >= node.maxWidth)
                node.width = node.maxWidth


            if (pBounds.height >= node.minHeight && pBounds.height <= node.maxHeight)
                node.height = pBounds.height
            else if (pBounds.height <= node.minHeight)
                node.height = node.minHeight
            else if (pBounds.height >= node.maxHeight)
                node.height = node.maxHeight
        },
        _getStackBoundsBounds: function (diagram, node) {
            var fRect = ej.datavisualization.Diagram.Rectangle(), i, child, cRect, height = 0, width = 0, maxWidth = 0, maxHeight = 0;
            var orientation = node.container.orientation ? node.container.orientation : "vertical";
            if (node.children && node.children.length > 0) {
                var children = node.children;
                for (i = 0; i < children.length; i++) {
                    child = typeof (children[i]) === "string" ? diagram.nameTable[children[i]] : children[i];
                    if (child) {
                        cRect = ej.datavisualization.Diagram.Util.bounds(child);
                        cRect = ej.datavisualization.Diagram.Geometry.rect([cRect.topLeft, cRect.topRight, cRect.bottomRight, cRect.bottomLeft]);
                        if (cRect) {
                            if (orientation === "vertical") {
                                width = cRect.width += child.marginLeft + child.marginRight;
                                if (width > maxWidth) {
                                    maxWidth = cRect.width = width;
                                }
                                cRect.width = (child.horizontalAlign === "stretch") ? (cRect.width > child.minWidth ? cRect.width : maxWidth) : maxWidth;
                                cRect.height += child.marginTop + child.marginBottom;
                                cRect.height += fRect.height;
                            }
                            else {
                                height = cRect.height += child.marginTop + child.marginBottom;
                                if (height > maxHeight) {
                                    maxHeight = cRect.height = height;
                                }

                                cRect.height = (child.verticalAlign === "stretch") ? (cRect.height > child.minHeight ? cRect.height : maxHeight) : maxHeight;
                                cRect.width += child.marginLeft + child.marginRight;
                                cRect.width += fRect.width;
                            }
                            cRect.x = 0; cRect.y = 0;
                        }
                        fRect = diagram._union(fRect, cRect);
                    }
                }
            }
            fRect.width += node.paddingLeft + node.paddingRight;
            fRect.height += node.paddingTop + node.paddingBottom;
            return fRect;
        },
        _alignChildren: function (diagram, node) {
            var child, transX = 0, transY = 0;;
            var children = node.children;
            for (var i = 0; i < children.length; i++) {
                child = typeof (children[i]) === "string" ? diagram.nameTable[children[i]] : children[i];
                if (child) {
                    var pos = this._getStackPosition(diagram, child, node, transX, transY);
                    this._translate(diagram, child, pos.x, pos.y);

                    if (node.container.orientation == "vertical")
                        transY += (child.height ? child.height : child._height) + child.marginTop + child.marginBottom;
                    else
                        transX += (child.width ? child.width : child._width) + child.marginLeft + child.marginRight;
                }
            }
        },
        _getStackPosition: function (diagram, child, parent, transX, transY) {
            var dx = 0, dy = 0;
            var groupBounds = ej.datavisualization.Diagram.Util.bounds(parent);
            var bounds = ej.datavisualization.Diagram.Util.bounds(child);
            var orientation = parent.container.orientation ? parent.container.orientation : "vertical";
            var width = child.width ? child.width : child._width;
            var height = child.height ? child.height : child._height;
            if (parent.container.orientation == "vertical") {
                dy = groupBounds.y - bounds.y + transY + child.marginTop + parent.paddingTop;
                switch (child.horizontalAlign) {
                    case "left":
                        dx = groupBounds.x - bounds.x + child.marginLeft + parent.paddingLeft;
                        break;
                    case "center":
                        dx = groupBounds.center.x - bounds.center.x;
                        break;
                    case "right":
                        dx = (groupBounds.x + groupBounds.width) - (bounds.x + bounds.width + parent.paddingRight);
                        break;
                    case "stretch":
                        var deltaWidth = (parent.width - (parent.paddingLeft + parent.paddingRight) - (child.marginLeft + child.marginRight)) / width;
                        diagram.scale(child, deltaWidth, 1, parent.pivot, diagram.nameTable);
                        groupBounds = ej.datavisualization.Diagram.Util.bounds(parent);
                        bounds = ej.datavisualization.Diagram.Util.bounds(child, diagram);
                        dx = (groupBounds.x + parent.paddingLeft + child.marginLeft) - (bounds.x);
                        break;
                }
            }
            else {
                dx = groupBounds.x - bounds.x + transX + child.marginLeft + parent.paddingLeft;
                switch (child.verticalAlign) {
                    case "top":
                        dy = groupBounds.y - bounds.y + child.marginTop + parent.paddingTop;
                        break;
                    case "center":
                        dy = groupBounds.center.y - bounds.center.y;
                        break;
                    case "bottom":
                        dy = (groupBounds.y + groupBounds.height) - (bounds.y + bounds.height + parent.paddingBottom);
                        break;
                    case "stretch":
                        var deltaHeight = (parent.height - (parent.paddingTop + parent.paddingBottom) - (child.marginTop + child.marginBottom)) / height;
                        diagram.scale(child, 1, deltaHeight, parent.pivot, diagram.nameTable);
                        groupBounds = ej.datavisualization.Diagram.Util.bounds(parent);
                        bounds = ej.datavisualization.Diagram.Util.bounds(child, diagram);
                        dy = (groupBounds.y + parent.paddingTop + child.marginTop) - (bounds.y);
                        break;
                }
            }
            return { x: dx, y: dy }
        },
        _translate: function (diagram, node, dx, dy) {
            if (dx || dy) {
                if (!node.segments) {
                    node.offsetX += dx;
                    node.offsetY += dy;
                    if ((node._type === "group" || node.type === "pseudoGroup" || node.type == "umlclassifier")) {
                        var nodes = node.children;
                        var child;
                        for (var i = 0; nodes && i < nodes.length; i++) {
                            child = diagram.nameTable[diagram._getChild(nodes[i])];
                            if (child) {
                                this._translate(diagram, child, dx, dy);
                            }
                        }
                    }
                    ej.datavisualization.Diagram.DefautShapes.translateBPMNAnnotationShape(node, dx, dy, null, diagram);
                } else {
                    ej.datavisualization.Diagram.Util._translateLine(node, dx, dy, node);
                }
            }
        },

        //#region update
        _updateCollectionChange: function (diagram, node, updateParent, parentObj) {
            this._setSize(diagram, node);
            this._alignChildren(diagram, node);
            if (node.parent) {
                var parent = diagram.nameTable[node.parent];
                if (!parent) {
                    if (parentObj && node.isPhaseStack) {
                        parent = parentObj;
                    }
                }
                if (parent && parent.container && !updateParent) {
                    ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, parent);
                }
            }
            //ej.datavisualization.Diagram.DiagramContext.update(node, diagram);
        }
        //#endregion
    };

    ej.datavisualization.Diagram.canvasHelper = {

        //#region helpers

        _initCanvas: function (diagram, node) {
            node._type = "group";
            if (!node.type) node.type = "group";
            node = ej.datavisualization.Diagram.Group(node);
            node = this._initGroupNode(diagram, node);
            node = this._initChildren(diagram, node);
            this._setSize(diagram, node);
            this._alignChildren(diagram, node);
            //this._setSize(diagram, node);
            return node;
        },
        _initGroupNode: function (diagram, node) {
            return ej.datavisualization.Diagram.containerCommon._initGroupNode(diagram, node);
        },
        _initChildren: function (diagram, node) {
            return ej.datavisualization.Diagram.containerCommon._initChildren(diagram, node);
        },
        _setSize: function (diagram, node, updatePosition, useBottomRight) {
            var pBounds = this._getCanvasBounds(diagram, node, useBottomRight);
            var pervBounds = ej.datavisualization.Diagram.Util.bounds(node);
            pervBounds = ej.datavisualization.Diagram.Geometry.rect([pervBounds.topLeft, pervBounds.topRight, pervBounds.bottomRight, pervBounds.bottomLeft]);
            if (pBounds.width >= node.minWidth && pBounds.width <= node.maxWidth)
                pBounds.width = pBounds.width
            else if (pBounds.width <= node.minWidth)
                pBounds.width = node.minWidth
            else if (pBounds.width >= node.maxWidth)
                pBounds.width = node.maxWidth


            if (pBounds.height >= node.minHeight && pBounds.height <= node.maxHeight)
                pBounds.height = pBounds.height
            else if (pBounds.height <= node.minHeight)
                pBounds.height = node.minHeight
            else if (pBounds.height >= node.maxHeight)
                pBounds.height = node.maxHeight

            if (updatePosition) {
                var scaleX = pBounds.width / pervBounds.width, scaleY = pBounds.height / pervBounds.height;
                var dx = (pBounds.x + pBounds.width / 2) - (pervBounds.x + pervBounds.width / 2);
                var dy = (pBounds.y + pBounds.height / 2) - (pervBounds.y + pervBounds.height / 2);
                var offset = ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY)
                diagram._translate(node, dx, dy, diagram.nameTable, true);
                diagram.scale(node, scaleX, scaleY, ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY), diagram.nameTable);
                if (node._isBpmn) {
                    var children = diagram._getChildren(node.children);
                    for (var i = 0; i < children.length; i++) {
                        var child = diagram.nameTable[children[i]];
                        if (child && child._isInternalShape && ej.datavisualization.Diagram.Util.canResize(child))
                            child = $.extend(true, child, { offsetX: node.offsetX, offsetY: node.offsetY, width: node.width, height: node.height });
                    }
                    ej.datavisualization.Diagram.Util._updateBPMNProperties(node, diagram, diagram.nameTable, true);
                }
                ej.datavisualization.Diagram.DefautShapes.translateBPMNAnnotationShape(node, 1 / scaleX, 1 / scaleY, offset, diagram);
            } else {
                node.width = pBounds.width;
                node.height = pBounds.height;
            }
        },
        _alignChildren: function (diagram, node) {
            var child, update = true;
            var children = node.children;
            for (var i = 0; i < children.length; i++) {
                child = typeof (children[i]) === "string" ? diagram.nameTable[children[i]] : children[i];
                if (child && !child._isInternalShape) {
                    if (diagram._disablePhaseUpdate && child.isPhaseStack)
                        update = false;
                    if (update) {
                        var pos = this._getCanvasPosition(diagram, child, node);
                        this._translate(diagram, child, pos.x, pos.y);
                    }
                }
                if (child && child._isInternalShape && ej.datavisualization.Diagram.Util.canResize(child)) {
                    child = $.extend(true, child, { offsetX: node.offsetX, offsetY: node.offsetY, width: node.width, height: node.height });
                    ej.datavisualization.Diagram.Util._updateBPMNProperties(node, diagram, diagram.nameTable, true);
                }
            }
        },
        _translate: function (diagram, node, dx, dy) {
            if (dx || dy) {
                if (!node.segments) {
                    node.offsetX += dx;
                    node.offsetY += dy;
                    if ((node._type === "group" || node.type === "pseudoGroup")) {
                        var nodes = node.children;
                        var child;
                        for (var i = 0; i < nodes.length; i++) {
                            child = diagram.nameTable[diagram._getChild(nodes[i])];
                            if (child) {
                                this._translate(diagram, child, dx, dy);
                                diagram._updateQuad(child);
                            }
                        }
                    }
                    ej.datavisualization.Diagram.DefautShapes.translateBPMNAnnotationShape(node, dx, dy, null, diagram);
                } else {
                    ej.datavisualization.Diagram.Util._translateLine(node, dx, dy, node);
                }
            }
        },
        _getCanvasPosition: function (diagram, child, parent) {
            var dx = 0, dy = 0;
            var groupBounds = ej.datavisualization.Diagram.Util.bounds(parent);
            var bounds = ej.datavisualization.Diagram.Util.bounds(child);
            switch (child.horizontalAlign) {
                case "left":
                    dx = groupBounds.x - bounds.x + child.marginLeft + parent.paddingLeft;
                    break;
                case "center":
                    dx = (groupBounds.x + groupBounds.width / 2) - (bounds.x + bounds.width / 2) + child.marginLeft + parent.paddingLeft;
                    break;
                case "right":
                    dx = (groupBounds.x + groupBounds.width - child.marginRight) - (bounds.x + bounds.width + parent.paddingRight);
                    break;
                case "stretch":
                    var deltaWidth = (groupBounds.width - parent.paddingLeft - parent.paddingRight - child.marginLeft - child.marginRight) / child.width;
                    diagram.scale(child, deltaWidth, 0, parent.pivot, diagram.nameTable);
                    bounds = ej.datavisualization.Diagram.Util.bounds(child, diagram);
                    dx = (groupBounds.x + parent.paddingLeft) - (bounds.x) + child.marginLeft;
                    break;
            }
            switch (child.verticalAlign) {
                case "top":
                    dy = groupBounds.y - bounds.y + child.marginTop + parent.paddingTop;
                    break;
                case "center":
                    dy = (groupBounds.y + groupBounds.height / 2) - (bounds.y + bounds.height / 2) + child.marginTop + parent.paddingTop;
                    break;
                case "bottom":
                    dy = (groupBounds.y + groupBounds.height - child.marginBottom) - (bounds.y + bounds.height + parent.paddingBottom);
                    break;
                case "stretch":
                    var deltaHeight = (groupBounds.height - parent.paddingTop - parent.paddingBottom - child.marginTop - child.marginBottom) / child.height;
                    diagram.scale(child, 0, deltaHeight, parent.pivot, diagram.nameTable);
                    bounds = ej.datavisualization.Diagram.Util.bounds(child, diagram);
                    dy = (groupBounds.y + parent.paddingTop) - (bounds.y) + child.marginTop;
                    break;

            }
            return { x: dx, y: dy };
        },
        _getCanvasBounds: function (diagram, node, useBottomRight) {
            var fRect = ej.datavisualization.Diagram.Rectangle(), i = 0, child, cRect;
            var x, y, diffx, diffy;
            if (node.children && node.children.length > 0) {
                var children = node.children;
                for (; i < children.length; i++) {
                    child = typeof (children[i]) === "string" ? diagram.nameTable[children[i]] : children[i];
                    if (child && !child._isInternalShape) {
                        cRect = ej.datavisualization.Diagram.Util.bounds(child);
                        cRect = ej.datavisualization.Diagram.Geometry.rect([cRect.topLeft, cRect.topRight, cRect.bottomRight, cRect.bottomLeft]);
                        if (child.horizontalAlign === "stretch") {
                            cRect.width = cRect.width >= node.minWidth ? cRect.width : 1;
                            if ((node.isLane || node.isSwimlane) && i == 0)
                                cRect.width = 1;
                        }
                        if (child.verticalAlign === "stretch") {
                            cRect.height = cRect.height >= node.minHeight ? cRect.height : 1;
                            if (node.isLane && i == 0)
                                cRect.height = 1;
                        }
                        if (cRect) {
                            diffx = child.marginLeft > 0 ? cRect.x - child.marginLeft : cRect.x;
                            diffy = child.marginTop > 0 ? cRect.y - child.marginTop : cRect.y;
                            x = x == undefined ? diffx : Math.min(x, diffx);
                            y = y == undefined ? diffy : Math.min(y, diffy);
                            cRect.width += child.marginLeft + (useBottomRight ? 0 : child.marginRight);
                            cRect.height += child.marginTop + (useBottomRight ? 0 : child.marginBottom);
                            cRect.x = 0; cRect.y = 0;
                            if (node.type == "bpmn") {
                                if (child.marginLeft < 0) cRect.width -= child.marginLeft;
                                if (child.marginTop < 0) cRect.height -= child.marginTop;
                            }
                        }
                        fRect = ej.datavisualization.Diagram.Geometry.union(fRect, cRect);
                    }
                }
            }
            if (node.type == "bpmn" && ej.datavisualization.Diagram.Geometry.isEmptyRect(fRect)) {
                fRect = ej.datavisualization.Diagram.Util.bounds(node);
                fRect = ej.datavisualization.Diagram.Geometry.rect([fRect.topLeft, fRect.topRight, fRect.bottomRight, fRect.bottomLeft]);
            }
            else {
                fRect.width += node.paddingLeft + node.paddingRight;
                fRect.height += node.paddingTop + node.paddingBottom;
                fRect.x = x - node.paddingLeft;
                fRect.y = y - node.paddingTop;
            }
            return fRect;
        },

        //#endregion 

        //#region update
        _updateCollectionChange: function (diagram, node) {
            var useBottomRight = false;
            if (diagram.activeTool.name === "resize" && node.container) {
                useBottomRight = true;
            }
            this._setSize(diagram, node, null, useBottomRight);
            this._alignChildren(diagram, node);
            if (node.parent) {
                var parent = diagram.nameTable[node.parent];
                if (parent && parent.container) {
                    ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, parent);
                }
            }
            //ej.datavisualization.Diagram.DiagramContext.update(node, diagram);
        },
        //#endregion

        _getSwimlane: function (diagram, laneName) {
            var lane = diagram.nameTable[diagram._getChild(laneName)];
            if (lane && lane.isLane) {
                var laneStack = diagram.nameTable[lane.parent];
                if (laneStack) {
                    var swimlane = diagram.nameTable[laneStack.parent];
                    if (swimlane)
                        return diagram.getNode(swimlane.name);
                }
            }

        },
        //#region swapping lane
        _laneConnectors: function (diagram, lane, connectors) {
            var m, i, j, k, lane, child, lanes;
            if (lane && lane.isLane) {
                for (j = 0; j < lane.children.length; j++) {
                    child = diagram.nameTable[diagram._getChild(lane.children[j])];
                    if (child) {
                        if (child.inEdges && child.inEdges.length > 0) {
                            for (m = 0; m < lane.children.length; m++) {
                                if (!diagram._collectionContains(child.inEdges[m], connectors))
                                    connectors.push(child.inEdges[m])
                            }
                        }
                        if (child.outEdges && child.outEdges.length > 0) {
                            for (m = 0; m < lane.children.length; m++) {
                                if (!diagram._collectionContains(child.outEdges[m], connectors))
                                    connectors.push(child.outEdges[m])
                            }
                        }
                    }
                }
            }
        },
        _connectorRelateTolaneCollection: function (diagram, connector, interLanes) {
            if (connector) {
                var swimlane, lIndex, sparent, tparent, tnode, snode, i;
                snode = connector.sourceNode ? diagram.nameTable[connector.sourceNode] : null;
                tnode = connector.targetNode ? diagram.nameTable[connector.targetNode] : null;
                if (snode && snode.parent) {
                    sparent = diagram.nameTable[snode.parent];
                }
                if (tnode && tnode.parent) {
                    tparent = diagram.nameTable[tnode.parent];
                }
                if (sparent && tparent && tparent.name === sparent.name)
                    return false;
                for (i = 0; i < interLanes.length; i++) {
                    if (sparent && sparent.name === interLanes[i])
                        return true;
                    if (tparent && tparent.name === interLanes[i])
                        return true;
                }

            }
            return false;
        },

        _recreateConnectorSegments: function (diagram, node, list, name1, name2) {
            if (diagram && node) {
                var connectors = [], swimConnectors = [], swimlane, connector, m, i, j, k, lane, child, lanes, interLanes;
                node = diagram.nameTable[diagram._getChild(node)];
                if (node && node.isLane || node.isSwimlane) {
                    if (node.isLane) {
                        if (Array.isArray(list)) {
                            interLanes = this._getIntermediateLanes(diagram, list, name1, name2);
                            for (i = 0 ; i < interLanes.length ; i++) {
                                lane = diagram.nameTable[diagram._getChild(interLanes[i])];
                                this._laneConnectors(diagram, lane, connectors)
                            }

                            swimlane = this._getSwimlane(diagram, node.name);
                            lanes = swimlane.lanes;
                            for (i = 0 ; i < lanes.length ; i++) {
                                lane = diagram.nameTable[diagram._getChild(lanes[i])];
                                this._laneConnectors(diagram, lane, swimConnectors)
                            }

                            for (i = 0 ; i < connectors.length ; i++) {
                                connector = diagram.nameTable[diagram._getChild(connectors[i])];
                                if (connector) {
                                    if (this._connectorRelateTolaneCollection(diagram, connector, [name1, name2])) {
                                        connector.segments = [];
                                        ej.datavisualization.Diagram.Util._initializeSegments(connector, "orthogonal");
                                    }
                                }
                            }
                            for (i = 0 ; i < swimConnectors.length ; i++) {
                                connector = diagram.nameTable[diagram._getChild(swimConnectors[i])];
                                if (connector) {
                                    this._updateConnectorEndPoints(diagram, connector);
                                }
                            }
                        }
                    }
                }
            }
        },

        _isLineInterSectingNode: function (diagram, connector, node) {
            var isInterSecting = false;
            if (connector && node) {
                var nodeBounds = ej.datavisualization.Diagram.Util.bounds(node);
                var nodePoints = [
                        { x: nodeBounds.topLeft.x, y: nodeBounds.topLeft.y },
                        { x: nodeBounds.topRight.x, y: nodeBounds.topRight.y },
                        { x: nodeBounds.bottomRight.x, y: nodeBounds.bottomRight.y },
                        { x: nodeBounds.bottomLeft.x, y: nodeBounds.bottomLeft.y },
                        { x: nodeBounds.topLeft.x, y: nodeBounds.topLeft.y }
                ];
            }
            var segments = connector.segments;
            if (segments && segments.length > 0) {
                for (var i = 0; !isInterSecting && i < segments.length; i++) {
                    var segment = segments[i];
                    if (segment && segment.points.length > 0) {
                        var points = segment.points, point1, point2, point3, point4;
                        for (var j = 0; !isInterSecting && j < points.length - 1; j++) {
                            point1 = points[j];
                            point2 = points[j + 1];
                            for (var m = 0; !isInterSecting && m < nodePoints.length - 1; m++) {
                                point3 = nodePoints[m];
                                point4 = nodePoints[m + 1];
                                if (this._isInterSecting(point1.x, point1.y, point2.x, point2.y, point3.x, point3.y, point4.x, point4.y, true)) {
                                    isInterSecting = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            return isInterSecting;
        },

        _updateConnectorEndPoints: function (diagram, connector) {

            if (diagram && connector) {
                var reset = false;
                connector.sourcePoint = ej.datavisualization.Diagram.Point();
                connector.targetPoint = ej.datavisualization.Diagram.Point();
                ej.datavisualization.Diagram.Util._initConnectionEnds(connector, diagram);
                ej.datavisualization.Diagram.Util._initializeSegments(connector, "orthogonal");
                diagram._dock(connector, diagram.nameTable);
                if (connector.sourceNode)
                    var sourceNode = diagram.nameTable[connector.sourceNode];
                if (sourceNode && this._isLineInterSectingNode(diagram, connector, sourceNode))
                    reset = true;
                if (connector.targetNode)
                    var targetNode = diagram.nameTable[connector.targetNode];
                if (targetNode && this._isLineInterSectingNode(diagram, connector, targetNode)) {
                    if (this._anySegmentOrtho(connector)) {
                        reset = false;
                    }
                    else reset = true;
                }
                if (reset) {
                    connector.segments = [];
                    ej.datavisualization.Diagram.Util._initializeSegments(connector, "orthogonal");
                    diagram._dock(connector, diagram.nameTable);
                }
                ej.datavisualization.Diagram.Util._initializeSegments(connector, "orthogonal");
                diagram._dock(connector, diagram.nameTable);
            }
        },

        _anySegmentOrtho: function (connector) {
            var state = false;
            if (connector) {
                if (connector.segments && connector.segments.length > 0) {
                    for (var segment, i = 0; i < connector.segments.length; i++) {
                        segment = connector.segments[i];
                        if (segment && segment.type !== "orthogonal") {
                            state = true;
                            break;
                        }
                    }
                }
            }
            return state
        },

        _getIntermediateLanes: function (diagram, list, name1, name2) {
            var rlist = [], i;
            if (list) {
                var index1 = list.indexOf(name1);
                var index2 = list.indexOf(name2);
                var start = Math.min(index1, index2);
                var end = Math.max(index1, index2);
                for (i = start; i <= end; i++) {
                    rlist.push(list[i])
                }
            }
            return rlist;
        },
        _swapLane: function (diagram, list, name1, name2, isVertical, parent) {
            var btNode = diagram.nameTable[name2];
            var tList = list.slice();
            var tool = diagram.tools["move"];
            var prevSwimlane = this._getSwimlane(diagram, name1);
            tool._undoObject = $.extend(true, {}, { name1: name1, name2: name2 });
            if (btNode) {
                var bounds = ej.datavisualization.Diagram.Util.bounds(btNode);
                //btNode.height += 10;
                var currentIndex = list.indexOf(name1);
                var moveIndex = list.indexOf(name2);
                list.splice(list.indexOf(name1), 1);
                moveIndex += currentIndex > moveIndex ? 0 : -1;
                moveIndex += isVertical ? tool.currentPoint.y >= bounds.y && tool.currentPoint.y < bounds.center.y ? 0 : 1 :
                     tool.currentPoint.x >= bounds.x && tool.currentPoint.x < bounds.center.x ? 0 : 1;
                list.splice(moveIndex, 0, name1);
            }
            tool._redoObject = $.extend(true, {}, { name1: name2, name2: name1 });
            var entry = {
                type: "swapLane", undoObject: jQuery.extend(true, {}, tool._undoObject), redoObject: jQuery.extend(true, {}, tool._redoObject), currentIndex: currentIndex, moveIndex: moveIndex, category: "internal"
            };
            var currLaneSwimlane = this._getSwimlane(diagram, name1);
            if (prevSwimlane)
                diagram._comparePropertyValues(currLaneSwimlane, "lanes", { lanes: prevSwimlane.lanes }, true);
            diagram.addHistoryEntry(entry);
            tool._multipleUndo = true;
            if (parent)
                ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, parent, false);
            if (diagram.activeTool.selectedObject) {
                ej.datavisualization.Diagram.canvasHelper._recreateConnectorSegments(diagram, diagram.activeTool.selectedObject.name, tList, name1, name2);
                ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdateLane(diagram, diagram.activeTool.selectedObject)
            }
        },
        //#endregion

        //#region dragging singleNode
        _updateHelper: function (diagram) {
            if (!diagram.activeTool.helper) {
                this._initHelper(diagram);
            } else {
                this._updateHelperXY(diagram, diagram.activeTool.helper, diagram.activeTool.previousPoint, diagram.activeTool.currentPoint);
                ej.datavisualization.Diagram.SvgContext._updateContainerHelper(diagram);
            }
        },
        _updateHelperXY: function (diagram, shape, startPoint, endPoint) {
            var towardsLeft = endPoint.x < startPoint.x;
            var towardsTop = endPoint.y < startPoint.y;
            var difx = diagram.activeTool.diffx + (endPoint.x - startPoint.x);
            var dify = diagram.activeTool.diffy + (endPoint.y - startPoint.y);
            var offset;
            var enableSnapToObject = diagram.activeTool.diagram._enableSnapToObject();
            diagram.activeTool.diagram._enableSnapToObject(true);
            offset = ej.datavisualization.Diagram.SnapUtil._snapPoint(diagram, diagram.activeTool.helper, towardsLeft, towardsTop, ej.datavisualization.Diagram.Point(difx, dify),
        endPoint, startPoint);
            diagram.activeTool.diagram._enableSnapToObject(enableSnapToObject);
            if (!offset)
                offset = ej.datavisualization.Diagram.Point(difx, dify);
            diagram.activeTool.diffx = difx - offset.x;
            diagram.activeTool.diffy = dify - offset.y;
            if (!ej.datavisualization.Diagram.Geometry.isEmptyPoint(offset)) {
                var args = diagram.activeTool._raiseDragEvent({ element: diagram.getNode(diagram.activeTool.helper), offset: offset, cancel: false });
                if (args && !args.cancel) {
                    if (diagram.activeTool._outOfBoundsDrag(shape, offset.x, offset.y))
                        diagram._translate(shape, offset.x, offset.y, diagram.nameTable);
                    if (shape._type === "group") {
                        ej.datavisualization.Diagram.Util._updateGroupBounds(shape, diagram);
                    }
                }
            }
        },
        _initHelper: function (diagram) {
            diagram.activeTool.helper = this._getCloneNode(diagram.activeTool.selectedObject);
            diagram.activeTool.helper._name = diagram.activeTool.selectedObject.name;
            diagram.activeTool.helper.name = "helper";
            diagram.activeTool.startPoint = diagram.activeTool.currentPoint;
            ej.datavisualization.Diagram.SvgContext._drawContainerHelper(diagram);
        },
        _getCloneNode: function (node) {
            var obj = null;
            obj = jQuery.extend(true, {}, node);
            obj.children = [];
            obj.minHeight = 0;
            obj.minWidth = 0;
            obj.maxHeight = 0;
            obj.maxWidth = 0;
            return obj;
        },
        _updateHighlighter: function (diagram, evt) {
            var overNode = diagram.activeTool._getMouseOverElement(evt);
            if (overNode && !overNode.segments && (!diagram.activeTool.selectedObject.isLane || overNode.isLane)) {
                diagram.activeTool._nodeHighLighter(overNode, evt);
            } else {
                diagram.activeTool._removeHighLighter();
            }
        },
        _updateNodeMargin: function (diagram, node, overNode) {
            if (node._type == "group") {
                for (var i = 0; i < node.children.length; i++) {
                    var child = node.children[i];
                    this._updateNodeMargin(diagram, typeof child == "string" ? diagram.nameTable[child] : child, node);
                }
            }
            if (node && overNode) {
                var prevNode = $.extend(false, {}, node);
                var nodeBounds = ej.datavisualization.Diagram.Util.bounds(node);
                var groupBounds = ej.datavisualization.Diagram.Util.bounds(overNode);
                var isStack = (overNode.container && overNode.container.type && overNode.container.type == "stack") ? true : false
                if (isStack) {
                    if (overNode.container.orientation === "horizontal")
                        node.marginTop = nodeBounds.top - groupBounds.top - overNode.paddingTop;
                    else node.marginLeft = nodeBounds.left - groupBounds.left - overNode.paddingLeft;
                }
                else {
                    node.marginLeft = nodeBounds.left - groupBounds.left - overNode.paddingLeft;
                    node.marginTop = nodeBounds.top - groupBounds.top - overNode.paddingTop;
                }
                var nodeWidth = nodeBounds.right - nodeBounds.left, nodeHeight = nodeBounds.bottom - nodeBounds.top;
                var right = (groupBounds.x + groupBounds.width) - (nodeBounds.x + nodeWidth) - overNode.paddingRight;
                (right < 0) ? node.marginRight = 0 : node.marginRight = right;
                var bottom = (groupBounds.y + groupBounds.height) - (nodeBounds.y + nodeHeight) - overNode.paddingBottom;
                (bottom < 0) ? node.marginBottom = 0 : node.marginBottom = bottom;
                if (overNode.isLane) {
                    var left = 0, top = 0;
                    if (overNode.orientation === "horizontal") {
                        left = 50, top = 0;
                    }
                    else {
                        left = 0, top = 50;
                    }
                    node.marginLeft = node.marginLeft >= left ? node.marginLeft : left;
                    node.marginTop = node.marginTop >= top ? node.marginTop : top;
                    diagram._comparePropertyValues(node, "marginLeft", { marginLeft: prevNode.marginLeft }, true);
                    diagram._comparePropertyValues(node, "marginRight", { marginLeft: prevNode.marginRight }, true);
                    diagram._comparePropertyValues(node, "marginBottom", { marginLeft: prevNode.marginBottom }, true);
                    diagram._comparePropertyValues(node, "marginRight", { marginLeft: prevNode.marginRight }, true);
                }
            }
        },
        _singleNodedrag: function (diagram, evt, overNode) {
            var checkDrop = !diagram.activeTool._checkForDropEvent(overNode);
            if (checkDrop) {
                if (overNode) {
                    if (ej.datavisualization.Diagram.Util.canAllowDrop(overNode) || (overNode.name == diagram.activeTool.selectedObject.parent)) {
                        if (overNode.container && overNode.container.type == "canvas") {
                            var newParent, oldParent;
                            var addToContainer = !overNode._isBpmn || (overNode._isBpmn && diagram.activeTool.selectedObject.parent != overNode.name) ? true : false;
                            if (ej.datavisualization.Diagram.canvasHelper._outOfBoundaryNodeDrop(diagram, diagram.activeTool.helper, overNode) && addToContainer) {
                                if (overNode.isLane || overNode.container.type == "canvas")
                                    this._disableConnectorUpdate(diagram);
                                diagram.activeTool.seletedObject = diagram.nameTable[diagram.activeTool.selectedObject.name];
                                if (diagram.activeTool.selectedObject.parent)
                                    oldParent = diagram.nameTable[diagram.activeTool.selectedObject.parent];
                                diagram._disablePhaseUpdate = true;
                                diagram._disableSwimlaneUptate = true;
                                this._removeNodeFromContainer(diagram, diagram.activeTool.selectedObject);
                                this._addNodeToContainer(diagram, diagram.activeTool.selectedObject, overNode, null, true);
                                var cause1 = diagram._isUndo ? ej.datavisualization.Diagram.GroupChangeCause.HistoryChange : ej.datavisualization.Diagram.GroupChangeCause.Drop;
                                diagram._raiseGroupChangeEvent(diagram.activeTool.selectedObject, oldParent, overNode, cause1);
                                diagram._comparePropertyValues(diagram.activeTool.selectedObject, "parent", { parent: oldParent.name }, true);
                                delete diagram._disablePhaseUpdate;
                                delete diagram._disableSwimlaneUptate;
                                this._updateLastSwimlanePhase(diagram, diagram.activeTool.selectedObject);
                                if (overNode.isLane || overNode.container.type == "canvas")
                                    this._enableConnectorUpdateNode(diagram, diagram.activeTool.selectedObject);
                            }
                            else if (overNode._isBpmn) {
                                var canvasContainer = diagram.nameTable[diagram.activeTool.selectedObject.parent];
                                var prevWidth = canvasContainer.width, prevHeight = canvasContainer.height, offset = { x: canvasContainer.offsetX, y: canvasContainer.offsetY };
                                diagram._translate(diagram.activeTool.selectedObject, (diagram.activeTool.helper.offsetX - diagram.activeTool.selectedObject.offsetX), (diagram.activeTool.helper.offsetY - diagram.activeTool.selectedObject.offsetY), diagram.nameTable);
                                diagram._updateAssociatedConnectorEnds(diagram.activeTool.selectedObject, diagram.nameTable);
                                var parent = ej.datavisualization.Diagram.ContainerHelper.updateparent(overNode, diagram);
                                if (!parent)
                                    ej.datavisualization.Diagram.bpmnHelper.updateCanvas(canvasContainer, diagram);
                                else {
                                    this._removeNodeFromContainer(diagram, diagram.activeTool.selectedObject);
                                    this._addNodeToContainer(diagram, diagram.activeTool.selectedObject, overNode, null, true);
                                }

                            }
                            else {
                                diagram._translate(diagram.activeTool.selectedObject, (diagram.activeTool.undoObject.node.offsetX - diagram.activeTool.selectedObject.offsetX), (diagram.activeTool.undoObject.node.offsetY - diagram.activeTool.selectedObject.offsetY), diagram.nameTable);
                                diagram._updateAssociatedConnectorEnds(diagram.activeTool.selectedObject, diagram.nameTable);
                                this._updateLastSwimlanePhase(diagram, overNode);
                            }
                        }
                    }
                }
                else {
                    var selectedNode = $.extend(true, {}, diagram.activeTool.selectedObject);
                    if (diagram.activeTool.selectedObject.type != "pseudoGroup")
                        this._disableConnectorUpdate(diagram);
                    if (diagram.activeTool.selectedObject.parent)
                        oldParent = diagram.nameTable[diagram.activeTool.selectedObject.parent];
                    this._removeNodeFromContainer(diagram, diagram.activeTool.selectedObject);
                    diagram._raiseGroupChangeEvent(diagram.activeTool.selectedObject, oldParent, null, "group");
                    this._addMultiNodeToDiagram(diagram, diagram.activeTool.selectedObject);
                    this._enableConnectorUpdateNode(diagram, selectedNode);
                    diagram._updateAssociatedConnectorEnds(selectedNode, diagram.nameTable);
                }
            }
            return true;
        },

        _updateLastSwimlanePhase: function (diagram, node) {
            var lane = ej.datavisualization.Diagram.ContainerHelper.updateparent(node, diagram);
            if (lane && lane.isLane) {
                var laneStack = diagram.nameTable[lane.parent];
                if (laneStack) {
                    var swimlane = diagram.nameTable[laneStack.parent];
                    if (swimlane) {
                        this._updateLastPhase(diagram, swimlane);
                    }
                }
            }

        },
        _updateLastPhase: function (diagram, swimlane) {
            if (swimlane && swimlane.isSwimlane) {
                var laneStack = diagram.nameTable[diagram._getChild(swimlane.children[2])];
                var phaseStack = diagram.nameTable[diagram._getChild(swimlane.children[1])];
                var lBounds = ej.datavisualization.Diagram.stackHelper._getStackBoundsBounds(diagram, laneStack);
                var pBounds = ej.datavisualization.Diagram.stackHelper._getStackBoundsBounds(diagram, phaseStack);
                var phases = ej.datavisualization.Diagram.SwimLaneContainerHelper.getPhases(diagram, swimlane);
                var lanes = ej.datavisualization.Diagram.SwimLaneContainerHelper.getLanes(diagram, swimlane), lane;
                lane = diagram.nameTable[diagram._getChild(lanes[0])];
                if (phases.length > 0) {
                    var lastPhase = diagram.nameTable[phases[phases.length - 1]];
                    if (lastPhase) {
                        if (swimlane.orientation === "horizontal") {
                            var d = lBounds.width - pBounds.width;
                            lastPhase.width += d;
                            lastPhase.offset += d;
                            if (lane && lane.isLane)
                                lane.minWidth += d;
                        }
                        else {
                            d = lBounds.height - pBounds.height;
                            lastPhase.height += d;
                            lastPhase.offset += d;
                            if (lane && lane.isLane)
                                lane.minHeight += d;
                        }
                    }
                    ej.datavisualization.Diagram.SwimLaneContainerHelper._updatePhaseStack(diagram, swimlane);
                }
            }
        },

        //#endregion

        //#region connector update
        _disableConnectorUpdate: function (diagram) {
            diagram._disableSegmentChange = true;
        },

        _enableConnectorUpdate: function (diagram, swimlane, fromNudge) {
            delete diagram._disableSegmentChange;
            if (swimlane) {
                diagram._updateChildAdjacentConnectors(swimlane, true)
                if (!fromNudge) {
                    diagram._disableSegmentChange = true;
                    this._updateSwimalneAssociatedConnectors(diagram, swimlane, diagram._svg);
                    delete diagram._disableSegmentChange;
                }
                this._updateChildAdjacentConnectors(diagram, swimlane);
            }
        },
        _updateChildAdjacentConnectors: function (diagram, swimlane) {
            var childTable = diagram._getChildTable(swimlane, {});
            for (var child in childTable) {
                var childNode = diagram.nameTable[diagram._getChild(child)];
                if (childNode && childNode.segments && swimlane.children.indexOf(child) == -1) {
                    ej.datavisualization.Diagram.DiagramContext.update(childNode, diagram);
                }
            }
        },
        _updateSwimalneAssociatedConnectors: function (diagram, group, svg, layout) {
            var children = diagram._getChildren(group.children);
            if (children && children.length > 0) {
                for (var i = 0, len = children.length; i < len; i++) {
                    var child = diagram.nameTable[children[i]];
                    if (child) {
                        if (child._type === "group")
                            this._updateSwimalneAssociatedConnectors(diagram, child, svg, layout);
                        else
                            this._updateSwimalneAssociatedConnectors(diagram, child, svg, layout);
                    }
                }
            }
            if (group.type != "group") {
                ej.datavisualization.Diagram.SvgContext._updateAssociatedConnector(group, svg, diagram);
            }
        },

        _enableConnectorUpdateNode: function (diagram, node) {
            var parent = null;
            if (node && node.parent) {
                parent = diagram.nameTable[node.parent];
            }
            if (parent) {
                if (parent.isLane) {
                    var swimlane = diagram.nameTable[parent.parent.split("laneStack")[0]];
                    if (swimlane && swimlane.isSwimlane) {
                        this._enableConnectorUpdate(diagram, swimlane);
                    }
                }
                else if (parent.type == "bpmn") {
                    this._enableConnectorUpdate(diagram, parent);
                }
                else if (parent.container && parent.container.type === "canvas") {
                    this._enableConnectorUpdate(diagram, parent);
                }
            }
        },
        _enableConnectorUpdatePhase: function (diagram, phase) {
            if (phase && (phase.isPhase || phase.type === "phase")) {
                var swimlane = diagram.nameTable[phase.parent.split("phaseStack")[0]];
                if (swimlane && swimlane.isSwimlane) {
                    this._enableConnectorUpdate(diagram, swimlane);
                }
            }
        },
        _enableConnectorUpdateLane: function (diagram, lane) {
            if (lane && lane.isLane) {
                var swimlane = diagram.nameTable[lane.parent.split("laneStack")[0]];
                if (swimlane && swimlane.isSwimlane) {
                    this._enableConnectorUpdate(diagram, swimlane);
                }
            }
        },
        //#endregion

        //#region dragging multiNode

        _outOfBoundaryMultiNodeDrop: function (diagram, pseudoGroup) {
            var state = true;
            if (ej.datavisualization.Diagram.Util.canMoveOutofBoundary(diagram)) {
                if (pseudoGroup && pseudoGroup.type === "pseudoGroup") {
                    var child, targets, container;
                    var children = pseudoGroup.children;
                    for (var i = 0; i < children.length; i++) {
                        child = diagram.nameTable[diagram._getChild(children[i])];
                        targets = this._getTargets(diagram, child);
                        if (targets && targets.length > 0 && !child.segments) {
                            container = this._getContainerFromTarget(diagram, targets, child);
                            if (container) {
                                if (!this._isExeedBounds(diagram, child, container))
                                    return false
                            }
                        }
                    }
                }
            }
            return state;
        },

        _multiNodedrag: function (diagram, evt, pseudoGroup) {
            if (this._outOfBoundaryMultiNodeDrop(diagram, pseudoGroup)) {
                if (pseudoGroup) {
                    diagram._disableSwimlaneUptate = true;
                    this._disableConnectorUpdate(diagram);
                    if (pseudoGroup.children.length > 0) {
                        var child, targets, container;
                        var children = pseudoGroup.children;
                        for (var i = 0; i < children.length; i++) {
                            child = diagram.nameTable[diagram._getChild(children[i])];
                            if (child && !(child.type === "connector" || child.segments)) {
                                targets = this._getTargets(diagram, child);
                                if (targets && targets.length > 0) {
                                    container = this._getContainerFromTarget(diagram, targets, child);
                                    if (container) {
                                        this._addNodeToContainer(diagram, child, container);
                                    }
                                    else
                                        this._addMultiNodeToDiagram(diagram, child);
                                }
                                else
                                    this._addMultiNodeToDiagram(diagram, child);
                            }
                            if (child.parent) {
                                var lane = diagram.nameTable[child.parent];
                                if (lane && lane.isLane) {
                                    var swimlane = diagram.nameTable[lane.parent.split("laneStack")[0]];
                                    if (swimlane) {
                                        if (!diagram._updateSwimlanes) {
                                            diagram._updateSwimlanes = [];
                                        }
                                        if (!diagram._collectionContains(swimlane.name, diagram._updateSwimlanes))
                                            diagram._updateSwimlanes.push(swimlane.name)
                                    }
                                }
                            }
                        }
                    }
                    delete diagram._disableSwimlaneUptate;
                    if (diagram._updateSwimlanes && diagram._updateSwimlanes.length > 0) {
                        for (var m = 0; m < diagram._updateSwimlanes.length; m++) {
                            ej.datavisualization.Diagram.DiagramContext.update(diagram.nameTable[diagram._updateSwimlanes[m]], diagram);
                            ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdate(diagram, diagram.nameTable[diagram._updateSwimlanes[m]]);
                        }
                    }
                    else delete diagram._disableSegmentChange;
                    delete diagram._updateSwimlanes;
                    this._getRedoObject(diagram, pseudoGroup);
                    var entry = { type: "positionchanged", node: jQuery.extend(true, {}, pseudoGroup), undoObject: jQuery.extend(true, {}, diagram.activeTool._undoObject), redoObject: jQuery.extend(true, {}, diagram.activeTool._redoObject), category: "internal", swimlaneMultiSelection: true };
                    diagram.addHistoryEntry(entry);
                    diagram.activeTool._multipleUndo = true;
                    ej.datavisualization.Diagram.Util._updateGroupBounds(pseudoGroup, diagram);
                    diagram.updateSelection();
                }
            }
            else {
                this._updateBoundsExceedNodes(diagram, pseudoGroup, "move");
            }
        },

        _updateBoundsExceedNodes: function (diagram, pseudoGroup, tool) {
            var undoObj = diagram.tools[tool].undoObject;
            var children = pseudoGroup.children;
            pseudoGroup.rotateAngle = undoObj.node.rotateAngle;
            for (var i = 0; i < children.length; i++) {
                var child = undoObj.childTable[children[i]];
                var orgChild = diagram.nameTable[diagram._getChild(children[i])];
                if (child && orgChild) {
                    if (tool === "move") {
                        diagram._translate(orgChild, (child.offsetX - orgChild.offsetX), (child.offsetY - orgChild.offsetY), diagram.nameTable);
                    }
                    else if (tool === "resize") {
                        diagram._translate(orgChild, child.offsetX - orgChild.offsetX, child.offsetY - orgChild.offsetY, diagram.nameTable);
                        diagram.scale(orgChild, (child.width / orgChild.width), (child.height / orgChild.height), ej.datavisualization.Diagram.Point(orgChild.offsetX, orgChild.offsetY), diagram.nameTable);
                    }
                    else if (tool === "rotate") {
                        diagram._translate(orgChild, (child.offsetX - orgChild.offsetX), (child.offsetY - orgChild.offsetY), diagram.nameTable);
                        var newangle = child.rotateAngle - orgChild.rotateAngle;
                        orgChild.rotateAngle += newangle;
                    }
                    if (orgChild._type === "group") {
                        ej.datavisualization.Diagram.Util._updateGroupBounds(orgChild, diagram);
                    }
                    diagram._updateAssociatedConnectorEnds(child, diagram.nameTable);
                    if (child.parent) {
                        var parent = diagram.nameTable[child.parent];
                        if (parent && parent.children.length > 0) {
                            parent.children.push(child.name);
                            orgChild.parent = child.parent;
                        }
                    }
                    ej.datavisualization.Diagram.DiagramContext.update(child, diagram);
                }
            }
            ej.datavisualization.Diagram.Util._updateGroupBounds(pseudoGroup, diagram);
            diagram.updateSelection();
        },
        _getContainerFromTarget: function (diagram, collection, child) {
            var childBounds, tarBounds;
            for (var i = 0; i < collection.length; i++) {
                if (collection[i].container && collection[i].container.type === "canvas") {
                    childBounds = ej.datavisualization.Diagram.Util.bounds(child);
                    tarBounds = ej.datavisualization.Diagram.Util.bounds(collection[i]);
                    if (childBounds.center.x > tarBounds.left && childBounds.center.x < tarBounds.right &&
                        childBounds.center.y > tarBounds.top && childBounds.center.y < tarBounds.bottom
                        ) {
                        return collection[i];
                    }
                }
            }
        },
        _getTargets: function (diagram, child) {
            var bounds = null, childBounds, nodes = [], lane;
            if (child) {
                childBounds = ej.datavisualization.Diagram.Util.bounds(child);
                var quads = ej.datavisualization.Diagram.SpatialUtil.findQuads(diagram._spatialSearch, childBounds);
                for (var i = 0; i < quads.length; i++) {
                    var quad = quads[i];
                    if (quad.objects.length > 0) {
                        for (var j = 0; j < quad.objects.length; j++) {
                            var nd = quad.objects[j];
                            if (!nd.segments && nd.visible) {
                                bounds = ej.datavisualization.Diagram.Util.bounds(nd);
                                if (nodes.indexOf(nd) == -1 && ej.datavisualization.Diagram.Geometry.intersectsRect(childBounds, bounds)) {
                                    if (nd.isSwimlane) {
                                        var lanes = ej.datavisualization.Diagram.SwimLaneContainerHelper.getLanes(diagram, nd);
                                        for (var k in lanes) {
                                            lane = diagram.nameTable[diagram._getChild(lanes[k])];
                                            if (lane)
                                                nodes.splice(0, 0, lane);
                                        }
                                    }
                                    else
                                        nodes.push(nd);
                                }
                            }
                        }
                    }
                }
            }
            return nodes;
        },
        _removeFromParentContainer: function (diagram, pseudoGroup) {
            this._removeNodeFromContainer(diagram, pseudoGroup);
        },
        _removeNodeFromContainer: function (diagram, node, updateParent) {
            diagram._removedFromContiner = true;
            if (node.type !== "pseudoGroup") {
                var parent = diagram.nameTable[node.parent], child;
                if (parent) {
                    var children = parent.children;
                    var prevChildren = children;
                    prevChildren = prevChildren.slice(0);
                    for (var i = 0; i < children.length; i++) {
                        child = diagram.nameTable[diagram._getChild(children[i])];
                        if (child.name === node.name)
                            ej.datavisualization.Diagram.Util.removeChildFromGroup(parent.children, children[i]);
                    }
                    ej.datavisualization.Diagram.SpatialUtil._removeFromaQuad(diagram._spatialSearch, diagram._spatialSearch.quadTable[child.name], child);
                    var resource = { element: parent, cause: diagram.activeTool.inAction ? ej.datavisualization.Diagram.ActionType.Mouse : ej.datavisualization.Diagram.ActionType.Unknown, propertyName: "children", oldValue: prevChildren, newValue: children };
                    diagram._raisePropertyChange(resource);
                    diagram._comparePropertyValues(node, "parent", { parent: "" }, resource.cause);
                    node.parent = "";
                    if (child._type === "group") {
                        ej.datavisualization.Diagram.SvgContext.renderGroup(child, diagram._svg, diagram._diagramLayer, diagram.nameTable, diagram);
                    } else if (child.segments) {
                        ej.datavisualization.Diagram.SvgContext.renderConnector(child, diagram._svg, diagram._diagramLayer);
                    } else {
                        ej.datavisualization.Diagram.SvgContext.renderNode(child, diagram._svg, diagram._diagramLayer, undefined, diagram);
                    }
                    if (!updateParent)
                        ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, parent, true);
                }
            }
            else {
                var children = node.children;
                if (children.length > 0) {
                    this._getUndoObject(diagram, node);
                    for (var i = 0; i < children.length; i++) {
                        var child = diagram.nameTable[diagram._getChild(children[i])];
                        if (child) {
                            this._removeNodeFromContainer(diagram, child, true);
                        }
                    }
                    if (child.parent)
                        var parent = diagram.nameTable[child.parent];
                    if (parent)
                        ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, parent, true);
                }
            }
        },
        _addDrgaHistoryEntry: function (diagram, node) {
            var childTable = {};
            var childTable = diagram._getChildTable(node, childTable);
            diagram.activeTool._multipleUndo = true;
            var entry = { type: "positionchanged", node: jQuery.extend(true, {}, node), childTable: childTable, category: "internal", swimlaneMultiSelection: true };
            diagram.addHistoryEntry(entry);
        },

        _cloneNode: function (diagram, node, name) {
            if (node) {
                node = $.extend(true, {}, node);
                node.name += name;
                node.parent += name;
                if (node.children && node.children.length > 0) {
                    var child;
                    var children = node.children;
                    for (var i = 0; i < children.length; i++) {
                        child = diagram.nameTable[diagram._getChild(children[i])];
                        if (child) {
                            node.children[i] = this._cloneNode(diagram, child, name)
                        }
                    }
                }
                return node;
            }
        },

        _isExeedBounds: function (diagram, node, overNode) {
            diagram._disableUpdateQuad = true;
            if (node && overNode && overNode.isLane) {
                var swimlane = diagram.nameTable[overNode.parent.split("laneStack")[0]];
                if (swimlane) {
                    var randomId = ej.datavisualization.Diagram.Util.randomId();
                    var clSwimlane = diagram._cloneSwimlaneObj(diagram._getNode(swimlane.name), randomId);
                    clSwimlane = ej.datavisualization.Diagram.ContainerHelper._initContainer(diagram, clSwimlane);
                    var clNode = this._cloneNode(diagram, node, randomId)
                    diagram.nameTable[clNode.name] = clNode;
                    var clLane = diagram.nameTable[overNode.name + randomId];
                    if (clLane) {
                        clLane.children.push(clNode.name);
                        this._updateNodeMargin(diagram, clNode, diagram.nameTable[overNode.name + randomId]);
                        diagram._disableSwimlaneUptate = true;
                        this._disableConnectorUpdate(diagram);
                        ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, clLane);
                        ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, clSwimlane);
                        delete diagram._disableSegmentChange;
                        delete diagram._disableSwimlaneUptate
                        var clSwimlaneBounds = ej.datavisualization.Diagram.Util.bounds(clSwimlane);
                        ej.datavisualization.Diagram.containerCommon._removeObject(diagram, clLane);
                        ej.datavisualization.Diagram.containerCommon._removeObject(diagram, clSwimlane);
                        delete diagram._disableUpdateQuad;
                        var size = diagram.activeTool._getPageBounds();
                        if (clSwimlaneBounds.bottom > size.height)
                            return false
                        if (clSwimlaneBounds.right > size.width)
                            return false
                        clLane.children.pop(clNode.name);
                    }
                    diagram.nameTable[clNode.name]
                }
            }
            delete diagram._disableUpdateQuad;
            return true;
        },

        _outOfBoundaryNodeDrop: function (diagram, node, overNode) {
            if (ej.datavisualization.Diagram.Util.canMoveOutofBoundary(diagram)) {
                return this._isExeedBounds(diagram, node, overNode);
            }
            return true;
        },
        _getAssociatedConnectors: function (diagram, node, list) {
            var list = list || [], i = 0, connector;
            if (node && !node.segments) {
                if (node.children && node.children.length > 0) {
                    for (i = 0; i < node.children.length; i++) {
                        this._getAssociatedConnectors(diagram, diagram.nameTable[diagram._getChild(node.children[i])], list);
                    }
                }
                for (i = 0; i < node.inEdges.length; i++) {
                    connector = diagram.nameTable[diagram._getChild(node.inEdges[i])];
                    if (connector)
                        list.push($.extend(true, {}, connector));
                }
                for (i = 0; i < node.outEdges.length; i++) {
                    connector = diagram.nameTable[diagram._getChild(node.outEdges[i])];
                    if (connector)
                        list.push($.extend(true, {}, connector));
                }
            }
            return list;
        },
        _addNodeToContainer: function (diagram, node, overNode, updateParent, enableConnectorUpdate) {
            if (diagram.getObjectType(node) !== "connector") {
                if (node && overNode && !node.isPhase) {
                    if (node.parent) {
                        var oGroup = diagram.nameTable[node.parent];
                        if (!oGroup.container) {
                            var oChjildren = oGroup.children;
                            ej.datavisualization.Diagram.Util.removeFromCollection(diagram, oChjildren, node);
                            ej.datavisualization.Diagram.Util._updateGroupBounds(oGroup, diagram);
                        }
                    }
                    if (node.type !== "pseudoGroup") {
                        var nodeBounds = ej.datavisualization.Diagram.Util.bounds(diagram.activeTool.helper);
                        var selObjBounds = ej.datavisualization.Diagram.Util.bounds(diagram.activeTool.selectedObject);
                        var diffX = diagram.activeTool.helper ? nodeBounds.x - selObjBounds.x : 0;
                        var diffY = diagram.activeTool.helper ? nodeBounds.y - selObjBounds.y : 0;
                        diagram._raiseOffsetPropertyChange(node, node.offsetX + diffX, node.offsetY + diffY, true);
                        diagram._translate(node, diffX, diffY, diagram.activeTool.diagram.nameTable);
                        var prevChildren = overNode.children;
                        prevChildren = prevChildren.slice(0);
                        overNode.children.push(node);
                        ej.datavisualization.Diagram.Util.removeItem(diagram.nodes(), node);
                        var resource = { element: overNode, cause: diagram.activeTool.inAction ? ej.datavisualization.Diagram.ActionType.Mouse : ej.datavisualization.Diagram.ActionType.Unknown, propertyName: "children", oldValue: prevChildren, newValue: overNode.children };
                        diagram._raisePropertyChange(resource);
                        diagram._comparePropertyValues(node, "parent", { parent: overNode.name }, resource.cause);
                        node.parent = overNode.name;
                        this._updateNodeMargin(diagram, node, overNode);
                        if (diagram._isDragg) {
                            var historyList = diagram._historyList;
                            if (historyList) {
                                if (historyList.currentEntry && historyList.currentEntry.object && historyList.currentEntry.object.parent === "")
                                    historyList.currentEntry.object = $.extend(true, {}, node);
                            }
                        }
                        var parentElement = diagram._svg.getElementById(overNode.name);
                        if (node._type === "group") {
                            ej.datavisualization.Diagram.DiagramContext.renderGroup(node, diagram, parentElement);
                        } else if (node.segments) {
                            //ej.datavisualization.Diagram.DiagramContext.renderConnector(node, diagram, parentElement);
                        } else {
                            ej.datavisualization.Diagram.DiagramContext.renderNode(node, diagram, parentElement);
                        }
                        this._disableConnectorUpdate(diagram);
                        if (!updateParent) {
                            var undoObject;
                            if (overNode.type == "bpmn") undoObject = $.extend(true, {}, { node: overNode });
                            var prevObj = jQuery.extend(true, {}, overNode)
                            ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, overNode, true);
                            this._updateAddRemoveNodeConnectors(diagram, overNode, prevObj);
                            if (overNode.type == "bpmn") {
                                diagram._isGroupActionEnabled = true;
                                diagram._startGroupAction();
                                var entry = { type: "sizechanged", node: jQuery.extend(true, {}, overNode), undoObject: undoObject, redoObject: $.extend(true, {}, { node: overNode }), category: "internal" };
                                diagram.addHistoryEntry(entry);
                            }
                        }
                        var connectors = this._getAssociatedConnectors(diagram, node);
                        if (connectors.length > 0) {
                            for (i = 0; i < connectors.length; i++) {
                                var element = diagram._svg.getElementById(connectors[i].name);
                                diagram._removeElement(connectors[i]);
                                this._zOrder++
                                connectors[i].zOrder = this._zOrder;
                                ej.datavisualization.Diagram.DiagramContext.renderConnector(connectors[i], diagram);
                            }
                        }
                        this._updateLastSwimlanePhase(diagram, node);
                        if (!enableConnectorUpdate)
                            this._enableConnectorUpdateNode(diagram, node);
                        if (diagram._findLabelEditing)
                            overNode.children.splice(overNode.children.indexOf(node.name), 1);
                    }
                    else {
                        var children = node.children;
                        if (children.length > 0) {
                            for (var i = 0; i < children.length; i++) {
                                var child = diagram.nameTable[diagram._getChild(children[i])];
                                if (child) {
                                    this._addNodeToContainer(diagram, child, overNode, true)
                                }
                            }
                            if (child && child.parent)
                                var parent = diagram.nameTable[child.parent];
                            if (parent) {
                                ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, parent, true);
                                ej.datavisualization.Diagram.Util._updateGroupBounds(node, diagram);
                                ej.datavisualization.Diagram.SvgContext.updateSelector(node, diagram._adornerSvg, diagram._currZoom, diagram, diagram.model.selectedItems.constraints);
                            }
                        }
                    }
                }
            }
        },
        _addMultiNodeToDiagram: function (diagram, child) {
            if (diagram.activeTool.helper) {
                var nodeBounds = ej.datavisualization.Diagram.Util.bounds(diagram.activeTool.helper);
                var selObjBounds = ej.datavisualization.Diagram.Util.bounds(child);
                var diffX = diagram.activeTool.helper ? nodeBounds.x - selObjBounds.x : 0;
                var diffY = diagram.activeTool.helper ? nodeBounds.y - selObjBounds.y : 0;
                diagram._translate(child, diffX, diffY, diagram.nameTable);
            }
            var nodes = diagram.nodes();
            for (var i = nodes.length - 1; i >= 0; i--) {
                var node = diagram.nameTable[diagram._getChild(nodes[i])];
                if (child.name === node.name)
                    ej.datavisualization.Diagram.Util.removeItem(nodes, nodes[i]);
            }
            diagram.nodes().push(child);
            if (diagram._removedFromContiner) {
                if (child._type === "group") {
                    ej.datavisualization.Diagram.SvgContext.renderGroup(child, diagram._svg, diagram._diagramLayer, diagram.nameTable, diagram);
                } else if (child.segments) {
                    ej.datavisualization.Diagram.SvgContext.renderConnector(child, diagram._svg, diagram._diagramLayer);
                } else {
                    ej.datavisualization.Diagram.SvgContext.renderNode(child, diagram._svg, diagram._diagramLayer, undefined, diagram);
                }
            }
            delete diagram._removedFromContiner;
            if (diagram.activeTool.helper) {
                this._updateLastSwimlanePhase(diagram, diagram.activeTool.helper);
            }
        },
        //#endregion

        //#region resizing singleNode
        _singleNodeResize: function (diagram, evt, node) {
            if (diagram.activeTool.selectedObject) {
                this._resizeNode(diagram, node);
            }
        },
        _resizeNode: function (diagram, node) {
            if (node) {
                var nodeBounds = ej.datavisualization.Diagram.Util.bounds(node);
                var helperBounds = ej.datavisualization.Diagram.Util.bounds(diagram.activeTool.helper);
                var updateChild = true;
                if ((!node.isLane)) {
                    if (node.parent == "") {
                        if (node._parent) {
                            node.parent = node._parent;
                            delete node._parent;
                            updateChild = false;
                        }
                    }
                    if (!node.segments) {
                        if (node.parent)
                            var parent = diagram.nameTable[node.parent];
                        if (parent && parent.isLane) {
                            this._disableConnectorUpdate(diagram);
                        }
                        if (updateChild)
                            diagram.activeTool._updateSize(node, diagram.activeTool.startPoint, diagram.activeTool.currentPoint);
                        if (parent) {
                            this._updateNodeMargin(diagram, node, parent);
                            ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, parent, true);
                            this._updateLastSwimlanePhase(diagram, node);
                        }
                        this._enableConnectorUpdateNode(diagram, node);
                    }
                }
            }
        },
        _updateResizeHelper: function (diagram) {
            if (!diagram.activeTool.helper) {
                diagram.activeTool.helper = diagram.activeTool._getCloneNode(diagram.activeTool.selectedObject);
                diagram.activeTool.helper.inEdges = diagram.activeTool.helper.outEdges = [];
                diagram.activeTool.helper.type = null;
                diagram.activeTool.helper.name = "helper";
                ej.datavisualization.Diagram.SvgContext._drawContainerHelper(diagram);
                diagram.activeTool._startPoint = diagram.activeTool.currentPoint;
                diagram._resizeStack = true;
                diagram.activeTool._updateSize(diagram.activeTool.helper, diagram.activeTool.previousPoint, diagram.activeTool.currentPoint, null, null, null, true);
                delete diagram._resizeStack;
            } else {
                var groupBounds123 = ej.datavisualization.Diagram.Util.bounds(diagram.activeTool.helper);
                diagram._resizeStack = true;
                diagram.activeTool._updateSize(diagram.activeTool.helper, diagram.activeTool.previousPoint, diagram.activeTool.currentPoint, null, null, null, true);
                delete diagram._resizeStack;
                var groupBounds1231 = ej.datavisualization.Diagram.Util.bounds(diagram.activeTool.helper);
                if (diagram.activeTool.selectedObject.container && !diagram.activeTool.helper._isBpmn)
                    diagram._translate(diagram.activeTool.helper, groupBounds123.topLeft.x - groupBounds1231.topLeft.x, groupBounds123.topLeft.y - groupBounds1231.topLeft.y, diagram.nameTable);
                ej.datavisualization.Diagram.SvgContext._updateContainerHelper(diagram);
            }
        },
        //#endregion

        //#region resizing multiNode

        _multiNodeResize: function (diagram, evt, pseudoGroup) {
            if (pseudoGroup) {
                if (this._outOfBoundaryMultiNodeDrop(diagram, pseudoGroup)) {
                    if (pseudoGroup.children.length > 0) {
                        var child, targets, container;
                        var children = pseudoGroup.children;
                        for (var i = 0; i < children.length; i++) {
                            child = diagram.nameTable[diagram._getChild(children[i])];
                            targets = this._getTargets(diagram, child);
                            if (targets && targets.length > 0) {
                                container = this._getContainerFromTarget(diagram, targets, child);
                                if (container) {
                                    this._addNodeToContainer(diagram, child, container);
                                }
                                else this._addMultiNodeToDiagram(diagram, child);
                            }
                            else this._addMultiNodeToDiagram(diagram, child);
                        }
                    }
                    this._getRedoObject(diagram, pseudoGroup);
                    var entry = { type: "sizechanged", node: jQuery.extend(true, {}, pseudoGroup), undoObject: jQuery.extend(true, {}, diagram.activeTool._undoObject), redoObject: jQuery.extend(true, {}, diagram.activeTool._redoObject), category: "internal", swimlaneMultiSelection: true };
                    diagram.addHistoryEntry(entry);
                    diagram.activeTool._multipleUndo = true;
                    ej.datavisualization.Diagram.Util._updateGroupBounds(pseudoGroup, diagram);
                    diagram.updateSelection();
                }
                else {
                    this._updateBoundsExceedNodes(diagram, pseudoGroup, "resize");
                }
            }
        },
        //#endregion

        //#region rotate singleNode
        _singleNodeRotate: function (diagram, evt, node) {
            if (diagram.activeTool.selectedObject) {
                this._rotateNode(diagram, node);
            }
        },
        _rotateNode: function (diagram, node) {
            if (node) {
                var updateChild = true;
                if ((!node.container)) {
                    if (node.parent == "") {
                        if (node._parent) {
                            node.parent = node._parent;
                            delete node._parent;
                            updateChild = false;
                        }
                    }
                    if (node.parent)
                        var parent = diagram.nameTable[node.parent];
                    if (parent && parent.isLane) {
                        this._disableConnectorUpdate(diagram);
                    }
                    if (!node.segments) {
                        if (updateChild) {
                            var object = diagram.nameTable[diagram.activeTool.selectedObject.name];
                            if (diagram.activeTool.helper) {
                                var difAngle = diagram.activeTool.helper.rotateAngle - diagram.nameTable[diagram.activeTool.selectedObject.name].rotateAngle;
                                diagram._comparePropertyValues(node, "rotateAngle", { rotateAngle: diagram.activeTool.helper.rotateAngle }, true);
                                diagram._rotate(diagram.activeTool.selectedObject, difAngle, diagram.nameTable);
                            }
                        }

                        if (parent) {
                            this._updateNodeMargin(diagram, node, parent);
                            ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, parent, true);
                            this._updateLastSwimlanePhase(diagram, node);
                        }
                        this._enableConnectorUpdateNode(diagram, node);
                    }
                }
            }
        },
        //#endregion

        //#region rotate multiNode
        _multiNodeRotate: function (diagram, evt, pseudoGroup) {
            if (pseudoGroup) {
                if (this._outOfBoundaryMultiNodeDrop(diagram, pseudoGroup)) {
                    if (pseudoGroup.children.length > 0) {
                        var child, targets, container;
                        var children = pseudoGroup.children;
                        for (var i = 0; i < children.length; i++) {
                            child = diagram.nameTable[diagram._getChild(children[i])];
                            targets = this._getTargets(diagram, child);
                            if (targets && targets.length > 0) {
                                container = this._getContainerFromTarget(diagram, targets, child);
                                if (container) {
                                    this._addNodeToContainer(diagram, child, container);
                                }
                                else this._addMultiNodeToDiagram(diagram, child);
                            }
                            else this._addMultiNodeToDiagram(diagram, child);
                        }
                    }
                    this._getRedoObject(diagram, pseudoGroup);
                    var entry = { type: "rotationchanged", node: jQuery.extend(true, {}, pseudoGroup), undoObject: jQuery.extend(true, {}, diagram.activeTool._undoObject), redoObject: jQuery.extend(true, {}, diagram.activeTool._redoObject), category: "internal", swimlaneMultiSelection: true };
                    diagram.addHistoryEntry(entry);
                    diagram.activeTool._multipleUndo = true;
                    ej.datavisualization.Diagram.Util._updateGroupBounds(pseudoGroup, diagram);
                    diagram.updateSelection();
                }
                else {
                    this._updateBoundsExceedNodes(diagram, pseudoGroup, "rotate");
                }
            }
        },
        //#endregion

        //#region add New Lane
        _updateDropLaneProperties: function (diagram, lane, swimlane) {
            if (lane && swimlane) {
                lane.orientation = swimlane.orientation;
                lane.horizontalAlign = swimlane.orientation === "horizontal" ? "stretch" : "left";
                lane.verticalAlign = swimlane.orientation === "vertical" ? "stretch" : "top";
                lane.paddingBottom = 20;
                lane.paddingTop = 20;
                lane.paddingLeft = 20;
                lane.paddingRight = 20;
                var header = diagram.nameTable[diagram._getChild(lane.children[0])];
                if (header) {
                    header.marginLeft = -20;
                    header.marginTop = -20;
                    header.marginRight = -20;
                    header.marginBottom = -20;
                    header.constraints = ej.datavisualization.Diagram.NodeConstraints.Default ^ ej.datavisualization.Diagram.NodeConstraints.Select ^ ej.datavisualization.Diagram.NodeConstraints.Connect;
                    header._isHeader = true;
                }
            }
            return lane;
        },
        _updateAddRemoveNodeConnectors: function (diagram, orgNode, dupNode) {
            if (orgNode && orgNode.isLane && dupNode && dupNode.isLane) {
                var xdiff = 0, ydiff = 0;
                xdiff = orgNode.width - dupNode.width;
                ydiff = orgNode.height - dupNode.height;
                if (xdiff || ydiff)
                    this._updateOverlappedConnectorSegment(diagram, dupNode, xdiff, ydiff);
            }
        },

        _updateAddRemoveLaneConnectors: function (diagram, lane) {
            if (lane && lane.isLane) {
                var swimConnectors = [], connector, swimlane, lanes, i, lane;
                swimlane = this._getSwimlane(diagram, lane.name);
                lanes = swimlane.lanes;
                for (i = 0 ; i < lanes.length ; i++) {
                    lane = diagram.nameTable[diagram._getChild(lanes[i])];
                    this._laneConnectors(diagram, lane, swimConnectors)
                }
                for (i = 0 ; i < swimConnectors.length ; i++) {
                    connector = diagram.nameTable[diagram._getChild(swimConnectors[i])];
                    if (connector) {
                        this._updateConnectorEndPoints(diagram, connector);
                    }
                }
            }
        },
        _outOfBoundaryAddLane: function (diagram, swimlane, lane, index) {

            if (ej.datavisualization.Diagram.Util.canMoveOutofBoundary(diagram)) {
                var clSwimlane = diagram._cloneSwimlaneObj(diagram._getNode(swimlane.name), ej.datavisualization.Diagram.Util.randomId());
                clSwimlane = ej.datavisualization.Diagram.ContainerHelper._initContainer(diagram, clSwimlane);
                var clLane = diagram.activeTool._cloneGroupNode($.extend(true, {}, lane), ej.datavisualization.Diagram.Util.randomId());
                //clLane.children = [];
                diagram.nameTable[clLane.name] = clLane;
                var stack = diagram.nameTable[diagram._getChild(clSwimlane.children[2])];
                if (index || index === 0) {
                    stack.children.splice(index, 0, clLane.name);
                }
                else
                    stack.children.push(clLane.name);
                clLane.parent = stack.name;
                diagram._disableSwimlaneUptate = true;
                this._disableConnectorUpdate(diagram);
                ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, clLane);
                ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, clSwimlane);
                this._enableConnectorUpdate(diagram, clSwimlane);


                delete diagram._disableSwimlaneUptate

                var clSwimlaneBounds = ej.datavisualization.Diagram.Util.bounds(clSwimlane);
                ej.datavisualization.Diagram.containerCommon._removeObject(diagram, clLane);
                ej.datavisualization.Diagram.containerCommon._removeObject(diagram, clSwimlane);

                var size = diagram.activeTool._getPageBounds();
                if (clSwimlaneBounds.bottom > size.height)
                    return false
                if (clSwimlaneBounds.right > size.width)
                    return false
            }
            return true;
        },

        _addNewLane: function (diagram, overNode, swimlane, updateName, index) {
            diagram.activeTool._removeHelpers();
            var addSelection;
            var stack = diagram.nameTable[diagram._getChild(swimlane.children[2])];
            if (stack) {
                var selctObject = diagram.activeTool._cloneGroupNode(diagram.activeTool.selectedObject, updateName ? "" : ej.datavisualization.Diagram.Util.randomId());
                selctObject = this._updateDropLaneProperties(diagram, selctObject, swimlane);
                var _undo = diagram._isUndo; diagram._isUndo = true;
                diagram.activeTool.selectedObject = null;
                diagram.remove(diagram.activeTool.selectedObject);
                //ej.datavisualization.Diagram.containerCommon._removeObject(diagram, diagram.activeTool.selectedObject);
                diagram._isUndo = _undo;
                if (diagram._isUndo || this._outOfBoundaryAddLane(diagram, swimlane, selctObject, index)) {
                    var isLaneAdded = false;
                    var args = { element: diagram.getNode(selctObject), cancel: false, target: overNode };
                    if (overNode)
                        var index = index !== undefined ? index : diagram.activeTool._getSwimLaneStackIndex(overNode);
                    if (index || index === 0) {
                        stack.children.splice(index, 0, selctObject);
                    }
                    else
                        stack.children.push(selctObject);
                    selctObject.parent = stack.name;
                    if (!diagram._isUndo)
                        diagram._raiseDropEvent(args);
                    diagram.remove(selctObject);
                    if (!args.cancel) {
                        diagram.activeTool._isLane = true;
                        if (selctObject.isLane) {
                            var header = diagram.nameTable[diagram._getChild(selctObject.children[0])];
                            if (header && selctObject.labels && header.labels.length > 0) {
                                for (var j = 0; j < header.labels.length; j++)
                                    header.labels[j].visible = true;
                            }
                        }
                        if (!diagram._isUndo) {
                            var childTable = diagram._getChildTable(selctObject, {});
                            var entry = { type: "collectionchanged", object: jQuery.extend(true, {}, selctObject), childTable: jQuery.extend(true, {}, childTable), index: index, changeType: "insert", category: "internal" };
                            diagram.addHistoryEntry(entry);
                        }
                        diagram._preventHistoryEntry = true;
                        if (diagram.add(selctObject)) {
                            isLaneAdded = true;
                            diagram._updateDroppedSymbol(selctObject);
                        }
                        delete diagram._preventHistoryEntry;
                    }
                    this._disableConnectorUpdate(diagram);
                    ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, stack);
                    this._updateAddRemoveLaneConnectors(diagram, selctObject)
                    ej.datavisualization.Diagram.canvasHelper._updateLastPhase(diagram, swimlane);
                    this._enableConnectorUpdateLane(diagram, selctObject);
                    if (isLaneAdded) {
                        var cause = diagram._isUndo ? ej.datavisualization.Diagram.GroupChangeCause.HistoryChange : ej.datavisualization.Diagram.GroupChangeCause.Drop;
                        var args = { changeType: "insert", element: diagram.getNode(selctObject), state: "changed", cause: cause };
                        diagram._raiseEvent("nodeCollectionChange", args);
                    }
                    addSelection = true;
                }
                diagram._clearSelection(true);
                if (addSelection)
                    diagram._addSelection(swimlane, true);
                diagram.activeTool.selectedObject = null;
                //diagram.selectionList = [];
                //diagram.selectionList.push(swimlane);
            }
        },
        //#endregion

        //#region resize lane

        _outOfBoundsOnLaneResize: function (diagram, node, isLane) {
            if (ej.datavisualization.Diagram.Util.canMoveOutofBoundary(diagram)) {
                if (isLane) {
                    var swimlane = diagram.nameTable[node.parent.split("laneStack")[0]];
                }
                else
                    swimlane = node;
                var randomId = ej.datavisualization.Diagram.Util.randomId();
                if (swimlane) {
                    var clSwimlaneBounds = ej.datavisualization.Diagram.Util.bounds(swimlane);
                    var widthDx = 0, heightDx = 0;
                    if (node.height != diagram.activeTool.helper.height)
                        heightDx = diagram.activeTool.helper.height - node.height
                    if (node.width != diagram.activeTool.helper.width)
                        widthDx = diagram.activeTool.helper.width - node.width
                    var size = diagram.activeTool._getPageBounds();
                    if ((clSwimlaneBounds.bottom + heightDx) > size.height)
                        return false
                    if ((clSwimlaneBounds.right + widthDx) > size.width)
                        return false
                }
            }
            return true;
        },
        _getLaneIndex: function (swimlane, lane) {
            var lanes = swimlane.lanes, i;
            for (i = 0; i < lanes.length; i++) {
                if (lane.name === lanes[i].name)
                    return i;
            }
            return null;
        },

        _isCanAddNodeToSegmentUpdate: function (diagram, index, node) {
            if (node) {
                if (node && node.parent) {
                    var lane = diagram.nameTable[node.parent], swimlane, lIndex;
                    if (lane && lane.isLane) {
                        swimlane = this._getSwimlane(diagram, lane.name);
                        lIndex = this._getLaneIndex(swimlane, lane);
                        if (lIndex > index) {
                            return true;
                        }
                    }
                    else return false;
                }
                else return false;
            }
            return false;
        },
        _getUpdateConnectorByEdges: function (diagram, node, index, connectors) {
            if (node) {
                this._getUpdateSegmentConnectors(diagram, node, index, connectors, node.inEdges)
                this._getUpdateSegmentConnectors(diagram, node, index, connectors, node.outEdges)
            }
        },
        _getUpdateSegmentConnectors: function (diagram, node, index, connectors, edges) {
            if (edges && edges.length > 0) {
                var line, sNode, tNode;
                for (var i = 0; i < edges.length; i++) {
                    line = diagram.nameTable[edges[i]];
                    if (line.sourceNode)
                        sNode = diagram.nameTable[line.sourceNode];
                    if (line.targetNode)
                        tNode = diagram.nameTable[line.targetNode];
                    if (sNode && tNode) {
                        if (this._isCanAddNodeToSegmentUpdate(diagram, index, sNode) && this._isCanAddNodeToSegmentUpdate(diagram, index, tNode) && !diagram._collectionContains(line.name, connectors))
                            connectors.push(line);
                    }
                }
            }
        },
        _updateConnectorSegments: function (diagram, node, dx, dy) {
            var swimlane = this._getSwimlane(diagram, node.name), index, connectors, lanes, i, children, j;
            index = this._getLaneIndex(swimlane, node);
            if (index != null) {
                connectors = [];
                lanes = swimlane.lanes;
                for (i = index + 1; i < lanes.length; i++) {
                    children = lanes[i].children;
                    for (j = 0; j < children.length; j++) {
                        this._getUpdateConnectorByEdges(diagram, children[j], index, connectors);
                    }
                }
            }
            if (connectors && connectors.length > 0 && dx != null && dy != null) {
                for (i = 0; i < connectors.length; i++) {
                    ej.datavisualization.Diagram.Util._translateLine(connectors[i], dx, dy, connectors[i]);

                }
            }
        },
        _resizeLane: function (diagram, node) {
            var object = diagram.nameTable[node.name];
            var needUpdate = true;
            if (object) {
                if (object.isLane || object._isBpmn) {
                    if (this._outOfBoundsOnLaneResize(diagram, object, true)) {
                        if (object.type == "bpmn" && object.container) {
                            var helper = diagram.activeTool.helper;
                            var scaleX = helper.width / node.width, scaleY = helper.height / node.height, offset = { x: node.offsetX, y: node.offsetY };
                            diagram._raiseSizePropertyChange(node, helper.width / node.width, helper.height / node.height, true);
                            diagram.activeTool._undoObject = $.extend(true, {}, { node: object });
                            object = $.extend(true, object, { width: helper.width, height: helper.height, offsetX: helper.offsetX, offsetY: helper.offsetY, minWidth: helper.width, minHeight: helper.height });
                            if (object.parent) {
                                var parent = ej.datavisualization.Diagram.ContainerHelper.updateparent(object, diagram);
                                if (parent) {
                                    object.minWidth = diagram.activeTool.helper.width;
                                    object.minHeight = diagram.activeTool.helper.height;
                                    ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, object, true);
                                    this._updateLastSwimlanePhase(diagram, object);
                                }
                                else
                                    ej.datavisualization.Diagram.bpmnHelper.updateCanvas(object, diagram);
                            }
                            else
                                ej.datavisualization.Diagram.bpmnHelper.updateCanvas(object, diagram);
                            ej.datavisualization.Diagram.DefautShapes.translateBPMNAnnotationShape(object, 1 / scaleX, 1 / scaleY, offset, diagram);
                            diagram.activeTool._redoObject = $.extend(true, {}, { node: object });
                        }
                        else if (object.container) {
                            diagram._raiseSizePropertyChange(node, diagram.activeTool.helper.width / node.width, diagram.activeTool.helper.height / node.height, true);
                            diagram.activeTool._undoObject = $.extend(true, {}, { node: object });
                            diagram._comparePropertyValues(node, "minWidth", { minWidth: diagram.activeTool.helper.width }, true);
                            diagram._comparePropertyValues(node, "offsetX", { offsetX: node.offsetX + diagram.activeTool.helper.width / 2 }, true);
                            object.minWidth = diagram.activeTool.helper.width <= 100 ? 100 : diagram.activeTool.helper.width;
                            diagram._comparePropertyValues(node, "minHeight", { minHeight: diagram.activeTool.helper.height }, true);
                            diagram._comparePropertyValues(node, "offsetY", { offsetY: node.offsetY + diagram.activeTool.helper.height / 2 }, true);
                            object.minHeight = diagram.activeTool.helper.height <= 100 ? 100 : diagram.activeTool.helper.height;
                            diagram.activeTool._redoObject = $.extend(true, {}, { node: object });
                        }
                        var entry = { type: "sizechanged", node: jQuery.extend(true, {}, object), undoObject: jQuery.extend(true, {}, diagram.activeTool._undoObject), redoObject: jQuery.extend(true, {}, diagram.activeTool._redoObject), category: "internal" };
                        diagram.addHistoryEntry(entry);
                        diagram.activeTool._multipleUndo = true;
                        if (object.isLane) {
                            this._disableConnectorUpdate(diagram);
                            ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, object, true);
                            var xdiff = object.width - diagram.activeTool._undoObject.node.width, ydiff = object.height - diagram.activeTool._undoObject.node.height, _preventDocking, _disableSegmentChange;
                            _preventDocking = diagram._preventDocking;
                            _disableSegmentChange = diagram._disableSegmentChange
                            delete diagram._preventDocking;
                            delete diagram._disableSegmentChange
                            this._updateOverlappedConnectorSegment(diagram, diagram.activeTool._undoObject.node, xdiff, ydiff);
                            diagram._preventDocking = _preventDocking;
                            diagram._disableSegmentChange = _disableSegmentChange;
                            this._updateConnectorSegments(diagram, object, xdiff, ydiff);
                            this._enableConnectorUpdateLane(diagram, object);
                        }
                    }
                }
                else if (object.isSwimlane) {
                    var lanes = ej.datavisualization.Diagram.SwimLaneContainerHelper.getLanes(diagram, object), minLaneSize;
                    if (lanes.length > 0) {
                        var lastLane = diagram.nameTable[diagram._getChild(lanes[lanes.length - 1])];
                        if (lastLane) {
                            diagram.activeTool._undoObject = $.extend(true, {}, { node: lastLane });
                            diagram._raiseSizePropertyChange(object, diagram.activeTool.helper.width / object.width, diagram.activeTool.helper.height / object.height, true);
                            if (object.orientation === "vertical") {
                                minLaneSize = lastLane.width + diagram.activeTool.helper.width - object.width;
                                diagram._comparePropertyValues(lastLane, "minWidth", { minWidth: minLaneSize }, true);
                                diagram._comparePropertyValues(lastLane, "offsetX", { offsetX: node.offsetX + minLaneSize / 2 }, true);
                                lastLane.minWidth = minLaneSize <= 100 ? 100 : minLaneSize;
                            }
                            else {
                                minLaneSize = lastLane.height + diagram.activeTool.helper.height - object.height
                                if (minLaneSize == lastLane.minHeight) {
                                    needUpdate = false;
                                }
                                else {
                                    diagram._comparePropertyValues(lastLane, "minHeight", { minHeight: minLaneSize }, true);
                                    diagram._comparePropertyValues(lastLane, "offsetY", { offsetY: node.offsetY + minLaneSize / 2 }, true);
                                    lastLane.minHeight = minLaneSize <= 100 ? 100 : minLaneSize;
                                }
                            }
                            if (needUpdate) {
                                this._disableConnectorUpdate(diagram);
                                ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, lastLane, true);
                                this._enableConnectorUpdateLane(diagram, object);
                                diagram.activeTool._redoObject = $.extend(true, {}, { node: lastLane });

                                var entry = { type: "sizechanged", node: jQuery.extend(true, {}, object), undoObject: jQuery.extend(true, {}, diagram.activeTool._undoObject), redoObject: jQuery.extend(true, {}, diagram.activeTool._redoObject), category: "internal" };
                                diagram.addHistoryEntry(entry);
                                diagram.activeTool._multipleUndo = true;
                                this._disableConnectorUpdate(diagram);
                                ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, object, true);
                                this._enableConnectorUpdateLane(diagram, object);
                            }
                        }
                    }
                }
                else if (object.container) {
                    object.minWidth = diagram.activeTool.helper.width;
                    object.minHeight = diagram.activeTool.helper.height;
                    ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, object, true);
                }
            }
        },

        _updateOverlappedConnectorSegment: function (diagram, lane, xdiff, ydiff) {
            if (lane) {
                var start, end, interSectors, i, interSectSegments, j, connectorName, segmentindex, connector, length;
                if (xdiff != undefined && ydiff != undefined)
                    var ovrConncts = this._overLappedConnectros(diagram, lane);
                if (ovrConncts && ovrConncts.length > 0) {
                    var bounds = ej.datavisualization.Diagram.Util.bounds(lane);
                    if (lane.orientation === "horizontal") {
                        start = bounds.bottomLeft;
                        end = bounds.bottomRight;
                    }
                    else {
                        start = bounds.topRight;
                        end = bounds.bottomRight;
                    }
                    interSectors = [];
                    for (i = 0; i < ovrConncts.length; i++) {
                        interSectSegments = this._lineSegmentsIntersect(diagram, lane, ovrConncts[i], { start: start, end: end });
                        if (interSectSegments && interSectSegments.length > 0) {
                            for (j = 0; j < interSectSegments.length; j++) {
                                connectorName = Object.keys(interSectSegments[j])[0];
                                segmentindex = interSectSegments[j][connectorName]["index"];
                                var point = interSectSegments[j][connectorName]["point"];
                                connector = diagram.nameTable[diagram._getChild(connectorName)]
                                if (connector && connector.segments && connector.segments.length > 0) {
                                    if (lane.orientation === "horizontal") {
                                        if (connector.segments[segmentindex])
                                            length = connector.segments[segmentindex].length;
                                        if (length) {
                                            connector.segments[segmentindex].length += ydiff
                                        }
                                    }
                                    else {
                                        length = connector.segments[segmentindex].length;
                                        if (length) { connector.segments[segmentindex].length += xdiff }
                                    }
                                    this._updateConnectorEndPoints(diagram, connector);
                                }
                            }
                        }
                    }
                }
            }
        },

        _lineSegmentsIntersect: function (diagram, lane, connector, line1, interSectors) {
            var x1, y1, x2, y2, i, segment, j, point1, point2, x3, y3, x4, y4, data, interSectSegments;
            x1 = line1.start.x;
            y1 = line1.start.y;
            x2 = line1.end.x;
            y2 = line1.end.y;
            interSectSegments = [];
            var orientation = (lane && lane.orientation) ? lane.orientation : "horizontal";
            connector = diagram.nameTable[diagram._getChild(connector)];
            if (connector && connector.segments && connector.segments.length > 0) {
                if (connector.segments.length === 1) {
                }
                else {
                    for (i = 0; i < connector.segments.length; i++) {
                        segment = connector.segments[i];
                        if (segment && segment.points.length > 0) {
                            for (j = 0; j < segment.points.length - 1; j++) {
                                point1 = segment.points[j];
                                point2 = segment.points[j + 1];
                                if (point1 && point2) {
                                    x3 = point1.x;
                                    y3 = point1.y;
                                    x4 = point2.x;
                                    y4 = point2.y;
                                    if (this._isInterSecting(x1, y1, x2, y2, x3, y3, x4, y4)) {
                                        data = {
                                        };
                                        var pointindex = j;
                                        if (orientation === "horizontal") {
                                            if (point1.y > y1)
                                                pointindex = -1;
                                        }
                                        else {
                                            if (point1.x > x1)
                                                pointindex = -1;
                                        }
                                        data[connector.name] = {
                                            index: i, point: pointindex
                                        };
                                        interSectSegments.push(data);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return interSectSegments;
        },

        _isInterSecting: function (x1, y1, x2, y2, x3, y3, x4, y4, isCrossing) {
            var a_dx = x2 - x1;
            var a_dy = y2 - y1;
            var b_dx = x4 - x3;
            var b_dy = y4 - y3;
            var s = (-a_dy * (x1 - x3) + a_dx * (y1 - y3)) / (-b_dx * a_dy + a_dx * b_dy);
            var t = (+b_dx * (y1 - y3) - b_dy * (x1 - x3)) / (-b_dx * a_dy + a_dx * b_dy);
            if (isCrossing)
                return (s > 0 && s < 1 && t > 0 && t < 1);
            else
                return (s >= 0 && s <= 1 && t >= 0 && t <= 1);

        },
        _overLappedConnectros: function (diagram, lane) {
            var swimlane = this._getSwimlane(diagram, lane.name);
            var lIndex, lanes, connectors, i, prevLane, j, child, m;
            if (swimlane && swimlane.isSwimlane) {
                lIndex = this._getLaneIndex(swimlane, lane);
                lanes = diagram.nameTable[lane.parent];
                connectors = [];
                if (lanes && lanes.isLaneStack) {
                    if (lanes && lanes.children.length > 0) {
                        for (i = lIndex ; i >= 0; i--) {
                            prevLane = diagram.nameTable[diagram._getChild(lanes.children[i])];
                            if (prevLane && prevLane.isLane) {
                                this._laneConnectors(diagram, prevLane, connectors);
                            }
                        }
                    }
                }
            }
            return connectors;
        },
        //#endregion

        //#region undo dragNode
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
        _undoRemoveNodeFromContainer: function (diagram, node) {
            if (node.type !== "pseudoGroup") {
                var parent = diagram.nameTable[node.parent], child;
                if (parent) {
                    node.parent = "";
                    var children = parent.children, child;
                    for (var i = 0; i < children.length; i++) {
                        child = diagram.nameTable[diagram._getChild(children[i])];
                        if (child) {
                            if (child.name === node.name) {
                                diagram.nodes().push(children[i]);
                                ej.datavisualization.Diagram.Util.removeChildFromGroup(parent.children, children[i]);
                            }
                        }
                    }
                    ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, parent, true);
                }
            }
        },
        _undoAddNodeToContainer: function (diagram, node, object) {
            if (node && node.type !== "pseudoGroup") {
                var parent = diagram.nameTable[object.parent], child, parentElement;
                if (!object.segments)
                    diagram._translate(node, object.offsetX - node.offsetX, object.offsetY - node.offsetY, diagram.nameTable);
                else if (!node.sourceNode && !node.targetNode) {
                    var nodeBounds = ej.datavisualization.Diagram.Util.bounds(node, true);
                    var objectBounds = ej.datavisualization.Diagram.Util.bounds(object, true);
                    ej.datavisualization.Diagram.Util._translateLine(node, objectBounds.center.x - nodeBounds.center.x, objectBounds.center.y - nodeBounds.center.y);
                }
                if (parent) {
                    node.parent = parent.name;
                    parent.children.push(node);
                    ej.datavisualization.Diagram.Util.removeItem(diagram.nodes(), node);
                    parentElement = diagram._svg.getElementById(parent.name);
                    if (parent._isBpmn) {
                        ej.datavisualization.Diagram.bpmnHelper.resetNodeMargin(node, parent, diagram);
                        node = $.extend(true, node, { marginLeft: object.marginLeft, marginRight: object.marginRight, marginTop: object.marginTop, marginBottom: object.marginBottom });
                    }
                    else
                        this._updateNodeMargin(diagram, node, parent);
                    ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, parent, true);
                }
                else {
                    if (!diagram._swimlaneOuterNodes)
                        diagram._swimlaneOuterNodes = [];
                    diagram._swimlaneOuterNodes.push(node);
                }
                if (node._type === "group") {
                    ej.datavisualization.Diagram.DiagramContext.renderGroup(node, diagram, parentElement);
                } else if (node.segments) {
                    ej.datavisualization.Diagram.DiagramContext.renderConnector(node, diagram, parentElement);
                } else {
                    ej.datavisualization.Diagram.DiagramContext.renderNode(node, diagram, parentElement);
                }
            }
        },
        _undoDragNode: function (diagram, node, object, pseudoGroup) {
            object = $.extend(true, {}, object);
            if (node && object) {
                if (node.type !== "pseudoGroup") {
                    var tempObj = $.extend(true, {}, object);
                    var tempNode = $.extend(true, {}, node);
                    if (!pseudoGroup) {
                        this._disableConnectorUpdate(diagram);
                        diagram._disableSwimlaneUptate = true;
                    }
                    this._undoRemoveNodeFromContainer(diagram, node);
                    this._undoAddNodeToContainer(diagram, node, object);
                    if (!pseudoGroup)
                        delete diagram._disableSwimlaneUptate
                    diagram._clearSelection(true);
                    diagram._addSelection(node, true);
                    //diagram.activeTool.selectedObject = node;
                    this._updateLastSwimlanePhase(diagram, node);
                    if (!pseudoGroup) {
                        if (tempNode.parent)
                            this._enableConnectorUpdateNode(diagram, tempNode);
                        else this._enableConnectorUpdateNode(diagram, tempObj);
                    }
                    if (!node.parent) {
                        this._updateAssociatedConnectorEnds(diagram, node, diagram.nameTable);
                    }
                }
            }
        },
        _undoMultiDragNode: function (diagram, args) {
            var pseudoGroup = $.extend(true, {}, args.node), obj;
            if (pseudoGroup && (pseudoGroup.type === "pseudoGroup")) {
                var children = pseudoGroup.children;
                diagram._disableSwimlaneUptate = true;
                for (var i = 0; i < children.length; i++) {
                    this._disableConnectorUpdate(diagram);
                    var node = diagram.nameTable[diagram._getChild(children[i])];
                    var parent = node.parent;
                    if (args.undo && node)
                        obj = args.undoObject.childTable ? args.undoObject.childTable[node.name] : null;
                    else
                        obj = args.redoObject.childTable ? args.redoObject.childTable[node.name] : null;
                    this._undoDragNode(diagram, node, obj, true);
                    if (!parent) {
                        if (obj.parent) {
                            parent = obj.parent;
                        }
                    }
                    if (parent) {
                        var lane = diagram.nameTable[parent];
                        if (lane && lane.isLane) {
                            var swimlane = diagram.nameTable[lane.parent.split("laneStack")[0]];
                            if (swimlane) {
                                if (!diagram._updateSwimlanes) {
                                    diagram._updateSwimlanes = [];
                                }
                                if (!diagram._collectionContains(swimlane.name, diagram._updateSwimlanes))
                                    diagram._updateSwimlanes.push(swimlane.name)
                            }
                        }
                    }
                    else {
                        delete diagram._disableSegmentChange;
                        this._updateAssociatedConnectorEnds(diagram, node, diagram.nameTable);
                    }
                    delete diagram._disableSegmentChange;
                    this._updateAssociatedConnectorEnds(diagram, node, diagram.nameTable);
                }

                delete diagram._disableSwimlaneUptate;
                if (diagram._updateSwimlanes && diagram._updateSwimlanes.length > 0) {
                    for (var m = 0; m < diagram._updateSwimlanes.length; m++) {
                        ej.datavisualization.Diagram.DiagramContext.update(diagram.nameTable[diagram._updateSwimlanes[m]], diagram);
                        ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdate(diagram, diagram.nameTable[diagram._updateSwimlanes[m]]);
                    }
                }
                if (diagram._swimlaneOuterNodes && diagram._swimlaneOuterNodes.length > 0) {
                    for (var m = 0; m < diagram._swimlaneOuterNodes.length; m++) {
                        var updateNode = diagram._swimlaneOuterNodes[m];
                        if (updateNode && updateNode.type !== "connector") {
                            for (var i = 0, len = updateNode.inEdges.length; i < len; i++) {
                                var connector = diagram.nameTable[updateNode.inEdges[i]];
                                if (connector) {
                                    diagram._dock(connector, diagram.nameTable);
                                    ej.datavisualization.Diagram.DiagramContext.update(connector, diagram);
                                }
                            }
                            for (i = 0, len = updateNode.outEdges.length; i < len; i++) {
                                connector = diagram.nameTable[updateNode.outEdges[i]];
                                if (connector) {
                                    diagram._dock(connector, diagram.nameTable);
                                    ej.datavisualization.Diagram.DiagramContext.update(connector, diagram);
                                }
                            }
                        }
                    }
                    delete diagram._swimlaneOuterNodes
                }
                delete diagram._updateSwimlanes;
                diagram._clearSelection(true);
                ej.datavisualization.Diagram.Util._updateGroupBounds(pseudoGroup, diagram);
                diagram._addSelection(pseudoGroup, true);
                delete diagram.nameTable[pseudoGroup.name];
                diagram.nameTable[pseudoGroup.name] = pseudoGroup;
                //diagram.activeTool.selectedObject = pseudoGroup;
            }
        },


        _updateAssociatedConnectorEnds: function (diagram, node, nameTable) {
            var i, len;
            var connector;
            if (diagram.getObjectType(node) !== "connector") {
                if (node.inEdges.length || node.outEdges.length) {
                    //Finding the segment points to avoid calculating path points multiple times to dock every edge
                    var nodeToNode = diagram._isNodeToNodeConnection(node);
                    var nodeToDock = node;
                    if (node.type == "bpmn" && node._type == "group") {
                        nodeToDock = typeof node.children[0] == "object" ? node.children[0] : diagram.nameTable[node.children[0]];
                    }
                    if (nodeToNode) {
                        var segmentPoints = ej.datavisualization.Diagram.Util._findSegmentPoints(nodeToDock);
                    }
                    var childTable = {};
                    if (diagram._parentNode) {
                        childTable = diagram._getChildTable(diagram._parentNode, {});
                    }
                    for (i = 0, len = node.inEdges.length; i < len; i++) {
                        connector = nameTable[node.inEdges[i]];
                        if (connector && !(diagram._parentNode && childTable[connector.sourceNode])) {
                            if (!connector.targetPadding) {
                                nodeToDock._segmentPoints = segmentPoints;
                            }
                            else delete nodeToDock._segmentPoints;
                            diagram._dock(connector, nameTable);
                            ej.datavisualization.Diagram.DiagramContext.update(connector, diagram);
                        }
                    }
                    for (i = 0, len = node.outEdges.length; i < len; i++) {
                        connector = nameTable[node.outEdges[i]];
                        if (connector && !(diagram._parentNode && childTable[connector.targetNode])) {
                            if (!connector.sourcePadding) { nodeToDock._segmentPoints = segmentPoints; }
                            else delete nodeToDock._segmentPoints;
                            diagram._dock(connector, nameTable);
                            //ej.datavisualization.Diagram.DiagramContext.update(connector, diagram);
                        }
                    }
                    delete nodeToDock._segmentPoints;
                }
            }
        },
        //#endregion

        //#region undo resizeNode
        _undoRemoveResizeNodeFromContainer: function (diagram, node) {
            if (node.type !== "pseudoGroup") {
                var parent = diagram.nameTable[node.parent], child;
                if (parent) {
                    node.parent = "";
                    var children = parent.children, child;
                    for (var i = 0; i < children.length; i++) {
                        child = diagram.nameTable[diagram._getChild(children[i])];
                        if (child) {
                            if (child.name === node.name)
                                ej.datavisualization.Diagram.Util.removeChildFromGroup(parent.children, children[i]);
                        }
                    }
                    ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, parent, true);
                }
            }
        },
        _undoAddResizeNodeToContainer: function (diagram, node, object) {
            if (node.type !== "pseudoGroup") {
                var parent = diagram.nameTable[object.parent], child, parentElement;
                if (!node.segments) {
                    diagram._translate(node, object.offsetX - node.offsetX, object.offsetY - node.offsetY, diagram.nameTable);
                    diagram.scale(node, (object.width / node.width), (object.height / node.height), ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY), diagram.nameTable);
                    if (node._type === "group") ej.datavisualization.Diagram.Util._updateGroupBounds(node, diagram);
                    if (node.container) ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, node, true);
                }
                if (parent) {
                    node.parent = parent.name;
                    parent.children.push(node.name);
                    parentElement = diagram._svg.getElementById(parent.name);
                    if (parent._isBpmn) {
                        ej.datavisualization.Diagram.bpmnHelper.resetNodeMargin(node, parent, diagram);
                        node = $.extend(true, node, { marginLeft: object.marginLeft, marginRight: object.marginRight, marginTop: object.marginTop, marginBottom: object.marginBottom });
                    }
                    else
                        this._updateNodeMargin(diagram, node, parent);
                    ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, parent, true);
                }
                if (node._type === "group") {
                    ej.datavisualization.Diagram.DiagramContext.renderGroup(node, diagram, parentElement);
                } else if (node.segments) {
                    ej.datavisualization.Diagram.DiagramContext.renderConnector(node, diagram, parentElement);
                } else {
                    ej.datavisualization.Diagram.DiagramContext.renderNode(node, diagram, parentElement);
                }
            }
        },
        _undoResizeNode: function (diagram, node, object, pseudoGroup) {
            object = $.extend(true, {}, object);
            if (node && object) {
                if (node.type !== "pseudoGroup") {
                    if (!pseudoGroup)
                        this._disableConnectorUpdate(diagram);
                    this._undoRemoveResizeNodeFromContainer(diagram, node);
                    this._undoAddResizeNodeToContainer(diagram, node, object);
                    diagram._clearSelection(true);
                    diagram._addSelection(node, true);
                    this._updateLastSwimlanePhase(diagram, node);
                    if (!pseudoGroup)
                        this._enableConnectorUpdateNode(diagram, node);
                }
            }
        },
        _undoMultiResizeNode: function (diagram, args) {
            var pseudoGroup = $.extend(true, {}, args.node), obj;
            if (pseudoGroup && (pseudoGroup.type === "pseudoGroup")) {
                var children = pseudoGroup.children;
                for (var i = 0; i < children.length; i++) {
                    var node = diagram.nameTable[diagram._getChild(children[i])];
                    if (args.undo && node)
                        obj = args.undoObject.childTable ? args.undoObject.childTable[node.name] : null;
                    else
                        obj = args.redoObject.childTable ? args.redoObject.childTable[node.name] : null;
                    this._undoResizeNode(diagram, node, obj);
                }
                diagram._clearSelection(true);
                ej.datavisualization.Diagram.Util._updateGroupBounds(pseudoGroup, diagram);
                diagram._addSelection(pseudoGroup, true);
                delete diagram.nameTable[pseudoGroup.name];
                diagram.nameTable[pseudoGroup.name] = pseudoGroup;
            }
        },
        _undoResizeLane: function (diagram, object, args) {
            var node = diagram.nameTable[object.name];
            if (node) {
                if (args && args.node && args.node.isSwimlane) {
                    var lanes = ej.datavisualization.Diagram.SwimLaneContainerHelper.getLanes(diagram, args.node);
                    if (lanes.length > 0) {
                        var lastLane = diagram.nameTable[diagram._getChild(lanes[lanes.length - 1])];
                        if (lastLane) {
                            if (args.undo) {
                                object = (args.undoObject && args.undoObject.node) ? args.undoObject.node : lastLane;
                            }
                            else {
                                object = (args.undoObject && args.redoObject.node) ? args.redoObject.node : lastLane;
                            }
                            diagram._comparePropertyValues(lastLane, "minWidth", { minWidth: object.minWidth });
                            lastLane.minWidth = object.minWidth;
                            diagram._comparePropertyValues(lastLane, "minHeight", { minHeight: object.minHeight });
                            lastLane.minHeight = object.minHeight;
                            this._disableConnectorUpdate(diagram);
                            ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, node, true);
                            this._enableConnectorUpdateLane(diagram, node);
                        }
                    }
                }
                else if (node.isLane) {
                    if (node.container) {
                        diagram.activeTool._undonode = $.extend(true, {}, { node: node });
                        diagram._comparePropertyValues(node, "minWidth", { minWidth: object.minWidth });
                        node.minWidth = object.minWidth;
                        diagram._comparePropertyValues(node, "minHeight", { minHeight: object.minHeight });
                        node.minHeight = object.minHeight;
                    }
                    this._disableConnectorUpdate(diagram);
                    ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, node, true);
                    var xdiff = node.width - diagram.activeTool._undonode.node.width, ydiff = node.height - diagram.activeTool._undonode.node.height, _preventDocking, _disableSegmentChange;
                    _preventDocking = diagram._preventDocking;
                    _disableSegmentChange = diagram._disableSegmentChange
                    delete diagram._preventDocking;
                    delete diagram._disableSegmentChange
                    this._updateOverlappedConnectorSegment(diagram, diagram.activeTool._undonode.node, xdiff, ydiff);
                    diagram._preventDocking = _preventDocking;
                    diagram._disableSegmentChange = _disableSegmentChange;
                    this._updateConnectorSegments(diagram, node, xdiff, ydiff);
                    this._enableConnectorUpdateLane(diagram, node);
                }
            }
        },
        //#endregion

        //#region undo rotateNode
        _undoRemoveRotateNodeFromContainer: function (diagram, node) {
            if (node.type !== "pseudoGroup") {
                var parent = diagram.nameTable[node.parent], child;
                if (parent) {
                    node.parent = "";
                    var children = parent.children, child;
                    for (var i = 0; i < children.length; i++) {
                        child = diagram.nameTable[diagram._getChild(children[i])];
                        if (child) {
                            if (child.name === node.name)
                                ej.datavisualization.Diagram.Util.removeChildFromGroup(parent.children, children[i]);
                        }
                    }
                    ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, parent, true);
                }
            }
        },
        _undoAddRotateNodeToContainer: function (diagram, node, object) {
            if (node.type !== "pseudoGroup") {
                var parent = diagram.nameTable[object.parent], child, parentElement;
                if (!node.segments) {
                    var newangle = object.rotateAngle - node.rotateAngle;
                    diagram._rotate(node, newangle, diagram.nameTable);
                }
                if (parent) {
                    node.parent = parent.name;
                    parent.children.push(node.name);
                    parentElement = diagram._svg.getElementById(parent.name);
                    if (parent._isBpmn) {
                        ej.datavisualization.Diagram.bpmnHelper.resetNodeMargin(node, parent, diagram);
                        node = $.extend(true, node, { marginLeft: object.marginLeft, marginRight: object.marginRight, marginTop: object.marginTop, marginBottom: object.marginBottom });
                    }
                    else
                        this._updateNodeMargin(diagram, node, parent);
                    ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, parent, true);
                }
                if (node._type === "group") {
                    ej.datavisualization.Diagram.DiagramContext.renderGroup(node, diagram, parentElement);
                } else if (node.segments) {
                    ej.datavisualization.Diagram.DiagramContext.renderConnector(node, diagram, parentElement);
                } else {
                    ej.datavisualization.Diagram.DiagramContext.renderNode(node, diagram, parentElement);
                }
            }
        },
        _undoRotateNode: function (diagram, node, object, pseudoGroup) {
            object = $.extend(true, {}, object);
            if (node && object) {
                if (node.type !== "pseudoGroup") {
                    if (!pseudoGroup)
                        this._disableConnectorUpdate(diagram);
                    this._undoRemoveRotateNodeFromContainer(diagram, node);
                    this._undoAddRotateNodeToContainer(diagram, node, object);
                    diagram._clearSelection(true);
                    diagram._addSelection(node, true);
                    this._updateLastSwimlanePhase(diagram, node);
                    if (!pseudoGroup)
                        this._enableConnectorUpdateNode(diagram, node);
                }
            }
        },
        _undoMultiRotateNode: function (diagram, args) {
            var pseudoGroup = $.extend(true, {}, args.node), obj;
            if (pseudoGroup && (pseudoGroup.type === "pseudoGroup")) {
                var children = pseudoGroup.children;
                for (var i = 0; i < children.length; i++) {
                    var node = diagram.nameTable[diagram._getChild(children[i])];
                    if (args.undo && node)
                        obj = args.undoObject.childTable ? args.undoObject.childTable[node.name] : null;
                    else
                        obj = args.redoObject.childTable ? args.redoObject.childTable[node.name] : null;
                    this._undoRotateNode(diagram, node, obj, true);
                }
                diagram._clearSelection(true);
                pseudoGroup.rotateAngle = obj.rotateAngle;
                ej.datavisualization.Diagram.Util._updateGroupBounds(pseudoGroup, diagram);
                diagram._addSelection(pseudoGroup, true);
                delete diagram.nameTable[pseudoGroup.name];
                diagram.nameTable[pseudoGroup.name] = pseudoGroup;
            }
        },
        //#endregion

        //#region swapping lane
        _undoSwap: function (diagram, args) {
            diagram.activeTool._removeHelpers();
            diagram._clearSelection(true);
            var index = args.undo ? args.insertIndex : args.moveIndex;
            var node = diagram.nameTable[args.undoObject.name1];
            var parent = node && node.parent ? diagram.nameTable[node.parent] : null;
            if (parent && parent.children.length > 0)
                var list = parent.children;
            var tList = list.slice();
            var prevSwimlane = this._getSwimlane(diagram, list[0]);
            if (list && list.length > 0) {
                ej.datavisualization.Diagram.canvasHelper._disableConnectorUpdate(diagram);
                this._undoSwapLane(diagram, list, index, node, null);
                ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(diagram, parent, false);
                ej.datavisualization.Diagram.canvasHelper._recreateConnectorSegments(diagram, node.name, tList, args.undoObject.name2, args.undoObject.name1);
                ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdateLane(diagram, node);
            }
            var currLaneSwimlane = this._getSwimlane(diagram, list[0]);
            diagram._comparePropertyValues(currLaneSwimlane, "lanes", { lanes: prevSwimlane.lanes });
        },
        _undoSwapLane: function (diagram, list, index, node, isVertical) {
            if (list && list.length > 0) {
                list.splice(list.indexOf(node), 1);
                list.splice(index, 0, node);
            }
        },
        //#endregion
    };

    ej.datavisualization.Diagram.containerCommon = {
        _initGroupNode: function (diagram, group) {
            var child = null;
            group = diagram._getNewGroup(group);
            for (var i = 0; i < group.children.length; i++) {
                child = group.children[i];
                if (child && typeof (child) == "object") {
                    if (typeof child.shape !== "object")
                        child = ej.datavisualization.Diagram.NodeType(child, diagram);
                    //if (child.type === "bpmn")
                    //    child._type = "node";
                    if (child._type != "group" && !child.children && !child.segments && child.type != "connector") {
                        if (group.type != "bpmn") child = diagram._getNewNode(child);
                        if (child.name == "")
                            child.name = ej.datavisualization.Diagram.Util.randomId();
                        if (child._type == "node" && child.labels.length && (child.width == 0 || child.height == 0))
                            diagram._getNodeDimension(child);
                    }
                    else if (child.segments || child.type == "connector") {
                        child = diagram._getNewConnector(child);
                        if (child.name == "") {
                            child.name = ej.datavisualization.Diagram.Util.randomId();
                        }
                    }
                    else {
                        child = diagram._getNewGroup(child);
                        if (child.name == "") {
                            child.name = ej.datavisualization.Diagram.Util.randomId();
                        }
                        child = this._initGroupNode(diagram, child);
                    }
                    group.children[i] = child;
                    child.parent = group.name;
                }
            }
            return group;
        },
        _initChildren: function (diagram, node) {
            if (node.children && node.children.length > 0) {
                var children = node.children;
                for (var i = 0; i < children.length; i++) {
                    var child = typeof (children[i]) === "string" ? diagram.nameTable[children[i]] : children[i];
                    if (child) {
                        if (!child._isInternalShape
                            || (child._isInternalShape && child.type === "group")
                            ) {

                            if (child.container) {
                                child = ej.datavisualization.Diagram.ContainerHelper._initContainer(diagram, child);
                            }
                            else if (child.children) {
                                child = ej.datavisualization.Diagram.Group(child);
                                child = this._initGroupNode(diagram, children[i]);
                                child = diagram._getNewGroup(children[i]);
                                child = this._initChildren(diagram, children[i]);
                                if (diagram._isLoad && children[i].type !== "bpmn")
                                    this._updateGroupBounds(diagram, children[i]);
                            }
                            else if (child.segments) {
                                child = ej.datavisualization.Diagram.Connector(child);
                                child = diagram._getNewConnector(child);
                            }
                            else {
                                child = ej.datavisualization.Diagram.NodeType(child, diagram);
                                child = diagram._getNewNode(child);
                            }

                            if (node.container) {
                                if (child.type === "bpmn")
                                    diagram._translate(child, 0 - child.offsetX, 0 - child.offsetY, diagram.nameTable)
                                //else
                                    //child.offsetX = 0; child.offsetY = 0;
                            }
                        }
                        diagram.nameTable[child.name] = child;
                        node.children[i] = child;
                        if (diagram._spatialSearch) diagram._updateQuad(child);
                    }
                }
            }
            return node;
        },
        _getChildrenBounds: function (diagram, group) {
            var children = group.children, rect,
                bounds = ej.datavisualization.Diagram.Rectangle(), child;
            if (children.length > 0) {
                child = diagram.nameTable[diagram._getChild(children[0])];
                if (child)
                    bounds = ej.datavisualization.Diagram.Util._rotateChildBounds(child, group, diagram);
            }
            for (var i = 0, len = children.length; i < len; i++) {
                child = diagram.nameTable[diagram._getChild(children[i])];
                if (child) {
                    if (child._type === "group") {
                        ej.datavisualization.Diagram.Util._updateGroupBounds(child, diagram);
                        rect = ej.datavisualization.Diagram.Util._rotateChildBounds(child, group, diagram);
                    } else
                        rect = ej.datavisualization.Diagram.Util._rotateChildBounds(child, group, diagram);
                }
                if (rect)
                    bounds = ej.datavisualization.Diagram.Geometry.union(bounds, rect);
            }
            return bounds;
        },
        _updateGroupBounds: function (diagram, node, angleChange) {
            var exWidth, exHeight, exOffX, exOffY;
            if (node && !node.container) {
                if (node && ((node.type === "pseudoGroup") || (node.children && node.children.length > 0))) {
                    exWidth = node.width;
                    exHeight = node.height;
                    exOffX = node.offsetX;
                    exOffY = node.offsetY;
                    if (angleChange)
                        ej.datavisualization.Diagram.Util._updateRotateAngle(node, diagram.nameTable);
                    var bounds = this._getChildrenBounds(diagram, node);
                    var x = bounds.x + bounds.width * node.pivot.x;
                    var y = bounds.y + bounds.height * node.pivot.y;
                    var newposition = { x: x, y: y };
                    if (node.rotateAngle) {
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
                }
            }
        },
        _cloneObject: function (diagram, node, id) {
            if (node) {
                var obj = $.extend(true, {}, node);
                var child;
                if (obj.children && obj.children.length > 0) {
                    for (var i = 0; i < obj.children.length; i++) {
                        obj.children[i] = this._cloneObject(diagram, obj.children[i], id);
                    }
                }
                obj.name += id;
            }
            return obj;
        },
        _removeObject: function (diagram, node) {
            if (node) {
                if (typeof (node) === "string")
                    node = diagram.nameTable[node];
                var child;
                if (node && node.children && node.children.length > 0) {
                    for (var i = 0; i < node.children.length; i++) {
                        this._removeObject(diagram, node.children[i]);
                    }
                }
                if (node)
                    delete diagram.nameTable[node.name];
            }
        },
    }
    //#endregion

})(jQuery, Syncfusion);
(function ($, ej, undefined) {
    "use strict";
    //#region ruler widget
    ej.widget("ejRuler", "ej.datavisualization.ejRuler", {
        element: null,
        validTags: ["div"],
        model: null,
        //#region Initialization
        defaults: {
            offset: 0,
            orientation: "horizontal",
            scale: 1,
            interval: 5,
            segmentWidth: 100,
            arrangeTick: null,
            tickAlignment: "rightorbottom",
            markerColor: "red",
            length: null,
            thickness: 25
        },
        _init: function () {
            if (!(ej.browserInfo().name === "msie" && Number(ej.browserInfo().version) < 9)) {
                this._wireEvents();
                this._renderRuler();
            }
        },

        _renderRuler: function () {
            this._updateRulerGeometry();

        },
        _updateRulerGeometry: function () {
            var size = this.model.length;
            if (!size) {
                if (this.orientation === "horizontal")
                    size = $(this.element[0]).width();
                else size = $(this.element[0]).height();
            }
            this.element[0].style.height = (this.model.orientation === "horizontal" ? this.model.thickness : size) + "px";
            this.element[0].style.width = (this.model.orientation === "horizontal" ? size : this.model.thickness) + "px";
            this.element[0].style.textAlign = "left";
            //this.element[0].setAttribute("id", this.element[0].id + (this.model.orientation === "horizontal" ? "_hRuler" : "_vRuler"));
            //this.element[0].setAttribute("class", (this.model.orientation === "horizontal" ? "sf-diagram_hRuler" : "sf-diagram_vRuler"));
            this._renderRulerSpace();
            this._updateRuler();
        },
        _renderRulerSpace: function () {
            var rulerGeometry = this._getRulerGeometry();
            var div = document.getElementById(this.element[0].id + "_ruler_space");
            if (!div) {
                div = document.createElement("div");
                div.setAttribute("id", this.element[0].id + "_ruler_space");
                div.setAttribute("class", "ej-ruler-space");
                div.style.height = rulerGeometry.height + "px";
                div.style.width = rulerGeometry.width + "px";
                div.style.float = "left";
                this.element[0].appendChild(div);
            }
            return div;
        },
        _updateRuler: function () {
            var rulerSize = this._getRulerSize();
            var rulerGeometry = this._getRulerGeometry();
            var length = 0, offset = 0, availableSize = {};
            var svg = this._getRulerSVG(rulerGeometry);
            if (svg) {
                length = this.model.length;
                availableSize.height = rulerSize;
                offset = this.model.offset;
                if (length && length != Infinity) {
                    var unitLength = length + this.model.segmentWidth;
                    var unitOffset = offset;
                    this._updateSegments(unitOffset, (unitLength + Math.abs(unitOffset)), svg, rulerSize);
                }
            }
        },
        _updateSegments: function (start, end, svg, rulerSize) {
            var run = start;
            var trans = { trans: 0 };
            while (run < end) {
                var rulerSegment = this._getNewSegment(run, svg);
                if (rulerSegment) {
                    svg.document.appendChild(rulerSegment.segment)
                    run = this._updateSegment(start, end, rulerSegment, run, trans, svg, rulerSize);
                }
            }
        },
        _updateSegment: function (start, end, rulerSegment, run, trans, svg, rulerSize) {
            var segWidth = this._updateSegmentWidth(this.model.scale)
            if (run == start) {
                this.model.startValue = Math.floor(start / segWidth) * segWidth / this.model.scale;
                this.model.startValue = (this.model.startValue % 1) != 0 ? Number((this.model.startValue).toFixed(1)) : this.model.startValue;
                rulerSegment.label.textContent = this.model.startValue;
                this._starValue = run = this.model.startValue * this.model.scale;
                if (this.model.orientation === "horizontal")
                    this._hRulerDiff = start - run;
                else
                    this._vRulerDiff = start - run;
            }
            else if (run > end) {
            }
            else if (run > end) {
            }
            else {
                this.model.startValue = (run / this.model.scale);
                this.model.startValue = (this.model.startValue % 1) != 0 ? Number((this.model.startValue).toFixed(1)) : this.model.startValue;
                rulerSegment.label.textContent = this.model.startValue;
            }
            this._updateTickLabel(rulerSegment, rulerSize);
            if (this.model.orientation === "horizontal")
                rulerSegment.segment.setAttribute("transform", "translate(" + trans.trans + " 0)");
            else
                rulerSegment.segment.setAttribute("transform", "translate(0 " + trans.trans + ")");
            trans.trans += segWidth;
            run += segWidth;
            return run;
        },
        _updateTickLabel: function (segment, rulerSize) {
            var attr, bbox;
            if (this.model.orientation === "horizontal") {
                if (this.model.tickAlignment === "rightorbottom")
                    attr = { "x": 2, "y": (rulerSize / 2 + (11 / 2) - (11 / 2)) }
                else
                    attr = { "x": 2, "y": (rulerSize / 2 + (11 / 2)), }
            }
            else {
                bbox = segment.segment.lastChild.getBBox();
                if (this.model.tickAlignment === "rightorbottom")
                    attr = { "x": 0, "y": bbox.height, "font-size": "11", "transform": "rotate(270)" + "translate(" + -(bbox.width + 2) + " " + ((rulerSize / 2) - bbox.height) + ")" };
                else
                    attr = { "x": 0, "y": bbox.height, "font-size": "11", "transform": "rotate(270)" + "translate(" + -(bbox.width + 2) + " " + ((rulerSize / 2) - bbox.height / 2) + ")" };
            }
            ej.datavisualization.Diagram.Util.attr(segment.segment.lastChild, attr);
        },
        _getNewSegment: function (run, svg) {
            var segment = this._createNewTicks(run, svg);
            var label = this._createTickLabel(svg, segment);
            return { segment: segment, label: label };
        },
        _createNewTicks: function (run, svg) {
            var tick, i, tickInterval;
            var segmentWidth = this._updateSegmentWidth(this.model.scale)
            var g = svg.g({ "class": "ej-ruler-segment" });
            for (i = 0; i < this.model.interval; i++) {
                tickInterval = segmentWidth / this.model.interval;
                tick = this._createTick(svg, tickInterval, i + 1, run);
                g.appendChild(tick);
            }
            return g;
        },
        _getLinePoint: function (svg, tickInterval, length) {
            var segmentWidth = this._updateSegmentWidth(this.model.scale)
            var rulerSize = this._getRulerSize(), length;
            tickInterval = tickInterval * (length - 1);
            if ((tickInterval % segmentWidth) == 0) {
                length = rulerSize;
            }
            else {
                length = rulerSize * 0.3;
            }
            return length;
        },
        _createTick: function (svg, tickInterval, length, run) {
            var ruler, svg, line;
            var linePoint = this._getLinePoint(svg, tickInterval, length);
            var rulerSize = this._getRulerSize(), args, attr;
            var arrangeTick = this.model.arrangeTick;
            if (typeof arrangeTick == "string") arrangeTick = ej.util.getObject(arrangeTick, window);
            if ($.isFunction(arrangeTick)) {
                args = { ruler: ruler, tickLength: linePoint, tickInterval: Number((run + tickInterval * (length - 1)).toFixed(1)) }
                arrangeTick(args);
                linePoint = args.tickLength;
            }
            if (this.model.orientation === "horizontal") {
                var xPoint = tickInterval * (length - 1);
                if (this.model.tickAlignment === "rightorbottom")
                    attr = { "x1": xPoint, "y1": rulerSize, "x2": xPoint, "y2": rulerSize - linePoint, "stroke-width": "1" };
                else
                    attr = { "x1": xPoint, "y1": rulerSize - (rulerSize - linePoint), "x2": xPoint, "y2": 0, "stroke-width": "1" };
                line = svg.line(attr);
            }
            else {
                var yPoint = tickInterval * (length - 1);
                if (this.model.tickAlignment === "rightorbottom")
                    attr = { "x1": rulerSize, "y1": yPoint, "x2": rulerSize - linePoint, "y2": yPoint, "stroke-width": "1" }
                else
                    attr = { "x1": 0, "y1": yPoint, "x2": rulerSize - (rulerSize - linePoint), "y2": yPoint, "stroke-width": "1" }
                line = svg.line(attr);
            }
            line.setAttribute("class", "ej-ruler-tick")
            return line;
        },
        _createTickLabel: function (svg, segment) {
            if (segment) {
                var attr = { "class": "ej-ruler-tick-label" };
                var text = svg.text(attr);
                segment.appendChild(text);
            }
            return text;
        },
        _updateSegmentWidth: function (scale) {
            if (this.model.segmentWidth != 100)
                return this.model.segmentWidth;
            var five = 25, multiples = 1, div, scaleRound, fifty = 100;
            scaleRound = Math.pow(2, Math.round(Math.log(scale) / Math.log(2)));
            div = fifty;
            //if (Ruler.Scale >= 1)
            {
                div = (fifty / scaleRound);
            }
            while (div > 100) {
                multiples /= 10;
                div /= 10;
            }
            while (div < 25) {
                multiples *= 10;
                div *= 10;
            }
            if (div >= five && div % five != 0) {
                div = Math.round(div / five) * five;
            }
            return div * scale / multiples;
        },

        _getRulerGeometry: function () {
            return {
                width: $(this.element[0]).width(),
                height: $(this.element[0]).height()
            };
        },
        _getRulerSize: function () {
            return this.model.thickness;
        },
        _getRulerSVG: function (rulerGeometry) {
            var rulerSpace, i, rulerSize = this._getRulerSize(), svg;
            rulerSpace = document.getElementById(this.element[0].id + "_ruler_space");
            if (rulerSpace) {
                svg = new ej.datavisualization.Diagram.Svg({
                    "id": this.element[0].id + "_Ruler_svg",
                    width: this.model.orientation === "horizontal" ? rulerGeometry.width : rulerSize,
                    height: this.model.orientation === "horizontal" ? rulerSize : rulerGeometry.height,
                    style: "position:inherit;"
                });
                if (rulerSpace.childNodes.length > 0) {
                    for (i = rulerSpace.childNodes.length - 1; i >= 0 ; i--) {
                        rulerSpace.childNodes[i].parentNode.removeChild(rulerSpace.childNodes[i]);
                    }
                }
                rulerSpace.appendChild(svg.document);
            }
            return svg;
        },
        _setModel: function (options) {
            for (var option in options) {
                switch (option) {
                    case "offset":
                    case "length":
                    case "interval":
                    case "segmentWidth":
                    case "tickAlignment":
                    case "markerColor":
                    case "thickness":
                        this._updateRuler();
                        break;
                    case "arrangeTick":
                        this._updateRuler();
                        this.model.arrangeTick = options.arrangeTick;
                        break;
                }
            }
        },
        _destroy: function () {
            this.element.empty().removeClass(this.model.cssClass);
        },
        //#endregion

        //#region Events
        _wireEvents: function () {

        },
        //#endregion
    });
    //#endregion
})(jQuery, Syncfusion);



