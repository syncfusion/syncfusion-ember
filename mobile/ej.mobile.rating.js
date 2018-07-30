/**
* @fileOverview Plugin to style the Html rating elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    // ejmRating is the plugin name 
    // "ej.mobile.Rating" is "namespace.className" will hold functions and properties

    ej.widget("ejmRating", "ej.mobile.Rating", {
        _setFirst: true,
        _rootCSS: "e-m-rating",

        defaults: {
            maxValue: 5,
            minValue: 0,
            value: 1,
            incrementStep: 1,
            precision: "full",
            enabled: true,
            renderMode: "auto",
            shape: "star",
            shapeWidth: 25,
            shapeHeight: 25,
            spaceBetweenShapes: 15.0,
            tap: null,
            change: null,
            touchMove: null,
            orientation: 'horizontal',
            readOnly: false,
            enablePersistence: false,
            backgroundColor: null,
            selectionColor: null,
            hoverColor: null,
            borderColor: null
        },
        dataTypes: {
            enabled: "boolean",
            renderMode: "enum",
            precision: "enum",
            shape: "enum",
            orientation: "enum",
            readOnly: "boolean",
            enablePersistence: "boolean"
        },
        observables: ["value"],
        value: ej.util.valueFunction("value"),

        _init: function () {
            //Get each rating properties
            if (!App.activePage)
                App.createAppView();
            this._cloneElement = this.element.clone();
            this._renderControl();
            this._wireEvents(false);
            this._isLoaded = true;
        },

        _initObjects: function () {
            this.element.css({ "display": "inline-block" });
            this._canvasElement = this.element.find("canvas")[0];
            this._renderRatingControl();
            this._hiddenField = this.element.find("input")[0];
        },

        _renderControl: function () {
            ej.setRenderMode(this);
            this.element.addClass('e-m-' + this.model.renderMode);
            if (!this.model.enabled)
                this.element.addClass('e-m-state-disabled');
            this._renderColorCodes();
            this["_" + this.model.precision + "PrecisionProperties"]();
            this._canvasElement = ej.buildTag('canvas');
            this._canvasElement.css("-ms-touch-action", "none");
            this.element.append(this._canvasElement);
            this._hiddenField = ej.buildTag("input ", {}, {}, { "type": "hidden", "value": this.model.minValue + this.value() });
            this.element.append(this._hiddenField);
            this._initObjects();
        },

        _fullPrecisionProperties: function () {
            var checkValue = Math.round(this.value());
            this.value(checkValue - (checkValue % this.model.incrementStep));
            this._currentIndex = Number(this.value() / this.model.incrementStep);
        },

        _exactPrecisionProperties: function () {
            var checkValue = Math.ceil(this.value());
            this.value(Math.round(this.value(), 1));
            this._pricisionProperties(checkValue);
        },

        _halfPrecisionProperties: function () {
            var checkValue = Math.ceil(this.value());
            this.value(this.value() - (this.value() % (Number(this.model.incrementStep) / 2)));
            this._pricisionProperties(checkValue);
        },

        _pricisionProperties: function (checkValue) {
            if (this.value() % this.model.incrementStep != 0) {
                checkValue = checkValue + (checkValue % this.model.incrementStep);
                currentItemIndex = Number(checkValue / this.model.incrementStep);
            }
            else {
                checkValue = this.value();
                currentItemIndex = Number(checkValue / this.model.incrementStep);
            }
        },

        _hexTorgb: function (result) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(result);
            result[1] = parseInt(result[1], 16);
            result[2] = parseInt(result[2], 16);
            result[3] = parseInt(result[3], 16);
            color = JSON.stringify({ "ColorInfo": [{ "ColorStop": NaN, "Color": { "R": result[1], "G": result[2], "B": result[3], "A": 0, "Name": "64b7b7b7" } }] });
            return color;
        },
        _renderColorCodes: function () {
            var bgcolor, shapebgcolor, shapeselectcolor, shapehovercolor, glowcolor;
            if (this.model.renderMode == "ios7") {
                    bgcolor = JSON.stringify({ "ColorInfo": [{ "ColorStop": NaN, "Color": { "R": 13, "G": 122, "B": 255, "A": 0, "Name": "Transparent" } }] });
                    shapebgcolor = JSON.stringify({ "ColorInfo": [{ "ColorStop": NaN, "Color": { "R": 238, "G": 238, "B": 238, "A": 100, "Name": "64ff9d09" } }] });
                    shapeselectcolor = JSON.stringify({ "ColorInfo": [{ "ColorStop": 0, "Color": { "R": 13, "G": 122, "B": 255, "A": 100, "Name": "64c1dff7" } }] });
                    shapehovercolor = JSON.stringify({ "ColorInfo": [{ "ColorStop": 0, "Color": { "R": 13, "G": 122, "B": 255, "A": 100, "Name": "64c1dff7" } }] });
            }
            else if (this.model.renderMode == "android") {
                    bgcolor = JSON.stringify({ "ColorInfo": [{ "ColorStop": NaN, "Color": { "R": 255, "G": 255, "B": 255, "A": 100, "Name": "6433b5e5" } }] });
                    shapebgcolor = JSON.stringify({ "ColorInfo": [{ "ColorStop": NaN, "Color": { "R": 188, "G": 188, "B": 188, "A": 40, "Name": "64b7b7b7" } }] });
                    shapeselectcolor = JSON.stringify({ "ColorInfo": [{ "ColorStop": NaN, "Color": { "R": 54, "G": 190, "B": 240, "A": 100, "Name": "6433b5e5" } }] });
                    shapehovercolor = JSON.stringify({ "ColorInfo": [{ "ColorStop": NaN, "Color": { "R": 54, "G": 190, "B": 240, "A": 100, "Name": "6433b5e5" } }] });
                    glowcolor = JSON.stringify({ "ColorInfo": [{ "ColorStop": NaN, "Color": { "R": 74, "G": 188, "B": 230, "A": 100, "Name": "644abce6" } }] });
            }
            else if (this.model.renderMode == "windows") {
                    bgcolor = JSON.stringify({ "ColorInfo": [{ "ColorStop": NaN, "Color": { "R": 255, "G": 255, "B": 255, "A": 100, "Name": "6433b5e5" } }] });
                    shapebgcolor = JSON.stringify({ "ColorInfo": [{ "ColorStop": NaN, "Color": { "R": 209, "G": 207, "B": 207, "A": 100, "Name": "64b7b7b7" } }] });
                    shapeselectcolor = JSON.stringify({ "ColorInfo": [{ "ColorStop": NaN, "Color": { "R": 70, "G": 70, "B": 70, "A": 100, "Name": "6433b5e5" } }] });
                    shapehovercolor = JSON.stringify({ "ColorInfo": [{ "ColorStop": NaN, "Color": { "R": 70, "G": 70, "B": 70, "A": 100, "Name": "6433b5e5" } }] });

            }
            else if (this.model.renderMode == "flat") {
                bgcolor = JSON.stringify({ "ColorInfo": [{ "ColorStop": NaN, "Color": { "R": 51, "G": 181, "B": 229, "A": 100, "Name": "6433b5e5" } }] });
                shapebgcolor = JSON.stringify({ "ColorInfo": [{ "ColorStop": NaN, "Color": { "R": 242, "G": 242, "B": 242, "A": 100, "Name": "64b7b7b7" } }] });
                shapeselectcolor = JSON.stringify({ "ColorInfo": [{ "ColorStop": NaN, "Color": { "R": 243, "G": 133, "B": 41, "A": 100, "Name": "6433b5e5" } }] });
                shapehovercolor = JSON.stringify({ "ColorInfo": [{ "ColorStop": NaN, "Color": { "R": 243, "G": 133, "B": 41, "A": 100, "Name": "6433b5e5" } }] });
            }
            if (typeof (this.model.backgroundColor) == "string")
                shapebgcolor = this._hexTorgb(this.model.backgroundColor);
            if (typeof (this.model.selectionColor) == "string")
                shapeselectcolor = this._hexTorgb(this.model.selectionColor);
            if (typeof (this.model.hoverColor) == "string")
                shapehovercolor = this._hexTorgb(this.model.hoverColor);
            bgcolor = bgcolor.replace('null', NaN);
            shapebgcolor = shapebgcolor.replace('null', NaN);
            shapeselectcolor = shapeselectcolor.replace('null', NaN);
            shapehovercolor = shapehovercolor.replace('null', NaN);
            this._backgroundColor = eval("(" + bgcolor + ")");
            this._shapeBackgroundColor = eval("(" + shapebgcolor + ")");
            this._shapeSelectedColor = eval("(" + shapeselectcolor + ")");
            this._shapeHoverColor = eval("(" + shapehovercolor + ")");
            if (this.model.renderMode == "android") {
                glowcolor = glowcolor.replace('null', NaN);
                this.model.glowColor = eval("(" + glowcolor + ")");
            }
        },

        _createDelegates: function () {
            this._canvasMDDelegate = $.proxy(this._canvasMouseDownHandler, this);
            this._canvasMMDelegate = $.proxy(this._canvasMouseMoveHandler, this);
            this._canvasMUDelegate = $.proxy(this._canvasMouseUpHandler, this);
            this._documentEndDelegate = $.proxy(this._documentEndHandler, this);
        },

        _wireEvents: function (remove) {
            if (this.model.enabled) {
                this._createDelegates();
                if (!this.model.readOnly)
                    ej.listenEvents([this._canvasElement, this._canvasElement, document], [ej.startEvent(), ej.endEvent(), ej.endEvent()], [this._canvasMDDelegate, this._canvasMUDelegate, this._documentEndDelegate], remove);
            }
        },

        _canvasMouseDownHandler: function (evt) {
            ej.blockDefaultActions(evt);
            this._move = false;
            this._canvasAction = "mouseDown";
            ej.listenTouchEvent(this._canvasElement, ej.moveEvent(), this._canvasMMDelegate, false);
            var data = { value: this.value() };
            if (this.model.tap)
                this._trigger("tap", data);
        },

        _canvasMouseMoveHandler: function (evt) {
            ej.blockDefaultActions(evt);
            this._move = true;
            if (ej.isTouchDevice())
                evt = evt.touches ? evt.touches[0] : evt;
            this._canvasAction = "mouseMove";
            this._getCursorPosition(evt);
            this._mouseMove(evt);
        },

        _mouseMove: function (evt) {
            this._getCursorPosition(evt);
            this._mousepos = (this.model.orientation == "vertical") ? this._mousePosition.y : this._mousePosition.x;
            var _value;
            var shapesCount = 0, st = 0;
            this["_" + this.model.orientation + "MouseMoveOrUpProperties"]();
            var roundValue = this._getRoundOffValue(this._value);
            this._currentMouseMove = roundValue;
            this._canvasContext.canvas.title = this.model.minValue + parseFloat(roundValue);
            this._canvasContext.canvas.alt = this.model.minValue + parseFloat(roundValue);
            this._renderRatingControl();
            var data = { value: this.value() };
            if (this.model.touchMove)
                this._trigger("touchMove", data);
        },

        _verticalMouseMoveOrUpProperties: function () {
            shapesCount = Math.floor(this._mousepos - 1) / (this.model.shapeHeight + this.model.spaceBetweenShapes);
            this._value = ((this._mousepos - (shapesCount * this.model.spaceBetweenShapes)) * this.model.incrementStep / this.model.shapeHeight).toFixed(1);
        },

        _horizontalMouseMoveOrUpProperties: function () {
            shapesCount = Math.floor(this._mousepos - 1) / (this.model.shapeWidth + this.model.spaceBetweenShapes);
            this._value = ((this._mousepos - (shapesCount * this.model.spaceBetweenShapes)) * this.model.incrementStep / this.model.shapeWidth).toFixed(1);
        },

        _canvasMouseUpHandler: function (evt) {
            ej.blockDefaultActions(evt);
            if (ej.isTouchDevice())
                evt = evt.changedTouches ? evt.changedTouches[0] : evt;
            ej.listenTouchEvent(this._canvasElement, ej.moveEvent(), this._canvasMMDelegate, true);
            this._canvasAction = "mouseUp";
            this._getCursorPosition(evt);
            this._mouseUp(evt);
        },

        _documentEndHandler: function (evt) {
            if ($(evt.target).closest('.e-m-rating').length == 0) {
                if (ej.isTouchDevice())
                    evt = evt.touches ? evt.touches[0] : evt;
                ej.listenTouchEvent(this._canvasElement, ej.moveEvent(), this._canvasMMDelegate, true);
            }
        },

        _mouseUp: function (evt) {
            if (this.model.precision == "exact" && this._move) {
                if (this.model.change)
                    this._trigger("change", data);
                return;
            }
            this._move = false;
            var noofshapes = this._shapesCount, st = 0;
            this._mousepos = (this.model.orientation == "vertical") ? this._mousePosition.y : this._mousePosition.x;
            this._getCursorPosition(evt);
            var _value = 0;
            var shapesCount = 0;
            var width = this.model.shapeWidth, height = this.model.shapeHeight;
            this["_" + this.model.orientation + "MouseMoveOrUpProperties"]();
            var roundValue = this._getRoundOffValue(this._value);
            this.value(roundValue);
            this._currentMouseMove = roundValue;
            this._canvasContext.canvas.title = this.model.minValue + parseFloat(roundValue);
            this._canvasContext.canvas.alt = this.model.minValue + parseFloat(roundValue);
            $(this._hiddenField).val(this._canvasContext.canvas.title);
            this._renderRatingControl();
            var data = { value: this.value() };
            if (this.model.change)
                this._trigger("change", data);
        },

        _renderRatingControl: function () {
            var elem = this._canvasElement;
            if (typeof window.G_vmlCanvasManager != "undefined")
                elem = window.G_vmlCanvasManager.initElement(elem);
            if (!elem || !elem.getContext)
                return;
            if (this._canvasElement.getContext) {
                this._canvasContext = this._canvasElement.getContext('2d');
                var context = this._canvasContext;
                this._shapesCount = Math.floor((this.model.maxValue - this.model.minValue) / this.model.incrementStep);
                this["_" + this.model.orientation + "RenderRatingProperties"]();
                this._canvasWidth = this.tempCanvasWidth;
                this._canvasHeight = this.tempCanvasHeight;
                context.canvas.width = this._canvasWidth;
                context.canvas.height = this._canvasHeight;
                var gradient = context.createLinearGradient(0, 0, this._canvasWidth, this._canvasHeight);
                if (this._backgroundColor.ColorInfo[0].ColorStop.toString() != "NaN") {
                    $.each(this._backgroundColor.ColorInfo, function (context, index, color) {
                        gradient.addColorStop(color.ColorStop.toString() == "NaN" ? 0 : color.ColorStop, "#" + (color.Color.Name ? ej.hexFromRGB(color.Color) : color.Color));
                    });
                }
                if (this.model.orientation == "horizontal")
                    context.translate(7, 15);
                else
                    context.translate(15, 7);
                context.fillStyle = gradient;
                context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                this._renderRatingShapes(context);

            }
        },

        _verticalRenderRatingProperties: function () {
            this._renderRatingProperties(this.model.shapeWidth, this.model.shapeHeight, this._canvasWidth, this._canvasHeight);
        },

        _horizontalRenderRatingProperties: function () {
            this._renderRatingProperties(this.model.shapeHeight, this.model.shapeWidth, this._canvasHeight, this._canvasWidth);
        },

        _renderRatingProperties: function (sHorLen, sVerLen, cHorLen, cVerLen) {
            cHorLen = sHorLen + 3 + 30;
            cVerLen = this._shapesCount * sVerLen;
            cVerLen += ((this._shapesCount) * this.model.spaceBetweenShapes);
            this.tempCanvasWidth = (this.model.orientation == "horizontal") ? cVerLen : cHorLen;
            this.tempCanvasHeight = (this.model.orientation == "horizontal") ? cHorLen : cVerLen;
        },

        _renderRatingShapes: function (context) {
            var noOfShapes = this._shapesCount, noOfRatingShapes;
            var currValue = this.value();
            noOfRatingShapes = noOfShapes;
            st = 0;
            var fullValue = Math.floor(currValue / this.model.incrementStep);
            var partialValue = currValue % this.model.incrementStep;
            currValue = this.value();
            for (st = st; st < noOfRatingShapes; st++) {
                context.save();
                this._drawRatingShape(context, st);
                if (st < fullValue) {
                    this._notClipped = true;
                    this._setClippingRegion(context, st, this.model.shapeWidth, true);
                }
                else if (partialValue != 0) {
                    this._notClipped = true;
                    var value = partialValue * this.model.shapeWidth / this.model.incrementStep;
                    this._setClippingRegion(context, st, value, true);
                    partialValue = 0;
                }
                else
                    this._setClippingRegion(context, st, this.model.shapeWidth, false);
                context.restore();
            }
        },

        _drawRatingShape: function (context, currentItemIndex) {
            this._drawShapeProperties(currentItemIndex);
            this._drawShape(context, this.x1, this.y1, this.width, this.height);
        },

        _drawShapeProperties: function (currentItemIndex) {
            this.width = this.model.shapeWidth, this.height = this.model.shapeHeight;
            this.x1, this.y1;
            if (this.model.orientation == "vertical") {
                this.x1 = 1;
                this.y1 = currentItemIndex * this.height + currentItemIndex * this.model.spaceBetweenShapes;
            }
            else {
                this.x1 = currentItemIndex * this.width + (currentItemIndex) * this.model.spaceBetweenShapes;
                this.y1 = 0;
            }
        },

        _drawShape: function (context, x1, y1, width, height) {
            context.beginPath();
            switch (this.model.shape) {
                case "heart": this._drawHeartenShape(context, x1, y1, width, height); break;
                case "pentagon": this._drawPentagonShape(context, x1, y1, width, height); break;
                case "diamond": this._drawDiamondShape(context, x1, y1, width, height); break;
                case "triangle": this._drawTriangleShape(context, x1, y1, width, height); break;
                case "square": this._drawSquareShape(context, x1, y1, width, height); break;
                case "circle": this._drawCircleShape(context, x1, y1, width, height); break;
                default: this._drawStarShape(context, x1, y1, width, height); break;
            }
            context.closePath();
            if (this.model.borderColor) {
                context.strokeStyle = this.model.borderColor;
                context.stroke();
            }
            else
                if (this.model.renderMode != "windows") {
                    context.strokeStyle = (this.model.renderMode == "ios7") ? this._generateGradient(context, this._backgroundColor, x1, y1) : "";
                    context.stroke();
                }
            context.save();
            context.fillStyle = this._generateGradient(context, this._shapeBackgroundColor, x1, y1);
            context.fill();
            context.restore();
        },

        _drawStarShape: function (context, x1, y1, width, height) {
            context.moveTo(x1 + (width / 6), y1 + height); // 1
            context.lineTo(x1 + width, y1 + (height / 3)); // 2
            context.lineTo(x1, y1 + (height / 3)); // 3
            context.lineTo(x1 + width - (width / 6), y1 + height); // 4
            context.lineTo(x1 + width / 2, y1); // 5
            context.lineWidth = (this.model.renderMode == "android") ? 2 : 1;
        },

        _drawCircleShape: function (context, x1, y1, width, height) {
            if (this._draw) {
                context.arc(x1 + width / 2, y1 + height / 2, height / 9, 0, Math.PI * 2, true);
                this._draw = false;
            }
            else
                context.arc(x1 + width / 2, y1 + height / 2, height / 2, 0, Math.PI * 2, true);
        },

        _drawSquareShape: function (context, x1, y1, width, height) {
            context.moveTo(x1, y1);
            context.lineTo(x1 + width, y1);
            context.lineTo(x1 + width, y1 + height);
            context.lineTo(x1, y1 + height);
        },

        _drawTriangleShape: function (context, x1, y1, width, height) {
            context.moveTo(x1 + width / 2, y1);
            context.lineTo(x1 + width, y1 + height);
            context.lineTo(x1, y1 + height);
        },

        _drawDiamondShape: function (context, x1, y1, width, height) {
            context.moveTo(x1 + width / 2, y1);
            context.lineTo(x1 + width, y1 + height / 2);
            context.lineTo(x1 + width / 2, y1 + height);
            context.lineTo(x1, y1 + height / 2);
        },

        _drawPentagonShape: function (context, x1, y1, width, height) {
            context.moveTo(x1 + width / 2, y1);
            context.lineTo(x1 + width, y1 + height / 2);
            context.lineTo(x1 + width - width / 4, y1 + height);
            context.lineTo(x1 + width / 4, y1 + height);
            context.lineTo(x1, y1 + height / 2);
        },

        _drawHeartenShape: function (context, x1, y1, width, height) {
            x1 += width / 2;
            y1 += height / 4;
            height -= (height * .25);
            context.beginPath();
            context.moveTo(x1, y1);
            context.bezierCurveTo(x1, y1 - (height * .4), x1 - width / 2, y1 - (height * .4), x1 - width / 2, y1);
            context.bezierCurveTo(x1 - width / 2, y1 + height / 2, x1, y1 + height / 2, x1, y1 + height);
            context.bezierCurveTo(x1, y1 + height / 2, x1 + width / 2, y1 + height / 2, x1 + width / 2, y1);
            context.bezierCurveTo(x1 + width / 2, y1 - (height * .4), x1, y1 - (height * .4), x1, y1);
        },

        _setClippingRegion: function (context, currentItemIndex, clipValue, isClip) {
            context.save();
            this._drawShapeProperties(currentItemIndex);
            context.clip();
            context.beginPath();
            if (this._canvasAction == "mouseMove") {
                var posX, posY;
                if (this._mouseMoveValue != null) {
                    posX = this._mouseMoveValue * this.width + Math.floor(this._mouseMoveValue) * this.model.spaceBetweenShapes - 7;
                    posY = this._mouseMoveValue * this.height + Math.floor(this._mouseMoveValue) * this.model.spaceBetweenShapes - 7;
                }
                else {
                    posX = this._mousePosition.x - 7;
                    posY = this._mousePosition.y - 7;
                }
                context.fillStyle = this._generateGradient(context, this._shapeHoverColor, this.x1, this.y1);
                context.fill();
                (this.model.orientation == "vertical") ? context.fillRect(0, 0, this.width, posY) : context.fillRect(0, 0, posX, this.height);
            }
            else {
                if (isClip) {
                    context.fillStyle = this._generateGradient(context, this._shapeSelectedColor, this.x1, this.y1);
                    context.fill();
                    isClip = false;
                }
                (this.model.orientation == "vertical") ? context.fillRect(this.x1, this.y1, this.width, clipValue) : context.fillRect(this.x1, this.y1, clipValue, this.height);
            }
            context.restore();
        },

        _generateGradient: function (context, gradientObj, x1, y1) {
            var gradient = (this.model.renderMode == "ios7") ? context.createLinearGradient(x1 + this.model.shapeWidth / 2, y1, x1 + this.model.shapeWidth / 2, y1 + this.model.shapeHeight) : context.createLinearGradient(x1 + this.model.shapeWidth / 2, y1 + this.model.shapeHeight, x1 + this.model.shapeWidth / 2, y1);
            $.each(gradientObj.ColorInfo, function (index, color) {
                gradient.addColorStop(color.ColorStop.toString() == "NaN" ? 0 : color.ColorStop, "#" + (color.Color.Name ? ej.hexFromRGB(color.Color) : color.Color));
            });
            return gradient;
        },

        _clearRatingControl: function (context) {
            context.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
        },

        _getCursorPosition: function (e) {
            var xPos, yPos;
            if (e.pageX || e.pageY) {
                xPos = e.pageX;
                yPos = e.pageY;
            }
            else {
                xPos = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                yPos = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            xPos -= $(this._canvasElement).offset().left;
            yPos -= $(this._canvasElement).offset().top;
            this._mousePosition = { x: xPos, y: yPos };
            return this._mousePosition;
        },

        _getRoundOffValue: function (currValue) {
            var returnValue;
            if (this.model.precision == "full") {
                returnValue = Math.round(currValue);
                returnValue = returnValue - (returnValue % this.model.incrementStep);
            }
            else if (this.model.precision == "exact")
                returnValue = currValue;
            else {
                currValue = Math.round(currValue / .5) * .5;
                currValue = currValue - (currValue % (this.model.incrementStep / 2));
                returnValue = currValue;
            }
            return returnValue;
        },


        _setRenderMode: function (mode) {
            this.model.renderMode = mode;
            this._refresh();
        },

        _changeShape: function (shape) {
            this.model.shape = shape;
            this._renderRatingControl();
        },

        _refresh: function () {
            this._clearElement();
            this.element.addClass("e-m-rating");
            this._renderControl();
            this._wireEvents(false);
        },
        _setModel: function (options) {
            var refresh = false;
            for (var prop in options) {
                switch (prop) {
                    case "renderMode": this._setRenderMode(options.renderMode); break;
                    case "shape": this._changeShape(options.shape); break;
                    case "shapeWidth": this._refresh(); break;
                    case "shapeHeight": this._refresh(); break;
                    case "incrementStep": this._refresh(); break;
                    case "orientation": this._refresh(); break;
                    case "precision": this._refresh(); break;
                    case "value": this._refresh(); break;
                    case "maxValue": this._refresh(); break;
                    case "enabled": this._refresh(); break;
                    case "readOnly": this._refresh(); break;
                    case "backgroundColor": this._refresh(); break;
                    case "selectionColor": this._refresh(); break;
                    case "hoverColor": this._refresh(); break;
                }
            }
        },
        _clearElement: function () {
            this._wireEvents(true);
            this.element.removeAttr("class");
            this.element.removeAttr("style");
            this.element.html("");
        },
        // all events bound using this._on will be unbind automatically
        _destroy: function () {
            this._cloneElement.insertBefore(this.element).removeClass('e-m-rating');
            this.element.remove();
        },

        /*---------------Public Methods---------------*/

        disable: function () {
            this.model.enabled = false;
            this._refresh();
        },

        enable: function () {
            this.model.enabled = true;
            this._refresh();
        },

        show: function () {
            if (!this.model.enabled) return false;
            this.element.css("display", "block");
        },

        hide: function () {
            if (!this.model.enabled) return false;
            this.element.css("display", "none");
        },

        getValue: function () {
            return this.value();
        },

        reset: function () {
            this.value(0);
            this._refresh();
        },

        setValue: function (value) {
            this.value(value);
            this._refresh();
        }
        /*---------------Public Methods End---------------*/

    });

    ej.mobile.Rating.Precision = {
        Full: "full",
        Exact: "exact",
        Half: "half"
    };


    ej.mobile.Rating.Shape = {
        Star: "star",
        Circle: "circle",
        Diamond: "diamond",
        Heart: "heart",
        Pentagon: "pentagon",
        Square: "square",
        Triangle: "triangle"
    };

    ej.mobile.Rating.Orientation = {
        Horizontal: "horizontal",
        Vertical: "vertical"
    };
})(jQuery, Syncfusion);