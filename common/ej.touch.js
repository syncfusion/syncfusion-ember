
(function ($, undefined) {

    var $document = $(document);
    // add new event shortcuts
    $.each(("touchstart touchmove touchend " +
		"tap doubletap taphold " +
		"swipe swipeleft swiperight " + "pinch pinchin pinchout pinchstop " +
		"scrollstart scrollstop").split(" "), function (i, name) {

		    $.fn[name] = function (fn) {
		        return fn ? this.on(name, fn) : this.trigger(name);
		    };

		    // jQuery < 1.8
		    if ($.attrFn) {
		        $.attrFn[name] = true;
		    }
		});

    var isPointer = browserInfo().isMSPointerEnabled,
    isIE11Pointer = browserInfo().pointerEnabled,
    supportTouch = 'ontouchstart' in window,
	scrollEvent = "scroll",
    isDesktop = (typeof window.orientation === "undefined"),
    isIosDevice = navigator.userAgent.match(/iPhone|iPad|iPod/i),
	touchStartEvent = isPointer ? (isIE11Pointer ? "pointerdown" : "MSPointerDown") : (supportTouch ? "touchstart" : "mousedown"),
	touchStopEvent = isPointer ? (isIE11Pointer ? "pointerup" : "MSPointerUp") : isIosDevice ? ("touchend") : (supportTouch ? "touchend" : "mouseup"),
	touchMoveEvent = isPointer ? (isIE11Pointer ? "pointermove" : "MSPointerMove") : (supportTouch ? "touchmove" : "mousemove"),
    touchCancelEvent = isPointer ? (isIE11Pointer ? "pointercancel" : "MSPointerCancel") : (supportTouch ? "touchcancel" : "mouseleave"),
    mouseStartEvent = isPointer || !isDesktop ? touchStartEvent : isIosDevice ? "touchstart" : "touchstart mousedown",
    mouseStopEvent = isPointer || !isDesktop ? touchStopEvent : "touchend mouseup",
    mouseMoveEvent = isPointer || !isDesktop ? touchMoveEvent : "touchmove mousemove",
    browser = browserInfo(),
    isIE9 = ((browser.name == 'msie') && (browser.version == '9.0')) ? true : false;

    function browserInfo() {
        var browser = {}, clientInfo = [],
        browserClients = {
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
    }
    function initiateCustomEvent(obj, eventType, e) {
        var originalType = e.type;
        e.type = eventType;
        $.event.dispatch.call(obj, e);
        e.type = originalType;
    }
    function copyObject(e, origEvent) {
        if (origEvent) {
            for (prop in origEvent) {
                if (!(prop in e)) {
                    e[prop] = origEvent[prop];
                }
            }
        }
    }
    $.event.special.ejtouchmove = {
        setup: function () {
            var thisObj = this,
				$this = $(thisObj);
            $this.on(touchStartEvent, startMoveHandler);
            $document.on(touchStopEvent, clearTouchMoveHandlers);
            function clearTouchMoveHandlers() {
               // $this.off(touchMoveEvent, moveHandler)
            }
            var coords = {};
            function startMoveHandler(e) {
                if (!e.originalEvent) return;
                if (!(e.which && e.which !== 1)) {
                    var origTarget = e.target,
					origEvent = e.originalEvent;
                    if (isPointer)
                        coords = { x: origEvent.x, y: origEvent.y };
                    $this.on(touchMoveEvent, moveHandler);
                }
            }
            function moveHandler(e) {
                if (!(e.which && e.which !== 1)) {
                    var origTarget = e.target,
					origEvent = e.originalEvent;
                    copyObject(e, e.originalEvent);
                    if (!isPointer || !coords || (Math.abs(coords.x - origEvent.x) > 10 || Math.abs(coords.y - origEvent.y) > 10 && isPointer))
                        initiateCustomEvent(thisObj, "ejtouchmove", e);
                }
            }
        }
    };
    function touchObj(e) {
        return e.originalEvent.touches ?
					e.originalEvent.touches[0] : isPointer ? e.originalEvent : e;
    }
    // handles swipeup and swipedown
    $.event.special.swipeupdown = {
        setup: function () {
            var thisObj = this, $this = $(thisObj);
            checkMsieTouch($this);
            $this.on(touchStartEvent, function (e) {
                if (!e.originalEvent) return;
                var _startevent = e;
                var data = touchObj(e),
                            startPoint = {
                                time: (new Date).getTime(),
                                coords: [data.pageX, data.pageY],
                                origin: $(e.target)
                            },
                            stopPoint;
                function moveHandler(e) {
                    e.preventDefault();
                    if (!startPoint) return;
                    var data = touchObj(e);
                    stopPoint = {
                        time: (new Date).getTime(),
                        coords: [data.pageX, data.pageY]
                    };
                    if (Math.abs(startPoint.coords[1] - stopPoint.coords[1]) > 10) e.preventDefault();
                }

                $this
                            .on(touchMoveEvent, moveHandler)
                            .one(touchStopEvent, function (e) {
                                $this.off(touchMoveEvent, moveHandler);
                                if (startPoint && stopPoint) {
                                    if (stopPoint.time - startPoint.time < 1000 &&
                                    Math.abs(startPoint.coords[1] - stopPoint.coords[1]) > 30 &&
                                    Math.abs(startPoint.coords[0] - stopPoint.coords[0]) < 75) {
                                        var _addDetails = { time: stopPoint.time - startPoint.time, _isSwipe: true, _isDelta: true, stopPoint: stopPoint };
                                        var _options = _getOptions(e, _addDetails, _startevent);

                                        startPoint.origin
                                        .trigger($.extend(true, { type: "swipeupdown" }, _options))
                                        .trigger($.extend(true, { type: startPoint.coords[1] > stopPoint.coords[1] ? "swipeup" : "swipedown" }, _options));
                                    }
                                }
                                startPoint = stopPoint = undefined;
                            });
            });
        }
    };
    $.event.special.scrollstart = {
        isEnabled: true,
        setup: function () {
            var thisObj = this, $this = $(thisObj), scrolling, timer;
            function trigger(e, scrollState) {
                scrolling = scrollState;
                initiateCustomEvent(thisObj, scrolling ? "scrollstart" : "scrollstop", e);
            }
            $this.on(scrollEvent, function (e) {
                if (!$.event.special.scrollstart.isEnabled) return;
                if (!scrolling) trigger(e, true);
                clearTimeout(timer);
                timer = setTimeout(function () {
                    trigger(e, false);
                }, 250);
            });
        }
    };

    // also handles doubletap, taphold
    $.event.special.tap = {
        doubleTapThreshold: 500,
        tapholdThreshold: 650,
        canDoubleTap: function (d) {
            return ((getTimeSpan() - d.doubleTapStartTime) <= $.event.special.tap.doubleTapThreshold);
        },
        setup: function () {
            var thisObj = this, $this = $(thisObj), d = $this.data();
            var mouseDownTarget;            
            checkMsieTouch($this);
            d.isDoubleTapWait = false;
            d.stopProcess = false;
            d.preTouchend = null;
            d.preTouchstart = null;

            $this.on(mouseStartEvent, function (event) {
                if (!event.originalEvent) return;
                if (event.type == "mousedown" || event.type == "pointerdown" || "MSPointerDown")                   
                    mouseDownTarget = event.target;
                               
                d = $this.data();
                d.startTime = getTimeSpan();
                if (!d.isDoubleTapWait) d.doubleTapStartTime = d.startTime;
                if (event.type == "touchstart") d.preTouchstart = d.startTime;
                // checked mousedown event arrives within 300'ms after the touchend completes
                if (event.type == "mousedown" && (d.startTime - d.preTouchend < 300 || d.startTime - d.preTouchstart < 30))
                    d.stopProcess = true;
                else d.stopProcess = false;

                var origTarget = event.currentTarget,
					origEvent = event.originalEvent,
					timer;

                function clearTapHandlers() {
                    clearTimeout(timer);

                    $this.off(mouseStopEvent, clickHandler);
                    if (isIE9) $document.off(mouseStopEvent, clickHandler);
                    $document.off(mouseStopEvent, clearTapHandlers);
                    $this.off(touchCancelEvent, clearTapHandlers);
                    $this.off(mouseMoveEvent, touchMoveAction);
                    $this.off('dragstart', dragAction);
                }
                function touchMoveAction(e) {
                    var touchmoveThreshold = 10;
                    var coor1 = (e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e.originalEvent),
                        coor2 = (event.originalEvent.changedTouches ? event.originalEvent.changedTouches[0] : event.originalEvent);
                    if (!((coor1.pageX - coor2.pageX < touchmoveThreshold && coor1.pageX - coor2.pageX > -(touchmoveThreshold)) &&
                        (coor1.pageY - coor2.pageY < touchmoveThreshold && coor1.pageY - coor2.pageY > -(touchmoveThreshold)))) {
                        if (e.type == "mousemove" || (e.type == "pointermove" && e.originalEvent.pointerType == "mouse") ||
                            e.type == "MSPointerMove" && e.originalEvent.pointerType == 4) {
                            clearTimeout(timer);
                            $this.off(touchCancelEvent, clearTapHandlers);
                            $this.off(mouseMoveEvent, touchMoveAction);
                        }
                        else
                          clearTapHandlers();                                            
                    }                    
                }
                function clickHandler(e) {
                    if (e.type == "touchend") d.preTouchend = getTimeSpan();
                    clearTapHandlers();

                    // Modify the tap event target
                    if (mouseDownTarget != e.target && (e.type == "mouseup" || event.type == "pointerup" || "MSPointerUp")) {
                        var mouseupTarget = e.target;                        
                        // Mousedown element is the parent of the mouseup element.                       
                        if (jQuery.contains(mouseDownTarget, mouseupTarget))
                            // Mousedown element is target.
                            updateTargetEle(e, mouseDownTarget);
                       
                        // Mousedown element is the sibiling of the mouseup element.                            
                        else if (!(jQuery.contains(mouseupTarget, mouseDownTarget))) {
                            var ele = $(mouseDownTarget).parents().has($(mouseupTarget)).first()[0];
							if(!ej.isNullOrUndefined(ele))
                                updateTargetEle(e, ele);                         
                        }
                    }

                    // ONLY trigger a 'tap' event if the startPoint target is
                    // the same as the stopPoint target.
                    if (origTarget === e.currentTarget) {
                        initiateCustomEvent(thisObj, "tap", $.extend(_getBaseOptions(e), {
                            time: getTimeSpan() - d.startTime
                        }));

                        if (d.isDoubleTapWait && $.event.special.tap.canDoubleTap(d)) {
                            d.isDoubleTapWait = false;

                            initiateCustomEvent(thisObj, "doubletap", $.extend(_getBaseOptions(e), {
                                time: getTimeSpan() - d.doubleTapStartTime
                            }));
                        }
                        else {
                            if (d.isDoubleTapWait) {
                                d.isDoubleTapWait = false;
                                d.doubleTapStartTime = d.startTime;
                            }
                            if ($.event.special.tap.canDoubleTap(d)) {
                                d.isDoubleTapWait = true;
                            }
                        }
                    }
                }
                function updateTargetEle(e,target) {
                    e.target = target;
                    e.toElement = target;                  
                }
                function dragAction(e) {
                    // Remove the tap handler while moving the element inside the tap.
                    clearTapHandlers();
                }
                if (!(event.which && event.which !== 1) && !d.stopProcess) {                   
                    $this.on(mouseStopEvent, clickHandler);
                    $document.on(mouseStopEvent, clearTapHandlers);
                    if (isIE9) $document.on(mouseStopEvent, clickHandler);
                    $this.on(touchCancelEvent, clearTapHandlers);
                    $this.on(mouseMoveEvent, touchMoveAction);
                    $this.on('dragstart', dragAction);
                    var eventCopy = {};  
                    for (var i in origEvent) {
                        eventCopy[i] = origEvent[i];    // For IE8 taphold issue, copy the original event in local variable 
                    }
                    timer = setTimeout(function () {
                        if (d.isDoubleTapWait) d.isDoubleTapWait = false;
                        initiateCustomEvent(thisObj, "taphold", $.extend(_getBaseOptions(event), {
                            options: eventCopy,
                            time: getTimeSpan() - d.startTime
                        }));

                    }, $.event.special.tap.tapholdThreshold);
                }
                else if (d.stopProcess) d.stopProcess = false;
            });
        }
    };    
    $.event.special.swipe = {
        scrollSupression: 10,
        duration: 1000,
        horizontalDistance: 30,
        verticalDistance: 75,
        pointers: window.navigator.msPointerEnabled,
        startPoint: function (e) {
            var data = touchObj(e);
            return {
                time: (new Date()).getTime(),
                Items: data,
                coords: [data.pageX, data.pageY],
                origin: $(e.target)
            };
        },
        stopPoint: function (e) {
            var data = touchObj(e);
            return {
                time: (new Date()).getTime(),
                Items: data,
                coords: [data.pageX, data.pageY]
            };
        },
        handleSwipe: function (startPoint, stopPoint, e, _startevent) {
            if(startPoint.Items.pageY != startPoint.Items.clientY || stopPoint.Items.pageY != stopPoint.Items.clientY) $.event.special.swipe.horizontalDistance = 130;
            if (stopPoint.time - startPoint.time < $.event.special.swipe.duration &&  
				Math.abs(startPoint.coords[0] - stopPoint.coords[0]) > $.event.special.swipe.horizontalDistance &&
				Math.abs(startPoint.coords[1] - stopPoint.coords[1]) < $.event.special.swipe.verticalDistance) {

                var _addDetails = { time: stopPoint.time - startPoint.time, _isSwipe: true, _isDelta: true, stopPoint: stopPoint };
                var _options = _getOptions(e, _addDetails, _startevent);

                startPoint.origin.trigger($.extend(true, { type: "swipe" }, _options))
					.trigger($.extend(true,
                    { type: startPoint.coords[0] > stopPoint.coords[0] ? "swipeleft" : "swiperight" }, _options));
            }
        },

        setup: function () {
            var thisObj = this, $this = $(thisObj);
            checkMsieTouch($this);

            $this.on(touchStartEvent, function (e) {
                if (!e.originalEvent) return;
                var startPoint = $.event.special.swipe.startPoint(e),
					stopPoint;
                var _startevent = e;
                $(e.target).data('_dataTouchStart', { event: e, _now: new Date().getTime() });

                function moveHandler(e) {
                    if (!startPoint) return;
                    stopPoint = $.event.special.swipe.stopPoint(e);
                    if (Math.abs(startPoint.coords[0] - stopPoint.coords[0]) > $.event.special.swipe.scrollSupression) e.preventDefault();
                }

                $this.on(touchMoveEvent, moveHandler)
					.one(touchStopEvent, function (e) {
					    $this.off(touchMoveEvent, moveHandler);
					    if (startPoint && stopPoint) {
					        $.event.special.swipe.handleSwipe(startPoint, stopPoint, e, _startevent);
					    }
					    startPoint = stopPoint = undefined;
					});
            });
        }
    };
    // also handles pinchin, pinchout
    $.event.special.pinch = {
        distance: function (e) {
            if (e.originalEvent.touches.length < 2) return null;
            return $.event.special.pinch._getdistance(e.originalEvent.touches[0], e.originalEvent.touches[1]);
        },
        _getdistance: function (coor1, coor2) {
            return Math.sqrt((coor1.pageX - coor2.pageX) * (coor1.pageX - coor2.pageX) +
                (coor1.pageY - coor2.pageY) * (coor1.pageY - coor2.pageY));
        },
        setup: function () {
            var thisObj = this, $this = $(thisObj);
            checkMsieTouch($this);
            $this.on(touchStartEvent, function (e) {
                if (!e.originalEvent) return;
                var _startevent = e;
                if (e.originalEvent.touches && e.originalEvent.touches.length >= 2) {
                    var startPoint = $.event.special.pinch.distance(e), stopPoint, minDistance = 5;

                    var _pinchDistance = startPoint, moveEvent;
                    var _options = _getOptions(e, { _isPinch: true, _pinchDistance: _pinchDistance }, _startevent);

                    $(e.target).trigger($.extend(true, { type: "pinch" }, _options));

                    function moveHandler(e) {
                        moveEvent = e;
                        stopPoint = $.event.special.pinch.distance(e) || null;
                        if (startPoint && stopPoint && Math.abs(startPoint - stopPoint) > minDistance) {

                            $(e.target).trigger($.extend(true,
                                { type: startPoint > stopPoint ? "pinchin" : "pinchout" }, _getOptions(e,
                                { _isPinch: true, _pinchDistance: _pinchDistance }, _startevent)));

                            startPoint = stopPoint;
                        }
                    }

                    $this.on(touchMoveEvent, moveHandler)
                        .one(touchStopEvent, function () {
                            $this.off(touchMoveEvent, moveHandler);
                            $(e.target).trigger($.extend(true, { type: "pinchstop" }, _getOptions(moveEvent,
                                { _isPinch: true, _pinchDistance: stopPoint }, _startevent)));
                            startPoint = stopPoint = undefined;
                        });
                }
            });
        }
    };
    //  handles touchdrag, touchdrag
    $.event.special.touchdrag = {

        setup: function () {
            var thisObj = this, $this = $(thisObj);
            checkMsieTouch($this);

            $this.on(touchStartEvent, function (e) {
                if (!e.originalEvent) return;
                var startPoint = touchObj(e),
					stopPoint;
                var _startevent = e;
                $(e.target).data('_dataTouchStart', { event: e, _now: new Date().getTime() });

                function moveHandler(e) {
                    if (!startPoint) {
                        return;
                    }
                    stopPoint = touchObj(e);

                    if ($.event.special.pinch._getdistance(startPoint, stopPoint) > 5)
                        $(e.target).trigger($.extend(true, { type: "touchdrag" },
                            _getOptions(e, { _isdrag: true, stopPoint: stopPoint, _isDelta: true }, _startevent)));
                }

                $this.on(touchMoveEvent, moveHandler)
					.one(touchStopEvent, function (e) {
					    $this.off(touchMoveEvent, moveHandler);
					    startPoint = stopPoint = undefined;
					});
            });
        }
    };
    function _getBaseOptions(e) {
        var _pointer = isPointer ? e.originalEvent.pointerType : (!e.originalEvent.touches ? "mouse" : "touch")
        var pointerType = (isPointer && isIE11Pointer == undefined) ? (_pointer == 4 ? "mouse" : "touch") : _pointer;
        e["pointerType"] = pointerType;
        if (e.type != "mousedown" && e.type != "mouseup") {
            copyObject(e, e.originalEvent);
        }
        if (pointerType == "touch")
            e.button = undefined;
        return e;
    }
    function _getOptions(e, _details, _startevent) {
        var _distance, _time, _scale, _iDelta = {}, _startXY, _endXY;
        if (_startevent) {
            var coor;
            if (!_startevent.originalEvent.touches) coor = [_startevent.originalEvent, e.originalEvent];
            else coor = [_startevent.originalEvent.touches[0], e.originalEvent.changedTouches[0]];

            if (_details._isSwipe || _details._isdrag) {
                _distance = $.event.special.pinch._getdistance(coor[0], coor[1]);
                _time = _details.time;
                _endXY = { pageX: _details.stopPoint.pageX, pageY: _details.stopPoint.pageY };
            }
            else if (_details._isPinch) {
                _distance = $.event.special.pinch.distance(e);
                _time = e.timeStamp - _startevent.timeStamp;
                _scale = _details._pinchDistance;
            }
            if (_details._isDelta) {
                _iDelta._dTime = e.timeStamp - _startevent.timeStamp;
                _iDelta._x = coor[1].pageX - coor[0].pageX;
                _iDelta._y = coor[1].pageY - coor[0].pageY;
            }
        }

        return {
            options: e,
            delta: {
                time: _iDelta._dTime || null,
                X: _iDelta._x || null,
                Y: _iDelta._y || null
            },
            distance: _distance,
            scale: _details._isPinch ? _scale : null,
            time: _time,
            velocity: {
                XY: _distance / _iDelta._dTime || null,
                X: _iDelta._x / _iDelta._dTime || null,
                Y: _iDelta._y / _iDelta._dTime || null
            },
            currentPosition: { pageX: _endXY ? _endXY.pageX : null, pageY: _endXY ? _endXY.pageY : null }
        };
    }

    function getTimeSpan() {
        var now = new Date();
        return now.getTime();
    }
    function checkMsieTouch($this) {
        if (isPointer)
            $this.css("-ms-touch-action", "pinch-zoom").css("touch-action", "pinch-zoom");
    }

    $.each({
        scrollstop: "scrollstart",
        doubletap: "tap",
        taphold: "tap",
        swipeleft: "swipe",
        swiperight: "swipe",
        swipedown: "swipeupdown",
        swipeup: "swipeupdown",
        pinchin: "pinch",
        pinchout: "pinch",
        pinchstop: "pinch"
    }, function (event, sourceEvent) {

        $.event.special[event] = {
            setup: function () {
                $(this).on(sourceEvent, $.noop);
            }
        };
    });

})(jQuery);