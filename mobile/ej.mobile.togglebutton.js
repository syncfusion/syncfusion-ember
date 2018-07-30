
(function ($, ej, undefined) {

    ej.widget("ejmToggleButton", "ej.mobile.ToggleButton", {
        _setFirst: true,
        _rootCSS: "e-m-tbutton",
        defaults: {
            cssClass: "",
            toggleState: true,
            renderMode: "auto",
            touchStart: null,
            touchEnd: null,
            change: null,
            enabled: true,
            enablePersistence: false
        },
        dataTypes: {
            toggleState: "boolean",
            enabled: "boolean",
            enablePersistence: "boolean"
        },

        _init: function () {
            this._renderControl();
            this._createDelegates();
            this._wireEvents(false);
            (this.model.enabled) ? this.enable() : this.disable();
        },

        _renderControl: function () {
        ej.setRenderMode(this);
        var modelobj = this.model;
        var element = this.element;
        element.addClass('e-m-tbutton' + " " + modelobj.cssClass + " " + 'e-m-' + modelobj.renderMode);
        this._input = ej.buildTag("input", {}, {}, { "name": $(element).attr('id'), "type": "checkbox", "data-role": "none" });
        var input = this._input;
        this._slider = ej.buildTag("div.e-m-tslider");
        var slider = this._slider;
        if (modelobj.toggleState) {
            input.attr('checked', 'checked').attr("value", true);
            slider.addClass("e-m-state-active");
            element.addClass("e-m-state-active");
            this._onState();
        }
        else  
        {
            input.attr("value", false)
            this._offState();
        }
        element.append(input).append(slider);
    }, 

        _createDelegates: function () {
            this._touchStartHandler = $.proxy(this._touchStart, this);
            this._touchEndHandler = $.proxy(this._touchEnd, this);
            this._touchMoveHandler = $.proxy(this._touchMove, this);
        },

        _wireEvents: function (remove) {
            this._createDelegates();
            ej.listenTouchEvent(this.element, ej.startEvent(), this._touchStartHandler, remove);
        },

        _touchStart: function (evt) {
            ej.blockDefaultActions(evt);
            var point = evt.touches ? evt.touches[0] : evt;
            this._startPoint = point.pageY;
            var slider = this._slider;
            var element = this.element;
            this.maxMove = element.width() - slider.width();
            var modelobj = this.model;
            this._flag = true;
            this._startstate = modelobj.toggleState;
            this._startTime = evt.timeStamp || Date.now();
            this._startPos = evt.pageX;
            if (ej.isTouchDevice()) evt =point;
            if(modelobj.renderMode == "windows"||modelobj.renderMode == "flat")  this.maxMove = this.maxMove - 5;
            slider.addClass("e-m-touchactive");
            this._position = { x: evt.pageX, y: evt.pageY };
            this.startValue = this._getNormalValue(this._position);
            this._handleX = slider.offset().left - element.offset().left;
            ej.listenEvents([document, document], [ej.endEvent(), ej.moveEvent()], [this._touchEndHandler, this._touchMoveHandler], false);
            var data = { state: modelobj.toggleState };
            if (modelobj.touchStart) this._trigger("touchStart", data);
        },

        _touchMove: function (evt) {
            ej.blockDefaultActions(evt);
            this._endPoint = (evt.touches ? evt.touches[0] : evt).pageY;
            if (this._startPoint != this._endPoint) {
                var modelobj = this.model;
                this._flag = false;
                if (ej.isTouchDevice()) evt = evt.touches ? evt.touches[0] : evt;
                this._position = { x: evt.pageX, y: evt.pageY };
                this._curValue = (this._getNormalValue(this._position)) - this.startValue;
                var curValue = this._curValue;
                var transformValue =curValue + this._handleX;
                this._endTime = evt.timeStamp || Date.now();
                this._endPos = evt.pageX;
                if (modelobj.renderMode == "flat" || modelobj.renderMode == "windows") {
                    if (transformValue >= 0 && transformValue <= this.maxMove) {
                         this._translateContent(this._slider, transformValue+2);
                    }
                }
                else (transformValue < this.maxMove / 2) ? this._offState() : this._onState();
            }
        },

        _touchEnd: function (evt) {
            ej.blockDefaultActions(evt);
            var slider = this._slider;
            var element = this.element;
            slider.removeClass("e-m-touchactive");
            var modelobj = this.model;
            ej.listenEvents([document, document], [ej.endEvent(), ej.moveEvent()], [this._touchEndHandler, this._touchMoveHandler], true);
            if (ej.isTouchDevice()) evt = evt.changedTouches ? evt.changedTouches[0] : evt;
            var endX = slider.offset().left - element.offset().left;
            this._delTime = this._endTime - this._startTime;
            this._delPos = (this._startstate) ? -(this._endPos - this._startPos) : (this._endPos - this._startPos);
            if ((modelobj.renderMode === 'ios7' || modelobj.renderMode === 'windows') && this._delTime < 300 && this._delPos > 10) (this._startstate) ? this._offState() : this._onState();
            else {
                if (!this._flag) ((endX < this.maxMove / 2) ? this._offState() : this._onState());
                else ((slider.hasClass("e-m-state-active")) ? this._offState() : this._onState());
            }
            if (this._input.attr("checked")) {
                slider.addClass("e-m-state-active");
                element.addClass("e-m-state-active");
            }
            else {
                slider.removeClass("e-m-state-active");
                element.removeClass("e-m-state-active");
            }
            var data = { state: modelobj.toggleState };
            if (modelobj.touchEnd) this._trigger("touchEnd", data);
            if (modelobj.change) {
                if (this._startstate != modelobj.toggleState)
                    this._trigger("change", data);
            }
        },

        _getNormalValue: function (position) {
            var currentLOB, currentLOBPercent, totalValue, currentValue; //currentLOT = current left or bottom
            currentLOB = position.x - this.element.offset().left;
            currentLOBPercent = (currentLOB / this.element[0].offsetWidth);
            totalValue = this.element.width();
            currentValue = currentLOBPercent * totalValue;
            return this._trimValue(currentValue);
        },

        _trimValue: function (value) {
            var step = 1;
            var stepModValue = (value) % step;
            var correctedValue = value - stepModValue;
            if (Math.abs(stepModValue) * 2 >= step) correctedValue += (stepModValue > 0) ? step : (-step);
            return parseFloat(correctedValue.toFixed(5));
        },

        _offState: function () {
            var modelobj = this.model;
            var slider = this._slider;
            modelobj.toggleState = false;
            this._input.removeAttr('checked', 'checked').attr("value", false);
            this._translateContent(slider, 0);
            slider.removeClass("e-m-state-active");
            this.element.removeClass("e-m-state-active");
        },

        _onState: function () {
            var modelobj = this.model;
            var slider = this._slider;
            modelobj.toggleState = true;
            this._input.attr('checked', 'checked').attr("value", true);
            var transValue = (modelobj.renderMode == "flat" || modelobj.renderMode == "windows") ? 43 : 49;
            this._translateContent(slider, transValue);
            slider.addClass("e-m-state-active");
            this.element.addClass("e-m-state-active");
            if (modelobj.renderMode == "ios7" || modelobj.renderMode == "android") this._translateContent(slider, 22);
        },

        _translateContent: function (element, transvalue) {
            element[0].style[ej.transform] = "translateX(" + transvalue + "px)";
        },

        _setModel: function (options) {
            var refresh;
            for (var key in options)
                switch (key) {
                    case "renderMode": (options.renderMode == "auto") ? ej.setRenderMode(this) : this.model.renderMode = options.renderMode;
                        refresh = true;
                        break;
                    case "toggleState":(this.model.toggleState) ? this._onState() : this._offState(); break;
                    case "enabled": options.enabled ? this.enable() : this.disable(); break;
                }
            if (refresh) this._refresh();
        },

        _refresh: function () {
            this._clearElement();
            this._renderControl();
            this._wireEvents();
        },

        _clearElement: function () {
            this._wireEvents(true);
            this.element.removeAttr("class");
            this.element.removeAttr("style");
            this.element.html("");
        },

        _destroy: function () {
            this._clearElement();
        },

        /*---------------Public Methods---------------*/

        disable: function () {
            this.element.addClass("e-m-state-disabled");
            this._wireEvents(true);
            this.model.enabled = false;
        },

        enable: function () {
            this.element.removeClass("e-m-state-disabled");
            this._wireEvents(false);
            this.model.enabled = true;
        }
        /*---------------Public Methods End---------------*/

    });

})(jQuery, Syncfusion);