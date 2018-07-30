ej.EjVmlRender = function (element) {
    var doc = document;
    this.vmlNamespace = "urn:schemas-microsoft-com:vml";
    this.vmStyle = "#default#VML";
    doc.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
    this.isdocmode8 = doc.documentMode === 8;
    if (!doc.getElementById("vml_chart")) {
        var cssText
        if (this.isdocmode8) {
            cssText =
                'v\\:fill, v\\:path, v\\:polyline, v\\:line, v\\:rect,v\\:shape,v\\:oval, v\\:stroke' +
                '{ behavior:url(#default#VML); display: inline-block; } ';
        }
        else {
            cssText =
                'v\\:*' +
                '{ behavior:url(#default#VML); display: inline-block; } ';
        }
        var vmlStyleSheet = doc.createStyleSheet();
        vmlStyleSheet.owningElement.id = 'vml_chart';
        vmlStyleSheet.cssText = cssText;
    }
    this._rootId = jQuery(element).attr("id");
    this.svgObj = doc.createElement("div");
    this.svgObj.style.position = 'relative';
    this.svgObj.setAttribute('id', this._rootId + '_vml');
    this.changeOptions = {
        'id': 'id',
        'fill': 'fillcolor', 'stroke': 'strokecolor', 'stroke-width': 'strokeweight', 'd': 'path', 'font-size': 'font-size', 'font-family': 'font-family', 'font-style': 'font-style',
        'font-weight': 'font-weight', 'points': 'points'

    };
};
(function ($) {
    ej.EjVmlRender.prototype = {

        drawPath: function (options, element) {
            var darray = options.d.split(" ");
            if ($.inArray('A', darray) != -1) {
                var w = parseFloat(darray[4]);
                var h = parseFloat(darray[5]);
                options.d = this.drawArc(w, h, options);
            }
            if ($("#" + options.id).length > 0) {
                options.d = this.changePathValue(options.d);
                this.applyVMLStyle($("#" + options.id), options);
            }
            else {
                options.d = this.changePathValue(options.d);
                var shape = document.createElement("v:shape");
                var $shapeEle = $(shape);
                this.applyVMLStyle($shapeEle, options);
                $shapeEle.appendTo(element);
            }
        },
        createLegendSvg: function (element) {
            var doc = document;
            this._rootId = jQuery(element).attr("id");
            this.legendsvgObj = doc.createElement("div");
            this.legendsvgObj.style.position = 'relative';
            this.legendsvgObj.setAttribute('id', "legend_" + this._rootId + '_vml');
            return this.legendsvgObj;
        },

        drawPolyline: function (options, element) {
            var darray = options.points.split(" ");

            if ($("#" + options.id).length > 0) {
                options.points = this.changePathValue(options.points);
                this.applyVMLStyle($("#" + options.id), options);
            }
            else {
                options.points = this.changePathValue(options.points);
                var shape = document.createElement("v:polyline");
                var $shapeEle = $(shape);
                this.applyVMLStyle($shapeEle, options);
                $shapeEle.appendTo(element);
            }
        },
        setFillAttribute: function (element, options) {
            var fill = document.createElement("v:fill");
            var opacity = options["fill-opacity"] ? options["fill-opacity"] : options["opacity"];
            opacity = (!ej.util.isNullOrUndefined(opacity)) ? opacity : (options["opacity"]) ? options["opacity"] : 1;
            var fillcolor = options["fill"];
            if (fillcolor != "none" && !ej.util.isNullOrUndefined(fillcolor)) {

                if (!(fillcolor).match('gradient'))
                    $(element).attr("fillcolor", fillcolor);
                else {
                    var colorName = ((fillcolor).replace('gradient', ""));
                    fill.setAttribute('type', "gradient");
                    fill.setAttribute("colors", colorName);
                }
            }
            else if (fillcolor == 'none') {
                fill.setAttribute('type', "gradient");
                fill.setAttribute('color', options.color);
                fill.setAttribute('color2', options.color2);
                fill.setAttribute('colors', options.colors);
                fill.setAttribute('angle', options.angle);
                opacity = options.fill_opacity;
            }
            else
                opacity = 0.1;


            fill.setAttribute('opacity', opacity);
            $(fill).appendTo(element);
        },
        setStrokeAttribute: function (element, options) {
            var stroke = options['stroke'];
            if (stroke == "transparent")
                options['opacity'] = 0.1;
            if (options.name) {
                $(element).attr('name', options.name);
            }


            var opacity = options["opacity"];
            if (opacity) {
                var fill = document.createElement("v:stroke");



                fill.setAttribute('opacity', opacity);
                $(fill).appendTo(element);
            }
        },
        changePathValue: function (options) {
            if (!options["d"]) {
                var pathArray = options.split(" ");
                for (var i = 0; i < pathArray.length; i++) {
                    var matches = pathArray[i].match(/\d+/g);
                    if (matches != null) {
                        pathArray[i] = Math.round(parseFloat(pathArray[i]));
                    }
                }
                options = pathArray.join(' ');
                return options;
            }
        },


        drawArc: function (w, h, options) {
            var x = 0, y = 0;
            var startAngle = options.start,
                endAngle = options.end,
                endAngle = (Number(Math.PI.toFixed(2)) == Number((endAngle + startAngle).toFixed(2))) ? endAngle - 0.01 : endAngle,
                radius = options.r || w || h,
                cosStart = Math.cos(startAngle),
                sinStart = Math.sin(startAngle),
                cosEnd = Math.cos(endAngle),
                sinEnd = Math.sin(endAngle),
                innerRadius = options.innerR,
                circleCorrection = 0.08 / radius,
                innerCorrection = (innerRadius && 0.1 / innerRadius) || 0,
                path;

            if (endAngle - startAngle === 0) {
                return '';

            } else if (2 * Math.PI - endAngle + startAngle < circleCorrection) {
                cosEnd = -circleCorrection;
            } else if (endAngle - startAngle < innerCorrection) {
                cosEnd = Math.cos(startAngle + innerCorrection);
            }

            path = [
                'wa', // To draw clockwise arc
                x - radius,
                y - radius,
                x + radius,
                y + radius,
                x + radius * cosStart,
                y + radius * sinStart,
                x + radius * cosEnd,
                y + radius * sinEnd
            ];

            if (options.open && !innerRadius) {
                path.push(
                    'e',
                    M,
                    x,
                    y
                );
            }

            path.push(
                // To draw anti clockwise arc
                'at',
                x - innerRadius,
                y - innerRadius,
                x + innerRadius,
                y + innerRadius,
                x + innerRadius * cosEnd,
                y + innerRadius * sinEnd,
                x + innerRadius * cosStart,
                y + innerRadius * sinStart,
                'x',
                'e'
            );
            path = path.join(" ");
            return path;

        },
        changeVMLStyle: function ($element, options) {
            var chart = this;
            var strokeColor = options.stroke;
            $element.css("width", options.width).css("visibility", options.visibility).css("height", options.height).css("position", "absolute").css('left', options.x).css('top', options.y);
            $.each(options, function (index, val) {
                if (chart.changeOptions[index] != null || chart.changeOptions[index] != undefined) {
                    if (index == 'd' || index == 'points') {
                        val = chart.changePathValue(options[index]).toLowerCase();
                    }
                    if (val == 'transparent' && !options.fill_opacity) {
                        options[index] = val = 'white';
                        if (index == "fill" && (!options.hasOwnProperty('opacity') || !options['opacity']))
                            options['opacity'] = 0.1;
                    }
                    if (options.fill_opacity) {
                        options['opacity'] = options.fill_opacity;
                    }
                    if ($element[0].tagName === "SPAN") {
                        if (index == "fill") $element.css('color', val);
                        else {
                            if (index == "id") $element.attr(chart.changeOptions[index], val);
                            else
                                $element.css(chart.changeOptions[index], val);
                        }
                    } else {

                        if (chart.isdocmode8) { // IE8 setAttribute bug
                            $element.get(0)[chart.changeOptions[index]] = val;
                        } else {
                            $element.get(0).setAttribute(chart.changeOptions[index], val);
                        }
                    }
                }
            });
            if (options.hasOwnProperty('fill-opacity') || options.hasOwnProperty('opacity') || options.hasOwnProperty('fill'))
                if (!($element[0].tagName === "SPAN")) {
                    chart.setFillAttribute($element, options);
                    if (options.hasOwnProperty('stroke')) {
                        options.stroke = strokeColor;
                        if (options.fill_opacity) {
                            options['opacity'] = options.fill_opacity;
                        }
                        chart.setStrokeAttribute($element, options);
                    }
                }
        },
        applyVMLStyle: function ($element, options) {

            if ($element[0].tagName !== "SPAN") {
                if (ej.util.isNullOrUndefined(options.width)) options.width = "1000px";
                if (ej.util.isNullOrUndefined(options.height)) options.height = "1000px";
            }
            if (ej.util.isNullOrUndefined(options.x)) options.x = "0px";
            if (ej.util.isNullOrUndefined(options.y)) options.y = "0px";

            this.changeVMLStyle($element, options);
        },
        drawLine: function (options, element) {
            if ($("#" + options.id).length > 0) {
                var from = (options.x1) + ',' + (options.y1);
                var to = (options.x2) + ',' + (options.y2);
                $(options).attr("from", from).attr("to", to);
                this.applyVMLStyle($("#" + options.id), options);
            }
            else {
                var line = document.createElement("v:line");
                var $lineEle = $(line);
                var from = (options.x1) + ',' + (options.y1);
                var to = (options.x2) + ',' + (options.y2);
                $lineEle.attr("from", from).attr("to", to);
                this.applyVMLStyle($lineEle, options);
                $lineEle.appendTo(element);
            }
        },
        //drawPolygon: function (options, element) {

        //},
        drawCircle: function (options, element) {
            if ($("#" + options.id).length > 0) {
                options.x = options.cx - options.r;
                options.y = options.cy - options.r;
                options.width = options.height = (2 * options.r);
                this.applyVMLStyle($("#" + options.id), options);
            }
            else {
                var circle = document.createElement("v:oval");
                var $circleEle = $(circle);
                options.x = options.cx - options.r;
                options.y = options.cy - options.r;
                options.width = options.height = (2 * options.r);
                this.applyVMLStyle($circleEle, options);
                if ($("#" + options.id).length == 0)
                    $circleEle.appendTo(element);
            }
        },

        drawEllipse: function (options, element) {
            if ($("#" + options.id).length > 0) {
                options.x = options.cx - options.rx;
                options.y = options.cy - options.ry;
                options.width = (2 * options.rx);
                options.height = (2 * options.ry);
                this.applyVMLStyle($("#" + options.id), options);
            }
            else {
                var ellipse = document.createElement("v:oval");
                var $ellipseEle = $(ellipse);
                options.x = options.cx - options.rx;
                options.y = options.cy - options.ry;
                options.width = (2 * options.rx);
                options.height = (2 * options.ry);
                this.applyVMLStyle($ellipseEle, options);
                $ellipseEle.appendTo(element);
            }
        },
        drawRect: function (options, element) {
            if ($("#" + options.id).length > 0) {
                this.applyVMLStyle($("#" + options.id), options);
            } else {
                var rect = document.createElement("v:rect");
                var $rectEle = $(rect);
                this.applyVMLStyle($rectEle, options);
                $rectEle.appendTo(element);
            }
        },
        drawCylinder: function (options, element, seriesOption) {
            var x = options.x, y = options.y, w = options.width, h = options.height, id = options.id, angle, path, rx, ry, cx2, cx1, cy1, X1, Y1, LX1, LY1, LX2, LY2, cy2, sa, ea, sa2, ea2, X, Y, cx, cy, LX, LY;
            var gradientColor = options.fill;
            var format = ej.EjSvgRender.prototype.checkColorFormat(gradientColor);
            if (!format)
                var gradientColor = ej.datavisualization.Chart.prototype.colorNameToHex(options.fill);
            var opacity = options.opacity, obj = { svgRenderer: ej.EjSvgRender.prototype }, colorz = ej.Ej3DRender.prototype.polygon3D.prototype.applyZLight(gradientColor, obj), colorx = ej.Ej3DRender.prototype.polygon3D.prototype.applyXLight(gradientColor, obj);
            var angleConvertor = 65535; // VML measures angles in degrees/65535
            if (seriesOption.isColumn == true) {
                options.rx = rx = w / 2;
                options.ry = ry = rx / 4;
                cx2 = cx1 = x + rx;
                Y1 = cy1 = (y - ry);
                LY2 = Y = cy2 = y + h - ry;
                LX1 = cx2 + rx;
                X1 = LX2 = X = cx2 - rx;
                sa1 = -Math.round(angleConvertor * 180);
                ea1 = Math.round(angleConvertor * 180);
                sa2 = Math.round(angleConvertor * 360);
                ea2 = -Math.round(angleConvertor * 180);
                gradientAngle = "90";
                if (seriesOption.stacking == true) {
                    if (!seriesOption.isLastSeries) {
                        cy1 = y + ry;
                    }
                }
                LY1 = cy1;
            }
            else {
                options.ry = ry = h / 2;
                options.rx = rx = ry / 4;
                LX1 = X1 = cx1 = x + rx;
                X = cx2 = x + w + rx;
                sa1 = Math.round(angleConvertor * 90); ea1 = Math.round(angleConvertor * 180);
                sa2 = Math.round(angleConvertor * 270);
                ea2 = -Math.round(angleConvertor * 180);
                cy2 = cy1 = y + ry;
                Y = LY1 = cy1 + ry;
                Y1 = LY2 = cy2 - ry;
                gradientAngle = "0";
                if (seriesOption.stacking == true) {
                    if (!seriesOption.isLastSeries) {
                        cx2 = x + w - rx;
                    }
                }
                LX2 = cx2;
            }
            delete options.x;
            delete options.y;
            options.width = 1000;
            options.x = 0;
            options.y = 0;
            delete options.stacking;
            options.height = 1000;
            delete options.isColumn;
            options.fill = colorz;
            options.fill_opacity = opacity;
            options.stroke = colorz;
            options['stroke-width'] = 0;
            for (i = 1; i <= 4; i++) {

                if (i % 2 == 0) {
                    cx = cx1;
                    cy = cy1; LX = LX2; LY = LY2; sa = sa2; ea = ea2;

                }
                else {
                    cx = cx2; cy = cy2; LX = LX1; LY = LY1; sa = sa1; ea = ea1;
                }
                if (i < 3) {
                    sa = angleConvertor;
                    ea = 23592600;
                }
                if (i < 4) {
                    path = [
                        'M',
                        Math.round(X),
                        Math.round(Y)
                    ];
                }
                path.push(

                    'ae',
                    Math.round(cx),
                    Math.round(cy),
                    Math.round(rx),
                    Math.round(ry),
                    sa,
                    ea
                );
                if (i > 2) {
                    path.push(

                        'l',
                        Math.round(LX),
                        Math.round(LY)
                    );
                    options.fill = "none";
                    options.color = gradientColor;
                    options.color2 = gradientColor;
                    options.colors = ("30% " + colorx + "," + "70% " + colorx);
                    options.angle = gradientAngle;
                }
                if (i != 3) {
                    path.push(
                        'e'
                    );
                    path = path.join(" ");
                    options.d = path;
                    options.id = id + "_" + "Region_" + (i - 1).toString();
                    if (i == 4)
                        options.id = id + "_" + "Region_" + (i - 2).toString();
                    var shape = document.createElement("v:shape");
                    var $shape = $(shape);
                    this.applyVMLStyle($shape, options);
                    $shape.appendTo(element);
                }
                X = X1; Y = Y1;
            }
        },
        _getAttrVal: function (ele, val, option) {
            val = (val == "x") ? "left" : val;
            val = (val == "y") ? "top" : val;
            var value1 = $(ele).attr(val);
            var value = value1 ? value1 : ($(ele).css(val));

            if (value != null)
                return value;
            else
                return option;
        },
        _setAttr: function (element, attribute) {
            if (attribute.transform) {
                var attrTrans = attribute.transform;
                var trans = attrTrans.slice(attrTrans.indexOf('(') + 1, attrTrans.indexOf(')')).split(',');
                attribute.x = trans[0];
                attribute.y = trans[1];
            }
            var $ele = $(element);
            if ($ele.length > 0)
                this.changeVMLStyle($ele, attribute);
        },
        createGradientElement: function (name, colors) {
            var colorName;

            if (Object.prototype.toString.call(colors) == '[object Array]') {
                colorName = "gradient" + " ";
                var appendString = "";
                for (var j = 0, i = colors.length - 1; i >= 0, j < colors.length; j++ , i--) {
                    colorName += appendString + colors[j]["colorStop"] + " " + colors[i]["color"];
                    appendString = ",";
                }
            }
            else {
                colorName = colors;
            }
            return colorName;
        },

        setSpanAttr: function (options, label, element) {
            var fontSize = (options["font-size"] > 0) ? (options["font-size"] + "px") : options["font-size"];
            var font = { size: fontSize, fontStyle: options["font-style"], fontFamily: options["font-family"] };
            var bounds = ej.EjSvgRender.utils._measureText(label, null, font);

            $(element).css("white-space", "nowrap");

            if (options["text-anchor"] === "middle")
                options.x = Math.round(options.x - bounds.width / 2);
            else if (options["text-anchor"] === "end")
                options.x = Math.round(options.x - bounds.width);
            options.y = Math.round(options.y - (font.size.replace("px", "")));
            this.applyVMLStyle(element, options);


        },
        drawText: function (options, label, groupEle, font) {
            var textDoc = document;
            var $Ele = $("#" + options.id);
            if ($Ele.length > 0) {
                this._textAttrReplace(options, label, font, $Ele);
            }
            else if (options.id.indexOf("YAxisTitle") > 0 && !this.isdocmode8) {
                options.on = true;
                var line = document.createElement("v:line");
                line.style.behavior = "url(#default#VML)";
                line.style.display = "inline-block";
                var bounds = ej.EjSvgRender.utils._measureText(label, null, null);

                line.setAttribute("to", (options.x - 1).toString() + "," + (options.y - bounds.width / 2).toString());
                line.setAttribute("from", (options.x).toString() + "," + options.y.toString());

                var path = document.createElement("v:path");
                path.setAttribute("textpathok", true);
                var textpath = document.createElement("v:textpath");
                textpath.setAttribute("on", true);
                textpath.setAttribute("string", label);

                textpath.style["font-style"] = options["font-style"];
                textpath.style["font-size"] = options["font-size"];
                textpath.style["font-family"] = options["font-family"];
                line.appendChild(path);
                line.appendChild(textpath);
                $(line).appendTo(groupEle);
            }
            else {
                var span = textDoc.createElement("span");
                var $spanEle = $(span);
                if (jQuery.type(label) == "array") {
                    this.setSpanAttr(options, label, $spanEle);
                    for (var i = 0; i < label.length; i++) {
                        var textspan = textDoc.createElement("span");
                        $(textspan).html(label[i]);
                        $(textspan).appendTo(span);
                        var brtag = textDoc.createElement("br");
                        $(brtag).appendTo(span);

                    }
                } else {
                    this.setSpanAttr(options, label, $spanEle);
                    $spanEle.html(label);
                }
                $spanEle.appendTo(groupEle);
            }
        },
        //text element attributes values are replaced 
        _textAttrReplace: function (options, label, font, $Ele) {
            if (jQuery.type(label) == "array") {
                var elements = $("#" + options.id).children("span");
                this.setSpanAttr(options, label, $Ele);
                if (elements.length > 0 && elements.length == label.length) {
                    for (var i = 0; i < elements.length; i++) {
                        var element = elements[i];
                        $(element).text(label[i]);
                    }
                }
                else {
                    $("#" + options.id).remove();
                    this.drawText(options, label, this.gTransToolEle, font);

                }
            } else {
                this.setSpanAttr(options, label, $Ele);
                $Ele.text(label);
            }

        },

        drawImage: function (options, element) {
            var imgElement = document.createElement("img");
            var $imgElement = $(imgElement);
            $imgElement.css({ 'position': 'absolute' });
            $.each(options, function (index, val) {
                if (index == "href") index = "src";
                $imgElement.attr(index, val);
            });
            $imgElement.appendTo(element);

        },

        createDefs: function () {

        },

        //createClipPath: function (options) {

        //},
        //createForeignObject: function (options) {

        //},
        createGroup: function (options) {
            var group = document.createElement("div");
            if (!ej.util.isNullOrUndefined(options.transform)) {
                var trans = options.transform.slice(options.transform.indexOf('(') + 1, options.transform.indexOf(')')).split(',');
                $(group).css({ 'position': 'absolute', 'left': trans[0] + 'px', 'top': trans[1] + 'px' });
            }
            if (options.cursor)
                $(group).css({ 'cursor': options.cursor });

            $.each(options, function (index, val) {
                if (index !== 'transform' && index != "clip-path")
                    $(group).attr(index, val);
            });

            return group;
        },

        createText: function (options, label) {
            var text = document.createElement("span");
            $(text).attr(options);
            if (!ej.util.isNullOrUndefined(label))
                text.textContent = label;
            return text;


        },

        //Draw clip path for each series to avoid series overlap in multiple axes zooming
        drawAxesBoundsClipPath: function (gSeriesGroupEle, options, invertedAxis) {
            var clipOptions;
            var element = $(gSeriesGroupEle);
            element.removeAttr("clip-path");
            var trans = this._getTransform(options.xAxis, options.yAxis, invertedAxis);
            clipOptions = {
                'id': gSeriesGroupEle.id + '_ClipRect',
                'x': 0,
                'y': 0,
                'width': (trans.width),
                'height': (trans.height),
                'fill': 'white',
                'stroke-width': 1,
                'stroke': 'transparent'
            };
            this.drawClipPath(clipOptions, gSeriesGroupEle);
            element.attr('clip-path', 'url(#' + clipOptions.id + ')');

        },

        getAttrVal: function (ele, val, option) {
            var value = $(ele).attr(val);
            if (value != null)
                return value;
            else
                return option;
        },

        round: function (value, div, up) {

            return div * (up ? Math.ceil(value / div) : Math.floor(value / div));
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
                var r = color.R;
                var g = color.G;
                var b = color.B;
                var hex = [r.toString(16), g.toString(16), b.toString(16)];
                $.each(hex, function (nr, val) { if (val.length === 1) { hex[nr] = "0" + val; } });
                return "#" + hex.join("").toUpperCase();
            }
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
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    R: parseInt(result[1], 16),
                    G: parseInt(result[2], 16),
                    B: parseInt(result[3], 16)
                } : null;
            }
        },
        checkColorFormat: function (color) {
            return /(rgba?\((?:\d{1,3}[,\)]){3}(?:\d+\.\d+\))?)|(^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$)/gmi.test(color);
        },
        createDelegate: function (context, handler) {
            return function (e) {
                handler.apply(context, [e, this]);
            };
        },

        drawClipPath: function (options, element) {
            if (options.id.indexOf("ChartAreaClipRect") == -1) {
                var left = Math.round(options.x) + 'px';
                var top = Math.round(options.y) + 'px';
                var right = Math.round(options.width) + Math.round(options.x) + 'px';
                var bottom = Math.round(options.y) + Math.round(options.height) + 'px';
                var cssClip = 'rect(' + top + ' ' + right + ' ' + bottom + ' ' + left + ')';
                $(element).css("position", "absolute").css('clip', cssClip);
            }
        },

        drawCircularClipPath: function (options, element) {
            var radius = Math.round(options.r);
            var x = Math.round(options.cx);
            var y = Math.round(options.cy);
            if (options.id.indexOf("_ClipRect") == -1) {
                var left = (x - radius) + 'px';
                var top = (y - radius) + 'px';
                var right = (x + radius) + 'px';
                var bottom = (y + radius) + 'px';
                var cssClip = 'rect(' + top + ' ' + right + ' ' + bottom + ' ' + left + ')';
                $(element).css("position", "absolute").css('clip', cssClip);
            }
        },

        append: function (childEle, parentEle) {
            $(childEle).appendTo(parentEle);
        }
    };
})(jQuery);