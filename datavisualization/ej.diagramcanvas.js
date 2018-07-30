
(function ($, ej) {
    "use strict";

    //#region SVG
    var Canvas = (function () {
        function Canvas(attr) {
            this.document = document.createElement("canvas");
            this.id = attr.id;
            this._scaleX = 1;
            this._scaleY = 1;
            if (attr) {
                ej.datavisualization.Diagram.Util.attr(this.document, attr);
            }
            return this;
        }

        //rect
        Canvas.prototype.rect = function (x, y, width, height, rotation, style) {
            var ctx = this.document.getContext("2d");
            ctx.beginPath();
            if (rotation && rotation.angle) {
                this.rotateContext(rotation, ctx);
            }
            if (style) {
                this.setStyle(style, ctx);
                if (style.dashArray)
                    this.dashedRectangle(x, y, width, height, style.dashArray);
            }
            ctx.fillRect(x, y, width, height);
            ctx.strokeRect(x, y, width, height);
            ctx.closePath();
            if (rotation && rotation.angle)
                ctx.restore();
        }
        //Rounded rect
        Canvas.prototype.roundedRect = function (x, y, width, height, radius, rotation, style) {
            var ctx = this.document.getContext("2d");
            ctx.beginPath();
            if (rotation && rotation.angle) {
                this.rotateContext(rotation, ctx);
            }
            var points = [{ x: x + radius, y: y }, { x: x + width - radius, y: y },
                { x: x + width, y: y + radius }, { x: x + width, y: y + height - radius },
                { x: x + width - radius, y: y + height }, { x: x + radius, y: y + height },
                { x: x, y: y + height - radius }, { x: x, y: y + radius }
            ];
            var corners = [{ x: x + width, y: y }, { x: x + width, y: y + height }, { x: x, y: y + height }, { x: x, y: y }];
            var corner = 0;
            var point2, next;
            if (style)
                this.setStyle(style, ctx);
            //draw
            ctx.moveTo(points[0].x, points[0].y);
            var i;
            for (i = 0; i < points.length; i = i + 2) {
                point2 = points[i + 1];
                ctx.lineTo(point2.x, point2.y);
                next = points[i + 2] || points[0];
                ctx.quadraticCurveTo(corners[corner].x, corners[corner].y, next.x, next.y);
                corner++;
            }
            ctx.fill();
            if (style && style.dashArray) {
                corner = 0;
                for (i = 0; i < points.length; i = i + 2) {
                    this.dashedLine(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, style.dashArray);
                    this.quadraticCurve(points[i + 1], corners[corner], points[i + 2] || points[0], style);
                    corner++;
                }
            }
            ctx.stroke();
            ctx.closePath();
            if (rotation && rotation.angle)
                ctx.restore();
        }
        //ellipse
        Canvas.prototype.ellipse = function (cx, cy, rx, ry, rotation, style) {
            var ctx = this.document.getContext("2d");
            if (style) {
                this.setStyle(style, ctx);
            }
            var r = 4 * ((Math.sqrt(2) - 1) / 3);
            ctx.beginPath();
            if (rotation && rotation.angle) {
                this.rotateContext(rotation, ctx);
            }
            ctx.moveTo(cx, cy - ry);
            ctx.bezierCurveTo(cx + (r * rx), cy - ry, cx + rx, cy - (r * ry), cx + rx, cy);
            ctx.bezierCurveTo(cx + rx, cy + (r * ry), cx + (r * rx), cy + ry, cx, cy + ry);
            ctx.bezierCurveTo(cx - (r * rx), cy + ry, cx - rx, cy + (r * ry), cx - rx, cy);
            ctx.bezierCurveTo(cx - rx, cy - (r * ry), cx - (r * rx), cy - ry, cx, cy - ry);
            ctx.fill();
            if (style && style.dashArray) {
                this.bezierCurve(ej.datavisualization.Diagram.Point(cx, cy - ry),
                    new ej.datavisualization.Diagram.Point(cx + (r * rx), cy - ry),
                    new ej.datavisualization.Diagram.Point(cx + rx, cy - (r * ry)),
                    new ej.datavisualization.Diagram.Point(cx + rx, cy), style);
                this.bezierCurve(ej.datavisualization.Diagram.Point(cx + rx, cy),
                    new ej.datavisualization.Diagram.Point(cx + rx, cy + (r * ry)),
                    new ej.datavisualization.Diagram.Point(cx + (r * rx), cy + ry),
                    new ej.datavisualization.Diagram.Point(cx, cy + ry), style);
                this.bezierCurve(ej.datavisualization.Diagram.Point(cx, cy + ry),
                    new ej.datavisualization.Diagram.Point(cx - (r * rx), cy + ry),
                    new ej.datavisualization.Diagram.Point(cx - rx, cy + (r * ry)),
                    new ej.datavisualization.Diagram.Point(cx - rx, cy), style);
                this.bezierCurve(ej.datavisualization.Diagram.Point(cx - rx, cy),
                    new ej.datavisualization.Diagram.Point(cx - rx, cy - (r * ry)),
                    new ej.datavisualization.Diagram.Point(cx - (r * rx), cy - ry),
                    new ej.datavisualization.Diagram.Point(cx, cy - ry), style);
            }
            ctx.stroke();
            ctx.closePath();
            if (rotation && rotation.angle)
                ctx.restore();
        }

        //circle
        Canvas.prototype.circle = function (centerx, centery, radius, rotation, style) {
            var ctx = this.document.getContext("2d");
            if (style) {
                this.setStyle(style, ctx);
            }
            if (rotation && rotation.angle) {
                this.rotateContext(rotation, ctx);
            }
            if (style && style.dashArray) {
                ctx.beginPath();
                ctx.arc(centerx, centery, radius, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            }
            else { this.ellipse(centerx, centery, radius * 2, radius * 2, rotation, style); }
            if (rotation && rotation.angle)
                ctx.restore();
        }
        Canvas.prototype.arc = function (centerx, centery, radius, angle, sweep, style) {
            var rotation = { "angle": angle, x: centerx, y: centery };
            var ctx = this.document.getContext("2d");
            if (style) {
                this.setStyle(style, ctx);
            }
            if (rotation && rotation.angle) {
                this.rotateContext(rotation, ctx);
            }
            ctx.beginPath();
            var stAngle = 0;
            var endAngle = Math.PI;
            if (!sweep) {
                stAngle = Math.PI;
                endAngle = 0;
            }
            if (style && style.dashArray) {
                ctx.arc(centerx, centery, radius, stAngle, endAngle);
            }
            else { ctx.arc(centerx, centery, radius, stAngle, endAngle); }
            //ctx.fill();
            ctx.stroke();
            ctx.closePath();
            if (rotation && rotation.angle)
                ctx.restore();
        }

        //path
        Canvas.prototype.path = function (path, x, y, width, height, rotation, style) {
            var ctx = this.document.getContext("2d");
            if (style) {
                this.setStyle(style, ctx);
            }
            ctx.beginPath();
            var transX = x, transY = y;
            ctx.translate(transX, transY);
            if (rotation && rotation.angle) {
                this.rotateContext(rotation, ctx);
            }
            var shape = document.createElementNS('http://www.w3.org/2000/svg', "path");
            shape.setAttribute("d", path);
            this.document.appendChild(shape);
            var segments = this.getSegments(shape);
            var offsetX = x;
            var offsetY = y;
            var pathstr = "";
            var x0, y0, x1, y1, x2, y2, segs = segments;
            for (var x = 0, y = 0, i = 0, length = segs.length; i < length; ++i) {
                var seg = segs[i], char = seg.command;
                if ('x1' in seg) x1 = seg.x1;
                if ('x2' in seg) x2 = seg.x2;
                if ('y1' in seg) y1 = seg.y1;
                if ('y2' in seg) y2 = seg.y2;
                if ('x' in seg) x = seg.x;
                if ('y' in seg) y = seg.y;
                switch (char) {
                    case 'M':
                        ctx.moveTo(x, y); seg.x = x; seg.y = y;
                        break;
                    case 'L':
                        ctx.lineTo(x, y);
                        seg.x = x; seg.y = y;
                        break;
                    case 'C':
                        ctx.bezierCurveTo(x1, y1, x2, y2, x, y);
                        seg.x = x; seg.y = y; seg.x1 = x1; seg.y1 = y1; seg.x2 = x2; seg.y2 = y2;
                        break;
                    case 'Q':
                        ctx.quadraticCurveTo(x1, y1, x, y);
                        seg.x = x; seg.y = y; seg.x1 = x1; seg.y1 = y1;
                        break;
                    case 'A':
                        var curr = new ej.datavisualization.Diagram.Point(x0, y0);
                        var rx = seg.r1, ry = seg.r2;
                        var xAxisRotation = seg.angle * (Math.PI / 180.0);
                        var largeArcFlag = seg.largeArcFlag;
                        var sweepFlag = seg.sweepFlag;
                        var cp = new ej.datavisualization.Diagram.Point(x, y);

                        var currp = new ej.datavisualization.Diagram.Point(
                            Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0,
                            -Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0
                        );

                        var l = Math.pow(currp.x, 2) / Math.pow(rx, 2) + Math.pow(currp.y, 2) / Math.pow(ry, 2);
                        if (l > 1) {
                            rx *= Math.sqrt(l);
                            ry *= Math.sqrt(l);
                        }

                        var s = (largeArcFlag == sweepFlag ? -1 : 1) * Math.sqrt(
                            ((Math.pow(rx, 2) * Math.pow(ry, 2)) - (Math.pow(rx, 2) * Math.pow(currp.y, 2)) - (Math.pow(ry, 2) * Math.pow(currp.x, 2))) /
                            (Math.pow(rx, 2) * Math.pow(currp.y, 2) + Math.pow(ry, 2) * Math.pow(currp.x, 2))
                        );
                        if (isNaN(s)) s = 0;
                        var cpp = new ej.datavisualization.Diagram.Point(s * rx * currp.y / ry, s * -ry * currp.x / rx);

                        var centp = new ej.datavisualization.Diagram.Point(
                            (curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y,
                            (curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y
                        );
                        // vector magnitude
                        var m = function (v) { return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2)); }
                        // ratio between two vectors
                        var r = function (u, v) { return (u[0] * v[0] + u[1] * v[1]) / (m(u) * m(v)) }
                        // angle between two vectors
                        var a = function (u, v) { return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(r(u, v)); }
                        // initial angle
                        var a1 = a([1, 0], [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry]);
                        // angle delta
                        var u = [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry];
                        var v = [(-currp.x - cpp.x) / rx, (-currp.y - cpp.y) / ry];
                        var ad = a(u, v);
                        if (r(u, v) <= -1) ad = Math.PI;
                        if (r(u, v) >= 1) ad = 0;

                        var dir = 1 - sweepFlag ? 1.0 : -1.0;
                        var ah = a1 + dir * (ad / 2.0);
                        var halfWay = new ej.datavisualization.Diagram.Point(
                            centp.x + rx * Math.cos(ah),
                            centp.y + ry * Math.sin(ah)
                        );
                        seg.centp = centp;
                        seg.xAxisRotation = xAxisRotation;
                        seg.rx = rx;
                        seg.ry = ry;
                        seg.a1 = a1; seg.ad = ad; seg.sweepFlag = sweepFlag;
                        if (ctx != null) {
                            var r = rx > ry ? rx : ry;
                            var sx = rx > ry ? 1 : rx / ry;
                            var sy = rx > ry ? ry / rx : 1;
                            ctx.save();
                            ctx.translate(centp.x, centp.y);
                            ctx.rotate(xAxisRotation);
                            ctx.scale(sx, sy);
                            ctx.arc(0, 0, r, a1, a1 + ad, 1 - sweepFlag);
                            ctx.scale(1 / sx, 1 / sy);
                            ctx.rotate(-xAxisRotation);
                            ctx.translate(-centp.x, -centp.y);
                            ctx.restore();
                        }
                        break;
                    case 'Z':
                    case 'z':
                        ctx.closePath();
                        x = x0; y = y0;
                        break;
                }
                // Record the start of a subpath
                x0 = x, y0 = y;
            }
            ctx.fill();
            if (style && style.dashArray)
                this.drawDashedPath(segs, style);
            else
                ctx.stroke();
            ctx.translate(-transY, -transY);
            if (rotation && rotation.angle)
                ctx.restore();
        }

        Canvas.prototype.getSegments = function (shape) {
            var x0, y0, x1, y1, x2, y2, initx, inity, segs = ej.datavisualization.Diagram.Util.convertPathToArray(shape.getAttribute("d"));
            var segments = [];
            for (var x = 0, y = 0, i = 0, length = segs.length; i < length; ++i) {
                var seg = segs[i], char = seg.pathSegTypeAsLetter;
                if ('x1' in seg) x1 = seg.x1;
                if ('x2' in seg) x2 = seg.x2;
                if ('y1' in seg) y1 = seg.y1;
                if ('y2' in seg) y2 = seg.y2;
                if ('x' in seg) x = seg.x;
                if ('y' in seg) y = seg.y;
                switch (char) {
                    case 'M':
                        segments.push({ command: "M", x: x, y: y });
                        break;
                    case 'L':
                        segments.push({ command: "L", x0: x0, y0: y0, x: x, y: y });
                        break;
                    case 'H':
                        segments.push({ command: "L", x0: x0, y0: y0, x: x, y: y0 });
                        break;
                    case 'V':
                        segments.push({ command: "L", x0: x0, y0: y0, x: x0, y: y });
                        break;
                    case 'C':
                        segments.push({ command: "C", x0: x0, y0: y0, x1: x1, y1: y1, x2: x2, y2: y2, x: x, y: y });
                        break;
                    case 'S':
                        if (prev) {
                            if (prev.command == "C" || prev.command == "S") {
                                var ctrl = { x: prev.x2, y: prev.y2 };
                            }
                            else
                                var ctrl = { x: prev.x0, y: prev.y0 };
                            var cpt2 = new ej.datavisualization.Diagram.Point(2 * x0 - ctrl.x, 2 * y0 - ctrl.y);

                            segments.push({ command: "C", x0: x0, y0: y0, x1: cpt2.x, y1: cpt2.y, x2: x2, y2: y2, x: x, y: y });
                        }
                        break;
                    case 'Q':
                        //ctx.quadraticCurveTo(x1, y1, x, y);
                        segments.push({ command: "Q", x0: x0, y0: y0, x1: x1, y1: y1, x: x, y: y });
                        break;
                    case 'T':
                        if (prev) {
                            if (prev.command == "Q") {
                                var ctrl = { x: prev.x1, y: prev.y1 };
                            }
                            else
                                var ctrl = { x: prev.x0, y: prev.y0 };
                            var cpt2 = new ej.datavisualization.Diagram.Point(2 * x0 - ctrl.x, 2 * y0 - ctrl.y);

                            segments.push({ command: "Q", x0: x0, y0: y0, x1: cpt2.x, y1: cpt2.y, x: x, y: y });
                        }
                        break;
                    case 'A'://need to update for "A"
                        var newSeg = $.extend(true, {}, seg);
                        newSeg.command = "A";
                        segments.push(newSeg);
                        break;
                    case 'Z':
                    case 'z':
                        segments.push({ command: "L", x0: x, y0: y, x: initx, y: inity });
                        x = x0; y = y0;
                        break;
                }
                var prev = segments[segments.length - 1];
                // Record the start of a subpath
                if (char === 'M' || char === 'm') {
                    initx = x, inity = y;
                }
                x0 = x, y0 = y;
            }
            return segments;
        }

        Canvas.prototype.drawDashedPath = function (segs, style) {
            var x1, y1, x2, y2, x0, y0;
            var initial;
            for (var x = 0, y = 0, i = 0, length = segs.length; i < length; ++i) {
                var seg = segs[i], char = seg.command;
                if ('x1' in seg) x1 = seg.x1;
                if ('x2' in seg) x2 = seg.x2;
                if ('y1' in seg) y1 = seg.y1;
                if ('y2' in seg) y2 = seg.y2;
                if ('x' in seg) x = seg.x;
                if ('y' in seg) y = seg.y;
                switch (char) {
                    case 'M':
                        initial = { x: x, y: y };
                        break;
                    case 'L':
                        this.dashedLine(x0, y0, x, y, style.dashArray);
                        break;
                    case 'H':
                        this.dashedLine(x0, y0, x, y0, style.dashArray);
                        break;
                    case 'V':
                        this.dashedLine(x0, y0, x0, y, style.dashArray);
                        break;
                    case 'C':
                        this.bezierCurve(ej.datavisualization.Diagram.Point(x0, y0), ej.datavisualization.Diagram.Point(x1, y1), ej.datavisualization.Diagram.Point(x2, y2), ej.datavisualization.Diagram.Point(x, y), style);
                        break;
                    case 'Q':
                        this.quadraticCurve(ej.datavisualization.Diagram.Point(x0, y0), ej.datavisualization.Diagram.Point(x1, y1), ej.datavisualization.Diagram.Point(x, y), style);
                        break;
                    case 'A':
                        var ctx = this.document.getContext("2d");
                        if (ctx != null) {
                            var r = seg.rx > seg.ry ? seg.rx : seg.ry;
                            var sx = seg.rx > seg.ry ? 1 : seg.rx / seg.ry;
                            var sy = seg.rx > seg.ry ? seg.ry / seg.rx : 1;
                            ctx.save();
                            ctx.translate(seg.centp.x, seg.centp.y);
                            ctx.rotate(seg.xAxisRotation);
                            ctx.scale(sx, sy);
                            this.dashedArc(r, 0, 0, seg.a1, seg.a1 + seg.ad, 1 - seg.sweepFlag, style.dashArray);
                            ctx.scale(1 / sx, 1 / sy);
                            ctx.rotate(-seg.xAxisRotation);
                            ctx.translate(-seg.centp.x, -seg.centp.y);
                            ctx.restore();
                        }
                        break;
                    case 'Z':
                    case 'z':
                        //ctx.closePath();
                        this.dashedLine(x, y, initial.x, initial.y, style.dashArray);
                        x = x0; y = y0;
                        break;
                }
                // Record the start of a subpath
                //if (char === 'M' || char === 'm') x0 = x, y0 = y;
                x0 = x, y0 = y;
            }
            //ctx.fill();
        }
        Canvas.prototype.calculateCirclePoints = function (radius, cx, cy, stAngle, endAngle, couterClockwise, dashSize) {
            stAngle = stAngle * 180 / Math.PI;
            endAngle = endAngle * 180 / Math.PI;
            var n = (2 * Math.PI * radius) * (Math.abs(stAngle - endAngle) / 360) * 0.7;
            var alpha = Math.abs(stAngle - endAngle) / n;
            alpha = couterClockwise ? alpha * -1 : alpha;
            var i = 0;
            var points = [];
            while (i < n) {
                points.push(ej.datavisualization.Diagram.Geometry.transform({ x: cx, y: cy }, stAngle + alpha * i, radius));
                i++;
            }
            return points;
        }

        //polygon
        Canvas.prototype.polygon = function (points, rotation, style) {
            var ctx = this.document.getContext("2d");
            ctx.beginPath();
            if (rotation && rotation.angle) {
                this.rotateContext(rotation, ctx);
            }
            if (style) {
                this.setStyle(style, ctx);
            }
            ctx.moveTo(points[0].x, points[0].y);
            for (var i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.lineTo(points[0].x, points[0].y);
            ctx.fill();
            if (style && style.dashArray) {
                for (var i = 1; i < points.length; i++) {
                    this.line(points[i - 1], points[i], style);
                }
                this.line(points[i - 1], points[0], style);
            }
            ctx.stroke();
            ctx.closePath();
            if (rotation && rotation.angle)
                ctx.restore();
        }

        //image
        Canvas.prototype.image = function (image, x, y, width, height, rotation, style, alignOptions) {
            var ctx = this.document.getContext("2d");
            ctx.beginPath();
            if (rotation && rotation.angle) {
                this.rotateContext(rotation, ctx);
            }
            if (style) {
                this.setStyle(style, ctx);
            }
            if (width && height) {
                var srcWidth = image.width, srcHeight = image.height, destinationW = width, destinationH = height;
                var resultWidth, resultHeight;

                if (alignOptions && alignOptions.alignment !== "none") {
                    var xalign = alignOptions.alignment.substr(1, 3), yalign = alignOptions.alignment.substr(5, 3);
                    if (alignOptions.scale === "slice") {

                        var a = function () {
                            resultWidth = destinationW;
                            resultHeight = srcHeight * destinationW / srcWidth;
                        };

                        var b = function () {
                            resultWidth = srcWidth * destinationH / srcHeight;
                            resultHeight = destinationH;
                        };

                        if (destinationW > destinationH) {
                            a();
                            if (destinationH > resultHeight) {
                                b();
                            }
                        } else if (destinationW === destinationH) {
                            if (srcWidth > srcHeight) {
                                b();
                            } else {
                                a();
                            }
                        } else {
                            b();
                            if (destinationW > resultWidth) {
                                a();
                            }
                        }

                        var x1 = this.getSliceOffset(xalign, resultWidth, destinationW, srcWidth);
                        var y1 = this.getSliceOffset(yalign, resultHeight, destinationH, srcHeight);

                        var s = {
                            sx: x1, sy: y1, swidth: srcWidth - x1, sheight: srcHeight - y1, dx: 0, dy: 0,
                            dwidth: resultWidth - (x1 * (resultWidth / srcWidth)),
                            dheight: resultHeight - (y1 * (resultHeight / srcHeight)),
                        };

                        var canvas1 = document.createElement("canvas");
                        canvas1.setAttribute("width", width);
                        canvas1.setAttribute("height", height);
                        var ctx1 = canvas1.getContext('2d');
                        ctx1.drawImage(image, s.sx, s.sy, s.swidth, s.sheight, s.dx, s.dy, s.dwidth, s.dheight);
                        ctx.drawImage(canvas1, x, y, width, height);

                    }
                    else if (alignOptions.scale === "meet") {

                        var srcRatio = (srcHeight / srcWidth), destRatio = (destinationH / destinationW),

                        resultWidth = destRatio > srcRatio ? destinationW : destinationH / srcRatio,
                        resultHeight = destRatio > srcRatio ? destinationW * srcRatio : destinationH;

                        x += this.getMeetOffset(xalign, resultWidth, destinationW);
                        y += this.getMeetOffset(yalign, resultHeight, destinationH);

                        ctx.drawImage(image, 0, 0, srcWidth, srcHeight, x, y, resultWidth, resultHeight);
                    }
                    else
                        ctx.drawImage(image, x, y, width, height);
                }
                else
                    ctx.drawImage(image, x, y, width, height);
            }
            else
                ctx.drawImage(image, x, y);
            ctx.closePath();
            if (rotation && rotation.angle)
                ctx.restore();
        }

        Canvas.prototype.getSliceOffset = function (arg, res, dest, src) {
            switch (arg) {
                case 'min': return 0;
                case 'mid': return (res - dest) / 2 * src / res;
                case 'max': return (res - dest) * src / res;
                default: return 'invalid';
            };
        }

        Canvas.prototype.getMeetOffset = function (arg, res, dest) {

            var max = Math.max(res, dest),
              min = Math.min(res, dest);

            switch (arg) {
                case 'min': return 0;
                case 'mid': return (max - min) / 2;
                case 'max': return max - min;
                default: return 'invalid';
            }
        }

        //text
        Canvas.prototype.text = function (text, x, y, rotation, style) {
            var ctx = this.document.getContext("2d");
            ctx.beginPath();
            if (rotation && rotation.angle) {
                this.rotateContext(rotation, ctx);
            }
            if (style)
                this.setStyle(style, ctx);
            ctx.fillText(text.text, x, y);
            ctx.closePath();
            if (rotation && rotation.angle)
                ctx.restore();
        }

        //line
        Canvas.prototype.line = function (start, end, style, dontstart, dontclose) {
            var ctx = this.document.getContext("2d");
            if (!dontstart) {
                ctx.beginPath();
                if (style) {
                    this.setStyle(style, ctx);
                }
            }
            if (style && style.dashArray) {
                this.dashedLine(start.x, start.y, end.x, end.y, style.dashArray);
            }
            else {
                if (!dontstart)
                    ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
            }
            if (!dontclose)
                ctx.closePath();
        }

        //polyline
        Canvas.prototype.polyline = function (points, style) {
            var ctx = this.document.getContext("2d");
            ctx.beginPath();
            if (style) {
                this.setStyle(style, ctx);
            }
            for (var i = 1; i < points.length; i++) {
                this.line(points[i - 1], points[i], style);
            }
            ctx.stroke();
        }

        //bezier curve
        Canvas.prototype.bezierCurve = function (startPoint, cpt1, cpt2, cpt3, style) {
            var ctx = this.document.getContext("2d");
            ctx.beginPath();
            ctx.moveTo(startPoint.x, startPoint.y);
            if (style) {
                this.setStyle(style, ctx);
            }
            if (style && style.dashArray) {
                var points = [];
                this.flattenCubicBezier(points, startPoint, cpt1, cpt2, cpt3);
                var dashLength = 0;
                for (var i = 0; i < style.dashArray.length; i++) {
                    dashLength += Number(style.dashArray[i]);
                }
                var dashcount = points.length / dashLength;
                var draw = true;
                var drawn = 0;
                for (var i = 0; i < dashcount; i++) {
                    for (var j = 0; j < style.dashArray.length; j++) {
                        drawn += Number(style.dashArray[j]);
                        if (drawn < points.length) {
                            if (draw) {
                                ctx.lineTo(points[drawn].x, points[drawn].y);
                            }
                            else ctx.moveTo(points[drawn].x, points[drawn].y);
                        }
                        draw = !draw;
                    }
                }


            }
            else {
                ctx.moveTo(startPoint.x, startPoint.y);
                ctx.bezierCurveTo(cpt1.x, cpt1.y, cpt2.x, cpt2.y, cpt3.x, cpt3.y);
            }
            ctx.stroke();
        }

        Canvas.prototype.quadraticCurve = function (startPoint, cpt1, cpt2, style) {
            var ctx = this.document.getContext("2d");
            ctx.beginPath();
            ctx.moveTo(startPoint.x, startPoint.y);
            if (style) {
                this.setStyle(style, ctx);
            }
            if (style && style.dashArray) {
                var points = [];
                this.flattenQuadraticBezier(points, startPoint, cpt1, cpt2);
                var dashLength = 0;
                for (var i = 0; i < style.dashArray.length; i++) {
                    dashLength += Number(style.dashArray[i]);
                }
                var dashcount = points.length / dashLength;
                var draw = true;
                var drawn = 0;
                for (var i = 0; i < dashcount; i++) {
                    for (var j = 0; j < style.dashArray.length; j++) {
                        drawn += Number(style.dashArray[j]);
                        if (drawn < points.length) {
                            if (draw) {
                                ctx.lineTo(points[drawn].x, points[drawn].y);
                            }
                            else ctx.moveTo(points[drawn].x, points[drawn].y);
                        }
                        draw = !draw;
                    }
                }

            }
            else {
                ctx.moveTo(startPoint.x, startPoint.y);
                ctx.quadraticCurveTo(cpt1.x, cpt1.y, cpt2.x, cpt2.y);
            }
            ctx.stroke();
        }

        //arrow
        Canvas.prototype.arrow = function (point, rotation, size, isOpen, style) {
            var ctx = this.document.getContext("2d");
            ctx.beginPath();
            if (style) {
                this.setStyle(style, ctx);
            }
            if (rotation && rotation.angle) {
                this.rotateContext(rotation, ctx);
            }
            ctx.moveTo(point.x + size.width, point.y + size.height / 2);
            ctx.lineTo(point.x, point.y);
            ctx.lineTo(point.x + size.width, point.y - size.height / 2);
            if (!isOpen) {
                ctx.closePath();
                ctx.fill();
            }
            ctx.stroke();
            if (rotation && rotation.angle)
                ctx.restore();
        }

        //diamond
        Canvas.prototype.diamond = function (point, rotation, size, style) {
            var ctx = this.document.getContext("2d");
            ctx.beginPath();
            if (style) {
                this.setStyle(style, ctx);
            }
            if (rotation && rotation.angle) {
                this.rotateContext(rotation, ctx);
            }
            ctx.moveTo(point.x + size.width, point.y);
            ctx.lineTo(point.x + size.width / 2, point.y + size.height / 2);
            ctx.lineTo(point.x, point.y);
            ctx.lineTo(point.x + size.width / 2, point.y - size.height / 2);
            ctx.lineTo(point.x + size.width, point.y);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
            if (rotation && rotation.angle)
                ctx.restore();
        }

        Canvas.prototype.dashedLine = function (x1, y1, x2, y2, dashArray) {
            var ctx = this.document.getContext("2d");
            ctx.save();
            var dx = (x2 - x1), dy = (y2 - y1);
            var length = Math.sqrt(dx * dx + dy * dy);
            var angle = Math.atan2(dy, dx);
            ctx.beginPath();
            ctx.translate(x1, y1);
            ctx.moveTo(0, 0);
            ctx.rotate(angle);
            var dcount = dashArray.length;
            var dindex = 0, draw = true;
            var x = 0;
            while (length > x) {
                x += Number(dashArray[dindex++ % dcount]);
                if (x > length) x = length;
                draw ? ctx.lineTo(x, 0) : ctx.moveTo(x, 0);
                draw = !draw;
                ctx.stroke();
            }
            ctx.restore();
        }

        Canvas.prototype.dashedRectangle = function (x, y, width, height, dashArray) {
            this.dashedLine(x, y, x + width, y, dashArray);
            this.dashedLine(x + width, y, x + width, y + height, dashArray);
            this.dashedLine(x + width, y + height, x, y + height, dashArray);
            this.dashedLine(x, y + height, x, y, dashArray);
        }

        Canvas.prototype.dashedArc = function (radius, cx, cy, stAngle, endAngle, couterClockwise, dashArray) {
            var dashLength = 0;
            for (var i = 0; i < dashArray.length; i++) {
                dashLength += Number(dashArray[i]);
            }
            var points = this.calculateCirclePoints(radius, cx, cy, stAngle, endAngle, couterClockwise, dashLength);
            var ctx = this.document.getContext("2d");
            ctx.beginPath();

            var dashcount = points.length / dashLength;
            var draw = true;
            var drawn = 0;
            for (var i = 0; i < dashcount; i++) {
                for (var j = 0; j < dashArray.length; j++) {
                    drawn += Number(dashArray[j]);
                    if (drawn < points.length) {
                        if (draw) {
                            ctx.lineTo(points[drawn].x, points[drawn].y);
                            ctx.stroke();
                        }
                        else ctx.moveTo(points[drawn].x, points[drawn].y);
                    }
                    draw = !draw;
                }
            }
            ctx.closePath();
        }
        Canvas.prototype.absolutePath = function (path) {
            var minx, miny, maxx, maxy;
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
                            newSeg = { pathSegTypeAsLetter: "A", x: x, y: y, r1: r1, r2: r2, angle: angle, largeArcFlag: largeArcFlag, sweepFlag: sweepFlag };
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

            Canvas.prototype._scalePathData = function (val, scaleFactor, oldOffset, newOffset) {
                if (val !== oldOffset) {
                    if (newOffset !== oldOffset) {
                        val = (((val * scaleFactor) - (Number(oldOffset) * scaleFactor - Number(oldOffset)))
                            + (newOffset - Number(oldOffset)));
                    }
                    else
                        val = ((Number(val) * scaleFactor) - (Number(oldOffset) * scaleFactor - Number(oldOffset)));
                }
                else {
                    if (newOffset !== oldOffset) {
                        val = newOffset;
                    }
                }
                return val;
            }
            return path;
        };

        Canvas.prototype.setStyle = function (style, ctx) {
            if (style.fill)
                ctx.fillStyle = style.fill;
            if (style.stroke)
                ctx.strokeStyle = style.stroke == "none" ? "transparent" : style.stroke;
            if (style.font)
                ctx.font = style.font;
            if (style.lineWidth)
                ctx.lineWidth = style.lineWidth;
        }

        Canvas.prototype.rotateContext = function (rotation, ctx) {
            ctx.save();
            ctx.translate(rotation.x, rotation.y);
            ctx.rotate(rotation.angle * Math.PI / 180);
            ctx.translate(-rotation.x, -rotation.y);
        }

        Canvas.prototype.pathBounds = function (segments) {
            //var segs = shape.pathSegList;
            var x1, y1, x2, y2, x0, y0;
            var minx, miny, maxx, maxy;
            for (var x = 0, y = 0, i = 0, length = segments.length; i < length; ++i) {
                var seg = segments[i], char = seg.command;
                if (i == 0 && seg.x && seg.y) {
                    minx = maxx = seg.x;
                    miny = maxy = seg.y;
                }
                //var seg = segs.getItem(i), char = seg.pathSegTypeAsLetter;
                if ('x1' in seg) x1 = seg.x1;
                if ('x2' in seg) x2 = seg.x2;
                if ('y1' in seg) y1 = seg.y1;
                if ('y2' in seg) y2 = seg.y2;
                if ('x' in seg) x = seg.x;
                if ('y' in seg) y = seg.y;

                switch (char) {
                    case 'M':
                        x0 = x; y0 = y;
                    case 'L':
                    case 'H':
                    case 'V':
                        if (x) {
                            minx = Math.min(x, minx);
                            maxx = Math.max(x, maxx);
                        }
                        if (y) {
                            miny = Math.min(y, miny);
                            maxy = Math.max(y, maxy);
                        }
                        break;
                    case 'C':

                    case 'S':
                        var bounds = this.getBezierBounds(ej.datavisualization.Diagram.Point(x0, y0), ej.datavisualization.Diagram.Point(x1, y1), ej.datavisualization.Diagram.Point(x2, y2), ej.datavisualization.Diagram.Point(x, y));
                        minx = Math.min(bounds.x, minx);
                        maxx = Math.max(bounds.x + bounds.width, maxx);
                        miny = Math.min(bounds.y, miny);
                        maxy = Math.max(bounds.y + bounds.height, maxy);
                        break;
                    case 'Q':
                    case "q":
                    case 'T':
                        var bounds = this.getQuadraticBounds(ej.datavisualization.Diagram.Point(x0, y0), ej.datavisualization.Diagram.Point(x1, y1), ej.datavisualization.Diagram.Point(x, y));
                        minx = Math.min(bounds.x, minx);
                        maxx = Math.max(bounds.x + bounds.width, maxx);
                        miny = Math.min(bounds.y, miny);
                        maxy = Math.max(bounds.y + bounds.height, maxy);
                        break;
                    case 'A':
                        break;
                    case 'Z':
                    case 'z':
                        //ctx.closePath();
                        x = x0; y = y0;
                        break;
                }
            }
            return { x: minx, y: miny, width: maxx - minx, height: maxy - miny };
        };

        Canvas.prototype.flattenCubicBezier = function (points, ptStart, ptCtrl1, ptCtrl2, ptEnd, tolerance) {
            var tolerance = 1.5;

            var max = Number((ej.datavisualization.Diagram.Geometry.distance(ptCtrl1, ptStart) +
                              ej.datavisualization.Diagram.Geometry.distance(ptCtrl2, ptCtrl1) +
                              ej.datavisualization.Diagram.Geometry.distance(ptEnd, ptCtrl2)) / tolerance);

            for (var i = 0; i <= max; i++) {
                var t = i / max;

                var x = (1 - t) * (1 - t) * (1 - t) * ptStart.x +
                           3 * t * (1 - t) * (1 - t) * ptCtrl1.x +
                           3 * t * t * (1 - t) * ptCtrl2.x +
                           t * t * t * ptEnd.x;

                var y = (1 - t) * (1 - t) * (1 - t) * ptStart.y +
                           3 * t * (1 - t) * (1 - t) * ptCtrl1.y +
                           3 * t * t * (1 - t) * ptCtrl2.y +
                           t * t * t * ptEnd.y;

                points.push(new ej.datavisualization.Diagram.Point(x, y));
            }
        }

        Canvas.prototype.flattenQuadraticBezier = function (points, ptStart, ptCtrl1, ptEnd, tolerance) {
            var tolerance = 1.5;

            var max = Number((ej.datavisualization.Diagram.Geometry.distance(ptCtrl1, ptStart) +
                             ej.datavisualization.Diagram.Geometry.distance(ptEnd, ptCtrl1)) / tolerance);

            for (var i = 0; i <= max; i++) {
                var t = i / max;

                var x = (1 - t) * (1 - t) * ptStart.x +
                                          2 * t * (1 - t) * ptCtrl1.x +
                                          t * t * ptEnd.x;

                var y = (1 - t) * (1 - t) * ptStart.y +
                           2 * t * (1 - t) * ptCtrl1.y +
                           t * t * ptEnd.y;

                points.push(new ej.datavisualization.Diagram.Point(x, y));
            }
        }

        Canvas.prototype.getBezierBounds = function (ptStart, ptCtrl1, ptCtrl2, ptEnd, tolerance) {
            var tolerance = 3;
            var minx, miny, maxx, maxy;
            var max = Number((ej.datavisualization.Diagram.Geometry.distance(ptCtrl1, ptStart) +
                              ej.datavisualization.Diagram.Geometry.distance(ptCtrl2, ptCtrl1) +
                              ej.datavisualization.Diagram.Geometry.distance(ptEnd, ptCtrl2)) / tolerance);

            for (var i = 0; i <= max; i++) {

                var t = i / max;

                var x = (1 - t) * (1 - t) * (1 - t) * ptStart.x +
                           3 * t * (1 - t) * (1 - t) * ptCtrl1.x +
                           3 * t * t * (1 - t) * ptCtrl2.x +
                           t * t * t * ptEnd.x;

                var y = (1 - t) * (1 - t) * (1 - t) * ptStart.y +
                           3 * t * (1 - t) * (1 - t) * ptCtrl1.y +
                           3 * t * t * (1 - t) * ptCtrl2.y +
                           t * t * t * ptEnd.y;
                if (i == 0) {
                    minx = maxx = x;
                    miny = maxy = y;
                }
                else {
                    minx = Math.min(x, minx);
                    miny = Math.min(y, miny);
                    maxx = Math.max(x, maxx);
                    maxy = Math.max(y, maxy);
                }
            }
            return { x: minx, y: miny, width: maxx - minx, height: maxy - miny };
        }

        Canvas.prototype.getQuadraticBounds = function (ptStart, ptCtrl1, ptEnd, tolerance) {
            var tolerance = 3;
            var minx, miny, maxx, maxy;
            var max = Number((ej.datavisualization.Diagram.Geometry.distance(ptCtrl1, ptStart) +
                              ej.datavisualization.Diagram.Geometry.distance(ptEnd, ptCtrl1)) / tolerance);

            for (var i = 0; i <= max; i++) {
                var t = i / max;


                var x = (1 - t) * (1 - t) * ptStart.x +
                           2 * t * (1 - t) * ptCtrl1.x +
                           t * t * ptEnd.x;

                var y = (1 - t) * (1 - t) * ptStart.y +
                           2 * t * (1 - t) * ptCtrl1.y +
                           t * t * ptEnd.y;

                if (i == 0) {
                    minx = maxx = x;
                    miny = maxy = y;
                }
                else {
                    minx = Math.min(x, minx);
                    miny = Math.min(y, miny);
                    maxx = Math.max(x, maxx);
                    maxy = Math.max(y, maxy);
                }
            }
            return { x: minx, y: miny, width: maxx - minx, height: maxy - miny };
        }

        return Canvas;
    })();

    ej.datavisualization.Diagram.Canvas = Canvas;
    //#endregion

    //#region Renderer
    ej.datavisualization.Diagram.CanvasContext = {

        _renderDocument: function (view, diagram) {
            var attr = {
                id: view.canvas.id + "_canvas",
                width: diagram._canvas.clientWidth,
                height: diagram._canvas.clientHeight,
                version: "1.1",
                xlink: "http://www.w3.org/1999/xlink",
                "style": view.style,
                "pointer-events": "none"
            };
            view._canvas = new ej.datavisualization.Diagram.Canvas(attr);
            diagram._view = view.canvas;
            view.canvas.appendChild(view._canvas.document);
            if (view.type == "mainview") {
                this._canvas = view.canvas;
                diagram._svg = this._svg = view._canvas;
            }
        },

        _renderGroupBackground: function (group, canvas, diagram) {
            if (!group.pivot) {
                group.pivot = {};
                group.pivot.x = .5;
                group.pivot.y = .5;
            }

            var ctx = canvas.document.getContext("2d");
            if (group.visible) {
                var rotation = { "angle": group.rotateAngle, x: group.offsetX * canvas._scaleX, y: group.offsetY * canvas._scaleY };
                ctx.save();
                ctx.translate(rotation.x, rotation.y);
                ctx.rotate(rotation.angle * Math.PI / 180);
                ctx.translate(-rotation.x, -rotation.y);
                ctx.fillStyle = group.type != "bpmn" ? group.fillColor : "transparent";
                ctx.strokeStyle = group.type != "bpmn" ? group.borderColor : "transparent";
                ctx.lineWidth = group.borderWidth;
                if (group.borderDashArray) {
                    if (group.borderDashArray.indexOf("[") != -1 || group.borderDashArray instanceof Array) {
                        dashArray = group.borderDashArray;
                    } else if (group.borderDashArray.indexOf(",") != -1) {
                        var dashArray = group.borderDashArray.split(",");
                    } else if (group.borderDashArray.indexOf(" ") != -1) {
                        var dashArray = group.borderDashArray.split(" ");
                    }
                    if (ctx.setLineDash) {
                        ctx.setLineDash(dashArray);
                    } else if (ctx.mozDash) {
                        ctx.mozDash = dashArray;
                    } else {
                        var style = { dashArray: dashArray };
                    }
                }
            }

            var x = (group.offsetX * canvas._scaleX) - (group.width * canvas._scaleX) * group.pivot.x;
            var y = (group.offsetY * canvas._scaleY) - (group.height * canvas._scaleY) * group.pivot.y;
            if (ej.datavisualization.Diagram.Util.canCrispEdges(group, diagram)) {
                x = Math.floor(x) + 0.5;
                y = Math.floor(y) + 0.5;
            }
            canvas.rect(x, y, group.width * canvas._scaleX, group.height * canvas._scaleY, null, style);
            ctx.restore();
        },

        renderGroup: function (group, canvas, diagram) {
            if (group.visible) {
                var ctx = canvas.document.getContext("2d");
                var rotation = { "angle": group.rotateAngle, x: group.offsetX * canvas._scaleX, y: group.offsetY * canvas._scaleY };
                ctx.save();
                this._renderGroupBackground(group, canvas, diagram);
                for (var i = 0; i < group.children.length; i++) {
                    var child = diagram.nameTable[diagram._getChild(group.children[i])];
                    if (child) {
                        if (child._type === "group") {
                            this.renderGroup(child, canvas, diagram);
                        }
                        else if (child._type === "node") {
                            this.renderNode(child, canvas);
                        }
                        else if (child.segments) {
                            this.renderConnector(child, canvas);
                        }
                    }
                }
                ctx.translate(rotation.x, rotation.y);
                ctx.rotate(rotation.angle * Math.PI / 180);
                ctx.translate(-rotation.x, -rotation.y);
                var x = (group.offsetX * canvas._scaleX) - (group.width * canvas._scaleX) * group.pivot.x;
                var y = (group.offsetY * canvas._scaleY) - (group.height * canvas._scaleY) * group.pivot.y;
                if (!group.isLane) {
                    this.renderLabels(group, canvas);
                    this.renderPorts(group, canvas, x, y);
                }
                if (group.isSwimlane) {
                    diagram._renderCanvasPhase(group, canvas);
                }
                if (group.annotation) {
                    if (group._annotation && group._annotation.length) {
                        for (var n = 0; n < group._annotation.length; n++) {
                            if (diagram.nameTable[group._annotation[n]]) {
                                var element = diagram.nameTable[group._annotation[n]];
                                var type = diagram.getObjectType(element);
                                if (type == "node")
                                    this.renderNode(element, canvas);
                                else if (type == "connector")
                                    this.renderConnector(element, canvas);
                            }
                        }
                    }
                }
                ctx.restore();
            }
        },
        _isExportable: function (node, canvas) {
            var state = true, content;
            if (node.type === "image") {
                try {
                    var canvas = new ej.datavisualization.Diagram.Canvas({ "id": "temp_canvas", "width": 100, "height": 100 });
                    var ctx = canvas.document.getContext("2d");
                    ctx.save();
                    canvas.rect(0, 0, (node.width * canvas._scaleX), (node.height * canvas._scaleY));
                    var image = new Image();
                    image.src = node.source;
                    canvas.image(image, 0, 0, (node.width * canvas._scaleX), (node.height * canvas._scaleY), undefined, undefined, { scale: node.scale, alignment:node.contentAlignment });
                    ctx.restore();
                    content = canvas.document.toDataURL();
                }
                catch (e) {
                    state = false;
                }
            }
            return state;
        },

        _isImageExportable: function (backgroundImage) {
            var state = true, content;
            if (backgroundImage.source) {
                try {
                    var canvas = new ej.datavisualization.Diagram.Canvas({ "id": "temp_canvas", "width": 100, "height": 100 });
                    var ctx = canvas.document.getContext("2d");
                    ctx.save();
                    var image = new Image();
                    image.src = backgroundImage.source;
                    canvas.image(image, 0, 0, 100, 100, undefined, undefined, { scale: backgroundImage.scale, alignment: backgroundImage.alignment });
                    ctx.restore();
                    content = canvas.document.toDataURL();
                }
                catch (e) {
                    state = false;
                }
            }
            return state;
        },

        renderNode: function (node, canvas, diagram) {
            var ctx = canvas.document.getContext("2d");
            if (node.visible && this._isExportable(node, canvas)) {
                var nodeWidth = node.width || node._width || 0;
                var nodeHeight = node.height || node._height || 0;
                nodeWidth *= canvas._scaleX;
                nodeHeight *= canvas._scaleY;
                var offsetX = node.offsetX * canvas._scaleX;
                var offsetY = node.offsetY * canvas._scaleY;
                var rotation = { "angle": node.rotateAngle, x: offsetX, y: offsetY };
                ctx.save();
                ctx.translate(rotation.x, rotation.y);
                ctx.rotate(rotation.angle * Math.PI / 180);
                ctx.translate(-rotation.x, -rotation.y);
                ctx.save();
                ctx.fillStyle = node.fillColor;
                ctx.strokeStyle = (node.borderColor == "none" || !node.borderWidth) ? "transparent" : node.borderColor;
                ctx.lineWidth = node.borderWidth;
                ctx.globalAlpha = node.opacity;
                var x = offsetX - nodeWidth * node.pivot.x;
                var y = offsetY - nodeHeight * node.pivot.y;
                if (ej.datavisualization.Diagram.Util.canCrispEdges(node, canvas._diagram)) {
                    x = Math.floor(x) + 0.5;
                    y = Math.floor(y) + 0.5
                }
                if (node._shape == "path")
                    this._renderGradient(node, ctx, 0, 0);
                else
                    this._renderGradient(node, ctx, x, y);
                var fill = node.fillColor;
                if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow) {
                    ctx.save();
                    ctx.strokeStyle = "lightgrey";
                    var t = ej.datavisualization.Diagram.Geometry.transform({ x: 0, y: 0 }, node.shadow.angle, node.shadow.distance);
                    ctx.fillStyle = fill != "none" || fill != "transparent" ? "lightgrey" : "none";
                    switch (node._shape) {
                        case "image":
                        case "rectangle":
                            if (node.cornerRadius)
                                canvas.roundedRect(x + t.x, y + t.y, nodeWidth, nodeHeight, node.cornerRadius, null);
                            else canvas.rect(x + t.x, y + t.y, nodeWidth, nodeHeight, null);
                            break;
                        case "ellipse":
                            canvas.ellipse(x + nodeWidth / 2 + t.x, y + nodeHeight / 2 + t.y, nodeWidth / 2, nodeHeight / 2, null);
                            break;
                        case "path":
                            var absolutePath = node._absolutePath;
                            if (canvas._scaleX !== 1 || canvas._scaleY !== 1)
                                absolutePath = ej.datavisualization.Diagram.Geometry.updatePath(x, y, nodeWidth, nodeHeight, absolutePath, canvas._diagram._svg, null, null);
                            canvas.path(absolutePath, x + t.x, y + t.y, nodeWidth, nodeHeight, null);
                            break;
                        case "polygon":
                            var points = this._updatePolygonPoints(node, canvas);
                            ctx.translate(t.x, t.y);
                            canvas.polygon(points, null, style);
                            break;
                    }
                    ctx.restore();
                }
                if (node.borderDashArray) {
                    if (node.borderDashArray.indexOf("[") != -1 || node.borderDashArray instanceof Array) {
                        dashArray = node.borderDashArray;
                    }
                    else
                        if (node.borderDashArray.indexOf(",") != -1) {
                            var dashArray = node.borderDashArray.split(",");
                        }
                        else if (node.borderDashArray.indexOf(" ") != -1) { var dashArray = node.borderDashArray.split(" "); }
                    if (ctx.setLineDash) {
                        ctx.setLineDash(dashArray);
                    }
                    else if (ctx.mozDash) { ctx.mozDash = dashArray; }
                    else
                    {
                        var style = { dashArray: dashArray };
                    }
                }
                switch (node._shape) {
                    case "rectangle":
                        if (node.cornerRadius)
                            canvas.roundedRect(x, y, nodeWidth, nodeHeight, node.cornerRadius, null, style);
                        else canvas.rect(x, y, nodeWidth, nodeHeight, null, style);
                        break;
                    case "ellipse":
                        canvas.ellipse(x + nodeWidth / 2, y + nodeHeight / 2, nodeWidth / 2, nodeHeight / 2, null, style);
                        break;
                    case "path":
                        var absolutePath = node._absolutePath;
                        if (canvas._scaleX !== 1 || canvas._scaleY !== 1)
                            absolutePath = ej.datavisualization.Diagram.Geometry.updatePath(0, 0, nodeWidth, nodeHeight, absolutePath, canvas._diagram._svg, null, null);
                        canvas.path(absolutePath, x, y, nodeWidth, nodeHeight, null, style);
                        break;
                    case "image":
                        var rotation = { angle: node.rotateAngle, x: offsetX, y: offsetY };
                        canvas.rect(x, y, nodeWidth, nodeHeight, null, style);
                        var image = new Image();
                        image.src = node.source;
                        canvas.image(image, x, y, nodeWidth, nodeHeight, undefined, undefined, { scale: node.scale, alignment: node.contentAlignment });
                        break;
                    case "text":
                        canvas.rect(x, y, nodeWidth, nodeHeight, null, style);
                        if (node.textBlock) {
                            var font = "";
                            if (node.textBlock.italic)
                                font += "italic ";
                            if (node.textBlock.bold)
                                font += "bold ";
                            font += node.textBlock.fontSize + " ";
                            font += node.textBlock.fontFamily;
                            ctx.font = font;
                            this._renderTextElement(node, node.textBlock, canvas);
                        }
                        break;
                    case "polygon":
                        var points = this._updatePolygonPoints(node, canvas);
                        canvas.polygon(points, null, style);
                        break;
                    case "native":
                    case "html":
                        diagram._raiseEvent("templateNodeRendering", { element: node, canvas: canvas });
                        break;
                }
                ctx.restore();
                this.renderPorts(node, canvas, x, y);
                if (node.type != "text")
                    this.renderLabels(node, canvas);
                if (node.annotation) {
                    if (node._annotation && node._annotation.length) {
                        for (var n = 0; n < node._annotation.length; n++) {
                            if (diagram.nameTable[node._annotation[n]]) {
                                var element = diagram.nameTable[node._annotation[n]];
                                var type = diagram.getObjectType(element);
                                if (type == "node")
                                    this.renderNode(element, canvas);
                                else if (type == "connector")
                                    this.renderConnector(element, canvas);
                            }
                        }
                    }
                }
                ctx.restore();
            }
        },

        renderPhases: function (phase, canvas, points) {
            var style;
            if (phase && canvas) {
                var ctx = canvas.document.getContext("2d");
                ctx.save();
                ctx.strokeStyle = phase.lineColor ? phase.lineColor : "black";
                ctx.lineWidth = phase.lineWidth ? phase.lineWidth : 1;
                if (phase.lineDashArray) {
                    if (phase.lineDashArray.indexOf("[") != -1 || phase.lineDashArray instanceof Array) {
                        dashArray = phase.lineDashArray;
                    }
                    else {
                        if (phase.lineDashArray.indexOf(",") != -1) {
                            var dashArray = phase.lineDashArray.split(",");
                        }
                        else if (phase.lineDashArray.indexOf(" ") != -1) { var dashArray = phase.lineDashArray.split(" "); }
                    }

                    if (ctx.setLineDash) { ctx.setLineDash(dashArray); }
                    else if (ctx.mozDash) { ctx.mozDash = dashArray; }
                    else
                        style = { "dashArray": dashArray }
                }
                if (points && points.length > 0) {
                    canvas.line(points[0], points[1], style);
                }
            }
            ctx.restore();
        },

        renderConnector: function (connector, canvas) {
            if (connector.visible) {
                var ctx = canvas.document.getContext("2d");
                ctx.save();
                ctx.strokeStyle = connector.lineColor;
                ctx.lineWidth = connector.lineWidth;
                if (connector.lineDashArray) {
                    if (connector.lineDashArray.indexOf("[") != -1 || connector.lineDashArray instanceof Array) {
                        dashArray = connector.lineDashArray;
                    }
                    else {
                        if (connector.lineDashArray.indexOf(",") != -1) {
                            var dashArray = connector.lineDashArray.split(",");
                        }
                        else if (connector.lineDashArray.indexOf(" ") != -1) { var dashArray = connector.lineDashArray.split(" "); }
                    }
                    if (ctx.setLineDash) { ctx.setLineDash(dashArray); }
                    else if (ctx.mozDash) { ctx.mozDash = dashArray; }
                    else
                        var style = { "dashArray": dashArray }
                }
                if (connector.segments) {
                    this._renderSegments(connector, canvas, style);
                }
                ctx.restore();
                this._renderDecorators(connector, canvas);
                this.renderLabels(connector, canvas);
                if (connector.shape) {
                    for (var i = 0; i < connector._inlineDecorators.length; i++)
                        this.renderNode(connector._inlineDecorators[i], canvas)
                }
            }
        },

        _renderSegments: function (connector, canvas, style) {
            for (var i = 0; i < connector.segments.length; i++) {
                var segment = connector.segments[i];
                if (segment._bridges.length > 0) {
                    for (var n = 0; n < segment._bridges.length; n++) {
                        var bridge = segment._bridges[n];
                        bridge._rendered = false;
                    }
                }
                var points = segment.points;
                var diagram = canvas._diagram;
                if (i == 0) {
                    if (diagram && connector.sourceNode) var node = diagram._findNode(connector.sourceNode);
                    points = ej.datavisualization.Diagram.SvgContext._clipDecorators(connector, segment, true, node);
                    if (segment.type == "bezier" && connector.sourceDecorator && connector.sourceDecorator.shape !== ej.datavisualization.Diagram.DecoratorShapes.None) {
                        points[0] = ej.datavisualization.Diagram.Util._adjustPoint(points[0], segment._point1, true, connector.lineWidth);
                    }
                    var startPoint = points[0];
                    var starting = true;
                }
                else starting = false;
                if (i == connector.segments.length - 1) {
                    if (diagram && connector.targetNode) var node = diagram._findNode(connector.targetNode);
                    points = ej.datavisualization.Diagram.SvgContext._clipDecorators(connector, segment, false, node);
                    if (startPoint && connector.segments.length < 2) {
                        points[0] = startPoint; startPoint = null;
                    }
                    var ending = true;
                }
                if (connector.shape && connector.shape.flow == "sequence" && connector.shape.sequence == "default" && i == 0) {
                    var beginningpoint = { x: segment.points[0].x, y: segment.points[0].y };
                    var distance = ej.datavisualization.Diagram.Geometry.distance(segment.points[0], segment.points[1]);
                    distance = Math.min(30, distance / 2);
                    var angle = ej.datavisualization.Diagram.Geometry.findAngle(segment.points[0], segment.points[1]);
                    var transferpoint = ej.datavisualization.Diagram.Geometry.transform({ x: beginningpoint.x, y: beginningpoint.y }, angle, distance);
                    var startpoint1 = ej.datavisualization.Diagram.Geometry.transform({ x: transferpoint.x, y: transferpoint.y }, angle + 135, -12);
                    var endpoint1 = ej.datavisualization.Diagram.Geometry.transform({ x: startpoint1.x, y: startpoint1.y }, angle + 135, 12 * 2);
                }
                if (connector.shape && connector.shape.flow == "sequence" && connector.shape.sequence == "default" && i == 0) {
                    var beginningpoint = { x: segment.points[0].x, y: segment.points[0].y };
                    var distance = ej.datavisualization.Diagram.Geometry.distance(segment.points[0], segment.points[1]);
                    distance = Math.min(30, distance / 2);
                    var angle = ej.datavisualization.Diagram.Geometry.findAngle(segment.points[0], segment.points[1]);
                    var transferpoint = ej.datavisualization.Diagram.Geometry.transform({ x: beginningpoint.x, y: beginningpoint.y }, angle, distance);
                    var startpoint1 = ej.datavisualization.Diagram.Geometry.transform({ x: transferpoint.x, y: transferpoint.y }, angle + 135, -12);
                    var endpoint1 = ej.datavisualization.Diagram.Geometry.transform({ x: startpoint1.x, y: startpoint1.y }, angle + 135, 12 * 2);
                }
                if (segment.type == "bezier") {
                    var startPoint = points[0];
                    var endPoint = segment._endPoint;
                    if (connector.targetDecorator && connector.targetDecorator.shape !== ej.datavisualization.Diagram.DecoratorShapes.None) {
                        endPoint = ej.datavisualization.Diagram.Util._adjustPoint(segment._endPoint, segment._point2, true, connector.lineWidth);
                    }
                    canvas.bezierCurve(startPoint, segment._point1, segment._point2, endPoint, style);
                }
                else {
                    if (connector.cornerRadius > 0) {
                        var st, end;
                        for (var j = 0; j < points.length - 1; j++) {
                            var segLength = ej.datavisualization.Diagram.Geometry.distance(points[j], points[j + 1]);
                            if (segLength > 0) {
                                var endpoint = end || st;
                                if (i < connector.segments.length - 1 || j < points.length - 2) {
                                    if (segLength < connector.cornerRadius * 2) {
                                        end = this._adjustPoint(points[j], points[j + 1], false, segLength / 2);
                                    }
                                    else end = this._adjustPoint(points[j], points[j + 1], false, connector.cornerRadius);
                                }
                                else end = points[j + 1];

                                if (i > 0 || j > 0) {
                                    if (segLength < connector.cornerRadius * 2) {
                                        st = this._adjustPoint(points[j], points[j + 1], true, segLength / 2);
                                        if (i < connector.segments.length - 1 || j < points.length - 2)
                                            end = null;
                                    }
                                    else st = this._adjustPoint(points[j], points[j + 1], true, connector.cornerRadius);
                                }

                                if (endpoint && st) {
                                    canvas.quadraticCurve(endpoint, points[j], st, style);
                                }
                                else st = points[j];
                                if (segment._bridges.length > 0) {
                                    this._updateBridging(segment, canvas, j + 1, st ? st : points[j], end ? end : points[j + 1], connector.bridgeSpace, style,
                                        starting && k == 1 ? true : false, ending && k == points.length - 1 ? true : false);
                                }
                                if (end) {
                                    if (!(segment._bridges.length > 0)) {
                                        canvas.line(st, end, style);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        for (var k = 1; k < points.length; k++) {
                            if (segment._bridges.length > 0) {
                                this._updateBridging(segment, canvas, k, points[k - 1], points[k], connector.bridgeSpace, style,
                                    starting && k == 1 ? true : false, ending && k == points.length - 1 ? true : false);
                            }
                            else {
                                canvas.line(this._scalePointforStretch(points[k - 1], canvas, connector), this._scalePointforStretch(points[k], canvas, connector), style,
                                    starting && k == 1 ? false : true, ending && k == points.length - 1 ? false : true);
                            }
                        }
                    };
                }
            }
            if (connector.shape && connector.shape.flow == "sequence" && connector.shape.sequence == "default") {
                canvas.line(this._scalePointforStretch(startpoint1, canvas, connector), this._scalePointforStretch(endpoint1, canvas, connector), style);
            }
        },

        _scalePointforStretch: function (pt, canvas, connector) {
            var tempPt = { x: pt.x, y: pt.y };
            if (connector && ej.datavisualization.Diagram.Util.canCrispEdges(connector, canvas._diagram)) {
                tempPt.x = Math.floor(tempPt.x);
                tempPt.y = Math.floor(tempPt.y);
            }
            tempPt.x *= canvas._scaleX;
            tempPt.y *= canvas._scaleY;
            return tempPt;
        },

        _updateBridging: function (seg, canvas, pointIndex, startPt, endPt, bridgeSpace, style, start, end) {
            var bridgeSP;
            var angle = this._findAngle(startPt, endPt);
            var bridgeDirection = canvas._diagram.bridgeDirection();
            if (seg._bridges.length > 0) {
                if (seg.type === "straight") {
                    for (var n = 0; n < seg._bridges.length; n++) {
                        var bridge = seg._bridges[n];
                        if (!bridge._rendered) {
                            bridgeSP = seg._bridges[n - 1] != null && seg._bridges[n - 1].segmentPointIndex == bridge.segmentPointIndex ? seg._bridges[n - 1].endPoint : startPt;
                            canvas.line(bridgeSP, bridge.startPoint, style, !(start || n == 0), true);
                            var centerX = bridge.startPoint.x + ((bridge.endPoint.x - bridge.startPoint.x) / 2);
                            var centerY = bridge.startPoint.y + ((bridge.endPoint.y - bridge.startPoint.y) / 2);
                            var sweep = ej.datavisualization.Diagram.Util.sweepDirection(angle, bridgeDirection, null, canvas._diagram);
                            canvas.arc(centerX, centerY, bridgeSpace / 2, angle, sweep, style);
                            if (seg._bridges[n + 1] != null && seg._bridges[n + 1].segmentPointIndex == bridge.segmentPointIndex)
                                canvas.line(bridge.endPoint, seg._bridges[n + 1].startPoint, style, false);
                            else
                                canvas.line(bridge.endPoint, endPt, style, false, !end);
                            bridge._rendered = true;
                        }
                    }
                }
                else if (seg.type === "orthogonal") {
                    var ept = startPt;
                    for (var n = 0; n < seg._bridges.length; n++) {
                        var bridge = seg._bridges[n];
                        if (bridge.segmentPointIndex === pointIndex && !bridge._rendered) {
                            bridgeSP = seg._bridges[n - 1] != null && seg._bridges[n - 1].segmentPointIndex == bridge.segmentPointIndex ? seg._bridges[n - 1].endPoint : startPt;
                            canvas.line(bridgeSP, bridge.startPoint, style, !(start || n == 0), true);
                            var centerX = bridge.startPoint.x + ((bridge.endPoint.x - bridge.startPoint.x) / 2);
                            var centerY = bridge.startPoint.y + ((bridge.endPoint.y - bridge.startPoint.y) / 2);
                            var sweep = ej.datavisualization.Diagram.Util.sweepDirection(angle, bridgeDirection, null, canvas._diagram);
                            canvas.arc(centerX, centerY, bridgeSpace / 2, angle, sweep, style);
                            if (seg._bridges[n + 1] != null && seg._bridges[n + 1].segmentPointIndex == bridge.segmentPointIndex)
                                canvas.line(bridge.endPoint, seg._bridges[n + 1].startPoint, style, false);
                            else
                                ept = bridge.endPoint;
                            bridge._rendered = true;
                        }
                    }
                    canvas.line(ept, endPt, style, false, !end);
                }
            }
        },

        _findAngle: function (startPt, endPt) {
            var xDiff = startPt.x - endPt.x; var yDiff = startPt.y - endPt.y;
            return Math.atan2(yDiff, xDiff) * (180 / Math.PI);
        },

        _adjustPoint: function (source, target, isStart, length) {
            var pt = isStart ? { x: source.x, y: source.y } : { x: target.x, y: target.y };
            if (source.x == target.x) {
                if (source.y < target.y && isStart || source.y > target.y && !isStart)
                    pt.y += length;
                else pt.y -= length;
            }
            else if (source.y == target.y) {
                if (source.x < target.x && isStart || source.x > target.x && !isStart)
                    pt.x += length;
                else pt.x -= length;
            }
            else {
                var angle;
                if (isStart) {
                    angle = ej.datavisualization.Diagram.Geometry.findAngle(source, target);
                    pt = ej.datavisualization.Diagram.Geometry.transform(source, angle, length);
                }
                else {
                    angle = ej.datavisualization.Diagram.Geometry.findAngle(target, source);
                    pt = ej.datavisualization.Diagram.Geometry.transform(target, angle, length);
                }
            }
            return pt;
        },

        renderLabels: function (node, canvas) {
            for (var i = 0; i < node.labels.length; i++) {
                var label = node.labels[i];
                var ctx = canvas.document.getContext("2d");
                ctx.save();
                ctx.globalAlpha = label.opacity;
                ctx.lineWidth = label.borderWidth;
                ctx.strokeStyle = label.borderColor;
                if (label.text && label.visible)
                    this._renderTextElement(node, label, canvas);
                ctx.restore();
            }
        },

        renderPorts: function (node, canvas, x, y) {
            var ctx = canvas.document.getContext("2d");
            for (var i = 0; i < node.ports.length; i++) {
                var port = node.ports[i];
                if (!(port.visibility & ej.datavisualization.Diagram.PortVisibility.Hidden || port.visibility & ej.datavisualization.Diagram.PortVisibility.Hover || port.visibility & ej.datavisualization.Diagram.PortVisibility.Connect)) {
                    var point = ej.datavisualization.Diagram.Util._getPortPosition(port, ej.datavisualization.Diagram.Util.bounds(node, true));
                    point = this._scalePointforStretch(point, canvas);
                    var portSize = port.size * canvas._scaleY;
                    ctx.fillStyle = port.fillColor;
                    ctx.strokeStyle = port.borderColor;
                    ctx.lineWidth = port.borderWidth;
                    switch (port.shape) {
                        case "x":
                            ctx.beginPath();
                            ctx.moveTo((point.x - portSize / 2), (point.y - portSize / 2));
                            ctx.lineTo((point.x + portSize / 2), (point.y + portSize / 2));
                            ctx.moveTo((point.x + portSize / 2), (point.y - portSize / 2));
                            ctx.lineTo((point.x - portSize / 2), (point.y + portSize / 2));
                            ctx.stroke();
                            ctx.fill();
                            ctx.closePath();
                            break;
                        case "circle":
                            var rx = portSize / 2;
                            var ry = portSize / 2;
                            canvas.ellipse(point.x, point.y, rx, ry);
                            break;
                        case "square":
                            canvas.rect(point.x - portSize / 2, point.y - portSize / 2, portSize, portSize);
                            break;
                        case "path":
                            ctx.save();
                            if (node._type == "group") {
                                ctx.translate(offsetX, node.offsetY);
                                ctx.rotate(-node.rotateAngle * Math.PI / 180);
                                ctx.translate(-offsetX, -node.offsetY);
                                var rotation;
                                if (node.rotateAngle)
                                    rotation = { angle: node.rotateAngle, x: port._absolutePoint.x, y: port._absolutePoint.y };
                                var absolutePath = port._absolutePath;
                                if (canvas._scaleX !== 1 || canvas._scaleY !== 1)
                                    absolutePath = ej.datavisualization.Diagram.Geometry.updatePath(port._absolutePoint.x, port._absolutePoint.y, portSize, portSize, absolutePath, canvas._diagram._svg, null, null);
                                canvas.path(absolutePath, 0, 0, portSize, portSize, rotation);
                            }
                            else {
                                x = point.x - node.width * port.offset.x;
                                y = point.y - node.height * port.offset.y;
                                var absolutePath = port._absolutePath;
                                if (canvas._scaleX !== 1 || canvas._scaleY !== 1)
                                    absolutePath = ej.datavisualization.Diagram.Geometry.updatePath(x, y, portSize, portSize, absolutePath, canvas._diagram._svg, null, null);
                                canvas.path(absolutePath, x, y, portSize, portSize, rotation);
                            }
                            ctx.restore();
                    }
                }
            }
        },

        _renderTextElement: function (node, textElement, canvas) {
            if (textElement) {
                var text = { childNodes: [] };
                var ctx = canvas.document.getContext("2d");
                ctx.save();
                var font = "";
                if (textElement.italic)
                    font += "italic ";
                if (textElement.bold)
                    font += "bold ";
                font += (textElement.fontSize * canvas._scaleY) + "px ";
                font += textElement.fontFamily;
                ctx.font = font;
                var bounds = this._wrapText(node, text, textElement, canvas);
                this._alignTextOnLabel(textElement, node, text, canvas, bounds);
                ctx.restore();
            }
        },

        _alignTextOnLabel: function (label, node, text, canvas, labelBounds) {
            var nodeWidth = node.width || node._width || 0;
            var nodeHeight = node.height || node._height || 0;
            nodeWidth *= canvas._scaleX;
            nodeHeight *= canvas._scaleY;
            var bounds = { "width": labelBounds && labelBounds.width || label.width, "height": text.childNodes.length * (label.fontSize * canvas._scaleY) };
            var nodeBounds = ej.datavisualization.Diagram.Util.bounds(node);
            nodeBounds.width *= canvas._scaleX;
            nodeBounds.height *= canvas._scaleY;
            nodeBounds.x *= canvas._scaleX;
            nodeBounds.y *= canvas._scaleY;
            var offset, hAlign, vAlign;
            var diagram = canvas._diagram;
            if (node.segments && label.relativeMode == "segmentpath") {
                var obj = ej.datavisualization.Diagram.SvgContext._getConnectorHandlePosition(label, node, 1, diagram);
                var pt = this._scalePointforStretch(obj.position, canvas);
                offset = {
                    x: (pt.x - nodeBounds.x) / nodeBounds.width,
                    y: (pt.y - nodeBounds.y) / nodeBounds.height
                };
                var alignment = ej.datavisualization.Diagram.Util._alignLabelOnSegments(node, label, diagram, obj);
                vAlign = alignment.vAlign; hAlign = alignment.hAlign;
            }
            else {
                hAlign = label.horizontalAlignment;
                vAlign = label.verticalAlignment;
            }
            offset = ej.datavisualization.Diagram.Util._getLabelPosition(label, nodeBounds, offset);
            var point = { x: 0, y: 0 }, tempPt = { x: offset.x, y: offset.y };
            var y = 0;
            if (vAlign == ej.datavisualization.Diagram.VerticalAlignment.Top)
                y = offset.y + bounds.height / 2;
            else if (vAlign == ej.datavisualization.Diagram.VerticalAlignment.Center || vAlign == ej.datavisualization.Diagram.VerticalAlignment.Stretch)
                y = offset.y;
            else
                y = offset.y - bounds.height / 2;
            point.y = y;
            point.x = offset.x;
            tempPt.y = y;
            var ctx = canvas.document.getContext("2d");
            if (label.textAlign == "justify") {
                if (text.childNodes.length > 1) {
                    ctx.textAlign = "left";
                    bounds.width = nodeWidth - 2 * label.borderWidth;
                }
                else ctx.textAlign = "center";
            } else {
                ctx.textAlign = label.textAlign;
            }
            switch (hAlign) {
                case ej.datavisualization.Diagram.HorizontalAlignment.Left:
                    tempPt.x = offset.x + bounds.width / 2;
                    switch (ctx.textAlign) {
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
                    tempPt.x = offset.x;
                    switch (ctx.textAlign) {
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
                    tempPt.x = offset.x - bounds.width / 2;
                    switch (ctx.textAlign) {
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
                    tempPt.x = offset.x;
                    point.x = offset.x;
                    break;
            }
            var rotation, labelX = nodeBounds.x, labelY = nodeBounds.y;
            if (!node.segments) {
                labelX = (node.offsetX * canvas._scaleX) - nodeWidth * node.pivot.x;
                labelY = (node.offsetY * canvas._scaleY) - nodeHeight * node.pivot.y;
            }

            var bWidth = label.borderWidth || 0;
            var x = labelX + point.x + (labelBounds ? labelBounds.x : 0) - bWidth / 2;
            var y = labelY + point.y - bounds.height / 2 - bWidth / 2;
            if (label.verticalAlignment == "stretch") {
                canvas.rect(x, nodeBounds.y, bounds.width + bWidth, nodeBounds.height + bWidth, null,
                    { fill: label.fillColor && !node._isHeader ? label.fillColor : "transparent", stroke: (bWidth && !node._isHeader) ? (label.borderColor || "transparent") : "transparent", lineWidth: bWidth });
            }
            else
                canvas.rect(x, y, bounds.width + bWidth, bounds.height + bWidth, null,
                    { fill: label.fillColor ? label.fillColor : "transparent", stroke: bWidth ? (label.borderColor || "transparent") : "transparent", lineWidth: bWidth });

            rotation = { "angle": label.rotateAngle, x: labelX + tempPt.x, y: labelY + tempPt.y };
            if (label.textAlign == "justify") {
                var labelWidth = Math.max(nodeWidth, label.width) - 2 * label.borderWidth;
            }
            ctx.save();
            ctx.translate(rotation.x, rotation.y);
            ctx.rotate(rotation.angle * Math.PI / 180);
            ctx.translate(-rotation.x, -rotation.y);
            for (var i = 0; i < text.childNodes.length; i++) {
                var child = text.childNodes[i];
                var text_x = x + child.x - labelBounds.x + bWidth / 2;
                var text_y = y + child.dy * i + ((label.fontSize * canvas._scaleY) * 0.8) + bWidth / 2;
                var width = ctx.measureText(child.text).width;
                if (labelWidth > width && i < text.childNodes.length - 1) {
                    var txt = child.text;
                    if (txt[txt.length - 1] == " ") { txt = txt.slice(0, txt.length - 1); } if (txt[0] == " ") { txt = txt.slice(1, txt.length); }
                    width = ctx.measureText(txt).width;
                    var words = txt.split(" ");
                    if (words.length > 1) {
                        var extra = (((labelWidth - width) / ctx.measureText(" ").width) / (words.length - 1));
                        extra = Math.round(extra);
                        var extText = "";
                        for (var k = 0; k < extra; k++) {
                            extText += " ";
                        }
                        child.text = txt.replace(" ", extText);
                    }
                }
                if (label.horizontalAlignment == "stretch") {
                    switch (label.textAlign) {
                        case "left":
                            child.x = offset.x - bounds.width / 2;
                            break;
                        case "center":
                            child.x = -bounds.width / 2;
                            break;
                        case "right":
                            child.x = -offset.x - bounds.width / 2;
                            break;
                    }
                }
                canvas.text({ text: child.text }, text_x - child.x, text_y, null, { fill: label.fontColor });
                if (label.textDecoration != "none")
                    this._renderTextDecoration(text_x - child.x, text_y, ctx.measureText(child.text).width, label, canvas);
            }
            ctx.restore();
        },

        _wrapText: function (node, text, label, canvas) {
            var str = label.text; var attr = null;
            if (label.rotateAngle != undefined) {
                if (canvas && canvas._diagram) {
                    var lane = canvas._diagram.nameTable[node.parent];
                    if (lane && lane.isLane && label.rotateAngle !== 0) {
                        var textBBox = ej.datavisualization.Diagram.Util.bounds(node);
                        var width = textBBox.width;
                        textBBox.width = textBBox.height;
                        textBBox.height = width;
                    }
                    else
                        var textBBox = ej.datavisualization.Diagram.Util.bounds(node);
                }
                else
                    var textBBox = ej.datavisualization.Diagram.Util.bounds(node);
            }
            else var textBBox = ej.datavisualization.Diagram.Util.bounds(node);
            textBBox.width *= canvas._scaleX;
            textBBox.height *= canvas._scaleY;
            textBBox.x *= canvas._scaleX;
            textBBox.y *= canvas._scaleY;
            var bbWidth, bbHeight;
            if (node.segments) {
                bbWidth = textBBox.width;
                bbHeight = textBBox.height;
            }
            else {
                bbWidth = textBBox.width - label.margin.left - label.margin.right;
                bbHeight = textBBox.height - label.margin.top - label.margin.bottom;
            }
            bbWidth -= 2 * (label.borderWidth ? label.borderWidth : 1);
            bbWidth = bbWidth < label.width ? label.width : bbWidth;
            var eachLine = str.split('\n');
            var x, y, tspan, j, string = "", childNodes, bounds, i;
            var ctx = canvas.document.getContext("2d");
            var wrap = label.wrapping == "wrapwithoverflow" ? true : false;
            for (j = 0; j < eachLine.length; j++) {
                var txt = "", spltWord;
                if (label.wrapping != "nowrap") {
                    var words = label.wrapping == "wrapwithoverflow" ? eachLine[j].split(" ") : eachLine[j];
                    for (i = 0; i < words.length; i++) {
                        var newword = words[i];
                        if (newword.indexOf('-') >= 0 && wrap) {
                            txt = this._splitHyphenWord(txt, newword, text, label, ctx, bbWidth);
                            if (i == words.length - 1) {
                                text.childNodes[text.childNodes.length] = { text: txt };
                                txt = "";
                            }
                            else {
                                if (ctx.measureText(txt + " " + (words[i + 1] || "")).width > bbWidth) {
                                    text.childNodes[text.childNodes.length] = { text: txt };
                                    txt = "";
                                }
                            }
                        }
                        else {
                            txt += ((txt && wrap) ? " " : "") + words[i];
                            bounds = ctx.measureText(txt).width;
                            if (bounds >= bbWidth) {
                                text.childNodes[text.childNodes.length] = { text: txt };
                                txt = "";
                            }
                            else {
                                if (wrap || (label && label.wrapping === "wrap")) {
                                    var newText = txt;
                                    if (i < words.length - 1) {
                                        if (words[i + 1].indexOf("-") >= 0 && wrap) {
                                            txt = this._splitHyphenWord(txt, words[i + 1], text, label, ctx, bbWidth);
                                            if (ctx.measureText(txt + " " + (words[i + 1] || "")).width > bbWidth) {
                                                text.childNodes[text.childNodes.length] = { text: txt };
                                                txt = "";
                                            }
                                            i++;
                                        }
                                        else {
                                            newText += (wrap ? " " : "") + (words[i + 1] || "");
                                            if (ctx.measureText(newText).width > bbWidth) {
                                                text.childNodes[text.childNodes.length] = { text: txt };
                                                txt = "";
                                            }
                                        }
                                    }
                                }
                                if (i == words.length - 1) {
                                    text.childNodes[text.childNodes.length] = { text: txt };
                                    txt = "";
                                }
                            }
                        }
                    }
                }
                else {
                    txt += eachLine[j];
                    text.childNodes[text.childNodes.length] = { text: txt };
                }

            }
            return this._wrapTextAlign(text, text.childNodes, (label.fontSize * canvas._scaleY), label.textAlign, ctx, node, label, canvas);
        },

        _splitHyphenWord: function (txt, hyphenWord, text, label, ctx, bbWidth) {
            var wrap = label.wrapping == "wrapwithoverflow" ? true : false;
            var newText = txt ? txt + " " : "";
            var splitWords = hyphenWord.split("-");
            for (var i = 0; i < splitWords.length; i++) {
                newText += splitWords[i];
                var bounds = ctx.measureText(newText).width;
                if (bounds >= bbWidth) {
                    text.childNodes[text.childNodes.length] = { text: txt };
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
                            if (ctx.measureText(newText).width > bbWidth) {
                                text.childNodes[text.childNodes.length] = { text: txt };
                                newText = "-";
                            }
                            else {
                                txt = newText;
                            }
                        }
                    }
                }
            }
            return txt;
        },

        _wrapTextAlign: function (text, childNodes, height, textAlign, ctx, node, label, canvas) {
            var width, bounds;
            var nodeBounds = ej.datavisualization.Diagram.Util.bounds(node);
            nodeBounds.width *= canvas._scaleX;
            nodeBounds.height *= canvas._scaleY;
            nodeBounds.x *= canvas._scaleX;
            nodeBounds.y *= canvas._scaleY;
            for (var i = 0; i < childNodes.length; i++) {
                var x = ctx.measureText(childNodes[i].text).width;
                width = x;
                if (label.horizontalAlignment == "stretch") {
                    width = nodeBounds.width;
                    x = -width / 2;
                }
                else
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
                        case "justify":
                            x = childNodes.length > 1 ? 0 : -x / 2;
                            break;
                    }
                childNodes[i].x = Number(x);
                childNodes[i].dy = height;
                if (!bounds) {
                    bounds = {
                        x: x,
                        width: width
                    };
                } else {
                    bounds.x = Math.min(bounds.x, x);
                    bounds.width = Math.max(bounds.width, width);
                }
            }
            return bounds;
        },

        _renderTextDecoration: function (x, y, width, label, canvas) {
            var ctx = canvas.document.getContext("2d");
            ctx.save();
            ctx.strokeStyle = label.fontColor;
            ctx.lineWidth = 1;
            switch (ctx.textAlign) {
                case "center":
                    x -= (width / 2); break;
                case "right":
                    x -= width; break;
            }
            y += 2;
            switch (label.textDecoration) {
                case "overline":
                    y -= (label.fontSize * canvas._scaleY); break;
                case "line-through":
                    y -= (label.fontSize / 2 * canvas._scaleY); break;
            }
            var stPt = { x: x, y: y };
            var edPt = { x: x + width, y: y };
            canvas.line(stPt, edPt, null);
            ctx.restore();
        },

        _renderGradient: function (node, ctx, x, y) {
            if (node.gradient) {
                var max, min;
                for (var i = 0; i < node.gradient.stops.length; i++) {
                    max = !max ? node.gradient.stops[i].offset : Math.max(max, node.gradient.stops[i].offset);
                    min = !min ? node.gradient.stops[i].offset : Math.min(min, node.gradient.stops[i].offset);
                }
                if (node.gradient.type == "linear") {
                    var grd = ctx.createLinearGradient(x + node.gradient.x1, y + node.gradient.y1, x + node.gradient.x2, y + node.gradient.y2);
                    for (var i = 0; i < node.gradient.stops.length; i++) {
                        var stop = node.gradient.stops[i];
                        var offset = min < 0 ? (max + stop.offset) / (2 * max) : stop.offset / max;
                        grd.addColorStop(offset, stop.color);
                    }
                }
                else if (node.gradient.type == "radial") {
                    var grd = ctx.createRadialGradient(x + node.gradient.fx, y + node.gradient.fy, 0, x + node.gradient.cx, y + node.gradient.cy, node.gradient.r);
                    for (var i = 0; i < node.gradient.stops.length; i++) {
                        var stop = node.gradient.stops[i];
                        var offset = min < 0 ? (max + stop.offset) / (2 * max) : stop.offset / max;
                        grd.addColorStop(offset, stop.color);
                    }
                }
                ctx.fillStyle = grd;
            }
        },

        _renderDecorators: function (connector, canvas) {
            var startPoint;
            var endPoint;
            var diagram = canvas._diagram;
            if (connector.targetDecorator && connector.targetDecorator.shape) {
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
                    startPoint, connector.targetDecorator, canvas);
            }
            if (connector.sourceDecorator && connector.sourceDecorator.shape) {
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
                    endPoint, connector.sourceDecorator, canvas);
            }
        },

        _renderDecorator: function (name, point1, point2, decorator, canvas) {
            var shape;
            var attr;
            var d;
            var scalePoint1 = this._scalePointforStretch(point1, canvas);
            var scalePoint2 = this._scalePointforStretch(point2, canvas);
            var size = new ej.datavisualization.Diagram.Size(Number(decorator.width * canvas._scaleY), Number(decorator.height * canvas._scaleY));
            var ctx = canvas.document.getContext("2d");
            ctx.fillStyle = decorator.fillColor;
            ctx.strokeStyle = decorator.borderColor == "none" ? "transparent" : decorator.borderColor;
            ctx.lineWidth = decorator.borderWidth;
            var angle = ej.datavisualization.Diagram.Geometry.findAngle(scalePoint1, scalePoint2);
            var rotation = { angle: angle, x: scalePoint1.x, y: scalePoint1.y };
            switch (decorator.shape) {
                case "arrow":
                    canvas.arrow(scalePoint1, rotation, size);
                    break;
                case "openarrow":
                    canvas.arrow(scalePoint1, rotation, size, true);
                    break;
                case "circle":
                    var rx = size.width / 2;
                    var ry = size.height / 2;
                    canvas.ellipse(scalePoint1.x + size.width / 2, scalePoint1.y, rx, ry, rotation);
                    break;
                case "diamond":
                    canvas.diamond(scalePoint1, rotation, size);
                    break;
                case "path":
                    canvas.path(decorator._absolutePath, 0, 0, size.width, size.height, rotation);
                    break;
            }
            return shape;
        },

        _updatePolygonPoints: function (node, canvas) {
            var points = [];
            if (node.points) {
                var nodeWidth = node.width || node._width || 0;
                var nodeHeight = node.height || node._height || 0;
                nodeWidth *= canvas._scaleX;
                nodeHeight *= canvas._scaleY;
                for (var i = 0; i < node.points.length; i++) {
                    var point1 = node.points[i];
                    points.push({ x: point1.x, y: point1.y });
                }
                if (points.length) {
                    this._scalePoints(points, node, canvas);
                    var bounds = ej.datavisualization.Diagram.Geometry.rect(points);
                    var x = (node.offsetX * canvas._scaleX) - nodeWidth * node.pivot.x - bounds.x;
                    var y = (node.offsetY * canvas._scaleY) - nodeHeight * node.pivot.y - bounds.y;
                    for (var i = 0, len = points.length; i < len; ++i) {
                        var point = ej.datavisualization.Diagram.Geometry.translate(points[i], x, y);
                        points[i] = point;
                    }
                }
            }
            return points;
        },

        _scalePoints: function (points, node, canvas) {
            var bounds = ej.datavisualization.Diagram.Geometry.rect(points);
            if (bounds.width > 0 && bounds.height > 0) {
                var nodeWidth = node.width || node._width || 0;
                var nodeHeight = node.height || node._height || 0;
                nodeWidth *= canvas._scaleX;
                nodeHeight *= canvas._scaleY;
                var scaleX = nodeWidth / bounds.width;
                var scaleY = nodeHeight / bounds.height;
                for (var i = 0, len = points.length; i < len; ++i) {
                    points[i].x = points[i].x * scaleX;
                    points[i].y = points[i].y * scaleY;
                }
            }
        },

        updateNode: function (model, canvas) {
            this.refreshCanvas(model, canvas);
        },

        updateConnector: function (model, canvas) { this.refreshCanvas(model, canvas); },

        updateGroup: function (model, canvas) { this.refreshCanvas(model, canvas); },

        refreshCanvas: function (model, canvas) {

            var ctx = canvas.document.getContext("2d");
            ctx.save();
            if (view.scale) {
                ctx.scale(1 / view.scale.x, 1 / view.scale.y);
            }
            var bounds = { x: canvas.document.offsetLeft, y: canvas.document.offsetTop, width: canvas.document.offsetWidth, height: canvas.document.offsetHeight };
            ctx.clearRect(bounds.x, bounds.y, bounds.width, bounds.height);
            if (view.scale) {
                ctx.scale(view.scale.x, view.scale.y);
            }
            ctx.restore();
            for (var i = 0; i < model.nodes.length; i++) {
                if (model.nodes[i]._type === "node")
                    this.renderNode(model.nodes[i], canvas);
                else if (model.nodes[i]._type === "group")
                    this.renderGroup(model.nodes[i], canvas);
            }
            for (var i = 0; i < model.connectors.length; i++) {
                this.renderConnector(model.connectors[i], canvas);
            }
        },

        updateViewport: function (diagram) {
            //diagram._scroller._updateViewPort();
            //diagram.model.pageSettings._updatePageSize(diagram, true);
        },

        addNodeLabel: function (model, canvas) { this.refreshCanvas(model, canvas); },

        updateLabel: function (model, canvas) { this.refreshCanvas(model, canvas); },

        setNodeShape: function (model, canvas) { this.refreshCanvas(model, canvas); },

        setLine: function (model, canvas) { this.refreshCanvas(model, canvas); },

        renderDecorators: function (model, canvas) { this.refreshCanvas(model, canvas); },

        clearDecorators: function (model, canvas) { this.refreshCanvas(model, canvas); },

        updateTargetDecoratorStyle: function (model, canvas) { this.refreshCanvas(model, canvas); },

        updateSourceDecoratorStyle: function (model, canvas) { this.refreshCanvas(model, canvas); },

        _updateNodeStyle: function (model, canvas) { this.refreshCanvas(model, canvas); },

        updateLabelStyle: function (model, canvas) { this.refreshCanvas(model, canvas); },

        updateConnectorStyle: function (model, canvas) { this.refreshCanvas(model, canvas); },

        updateTextBlock: function (model, label, canvas) { this.refreshCanvas(model, canvas); },

        removeChild: function (element, view, diagram) {
            this.refreshCanvas(model, canvas);
        }
    };
    //#endregion

})(jQuery, Syncfusion);