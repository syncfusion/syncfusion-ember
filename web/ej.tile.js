/**
* @fileOverview Plugin to style the Html TileView elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejTile", "ej.Tile", {
        _setFirst: true,
        validTags: ["div"],
        _rootCSS: "e-js e-tile",
        defaults: {

            mouseDown: null,

            mouseUp: null
        },

        _init: function (options) {
            this._options = options;
            this._setCulture();
            this._orgEle = this.element.clone();
            this._liveTileimageTemplateParent = [];
            this._cloneLiveTileImageTemplateElement = [];
            this._renderEJControl();
        },

        _renderEJControl: function () {
            if (this.model.captionTemplateId) {
                this._captionTemplateParent = $("#" + this.model.captionTemplateId).parent();
                this._cloneCaptionTemplateElement = $("#" + this.model.captionTemplateId).clone();
            }
            if (this.model.imageTemplateId) {
                this._imageTemplateParent = $("#" + this.model.imageTemplateId).parent();
                this._cloneImageTemplateElement = $("#" + this.model.imageTemplateId).clone();
            }
            if (this.model.liveTile.enabled && this.model.liveTile.imageTemplateId) {
                for (i = 0; i < this.model.liveTile.imageTemplateId.length; i++) {
                    this._liveTileimageTemplateParent[i] = $("#" + this.model.liveTile.imageTemplateId[i]).parent();
                    this._cloneLiveTileImageTemplateElement[i] = $("#" + this.model.liveTile.imageTemplateId[i]).clone();
                }
            }
            this.element.addClass("e-tile-web");
            this._prefix = "e-";
            this._tileRender();
            this._wireEvents();
        },

        _onMouseDownHandler: function (evt) {
            var item = this.element;
            item.addClass(ej._getSkewClass(item, evt.pageX, evt.pageY).replace('e-m-', 'e-'));
            this._trigger("mouseDown", { text: item.attr("data-ej-text"), index: $(evt.target).index() });
            ej.listenTouchEvent(this.element, ej.moveEvent(), this._onMoveDelegate, false, this);
            ej.listenTouchEvent(this.element, ej.endEvent(), this._onEndDelegate, false, this);
            this._isMoved = false;
        },

        _onMouseMoveHandler: function (evt) {
            this._isMoved = true;
            this._removeActiveClass();
        },

        _onMouseUpHandler: function (evt) {
            if (this.model.allowSelection) {
                if (!this._selected) {
                    this._selected = true;
                    this._selectElement.addClass("e-tile-selected");
                }
                else if (this._selected) {
                    this._selected = false;
                    this._selectElement.removeClass("e-tile-selected");
                }
            }
            if (!this._isMoved && this.model.mouseUp)
                this._trigger("mouseUp", { text: this.element.attr("data-ej-text"), index: $(evt.target).index(), select: this._selected });
            this._removeActiveClass();
            this._isMoved = false;
            ej.listenTouchEvent(this.element, ej.moveEvent(), this._onMoveDelegate, true, this);
            ej.listenTouchEvent(this.element, ej.endEvent(), this._onEndDelegate, true, this);
        },

        _refresh: function () {
            this._destroy();
            this.element.addClass("e-tile e-js");
            if (this.model.captionTemplateId)
                $(this._captionTemplateParent).append(this._cloneCaptionTemplateElement);
            if (this.model.imageTemplateId)
                $(this._imageTemplateParent).append(this._cloneImageTemplateElement);
            if (this.model.liveTile.enabled && this.model.liveTile.imageTemplateId) {
                for (i = 0; i < this.model.liveTile.imageTemplateId.length; i++)
                    $(this._liveTileimageTemplateParent[i]).append(this._cloneLiveTileImageTemplateElement[i]);
            }
            this._renderEJControl();
        },
		_setCulture: function () {
            if (this.model.locale != "en-US" && (ej.isNullOrUndefined(this._options) || ((ej.isNullOrUndefined(this._options["caption"]) || ej.isNullOrUndefined(this._options["caption"].text)) && ej.isNullOrUndefined(this._options["text"]))))
				this._captionText(this._getLocalizedLabels().captionText)
        },
		_getLocalizedLabels: function () {
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        }
    });
	ej.Tile.Locale = ej.Tile.Locale || {};
    ej.Tile.Locale["default"] = ej.Tile.Locale["en-US"] = {
        captionText: "text"
    };
    ej.Tile.ImagePosition = {
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
    },
    ej.Tile.BadgePosition = {
        TopRight: "topright",
        BottomRight: "bottomright"
    }

    ej.Tile.CaptionAlignment = {
        Normal: "normal",
        Left: "left",
        Right: "right",
        Center: "center"
    },

    ej.Tile.CaptionPosition = {
        InnerTop: "innertop",
        InnerBottom: "innerbottom",
        Outer: "outer"
    },

    ej.Tile.TileSize = {
        Medium: "medium",
        Small: "small",
        Large: "large",
        Wide: "wide"
    },

    ej.Tile.LiveTileType = {
        Flip: "flip",
        Slide: "slide",
        Carousel: "carousel"
    }
    $.extend(true, ej.Tile.prototype, ej.TileBase.prototype);
})(jQuery, Syncfusion);