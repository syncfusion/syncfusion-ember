ej.EjSvgScrollbarRender = function (element, scrollObj) {
    this.svgSupport = (window.SVGSVGElement) ? true : false;
    var id = jQuery(element).attr("id");
    this.scrollsvgObj = this.scrollsvgObj ? this.scrollsvgObj : [];
    if (this.svgSupport) {
        this.svgLink = "http://www.w3.org/2000/svg";
        this.scrollsvgObj[scrollObj.index] = document.createElementNS(this.svgLink, "svg");
        this.scrollsvgObj[scrollObj.index].setAttribute('id', "scrollbar_" + id + scrollObj.index);
    } else {
        var doc = document;
        this.scrollsvgObj[scrollObj.index] = doc.createElement("div");
        this.scrollsvgObj[scrollObj.index].style.position = 'relative';
        this.scrollsvgObj[scrollObj.index].setAttribute('id', "scrollbar_" + id + scrollObj.index);
    }
};

(function ($) {
    ej.EjSvgScrollbarRender.prototype = {

        _initializeScrollbarVariables: function (scrollObj) {
            scrollObj.offsetLeftX = 0
            scrollObj.rectWidth = scrollObj.offsetRightX = scrollObj.oldWidth = scrollObj.width;
            scrollObj.startX = 0, scrollObj.endX = 0;
            scrollObj.scrollbarLoaded = false;

            if (scrollObj.zoomPosition || scrollObj.zoomFactor) {
                scrollObj.offsetLeftX = (scrollObj.zoomPosition * scrollObj.width);
                scrollObj.rectWidth = (scrollObj.zoomFactor) * scrollObj.width;
            }
        },

        _scrollbarUpdate: function (scrollObj) {

            var width = parseFloat(scrollObj.width),
                arrowsize = 15,
                minimumRect = 44,
                panningRect = width - 30;// arrowSize * 2 
            scrollObj.offsetLeftX = !scrollObj.scrollbarLoaded ? scrollObj.offsetLeftX : (scrollObj.offsetLeftX - arrowsize);
            scrollObj.offsetLeftX = scrollObj.offsetLeftX < arrowsize ? 0 : scrollObj.offsetLeftX;
            var offsetLeftX = ((scrollObj.offsetLeftX / scrollObj.oldWidth) * panningRect) + arrowsize;
            var rectWidth = ((scrollObj.rectWidth / scrollObj.oldWidth) * panningRect);
            isMinWidth = rectWidth < minimumRect;
            scrollObj._diff = isMinWidth ? minimumRect - rectWidth : 0;
            rectWidth = rectWidth > minimumRect ? rectWidth : minimumRect;
            scrollObj.oldWidth = panningRect;
            var offsetRightX = offsetLeftX + rectWidth;
            scrollObj.rectWidth = rectWidth;
            scrollObj.offsetLeftX = scrollObj.startX = offsetLeftX;
            scrollObj.offsetRightX = (offsetRightX - arrowsize) <= offsetLeftX ? (offsetRightX + arrowsize) : offsetRightX;
            scrollObj.endX = scrollObj.width - scrollObj.offsetRightX;
            scrollObj.startX = offsetLeftX < arrowsize ? arrowsize : offsetLeftX;
            if ((offsetLeftX + rectWidth) > (scrollObj.width - arrowsize)) {
                scrollObj.offsetLeftX = scrollObj.startX = scrollObj.width - arrowsize - rectWidth;
                scrollObj.offsetRightX = scrollObj.width - arrowsize;
                scrollObj.endX = scrollObj.width - scrollObj.offsetRightX;
            }
            scrollObj.scrollbarLoaded = true;

        },

        _renderScrollbar: function (scrollObj) {

            this.scrollsvgObj = this.scrollsvgObj ? this.scrollsvgObj : [];
            $(this.scrollsvgObj[scrollObj.index]).empty();
            if (this.scrollsvgObj[scrollObj.index])
                $(document).find('[id*= ' + this.scrollsvgObj[scrollObj.index].id + ']').attr('height', '0px');
            var id = this._id;
            var arrowSize = 15;
            var scrollHeight = 18;
            var minimumScrollSize = 44;
            this.scrollsvgObj[scrollObj.index] = this.scrollbarContainer.scrollsvgObj[scrollObj.index];
            var height = 17, width = parseFloat(scrollObj.width), padding = 8, centerY = (height / 2), panningRect = width - (arrowSize * 2);
            scrollObj.offsetLeftX = !scrollObj.scrollbarLoaded ? scrollObj.offsetLeftX : (scrollObj.offsetLeftX - arrowSize);
            scrollObj.offsetLeftX = scrollObj.offsetLeftX < arrowSize ? 0 : scrollObj.offsetLeftX;
            var offsetLeftX = ((scrollObj.offsetLeftX / scrollObj.oldWidth) * panningRect) + arrowSize;
            var rectWidth = ((scrollObj.rectWidth / scrollObj.oldWidth) * panningRect);
            isMinWidth = rectWidth < minimumScrollSize;
            scrollObj._diff = isMinWidth ? minimumScrollSize - rectWidth : 0;
            rectWidth = rectWidth > minimumScrollSize ? rectWidth : minimumScrollSize;
            scrollObj.oldWidth = panningRect;
            offsetLeftX = ((offsetLeftX + rectWidth) > panningRect) ? (panningRect - (rectWidth - arrowSize)) : offsetLeftX;
            var offsetRightX = offsetLeftX + rectWidth;
            scrollObj.rectWidth = rectWidth;
            scrollObj.offsetLeftX = scrollObj.startX = offsetLeftX;
            scrollObj.offsetRightX = offsetLeftX + rectWidth;
            scrollObj.endX = scrollObj.width - scrollObj.offsetRightX;
            scrollObj.scrollbarLoaded = true;
            offsetRightX = (offsetRightX - arrowSize) <= offsetLeftX ? (offsetRightX + arrowSize) : offsetRightX;
            var xPadding = this.padding || 0;
            var yPadding = !this.vmlRendering ? 0 : -5;
            if (scrollObj.orientation == 'horizontal')
                this.scrollbar = this.renderer.createGroup({ 'id': id + '_scrollbar' + '_' + scrollObj.index, transform: "translate(" + xPadding + "," + yPadding + ")" });
            else
                this.scrollbar = this.renderer.createGroup({ 'id': id + '_scrollbar' + '_' + scrollObj.index, transform: "translate(" + 0 + "," + scrollObj.width + ") rotate(270)" });
            //Draw a rounded corner path direction
            var makeShape = function (x, y, width, height, r, scrollObj) {
                var
                    spc = " ", // path drawing instruction letters with readable names
                    moveTo = "M",
                    horizLineTo = "h",
                    vertLineTo = "v",
                    arcTo = "a",
                    closePath = "z",
                    ori = scrollObj.orientation,
                    opp = scrollObj.opposed,
                    dStr;
                if ((ori == 'vertical' && !opp) || (opp && ori != 'vertical')) {
                    dStr = // the "d" path for the svg path
                        moveTo + spc + x + spc + r + spc +
                        vertLineTo + spc + (height - r) + spc +
                        horizLineTo + spc + (width) + spc +
                        vertLineTo + spc + (r - height) + spc +
                        arcTo + spc + r + spc + r + spc + 0 + spc + 0 + spc + 0 + spc + (-r) + spc + (-r) + spc +
                        horizLineTo + spc + -(width - 2 * r) + spc +
                        arcTo + spc + r + spc + r + spc + 0 + spc + 0 + spc + 0 + spc + (-4) + spc + (r) + spc +
                        closePath;

                } else {
                    dStr = // the "d" path for the svg path
                        moveTo + spc + x + spc + y + spc +
                        vertLineTo + spc + (height - r) + spc +
                        arcTo + spc + r + spc + r + spc + 0 + spc + 0 + spc + 0 + spc + r + spc + r + spc +
                        horizLineTo + spc + (width - 2 * r) + spc +
                        arcTo + spc + r + spc + r + spc + 0 + spc + 0 + spc + 0 + spc + r + spc + (-r) + spc +
                        vertLineTo + spc + (r - height) + spc +
                        closePath;
                }

                return dStr;
            };
            var direction = makeShape(0, 0, width, scrollHeight, 4, scrollObj);

            //Create a scrollbar background rectangle
            var rectBorder = {
                'id': id + '_scrollbarBackRect_' + scrollObj.index,
                'stroke-width': 1,
                'height': scrollHeight,
                'width': width,
                'stroke-linejoin': "round",
                'stroke': "#B4B4B4",
                'fill': "#F7F7F7",
                'class': 'e-rangeScroll-backRect'
            };

            if (!this.vmlRendering) {
                rectBorder.d = direction;
                this.renderer.drawPath(rectBorder, this.scrollbar);
            } else
                this.renderer.drawRect(rectBorder, this.scrollbar);

            var rightRectBorder = {
                'id': id + '_scrollbarRightRect_' + scrollObj.index,
                'stroke-width': 1,
                'x': (width - 5),
                'height': scrollHeight,
                'width': 5,
                'stroke-linejoin': "round",
                'stroke': "transparent",
                'fill': "transparent"
            };
            this.renderer.drawRect(rightRectBorder, this.scrollbar);

            var leftRectBorder = {
                'id': id + '_scrollbarLeftRect_' + scrollObj.index,
                'stroke-width': 1,
                'x': 0,
                'height': scrollHeight,
                'width': 5,
                'stroke-linejoin': "round",
                'stroke': "transparent",
                'fill': "transparent"
            };
            this.renderer.drawRect(leftRectBorder, this.scrollbar);

            //Create a left Arrow
            var leftArrow = {
                'id': id + '_scrollbarLeftArrow_' + scrollObj.index,
                'stroke-width': 1,
                'stroke': "#999999",
                'd': "M " + 5 + " " + 9 + " " + "L " + 10 + " " + 14 + " " + "L " + 10 + " " + 3.5 + " Z",
                'fill': "#999999",
                'class': "e-rangeScroll-arrow"
            };
            this.renderer.drawPath(leftArrow, this.scrollbar);

            ////Create a right Arrow
            var rightArrow = {
                'id': id + '_scrollbarRightArrow_' + scrollObj.index,
                'stroke-width': 1,
                'stroke': "#999999",
                'd': "M " + (width - 5) + " " + 9 + " " + "L " + (width - 10) + " " + 14 + " " + "L " + (width - 10) + " " + 3.5 + " Z",
                'fill': "#999999",
                'class': "e-rangeScroll-arrow"
            };
            this.renderer.drawPath(rightArrow, this.scrollbar);

            var options = {
                'id': id + '_scrollbarSelect_' + scrollObj.index,
                x: offsetLeftX,
                y: 0,
                'width': rectWidth,
                'rx': 4,
                'ry': 4,
                'height': height,
                'stroke': "#999999",
                'stroke-width': 1,
                'fill': "#CECECE",
                'class': 'e-rangeScroll-select'
            };
            this.renderer.drawRect(options, this.scrollbar);
            this.centerLine = this.renderer.createGroup({ 'id': id + '_scrollbarCenterLine_' + scrollObj.index, transform: "translate(" + (offsetLeftX + (rectWidth / 2) - 7.5) + ")" });

            //Create a center shape
            var shape = {
                'id': id + '_scrollbarCenterShape_' + scrollObj.index,
                'stroke-width': 1,
                'stroke': "#999999",
                'd': "M " + 0 + " " + 3.5 + " " + "L " + 0 + " " + 13.5 + " Z" + "M " + 5 + " " + 3.5 + " " + "L " + 5 + " " + 13.5 + " Z" + "M " + 10 + " " + 3.5 + " " + "L " + 10 + " " + 13.5 + " Z" + "M " + 15 + " " + 3.5 + " " + "L " + 15 + " " + 13.5 + " Z",
                'fill': "#999999",
                'class': 'e-rangeScroll-centerShape'
            };
            this.renderer.drawPath(shape, this.centerLine);
            this.renderer.append(this.centerLine, this.scrollbar);
            var leftHeaderHideRectOptions = {
                'id': id + '_leftHeaderHideRect_' + scrollObj.index,
                'x': offsetLeftX,
                'y': 0,
                'width': 11,
                'height': 17,
                'fill': 'transparent',
                'opacity': 0,
                'stroke-width': 1,
                'class': 'e-rangeScroll-leftRect'
            }
            this.renderer.drawRect(leftHeaderHideRectOptions, this.scrollbar);
            var leftHeaderOptions = {
                'id': id + '_scrollbarLeftHeader_' + scrollObj.index,
                'cx': offsetLeftX + padding,
                'cy': centerY,
                'r': 3,
                "fill": "#999999",
                'stroke': "#999999",
                'stroke-width': 1,
                'class': 'e-rangeScroll-leftCircle'
            };
            this.renderer.drawCircle(leftHeaderOptions, this.scrollbar);
            var rightHeaderHideRectOptions = {
                'id': id + '_rightHeaderHideRect_' + scrollObj.index,
                'x': offsetRightX - 11,
                'y': 0,
                'width': 11,
                'height': height,
                'fill': 'transparent',
                'opacity': 0,
                'stroke-width': 1,
                'class': 'e-rangeScroll-rightRect'
            };
            this.renderer.drawRect(rightHeaderHideRectOptions, this.scrollbar);
            var rightHeaderOptions = {
                'id': id + '_scrollbarRightHeader_' + scrollObj.index,
                "fill": "#999999",
                'cx': offsetRightX - padding,
                'cy': centerY,
                'r': 3,
                'stroke': "#999999",
                'stroke-width': 1,
                'class': 'e-rangeScroll-rightCircle'
            };
            this.renderer.drawCircle(rightHeaderOptions, this.scrollbar);

            this.renderer.append(this.scrollbar, this.scrollsvgObj[scrollObj.index]);
            if (scrollObj.orientation == 'horizontal') {
                this.scrollsvgObj[scrollObj.index].setAttribute("height", scrollHeight);
                this.scrollsvgObj[scrollObj.index].setAttribute("width", width);
            } else {
                this.scrollsvgObj[scrollObj.index].setAttribute("height", width);
                this.scrollsvgObj[scrollObj.index].setAttribute("width", scrollHeight);
            }
            this.renderer.append(this.scrollsvgObj[scrollObj.index], scrollObj.parent);

            //Apply CSS styles to scrollbar controls          
            var vmlPadding = !this.vmlRendering ? scrollObj.y : scrollObj.y + 5;
            if (this.pluginName == "ejRangeNavigator")
                this.scrollsvgObj[scrollObj.index].setAttribute('style', 'overflow:visible;position:relative;display:block; top:' + (vmlPadding - scrollObj.y) + 'px;' + 'left:' + scrollObj.x + 'px');
            else
                this.scrollsvgObj[scrollObj.index].setAttribute('style', 'overflow:visible;position:absolute;display:block; top:' + vmlPadding + 'px;' + 'left:' + scrollObj.x + 'px');
            $("#" + id + "_scrollbarSelect_" + scrollObj.index).css({ "cursor": "pointer" });
            if (scrollObj.enableResize) {
                $("#" + id + "_leftHeaderHideRect_" + scrollObj.index).css({ "cursor": scrollObj.orientation == 'horizontal' ? "w-resize" : "n-resize" });
                $("#" + id + "_rightHeaderHideRect_" + scrollObj.index).css({ "cursor": scrollObj.orientation == 'horizontal' ? "w-resize" : "n-resize" });
                $("#" + id + "_scrollbarRightHeader_" + scrollObj.index).css({ "cursor": scrollObj.orientation == 'horizontal' ? "w-resize" : "n-resize" });
                $("#" + id + "_scrollbarLeftHeader_" + scrollObj.index).css({ "cursor": scrollObj.orientation == 'horizontal' ? "w-resize" : "n-resize" });
            } else {
                $("#" + id + "_leftHeaderHideRect_" + scrollObj.index).hide();
                $("#" + id + "_rightHeaderHideRect_" + scrollObj.index).hide();
                $("#" + id + '_scrollbarLeftHeader_' + scrollObj.index).hide();
                $("#" + id + '_scrollbarRightHeader_' + scrollObj.index).hide();
            }

            if (this.vmlRendering) {
                $('#' + id + '_leftHeaderHideRect_' + scrollObj.index).css("visibility", 'hidden');
                $('#' + id + '_rightHeaderHideRect_' + scrollObj.index).css("visibility", 'hidden');
            }

            this.scrollbarContainer._bindScrollEvents.call(this, scrollObj);
        },

        _bindScrollEvents: function (scrollObj) {
            //Binding Mouse Events to scrollbar
            var rootId = this._id;
            var matched = jQuery.uaMatch(navigator.userAgent);
            var isIE11 = !!navigator.userAgent.match(/Trident\/7\./);
            bindDesktopEvents.call(this, scrollObj);
            if (window.PointerEvent) { //Added pointer event for IE11

                this._on($('#' + rootId + '_scrollbarLeftHeader_' + scrollObj.index), "pointerdown", this.scrollbarContainer._leftScrollbarDown);
                this._on($('#' + rootId + '_scrollbarRightHeader_' + scrollObj.index), "pointerdown", this.scrollbarContainer._rightScrollbarDown);

                this._on($('#' + rootId + '_leftHeaderHideRect_' + scrollObj.index), "pointerdown", this.scrollbarContainer._leftScrollbarDown);
                this._on($('#' + rootId + '_rightHeaderHideRect_' + scrollObj.index), "pointerdown", this.scrollbarContainer._rightScrollbarDown);

                this._on($('#' + rootId + '_scrollbarLeftArrow_' + scrollObj.index), "pointerdown", this.scrollbarContainer._leftArrowDown);
                this._on($('#' + rootId + '_scrollbarLeftArrow_' + scrollObj.index), "pointerup", this.scrollbarContainer._leftArrowUp);

                this._on($('#' + rootId + '_scrollbarRightArrow_' + scrollObj.index), "pointerdown", this.scrollbarContainer._rightArrowDown);
                this._on($('#' + rootId + '_scrollbarRightArrow_' + scrollObj.index), "pointerup", this.scrollbarContainer._rightArrowUp);

                this._on($('#' + rootId + '_scrollbarSelect_' + scrollObj.index), "pointerdown", this.scrollbarContainer._scrollSelectRectDown);
                this._on($('#' + rootId + '_scrollbarBackRect_' + scrollObj.index), "pointerdown", this.scrollbarContainer._scrollBackRectDown);
                this._on($('#' + rootId + '_scrollbarBackRect_' + scrollObj.index), "pointerup", this.scrollbarContainer._scrollBackRectUp);

                this._on($(window), "pointermove", this.scrollbarContainer._scrollbarMove);
                this._on($(window), "pointerup", this.scrollbarContainer._scrollbarUp);
                this._on($(this.scrollsvgObj[scrollObj.index]), "pointermove", this.scrollbarContainer._scrollbarMove);
                this._on($(this.scrollsvgObj[scrollObj.index]), "pointerup", this.scrollbarContainer._scrollbarUp);

                $(this.scrollsvgObj[scrollObj.index]).css('touch-action', 'none');
            }
            else if (window.navigator.msPointerEnabled && !isIE11) {

                this._on($('#' + rootId + '_scrollbarLeftHeader_' + scrollObj.index), "MSPointerDown", this.scrollbarContainer._leftScrollbarDown);
                this._on($('#' + rootId + '_scrollbarRightHeader_' + scrollObj.index), "MSPointerDown", this.scrollbarContainer._rightScrollbarDown);

                this._on($('#' + rootId + '_leftHeaderHideRect_' + scrollObj.index), "MSPointerDown", this.scrollbarContainer._leftScrollbarDown);
                this._on($('#' + rootId + '_rightHeaderHideRect_' + scrollObj.index), "MSPointerDown", this.scrollbarContainer._rightScrollbarDown);

                this._on($('#' + rootId + '_scrollbarLeftArrow_' + scrollObj.index), "MSPointerDown", this.scrollbarContainer._leftArrowDown);
                this._on($('#' + rootId + '_scrollbarLeftArrow_' + scrollObj.index), "MSPointerUp", this.scrollbarContainer._leftArrowUp);

                this._on($('#' + rootId + '_scrollbarRightArrow_' + scrollObj.index), "MSPointerDown", this.scrollbarContainer._rightArrowDown);
                this._on($('#' + rootId + '_scrollbarRightArrow_' + scrollObj.index), "MSPointerUp", this.scrollbarContainer._rightArrowUp);

                this._on($('#' + rootId + '_scrollbarSelect_' + scrollObj.index), "MSPointerDown", this.scrollbarContainer._scrollSelectRectDown);
                this._on($('#' + rootId + '_scrollbarBackRect_' + scrollObj.index), "MSPointerDown", this.scrollbarContainer._scrollBackRectDown);
                this._on($('#' + rootId + '_scrollbarBackRect_' + scrollObj.index), "MSPointerUp", this.scrollbarContainer._scrollBackRectUp);

                this._on($(window), "MSPointerMove", this.scrollbarContainer._scrollbarMove);
                this._on($(window), "MSPointerUp", this.scrollbarContainer._scrollbarUp);
                this._on($(this.scrollsvgObj[scrollObj.index]), "MSPointerMove", this.scrollbarContainer._scrollbarMove);
                this._on($(this.scrollsvgObj[scrollObj.index]), "MSPointerUp", this.scrollbarContainer._scrollbarUp);

                $(this.scrollsvgObj[scrollObj.index]).css('-ms-touch-action', 'none');

            } else if (matched.browser.toLowerCase() == "chrome") {
                bindTouchEvents.call(this, scrollObj);
            } else if (this.isDevice()) {

                var isSafari = (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1);
                var isInIframe = (window.location != window.parent.location) ? true : false;
                var userAgent = isInIframe ? window.parent.navigator.userAgent.toLowerCase() : window.navigator.userAgent.toLowerCase();
                var device = /mobile|tablet|android|kindle/i.test(userAgent);
                if ((ej.isMobile() && this.isWindows()) || (!device && ej.isMobile() && isSafari)) { // for safari mobile browser and windows phone                    
                    bindDesktopEvents.call(this);
                    $(this.scrollsvgObj[scrollObj.index]).css('-ms-touch-action', 'none');
                } else
                    bindTouchEvents.call(this, scrollObj);
            }
            var eventName = matched.browser.toLowerCase() == "mozilla" ? (isIE11 ? "mousewheel" : "DOMMouseScroll") : "mousewheel";
            this._on($(this.scrollsvgObj[scrollObj.index]), eventName, this.scrollbarContainer._scrollMouseWheel);

            if (isIE11)
                $(this.scrollsvgObj[scrollObj.index]).css('touch-action', 'none');

            function bindDesktopEvents(scrollObj) {
                this._on($('#' + rootId + '_scrollbarLeftHeader_' + scrollObj.index), "mousedown", this.scrollbarContainer._leftScrollbarDown);
                this._on($('#' + rootId + '_scrollbarRightHeader_' + scrollObj.index), "mousedown", this.scrollbarContainer._rightScrollbarDown);

                this._on($('#' + rootId + '_leftHeaderHideRect_' + scrollObj.index), "mousedown", this.scrollbarContainer._leftScrollbarDown);
                this._on($('#' + rootId + '_rightHeaderHideRect_' + scrollObj.index), "mousedown", this.scrollbarContainer._rightScrollbarDown);

                this._on($('#' + rootId + '_scrollbarLeftArrow_' + scrollObj.index), "mousedown", this.scrollbarContainer._leftArrowDown);
                this._on($('#' + rootId + '_scrollbarLeftArrow_' + scrollObj.index), "mouseup", this.scrollbarContainer._leftArrowUp);

                this._on($('#' + rootId + '_scrollbarRightArrow_' + scrollObj.index), "mousedown", this.scrollbarContainer._rightArrowDown);
                this._on($('#' + rootId + '_scrollbarRightArrow_' + scrollObj.index), "mouseup", this.scrollbarContainer._rightArrowUp);

                this._on($('#' + rootId + '_scrollbarSelect_' + scrollObj.index), "mousedown", this.scrollbarContainer._scrollSelectRectDown);
                this._on($('#' + rootId + '_scrollbarBackRect_' + scrollObj.index), "mousedown", this.scrollbarContainer._scrollBackRectDown);
                this._on($('#' + rootId + '_scrollbarBackRect_' + scrollObj.index), "mouseup", this.scrollbarContainer._scrollBackRectUp);

                this._on($(window), "mousemove", this.scrollbarContainer._scrollbarMove);
                this._on($(window), "mouseup", this.scrollbarContainer._scrollbarUp);
                this._on($(this.svgObject), "mousemove", this.scrollbarContainer._scrollbarMove);
                this._on($(this.scrollsvgObj[scrollObj.index]), "mousemove", this.scrollbarContainer._scrollbarMove);
                this._on($(this.scrollsvgObj[scrollObj.index]), "mouseup", this.scrollbarContainer._scrollbarUp);
            }

            function bindTouchEvents(scrollObj) {
                this._on($('#' + rootId + '_scrollbarLeftHeader_' + scrollObj.index), "touchstart", this.scrollbarContainer._leftScrollbarDown);
                this._on($('#' + rootId + '_scrollbarRightHeader_' + scrollObj.index), "touchstart", this.scrollbarContainer._rightScrollbarDown);

                this._on($('#' + rootId + '_leftHeaderHideRect_' + scrollObj.index), "touchstart", this.scrollbarContainer._leftScrollbarDown);
                this._on($('#' + rootId + '_rightHeaderHideRect_' + scrollObj.index), "touchstart", this.scrollbarContainer._rightScrollbarDown);

                this._on($('#' + rootId + '_scrollbarLeftArrow_' + scrollObj.index), "touchstart", this.scrollbarContainer._leftArrowDown);
                this._on($('#' + rootId + '_scrollbarLeftArrow_' + scrollObj.index), "touchend", this.scrollbarContainer._leftArrowUp);

                this._on($('#' + rootId + '_scrollbarRightArrow_' + scrollObj.index), "touchstart", this.scrollbarContainer._rightArrowDown);
                this._on($('#' + rootId + '_scrollbarRightArrow_' + scrollObj.index), "touchend", this.scrollbarContainer._rightArrowUp);

                this._on($('#' + rootId + '_scrollbarSelect_' + scrollObj.index), "touchstart", this.scrollbarContainer._scrollSelectRectDown);
                this._on($('#' + rootId + '_scrollbarBackRect_' + scrollObj.index), "touchstart", this.scrollbarContainer._scrollBackRectDown);
                this._on($('#' + rootId + '_scrollbarBackRect_' + scrollObj.index), "touchend", this.scrollbarContainer._scrollBackRectUp);

                this._on($(window), "touchmove", this.scrollbarContainer._scrollbarMove);
                this._on($(window), "touchend", this.scrollbarContainer._scrollbarUp);
                this._on($(this.scrollsvgObj[scrollObj.index]), "touchmove", this.scrollbarContainer._scrollbarMove);
                this._on($(this.scrollsvgObj[scrollObj.index]), "touchend", this.scrollbarContainer._scrollbarUp);

            }
        },

        _setScrollPosition: function (startX, offsetRightX, scrollObj) {
            var padding = 8;
            var rootId = this._id;
            var centerLine = (startX + (scrollObj.rectWidth / 2) - 7.5);
            $('#' + rootId + '_scrollbarLeftHeader_' + scrollObj.index).attr("cx", startX + padding);
            $('#' + rootId + '_leftHeaderHideRect_' + scrollObj.index).attr("x", startX);

            $('#' + rootId + '_scrollbarRightHeader_' + scrollObj.index).attr("cx", offsetRightX - padding);
            $('#' + rootId + '_rightHeaderHideRect_' + scrollObj.index).attr("x", offsetRightX - 5);
            $('#' + rootId + '_scrollbarSelect_' + scrollObj.index).attr("x", startX);
            $('#' + rootId + '_scrollbarSelect_' + scrollObj.index).attr("width", scrollObj.rectWidth);
            $('#' + rootId + '_scrollbarCenterLine_' + scrollObj.index).attr('transform', 'translate(' + centerLine + ')');
            //Apply styles for VML support
            if (this.pluginName == "ejRangeNavigator") {
                $('#' + rootId + '_scrollbarLeftHeader_' + scrollObj.index).css("left", startX);
                $('#' + rootId + '_leftHeaderHideRect_' + scrollObj.index).css("left", startX);
                $('#' + rootId + '_scrollbarRightHeader_' + scrollObj.index).css("left", offsetRightX - padding);
                $('#' + rootId + '_rightHeaderHideRect_' + scrollObj.index).css("left", offsetRightX - 5);
                $('#' + rootId + '_scrollbarSelect_' + scrollObj.index).css("left", startX);
                $('#' + rootId + '_scrollbarCenterLine_' + scrollObj.index).css('left', centerLine);
            }
        },
        _calculateScrollLeftMove: function (moveLength, scrollObj) {

            if (scrollObj._startX - moveLength > 15) {
                scrollObj.startX = scrollObj._startX - moveLength;
                scrollObj.offsetLeftX = scrollObj.startX;
                scrollObj._offsetRightX = scrollObj.startX + scrollObj.rectWidth;
                scrollObj.offsetRightX = scrollObj._offsetRightX;
                scrollObj.endX = scrollObj.width - scrollObj.offsetRightX;
            } else {
                scrollObj.startX = 15;
                scrollObj._offsetLeftX = scrollObj.offsetLeftX;
                scrollObj.offsetLeftX = scrollObj.startX;
                scrollObj._offsetRightX = scrollObj.startX + scrollObj.rectWidth;
                scrollObj.offsetRightX = scrollObj._offsetRightX;
                scrollObj.endX = scrollObj.width - scrollObj.offsetRightX;
            }
        },
        _calculateScrollRightMove: function (moveLength, scrollObj) {
            if (scrollObj && (scrollObj._offsetRightX + (Math.abs(moveLength))) < scrollObj.width - 15) {
                scrollObj._startX = scrollObj.startX + Math.abs(moveLength);
                scrollObj.offsetLeftX = scrollObj._startX;
                scrollObj.offsetRightX = scrollObj._offsetRightX + Math.abs(moveLength);
                scrollObj.endX = scrollObj.width - scrollObj.offsetRightX;
            } else {
                scrollObj._ofsetRightX = scrollObj.offsetRightX;
                scrollObj.offsetRightX = scrollObj.width - 15;
                scrollObj._startX = scrollObj.offsetRightX - scrollObj.rectWidth;
                scrollObj.offsetLeftX = scrollObj._startX;
                scrollObj.endX = scrollObj.width - scrollObj.offsetRightX;
            }
        },
        _calculateRange: function (startX, endX, scrollObj) {

            var zoomPos, zoomFactor, scrollRange, start, end, padding = 30, startArgs, endArgs;

            //Modify scrollbar center rectangle position on mouse move
            zoomPos = (startX - 15) / (scrollObj.width - padding - scrollObj._diff);
            scrollRange = scrollObj.scrollRange;
            zoomFactor = ((scrollObj.rectWidth - scrollObj._diff) / (scrollObj.width - padding - scrollObj._diff));
            if (!scrollObj.isRTL) {
                start = scrollRange.min + zoomPos * scrollRange.delta;
                end = start + zoomFactor * scrollRange.delta;
            } else {
                end = scrollRange.max - zoomPos * scrollRange.delta;
                start = end - zoomFactor * scrollRange.delta;
            }
            if (scrollObj.valueType == "datetime") {
                startArgs = scrollObj.startDateTime;
                endArgs = scrollObj.endDateTime;
                scrollObj.startDateTime = this.startDateTime = start = new Date(start);
                scrollObj.endDateTime = this.endDateTime = end = new Date(end);
            } else {
                startArgs = parseInt(scrollObj.startValue);
                endArgs = parseInt(scrollObj.endValue);
                scrollObj.startValue = this.startValue = start = Math.ceil(start);
                scrollObj.endValue = this.endValue = end = Math.ceil(end);
            }

            //Bind event on changing scrollbar position 
            scrollObj._scrollChanged = true;
            var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonEventArgs.data = {
                zoomPosition: zoomPos, zoomFactor: zoomFactor,
                oldRange: {
                    start: startArgs,
                    end: endArgs
                },
                newRange: {
                    start: start,
                    end: end
                }
            };

            scrollObj.zoomPosition = zoomPos;
            scrollObj.zoomFactor = zoomFactor;

            return commonEventArgs;
        },
        _calculateScrollPosition: function (mouseX, scrollObj) {
            var zoomPos, zoomFact, scrollRange, start, end, startArgs, endArgs, width,
                padding = 30, offset = 15, valueType, startRange, minScrollWidth = 36;

            if (this.leftScrollbarClicked && scrollObj.enableResize) {
                mouseX = mouseX >= offset ? mouseX : offset;
                mouseX = (mouseX >= offset && mouseX < scrollObj.offsetRightX - offset) ? mouseX : scrollObj.offsetRightX - offset;
                zoomPos = (mouseX - minScrollWidth) / (scrollObj.width - padding);
                zoomFact = scrollObj.rectWidth / (scrollObj.width - padding);

                valueType = scrollObj.valueType.toLowerCase();
                scrollRange = scrollObj.scrollRange;
                if (!scrollObj.isRTL) {
                    start = scrollRange.min + zoomPos * scrollRange.delta;
                    start = start > scrollRange.min ? start : scrollRange.min;
                    if (valueType == "datetime") {
                        startArgs = scrollObj.startDateTime;
                        endArgs = scrollObj.endDateTime;
                        scrollObj.startDateTime = this.startDateTime = start = new Date(start), end = scrollObj.endDateTime;
                    }
                    else {
                        startArgs = parseInt(scrollObj.startValue);
                        endArgs = parseInt(scrollObj.endValue);
                        scrollObj.startValue = this.startValue = start = Math.ceil(start), end = Math.ceil(scrollObj.endValue);
                    }
                } else {
                    end = scrollRange.max - zoomPos * scrollRange.delta;
                    end = end < scrollRange.max ? end : scrollRange.max;
                    if (valueType == "datetime") {
                        startArgs = scrollObj.startDateTime;
                        endArgs = scrollObj.endDateTime;
                        scrollObj.endDateTime = this.endDateTime = end = new Date(end), start = scrollObj.startDateTime;
                    }
                    else {
                        startArgs = parseInt(scrollObj.startValue);
                        endArgs = parseInt(scrollObj.endValue);
                        scrollObj.endValue = this.endValue = end = Math.ceil(end), start = Math.ceil(scrollObj.startValue);
                    }
                }
                //Bind event on changing scrollbar position 
                var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonEventArgs.data = {
                    zoomPosition: zoomPos, zoomFactor: zoomFact,
                    oldRange: {
                        start: startArgs,
                        end: endArgs
                    },
                    newRange: {
                        start: start,
                        end: end
                    }
                };
                scrollObj._scrollChanged = true;
                scrollObj.zoomPosition = zoomPos;
                scrollObj.zoomFactor = zoomFact;

                return commonEventArgs;
            }
            if (this.rightScrollbarClicked && scrollObj.enableResize) {
                scrollRange = scrollObj.scrollRange;
                zoomFact = scrollObj.rectWidth / (scrollObj.width - padding);
                zoomPos = scrollObj.zoomPosition;
                valueType = scrollObj.valueType.toLowerCase();
                if (!scrollObj.isRTL) {
                    startRange = scrollRange.min + zoomPos * scrollRange.delta;
                    end = startRange + zoomFact * scrollRange.delta;
                    if (valueType == "datetime") {
                        startArgs = scrollObj.startDateTime;
                        endArgs = scrollObj.endDateTime;
                        scrollObj.endDateTime = this.endDateTime = end = new Date(end), start = scrollObj.startDateTime;
                    }
                    else {
                        startArgs = parseInt(scrollObj.startValue);
                        endArgs = parseInt(scrollObj.endValue);
                        scrollObj.endValue = this.endValue = end = Math.floor(end), start = Math.ceil(scrollObj.startValue);
                    }
                } else {
                    zoomPos = (mouseX - minScrollWidth) / (scrollObj.width - padding);
                    start = scrollRange.max - zoomPos * scrollRange.delta;
                    if (valueType == "datetime") {
                        startArgs = scrollObj.startDateTime;
                        endArgs = scrollObj.endDateTime;
                        scrollObj.startDateTime = this.startDateTime = start = new Date(start), end = scrollObj.endDateTime;
                    }
                    else {
                        startArgs = parseInt(scrollObj.startValue);
                        endArgs = parseInt(scrollObj.endValue);
                        scrollObj.startValue = this.startValue = start = Math.floor(start), end = Math.ceil(scrollObj.endValue);
                    }
                }

                //Bind event on changing scrollbar position 
                var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonEventArgs.data = {
                    zoomPosition: scrollObj.zoomPosition ? scrollObj.zoomPosition : 0, zoomFactor: zoomFact,
                    oldRange: {
                        start: startArgs,
                        end: endArgs
                    },
                    newRange: {
                        start: start,
                        end: end
                    }
                };
                scrollObj._scrollChanged = true;
                scrollObj.zoomFactor = zoomFact;

                return commonEventArgs;
            }
            if (scrollObj && this.scrollRectClicked) {
                var moveLength = this.mouseDownPos - mouseX;
                if (moveLength > 0 && scrollObj.offsetLeftX >= 0) {
                    this.scrollbarContainer._calculateScrollLeftMove.call(this, moveLength, scrollObj);
                    return this.scrollbarContainer._calculateRange.call(this, scrollObj.startX, scrollObj.offsetRightX, scrollObj);
                }
                if (moveLength < 0) {
                    this.scrollbarContainer._calculateScrollRightMove.call(this, moveLength, scrollObj);
                    return this.scrollbarContainer._calculateRange.call(this, scrollObj._startX, scrollObj.offsetRightX, scrollObj);
                }
            }
        },

        _scrollbarMove: function (evt) {

            this.moveClientX = !ej.isNullOrUndefined(evt.clientX) ? evt.clientX : (evt.originalEvent.clientX == null ? evt.originalEvent.touches[0].clientX : evt.originalEvent.clientX);
            if (this.moveClientX != this.downClientX) {//update scrollbar only on mouse move
                var zoomPos, axis, start, end, width, padding = 8, minScrollWidth = 34, mouseX, centerLine;
                var rangePadding = this.model.padding || 0;
                var matched = jQuery.uaMatch(navigator.userAgent);
                var scrollObj = this.scrollbarContainer._doScrollIndex.call(this, evt);
                if (!scrollObj) return 0;

                this.lastIndex = scrollObj.index;
                if (((!this.vmlRendering && evt.originalEvent.toString() !== "[object TouchEvent]") && matched.browser.toLowerCase() != "msie") || (this.vmlRendering))
                    mouseX = (scrollObj.orientation == 'horizontal' ? this.calMousePosition(evt).X - scrollObj.x : scrollObj.width - (this.calMousePosition(evt).Y - scrollObj.y)) - rangePadding;
                else
                    mouseX = (scrollObj.orientation == 'horizontal' ? this.calTouchPosition(evt).X - scrollObj.x : scrollObj.width - (this.calTouchPosition(evt).Y - scrollObj.y)) - rangePadding;

                this.mouseX = mouseX;
                var rootId = this._id;
                if (this.leftScrollbarClicked && scrollObj.enableResize) {


                    if (scrollObj && (mouseX > minScrollWidth || mouseX > 23) && mouseX < scrollObj.offsetRightX - minScrollWidth) {
                        scrollObj.rectWidth = scrollObj.width - (scrollObj.endX + mouseX - padding);
                        centerLine = ((mouseX - padding) + (scrollObj.rectWidth / 2) - 7.5);
                        $('#' + rootId + '_scrollbarLeftHeader_' + scrollObj.index).attr("cx", mouseX);
                        $('#' + rootId + '_leftHeaderHideRect_' + scrollObj.index).attr("x", mouseX - 7.5);
                        $('#' + rootId + '_scrollbarSelect_' + scrollObj.index).attr('x', mouseX - padding);
                        $('#' + rootId + '_scrollbarSelect_' + scrollObj.index).attr("width", scrollObj.rectWidth);
                        $('#' + rootId + '_scrollbarCenterLine_' + scrollObj.index).attr('transform', 'translate(' + centerLine + ')');
                        //Apply styles for VML support
                        if (this.pluginName == "ejRangeNavigator") {
                            $('#' + rootId + '_scrollbarLeftHeader_' + scrollObj.index).css("left", mouseX);
                            $('#' + rootId + '_leftHeaderHideRect_' + scrollObj.index).css("left", mouseX - 7.5);
                            $('#' + rootId + '_scrollbarSelect_' + scrollObj.index).css('left', mouseX);
                            $('#' + rootId + '_scrollbarSelect_' + scrollObj.index).css("width", scrollObj.rectWidth);
                            $('#' + rootId + '_scrollbarCenterLine_' + scrollObj.index).css('left', centerLine);
                        }
                        scrollObj.offsetLeftX = scrollObj.startX = mouseX - 8;
                        this.scrollbarContainer._scrollStartArgs.call(this, scrollObj);
                        this.scrollbarContainer._scrollChangeArgs.call(this, scrollObj);
                        scrollObj._diff = 0;
                    } else if (mouseX > scrollObj.offsetRightX - minScrollWidth)
                        this.rectWidth = 42.89984101748814;
                }
                if (this.rightScrollbarClicked && scrollObj.enableResize) {
                    if (scrollObj && (mouseX <= scrollObj.width - minScrollWidth || mouseX <= scrollObj.width - 23) && mouseX > scrollObj.offsetLeftX + minScrollWidth) {
                        scrollObj.rectWidth = mouseX - scrollObj.offsetLeftX + padding;
                        centerLine = (scrollObj.offsetLeftX + (scrollObj.rectWidth / 2) - 7.5);
                        $('#' + rootId + '_scrollbarRightHeader_' + scrollObj.index).attr("cx", mouseX);
                        $('#' + rootId + '_rightHeaderHideRect_' + scrollObj.index).attr("x", mouseX - 2.5);
                        $('#' + rootId + '_scrollbarSelect_' + scrollObj.index).attr("width", scrollObj.rectWidth);
                        $('#' + rootId + '_scrollbarCenterLine_' + scrollObj.index).attr('transform', 'translate(' + centerLine + ')');
                        //Apply styles for VML support
                        if (this.pluginName == "ejRangeNavigator") {
                            $('#' + rootId + '_scrollbarRightHeader_' + scrollObj.index).css("left", mouseX);
                            $('#' + rootId + '_rightHeaderHideRect_' + scrollObj.index).css("left", mouseX - 2.5);
                            $('#' + rootId + '_scrollbarSelect_' + scrollObj.index).css("width", scrollObj.rectWidth);
                            $('#' + rootId + '_scrollbarCenterLine_' + scrollObj.index).css('left', centerLine);
                        }
                        scrollObj.offsetRightX = mouseX + padding;
                        scrollObj.endX = scrollObj.width - mouseX - padding;
                        // this.scrollbarContainer._calculateScrollPosition.call(this, mouseX, scrollObj);
                        this.scrollbarContainer._scrollStartArgs.call(this, scrollObj);
                        this.scrollbarContainer._scrollChangeArgs.call(this, scrollObj);
                        scrollObj._diff = 0;
                    }

                }
                if (this.scrollRectClicked) {
                    var moveLength = this.mouseDownPos - mouseX;
                    scrollObj._startX = ej.isNullOrUndefined(scrollObj._startX) ? scrollObj.startX : scrollObj._startX;
                    if (scrollObj && moveLength > 0 && scrollObj.offsetLeftX >= 0) {
                        this.scrollbarContainer._calculateScrollLeftMove.call(this, moveLength, scrollObj);
                        this.scrollbarContainer._setScrollPosition.call(this, scrollObj.startX, scrollObj.offsetRightX, scrollObj);
                        if (scrollObj.offsetLeftX > 15 || scrollObj.offsetLeftX != scrollObj._offsetLeftX) {
                            this.scrollbarContainer._scrollStartArgs.call(this, scrollObj);
                            this.scrollbarContainer._scrollChangeArgs.call(this, scrollObj);
                        }
                    }

                    if (scrollObj && moveLength < 0) {
                        if (ej.isNullOrUndefined(scrollObj._offsetRightX)) {
                            this.scrollbarContainer._scrollSelectRectDown.call(this, evt);
                            this.scrollbarContainer._scrollbarMove.call(this, evt);
                        }
                        this.scrollbarContainer._calculateScrollRightMove.call(this, moveLength, scrollObj);
                        this.scrollbarContainer._setScrollPosition.call(this, scrollObj._startX, (scrollObj._startX + scrollObj.rectWidth), scrollObj);
                        if (scrollObj.offsetRightX < scrollObj.width - 15 || scrollObj.offsetRightX != scrollObj._ofsetRightX) {
                            this.scrollbarContainer._scrollStartArgs.call(this, scrollObj);
                            if (this.model.enableDeferredUpdate === false || scrollObj.isZooming || this.model.scrollChanged != '') {
                                var commonEventArgs = this.scrollbarContainer._calculateRange.call(this, scrollObj._startX, (scrollObj._startX + scrollObj.rectWidth), scrollObj);
                                var oldRange = commonEventArgs.data.oldRange,
                                    newRange = commonEventArgs.data.newRange, oldStart, oldEnd, newStart, newEnd;
                                if (scrollObj.valueType.toLowerCase() == 'datetime') {
                                    oldStart = Date.parse(oldRange.start), newStart = Date.parse(newRange.start),
                                        oldEnd = Date.parse(oldRange.end), newEnd = Date.parse(newRange.end);
                                } else {
                                    oldStart = oldRange.start, newStart = newRange.start,
                                        oldEnd = oldRange.end, newEnd = newRange.end;
                                }
                                if (this.model.scrollChanged != '' && ((oldStart != newStart) || (oldEnd != newEnd))) {
                                    commonEventArgs = this.scrollbarContainer._args.call(this, scrollObj, commonEventArgs);
                                    this._trigger("scrollChanged", commonEventArgs);
                                }
                                if (!this.model.enableDeferredUpdate)
                                    this.scrollUpdate ? this.scrollUpdate = false : this.scrollbarContainer._appendScrollRange.call(this, scrollObj);
                            }
                        }
                    }
                }
            }
            this.offsetX = mouseX;
        },
        _scrollbarUp: function (evt) {
            var scrollObj = this.scrollbarContainer._doScrollIndex.call(this, evt);
            $("[id^=" + this._id + '_scrollbarSelect_' + "]").attr('class', 'e-rangeScroll-select');
            this.lastIndex = null;
            var args = this.scrollbarContainer._calculateScrollPosition.call(this, this.mouseX, scrollObj),
                deferred = this.model.enableDeferredUpdate;
            if (args) {
                var oldRange = args.data.oldRange,
                    newRange = args.data.newRange, oldStart, oldEnd, newStart, newEnd;
                if (scrollObj.valueType.toLowerCase() == 'datetime') {
                    oldStart = Date.parse(oldRange.start), newStart = Date.parse(newRange.start),
                        oldEnd = Date.parse(oldRange.end), newEnd = Date.parse(newRange.end);
                } else {
                    oldStart = oldRange.start, newStart = newRange.start,
                        oldEnd = oldRange.end, newEnd = newRange.end;
                }

                if (((oldStart != newStart) || (oldEnd != newEnd)) || (this.scrollRectClicked && !deferred) || (deferred) || (this.leftScrollbarClicked || this.rightScrollbarClicked)) {
                    //Checked condition for chrome browser mouse click issue.. on mouseClick in chrome move event also triggered
                    var is_chrome = ((navigator.userAgent.toLowerCase().indexOf('chrome') > -1) && (navigator.vendor.toLowerCase().indexOf("google") > -1));
                    if (!is_chrome || (is_chrome && ((this.leftScrollbarClicked || this.rightScrollbarClicked) && this.downClientX != this.moveClientX)
                        || this.scrollRectClicked || this.leftArrowClicked || this.rightArrowClicked)) {
                        //event will no trigger when rect value is not changed on left and right header moved
                        if ((!this.leftScrollbarClicked && !this.rightScrollbarClicked) ||
                            ((this.leftScrollbarClicked || this.rightScrollbarClicked) && Math.ceil(scrollObj.rectWidth) != Math.ceil(this.rectOldWidth) && (Math.abs(scrollObj.rectWidth - scrollObj.rectOldWidth) > 4 || !scrollObj.rectOldWidth))) {
                            if (ej.isNullOrUndefined(scrollObj._previousStart) || ((scrollObj._previousStart != newStart) || (scrollObj._previousEnd != newEnd))) {
                                args = this.scrollbarContainer._args.call(this, scrollObj, args);
                                this._trigger("scrollEnd", args);
                                scrollObj._scrollStarted = false;
                                scrollObj._previousStart = newStart;
                                scrollObj._previousEnd = newEnd;
                                scrollObj.rectOldWidth = scrollObj.rectWidth;
                                this.scrollUpdate ? this.scrollUpdate = false : this.scrollbarContainer._appendScrollRange.call(this, scrollObj);
                            }
                        }
                    }
                }
                scrollObj.release = true;
                scrollObj.clicked = false;
            }
            this._scrollEnd = false;
            this.leftScrollbarClicked = false;
            this.rightScrollbarClicked = false;
            this.scrollRectClicked = false;
            this.leftArrowClicked = false;
            this.rightArrowClicked = false;
            this.scrollbarBackRectClicked = false;
        },
        _leftScrollbarDown: function (evt) {
            evt.preventDefault();
            this.leftScrollbarClicked = true;
            this.downClientX = !ej.isNullOrUndefined(evt.clientX) ? evt.clientX : evt.originalEvent.touches[0].clientX;
        },

        _rightScrollbarDown: function (evt) {
            evt.preventDefault();
            this.rightScrollbarClicked = true;
            this.downClientX = !ej.isNullOrUndefined(evt.clientX) ? evt.clientX : evt.originalEvent.touches[0].clientX;
        },

        _scrollSelectRectDown: function (evt) {
            var scrollObj = this.scrollbarContainer._doScrollIndex.call(this, evt);
            $('#' + this._id + '_scrollbarSelect_' + scrollObj.index).attr('class', 'e-rangeScroll-select e-rangeScroll-select-hover');
            evt.preventDefault();
            var matched = jQuery.uaMatch(navigator.userAgent);
            var rangePadding = this.model.padding || 0;
            var scrollObj = this.scrollbarContainer._doScrollIndex.call(this, evt);
            if (((!this.vmlRendering && evt.originalEvent.toString() !== "[object TouchEvent]") && matched.browser.toLowerCase() != "msie") || (this.vmlRendering))
                var mouseX = (scrollObj.orientation == 'horizontal' ? this.calMousePosition(evt).X - scrollObj.x : scrollObj.width - (this.calMousePosition(evt).Y - scrollObj.y)) - rangePadding;
            else
                var mouseX = (scrollObj.orientation == 'horizontal' ? this.calTouchPosition(evt).X - scrollObj.x : scrollObj.width - (this.calTouchPosition(evt).Y - scrollObj.y)) - rangePadding;
            this.mouseDownPos = mouseX;
            scrollObj._startX = scrollObj.startX = scrollObj.offsetLeftX;
            scrollObj._offsetRightX = scrollObj.offsetRightX;
            scrollObj.clicked = true;
            scrollObj.release = false;
            this.scrollRectClicked = true;
        },

        //MouseWheel Scrolling event for scrollbarControl
        _scrollMouseWheel: function (e) {
            e.preventDefault();
            var scrollObj = this.scrollbarContainer._doScrollIndex.call(this, e);
            var isIE11 = !!navigator.userAgent.match(/Trident\/7\./);
            var wheelDelta = e.originalEvent.wheelDelta;
            var matched = jQuery.uaMatch(navigator.userAgent);
            var direction = matched.browser.toLowerCase() == "mozilla" ? ((isIE11 ? ((wheelDelta / 120) > 0 ? 1 : -1) : -(e.originalEvent.detail) / 3 > 0 ? 1 : -1)) : ((wheelDelta / 120) > 0 ? 1 : -1);
            var currentScale = Math.max(1 / ej.EjSvgRender.utils._minMax(scrollObj.zoomFactor, 0, 1), 1);
            var cumulativeScale = Math.max(currentScale + (0.25 * direction), 1);
            this.scrollbarContainer.doMouseWheelZoom.call(this, cumulativeScale, 0.5, scrollObj);

        },

        _scrollStartArgs: function (scrollObj) {
            scrollObj._scrollStarted = true;
            if (this.model.scrollStart != '' && !this._scrollEnd) {
                var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                if (!scrollObj.isZooming) {
                    commonEventArgs.data = {
                        startRange: scrollObj.valueType == "datetime" ? scrollObj.startDateTime : scrollObj.startValue,
                        endRange: scrollObj.valueType == "datetime" ? scrollObj.endDateTime : scrollObj.endValue
                    };
                } else {
                    commonEventArgs.data = {
                        axis: this.model._axes[scrollObj.index],
                        currentRange: this.model._axes[scrollObj.index].visibleRange
                    };
                }
                this._trigger("scrollStart", commonEventArgs);
                this._scrollEnd = true;
            }
        },

        _scrollChangeArgs: function (scrollObj) {
            if (this.model.enableDeferredUpdate === false || scrollObj.isZooming || this.model.scrollChanged != '') {
                var commonEventArgs = this.scrollbarContainer._calculateRange.call(this, scrollObj.offsetLeftX, scrollObj.offsetRightX, scrollObj);
                var oldRange = commonEventArgs.data.oldRange,
                    newRange = commonEventArgs.data.newRange, oldStart, oldEnd, newStart, newEnd;
                if (scrollObj.valueType.toLowerCase() == 'datetime') {
                    oldStart = Date.parse(oldRange.start), newStart = Date.parse(newRange.start),
                        oldEnd = Date.parse(oldRange.end), newEnd = Date.parse(newRange.end);
                } else {
                    oldStart = oldRange.start, newStart = newRange.start,
                        oldEnd = oldRange.end, newEnd = newRange.end;
                }

                if (this.model.scrollChanged != '' && ((oldStart != newStart) || (oldEnd != newEnd))) {
                    commonEventArgs = this.scrollbarContainer._args.call(this, scrollObj, commonEventArgs);
                    this._trigger("scrollChanged", commonEventArgs);
                }
                if (!this.model.enableDeferredUpdate)
                    this.scrollUpdate ? this.scrollUpdate = false : this.scrollbarContainer._appendScrollRange.call(this, scrollObj);
            }
        },

        _scrollEndArgs: function (startX, scrollObj) {
            var args = this.scrollbarContainer._calculateRange.call(this, startX, scrollObj.offsetRightX, scrollObj);
            if (args && scrollObj._scrollStarted) {
                var oldRange = args.data.oldRange,
                    newRange = args.data.newRange, oldStart, oldEnd, newStart, newEnd;
                if (scrollObj.valueType.toLowerCase() == 'datetime') {
                    oldStart = Date.parse(oldRange.start), newStart = Date.parse(newRange.start),
                        oldEnd = Date.parse(oldRange.end), newEnd = Date.parse(newRange.end);
                } else {
                    oldStart = oldRange.start, newStart = newRange.start,
                        oldEnd = oldRange.end, newEnd = newRange.end;
                }

                if (((oldStart != newStart) || (oldEnd != newEnd)) || (this.leftScrollbarClicked || this.rightScrollbarClicked)) {
                    args = this.scrollbarContainer._args.call(this, scrollObj, args);
                    this._trigger("scrollEnd", args);
                }
                scrollObj._scrollStarted = false;
                this.scrollUpdate ? this.scrollUpdate = false : this.scrollbarContainer._appendScrollRange.call(this, scrollObj);
            }
        },

        _args: function (scrollObj, args) {
            if (scrollObj.isZooming) {
                var axis = this.model._axes[scrollObj.index],
                    data = args.data;
                data.axis = axis;
                data.newRange = axis.visibleRange;
                data.oldRange = axis.previousRange;
            }

            if (scrollObj.isVirtual) {
                args.data.axis = this.model._axes[scrollObj.index];
                delete args.data.zoomFactor;
                delete args.data.zoomPosition;
            }
            return args;
        },

        doMouseWheelZoom: function (cumulativeScale, origin, scrollObj) {
            if (cumulativeScale >= 1) {
                var calZoomVal = this.scrollbarContainer.calZoomFactors(cumulativeScale, origin, scrollObj.zoomFactor, scrollObj.zoomPosition);

                if (scrollObj.zoomPosition != calZoomVal.zoomMPosition && calZoomVal.zoomMPosition + scrollObj.zoomFactor <= 1 && scrollObj.zoomPosition >= 0) {
                    if (calZoomVal.zoomMPosition + scrollObj.zoomFactor >= 1) {
                        calZoomVal.zoomMPosition = 1 - scrollObj.zoomFactor
                    }
                    if (calZoomVal.zoomMPosition < 0) {
                        calZoomVal.zoomMPosition = 0;
                    }
                    scrollObj.zoomPosition = calZoomVal.zoomMPosition;
                    scrollObj.startX = ((scrollObj.zoomPosition) * (scrollObj.width - 30 - scrollObj._diff) + 15);
                    scrollObj.startX = (scrollObj.startX + scrollObj.rectWidth + 5) > scrollObj.width ? (scrollObj.width - scrollObj.rectWidth - 15) : scrollObj.startX;
                    scrollObj.offsetLeftX = scrollObj.startX;

                    scrollObj._offsetRightX = scrollObj.startX + scrollObj.rectWidth;
                    if (scrollObj._offsetRightX > scrollObj.width - 15) {
                        scrollObj.offsetRightX = scrollObj.width - 15;
                        scrollObj.startX = scrollObj.offsetRightX - scrollObj.rectWidth;
                        scrollObj.offsetLeftX = scrollObj.startX;
                    } else {
                        scrollObj.offsetRightX = scrollObj._offsetRightX;
                    }
                    scrollObj.endX = scrollObj.width - scrollObj.offsetRightX;
                    this.scrollbarContainer._setScrollPosition.call(this, scrollObj.startX, scrollObj.offsetRightX, scrollObj);
                    this.scrollbarContainer._calculateMouseWheelRange.call(this, scrollObj.startX, scrollObj.offsetRightX, scrollObj);
                }
            }
            return false;
        },
        _calculateMouseWheelRange: function (startX, endX, scrollObj) {

            var scrollRange, start, end, padding = 30, startArgs, endArgs;
            scrollObj.zoomFactor = (scrollObj.rectWidth / (scrollObj.width - padding));
            scrollObj.zoomPosition = (startX - 15) / (scrollObj.width - padding - scrollObj._diff);
            scrollRange = scrollObj.scrollRange;

            if (!scrollObj.isRTL) {
                start = scrollRange.min + scrollObj.zoomPosition * scrollRange.delta;
                end = start + scrollObj.zoomFactor * scrollRange.delta;
            } else {
                end = scrollRange.max - scrollObj.zoomPosition * scrollRange.delta;
                start = end - scrollObj.zoomFactor * scrollRange.delta;
            }

            if (scrollObj.valueType == "datetime") {
                startArgs = scrollObj.startDateTime;
                endArgs = scrollObj.endDateTime;
                scrollObj.startDateTime = this.startDateTime = start = new Date(start);
                scrollObj.endDateTime = this.endDateTime = end = new Date(end);
            } else {
                startArgs = parseInt(scrollObj.startValue);
                endArgs = parseInt(scrollObj.endValue);
                scrollObj.startValue = this.startValue = start = Math.ceil(start);
                scrollObj.endValue = this.endValue = end = Math.ceil(end);
            }

            //Bind event on changing scrollbar position 
            var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonEventArgs.data = {
                zoomPosition: scrollObj.zoomPosition, zoomFactor: scrollObj.zoomFactor,
                oldRange: {
                    start: startArgs,
                    end: endArgs
                },
                newRange: {
                    start: start,
                    end: end
                }
            };
            scrollObj._scrollChanged = true;
            scrollObj._scrollStarted = false;
            var oldRange = commonEventArgs.data.oldRange,
                newRange = commonEventArgs.data.newRange, oldStart, oldEnd, newStart, newEnd;
            if (scrollObj.valueType.toLowerCase() == 'datetime') {
                oldStart = Date.parse(oldRange.start), newStart = Date.parse(newRange.start),
                    oldEnd = Date.parse(oldRange.end), newEnd = Date.parse(newRange.end);
            } else {
                oldStart = oldRange.start, newStart = newRange.start,
                    oldEnd = oldRange.end, newEnd = newRange.end;
            }
            if (oldStart != newStart || oldEnd != newEnd || scrollObj.isZooming) {
                this.scrollbarContainer._scrollStartArgs.call(this, scrollObj);
                commonEventArgs = this.scrollbarContainer._args.call(this, scrollObj, commonEventArgs);
                this._trigger("scrollEnd", commonEventArgs);
                this.scrollUpdate ? this.scrollUpdate = false : this.scrollbarContainer._appendScrollRange.call(this, scrollObj);
                this._scrollEnd = false;
            }
        },
        calZoomFactors: function (cumulativeScale, origin, currentZoomFactor, currentZoomPos) {
            var calcZoomFactorVal, calcZoomPosition;
            if (cumulativeScale == 1) {
                calcZoomFactorVal = 1;
                calcZoomPosition = 0;
            } else {
                calcZoomFactorVal = ej.EjSvgRender.utils._minMax(1 / cumulativeScale, 0, 1);
                calcZoomPosition = currentZoomPos + ((currentZoomFactor - calcZoomFactorVal) * origin);
            }
            return { zoomMFactor: calcZoomFactorVal, zoomMPosition: calcZoomPosition };
        },
        _leftArrowDown: function (evt) {
            this.leftArrowClicked = true;
            var scrollObj = this.scrollbarContainer._doScrollIndex.call(this, evt);
            scrollObj._startX = scrollObj.startX = scrollObj.offsetLeftX;
            scrollObj._offsetRightX = scrollObj.offsetRightX;
            scrollObj.leftIncrement = 5;
            var range = this;
            scrollObj.interval = setInterval(function () {
                range.scrollbarContainer.leftArrowRecursive.call(range, scrollObj)
            }, 50);
        },

        _leftArrowUp: function (evt) {
            this.leftArrowClicked = false;
            var scrollObj = this.scrollbarContainer._doScrollIndex.call(this, evt);
            this.scrollbarContainer.leftArrowRecursive.call(this, scrollObj);
        },

        leftArrowRecursive: function (scrollObj) {
            if (this.leftArrowClicked) {
                var rootId = this._id;
                this.scrollbarContainer._calculateScrollLeftMove.call(this, scrollObj.leftIncrement, scrollObj);
                scrollObj._scrollStarted = true;
                if (scrollObj.startX > 15)
                    this.scrollbarContainer._scrollEndArgs.call(this, scrollObj.startX, scrollObj);
                this.scrollbarContainer._setScrollPosition.call(this, scrollObj.startX, scrollObj.offsetRightX, scrollObj);
                scrollObj.leftIncrement += 5;
            } else {
                clearInterval(scrollObj.interval);
                scrollObj.leftIncrement = 0;
            }
        },

        _rightArrowDown: function (evt) {
            this.rightArrowClicked = true;
            var scrollObj = this.scrollbarContainer._doScrollIndex.call(this, evt);
            scrollObj._startX = scrollObj.startX = scrollObj.offsetLeftX;
            scrollObj._offsetRightX = scrollObj.offsetRightX;
            scrollObj.rightIncrement = -5;
            var range = this;
            scrollObj.interval = setInterval(function () { range.scrollbarContainer.rightArrowRecursive.call(range, scrollObj) }, 50);
        },

        _rightArrowUp: function (evt) {
            this.rightArrowClicked = false;
            var scrollObj = this.scrollbarContainer._doScrollIndex.call(this, evt);
            this.scrollbarContainer.rightArrowRecursive.call(this, scrollObj);
        },

        rightArrowRecursive: function (scrollObj) {
            if (this.rightArrowClicked) {
                var rootId = this._id;
                this.scrollbarContainer._calculateScrollRightMove.call(this, scrollObj.rightIncrement, scrollObj);
                scrollObj._scrollStarted = true;
                if (scrollObj.offsetRightX < scrollObj.width - 15)
                    this.scrollbarContainer._scrollEndArgs.call(this, scrollObj._startX, scrollObj);
                this.scrollbarContainer._setScrollPosition.call(this, scrollObj._startX, scrollObj.offsetRightX, scrollObj);
                scrollObj.rightIncrement -= 5;
            } else {
                clearInterval(scrollObj.interval);
                scrollObj.rightIncrement = 0;
            }
        },

        _scrollBackRectDown: function (evt) {

            var matched = jQuery.uaMatch(navigator.userAgent);
            var rangePadding = this.model.padding || 0;
            var scrollObj = this.scrollbarContainer._doScrollIndex.call(this, evt);
            if (((!this.vmlRendering && evt.originalEvent.toString() !== "[object TouchEvent]") && matched.browser.toLowerCase() != "msie") || (this.vmlRendering))
                var mouseX = (scrollObj.orientation == 'horizontal' ? this.calMousePosition(evt).X - scrollObj.x : scrollObj.width - (this.calMousePosition(evt).Y - scrollObj.y)) - rangePadding;
            else
                var mouseX = (scrollObj.orientation == 'horizontal' ? this.calTouchPosition(evt).X - scrollObj.x : scrollObj.width - (this.calTouchPosition(evt).Y - scrollObj.y)) - rangePadding;
            this.mouseDownPos = mouseX;
            this.scrollbarBackRectClicked = true;

            var range = this;
            this.scrollbarContainer._scrollStartArgs.call(this, scrollObj);
            var interval = setInterval(function () {
                range.scrollbarContainer.scrollBackRectRecursive.call(range, scrollObj)
                if (!this.scrollbarBackRectClicked)
                    clearInterval(interval);
            }, 50);
        },
        _scrollBackRectUp: function (evt) {
            this.scrollbarBackRectClicked = false;
            var scrollObj = this.scrollbarContainer._doScrollIndex.call(this, evt);
            this.scrollbarContainer.scrollBackRectRecursive.call(this, scrollObj);
        },

        _doScrollIndex: function (evt) {
            var matchStr = this._id + '_scrollbar' + '_';
            var parentNodeId = (evt.target.parentNode && evt.target.parentNode.id) ? evt.target.parentNode.id : '';
            var selectionIndex = parentNodeId.indexOf(matchStr) > -1 ? parseInt(parentNodeId.substr(matchStr.length)) : NaN;
            if (!ej.isNullOrUndefined(this.lastIndex) && !isNaN(this.lastIndex)) {
                if (!this.model.scrollObj[this.lastIndex].release && this.model.scrollObj[this.lastIndex].clicked)
                    selectionIndex = this.lastIndex;
            }
            this.lastIndex = ej.isNullOrUndefined(this.lastIndex) ? selectionIndex : this.lastIndex;
            var scrollObj = ej.isNullOrUndefined(this.model.scrollObj[selectionIndex]) ? this.model.scrollObj[this.lastIndex] : this.model.scrollObj[selectionIndex];

            return scrollObj;
        },

        scrollBackRectRecursive: function (scrollObj) {
            if (this.scrollbarBackRectClicked) {
                var moveLength = (10 / 100) * (scrollObj.width - 30);
                scrollObj._startX = scrollObj.startX = scrollObj.offsetLeftX;
                scrollObj._offsetRightX = scrollObj.offsetRightX;
                if (this.mouseDownPos < scrollObj.startX) {
                    moveLength = moveLength < scrollObj.startX ? moveLength : (scrollObj.startX - 16);
                    this.scrollbarContainer._calculateScrollLeftMove.call(this, moveLength, scrollObj);
                    scrollObj._scrollStarted = true;
                    this.scrollbarContainer._scrollEndArgs.call(this, scrollObj.startX, scrollObj);
                    this.scrollbarContainer._setScrollPosition.call(this, scrollObj.startX, scrollObj.offsetRightX, scrollObj);
                } else if (this.mouseDownPos > scrollObj.offsetRightX) {
                    moveLength = (moveLength < scrollObj.endX ? moveLength : (scrollObj.endX - 16)) * -1;
                    this.scrollbarContainer._calculateScrollRightMove.call(this, moveLength, scrollObj);
                    scrollObj._scrollStarted = true;
                    this.scrollbarContainer._scrollEndArgs.call(this, scrollObj._startX, scrollObj);
                    this.scrollbarContainer._setScrollPosition.call(this, scrollObj._startX, scrollObj.offsetRightX, scrollObj);
                } else {
                    scrollObj._scrollStarted = false;
                }
            } else {
                scrollObj._scrollStarted = false;
            }
        },

        //Redraw the RangeNavigator and Chart
        _appendScrollRange: function (scrollObj) {
            this.scrollbarUpdate = true;
            if (this.pluginName == "ejRangeNavigator")
                this.renderNavigator();
            else {
                var index = scrollObj.index,
                    axes = this.model._axes[index];
                if (scrollObj.isZooming && (axes.zoomFactor != scrollObj.zoomFactor || axes.zoomPosition != scrollObj.zoomPosition)) {
                    axes.zoomFactor = scrollObj.zoomFactor;
                    axes.zoomPosition = scrollObj.zoomPosition;
                    this.redraw(true);
                }
            }
            this.scrollbarUpdate = false;
        }

    };
})(jQuery);