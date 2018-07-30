/**
* @fileOverview Plugin to style the Html input elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) { 
    ej.widget("ejRating", "ej.Rating", {
        _rootCSS: "e-rating",

        element: null,

        model: null,
        validTags: ["input"],
        _addToPersist: ["value"],
        _setFirst: false,
        angular: {
            require: ['?ngModel', '^?form', '^?ngModelOptions']
        },

        defaults: {

            maxValue: 5,

            minValue: 0,

            value: 1,

            allowReset: true,

            shapeWidth: 23,

            shapeHeight: 23,

            orientation: "horizontal",

            incrementStep: 1,

            readOnly: false,

            htmlAttributes: {},

            enabled: true,

            showTooltip: true,

            precision: "full",

            cssClass: "",

            width: null,

            height: null,

            enablePersistence: false,

            create: null,

            click: null,

            mouseover: null,

            mouseout: null,

            mousemove: null,

            change: null,

            destroy: null
        },

        dataTypes: {
            maxValue: "number",
            minValue: "number",
            allowReset: "boolean",
            shapeWidth: "number",
            shapeHeight: "number",
            orientation: "enum",
            incrementStep: "number",
            readOnly: "boolean",
            precision: "enum",
            enabled: "boolean",
            htmlAttributes: "data"
        },

        observables: ["value"],
        value: ej.util.valueFunction("value"),

        _setModel: function (options) {
            for (var key in options) {
                switch (key) {
                    case "allowReset": {
                        if (options[key]) {
                            this._showResetButton();
                        }
                        else {
                            this._hideResetButton();
                        }
                        break;
                    }
                    case "value": {
                        this.setValue(ej.util.getVal(options[key]));
                        options[key] = this.value();
                        break;
                    }
                    case "enabled": this._enabledAction(options[key]); break;
                    case "cssClass": this._changeSkin(options[key]); break;
                    case "height": this._mainDiv.height(options[key]); break;
                    case "width": this._mainDiv.width(options[key]); break;
                    case "readOnly": {
                        this.model.readOnly = options[key];
                        if (options[key]) {
                            this._unWireEvents();
                            this._on(this._mainDiv.find("li"), "mouseleave touchend", this._MouseOutHandler);
                        }
                        else
                            this.refresh();
                        break;
                    }
                    case "orientation":
                        {
                            this.model.orientation = options[key];
                            this.refresh();
                            break;
                        }
                    case "maxValue":
                        {
                            this.model.maxValue = options[key];
                            this.refresh();
                            break;
                        }
                    case "minValue":
                        {
                            this.model.minValue = options[key];
                            this.refresh();
                            break;
                        }
                    case "incrementStep":
                        {
                            this.model.incrementStep = options[key];
                            this.refresh();
                            break;
                        }
                    case "shapeWidth":
                        {
                            this.model.shapeWidth = options[key];
                            this.refresh();
                            break;
                        }
                    case "shapeHeight":
                        {
                            this.model.shapeHeight = options[key];
                            this.refresh();
                            break;
                        }
                    case "htmlAttributes": this._addAttr(options[key]); break;
                }
            }
        },


        _destroy: function () {
            this.element.show();
			this.element.val(this.element.attr("value"));
            this._unWireEvents();
            this._mainDiv.remove();
        },

        _init: function () {
            this._initialize();
        },

        _initialize: function () {
            this.element.hide();
            this._mainDiv = ej.buildTag("div.e-rating e-widget " + this.model.cssClass, "", {}, { tabindex: "0", role: "group", "aria-label": "Rating" });
            if (!ej.isNullOrUndefined(this.model.width))
                this._mainDiv.width(this.model.width);
            if (!ej.isNullOrUndefined(this.model.height))
                this._mainDiv.height(this.model.height);
            this._mainDiv.insertBefore(this.element);
            if (this.model.orientation == ej.Orientation.Horizontal) {
                this._mainDiv.addClass("e-horizontal");
            }
            else
                this._mainDiv.addClass("e-vertical");

            if (this.model.allowReset && !this.model.readOnly) {
                this._createReset();
            }
            this._validation();
            if (this.value() == 1 && this.element[0].value != "")
                this.value(this.element[0].value);
            this._renderShape();
            this._shapes = this._mainDiv.find("div.e-shape");
            this._wireEvents();
            this._CurrentIndex = 0;
            this._initCurrentValue();
            this.element.val(this.value());
            this._enabledAction(this.model.enabled);
            this._checkNameAttr();
            this._addAttr(this.model.htmlAttributes);
            if (this.model.showTooltip)
                this._renderTooltip();
        },
        _checkNameAttr: function () {
            if (!this.element.attr("name"))
                this.element.attr({ "name": this.element[0].id });
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
				var keyName = key.toLowerCase();
                if (keyName == "class") proxy._mainDiv.addClass(value);
                else if (keyName == "readonly") proxy.model.readOnly = value;
                else if (keyName == "disabled" && value == "disabled") proxy._enabledAction(false);
                else if (keyName == "style") proxy._mainDiv.attr(key, value);
				else if (ej.isValidAttr(proxy.element[0], key)) proxy.element.attr(key, value);
                else proxy._mainDiv.attr(key, value)
            });
        },

        _changeSkin: function (skin) {
            if (this.model.cssClass != skin) {
                this._mainDiv.removeClass(this.model.cssClass).addClass(skin);
            }
        },

        _enabledAction: function (flag) {
            if (flag) {
                this._mainDiv.removeClass("e-disable");
				this.element.removeAttr("disabled");
            }
            else {
                this._mainDiv.addClass("e-disable");
				this.element.attr("disabled","disabled");
            }
        },

        _validation: function () {
            if (this.model.incrementStep < 1) {
                this.model.incrementStep = 1;
            }
            else if (this.model.incrementStep > this.model.maxValue) {
                this.model.incrementStep = this.model.maxValue;
            }
        },

        _createReset: function () {
            if (this._mainDiv.find("div.e-reset").length <= 0)
                ej.buildTag("div.e-reset", "", { width: this.model.shapeWidth + "px", height: this.model.shapeHeight, title: "Reset" }, { role: "button", "aria-label": "reset", "aria-hidden": false }).appendTo(this._mainDiv);
            else
                this._mainDiv.find("div.e-reset").show();
        },

        _renderShape: function () {
            var _shapeCount = Math.round(this.model.maxValue / this.model.incrementStep);
            var _startCount = Math.round(this.model.minValue / this.model.incrementStep);
            var containerWith, containerHeight;
            if (this.model.orientation == ej.Rating.Orientation.Horizontal) {
                containerWith = (_shapeCount + 1) * this.model.shapeWidth;
                containerHeight = this.model.shapeHeight;
            } else if (this.model.orientation == ej.Rating.Orientation.Vertical) {
                containerWith = this.model.shapeWidth;
                containerHeight = this.model.shapeHeight * _shapeCount;
            }
            if (_shapeCount > 0) {
                var _ulTag = ej.buildTag("ul.e-ul", "", { width: containerWith + "px", height: containerHeight }, {});
                for (var i = _startCount ; i < _shapeCount; i++) {
                    var _liTag = ej.buildTag("li.e-shape-list", "", { width: this.model.shapeWidth + "px", height: this.model.shapeHeight }, { tabindex: -1, "aria-describedby": this.element.prop("id") + "_tooltip" });
                    ej.buildTag("div.e-shape inactive", "", { width: this.model.shapeWidth + "px", height: this.model.shapeHeight }).appendTo(_liTag);
                    _liTag.appendTo(_ulTag);
                }
                _ulTag.appendTo(this._mainDiv);
            }
        },

        _initCurrentValue: function () {
            if (ej.isNullOrUndefined(this.value()) || this.value() == "" || this.value() == 0)
                this._CurrentIndex = 0;
            else if (this.value() > this.model.minValue) {
                var count = (this.value() / this.model.incrementStep) - (this.model.minValue / this.model.incrementStep);
                this._CurrentIndex = count;
                this._valueRefresh(this._CurrentIndex);
                for (var i = 0; i < count; i++) {
                    if (this._shapes[i]) {
                        $(this._shapes[i]).removeClass('inactive').removeClass('active').addClass('selected');
                    }
                    else {
                        this._CurrentIndex = i;
                        break;
                    }
                }
            }
            this.value(this._CurrentIndex * this.model.incrementStep + this.model.minValue);
        },

        _valueRefresh: function (index) {
            index = Math.ceil(index);
            var value = (this.value() / this.model.incrementStep).toFixed(1);
            if (this.model.orientation == ej.Rating.Orientation.Horizontal) {
                var len;
                if (this.model.precision == "exact")
                    len = (value % 1).toFixed(1);
                else if (this.model.precision == "half")
                    len = (value % 1 > 0.5) ? 1 : 0.5;
                else
                    len = 1;
                value = ((value % 1).toFixed(1) != 0 ? len : (value / this._CurrentIndex)) * this.model.shapeWidth;
                for (var i = 0; i < index; i++) {
                    $(this._shapes[i]).css({ width: this.model.shapeWidth + "px" });
                }
                if (this._shapes != null)
                    $(this._shapes[index - 1]).css({ width: value + "px" });
            }
            else {
                value = ((value % 1).toFixed(1) != 0 ? (value % 1).toFixed(1) : (value / this._CurrentIndex)) * this.model.shapeHeight;
                for (var i = 0; i < index; i++) {
                    $(this._shapes[i]).css({ height: this.model.shapeHeight + "px" });
                }
                if (this._shapes != null) $(this._shapes[index - 1]).css({ height: value + "px" });
            }
        },


        _reset: function () {
            if (!this.model.enabled) return false;
            $(this._shapes).removeClass('active').removeClass('selected').addClass('inactive');
            this._prevValue = this.value();
            this.value(0);
            this._CurrentIndex = 0;
            //Update Hidden field
            this._currValue = this.value();
            this.element.value = this._currValue;
            this._valueChanged();
        },

        _fillExactPrecision: function (element, position) {
            var index = this._shapes.index(element) + (this.model.minValue / this.model.incrementStep) + 1;
            var option = this.model;
            if (option.orientation == ej.Rating.Orientation.Horizontal) {
                for (var i = 0; i < this._shapes.length; i++) {
                    if (i < index)
                        $(this._shapes[i]).css({ width: option.shapeWidth + "px" });
                    else
                        $(this._shapes[i]).css({ width: "0px" });
                }
                //Set width and title
                $(element).css({ width: position + "px" });
                this.toolTipValue = ((index - 1) * option.incrementStep + (position / option.shapeWidth) * option.incrementStep).toFixed(1);
            }
            else {
                for (var i = 0; i < index; i++) {
                    $(this._shapes[i]).css({ height: option.shapeHeight + "px" });
                }
                for (var i = index; i < this._shapes.length; i++) {
                    $(this._shapes[i]).css({ height: "0px" });
                }
                //Set width and title
                $(element).css({ height: position + "px" });
                this.toolTipValue = ((index - 1) * option.incrementStep + (position / option.shapeHeight) * option.incrementStep).toFixed(1);
            }
        },


        _fillHalfPrecision: function (element, position) {
            var index = this._shapes.index(element) + (this.model.minValue / this.model.incrementStep) + 1;
            var options = this.model;
            if (options.orientation == ej.Rating.Orientation.Horizontal) {
                for (var i = 0; i < this._shapes.length; i++) {
                    if (i < index)
                        $(this._shapes[i]).css({ width: options.shapeWidth + "px" });
                    else
                        $(this._shapes[i]).css({ width: "0px" });
                }
                if (position < this.model.shapeWidth/2) {
                    position = options.shapeWidth / 2;
                    $(element).css({ width: position + "px" });
                    this.toolTipValue = ((index - 1) * options.incrementStep + (position / options.shapeWidth) * options.incrementStep).toFixed(1);
                }
                else {
                    position = options.shapeWidth;
                    $(element).css({ width: position + "px" });
                    this.toolTipValue = ((index - 1) * options.incrementStep + (position / options.shapeWidth) * options.incrementStep).toFixed(1);
                }
            }
            else {
                for (var i = 0; i < this._shapes.length; i++) {
                    if (i < index)
                        $(this._shapes[i]).css({ height: this._starHeight + "px" });
                    else
                        $(this._shapes[i]).css({ height: "0px" });
                }
                //Set width and title
                if (position <= options.shapeHeight / 2) {
                    position = options.shapeHeight / 2;
                    $(element).css({ height: position + "px" });
                    this.toolTipValue = ((index - 1) * options.incrementStep + (position / options.shapeHeight) * options.incrementStep).toFixed(1);
                }
                else {
                    position = options.shapeHeight;
                    $(element).css({ height: position + "px" });
                    this.toolTipValue = ((index - 1) * options.incrementStep + (position / options.shapeHeight) * options.incrementStep).toFixed(1);
                }
            }
        },

        _fillFullPrecision: function (element) {
            var index = this._shapes.index(element) + (this.model.minValue / this.model.incrementStep) + 1;
            var option = this.model;
            if (option.orientation == ej.Rating.Orientation.Horizontal) {
                for (var i = 0; i < this._shapes.length; i++) {
                    if (i < index)
                        $(this._shapes[i]).css({ width: option.shapeWidth + "px" });
                    else
                        $(this._shapes[i]).css({ width: "0px" });
                }
                $(element).css({ width: option.shapeWidth + "px" });
				this.toolTipValue = (this.model.minValue + (this._shapes.index(element) + 1)) * this.model.incrementStep;
            }
            else {
                for (var i = 0; i < this._shapes.length; i++) {
                    if (i < index)
                        $(this._shapes[i]).css({ height: option.shapeHeight + "px" });
                    else
                        $(this._shapes[i]).css({ height: "0px" });
                }
                $(element).css({ height: option.shapeHeight + "px" });
				this.toolTipValue = (this.model.minValue + (this._shapes.index(element) + 1)) * this.model.incrementStep;
            }
        },

        _ClickHandler: function (e) {
            //Check if stars and rate it
            if (this.model.enabled) {
                var element;
                if (e.target.tagName == "LI")
                    element = e.target.firstChild;
                else if (e.target.parentNode.tagName == "LI")

                    element = e.target;
                if (element) {
                    var index = this._shapes.index(element) + 1;
                    for (var i = 0; i < index; i++) {
                        if (this._shapes[i]) {
                            $(this._shapes[i]).removeClass('inactive').removeClass('active').addClass('selected');
                        }
                    }
                    this._prevValue = this.value();
                    this._CurrentIndex = index;
                    index = index + (this.model.minValue / this.model.incrementStep);
                    var _IncrementStep = this.model.incrementStep;

                    if (this.model.orientation == ej.Rating.Orientation.Horizontal)
                        this._currValue = ((index - 1) * _IncrementStep + (element.clientWidth / this.model.shapeWidth) * _IncrementStep).toFixed(1);
                    else
                        this._currValue = ((index - 1) * _IncrementStep + (element.clientHeight / this.model.shapeHeight) * _IncrementStep).toFixed(1);
                    this.element.value = this._currValue;
                    this.value(parseFloat(this._currValue));
                    this._trigger("click", { event: e, value: this.value(), prevValue: this._prevValue });
                    this._valueChanged();
                }
                //Check if reset button and reset
                if ($(e.target).hasClass('e-reset')) {
                    this._reset();
                }
            }
        },

        _MouseOverHandler: function (e) {
            if (this.model.enabled) {
                var element, target = e.target;
                if (e.type == 'touchmove') {
                    var coor = e.originalEvent.changedTouches[0];
                    target = document.elementFromPoint(coor.pageX, coor.pageY);
                }
                if (target.tagName == "LI")
                    element = target.firstChild;
                else if (target.parentNode.tagName == "LI")
                    element = target;
                else
                    return false;
                var index = this._shapes.index(element) + 1;
                for (var i = 0; i <= this._shapes.length; i++) {
                    if (this._shapes[i]) {
                        if (i < index)
                            $(this._shapes[i]).removeClass('inactive').removeClass('selected').addClass('active');
                        else
                            $(this._shapes[i]).removeClass('active').removeClass('selected').addClass('inactive');
                    }
                }
                this._trigger("mouseover", { event: e, index: index, value: this.value() });
            }
        },

        _MouseOutHandler: function (e) {
            if (!this.model.readOnly && this.model.enabled) {
                var index = this._CurrentIndex;
                if (index != 0) {
                    for (var i = 0; i < this._shapes.length; i++) {
                        if (this._shapes[i]) {
                            if (i < index)
                                $(this._shapes[i]).removeClass('active').removeClass('inactive').addClass('selected');
                            else
                                $(this._shapes[i]).removeClass('active').addClass('inactive');
                        }
                    }
                } else
                    $(this._shapes).removeClass('active').addClass('inactive');
                //On mouse out, keep selected the stars w.r.t current Value
                this._valueRefresh(index);
                this._trigger("mouseout", { event: e, value: this.value() });
            }
            //this._hideTooltip(1000);
        },

        _MouseMoveHandler: function (e) {
            if (!this.model.readOnly && this.model.enabled) {
                var element, position, target = e.target;
                if (e.type == 'touchmove') {
                    var coor = e.originalEvent.changedTouches[0];
                    target = document.elementFromPoint(coor.pageX, coor.pageY);
                }
                if (target.tagName == "LI")
                    element = target.firstChild;
                else if (target.parentNode.tagName == "LI")
                    element = target;
                else
                    return false;
                if (this.model.orientation == ej.Rating.Orientation.Horizontal) {
                    if (ej.isNullOrUndefined(e.offsetX))
                        position = e.pageX - $(target).offset().left;
                    else
                        position = e.offsetX + 1;
                } else {
                    if (ej.isNullOrUndefined(e.offsetY))
                        position = e.pageY - $(target).offset().top;
                    else
                        position = e.offsetY + 1;
                }
                if (this.model.precision == ej.Rating.Precision.Exact)
                    this._fillExactPrecision(element, position);
                else if (this.model.precision == ej.Rating.Precision.Half)
                    this._fillHalfPrecision(element, Math.round(position));
                else this._fillFullPrecision(element);
            } else {
                this.toolTipValue = (this.value() == null || this.value() == "" ? 0 : this.value()) + ' / ' + this.model.maxValue;
            }
            $(e.target).attr("aria-label", this.toolTipValue);
            if (this.model.showTooltip && parseFloat(this.model.maxValue) >= parseFloat(this.toolTipValue)) {
                var tipObj = $(this._mainDiv).data("ejTooltip");
                tipObj._setModel({ content: this.toolTipValue });
            }
            this._trigger("mousemove", { event: e, value: this.toolTipValue });
                
        },
        
        _renderTooltip: function () {
            var proxy = this;
            if (this.model.showTooltip) {

                var position = { target: { horizontal: "center", vertical: "top" }, stem: { horizontal: "center", vertical: "bottom" } };
                if (this.model.orientation == ej.Rating.Orientation.Vertical)
                    position = { target: { horizontal: "right", vertical: "center" }, stem: { horizontal: "left", vertical: "center" } };

                var tipObj = $(this._mainDiv).ejTooltip({
                    target: ".e-shape-list",
                    content: this.value(),
                    isBalloon: false,
                    collision: "flip",
                    position: position,
                    showRoundedCorner: true,
                    cssClass: this.model.cssClass,
                    beforeOpen: function (args) {
                        proxy._updateTooltipValue(args);

                    }
                }).data("ejTooltip");

                $(tipObj.tooltip).css({ "min-width": "auto" });
            }
        },

        
        _updateTooltipValue: function (args) {
            var tipObj = $(this._mainDiv).data("ejTooltip");
            tipObj._setModel({ content: this.toolTipValue });
            tipObj.show(args.event.target);
            args.cancel = true;
        },

        _wireEvents: function () {
            if (!this.model.readOnly) {
                this._on(this._mainDiv, "mousedown", this._ClickHandler);
                this._on(this._mainDiv.find("li"), "mouseenter touchmove", this._MouseOverHandler);
            }
            this._on(this._mainDiv.find("li"), "mouseleave touchend", this._MouseOutHandler);
            this._on(this._mainDiv.find("li"), ej.eventType.mouseMove, this._MouseMoveHandler);

        },

        _unWireEvents: function () {
            this._mainDiv.find("li").off("mouseenter touchmove");
            this._mainDiv.find("li").off("mouseleave touchend");
            this._mainDiv.off("mousedown");
            if (this.model.precision !== ej.Rating.Precision.Full) {
			    this._mainDiv.find("li").off(ej.eventType.mouseMove);			
            }
        },

        _valueChanged: function () {
            this.element.val(this.value());
            if (this._prevValue != this._currValue)
                this._trigger("change", { value: this.value(), prevValue: this._prevValue });
        },

        reset: function () {
            this._reset();
        },

        show: function () {
            if (!this.model.enabled) return false;
            this._mainDiv.css("visibility", "visible");
        },

        hide: function () {
            if (!this.model.enabled) return false;
            this._mainDiv.css("visibility", "hidden");
        },

        _showResetButton: function () {
            if (!this.model.enabled) return false;
            this._createReset();
        },

        _hideResetButton: function () {
            if (!this.model.enabled) return false;
            this._mainDiv.find("div.e-reset").hide()
        },

        getValue: function () {
            return this.value() == null || this.value() === "" ? "" : this.value();
        },

        setValue: function (value) {
            if (value != null && value != "null") {
                if (this.model.maxValue < value)
                    value = this.model.maxValue;
                else if (this.model.minValue > value)
                    value = this.model.minValue;
                this.value(value);
                $(this._shapes).removeClass('selected').addClass('inactive');
                this._initCurrentValue();
                this.element.val(this.value());
            }
        },

        refresh: function () {
            this._destroy();
            this._unWireEvents();
            this._initialize();
        }
    });

    ej.Rating.Precision = {
        /**  Allows user select full shape of Rating. */
        Full: "full",
        /**  Allows user select half shape of Rating. */
        Half: "half",
        /**  Allows user select exact shape of Rating. */
        Exact: "exact"
    };

    ej.Rating.Orientation = {
        /**  Renders Rating control in horizontal direction. */
        Horizontal: "horizontal",
        /**  Renders Rating control in vertical direction. */
        Vertical: "vertical"
    };
})(jQuery, Syncfusion);