ej.Ej3DAxisRenderer = function () {
};

ej.Ej3DSeriesRender = function () {
};


ej.Ej3DChart = function () {
};

ej.series3DTypes = {};

(function ($) {

    ej.Ej3DAxisRenderer.prototype = {

        _drawAxes: function (index, axis, params) {
            if (axis.majorGridLines.visible)
                this._drawGridLines3D(axis, params);
            if (axis.visible && axis.majorTickLines.visible)
                this._renderTicks3D(axis, axis.majorTickLines.size, axis.majorTickLines.width, params);

            if (axis.visible) {
                this._drawAxisLabel(axis, params);
                this._drawMultiLevelLabel(index, axis, params);
                this._drawAxisTitle(axis);
            }
        },

        _drawAxisTitle: function (axis) {
            if (axis.title.visible) {
                var font = axis.title.font;
                this.gAxisTitleEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + "axisTitle_" + axis.name });
                var opposedPosition = axis._opposed;
                var size = { Width: $(this.svgObject).width(), Height: $(this.svgObject).height() },
                    padding = 10,
                    transform = ej.EjSvgRender.chartTransform3D.transform3D(size);
                transform.mViewport = size;
                transform.Rotation = 0;
                transform.Tilt = 0;
                transform.Depth = 100;
                transform.PerspectiveAngle = 90;
                ej.EjSvgRender.chartTransform3D.transform(transform);
                var result = ej.EjSvgRender.chartTransform3D.result,
                    matrix3D = ej.Ej3DRender.prototype.matrix3D.prototype,
                    orientation = axis.orientation.toLowerCase(),
                    multiLevelLabelsVisible = false, currentAxis, element;

                for (var i = 0; i < this.model._axes.length; i++) {
                    currentAxis = this.model._axes[i];
                    if (currentAxis.orientation.toLowerCase() == orientation) {
                        for (var j = 0; j < currentAxis.multiLevelLabels.length; j++) {
                            if (currentAxis.multiLevelLabels[j].visible) {
                                multiLevelLabelsVisible = true;
                                break;
                            }
                        }
                    }
                }

                if (orientation == "horizontal") {
                    var xtitleLocation = (this.model.elementSpacing) + axis._LableMaxWidth.height;
                    var titlesize = (ej.EjSvgRender.utils._measureText(axis.title.text, (axis.width), axis.title.font).height / 2);
                    var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                    commonEventArgs.data = { Text: axis.title.text, location: { x: (axis.width) / 2, y: (xtitleLocation + titlesize + axis.majorTickLines.size + axis.axisLine.width + this.model.wallSize + axis._multiLevelLabelHeight) }, axes: axis };
                    this._trigger("axesTitleRendering", commonEventArgs);

                    font = axis.title.font;
                    var x1 = commonEventArgs.data.location.x + axis.x;
                    var y1 = (opposedPosition) ? (axis.y - commonEventArgs.data.location.y) : (commonEventArgs.data.location.y + axis.y);

                    element = { Width: titlesize.width, Height: titlesize.height, Label: commonEventArgs.data, TextAnchor: 'middle', tag: 'text', font: font, id: this.svgObject.id + "axisTitle", child: this.chart3D };
                    if (!multiLevelLabelsVisible)
                        this.graphics.addVisual(this.polygon.createTextElement(this.vector.vector3D(x1, y1, 0), element, 10, 10));
                    else {

                        var options = {
                            'id': this.svgObject.id + "axisTitle",
                            'x': x1,
                            'y': y1,
                            'fill': font.color,
                            'font-size': font.size,
                            'font-family': font.fontFamily,
                            'font-style': font.fontStyle,
                            'font-weight': font.fontWeight,
                            'opacity': font.opacity,
                            'text-anchor': "middle"
                        };
                        var newOptions = ej.EjSvgRender.chartTransform3D.toScreen({ x: x1, y: y1, z: 0 }, transform, result, matrix3D);
                        options.x = newOptions.x; options.y = newOptions.y;
                        this.svgRenderer.drawText(options, commonEventArgs.data.Text, this.gAxisTitleEle);
                        this.svgRenderer.append(this.gAxisTitleEle, this.svgObject);
                    }
                }
                else {
                    var titleSize = ej.EjSvgRender.utils._measureText(axis.title.text, (axis.height), axis.title.font);
                    var x1 = (opposedPosition) ? axis.x + ((4 * this.model.elementSpacing) + axis._LableMaxWidth.width + axis.majorTickLines.size + axis.axisLine.width + this.model.wallSize + axis._multiLevelLabelHeight) : axis.x - ((3 * this.model.elementSpacing) + axis._LableMaxWidth.width + axis.majorTickLines.size + axis.axisLine.width + this.model.wallSize + axis._multiLevelLabelHeight);

                    var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                    commonEventArgs.data = { Text: axis.title.text, location: { x: titleSize.width / 2, y: 0 }, axes: axis };
                    this._trigger("axesTitleRendering", commonEventArgs);

                    font = axis.title.font;
                    var y1 = commonEventArgs.data.location.y + (axis.y + axis.height) + (((axis.height) / 2) * -1);

                    var labelRotation = (opposedPosition) ? 90 : -90;
                    var value = opposedPosition ? 25 : -25;
                    element = { Width: titleSize.width, Height: titleSize.height, Angle: -90, Label: commonEventArgs.data, TextAnchor: 'middle', tag: 'text', font: font, id: this.svgObject.id + '_YAxisTitle', child: this.chart3D };
                    if (!multiLevelLabelsVisible)
                        this.graphics.addVisual(this.polygon.createTextElement(this.vector.vector3D(x1, y1, 0), element, 10, 10));
                    else {

                        var options = {
                            'id': id,
                            'x': x1,
                            'y': y1,
                            'fill': font.color,
                            'font-size': font.size,
                            'font-family': font.fontFamily,
                            'font-style': font.fontStyle,
                            'font-weight': font.fontWeight,
                            'opacity': font.opacity,
                            'text-anchor': "middle",
                            'transform': 'rotate(' + -90 + ',' + (x1) + ',' + (opposedPosition ? y1 + padding : y1 - padding) + ')',
                        };
                        var newOptions = ej.EjSvgRender.chartTransform3D.toScreen({ x: x1, y: y1, z: 0 }, transform, result, matrix3D);
                        options.x = newOptions.x + value; options.y = newOptions.y;
                        this.svgRenderer.drawText(options, commonEventArgs.data.Text, this.gAxisTitleEle);
                        this.svgRenderer.append(this.gAxisTitleEle, this.svgObject);
                    }
                }
            }
        },

        _drawMultiLevelLabel: function (axisIndex, axis, params) {    // to render multilevel labels
            // declaration
            this.gMultiLevelEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_axisMultiLevelLabels' + '_' + axisIndex });
            var i, j, x, y, rows, gap, labelSize, grpLabel, id, font, center, centerX, startX, startY, endX, textOptions, textOverflow, depth = 0,
                textCollection, borderOptions, border, style, alignment, multiLevelLabelsLength = axis.multiLevelLabels.length, model = this.model,
                elementSpacing = model.elementSpacing, padding = 10, x1 = 0, y1 = 0, element, anchor, topValue, bottomValue, leftValue, text, actualText,
                rightValue, lineTop, bottom, right, left, areaBounds = model.m_AreaBounds, textSize, visibleRange = axis.visibleRange, actual3DPosition1,
                wallSize = model.wallSize, opposedPosition = axis._opposed, validCross = params.axes[axis.name]._validCross, actual3DPosition2,
                orientation = axis.orientation.toLowerCase(), y = validCross ? axis.y : areaBounds.Y + (!opposedPosition && areaBounds.Height), alignment,
                x = validCross ? axis.x : areaBounds.X + (opposedPosition && areaBounds.Width), options, newOptions, vectorColl = [], l, borderWidth;

            var size = { Width: $(this.svgObject).width(), Height: $(this.svgObject).height() };
            var transform = ej.EjSvgRender.chartTransform3D.transform3D(size);
            transform.mViewport = size;
            transform.Rotation = 0;
            transform.Tilt = 0;
            transform.Depth = 100;
            transform.PerspectiveAngle = model.perspectiveAngle;
            ej.EjSvgRender.chartTransform3D.transform(transform);
            var result = ej.EjSvgRender.chartTransform3D.result,
                matrix3D = ej.Ej3DRender.prototype.matrix3D.prototype;

            for (var i = 0; i < multiLevelLabelsLength; i++) {
                grpLabel = axis.multiLevelLabels[i];
                id = this.svgObject.id + "_" + axis.name + "MultiLevelLabels_" + axisIndex + "_" + i;
                if (grpLabel.text != "" && grpLabel.visible) {
                    level = grpLabel._level;
                    anchor = "middle";
                    font = grpLabel.font;
                    borderWidth = grpLabel.border.width;
                    maximumTextWidth = grpLabel.maximumTextWidth;
                    alignment = grpLabel.textAlignment.toLowerCase();
                    actualText = text = grpLabel.text;
                    textOverflow = grpLabel.textOverflow.toLowerCase();
                    textSize = ej.EjSvgRender.utils._measureText(grpLabel.text, areaBounds.Width, grpLabel.font);
                    center = (grpLabel.end - grpLabel.start) / 2;
                    centerX = (grpLabel.start + center - visibleRange.min) / (visibleRange.delta);
                    startX = (grpLabel.start - visibleRange.min) / (visibleRange.delta);
                    endX = (grpLabel.end - visibleRange.min) / (visibleRange.delta);
                    if (axis.isInversed) {
                        centerX = isNaN(centerX) ? 0 : 1 - centerX;
                        startX = isNaN(startX) ? 0 : 1 - startX;
                        endX = isNaN(endX) ? 0 : 1 - endX;
                    }
                    if (orientation == "horizontal") {    // start, end and gap calculation
                        x1 = (Math.round(axis.width * centerX)) + areaBounds.X + ((axis.plotOffset));
                        y1 = (opposedPosition) ? (y - wallSize - (axis.majorTickLines.size) - elementSpacing - padding / 2 - axis._LableMaxWidth.height) : y + wallSize + (axis.majorTickLines.size) + elementSpacing + axis._LableMaxWidth.height;
                        startX = (Math.round(axis.width * startX)) + areaBounds.X + ((axis.plotOffset));
                        endX = (Math.round(axis.width * endX)) + areaBounds.X + ((axis.plotOffset));
                        gap = maximumTextWidth ? maximumTextWidth : endX - startX - padding;
                    } else {
                        y1 = Math.round(axis.plotOffset + axis.y + (axis.height * (1 - centerX)));
                        x1 = (opposedPosition) ? (axis.x + wallSize + axis.majorTickLines.size + axis.axisLine.width + elementSpacing / 2 + axis._LableMaxWidth.width + axis.multiLevelLabelHeight[level] / 2) : (x - wallSize - axis.majorTickLines.size - elementSpacing / 2 - axis._LableMaxWidth.width - axis.multiLevelLabelHeight[level] / 2);
                        startX = Math.round(axis.plotOffset + axis.y + (axis.height * (1 - startX)));
                        endX = Math.round(axis.plotOffset + axis.y + (axis.height * (1 - endX)));
                        gap = maximumTextWidth ? maximumTextWidth : axis.multiLevelLabelHeight[level] + padding;
                    }
                    y1 = opposedPosition ? y1 - axis.prevHeight[level] : y1 + axis.prevHeight[level];

                    if (alignment == "far") {
                        x1 = x1 + gap / 2 - borderWidth / 2;
                        anchor = "end";
                    } else if (alignment == "near") {
                        anchor = "start";
                        x1 = x1 - (gap / 2) + (borderWidth / 2);
                    }

                    // to trigger event
                    var data = ej.EjAxisRenderer.prototype._triggerMultiLevelLabelsRendering(actualText, x1, y1, textOverflow, font, grpLabel.border, this), text, actualText;
                    text = actualText = data.text;
                    x1 = data.location.x;
                    y1 = data.location.y;
                    textOverflow = data.textOverflow.toLowerCase();
                    font = data.font;
                    font.color = font.color ? font.color : axis.multiLevelLabelsFontColor;
                    border = data.border;
                    style = data.border.type.toLowerCase();
                    borderWidth = data.border.width;

                    options = {
                        'id': id,
                        'x': x1,
                        'y': y1,
                        'fill': font.color,
                        'font-size': font.size,
                        'font-family': font.fontFamily,
                        'font-style': font.fontStyle,
                        'font-weight': font.fontWeight,
                        'opacity': font.opacity,
                        'text-anchor': anchor
                    };

                    // calculation for wrap and wrapbyword
                    if (textOverflow != "none")
                        text = ej.EjAxisRenderer.prototype.textOverflowMultiLevelLabels(axis, gap, text, actualText, textOverflow, font, textSize, { x: x1, y: y1 }, null, this);
                    if (textOverflow == "wrap" || textOverflow == "wrapandtrim") {
                        newY = y1;
                        for (j = 0; j < text.length; j++) {
                            textSize = ej.EjSvgRender.utils._measureText(text[j], null, font);
                            if (j != 0) newY = opposedPosition ? newY - textSize.height : newY + textSize.height;
                            element = { Width: textSize.width, Height: textSize.height, Label: { "Text": text[j] }, TextAnchor: anchor, tag: 'text', font: font, id: id + "_" + j, child: this.chart3D };
                            options.id = options.id + "_" + j;
                            var newOptions = ej.EjSvgRender.chartTransform3D.toScreen({ x: x1, y: newY + padding / 2, z: 0 }, transform, result, matrix3D);
                            options.x = newOptions.x; options.y = newOptions.y;
                            this.svgRenderer.drawText(options, text[j], this.gMultiLevelEle);
                        }
                    }
                    x1 = orientation == "horizontal" ? x1 : (opposedPosition ? x1 + padding : x1 - padding);

                    //rendering multi level labels text
                    if (textOverflow != "wrap" && textOverflow != "wrapandtrim") {
                        element = { Width: textSize.width, Height: textSize.height, Label: { "Text": text }, TextAnchor: anchor, tag: 'text', font: font, id: id, child: this.chart3D };
                        var newOptions = ej.EjSvgRender.chartTransform3D.toScreen({ x: x1, y: y1 + padding / 2, z: 0 }, transform, result, matrix3D);
                        options.x = newOptions.x; options.y = newOptions.y;
                        this.svgRenderer.drawText(options, text, this.gMultiLevelEle);
                    }
                    // storing region for multi level labels click event
                    if (orientation == "horizontal")
                        var region = { bounds: { x: startX, y: y1 - padding, height: axis.multiLevelLabelHeight[level], width: gap }, axisIndex: axisIndex, multiLevelLabel: grpLabel };
                    else
                        var region = { bounds: { x: x1 - width / 2 - padding / 2, y: endX, height: startX - endX, width: width }, axisIndex: axisIndex, multiLevelLabel: grpLabel };
                    this.model.multiLevelLabelRegions.push(region);

                    // to render border
                    if (style != "none" && borderWidth > 0) {
                        id = this.svgObject.id + "_" + axis.name + "MultiLevelLabelsBorder_" + axisIndex + "_" + i;
                        var height = y1 - padding + axis.multiLevelLabelHeight[level] + padding / 2;
                        var borderColor = grpLabel.border.color ? grpLabel.border.color : axis.multiLevelLabelsColor
                        if (orientation == "horizontal") {
                            topValue = { x1: startX, y1: y1 - padding, x2: endX, y2: y1 - padding };
                            bottomValue = { x1: startX, y1: height, x2: endX, y2: height };
                            leftValue = { x1: startX, y1: y1 - padding, x2: startX, y2: height };
                            rightValue = { x1: endX, y1: y1 - padding, x2: endX, y2: height };
                        } else {
                            width = axis.multiLevelLabelHeight[level];
                            topValue = { x1: x1 - width / 2 - padding / 2, y1: endX, x2: x1 + width / 2 + padding / 2, y2: endX };
                            bottomValue = { x1: x1 - width / 2 - padding / 2, y1: startX, x2: x1 + width / 2 + padding / 2, y2: startX };
                            leftValue = { x1: x1 - width / 2 - padding / 2, y1: endX, x2: x1 - width / 2 - padding / 2, y2: startX };
                            rightValue = { x1: x1 + width / 2 + padding / 2, y1: endX, x2: x1 + width / 2 + padding / 2, y2: startX };
                        }
                        for (l = 0; l < 4; l++) {
                            switch (l) {
                                case 0:
                                    newId = id + "_top";
                                    value = topValue;
                                    break;
                                case 1:
                                    newId = id + "_bottom";
                                    value = bottomValue;
                                    break;
                                case 2:
                                    newId = id + "_left";
                                    value = leftValue;
                                    break;
                                case 3:
                                    newId = id + "_right";
                                    value = rightValue;
                                    break;
                            }
                            vectorColl[0] = ej.Ej3DRender.prototype.vector3D.prototype.vector3D(value.x1, value.y1, depth);
                            vectorColl[1] = ej.Ej3DRender.prototype.vector3D.prototype.vector3D(value.x2, value.y2, depth);
                            actual3DPosition1 = ej.EjSvgRender.chartTransform3D.toScreen(vectorColl[0], transform, result, matrix3D);
                            actual3DPosition2 = ej.EjSvgRender.chartTransform3D.toScreen(vectorColl[1], transform, result, matrix3D);
                            options = {
                                'id': newId,
                                'x1': actual3DPosition1.x,
                                'y1': actual3DPosition1.y,
                                'x2': actual3DPosition2.x,
                                'y2': actual3DPosition2.y,
                                'stroke': borderColor,
                                'stroke-width': borderWidth
                            };
                            this.svgRenderer.drawLine(options, this.gMultiLevelEle);
                        }
                        this.svgRenderer.append(this.gMultiLevelEle, this.svgObject);
                    }
                }
            }
        },

        _textTrim: function (maxWidth, text, font) {
            var textLength = text.length; var trimmedSize;
            var label;
            var textSize = ej.EjSvgRender.utils._measureText(text, this.model.m_AreaBounds.Width, font);
            if (textSize.width > maxWidth) {
                for (var k = textLength - 1; k >= 0; --k) {
                    label = text.substring(0, k) + '...';
                    trimmedSize = ej.EjSvgRender.utils._measureText(label, this.model.m_AreaBounds.Width, font)
                    if (trimmedSize.width <= maxWidth) {
                        return label;
                    }
                }
            } else {
                return text;
            }
        },

        _textWrap: function (maxWidth, currentLabel, font) {
            var textCollection = currentLabel.toString().split(' ');
            var label = '';
            var labelCollection = []; var length = textCollection.length;
            var text = '';
            for (var i = 0; i < length; i++) {
                text = textCollection[i];
                if (ej.EjSvgRender.utils._measureText(label.concat(text), this.model.m_AreaBounds.Width, font).width < maxWidth) {
                    label = label.concat((label === '' ? '' : ' ') + text);
                } else {
                    if (label !== '') {
                        labelCollection.push(this._textTrim(maxWidth, label, font));
                        label = text;
                    } else {
                        labelCollection.push(this._textTrim(maxWidth, text, font));
                        text = '';
                    }
                }
                if (label && i === length - 1) {
                    labelCollection.push(this._textTrim(maxWidth, label, font));
                }
            }
            return labelCollection;

        },

        _textWrapByLength: function (maxWidth, currentLabel, font) {
            var start = 0; var labelCollection = []; var tempLabel = '';
            currentLabel = currentLabel.toString();
            var maxWordLength = currentLabel.length;
            for (var j = 0; j <= maxWordLength; j++) {
                tempLabel = start == 0 ? currentLabel.slice(start, j) : '-' + currentLabel.slice(start, j);
                if (ej.EjSvgRender.utils._measureText(tempLabel, this.model.m_AreaBounds.Width, font).width > maxWidth - 5) {
                    labelCollection.push(tempLabel);
                    start = j++;
                } else if (j === maxWordLength) {
                    labelCollection.push(tempLabel);
                }
            }
            return labelCollection;
        },

        _multipleRows: function (length, currentX, currentLabel, axis) {
            var label, pointX, labelSize;
            var store = [];
            var isMultiRows;

            for (var i = length - 1; i >= 0; i--) {
                label = axis.visibleLabels[i];
                labelSize = ej.EjSvgRender.utils._measureText(label.Text, this.model.m_AreaBounds.Width, axis.font);
                pointX = ej.EjSvgRender.utils._valueToCoefficient(axis, i) * axis.width + axis.x
                isMultiRows = currentX < (pointX + labelSize.width / 2);
                if (isMultiRows) {
                    label.index = label.index ? label.index : 0;
                    store.push(label.index);
                    currentLabel.index = (currentLabel.index > label.index) ? currentLabel.index : label.index + 1;
                } else {
                    currentLabel.index = store.indexOf(label.index) > - 1 ? currentLabel.index : label.index;
                }
            }
        },

        _drawAxisLabel: function (axis, params) {
            var labels = []; var angleValue = null; var extraHeight = 0;
            var labelsCount = axis.visibleLabels.length,
                areaBounds = this.model.m_AreaBounds,
                opposedPosition = axis._opposed, element,
                validCross = params.axes[axis.name]._validCross,
                y = validCross ? axis.y : areaBounds.Y + (!opposedPosition && areaBounds.Height),
                x = validCross ? axis.x : areaBounds.X + (opposedPosition && areaBounds.Width);

            for (var i = 0; i < labelsCount; i++) {
                if (!ej.util.isNullOrUndefined(axis.visibleLabels[i].Text)) {
                    var x1 = 0, y1 = 0, x2 = 0, y2 = 0; var pointX; var previousVisblelabel;
                    axis.visibleLabels[i].originalText = axis.visibleLabels[i].Text;
                    var textAnchor;

                    var textSize = ej.EjSvgRender.utils._measureText(axis.visibleLabels[i].Text, this.model.m_AreaBounds.Width, axis.font);
                    var value = (axis.visibleLabels[i].Value - axis.visibleRange.min) / (axis.visibleRange.delta);
                    value = (axis.isInversed) ? 1 - value : value;
                    value = isNaN(value) ? 0 : value;

                    if (axis.orientation.toLowerCase() == "horizontal") {
                        x2 = x1 = (Math.round(axis.width * value)) + this.model.m_AreaBounds.X + ((axis.plotOffset));
                        y1 = (opposedPosition) ? (y - this.model.wallSize - (axis.majorTickLines.size) - (this.model.elementSpacing / 2)) : y + this.model.wallSize + (axis.majorTickLines.size) + this.model.elementSpacing;
                        textAnchor = "middle"
                    }
                    else {
                        y1 = y2 = Math.round(axis.plotOffset + axis.y + (textSize.height / 4) + (axis.height * (1 - value)));
                        x1 = (opposedPosition) ? (axis.x + axis.majorTickLines.size + axis.axisLine.width + this.model.elementSpacing / 2) : (x - this.model.wallSize - axis.majorTickLines.size - this.model.elementSpacing / 2);
                        textAnchor = (opposedPosition) ? "start" : "end"
                    }
                    labels.push({ x: x1, y: y1, size: textSize })
                    var maxWidth = axis.width / axis.visibleLabels.length - 5;
                    var label = labels[i];
                    if (((label.x - label.size.width / 2 < axis.x && i === 0) || (label.x + label.size.width / 2 > axis.x + axis.width && i === axis.visibleLabels.length - 1)) && axis.labelIntersectAction != 'trim' && axis.labelIntersectAction.indexOf('wrap') < 0) {
                        if (axis.edgeLabelPlacement === 'hide') {
                            continue;
                        } else if (axis.edgeLabelPlacement === 'shift') {
                            if (i == 0) {
                                label.x = x1 = axis.x + label.size.width / 2;
                            } else if (i == axis.visibleLabels.length - 1) {
                                label.x = x1 = axis.x + axis.width - label.size.width / 2;
                            }

                        }
                    }

                    //angle rotation and label intersect actions for 3d-chart
                    if (axis.orientation.toLowerCase() == 'horizontal') {
                        if (axis.labelRotation) {
                            angleValue = axis.labelRotation;
                            var rotatedSize = ej.EjSvgRender.utils.rotatedLabel(axis, this, axis.labelRotation, axis.visibleLabels[i].Text, true);
                            y1 += rotatedSize.height / 2;
                        } else {
                            if (axis.labelIntersectAction == 'trim') {
                                axis.visibleLabels[i].Text = this._textTrim(maxWidth, axis.visibleLabels[i].Text, axis.font);
                            } else if (axis.labelIntersectAction == 'wrapByWord') {
                                axis.visibleLabels[i].Text = this._textWrap(maxWidth, axis.visibleLabels[i].Text, axis.font);
                            } else if (axis.labelIntersectAction == 'wrap') {
                                axis.visibleLabels[i].Text = this._textWrapByLength(maxWidth, axis.visibleLabels[i].Text, axis.font);
                            } else if (axis.labelIntersectAction == 'rotate45' || axis.labelIntersectAction == 'rotate90') {
                                angleValue = axis.labelIntersectAction.indexOf('45') > -1 ? 45 : 90;
                                var rotatedSize = ej.EjSvgRender.utils.rotatedLabel(axis, this, angleValue, axis.visibleLabels[i].Text, true);
                                y1 += rotatedSize.height / 2;
                            } else if (axis.labelIntersectAction === 'multipleRows') {
                                pointX = label.x
                                pointX -= textSize.width / 2;
                                this._multipleRows(i, pointX, axis.visibleLabels[i], axis);
                                y1 = axis.visibleLabels[i].index ? y1 + axis.visibleLabels[i].index * (textSize.height + 5) : y1;
                            } else if (axis.labelIntersectAction === 'hide') {
                                previousVisblelabel = previousVisblelabel ? previousVisblelabel : 0;
                                if (i != 0) {
                                    if (labels[previousVisblelabel].x + labels[previousVisblelabel].size.width / 2 >= labels[i].x - labels[i].size.width / 2) {
                                        continue;
                                    }
                                }
                                previousVisblelabel = i;
                            }
                        }
                    }

                    element = { Width: textSize.width, Height: textSize.height, Label: axis.visibleLabels[i], TextAnchor: textAnchor, tag: 'text', font: axis.font, id: this.svgObject.id + axis.orientation + i, child: this.chart3D, Angle: angleValue };

                    this.graphics.addVisual(this.polygon.createTextElement(this.vector.vector3D(x1, y1, 0), element, 10, 10));
                }
            }

        },

        _renderTicks3D: function (axis, size, width, params) {
            var labelsCount = axis.visibleLabels.length,
                parent,
                gEle,
                m_AreaBounds = this.model.m_AreaBounds,
                y = axis.y;

            for (var i = 0; i < labelsCount; i++) {
                var x1 = 0, x2 = 0, y1 = 0, y2 = 0;


                var value = (axis.visibleLabels[i].Value - axis.visibleRange.min) / (axis.visibleRange.delta);
                value = (axis.isInversed) ? 1 - value : value;
                value = isNaN(value) ? 0 : value;

                if (axis.orientation.toLowerCase() == "horizontal") {
                    x2 = x1 = (Math.round(axis.width * value)) + m_AreaBounds.X + ((axis.plotOffset));
                }
                else {
                    y1 = y2 = Math.round(axis.plotOffset + ((axis.height) * (1 - value)) + axis.y);
                }

                var position = this._calculatePosition3D(axis, axis.tickLinesPosition, size, width, x1, y1, x2, y2, params);


                var line = { width: axis.majorTickLines.width, stroke: axis.majorTickLines.color, child: this.chart3D, tag: 'line' };

                line.id = this.svgObject.id + axis.name + "_majorTickLines_" + i;

                this.graphics.addVisual(this.polygon.createLine(line, position.X1, position.Y1, position.X2, position.Y2, 0));

                if (axis.minorGridLines.visible && axis.minorTicksPerInterval > 0 && i < labelsCount - 1) {
                    minorTicks = axis.visibleRange.interval / (axis.minorTicksPerInterval + 1);
                    for (var k = 0; k < axis.minorTicksPerInterval; k++) {
                        value = ej.EjSvgRender.utils._valueToCoefficient(axis, axis.visibleLabels[i].Value + (minorTicks * (k + 1)));

                        value = isNaN(value) ? 0 : value;

                        if (axis.orientation.toLowerCase() == "horizontal") {
                            x1 = x2 = Math.round(axis.plotOffset + (m_AreaBounds.Width * value) + m_AreaBounds.X);
                        }
                        else {
                            y1 = y2 = Math.round(axis.plotOffset + ((m_AreaBounds.Height) * (1 - value))) + axis.y;
                        }

                        var position = this._calculatePosition3D(axis, axis.tickLinesPosition, size, width, x1, y1, x2, y2, params);


                        var line = { width: axis.minorTickLines.width, stroke: axis.minorTickLines.color, child: this.chart3D, tag: 'line' };

                        line.id = this.svgObject.id + axis.name + "_minorTickLines_" + i + k;

                        this.graphics.addVisual(this.polygon.createLine(line, position.X1, position.Y1, position.X2, position.Y2, 0));
                    }
                }
            }
        },

        _calculatePosition3D: function (axis, ticksPosition, tickSize, width, x1, y1, x2, y2, params) {
            var orientation = axis.orientation;
            var isOpposed = axis._opposed,
                ticksPosition = "outside",
                areaBounds = this.model.m_AreaBounds,
                validCross = params.axes[axis.name]._validCross,
                y = validCross ? axis.y : areaBounds.Y + (!isOpposed && areaBounds.Height),
                x = validCross ? axis.x : areaBounds.X + (isOpposed && areaBounds.Width);
            if (axis.orientation.toLowerCase() == "horizontal") {
                switch (ticksPosition) {
                    case "inside":
                        y1 = isOpposed ? width : 0;
                        y2 = isOpposed ? y1 + tickSize : tickSize;
                        break;
                    case "outside":
                        y1 = 0;
                        y2 = isOpposed ? tickSize : y1 + tickSize;
                        break;
                }
                var screenPositionTop = ((isOpposed) ? y - this.model.wallSize - (tickSize) : y + this.model.wallSize - (tickSize / 2));
                var screenPositionLeft = axis.x;
                y1 += screenPositionTop;
                y2 += screenPositionTop;

                x1 = x2 = x1;
            }
            else {
                switch (ticksPosition) {
                    case "inside":
                        x1 = 0;
                        x2 = isOpposed ? tickSize : x1 + tickSize;
                        break;
                    case "outside":
                        x1 = 0;
                        x2 = isOpposed ? x1 + tickSize : tickSize;
                        break;
                }
                var screenPositionLeft = (isOpposed) ? x + this.model.wallSize : (x - this.model.wallSize - tickSize);
                var screenPositionTop = this.model.m_AreaBounds.Y;
                x1 += screenPositionLeft;
                x2 += screenPositionLeft;

                y1 = y2 = y1;
            }
            return { X1: x1, Y1: y1, X2: x2, Y2: y2 };
        },



        _drawGridLines3D: function (axis, params) {
            if (axis == null)
                return;

            var labelsCount = axis.visibleLabels.length,
                minorTicks, opposedPosition = axis._opposed,
                orientation = axis.orientation, validCross = params.axes[axis.name]._validCross,
                x1, x2, y1, y2, index;
            if (orientation.toLowerCase() == "horizontal") {

                var i;
                for (i = 0; i < labelsCount; i++) {
                    var value = ej.EjSvgRender.utils._valueToCoefficient(axis, axis.visibleLabels[i].Value);
                    value = isNaN(value) ? 0 : value;
                    x2 = x1 = (Math.round(axis.width * value)) + this.model.m_AreaBounds.X + axis.plotOffset;
                    y1 = this.model.m_AreaBounds.Y;
                    y2 = this.model.m_AreaBounds.Y + this.model.m_AreaBounds.Height;


                    var depth = this.model.depth > 2 ? this.model.depth - 2 : 1;
                    var bottom = validCross ? axis.y : this.model.m_AreaBounds.Y + (!opposedPosition && this.model.m_AreaBounds.Height);

                    var line = { opacity: axis.majorGridLines.opacity, width: axis.majorGridLines.width, stroke: axis.majorGridLines.color, child: this.chart3D, tag: 'line' };
                    line.id = this.svgObject.id + axis.name + "_gridlines_" + i;
                    this.graphics.addVisual(this.polygon.createLine(line, x1, y1, x2, y2, depth));
                    var parallelLine = $.extend({}, line);
                    parallelLine.id = this.svgObject.id + axis.name + "_parallelGridlines_" + i;

                    var line3D = this.polygon.createLine(parallelLine, x2, 0, x2, -depth, bottom);
                    //To fold the gridline alone the wall(bottom)
                    this.polygon.transform(this.matrixobj.tilt((parseFloat)(Math.PI / 2)), line3D);

                    this.graphics.addVisual(line3D);

                    if (axis.minorGridLines.visible && axis.minorTicksPerInterval > 0 && i < labelsCount - 1) {
                        minorTicks = axis.visibleRange.interval / (axis.minorTicksPerInterval + 1);
                        for (var k = 0; k < axis.minorTicksPerInterval; k++) {
                            value = ej.EjSvgRender.utils._valueToCoefficient(axis, axis.visibleLabels[i].Value + (minorTicks * (k + 1)));
                            value = isNaN(value) ? 0 : value;
                            x2 = x1 = (Math.round(this.model.m_AreaBounds.Width * value) + this.model.m_AreaBounds.X);
                            y1 = this.model.m_AreaBounds.Y;
                            y2 = this.model.m_AreaBounds.Y + this.model.m_AreaBounds.Height;

                            var line = { opacity: axis.minorGridLines.opacity, width: axis.minorGridLines.width, stroke: axis.minorGridLines.color, child: this.chart3D, tag: 'line' };
                            line.id = this.svgObject.id + axis.name + "_minorgridlines_" + i + k;
                            this.graphics.addVisual(this.polygon.createLine(line, x1, y1, x2, y2, depth));
                            var parallelLine = $.extend({}, line);
                            parallelLine.id = this.svgObject.id + axis.name + "_parallelMinorGridlines_" + i + k;

                            var line3D = this.polygon.createLine(parallelLine, x2, 0, x2, -depth, bottom);
                            //To fold the gridline alone the wall(bottom)
                            this.polygon.transform(this.matrixobj.tilt((parseFloat)(Math.PI / 2)), line3D);

                            this.graphics.addVisual(line3D);
                        }
                    }

                    index++;
                }
            }
            else {
                var i;


                for (i = 0; i < labelsCount; i++) {
                    //if (i < linesCount)
                    //{
                    var line;
                    var value = (axis.visibleLabels[i].Value - axis.visibleRange.min) / (axis.visibleRange.delta);
                    value = (axis.isInversed) ? 1 - value : value;
                    value = isNaN(value) ? 0 : value;
                    x1 = this.model.m_AreaBounds.X;
                    y1 = Math.round((axis.height) * (1 - value)) + 0.5;
                    y1 += axis.y;
                    x2 = x1 + this.model.m_AreaBounds.Width;
                    y2 = y1;

                    var depth = this.model.depth > 2 ? this.model.depth - 2 : 1;

                    var line = { opacity: axis.majorGridLines.opacity, width: axis.majorGridLines.width, stroke: axis.majorGridLines.color, axisName: axis.name, child: this.chart3D, tag: 'line' };

                    line.id = this.svgObject.id + axis.name + "_gridlines_" + i;

                    this.graphics.addVisual(this.polygon.createLine(line, x1, y1, x2, y2, depth));

                    var depthD = validCross ? axis.x : this.model.m_AreaBounds.X + (opposedPosition && this.model.m_AreaBounds.Width + 1);

                    var sideLine = $.extend({}, line);
                    sideLine.id = this.svgObject.id + axis.name + "_parallelGridlines_" + i;

                    var line3D = this.polygon.createLine(sideLine, -depth, y2, 0, y2, depthD);
                    //To fold the gridline alone the wall(right of vertical)
                    this.polygon.transform(this.matrixobj.turn((parseFloat)(-Math.PI / 2)), line3D);
                    this.graphics.addVisual(line3D);

                    if (axis.minorGridLines.visible && axis.minorTicksPerInterval > 0 && i < labelsCount - 1) {
                        minorTicks = axis.visibleRange.interval / (axis.minorTicksPerInterval + 1);
                        for (var k = 0; k < axis.minorTicksPerInterval; k++) {
                            var value = ej.EjSvgRender.utils._valueToCoefficient(axis, axis.visibleLabels[i].Value + (minorTicks * (k + 1)));
                            value = isNaN(value) ? 0 : value;
                            x1 = this.model.m_AreaBounds.X;
                            y1 = Math.round((axis.height) * (1 - value)) + 0.5;
                            y1 += axis.y;
                            x2 = x1 + this.model.m_AreaBounds.Width;
                            y2 = y1;
                            var line = { opacity: axis.minorGridLines.opacity, width: axis.minorGridLines.width, stroke: axis.minorGridLines.color, axisName: axis.name, child: this.chart3D, tag: 'line' };

                            line.id = this.svgObject.id + axis.name + "_minorgridlines_" + i + k;

                            this.graphics.addVisual(this.polygon.createLine(line, x1, y1, x2, y2, depth));

                            var sideLine = $.extend({}, line);
                            sideLine.id = this.svgObject.id + axis.name + "_parallelMinorGridlines_" + i + k;

                            var line3D = this.polygon.createLine(sideLine, -depth, y2, 0, y2, depthD);
                            //To fold the gridline alone the wall(right of vertical)
                            this.polygon.transform(this.matrixobj.turn((parseFloat)(-Math.PI / 2)), line3D);
                            this.graphics.addVisual(line3D);
                        }
                    }

                    ////}
                    index++;
                }

            }
        }

    },



        ej.Ej3DSeriesRender.prototype = {
            _getSegmentDepth: function (series) {
                var actualDepth = this.chartObj.model.depth;
                var start, end;

                if (this.chartObj.model._sideBySideSeriesPlacement) {
                    var space = actualDepth / 4;
                    start = space;
                    end = space * 3;
                }
                else {
                    var index = series.position - 1;
                    var count = series.all;
                    var space = actualDepth / ((count * 2) + count + 1);
                    start = space + (space * index * 3);
                    end = start + space * 2;
                }
                return { Start: start, End: end, Delta: end - start };
            },

            createSegment: function (center, start, end, height, r, i, y, insideRadius, pointindex) {

                return {
                    StartValue: start,
                    EndValue: end,
                    depth: height,
                    radius: r,
                    index: i,
                    YData: y,
                    Center: center,
                    inSideRadius: insideRadius,
                    ActualEndValue: end,
                    ActualStartValue: start,
                    pointIndex: pointindex
                }

                return segment;

            },

            calculateSize: function (sender, series) {
                var legend = sender.chartObj.model.legend;

                var legXSpace = 0;
                var legYSpace = 0,
                    title = sender.chartObj.model.title,
                    subTitle = sender.chartObj.model.title.subTitle,
                    titleLocation = sender.chartObj.model._titleLocation,
                    subTitleLocation = sender.chartObj.model._subTitleLocation,
                    titleTextOverflow = sender.chartObj.model.title.textOverflow,
                    subTitleTextOverflow = sender.chartObj.model.title.subTitle.textOverflow,
                    titleEnable = (title.text && title.visible && title.enableTrim && (titleTextOverflow == 'wrap' || titleTextOverflow == 'wrapandtrim')) ? true : false,
                    subTitleEnable = (subTitle.text && subTitle.visible && subTitle.enableTrim && (subTitleTextOverflow == 'wrap' || subTitleTextOverflow == 'wrapandtrim')) ? true : false;
                if (legend.visible && legend.position.toLowerCase() != "custom") {
                    if (legend.position.toLowerCase() == "right" || legend.position.toLowerCase() == "left")
                        legXSpace = ((legend.position.toLowerCase() == "right") ? sender.chartObj.model.margin.right : sender.chartObj.model.margin.left) + sender.chartObj.model.LegendViewerBounds.Width;
                    else
                        legYSpace = ((legend.position.toLowerCase() == "top") ? sender.chartObj.model.margin.top : sender.chartObj.model.margin.bottom) + sender.chartObj.model.LegendViewerBounds.Height;

                }
                series.actualWidth = $(sender.chartObj.svgObject).width() - legXSpace;
                var centerx = series.actualWidth * 0.5 + ((legend.position.toLowerCase() === "left") ? legXSpace : 0);
                if (titleEnable || subTitleEnable) {
                    var yOffset = titleLocation.size.height + (subTitleEnable ? subTitleLocation.size.height : 0) + legYSpace;
                    series.actualHeight = $(sender.chartObj.svgObject).height() - yOffset;
                    var centery = series.actualHeight * 0.5 + ((legend.position.toLowerCase() === "top") ? yOffset : titleLocation.size.height + (subTitleEnable ? subTitleLocation.size.height : 0));
                }
                else {
                    var yOffset = ((title.text && title.visible) ? titleLocation.Y : 0) + legYSpace;
                    series.actualHeight = $(sender.chartObj.svgObject).height() - yOffset;
                    var centery = series.actualHeight * 0.5 + ((legend.position.toLowerCase() === "top") ? yOffset : ((title.text && title.visible) ? (titleLocation.Y) : 0));
                }
                return { centerX: centerx, centerY: centery };
            },

            createPoints: function (series, sender) {
                series.segments = [];
                var size = this.calculateSize(sender, series),
                    all = 0,
                    visiblepoints = this._calculateVisiblePoints(series).visiblePoints,
                    count = series._visiblePoints.length;
                for (var j = 0; j < count; j++)
                    all += visiblepoints[j].YValues[0];
                var coef = 360 / all,
                    seriesIndex = $.inArray(series, sender.chartObj.model._visibleSeries),
                    seriesLength = this.chartObj.model._visibleSeries.length,
                    InsideRadius = sender.chartObj.model.innerRadius[seriesIndex],
                    YValues = sender.chartObj._getYValues(series._visiblePoints),
                    pieHeight = sender.chartObj.model.depth, center,
                    arcStartAngle = 0, arcEndAngle = 0,
                    current = 0, pointindex, val, rect, offset, segment,
                    segindex = 0,
                    radius = sender.chartObj.model.circularRadius[seriesIndex];

                for (var i = 0; i < count; i++) {
                    if (series._visiblePoints[i].visible || series._visiblePoints[i].gapMode) {
                        pointindex = $.inArray(series._visiblePoints[i], series._visiblePoints);
                        val = Math.abs(YValues[i]);
                        arcEndAngle = Math.abs(val) * ((Math.PI * 2) / all);
                        rect = {};
                        rect.x = 0;
                        rect.y = 0;

                        if (val != 0) {
                            if (series.explodeIndex == series._visiblePoints[i].actualIndex || series.explodeAll) {
                                offset = { X: 0, Y: 0 };
                                offset.X = Math.cos(2 * Math.PI * (current + val / 2) / all),
                                    offset.Y = Math.sin(2 * Math.PI * (current + val / 2) / all);
                                rect.x = 0.01 * radius * offset.X * series.explodeOffset;
                                rect.y = 0.01 * radius * offset.Y * series.explodeOffset;
                            }

                            center = sender.chartObj.vector.vector3D(rect.x + size.centerX, rect.y + size.centerY, 0);
                            {
                                segment = this.createSegment(center, (parseFloat)(coef * current), (parseFloat)(coef * val), pieHeight, radius, i, val, InsideRadius, pointindex, series);
                                if (series._visiblePoints[i].gapMode)
                                    segment.visible = false;
                                else
                                    segment.visible = true;
                                series.segments.push(segment);
                            }
                        }

                        if (series.marker.dataLabel.visible)
                            this._addPieDataLabel(segindex, YValues[i], arcStartAngle, arcStartAngle + arcEndAngle, i, radius, this._isChartRotated(sender) ? sender.chartObj.model.depth + 5 : 0, center, series._visiblePoints[i]);

                        segindex++;
                        arcStartAngle += arcEndAngle;
                        current += val;

                    }
                }
                return series.segments;
            },

            _addPieDataLabel: function (x, y, startAngle, endAngle, i, radius, startDepth, center, point) {
                var angle = (startAngle + endAngle) / 2;
                point.symbolLocation = { x: 0, y: 0, radius: 0, angle: 0, StartDepth: 0 };
                point.symbolLocation.x = x;
                point.symbolLocation.y = y;
                point.symbolLocation.radius = radius;
                point.symbolLocation.angle = angle;
                point.symbolLocation.center = center;
                point.startDepth = startDepth;
            },

            _isChartRotated: function (sender) {
                var actualTiltView = Math.abs(sender.chartObj.model.tilt % 360);
                var actualRotateView = Math.abs(sender.chartObj.model.rotattion % 360);
                if ((actualTiltView > 90 && actualTiltView < 270) ^ (actualRotateView > 90 && actualRotateView < 270)) {
                    return true;
                }
                return false;
            },

            createSector: function (seg, sender, style, seriesIndex) {
                var count = (parseInt)(Math.ceil(seg.ActualEndValue / 6));
                var DtoR = Math.PI / 180;
                var inc = 0;
                var Points = [];
                var depth = sender.chartObj.model.depth;
                if (count < 1) return null;
                var res = [];
                var f = seg.ActualEndValue / count;

                var oPts = [];
                var iPts = [];

                for (var i = 0; i < count + 1; i++) {
                    var ox = (parseFloat)(seg.Center.x + seg.radius * Math.cos((seg.ActualStartValue + i * f) * DtoR));
                    var oy = (parseFloat)(seg.Center.y + seg.radius * Math.sin((seg.ActualStartValue + i * f) * DtoR));

                    oPts[i] = { X: ox, Y: oy };

                    var ix = (parseFloat)(seg.Center.x + seg.inSideRadius * Math.cos((seg.ActualStartValue + i * f) * DtoR));
                    var iy = (parseFloat)(seg.Center.y + seg.inSideRadius * Math.sin((seg.ActualStartValue + i * f) * DtoR));

                    iPts[i] = { X: ix, Y: iy };
                    Points.push({ X: ox, Y: oy });
                }

                var oPlgs = [], vts;

                for (var i = 0; i < count; i++) {
                    vts = new Array(sender.chartObj.vector.vector3D(oPts[i].X, oPts[i].Y, 0),
                        sender.chartObj.vector.vector3D(oPts[i].X, oPts[i].Y, depth),
                        sender.chartObj.vector.vector3D(oPts[i + 1].X, oPts[i + 1].Y, depth),
                        sender.chartObj.vector.vector3D(oPts[i + 1].X, oPts[i + 1].Y, 0))


                    oPlgs[i] = sender.chartObj.polygon.polygon3D(vts, this, seg.index, style.borderColor, style.borderWidth, style.opacity, style.interior, inc.toString() + "_Region" + "_Series_" + seriesIndex + "_Point_" + seg.index, sender.chartObj.chart3D);
                    inc++;
                }

                res[1] = oPlgs;

                if (seg.inSideRadius > 0) {
                    var iPlgs = [];

                    for (var i = 0; i < count; i++) {
                        vts = new Array(sender.chartObj.vector.vector3D(iPts[i].X, iPts[i].Y, 0),
                            sender.chartObj.vector.vector3D(iPts[i].X, iPts[i].Y, depth),
                            sender.chartObj.vector.vector3D(iPts[i + 1].X, iPts[i + 1].Y, depth),
                            sender.chartObj.vector.vector3D(iPts[i + 1].X, iPts[i + 1].Y, 0))


                        iPlgs[i] = sender.chartObj.polygon.polygon3D(vts, this, seg.index, style.borderColor, style.borderWidth, style.opacity, style.interior, inc.toString() + "_Region" + "_Series_" + seriesIndex + "_Point_" + seg.index, sender.chartObj.chart3D);
                        inc++;
                    }

                    res[3] = iPlgs;
                }

                var tVtxs = [];
                var bVtxs = [];

                for (var i = 0; i < count + 1; i++) {
                    tVtxs.push(sender.chartObj.vector.vector3D(oPts[i].X, oPts[i].Y, 0));
                    bVtxs.push(sender.chartObj.vector.vector3D(oPts[i].X, oPts[i].Y, depth));
                }

                if (seg.inSideRadius > 0) {
                    for (var i = count; i > -1; i--) {
                        tVtxs.push(sender.chartObj.vector.vector3D(iPts[i].X, iPts[i].Y, 0));
                        bVtxs.push(sender.chartObj.vector.vector3D(iPts[i].X, iPts[i].Y, depth));
                    }
                }
                else {
                    tVtxs.push(seg.Center);
                    bVtxs.push(sender.chartObj.vector.vector3D(seg.Center.x, seg.Center.y, depth));
                }
                res[0] = [];
                res[0].push(sender.chartObj.polygon.polygon3D(tVtxs, this, seg.index, style.borderColor, style.borderWidth, style.opacity, style.interior, inc.toString() + "_Region" + "_Series_" + seriesIndex + "_Point_" + seg.index, sender.chartObj.chart3D));
                inc++;
                res[0].push(sender.chartObj.polygon.polygon3D(bVtxs, this, seg.index, style.borderColor, style.borderWidth, style.opacity, style.interior, inc.toString() + "_Region" + "_Series_" + seriesIndex + "_Point_" + seg.index, sender.chartObj.chart3D));
                inc++;



                if (seg.inSideRadius > 0) {
                    var rvts = new Array(

                        sender.chartObj.vector.vector3D(oPts[0].X, oPts[0].Y, 0),
                        sender.chartObj.vector.vector3D(oPts[0].X, oPts[0].Y, depth),
                        sender.chartObj.vector.vector3D(iPts[0].X, iPts[0].Y, depth),
                        sender.chartObj.vector.vector3D(iPts[0].X, iPts[0].Y, 0)
                    )

                    var lvts = new Array
                        (
                        sender.chartObj.vector.vector3D(oPts[count].X, oPts[count].Y, 0),
                        sender.chartObj.vector.vector3D(oPts[count].X, oPts[count].Y, depth),
                        sender.chartObj.vector.vector3D(iPts[count].X, iPts[count].Y, depth),
                        sender.chartObj.vector.vector3D(iPts[count].X, iPts[count].Y, 0)
                        )
                    res[2] = [];

                    res[2].push(sender.chartObj.polygon.polygon3D(rvts, this, seg.index, style.borderColor, style.borderWidth, style.opacity, style.interior, inc.toString() + "_Region" + "_Series_" + seriesIndex + "_Point_" + seg.index, sender.chartObj.chart3D));
                    inc++;
                    res[2].push(sender.chartObj.polygon.polygon3D(lvts, this, seg.index, style.borderColor, style.borderWidth, style.opacity, style.interior, inc.toString() + "_Region" + "_Series_" + seriesIndex + "_Point_" + seg.index, sender.chartObj.chart3D));
                    inc++;

                }
                else {
                    var rvts = new Array(
                        sender.chartObj.vector.vector3D(oPts[0].X, oPts[0].Y, 0),
                        sender.chartObj.vector.vector3D(oPts[0].X, oPts[0].Y, depth),
                        sender.chartObj.vector.vector3D(seg.Center.x, seg.Center.y, depth),
                        sender.chartObj.vector.vector3D(seg.Center.x, seg.Center.y, 0)
                    )

                    var lvts = new Array(
                        sender.chartObj.vector.vector3D(oPts[count].X, oPts[count].Y, 0),
                        sender.chartObj.vector.vector3D(oPts[count].X, oPts[count].Y, depth),
                        sender.chartObj.vector.vector3D(seg.Center.x, seg.Center.y, depth),
                        sender.chartObj.vector.vector3D(seg.Center.x, seg.Center.y, 0)
                    )
                    res[2] = [];
                    res[2].push(sender.chartObj.polygon.polygon3D(rvts, this, seg.index, style.borderColor, style.borderWidth, style.opacity, style.interior, inc.toString() + "_Region" + "_Series_" + seriesIndex + "_Point_" + seg.index, sender.chartObj.chart3D));
                    inc++;
                    res[2].push(sender.chartObj.polygon.polygon3D(lvts, this, seg.index, style.borderColor, style.borderWidth, style.opacity, style.interior, inc.toString() + "_Region" + "_Series_" + seriesIndex + "_Point_" + seg.index, sender.chartObj.chart3D));
                    inc++;


                }


                return res;
            },

            createPolygons: function (series, sender, returnPoly) {
                var segments, poligons = [], seg, style,
                    pointindex, segmentsLength, plgs,
                    seriesIndex = $.inArray(series, sender.chartObj.model._visibleSeries);
                if (!series.segments || !returnPoly)
                    segments = this.createPoints(series, sender);
                else
                    segments = series.segments;
                segmentsLength = segments.length;
                for (var i = 0; i < segmentsLength; i++) {
                    seg = segments[i];
                    if (seg.visible) {
                        pointindex = segments[i].pointIndex;
                        style = sender.chartObj.setStyle(sender, series, seriesIndex, pointindex);
                        if (typeof (sender.chartObj.model.pointColors[pointindex]) == "object")
                            style.interior = sender.chartObj.model.pointColors[pointindex][0].color;
                        plgs = this.createSector(seg, sender, style, seriesIndex);
                        if (plgs != null)
                            for (var ai = 0; ai < plgs.length; ai++) {
                                if (!poligons[ai])
                                    poligons[ai] = [];
                                if (plgs[ai] != null) {
                                    for (var pi = 0; pi < plgs[ai].length; pi++) {
                                        poligons[ai].push(plgs[ai][pi]);

                                    }
                                }
                            }
                    }


                }
                if (returnPoly) {
                    return poligons;
                }

                for (var ai = 0; ai < poligons.length; ai++) {
                    for (var k = 0; k < poligons[ai].length; k++) {
                        sender.chartObj.graphics.addVisual(poligons[ai][k]);
                    }
                }
            },

            draw3DDataLabel: function (series, pointIndex, point, sender) {

                var connectorHeight = series.marker.dataLabel.connectorLine.height;
                var tag, radius, pointX, pointY;
                var xOffset = 0; var yOffset = 0;
                if (typeof (series.marker.dataLabel.offset) === 'number') {
                    yOffset = series.marker.dataLabel.offset;
                } else {
                    xOffset = series.marker.dataLabel.offset.x;
                    yOffset = series.marker.dataLabel.offset.y;
                }
                if (this.chartObj.model.AreaType == "none") {
                    location = { x: 0, y: 0 };
                    var pointText = (point.text) ? point.text : point.y;
                    var seriesIndex = $.inArray(series, this.chartObj.model.series);
                    if (series.type.toLowerCase() == "doughnut" || series.type.toLowerCase() == "pie") {

                        var width = Math.min(series.actualWidth, series.actualHeight) / 2;
                        var center = point.symbolLocation.center;
                        var xOffset = series.marker.dataLabel.offset.x;
                        var yOffset = series.marker.dataLabel.offset.y;
                        var dradius = point.symbolLocation.radius * series._coefficient;
                        if (ej.util.isNullOrUndefined(connectorHeight))
                            connectorHeight = ej.EjSvgRender.utils._measureText(pointText, null, series.marker.dataLabel.font).height;
                        if (series != null && series.labelPosition != "inside")
                            radius = point.symbolLocation.radius + connectorHeight;
                        else if (series != null)
                            radius = dradius + (point.symbolLocation.radius - dradius) / 2;
                        pointX = location.X = center.x + radius * Math.cos(point.symbolLocation.angle) + xOffset;
                        pointY = location.Y = center.y + radius * Math.sin(point.symbolLocation.angle) + yOffset;

                        var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                        commonEventArgs.data = { text: pointText, location: { x: pointX, y: pointY }, series: series, pointIndex: pointIndex, seriesIndex: seriesIndex };
                        this.chartObj._trigger("displayTextRendering", commonEventArgs);
                        commonEventArgs.data.Text = commonEventArgs.data.text;
                        var size = ej.EjSvgRender.utils._measureText(commonEventArgs.data.Text, null, series.marker.dataLabel.font);
                        pointX = location.X = commonEventArgs.data.location.x;
                        pointY = location.Y = commonEventArgs.data.location.y;
                    }
                }
                else {
                    var labelFormat = series.yAxis.labelFormat ? series.yAxis.labelFormat : "";
                    var seriesIndex = $.inArray(series, this.chartObj.model.series);
                    var labelPrecisionDefault = 6, labelPrecisionHighest = 20;
                    var pointText = (point.text) ? point.text : point.y ;
                    if (labelFormat) {
                    if (labelFormat.indexOf("{value}") > -1)
                         pointText = labelFormat.replace("{value}", point.y);
                    else if (labelFormat.indexOf('e') == 0 || labelFormat.indexOf('E') == 0) {
                    labelPrecision = labelFormat.match(/(\d+)/g);
                    labelPrecision = labelPrecision == null ? labelPrecisionDefault : labelPrecision > labelPrecisionHighest ? labelPrecisionHighest : labelPrecision;
                    pointText = point.y.toExponential(labelPrecision);
                    }
                    else pointText = ej.globalize.format(point.y, labelFormat, this.chartObj.model.locale);
                    }
                    var pointHeight = 0;
                    var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                    var size = ej.EjSvgRender.utils._measureText(pointText, null, series.marker.dataLabel.font);
                    var location = ej.EjSvgRender.utils.Transform3DToVisible(series, point.symbolLocation.x, point.symbolLocation.y, this.chartObj);
                    var connectorHeight = (series.marker.dataLabel.connectorLine.height) ? series.marker.dataLabel.connectorLine.height : 0;
                    var angle = (6.28 * (1 - (90 / 360.0)));
                    var pointY = location.Y;
                    var pointX = location.X;
                    if (!this.chartObj.model.requireInvertedAxes) {
                        if (point.y > 0)
                            pointY = location.Y + (Math.sin((angle)) * connectorHeight);
                        else
                            pointY = location.Y + (Math.sin((-angle)) * connectorHeight);
                    }
                    else {
                        if (point.x > 0)
                            pointX = location.X - (Math.sin((angle)) * connectorHeight);
                        else
                            pointX = location.X + (Math.sin((angle)) * connectorHeight);
                        pointHeight = - size.height / 3;
                    }
                    if (series.marker.dataLabel.textPosition == 'bottom')
                        pointY = location.Y + yOffset;
                    else
                        pointY = location.Y - yOffset;
                    pointX = location.X + xOffset;
                    commonEventArgs.data = { text: pointText, location: { x: pointX, y: pointY }, series: series, pointIndex: pointIndex };
                    commonEventArgs.data.Text = commonEventArgs.data.text;
                    this.chartObj._trigger("displayTextRendering", commonEventArgs);
                    pointX = commonEventArgs.data.location.x;
                    pointY = commonEventArgs.data.location.y;
                }



                var depthInfo = this._getSegmentDepth(series);



                if (series.marker.dataLabel.shape.toLowerCase() != "none" && !point.marker.dataLabel.template && commonEventArgs.data.Text != '') {

                    var element = { tag: 'dataLabel', series: series, point: point, pointIndex: pointIndex, id: this.chartObj.svgObject.id + seriesIndex + '_DataLabel' + pointIndex, child: this.chartObj.chart3D };

                    this.chartObj.graphics.addVisual(this.chartObj.polygon.createTextElement(this.chartObj.vector.vector3D(pointX, pointY, (point.symbolLocation.z) ? point.symbolLocation.z : 0), element, 0, -size.height));
                }

                tag = (!point.marker.dataLabel.template) ? "text" : "template";

                var element = { Width: size.width, Height: size.height, Label: commonEventArgs.data, TextAnchor: "middle", tag: tag, font: series.marker.dataLabel.font, Angle: series.marker.dataLabel.angle, id: this.chartObj.svgObject.id + '_SeriesText' + pointIndex + seriesIndex, child: this.chartObj.chart3D };


                if (this.chartObj.model.AreaType != "none") {
                    if (series.marker.dataLabel.connectorLine.height && series.marker.dataLabel.connectorLine.height > 0) {
                        var drawPoints = [];
                        drawPoints.push({ x: location.X, y: location.Y + pointHeight, z: point.symbolLocation.z });

                        drawPoints.push({ x: pointX, y: pointY + pointHeight, z: point.symbolLocation.z });
                        this.drawLineSegment(drawPoints, pointIndex, series);
                    }
                    this.chartObj.graphics.addVisual(this.chartObj.polygon.createTextElement(this.chartObj.vector.vector3D(pointX, pointY, point.symbolLocation.z), element, 0, -size.height));
                }
                else {
                    if (series.labelPosition.toLowerCase() != "inside")
                        this.updateConnectorLine(point, pointIndex, series, location, connectorHeight)
                    var finalSize = { x: series.actualWidth, y: series.actualHeight };
                    this.chartObj.graphics.addVisual(this.chartObj.polygon.createTextElement(this.chartObj.vector.vector3D(location.X, location.Y, -1), element, 0, -size.height));
                }
            },
            updateConnectorLine: function (point, pointIndex, series, location, connectorHeight) {
                var drawPoints = [];
                var symbolLocation = point.symbolLocation;
                var x = symbolLocation.center.x + Math.cos(symbolLocation.angle) * symbolLocation.radius;
                var y = symbolLocation.center.y + Math.sin(symbolLocation.angle) * symbolLocation.radius;
                drawPoints.push({ x: x, y: y });
                var labelRadiusFromOrigin = symbolLocation.radius + connectorHeight;
                x = symbolLocation.center.x + (Math.cos((symbolLocation.angle)) * (labelRadiusFromOrigin));
                y = symbolLocation.center.y + (Math.sin((symbolLocation.angle)) * (labelRadiusFromOrigin));

                drawPoints.push({ x: x, y: y });
                //var hipen = height / 5;
                //x += (x > symbolLocation.center.x) ? hipen : -hipen;
                //drawPoints.push({ x: x, y: y });
                if (series.marker.dataLabel.connectorLine.type == "bezier")
                    drawPoints = this.getBezierApproximation(drawPoints, 256, series);
                this.drawLineSegment(drawPoints, pointIndex, series)
            },
            /// <returns></returns>
            getBezierApproximation: function (controlPoints, outputSegmentCount, series) {
                var points = [];
                for (var i = 0; i <= outputSegmentCount; i++) {
                    var t = i / outputSegmentCount;
                    points.push(this.GetBezierPoint(t, controlPoints, 0, controlPoints.length, series));
                }
                return points;
            },
            drawLineSegment: function (drawpoints, pointIndex, series) {
                var vectorPoints = [];
                for (var i = 0; i < drawpoints.length; i++) {
                    vectorPoints.push(this.chartObj.vector.vector3D(drawpoints[i].x, drawpoints[i].y, drawpoints[i].z ? drawpoints[i].z : 0));
                }
                var seriesIndex = $.inArray(series, this.chartObj.model._visibleSeries);
                var color = (this.chartObj.model.AreaType == "none") ? this.chartObj.model.pointColors[pointIndex] : this.chartObj.model.seriesColors[seriesIndex];
                var stroke = (series.marker.dataLabel.connectorLine.stroke) ? series.marker.dataLabel.connectorLine.stroke : color;
                var line = { width: series.marker.dataLabel.connectorLine.width, stroke: stroke, child: this.chartObj.chart3D, tag: 'polyline', id: this.chartObj.svgObject.id + "_" + seriesIndex + "_" + pointIndex };

                this.chartObj.graphics.addVisual(this.chartObj.polygon.createPolyline(vectorPoints, line));
            }

        },

        ej.ejCircularSeries = {

            draw: function (series, sender, type) {
                var MARGINS_RATIO = 0.03,

                    seriesLength = sender.chartObj.model._visibleSeries.length,
                    seriesIndex = $.inArray(series, sender.chartObj.model._visibleSeries);
                sender._calculateVisiblePoints(series);
                sender.calculateSize(sender, series);

                if (type == "pie") {
                    series._size = series.pieCoefficient;
                    series._coefficient = seriesIndex == 0 ? 0 : series._size;
                }
                else {
                    series._size = series.doughnutSize;
                    series._coefficient = series.doughnutCoefficient;
                }
                if (sender.chartObj.model.circularRadius.length > 1) {
                    for (i = seriesIndex; i < sender.chartObj.model.circularRadius.length; i++) {
                        if (!ej.util.isNullOrUndefined(sender.chartObj.model.circularRadius[i])) {
                            sender.chartObj.model.circularRadius[seriesIndex] = sender.chartObj.model.circularRadius[i] * series._size;
                            break;
                        }
                    }
                }
                else
                    sender.chartObj.model.circularRadius[seriesIndex] = (((1 - MARGINS_RATIO) * Math.min(series.actualWidth / 2, series.actualHeight / 2)) * series._size);
                sender.chartObj.model.innerRadius[seriesIndex] = series._coefficient * sender.chartObj.model.circularRadius[seriesIndex];
                sender.createPolygons(series, sender);
            },
            doAnimation: function (series, sender) {
                var seriesRendering = this;
                series.count = 0;
                $.each(series.segments, function (pointIndex, point) {

                    var radius = point.radius;
                    var insideRadius = point.inSideRadius;

                    series.animate = true;
                    $(sender.chartObj.element).each(function () { point.radius = 0, point.inSideRadius = 0 }).animate(
                        { Radius: radius, InsideRadius: insideRadius },

                        {
                            duration: 1000, queue: false, step: function (now, fx) {


                                if (fx.prop.toString() === "Radius") {
                                    point.radius = now;
                                }
                                else {
                                    point.inSideRadius = now;
                                }


                                var poligons = sender.createPolygons(series, sender, true);

                                for (var ai = 0; ai < poligons.length; ai++) {
                                    for (var k = 0; k < poligons[ai].length; k++) {
                                        sender.chartObj.polygon.update(poligons[ai][k].VectorPoints, poligons[ai][k], sender)
                                    }
                                }

                            },
                            complete: function () {
                                sender.chartObj.model.AnimationComplete = true;
                                var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                                commonEventArgs.data = { series: series };
                                sender.chartObj._trigger("animationComplete", commonEventArgs);

                            }
                        });
                });
            }
        },

        ej.series3DTypes.doughnut = ej.ejCircularSeries;
    ej.series3DTypes.pie = ej.ejCircularSeries;



    ej.ej3DStackingColumn = {

        draw: function (series, sender, type, params) {
            var visiblePoints = sender._isVisiblePoints(series);
            this.createSegments(series, sender, params);
            for (var i = 0; i < visiblePoints.length; i++) {
                if (visiblePoints[i].visible) {
                    series._visiblePoints[i].plans = null;
                    ej.ej3DColumnSeries.update(series, series._visiblePoints[i], i, sender)
                }
            }
        },

        createSegments: function (series, sender, params) {
            var xValues = sender.chartObj._getXValues(series._visiblePoints);

            var median,
                cons = 0.2;
            if (xValues == null) return;

            var sbsInfo = sender.getSideBySideInfo(series, params);
            var depthInfo = sender._getSegmentDepth(series);
            median = sbsInfo.Delta / 2;
            var visiblePoints = sender._isVisiblePoints(series);
            for (var i = 0; i < visiblePoints.length; i++) {

                var x1 = xValues[i] + sbsInfo.Start;
                var x2 = xValues[i] + sbsInfo.End;
                var y2 = series.stackedValue.StartValues[i];
                var y1 = series.stackedValue.EndValues[i];

                ej.ej3DColumnSeries._setData(x1, y1, x2, y2, depthInfo.Start, depthInfo.End, sender, visiblePoints[i]);

                if (!series.marker.dataLabel.visible) continue;
                visiblePoints[i].symbolLocation = { x: 0, y: 0, z: 0 };
                switch (series.marker.dataLabel.textPosition) {
                    case "top":
                        visiblePoints[i].symbolLocation.x = x1 + median;
                        visiblePoints[i].symbolLocation.y = y1;
                        visiblePoints[i].symbolLocation.z = depthInfo.Start + (depthInfo.Delta / 2);
                        break;
                    case "bottom":
                        visiblePoints[i].symbolLocation.x = x1 + median;
                        visiblePoints[i].symbolLocation.y = y2 - cons;
                        visiblePoints[i].symbolLocation.z = depthInfo.Start + (depthInfo.End - depthInfo.Start) / 2;
                        break;
                    default:
                        visiblePoints[i].symbolLocation.x = x1 + median;
                        visiblePoints[i].symbolLocation.y = y1 + (y2 - y1) / 2;
                        visiblePoints[i].symbolLocation.z = depthInfo.Start;
                        break;
                }

            }

        },

        doAnimation: function (series, sender) {

            var seriesRender = this;

            $.each(series._visiblePoints, function (pointIndex, point) {

                var topValue = point.Top;
                var bottomValue = point.Bottom;

                $(point).each(function () { point.Top = 0, point.Bottom = 0 }).animate(
                    { Top: topValue, Bottom: bottomValue },

                    {
                        duration: 1200, queue: false, step: function (now, fx) {

                            if (fx.prop.toString() === "Top") {
                                point.Top = now;
                            }
                            if (fx.prop.toString() === "Bottom") {
                                point.Bottom = now;
                            }

                            ej.ej3DColumnSeries.update(series, point, pointIndex, sender);

                        },

                        complete: function () {

                            sender.chartObj.model.AnimationComplete = true;
                            var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                            commonEventArgs.data = { series: series };
                            sender.chartObj._trigger("animationComplete", commonEventArgs);

                        }

                    });

            });

        }



    },

        ej.series3DTypes.stackingcolumn = ej.ej3DStackingColumn;

    ej.series3DTypes.stackingbar = ej.ej3DStackingColumn;

    ej.series3DTypes.stackingbar100 = ej.ej3DStackingColumn;

    ej.series3DTypes.stackingcolumn100 = ej.ej3DStackingColumn;

    ej.ej3DColumnSeries = {
        draw: function (series, sender, type, params) {
            var visiblePoints = sender._isVisiblePoints(series);
            this.createSegments(series, sender, params);
            for (var i = 0; i < visiblePoints.length; i++) {
                if (visiblePoints[i].visible) {
                    series._visiblePoints[i].plans = null;
                    this.update(series, series._visiblePoints[i], i, sender);
                }
            }
        },

        update: function (series, point, pointIndex, sender) {
            var plans;
            var valueType = series.xAxis._valueType.toLowerCase();
            var seriesIndex = $.inArray(series, sender.chartObj.model._visibleSeries);
            var xBase = (valueType == "logarithmic") ? null : 1;
            var xIsLogarithmic = (valueType == "logarithmic") ? true : false;
            var left = xIsLogarithmic ? Math.log(point.Left, xBase) : point.Left;
            var right = xIsLogarithmic ? Math.log(point.Right, xBase) : point.Right;
            var bottom = series.yAxis.visibleRange.min;
            var top = series.yAxis.visibleRange.max;
            var xStart = series.xAxis.visibleRange.min;
            var xEnd = series.xAxis.visibleRange.max;
            if ((!(left >= xStart) || !(left <= xEnd)) && (!(right >= xStart) || !(right <= xEnd))) return;

            var topValue;
            if (point.Top < 0)
                topValue = point.Top > bottom ? point.Top : bottom;
            else
                topValue = (series.yAxis.valueType && series.yAxis.valueType.toLowerCase() == "logarithmic") ? point.Top : point.Top < top ? point.Top : top;
            var tlpoint = ej.EjSvgRender.utils.Transform3DToVisible(series, point.Left > xStart ? point.Left : xStart, topValue, sender.chartObj);
            var rbpoint = ej.EjSvgRender.utils.Transform3DToVisible(series, xEnd > point.Right ? point.Right : xEnd, bottom > point.Bottom ? bottom : point.Bottom, sender.chartObj);

            var tlfVector = sender.chartObj.vector.vector3D(Math.min(tlpoint.X, rbpoint.X), Math.min(tlpoint.Y, rbpoint.Y), point.StartDepth);
            var brbVector = sender.chartObj.vector.vector3D(Math.max(tlpoint.X, rbpoint.X), Math.max(tlpoint.Y, rbpoint.Y), point.EndDepth);

            var styleOptions = sender.chartObj.setStyle(sender, series, seriesIndex, pointIndex);
            if (styleOptions.interior.indexOf("url") >= 0)
                styleOptions.interior = sender.chartObj.model.seriesColors[seriesIndex][0].color;
            var name = "Region" + "_Series_" + seriesIndex + "_Point_" + pointIndex
            if (series.columnFacet == "cylinder")

                sender.chartObj.polygon.createCylinder(tlfVector, brbVector, this, pointIndex, series.type,
                    styleOptions.borderColor, styleOptions.interior, styleOptions.borderWidth, styleOptions.opacity, sender.chartObj.model.requireInvertedAxes, name, sender.chartObj.chart3D);
            else if (series.columnFacet == "rectangle")
                sender.chartObj.polygon.createBox(tlfVector, brbVector, this, pointIndex, series.type,
                    styleOptions.borderColor, styleOptions.interior, styleOptions.borderWidth, styleOptions.opacity, sender.chartObj.model.requireInvertedAxes, name, sender.chartObj.chart3D);

        },

        _setData: function () {
            var values = arguments,
                point = arguments[arguments.length - 1],
                sender = arguments[arguments.length - 2];

            point.Left = values[0];
            point.Bottom = values[3];
            point.Top = values[1];
            point.Right = values[2];
            point.StartDepth = values[4];
            point.EndDepth = values[5];
            point.XRange = sender.getDoubleRange(point.Left, point.Right);
            if (!isNaN(point.Top) && !isNaN(point.Bottom))
                point.YRange = sender.getDoubleRange(point.Top, point.Bottom);
        },

        createSegments: function (series, sender, params) {
            var xValues = sender.chartObj._getXValues(series._visiblePoints),
                YValues = sender.chartObj._getYValues(series._visiblePoints);
            if (xValues == null) return;

            var sbsInfo = sender.getSideBySideInfo(series, params),
                depthInfo = sender._getSegmentDepth(series),
                crossValue = sender.chartObj._getXCrossValue(series, series.xAxis, params),
                median = sbsInfo.Delta / 2,
                visiblePoints = series._visiblePoints,
                cons = 0.2, XData, YData;
            for (var i = 0; i < visiblePoints.length; i++) {
                var x1 = xValues[i] + sbsInfo.Start,
                    x2 = xValues[i] + sbsInfo.End,
                    y1 = YValues[i],
                    y2 = crossValue;

                this._setData(x1, y1, x2, y2, depthInfo.Start, depthInfo.End, sender, visiblePoints[i]);

                XData = xValues[i];
                YData = YValues[i];
                //Item = ActualData[i];

                if (!series.marker.dataLabel.visible) continue;
                visiblePoints[i].symbolLocation = { x: 0, y: 0, z: 0 };
                switch (series.marker.dataLabel.textPosition) {
                    case "top":
                        visiblePoints[i].symbolLocation.x = x1 + median;
                        visiblePoints[i].symbolLocation.y = y1;
                        visiblePoints[i].symbolLocation.z = depthInfo.Start;
                        break;
                    case "bottom":
                        visiblePoints[i].symbolLocation.x = x1 + median;
                        visiblePoints[i].symbolLocation.y = y2 - cons;
                        visiblePoints[i].symbolLocation.z = depthInfo.Start + (depthInfo.End - depthInfo.Start) / 2;
                        break;
                    default:
                        visiblePoints[i].symbolLocation.x = x1 + median;
                        visiblePoints[i].symbolLocation.y = Math.abs(y2 - y1) / 2;
                        visiblePoints[i].symbolLocation.z = depthInfo.Start;
                        break;
                }

            }


        },

        doAnimation: function (series, sender) {

            var seriesRender = this;

            $.each(series._visiblePoints, function (pointIndex, point) {

                var topValue = point.Top;
                $(point).each(function () { point.Top = 0 }).animate(
                    { Top: topValue },

                    {
                        duration: 1200, queue: false, step: function (now, fx) {

                            if (fx.prop.toString() === "Top") {
                                point.Top = now;
                            }

                            seriesRender.update(series, point, pointIndex, sender);

                        },

                        complete: function () {
                            sender.chartObj.model.AnimationComplete = true;
                            var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                            commonEventArgs.data = { series: series };
                            sender.chartObj._trigger("animationComplete", commonEventArgs);

                        }

                    });

            })

        }

    }

    ej.series3DTypes.column = ej.ej3DColumnSeries;

    //bar series
    ej.series3DTypes.bar = ej.ej3DColumnSeries;

    ej.Ej3DChart.prototype = {
        renderSeries: function (sender, series, params) {

            var series;
            ej.Ej3DSeriesRender.prototype.chartObj = sender;

            $.extend(ej.Ej3DSeriesRender.prototype, ej.EjSeriesRender.prototype);

            var seriesRendering = new ej.Ej3DSeriesRender();
            var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonEventArgs.data = { "series": series };
            seriesRendering.chartObj._trigger("seriesRendering", commonEventArgs);
            var type = series.type.toLowerCase();
            var options = ej.series3DTypes[type];
            if (ej.util.isNullOrUndefined(options)) return;
            options.draw(series, seriesRendering, type, params);
            if (series.marker.dataLabel.visible) {
                $.each(series._visiblePoints, function (pointIndex, point) {
                    point.marker = $.extend(true, {}, series.marker, point.marker);
                    if (point.visible && (ej.util.isNullOrUndefined(point.marker) || (point.marker.dataLabel && point.marker.dataLabel.visible)))
                        seriesRendering.draw3DDataLabel(series, pointIndex, point, sender);
                });
            }




        },
        update3DWall: function (sender, params) {
            if (sender.model.AreaType == "cartesianaxes") {
                $.extend(ej.Ej3DRender.prototype, this);
                this.updateBackWall(sender);
                for (var i = 0; i < sender.model._axes.length; i++) {
                    var axis = sender.model._axes[i],
                        opposedPosition = axis._opposed;
                    if (axis.orientation.toLowerCase() == "vertical") {
                        if (!opposedPosition)
                            this.updateLeftWall(sender, axis, params);
                        else
                            this.updateRightWall(sender, axis, params);
                    }
                    else {
                        if (!opposedPosition)
                            this.updateBottomWall(sender, axis, params);
                        else
                            this.updateTopWall(sender, axis, params);
                    }
                }
            }
        },

        updateTopWall: function (sender, axis, params) {

            var offset = 0;
            var areaBounds = sender.model.m_AreaBounds, y = params.axes[axis.name]._validCross ? axis.y : areaBounds.Y;
            if (sender.model.wallSize < y)
                offset = y - sender.model.wallSize;
            else
                offset = -(sender.model.wallSize - y);
            var tlfVector = sender.vector.vector3D(areaBounds.X + areaBounds.Width, -sender.model.depth, y - 0.1);
            var brbVector = sender.vector.vector3D(areaBounds.X, - 0.1, offset);
            topSideWallPlans = sender.polygon.createBox(tlfVector, brbVector, this, 0, "Graphics3D", "#e2e1e1", "#e2e1e1", 0, 0.15, false, "TopWallBrush", sender.chart3D);

            for (var i = 0; i < topSideWallPlans.length; i++)
                sender.polygon.transform(sender.matrixobj.tilt((parseFloat)(Math.PI / 2)), topSideWallPlans[i]);


        },

        updateRightWall: function (sender, axis, params) {
            var x = params.axes[axis.name]._validCross ? axis.x : sender.model.m_AreaBounds.X + sender.model.m_AreaBounds.Width;
            var rightRect = { left: -(sender.model.depth), top: sender.model.m_AreaBounds.Y, bottom: sender.model.m_AreaBounds.Height + sender.model.m_AreaBounds.Y, right: 0 };
            var tlfVector = sender.vector.vector3D(rightRect.left, rightRect.top, x + 1.5);
            var brbVector = sender.vector.vector3D(rightRect.right, rightRect.bottom, x + sender.model.wallSize);
            rightSideWallPlans = sender.polygon.createBox(tlfVector, brbVector, sender, 0, "Graphics3D", "#e2e1e1", "#e2e1e1", 0, 0.15, false, "RightWallBrush", sender.chart3D);
            for (var i = 0; i < rightSideWallPlans.length; i++)
                sender.polygon.transform(sender.matrixobj.turn((parseFloat)(-Math.PI / 2)), rightSideWallPlans[i]);
        },
        updateBackWall: function (sender) {
            var areaBounds = sender.model.m_AreaBounds;
            var tlfVector = sender.vector.vector3D(areaBounds.X, areaBounds.Y, sender.model.depth == 0 ? 1.5 : sender.model.depth + sender.model.wallSize);
            var brbVector = sender.vector.vector3D((areaBounds.X + areaBounds.Width), areaBounds.Y + areaBounds.Height, sender.model.depth == 0 ? 1.5 : sender.model.depth);

            sender.polygon.createBox(tlfVector, brbVector, sender, 0, "Graphics3D", "#e2e1e1", "#e2e1e1", 0, 0.15, false, "BackWallBrush", sender.chart3D);
        },
        updateLeftWall: function (sender, axis, params) {
            var leftRect = { left: -(sender.model.depth), top: sender.model.m_AreaBounds.Y, bottom: sender.model.m_AreaBounds.Height + sender.model.m_AreaBounds.Y, right: 0 },
                offset = params.axes[axis.name]._validCross ? axis.x : sender.model.m_AreaBounds.X;
            var tlfVector = sender.vector.vector3D(leftRect.left, leftRect.top, offset - 0.1);
            var brbVector = sender.vector.vector3D(leftRect.right, leftRect.bottom, offset - sender.model.wallSize);

            var leftSideWallPlans = sender.polygon.createBox(tlfVector, brbVector, this, 0, "Graphics3D", "#e2e1e1", "#e2e1e1", 0, 0.15, false, "LeftWallBrush", sender.chart3D);
            for (var i = 0; i < leftSideWallPlans.length; i++)
                sender.polygon.transform(sender.matrixobj.turn((parseFloat)(-Math.PI / 2)), leftSideWallPlans[i]);
        },
        updateBottomWall: function (sender, axis, params) {
            var areaBounds = sender.model.m_AreaBounds;
            var y = params.axes[axis.name]._validCross ? axis.y : areaBounds.Y + areaBounds.Height;
            var tlfVector = sender.vector.vector3D((areaBounds.X + areaBounds.Width), -(sender.model.depth), sender.model.wallSize + y);
            var brbVector = sender.vector.vector3D(areaBounds.X, -0.1, y + 1);

            var bottomSideWallPlans = sender.polygon.createBox(brbVector, tlfVector, this, 0, "Graphics3D", "#D3D3D3", "#D3D3D3", 0, 0.15, false, "BottomWallBrush", sender.chart3D);
            for (var i = 0; i < bottomSideWallPlans.length; i++)
                sender.polygon.transform(sender.matrixobj.tilt((parseFloat)(Math.PI / 2)), bottomSideWallPlans[i]);
        }
    }

})(jQuery)