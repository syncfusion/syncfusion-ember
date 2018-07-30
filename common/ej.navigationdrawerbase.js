/**
* @fileOverview Plugin to style the Html NavigationDrawer elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejNavigationDrawerBase", "ej.NavigationDrawerBase", {

        defaults: {

            contentId: null,

            cssClass: "",

            direction: "left",

            targetId: null,

            position: "normal",

            enableListView: false,

            listViewSettings: {},

            type: "overlay",

            width: "auto",

            swipe: null,

            open: null,

            beforeClose: null,

            items: [],

            ajaxSettings: {

				type: 'GET',

                cache: false,

                data: {},

                dataType: "html",

                contentType: "html",

                async: true

            },

            ajaxSuccess: null,

            ajaxError: null,

			ajaxComplete: null
        },

        dataTypes: {
            direction: "enum",
            type: "enum",
            ajaxSettings: "data"
        },

        loadContent: function (content ,link) {
            var proxy = this;
			if(link.indexOf("#") == 0) {
				var _link = $(link)[0] && $(link)[0].nodeName && $(link)[0].nodeName.toLowerCase() == "script" ? ej.getClearString($(link)[0].innerHTML) : link;
				if(_link != $(link)) {
					if($(_link).length != 0)
						this._scriptTemplate.push({id:link,data:$(_link)});
					else {
						var result = $.grep(this._scriptTemplate, function(e){ if(e.id == _link) return e.data; });
						_link = (result.length >0 )?result[0].data[0]:_link;
					}
				}
				$(content).html($(_link));
				this._hide();
			}
			else {
				var ajaxOptions = {

					url:link,

					"success": function (data) {
						try { 
							$(content).html(data);
                            if(proxy._trigger("ajaxSuccess", { data: data, url: link ,content: content})) return;
							proxy._hide();
							
						}
						catch (e) { }
					},
					"error": function (e) {
						try { 
                            if(proxy._trigger("ajaxError", {data:{ "status": e.status, "responseText": e.responseText, "statusText": e.statusText },content: content,url: link})) return;
							proxy._hide();
							}
						catch (e) { }
					},
					"complete": function (e) {
						 try {
							 proxy._trigger("ajaxComplete", {data:e, content: content, url: link });
                    } catch (e) {}
					}
				};
				this._sendAjaxRequest(ajaxOptions);
			}
        },
        _sendAjaxRequest: function (ajaxOptions) {
            $.ajax({
                type: ajaxOptions.type,
                cache: ajaxOptions.cache,
                url: ajaxOptions.url,
                dataType: ajaxOptions.dataType,
                data: ajaxOptions.data,
                contentType: ajaxOptions.contentType,
                async: ajaxOptions.async,
                success: ajaxOptions.success,
                error: ajaxOptions.error,
                beforeSend: ajaxOptions.beforeSend,
                complete: ajaxOptions.complete
            });
        },
		_shadowWrapper: function () {
			if (!this.model.isPaneOpen) {
                this._elementOverlay = ej.buildTag("div#" + this._id + "_Overlay", {}, {}, { "class": this._rootCSS + " " + this._prefixClass + "nb-layout " + this._prefixClass + "nb-overlay" });
                this._elementShadow = ej.buildTag("div#" + this._id + "_shadow", {}, {}, { "class": this._rootCSS + " " + this._prefixClass + "nb-shadow " + "" + this._prefixClass + "nb-type-" + (this.model.type == "slide" ? "slide" : "overlay") });
                this._nbHome.append(this._elementOverlay);
                this._elementOverlay.hide();
                this.element.hide();
				this.element.prepend(this._elementShadow);
            }
		},
        _renderControl: function () {
            if (this.model.position.toLowerCase() == "fixed")
                this.element.appendTo(this._nbHome);
			this._shadowWrapper();
            this.element.addClass(this._prefixClass + "user-select" + " " + this.model.cssClass);
            this.element.addClass(this._prefixClass + 'nb-layout ' + (this.model.direction.toLowerCase() == "left" ? this._prefixClass + 'nb-left' : this._prefixClass + 'nb-right'));
            this.element.addClass(this._prefixClass + 'nb-type-' + (this.model.type == "slide" ? "slide" : "overlay"));
            this._maxIndex = this._getMaxZindex();
            this._parentWidth = this._nbHome.width();
            this._setWidth();
            this._setLayout();
        },
        _getMaxZindex: function () {
            return Math.max.apply(null, $.map($('body *'), function (e, n) {
                return parseInt($(e).css('z-index')) + 1 || 1;
            }));
        },
        _transform: function (dist, time, element) {
            var translate = "-" + this._browser + "-transform",
                translateVal = "translateX(" + dist + "px) translateZ(0px)";
            var trans = "-" + this._browser + "-transition-property",
            transVal = "transform",
            transDur = "-" + this._browser + "-transition-duration",
            transDurVal = time + "ms";
            if (element) {
                var positionClass = this.model.position == "fixed" ? "e-nb-fixed" : "";
                if (this.model.position == "normal" && this.model.type=="slide")
                    $("#" + this._id + "_WrapContainer").addClass("e-nb-normal");
                this.element.addClass("" + this._prefixClass + "nb-animate" + " " + positionClass);
                this.element.css(trans, transVal).css(transDur, transDurVal).css(translate, translateVal);
				this.element.css("transition-property", transVal).css("transition-duration", transDurVal).css("transform", translateVal);
            }
            else {
                var positionClass = this.model.position == "fixed" ? "e-nb-fixed" : "";
                if (this.model.position == "normal" && this.model.type == "slide")
                    $("#" + this._id + "_WrapContainer").addClass("e-nb-normal");
                this._nbHome.addClass(this._rootCSS + " " + this._prefixClass + "nb-animate" + " " + positionClass);
                this._nbHome.css(trans, transVal).css(transDur, transDurVal).css(translate, translateVal);
				this._nbHome.css("transition-property", transVal).css("transition-duration", transDurVal).css("transform", translateVal);
            }
        },

        _show: function () {
            if (!ej.isNullOrUndefined(this.element.css("left").match((/\d/g))) && (!Number(this.element.css("left").match((/\d/g))[0] < this.element.width()))) this._setLayout();
            if ($("." + this._prefixClass + "nb-opened").length && $("." + this._prefixClass + "nb-opened")[0] != this.element[0])
                $("." + this._prefixClass + "nb-opened").ejNavigationDrawer("close");
            this.element.show();
            ej.listenTouchEvent((this._isTransitionElement() ? this.element : this._nbHome), ej.transitionEndEvent(), this._transitionOpenHandler, false, this);
            this.element.addClass("" + this._prefixClass + "nb-opened");
            this._elementOverlay.css("z-index", this._maxIndex * 2);
            this.element.css("z-index", this._maxIndex * 3);
            if (!(ej.browserInfo().name == "msie" && ej.browserInfo().version <= 9))
                this.model.direction == "left" ? this._transform($(this.element).width(), 400, this._isTransitionElement()) : this._transform(-($(this.element).width()), 400, this._isTransitionElement());
            else
                $(this.element).show().animate({ "left": (this.model.direction == "left" ? "0px" : (this._parentWidth - $(this.element).width())) }, 400, $.proxy(this._transitionOpenEnd, this));
            this._data = { element: this.element };
            this.model.enableListView ? $.extend(this._data, { listview: this._lb }) : null;
            this._elementOverlay.show();
            this._trigger("open", this._data);
        },

        _hide: function () {
            this._elementOverlay.hide();
            ej.listenTouchEvent((this._isTransitionElement() ? this.element : this._nbHome), ej.transitionEndEvent(), this._transitionCloseHandler, false, this);
            this.element.removeClass("" + this._prefixClass + "nb-opened");
            if (!(ej.browserInfo().name == "msie" && ej.browserInfo().version <= 9))
                this._transform(0, 400, this._isTransitionElement());
            else
                $(this.element).animate({ "left": (this.model.direction == "left" ? -($(this.element).width()) : this._nbHome.width()) }, 400, $.proxy(this._transitionCloseEnd, this));
        },
        _clearHomeElement: function () {
            var browSpec = "";
            if (this._browser != "")
                browSpec = '-' + this._browser + '-';
            var translate = browSpec + "transform";
            var trans = browSpec + "transition-property";
            var transDur = browSpec + "transition-duration";
            this._nbHome.css(translate, "").css(transDur, "").css(trans, "");
            var positionClass = this.model.position == "fixed" ? "e-nb-fixed" : "";
            this._nbHome.removeClass(this._rootCSS + " " + this._prefixClass + "nb-animate" + " " + positionClass);
        },

        _isOpened: function () {
            return this.element.hasClass("" + this._prefixClass + "nb-opened");
        },

        _isOtherOpened: function () {
            return $("." + this._prefixClass + "nb-opened").length;
        },

        _isTransitionElement: function () {
            return this.model.type == "overlay" ? true : false;
        },

        _isOrientationSupported: function () {
            return ("orientation" in window && "onorientationchange" in window);
        },

        _setWidth: function () {
            $(this._nbHome).width() < 500 ? this.element.css("maxwidth", "80%") : this.element.css("maxwidth", "40%");
            if (this.model.width != "auto" && Number(this.model.width) != 0)
                this.element.width(Number(this.model.width));
            this.element.height("100%");
        },

          _setLayout: function () {
            this.element.show();
            this.element.find('.' + this._prefixClass + 'list-container').removeClass("e-scroller");
            if (this.model.position == "fixed")
                this.element.css("min-height", window.innerHeight);
            if (this.model.direction.toLowerCase() == "left") {
                $("#" + this._id + "_WrapContainer").css({ right: "" }).removeClass("e-nb-right").addClass("e-nb-left");
                this.element.removeClass("e-nb-right").addClass("e-nb-left");
                if (!this.model.isPaneOpen) {
                    if (this.model.position == "normal")
                        this.element.css({ right: "", left: this.model.type == "overlay" ? (-(ej.getDimension(this.element, "width"))) : "0px" });
                    else
                        this.element.css({ right: "", left: (-(ej.getDimension(this.element, "width"))) });
                    if (this.model.type == "slide")
                        $("#" + this._id + "_WrapContainer").removeAttr("style").css({ left: (-(ej.getDimension(this.element, "width"))) })
                }
                else {
                    var positionClass = this.model.position == "fixed" ? "e-nb-fixed" : "";
                    this.element.css({ "right": "", "left": this.model.position == "fixed" ? -ej.getDimension(this.element, "width") : 0 });
                    this._nbHome.css({ "width": this._nbHome.parent().width() - ej.getDimension(this.element, "width"), "left": ej.getDimension(this.element, "width"), "position": "absolute" }).addClass(positionClass);
                }
            }
            else {
                $("#" + this._id + "_WrapContainer").css({ left: "" }).removeClass("e-nb-left").addClass("e-nb-right");
                this.element.css({ left: "" }).removeClass("e-nb-left").addClass("e-nb-right");
                if (!this.model.isPaneOpen) {
                    var positionClass = this.model.position == "fixed" ? "e-nb-fixed" : "";
                    this._nbHome.removeClass("e-nb-fixed-slide" + " " + positionClass);
                    $("#" + this._id + "_WrapContainer").removeClass("e-nb-left").addClass("e-nb-right");
                    if (this.model.type == "slide")
                        $("#" + this._id + "_WrapContainer").removeAttr("style").css({ right: "0px" });
                    if (this.model.position.toLowerCase() == "fixed" && this.model.type == "slide")
                        this._nbHome.addClass("e-nb-fixed-slide");
                    if (this.model.position.toLowerCase() == "fixed" && this.model.type == "overlay")
                        this.element.addClass(positionClass);
                    if (this.model.position.toLowerCase() == "normal")
                        this.element.css({ left: ej.getDimension(this.element, "width") });
                    else
                        this.element.css({ right: -ej.getDimension(this.element, "width") });
                }
                else {
                    var positionClass = this.model.position == "fixed" ? "e-nb-fixed" : "";
                    this._nbHome.css({"left": "","position":"", "width": ej.getDimension(this._nbHome.parent(), "width") - ej.getDimension(this.element, "width") }).addClass(positionClass);
                    this.element.css({ "left": "", "right": "0px" });
                }
            }
            if (!this._isOpened() && !this.model.isPaneOpen)
                this.element.hide();
        },

        _destroy: function (isSetModel) {
            this._wireEvents(true);
            if (this._elementOverlay)
                this._elementOverlay.remove();
            if (this._elementShadow)
                this._elementShadow.remove();
            if (this._elementWrapper) this.element.unwrap();
            this.element.removeAttr("style");
            this.element.css("left", "");
            this._destroyEJMPlugin();
            if(!isSetModel) this.element.removeClass("e-nb e-user-select e-nb-layout e-nb-left e-nb-type-overlay e-nb-animate e-nb-opened");
        },

        _refresh: function () {
            this._destroy(true);
            this._load();
            this._renderControl();
            this._renderEJMControls();
            this._createDelegate();
            this._wireEvents();
        },


        _createDelegate: function () {
            //Swipe Events Handler
            this._swipeStartHandler = $.proxy(this._swipeStart, this);
            this._swipeEndHandler = $.proxy(this._swipeEnd, this);
            this._swipeMoveHandler = $.proxy(this._swipeMove, this);
            //Touch Event Handler
            this._touchMoveHandler = $.proxy(this._touchMove, this);
            this._touchEndHandler = $.proxy(this._touchEnd, this);
            //Transition Event
            this._transitionOpenHandler = $.proxy(this._transitionOpenEnd, this);
            this._transitionCloseHandler = $.proxy(this._transitionCloseEnd, this);
            //Target Touch Event Handler
            this._overlayTapHandler = $.proxy(this._elementOverlayTap, this);
            //TargetButton Tap
            this._targetButtonTapHandler = $.proxy(this._targetButtonTap, this);
            // Size Event Handler
            this._onOrientationChangeHandler = $.proxy(this._onOrientationChangeEvent, this);
            this._onResizeEventHandler = $.proxy(this._onResizeEvent, this);
        },

        _wireEvents: function (remove) {
            if (!this.model.isPaneOpen || remove) {
                //Event Binding
                if (this.model.targetId) {
                    if (ej.getCurrentPage)
                        var ele = ej.getCurrentPage();
                    else
                        var ele = $("body");
                    ej.listenTouchEvent(ele.find("#" + this.model.targetId), (this._prefixClass == "e-" ? "click" : ej.endEvent()), this._targetButtonTapHandler, remove, this);
                }
                else {
                    if (!(ej.browserInfo().name == "msie" && ej.browserInfo().version <= 8))
                        ej.listenTouchEvent(this._nbHome, ej.startEvent(), this._swipeStartHandler, remove, this);
                }
                //Ovelay Binding
                ej.listenTouchEvent(this._elementOverlay, ej.endEvent(), this._overlayTapHandler, remove, this);
            }
            if (this.model.isPaneOpen) {
                if (ej.isTouchDevice() && this._isOrientationSupported())
                    ej.listenTouchEvent(window, "orientationchange", this._onOrientationChangeHandler, remove, this);
                else
                    ej.listenTouchEvent(window, "resize", this._onResizeEventHandler, remove, this);
            }
        },
        _onResizeEvent: function (e) {
            var state;
            this.element.show();
            if (this._isOpened() && this.element.is(":visible") && !this.model.isPaneOpen) { state = "opened "; } else { state = "closed" }
            this._transform(0, 0, this._isTransitionElement());
            this.element.hide();
            this.element.removeClass("" + this._prefixClass + "nb-opened");
            this._clearHomeElement();
            this._parentWidth = this._nbHome.width();
            this._setWidth();
            this._setLayout();
            if (state == "opened ") { this._show(); }
        },
        _onOrientationChangeEvent: function (e) {
            var state;
            this.element.show();
            if (this._isOpened() && this.element.is(":visible")) { state = "opened "; } else { state = "closed" }
            if (window.orientation == 0 || window.orientation == 180 || window.orientation == 90) { window.scrollTo(0, 0); }
            this._transform(0, 0, this._isTransitionElement());
            this.element.hide();
            this.element.removeClass("" + this._prefixClass + "nb-opened");
            this._parentWidth = this._nbHome.width();
            this._clearHomeElement();
            var proxy = this
            setTimeout(function () {
                proxy._setWidth();
                proxy._setLayout();
                if (state == "opened ") { proxy._show(); }
            }, 300);
        },
        _transitionCloseEnd: function () {
            if(!ej.isNullOrUndefined(this.element)) this.element.hide();
            this._clearHomeElement();
            ej.listenTouchEvent((this._isTransitionElement() ? this.element : this._nbHome), ej.transitionEndEvent(), this._transitionCloseHandler, true, this);
            if(this._lbObj)
                this.model.listViewSettings.selectedItemIndex = this._lbObj.model.selectedItemIndex;
        },
        _transitionOpenEnd: function () {
            if (!ej.isNullOrUndefined(this.element)) this.element.show();
            if (this._scrollbar)
                this._scrollbar.ejmScrollPanel("refresh");
            if (this._lbscrollbar)
                this._lbscrollbar.ejmScrollPanel("refresh");
            ej.listenTouchEvent((this._isTransitionElement() ? this.element : this._nbHome), ej.transitionEndEvent(), this._transitionOpenHandler, true, this);
        },

        _targetButtonTap: function (e) {
            e.preventDefault();
            if (!this._isOtherOpened()) this._show();
        },
        _elementOverlayTap: function (e) {
            ej.blockDefaultActions(e);
            this._data = { element: this.element };
            this.model.enableListView ? $.extend(this._data, { listview: this._lb }) : undefined;
            if(this._trigger("beforeClose", this._data)) return;
            this._hide();
        },

        _swipeStart: function (e) {
            var point = e.changedTouches ? e.changedTouches[0] : e;
            this._startSwipeOffsetX = point.clientX - this._nbHome.offset().left;
            this._startSwipeOffsetActualX = point.clientX;
            this._startSwipeOffsetY = point.clientY;
            this._containerX = this._isTransitionElement() ? this.element.offset().left : this._nbHome.offset().left;
            ej.listenTouchEvent(this._nbHome, ej.moveEvent(), this._swipeMoveHandler, false, this);
            ej.listenTouchEvent(this._nbHome, ej.endEvent(), this._swipeEndHandler, false, this);
        },

        _swipeMove: function (e) {
            var point = e.changedTouches ? e.changedTouches[0] : e;
            if (!ej.isNullOrUndefined(this.element.css("left").match((/\d/g))) && Number(this.element.css("left").match((/\d/g))[0]) < this.element.width()) this._setLayout();
            if (this._startSwipeOffsetActualX && this._startSwipeOffsetActualX > (point.clientX)) { this._swipeDirection = "right"; }
            else { this._swipeDirection = "left"; }
            var allowOpDirection = this._isOpened() ? (this._swipeDirection != this.model.direction.toLowerCase() ? true : false) : false;
            if (!allowOpDirection) {
                if (this._swipeDirection == this.model.direction.toLowerCase() && !this._isOtherOpened()) {
                    ej.listenEvents([this._nbHome, this._nbHome, this._nbHome], [ej.moveEvent(), ej.endEvent()], [this._touchMoveHandler, this._touchEndHandler], false, this);
                }
                else {
                    ej.listenEvents([this._nbHome, this._nbHome, this._nbHome], [ej.moveEvent(), ej.endEvent()], [this._touchMoveHandler, this._touchEndHandler], true, this);
                }
            }
            else {
                if (this._startSwipeOffsetX && this._isOpened()) {
                    this._relativeX = point.clientX - this._startSwipeOffsetActualX;
                    this._relativeY = point.clientY - this._startSwipeOffsetY;
                    var leftPoint = (this.element.width() + this._relativeX) - (this.model.type.toLowerCase() == "overlay" ? this._nbHome.offset().left : 0);
                    if ($(point.target).hasClass("" + this._prefixClass + "nb-overlay")) {
                        if (this.model.direction == "left" ? -(this._relativeX) < this.element.width() : this._relativeX < this.element.width())
                            this._transform((this.model.direction == "left" ? leftPoint : -((this.element.width() - this._relativeX))), 0, this._isTransitionElement());
                    }
                }
            }
        },

        _swipeEnd: function (e) {
            var point = e.changedTouches ? e.changedTouches[0] : e;
            ej.listenTouchEvent(this._nbHome, ej.moveEvent(), this._swipeMoveHandler, true, this);
            ej.listenTouchEvent(this._nbHome, ej.endEvent(), this._swipeEndHandler, true, this);
        },

        _touchMove: function (e) {
            var point = e.changedTouches ? e.changedTouches[0] : e;
            ej.listenTouchEvent(this._nbHome, ej.moveEvent(), this._swipeMoveHandler, true, this);
            if (this._isTransitionElement()) { this._containerX = 0; }
            if (this._startSwipeOffsetX && !this._isOpened()) {
                this._relativeX = point.clientX - this._startSwipeOffsetX;
                this._relativeY = point.clientY - this._startSwipeOffsetY;
                if ((this.model.direction == "left" ? this._startSwipeOffsetX < 50 : this._startSwipeOffsetX > this._nbHome.width() - 50)) {
                    this.element.show();
                    var leftPoint = this.model.type.toLowerCase() == "slide" ? 0 : this._nbHome.offset().left;
                    if (this.model.direction == "left" ? this._relativeX - leftPoint < this.element.width() : this._relativeX - leftPoint > -(this.element.width())) {
                        !this._containerX || this.model.targetHome ? this._transform((this._containerX + this._relativeX) - leftPoint, 0, this._isTransitionElement()) : undefined;
                    }
                }
            }
        },

        _touchEnd: function (e) {
            var point = e.changedTouches ? e.changedTouches[0] : e;
            ej.listenTouchEvent(this._nbHome, ej.moveEvent(), this._touchMoveHandler, true, this);
            if (!this._isOpened() && !($.isFunction(ej.isIOS7) ? ej.isIOS7() : false)) {
                if (!this._containerX) {
                    this._relativeX = point.clientX - this._startSwipeOffsetX;
                    this._relativeY = point.clientY - this._startSwipeOffsetY;
                    if (this.model.direction == "left" ? this._startSwipeOffsetX < 50 : this._startSwipeOffsetX > this._nbHome.width() - 50) {
                        if (this._relativeX > 30 || this._relativeX < -30)
                            this._show();
                        else
                            this._hide();
                    }
                }
                else {
                    this._hide();
                }
            }
            this._data = { targetElement: this._nbHome, element: this.element, direction: this._swipeDirection };
            this.model.enableListView ? $.extend(this._data, { listview: this._lb }) : undefined;
            if(this._trigger("swipe", this._data)) return;
            ej.listenTouchEvent(this._nbHome, ej.endEvent(), this._touchEndHandler, true, this);
            ej.listenTouchEvent(this._nbHome, "mouseleave", this._touchEndHandler, true, this);
        },

        open: function (e) {
            if (!this.model.isPaneOpen) {
                this._show();
            }
        },

        close: function (e) {
            if (!this.model.isPaneOpen) {
                this._data = { element: this.element };
                this.model.enableListView ? $.extend(this._data, { listview: this._lb }) : undefined;
                if(this._trigger("beforeClose", this._data)) return;
                this._hide();
            }
        },

        toggle: function (e) {
            if (!this.model.isPaneOpen) {
                this._isOpened() ? this.close() : this.open();
            }
        }
    });

})(jQuery, Syncfusion);