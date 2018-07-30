var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ejSparkline;
(function (ejSparkline) {
    (function (Type) {
        Type[Type["Line"] = "line"] = "Line";
        Type[Type["Column"] = "column"] = "Column";
        Type[Type["Area"] = "area"] = "Area";
        Type[Type["WinLoss"] = "winloss"] = "WinLoss";
        Type[Type["Pie"] = 'pie'] = "Pie";
    })(ejSparkline.Type || (ejSparkline.Type = {}));
    var Type = ejSparkline.Type;
    (function (Themes) {
        Themes[Themes["flatlight"] = "flatlight"] = "flatlight";
        Themes[Themes["azurelight"] = "azurelight"] = "azurelight";
        Themes[Themes["limelight"] = "limelight"] = "limelight";
        Themes[Themes["saffronlight"] = "saffronlight"] = "saffronlight";
        Themes[Themes["gradientlight"] = "gradientlight"] = "gradientlight";
        Themes[Themes["flatdark"] = "flatdark"] = "flatdark";
        Themes[Themes["azuredark"] = "azuredark"] = "azuredark";
        Themes[Themes["limedark"] = "limedark"] = "limedark";
        Themes[Themes["saffrondark"] = "saffrondark"] = "saffrondark";
        Themes[Themes["gradientdark"] = "gradientdark"] = "gradientdark";
    })(ejSparkline.Themes || (ejSparkline.Themes = {}));
    var Themes = ejSparkline.Themes;
    (function ($) {
        var Sparkline = (function (_super) {
            __extends(Sparkline, _super);
            function Sparkline(id, options) {
                _super.call(this);
                this.defaults = {
                    locale: null,
                    enableGroupSeparator: false,
                    enableCanvasRendering: false,
                    padding: 8,
                    palette: ["#8A2BE2", "#ff1a75", "#99cc00", "#4d4dff", "#660066", "#FFA500", "#FFD700", "#FF00FF", "#808000", "#990000"],
                    isResponsive: true,
                    dataSource: null,
                    xName: "",
                    yName: "",
                    type: Type.Line,
                    width: 1,
                    stroke: null,
                    opacity: 1,
                    fill: "#33ccff",
                    border: {
                        color: "transparent",
                        width: 1,
                    },
                    rangeBandSettings: {
                        startRange: null,
                        endRange: null,
                        opacity: 0.4,
                        color: "transparent"
                    },
                    highPointColor: null,
                    lowPointColor: null,
                    negativePointColor: null,
                    startPointColor: null,
                    endPointColor: null,
                    tooltip: {
                        visible: false,
                        template: null,
                        fill: "white",
                        border: {
                            width: 1,
                            color: null,
                        },
                        font: {
                            fontFamily: "Segoe UI",
                            fontStyle: "Normal",
                            fontWeight: "Regular",
                            color: "#111111",
                            opacity: 1,
                            size: "8px"
                        }
                    },
                    markerSettings: {
                        visible: false,
                        fill: null,
                        width: 2,
                        opacity: 1,
                        border: {
                            color: "white",
                            width: 1,
                        }
                    },
                    background: "transparent",
                    size: {
                        height: "",
                        width: ""
                    },
                    axisLineSettings: {
                        visible: false,
                        color: "#111111",
                        width: 1,
                        dashArray: "",
                    },
                    theme: Themes.flatlight,
                    load: null,
                    loaded: null,
                    doubleClick: null,
                    rightClick: null,
                    click: null,
                    sparklineMouseMove: null,
                    sparklineMouseLeave: null,
                    seriesRendering: null,
                    pointRegionMouseMove: null,
                    pointRegionMouseClick: null,
                    tooltipInitialize: null,
                };
                this.dataTypes = {
                    dataSource: "data",
                    palette: "array",
                    type: "enum",
                    theme: "enum",
                };
                this.model = null;
                this.svgLink = "http://www.w3.org/2000/svg";
                this._id = null;
                this.negativePointIndexes = [];
                this.validTags = ['div'];
                this._id = id;
                if (!!options)
                    this.model = ejSparkline.compareExtend({}, options, this.defaults);
            }
            Sparkline.prototype.isTouch = function (evt) {
                var event = evt.originalEvent ? evt.originalEvent : evt;
                if ((event.pointerType == "touch") || (event.pointerType == 2) || (event.type.indexOf("touch") > -1))
                    return true;
                return false;
            };
            Sparkline.prototype.browserInfo = function () {
                var browser = {}, clientInfo = [], browserClients = {
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
            };
            Sparkline.prototype.fadeOut = function (tooltip) {
                var op = 1;
                var timer = setInterval(function () {
                    if (op <= 0.1) {
                        clearInterval(timer);
                        tooltip.parentNode ? tooltip.parentNode.removeChild(tooltip) : tooltip;
                    }
                    tooltip.style.opacity = op;
                    tooltip.style.filter = 'alpha(opacity=' + op * 100 + ")";
                    op -= op * 0.1;
                }, 50);
            };
            Sparkline.prototype._setModel = function (options) {
                for (var prop in options) {
                    var $content;
                    switch (prop) {
                        default:
                            ejSparkline.deepExtend(true, this.model, {}, options[prop]);
                    }
                }
                this.redraw();
            };
            Sparkline.prototype.unBindEvents = function () {
                var sparklineEle = document.getElementById(this.rootId), insideEvents = "", browserInfo = this.browserInfo(), isPointer = browserInfo.isMSPointerEnabled, isIE11Pointer = browserInfo.pointerEnabled, touchStopEvent = isPointer ? (isIE11Pointer ? "pointerup" : "MSPointerUp") : "touchend mouseup", touchMoveEvent = isPointer ? (isIE11Pointer ? "pointermove" : "MSPointerMove") : "touchmove mousemove";
                insideEvents = touchStopEvent + " " + touchMoveEvent;
                insideEvents = insideEvents.split(" ");
                for (var event in insideEvents) {
                    sparklineEle.removeEventListener(insideEvents[event], this.sparkMouseMove);
                }
                sparklineEle.removeEventListener("mouseout", this.sparkMouseLeave);
            };
            Sparkline.prototype.bindClickEvents = function (ele) {
                this.sparkClick = this.sparkClick.bind(this);
                if (ej.isTouchDevice()) {
                    this.sparkTouchStart = this.sparkTouchStart.bind(this);
                    ele.addEventListener("touchend", this.sparkClick);
                    ele.addEventListener("touchstart", this.sparkTouchStart);
                }
                else {
                    this.sparkDoubleClick = this.sparkDoubleClick.bind(this);
                    this.sparkRightClick = this.sparkRightClick.bind(this);
                    ele.addEventListener("click", this.sparkClick);
                    ele.addEventListener("dblclick", this.sparkDoubleClick);
                    ele.addEventListener("contextmenu", this.sparkRightClick);
                }
            };
            Sparkline.prototype.unBindClickEvents = function (ele) {
                if (ej.isTouchDevice()) {
                    ele.removeEventListener("touchend", this.sparkClick);
                    ele.removeEventListener("touchstart", this.sparkTouchStart);
                }
                else {
                    ele.removeEventListener("click", this.sparkClick);
                    ele.removeEventListener("dblclick", this.sparkDoubleClick);
                    ele.removeEventListener("contextmenu", this.sparkRightClick);
                }
            };
            Sparkline.prototype.bindEvents = function (ele) {
                this.sparkMouseMove = this.sparkMouseMove.bind(this);
                this.sparkMouseLeave = this.sparkMouseLeave.bind(this);
                var insideEvents = "", browserInfo = this.browserInfo(), isPointer = browserInfo.isMSPointerEnabled, isIE11Pointer = browserInfo.pointerEnabled, touchStopEvent = isPointer ? (isIE11Pointer ? "pointerup" : "MSPointerUp") : "touchend mouseup", touchMoveEvent = isPointer ? (isIE11Pointer ? "pointermove" : "MSPointerMove") : "touchmove mousemove";
                insideEvents = touchStopEvent + " " + touchMoveEvent;
                insideEvents = insideEvents.split(" ");
                for (var event in insideEvents) {
                    ele.addEventListener(insideEvents[event], this.sparkMouseMove);
                }
                ele.addEventListener("mouseout", this.sparkMouseLeave);
            };
            Sparkline.prototype.sparkTouchStart = function (event) {
                this._longPressTimer = new Date();
            };
            Sparkline.prototype.sparkClick = function (event) {
                var end = new Date();
                if (this.model.click != null)
                    this._trigger("click", { data: { event: event } });
                if (ej.isTouchDevice() && event.type != 'click') {
                    if (this._doubleTapTimer != null && ((end - this._doubleTapTimer) < 300))
                        this.sparkDoubleClick(event);
                    this._doubleTapTimer = end;
                    if (this._longPressTimer != null && end - this._longPressTimer > 1000)
                        this.sparkRightClick(event);
                }
            };
            Sparkline.prototype.sparkDoubleClick = function (event) {
                if (this.model.doubleClick != null)
                    this._trigger("doubleClick", { data: { event: event } });
            };
            Sparkline.prototype.sparkRightClick = function (event) {
                if (this.model.rightClick != null)
                    this._trigger("rightClick", { data: { event: event } });
            };
            Sparkline.prototype.sparkMouseMove = function (evt) {
                var isTouch = this.isTouch(evt);
                if (!(isTouch && (evt.type.toString().toLowerCase().indexOf("move") > -1))) {
                    var model = this.model, currentObj = this, locale = model.locale, localizedText = locale && model.enableGroupSeparator, tooltipXValue, tooltipYValue, pointsLocations = this.visiblePoints, markerId = this.container.id + "_markerExplode", pointIndex, text, labelText, markerOptions, tooltipOptions, textOptions, textPad = model.enableCanvasRendering ? 0 : 3, tooltipShape = '', tooltipHeight, tooltipWidth, eventArgs, tooltip, markerFill, containerHeight = parseInt(model.size.height), containerWidth = parseInt(model.size.width), font = model.tooltip.font, xFormat = "#point.x#", yFormat = "#point.y#", tooltipId = this.container.id + "_tooltip", tracker = document.getElementById(tooltipId), trackerPosX, tooltipBorder = model.tooltip.border.color, trackballOptions, rootele = document.getElementById(this.container.id), height = rootele.clientHeight, parent = rootele.parentNode, offset = rootele.getClientRects()[0], trackerTop = offset.top, trackerLeft = offset.left, mouseX = evt.clientX || (evt.changedTouches ? evt.changedTouches[0].clientX : evt.touches ? evt.touches[0].clientX : 0), mouseY = evt.clientY || (evt.changedTouches ? evt.changedTouches[0].clientY : evt.touches ? evt.touches[0].clientY : 0), trackerPositions = pointsLocations.map(function (obj) { return obj['location']['X'] + offset.left; }), tooltipPos = pointsLocations.map(function (obj) { return obj['location']['markerPos'] + offset.top; }), temp = Infinity, measure = this.measureText, pad, spMarker = this.model.markerSettings, mousePos, canvasTracker, canvasContext, canvasOptions, X, Y, canTracker = document.getElementById(this.container.id + "_canvasTracker");
                    for (var i = 0, diff, len = trackerPositions.length; i < len; i++) {
                        diff = Math.abs(mouseX - trackerPositions[i]);
                        if (temp > diff) {
                            temp = diff;
                            mousePos = trackerPositions[i];
                            this.pointIndex = i;
                        }
                    }
                    if ((mouseX > trackerLeft && mouseX < (trackerLeft + offset.width)) && (mouseY > trackerTop && mouseY < (trackerTop + offset.height))) {
                        temp = pointsLocations[this.pointIndex]['location'];
                        var trackTooltipModify = function (text) {
                            pad = text.length / 2;
                            var size = measure(text, font);
                            tooltipHeight = size.height + 4;
                            tooltipWidth = size.width + pad;
                            X = temp['X'];
                            Y = temp['markerPos'];
                            if ((Y - tooltipHeight / 2) < 0)
                                Y += (tooltipHeight / 2);
                            else if ((Y + tooltipHeight / 2) > containerHeight)
                                Y -= (tooltipHeight / 2);
                            if ((X + tooltipWidth + (tooltipWidth / 10)) > (containerWidth - model.padding)) {
                                X = (temp['X'] - Number(model.markerSettings.width) - Number(model.markerSettings.border.width) - 4);
                                tooltipShape = 'M ' + (X) + " " + temp['markerPos'] + " L " + (X - tooltipWidth / 10) + " " + (Y - 4) + " L " + (X - tooltipWidth / 10) + " " + (Y - (tooltipHeight / 2)) + " L " + (X - tooltipWidth - tooltipWidth / 10) + " " + (Y - (tooltipHeight / 2)) + " L " + (X - tooltipWidth - tooltipWidth / 10) + " " + (Y + (tooltipHeight / 2)) + " L " + (X - tooltipWidth / 10) + " " + (Y + (tooltipHeight / 2)) + " L " + (X - tooltipWidth / 10) + " " + (Y + 4) + " Z";
                            }
                            else {
                                X = (temp['X'] + Number(model.markerSettings.width) + Number(model.markerSettings.border.width) + 4);
                                tooltipShape = 'M ' + (X) + " " + temp['markerPos'] + " L " + (X + tooltipWidth / 10) + " " + (Y - 4) + " L " + (X + tooltipWidth / 10) + " " + (Y - (tooltipHeight / 2)) + " L " + (X + tooltipWidth + tooltipWidth / 10) + " " + (Y - (tooltipHeight / 2)) + " L " + (X + tooltipWidth + tooltipWidth / 10) + " " + (Y + (tooltipHeight / 2)) + " L " + (X + tooltipWidth / 10) + " " + (Y + (tooltipHeight / 2)) + " L " + (X + tooltipWidth / 10) + " " + (Y + 4) + " Z";
                            }
                        };
                        if (model.tooltip.template == null || model.tooltip.template == "") {
                            tooltipXValue = localizedText && temp['Xval'] ? temp['Xval'].toLocaleString(locale) : temp['Xval'];
                            tooltipYValue = localizedText && temp['Yval'] ? temp['Yval'].toLocaleString(locale) : temp['Yval'];
                            labelText = " X : " + tooltipXValue + " Y : " + tooltipYValue + " ";
                            trackTooltipModify(labelText);
                        }
                        pointIndex = this.pointIndex;
                        if (this.prevMousePos == undefined) {
                            this.prevMousePos = mousePos;
                        }
                        var checkPointFill = function (index) {
                            var mFill, highIndex = currentObj.highPointIndex, lowIndex = currentObj.lowPointIndex, negatives = currentObj.negativePointIndexes, startIndex = currentObj.startPointIndex, endIndex = currentObj.endPointIndex;
                            if (index == highIndex)
                                mFill = model.highPointColor;
                            else if (index == lowIndex)
                                mFill = model.lowPointColor;
                            else if (index == startIndex && (model.startPointColor != null))
                                mFill = model.startPointColor;
                            else if (index == endIndex && (model.endPointColor != null))
                                mFill = model.endPointColor;
                            else if (negatives.indexOf(index) >= 0 && model.negativePointColor != null)
                                mFill = model.negativePointColor;
                            else
                                mFill = spMarker.fill ? spMarker.fill : model.fill;
                            return mFill;
                        };
                        if (tracker || canTracker) {
                            if (this.prevMousePos != mousePos) {
                                eventArgs = {
                                    data: {
                                        "pointIndex": pointIndex,
                                        "currentText": labelText,
                                        "location": temp
                                    }
                                };
                                if (this.model.tooltipInitialize != null)
                                    this._trigger("tooltipInitialize", eventArgs);
                                trackerPosX = (temp['X'] - (model.width / 2));
                                if (labelText != eventArgs.data.currentText) {
                                    labelText = eventArgs.data.currentText;
                                    trackTooltipModify(labelText);
                                }
                                this.prevMousePos = mousePos;
                                markerFill = checkPointFill(pointIndex);
                                markerOptions = {
                                    'id': markerId,
                                    'cx': temp['X'],
                                    'cy': temp['markerPos'],
                                    'r': Number(spMarker.width),
                                    'fill': spMarker.border.color,
                                    'stroke': markerFill,
                                    'stroke-width': Number(spMarker.border.width),
                                };
                                if (model.tooltip.template == null || model.tooltip.template == "") {
                                    tooltipOptions = {
                                        'id': tooltipId,
                                        'fill': model.tooltip.fill,
                                        'stroke': (tooltipBorder != null) ? tooltipBorder : markerFill,
                                        'stroke-width': model.tooltip.border.width,
                                        'd': tooltipShape
                                    };
                                    textOptions = {
                                        'x': (temp['X'] + tooltipWidth + (tooltipWidth / 10)) > (containerWidth - model.padding) ? (X + textPad - (tooltipWidth) - (tooltipWidth / 10)) : X + textPad + (tooltipWidth / 10),
                                        'y': Y + tooltipHeight / 4,
                                        'fill': font.color,
                                        'font-size': font.size,
                                        'font-family': font.fontFamily,
                                        'font-weight': font.fontWeight,
                                        'font-style': font.fontStyle,
                                    };
                                }
                                else {
                                    var ele = document.getElementById(model.tooltip.template), html = ele.innerHTML, dataValue;
                                    if (typeof model.dataSource[pointIndex] === 'object') {
                                        dataValue = model.dataSource[pointIndex];
                                        dataValue.x = temp.Xval;
                                        dataValue.y = temp.Yval;
                                    }
                                    else {
                                        dataValue = { x: temp.Xval, y: temp.Yval };
                                    }
                                    var tooltipData = { point: dataValue }, html = this.parseTemplate(ele, tooltipData), text1 = ele.innerText, gap = Number(model.markerSettings.width), text1 = this.parseTemplate(ele, tooltipData), template = measure(text1, font), toolX = temp['X'] + Number(spMarker.width) + Number(spMarker.border.width) + gap;
                                    Y = (trackerTop + temp['markerPos'] - template['height'] / 2);
                                    X = (trackerLeft + toolX);
                                    if ((temp['markerPos'] - template['height'] / 2) < model.padding)
                                        Y += (template['height'] / 2);
                                    else if ((temp['markerPos'] + template['height'] / 2) > (containerHeight - model.padding))
                                        Y -= (template['height'] / 2);
                                    if ((toolX + template['width']) > (containerWidth - model.padding))
                                        X = (X - template['width']) - ((Number(spMarker.width) + Number(spMarker.border.width) + gap) * 2);
                                    tooltipOptions = {
                                        'background': model.tooltip.fill,
                                        'border': model.tooltip.border.width + 'px solid ' + ((tooltipBorder != null) ? tooltipBorder : markerFill),
                                        'left': X + 'px',
                                        'top': Y + 'px',
                                    };
                                    tooltip = document.getElementById(tooltipId),
                                        tooltip.innerHTML = html;
                                    this.setStyles(tooltipOptions, tooltip);
                                }
                                if (!model.enableCanvasRendering) {
                                    var groupTooltip = document.getElementById(tooltipId + "_g");
                                    this.drawCircle(markerOptions, groupTooltip);
                                    if (model.tooltip.template == null) {
                                        this.drawPath(tooltipOptions, groupTooltip);
                                        text = rootele.getElementsByTagName('text')[0];
                                        text.textContent = labelText;
                                        this.setAttributes(textOptions, text);
                                        groupTooltip.appendChild(text);
                                    }
                                }
                                else {
                                    canvasTracker = document.getElementById(this.container.id + "_canvasTracker");
                                    canvasContext = canvasTracker.getContext('2d');
                                    canvasContext.clearRect(0, 0, containerWidth, containerHeight);
                                    this.canvasDrawCircle(markerOptions, canvasContext);
                                    if (model.tooltip.template == null || model.tooltip.template == "") {
                                        this.canvasDrawPath(tooltipOptions, canvasContext);
                                        textOptions.font = font.size + " " + font.fontFamily;
                                        this.canvasDrawText(textOptions, labelText, canvasContext);
                                    }
                                }
                            }
                        }
                        else {
                            eventArgs = {
                                data: {
                                    "pointIndex": pointIndex,
                                    "currentText": labelText,
                                    "location": temp
                                }
                            };
                            if (this.model.tooltipInitialize != null)
                                this._trigger("tooltipInitialize", eventArgs);
                            trackerPosX = (temp['X'] - (model.width / 2));
                            if (labelText != eventArgs.data.currentText) {
                                labelText = eventArgs.data.currentText;
                                trackTooltipModify(labelText);
                            }
                            var tooltipElements = document.getElementsByClassName("ej-sparkline-tooltip");
                            if (tooltipElements[0]) {
                                tooltipElements[0].parentNode.removeChild(tooltipElements[0]);
                            }
                            markerFill = checkPointFill(pointIndex);
                            markerOptions = {
                                'id': markerId,
                                'cx': temp['X'],
                                'cy': temp['markerPos'],
                                'r': Number(spMarker.width),
                                'fill': spMarker.border.color,
                                'stroke': markerFill,
                                'stroke-width': Number(spMarker.border.width),
                            };
                            if (model.tooltip.template == null || model.tooltip.template == "") {
                                tooltipOptions = {
                                    'id': tooltipId,
                                    'fill': model.tooltip.fill,
                                    'stroke': (tooltipBorder != null) ? tooltipBorder : markerFill,
                                    'stroke-width': model.tooltip.border.width,
                                    'd': tooltipShape
                                };
                                textOptions = {
                                    'x': (temp['X'] + tooltipWidth + (tooltipWidth / 10)) > (containerWidth - model.padding) ? (X + textPad - (tooltipWidth) - (tooltipWidth / 10)) : X + textPad + (tooltipWidth / 10),
                                    'y': Y + tooltipHeight / 4,
                                    'fill': font.color,
                                    'opacity': font.opacity,
                                    'font-size': font.size,
                                    'font-family': font.fontFamily,
                                    'font-weight': font.fontWeight,
                                    'font-style': font.fontStyle,
                                };
                            }
                            else {
                                var ele = document.getElementById(model.tooltip.template), html = ele.innerHTML, dataValue;
                                if (typeof model.dataSource[pointIndex] === 'object') {
                                    dataValue = model.dataSource[pointIndex];
                                    dataValue.x = temp.Xval;
                                    dataValue.y = temp.Yval;
                                }
                                else {
                                    dataValue = { x: temp.Xval, y: temp.Yval };
                                }
                                var tooltipData = { point: dataValue }, html = this.parseTemplate(ele, tooltipData), text1 = ele.innerText, gap = Number(model.markerSettings.width), text1 = this.parseTemplate(ele, tooltipData), template = measure(text1, font);
                                var toolX = temp['X'] + Number(spMarker.width) + Number(spMarker.border.width) + gap;
                                Y = (trackerTop + temp['markerPos'] - template['height'] / 2);
                                X = (trackerLeft + toolX);
                                if ((temp['markerPos'] - template['height'] / 2) < model.padding)
                                    Y += (template['height'] / 2);
                                else if ((temp['markerPos'] + template['height'] / 2) > (containerHeight - model.padding))
                                    Y -= (template['height'] / 2);
                                if ((toolX + template['width']) > (containerWidth - model.padding))
                                    X = (X - template['width']) - ((Number(spMarker.width) + Number(spMarker.border.width) + gap) * 2);
                                tooltipOptions = {
                                    'background': model.tooltip.fill,
                                    'border': model.tooltip.border.width + 'px solid ' + ((tooltipBorder != null) ? tooltipBorder : markerFill),
                                    'left': X + 'px',
                                    'top': Y + 'px',
                                    'position': 'fixed',
                                    'height': 'auto',
                                    'width': 'auto',
                                    'display': 'block',
                                    'opacity': font.opacity,
                                    'font': font.size + " " + font.fontFamily,
                                };
                                tooltip = document.createElement('div');
                                this.setAttributes({ 'id': tooltipId, 'class': 'ej-sparkline-tooltip' }, tooltip);
                                this.setStyles(tooltipOptions, tooltip);
                                tooltip.innerHTML = html;
                                parent.appendChild(tooltip);
                            }
                            if (!model.enableCanvasRendering) {
                                var tooltipGroup = document.createElementNS(this.svgLink, "g");
                                this.setAttributes({ "id": tooltipId + "_g", 'class': 'ej-sparkline-tooltip' }, tooltipGroup);
                                this.container.appendChild(tooltipGroup);
                                this.drawCircle(markerOptions, tooltipGroup);
                                if (model.tooltip.template == null) {
                                    this.drawPath(tooltipOptions, tooltipGroup);
                                    text = this.createText(textOptions, labelText);
                                    tooltipGroup.appendChild(text);
                                }
                            }
                            else {
                                canvasTracker = document.createElement('canvas');
                                canvasOptions =
                                    {
                                        'id': this.container.id + "_canvasTracker",
                                        'fill': 'transparent',
                                        'class': 'ej-sparkline-tooltip',
                                        'height': model.size.height,
                                        'width': model.size.width,
                                    };
                                this.setAttributes(canvasOptions, canvasTracker);
                                this.setStyles({ 'left': (trackerLeft) + 'px', 'top': (trackerTop) + 'px', 'position': 'fixed' }, canvasTracker);
                                canvasContext = canvasTracker.getContext('2d');
                                this.canvasDrawCircle(markerOptions, canvasContext);
                                if (model.tooltip.template == null || model.tooltip.template == "") {
                                    this.canvasDrawPath(tooltipOptions, canvasContext);
                                    textOptions.font = font.size + " " + font.fontFamily;
                                    this.canvasDrawText(textOptions, labelText, canvasContext);
                                }
                                this.container.parentNode.appendChild(canvasTracker);
                            }
                        }
                    }
                    if (isTouch) {
                        var eleId = (model.tooltip.template == null || model.tooltip.template == "") ? ((model.enableCanvasRendering) ? (this.container.id + "_canvasTracker") : (tooltipId + "_g")) : (tooltipId);
                        var touchtooltip = document.getElementById(eleId);
                        var sparklineObj = this;
                        setTimeout(function () {
                            sparklineObj.fadeOut(touchtooltip);
                        }, 1000);
                    }
                }
            };
            Sparkline.prototype.sparkMouseLeave = function (evt) {
                var mouseX = evt.clientX || (evt.touches[0] ? evt.touches[0].clientX : evt.changedTouches[0].clientX), mouseY = evt.clientY || (evt.touches[0] ? evt.touches[0].clientY : evt.changedTouches[0].clientY), rootele = this.container, height = rootele.clientHeight, offset = rootele.getClientRects()[0], trackerTop = offset.top, trackerLeft = offset.left, model = this.model, tooltipId = this.container.id + "_tooltip";
                if ((mouseX < trackerLeft || mouseX > (trackerLeft + offset.width)) || (mouseY < trackerTop || mouseY > (trackerTop + offset.height)) || this.touchEnd) {
                    if (model.tooltip.template != null && model.tooltip.template != "") {
                        var tooltemp = document.getElementById(tooltipId);
                        tooltemp ? tooltemp.parentNode.removeChild(tooltemp) : tooltemp;
                    }
                    if (!this.model.enableCanvasRendering) {
                        var trackerId = tooltipId + "_g", tracker = document.getElementById(trackerId);
                        tracker ? this.container.removeChild(tracker) : tracker;
                    }
                    else {
                        var canEle = document.getElementById(this.container.id + '_canvasTracker');
                        canEle ? canEle.parentNode.removeChild(canEle) : canEle;
                    }
                }
            };
            Sparkline.prototype.bindPieEvents = function (ele) {
                this.pieTooltip = this.pieTooltip.bind(this);
                this.pieTooltipHide = this.pieTooltipHide.bind(this);
                var insideEvents = "", browserInfo = this.browserInfo(), isPointer = browserInfo.isMSPointerEnabled, isIE11Pointer = browserInfo.pointerEnabled, touchStopEvent = isPointer ? (isIE11Pointer ? "pointerup" : "MSPointerUp") : "touchend mouseup", touchMoveEvent = isPointer ? (isIE11Pointer ? "pointermove" : "MSPointerMove") : "touchmove mousemove";
                insideEvents = touchStopEvent + " " + touchMoveEvent;
                insideEvents = insideEvents.split(" ");
                for (var event in insideEvents) {
                    ele.addEventListener(insideEvents[event], this.pieTooltip);
                }
                ele.addEventListener("mouseout", this.pieTooltipHide);
                if (this.model.pointRegionMouseClick != null) {
                    ele.addEventListener("click", this.pieTooltip);
                    ele.addEventListener("touchstart", this.pieTooltip);
                }
            };
            Sparkline.prototype.unbindPieEvents = function () {
                var insideEvents = "", browserInfo = this.browserInfo(), isPointer = browserInfo.isMSPointerEnabled, isIE11Pointer = browserInfo.pointerEnabled, touchStopEvent = isPointer ? (isIE11Pointer ? "pointerup" : "MSPointerUp") : "touchend mouseup", touchMoveEvent = isPointer ? (isIE11Pointer ? "pointermove" : "MSPointerMove") : "touchmove mousemove", sparklineEle = document.getElementById(this.rootId);
                insideEvents = touchStopEvent + " " + touchMoveEvent;
                insideEvents = insideEvents.split(" ");
                for (var event in insideEvents) {
                    sparklineEle.removeEventListener(insideEvents[event], this.pieTooltip);
                }
                sparklineEle.removeEventListener("mouseout", this.pieTooltipHide);
            };
            Sparkline.prototype.pieTooltip = function (evt) {
                var isTouch = this.isTouch(evt);
                if (isTouch)
                    evt.stopImmediatePropagation();
                if (!(isTouch && (evt.type.toString().toLowerCase().indexOf("move") > -1))) {
                    if (this.model.sparklineMouseMove != null)
                        this._trigger("sparklineMouseMove");
                    var model = this.model, mouseX = evt.clientX || (evt.changedTouches ? evt.changedTouches[0].clientX : evt.touches ? evt.touches[0].clientX : 0), containerHeight = parseInt(model.size.height), containerWidth = parseInt(model.size.width), font = model.tooltip.font, mouseY = evt.clientY || (evt.changedTouches ? evt.changedTouches[0].clientY : evt.touches ? evt.touches[0].clientY : 0), rootele = document.getElementById(this.container.id), parent = rootele.parentNode, offset = rootele.getClientRects()[0], containerTop = offset.top, containerLeft = offset.left, visiblePos = this.visiblePoints.map(function (a) { return a['coordinates']; }), data = this.visiblePoints.map(function (a) { return a['location']; }), radius = this.visiblePoints['radius'], centerPos = this.visiblePoints['centerPos'], angles = this.visiblePoints, currStDeg, currEdDeg, sliceIndex, dx = mouseX - (centerPos.X + containerLeft), dy = mouseY - (centerPos.Y + containerTop), angle = Math.atan2(dy, dx), pietipId = this.container.id + "_pieTooltip", tooltip = document.getElementById(pietipId), tooltipOptions, tooltipBorder = model.tooltip.border.color, pointRadius = Math.sqrt(dx * dx + dy * dy), eventType = (model.pointRegionMouseClick != null) ? "pointRegionMouseClick" : (model.pointRegionMouseMove != null) ? "pointRegionMouseMove" : null, colors = model.palette, locale = model.locale, localizedText = model.enableGroupSeparator;
                    if (Math.abs(pointRadius) <= radius) {
                        for (var i = 0, len = angles.length; i < len; i++) {
                            currStDeg = angles[i]['stAng'];
                            currEdDeg = angles[i]['endAng'];
                            angle = angle < 0 ? (6.283 + angle) : angle;
                            if (angle <= currEdDeg && angle >= currStDeg) {
                                sliceIndex = i;
                                if ((eventType == "pointRegionMouseClick" && (evt.type == "click" || evt.type == "touchstart")) || eventType == "pointRegionMouseMove")
                                    this._trigger(eventType, {
                                        data: {
                                            "pointIndex": i,
                                            "seriesType": "Pie",
                                            'locationX': mouseX,
                                            'locationY': mouseY
                                        }
                                    });
                            }
                        }
                    }
                    else if (tooltip)
                        tooltip.parentNode.removeChild(tooltip);
                    if (tooltip && sliceIndex != null) {
                        var text = data[sliceIndex]['Percent'].toFixed(2);
                        text = localizedText ? "&nbsp" + parseFloat(text).toLocaleString(locale) : text + "&nbsp%&nbsp";
                        var size = this.measureText(text, font);
                        tooltipOptions = {
                            'left': mouseX + 12 + "px",
                            'top': mouseY + "px",
                            'border': model.tooltip.border.width + "px solid " + ((tooltipBorder != null) ? tooltipBorder : colors[sliceIndex % colors.length]),
                            'background-color': model.tooltip.fill,
                            'height': size.height + "px",
                            'width': size.width + "px",
                        };
                        this.setStyles(tooltipOptions, tooltip);
                        tooltip.innerHTML = text;
                    }
                    else if (sliceIndex != null) {
                        tooltip = document.createElement('div');
                        var text = data[sliceIndex]['Percent'].toFixed(2);
                        text = localizedText ? "&nbsp" + parseFloat(text).toLocaleString(locale) : text + "&nbsp%&nbsp";
                        var size = this.measureText(text, font);
                        tooltipOptions = {
                            'left': mouseX + 12 + "px",
                            'top': mouseY + "px",
                            'background-color': model.tooltip.fill,
                            'color': font.color,
                            'border': model.tooltip.border.width + "px solid " + ((tooltipBorder != null) ? tooltipBorder : colors[sliceIndex % colors.length]),
                            'height': size.height + "px",
                            'width': size.width + "px",
                            'font-size': font.size,
                            'opacity': font.opacity,
                            'font-weight': font.fontWeight,
                            'font-family': font.fontFamily,
                            'font-style': font.fontStyle,
                            'z-index': "100000",
                            'position': "fixed"
                        };
                        tooltip.setAttribute('id', pietipId);
                        this.setStyles(tooltipOptions, tooltip);
                        tooltip.innerHTML = text;
                        document.body.appendChild(tooltip);
                    }
                    if (isTouch) {
                        this.touchEnd = true;
                        var touchtooltip = document.getElementById(this.container.id + "_pieTooltip");
                        var sparklineObj = this;
                        setTimeout(function () {
                            sparklineObj.fadeOut(touchtooltip);
                        }, 500);
                    }
                }
            };
            Sparkline.prototype.pieTooltipHide = function (evt) {
                if (!this.touchEnd) {
                    if (this.model.sparklineMouseLeave != null)
                        this._trigger("sparklineMouseLeave");
                    var pietipId = this.container.id + "_pieTooltip", tooltip = document.getElementById(pietipId);
                    tooltip ? document.body.removeChild(tooltip) : tooltip;
                }
            };
            Sparkline.prototype.bindRegionEvents = function (ele) {
                this.sparklineEvent = this.sparklineEvent.bind(this);
                var browser = this.findBrowser();
                if (browser == "IE" || browser == 'firefox') {
                    ele.style['touch-action'] = 'none';
                }
                if (this.model.pointRegionMouseMove != null) {
                    ele.addEventListener("mousemove", this.sparklineEvent, true);
                    ele.addEventListener("touchmove", this.sparklineEvent, true);
                }
                if (this.model.pointRegionMouseClick != null) {
                    ele.addEventListener("click", this.sparklineEvent, true);
                    ele.addEventListener("touchstart", this.sparklineEvent, true);
                }
                if (this.model.sparklineMouseMove != null) {
                    ele.addEventListener("mousemove", this.sparklineEvent, true);
                    ele.addEventListener("touchmove", this.sparklineEvent, true);
                }
                if (this.model.sparklineMouseLeave != null) {
                    this.sparklineLeave = this.sparklineLeave.bind(this);
                    ele.addEventListener('mouseout', this.sparklineLeave, true);
                    if (browser == 'firefox') {
                        ele.addEventListener('mouseup', this.sparklineLeave, true);
                    }
                    ele.addEventListener('touchend', this.sparklineLeave, true);
                }
            };
            Sparkline.prototype.sparklineLeave = function () {
                if (this.model.sparklineMouseLeave != null)
                    this._trigger("sparklineMouseLeave");
            };
            Sparkline.prototype.sparklineEvent = function (evt) {
                if (this.model.sparklineMouseMove != null)
                    this._trigger("sparklineMouseMove");
                var model = this.model, mouseX = evt.clientX || evt.touches[0].clientX, mouseY = evt.clientY || evt.touches[0].clientY, stype = model.type, pointLoc = this.visiblePoints, rX1, rY1, rX2, rY2, width, height, rootele = document.getElementById(this.container.id), parent = rootele.parentNode, offset = rootele.getClientRects()[0], containerTop = offset.top, containerLeft = offset.left, eventType;
                eventType = (model.pointRegionMouseClick != null) ? "pointRegionMouseClick" : (model.pointRegionMouseMove != null) ? "pointRegionMouseMove" : null;
                if (stype == Type.Line || stype == Type.Area) {
                    width = 2 * (model.markerSettings.width + model.markerSettings.border.width);
                    height = width;
                    for (var i = 0, len = pointLoc.length; i < len; i++) {
                        rX1 = containerLeft + pointLoc[i]['location'].X - (width / 2);
                        rY1 = containerTop + pointLoc[i]['location'].Y - (height / 2);
                        rX2 = rX1 + width;
                        rY2 = rY1 + height;
                        if (mouseX >= rX1 && mouseX <= rX2 && mouseY >= rY1 && mouseY <= rY2) {
                            if (eventType != null)
                                this._trigger(eventType, {
                                    data: {
                                        "pointIndex": i,
                                        "seriesType": stype,
                                        'locationX': pointLoc[i]['location'].X,
                                        'locationY': pointLoc[i]['location'].Y
                                    }
                                });
                        }
                    }
                }
                else if (stype == Type.Column || stype == Type.WinLoss) {
                    width = pointLoc[0]['location'].width;
                    for (var i = 0, len = pointLoc.length; i < len; i++) {
                        height = pointLoc[i]['location'].height;
                        rX1 = containerLeft + pointLoc[i]['location'].X - (width / 2);
                        rY1 = containerTop + pointLoc[i]['location'].Y;
                        rX2 = rX1 + width;
                        rY2 = rY1 + height;
                        if (mouseX >= rX1 && mouseX <= rX2 && mouseY >= rY1 && mouseY <= rY2) {
                            if (eventType != null)
                                this._trigger(eventType, {
                                    data: {
                                        "pointIndex": i,
                                        "seriesType": stype,
                                        'locationX': pointLoc[i]['location'].X,
                                        'locationY': pointLoc[i]['location'].Y
                                    }
                                });
                        }
                    }
                }
            };
            Sparkline.prototype.findBrowser = function () {
                var browser;
                if (navigator.userAgent.indexOf("Firefox") != -1) {
                    browser = 'firefox';
                }
                else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document['documentMode'] == true)) {
                    browser = 'IE';
                }
                else {
                    browser = null;
                }
                return browser;
            };
            Sparkline.prototype.resize = function (evt) {
                var currentObj = this;
                var element = document.getElementById(this.rootId);
                if (element != null || element != undefined) {
                    window.removeEventListener("resize", this.resize);
                    this.isResized = true;
                    this._destroy();
                    this.createSvg();
                    this.renderSparkline();
                    this.isResized = false;
                }
                else {
                    window.removeEventListener("resize", this.resize);
                }
            };
            Sparkline.prototype.supportsSvg = function () {
                return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg");
            };
            Sparkline.prototype._init = function (options) {
                if (this.supportsSvg()) {
                    this.rootId = (this.rootId != null) ? this.rootId : this._id;
                    this.parentElement = (this.parentElement != null) ? this.parentElement : document.getElementById(this.rootId);
                    if (this.model.load != null)
                        this._trigger("load");
                    this.setTheme(this.model);
                    this.height = parseInt(this.model.size.height);
                    this.width = parseInt(this.model.size.width);
                    this.createSvg();
                    this.renderSparkline();
                    if (this.model.loaded != null)
                        this._trigger("loaded");
                }
            };
            Sparkline.prototype.redraw = function () {
                this.emptyContainer();
                this.renderSparkline();
            };
            Sparkline.prototype.touchCheck = function (event) {
                this.touchEnd = true;
                if (this.model.type.toString().toLocaleLowerCase() != "pie") {
                    this.sparkMouseLeave(event);
                }
                else
                    this.pieTooltipHide(event);
            };
            Sparkline.prototype.emptyContainer = function () {
                var model = this.model;
                if (model.enableCanvasRendering) {
                    this.ctx.clearRect(0, 0, this.height, this.width);
                }
                else {
                    var container = this.container;
                    while (container.firstChild) {
                        container.removeChild(container.firstChild);
                    }
                }
            };
            Sparkline.prototype._destroy = function () {
                var container = document.getElementById(this.container.id);
                if (container != null) {
                    this.unBindEvents();
                    this.unbindPieEvents();
                    window.removeEventListener("resize", this.resize);
                    container.parentNode.removeChild(container);
                }
                else {
                    window.removeEventListener("resize", this.resize);
                }
            };
            Sparkline.prototype.renderSparkline = function () {
                this.setStyles({ 'background': this.model.background }, this.container);
                this.calculatePoints();
                this.seriesRender();
                this.resize = this.resize.bind(this);
                if (this.model.isResponsive) {
                    window.addEventListener("resize", this.resize);
                }
                else {
                    window.removeEventListener("resize", this.resize);
                }
                if ((this.model.type != Type.WinLoss && this.model.type != Type.Pie) && this.model.tooltip.visible)
                    this.bindEvents(this.parentElement);
                else
                    this.unBindEvents();
                if (this.model.type == Type.Pie && this.model.tooltip.visible)
                    this.bindPieEvents(this.parentElement);
                else
                    this.unbindPieEvents();
                this.bindRegionEvents(this.parentElement);
                this.unBindClickEvents(this.parentElement);
                this.bindClickEvents(this.parentElement);
            };
            Sparkline.prototype.animateSparkline = function () {
                var model = this.model, sparkObj = this, stype = model.type, padding = model.padding, axisHeight = this.axisHeight, width = parseInt(model.size.width), height = parseInt(model.size.height), i, temp, timer, def = document.createElementNS(this.svgLink, "defs"), clipRect = document.createElementNS(this.svgLink, "clipPath"), animOption, clipOption, rect;
                if (stype == Type.Pie)
                    rect = document.createElementNS(this.svgLink, "path");
                else
                    rect = document.createElementNS(this.svgLink, "rect");
                if (stype == Type.Line || stype == Type.Area) {
                    animOption = {
                        "id": "clipRectSparkline",
                        "x": 0,
                        "y": 0,
                        "width": 0,
                        "height": height
                    };
                    timer = width / 10;
                    var animater = setInterval(animate, 120);
                    i = timer;
                }
                else if (stype == Type.Column || stype == Type.WinLoss) {
                    if (axisHeight == padding) {
                        animOption = {
                            "id": "clipRectSparkline",
                            "x": 0,
                            "y": 0,
                            "width": width,
                            "height": 0
                        };
                        timer = height / 10;
                        i = timer;
                        var ngtiveRectAnimater = setInterval(animateNegtiveRect, 120);
                    }
                    else if (axisHeight == (height - padding)) {
                        animOption = {
                            "id": "clipRectSparkline",
                            "x": 0,
                            "y": height,
                            "width": width,
                            "height": 0
                        };
                        timer = height / 10;
                        i = height;
                        var rectAnimater = setInterval(animateRect, 120);
                    }
                    else {
                        animOption = {
                            "id": "clipRectSparkline",
                            "x": 0,
                            "y": axisHeight,
                            "width": width,
                            "height": 0
                        };
                        timer = height / 10;
                        i = axisHeight;
                        var upperAnimater = setInterval(animateUpper, 120);
                    }
                }
                else {
                    var values = this.visiblePoints, centerPos = values['centerPos'], area = values['radius'], deg, stRad, edRad, pathArc = "", stDeg = 90, edDeg = 0, flag;
                    i = 0;
                    animOption = {
                        "id": "clipRectSparkline",
                        "d": pathArc,
                    };
                    var pieAnimater = setInterval(pieAnimate, 120);
                }
                clipOption = {
                    "id": this.container.id + "_sparklineRect",
                };
                this.setAttributes(animOption, rect);
                this.setAttributes(clipOption, clipRect);
                clipRect.appendChild(rect);
                def.appendChild(clipRect);
                this.container.appendChild(def);
                function animate() {
                    if (i <= width) {
                        rect.setAttribute("width", i.toString());
                    }
                    else {
                        clearInterval(animater);
                        sparkObj._trigger("animationComplete");
                    }
                    i = i + timer;
                }
                function animateRect() {
                    temp = height - i;
                    if (i >= 0) {
                        rect.setAttribute("y", i.toString());
                        rect.setAttribute("height", temp);
                    }
                    else {
                        clearInterval(rectAnimater);
                        sparkObj._trigger("animationComplete");
                    }
                    i = i - timer;
                }
                ;
                function animateNegtiveRect() {
                    if (i <= height) {
                        rect.setAttribute("height", i.toString());
                    }
                    else {
                        clearInterval(ngtiveRectAnimater);
                        sparkObj._trigger("animationComplete");
                    }
                    i = i + timer;
                }
                ;
                function animateUpper() {
                    temp = (axisHeight - i) * 2;
                    if (i >= -timer) {
                        rect.setAttribute("y", i < 0 ? 0 : i.toString());
                        rect.setAttribute("height", temp);
                    }
                    else {
                        clearInterval(upperAnimater);
                        sparkObj._trigger("animationComplete");
                    }
                    i = i - timer;
                }
                ;
                function pieAnimate() {
                    if (i <= (values.length - 1)) {
                        stDeg = 90;
                        deg = values[i]['location']['Degree'];
                        edDeg += deg + (i == 0 ? stDeg : 0);
                        stRad = (stDeg - 90) * Math.PI / 180.0;
                        edRad = (edDeg - 90) * Math.PI / 180.0;
                        if (i == values.length - 1)
                            edRad -= 0.0001;
                        temp = { sX: centerPos.X + (area * Math.cos(stRad)), sY: centerPos.Y + (area * Math.sin(stRad)), eX: centerPos.X + (area * Math.cos(edRad)), eY: centerPos.Y + (area * Math.sin(edRad)) };
                        pathArc = "M " + centerPos.X + " " + centerPos.Y + " L " + temp.eX + " " + temp.eY + " A " + area + " " + area + " 0 " + 1 + ",0 " + temp.sX + " " + temp.sY + " Z";
                        rect.setAttribute("d", pathArc);
                    }
                    else {
                        clearInterval(pieAnimater);
                        sparkObj._trigger("animationComplete");
                    }
                    i += 1;
                }
            };
            Sparkline.prototype.setTheme = function (model) {
                var theme = model.theme, defaults = this.defaults;
                if (theme == Themes.flatdark) {
                    model.background = (model.background == defaults.background) ? "#111111" : model.background;
                    model.fill = (model.fill == defaults.fill) ? "#B5B5B5" : model.fill;
                    model.stroke = (model.stroke == defaults.stroke) ? "#F6D321" : model.stroke;
                    model.axisLineSettings.color = (model.axisLineSettings.color) == defaults.axisLineSettings.color ? "#AAAAAA" : model.axisLineSettings.color;
                }
                else if (theme == Themes.gradientlight) {
                    model.background = (model.background == defaults.background) ? "transparent" : model.background;
                    model.fill = (model.fill == defaults.fill) ? "#F34649" : model.fill;
                    model.stroke = (model.stroke == defaults.stroke) ? "#597B15" : model.stroke;
                    model.axisLineSettings.color = (model.axisLineSettings.color) == defaults.axisLineSettings.color ? "#8E8E8E" : model.axisLineSettings.color;
                }
                else if (theme == Themes.gradientdark) {
                    model.background = (model.background == defaults.background) ? "#111111" : model.background;
                    model.fill = (model.fill == defaults.fill) ? "#005378" : model.fill;
                    model.stroke = (model.stroke == defaults.stroke) ? "#6A9319" : model.stroke;
                    model.axisLineSettings.color = (model.axisLineSettings.color) == defaults.axisLineSettings.color ? "#AAAAAA" : model.axisLineSettings.color;
                }
                else if (theme == Themes.azuredark) {
                    model.background = (model.background == defaults.background) ? "#111111" : model.background;
                    model.fill = (model.fill == defaults.fill) ? "#007fff" : model.fill;
                    model.stroke = (model.stroke == defaults.stroke) ? "#f0ffff" : model.stroke;
                    model.axisLineSettings.color = (model.axisLineSettings.color) == defaults.axisLineSettings.color ? "#336699" : model.axisLineSettings.color;
                }
                else if (theme == Themes.azurelight) {
                    model.background = (model.background == defaults.background) ? "transparent" : model.background;
                    model.fill = (model.fill == defaults.fill) ? "#336699" : model.fill;
                    model.stroke = (model.stroke == defaults.stroke) ? "#007fff" : model.stroke;
                    model.axisLineSettings.color = (model.axisLineSettings.color) == defaults.axisLineSettings.color ? "#336699" : model.axisLineSettings.color;
                }
                else if (theme == Themes.limedark) {
                    model.background = (model.background == defaults.background) ? "#111111" : model.background;
                    model.fill = (model.fill == defaults.fill) ? "#238f23" : model.fill;
                    model.stroke = (model.stroke == defaults.stroke) ? "#32CD32" : model.stroke;
                    model.axisLineSettings.color = (model.axisLineSettings.color) == defaults.axisLineSettings.color ? "#43da21" : model.axisLineSettings.color;
                }
                else if (theme == Themes.limelight) {
                    model.background = (model.background == defaults.background) ? "transparent" : model.background;
                    model.fill = (model.fill == defaults.fill) ? "#238f23" : model.fill;
                    model.stroke = (model.stroke == defaults.stroke) ? "#32CD32" : model.stroke;
                    model.axisLineSettings.color = (model.axisLineSettings.color) == defaults.axisLineSettings.color ? "#43da21" : model.axisLineSettings.color;
                }
                else if (theme == Themes.saffrondark) {
                    model.background = (model.background == defaults.background) ? "#111111" : model.background;
                    model.fill = (model.fill == defaults.fill) ? "#ffaa33" : model.fill;
                    model.stroke = (model.stroke == defaults.stroke) ? "#ffdba9" : model.stroke;
                    model.axisLineSettings.color = (model.axisLineSettings.color) == defaults.axisLineSettings.color ? "#ffc26e" : model.axisLineSettings.color;
                }
                else if (theme == Themes.saffronlight) {
                    model.background = (model.background == defaults.background) ? "transparent" : model.background;
                    model.fill = (model.fill == defaults.fill) ? "#ffaa33" : model.fill;
                    model.stroke = (model.stroke == defaults.stroke) ? "#ffdba9" : model.stroke;
                    model.axisLineSettings.color = (model.axisLineSettings.color) == defaults.axisLineSettings.color ? "#ffc26e" : model.axisLineSettings.color;
                }
                else if (theme == null || theme == Themes.flatlight) {
                    model.background = (model.background == defaults.background) ? "transparent" : model.background;
                    model.fill = (model.fill == defaults.fill) ? "#33ccff" : model.fill;
                    model.stroke = (model.stroke == defaults.stroke) ? "#33ccff" : model.stroke;
                    model.axisLineSettings.color = (model.axisLineSettings.color) == defaults.axisLineSettings.color ? "#FF0000" : model.axisLineSettings.color;
                }
            };
            Sparkline.prototype.createSvg = function () {
                var model = this.model, parentElement = this.parentElement.clientWidth > 0 ? this.parentElement : this.parentElement.parentElement, options, parentHeight = (parseInt(parentElement.style.height) > parentElement.clientHeight) ? parseInt(parentElement.style.height) : parentElement.clientHeight, parentWidth = (parseInt(parentElement.style.width) > parentElement.clientWidth) ? parseInt(parentElement.style.width) : parentElement.clientWidth, width = model.size.width == "" ? parentWidth : parseInt(model.size.width), height = model.size.height == "" ? parentHeight : parseInt(model.size.height);
                height = (height > 0) ? height : (parentHeight > 0) ? parentHeight : 30;
                width = this.model.isResponsive && this.isResized ? (parentWidth > 0) ? parentWidth : width : width;
                width = width <= 0 ? 50 : width;
                model.size.height = height.toString();
                model.size.width = width.toString();
                this.height = height;
                this.width = width;
                options = {
                    "id": this.rootId + "_sparkline_svg",
                    "width": width,
                    "height": height,
                };
                if (!model.enableCanvasRendering) {
                    this.container = document.createElementNS(this.svgLink, "svg");
                }
                else {
                    this.container = document.createElement("canvas");
                    this.ctx = this.container.getContext('2d');
                }
                this.setAttributes(options, this.container);
                this.parentElement.appendChild(this.container);
            };
            Sparkline.prototype.setStyles = function (Options, element) {
                var properties = Object.keys(Options), temp;
                var values = properties.map(function (property) { return Options[property]; });
                for (var i = 0, len = properties.length; i < len; i++) {
                    temp = properties[i];
                    element.style[temp] = values[i];
                }
            };
            Sparkline.prototype.setAttributes = function (Options, element) {
                var properties = Object.keys(Options);
                var values = properties.map(function (property) { return Options[property]; });
                for (var i = 0, len = properties.length; i < len; i++) {
                    element.setAttribute(properties[i], values[i]);
                }
            };
            Sparkline.prototype.getDefaultPoints = function (count) {
                var data = [], i = 1;
                for (; i <= count; i++) {
                    if ((Math.random() * 10) > 5)
                        data.push(-Math.round(Math.random() * 100));
                    data.push(Math.round(Math.random() * 100));
                }
                return data;
            };
            Sparkline.prototype.calculatePoints = function () {
                var model = this.model, stype = model.type, data = (model.dataSource != null) ? model.dataSource : this.getDefaultPoints(12), x, y, max, min, minX, maxX, visiblePoints = [], maxPointsLength = data.length, temp, sumofValues = 0;
                if (Array.isArray(data) && typeof data[0] != 'object') {
                    if (model.type == Type.Pie) {
                        for (var i = 0; i < maxPointsLength; i++) {
                            sumofValues += Math.abs(data[i]);
                        }
                    }
                    else {
                        max = Math.max.apply(null, data);
                        min = Math.min.apply(null, data);
                        minX = 0;
                        maxX = maxPointsLength - 1;
                    }
                }
                else {
                    if (model.type == Type.Pie) {
                        for (var i = 0; i < maxPointsLength; i++) {
                            sumofValues += Math.abs(data[i][model.yName]);
                        }
                    }
                    else {
                        if (!data[0][model.xName]) {
                            var x = data.map(function (z) { return z[model.yName]; });
                            max = Math.max.apply(null, x);
                            min = Math.min.apply(null, x);
                        }
                        else {
                            temp = data;
                            temp = temp.sort(function (a, b) { return a[model.yName] - b[model.yName]; });
                            max = temp[temp.length - 1][model.yName];
                            min = temp[0][model.yName];
                        }
                        if (data[0][model.xName]) {
                            temp = temp.sort(function (a, b) { return a[model.xName] - b[model.xName]; });
                            maxX = temp[temp.length - 1][model.xName];
                            minX = temp[0][model.xName];
                        }
                        else {
                            minX = 0;
                            maxX = maxPointsLength - 1;
                        }
                    }
                }
                if (model.type != Type.Pie) {
                    this.maxLength = maxPointsLength;
                    var location, padding = Number(model.padding), height = parseInt(model.size.height) - (padding * 2), width = parseInt(model.size.width) - (padding * 2), unitX = maxX - minX, unitY = max - min, unitX = unitX == 0 ? 1 : unitX;
                    unitY = unitY == 0 ? 1 : unitY;
                    this.min = min;
                    this.unitX = unitX;
                    this.minX = minX;
                    this.unitY = unitY;
                    this.max = max;
                    this.maxX = maxX;
                    var X1 = 0, Y1 = height - ((height / unitY) * (-min)), Y2, Y1 = (min < 0 && max <= 0) ? 0 : (min < 0 && max > 0) ? Y1 : height;
                    this.axisHeight = Y1 + padding;
                    if (stype != Type.WinLoss && model.axisLineSettings.visible)
                        this.drawAxis();
                }
                else
                    var percent, location;
                for (var i = 0; i < maxPointsLength; i++) {
                    if (!(data[i][model.xName]) && !(data[i][model.yName]) && (data[i][model.yName]) != 0) {
                        x = i;
                        y = data[i];
                    }
                    else if (!(data[i][model.xName])) {
                        x = i;
                        y = data[i][model.yName];
                    }
                    else {
                        x = data[i][model.xName];
                        y = data[i][model.yName];
                    }
                    if (stype == Type.Line || stype == Type.Area) {
                        Y2 = (maxPointsLength != 1) ? height - Math.round(height * ((y - min) / unitY)) : 0;
                        location = { X: (maxPointsLength != 1) ? Math.round(width * ((x - minX) / unitX)) : width / 2, Y: Y2, markerPos: Y2 };
                    }
                    else if (stype == Type.Column || stype == Type.WinLoss) {
                        var colWidth = width / maxPointsLength, calSpace = 0.5, space = (calSpace * 2);
                        colWidth -= (space);
                        X1 = (i * (colWidth + space)) + (space / 2);
                        if (stype == Type.WinLoss) {
                            var winLossFactor = 0.5, drawHeightFactor = 40;
                            Y2 = (y > 0) ? height / 4 : (y < 0) ? (height * winLossFactor) : (height * winLossFactor) - (height / drawHeightFactor);
                            location = { X: X1, Y: Y2, height: (y != 0) ? (height / 4) : height / 20, width: colWidth };
                        }
                        else {
                            var z = ((height / unitY) * (y - min));
                            var z1 = (y == min && y > 0) ? (maxPointsLength != 1 && unitY != 1) ? (height / unitY) * (min / 2) : (height / unitY) :
                                (y == max && y < 0 && maxPointsLength != 1 && unitY != 1) ? (height / unitY) * (-max / 2) : z;
                            Y2 = Math.abs(height - z1);
                            location = { X: X1, Y: (Y2 > Y1) ? Y1 : Y2, height: Math.abs(Y2 - Y1), width: colWidth, markerPos: (Y2 > Y1) ? (Y1 + Math.abs(Y2 - Y1)) : Y2 };
                        }
                    }
                    else if (stype == Type.Pie) {
                        percent = (Math.abs(y) / sumofValues) * 100;
                        location = {
                            Percent: percent, Degree: ((Math.abs(y) / sumofValues) * 360)
                        };
                    }
                    if (stype != Type.Pie) {
                        location.X += padding;
                        location.Y += padding;
                    }
                    if (stype != Type.WinLoss)
                        location.markerPos += padding;
                    location['Xval'] = x;
                    location['Yval'] = y;
                    visiblePoints.push({ location: location });
                }
                this.visiblePoints = visiblePoints;
            };
            Sparkline.prototype.seriesRender = function () {
                var model = this.model, visiblePoints = this.visiblePoints, points_length = visiblePoints.length, eventArgs, seriesType = model.type;
                eventArgs = {
                    data: {
                        "minX": this.minX,
                        "minY": this.min,
                        "maxX": this.maxX,
                        "maxY": this.max,
                        "xName": model.xName,
                        "yName": model.yName,
                        "pointsCount": points_length,
                        "seriesType": seriesType,
                        "visiblePoints": this.visiblePoints
                    }
                };
                if (this.model.seriesRendering != null)
                    this._trigger("seriesRendering", eventArgs);
                if (seriesType == Type.Line) {
                    this.drawLineSeries(visiblePoints);
                }
                else if (seriesType == Type.Area) {
                    this.drawAreaSeries(visiblePoints);
                }
                else if (seriesType == Type.Column) {
                    this.drawColumnSeries(visiblePoints);
                }
                else if (seriesType == Type.WinLoss) {
                    this.drawWinlossSeries(visiblePoints);
                }
                else if (seriesType == Type.Pie) {
                    this.drawPieSeries();
                }
                if (model.markerSettings.visible && (seriesType != Type.WinLoss) && (seriesType != Type.Pie))
                    this.drawMarker(visiblePoints);
                if ((model.rangeBandSettings.startRange != null) && (model.rangeBandSettings.endRange != null) && (seriesType != Type.WinLoss) && (seriesType != Type.Pie))
                    this.drawRangeBand();
            };
            Sparkline.prototype.drawPieSeries = function () {
                var model = this.model, values = this.visiblePoints;
                model.padding = (model.padding == this.defaults.padding) ? 2 : model.padding;
                var len = values.length, height = parseInt(model.size.height) - (model.padding * 2), width = parseInt(model.size.width) - (model.padding * 2), area = (height <= width) ? height / 2 : width / 2, stRad, edRad, centerPos = { X: width / 2, Y: height / 2 }, temp, pathArc, pathOptions, colors = model.palette, deg = 0, stroke = model.border.color, opacity = model.opacity, strokeWidth = model.border.width, gEle;
                values['centerPos'] = centerPos;
                values['radius'] = area;
                for (var i = 0, stDeg = 90, edDeg, flag; i < values.length; i++) {
                    stDeg += deg;
                    deg = values[i]['location']['Degree'];
                    edDeg = stDeg + deg;
                    stRad = (stDeg - 90) * Math.PI / 180.0;
                    edRad = (edDeg - 90) * Math.PI / 180.0;
                    values[i]['stAng'] = stRad;
                    values[i]['endAng'] = edRad;
                    flag = (deg < 180) ? "0" : "1";
                    temp = values[i]['coordinates'] = { sX: centerPos.X + (area * Math.cos(stRad)), sY: centerPos.Y + (area * Math.sin(stRad)), eX: centerPos.X + (area * Math.cos(edRad)), eY: centerPos.Y + (area * Math.sin(edRad)) };
                    pathArc = "M " + centerPos.X + " " + centerPos.Y + " L " + temp.eX + " " + temp.eY + " A " + area + " " + area + " 0 " + flag + ",0 " + temp.sX + " " + temp.sY + " Z";
                    pathOptions = {
                        'id': this.container.id + "_pieBase" + i,
                        'fill': colors[i % colors.length],
                        'stroke': stroke,
                        'opacity': opacity,
                        'stroke-width': strokeWidth,
                        'd': pathArc,
                        'start': edRad,
                        'end': stRad,
                        'x': centerPos.X,
                        'y': centerPos.Y,
                        'counterClockWise': flag,
                        'radius': area
                    };
                    if (model.enableCanvasRendering)
                        this.canvasDrawPath(pathOptions);
                    else {
                        gEle = this.createGroup({ "id": "sparkpieSeries" });
                        this.setStyles({ "clip-path": "url(#" + this.container.id + "_sparklineRect)" }, gEle);
                        this.container.appendChild(gEle);
                        this.drawPath(pathOptions, gEle);
                    }
                }
            };
            Sparkline.prototype.drawRangeBand = function () {
                var model = this.model, height = (parseInt(model.size.height) - model.padding * 2), width = (parseInt(model.size.width) - model.padding * 2), stValue = model.rangeBandSettings.startRange, edValue = model.rangeBandSettings.endRange, stHeight = Number(height - ((height / this.unitY) * (stValue - this.min))) + model.padding, edHeight = Number(height - ((height / this.unitY) * (edValue - this.min))) + model.padding, options;
                edHeight = edHeight > Number(height + model.padding) ? Number(height + model.padding) : edHeight < (0 + model.padding) ? (0 + model.padding) : edHeight;
                stHeight = stHeight > Number(height + model.padding) ? Number(height + model.padding) : stHeight < (0 + model.padding) ? (0 + model.padding) : stHeight;
                var path = 'M ' + model.padding + " " + stHeight + " L " + (width + Number(model.padding)) + " " + stHeight + " L " + (width + Number(model.padding)) + " " + edHeight + " L " + model.padding + " " + edHeight + " Z";
                options = {
                    'id': this.container.id + "_rangeBand",
                    'fill': model.rangeBandSettings.color,
                    'opacity': model.rangeBandSettings.opacity,
                    'stroke': "transparent",
                    'stroke-width': model.border.width,
                    'd': path,
                };
                if (model.enableCanvasRendering)
                    this.canvasDrawPath(options);
                else
                    this.drawPath(options);
            };
            Sparkline.prototype.drawAxis = function () {
                var model = this.model, height = this.axisHeight, strclr = model.axisLineSettings.color, seriesType = model.type;
                if ((seriesType != Type.WinLoss) && (seriesType != Type.Pie)) {
                    if (!model.axisLineSettings.visible)
                        strclr = 'transparent';
                    var xAxis = {
                        'id': this.container.id + "_Sparkline_XAxis",
                        'x1': 0 + model.padding,
                        'y1': height,
                        'x2': parseInt(model.size.width) - model.padding,
                        'y2': height,
                        'stroke': strclr,
                        'stroke-dasharray': model.axisLineSettings.dashArray,
                        'stroke-width': model.axisLineSettings.width,
                    };
                    if (model.enableCanvasRendering)
                        this.canvasDrawLine(xAxis);
                    else
                        this.drawLine(xAxis);
                }
            };
            Sparkline.prototype.drawColumnSeries = function (points) {
                var rectOptions, temp, model = this.model, mod = [], len = points.length, locations = ejSparkline.compareExtend({}, mod, points), strwd = model.border.width, lowPos, opacity = model.opacity, highPos, fill = model.fill, stroke = model.border.color, highPointColor = model.highPointColor, lowPointColor = model.lowPointColor, startPointColor = model.startPointColor, endPointColor = model.endPointColor, negativePointColor = model.negativePointColor, gEle;
                if (highPointColor || lowPointColor) {
                    var pointsYPos = locations.map(function (a) { return a['location']['markerPos']; });
                    highPos = Math.min.apply(null, pointsYPos);
                    lowPos = Math.max.apply(null, pointsYPos);
                }
                if (model.enableCanvasRendering == false) {
                    gEle = this.createGroup({ "id": this.container.id + "sparkcolumnSeries" });
                    this.setStyles({ "clip-path": "url(#" + this.container.id + "_sparklineRect)" }, gEle);
                    this.container.appendChild(gEle);
                }
                for (var i = 0; i < len; i++) {
                    temp = points[i].location;
                    rectOptions = {
                        'id': this.container.id + "_column_series_" + i,
                        'x': temp.X,
                        'y': temp.Y,
                        'height': temp.height,
                        'width': temp.width,
                        'fill': fill,
                        'stroke': stroke,
                        'opacity': opacity,
                        "stroke-width": strwd,
                    };
                    if (temp.markerPos == highPos && highPointColor) {
                        rectOptions.fill = highPointColor;
                        this.highPointIndex = i;
                    }
                    else if (temp.markerPos == lowPos && lowPointColor) {
                        rectOptions.fill = lowPointColor;
                        this.lowPointIndex = i;
                    }
                    else if (i == 0 && startPointColor) {
                        rectOptions.fill = startPointColor;
                        this.startPointIndex = i;
                    }
                    else if ((i == (len - 1)) && endPointColor) {
                        rectOptions.fill = endPointColor;
                        this.endPointIndex = i;
                    }
                    else if (temp.markerPos >= this.axisHeight && negativePointColor) {
                        rectOptions.fill = negativePointColor;
                        this.negativePointIndexes.push(i);
                    }
                    if (model.enableCanvasRendering)
                        this.canvasDrawRectangle(rectOptions);
                    else {
                        this.drawRect(rectOptions, gEle);
                    }
                    temp.X += temp.width / 2;
                }
            };
            Sparkline.prototype.drawWinlossSeries = function (points) {
                var rectOptions, temp, model = this.model, strwd = model.border.width, padding = model.padding, stroke = model.border.color, opacity = model.opacity, tieColor = "#EE82EE", len = points.length, height = parseInt(model.size.height) - (padding * 2), gEle;
                if (model.enableCanvasRendering == false) {
                    gEle = this.createGroup({ "id": this.container.id + "sparkwinlossSeries" });
                    this.setStyles({ "clip-path": "url(#" + this.container.id + "_sparklineRect)" }, gEle);
                    this.container.appendChild(gEle);
                }
                for (var i = 0; i < len; i++) {
                    temp = points[i].location;
                    rectOptions = {
                        'id': this.container.id + "_winloss_series_" + i,
                        'x': temp.X,
                        'y': temp.Y,
                        'height': temp.height,
                        'width': temp.width,
                        'fill': (temp.Y < (height / 2 + padding)) ? (temp.Y > (height / 4 + padding)) ? tieColor : model.fill : model.negativePointColor ? model.negativePointColor : "#FF0000",
                        'stroke': stroke,
                        'opacity': opacity,
                        "stroke-width": strwd
                    };
                    if (model.enableCanvasRendering)
                        this.canvasDrawRectangle(rectOptions);
                    else {
                        this.drawRect(rectOptions, gEle);
                    }
                }
            };
            Sparkline.prototype.drawAreaSeries = function (points) {
                var linepath = "", totHeight = this.axisHeight, model = this.model, options, gEle;
                for (var i = 0, len = points.length; i < len; i++) {
                    if (i == 0) {
                        linepath = "M " + points[0].location.X + " " + totHeight + " ";
                    }
                    linepath += "L " + points[i].location.X + " " + points[i].location.Y + " ";
                    if (i == len - 1) {
                        linepath += "L " + points[i].location.X + " " + totHeight + " Z";
                    }
                }
                options = {
                    "id": this.container.id + "_area_series_fill",
                    "fill": model.fill,
                    "stroke": model.stroke ? model.stroke : model.fill,
                    'fill-opacity': model.opacity,
                    "stroke-width": model.width,
                    "d": linepath
                };
                if (model.enableCanvasRendering)
                    this.canvasDrawPath(options);
                else {
                    gEle = this.createGroup({ "id": "sparkAreaSeries" });
                    this.container.appendChild(gEle);
                    this.drawPath(options, gEle);
                    this.setStyles({ "clip-path": "url(#" + this.container.id + "_sparklineRect)" }, gEle);
                }
            };
            Sparkline.prototype.drawLineSeries = function (points) {
                var linepath = '', model = this.model, gEle;
                for (var i = 0, len = points.length; i < len; i++) {
                    if (i == 0)
                        linepath = "M " + points[0].location.X + " " + points[i].location.Y + " ";
                    linepath += "L " + points[i].location.X + " " + points[i].location.Y + " ";
                }
                var line_options = {
                    'id': this.container.id + "_Line_series",
                    'fill': 'transparent',
                    'stroke': model.stroke ? model.stroke : model.fill,
                    'opacity': model.opacity,
                    'stroke-width': model.width,
                    'd': linepath
                };
                if (model.enableCanvasRendering)
                    this.canvasDrawPath(line_options);
                else {
                    gEle = this.createGroup({ "id": "sparklineSeries" });
                    this.container.appendChild(gEle);
                    this.drawPath(line_options, gEle);
                    this.setStyles({ "clip-path": "url(#" + this.container.id + "_sparklineRect)" }, gEle);
                }
            };
            Sparkline.prototype.drawMarker = function (points) {
                var length = points.length, marker_options, marker = this.model.markerSettings, mod = [], model = this.model, locations = ejSparkline.compareExtend({}, mod, points), fill = marker.fill ? marker.fill : model.fill, stroke = marker.border.color, strwid = marker.width, opacity = marker.opacity, brdwid = marker.border.width, temp, lowPos, highPos, highPointColor = model.highPointColor, lowPointColor = model.lowPointColor, startPointColor = model.startPointColor, endPointColor = model.endPointColor, negativePointColor = model.negativePointColor, gEle;
                if (model.enableCanvasRendering == false) {
                    gEle = this.createGroup({ "id": this.container.id + "sparkmarkers" });
                    this.setStyles({ "clip-path": "url(#" + this.container.id + "_sparklineRect)" }, gEle);
                    this.container.appendChild(gEle);
                }
                if (marker.visible == false || (model.type == Type.Pie || model.type == Type.WinLoss)) {
                    strwid = 0;
                    brdwid = 0;
                }
                if (highPointColor || lowPointColor) {
                    var pointsYPos = locations.map(function (a) { return a['location']['markerPos']; });
                    highPos = Math.min.apply(null, pointsYPos);
                    lowPos = Math.max.apply(null, pointsYPos);
                }
                for (var i = 0, wid; i < length; i++) {
                    temp = points[i].location;
                    wid = (temp.width != undefined) ? (temp.width / 2) : 0;
                    marker_options = {
                        'id': this.container.id + "_marker_" + i,
                        'cx': temp.X,
                        'cy': temp.markerPos,
                        'r': strwid,
                        'fill': fill,
                        'stroke': stroke,
                        'opacity': opacity,
                        'stroke-width': brdwid
                    };
                    if (temp.markerPos == highPos && highPointColor) {
                        marker_options.fill = highPointColor;
                        this.highPointIndex = i;
                    }
                    else if (temp.markerPos == lowPos && lowPointColor) {
                        marker_options.fill = lowPointColor;
                        this.lowPointIndex = i;
                    }
                    else if (i == 0 && startPointColor) {
                        marker_options.fill = startPointColor;
                        this.startPointIndex = i;
                    }
                    else if ((i == (length - 1)) && endPointColor) {
                        marker_options.fill = endPointColor;
                        this.endPointIndex = i;
                    }
                    else if (temp.markerPos > this.axisHeight && negativePointColor) {
                        marker_options.fill = negativePointColor;
                        this.negativePointIndexes.push(i);
                    }
                    if (this.model.enableCanvasRendering)
                        this.canvasDrawCircle(marker_options);
                    else
                        this.drawCircle(marker_options, gEle);
                }
            };
            Sparkline.prototype.drawLine = function (Options) {
                var svgshape = document.getElementById(Options['id']);
                if (!svgshape)
                    svgshape = document.createElementNS(this.svgLink, "line");
                this.setAttributes(Options, svgshape);
                this.container.appendChild(svgshape);
            };
            Sparkline.prototype.drawCircle = function (Options, element) {
                element = (!!element) ? element : this.container;
                var svgshape = document.getElementById(Options['id']);
                if (!svgshape)
                    svgshape = document.createElementNS(this.svgLink, "circle");
                this.setAttributes(Options, svgshape);
                element.appendChild(svgshape);
            };
            Sparkline.prototype.drawPolyLine = function (Options) {
                var svgshape = document.getElementById(Options['id']);
                if (!svgshape)
                    svgshape = document.createElementNS(this.svgLink, "polyline");
                this.setAttributes(Options, svgshape);
                this.container.appendChild(svgshape);
            };
            Sparkline.prototype.drawPath = function (Options, element) {
                element = (!!element) ? element : this.container;
                var svgshape = document.getElementById(Options['id']);
                if (!svgshape)
                    svgshape = document.createElementNS(this.svgLink, "path");
                this.setAttributes(Options, svgshape);
                element.appendChild(svgshape);
            };
            Sparkline.prototype.drawRect = function (Options, element) {
                element = (!!element) ? element : this.container;
                var svgshape = document.getElementById(Options['id']);
                if (!svgshape)
                    svgshape = document.createElementNS(this.svgLink, "rect");
                this.setAttributes(Options, svgshape);
                element.appendChild(svgshape);
            };
            Sparkline.prototype.createGroup = function (options) {
                var group = document.createElementNS(this.svgLink, "g");
                this.setAttributes(options, group);
                return group;
            };
            Sparkline.prototype.createText = function (options, label) {
                var text = document.createElementNS(this.svgLink, "text");
                this.setAttributes(options, text);
                if (label)
                    text.textContent = label;
                return text;
            };
            Sparkline.prototype.canvasDrawLine = function (options, canvasContext) {
                var context2d = canvasContext ? canvasContext : this.ctx;
                context2d.save();
                context2d.beginPath();
                context2d.lineWidth = options["stroke-width"];
                context2d.strokeStyle = options["stroke"];
                context2d.moveTo(options["x1"], options["y1"]);
                context2d.lineTo(options["x2"], options["y2"]);
                context2d.stroke();
                context2d.restore();
                this.dataURL = this.container.toDataURL();
            };
            Sparkline.prototype.canvasDrawRectangle = function (options, canvasContext) {
                var context2d = canvasContext ? canvasContext : this.ctx, canvasCtx = canvasContext ? canvasContext : this.ctx;
                context2d.save();
                context2d.beginPath();
                context2d.globalAlpha = options["opacity"];
                context2d.lineWidth = options["stroke-width"];
                var dashArray = options["stroke-dasharray"] ? options["stroke-dasharray"].split(",") : false;
                if (dashArray)
                    this.ctx.setLineDash(dashArray);
                context2d.strokeStyle = options["stroke"];
                context2d.rect(options["x"], options["y"], options["width"], options["height"]);
                if (options["fill"] == "none")
                    options["fill"] = "transparent";
                context2d.fillStyle = options["fill"];
                context2d.fillRect(options["x"], options["y"], options["width"], options["height"]);
                context2d.stroke();
                context2d.restore();
                context2d = canvasCtx;
                this.dataURL = this.container.toDataURL();
            };
            Sparkline.prototype.canvasDrawPath = function (options, canvasContext) {
                var path = options["d"];
                var dataSplit = path.split(" ");
                var borderWidth = options["stroke-width"];
                var context2d = canvasContext ? canvasContext : this.ctx, canvasCtx = canvasContext ? canvasContext : this.ctx;
                context2d.save();
                context2d.beginPath();
                context2d.globalAlpha = options["opacity"] ? options["opacity"] : options["fill-opacity"];
                var flag = true;
                context2d.lineWidth = borderWidth;
                var dashArray = options["stroke-dasharray"] ? options["stroke-dasharray"].split(",") : false;
                if (dashArray)
                    context2d.setLineDash(dashArray);
                context2d.strokeStyle = options["stroke"];
                for (var i = 0; i < dataSplit.length; i = i + 3) {
                    var x1 = parseFloat(dataSplit[i + 1]);
                    var y1 = parseFloat(dataSplit[i + 2]);
                    switch (dataSplit[i]) {
                        case "M":
                            if (!options["innerR"] && !options["cx"])
                                context2d.moveTo(x1, y1);
                            break;
                        case "L":
                            if (!options["innerR"])
                                context2d.lineTo(x1, y1);
                            break;
                        case "C":
                            context2d.bezierCurveTo(x1, y1, parseFloat(dataSplit[i + 3]), parseFloat(dataSplit[i + 4]), parseFloat(dataSplit[i + 5]), parseFloat(dataSplit[i + 6]));
                            i = i + 4;
                            break;
                        case "A":
                            if (!options["innerR"]) {
                                if (options["cx"]) {
                                    context2d.arc(options["cx"], options["cy"], options["radius"], 0, 2 * Math.PI, options["counterClockWise"]);
                                }
                                else {
                                    context2d.moveTo(options["x"], options["y"]);
                                    context2d.arc(options["x"], options["y"], options["radius"], options["start"], options["end"], options["counterClockWise"]);
                                    context2d.lineTo(options["x"], options["y"]);
                                }
                            }
                            else if (flag) {
                                context2d.arc(options["x"], options["y"], options["radius"], options["start"], options["end"], options["counterClockWise"]);
                                context2d.arc(options["x"], options["y"], options["innerR"], options["end"], options["start"], !options["counterClockWise"]);
                                flag = false;
                            }
                            i = i + 5;
                            break;
                        case "Z":
                            context2d.closePath();
                            break;
                    }
                }
                if (options["fill"] != "none" && options["fill"] != undefined) {
                    context2d.fillStyle = options["fill"];
                    context2d.fill();
                }
                if (borderWidth > 0)
                    context2d.stroke();
                context2d.restore();
                context2d = canvasCtx;
                this.dataURL = this.container.toDataURL();
            };
            Sparkline.prototype.canvasDrawCircle = function (options, canvasContext) {
                var context2d = canvasContext ? canvasContext : this.ctx, canvasCtx = canvasContext ? canvasContext : this.ctx, dashArray;
                context2d.save();
                context2d.beginPath();
                context2d.arc(options["cx"], options["cy"], options["r"], 0, 2 * Math.PI);
                context2d.fillStyle = options["fill"];
                context2d.globalAlpha = options["opacity"];
                context2d.fill();
                context2d.lineWidth = options["stroke-width"];
                dashArray = options["stroke-dasharray"] ? options["stroke-dasharray"].split(",") : false;
                if (dashArray)
                    context2d.setLineDash(dashArray);
                context2d.strokeStyle = options["stroke"];
                context2d.stroke();
                context2d.restore();
                context2d = canvasCtx;
                this.dataURL = this.container.toDataURL();
            };
            Sparkline.prototype.canvasDrawPolyline = function (options, canvasContext) {
                var context2d = canvasContext ? canvasContext : this.ctx;
                context2d.save();
                context2d.beginPath();
                var points = options["points"].split(" ");
                for (var i = 0; i < points.length - 1; i++) {
                    var point = points[i].split(",");
                    var x = point[0];
                    var y = point[1];
                    if (i == 0)
                        context2d.moveTo(x, y);
                    else
                        context2d.lineTo(x, y);
                }
                context2d.lineWidth = options["stroke-width"];
                context2d.strokeStyle = options["stroke"];
                context2d.stroke();
                context2d.restore();
                this.dataURL = this.container.toDataURL();
            };
            Sparkline.prototype.canvasDrawText = function (options, label, canvasContext) {
                var font = options['font'];
                var anchor = options["text-anchor"];
                var opacity = options["opacity"] !== undefined ? options["opacity"] : 1;
                if (anchor == "middle")
                    anchor = "center";
                var context2d = canvasContext ? canvasContext : this.ctx;
                context2d.save();
                context2d.fillStyle = options["fill"];
                context2d.font = font;
                context2d.textAlign = anchor;
                context2d.globalAlpha = opacity;
                if (options["baseline"])
                    context2d.textBaseline = options["baseline"];
                var txtlngth = 0;
                if (options["labelRotation"] == 90 && options["id"].indexOf("XLabel") != -1)
                    txtlngth = context2d.measureText(label).width;
                context2d.translate(options["x"] + (txtlngth / 2), options["y"]);
                context2d.rotate(options["labelRotation"] * Math.PI / 180);
                context2d.fillText(label, 0, 0);
                context2d.restore();
                this.dataURL = this.container.toDataURL();
            };
            Sparkline.prototype.parseTemplate = function (clonenode, point) {
                var str;
                str = clonenode.innerHTML;
                var properties = Object.values(point), tempValues, format;
                tempValues = properties[0];
                for (var _i = 0, _a = Object.entries(tempValues); _i < _a.length; _i++) {
                    var _b = _a[_i], key = _b[0], value = _b[1];
                    format = '#point.' + key + '#';
                    if (str.search(format) != -1) {
                        str = str.replace(format, value);
                    }
                }
                return str;
            };
            Sparkline.prototype.measureText = function (text, font) {
                var element = document.getElementById("measureTex"), textObj;
                if (!element || element.clientHeight == 0) {
                    textObj = document.createElement('text');
                    textObj.setAttribute('id', 'measureTex');
                    document.body.appendChild(textObj);
                }
                else {
                    textObj = element;
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
                textObj.style.top = -100 + "px";
                textObj.style.left = 0 + 'px';
                textObj.style.visibility = 'hidden';
                textObj.style.whiteSpace = 'nowrap';
                var bounds = { width: textObj.offsetWidth, height: textObj.offsetHeight };
                return bounds;
            };
            return Sparkline;
        }(ej.WidgetBase));
        ejSparkline.Sparkline = Sparkline;
        ej.widget("ejSparkline", "ej.Sparkline", new Sparkline());
    })(jQuery);
    ejSparkline.deepExtend = function (out) {
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];
            if (!obj)
                continue;
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object')
                        out[key] = ejSparkline.deepExtend(out[key], obj[key]);
                    else
                        out[key] = obj[key];
                }
            }
        }
        return out;
    };
    ejSparkline.compareExtend = function (temp, src, def) {
        if (typeof def === 'object' && def !== null) {
            var defProp = Object.keys(def), len = defProp.length, currPro;
            for (var i = 0; i < len; i++) {
                currPro = defProp[i];
                if (src.hasOwnProperty(currPro) && src[currPro] != null) {
                    if (Array.isArray(src[currPro]) || typeof src[currPro] === 'object' && src[currPro] !== null) {
                        ejSparkline.compareExtend({}, src[currPro], def[currPro]);
                    }
                }
                else {
                    src[currPro] = def[currPro];
                }
            }
        }
        return src;
    };
})(ejSparkline || (ejSparkline = {}));
