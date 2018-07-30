/**
 * @fileOverview Plugin to style the Html Scrollpanel elements
 * @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
 *  Use of this code is subject to the terms of our license.
 *  A copy of the current license can be obtained at any time by e-mailing
 *  licensing@syncfusion.com. Any infringement will be prosecuted under
 *  applicable laws. 
 * @version 12.1 
 * @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
 */

(function ($, ej, undefined) {
    // mScrollPanel is the plugin name 
    // "m.ScrollPanel" is "namespace.className" will hold functions and properties

    nextFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                return setTimeout(callback, 1);
            };
    })();
    cancelFrame = (function () {
        return window.cancelRequestAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            clearTimeout;
    })();
    ej.widget("ejmScrollPanel", "ej.mobile.ScrollPanel", {
        _setFirst: true,
        _rootCSS: "e-m-scroll",
        angular: {
            terminal: false
        },
        defaults: {
            renderMode: 'auto',            
            enableResize: true,
            targetHeight: null,
            targetWidth: null,
            scrollHeight: "auto",
            scrollWidth: "auto",
            enableFade: true,
            enableShrink: ej.isWindows() ? false : true,
            allowPullToRefresh: false,
            cssClass: null,
            pullToRefreshSettings: {
                thresholdDistance: 75,
                textOnPull: "Pull to Refresh...",
                textOnRelease: "Release to Refresh...",
                textOnRefresh: "Refreshing..."
            },
            isRelative: false,
            wheelSpeed: 16,
            enableInteraction: true,
            enabled: true,
            enableHrScroll: (ej.isWindows() && !ej.isMobile()) ? true : false,
            enableVrScroll: true,
            eventPassthrough: null,
            translateZ: ej.browserInfo()["name"] == "msie" ? '' : $.support.has3d ? ' translateZ(0)' : '',
            zoomMin: 1,
            zoomMax: 6,
            startZoom: 1,
            startX: 0,
            startY: 0,
            enableDisplacement: false,
            displacementValue: 94,
            displacementTime: 800,
            deceleration: null,
            disableTouch: false,
            directionLockThreshold: 5,
            scrollEndThresholdDistance: 5,
            momentum: true,
            enableBounce: ej.isAndroid() ? false : true,
            bounceTime: 450,
            bounceEasing: '',
            preventDefault: true,
            preventDefaultException: {
                tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
            },
            enableTransition: true,
            enableTransform: true,
            showScrollbars: true,
            enableMouseWheel: true,
            enableKeys: true,
            enableZoom: false,
            enableNativeScrolling: (ej.isAndroid() || ej.isIOS()) ? false : ej.isDevice() ? true : false,
            invertWheel: false,
            scrollStart: null,
            scroll: null,
            scrollStop: null,
            scrollEnd: null,
            zoomStart: null,
            zoomEnd: null,
            pull: null,
            target: null
        },
        dataTypes: {},

        _init: function () {
            ej.setRenderMode(this);
            this._createDelegates();
            if (this.model.enableDisplacement && ej.isWindows())
                this.model.deceleration = 0.00006;
            this._eventType = {
                touchstart: 1,
                touchmove: 1,
                touchend: 1,
                ejtouchmove: 3,
                mousedown: 2,
                mousemove: 2,
                mouseup: 2,
                MSPointerDown: 3,
                MSPointerMove: 3,
                MSPointerUp: 3,
                pointerdown: 3,
                pointermove: 3,
                pointerup: 3
            };
            this._scrollEvents = {
                scrollStop: [this.model.scrollStop],
                scroll: [this.model.scroll],
                scrollStart: [this.model.scrollStart],
                zoomStart: [this.model.zoomStart],
                zoomEnd: [this.model.zoomEnd]
            };
            this._scale = Math.min(Math.max(this.model.startZoom, this.model.zoomMin), this.model.zoomMax);
            if (this.model.target)
                this._wrapper = typeof this.model.target == 'string' ? $("#" + this.model.target)[0] : this.model.target;
            else
                this._wrapper = this.element[0];
            this._$wrapper = $(this._wrapper);
            this._$wrapper.wrapInner("<div>")
            if (this._wrapper) this._scroller = this._wrapper.children[0];
            if (!this._scroller) return;
            this._aniTime = null;
            $(this._scroller).addClass("e-m-scrollcontent e-m-user-select").css({
                height: this.model.scrollHeight,
                width: this.model.scrollWidth
            });

            if (this.model.target) this._$wrapper.append(this.element);
            this._$wrapper.addClass("e-m-scrollpanel " + (this.model.isRelative ? "e-m-rel" : "e-m-abs") + (this.model.cssClass ? " " + this.model.cssClass : "") + " e-m-" + this.model.renderMode);
            this.element.addClass("e-m-scroll");
            if (this.model.enableNativeScrolling) {
                this.refresh();
                this._$wrapper.addClass('e-m-scroll-native e-m-scroll-wrapper');
                if (this.model.renderMode == "ios7" || this.model.renderMode == "android")
                    $(this._scroller).addClass('e-m-scroll-content');
                this._scroller[ej.transform] = 'translate(' + 0 + 'px,' + 0 + 'px)';
                if (((!this._hasVScroll && this._maxScrollY == 0) || (!this._hasHScroll && this._maxScrollX == 0)) && this.model.renderMode == "ios7")
                    this._$wrapper.addClass('e-m-scroll-box');
                if (!this.model.showScrollbars)
                    this._$wrapper.addClass('e-m-scroll-hide');
                if (!this.model.enableZoom)
                    this._$wrapper.addClass('e-m-zoom');
            } else {
                var proxy = this;
                this._scrollerStyle = this._scroller.style;
                this.model.enableTransition = $.support.hasTransition && this.model.enableTransition;
                this.model.enableTransform = $.support.hasTransform && this.model.enableTransform;
                this.model.eventPassthrough = this.model.eventPassthrough === true ? 'vertical' : this.model.eventPassthrough;
                this.model.preventDefault = !this.model.eventPassthrough && this.model.preventDefault;
                this.model.enableVrScroll = this.model.eventPassthrough == 'vertical' ? false : this.model.enableVrScroll;
                this.model.enableHrScroll = this.model.eventPassthrough == 'horizontal' ? false : this.model.enableHrScroll;
                this.model.directionLockThreshold = this.model.eventPassthrough ? 0 : this.model.directionLockThreshold;
                this.model.invertWheel = this.model.invertWheel ? -1 : 1;
                this._x = this._y = this._directionX = this._directionY = this._startX = this._startY = 0;
                this._createRefresher();
                if (this.model.enableZoom)
                    this._scrollerStyle[ej.transformOrigin] = '0 0';
                if (this.model.showScrollbars)
                    this._initScrollbars();
                if (this.model.enableMouseWheel)
                    this._initWheel();
                if (this.model.enableKeys)
                    this._initKeys();
                this.refresh();
                this.scrollTo(this.model.startX, this.model.startY);
            }
            this._wireEvents();
        },
        _createRefresher: function () {
            if (this.model.allowPullToRefresh) {
                var refreshEle = ej.buildTag("div.e-m-scroll-refresher", '<span class="e-m-scroll-refreshcontent"><span class="e-m-left"><span class="e-m-icon e-m-pull"></span></span><span class="e-m-right e-m-text">' + this.model.pullToRefreshSettings.textOnPull + '</span></span>')
                $(this._scroller).prepend(refreshEle);
                this._refresherElement = $(this._scroller).find(".e-m-scroll-refresher");
                this._refresherIcon = this._refresherElement.find(".e-m-icon");
                this._refresherText = this._refresherElement.find(".e-m-text");
            }
        },

        _dataValue: function () {
            return data = {
                x: this.model.enableNativeScrolling ? this._nx : this._x,
                y: this.model.enableNativeScrolling ? this._ny : this._y,
                object: this
            };
        },

        _transitionEnd: function (e) {
            if (e.target != this._scroller || !this._isInTransition) return;
            this._transitionTime();
            if (!this.resetPosition(this.model.bounceTime)) {
                this._moved = this._isInTransition = false;
                this._triggerEvent('scrollStop', this._dataValue());
                if (this._y - this.model.scrollEndThresholdDistance <= this._maxScrollY)
                    this._trigger('scrollEnd', $.extend(this._dataValue(), {
                        position: "bottom"
                    }));
                if (this._y >= -this.model.scrollEndThresholdDistance)
                    this._trigger('scrollEnd', $.extend(this._dataValue(), {
                        position: "top"
                    }));
            }

        },

        _touchStart: function (e) {
            if ($(e.target).parents(".e-m-scrollpanel").length > 1 && $(e.target).closest(".e-m-scrollpanel")[0] != this._wrapper) return;
            if (this._lockRefresh) return;
            var point = e.touches ? e.touches[0] : e,
                pos;
            if (this.model.enableNativeScrolling) {
                this._moved = false;
                if (this.model.renderMode == "ios7" || this.model.renderMode == "android") {
                    startY = point.pageY;
                    startTopScroll = this._wrapper.scrollTop;
                    if (startTopScroll <= 0)
                        this._wrapper.scrollTop = 1;
                    if (startTopScroll + this._wrapper.offsetHeight >= this._wrapper.scrollHeight)
                        this._wrapper.scrollTop = this._wrapper.scrollHeight - this._wrapper.offsetHeight - 1;
                }
                return;
            }

            if ((this._eventType[e.type] != 1 && e.button !== 0) || (!this.model.enabled || (this._startedScroll && this._eventType[e.type] !== this._startedScroll)))
                return;

            ej.listenEvents([window, window, window], [ej.moveEvent(), ej.cancelEvent(), ej.endEvent()], [this._touchMoveHandler, this._touchEndHandler, this._touchEndHandler],
                false, this, this.model.disableMouse);


            if (this.model.preventDefault && !ej.isDevice() && !ej._preventDefaultException(e.target, this.model.preventDefaultException)) {
                e.preventDefault();
            }
            if (this.model.preventDefault && this._moved) {
                ej.blockDefaultActions(e);
            }


            this._startedScroll = this._eventType[e.type];
            this._distX = this._distY = this._directionX = this._directionY = this._lockedDir = 0;
            this._transitionTime();
            this._startTime = this._getTime();
            if (this.model.enableTransition && this._isInTransition) {
                this._isInTransition = false;
                pos = this.getComputedPosition();
                this._translate(Math.round(pos.x), Math.round(pos.y));
                this._triggerEvent('scrollStop', this._dataValue());
            } else if (!this.model.enableTransition && this._animating) {
                cancelFrame(this._aniTime);
                this._steps = [];
                this._animating = false;
                this._translate(this._wrapper.scrollLeft, this._wrapper.scrollTop);
                this._triggerEvent('scrollStop', this._dataValue());
            }
            this._moved = false;
            this._startX = this._x;
            this._startY = this._y;
            this._absStartX = this._x;
            this._absStartY = this._y;
            this._pointX = point.pageX;
            this._pointY = point.pageY;
            if (this.model.enableZoom && e.touches && e.touches.length > 1)
                this._zoomStart(e);
            if (this._oldScrollX != this._scroller.scrollWidth || this._oldScrollY != this._scroller.scrollHeight)
                this._calculateXY()._refreshScrollbar();

        },

        _scrollStart: function (e) {
            this._moved = false;
            this._nx = this._$wrapper.scrollLeft();
            this._ny = this._$wrapper.scrollTop();
            this._trigger('scrollStart', this._dataValue());
        },

        _touchMove: function (e) {
            if (!this.model.enabled || this._eventType[e.type] !== this._startedScroll) return;
            if (this.model.preventDefault) e.preventDefault();
            if (this.model.enableZoom && e.touches && e.touches[1]) {
                this._zoom(e);
                return;
            }
            var point = e.touches ? e.touches[0] : e,
                deltaX = point.pageX - this._pointX,
                deltaY = point.pageY - this._pointY,
                timestamp = this._getTime(),
                newX, newY, absDistX, absDistY;
            this._pointX = point.pageX;
            this._pointY = point.pageY;
            this._distX += deltaX;
            this._distY += deltaY;
            absDistX = Math.abs(this._distX);
            absDistY = Math.abs(this._distY);
            if (timestamp - this._endTime > 300 && (absDistX < 10 && absDistY < 10)) return;
            if (!this._lockedDir) {
                if (absDistX > absDistY + this.model.directionLockThreshold)
                    this._lockedDir = 'horizontal';
                else if (absDistY >= absDistX + this.model.directionLockThreshold)
                    this._lockedDir = 'vertical';
                else
                    this._lockedDir = 'none';
            }
            if (this._lockedDir == 'horizontal') {
                if (this.model.eventPassthrough == 'vertical')
                    e.preventDefault();
                else if (this.model.eventPassthrough == 'horizontal') {
                    this._startedScroll = false;
                    return;
                }
                deltaY = 0;
            } else if (this._lockedDir == 'vertical') {
                if (this.model.eventPassthrough == 'horizontal')
                    e.preventDefault();
                else if (this.model.eventPassthrough == 'vertical') {
                    this._startedScroll = false;
                    return;
                }
                deltaX = 0;
            }

            deltaX = (this.model.enableHrScroll || this._hasHScroll) ? deltaX : 0;
            deltaY = (this.model.enableVrScroll || this._hasVScroll) ? deltaY : 0;
            newX = this._x + deltaX;
            newY = this._y + deltaY;
            if (newX > 0 || newX < this._maxScrollX) {
                newX = this.model.enableBounce ? this._x + deltaX / 3 : newX > 0 ? 0 : this._maxScrollX;
            }
            if (newY > 0 || newY < this._maxScrollY) {
                newY = this.model.enableBounce ? this._y + deltaY / 3 : newY > 0 ? 0 : this._maxScrollY;
            }
            this._directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
            this._directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;
            if (this.model.allowPullToRefresh && !this._lockRefresh) {
                this._refresherIcon[(newY >= this.model.pullToRefreshSettings.thresholdDistance ? "addClass" : "removeClass")]("e-m-rotate");
                this._refresherText.text(newY >= this.model.pullToRefreshSettings.thresholdDistance ? this.model.pullToRefreshSettings.textOnRelease : this.model.pullToRefreshSettings.textOnPull);
            }
            this._translate(newX, newY);
            if (timestamp - this._startTime > 300) {
                this._startTime = timestamp;
                this._startX = this._x;
                this._startY = this._y;
            }
            if (!this._moved)
                this._triggerEvent('scrollStart', this._dataValue());
            else
                this._triggerEvent('scroll', this._dataValue());
            this._moved = ((this._lockedDir != 'none') ? true : false);
        },

        _scroll: function (e) {
            this._moved = true;
            this._nx = this._$wrapper.scrollLeft();
            this._ny = this._$wrapper.scrollTop();
            this._trigger('scroll', this._dataValue());
            proxy = this;
            clearTimeout(this._wheelEndTimeout);
            this._wheelEndTimeout = setTimeout(function () {
                proxy._trigger('scrollStop', proxy._dataValue());
                if ((Math.abs(proxy._maxScrollY) - proxy.model.scrollEndThresholdDistance) <= proxy._ny)
                    proxy._trigger('scrollEnd', $.extend(proxy._dataValue(), {
                        position: "bottom"
                    }));
                if (proxy._ny <= proxy.model.scrollEndThresholdDistance)
                    proxy._trigger('scrollEnd', $.extend(proxy._dataValue(), {
                        position: "top"
                    }));
            }, 200);

        },

        _touchEnd: function (e) {
            ej.listenEvents([window, window, window], [ej.moveEvent(), ej.cancelEvent(), ej.endEvent()], [this._touchMoveHandler, this._touchEndHandler, this._touchEndHandler],
                true, this, this.model.disableMouse);
            if (!this.model.enabled || this._eventType[e.type] !== this._startedScroll) return;
            if (this.model.preventDefault && !ej.isDevice() && !ej._preventDefaultException(e.target, this.model.preventDefaultException))
                e.preventDefault();
            if (this.model.enableNativeScrolling && this._moved) {
                ej.blockDefaultActions(e);
                this._moved = false;
                return;
            }
            if (this._scaled) {
                this._zoomEnd(e);
                return;
            }
            var point = e.changedTouches ? e.changedTouches[0] : e,
                momentumX,
                momentumY,
                duration = this._getTime() - this._startTime,
                newX = Math.round(this._x),
                newY = Math.round(this._y),
                distanceX = Math.abs(newX - this._startX),
                distanceY = Math.abs(newY - this._startY),
                time = 0,
                easing = '';
            this._isInTransition = this._startedScroll = 0;
            this._endTime = this._getTime();
            if (this.model.allowPullToRefresh) {
                this._lockRefresh = this._refresherIcon.hasClass("e-m-rotate");
                if (this._lockRefresh) {
                    this._refresherText.text(this.model.pullToRefreshSettings.textOnRefresh);
                    this._refresherIcon.removeClass("e-m-pull").addClass("e-m-refresh");
                }
            }

            if (this.resetPosition(this.model.bounceTime)) {
                if (this._lockRefresh)
                    this._trigger('pull', {
                        Obj: this.element.data("ejmScrollPanel")
                    });
                return;
            }
            if (this.model.momentum && duration < 500 && this._moved) {
                momentumX = this._hasHScroll ? ej._nativeMomentum(this._x, this._startX, duration, this._maxScrollX, this.model.enableBounce ? this._wrpWd : 0, this.model.deceleration, ej.isWindows() ? 10 : 1) : {
                    dest: newX,
                    duration: 0
                };
                momentumY = this._hasVScroll ? ej._nativeMomentum(this._y, this._startY, duration, this._maxScrollY, this.model.enableBounce ? this._wrpHt : 0, this.model.deceleration, ej.isWindows() ? 10 : 1) : {
                    dest: newY,
                    duration: 0
                };
                newX = momentumX.dest;
                newY = momentumY.dest;
                time = Math.max(momentumX.duration, momentumY.duration);
                if((newX !=0 && newX != this._maxScrollX) ||  (newY !=0 && newY != this._maxScrollY))
                    this._isInTransition = 1;
            }

            if (this.model.displacementValue && this.model.enableDisplacement) {
                newY = this.model.displacementValue * Math.round(newY / this.model.displacementValue);
                newX = this.model.displacementValue * Math.round(newX / this.model.displacementValue);

                if (time < this.model.displacementTime)
                    time = this.model.diplacementTime;
            }
            if (newY < this._maxScrollY && Math.abs(this._y))
                newY = this._maxScrollY;
            if (newX < this._maxScrollX)
                newX = this._maxScrollX;
            if (this._moved && !this._isInTransition)
                this._trigger('scrollStop', this._dataValue());
            if (newX != this._x || newY != this._y) {
                if (newX > 0 || newX < this._maxScrollX || newY > 0 || newY < this._maxScrollY) {
                    easing = ej.ease.quadratic;
                }
                this.scrollTo(newX, newY, time, easing);
                return;
            }
            this._moved = false;
        },

        _scrollStop: function (e) {
            this._nx = this._$wrapper.scrollLeft();
            this._ny = this._$wrapper.scrollTop();
            this._trigger('scrollStop', this._dataValue());
        },

        _zoomStart: function (e) {
            var c1 = Math.abs(e.touches[0].pageX - e.touches[1].pageX),
                c2 = Math.abs(e.touches[0].pageY - e.touches[1].pageY);

            this._touchesDistanceStart = Math.sqrt(c1 * c1 + c2 * c2);
            this._startScale = this._scale;

            this._originX = Math.abs(e.touches[0].pageX + e.touches[1].pageX) / 2 + this._wrapperOffset.left - this._x;
            this._originY = Math.abs(e.touches[0].pageY + e.touches[1].pageY) / 2 + this._wrapperOffset.top - this._y;
            if (this.model.allowPullToRefresh) this._refresherElement.css("display", "none");
            this._triggerEvent('zoomStart', this._dataValue());
        },

        _zoom: function (e) {

            if (!this.model.enabled || this._eventType[e.type] !== this._startedScroll) return;

            if (this.model.preventDefault) e.preventDefault();


            var c1 = Math.abs(e.touches[0].pageX - e.touches[1].pageX),
                c2 = Math.abs(e.touches[0].pageY - e.touches[1].pageY),
                distance = Math.sqrt(c1 * c1 + c2 * c2),
                scale = 1 / this._touchesDistanceStart * distance * this._startScale,
                lastScale,
                x, y;

            this._scaled = true;

            if (scale < this.model.zoomMin)
                scale = 0.5 * this.model.zoomMin * Math.pow(2.0, scale / this.model.zoomMin);
            else if (scale > this.model.zoomMax)
                scale = 2.0 * this.model.zoomMax * Math.pow(0.5, this.model.zoomMax / scale);


            lastScale = scale / this._startScale;
            x = this._originX - this._originX * lastScale + this._startX;
            y = this._originY - this._originY * lastScale + this._startY;

            this._scale = scale;

            this.scrollTo(x, y, 0);
        },

        _zoomEnd: function (e) {
            if (!this.model.enabled || this._eventType[e.type] !== this._startedScroll) return;

            if (this.model.preventDefault) e.preventDefault();


            var newX, newY, lastScale;

            this._isInTransition = this._startedScroll = 0;

            if (this._scale > this.model.zoomMax)
                this._scale = this.model.zoomMax;
            else if (this._scale < this.model.zoomMin)
                this._scale = this.model.zoomMin;

            // Update boundaries
            this.refresh();

            lastScale = this._scale / this._startScale;

            newX = this._originX - this._originX * lastScale + this._startX;
            newY = this._originY - this._originY * lastScale + this._startY;

            if (newX > 0)
                newX = 0;
            else if (newX < this._maxScrollX)
                newX = this._maxScrollX;

            if (newY > 0)
                newY = 0;
            else if (newY < this._maxScrollY)
                newY = this._maxScrollY;

            if (this._x != newX || this._y != newY)
                this.scrollTo(newX, newY, this.model.bounceTime);

            this._scaled = false;
            if (this.model.allowPullToRefresh) this._refresherElement.css("display", "");
            this._triggerEvent('zoomEnd', this._dataValue());
        },

        _resize: function () {
            if (!this._$wrapper.is(":visible")) return;
            var proxy = this;
            clearTimeout(this._resizeTimeout);
            this._resizeTimeout = setTimeout(function () {
                proxy.refresh();
            }, ej.isAndroid() ? 250 : 0);
        },

        _scrollable: function () {
            return $(this._wrapper).map(function () {
                var elem = this,
                    isWin = !elem.nodeName || $.inArray(elem.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) != -1;

                if (!isWin) return elem;

                var doc = (elem.contentWindow || elem).document || elem.ownerDocument || elem;

                return /webkit/i.test(navigator.userAgent) || doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;
            });
        },

        _both: function (val) {
            return $.isFunction(val) || typeof val == 'object' ? val : {
                top: val,
                left: val
            };
        },

        _scrollTo: function (target, duration, settings) {
            var proxy = this;
            if (typeof duration == 'object') {
                settings = duration;
                duration = 0;
            }
            if (typeof settings == 'function')
                settings = {
                    onAfter: settings
                };

            if (target == 'max')
                target = 9e9;

            settings = $.extend({}, {
                axis: 'xy',
                duration: 0,
                limit: true
            }, settings);
            duration = duration || settings.duration;
            settings.queue = settings.queue && settings.axis.length > 1;

            if (settings.queue)
                duration /= 2;
            settings.offset = this._both(settings.offset);
            settings.over = this._both(settings.over);

            return this._scrollable().each(function () {
                if (target == null) return;

                var elem = this,
                    $elem = $(elem),
                    targ = target,
                    toff, attr = {},
                    win = $elem.is('html,body');

                switch (typeof targ) {
                case 'number':
                case 'string':
                    if (/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)) {
                        targ = this._both(targ);
                        break;
                    }
                    targ = $(targ, this);
                    if (!targ.length) return;
                case 'object':
                    if (targ.is || targ.style)
                        toff = (targ = $(targ)).offset();
                }

                var offset = $.isFunction(settings.offset) && settings.offset(elem, targ) || settings.offset;

                $.each(settings.axis.split(''), function (i, axis) {
                    var Pos = axis == 'x' ? 'Left' : 'Top',
                        pos = Pos.toLowerCase(),
                        key = 'scroll' + Pos,
                        old = elem[key],
                        max = proxy._scrollToMax(elem, axis);

                    if (toff) {
                        attr[key] = toff[pos] + (win ? 0 : old - $elem.offset()[pos]);

                        if (settings.margin) {
                            attr[key] -= parseInt(targ.css('margin' + Pos)) || 0;
                            attr[key] -= parseInt(targ.css('border' + Pos + 'Width')) || 0;
                        }

                        attr[key] += offset[pos] || 0;

                        if (settings.over[pos])
                            attr[key] += targ[axis == 'x' ? 'width' : 'height']() * settings.over[pos];
                    } else {
                        var val = targ[pos];
                        attr[key] = val.slice && val.slice(-1) == '%' ?
                            parseFloat(val) / 100 * max : val;
                    }

                    if (settings.limit && /^\d+$/.test(attr[key]))
                        attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max);

                    if (!i && settings.queue) {
                        if (old != attr[key])
                            animate(settings.onAfterFirst);
                        delete attr[key];
                    }
                });

                animate(settings.onAfter);

                function animate(callback) {
                    $elem.animate(attr, duration, settings.easing, callback && function () {
                        callback.call(this, targ, settings);
                    });
                };

            }).end();
        },
        _scrollToMax: function (elem, axis) {
            var Dim = axis == 'x' ? 'Width' : 'Height',
                scroll = 'scroll' + Dim;

            if (!$(elem).is('html,body')) return elem[scroll] - $(elem)[Dim.toLowerCase()]();

            var size = 'client' + Dim,
                html = elem.ownerDocument.documentElement,
                body = elem.ownerDocument.body;

            return Math.max(html[scroll], body[scroll]) - Math.min(html[size], body[size]);
        },
        _transitionTime: function (time) {

            if (ej.getAndroidVersion() && ej.getAndroidVersion() <= 4) return;

            time = time || 0;
            this._scrollerStyle[ej.transitionDuration] = time + 'ms';
            if (this._scrollbars)
                for (var i = this._scrollbars.length; i--;)
                    this._scrollbars[i].transitionTime(time);
        },

        _transitionTimingFunction: function (easing) {
            this._scrollerStyle[ej.transitionTimingFunction] = easing;
            if (this._scrollbars)
                for (var i = this._scrollbars.length; i--;)
                    this._scrollbars[i].transitionTimingFunction(easing);
        },

        _translate: function (x, y) {
            if (this.model.enableTransform)
                this._scrollerStyle[ej.transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this._scale + ')';
            else {
                $(this._wrapper).scrollTop(Math.abs(y));
                $(this._wrapper).scrollLeft(Math.abs(x));
            }
            this._x = x;
            this._y = this.model.enableTransform ? y : -Math.abs(y);
            if (this._scrollbars) {
                for (var i = this._scrollbars.length; i--;) {
                    this._scrollbars[i].setPosition();
                }
            }

        },

        _createDelegates: function () {
            this._resizeHandler = $.proxy(this._resize, this);
            this._touchStartHandler = $.proxy(this._touchStart, this);
            this._touchMoveHandler = $.proxy(this._touchMove, this);
            this._touchEndHandler = $.proxy(this._touchEnd, this);
            this._transitionEndHandler = $.proxy(this._transitionEnd, this);
            this._scrollStartHandler = $.proxy(this._scrollStart, this);
            this._scrollHandler = $.proxy(this._scroll, this);
            this._scrollStopHandler = $.proxy(this._scrollStop, this);
            this._wheelDelegate = $.proxy(this._wheel, this);
        },

        _isWinrt: function () {
            return (!this.model.enableTransform && ej.isWindows() && !ej.isMobile())
        },

        _wireEvents: function (remove) {
            var bind = remove ? "off" : "on";
            var evt = "onorientationchange" in window ? "orientationchange" : "resize";
            ej.listenTouchEvent(window, evt, this._resizeHandler, remove);
            if (!this.model.disableTouch)
                ej.listenTouchEvent(this._scroller, ej.startEvent(), this._touchStartHandler, remove, this, this.model.disableMouse);
            if (this.model.enableNativeScrolling) {
                $(this._wrapper).bind("scroll", this._scrollHandler);
            }
            ej.listenTouchEvent(this._scroller, ej.transitionEndEvent(), this._transitionEndHandler, remove);
        },

        _initScrollbars: function () {
            var interactive = this.model.enableInteraction,
                showScrollbars = [],
                scrollbar;
            this._scrollbars = [];

            if (this.model.showScrollbars) {
                // Vertical scrollbar
                if (this.model.enableVrScroll) {
                    scrollbar = {
                        el: this._createDefaultScrollbar('vertical', interactive, this.model.showScrollbars),
                        enableInteraction: interactive,
                        enableShrink: (this.model.enableShrink ? "scale" : false),
                        enableFade: this.model.enableFade,
                        enableResize: this.model.enableResize,
                        listenX: false
                    };
                    this._wrapper.appendChild(scrollbar.el);
                    showScrollbars.push(scrollbar);
                    this.element.append(this._sbw);
                }

                // Horizontal scrollbar
                if (this.model.enableHrScroll) {
                    scrollbar = {
                        el: this._createDefaultScrollbar('horizontal', interactive, this.model.showScrollbars),
                        enableInteraction: interactive,
                        enableShrink: (this.model.enableShrink ? "scale" : false),
                        enableFade: this.model.enableFade,
                        enableResize: this.model.enableResize,
                        listenY: false
                    };

                    this._wrapper.appendChild(scrollbar.el);
                    showScrollbars.push(scrollbar);
                    this.element.append(this._sbw);
                }
            }

            if (this.model.showScrollbars) {
                showScrollbars = showScrollbars.concat();
            }

            for (var i = showScrollbars.length; i--;) {
                this._scrollbars[i] = new Scrollbar(this, showScrollbars[i]);
            }
            if (this.model.enableFade) {
                this.on('scrollStop', function (args) {
                    if (args.model.showScrollbars) {
                        for (var i = args.object._scrollbars.length; i--;) {
                            args.object._scrollbars[i].enableFade();
                        }
                    }
                });

                this.on('scrollCancel', function (args) {
                    if (args.model.showScrollbars) {
                        for (var i = args.object._scrollbars.length; i--;) {
                            args.object._scrollbars[i].enableFade();
                        }
                    }
                });

                this.on('scrollStart', function (args) {
                    if (args.model.showScrollbars) {
                        for (var i = args.object._scrollbars.length; i--;) {
                            args.object._scrollbars[i].enableFade(1);
                        }
                    }
                });
            }
            this.on('refresh', function (args) {
                if (args.model.showScrollbars) {
                    for (var i = args.object._scrollbars.length; i--;) {
                        args.object._scrollbars[i].refresh();
                    }
                }
            });

            this.on('destroy', function (args) {
                if (args.model.showScrollbars) {
                    for (var i = args.object._scrollbars.length; i--;) {
                        args.object._scrollbars[i].destroy();
                    }
                }

                delete this._scrollbars;
            });
        },

        _refreshScrollbar: function () {
            if (this.model.showScrollbars && this._scrollbars) {
                for (var i = this._scrollbars.length; i--;) {
                    this._scrollbars[i].refresh();
                }
            }
        },

        _triggerEvent: function (type, data) {
            if (!this._scrollEvents[type]) {
                return;
            }

            var i = 0,
                l = this._scrollEvents[type].length;

            if (!l) {
                return;
            }
            for (; i < l; i++) {
                this._triggerInternalEvent(this._scrollEvents[type][i], type, data, this);
            }
        },
        _triggerInternalEvent: function (type, event, data, element) {
            if (type) {
                var fn = type;
                if (typeof fn === "string")
                    fn = ej.util.getObject(fn, window);
                event = $.Event(event);
                event.type = type;
                args = ej.event(event, this.model, data);
                return !($.isFunction(fn) && fn.call(this, args) === false || event.isDefaultPrevented());
            }
        },
        _initWheel: function () {
            var proxy = this;
            this._bindWheelEvents();
            this.on('destroy', function () {
                proxy._bindWheelEvents(remove);
            });
        },
        _bindWheelEvents: function (remove) {
            ej.listenEvents([this._wrapper, this._wrapper], ["mousewheel", "DOMMouseScroll"], [this._wheelDelegate, this._wheelDelegate], remove);
        },
        _wheel: function (e) {
            if (!this.model.enabled) return;

            e.preventDefault();

            var wheelDeltaX, wheelDeltaY,
                newX, newY,
                proxy = this;

            if (this.wheelTimeout === undefined) {
                this._triggerEvent('scrollStart', this._dataValue());
            };
            clearTimeout(this.wheelTimeout);
            this.wheelTimeout = setTimeout(function () {
                proxy._triggerEvent('scrollStop', proxy._dataValue());
            }, 400);
            if ('deltaX' in e) {
                wheelDeltaX = -e.deltaX;
                wheelDeltaY = -e.deltaY;
            }
            if ('wheelDeltaX' in e) {
                wheelDeltaX = e.wheelDeltaX / 120;
                wheelDeltaY = e.wheelDeltaY / 120;
            } else if ('wheelDelta' in e) {
                wheelDeltaX = wheelDeltaY = e.wheelDelta / 120;
            } else if ('detail' in e) {
                wheelDeltaX = wheelDeltaY = -e.detail / 3;
            } else {
                if (wheelDeltaX == undefined)
                    return;
            }

            wheelDeltaX *= this.model.wheelSpeed;
            wheelDeltaY *= this.model.wheelSpeed;

            if (!this._hasVScroll) {
                wheelDeltaX = wheelDeltaY;
                wheelDeltaY = 0;
            }

            newX = this._x + Math.round(this._hasHScroll ? wheelDeltaX * this.model.invertWheel : 0);
            newY = this._y + Math.round(this._hasVScroll ? wheelDeltaY * this.model.invertWheel : 0);
            if (newX > 0) {
                newX = 0;
            } else if (newX < this._maxScrollX) {
                newX = this._maxScrollX;
            }
            if (newY > 0) {
                newY = 0;
            } else if (newY < this._maxScrollY) {
                newY = this._maxScrollY;
            }

            clearTimeout(this._wheelEndTimeout);
            this._wheelEndTimeout = setTimeout(function () {
                if (proxy._y - proxy.model.scrollEndThresholdDistance <= proxy._maxScrollY)
                    proxy._trigger('scrollEnd', $.extend(proxy._dataValue(), {
                        position: "bottom"
                    }));
                if (proxy._y >= -proxy.model.scrollEndThresholdDistance)
                    proxy._trigger('scrollEnd', $.extend(proxy._dataValue(), {
                        position: "top"
                    }));
            }, 400);

            this.scrollTo(newX, newY, 0);
        },
        _initKeys: function (e) {
            var keys = {
                pageUp: 33,
                pageDown: 34,
                end: 35,
                home: 36,
                left: 37,
                up: 38,
                right: 39,
                down: 40
            };
            var i;
            if (typeof this.model.enableKeys == 'object') {
                for (i in this.model.enableKeys) {
                    if (typeof this.model.enableKeys[i] == 'string') {
                        this.mdoel.enableKeys[i] = this.model.enableKeys[i].toUpperCase().charCodeAt(0);
                    }
                }
            } else {
                this.model.enableKeys = {};
            }
            for (i in keys) {
                this.model.enableKeys[i] = this.model.enableKeys[i] || keys[i];
            }
            this._keyDownDelegate = $.proxy(this._keyPress, this);
            ej.listenTouchEvent(window, "keydown", this._keyDownDelegate);
        },
        _startAni: function () {
            var proxy = this,
                startX = this._startX,
                startY = this._startY,
                startTime = Date.now(),
                step, easeOut,
                animate;

            var proxy = this;
            if (this._animating) return;

            if (!this._steps.length) {
                this.resetPosition(400);
                return;
            }

            step = this._steps.shift();

            if (step.x == startX && step.y == startY) step.time = 0;

            this._animating = true;
            this._moved = true;

            animate = function () {
                var now = Date.now(),
                    newX, newY;
                if (now >= startTime + step.time) {
                    proxy._translate(step.x, step.y);
                    proxy._animating = false;
                    proxy._moved = false;
                    if (proxy.model.scrollStop) proxy._triggerEvent('scrollStop', proxy._dataValue());
                    proxy._startAni();
                    return;
                }

                now = (now - startTime) / step.time - 1;
                easeOut = Math.sqrt(1 - now * now);
                newX = (step.x - startX) * easeOut + startX;
                newY = (step.y - startY) * easeOut + startY;
                proxy._translate(newX, newY);
                if (proxy._animating) proxy._aniTime = nextFrame(animate);
            };

            animate();
        },
        _keyPress: function (e) {
            if (!this.model.enabled) {
                return;
            }
            var newX = this._x,
                newY = this._y,
                now = this._getTime(),
                prevTime = this._keyTime || 0,
                acceleration = 0.250,
                pos;
            if (this.model.enableTransition && this._isInTransition) {
                pos = this.getComputedPosition();

                this._translate(Math.round(pos.x), Math.round(pos.y));
                this._isInTransition = false;
            }
            this._keyAcc = now - prevTime < 200 ? Math.min(this._keyAcc + acceleration, 50) : 0;
            switch (e.keyCode) {
            case this.model.enableKeys.pageUp:
                if (this._hasHScroll && !this._hasVScroll) {
                    newX += this._wrpWd;
                } else {
                    newY += this._wrpHt;
                }
                break;
            case this.model.enableKeys.pageDown:
                if (this._hasHScroll && !this._hasVScroll) {
                    newX -= this._wrpWd;
                } else {
                    newY -= this._wrpHt;
                }
                break;
            case this.model.enableKeys.end:
                newX = this._maxScrollX;
                newY = this._maxScrollY;
                break;
            case this.model.enableKeys.home:
                newX = newY = 0;
                break;
            case this.model.enableKeys.left:
                newX += 5 + this._keyAcc >> 0;
                break;
            case this.model.enableKeys.up:
                newY += 5 + this._keyAcc >> 0;
                break;
            case this.model.enableKeys.right:
                newX -= 5 + this._keyAcc >> 0;
                break;
            case this.model.enableKeys.down:
                newY -= 5 + this._keyAcc >> 0;
                break;
            default:
                return;
            }

            if (newX > 0) {
                newX = this.keyAcceleration = 0;
            } else if (newX < this._maxScrollX) {
                newX = this._maxScrollX;
                this._keyAcc = 0;
            }

            if (newY > 0) {
                newY = this._keyAcc = 0;
            } else if (newY < this._maxScrollY) {
                newY = this._maxScrollY;
                this._keyAcc = 0;
            }

            this.scrollTo(newX, newY, 0);

            this._keyTime = now;
        },

        _setModel: function (options) {
            var refresh = false;
            for (var prop in options) {
                switch (prop) {
                case "enabled":
                case "invertWheel":
                    break;
                case "targetHeight":
                case "targetWidth":
                    this.refresh();
                    break;
                case "enableFade":
                    for (var i = this._scrollbars.length; i--;) {
                        this._scrollbars[i].model.enableFade = false;
                        this._sbw.children().css("opacity", '');
                    }
                    break;
                default:
                    refresh = true;
                }

            }
            if (refresh)
                this._refresh();

        },

        _refresh: function () {
            this.scrollTo(0, 0, 0);
            this._destroy();
            this._init();
            this._wireEvents();
            $(this._scroller).offset({
                top: this._$wrapper.offset().top
            });

        },

        _clearElement: function () {
            if (this._sbw)
                this._sbw.remove();
            this.element.removeAttr("class");
            var target = typeof this.model.target == 'string' ? $("#" + this.model.target)[0] : (this.model.target == null ? this.element[0] : this.model.target);
            $(target).removeAttr("style");
            $(this._scroller).children().unwrap();
            $(target).removeClass("e-m-scrollpanel e-m-scroll-native e-m-scroll-wrapper e-m-scroll-box e-m-scroll-hide e-m-zoom e-m-abs e-m-adjheader-1");
            if (this.model.enableTransform)
                $($(target).children()[0]).css(ej.transform, "");
        },

        // all events bound using this._on will be unbind automatically
        _destroy: function () {
            this._wireEvents(true);
            if (this._keyDownDelegate)
                ej.listenTouchEvent(window, "keydown", this._keyDownDelegate, true);
            this._bindWheelEvents(true);
            this._clearElement();
        },

        _getTime: function () {
            return Date.now();
        },


        resetPosition: function (time) {
            if (!this.model.enableNativeScrolling && this.model.enableTransform) {
                var x = this._x,
                    y = this._y;

                time = time || 0;

                if (!this._hasHScroll || this._x > 0) {
                    x = 0;
                } else if (this._x < this._maxScrollX) {
                    x = this._maxScrollX;
                }

                if (!this._hasVScroll || this._y > 0) {
                    y = 0;
                } else if (this._y < this._maxScrollY) {
                    y = this._maxScrollY;
                }

                if (this._lockRefresh && y == 0) {
                    y = this._refresherElement.height();
                }

                if (x == this._x && y == this._y) {
                    return false;
                }

                this.scrollTo(x, y, time, this.model.bounceEasing);

                return true;
            }
        },

        scrollToElement: function (el, time, offsetX, offsetY, easing) {
            el = el.nodeType ? el : this._scroller.querySelector(el);

            if (!el) return;


            var posLeft = el.offsetLeft;
            var posTop = el.offsetTop;

            // if offsetX/Y are true we center the element to the screen
            if (offsetX === true) {
                offsetX = Math.round(el.offsetWidth / 2 - this._wrapper.offsetWidth / 2);
            }
            if (offsetY === true) {
                offsetY = Math.round(el.offsetHeight / 2 - this._wrapper.offsetHeight / 2);
            }

            posLeft = -posLeft;
            posTop = -posTop;
            posLeft -= offsetX || 0;
            posTop -= offsetY || 0;

            posLeft = posLeft > 0 ? 0 : posLeft < this._maxScrollX ? this._maxScrollX : posLeft;
            posTop = posTop > 0 ? 0 : posTop < this._maxScrollY ? this._maxScrollY : posTop;

            time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this._x - posLeft), Math.abs(this._y - posTop)) : time;

            this.scrollTo(posLeft, posTop, time, easing);
        },

        on: function (type, fn) {
            if (!this._scrollEvents[type])
                this._scrollEvents[type] = [];

            this._scrollEvents[type].push(fn);
        },

        _createDefaultScrollbar: function (direction, interactive, type) {
            this._sbw = ej.buildTag('div.e-m-sbw e-m-' + this.model.renderMode),
                sb = ej.buildTag('div.e-m-sb');
            if (direction == 'horizontal' && type)
                this._sbw.addClass('e-m-hr');
            else if (direction == 'vertical' && type)
                this._sbw.addClass('e-m-ver');
            if (!interactive) {
                this._sbw[0].style.pointerEvents = 'none';
            }
            this._sbw.append(sb);
            return this._sbw[0];
        },

        _calculateXY: function () {
            this._wrpWd = this._wrapper.clientWidth;
            this._wrpHt = this._wrapper.clientHeight;
            this._scrollerWidth = this._scroller.scrollWidth * this._scale;
            this._scrollerHeight = this._scroller.scrollHeight * this._scale;
            this._maxScrollX = this._wrpWd - this._scrollerWidth;
            this._maxScrollY = this._wrpHt - this._scrollerHeight;
            this._oldScrollX = this._scroller.scrollWidth;
            this._oldScrollY = this._scroller.scrollHeight;
            this._hasHScroll = this.model.enableHrScroll && this._maxScrollX < 0;
            this._hasVScroll = this.model.enableVrScroll && this._maxScrollY < 0;

            if (!this._hasHScroll) {
                this._maxScrollX = 0;
                this._scrollerWidth = this._wrpWd;
            }
            if (!this._hasVScroll) {
                this._maxScrollY = 0;
                this._scrollerHeight = this._wrpHt;
            }
            return this;
        },

        /*---------------Public Methods---------------*/

        zoom: function (scale, x, y, time) {

            if (scale < this.model.zoomMin)
                scale = this.model.zoomMin;
            else if (scale > this.model.zoomMax)
                scale = this.model.zoomMax;

            if (scale == this._scale) return;


            var relScale = scale / this._scale;

            x = x === undefined ? this._wrpWd / 2 : x;
            y = y === undefined ? this._wrpHt / 2 : y;
            time = time === undefined ? 300 : time;

            x = x + this._wrapperOffset.left - this._x;
            y = y + this._wrapperOffset.top - this._y;

            x = x - x * relScale + this._x;
            y = y - y * relScale + this._y;
            this._scale = scale;
            this.refresh();
            if (x > 0) {
                x = 0;
            } else if (x < this._maxScrollX) {
                x = this._maxScrollX;
            }
            if (y > 0) {
                y = 0;
            } else if (y < this._maxScrollY) {
                y = this._maxScrollY;
            }

            this.scrollTo(x, y, time);
        },

        disable: function () {
            this.model.enabled = false;
        },

        enable: function () {
            this.model.enabled = true;
        },

        closeRefresher: function () {
            this._refresherText.text(this.model.pullToRefreshSettings.textOnPull);
            this._refresherIcon.removeClass("e-m-refresh e-m-rotate").addClass("e-m-pull")
            this._lockRefresh = this._refresherIcon.hasClass("e-m-rotate");
            this.scrollTo(0, 0);
        },

        refresh: function () {
            if (!this._scroller) return;

            var rf = this._wrapper.offsetHeight;

            ej.adjustFixedElement(this._$wrapper);

            if (this.model.targetHeight)
                this._$wrapper.height(this.model.targetHeight);
            if (this.model.targetWidth)
                this._$wrapper.width(this.model.targetWidth);

            this._calculateXY();
            this._endTime = this._directionX = this._directionY = 0;
            this._wrapperOffset = $(this._wrapper).offset();
            if (!this.model.showScrollbars)
                this._$wrapper.addClass("e-m-hidescrollbar");
            if (this.model.enableNativeScrolling)
                this._hasHScroll && this._hasVScroll ? this._$wrapper.css("overflow", "auto") : this._hasVScroll ? this._$wrapper.css("overflow-y", "auto") : this._hasHScroll ? this._$wrapper.css("overflow-x", "auto") : (this.model.renderMode == "windows" && !ej.isMobile()) ? this._$wrapper.css("overflow", "scroll") : this._$wrapper.css("overflow", "auto");
            if (this.model.enableNativeScrolling && ej.isWindows()) {
                if (this._hasHScroll && !this._hasVScroll)
                    this._$wrapper.addClass("e-m-horizontal");
                else if (this._hasVScroll && !this._hasHScroll)
                    this._$wrapper.addClass("e-m-vertical");
            }
            this.resetPosition();
            this._triggerEvent('refresh', this._dataValue());
        },

        scrollBy: function (x, y, time, easing) {
            x = this._x + x;
            y = this._y + y;
            time = time || 0;
            this.scrollTo(x, y, time, easing);
        },

        scrollTo: function (x, y, time, relative, easing) {
            var proxy = this;
            if (!this.model.enableNativeScrolling) {
                if (this._oldScrollX != this._scroller.scrollWidth || this._oldScrollY != this._scroller.scrollHeight)
                    this._calculateXY()._refreshScrollbar();
                easing = easing || ej.ease.circular;
                if (this.model.enableTransition && easing.style) {
                    this._isInTransition = this.model.enableTransition && time > 0;
                    this._transitionTimingFunction(easing.style);
                    this._transitionTime(time);
                    this._translate(x, y);
                } else {
                    if (this._x == x && this._y == y)
                        return;
                    var step = x,
                        i, l;
                    this.stop();
                    if (!step.length) step = [{
                        x: x,
                        y: y,
                        time: time,
                        relative: relative
                    }];
                    for (i = 0, l = step.length; i < l; i++) {
                        if (step[i].relative) {
                            step[i].x = this._x - step[i].x;
                            step[i].y = this._y - step[i].y;
                        }
                        this._steps.push({
                            x: step[i].x,
                            y: step[i].y,
                            time: step[i].time || 0
                        });
                    }
                    this._startAni();
                }
            } else {
                this._nx = x, this._ny = y;
                this._scrollTo({
                    top: y,
                    left: x
                }, time, {
                    queue: true,
                    easing: 0,
                    onAfter: function () {
                        proxy._nx = $(proxy._wrapper).scrollLeft();
                        proxy._ny = $(proxy._wrapper).scrollTop();
                    }
                });
            }

        },

        getComputedPosition: function () {
            var matrix = window.getComputedStyle(this._scroller, null),
                x, y;

            if (this.model.enableTransform) {
                matrix = matrix[ej.transform].split(')')[0].split(', ');
                x = +(matrix[12] || matrix[4]);
                y = +(matrix[13] || matrix[5]);
            } else {
                x = +matrix.left.replace(/[^-\d.]/g, '');
                y = +matrix.top.replace(/[^-\d.]/g, '');
            }

            return {
                x: x,
                y: y
            };
        },


        stop: function () {
            cancelFrame(this._aniTime);
            this._steps = [];
            this._moved = false;
            this._animating = false;
        },

        getScrollPosition: function () {
            return {
                "x": this.model.enableNativeScrolling ? this._nx : this._x,
                "y": this.model.enableNativeScrolling ? this._ny : this._y
            };
        }

        /*---------------Public Methods End---------------*/

    });
})(jQuery, Syncfusion);