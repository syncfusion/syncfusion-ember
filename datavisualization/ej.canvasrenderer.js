ej.EjCanvasRender = function (element) {
    this.svgObj = document.createElement('canvas');
    this._rootId = jQuery(element).attr("id");
    this.svgObj.setAttribute('id', this._rootId + '_canvas');
    this.ctx = this.svgObj.getContext("2d");

};
(function ($) {
    ej.EjCanvasRender.prototype = {

        drawPath: function (options, element, canvasTranslate) {
            var hasStackingInnerRadius = options.hasStackingInnerRadius ? options.hasStackingInnerRadius : false;
            var path = options.d;
            var dataSplit = path.split(" ");
            var borderWidth = options["stroke-width"];
            if (!options.lgndCtx) {
                var canvasCtx = this.ctx;
                this.ctx = element != undefined ? element : this.ctx;
                this.ctx.save();
                this.ctx.beginPath();
                if (canvasTranslate) this.ctx.translate(canvasTranslate[0], canvasTranslate[1]);
                this.ctx.globalAlpha = options.opacity ? options.opacity : options["fill-opacity"];
                var flag = true;
                this.ctx.lineWidth = borderWidth;
                var dashArray = options["stroke-dasharray"] ? options["stroke-dasharray"].split(",") : false;
                if (dashArray) this.ctx.setLineDash(dashArray);
                this.ctx.strokeStyle = options.stroke;
                for (var i = 0; i < dataSplit.length; i = i + 3) {
                    var x1 = parseFloat(dataSplit[i + 1]);
                    var y1 = parseFloat(dataSplit[i + 2]);
                    switch (dataSplit[i]) {
                        case "M":
                            if ((!options.innerR || hasStackingInnerRadius) && !options.cx)
                                this.ctx.moveTo(x1, y1);
                            break;
                        case "L":
                            if (!options.innerR || hasStackingInnerRadius)
                                this.ctx.lineTo(x1, y1);
                            break;
                        case "C":
                            this.ctx.bezierCurveTo(x1, y1, parseFloat(dataSplit[i + 3]), parseFloat(dataSplit[i + 4]), parseFloat(dataSplit[i + 5]), parseFloat(dataSplit[i + 6]));
                            i = i + 4;
                            break;
                        case "A":
                            if (!options.innerR) {
                                if (options.cx) {
                                    this.ctx.arc(options.cx, options.cy, options.radius, 0, 2 * Math.PI, options.counterClockWise);
                                }
                                else {
                                    this.ctx.moveTo(options.x, options.y);
                                    this.ctx.arc(options.x, options.y, options.radius, options.start, options.end, options.counterClockWise);
                                    this.ctx.lineTo(options.x, options.y);
                                }
                            }
                            else if (flag) {
                                this.ctx.arc(options.x, options.y, options.radius, options.start, options.end, options.counterClockWise);
                                this.ctx.arc(options.x, options.y, options.innerR, options.end, options.start, !options.counterClockWise);
                                flag = false;
                            }
                            i = i + 5;
                            break;
                        case "Q":
                            this.ctx.bezierCurveTo(x1, y1, parseFloat(dataSplit[i + 1]), parseFloat(dataSplit[i + 2]), parseFloat(dataSplit[i + 3]), parseFloat(dataSplit[i + 4]));
                            i = i + 2;
                            break;
                        case "z":
                            this.ctx.closePath();
                            break;
                    }
                }
                if (options.fill != "none" && options.fill != undefined) {
                    this.ctx.fillStyle = options.fill;
                    this.ctx.fill();
                }
                if (borderWidth > 0)
                    this.ctx.stroke();
                this.ctx.restore();
                this.ctx = canvasCtx;
            } else {
                var legendCtx = this.lgndCtx;
                this.lgndCtx = element != undefined ? element : this.lgndCtx;
                this.lgndCtx.save();
                this.lgndCtx.beginPath();
                if (canvasTranslate) this.lgndCtx.translate(canvasTranslate[0], canvasTranslate[1]);
                this.lgndCtx.globalAlpha = options.opacity ? options.opacity : options["fill-opacity"];

                this.lgndCtx.lineWidth = options["stroke-width"];
                this.lgndCtx.strokeStyle = options.stroke;
                for (var i = 0; i < dataSplit.length; i = i + 3) {
                    var x1 = parseFloat(dataSplit[i + 1]);
                    var y1 = parseFloat(dataSplit[i + 2]);
                    switch (dataSplit[i]) {
                        case "M":
                            this.lgndCtx.moveTo(x1, y1);
                            break;
                        case "L":
                            this.lgndCtx.lineTo(x1, y1);
                            break;
                        case "C":
                            this.lgndCtx.bezierCurveTo(x1, y1, parseFloat(dataSplit[i + 3]), parseFloat(dataSplit[i + 4]), parseFloat(dataSplit[i + 5]), parseFloat(dataSplit[i + 6]));
                            i = i + 4;
                            break;
                        case "A":
                            this.lgndCtx.arc(parseFloat(dataSplit[i - 5]), parseFloat(dataSplit[i - 4]), x1, 0, 2 * Math.PI, false);
                            i = i + 5;
                            break;
                        case "a":
                            this.lgndCtx.beginPath();
                            var centerX = parseFloat(dataSplit[i - 2]) + x1;
                            var centerY = dataSplit[i - 1];
                            this.lgndCtx.arc(centerX, centerY, x1, 0, 2 * Math.PI, false);
                            i = i + 5;
                            break;
                        case "Z":
                            this.lgndCtx.fillStyle = options.fill;
                            this.lgndCtx.fill();
                            i = i - 2;
                            break;
                        case "Q":
                            this.lgndCtx.quadraticCurveTo(x1, y1, parseFloat(dataSplit[i + 3]), parseFloat(dataSplit[i + 4]));
                            i = i + 2;
                            break;
                    }
                }
                if (options.fill != "none" && options.fill != undefined) {
                    this.lgndCtx.fillStyle = options.fill;
                    this.lgndCtx.fill();
                }
                this.lgndCtx.stroke();
                this.lgndCtx.restore();
                this.lgndCtx = legendCtx;
            }
        },

        _setLinePathStyle: function (options, canvasTranslate) {

            var borderWidth = options["stroke-width"],
                dashArray;

            if (canvasTranslate) this.ctx.translate(canvasTranslate[0], canvasTranslate[1]);
            this.ctx.globalAlpha = options.opacity ? options.opacity : options["fill-opacity"];
            this.ctx.lineWidth = borderWidth;
            dashArray = options["stroke-dasharray"] ? options["stroke-dasharray"].split(",") : false;
            if (dashArray) this.ctx.setLineDash(dashArray);
            this.ctx.strokeStyle = options.stroke;

            if (options.fill != "none" && options.fill != undefined) {
                this.ctx.fillStyle = options.fill;
                this.ctx.fill();
            }
        },


        drawRect: function (options, element) {
            var canvasCtx = this.ctx, cornerRadius = options.rx;
            this.ctx = element ? (element.canvas ? element : this.ctx) : this.ctx;
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.globalAlpha = options.opacity;
            this.ctx.lineWidth = options["stroke-width"];
            var dashArray = options["stroke-dasharray"] ? options["stroke-dasharray"].split(",") : false;
            if (dashArray) this.ctx.setLineDash(dashArray);
            this.ctx.strokeStyle = options.stroke;
            this.ctx.rect(options.x, options.y, options.width, options.height);
            if (cornerRadius != null && cornerRadius >= 0) {
                this.drawCornerRadius(options);
            }
            else {
                if (options.fill == "none") options.fill = "transparent";
                this.ctx.fillStyle = options.fill;
                this.ctx.fillRect(options.x, options.y, options.width, options.height);
                this.ctx.stroke();
            }
            if (options.id.indexOf("Series") >= 0)
                this.ctx.clip();
            this.ctx.restore();
            this.ctx = canvasCtx;
        },
        drawCylinder: function (options, element, seriesOption) {
            var canvasCtx = this.ctx;
            this.ctx = element ? (element.canvas ? element : this.ctx) : this.ctx;
            this.ctx.save();
            var grad = ej.datavisualization.Chart.prototype.colorNameToHex(options.fill);
            var obj = { svgRenderer: ej.EjSvgRender.prototype };
            'use strict';
            var i, xPos, yPos, pi = Math.PI, twoPi = 2 * pi + 0.1, rx, ry, cx1, cx2, cy1, cy2, x1, x2, y1, y2, cx, cy, xl, yl, step, ini, gx1, gy2, gx2, gy1, rxt, ryt;
            var x = options.x, y = options.y, w = options.width, h = options.height, a = twoPi;
            this.ctx.fillStyle = ej.Ej3DRender.prototype.polygon3D.prototype.applyZLight(grad, obj)
            this.ctx.lineWidth = 0;
            this.ctx.strokeStyle = ej.Ej3DRender.prototype.polygon3D.prototype.applyZLight(grad, obj);
            this.ctx.globalAlpha = options.opacity;
            if (seriesOption.isColumn == true) {
                gx1 = x;
                gx2 = w + x;
                gy1 = gy2 = 0;
                rx = w / 2;
                ry = rx / 4;
                cx2 = cx1 = x + rx;
                y2 = cy1 = y - ry;
                x2 = x;
                x1 = x + w;
                cy2 = y1 = y + h - ry;
                ini = 0;
                step = pi;
                rxt = -rx;
                ryt = ry;
                if (seriesOption.stacking = true) {
                    if (!seriesOption.isLastSeries) {
                        y2 = cy1 = y + ry;

                    }
                }

            }
            else {
                gx1 = gx2 = 0;
                gy2 = h + y;
                gy1 = y;
                ry = h / 2;
                rx = ry / 4;
                x2 = cx1 = x + rx;
                x1 = cx2 = x + w + rx;
                y1 = y + h;
                y2 = y;
                cy2 = cy1 = y + ry;
                ini = pi / 2;
                step = pi * 1.5;
                if (seriesOption.stacking = true) {
                    if (!seriesOption.isLastSeries) {
                        x1 = cx2 = x + w - rx;
                    }
                }
                ry = -ry;
                rx = -rx;
                rxt = rx;
                ryt = -ry;
            }
            var color = ej.Ej3DRender.prototype.polygon3D.prototype.applyXLight(grad, obj);
            var grd = this.ctx.createLinearGradient(gx1, gy1, gx2, gy2);
            grd.addColorStop(0, grad);
            grd.addColorStop(0.3, color);
            grd.addColorStop(0.7, color);
            grd.addColorStop(1, grad);

            for (j = 1; j <= 4; j++) {
                var i = 0;
                j < 4 ? this.ctx.beginPath() : "";
                if (j % 2 == 0) {
                    cx = cx2; cy = cy2; xl = x2; yl = y2;
                }
                else {
                    cx = cx1; cy = cy1; xl = x1; yl = y1;
                }
                if (j == 4) {
                    rx = rxt;
                    ry = ryt;
                    this.ctx.fillStyle = grd;
                }
                if (j > 2) {
                    i = ini;
                    a = step;
                }
                for (; i <= a; i += 0.1) {
                    xPos = cx - (rx * Math.cos(i));
                    yPos = cy + (ry * Math.sin(i));

                    if (i === 0) {
                        this.ctx.moveTo(xPos, yPos);
                    } else {
                        this.ctx.lineTo(xPos, yPos);
                    }
                }

                if (j > 2) {

                    this.ctx.lineTo(xl, yl);
                }
                if (j != 3) {

                    this.ctx.stroke();
                    this.ctx.fill();
                }
            }

            if (options.id.indexOf("Series") >= 0)
                this.ctx.clip();
            this.ctx.restore();
            this.ctx = canvasCtx;
        },
        drawCornerRadius: function (options) {
            var cornerRadius = options.rx, x = options.x, y = options.y, width = options.width, height = options.height;
            if (options.fill == "none") options.fill = "transparent";
            this.ctx.fillStyle = options.fill;
            if (width < 2 * cornerRadius) cornerRadius = width / 2;
            if (height < 2 * cornerRadius) cornerRadius = height / 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x + width - cornerRadius, y);
            this.ctx.arcTo(x + width, y, x + width, y + height, cornerRadius);
            this.ctx.arcTo(x + width, y + height, x, y + height, cornerRadius);
            this.ctx.arcTo(x, y + height, x, y, cornerRadius);
            this.ctx.arcTo(x, y, x + width, y, cornerRadius);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        },

        createGradientElement: function (name, colors) {
            var colorName;
            var ctx = this.ctx;
            if (Object.prototype.toString.call(colors) == '[object Array]') {
                var my_gradient = ctx.createLinearGradient(0, 0, 0, this.svgObj.height);

                for (var i = 0; i <= colors.length - 1; i++) {
                    var color = colors[i].color;
                    var colorStop = (colors[i].colorStop).slice(0, -1);
                    colorStop = parseInt(colorStop) / 100;
                    my_gradient.addColorStop(colorStop, color);

                }
                colorName = my_gradient;
            }
            else {
                colorName = colors;
            }
            return colorName;
        },
        drawLine: function (options) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.lineWidth = options["stroke-width"];
            this.ctx.strokeStyle = options.stroke;
            this.ctx.moveTo(options.x1, options.y1);
            this.ctx.lineTo(options.x2, options.y2);
            this.ctx.stroke();
            this.ctx.restore();
        },
        drawText: function (options, label, highestText) {
            if (!ej.util.isNullOrUndefined(options["font-weight"]) && options["font-weight"].toLowerCase() == "regular")
                options["font-weight"] = "normal";
            var font = (options["font-style"].toLowerCase() + " " + options["font-weight"] + " " + options["font-size"] + " " + options["font-family"]);
            // text-anchor
            var anchor = options["text-anchor"];
            var opacity = options["opacity"] !== undefined ? options["opacity"] : 1;
            if (anchor == "middle")
                anchor = "center";
            if (!options.lgndCtx) {
                this.ctx.save();
                this.ctx.fillStyle = options.fill;
                this.ctx.font = font;
                this.ctx.textAlign = anchor;
                this.ctx.globalAlpha = opacity;
                if (options.baseline)
                    this.ctx.textBaseline = options.baseline;
                // dominant-baseline
                //if (options["dominant-baseline"] == "middle")
                //this.ctx.textBaseline = "center";
                if (!options.labelRotation) {
                    if (typeof label == "object" || options.isTrackball) {
                        if (options.isTrackball && typeof label == "string")
                            this.ctx.fillText(label, options.x, options.y);
                        else {
                            var len = label.length;
                            for (var i = 0; i < len; i++) {
                                var padding = ej.util.isNullOrUndefined(options.padding) ? 0 : options.padding;
                                var height = (ej.EjSvgRender.utils._measureText(label[i], null, font)).height;
                                var fontvalue = options.isTrackball ? Number(parseInt(options["font-size"])) : height;
                                this.ctx.fillText(label[i], options.x, options.y + (fontvalue + padding) * i);
                            }
                        }
                    }
                    else {
                        this.ctx.fillText(label, options.x, options.y);
                    }
                } else {
                    var txtlngth = 0, rotation = options.labelRotation;
                    if ((rotation) && (options.id.indexOf("XLabel") != -1 || options.id.indexOf("YLabel") != -1)) {
                        var rotate = 'rotate(' + options.labelRotation.toString() + 'deg)';
                        $(options).attr('rotateAngle', rotate);

                        var labelText = highestText ? highestText : label;
                        var textElement = this.createText(options, labelText);
                        $(document.body).append(textElement);
                        var box = textElement.getBoundingClientRect();
                        $(textElement).remove();
                        txtlngth = box.height;
                        if (rotation < 0) {
                            rotation = 360 + rotation;
                        }
                        var str = options.transform.split(',');
                        if (options.labelPosition == "outside")
                            this.ctx.translate(parseFloat(str[1]), parseFloat(str[2]) + (txtlngth / 2));
                        else
                            this.ctx.translate(parseFloat(str[1]), parseFloat(str[2]) - (txtlngth / 2));
                        this.ctx.textAlign = "center";
                        this.ctx.rotate(rotation * (Math.PI / 180));
                        if (typeof label == "object") {
                            var len = label.length;
                            for (var i = 0; i < len; i++) {
                                var height = (ej.EjSvgRender.utils._measureText(label[i], null, font)).height;
                                this.ctx.fillText(label[i], 0, i * height);
                            }
                        }
                        else
                            this.ctx.fillText(label, 0, 0);
                    }
                    else {
                        this.ctx.translate(options.x, options.y);
                        this.ctx.rotate(options.labelRotation * Math.PI / 180);
                        this.ctx.fillText(label, 0, 0);
                    }
                }
                this.ctx.restore();
            } else {
                this.lgndCtx.save();
                this.lgndCtx.fillStyle = options.fill;
                this.lgndCtx.font = font;
                this.lgndCtx.textAlign = anchor;
                this.lgndCtx.globalAlpha = opacity;
                // dominant-baseline
                if (options["dominant-baseline"] == "middle")
                    this.lgndCtx.textBaseline = "center";
                if (!options.labelRotation) {
                    this.lgndCtx.fillText(label, options.x, options.y);
                } else {
                    this.lgndCtx.translate(options.x, options.y);
                    this.lgndCtx.rotate(options.labelRotation * Math.PI / 180);
                    this.lgndCtx.fillText(label, 0, 0);
                }
                this.lgndCtx.restore();
            }
        },
        drawZoomRect: function (options, chartObj) {

            var chartPos = { left: 0, top: 0 };
            var zoomRect = $("<div id=" + options.id + "></div>");
            var areaBounds = chartObj.model.m_AreaBounds;

            // for drawing zoom area within the chartArea
            if (options.x < areaBounds.X || options.x + chartPos.left + options.width > chartPos.left + $(this.svgObj).width() - 20) {
                width = this.prevWidth;
                x = this.prevX;
            } else {
                width = this.prevWidth = options.width;
                x = this.prevX = options.x + chartPos.left;
            }

            if (options.y < areaBounds.Y || options.y + chartPos.top + options.height > chartPos.top + areaBounds.Y + areaBounds.Height) {
                height = this.prevHeight;
                y = this.prevY;
            } else {
                height = this.prevHeight = options.height;
                y = this.prevY = options.y + chartPos.top;
            }

            $(zoomRect).css({
                "width": width,
                "height": height,
                "top": y,
                "left": x,
                "background-color": options.fill,
                "border-style": "solid",
                "position": "absolute",
                "border-color": options.stroke,
                "border-width": options["stroke-width"]
            });
            document.getElementById("chartContainer_" + this._rootId).appendChild(zoomRect[0]);
        },
        zoomButton: function (options, currentItem, chart) {
            var svgObj = chart.svgObj ? chart.svgObj : chart.svgObject;
            var id = chart._rootId ? chart._rootId : chart._id;
            if (currentItem == "zoom")
                var currentItemId = "_Zoom";
            else if (currentItem == "zoomIn")
                currentItemId = "_ZoomIn";
            else
                currentItemId = "_ZoomOut";

            var chartPos = { left: 0, top: 0 };
            if ($("#" + options.zoomId).length <= 0) {
                var zoomButton = $("<div id=" + svgObj.id + currentItemId + 'Btn' + "></div>");
                $(zoomButton).css({
                    "width": options.width,
                    "height": options.height,
                    "top": options.top + chartPos.top,
                    "left": options.left + chartPos.left,
                    "background-color": options.fill,
                    "border-style": "solid",
                    "position": "absolute",
                    "border-radius": "0.4em",
                    "border-color": options.fill,
                    "box-sizing": "content-box",
                    "z-index": 2000
                });
                var svgLink = "http://www.w3.org/2000/svg";
                var svgShape = document.createElementNS(svgLink, "svg");
                svgShape.setAttribute('id', options.zoomId);
                svgShape.setAttribute('width', 25);
                svgShape.setAttribute('height', 25);

                if (currentItem == "zoom") {
                    var direction = "M26.101,22.893l-6.605-6.174c1.414-2.781,0.897-6.267-1.496-8.504c-2.901-2.711-7.448-2.56-10.161,0.341    c-2.712,2.9-2.56,7.45,0.341,10.163c2.426,2.266,6,2.523,8.694,0.853l6.579,6.151L26.101,22.893z M10.186,16.571    c-1.715-1.604-1.805-4.293-0.203-6.009c1.605-1.715,4.295-1.805,6.009-0.201c1.715,1.603,1.805,4.293,0.202,6.007    C14.59,18.084,11.901,18.175,10.186,16.571";
                    var transform = "translate(-3,-3)";
                } else if (currentItem == "zoomIn") {
                    direction = "M9.0983096,4.2999878L9.0983096,9.3999634 3.9983783,9.3999634 3.9983783,12.699951 9.0983096,12.699951 9.0983096,17.799988 12.398249,17.799988 12.398249,12.699951 17.49818,12.699951 17.49818,9.5 12.398249,9.5 12.398249,4.2999878z M10.998276,0C14.298215,0 17.49818,1.3999634 19.69813,4.1999512 22.79809,8.0999756 22.79809,13.5 19.998144,17.399963L28.597992,28.299988 23.898081,32 15.398205,21.199951C10.898271,23.099976 5.5983606,21.899963 2.3983956,17.899963 -1.4015366,13.099976 -0.60156059,6.0999756 4.1983567,2.3999634 6.1983276,0.79998779 8.5983163,0 10.998276,0z";
                    transform = "translate(4,4) scale(0.6)";
                } else {
                    direction = "M3.9983433,9.5L3.9983433,12.799988 17.598165,12.799988 17.598165,9.5z M10.998234,0C14.298169,0 17.498131,1.3999634 19.698108,4.1999512 22.798034,8.0999756 22.798034,13.5 19.998092,17.399963L28.597994,28.299988 23.898054,32 15.398188,21.199951C10.898259,23.099976 5.5983546,21.899963 2.398393,17.899963 -1.4015351,13.099976 -0.60155994,6.0999756 4.1983522,2.3999634 6.1983207,0.79998779 8.5983074,0 10.998234,0z";
                    transform = "translate(4,4) scale(0.6)";
                }

                var attrOptions = {
                    'id': currentItemId + 'Path',
                    'fill': options.iconColor,
                    'transform': transform,
                    'd': direction
                };

                var path = document.createElementNS(svgLink, "path");
                $(path).attr(attrOptions).appendTo(svgShape);
                zoomButton[0].appendChild(svgShape);
                document.getElementById("chartContainer_" + id).appendChild(zoomButton[0]);
            } else {
                var zoomButton = document.getElementById(svgObj.id + currentItemId + 'Btn');
                $(zoomButton).css({
                    "top": options.top + chartPos.top,
                    "left": options.left + chartPos.left
                });
            }
        },
        panButton: function (options, chart) {
            var svgObj = chart.svgObj ? chart.svgObj : chart.svgObject;
            var id = chart._rootId ? chart._rootId : chart._id;
            var chartPos = { left: 0, top: 0 };
            if ($("#" + options.panId).length <= 0) {
                var panButton = $("<div id=" + svgObj.id + '_PanBtn' + "></div>");
                $(panButton).css({
                    "width": options.width,
                    "height": options.height,
                    "top": options.top + chartPos.top,
                    "left": options.left + chartPos.left,
                    "background-color": options.fill,
                    "border-style": "solid",
                    "position": "absolute",
                    "border-radius": "0.4em",
                    "border-color": options.fill,
                    "box-sizing": "content-box",
                    "z-index": 2000
                });
                var svgLink = "http://www.w3.org/2000/svg";
                var svgShape = document.createElementNS(svgLink, "svg");
                svgShape.setAttribute('id', options.panId);
                svgShape.setAttribute('width', 25);
                svgShape.setAttribute('height', 25);

                var attrOptions = {
                    'id': 'panPath',
                    'fill': options.iconColor,
                    'transform': 'translate(-3,-3)'
                };
                attrOptions.points = "26.105,16 21.053,12.211 21.053,14.737 17.263,14.737 17.263,10.947 19.834,10.947 16.044,5.895 12.255,10.947 14.737,10.947 14.737,14.737 10.947,14.737 10.947,12.211 5.895,16 10.947,19.789 10.947,17.263 14.737,17.263 14.737,21.053 12.255,21.053 16.044,26.105 19.834,21.053 17.263,21.053 17.263,17.263 21.053,17.263 21.053,19.789";

                var path = document.createElementNS(svgLink, "polygon");
                $(path).attr(attrOptions).appendTo(svgShape);
                panButton[0].appendChild(svgShape);
                document.getElementById("chartContainer_" + id).appendChild(panButton[0]);
            } else {
                var panButton = document.getElementById(svgObj.id + '_PanBtn');
                $(panButton).css({
                    "top": options.top + chartPos.top,
                    "left": options.left + chartPos.left
                });
            }
        },
        resetZoom: function (options, chart) {
            var svgObj = chart.svgObj ? chart.svgObj : chart.svgObject;
            var id = chart._rootId ? chart._rootId : chart._id;
            var chartPos = { left: 0, top: 0 };
            if ($("#" + options.resetZoomId).length <= 0) {
                var resetZoom = $("<div id=" + svgObj.id + '_ResetZoom' + "></div>");
                $(resetZoom).css({
                    "width": options.width,
                    "height": options.height,
                    "top": options.top + chartPos.top,
                    "left": options.left + chartPos.left,
                    "background-color": options.fill,
                    "border-style": "solid",
                    "border-radius": "0.4em",
                    "position": "absolute",
                    "border-color": options.fill,
                    "box-sizing": "content-box",
                    "z-index": 2000
                });
                var svgLink = "http://www.w3.org/2000/svg";
                var svgShape = document.createElementNS(svgLink, "svg");
                svgShape.setAttribute('id', options.resetZoomId);
                svgShape.setAttribute('width', 25);
                svgShape.setAttribute('height', 25);

                var points1 = {
                    'id': 'p1',
                    'fill': options.iconColor,
                    'transform': 'translate(-3,-3)'
                };
                points1.points = "11.895,18.398 8.061,22.23 5.796,19.967 5.796,26.283 12.112,26.283 9.848,24.018 13.682,20.186";

                var path1 = document.createElementNS(svgLink, "polygon");
                $(path1).attr(points1).appendTo(svgShape);

                var points2 = {
                    'id': 'p2',
                    'fill': options.iconColor,
                    'transform': 'translate(-3,-3)'
                };
                points2.points = "19.691,6.072 21.955,8.337 18.121,12.172 19.908,13.959 23.742,10.123 26.007,12.389 26.007,6.072";

                var path2 = document.createElementNS(svgLink, "polygon");
                $(path2).attr(points2).appendTo(svgShape);

                var points3 = {
                    'id': 'p3',
                    'fill': options.iconColor,
                    'transform': 'translate(-3,-3)'
                };
                points3.points = "11.895,13.958 13.682,12.172 9.848,8.337 12.112,6.072 5.796,6.072 5.796,12.389 8.061,10.123";

                var path3 = document.createElementNS(svgLink, "polygon");
                $(path3).attr(points3).appendTo(svgShape);

                var points4 = {
                    'id': 'p4',
                    'fill': options.iconColor,
                    'transform': 'translate(-3,-3)'
                };
                points4.points = "19.908,18.396 18.121,20.186 21.955,24.018 19.691,26.283 26.007,26.283 26.007,19.967 23.741,22.23";

                var path4 = document.createElementNS(svgLink, "polygon");
                $(path4).attr(points4).appendTo(svgShape);

                resetZoom[0].appendChild(svgShape);
                document.getElementById("chartContainer_" + id).appendChild(resetZoom[0]);
            } else {
                var resetZoom = document.getElementById(svgObj.id + '_ResetZoom');
                $(resetZoom).css({
                    "top": options.top + chartPos.top,
                    "left": options.left + chartPos.left
                });
            }
        },
        drawCrosshairLine: function (options, element) {
            var line = $("<div id=" + options.id + "></div>");
            $(line).css({
                "width": options.width,
                "height": options.height,
                "left": options.left,
                "top": options.top,
                "border-style": options.style,
                "opacity": options.opacity,
                "visibility": "visible",
                "border-color": options.stroke,
                "border-width": options["stroke-width"],
                "position": options.position
            });
            $(element).append(line[0]);
        },
        drawCrosshairlabel: function (rectOptions, textOptions, text) {
            var chartOffset = $("#" + this._rootId).offset(),
                chartPos = { left: 0, top: 0 };
            if ($("#" + rectOptions.id).length > 0) {
                var label = document.getElementById(rectOptions.id);
                $(label).css({
                    "width": rectOptions.width - 5,
                    "height": rectOptions.height - 5,
                    "left": textOptions.x + chartPos.left - 5,
                    "top": textOptions.y + chartPos.top - 15,
                    "visibility": "visible",
                    "display": rectOptions.display
                });
                document.getElementById(rectOptions.id).textContent = text;
            } else {
                var label = $("<div id=" + rectOptions.id + " style='position: absolute; z-index: 13000;'></div>");
                $(label).css({
                    "color": textOptions.fill,
                    "font-family": textOptions["font-family"],
                    "font-size": textOptions["font-size"],
                    "font-weight": textOptions["font-weight"],
                    "font-style": textOptions["font-style"],
                    "background-color": rectOptions.fill,
                    "border-style": "solid",
                    "border-color": rectOptions.stroke,
                    "border-width": rectOptions["stroke-width"],
                    "opacity": rectOptions["fill-opacity"],
                    "text-align": "center"
                });

                document.getElementById(this._rootId).appendChild(label[0]);
            }
        },
        createCrosshairCanvas: function () {

            var chartCanvas = document.getElementById(this._rootId + "_canvas"),
                chartOffset = $("#" + this._rootId).offset(), secCanvas,
                chartPos = { left: 0, top: 0 };

            if (!$("#secondCanvas").length) {
                secCanvas = document.createElement('canvas');
                $(document).find("#" + this.svgObj.id + '_CrosshairGroup').append(secCanvas);
                $(secCanvas).attr({
                    'id': 'secondCanvas',
                    'width': chartCanvas.width,
                    'height': chartCanvas.height,
                    'top': chartPos.top,
                    'left': chartPos.left,
                });
                $(secCanvas).css({
                    'width': chartCanvas.width,
                    'height': chartCanvas.height,
                    'top': chartPos.top,
                    'left': chartPos.left
                });
            }
            else {
                secCanvas = document.getElementById("secondCanvas");
            }
            return secCanvas;
        },
        drawTrackToolTip: function (rectOptions, textOptions, text, padding) {
            var chartPos = { left: this.svgObj.offsetLeft, top: this.svgObj.offsetTop };
            if ($("#" + rectOptions.id).length > 0) {
                var label = document.getElementById(rectOptions.id);
                $(label).css({
                    "left": rectOptions.x + chartPos.left,
                    "top": rectOptions.y + chartPos.top,
                    "visibility": "visible",
                    "border-box": "content-box",
                    "background-color": rectOptions.fill,
                    "color": textOptions.fill,
                    "border-color": rectOptions.stroke,
                    "border-width": rectOptions["stroke-width"]
                });
                if (jQuery.type(text) == "array") {
                    var j = 0;
                    var arrayText = "";
                    for (var i = 0; i < text.length; i++) {
                        arrayText = arrayText + text[i] + '</br>';
                    }
                    $("#" + rectOptions.id).html(arrayText);
                } else
                    $("#" + rectOptions.id).html(text);
            } else {
                var label = $("<div id=" + rectOptions.id + " style='position: absolute; z-index: 13000;'></div>");
                $(label).css({
                    "color": textOptions.fill,
                    "font-family": textOptions["font-family"],
                    "font-size": textOptions["font-size"],
                    "font-weight": textOptions["font-weight"],
                    "font-style": textOptions["font-style"],
                    "width": rectOptions.width,
                    "height": rectOptions.height - padding - 2 * rectOptions["stroke-width"],
                    "background-color": rectOptions.fill,
                    "border-style": "solid",
                    "text-align": "center",
                    "padding": "0px",
                    "padding-top": (padding / 2) + 'px',
                    "padding-bottom": (padding / 2) + 'px',
                    "border-color": rectOptions.stroke,
                    "border-width": rectOptions["stroke-width"],
                    "opacity": rectOptions["fill-opacity"]
                });
                document.getElementById(this._rootId).appendChild(label[0]);
            }
        },
        trackSymbol: function (options, evt, symbolName, trackSymbol, chartObj) {
            var chartAreaRect = chartObj.model.m_AreaBounds, chartOffset = $("#" + this._rootId).offset(), parent;
            if (evt.startX >= chartAreaRect.X && evt.startX <= chartAreaRect.X + chartAreaRect.Width && evt.startY >= chartAreaRect.Y && evt.startY <= chartAreaRect.Y + chartAreaRect.Height) {
                var seriesIndex = options.SeriesIndex, radius;
                var pointIndex = options.PointIndex;
                if (chartObj.model.series[seriesIndex].type.toLowerCase() == "bubble") {
                    var point = chartObj.model.series[seriesIndex]._visiblePoints[pointIndex];
                    radius = (point.radius * 2) + 5;//exploding the bubble
                    options.Style.BorderColor = options.Style.Color;
                }

                if (chartObj.model.series[seriesIndex].type.toLowerCase() == "scatter" && ej.util.isNullOrUndefined(trackSymbol)) {
                    var circleOptions = {
                        "cx": evt.startX - 2,
                        "cy": evt.startY - 2,
                        "r": options.ShapeSize.width / 2,
                        "fill": options.Style.Color,
                        "opacity": options.Style.Opacity,
                        "stroke": options.Style.BorderColor
                    };
                    this.drawCircle(circleOptions, null);
                }

                else {
                    if ($("#" + "canvas_trackSymbol").length > 0) {
                        var parentDiv = $("#" + "canvas_trackSymbol");
                        $(parentDiv).css({ "visibility": "visible", "display": "block" });
                    }
                    else
                        parentDiv = $("<div id=" + "canvas_trackSymbol" + "></div>");

                    var chartPos = { left: evt.startX, top: evt.startY };

                    var symbol = $("<div id=" + options.ID + "></div>");
                    var left = (chartPos.left - (radius || options.ShapeSize.width));
                    var top = (chartPos.top - (radius || options.ShapeSize.height));

                    $(symbol).css({

                        "left": left,
                        "top": top,
                        "box-sizing": 'content-box',
                        "position": "absolute",
                        "visibility": "visible",
                        "opacity": options.Style.Opacity,
                        "z-index": 200
                    });
                    var style = options.ShapeSize;
                    options.symbol = symbol;
                    var shapeAttr = {};
                    switch (symbolName.toLowerCase()) {
                        case "circle":
                            $(symbol).css({
                                //radius for bubble exploding
                                "width": radius || options.ShapeSize.width + 'px',
                                "height": radius || options.ShapeSize.height + 'px',
                                "left": radius ? (left + radius / 2) : (left + options.ShapeSize.width / 2 - options.Style.BorderWidth) + 'px',
                                "top": radius ? (top + radius / 2) : (top + options.ShapeSize.height / 2 - options.Style.BorderWidth) + 'px',
                                "border-style": "solid",
                                "background-color": options.Style.Color,
                                "border-color": options.Style.BorderColor,
                                "border-width": options.Style.BorderWidth,
                                "border-radius": "100%"
                            });
                            break;
                        case "rectangle":
                            $(symbol).css({
                                "width": options.ShapeSize.width,
                                "height": options.ShapeSize.height,
                                "left": left + options.ShapeSize.width / 2 - options.Style.BorderWidth / 2,
                                "top": top + options.Style.BorderWidth / 2,
                                "border-style": "solid",
                                "background-color": options.Style.Color,
                                "border-color": options.Style.BorderColor,
                                "border-width": options.Style.BorderWidth
                            });
                            break;
                        case "diamond":

                            var direction = "M" + " " + (evt.startX + (-style.width / 2)) + " " + (evt.startY) + " "
                                + "L" + " " + (evt.startX) + " " + (evt.startY + (-options.ShapeSize.height / 2)) + " "
                                + "L" + " " + (evt.startX + (options.ShapeSize.width / 2)) + " " + (evt.startY) + " "
                                + "L" + " " + (evt.startX) + " " + (evt.startY + (options.ShapeSize.height / 2)) + " "
                                + "L" + " " + (evt.startX + (-options.ShapeSize.width / 2)) + " " + (evt.startY) + "z";
                            shapeAttr.direction = direction;
                            this.drawSvgShape(options, shapeAttr);

                            break;
                        case "triangle":

                            var direction = "M" + " " + (evt.startX + (-style.width / 2)) + " " + (evt.startY + (style.height / 2)) + " " + "L" + " " + (evt.startX) + " " + (evt.startY + (-style.height / 2))
                                + " " + "L" + " " + (evt.startX + (style.width / 2)) + " " + (evt.startY + (style.height / 2)) + " " + "L" + " " + (evt.startX + (-style.width / 2)) + " " + (evt.startY + (style.height / 2)) + "z";
                            shapeAttr.direction = direction;
                            this.drawSvgShape(options, shapeAttr);

                            break;
                        case "invertedtriangle":

                            var direction = "M" + " " + (evt.startX + (-style.width / 2)) + " " + (evt.startY + (style.height / 2)) + " " + "L" + " " + (evt.startX) + " " +
                                (evt.startY + (-style.height / 2)) + " " + "L" + " " + (evt.startX + (style.width / 2)) + " " + (evt.startY + (style.height / 2)) + " " + "L" + " " +
                                (evt.startX + (-style.width / 2)) + " " + (evt.startY + (style.height / 2)) + "z";
                            var x = evt.startX;
                            var y = evt.startY;
                            var rotate = 'rotate(180,' + x + ',' + y + ')';

                            shapeAttr.direction = direction;
                            shapeAttr.rotate = rotate;
                            this.drawSvgShape(options, shapeAttr);

                            break;

                        case "cross":

                            var direction = "M" + " " + (evt.startX + (-style.width / 2)) + " " + (evt.startY) + " " + "L" + " " + (evt.startX + (style.width / 2))
                                + " " + (evt.startY) + " " + "M" + " " + (evt.startX) + " " + (evt.startY + (style.height / 2)) + " " + "L" + " " + (evt.startX) + " " +
                                (evt.startY + (-style.height / 2)) + "z";

                            shapeAttr.direction = direction;
                            this.drawSvgShape(options, shapeAttr);

                            break;
                        case "star":

                            var direction = "M" + " " + (evt.startX + (style.width / 3)) + " " + (evt.startY + (-style.height / 2)) + " " + "L" + " " + (evt.startX + (-style.width / 2)) + " " +
                                (evt.startY + (style.height / 6)) + " " + "L" + " " + (evt.startX + (style.width / 2)) + " " + (evt.startY + (style.height / 6)) + " " + "L" + " " + (evt.startX + (-style.width / 3)) + " " +
                                (evt.startY + (-style.height / 2)) + " " + "L" + " " + (evt.startX) + " " + (evt.startY + (style.height / 2)) + " " + "L" + " " + (evt.startX + (style.width / 3)) + " " + (evt.startY + (-style.height / 2)) + "z";

                            shapeAttr.direction = direction;
                            this.drawSvgShape(options, shapeAttr);

                            break;
                        case "hexagon":

                            var direction = "M" + " " + (evt.startX + (-style.width / 2)) + " " + (evt.startY) + " " + "L" + " " + (evt.startX + (-style.width / 4)) + " " +
                                (evt.startY + (-style.height / 2)) + " " + "L" + " " + (evt.startX + (style.width / 4)) + " " + (evt.startY + (-style.height / 2)) + " " + "L" + " " +
                                (evt.startX + (style.width / 2)) + " " + (evt.startY) + " " + "L" + " " + (evt.startX + (style.width / 4)) + " " + (evt.startY + (style.height / 2)) + " " + "L" + " " +
                                (evt.startX + (-style.width / 4)) + " " + (evt.startY + (style.height / 2)) + " " + "L" + " " + (evt.startX + (-style.width / 2)) + " " + (evt.startY) + "z";

                            shapeAttr.direction = direction;
                            this.drawSvgShape(options, shapeAttr);

                            break;
                        case "wedge":

                            var direction = "M" + " " + (evt.startX - style.width) + " " + (evt.startY) + " " + "L" + " " + (evt.startX + style.width) + " " +
                                (evt.startY + (-style.height / 2)) + " " + "L" + " " + (evt.startX + (3 * (style.width / 4))) + " " + (evt.startY) + " " + "L" + " " +
                                (evt.startX + (style.width)) + " " + (evt.startY + (style.height / 2)) + " " + "L" + " " + (evt.startX - style.width) + " " + (evt.startY) + "z";

                            shapeAttr.direction = direction;
                            this.drawSvgShape(options, shapeAttr);

                            break;
                        case "trapezoid":

                            var direction = "M" + " " + (evt.startX + (-style.width / 2)) + " " + (evt.startY) + " " + "L" + " " + (evt.startX + (-style.width / 2)) + " " +
                                (evt.startY + (-style.height / 4)) + " " + "L" + " " + (evt.startX + (-style.width / 2) + (style.width)) + " " + (evt.startY + (-style.height / 2)) + " " + "L" + " " +
                                (evt.startX + (-style.width / 2) + (style.width)) + " " + (evt.startY + (style.height / 2)) + " " + "L" + " " + (evt.startX + (-style.width / 2)) + " " + (evt.startY + (style.height / 4)) +
                                " " + "L" + " " + (evt.startX + (-style.width / 2)) + " " + (evt.startY) + "z";

                            shapeAttr.direction = direction;
                            this.drawSvgShape(options, shapeAttr);

                            break;
                        case "uparrow":

                            var direction = "M" + " " + ((evt.startX - (style.width / 2) + (style.width / 4))) + " " + (evt.startY - (style.height / 2) + (style.height)) + " " + "L" + " " + ((evt.startX - (style.width / 2) + (style.width / 4))) + " " + (evt.startY - (style.height / 2) + (style.height / 2)) + " " + "L" + " " + ((evt.startX - (style.width / 2))) + " " + (evt.startY - (style.height / 2) + (style.height / 2)) + " " + "L" + " " + ((evt.startX)) + " " + (evt.startY - (style.height / 2)) + " " + "L" + " " + ((evt.startX + (style.width / 2))) + " " + (evt.startY - (style.height / 2) + (style.height / 2)) + " " + "L" + " " + ((evt.startX + (style.width / 2) - (style.width / 4))) + " " + (evt.startY - (style.height / 2) + (style.height / 2)) + " " + "L" + " " + ((evt.startX + (style.width / 2) - (style.width / 4))) + " " + (evt.startY - (style.height / 2) + (style.height)) + " " + "L" + " " + ((evt.startX - (style.width / 2) + (style.width / 4))) + " " + (evt.startY - (style.height / 2) + (style.height)) + "z";
                            shapeAttr.direction = direction;
                            this.drawSvgShape(options, shapeAttr);

                            break;
                        case "downarrow":

                            var direction = "M" + " " + ((evt.startX - (style.width / 2) + (style.width / 4))) + " " + (evt.startY - (style.height / 2)) + " " + "L" + " " + ((evt.startX + (style.width / 2) - (style.width / 4))) + " " + (evt.startY - (style.height / 2)) + " " + "L" + " " + ((evt.startX + (style.width / 2) - (style.width / 4))) + " " + (evt.startY - (style.height / 2) + (style.height / 2)) + " " + "L" + " " + ((evt.startX + (style.width / 2))) + " " + (evt.startY - (style.height / 2) + (style.height / 2)) + " " + "L" + " " + ((evt.startX)) + " " + (evt.startY - (style.height / 2) + (style.height)) + " " + "L" + " " + ((evt.startX - (style.width / 2))) + " " + (evt.startY - (style.height / 2) + (style.height / 2)) + " " + "L" + " " + ((evt.startX - (style.width / 2) + (style.width / 4))) + " " + (evt.startY - (style.height / 2) + (style.height / 2)) + " " + "L" + " " + ((evt.startX - (style.width / 2) + (style.width / 4))) + " " + (evt.startY - (style.height / 2)) + "z";
                            shapeAttr.direction = direction;
                            this.drawSvgShape(options, shapeAttr);

                            break;
                        case "leftarrow":

                            var direction = "M" + " " + ((evt.startX - (style.width / 2)) + style.width) + " " + (evt.startY + (style.height / 4)) + " " + "L" + " " + ((evt.startX - (style.width / 2)) + style.width) + " " + (evt.startY + (-style.height / 4)) + " " + "L" + " " +
                                ((evt.startX - (style.width / 2)) + (style.width / 2)) + " " + (evt.startY + (-style.height / 4)) + " " + "L" + " " + ((evt.startX - (style.width / 2)) + (style.width / 2)) + " " + (evt.startY + (-style.height / 2)) + " " + "L" + " " + ((evt.startX -
                                    (style.width / 2))) + " " + (evt.startY) + " " + "L" + " " + ((evt.startX - (style.width / 2)) + (style.width / 2)) + " " + (evt.startY + (style.height / 2)) + " " + "L" + " " + ((evt.startX - (style.width / 2)) + (style.width / 2)) + " " +
                                (evt.startY + (style.height / 4)) + " " + "L" + " " + ((evt.startX - (style.width / 2)) + style.width) + " " + (evt.startY + (style.height / 4)) + "z";

                            shapeAttr.direction = direction;
                            this.drawSvgShape(options, shapeAttr);

                            break;
                        case "rightarrow":

                            var direction = "M" + " " + ((evt.startX - (style.width / 2))) + " " + (evt.startY + (style.height / 4)) + " " + "L" + " " + ((evt.startX - (style.width / 2))) + " " + (evt.startY + (-style.height / 4)) + " " + "L" + " " + ((evt.startX - (style.width / 2)) + (style.width / 2)) + " " + (evt.startY + (-style.height / 4)) + " " + "L" + " " + ((evt.startX - (style.width / 2)) + (style.width / 2)) + " " + (evt.startY + (-style.height / 2)) + " " + "L" + " " + ((evt.startX - (style.width / 2)) + style.width) + " " + (evt.startY) + " " + "L" + " " + ((evt.startX - (style.width / 2)) + (style.width / 2)) + " " + (evt.startY + (style.height / 2)) + " " + "L" + " " + ((evt.startX - (style.width / 2)) + (style.width / 2)) + " " + (evt.startY + (style.height / 4)) + " " + "L" + " " + ((evt.startX - (style.width / 2))) + " " + (evt.startY + (style.height / 4)) + "z";
                            shapeAttr.direction = direction;
                            this.drawSvgShape(options, shapeAttr);

                            break;
                        case "pentagon":

                            var eq = 72;
                            var radius = Math.sqrt(style.height * style.height + style.width * style.width) / 2;
                            var sb = ej.EjSvgRender.utils._getStringBuilder();
                            for (var i = 0; i <= 5; i++) {
                                var deg = i * eq;
                                var rad = (Math.PI / 180) * deg;
                                var x1 = radius * Math.cos(rad);
                                var y1 = radius * Math.sin(rad);
                                if (i == 0)
                                    sb.append("M" + " " + (evt.startX + x1) + " " + (evt.startY + y1) + " ");
                                else
                                    sb.append("L" + " " + (evt.startX + x1) + " " + (evt.startY + y1) + " ");
                            }
                            sb.append("z");
                            var direction = sb.toString();
                            shapeAttr.direction = direction;
                            this.drawSvgShape(options, shapeAttr);

                            break;
                        case "ellipse":
                            $(symbol).css({
                                "width": options.ShapeSize.width,
                                "height": options.ShapeSize.height / 2,
                                "border-style": "solid",
                                "left": left + options.ShapeSize.height / 2 - options.Style.BorderWidth / 2,
                                "top": (evt.startY + chartPos.top - options.ShapeSize.height + 4),
                                "background-color": options.Style.Color,
                                "border-color": options.Style.BorderColor,
                                "border-width": options.Style.BorderWidth,
                                "-moz-border-radius": "50%",
                                "-webkit-border-radius": "50%",
                                "border-radius": "50%",
                                "border-box": "content-box"
                            });
                            break;
                        case "horizline":
                            $(symbol).css({
                                "width": options.ShapeSize.width,
                                "height": 0,
                                "border-style": "solid",
                                "left": left + options.ShapeSize.width / 2,
                                "top": (evt.startY + chartPos.top - 1),
                                "border-color": options.Style.BorderColor,
                                "border-width": '2px',
                                "border-box": "content-box"
                            });
                            break;
                        case "vertline":
                            $(symbol).css({
                                "width": 0,
                                "height": options.ShapeSize.height,
                                "border-style": "solid",
                                "left": (evt.startX + chartPos.left - 1),
                                "top": top + options.ShapeSize.height / 2 - 2,
                                "border-color": options.Style.BorderColor,
                                "border-width": '2px',
                                "border-box": "content-box"
                            });
                            break;
                        default:
                            $(symbol).css({
                                "width": options.ShapeSize.width,
                                "height": options.ShapeSize.height,
                                "border-style": "solid",
                                "background-color": options.Style.Color,
                                "border-color": options.Style.BorderColor,
                                "border-width": options.Style.BorderWidth,
                                "border-radius": "50px"
                            });
                            break;
                    }
                    parentDiv[0].appendChild(symbol[0]);
                    parent = document.getElementById(this.svgObj.id + '_CrosshairGroup') || document.getElementById("chartContainer_" + this._rootId);
                    parent.appendChild(parentDiv[0]);
                }
            }
        },
        //draw SVG Marker shape on mouse over the points
        drawSvgShape: function (options, attr) {
            var chartCanvas = document.getElementById(this._rootId + "_canvas");
            var chartPos = { left: 0, top: 0 };
            var svgLink = "http://www.w3.org/2000/svg";
            var svgShape = document.createElementNS(svgLink, "svg");
            svgShape.setAttribute('id', 'mySVG');
            svgShape.setAttribute('width', $(chartCanvas).width());
            svgShape.setAttribute('height', $(chartCanvas).height());
            $(options.symbol).css({
                "left": chartPos.left + 'px',
                "top": chartPos.top + 'px'
            });
            var attrOptions = {
                'id': 'svgPath',
                'fill-opacity': options.Style.Opacity,
                'stroke-width': options.Style.BorderWidth,
                'fill': options.Style.Color,
                'transform': attr.rotate,
                'stroke': options.Style.BorderColor
            };
            attrOptions.d = attr.direction;

            var path = document.createElementNS(svgLink, "path");
            $(path).attr(attrOptions).appendTo(svgShape);
            options.symbol[0].appendChild(svgShape);
        },
        drawCircle: function (options, element) {
            if (!options.lgndCtx) {
                var canvasCtx = this.ctx, dashArray;
                this.ctx = element != undefined ? element : this.ctx;
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(options.cx, options.cy, options.r, 0, 2 * Math.PI);
                this.ctx.fillStyle = options.fill;
                this.ctx.globalAlpha = options.opacity;
                this.ctx.fill();
                this.ctx.lineWidth = options["stroke-width"];
                dashArray = options["stroke-dasharray"] ? options["stroke-dasharray"].split(",") : false;
                if (dashArray) this.ctx.setLineDash(dashArray);
                this.ctx.strokeStyle = options.stroke;
                this.ctx.stroke();
                this.ctx.restore();
                this.ctx = canvasCtx;
            } else {
                var legendCtx = this.lgndCtx;
                this.lgndCtx = element != undefined ? element : this.lgndCtx;
                this.lgndCtx.save();
                this.lgndCtx.beginPath();
                this.lgndCtx.arc(options.cx, options.cy, options.r, 0, 2 * Math.PI);
                this.lgndCtx.fillStyle = options.fill;
                this.lgndCtx.globalAlpha = options.opacity;
                this.lgndCtx.fill();
                this.lgndCtx.lineWidth = options["stroke-width"];
                this.lgndCtx.strokeStyle = options.stroke;
                this.lgndCtx.stroke();
                this.lgndCtx.restore();
                this.lgndCtx = legendCtx;
            }
        },

        drawPolyline: function (options, element) {

            this.ctx.save();
            this.ctx.beginPath();
            var points = options.points.split(" ");
            for (var i = 0; i < points.length - 1; i++) {
                var point = points[i].split(",");
                var x = point[0];
                var y = point[1];
                if (i == 0)
                    this.ctx.moveTo(x, y);
                else
                    this.ctx.lineTo(x, y);
            }
            this.ctx.lineWidth = options["stroke-width"];
            this.ctx.strokeStyle = options.stroke;
            this.ctx.stroke();
            this.ctx.restore();
        },
        drawPolygon: function (options, element) {

        },
        setFillAttribute: function (element, options) {

        },
        setStrokeAttribute: function (element, options) {

        },
        changePathValue: function (options) {

        },


        drawArc: function (w, h, options) {
            var x = 0, y = 0;

        },
        changeVMLStyle: function ($element, options) {

        },
        applyVMLStyle: function ($element, options) {

        },

        drawEllipse: function (options, element) {
            var canvasCtx = this.ctx;
            this.ctx = element != undefined ? element : this.ctx;
            var circumference = Math.max(options.rx, options.ry);
            var scaleX = options.rx / circumference;
            var scaleY = options.ry / circumference;
            if (!options.lgndCtx) {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.translate(options.cx, options.cy);
                this.ctx.save();
                this.ctx.scale(scaleX, scaleY);
                this.ctx.arc(0, 0, circumference, 0, 2 * Math.PI, false);
                this.ctx.fillStyle = options.fill;
                this.ctx.fill();
                this.ctx.restore();
                this.ctx.lineWidth = options["stroke-width"];
                this.ctx.strokeStyle = options.stroke;
                this.ctx.stroke();
                this.ctx.restore();
                this.ctx = canvasCtx;
            } else {
                this.lgndCtx.save();
                this.lgndCtx.beginPath();
                this.lgndCtx.translate(options.rx, options.ry);
                this.lgndCtx.scale(scaleX, scaleY);
                this.lgndCtx.arc(options.cx - options.rx, options.cy * 2 - options.rx, options.rx, 0, 2 * Math.PI, false);
                this.lgndCtx.fillStyle = options.fill;
                this.lgndCtx.fill();
                this.lgndCtx.restore();
                this.lgndCtx.lineWidth = options["stroke-width"];
                this.lgndCtx.strokeStyle = options.stroke;
                this.lgndCtx.stroke();
                this.lgndCtx.restore();
            }
        },

        _getAttrVal: function (ele, val, option) {
            var value = $(ele).attr(val);
            if (value != null)
                return value;
            else
                return option;
        },
        _setAttr: function (element, attribute) {

        },

        setSpanAttr: function (options, label, element) {

        },

        //text element attributes values are replaced 
        _textAttrReplace: function (options, label, font, $Ele) {

        },

        drawImage: function (options, element) {
            this.ctx.save();
            var renderer = this;
            var imageObj = new Image();
            imageObj.src = options.href;
            imageObj.onload = function () {
                renderer.ctx.drawImage(imageObj, options.x, options.y, options.width, options.height);
            }
            this.ctx.restore();
        },

        createDefs: function () {

        },

        createGroup: function (options) {

        },

        createText: function (options, label) {
            var text = document.createElement("div");
            var diff = 1.1; // difference between svg and div element rotated text height
            $(text).css({
                "transform": options.rotateAngle,
                "font-family": parseFloat(options["font-family"]),
                "font-size": parseFloat(options["font-size"]) * diff,
                "position": "absolute"
            });
            if (!ej.util.isNullOrUndefined(label))
                text.textContent = label;
            return text;
        },


        //Draw clip path for each series to avoid series overlap in multiple axes zooming
        drawAxesBoundsClipPath: function (gSeriesGroupEle, options, invertedAxis) {
            var clipOptions = options;

        },

        getAttrVal: function (ele, val, option) {

        },

        hexFromRGB: function (color) {

        },

        createDelegate: function (context, handler) {

        },

        drawClipPath: function (options, element) {

        },

        drawCircularClipPath: function (options, element) {

        },

        append: function (childEle, parentEle) {
            $(childEle).appendTo(parentEle);
        },

        createLegendCanvas: function (element) {
            this.legendsvgObj = document.createElement('canvas');
            this._rootId = jQuery(element).attr("id");
            this.legendsvgObj.setAttribute('id', "legend_" + this._rootId + '_canvas');
            this.lgndCtx = this.legendsvgObj.getContext("2d");
            return this.legendsvgObj;
        }

    };
})(jQuery);


