/**
* @fileOverview Plugin to style the Rotator control.
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejRotator", "ej.Rotator", {
        element: null,
        model: null,        
        _setFirst: false,
        validTags:["ul"],

        defaults: {

            cssClass: "",

            dataSource: null,

            query: null,

            fields: {

                text: "text",

                url: "url",

                linkAttribute: "linkAttribute",

                targetAttribute: "targetAttribute",

                thumbnailText: "text",

                thumbnailUrl: "url"
            },

            enabled: true,

            displayItemsCount: "1",

            navigateSteps: "1",

            animationSpeed: 600,

            startIndex: "0",

            enableTouch: true,

            showPlayButton: false,

            enableAutoPlay: false,

            showNavigateButton: true,

            slideWidth: "",

            slideHeight: "",

            frameSpace: "",

            isResponsive: false,

            orientation: "horizontal",

            pagerPosition: "outside",

            showThumbnail: false,

            showPager: true,

            stopOnHover: false,

            htmlAttributes: {},

            thumbnailSourceID: null,

            template: null,

            templateId: null,

            showCaption: false,

            allowKeyboardNavigation: true,

            enableRTL: false,

            animationType: "slide",

            delay: 500,

            circularMode: true,

            create: null,

            change: null,

            start: null,

            stop: null,

            thumbItemClick: null,

            pagerClick: null,

            destroy: null

        },

        dataTypes: {
            cssClass: "string",
            dataSource: "data",
            query: "data",
            fields: "data",
            template: "string",
            templateId: "array",
            enabled: "boolean",
            displayItemsCount: "",
            navigateSteps: "",
            animationSpeed: "",
            transitionDelay: "",
            startIndex: "",
            showPlayButton: "boolean",
            enableAutoPlay: "boolean",
            slideWidth: "",
            slideHeight: "",
            frameSpace: "",
            isResponsive: "boolean",
            orientation: "enum",
            pagerPosition: "enum",
            showThumbnail: "boolean",
            thumbnailSourceID: "",
            showPager: "boolean",
            showCaption: "boolean",
            enableRTL: "boolean",
            allowKeyboardNavigation: "boolean",
            circularMode: "boolean",
            animationType: "string",
            delay: "",
            htmlAttributes: "data"
        },


        _init: function () {
            this._rtlDirection = true;
            this._initialize();
            if (this.model.dataSource == null)
                this._setValues();
            this._render();
            this._wireEvent();
            if (this.model.enableAutoPlay) this.play();
            if ((!this.model.enabled) && (ej.browserInfo().name == "msie") && (ej.browserInfo().version == "8.0")) {
                this._outerWrapper.addClass("e-disable").attr({ "aria-disabled": true });
                this._ieEnable("addClass");
            }
        },

        _initialize: function () {
            this.element.attr("tabindex", 0);
            this._liCount = null;
            this.transitionDelay = null;
            this._animating = false;
            this._isPlaying = false;
            this._interval = null;
            this._thumbCount = null;
            this._captionChange = false;
            this._liSize = null;
            this._containerSize = null;
			this._thumbVal = this.model.showThumbnail;
            this.containerCss = this.model.orientation == ej.Orientation.Horizontal ? "outerWidth" : "outerHeight";
            this.displayCss = this.model.orientation == ej.Orientation.Horizontal ? "left" : "top";
            $.extend(jQuery.easing, {
                slowSlide: function (x, t, b, c, d) {
                    var ts = (t /= d) * t;
                    return b + c * (ts * ts);
                },
                fastSlide: function (x, t, b, c, d) {
                    var ts = (t /= d) * t;
                    var tc = ts * t;
                    return b + c * (tc * ts + -5 * ts * ts + 10 * tc + -10 * ts + 5 * t);
                },
                slide: function (x, t, b, c, d) {
                    var ts = (t /= d) * t;
                    var tc = ts * t;
                    return b + c * (6 * tc * ts + -15 * ts * ts + 10 * tc);
                }
            })
        },

        _setValues: function (val) {
            this._setLicount();
            this._setSpeed(this.model.animationSpeed);
            this._setVisibleItemCount(this.model.displayItemsCount);
            this._setItemMove(this.model.navigateSteps);
            this._setFrameSpace(this.model.frameSpace);
            this._setSlideWidth(this.model.slideWidth);
            this._setSlideHeight(this.model.slideHeight);
            this._changeProperty();
            this._setInitial();
        },
        _refresh: function () {
            this._setValues();
            this._setDimension();
            this._changeSkin();
        },
        _reRenderControl: function () {
            this._undoClone();
            this._setLicount();
            this._setSpeed(this.model.animationSpeed);
            this._setVisibleItemCount(this.model.displayItemsCount);
            this._setItemMove(this.model.navigateSteps);
            this._setFrameSpace(this.model.frameSpace);
            this._setSlideWidth(this.model.slideWidth);
            this._setSlideHeight(this.model.slideHeight);
            this._changeProperty();
            this._cloneItem();
            this._createCaption();
            this._changeSkin();
            this._setRTL(false);
        },
        _refreshControl: function () {
            this._setShowPager();
            if (this.model.showCaption) {
                if (this.element.siblings().hasClass("e-caption"))
                    this._caption.remove();
                this._createCaption();
            } else if (this.element.siblings().hasClass("e-caption"))
                this._caption.remove();

            if (this.model.showThumbnail || (this._thumbVal && (this.model.displayItemsCount == 1) && (this.model.navigateSteps == 1))) {
                if (this.element.parents('.e-in-wrap').siblings().hasClass("e-thumb")) {
                    this._thumb.remove();
                    if (!ej.isNullOrUndefined(this._thumbControl)) this._thumbControl.remove();
                }
                this._createThumb();
				this.model.showThumbnail = true;
            }
            else if (this.element.parents('.e-in-wrap').siblings().hasClass("e-thumb")) {
                this._thumb.remove();
                if (!ej.isNullOrUndefined(this._thumbControl)) this._thumbControl.remove();
            }
            this._changeSkin();
            this._setRTL(false);
        },

        _checkDataBinding: function () {
            var source = this.model.dataSource;
            if (source != null) {
                this.element.addClass("onloading");
                if (ej.DataManager && source instanceof ej.DataManager)
                    this._initDataSource(source);
                else
                    this._renderItems(source);
            }
            this._setValues();
        },

        _initDataSource: function (source) {
            var proxy = this, queryPromise;
            queryPromise = source.executeQuery(this._getQuery());
            queryPromise.done(function (e) {
                proxy._renderItems(e.result);
            }).fail(function (e) {
                proxy.element.removeClass("onloading");
            });
        },
        _getQuery: function () {
            var column;
            if (ej.isNullOrUndefined(this.model.query)) {
                column = [], queryManager = ej.Query(), mapper = this.model.fields, col;
                for (col in mapper) {
                    if (col !== "tableName" && mapper[col])
                        column.push(mapper[col]);
                }
                if (column.length > 0)
                    queryManager.select(column);
                if (!this.model.dataSource.dataSource.url.match(mapper.tableName + "$"))
                    !ej.isNullOrUndefined(mapper.tableName) && queryManager.from(mapper.tableName);
            }
            else queryManager = this.model.query;
            return queryManager;
        },

        _renderItems: function (list) {
            this.list = list;
            this._generateTagItems(this.list);
            this.element.removeClass("onloading");
        },

        _generateTagItems: function (list) {
            var i; this.mapField = this._getMapper();
            for (i = 0; i < list.length; i++) {
                this.element.append(this._generateLi(list[i], this.mapField));
            }
        },

        _getTemplatedItems: function () {
            var itemsId = this.model.templateId, li, templateContent, content;
            for (i = 0; i < itemsId.length; i++) {
                li = ej.buildTag("li");
                templateContent = $("#" + this.model.templateId[i]);
                content= templateContent[0] && templateContent[0].nodeName && templateContent[0].nodeName.toLowerCase() == "script" ? ej.getClearString(templateContent[0].innerHTML) : templateContent;
                this.element.append($(li).append(content));
            }
        },

        _getMapper: function () {
            var mapper = this.model.fields, mapFld = { _text: null, _url: null };
            mapFld._text = (mapper && mapper.text) ? mapper["text"] : "text";
            mapFld._url = (mapper && mapper.url) ? mapper["url"] : "url";
            mapFld._attr = (mapper && mapper.htmlAttr) ? mapper["htmlAttr"] : "htmlAttr";
            mapFld._linkAttribute = (mapper && mapper.linkAttribute) ? mapper["linkAttribute"] : "linkAttribute";
            mapFld._targetAttribute = (mapper && mapper.targetAttribute) ? mapper["targetAttribute"] : "targetAttribute";
            mapFld._thumbnailText = (mapper && mapper.thumbnailText) ? mapper["thumbnailText"] : "text";
            mapFld._thumbnailUrl = (mapper && mapper.thumbnailUrl) ? mapper["thumbnailUrl"] : "url";
            return mapFld;
        },

        _generateLi: function (list, map) {
            var li = ej.buildTag("li"), imgTag, anchorTag;
            imgTag = ej.buildTag("img");
            if (!ej.isNullOrUndefined(list[map._url])) imgTag.attr("src", list[map._url]);
            if (!ej.isNullOrUndefined(list[map._text])) imgTag.attr("title", list[map._text]);
            if (!ej.isNullOrUndefined(list[map._linkAttribute])) {
                anchorTag = ej.buildTag("a").attr({ 'href': list[map._linkAttribute] }).append(imgTag);
                if (!ej.isNullOrUndefined(list[map._targetAttribute])) anchorTag.attr("target", "_" + list[map._targetAttribute]);
                li.append(anchorTag);
            } else if (!this.model.template)
                li.append(imgTag);
            if (this.model.template) $(li).append(this._getTemplatedString(list));
            this._setAttributes((list[map._attr]), imgTag);
            return li;
        },

        _getTemplatedString: function (list) {
            var str = this.model.template, start = str.indexOf("${"), end = str.indexOf("}");
            while (start != -1 && end != -1) {
                var content = str.substring(start, end + 1);
                var field = content.replace("${", "").replace("}", "");
                str = str.replace(content, this._getField(list, field));
                start = str.indexOf("${"), end = str.indexOf("}");
            }
            return str;
        },

        _getField: function (obj, fieldName) {
            return ej.pvt.getObject(fieldName, obj);
        },

        _generateThumbnailLi: function (list, map) {
            var li = ej.buildTag("li"), imgTag;
            imgTag = ej.buildTag("img");
            if (!ej.isNullOrUndefined(list[map._thumbnailUrl])) imgTag.attr("src", list[map._thumbnailUrl]);
            if (!ej.isNullOrUndefined(list[map._thumbnailText])) imgTag.attr("title", list[map._thumbnailText]);
            li.append(imgTag);
            return li;
        },

        _setAttributes: function (data, element) {
            if (data) {
                for (var key in data)
                    element.attr(key, data[key]);
            }
        },
        _createWrapper: function () {
            this._wrapper = ej.buildTag("div.e-inner e-box e-" + this.model.orientation).insertBefore(this.element);
            if (this.model.dataSource != null)
                this._checkDataBinding();
            if (this.model.templateId != null) {
                this._getTemplatedItems();
                this._setValues();
            }
            this._wrapper.append(this.element);
            this._innerWrapper = ej.buildTag("div.e-in-wrap").insertBefore(this._wrapper);
            this._innerWrapper.append(this._wrapper);
            this._outerWrapper = ej.buildTag("div.e-rotator-wrap e-widget " + this.model.cssClass).insertBefore(this._innerWrapper);
            this._outerWrapper.append(this._innerWrapper);
            if (!this.model.enabled) this._outerWrapper.addClass("e-disable").attr({ "aria-disabled": true });
        },
        _refreshTagItems: function (key, value) {
            this.model[key] = value;
            this.element.children('li').remove();
            this._checkDataBinding();
            this._cloneItem();
            this._refreshControl();
        },

        _createButtonControl: function () {
            this._buttonWrapper = ej.buildTag("div.e-nav").insertAfter(this._wrapper);
            if (this.model.showNavigateButton && this._liCount > 3) {
                this._prevButton = ej.buildTag("span.e-nav-btn e-icon e-previous").attr({ 'role': 'button' }).appendTo(this._buttonWrapper);
                this._nextButton = ej.buildTag("span.e-nav-btn e-icon e-next").attr({ 'role': 'button' }).appendTo(this._buttonWrapper);
            }
            this._buttonWrapper.appendTo(this._wrapper);
            this._createAutoPlay();
            if (this.model.showNavigateButton) this._wireBtnEvents();
        },

        _createAutoPlay: function () {
            var icon;
            if (!this.model.showPlayButton) return false;
            icon = this._interval != null ? 'pause' : 'play';
            this._autoButton = ej.buildTag("span.e-nav-btn e-icon " + icon, "", {}, { role: "button" }).appendTo(this._buttonWrapper);
            this._wireAutoPlayEvents();
        },

        _createBulletControl: function () {
            var end, liElement;
            this._bulletWrapper = ej.buildTag("div.e-pager-wrap", "", {}, { role: "group", "aria-label": "showPager", tabindex: "0" }).insertAfter(this._innerWrapper);
            this._bullet = ej.buildTag("ul.e-bullet e-default");
            if (this.model.circularMode) {
                end = (this._liCount - (this.model.displayItemsCount * 2)) / this.model.navigateSteps;
                if ((this._liCount - (this.model.displayItemsCount * 2)) % this.model.navigateSteps != 0)
                    end++;
            }
            else {
                end = ((this._liCount - this.model.displayItemsCount) / this.model.navigateSteps) + 1;
                if ((this._liCount - this.model.displayItemsCount) % this.model.navigateSteps != 0)
                    end++;
            }
            for (var i = 1; i <= end ; i++)
                ej.buildTag("li.e-icon", "", {}, { tabindex: "-1", "aria-selected": "false", "aria-checked": "false" }).appendTo(this._bullet);
            this._bullet.appendTo(this._bulletWrapper);
            this._setActiveBullet();
            this._setPagerposition(this.model.pagerPosition);
            this._wireBulletEvents();
        },

        _createCaption: function () {
            var index;
            if (!this.model.showCaption) return false;
            this._caption = ej.buildTag("div.e-caption").append($('<span>')).insertAfter(this._buttonWrapper);
            if (this.model.circularMode) {
                index = Math.round((-Math.round(this.element.position()[this.displayCss])) / this._liSize);
                index--;
            }
            else
                index = Math.round((-Math.round(this.element.position()[this.displayCss])) / (this._liSize));

            this._setCaptionText(index);
        },

        _createThumb: function () {
            var liElements, i;
            if (this.model.dataSource != null || this.model.thumbnailSourceID != null) {
                this._thumb = this.model.showPager ? ej.buildTag("div.e-thumb", "", {}, { tabindex: "0", role: "group" }).insertAfter(this._bulletWrapper) : ej.buildTag("div.e-thumb", "", {}, { tabindex: "0", role: "group" }).insertAfter(this._innerWrapper);
                this._thumbItems = ej.buildTag("ul.e-thumb-items e-ul");
                if (this.model.dataSource != null) {
                    this._thumbItems.addClass("onloading");
                    this._generateThumbnailTagItems(this.list);
                } else {
                    for (i = 0; i < $('#' + this.model.thumbnailSourceID).children('li').length ; i++) {
                        liElements = $('#' + this.model.thumbnailSourceID).children('li').eq(i).clone();
                        liElements.addClass("e-thumb-ele").attr('tabindex', -1).removeAttr("style").appendTo(this._thumbItems);
                    }
                    $('#' + this.model.thumbnailSourceID).css("display", "none");
                }
                this._thumbItems.appendTo(this._thumb);
                this._setThumbProperty();
                this._setActiveThumb();
            }
        },

        _createThumbControl: function () {
            this._thumbControl = ej.buildTag("div.e-thumb-nav").insertAfter(this._thumb);
            this._previous = ej.buildTag("span.e-thumb-btn e-icon e-previous " + (this.model.enableRTL ? "e-enable" : "e-disable"), "", {}, { "aria-disabled": this.model.enableRTL ? false : true }).appendTo(this._thumbControl);
            this._next = ej.buildTag("span.e-thumb-btn e-icon e-next " + (this.model.enableRTL ? "e-disable" : "e-enable"), "", {}, { "aria-disabled": this.model.enableRTL ? true : false }).appendTo(this._thumbControl);
            this._thumbControl.appendTo(this._outerWrapper);
            this._wireThumbEvents();
        },

        _generateThumbnailTagItems: function (list) {
            var i;
            for (i = 0; i < list.length; i++) {
                this._thumbItems.append(this._generateThumbnailLi(list[i], this.mapField).addClass("e-thumb-ele").attr('tabindex', -1));
            }
            this._thumbItems.removeClass("onloading");
        },

        _setSkin: function (skin) {
            this._outerWrapper.removeClass(this.model.cssClass).addClass(skin);
        },

        _cloneItem: function () {
            if (this.model.circularMode) {
                var i = 0, CloneElements = ej.buildTag("ul");
                for (i = 0; i < this.model.displayItemsCount ; i++)
                    this.element.children('li').eq(i).clone().addClass("clone").appendTo(this.element);
                for (i = (this._liCount - this.model.displayItemsCount) ; i < this._liCount; i++)
                    this.element.children('li').eq(i).clone().addClass("clone").prependTo(CloneElements);
                for (i = 0; i < CloneElements.children('li').length; i++)
                    CloneElements.children('li').eq(i).clone().prependTo(this.element);
            }
            this._setDimension();
        },

        _undoClone: function () {
            for (i = 0; i < this._liCount; i++) {
                if (this.element.children('li').eq(i).hasClass("clone")) {
                    this.element.children('li').eq(i).remove();
                    this._setLicount();
                    i--;
                }
            }
        },

        _setModel: function (options) {
            var option, valueChange = false, controlChange = false;
            for (option in options) {
                switch (option) {
                    case "enableAutoPlay":
                        (this.model.enableAutoPlay = options[option]) ? this._autoPlay() : this._setPause(true);
                        break;
                    case "enableTouch":
                        this.model.enableTouch = options[option];
                        this._wireTouchEvents();
                        break;
                    case "fields":
                    case "query":
                    case "dataSource":
                    case "template":
                        this._refreshTagItems(option, options[option]);
                        break;
                    case "enabled":
                        this._changeState(options[option]);
                        break;
                    case "slideWidth":
                        this._setSlideWidth(options[option]);
                        valueChange = true;
                        controlChange = true;
                        break;
                    case "slideHeight":
                        this._setSlideHeight(options[option]);
                        valueChange = true;
                        controlChange = true;
                        break;
                    case "displayItemsCount":
                        this._undoClone();
                        this._setVisibleItemCount(options[option]);
                        this._cloneItem();
                        if (this.model.displayItemsCount == 1 && this._captionChange) {
                            this.model.showCaption = true;
                            this._captionChange = false;
                        }
                        valueChange = true;
                        controlChange = true;
                        break;
                    case "navigateSteps":
                        options[option] = this._validateItemMove(options[option]);
                        this.model.navigateSteps = options[option];
                        valueChange = true;
                        controlChange = true;
                        break;
                    case "pagerPosition":
                        this._setPagerposition(options[option]);
                        break;
                    case "showPager":
                        this.model.showPager = options[option];
                        this._setShowPager();
                        break;
                    case "showThumbnail":
                        this._thumbVal = this.model.showThumbnail = options[option];
                        valueChange = true;
                        controlChange = true;
                        break;
                    case "thumbnailSourceID":
                        this.model.thumbnailSourceID = options[option];
                        if (this.model.dataSource == null) {
                            valueChange = true;
                            controlChange = true;
                        }
                        break;
                    case "showCaption":
                        this.model.showCaption = options[option];
                        valueChange = true;
                        controlChange = true;
                        break;
                    case "isResponsive":
                        this.model.isResponsive = options[option];
                        this._wireResizeEvents();
                        break;
                    case "orientation":
                        this.model.orientation = options[option];
                        this._setOrientation(options[option]);
                        break;
                    case "animationSpeed":
                        this._setSpeed(options[option]);
                        break;
                    case "frameSpace":
                        this._setFrameSpace(options[option]);
                        valueChange = true;
                        controlChange = true;
                        break;
                    case "showPlayButton":
                        this.model.showPlayButton = options[option];
                        this._setAutoplay(options[option]);
                        this._changeSkin();
                        break;
                    case "startIndex":
                        this.model.startIndex = options[option];
                        valueChange = true;
                        controlChange = true;
                        break;
                    case "allowKeyboardNavigation":
                        this.model.allowKeyboardNavigation = options[option];
                        this._wireKeyboardEvents();
                        break;
                    case "showNavigateButton":
                        this.model.showNavigateButton = options[option];
                        this._setSlideButton(options[option]);
                        this._changeSkin();
                        break;
                    case "animationType":
                        this.model.animationType = options[option];
                        this._setSpeed(this.model.animationSpeed);
                        break;
                    case "cssClass": this._setSkin(options[option]); break;
                    case "enableRTL":
                        this._setRTL(true, options[option]);
                        break;
                    case "circularMode":
                        this.model.circularMode = options[option];
                        this._reRenderControl();
                        this._refresh();
                        break;
                    case "delay":
                        this.model.delay = options[option]
                        this._setSpeed(this.model.animationSpeed);
                        break;
                    case "htmlAttributes": this._addAttr(options[option]); break;
                }
            }

            if (valueChange) this._refresh();
            if (controlChange) this._refreshControl();
        },

        _setShowPager: function () {
            if (this.model.showPager) {
                if (!ej.isNullOrUndefined(this._bulletWrapper))
                    this._bulletWrapper.remove();
                this._createBulletControl();
            }
            else if (this.element.parents('.e-in-wrap').siblings().hasClass("e-pager-wrap"))
                this._bulletWrapper.remove();
        },

        _setDimension: function () {
            this._setLicount();
            this._setUlInitial();
            this._setWidth();
            this._setHeight();
            this._setContainerPercent();
            this._changeProperty();
        },

        _render: function () {
            this._createWrapper();
            this._addAttr(this.model.htmlAttributes);
            this._cloneItem();
            this._createButtonControl();
            this._createCaption();
            if (this.model.showPager) this._createBulletControl();
            if (this.model.showThumbnail) this._createThumb();
            this._outerWrapper.find(this.element).addClass("e-ul");
            this._changeSkin();
            this._setRTL(false);
        },

        _setWidth: function () {
            this._containerWidth = this.model.orientation == "horizontal" ?
            ((parseInt(this.model.slideWidth) * this.model.displayItemsCount) + (parseInt(this.model.frameSpace) * (parseInt(this.model.displayItemsCount) - 1))) : this.model.slideWidth;
            this.element.parent().css('width', this._containerWidth);
            this.element.parents('.e-in-wrap').css('width', this._containerWidth);
            this.element.parents('.e-rotator-wrap').css('width', this._containerWidth);
            this._changeProperty();
        },
        _setHeight: function () {
            this._containerHeight = this.model.orientation == "vertical" ?
            ((parseInt(this.model.slideHeight) * this.model.displayItemsCount) + (parseInt(this.model.frameSpace) * (parseInt(this.model.displayItemsCount) - 1))) : this.model.slideHeight;
            this.element.parent().css('height', this._containerHeight);
            if (this.model.isResponsive && !this.model.showThumbnail) {
                this.element.parents('.e-in-wrap').css('height', this._containerHeight);
                this.element.parents('.e-rotator-wrap').css('height', this._containerHeight);
            }
            this._changeProperty();
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy._outerWrapper.addClass(value);
                else proxy._outerWrapper.attr(key, value);
                if (key == "disabled" && value == "disabled") proxy.disable();
            });
        },

        _setUlInitial: function () {
            if (this.model.orientation == ej.Orientation.Horizontal) {
                this.element.css({
                    "width": this._liCount * this._liWidth,
                    "height": this._liHeight
                });
            }
            else {
                this.element.css({
                    "height": this._liCount * this._liHeight,
                    "width": this._liWidth
                });
            }
        },

        _setInitial: function () {
            this.model.circularMode ? this.element.css(this.displayCss, -(this._liSize * this.model.displayItemsCount) - (((this.model.startIndex > 0 && this.element.children('li').length > this.model.startIndex)  ? this.model.startIndex : 0) * this.model.navigateSteps * this._liSize)) : this.element.css(this.displayCss, "0");
        },
        _setBegin: function () {
            this.model.circularMode ? this.element.css(this.displayCss, -(this._liSize * this.model.displayItemsCount)) : this.element.css(this.displayCss, "0");
        },

        _setSlideWidth: function (val) {
            if (isNaN(parseInt(val)))
                this.model.slideWidth = this._getMaxSize("width");
            else {
                val = val.toString();
                this.model.slideWidth = this._checkValue(val, "width");
            }
            this.element.children('li').css("width", this.model.slideWidth);
            if (this.model.isResponsive) this.element.children('li').find('img').css("width", this.model.slideWidth);
            this._liWidth = this.element.children('li').outerWidth(true);
        },

        _setSlideHeight: function (val) {
            if (isNaN(parseInt(val)))
                this.model.slideHeight = this._getMaxSize("height");
            else {
                val = val.toString();
                this.model.slideHeight = this._checkValue(val, "height");
            }
            this.element.children('li').css("height", this.model.slideHeight);
            if (this.model.isResponsive) this.element.children('li').find('img').css("height", this.model.slideHeight);
            this._liHeight = this.element.children('li').outerHeight(true);
        },

        _setPagerposition: function (val) {
            if (this.model.showPager) {
                this._bullet.removeClass('e-default e-thumb-pos e-topleft e-topright e-bottomleft e-bottomright e-topCenter e-outside');
                this._bullet.addClass("e-" + val);
                if ((val == "bottomleft" || val == "bottomright") && this.model.showThumbnail && (this.model.dataSource != null || this.model.thumbnailSourceID != null))
                    this._bullet.addClass('e-thumb-pos');
            }
        },

        _setCaptionText: function (index) {
            if (this.model.showCaption) {
                var indx = (this.model.circularMode) ? ++index : index;
                this._caption.children().html(this.element.children('li').eq(indx)[0].getElementsByTagName('img')[0].getAttribute('title'));
            }
        },

        _setAutoplay: function (val) {
            if (val)
                this._createAutoPlay();
            else if (this._autoButton != null) {
                this._setPause();
                this._autoButton.remove();
            }
        },

        _setSlideButton: function (val) {
            if (val)
                this._createButtonControl()
            else {
                this._prevButton.remove();
                this._nextButton.remove();
            }
        },

        _setOrientation: function (val) {
            this._wrapper.removeClass("e-" + this.model.orientation).addClass("e-" + val);
            this._setFrameSpace(this.model.frameSpace);
            this._refresh();
            if (this.model.orientation == ej.Orientation.Horizontal)
                this.element.css({ "left": -(Math.round(-(this.element.position().top) / this._liHeight) * this._liSize), "top": 0 });
            else
                this.element.css({ "top": -(Math.round(-(this.element.position().left) / this._liWidth) * this._liSize), "left": 0 });
            this._unwireTouchEvents();
            this._wireTouchEvents();
        },
        _setRTL: function (args, options) {
            if (args && this.model.showNavigateButton) {
                this._unwireBtnEvents();
                this.model.enableRTL = options;
            }
            var action = this.model.enableRTL ? "addClass" : "removeClass";
            this.model.showPager && this._bullet[action]("e-rtl");
            this.model.showCaption && this._caption[action]("e-rtl");
            !ej.isNullOrUndefined(this._thumbItems) && this._thumbItems[action]('e-rtl');
            if (args && this.model.showNavigateButton) this._wireBtnEvents();
        },
        _setActiveBullet: function () {
            var index;
            if (this.model.circularMode) {
                index = Math.round(-Math.round(this.element.position()[this.displayCss]) / (this._liSize * this.model.displayItemsCount));
                if (this.model.navigateSteps < this.model.displayItemsCount)
                    index = -(Math.round(this.element.position()[this.displayCss]) + (this._liSize * this.model.displayItemsCount)) / (this._liSize * this.model.navigateSteps);
                index = this.model.navigateSteps == this.model.displayItemsCount ? index - 1 : index;
            }
            else
                index = Math.round(-(Math.round(this.element.position()[this.displayCss])) / (this._liSize * this.model.navigateSteps));

            index = index < 0 ? -index : index;
            this._bullet.children().eq(Math.round(index)).addClass('e-active').attr({ 'tabindex': 0, 'aria-selected': "true", "aria-checked": "true" });
        },

        _setActiveThumb: function () {
            if (this.model.circularMode) {
                var index = Math.round(-Math.round(this.element.position()[this.displayCss]) / this._liSize);
                index--;
            }
            else {
                var index = Math.round(Math.round(this.element.position()[this.displayCss]) / (this._liSize));
                index = (index == 0) ? index : -(index);
            }
            this._thumbItems.children().eq(index).addClass('e-active').attr({ 'tabindex': 0, 'aria-selected': "true", "aria-checked": "true" });
            this._transferThumb(index);
        },
        _checkValue: function (val, orient) {
            if ((val.indexOf("%")) > 0) {
                if (Math.round(parseInt(val)) == "100") {
                    this.model.displayItemsCount = 1;
                    this._setVisibleItemCount(this.model.displayItemsCount);
                }
                val = this._convertPercentageToPixel($(this.element[0]).parent()[orient](), parseInt(val));
            }
            return (val);
        },

        _convertPercentageToPixel: function (parent, child) {
            return Math.round((child * parent) / 100);
        },

        _convertPixelToPercentage: function (parent, child) {
            return Math.round((child / parent) * 100);
        },
        _changeProperty: function () {
            this.containerCss = this.model.orientation == ej.Orientation.Horizontal ? "outerWidth" : "outerHeight";
            this.displayCss = this.model.orientation == ej.Orientation.Horizontal ? "left" : "top";
            if (this.model.orientation == ej.Orientation.Horizontal) {
                this._liSize = this._liWidth;
                this._containerSize = this._containerWidth;
            }
            else {
                this._liSize = this._liHeight;
                this._containerSize = this._containerHeight;
            }
        },

        _setFrameSpace: function (val) {
            if (isNaN(parseInt(val))) {
                this.model.frameSpace = "0px";
            } else {
                this.model.frameSpace = val;
                this.model.orientation == ej.Orientation.Horizontal ? this.element.children('li').css({ "margin-right": val, "margin-bottom": 0 }) : this.element.children('li').css({ "margin-bottom": val, "margin-right": 0 });
            }
        },

        _setLicount: function () {
            this._liCount = this.element.children('li').length;
        },

        _setVisibleItemCount: function (val) {
            this.model.displayItemsCount = val;
            this.model.navigateSteps = (this.model.navigateSteps <= this.model.displayItemsCount) ? this.model.navigateSteps : this.model.displayItemsCount;
            this._checkAndSet();
        },
        _checkAndSet: function () {
            if ((this.model.displayItemsCount > 1) || (this.model.navigateSteps > 1)) {
                if (this.model.showThumbnail) this.model.showThumbnail = false;
                if (this.model.showCaption) { this.model.showCaption = false; this._captionChange = true;  }
            }
        },

        _changeSkin: function () {
            var value;
            if ((this.model.displayItemsCount > 1) || (this.model.navigateSteps > 1)) {
                this._innerWrapper.addClass("e-multiple");
                this._wrapper.removeClass("e-single");
                this._outerWrapper.css('width', this._innerWrapper.outerWidth(true));
            } else {
                this._innerWrapper.removeClass('e-multiple');
                this._wrapper.addClass("e-single");
            }
            if (this.model.showPlayButton)
                this._autoButton.css({
                    "left": (((this._innerWrapper.outerWidth(true) / 2) - (this._autoButton.width() / 2)) / this._innerWrapper.outerWidth(true)) * (100) + "%",
                    "top": (((this._wrapper.outerHeight(true) / 2) - (this._autoButton.height() / 2)) / this._wrapper.outerHeight(true)) * (100) + "%"
                });

            if (this.model.showNavigateButton && this._liCount > 3) {
                value = (((this._wrapper.outerHeight(true) / 2) - (this._prevButton.height() / 2)) / this._wrapper.outerHeight(true)) * (100) + "%";
                this._prevButton.css("top", value);
                this._nextButton.css("top", value);
            }
            if ((this.model.showThumbnail) && (this.model.dataSource != null || this.model.thumbnailSourceID != null) && (this._previous != null) && (this._next != null)) {
                value = this._outerWrapper.outerHeight(true) + (this._thumbItems.children('li').outerHeight(true) / 2) - (this._thumbItems.children('li').outerHeight(true)) - (this._previous.height() / 2);
                value = (value / this._outerWrapper.outerHeight(true)) * 100 + "%";
                this._previous.css("top", value);
                this._next.css("top", value);
            }
        },

        _setItemMove: function (val) {
            this.model.navigateSteps = this._validateItemMove(val);
            this._checkAndSet();
        },
        _validateItemMove: function (val) {
            return ((val <= this.model.displayItemsCount) ? val : this.model.displayItemsCount);
        },

        _setPlay: function () {
            if ((this.model.showPlayButton) && (this._autoButton.hasClass("play")))
                this._autoButton.removeClass("play").addClass("pause");
            this._animate = true;
            this._raiseEvent("start");
        },

        _setPause: function (isCode) {
            if (this._interval != null) {
                if ((this.model.showPlayButton) && (this._autoButton.hasClass("pause")))
                    this._autoButton.removeClass("pause").addClass("play");
                clearInterval(this._interval);
                this._isInteraction = !isCode;
                this._animate = this.model.stopOnHover ? true : false;
                this._interval = null;
                this._raiseEvent("stop");
            }
        },
        _setContainerPercent: function () {
            this._containerPercent = this._convertPixelToPercentage(this.element.parents('.e-rotator-wrap').parent().width(), this.element.parent().width());
            this._containerHeightPercent = this._convertPixelToPercentage(this.element.parents('.e-rotator-wrap').parent().height(), this.element.parent().height());
        },

        _setSpeed: function (val) {
            this.transitionDelay = this.model.animationType != "slideshow" ? (val + this.model.delay) : ((val * 2) + this.model.delay);
        },

        _setThumbProperty: function () {
            var thumbwidth, itemsWidth = 0, margin;
            var listElement = this._thumbItems.children('li');
            if ((ej.browserInfo().name == "msie") && (ej.browserInfo().version == "8.0") && parseFloat($(listElement[0]).width()) < 0) return false; 
            for (var i = 0; i < listElement.length; i++) {
                if (listElement[i] != null)
                    itemsWidth = itemsWidth + (parseFloat(listElement.eq(i).width()) + parseFloat(listElement.eq(i).css("padding-left")) + Math.ceil(parseFloat(listElement.eq(i).css("border-left-width"))) + parseFloat(listElement.eq(i).css("margin-left")) + parseFloat(listElement.eq(i).css("padding-right")) + Math.ceil(parseFloat(listElement.eq(i).css("border-right-width"))) + parseFloat(listElement.eq(i).css("margin-right")));
            }
            thumbwidth = Math.round((this.element.parent().outerWidth(true)) - (((this.element.parent().outerWidth(true)) * 12) / 100));
            this._thumb.css('width', thumbwidth);
            this._thumbCount = Math.floor(this._thumb.outerWidth() / (itemsWidth / (listElement.length)));
            margin = Math.round(((this.element.parent().outerWidth(true) * 6) / 100) + (thumbwidth - (this._thumbCount * (itemsWidth / (listElement.length)))) / 2);
            this._thumb.css({ 'margin-left': margin, 'margin-right': margin, 'width': Math.ceil(this._thumbCount * Math.ceil(itemsWidth / (listElement.length))) });
            this._thumbItems.css({ 'width': Math.ceil(itemsWidth), 'height': this._thumbItems.children('li').outerHeight(true) });
            if (this._liCount <= 3) this._thumb.css({ 'left': ((this.element.parent().outerWidth(true)/2) - (margin*2)) });
            this._checkState();
            if (this._thumbCount <= (this._liCount - (this.model.displayItemsCount * 2))) {
                this._previous.css({ 'left': (margin - this._previous.width()) / 2 });
                this._next.css({ 'right': (margin - this._next.width()) / 2 });
            }
        },
        _checkState: function () {
            if (this._thumbCount <= (this._liCount - (this.model.displayItemsCount * 2))) {
                if (!this.element.parents('.e-in-wrap').siblings().hasClass("e-thumb-nav"))
                    this._createThumbControl();
            }
            else if (this._thumbCount >= (this._liCount - (this.model.displayItemsCount * 2))) {
                this._thumbControl = ej.buildTag("div.e-thumb-nav").insertAfter(this._thumb);
                this._thumbControl.appendTo(this._outerWrapper);
                this._wireThumbEvents();
            }
            else if (this.element.parents('.e-in-wrap').siblings().hasClass("e-thumb-nav"))
                this._thumbControl.remove();
        },

        _removeActiveItem: function () {
            if (this.model.showPager)
                this._bullet.children().removeClass('e-active').attr({ 'tabindex': -1, 'aria-selected': "false", "aria-checked": "false" });
            if (this.model.showThumbnail)
                this._thumbItems.children().removeClass('e-active').attr({ 'tabindex': -1, 'aria-selected': "false", "aria-checked": "false" });
        },

        _setActiveItem: function (index) {
            if (this.model.showPager)
                this._bullet.children().eq(index).addClass('e-active').attr({ 'tabindex': 0, 'aria-selected': "true", "aria-checked": "true" });
            if (this.model.showThumbnail) {
                this._thumbItems.children().eq(index).addClass('e-active').attr({ 'tabindex': 0, 'aria-selected': "true", "aria-checked": "true" });
                this._transferThumb(index);
                for (i = 0; i < this._thumbItems.children('li').length; i++)
                    if (this._thumbItems.children('li').eq(i).hasClass('e-thumbhover'))
                        this._thumbItems.children('li').eq(i).removeClass('e-thumbhover');
            }
        },

        _transferThumb: function (index) {
            var move, right;
            if (this.model.showThumbnail) {
                move = (index * this._thumbItems.children('li').outerWidth(true)) - (-this._thumbItems.position().left);
                right = -(this._thumbItems.position().left) + this._thumb.width();
                if ((this._thumbItems.width() - right) > move)
                    this._thumbMove(move);
                else {
                    if (this._thumbCount <= (this._liCount - (this.model.displayItemsCount * 2))) {
                        this._thumbMove((this._thumbItems.width() - right));
                    }                 
                }
            }
        },

        _changeThumbControl: function (index) {
            var licount;
            if ((this.model.showThumbnail) && (this.model.dataSource != null || this.model.thumbnailSourceID != null)) {
                licount = this._thumbItems.children('li').length;
                if ((index * this._thumbItems.children('li').outerWidth(true)) > 0) {
                    if (this._previous != null && this._previous.hasClass("e-disable"))
                        this._previous.removeClass("e-disable").addClass("e-enable").attr({ "aria-disabled": false });
                }
                else if (this._previous != null && this._previous.hasClass("e-enable"))
                    this._previous.removeClass("e-enable").addClass("e-disable").attr({ "aria-disabled": true });

                if ((index * this._thumbItems.children('li').outerWidth(true)) < ((licount - this._thumbCount) * (this._thumbItems.children('li').outerWidth(true)))) {
                    if (this._next != null && this._next.hasClass("e-disable"))
                        this._next.removeClass("e-disable").addClass("e-enable").attr({ "aria-disabled": false });
                }
                else if (this._next != null && this._next.hasClass("e-enable"))
                    this._next.removeClass("e-enable").addClass("e-disable").attr({ "aria-disabled": true });
            }
        },

        _getMaxSize: function (display) {
            var max = 0, current = 0, i = 0, proxy = this;
            for (i = 0; i < this._liCount; i++) {
                current = this.element.children('li').eq(i)[display]();
                max = current > max ? current : max;
            }
            return max;
        },
        _calculateValue: function () {
            return (this._convertPercentageToPixel((this._containerWidth - ((this.model.displayItemsCount - 1) * parseInt(this.model.frameSpace))), (100 / this.model.displayItemsCount)));
        },
        _calculateValueHeight: function () {
            return (this._convertPercentageToPixel((this._containerHeight - ((this.model.displayItemsCount - 1) * parseInt(this.model.frameSpace))), (100 / this.model.displayItemsCount)));
        },
        _changeState: function (val) {
            val ? this.enable() : this.disable();
        },

        _findActive: function () {
            var index, i;
            if (this.model.showPager) {
                for (i = 0; i < this._bullet.children('li').length; i++) {
                    if (this._bullet.children('li').eq(i).hasClass('e-active'))
                        return i;
                }
            }
            else if (this.model.showThumbnail) {
                for (i = 0; i < this._thumbItems.children('li').length; i++) {
                    if (this._thumbItems.children('li').eq(i).hasClass('e-active'))
                        return i;
                }
            }
            else if (!(this.model.showPager) && !(this.model.showThumbnail)) {
                index = Math.round(-Math.round(this.element.position()[this.displayCss]) / this._liSize);
                index = this.model.circularMode ? index - 1 : index;
            }
            return index;
        },

        _wireEvent: function () {
            if (!this.model.enabled) return false;
            this._wrapper.on("mouseenter", $.proxy(this._showControl, this));
            this._wrapper.on("mouseleave", $.proxy(this._hideControl, this));
            this._wireKeyboardEvents();
            this._wireResizeEvents();
            this._wireTouchEvents();
        },

        _wireTouchEvents: function () {
            if (this.model.enableTouch && this.model.orientation=="horizontal")
                this._on(this._wrapper, "swiperight swipeleft", { control: true }, this._touchOperations);
            else if (this.model.enableTouch && this.model.orientation=="vertical")
                this._on(this._wrapper, "swipeup swipedown", { control: true }, this._touchOperations);
            else this._off(this._wrapper, "swiperight swipeleft swipeup swipedown", this._touchOperations);
            if (this.model.showThumbnail && (this.model.dataSource != null || this.model.thumbnailSourceID != null)) this._on(this._thumb, "swiperight swipeleft", { control: false }, this._touchOperations);
        },
        _unwireTouchEvents: function () {
            this._off(this._wrapper, "swiperight swipeleft swipeup swipedown", this._touchOperations);
        },
        _wireKeyboardEvents: function () {
            if (this.model.allowKeyboardNavigation) {
                this._outerWrapper.on("focusin", $.proxy(this._onFocusIn, this));
                this._outerWrapper.on("focusout", $.proxy(this._onFocusOut, this));
            }
            else {
                this._outerWrapper.off("focusin", $.proxy(this._onFocusIn, this));
                this._outerWrapper.off("focusout", $.proxy(this._onFocusOut, this));
            }
        },

        _wireBtnEvents: function () {
            if (this.model.showNavigateButton && this._liCount > 3) {
                this._prevButton.on("click", $.proxy(this.model.enableRTL ? this._nextAction : this._prevAction, this));
                this._nextButton.on("click", $.proxy(this.model.enableRTL ? this._prevAction : this._nextAction, this));
            }
            else
                this._unwireBtnEvents();
        },
        _unwireBtnEvents: function () {
            if (this._liCount > 3) {
                this._prevButton.off("click", $.proxy(this.model.enableRTL ? this._nextAction : this._prevAction, this));
                this._nextButton.off("click", $.proxy(this.model.enableRTL ? this._prevAction : this._nextAction, this));
            }
        },

        _wireAutoPlayEvents: function () {
            if (this.model.showPlayButton)
                this._on(this._autoButton, "click", this._autoPlay);
            else
                this._off(this._autoButton, "click", this._autoPlay);
        },

        _wireResizeEvents: function () {
            if (this.model.isResponsive)
                $(window).on("resize", $.proxy(this._resizeEvent, this));
            else
                $(window).off("resize", $.proxy(this._resizeEvent, this));
        },

        _wireThumbEvents: function () {
            if (this.model.showThumbnail) {
                this._on(this._thumbItems.children(), "click", this._thumbClick);
                if (this._thumbCount <= (this._liCount - (this.model.displayItemsCount * 2))) {
                    this._on(this._next, "click", (this.model.enableRTL ? this._thumbPrev : this._thumbNext));
                    this._on(this._previous, "click", (this.model.enableRTL ? this._thumbNext : this._thumbPrev));
                }
            }
            else {
                this._off(this._thumbItems.children(), "click", this._thumbClick);
                if (this._thumbCount <= (this._liCount - (this.model.displayItemsCount * 2))) {
                    this._off(this._next, "click", (this.model.enableRTL ? this._thumbPrev : this._thumbNext));
                    this._off(this._previous, "click", (this.model.enableRTL ? this._thumbNext : this._thumbPrev));
                }
            }
        },

        _wireBulletEvents: function () {
            if (this.model.showPager)
                this._on(this._bullet.children(), "click", this._bulletClick);
            else
                this._off(this._bullet.children(), "click", this._bulletClick);
        },

        _thumbNext: function () {
            var proxy = this, rightValue;
            if (!this.model.enabled) return false;
            if (this[this.model.enableRTL ? "_next" : "_previous"].hasClass("e-disable"))
                this[this.model.enableRTL ? "_next" : "_previous"].removeClass("e-disable").addClass("e-enable").attr({ "aria-disabled": false });
            rightValue = (-Math.round(this._thumbItems.position().left)) + this._thumb.width();
            if (this._thumbItems.width() - rightValue >= this._thumbItems.children('li').outerWidth(true))
                this._thumbMove(this._thumbItems.children('li').outerWidth(true));
            if ((this._thumbItems.width() - rightValue) <= this._thumbItems.children('li').outerWidth(true)) {
                this[this.model.enableRTL ? "_previous" : "_next"].removeClass("e-enable").addClass("e-disable").attr({ "aria-disabled": true });
            }
        },

        _thumbMove: function (move) {
            var proxy = this;
            proxy._thumbItems.animate({
                "left": "-=" + move + "px",
            }, 600, function () { proxy._thumbItems.stop(true, true); });
        },

        _thumbPrev: function () {
            var proxy = this, leftValue, itemWidth;
            if (!this.model.enabled) return false;
                if (this[this.model.enableRTL ? "_previous" : "_next"].hasClass("e-disable"))
                    this[this.model.enableRTL ? "_previous" : "_next"].removeClass("e-disable").addClass("e-enable").attr({ "aria-disabled": false });
                leftValue = Math.round(this._thumbItems.position().left);
                itemWidth = this._thumbItems.children('li').outerWidth(true);
                if ((-leftValue) >= itemWidth) this._thumbMove(-itemWidth);
                if ((-leftValue) <= itemWidth)
                     this[this.model.enableRTL ? "_next" : "_previous"].removeClass("e-enable").addClass("e-disable").attr({ "aria-disabled": true });
               
        },
        _findLength: function () {
            var proxy = this, len;
            if (this.model.showThumbnail) len = proxy._thumbItems.children('li').length - 1;
            if (this.model.showPager) len = proxy._bullet.children('li').length - 1;
            if (!(this.model.showPager) && !(this.model.showThumbnail))
                len = (this.model.circularMode) ? ((this.element[this.containerCss]()) / this._liSize) - ((this.model.displayItemsCount) * 2) : ((this.element[this.containerCss]()) / this._liSize) - 1;
            return len;
        },

        _changeActiveState: function (action) {
            var proxy = this, index, len;
            index = proxy._findActive();
            len = proxy._findLength();
            proxy._removeActiveItem();
            if (action == "prev") {
                if ((index > 0)) {
                    proxy._setActiveItem((index - 1));
                    if (this.model.animationType != "slideshow") this._setCaptionText((index - 1));
                }
                else {
                    proxy._setActiveItem(len);
                    if (this.model.animationType != "slideshow") this._setCaptionText((len));
                }
            }
            else if (index < len) {
                proxy._setActiveItem((index + 1));
                if ((this.model.animationType != "slideshow"))
                    this._setCaptionText((index + 1));
            }
            else {
                proxy._setActiveItem(0);
                if (this.model.animationType != "slideshow") this._setCaptionText(0);
            }
        },

        _moveSlide: function (move, action) {
            var proxy = this, animationType, animationSpeed, index, len, properties = {};
            animationType = this.model.animationType != "slideshow" ? this.model.animationType : "slideshow";
            animationSpeed = this.model.animationType != "slideshow" ? proxy.model.animationSpeed : 0;
            index = proxy._findActive();
            len = proxy._findLength();
            properties[this.displayCss] = proxy.element.position()[proxy.displayCss];
            properties[this.displayCss] -= move;
            index = action == "next" ? (index < len ? index + 1 : 0) : action == "prev" ? (index > 0 ? index - 1 : len) : 0; this._prevIndex = index;
            if (this.model.animationType == "slideshow") { proxy.element.fadeOut(proxy.model.animationSpeed / 2); if (proxy.model.showCaption) proxy._caption.fadeOut(proxy.model.animationSpeed / 2); }
            proxy.element.animate(properties, animationSpeed, animationType, function () { if (action == "end") proxy._setBegin(); proxy._animating = false; proxy._setCaptionText(index); proxy._raiseEvent("change"); });
            if (this.model.animationType == "slideshow") { proxy.element.fadeIn(proxy.model.animationSpeed / 2); if (proxy.model.showCaption) proxy._caption.fadeIn(proxy.model.animationSpeed / 2); }
        },

        _moveNext: function () {
            var proxy = this, ltValue, endValue, rbValue, move;
            proxy._animating = true;

            if (this.model.circularMode) {
                ltValue = Math.round(proxy.element.position()[proxy.displayCss]);
                endValue = (proxy.model.displayItemsCount * proxy._liSize) - (proxy._liCount * proxy._liSize);
                rbValue = Math.round(proxy.element.position()[proxy.displayCss]) + proxy.element[proxy.containerCss]();
                proxy._calculateItemMove();
                if ((ltValue > endValue) && (rbValue - proxy._containerSize > (proxy._move + parseInt(proxy.model.frameSpace)))) {
                    return { move: proxy._move, action: "next" }
                }
                else {
                    if (rbValue - proxy._containerSize <= (proxy._move + parseInt(proxy.model.frameSpace))) {
                        move = rbValue - proxy._containerSize - parseInt(proxy.model.frameSpace);
                        return { move: move, action: "end" }
                    }
                }

            }
            else {
                ltValue = Math.round(proxy.element.position()[proxy.displayCss]);
                endValue = -(proxy._liCount * proxy._liSize);
                rbValue = Math.round(proxy.element.position()[proxy.displayCss]) + proxy.element[proxy.containerCss]();
                proxy._calculateItemMove();
                if ((ltValue - proxy._liSize) != endValue) {
                    if (rbValue - proxy._containerSize <= (proxy._move + parseInt(proxy.model.frameSpace))) {
                        proxy._move = rbValue - proxy._containerSize - parseInt(proxy.model.frameSpace);
                        proxy._move = proxy._move == 0 ? ltValue : proxy._move;
                    }
                    return { move: proxy._move, action: "next" }
                }
                else {
                    if (rbValue - proxy._containerSize <= (proxy._move + parseInt(proxy.model.frameSpace)))
                        return { move: ltValue, action: "end" }
                }
            }
        },

        _movePrev: function () {
            var proxy = this, ltValue, rbValue, endValue, setValue;
            ltValue = Math.round(proxy.element.position()[proxy.displayCss]);
            rbValue = proxy.element.position()[proxy.displayCss]; +proxy.element[proxy.containerCss]();
            endValue = proxy.element[proxy.containerCss]();
            proxy._calculateItemMove();
            if (this.model.circularMode) {
                if ((rbValue < endValue) && (-ltValue > (proxy.model.displayItemsCount * proxy._liSize)))
                    return { move: -proxy._move, action: "prev" }
                else {
                    setValue = ((proxy.model.displayItemsCount * proxy._liSize) * 2) + ltValue - (proxy._liCount * proxy._liSize);
                    proxy._move = ((proxy._liCount - (proxy.model.displayItemsCount * 2)) % proxy.model.navigateSteps) * proxy._liSize;
                    if (proxy._move == 0) proxy._calculateItemMove();
                    if (proxy.model.orientation == ej.Orientation.Horizontal)
                        proxy.element.css("left", setValue);
                    else
                        proxy.element.css("top", setValue);
                    return { move: -proxy._move, action: "prev" }
                }
            }
            else {
                if ((rbValue < endValue) && (-ltValue >= (proxy._liSize * proxy.model.navigateSteps)))
                    return { move: -proxy._move, action: "prev" }
                else {
                    setValue = ((proxy.model.displayItemsCount * proxy._liSize)) + ltValue - (proxy._liCount * proxy._liSize);
                    proxy._move = ((-ltValue < proxy._move) && (ltValue != 0)) ? -ltValue : setValue;
                    return { move: -proxy._move, action: "prev" }
                }
            }
        },

        _autoPlay: function (e) {
            var proxy = this, value, move;
            this._isInteraction = !!e;
            if (this._interval == null) {
                this._setPlay();
                move = function () {
                    proxy._animating = true;
                    value = proxy._rtlDirection ? proxy._moveNext() : proxy._movePrev();
                    proxy._moveSlide(value.move, value.action);
                    proxy._changeActiveState(value.action);
                    proxy._changeThumbControl(proxy._findActive());
                }
                function SetInterval(move, animationSpeed) {
                    return (setInterval(move, animationSpeed))
                }
                if (!this._animating)
                    this._interval = SetInterval(move, this.transitionDelay);
            }
            else
                this._setPause();
        },

        _nextAction: function (isCode) {
            var proxy = this, interval, next, value;
            this._isInteraction = !!isCode;
            next = function () {
                value = proxy._moveNext();
                proxy._moveSlide(value.move, value.action);
                clearInterval(interval);
                proxy._changeActiveState("next");
                proxy._changeThumbControl(proxy._findActive());
            }
            if (this._interval != null)
                this._setPause();

            if (!this._animating) {
                this._animating = true;
                interval = setInterval(next, "");
            } this._prevIndex = this.getIndex();
        },

        _prevAction: function (isCode) {
            var proxy = this, interval, previous, value;
            this._isInteraction = !!isCode;
            previous = function () {
                value = proxy._movePrev();
                proxy._moveSlide(value.move, value.action);
                clearInterval(interval);
                proxy._changeActiveState("prev");
                proxy._changeThumbControl(proxy._findActive());
            }
            if (this._interval != null)
                this._setPause();

            if (!this._animating) {
                this._animating = true;
                interval = setInterval(previous, "")
            } this._prevIndex = this.getIndex();
        },

        _touchOperations: function (e) {
            var isThumb = !e.data.control, direction, orient = this.model.orientation;
            if (isThumb)
                direction = e.type == "swipeleft" ? "left" : "right";
            else {
                if ((orient == "horizontal" && e.type == "swipeleft") ||
                    (orient == "vertical" && e.type == "swipeup"))
                    direction = "left";
                else if ((orient == "horizontal" && e.type == "swiperight") ||
                    (orient == "vertical" && e.type == "swipedown"))
                    direction = "right";
            }
            if (direction == "left")
                isThumb ? this._thumbNext() : this.slideNext();
            else if (direction == "right")
                isThumb ? this._thumbPrev() : this.slidePrevious();
        },

        _resizeEvent: function () {
            var index, parent, parentHeight;
            if (!this.model.enabled) return false;
            index = Math.round(-Math.round(this.element.position().left) / this._liSize);
            parent = Math.round(this.element.parents('.e-rotator-wrap').parent().width());
            parentHeight = Math.round(this.element.parents('.e-rotator-wrap').parent().height());
            this._containerWidth = this._convertPercentageToPixel(parent, this._containerPercent);
            this._containerHeight = this._convertPercentageToPixel(parentHeight, this._containerHeightPercent);
            this._setSlideWidth(this._calculateValue().toString());
            this._setWidth();
            this._setSlideHeight((this.model.displayItemsCount > 1 && this.model.orientation == "horizontal") ? this._containerHeight : this._calculateValueHeight().toString());
            if (!this.model.showThumbnail) this._setHeight();
            this.element.css("left", -(index * this._liSize));
            this._setUlInitial();
            if ((this.model.showThumbnail) && (this.model.dataSource != null || this.model.thumbnailSourceID != null))
                this._setThumbProperty();
        },

        _calculateItemMove: function () {
            if (!isNaN(this.model.navigateSteps))
                this._move = this._liSize * this.model.navigateSteps;
            else {
                this.model.navigateSteps = 1;
                this._move = this._liSize * this.model.navigateSteps;
            }
        },

        _thumbClick: function (event) {
            var index;
            this._isInteraction = true;
            var btnStatus = this._autoButton != null ? (this._autoButton.hasClass("play") ? false : true) : (this.model.enableAutoPlay ? true : false);
            if (!this.model.enabled) return false;

            if (this._interval != null)
                this._setPause();

            this._removeActiveItem();
            index = ((event.target.className == 'e-thumb-ele e-thumbhover') || (event.target.className == 'e-thumb-ele')) ? this._thumbItems.children('li').index($(event.target)) :
            this._thumbItems.children('li').index($(event.target).parents('.e-thumb-ele'));
            this._changeThumbControl(index);
            this._setActiveItem(index);
            this._raiseEvent("thumbItemClick");
            if (this.model.circularMode)
                this._moveSlideContent(this.element.position()[this.displayCss], -((this.model.displayItemsCount * this._liSize) + (index * this.model.navigateSteps * this._liSize)), index, btnStatus);
            else
                this._moveSlideContent(this.element.position()[this.displayCss], -((index * this.model.navigateSteps * this._liSize)), index, btnStatus);
        },

        _bulletClick: function (event) {
            var index, target;
            this._isInteraction = true;
            var btnStatus = this._autoButton != null ? (this._autoButton.hasClass("play") ? false : true) : (this.model.enableAutoPlay ? true : false);
            if (!this.model.enabled) return false;
            if (this._interval != null)
                this._setPause();
            this._removeActiveItem();
            this._eventIndex = index = this._bullet.children('').index(event.target);
            this._changeThumbControl(index);
            this._setActiveItem(index);
            this._raiseEvent("pagerClick");
            if (this.model.circularMode)
                this._moveSlideContent(this.element.position()[this.displayCss], -((this.model.displayItemsCount * this._liSize) + (index * this.model.navigateSteps * this._liSize)), index, btnStatus);
            else {
                target = (index * this.model.navigateSteps * this._liSize);
                if ((this.element[this.containerCss]()) - (this.model.displayItemsCount * this._liSize) < target)
                    target = (this.element[this.containerCss]()) - (this.model.displayItemsCount * this._liSize);
                this._moveSlideContent(this.element.position()[this.displayCss], -target, index, btnStatus);
            }
        },

        _moveSlideContent: function (Current, Target, index, btnStatus, isCode) {
            var proxy = this, animationSpeed, animationType, properties = {};
            animationType = this.model.animationType != "slideshow" ? this.model.animationType : "slideshow";
            animationSpeed = this.model.animationType != "slideshow" ? proxy.model.animationSpeed : 0;
            properties[this.displayCss] = proxy.element.position()[proxy.displayCss];
            properties[this.displayCss] += (Target - Current);
            if (this.model.animationType == "slideshow") { proxy.element.fadeOut(proxy.model.animationSpeed / 2); if (proxy.model.showCaption) proxy._caption.fadeOut(proxy.model.animationSpeed / 2); }
            proxy.element.animate(properties, animationSpeed, animationType, function () {
                proxy._setCaptionText(index); if (btnStatus) {
                    setTimeout(function () {
                        proxy.play();
                    }, proxy.model.animationSpeed);
                }
            });
            if (this.model.animationType == "slideshow") { proxy.element.fadeIn(proxy.model.animationSpeed / 2); if (proxy.model.showCaption) proxy._caption.fadeIn(proxy.model.animationSpeed / 2); }
            this._isInteraction = !isCode;
            if (this._prevIndex != index)
                proxy._raiseEvent("change");
            this._prevIndex = index;
        },

        _destroy: function () {
            this._interval != null ? this.pause() : "";
            this._undoClone();
            this.element.removeAttr("style").insertAfter(this._outerWrapper).removeClass();
            this.element.children().removeAttr("style");
            this._outerWrapper.remove();
            $(window).off("resize", $.proxy(this._resizeEvent, this));
            this.element.stop();
        },

        _raiseEvent: function (event) {
			this.eventType = event; 
            var data = { activeItemIndex: this.getIndex(), itemID: this.element.attr('id') };
            if (event == "start" || event == "change" || event == "stop")
                data = { activeItemIndex: this.getIndex(), itemID: this.element.attr('id'), isInteraction: this._isInteraction };
            return this._trigger(event, data);

        },

        _showControl: function (event) {
            if (!this.model.enabled) return false;
            if (this.model.showNavigateButton && this._liCount > 3) {
                this._prevButton.stop(true, true).fadeIn('slow');
                this._nextButton.stop(true, true).fadeIn('slow');
            }
            if (this.model.showPlayButton)
                this._autoButton.stop(true, true).fadeIn('slow');
            if ((this.model.showCaption) && (this._caption != null))
                this._caption.stop(true, true).fadeIn('slow');
            if (this.model.stopOnHover && this._animate)
                this.pause();
            event.stopPropagation();
        },

        _hideControl: function (event) {
            if (!this.model.enabled) return false;
            if (this.model.showNavigateButton && this._liCount > 3) {
                this._prevButton.stop(true, true).fadeOut('slow');
                this._nextButton.stop(true, true).fadeOut('slow');
            }
            if (this.model.showPlayButton)
                this._autoButton.stop(true, true).fadeOut('slow');
            if ((this.model.showCaption) && (this._caption != null))
                this._caption.stop(true, true).fadeOut('slow');
            if ((this.model.enableAutoPlay) && this.model.stopOnHover && this._animate)
                this.play();
            event.stopPropagation();
        },

        _onFocusIn: function () {
            if (!this.model.enabled) return false;
            this._outerWrapper.addClass("e-Focused");
            this._innerWrapper.addClass("e-shadow");
            $(this._outerWrapper).on("keydown", $.proxy(this._focuseHandle, this));
        },

        _onFocusOut: function () {
            this._outerWrapper.removeClass("e-Focused");
            this._innerWrapper.removeClass("e-shadow");
            $(this._outerWrapper).off("keydown", $.proxy(this._focuseHandle, this));
        },

        _focuseHandle: function (e) {
            if (!this.model.enabled) return false;
            if (this._outerWrapper.hasClass("e-Focused")) {
                e.keyCode = ((e.altKey) && ((e.keyCode == 37) || (e.keyCode == 40))) ? 1000 : e.keyCode;
                e.keyCode = ((e.altKey) && ((e.keyCode == 38) || (e.keyCode == 39))) ? 1001 : e.keyCode;
                switch (e.keyCode) {
                    case 37:
                    case 40:
                        e.preventDefault();
                        this._prevAction();
                        break;
                    case 38:
                    case 39:
                        e.preventDefault();
                        this._nextAction();
                        break;
                    case 32:
                        e.preventDefault();
                        this._autoPlay(true);
                        break;
                    case 1000:
                        e.preventDefault();
                        this._thumbPrev();
                        this._thumbHover("prev");
                        break;
                    case 1001:
                        e.preventDefault();
                        this._thumbNext();
                        this._thumbHover("next");
                        break;
                    case 13:
                        e.preventDefault();
                        for (i = 0; i < this._thumbItems.children('li').length; i++)
                            if (this._thumbItems.children('li').eq(i).hasClass('e-thumbhover'))
                                this.gotoIndex(i);

                }
            }
        },

        _thumbHover: function (action) {
            var proxy = this, index = null, len;
            for (i = 0; i < this._thumbItems.children('li').length; i++) {
                if (this._thumbItems.children('li').eq(i).hasClass('e-thumbhover')) {
                    index = i;
                    this._thumbItems.children('li').eq(i).removeClass('e-thumbhover');
                    break;
                }
            }
            if (index == null)
                index = this._findActive();
            len = proxy._findLength();
            if (action == "prev") {
                if (index > 0)
                    this._thumbItems.children().eq(--index).addClass('e-thumbhover');
                else
                    this._thumbItems.children().eq(0).addClass('e-thumbhover');
            }
            else if (index < len)
                this._thumbItems.children().eq(++index).addClass('e-thumbhover');
            else
                this._thumbItems.children().eq(len).addClass('e-thumbhover');
        },

        _ieEnable: function (action) {
            this.element[action]("e-disable");
            this.model.showPager && this._bulletWrapper.children('ul.e-bullet')[action]('e-disable')
            this.model.showThumbnail && this._thumbItems.children('li.e-thumb-ele')[action]("e-disable");
            if (this.model.showThumbnail) {
                this._next[action]('e-disable');
                this._previous[action]('e-disable');
            }
        },


        enable: function () {
            if (!this.model.enabled) {
                this.model.enabled = true;
                this._outerWrapper.removeClass("e-disable").attr({ "aria-disabled": false });
                if ((ej.browserInfo().name == "msie") && (ej.browserInfo().version == "8.0"))
                    this._ieEnable("removeClass");
                if (this._isPlaying) this.play();
            }
        },

        disable: function () {
            if (this.model.enabled) {
                this.model.enabled = false;
                this._outerWrapper.addClass("e-disable").attr({ "aria-disabled": true });
                if ((ej.browserInfo().name == "msie") && (ej.browserInfo().version == "8.0"))
                    this._ieEnable("addClass");
                this._isPlaying = this._interval != null ? true : false;
                if (this._interval != null)
                    this._setPause();
            }
        },

        updateTemplateById: function (id, index) {
            var templateContent, lastItem, content;
            if (this.model.templateId != null) {
                $(this.element.children()[index]).empty();
                templateContent = $("#" + id);
                content = templateContent[0] && templateContent[0].nodeName && templateContent[0].nodeName.toLowerCase() == "script" ? ej.getClearString(templateContent[0].innerHTML) : templateContent;
                $(this.element.children()[index]).append(content);
                if (this.model.circularMode && this.element.children('li').eq(index - 1).hasClass("clone")) {
                    $(this.element.children()[this._liCount - 1]).empty();
                    lastItem = templateContent[0].nodeName.toLowerCase() == "script" ? content : content.clone();
                    $(this.element.children()[this._liCount - 1]).append(lastItem);
                }
            }
        },

        slideNext: function () {
            this._nextAction(false);
        },

        slidePrevious: function () {
            this._prevAction(false);
        },

        play: function () {
            if (this._interval == null)
                this._autoPlay();
        },

        pause: function () {
            if (this._interval != null)
                this._setPause(true);
        },

        getIndex: function () {
            var index, i, slideIndex = [];
            if (this.model.displayItemsCount > 1) {
                if (this.model.circularMode) {
                    index = Math.round(-Math.round(this.element.position()[this.displayCss]) / this._liSize);
					if(this.eventType != "pagerClick" && ej.isNullOrUndefined(this._prevIndex))
					index = index - this.model.displayItemsCount;else
                   index = (this._eventIndex) ? this._eventIndex : index;
                    for (i = 0; i < this.model.displayItemsCount ; i++) {
                        if (index < (this._liCount - (this.model.displayItemsCount * 2)))
                            slideIndex.push(index++);
                        else {
                            index = 0; i--;
                        }
                    }
                }
                else {
					
                    index = Math.round(Math.round(this.element.position()[this.displayCss]) / (this._liSize));
					index = (this._eventIndex) ? this._eventIndex : index;
                    index = index < 0 ? (index * -1) : index;
                    for (i = 0; i < this.model.displayItemsCount ; i++)
                        slideIndex.push(index++);
				}
                return slideIndex;
            }
            else
                return this._findActive();
        },

        gotoIndex: function (index) {
            var btnStatus = this._autoButton != null ? (this._autoButton.hasClass("play") ? false : true) : (this.model.enableAutoPlay ? true : false);
            if (this._interval != null)
                this._setPause();
            this._removeActiveItem();
            if (this.model.showThumbnail) this._changeThumbControl(index);
            this._setActiveItem(index);
            if (this.model.circularMode)
                this._moveSlideContent(this.element.position()[this.displayCss], -((this.model.displayItemsCount * this._liSize) + (index * this.model.navigateSteps * this._liSize)), index, btnStatus, true);
            else {
                target = ((index * this.model.navigateSteps * this._liSize));
                if ((this.element[this.containerCss]()) - (this.model.displayItemsCount * this._liSize) < target)
                    target = (this.element[this.containerCss]()) - (this.model.displayItemsCount * this._liSize);
                this._moveSlideContent(this.element.position()[this.displayCss], -target, index, btnStatus, true);
            }
        },
    })

    ej.Rotator.PagerPosition = {
        /**  Pager is positioned at the top-left corner of an Item. */
        TopLeft: "topleft",
        /**  Pager is positioned at the top-left corner of an Item. */
        TopRight: "topright",
        /**  Pager is positioned at the top-right corner of an Item. */
        BottomLeft: "bottomleft",
        /**  Pager is positioned at the bottom-left corner of an Item. */
        BottomRight: "bottomright",
        /**  Pager is positioned at the bottom-right corner of an Item. */
        TopCenter: "topCenter",
        /**  Pager is positioned outside an Item. */
        Outside: "outside"
    };

})(jQuery, Syncfusion);