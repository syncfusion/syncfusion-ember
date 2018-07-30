/**
* @fileOverview Plugin to style the Html slider elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    // ejSlider is the plugin name 
    // "ej.slider" is "namespace.className" will hold functions and properties

    ej.widget("ejmSlider", "ej.mobile.Slider", {
        _setFirst: true,
        _rootCSS: "e-m-slider",

        defaults: {
            theme: "auto",
            orientation: "horizontal",
            maxValue: 100,
            minValue: 0,
            enableRange: false,
            values: [20, 80],
            enableAnimation: false,
            animationSpeed: 400,
            readOnly: false,
            incrementStep: 1,
            value: 0,
            enabled: true,
            enablePersistence: false,
            touchStart: null,
            touchEnd: null,
            change: null,
            slide: null,
            load: null,
            windows: {
                "renderDefault": false
            },
            ios7: {
                "thumbStyle": "normal"
            },
            renderMode: "auto"
        },
        dataTypes: {
            theme: "enum",
            orientation: "enum",
            enableRange: "boolean",
            thumbStyle: "enum",
            enableAnimation: "boolean",
            enabled: "boolean",
            renderMode: "enum",
            values: "array",
            enablePersistence: "boolean"
        },
        observables: ["value"],
        observableArray: ["values"],
        value: ej.util.valueFunction("value"),
        values: ej.util.valueFunction("values"),
        // constructor function
        _init: function () {
            if (!App.activePage)
                App.createAppView();
            this._cloneElement = this.element.clone();
            this._load();
            ej.setRenderMode(this);
            ej.setTheme(this);
            this._renderControl();
            this._initObjects();
            if (!this.model.readOnly)
                this._wireEvents(false);
        },
        _renderControl: function () {
            var obj = this.model;
            if (!this.model.enabled)
                this.element.addClass("e-m-state-disabled");
            if (this.model.renderMode == "windows" && this.model.windows.renderDefault)
                this.model.theme = "default";
            this._sliderHandle = ej.buildTag("div .e-m-slider-outer");
            this._selectedRegion = ej.buildTag("div .e-m-slider-inner").appendTo(this._sliderHandle);
            if (this.model.renderMode == "ios7" && this.model.ios7.thumbStyle == "small")
                this._dragHandle = ej.buildTag("div .e-m-slider-handleout e-m-small-handle e-m-slider-left ").appendTo(this._sliderHandle);
            else
                this._dragHandle = ej.buildTag("div .e-m-slider-handleout e-m-slider-left ").appendTo(this._sliderHandle);
            var handleIn = ej.buildTag("div .e-m-slider-handlein").appendTo(this._dragHandle);
            if (obj.enableRange) {
                if (this.model.renderMode == "ios7" && this.model.ios7.thumbStyle == "small")
                    var handleRange = ej.buildTag("div .e-m-slider-handleout e-m-small-handle e-m-slider-right");
                else
                    var handleRange = ej.buildTag("div .e-m-slider-handleout e-m-slider-right");
                var rangeHandleIn = ej.buildTag("div .e-m-slider-handlein").appendTo(handleRange);
                handleRange.appendTo(this._sliderHandle);
            }
            this.element.addClass("e-m-" + obj.orientation + " e-m-" + obj.theme).addClass("e-m-slider e-m-" + obj.renderMode).append(this._sliderHandle);
            this.element.append(ej.buildTag("input ", {}, {}, { "type": "hidden", "name": "sliderValue" }));
            this._dragHandle = this.element.find(".e-m-slider-handleout");
            this._inputValue = this.element.find("input");
            this._wrapperDiv = this.element;
            this._currentValue = this.value();
            this["_" + obj.orientation + "RenderMode"]();
        },
        _horizontalRenderMode: function () {
            this._setOrientationProperties("width", "left");
        },
        _verticalRenderMode: function () {
            this._setOrientationProperties("height", "bottom");
        },
        _setOrientationProperties: function (dimensionProp, posProp) {
            var obj = this.model;
            if (obj.enableRange) {
                if (this.values()[0] <= this.values()[1]) {
                    this.values()[0] = (this.values()[0] < obj.minValue && this.values()[0] <= obj.maxValue) ? obj.minValue : this.values()[0];
                    this.values()[1] = (this.values()[1] >= obj.minValue && this.values()[1] > obj.maxValue) ? obj.maxValue : this.values()[1];
                }
                else
                    this.values()[1] = this.values()[0];
                this._selectedRegion.css(posProp, parseFloat(((this.values()[0] - obj.minValue) / (obj.maxValue - obj.minValue)) * 100) + "%").css(dimensionProp,
                    parseFloat(((this.values()[1] - obj.minValue) / (obj.maxValue - obj.minValue)) * 100) - parseFloat(((this.values()[0] - obj.minValue) / (obj.maxValue - obj.minValue)) * 100) + "%");
                $(this._dragHandle[0]).css(posProp, parseFloat(((this.values()[0] - obj.minValue) / (obj.maxValue - obj.minValue)) * 100) + "%");
                $(this._dragHandle[1]).css(posProp, parseFloat(((this.values()[1] - obj.minValue) / (obj.maxValue - obj.minValue)) * 100) + "%");
            }
            else {
                this.value((this.value() < obj.minValue) ? obj.minValue : this.value());
                this.value((this.value() > obj.maxValue) ? obj.maxValue : this.value());
                this._selectedRegion.css(dimensionProp, parseFloat(((this.value() - obj.minValue) / (obj.maxValue - obj.minValue)) * 100) + "%");
                this._dragHandle.css(posProp, parseFloat(((this.value() - obj.minValue) / (obj.maxValue - obj.minValue)) * 100) + "%");
            }
        },
        _initObjects: function () {
            this._createDelegates();
        },
        _createDelegates: function () {
            this._mouseDownHandler = $.proxy(this._onMouseDownHandler, this);
            this._mouseMoveHandler = $.proxy(this._onMouseMove, this);
            this._mouseUpHandler = $.proxy(this._onMouseUp, this);
        },
        _onMouseDownHandler: function (evt) {
            ej.blockDefaultActions(evt);
            if (ej.isTouchDevice())
                evt = evt.touches ? evt.touches[0] : evt;
            if (!this.model.enabled)
                return false;
            jQuery.fx.off = false;
            this.sliderClick = evt;
            if (!this.model.enableRange)
                this._dragHandle.addClass("e-m-state-active");
            ej.listenEvents([document, document], [ej.moveEvent(), ej.endEvent()], [this._mouseMoveHandler, this._mouseUpHandler], false);
            var index;
            var position = { x: evt.pageX, y: evt.pageY };
            var normalValue = this._getNormalValue(position);
            this._currentValue = normalValue;
            var self = this;
            var distance = this.model.maxValue - this.model.minValue + 1;
            $(this._dragHandle).each(function (curIndex) {
                var curDistance = Math.abs(normalValue - self._getNewValues(curIndex));
                if (distance >= curDistance) {
                    if (self._getNewValues(0) != self._getNewValues(1)) {
                        distance = curDistance;
                        self._closestHandle = $(this);
                        index = curIndex;
                    }
                }
            });
            $(this.model.enableRange ? this._closestHandle : this._dragHandle).removeClass("e-m-state-hover").addClass("e-m-state-active");
            this._start(evt, index);
            if (this.model.enableRange) {
                this._setZindex();
                if (self._getNewValues(0) == self._getNewValues(1)) {
                    self._closestHandle = $(this);
                    index = this._handlingIndex;
                }
                this._setRangeValueProperties(evt, index);
            }
        },
        _setZindex: function () {
            this._dragHandle.css("z-index", 0);
            this._closestHandle.css("z-index", 5);
        },
        _setRangeValueProperties: function (evt, index) {
            var tempValues = [];
            var otherValues = [];
            var highestValue, lowestValue;
            var tempValue = this.values()[index];
            this._closestHandle = $(this._dragHandle[index]);
            this._handlingIndex = index;
            for (var curValue = 0; curValue < this.values().length; curValue++) {
                if (curValue != index)
                    otherValues.push(this.values()[curValue]);
                tempValues.push(this.values()[curValue]);
            }
            for (var curValue = 0; curValue < otherValues.length; curValue++) {
                if (tempValue >= otherValues[curValue]) {
                    this._closestLeftValue = otherValues[curValue];
                    break;
                }
                else if (tempValue <= otherValues[curValue]) {
                    this._closestRightValue = otherValues[curValue];
                    break;
                }
            }
            lowestValue = tempValues[0];
            highestValue = tempValues[tempValues.length - 1];
            if (lowestValue != highestValue) {
                if (tempValue <= lowestValue)
                    this._closestLeftValue = this.model.minValue;
                else if (tempValue >= highestValue)
                    this._closestRightValue = this.model.maxValue;
            }
            else if (lowestValue == highestValue) {
                if (this._closestHandle.hasClass("e-m-slider-left"))
                    this._closestLeftValue = this.model.minValue;
                else if (this._closestHandle.hasClass("e-m-slider-right"))
                    this._closestRightValue = this.model.maxValue;
            }
            if (evt.preventDefault)
                evt.preventDefault();
            return true;
        },
        _onMouseMove: function (evt, bAnimate) {
            ej.blockDefaultActions(evt);
            if (ej.isTouchDevice())
                evt = evt.touches ? evt.touches[0] : evt;
            if (!this.model.enabled)
                return false;
            jQuery.fx.off = true;
            this.element.css("cursor", "pointer");
            var position = { x: evt.pageX, y: evt.pageY };
            var normalValue = this._getNormalValue(position);
            this._currentValue = normalValue;
            if (this.model.enableRange)
                this._slide(evt, normalValue, this._handlingIndex);
            else
                this._slide(evt, normalValue);
            $(this.model.enableRange ? this._closestHandle : this._dragHandle).addClass("e-m-state-active");
            if (evt.preventDefault)
                evt.preventDefault();
        },
        _onMouseUp: function (evt) {
            ej.blockDefaultActions(evt);
            if (ej.isTouchDevice())
                evt = evt.changedTouches ? evt.changedTouches[0] : evt;
            if (!this.model.enabled)
                return false;
            jQuery.fx.off = false;
            ej.listenEvents([document, document], [ej.moveEvent(), ej.endEvent()], [this._mouseMoveHandler, this._mouseUpHandler], true);
            if (this._mouseMoveStarted) {
                this._mouseMoveStarted = false;
                if (evt.target == this.sliderClick.target)
                    $.data(evt.target, this.model.sliderId + '.preventClickEvent', true);
            }
            this.element.css("cursor", "default");
            var position = { x: evt.pageX, y: evt.pageY };
            var normalValue = this._getNormalValue(position);
            if (this.model.enableRange)
                this._slide(evt, normalValue, this._handlingIndex);
            else
                this._slide(evt, normalValue);
            this._stop(evt, this._handlingIndex);
            this._change(evt, this._handlingIndex);
            $(this.model.enableRange ? this._closestHandle : this._dragHandle).removeClass("e-m-state-hover").removeClass("e-m-state-active");
            return false;
        },
        _getNewValues: function (index) {
            if (!this.model.enableRange)
                return this.value();
            else
                return this._trimValue(this.values()[index]);
        },
        _getCurrentValue: function (newValue, index) {
            if (this.model.enableRange) {
                this.values()[index] = this._trimValue(newValue);
                this.value(this.values()[index]);
            }
            else {
                this.value(this._trimValue(newValue));
                this._currentValue = newValue;
            }
            this._refreshValue();
            return this._trimValue(this.value());
        },
        _refreshValue: function () {
            var animateOrCss = this.model.enableAnimation ? "animate" : "css";
            var values;
            if (this.model.enableRange) {
                values = (this.values()[0] + "," + this.values()[1]);
                this._inputValue.val(values);
            }
            else
                this._inputValue.val(this._currentValue);
            correctedPercent = (this._dragHandle.width() / 2) / this._dragHandle.parent().width() * 100;
            if ((this.model.enableRange))
                this._rangeRefreshProperties();
            else {
                var percentValue = (this.model.minValue != this.model.maxValue) ? (this.value() - this.model.minValue) / (this.model.maxValue - this.model.minValue) * 100 : 0;
                var handlePercent = percentValue - ((this._dragHandle.width() / $(this._dragHandle.parent()).width()) * 100);
                if (handlePercent < 0)
                    handlePercent = percentValue;
                if (this.model.orientation == "horizontal")
                    this._rangeRefreshOrientationProperties({ 'width': percentValue + "%" }, { 'left': percentValue + "%" }, this.model.animationSpeed, animateOrCss);
                else
                    this._rangeRefreshOrientationProperties({ 'height': percentValue + "%" }, { 'bottom': percentValue + "%" }, this.model.animationSpeed, animateOrCss);
            }
        },
        _rangeRefreshProperties: function () {
            var left, width, bottom, left;
            var self = this;
            var animateOrCss = this.model.enableAnimation ? "animate" : "css";
            var animateValue = this.model.animationSpeed;
            var maxPercentValue = (this.values()[1] - this.model.minValue) / (this.model.maxValue - this.model.minValue) * 100;
            var minPercentValue = (this.values()[0] - this.model.minValue) / (this.model.maxValue - this.model.minValue) * 100;
            if (this.model.orientation == "horizontal") {
                this._selectedRegion[animateOrCss]({ "left": (minPercentValue) + "%" }, animateValue)
                [animateOrCss]({ "width": (maxPercentValue - minPercentValue) + "%" }, animateValue);
            }
            else {
                this._selectedRegion[animateOrCss]({ "bottom": (minPercentValue) + "%" }, animateValue)
                    [animateOrCss]({ "height": (maxPercentValue - minPercentValue) + "%" }, animateValue);
            }
            this._dragHandle.each(function (index, element) {
                percentValue = (self.values()[index] - self.model.minValue) / (self.model.maxValue - self.model.minValue) * 100;
                handlePercent = percentValue - (($(this).width() / $($(this).parent()).width()) * 100);
                if (handlePercent < 0)
                    handlePercent = percentValue;
                if (self.model.orientation == "horizontal")
                    $(this)[animateOrCss]({ "left": percentValue + "%" }, animateValue);
                else
                    $(this)[animateOrCss]({ "bottom": percentValue + "%" }, animateValue);
                lastPercentValue = percentValue;
            });
        },
        _rangeRefreshOrientationProperties: function (dimObj, posObj, animateValue, animateOrCss) {
            this._selectedRegion[animateOrCss](dimObj, animateValue);
            this._dragHandle[animateOrCss](posObj, animateValue);
        },

        _getNormalValue: function (position) {
            var currentLOB, currentLOBPercent, totalValue, currentValue; //currentLOB = current left or bottom
            if (this.model.orientation == "vertical") {
                currentLOB = position.y - this._sliderHandle.offset().top;
                currentLOBPercent = (currentLOB / this._sliderHandle[0].offsetHeight);
            }
            else {
                currentLOB = position.x - this._sliderHandle.offset().left;
                currentLOBPercent = (currentLOB / this._sliderHandle[0].offsetWidth);
            }

            if (this.model.orientation == "vertical")
                currentLOBPercent = 1 - currentLOBPercent;
            totalValue = this.model.maxValue - this.model.minValue;
            currentValue = this.model.minValue + currentLOBPercent * totalValue;
            return this._trimValue(currentValue);
        },
        _trimValue: function (value) {
            if (!this.model.enableRange) {
                if (value < this.model.minValue)
                    value = this.model.minValue;
                else if (value > this.model.maxValue)
                    value = this.model.maxValue;
            }
            var step = (this.model.incrementStep > 0) ? this.model.incrementStep : 1;
            var stepModValue = (value - this.model.minValue) % step;
            var correctedValue = value - stepModValue;
            if (Math.abs(stepModValue) * 2 >= step)
                correctedValue += (stepModValue > 0) ? step : (-step);
            return parseFloat(correctedValue.toFixed(5));
        },
        _slide: function (evt, newValue, index) {
            if (this.model.enableRange) {
                if (newValue != this._getCurrentValue()) {
                    this.value(newValue);
                    if (newValue < this._closestLeftValue)
                        newValue = this._closestLeftValue;
                    else if (newValue > this._closestRightValue)
                        newValue = this._closestRightValue;
                    if (newValue != this._getNewValues(index)) {
                        var newValues = this._getCurrentValue(newValue, index);
                        newValues[index] = newValue;
                        var data = { value: this.value(), values: this.values() };
                        this.values([this.values()[0], this.values()[1]]);
                        this._triggerSlide(data, newValue, this._getNewValues(index), index);
                    }
                }
            }
            else {

                if (newValue != this.value()) {
                    this._getCurrentValue(newValue);
                    var data = { value: this.value(), values: this.values() };
                    this._triggerSlide(data, newValue, this.value());
                }
            }

        },
        _triggerSlide: function (data, newValue, prevValue, index) {
            if (this.model.slide)
                this._trigger("slide", data);
            this._getCurrentValue(newValue, index);
            this.prevValue = this._getNewValues(index);
        },
        //client side events
        _load: function () {
            var data = (this.model.enableRange) ? { values: this._getNewValues() } : { value: this.value() };
            if (this.model.load)
                this._trigger("load", data);
        },

        _start: function (evt, index) {
            var data = { value: this.value(), values: this.values() };
            if (this.model.enableRange) {
                data._getCurrentValue = this._getNewValues(index);
                data.values = this._getNewValues();
            }
            else {
                data._getCurrentValue = this.value();
                data.value = this.value();

            }
            if (this.model.touchStart)
                this._trigger("touchStart", data);
        },
        _stop: function (evt, index) {
            var data = { value: this.value(), values: this.values() };
            if (this.model.enableRange) {
                data._getCurrentValue = this._getNewValues(index);
                data.values = this._getNewValues();
            }
            else {
                data._getCurrentValue = this.value();
                data.value = this.value();
            }
            if (this.model.touchEnd)
                this._trigger("touchEnd", data);
        },
        _change: function (evt, index) {
            var data = { value: this.value(), values: this.values() };
            if (this.model.enableRange) {
                data._getCurrentValue = this._getNewValues(index);
                data.values = this._getNewValues();
            }
            else {
                data._getCurrentValue = this.value();
                data.value = this.value();

            }
            if (this.model.change)
                this._trigger("change", data);
        },
        _wireEvents: function (remove) {
            ej.listenEvents([this._sliderHandle, this.element], [ej.startEvent(), ej.startEvent()], [this._mouseDownHandler, this._mouseDownHandler], remove);
        },

        _setRenderMode: function (mode) {
            if (this.model.enabled) {
                this.model.renderMode = mode;
                if (mode == "auto")
                    ej.setRenderMode(this);
                this.element.removeClass("e-m-ios7 e-m-android e-m-windows e-m-flat").addClass("e-m-" + this.model.renderMode);
            }
        },

        _setTheme: function (theme) {
            if (this.model.enabled) {
                this.model.theme = theme;
                this.element.removeClass("e-m-dark e-m-light").addClass("e-m-" + theme);
            }
        },

        _validateValue: function (value) {
            if (this.model.enabled) {
                if (!this.model.enableRange)
                    this["_" + this.model.orientation + "RenderMode"]();
            }
        },

        _validateRangeValue: function (rangeValue) {
            this["_" + this.model.orientation + "RenderMode"]();
            if (this.values()[0] == this.values()[1]) {
                (this.model.maxValue == this.values()[1]) ? this._setRangeValueProperties("", 0) : this._setRangeValueProperties("", 1);
            }
        },

        _disable: function () {
            this.model.enabled = false;
            this.element.addClass("e-m-state-disabled");
            this._wireEvents(true);
        },

        _enable: function () {
            this.model.enabled = true;
            this.element.removeClass("e-m-state-disabled");
            this._wireEvents();
        },

        _enableAnimation: function (isAnimate) {
            if (this.model.enabled)
                this.model.enableAnimation = isAnimate;
        },

        _refresh: function () {
            if (this.model.enabled) {
                this._clearElements();
                this._renderControl();
                this._wireEvents(false);
            }
        },
        _setModel: function (options) {
            var refresh = false;
            for (var prop in options) {
                switch (prop) {
                    case "renderMode": this._setRenderMode(options.renderMode); break;
                    case "theme": this._setTheme(options.theme); break;
                    case "orientation": this._refresh(); break;
                    case "value": this._validateValue(options.value); break;
                    case "values": if (this.model.enableRange && this.model.enabled)
                        this._validateRangeValue(options.values);
                        break;
                    case "enabled": (options.enabled) ? this._enable() : this._disable(); break;
                    case "enableRange": this._refresh(); break;
                    case "minValue": this.model.minValue = options.minValue; break;
                    case "maxValue": this.model.maxValue = options.maxValue; break;
                    case "enableAnimation": this._enableAnimation(options.enableAnimation); break;
                    case "readOnly": (options.readOnly) ? this._wireEvents(true) : this._wireEvents(false); break;
                }
            }
        },
        // all events bound using this._on will be unbind automatically
        _destroy: function () {
            this._cloneElement.insertBefore(this.element);
            this.element.remove();
        },
        _clearElements: function () {
            this._wireEvents(true);
            this.element.removeAttr("class");
            this.element.removeAttr("style");
            this.element.html("");
        },

        /*---------------Public Methods---------------*/
        getValue: function () {
            if (this.model.enableRange)
                return (this.values()[0] + "," + this.values()[1]);
            else
                return this._trimValue(this.value());
        },
        //client side methods
        dispose: function () {
            return this._destroy();
        }
        /*---------------Public Methods End---------------*/

    });

    ej.mobile.Slider.Orientation = {
        Horizontal: "horizontal",
        Vertical: "vertical"
    };

    ej.mobile.Slider.ThumbStyle = {
        Normal: "normal",
        Small: "small"
    };
})(jQuery, Syncfusion);