/**
 * @fileOverview Plugin to style the Html SplitPane elements
 * @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
 *  Use of this code is subject to the terms of our license.
 *  A copy of the current license can be obtained at any time by e-mailing
 *  licensing@syncfusion.com. Any infringement will be prosecuted under
 *  applicable laws. 
 * @version 12.1 
 * @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
 */
(function ($, ej, undefined) {
    ej.widget("ejmSplitPane", "ej.mobile.SplitPane", {
        _setFirst: true,
        _rootCSS: "e-m-splitpane",
        _ignoreOnPersist: ["create","destroy","beforeOpen","beforeClose","close","open","swipe"],
        angular: {
            terminal: false
        },
        defaults: {
            renderMode: "auto",
            cssClass: "",
            enablePersistence: false,
            height: "auto",
            width: "auto",
            isRelative: false,
            edgeThreshold: 50,
            enableSwipe: true,
            stopEventPropagation: ej.isWindows(),
            leftPane: {
                templateId: null,
                showOnTablet: true,
                animationType: "overlay",
                width: "280px"
            },
            rightPane: {
                templateId: null,
                showOnTablet: false,
                animationType: "overlay",
                width: "280px"
            },
            contentPane: {
                templateId: null
            },
            swipe: null,
            open: null,
            close: null,
            beforeClose: null,
            beforeOpen: null,
            create: null,
            destroy: null

        },

        dataTypes: {
            renderMode: "enum",
            enablePersistence: "boolean",
            isRelative: "boolean",
            edgeThreshold: "number",
            stopEventPropagation: "boolean",
            leftPane: "object",
            rightPane: "object",
            contentPane: "object"
        },

        _lModel: {
            overlayOpacity: 0.3,
            swipeThreshold: 15,
            defaultTransitionTime: 400,
            fastTransitionTime: 200
        },

        _class: {
            opened: "e-m-opened",
            hide: "e-m-hide",
            show: "e-m-show",
            hidden:"e-m-hidden",
        },

        _init: function () {
            this._isNavPaneOpened=false;
            this._orgEleStyle = $(this.element).attr("style");
            this._orgEleClass = $(this.element).attr("class");
            this._browser = ej.browser().toLowerCase();
            this._cssClass = this.model.cssClass;
            ej.setRenderMode(this);
            this._initPane();
            this._renderControl();
            this._createDelegates();
            this._wireEvents();
        },

        _initPane: function () {
            //Initialize the pane Objects
            this._panel = {
                left: (this.model.leftPane.templateId ? this._getTemplate(this.model.leftPane.templateId, "_leftpane") : (this.element.find("[data-ej-pane='left']").length ? this.element.find("[data-ej-pane='left']") : this.element.find("[e-pane='left']"))),
                content: (this.model.contentPane.templateId ? this._getTemplate(this.model.contentPane.templateId, "_contentpane") : (this.element.find("[data-ej-pane='content']").length ? this.element.find("[data-ej-pane='content']") : this.element.find("[e-pane='content']"))),
                right: (this.model.rightPane.templateId ? this._getTemplate(this.model.rightPane.templateId, "_rightpane") : (this.element.find("[data-ej-pane='right']").length ? this.element.find("[data-ej-pane='right']") : this.element.find("[e-pane='right']")))
            };
            //add class to all panes
            this._panel.left.addClass("e-m-type-" + this.model.leftPane.animationType + " e-m-sp-left e-m-pane e-m-hidden e-m-abs");
            this._panel.right.addClass("e-m-type-" + this.model.rightPane.animationType + " e-m-sp-right e-m-pane e-m-hidden e-m-abs");
            this._panel.content.addClass("e-m-sp-content e-m-pane e-m-abs");
            //creating overlay
            this._elementOverlay = ej.buildTag("div#" + this._id + "_Overlay", {}, {}, {
                "class": "e-m-overlay e-m-splitpane-overlay e-m-hide e-m-abs"
            });
            this._elementOverlay.appendTo(this._panel.content);

            return this;
        },

        _getTemplate: function (eleId, pane) {
            var returnEle = null;
            if ($("#" + eleId)[0].nodeName == "SCRIPT") {
                returnEle = ej.buildTag("div#" + this._id + pane);
                returnEle.html($("#" + eleId).text()).appendTo(this.element);
                ej.widget.init(returnEle);
                if (ej.angular.defaultAppName && angular)
                    ej.angular.compile(returnEle);
            } else {
                returnEle = $("#" + eleId);
                if ($("#" + eleId).parent() != this.element)
                    returnEle.appendTo(this.element);
            }
            return returnEle;
        },

        _renderControl: function () {
            this._direction = ["left", "right"];
            this.element.addClass("e-m-splitpane e-m-" + this.model.renderMode + " e-m-" + (ej.isMobile() ? "mobile " : "tablet ") + this.model.cssClass)
                .addClass(ej.isLowerResolution() ? "e-m-lower" : "e-m-higher")
                .addClass(this.model.isRelative ? "e-m-rel" : "e-m-abs");
            this._setPaneSize();
        },

        _createDelegates: function () {
            // Swipe Event Delegates
            this._swipeStartHandler = $.proxy(this._swipeStart, this);
            this._swipeEndHandler = $.proxy(this._swipeEnd, this);
            this._swipeMoveHandler = $.proxy(this._swipeMove, this);

            this._overlayTapStartDelegate = $.proxy(this._overlayTapStart, this);
            this._overlayTapEndDelegate = $.proxy(this._overlayTapEnd, this);
            this._resizeDelegate = $.proxy(this._resize, this);
        },

        _wireEvents: function (remove) {
            var eventType = !remove && this.model.enableSwipe ? "bind" : "unbind";
            this._bindSwipeEvent(remove);
            ej.listenTouchEvent(this._elementOverlay, ej.startEvent(), this._overlayTapStartDelegate, remove);
            if (ej.isTouchDevice() && this._isOrientationSupported())
                ej.listenTouchEvent(window, "orientationchange", this._resizeDelegate, remove, this);
            else
                ej.listenTouchEvent(window, "resize", this._resizeDelegate, remove, this);
        },
        _bindSwipeEvent: function (remove) {
            if (this.model.enableSwipe)
                this._on(this._panel.content, "mousedown touchstart MSPointerDown pointerdown", this._swipeStartHandler);
        },

        _unbindSwipeEvent: function () {
            if (this.model.enableSwipe){
                this._off(this._panel.content, "mousedown touchstart MSPointerDown pointerdown", this._swipeStartHandler);
                this._off(t.element, "mousemove touchmove MSPointerMove pointermove", this._swipeMoveHandler);
                this._off(t.element, "mouseup touchend MSPointerUp pointerup", this._swipeEndHandler);
                this._off(t.element, "mousecancel touchcancel MSPointerCancel pointercancel", this._swipeEndHandler);
            }
        },

        _overlayTapStart: function (e) {
            ej.listenTouchEvent(this._elementOverlay, ej.endEvent(), this._overlayTapEndDelegate);

        },

        _overlayTapEnd: function (e) {
            if (!this._cancelClose)
                this._closeOpenedPane(this._lModel.defaultTransitionTime);
            ej.listenTouchEvent(this._elementOverlay, ej.endEvent(), this._overlayTapEndDelegate, true);

        },

        _swipeStart: function (e) {
            if(this._isNavPaneOpened==true) return;
            var point = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
            var t = this;
            t._startX = point.clientX;
            t._cancelClose = null;
            t._startTime = new Date();
            t._ap = (point.clientX < t.element.offset().left + t.model.edgeThreshold) ? "left" :
                t._ap = (point.clientX < t.element.offset().left + t.model.edgeThreshold) ? "left" :
                ((point.clientX > t.element.width() - t.model.edgeThreshold) ? "right" : "");
            if (t._isPaneOpen())
                t._ap = t._isPaneOpen();
            if (t._ap && t._panel[t._ap].length) {
                t._tp = t._getTransitionPane(t._ap);
                if ((ej.isLowerResolution() * (t.model.rightPane.showOnTablet))) t._panel.right.hide();
                if ((ej.isLowerResolution() * (t.model.leftPane.showOnTablet))) t._panel.left.hide();
                t._panel[t._ap].show();
                if (t.model.stopEventPropagation && ej.browserInfo().name != "msie") ej.blockDefaultActions(e);
            } else
                return;
            this._on(t.element, "mousemove touchmove MSPointerMove pointermove", this._swipeMoveHandler);
            this._on(t.element, "mouseup touchend MSPointerUp pointerup", this._swipeEndHandler);
            this._on(t.element, "mousecancel touchcancel MSPointerCancel pointercancel", this._swipeEndHandler);
        },

        _swipeMove: function (e) {
            if (this._isNavPaneOpened==true || !this._ap) return;
            var point = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
            var t = this;
            if (t.model.stopEventPropagation && ej.browserInfo().name == "msie") ej.blockDefaultActions(e);
            t._swipeDirection = (t._startX > point.clientX) ? "right" : ((t._startX == point.clientX) ? "" : "left");
            var distanceX = point.clientX - t._startX,
                width = t._panel[t._ap].outerWidth(),
                _sign = (t._ap == "left" ? +1 : -1);
            if (t._panel[t._swipeDirection] && t._panel[t._swipeDirection].length && !t._isPaneOpen()) t._panel[t._swipeDirection].removeClass(t._class.hidden).addClass("e-m-opening");
            if (t._tp && !t._isPaneOpen() && t._ap) {
                distanceX = width <= Math.abs(distanceX) ? _sign * width : distanceX;
                t._transform(distanceX, 0, t._tp)._elementOverlay.removeClass(t._class.hide);
                if (t.model[t._ap + "Pane"].animationType != "overlay")
                    t._elementOverlay.css("opacity", 0);
                else
                    t._elementOverlay.css("opacity", Math.abs(distanceX / t._panel[t._ap].width()) * t._lModel.overlayOpacity);
            } else if (t._tp && t._ap && (t._isPaneOpen() != t._swipeDirection) && t._swipeDirection!="") {
                distanceX = width <= Math.abs(distanceX) ? 0 : (_sign * distanceX) + width;
                t._transform(_sign * distanceX, 0, t._tp);
                t._cancelClose = true;
                if (t.model[t._ap + "Pane"].animationType != "reveal")
                    t._elementOverlay.css("opacity", Math.abs(distanceX / t._panel[t._ap].width()) * t._lModel.overlayOpacity);
            }
            t._movedX = distanceX;
        },

        _swipeEnd: function (e) {
            if(this._isNavPaneOpened==true || this._ap==null || this._ap=="") return;
            var point = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
            var t = this;
            var mX = Math.abs(t._movedX),
                mTime = new Date() - t._startTime,
                fastSwipe = false;
            if (Math.abs(mTime) < 100) fastSwipe = true;
            if (t._panel[t._swipeDirection] && t._panel[t._swipeDirection].length && !t._isPaneOpen()) t._panel[t._swipeDirection].removeClass("e-m-opening");
            mTime = t._getMomentumTime(t._movedX, Math.abs(mTime), t._panel[t._ap].outerWidth());
            mTime = mTime > 500 ? 500 : mTime;
            if ((t._cancelClose && t._swipeDirection) || (mX && !t._isPaneOpen() && t._tp && t._ap)) {
                var width = t._panel[t._ap].outerWidth();
                var distanceX = ((t._ap == "left") ? width : -width);
                var avgDist = (t._panel[t._ap].outerWidth() / 100) * (t._lModel.swipeThreshold);
                if (((avgDist < mX) && !t._cancelClose) || ((avgDist > (width - mX)) && t._cancelClose)) {
                    t._transform(distanceX, (!t._isPaneOpen() && !t._cancelClose ? mTime : t._lModel.defaultTransitionTime), t._tp);
                    opacity = t.model[t._ap + "Pane"].animationType != "overlay" ? 0 :
                        Math.abs(distanceX / t._panel[t._ap].width()) * t._lModel.overlayOpacity;
                    t._elementOverlay.css("opacity", opacity);
                    t._panel[t._ap].addClass(t._class.opened);

                } else {
                    if (!t._cancelClose) {
                        t._transform(0, t._lModel.fastTransitionTime, t._tp)._elementOverlay.addClass(t._class.hide);
                        t._panel[t._ap].addClass(t._class.hidden);
                    } else
                        t._closeOpenedPane((mTime < 100 ? 100 : mTime));

                }
            } else
                t._closeOpenedPane(t._lModel.defaultTransitionTime);

            this._trigger("swipe", {
                direction: t._swipeDirection,
                event: e
            });
            t._lastClientX = t._swipeDirection = t._ap = t._tp = t._movedX = t._startTime = null;
            this._on(t.element, "mousemove touchmove MSPointerMove pointermove", this._swipeMoveHandler);
            this._on(t.element, "mouseup touchend MSPointerUp pointerup", this._swipeEndHandler);
            this._on(t.element, "mousecancel touchcancel MSPointerCancel pointercancel", this._swipeEndHandler);
        },

        _getMomentumTime: function (distance, time, newDistance) {
            return Math.abs(time - Math.abs(newDistance / distance * time));
        },

        _getTransitionPane: function (pane) {
            return ((this.model[pane + "Pane"].animationType == "reveal") ? this._panel.content : this._panel[pane]);
        },

        _isPaneOpen: function () {
            var returnVal = "";
            if (this.element.find("." + this._class.opened).length)
                returnVal = (this.element.children("." + this._class.opened).hasClass("e-m-sp-left") ? "left" : "right");
            return returnVal;
        },

        _isOrientationSupported: function () {
            return ("orientation" in window && "onorientationchange" in window);
        },

        _transform: function (dist, time, element, addClass) {
            if (dist == "none") return this;
            var translate = "-" + this._browser + "-transform",
                translateVal = "translateX(" + dist + "px) translateZ(0px)";
            var trans = "-" + this._browser + "-transition-property",
                transVal = "transform",
                transDur = "-" + this._browser + "-transition-duration",
                transDurVal = time + "ms";
            element.css(trans, transVal).css(transDur, transDurVal).css(translate, translateVal).css("transition-duration", transDurVal);
            if (addClass) element.addClass(addClass);
            return this;
        },

        _closeOpenedPane: function (time) {
            time = time == undefined ? 0 : time;
            if (this._isPaneOpen()) {
                var _pane = this._isPaneOpen();
                var transPane = this._getTransitionPane(_pane),
                    _proxy = this;
                this._elementOverlay.addClass(this._class.hide);
                this._trigger("beforeClose", this._getArgData(_pane));
                transPane.bind(ej.transitionEndEvent(), function () {
                    _proxy._trigger("close", _proxy._getArgData(_pane));
                    if(_proxy._panel.left.length)_proxy._panel.left.removeClass(_proxy._class.hidden);
                    if(_proxy._panel.right.length)_proxy._panel.right.removeClass(_proxy._class.hidden);
                    transPane.unbind(ej.transitionEndEvent());
                });
                this._transform(0, time, transPane).element.children("." + this._class.opened).removeClass(this._class.opened);
            }
            this._isNavPaneOpened=false;
            return this;
        },

        _resize: function () {
            this._closeOpenedPane(0)._setPaneSize();
            this.element.removeClass("e-m-lower e-m-higher").addClass(ej.isLowerResolution() ? "e-m-lower" : "e-m-higher");
        },

        _setPaneSize: function () {
            this._panel.content.css({
                "right": "",
                "left": ""
            });
            if (this._panel.left.length) {
                this._panel.left.css({
                    "width": this.model.leftPane.width,
                    "left": ""
                });

                if (!ej.isLowerResolution() * this.model.leftPane.showOnTablet) {                    
                    this._panel.left.addClass("e-m-exposed").removeClass(this._class.hidden);
                    this._panel.content.css("left", this._panel.left.outerWidth());
                } else {
                    var lwidth=((this.model.leftPane.width !="auto")? "-" + this.model.leftPane.width : -(ej.getDimension(this._panel.left, "width")));
                    if (this.model.leftPane.animationType == "overlay") this._panel.left.css("left", lwidth).addClass(this._class.hidden);
                    this._panel.left.removeClass("e-m-exposed");
                }
            }

            if (this._panel.right.length) {
                this._panel.right.css({
                    "width": this.model.rightPane.width,
                    "right": ""
                });
                if (!ej.isLowerResolution() * this.model.rightPane.showOnTablet) {
                    this._panel.right.addClass("e-m-exposed").removeClass(this._class.hidden);
                    this._panel.content.css("right", this._panel.right.outerWidth());
                } else {
                    var rwidth=((this.model.rightPane.width !="auto")? "-" + this.model.rightPane.width : -(ej.getDimension(this._panel.right, "width")));
                    if (this.model.rightPane.animationType == "overlay") this._panel.right.css("right", rwidth).addClass(this._class.hidden);
                    this._panel.right.removeClass("e-m-exposed");
                }
            }
            //setting splitpane height and width
            this.element.css({
                height: this.model.height,
                width: this.model.width
            });
            return this;
        },

        _setModel: function (options) {
            var refresh = false;
            for (var prop in options) {
                switch (prop) {
                case "renderMode":
                    this._setRenderMode(options.renderMode);
                    break;
                case "cssClass":
                    this.element.removeClass(this._cssClass).addClass(options.cssClass);
                    this._cssClass = options.cssClass;
                    break;
                case "isRelative":
                    this.element.removeClass("e-m-rel e-m-abs").addClass(this.model.isRelative ? "e-m-rel" : "e-m-abs");
                    break;
                case "height":
                case "width":
                    this.element.css({
                        height: this.model.height,
                        width: this.model.width
                    });
                    break;
                case "leftPane":
                case "rightPane":
                case "contentPane":
                    this["_set" + prop.charAt(0).toUpperCase() + prop.slice(1)](options[prop]);
                    break;
                case "edgeThreshold":
                    break;
                }
                if (refresh)
                    this._refresh();
            }
        },

        _setRenderMode: function (mode) {
            if (mode == "auto")
                ej.setRenderMode(this);
            this.element.removeClass("e-m-ios7 e-m-android e-m-windows e-m-flat").addClass("e-m-" + this.model.renderMode);
            this._setPaneSize();
        },

        _setLeftPane: function (options) {
            for (var prop in options) {
                switch (prop) {
                case "animationType":
                    this._panel.left.removeClass("e-m-type-overlay");
                case "width":
                case "showOnTablet":
                    this._setPaneSize();
                    break;
                case "templateId":
                    this._setTemplate(options[prop], "left");
                    break;
                }
            }
        },

        _setRightPane: function (options) {
            for (var prop in options) {
                switch (prop) {
                case "animationType":
                    this._panel.right.removeClass("e-m-type-overlay");
                case "width":
                case "showOnTablet":
                    this._setPaneSize();
                    break;
                case "templateId":
                    this._setTemplate(options[prop], "right");
                    break;
                }
            }
        },

        _setTemplate: function (id, pane) {
            this._closeOpenedPane();
            $("#" + id).removeAttr("class style");
            if (this._panel[pane].length) this._panel[pane].removeAttr("class style").addClass(this._class.hidden);
            this._initPane()._setPaneSize();
        },

        _setContentPane: function (options) {
            for (var prop in options) {
                switch (prop) {
                case "templateId":
                    this._bindSwipeEvent(true);
                    this._setTemplate(options[prop], "content");
                    this._bindSwipeEvent();
                    break;
                }
            }
        },

        _contentTransition: function (e) {
            if ($(e.target).hasClass("new"))
                $(e.target).contents().unwrap();
            if ($(e.target).hasClass("old"))
                $(e.target).remove();
        },

        _getArgData: function (panel) {
            return {
                panel: panel,
                element: this._panel[panel],
                content: this._panel.content
            };
        },

        _isCanOpen: function (pane) {
            return (this.model[pane + "Pane"].showOnTablet == true && ej.isLowerResolution() == false) ? false : true;
        },

        _refresh: function () {
            this._clearElements();
            this._renderControl();
            if (this.model.renderTemplate && ej.angular.defaultAppName) ej.angular.compile(this._layouts);
            this._wireEvents();
        },

        _clearElements: function () {
            this.element.removeAttr("class style");
            if (this._panel.left.length) this._panel.left.removeAttr("class style");
            if (this._panel.content.length) this._panel.content.removeAttr("class style");
            if (this._panel.right.length) this._panel.right.removeAttr("class style");
            if (this._elementOverlay) this._elementOverlay.remove();
            this.element.attr({
                "style": this._orgEleStyle, "class": this._orgEleClass
            }).removeClass(this._rootCSS);
        },

        _destroy: function () {
            this._wireEvents(true);
            this._unbindSwipeEvent();
            this._clearElements();
        },        

        //Public Function
        
        openLeftPane: function (time) {
            if (!this._isPaneOpen() && this._panel.left.length && this._isCanOpen("left")) {
                var transPane = this._getTransitionPane("left"),
                    _proxy = this;
                this._panel.left.removeClass(this._class.hidden);                
                this._trigger("beforeOpen", this._getArgData("left"));
                transPane.bind(ej.transitionEndEvent(), function () {
                    _proxy._trigger("open", _proxy._getArgData("left"));
                    transPane.unbind(ej.transitionEndEvent());
                });                
                this._transform(this._panel.left.outerWidth(), (time ? time : this._lModel.defaultTransitionTime), transPane);
                opacity = this.model.leftPane.animationType != "overlay" ? 0 : this._lModel.overlayOpacity;
                this._elementOverlay.css("opacity", opacity).removeClass(this._class.hide);
                this._panel.left.addClass(this._class.opened);
                this._isNavPaneOpened=true;
                return this;
            }
        },

        openRightPane: function (time) {
            if (!this._isPaneOpen() && this._panel.right.length && this._isCanOpen("right")) {
                var transPane = this._getTransitionPane("right"),
                    _proxy = this;
                this._panel.right.removeClass(this._class.hidden);                
                this._trigger("beforeOpen", this._getArgData("right"));
                transPane.bind(ej.transitionEndEvent(), function () {
                    _proxy._trigger("open", _proxy._getArgData("right"));
                    transPane.unbind(ej.transitionEndEvent());
                });
                this._transform(-this._panel.right.outerWidth(), (time ? time : this._lModel.defaultTransitionTime), transPane);
                opacity = this.model.rightPane.animationType != "overlay" ? 0 : this._lModel.overlayOpacity;
                this._elementOverlay.css("opacity", opacity).removeClass(this._class.hide);
                this._panel.right.addClass(this._class.opened);
                return this;
            }
        },

        closePane: function (time) {
            this._closeOpenedPane((time ? time : this._lModel.defaultTransitionTime));
        }
        
    });

})(jQuery, Syncfusion);