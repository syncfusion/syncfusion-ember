/**
* @fileOverview Plugin to style the groupbutton elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejGroupButton", "ej.GroupButton", {

        element: null,

        model: null,
        validTags: ["div", "span"],
        _addToPersist: ["selectedItemIndex"],
        _setFirst: false,

        _rootCSS: "e-groupbutton",

        defaults: {

            height: "",

            width: "",

            cssClass: "",

            enabled: true,

            enableRTL: false,

            showRoundedCorner: false,

            size: "normal",

            groupButtonMode: "radiobutton",

            orientation: ej.Orientation.Horizontal,

            selectedItemIndex: [],

            htmlAttributes: {},

            dataSource: null,

            query: null,

            fields: {

                text: "text",

                prefixIcon: "prefixIcon",

                suffixIcon: "suffixIcon",

                contentType: "contentType",

                imagePosition: "imagePosition",               

                selected: "selected",

                url: "url",               

                htmlAttribute: "htmlAttribute",

                linkAttribute: "linkAttribute"                

            },

            create: null,

            beforeSelect: null,

            select: null,

            keyPress: null,

            destroy: null
        },

        dataTypes: {
            cssClass: "string",
            enabled: "boolean",
            dataSource: "data",
            query: "data",
            fields: "data",
            showRoundedCorner: "boolean",
            enableRTL: "boolean",
            size: "enum",
            groupButtonMode: "enum",
            orientation: "enum",
            selectedItemIndex: "array"
        },

        _setModel: function (options) {
            var option, val;
            for (option in options) {
                val = options[option];
                switch (option) {
                    case "size":
                        this._setSize(val);
                        break;
                    case "height":
                        this._setDimension("height", val);
                        break;
                    case "width":
                        this._setDimension("width", val);
                        break;
                    case "enabled":
                        this._setControlStatus(val);
                        break;
                    case "showRoundedCorner":
                        this._setRoundedCorner(val);
                        break;
                    case "cssClass":
                        this._setSkin(val);
                        break;
                    case "enableRTL":
                        this._setRTL(val);
                        break;
                    case "htmlAttributes": this._setAttr(val); break;
                    case "dataSource":
                        this.element.html("");
                        this.model.dataSource = val;
                        this._initialize();
                        break;
                    case "groupButtonMode":
                        (this.model.groupButtonMode != val) && this.itemsContainer.children('.e-grp-btn-item.e-active').removeClass('e-active').attr({ "aria-selected": false });
                        break;
                    case "orientation":
                        this._setOrientation(val);
                        this._setDimension("width", this.model.width);
                        this._setDimension("height", this.model.height);
                        break;
                    case "selectedItemIndex":
                        var temp = JSON.parse(JSON.stringify(this.model.selectedItemIndex));
                        for (var i = 0, len = temp.length; i < len; i++) {
                            if(val.indexOf(temp[i]) == -1)
                                this._removeSelection($(this.items[temp[i]]));
                        }
                        this.model.selectedItemIndex =  val;
                        this._handleSeletedItem();
                        break;
                }
            }
        },
        
        _destroy: function () {
            this.element.html("");
            this._cloneElement.removeClass('e-groupbutton e-js e-widget e-box');
            this.element.replaceWith(this._cloneElement);
        },
        
        _init: function () {
            this._cloneElement = $(this.element).clone(), this._isRender = false;
            this._initialize();
            this._isRender = true;
        },

        _initialize: function () {
            this.element.addClass("e-widget e-box e-widget").attr({ "role": "tree", "tabindex": "0", "aria-disabled": false });
            if (this.model.dataSource != null)
                this._checkDataBinding();
             if (!this.element.hasClass("onloading")) this._render();
        },

        _render: function () {
            this._renderItems();
            this._setSize(this.model.size);
            this._setOrientation(this.model.orientation);
            this._setDimension("width", this.model.width);
            this._setDimension("height", this.model.height);
            this._setRoundedCorner(this.model.showRoundedCorner);
            this._setSkin(this.model.cssClass);
            this._setAttr(this.model.htmlAttributes);
            (this.model.enableRTL) && this._setRTL(this.model.enableRTL);
            this._handleSeletedItem();
            this._setControlStatus(this.model.enabled);
        },
        _checkDataBinding: function () {
            var source = this.model.dataSource;
            if (source != null) {
                this.element.addClass("onloading");
                if (ej.DataManager && source instanceof ej.DataManager)
                    this._initDataSource(source);
                else
                    this._createItems(source);
            }
        },
        _initDataSource: function (source) {
            var proxy = this, queryPromise;
            queryPromise = source.executeQuery(this._getQuery());
            queryPromise.done(function (e) {
                proxy._createItems(e.result);
				proxy._render();
            }).fail(function (e) {
                proxy.element.removeClass("onloading");
            });
        },
        _getQuery: function () {
            if (ej.isNullOrUndefined(this.model.query)) {
                var column = [], queryManager = ej.Query(), mapper = this.model.fields;
                for (var col in mapper) {
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
        _createItems: function (list) {
            this.list = list;
            var i; this.mapField = this._getMapper();
            this.ultag = ej.buildTag("ul");
            this.element.append(this.ultag);
            for (i = 0; i < list.length; i++)
                this._generateTagItems(list[i], this.mapField,i);
            this.element.removeClass("onloading");          
        },
        _getMapper: function () {
            var mapper = this.model.fields, mapFld = { _text: null };
            mapFld._text = (mapper && mapper.text) ? mapper["text"] : "text";
            mapFld._prefixIcon = (mapper && mapper.prefixIcon) ? mapper["prefixIcon"] : "prefixIcon";
            mapFld._suffixIcon = (mapper && mapper.suffixIcon) ? mapper["suffixIcon"] : "suffixIcon";
            mapFld._contentType = (mapper && mapper.contentType) ? mapper["contentType"] : "contentType";
            mapFld._imagePosition = (mapper && mapper.imagePosition) ? mapper["imagePosition"] : "imagePosition";
            mapFld._selected = (mapper && mapper.selected) ? mapper["selected"] : "selected";
            mapFld._url = (mapper && mapper.url) ? mapper["url"] : "url";            
            mapFld._htmlAttribute = (mapper && mapper.htmlAttribute) ? mapper["htmlAttribute"] : "htmlAttribute";
            mapFld._linkAttribute = (mapper && mapper.linkAttribute) ? mapper["linkAttribute"] : "linkAttribute";
            return mapFld;            
        },
        _generateTagItems: function (list, map, index) {
            var textspan =  (list[map._text]) ? ej.buildTag('span.e-btntxt', list[map._text]):null;
            var majorimgtag, minorimgtag, imgtxtwrap = ej.buildTag('li');
            if (list[map._htmlAttribute]) this._setAttributes(list[map._htmlAttribute], imgtxtwrap);
            var imagePosition = (list[map._imagePosition]) ? list[map._imagePosition] : "imageleft";
            var contentType = (list[map._contentType]) ? list[map._contentType] : "textonly";
            if (contentType.indexOf("image") > -1) {
                if (list[map._prefixIcon]) {
                    majorimgtag = ej.buildTag('span');
                    majorimgtag.addClass(list[map._prefixIcon]);
                }
                if (list[map._suffixIcon]) {
                    minorimgtag = ej.buildTag('span')
                    minorimgtag.addClass(list[map._suffixIcon]);
                }
            }
            switch (contentType) {
                case ej.ContentType.TextAndImage:
                    switch (imagePosition) {
                        case ej.ImagePosition.ImageRight:
                            imgtxtwrap.append(textspan, majorimgtag);
                            break;
                        case ej.ImagePosition.ImageLeft:
                            imgtxtwrap.append(majorimgtag, textspan);
                            break;
                        case ej.ImagePosition.ImageBottom:
                            majorimgtag.attr("style", "display:inherit");
                            imgtxtwrap.append(textspan, majorimgtag);
                            break;
                        case ej.ImagePosition.ImageTop:
                            majorimgtag.attr("style", "display:inherit");
                            imgtxtwrap.append(majorimgtag, textspan);
                            break;
                    }
                    break;
                case ej.ContentType.ImageTextImage:
                    imgtxtwrap.append(majorimgtag, textspan, minorimgtag);
                    break;
                case ej.ContentType.ImageBoth:
                    imgtxtwrap.append(majorimgtag, minorimgtag);
                    break;
                case ej.ContentType.ImageOnly:
                    imgtxtwrap.append(majorimgtag);
                    break;
                case ej.ContentType.TextOnly:
                    imgtxtwrap.append(textspan);
                    break;
            }
                
            if (list[map._url]) {
                aTag = ej.buildTag('a.e-grp-btn-link').attr('href', list[map._url]);
                if (list[map._linkAttribute]) this._setAttributes(list[map._linkAttribute], aTag);              
                imgtxtwrap.wrapInner(aTag);              
            }

            this.ultag.append(imgtxtwrap);
            if ((list[map._selected]) && $.inArray(index, this.model.selectedItemIndex) <= -1) {
                this.model.selectedItemIndex.push(index);
            }
        },
        _setAttributes: function (data, element) {
            for (var key in data) {
                if (key == "class")
                    element.addClass(data[key]);
                else
                    element.attr(key, data[key]);
            }
        },
        _renderItems: function () {
            var target;
            this.itemsContainer = this.element.children("ol, ul, div").addClass('e-ul');
            this.itemsContainer.children("ol, ul").remove();
            this.items = this.itemsContainer.children('li, div').addClass('e-grp-btn-item').attr({ "aria-selected": false, "aria-disabled": false, role:"treeitem"});
            var i = 0, item = [], len = this.items.length, content, span;
            for (; i < len; i++) {
                item = $(this.items[i]);
                content = document.createElement('div');
                content.className = 'e-btn-content';
                if (item.children().length == 0) {
                    span = document.createElement('span');
                    $(span).text(item.text()).addClass("e-btntxt");
                    item.text("");
                    content.appendChild(span);
                } else {
                    target = (item.children('a').length > 0) ? item.children('a').children() : item.children();
                    target.appendTo(content);
                }
                target = (item.children('a').length > 0)? item.children('a'):item;                    
                target.append(content);
            }
            this.items.filter(':last').addClass('last');
        },

        _handleSeletedItem: function() {
            var index = this.model.selectedItemIndex, ele;
            if(this.model.groupButtonMode == ej.GroupButtonMode.RadioButton) {
                this._setSeletedItem($(this.items[index[index.length -1]]));
            } else {
                for (var i = 0, len = index.length; i < len; i++)
                    this._setSeletedItem($(this.items[index[i]]));
            }
        },

        _setSeletedItem: function(ele, e) {
            if(this.isSelected(ele)) return;
            var args = this._getDetails(ele); args['element'] = ele; args['event'] = e;
            if(this._triggerEvent("beforeSelect", args)) return;
            (this.model.groupButtonMode == ej.GroupButtonMode.RadioButton) && this._removeSelection(this.items.filter('.e-active'));
            ele.addClass("e-active").attr("aria-selected", true).siblings('.e-grp-btn-item').removeClass('e-hover');
            this._addSelectedIndex(this.items.index(ele));
            var args = this._getDetails(ele); args['element'] = ele; args['event'] = e;
            this._triggerEvent("select", args);
        },

        _removeSelection: function(ele) {
            ele.removeClass("e-active").attr("aria-selected", false);
            this._removeSelectedIndex(this.items.index(ele));
        },

        _getDetails: function (ele) {
            if (ele[0] != null && ele.hasClass('e-grp-btn-item')) {
                var id, disabled, selected, index;
                id = ele.attr('id');
                selected = this.isSelected(ele);
                disabled = this.isDisabled(ele);
                index = this.getIndex(ele);
                return { id: id, selected: selected, disabled: disabled, index: index };
            } else {
                return { id: "", selected: "", disabled: "", index: "" };
            }
        },

        _setAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.element.addClass(value);
                else proxy.element.attr(key, value);
                if (key == "disabled" && value == "disabled") proxy.disable();
            });
        },

        _setSize: function (val) {
            this.element.removeClass('e-grp-btn-mini e-grp-btn-medium e-grp-btn-small e-grp-btn-large e-grp-btn-normal');
            this.element.addClass("e-grp-btn-" + val);
        },

        _setDimension: function (prop, val) {
            var minHeight = 26, defaultHeight = 35;
            /* here we use 26 constant is our minimum height and 35 constant is default height of the groupButton while rendering groupbutton without height API*/
            var add, value = 0, method = ( prop == "width") ? "outerWidth" : "outerHeight";
            if(val == "auto") {
                add = this.element[method]() - this.element[prop]();
                for (var i = 0, len = this.items.length; i < len; i++)
                   value += $(this.items[i])[method]();
                this.element.css(prop, value + add);                
            } else
                this.element.css(prop, val);

            if (prop == "height" && !this._vertical) {
                this.element.css("min-height", "").find("div.e-btn-content").removeClass("e-groupBtn-padding");
                this.element.find('.e-grp-btn-item').css("height", "").find("div.e-btn-content").css("margin-top", "").find(".e-btntxt").css("line-height", "");
                if (prop == "height" && parseInt(this.element.height()) < minHeight) {
                    this.element.addClass("e-groupbutton-hSmall").find("div.e-btn-content").addClass("e-groupBtn-padding");
                }
                else if (parseInt(this.element.height()) < defaultHeight)
                    this.element.find("div.e-btn-content").addClass("e-groupBtn-padding");
                else
                    this.element.removeClass("e-groupbutton-hSmall").find("div.e-btn-content").removeClass("e-groupBtn-padding");
            }
            else if (prop == "height") {
                this.element.css("min-height", "").find("div.e-btn-content").removeClass("e-groupBtn-padding");
                this.element.find('.e-grp-btn-item').css("height", "").find("div.e-btn-content").css("margin-top", "").find(".e-btntxt").css("line-height", "");
                var tempHeight = this.element.height() / this.items.length; /* tempHeight- the individual height of the groupButton content for min-height */
                if (tempHeight < minHeight) { 
                    this.element.css("min-height", (this.items.length * minHeight)).find("div.e-btn-content").addClass("e-groupBtn-padding");
                    this.element.find('.e-grp-btn-item').css({
                        'height': Math.ceil(this.element.height() / this.items.length),
                    });
                    
                }
                else {
                    var btnContentHeight = (this.element.height() / this.items.length); /* btnContentHeight- the individual height of the groupButton content without min-height */
                    var tempPadding = (btnContentHeight - this.element.find("div.e-btn-content").outerHeight()) / 2;
                    this.element.find('.e-grp-btn-item').css({
                        'height': btnContentHeight,
                    }).find("div.e-btn-content").css("margin-top", tempPadding + "px").find(".e-btntxt").css("line-height", this.element.find("div.e-btn-content").height() + "px");
                }
            }
        },

        _setRTL: function (val) {
            (val) ? this.element.addClass('e-rtl') : this.element.removeClass('e-rtl');
        },

        _setControlStatus: function (val) {
            (val) ? this.enable() : this.disable();
        },

        _setSkin: function (val) {
            (this.model.cssClass != val) ? this.element.removeClass(this.model.cssClass).addClass(val) : this.element.addClass(val);
        },

        _setOrientation: function (val) {
            (val != ej.Orientation.Vertical) ? this.itemsContainer.removeClass("e-vertical").addClass("e-horizontal") && (this._vertical = false) : this.itemsContainer.removeClass("e-horizontal").addClass("e-vertical") && (this._vertical = true);
        },

        _setRoundedCorner: function (val) {
            (val) ? this.element.addClass('e-corner') : this.element.removeClass('e-corner');
        },

        _updateCss: function() {
            this.items.filter('.last').removeClass('last');
            this.items.filter('.e-grp-btn-item:visible:not(.e-hidden)').last().addClass('last');
            (this.items.filter('.e-hidden').length == this.items.length) ? this.element.addClass('e-no-border') : this.element.removeClass('e-no-border');
        },

        _selectDeselect: function(ele, e) {
            if (this.isSelected(ele)) {
                if (this.model.groupButtonMode == "checkbox") {
                    this._removeSelection(ele);
                    this._focusedItem = null;
                }
            } else {
                this._focusedItem = ele;
                this._setSeletedItem(ele, e);
            }
        },

        _getVisibleItems: function() {
            return this.items.filter('.e-grp-btn-item:visible:not(.e-hidden, .e-disable)');
        },

        _getNodeByID: function (node) {
            (typeof node == "number") ? (node = this.items[node]) : (typeof node != "object" && node != "") && (node = this.itemsContainer.find(".e-grp-btn-item#" + node));
            node = $(node), node = $(node[0]);
            return node;
        },

        _addSelectedIndex: function (item) {
            var index = this.model.selectedItemIndex;
            this._removeNullInArray(index);
            !index instanceof Array && (index = []);
            if (index.indexOf(item) == -1) index.push(item);
        },

        _removeSelectedIndex: function (item) {
            var index = this.model.selectedItemIndex;
            !index instanceof Array && (index = []);
            var i = index.indexOf(item);
            if (i != -1) {
                index.splice(i, 1);
                index.length == 0 && (index.push(-1));
            }
        },

        _removeNullInArray: function (array) {
            var i = array.indexOf(-1);
            if (i != -1) array.splice(i, 1);
        },

        _onKeyPress: function(e) {
            var code, items, active, toFocus;
            code = (e.keyCode) ? e.keyCode : (e.which) ? e.which : e.charCode;
            items = this._getVisibleItems();
            if (this._focusedItem) {
                active = this._focusedItem;
                this._focusedItem = null;
            } else
                active = items.filter('.e-hover');
            if(e.type == 'keydown') {
                if(((code == 38 || code == 39) && this.model.orientation != ej.Orientation.Vertical) || ((code == 39 || code == 40) && this.model.orientation == ej.Orientation.Vertical)) {
                    e.preventDefault();
                    toFocus = $(items[items.index(active) + 1]).length > 0 ? $(items[items.index(active) + 1]) : items.first();
                } else if(((code == 37 || code == 40) && this.model.orientation != ej.Orientation.Vertical) || ((code == 37 || code == 38) && this.model.orientation == ej.Orientation.Vertical)) {
                    e.preventDefault();
                    toFocus = $(items[items.index(active) - 1]).length > 0 ? $(items[items.index(active) - 1]) : items.last();
                } else if(code == 36) {
                    e.preventDefault();
                    toFocus = items.first();
                } else if(code == 35) {
                    e.preventDefault();
                    toFocus = items.last();
                } else if(code == 32) {
                    e.preventDefault();
                }
                if(toFocus) {
                    var args = this._getDetails(toFocus); args['element'] = toFocus; args['event'] = e;
                    if(this._triggerEvent("keyPress", args)) return;
                    toFocus.addClass("e-hover").siblings('.e-hover').removeClass('e-hover');
                }
            } else {
                switch(code) {
                    case 35: case 36: case 37: case 38: case 39: case 40: break;
                    case 13: case 32:
                        e.preventDefault();
                        this._selectDeselect(active, e);
                        break;
                    case 27:
                        e.preventDefault();
                        this.element.blur();
                        break;
                }
            }
        },

        _onfocusIn: function(e) {
            this.element.addClass("e-focus");
            (!this._clicked) && this._getVisibleItems().first().addClass("e-hover").siblings('.e-hover').removeClass('e-hover');
            this._on(this.element, "keyup keydown", this._onKeyPress);
        },

        _onfocusOut: function(e) {
            this.element.removeClass("e-focus").find('.e-grp-btn-item.e-hover').removeClass('e-hover');
            this._off(this.element, "keyup keydown", this._onKeyPress);
        },

        _onBtnHover: function (e) {
            var currentItem = $(e.currentTarget);
            (!currentItem.hasClass("e-disable")) && currentItem.addClass("e-hover");
        },

        _onBtnLeave: function (e) {
            var currentItem = $(e.currentTarget);
            (!currentItem.hasClass("e-disable")) && currentItem.removeClass("e-hover");
        },

        _onBtnClick: function (e) {
            var ele = $(e.currentTarget);
            if (!ele.hasClass("e-disable")) {
                this._selectDeselect(ele, e);
            }
        },

        _onMouseDown: function (e) {
            this._clicked = true;
        },

        _triggerEvent: function (e, data) {
            if (this._isRender) return this._trigger(e, data);
        },

        _wireUnwireEvents: function (onOff) {
            this[onOff](this.element, "mousedown", this._onMouseDown)
                [onOff](this.element, "focus", this._onfocusIn)
                [onOff](this.element, "blur", this._onfocusOut);
            this[onOff](this.items, "click", this._onBtnClick)
            if (!ej.isTouchDevice()) {
                this[onOff](this.items, "mouseenter", this._onBtnHover);
                this[onOff](this.items, "mouseleave", this._onBtnLeave);
            }
        },

        isSelected: function(element) {
            element = this._getNodeByID(element);
            if(element[0] != null && element.hasClass('e-grp-btn-item'))
                return element.hasClass('e-active');
        },

        isDisabled: function(element) {
            element = this._getNodeByID(element);
            if(element[0] != null && element.hasClass('e-grp-btn-item'))
                return element.attr('aria-disabled') == "true" ? true : false;
        },

        disable: function () {
            this.element.addClass("e-disable").attr("aria-disabled", true);
            this.items.addClass("e-disable").attr("aria-disabled", true);
            this.model.enabled = false;
            this._wireUnwireEvents("_off");
        },

        enable: function () {
            this.element.removeClass("e-disable").attr("aria-disabled", false);
            this.items.removeClass("e-disable").attr("aria-disabled", false);
            this.model.enabled = true;
            this._wireUnwireEvents("_on");
        },

        show: function () {
            this.element.removeClass('e-hidden');
        },

        hide: function () {
            this.element.addClass('e-hidden');
        },

        getSelectedItem: function() {
            return this.element.find('.e-grp-btn-item.e-active');
        },

        getIndex: function(element) {
            element = this._getNodeByID(element);
            if(element[0] != null && element.hasClass('e-grp-btn-item'))
                return this.items.index(element);
        },

        enableItem: function (element) {
            element = this._getNodeByID(element);
            if(element[0] != null && element.hasClass('e-grp-btn-item')) {
                element.removeClass('e-disable').attr("aria-disabled", false);
                element.next('.e-grp-btn-item').removeClass('e-border-left e-border-bottom');
            }
        },

        disableItem: function (element) {
            element = this._getNodeByID(element);
            if (element[0] != null && element.hasClass('e-grp-btn-item') && !element.hasClass('e-disable')) {
                element.addClass('e-disable').attr("aria-disabled", true);
                if(this.model.orientation == ej.Orientation.Horizontal) {
                    this._setDimension("width", this.model.width);
                    element.next('.e-grp-btn-item').addClass('e-border-left');
                } else {
                    element.next('.e-grp-btn-item').addClass('e-border-bottom');
                    this._setDimension("height", this.model.height);
                }
            }
        },

        selectItem: function (element) {
            element = this._getNodeByID(element);
            if(element[0] != null && element.hasClass('e-grp-btn-item'))
                this._setSeletedItem(element);
        },

        deselectItem: function (element) {
            element = this._getNodeByID(element);
            if(element[0] != null && element.hasClass('e-grp-btn-item'))
                this._removeSelection(element);
        },

        showItem: function(element) {
            element = this._getNodeByID(element);
            if(element[0] != null && element.hasClass('e-grp-btn-item')) {
                element.removeClass('e-hidden');
                this._updateCss();
            }
        },

        hideItem: function(element) {
            element = this._getNodeByID(element);
            if(element[0] != null && element.hasClass('e-grp-btn-item')) {
                element.addClass('e-hidden');
                this._updateCss();
            }
        }

    });

    ej.ButtonSize = {
		Normal : "normal",
		Mini: "mini", 
		Small: "small",
		Medium:"medium", 
        Large: "large"
    };

    ej.GroupButtonMode = {
        CheckBox : "checkbox",
        RadioButton : "radiobutton"
    };

    ej.ContentType = {
        /**  Supports only for text content only */
        TextOnly: "textonly", 
        /** Supports only for image content only */
        ImageOnly: "imageonly", 
        /** Supports image for both ends of the button */
        ImageBoth: "imageboth", 
        /** Supports image with the text content */
        TextAndImage: "textandimage", 
        /** Supports image with both ends of the text */
        ImageTextImage: "imagetextimage"
    };


    ej.ImagePosition = {
        /**  support for aligning text in left and image in right. */
        ImageRight: "imageright", 
        /**  support for aligning text in right and image in left. */
        ImageLeft: "imageleft",
        /**  support for aligning text in bottom and image in top. */
        ImageTop: "imagetop", 
        /**  support for aligning text in top and image in bottom. */
        ImageBottom: "imagebottom"
    };
})(jQuery, Syncfusion);
