/**
* @fileOverview Plugin to style the Html Tile elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {
    ej.widget("ejmTile", "ej.mobile.Tile", {
        _setFirst: true,
        _rootCSS: "e-m-tile",
        defaults: {
            imagePath: null,
            renderMode: "auto",
            touchStart: null,
            touchEnd: null
        },
        dataTypes: {
            renderMode: "enum",
        },
        //Constructor function
        _init: function () {
            this._orgEle = this.element.clone();
            this._renderEJMControl();
        },
        //To render the Tile control
        _renderEJMControl: function () {
            ej.setRenderMode(this);
            this._prefix = "e-m-";
            this.element.addClass("e-m-" + this.model.renderMode);
            this._tileRender();
            this._wireEvents();
        },
        //Section for handling the touchstart event
        _onTouchStartHandler: function (evt) {
            var item = this.element, eventobj;
            if (this.model.renderMode == "windows")
                eventobj = evt.touches ? evt.touches[0] : evt;
            if (ej.isWindows())
                ej._touchStartPoints(evt, this);
            item.addClass(this.model.renderMode == "windows" ? ej._getSkewClass(item, eventobj.pageX, eventobj.pageY) : this._prefix + "state-active");
            if (this.model.touchStart)
                this._trigger("touchStart", { text: item.attr("text"), index: $(evt.target).index() });
            ej.listenTouchEvent(this.element, ej.moveEvent(), this._onMoveDelegate, false);
            ej.listenTouchEvent(this.element, ej.endEvent(), this._onEndDelegate, false);
            this._isMoved = false;
        },
        //Section for handling the touchmove event
        _onTouchMoveHandler: function (evt) {
            if (!ej.isWindows() || (ej.isWindows() && ej._isTouchMoved(evt, this))) {
                this._isMoved = true;
                this._removeActiveClass();
            }
        },
        // Section for handling the touchstart event
        _onTouchEndHandler: function (evt) {
            if (this.model.allowSelection) {
                if (!this._selected) {
                    this._selected = true;
                    this._selectElement.addClass("e-m-tile-selected");
                }
                else if (this._selected) {
                    this._selected = false;
                    this._selectElement.removeClass("e-m-tile-selected");
                }
            }
            if (!this._isMoved && this.model.touchEnd)
                this._trigger("touchEnd", { text: this.element.attr("text"), index: $(evt.target).index(), select: this._selected });
            this._removeActiveClass();
            this._isMoved = false;
            ej.listenTouchEvent(this.element, ej.moveEvent(), this._onMoveDelegate, true);
            ej.listenTouchEvent(this.element, ej.endEvent(), this._onEndDelegate, true);
        },
        //To refresh the control
        _refresh: function () {
            this._destroy();
            this.element.removeAttr("style");
            this.element.addClass(this._prefix + "tile e-js");
            this._renderEJMControl();
        }
    });

    ej.mobile.Tile.ImagePosition = {
        Center: "center",
        TopCenter: "topcenter",
        BottomCenter: "bottomcenter",
        RightCenter: "rightcenter",
        LeftCenter: "leftcenter",
        TopLeft: "topleft",
        TopRight: "topright",
        BottomRight: "bottomright",
        BottomLeft: "bottomleft",
        Fill: "fill"
    };

    ej.mobile.Tile.CaptionAlignment = {
        Normal: "normal",
        Left: "left",
        Right: "right",
        Center: "center"
    };

    ej.mobile.Tile.CaptionPosition = {
        InnerTop: "innertop",
        InnerBottom: "innerbottom",
        Outer: "outer"
    };

    ej.mobile.Tile.TileSize = {
        Medium: "medium",
        Small: "small",
        Large: "large",
        Wide: "wide"
    };

    ej.mobile.Tile.LiveTileType = {
        Flip: "flip",
        Slide: "slide",
        Carousel: "carousel"
    };
    ej.mobile.Tile.BadgePosition = {
        TopRight: "topright",
        BottomRight: "bottomright"
    };
    $.extend(true, ej.mobile.Tile.prototype, ej.TileBase.prototype);
})(jQuery, Syncfusion);