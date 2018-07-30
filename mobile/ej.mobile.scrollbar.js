function Scrollbar(scroller, options) {
    this._wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
    this._sb = this._wrapper.children[0];
    this._sbStyle = this._sb.style;
    this.scroller = scroller;

    this.model = {
        listenX: true,
        listenY: true,
        enableInteraction: false,
        enableResize: true,
        enableShrink: false,
        enableFade: false,
        speedRatioX: 0,
        disableTouch: false,
        speedRatioY: 0,
        ignoreBoundaries: false
    };

    for (var i in options) {
        this.model[i] = options[i];
    }

    this._sizeRatioX = 1;
    this._sizeRatioY = 1;
    this._maxPosX = 0;
    this._maxPosY = 0;
    if (this.model.enableFade) {
        this._sbStyle[ej.transform] = this.scroller.model.translateZ;
        this._sbStyle[ej.transitionDuration] = ej.isLowerAndroid() ? '0.001s' : '0ms';
        this._sbStyle.opacity = '0';
    }
    this._createDelegates();
    this._wireEvents();
}

Scrollbar.prototype = {
    _createDelegates: function () {
        this._touchStartDelegate = $.proxy(this._touchStart, this);
        this._touchMoveDelegate = $.proxy(this._touchMove, this);
        this._touchEndDelegate = $.proxy(this._touchEnd, this);
    },
    _wireEvents: function (remove) {
        target = this.scroller.model.bindToWrapper ? this.scroller._wrapper : window;
        if ($.support.hasTouch && !this.model.disableTouch)
            ej.listenEvents([this.scroller._wrapper, target, target], [ej.startEvent(), ej.cancelEvent(), ej.endEvent()], [this._scrollStartDelegate, this.scrollEndDelegate, this.scrollEndDelegate], remove);
        if (this.model.enableInteraction) {
            if (!this.model.disableTouch)
                ej.listenEvents([this._sb, window, window], [ej.startEvent(), ej.cancelEvent(), ej.endEvent()], [this._touchStartDelegate, this._touchEndDelegate, this._touchEndDelegate], remove);
            if (!this.model.disablePointer)
                ej.listenEvents([this._sb, window], [ej.startEvent(), ej.endEvent()], [this._touchStartDelegate, this._touchEndDelegate], remove);
            if (!this.model.disableMouse)
                ej.listenEvents([this._sb, window], [ej.startEvent(), ej.endEvent()], [this._touchStartDelegate, this._touchEndDelegate], remove);
        }

    },
    _touchStart: function (e) {
        var point = e.touches ? e.touches[0] : e;
        ej.blockDefaultActions(e);
        this.transitionTime();
        this._startedScroll = true;
        this._moved = false;
        this._lastPointX = point.pageX;
        this._lastPointY = point.pageY;
        this._startTime = ej.getTime();
        if (!this.model.disableTouch || !this.model.disableMouse)
            ej.listenTouchEvent(window, ej.moveEvent(), this._touchMoveDelegate);
        if (!this.model.disablePointer)
            ej.listenTouchEvent(window, ej.moveEvent(), this._touchMoveDelegate);        
    },

    _touchMove: function (e) {
        ej.blockDefaultActions(e);
        var point = e.touches ? e.touches[0] : e,
			deltaX, deltaY,
			newX, newY,
			timestamp = ej.getTime();
        if (!this._moved)
            this.scroller._triggerEvent('scrollStart',this.scroller._dataValue());
        this._moved = true;
        deltaX = point.pageX - this._lastPointX;
        this._lastPointX = point.pageX;
        deltaY = point.pageY - this._lastPointY;
        this._lastPointY = point.pageY;
        newX = this._x + deltaX;
        newY = this._y + deltaY;
        this._pos(newX, newY);
    },

    _touchEnd: function (e) {
        if (!this._startedScroll)
            return;
        this._startedScroll = false;
        ej.blockDefaultActions(e);
        ej.listenEvents([window, window, window], [ej.moveEvent(), ej.moveEvent(), ej.moveEvent()], [this._touchMoveDelegate, this._touchMoveDelegate, this._touchMoveDelegate], true);
        if (this.scroller.model.snap) {
            var snap = this.scroller._nearestSnap(this.scroller._x, this.scroller._y);

            var time = this.model.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(this.scroller._x - snap.x), 1000),
						Math.min(Math.abs(this.scroller._y - snap.y), 1000)
					), 300);

            if (this.scroller._x != snap.x || this.scroller._y != snap.y) {
                this.scroller._directionX = 0;
                this.scroller._directionY = 0;
                this.scroller._currentPage = snap;
                this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.model.bounceEasing);
            }
        }
        if (this._moved)
            this.scroller._triggerEvent('scrollStop',this.scroller._dataValue());
    },

    _pos: function (x, y) {
        if (x < 0) {
            x = 0;
        } else if (x > this._maxPosX) {
            x = this._maxPosX;
        }
        if (y < 0) {
            y = 0;
        } else if (y > this._maxPosY) {
            y = this._maxPosY;
        }
        x = this.model.listenX ? Math.round(x / this._sizeRatioX) : this.scroller._x;
        y = this.model.listenY ? Math.round(y / this._sizeRatioY) : this.scroller._y;
        this.scroller.scrollTo(x, y);
    },

    /*---------------Public Methods---------------*/
    enableFade: function (val, hold) {
        if ((hold && !this._visible) || !this.model.enableFade )
            return;

        clearTimeout(this._fadeTimeout);
        this._fadeTimeout = null;

        var time = val ? 250 : 500,
            proxy = this,
			delay = val ? 0 : 300;

        val = val ? '1' : '0';

        this._sbStyle[ej.transitionDuration] = time + 'ms';

        this._fadeTimeout = setTimeout((function (val) {
            proxy._sbStyle.opacity = val;
            proxy._visible = +val;
        }).bind(this, val), delay);
    },

    destroy: function () {
        if (this.model.enableInteraction) {
            this._wireEvents(true);
        }
    },
    transitionTime: function (time) {
        time = time || 0;
        this._sbStyle[ej.transitionDuration] = time + 'ms';
        if (!time && ej.isLowerAndroid()) {
            this._sbStyle[ej.transitionDuration] = '0.001s';
        }
    },

    transitionTimingFunction: function (easing) {
        this._sbStyle[ej.transitionTimingFunction] = easing;
    },

    refresh: function () {
        this.transitionTime(0);
        if (this.model.listenX && !this.model.listenY) {
            this._sbStyle.display = this.scroller._hasHScroll ? 'block' : 'none';
        } else if (this.model.listenY && !this.model.listenX) {
            this._sbStyle.display = this.scroller._hasVScroll ? 'block' : 'none';
        } else {
            this._sbStyle.display = this.scroller._hasHScroll || this.scroller._hasVScroll ? 'block' : 'none';
        }
        if (this.model.listenX) {
            this._wrpWd = this._wrapper.clientWidth;
            if (this.model.enableResize) {
                this._sbWidth = Math.max(Math.round(this._wrpWd * this._wrpWd / (this.scroller._scrollerWidth || this._wrpWd || 1)), 8);
                this._sbStyle.width = this._sbWidth + 'px';
            } else {
                this._sbWidth = this._sb.clientWidth;
            }
            this._maxPosX = this._wrpWd - this._sbWidth;
            if (this.model.enableShrink == 'clip') {
                this._minBoundaryX = -this._sbWidth + 8;
                this._maxBoundaryX = this._wrpWd - 8;
            } else {
                this._minBoundaryX = 0;
                this._maxBoundaryX = this._maxPosX;
            }
            this._sizeRatioX = this.model.speedRatioX || (this.scroller._maxScrollX && (this._maxPosX / this.scroller._maxScrollX));
        }
        if (this.model.listenY) {
            this._wrpHt = this._wrapper.clientHeight;
            if (this.model.enableResize) {
                this._sbHeight = Math.max(Math.round(this._wrpHt * this._wrpHt / (this.scroller._scrollerHeight || this._wrpHt || 1)), 8);
                this._sbStyle.height = this._sbHeight + 'px';
            } else {
                this._sbHeight = this._sb.clientHeight;
            }

            this._maxPosY = this._wrpHt - this._sbHeight;
            if (this.model.enableShrink == 'clip') {
                this._minBoundaryY = -this._sbHeight + 8;
                this._maxBoundaryY = this._wrpHt - 8;
            } else {
                this._minBoundaryY = 0;
                this._maxBoundaryY = this._maxPosY;
            }
            this._sizeRatioY = this.model.speedRatioY || (this.scroller._maxScrollY && (this._maxPosY / this.scroller._maxScrollY));
        }
        this.setPosition();
    },

    setPosition: function () {
        var x = this.model.listenX && Math.round(this._sizeRatioX * this.scroller._x) || 0, proxy = this,
        y = this.model.listenY && Math.round(this._sizeRatioY * this.scroller._y) || 0;
        if (!this.model.ignoreBoundaries) {
            if (x < this._minBoundaryX) {
                if (this.model.enableShrink == 'scale') {
                    this._width = Math.max(this._sbWidth + x, 8);
                    this._sbStyle.width = this._width + 'px';
                }
                x = this._minBoundaryX;
            } else if (x > this._maxBoundaryX) {
                if (this.model.enableShrink == 'scale') {
                    this._width = Math.max(this._sbWidth - (x - this._maxPosX), 8);
                    this._sbStyle.width = this._width + 'px';
                    x = this._maxPosX + this._sbWidth - this.width;
                } else {
                    x = this._maxBoundaryX;
                }
            }
            else if (this.model.enableShrink == 'scale' && this._width != this._sbWidth) {
                this._width = this._sbWidth;
                this._sbStyle.width = this._width + 'px';
            }
            if (y < this._minBoundaryY) {
                if (this.model.enableShrink == 'scale') {
                    this._height = Math.max(this._sbHeight + y * 3, 8);
                    this._sbStyle.height = this._height + 'px';
                }
                y = this._minBoundaryY;
            } else if (y > this._maxBoundaryY) {
                if (this.model.enableShrink == 'scale') {
                    this._height = Math.max(this._sbHeight - (y - this._maxPosY) * 3, 8);
                    this._sbStyle.height = this._height + 'px';
                    y = this._maxPosY + this._sbHeight - this._height;
                } else {
                    y = this._maxBoundaryY;
                }
            } else if (this.model.enableShrink == 'scale' && this._height != this._sbHeight) {
                this._height = this._sbHeight;
                this._sbStyle.height = this._height + 'px';
            }
        }
        if ($(this._wrapper).hasClass("e-m-ver"))
            x = 0;
        else
            y = 0;
        this._x = x;
        this._y = y;
        if (this.scroller.model.enableTransform) {
            this._sbStyle[ej.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.model.translateZ;

        } else {
            this._sbStyle.left = x + 'px';
            this._sbStyle.top = y + 'px';
        }
    }
    /*---------------Public Methods End---------------*/
};