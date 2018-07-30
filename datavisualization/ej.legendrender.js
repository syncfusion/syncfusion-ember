ej.EjLegendRender = function (chartobj) {

    this.chartObj = chartobj;
};


(function ($) {
    ej.EjLegendRender.prototype =
        {
            sumofArray: function (array) {
                var sum = 0,
                    length = array.length;
                for (var i = 0; i < length; i++)
                    sum += array[i];
                return sum;
            },

            legendRectSpace: function (svgBounds, divBounds) {
                var width = svgBounds.Width - 10;
                var height = svgBounds.Height - 10;
                var isVisible = false;
                if (Math.ceil(divBounds.Width) >= width && Math.ceil(divBounds.Height) >= height)
                    isVisible = true;
                return isVisible;
            },

            drawLegendTitle: function () {
                //draw legend title

                var chart = this.chartObj,
                    chartModel = chart.model,
                    legend = chartModel.legend,
                    legendBounds = chartModel.LegendBounds,
                    elementSpacing = chartModel.elementSpacing,
                    legendTitle = legend.title,
                    measureText = ej.EjSvgRender.utils._measureText,
                    font = legendTitle.font,
                    legendBoundsWidth = legendBounds.Width,
                    titleSize = measureText(legendTitle.text, null, font),
                    titleWidth = titleSize.width,
                    titleHeight = titleSize.height,
                    textAlignment = legendTitle.textAlignment.toLowerCase(),
                    startX = 0,
                    startY = elementSpacing + (titleHeight / 2);

                switch (textAlignment) {
                    case 'far':
                        startX = legendBoundsWidth - titleWidth - startX;
                        break;
                    case 'center':
                        startX = legendBoundsWidth / 2 - (titleWidth) / 2;
                        break;
                }

                if (startX < 0) {
                    startX = 0;
                    legendBoundsWidth = titleWidth;
                }
                if (legendBoundsWidth < titleWidth + startX)
                    legendBoundsWidth = titleWidth + startX;

                var options = {
                    'id': chart.svgObject.id + '_LegendTitleText',
                    'x': startX,
                    'y': startY,
                    'fill': font.color,
                    'font-size': font.size,
                    'font-style': font.fontStyle,
                    'font-family': font.fontFamily,
                    'font-weight': font.fontWeight,
                    'text-anchor': 'start',
                    'lgndCtx': true
                };

                chart.svgRenderer.drawText(options, legendTitle.text, this.chartObj.gLegendEle);

            },

            drawLegendItem: function (legendItem, x, y) {
                var chart = this.chartObj,
                    chartModel = chart.model,
                    legend = chartModel.legend,
                    textOverflow = legend.textOverflow.toLowerCase(),
                    textMaxWidth = legend.textWidth,
                    legendBounds = chartModel.LegendBounds,
                    elementSpacing = chartModel.elementSpacing,
                    legendBorder = legend.border.width,
                    measureText = ej.EjSvgRender.utils._measureText,
                    svgRender = ej.EjSvgRender,
                    chartSvgRender = chart.svgRenderer,
                    legendFont = legendItem.Font,
                    symbolShape = chartModel.symbolShape,
                    isCanvas = chartModel.enableCanvasRendering,
                    shapeSize = legend.itemStyle,
                    textHeight = measureText(legendItem.Text, legendBounds.Width, legendFont).height,
                    location = {
                        startX: x + shapeSize.width / 2,
                        startY: (y + (textHeight > shapeSize.height ? textHeight : shapeSize.height) / 2)
                    },
                    pointIndex = legendItem.PointIndex,
                    seriesIndex = legendItem.SeriesIndex,
                    index = pointIndex ? pointIndex : seriesIndex,
                    series = chartModel.series[seriesIndex],
                    svgObject = chart.svgObject,
                    legendStyle = legendItem.LegendStyle,
                    matched = jQuery.uaMatch(navigator.userAgent),
                    isIE11 = !!navigator.userAgent.match(/Trident\/7\./),
                    color, itemInfo, data, style, startLocation,
                    seriesType = series.type.toLowerCase(),
                    drawType = series.drawType,
                    symbolName, symbol, textinfo, legendTextRegion, textLength;

                for (name in symbolShape) {
                    if (legendItem.Shape.toLowerCase() == name.toLowerCase()) {
                        if (name.toLowerCase() == "seriestype")
                            symbolName = "SeriesType";
                        else
                            symbolName = name;
                        break;
                    }
                }

                if (symbolName == "SeriesType") {
                    if (seriesType == "radar" || seriesType == "polar") {
                        symbol = drawType.toLowerCase() == "scatter" ? series.marker.shape : symbol = drawType;
                        symbolName = (symbol.toLowerCase() == "rangecolumn") ? "RangeColumn" : symbol.capitalizeFirstString();
                    }
                    if (seriesType == "scatter") {
                        symbol = series.marker.shape;
                        symbolName = symbol.capitalizeFirstString();
                    }
                    if (legendItem.drawType)// // TrendLine drawType assigned to legend shape
                        symbolName = "SeriesType";
                    if (chart.vmlRendering && (seriesType == "pie" || seriesType == "doughnut" || seriesType == "pieofpie"))
                        symbolName = "Circle";          // VML legend shape for pie & doughnut
                }

                if (symbolName == "None") {
                    if (seriesType == "pie" || seriesType == "doughnut" || seriesType == "pieofpie")
                        symbolName = "Circle";
                    else
                        symbolName = "Rectangle";
                }

                index = (ej.util.isNullOrUndefined(pointIndex)) ? seriesIndex : pointIndex;
                chart.gLegendItemEle = chartSvgRender.createGroup({ 'id': svgObject.id + '_Legend' + index, 'cursor': 'pointer' });
                legendItem.CommonEventArgs.data.gLegendItemEle = chart.gLegendItemEle;
                data = $.extend(true, {}, legendItem.CommonEventArgs.data);
                data.model = chart.model;
                style = data.style;
                if (!legendItem.CommonEventArgs.cancel) {
                    startLocation = svgRender.chartSymbol["_draw" + symbolName](location, style, data, chart.gLegendItemEle);
                    if (legendStyle.Color && legendStyle.Color.toString().toLowerCase() !== 'gray' && isCanvas) // for canvas gradient color
                        color = legendFont.color;
                    else if (legendStyle.Color && legendStyle.Color.toLowerCase() !== 'gray') // for svg
                        color = legendFont.color;
                    else
                        color = 'gray';

                    itemInfo = legendItem;
                    textLength = itemInfo.Text.length;
                    if (legend.shape == "seriestype" || legend.shape == "seriesType")
                        x += elementSpacing / 2;
                    var options = {
                        'id': this.chartObj.svgObject.id + '_LegendItemText' + index,
                        'x': shapeSize.width + x + elementSpacing / 2,
                        'y': location.startY,
                        'fill': color,
                        'font-size': legendFont.size,
                        'font-style': legendFont.fontStyle,
                        'font-family': legendFont.fontFamily,
                        'font-weight': legendFont.fontWeight,
                        'text-anchor': 'start',

                    };
                    if (isCanvas)
                        options.lgndCtx = true;
                    options.y = (location.startY + (textHeight / 4));

                    if (textOverflow == "wrap" || textOverflow == "wrapandtrim") {
                        options.y = options.y - textHeight;
                        for (var k = 0; k < textLength; k++) {
                            options.y = options.y + (textHeight);
                            chartSvgRender.drawText(options, itemInfo.Text[k], chart.gLegendItemEle);
                            if (textOverflow == "wrapandtrim") {
                                textinfo = { x: options.x + legendBounds.X, y: options.y + legendBounds.Y, height: textHeight * (textLength), width: textMaxWidth };
                                legendTextRegion = { bounds: textinfo, trimText: itemInfo.Text, labelText: itemInfo.displayText };
                                chartModel.legendTextRegion.push(legendTextRegion);
                            }
                        }
                    }
                    else {
                        if (textOverflow == "trim") {
                            textinfo = { x: options.x + legendBounds.X, y: options.y + legendBounds.Y, height: textHeight + elementSpacing, width: textMaxWidth };
                            legendTextRegion = { bounds: textinfo, trimText: itemInfo.Text, labelText: itemInfo.displayText };
                            chartModel.legendTextRegion.push(legendTextRegion);
                        }
                        chartSvgRender.drawText(options, itemInfo.Text, chart.gLegendItemEle);
                    }
                    chartSvgRender.append(chart.gLegendItemEle, chart.gLegendEle);
                    var legendbound = {
                        X: legendBounds.X + legendBorder,
                        Y: legendBounds.Y + legendBorder
                    };

                    x = (startLocation) ? startLocation : x;
                    var itembound = {
                        X: (x), Y: (y), _Width: legendItem.Bounds._Width, Width: legendItem.Bounds.Width, Height: legendItem.Bounds.Height
                    };
                    var bounds = { LegendBound: legendbound, ItemBound: itembound };
                    var legendRegion = {
                        LegendItem: legendItem,
                        Location: location, SymbolShape: symbolName, Style: legendItem.CommonEventArgs.data.style, Bounds: bounds
                    };
                    chartModel.legendRegion.push(legendRegion);
                }
            },

            drawLegend: function (params) {
                var chart = this.chartObj,
                    chartModel = chart.model,
                    legend = chartModel.legend,
                    legendViewerBounds = chartModel.LegendViewerBounds,
                    legendBounds = chartModel.LegendBounds,
                    actualBounds = chartModel.LegendActualBounds,
                    AreaType = chartModel.AreaType,
                    legendPosition = legend.position.toLowerCase(),
                    alignment = legend.alignment.toLowerCase(),
                    elementSpacing = chartModel.elementSpacing,
                    svgObjectWidth = chartModel.svgWidth,
                    svgObjectHeight = chartModel.svgHeight,
                    title = chartModel.title,
                    titleFontHeight = title.font.size,
                    subTitle = title.subTitle,
                    subTitleFontHeight = title.subTitle.font.size,
                    legendTitle = legend.title,
                    legendBorder = legend.border.width,
                    measureText = ej.EjSvgRender.utils._measureText,
                    margin = chartModel.margin,
                    borderSize = chartModel.border.width,
                    legendCollection = chartModel.legendCollection,
                    collectionLength = legendCollection.length,
                    svgWidth = svgObjectWidth - ((borderSize * 2)),
                    svgHeight = svgObjectHeight - ((borderSize * 2)),
                    itemPadding = legend.itemPadding > 0 ? legend.itemPadding : 0,
                    padding = 20,
                    hPadding = 10,
                    vPadding = 10,
                    modelsubTitleHeight = subTitle.text == "" || !subTitle.visible || !title.visible ? 0 : measureText(subTitle.text, svgWidth - margin.left - margin.right, subTitle.font).height + elementSpacing,
                    titleLocation = chartModel._titleLocation ? chartModel._titleLocation.Y : 0 + modelsubTitleHeight,
                    legendTitleBounds = measureText(legendTitle.text, null, legendTitle.font),
                    legendTitleHeight = legendTitleBounds.height,
                    legendTitleWidth = legendTitleBounds.width,
                    rowDefinitions = chartModel._rowDefinitions,
                    maxWidth = 0, startX, startY, currentX, currentY,
                    columnDefinitions = chartModel._columnDefinitions,
                    vSizeFar = this.sumofArray(rowDefinitions.farSizes),
                    vSizeNear = this.sumofArray(rowDefinitions.nearSizes),
                    hSizeFar = this.sumofArray(columnDefinitions.farSizes),
                    hSizeNear = this.sumofArray(columnDefinitions.nearSizes),
                    isScrolling = false,
                    areaBounds = chartModel.m_AreaBounds,
                    isScroll = legend.enableScrollbar,
                    legendContainer = $(chart.legendContainer),
                    leftScroll = $("#ScrollerParent_" + 'vertical' + "_" + chart._id).length > 0 ? 18 : 0,
                    bottomScroll = $("#ScrollerParent_" + 'horizontal' + "_" + chart._id).length > 0 ? 18 : 0,
                    legendSvgContainer = $(chart.legendSvgContainer);
                var textBorderConstant = 1.2,
                    titleBorderSpacing = 10,
                    subTitleBorderSpacing = 10,
                    title = chartModel.title,
                    subTitle = chartModel.title.subTitle,
                    titleTextHeight = title.visible ? parseInt(titleFontHeight) * textBorderConstant : 0,
                    subTitleTextHeight = subTitle.visible ? parseInt(subTitleFontHeight) * textBorderConstant : 0,
                    titleTextHeight = (chartModel.titleWrapTextCollection && chartModel.titleWrapTextCollection.length > 1) ? chartModel._titleLocation._height * chartModel.titleWrapTextCollection.length - 1 : titleTextHeight,
                    subTitleTextHeight = (chartModel.subTitleWrapTextCollection && chartModel.subTitleWrapTextCollection.length > 1) ? chartModel._subTitleLocation.size.height : subTitleTextHeight;
                if ((chartModel.legend.border) && (!subTitle.text)) {
                    subTitleTextHeight = 0;
                    subTitleBorderSpacing = 5;
                }

                if (legendPosition == 'right' || legendPosition == 'left') {
                    hPadding = 10;
                } else {
                    vPadding = isScroll ? svgHeight > 200 ? 10 : svgHeight > 100 ? 5 : 0 : 10;
                }
                legendViewerBounds.Height += legendTitleHeight,
                    legendBounds.Height += legendTitleHeight;
                if (legend.visible) {
                    // draw legend.
                    if (legendPosition != 'custom') {
                        if (AreaType == "cartesianaxes") {
                            switch (legendPosition) {
                                case "bottom":
                                    legendBounds.Y = areaBounds.Y + areaBounds.Height + hSizeNear - (elementSpacing / 2) + bottomScroll;
                                    break;
                                case "top":
                                    legendBounds.Y = titleLocation == 0 ? borderSize + elementSpacing : (titleTextHeight + titleBorderSpacing + subTitleTextHeight + subTitleBorderSpacing + elementSpacing);
                                    break;
                                case "right":
                                    legendBounds.X = areaBounds.X + areaBounds.Width + vSizeFar + elementSpacing * 2;
                                    break;
                                case "left":
                                    legendBounds.X = areaBounds.X - vSizeNear - actualBounds.Width - (elementSpacing / 2) - (legendBorder * 2) - leftScroll;
                                    break;
                            }
                        } else {
                            switch (legendPosition) {
                                case "bottom":
                                    legendBounds.Y = svgHeight - (actualBounds.Height + (legendBorder)) - (elementSpacing * 2);
                                    break;
                                case "top":
                                    legendBounds.Y = titleLocation == 0 ? borderSize + elementSpacing : (titleTextHeight + titleBorderSpacing + subTitleTextHeight + subTitleBorderSpacing + elementSpacing);
                                    break;
                                case "right":
                                    legendBounds.X = svgWidth - actualBounds.Width - (elementSpacing * 2);
                                    break;
                                case "left":
                                    legendBounds.X = borderSize + (elementSpacing * 2);
                                    break;
                            }
                        }
                        //Avoid axis and legend overlapping during crossing
                        if (!chartModel.enable3D && AreaType == "cartesianaxes" && params._crossAxisOverlap != null) {
                            for (var i = 0, len = chartModel._axes.length; i < len; i++) {
                                var axis = chartModel._axes[i], axisBounds = params.axes[axis.name]._bounds;
                                var hor = axis.orientation.toLowerCase() === 'horizontal';
                                if (legendPosition == "top" && hor && axis._opposed && (axis.y - axisBounds < legendBounds.Y + legendBounds.Height))
                                    legendBounds.Y -= legendBounds.Y + legendBounds.Height - axis.y + axisBounds;
                                else if (legendPosition == "bottom" && hor && !axis._opposed && (axis.y + axisBounds > legendBounds.Y))
                                    legendBounds.Y += axis.y + axisBounds - legendBounds.Y;
                                else if (legendPosition == "left" && !hor && axis._opposed && (axis.x - axisBounds < legendBounds.X + legendBounds.Width))
                                    legendBounds.X += axis.x + axisBounds - legendBounds.X;
                                else if (legendPosition == "right" && !hor && !axis._opposed && (axis.x + axisBounds > legendBounds.X))
                                    legendBounds.X -= legendBounds.X + legendBounds.Width - axis.x + axisBounds;
                            }
                        }
                        if (legendPosition == 'left' || legendPosition == 'right') {
                            if (isScroll) {
                                switch (alignment) {
                                    case "center":
                                        legendBounds.Y = areaBounds.Height / 2 - (actualBounds.Height / 2) + areaBounds.Y - legendBorder;
                                        break;
                                    case "near":
                                        legendBounds.Y = areaBounds.Y;
                                        break;
                                    case "far":
                                        legendBounds.Y = areaBounds.Y + areaBounds.Height - actualBounds.Height - (legendBorder * 2);
                                        break;
                                }
                            } else {
                                switch (alignment) {
                                    case "center":
                                        legendBounds.Y = (svgHeight / 2) - ((actualBounds.Height + legendBorder * 2) / 2) + (elementSpacing / 2);
                                        break;
                                    case "near":
                                        legendBounds.Y = borderSize + (elementSpacing * 2);
                                        break;
                                    case "far":
                                        legendBounds.Y = svgHeight - (actualBounds.Height + (legendBorder)) - (elementSpacing * 2);
                                        break;
                                }
                            }

                        } else {
                            switch (alignment) {
                                case "center":
                                    legendBounds.X = (svgWidth / 2) - ((actualBounds.Width + legendBorder * 2) / 2) + (elementSpacing / 2);
                                    break;
                                case "near":
                                    legendBounds.X = borderSize + (elementSpacing * 2);
                                    break;
                                case "far":
                                    legendBounds.X = svgWidth - (actualBounds.Width + (legendBorder)) - (elementSpacing * 2);
                                    break;
                            }
                        }
                    } else {
                        legendBounds.Y = (legend.location.y < svgHeight) ? legend.location.y : 0;
                        legendBounds.X = (legend.location.x < svgWidth) ? legend.location.x : 0;
                    }
                    if (isScroll) {
                        if (legendPosition == 'right' || legendPosition == 'left') {
                            if (legendBounds.Y < areaBounds.Y || actualBounds.Height + (legendBorder * 2) >= areaBounds.Height) {
                                var legendHeight = (legendBorder * 2);
                                for (var k = 0; k < collectionLength; k++) {
                                    legendHeight += legendCollection[k].Bounds.Height + itemPadding;
                                    if (legendHeight > areaBounds.Height) {
                                        actualBounds.Height = areaBounds.Height - (legendBorder * 2);
                                        legendBounds.Y = areaBounds.Y;
                                        break;
                                    }
                                }
                            }
                        }
                        else {
                            if ((legendBorder * 2 + actualBounds.Width) >= svgWidth) {
                                var legendWidth = (legendBorder * 2);
                                for (var k = 0; k < collectionLength; k++) {
                                    legendWidth += legendCollection[k].Bounds.Width + itemPadding;
                                    if (legendWidth > svgWidth) {
                                        actualBounds.Width = svgWidth - (legendBorder * 2) - actualBounds.vScrollSize - (borderSize * 2);
                                        legendBounds.X = (svgWidth / 2) - ((actualBounds.Width + legendBorder * 2) / 2) + (elementSpacing / 2);
                                        break;
                                    }

                                }
                            }
                        }
                    }

                    //Set height and width to legend Canvas element
                    chart.legendSvgContainer.setAttribute('height', legendBounds.Height);
                    chart.legendSvgContainer.setAttribute('width', Math.max(legendTitleWidth, legendBounds.Width));
                    currentX = startX = hPadding;
                    currentY = startY = vPadding;
                    if (legendTitle.text != "" && legendTitle.text) {
                        this.drawLegendTitle();
                        currentY = startY = vPadding + legendTitleHeight;
                    }
                    for (var k = 0; k < collectionLength; k++) {
                        if ((legend.rowCount < legend.columnCount || legend.rowCount == legend.columnCount) && (legendPosition == 'top' || legendPosition == 'bottom' || legendPosition == 'custom')) {
                            if ((currentX + legendCollection[k].Bounds.Width) > legendBounds.Width + startX) {
                                currentX = hPadding;
                                currentY += legendCollection[k].Bounds.Height + itemPadding;
                            }
                            this.drawLegendItem(legendCollection[k], currentX, (currentY));
                            currentX += legendCollection[k].Bounds.Width + itemPadding;
                        }
                        else {
                            if (((currentY + legendCollection[k].Bounds.Height + itemPadding) + legendTitleHeight + borderSize > legendBounds.Height + startY)) {
                                currentY = startY;
                                currentX += maxWidth + (itemPadding);
                            }
                            this.drawLegendItem(legendCollection[k], (currentX), (currentY));
                            currentY += legendCollection[k].Bounds.Height + itemPadding;
                            maxWidth = Math.max(maxWidth, legendCollection[k].Bounds.Width);
                        }
                    }
                    var legendVal = chart.legendContainer[0].offsetLeft;
                    var chartOffsetVal = $(chart.element).offset();
                    var offsetVal = (chart.vmlRendering) ? (legendVal <= 0) ? legendBounds.X : (legendVal - chartOffsetVal.left) :
                        ($(chart.svgObject).offset().left - chartOffsetVal.left);
                    var legnTx = (chart.vmlRendering) ? offsetVal : legendBounds.X + (offsetVal <= 0 ? 0 : offsetVal);
                    legendContainer.attr('style', '');
                    legendContainer.show();
                    legendContainer.css({ "position": "absolute", "background": legend.background, "left": legnTx, "top": legendBounds.Y, "width": actualBounds.Width, "height": actualBounds.Height, "border-width": legend.border.width, "border-color": legend.border.color, "border-style": "solid" });
                    legendContainer.addClass("e-legendborder");
                    legendSvgContainer.css({ "height": legendBounds.Height, "width": legendBounds.Width });
                    legendBounds.Height = legendBounds.Height - (padding - (vPadding * 2));
                    var isVisible = this.legendRectSpace(legendBounds, actualBounds);
                    if (isScroll) {
                        if (legend._ejScroller) {
                            if (!isVisible && (legendBounds.Width > Math.ceil(actualBounds.Width) || legendBounds.Height > Math.ceil(actualBounds.Height))) {
                                $('#' + legendContainer[0].id).ejScroller({ scrollTop: chart.scrolltop, scrollLeft: chart.scrollleft, height: actualBounds.Height, width: actualBounds.Width });
                                isScrolling = true;
                                if (legendBounds.Height > Math.ceil(actualBounds.Height)) {
                                    if (actualBounds.vScrollSize == 0) {
                                        vScrollSize = legendContainer[0].offsetWidth + (legendBorder * 5) - legendContainer[0].clientWidth;
                                        legendContainer.css({ "width": actualBounds.Width + vScrollSize });
                                    }
                                }
                            } else {
                                $('#' + legendContainer[0].id).ejScroller("instance").destroy();
                                legend._ejScroller = false;
                            }
                        }
                        else {
                            if (!isVisible && legendBounds.Width > Math.ceil(actualBounds.Width) && legendBounds.Height > Math.ceil(actualBounds.Height)) {
                                legendContainer.css({ "overflow": "scroll" });
                                isScrolling = true;
                            } else {
                                if (!isVisible && legendBounds.Height > Math.ceil(actualBounds.Height) && actualBounds.vScrollSize >= 0) {
                                    legendContainer[0].style.overflowY = "scroll";
                                    legendContainer[0].style.overflowX = "hidden";
                                    if (actualBounds.vScrollSize == 0) {
                                        vScrollSize = legendContainer[0].offsetWidth - (legendBorder * 2) - legendContainer[0].clientWidth;
                                        legendContainer.css({ "width": actualBounds.Width + vScrollSize });
                                    }
                                    isScrolling = true;
                                }
                                if (!isVisible && legendBounds.Width > Math.ceil(actualBounds.Width) && actualBounds.hScrollSize >= 0) {
                                    legendContainer[0].style.overflowX = "scroll";
                                    legendContainer[0].style.overflowY = "hidden";
                                    if (actualBounds.hScrollSize == 0) {
                                        hScrollSize = legendContainer[0].offsetHeight - (legendBorder * 2) - legendContainer[0].clientHeight;
                                        legendContainer.css({ "height": actualBounds.Height + hScrollSize });
                                    }
                                    isScrolling = true;
                                }
                            }
                        }
                    }

                    chart.svgRenderer.append(chart.gLegendEle, chart.legendSvgContainer);
                    if (!isScrolling) {
                        legendContainer.css({ "width": actualBounds.Width - actualBounds.vScrollSize, "height": actualBounds.Height - actualBounds.hScrollSize });
                    }
                    if (!legend._ejScroller) {
                        if (chart.scrolltop != undefined)
                            legendContainer.scrollTop(chart.scrolltop);
                        if (chart.scrollleft != undefined)
                            legendContainer.scrollLeft(chart.scrollleft);
                    }

                }
                else
                    legendContainer.hide();
            }
        };
})(jQuery);