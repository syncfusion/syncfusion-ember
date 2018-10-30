/**
* @fileOverview Plugin to style the Html Div elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejSplitter", "ej.Splitter", {

        element: null,

        model: null,
        validTags: ["div", "span"],
        _rootCSS: "e-splitter",
        _setFirst: false,
        angular: {
            terminal: false
        },

        defaults: {

            cssClass: "",

            orientation: "horizontal",

            enableAnimation: true,

            properties: [],

            height: null,

            width: null,

            // EnableAutoResize is a deprecated API, we can achieve this requirement by isResponsive property
            enableAutoResize: false,

            isResponsive: false,

            enableRTL: false,
			
			allowKeyboardNavigation: true,

            htmlAttributes: {},

            expanderTemplate: null,

            animationSpeed: 300,

            beforeExpandCollapse: null,
			
			clickOnExpander: null,

            expandCollapse: null,

            resize: null,

            create: null,

            destroy: null
        },

        dataTypes: {
            cssClass: "string",
            orientation: "enum",
            properties: "data",
            enableAutoResize: "boolean",
            expanderTemplate: "string",
            isResponsive: "boolean",
            enableRTL: "boolean",
			allowKeyboardNavigation: "boolean",
            animationSpeed: "number",
            enableAnimation: "boolean",
            htmlAttributes: "data",
        },


        _init: function () {
            this._initialize();
            this._render();
            if (this.model.isResponsive || this.model.enableAutoResize)
                this._wireEvents(true);
            else
                this._wireEvents(false);
        },

        _setModel: function (options) {
            var option;
            for (option in options) {
                switch (option) {
                    case "cssClass": this._changeSkin(options[option]); break;
                    case "enableAutoResize": this._windowResizing(options[option]); break;
                    case "isResponsive": this._windowResizing(options[option]); break;
                    case "enableRTL": this._rtl(options[option]); break;
                    case "htmlAttributes": this._addAttr(options[option]); break;
                    case "orientation": this._refreshSplitter("orientation", options[option]); break;
                    case "properties": this._refreshSplitter("properties", options[option]); break;
                    case "width": this.model.width = options[option]; this._setHeightWidth(); break;
                    case "height": this.model.height = options[option]; this._setHeightWidth(); break;
                }
            }
        },

        refresh: function () {
            this._setPanesSize();
            this._getPanesPercent();
        },

        collapse: function (paneIndex) {
            this._clickArrow(paneIndex, true, true);
        },

        expand: function (paneIndex) {
            this._clickArrow(paneIndex, false, true);
        },

        _clickArrow: function (index, bool, canClick) {
            if (this._inMovement || index < 0 || index > this.panes.length || this.panes.length <= 1) return false;
            var arrow, cls = bool ? "e-collapse" : "e-expand", splitbars = this.element.children(".e-splitbar:not(.e-shadowbar)");
            if(ej.isNullOrUndefined(this.model.expanderTemplate)){
			if (index == splitbars.length) arrow = this._clickArrow(index - 1, !bool, false);
            else arrow = $(splitbars[index]).children("." + cls);
			}
			else{
			arrow = $(splitbars[index]).children(".e-splitter-"+this.model.orientation.substr(0, 1)+"-template");
			if(bool)
			this._collapseArrowClick(this.templateargs);
			else
			this._expandArrowClick(this.templateargs);
			}
			if(!ej.isNullOrUndefined(this.model.expanderTemplate)) this._templateIconPositioning(true);
            if (canClick) (arrow.css("display") != "none" || !ej.isNullOrUndefined(this.model.expanderTemplate)) && arrow.mouseup();
            else return arrow;
        },


        addItem: function (content, property, index) {
            var paneCount = this.panes.length;
            index = this._getNumber(index);
			 var totalSize = this.element[this.containerCss]();
            if (ej.isNullOrUndefined(index)) index = paneCount;
            if (index < 0 || index > paneCount) return "";
            var property = this._getPaneProperty(property), paneDiv, paneDivSize, requiredSize;
            property = this._checkMinMaxSize(property);
            paneDiv = ej.buildTag("div.e-pane e-" + this.model.orientation.substr(0, 1) + "-pane");
            this.element.append(paneDiv[this.containerCss](property.paneSize));
            paneDivSize = property.paneSize = paneDiv[this.containerCss]();
			 if(paneCount==0) this.panes.push(paneDiv);	
            paneDiv.remove();
            var start = index, end = (paneCount>0)?paneCount:this.panes.length, i, j, insert, before, direction = 2, getters = {}, taken = 0, canInsert = false;
            requiredSize = paneDivSize + this._bar;

            for (j = 0; j < direction; j++) {
                for (i = start; i < end; i++) {
                    var _paneSize = $(this.panes[i])[this.containerCss]();
					 var minSize=(!ej.isNullOrUndefined(this.model.properties[i]))?(this.model.properties[i].minSize): property.minSize;
                    var availableSpace = _paneSize - minSize;
                    if (availableSpace >= requiredSize - taken) {
                        getters[i] = _paneSize - (requiredSize - taken);
                        canInsert = true;
                        break;
                    }
					else if((paneCount==0)&&(availableSpace>=0)){
						  getters[i] = minSize;
                        taken += availableSpace;
						canInsert=true;
					}
                    else if (availableSpace > 0) {
                        getters[i] = minSize;
                        taken += availableSpace;
                    }
                }
                if (canInsert) break;
                else end = start, start = 0;
            }
            if (!canInsert) return "";
            for (var pos in getters)
                $(this.panes[pos])[this.containerCss](getters[pos]);
			if(paneCount<=0) paneDiv.append($(this.panes[index]));
			else{
            if (index == paneCount) {
                insert = "insertBefore", before = 1;
                paneDiv.insertAfter($(this.panes[index - 1]));
            }
            else {
                insert = "insertAfter", before = 0;
                paneDiv.insertBefore($(this.panes[index]));
            }
			 }
            this.model.properties.splice(index, 0, property);
			 if(paneCount==0)this.element.append(paneDiv[this.containerCss](totalSize));			
			 if(paneCount>0){
            this.panes.splice(index, 0, paneDiv);
            var splitBar = this._createSplitBar(index - before);
            splitBar[insert](paneDiv);
			 }
            paneDiv.append(content);
            this._updateModel();
            return paneDiv;
        },


        removeItem: function (index) {
            var paneCount = this.panes.length - 1;
            index = this._getNumber(index);
            if (ej.isNullOrUndefined(index)) index = paneCount;
            if (index < 0 || index > paneCount || paneCount < 0) return null;
            var targetPane, nextPane, splitbars, removedSize;
            targetPane = $(this.panes[index]);
            removedSize = targetPane[this.containerCss]() + this._bar;
            targetPane.remove();
            splitbars = this.element.children(".e-splitbar:not(.e-shadowbar)");
            if (index == paneCount) {
                nextPane = $(this.panes[index - 1]);
                $(splitbars[index - 1]).remove();
            }
            else {
                nextPane = $(this.panes[index + 1]);
                $(splitbars[index]).remove();
            }
            nextPane[this.containerCss](nextPane[this.containerCss]() + removedSize);
            this._removeArrays(index);
            this._updateModel();
        },
        _checkMinMaxSize: function (property) {
            if ((!ej.isNullOrUndefined(property.minSize))&&(property.paneSize < property.minSize))
                property.paneSize = property.minSize;
            if ((!ej.isNullOrUndefined(property.maxSize))&&(property.paneSize > property.maxSize))
                property.paneSize = property.maxSize;
            return property;
        },

        _removeArrays: function (index) {
            this.model.properties.splice(index, 1);
            this.panes.splice(index, 1);
            this.oldPaneSize.splice(index, 1);
            this.oldPanePercent.splice(index, 1);
            this._sizePercent.splice(index, 1);
        },

        _getNumber: function (value) {
            value = parseFloat(value);
            return isNaN(value) ? null : value;
        },

        _updateModel: function () {
            for (var i = 0; i < this.panes.length; i++)
                this.model.properties[i].paneSize = $(this.panes[i])[this.containerCss]();
            this._getPanesPercent();
        },

        _getPaneProperty: function (property) {
            var _default = { paneSize: 10, minSize: 10, maxSize: null, collapsible: true, resizable: true, expandable: true };
            return $.extend(_default, property);
        },

        _changeSkin: function (skin) {
            this.element.removeClass(this.model.cssClass).addClass(skin);
        },

        _windowResizing: function (boolean) {
            if (boolean) this._wireEvents(boolean);
            else this._unWireEvents();
        },

        _refreshSplitter:function(key,value){
            this._unWireEvents();
            this._refreshDestroy();
            this.model[key] = value;
            this._init();
        },

		_destroy: function() {
			this.element.removeClass("e-splitter");
			this._refreshDestroy();
			this._unWireEvents();
		},

        _refreshDestroy: function () {
            this.element.removeClass("e-widget e-box e-rtl" + this.model.cssClass + " e-" + this.model.orientation);
            this.element.children(".e-splitbar").remove();
            this.element.children(".e-pane").removeClass("e-pane e-" + this.model.orientation.substr(0, 1) + "-pane").height("").width("");
        },

        _initialize: function () {
            this.panes = [];
            this.oldPaneSize = [];
            this.oldPanePercent = [];
            this._initialPropertiesValue = [];
            this._updateHeightWidth = false;
            this.shadowBar = null;
            this._inMovement = false;
            this.containerCss = this.model.orientation == "horizontal" ? "width" : "height";
            this.displayCss = this.model.orientation == "horizontal" ? "left" : "top";
            this.borderCss = this.model.orientation == "horizontal" ? "right" : "bottom";
            this._bar = 9;      // For the center splitbar size
        },

        _render: function () {
            this.element.addClass("e-widget e-box " + this.model.cssClass + " e-" + this.model.orientation).attr("data-role", "splitter");
            var i, j, target = this.element[0];
            for (i = 0, j = 0; i < target.children.length; i++) {
                $(target.children[i]).addClass("e-pane");
                this.panes.push(target.children[i]);
            }
            this._setPanesProperty();
            this._insertSplitBar();
            this._setDimentions();
			if (!ej.isNullOrUndefined(this.model.expanderTemplate))
			    this.element.find(".e-splitter-" + this.model.orientation.substr(0, 1) +"-template").css("z-index",ej.getMaxZindex()+1);
            this._setPanesSize();
            this._getPanesPercent();
            this._addAttr(this.model.htmlAttributes);
            this._checkProperties();
            this.element.find(".e-pane").addClass("e-" + this.model.orientation.substr(0, 1) + "-pane");
			if(this.model.isResponsive){
				if (isNaN(this.model.height) && (this.model.height.indexOf("%") > 0))
					this.element.css("height",this.model.height);
				if (isNaN(this.model.width) && (this.model.width.indexOf("%") > 0))
					this.element.css("width",this.model.width );
			}
        },
		_templateClick:function(event){
			var args = this.templateargs={
					cancel: false,
					targetElement: $(event.target),
					event: event.type,
					model: this.model,
					currentTarget: $(event.currentTarget)
				}
			this._trigger("clickOnExpander", args);
		},
		_templateIconPositioning:function(bool){
			var proxy = this;
			if(ej.browserInfo().name=="webkit" && bool){
		        proxy.element.find(".e-splitter-" + proxy.model.orientation.substr(0, 1) + "-template").css("display", "none")
		        setTimeout(function (e) {
		            proxy.element.find(".e-splitter-" + proxy.model.orientation.substr(0, 1) + "-template").css("display", "block");
		        }, proxy._isMouseMove ? 10 : proxy.model.animationSpeed);
		        proxy._isMouseMove = false;
		    }
		    if (!bool)
		        setTimeout(function (e) {
				proxy.element.find(".e-splitter-" + proxy.model.orientation.substr(0, 1) +"-template").css("display", "inline-block");
			}, 100);
		},
        _setPanesProperty: function () {
            for (var p = 0; p < this.panes.length; p++) {
                if (this.model.properties[p] != undefined) {
                    this.model.properties[p].paneSize = this.model.properties[p].paneSize == undefined ? "0px" : this.model.properties[p].paneSize;
                    this.model.properties[p].minSize = isNaN(parseFloat(this.model.properties[p].minSize)) ? 10 : parseFloat(this.model.properties[p].minSize);
                    this.model.properties[p].maxSize = isNaN(parseFloat(this.model.properties[p].maxSize)) ? null : parseFloat(this.model.properties[p].maxSize);
                    this.model.properties[p].collapsible = this.model.properties[p].collapsible != false ? true : false;
                    this.model.properties[p].resizable = this.model.properties[p].resizable != false ? true : false;
                    this.model.properties[p].expandable = this.model.properties[p].expandable != false ? true : false;
                }
                else this.model.properties.push({ paneSize: "0px", minSize: 10, maxSize: null, collapsible: true, resizable: true, expandable: true });
                this._initialPropertiesValue[p] = this.model.properties[p].paneSize;
            }
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.element.addClass(value);
                else proxy.element.attr(key, value)
            });
        },


        _insertSplitBar: function () {
            if (this.panes.length > 1) {
                var i, splitBar;
                for (i = 0; i < this.panes.length - 1; i++) {
                    splitBar = this._createSplitBar(i);
                    splitBar.insertAfter(this.panes[i]);
                }
            }
        },

        _createSplitBar: function (i) {
            var orient = this.model.orientation.substr(0, 1), arrow1, arrow2, arrow3, splitBar, accessible = false;
            splitBar = ej.buildTag("span.e-box e-splitbar e-split-divider e-" + orient + "-bar").attr("aria-expanded", true);
            ej.browserInfo().name == "msie" && splitBar.addClass("e-pinch");
			 if (!ej.isNullOrUndefined(this.model.expanderTemplate)) {
                var splitter = document.getElementsByClassName("e-split-divider")[0], splitterSpan = document.createElement("span");
                $(splitterSpan).append(this.model.expanderTemplate);
                $(splitterSpan).attr("class", "e-splitter-" + this.model.orientation.substr(0, 1) + "-template e-resize");
				$(splitterSpan).on( (ej.isTouchDevice())? 'tap' : 'click' , $.proxy(this._templateClick, this));
				splitBar.append(splitterSpan);
				this._templateIconPositioning(false);
            }
			else{
            arrow1 = ej.buildTag("span.e-icon e-collapse e-" + orient + "-arrow " + ((orient == "h") ? "e-arrow-sans-left" :"e-arrow-sans-up"));
            splitBar.append(arrow1);
            arrow3 = ej.buildTag("span.e-activebar e-" + orient + "-arrow ");
            splitBar.append(arrow3);
            arrow2 = ej.buildTag("span.e-icon e-expand e-" + orient + "-arrow " + ((orient == "h") ? "e-arrow-sans-right" :"e-arrow-sans-down"));
            splitBar.append(arrow2);
            accessible = true;
            this._on(arrow1, "mouseup", this._collapseArrowClick);
            this._on(arrow2, "mouseup", this._expandArrowClick);
            if (!this.model.properties[i].collapsible)
                arrow1.css("display", "none");
		   if(!this.model.properties[i].expandable)
			   arrow2.css("display", "none");
            if (this.model.properties[i + 1].collapsible)
                arrow2.css("display", "block");
		   }
            if (this.model.properties[i].resizable && this.model.properties[i + 1].resizable) {
                splitBar.addClass("e-resize").removeClass("e-icon-hide");
                accessible = true;
                this._on(splitBar, ej.eventType.mouseDown, this._mouseDownOnDivider);
                if (ej.isNullOrUndefined(this.model.expanderTemplate)) this._on(arrow3, ej.eventType.mouseDown, this._mouseDownOnDivider);
            }
            if (accessible) {
                splitBar.attr({ "role": "separator", "tabindex": "0" });
                this._on(splitBar, "focus focusout", this._focusOnDivider);
            }
            else splitBar.attr({ "role": "presentation" });
            return splitBar;
        },
        _getTemplatedString: function (list) {
            var str = this.model.expanderTemplate, start = str.indexOf("${"), end = str.indexOf("}");
            while (start != -1 && end != -1) {
                var content = str.substring(start, end + 1);
            }
            return content;
        },
        _getPanesPercent: function () {
            this._sizePercent = [];
            var size = this.element[this.containerCss](), outerSize = size - ((this.panes.length - 1) * this._bar), i;
            for (i = 0; i < this.panes.length; i++) {
                if (!$(this.panes[i]).hasClass("collapsed"))
                    this.oldPaneSize[i] = $(this.panes[i])[this.containerCss]();
                this.oldPanePercent[i] = this._convertToPercent(outerSize, this.oldPaneSize[i]);
                this._sizePercent.push(this._convertToPercent(outerSize, $(this.panes[i])[this.containerCss]()));
            }
        },

        _setDimentions: function () {
			var parentObj = this._getParentObj(),_width = parseInt(this.model.width), _height = parseInt(this.model.height);
			if (isNaN(this.model.width) && (this.model.width.indexOf("%") > 0))
                _width = (this.model.isResponsive) ? this._convertToPixel(parentObj.innerWidth(), _width):this.model.width;
            if (isNaN(this.model.height) && (this.model.height.indexOf("%") > 0))
                _height = (this.model.isResponsive) ? this._convertToPixel(parentObj.innerHeight(), _height):this.model.height;
            if (this.model.height)
                this.element.css("height",_height);
            if (this.model.width)
                this.element.css("width",_width );
        },

        _setHeightWidth: function () {
            this._updateHeightWidth = true;
   		    this._setDimentions();
            this._setPanesSize();
            this._getPanesPercent();
        },

         _getParentObj: function () {
            return this.element.parent();
        },
        _checkProperties: function () {
            if (this.model.enableRTL) this._rtl(this.model.enableRTL);
            this._prevSize = this.element[this.containerCss]();
        },
        _getExactInnerWidth: function () {
            var browser = ej.browserInfo(), exactInnerWidth;
            if (browser.name == "msie") {
                if (browser.version == 8 || browser.version == 9)
                    exactInnerWidth = $(this.element)[this.containerCss]();
                else
                    exactInnerWidth = parseFloat(window.getComputedStyle(this.element[0])[this.containerCss]);
            }
            else
                exactInnerWidth = parseFloat(window.getComputedStyle(this.element[0])[this.containerCss])
                                 - (parseFloat(this.element.css("border-" + this.displayCss + "-width")) +
                                     parseFloat(this.element.css("border-" + this.borderCss + "-width")) +
                                     parseFloat(this.element.css("padding-" + this.displayCss)) +
                                     parseFloat(this.element.css("padding-" + this.borderCss)));
            return exactInnerWidth;
        },

        _rtl: function (boolean) {
            if (boolean) this.element.addClass("e-rtl");
            else this.element.removeClass("e-rtl");
        },

        _setPanesSize: function () {
            var attr = this.containerCss,
            zeroPanes = 0,
            totalPaneSize = 0,
            totalSize = this.element[attr](),
            remainZero = false,
            bar = this._bar=($(this.element).find(">.e-splitbar").length>0)?parseFloat($(this.element).find(">.e-splitbar").css(attr)):this._bar,
            zerothPanes = [],
            panLength, j, paneCount = this.panes.length;

            if (paneCount > 1) {
                for (j = 0; j < paneCount ; j++) {
                    $(this.panes[j]).css(attr, (this._updateHeightWidth == true) ? this._initialPropertiesValue[j] : this.model.properties[j].paneSize);
                    this._updateHeightWidth = false;
                    bar = (j == paneCount - 1) ? 0 : bar;
                    panLength = parseFloat($(this.panes[j])[attr]());
                    if(!ej.isNullOrUndefined(this.model.properties[j].maxSize)) panLength = panLength > this.model.properties[j].maxSize ? this.model.properties[j].maxSize : panLength;
                    $(this.panes[j]).css(attr, panLength);
                    if (panLength <= 0) {
                        zeroPanes++;
                        zerothPanes.push(j);
                        totalPaneSize += bar;
                    }
                    else {
                        if (remainZero) {
                            $(this.panes[j]).css(attr, 0);
                            totalPaneSize += panLength + bar;
                            this.model.properties[j].paneSize = 0;
                        }
                        else {
                            totalPaneSize += panLength + bar;
                            if (totalPaneSize > totalSize) {
                                var currPane = totalPaneSize - totalSize + bar,
                                remainDivider = paneCount - j - 1;
                                currPane += remainDivider * bar;
                                $(this.panes[j]).css(attr, currPane);
                                remainZero = true;
                                totalPaneSize += currPane + bar;
                            }
                            this.model.properties[j].paneSize = panLength;
                        }
                    }
                }
            }
            else if (paneCount == 1) {
                $(this.panes[0]).css(attr, "100%");
                totalPaneSize = totalSize;
            }

            if (paneCount > 1 && totalPaneSize != totalSize) {
			     var remainingSize, lastPane = $(this.panes[paneCount - 1]);
                if (totalPaneSize > totalSize) {
                    remainingSize = totalPaneSize - totalSize;
                    lastPane.css(attr, remainingSize);
                }
                else if (totalPaneSize < totalSize) {
                    remainingSize = totalSize - totalPaneSize;
                    if (zeroPanes > 0) {
                        var z, avgWid = parseFloat(remainingSize / zeroPanes);
                        for (z = 0; z < zeroPanes ; z++) {
                            $(this.panes[zerothPanes[z]]).css(attr, avgWid);
                            this.model.properties[zerothPanes[z]].paneSize = avgWid;
                        }
                    }
                    else {
                        for(var i = paneCount; i > 0; i--){
                            if(ej.isNullOrUndefined(this.model.properties[i - 1].maxSize)){ lastPane = $(this.panes[i - 1]); break;	}
                        }
                        lastPane.css(attr, parseFloat(lastPane[attr]() + remainingSize));
                        this.model.properties[paneCount - 1].paneSize = lastPane[attr]();
                    }
                }
            }
            if (paneCount > 1) this._checkPaneSize();
        },

        _getUnit: function (str) {
            if (str == "px") return "px";
            else if (str == "pt") return "pt";
            else if (str.substr(1) == "%") return "%";
            else return "px";
        },

        _getNormalValue: function (position) {
            var currentLOB, currentLOBPercent, totalValue, currentValue;
            if (this.model.orientation == "vertical") {
                currentLOB = position.y - this.element.offset().top;
                currentLOBPercent = currentLOB / this.element.outerHeight();
                totalValue = this.element.height();
            }
            else {
                currentLOB = position.x - this.element.offset().left;
                currentLOBPercent = currentLOB / this.element.outerWidth();
                totalValue = this.element.width();
            }
            if (currentLOBPercent > 1) {
                currentLOBPercent = 1;
            }
            if (currentLOBPercent < 0) {
                currentLOBPercent = 0;
            }
            currentValue = currentLOBPercent * totalValue;
            return this._trimValue(currentValue);
        },

        _trimValue: function (value) {
            var step, stepModValue, correctedValue;
            step = 1;
            stepModValue = (value) % step;
            correctedValue = value - stepModValue;
            if (Math.abs(stepModValue) * 2 >= step)
                correctedValue += (stepModValue > 0) ? step : (-step);
            return parseFloat(correctedValue.toFixed(5));
        },

        _getSplitbarIndex: function () {
            return this.element.children(".e-splitbar:not(.e-shadowbar)").index(this.currentSplitBar);
        },

        _paneResize: function () {
            if (this.shadowBar == null) return false;
            this.currentSplitBar = this.shadowBar.next();
            var newPosition, prevPane, nextPane, prevPaneIndex, nextPaneIndex, index = this._getSplitbarIndex();
            prevPane = this.shadowBar.prev(), nextPane = this.currentSplitBar.next();
            prevPaneIndex = index, nextPaneIndex = index + 1;
            newPosition = this.shadowBar.offset()[this.displayCss];
            newPosition = newPosition - this.currentSplitBar.offset()[this.displayCss];
            $(prevPane).css(this.containerCss, newPosition + $(prevPane)[this.containerCss]() + "px");
            $(nextPane).css(this.containerCss, $(nextPane)[this.containerCss]() - newPosition + "px");
            this.oldPaneSize[prevPaneIndex] = $(prevPane)[this.containerCss]();
            this.oldPaneSize[nextPaneIndex] = $(nextPane)[this.containerCss]();
            this.shadowBar.remove();
            this._checkPaneSize();
            var prevObj = { item: prevPane, index: prevPaneIndex, size: this.oldPaneSize[prevPaneIndex] };
            var nextObj = { item: nextPane, index: nextPaneIndex, size: this.oldPaneSize[nextPaneIndex] };
            this._updateModelValue(prevObj, nextObj);
            this._trigger("resize", {
                prevPane: prevObj,
                nextPane: nextObj,
                splitbarIndex: index
            });
        },

        _checkPaneSize: function () {
            var total = 0, len, i, splitterLen, paneCount = this.panes.length;
            for (i = 0; i < paneCount; i++) {
                len = this.containerCss=='width' ? $(this.panes[i])['outerWidth']() :$(this.panes[i])['outerHeight']();
                total += len + this._bar;
            }
            total -= this._bar;
            splitterLen = this._getExactInnerWidth();
            if (total != splitterLen) {
                var remain = splitterLen - total;
                var last = $(this.panes[paneCount - 1])[this.containerCss]();
                if (last == 0) {
                    for (i = paneCount - 1; i >= 0; i--) {
                        if ($(this.panes[i]).hasClass("expanded") && !$(this.panes[i]).hasClass("collapsed")) {
                            last = $(this.panes[i])[this.containerCss]();
                            $(this.panes[i]).css(this.containerCss, parseFloat(last + remain));
                            break;
                        }
                    }
                }
                else
                    $(this.panes[paneCount - 1]).css(this.containerCss, parseFloat(last + remain));
            }
        },

        _maxminDraggableRange: function (shadowbarPos) {
            var prevPane, nextPane, prevPaneSize, nextPaneSize, splitbarPosition, prevPaneRange, nextPaneRange,
                prevPaneIndex, nextPaneIndex, PaneMax1, PaneMax2, PaneMin1, PaneMin2, index;
            prevPane = this.shadowBar.prev();
            this.currentSplitBar = this.shadowBar.next();
            nextPane = this.currentSplitBar.next();
            prevPaneSize = prevPane[this.containerCss]();
            nextPaneSize = nextPane[this.containerCss]();
            splitbarPosition = this.displayCss == "left" ? this.currentSplitBar[0].offsetLeft : this.currentSplitBar[0].offsetTop;
            prevPaneRange = splitbarPosition - prevPaneSize;
            nextPaneRange = nextPaneSize + splitbarPosition;
            index = this._getSplitbarIndex();
            prevPaneIndex = index;
            nextPaneIndex = index + 1;
            PaneMax1 = this.model.properties[prevPaneIndex].maxSize;
            PaneMax2 = this.model.properties[nextPaneIndex].maxSize;
            PaneMax1 = PaneMax1 != null ? parseInt(PaneMax1, 10) : null;
            PaneMax2 = PaneMax2 != null ? parseInt(PaneMax2, 10) : null;
            this.model.properties[prevPaneIndex].minSize = parseInt(this.model.properties[prevPaneIndex].minSize, 10);
            this.model.properties[nextPaneIndex].minSize = parseInt(this.model.properties[nextPaneIndex].minSize, 10);
            PaneMin1 = this.model.properties[prevPaneIndex].minSize;
            PaneMin2 = this.model.properties[nextPaneIndex].minSize;
            this.shadowBar.removeClass("e-end-indicaton");
            if (shadowbarPos > nextPaneRange - PaneMin2) {
                this.resizedPosition = nextPaneRange - PaneMin2;
                this.shadowBar.addClass("e-end-indicaton");
            }
            else if (shadowbarPos < prevPaneRange + PaneMin1) {
                this.resizedPosition = prevPaneRange + PaneMin1;
                this.shadowBar.addClass("e-end-indicaton");
            }
            if (PaneMax1 != null) {
                if (shadowbarPos > prevPaneRange + PaneMax1) {
                    this.resizedPosition = prevPaneRange + PaneMax1;
                    this.shadowBar.addClass("e-end-indicaton");
                }
            }
            else if (PaneMax2 != null) {
                if (shadowbarPos < nextPaneRange - PaneMax2) {
                    this.resizedPosition = nextPaneRange - PaneMax2;
                    this.shadowBar.addClass("e-end-indicaton");
                }
            }
        },

        _collapseArrowClick: function (event) {
            if (this.shadowBar != null) return;
            var $target = (!ej.isNullOrUndefined(event.target)) ? $(event.target): $(event.currentTarget);
            this._inMovement = true;
            this.currentSplitBar = $target.parent();
            var currBarNo, prevPane, nextPane, prevPaneIndex, nextPaneIndex, prevPaneSize, nextPaneSize, properties = {};
            var paneCount = this.panes.length;
            currBarNo = this._getSplitbarIndex();
            prevPane = this.currentSplitBar.prev();
            nextPane = this.currentSplitBar.next();
            prevPaneIndex = currBarNo;
            nextPaneIndex = currBarNo + 1;
            prevPaneSize = prevPane[this.containerCss]();
            nextPaneSize = nextPane[this.containerCss]();
            var proxy = this, collapsed, expanded;
            collapsed = { item: prevPane, index: prevPaneIndex, size: prevPaneSize };
            expanded = { item: nextPane, index: nextPaneIndex, size: nextPaneSize };
            if (this._raiseEvent("beforeExpandCollapse", collapsed, expanded, currBarNo, 'beforeCollapse'))
                return false;
            if (!nextPane.hasClass("collapsed")) {
                this.oldPaneSize[prevPaneIndex] = prevPaneSize;
                prevPane.addClass("collapsed");
                nextPane.addClass("expanded");
                this.currentSplitBar.attr("aria-expanded", false);
                $target.parent().removeClass("e-resize").addClass("e-icon-hide");
                if(ej.isNullOrUndefined(this.model.expanderTemplate)) $target.css("display", "none");
                if (!this.model.properties[nextPaneIndex].collapsible)
                     $($target.siblings()).not('.e-activebar').css("display", "block");
                if (prevPaneIndex != 0) {
                    var preBar = prevPane.prev();
                    preBar.find(".e-expand").css("display", "none");
                    if (!this.model.properties[prevPaneIndex - 1].collapsible && $(prevPane.prev().prev()[0]).hasClass("expanded"))
                        preBar.find(".e-collapse").css("display", "block");
                    preBar.removeClass("e-resize").addClass("e-icon-hide");
                }
                properties[this.containerCss] = 0;
                prevPane.animate(properties, this.model.enableAnimation ? this.model.animationSpeed : 0);
                properties[this.containerCss] = prevPaneSize + nextPaneSize;
                nextPane.animate(properties, this.model.enableAnimation ? this.model.animationSpeed : 0, function () {
                    proxy._raiseEvent("expandCollapse", collapsed, expanded, currBarNo, 'collapsed');
                });
            }
            else {
                if (prevPaneSize < this.oldPaneSize[nextPaneIndex]) {
                    $target.addClass("e-end-indicaton");
                    this._inMovement = false;
                    $(document).on("mouseup", $.proxy(this._mouseUpOnArrow, this));
                    return false;
                }
                else {
                    prevPane.removeClass("expanded");
                    nextPane.removeClass("collapsed");
                    $target.parent().addClass("e-resize").removeClass("e-icon-hide");
                    $($target.siblings()).not('.e-activebar').css("display", "block");
                    if (!this.model.properties[prevPaneIndex].collapsible)
                        $target.css("display", "none");
                    if (nextPaneIndex != paneCount - 1) {
                        var nextBar = nextPane.next();
                        if (!this.model.properties[nextPaneIndex + 1].collapsible)
                            nextBar.find(".e-expand").css("display", "none");
                        nextBar.find(".e-collapse").css("display", "block");
                        if (!nextBar.next().hasClass("collapsed")) {
                            nextBar.addClass("e-resize").removeClass("e-icon-hide");
                            nextBar.attr("aria-expanded", true);
                        }
                    }

                    properties[this.containerCss] = this.oldPaneSize[nextPaneIndex];
                    nextPane.animate(properties, this.model.enableAnimation ? this.model.animationSpeed : 0);
                    properties[this.containerCss] = prevPaneSize - this.oldPaneSize[nextPaneIndex];
                    prevPane.animate(properties, this.model.enableAnimation ? this.model.animationSpeed : 0, function () {
                        proxy._raiseEvent("expandCollapse", collapsed, expanded, currBarNo, 'collapsed');
                    });
                }
            }
        },

        _expandArrowClick: function (event) {
            if (this.shadowBar != null) return;
           var $target = (!ej.isNullOrUndefined(event.target)) ? $(event.target): $(event.currentTarget);
            this._inMovement = true;
            this.currentSplitBar = $target.parent();
            var currBarNo, prevPane, nextPane, prevPaneIndex, nextPaneIndex, prevPaneSize, nextPaneSize, properties = {};
            var paneCount = this.panes.length;
            currBarNo = this._getSplitbarIndex();
            prevPane = this.currentSplitBar.prev();
            nextPane = this.currentSplitBar.next();
            prevPaneIndex = currBarNo;
            nextPaneIndex = currBarNo + 1;
            prevPaneSize = prevPane[this.containerCss]();
            nextPaneSize = nextPane[this.containerCss]();
            var proxy = this, collapsed, expanded;
            collapsed = { item: nextPane, index: nextPaneIndex, size: nextPaneSize };
            expanded = { item: prevPane, index: prevPaneIndex, size: prevPaneSize };

            if (this._raiseEvent("beforeExpandCollapse", collapsed, expanded, currBarNo, 'beforeExpand'))
                return false;
            if (!prevPane.hasClass("collapsed")) {
                this.oldPaneSize[nextPaneIndex] = nextPaneSize;
                prevPane.addClass("expanded");
                nextPane.addClass("collapsed");
                $target.parent().removeClass("e-resize").addClass("e-icon-hide");
                if(ej.isNullOrUndefined(this.model.expanderTemplate)) $target.css("display", "none");
                if (!this.model.properties[prevPaneIndex].collapsible)
                      $($target.siblings()).not('.e-activebar').css("display", "block");
                if (nextPaneIndex != paneCount - 1) {
                    var nextBar = nextPane.next();
                    nextBar.find(".e-collapse").css("display", "none");
                    if (!this.model.properties[nextPaneIndex + 1].collapsible && $(nextPane.next().next()[0]).hasClass("collapsed"))
                        nextBar.find(".e-expand").css("display", "block");
                    nextBar.removeClass("e-resize").addClass("e-icon-hide");
                    nextBar.attr("aria-expanded", false);
                }
                properties[this.containerCss] = prevPaneSize + nextPaneSize;
                prevPane.animate(properties, this.model.enableAnimation ? this.model.animationSpeed : 0);
                properties[this.containerCss] = 0;
                nextPane.animate(properties, this.model.enableAnimation ? this.model.animationSpeed : 0, function () {
                    proxy._raiseEvent("expandCollapse", collapsed, expanded, currBarNo, 'expanded');
                });
            }
            else {
                if (nextPaneSize < this.oldPaneSize[prevPaneIndex]) {
                    $target.addClass("e-end-indicaton");
                    this._inMovement = false;
                    $(document).on("mouseup", $.proxy(this._mouseUpOnArrow, this));
                    return false;
                }
                else {
                    prevPane.removeClass("collapsed");
                    nextPane.removeClass("expanded");
                    this.currentSplitBar.attr("aria-expanded", true);
                    $target.parent().addClass("e-resize").removeClass("e-icon-hide");
                      $($target.siblings()).not('.e-activebar').css("display", "block");
                    if (!this.model.properties[nextPaneIndex].collapsible)
                        $target.css("display", "none");
                    if (prevPaneIndex != 0) {
                        var preBar = prevPane.prev();
                        if (!this.model.properties[currBarNo - 1].collapsible)
                            preBar.find(".e-collapse").css("display", "none");
                        preBar.find(".e-expand").css("display", "block");
                        if (!preBar.prev().hasClass("collapsed")) preBar.addClass("e-resize").removeClass("e-icon-hide");
                    }

                    properties[this.containerCss] = this.oldPaneSize[prevPaneIndex];
                    prevPane.animate(properties, this.model.enableAnimation ? this.model.animationSpeed : 0);
                    properties[this.containerCss] = nextPaneSize - this.oldPaneSize[prevPaneIndex];
                    nextPane.animate(properties, this.model.enableAnimation ? this.model.animationSpeed : 0, function () {
                        proxy._raiseEvent("expandCollapse", collapsed, expanded, currBarNo, 'expanded');
                    });
                }
            }
        },

        _raiseEvent: function (evtName, collapsed, expanded, index, type) {
            if (evtName == "expandCollapse") {
                this._inMovement = false;
                this._updateModelValue(collapsed, expanded);
            }
            return this._trigger(evtName, {
                collapsed: collapsed,
                expanded: expanded,
                splitbarIndex: index,
				action: type
            });

        },

        _updateModelValue: function (collapsed, expanded) {
            this.model.properties[collapsed.index].paneSize = collapsed.item[this.containerCss]();
            this.model.properties[expanded.index].paneSize = expanded.item[this.containerCss]();
            this._getPanesPercent();
        },

        _mouseUpOnArrow: function (event) {
            this.element.find(".e-end-indicaton").removeClass("e-end-indicaton");
            $(document).off("mouseup", $.proxy(this._mouseUpOnArrow, this));
        },

        _keydownOnDivider: function (e) {
            var key = e.keyCode;
            if (key == 37 || key == 38 || key == 39 || key == 40) {
                e.preventDefault();
                var oriTarget = $(e.data.target);
                if (e.ctrlKey) {
                    if (this.shadowBar == null) {
                        this.currentSplitBar = oriTarget;
                        var index = this._getSplitbarIndex();
                        if (this.model.orientation == "vertical") {
                            if (e.keyCode == 38) this.collapse(index);
                            else if (e.keyCode == 40) this.expand(index);
                        }
                        else {
                            if (e.keyCode == 37) this.collapse(index);
                            else if (e.keyCode == 39) this.expand(index);
                        }
                    }
                }
                else if (oriTarget.hasClass("e-resize")) {
                    var target = (this.shadowBar != null) ? this.shadowBar : oriTarget;
                    var offset = target.offset(), location = { pageX: offset.left, pageY: offset.top };
                    $.extend(true, e, location);
                    if ((this.model.orientation == "vertical" && (e.keyCode == 38 || e.keyCode == 40)) ||
                        (this.model.orientation == "horizontal" && (e.keyCode == 37 || e.keyCode == 39))) {
                        if (e.keyCode == 38) e.pageY -= 5;
                        else if (e.keyCode == 40) e.pageY += 5;
                        else if (e.keyCode == 37) e.pageX -= 5;
                        else if (e.keyCode == 39) e.pageX += 5;
                        this._mouseMoveOnDivider(e);
                    }
                }
            }
            else if (key == 13) {
                e.preventDefault();
                this._mouseUpOnDivider();
            }
            else if (key == 27) {
                e.preventDefault();
                if (this.shadowBar != null) this.shadowBar.remove();
                this.shadowBar = null;
                this._mouseUpOnDivider();
                this.element.children(".e-splitbar.e-hover").focusout();
            }
        },

        _focusOnDivider: function (e) {
            if (e.type == "focus") {
                if (!$(e.target).hasClass("e-hover")) {
                    $(e.target).addClass("e-hover");
                    if (this.model.allowKeyboardNavigation)
                        $(document).on("keydown", { target: e.target }, $.proxy(this._keydownOnDivider, this));
                }
            }
            else {
                this.element.children(".e-splitbar.e-hover").removeClass("e-hover");
                this._mouseUpOnDivider();
                $(document).off("keydown", $.proxy(this._keydownOnDivider, this));
            }
        },

        _mouseDownOnDivider: function (event) {
            event.preventDefault();
            var $target;
            ($(event.target).hasClass("e-activebar")) ? $target=$(event.target.parentElement) : (!ej.isNullOrUndefined(this.model.expanderTemplate) && $(event.target).parents(".e-splitbar").length>0) ? $target = $(event.target).parents(".e-splitbar") : $target=$(event.target);
            if ($target.hasClass("e-splitbar") && $target.hasClass("e-resize")) {
                this._overlayElement = ej.buildTag('div.e-pane-overlay');
                if (!$target.hasClass("e-hover")) $target.focus();
                this.element.find(".e-pane").not(".e-splitter").append(this._overlayElement);
                $(document).on(ej.eventType.mouseMove, { target: ($(event.target).hasClass("e-activebar")) ? event.target.parentElement : event.target }, $.proxy(this._mouseMoveOnDivider, this));
                $(document).on(ej.eventType.mouseUp, $.proxy(this._mouseUpOnDivider, this));
                $(document).on("mouseleave", $.proxy(this._mouseUpOnDivider, this));
            }
            else if ($target.hasClass("e-expand") || $target.hasClass("e-collapse")) {
                $target.parent().focus();
            }
        },

        _mouseMoveOnDivider: function (event) {
            var _data = event.data;
            event = event.type == "touchmove" ? event.originalEvent.changedTouches[0] : event;
            this._isMouseMove = true;
            var position = { x: event.pageX, y: event.pageY };
            this.resizedPosition = this._getNormalValue(position);
            if (this.shadowBar == null) {
                var target;
                ($(_data.target).hasClass('e-activebar')) ? target=$(_data.target.parentElement) : (!ej.isNullOrUndefined(this.model.expanderTemplate) && $(event.target).parents(".e-splitbar").length>0) ? target = $(_data.target).parents(".e-splitbar") : target=$(_data.target);
                this.shadowBar = target.clone().addClass("e-shadowbar").removeClass("e-hover").removeClass("e-split-divider").insertBefore(target);
                this.shadowBar.children().remove();
            }
            this._maxminDraggableRange(this.resizedPosition);
            this.shadowBar.css(this.displayCss, this.resizedPosition);
        },

        _mouseUpOnDivider: function (event) {
            this._paneResize();
			if(!ej.isNullOrUndefined(this.model.expanderTemplate)) this._templateIconPositioning(true);
            this.element.find(".e-pane").not(".e-splitter").find(".e-pane-overlay").remove();
            $(document).off(ej.eventType.mouseMove, $.proxy(this._mouseMoveOnDivider, this));
            $(document).off(ej.eventType.mouseUp, $.proxy(this._mouseUpOnDivider, this));
            $(document).off("mouseleave", $.proxy(this._mouseUpOnDivider, this));
            // sets shadowBar null after removing shadowBar element
            this.shadowBar = null;
        },

        _windowResized: function (event) {
            var size = this._getExactInnerWidth();
            if (this._prevSize == size) return false;
            var paneCount = this.panes.length, outerSize = size - ((paneCount - 1) * this._bar), i, val;
            this._prevSize = size;
            for (i = 0; i < paneCount; i++) {
                val = this._convertToPixel(outerSize, this._sizePercent[i]);
                $(this.panes[i]).css(this.containerCss, val + "px");
            }
            for (i = 0; i < this.oldPaneSize.length; i++)
                this.oldPaneSize[i] = this._convertToPixel(outerSize, this.oldPanePercent[i]);
			var last = $(this.panes[this.panes.length - 1])[this.containerCss]();
            if (last == 0)
                this._checkPaneSize();
        },

        _convertToPercent: function (outer, pane) {
            return (pane * 100) / outer;
        },
        _convertToPixel: function (tot, percent) {
            return parseFloat((tot * percent) / 100);
        },

        _wireEvents: function (boolean) {
            if (boolean) $(window).on('resize', $.proxy(this._windowResized, this));
        },

        _unWireEvents: function () {
            $(window).off('resize', $.proxy(this._windowResized, this));
        }
    });

})(jQuery, Syncfusion);