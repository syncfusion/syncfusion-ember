/**
* @fileOverview Plugin to style the Html Rotator elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {
    // ejmRotator is the plugin name 
    // "ej.mobile.Rotator" is "namespace.className" will hold functions and properties

    ej.widget("ejmRotator", "ej.mobile.Rotator", {
        _requiresID: true,
        _setFirst: true,
        _rootCSS: "e-m-rotator",
        _tags: [{
            tag: "items",
            attr: ["imageUrl", "text"]
        }],

        defaults: {
            targetId: null,
            renderMode: "auto",
            targetHeight: "auto",
            targetWidth: "auto",
            currentItemIndex: 0,
            showPager: true,
            cssClass: "",
            orientation: "horizontal",
            enablePersistence: false,
            pagerPosition: "bottom",
            items: [],
            swipeLeft: null,
            swipeRight: null,
            swipeUp: null,
            swipeDown: null,
            change: null,
            pagerSelect: null,
            dataSource: null,
        },

        dataTypes: {
            renderMode: "enum",
            showPager: "boolean",
            dataSource: "data",
            enablePersistence: "boolean"
        },
        observables: ["currentItemIndex"],
        currentItemIndex: ej.util.valueFunction("currentItemIndex"),
        _init: function () {
            this._renderControl();
            this._createDelegate();
            this._wireEvents();
        },
        _renderControl: function () {
            this._setValues();
            this.element.addClass("e-m-" + this.model.renderMode + " " + this.model.cssClass + " e-m-rotator e-m-user-select").append(this._wrapper);
            this.model.dataSource ? this._renderDatabind() : this._renderDefault();
        },
        _setValues: function () {
            ej.setRenderMode(this);
            if (eval(this.model.items).length != 0) {
                this.model.items = eval(this.model.items)
                var itemsLen=this.model.items.length
                this._wrapper = ej.buildTag("div#" + this._id + "_container");
                for (i = 0; i <itemsLen ; i++)
                    this._wrapper.append(ej.buildTag("div"));
            }
            else {
                this._wrapper = this.model.targetId ? (ej.getCurrentPage()).find("#" + this.model.targetId) : $(this.element.children()[0]);
                var childEle = this._wrapper.children();
                var tempImgAttr = ej.getAttrVal($(childEle[0]), 'data-ej-imageUrl');
                var tempTextAttr = ej.getAttrVal($(childEle[0]), 'data-ej-text');
                if (tempImgAttr || tempTextAttr) {
                    for (i = 0; i < childEle.length; i++) {
                        var item = {};
                        item.imageUrl = ej.getAttrVal($(childEle[i]), 'data-ej-imageUrl');
                        if (tempTextAttr)
                            item.text = ej.getAttrVal($(childEle[i]), 'data-ej-text');
                        this.model.items.push(item);
                    }
                }
            }
            this._divCount = this._wrapper.children().length;
            this._orgEle = this._wrapper;
            this._autoHeightWidthValues();
            this._browser = ej.browser().toLowerCase();
            this._startValues();
        },
        _autoHeightWidthValues: function () {
            this._mHeight = (this.model.targetHeight == "auto" ? (ej.getDimension(this.element.parent(), "height")) : parseInt(this.model.targetHeight));
            this._mWidth = this.model.targetWidth == "auto" ? ej.getDimension(this.element.parent(), "width") : parseInt(this.model.targetWidth);
        },
        _startValues: function () {
            this._moveEle = (this._divCount > this.currentItemIndex() && this.currentItemIndex() >= 0) ? -(this.currentItemIndex() * ((this.model.orientation == "horizontal") ? this._mWidth : this._mHeight)) : 0;
            this._divEle = this._moveEle ? this.currentItemIndex() + 1 : 1;
            this._timeStart = 0;
        },
        _transform: function (dist, time) {
            var translate = "-" + this._browser + "-transform",
                translateVal = this.model.orientation == "horizontal" ? "translate3d(" + dist + "px,0px,0px) scale(1)" : "translate3d(0px," + dist + "px,0px) scale(1)",
                trans = "-" + this._browser + "-transition-property",
                transVal = "transform",
                transDur = "-" + this._browser + "-transition-duration",
                transDurVal = time + "ms";
            this._wrapper.css(translate, translateVal).css(trans, transVal).css(transDur, transDurVal);
        },
        _renderDatabind: function () {
            var jsRender = ej.buildTag("script#" + this._id + "_Template", {}, {}, { "type": "text/x-jsrender" });
            var tempEle = this._wrapper.find("div");
            tempEle.remove();
            var newTemp = ej.buildTag("div").append(tempEle);
            jsRender[0].text = newTemp[0].innerHTML;
            ej.getCurrentPage().append(jsRender);
            if (this.model.dataSource)
                this.renderDatasource(this.model.dataSource);
        },
        _renderDefault: function () {
            if (this.model.items.length != 0) {
                this._imgTag = (this.model.items[0].imageUrl);
                this._textTag = this.model.items[0].text;
          
            }   
            if(this._imgTag!=undefined || this._textTag!=undefined)
            this._tagCreate();
            this._scrollItem();
            this._transform(this._moveEle, 350);
            this._renderPager();
        },
        _scrollItem: function () {
            this.element.css({ "width": "" + this._mWidth + "px", "height": "" + (this._mHeight) + "px" });
            this._wrapper.addClass("e-m-sv-container e-m-" + this.model.orientation + "").css({ "height": "" + this._mHeight + "", "width": "" + this._mWidth + "" });
            this._wrapper.children().addClass("e-m-item");
        },
        _tagCreate: function () {
            var items = this._wrapper.find('div'), divImage, para;
            for (i = 0; i < this._divCount; i++) {
                if (this._textTag != undefined) {
                    para = ej.buildTag("p").html(this.model.items[i].text).addClass("e-m-rotator-p");
                    $(items[i]).append(para);
                }
                if (this._imgTag != undefined) {
                    divImage = ej.buildTag("div").css({
                        "background-image": "url(" + this.model.items[i].imageUrl + ")",
                    }).addClass("e-m-rotator-image");
                    $(items[i]).append(divImage);
                }
            }
        },
        _renderPager: function () {
            this._span = ej.buildTag("div.e-m-abs  e-m-pager e-m-" + this.model.renderMode + "");
            this._wrapper.after(this._span);
            for (i = 0; i < this._divCount; i++)
                this._span.append(ej.buildTag("span.e-m-sv-pager"));
            this._span.find(":nth-child(" + this._divEle + ")").addClass("e-m-active");
            this._pagerPos();
            this._setShowPager();
        },
        _pagerPos: function () {
            this.model.orientation == "horizontal" ? (this.model.pagerPosition = "top" ? this.model.pagerPosition == "top" ? this._span.addClass("e-m-sv-pagertop") : this._span.addClass("e-m-sv-pagerbottom") : this._span.addClass("e-m-sv-pagerbottom")) : this.model.pagerPosition == "right" ? this._span.addClass("e-m-sv-pagerright") : this._span.addClass("e-m-sv-pagerleft")
            this.model.orientation == "horizontal" ? (this._span.addClass("e-m-rotator-spanleft")) : this._span.css("bottom", +((this._mHeight) - $(".e-m-pager").height()) / 2 + "px");
        },
        _createDelegate: function()
        {
            this._onMouseDownDelg = $.proxy(this._onMouseDownHandler, this);
            this._onMouseMoveDelg = $.proxy(this._onMouseMoveHandler, this);
            this._onMouseUpDelg = $.proxy(this._onMouseUpHandler, this);
            this._onTouchEndDelegate = $.proxy(this._onTouchEndHandler, this);
        },
        _wireEvents: function (remove) {
            ej.listenTouchEvent(this._wrapper, ej.startEvent(), this._onMouseDownDelg, remove);
            ej.listenEvents([window], [ "onorientationchange" in window ? "orientationchange" : "resize"], [$.proxy(this._ResizeHandler, this)], remove);
            this._pagerEvents(remove);
        },
        _ResizeHandler: function (evt) {
            if (this.model.targetHeight == "auto" || this.model.targetWidth == "auto") {
                var proxy = this;
                window.setTimeout(function () {
                    evt.preventDefault();
                    proxy._orientationAndResize();
                }, ej.isAndroid() ? 200 : 0);
            }
        },
        _pagerEvents: function (remove) {
            this._spanEle = this.element.find("div.e-m-abs").children();
            ej.listenEvents([this._spanEle, this._spanEle], [ej.startEvent(), ej.endEvent()], [this._onTouchStartDelegate, this._onTouchEndDelegate], remove);
        },
        _onTouchEndHandler: function (evt) {
            this._index = $(evt.currentTarget).index();
            this.currentItemIndex(this._index);
            this._moveEle = -(this._index * (this.model.orientation == "horizontal" ? this._mWidth : this._mHeight));
            this._transform(this._moveEle, 350);
            this._span.find(":nth-child(" + this._divEle + ")").removeClass("e-m-active");
            this._divEle = this._index + 1;
            this._span.find(":nth-child(" + this._divEle + ")").addClass("e-m-active");
            var data = { targetElement: this._wrapper, element: this._divEle };
            if (this.model.pagerSelect)
                this._trigger("pagerSelect", data);
        },
        _orientationAndResize: function () {
            this._autoHeightWidthValues();
            var val = this.model.orientation == "horizontal" ? this._mWidth : this._mHeight;
            this._moveEle = -((this._divEle * val) - val);
            this._transform(this._moveEle, 0);
            this._scrollItem();
            this._spanTrans = (this._divEle - 1) * this._andSpanVal;
            this._pagerPos();
        },
        _onMouseDownHandler: function (evt) {
            if (ej.isTouchDevice())
                evt = evt.touches ? evt.touches[0] : evt;
            this._startX = evt.clientX;
            this._startY = evt.clientY;
            this._timeStart = evt.timeStamp || Date.now();
            ej.listenEvents([this._wrapper, this._wrapper], [ej.moveEvent(), ej.endEvent()], [this._onMouseMoveDelg, this._onMouseUpDelg], false);
        },
        _onMouseMoveHandler: function (evt) {
            if (ej.isTouchDevice())
                evt = evt.touches ? evt.touches[0] : evt;
            this._relativeX = evt.clientX - this._startX;
            this._relativeY = evt.clientY - this._startY;
            if (this.model.orientation == "horizontal") {
                this._start = this._startX;
                this._relative = this._relativeX;
                this._distValue = this._mWidth;
                this._swipeLeftUp = "swipeLeft";
                this._swipeRightDown = "swipeRight";
            }
            else {
                this._start = this._startY;
                this._relative = this._relativeY;
                this._distValue = this._mHeight;
                this._swipeLeftUp = "swipeUp";
                this._swipeRightDown = "swipeDown";
            }
           if (this._start != 0 && Math.abs(this._relative)) {
                if ((this._relative < 0 && this._divEle < this._divCount) || (this._relative > 0 && this._divEle > 1)) {}
                else {
                    (Math.abs(this._relative) < this._distValue / 2)  
                }
                    var move = this._moveEle + this._relative;
                    this._transform(move, 0);
            }
            ej.listenTouchEvent(this._wrapper, "mouseleave", this._onMouseUpDelg, false);
        },
       _onMouseUpHandler: function (evt) {
            if (this._timeStart != 0) {
                this._data = { targetElement: this._wrapper, element: this._divEle };
                var duration = (evt.timeStamp || Date.now()) - this._timeStart,
                momentumX = { dist: 0, time: 0 },
                reverse = this._relative > 0 ? true : false,
                moveDist = this._relative;
                if (duration < 300) {
                    momentumX = this._relative ? this._momentum(this._relative, duration, (reverse ? this._relative : -this._relative), this._distValue + this._relative, this._distValue) : momentumX;
                    moveDist = this._relative + momentumX.dist;
                }
                if (moveDist < 0 && Math.abs(moveDist) > this._distValue / 2 && this._divEle < this._divCount) {
                    this._moveEle += -this._distValue;
                    this._movePager(true);
                    if (this.model.swipeLeft || this.model.swipeUp)
                        this._trigger(this._swipeLeftUp, this._data);
                }
                else if (moveDist > 0 && Math.abs(moveDist) > this._distValue / 2 && this._divEle > 1) {
                    this._moveEle -= -this._distValue;
                    this._movePager(false);
                    if (this.model.swipeRight || this.model.swipeDown)
                        this._trigger(this._swipeRightDown, this._data);
                }
                this._transform(this._moveEle, 350);
                this._timeStart = 0;
                this._startX = 0;
                this._relativeX = 0;
                this._relative = 0;
                this._start = 0;
                ej.listenEvents([this._wrapper, this._wrapper], [ej.moveEvent(), ej.endEvent()], [this._onMouseMoveDelg, this._onMouseUpDelg], true);
            }
            this.currentItemIndex(this._divEle - 1);
        },
        _momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
           var deceleration = 0.0006,
            speed = Math.abs(dist) / time,
            newDist = (speed * speed) / (2 * deceleration),
            newTime = 0, outsideDist = 0;
            if (dist > 0 && newDist > maxDistUpper) {
                outsideDist = size / (6 / (newDist / speed * deceleration));
                maxDistUpper = maxDistUpper + outsideDist;
                speed = speed * maxDistUpper / newDist;
                newDist = maxDistUpper;
            } else if (dist < 0 && newDist > maxDistLower) {
                outsideDist = size / (6 / (newDist / speed * deceleration));
                maxDistLower = maxDistLower + outsideDist;
                speed = speed * maxDistLower / newDist;
                newDist = maxDistLower;
            }
            newDist = newDist * (dist < 0 ? -1 : 1);
            newTime = speed / deceleration;
            return { dist: newDist, time: Math.round(newTime) };
        },
        _movePager: function (page) {
            this._span.find(":nth-child(" + this._divEle + ")") .removeClass("e-m-active");
            this._divEle = page ? (this._divEle + 1) : (this._divEle - 1);
            this._span.find(":nth-child(" + this._divEle + ")").addClass("e-m-active");
            this._spanTrans = (this._divEle - 1) * this._andSpanVal;
            this._data = { targetElement: this._wrapper, element: this._divEle };
            if (this.model.change)
                this._trigger("change", this._data);
        },
        _setModel: function (options) {
            var refresh = false;
            for (var prop in options) {
                if (prop != "swipeLeft" || prop != "swipeRight")
                    var setModel = "_set" + prop.charAt(0).toUpperCase() + prop.slice(1);
                this[setModel] ? this[setModel]() : refresh = true;
                
            }
            if (refresh)
                this._refresh();
        },
        _setRenderMode: function () {
            this.element.removeClass("e-m-ios7 e-m-android e-m-windows e-m-flat").addClass("e-m-" + this.model.renderMode + "");
            this._span.remove();
            this._renderPager();
            this._pagerEvents(false);
        },
        _setShowPager: function () {
            this.model.showPager ? this._span.css("display", "block") : this._span.css("display", "none");
        },
        _setOrientation: function () {
            this.model.orientation == "horizontal" ? this._span.addClass("e-m-sv-pagerbottom") : this._span.addClass("e-m-sv-pagerright");
            this.currentItemIndex(this._divEle - 1);
            this._refresh();
        },
        _setCurrentItemIndex: function () {
            var span=this._span.find(":nth-child(" + this._divEle + ")");
            span.removeClass("e-m-active");
            this._startValues();
            this._transform(this._moveEle, 1000);
            this._spanTrans = (this._divEle - 1) * this._andSpanVal;
            span.addClass("e-m-active");
        },
        _refresh: function () {
            this._destroy();
            this._init();
        },
        _destroy: function () {
            this._wireEvents(true);
               this._wrapper.children().find(".e-m-rotator-p,.e-m-rotator-image").remove().removeClass("e-m-item");
            this.element.removeAttr("class style").children().removeAttr("class style").remove();
            this._span.remove();
            ej.getCurrentPage().append(this._orgEle);
        },
        /*---------------Public Methods---------------*/
        renderDatasource: function (data) {
            var template = $.templates("#" + this._id + "_Template");
            var htmlOutput = template.render(data);
            this._wrapper.html(htmlOutput);
            this._divCount = this._wrapper.children().length;
            this._scrollItem();
            this._transform(this._moveEle, 350);
            this._renderPager();
            this._wireEvents();
        }
        /*---------------Public Methods End---------------*/
    });
})(jQuery, Syncfusion);