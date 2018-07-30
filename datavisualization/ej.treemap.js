/**
* @fileOverview Plugin to style the Html TreeMap elements
* @copyright Copyright Syncfusion Inc. 2001 - 2013. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author &lt;a href="mailto:licensing@syncfusion.com"&gt;Syncfusion Inc&lt;/a&gt;
*/
(function ($, ej, undefined) {
   
    ej.widget({ "ejTreeMap": "ej.datavisualization.TreeMap" }, {

        validTags: ["div"],

        defaults: {           
			locale : null,    
			enableGroupSeparator: false,
			colorPath: null,
			legendItemRendering: null,
            itemRendering: null,
            leafItemSettings: {               
                borderThickness: 1,               
                borderBrush: "white",
                showLabels: false,
                labelPath: null,
                gap:0,
                itemTemplate: null,
                textOverflow: "none",
                labelPosition: "topleft",
                labelVisibilityMode: "visible"
            },
            header: null,
            isHierarchicalDatasource: false,
            dataSource: null,
            groupColorMapping:[],			
            enableDrillDown: false,
            drillDownHeaderColor: null,
            drillDownSelectionColor: '#000000',          			
            colorValuePath: null,
            weightValuePath: null,			
            treeMapItems: [],
            showLegend: false,
            borderBrush: "white",
            borderThickness: 1,
            enableResize: true,
			enableGradient: false,
            isResponsive: true,
            itemsLayoutMode: "squarified",						
            levels: [],
            headerTemplateRendering: null,  
            doubleClick: "",
            click: "",
            rightClick: "",  
			drillStarted: null,
			drillDownItemSelected: null,
			treeMapGroupSelected: null,
			treeMapItemSelected: null,
           legendSettings: {
                template: "",
                iconHeight: 15,
                iconWidth: 15,
                title:'',
                height: 0,
                width: 0,
                mode: "default",
                leftLabel: "",
                rightLabel: "",
                dockPosition: "top",
                alignment: "near",
                columnCount: 0
            },         			         
            rangeColorMapping: [],

            uniColorMapping: { 			
                color: null 
            },
			            
            desaturationColorMapping: { 				            
                from:0, 				               
                to:0,				              
                color: "",								
                rangeMinimum:0,				
                rangeMaximum:0
            },

            paletteColorMapping: {                
                colors:[], 
            },            
            highlightOnSelection: false,			           
			selectionMode: "default",		
            highlightGroupOnSelection: false,
			groupSelectionMode: "default",
			draggingOnSelection: false,
			draggingGroupOnSelection: false,
            showTooltip: false,
            tooltipTemplate: null,
            highlightBorderThickness: 5,
            highlightGroupBorderThickness: 4,
            highlightBorderBrush: "gray",
            highlightGroupBorderBrush: "gray"

        },
        
        dataTypes: {
            dataSource: "data",
            treeMapItems: "array",
            levels: "array",
            rangeColorMapping: "array",
            paletteColorMapping: "object",
            groupColorMapping: "array"
        },
		
        observables: ["dataSource",
              "colorValuePath",
              "weightValuePath",
              "showLegend",
              "enableResize",
              "highlightOnSelection",
			  "selectionMode",
			  "groupSelectionMode",
             "highlightGroupOnSelection",
             "enableDrillDown",
              "drillDownHeaderColor",
             "drillDownSelectionColor",
             "showTooltip",
             "highlightBorderThickness",
             "highlightBorderBrush",
               "itemsLayoutMode",
              "leafItemSettings.borderThickness",
              "leafItemSettings.borderBrush",
              "leafItemSettings.showLabels",
              "leafItemSettings.labelPath",
              "leafItemSettings.textOverflow",
              "legendSettings.iconWidth",
              "legendSettings.iconHeight",
              "legendSettings.dockPosition",
              "legendSettings.height",
              "legendSettings.width",
              "uniColorMapping.color",
              "desaturationColorMapping.from",
              "desaturationColorMapping.to",
              "desaturationColorMapping.color",
              "desaturationColorMapping.rangeMinimum",
              "desaturationColorMapping.rangeMaximum"              
        ],
        _tags: [
            {
                tag: "levels",
                attr: ["groupPath", "groupGap", "headerHeight", "showHeader", "groupPadding","showLabels","headerHeight","headerTemplate","headerVisibilityMode",
				"labelPosition","labelTemplate","labelVisibilityMode", "groupBackground", "groupBorderColor", "groupBorderThickness"],
                singular: "level"
            },
            {
                tag: "rangeColorMapping",
                attr: ["color", "legendLabel", "from", "to"],
                singular: "rangeColor"
            },           
            {
                tag: "groupColorMapping",
                attr: ["groupID",
            {
                tag: "groupColorMapping.rangeColorMapping",
                attr: ["color", "legendLabel", "from", "to"],
                singular: "groupRangeColor"
            },            

              "uniColorMapping.color",
              "desaturationColorMapping.from",
              "desaturationColorMapping.to",
              "desaturationColorMapping.color",
              "desaturationColorMapping.rangeMinimum",
              "desaturationColorMapping.rangeMaximum"
                ],
                singular: "groupColor"
            }

        ],

        dataSource: ej.util.valueFunction("dataSource"),
        colorValuePath: ej.util.valueFunction("colorValuePath"),
        weightValuePath: ej.util.valueFunction("weightValuePath"),
        showLegend: ej.util.valueFunction("showLegend"),
        enableResize: ej.util.valueFunction("enableResize"),
        highlightOnSelection: ej.util.valueFunction("highlightOnSelection"),
		selectionMode:ej.util.valueFunction("selectionMode"),
        highlightGroupOnSelection: ej.util.valueFunction("highlightGroupOnSelection"),
		groupSelectionMode:ej.util.valueFunction("groupSelectionMode"),
        enableDrillDown: ej.util.valueFunction("enableDrillDown"),
        drillDownHeaderColor: ej.util.valueFunction("drillDownHeaderColor"),
        drillDownSelectionColor: ej.util.valueFunction("drillDownSelectionColor"),
        showTooltip: ej.util.valueFunction("showTooltip"),
        highlightBorderThickness: ej.util.valueFunction("highlightBorderThickness"),
        itemsLayoutMode: ej.util.valueFunction("itemsLayoutMode"),
        highlightBorderBrush: ej.util.valueFunction("highlightBorderBrush"),
        borderThickness: ej.util.valueFunction("leafItemSettings.borderThickness"),
        borderBrush: ej.util.valueFunction("leafItemSettings.borderBrush"),
        showLabels: ej.util.valueFunction("leafItemSettings.showLabels"),
        labelPath: ej.util.valueFunction("leafItemSettings.labelPath"),
        textOverflow: ej.util.valueFunction("leafItemSettings.textOverflow"),
        iconWidth: ej.util.valueFunction("legendSettings.iconWidth"),
        iconHeight: ej.util.valueFunction("legendSettings.iconHeight"),
        dockPosition: ej.util.valueFunction("legendSettings.dockPosition"),
        legendheight: ej.util.valueFunction("legendSettings.height"),
        legendwidth: ej.util.valueFunction("legendSettings.width"),
        itemTemplate: ej.util.valueFunction("leafItemSettings.itemTemplate"),
        uniColor: ej.util.valueFunction("uniColorMapping.color"),
        _color: ej.util.valueFunction("desaturationColorMapping.color"),
        _from: ej.util.valueFunction("desaturationColorMapping.from"),
        _to: ej.util.valueFunction("desaturationColorMapping.to"),
        _rangeMinimum: ej.util.valueFunction("desaturationColorMapping.rangeMinimum"),
        _rangeMaximum: ej.util.valueFunction("desaturationColorMapping.rangeMaximum"),

        _initPrivateProperties: function () {
            this._svgDocument = null;
            this._templateDiv = null;
            this._legenddiv = null;
            this._drillHeaderDiv = null;
            this._drillHoverDiv = null;
            this._legendHeight = 0;
            this._backgroundTile = null;
            this._tooltipSize = { height: 0, width: 0 };
            this._height = 500;
            this._margintop = null;
            this._marginleft = null;
            this._startPoint = { x: 0, y: 0 };
            this._stopPoint = { x: 0, y: 0 };
            this.mouseClickable = false;
            this.dragDiv = null;
            this._initDiv = null;
            this._width = 500;
            this._svgns = "http://www.w3.org/2000/svg";
            this._prevSelectedItems=[];
            this._prevSelectedHeaders = [];
            this._isLevelColors;
			 if (this.selectedItems == null)
                this.selectedItems = [];
            
            this._browser = null;
            this._toolTipElement = null;
            this._rootTreeMapItems = [];
            this.treemapgroups = [];
            this._drillHeader = null;
            this._drilldownItem = null;
            this._drilldownItems = [];
            this._treeMapHeaders = [];
            this._drilldownHeaders = [];
            
            this._treeMapLabels = [];
            this._labelTemplateElements = [];
            this._itemGroups = [];
            this._prevSelectedGroupDatas = [];
            this._interactiveArrow = null;
            this._legendRects = [];
        },

        _setModel: function (options) {
            for (var prop in options) {
                switch (prop) {
                    case "itemsLayoutMode":
                        this.itemsLayoutMode(options[prop]);
                        this.refresh();
                        break;
                }
            }
        },
		
		
		
        _levels: function(index, property, value, old){
            this.refresh();
        },
        _rangeColorMapping: function(index, property, value, old){
            this._setColorMappings(this._rootTreeMapItems, this.model);
        },
        _groupColorMapping: function(index, property, value, old){
            this._setColorMappings(this._rootTreeMapItems, this.model);
        },
        _groupColorMapping_rangeColorMapping: function(index, property, value, old){
            this._setColorMappings(this._rootTreeMapItems, this.model);
        },
      
        _init: function () {

            this._initPrivateProperties();
            var style = $('<style>.e-drillGroupRect:hover{ background-color:' + this.drillDownSelectionColor() + ';}</style>');
            $('html > head').append(style);
            this._levelInitialize();
            if (!this._isSVG())
            {
                document.createStyleSheet().addRule(".vml", "behavior:url(#default#VML);display:inline-block");
                document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', "#default#VML");
            }
            this.refresh();           

        },

        _destroy: function() {
            this._unWireEvents();
            $(this.element).removeClass("e-treemap e-js").find().remove(".e-tooltipelement");
            $(this.element).empty();
        },
       
        _levelInitialize: function () {
            var proxy = this;
            if (this.model.levels != null) {
                $.each(this.model.levels, function (index, element) {                    
                    element = proxy._checkArrayObject(element, index);
                    var obj = new treeMapLevel();                    
                    $.extend(obj, element);
                    $.extend(element, obj);                    
                });
            }
            else {
                this.levels.treeMapLevel = new treeMapLevel();

            }			
          
        },

        _checkArrayObject: function (element, initialName) {

            var publicProperties = ["borderBrush", "dataSource", "groupColorMapping", "enableDrillDown", "drillDownHeaderColor", "drillDownSelectionColor", "colorValuePath", "weightValuePath", "treeMapItems", "showLegend", "borderBrush", "borderThickness", "enableResize", "enableGradient", "isResponsive", "itemsLayoutMode", "levels", "groupBackground", "groupBorderColor", "groupBorderThickness", "groupPadding", "groupPath", "groupGap", "headerHeight", "showHeader", "showLabels", "headerTemplate", "labelTemplate", "labelPosition", "textOverflow","headerVisibilityMode", "labelVisibilityMode", "color", "leafItemSettings", "showLabels", "labelPath", "gap", "itemTemplate", "legendSettings", "template", "iconHeight", "iconWidth", "height", "width", "mode", "leftLabel", "rightLabel", "dockPosition", "alignment", "highlightOnSelection", "selectionMode", "highlightGroupOnSelection", "groupSelectionMode", "draggingOnSelection", "draggingGroupOnSelection", "showTooltip", "tooltipTemplate", "highlightBorderThickness", "highlightGroupBorderThickness", "highlightBorderBrush", "highlightGroupBorderBrush"];

            var proxy = this;
            $.each(element, function (name, innerElement) {
                if (publicProperties.indexOf(name) > -1) {
                    if (innerElement instanceof Array) {
                        proxy._checkArrayObject(innerElement, name);
                    }
                    else if (innerElement != null && typeof innerElement == "object") {
                        var allObjects = new treeMapLevel();
                        proxy._loadIndividualDefaultValues(innerElement, allObjects, (typeof name === "number") ? initialName : name);
                    }
                }
            });
            return element;
        },

        _loadIndividualDefaultValues: function (obj, allObjects, name) {
            var defaultObj = null;
            var proxy = this;
            $.each(allObjects, function (n, element) {
                if (name == n) {
                    defaultObj = element;
                    return;
                }
            });
            if (defaultObj instanceof Array) defaultObj = defaultObj[0];

            $.each(obj, function (objName, ele) {
                if (ele instanceof Array) {
                    proxy._checkArrayObject(ele, name);
                }
                else if (ele != null && typeof ele == "object") {
                    proxy._loadIndividualDefaultValues(ele, ele, (typeof objName === "number") ? name : objName);
                }
            });

            $.extend(defaultObj, obj);
            $.extend(obj, defaultObj);
            return obj;
        },

        refresh: function (isClear) {
            if(document.getElementById(this._id) != null || document.getElementById(this._id) != undefined){
                this._unWireEvents();
            if (!isClear) {
                this._drilldownItems = [];
            }
            if (this.model.enableResize || this.model.isResponsive) {
                if (this._drilldownItems.length == 0) {
                    this._initPrivateProperties();
                }
            }
            else {
                this._initPrivateProperties();
            }

            $(this.element).empty();
            if (this._svgDocument != null) {
                $(this._svgDocument).empty();
            }
            this._height = this.element.height();
            this._width = this.element.width();
            if (this._height == 0) {
                this._height = this.element[0].parentElement.clientHeight != 0 ? this.element[0].parentElement.clientHeight : $(document).height();
            }
            if (this._width == 0) {
                this._width = this.element[0].parentElement.clientWidth != 0 ? this.element[0].parentElement.clientWidth : $(document).width();
            }
            if (this.showLegend()) {
                if (this.enableDrillDown() && this.model.colorPath != null) {
                    var cloneItems = this._getGroupitem(this.model.levels[0].groupPath, this.model.dataSource, this.model.levels[0].headerHeight);
                    cloneItems.sort(function (a, b) {
                        return parseFloat(b.weight) - parseFloat(a.weight);
                    });
                }
                this._sizeCalculation(cloneItems);
            }            
            var matched = jQuery.uaMatch(navigator.userAgent);
            var browser = matched.browser.toLowerCase();
            var isIE11 = !!navigator.userAgent.match(/Trident\/7\./);
            this._browser = browser;
            $(this.element).css({ 'position': 'relative' });			
           
            if (this._height != 0 && this._width != 0) {                
                this._templateDiv = $("<div class='e-_templateDiv'></div>");
                this._templateDiv.css({
                    'pointer-events': 'none', 'overflow': 'hidden', 'float': 'left',
                    'z-index': '2', 'height': this._height, 'width': this._width, "margin-top": this._margintop,  "margin-left": this._marginleft, "position": "absolute", "left": "0", "top": "0"
                });
                if (this.enableDrillDown() && this._drilldownItems.length == 0) {
                    this._drillHeaderDiv = $("<div class='e-_drillHeaderDiv'></div>");
                    this._drillHeaderDiv.css({
                        'overflow': 'hidden', 'float': 'left',
                        'z-index': '3', "position": "absolute", "left": this.model.legendSettings.dockPosition != "left" ? "0" : this._legendSize.width, "top": "0"
                    });
                    this._drillHoverDiv = $("<div class='e-_drillHoverDiv'></div>");
                    this._drillHoverDiv.css({
                        'overflow': 'hidden', 'float': 'left',
                        'z-index': '3', 'height': this._height - 30, 'width': this._width, "position": "absolute", "left": this.model.legendSettings.dockPosition != "left" ? "0" : this._legendSize.width, "top": "30px"
                    });
                }
                this._backgroundTile = $('<div id="backgroundTile" style="overflow:hidden;z-index:0;"></div>');
                if(this.showLegend()) {
                    if (this.model.legendSettings != null) {
                        this._renderLegend();                       
                    }
                }
                if(this.dataSource()!=null){
                    if (this._drilldownItems.length > 0) {
                        if (this.enableDrillDown() && this.model.levels.length >= 1 && ((this._drilldownItem != null) || this._drilldownItem == null)) {
                            for (var i = 0; i < this._drillHeaderDiv[0].children[0].children.length; i++) {
                                if (this._drillHeaderDiv[0].children[0].children[i].className == "e-drilldownlabel")
                                    header = this._drillHeaderDiv[0].children[0].children[i].innerHTML;
                            }
                            this._backgroundTile[0].innerHTML = "";
                            this._drillHeaderDiv[0].innerHTML = "";
                            this._templateDiv[0].innerHTML = "";
                            this._drillHoverDiv[0].innerHTML = "";
                            this._drillDownHeader(true,this.model.levels[0],this.model.dataSource);
                            this._groupdrillDownLevels(this._drilldownItems[this._drilldownItems.length - 1], this._drilldownItems.length);
                        }
                        if (this.showLegend()) {
                            this._generateLegend();
                        }
                        this._generateToolTip();
                    }
                    else {
                        if (this.model.dataSource instanceof ej.DataManager) {
                            this._processOData(this);
                        }
                        else {
                            this._renderTreeMap(this.dataSource());
                        }
                    }
                }
                if (this.enableResize() || this.model.isResponsive) {
                    this._on($(window), "resize", this._treeMapResize);
                }
            }
			this._selectItemResize();
            this._wireEvents();
            this._trigger("refreshed", "");
            }
            
        },
		
       _renderTreeMap: function (data) {
            this.model.browserInfo = this.browserInfo();            
            if (this.showLegend() && this.model.legendSettings.mode == "interactive")
                this._generateLegend();
            this._groupLevels(data);
            this.renderHeader = false;
            this._generateToolTip();
            this._renderLabels();
            if (this.showLegend() && this.model.legendSettings.mode != "interactive") {
                this._generateLegend();
            }
        },
		
   _renderLegend: function () {
            this._legenddiv = $("<div class='e-LegendDiv'/>");
            this._legenddiv.appendTo(this.element);

            this._legenddiv.css({
                'pointer-events': 'none', 'overflow': 'hidden', "position": "absolute",
                'z-index': '2', 'height': this._legendSize.height, 'width': this._legendSize.width
            });
        },

        _processOData: function (treemap) {  
            var treeMap= this;		 
            var queryPromise = treemap.model.dataSource.executeQuery(treemap.model.query);
            queryPromise.done(function (e) {
                if(e.result!=null)
                {
                    treeMap._renderTreeMap(e.result);
                }
            });        
        },

        _treeMapResize: function (event) {
            event.preventDefault();
            event.stopPropagation();
            var treemap = this;
            if (this.resizeTO) clearTimeout(this.resizeTO);
            this.resizeTO = setTimeout(function () {
                treemap.refresh(true);
            }, 500);
        },
              
        _unWireEvents: function(){
            var matched = jQuery.uaMatch(navigator.userAgent);
            var browser = matched.browser.toLowerCase();
            this._off($(this.element), "contextmenu", this._tmRightClick);
            this._off($(this.element), "click", this._tmClick);
        },

        _wireEvents: function(){
            this._on($(this.element), "contextmenu", this._tmRightClick);
            this._on($(this.element), "click", this._tmClick);
        },

        _tmClick: function(e){
            var end = new Date();
            if(this.model.click != '')
                this._trigger("click", {data:{event: e}});
            
            if(this._doubleTaptimer != null && end - this._doubleTaptimer < 300)
                this._tmDoubleClick(e);
            this._doubleTaptimer = end;
        },

        _tmDoubleClick: function(e){
            if(this.model.doubleClick != '')
                this._trigger("doubleClick", {data:{event: e}});            
        },

        _tmRightClick: function(e){
            if(this.model.rightClick != '')
                this._trigger("rightClick", {data:{event: e}});
        },

        _groupLevels: function (data) {
           
            var subItems = null, isHierarchical = this.model.isHierarchicalDatasource;
            if (this.enableDrillDown()) {                
              this._originalHeaders = [];
              this.renderHeader = true;               
              if (this.model.levels.length > 0) {
                this.model.levels[0].groupingLevel = 0;
                this._drilldownHeaders.push(this.model.header || this.model.levels[0].groupPath);
                this._originalHeaders.push(this.model.levels[0].groupPath);
                this._drillDownHeader(false, this.model.levels[0], data);
              }
              else {
                this._drilldownHeaders.push("");
                this._drillDownHeader(false);
            }
            }
            var rootItems = this._getTopGroupitem(this.labelPath(), data, 0);
            subItems = rootItems;
            if (this.model.levels.length == 0) {
                var levelItem = this.model.leafItemSettings;
                this._rootTreeMapItems = rootItems;
                this._getTopLevels(rootItems[0].innerItems, levelItem);
                this._generateTreeMapItems(rootItems[0].innerItems, "gray", this.colorValuePath());
                if(this.showLabels())
                    this._generateLabels(rootItems[0].innerItems, levelItem);
            }
            if(this.model.levels.length>0){
                for (var i = 0; i <= this.model.levels.length; i++) {
                    var levelItem = this.model.levels[i];
                  if (levelItem != null) {
                        if (!$.isNumeric(levelItem.groupGap)) levelItem.groupGap = 0;
                        if (!$.isNumeric(levelItem.groupPadding)) levelItem.groupPadding = 0;
                        if (!$.isNumeric(levelItem.groupBorderThickness)) levelItem.groupBorderThickness = 0;
                    }
                    if (i != 0) {
                        var cloneItems = subItems;
                        var PrevItem = this.model.levels[i - 1];
                        subItems = [];
                        if (levelItem == null) levelItem = this.model.leafItemSettings;
                        this._generateSubItems(cloneItems, levelItem, subItems, PrevItem, null, null, i-1);
                        
                        this._rootTreeMapItems = subItems;                        
                        if (this.enableDrillDown())
                        {
                            if (i == 1) {
                                this._generateTreeMapItems(subItems, "gray", PrevItem.DisplayPath, cloneItems);
                                if (this.showLabels())
                                    this._generateLabels(subItems, levelItem);
                                return false;
                            }
                        }
                        else if (i == this.model.levels.length) {
                            this._generateTreeMapItems(subItems, "gray", PrevItem.DisplayPath, cloneItems);
                        }                                                  
                        if (this.showLabels() && i == this.model.levels.length) {
                            this._generateLabels(subItems, levelItem);
                        }
                      
                    }
                    else {
                        var rootItems1 = this._getGroupitem(isHierarchical ? this.labelPath() : levelItem.groupPath, rootItems[0].Data, levelItem.headerHeight);
                        this._rootTreeMapItems = rootItems1;
                        this._getTopLevels(rootItems1, levelItem);
                        subItems = rootItems1;                        
                    }
                }
                
            }
        },
        
        _groupdrillDownLevels: function (data, actualindex) {       
          
            var subItems = null, isHierarchical = this.model.isHierarchicalDatasource;
            if (actualindex == this.model.levels.length-1)
            {
                this._drillHoverDiv.css("pointer-events", "none");
            }
            else
            {
                this._drillHoverDiv.css("pointer-events", "auto");
            }
            if (this.model.levels.length > 0) {
                var canExecute = false;
                for (var i = isHierarchical ? actualindex - 1 : 0; i < this.model.levels.length; i++) {                   
                    var levelItem = this.model.levels[i];
                  if (levelItem != null) {
                        if (!$.isNumeric(levelItem.groupGap)) levelItem.groupGap = 0;
                        if (!$.isNumeric(levelItem.groupPadding)) levelItem.groupPadding = 0;
                        if (!$.isNumeric(levelItem.groupBorderThickness)) levelItem.groupBorderThickness = 0;
                    }
                    if (i != (isHierarchical ? actualindex - 1 : 0)) {
                        var cloneItems = subItems;
                        var PrevItem = this.model.levels[i - 1];
                        subItems = [];
                        if (levelItem == null) {
                            levelItem = this.model.leafItemSettings;
                        }
                        if (i == actualindex + 1) {
                            this._generateSubItems(cloneItems, levelItem, subItems, PrevItem, null, (actualindex + 1 != i), data.GroupingLevel);
                            if (this.showLabels())
                                this._generateLabels(subItems, levelItem);
                        }
                        else {
                            this._generateSubItems(cloneItems, levelItem, subItems, PrevItem, true, (actualindex + 1 != i), data.GroupingLevel);
                            if (!levelItem.showLabels && this.showLabels() && i == this.model.levels.length - 1)
                                this._generateLabels(subItems, levelItem);

                        }
                        this._rootTreeMapItems = subItems;
                        if ((i == actualindex + 1 || i == this.model.levels.length - 1) && !canExecute) {
                            if (this.showLegend() && this.model.colorPath) {
                                this._height = this.element.height();
                                this._width = this.element.width();
                                this._sizeCalculation(i == actualindex + 1 ? cloneItems : subItems);
                                this._legenddiv.empty();
                                this._legenddiv.css({
                                    "width": this._legendSize.width + "px",
                                    "height": this._legendSize.height + "px"
                                });
                                if (this.model.legendSettings.dockPosition.toLowerCase() == "top") {
                                    this._templateDiv.css({
                                        "margin-top": this._margintop
                                    });
                                    this._drillHeaderDiv.css({
                                        "top": this._legendSize.height
                                    });

                                    this._drillHoverDiv.css({
                                        "top": 30 + this._legendSize.height
                                    })
                                }
                                else if (this.model.legendSettings.dockPosition.toLowerCase() == "left") {
                                    this._drillHeaderDiv.css({
                                        "left": this._legendSize.width
                                    });
                                    this._drillHoverDiv.css({                                       
                                       "left": this._legendSize.width
                                    });
                                    this._templateDiv.css({
                                        "margin-left": this._marginleft
                                    });
                                }
                            }
                            this._generateTreeMapItems(subItems, "gray", PrevItem.DisplayPath, i == actualindex + 1 ? cloneItems : subItems);
                            canExecute = true;
                        }                        
                        
                        if (actualindex == this.model.levels.length - 1 && i == actualindex && levelItem.showLabels) {
                            this._generateLabels(subItems, levelItem);
                        }
                        if (i == data.GroupingLevel)
                            this.renderHeader = true;
                        else
                            this.renderHeader = false;

                    }
                    else {

                        var rootItems1 = this._getGroupitem(this.model.isHierarchicalDatasource ? null : levelItem.groupPath, data.Data, levelItem.headerHeight);
                        this._rootTreeMapItems = rootItems1;
                        this._getTopLevels(rootItems1, levelItem);
                        subItems = rootItems1;
                    }
                }
            }
            
            if (this.showLegend()) {
                this._generateLegend();
            }
            this._renderLabels();
            this.renderHeader = false;
            this._trigger("drillDownItemSelected", { level: actualindex, header: this.getDrillDownHeader(this._drilldownHeaders), prevLevel: actualindex - 1 });
        },

        _getTopLevels: function (rootItems, level) {
            var gap = (level.groupGap != null) ? level.groupGap : (level.gap!=null?level.gap:0);
            var layout = this.itemsLayoutMode();
            var legendHeight = 0;
            var defaultspacing = 0;
            if (this.enableDrillDown()) {
                defaultspacing = 30;
            }
            if (this.showLegend() && this.model.legendSettings != null) {
                legendHeight = legendHeight;                    
            }
                
            this._legendHeight = legendHeight;
            if (this.enableDrillDown()) {
                this._drillHeaderDiv.css({
                    "top": this.showLegend() && this.model.legendSettings.dockPosition.toLowerCase() == "top" ? this._legendSize.height : legendHeight
                });

                this._drillHoverDiv.css({
                    "top": 30 + (this.showLegend() && this.model.legendSettings.dockPosition.toLowerCase() == "top" ? this._legendSize.height : legendHeight)
                })
            }               
                
            if (layout == ej.datavisualization.TreeMap.ItemsLayoutMode.SliceAndDiceHorizontal) {
                this._calculateSliceAndDiceItemSize(rootItems, 0, legendHeight, this._width, this._height, gap, defaultspacing, true, legendHeight);
            }
            else if (layout == ej.datavisualization.TreeMap.ItemsLayoutMode.SliceAndDiceVertical) {
                this._calculateSliceAndDiceItemSize(rootItems, 0, legendHeight, this._width, this._height, gap, defaultspacing, false, legendHeight);
            }
            else if (layout == ej.datavisualization.TreeMap.ItemsLayoutMode.SliceAndDiceAuto) {
                this._calculateSliceAndDiceItemSize(rootItems, 0, legendHeight, this._width, this._height, gap, defaultspacing, null, legendHeight);
            }
            else {
                this._calculateSquarifiedItemSize(rootItems, 0, legendHeight, this._width, this._height, gap, defaultspacing, legendHeight);
            }
            
        },
      
        _generateSubItems: function (cloneItems, levelItem, subItems, PrevItem, disablelabels, disablebackground, groupingLevel, legendCalculation) {
            var grouppading = PrevItem.groupPadding;
            if (grouppading == "") { grouppading = 0; }
            var layout = this.itemsLayoutMode();
            var cloneItemsCount = cloneItems.length;
            var path = this.model.isHierarchicalDatasource ? null : levelItem.groupPath;
            if (path == null) path = this.labelPath();
            if (path == null) path = this.weightValuePath();
            var gap = (levelItem.groupGap != null) ? levelItem.groupGap : (levelItem.gap != null) ? levelItem.gap:0;
            var headerHeight = ((PrevItem.showHeader || PrevItem.showHeader == null)&& !this.enableDrillDown()) ? PrevItem.headerHeight : (this.renderHeader && PrevItem.showHeader? PrevItem.headerHeight :0);
            var totalItemsCount = 0;
            for (var j = 0; j < cloneItemsCount; j++) {
                var treeItems = this._getGroupitem(path, cloneItems[j].Data, levelItem.headerHeight, this.model.isHierarchicalDatasource ? PrevItem.groupPath : null);
                if (!legendCalculation) {
                    if (layout == ej.datavisualization.TreeMap.ItemsLayoutMode.SliceAndDiceHorizontal) {
                        this._calculateSliceAndDiceItemSize(treeItems, cloneItems[j].LeftPosition + parseFloat(grouppading), cloneItems[j].TopPosition + parseFloat(grouppading), cloneItems[j].ItemWidth - (PrevItem.groupBorderThickness + (2 * parseFloat(grouppading))), cloneItems[j].ItemHeight - (PrevItem.groupBorderThickness + (2 * parseFloat(grouppading))), parseFloat(gap), headerHeight, true, 0);
                    }
                    else if (layout == ej.datavisualization.TreeMap.ItemsLayoutMode.SliceAndDiceVertical) {
                        this._calculateSliceAndDiceItemSize(treeItems, cloneItems[j].LeftPosition + parseFloat(grouppading), cloneItems[j].TopPosition + parseFloat(grouppading), cloneItems[j].ItemWidth - (PrevItem.groupBorderThickness + (2 * parseFloat(grouppading))), cloneItems[j].ItemHeight - (PrevItem.groupBorderThickness + (2 * parseFloat(grouppading))), parseFloat(gap), headerHeight, false, 0);
                    }
                    else if (layout == ej.datavisualization.TreeMap.ItemsLayoutMode.SliceAndDiceAuto) {
                        this._calculateSliceAndDiceItemSize(treeItems, cloneItems[j].LeftPosition + parseFloat(grouppading), cloneItems[j].TopPosition + parseFloat(grouppading), cloneItems[j].ItemWidth - (PrevItem.groupBorderThickness + (2 * parseFloat(grouppading))), cloneItems[j].ItemHeight - (PrevItem.groupBorderThickness + (2 * parseFloat(grouppading))), parseFloat(gap), headerHeight, null, 0);
                    }
                    else {
                        this._calculateSquarifiedItemSize(treeItems, cloneItems[j].LeftPosition + parseFloat(grouppading), cloneItems[j].TopPosition + parseFloat(grouppading), cloneItems[j].ItemWidth - (PrevItem.groupBorderThickness + (2 * parseFloat(grouppading))), cloneItems[j].ItemHeight - (PrevItem.groupBorderThickness + (2 * parseFloat(grouppading))), parseFloat(gap), headerHeight, 0);
                    }
                    var headerItem = this._rootTreeMapItems[j];
                    headerItem.headerHeight = PrevItem.headerHeight;
                    headerItem.showHeader = PrevItem.showHeader;
                    headerItem.headerWidth = cloneItems[j].ItemWidth;
                    headerItem.headerTemplate = PrevItem.headerTemplate;
                    headerItem.headerLeftPosition = cloneItems[j].LeftPosition;
                    headerItem.headerTopPosition = cloneItems[j].TopPosition;

                    if (this.enableDrillDown())
                        this._createBackGround(headerItem, PrevItem, cloneItems[j], disablebackground);

                    if (PrevItem.showHeader || PrevItem.showHeader == null) {

                        if (!this.enableDrillDown()) {
                            this._createBackGround(headerItem, PrevItem, cloneItems[j]);
                            this._trigger("headerTemplateRendering", {
                                levelItems: this._rootTreeMapItems,
                                childItems: headerItem.Data,
                                headerItem: headerItem,
                                groupPath: PrevItem.groupPath,
                                groupingLevel: groupingLevel,
                                prevItem: PrevItem
                            });
                            this._generateHeaders(headerItem, PrevItem);
                        }
                        else {
                            if (!this.renderHeader) {
                                this.previousItem = headerItem;
                            }
                            if (groupingLevel == 0 || groupingLevel == undefined || groupingLevel == null)
                                this.previousItem = null;
                            if (this.renderHeader) {
                                this._trigger("headerTemplateRendering", {
                                    levelItems: this._rootTreeMapItems,
                                    childItems: headerItem.Data,
                                    headerItem: headerItem,
                                    groupPath: PrevItem.groupPath,
                                    groupingLevel: ej.util.isNullOrUndefined(groupingLevel) ? 0 : groupingLevel,
                                    prevItem: this.previousItem
                                });
                                this._generateHeaders(headerItem, PrevItem);
                            }
                        }
                    }
                }
                cloneItems[j].ChildtreeMapItems = treeItems;
                cloneItems[j].GroupingLevel = this.model.levels.indexOf(PrevItem) + 1;
				
                if (this.model.levels.indexOf(PrevItem) == 0 && !legendCalculation) {
                    if (this.model.groupColorMapping != null && this.model.groupColorMapping.length > 0){
                        this._isLevelColors= true;
                        for (var a = 0; a < this.model.groupColorMapping.length; a++){
                            var colormapping = this.model.groupColorMapping[a];
                            if (colormapping.groupID == headerItem.header){
                                this._setColorMappings(treeItems, colormapping,true);
                            }
                        }
                    }
                }
                else if (this.model.levels.indexOf(PrevItem) > 0 && !legendCalculation)
                {				
                    if (this.model.groupColorMapping != null  && this.model.groupColorMapping.length > 0){
                        for (var a = 0; a < this.model.groupColorMapping.length; a++){				
                            var colormapping = this.model.groupColorMapping[a];
                            if (colormapping.groupID == cloneItems[j].ParentHeader){
                                this._setColorMappings(treeItems, colormapping,true);
                            }
                        }
                    }
                }
				
                for (var k = 0; k < treeItems.length; k++) {
                    subItems[totalItemsCount] = treeItems[k];
                    if (treeItems[k].backgroundColor == null)
                        treeItems[k].backgroundColor = cloneItems[j].backgroundColor;
                    if (treeItems[k].backgroundOpacity == null)
                        treeItems[k].backgroundOpacity = cloneItems[j].backgroundOpacity;                   
                    if (((this.enableDrillDown()) || (subItems[totalItemsCount].ItemHeight < headerItem.ItemHeight - headerItem.headerHeight)) && !legendCalculation) {
                        subItems[totalItemsCount].ParentHeader = headerItem.header;
                        subItems[totalItemsCount].ItemHeight -= grouppading;
                        subItems[totalItemsCount].ItemWidth -= grouppading;
                        subItems[totalItemsCount].LeftPosition += PrevItem.groupBorderThickness;
                        subItems[totalItemsCount].TopPosition += PrevItem.groupBorderThickness;
                       
                    }
                    totalItemsCount++;
                }              
            }
            if (disablelabels == undefined && PrevItem.showLabels && !legendCalculation) {
                this._generateLabels(cloneItems, PrevItem);
            }
        },
       
        _createBackGround: function (header, level,parentitem, disablebackground) {            
            var rect = $("<div />");
            var height = (header.showHeader || header.showHeader == null || this.enableDrillDown()) ? header.ItemHeight - (2 * level.groupBorderThickness) : 0;
            var top = (header.showHeader || header.showHeader == null || this.enableDrillDown()) ? header.TopPosition : 0;
            rect.css({
                "height": height + "px",
                "width": header.ItemWidth - (2 * level.groupBorderThickness) + "px",
                "left": header.LeftPosition + "px",
                "top": top + "px",
                "border-style": "solid",
                "border-width": level.groupBorderThickness+"px",
                "position": "absolute"               
            });

            if(level.groupBorderColor!=null)
            {
                rect.css("border-color",level.groupBorderColor);
            }
            if(level.groupBackground!=null)
            {
                rect.css("background-color",level.groupBackground);
            }
            this.treemapgroups.push({header:header.header,element:rect});
            rect.appendTo(this._backgroundTile);
            var height = parseFloat(rect[0].style.top) - 30 - this._legendHeight + "px";            
            if (this.enableDrillDown() && !disablebackground) {
                var hoverrect = $("<div class='e-drillGroupRect'/>");
                hoverrect.css({
                    "height": rect[0].style.height,
                    "width": rect[0].style.width,
                    "left": rect[0].style.left,
                    "top": height,
                    "position": "absolute",
                    "opacity": 0.2,
                    "display": "block"
                });
                this._drillHoverDiv.append(hoverrect);
                $(hoverrect).mousedown({ treemap: this, level: level, param1: parentitem }, this._headerClickFunction);
                $(hoverrect).mouseleave({ treemap: this, param1: header.header }, this._mouseLeaveFunction);
                var hoverData = { data: header.Data, label:header.header, header: header.header };
                $(hoverrect).mousemove({ treemap: this, hoverItem: hoverData }, this._mouseRectHoverFunction);
            }
            $(rect).mousedown({ treemap: this, level: level, param1: parentitem }, this._headerClickFunction);
            $(rect).mousemove({ treemap: this, hoverItem: header.Data }, this._mouseRectHoverFunction);
        },

        _mouseRectHoverFunction: function (event) {
          
            var treeMap = event.data.treemap;
            var item = event.data.hoverItem;
            if (treeMap.showTooltip()) {
                var element = treeMap._toolTipElement;
                var template = treeMap.model.tooltipTemplate;
                if (element != null && template != null) {
                    $(element).css({ "left": event.pageX + 10, "top": event.pageY + 10, "display": "block" });
                    var htmlString = $("#" + template).render(item);
                    $(element).html(htmlString);
                    var height = element[0] != null ? element[0].clientHeight : element.clientHeight;
                    var width = element[0] != null ? element[0].clientWidth : element.clientWidth;
                    treeMap._tooltipSize = { height: height, width: width };
                }

                var tooltipSize = treeMap._tooltipSize, pageX, pageY;
                if (tooltipSize.width + event.pageX >= treeMap._width) {
                    pageX = event.pageX - tooltipSize.width;
                    if (pageX < 0) {
                        pageX = 10;
                    }
                }
                if (tooltipSize.height + event.pageY >= treeMap._height) {
                    pageY = event.pageY - tooltipSize.height;
                    if (pageY < 0) {
                        pageY = 10;
                    }
                }               
                if (element != null) {

                    if (treeMap.enableDrillDown()) {
                        $(element).css({ "left": event.pageX + 10, "top": event.pageY + 10, "display": "block" });

                    }
                    else {
                        $(element).css({ "left": event.pageX + 10, "top": event.pageY + 10, "display": "none" });

                    }

                }

            }
        },		        
               
        _mouseLeaveFunction: function (event) {
            var treeMap = event.data.treemap;
            if (treeMap.showTooltip())
            {
                if (treeMap._toolTipElement != null) {
                    $(treeMap._toolTipElement).css("display", "none");
                }
            }
        },
		       
        _headerClickFunction: function (event) {
            var level = event.data.level;
            var data = event.data.param1;
            var ctrlkey = event.ctrlKey;
            var treeMap = event.data.treemap;
            if (treeMap.highlightGroupOnSelection()) {
                if (treeMap._browser != "msie") {
                    var lastItem = treeMap._backgroundTile[0].children[treeMap._backgroundTile[0].children.length - 0];
                    treeMap._backgroundTile[0].insertBefore(this, lastItem);
                }
                if (treeMap.groupSelectionMode() == "multiple" &&  ctrlkey) {

                    if ($.inArray(this,treeMap._prevSelectedHeaders)==-1) {
                        $(this).css({ "border-width": treeMap.model.highlightGroupBorderThickness, "border-color": treeMap.highlightBorderBrush() });
                        treeMap._prevSelectedHeaders.push(this);
                        treeMap._prevSelectedGroupDatas.push(event.data.Param1);
                    }
                    else {
                        
                        $(this).css({ "border-width": level.groupBorderThickness, "border-color": level.groupBorderColor });
                        var index = treeMap._prevSelectedHeaders.indexOf(this);
                        treeMap._prevSelectedHeaders.splice(index, 1);
                        treeMap._prevSelectedGroupDatas.splice(index, 1);
                    }
                }
                else {
                    for (var k = 0; k < treeMap._prevSelectedHeaders.length; k++) {
		               
                        $(treeMap._prevSelectedHeaders[k]).css({ "border-width": level.groupBorderThickness, "border-color": level.groupBorderColor });
                    }

                    if ($.inArray(this, treeMap._prevSelectedHeaders) == -1) {
                        $(this).css({ "border-width": treeMap.model.highlightGroupBorderThickness, "border-color": treeMap.highlightBorderBrush() });
                        treeMap._prevSelectedHeaders = [];
                        treeMap._prevSelectedHeaders.push(this);
                    }
                    else {
                        treeMap._prevSelectedHeaders = [];
                    }
		            
                    treeMap._prevSelectedGroupDatas.push(event.data.Param1);
                }
            }
            if (treeMap.enableDrillDown())
            {
                treeMap._trigger("drillStarted", event);
            }
			if (treeMap.enableDrillDown() && treeMap.model.levels.length > 1 && ((treeMap._drilldownItem != null && treeMap._drilldownItem.header != data.header) || treeMap._drilldownItem == null)) {
                    var header = "";
                    for(var i=0;i< treeMap._drillHeaderDiv[0].children[0].children.length;i++)
                    {
                        if (treeMap._drillHeaderDiv[0].children[0].children[i].className == "e-drilldownlabel")
                            header = treeMap._drillHeaderDiv[0].children[0].children[i].innerHTML;
                    }
                    treeMap._backgroundTile[0].innerHTML = "";
                    treeMap._labelTemplateElements = [];
                    treeMap._drillHeaderDiv[0].innerHTML = "";
                    treeMap._templateDiv[0].innerHTML = "";
                    treeMap._drillHoverDiv[0].innerHTML = "";
                    treeMap._originalHeaders.push(data.header);
                    treeMap._drilldownHeaders.push(data.header);
                    var treemapLevel = treeMap.model.levels[treeMap._drilldownHeaders.length - 1];
                    treemapLevel.groupingLevel = data.GroupingLevel; 
                    treeMap._drillDownHeader(true, treemapLevel, data.Data);
                     treeMap._drilldownItem = data;
                    treeMap._drilldownItems.push(data);
                    treeMap._groupdrillDownLevels(data, treeMap._drilldownItems.length);
                    return false;
		       		        
                }
            },
            
       _rectMouseDown: function (event) {
           var treeMap = event.data.treeMap;
            if (treeMap.isTouch(event) && treeMap.model.doubleClick != '' && treeMap.model.rightClick != '')
                event.preventDefault();

        },
        _docClickFunction: function (event) {
            var treeMap = event.data.treemap;
            var element = this._toolTipElement, treemap = this;
            clearTimeout(treemap.model.timer);
            if (element) {
                treemap.model.trackerElement = element;
                treemap.model.timer = setTimeout(function () {
                    if (treemap.model.trackerElement)
                        $(treemap.model.trackerElement).fadeOut(500, function () {
                            treemap.model.trackerElement = null;
                        });

                }, 1200);

            }
            if(ej.isTouchDevice() && this.model.rightClick != '' && new Date() - this._longPressTimer > 1500)
                this._tmRightClick(event);
        },
        mousePosition: function (evt) {
            if (!ej.util.isNullOrUndefined(evt.pageX) && evt.pageX > 0)
                return evt;
            else if (evt.originalEvent && !ej.util.isNullOrUndefined(evt.originalEvent.pageX) && evt.originalEvent.pageX > 0)
                return evt.originalEvent;
            else if (evt.originalEvent && evt.originalEvent.changedTouches != undefined) {
                if (!ej.util.isNullOrUndefined(evt.originalEvent.changedTouches[0].pageX) && evt.originalEvent.changedTouches[0].pageX > 0)
                    return evt.originalEvent.changedTouches[0];
            }
            return evt;

        },
        _highlightTreemap: function (event) {
            var treeMap = event.data.treemap,
                itemCollection = event.data.Param1,
                level = treeMap.model.levels[0], tooltipObject, isContain, tooltipContain, ctrlkey = event.ctrlKey,
                selectedGroup, item, rect,
                pointer = treeMap.mousePosition(event);
            if (treeMap.highlightGroupOnSelection()) {
                for (var i = 0; i < treeMap.treemapgroups.length; i++) {
                    selectedGroup = treeMap.treemapgroups[i];
                    item = treeMap.treemapgroups[i].element;
                    rect = item[0].getBoundingClientRect();

                    if (rect.left < pointer.clientX && rect.left + rect.width > pointer.clientX
                   && rect.top < pointer.clientY && rect.top + rect.height > pointer.clientY) {
                        $(item).css({
                            "border-width": treeMap.model.highlightGroupBorderThickness, "border-color": treeMap.highlightBorderBrush(),
                            "box-sizing": "border-box",
                            "-moz-box-sizing": "border-box",
                            "-webkit-box-sizing": "border-box",
                        });
                        isContain = true;
                        break;
                    }
                }
                if (isContain) {
                    if (treeMap.groupSelectionMode() == "multiple" && ctrlkey) {

                        if ($.inArray(item, treeMap._prevSelectedHeaders) == -1) {
                            $(item).css({ "border-width": treeMap.model.highlightGroupBorderThickness, "border-color": treeMap.highlightBorderBrush() });
                            treeMap._prevSelectedHeaders.push(selectedGroup);
                            treeMap._prevSelectedGroupDatas.push(event.data.Param1);
                        }
                        else {

                            $(item).css({ "border-width": level.groupBorderThickness, "border-color": level.groupBorderColor, });
                            var index = treeMap._prevSelectedHeaders.indexOf(selectedGroup);
                            treeMap._prevSelectedHeaders.splice(index, 1);
                            treeMap._prevSelectedGroupDatas.splice(index, 1);
                        }
                    }
                    else {
                        for (var k = 0; k < treeMap._prevSelectedHeaders.length; k++) {

                            $(treeMap._prevSelectedHeaders[k].element).css({ "border-width": level.groupBorderThickness, "border-color": level.groupBorderColor });
                        }

                        if ($.inArray(item, treeMap._prevSelectedHeaders) == -1) {
                            $(item).css({ "border-width": treeMap.model.highlightGroupBorderThickness, "border-color": treeMap.highlightBorderBrush() });
                            treeMap._prevSelectedHeaders = [];
                            treeMap._prevSelectedHeaders.push(selectedGroup);
                        }
                        else {
                            treeMap._prevSelectedHeaders = [];
                        }

                        treeMap._prevSelectedGroupDatas.push(event.data.Param1);
                    }
                }
                treeMap._trigger("treeMapGroupSelected", { selectedGroups: treeMap._prevSelectedHeaders, orginalEvent: event });
            }

            if (treeMap.highlightOnSelection()) {

                for (var i = 0; i < treeMap._rootTreeMapItems.length; i++) {
                    var item = treeMap._rootTreeMapItems[i];
                    var rect = item.Rectangle.getBoundingClientRect();
                    if (rect.left < pointer.clientX && rect.left + rect.width > pointer.clientX
                        && rect.top < pointer.clientY && rect.top + rect.height > pointer.clientY) {
                        $(item.Rectangle).css({
                            "border-width": treeMap.highlightBorderThickness(), "border-color": treeMap.highlightBorderBrush(),
                            "box-sizing": "border-box",
                            "-moz-box-sizing": "border-box",
                            "-webkit-box-sizing": "border-box",
                        });
                        isContain = true;
                        break;
                    }
                }

                if (isContain) {
                    if (treeMap.selectionMode() == "multiple" && ctrlkey) {
                        if ($.inArray(item.Rectangle, treeMap._prevSelectedItems) == -1) {
                            $(item.Rectangle).css({
                                "border-width": treeMap.highlightBorderThickness(), "border-color": treeMap.highlightBorderBrush(),
                                "box-sizing": "border-box",
                                "-moz-box-sizing": "border-box",
                                "-webkit-box-sizing": "border-box",
                            });
                            treeMap._prevSelectedItems.push(item.Rectangle);
                            treeMap.selectedItems.push(item.Data);
                        }
                        else {
                            $(item.Rectangle).css({ "border-width": treeMap.borderThickness(), "border-color": treeMap.borderBrush() });
                            var index = treeMap._prevSelectedItems.indexOf(item.Rectangle);
                            treeMap._prevSelectedItems.splice(index, 1);
                            treeMap.selectedItems.splice(index, 1);
                        }
                    }
                    else {
                        for (var k = 0; k < treeMap._prevSelectedItems.length; k++) {
                            $(treeMap._prevSelectedItems[k]).css({ "border-width": treeMap.borderThickness(), "border-color": treeMap.borderBrush() });
                        }

                        if ($.inArray(item.Rectangle, treeMap._prevSelectedItems) == -1) {
                            $(item.Rectangle).css({ "border-width": treeMap.highlightBorderThickness(), "border-color": treeMap.highlightBorderBrush() });
                            treeMap._prevSelectedItems = [];
                            treeMap.selectedItems = [];
                            treeMap._prevSelectedItems.push(item.Rectangle);
                            treeMap.selectedItems.push(item.Data);
                        }
                        else {
                            treeMap._prevSelectedItems = [];
                            treeMap.selectedItems = [];
                        }
                    }
                    treeMap._trigger("treeMapItemSelected", { selectedItems: treeMap.selectedItems, originalEvent: event });
                }

            }
          
        },
        doubleTap: function (event) {

            var pointer = event.targetTouches ? event.targetTouches[0] : event,
               currX = pointer.pageX,
               currY = pointer.pageY,
               model = this.model,
               padding = 200,
               element,

               treeMap = event.data.treemap;

            treeMap.model.cachedX = treeMap.model.cachedX || currX;

            treeMap.model.cachedY = treeMap.model.cachedY || currY;

            var timestamp = new Date().getTime();


            if (Math.abs(currX - treeMap.model.cachedX) < padding && Math.abs(currY - treeMap.model.cachedY) < padding)
                treeMap.model.tapNum++;

        },

        rectClick: function (event) {

            var treeMap = event.data.treemap;
            treeMap.doubleTap(event);
            if (!treeMap.isTouch(event)) {
                treeMap._highlightTreemap(event);
            }
            if(ej.isTouchDevice() && this.model.rightClick != '')
                this._longPressTimer = new Date();
        },        
            dragDown: function (event) {

                var treeMap = event.data.treemap;
                var level = treeMap.model.levels[0];

                var treeMapArea = treeMap._svgDocument;
                if (event.type == "mousedown") {
                    treeMap._startPoint = { x: event.pageX - treeMapArea[0].offsetLeft, y: event.pageY - treeMapArea[0].offsetTop };
                    treeMap._stopPoint = { x: event.pageX - treeMapArea[0].offsetLeft, y: event.pageY - treeMapArea[0].offsetTop };
                }
                else if (event.type == "touchstart") {
                    treeMap._startPoint = { x: event.originalEvent.changedTouches[0].pageX - treeMapArea[0].offsetLeft, y: event.originalEvent.changedTouches[0].pageY - treeMapArea[0].offsetTop };
                    treeMap._stopPoint = { x: event.originalEvent.changedTouches[0].pageX - treeMapArea[0].offsetLeft, y: event.originalEvent.changedTouches[0].pageY - treeMapArea[0].offsetTop };
                }
                else if (event.type == "MSPointerDown") {
                    treeMap._startPoint = { x: event.originalEvent.pageX - treeMapArea[0].offsetLeft, y: event.originalEvent.pageY - treeMapArea[0].offsetTop };
                    treeMap._stopPoint = { x: event.originalEvent.pageX - treeMapArea[0].offsetLeft, y: event.originalEvent.pageY - treeMapArea[0].offsetTop };
                }

                treeMap.mouseClickable = true;

                if (treeMap.model.draggingGroupOnSelection) {

                    if (treeMap._prevSelectedGroupDatas.length > 0) {
                        for (var i = 0; i < treeMap._prevSelectedGroupDatas.length; i++) {
                            var item = treeMap._prevSelectedGroupDatas[i][0];
                            var rect = item.getBoundingClientRect();
                            if ($.inArray(item, treeMap._prevSelectedGroupDatas[i][0]) == -1) {
                                $(treeMap._prevSelectedGroupDatas[i]).css({ "border-width": level.groupBorderThickness, "border-color": treeMap.model.highlightGroupBorderBrush });
                            }
                        }
                        treeMap._prevSelectedGroupDatas = [];
                    }
                }

                if (treeMap.model.draggingOnSelection) {

                    if (treeMap._prevSelectedItems.length > 0) {
                        for (var i = 0; i < treeMap._prevSelectedItems.length; i++) {
                            var item = treeMap._prevSelectedItems[i].rectangle;
                            var rect = item.getBoundingClientRect();
                            if ($.inArray(item, treeMap._prevSelectedItems[i].rectangle) == -1) {
                                $(treeMap._prevSelectedItems[i].rectangle).css({ "border-width": level.groupBorderThickness, "border-color": treeMap.model.highlightGroupBorderBrush });
                            }
                        }
                        treeMap._prevSelectedItems = [];
                    }
                }
            },

            dragMove: function (event) {

                var width; var height;
                var treeMap = event.data.treemap;
                var treeMapArea = treeMap._svgDocument;

                if (treeMap.model.draggingGroupOnSelection || treeMap.model.draggingOnSelection) {

                    if (treeMap.mouseClickable) {

                        if (event.type == "mousemove")
                            treeMap._stopPoint = { x: event.pageX - treeMapArea[0].offsetLeft, y: event.pageY - treeMapArea[0].offsetTop };
                        else if (event.type == "touchmove")
                            treeMap._stopPoint = { x: event.originalEvent.changedTouches[0].pageX - treeMapArea[0].offsetLeft, y: event.originalEvent.changedTouches[0].pageY - treeMapArea[0].offsetTop };
                        else if (event.type == "MSPointerMove")
                            treeMap._stopPoint = { x: event.originalEvent.pageX - treeMapArea[0].offsetLeft, y: event.originalEvent.pageY - treeMapArea[0].offsetTop };


                        $('#dragDiv').remove();
                        var div = $('<div id = "dragDiv"></div>');

                        width = Math.abs(treeMap._stopPoint.x - treeMap._startPoint.x),
                        height = Math.abs(treeMap._stopPoint.y - treeMap._startPoint.y);
                        $(div).css({ "top": Math.min(treeMap._startPoint.y, treeMap._stopPoint.y), "left": Math.min(treeMap._startPoint.x, treeMap._stopPoint.x), width: width, height: height, border: "1px solid green", position: "absolute", "z-index": 100 });
                        $(div).appendTo("#svgDocument");
                    }
                }
            },

            dragUp: function (event) {

                var treeMap = event.data.treemap;
                var width = Math.abs(treeMap._stopPoint.x - treeMap._startPoint.x);
                var height = Math.abs(treeMap._stopPoint.y - treeMap._startPoint.y);
                var treeMapArea = treeMap._svgDocument;

                if (treeMap.model.draggingGroupOnSelection || treeMap.model.draggingOnSelection) {

                    $('#dragDiv').remove();
                    $("#dragDiv").css({
                        "display": "none"
                    });
                    treeMap.mouseClickable = false;
                }

                if (treeMap.model.draggingGroupOnSelection) {

                    for (var i = 0; i < treeMap.treemapgroups.length; i++) {
                        var item = treeMap.treemapgroups[i].element;
                        var rect = item[0].getBoundingClientRect();

                        if (!(rect.left - treeMapArea[0].offsetLeft + rect.width < Math.min(treeMap._startPoint.x, treeMap._stopPoint.x) || Math.min(treeMap._startPoint.x, treeMap._stopPoint.x) + width < rect.left - treeMapArea[0].offsetLeft ||
                            rect.top - treeMapArea[0].offsetTop + rect.height < Math.min(treeMap._startPoint.y, treeMap._stopPoint.y) || Math.min(treeMap._startPoint.y, treeMap._stopPoint.y) + height < rect.top - treeMapArea[0].offsetTop)) {
                            if (!treeMap._contains(treeMap._prevSelectedGroupDatas, item))
                                treeMap._prevSelectedGroupDatas.push(item);
                        }
                    }

                    for (var i = 0; i < treeMap._prevSelectedGroupDatas.length; i++) {
                        var item = treeMap._prevSelectedGroupDatas[i][0];
                        var rect = item.getBoundingClientRect();

                        $(item).css({
                            "border-width": treeMap.model.highlightGroupBorderThickness, "border-color": treeMap.model.highlightGroupBorderBrush,
                            "box-sizing": "border-box",
                            "-moz-box-sizing": "border-box",
                            "-webkit-box-sizing": "border-box",
                        });
                    }
                    treeMap.selectedItems.push(treeMap._prevSelectedGroupDatas);
                }

                if (treeMap.model.draggingOnSelection) {

                    for (var i = 0; i < treeMap._rootTreeMapItems.length; i++) {
                        var item = treeMap._rootTreeMapItems[i];
                        var rect = item.rectangle.getBoundingClientRect();

                        if (!(rect.left - treeMapArea[0].offsetLeft + rect.width < Math.min(treeMap._startPoint.x, treeMap._stopPoint.x) || Math.min(treeMap._startPoint.x, treeMap._stopPoint.x) + width < rect.left - treeMapArea[0].offsetLeft ||
                             rect.top - treeMapArea[0].offsetTop + rect.height < Math.min(treeMap._startPoint.y, treeMap._stopPoint.y) || Math.min(treeMap._startPoint.y, treeMap._stopPoint.y) + height < rect.top - treeMapArea[0].offsetTop)) {
                            if (!treeMap._contains(treeMap._prevSelectedItems, item))
                                treeMap._prevSelectedItems.push(item);
                        }
                    }

                    for (var i = 0; i < treeMap._prevSelectedItems.length; i++) {
                        var item = treeMap._prevSelectedItems[i].rectangle;
                        var rect = item.getBoundingClientRect();
                        $(item).css({
                            "border-width": treeMap.model.highlightGroupBorderThickness, "border-color": treeMap.model.highlightGroupBorderBrush,
                            "box-sizing": "border-box",
                            "-moz-box-sizing": "border-box",
                            "-webkit-box-sizing": "border-box",
                        });
                    }
                    treeMap.selectedItems.push(treeMap._prevSelectedItems);
                }
            },
            _measureText: function (text, maxwidth, font) {
                var element = $(document).find("#measureTex");
                $("#measureTex").css('display', 'block'); 
                if (element.length == 0) {
                    var textObj = document.createElement('text');
                    $(textObj).attr({ 'id': 'measureTex' });
                    document.body.appendChild(textObj);
                }
                else {
                    var textObj = element[0];
                }
                var style = null, size = null, family = null, weight = null;
                if (typeof (text) == "string" && (text.indexOf("<") > -1 || text.indexOf(">") > -1)) {
                    var textArray = text.split(" ");
                    for (var i = 0; i < textArray.length; i++) {
                        if (textArray[i].indexOf("<br/>") == -1)
                            textArray[i] = textArray[i].replace(/[<>]/g, '&');
                    }
                    text = textArray.join(' ');
                }
                textObj.innerHTML = text;
                if (font != undefined && font.size == undefined) {
                    var fontarray = font;
                    fontarray = fontarray.split(" ");
                    style = fontarray[0];
                    size = fontarray[1];
                    family = fontarray[2];
                    weight = fontarray[3];
                }
                if (font != null) {
                    textObj.style.fontSize = (font.size > 0) ? (font.size + "px") : font.size ? font.size : size;
                    if (textObj.style.fontStyle)
                        textObj.style.fontStyle = (font.fontStyle) ? font.fontStyle : style;
                    textObj.style.fontFamily = font.fontFamily ? font.fontFamily : family;
                }
                textObj.style.backgroundColor = 'white';
                textObj.style.position = 'absolute';
                textObj.style.top = -100;
                textObj.style.left = 0;
                textObj.style.visibility = 'hidden';
                textObj.style.whiteSpace = 'nowrap';
                if (maxwidth)
                    textObj.style.maxwidth = maxwidth + "px";
                var bounds = { width: textObj.offsetWidth, height: textObj.offsetHeight };
                $("#measureTex").css('display', 'none'); 
                return bounds;
            },
            _rowsCalculation: function (label, itemWidth, itemHeight, textOverflow, font, labelPosition) {
                var treemap = this,
                    treemapModel = treemap.model,
                    word, textCollection = [], currentWidth, nextWidth,
                    text = label ? label.toString() : "",
                    textLength = text.length,
                    textWidth = this._measureText(text, itemWidth, font).width,
                    textHeight = this._measureText(text, itemWidth, font).height,
                    labelCollection = text.split(' '), i = 0, line = 0, currentTextCollextion,
                    itemMaxWidth = Math.round(itemWidth),
                    labelLength = labelCollection.length,
                    labelPosition = labelPosition.toLowerCase(),
                    itemHeight = (labelPosition == "centerleft" || labelPosition == "center" || labelPosition == "centerright") ? itemHeight / 2 : itemHeight;
                if (textOverflow == 'wrap' || textOverflow =="hide") {
                    if (textWidth > itemMaxWidth) {
                        for (var w = 1; w <= text.length; w++) {
                            label = text.substring(0, w);
                            textWidth = this._measureText(label, itemWidth, font).width;
                            if (textWidth > itemMaxWidth) {
                                line = line + 1; // To find the no of rows splitted
                                label = text.substring(0, w - 1);
                                if (label == '') break;
                                if(line * textHeight < itemHeight)
                                  textCollection[i] = label;
                                text = text.slice(w - 1, textLength);                           
                                i++;
                                w = 0;
                            }
                        }
                    }
                    line = line + 1;
                    if (line * textHeight < itemHeight) textCollection[i] = label;                    
                    if (textOverflow == "hide" || (textOverflow == "wrap" && (labelPosition == "bottomleft"|| labelPosition=="bottomright" || labelPosition=="bottomcenter"))) {
                        textCollection = textCollection.slice(0,1);
                    }
                    return textCollection;
                }
                else if(textOverflow == 'wrapbyword'){
                    for (var i = 0; i < labelLength; i++) {
                        word = labelCollection[i];
                        currentWidth = this._measureText(word, itemWidth, font).width;
                        line = line + 1;
                        if (currentWidth < itemMaxWidth) {                            
                            while (i < labelLength) {
                                currentWidth = this._measureText(word, itemWidth, font).width;
                                nextWidth = (labelCollection[i + 1]) ? this._measureText(labelCollection[i + 1],itemWidth,font).width : 0;
                                nextWidth = Math.round(nextWidth);
                                if ((currentWidth + nextWidth) < itemMaxWidth && nextWidth > 0) {
                                    word = word.concat(' ' + labelCollection[i + 1]);
                                    i++;
                                }
                                else {
                                    break;
                                }
                            }
                            if (line * textHeight < itemHeight) textCollection.push(word);
                        }
                    }
                    if (labelPosition == "bottomleft" || labelPosition == "bottomright" || labelPosition=="bottomcenter")
                        textCollection = textCollection.slice(0, 1);
                    return textCollection;
                }                
            },
			getStyleRuleValue: function(style, selector) {
                var sheets = typeof sheet !== 'undefined' ? [sheet] : document.styleSheets;
                    for (var i = 0, l = sheets.length; i < l; i++) {
                        var sheet = sheets[i];
                        try{
                            if( !sheet.cssRules ) { continue; }
                            for (var j = 0, k = sheet.cssRules.length; j < k; j++) {
                                var rule = sheet.cssRules[j];
                                if (rule.selectorText && rule.selectorText.split(',').indexOf(selector) !== -1) {
                                    return rule.style[style];
                                }
                            }
                        }
                        catch(e){
                            if(e.name.toLowerCase() !== "securityerror") {
                                throw e;
                            }
                        }
                    }
                    return null;
            },
            _generateLabels: function (Items, level) {
                var textOverflow = this.model.leafItemSettings.textOverflow.toLowerCase();
            for (var i = 0; i < Items.length; i++) {
                var item = Items[i];
                    if (level.labelTemplate != null && textOverflow != "none") {
                        var labelNode = document.getElementById(level.labelTemplate);
                        	str = labelNode.innerHTML,
                        	$str1 = $(str),
                        	text = $str1.find('label').eq(0).text(),
                        	labelPath = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""),
                        	labelText = item.Data[labelPath];
                    }
                    if(level.labelTemplate != null && textOverflow == "none") {
                        var OriginalNode = $("#" + level.labelTemplate);
                        var item_templateDiv = $("<div style='overflow:hidden;display:block;position:absolute;pointer-events: none;'></div>");
                        item_templateDiv[0].data = item;
                        item.labelPosition = level.labelPosition;
                        item.labelVisibilityMode = level.labelVisibilityMode;
                        var tmpl2 = $.templates(OriginalNode.html());
                        var htmlString = "";
                        if (item.Data instanceof Array) {
                            htmlString = tmpl2.render(item.Data[0]);
                        }
                        else
                            htmlString = tmpl2.render(item.Data);
                        $(item_templateDiv).html(htmlString);
                        this._templateDiv.append(item_templateDiv);
                        this._labelTemplateElements.push(item_templateDiv);
                    }
                    else {                    
                    var leftpaddingsize = 8;
                    var toppaddingsize = 5;
                    var fontsize = this.getStyleRuleValue('font-size', '.e-treemap-label');
                    fontsize = ej.util.isNullOrUndefined(fontsize)? "14px" : fontsize;
                    var label = level.labelTemplate != null ? labelText : item.label,                      
                        textOverflow = this.model.leafItemSettings.textOverflow.toLowerCase();
                        if (level.labelTemplate==null) {
                            var itemWidth = Math.round(item.ItemWidth - (2 * leftpaddingsize));
                            var itemHeight = Math.round(item.ItemHeight - 2 * toppaddingsize - (item.showHeader? item.headerHeight:0));
                            var font = { fontWeight: 'Normal', size: fontsize, color: 'black'};
                        }
                        else {
                            var font = { fontWeight: 'Normal', size: '16px', color: 'black'};
                            var itemWidth = Math.round(item.ItemWidth);
                            var itemHeight = Math.round(item.ItemHeight);
                        }
                    if (textOverflow != "none")
                        var labelCollection = this._rowsCalculation(label, itemWidth,itemHeight, textOverflow, font,level.labelPosition);
                    else {
                        var labelCollection = [];
                        labelCollection.push(label);
                    }
                    var textcon = [];
                    for (var j = 0; j < labelCollection.length; j++) {

                        if (level.labelTemplate == null)
                            textcon[j] = $('<label class="e-treemap-label" >' + labelCollection[j] + '</label>');
                        else
                            textcon[j] = $('<label>' + labelCollection[j] + '</label>');
                   
                            if (this.enableDrillDown()) {
                                $(textcon[j]).css({
                                    "position": "absolute", "color": "black",
                            "overflow": "hidden",  "left": item.LeftPosition + leftpaddingsize + "px",
                            "top": item.TopPosition + toppaddingsize + "px", "font-weight":"normal","pointer-events":"none"
                        });
                    }
                    else
                    {
                        $(textcon[j]).css({
                            "position": "absolute", "color": level.labelTemplate == null ? "white" :"black",
                            "overflow": "hidden", "left": item.LeftPosition + leftpaddingsize + "px",
                            "top": item.TopPosition + toppaddingsize + "px", "font-weight": "normal", "pointer-events": "none"
                        });
                    }
                    this._treeMapLabels.push(textcon[j]);
                    this._templateDiv.append(textcon[j]);
                    var padding = 0, borderthickness = 0;
                    if (level.groupPadding != undefined)
                        padding = level.groupPadding;
                    if (level.groupBorderThickness != undefined)
                        borderthickness = level.groupBorderThickness;
                        var labelWidth = (textcon[j][0].getBoundingClientRect().width > 0) ? textcon[j][0].getBoundingClientRect().width + padding + borderthickness + 2 : item.label.length * 8;
                        var labelHeight = textcon[j][0].getBoundingClientRect().height;
                    if (labelHeight == 0 && item.ItemHeight > 18)
                        labelHeight = 18;
                    else if (labelHeight > 0 && labelHeight > item.ItemHeight)
                        labelHeight = item.ItemHeight - toppaddingsize;
                    $(textcon[j]).css({ "width": labelWidth + "px", "height": labelHeight + "px" });
                    item.labelPosition = level.labelPosition;
                    item.labelVisibilityMode = borderthickness;
                    item.groupPadding = level.groupPadding;
                    item.groupBorderThickness = level.groupBorderThickness;
                    textcon[j][0].data = item;
                    if (level.labelVisibilityMode == ej.datavisualization.TreeMap.VisibilityMode.HideOnExceededLength) {
						if (labelWidth > item.ItemWidth) {
                             $(textcon[j]).css({
                            "display": "none",


                        });
                        if(item.Rectangle!=null)
                        item.Rectangle.title =item.label;

                        }
						var textMode = level.labelVisibilityMode;
                  }				  				    

				  else {
					    if (labelWidth < item.ItemWidth) {
                                $(textcon[j]).css({
					            "width": labelWidth
					        });
					    }
					    else {
                                $(textcon[j]).css({
					            "width": item.ItemWidth
					        });
                }
                    }
                    } this._labelTemplateElements.push(textcon);
                }
				}
				           
        },

        _generateToolTip: function () {

            if (this.showTooltip()) {
                if (document.documentMode == 8){
                    var tooltip = document.querySelectorAll("e-tooltipelement");
                }
                else{
                    var tooltip = document.getElementsByClassName("e-tooltipelement" + this._id);
                }
                if (tooltip != null && tooltip.length == 0) {
                    var tooltip_templateDiv = $("<div></div>").attr('class', 'e-tooltipelement' + this._id).css({ 'position': 'absolute', 'z-index': '1000', 'display': 'none', 'pointer-events': 'none' });

                    $(document.body).append(tooltip_templateDiv);
                    this._toolTipElement = tooltip_templateDiv;
                }
                else
                {
                    this._toolTipElement = tooltip[0];
                }
                if (this.model.tooltipTemplate == null) {

                    var path;
                    if (this.labelPath()!=null)
                        path = this.labelPath();
                    else 
                        path = this.weightValuePath();
                    if (path != null) {
                        this.model.tooltipTemplate = 'defaultTooltip';

                        this.element.append($('<div id="defaultTooltip" style="display:none;"><div style="margin-left:10px;margin-top:-25px;"><div class="e-defaultToolTip"><p style="margin-top:-4px"><label  style="color:rgb(27, 20, 20);font-size:14px;font-weight:normal;font-family:Segoe UI">{{:#data["' + path + '"]}}</label></p></div></div></div>'));
                    }
                }
            }           
        },

        _generateLegend: function () {
            if (this.model.rangeColorMapping != null || this.model.colorPath != null) {
                var colormapping = this.model.rangeColorMapping != null && this.model.rangeColorMapping.length > 0 ? this.model.rangeColorMapping : this._legendItem;
                var isRange = this.model.rangeColorMapping != null && this.model.rangeColorMapping.length > 0 ? true : false;
                var legendSettings = this.model.legendSettings;
                if (legendSettings.mode != ej.datavisualization.TreeMap.LegendMode.Interactive) {

                var xPos = 0;
                var yPos = 0;

                var columnWidth = 0;
                var width = 0;
                var height = 0;
                var iconwidth = this.iconWidth() + 5;
                var totalHeight = this.iconHeight() + 15;
                var totalWidth = 0, commonEventArgs;
                var columnCount = this.model.legendSettings.columnCount;
                for (var i = 0; i < colormapping.length; i++) {
                    commonEventArgs = {
                        color: isRange ? colormapping[i].color : colormapping[i]._color ? colormapping[i]._color : colormapping[i].color,
                        legendLabel: colormapping[i].legendLabel,
                        dataSource: isRange ? undefined : colormapping[i].Data,
                        mapping: isRange ? colormapping[i] : undefined
                    };
                    this._trigger("legendItemRendering", { model: this.model, data: commonEventArgs });
                    var labelwidth = this._calcWidth(commonEventArgs.legendLabel);
                    var legendWidth = this.iconWidth() + 10 + labelwidth;


                    if (columnCount != 0) {
                        if (i % columnCount != 0) {
                           
                            this._drawLegend(commonEventArgs, xPos, yPos);
                            xPos += (legendWidth+5);

                        }
                        else {
                            if (i != 0)
                            yPos += (this.iconHeight() + 18);
                            xPos = 0;
                            this._drawLegend(commonEventArgs, xPos, yPos);
                            xPos += (legendWidth + 5);
                        }
                        }
                    else {
                        if (this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Top || this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Bottom) {

                            if (this._legendSize.width < xPos + legendWidth) {

                                yPos += (this.iconHeight() + 18);
                                xPos = 0;
                                this._drawLegend(commonEventArgs, xPos, yPos);
                                xPos += legendWidth;
                            }
                            else {
                                this._drawLegend(commonEventArgs, xPos, yPos);
                                xPos += legendWidth;
                            }
                            }
                        else {

                            if (this._legendSize.height < yPos + this.iconHeight()) {

                                yPos = 0;
                                xPos += (columnWidth + 10);
                                this._drawLegend(commonEventArgs, xPos, yPos);
                                columnWidth = 0;
                                yPos += (this.iconHeight() + 18);
                            }
                            else {
                                this._drawLegend(commonEventArgs, xPos, yPos);
                                columnWidth = Math.max(columnWidth, legendWidth);
                                yPos += (this.iconHeight() + 18);
                                }
                            }

                        }
                    }

                }
                else {
                    this._drawInteractiveLegend();
                }
                if ((this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Top || this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Bottom) && legendSettings.alignment == ej.datavisualization.TreeMap.Alignment.Center) {
                    this._legenddiv.css({
                        "margin-left": (this._width / 2) - (this._legendSize.width / 2)
                    });
                }
                else if ((this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Top || this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Bottom) && legendSettings.alignment == ej.datavisualization.TreeMap.Alignment.Far) {
                    this._legenddiv.css({
                        "margin-left": this._width - this._legendSize.width
                    });
                }
                else if ((this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Left || this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Right) && legendSettings.alignment == ej.datavisualization.TreeMap.Alignment.Center) {
                    this._legenddiv.css({
                        "margin-top": (this._height / 2) - (this._legendSize.height / 2)
                    });
                }
                else if ((this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Left || this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Right) && legendSettings.alignment == ej.datavisualization.TreeMap.Alignment.Far) {
                    this._legenddiv.css({
                        "margin-top": this._height - this._legendSize.height
                    });
                }

                if (this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Bottom) {
                    this._legenddiv.css({
                        "margin-top": this._height + 5
                    });
                }
                else if (this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Right) {

                    this._legenddiv.css({

                        "margin-left": this._width + 5

                    });
                }
            }
        },
		 _drawLegend: function (colormapping, xPos, yPos) {
            var legendItem;
            if (this.model.legendSettings.template == "Ellipse") {
                legendItem = this._getEllipseLegend(this.model.legendSettings, xPos, yPos);
            }
            else {
                legendItem = this._getRectLegend(this.model.legendSettings, xPos, yPos);
            }
            xPos += (this.iconWidth() + 5);
            $(legendItem).css("background-color", colormapping.color);
            legendItem.appendTo(this._legenddiv);
            var legendText = $("<div class='e-treemap-legendLabel'/>");
            legendText.css({
                "left": xPos + "px",
                "top": yPos + "px",
                        "position": "absolute"
                    });
                   
            legendText[0].innerHTML = colormapping.legendLabel;
            legendText.appendTo(this._legenddiv);
        },
       
        _calcWidth: function (text) {
            var span = $('<span class ="e-treemap-legendLabel" >' + text + '</span>');
            $('body').append(span);
            var width = span.width();
            span.remove();
            return width;
        },
        
        _getEllipseLegend: function (legengItem, xPos, yPos) {

            var rect = $("<div class='e-mapLegend'/>");
            rect.css({
                "height": this.iconHeight()+ "px",
                "width": this.iconWidth() + "px",
                "border-radius":this.iconHeight()/2+"px",
                "left": xPos + "px",
                "top": yPos + "px",
                "position": "absolute"
            });
            return rect;

        },
       
        _getRectLegend: function (legengItem, xPos, yPos) {
            var rect = $("<div />");
            rect.css({
                "height": this.iconHeight()+ "px",
                "width": this.iconWidth() + "px",                
                "left": xPos + "px",
                "top": yPos + "px",
                "position": "absolute"
            });
            return rect;
        },
        
        _getPositionFromParent: function (element, parentelement) {
            var child = element.getBoundingClientRect();
            var parent = parentelement.getBoundingClientRect();
            var width = window.SVGSVGElement ? child.width: child.right-child.left;
            var height = window.SVGSVGElement ? child.height : child.bottom - child.top;            
            return { left: child.left - parent.left, top: child.top - parent.top, height: height, width: width };
        },
        
        _renderLabels: function () {
           
            for (var j = 0; j < this._labelTemplateElements.length; j++) {
                for (var k = 0; k < this._labelTemplateElements[j].length; k++) {
                    var label = this._labelTemplateElements[j][k];
                    var childElement = label[0] ? label[0] : label;
                    var bounds = this._getPositionFromParent(childElement, this._templateDiv[0]);
                    var item = childElement.data;
                    var pos = this._getDockPositionPoint({ left: item.LeftPosition, top: item.TopPosition, width: item.ItemWidth, height: item.ItemHeight }, 
                        bounds, item);
                    var position = item.labelPosition.toLowerCase();
                    var labelHeight = 18;
                    if ((position == "bottomleft" || position == "bottomright"
                        || position == "bottomcenter") && item.showHeader && this.enableDrillDown())
                        pos.y = pos.y + item.headerHeight;
                $(label).css({
                    "left": pos.x,
                    "top": pos.y + (labelHeight * k),
                    "pointer-events": "none",
                    "overflow":"hidden"
                });
                if (item.labelVisibilityMode == ej.datavisualization.TreeMap.VisibilityMode.HideOnExceededLength) {
                    if (bounds.height > item.ItemHeight || bounds.width > item.ItemWidth) {
                        $(label).css("display", "none");
                    }
                }
            }
            }
        },
       
        _generateHeaders: function (headerValue,level) {           
            var textMode = level.headerVisibilityMode;
            var generateHeader = false;
            var leftpadding = 2;
            var toppadding = 2;
            if (textMode == ej.datavisualization.TreeMap.VisibilityMode.HideOnExceededLength) {
                var textelement = $('<span>'+headerValue.header+'</span>');
                $(document.body).append(textelement);
                var width = textelement.outerWidth();
                textelement.remove();
                if (headerValue.headerHeight < (headerValue.ItemHeight- (2 * leftpadding)) && width < (headerValue.ItemWidth-(2 * toppadding))){
                    generateHeader = true;
                }					
            }
            else {
                if (headerValue.headerHeight < headerValue.ItemHeight){
                    generateHeader = true;
                }
            }
            if(generateHeader) {
                if (headerValue.headerTemplate == null) {
                    var headerItem = $('<div style="display:block;position:absolute;pointer-events: stroke;overflow: hidden;"><label class="e-treemap-header">' + headerValue.header + '</label></div>');
                    $(headerItem).css({
                        "left": headerValue.headerLeftPosition+leftpadding,
                        "top": headerValue.headerTopPosition+toppadding,
                        "width": headerValue.headerWidth - level.groupPadding,
                        "height": headerValue.headerHeight,
                        "margin-left": level.groupPadding                    
                    });
                    this._templateDiv.append(headerItem);
                }
                else {
                    var item_templateDiv = $("<div style='display:block;position:absolute;pointer-events: none;overflow: hidden;'></div>");
                    this._templateDiv.append(item_templateDiv);
                    $(item_templateDiv).css({
                        "left": headerValue.headerLeftPosition,
                        "width": headerValue.headerWidth, "top": headerValue.headerTopPosition,
                        "height": headerValue.headerHeight
                    });
                    var args = { header: headerValue.header, data: headerValue.Data };
                    var htmlString = $("#" + headerValue.headerTemplate).render(args);
                    $(item_templateDiv).html(htmlString);
                }
            }
        },

        getDrillDownHeader:function(header)
        {
            var headerString = "";
            if(header.length==1)
            {
                return header[0];
            }
            else{
                for (var index = 0; index < header.length; index++)
                {
                    headerString += header[index];
                    if(index!=header.length-1)
                    {
                        headerString += this.model._connectorText || ".";
                    }
                }
            }
            return headerString;
            
        },
	
        _drillDownHeader: function (enableNavigation, levelItem, childItems) {

            var treeMapEventArgs = {
                groupingLevel: levelItem.groupingLevel,
                groupPath: levelItem.groupPath,
                childItems:childItems,
                levelItems: levelItem,
                headerItem: {
                    drilldownHeaders: this._drilldownHeaders,
                    originalHeaders: this._originalHeaders
                },
                connectorText: "."
            };
           
            this._trigger("headerTemplateRendering", treeMapEventArgs);
            this.model._connectorText = treeMapEventArgs.connectorText;
            var labelValue = [];
            var label = [];            
            for (var i = 0; i < this._drilldownHeaders.length;i++)
            {                
                labelValue += "<label class='e-drilldownlabel' style='margin-left:-8px'>" + this._drilldownHeaders[i] + "</label>";
                if (this._drilldownHeaders.length > 1 && i < this._drilldownHeaders.length-1)
                {                    
                    labelValue = labelValue + this.model._connectorText;
                }                  
            }                       

            var item_templateDiv = $("<div class='e-drilldownHeader' style='display:block;overflow: hidden;'><div class='e-drilldownlabel'  style='position:absolute;height:30px;position:absolute;margin-top: 5px;top: 0px;'>" + labelValue + "</div></div>");
            if (enableNavigation)
                item_templateDiv = $("<div class='e-drilldownHeader' style='display:block;overflow: hidden;'><svg class='e-drilldownarrow' style='width:15px;height:15px;margin-top: 10px;'><polyline points='8,0 8,10 0,5 8,0'/></svg><label class='e-drilldownlabel'  style='left:17px;position:absolute;height:30px;position:absolute;margin-top: 5px;top: 0px;'>" + labelValue + "</label></div>");
            
            $(item_templateDiv).css({
                "left": "0px",
                "width": this._width+"px","top": 0,
                "height": "30px","cursor":"pointer"
            });    
            if(this.drillDownHeaderColor()!=null)
            {
                $(item_templateDiv).css("background-color",this.drillDownHeaderColor());
            }			
            this._drillHeaderDiv.append(item_templateDiv);
            $(item_templateDiv).mousedown({ treemap: this }, this._drilldownfunction);
            $(".e-drilldownlabel").mousedown({ treemap: this }, this._drilldownLabel);
            
        },


        _drilldownLabel: function (event) {
            var label = this.innerHTML;
            var treeMap = event.data.treemap;
            var pos;
            if (treeMap._drilldownHeaders[0] == label)
            {                
                treeMap._drilldownItems = [];
                treeMap.refresh();
            }
            else
            {                
                var header = "";
                
                treeMap._drillHeaderDiv[0].innerHTML = "";
                treeMap._backgroundTile[0].innerHTML = "";
                var drillHeader = "";               

                for (var i = 0; i < treeMap._drilldownHeaders.length; i++) {
                    if (label == treeMap._drilldownHeaders[i]) {                        
                        pos = i + 1;                        
						treeMap._originalHeaders.splice(i+1);
                        treeMap._drilldownHeaders.splice(i+1);
                    }
                }
                
                treeMap._labelTemplateElements = [];
                var treemapLevel = treeMap.model.levels[treeMap._drilldownHeaders.length - 1];
                var length = treeMap._drilldownHeaders.length - event.data.treemap._drilldownItems.length,
                    drilldownLength = event.data.treemap._drilldownItems.length;
                var data = event.data.treemap._drilldownItems.length == 1 ? event.data.treemap._drilldownItems[0].Data
                             : event.data.treemap._drilldownItems[length < 0 ? drilldownLength + length : length ].Data;
                treeMap._drillDownHeader(true, treemapLevel, data);
                if(pos) {               
                	treeMap._drilldownItem = treeMap._drilldownItems[pos - 2];
                	treeMap._drilldownItems.splice(pos - 1);
                }
                treeMap._templateDiv[0].innerHTML = "";
				if(!ej.util.isNullOrUndefined(treeMap._drilldownItem))
                treeMap._groupdrillDownLevels(treeMap._drilldownItem, treeMap._drilldownItems.length);                                
                return false;
            }
        },


		
        _drilldownfunction: function (event) {
            var treeMap = event.data.treemap;                       
            treeMap._trigger("drillStarted", event);
            if (treeMap._drilldownItems.length > 0) {                
                if (treeMap._drilldownItems.length == 1) {
                    treeMap._drilldownItems = [];
                    treeMap.refresh();
                }
                else {
                    var header = "";
                    for (var i = 0; i < treeMap._drillHeaderDiv[0].children[0].children.length; i++) {
                        if (treeMap._drillHeaderDiv[0].children[0].children[i].className == "e-drilldownlabel")
                            header = treeMap._drillHeaderDiv[0].children[0].children[i].innerHTML;
                    }
                    var headers = header.split(treeMap.model._connectorText || ".");
                    treeMap._drillHeaderDiv[0].innerHTML = "";
                    treeMap._backgroundTile[0].innerHTML = "";
                    var drillHeader = "";
                    if (treeMap._drilldownHeaders.length > 1)
                    {
                        treeMap._drilldownHeaders.pop(treeMap._drilldownHeaders.length - 1);
                    }                    
                    treeMap._labelTemplateElements = [];
                    var treemapLevel = treeMap.model.levels[treeMap._drilldownHeaders.length - 1];
                    treemapLevel.groupingLevel = event.data.treemap._drilldownItem.GroupingLevel; 
                    treeMap._drillDownHeader(true, treemapLevel, event.data.treemap._drilldownItem.Data);
                    treeMap._drilldownItem = treeMap._drilldownItems[treeMap._drilldownItems.length - 2];
                    treeMap._drilldownItems.pop(treeMap._drilldownItems[treeMap._drilldownItems.length - 1]);
                    treeMap._templateDiv[0].innerHTML = "";
                    treeMap._groupdrillDownLevels(treeMap._drilldownItem, treeMap._drilldownItems.length);
                }
                treeMap._trigger("drillDownItemSelected", { level: treeMap._drilldownItems.length, header: treeMap.getDrillDownHeader(treeMap._drilldownHeaders), prevLevel: treeMap._drilldownItems.length - 1 });
            }            
        },
       
      _sizeCalculation: function (subItems) {

          if (this.model.rangeColorMapping != null || this.model.colorPath != null) {
              var colormapping = this.model.rangeColorMapping != null && this.model.rangeColorMapping.length > 0 ? this.model.rangeColorMapping : subItems ? subItems : $.extend(true, [], this.model.dataSource);
              var isRange = this.model.rangeColorMapping != null && this.model.rangeColorMapping.length > 0 ? true : false;
                var width = 0;
                var height = 0;
                var iconwidth = this.iconWidth() + 5;
                var totalHeight = this.iconHeight() + 15;
                var totalWidth = 0;
                var columnCount = this.model.legendSettings.columnCount;


                var legendSettings = this.model.legendSettings;
                if (this.model.legendSettings.mode != ej.datavisualization.TreeMap.LegendMode.Interactive) {
                if ((this.legendheight() == 0 && this.legendwidth() == 0) && (columnCount == 0)) {
                    if (!isRange) {
                        this._legendItem = colormapping;
                        this._generateLegendLabels(this.model, this._legendItem);
                    }
                    for (var i = 0; i < colormapping.length; i++) {                        
                        if((colormapping[i].legendLabel) == undefined){
                            colormapping[i].legendLabel =  (colormapping[i].from) + "-" + (colormapping[i].to) ;
                        }
                        var labelwidth = this._calcWidth(colormapping[i].legendLabel);
                        var legendWidth = iconwidth + labelwidth + 10;
                        if (this.legendheight() == 0 && this.legendwidth() == 0) {
                            if (this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Top || this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Bottom) {
                                if (this._width < (width + legendWidth)) {
                                    totalHeight = (this.iconHeight() + 15) + totalHeight;
                                    totalWidth = Math.max(totalWidth, width);
                                    width = legendWidth;
                                }
                                else {
                                    width += legendWidth;
                                }
                            }
                            else {

                                    if (this._height < (height + this.iconHeight() + 15)) {
                                    totalWidth += width;
                                    totalHeight = Math.max(totalHeight, height);
                                    width = legendWidth;
                                    height = 0;
                                }
                                else {
                                    height += (this.iconHeight() + 18);
                                    width = Math.max(legendWidth, width);
                                }
                            }
                        }
                        else {

                            xPos += _legendlabelwidth + 18;
                            if (xPos + 150 >= this.legendwidth()) {
                                xPos = 10;
                                yPos += 40;
                            }
                        }
                    }

                    if (this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Top || this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Bottom) {
                        totalWidth = Math.max(totalWidth, width);
                        totalHeight += 5;
                    }
                    else {
                        totalWidth += (width + 15);
                        totalHeight = Math.max(totalHeight, height);
                    }
                }
               else if (columnCount == 0) {

                        for (var i = 0; i < colormapping.length; i++) {
                            if ((colormapping[i].legendLabel) == undefined) {
                                colormapping[i].legendLabel = (colormapping[i].from) + "-" + (colormapping[i].to);
                            }
                        }
                    if ((this.legendheight().toString().indexOf("%")) != -1) {

                        totalHeight = (this._height / 100) * parseInt(this.legendheight().replace('%', ''))
                    }
                    else {

                        totalHeight = this.legendheight();
                    }
                    if ((this.legendwidth().toString().indexOf("%")) != -1) {

                        totalWidth = (this._width / 100) * parseInt(this.legendwidth().replace('%', ''))
                    }
                    else {

                        totalWidth = this.legendwidth();
                    }

                }

                if (columnCount != 0) {

                    for (var i = 0; i < colormapping.length; i++) {
                            if ((colormapping[i].legendLabel) == undefined) {
                                colormapping[i].legendLabel = (colormapping[i].from) + "-" + (colormapping[i].to) ;
                            }
                             var labelwidth = this._calcWidth(colormapping[i].legendLabel);
                            
                            legendWidth = iconwidth + labelwidth + 10;

                        if (i % columnCount != 0) {
                            width += legendWidth;
                            if (i == columnCount - 1) {
                                totalWidth = Math.max(totalWidth, width);
                            }

                        }
                        else {
                            if (i != 0)
                                totalHeight = (this.iconHeight() + 15) + totalHeight;
                            totalWidth = Math.max(totalWidth, width);
                            width = legendWidth;
                        }
                    }
                }
                }
                else {
                    totalHeight = (legendSettings.height != 0 ? legendSettings.height : 30) + 18;
                    if (legendSettings.title != null && legendSettings.title != "") {
                        totalHeight += 25;
                    }
                    totalWidth = (legendSettings.width != 0 ? legendSettings.width : 100) + 20 + (legendSettings.leftLabel.length * 10) + (legendSettings.rightLabel.length * 10);

                }
                this._legendSize = { height: totalHeight, width: totalWidth };
                if (this.model.legendSettings != null) {

                    if (this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Bottom) {
                        this._height = this._height - parseFloat(totalHeight);
                        this.model.legendSettings.tempWidth = width;
                    }

                    else if (this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Top) {
                        this._height = this._height - parseFloat(totalHeight);

                        this._margintop = parseFloat(totalHeight);
                    }
                    else if (this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Left) {
                        this._width = this._width - totalWidth;
                        this._marginleft = totalWidth;

                    }
                    else if (this.dockPosition() == ej.datavisualization.TreeMap.DockPosition.Right) {
                        this._height = this._height;
                        this._width = this._width - totalWidth;
                    }
                }
            }
        },
      _generateLegendLabels: function (model, data) {
          var colorPath = model.colorPath;
          for (var i = 0; i < data.length; i++) {
              if (!this.enableDrillDown()) {
                  data[i].legendLabel = this.labelPath() ? data[i][this.labelPath()] : data[i][model.weightValuePath];
                  data[i].color = data[i][colorPath];
              }
              else 
                  data[i].legendLabel = data[i].header;              
          }
      },
        _getDockPositionPoint:function(size,bounds,item)
        {
            var position = item.labelPosition;
            var x = 2, y = 2;
            if (item.groupPadding != undefined && item.groupBorderThickness != undefined) {
                x = item.groupPadding + item.groupBorderThickness + x;
                y = item.groupPadding + item.groupBorderThickness + y;
            }
            if (item.showHeader)
                y = y + item.headerHeight;
            if (position == ej.datavisualization.TreeMap.Position.TopCenter) {
                x = (size.width/2)-(bounds.width/2);
            }
            else if (position == ej.datavisualization.TreeMap.Position.TopRight) {
                x = size.width - bounds.width - x;
            }
            else if (position == ej.datavisualization.TreeMap.Position.CenterLeft) {
                y = (size.height / 2) - (bounds.height / 2);
            }
            else if (position == ej.datavisualization.TreeMap.Position.Center || position==null) {
                x = (size.width / 2) - (bounds.width / 2);
                y = (size.height / 2) - (bounds.height / 2);
            }
            else if (position == ej.datavisualization.TreeMap.Position.CenterRight) {
                x = size.width - bounds.width -x;
                y = (size.height / 2) - (bounds.height / 2);
            }
            else if (position == ej.datavisualization.TreeMap.Position.BottomLeft) {
                y = size.height - bounds.height - y;
            }
            else if (position == ej.datavisualization.TreeMap.Position.BottomCenter) {
                x = (size.width / 2) - (bounds.width / 2);
                y = size.height - bounds.height-y;
            }
            else if (position == ej.datavisualization.TreeMap.Position.BottomRight) {
                x = size.width - bounds.width-x;
                y = size.height - bounds.height-y;
            }
            return {x:size.left+x,y:size.top+y};
        },
       
        _generateTreeMapItems: function (Items, fill, path, cloneItems) {
            this._rootTreeMapItems= Items;
            this._getTreeMapItemTemplate(Items);
            if (Items != null) {
                if (!this._isLevelColors){
                    this._setColorMappings(Items, this.model, undefined, cloneItems);
                }
                for (var i = 0; i < Items.length; i++) {
                    var item = Items[i];                    
                                      
                    var rect = item.rectangle;
                    if (item.Data != null && item.Data.length>0) {
                        item.Data = item.Data[0];
                    }
                    item.Rectangle = rect;
                    var eventArgs = {
                        borderThickness: this.model.leafItemSettings.borderThickness,
                        borderBrush: this.model.leafItemSettings.borderBrush,
                        fill: item.backgroundColor,
                        dataSource: item.Data
                    };
                    this._trigger("itemRendering", { model: this.model, data: eventArgs });
                    if (eventArgs.fill != item.backgroundColor) {
                        item._color = eventArgs.fill;
                        if (this.enableDrillDown()) {
                            for (var j = 0; j < cloneItems.length; j++) {
                                if (cloneItems[j].ChildtreeMapItems) {
                                    for (var k = 0; k < cloneItems[j].ChildtreeMapItems.length; k++) {
                                        if (item.header == cloneItems[j].ChildtreeMapItems[k].header)
                                            cloneItems[j]._color = eventArgs.fill;
                                    }
                                }
                            }
                        }
                    }

					 $(rect).css({
                        "box-sizing": "border-box",
                        "-moz-box-sizing": "border-box",
                        "-webkit-box-sizing": "border-box",
                        "border-color": eventArgs.borderBrush,
                        "border-width": eventArgs.borderThickness + "px"
                    });
					 if (eventArgs.fill)
					     $(rect).css("background-color", eventArgs.fill);
                    else
                        $(rect).css("background-color","#E5E5E5");
                    if(item.backgroundOpacity !=null)
                    {
                        $(rect).css("opacity",item.backgroundOpacity);
                    }
                    this._wireEventForTreeMapItem(item, rect);
                 
                }
                if (this.model.rangeColorMapping.length == 0 && this.uniColor() == null && this._color() != "") {
                    this._setDesaturationColor(Items, this.model.desaturationColorMapping);
                }
                else if (this.model.PaletteColorMapping != null) {
                    this._setPaletteColor(Items, this.model.PaletteColorMapping);
                }
            }
        },

        browserInfo: function () {
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
        },

        isTouch: function (evt) {
            
                var event = evt.originalEvent ? evt.originalEvent : evt;
            if ((event.pointerType == "touch") || (event.pointerType == 2) || (event.type.indexOf("touch") > -1))
                return true;
            return false;
        },

        _wireEventForTreeMapItem: function (item, rect) {
         var browserInfo = this.model.browserInfo,
            isPointer = browserInfo.isMSPointerEnabled,
            isIE11Pointer = browserInfo.pointerEnabled,
            touchStartEvent = isPointer ? (isIE11Pointer ? "pointerdown" : "MSPointerDown") : "touchstart mousedown",
            touchStopEvent = isPointer ? (isIE11Pointer ? "pointerup" : "MSPointerUp") : "touchend mouseup",
            touchMoveEvent = isPointer ? (isIE11Pointer ? "pointermove" : "MSPointerMove") : "touchmove mousemove",
            touchEnterEvent = isPointer ? (isIE11Pointer ? "pointerenter" : "MSPointerEnter") : "touchenter mouseenter",
            touchCancelEvent = isPointer ? (isIE11Pointer ? "pointerleave" : "MSPointerOut") : "touchleave mouseleave";        

            this._on($(rect), touchMoveEvent, { Param1: item, Param2: this }, this._rectMouseMove);
            this._on($(rect), touchCancelEvent, { treeMap: this }, this._rectMouseLeave);

            this._on($(rect), touchStopEvent, { Param1: item, Param2: this }, this._rectMouseUp);
            this._on($(rect), touchStartEvent, { treeMap: this }, this._rectMouseDown);
            this._on($(rect), touchEnterEvent, { Param1: item, Param2: this }, this._rectMouseEnter);

           
        },

        _getTreeMapItemTemplate: function (Items) {            
            
            var rects ="";
            for (var i = 0; i < Items.length; i++) {
                var item = Items[i];
                if (this.model.leafItemSettings.itemTemplate == null)
                    rects += '<div style="border-style:solid;position:absolute;left:' + item.LeftPosition + 'px;top:' + item.TopPosition + 'px;height:' + item.ItemHeight + 'px;width:' + item.ItemWidth + 'px;border-width:' + this.borderThickness() + 'px;border-color:' + this.borderBrush() + '"></div>';
                else {
                    var OriginalNode = $("#" + this.model.leafItemSettings.itemTemplate);
                    if (item.Data != null && item.Data.length == 1) {
                        item.Data = item.Data[0];
                    }
                    var tmpl2 = $.templates(OriginalNode.html());
                    var htmlString = "<div style='overflow:hidden;position:absolute;left:" + item.LeftPosition + "px;top:" + item.TopPosition + "px;height:" + item.ItemHeight + "px;width:" + item.ItemWidth + "px'>" + tmpl2.render(item) + "</div>";
                    rects += htmlString;
                }
            }
            if (this._svgDocument != null && this.enableDrillDown()) {
                this._svgDocument[0].innerHTML = "";
            }
            this._svgDocument = $('<div style= "overflow:hidden;' +
                              'z-index:1;"' +
                             'id="svgDocument">' + rects + '</div>');
            this._backgroundTile.appendTo(this.element);
            this._svgDocument.appendTo(this.element);           
            this._svgDocument.css({
                "height": this._height + "px", "width": this._width + "px", "margin-top": this._margintop + "px", "margin-left": this._marginleft, "overflow": "hidden",
                "z-index": 1, "position": "absolute", "left": "0", "top": "0"
            });
            $(this._backgroundTile).css({
                "height": this._height + "px", "width": this._width + "px", "margin-top": this._margintop + "px", "margin-left": this._marginleft, "overflow": "hidden",
                "z-index": 0, "position": "absolute", "left": "0", "top": "0"
            });
            this._templateDiv.appendTo(this.element);
            /* Below event hook added for IE10 tooltip issue*/
            $(this._templateDiv).mousemove({ Param2: this }, this._rectMouseMove);
            var browserInfo = this.model.browserInfo,
            isPointer = browserInfo.isMSPointerEnabled,
            isIE11Pointer = browserInfo.pointerEnabled,
            touchStartEvent = isPointer ? (isIE11Pointer ? "pointerdown" : "MSPointerDown") : "touchstart mousedown",
             touchStopEvent = isPointer ? (isIE11Pointer ? "pointerup" : "MSPointerUp") : "touchend mouseup";
			
			this._off($(this.element), touchStartEvent, this.rectClick);
            this._off($(this.element), touchStopEvent, this._docClickFunction);
            this._off($(this.element), ej.eventType.mouseDown, this.dragDown);
            this._off($(this.element), ej.eventType.mouseMove, this.dragMove);
            this._off($(this.element), ej.eventType.mouseUp, this.dragUp);
			
            this._on($(this.element), touchStartEvent, { treemap: this, Param1: Items }, this.rectClick);
            this._on($(this.element), touchStopEvent, { treemap: this, Param1: Items }, this._docClickFunction);            
            this._on($(this.element), ej.eventType.mouseDown, { treemap: this }, this.dragDown);
            this._on($(this.element), ej.eventType.mouseMove, { treemap: this }, this.dragMove);
            this._on($(this.element), ej.eventType.mouseUp, { treemap: this }, this.dragUp);

            if (this.enableDrillDown()) {
                this._drillHeaderDiv.appendTo(this.element);
                this._drillHoverDiv.appendTo(this.element);
            }
            for (var i = 0; i<Items.length; i++) {
                Items[i].rectangle = this._svgDocument[0].childNodes[i];
            }
        },	       

        selectItem: function (obj) {
            if (this._rootTreeMapItems != null) {
                for (var i = 0; i < this._rootTreeMapItems.length; i++) {
                    var item = this._rootTreeMapItems[i];
                    var rect = item.rectangle;
                    if (item.Data != null && item.Data.length > 0) {
                        item.Data = item.Data[0];
                    }
                   
                    if (obj == item.Data) {
                        if (this.highlightOnSelection()) {

                            $(rect).css({ "border-width": this.highlightBorderThickness(), "border-color": this.highlightBorderBrush() });
                            if (this._browser != "msie") {
                                var lastItem = this._svgDocument[0].children[this._svgDocument[0].children.length - 1];
                                this._svgDocument[0].insertBefore(rect, lastItem);
                            }
							this._prevSelectedItems.push(rect);
							this._trigger("treeMapItemSelected", { selectedItems: obj, originalEvent: event });                              
                        }
					}
                    
                }
            }

        },
      
        _selectTreemapItem: function (obj) {

            if (this._rootTreeMapItems != null) {
                for (var i = 0; i < this._rootTreeMapItems.length; i++) {
                    var item = this._rootTreeMapItems[i];
                    var rect = item.rectangle;
                    if (item.Data != null && item.Data.length > 0) {
                        item.Data = item.Data[0];
                    }
                    if (obj == item.Data && !this._contains(this.selectedItems, obj)) {

                        if (this.highlightOnSelection()) {
                            $(rect).css({ "border-width": this.highlightBorderThickness(), "border-color": this.highlightBorderBrush() });
                            if (this._browser != "msie") {
                                var lastItem = this._svgDocument[0].children[this._svgDocument[0].children.length - 1];
                                this._svgDocument[0].insertBefore(rect, lastItem);
                            }
                            this._prevSelectedItems = [];
                            this.selectedItems = [];
                            this._prevSelectedItems.push(rect);
                            this.selectedItems.push(obj);
                        }
                    }

                }
            }
        },
        
        _selectItemResize: function () {

            for (var i = 0; i < this._rootTreeMapItems.length; i++) {
                var item = this._rootTreeMapItems[i];
                var rect = item.rectangle;
                if (item.Data != null && item.Data.length > 0) {
                    item.Data = item.Data[0];
                }
                if (this._contains(this.selectedItems, item.Data)) {
                    this.selectItem(item.Data);
                }
                
            }
        },
		    _updateLegendRange: function (value, treemapitem) {
            var colormapping = this.model.rangeColorMapping;
            for (var index = 0; index < colormapping.length; index++) {
                var gradientCollection = null;
                var mapping = colormapping[index];
                if (this.model.enableGradient) {
                    gradientCollection = this._generateGradientCollection(mapping.gradientColors);
                }
                if (value >= mapping.from && value <= mapping.to) {
                    var minValue = index;
                    if (index != 0)
                        minValue = index * 10;
                    var minRange = mapping.from;
                    var maxRange = mapping.from + ((mapping.to - mapping.from) / 10);
                    for (var i = minValue; i < minValue + 10; i++) {
                        if (value >= minRange && value <= maxRange) {
                            var obj = {};
                            var shapeOpacity = this._getColorRatio(0.7, 1, value, mapping.from, mapping.to);
                            if (this._legendRects[i] != undefined)
                                obj = this._legendRects[i];
                            if (this.model.enableGradient) {
                                if (index != 0) {
                                    treemapitem.backgroundColor = gradientCollection[i - index * 10];
                                } else {
                                    treemapitem.backgroundColor = gradientCollection[i];
                                }
                            } else
                                treemapitem.backgroundColor = mapping.color;
                            treemapitem.backgroundOpacity = shapeOpacity;
                            obj["color"] = treemapitem.backgroundColor;
                            return obj;
                        }
                        minRange = maxRange;
                        maxRange = maxRange + ((mapping.to - mapping.from) / 10);
                    }
                }
            }
        },
		
        selectItemByPath: function (path, value, seperator) {
            var propertyPath = path.split(seperator);
            var propertyValue = value.split(seperator);
            var path, value;
            var treemapItems = this._rootTreeMapItems;
            for (var i = 0; i < propertyPath.length; i++)
            {
                var path = propertyPath[i];
                var value = propertyValue[i];
                var itemsCollection = [];
                for (var k = 0; k < treemapItems.length; k++) {
                    var item = treemapItems[k];
                    var dataObj = item.Data;
                    var objValue;
                    for (var j = 0; j < propertyPath.length; j++) {
                        objValue = this._reflection(dataObj, path);
                    }

                    if (value == objValue) {
                        itemsCollection.push(item);
                    }
                }
                treemapItems = itemsCollection;
            }
            for (var i = 0; i < treemapItems.length; i++)
            {
                var item = treemapItems[i];
                this.selectItem(item.Data);
            }
        },
          _getColorRatio: function (min, max, value, minValue, maxValue) {
            var percent = (100 / (maxValue - minValue)) * (value - minValue);
            var colorCode = (((parseFloat(max) - parseFloat(min)) / 100) * percent) + parseFloat(min);
            return colorCode;
        },
        _contains: function (array, actualobj) {
            var length = array.length;
            if (length > 0) {
                while (length--) {
                    if (array[length] === actualobj) {
                        return true;
                    }
                }
            }
            return false;
        },

        _rectMouseEnter: function(event) {
		    var treemap = event.data.Param2;
            var legendSettings = treemap.model.legendSettings;
            var tooltipObject = event.data.Param1.Data;
            if (tooltipObject != null) {
                var element = event.data.Param2._toolTipElement;
                var template = event.data.Param2.model.tooltipTemplate;
                if (element != null && template != null) {
                    if(!treemap.isTouch(event))
                       $(element).css({ "left": event.pageX+10, "top": event.pageY+10, "display": "block" });
					var locale = this.model.locale;
					var obj = $.extend({}, tooltipObject);
					if (locale && this.model.enableGroupSeparator){
						for (var key in obj)
							obj[key] = isNaN(parseFloat(obj[key])) ? obj[key] : parseFloat(obj[key]).toLocaleString(locale);
					}	
                    var htmlString = $("#" + template).render(obj);
                    $(element).html(htmlString);
                    var height= element[0]!=null ? element[0].clientHeight : element.clientHeight;
                    var width= element[0]!=null ? element[0].clientWidth : element.clientWidth;
                    event.data.Param2._tooltipSize = { height: height, width: width };
                    
                }
            }
			
			 if (legendSettings != null && legendSettings.mode == ej.datavisualization.TreeMap.LegendMode.Interactive && treemap.model.rangeColorMapping != null
                   && (treemap.showLegend() == undefined || treemap.showLegend())) {
                for (var i = 0; i < treemap._rootTreeMapItems.length; i++) {
                    var item = treemap._rootTreeMapItems[i].Rectangle;

                    if (item == event.target) {
                        var mappings = null;
                        if (treemap.model.rangeColorMapping != undefined) {
                            mappings = treemap.model.rangeColorMapping;
                        }
                        var _legendwidth = legendSettings.width;
                        if (legendSettings.width == undefined)
                            _legendwidth = 150;

                        var rectwidth = (_legendwidth / mappings.length) / 10;
                        if (treemap._rootTreeMapItems[i].legendrect != null) {
                            var rectPosition = treemap._rootTreeMapItems[i].legendrect.marginLeft;
                            var position = rectPosition + Math.ceil(rectwidth) - treemap._interactiveArrow.width() / 2;
                            $(treemap._interactiveArrow).css({ "margin-left": position, "display": "block" });
                            break;
                        }
                    }
                }
            }
        },

        displayTooltip: function (event) {
            var treeMap = event.data.Param2,
                element = treeMap._toolTipElement,
                pointer = treeMap.mousePosition(event),
                canExecute = true;           
            if (treeMap.model.trackerElement) {
                clearTimeout(treeMap.model.timer);
                $(".e-tooltipelement" + this._id).finish();              
            }
            if (event.data.Param1 == undefined) {
                if (element != null) {
                    var tooltipObject;
                    for (var i = 0; i < treeMap._rootTreeMapItems.length; i++) {
                        var item = treeMap._rootTreeMapItems[i];
                        if (item.rectangle.offsetLeft < pointer.offsetX && item.rectangle.offsetLeft + item.rectangle.offsetWidth > pointer.offsetX
                            && item.rectangle.offsetTop < pointer.offsetY && item.rectangle.offsetTop + item.rectangle.offsetHeight > pointer.offsetY) {
                            tooltipObject = item.Data;
                            break;
                        }
                    }
                    if (tooltipObject != null) {
                        var template = event.data.Param2.model.tooltipTemplate;
                        if (element != null && template != null) {
                            $(element).css({ "left": pointer.pageX + 10, "top": pointer.pageY + 10, "display": "block" });
                            var htmlString = $("#" + template).render(tooltipObject);
                            $(element).html(htmlString);
                            var height = element[0] != null ? element[0].clientHeight : element.clientHeight;
                            var width = element[0] != null ? element[0].clientWidth : element.clientWidth;
                            treeMap._tooltipSize = { height: height, width: width };

                        }
                    }
                    else {
                        if (element != null) {
                            canExecute = false;
                            $(element).css("display", "none");
                        }
                    }
                }
            }

            if (canExecute) {
                var tooltipSize = treeMap._tooltipSize;
                if (tooltipSize.width + pointer.pageX >= treeMap._width) {
                    pointer.pageX -= tooltipSize.width;
                    if (pointer.pageX < 0) {
                        pointer.pageX = 10;
                    }
                }
                if (tooltipSize.height + pointer.pageY >= treeMap._height) {
                    pointer.pageY -= tooltipSize.height;
                    if (pointer.pageY < 0) {
                        pointer.pageY = 10;
                    }
                }
                if (treeMap.enableDrillDown() && treeMap._browser != 'msie') {
                    for (var i = 0; i < treeMap._drillHoverDiv[0].children.length; i++) {
                        var child = treeMap._drillHoverDiv[0].children[i];
                        if (child.className == event.data.Param1.ParentHeader) {
                            $(child).css({ "display": "block" });
                        }
                    }
                }
                if (element != null) {
                    $(element).css({ "left": pointer.pageX + 10, "top": pointer.pageY + 10, "display": "block" });
                }
            }
        },

       

        _rectMouseUp: function (event) {
            
            if (this.isTouch(event))
                this.displayTooltip(event);          
        },
       
        _rectMouseMove: function (event) {
          
            /* Below If condition code was added for IE10 Tooltip issue*/
            if (!event.data.Param2.isTouch(event))
                event.data.Param2.displayTooltip(event);
        },

        _rectMouseLeave: function (event) {            
            var element = event.data.treeMap._toolTipElement;
            if (element != null && !event.data.treeMap.isTouch(event)) {
                $(element).css("display", "none");
            }
        },
		
     
       
        _setColorMappings: function (Items, colorMappings, groupmapping, cloneItems) {
		    var obj = {};
            var proxyControl = this;
            var legendSettings = this.model.legendSettings;
            
            if ((colorMappings.rangeColorMapping != null && colorMappings.rangeColorMapping.length > 0) || (colorMappings.uniColorMapping != null && (colorMappings.uniColorMapping.color != null || this.uniColor() != null))) {
                for (var i = 0; i < Items.length; i++) {
                    if (!groupmapping) {
                        if (Items[i].Data instanceof Array) {

                            var shapeValue = proxyControl._reflection(Items[i].Data[0], this.colorValuePath());
                        }
                        else {
                            var shapeValue = proxyControl._reflection(Items[i].Data, this.colorValuePath());
                        }
                    }
                    if ((legendSettings.mode == ej.datavisualization.TreeMap.LegendMode.Interactive) || this.model.enableGradient) {
                        Items[i].legendrect = this._updateLegendRange(shapeValue, Items[i]);
                    }
                    else {
                        var ColorValue = Items[i]._generateColorMappings(colorMappings, this);
                        Items[i].backgroundColor = ColorValue;
                    }
                }
            }
            else if (colorMappings.desaturationColorMapping != null && (colorMappings.desaturationColorMapping.color != "" || this._color() != "")) {
                this._setDesaturationColor(Items, colorMappings.desaturationColorMapping);
            }
            else if (colorMappings.paletteColorMapping != null && colorMappings.paletteColorMapping.colors.length > 0) {
                this._setPaletteColor(Items, colorMappings.paletteColorMapping);
            }
            else if (this.model.colorPath != null)
                this._setFillColor(Items, this.model.colorPath, cloneItems);
            
        },

        _setFillColor: function (Items, colorPath, cloneItems) {
            for (var i = 0; i < Items.length; i++) {
                Items[i].color = Items[i].backgroundColor = Items[i].Data[0] ? Items[i].Data[0][colorPath] : Items[i].Data[colorPath];
                Items[i].legendLabel = Items[i].header;
            }
            if (this.enableDrillDown() && this.showLegend()) {
                for (var j = 0; j < cloneItems.length; j++) {
                    if (cloneItems[j].ChildtreeMapItems) {
                        cloneItems[j].ChildtreeMapItems.sort(function (a, b) {
                            return parseFloat(b.weight) - parseFloat(a.weight);
                        });
                        cloneItems[j].color = cloneItems[j].ChildtreeMapItems[0].Data[0][colorPath];
                        cloneItems[j].legendLabel = cloneItems[j].header;
                    }
                }
                this._legendItem = cloneItems;
            }
            else if (!this.enableDrillDown() && this.showLegend() && !this.model.isHierarchicalDatasource)
                this._legendItem = Items;
        },
     
        _setDesaturationColor: function (Items, desaturationColorMapping) {
            Items = Items.sort(this._orderBycolorWeight);

            var from = (typeof desaturationColorMapping.from == "number") ? desaturationColorMapping.from : this._from();
            var to = (typeof desaturationColorMapping.to == "number") ? desaturationColorMapping.to : this._to();
            var rangeMin = (typeof desaturationColorMapping.rangeMinimum == "number") ? desaturationColorMapping.rangeMinimum : this._rangeMinimum();
            var rangeMax = (typeof desaturationColorMapping.rangeMaximum == "number") ? desaturationColorMapping.rangeMaximum : this._rangeMaximum();
          
            var values = [];
            for (var j = 0; j < Items.length; j++)
            {
                var item = Items[j].Data[0];
                var colorWeightValue = this._reflection(item, this.colorValuePath());
                if (colorWeightValue!=null && (typeof colorWeightValue != "number")) {

                    colorWeightValue = Number(colorWeightValue.replace(/[^0-9\.]+/g, ""));
                }               
                values.push(colorWeightValue);                
            }

            if (this._rangeMinimum() == 0)
            {
                rangeMin = Math.min.apply(Math, values);
            }            
            
            if (this._rangeMaximum() == 0)
            {
                rangeMax = Math.max.apply(Math, values);
            }            

            if (from < 0 || from > 1)
                from = 1;
            if (to > 1 || to < 0)
                to = 0;

            var interval = (from - to) / Items.length;
            for (var i = 0; i < Items.length; i++) {
                Items[i].backgroundColor = (typeof desaturationColorMapping.color == "string") ? desaturationColorMapping.color : this._color();              
                if (Items[i].colorWeight >= rangeMin && Items[i].colorWeight <= rangeMax) {
                    Items[i].backgroundOpacity= from;
                    from = from - interval;
                }
            }
        },
        
		
		  _generateGradientCollection: function (gradientColors) {
            var gradientCollection = [];
            var startRangeColor = gradientColors[0];
            var endRangeColor = gradientColors[gradientColors.length - 1];
            var startR = this._hexToR(startRangeColor);
            var startG = this._hexToG(startRangeColor);
            var startB = this._hexToB(startRangeColor);
            var endR = this._hexToR(endRangeColor);
            var endG = this._hexToG(endRangeColor);
            var endB = this._hexToB(endRangeColor);
            var range = 10;
            var rRange = this._getRangeColorValues(range, startR, endR);
            var gRange = this._getRangeColorValues(range, startG, endG);
            var bRange = this._getRangeColorValues(range, startB, endB);
            for (var i = 0; i < range; i++) {
                gradientCollection.push(this._rgbToHex(rRange[i], gRange[i], bRange[i]));
            }
            return gradientCollection;
        },


        _hexToR: function (h) {
            return parseInt((this._cropHex(h)).substring(0, 2), 16);
        },

        _hexToG: function (h) {
            return parseInt((this._cropHex(h)).substring(2, 4), 16);
        },

        _hexToB: function (h) {
            return parseInt((this._cropHex(h)).substring(4, 6), 16);
        },
        _cropHex: function (h) {
            return (h.charAt(0) == "#") ? h.substring(1, 7) : h;
        },

        _rgbToHex: function (R, G, B) {
            return "#" + this._toHex(R) + this._toHex(G) + this._toHex(B);
        },

        _toHex: function (n) {
            var charstr = "0123456789ABCDEF";
            n = parseInt(n, 10);
            if (isNaN(n)) return "00";
            n = Math.max(0, Math.min(n, 255));
            return charstr.charAt((n - n % 16) / 16)
                + charstr.charAt(n % 16);
        },
        _getRangeColorValues: function (range, start, end) {
            var rangeColorValues = [];
            rangeColorValues.push(start);
            if (start > end) {
                var rangeValue = (start - end) / (range - 1);
                for (var i = range; i > 2; i--) {
                    start = start - rangeValue;
                    rangeColorValues.push(start);
                }
            }
            else {
                var rangeValue = (end - start) / (range - 1);
                for (var i = 2; i < range; i++) {
                    start = start + rangeValue;
                    rangeColorValues.push(start + rangeValue);
                }
            }
            rangeColorValues.push(end);
            return rangeColorValues;
        },


        _isSVG: function () {
            if (window.SVGSVGElement)
                return true;
            else
                return false;
        },

        _drawInteractiveLegend: function () {
            var legendSettings = this.model.legendSettings;
            var xPos = 0;
            var yPos = 0, text, titleText, totalwidth, totalheight;

            //var _isSVG = (window.SVGSVGElement) ? true : false;

            var legenddiv = this._legenddiv;
            var _legendheight = this.model.legendSettings.height != 0 ? this.model.legendSettings.height : 30;
            var _legendwidth = this.model.legendSettings.width != 0 ? this.model.legendSettings.width : 100;
            if (legendSettings.mode == ej.datavisualization.TreeMap.LegendMode.Interactive || this.model.rangeColorMapping != null) {
                var textcon = '';

                if (legendSettings.height == 0)
                    _legendheight = 30;
                if (legendSettings.width == 0)
                    _legendwidth = 100;

                if (legendSettings.leftLabel == null)
                    legendSettings.leftLabel = '';
                if (legendSettings.title != null) {
                    var newxpos = xPos;
                    if (!legendSettings.showLabels)
                        newxpos = xPos + legendSettings.leftLabel.length * 10;

                    var _legendtitlewidth = legendSettings.title.length * 10;
                    var text = titleText = legendSettings.title;;

                    if (_legendtitlewidth > _legendwidth) { 
                      
                      text=  this._trimFunction(text, _legendwidth);
                    }

                    var textcon = this._createLabel(text, newxpos, yPos, 'e-interactivelegend-title');
                    textcon[0].title = titleText;
                    textcon.css({
                        "width": _legendwidth + "px"
                    });
                    if (this._isSVG())
                        textcon.appendTo(legenddiv);
                    else
                        legenddiv.append(textcon);
                    yPos += 25;
                }

                if (legendSettings.showLabels)
                    yPos += 25;

                if (legendSettings.leftLabel != null && !legendSettings.showLabels) {
                    var textcon = this._createLabel(legendSettings.leftLabel, xPos, yPos - 3, 'e-interactivelegend-leftlabel');

                    if (this._isSVG())
                        textcon.appendTo(legenddiv);
                    else

                        legenddiv.append(textcon);
                    xPos = xPos + legendSettings.leftLabel.length * 10;
                }

                var interactiveElement = this._createInteractiveArrow(xPos, yPos + _legendheight);
                interactiveElement.appendTo(legenddiv);
                this._interactiveArrow = interactiveElement;

                var _legendgroup = null;
                if (!this._isSVG() && this.model.enableGradient) {
                    _legendgroup = this._createGroup(false, "legendGroup");
                    _legendgroup.style.left = 0 + 'px';
                    _legendgroup.style.top = 0 + 'px';
                    _legendgroup.style.position = "relative";
                    legenddiv.append(_legendgroup);
                }

                var mappings = this.model.rangeColorMapping;
                for (var key = 0; key < mappings.length; key++) {
                    var colorMapping = mappings[key];
                    if (!colorMapping.hideLegend) {
                        var gradientCollection = [];
                        if (this.model.enableGradient) {
                            gradientCollection = this._generateGradientCollection(colorMapping.gradientColors);
                        }

                        var obj = {};
                        if (this.model.enableGradient) {
                            if (this._isSVG()) {
                                var canvas = $("<canvas/>");
                                var ctx = canvas[0].getContext("2d");
                                var grd = ctx.createLinearGradient(0, 0, 300, 0);

                                var temp = 0;
                                for (var i = 0; i < 10; i++) {
                                    temp = temp + (1 / 10);
                                    if (i == 0) {
                                        grd.addColorStop(0, colorMapping.gradientColors[0]);
                                        grd.addColorStop(temp, gradientCollection[i]);
                                    } else if (i == gradientCollection.length - 1) {
                                        grd.addColorStop(temp - (1 / 10), gradientCollection[i]);
                                        grd.addColorStop(temp, colorMapping.gradientColors[1]);
                                    } else {
                                        grd.addColorStop(temp - (1 / 10), gradientCollection[i]);
                                        grd.addColorStop(temp, gradientCollection[i + 1]);
                                    }
                                }
                                ctx.fillStyle = grd;
                                ctx.fillRect(0, 0, 300, 300);

                                canvas.css({
                                    "height": _legendheight + "px",
                                    "width": (_legendwidth / mappings.length) + "px",
                                    "margin-left": xPos + "px",
                                    "margin-top": yPos + "px",
                                    "opacity": "0.9",
                                    "filter": "alpha(opacity=90)", /* For IE8 and earlier */
                                    "position": "absolute"
                                });
                                canvas.appendTo(legenddiv);
                            } else {
                                var legendID = "legend" + key;
                                var legendHtmlString = '<v:rect id=' + legendID + ' display="block" style="position:absolute;top: ' + (yPos - 2) + 'px;left:' + xPos + 'px;width:' + (_legendwidth / mappings.length) + 'px;height:' + _legendheight + 'px;"><v:fill opacity="0.9px" type="gradient" method="linear sigma" angle="270"/><v:stroke opacity="0px"/></v:rect>';
                                _legendgroup.innerHTML = _legendgroup.innerHTML + legendHtmlString;
                                var legendelement = document.getElementById(legendID);
                                legendelement.fillcolor = colorMapping.gradientColors[0];
                                legendelement.fill.color2 = colorMapping.gradientColors[1];
                            }
                        }
                        else {
                            var rect = $("<div/>");
                             rect.css({
                                "height": _legendheight + "px",
                                "width": _legendwidth / this.model.rangeColorMapping.length + "px",
                                "background-color": colorMapping.color,
                                "margin-left": xPos + "px",
                                "margin-top": yPos + "px",
                                "opacity": "0.9",
                                "filter": "alpha(opacity=90)",/* For IE8 and earlier */
                                "position": "absolute"
                            });

                            if (this._isSVG())
                                rect.appendTo(legenddiv);
                            else
                                legenddiv.append(rect);
                        }

                        for (var i = 0; i < 10; i++) {
                            obj = {};
                            obj["marginLeft"] = xPos;
                            this._legendRects.push(obj);
                            xPos = xPos + (_legendwidth / mappings.length) / 10;
                        }

                        if (this.model.legendSettings.showLabels) {
                            var labelxpos = xPos - (_legendwidth / mappings.length);
                            var labelypos = yPos - 25;
                            var startlabel = this._createLabel((colorMapping.from), labelxpos, labelypos, 'e-legend-rangestartlabel');
                            labelxpos = xpos;
                            var endlabel = this._createLabel((colorMapping.to), labelxpos, labelypos);
                            if (colorMapping.legendLabel != undefined)
                                endlabel = this._createLabel((colorMapping.legendLabel), labelxpos - (colorMapping.legendLabel.length * 10) / 2, labelypos, 'e-legend-rangeendlabel');
                            if (this._isSVG()) {
                                if (colorMapping == mappings[0])
                                    startlabel.appendTo(legenddiv);
                                endlabel.appendTo(legenddiv);
                            }
                            else {
                                if (colorMapping == mappings[0])
                                    legenddiv.append(startlabel);
                                legenddiv.append(endlabel);
                            }
                        }
                    }
                }

                if (legendSettings.rightLabel != null && !legendSettings.showLabels) {
                    var textcon = this._createLabel(legendSettings.rightLabel, xPos + 10, yPos - 3, 'e-interactivelegend-rightlabel');
                    if (this._isSVG())
                        textcon.appendTo(legenddiv);
                    else
                        legenddiv.append(textcon);
                    xPos = xPos + legendSettings.rightLabel.length * 10;
                }

                totalwidth = xPos + 10;
                totalheight = yPos + _legendheight + this._interactiveArrow.height();
                this._legendSize = { width: totalwidth, height: totalheight };

                if (legendSettings.dockPosition == 'left')
                    this._marginleft = totalwidth;
                else if (legendSettings.dockPosition == 'top')
                    this._margintop = totalheight;


            }






        },
		   _trimFunction: function (str, width) {
          
       
            var span = $('<div style="width:auto;position:absolute;" class= "e-interactivelegend-title">' + str + '</div>');
             $(document.body).append(span);
             var text = str;
            while (span.width() > width) {

                text = text.slice(0, -2);
                span.text(text + "...");
                
            }
            document.body.removeChild(span[0]);
            return span.text();
                  
        


        },
        _createLabel: function (content, xpos, ypos, className) {
            var label = $("<div class=" + className + "></div>");
            label[0].innerHTML = content;
            label.css({
                "margin-left": xpos + "px",
                "margin-top": ypos + "px",
                "position": "absolute"
            });
            return label;
        },
        _createInteractiveArrow: function (xpos, ypos) {

            var interactiveElement = $("<div class='e-icon1 e-interactiveArrow'></div>");
            interactiveElement[0].innerHTML = "&#9650";

            interactiveElement.css({
                "margin-left": xpos + "px",
                "margin-top": ypos + "px",
                "position": "absolute",

            });
            return interactiveElement;
        },

        _createGroup: function (isRoot, name) {

            var vmlGroup;
            vmlGroup = document.createElement('<v:group class=' + name + '>');
            vmlGroup.style.width = this._width + 'px';
            vmlGroup.style.height = this._height + 'px';
            vmlGroup.coordorigin = "0 0";
            vmlGroup.coordsize = this._width + ' ' + this._height;
            if (isRoot) {
                this._rootgroup = vmlGroup;
                vmlGroup.style.left = '20px';
                vmlGroup.style.top = '20px';
            }
            return vmlGroup;
        },
		
        _setPaletteColor: function (Items, PaletteColors) {
            Items = Items.sort(this._orderBycolorWeight);
            for (var i = 0; i < Items.length; i++) {
                if (PaletteColors.colors != null && PaletteColors.colors.length > 0) {
                    Items[i].backgroundColor= PaletteColors.colors[i % (PaletteColors.colors.length)];
                } 
            }
        },

        _orderBycolorWeight: function (a, b) {
            if (a.colorWeight == b.colorWeight) {
                return 0;
            } else if (a.colorWeight < b.colorWeight) {
                return 1;
            }
            return -1;
        },
       
        _orderByAreaWight: function (a, b) {
            if (a.AreaByWeight == b.AreaByWeight) {
                return 0;
            } else if (a.AreaByWeight < b.AreaByWeight) {
                return 1;
            }
            return -1;
        },

        _calculateSliceAndDiceItemSize: function (Items, xPos, yPos, width, height, gap, headerHeight, isHorizontal,legendHeight) {

            if (gap == "") { gap = 0;}
            var Gap = gap;
            var totalWeight = this._getTotalWeight(Items);
            if (isHorizontal == undefined) {
                isHorizontal = width > height ? true : false;
            }
            var AvailableSize = { "Width": width, "Height": height-legendHeight };
            var headerSize = headerHeight < AvailableSize.Height ? headerHeight : 0;
            AvailableSize.Height = AvailableSize.Height - headerSize;
            var AvailableArea = { "X": xPos, "Y": yPos + headerSize, "Width": AvailableSize.Width, "Height": AvailableSize.Height };
            var parentArea = AvailableSize.Height * AvailableSize.Width;
            var itemsCount = Items.length;
            if (isHorizontal) {
                var parentHeight = AvailableSize.Height;
                var allottedWidth = 0;
                for (var i = 0; i < itemsCount; i++) {
                    var childarea = (parentArea / totalWeight) * Items[i].weight;
                    var childWidth = childarea / parentHeight;
                    gap = (childWidth > Gap) ? Gap : 0;

                    if (allottedWidth <= AvailableSize.Width) {
                        Items[i].ItemWidth = (i != itemsCount - 1) ? childWidth - parseFloat(gap) : childWidth;
                        Items[i].ItemHeight = parentHeight;
                        Items[i].LeftPosition = allottedWidth + xPos;
                        Items[i].TopPosition = yPos + headerHeight;
                        allottedWidth += childWidth;
                    }
                }
            }
            else {
                var parentWidth = AvailableSize.Width;
                var allottedHeight = 0;
                for (var i = 0; i < itemsCount; i++) {
                    var childarea = (parentArea / totalWeight) * Items[i].weight;
                    var childHeight = childarea / parentWidth;
                    gap = (childHeight > Gap) ? Gap : 0;
                    if (allottedHeight <= AvailableSize.Height) {
                        Items[i].ItemWidth = parentWidth;
                        Items[i].ItemHeight = (i != itemsCount - 1) ? childHeight - parseFloat(gap) : childHeight;
                        Items[i].LeftPosition = xPos;
                        Items[i].TopPosition = allottedHeight + yPos + headerSize;
                        allottedHeight += childHeight;
                    }
                }
            }
        },

        _calculateSquarifiedItemSize: function (Items, xPos, yPos, width, height, Gap, headerHeight, legendHeight) {

            if (Gap == "") { Gap = 0; }            
            var totalweight = this._getTotalWeight(Items);
            var AvailableSize = { "Width": width, "Height": height-legendHeight };
            var headerSize = headerHeight < AvailableSize.Height ? headerHeight : 0;
            AvailableSize.Height = AvailableSize.Height - headerSize;
            for (var i = Items.length - 1; i >= 0; i--) {
                var item = Items[i];
                item["AreaByWeight"] = (AvailableSize.Height * AvailableSize.Width) * item.weight / totalweight;
                item.headerTopPosition = yPos;
            }
            var AvailableArea = { "X": xPos, "Y": yPos + headerSize, "Width": AvailableSize.Width, "Height": AvailableSize.Height };
            var OrderedItems = Items.sort(this._orderByAreaWight);
            var curX = 0, curY = 0;
            var j = 0;
            for (var i = 0; i < Items.length; i = j) {
                var firstTreemapItem = OrderedItems[i],
                weightObject = this._getGroupTotalWeight(firstTreemapItem, OrderedItems, AvailableArea, i);
                var GroupTotalWeight = weightObject.totalWeight;
                j = weightObject.index;
                var currentRect = {};
                var isHorizontal = (AvailableArea.Width > AvailableArea.Height) ? true : false;
                for (var k = i; k < j; k++) {
                    var item = OrderedItems[k];
                    var areaSum = GroupTotalWeight;
                    if (k == i) {
                        currentRect.X = AvailableArea.X;
                        currentRect.Y = AvailableArea.Y;
                        if (isHorizontal) {
                            currentRect.Width = areaSum / AvailableArea.Height;
                            currentRect.Height = AvailableArea.Height;
                            AvailableArea.X += currentRect.Width;
                            AvailableArea.Width = Math.max(0, AvailableArea.Width - currentRect.Width);
                        }
                        else {
                            currentRect.Width = AvailableArea.Width;
                            currentRect.Height = areaSum / AvailableArea.Width;
                            AvailableArea.Y += currentRect.Height;
                            AvailableArea.Height = Math.max(0, AvailableArea.Height - currentRect.Height);
                        }
                        curX = currentRect.X;
                        curY = currentRect.Y;
                    }
                    var rect = {};
                    if (OrderedItems.indexOf(item) != OrderedItems.length - 1) {
                        rect.X = 0;
                        rect.Y = 0;
                        rect.Width = (isHorizontal) ? currentRect.Width - parseFloat(Gap) : item.AreaByWeight / currentRect.Height;
                        rect.Height = (isHorizontal) ? item.AreaByWeight / currentRect.Width : currentRect.Height - parseFloat(Gap);
                        if (j - k != 1) {
                            if (isHorizontal) {
                                rect.Height -= parseFloat(Gap);
                            }
                            else {
                                rect.Width -= parseFloat(Gap);
                            }
                        }
                    }
                    else {
                        rect.Width = (isHorizontal) ? currentRect.Width : item.AreaByWeight / currentRect.Height;
                        rect.Height = (isHorizontal) ? item.AreaByWeight / currentRect.Width : currentRect.Height;
                    }
                    item.ItemWidth = rect.Width;
                    item.ItemHeight = rect.Height;
                    item.LeftPosition = curX;
                    item.TopPosition = curY;
                    if (isHorizontal) {
                        curY += (j - k != 1) ? rect.Height + parseFloat(Gap) : rect.Height;
                    }
                    else {
                        curX += (j - k != 1) ? rect.Width + parseFloat(Gap) : rect.Width;
                    }
                }
            }
        },
        
        _getGroupTotalWeight: function (firstTreemapItem, OrderedItems, AvailableArea, j) {
            var GroupTotalWeight = 0;
            var GroupMaxAspectRatio = 0;
            for (; j < OrderedItems.length; j++) {
                var ShorterSideLength = this._getShortersideLength(AvailableArea.Width, AvailableArea.Height);
                var lastTreemapItem = OrderedItems[j];
                GroupTotalWeight += lastTreemapItem.AreaByWeight;
                var GroupWidth = GroupTotalWeight / ShorterSideLength;
                var firstitemheight = firstTreemapItem.AreaByWeight / GroupWidth;
                var lastitemheight = lastTreemapItem.AreaByWeight / GroupWidth;
                if (j == 0)
                    GroupMaxAspectRatio = this._aspectRatio(GroupWidth, ShorterSideLength);
                var TempAspectRatio = Math.max(this._aspectRatio(firstitemheight, GroupWidth), this._aspectRatio(lastitemheight, GroupWidth));
                if (GroupTotalWeight == lastTreemapItem.AreaByWeight || TempAspectRatio < GroupMaxAspectRatio) {
                    GroupMaxAspectRatio = TempAspectRatio;
                }
                else {
                    GroupTotalWeight -= lastTreemapItem.AreaByWeight;
                    GroupWidth = GroupTotalWeight / ShorterSideLength;
                    GroupMaxAspectRatio = Math.max(this._aspectRatio(firstitemheight, GroupWidth), this._aspectRatio(lastitemheight, GroupWidth));
                    break;
                }
            }
            return { totalWeight: GroupTotalWeight, index: j };
        },
       
        _aspectRatio: function (x, y) {
            return (x > y) ? (x / y) : (y / x);
        },

        _getShortersideLength: function (width, height) {
            return width > height ? height : width;
        },

        _getTotalWeight: function (Items) {
            var total = 0;
            for (var i = 0; i < Items.length; i++) {
                total += parseFloat(Items[i].weight);
            }
            return total;

        },

        _getGroupitem: function (path, dataSource, headerHeight, labelPath) {
            var obj = [];            
			if(labelPath)
					dataSource = dataSource[0] ? dataSource[0][labelPath] : dataSource[labelPath];
			if(path == null)
				path = this.labelPath() || this.weightValuePath() ;
            if (dataSource != null && this.weightValuePath() != null) {                
                for (var i in dataSource) {
                    var item = dataSource[i];
                    if (item != null && item.hasOwnProperty(path) ? true : this._containsProperty(item,path)) {
                        var itemValue = this._reflection(item, path);
                        if ($.inArray(itemValue, obj) == -1) {
                            obj.push(itemValue);
                        }
                    }
                }                
                var objCollection = [];
                for (var i = 0; i < obj.length; i++) {
                    var Coll = {};
                    var groupObj = [];
                    var groupId = obj[i];
                    var colorWeight = 0;
                    var weight = 0;
                    var count = 0;
                    for (var j = 0; j < dataSource.length;j++) {
                        var item = dataSource[j];
                        var itemValue = this._reflection(item, path);
                        if (itemValue == groupId) {
                            var weightValue = this._reflection(item, this.weightValuePath());
                       
                            if (weightValue!=null && (typeof weightValue != "number")) {
                                weightValue = Number(weightValue.replace(/[^0-9\.]+/g, ""));
                            }
                            if (weightValue < 0) {
                                weightValue = -1 * weightValue;
                            }
                            var colorWeightValue = this._reflection(item, this.colorValuePath());
                            if (colorWeightValue!=null && (typeof colorWeightValue != "number")) {

                                colorWeightValue = Number(colorWeightValue.replace(/[^0-9\.]+/g, ""));
                            }
                            groupObj.push(item);
                            count++;
                            if (weightValue != null) {
                                weight += parseFloat(weightValue);
                            }
                            if (colorWeightValue != null) {
                                colorWeight += parseFloat(colorWeightValue);
                            }
                        }
                    }
                    
                    Coll["header"] = groupId;
                    Coll["data"] = groupObj;
                    Coll["weight"] = weight;
                    Coll["colorWeight"] = colorWeight;
                    Coll["headerHeight"] = headerHeight;
                    if (weight > 0) {
                        var newTreemapItem = new treeMapItem(Coll);
                        objCollection.push(newTreemapItem);
                    }
                }
                return objCollection;
            }
            else { return null; }
        },
      
        _getTopGroupitem: function (path, dataSource) {            
            if (path == null) path = this.labelPath();
            if (path == null) path = this.weightValuePath();
            var obj = [];
            var Coll = {};
            var weight = 0, colorWeight = 0;
            var groupId="";
            var innerobjCollection = [];
            var itemColl = [];
            for (var j = 0; j < dataSource.length; j++) {
                var item = dataSource[j];
                var itemValue = this._reflection(item, path);
                var innerColl={};
                var weightValue = this._reflection(item, this.weightValuePath());
                if (weightValue != null && (typeof weightValue != "number")) {
                    weightValue = Number(weightValue.replace(/[^0-9\.]+/g, ""));
                }
                if (weightValue < 0) {
                    weightValue = -1 * weightValue;
                }
                var colorWeightValue = this._reflection(item, this.colorValuePath());
                if (colorWeightValue!=null && (typeof colorWeightValue != "number")) {

                    colorWeightValue = Number(colorWeightValue.replace(/[^0-9\.]+/g, ""));
                }  
                if (weightValue != null) {
                    weight += parseFloat(weightValue);
                }
                if (colorWeightValue != null) {
                    colorWeight += parseFloat(colorWeightValue);
                }
                itemColl.push(item);
                innerColl["weight"] = weightValue;
                innerColl["data"] = item;                
                innerColl["header"] = itemValue;
                innerColl["colorWeight"] = colorWeightValue;                                       
                var newinnerTreemapItem = new treeMapItem(innerColl);
                innerobjCollection.push(newinnerTreemapItem);
            }        
            Coll["header"] = groupId;
            Coll["data"] = itemColl;
            Coll["weight"] = weight;
            Coll["innerItem"] = innerobjCollection;
            Coll["colorWeight"] = colorWeight;                                   
            var treemapColl = [];
            var treeitem = new treeMapItem(Coll);
            treemapColl.push(treeitem);
            return  treemapColl;
        },         
       
        _containsProperty: function (object, propertyName) {
            for (var key in object)
            {
                if(key == propertyName)
                {
                    return true;
                }
            }
            return false;
        },

        _reflection: function (Source, Path) {
            var ShapeValues = Source;
            if (Path != null && Source != null) {
                var parts = Path.split(".");
                parts.push(Path);
                var i = 0;
                for (; i < parts.length; i++) {
                    if (ShapeValues != null) {
                        var hasProperty = ShapeValues.hasOwnProperty(parts[i]) ? true : this._containsProperty(ShapeValues, parts[i]);
                        if (hasProperty) {
                            $.each(ShapeValues, function (prop, propval) {
                                if (prop == parts[i]) {
                                    ShapeValues = propval;
                                    return false;
                                }
                            });
                        }
                    }
                }
                return ShapeValues;
            }
            else {
                return null;
            }

        }

    });

    var treeMapLevel = function () {        
        this.groupBackground = null;       
        this.groupBorderColor = null;
        this.groupBorderThickness = 1;       
        this.groupPadding = 4;
        this.groupPath = null;
        this.groupGap = 1;       
        this.headerHeight = 20;
        this.showHeader = true;       
        this.showLabels = false;
        this.headerTemplate = null;       
        this.labelTemplate = null;
        this.labelPosition = "center";
        this.labelVisibilityMode = "visible";      
        this.headerVisibilityMode = "visible";

        this.treeMapItems = [];
    };

    treeMapLevel.prototype = {

    };
	
    var TreeMapGroupColorMapping = function () {	
        this.groupID = null;		       
        this.rangeColorMapping = [];

        this.desaturationColorMapping = { 				            
            from:0, 				            
            to:0,			
            color: "",								            
            rangeMinimum:0,		
            rangeMaximum:0
        };  
       
        this.uniColorMapping = {             
            color: null 
        };
     
        this.paletteColorMapping = {           
            colors: [],
        };
    };		
	
    var TreeMapRangeColorMapping = function () {
        
        this.from = -1;		
        this.to = -1;		    
        this.legendlabel = null;		      
        this.color = null;
    };
	
    var treeMapItem = function (params) {
        this.weight = params.weight;
        this.colorWeight = params.colorWeight;
        this.Data = params.data;
        this.headerHeight = params.headerHeight;
        this.header = params.header;
        this.label = params.header;
        this.headerLeftPosition = 0;
        this.headerTopPosition = 0;
        this.innerItems = params.innerItem;
        this.headerWidth = 0;
        this.headerTemplate = null;
    };

    treeMapItem.prototype = {

        _generateColorMappings: function (colorMappings,treeMap) {
            if (colorMappings.rangeColorMapping != null && colorMappings.rangeColorMapping.length > 0) {
                return this._getRangeBrushColor(colorMappings.rangeColorMapping);
            }
            if (treeMap.uniColor() != null && colorMappings.uniColorMapping!=null) {
                return treeMap.uniColor();
            }
            else if (colorMappings.uniColorMapping.color != null && colorMappings.uniColorMapping != null) {
                return this._getUniColor(colorMappings.uniColorMapping);
            }
            
        },

        _getUniColor: function (uniColorMapping) {
            return uniColorMapping.color;
        },
      
        _getRangeBrushColor: function (rangeColorMapping) {
            for (var j = 0; j < rangeColorMapping.length; j++) {
                var rangeBrush = rangeColorMapping[j];
                if (this.colorWeight >= rangeBrush.from && this.colorWeight <= rangeBrush.to) {
                    return rangeBrush.color;
                }
            }
        }
    };
	
	ej.datavisualization.TreeMap.selectionMode = {
		Default: "default",
		Multiple: "multiple"
	};
	ej.datavisualization.TreeMap.textOverflow = {
	    None: "none",
        Hide:"hide",
	    Wrap: "wrap",
	    WrapByWord: "wrapbyword"
	};
	ej.datavisualization.TreeMap.groupSelectionMode = {
		Default: "default",
		Multiple: "multiple"
	};
	
    ej.datavisualization.TreeMap.ItemsLayoutMode = {        
        Squarified: "squarified",        
        SliceAndDiceHorizontal: "sliceanddicehorizontal",        
        SliceAndDiceVertical: "sliceanddicevertical",        
        SliceAndDiceAuto: "sliceanddiceauto"
    };  

    ej.datavisualization.TreeMap.DockPosition = {        
        Top: "top",        
        Bottom: "bottom",        
        Right: "right",        
        Left: "left"
    };
	ej.datavisualization.TreeMap.LegendMode = {
      Default: "default",
      Interactive: "interactive"
    };
    ej.datavisualization.TreeMap.Position = {        
        TopLeft: "topleft",        
        TopCenter: "topcenter",        
        TopRight: "topright",        
        CenterLeft: "centerleft",        
        Center: "center",        
        CenterRight: "centerright",        
        BottomLeft: "bottomleft",        
        BottomCenter: "bottomcenter",        
        BottomRight:"bottomright"
    };
    ej.datavisualization.TreeMap.Alignment = {       
        Near: "near",        
        Center: "center",        
        Far: "far"
    }
    ej.datavisualization.TreeMap.VisibilityMode = {        
        Visible:"visible",        
        HideOnExceededLength:"hideonexceededlength"
    };
})(jQuery, Syncfusion);
