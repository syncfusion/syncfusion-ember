/**
* @fileOverview Plugin to style the tagCloud control.
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) { 
    ej.widget("ejTagCloud", "ej.TagCloud", {
        
        element: null,
        
        model: null,
        validTags: ["div", "span"],
        _rootCSS: "e-tagcloud",
        _setFirst: false,
        
        defaults: {
            
            cssClass : "",
			
            htmlAttributes : {},
            
            dataSource: null,
            
            query: null,
            
            fields:  { 
				
			    text: "text", 
				
			    url: "url", 
				
			    frequency: "frequency",
                
			    htmlAttributes: "htmlAttributes"
			},
            
            showTitle: true,
            
            titleText: "Title",
            
            titleImage: null,
            
            format: "cloud",
            
            enableRTL: false,
            
            minFontSize: "10px",
            
            maxFontSize: "40px",
                        
            mouseover: null,
            
            mouseout: null,
            
            click: null,
            
            create: null,
            
            destroy: null
        },
        
        dataTypes: {
            cssClass : "string",
            showTitle: "boolean",
            titleText: "string",
            titleImage: "string",
            format: "enum",
            enableRTL: "boolean",
            dataSource: "data",
            query: "data",
            fields: "data",
            htmlAttributes: "data"
        },

        
        
        _init: function () {
            this._initialize();
            this._render();
        },
        
        _setModel: function (options) {
            var option;
            for (option in options) {
                switch (option) {
                    case "fields":
                    case "query":
                    case "dataSource":
                    case "minFontSize":
                    case "maxFontSize":
                        this._refreshTagItems(option, options[option]); break;
                    case "showTitle": this._showTitle(options[option]); break;
                    case "titleText": this._title(options[option]); break;
                    case "titleImage": this._titleImage(options[option]); break;
                    case "cssClass": this._changeSkin(options[option]); break;
                    case "format": this._format(options[option]); break;
                    case "enableRTL": this._rtl(options[option]); break;
                    case "htmlAttributes": this._addAttr(options[option]); break;
                }
            }
        },

        _refreshTagItems: function (key, value) {
            this.model[key] = value;
            this.ul.empty();
            this._checkDataBinding();
        },
        
        _showTitle: function (boolean) {
            if (boolean) {
                this._generateTitle();
                this.ul.removeClass("e-notitle");
            }
            else {
                this.titleText.remove();
                this.ul.addClass("e-notitle");
                this.titleText = null;
            }
        },
        
        _title: function (text) {
            if (this.titleText) {
                if (text) {
                    if (this.text) this.text.html(text);
                    else this._generateTextTag(text);
                }
                else if (this.text) {
                    this.text.remove();
                    this.text = null;
                }
            }
        },
        
        _titleImage: function (imagePath) {
            if (this.titleText) {
                if (imagePath) {
                    if (this.image) this.image.attr("src", imagePath);
                    else this._generateImageTag(imagePath);
                }
                else if (this.image) {
                    this.image.remove();
                    this.image = null;
                }
            }
        },
        
        _changeSkin: function (skin) {
            if (this.model.cssClass != skin) {
                this.element.removeClass(this.model.cssClass).addClass(skin);
            }
        },
        
        insert: function (tag) {
            if ($.trim(tag.text)) {
                this.ul.append(this._generateLi(tag, this._getMapper()));
            }
        },
        
        insertAt: function (tag, position) {
            if ($.trim(tag.text)) {
                $(this.ul.children()[position - 1]).before(this._generateLi(tag, this._getMapper()));
            }
        },
        
        remove: function (txt) {
            var li = this.ul.children(), liTag, i;
            for (i = 0; i < li.length; i++) {
                liTag = $(li[i]);
                if (liTag.children()[0].innerHTML == txt)
                    liTag.remove();
            }
        },
        
        removeAt: function (position) {
            var li = this.ul.children();
            $(li[position - 1]).remove();
        },
        
        _format: function (format) {
            if (format == "cloud") {
                this.ul.removeClass("e-list");
                this.ul.addClass("e-cloud");
            }
            else if (format == "list") {
                this.ul.removeClass("e-cloud");
                this.ul.addClass("e-list");
            }
        },
        
        _destroy: function () {
            this.element.removeClass("e-widget " + this.model.cssClass);
            this.element.empty();
        },
        
        _initialize: function () {
            this.minFreq = 0;
            this.maxFreq = 30;
            this.ul = null;
            this.titleText = null;
            this.image = null;
            this.text = null;
        },
        
        _render: function () {
            this.element.addClass("e-widget " + this.model.cssClass);
            if (this.model.showTitle) this._generateTitle();
            this._renderWrapper();
            this._checkDataBinding();
			this._addAttr(this.model.htmlAttributes);
            this._checkProperties();
        },
        
        _generateTitle: function () {
            this.titleText = ej.buildTag("div.e-header e-title");
            if (this.model.titleImage)
                this._generateImageTag(this.model.titleImage);
            if (this.model.titleText)
                this._generateTextTag(this.model.titleText);
            if (this.ul) this.titleText.insertBefore(this.ul);
            else this.element.append(this.titleText);
        },
        
        _generateImageTag: function (titleImage) {	
			if(!this.image)
				this.image = $('<img class="e-title-img" src="' + titleImage + '" />');
			if(this.text && !this.model.titleImage) this.image.insertBefore(this.text);			
			else this.titleText.append(this.image);
        },		
        
        _generateTextTag: function (titleText) { 
			if(!this.text) this.text = ej.buildTag("span", titleText);					
			this.titleText.append(this.text);
        },		
        
        _renderWrapper: function () {
            var format;
            format = (this.model.format == "list") ? "list" : "cloud";
            this.ul = ej.buildTag("ul.e-ul e-box e-" + format);
            this.element.append(this.ul);
            if (!this.model.showTitle) this.ul.addClass("e-notitle");
        },
        
        _renderItems: function (list) {
            this._generateTagItems(list);
            this.ul.removeClass("e-load");
        },
		_addAttr: function (htmlAttr) {
			var proxy = this;
			$.map(htmlAttr, function(value, key) {
				if (key == "class") proxy.element.addClass(value);
				else proxy.element.attr(key,value)
			});
		},

        _checkProperties: function () {
            if (this.model.enableRTL) this._rtl(this.model.enableRTL);
        },
        
        _rtl: function (boolean) {
            if (boolean) this.element.addClass("e-rtl");
            else this.element.removeClass("e-rtl");
        },
        
        _checkDataBinding: function () {
            var source = this.model.dataSource;
            if (source != null) {
                this.ul.addClass("e-load");
                if (ej.DataManager && source instanceof ej.DataManager)
                    this._initDataSource(source);
                else
                    this._renderItems(source);
            }
        },
        
        _initDataSource: function (source) {
            var proxy = this;
            var queryPromise = source.executeQuery(this._getQuery());
            queryPromise.done(function (e) {
                proxy._renderItems(e.result);
            }).fail(function (e) {
                proxy.ul.removeClass("e-load");
            });
        },
        
        _setAttributes: function (data, element) {
            if (data) {
                for (var key in data)
                    if (key == "class")
                        element.addClass(data[key]);
                    else
                        element.attr(key, (key == "style" ? element.attr("style") + ";" : "") + data[key]);
            }
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

        _generateTagItems: function (list) {
            var i, mapField = this._getMapper(), callback = function (o) { return o[mapField._freq]; };
            var mappedArray = list.map ? list.map(callback) : $.map(list, callback);
            this.minFreq = Math.min.apply(Math, mappedArray);
            this.maxFreq = Math.max.apply(Math, mappedArray);

            for (i = 0; i < list.length; i++) {
                this.ul.append(this._generateLi(list[i], mapField));
            }
        },
        
        _getMapper: function () {
            var mapper = this.model.fields, mapFld = { _text: null, _freq: null, _url: null };
            mapFld._text = (mapper && mapper.text) ? mapper["text"] : "text";
            mapFld._freq = (mapper && mapper.frequency) ? mapper["frequency"] : "frequency";
            mapFld._url = (mapper && mapper.url) ? mapper["url"] : "url";
            mapFld._attr = (mapper && mapper.htmlAttributes) ? mapper["htmlAttributes"] : "htmlAttributes";
            return mapFld;
        },
        
        _generateLi: function (list, map) {
            var li = ej.buildTag("li.e-tagitems"), aTag;
            aTag = ej.buildTag("a.e-txt", list[map._text] || list[map._url],
                    { "font-size": this._calculateFontSize(list[map._freq]) },
                    { role: "link" });
            if (list[map._url]) aTag.attr({ "href": list[map._url], "target": "blank" });
            this._setAttributes((list[map._attr]), aTag);
            li.append(aTag);
            this._on(aTag, "mouseenter", this._mouseEnter);
            this._on(aTag, "mouseleave", this._mouseLeave);
            this._on(aTag, "click", this._mouseClick);
            return li;
        },

        
        _mouseEnter: function (e) {
            $(e.target).addClass("hover");
            this._raiseEvent(e, "mouseover");
        },
        
        _mouseLeave: function (e) {
            $(e.target).removeClass("hover");
            this._raiseEvent(e, "mouseout");
        },
        
        _mouseClick: function (e) {
            $(e.target).removeClass("hover");
            this._raiseEvent(e, "click");
        },

        _raiseEvent: function (e, _type) {
            this._trigger(_type, { value: $(e.target).html(), url: $(e.target).attr('href'), eventType: _type, target: $(e.target) });
        },
        
        _calculateFontSize: function (frequency) {
            if (frequency) {
                var C = 2, k, fontRange, fontSize,
                minSize = parseInt(this.model.minFontSize, 10), maxSize = parseInt(this.model.maxFontSize, 10);
                k = (frequency - this.minFreq) / (this.maxFreq - this.minFreq);
                fontRange = maxSize - minSize;
                fontSize = minSize + (C * Math.floor(k * (fontRange / C)));
                return fontSize;
            }
            else return this.model.minFontSize;
        }
    });
    
    ej.Format = {
        /**  Render the tagCloud items in cloud format */
        Cloud: "cloud",
        /**  Render the tagCloud items in list format */
        List: "list"
    };
})(jQuery, Syncfusion);