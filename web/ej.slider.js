/**
* @fileOverview Plugin to style the Html div elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejSlider", "ej.Slider", {

        element: null,

        model: null,
        validTags: ["div", "span"],
        _addToPersist: ["value", "values"],
        _rootCSS: "e-slider",
        _setFirst: false,
        _requiresID: true,

        defaults: {

            orientation: "horizontal",

            enableAnimation: true,

            animationSpeed: 500,

            showTooltip: true,

            cssClass: "",

            showRoundedCorner: false,

            readOnly: false,

            enableRTL: false,

            htmlAttributes: {},

            minValue: 0,

            maxValue: 100,

            sliderType: "default",

            value: null,

            values: null,

            incrementStep: 1,

            height: null,

            width: null,

            enabled: true,

            showScale: false,

            largeStep: 10,

            smallStep: 1,

            showSmallTicks: true,

            showButtons: false,

            enablePersistence: false,
            
            allowMouseWheel:false,

            start: null,

            stop: null,

            slide: null,

            change: null,

            create: null,

            destroy: null,

            tooltipChange: null,

            renderingTicks: null
        },

        dataTypes: {
            orientation: "enum",
            enableAnimation: "boolean",
            animationSpeed: "number",
            cssClass: "string",
            showRoundedCorner: "boolean",
            readOnly: "boolean",
            enableRTL: "boolean",
            minValue: "number",
            maxValue: "number",
            sliderType: "enum",
            incrementStep: "number",
            enabled: "boolean",
            showButtons: "boolean",
            showScale: "boolean",
            largeStep: "number",
            smallStep: "number",
            showSmallTicks: "boolean",
            enablePersistence: "boolean",
            htmlAttributes: "data",
            allowMouseWheel:"boolean"
        },

        observables: ["value", "values"],
        value: ej.util.valueFunction("value"),
        values: ej.util.valueFunction("values"),

        enable: function () {
            if (!this.model.enabled) {
                this.model.enabled = true;
                if (this.wrapper) this.wrapper.removeClass("e-disable");
                this.element.removeClass("e-disable");
                if (this.model.showButtons) this.element.siblings('.e-sliderbtn').ejButton("model.enabled", this.model.enabled);
                this._wireEvents();
            }
        },

        disable: function () {
            if (this.model.enabled) {
                this.model.enabled = false;
                if (this.wrapper) this.wrapper.addClass("e-disable");
                this.element.addClass("e-disable");
                if (this.model.showButtons) this.element.siblings('.e-sliderbtn').ejButton("model.enabled", this.model.enabled);
                this._unWireEvents();
            }
        },

        _validateValue: function (value, animation) {
            animation = (typeof animation === 'undefined') ? false : animation;
            if (value == null || value === "") value = this.model.minValue;
            else if (typeof value === "string") value = parseFloat(value);

            if (this._isNumber(value)) {
                this._hidden.val(value);
                this.value(value);
            }
            else if (!this._isNumber(this.value())) {
                this._hidden.val(this.model.minValue);
                this.value(this.model.minValue);
            }
            if (this.model.sliderType != "range") this._setValue(animation);
        },

        _validateRangeValue: function (value, animation) {
            animation = (typeof animation === 'undefined') ? false : animation;
            if (value == null) value = new Array(this.model.minValue, this.model.maxValue);
            else if (typeof value === "string") {
                var vals = value.split(",");
                if (vals.length > 1) value = new Array(parseFloat(vals[0]), parseFloat(vals[1]));
            }

            if (typeof value === "object" && this._isNumber(value[0]) && this._isNumber(value[1])) {
                this._hidden.val(new Array(value[0], value[1]));
                this.values(new Array(value[0], value[1]));
            }
            else if (!(typeof this.values() === "object" && this._isNumber(this.values()[0]) && this._isNumber(this.values()[1]))) {
                this._hidden.val(new Array(this.model.minValue, this.model.maxValue));
                this.values(new Array(this.model.minValue, this.model.maxValue));
            }
            if (this.model.sliderType == "range") this._setRangeValue(animation);
        },

        _validateStartEnd: function () {
            if (isNaN(this.model.minValue)) this.model.minValue = 0;
            if (isNaN(this.model.maxValue)) this.model.maxValue = 100;
        },

        _isNumber: function (number) {
            return typeof number === "number" && !isNaN(number);
        },

        _outerCorner: function (boolean) {
            if (boolean) this._roundedCorner();
            else this._sharpedCorner();
        },

        _changeSkin: function (skin) {
            this.element.removeClass(this.model.cssClass).addClass(skin);
            if (this.model.showScale)
                this.ul.removeClass(this.model.cssClass).addClass(skin);
        },

        getValue: function () {

            return this._getHandleValue();
        },

        setValue: function (value, animation) {
            if (this.model.sliderType == "range")
                this._validateRangeValue(value, animation);
            else
                this._validateValue(value, animation);
        },

        _init: function () {
            this._isInteraction = true;
            this._initialize();
            this._render();
        },

        _setModel: function (options) {
            this._isInteraction = false;
            if (!ej.isNullOrUndefined(options["minValue"]) || !ej.isNullOrUndefined(options["maxValue"])) {
                if (this._isNumber(options["minValue"])) this.model.minValue = options["minValue"];
                else options["minValue"] = this.model.minValue;

                if (this._isNumber(options["maxValue"])) this.model.maxValue = options["maxValue"];
                else options["maxValue"] = this.model.maxValue;

                if (this.model.sliderType == "range" && options["values"] == undefined) this._setRangeValue();
                else if (this.model.sliderType != "range" && options["value"] == undefined) this._setValue();
            }

            var option;
            for (option in options) {
                switch (option) {
                    case "value":
                        this._validateValue(ej.util.getVal(options[option]));
                        options[option] = this.model.value;
                        break;
                    case "values":
                        var val= typeof options.values == "function" ? options.values() : options.values;
                        if (!ej.isNullOrUndefined(val) && !ej.isNullOrUndefined(val.length) && typeof val != "string")
                        {
                            if (!isNaN(val[0]) && !isNaN(val[1])) {
                                var actualValue = typeof this.values().join == "function" ? val.join() : val;
                                if (actualValue == this._hidden.val()) break;
                            }
                        }
                        this._validateRangeValue(ej.util.getVal(options[option]));
                        options[option] = this.model.values;
                        break;
                    case "height": this.model.height = options[option]; this._setDimension();
                        if (this.model.showScale) this._scaleAlignment();
                        break;
                    case "width": this.model.width = options[option]; this._setDimension();
                        if (this.model.showScale) this._scaleAlignment();
                        break;
                    case "enabled": this._disabled(!options[option]); break;
                    case "showRoundedCorner": this._outerCorner(options[option]); break;
                    case "enableRTL": this.model.enableRTL = options[option];
                        if (this.model.showButtons) this._valueChanged = true;
                        this._checkRTL();
                        options[option] = this.model.enableRTL;
                        break;
                    case "cssClass": this._changeSkin(options[option]);
                        if (this.model.showButtons) this.element.siblings('.e-sliderbtn').ejButton("model.cssClass", options[option]);
                        break;
                    case "showScale": this._renderScale(options[option]);
                        if (this.model.enableRTL) this._changeVerticalScaleDir(options[option]); break;
                    case "orientation":
                        var t = this.model.height;
                        this.model.height = this.model.width;
                        this.model.width = t;
                    case "sliderType":
                        this._sliderOptions(option, options[option]); break;
                    case "smallStep":
                    case "largeStep":
                    case "showSmallTicks":
                    case "minValue":
                    case "maxValue":
                        this._scaleOptions(option, options[option]); break;
                    case "htmlAttributes": this._addAttr(options[option]); break;
                    case "tooltipChange":
                        this.model.tooltipChange = options[option]; break;
                    case "allowMouseWheel": this.model.allowMouseWheel = options[option]; break;
                    case "renderingTicks": this.model.renderingTicks = options[option]; break;
                    case "showButtons": this.model.showButtons = options[option]; this._renderButtons(); break;
                }
            }
        },

        _destroy: function () {
            if (this.model.showScale) this._destroyScale();
            this.element.insertAfter(this.wrapper);
            this.wrapper.remove();
            this.element.removeClass("e-widget e-box e-corner " + this.model.cssClass).empty();
            if (this.model.showButtons) this.element.removeAttr("style");
        },

        _initialize: function () {
            this.target = this.element[0];
            this.horDir = "left";
            this.verDir = "bottom";
            this._isFocused = false;
        },

        _render: function () {
            this.initialRender = true;
            this._isIE8 = (ej.browserInfo().name == 'msie' && ej.browserInfo().version == '8.0') ? true : false
            this.wrapper = ej.buildTag("div.e-slider-wrap e-widget" + this.model.cssClass + "#" + this.target.id + "_wrapper", { tabindex: "0", role: "slider" })
                .insertAfter(this.element);
            (this.model.showButtons) ? this._showButtons() : this.wrapper.append(this.element);

            this.element.addClass("e-widget e-box " + this.model.cssClass);
            if (this.model.sliderType != "default") {
                this.header = ej.buildTag("div.e-range");
                this.element.append(this.header);
                if (this.model.sliderType == "range") {
                    this.secondHandle = this._createHandle();
                }
            }
            this.firstHandle = this._createHandle();
            this._setOrientation();
            this._setDimension();
            this._insertHiddenField();
            this._checkProperties();
            if(!this.model.showScale) this._alignButtons();
            this._addAttr(this.model.htmlAttributes);
            this._setSliderValue();
        },

        _showButtons: function () {
            var proxy = this;
            var decreaseButton = ej.buildTag('button.e-decreasebtn e-sliderbtn e-animate');
            var increaseButton = ej.buildTag('button.e-increasebtn e-sliderbtn e-animate');
            decreaseButton.ejButton({
                contentType: "imageonly",
                prefixIcon: "e-icon e-minus",
                type: "button",
                repeatButton: true,
                enabled: proxy.model.enabled,
                cssClass: proxy.model.cssClass,
                click: function (e) { proxy._clickButtons(e) }
            });
            increaseButton.ejButton({
                contentType: "imageonly",
                prefixIcon: "e-icon e-plus",
                type: "button",
                repeatButton: true,
                enabled: proxy.model.enabled,
                cssClass: proxy.model.cssClass,
                click: function (e) { proxy._clickButtons(e) }
            });
            if ((this.model.enableRTL && this.model.orientation == "horizontal") || (this.model.orientation == "vertical" && !this.model.enableRTL))
                this.wrapper.append($(increaseButton)).append(this.element).append($(decreaseButton)).addClass("e-slider-buttons");
            else this.wrapper.append($(decreaseButton)).append(this.element).append($(increaseButton)).addClass("e-slider-buttons");
            this.wrapper.find('.e-sliderbtn').attr("tabindex", -1);
        },

        _renderButtons: function () {
            if (this.model.showButtons) {
                this._showButtons();
                if(!this.model.showScale) this._alignButtons();
            }
            else {
                this.element.siblings('.e-sliderbtn').remove();
                this.element.removeAttr('style');
                this.wrapper.removeClass("e-slider-buttons");
            }
            if (this.wrapper.find('ul').hasClass('e-scale')) {
                this._destroyScale();
                this._renderScale(true);
            }
        },

        _alignButtons: function () {
            if (this.model.showButtons) {
                var sliderButtons = this.wrapper.find('.e-sliderbtn');
                if (this.model.orientation == "horizontal") 
                    sliderButtons.css("top", ((this.element.outerHeight() / 2) - parseFloat(sliderButtons.outerHeight() / 2) + parseFloat(this.wrapper.css("padding-top"))) + "px");
                else 
                    sliderButtons.css("left", ((this.element.outerWidth() / 2) - parseFloat(sliderButtons.outerWidth() / 2) + parseFloat(this.wrapper.css("padding-left"))) + "px");
            }
        },

        _clickButtons: function (evt) {
            if ($(evt.target).hasClass("e-animate"))
                $(evt.target).removeClass('e-animate');
            if (this.model.readOnly || ej.isNullOrUndefined(evt.target)) return;
            var value, hval;
            if (this.model.sliderType == "range") {
                if ($(this.element).find('.e-handle.e-focus').is(this.firstHandle) && !this.model.enableRTL) { this.firstHandle.focus().addClass("e-no-tab"); hVal = this.handleVal; }
                else if (!this.model.enableRTL) { this.secondHandle.focus().addClass("e-no-tab"); hVal = this.handleVal2; }
                if ($(this.element).find('.e-handle.e-focus').is(this.secondHandle) && this.model.enableRTL) { this.secondHandle.focus().addClass("e-no-tab"); hVal = this.handleVal2; }
                else if (this.model.enableRTL) { this.firstHandle.focus().addClass("e-no-tab"); hVal = this.handleVal; }
            }
            else { this.firstHandle.focus().addClass("e-no-tab"); hVal = this.handleVal; }
            if ($(evt.target).hasClass("e-decreasebtn")) value = this._add(hVal, this.model.incrementStep, false);
            else value = this._add(hVal, this.model.incrementStep, true);
            this._changeHandleValue(value, false);
        },

        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.wrapper.addClass(value);
                else if (key == "disabled" && value == "disabled") proxy._disabled(true);
                else proxy.element.attr(key, value)
            });
        },

        _renderScale: function (showScale) {
            if (showScale) {
                this.wrapper.addClass("e-scale-wrap");
                var width = "width", orien = "h", spanText;
                if (this.model.orientation == "vertical") {
                    width = "height";
                    orien = "v";
                }

                var _smallStep = this.model.smallStep;
                if (!this.model.showSmallTicks) {
                    if (this.model.largeStep > 0)
                        _smallStep = this.model.largeStep;
                    else
                        _smallStep = this.model.maxValue - this.model.minValue;
                }
                else if (_smallStep <= 0)
                    _smallStep = this.model.incrementStep;
                var count = Math.abs(this.model.maxValue - this.model.minValue) / _smallStep;

                this.ul = ej.buildTag("ul.e-scale e-" + orien + "-scale " + this.model.cssClass);
                if (this._isIE8) this.ul.addClass('e-ie8')
                this.wrapper.append(this.ul);

                var li, args, start = this.model.minValue, left = 0, tickWidth = 100 / count;
                if (orien == "v") start = this.model.maxValue;
                for (var i = 0; i <= count; i++) {
                    li = ej.buildTag("li.e-tick", "", {}, { "title": start });
                    var islargeTick = (start % this.model.largeStep == 0) ? true : false;
                    if (islargeTick) li.addClass("e-large");
                    li.css(width, tickWidth + "%");
                    if (this.model.renderingTicks) {
                        args = { value: start, valueType: "tooltip", tick: li[0]};
                        this._trigger("renderingTicks", args);
                        li.attr("title", args.value);
                    }
                    if (islargeTick) {
                        if (this.model.renderingTicks) {
                            args.valueType = "label";
                            args.value = start;
                            this._trigger("renderingTicks", args);
                            spanText = args.value;
                        }
                        else spanText = start;
                        var span = ej.buildTag("span.e-tick-value", "" + spanText);
                        li.append(span);
                    }
                    this.ul.append(li);

                    if (orien == "h") start += _smallStep;
                    else start -= _smallStep;
                    left += _smallStep;
                }

                this.ul.children().first().addClass("e-first-tick").css(width, (tickWidth / 2) + "%");
                this.ul.children().last().addClass("e-last-tick").css(width, (tickWidth / 2) + "%");

                this._scaleAlignment();
            }
            else this._destroyScale();
            this._setWrapperHeight();
            this._alignButtons();
        },
        _destroyScale: function () {
            this.wrapper.removeClass("e-scale-wrap");
            this.ul.remove();
            this.ul = null;
        },

        _tickValuePosition: function () {
            var width = (this.model.orientation == "vertical") ? "height" : "width";
            var left = (this.model.orientation == "vertical") ? "top" : "left";
            var firstTick = this.ul.find(".e-tick.e-first-tick");
            var first = firstTick.find(".e-tick-value");
            var other = this.ul.find(".e-tick.e-large:not(.e-first-tick)").find(".e-tick-value");
            var tickWidth = firstTick[width]() * 2;
            first.css(left, -first[width]() / 2);
            other.css(left, (tickWidth - other[width]()) / 2);
        },

        _scaleAlignment: function () {
            this._tickValuePosition();
            var smallTick = 12, largeTick = 20, half = largeTick / 2;
            var height = "height", top = "top", orien = "h";
            if (this.model.orientation == "vertical") {
                height = "width";
                top = "right";
                orien = "v";
                (this.element.width() <= 15) ? this.wrapper.addClass("e-small-size") : this.wrapper.removeClass("e-small-size");
            }
            else
                (this.element.height() <= 15) ? this.wrapper.addClass("e-small-size") : this.wrapper.removeClass("e-small-size");
            // scale
             this.ul.css(top, -(this.wrapper[height]() + half));
            if(orien == "v") this.ul.css("top", -this.wrapper.height()).css(top, half);
            this.ul[height](this.wrapper[height]() + largeTick);
            // small-ticks
            var topSize = -(largeTick - smallTick) / 2;
            if (this.model.largeStep == null && orien != "v") topSize = -topSize;
            this.ul.find(".e-tick:not(.e-large)").css(height, this.wrapper[height]() + smallTick).css(top, topSize);
            // tick-values   // 4 - distance between tick value and tick
            if (orien == "v") this.ul.children(".e-large").find(".e-tick-value").css("right", this.wrapper.width() + largeTick + 4);
        },

        _setWrapperHeight : function(){
            var wrapHeight, wrapWidth;
            if (this.model.orientation == "horizontal") {
                if (this.ul)
                    wrapHeight = (this.firstHandle.outerHeight() > this.ul.height()) ? this.firstHandle.outerHeight() : this.ul.height();
                else wrapHeight = this.firstHandle.outerHeight();
                var top = (wrapHeight - this.element.outerHeight()) / 2;
                if (top < 0) top = 0;
                this.wrapper.css({ "padding": top + "px 0px" });
            }
            else {
                if (this.ul)
                    wrapWidth = (this.firstHandle.outerWidth() > this.ul.width()) ? this.firstHandle.outerWidth() : this.ul.width();
                else wrapWidth = this.firstHandle.outerWidth();
                var right = ( wrapWidth - this.element.outerWidth()) / 2;
                if (right < 0) right = 0;
                this.wrapper.css({ "padding": "0px " + right + "px" });
            }
        },


        _createHandle: function () {
			var handle = ej.buildTag("a.e-handle e-select", "", {}, { "aria-label": "drag", "tabindex": 0});
            this.element.attr({ role: "slider", "aria-valuemin": this.model.minValue, "aria-valuemax": this.model.maxValue });
            ej.browserInfo().name == "msie" && handle.addClass("e-pinch");
            this.element.append(handle);
            return handle;
        },

        _setDimension: function () {
            if (this.model.height) this.wrapper.height(this.model.height);
            if (this.model.width) this.wrapper.width(this.model.width);
            this._setHandleSize();
            this._handleAlignment(this.model.enableRTL);
            this._alignButtons();
        },

        _insertHiddenField: function () {
            this._hidden = ej.buildTag("input", "", {},
                { "type": "hidden", "name": this.element[0].id });
            this._hidden.val(this._getHandleValue());
            this.element.append(this._hidden);
        },

        _checkProperties: function () {
            if (!this.model.enabled) {
                if (this.wrapper) this.wrapper.addClass("e-disable");
                else this.element.addClass("e-disable");
            }
            else this._wireEvents();
            if (this.model.showScale) this._renderScale(true);
            else this._setWrapperHeight();
            if (this.model.enableRTL) this._checkRTL();
            if (this.model.showRoundedCorner) this._roundedCorner();
        },

        _roundedCorner: function () {
            this.element.addClass("e-corner");
        },

        _sharpedCorner: function () {
            this.element.removeClass("e-corner");
        },

        _handleAlignment: function (rtl) {
            var mar = -(this.firstHandle.outerWidth() / 2) + "px", margin;
            if (this.model.orientation != "vertical") {
                if (!rtl) margin = "0 0 0 " + mar;
                else margin = "0 " + mar + " 0 0";
            }
            else {
                if (!rtl) margin = "0 0 " + mar + " 0";
                else margin = mar + " 0 0 0";
            }
            this.element.children('.e-handle').css("margin", margin);
        },

        _checkRTL: function () {
            if (this.model.showButtons && this._valueChanged) {
                this.element.siblings('.e-sliderbtn').remove();
                this._renderButtons();
            }
            var rtl = this.model.enableRTL, preDir = (this.model.orientation != "vertical") ? this.horDir : this.verDir;
            if (rtl) {
				this.wrapper.addClass("e-rtl");
				if (this.model.orientation == "vertical") {
					this.wrapper.addClass("e-top-to-bottom");
				}
                this.horDir = "right";
                this.verDir = "top";
            }
            else {
                this.wrapper.removeClass("e-rtl e-top-to-bottom");
                this.horDir = "left";
                this.verDir = "bottom";
            }
            if (!this.model.showButtons || (this.model.showButtons && this.model.enableRTL)) this._changeVerticalScaleDir(this.model.showScale);
            var currDir = (this.model.orientation != "vertical") ? this.horDir : this.verDir;

            if (preDir != currDir) {
                this.firstHandle.css(currDir, this.firstHandle[0].style[preDir]).css(preDir, "auto");
                if (this.model.sliderType != "default") {
                    this.header.css(currDir, this.header[0].style[preDir]).css(preDir, "auto");
                    if (this.model.sliderType == "range")
                        this.secondHandle.css(currDir, this.secondHandle[0].style[preDir]).css(preDir, "auto");
                }
            }
            this._handleAlignment(rtl);
        },

        _setOrientation: function () {
            if (this.model.orientation != "vertical") {
                this.wrapper.addClass("e-horizontal");
            }
            else {
                this.wrapper.addClass("e-vertical");
                this.firstHandle.css(this.verDir, "0");
            }
        },

        _changeVerticalScaleDir: function (showScale) {
            if (showScale) {
                var verscaleli = this.wrapper.find('.e-v-scale li');
                if (verscaleli.length > 0)
                {
                    var revdir = verscaleli.toArray().reverse(); verscaleli.remove();
                    this.wrapper.find('.e-v-scale').append(revdir);
                }
            }
        },

        _setHandleSize: function () {
            if ((this.model.height != null && this.model.orientation == "horizontal") || (this.model.width != null && this.model.orientation == "vertical") ) {
                var size;
                if (this.model.orientation != "vertical")
                    size = this.wrapper.height() + 2;
                else
                    size = this.wrapper.width() + 2;
                this.element.find(".e-handle").height(size).width(size);
            }
            else{
                this.wrapper.addClass("e-default-wrap");
                this.element.find(".e-handle").addClass("e-default");
            }
        },

        _disabled: function (boolean) {
            if (boolean) this.disable();
            else this.enable();
        },

        _sliderOptions: function (prop, value) {
            this._unWireEvents();
            this._destroy();
            this.model[prop] = value;
            this._init();
        },

        _scaleOptions: function (prop, value) {
            if (this.model.showScale) {
                this._destroyScale();
                this.model[prop] = value;
                this._renderScale(true);
                if (this.model.enableRTL)
                    this._changeVerticalScaleDir(true);
            }
        },

        _showTooltip: function () {
            if (this.model.showTooltip) {
                this._timeOut && clearTimeout(this._timeOut);
                var _tooltip = this.tooltip ? $('body .e-tooltipbox').text().replace(/\s+/g, '').replace("-", ",") : "";
                if (this.tooltip && this.tooltip.length && this.tooltip.css("display") != "none" && this._getHandle()[0] == this._oldHandle && _tooltip == this.preValue) {
                    if (this._getHandleValue().toString() != this.preValue)
                        this._setTooltipPosition();
                    return;
                }
                this._oldHandle = this._getHandle()[0];
                $('body .e-tooltipbox').remove();
                this.tooltip = ej.buildTag("div.e-tooltipbox " + this.model.cssClass + " e-corner", { role: "tooltip" }).css(this._getOffset(this._getHandle()));
                $("body").append(this.tooltip);
                if (this.model.orientation == "vertical") {
                    this.tooltip.addClass("e-vertical");
                }
                this._setTooltipPosition();
            }
        },

        _hideTooltip: function () {
            if (this.model.showTooltip) {
                var proxy = this;
                this._timeOut = setTimeout(function () {
                    proxy.tooltip.fadeOut(800);
                }, 1500);
            }
                
        },

        _showhideTooltip: function (showTooltip) {
            if (this.model.showTooltip && showTooltip) {
                this._showTooltip();
                this._timeOut && clearTimeout(this._timeOut);
                this._hideTooltip();
            }
        },

        _setTooltipPosition: function () {
            if (this.model.showTooltip) {
                this._updateTooltipValue();
                var top, left, remainLeft, remainTop, handle, pos, gap = 5, broder, tooltipPos, border; // gap -> distance between tooltip and slider
                handle = this._getHandle(), pos = this._getOffset(handle), tooltipPos = this._getOffset(this.tooltip);
                border = $(handle).outerHeight() - $(handle).height();
                if (this.model.orientation == "vertical") {
                    remainTop = (this.tooltip.outerHeight() - handle.outerHeight()) / 2;
                    remainLeft = handle.outerWidth() + gap;
                    top = pos.top - remainTop;
                    left = pos.left + remainLeft;
					var height=$(window).height();
                    if (window.pageYOffset > 0) height+=window.pageYOffset; 
                    if (top < 0) top = 0;
                    else if (height < top + this.tooltip.outerHeight()) top = height - this.tooltip.outerHeight() - border;
                    if ($(window).width() < left + this.tooltip.outerWidth()) left = pos.left - this.tooltip.outerWidth() - border;
                }
                else {
                    if (tooltipPos.left + this.tooltip.outerWidth() > $(window).width()) this.tooltip.css({ "left": '0px' });
                    remainLeft = (this.tooltip.outerWidth() - handle.outerWidth()) / 2;
                    remainTop = this.tooltip.outerHeight() + gap;
                    top = pos.top - remainTop;
                    left = pos.left - remainLeft;
					var width=$(window).width();
                    if (window.pageXOffset > 0) width+=window.pageXOffset;    
                    if (left < 0) left = 0;
                    else if (width < left + this.tooltip.outerWidth()) left = width - this.tooltip.outerWidth() - border;
                    if (top < 0 || pos.top < remainTop) {
                        if (pos.top + handle.outerHeight() + border + this.tooltip.outerHeight() > $(window).height()) {
                            top = pos.top;
                            if (pos.left > this.tooltip.outerWidth() + gap + border) left = pos.left - (this.tooltip.outerWidth() + border);
                            else left = pos.left + (handle.outerWidth() + gap + border);
                        } else top = pos.top + handle.outerHeight() + border;
                    }
                }
                var zindex = this._maxZindex();
                this.tooltip.css({ "top": top, "left": left, "zIndex": zindex + 1 });
            }
        },
        _getOffset: function (ele) {
            return ej.util.getOffset(ele);
        },


        _maxZindex: function () {
            return ej.util.getZindexPartial(this.element, this.popup);
        },

        _updateTooltipValue: function () {
            var one = 0, two = 1, val;
            if (this.model.enableRTL) { one = 1, two = 0; }
            if (this.model.tooltipChange)
                val = this._raiseEvent("tooltipChange");
            else
                val = this._getHandleValue();
            if (this.model.sliderType != "range")
                this.tooltip[0].innerHTML = val;
            else
                this.tooltip[0].innerHTML = val[one] + " - " + val[two];
        },

        _increaseHeaderWidth: function (animation) {
            if (this.model.sliderType != "default") {
                var size = "width", direction = this.horDir, properties = {};
                if (this.model.orientation == "vertical") { size = "height", direction = this.verDir; }

                if (this.model.sliderType == "range") {
                    properties[size] = this.handlePos - this.handlePos2 + "%";
                    properties[direction] = this.handlePos2 + "%";
                }
                else {
                    properties[size] = this.handlePos + "%";
                    properties[direction] = 0;
                }
                if (!animation) this.header.css(properties);
                else this.header.animate(properties, this.model.animationSpeed);
            }
        },

        _setSliderValue: function () {
            this._validateStartEnd();

            if (this.model.sliderType == "range")
                this._validateRangeValue(this.values());
            else
                this._validateValue(this.value());
            this.preValue = this.getValue().toString();
        },


        _hoverOnHandle: function (evt) {
            $(evt.currentTarget).addClass("e-hover");
        },

        _leaveFromHandle: function (evt) {
            $(evt.currentTarget).removeClass("e-hover");
        },

        _firstHandleClick: function (evt) {
            evt.preventDefault();
            this.firstHandle.focus().addClass("e-no-tab");
            if (this._raiseEvent("start")) return false;

            this.mouseDownPos = this.handlePos;
            if (!this.model.readOnly)
            this._on($(document),ej.eventType.mouseMove, this._firstHandleMove);
            this._on($(document),ej.eventType.mouseUp,this._firstHandleUp);
            this._on($(document),"mouseleave",this._firstHandleUp);
            this._showTooltip();
        },

        _firstHandleMove: function (evt) {
            evt.preventDefault();
            evt = evt.type == "touchmove" ? evt.originalEvent.changedTouches[0] : evt;
            var position = { x: evt.pageX, y: evt.pageY };
            this.handlePos = this._xyToPosition(position);

            if (this.model.sliderType == "range" && this.handlePos < this.handlePos2) {
                this.handlePos = this.handlePos2;
            }
            if (this.handlePos != this.preHandlePos) {
                this.preHandlePos = this.handlePos;
                this.handleVal = this._positionToValue(this.handlePos);
                this._increaseHeaderWidth(false);
                this._setHandlePosition(false, false, false);
                this._setTooltipPosition();

                this._updateModelValue();
                this._raiseEvent("slide");
            }
        },

        _firstHandleUp: function (evt) {
            evt.preventDefault();
            this._off($(document),ej.eventType.mouseMove, this._firstHandleMove);
            this._off($(document),ej.eventType.mouseUp,this._firstHandleUp);
            this._off($(document), "mouseleave", this._firstHandleUp);
            this._timeOut && clearTimeout(this._timeOut);
            this._hideTooltip();

            if (this.mouseDownPos != this.handlePos) this._raiseChangeEvent();
        },

        _secondHandleClick: function (evt) {
            evt.preventDefault();
            this.secondHandle.focus().addClass("e-no-tab");
            if (this._raiseEvent("start")) return false;

            this.mouseDownPos2 = this.handlePos2;
            if (!this.model.readOnly)
            this._on($(document),ej.eventType.mouseMove, this._secondHandleMove);
            this._on($(document),ej.eventType.mouseUp,this._secondHandleUp);
            this._on($(document),"mouseleave",this._secondHandleUp);
            this._showTooltip();
        },

        _secondHandleMove: function (evt) {
            evt.preventDefault();
            evt = evt.type == "touchmove" ? evt.originalEvent.changedTouches[0] : evt;
            var position2 = { x: evt.pageX, y: evt.pageY };
            this.handlePos2 = this._xyToPosition(position2);

            if (this.handlePos2 > this.handlePos) {
                this.handlePos2 = this.handlePos;
            }
            if (this.handlePos2 != this.preHandlePos2) {
                this.preHandlePos2 = this.handlePos2;
                this.handleVal2 = this._positionToValue(this.handlePos2);
                this._increaseHeaderWidth(false);
                this._setHandlePosition(false, false, false);
                this._setTooltipPosition();

                this._updateModelValue();
                this._raiseEvent("slide");
            }
        },

        _secondHandleUp: function (evt) {
            evt.preventDefault();
            this._off($(document),ej.eventType.mouseMove,this._secondHandleMove);
            this._off($(document),ej.eventType.mouseUp,this._secondHandleUp);
            this._off($(document), "mouseleave", this._secondHandleUp);
            this._timeOut && clearTimeout(this._timeOut);
            this._hideTooltip();

            if (this.mouseDownPos2 != this.handlePos2) this._raiseChangeEvent();
        },

        _focusInHandle: function (evt) {
            if (!this._isFocused) {
                this._isFocused = true;
                $(evt.currentTarget).addClass("e-focus");
                if (!this.model.readOnly)
                   this._on($(document),"keydown",this._moveHandle);
                if (this.model.allowMouseWheel && !this.model.readOnly) {
                    this._on(this.element,"mousewheel DOMMouseScroll", this._moveHandle);
                }
                this.activeHandle = $(evt.currentTarget).is(this.firstHandle) ? 1 : 2;
                this._setZindex();
            }
        },

        _focusOutHandle: function (evt) {
            if ($(evt.relatedTarget).is('button') && $(evt.target).parent().siblings().is(evt.relatedTarget)) return;
            if (ej.isNullOrUndefined(evt.relatedTarget) && !ej.isNullOrUndefined(evt.originalEvent) && !ej.isNullOrUndefined(evt.originalEvent.toElement)) {
                if ($(evt.originalEvent.toElement).is('button') && $(evt.target).parent().siblings().is(evt.originalEvent.toElement)) return;
            }
            this._isFocused = false;
            if (this.model.showTooltip && this.tooltip)
                this.tooltip.fadeOut(800);
            this.element.find(".e-no-tab").removeClass("e-no-tab");
            $(evt.currentTarget).removeClass("e-focus");
         this._off($(document),"keydown",this._moveHandle);
            this._off(this.element,"mousewheel DOMMouseScroll", this._moveHandle);
        },

        _moveHandle: function (e) {
            if ((e.type == 'mousewheel') || (e.type=='DOMMouseScroll')) e.preventDefault()
            var oper, val, handleNo;
            handleNo = this._getHandleIndex(this.activeHandle) - 1;
            if ((e.type == 'mousewheel') || (e.type == 'DOMMouseScroll')) {
                var rawEvent = e.originalEvent;
                if (rawEvent.wheelDelta) {
                    delta = rawEvent.wheelDelta / 120;
                }
                else if (rawEvent.detail) {
                    // Firefox uses detail property, which is a multiple of 3.
                    delta = -rawEvent.detail / 3;
                }
                oper = delta > 0 ? 'add' : 'sub';
            }

            switch (e.keyCode || e.originalEvent.wheelDelta) {
                case -120:
                case 37:
                case 40:
                    this._getHandle().addClass("e-no-tab");
                    e.preventDefault();
                    oper = "sub";
                    break;
                case 120:
                case 38:
                case 39:
                    this._getHandle().addClass("e-no-tab");
                    e.preventDefault();
                    oper = "add";
                    break;
                case 36:
                    this._getHandle().addClass("e-no-tab");
                    e.preventDefault();
                    if (this._raiseEvent("start")) return false;
                    if (this.model.sliderType != "range" && this.value() != this.model.minValue) {
                        this._changeHandleValue(this.model.minValue, this.model.enableAnimation);
                    }
                    else if (this.model.sliderType == "range") {
                        val = (this.activeHandle == 2) ? this.model.minValue : this.handleVal2;
                        if (this.values()[handleNo] != val)
                            this._changeHandleValue(val, this.model.enableAnimation);
                    }
                    break;
                case 35:
                    this._getHandle().addClass("e-no-tab");
                    e.preventDefault();
                    if (this._raiseEvent("start")) return false;
                    if (this.model.sliderType != "range" && this.value() != this.model.maxValue) {
                        this._changeHandleValue(this.model.maxValue, this.model.enableAnimation);
                    }
                    else if (this.model.sliderType == "range") {
                        val = (this.activeHandle == 1) ? this.model.maxValue : this.handleVal;
                        if (this.values()[handleNo] != val)
                            this._changeHandleValue(val, this.model.enableAnimation);
                    }
                    break;
                case 27:
                    this._getHandle().addClass("e-no-tab");
                    e.preventDefault();
                    this._getHandle().focusout();
                    break;
            }

            if (oper == "add" || oper == "sub") {
                if (this._raiseEvent("start")) return false;
                var hVal = (this.activeHandle == 1) ? this.handleVal : this.handleVal2;
                var value = (oper == "add") ? this._add(hVal, this.model.incrementStep, true) : this._add(hVal, this.model.incrementStep, false);
                this._changeHandleValue(value, false);
            }
        },

        _changeHandleValue: function (value, animate) {
            var position = null;
            if (this.activeHandle == 1) {
                this.handleVal = this._checkHandleValue(value);
                this.handlePos = this._checkHandlePosition(this.handleVal);

                if (this.model.sliderType == "range" && this.handlePos < this.handlePos2) {
                    this.handlePos = this.handlePos2;
                    this.handleVal = this.handleVal2;
                }
                if (this.handlePos != this.preHandlePos)
                    position = this.preHandlePos = this.handlePos;
            }
            else {
                this.handleVal2 = this._checkHandleValue(value);
                this.handlePos2 = this._checkHandlePosition(this.handleVal2);

                if (this.model.sliderType == "range" && this.handlePos < this.handlePos2) {
                    this.handlePos2 = this.handlePos;
                    this.handleVal2 = this.handleVal;
                }
                if (this.handlePos2 != this.preHandlePos2)
                    position = this.preHandlePos2 = this.handlePos2;
            }

            if (position != null) {
                this._increaseHeaderWidth(animate);
                this._setHandlePosition(animate, true, true);
            }
        },

        _sliderBarClick: function (evt) {
            if (this.model.readOnly) return false;
            if (evt.target == this.target || (this.model.sliderType != "default" && evt.target == this.header[0]) || $(evt.target).hasClass('e-tick') || $(evt.target).hasClass('e-scale') || evt.target == this.wrapper[0]) {
                evt.preventDefault();
                if (this._raiseEvent("start")) return false;
                var pos = { x: evt.pageX, y: evt.pageY },
                handlepos = this._xyToPosition(pos),
                handleVal = this._positionToValue(handlepos);

                if (this.model.sliderType == "range" && (this.handlePos - handlepos) > (handlepos - this.handlePos2)) {
                    this.handlePos2 = this.preHandlePos2 = handlepos;
                    this.handleVal2 = handleVal;
                    this.activeHandle = 2;
                }
                else {
                    this.handlePos = this.preHandlePos = handlepos;
                    this.handleVal = handleVal;
                    this.activeHandle = 1;
                }

                this._getHandle().focus().addClass("e-no-tab");;
                if (this.model.sliderType != "default") this._increaseHeaderWidth(this.model.enableAnimation);
                this._setHandlePosition(this.model.enableAnimation, true, true);
            }
        },

        _setHandlePosition: function (animation, showTooltip, changeEvt) {
            var Handle = this._getHandle(), proxy = this, properties = {}, pos, val, direction;
            pos = (this.activeHandle == 1) ? this.handlePos : this.handlePos2;
            val = (this.activeHandle == 1) ? this.handleVal : this.handleVal2;
            Handle.attr("aria-label", val);
            direction = (this.model.orientation == "vertical") ? this.verDir : this.horDir;
            properties[direction] = pos + "%";
            if (pos == 0) {
                this.model.sliderType != "range" && this._getHandle().addClass("e-handle-start");
            }
            else {
                this._getHandle().removeClass("e-handle-start");
            }
            if (!animation) {
                Handle.css(properties);
                this._showhideTooltip(showTooltip);
                if (changeEvt) this._raiseChangeEvent();
            }
            else Handle.animate(properties, this.model.animationSpeed, function () {
                proxy._showhideTooltip(showTooltip);
                if (changeEvt) proxy._raiseChangeEvent();
            });
        },

        _xyToPosition: function (position) {
            if (this.model.minValue == this.model.maxValue)
                return 100;
            if (this.model.orientation != "vertical") {
                var left = position.x - this.element.offset().left,
                num = this.element.width() / 100,
                val = (left / num);
            }
            else {
                var top = position.y - this.element.offset().top,
                num = this.element.height() / 100,
                val = 100 - (top / num);
            }
            val = this._stepValueCalculation(val);
            if (val < 0) val = 0;
            else if (val > 100) val = 100;
            if (this.model.enableRTL) return 100 - val;
            return val;
        },

        _updateValue: function () {
            this.handleVal = this._checkHandleValue(this.value());
            this.handlePos = this._checkHandlePosition(this.handleVal);
            this.preHandlePos = this.handlePos;
            this.activeHandle = 1;
        },

        _setValue: function (animation) {
            this._updateValue();
            this._increaseHeaderWidth(animation);
            this._setHandlePosition(animation, false, true);
        },

        _updateRangeValue: function () {
            var values = this.values();
            this.handleVal = this._checkHandleValue(values[1]);
            this.handleVal2 = this._checkHandleValue(values[0]);
            this.handlePos = this._checkHandlePosition(this.handleVal);
            this.handlePos2 = this._checkHandlePosition(this.handleVal2);

            if (this.handlePos < this.handlePos2) {
                this.handlePos = this.handlePos2;
                this.handleVal = this.handleVal2;
            }
            this.preHandlePos = this.handlePos;
            this.preHandlePos2 = this.handlePos2;
        },

        _setRangeValue: function (animation) {
            this._updateRangeValue();
            this._increaseHeaderWidth(animation);
            this.activeHandle = 1;
            this._setHandlePosition(animation, false, false);
            this.activeHandle = 2;
            this._setHandlePosition(animation, false, true);
        },

        _checkHandlePosition: function (value) {
            if (this.model.minValue == this.model.maxValue)
                return 100;
            var handle = this._tempStartEnd();
            if (value >= handle.start && value <= handle.end)
                value = (100 * (value - this.model.minValue)) / (this.model.maxValue - this.model.minValue);
            else if (value < handle.start) value = 0;
            else value = 100;
            return value;
        },

        _checkHandleValue: function (value) {
            if (this.model.minValue == this.model.maxValue)
                return this.model.minValue;
            var handle = this._tempStartEnd();
            if (value < handle.start) value = handle.start;
            else if (value > handle.end) value = handle.end;
            return value;
        },

        _tempStartEnd: function () {
            if (this.model.minValue > this.model.maxValue)
                return {
                    start: this.model.maxValue,
                    end: this.model.minValue
                };
            else
                return {
                    start: this.model.minValue,
                    end: this.model.maxValue
                };
        },

        _positionToValue: function (pos) {
            var diff = this.model.maxValue - this.model.minValue,
            val = this._round(diff * pos / 100),
            total = this._add(val, this.model.minValue, true);
            return total;
        },

        _getHandle: function () {
            return (this.activeHandle == 1) ? this.firstHandle : this.secondHandle;
        },

        _getHandleIndex: function (no) {
            if (this.model.sliderType == "range" && no == 1)
                return 2;
            return 1;
        },

        _getHandleValue: function () {
            if (this.model.sliderType == "range") return [this.handleVal2, this.handleVal];
            else return this.handleVal;
        },

        _updateModelValue: function () {
            var value = this._getHandleValue();
            this._hidden.val(value);
            if (this.model.sliderType == "range") this.values(value);
            else this.value(value);
        },

        _add: function (a, b, addition, precision) {
            var x = Math.pow(10, precision || 3), val;
            if (addition) val = (Math.round(a * x) + Math.round(b * x)) / x;
            else val = (Math.round(a * x) - Math.round(b * x)) / x;
            return val;
        },

        _round: function (a) {
            var _f = this.model.incrementStep.toString().split(".");
            return _f[1] ? parseFloat(a.toFixed(_f[1].length)) : Math.round(a);
        },

        _raiseChangeEvent: function () {
            this._updateModelValue();
            if (this.initialRender)
                this.initialRender = false;
            else {
                if(this.getValue().toString() != this.preValue.toString()){
                        this._raiseEvent("change");
                        this._raiseEvent("stop");
                        this.preValue = this.getValue().toString();
                        this._isInteraction = true;
                }
            }
        },

        _raiseEvent: function (name) {
            var data = { id: this.target.id, value: this._getHandleValue(), sliderIndex: this._getHandleIndex(this.activeHandle) };
            if (name == "change")
                data = { id: this.target.id, isInteraction: this._isInteraction, value: this._getHandleValue(), sliderIndex: this._getHandleIndex(this.activeHandle) };
            if (name == "tooltipChange")
                data = { id: this.target.id, isInteraction: this._isInteraction, value: this._getHandleValue(), sliderIndex: this._getHandleIndex(this.activeHandle) };
            var status = this._trigger(name, data);
            if (name == "tooltipChange")
                return data.value;
            return status;
        },

        _setZindex: function () {
            if (this.model.sliderType == "range") {
                if (this.activeHandle == 1) {
                    this.firstHandle.css("z-index", 2);
                    this.secondHandle.css("z-index", 1);
                }
                else {
                    this.firstHandle.css("z-index", 1);
                    this.secondHandle.css("z-index", 2);
                }
            }
        },

        _stepValueCalculation: function (value) {
            if (this.model.incrementStep == 0) this.model.incrementStep = 1;
            var percentStep = this.model.incrementStep / ((this.model.maxValue - this.model.minValue) / 100);
            var remain = value % Math.abs(percentStep);
            if (remain != 0) {
                if ((percentStep / 2) > remain) value -= remain;
                else value += Math.abs(percentStep) - remain;
            }
            return value;
        },

        _wireEvents: function () {
            this._on(this.wrapper, "mousedown", this._sliderBarClick);
            this._on(this.firstHandle, ej.eventType.mouseDown, this._firstHandleClick);
            this._on(this.firstHandle, "mouseenter", this._hoverOnHandle);
            this._on(this.firstHandle, "mouseleave", this._leaveFromHandle);
            this._on(this.firstHandle, "focusin", this._focusInHandle);
            this._on(this.firstHandle, "focusout", this._focusOutHandle);

            if (this.model.sliderType == "range") {
                this._on(this.secondHandle, ej.eventType.mouseDown, this._secondHandleClick);
                this._on(this.secondHandle, "mouseenter", this._hoverOnHandle);
                this._on(this.secondHandle, "mouseleave", this._leaveFromHandle);
                this._on(this.secondHandle, "focusin", this._focusInHandle);
                this._on(this.secondHandle, "focusout", this._focusOutHandle);
            }
        },


        _unWireEvents: function () {
            this._off(this.wrapper, "mousedown");
            this._off(this.firstHandle, ej.eventType.mouseDown);
            this._off(this.firstHandle, "mouseenter");
            this._off(this.firstHandle, "mouseleave");
            this._off(this.firstHandle, "focusin");
            this._off(this.firstHandle, "focusout");

            if (this.model.sliderType == "range") {
                this._off(this.secondHandle, ej.eventType.mouseDown);
                this._off(this.secondHandle, "mouseenter");
                this._off(this.secondHandle, "mouseleave");
                this._off(this.secondHandle, "focusin");
                this._off(this.secondHandle, "focusout");
            }
        }
    });

    ej.SliderType = {
        /**  support for slider control to select a single value. */
        Default: "default",
        /**  support for slider control to select a single value considered from start value to current handle. */
        MinRange: "minrange",
        /**  support for slider control to select a range of value between the two handles. */
        Range: "range"
    };
})(jQuery, Syncfusion);