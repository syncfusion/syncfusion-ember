"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function ($) {
    var ejSignature = (function (_super) {
        __extends(ejSignature, _super);
        function ejSignature(element, options) {
            _super.call(this);
            this._rootCSS = "e-signature";
            this.PluginName = "ejSignature";
            this.id = "null";
            this.validTags = ["div"];
            this.model = null;
            this.defaults = {
                strokeColor: "#000000",
                height: "100%",
                width: "100%",
                enabled: true,
                strokeWidth: 2,
                backgroundColor: "#ffffff",
                showRoundedCorner: true,
                saveImageFormat: "png",
                isResponsive: false,
                saveWithBackground: false,
                backgroundImage: null,
                change: null,
                mouseDown: null,
                mouseMove: null,
                mouseUp: null,
            };
            if (element) {
                if (!element["jquery"])
                    element = $("#" + element);
                if (element.length) {
                    return $(element).ejSignature(options).data(this.PluginName);
                }
            }
        }
        ejSignature.prototype.setModel = function (opt, forceSet) {
            this.setModel(opt, forceSet);
        };
        ejSignature.prototype.option = function (opt, forceSet) {
            this.option(opt, forceSet);
        };
        ejSignature.prototype.clear = function () {
            if (this.model.saveWithBackground)
                this._setBackgroundImage(this.model.backgroundImage);
            else
                this._canvasContext.clearRect(0, 0, this._canvasContext.canvas.width, this._canvasContext.canvas.height);
            this._refresh();
        };
        ejSignature.prototype.save = function (filename) {
            var filesave, browserUserAgent = navigator.userAgent;
            var url = this._canvas[0].toDataURL("image/" + this.model.saveImageFormat + "");
            if (ej.isNullOrUndefined(filename))
                filesave = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6) + "." + this.model.saveImageFormat;
            else
                filesave = filename + "." + this.model.saveImageFormat;
            var blob = this._dataURLtoBlob(url);
            if (browserUserAgent.indexOf('Edge') == -1) {
                if ((browserUserAgent.indexOf("Firefox")) != -1 || (browserUserAgent.indexOf("Chrome")) != -1 || (browserUserAgent.indexOf("Safari")) != -1 || (browserUserAgent.indexOf("AppleWebKit")) != -1) {
                    this._download(blob, filesave);
                }
                else
                    window.navigator.msSaveOrOpenBlob(blob, filesave);
            }
            else
                window.navigator.msSaveOrOpenBlob(blob, filesave);
        };
        ejSignature.prototype._dataURLtoBlob = function (dataurl) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        };
        ejSignature.prototype._download = function (blob, filesave) {
            var blobUrl = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = blobUrl;
            a.target = '_parent';
            a.download = filesave;
            (document.body || document.documentElement).appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
        };
        ejSignature.prototype.undo = function () {
            var proxy = this;
            if (this.incStep > 0) {
                this.incStep--;
                var undoimg = new Image;
                undoimg.src = this.storeSnap[this.incStep];
                undoimg.onload = function () {
                    var canvas = document.getElementById(proxy.element[0].id).children[0];
                    var ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(undoimg, 0, 0);
                };
            }
        };
        ejSignature.prototype.redo = function () {
            var proxy = this;
            if (this.incStep < this.storeSnap.length - 1) {
                this.incStep++;
                var redoimg = new Image();
                redoimg.src = this.storeSnap[this.incStep];
                redoimg.onload = function () {
                    var canvas = document.getElementById(proxy.element[0].id).children[0];
                    var ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(redoimg, 0, 0);
                };
            }
        };
        ejSignature.prototype.show = function () {
            this.element.css("display", "block");
        };
        ejSignature.prototype.hide = function () {
            this.element.css("display", "none");
        };
        ejSignature.prototype.enable = function () {
            this.element.removeClass("e-disable").attr({ "aria-disabled": false });
        };
        ejSignature.prototype.disable = function () {
            this.element.addClass("e-disable").attr({ "aria-disabled": true });
        };
        ejSignature.prototype.refresh = function () {
            this._resizeCanvas();
        };
        ejSignature.prototype._init = function () {
            this._initialize();
            this._render();
            this._wireEvents(false);
        };
        ejSignature.prototype._initialize = function () {
            this._canvas = ej.buildTag('canvas', "", {}, {});
            this.element.append(this._canvas);
            if (this._canvas[0].getContext) {
                this._canvasContext = this._canvas[0].getContext('2d');
            }
            this._setProperties(this.model.backgroundColor);
            if (this.model.backgroundImage) {
                this._setBackgroundImage(this.model.backgroundImage);
            }
            if (!this.model.saveWithBackground)
                this._toSaveData();
            this._resizeCanvas();
            this._setRoundedCorner(this.model.showRoundedCorner);
            if (!this.model.enabled)
                this.disable();
            this.strokeMinimumWidth = 1;
        };
        ejSignature.prototype._setBackgroundImage = function (bgImg) {
            if (!this.model.saveWithBackground)
                this._canvasContext.canvas.style.backgroundImage = "url(" + bgImg + ")";
            else {
                var proxy = this;
                var img = new Image();
                img.src = bgImg;
                img.onload = function () {
                    var canvas = document.getElementById(proxy.element[0].id).children[0];
                    var ctx = canvas.getContext("2d");
                    ctx.globalCompositeOperation = "source-over";
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    proxy._toSaveData();
                };
            }
        };
        ejSignature.prototype._setProperties = function (bgVal) {
            if (!ej.isNullOrUndefined(this.model.height && this.model.width)) {
                this.element.css({ "height": this.model.height, "width": this.model.width });
            }
            this._canvasContext.canvas.style.backgroundColor = bgVal;
            this._canvasContext.canvas.style.backgroundSize = "100% 100%";
            this._canvasContext.canvas.style.msTouchAction = 'none';
            this._canvasContext.canvas.style.touchAction = 'none';
        };
        ejSignature.prototype._resizeCanvas = function () {
            this._canvasContext.canvas.width = this.element.innerWidth();
            this._canvasContext.canvas.height = this.element.innerHeight();
            this._canvasContext.scale(1, 1);
            if (this.model.isResponsive)
                this._restore();
        };
        ejSignature.prototype._restore = function () {
            var proxy = this;
            var restoreimg = new Image;
            if (!ej.isNullOrUndefined(this.incStep)) {
                restoreimg.src = this.storeSnap[this.incStep];
                restoreimg.onload = function () {
                    var canvas = document.getElementById(proxy.element[0].id).children[0];
                    var ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(restoreimg, 0, 0, canvas.width, canvas.height);
                };
            }
        };
        ejSignature.prototype._refresh = function () {
            this._canvasContext.fillStyle = this.model.strokeColor;
            this.points = [];
            this._lastVelocity = 0;
            this._lastWidth = (this.strokeMinimumWidth + this.model.strokeWidth) / 2;
        };
        ejSignature.prototype._setModel = function (options) {
            var option;
            for (option in options) {
                switch (option) {
                    case "height":
                        this._changeHeight(options[option]);
                        break;
                    case "width":
                        this._changeWidth(options[option]);
                        break;
                    case "showRoundedCorner":
                        this._setRoundedCorner(options[option]);
                        break;
                    case "backgroundColor":
                        this._setProperties(options[option]);
                        break;
                    case "backgroundImage":
                        this._setBackgroundImage(options[option]);
                        break;
                    case "enabled":
                        this._disabled(!options[option]);
                        break;
                    case "isResponsive":
                        this._resizeCanvas();
                        break;
                }
            }
        };
        ejSignature.prototype._changeHeight = function (height) {
            this.element.css("height", height.toString());
            this._changeHeightWidth();
        };
        ejSignature.prototype._changeWidth = function (width) {
            this.element.css("width", width.toString());
            this._changeHeightWidth();
        };
        ejSignature.prototype._changeHeightWidth = function () {
            this._resizeCanvas();
            if (!this.model.isResponsive)
                this._restore();
        };
        ejSignature.prototype._setRoundedCorner = function (value) {
            value == true ? this.element.addClass("e-corner") : this.element.removeClass("e-corner");
        };
        ejSignature.prototype._disabled = function (boolean) {
            (boolean == true) ? this.disable() : this.enable();
        };
        ejSignature.prototype._render = function () {
            this.element.addClass(" e-signature e-select e-widget").attr("role", "form");
        };
        ejSignature.prototype._drawStartHandler = function (e) {
            if (e.which === 1 || e.which === 0) {
                ej.blockDefaultActions(e);
                this._mouseButtonDown = true;
                if ((ej.browserInfo().name == "chrome" || "webkit") && e.type == "touchstart") {
                    var touch = e.originalEvent.targetTouches[0];
                    this._beginStroke(touch);
                }
                else
                    this._beginStroke(e);
                this._on(this._canvas, ej.eventType.mouseMove, this._drawMove);
                this._on($(document), ej.eventType.mouseUp, this._drawEnd);
                this._trigger("mouseDown", { value: e });
            }
        };
        ejSignature.prototype._drawMoveHandler = function (e) {
            ej.blockDefaultActions(e);
            if (this._mouseButtonDown) {
                if ((ej.browserInfo().name == "chrome" || "webkit") && e.type == "touchmove") {
                    var touch = e.originalEvent.targetTouches[0];
                    this._updateStroke(touch);
                }
                else
                    this._updateStroke(e);
            }
            this._trigger("mouseMove", { value: e });
        };
        ejSignature.prototype._drawEndHandler = function (e) {
            ej.blockDefaultActions(e);
            if (this._mouseButtonDown) {
                this._mouseButtonDown = false;
                this._endStroke();
            }
            this._off(this._canvas, ej.eventType.mouseMove, this._drawMove);
            this._toSaveData();
            this._off($(document), ej.eventType.mouseUp, this._drawEnd);
            this._trigger("mouseUp", { value: e });
            this._trigger("change", { isInteraction: true, lastImage: this.storeSnap[this.incStep] });
        };
        ejSignature.prototype._toSaveData = function () {
            if (ej.isNullOrUndefined(this.incStep)) {
                this.incStep = -1;
                this.incStep++;
                this.storeSnap = new Array();
            }
            else
                this.incStep++;
            if (this.incStep < this.storeSnap.length) {
                this.storeSnap.length = this.incStep;
            }
            if (this.incStep > 0) {
                var canvasnew = ej.buildTag('canvas', "", {}, {});
                var canvasContextnew = canvasnew[0].getContext('2d');
                canvasnew[0].height = this._canvas.height();
                canvasnew[0].width = this._canvas.width();
                canvasContextnew.drawImage(this._canvas[0], 0, 0, canvasnew[0].width, canvasnew[0].height);
                this.storeSnap.push(canvasnew[0].toDataURL());
            }
            else
                this.storeSnap.push(this._canvas[0].toDataURL());
        };
        ejSignature.prototype._beginStroke = function (event) {
            this._refresh();
            this._updateStroke(event);
        };
        ejSignature.prototype._updateStroke = function (event) {
            var point = this._createPoint(event);
            this._addPoint(point);
        };
        ejSignature.prototype._drawStroke = function (point) {
            var ctx = this._canvasContext, pointSize = (this.strokeMinimumWidth + this.model.strokeWidth) / 2;
            ctx.beginPath();
            this._pointDraw(point.x, point.y, pointSize);
            ctx.closePath();
            ctx.fill();
        };
        ejSignature.prototype._endStroke = function () {
            var canDrawCurve = this.points.length > 2, point = this.points[0];
            if (!canDrawCurve && point)
                this._drawStroke(point);
        };
        ejSignature.prototype._createDelegates = function () {
            this._drawStart = $.proxy(this._drawStartHandler, this);
            this._drawMove = $.proxy(this._drawMoveHandler, this);
            this._drawEnd = $.proxy(this._drawEndHandler, this);
        };
        ejSignature.prototype._wireEvents = function (remove) {
            var eventType = remove ? "off" : "on";
            this._createDelegates();
            this._on(this._canvas, ej.eventType.mouseDown, this._drawStart);
            this._wireResizeEvents();
        };
        ejSignature.prototype._wireResizeEvents = function () {
            $(window).bind("resize", $.proxy(this._resizeCanvas, this));
        };
        ejSignature.prototype._destroy = function () {
            this.element.removeClass("e-signature e-js e-select e-widget").removeAttr("role style signature");
            if (this.model.showRoundedCorner)
                this.element.removeClass("e-corner");
            this._off(this._canvas, (ej.eventType.mouseDown, ej.eventType.mouseMove, ej.eventType.mouseUp));
            $(window).unbind("resize", $.proxy(this._resizeCanvas, this));
            this.element.empty();
        };
        ejSignature.prototype._createPoint = function (event) {
            var rect = this._canvas[0].getBoundingClientRect();
            return this._point(event.clientX - rect.left, event.clientY - rect.top, undefined);
        };
        ejSignature.prototype._addPoint = function (point) {
            var points = this.points, cp2, cp3, curve;
            points.push(point);
            if (points.length > 2) {
                if (points.length === 3)
                    points.unshift(points[0]);
                cp2 = (this._calculateCurveControlPoints(points[0], points[1], points[2])).cp2;
                cp3 = (this._calculateCurveControlPoints(points[1], points[2], points[3])).cp1;
                curve = this._bezierCurve(points[1], cp2, cp3, points[2]);
                this._addCurve(curve);
                points.shift();
            }
        };
        ejSignature.prototype._calculateCurveControlPoints = function (p1, p2, p3) {
            var dx1 = p1.x - p2.x, dy1 = p1.y - p2.y, dx2 = p2.x - (p3.x + 1), dy2 = p2.y - (p3.y + 1), m1 = { x: (p1.x + p2.x) / 2.0, y: (p1.y + p2.y) / 2.0 }, m2 = { x: (p2.x + p3.x) / 2.0, y: (p2.y + p3.y) / 2.0 }, l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1), l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2), dxm = (m1.x - m2.x), dym = (m1.y - m2.y), k = l2 / (l1 + l2), cm = { x: m2.x + dxm * k, y: m2.y + dym * k }, tx = p2.x - cm.x, ty = p2.y - cm.y;
            return {
                cp1: this._point(m1.x + tx, m1.y + ty, 0),
                cp2: this._point(m2.x + tx, m2.y + ty, 0)
            };
        };
        ejSignature.prototype._addCurve = function (curve) {
            var startPoint = this.startPoint, velocity, newWidth;
            velocity = this._pointVelocityCalc(startPoint);
            velocity = 0.7 * velocity + (0.7 - 1) * this._lastVelocity;
            newWidth = Math.max(this.model.strokeWidth / (velocity + 1), this.strokeMinimumWidth);
            this._curveDraw(curve, this._lastWidth, newWidth);
            this._lastVelocity = velocity;
            this._lastWidth = newWidth;
        };
        ejSignature.prototype._pointDraw = function (x, y, size) {
            var ctx = this._canvasContext;
            ctx.moveTo(x, y);
            ctx.arc(x, y, size, 0, 2 * Math.PI, false);
        };
        ejSignature.prototype._curveDraw = function (curve, startWidth, endWidth) {
            var ctx = this._canvasContext, drawSteps, width, i, t1, t2, t3, u1, u2, u3, x, y, widthValue = endWidth - startWidth;
            drawSteps = Math.floor(this._bezierLengthCalc());
            ctx.beginPath();
            for (i = 0; i < drawSteps; i++) {
                t1 = i / drawSteps;
                t2 = t1 * t1;
                t3 = t2 * t1;
                u1 = 1 - t1;
                u2 = u1 * u1;
                u3 = u2 * u1;
                x = u3 * this.startPoint.x;
                x += 3 * u2 * t1 * this.control1.x;
                x += 3 * u1 * t2 * this.control2.x;
                x += t3 * this.endPoint.x;
                y = u3 * this.startPoint.y;
                y += 3 * u2 * t1 * this.control1.y;
                y += 3 * u1 * t2 * this.control2.y;
                y += t3 * this.endPoint.y;
                width = startWidth + t3 * widthValue;
                this._pointDraw(x, y, width);
            }
            ctx.closePath();
            ctx.fill();
        };
        ejSignature.prototype._point = function (x, y, time) {
            this.x = x;
            this.y = y;
            this.time = time || new Date().getTime();
            return { x: this.x, y: this.y, time: this.time };
        };
        ejSignature.prototype._pointVelocityCalc = function (start) {
            return (this.time !== start.time) ? Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2)) / (this.time - start.time) : 1;
        };
        ejSignature.prototype._bezierCurve = function (startPoint, control1, control2, endPoint) {
            this.startPoint = startPoint;
            this.control1 = control1;
            this.control2 = control2;
            this.endPoint = endPoint;
        };
        ejSignature.prototype._bezierLengthCalc = function () {
            var steps = 10, length = 0, i, t, pointx1, pointy1, pointx2, pointy2, pointx3, pointy3;
            for (i = 0; i <= steps; i++) {
                t = i / steps;
                pointx1 = this._bezierPoint(t, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x);
                pointy1 = this._bezierPoint(t, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
                if (i > 0) {
                    pointx3 = pointx1 - pointx2;
                    pointy3 = pointy1 - pointy2;
                    length += Math.sqrt(pointx3 * pointx3 + pointy3 * pointy3);
                }
                pointx2 = pointx1;
                pointy2 = pointy1;
            }
            return length;
        };
        ejSignature.prototype._bezierPoint = function (t, startpoint, cp1, cp2, endpoint) {
            return startpoint * (1.0 - t) * (1.0 - t) * (1.0 - t) + 3.0 * cp1 * (1.0 - t) * (1.0 - t) * t + 3.0 * cp2 * (1.0 - t) * t * t + endpoint * t * t * t;
        };
        return ejSignature;
    }(ej.WidgetBase));
    ej.widget("ejSignature", "ej.Signature", new ejSignature());
    window["ejSignature"] = null;
})(jQuery);
ej.Signature.SaveImageFormat = {
    PNG: "png",
    JPG: "jpg",
    BMP: "bmp",
    TIFF: "tiff"
};
