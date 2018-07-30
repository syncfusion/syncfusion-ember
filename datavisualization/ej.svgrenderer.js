ej.EjSvgRender = function (element) {

    this.svgLink = "http://www.w3.org/2000/svg";
    this.svgObj = document.createElementNS(this.svgLink, "svg");
    this._rootId = jQuery(element).attr("id");
    var id = this._rootId + '_svg';
    if ($(document).find("#" + id).length > 0) {
        var count = 0
        do {
            count++;
        } while ($(document).find("#" + this._rootId + '_svg' + count).length > 0);
        id = this._rootId + '_svg' + count;
    }
    this.svgObj.setAttribute('id', id);

};
(function ($) {
    ej.EjSvgRender.prototype = {
        drawPath: function (options, element) {
            if ($("#" + options.id).length > 0) {
                $("#" + options.id).attr(options);
            }
            else {
                var path = document.createElementNS(this.svgLink, "path");
                $(path).attr(options).appendTo(element);
            }

        },
        createLegendSvg: function (element) {
            this.svgLink = "http://www.w3.org/2000/svg";
            this.legendsvgObj = document.createElementNS(this.svgLink, "svg");
            this._rootId = jQuery(element).attr("id");
            this.legendsvgObj.setAttribute('id', "legend_" + this._rootId + '_svg');
            return this.legendsvgObj;
        },
        drawPolyline: function (options, element) {
            if ($("#" + options.id).length > 0) {
                $("#" + options.id).attr(options);
            }
            else {
                var polyline = document.createElementNS(this.svgLink, "polyline");
                $(polyline).attr(options).appendTo(element);
            }

        },

        drawLine: function (options, element) {
            if ($("#" + options.id).length > 0) {
                $("#" + options.id).attr(options);
            }
            else {
                var path = document.createElementNS(this.svgLink, "line");
                $(path).attr(options);
                $(path).appendTo(element);
            }
        },
        drawPolygon: function (options, element) {
            if ($("#" + options.id).length > 0) {
                $("#" + options.id).attr(options);
            }
            else {
                var polygon = document.createElementNS(this.svgLink, "polygon");
                $(polygon).attr(options);
                $(polygon).appendTo(element);
            }
        },
        drawCircle: function (options, element) {
            if ($("#" + options.id).length > 0) {
                $("#" + options.id).attr(options);
            }
            else {
                var circle = document.createElementNS(this.svgLink, "circle");
                $(circle).attr(options).appendTo(element);
            }
        },
        drawEllipse: function (options, element) {
            if ($("#" + options.id).length > 0) {
                $("#" + options.id).attr(options);
            }
            else {
                var ellipse = document.createElementNS(this.svgLink, "ellipse");
                $(ellipse).attr(options).appendTo(element);
            }
        },

        drawRect: function (options, element) {
            if ($("#" + options.id).length > 0) {
                $("#" + options.id).attr(options);
            }
            else {
                var rect = document.createElementNS(this.svgLink, "rect");
                $(rect).attr(options).appendTo(element);
            }
        },
        drawCylinder: function (options, element, seriesOption) {
            if ($("#" + options.id).length > 0) {
                $("#" + options.id).attr(options);
            }
            else {
                var x = options.x, y = options.y, id = options.id;
                var gradientColor = options.fill;
                var fillColor = gradientColor;
                var format = this.checkColorFormat(gradientColor);
                if (!format)
                    gradientColor = ej.datavisualization.Chart.prototype.colorNameToHex(gradientColor);
                var AEx, AEy, LX, LY, X, Y, X2, Y2, i = 2, X1, Y1, GX = 0, GY = 0, direction;
                var obj = { svgRenderer: this };
                if (seriesOption.isColumn == true) {
                    var rx = options.width / 2;
                    var length = options.height;
                    var ry = rx / 4;
                    X = X1 = x;
                    Y = ry < y ? y - ry : seriesOption.stacking ? y + ry : (y - ry);
                    Y1 = Y;
                    AEx = 2 * rx;
                    AEy = 0;
                    LX = 0;
                    LY = ry < y ? length : (length < 2 * ry ? length : seriesOption.stacking ? length - (2 * ry) : length);
                    X2 = X;
                    Y2 = ry < y ? Y + length : (length < Y ? length + Y : seriesOption.stacking ? length + (y - ry) : length + Y);
                    GX = 100;
                    if (seriesOption.stacking = true) {
                        if (!seriesOption.isLastSeries) {
                            Y = Y1 = y + ry;
                            LY = length < rx / 2 ? length : length - rx / 2;
                        }
                    }
                }
                else {
                    var ry = options.height / 2;
                    var length = options.width;
                    var rx = ry / 4;
                    Y = Y1 = y;
                    X = X1 = (x + rx);
                    AEx = 0;
                    AEy = 2 * ry;
                    LX = length;
                    LY = 0;
                    X2 = X + length;
                    Y2 = Y;
                    GY = 100;
                    if (seriesOption.stacking = true) {
                        if (!seriesOption.isLastSeries) {
                            X2 = (X + length - rx * 2);
                            LX = length - rx * 2;
                        }
                    }
                }
                delete options.x;
                delete options.y;
                delete options.width;
                delete options.height;
                delete options.isColumn;
                //options.stroke = "black";
                while (i--) {
                    direction = "M" + X.toString() + "," + Y.toString();
                    direction += "a" + rx.toString() + "," + ry.toString() + " 0 1,0 " + AEx.toString() + "," + AEy.toString();
                    direction += "a" + rx.toString() + "," + ry.toString() + " 0 1,0 " + (-1 * AEx).toString() + "," + (-1 * AEy).toString();
                    options.d = direction;
                    options.id = id + "_" + "Region_" + i;
                    options.fill = ej.Ej3DRender.prototype.polygon3D.prototype.applyZLight(gradientColor, obj);
                    this.drawPath(options, element);
                    X = X2;
                    Y = Y2;
                }
                direction = "M" + X1.toString() + "," + Y1.toString();
                direction += "a" + rx.toString() + "," + ry.toString() + " 0 1,0 " + AEx.toString() + "," + AEy.toString();
                direction += "l" + LX.toString() + " " + LY.toString();
                direction += "a" + rx.toString() + "," + ry.toString() + " 0 1,1 " + (-1 * AEx).toString() + "," + (-1 * AEy).toString() + " z";

                options.d = direction;
                options.id = id + "_" + "Region_2";
                if (fillColor.indexOf("url") == -1) {
                    var gradientId = id;
                    if ($("#" + gradientId).length == 0) {

                        var optiong = { 'id': gradientId, x1: "0%", y1: "0%", x2: GX.toString() + "%", y2: GY.toString() + "%" };
                        var gradientele = [];
                        gradientele[0] = { colorStop: "0%", color: gradientColor };
                        gradientele[1] = { colorStop: "30%", color: ej.Ej3DRender.prototype.polygon3D.prototype.applyXLight(gradientColor, obj) };
                        gradientele[2] = { colorStop: "70%", color: ej.Ej3DRender.prototype.polygon3D.prototype.applyXLight(gradientColor, obj) };
                        gradientele[3] = { colorStop: "100%", color: gradientColor };
                        this.drawGradient(optiong, gradientele, element);
                    }
                    options.fill = "url(#" + gradientId + ")";
                }
                this.drawPath(options, element);

            }
        },

        createGradientElement: function (name, colors, x1, y1, x2, y2, element) {
            var colorName;
            if (Object.prototype.toString.call(colors) == '[object Array]') {
                var options = {
                    'id': this.svgObj.id + '_' + name + 'Gradient',
                    'x1': x1 + '%',
                    'y1': y1 + '%',
                    'x2': x2 + '%',
                    'y2': y2 + '%'
                };
                var cName = '#' + this.svgObj.id + '_' + name + 'Gradient';
                this.drawGradient(options, colors, element);
                colorName = 'url(#' + this.svgObj.id + '_' + name + 'Gradient)';
            }
            else {
                colorName = colors;
            }
            return colorName;
        },

        drawGradient: function (options, gradientEle, element) {

            var defs = this.createDefs();
            var linerGradient = document.createElementNS(this.svgLink, "linearGradient");

            $(linerGradient).attr(options);
            for (var i = 0; i < gradientEle.length; i++) {
                var stop = document.createElementNS(this.svgLink, "stop");
                $(stop).attr({
                    'offset': gradientEle[i].colorStop,
                    'stop-color': gradientEle[i].color,
                    'stop-opacity': 1
                });
                $(stop).appendTo(linerGradient);
            }

            $(linerGradient).appendTo(defs);
            $(defs).appendTo(element);
        },

        drawText: function (options, label, groupEle, font) {

            if ($("#" + options.id).length > 0)
                this._textAttrReplace(options, label, font);
            else {
                var text = document.createElementNS(this.svgLink, "text");
                var $text = $(text);


                if (jQuery.type(label) == "array") {
                    var j = 0;
                    $text.attr(options);
                    for (var i = 0; i < label.length; i++) {
                        var textspan = document.createElementNS(this.svgLink, "tspan");
                        textspan.textContent = label[i];
                        $(textspan).attr({ "x": options.x, "dy": j });
                        $(textspan).appendTo(text);
                        font = this.enable3D ? font.font : font;
                        var bounds = ej.EjSvgRender.utils._measureText(label[i], null, font);
                        j = options.isTrackball ? bounds.height + 2 : bounds.height;
                    }
                } else {
                    text.textContent = label;
                    $text.attr(options);
                }
                $text.appendTo(groupEle);


            }
        },
        //text element attributes values are replaced 
        _textAttrReplace: function (options, label, font) {
            $("#" + options.id).attr(options);

            if (jQuery.type(label) == "array") {
                var elements = $("#" + options.id).children("tspan");
                var j = 0;
                if (elements.length > 0 && elements.length == label.length) {
                    for (var i = 0; i < elements.length; i++) {
                        var element = elements[i];
                        $(element).attr({ "x": options.x, "dy": j });
                        element.textContent = label[i];
                        var bounds = ej.EjSvgRender.utils._measureText(label[i], null, font);
                        j = bounds.height + 2;
                    }
                }
                else {
                    $("#" + options.id).remove();
                    this.drawText(options, label, this.gTransToolEle, font);

                }
            } else {
                $("#" + options.id).text(label);
            }

        },

        drawImage: function (options, element) {

            var img = document.createElementNS(this.svgLink, 'image');
            img.setAttributeNS(null, 'height', options.height);
            img.setAttributeNS(null, 'width', options.width);
            img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', options.href);
            img.setAttributeNS(null, 'x', options.x);
            img.setAttributeNS(null, 'y', options.y);
            img.setAttributeNS(null, 'id', options.id);
            img.setAttributeNS(null, 'visibility', options.visibility);
            if (!ej.util.isNullOrUndefined(options.clippath) || !ej.util.isNullOrUndefined(options.preserveAspectRatio)) {
                img.setAttributeNS(null, 'clip-path', options.clippath);
                img.setAttributeNS(null, "preserveAspectRatio", options.preserveAspectRatio);
            }
            $(img).appendTo(element);

        },

        createDefs: function () {
            var defs = document.createElementNS(this.svgLink, "defs");
            return defs;
        },

        createClipPath: function (options) {
            var clipPath = document.createElementNS(this.svgLink, "clipPath");
            $(clipPath).attr(options);
            return clipPath;
        },
        createForeignObject: function (options) {
            var object = document.createElementNS(this.svgLink, "foreignObject");
            $(object).attr(options);
            return object;
        },
        createGroup: function (options) {
            var group = document.createElementNS(this.svgLink, "g");
            $(group).attr(options);
            return group;
        },
        createPattern: function (options, element) {
            var pattern = document.createElementNS(this.svgLink, element);
            for (var name in options) {
                if (options.hasOwnProperty(name)) {
                    pattern.setAttribute(name, options[name]);
                }
            }
            return pattern;
        },
        createText: function (options, label) {
            var text = document.createElementNS(this.svgLink, "text");
            $(text).attr(options);
            if (!ej.util.isNullOrUndefined(label))
                text.textContent = label;
            return text;
        },

        createPath: function (options) {
            var path = document.createElementNS(this.svgLink, "path");
            $(path).attr(options);
            return path;
        },

        createCircle: function (options) {
            var circle = document.createElementNS(this.svgLink, "circle");
            $(circle).attr(options);
            return circle;
        },

        createLine: function (options) {
            var line = document.createElementNS(this.svgLink, "line");
            $(line).attr(options);
            return line;
        },


        _getAttrVal: function (ele, val, option) {
            var value = $(ele).attr(val);
            if (value != null)
                return value;
            else
                return option;
        },


        hexFromRGB: function (color) {
            var r = color.R;
            var g = color.G;
            var b = color.B;
            if (color.A) {
                var returncolor = "rgba(" + r.toString() + "," + g.toString() + "," + b.toString() + "," + color.A + ")";
                return returncolor;
            }
            else {
                var hex = [r.toString(16), g.toString(16), b.toString(16)];
                $.each(hex, function (nr, val) { if (val.length === 1) { hex[nr] = "0" + val; } });
                return "#" + (hex.join("").toUpperCase());
            }
        },

        checkColorFormat: function (color) {
            return /(rgba?\((?:\d{1,3}[,\)]){3}(?:\d+\.\d+\))?)|(^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$)/gmi.test(color);
        },

        hexToRGB: function (hex) {
            var rgbRegex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/.test(hex);
            var result;
            if (rgbRegex == true) {
                result = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/.exec(hex);
                return result ? {
                    R: parseInt(result[1]),
                    G: parseInt(result[2]),
                    B: parseInt(result[3]),
                    A: result[4],
                } : null;
            }
            else {
                result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    R: parseInt(result[1], 16),
                    G: parseInt(result[2], 16),
                    B: parseInt(result[3], 16)
                } : null;
            }
        },


        createDelegate: function (context, handler) {
            return function (e) {
                handler.apply(context, [e, this]);
            };
        },

        drawClipPath: function (options, element) {
            //To avoid creating and appending the same element more than once
            if ($(element).find('#' + options.id).length > 0) {
                $(element).find('#' + options.id).attr(options);
            }
            else {
                var defs = this.createDefs();
                var clipPath = this.createClipPath({ 'id': options.id });
                this.drawRect(options, clipPath);
                this.append(clipPath, defs);
                this.append(defs, element);
            }
        },

        drawCircularClipPath: function (options, element) {
            var defs = this.createDefs();
            var clipPath = this.createClipPath({ 'id': options.id });
            this.drawCircle(options, clipPath);
            this.append(clipPath, defs);
            this.append(defs, element);
        },

        append: function (childEle, parentEle) {
            $(childEle).appendTo(parentEle);
        },
        _setAttr: function (element, attribute) {
            $(element).attr(attribute);
        }
    };

    ej.EjSvgRender.commonChartEventArgs = {
        cancel: false,
        data: null
    };
    ej.EjSvgRender.utils = {



        _decimalPlaces: function (num) {
            var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
            if (!match) { return 0; }
            return Math.max(
                0,
                // Number of digits right of decimal point.
                (match[1] ? match[1].length : 0)
                // Adjust for scientific notation.
                - (match[2] ? +match[2] : 0));
        },
        _getLabelContent: function (pos, axis, locale) {
            switch (axis._categoryValueType) {
                case 'number':
                    var customFormat = (ej.util.isNullOrUndefined(axis.labelFormat)) ? null : axis.labelFormat.match('{value}');
                    return (ej.util.isNullOrUndefined(axis.labelFormat)) ? axis.labels[Math.floor(pos)] : (customFormat != null) ? axis.labelFormat.replace('{value}', axis.labels[Math.floor(pos)]) : (ej.format(axis.labels[Math.floor(pos)], axis.labelFormat, locale));
                case 'date':
                    return (ej.format(new Date(axis.labels[Math.floor(pos)]), ((ej.util.isNullOrUndefined(axis.labelFormat)) ? "dd/MM/yyyy" : axis.labelFormat), locale));
                case 'string':
                    return axis.labels[Math.floor(pos)];
                default:
                    return "";
            }
        },

        //Calculation for label size in template
        _getSeriesTemplateSize: function (point, pointIndex, series, isLeft, sender) {
            var point;
            var pointIndex;
            var areaType = sender.model.AreaType;

            var chartContainer = sender._id;
            var seriesIndex = $.inArray(series, sender.model._visibleSeries);

            if ($('#template_group_' + chartContainer).length != 0)
                var templateContainer = $('#template_group_' + chartContainer);
            else
                templateContainer = $("<div></div>").attr('id', "template_group_" + chartContainer);

            templateContainer.css('position', 'relative').css('z-index', 1000);
            var cloneNode = $("#" + series.marker.dataLabel.template).clone();
            $(cloneNode).attr("id", series.marker.dataLabel.template + '_' + seriesIndex + '_' + pointIndex + '_' + chartContainer);
            var $cloneNode = $(cloneNode);
            $cloneNode.css("position", "absolute");

            point.count = 1;
            var data = { series: series, point: point };
            $cloneNode.html($cloneNode.html().parseTemplate(data));

            var display = (areaType == "cartesianaxes" || !series.enableAnimation || (series.type.toLowerCase() == "pyramid" || series.type.toLowerCase() == "funnel")) ? "block" : "none";
            $cloneNode.css("display", display).appendTo($(templateContainer));
            $(templateContainer).appendTo('#' + chartContainer);
            point.size = { height: $cloneNode.height(), width: $cloneNode.width() };

            if (isLeft) {
                if (ej.util.isNullOrUndefined(series.LeftLabelMaxHeight) || series.LeftLabelMaxHeight < point.size.height) {
                    series.LeftLabelMaxHeight = point.size.height;
                }
                if (ej.util.isNullOrUndefined(series.LeftLabelMaxWidth) || series.LeftLabelMaxWidth < point.size.width) {
                    series.LeftLabelMaxWidth = point.size.width;
                }
            }
            else {
                if (ej.util.isNullOrUndefined(series.RightLabelMaxHeight) || series.RightLabelMaxHeight < point.size.height) {
                    series.RightLabelMaxHeight = point.size.height;
                }
                if (ej.util.isNullOrUndefined(series.RightLabelMaxWidth) || series.RightLabelMaxWidth < point.size.width) {
                    series.RightLabelMaxWidth = point.size.width;
                }
            }

        },
        getMinPointsDelta: function (axis, chartObj, start) {
            var chart = chartObj;
            var m_minPointsDelta = Number.MAX_VALUE;
            $.each(chart.model._visibleSeries, function (index, series) {
                if (series.visibility.toLowerCase() == 'visible' && axis.name == series._xAxisName) {
                    var xValues = ej.DataManager(series.points, ej.Query().sortBy("xValue")).executeLocal();
                    if ((xValues.length == 1) && (!chart.currentSeries || chart.currentSeries._yAxisName.toLowerCase() == series._yAxisName.toLowerCase())) {
                        var minValue = ej.util.isNullOrUndefined(start) ? series.xAxis.visibleRange.min : start;
                        var delta = xValues[0].xValue - minValue;
                        if (delta != 0)
                            m_minPointsDelta = Math.min(m_minPointsDelta, delta);
                    }
                    else {
                        $.each(xValues, function (pointIndex, point) {
                            if (pointIndex > 0 && point.xValue) {
                                var deltaValue = point.xValue - xValues[pointIndex - 1].xValue;
                                if (deltaValue != 0) {
                                    m_minPointsDelta = Math.min(m_minPointsDelta, deltaValue);
                                }
                            }
                        });
                    }
                }
            });

            if (m_minPointsDelta == Number.MAX_VALUE) {
                m_minPointsDelta = 1;
            }
            return m_minPointsDelta;
        },
        //Calculation for label size
        _getSeriesMaxLabel: function (series) {
            var maxTxtDim = { width: 0, height: 0 };
            var width = $(this.svgObject).width();
            var labels = [];
            if (series.labels.length > 0) {
                for (var j = 0; j < series.labels.length; j++) {
                    var dim = this._measureText(series.visibleLabels[j], width, series.marker.dataLabel.font);
                    if (maxTxtDim.width < dim.width) {
                        maxTxtDim.width = dim.width;
                    }
                    if (maxTxtDim.height < dim.height) {
                        maxTxtDim.height = dim.height;
                    }
                }
                series.LabelMaxHeight = maxTxtDim.height;
                series.LabelMaxWidth = maxTxtDim.width;
            }
            else {
                labels.push(series.rightsidePoints);
                labels.push(series.leftsidePoints);

                for (var k = 0; k < labels.length; k++) {
                    for (var j = 0; j < labels[k].length; j++) {
                        var text = (labels[k][j].text) ? labels[k][j].text : labels[k][j].y;
                        var dim = this._measureText(text, width, series.marker.dataLabel.font);
                        if (maxTxtDim.width < dim.width) {
                            maxTxtDim.width = dim.width;
                        }
                        if (maxTxtDim.height < dim.height) {
                            maxTxtDim.height = dim.height;
                        }
                    }
                    if (k == 0) {
                        series.RightLabelMaxHeight = maxTxtDim.height;
                        series.RightLabelMaxWidth = maxTxtDim.width;
                    }
                    else {
                        series.LeftLabelMaxHeight = maxTxtDim.height;
                        series.LeftLabelMaxWidth = maxTxtDim.width;
                    }
                }
            }


        },
        // to get highest label from label collection or label with <br> tag
        _getHighestLabel: function (axis, sender, text, intersectAction) {
            var largestLabel, maxWidth = 0, labelCollection = [], label, width, w = 0;
            if (ej.isNullOrUndefined(text)) {

                var labels = axis.labels.length == 0 ? axis.visibleLabels : axis.labels;
                for (var l = 0; l < labels.length; l++) {
                    var currentLabel = axis.labels.length == 0 ? labels[l].Text : labels[l], w = 0;
                    if (currentLabel.indexOf('<br>') != -1)
                        labelCollection = currentLabel.split('<br>');
                    else
                        labelCollection.push(currentLabel);
                    for (var r = 0; r < labelCollection.length; r++) {
                        label = labelCollection[r];
                        width = this._measureText(label, $(sender.svgObject).width(), axis.font).width;
                        if (w < width) {
                            w = width;
                            largestLabel = label;
                        }
                    }
                    if (maxWidth < w) {
                        maxWidth = w;
                        labelText = largestLabel;
                    }
                }
            }
            else if (text && ((typeof text == "string" && text.indexOf('<br>') != -1) || typeof text == "object")) {
                var w = 0;
                labelCollection = typeof text == "object" ? text : text.split('<br>');
                for (var r = 0; r < labelCollection.length; r++) {
                    label = typeof labelCollection[r] == "object" ? labelCollection[r].Text : labelCollection[r];
                    width = this._measureText(label, sender, axis.font).width;
                    if (w < width) {
                        w = width;
                        largestLabel = label;
                    }
                    labelText = largestLabel;
                }
            }
            return labelText;
        },
        _getMaxLabelWidth: function (axis, sender) {
            this.chartObj = sender;
            var maxTxtDim = { width: 0, height: 0, maxHeight: 0, maxWidth: 0 };
            var rotateLabel = '';
            var currentRow = 1;
            var vmlrendering = sender.svgRenderer.vmlNamespace;
            var range = axis.visibleRange;
            var intersectAction = (axis.labelIntersectAction) ? axis.labelIntersectAction.toLowerCase() : "";
            var labelPlacement = axis.labelPlacement;
            var opposedPosition = axis.opposedPosition;
            var orientation = axis.orientation.toLowerCase();
            var isHorizontal = sender.model.requireInvertedAxes ? (orientation == 'vertical') : orientation == 'horizontal';
            var roundingPlaces = axis.roundingPlaces;
            var labelRotation = axis.labelRotation;
            var orientation = axis.orientation;
            var maxHeight = 0;
            var prevLabels = [];
            var visibleLabels = axis.visibleLabels;
            var visibleLabelsLength = visibleLabels.length;
            if (axis.visible) {
                for (var j = 0; j < visibleLabelsLength; j++) {
                    axis.visibleLabels[j].y = 0;
                    if (typeof axis.visibleLabels[j].Text == "string" && axis.visibleLabels[j].Text.indexOf('<br>') != -1 && axis.orientation == "vertical") {
                        textCollection = axis.visibleLabels[j].Text.split('<br>');
                        label = this._getHighestLabel(axis, $(this.svgObject).width(), textCollection);
                        var dim = this._measureText(label, $(this.svgObject).width(), axis.font, axis.labelRotation);
                    }
                    else
                        var dim = this._measureText(axis.visibleLabels[j].Text, $(this.svgObject).width(), axis.font, axis.labelRotation);
                    if (maxTxtDim.width < dim.width) {
                        maxTxtDim.width = dim.width;
                        rotateLabel = axis.visibleLabels[j].Text;
                    }
                    if (maxTxtDim.height < dim.height)
                        maxTxtDim.height = dim.height;
                }

                if (axis.enableTrim || (intersectAction == "trim" && axis.orientation != "vertical")) {   // for enable trim
                    var derivedGap = axis.maximumLabelWidth;
                    maxTxtDim.width = maxTxtDim.width > derivedGap ? derivedGap : maxTxtDim.width;
                }

                // initialize rows to 1
                maxTxtDim.rows = 1;
                maxTxtDim.maxWidth = maxTxtDim.width;
                maxTxtDim.maxHeight = maxTxtDim.height;

                if (!vmlrendering && (labelRotation || intersectAction)) {
                    var intersectRotation = 0;
                    if (intersectAction == 'rotate45')
                        intersectRotation = 45;
                    else if (intersectAction == 'rotate90')
                        intersectRotation = 90;
                    labelRotation = labelRotation != null || orientation == "vertical" ? labelRotation : intersectRotation;
                    axis.rotationValue = labelRotation;
                    if (labelRotation) {
                        rotateLabel = (!ej.isNullOrUndefined(rotateLabel)) ? rotateLabel : '';
                        var labeltextWidth = this._measureText(rotateLabel, $(this.svgObject).width(), axis.font, axis.labelRotation);
                        if ((axis.enableTrim || intersectAction == "trim") && labeltextWidth.width > derivedGap && rotateLabel != "") { // to find trimmed text
                            var t, textWidth, text = rotateLabel;
                            for (t = 1; t < text.toString().length; t++) {
                                text = text.toString().substring(0, t) + '... ';
                                textWidth = this._measureText(text, $(sender.svgObject).width(), axis.font);
                                if (textWidth.width >= derivedGap) {
                                    text = text.toString().substring(0, t - 1) + '... ';
                                    rotateLabel = text;
                                    break;
                                }
                            }
                        }
                        rotateLabel = (intersectAction || axis.enableTrim) && labelRotation ? typeof rotateLabel == "string" && rotateLabel.indexOf('<br>') != -1 ? this._getHighestLabel(axis, sender, null) : rotateLabel : this._getHighestLabel(axis, sender, null);
                        var maxSize = this.rotatedLabel(axis, sender, labelRotation, rotateLabel);
                        if (axis.labelIntersectAction && axis.labelIntersectAction.toLowerCase() == 'multiplerows')
                            maxHeight = maxTxtDim.height + maxSize.height;

                        maxTxtDim.height = axis.rowsCount && axis.rowsCount > 1 && labelRotation != 90 && axis.enableTrim ? (axis.rowsCount) * maxTxtDim.height : maxSize.height;
                        maxTxtDim.width = maxSize.width;
                    }
                }

                if (axis.labelIntersectAction) {
                    if (axis.rowsCount && (intersectAction == "none" || intersectAction == "trim" || intersectAction == "hide" || labelRotation == 0) &&
                        (intersectAction != "wrap" || axis.enableTrim) && (intersectAction != "wrapbyword" || axis.enableTrim) && (intersectAction != "multiplerows" || axis.enableTrim)) {
                        if (labelRotation == 0) {
                            maxTxtDim.rows = axis.rowsCount;
                            maxTxtDim.height = ((axis.rowsCount) * maxTxtDim.height);
                        }
                    }
                    else if (intersectAction == 'wrap' || intersectAction == 'wrapbyword') {
                        // pointX calculation to find the gap between the ticks
                        var pointX, tempInterval;
                        labelPlacement = (!(labelPlacement)) ? ej.datavisualization.Chart.LabelPlacement.BetweenTicks : labelPlacement;
                        if (labelPlacement.toLowerCase() == "betweenticks") {
                            tempInterval = 1 + (axis.labels.length > 1 ? -0.5 : 0);
                            tempInterval = (!(roundingPlaces)) ? parseFloat(tempInterval.toFixed((ej.EjSvgRender.utils._decimalPlaces(range.interval) == 0 ?
                                1 : ej.EjSvgRender.utils._decimalPlaces(range.interval)))) : parseFloat(tempInterval.toFixed(roundingPlaces));
                            pointX = Math.ceil(((tempInterval - range.min) / (range.max - range.min)) * (axis.length));
                        }
                        else {
                            pointX = Math.ceil(axis.length / visibleLabels.length);
                        }
                        if (axis.orientation == "horizontal") {
                            var rowCount = 0, elementSpacing = 20, highestWidth = 0, highestLabel;
                            var labels = axis.labels.length > 0 && axis.valueType != "datetimecategory" ? axis.labels : axis.visibleLabels;
                            var gap = axis.width ? axis.width / labels.length : ((axis.length - (sender.svgWidth - axis.length)) - elementSpacing) / labels.length;
                            axis.labelsCollection = [];
                            for (var l = 0; l < labels.length; l++) {
                                var count = 0, labelsCollection = [], labeltxtcoll = [];
                                var labeltxt = typeof labels[l] === 'object' ? labels[l].Text : labels[l];
                                if (typeof labeltxt == "string" && labeltxt.indexOf('<br>') != -1)
                                    labeltxtcoll = labeltxt.split('<br>');
                                else
                                    labeltxtcoll.push(labeltxt);
                                for (var c = 0; c < labeltxtcoll.length; c++) {
                                    var textcoll = ej.EjAxisRenderer.prototype.rowscalculation(labeltxtcoll[c], sender.model.m_AreaBounds, axis, gap, null);
                                    count = textcoll.length + count;
                                    for (var t = 0; t < textcoll.length; t++)
                                        labelsCollection.push(textcoll[t]);
                                }
                                if (labelRotation) {
                                    rotateLabel = this._getHighestLabel(axis, sender, labelsCollection);
                                    var width = this._measureText(rotateLabel, $(sender.svgObject).width(), axis.font).width;
                                    if (highestWidth < width) {
                                        highestWidth = width;
                                        highestLabel = rotateLabel;
                                    }
                                }
                                rowCount = Math.max(count, rowCount);
                                axis.labelsCollection[l] = labelsCollection;
                            }
                            var maxSize = this.rotatedLabel(axis, sender, labelRotation, highestLabel);
                        }
                        pointX = pointX < 0 ? Math.ceil(axis.length / visibleLabels.length) : pointX;
                        var row = Math.round(maxTxtDim.width / pointX);
                        maxTxtDim.rows = labelRotation ? row - currentRow : row + currentRow;
                        if (maxTxtDim.rows < 0)
                            maxTxtDim.rows = 0;
                        var row1 = rowCount && !labelRotation ? rowCount : maxTxtDim.rows;
                        if (rowCount > row && !labelRotation)
                            row1 = row1 - 1;
                        maxTxtDim.height = labelRotation ? (maxSize.height + (row1) * maxSize.height) : (maxTxtDim.height + (row1) * maxTxtDim.height);
                    }
                    else if (intersectAction == 'multiplerows') {
                        var spaceValue = sender._getLegendSpace();
                        var chartBorderWidth = sender.model.border.width;

                        var verticalaxis = sender.model._axes[1];
                        var realWidth = $(sender.svgObject).width() - sender.model.margin.left - sender.model.margin.right;
                        var axisTitleHeight = (axis.title.text == "" || !(axis.visible)) ? 0 : (this._measureText(axis.title.text, realWidth, axis.title.font).height + (2 * sender.model.elementSpacing));
                        var vAxesWidth = sender.model.elementSpacing + axisTitleHeight + axis.majorTickLines.size + axis.axisLine.width;
                        var yLabels = sender._getYValues(sender.model._visibleSeries[0].points);
                        var largest = Math.max.apply(Math, yLabels);
                        var vaxis = sender.model._axes[1];
                        var dim = this._measureText(largest, $(this.svgObject).width(), vaxis.font, vaxis.labelRotation);

                        var rightSpacing = spaceValue.rightLegendWidth + vAxesWidth + dim.width + sender.model.margin.right + sender.model.margin.left + (2 * chartBorderWidth);
                        var boundsWidth = $(sender.svgObject).width() - (rightSpacing);
                        if (isHorizontal) {
                            var addedMaxHeight = 0; var count1 = 0; var multipleRowsColl = []; var count2 = 0;
                            var row = 0; var highestLabel, highestWidth = 0;
                            //loop to get current label

                            for (j = 0; j < visibleLabels.length; j++) {
                                //declaration
                                var currentLabel = visibleLabels[j]; var currentLabelColl = [];
                                if (typeof currentLabel.Text == "string" && currentLabel.Text.indexOf('<br>') != -1)
                                    currentLabelColl = currentLabel.Text.split('<br>');
                                else
                                    currentLabelColl.push(currentLabel);
                                var collectionLength = currentLabelColl.length;
                                var isMultiRows = false;
                                maxHeight = Math.max(maxHeight, addedMaxHeight);
                                addedMaxHeight = currentLabel.y = maxTxtDim.height;
                                var text = this._measureText(currentLabel.Text, $(this.svgObject).width(), axis.font);
                                var textHeight = text.height;
                                var currentPoint = Math.abs(Math.floor(((currentLabel.Value - range.min) / (range.delta)) * (boundsWidth)));
                                if (multipleRowsColl.length > 0) {
                                    var previousLabels = multipleRowsColl;
                                    var flag1 = true;
                                    for (var k = 0; k < previousLabels.length && flag1; k++) {
                                        var count = 0; var labelCount = 0;
                                        var prevLabel = previousLabels[k];
                                        for (var l = 0; prevLabel && l < prevLabel.length; l++) {
                                            for (var c = 0; c < collectionLength; c++) {
                                                var temp = 0;
                                                var textWidth = ej.EjSvgRender.utils._measureText(collectionLength == 1 ? currentLabelColl[c].Text : currentLabelColl[c], $(this.svgObject).width(), axis.font).width;
                                                var textHeight = ej.EjSvgRender.utils._measureText(currentLabelColl[c], $(this.svgObject).width(), axis.font).height;
                                                var preLabel = l == prevLabel.length ? prevLabel[l - 1] : prevLabel[l];
                                                var prePoint = Math.abs(Math.floor(((preLabel.Value - range.min) / (range.delta)) * (boundsWidth)));
                                                var preTextWidth = ej.EjSvgRender.utils._measureText(preLabel.Text, $(this.svgObject).width(), axis.font).width;
                                                textWidth = textWidth / 2;
                                                var value = prePoint + ((axis.isInversed) ? -preTextWidth / 2 : preTextWidth / 2);
                                                if (value >= currentPoint - textWidth) {
                                                    addedMaxHeight = currentLabel.y + textHeight;
                                                    currentLabel.y += textHeight;
                                                    count++;
                                                    if (k + 1 == previousLabels.length)
                                                        flag1 = false;

                                                }
                                                else {
                                                    if (l + 1 == prevLabel.length) {
                                                        if (c == collectionLength - 1) flag1 = false;
                                                        else {
                                                            flag1 = true;
                                                        }
                                                        break;
                                                    }
                                                }

                                            }
                                        }
                                    }
                                }
                                currentLabel.y = addedMaxHeight;
                                row = (addedMaxHeight / textHeight) - 1;
                                if (multipleRowsColl[row] == undefined)
                                    multipleRowsColl[row] = [];
                                if (collectionLength == 1) multipleRowsColl[row].push(currentLabel);
                                else {
                                    for (var c = 0; c < collectionLength; c++) {
                                        if (multipleRowsColl[row] == undefined)
                                            multipleRowsColl[row] = [];
                                        multipleRowsColl[row].push({
                                            Text: currentLabelColl[c],
                                            Value: currentLabel.Value
                                        });
                                        if (c != collectionLength - 1) {
                                            row = row + 1;
                                            addedMaxHeight = currentLabel.y + textHeight;
                                        }
                                    }
                                }

                            }

                            maxHeight = (multipleRowsColl.length * textHeight);
                            maxTxtDim.height = maxTxtDim.height > maxHeight ? maxTxtDim.height : maxHeight;
                            //calculating rows
                            if (opposedPosition)
                                maxTxtDim.rows = Math.round((maxHeight + textHeight) / textHeight);
                            else
                                maxTxtDim.rows = Math.round(maxHeight / textHeight);
                            maxTxtDim.rows = labelRotation ? maxTxtDim.rows - 1 : maxTxtDim.rows;
                            if (maxTxtDim.rows < 1) maxTxtDim.rows = 1;
                        }
                        if (!isHorizontal) {
                            var addedMaxWidth = 0;
                            //loop to get current label
                            for (j = 0; j < axis.visibleLabels.length; j++) {
                                currentLabel = axis.visibleLabels[j];
                                text = this._measureText(currentLabel.Text, $(this.svgObject).width(), axis.font);
                                textWidth = text.width;
                                textHeight = text.height;
                                currentPoint = Math.abs(Math.floor(((currentLabel.Value - axis.visibleRange.min) / (axis.visibleRange.delta)) * (axis.length)));
                                for (var i = 0; i < j; i++) {
                                    // loop to get previous labels
                                    prevLabel = axis.visibleLabels[i];
                                    prevPoint = Math.abs(Math.floor(((prevLabel.Value - axis.visibleRange.min) / (axis.visibleRange.delta)) * (axis.length)));
                                    var prevTextHeight = this._measureText(prevLabel.Text, $(this.svgObject).width(), axis.font).height;
                                    value = prevPoint + prevTextHeight / 2;
                                    if (value > currentPoint - textHeight / 2 && axis.visibleLabels[i].y == currentLabel.y) {
                                        addedMaxWidth = currentLabel.y + textWidth;
                                        currentLabel.y = addedMaxWidth;
                                        isMultiRows = true;
                                    }
                                }
                                var maxheight = addedMaxWidth;
                            }
                            // label width + multiple rows width + gap between the rows added only on text render in multiple rows
                            maxTxtDim.width = maxTxtDim.width + maxheight + (isMultiRows ? 5 : 0);
                        }
                    }
                }
            }
            return maxTxtDim;
        },

        rotatedLabel: function (axis, sender, value, rotatedLabel, is3D) {
            // to get height of rotated labels
            var rotatedOptions = {
                'font-size': axis.font.size,
                'transform': 'rotate(' + value + ',0,0)',
                'font-family': axis.font.fontFamily,
                'font-style': axis.font.fontStyle,
                'rotateAngle': 'rotate(' + value + 'deg)',
                'text-anchor': 'middle'
            };
            sender = is3D ? this.chartObj : sender;
            var text = sender.svgRenderer.createText(rotatedOptions, rotatedLabel);
            var height = Math.ceil((this._measureBounds(text, sender).height));
            var width = Math.ceil((this._measureBounds(text, sender).width));
            return { height: height, width: width };
        },

        _getTransform: function (xAxis, yAxis, invertedAxis) {
            var x, y, width, height;
            if (invertedAxis) {
                x = yAxis.x;
                y = xAxis.y;
                width = yAxis.width;
                height = xAxis.height;
            } else {
                {
                    x = xAxis.x;
                    y = yAxis.y;
                    width = xAxis.width;
                    height = yAxis.height;
                }
            }
            return { x: x, y: y, width: width, height: height };
        },
        //calculate path for roundedCorner of the series column,bar,stacking column,stacking bar,range column
        _calculateroundedCorner: function (cornerRadius, options, isArrow, orientation, tipPosition, tracker) {
            var x1 = options.x, y1 = options.y, padding = 5, canvasPadding = (this.chartObj.model.enableCanvasRendering && !tracker) ? padding / 4 : 0,
                width = options.width, height = options.height, topLeft,
                bottomLeft, topRight, bottomRight, d;

            if (typeof (cornerRadius) != "object" || ej.util.isNullOrUndefined(cornerRadius))
                topLeft = bottomLeft = topRight = bottomRight = cornerRadius;
            else {
                topLeft = cornerRadius.topLeft;
                bottomLeft = cornerRadius.bottomLeft;
                topRight = cornerRadius.topRight;
                bottomRight = cornerRadius.bottomRight;
            }
            topLeft = ej.util.isNullOrUndefined(options.rx) ? topLeft : options.rx;
            bottomLeft = ej.util.isNullOrUndefined(options.rx) ? bottomLeft : options.rx;
            topRight = ej.util.isNullOrUndefined(options.ry) ? topRight : options.ry;
            bottomRight = ej.util.isNullOrUndefined(options.ry) ? bottomRight : options.ry;

            d = "M" + " " + x1 + " " + (topLeft + y1) + " Q " + x1 + " " + y1 + " " + (x1 + topLeft) + " " + y1 + " ";
            if (isArrow && orientation == "top")
                d += "L " + (x1 + width / 2 - padding / 2 + canvasPadding) + " " + (y1) + " L " + (x1 + width / 2 + canvasPadding - tipPosition) + " " + (y1 - padding) + " L " + (x1 + width / 2 + padding / 2 + canvasPadding) + " " + (y1) + " ";
            d += "L" + " " + (x1 + width - topRight) + " " + y1 + " Q " + (x1 + width) + " " + y1 + " " + (x1 + width) + " " + (y1 + topRight) + " ";
            if (isArrow && orientation == "right")
                d += "L " + (x1 + width) + " " + (y1 + height / 2 - padding / 2 + canvasPadding) + " L " + (x1 + width + padding) + " " + (y1 + height / 2 + canvasPadding - tipPosition) + " L " + (x1 + width) + " " + (y1 + height / 2 + padding / 2 + canvasPadding) + " ";
            d += "L " + (x1 + width) + " " + (y1 + height - bottomRight) + " Q " + (x1 + width) + " " + (y1 + height) + " " + (x1 + width - bottomRight) + " " + (y1 + height) + " ";
            if (isArrow && orientation == "bottom")
                d += "L " + (x1 + width / 2 - padding / 2 + canvasPadding) + " " + (y1 + height) + " L " + (x1 + width / 2 + canvasPadding - tipPosition) + " " + (y1 + height + padding) + " L " + (x1 + width / 2 + padding / 2 + canvasPadding) + " " + (y1 + height) + " ";
            d += "L " + (x1 + bottomLeft) + " " + (y1 + height) + " Q " + x1 + " " + (y1 + height) + " " + x1 + " " + (y1 + height - bottomLeft) + " ";
            if (isArrow && orientation == "left")
                d += "L " + (x1) + " " + (y1 + height / 2 - padding / 2 + canvasPadding) + " L " + (x1 - padding) + " " + (y1 + height / 2 + canvasPadding - tipPosition) + " L " + (x1) + " " + (y1 + height / 2 + padding / 2 + canvasPadding) + " ";
            d += "L" + " " + x1 + " " + (topLeft + y1) + " " + "z";
            return d;

        },
        browserInfo: function () {
            var browser = {}, clientInfo = [],
                browserClients = {
                    webkit: /(chrome)[ \/]([\w.]+)/i, safari: /(webkit)[ \/]([\w.]+)/i, msie: /(msie) ([\w.]+)/i,
                    opera: /(opera)(?:.*version|)[ \/]([\w.]+)/i, mozilla: /(mozilla)(?:.*? rv:([\w.]+)|)/i
                };
            for (var client in browserClients) {
                if (browserClients.hasOwnProperty(client)) {
                    clientInfo = navigator.userAgent.match(browserClients[client]);
                    if (clientInfo) {
                        browser.name = clientInfo[1].toLowerCase();
                        browser.version = clientInfo[2];
                        if (!!navigator.userAgent.match(/Trident\/7\./)) {
                            browser.name = "msie";
                        }
                        break;
                    }
                }
            }
            browser.isMSPointerEnabled = (browser.name == 'msie') && browser.version > 9 && window.navigator.msPointerEnabled;
            browser.pointerEnabled = window.navigator.pointerEnabled;
            return browser;
        },
        _measureText: function (text, maxwidth, font) {
            var element = $(document).find("#measureTex");
            $("#measureTex").css('display', 'block'); // fixed for scroll issue in sample browser
            if (element.length == 0) {
                var textObj = document.createElement('text');
                $(textObj).attr({ 'id': 'measureTex' });
                document.body.appendChild(textObj);
            }
            else {
                var textObj = element[0];
            }

            var style = null, size = null, family = null, weight = null;
            if (typeof (text) == "string" && (text.indexOf("<") > -1 || text.indexOf(">") > -1)) {
                var textArray = text.split(" ");
                for (var i = 0; i < textArray.length; i++) {
                    if (textArray[i].indexOf("<br/>") == -1)
                        textArray[i] = textArray[i].replace(/[<>]/g, '&');
                }
                text = textArray.join(' ');
            }
            textObj.innerHTML = text;
            if (font != undefined && font.size == undefined) {
                var fontarray = font;
                fontarray = fontarray.split(" ");
                style = fontarray[0];
                size = fontarray[1];
                family = fontarray[2];
                weight = fontarray[3];
            }

            if (font != null) {
                textObj.style.fontSize = (font.size > 0) ? (font.size + "px") : font.size ? font.size : size;
                if (textObj.style.fontStyle)
                    textObj.style.fontStyle = (font.fontStyle) ? font.fontStyle : style;
                textObj.style.fontFamily = font.fontFamily ? font.fontFamily : family;
                if (window.navigator.userAgent.indexOf('MSIE 8.0') == -1)
                    textObj.style.fontWeight = font.fontWeight ? font.fontWeight : weight;
            }
            textObj.style.backgroundColor = 'white';
            textObj.style.position = 'absolute';
            textObj.style.top = -100;
            textObj.style.left = 0;
            textObj.style.visibility = 'hidden';
            textObj.style.whiteSpace = 'nowrap';
            if (maxwidth)
                textObj.style.maxwidth = maxwidth + "px";


            var bounds = { width: textObj.offsetWidth, height: textObj.offsetHeight };
            $("#measureTex").css('display', 'none'); // fixed for scroll issue in sample browser
            return bounds;
        },
        //to trim legend text
        _trimText: function (legendtext, maxwidth, font) {
            var textWidth, text, textLength;
            text = legendtext.toString();
            textLength = text.length;
            for (var t = 1; t < textLength; t++) {
                text = legendtext.substring(0, t) + '...';
                textWidth = ej.EjSvgRender.utils._measureText(text, null, font).width;
                if (textWidth >= maxwidth) {
                    text = text.substring(0, t - 1) + '... ';
                    return text;
                }
            }
            return legendtext;
        },
        _measureBounds: function (element, sender) {
            if (sender.model.enableCanvasRendering)
                $(document.body).append(element);
            else {
                sender.svgRenderer.append(element, sender.svgObject);
                sender.svgRenderer.append(sender.svgObject, sender.element);
            }
            var box = element.getBoundingClientRect();
            var bounds = { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: (box.right - box.left), height: (box.bottom - box.top) };
            $(element).remove();
            return bounds;
        },
        //Draw clip path for each series to avoid series overlap in multiple axes zooming
        _drawAxesBoundsClipPath: function (gSeriesGroupEle, options, sender) {
            var clipOptions;
            var element = $(gSeriesGroupEle);
            var trans = this._getTransform(options.xAxis, options.yAxis, sender.model.requireInvertedAxes);
            var width = (sender.model.AreaType == "polaraxes") ? $(sender.svgObject).width() : trans.width;
            var height = (sender.model.AreaType == "polaraxes") ? $(sender.svgObject).height() : trans.height;

            var hPlotOffset = sender.model.requireInvertedAxes ? options.yAxis.plotOffset : options.xAxis.plotOffset;
            var vPlotOffset = sender.model.requireInvertedAxes ? options.xAxis.plotOffset : options.yAxis.plotOffset;
            if (sender.model.AreaType == 'polaraxes') {
                clipOptions = {
                    'id': gSeriesGroupEle ? gSeriesGroupEle.id + '_ClipRect' : '',
                    'cx': sender.model.centerX,
                    'cy': sender.model.centerY,
                    'r': sender.model.Radius,
                    'fill': 'white',
                    'stroke-width': 1,
                    'stroke': 'transparent'
                };
                sender.svgRenderer.drawCircularClipPath(clipOptions, gSeriesGroupEle);
            }
            else {
                clipOptions = {
                    'id': gSeriesGroupEle ? gSeriesGroupEle.id + '_ClipRect' : '',
                    'x': (0 - hPlotOffset),
                    'y': (0 - vPlotOffset),
                    'width': (width + 2 * hPlotOffset),
                    'height': (height + 2 * vPlotOffset),
                    'fill': 'white',
                    'stroke-width': 1,
                    'stroke': 'transparent'
                };
                sender.svgRenderer.drawClipPath(clipOptions, gSeriesGroupEle);
            }

            element.attr('clip-path', 'url(#' + clipOptions.id + ')');

        },
        _getStringBuilder: function () {

            var data = [];
            var counter = 0;

            return {
                // adds string s to the stringbuilder

                append: function (s) {
                    data[counter++] = s;
                    return this;
                },

                // removes j elements starting at i, or 1 if j is omitted

                remove: function (i, j) {
                    data.splice(i, j || 1);
                    return this;
                },

                // inserts string s at i

                insert: function (i, s) {
                    data.splice(i, 0, s);
                    return this;
                },

                // builds the string

                toString: function (s) { return data.join(s || ""); }
            };


        },
        _addRegion: function (chart, bounds, series, point, pointIndex) {
            var type = series.type;
            var seriesIndex = $.inArray(series, chart.model._visibleSeries);
            if (seriesIndex >= 0) {
                var regionItem = { SeriesIndex: seriesIndex, Region: { PointIndex: pointIndex, Bounds: bounds }, type: type };
                chart.model.chartRegions.push(regionItem);
            }
        },

        AddRegion: function (chart, bounds, isStripLine) {

            if (isStripLine) {
                var regionItem = { isStripLine: isStripLine, Region: { Bounds: bounds } };
                chart.model.chartRegions.push(regionItem);
            }
        },


        _getSvgXY: function (x, y, series, sender) {
            var svgX, svgY;
            if (!(sender.model.requireInvertedAxes)) {
                svgX = x + series.xAxis.x;
                svgY = y + series.yAxis.y;
            } else {
                svgX = x + series.yAxis.x;
                svgY = y + series.xAxis.y;
            }
            return { X: svgX, Y: svgY };
        },
        _getPoint: function (point, series) {
            var x = point.xValue, low, xvalue, yvalue,
                y = series.type == "boxandwhisker" ? point.YValues : point.YValues[0],
                xLength = series._isTransposed ? series.xAxis.height : series.xAxis.width,
                yLength = series._isTransposed ? series.yAxis.width : series.yAxis.height;

            point.location = {};

            if (series._hiloTypes) {
                low = point.YValues[1];
                low = (series.yAxis._valueType == "logarithmic") ? ej.EjSvgRender.utils._logBase((low == 0 ? 1 : low), series.xAxis.logBase) : low;
                low = this._getPointXY(low, series.yAxis.visibleRange, series.yAxis.isInversed);
                point.location.low = (series._isTransposed ? low : (1 - low)) * (yLength);
            }

            xvalue = (series.xAxis._valueType == "logarithmic") ? ej.EjSvgRender.utils._logBase((x == 0 ? 1 : x), series.xAxis.logBase) : x;
            yvalue = (series.yAxis._valueType == "logarithmic") ? ej.EjSvgRender.utils._logBase((y == 0 ? 1 : y), series.xAxis.logBase) : y;

            xvalue = (this._getPointXY(xvalue, series.xAxis.visibleRange, series.xAxis.isInversed));
            yvalue = this._getPointXY(yvalue, series.yAxis.visibleRange, series.yAxis.isInversed);
            point.location.X = series._isTransposed ? yvalue * (yLength) : xvalue * (xLength);
            point.location.Y = series._isTransposed ? (1 - xvalue) * (xLength) : (1 - yvalue) * (yLength);

            return point.location;
        },
        _getPointXY: function (value, Range, isInversed) {

            var result = 0;
            result = (value - Range.min) / (Range.delta);
            result = isNaN(result) ? 0 : result;
            return (isInversed) ? (1 - result) : result;

        },

        _dateTimeLabelFormat: function (intervalType, axis) {
            switch (intervalType.toLowerCase()) {
                case "years":
                    return axis._labelFormat = "MMM, yyyy";
                case "months":
                    return axis._labelFormat = "dd, MMM";
                case "days":
                    return axis._labelFormat = "dd/MM/yyyy";
                case "hours":
                    return axis._labelFormat = "dd, hh:mm";
                case "minutes":
                    return axis._labelFormat = "hh:mm";
                case "seconds":
                    return axis._labelFormat = "mm:ss";
                case "milliseconds":
                    return axis._labelFormat = "ss:fff";
                default:
                    return axis._labelFormat = "dd/MM/yyyy";
            }
        },
        _getFontString: function (fontObj) {
            if (fontObj == null)
                fontObj = {};
            if (!fontObj.FontFamily)
                fontObj.FontFamily = "Arial";
            if (!fontObj.FontStyle)
                fontObj.FontStyle = "Normal";
            if (!fontObj.Size)
                fontObj.Size = "12px";

            return fontObj.FontStyle + " " + fontObj.Size + " " + fontObj.FontFamily;
        },

        _valueToVector: function (axis, value) {
            return this._coefficientToVector(this._valueToPolarCoefficient(axis, value));
        },

        TransformToVisible: function (currentseries, x, y, sender) {
            x = (currentseries.xAxis._valueType == "logarithmic") && x > 0 ? Math.log(x, currentseries.xAxis.logBase) : x;
            y = (currentseries.xAxis._valueType == "logarithmic") && y > 0 ? Math.log(y, currentseries.yAxis.logBase) : y;
            var radius = sender.model.Radius * this._valueToCoefficient(currentseries.yAxis, y);
            //var radius = this.chartObj.model.Radius * ej.EjSvgRender.utils._valueToPolarCoefficient(currentseries.yAxis, y);
            var point = this._valueToVector(currentseries.xAxis, x);
            return { X: sender.model.centerX + radius * point.X, Y: sender.model.centerY + radius * point.Y };
        },

        Transform3DToVisible: function (currentseries, x, y, sender) {
            if (currentseries.xAxis != null && currentseries.yAxis != null) {
                var valueType = currentseries.xAxis._valueType.toLowerCase();
                var xIsLogarithmic = (valueType == "logarithmic") ? true : false;
                x = x = xIsLogarithmic && x > 0 ? math.log(x, xlogarithmicBase) : x;
                y = y;

                if (sender.model.requireInvertedAxes) {
                    var left = sender.model.m_AreaBounds.X;
                    var top = sender.model.m_AreaBounds.Y;
                    var pointX = left + currentseries.yAxis.width * ej.EjSvgRender.utils._valueToCoefficient(currentseries.yAxis, y, sender);
                    var pointY = top + currentseries.xAxis.height * (1 - ej.EjSvgRender.utils._valueToCoefficient(currentseries.xAxis, x, sender))
                    return { X: pointX, Y: pointY }
                }
                else {
                    var left = currentseries.xAxis.x;
                    var top = currentseries.yAxis.y;
                    var x = left + Math.round(currentseries.xAxis.width * ej.EjSvgRender.utils._valueToCoefficient(currentseries.xAxis, x, sender));
                    var y = top + Math.round(currentseries.yAxis.height * (1 - ej.EjSvgRender.utils._valueToCoefficient(currentseries.yAxis, y, sender)));
                    return { X: x, Y: y }
                }
            }

            return new Point(0, 0);
        },

        _valueToPolarCoefficient: function (axis, value) {
            var start = axis.visibleRange.min;
            var delta;
            var length, result;
            if (axis._valueType != "category") {
                delta = (axis.visibleRange.max - axis.visibleRange.interval) - axis.visibleRange.min;
                length = axis.visibleLabels.length - 1;
            }
            else {
                delta = axis.visibleRange.delta;
                length = axis.visibleLabels.length;
            }

            result = (value - start) / delta;
            result *= 1 - 1 / (length);
            result = isNaN(result) ? 0 : result;

            return axis.isInversed ? result : 1 - result;
        },

        _coefficientToVector: function (coefficient) {
            var angle = Math.PI * (1.5 - 2 * coefficient);

            return { X: Math.cos(angle), Y: Math.sin(angle) };
        },


        _valueToCoefficient: function (axis, value, sender) {
            if (sender && sender.model.AreaType == 'polaraxes') {
                var yvalue = value;
            }
            else
                var yvalue = (axis._valueType && axis._valueType.toLowerCase() == "logarithmic") ?
                    ej.EjSvgRender.utils._logBase((value == 0 ? 1 : value), axis.logBase) : value;

            yvalue = (yvalue - axis.visibleRange.min) / (axis.visibleRange.delta);

            return (axis.isInversed) ? 1 - yvalue : yvalue;
        },
        _getBoundingClientRect: function (element, sender, series, invertedAxes) {
            var box = element.getBoundingClientRect();
            var position = $("#" + (sender.svgObject.id))[0].getBoundingClientRect();
            var xSeries, ySeries;
            if (invertedAxes) {
                xSeries = this._getTransform(series.xAxis, series.yAxis, true).x;
                ySeries = this._getTransform(series.xAxis, series.yAxis, true).y;
            } else {
                xSeries = this._getTransform(series.xAxis, series.yAxis, false).x;
                ySeries = this._getTransform(series.xAxis, series.yAxis, false).y;
            }
            var x = box.left - (xSeries + position.left);
            var y = box.top - (ySeries + position.top);
            return { x: x, y: y, width: (box.right - box.left), height: (box.bottom - box.top) };
        },
        _minMax: function (value, min, max) {
            return value > max ? max : (value < min ? min : value);
        },
        _inside: function (value, range) {
            if (value === "")
                return false;
            return (value <= range.max) && (value >= range.min);
        },
        _logBase: function (val, base) {
            return Math.log(val) / Math.log(base);
        },
        _correctRect: function (x1, y1, x2, y2) {
            return { X: Math.min(x1, x2), Y: Math.min(y1, y2), Width: Math.abs(x2 - x1), Height: Math.abs(y2 - y1) };
        },
        _getValuebyPoint: function (x, y, series, requireInvertedAxes) {

            var xSize = (requireInvertedAxes) ? series.xAxis.height : series.xAxis.width;
            var ySize = (requireInvertedAxes) ? series.yAxis.width : series.yAxis.height;

            var xValue = (series.xAxis.isInversed) ? (1 - (x / xSize)) : (x / xSize);
            var yValue = (series.yAxis.isInversed) ? (1 - (y / ySize)) : (y / ySize);

            xValue = xValue * (series.xAxis.visibleRange.delta) + series.xAxis.visibleRange.min;

            yValue = yValue * (series.yAxis.visibleRange.delta) + series.yAxis.visibleRange.min;

            xValue = (series.xAxis._valueType == "logarithmic") ? Math.pow(series.xAxis.logBase, xValue) : xValue;

            yValue = (series.yAxis._valueType == "logarithmic") ? Math.pow(series.yAxis.logBase, yValue) : yValue;

            return { PointX: xValue, PointY: yValue };

        }

    };
    ej.EjSvgRender.chartTransform3D = {
        ToRadial: Math.PI / 180,

        transform3D: function (size) {
            if (!this.vector) {
                this.vector = new (new ej.Ej3DRender()).vector3D();
                this.matrixobj = new (new ej.Ej3DRender()).matrix3D();
                this.bsptreeobj = new (new ej.Ej3DRender()).BSPTreeBuilder();
                this.polygon = new (new ej.Ej3DRender()).polygon3D();
            }
            return {
                mViewport: size,
                Rotation: 0,
                Tilt: 0,
                Depth: 0,
                PerspectiveAngle: 0,
                needUpdate: true,
                centeredMatrix: this.matrixobj.getIdentity(),
                Perspective: this.matrixobj.getIdentity(),
                resultMatrix: this.matrixobj.getIdentity(),
                viewMatrix: this.matrixobj.getIdentity(),
                Depth: 0
            };
        },

        transform: function (trans) {
            this.setCenter(this.vector.vector3D(trans.mViewport.Width / 2, trans.mViewport.Height / 2, trans.Depth / 2), trans);
            this.setViewMatrix(this.matrixobj.transform(0, 0, trans.Depth), trans)
            this.setViewMatrix(this.matrixobj.getMatrixMultiplication(trans.viewMatrix, this.matrixobj.turn(-this.ToRadial * trans.Rotation)), trans);
            this.setViewMatrix(this.matrixobj.getMatrixMultiplication(trans.viewMatrix, this.matrixobj.tilt(-this.ToRadial * trans.Tilt)), trans);
            this.updatePerspective(trans.PerspectiveAngle, trans);
            trans.needUpdate = true;

        },

        updatePerspective: function (angle, trans) {
            var width = (((trans.mViewport.Width + trans.mViewport.Height) * Math.tan(this.degreeToRadianConverter((180 - Math.abs(angle % 181)) / 2.0))) + (trans.Depth * 2) / 2);
            trans.Perspective[0][0] = width;
            trans.Perspective[1][1] = width;
            trans.Perspective[2][3] = 1;
            trans.Perspective[3][3] = width;

        },

        degreeToRadianConverter: function (degree) {
            return degree * Math.PI / 180;
        },
        toScreen: function (vector3D, trans, result, chartObj) {
            var result = result ? result : this.result;
            if (!chartObj) {
                trans.chartObj = this.matrixobj;
                vector3D = this.matrixobj.getMatrixVectorMutiple(result(trans), vector3D);
            }
            else {
                this.matrixobj = chartObj;
                vector3D = chartObj.getMatrixVectorMutiple(result(trans, chartObj), vector3D);
            }
            return { x: vector3D.x, y: vector3D.y };
        },

        setViewMatrix: function (value, trans) {
            if (trans.viewMatrix == value) return;
            trans.viewMatrix = value;
            trans.needUpdate = true;

        },

        setCenteredMatrix: function (value, trans) {
            if (trans.viewMatrix == value) return;
            trans.centeredMatrix = value;
            trans.needUpdate = true;

        },

        result: function (trans, matrixobj) {
            var chartObj = trans.chartObj ? trans.chartObj : this.matrixobj;
            if (!chartObj) chartObj = matrixobj;
            if (!trans.needUpdate) return trans.resultMatrix;
            trans.resultMatrix = chartObj.getMatrixMultiplication(this.matrixobj.getInvertal(trans.centeredMatrix),
                trans.Perspective);
            trans.resultMatrix = chartObj.getMatrixMultiplication(trans.resultMatrix, trans.viewMatrix);
            trans.resultMatrix = chartObj.getMatrixMultiplication(trans.resultMatrix, trans.centeredMatrix);
            trans.needUpdate = false;

            return trans.resultMatrix;
        },


        setCenter: function (center, trans) {
            trans.centeredMatrix = this.matrixobj.transform(-center.x, -center.y, -center.z);
            trans.needUpdate = true;
        },
        toPlane: function (point, plane, trans) {
            var vec1 = this.vector.vector3D(point.x, point.y, 0);
            var vec2 = this.vector.vector3DPlus(vec1, vector.vector3D(0, 0, 1));

            vec1 = this.vector.vector3DMultiply(trans.centeredMatrix, vec1);
            vec2 = this.vector.vector3DMultiply(trans.centeredMatrix, vec2);

            vec1 = this.vector.vector3DMultiply(this.matrixobj.getInvertal(trans.Perspective), vec1);
            vec2 = this.vector.vector3DMultiply(this.matrixobj.getInvertal(trans.Perspective), vec2);

            vec1 = this.polygon.getPoint(vec1, this.vector.vector3DMinus(vec2 - vec1));

            vec1 = this.vector.vector3DMultiply(this.matrixobj.getInvertal(trans.viewMatrix), vec1);
            vec1 = this.vector.vector3DMultiply(this.matrixobj.getInvertal(trans.centeredMatrix), vec1);

            return vec1;
        }

    };
    ej.EjSvgRender.chartSymbol =
        {
            _drawSeriesType: function (location, symbolStyle, sender) {
                var seriesType = sender.model.series[symbolStyle.SeriesIndex].type.toLowerCase();
                var trendlinetype = sender.legendItem.drawType;
                seriesType = ej.util.isNullOrUndefined(trendlinetype) ? seriesType : trendlinetype;
                switch (seriesType) {
                    case ej.datavisualization.Chart.Type.Line: {
                        var line;
                        if (ej.util.isNullOrUndefined(trendlinetype))
                            line = this._drawLine(location, symbolStyle, sender, sender.gLegendItemEle);
                        else
                            line = this._drawStraightLine(location, symbolStyle, sender, sender.gLegendItemEle);
                        return line;
                    }

                    case ej.datavisualization.Chart.Type.StepLine:
                        return this._drawStepLine(location, symbolStyle, sender, sender.gLegendItemEle);

                    case ej.datavisualization.Chart.Type.StackingArea:
                    case ej.datavisualization.Chart.Type.StackingArea100:
                    case ej.datavisualization.Chart.Type.Area:
                    case ej.datavisualization.Chart.Type.RangeArea:
                        return this._drawArea(location, symbolStyle, sender, sender.gLegendItemEle);

                    case ej.datavisualization.Chart.Type.StepArea:
                        return this._drawStepArea(location, symbolStyle, sender, sender.gLegendItemEle);

                    case ej.datavisualization.Chart.Type.Bar:
                    case ej.datavisualization.Chart.Type.StackingBar100:
                    case ej.datavisualization.Chart.Type.StackingBar:
                        return this._drawBar(location, symbolStyle, sender, sender.gLegendItemEle);

                    case ej.datavisualization.Chart.Type.Pie:
                        return this._drawPie(location, symbolStyle, sender, sender.gLegendItemEle);

                    case ej.datavisualization.Chart.Type.Doughnut:
                        return this._drawDoughnut(location, symbolStyle, sender, sender.gLegendItemEle);

                    case ej.datavisualization.Chart.Type.Hilo:
                        return this._drawHilo(location, symbolStyle, sender, sender.gLegendItemEle);

                    case ej.datavisualization.Chart.Type.HiloOpenClose:
                        return this._drawHiloOpenClose(location, symbolStyle, sender, sender.gLegendItemEle);

                    case ej.datavisualization.Chart.Type.Candle:
                        return this._drawCandle(location, symbolStyle, sender, sender.gLegendItemEle);

                    case ej.datavisualization.Chart.Type.Pyramid:
                        return this._drawPyramid(location, symbolStyle, sender, sender.gLegendItemEle);

                    case ej.datavisualization.Chart.Type.Funnel:
                        return this._drawFunnel(location, symbolStyle, sender, sender.gLegendItemEle);

                    case ej.datavisualization.Chart.Type.Spline:
                        return this._drawSpline(location, symbolStyle, sender, sender.gLegendItemEle);

                    case ej.datavisualization.Chart.Type.SplineArea:
                    case ej.datavisualization.Chart.Type.StackingSplineArea:
                    case ej.datavisualization.Chart.Type.StackingSplineArea100:
                        return this._drawSplineArea(location, symbolStyle, sender, sender.gLegendItemEle);

                    case ej.datavisualization.Chart.Type.RangeColumn:
                        return this._drawRangeColumn(location, symbolStyle, sender, sender.gLegendItemEle);

                    case ej.datavisualization.Chart.Type.Bubble:
                    case ej.datavisualization.Chart.Type.Scatter:
                        return this._drawCircle(location, symbolStyle, sender, sender.gLegendItemEle);

                    case ej.datavisualization.Chart.Type.Column:
                    case ej.datavisualization.Chart.Type.StackingColumn:
                    case ej.datavisualization.Chart.Type.StackingColumn100:
                    case ej.datavisualization.Chart.Type.Waterfall:
                        return this._drawColumn(location, symbolStyle, sender, sender.gLegendItemEle);

                    default:
                        return this._drawRectangle(location, symbolStyle, sender, sender.gLegendItemEle);

                }

            },

            _drawCircle: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer, svgObj = sender.svgObject, style = symbolStyle.ShapeSize,
                    radius = Math.sqrt(style.height * style.height + style.width * style.width) / 2,
                    symbolstyleStyle = symbolStyle.Style;

                var options = {
                    'id': symbolStyle.ID,
                    'cx': location.startX,
                    'cy': location.startY,
                    'r': radius,
                    'fill': symbolstyleStyle.Color,
                    'stroke-width': symbolstyleStyle.BorderWidth,
                    'stroke': symbolstyleStyle.BorderColor,
                    'opacity': symbolstyleStyle.Opacity,
                    'visibility': symbolstyleStyle.Visibility,
                    'lgndCtx': symbolStyle.context
                };

                svgRender.drawCircle(options, element);

                return (location.startX - radius);
            },

            _drawLeftArrow: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var path;
                path = "M" + " " + ((location.startX - (style.width / 2)) + style.width) + " " + (location.startY + (style.height / 4)) + " " + "L" + " " + ((location.startX - (style.width / 2)) + style.width) + " " + (location.startY + (-style.height / 4)) + " " + "L" + " " + ((location.startX - (style.width / 2)) + (style.width / 2)) + " " + (location.startY + (-style.height / 4)) + " " + "L" + " " + ((location.startX - (style.width / 2)) + (style.width / 2)) + " " + (location.startY + (-style.height / 2)) + " " + "L" + " " + ((location.startX - (style.width / 2))) + " " + (location.startY) + " " + "L" + " " + ((location.startX - (style.width / 2)) + (style.width / 2)) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + ((location.startX - (style.width / 2)) + (style.width / 2)) + " " + (location.startY + (style.height / 4)) + " " + "L" + " " + ((location.startX - (style.width / 2)) + style.width) + " " + (location.startY + (style.height / 4)) + " z";
                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'lgndCtx': symbolStyle.context,
                    'd': path
                };

                svgRender.drawPath(options, element);

            },


            _drawRightArrow: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var path;
                path = "M" + " " + ((location.startX - (style.width / 2))) + " " + (location.startY + (style.height / 4)) + " " + "L" + " " + ((location.startX - (style.width / 2))) + " " + (location.startY + (-style.height / 4)) + " " + "L" + " " + ((location.startX - (style.width / 2)) + (style.width / 2)) + " " + (location.startY + (-style.height / 4)) + " " + "L" + " " + ((location.startX - (style.width / 2)) + (style.width / 2)) + " " + (location.startY + (-style.height / 2)) + " " + "L" + " " + ((location.startX - (style.width / 2)) + style.width) + " " + (location.startY) + " " + "L" + " " + ((location.startX - (style.width / 2)) + (style.width / 2)) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + ((location.startX - (style.width / 2)) + (style.width / 2)) + " " + (location.startY + (style.height / 4)) + " " + "L" + " " + ((location.startX - (style.width / 2))) + " " + (location.startY + (style.height / 4)) + " z";
                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'lgndCtx': symbolStyle.context,
                    'd': path
                };


                svgRender.drawPath(options, element);


            },


            _drawUpArrow: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var path;
                path = "M" + " " + ((location.startX - (style.width / 2) + (style.width / 4))) + " " + (location.startY - (style.height / 2) + (style.height)) + " " + "L" + " " + ((location.startX - (style.width / 2) + (style.width / 4))) + " " + (location.startY - (style.height / 2) + (style.height / 2)) + " " + "L" + " " + ((location.startX - (style.width / 2))) + " " + (location.startY - (style.height / 2) + (style.height / 2)) + " " + "L" + " " + ((location.startX)) + " " + (location.startY - (style.height / 2)) + " " + "L" + " " + ((location.startX + (style.width / 2))) + " " + (location.startY - (style.height / 2) + (style.height / 2)) + " " + "L" + " " + ((location.startX + (style.width / 2) - (style.width / 4))) + " " + (location.startY - (style.height / 2) + (style.height / 2)) + " " + "L" + " " + ((location.startX + (style.width / 2) - (style.width / 4))) + " " + (location.startY - (style.height / 2) + (style.height)) + " " + "L" + " " + ((location.startX - (style.width / 2) + (style.width / 4))) + " " + (location.startY - (style.height / 2) + (style.height)) + " z";
                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'lgndCtx': symbolStyle.context,
                    'd': path
                };


                svgRender.drawPath(options, element);


            },

            _drawDownArrow: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var path;
                path = "M" + " " + ((location.startX - (style.width / 2) + (style.width / 4))) + " " + (location.startY - (style.height / 2)) + " " + "L" + " " + ((location.startX + (style.width / 2) - (style.width / 4))) + " " + (location.startY - (style.height / 2)) + " " + "L" + " " + ((location.startX + (style.width / 2) - (style.width / 4))) + " " + (location.startY - (style.height / 2) + (style.height / 2)) + " " + "L" + " " + ((location.startX + (style.width / 2))) + " " + (location.startY - (style.height / 2) + (style.height / 2)) + " " + "L" + " " + ((location.startX)) + " " + (location.startY - (style.height / 2) + (style.height)) + " " + "L" + " " + ((location.startX - (style.width / 2))) + " " + (location.startY - (style.height / 2) + (style.height / 2)) + " " + "L" + " " + ((location.startX - (style.width / 2) + (style.width / 4))) + " " + (location.startY - (style.height / 2) + (style.height / 2)) + " " + "L" + " " + ((location.startX - (style.width / 2) + (style.width / 4))) + " " + (location.startY - (style.height / 2)) + " z";
                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'lgndCtx': symbolStyle.context,
                    'd': path
                };


                svgRender.drawPath(options, element);

            },

            _drawCross: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;

                var path;
                path = "M" + " " + (location.startX + (-style.width / 2)) + " " + (location.startY) + " " + "L" + " " + (location.startX + (style.width / 2)) + " " + (location.startY) + " " +
                    "M" + " " + (location.startX) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX) + " " + (location.startY + (-style.height / 2));
                var options = {
                    'id': symbolStyle.ID,
                    'opacity': symbolStyle.Style.Opacity,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.Color,
                    'visibility': symbolStyle.Style.Visibility,
                    'lgndCtx': symbolStyle.context,
                    'd': path
                };

                svgRender.drawPath(options, element);

            },

            _drawHorizLine: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;

                var path;
                path = "M" + " " + (location.startX + (-style.width / 2)) + " " + (location.startY) + " " + "L" + " " + (location.startX + (style.width / 2)) + " " + (location.startY);
                var options = {
                    'id': symbolStyle.ID,
                    'opacity': symbolStyle.Style.Opacity,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.Color,
                    'visibility': symbolStyle.Style.Visibility,
                    'lgndCtx': symbolStyle.context,
                    'd': path
                };

                svgRender.drawPath(options, element);


            },
            _drawVertLine: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var path;
                path = "M" + " " + (location.startX) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX) + " " + (location.startY + (-style.height / 2));
                var options = {
                    'id': symbolStyle.ID,
                    'opacity': symbolStyle.Style.Opacity,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.Color,
                    'visibility': symbolStyle.Style.Visibility,
                    'lgndCtx': symbolStyle.context,
                    'd': path
                };


                svgRender.drawPath(options, element);

            },

            _drawTriangle: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var path;
                path = "M" + " " + (location.startX + (-style.width / 2)) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX) + " " + (location.startY + (-style.height / 2)) + " " + "L" + " " + (location.startX + (style.width / 2)) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX + (-style.width / 2)) + " " + (location.startY + (style.height / 2)) + " z";
                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'lgndCtx': symbolStyle.context,
                    'd': path
                };

                svgRender.drawPath(options, element);

            },

            _drawInvertedTriangle: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;

                var path;
                path = "M" + " " + (location.startX + (style.width / 2)) + " " + (location.startY - (style.height / 2)) + " "
                    + "L" + " " + (location.startX) + " " + (location.startY + (style.height / 2)) + " "
                    + "L" + " " + (location.startX - (style.width / 2)) + " " + (location.startY - (style.height / 2)) + " "
                    + "L" + " " + (location.startX + (style.width / 2)) + " " + (location.startY - (style.height / 2)) + " z";
                var x = location.startX;
                var y = location.startY;
                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'lgndCtx': symbolStyle.context,
                    'd': path
                };

                svgRender.drawPath(options, element);


            },

            _drawHexagon: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;

                var path;
                path = "M" + " " + (location.startX + (-style.width / 2)) + " " + (location.startY) + " " + "L" + " " + (location.startX + (-style.width / 4)) + " " + (location.startY + (-style.height / 2)) + " " + "L" + " " + (location.startX + (style.width / 4)) + " " + (location.startY + (-style.height / 2)) + " " + "L" + " " + (location.startX + (style.width / 2)) + " " + (location.startY) + " " + "L" + " " + (location.startX + (style.width / 4)) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX + (-style.width / 4)) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX + (-style.width / 2)) + " " + (location.startY) + " z";
                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'lgndCtx': symbolStyle.context,
                    'd': path
                };

                svgRender.drawPath(options, element);

            },

            _drawWedge: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;

                var path;
                path = "M" + " " + (location.startX - style.width) + " " + (location.startY) + " " + "L" + " " + (location.startX + style.width) + " " + (location.startY + (-style.height / 2)) + " " + "L" + " " + (location.startX + (3 * (style.width / 4))) + " " + (location.startY) + " " + "L" + " " + (location.startX + (style.width)) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX - style.width) + " " + (location.startY) + " z";
                var options = {
                    'stroke-linecap': 'miter',
                    'stroke-miterlimit': style.width / 4,
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'lgndCtx': symbolStyle.context,
                    'd': path
                };

                svgRender.drawPath(options, element);

            },

            _drawPentagon: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;

                var eq = 72;
                var radius = Math.sqrt(style.height * style.height + style.width * style.width) / 2;
                var sb = ej.EjSvgRender.utils._getStringBuilder();
                for (var i = 0; i <= 5; i++) {
                    var deg = i * eq;
                    var rad = (Math.PI / 180) * deg;
                    var x1 = radius * Math.cos(rad);
                    var y1 = radius * Math.sin(rad);
                    if (i == 0)
                        sb.append("M" + " " + (location.startX + x1) + " " + (location.startY + y1) + " ");

                    else
                        sb.append("L" + " " + (location.startX + x1) + " " + (location.startY + y1) + " ");


                }
                sb.append("z");
                var path = sb.toString();
                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'lgndCtx': symbolStyle.context,
                    'd': path
                };

                svgRender.drawPath(options, element);


            },

            _drawStar: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var style = symbolStyle.ShapeSize;
                var svgObj = sender.svgObject;

                var path;
                path = "M" + " " + (location.startX + (style.width / 3)) + " " + (location.startY + (-style.height / 2)) + " " + "L" + " " + (location.startX + (-style.width / 2)) + " " + (location.startY + (style.height / 6)) + " " + "L" + " " + (location.startX + (style.width / 2)) + " " + (location.startY + (style.height / 6)) + " " + "L" + " " + (location.startX + (-style.width / 3)) + " " + (location.startY + (-style.height / 2)) + " " + "L" + " " + (location.startX) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX + (style.width / 3)) + " " + (location.startY + (-style.height / 2)) + " z";
                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'lgndCtx': symbolStyle.context,
                    'd': path
                };

                svgRender.drawPath(options, element);


            },

            _drawRectangle: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;

                var path;
                path = "M" + " " + (location.startX + (-style.width / 2)) + " " + (location.startY + (-style.height / 2)) + " " + "L" + " " + (location.startX + (style.width / 2)) + " " + (location.startY + (-style.height / 2)) + " " + "L" + " " + (location.startX + (style.width / 2)) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX + (-style.width / 2)) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX + (-style.width / 2)) + " " + (location.startY + (-style.height / 2)) + " z";
                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'lgndCtx': symbolStyle.context,
                    'd': path
                };

                svgRender.drawPath(options, element);
            },

            _drawTrapezoid: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;

                var path;
                path = "M" + " " + (location.startX + (-style.width / 2)) + " " + (location.startY) + " " + "L" + " " + (location.startX + (-style.width / 2)) + " " + (location.startY + (-style.height / 4)) + " " + "L" + " " + (location.startX + (-style.width / 2) + (style.width)) + " " + (location.startY + (-style.height / 2)) + " " + "L" + " " + (location.startX + (-style.width / 2) + (style.width)) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX + (-style.width / 2)) + " " + (location.startY + (style.height / 4)) + " " + "L" + " " + (location.startX + (-style.width / 2)) + " " + (location.startY) + " z";
                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'lgndCtx': symbolStyle.context,
                    'd': path
                };

                svgRender.drawPath(options, element);

            },

            _drawDiamond: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;

                var path;
                path = "M" + " " + (location.startX + (-style.width / 2)) + " " + (location.startY) + " " + "L" + " " + (location.startX) + " " + (location.startY + (-style.height / 2)) + " " + "L" + " " + (location.startX + (style.width / 2)) + " " + (location.startY) + " " + "L" + " " + (location.startX) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX + (-style.width / 2)) + " " + (location.startY) + " z";

                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'lgndCtx': symbolStyle.context,
                    'd': path
                };

                svgRender.drawPath(options, element);


            },
            _drawEllipse: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;

                var x = location.startX;
                var y = location.startY;
                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'lgndCtx': symbolStyle.context,
                    'cx': x,
                    'cy': y,
                    'rx': style.width,
                    'ry': style.height / 2
                };


                svgRender.drawEllipse(options, element);


            },
            _drawImage: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var x = location.startX + (-style.width / 2);
                var y = location.startY + (-style.width / 2);
                var width = style.width;
                var height = style.height;
                var options = {
                    'id': svgObj.id + '_image' + symbolStyle.PointIndex, 'height': height, 'width': width, 'href': symbolStyle.Imageurl,
                    'x': x, 'y': y, 'visibility': 'visible', 'lgndCtx': symbolStyle.context
                };

                svgRender.drawImage(options, element);


            },

            _drawStraightLine: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var elementspace = symbolStyle.ElementSpace;
                var path;

                path = "M" + " " + (location.startX + (-style.width / 2) + (-elementspace / 4)) + " " + (location.startY + (style.height / 10)) + " " +
                    "L" + " " + (location.startX + (style.width / 2) + (elementspace / 4)) + " " + (location.startY + (style.height / 10));
                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth * 2,
                    'stroke': symbolStyle.Style.Color,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'd': path,
                    'lgndCtx': true
                };
                svgRender.drawPath(options, element);
                return (location.startX + (-style.width / 2) + (-elementspace / 4));
            },

            _drawLine: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var elementspace = symbolStyle.ElementSpace;
                var path;

                if (sender.model.enableCanvasRendering === true) {
                    path = "M" + " " + (location.startX + (-style.width / 2) + (-elementspace / 4)) + " " + (location.startY + (style.height / 10)) + " " + "L" + " " + (location.startX - Math.floor(style.width / 3)) + " " + (location.startY + (style.height / 10)) + " " + "M" + " " + (location.startX + Math.floor(style.width / 3)) + " " + (location.startY + (style.height / 10)) + " " + "L" + " " + (location.startX + (style.width / 2) + (elementspace / 4)) + " " + (location.startY + (style.height / 10));
                    var options = {
                        'id': symbolStyle.ID,
                        'fill': symbolStyle.Style.Color,
                        'stroke-width': symbolStyle.Style.BorderWidth * 2,
                        'stroke': symbolStyle.Style.Color,
                        'opacity': symbolStyle.Style.Opacity,
                        'visibility': symbolStyle.Style.Visibility,
                        'd': path,
                        'lgndCtx': true
                    };
                    var circlepath = "M" + " " + (location.startX - Math.floor(style.width / 3)) + " " + (location.startY + (style.height / 10)) + " " + "a " + (Math.floor(style.width / 3)) + " " + (Math.floor(style.width / 3)) + " " + 0 + " " + 1 + " " + 0 + " " + 2 * (Math.floor(style.width / 3)) + " " + 0 + " " + "a" + (Math.floor(style.width / 3)) + " " + (Math.floor(style.width / 3)) + " " + 0 + " " + 1 + " " + 0 + " " + (-2 * (Math.floor(style.width / 3))) + " " + 0;
                    var circleoptions = {
                        'id': symbolStyle.ID,
                        'fill': "transparent",
                        'stroke-width': symbolStyle.Style.BorderWidth * 2,
                        'stroke': symbolStyle.Style.Color,
                        'opacity': symbolStyle.Style.Opacity,
                        'visibility': symbolStyle.Style.Visibility,
                        'd': circlepath,
                        'lgndCtx': true
                    };

                    svgRender.drawPath(options, element);
                    svgRender.drawPath(circleoptions, element);
                }
                else {
                    path = "M" + " " + (location.startX + (-style.width / 2) + (-elementspace / 4)) + " " + (location.startY + (style.height / 10)) + " " + "L" + " " + (location.startX - Math.floor(style.width / 3)) + " " + (location.startY + (style.height / 10)) + " " + "M" + " " + (location.startX + Math.floor(style.width / 3)) + " " + (location.startY + (style.height / 10)) + " " + "L" + " " + (location.startX + (style.width / 2) + (elementspace / 4)) + " " + (location.startY + (style.height / 10)) + " " + "M" + " " + (location.startX - Math.floor(style.width / 3)) + " " + (location.startY + (style.height / 10)) + " " + "a " + (Math.floor(style.width / 3)) + " " + (Math.floor(style.width / 3)) + " " + 0 + " " + 1 + " " + 0 + " " + 2 * (Math.floor(style.width / 3)) + " " + 0 + " " + "a" + (Math.floor(style.width / 3)) + " " + (Math.floor(style.width / 3)) + " " + 0 + " " + 1 + " " + 0 + " " + (-2 * (Math.floor(style.width / 3))) + " " + 0;
                    var options = {
                        'id': symbolStyle.ID,
                        'fill': "transparent",
                        'stroke-width': symbolStyle.Style.BorderWidth * 2,
                        'stroke': symbolStyle.Style.Color,
                        'opacity': symbolStyle.Style.Opacity,
                        'visibility': symbolStyle.Style.Visibility,
                        'd': path,
                        'lgndCtx': true
                    };
                    svgRender.drawPath(options, element);
                }
                return (location.startX + (-style.width / 2) + (-elementspace / 4));

            },
            _drawColumn: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var elementspace = symbolStyle.ElementSpace;
                var path;
                path = "M" + " " + (location.startX - 3 * (style.width / 5)) + " " + (location.startY - (style.height / 5)) + " " + "L" + " " + (location.startX + 3 * (-style.width / 10)) + " " + (location.startY - (style.height / 5)) + " " + "L" + " " + (location.startX + 3 * (-style.width / 10)) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX - 3 * (style.height / 5)) + " " + (location.startY + (style.height / 2)) + " " + "Z" + " " + "M" + " " + (location.startX + (-style.width / 10) - (style.width / 20)) + " " + (location.startY - (style.height / 4) - (elementspace / 2)) + " " + "L" + " " + (location.startX + (style.width / 10) + (style.width / 20)) + " " + (location.startY - (style.height / 4) - (elementspace / 2)) + " " + "L" + " " + (location.startX + (style.width / 10) + (style.width / 20)) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX + (-style.width / 10) - (style.width / 20)) + " " + (location.startY + (style.height / 2)) + " " + "Z" + " " + "M" + " " + (location.startX + 3 * (style.width / 10)) + " " + (location.startY) + " " + "L" + " " + (location.startX + 3 * (style.width / 5)) + " " + (location.startY) + " " + "L" + " " + (location.startX + 3 * (style.width / 5)) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX + 3 * (style.width / 10)) + " " + (location.startY + (style.height / 2)) + " " + "Z";

                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'd': path,
                    'lgndCtx': true
                };

                svgRender.drawPath(options, element);

                return (location.startX - 3 * (style.width / 5));

            },
            _drawRangeColumn: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var elementspace = symbolStyle.ElementSpace;
                var path;
                path = "M" + " " + (location.startX + (-style.width / 5)) + " " + (location.startY + (style.height / 2) + (elementspace / 4)) + " " + "L" + " " + (location.startX + (-style.width / 5)) + " " + (location.startY - (style.height / 2) - (elementspace / 4)) + " " + "L" + " " + (location.startX + (style.width / 2)) + " " + (location.startY + (-style.height / 2) + (-elementspace / 4)) + " " + "L" + " " + (location.startX + (style.width / 2)) + " " + (location.startY + (style.height / 2) + (elementspace / 4)) + " " + "Z";

                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'd': path,
                    'lgndCtx': true
                };

                svgRender.drawPath(options, element);

                return (location.startX + (-style.width / 5));

            },

            _drawBar: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var elementspace = symbolStyle.ElementSpace;
                var path;

                path = "M" + " " + (location.startX + (-style.width / 2) + (-elementspace / 4)) + " " + (location.startY - 3 * (style.height / 5)) + " " + "L" + " " + (location.startX + 3 * (style.width / 10)) + " " + (location.startY - 3 * (style.height / 5)) + " " + "L" + " " + (location.startX + 3 * (style.width / 10)) + " " + (location.startY - 3 * (style.height / 10)) + " " + "L" + " " + (location.startX - (style.width / 2) + (-elementspace / 4)) + " " + (location.startY - 3 * (style.height / 10)) + " " + "Z" + " " + "M" + " " + (location.startX + (-style.width / 2) + (-elementspace / 4)) + " " + (location.startY - (style.height / 5) + (elementspace / 20)) + " " + "L" + " " + (location.startX + (style.width / 2) + (elementspace / 4)) + " " + (location.startY - (style.height / 5) + (elementspace / 20)) + " " + "L" + " " + (location.startX + (style.width / 2) + (elementspace / 4)) + " " + (location.startY + (style.height / 10) + (elementspace / 20)) + " " + "L" + " " + (location.startX - (style.width / 2) + (-elementspace / 4)) + " " + (location.startY + (style.height / 10) + (elementspace / 20)) + " " + "Z" + " " + "M" + " " + (location.startX - (style.width / 2) + (-elementspace / 4)) + " " + (location.startY + (style.height / 5) + (elementspace / 10)) + " " + "L" + " " + (location.startX + (-style.width / 4)) + " " + (location.startY + (style.height / 5) + (elementspace / 10)) + " " + "L" + " " + (location.startX + (-style.width / 4)) + " " + (location.startY + (style.height / 2) + (elementspace / 10)) + " " + "L" + " " + (location.startX - (style.width / 2) + (-elementspace / 4)) + " " + (location.startY + (style.height / 2) + (elementspace / 10)) + " " + "Z";
                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'd': path,
                    'lgndCtx': true
                };

                svgRender.drawPath(options, element);

                return (location.startX + (-style.width / 2) + (-elementspace / 4));

            },

            _drawStepLine: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var elementspace = symbolStyle.ElementSpace;
                var path;

                path = "M" + " " + (location.startX + (-style.width / 2) - (elementspace / 4)) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX + (-style.width / 2) + (style.width / 10)) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX + (-style.width / 2) + (style.width / 10)) + " " + (location.startY) + " " + "L" + " " + (location.startX + (-style.width / 10)) + " " + (location.startY) + " " + "L" + " " + (location.startX + (-style.width / 10)) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX + (style.width / 5)) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX + (style.width / 5)) + " " + (location.startY + (-style.height / 2)) + " " + "L" + " " + (location.startX + (style.width / 2)) + " " + (location.startY + (-style.height / 2)) + "L" + " " + (location.startX + (style.width / 2)) + " " + (location.startY + (style.height / 2)) + " " + "L" + "" + (location.startX + (style.width / 2) + (elementspace / 4)) + " " + (location.startY + (style.height / 2));
                var options = {
                    'id': symbolStyle.ID,
                    'fill': "transparent",
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.Color,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'd': path,
                    'lgndCtx': true
                };

                svgRender.drawPath(options, element);

                return (location.startX + (-style.width / 2) - (elementspace / 4));

            },
            _drawSpline: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var path;
                path = "M" + " " + (location.startX - (style.width / 2)) + " " + (location.startY + (style.height / 5)) + " " + "Q" + " " + location.startX + " " + (location.startY - style.height) + " " + location.startX + " " + (location.startY + (style.height / 5)) + " " + "M" + " " + location.startX + " " + (location.startY + (style.height / 5)) + " " + "Q" + " " + (location.startX + (style.width / 2)) + " " + (location.startY + (style.height / 2)) + " " + (location.startX + (style.width / 2)) + " " + (location.startY - (style.height / 2));
                var options = {
                    'id': symbolStyle.ID,
                    'fill': "transparent",
                    'stroke-width': symbolStyle.Style.BorderWidth * 2,
                    'stroke': symbolStyle.Style.Color,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'd': path,
                    'lgndCtx': true
                };

                svgRender.drawPath(options, element);

                return (location.startX - (style.width / 2));

            },
            _drawSplineArea: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var path;
                path = "M" + " " + (location.startX - (style.width / 2)) + " " + (location.startY + (style.height / 5)) + " " + "Q" + " " + location.startX + " " + (location.startY - style.height) + " " + location.startX + " " + (location.startY + (style.height / 5)) + " " + "Z" + " " + "M" + " " + location.startX + " " + (location.startY + (style.height / 5)) + " " + "Q" + " " + (location.startX + (style.width / 2)) + " " + (location.startY + (style.height / 2)) + " " + (location.startX + (style.width / 2)) + " " + (location.startY - (style.height / 2)) + " " + " Z";
                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.Color,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'd': path,
                    'lgndCtx': true
                };

                svgRender.drawPath(options, element);

                return (location.startX - (style.width / 2));

            },
            _drawArea: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var elementspace = symbolStyle.ElementSpace;
                var path;
                path = "M" + " " + (location.startX - (style.width / 2) - (elementspace / 4)) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX + (-style.width / 4) + (-elementspace / 8)) + " " + (location.startY - (style.height / 2)) + " " + "L" + " " + (location.startX) + " " + (location.startY + (style.height / 4)) + " " + "L" + " " + (location.startX + (style.width / 4) + (elementspace / 8)) + " " + (location.startY + (-style.height / 2) + (style.height / 4)) + " " + "L" + " " + (location.startX + (style.height / 2) + (elementspace / 4)) + " " + (location.startY + (style.height / 2)) + " " + "Z";

                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'd': path,
                    'lgndCtx': true
                };

                svgRender.drawPath(options, element);

                return (location.startX - (style.width / 2) - (elementspace / 4));

            },
            _drawStepArea: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var elementspace = symbolStyle.ElementSpace;
                var path;

                path = "M" + " " + (location.startX + (-style.width / 2) + (-elementspace / 4)) + " " + (location.startY + (style.height / 2)) + " " + "L" + " " + (location.startX + (-style.width / 2) + (-elementspace / 4)) + " " + (location.startY + (-style.height / 2)) + " " + "L" + " " + (location.startX - (style.width / 4)) + " " + (location.startY - (style.height / 2)) + " " + "L" + " " + (location.startX - (style.width / 4)) + " " + (location.startY - (style.height / 4)) + " " + "L" + " " + (location.startX + (style.width / 4)) + " " + (location.startY - (style.height / 4)) + " " + "L" + " " + (location.startX + (style.width / 4)) + " " + (location.startX) + " " + "L" + " " + (location.startX + (style.width / 2) + (elementspace / 4)) + " " + (location.startY) + " " + "L" + " " + (location.startX + (style.width / 2) + (elementspace / 4)) + " " + (location.startY + (style.height / 2)) + " " + "Z";
                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'd': path,
                    'lgndCtx': true
                };

                svgRender.drawPath(options, element);

                return (location.startX + (-style.width / 2) + (-elementspace / 4));

            },
            _drawPyramid: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var elementspace = symbolStyle.ElementSpace;
                var path;
                path = "M" + " " + (location.startX + (-style.width / 2) + (-elementspace / 4)) + " " + (location.startY + (style.height / 2) + (elementspace / 8)) + " " + "L" + " " + (location.startX) + " " + (location.startY + (-style.height / 2) + (-elementspace / 8)) + " " + "L" + " " + (location.startX + (style.width / 2) + (elementspace / 4)) + " " + (location.startY + (style.height / 2) + (elementspace / 8)) + " " + "Z";

                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'd': path,
                    'lgndCtx': true
                };

                svgRender.drawPath(options, element);

                return (location.startX + (-style.width / 2) + (-elementspace / 4));


            },
            _drawFunnel: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var elementspace = symbolStyle.ElementSpace;
                var path;
                path = "M" + " " + (location.startX + (-style.width / 2) + (-elementspace / 5)) + " " + (location.startY + (-style.height / 2) + (-elementspace / 4)) + " " + "L" + " " + (location.startX + (-style.width / 5)) + " " + (location.startY + (style.height / 4)) + " " + "L" + " " + (location.startX + (-style.width / 5)) + " " + (location.startY + (style.height / 2) + (elementspace / 4)) + " " + "L" + " " + (location.startX + (style.width / 5)) + " " + (location.startY + (style.height / 2) + (elementspace / 4)) + " " + "L" + " " + (location.startX + (style.width / 5)) + " " + (location.startY + (style.height / 4)) + " " + "L" + " " + (location.startX + (style.width / 2) + (elementspace / 5)) + " " + (location.startY + (-style.height / 2) + (-elementspace / 4)) + " " + "Z";

                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'd': path,
                    'lgndCtx': true
                };

                svgRender.drawPath(options, element);

                return (location.startX + (-style.width / 2) + (-elementspace / 5));

            },
            _drawCandle: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var elementspace = symbolStyle.ElementSpace;
                var path;

                path = "M" + " " + (location.startX + (-style.width / 2)) + " " + (location.startY + (style.height / 4) + (elementspace / 8)) + " " + "L" + " " + (location.startX + (style.width / 2)) + " " + (location.startY + (style.height / 4) + (elementspace / 8)) + " " + "L" + " " + (location.startX + (style.width / 2)) + " " + (location.startY + (-style.height / 2) + (elementspace / 8)) + " " + "L" + " " + (location.startX + (-style.width / 2)) + " " + (location.startY + (-style.height / 2) + (elementspace / 8)) + " " + "Z" + " " + "M" + " " + (location.startX) + " " + (location.startY + (-style.height / 2) + (elementspace / 8)) + " " + "L" + " " + (location.startX) + " " + (location.startY + (-style.height / 2) + (-elementspace / 4)) + " " + "M" + " " + (location.startX) + " " + (location.startY + (style.height / 4) + (elementspace / 8)) + " " + "L" + " " + (location.startX) + " " + (location.startY + (style.height / 4) + (elementspace / 2));
                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.Color,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'd': path,
                    'lgndCtx': true
                };

                svgRender.drawPath(options, element);

                return (location.startX + (-style.width / 2));

            },
            _drawHilo: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var elementspace = symbolStyle.ElementSpace;
                var path;
                path = "M" + " " + (location.startX + (style.width / 2)) + " " + (location.startY + (style.height / 2) + (elementspace / 4)) + " " + "L" + " " + (location.startX + (style.width / 2)) + " " + (location.startY + (-style.height / 2) + (-elementspace / 4));
                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.Color,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'd': path,
                    'lgndCtx': true
                };

                svgRender.drawPath(options, element);

                return (location.startX + (style.width / 2));

            },
            _drawHiloOpenClose: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var cartesian = polarToCartesian(18, 12, 4.0710678118654755, 270);
                var elementspace = symbolStyle.ElementSpace;
                var path;

                path = "M" + " " + (location.startX) + " " + (location.startY - 3 * (style.height / 10)) + " " + "L" + " " + (location.startX - (style.width / 2) - (elementspace / 4)) + " " + (location.startY - 3 * (style.height / 10)) + " " + "M" + " " + (location.startX) + " " + (location.startY - (style.height / 2) - (elementspace / 4)) + " " + "L" + " " + (location.startX) + " " + (location.startY + (style.height / 2) + (elementspace / 4)) + " " + "M" + " " + (location.startX) + " " + (location.startY + 3 * (style.height / 10)) + " " + "L" + " " + (location.startX + (style.width / 2) + (elementspace / 4)) + " " + (location.startY + 3 * (style.height / 10));
                var options = {
                    'id': symbolStyle.ID,
                    'fill': "transparent",
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.Color,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'd': path,
                    'lgndCtx': true
                };

                svgRender.drawPath(options, element);

                return ((location.startX) - (style.width / 2));

            },

            _drawDoughnut: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var elementspace = symbolStyle.ElementSpace;
                var radius = Math.sqrt(style.height * style.width) / 2;
                radius = radius + (elementspace / 5);
                var cartesianlarge = polarToCartesian(location.startX, location.startY, radius, 270);
                var cartesiansmall = polarToCartesian(location.startX + (style.width / 10), location.startY, radius, 270);
                var elementspace = symbolStyle.ElementSpace;
                path = "M" + " " + location.startX + " " + location.startY + " " + "L" + " " + (location.startX + radius) + " " + (location.startY) + " " + "A" + " " + (radius) + " " + (radius) + " " + 0 + " " + 1 + " " + 1 + " " + cartesianlarge[0] + " " + cartesianlarge[1] + " " + "Z" + " " + "M" + " " + (location.startX + (style.width / 10)) + " " + (location.startY - (style.height / 10)) + " " + "L" + (location.startX + (radius)) + " " + (location.startY - style.height / 10) + " " + "A" + " " + (radius) + " " + (radius) + " " + 0 + " " + 0 + " " + 0 + " " + cartesiansmall[0] + " " + cartesiansmall[1] + " " + "Z";

                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'd': path,
                    'lgndCtx': true
                };
                var circle = {
                    'id': symbolStyle.ID, 'cx': location.startX, 'cy': location.startY, 'r': (radius / 2), 'lgndCtx': true,
                    'fill': "white", 'stroke-width': symbolStyle.Style.BorderWidth, 'stroke': symbolStyle.Style.BorderColor, 'opacity': symbolStyle.Style.Opacity, 'visibility': symbolStyle.Style.Visibility
                };

                svgRender.drawPath(options, element);
                svgRender.drawCircle(circle, element);

                return (location.startX - radius);
            },

            _drawPie: function (location, symbolStyle, sender, element) {
                var svgRender = sender.svgRenderer;
                var svgObj = sender.svgObject;
                var style = symbolStyle.ShapeSize;
                var elementspace = symbolStyle.ElementSpace;
                var radius = Math.sqrt(style.height * style.width) / 2;
                radius = radius + (elementspace / 5);
                var cartesianlarge = polarToCartesian(location.startX, location.startY, radius, 270);
                var cartesiansmall = polarToCartesian(location.startX + (style.width / 10), location.startY, radius, 270);
                var elementspace = symbolStyle.ElementSpace;
                path = "M" + " " + location.startX + " " + location.startY + " " + "L" + " " + (location.startX + radius) + " " + (location.startY) + " " + "A" + " " + (radius) + " " + (radius) + " " + 0 + " " + 1 + " " + 1 + " " + cartesianlarge[0] + " " + cartesianlarge[1] + " " + "Z" + " " + "M" + " " + (location.startX + (style.width / 10)) + " " + (location.startY - (style.height / 10)) + " " + "L" + (location.startX + (radius)) + " " + (location.startY - style.height / 10) + " " + "A" + " " + (radius) + " " + (radius) + " " + 0 + " " + 0 + " " + 0 + " " + cartesiansmall[0] + " " + cartesiansmall[1] + " " + "Z";

                var options = {
                    'id': symbolStyle.ID,
                    'fill': symbolStyle.Style.Color,
                    'stroke-width': symbolStyle.Style.BorderWidth,
                    'stroke': symbolStyle.Style.BorderColor,
                    'opacity': symbolStyle.Style.Opacity,
                    'visibility': symbolStyle.Style.Visibility,
                    'd': path,
                    'lgndCtx': true
                };

                svgRender.drawPath(options, element);
                return (location.startX - radius);
            }

        };
    function polarToCartesian(startX, startY, radius, angleInDegrees) {
        var angleInRadians = angleInDegrees * Math.PI / 180.0;
        var x = startX + radius * Math.cos(angleInRadians);
        var y = startY + radius * Math.sin(angleInRadians);
        return [x, y];
    }
    ej.EjSvgRender.seriesPalette = {
        defaultMetro: ["#E94649", "#F6B53F", "#6FAAB0", "#C4C24A", "#FB954F", "#005277", "#8BC652", "#69D2E7", "#E27F2D", "#6A4B82"],
        defaultHighContrast: ["#F93A00", "#44E2D6", "#DDD10D", "#0AA368", "#0556CB", "#AB40B2", "#5F930A", "#D12E41", "#E0670E", "#008FFF"],
        defaultOffice: ["#005277", "#8BC652", "#6A4B82", "#E94649", "#6FAAB0", "#F7B74F", "#C4C24A", "#EF863F", "#69D2E7", "#FFD13E"],
        defaultMaterial: ["#663AB6", "#EB3F79", "#F8AB1D", "#B82E3D", "#049CB1", "#F2424F", "#C2C924", "#3DA046", "#074D67", "#02A8F4"],
        defaultGradient:
            {
                borderColors: ["#F34649", "#F6D321", "#6EB9B0", "#CBC26A", "#FBAF4F", "#E2CDB1", "#FFC0B7", "#68E1E6", "#E1A62D", "#9C6EBF"],
                seriesColors: [[{ color: "#F34649", colorStop: "0%" }, { color: "#B74143", colorStop: "100%" }],
                [{ color: "#F6D321", colorStop: "0%" }, { color: "#F6AE26", colorStop: "100%" }],
                [{ color: "#6EB9B0", colorStop: "0%" }, { color: "#3F77BD", colorStop: "100%" }],
                [{ color: "#CBC26A", colorStop: "0%" }, { color: "#9AAD21", colorStop: "100%" }],
                [{ color: "#FBAF4F", colorStop: "0%" }, { color: "#F07542", colorStop: "100%" }],
                [{ color: "#E2CDB1", colorStop: "0%" }, { color: "#AAA089", colorStop: "100%" }],
                [{ color: "#8BC652", colorStop: "0%" }, { color: "#6F9E41", colorStop: "100%" }],
                [{ color: "#68E1E6", colorStop: "0%" }, { color: "#3D9CBE", colorStop: "100%" }],
                [{ color: "#E1A62D", colorStop: "0%" }, { color: "#B66824", colorStop: "100%" }],
                [{ color: "#9C6EBF", colorStop: "0%" }], [{ color: "#593F6D", colorStop: "100%" }]]
            },
        blueMetro: ["#005378", "#006691", "#007EB5", "#0D97D4", "#00AEFF", "#14B9FF", "#54CCFF", "#87DBFF", "#ADE5FF", "#C5EDFF"],
        blueGradient:
            {
                seriesColors: [[{ color: "#005277", colorStop: "0%" }, { color: "#00304F", colorStop: "100%" }],
                [{ color: "#006590", colorStop: "0%" }, { color: "#004068", colorStop: "100%" }],
                [{ color: "#007DB4", colorStop: "0%" }, { color: "#00558B", colorStop: "100%" }],
                [{ color: "#0D97D4", colorStop: "0%" }, { color: "#057FC7", colorStop: "100%" }],
                [{ color: "#00ADFE", colorStop: "0%" }, { color: "#008BE9", colorStop: "100%" }],
                [{ color: "#14B8FE", colorStop: "0%" }, { color: "#0798EB", colorStop: "100%" }],
                [{ color: "#53CBFF", colorStop: "0%" }, { color: "#35AFEB", colorStop: "100%" }],
                [{ color: "#86DAFF", colorStop: "0%" }, { color: "#64C0EC", colorStop: "100%" }],
                [{ color: "#ACE5FF", colorStop: "0%" }, { color: "#8DCEED", colorStop: "100%" }],
                [{ color: "#C4ECFF", colorStop: "0%" }], [{ color: "#A3D1E6", colorStop: "100%" }]],
                borderColors: ["#005277", "#006590", "#007DB4", "#0D97D4", "#00ADFE", "#14B8FE", "#53CBFF", "#86DAFF", "#ACE5FF", "#C4ECFF"]
            },
        greenMetro: ["#496612", "#597B15", "#709A1B", "#87B62A", "#9AD926", "#A6DC37", "#BCE654", "#C8E780", "#D5EFA5", "#E2F3BE"],
        greenGradient:
            {

                seriesColors: [[{ color: "#5C7F16", colorStop: "0%" }, { color: "#384C08", colorStop: "100%" }],
                [{ color: "#6A9319", colorStop: "0%" }, { color: "#486009", colorStop: "100%" }],
                [{ color: "#739D1C", colorStop: "0%" }, { color: "#57760B", colorStop: "100%" }],
                [{ color: "#90B546", colorStop: "0%" }, { color: "#6E9215", colorStop: "100%" }],
                [{ color: "#9AD826", colorStop: "0%" }, { color: "#75A010", colorStop: "100%" }],
                [{ color: "#A5DB36", colorStop: "0%" }, { color: "#8EB91D", colorStop: "100%" }],
                [{ color: "#BBE554", colorStop: "0%" }, { color: "#A4C849", colorStop: "100%" }],
                [{ color: "#C8E780", colorStop: "0%" }, { color: "#B4D072", colorStop: "100%" }],
                [{ color: "#D4EEA5", colorStop: "0%" }, { color: "#BFD593", colorStop: "100%" }],
                [{ color: "#E1F2BD", colorStop: "0%" }], [{ color: "#C8D7A8", colorStop: "100%" }]],
                borderColors: ["#5C7F16", "#6A9319", "#739D1C", "#90B546", "#9AD826", "#A5DB36", "#BBE554", "#C8E780", "#D4EEA5", "#E1F2BD"]
            },

        sandleMetro: ["#6C450C", "#82520D", "#A36812", "#C07F1F", "#E69719", "#E89A2B", "#EEB564", "#F3CB93", "#F7DEB4", "#F9E6CA"],
        sandleGradient:
            {


                seriesColors: [[{ color: "#7F602F", colorStop: "0%" }, { color: "#512D04", colorStop: "100%" }],
                [{ color: "#986827", colorStop: "0%" }, { color: "#673803", colorStop: "100%" }],
                [{ color: "#A16C1F", colorStop: "0%" }, { color: "#8A4B05", colorStop: "100%" }],
                [{ color: "#BF812A", colorStop: "0%" }, { color: "#AD630D", colorStop: "100%" }],
                [{ color: "#E49519", colorStop: "0%" }, { color: "#B86607", colorStop: "100%" }],
                [{ color: "#E7992A", colorStop: "0%" }, { color: "#D7780D", colorStop: "100%" }],
                [{ color: "#EDB463", colorStop: "0%" }, { color: "#D98F31", colorStop: "100%" }],
                [{ color: "#F2CA92", colorStop: "0%" }, { color: "#DAAC6F", colorStop: "100%" }],
                [{ color: "#F6DDB3", colorStop: "0%" }, { color: "#DABE8F", colorStop: "100%" }],
                [{ color: "#F8E5C9", colorStop: "0%" }], [{ color: "#DDBE92", colorStop: "100%" }]],
                borderColors: ["#7F602F", "#986827", "#A16C1F", "#BF812A", "#E49519", "#E7992A", "#EDB463", "#F2CA92", "#F6DDB3", "#F8E5C9"]

            }
    };

    ej.EjSvgRender.themes = {
        flatlight:
            {
                highlightColor: 'black',

                background: 'transparent',
                legend:
                    {
                        font: { color: "#282828" },
                        title:
                            {
                                font: { color: "#282828" }
                            }
                    },
                title:
                    {
                        font: { color: '#565656' },
                        subTitle:
                            {
                                font: { color: '#565656' }
                            }
                    },
                primaryXAxis:
                    {
                        majorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        majorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        minorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        minorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        labelBorder:
                            {
                                color: "#8E8E8E"
                            },
                        multiLevelLabelsColor: "#8E8E8E",
                        multiLevelLabelsFontColor: "#282828",
                        axisLine: { color: '#8E8E8E' },
                        font: { color: '#282828' },
                        title:
                            {
                                font: { color: '#282828' }
                            },
                        crosshairLabel: { rx: 3, ry: 3, border: { color: '#3D3D3D', width: 1 }, fill: '#3D3D3D', font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#DBDBDB' } }
                    },
                secondaryX:
                    {
                        majorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        majorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        minorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        minorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        labelBorder:
                            {
                                color: "#8E8E8E"
                            },
                        multiLevelLabelsColor: "#8E8E8E",
                        multiLevelLabelsFontColor: "#282828",
                        axisLine: { color: '#8E8E8E' },
                        font: { color: '#282828' },
                        title:
                            {
                                font: { color: '#282828' }
                            },
                        crosshairLabel: { rx: 3, ry: 3, border: { color: '#3D3D3D', width: 1 }, fill: '#3D3D3D', font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#DBDBDB' } }
                    },

                primaryYAxis:
                    {
                        majorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        majorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        minorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        minorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        labelBorder: {
                            color: "#8E8E8E"
                        },
                        multiLevelLabelsColor: "#8E8E8E",
                        multiLevelLabelsFontColor: "#282828",
                        axisLine: { color: '#8E8E8E' },
                        font: { color: '#282828' },
                        title:
                            {
                                font: { color: '#282828' }
                            },
                        crosshairLabel: { rx: 3, ry: 3, border: { color: '#3D3D3D', borderWidth: 1 }, fill: '#3D3D3D', font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#DBDBDB' } }
                    },
                secondaryY:
                    {
                        majorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        majorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        minorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        minorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        labelBorder: {
                            color: "#8E8E8E"
                        },
                        multiLevelLabelsColor: "#8E8E8E",
                        multiLevelLabelsFontColor: "#282828",
                        axisLine: { color: '#8E8E8E' },
                        font: { color: '#282828' },
                        title:
                            {
                                font: { color: '#282828' }
                            },
                        crosshairLabel: { rx: 3, ry: 3, border: { color: '#3D3D3D', width: 1 }, fill: '#3D3D3D', font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#DBDBDB' } }
                    },
                commonSeriesOptions:
                    {
                        marker: {
                            dataLabel: { font: { color: '#565656' } }
                        },
                        errorBar: {
                            fill: "#000000",
                            cap:
                                {
                                    fill: "#000000"
                                }
                        },
                        connectorLine: { color: '#565656' }
                    },
                crosshair:
                    {
                        line:
                            {
                                width: 1,
                                color: 'Black'
                            }
                    },

                seriesBorderDefaultColors: ej.EjSvgRender.seriesPalette.defaultMetro,
                colors: ej.EjSvgRender.seriesPalette.defaultMetro

            },

        flatdark:
            {
                highlightColor: 'white',

                background: '#111111',

                legend:
                    {
                        font: { color: "#C9C9C9" },
                        title:
                            {
                                font: { color: "#C9C9C9" }
                            }
                    },
                title:
                    {
                        font: { color: '#C9C9C9' },
                        subTitle:
                            {
                                font: { color: '#C9C9C9' }
                            }
                    },
                primaryXAxis:
                    {
                        majorGridLines:
                            {
                                color: "#333333"
                            },
                        majorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        minorGridLines:
                            {
                                color: "#333333"
                            },
                        minorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        labelBorder: {
                            color: "#AAAAAA"
                        },
                        multiLevelLabelsColor: "#AAAAAA",
                        multiLevelLabelsFontColor: "#C9C9C9",
                        axisLine: { color: '#AAAAAA' },
                        font: { color: '#C9C9C9' },
                        title:
                            {

                                font: { color: '#C9C9C9' }
                            },
                        crosshairLabel: { rx: 0, ry: 0, fill: '#B5B5B5', border: { color: '#B5B5B5', width: 1 }, font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#444444' } }
                    },
                secondaryX:
                    {
                        majorGridLines:
                            {
                                color: "#333333"
                            },
                        majorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        minorGridLines:
                            {
                                color: "#333333"
                            },
                        minorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        labelBorder: {
                            color: "#AAAAAA"
                        },
                        multiLevelLabelsColor: "#AAAAAA",
                        multiLevelLabelsFontColor: "#C9C9C9",
                        axisLine: { color: '#AAAAAA' },
                        font: { color: '#C9C9C9' },
                        title:
                            {

                                font: { color: '#C9C9C9' }
                            },
                        crosshairLabel: { rx: 0, ry: 0, fill: '#B5B5B5', border: { color: '#B5B5B5', width: 1 }, font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#444444' } }
                    },
                primaryYAxis:
                    {
                        majorGridLines:
                            {
                                color: "#333333"
                            },
                        majorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        minorGridLines:
                            {
                                color: "#333333"
                            },
                        minorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        labelBorder: {
                            color: "#AAAAAA"
                        },
                        multiLevelLabelsColor: "#AAAAAA",
                        multiLevelLabelsFontColor: "#C9C9C9",
                        axisLine: { color: '#AAAAAA' },
                        font: { color: '#C9C9C9' },
                        title:
                            {

                                font: { color: '#C9C9C9' }
                            },
                        crosshairLabel: { rx: 0, ry: 0, fill: '#B5B5B5', border: { color: '#B5B5B5', width: 1 }, font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#444444' } }
                    },
                secondaryY:
                    {
                        majorGridLines:
                            {
                                color: "#333333"
                            },
                        majorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        minorGridLines:
                            {
                                color: "#333333"
                            },
                        minorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        labelBorder: {
                            color: "#AAAAAA"
                        },
                        multiLevelLabelsColor: "#AAAAAA",
                        multiLevelLabelsFontColor: "#C9C9C9",
                        axisLine: { color: '#AAAAAA' },
                        font: { color: '#C9C9C9' },
                        title:
                            {

                                font: { color: '#C9C9C9' }
                            },
                        crosshairLabel: { rx: 0, ry: 0, fill: '#B5B5B5', border: { color: '#B5B5B5', width: 1 }, font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#444444' } }
                    },
                commonSeriesOptions:
                    {
                        marker: {
                            dataLabel: { font: { color: '#C9C9C9' } }
                        },
                        errorBar: {
                            fill: "#ffffff",
                            cap:
                                {
                                    fill: "#ffffff"
                                }
                        },
                        connectorLine: { color: '#C9C9C9' }
                    },
                crosshair:
                    {
                        line:
                            {
                                width: 1,
                                color: 'White'
                            }
                    },

                seriesBorderDefaultColors: ej.EjSvgRender.seriesPalette.defaultMetro,
                colors: ej.EjSvgRender.seriesPalette.defaultMetro

            },


        gradientlight:
            {
                highlightColor: 'black',

                background: 'transparent',
                legend:
                    {
                        font: { color: "#282828" },
                        title:
                            {
                                font: { color: "#282828" }
                            }
                    },
                title:
                    {
                        font: { color: '#565656' },
                        subTitle:
                            {
                                font: { color: '#565656' }
                            }
                    },
                primaryXAxis:
                    {
                        majorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        majorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        minorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        minorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        labelBorder: {
                            color: "#8E8E8E"
                        },
                        multiLevelLabelsColor: "#8E8E8E",
                        multiLevelLabelsFontColor: "#282828",
                        axisLine: { color: '#8E8E8E' },
                        font: { color: '#282828' },
                        title:
                            {

                                font: { color: '#282828' }
                            },
                        crosshairLabel: { rx: 3, ry: 3, fill: '#3D3D3D', border: { color: '#3D3D3D', width: 2 }, font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#DBDBDB' } }
                    },
                secondaryX:
                    {
                        majorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        majorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        minorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        minorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        labelBorder: {
                            color: "#8E8E8E"
                        },
                        multiLevelLabelsColor: "#8E8E8E",
                        multiLevelLabelsFontColor: "#282828",
                        axisLine: { color: '#8E8E8E' },
                        font: { color: '#282828' },
                        title:
                            {

                                font: { color: '#282828' }
                            },
                        crosshairLabel: { rx: 3, ry: 3, fill: '#3D3D3D', border: { color: '#3D3D3D', width: 2 }, font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#DBDBDB' } }
                    },
                primaryYAxis:
                    {
                        majorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        majorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        minorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        minorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        labelBorder: {
                            color: "#8E8E8E"
                        },
                        multiLevelLabelsColor: "#8E8E8E",
                        multiLevelLabelsFontColor: "#282828",
                        axisLine: { color: '#8E8E8E' },
                        font: { color: '#282828' },
                        title:
                            {

                                font: { color: '#282828' }
                            },
                        crosshairLabel: { rx: 3, ry: 3, fill: '#3D3D3D', border: { color: '#3D3D3D', width: 2 }, font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#DBDBDB' } }
                    },
                secondaryY:
                    {
                        majorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        majorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        minorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        minorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        labelBorder: {
                            color: "#8E8E8E"
                        },
                        multiLevelLabelsColor: "#8E8E8E",
                        multiLevelLabelsFontColor: "#282828",
                        axisLine: { color: '#8E8E8E' },
                        font: { color: '#282828' },
                        title:
                            {

                                font: { color: '#282828' }
                            },
                        crosshairLabel: { rx: 3, ry: 3, fill: '#3D3D3D', border: { color: '#3D3D3D', width: 2 }, font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#DBDBDB' } }
                    },
                commonSeriesOptions:
                    {
                        marker: {
                            dataLabel: { font: { color: '#565656' } }
                        },
                        errorBar: {
                            fill: "#000000",
                            cap:
                                {
                                    fill: "#000000"
                                }
                        },
                        connectorLine: { color: '#565656' }
                    },
                crosshair:
                    {
                        line:
                            {
                                width: 1,
                                color: 'Black'
                            }
                    },

                seriesBorderDefaultColors: ej.EjSvgRender.seriesPalette.defaultGradient.borderColors,
                colors: ej.EjSvgRender.seriesPalette.defaultGradient.seriesColors

            },

        gradientdark:
            {
                highlightColor: 'white',

                background: '#111111',
                legend:
                    {
                        font: { color: "#C9C9C9" },
                        title:
                            {
                                font: { color: "#C9C9C9" }
                            }
                    },
                title:
                    {
                        font: { color: '#C9C9C9' },
                        subTitle:
                            {
                                font: { color: '#C9C9C9' }
                            }
                    },
                primaryXAxis:
                    {
                        majorGridLines:
                            {
                                color: "#333333"
                            },
                        majorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        minorGridLines:
                            {
                                color: "#333333"
                            },
                        minorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        labelBorder: {
                            color: "#AAAAAA"
                        },
                        multiLevelLabelsColor: "#AAAAAA",
                        multiLevelLabelsFontColor: "#C9C9C9",
                        axisLine: { color: '#AAAAAA' },
                        font: { color: '#C9C9C9' },
                        title:
                            {

                                font: { color: '#C9C9C9' }
                            },
                        crosshairLabel: { rx: 3, ry: 3, fill: '#B5B5B5', border: { color: '#B5B5B5', width: 2 }, font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#444444' } }
                    },
                secondaryX:
                    {
                        majorGridLines:
                            {
                                color: "#333333"
                            },
                        majorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        minorGridLines:
                            {
                                color: "#333333"
                            },
                        minorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        labelBorder: {
                            color: "#AAAAAA"
                        },
                        multiLevelLabelsColor: "#AAAAAA",
                        multiLevelLabelsFontColor: "#C9C9C9",
                        axisLine: { color: '#AAAAAA' },
                        font: { color: '#C9C9C9' },
                        title:
                            {

                                font: { color: '#C9C9C9' }
                            },
                        crosshairLabel: { rx: 3, ry: 3, fill: '#B5B5B5', border: { color: '#B5B5B5', width: 2 }, font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#444444' } }
                    },
                primaryYAxis:
                    {
                        majorGridLines:
                            {
                                color: "#333333"
                            },
                        majorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        minorGridLines:
                            {
                                color: "#333333"
                            },
                        minorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        labelBorder: {
                            color: "#AAAAAA"
                        },
                        multiLevelLabelsColor: "#AAAAAA",
                        multiLevelLabelsFontColor: "#C9C9C9",
                        axisLine: { color: '#AAAAAA' },
                        font: { color: '#C9C9C9' },
                        title:
                            {

                                font: { color: '#C9C9C9' }
                            },
                        crosshairLabel: { rx: 3, ry: 3, fill: '#B5B5B5', border: { color: '#B5B5B5', width: 2 }, font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#444444' } }
                    },
                secondaryY:
                    {
                        majorGridLines:
                            {
                                color: "#333333"
                            },
                        majorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        minorGridLines:
                            {
                                color: "#333333"
                            },
                        minorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        labelBorder: {
                            color: "#AAAAAA"
                        },
                        multiLevelLabelsColor: "#AAAAAA",
                        multiLevelLabelsFontColor: "#C9C9C9",
                        axisLine: { color: '#AAAAAA' },
                        font: { color: '#C9C9C9' },
                        title:
                            {

                                font: { color: '#C9C9C9' }
                            },
                        crosshairLabel: { rx: 3, ry: 3, fill: '#B5B5B5', border: { color: '#B5B5B5', width: 2 }, font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#444444' } }
                    },
                commonSeriesOptions:
                    {
                        marker: {
                            dataLabel: { font: { color: '#C9C9C9' } }
                        },
                        errorBar: {
                            fill: "#ffffff",
                            cap:
                                {
                                    fill: "#ffffff"
                                }
                        },
                        connectorLine: { color: "#C9C9C9" }
                    },

                crosshair:
                    {
                        line:
                            {
                                width: 1,
                                color: 'White'
                            }
                    },

                seriesBorderDefaultColors: ej.EjSvgRender.seriesPalette.defaultGradient.borderColors,
                colors: ej.EjSvgRender.seriesPalette.defaultGradient.seriesColors

            },

        highcontrast01:
            {
                highlightColor: 'white',

                background: '#111111',
                legend:
                    {
                        font: { color: '#ffffff' },
                        title:
                            {
                                font: { color: '#ffffff' }
                            }
                    },
                title:
                    {
                        font: { color: '#ffffff' },
                        subTitle:
                            {
                                font: { color: '#ffffff' }
                            }
                    },
                primaryXAxis:
                    {
                        majorGridLines:
                            {
                                color: "#333333"
                            },
                        majorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        minorGridLines:
                            {
                                color: "#333333"
                            },
                        minorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        labelBorder: {
                            color: "#AAAAAA"
                        },
                        multiLevelLabelsColor: "#AAAAAA",
                        multiLevelLabelsFontColor: "#ffffff",
                        axisLine: { color: '#AAAAAA' },
                        font: { color: '#ffffff' },
                        title:
                            {

                                font: { color: '#ffffff' }
                            },
                        crosshairLabel: { rx: 3, ry: 3, fill: '#B5B5B5', border: { color: '#B5B5B5', width: 2 }, font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#444444' } }
                    },
                secondaryX:
                    {
                        majorGridLines:
                            {
                                color: "#333333"
                            },
                        majorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        minorGridLines:
                            {
                                color: "#333333"
                            },
                        minorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        axisLine: { color: '#AAAAAA' },
                        font: { color: '#ffffff' },
                        title:
                            {

                                font: { color: '#ffffff' }
                            },
                        crosshairLabel: { rx: 3, ry: 3, fill: '#B5B5B5', border: { color: '#B5B5B5', width: 2 }, font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#444444' } }
                    },
                primaryYAxis:
                    {
                        majorGridLines:
                            {
                                color: "#333333"
                            },
                        majorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        minorGridLines:
                            {
                                color: "#333333"
                            },
                        minorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        labelBorder: {
                            color: "#AAAAAA"
                        },
                        multiLevelLabelsColor: "#AAAAAA",
                        multiLevelLabelsFontColor: "#ffffff",
                        axisLine: { color: '#AAAAAA' },
                        font: { color: '#ffffff' },
                        title:
                            {

                                font: { color: '#ffffff' }
                            },
                        crosshairLabel: { rx: 3, ry: 3, fill: '#B5B5B5', border: { color: '#B5B5B5', width: 2 }, font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#444444' } }
                    },
                secondaryY:
                    {
                        majorGridLines:
                            {
                                color: "#333333"
                            },
                        majorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        minorGridLines:
                            {
                                color: "#333333"
                            },
                        minorTickLines:
                            {
                                color: "#AAAAAA"
                            },
                        axisLine: { color: '#AAAAAA' },
                        font: { color: '#ffffff' },
                        title:
                            {

                                font: { color: '#ffffff' }
                            },
                        crosshairLabel: { rx: 3, ry: 3, fill: '#B5B5B5', border: { color: '#B5B5B5', width: 2 }, font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#444444' } }
                    },
                commonSeriesOptions:
                    {
                        marker: {
                            dataLabel: { font: { color: '#ffffff' } }
                        },
                        errorBar: {
                            fill: "#ffffff",
                            cap:
                                {
                                    fill: "#ffffff"
                                }
                        },
                        connectorLine: { color: "#C9C9C9" }
                    },

                crosshair:
                    {
                        line:
                            {
                                width: 1,
                                color: 'White'
                            }
                    },

                seriesBorderDefaultColors: ej.EjSvgRender.seriesPalette.defaultHighContrast,
                colors: ej.EjSvgRender.seriesPalette.defaultHighContrast

            },
        material:
            {
                highlightColor: 'black',

                background: 'transparent',
                legend:
                    {
                        font: { color: "#333333" },
                        title:
                            {
                                font: { color: "#333333" }
                            }
                    },
                title:
                    {
                        font: { color: '#333333' },
                        subTitle:
                            {
                                font: { color: '#333333' }
                            }
                    },
                primaryXAxis:
                    {
                        majorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        majorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        minorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        minorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        labelBorder:
                            {
                                color: "#8E8E8E"
                            },
                        multiLevelLabelsColor: "#8E8E8E",
                        multiLevelLabelsFontColor: "#333333",
                        axisLine: { color: '#8E8E8E' },
                        font: { color: '#333333' },
                        title:
                            {
                                font: { color: '#333333' }
                            },
                        crosshairLabel: { rx: 0, ry: 0, border: { color: '#3D3D3D', width: 1 }, fill: '#3D3D3D', font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#DBDBDB' } }
                    },
                secondaryX:
                    {
                        majorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        majorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        minorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        minorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        axisLine: { color: '#8E8E8E' },
                        font: { color: '#333333' },
                        title:
                            {
                                font: { color: '#333333' }
                            },
                        crosshairLabel: { rx: 0, ry: 0, border: { color: '#3D3D3D', width: 1 }, fill: '#3D3D3D', font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#DBDBDB' } }
                    },

                primaryYAxis:
                    {
                        majorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        majorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        minorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        minorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        labelBorder:
                            {
                                color: "#8E8E8E"
                            },
                        multiLevelLabelsColor: "#8E8E8E",
                        multiLevelLabelsFontColor: "#333333",
                        axisLine: { color: '#8E8E8E' },
                        font: { color: '#333333' },
                        title:
                            {
                                font: { color: '#333333' }
                            },
                        crosshairLabel: { rx: 0, ry: 0, border: { color: '#3D3D3D', borderWidth: 1 }, fill: '#3D3D3D', font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#DBDBDB' } }
                    },
                secondaryY:
                    {
                        majorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        majorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        minorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        minorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        axisLine: { color: '#8E8E8E' },
                        font: { color: '#333333' },
                        title:
                            {
                                font: { color: '#333333' }
                            },
                        crosshairLabel: { rx: 0, ry: 0, border: { color: '#3D3D3D', width: 1 }, fill: '#3D3D3D', font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#DBDBDB' } }
                    },
                commonSeriesOptions:
                    {
                        marker: {
                            dataLabel: { font: { color: '#333333' } }
                        },
                        errorBar: {
                            fill: "#000000",
                            cap:
                                {
                                    fill: "#000000"
                                }
                        },
                        connectorLine: { color: '#565656' }
                    },
                crosshair:
                    {
                        line:
                            {
                                width: 1,
                                color: 'Black'
                            }
                    },

                seriesBorderDefaultColors: ej.EjSvgRender.seriesPalette.defaultMaterial,
                colors: ej.EjSvgRender.seriesPalette.defaultMaterial

            },
        office365:
            {
                highlightColor: 'black',

                background: 'transparent',
                legend:
                    {
                        font: { color: "#333333" },
                        title:
                            {
                                font: { color: "#333333" }
                            }
                    },
                title:
                    {
                        font: { color: '#333333' },
                        subTitle:
                            {
                                font: { color: '#333333' }
                            }
                    },
                primaryXAxis:
                    {
                        majorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        majorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        minorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        minorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        labelBorder:
                            {
                                color: "#8E8E8E"
                            },
                        multiLevelLabelsColor: "#8E8E8E",
                        multiLevelLabelsFontColor: "#333333",
                        axisLine: { color: '#8E8E8E' },
                        font: { color: '#333333' },
                        title:
                            {
                                font: { color: '#333333' }
                            },
                        crosshairLabel: { rx: 0, ry: 0, border: { color: '#3D3D3D', width: 1 }, fill: '#3D3D3D', font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#DBDBDB' } }
                    },
                secondaryX:
                    {
                        majorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        majorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        minorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        minorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        axisLine: { color: '#8E8E8E' },
                        font: { color: '#333333' },
                        title:
                            {
                                font: { color: '#333333' }
                            },
                        crosshairLabel: { rx: 0, ry: 0, border: { color: '#3D3D3D', width: 1 }, fill: '#3D3D3D', font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#DBDBDB' } }
                    },

                primaryYAxis:
                    {
                        majorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        majorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        minorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        minorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        labelBorder:
                            {
                                color: "#8E8E8E"
                            },
                        multiLevelLabelsColor: "#8E8E8E",
                        multiLevelLabelsFontColor: "#333333",
                        axisLine: { color: '#8E8E8E' },
                        font: { color: '#333333' },
                        title:
                            {
                                font: { color: '#333333' }
                            },
                        crosshairLabel: { rx: 0, ry: 0, border: { color: '#3D3D3D', borderWidth: 1 }, fill: '#3D3D3D', font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#DBDBDB' } }
                    },
                secondaryY:
                    {
                        majorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        majorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        minorGridLines:
                            {
                                color: "#DFDFDF"
                            },
                        minorTickLines:
                            {
                                color: "#8E8E8E"
                            },
                        axisLine: { color: '#8E8E8E' },
                        font: { color: '#333333' },
                        title:
                            {
                                font: { color: '#333333' }
                            },
                        crosshairLabel: { rx: 0, ry: 0, border: { color: '#3D3D3D', width: 1 }, fill: '#3D3D3D', font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: '#DBDBDB' } }
                    },
                commonSeriesOptions:
                    {
                        marker: {
                            dataLabel: { font: { color: '#333333' } }
                        },
                        errorBar: {
                            fill: "#000000",
                            cap:
                                {
                                    fill: "#000000"
                                }
                        },
                        connectorLine: { color: '#565656' }
                    },
                crosshair:
                    {
                        line:
                            {
                                width: 1,
                                color: 'Black'
                            }
                    },

                seriesBorderDefaultColors: ej.EjSvgRender.seriesPalette.defaultOffice,
                colors: ej.EjSvgRender.seriesPalette.defaultOffice

            }
    };
    $.extend(ej.EjSvgRender.themes, {

        "azure":
            {

                seriesBorderDefaultColors: ej.EjSvgRender.seriesPalette.blueMetro,
                colors: ej.EjSvgRender.seriesPalette.blueMetro
            },

        "azuredark":
            {
                seriesBorderDefaultColors: ej.EjSvgRender.seriesPalette.blueMetro,
                colors: ej.EjSvgRender.seriesPalette.blueMetro
            },
        "gradient-azure":
            {
                seriesBorderDefaultColors: ej.EjSvgRender.seriesPalette.blueGradient.borderColors,
                colors: ej.EjSvgRender.seriesPalette.blueGradient.seriesColors
            },

        "gradient-azuredark":
            {
                seriesBorderDefaultColors: ej.EjSvgRender.seriesPalette.blueGradient.borderColors,
                colors: ej.EjSvgRender.seriesPalette.blueGradient.seriesColors
            },

        "lime":
            {
                seriesBorderDefaultColors: ej.EjSvgRender.seriesPalette.greenMetro,
                colors: ej.EjSvgRender.seriesPalette.greenMetro
            },

        "limedark":
            {
                seriesBorderDefaultColors: ej.EjSvgRender.seriesPalette.greenMetro,
                colors: ej.EjSvgRender.seriesPalette.greenMetro
            },
        "gradient-lime":
            {
                seriesBorderDefaultColors: ej.EjSvgRender.seriesPalette.greenGradient.borderColors,
                colors: ej.EjSvgRender.seriesPalette.greenGradient.seriesColors
            },

        "gradient-limedark":
            {
                seriesBorderDefaultColors: ej.EjSvgRender.seriesPalette.greenGradient.borderColors,
                colors: ej.EjSvgRender.seriesPalette.greenGradient.seriesColors
            },
        "saffron":
            {
                seriesBorderDefaultColors: ej.EjSvgRender.seriesPalette.sandleMetro,
                colors: ej.EjSvgRender.seriesPalette.sandleMetro
            },

        "saffrondark":
            {
                seriesBorderDefaultColors: ej.EjSvgRender.seriesPalette.sandleMetro,
                colors: ej.EjSvgRender.seriesPalette.sandleMetro
            },
        "gradient-saffron":
            {
                seriesBorderDefaultColors: ej.EjSvgRender.seriesPalette.sandleGradient.borderColors,
                colors: ej.EjSvgRender.seriesPalette.sandleGradient.seriesColors
            },

        "gradient-saffrondark":
            {
                seriesBorderDefaultColors: ej.EjSvgRender.seriesPalette.sandleGradient.borderColors,
                colors: ej.EjSvgRender.seriesPalette.sandleGradient.seriesColors
            }
    });
})(jQuery);