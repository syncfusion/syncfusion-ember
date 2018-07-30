"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function ($) {
    var ejTooltip = (function (_super) {
        __extends(ejTooltip, _super);
        function ejTooltip(element, options) {
            _super.call(this);
            this._rootCSS = "e-tooltip";
            this._setFirst = false;
            this.PluginName = "ejTooltip";
            this.id = "null";
            this.model = null;
            this.defaults = {
                height: "auto",
                width: "auto",
                enabled: true,
                content: null,
                containment: "body",
                target: null,
                title: null,
                closeMode: "none",
                autoCloseTimeout: 4000,
                position: {
                    stem: { horizontal: "center", vertical: "bottom" },
                    target: { horizontal: "center", vertical: "top" }
                },
                associate: "target",
                collision: "flipfit",
                showShadow: false,
                cssClass: null,
                animation: {
                    effect: "none",
                    speed: 0
                },
                isBalloon: true,
                showRoundedCorner: false,
                enableRTL: false,
                allowKeyboardNavigation: true,
                tip: {
                    size: {
                        width: 20,
                        height: 10
                    },
                    adjust: {
                        xValue: 0,
                        yValue: 0
                    }
                },
                trigger: "hover",
                create: null,
                click: null,
                destroy: null,
                hover: null,
                tracking: null,
                beforeOpen: null,
                beforeClose: null,
                open: null,
                close: null,
            };
            this.dataTypes = {
                enabled: "boolean",
                closeMode: "enum",
                autoCloseTimeout: "number",
                trigger: "enum",
                position: {
                    stem: "data",
                    target: "data"
                },
                associate: "enum",
                collision: "enum",
                showShadow: "boolean",
                animation: {
                    effect: "enum",
                    speed: "number"
                },
                isBalloon: "boolean",
                showRoundedCorner: "boolean",
                enableRTL: "boolean",
                allowKeyboardNavigation: "boolean",
                tip: {
                    size: {
                        width: "number",
                        height: "number"
                    },
                    adjust: {
                        xValue: "number",
                        yValue: "number"
                    }
                }
            };
            this.isTrack = true;
            this._isCancel = false;
            this._isHidden = true;
            this.arrowValue = { left: 0, top: 0, width: 0, height: 0, display: null };
            this.tooltipPos = { width: 0, height: 0, left: 0, top: 0, bottom: 0, right: 0, position: "absolute" };
            this.targetPos = { width: 0, height: 0, left: 0, top: 0, bottom: 0, right: 0, position: "absolute" };
            this.mouseTimer = null;
            this.positionTarget = null;
            this.positionTooltip = null;
            this.containerSize = null;
            this._createTitle = function () {
                this.tooltipTitle = ej.buildTag('div.e-def e-header', " ", {}, {});
                this.tooltipHeader = ej.buildTag('div', " ", {}, {});
                $(this.tooltipTitle).html(this.model.title).appendTo(this.tooltipHeader);
            };
            if (element) {
                if (!element["jquery"]) {
                    element = $("#" + element);
                }
                if (element.length) {
                    return $(element).ejTooltip(options).data(this.PluginName);
                }
            }
        }
        ejTooltip.prototype.setModel = function (opt, forceSet) {
            this.setModel(opt, forceSet);
        };
        ejTooltip.prototype.option = function (opt, forceSet) {
            this.option(opt, forceSet);
        };
        ejTooltip.prototype.triggerEvents = function (eventName, eventProp) {
            var temp;
            switch (eventName) {
                case "click":
                    var clickArg = eventProp;
                    temp = this._trigger(eventName, clickArg);
                    break;
                case "hover":
                    var hoverArg = eventProp;
                    temp = this._trigger(eventName, hoverArg);
                    break;
                case "tracking":
                    var trackArg = eventProp;
                    temp = this._trigger(eventName, trackArg);
                    break;
                case "beforeOpen":
                    var beforeOpenArg = eventProp;
                    temp = this._trigger(eventName, beforeOpenArg);
                    break;
                case "open":
                    var openArg = eventProp;
                    temp = this._trigger(eventName, openArg);
                    break;
                case "beforeClose":
                case "close":
                    var closeArg = eventProp;
                    temp = this._trigger(eventName, closeArg);
                    break;
            }
            return temp;
        };
        ejTooltip.prototype.enable = function (val) {
            if (this.tooltip.hasClass("e-disable")) {
                this.model.enabled = true;
                this.tooltip.removeClass("e-disable");
            }
        };
        ejTooltip.prototype.disable = function (val) {
            if (!this.tooltip.hasClass("e-disable")) {
                this.model.enabled = false;
                this.tooltip.addClass("e-disable");
            }
        };
        ejTooltip.prototype.show = function (targetElement, func) {
            if (this.model.enabled) {
                if (ej.isNullOrUndefined(targetElement)) {
                    var target = (this.model.target == null) ? this.element : $(this.element).find(this.model.target + ":first");
                    this._positionElement(target);
                }
                else {
                    this._positionElement(targetElement);
                }
                if (!ej.isNullOrUndefined(func)) {
                    if (typeof func === "string") {
                        $(this.tooltip).show(func);
                    }
                    else {
                        if (typeof func === "function") {
                            func.call.apply(this.tooltip);
                        }
                    }
                }
                else {
                    this._showTooltip();
                }
            }
        };
        ejTooltip.prototype.hide = function (func) {
            if (this.model.enabled) {
                if (!ej.isNullOrUndefined(func)) {
                    if (typeof func === "string") {
                        $(this.tooltip).hide(func);
                    }
                    else if (typeof func === "function") {
                        func.call.apply(this.tooltip);
                    }
                }
                else {
                    this._hideTooltip();
                }
            }
        };
        ejTooltip.prototype._destroy = function () {
            this.mouseTimer && clearTimeout(this.mouseTimer);
            this.timer && clearTimeout(this.timer);
            $(this.tooltip).remove();
            this.tooltip = null;
        };
        ejTooltip.prototype._setModel = function (options) {
            var option;
            for (option in options) {
                switch (option) {
                    case "height":
                        this._setHeight(options[option]);
                        break;
                    case "width":
                        this._setWidth(options[option]);
                        break;
                    case "enabled":
                        this._enabled(options[option]);
                        break;
                    case "content":
                        this._setContent(options[option]);
                        break;
                    case "title":
                        this.model.title = options[option];
                        if (this.model.title == null) {
                            $(this.tooltipHeader).remove();
                            this.tooltipHeader = null;
                            this.tooltipTitle = null;
                            if (this.model.closeMode === ej.Tooltip.CloseMode.Sticky)
                                this._iconRender();
                        }
                        else
                            (ej.isNullOrUndefined(this.tooltipHeader)) ? this._createHeader() : $(this.tooltipTitle).html(this.model.title);
                        this.tooltipPos.height = $(this.tooltip).outerHeight();
                        break;
                    case "associate":
                        this.model.associate = options[option];
                        this._wireMouseEvents(false);
                        this._wireMouseEvents(true);
                        break;
                    case "position":
                        this._setPosition(options[option]);
                        break;
                    case "collision":
                        this.model.collision = options[option];
                        break;
                    case "closeMode":
                        if (typeof options[option] !== "undefined") {
                            this.model.closeMode = options[option];
                            if (this.model.closeMode == ej.Tooltip.CloseMode.Sticky)
                                this._iconRender();
                            else {
                                $(this.tooltipClose).remove();
                                this.tooltipClose = null;
                            }
                            this.tooltipPos.height = $(this.tooltip).outerHeight();
                        }
                        break;
                    case "cssClass":
                        this._setSkin(options[option]);
                        break;
                    case "showShadow":
                        this._shadowEffect(options[option], this.model.position);
                        break;
                    case "isBalloon":
                        if (!ej.isNullOrUndefined(options[option])) {
                            this.model.isBalloon = options[option];
                            if (!this.model.isBalloon) {
                                $(this.tip).remove();
                                this.tip = null;
                            }
                            else
                                this._renderArrow();
                        }
                        break;
                    case "animation":
                        var val = options[option];
                        this.model.animation = $.extend(true, this.model.animation, val);
                        if (this.model.animation.effect != ej.Tooltip.Effect.None) {
                            this._off($(this.tooltip), "mouseenter", this._onTooltipMouseEnter);
                            this._off($(this.tooltip), "mouseleave", this._onTooltipMouseLeave);
                        }
                        else if (this.model.animation.effect == ej.Tooltip.Effect.None) {
                            this._on($(this.tooltip), "mouseenter", this._onTooltipMouseEnter);
                            this._on($(this.tooltip), "mouseleave", this._onTooltipMouseLeave);
                        }
                        break;
                    case "enableRTL":
                        this._setRTL(options[option]);
                        break;
                    case "target":
                        this._wireTriggerEvents(false);
                        this.model.target = options[option];
                        this._wireTriggerEvents(true);
                        this._renderTarget();
                        break;
                    case "trigger":
                        this._setTrigger(options[option]);
                        break;
                    case "showRoundedCorner":
                        this.model.showRoundedCorner = options[option];
                        this._roundedCorner(options[option]);
                        break;
                    case "allowKeyboardNavigation":
                        this.model.allowKeyboardNavigation = options[option];
                        if (!this.model.allowKeyboardNavigation) {
                            this._off($(window), "keydown", this._keyDown);
                        }
                        else {
                            this._on($(window), "keydown", this._keyDown);
                        }
                        break;
                }
            }
        };
        ejTooltip.prototype._enabled = function (val) {
            (val) ? this.enable(val) : this.disable(val);
            this.model.enabled = val;
        };
        ejTooltip.prototype._shadowEffect = function (val, position) {
            this.model.showShadow = val;
            var shadowEffect = null;
            $(this.tooltip).removeClass("e-tooltipShadowLeft e-tooltipShadowRight");
            if (this.model.showShadow) {
                if (this.model.isBalloon) {
                    switch (position.stem.horizontal) {
                        case "center":
                            shadowEffect = (position.stem.vertical == "top") ? "e-tooltipShadowLeft" : (position.stem.vertical == "bottom") ? "e-tooltipShadowRight" : "e-tooltipShadowLeft";
                            break;
                        case "right":
                            shadowEffect = (position.target.horizontal == "center" && position.stem.vertical == "top") ? "e-tooltipShadowLeft" : "e-tooltipShadowRight";
                            break;
                        case "left":
                            shadowEffect = (position.target.horizontal == "center" && position.stem.vertical == "bottom") ? "e-tooltipShadowRight" : "e-tooltipShadowLeft";
                            break;
                    }
                }
                else
                    shadowEffect = "e-tooltipShadowLeft";
                $(this.tooltip).addClass(shadowEffect);
            }
        };
        ejTooltip.prototype._setContent = function (val) {
            this.model.content = val;
            $(this.tooltipContent).html(this.model.content);
            this.tooltipPos.height = $(this.tooltip).outerHeight();
            this.tooltipPos.width = $(this.tooltip).outerWidth();
        };
        ejTooltip.prototype._setPosition = function (val) {
            this.model.position.stem = $.extend(true, this.model.position.stem, val.stem);
            this.model.position.target = $.extend(true, this.model.position.target, val.target);
        };
        ejTooltip.prototype._setTrigger = function (val) {
            this._wireTriggerEvents(false);
            this.model.trigger = val;
            this._wireTriggerEvents(true);
        };
        ejTooltip.prototype._init = function () {
            this.id = this.element[0].id;
            this.positionTarget = $.extend(true, {}, this.model.position.target);
            this.positionTooltip = $.extend(true, {}, this.model.position.stem);
            this.tipSize = $.extend(true, {}, this.model.tip.size);
            this._initialize();
            this._render();
            this.enable(this.model.enabled);
            this._wireEvents(true);
        };
        ejTooltip.prototype._initialize = function () {
            if (ej.isNullOrUndefined(this.model.target)) {
                if (ej.isNullOrUndefined(this.model.content) && (!ej.isNullOrUndefined(this.element.attr("title")))) {
                    this.model.content = this.element.attr("title");
                    this.element.attr("data-content", this.model.content);
                    this.element.removeAttr("title");
                }
            }
            else
                this._renderTarget();
        };
        ejTooltip.prototype._wireEvents = function (val) {
            var wire = (val) ? "_on" : "_off";
            this._wireTriggerEvents(val);
            if (this.model.allowKeyboardNavigation)
                this[wire]($(window), "keydown", this._keyDown);
            (this.model.target != null) ? this[wire](this.element, "scroll", this.model.target, this._hideTooltip) : this[wire](this.element, "scroll", this._hideTooltip);
            this[wire]($(this.tooltip), "mouseenter", this._onTooltipMouseEnter);
            this[wire]($(this.tooltip), "mouseleave", this._onTooltipMouseLeave);
            this[wire]($(window), "resize", this._hideTooltip);
            this[wire]($(window), "touchend", this._docTouchEndHandler);
        };
        ejTooltip.prototype._wireTriggerEvents = function (val) {
            var wire = (val) ? "_on" : "_off";
            if (this.model.trigger == ej.Tooltip.Trigger.Focus)
                (this.model.target != null) ? this[wire](this.element, "blur", this.model.target, this._hideTooltip) : this[wire](this.element, "blur", this._hideTooltip);
            else
                (this.model.target != null) ? this[wire](this.element, ej.isDevice() ? "touchstart" : "mouseleave", this.model.target, this._onMouseOut) : this[wire](this.element, ej.isDevice() ? "touchstart" : "mouseleave", this._onMouseOut);
            this._wireMouseEvents(val);
            var triggerEvent = (this.model.trigger == ej.Tooltip.Trigger.Click) ? (ej.isDevice() ? "touchstart" : "click") : (this.model.trigger == ej.Tooltip.Trigger.Focus) ? (ej.isDevice() ? "touchstart" : "focus") : (ej.isDevice() ? "touchstart" : "mouseenter");
            (this.model.target != null) ? this[wire](this.element, triggerEvent, this.model.target, this._targetHover) : this[wire](this.element, triggerEvent, this._targetHover);
        };
        ejTooltip.prototype._wireMouseEvents = function (val) {
            var wire = (val) ? "_on" : "_off";
            if (this.model.associate == ej.Tooltip.Associate.MouseEnter || this.model.associate == ej.Tooltip.Associate.MouseFollow)
                (this.model.target != null) ? this[wire](this.element, ej.isDevice() ? "touchstart" : "mousemove", this.model.target, this._tooltipMove) : this[wire](this.element, ej.isDevice() ? "touchstart" : "mousemove", this._tooltipMove);
        };
        ejTooltip.prototype._render = function () {
            this.tooltip = ej.buildTag("div.e-tooltip-wrap e-widget", "", {}, { role: "tooltip", 'aria-readonly': 'true', 'aria-hidden': 'true', 'aria-describedby': this.id + '_content', 'id': this.id + '_Main' });
            this.tooltipInter = ej.buildTag("div.e-tipContainer", "", {}, {});
            this.tooltip.append(this.tooltipInter);
            if (this.model.isBalloon)
                this._renderArrow();
            $(this.model.containment).append(this.tooltip);
            this._setHeight(this.model.height);
            this._setWidth(this.model.width);
            this._createHeader();
            this._tooltipContent();
            if (this.model.cssClass)
                this.tooltip.addClass(this.model.cssClass);
            if (this.model.showRoundedCorner)
                this._roundedCorner(this.model.showRoundedCorner);
            if (this.model.enableRTL)
                this._setRTL(this.model.enableRTL);
            $(this.tooltip).css({ "top": "auto", "left": "auto" });
            this.tooltipPos = { width: $(this.tooltip).outerWidth(), height: $(this.tooltip).outerHeight(), left: $(this.tooltip).offset().left, top: $(this.tooltip).offset().top, position: "absolute" };
            if (ej.isNullOrUndefined(this.model.target)) {
                this._containerCalc(this.element);
                this._positionElement(this.element);
            }
        };
        ejTooltip.prototype._containerCalc = function (target) {
            if (ej.isNullOrUndefined(target))
                target = this.element;
            var containerElement = { left: 0, top: 0 };
            var childElement = $(target).offset();
            this.containerSize = {
                height: (this.model.containment == "body") ? $(window).innerHeight() || document.documentElement.clientHeight || document.body.clientHeight : $(this.model.containment).innerHeight(),
                width: (this.model.containment == "body") ? $(window).innerWidth() || document.documentElement.clientWidth || document.body.clientWidth : $(this.model.containment).innerWidth()
            };
            this.containerSize.left = (this.model.containment != "body") ? ($(this.model.containment).css("position") == "static") ? ($(this.model.containment).offset().left - $(this.model.containment).offsetParent().offset().left) : 0 : 0;
            this.containerSize.top = (this.model.containment != "body") ? ($(this.model.containment).css("position") == "static") ? ($(this.model.containment).offset().top - $(this.model.containment).offsetParent().offset().top) : 0 : 0;
            childElement.left -= (this.model.containment != "body") ? (($(this.model.containment).css("position") == "static") ? $(this.model.containment).offsetParent().offset().left : $(this.model.containment).offset().left) : 0;
            childElement.top -= (this.model.containment != "body") ? (($(this.model.containment).css("position") == "static") ? $(this.model.containment).offsetParent().offset().top : $(this.model.containment).offset().top) : 0;
            this.targetPos.left = childElement.left;
            this.targetPos.top = childElement.top;
        };
        ejTooltip.prototype._setHeight = function (val) {
            this.model.height = val;
            (!isNaN(+val) && isFinite(val)) ? $(this.tooltip).css("height", val + "px") : $(this.tooltip).css("height", val);
            this.tooltipPos.height = $(this.tooltip).outerHeight();
        };
        ejTooltip.prototype._setWidth = function (val) {
            this.model.width = val;
            if (this.model.width != "auto") {
                val = (!isNaN(+val) && isFinite(val)) ? val + "px" : val;
                $(this.tooltip).css("max-width", val);
                $(this.tooltip).css("min-width", "0px");
            }
            $(this.tooltip).css("width", val);
            this.tooltipPos.height = $(this.tooltip).outerHeight();
        };
        ejTooltip.prototype._setRTL = function (val) {
            this.model.enableRTL = val;
            val ? this.tooltip.addClass("e-rtl") : this.tooltip.removeClass("e-rtl");
        };
        ejTooltip.prototype._setSkin = function (skin) {
            if (this.model.cssClass != skin) {
                this.tooltip.removeClass(this.model.cssClass).addClass(skin);
                this.model.cssClass = skin;
            }
        };
        ejTooltip.prototype._roundedCorner = function (val) {
            (this.model.showRoundedCorner) ? this.tooltip.addClass("e-corner") : this.tooltip.removeClass("e-corner");
        };
        ejTooltip.prototype._renderArrow = function () {
            if (ej.isNullOrUndefined(this.tip)) {
                this.tip = ej.buildTag('div.e-arrowTip', " ", { 'id': this.id + "_eTip" }, {});
                $(this.tip).append("<div class='e-arrowTipOuter'></div>").append("<div class='e-arrowTipInner'></div>");
                $(this.tip).insertBefore(this.tooltipInter);
            }
        };
        ejTooltip.prototype._adjustArrow = function (position) {
            var leftValue, topValue, tooltipWidth = $(this.tooltip).width(), tooltipHeight = $(this.tooltip).height();
            var positionTooltip = position.stem, positionTarget = position.target;
            var arrow = { "tipHeight": 0, "tipWidth": 0 };
            if (positionTarget.horizontal == "right" || positionTarget.horizontal == "left") {
                leftValue = (positionTooltip.horizontal == "left") ? -(this.model.tip.size.height) : (positionTooltip.horizontal == "right") ? tooltipWidth : ((tooltipWidth) / 2 - (this.tipSize.width / 2));
                if (positionTooltip.horizontal != "center")
                    topValue = (positionTooltip.vertical == "top") ? 5 : (positionTooltip.vertical == "center") ? ((tooltipHeight / 2) - (this.tipSize.width / 2)) : ((tooltipHeight - 5) - this.tipSize.width);
                else
                    topValue = (positionTooltip.vertical == "top") ? -this.tipSize.height : (positionTooltip.vertical == "bottom") ? tooltipHeight : ((this.tooltipPos.height / 2) - (this.tipSize.width / 2));
                arrow = this._arrowBinding(position, "horizontal");
            }
            else {
                topValue = (positionTooltip.vertical == "top") ? -this.tipSize.height : (positionTooltip.vertical == "bottom") ? tooltipHeight : ((tooltipHeight / 2) - (this.tipSize.width / 2));
                if (positionTooltip.vertical == "center")
                    leftValue = (positionTooltip.horizontal == "left") ? -(this.model.tip.size.height) : tooltipWidth;
                else
                    leftValue = (positionTooltip.horizontal == "left") ? 10 : (positionTooltip.horizontal == "center") ? ((this.tooltipPos.width) / 2 - (this.tipSize.width / 2)) : ((tooltipWidth - 10) - this.tipSize.width);
                arrow = this._arrowBinding(position, "vertical");
            }
            this.arrowValue.left = leftValue;
            this.arrowValue.top = topValue;
            $(this.tip).css({ height: arrow.tipHeight + "px", width: arrow.tipWidth + "px", left: leftValue + "px", top: topValue + "px", display: (positionTooltip.horizontal == "center" && positionTooltip.vertical == "center") ? "none" : "block" });
        };
        ejTooltip.prototype._arrowBinding = function (position, arrowType) {
            var positionTooltip = position.stem, condition = (arrowType == "horizontal") ? (positionTooltip.horizontal != "center") : (positionTooltip.vertical == "center");
            var tipWidth, tipHeight, borderColor = $(this.tooltip).css("border-top-color"), backgroudColor = $(this.tooltip).css("background-color"), arrowOuterSize = this.model.tip.size.height, arrowInterSize = this.model.tip.size.height - 1, arrowCalculation = { "border-top": "none", "border-bottom": "none", "border-right": "none", "border-left": "none" };
            if (condition) {
                tipWidth = this.model.tip.size.height;
                tipHeight = this.model.tip.size.width;
                $(this.tip).find(".e-arrowTipOuter").css(this._arrow(position, arrowOuterSize, borderColor, arrowCalculation, "horizontal"));
                $(this.tip).find(".e-arrowTipInner").css(this._arrow(position, arrowInterSize, backgroudColor, arrowCalculation, "horizontal"));
            }
            else {
                tipWidth = this.model.tip.size.width;
                tipHeight = this.model.tip.size.height;
                $(this.tip).find(".e-arrowTipOuter").css(this._arrow(position, arrowOuterSize, borderColor, arrowCalculation, "vertical"));
                $(this.tip).find(".e-arrowTipInner").css(this._arrow(position, arrowInterSize, backgroudColor, arrowCalculation, "vertical"));
            }
            return { tipHeight: tipHeight, tipWidth: tipWidth };
        };
        ejTooltip.prototype._arrow = function (position, size, color, arrowCalculation, arrowType) {
            var positionTooltip = position.stem, innerLeft = (arrowType == "horizontal") ? (positionTooltip.horizontal == "right") ? "0px" : "1px" : "1px", innerTop = (arrowType == "horizontal") ? "1px" : (positionTooltip.vertical == "bottom") ? "0px" : "1px";
            arrowCalculation["border-top"] = (arrowType == "horizontal") ? size + "px solid transparent" : (positionTooltip.vertical == "bottom") ? (size + "px solid " + color) : "none";
            arrowCalculation["border-bottom"] = (arrowType == "horizontal") ? size + "px solid transparent" : (positionTooltip.vertical == "top") ? (size + "px solid " + color) : "none";
            arrowCalculation["border-right"] = (arrowType == "horizontal") ? (positionTooltip.horizontal == "left") ? (size + "px solid " + color) : "none" : size + "px solid transparent";
            arrowCalculation["border-left"] = (arrowType == "horizontal") ? (positionTooltip.horizontal == "right") ? (size + "px solid " + color) : "none" : size + "px solid transparent";
            if (size == this.model.tip.size.height - 1) {
                arrowCalculation["left"] = innerLeft;
                arrowCalculation["top"] = innerTop;
            }
            return arrowCalculation;
        };
        ejTooltip.prototype._iconRender = function () {
            if (this.model.closeMode == ej.Tooltip.CloseMode.Sticky) {
                if (!ej.isNullOrUndefined(this.tooltipClose))
                    $(this.tooltipClose).remove();
                this.tooltipClose = ej.buildTag("div .e-icon", " ", {}, { 'id': "_closeIcon" });
                (this.model.title != null) ? $(this.tooltipClose).insertAfter(this.tooltipTitle).addClass("e-close") : $(this.tooltipClose).insertBefore(this.tooltipInter).addClass("e-cross-circle");
                this._on($(this.tooltipClose), "click", this._hideTooltip);
            }
        };
        ejTooltip.prototype._renderTarget = function () {
            this.targetElement = $(this.element).find(this.model.target);
            for (var i = 0; i < this.targetElement.length; i++) {
                if (!ej.isNullOrUndefined($(this.targetElement[i]).attr("title"))) {
                    this.targetElement[i].setAttribute("data-content", this.targetElement[i].title);
                    this.targetElement[i].removeAttribute("title");
                }
            }
        };
        ejTooltip.prototype._tooltipContent = function () {
            this.tooltipContent = ej.buildTag('div.e-tipcontent e-def', "", {}, { 'id': this.id + '_content' });
            $(this.tooltipContent).html(this.model.content).addClass("e-def");
            (this.model.title != null) ? $(this.tooltipContent).insertAfter(this.tooltipHeader) : $(this.tooltipContent).appendTo(this.tooltipInter);
        };
        ejTooltip.prototype._positionElement = function (target) {
            this.tooltipPos.width = $(this.tooltip).outerWidth();
            this.tooltipPos.height = $(this.tooltip).outerHeight();
            this.targetPos.width = $(target).outerWidth();
            this.targetPos.height = $(target).outerHeight();
            this._containerCalc(target);
            if (this.model.associate == ej.Tooltip.Associate.Window)
                this._browserPosition();
            else if (this.model.associate == ej.Tooltip.Associate.Axis)
                this._axisPosition();
            else if (this.model.associate == ej.Tooltip.Associate.Target)
                this._tooltipPosition(this.model.position);
            if (this.model.collision != ej.Tooltip.Collision.None && this.model.associate == ej.Tooltip.Associate.Target)
                this._calcCollision(this.model.position, target);
        };
        ejTooltip.prototype._browserPosition = function () {
            if (this.model.containment == "body") {
                this.containerSize = {
                    height: $(window).innerHeight() || document.documentElement.clientHeight || document.body.clientHeight,
                    width: $(window).innerWidth() || document.documentElement.clientWidth || document.body.clientWidth
                };
                var position = $.extend(true, {}, this.model.position);
                var calPosition = { position: "absolute", left: "auto", top: "auto", bottom: "auto", right: "auto" }, offsetTop, offsetLeft;
                if (!ej.isNullOrUndefined(this.tip))
                    $(this.tip).css({ "display": "none" });
                (this.model.position.target.horizontal == "right") ? calPosition.right = 0 : (this.model.position.target.horizontal == "left") ? calPosition.left = 0 : (calPosition.left = (this.containerSize.width / 2) - (this.tooltipPos.width / 2));
                (this.model.position.target.vertical == "top") ? (calPosition.top = 0) : (this.model.position.target.vertical == "center") ? (calPosition.top = ((this.containerSize.height / 2) - (this.tooltipPos.height / 2))) : calPosition.bottom = 0;
                if (this.model.showShadow)
                    this._shadowEffect(this.model.showShadow, position);
                $(this.tooltip).css(calPosition);
            }
        };
        ejTooltip.prototype._tooltipMove = function (event) {
            if (this.model.closeMode == ej.Tooltip.CloseMode.None && this.model.enabled) {
                var proxy = this;
                if (this._isCancel)
                    return;
                if (this.model.associate == ej.Tooltip.Associate.MouseFollow)
                    this._mousePosition(event);
                else if (this.model.associate == ej.Tooltip.Associate.MouseEnter) {
                    clearTimeout(this.mouseTimer);
                    this.mouseTimer = setTimeout(function () {
                        if (proxy.isTrack)
                            proxy._mousePosition(event);
                    }, 300);
                }
            }
        };
        ejTooltip.prototype._mousePosition = function (event) {
            var eventPageX, eventPageY;
            if (event.type == "touchstart") {
                event.preventDefault();
                eventPageX = event.touches[0].pageX;
                eventPageY = event.touches[0].pageY;
            }
            else if (event.type == "mousemove") {
                eventPageX = event.pageX;
                eventPageY = event.pageY;
            }
            this.isCollision = true;
            this._containerCalc(event.currentTarget);
            var tipGapX = 0, tipGapY = 0, tipSize = 0, positionTooltip = $.extend(true, {}, this.model.position.stem), position = $.extend(true, {}, this.model.position), containerElement = { left: 0, top: 0 }, calcPosition = { left: eventPageX, top: eventPageY }, childElement = { left: eventPageX, top: eventPageY }, containerLeft = this.containerSize.left, containerTop = this.containerSize.top;
            var targetLeft = (this.model.containment != "body") ? (eventPageX - $(this.model.containment).offset().left) : eventPageX, targetTop = (this.model.containment != "body") ? (eventPageY - $(this.model.containment).offset().top) : eventPageY;
            position.target.horizontal = position.target.vertical = "center";
            if (this.model.containment != "body")
                containerElement = ($(this.model.containment).css("position") == "static") ? $(this.model.containment).offsetParent().offset() : $(this.model.containment).offset();
            childElement.left -= containerElement.left;
            childElement.top -= containerElement.top;
            while (this.isCollision) {
                calcPosition = $.extend(true, {}, childElement);
                var tipY = (this.model.isBalloon) ? (positionTooltip.vertical == "top" || positionTooltip.vertical == "bottom") ? (5 + (this.tipSize.height / 2)) : 0 : 0, tipX = (this.model.isBalloon) ? (positionTooltip.horizontal == "right" || positionTooltip.horizontal == "left") ? (10 + (this.tipSize.width / 2)) : 0 : 0;
                tipGapX = (this.model.tip.adjust.xValue != 0) ? this.model.tip.adjust.xValue : 7;
                tipGapY = (this.model.tip.adjust.yValue != 0) ? this.model.tip.adjust.yValue : 10;
                tipSize = (this.model.isBalloon) ? (positionTooltip.horizontal != "center") ? this.model.tip.size.height : (positionTooltip.vertical != "center") ? this.model.tip.size.height : 0 : 2;
                calcPosition.left += (positionTooltip.horizontal == "right") ? -this.tooltipPos.width : (positionTooltip.horizontal == "left") ? 0 : -(this.tooltipPos.width / 2);
                calcPosition.top += (positionTooltip.vertical == "bottom") ? -this.tooltipPos.height : (positionTooltip.vertical == "top") ? 0 : -(this.tooltipPos.height / 2);
                calcPosition.left += (positionTooltip.vertical != "center") ? ((positionTooltip.horizontal == "right") ? tipX : (positionTooltip.horizontal == "left") ? -tipX : 0) : 0;
                calcPosition.left += (positionTooltip.vertical == "center") ? (positionTooltip.horizontal == "right") ? -(tipSize) : (positionTooltip.horizontal == "left") ? +(tipSize + tipGapX) : 0 : 0;
                calcPosition.top += (positionTooltip.vertical == "top") ? +(tipSize + tipGapY) : (positionTooltip.vertical == "bottom") ? -(tipSize) : 0;
                if (this.targetElement != event.currentTarget) {
                    this.targetElement = event.currentTarget;
                    if (calcPosition.left < containerLeft || (calcPosition.left + this.tooltipPos.width > (containerLeft + this.containerSize.width)))
                        this.positionTooltip.horizontal = (targetLeft >= this.tooltipPos.width) ? "right" : ((this.containerSize.width - targetLeft) >= this.tooltipPos.width) ? "left" : "center";
                    if (calcPosition.top < containerTop || ((calcPosition.top + this.tooltipPos.height) > (this.containerSize.height + containerTop)))
                        this.positionTooltip.vertical = (targetTop >= this.tooltipPos.height) ? "bottom" : ((this.containerSize.height - targetTop) >= this.tooltipPos.height) ? "top" : "center";
                }
                if (this.positionTooltip.horizontal != positionTooltip.horizontal || this.positionTooltip.vertical != positionTooltip.vertical) {
                    this.isCollision = true;
                    positionTooltip = $.extend(true, {}, this.positionTooltip);
                }
                else {
                    this.isCollision = false;
                    $(this.tooltip).css({ top: calcPosition.top + "px", left: calcPosition.left + "px", position: "absolute", right: "auto", bottom: "auto" });
                    position.stem = $.extend(true, {}, this.positionTooltip);
                    if (this.model.showShadow)
                        this._shadowEffect(this.model.showShadow, position);
                    if (this.model.isBalloon)
                        this._adjustArrow(position);
                    this._showTooltip();
                    if (this.model.associate == ej.Tooltip.Associate.MouseEnter)
                        this.isTrack = false;
                    if (this.model.associate == ej.Tooltip.Associate.MouseFollow) {
                        if (this.triggerEvents("tracking", { position: this.model.position, event: event }))
                            return;
                    }
                }
            }
        };
        ejTooltip.prototype._axisPosition = function () {
            var position = $.extend(true, {}, this.model.position);
            if (typeof this.model.position.target.horizontal == 'number')
                var leftValue = (this.model.position.target.horizontal).toString();
            if (typeof this.model.position.target.vertical == 'number')
                var topValue = (this.model.position.target.vertical).toString();
            var offsetLeft = parseInt(leftValue), offsetTop = parseInt(topValue);
            if (!ej.isNullOrUndefined(this.tip))
                $(this.tip).css({ "display": "none" });
            if (this.model.showShadow)
                this._shadowEffect(this.model.showShadow, position);
            if (this.model.isBalloon)
                this._adjustArrow(position);
            if (isFinite(offsetLeft) && isFinite(offsetTop))
                $(this.tooltip).css({ top: offsetTop, left: offsetLeft, position: "absolute" });
        };
        ejTooltip.prototype._tooltipPosition = function (position) {
            var tipSize = 0, tipGap = 0, tipAdjustment = 0, positionTooltip = $.extend(true, {}, position.stem), positionTarget = $.extend(true, {}, position.target);
            var calcPosition = $.extend(true, {}, this.targetPos);
            var tipY = (positionTooltip.vertical === "top" || positionTooltip.vertical === "bottom") ? (5 + (this.tipSize.width / 2)) : 0, tipX = (positionTooltip.horizontal === "right" || positionTooltip.horizontal === "left") ? (10 + (this.tipSize.width / 2)) : 0, tipSize = (this.model.isBalloon) ? (positionTooltip.horizontal !== "center") ? this.model.tip.size.height : (positionTooltip.vertical !== "center") ? this.model.tip.size.height : 0 : 0;
            var tipGapX = (this.model.tip.adjust.xValue != 0) ? this.model.tip.adjust.xValue : (this.model.isBalloon) ? 0 : 2, tipGapY = (this.model.tip.adjust.yValue != 0) ? this.model.tip.adjust.yValue : (this.model.isBalloon) ? 0 : 2;
            calcPosition.left += (positionTarget.horizontal === "right") ? this.targetPos.width : (positionTarget.horizontal === "left") ? 0 : (this.targetPos.width / 2);
            calcPosition.top += (positionTarget.vertical === "bottom") ? this.targetPos.height : (positionTarget.vertical === "top") ? 0 : (this.targetPos.height / 2);
            calcPosition.left += (positionTooltip.horizontal === "right") ? -this.tooltipPos.width : (positionTooltip.horizontal === "left") ? 0 : -(this.tooltipPos.width / 2);
            calcPosition.top += (positionTooltip.vertical === "bottom") ? -this.tooltipPos.height : (positionTooltip.vertical === "top") ? 0 : -(this.tooltipPos.height / 2);
            calcPosition.left += (positionTarget.horizontal !== "center") ? (positionTooltip.horizontal === "right") ? -tipSize : (positionTooltip.horizontal === "left") ? tipSize : 0 : (positionTooltip.vertical === "center") ? (positionTooltip.horizontal === "right") ? -tipSize : (positionTooltip.horizontal === "left") ? tipSize : 0 : 0;
            calcPosition.top += (positionTarget.horizontal === "center") ? ((positionTooltip.vertical === "bottom") ? -tipSize : (positionTooltip.vertical === "top") ? tipSize : 0) : (positionTooltip.horizontal === "center") ? (positionTooltip.vertical === "bottom") ? -tipSize : (positionTooltip.vertical === "top") ? tipSize : 0 : 0;
            calcPosition.left += (positionTarget.horizontal === "center" && positionTooltip.vertical !== "center") ? ((positionTooltip.horizontal === "right") ? tipX : (positionTooltip.horizontal === "left") ? -tipX : 0) : 0;
            calcPosition.top += (positionTarget.horizontal !== "center" && positionTooltip.horizontal !== "center") ? ((positionTooltip.vertical === "top") ? -tipY : (positionTooltip.vertical === "bottom") ? tipY : 0) : 0;
            calcPosition.left += (positionTarget.horizontal !== "center") ? (positionTooltip.horizontal === "right") ? -tipGapX : (positionTooltip.horizontal === "left") ? tipGapX : 0 : (positionTooltip.vertical === "center") ? (positionTooltip.horizontal === "right") ? -tipGapX : (positionTooltip.horizontal === "left") ? tipGapX : 0 : 0;
            calcPosition.top += (positionTarget.horizontal === "center") ? ((positionTooltip.vertical === "bottom") ? -tipGapY : (positionTooltip.vertical === "top") ? tipGapY : 0) : (positionTooltip.horizontal === "center") ? (positionTooltip.vertical === "bottom") ? -tipGapY : (positionTooltip.vertical === "top") ? tipGapY : 0 : 0;
            this.tooltipPos.left = calcPosition.left;
            this.tooltipPos.top = calcPosition.top;
            if (this.model.collision === ej.Tooltip.Collision.None) {
                if (this.model.isBalloon)
                    this._adjustArrow(position);
                this._shadowEffect(this.model.showShadow, position);
                $(this.tooltip).css({ "top": calcPosition.top + "px", "left": calcPosition.left + "px", position: "absolute" });
            }
        };
        ejTooltip.prototype._calcCollision = function (position, target) {
            var position = $.extend(true, {}, position), newPosition = $.extend(true, {}, position), arrowSize = this.model.tip.size.height, isCollision = true;
            var targetLeft = (this.model.containment != "body") ? ($(target).offset().left - $(this.model.containment).offset().left) : $(target).offset().left, targetTop = (this.model.containment != "body") ? ($(target).offset().top - $(this.model.containment).offset().top) : $(target).offset().top;
            var availSpace = {
                topSpace: targetTop,
                rightSpace: this.containerSize.width - (targetLeft + this.targetPos.width),
                bottomSpace: this.containerSize.height - (targetTop + this.targetPos.height),
                leftSpace: targetLeft,
                centerRight: this.containerSize.width - (targetLeft + (this.targetPos.width / 2)),
                centerLeft: (targetLeft + (this.targetPos.width / 2)),
                centerTop: targetTop + (this.targetPos.height / 2),
                centerBottom: this.containerSize.height - (targetTop + (this.targetPos.height / 2)),
                tooltipWidth: this.tooltipPos.width + arrowSize,
                tooltipHeight: this.tooltipPos.height + arrowSize
            };
            if (this.model.collision === ej.Tooltip.Collision.Fit)
                this._collisionFit(position, availSpace);
            else {
                while (isCollision) {
                    newPosition = this._collisionFlip(newPosition, availSpace);
                    if (newPosition.target.horizontal != position.target.horizontal || newPosition.target.vertical != position.target.vertical || newPosition.stem.horizontal != position.stem.horizontal || newPosition.stem.vertical != position.stem.vertical) {
                        this._tooltipPosition(newPosition);
                        position = $.extend(true, {}, newPosition);
                    }
                    else
                        isCollision = false;
                }
                if (!isCollision) {
                    if (this.model.collision == ej.Tooltip.Collision.FlipFit)
                        this._collisionFit(newPosition, availSpace);
                    else {
                        this._adjustArrow(newPosition);
                        this._shadowEffect(this.model.showShadow, newPosition);
                        $(this.tooltip).css({ "top": this.tooltipPos.top + "px", "left": this.tooltipPos.left + "px", position: "absolute" });
                    }
                }
            }
        };
        ejTooltip.prototype._collisionFlip = function (position, availSpace) {
            var tooltipPos = $.extend(true, {}, this.tooltipPos), newPosition = $.extend(true, {}, position);
            var scrollLeft = $(this.model.containment).scrollLeft(), scrollTop = $(this.model.containment).scrollTop();
            var containerLeft = this.containerSize.left, containerTop = this.containerSize.top;
            if ((tooltipPos.left + tooltipPos.width) > (containerLeft + this.containerSize.width + scrollLeft) || (tooltipPos.left < containerLeft)) {
                if (position.target.horizontal != "center")
                    newPosition.target.horizontal = (availSpace.leftSpace >= availSpace.tooltipWidth) ? "left" : (availSpace.rightSpace >= availSpace.tooltipWidth) ? "right" : "center";
                else
                    newPosition.stem.horizontal = (availSpace.centerLeft >= availSpace.tooltipWidth) ? "right" : (availSpace.centerRight >= availSpace.tooltipWidth) ? "left" : "center";
            }
            if (tooltipPos.top < containerTop)
                newPosition.target.vertical = (availSpace.bottomSpace >= availSpace.tooltipHeight) ? "bottom" : "center";
            if ((tooltipPos.top + tooltipPos.height) > (this.containerSize.height + scrollTop + containerTop))
                newPosition.target.vertical = (availSpace.topSpace >= availSpace.tooltipHeight) ? "top" : "center";
            if (newPosition.target.horizontal != position.target.horizontal || newPosition.target.vertical != position.target.vertical) {
                if (newPosition.target.horizontal == "center")
                    newPosition.stem.horizontal = (availSpace.centerLeft >= availSpace.tooltipWidth) ? "right" : (availSpace.centerRight >= availSpace.tooltipWidth) ? "left" : "center";
                else
                    newPosition.stem.horizontal = (newPosition.target.horizontal == "right") ? "left" : "right";
            }
            if (newPosition.target.vertical != position.target.vertical || newPosition.target.horizontal != position.target.horizontal) {
                if (newPosition.target.vertical == "center")
                    newPosition.stem.vertical = (availSpace.centerTop >= availSpace.tooltipHeight) ? "bottom" : (availSpace.centerBottom >= availSpace.tooltipHeight) ? "top" : (availSpace.centerTop > availSpace.centerBottom) ? "bottom" : "top";
                else
                    newPosition.stem.vertical = (newPosition.target.vertical == "top") ? "bottom" : "top";
            }
            return newPosition;
        };
        ejTooltip.prototype._collisionFit = function (position, availSpace) {
            var tooltipPos = $.extend(true, {}, this.tooltipPos), isHorizontalCollision = false, isVerticalCollision = false;
            var leftValue = 1, topValue = 1, arrowValue = null;
            var scrollLeft = $(this.model.containment).scrollLeft();
            var scrollTop;
            if (this.model.containment == "body") {
                scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            }
            else {
                scrollTop = $(this.model.containment).scrollTop();
            }
            var containerLeft = this.containerSize.left, containerTop = this.containerSize.top;
            if (tooltipPos.left < containerLeft || ((tooltipPos.left + tooltipPos.width) > (this.containerSize.width + scrollLeft + containerLeft))) {
                leftValue = (tooltipPos.left < containerLeft) ? containerLeft : ((tooltipPos.left + tooltipPos.width) > (this.containerSize.width + scrollLeft + containerLeft)) ? (tooltipPos.left - ((tooltipPos.left + tooltipPos.width) - (this.containerSize.width + containerLeft))) : 1;
                isHorizontalCollision = true;
            }
            if (tooltipPos.top < containerTop || ((tooltipPos.top + tooltipPos.height) > (this.containerSize.height + scrollTop + containerTop))) {
                topValue = (tooltipPos.top < containerTop) ? containerTop : ((tooltipPos.top + tooltipPos.height) > (this.containerSize.height + scrollTop + containerTop)) ? (tooltipPos.top - ((tooltipPos.top + tooltipPos.height) - (this.containerSize.height + containerTop))) : 1;
                isVerticalCollision = true;
            }
            $(this.tooltip).css({
                top: (topValue != 1) ? topValue + "px" : tooltipPos.top + "px",
                left: (leftValue != 1) ? leftValue + "px" : tooltipPos.left + "px",
                position: "absolute"
            });
            this._adjustArrow(position);
            arrowValue = { left: this.arrowValue.left, top: this.arrowValue.top, height: this.model.tip.size.height, width: this.model.tip.size.width, display: $(this.tip).css("display") };
            this.tooltipPos.top = topValue = (topValue != 1) ? topValue : tooltipPos.top;
            this.tooltipPos.left = leftValue = (leftValue != 1) ? leftValue : tooltipPos.left;
            var tooltipWidth = $(this.tooltip).width(), tooltipHeight = $(this.tooltip).height();
            if (isHorizontalCollision || isVerticalCollision && (arrowValue.display != "none")) {
                if (this.model.isBalloon) {
                    if (isHorizontalCollision)
                        this.arrowValue.left = this._horizontalAdjustment(position, availSpace);
                    if (isVerticalCollision)
                        this.arrowValue.top = this._verticalAdjustment(position, availSpace);
                }
                if (this.arrowValue.left == -this.model.tip.size.height || this.arrowValue.left == tooltipWidth) {
                    $(this.tip).css({ left: this.arrowValue.left + "px", top: this.arrowValue.top + "px", display: "block" });
                }
                else if (this.arrowValue.top == -this.model.tip.size.height || this.arrowValue.top == tooltipHeight) {
                    $(this.tip).css({ left: this.arrowValue.left + "px", top: this.arrowValue.top + "px", display: "block" });
                }
                else {
                    $(this.tip).css({ left: this.arrowValue.left + "px", top: this.arrowValue.top + "px", display: "none" });
                }
            }
            this._shadowEffect(this.model.showShadow, position);
        };
        ejTooltip.prototype._horizontalAdjustment = function (position, availSpace) {
            var arrowValue = { left: this.arrowValue.left, top: this.arrowValue.top };
            $(this.tooltip).css({ "display": "block" });
            var arrowSize = (position.target.horizontal != "center") ? this.model.tip.size.height : this.model.tip.size.height;
            var arrowLeft = (position.target.horizontal != "center" && position.stem.horizontal == "left") ? $(this.tip).offset().left : (position.target.horizontal != "center" && position.stem.horizontal == "right") ? $(this.tip).offset().left + arrowSize : $(this.tip).offset().left;
            $(this.tooltip).css({ "display": "none" });
            if ((arrowLeft > availSpace.leftSpace) && ((arrowLeft + arrowSize) < (availSpace.leftSpace + this.targetPos.width)))
                return arrowValue.left;
            else {
                if ((arrowLeft > (availSpace.leftSpace + this.targetPos.width)) || (arrowLeft < availSpace.leftSpace))
                    arrowValue.left = (availSpace.leftSpace + this.targetPos.width / 2) - parseInt(this.tooltipPos.left.toString());
                return arrowValue.left;
            }
        };
        ejTooltip.prototype._verticalAdjustment = function (position, availSpace) {
            var arrowValue = { left: this.arrowValue.left, top: this.arrowValue.top, height: this.model.tip.size.height, width: this.model.tip.size.width, display: this.arrowValue.display };
            $(this.tooltip).css({ "display": "block" });
            var arrowSize = (position.target.horizontal != "center") ? this.model.tip.size.height : this.model.tip.size.height;
            var arrowTop = (position.target.horizontal == "center" && position.stem.vertical == "top") ? $(this.tip).offset().top : $(this.tip).offset().top + arrowSize;
            $(this.tooltip).css({ "display": "none" });
            if ((arrowTop > availSpace.topSpace) && (arrowTop < (availSpace.topSpace + this.targetPos.height)))
                return arrowValue.top;
            else {
                if ((arrowTop < availSpace.topSpace) || ((arrowTop + arrowSize) > (availSpace.topSpace + this.targetPos.height)))
                    arrowValue.top = (availSpace.topSpace + this.targetPos.height / 2) - parseInt(this.tooltipPos.top.toString());
                return arrowValue.top;
            }
        };
        ejTooltip.prototype._createHeader = function () {
            if (this.model.title != null) {
                if (ej.isNullOrUndefined(this.tooltipTitle))
                    this._createTitle();
                if (ej.isNullOrUndefined(this.tooltipContent))
                    $(this.tooltipHeader).appendTo(this.tooltipInter).addClass("e-tooltipHeader");
                else
                    $(this.tooltipHeader).insertBefore(this.tooltipContent).addClass("e-tooltipHeader");
            }
            if (this.model.closeMode == ej.Tooltip.CloseMode.Sticky)
                this._iconRender();
        };
        ejTooltip.prototype._hideTooltip = function () {
            var speed;
            this._isHidden = true;
            speed = (this.model.animation.speed != 0) ? this.model.animation.speed : (this.model.animation.effect == ej.Tooltip.Effect.Slide) ? 200 : (this.model.animation.effect == ej.Tooltip.Effect.Fade) ? 800 : 0;
            if (this.model.enabled == true && $(this.tooltip).css("display") == 'block') {
                if (this.triggerEvents("beforeClose", {}))
                    return;
                (this.model.animation.effect == ej.Tooltip.Effect.Fade) ? $(this.tooltip).fadeOut(speed) : (this.model.animation.effect == ej.Tooltip.Effect.Slide) ? $(this.tooltip).slideUp(speed) : $(this.tooltip).css({ display: "none" });
                if ($(this.tooltip).css("display") == 'none')
                    $(this.tooltip).attr('aria-hidden', 'true').removeClass("e-customAnimation");
                if (this.triggerEvents("close", {}))
                    return;
            }
        };
        ejTooltip.prototype._showTooltip = function () {
            if (this._isHidden) {
                var speed = (this.model.animation.speed != 0) ? this.model.animation.speed : (this.model.animation.effect == ej.Tooltip.Effect.Slide) ? 200 : (this.model.animation.effect == ej.Tooltip.Effect.Fade) ? 800 : 0;
                this._isHidden = false;
                if ($(this.tooltip).css("display") == 'none' && this.model.enabled == true) {
                    (this.model.animation.effect == ej.Tooltip.Effect.Fade) ? $(this.tooltip).fadeIn(speed) : (this.model.animation.effect == ej.Tooltip.Effect.Slide) ? $(this.tooltip).slideDown(speed) : $(this.tooltip).css({ display: "block" });
                    if ($(this.tooltip).css("display") == 'block') {
                        $(this.tooltip).attr('aria-hidden', 'false').css({ zIndex: ej.getMaxZindex() + 1 });
                        if (this.model.animation.effect == ej.Tooltip.Effect.None)
                            $(this.tooltip).addClass("e-customAnimation");
                        var elements = this._getScrollableParents();
                        this._on(elements, "scroll", this._hideTooltip);
                    }
                    if (this.triggerEvents("open", {}))
                        return;
                }
            }
        };
        ejTooltip.prototype._getScrollableParents = function () {
            return $(this.element).parentsUntil("html").filter(function () {
                return $(this).css("overflow") != "visible";
            }).add($(window));
        };
        ejTooltip.prototype._tooltipAuto = function () {
            var proxy = this;
            this.timer = setTimeout(function () {
                proxy._hideTooltip();
            }, proxy.model.autoCloseTimeout);
        };
        ejTooltip.prototype._beforeOpenTooltip = function (event) {
            this.positionTooltip = $.extend(true, {}, this.model.position.stem);
            this.positionTarget = $.extend(true, {}, this.model.position.target);
            this.targetElement = this.element;
            if (!ej.isNullOrUndefined(this.model.target)) {
                if (!ej.isNullOrUndefined($(event.currentTarget).attr('data-content'))) {
                    this.model.content = $(event.currentTarget).attr('data-content');
                    this._setContent(this.model.content);
                }
            }
        };
        ejTooltip.prototype._targetHover = function (event) {
            this.isTrack = true;
            if (this.model.enabled) {
                if (this._isHidden || ((ej.browserInfo().name == 'msie' || ej.browserInfo().name == 'edge') && this.model.associate == ej.Tooltip.Associate.MouseFollow)) {
                    this.tooltip.stop(true, true);
                    if (this.triggerEvents("beforeOpen", { event: event })) {
                        this._isCancel = true;
                        return;
                    }
                    this._isCancel = false;
                    this._beforeOpenTooltip(event);
                    if (this.model.associate != ej.Tooltip.Associate.MouseEnter && this.model.associate != ej.Tooltip.Associate.MouseFollow) {
                        (!ej.isNullOrUndefined(this.model.target)) ? this._positionElement(event.currentTarget) : this._positionElement(this.element);
                        clearTimeout(this.timer);
                        this._showTooltip();
                        if (this.model.closeMode == ej.Tooltip.CloseMode.Auto)
                            this._tooltipAuto();
                        (event.type == "click") ? this.triggerEvents("click", { event: event }) : this.triggerEvents("hover", { event: event });
                    }
                    else
                        this.isTrack = true;
                }
                else if (!ej.isNullOrUndefined(this.model.target))
                    this._positionElement(event.currentTarget);
            }
        };
        ejTooltip.prototype._onMouseOut = function (event) {
            if (this.model.enabled && !this._isHidden) {
                if (this.model.closeMode == ej.Tooltip.CloseMode.None)
                    this._hideTooltip();
                clearTimeout(this.mouseTimer);
            }
            this.isTrack = false;
        };
        ejTooltip.prototype._onTooltipMouseEnter = function (event) {
            var proxy = this;
            if (this.model.enabled) {
                if (this.model.animation.effect == ej.Tooltip.Effect.None)
                    $(proxy.tooltip).css({ display: "block" });
            }
        };
        ejTooltip.prototype._onTooltipMouseLeave = function (event) {
            var proxy = this;
            if (this.model.enabled) {
                if (this.model.animation.effect == ej.Tooltip.Effect.None) {
                    if (proxy.model.closeMode == ej.Tooltip.CloseMode.None)
                        $(proxy.tooltip).css({ display: "none" });
                }
            }
        };
        ejTooltip.prototype._docTouchEndHandler = function (e) {
            if (!$(e.target).closest('.e-tooltip').length && this.model.closeMode == ej.Tooltip.CloseMode.None)
                this._hideTooltip();
        };
        ejTooltip.prototype._keyDown = function (event) {
            var code = (event.keyCode) ? event.keyCode : (event.which) ? event.which : event.charCode;
            if (this.model.enabled) {
                switch (code) {
                    case 27:
                        event.preventDefault();
                        this._hideTooltip();
                        break;
                }
            }
        };
        return ejTooltip;
    }(ej.WidgetBase));
    window.ej.widget("ejTooltip", "ej.Tooltip", new ejTooltip());
    window["ejTooltip"] = null;
})(jQuery);
ej.Tooltip.CloseMode = {
    Auto: "auto",
    None: "none",
    Sticky: "sticky"
};
ej.Tooltip.Effect = {
    Slide: "slide",
    Fade: "fade",
    None: "none"
};
ej.Tooltip.Trigger = {
    Hover: "hover",
    Click: "click",
    Focus: "focus"
};
ej.Tooltip.Collision = {
    Flip: "flip",
    FlipFit: "flipfit",
    None: "none",
    Fit: "fit"
};
ej.Tooltip.Associate = {
    Window: "window",
    MouseFollow: "mousefollow",
    MouseEnter: "mouseenter",
    Target: "target",
    Axis: "axis"
};
