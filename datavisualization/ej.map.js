/**
* @fileOverview Plugin to style the Html Map elements
* @copyright Copyright Syncfusion Inc. 2001 - 2013. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author &lt;a href="mailto:licensing@syncfusion.com"&gt;Syncfusion Inc&lt;/a&gt;
*/

(function ($, ej, undefined) {
 
    ej.widget({ "ejMap": "ej.datavisualization.Map" }, {

        validTags: ["div"],
        _initPrivateProperties: function () {
            this._rootgroup = null;
            this._bubblegroup = null;           
            this._scale = 1;
            this._prevDistance = 0;
            this._tileTranslatePoint = { x: 0, y: 0 };
            this._translatePoint = { x: 0, y: 0 };
            this._prevPoint = null;
            this._Tiles = [];
            this._prevScale = 0;
            this._tileDiv = null;
            this._containerWidth = 500;
            this._containerHeight = 400;
            this._baseTranslatePoint = { x: 0, y: 0 };
            this._isDragging = false;           
            this._prevLevel = 1;
            this._startPoint = { x: 0, y: 0 };
            this._stopPoint = { x: 0, y: 0 };
            this.mouseClickable = false;
            this._browser = null;
            this._baseScale = 0;
            this._mapBounds = null;
            this._svgns = "http://www.w3.org/2000/svg";
            this._ispanning = false;
            this._dragStartX = 0;
            this._isNavigationPressed = false;
			this._iskeyboardKeysPressed = false;
            this._isPolygonSelected = false;
            this._dragStartY = 0;
            this._width = 350;
            this._height = 350;
            this._isMapCoordinates = true;
            this._margintop = 0;
            this._marginleft = 0;
            this._legendDivWidth = 0;
            this._legendDivHeight = 0;
            this._svgDocument = null;
            this._tooltipElement = null;
            this._templateDiv = null;
            this._scrollLegendDiv = null;
            this._legendContainer = null;
            this._legendDiv = null;
            this._legendDivHeight = 0;
            this._legendDivWidth = 0;
            this._mapContainer = null;
            this._isSVG = true;
            this._VMLPathFractionCount = 0;
            this._sliderControl = null; 
            this._isTileMap=false;
            this._isRendered = false;
            this._urlTemplate = null;
            this._polylineCount = 0;
            this._pointscount = 0;
            this._isPinching = false;
            this._groupSize = null;			
			this._groupBorder = { x: 0, y: 0 };
        },


        defaults: {
            locale: null,
            enableRTL: false,
			enableGroupSeparator: false,
            background: "transparent",			
            zoomSettings:{              
                minValue: 1,
                maxValue: 100,
                factor: 1,
                level: 1,
                enableZoomOnSelection: false,
                enableMouseWheelZoom: true,
                enableZoom: true,
            },          
            centerPosition: null,           
            enableResize: true,
            isResponsive: true,
            enableAnimation: false,           
            draggingOnSelection: false,
            navigationControl:{			
				enableNavigation:false,						
				content:null,
				orientation:'vertical',			
				absolutePosition:{x:0,y:0},								
				dockPosition:'centerleft',
			},           
            enableLayerChangeAnimation: false,
            enablePan: true,
            zoomLevel: 1,
            minZoom: 1,
            maxZoom: 100,
            zoomFactor : 1,
            baseMapIndex: 0,
            shapeSelected: "",
            markerSelected: "",
            legendItemRendering: "",
            bubbleRendering: "",
            shapeRendering: "",
            zoomedIn: "",
            onRenderComplete: "",
			refreshed:"",
            panned: "",            
            zoomedOut: "",           
            mouseover : "",
            mouseleave : "",
            click: "",
            doubleClick: "",
            rightClick: "",
			onLoad:"",
            layers: []
        },

        observables: [            
            "baseMapIndex",
            "enablePan",
            "enableResize",
            "enableAnimation",
            "zoomLevel",
			"minZoom",
            "maxZoom",
            "zoomFactor",
        ],

        _zoomLevel: ej.util.valueFunction("zoomLevel"),
        _minZoom: ej.util.valueFunction("minZoom"),
        _maxZoom: ej.util.valueFunction("maxZoom"),
        _zoomFactor: ej.util.valueFunction("zoomFactor"),
        baseMapIndex: ej.util.valueFunction("baseMapIndex"),
        enablePan: ej.util.valueFunction("enablePan"),
        enableResize: ej.util.valueFunction("enableResize"),
        enableAnimation: ej.util.valueFunction("enableAnimation"),

		_tags: [{
            tag: "layers",
            attr: ["legendSettings.showLegend", "legendSettings.positionX", "legendSettings.positionY", "legendSettings.type", "legendSettings.labelOrientation",
                   "legendSettings.title", "legendSettings.mode", "legendSettings.position", "legendSettings.dockOnMap", "legendSettings.dockPosition",
				   "legendSettings.leftLabel", "legendSettings.rightLabel", "legendSettings.icon","legendSettings.iconHeight","legendSettings.iconWidth",
				   "legendSettings.height","legendSettings.width","legendSettings.showLabels","labelSettings.showLabels", "labelSettings.labelPath",
				   "labelSettings.enableSmartLabel","labelSettings.labelLength","labelSettings.smartLabelSize","selectedMapShapes","selectionMode",
                   "bubbleSettings.showBubble", "bubbleSettings.valuePath", "bubbleSettings.minValue","bubbleSettings.bubbleOpacity",
				   "bubbleSettings.showTooltip","bubbleSettings.tooltipTemplate","bubbleSettings.colorValuePath",
                   "bubbleSettings.maxValue", "bubbleSettings.color","enableAnimation", "enableSelection", "enableMouseHover", "showTooltip",
				   "showMapItems", "mapItemsTemplate", "shapeData","dataSource", "shapePropertyPath", "shapeDataPath", "layerType", "bingMapType", 
				   "urltemplate", "shapeSettings.highlightColor","shapeSettings.highlightBorderWidth", "shapeSettings.selectionColor", "shapeSettings.fill", 
				   "shapeSettings.strokeThickness", "shapeSettings.selectionStrokeWidth","shapeSettings.stroke", "shapeSettings.selectionStroke", 
				   "shapeSettings.highlightStroke", "shapeSettings.colorValuePath", "shapeSettings.valuePath","shapeSettings.autoFill", 
				   "shapeSettings.enableGradient", "shapeSettings.colorPalette", "shapeSettings.customPalette","key",
                   
			        [{
	                    tag: "markers",
	                    attr: ["label", "latitude", "longitude"],
	                    singular: "marker",
			        },
                    {
                        tag: "bubbleSettings.colorMappings.rangeColorMapping",
                        attr: ["from", "to", "color"],
                        singular: "bubblerangeColorMap",
                    },
                    {
                        tag: "bubbleSettings.colorMappings.equalColorMapping",
                        attr: ["value", "color"],
                        singular: "bubbleequalColorMap",
                    },
                    {
                        tag: "shapeSettings.colorMappings.rangeColorMapping",
                        attr: ["from", "to", "color", "gradientColors"],
                        singular: "shaperangeColorMap",
                    },
                    {
                        tag: "shapeSettings.colorMappings.equalColorMapping",
                        attr: ["value", "color"],
                        singular: "shapeequalColorMap",
                    },

			        {
	                    tag: "subLayers",
	                    attr: ["legendSettings.showLegend", "legendSettings.positionX", "legendSettings.positionY", "legendSettings.type", "legendSettings.labelOrientation",
                   "legendSettings.title", "legendSettings.mode", "legendSettings.position", "legendSettings.dockOnMap", "legendSettings.dockPosition",
				   "legendSettings.leftLabel", "legendSettings.rightLabel", "legendSettings.icon","legendSettings.iconHeight","legendSettings.iconWidth",
				   "legendSettings.height","legendSettings.width","legendSettings.showLabels","labelSettings.showLabels", "labelSettings.labelPath",
				   "labelSettings.enableSmartLabel","labelSettings.labelLength","labelSettings.smartLabelSize","selectedMapShapes","selectionMode",
                   "bubbleSettings.showBubble", "bubbleSettings.valuePath", "bubbleSettings.minValue","bubbleSettings.bubbleOpacity",
				   "bubbleSettings.showTooltip","bubbleSettings.tooltipTemplate","bubbleSettings.colorValuePath",
                   "bubbleSettings.maxValue", "bubbleSettings.color","enableAnimation", "enableSelection", "enableMouseHover", "showTooltip",
				   "showMapItems", "mapItemsTemplate", "shapeData","dataSource", "shapePropertyPath", "shapeDataPath", "layerType", "bingMapType", 
				   "urltemplate", "shapeSettings.highlightColor","shapeSettings.highlightBorderWidth", "shapeSettings.selectionColor", "shapeSettings.fill", 
				   "shapeSettings.strokeThickness", "shapeSettings.selectionStrokeWidth","shapeSettings.stroke", "shapeSettings.selectionStroke", 
				   "shapeSettings.highlightStroke", "shapeSettings.colorValuePath", "shapeSettings.valuePath","shapeSettings.autoFill", 
				   "shapeSettings.enableGradient", "shapeSettings.colorPalette", "shapeSettings.customPalette","key",
                                [{
                                    tag: "markers",
                                	attr: ["label", "latitude", "longitude"],
                                	    singular: "marker",
                                },
                                {
                                    tag: "bubbleSettings.colorMappings.rangeColorMapping",
                                    attr: ["from", "to", "color"],
                                    singular: "bubblerangeColorMap",
                                },
                                {
                                    tag: "bubbleSettings.colorMappings.equalColorMapping",
                                    attr: ["value", "color"],
                                    singular: "bubbleequalColorMap",
                                },
                                {
                                    tag: "shapeSettings.colorMappings.rangeColorMapping",
                                    attr: ["from", "to", "color","highlightcolor"],
                                    singular: "shaperangeColorMap",
                                },
                                {
                                    tag: "shapeSettings.colorMappings.equalColorMapping",
                                    attr: ["value", "color"],
                                    singular: "shapeequalColorMap",
                                }
                               ],
	                    ],
	                    singular: "subLayer",
			        }]
                ],
                singular: "layer",
		}],


		
       
        dataTypes: {
            layers: "array"
        },       

        _destroy: function () {            
            this._unWireEvents();
            if (this._isSVG) {
                $(this.element).removeClass("e-datavisualization-map e-js").find("#svgDocument").remove();
            }
            else {
                $(this.element).removeClass("e-datavisualization-map e-js").find("#rootGroup").remove();
            }
			$(this.element).removeClass("e-map-navigation").find("#ejNavigation").remove();
            $(this.element).find(".e-TemplateDiv").remove();
        },
       
        _setModel: function (options) {
            for (var prop in options) {
                switch (prop) {
                    case "zoomSettings":
                        if (this.model.zoomSettings.enableZoom) {
                            this._zoomLevel(this.model.zoomSettings.level);
                            this._zoomFactor(this.model.zoomSettings.factor);
                            this._maxZoom(this.model.zoomSettings.maxValue);
                            this._minZoom(this.model.zoomSettings.minValue);
                            this.zoom(this._zoomLevel());                            
                        }
                        break;
                    case "zoomLevel":
                        this.model.zoomSettings.level = this._zoomLevel();
                        this.zoom(this._zoomLevel());
                        break;
                    case "zoomFactor":
                        this.model.zoomSettings.factor = this._zoomFactor();
                        this.zoom(this._zoomLevel());
                        break;
                    case "minZoom":
                        this.model.zoomSettings.minValue = this._minZoom();
                        this.zoom(this._zoomLevel());
                        break;
                    case "maxZoom":
                        this.model.zoomSettings.maxValue = this._maxZoom();
                        this.zoom(this._zoomLevel());
                        break;
                    case "baseMapIndex":
                        this.baseMapIndex(options[prop]);
                        var map = this;
						this._groupSize = null;
                        if (this.enableAnimation()) {
                            this.model.enableLayerChangeAnimation = true;
                            $(this._mapContainer).animate({ opacity: 0 }, 500, function () {
                                map.refresh(true);
                            });

                        } else {
                            this.refresh(true);
                        }

                        break;                    
                    case "background":                        
                     if ((baseLayer.layerType == "geometry")) {					
                        $(this._svgDocument).css("background", this.model.background);
						}
                }
            }
        },
		
	_layers: function(index, property, value, old){
	 if (property == "shapeSettings.fill" || property == "shapeSettings.strokeThickness" ||property =="shapeSettings.selectionColor" || property =="shapeSettings.highlightColor") {
                this.clearShapeSelection();
            }
		else if(property=="showMapItems" || property=="dataSource")
		 {
			this.refreshLayers();
		 }
		 else 
		 {
		   this.refresh(true);
		 }
    },

    _layers_markers: function(index, property, value, old){
    	   this.refreshMarkers();
    },

    _layers_subLayers: function(index, property, value, old){
    	  if(property=="showMapItems" || property=="dataSource")
		 {
			this.refreshLayers();
		 }
		 else 
		 {
		   this.refresh(true);
		 }
    },
       
        _init: function () {
            var proxy = this;
			this._navigationStyle = null;
            this.navigationControlData = null;
            this._initPrivateProperties();
            this._setZoomProperties();
			this._localizedLabels = this._getLocalizedLabels();
            $.each(this.model.layers, function (index) {
                proxy._layerInitialize(index);
            });
            this._mapContainer = this.element;
            $(this._mapContainer).css({ "overflow": "hidden" });
			  if (document.documentMode == 8) {
                $(this._mapContainer).css({ "overflow": "hidden" , "position" :"relative" });
            }
			  this._wireEvents();
            this.refresh();
            this._trigger("onRenderComplete");
            this._isRendered = true;
            if (this._isSVG && this.model.enablePan) {
                $(this._svgDocument).pinchZoom(this._rootgroup, this);
            }
        },
        _setZoomProperties : function() {
		   if (typeof this.model.zoomSettings.factor != "function") {
            this._zoomFactor(this.model.zoomSettings.factor);
            this._zoomLevel(this.model.zoomSettings.level);
            this._minZoom(this.model.zoomSettings.minValue);
            this._maxZoom(this.model.zoomSettings.maxValue);
			}
        },
		
		_getLocalizedLabels: function(){
			return ej.getLocalizedConstants(this.sfType, this.model.locale);
		},
		
        _layerInitialize: function (layerindex) {
            var proxy = this;
            if (this.model.layers[layerindex] != null) {
                $.each(this.model.layers, function (index, element) {
                    element = proxy._checkArrayObject(element, index);
                    var obj = new shapeLayer();
                    $.extend(obj, element);
                    $.extend(element, obj);
                    $.each(element.subLayers, function (subindex, subelement) {
                        subelement = proxy._checkArrayObject(subelement, subindex);
                        var subobj = new shapeLayer();
                        $.extend(subobj, subelement);
                        $.extend(subelement, subobj);
                    });
                });
            }
            else {

                this.layers[0] = new shapeLayer();

            }
        },
       
        _checkArrayObject: function (element, initialName) {

            var publicProperties = ["background", "zoomSettings","bubbleSettings", "minValue", "maxValue", "factor", "level", "enableZoomOnSelection", "enableZoom", "centerPosition", "enableResize", "isResponsive", "enableAnimation", "draggingOnSelection", "navigationControl", "enableNavigation", "orientation", "absolutePosition", "dockPosition", "enablePan", "baseMapIndex", "enableSelection", "selectionMode", "enableMouseHover", "shapeData", "dataSource", "showTooltip", "legendSettings", "showLegend", "showLabels", "position", "height", "width", "type", "mode", "dockOnMap", "dockPosition", "labelSettings", "labelPath", "enableSmartLabel", "smartLabelSize", "layerType", "showMapItems", "shapeSettings", "highlightColor", "highlightBorderWidth", "selectionColor", "fill", "strokeThickness", "stroke", "highlightStroke", "selectionStroke", "selectionStrokeWidth", "colorValuePath", "valuePath", "enableGradient", "autoFill", ""];

            var proxy = this;
            $.each(element, function (name, innerElement) {
                if (publicProperties.indexOf(name) > -1) {
                    if (innerElement instanceof Array) {
                        proxy._checkArrayObject(innerElement, name);
                    }
                    else if (innerElement != null && typeof innerElement == "object") {
                        var allObjects = new shapeLayer();
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
     
        _refreshWithAnimation: function () {
            this.model.layers[this.baseMapIndex()]._setMapItemsPositionWithAnimation(this);
            for (var key = 0; key < this.model.layers[this.baseMapIndex()].subLayers.length; key++) {
                this.model.layers[this.baseMapIndex()].subLayers[key]._setMapItemsPositionWithAnimation(this);
            }
        },
       
        _resizeShape: function () {
            this.model.layers[this.baseMapIndex()]._resizeShapes(this);
            for (var key = 0; key < this.model.layers[this.baseMapIndex()].subLayers.length; key++) {
                this.model.layers[this.baseMapIndex()].subLayers[key]._resizeShapes(this);
            }

        },
        
        _refrshLayers: function () {
            this.model.layers[this.baseMapIndex()]._setMapItemsPosition(this);
            for (var key = 0; key < this.model.layers[this.baseMapIndex()].subLayers.length; key++) {
                this.model.layers[this.baseMapIndex()].subLayers[key]._setMapItemsPosition(this);
            }

        },
       
        _panTileMap: function (factorX, factorY, centerPosition) {
            
            var totalSize = Math.pow(2, this._zoomLevel()) * 256;
            this._tileTranslatePoint.x = (factorX / 2) - (totalSize / 2);
            this._tileTranslatePoint.y = (factorY / 2) - (totalSize / 2);
            var position = this._convertTileLatLongtoPoint(centerPosition[0],centerPosition[1]);
            this._tileTranslatePoint.x -= position.x - (factorX / 2);
            this._tileTranslatePoint.y -= position.y - (factorY / 2);

        },
       
        _generateTiles: function (zoomLevel) {
            var userLang = navigator.language || navigator.userLanguage;
            this.Tiles = [];
            var xcount, ycount;
            xcount = ycount = Math.pow(2, zoomLevel);
            var baseLayer = this.model.layers[this.baseMapIndex()];
            var endY = Math.min(ycount, ((-this._tileTranslatePoint.y + this._height) / 256) + 1);
            var endX = Math.min(xcount, ((-this._tileTranslatePoint.x + this._width) / 256) + 1);
            var startX = (-(this._tileTranslatePoint.x + 256) / 256);
            var startY = (-(this._tileTranslatePoint.y + 256) / 256);
            for (var i = Math.round(startX) ; i < Math.round(endX) ; i++) {
                for (var j = Math.round(startY) ; j < Math.round(endY) ; j++) {
                    var x = 256 * i + this._tileTranslatePoint.x;
                    var y = 256 * j + this._tileTranslatePoint.y;
                    if (x > -256 && x <= this._width && y > -256 && y < this._height) {
                        if (i >= 0 && j >= 0) {
                            var tile = new Tile(i, j);
                            tile.left = x;
                            tile.top = y;
                            if (baseLayer.layerType == ej.datavisualization.Map.LayerType.Bing) {
                                tile.src = this._getBingMap(tile, baseLayer.key, baseLayer.bingMapType, userLang);
                            } else {
                                tile.src = this._urlTemplate.replace("level", this._zoomLevel()).replace('tileX', tile.X).replace('tileY', tile.Y);
                            }
                            this.Tiles.push(tile);
                        }
                    }
                }
            }
            var proxTiles = $.extend(true, [], this.Tiles);
            for (var layerIndex = 0; layerIndex < this.model.layers[this.baseMapIndex()].subLayers.length;layerIndex++) {
                var layer = this.model.layers[this.baseMapIndex()].subLayers[layerIndex];
                if (layer.layerType == ej.datavisualization.Map.LayerType.OSM || layer.layerType == ej.datavisualization.Map.LayerType.Bing) {
                    for (var tileIndex = 0; tileIndex < proxTiles.length; tileIndex++) {
                        var baseTile = proxTiles[tileIndex];
                        var subtile = $.extend(true, {}, baseTile);
                        if (layer.layerType == ej.datavisualization.Map.LayerType.Bing) {
                            subtile.src = this._getBingMap(subtile, layer.key, layer.bingMapType, userLang);
                        } else {
                            subtile.src = layer.urlTemplate.replace("level", this._zoomLevel()).replace('tileX', baseTile.X).replace('tileY', baseTile.Y);
                        }
                        this.Tiles.push(subtile);
                    }

                }
            }
            this._arrangeTiles();
        },
       
        _getBingMap:function(tile,key,type,lang) {
            var quadKey = "";
            for (var i = this._zoomLevel() ; i > 0; i--)
            {
                var digit = 0;
                var mask = 1 << (i - 1);
                if ((tile.X & mask) != 0)
                {
                    digit++;
                }
                if ((tile.Y & mask) != 0)
                {
                    digit+=2;
                }
                quadKey = quadKey+""+digit;
            }
            var layerType;
            if (type == ej.datavisualization.Map.BingMapType.Aerial) {
                layerType = "A,G";
            }
            else if (type == ej.datavisualization.Map.BingMapType.AerialWithLabel) {
                layerType = "A,G,L";
            } else {
                layerType = "G,VE,BX,L,LA";
            }
            var imageUrl = "http://ak.dynamic.t2.tiles.virtualearth.net/comp/ch/" + quadKey + "?mkt=" + lang + "&ur=IN&it=" + layerType + "&shading=hill&og=45&n=z&Key=" + key;
            return imageUrl;
        },
               
        _arrangeTiles: function (){        
            var pathTemplate = "<div><div style='position:absolute;left:{{:left}}px;top:{{:top}}px;height:{{:height}}px;width:{{:width}}px;'><img src={{:src}}></img></div></div>";
            var tmpl2 = $.templates(pathTemplate);
            var htmlString = tmpl2.render(this.Tiles);
            var first = this._mapContainer[0].children[0];            
            this._tileDiv.html(htmlString);            
        },

        _generatePath: function () {
           
            var baseLayer = this.model.layers[this.baseMapIndex()];            
            var pathCollection = '';
            this._polylineCount = 0;
            this._pointscount = 0;
            this._isSVG = (window.SVGSVGElement) ? true : false;

            
            if (baseLayer.layerType.toLowerCase() == ej.datavisualization.Map.LayerType.Geometry) {
                if (baseLayer != undefined && baseLayer.shapeData != null) {
                    baseLayer._isBaseLayer = true;
                    this._isTileMap = false;
                    this._scale = this._zoomLevel();
                    pathCollection = this._readShapeData(baseLayer);
                }
            }
            else {                
                this._isTileMap = true;
                this._scale = Math.pow(2, this._zoomLevel() - this._zoomFactor());
            }
            for (var key = 0; key < baseLayer.subLayers.length; key++) {
                if (baseLayer.subLayers[key].layerType == ej.datavisualization.Map.LayerType.Geometry && baseLayer.subLayers[key].shapeData != null) {
                    baseLayer.subLayers[key]._isBaseLayer = false;
                    pathCollection += this._readShapeData(baseLayer.subLayers[key]);
                }
            }
            if (this._isSVG) {
                var htmlstring = '<div style="position:relative;" id="tileDiv"/><svg xmlns="http://www.w3.org/2000/svg" style= "overflow:hidden;z-index:0;float:left;left:0,top:0"' +
                             'id="svgDocument"> <g id="rootGroup">' + pathCollection + '</g></svg>';
                this._mapContainer.html(htmlstring);               
                this._svgDocument = this.element.find("#svgDocument")[0];
                this._tileDiv = this.element.find("#tileDiv");
                
            }
            else {
                document.createStyleSheet().addRule(".vml", "behavior:url(#default#VML);display:inline-block");
                document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', "#default#VML");
                var vmlGroup = '<div id="tileDiv"/><v:group   id = "rootGroup" style="position:absolute; width:' + this._width + 'px;height:' + this._height + 'px;" coordorigin = "0 0" coordsize="' + this._width + ' ' + this._height + '">' + pathCollection + '</v:group>';
                this._mapContainer.html(vmlGroup);                
                this._tileDiv = this.element.find("#tileDiv");
                this._bubblegroup = this._createGroup(false,"bubbleGroup");               
                this._bubblegroup.style.position = "absolute";
                this.element.append(this._bubblegroup);
            }
            if (baseLayer.layerType == ej.datavisualization.Map.LayerType.OSM || baseLayer.layerType == ej.datavisualization.Map.LayerType.Bing) {
                this._urlTemplate = baseLayer.urlTemplate;
                if (this.model.centerPosition != null) {
                    this._panTileMap(this._width, this._height, this.model.centerPosition);
                }
                else {
                    this._panTileMap(this._width, this._height, [0, 0]);
                }
                this._generateTiles(this._zoomLevel());
				if(this._isSVG)
				{
				  $(this._svgDocument).css("position","relative");
				}
            }
            if(this._isSVG)
			{			
                $(this._mapContainer).css("position", "relative");
			}			
            this._rootgroup = this.element.find("#rootGroup")[0];

            this._on($(this.element), ej.eventType.mouseDown, { map: this }, this.dragDown);
            this._on($(this.element), ej.eventType.mouseMove, { map: this }, this.dragMove);
            this._on($(this.element), ej.eventType.mouseUp, { map: this }, this.dragUp);

        },

        isMultipolygon: function(coords){
            return coords&&coords[0]&&coords[0][0]&&coords[0][0][0]&&coords[0][0][0].length>0;
        },

        calculateMultiPolygonBBox: function(coords, minMaxLatLng, isEntered){
            for(var i=0; i<coords.length;i++)
                minMaxLatLng = this.calculatePolygonBBox(coords[i], minMaxLatLng, isEntered || i > 0);
            return true;                
        },

        calculatePolygonBBox: function(coords, minMaxLatLng, isEntered){
            var currentDataLength = coords.length;
            for (var j = 0; j < currentDataLength; j++) {
                var subData = '';
                if (currentDataLength > 1) {
                    subData = coords[j][0];
                    if (subData.length <= 2)
                        subData = coords[j];
                } else
                    subData = coords[j];
                if (subData.length > 2) {
                    for (var k = 0; k < subData.length; k++) {
                        if(subData[k][1]!=null && subData[k][0]!=null){
                            if (!isEntered) {
                                minMaxLatLng.minLatitude = minMaxLatLng.maxLatitude = subData[k][1];
                                minMaxLatLng.minLongitude = minMaxLatLng.maxLongitude = subData[k][0];
                                isEntered = true;
                            } else {
                                minMaxLatLng.minLatitude = Math.min(minMaxLatLng.minLatitude, subData[k][1]);
                                minMaxLatLng.maxLatitude = Math.max(minMaxLatLng.maxLatitude, subData[k][1]);
                                minMaxLatLng.minLongitude = Math.min(minMaxLatLng.minLongitude, subData[k][0]);
                                minMaxLatLng.maxLongitude = Math.max(minMaxLatLng.maxLongitude, subData[k][0]);
                            }
                        }
                    }
                } else {
                    if(subData[k][1]!=null && subData[k][0]!=null){
                        if (!isEntered) {
                            minMaxLatLng.minLatitude = minMaxLatLng.maxLatitude = subData[1];
                            minMaxLatLng.minLongitude = minMaxLatLng.maxLongitude = subData[0];
                            isEntered = true;
                        } else {
                            minMaxLatLng.minLatitude = Math.min(minMaxLatLng.minLatitude, subData[1]);
                            minMaxLatLng.maxLatitude = Math.max(minMaxLatLng.maxLatitude, subData[1]);
                            minMaxLatLng.minLongitude = Math.min(minMaxLatLng.minLongitude, subData[0]);
                            minMaxLatLng.maxLongitude = Math.max(minMaxLatLng.maxLongitude, subData[0]);
                        }
                    }
                }
            }
            return minMaxLatLng;
        },

        _calculateBBox: function (polygonDatas, polylineDatas,pointData)
        {
            var minLatitude, maxLatitude, minLongitude, maxLongitude, coords,
                minMaxLatLng = { minLatitude : 0, maxLatitude : 0, minLongitude : 0, maxLongitude : 0},
                isEntered = false;
            minLatitude = maxLatitude = minLongitude = maxLongitude = 0;
            if (polygonDatas != null && polygonDatas.length > 0) {
                for (var i = 0; i < polygonDatas.length; i++) {
                    var currentData = polygonDatas[i];
                    coords = currentData.geometry != null ? currentData.geometry.coordinates :  currentData.coordinates;                    
                    this.isMultipolygon(coords) ? this.calculateMultiPolygonBBox(coords, minMaxLatLng, i > 0) : this.calculatePolygonBBox(coords, minMaxLatLng, i > 0);
                }
            }
            minLatitude = minMaxLatLng.minLatitude;
            maxLatitude = minMaxLatLng.maxLatitude;
            minLongitude = minMaxLatLng.minLongitude;
            maxLongitude = minMaxLatLng.maxLongitude;
            if (pointData!=null && pointData.length > 0) {
                for (var i = 0; i < pointData.length; i++) {
                    var currentData = pointData[i];
                    subData = currentData.geometry.coordinates;
                    if (!isEntered) {
                        minLatitude = maxLatitude = subData[1]; // (φ)
                        minLongitude = maxLongitude = subData[0];
                        isEntered = true;
                    } else {
                        minLatitude = Math.min(minLatitude, subData[1]);
                        maxLatitude = Math.max(maxLatitude, subData[1]);
                        minLongitude = Math.min(minLongitude, subData[0]);
                        maxLongitude = Math.max(maxLongitude, subData[0]);
                    }
                }
            }
            if (polylineDatas!=null && polylineDatas.length > 0) {
                for (var i = 0; i < polylineDatas.length; i++) {
                    var coordinates;
                    if (polylineDatas[i].geometry == null) {
                        coordinates = polylineDatas[i].coordinates;
                    }
                    else {
                        coordinates = polylineDatas[i].geometry.coordinates;
                    }
                    for (var k = 0; k < coordinates.length; k++) {
                        if (!isEntered) {
                            minLatitude = maxLatitude = coordinates[k][1]; // (φ)
                            minLongitude = maxLongitude = coordinates[k][0];
                            isEntered = true;
                        } else {
                            minLatitude = Math.min(minLatitude, coordinates[k][1]);
                            maxLatitude = Math.max(maxLatitude, coordinates[k][1]);
                            minLongitude = Math.min(minLongitude, coordinates[k][0]);
                            maxLongitude = Math.max(maxLongitude, coordinates[k][0]);
                        }
                    }
                }
            }
            
			if (this._groupSize == null && !this._isMapCoordinates) {
            this._groupSize = { minX: minLongitude, maxX: maxLongitude, minY: minLatitude, maxY: maxLatitude };
             }
            return [[minLongitude, minLatitude], [maxLongitude, maxLatitude]];        
        },
        		
        _readShapeData: function (layer) {
            var map = this;
            if (layer.shapeData != null) {
                if (typeof layer.shapeData == 'string') {
                    var dataManger =new ej.DataManager(layer.shapeData);
                    var query = ej.Query().from(layer);
                    dataManger.executeQuery(query).done(function (e) {
                        if (e.result != null) {
                            return map._getPathCollection(e.result, layer);
                        }
                    });

                } else {
                 return this._getPathCollection(layer.shapeData, layer);
                }
                
            }
        },
       
        _getFactor:function()
        {
            var contHeight, contWidth, hfactor, wfactor;
            if (this._mapBounds != null) {
                var startpoint = this._convertTileLatLongtoPointForShapes(this._mapBounds[0][1], this._mapBounds[0][0], this._mapBounds),
                    endpoint = this._convertTileLatLongtoPointForShapes(this._mapBounds[1][1], this._mapBounds[1][0], this._mapBounds),
                    minDiff = 0;
                wfactor = hfactor = 1;
                contHeight = endpoint.y - startpoint.y;
                contWidth = endpoint.x - startpoint.x;
            }
            else
                contHeight = contWidth = 500;
            if (contHeight < this._height)
                hfactor = parseFloat(Math.abs(this._height / contHeight + "e+1").toString().split('.')[0] / 10);
			else
                hfactor = (this._height / contHeight);
            if (contWidth < this._width)
                wfactor = parseFloat(Math.abs(this._width / contWidth + "e+1").toString().split('.')[0] / 10);
			else
                wfactor = (this._width / contWidth);                        
            return Math.min(wfactor, hfactor); 
        },

        _getPathCollection:function(data,layer)
        {
            var shapePath = "";
            var type = "";
            var dataManager="", latitude, longitude;
            if (data.features != null) {
                dataManager = new ej.DataManager(data.features);
                type = "geometry.type";
                if (layer._isBaseLayer) {
                    this._mapBounds = data.bbox;
                }
            }
            else if (data.geometries != null) {
                dataManager = new ej.DataManager(data.geometries);
                type = "type";
                if (layer._isBaseLayer) {
                    if (data.bbox != null)
                        this._mapBounds = [[data.bbox[0], data.bbox[1]], [data.bbox[2], data.bbox[3]]];
                    }                
            }
			if(data.geometries!=null || data.features != null){
            var queryPolyLine = ej.Query().from(layer).where(type, ej.FilterOperators.equal, 'LineString');
            var queryPolygon = ej.Query().from(layer).where(type, ej.FilterOperators.equal, 'Polygon');
            var queryMulitiPolygon = ej.Query().from(layer).where(type, ej.FilterOperators.equal, 'MultiPolygon');
            var polylineDatas = dataManager.executeLocal(queryPolyLine);           
            var polygonDatas = dataManager.executeLocal(queryPolygon);
            var queryPoint = ej.Query().from(layer).where(type, ej.FilterOperators.equal, 'Point');
            var pointData = dataManager.executeLocal(queryPoint);
            var multiPolygonDatas = dataManager.executeLocal(queryMulitiPolygon);
            this._polylineCount = this._polylineCount + polylineDatas.length;
            this._pointscount = this._pointscount + pointData.length;
            $.merge(polygonDatas, multiPolygonDatas);
            if (layer._isBaseLayer && layer.geometryType == ej.datavisualization.Map.GeometryType.Normal) {
                this._isMapCoordinates = false;
            }
            if (this._mapBounds == null && layer._isBaseLayer) {
                this._mapBounds = this._calculateBBox(polygonDatas, polylineDatas, pointData);
            }
			else if (this._mapBounds == null)
                   this._mapBounds = [[-180, -85], [180, 85]] ;

            var factor = this._getFactor();

			layer._newBounds = [];                 
            var pointHtml = "";
            if(this._groupSize != null)
			{
			
			minX = this._groupSize.minX;
			maxX = this._groupSize.maxX;
			minY = this._groupSize.minY;
			maxY = this._groupSize.maxY;
			}
            var minX, maxX, minY, maxY, flag = true;
            if (pointData.length > 0) {
                for (var i = 0; i < pointData.length; i++) {
                    var currentData = pointData[i];                   
                    var check = '';
                    subData = currentData.geometry.coordinates;
                    var data = [];
                    var data_clean = [];                   
                    data.push({
                        lat: parseFloat(subData[1]),
                        lng: parseFloat(subData[0])                        
                    });                    
                    var l = 0;

                    var point = data[0];
                    latitude = point.lat; // (φ)
                    longitude = point.lng;   // (λ)                   
                    var p = this._convertTileLatLongtoPointForShapes(latitude, longitude, this._mapBounds,factor);
                    var boundingBox = this._mapBounds;
                    if ((longitude >= boundingBox[0][0] && longitude <= boundingBox[1][0] && latitude >= boundingBox[0][1] && latitude <= boundingBox[1][1])) {

                    if (flag && this._groupSize == null) {
                        minX = maxX = p.x;
                        minY = maxY = p.y;
                        flag = false;
                    }
                    else {
                        minX = Math.min(minX, p.x);
                        maxX = Math.max(maxX, p.x);
                        minY = Math.min(minY, p.y);
                        maxY = Math.max(maxY, p.y);
                    }

                    if (this._isSVG) {
                        data_clean.push({ x: p.x, y: p.y, lat: point.lat, lng: point.lng });
                    }
                    else {
                        data_clean.push({ x: p.x - ((10 / this._scale)/2), y: p.y-((10 / this._scale) / 2), lat: point.lat, lng: point.lng });
                    }

                    if (this._isSVG) {
                        pointHtml += '<circle cx="' + data_clean[0].x + '" cy="' + data_clean[0].y + '" r="' + layer.shapeSettings.radius / this._scale + '" stroke="' + layer.shapeSettings.stroke + '" stroke-width="' + layer.shapeSettings.strokeThickness + '" fill="' + layer.shapeSettings.fill + '" />';
                    }
                    else {
                        var pointHtmlString = '<v:oval display="block" fill="' + layer.shapeSettings.fill + '" style="position:absolute;top: ' + data_clean[0].y + 'px;left:' + data_clean[0].x + 'px;width:' + 10 / this._scale + 'px;height:' + 10 / this._scale + 'px;stroke-width:' + layer.shapeSettings.strokeThickness + 'px;"></v:oval>';
                        pointHtml += pointHtmlString;
                    }
                  }  else {
                        pointData.splice(i, 1);
                        i--;
                    }
                }

            }            
            if (polygonDatas.length > 0)
            {
                
                for (var i = 0; i < polygonDatas.length; i++) {
                    var currentData = polygonDatas[i];
                    var midCoordinate = 0;
                    var midCoordinateLength;
                    var coords;
                    if (currentData.geometry != null) {
                        coords = currentData.geometry.coordinates;
                    }
                    else {
                        coords = currentData.coordinates;
                    }                    
                    midCoordinateLength = coords[0][0].length;
                    var currentDataLength = coords.length;
                    if (currentDataLength > 1) {
                        var lst = coords;
                        for (var index = 0; index < lst.length; index++) {
                            if (midCoordinateLength < lst[index][0].length) {
                                midCoordinateLength = lst[index][0].length;
                                midCoordinate = index;
                            }
                        }
                    }
                    var path_code = '';
                    for (var j = 0; j < currentDataLength; j++) {
                        var subData = '';                       
                        if (currentDataLength > 1) {
                            subData = coords[j][0];
                            if (subData.length <=2) {
                                subData = coords[j];
                            }
                        }
                        else {
                            subData = coords[j];
                        }
                        var data = [];
                        var data_clean = [];
                        var multiPolygonData = [];
                        
                        if (this.isMultipolygon(coords)) {
                            for (var m = 0; m < subData.length; m++) {                                
                                if (subData[m].length > 2) {
                                    if(!multiPolygonData[m])
                                        multiPolygonData[m]=[];
                                    for (var k = 0; k < subData[m].length; k++) {                                        
                                        multiPolygonData[m].push({
                                            lat: parseFloat(subData[m][k][1]),
                                            lng: parseFloat(subData[m][k][0])
                                        });
                                    }
                                }
                                else if(subData.length>2) {
                                    for(var k=0;k<subData.length;k++) {
                                        data.push({
                                            lat: parseFloat(subData[k][1]),
                                            lng: parseFloat(subData[k][0])
                                        });
                                    }
                                    break;
                                }
                                else{
                                    data.push({
                                            lat: parseFloat(subData[0]),
                                            lng: parseFloat(subData[1])
                                        });
                                }
                            }
                        }
                        else if (subData.length > 2) {
                            for (var k = 0; k < subData.length; k++) {
                                data.push({
                                    lat: parseFloat(subData[k][1]),
                                    lng: parseFloat(subData[k][0])
                                });
                            }
                        }
                        else {
                            data.push({
                                lat: parseFloat(subData[1]),
                                lng: parseFloat(subData[0])
                            });
                        } 
                        if(multiPolygonData.length<1) {
                            for(var l=0;l<data.length-1||(data.length==1&&l==0) ;l++) {
                                var point=data[l];
                                latitude=point.lat; // (φ)
                                longitude=point.lng;   // (λ                           
                                var boundingBox=this._mapBounds;
                                if(this._isTileMap||(longitude>=boundingBox[0][0]&&longitude<=boundingBox[1][0]&&latitude>=boundingBox[0][1]&&latitude<=boundingBox[1][1])) {

                                    var p=this._convertTileLatLongtoPointForShapes(latitude,longitude,boundingBox,factor);
                                    if(flag&&this._groupSize==null) {
                                        minX=maxX=p.x;
                                        minY=maxY=p.y;
                                        flag=false;
                                    }
                                    else {
                                        minX=Math.min(minX,p.x);
                                        maxX=Math.max(maxX,p.x);
                                        minY=Math.min(minY,p.y);
                                        maxY=Math.max(maxY,p.y);
                                    }
                                    if(this._isSVG) {
                                        data_clean.push({ x: p.x,y: p.y,lat: point.lat,lng: point.lng });
                                    }
                                    else {
                                        data_clean.push({ x: p.x,y: p.y,lat: point.lat,lng: point.lng });
                                    }
                                }

                            }
                            if(j==midCoordinate) {
                                layer._newBounds.push(this._findMidPointofPoylgon(data_clean));
                            }

                            if(data_clean.length>0) {
                                if(this._isSVG) {
                                    path_code+="M"+(data_clean[0].x)+","+(data_clean[0].y);
                                    for(var m=1;m<data_clean.length;m++) {
                                        path_code+=","+(data_clean[m].x)+","+(data_clean[m].y);
                                    }
                                    path_code+="Z";
                                }
                                else {
                                    path_code+="m"+parseInt(data_clean[0].x)+","+parseInt(data_clean[0].y);
                                    path_code+=" l"+parseInt(data_clean[0].x)+","+parseInt(data_clean[0].y);
                                    for(var m=1;m<data_clean.length;m++) {
                                        path_code+=","+parseInt(data_clean[m].x)+","+parseInt(data_clean[m].y);
                                    }
                                    path_code+=" e";
                                }
                            }
                        }
                        else{
                            for(var mul=0;mul<multiPolygonData.length;mul++) {
                                data = multiPolygonData[mul];
                                data_clean = [];
                                for(var l=0;l<data.length-1||(data.length==1&&l==0) ;l++) {
                                    var point=data[l];
                                    latitude=point.lat; // (φ)
                                    longitude=point.lng;   // (λ                           
                                    var boundingBox=this._mapBounds;
                                    if(this._isTileMap||(longitude>=boundingBox[0][0]&&longitude<=boundingBox[1][0]&&latitude>=boundingBox[0][1]&&latitude<=boundingBox[1][1])) {

                                        var p=this._convertTileLatLongtoPointForShapes(latitude,longitude,boundingBox,factor);
                                        if(flag&&this._groupSize==null) {
                                            minX=maxX=p.x;
                                            minY=maxY=p.y;
                                            flag=false;
                                        }
                                        else {
                                            minX=Math.min(minX,p.x);
                                            maxX=Math.max(maxX,p.x);
                                            minY=Math.min(minY,p.y);
                                            maxY=Math.max(maxY,p.y);
                                        }
                                        if(this._isSVG) {
                                            data_clean.push({ x: p.x,y: p.y,lat: point.lat,lng: point.lng });
                                        }
                                        else {
                                            data_clean.push({ x: p.x,y: p.y,lat: point.lat,lng: point.lng });
                                        }
                                    }

                                }
                                if(j==midCoordinate) {
                                    layer._newBounds.push(this._findMidPointofPoylgon(data_clean));
                                }

                                if(data_clean.length>0) {
                                    if(this._isSVG) {
                                        path_code+="M"+(data_clean[0].x)+","+(data_clean[0].y);
                                        for(var m=1;m<data_clean.length;m++) {
                                            path_code+=","+(data_clean[m].x)+","+(data_clean[m].y);
                                        }
                                        path_code+="Z";
                                    }
                                    else {
                                        path_code+="m"+parseInt(data_clean[0].x)+","+parseInt(data_clean[0].y);
                                        path_code+=" l"+parseInt(data_clean[0].x)+","+parseInt(data_clean[0].y);
                                        for(var m=1;m<data_clean.length;m++) {
                                            path_code+=","+parseInt(data_clean[m].x)+","+parseInt(data_clean[m].y);
                                        }
                                        path_code+=" e";
                                    }
                                }
                            }
                        }

                    }
                    if (path_code != "") {
                        if (this._isSVG) {
                            shapePath += '<path class="e-mapShape" stroke=' + layer.shapeSettings.stroke +
                                        ' stroke-width=' + (layer.shapeSettings.strokeThickness / this._scale) +
                                         ' fill= ' + layer.shapeSettings.fill + ' d="' + path_code + '"  stroke-linejoin= round stroke-linecap= square></path>';
                        }
                        else {
                            shapePath += '<v:shape  style="width:' + this._width + 'px;height:' + this._height + 'px;"  coordsize="'
                                + this._width + ' ' + this._height + '" coordorigin="0 0" strokecolor=' + layer.shapeSettings.stroke +
                                           ' stroke-width=' + (layer.shapeSettings.strokeThickness / this._scale) + 'px"' +
                                            ' fillcolor= ' + layer.shapeSettings.fill + ' path="' + path_code + '"></v:shape>';
                        }
                    }
                    else {
                        polygonDatas.splice(i, 1);
                        i--;
                    }
                    
                }
                
            }
            
            if (polylineDatas.length > 0) {

                for (var i = 0; i < polylineDatas.length; i++) {
                    var coordinates;
                    if (polylineDatas[i].geometry == null) {
                        coordinates = polylineDatas[i].coordinates;
                    }
                    else {
                        coordinates = polylineDatas[i].geometry.coordinates;
                    }
                    var linedata = '';
                    for (var k = 0; k < coordinates.length; k++) {
                        var factor = this._getFactor();
                        var points = this._convertTileLatLongtoPointForShapes(coordinates[k][1], coordinates[k][0], this._mapBounds,factor);
						
						 if (flag && this._groupSize == null) {
                        minX = maxX = points.x;
                        minY = maxY = points.y;
                        flag = false;
                    }
                    else {
                        minX = Math.min(minX, points.x);
                        maxX = Math.max(maxX, points.x);
                        minY = Math.min(minY, points.y);
                        maxY = Math.max(maxY, points.y);
                    }
                        linedata += points.x + "," + points.y;
                        if (k != coordinates.length - 1)
                            linedata += ",";
                    }

                    if (this._isSVG) {
                        shapePath += '<polyline stroke=' + layer.shapeSettings.stroke +
                                    ' stroke-width=' + (layer.shapeSettings.strokeThickness / this._scale) + ' fill="transparent" stroke-width="1" points="' + linedata + '" ></polyline>';

                    }
                    else {
                        shapePath += '<v:polyline coordsize="'+ this._width + ',' + this._height + '" coordorigin="0 0" strokecolor=' + layer.shapeSettings.stroke +
                                                               ' strokeweight=' + (layer.shapeSettings.strokeThickness / this._scale) + 'px"' +
                                                                ' fillcolor=' + layer.shapeSettings.fill + '  points="' + linedata + '"/>';


                    }
                }

            }           
            if(this._isMapCoordinates)
            {
                this._groupSize = { minX: minX, maxX: maxX, minY: minY, maxY: maxY };
            }
            var lines = [].concat(polygonDatas, polylineDatas);
            layer._polygonData = $.merge(lines, pointData);
            return shapePath + pointHtml;
			}
			else{
			  layer._polygonData=[];
			    return null;
		   }
        },
             
        _createGroup: function (isRoot,name) {
            
            var vmlGroup;
            vmlGroup = document.createElement('<v:group class='+name+'>');
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

        _generatePaletteColorsForShape: function (shape, shapelayer, palette, palettesettings) {

            if (palettesettings != null) {
                shapelayer.shapeSettings.highlightColor = palettesettings.highlightColor;
                shapelayer.shapeSettings.highlightStroke = palettesettings.highlightStroke;
                shapelayer.shapeSettings.selectionColor = palettesettings.SelectionColor;
                shapelayer.shapeSettings.selectionStroke = palettesettings.SelectionStroke;
                
            }

            if (this._isSVG) {
                shape.setAttribute("fill", palette[shapelayer._prevPaletteIndex]);
            }
            else {
                shape.fillcolor = palette[shapelayer._prevPaletteIndex];
            }
            shapelayer._prevPaletteIndex = shapelayer._prevPaletteIndex + 1;
            if (shapelayer._prevPaletteIndex > palette.length - 1)
                shapelayer._prevPaletteIndex = 0;
        },

        _renderLayers: function (layer, pathCount, mapObject) {

            layer._prevPaletteIndex = 0;
            layer._initializeLocalValues();   
            if (layer.selectedItems == null) {
                layer.selectedItems = [];
            }       
            var proxyrootGroup = this._rootgroup;
            var proxySVG = this._svgDocument;
            var proxyControl = this;
            var shapelayer = layer;
            var minValue = 0;
            var maxValue = 0;
            var sum = 0;
            if (shapelayer.dataSource != null && shapelayer.bubbleSettings != null) {
                if (shapelayer.bubbleSettings.colorValuePath  == null) {
                    shapelayer.bubbleSettings.colorValuePath  = shapelayer.bubbleSettings.valuePath;
                }
                for (var i = 0; i < shapelayer.dataSource.length; i++) {
                    var bubbledata = parseFloat(this._reflection(shapelayer.dataSource[i], shapelayer.bubbleSettings.valuePath));
                    if (i != 0) {
                        if (bubbledata > maxValue) {
                            maxValue = bubbledata;
                        } else if (bubbledata < minValue) {
                            minValue = bubbledata;
                        }
                    } else {
                        minValue = maxValue = bubbledata;
                    }
                }
            }

            this._generateTooltipForLayers(shapelayer);
            if (shapelayer.shapeData != null) {
                var shapesource = [];
                if (shapelayer.dataSource != null) {
                    for (var key = 0; key < shapelayer.dataSource.length; key++) {
                        var shapeitem = shapelayer.dataSource[key];
                        var shapeItemValue = proxyControl._reflection(shapeitem, shapelayer.shapeDataPath);
                        if (shapeItemValue != null) {
                            shapeItemValue = shapeItemValue.toLowerCase();
                        }
                        shapesource.push(shapeItemValue);
                    }
                }
                // touchevent changing
                var browserInfo = ej.browserInfo(),
                    temp = this.model,
                    isPointer = browserInfo.isMSPointerEnabled,
                    isIE11Pointer = browserInfo.pointerEnabled,
                    touchEndEvent = isPointer ? (isIE11Pointer ? "pointerup" : "MSPointerUp") : "touchend mouseup",
                    touchMoveEvent = isPointer ? (isIE11Pointer ? "pointermove" : "MSPointerMove") : "touchmove mousemove",
                    touchStartEvent = isPointer ? (isIE11Pointer ? "pointerdown" : "MSPointerDown") : "touchstart mousedown",
                    touchCancelEvent = isPointer ? (isIE11Pointer ? "pointerleave" : "MSPointerOut") : "touchend mouseleave";
                for (var dataIndex = 0; dataIndex < shapelayer._polygonData.length; dataIndex++) {
                    var ValueObject = shapelayer._polygonData[dataIndex].properties;
                    var DBFValue = proxyControl._reflection(ValueObject, shapelayer.shapePropertyPath);
                    var dbfCondition, colorPath = shapelayer.bubbleSettings.colorPath;
                    if (DBFValue != null && (typeof DBFValue) == "string") {
                        dbfCondition = DBFValue.toLowerCase();
                    }
                    var shape = this._rootgroup.childNodes[dataIndex + pathCount];
					 if (mapObject._isSVG) {
                        shape.setAttribute("fill", shapelayer.shapeSettings.fill);
                    }
                    else {
                        shape.fillcolor = shapelayer.shapeSettings.fill;
                        shape.strokecolor = shapelayer.shapeSettings.stroke;
                    }
                    var obj = {};
                    var bounds = shapelayer._newBounds[dataIndex];

                    if (shapelayer.shapeSettings.autoFill) {
                        switch (shapelayer.shapeSettings.colorPalette) {
                            case ej.datavisualization.Map.ColorPalette.Palette1:
                                this._generatePaletteColorsForShape(shape, shapelayer, shapelayer.colorPalettes.Palette1, shapelayer._colorPaletteSettings.Palette1);
                                break;
                            case ej.datavisualization.Map.ColorPalette.Palette2:
                                this._generatePaletteColorsForShape(shape, shapelayer, shapelayer.colorPalettes.Palette2, shapelayer._colorPaletteSettings.Palette2);
                                break;
                            case ej.datavisualization.Map.ColorPalette.Palette3:
                                this._generatePaletteColorsForShape(shape, shapelayer, shapelayer.colorPalettes.Palette3, shapelayer._colorPaletteSettings.Palette3);
                                break;
                            case ej.datavisualization.Map.ColorPalette.CustomPalette:
                                this._generatePaletteColorsForShape(shape, shapelayer, shapelayer.shapeSettings.customPalette, null);
                                break;
                        }
                    }

                 if (shapesource.indexOf(dbfCondition) != -1) {
                        var item = shapelayer.dataSource[shapesource.indexOf(dbfCondition)];
                        var ItemValue = DBFValue,bubbleShapeColor;
                        if (item != null) {
                            if (shape != null) {                              
                               
                                var id = ItemValue;
                            }
                                layer._bounds.push(bounds);
                                if (shapelayer.showMapItems) {
                                    var itemTemplateDiv = $("<div class='e-mapItems' style='display:block;position:absolute;pointer-events: none;'></div>");
                                    itemTemplateDiv[0].className = ItemValue;
                                    proxyControl._templateDiv.append(itemTemplateDiv);
                                    $(itemTemplateDiv).css({ "left": bounds.x, "top": bounds.y });
                                    var htmlString;
									 var locale = this.model.locale;
									 var obj = $.extend({}, item);
									 if (locale && this.model.enableGroupSeparator){
										for (var key in obj)
											obj[key] = isNaN(parseFloat(obj[key])) ? obj[key] : parseFloat(obj[key]).toLocaleString(locale);
									 }
                                    if (shapelayer.mapItemsTemplate == null) {
                                        htmlString= $(' <div><label>{{:' + shapelayer.shapeSettings.valuePath + '}}</label></div>').render(obj);
                                    }
                                    else {
                                        htmlString = $("#" + shapelayer.mapItemsTemplate).render(obj);
                                    }
                                    $(itemTemplateDiv).html(htmlString);
                                    layer._mapItems.push(itemTemplateDiv);
                                }                                   
                                                             
                                if (shapelayer.shapeSettings.colorMappings != null || shapelayer.shapeSettings.colorPath) {
                                    if (shapelayer.shapeSettings.colorValuePath  == null) {
                                        shapelayer.shapeSettings.colorValuePath  = shapelayer.shapeSettings.valuePath;
                                    }
                                    var shapeValue = proxyControl._reflection(item, shapelayer.shapeSettings.colorValuePath );
                                    if (shapeValue != null && !shapelayer.shapeSettings.autoFill) {
                                        if (((shapelayer.legendSettings != null && shapelayer.legendSettings.mode == ej.datavisualization.Map.LegendMode.Interactive) || shapelayer.shapeSettings.enableGradient) && shapelayer.shapeSettings.colorMappings.rangeColorMapping != null) {
                                            obj["legendrect"] = shapelayer._updateLegendRange(shapeValue, shapelayer, shape);
                                            var shapeColor = shapelayer.shapeSettings.fill;
                                            if (obj["legendrect"] != undefined) {
                                                shapeColor = obj["legendrect"].color;
                                            }
                                            if (mapObject._isSVG) {
                                                shape.setAttribute("fill", shapeColor);
                                            }
                                            else {
                                                shape.fillcolor = shapeColor;
                                            }
                                        } else {
                                            shapelayer._fillColors(shapeValue, shapelayer.shapeSettings.colorMappings, shape, mapObject, item, ValueObject);
                                        }
                                    }
                                }
                                else if (!shapelayer.shapeSettings.autoFill) {
                                    if (mapObject._isSVG) {
                                        shape.setAttribute("fill", shapelayer.shapeSettings.fill);
                                    }
                                    else {
                                        shape.fillcolor = shapelayer.shapeSettings.fill;
                                        shape.strokecolor = shapelayer.shapeSettings.stroke;
                                    }
                                }
                                if (shapelayer.bubbleSettings.showBubble) {
                                    if (shapelayer.bubbleSettings != null && shapelayer.bubbleSettings.valuePath != null) {
                                        if (mapObject._isSVG) {
                                            var circle = document.createElementNS(proxyControl._svgns, "circle");
                                        }
                                        else {
                                            var bubbleID = "bubble_" + id;
                                            var bubbleHtmlString = '<v:oval class="e-mapBubble" id=' + bubbleID + ' display="block" style="position:absolute;top: ' + 0 + 'px;left:' + 0 + 'px;width:100px;height:100px;stroke-width:' + 0 + 'px;"><v:fill opacity="0.9"/></v:oval>';
                                            this._bubblegroup.innerHTML = this._bubblegroup.innerHTML + bubbleHtmlString;
                                            var circle = document.getElementById("bubble_" + id);
                                        }

                                        var bubbleValue = proxyControl._reflection(item, shapelayer.bubbleSettings.valuePath);
                                        var bubblecolorValue = proxyControl._reflection(item, shapelayer.bubbleSettings.colorValuePath);
										bubbleShapeColor = shapelayer.bubbleSettings.color;
                                        if (shapelayer.bubbleSettings.colorMappings != null && (shapelayer.bubbleSettings.colorMappings.rangeColorMapping || shapelayer.bubbleSettings.colorMappings.equalColorMapping)) {
                                            shapelayer._fillColors(bubblecolorValue, shapelayer.bubbleSettings.colorMappings, circle, mapObject, item, this, true);
											var shapefill = circle.getAttribute("fill");
											if (shapefill == null){
												shapefill = bubbleShapeColor;
												circle.setAttribute("fill", shapefill);
											}
                                        }
                                        else {
                                            var eventArgs = {
                                                fill: colorPath ? item[colorPath] : shapelayer.bubbleSettings.color,
                                                bubbleOpacity: shapelayer.bubbleSettings.bubbleOpacity,
                                                shapeData: item,
                                                shapePropertyData: ValueObject
                                            };
                                            this._trigger("bubbleRendering", { model: this.model, data: eventArgs });
                                            if (eventArgs.fill != item[colorPath]) {
                                                item._bubblecolor = eventArgs[colorPath];
                                            }
                                            if (mapObject._isSVG) {
                                                circle.setAttribute("fill", item._bubblecolor ? item._bubblecolor : colorPath ? item[colorPath] : shapelayer.bubbleSettings.color);
                                                circle.setAttribute("opacity", eventArgs.bubbleOpacity);
                                            }
                                            else {
                                                circle.strokecolor = item._color ? item._color : colorPath ? item[colorPath] : shapelayer.bubbleSettings.color;
                                                circle.fillcolor = item._color ? item._color : colorPath ? item[colorPath] : shapelayer.bubbleSettings.color;
                                            }
                                        }
                                        var radius = proxyControl._getRatioOfBubble(shapelayer.bubbleSettings.minValue, shapelayer.bubbleSettings.maxValue, bubbleValue, minValue, maxValue);
                                        if (mapObject._isSVG) {
                                            $(circle).attr({
                                                "cx": bounds.x, "cy": bounds.y,
                                                "fill-opacity": shapelayer.bubbleSettings.bubbleOpacity, "r": radius, "class": "e-mapBubble",
                                            });
                                            if (proxyControl.enableAnimation()&& !this._isTileMap) {
                                                $(circle).css("display", "none");
                                            }
                                        }
                                        else {
                                            $(circle).css({
                                                "height": +2 * radius + "px",
                                                "width": +2 * radius + "px"
                                            });
                                        }
                                        if (shapelayer.bubbleSettings.showTooltip == true) {
                                            var tooltipTemplateDiv = $("<div class='e-bubbleToolTip'  style='position:absolute;display:none;z-index:9999'/>");
                                            var template_ID = null;
                                            if (shapelayer.bubbleSettings.tooltipTemplate != null) {
                                                template_ID = shapelayer.bubbleSettings.tooltipTemplate;
                                            } else {
                                                $(tooltipTemplateDiv).append('<div class="e-bubbleToolTip"  style="margin-left:10px;margin-top:-25px;"><div class="e-defaultToolTip"><p style="margin-top:-4px"><label  style="color:rgb(27, 20, 20);font-size:14px;font-weight:normal;font-family:Segoe UI">' + bubbleValue + '</label></p></div></div>');
                                            }
                                            $(circle).mouseenter({ htmlobj: tooltipTemplateDiv, templateID: template_ID, itemsrc: item }, proxyControl._bubbleEnterFunction);
                                            $(circle).mousemove({ htmlobj: tooltipTemplateDiv }, proxyControl._bubbleOverFunction);
                                            $(circle).mouseleave({ htmlobj: tooltipTemplateDiv }, proxyControl._bubbleleaveFunction);
                                        } else {
                                            $(circle).css("pointer-events", "none");
                                        }
                                        if (mapObject._isSVG) {
                                            proxySVG.appendChild(circle);
                                            layer._bubbles.push(circle);
                                        }
                                        else {
                                            layer._bubbles.push(circle);
                                        }
                                    }
                                }
                                obj["data"] = item;
                        }
                    }
                   var labelElement;
                   if (layer.labelSettings != null && layer.labelSettings.showLabels && layer.labelSettings.labelPath != null && shapelayer.geometryType != ej.datavisualization.Map.GeometryType.Normal) {
                        var labelValue = proxyControl._reflection(ValueObject, layer.labelSettings.labelPath);
                        if (labelValue != null) {
                            if (bounds == null) {
                               //bounds = (shape);
                            }
                            labelElement = $("<div class='e-labelStyle'></div>");                            
                            $(labelElement).css({ "pointer-events": "none", "position": "absolute" });
                            labelElement[0].innerHTML = labelValue;
                            this._templateDiv.append(labelElement);
                            if (layer.legendSettings.showLegend && layer.legendSettings.dockOnMap && layer.legendSettings.dockPosition == "top") {
                                $(this._templateDiv).css({ "margin-top": layer.legendSettings.height });
                            }
                            else if (layer.legendSettings.showLegend && layer.legendSettings.dockOnMap && layer.legendSettings.dockPosition == "left")
                            {
                                $(this._templateDiv).css({ "margin-left": layer.legendSettings.width });
                            }
                            $(labelElement).css({ "left": bounds.x, "top": bounds.y});
                            proxyControl._off($(labelElement), ej.eventType.mouseUp, proxyControl._polyClickFunction);
                            proxyControl._on($(labelElement), ej.eventType.mouseUp, { Param1: null, Param2: layer, Param3: shape }, proxyControl._polyClickFunction);
							proxyControl._off($(labelElement), ej.eventType.mouseLeave, proxyControl._polyLeaveFunction);
                            proxyControl._on($(labelElement), ej.eventType.mouseLeave, { Param1: layer, Param2: obj,map:this }, proxyControl._polyLeaveFunction);
							labelElement[0].setAttribute("data-nodeValue", shape.getAttribute("fill"));
                            layer._labelCollection.push(labelElement);
                            layer._labelBounds.push(bounds);
                            layer._labelData.push(labelValue);

                        }
                    }
					obj["shapeIndex"]=dataIndex;
                    obj["shape"] = shape;
                    obj["shapeData"] = layer._polygonData[dataIndex];
                    proxyControl._off($(labelElement), ej.eventType.mouseMove, proxyControl._polyMoveFunction);
                    proxyControl._on($(labelElement), ej.eventType.mouseMove, { Param1: shapelayer, Param2: obj }, proxyControl._polyMoveFunction);
                    if (shape != null) {
                        var shapefill = null; 
                        if (mapObject._isSVG) {
                            shapefill = shape.getAttribute("fill");
                            if (shapefill == "undefined")
                                shapefill = layer.shapeSettings.fill;
                            shape.setAttribute("data-nodeValue", shapefill);
                        }
                        else {
                            shapefill = shape.fillcolor.value;
                            if (shapefill == "undefined")
                                shapefill = layer.shapeSettings.fill;
                            shape.style.behavior = shapefill;
                        }
                    }
                    if (proxyControl.model.zoomSettings.enableZoomOnSelection) {
                        $(shape).hover(function() {
                            $(this).css('cursor', 'pointer');
                        }, function() {
                            $(this).css('cursor', 'auto');
                        });
					}
                    // bindtouches
					layer._mapShapes.push(obj);
					this._off($(shape), "mouseenter touchmove", proxyControl._polyEnterFunction);
					this._on($(shape), "mouseenter touchmove", { Param1: shapelayer, Param2: obj, map: proxyControl }, proxyControl._polyEnterFunction);
					this._off($(shape), touchStartEvent, proxyControl._polyMouseDown);
					this._on($(shape), touchStartEvent, { Param1: obj, Param2: shapelayer }, proxyControl._polyMouseDown);
					this._off($(shape), touchEndEvent, proxyControl._polyClickFunction);
					this._on($(shape), touchEndEvent, { Param1: obj, Param2: shapelayer, Param3: shape }, proxyControl._polyClickFunction);
					this._off($(shape), touchMoveEvent, proxyControl._polyMoveFunction);
					this._on($(shape), touchMoveEvent, { Param1: shapelayer, Param2: obj, Param3: shape }, proxyControl._polyMoveFunction);
					this._off($(shape), touchCancelEvent, proxyControl._polyLeaveFunction);
					this._on($(shape), touchCancelEvent, { Param1: shapelayer, Param2: obj, map: this }, proxyControl._polyLeaveFunction);
					this._off($(shape), touchEndEvent, proxyControl._polyUpFunction);
					this._on($(shape), touchEndEvent, { Param1: obj, Param2: shapelayer, Param3: shape }, proxyControl._polyUpFunction);
					if (dataIndex == 0) {
					    if (this._legendDiv == null) {
					        this._legendDiv = $("<div class='e-LegendDiv'/>");
					    }
					    if (shapelayer.legendSettings != null && (shapelayer.shapeSettings.colorMappings != null || shapelayer.shapeSettings.colorPath != null) && (shapelayer.legendSettings.type == undefined || shapelayer.legendSettings.type.toLowerCase() == "layers"))
					        shapelayer._generateLegends(this);
						    if(this.model.enableRTL)
								shapelayer.shapeSettings.colorMappings.rangeColorMapping.reverse();
								
					    if (shapelayer.legendSettings != null && (shapelayer.bubbleSettings.colorMappings != null || shapelayer.bubbleSettings.colorPath != null) && (shapelayer.legendSettings.type.toLowerCase() == "bubbles"))
					        shapelayer._generateBubbleLegends(this);
					    if (shapelayer.shapeSettings.colorMappings != null && shapelayer.shapeSettings.colorMappings.rangeColorMapping != null) {
					        shapelayer.shapeSettings.colorMappings.rangeColorMapping.sort(this._orderByNameAscending);
					    }
					    if (shapelayer.bubbleSettings.colorMappings != null && shapelayer.bubbleSettings.colorMappings.rangeColorMapping != null) {
					        shapelayer.bubbleSettings.colorMappings.rangeColorMapping.sort(this._orderByNameAscending);
					    }
					}					
                }
            }

            if (shapelayer._isBaseLayer && shapelayer.geometryType == ej.datavisualization.Map.GeometryType.Normal && shapelayer.labelSettings.showLabels) {

                shapelayer._generateLabels(this);
                shapelayer._labelSizeCalculation(this);
                this._applyTransform(this._scale, this._translatePoint);
            }           

        },


        isTouch: function (evt) {
            var event = evt.originalEvent ? evt.originalEvent : evt;
            if ((event.pointerType == "touch") || (event.pointerType == 2) || (event.type.indexOf("touch") > -1))
                return true;
            return false;
        },

        validateBubblePosition: function (polygon, midpoint, bubblerad) {
            var leftPoints = [], rightPoints = [];
			 if (polygon == null)
            {
                polygon = [];
                polygon.push(midpoint);
            }
            if (!this.isPointInPolygon(polygon, midpoint, true)) {
                var previouspoint = 0;
                for (var j = 0; j < polygon.length; j++) {
                    var point = { x: (polygon[j].x + this._translatePoint.x) * this._scale, y: (polygon[j].y + this._translatePoint.y) * this._scale };
                    if ((point.y < midpoint.y && previouspoint.y >= midpoint.y) || (previouspoint.y < midpoint.y && point.y >= midpoint.y)) {
                        if (point.x < midpoint.x)
                            leftPoints.push(point.x);
                        else
                            rightPoints.push(point.x);
                    }
                    previouspoint = point;
                }

                if (!leftPoints.length > 0 || !rightPoints.length > 0) {
                    if (leftPoints.length > 0) {
                        var j = midpoint.x + bubblerad;
                        while (!this.isPointInPolygon(polygon, { x: j - 2, y: midpoint.y }, true)) {
                            j = j - 2;
                        }
                        midpoint.x = parseFloat(j - 2 - bubblerad);
                    }
                    if (rightPoints.length > 0) {
                        var j = midpoint.x - bubblerad;
                        while (!this.isPointInPolygon(polygon, { x: j + 2, y: midpoint.y }, true)) {
                            j = j + 2;
                        }
                        midpoint.x = parseFloat(j + 2 + bubblerad);
                    }
                }
            }
            return midpoint;
        },

        isPointInPolygon: function (polygon, point, needTranslate) {
            var insidePolygon = false;
            var j = 0;
            for (var i = 0; i < polygon.length; i++) {
                var currentPoint = { x: polygon[i].x, y: polygon[i].y };
                var previousPoint = { x: polygon[j].x, y: polygon[j].y };

                if (needTranslate) {
                    currentPoint = { x: (polygon[i].x + this._translatePoint.x) * this._scale, y: (polygon[i].y + this._translatePoint.y) * this._scale };
                    previousPoint = { x: (polygon[j].x + this._translatePoint.x) * this._scale, y: (polygon[j].y + this._translatePoint.y) * this._scale };
                }

                var pointYDiff = point.y - currentPoint.y;
                var previousPointYDiff = previousPoint.y - currentPoint.y;
                var previousPointXDiff = previousPoint.x - currentPoint.x;

                if ((currentPoint.y < point.y && previousPoint.y >= point.y) || (previousPoint.y < point.y && currentPoint.y >= point.y)) {
                    if ((currentPoint.x + (pointYDiff / previousPointYDiff) * previousPointXDiff) < point.x) {
                        insidePolygon = true;
                    }
                }
                j = i;
            }
            return insidePolygon;
        },

        dragDown: function (event) {
                                  
            var map = event.data.map;
            var layer = map.model.layers[0];

            var mapArea = this._mapContainer;

            if (event.type == "mousedown")
            {
                map._startPoint = { x: event.pageX - mapArea[0].offsetLeft, y: event.pageY - mapArea[0].offsetTop };
                map._stopPoint = { x: event.pageX - mapArea[0].offsetLeft, y: event.pageY - mapArea[0].offsetTop };
            }
            else if (event.type == "touchstart") {
                map._startPoint = { x: event.originalEvent.changedTouches[0].pageX - mapArea[0].offsetLeft, y: event.originalEvent.changedTouches[0].pageY - mapArea[0].offsetTop };
                map._stopPoint = { x: event.originalEvent.changedTouches[0].pageX - mapArea[0].offsetLeft, y: event.originalEvent.changedTouches[0].pageY - mapArea[0].offsetTop };
            }
            else if (event.type == "MSPointerDown") {
                map._startPoint = { x: event.originalEvent.pageX - mapArea[0].offsetLeft, y: event.originalEvent.pageY - mapArea[0].offsetTop };
                map._stopPoint = { x: event.originalEvent.pageX - mapArea[0].offsetLeft, y: event.originalEvent.pageY - mapArea[0].offsetTop };
            }
            map.mouseClickable = true;

            if (map.model.draggingOnSelection) {

                if (layer._prevSelectedShapes.length > 0) {

                    for (var i = 0; i < layer._prevSelectedShapes.length; i++) {                                               
                        layer._prevSelectedShapes[i].setAttribute("class", "e-mapShape");
                        if (this._isSVG) {                            
                            layer._prevSelectedShapes[i].setAttribute("fill", layer._prevSelectedShapes[i].getAttribute("data-nodeValue"));
                            layer._prevSelectedShapes[i].setAttribute("stroke", layer.shapeSettings.stroke);
                            layer._prevSelectedShapes[i].setAttribute("stroke-width", layer.shapeSettings.strokeThickness / this._scale);
                        }
                        else {
                            layer.fillcolor = layer._prevSelectedShapes[i].getAttribute("data-nodeValue");
                            layer.strokecolor = layer.shapeSettings.stroke
                            layer.strokeweight = layer.shapeSettings.strokeThickness / this._scale;
                        }
                    }
                    layer._prevSelectedShapes = [];
                }
            }
        },

        dragMove: function (event) {
            
            var map = event.data.map;
            var layer = map.model.layers[0];
            var width; var height;

            var mapArea = this._mapContainer;

            if (map.model.draggingOnSelection) {

                if (map.mouseClickable) {                    
                    map.ispanning = false;


                    if (event.type == "mousemove")
                        map._stopPoint = { x: event.pageX - mapArea[0].offsetLeft, y: event.pageY - mapArea[0].offsetTop };
                    else if (event.type == "touchmove")
                        map._stopPoint = { x: event.originalEvent.changedTouches[0].pageX - mapArea[0].offsetLeft, y: event.originalEvent.changedTouches[0].pageY - mapArea[0].offsetTop };
                    else if (event.type == "MSPointerMove")
                        map._stopPoint = { x: event.originalEvent.pageX - mapArea[0].offsetLeft, y: event.originalEvent.pageY - mapArea[0].offsetTop };
                    
                    $('.e-mapDragSelection').remove();
                    var div = $('<div class = "e-mapDragSelection"></div>');
                    
                    width = Math.abs(map._stopPoint.x - map._startPoint.x),
                    height = Math.abs(map._stopPoint.y - map._startPoint.y);

                    $(div).css({ "top": Math.min(map._startPoint.y, map._stopPoint.y), "left": Math.min(map._startPoint.x, map._stopPoint.x), width: width, height: height,  position: "absolute", "z-index": 100 });
                    $(div).appendTo("#maps");
                }
            }
        },

        dragUp: function (event) {        
            var map = event.data.map;
            var width = Math.abs(map._stopPoint.x - map._startPoint.x);
            var height = Math.abs(map._stopPoint.y - map._startPoint.y);
            var layer = map.model.layers[0];
            var mapArea = this._mapContainer;
        
            if (map.model.draggingOnSelection) {
        
                $('.e-mapDragSelection').remove();
                $(".e-mapDragSelection").css({
                    "display": "none"
                });
                map.mouseClickable = false;

                for (var i = 0; i < map.model.layers[0]._mapShapes.length; i++) {
                    var shape = map.model.layers[0]._mapShapes[i].shape;
                    var rect = shape.getBoundingClientRect();
                    if (!(rect.left - mapArea[0].offsetLeft + rect.width < Math.min(map._startPoint.x, map._stopPoint.x) || Math.min(map._startPoint.x, map._stopPoint.x) + width < rect.left - mapArea[0].offsetLeft ||
                           rect.top - mapArea[0].offsetTop + rect.height < Math.min(map._startPoint.y, map._stopPoint.y) || Math.min(map._startPoint.y, map._stopPoint.y) + height < rect.top - mapArea[0].offsetTop)) {

                        if (!map.model.layers[0]._contains(layer._prevSelectedShapes, shape))

                            layer._prevSelectedShapes.push(shape);
                    }
                }


                for (var i = 0; i < layer._prevSelectedShapes.length; i++) {
                    var shape = layer._prevSelectedShapes[i];
                    var rect = shape.getBoundingClientRect();
                    shape.setAttribute("class", "e-mapSelectedShape mapShape");
                    if (this._isSVG) {
                        shape.setAttribute("fill", layer.shapeSettings.selectionColor);
                        shape.setAttribute("stroke", layer.shapeSettings.selectionStroke);
                        shape.setAttribute("stroke-width", (layer.shapeSettings.selectionStrokeWidth / map._scale));
                    }
                }                
            }           
        },

        isIntersectBubbles: function () {
            var listofBounds = [];
            for (var k = 0; k < this.model.layers.length; k++) {
                var layer = this.model.layers[k];
                Array.prototype.push.apply(listofBounds, layer._bubbleCollection);
                for (var i = 0; i < layer.subLayers.length; i++) {
                    Array.prototype.push.apply(listofBounds, layer.subLayers[i]._bubbleCollection);
                }
            }

            for (var i = 0; i < listofBounds.length; i++) {
                var x = listofBounds[i].getAttribute('cx');
                var y = listofBounds[i].getAttribute('cy');
                var r = listofBounds[i].getAttribute('r');
                for (var j = i + 1; j < listofBounds.length; j++) {

                    var x1 = listofBounds[j].getAttribute('cx');
                    var y1 = listofBounds[j].getAttribute('cy');
                    var r1 = listofBounds[j].getAttribute('r');
                    var distBubble = Math.sqrt(((x - x1) * (x - x1)) + ((y - y1) * (y - y1)));
                    var rad = parseFloat(r) + parseFloat(r1);
                   
                    if (distBubble <= rad) {
                        return true;
                    }
                }
            }
            return false;
        },
       
        _zooming: function (delta, e) {
            var position = this._getCurrentPoint(e);
            if (delta >= 120) {
                this._zoomingIn(position.x, position.y, e);
            }
            else {
                this._zoomingOut(position.x, position.y, e);
            }
        },

        _zoomingIn: function (x, y, event, isAnimate) {
            var map = this;
            if ((map.model.zoomSettings.enableZoom || map.model.zoomSettings.enableMouseWheelZoom) && map._zoomLevel() >= map._minZoom() && map._zoomLevel() <= map._maxZoom()) {
                var scal = map._scale;
                var position = { x: x, y: y };
                map._prevScale = scal;
                if (!this._isTileMap) {
                    map._prevPoint = { x: map._translatePoint.x, y: map._translatePoint.y };
                    map._translatePoint.x -= (map._width / map._scale - map._width / (map._scale + map._zoomFactor())) / (map._width / x);
                    map._translatePoint.y -= (map._height / map._scale - map._height / (map._scale + map._zoomFactor())) / (map._height / y);
                    map._scale = scal + map._zoomFactor();
                    map.model.zoomSettings.level = map._zoomLevel() + map._zoomFactor();
                    map._zoomLevel(map._zoomLevel() + map._zoomFactor());
                }
                else {
                    this._tileZoom(map._zoomLevel() - map._zoomFactor(), map._zoomLevel(), position);
                    var prevLevel = map._zoomLevel();
                    map.model.zoomSettings.level = map._zoomLevel() + map._zoomFactor();
                    map._zoomLevel(map._zoomLevel() + map._zoomFactor());
                    this._generateTiles(this._zoomLevel());
                    map._translatePoint.x = (map._tileTranslatePoint.x - (0.5 * Math.pow(2, prevLevel))) / (Math.pow(2, prevLevel));
                    map._translatePoint.y = (map._tileTranslatePoint.y - (0.5 * Math.pow(2, prevLevel))) / (Math.pow(2, prevLevel));
                    map._scale = (Math.pow(2, prevLevel));
                }
                
                map._trigger("zoomedIn", { originalEvent: event, zoomLevel: map._zoomLevel() });
                map._applyTransform(map._scale, map._translatePoint);
                map._refrshLayers();
                map._resizeShape();               
            
                map._updateSliderValue();
            }
        },

        _zoomingOut: function (x, y, event, isAnimate) {
            var map = this;
            if (map.model.zoomSettings.enableZoom || map.model.zoomSettings.enableMouseWheelZoom) {
                if (map._zoomLevel() > this._minZoom()) {

                    var scal = map._scale;
                    var position = { x: x, y: y };
                    map._prevScale = scal;
                    if (!map._isTileMap) {                       
                       if (map._scale > 1) {		
                        map._prevPoint = { x: map._translatePoint.x, y: map._translatePoint.y };
                        map._translatePoint.x -= (map._width / map._scale - map._width / (map._scale - map._zoomFactor())) / (map._width / x);
                        map._translatePoint.y -= (map._height / map._scale - map._height / (map._scale - map._zoomFactor())) / (map._height / y);
                        map._scale = map._scale - map._zoomFactor();
                        map.model.zoomSettings.level = map._zoomLevel() - map._zoomFactor();
                        map._zoomLevel(map._zoomLevel() - map._zoomFactor());
                        map._scale = map._zoomLevel();
                        }
				    }
                    else {
                        map._tileZoom(map._zoomLevel() + map._zoomFactor(), map._zoomLevel(), position);
                        var prevLevel = map._zoomLevel();
                        map.model.zoomSettings.level = map._zoomLevel() - map._zoomFactor();
                        map._zoomLevel(map._zoomLevel() - map._zoomFactor());
                       
                        map._generateTiles(map._zoomLevel());
                        map._translatePoint.x = (map._tileTranslatePoint.x - (0.5 * Math.pow(2, map._zoomLevel() - map._zoomFactor()))) / (Math.pow(2, map._zoomLevel() - map._zoomFactor()));
                        map._translatePoint.y = (map._tileTranslatePoint.y - (0.5 * Math.pow(2, map._zoomLevel() - map._zoomFactor()))) / (Math.pow(2, map._zoomLevel() - map._zoomFactor()));
                        map._scale = (Math.pow(2, map._zoomLevel() - map._zoomFactor()));
                    }                    
                    if (map._zoomLevel() < map._minZoom()) {
                        map.model.zoomSettings.level = map._minZoom();
                        map._zoomLevel(map._minZoom());
                        map.zoom(map._zoomLevel());
                    }
                   
                    map._applyTransform(map._scale, map._translatePoint);
                    map._refrshLayers();
                    map._resizeShape();                                  

                    map._updateSliderValue();
                }
                else {                   
                    map.zoom(map._minZoom(), false);
                }
                map._trigger("zoomedOut", { originalEvent: event, zoomLevel: map._zoomLevel() });
            }
        },

        _getRatioOfBubble: function (min, max, value, minValue, maxValue) {
            var percent = (100 / (maxValue - minValue)) * (value - minValue);
            var bubbleRadius = (((parseFloat(max) - parseFloat(min)) / 100) * percent) + parseFloat(min);
			if(maxValue == minValue)
				bubbleRadius = (((parseFloat(max) - parseFloat(min)) / 100)) + parseFloat(min);
			
            return bubbleRadius;
        },

        _reflection: function (Source, path) {
            var ShapeValues = Source;
            if (path != null && Source != null) {
                var parts = path.split(".");
                var i = 0;
                parts.push(path);
                for (; i < parts.length; i++) {                    
                    if (Source != undefined && ShapeValues != null) {
                        var hasProperty = ShapeValues.hasOwnProperty(parts[i]);
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

        },
		
		clearShapeSelection:function(){		
		 var index = this.baseMapIndex();
            this.model.layers[index]._clearShapeWidth(this._scale, this);
            for (var key = 0; key < this.model.layers[index].subLayers.length; key++) {
                (this.model.layers[index].subLayers[key])._clearShapeWidth(this._scale, this);
            }
		},
        shapeSelectionOnResize: function () {
        var index = this.baseMapIndex();
          this.model.layers[index]._shapeSelection();
            for (var key = 0; key < this.model.layers[index].subLayers.length; key++) {
                (this.model.layers[index].subLayers[key])._shapeSelection();
            }
        },

       refreshMarkers: function () {
          var markerElements = document.getElementsByClassName("e-mapMarker");
        
         for(var index = markerElements.length-1; index >= 0; index--)
         {
          markerElements[index].parentNode.removeChild(markerElements[index]);
         }
         
            var index = this.baseMapIndex();
            this.model.layers[index]._generateMarkerForLayers(this);
            for (var key = 0; key < this.model.layers[index].subLayers.length; key++) {
                (this.model.layers[index].subLayers[key])._generateMarkerForLayers(this);
            }
            this._refrshLayers();
        },

        _generateTooltipForLayers: function (layer) {
             if (layer.showTooltip) {
			   if (document.documentMode == 8){
					var tooltip = document.querySelectorAll("e-shapeToolTip");
				}
				else{
					var tooltip = document.getElementsByClassName("e-shapeToolTip");
				}
                if (tooltip != null && tooltip.length == 0) {
                    var tooltip_templateDiv = $("<div class='e-shapeToolTip' style='display:none;position:absolute;z-index:1000;pointer-events:none;'></div>");
                    $(document.body).append(tooltip_templateDiv);
                    layer._tooltipElement = tooltip_templateDiv;
                }
                else
                {
                    layer._tooltipElement = tooltip[0];
                }
                if (layer.tooltipTemplate == null) {
                    var path = layer.shapeSettings.valuePath;
                    if (path != null) {
                        layer.tooltipTemplate = 'defaultTooltip';                      
                        this._mapContainer.append($('<div  id="defaultTooltip" style="display:none;"><div style="margin-left:10px;margin-top:-25px;"><div class="e-defaultToolTip" style="display:table"><p style="margin-top:-4px"><label  style="color:rgb(27, 20, 20);font-size:14px;font-weight:normal;font-family:Segoe UI">{{:#data["' + path + '"]}}</label></p></div></div></div>'));
                    }
                }
            }                
        },
       
        _orderByNameAscending: function (a, b) {
            if (a.Range == b.Range) {
                return 0;
            } else if (a.Range > b.Range) {
                return 1;
            }
            return -1;
        },

        _resizingContainer: function () {            
            if(!this._scale)
                this._scale = this._isTileMap ? Math.pow(2, this._zoomLevel() - 1) : 1;
            if (this._isTileMap) {
                this._translatePoint.x = (this._tileTranslatePoint.x - (0.5 * Math.pow(2, this._zoomLevel() - this._zoomFactor()))) / (Math.pow(2, this._zoomLevel() - this._zoomFactor()));
                this._translatePoint.y = (this._tileTranslatePoint.y - (0.5 * Math.pow(2, this._zoomLevel() - this._zoomFactor()))) / (Math.pow(2, this._zoomLevel() - this._zoomFactor()));
            }
            else if(!this._translatePoint || (this._scale && this._scale <= 1)) {
                this._translatePoint.x = this._tileTranslatePoint.x / this._scale;
                this._translatePoint.y = this._tileTranslatePoint.y / this._scale;
            }           
            this._applyTransform(this._scale, this._translatePoint);
            if (this._zoomLevel() > 1) {
                this._scale = this._isTileMap ? Math.pow(2, this._zoomLevel() - this._zoomFactor()) : this._zoomLevel();
                this._applyTransform(this._scale, this._translatePoint);
            }
            this._baseScale = 1;
            this._baseTranslatePoint = { x: (this._translatePoint.x * 2), y: (this._translatePoint.y * 2) };
           
        },

        _calculateMarginConditions: function () {
            var trans = this._calculateMinMax();
            if (this._translatePoint.y> trans.maxY) {
                this._translatePoint.y = trans.maxY;
            }
            else if (this._translatePoint.y < trans.minY) {
                this._translatePoint.y = trans.minY;
            }
            if (this._translatePoint.x > trans.maxX) {
                this._translatePoint.x = trans.maxX;
            }
            else if (this._translatePoint.x < trans.minX) {
                this._translatePoint.x = trans.minX;
            }
        },

        _calculateMinMax: function () {           
            var bounds= this._groupBorder;            
            var maximumTransX, maximumTransY, minimumTransX, minimumTransY;
            if (this._containerHeight * this._scale <= this._height) {
                maximumTransY = (this._height - this._containerHeight * this._scale) / (2 * this._scale) - bounds.y;
                minimumTransY = (this._height - this._containerHeight * this._scale) / (2 * this._scale) - bounds.y;
            } else {
                maximumTransY = -bounds.y + 1;
                minimumTransY = (this._height - this._containerHeight * this._scale) / (this._scale) - bounds.y - 1;
            }
            if (this._containerWidth * this._scale <= this._width) {
                maximumTransX = (this._width - this._containerWidth * this._scale) / (2 * this._scale)- bounds.x;
                minimumTransX = (this._width - this._containerWidth * this._scale) / (2 * this._scale) - bounds.x;
            } else {
                maximumTransX = -bounds.x + 1;
                minimumTransX = (this._width - this._containerWidth * this._scale) / (this._scale) - bounds.x - 1;
            }
            return { minX: minimumTransX, maxX: maximumTransX, minY: minimumTransY, maxY: maximumTransY };
        },
      
        _findMidPointofPoylgon: function (points) {
          if(points.length>0){
            var min = 0;           
            var max = points.length;
            var initialPoint = points[0];
            var minX=initialPoint.x,maxX = initialPoint.x;
            var minY = initialPoint.y, maxY = initialPoint.y;
            var startX,startY,startX1,startY1,sum=0,xSum=0,ySum=0;
           
            for (var i = min; i <= max - 1; i++) {
                var prevPoint = points[i];
                startX = prevPoint.x;
                startY = prevPoint.y;
                if (i == max - 1) {
                    startX1 = initialPoint.x;
                    startY1 = initialPoint.y;
                }
                else {
                    var nextPoint = points[i + 1];
                    startX1 = nextPoint.x;
                    startY1 = nextPoint.y;
                }
                sum = sum + Math.abs(((startX * startY1)) - (startX1 * startY));
                xSum = xSum + Math.abs(((startX + startX1) * (((startX * startY1) - (startX1 * startY)))));
                ySum = ySum + Math.abs(((startY + startY1) * (((startX * startY1) - (startX1 * startY)))));

            }
            sum = 0.5 * sum;
            xSum = (1 / (4 * sum)) * xSum;
            ySum = (1 / (4 * sum)) * ySum;

            /* Code for finding nearest points in polygon related to midPoint*/
            var _rightMinPoint = { x: 0, y: 0 };
            var _rightMaxPoint = { x: 0, y: 0 };
            var _leftMinPoint = { x: 0, y: 0 };
            var _leftMaxPoint = { x: 0, y: 0 };

            for (var i = min; i <= max - 1; i++) {
                var point = points[i];
                if (point.x > xSum) {
                    if (point.y < ySum && ySum - point.y < ySum - _rightMinPoint.y)
                        _rightMinPoint = { x: point.x, y: point.y };
                    else if (point.y > ySum && (_rightMaxPoint.y == 0 || point.y - ySum < _rightMaxPoint.y - ySum))
                        _rightMaxPoint = { x: point.x, y: point.y };
                }
                else {
                    if (point.y < ySum && ySum - point.y < ySum - _leftMinPoint.y)
                        _leftMinPoint = { x: point.x, y: point.y };
                    else if (point.y > ySum && (_leftMaxPoint.y == 0 || point.y - ySum < _leftMaxPoint.y - ySum))
                        _leftMaxPoint = { x: point.x, y: point.y };
                }
            }

            return { x: xSum, y: ySum, rightMin: _rightMinPoint, rightMax: _rightMaxPoint, leftMin: _leftMinPoint, leftMax: _leftMaxPoint, points:points };             
}        
        },
        _convertPointToLatLong: function (pixelX, pixelY, bounds, factor){
        
            var Size, latitude, longitude;
            if (bounds == null) { bounds=[[-180,-85],[180,85]] }
            if (this._isTileMap) {
                Size = Math.pow(2, 1) * 256;
            }
            else {
                if(factor == null)
                    Size = Math.min(this._height, this._width);
                else
                    Size = Math.min(this._height, this._width)*factor;
            }

            var x=(Math.min(pixelX,0,Size-1)/Size)-0.5;
            var y=0.5-(Math.min(pixelY,0,Size-1)/Size);
            latitude = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
            longitude = 360 * x;
            return {x:latitude,y:longitude};
                        

        },
        _convertTileLatLongtoPointForShapes: function (lat, lng, bounds,factor) {
            var Size;
            if (bounds == null) { bounds=[[-180,-85],[180,85]] }
            if (this._isTileMap) {
                Size = Math.pow(2, 1) * 256;
            }
            else {
                if(factor == null)
                    Size = Math.min(this._height, this._width);
                else
                    Size = Math.min(this._height, this._width)*factor;
            }
           
            var x = (lng + 180) / 360;
            var sinLatitude = Math.sin(lat * Math.PI / 180);
            if (sinLatitude == -1)
                sinLatitude = -0.5;
            var y = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);
            if (this._isMapCoordinates) {
                var pixelX = (Math.min(Math.max(x * Size + 0.5, 0), Size - 1));
                var pixelY = (Math.min(Math.max(y * Size + 0.5, 0), Size - 1));
            }
            else if (factor != null) {

                var pixelX = Math.abs((lng - this._mapBounds[0][0]) * factor);
                var pixelY = Math.abs((this._mapBounds[1][1] - lat ) * factor);
            }
            else {

                var pixelX = lng;
                var pixelY = lat;
            }

            
           
            return { x: pixelX, y: pixelY };
           
            
        },
     
        _convertTileLatLongtoPoint: function (lat, lng) {
            var Size = Math.pow(2, this._zoomLevel()) * 256;
            var x = (lng + 180) / 360; 
            var sinLatitude = Math.sin(lat * Math.PI / 180);
            var y = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);
			if (this._isMapCoordinates) {
            var pixelX = (x * Size + 0.5) + this._tileTranslatePoint.x;
            var pixelY = (y * Size + 0.5) + this._tileTranslatePoint.y; 
              }
            else if (factor != null){

                var pixelX = Math.abs((lng - this._mapBounds[0][0])*factor);
                var pixelY = Math.abs((this._mapBounds[1][1] - lat)*factor);
            }
            else {

                var pixelX = lng;
                var pixelY = lat;
            }			
            return { x: pixelX, y: pixelY };
        },
      
        _convertLatLongtoPointforMarker: function (lat, lng) {
            var factor = this._getFactor();
            var point = this._convertTileLatLongtoPointForShapes(lat, lng, this._mapBounds,factor);
            return { x: (point.x + this._translatePoint.x) * this._scale, y: (point.y + this._translatePoint.y) * this._scale };

        },
     
        _animate: function (animateduration) {
            this._calculateMarginConditions();
            $(this._rootgroup).stop(true, false);
            if (this._sliderControl != null) {
                $(this._sliderControl).stop(true, false);
            }
            var map = this;
            var currentTranformation = { x: this._translatePoint.x, y: this._translatePoint .y};
            var startPoint = [this._prevPoint.x, this._prevPoint.y];
            var endPoint = [this._translatePoint.x, this._translatePoint.y];

            function slope(horizontal, vertical) {
                
                if (horizontal[0] == vertical[0]) {
                    return null;
                }
                return (vertical[1] - horizontal[1]) / (vertical[0] - horizontal[0]);
            }

            function intercept(point, slopeValue) {
                if (slopeValue === null) {
                    return point[0];
                }
                return point[1] - slopeValue * point[0];
            }

            var slopeFactor = slope(startPoint, endPoint);
            var slopeIntersection = intercept(startPoint, slopeFactor);
            var horizontalDifference= endPoint[0] - startPoint[0];
            var verticalDifference=endPoint[1] - startPoint[1];
            var scaleDifference= this._scale-this._prevScale;
            var currentScale = this._scale;
            this._updateSliderValue();
            $(this._rootgroup).animate(
                {
                    count: 10
                },
                {
                    duration: animateduration,
                    step: function(now, fx) {
                        var scaleX = map._prevScale + ((now * (scaleDifference / fx.end)));
                        var transX = startPoint[0] + (now * (horizontalDifference / fx.end)) / (scaleX / currentScale);
                        var transY;
                        if (slopeFactor == null) {
                            transY = startPoint[1] + (now * (verticalDifference / fx.end));
                        } else {
                            transY = ((slopeFactor * transX) + slopeIntersection);
                        }
                        if (map._isSVG) {
                            map._rootgroup.setAttribute('transform', 'scale(' + scaleX + ') translate(' + transX + ', ' + transY + ')');
                        }
                        else {
                            map._rootgroup.coordorigin = -transX + ',' + -transY;
                            map._rootgroup.coordsize = (map._width / scaleX) + ',' + (map._height / scaleX);
                        }
                        map._translatePoint.x = transX;
                        map._translatePoint.y = transY;
                        map._scale = scaleX;
                        map._refrshLayers();
                        map._resizeShape();
                    },
                    complete: function() {
                        map._translatePoint.x = currentTranformation.x;
                        map._translatePoint.y = currentTranformation.y;
                        map._scale = currentScale;
                        this.count = 0;
                    }
                }
            );

        },

        _applyTransform: function (scale, translatePoint) {
            this._scale = scale;
            this._translatePoint = translatePoint;
           if(!this._isTileMap)
            this._calculateMarginConditions();  
             if((this._translatePoint.x !=Number.POSITIVE_INFINITY) &&(this._translatePoint.y !=Number.POSITIVE_INFINITY))
            {
            if (this._isSVG) {
                this._rootgroup.setAttribute('transform', 'scale(' + this._scale + ') translate(' + this._translatePoint.x + ', ' + this._translatePoint.y + ')');
            }
            else {
                this._rootgroup.coordorigin = (-this._translatePoint.x) + ','  + (-this._translatePoint.y);
                this._rootgroup.coordsize = (this._width / scale)  + ',' + (this._height / scale);
            }
            }
        },
       
        _mouseMove: function (event) {
            if (event.type == "touchmove" && event.originalEvent.touches.length > 1) {
                this._isPinching = true;
            }
            else {
                var map = this;
                if (map.ispanning && map.enablePan()) {
                    event.preventDefault();
                    var position;
                    if (event.type == "mousemove" || event.type == "pointermove")
                        position = { x: event.pageX, y: event.pageY };
                    else if (event.type == "touchmove")
                        position = { x: event.originalEvent.changedTouches[0].pageX, y: event.originalEvent.changedTouches[0].pageY };
                    else if (event.type == "MSPointerMove")
                        position = { x: event.originalEvent.pageX, y: event.originalEvent.pageY };
                    if (this._isTileMap) {
                        var curtileX = this._tileTranslatePoint.x - (this._dragStartX - position.x);
                        var curtileY = this._tileTranslatePoint.y - (this._dragStartY - position.y);
                        this._tileTranslatePoint.x = curtileX;
                        this._tileTranslatePoint.y = curtileY;                        
                        this._generateTiles(this._zoomLevel());
                    }                    
                    var curX = map._translatePoint.x - (map._dragStartX - position.x) / map._scale;
                    var curY = map._translatePoint.y - (map._dragStartY - position.y) / map._scale;
                    if (curX != map._translatePoint.x || curY != map._translatePoint.y) {
                        map._isDragging = true;
                    }
                    this._translatePoint.x = curX;
                    this._translatePoint.y = curY;
                    map._applyTransform(map._scale, map._translatePoint);
                    map._dragStartX = position.x;
                    map._dragStartY = position.y;
                    map._refrshLayers();
                }
            }
        },
       
        _svgMouseLeave: function (event) {
            var map = this;
            map.ispanning = false;
        },
        
        _mouseWheel: function (event) {
            if (this.model.zoomSettings.enableMouseWheelZoom) {
                if (this.enableAnimation()) {
                    $(this._rootgroup).stop(true, false);
                }
                var e = event.originalEvent;
                var original = event;
                if (!this._isSVG) {
                    e = event;
                }
                if (event.target.className != "e-LegendDiv" && event.target.className != "e-defaultLegendLabel") {
                    e.preventDefault ? e.preventDefault() : original.preventDefault();
                    if (this._isSVG) {
                        this._zooming(event.originalEvent.wheelDelta, event.originalEvent);
                    }
                    else {
                        this._zooming(event.originalEvent.wheelDelta, e);
                    }
                }
            }
        },

        _mouseButtonUp: function (event) {

            var map = this;
            if (map.ispanning) {
                map._trigger("panned", { originalEvent: event });
            }
            map.ispanning = false;
        },
        
        _mouseUp: function (event) {
            this.ispanning = false;
            this._isDragging = false;
        },

        _mouseButtonDown: function (event) {
            this._isPinching = false;
           if (event.target.className != "e-vhandle") {         
            this._isNavigationPressed = false;
            if(this.enableAnimation()){
                $(this._rootgroup).stop(true, false);
                if (this._sliderControl != null) {
                    $(this._sliderControl).stop(true, false);
                }
			}
            if (event.type == "touchstart" && event.originalEvent.touches.length > 1)
            { }
            else {
                var position;
                if (event.type == "mousedown" || event.type == "pointerdown")
                    position = { x: event.pageX, y: event.pageY };
                else if (event.type == "touchstart")
                    position = { x: event.originalEvent.changedTouches[0].pageX, y: event.originalEvent.changedTouches[0].pageY };
                else if (event.type == "MSPointerDown")
                    position = { x: event.originalEvent.pageX, y: event.originalEvent.pageY };
                var map = this;
                if (map._scale > 1 && map.model.enablePan) {
                    event.preventDefault();
                    map.ispanning = true;
                }
                map._dragStartX = position.x;
                map._dragStartY = position.y;
            }
		}
        },

        _getCurrentPoint: function (event) {
            var map = this._mapContainer;
             var xPos = event.pageX - map.offset().left;
            var yPos = event.pageY - map.offset().top; 
            return { x: xPos, y: yPos };
        },

        _legendDoubleClick: function (event) {
           
            var node= event.target;
            while (node.parentNode != null && node.parentNode.className != "ScrollLegendDiv e-scroller e-js e-widget") {
                node = node.parentNode;
            }
            if (node.parentNode != null && node.parentNode.className == "ScrollLegendDiv e-scroller e-js e-widget") {               
                this._isNavigationPressed = true;               
            }           
        },

        _mapRightClick: function(e) {
            if(this.model.rightClick != '')
                this._trigger("rightClick", {data:{event: e}});
        },

        _mapDown: function(e){
            if(this.model.rightClick != '')
                this._longPressTimer = new Date();
        },

        _mapClick: function(e){
            var end = new Date();
            if(this.model.click != '')
                this._trigger("click", {data:{event: e}});
            
            if(this._doubleTapTimer != null && end - this._doubleTapTimer < 500)
                this._mapDoubleClick(e);
            this._doubleTapTimer = end;
            if(end - this._longPressTimer > 1500)
                this._mapRightClick(e);
        },
        
        _doubleClick: function (event) {            
            var map = this;
            var prevLevel1 = map._zoomLevel();
             map._legendDoubleClick(event);
			if (!this._isNavigationPressed && event.target.className.toString().indexOf("e-icon1") == -1) {
                var position = this._getCurrentPoint(event);               
                if (map.model.zoomSettings.enableZoom && map._zoomLevel() + map._zoomFactor() >= map._minZoom() && map._zoomLevel() + map._zoomFactor() <= map._maxZoom()) {
                    var scal = map._scale;
                    map._prevScale = scal;
                    if (!this._isTileMap) {
                        map._prevPoint = { x: map._translatePoint.x, y: map._translatePoint.y };
                        map._translatePoint.x -= (map._width / map._scale - map._width / (map._scale + map._zoomFactor())) / (map._width / position.x);
                        map._translatePoint.y -= (map._height / map._scale - map._height / (map._scale + map._zoomFactor())) / (map._height / position.y);
                        map._scale = scal + map._zoomFactor();
                        map.model.zoomSettings.level = map._zoomLevel() + map._zoomFactor();
                        map._zoomLevel(map._zoomLevel() + map._zoomFactor());
                    }
                    else {
                        this._tileZoom(map._zoomLevel() - map._zoomFactor(), map._zoomLevel(), position);
                        var prevLevel = map._zoomLevel();
                        map.model.zoomSettings.level = map._zoomLevel() + map._zoomFactor();
                        map._zoomLevel(map._zoomLevel() + map._zoomFactor());
                        this._generateTiles(this._zoomLevel());
                        map._translatePoint.x = (map._tileTranslatePoint.x - (0.5 * Math.pow(2, prevLevel))) / (Math.pow(2, prevLevel));
                        map._translatePoint.y = (map._tileTranslatePoint.y - (0.5 * Math.pow(2, prevLevel))) / (Math.pow(2, prevLevel));
                        map._scale = (Math.pow(2, prevLevel));                        
                    }
                    if (prevLevel1 < map._zoomLevel())
                    {
					     map._trigger("zoomedIn", { originalEvent: null, zoomLevel: map._zoomLevel() });
                    }
                    if (map.enableAnimation() && !this._isTileMap) {
                        map._animate(600);
                    }
                    else {
                        map._applyTransform(map._scale, map._translatePoint);
                        map._refrshLayers();
                        map._resizeShape();
                    }                 
                    map._updateSliderValue();
                }
            }
        },

        _mapDoubleClick: function(e){
            if(this.model.doubleClick != '')
                this._trigger("doubleClick", {data:{ event: e }});
        },
       
        _tileZoom: function (prevlevel,level, position) {
            
            var map = this;
            if (level > 0 && level < 20) {
                this._tileDiv.html("");
                var prevSize = Math.pow(2, prevlevel) * 256;
                if (position == undefined) {
                    position = { x: this._width / 2, y: this._height / 2 };
                }
                var totalSize = Math.pow(2, level) * 256;
                var percentX = ((position.x - this._tileTranslatePoint.x) / prevSize) * 100;
                var percentY = ((position.y - this._tileTranslatePoint.y) / prevSize) * 100;
                var pointX = (percentX * totalSize) / 100;
                var pointY = (percentY * totalSize) / 100;
                this._tileTranslatePoint.x = position.x - pointX;
                this._tileTranslatePoint.y = position.y - pointY;
                
            }
        },          
        
        _bubbleEnterFunction: function (event) {
            if (event.data.templateID != null) {
                var tooltiphtmlString = $("#" + event.data.templateID).render(event.data.itemsrc);
                $(event.data.htmlobj).html(tooltiphtmlString);
            }
            $(document.body).append(event.data.htmlobj);
            return $(event.data.htmlobj).css("display", "block").css({ "left": (event.pageX + 8) + "px", "top": (event.pageY + 6) + "px" });
        },
        
        _bubbleleaveFunction: function (event) {
            $(event.data.htmlobj).remove();
            return $(event.data.htmlobj).css("display", "none");
        },
        
        _bubbleOverFunction: function (event) {
            return $(event.data.htmlobj).css("display", "block").css({ "left": (event.pageX + 8) + "px", "top": (event.pageY + 6) + "px" });
        },
       
        _polyEnterFunction: function (event) {
            var matched = jQuery.uaMatch(navigator.userAgent),
                layer = event.data.Param1, shape,
                isTouch = this.isTouch ? this.isTouch(event) : false;
            if (isTouch && matched.browser == 'chrome') {
                var myLocation = event.originalEvent.changedTouches[0];
                shape = document.elementFromPoint(myLocation.clientX, myLocation.clientY);
            }
            else
                shape = event.data.Param2["shape"];
            var map = event.data.map;
            var legend = jQuery.grep(layer._smartLabels, function (obj) { return obj.shape == shape });
            if (layer.enableMouseHover) {
                layer._clearShapeWidth(map._scale, this);
                if (layer._prevHoverdLegend != null && !layer._contains(layer._prevSelectedLegends, layer._prevHoverdLegend)) {
                    layer._prevHoverdLegend.css("background-color", map._isSVG ? layer._prevHoveredShape.getAttribute("fill") : layer._prevHoveredShape.fillcolor.value);
                }
                if (map._isSVG) {
                    shape.setAttribute("stroke-width", (layer.shapeSettings.highlightBorderWidth/map._scale));
                    shape.setAttribute('stroke', layer.shapeSettings.highlightStroke);
                } else {
                    shape.strokeweight = layer.shapeSettings.highlightBorderWidth;
                    shape.strokecolor = layer.shapeSettings.highlightStroke/map._scale;
                }

                 if (layer.shapeSettings.highlightColor != null) {
                    if (layer.shapeSettings.highlightColor != "transparent" && !layer._contains(layer._prevSelectedShapes, shape)) {
                        shape.setAttribute("class", "e-mapHighlightedShape mapShape");
                        if (map._isSVG) {
                            if (layer.shapeSettings.highlightColor != 'none' && shape.highlightcolor==null) {
                                shape.setAttribute('fill', layer.shapeSettings.highlightColor);
                            }
                            else {
                                shape.setAttribute('fill', shape.highlightcolor);
                            }
							shape.setAttribute("stroke-width", (layer.shapeSettings.highlightBorderWidth/map._scale));
							shape.setAttribute('stroke', layer.shapeSettings.highlightStroke);
                        } else {
                            shape.fillcolor = layer.shapeSettings.highlightColor;
                        }
                    }
                    if (legend.length > 0 && !layer._contains(layer._prevSelectedLegends,legend[0].legend)) {
                        legend[0].legend[0].setAttribute("class", "e-mapHighlightedShape mapShape");
                        legend[0].legend.css("background-color", layer.shapeSettings.highlightColor);
                        layer._prevHoverdLegend = legend[0].legend;
                    }

                    layer._prevHoveredShape = shape;
                }

                if (layer.legendSettings!= null && layer.legendSettings.mode == ej.datavisualization.Map.LegendMode.Interactive && layer.shapeSettings.colorMappings!=null && layer.shapeSettings.colorMappings.rangeColorMapping != null
                     && !layer.shapeSettings.autoFill && (layer.legendSettings.showLegend == undefined || layer.legendSettings.showLegend)) {
                    for (var i = 0; i < layer._mapShapes.length; i++) {
                        var mapshape = layer._mapShapes[i].shape;
                        if (mapshape == shape) {
                            var mappings = null;
                            if (layer.shapeSettings.colorMappings.rangeColorMapping != undefined) {
                                mappings = layer.shapeSettings.colorMappings.rangeColorMapping;
                            }
                            var _legendwidth = layer.legendSettings.width;
                            if (layer.legendSettings.width == undefined)
                                _legendwidth = 150;

                            var rectwidth = (_legendwidth / mappings.length) / 10;
                            if (layer._mapShapes[i].legendrect != null) {
                                var rectPosition = layer._mapShapes[i].legendrect.marginLeft;
                                $(layer._interactiveArrow).css({ "margin-left": rectPosition + Math.ceil(rectwidth) - layer._interactiveArrow.width() / 2, "display": "block", "visibility": "visible" });
                                break;
                            }
                        }
                    }
                }
                map._trigger("mouseover", { originalEvent: event.data.Param2 });
            }
                                    
        },

        _updateShapeRect:function(layer) {

            for (var index = 0; index < layer._mapShapes.length; index++) {
                var obj = layer._mapShapes[index];
                if (obj.left == null) {
                    obj["left"] = layer._mapShapes[index].shape.getBoundingClientRect().left;
                    obj["right"] = layer._mapShapes[index].shape.getBoundingClientRect().right;
                    obj["top"] = layer._mapShapes[index].shape.getBoundingClientRect().top;
                    obj["bottom"] = layer._mapShapes[index].shape.getBoundingClientRect().bottom;
                    layer._mapShapes[index] = obj;
                }
            }
        },
        
        _polyUpFunction: function (event) {
            var layer = event.data.Param2,
                shape = event.data.Param3,
                isTouch = this.isTouch(event);
            if (isTouch)
                event.stopImmediatePropagation();
            if (this.model.zoomSettings.enableZoomOnSelection && !this._isDragging && !this._isTileMap && !this._isPinching) {
                    if (this._isSVG) {
                        var bounds = shape.getBBox();
                        this._zoomOnSelection(bounds);
                    } else {                        
                            this._updateShapeRect(layer);

                        for (var index = 0; index < layer._mapShapes.length; index++) {
                            if (shape == layer._mapShapes[index].shape) {
                                var left = layer._mapShapes[index].left;
                                var top = layer._mapShapes[index].top;
                                var right = layer._mapShapes[index].right;
                                var bottom = layer._mapShapes[index].bottom;
                                var bound = { x: left, y: top, width: right - left, height: bottom - top };
                                this._zoomOnSelection(bound);
                                break;
                            }
                        }
                    }
                    this.ispanning = false;
            }
            var element = layer._tooltipElement;
            if (element != null) {
                $(element).delay(200).queue( function(next){ 
						$(this).css('display','none'); 
						next();
						
				});
            }
            if (isTouch && layer.showTooltip) {
                var currentXY = this.getEventXY(event),
                 map = this, cachedXY = map.model.cachedXY,
                 swipediffer = 10, differX, differY;
                differX = Math.abs(cachedXY.x - currentXY.X);
                differY = Math.abs(cachedXY.y - currentXY.Y);
                if (differX < swipediffer && differY < swipediffer) {
                    this.touchEnd = true;
                    var dataParam1 = event.data.Param1;
                    event.data.Param1 = layer;
                    event.data.Param2 = dataParam1;
                    map._polyMoveFunction(event);
                    event.data.Param1 = dataParam1;
                    event.data.Param2 = layer;
                    map.tooltipElement = layer._tooltipElement[0];
                    $(map.tooltipElement).stop(true, true);
                    map._timeOut = map._timeOut.bind(map);
                    map.touchTimeOut = window.setTimeout(map._timeOut, 1000);
                }
            }
        },

        _timeOut: function () {
            $(this.tooltipElement).fadeOut();
        },

        _markerPressed: function (event) {
            this._trigger("markerSelected", { originalEvent: event.data });
        },
			
        _polyMouseDown:function(event)
        {
           
            var layer = event.data.Param2;
            var position;
            if (event.type == "mousedown" || event.type == "pointerdown")
                position = { x: event.pageX || event.originalEvent.pageX, y: event.pageY || event.originalEvent.pageY };
            else if (event.type == "touchstart")
                position = { x: event.originalEvent.changedTouches[0].pageX, y: event.originalEvent.changedTouches[0].pageY };
            else if (event.type == "MSPointerDown")
                position = { x: event.originalEvent.pageX, y: event.originalEvent.pageY };

            this.model.cachedXY = position;
            if (!this.isTouch(event)) {

            if (event.data.Param1.hasOwnProperty("data") && layer.showTooltip) {
                var element = layer._tooltipElement;
                var template = layer.tooltipTemplate;
                var parentSize = $(this._mapContainer).offset();
                if (parentSize == null)
                    parentSize = { left: 0, width: 0, height: 0 };
                var tooltipSize = layer._tooltipSize;
                var tooltipdisplayheight = this._height;
                var tooltipdisplaywidth = this._width;
				
                if (element != null && template != null) {
                    $(element).css({ "display": "block" });
                    var htmlString = $("#" + template).render(event.data.Param1["data"]);
                    $(element).html(htmlString);
                     var height= element[0]!=null ? element[0].clientHeight : element.clientHeight;
					 var width= element[0]!=null ? element[0].clientWidth : element.clientWidth;
					 tooltipSize = { height: height, width: width };

					

					var xPos = position.x - $(this._mapContainer).offset().left;
			        var yPos = position.y - $(this._mapContainer).offset().top;

                    var xnewPos = position.x;
                    var ynewPos = position.y;

			       if (tooltipSize.width + xPos >= tooltipdisplaywidth) {
                         if(xnewPos - tooltipSize.width > parentSize.left)
			                xnewPos = ((parentSize.left + tooltipdisplaywidth) - (tooltipdisplaywidth - xPos)) - tooltipSize.width;
                         else
                            xnewPos -= (tooltipSize.width + xPos - tooltipdisplaywidth);  
			            }
			            if (tooltipSize.height > tooltipdisplayheight) {
			                if (tooltipdisplayheight + tooltipSize.height > this._height + yPos) 
			                    ynewPos -= parentSize.top + 10;
			            }
                        else if (tooltipSize.height + yPos >= tooltipdisplayheight) {
			                ynewPos -= (tooltipSize.height + yPos - tooltipdisplayheight);
			            }   

                    $(element).css({ "left": xnewPos + 10, "top": ynewPos + 10 });
                }
            }
            }
        },
      
        getEventXY: function (event) {
            var X, Y;
            X = event.pageX || event.originalEvent.pageX || event.originalEvent.changedTouches[0].pageX;
            Y = event.pageY || event.originalEvent.pageY || event.originalEvent.changedTouches[0].pageY;
            return { X: X, Y: Y };
        },

       _polyClickFunction: function (event) {

           var ctrlkey = event.ctrlKey,
               layer = event.data.Param2,
               map = this, swipeDiffer = 10, cachedXY = map.model.cachedXY,// avoid tiny mouse movement changes
            differX, differY, currentXY = map.getEventXY(event);
            differX = Math.abs(cachedXY.x - currentXY.X);
            differY = Math.abs(cachedXY.y - currentXY.Y);
            if (differX < swipeDiffer && differY < swipeDiffer) {

            var shape = event.data.Param3;
            if (event.data.param4 != undefined)
            {                
                var temp = event.data.param4;
            }            
            
            var legend = jQuery.grep(layer._smartLabels, function (obj) { return obj.shape == shape });
            map._isPolygonSelected = true;

            if (layer.enableSelection) {

                if (ctrlkey && layer.selectionMode == ej.datavisualization.Map.SelectionMode.Multiple) {
				 if (legend != null && legend.length > 0) {
                        if ($.inArray(legend[0].legend, layer._prevSelectedLegends) == -1) {
				            legend[0].legend[0].setAttribute("class", "e-mapSelectedShape mapShape");
                            legend[0].legend.css("background-color", layer.shapeSettings.selectionColor);
                            layer._prevSelectedLegends.push(legend[0].legend);
                        }
                        else {
                            var index = layer._prevSelectedLegends.indexOf(legend[0].legend);
				            legend[0].legend[0].setAttribute("class", "e-mapShape");
                            legend[0].legend.css("background-color", legend[0].legend[0].getAttribute("data-nodeValue"));
                            layer._prevSelectedLegends.splice(index, 1);
                        }
                    }

				 if (temp != null) {                     

				     var element = document.getElementsByClassName("e-map-labelContainer")
				     if ($.inArray(temp, layer._prevSelectedTemp) == -1) {				         
				         $(temp).css("background-color", layer.shapeSettings.selectionColor);
				         $(temp).css("width", element[0].clientWidth);
				         layer._prevSelectedTemp.push(temp);
				     }
				     else {
				         $(temp).css("background-color", "");				         				         			         
				         var pos = layer._prevSelectedTemp.indexOf(temp);
				         layer._prevSelectedTemp.splice(pos, 1);
				     }

				 }

                    if ($.inArray(shape, layer._prevSelectedShapes) == -1) {
				        shape.setAttribute("class", "e-mapSelectedShape mapShape");
                        if (this._isSVG) {
                            shape.setAttribute("fill", layer.shapeSettings.selectionColor);
                            shape.setAttribute("stroke", layer.shapeSettings.selectionStroke);
                            shape.setAttribute("stroke-width", (layer.shapeSettings.selectionStrokeWidth / map._scale));                            
                        }
                        else {
                            shape.fillcolor = layer.shapeSettings.selectionColor;
                            shape.strokecolor = layer.shapeSettings.selectionStroke
                            shape.strokeweight = layer.shapeSettings.selectionStrokeWidth / map._scale;
                        }
                        layer._prevSelectedShapes.push(shape);
                        layer.selectedItems.push(event.data.Param1);
                    }
                    else {
				        shape.setAttribute("class", "e-mapShape");
                        shape.setAttribute("fill", shape.getAttribute("data-nodeValue"));
                        shape.setAttribute("stroke", layer.shapeSettings.stroke);
                        shape.setAttribute("stroke-width", layer.shapeSettings.strokeThickness / this._scale);
                        var index = layer._prevSelectedShapes.indexOf(shape);
                        layer._prevSelectedShapes.splice(index, 1);
                        layer.selectedItems.splice(index, 1);
                    }
                }

                else {
                     for (var i = 0; i < layer._prevSelectedLegends.length; i++) {
                        layer._prevSelectedLegends[i][0].setAttribute("class", "e-mapShape");
                        layer._prevSelectedLegends[i].css("background-color", layer._prevSelectedLegends[i][0].getAttribute("data-nodeValue"));
                    }
                    if ((legend != null && legend.length > 0)) {
                         legend[0].legend[0].setAttribute("class", "e-mapSelectedShape mapShape");
                         legend[0].legend.css("background-color", layer.shapeSettings.selectionColor);
                         layer._prevSelectedLegends.push(legend[0].legend);
                     }
                   
                    for (var i = 0; i < layer._prevSelectedShapes.length; i++) {
                        layer._prevSelectedShapes[i].setAttribute("class", "e-mapShape");                        
                            if (this._isSVG) {
                                layer._prevSelectedShapes[i].setAttribute("fill", layer._prevSelectedShapes[i].getAttribute("data-nodeValue"));
                                layer._prevSelectedShapes[i].setAttribute("stroke", layer.shapeSettings.stroke);
                                layer._prevSelectedShapes[i].setAttribute("stroke-width", layer.shapeSettings.strokeThickness / this._scale);
                            }
                            else {
                                layer.fillcolor = layer._prevSelectedShapes[i].getAttribute("data-nodeValue");
                                layer.strokecolor = layer.shapeSettings.stroke
                                layer.strokeweight = layer.shapeSettings.strokeThickness / this._scale;
                            }                            
                    }

                    if (temp != null)
                    {
                        var element = document.getElementsByClassName("e-map-labelContainer")
                        if ($.inArray(temp, layer._prevSelectedTemp) == -1)
                        {                           

                            for (var i = 0; i < layer._prevSelectedTemp.length; i++)
                            {
                                $(layer._prevSelectedTemp[i]).css("background-color", "");                                
                            }
                            layer._prevSelectedTemp = [];
                            $(temp).css("background-color", layer.shapeSettings.selectionColor);
                            $(temp).css("width", element[0].clientWidth);
                            layer._prevSelectedTemp.push(temp);
                        }
                        else
                        {                            
                            for (var i = 0; i < layer._prevSelectedTemp.length; i++) {
                                $(layer._prevSelectedTemp[i]).css("background-color", "");                                
                            }
                            layer._prevSelectedTemp = [];
                        }
                        
                    }

                        if (!this._isPinching && ($.inArray(shape, layer._prevSelectedShapes) == -1)) {
                        shape.setAttribute("class", "e-mapSelectedShape mapShape");                      
                            layer._prevSelectedShapes = [];
                            layer.selectedItems = [];
                            if (this._isSVG) {
                                shape.setAttribute("fill", layer.shapeSettings.selectionColor);
                                shape.setAttribute("stroke", layer.shapeSettings.selectionStroke);
                                shape.setAttribute("stroke-width", (layer.shapeSettings.selectionStrokeWidth / map._scale));
                            }
                            else {
                                shape.fillcolor = layer.shapeSettings.selectionColor;
                                shape.strokecolor = layer.shapeSettings.selectionStroke;
                                shape.strokeweight = layer.shapeSettings.selectionStrokeWidth / map._scale;
                            }
                            
                            layer._prevSelectedShapes.push(shape);
                            layer.selectedItems.push(event.data.Param1);
                        }
                        else {
                            layer._prevSelectedShapes=[];
                            layer.selectedItems = [];
                        }
                        
                    

                    
                }
            }
            map._trigger("shapeSelected", { originalEvent: layer.selectedItems });
          }
        },

        _updateSelection: function (layer, shape, data) {
            if (layer.enableSelection) {
                if (layer.selectionMode != ej.datavisualization.Map.SelectionMode.Multiple) {
                    layer._prevSelectedShapes.pop();
                    layer.selectedItems.pop();
                }
                layer._prevSelectedShapes.push(shape);
                layer.selectedItems.push(data);
            }
        },

	   _zoomOnSelection: function (bounds) {            
	       var layerScale;
	       if (!this._isSVG) {
	           bounds.x = (bounds.x - (this._baseTranslatePoint.x/2)) - (bounds.width/2);
	           bounds.y = (bounds.y - (this._baseTranslatePoint.y/2)) - (bounds.height / 2);
	       }
	       var boundwidth = bounds.width;
	       var boundHeight =bounds.height;
	       if ((this._width - 100) / (this._height - 100) > boundwidth / boundHeight) {
	           layerScale = (this._height - 100) / boundHeight;
	       } else {
	           layerScale = (this._width - 100) / boundwidth;
	       }
	       this._prevScale = this._scale;
	       this._scale = layerScale;
	       this._prevPoint = { x: this._translatePoint.x, y: this._translatePoint.y };
	       this.model.zoomSettings.level = this._scale - this._baseScale + 1;
	       this._zoomLevel(this._scale - this._baseScale + 1);
	       var level = this._zoomLevel();
	       if (!(level > this._minZoom() && level < this._maxZoom())) {
	           this.model.zoomSettings.level = level > (((this._maxZoom() - this._minZoom()) / 2) + this._minZoom()) ? this._maxZoom() : this._minZoom();
	           this._zoomLevel(this.model.zoomSettings.level);
	           this._scale = this._zoomLevel() + this._baseScale - 1;
	       }
	       var leftMargin = (this._width / 2) - ((boundwidth * this._scale) / 2);
	       var leftPos = leftMargin / this._scale;
	       var topMargin = (this._height / 2) - ((boundHeight * this._scale) / 2);
	       var topPos = topMargin / this._scale;
	       this._translatePoint.x = -bounds.x + leftPos;
	       this._translatePoint.y = -bounds.y + topPos;
	       if (this.enableAnimation() && !this._isTileMap) {
	           this._animate(1200);
	       }
	       else {
	           this._applyTransform(this._scale, this._translatePoint);
	           this._updateSliderValue();
	       }	                  
        },
       
          _polyMoveFunction: function (event) {
              var map = event.data.Param1,
                  isTouch = this.isTouch?this.isTouch(event):false;
           if ((!isTouch && event.type.toString().indexOf('move') > -1) || this.touchEnd) {
               this.touchEnd = false;
		   if(this.model!=null){
            var baseLayer = this.model.layers[this.baseMapIndex()];
	        var element = map._tooltipElement;
            var template = map.tooltipTemplate;
            var tooltipObject = event.data.Param2;
            var tooltipSize = map._tooltipSize;
			var parentSize=$(this._mapContainer).offset();
			 if (parentSize == null)
                parentSize = { left: 0, top:0, width: 0, height: 0 };

			if (baseLayer.legendSettings.dockOnMap && baseLayer.legendSettings.dockPosition == "right") {
			    width = this._width + baseLayer.legendSettings.width + 20 + (baseLayer.legendSettings.leftLabel.length * 10) + (baseLayer.legendSettings.rightLabel.length * 10);
			}
			else {
                width = this._width;
			}
			var tooltipdisplayheight = this._height;
			var tooltipdisplaywidth = width;

			var pageXY = this.getEventXY(event);

			var xPos = pageXY.X - parentSize.left;
			var yPos = pageXY.Y - parentSize.top;

			var xnewPos = pageXY.X;
			var ynewPos = pageXY.Y;

             if (element != null && template != null && tooltipObject.hasOwnProperty("data") && event.data.Param1.showTooltip) {
                    $(element).css({ "display": "block" });
					 var locale = this.model.locale;
					 var obj = $.extend({}, tooltipObject.data);
					 if (locale && this.model.enableGroupSeparator){
						for (var key in obj)
							obj[key] = isNaN(parseFloat(obj[key])) ? obj[key] : parseFloat(obj[key]).toLocaleString(locale);
					 }	
                    var htmlString = $("#" + template).render(obj);
                    $(element).html(htmlString);
                     var height= element[0]!=null ? element[0].clientHeight : element.clientHeight;
					 var width= element[0]!=null ? element[0].clientWidth : element.clientWidth;
					 tooltipSize = { height: height, width: width };

					 if (!ej.util.isNullOrUndefined(this.touchTimeOut))
					     window.clearTimeout(this.touchTimeOut);

            if (tooltipSize.width + xPos >= tooltipdisplaywidth && !this.model.enableRTL) {
             if(xnewPos - tooltipSize.width > parentSize.left)
			    xnewPos = ((parentSize.left + tooltipdisplaywidth) - (tooltipdisplaywidth - xPos)) - tooltipSize.width;
             else
                xnewPos -= (tooltipSize.width + xPos - tooltipdisplaywidth);  
			}
			if (tooltipSize.height > tooltipdisplayheight) {
			    if (tooltipdisplayheight + tooltipSize.height > this._height + yPos) 
			        ynewPos -= parentSize.top + 10;
			}
            else if (tooltipSize.height + yPos >= tooltipdisplayheight) {
			    ynewPos -= (tooltipSize.height + yPos - tooltipdisplayheight);
			}  
			    $(element).css({ "left": !this.model.enableRTL ? xnewPos + 10 : !(xPos - tooltipSize.width < 0) ? xnewPos - width : xnewPos + 10, "top": ynewPos + 10});
			}
            }
          }
          },

        _polyLeaveFunction: function (event) {
            var layer = event.data.Param1,
                isTouch = this.isTouch(event),
                map = event.data.map,
                shape = event.data.Param2.shape,
                element = layer._tooltipElement,
                selectedshape = layer._prevSelectedShapes;
            if (selectedshape.length > 0)
            {
                shape.setAttribute("class", "e-mapShape");
                for (var i = 0; i < selectedshape.length; i++)
                {
                    selectedshape[i].setAttribute("class", "e-mapSelectedShape mapShape");                    
                }                
            }
            else
            {
                shape.setAttribute("class", "e-mapShape");
            }            
            if (element != null && !isTouch) {
                $(element).css("display", "none");
            }
            if (layer.legendSettings!=null && layer.legendSettings.mode == ej.datavisualization.Map.LegendMode.Interactive && layer._interactiveArrow != null)
                $(layer._interactiveArrow).css("display", "none");
            layer._clearShapeWidth(map._scale, this);
            map._trigger("mouseleave", { originalEvent: event.data.Param2 });
        },

        _wireEvents: function () {
            var matched = jQuery.uaMatch(navigator.userAgent);
            var browser = matched.browser.toLowerCase();
            $(this._mapContainer).off();
            this._on($(this._mapContainer), ej.eventType.mouseDown, this._mouseButtonDown);
			$(document).keydown({ className: "home", map: this }, this._keyboardKeysPressed);
            this._on($(this._mapContainer), ej.eventType.mouseMove, this._mouseMove);
            this._on($(document), ej.eventType.mouseUp, this._mouseUp);
            var isIE11 = !!navigator.userAgent.match(/Trident\/7\./);
            if (isIE11)
                browser = "msie";
            if (window.navigator.msPointerEnabled) {
                this._on($(this._mapContainer), "MSPointerUp", this._mouseButtonUp);
                if (this.model.zoomSettings.enableZoom)
                    $(this._mapContainer).css('-ms-touch-action', 'none');
            }
            else {
                this._on($(this._mapContainer), "mouseup", this._mouseButtonUp);
            }
            var map = this;
            this._browser = browser;
            if (browser != "mozilla") {
                this._on($(this._mapContainer), "mousewheel", this._mouseWheel);
            }
            else {
                var elem = this._svgDocument || this._mapContainer[0];
                if (elem.addEventListener) {
                    // Mouse Scrolling event for firefox
                    elem.addEventListener("DOMMouseScroll", MouseWheel, false);
                }

            }
            function MouseWheel(event) {
			if(map.enableAnimation()){
				$(map._rootgroup).stop(true, false);
			}
			  event.preventDefault(event);
                map._zooming(-40 * event.detail, event);
            }
            this._on($(this._mapContainer), "touchstart", this._mapDown);
            $(this._mapContainer).get(0).addEventListener(ej.isTouchDevice() ? "touchend" : "mouseup", this._mapClick.bind(this), true);
            this._on($(this._mapContainer), "dblclick", this._doubleClick);
            if (this.model.enableResize || this.model.isResponsive) {
                if (!ej.isTouchDevice())
                    this._on($(window), "resize", this._mapResize);
                else
                    this._on($(window), "orientationchange", this._mapResize);
            }
        },

       clip:function(n,minValue,maxValue){
        return Math.min(Math.max(n, minValue), maxValue);
        },

        pointToLatLong:function(pointX,pointY)
        {
            var map = this, latitude, longitude;
            var factor = map._getFactor();
            var translateX = (pointX / map._scale) - (map._translatePoint.x);
            var translateY = (pointY / map._scale) - (map._translatePoint.y);
            var mapSize = Math.min(map._height, map._width) * factor;
            var transformX = (map.clip(translateX, 0, mapSize - 1) / mapSize) - 0.5;
            var transformy = 0.5 - (map.clip(translateY, 0, mapSize - 1) / mapSize);

            latitude = 90 - 360 * Math.atan(Math.exp(-transformy * 2 * Math.PI)) / Math.PI;
            longitude = 360 * transformX;
            return {latitude:latitude,longitude:longitude};
        
        },
   
        _mapResize: function (event) {
            event.preventDefault();
            event.stopPropagation();
            var oldSize = { width: this._width, height: this._height };
            var oldTranslatePoint = this._translatePoint;
            var map = this;
            if (this.resizeTO) clearTimeout(this.resizeTO);
            this.resizeTO = setTimeout(function () {
                if (map.model != null) {
                    var latlon = map.pointToLatLong(map._width / 2, map._height / 2);
                    map.refresh(true);
                    if (!map._isTileMap)
                        map.navigateTo(latlon.latitude, latlon.longitude, map._zoomLevel(), false);                    
                }
            }, 500);
        },


        _isDevice: function () {
            return (/mobile|tablet|android|kindle/i.test(navigator.userAgent.toLowerCase()));
        },
        
        _unWireEvents: function () {
            var matched = jQuery.uaMatch(navigator.userAgent);
            var browser = matched.browser.toLowerCase();
            this._off($(this._mapContainer), "touchstart", this._mapDown);
            this._off($(document), 'keydown', this._keyboardKeysPressed);
            this._off($(document), ej.eventType.mouseUp, this._mouseUp);
            var isIE11 = !!navigator.userAgent.match(/Trident\/7\./);
            if (isIE11)
                browser = "msie";
			if (browser != "mozilla") {
                this._off($(this._mapContainer), "mousewheel", this._mouseWheel);
            }
            if (window.navigator.msPointerEnabled) {
                this._off($(this._mapContainer), "MSPointerDown", this._mouseButtonDown);
                this._off($(this._mapContainer), "MSPointerMove", this._mouseMove);
                this._off($(this._mapContainer), "MSPointerUp", this._mouseButtonUp);
            }
            else if (browser == "webkit" || browser == "chrome" || browser == "mozilla") {
                this._off($(this._mapContainer), "mousedown", this._mouseButtonDown);
                this._off($(this._mapContainer), "mousemove", this._mouseMove);
                this._off($(this._mapContainer), "mouseup", this._mouseButtonUp);

            }
            else {
                this._off($(this._mapContainer), "mousedown", this._mouseButtonDown);
                this._off($(this._mapContainer), "mousemove", this._mouseMove);
                this._off($(this._mapContainer), "mouseup", this._mouseButtonUp);

            }
            $(this._mapContainer).get(0).removeEventListener(ej.isTouchDevice() ? "touchend" : "mouseup", this._mapClick, true);
            this._off($(this._mapContainer), "dblclick", this._doubleClick);

        },

        navigateTo: function (latitude, longitude, level,isAnimate) {
		     if (isAnimate == undefined) {
                isAnimate = this.enableAnimation();
            }
		    level=parseFloat(level);
		    if (level == undefined) level = this._zoomLevel();
            if (level > this._minZoom() && level < this._maxZoom()) {
                this.model.zoomSettings.level = level;
                this._zoomLevel(level);
            }
            else {
                this.model.zoomSettings.level = level > (((this._maxZoom() - this._minZoom()) / 2) + this._minZoom()) ? this._maxZoom() : this._minZoom();
                this._zoomLevel(this.model.zoomSettings.level);

            }
            var factor = this._getFactor();
            var translatePoint = this._convertTileLatLongtoPointForShapes(latitude, longitude, this._mapBounds,factor);
            this._prevPoint = { x: this._translatePoint.x, y: this._translatePoint.y };
            this._prevScale = this._scale;
            this._scale = this._baseScale + ((level - 1) * this._zoomFactor());
            var leftPosition = ((this._containerWidth + this._baseTranslatePoint.x) / 2) / this._scale;
            var topPosition = ((this._containerHeight + this._baseTranslatePoint.y) / 2) / this._scale;
            this._translatePoint.x = -translatePoint.x+ leftPosition;
            this._translatePoint.y = -translatePoint.y+ topPosition;
            if (isAnimate && !this._isTileMap ){
                this._animate(1200);
            }
            else {
                this._applyTransform(this._scale, this._translatePoint);
            }
            this._updateSliderValue();
            this._refrshLayers();
        },

        selectShape: function (obj, layer,isZoom) {
            if (obj != null) {
                if (layer == null) {
                    layer = this.model.layers[this.baseMapIndex()];
                }
                for (var i = 0; i < layer._mapShapes.length; i++) {
                    var data = layer._mapShapes[i].data;
                    var shape = layer._mapShapes[i].shape;
                    if (data != null && obj == this._reflection(data, layer.shapeSettings.valuePath)) {

                        if (layer._prevSelectedShapes.length != 0 && layer.selectionMode != ej.datavisualization.Map.SelectionMode.Multiple) {
                            for (var i = 0; i < layer._prevSelectedShapes.length; i++) {
                                if (this._isSVG) {
                                    layer._prevSelectedShapes[i].setAttribute("fill", layer._prevSelectedShapes[i].getAttribute("data-nodeValue"));
                                    layer._prevSelectedShapes[i].setAttribute("stroke", layer.shapeSettings.stroke);
                                    layer._prevSelectedShapes[i].setAttribute("stroke-width", layer.shapeSettings.strokeThickness / this._scale);
                                } else {
                                    layer._prevSelectedShapes[i].fillcolor = layer._prevSelectedShapes[i].style.behavior;
                                    layer._prevSelectedShapes[i].strokecolor = layer.shapeSettings.stroke;
                                    layer._prevSelectedShapes[i].strokeweight = layer.shapeSettings.strokeThickness / this._scale;
                                }
                            }
                        }
                        if (layer.enableSelection) {
                            if (this._isSVG) {
							    if(layer.shapeSettings.selectionColor!="none"){
                                    shape.setAttribute("fill", layer.shapeSettings.selectionColor);
							    }
                                shape.setAttribute("stroke", layer.shapeSettings.selectionStroke);
                                shape.setAttribute("stroke-width", (layer.shapeSettings.selectionStrokeWidth / this._scale));
                            } else {
							     if(layer.shapeSettings.selectionColor!="none"){
                                      shape.fillcolor = layer.shapeSettings.selectionColor;
								}
                                shape.strokecolor = layer.shapeSettings.selectionStroke;
                                shape.strokeweight = layer.shapeSettings.selectionStrokeWidth / this._scale;
                            }
                            this._updateSelection(layer, shape, obj);
						if (!layer._contains(layer.selectedItems, layer._mapShapes[i]))
                            layer.selectedItems.push(layer._mapShapes[i]);
                            this._trigger("shapeSelected", { originalEvent: layer.selectedItems });
                        }
                        if (isZoom && this.model.zoomSettings.enableZoomOnSelection) {
                            this._zoomOnSelection(shape.getBBox());
                        }
                        i = layer._mapShapes.length;
                    }
                }
            }

        },

        _getIntersectedElements: function (evt, shapes) {
            evt.width += 5;
            evt.height += 5;
            if (this._isSVG && this._browser!='mozilla' && this._browser!='webkit') {
                var rpos = this._svgDocument.createSVGRect();
                rpos.x = evt.left;
                rpos.y = evt.top;
                rpos.width = evt.width;
                rpos.height = evt.height;
                return this._svgDocument.getIntersectionList(rpos, null);
            }
            else {
                var elements = []; 
				var parentSize=$(this._mapContainer).offset();
                var  parentLeft=parentSize.left;
                var parentTop= parentSize.top;			
                for (var i = 0; i < shapes.length; i++) {
                    var shape = shapes[i].shape;
                    var bounds = shape.getBoundingClientRect();					
					var leftPos= $(shape).offset().left- parentLeft;
					var topPos= $(shape).offset().top- parentTop;					
                    if (this._isIntersect(evt, { left: leftPos, top: topPos, height: (bounds.bottom  - bounds.top ), width: (bounds.right -bounds.left) })) {
                        elements.push(shape);
                        return elements;
                    }
                }
                return elements;
            }
                
                
        },

        _isIntersect: function (rect1, rect2) {           
            
            if (rect1.left >= (rect2.left + rect2.width) || rect1.left + rect1.width <= rect2.left ||
                rect1.top >= rect2.top + rect2.height || rect1.top + rect1.height <= rect2.top) {
                    return false;
                }
                return true;
            
        },

        pan: function (direction) {
            var map = this;
            var Xdiff = 0;
            var Ydiff = 0;
            if (this._zoomLevel() != 1) {
                switch (direction) {

                    case 'right':
                        {
                            Xdiff = this._width / 7;
                            Ydiff = 0;
                            break;
                        }
                    case 'top':
                        {
                            Xdiff = 0;
                            Ydiff = -(this._height / 7);
                            break;
                        }n
                    case 'left':
                        {
                            Xdiff = -(this._width / 7);
                            Ydiff = 0;
                            break;
                        }
                    case 'bottom':
                        {
                            Xdiff = 0;
                            Ydiff = this._height / 7;
                            break;
                        }
                }
                if (map.enablePan()) {
                    if (this._isTileMap) {
                        var curtileX = this._tileTranslatePoint.x - Xdiff / map._scale;
                        var curtileY = this._tileTranslatePoint.y - Ydiff / map._scale;
                        this._tileTranslatePoint.x = curtileX;
                        this._tileTranslatePoint.y = curtileY;
                        this._generateTiles(this._zoomLevel());
                    }                    
                    var curX = map._translatePoint.x - Xdiff / map._scale;
                    map._prevScale = map._scale;
                    var curY = map._translatePoint.y - Ydiff / map._scale;
                    map._prevPoint = { x: this._translatePoint.x, y: this._translatePoint.y };
                    this._translatePoint.x = curX;
                    this._translatePoint.y = curY;
                    if (map.enableAnimation() && !this._isTileMap) {                       
                        map._animate(600);
                    }
                    else {
                        map._applyTransform(map._scale, map._translatePoint);
                    }
                    map._refrshLayers();
                }
            }
			
        },      

        zoom: function (level,isAnimate) {
           var map = this;
           var prevLevel = map._zoomLevel();
		    if (level <= this._maxZoom() && level >= this._minZoom()) {
                if (this._isTileMap) {
                    this._tileZoom(map._zoomLevel(), level, { x: this._width / 2, y: this._height / 2 });
                    var prevLevel = map._zoomLevel();
                    map.model.zoomSettings.level = level;
                    map._zoomLevel(level);
                    this._generateTiles(this._zoomLevel());
                    map._translatePoint.x = (map._tileTranslatePoint.x - (0.5 * Math.pow(2, prevLevel))) / (Math.pow(2, prevLevel));
                    map._translatePoint.y = (map._tileTranslatePoint.y - (0.5 * Math.pow(2, prevLevel))) / (Math.pow(2, prevLevel));
                    map._scale = (Math.pow(2, prevLevel));					
                }
                else {                    
                    var fac = (map._baseScale + ((level - 1) * map._zoomFactor()));
                    map._prevPoint = { x: map._translatePoint.x, y: map._translatePoint.y };
                    map._prevScale = map._scale;
                    map._translatePoint.x -= (map._width / map._scale - map._width / fac) / 2;
                    map._translatePoint.y -= (map._height / map._scale - map._height / fac) / 2;
                    map._scale = fac;
                    map.model.zoomSettings.level = level;
                    map._zoomLevel(level);

                    if (map.enableAnimation() && isAnimate || isAnimate == undefined) {
                        map._animate(600);
                    }                  
                }
				if(!map.enableAnimation() || !isAnimate)
				{
				     map._applyTransform(map._scale, map._translatePoint);
                     map._refrshLayers();
                     map._resizeShape();       
				}
				 map._updateSliderValue();                  
                
            }
		    else if (level <= this._minZoom()) {
		        this.model.zoomSettings.level = this._minZoom();
		        this._zoomLevel(this._minZoom());
		        this.zoom(this._zoomLevel());
            }
            else if (level >= this._maxZoom()) {
                this.model.zoomSettings.level = this._maxZoom();
                this._zoomLevel(this._maxZoom());
                this.zoom(this._zoomLevel());
            }
			  if (prevLevel < level) {
			      map._trigger("zoomedIn", { originalEvent: null, zoomLevel: map._zoomLevel() });
            }
            else  if (prevLevel > level) {
                map._trigger("zoomedOut", { originalEvent: null, zoomLevel: map._zoomLevel() });
            }
			
        },

       refresh: function (isResize) {
           var scale;
		   this._trigger("onLoad");
           $(this._svgDocument).children().remove();
           $(this._svgDocument).empty();
           $(this._mapContainer).empty();
           
           (this.baseMapIndex() >= this.model.layers.length) && this.baseMapIndex(0);
           this.model.layers[this.baseMapIndex()]._mapItems && (this.model.layers[this.baseMapIndex()]._mapItems = null);
           if (this._svgDocument != null) {
               this._svgDocument = null;
           }
           if(!this._scale)
            this._scale = 1;
            this._margintop = 0;
            this._marginleft = 0;

            if(!this._translatePoint || (this._scale && this._scale <= 1))
                this._translatePoint = { x: 0, y: 0 };            
            this._height = this._mapContainer.height();
            this._width = this._mapContainer.width();
             if (this._height == 0) {
                 this._height = this._mapContainer[0].parentElement.clientHeight != 0 ? this._mapContainer[0].parentElement.clientHeight : $(document).height();
            }
            if (this._width == 0) {
                this._width = this._mapContainer[0].parentElement.clientWidth != 0 ? this._mapContainer[0].parentElement.clientWidth : $(document).width();
            }
			 var baseLayer = this.model.layers[this.baseMapIndex()];
			 if (baseLayer.legendSettings != null && baseLayer.legendSettings.showLegend && (baseLayer.shapeSettings.colorMappings != null || baseLayer.shapeSettings.colorPath != null || baseLayer.bubbleSettings.colorPath != null)) {
                baseLayer._sizeCalculation(this);
            }
			scale = this._scale;
            this._generatePath();           
            if (this._groupSize != null) {
               
                if (this._isMapCoordinates) {
                    this._containerHeight = this._groupSize.maxY - this._groupSize.minY;
                    this._containerWidth = this._groupSize.maxX - this._groupSize.minX;
                    this._groupBorder = { x: this._groupSize.minX, y: this._groupSize.minY };
                }
                else
                {
                    var factor = this._getFactor();
                    this._containerHeight = Math.abs((this._groupSize.maxY - this._groupSize.minY)* factor);
                    this._containerWidth = Math.abs((this._groupSize.maxX - this._groupSize.minX)*factor);
                }
            }
			
			if ((baseLayer.layerType == "geometry")) {
                $(this._svgDocument).css("background", this.model.background);
            }
            this._resizingContainer();
            if(scale != this._scale)
			    this._resetThickness();
            this._renderMapElements();
            
            if ((baseLayer.legendSettings != null && baseLayer.legendSettings.showLegend) && (baseLayer.shapeSettings.colorMappings != null || baseLayer.shapeSettings.colorPath != null || baseLayer.bubbleSettings.colorPath != null)) {
                
                    this._renderLegend();
                
            } 
           if (this._isSVG) {
               $(this._svgDocument).css({ height: this._height, width: this._width, "margin-top": this._margintop, "margin-left": this._marginleft });
               
            }			
            if (this.model.enableLayerChangeAnimation) {
                $(this._mapContainer).animate({ opacity: 1 }, 500);
            }
            if(this.model.centerPosition!=null && !this._isTileMap){
                this.navigateTo(this.model.centerPosition[0], this.model.centerPosition[1], this._zoomLevel(), false);
            }
             if (this._legendContainer != null) {
                this._legendContainer.css({
					
					"width": this._legendSize.width,
                    "height": this._legendSize.height


                })
            }
			 this._trigger("refreshed");
             if (!isResize) {
                 this._events = null;
                 $(this._mapContainer).removeData();
                 $(this._mapContainer).data("ejMap", this);
             }
        },

        _resetThickness: function(){
            var attr, i =0, length = this._rootgroup.children ? this._rootgroup.children.length : 0;
            for(; i<length;i++){
                attr = parseFloat($(this._rootgroup.children[i]).attr("stroke-width"));
                $(this._rootgroup.children[i]).attr("stroke-width", attr / this._scale);
            }
        },

        _updateSliderValue: function (isAnimate) {
            var slider = this._sliderControl;
            if (isAnimate == undefined) isAnimate = this.enableAnimation();
            if (slider != null) {
                var obj = slider.data("ejSlider");               
                obj.option("value", this._zoomLevel());
            }
        },

        _createDivElement: function (parent, child,base,classname) {
            var parentElement = parent;
            var childElement = child;           
            childElement.appendTo(parentElement);           
            parentElement.appendTo(base);            
            this._on(childElement,ej.eventType.mouseDown,{ className: classname, map: this }, this._navigationControlPressed);
            
        },

        _navigationControlPressed: function (event) {
            
            event.stopPropagation();
            this._isNavigationPressed = true;
            var map = event.data.map;
            var isAnimate = map.enableAnimation();            
            if (event.data.className == "zoomIn") {               
                map.zoom(map._zoomLevel() + 1, true);
                if (!isAnimate) {
                    map._updateSliderValue();
                }
				 map._refrshLayers();
            }
            else if (event.data.className == "zoomOut") {               
                map.zoom(map._zoomLevel() - 1, true);
                if (!isAnimate) {
                    map._updateSliderValue();
                }
            }
            else if (event.data.className == "panLeft") {
                map.pan("left");                
            }
            else if (event.data.className == "panRight") {
                map.pan("right");
            }
            else if (event.data.className == "panTop") {
                map.pan("top");
            }
            else if (event.data.className == "panBottom") {
                map.pan("bottom");
            }
            else if (event.data.className == "home") {                
                map.zoom((map._isTileMap && map._minZoom() > 1) ? map._minZoom() : 1 ,true);
                if (!isAnimate) {
                    map._updateSliderValue();
                }
            }            
           
        },
	
		 _keyboardKeysPressed: function (event) {
            this._iskeyboardKeysPressed = true;
            var map = event.data.map;
            var isAnimate = map.enableAnimation();
            if (event.ctrlKey && event.keyCode==38) {    			
                map._zoomingIn(map._width / 2, map._height / 2, event, isAnimate);
            }
            else if (event.ctrlKey && event.keyCode==40) {    
                map._zoomingOut(map._width / 2, map._height / 2, event, isAnimate);
            }
            else if (event.keyCode==37) {
                map.pan("left");                
            }
            else if (event.keyCode==39) {
                map.pan("right");
            }
            else if (event.keyCode==38) {
                map.pan("top");
            }
            else if (event.keyCode==40) {
                map.pan("bottom");
            }
		},
				
        refreshNavigationControl: function (navigation) {
            
            var baseLayer = this.model.layers[this.baseMapIndex()];
            var prevNav = this._mapContainer.find("#ejNavigation"), navigationStyle;
            if (prevNav.length > 0) {
                this._mapContainer[0].removeChild(prevNav[0]);
            }
            if (this.model.navigationControl != null && this.model.navigationControl.enableNavigation) {
                if (navigation == undefined) {
                    navigation = this.model.navigationControl;
                }
                var navigationOrientation = ej.datavisualization.Map.LabelOrientation.Vertical;
                var controlSize;
                var navigationHeight = 120;
                var navigationWidth = 12;
                controlSize = { width: 90, height: 320 };
                var navigationControl = $("<div id='ejNavigation' class='e-map-navigation e-orientation-vert'/>");
				if (this.model.navigationControl.content == null || this.model.navigationControl.content == "") {
                    var sliderDiv = $("<div style='height:120px;width:10px;margin-top:-197px;margin-left: 34px;' />");
                }
                if (navigation.orientation == 'horizontal') {
                    navigationOrientation = ej.datavisualization.Map.LabelOrientation.Horizontal;
                    navigationHeight = 12;
                    navigationWidth = 120;
                    controlSize = { width: 320, height: 90 };
                    navigationControl = $("<div id='ejNavigation' class='e-map-navigation e-orientation-horz' />");
                    if (this.model.navigationControl.content == null || this.model.navigationControl.content == "") {
                        sliderDiv = $("<div style='height:10px;width:120px;margin-top:-18px' />");
                    }
                }
				if (this.model.navigationControl.content == null || this.model.navigationControl.content == "") {
                    var baseDiv = $("<div class='e-panContainer'/>");
                    var isHor = navigationOrientation == 'horizontal' ? 'Horz' : 'Vert';
                    if (navigation.orientation == 'horizontal') {
                        var zoominOutDiv = $("<div style='margin-left: 94px;' />");
                        var slidercontrol = $("<div style='margin-left: 137px;'/>");
                    }
                    else {
                        var zoominOutDiv = $("<div />");
                        var slidercontrol = $("<div style='margin-top: 34px;'/>");
                    }
                    baseDiv.appendTo(navigationControl);
                    zoominOutDiv.appendTo(navigationControl);
                    sliderDiv.appendTo(slidercontrol);
                    slidercontrol.appendTo(navigationControl);
                    this._sliderControl = sliderDiv;
                    var navPos = { x: 0, y: 0 };
                    if (navigation.dockPosition == null || navigation.dockPosition == ej.datavisualization.Map.Position.None) {
                        navPos.x = (this._width * navigation.absolutePosition.x) / 100;
                        navPos.y = (this._height * navigation.absolutePosition.y) / 100;
                    } else {
                        navPos = this._getPosition(navigation.dockPosition, controlSize);
                    }
                    navigationControl.css({ "margin-left": navPos.x + "px", "margin-top": navPos.y + "px" });
                }
                var map = this;
				var changeZoom = this._height * 0.0025;
				if (this.model.navigationControl.content == null || this.model.navigationControl.content == "") {
                    if (this._browser != 'chrome' && this._browser != 'msie') {
                        navigationStyle = $('<style> .e-map-navigation {width: 90px;height: 320px;position:absolute;z-index:2;zoom:' + changeZoom + ';}</style>');
                    }
                    else {
                        navigationStyle = $('<style> .e-map-navigation {width: 90px;height: 320px;position:absolute;z-index:2;-moz-transform: scale(' + changeZoom + ');}</style>');
                    }
                }
                else {
					var contentHeight = $("#"+this.model.navigationControl.content).height() || $(this.navigationControlData[0]).height();
					var contentWidth = $("#"+this.model.navigationControl.content).width() || $(this.navigationControlData[0]).width();
					
                    if (this._browser != 'mozilla' && this._browser != 'chrome') {
                        navigationStyle = $('<style> .e-map-navigation {width: '+contentWidth+'px;height: '+contentHeight+'px;position:absolute;z-index:2;}</style>');
                    }
                    else {
                        navigationStyle = $('<style> .e-map-navigation {width: '+contentWidth+'px;height: '+contentHeight+'px;position:absolute;z-index:2;}</style>');
                    }
                }
				if (this._browser!='mozilla' && this._browser!='chrome'){
				navigationStyle.remove();
				$('html > head').append(navigationStyle);
				}
				else{
				$('html > head').append(navigationStyle);
				}
				if (this.model.navigationControl.content == null || this.model.navigationControl.content == "") {
				    $(sliderDiv).ejSlider({
				        orientation: navigationOrientation,
				        sliderType: ej.SliderType.MinRange,
				        value: 1,
				        animationSpeed: 1200,
				        minValue: this._minZoom(),
				        showTooltip: true,
				        enableAnimation: false,
				        maxValue: this._maxZoom(),
				        incrementStep: this._zoomFactor(),
				        slide: onslide,
				        change: onchange,
				        height: navigationHeight,
				        width: navigationWidth
				    });
				    navigationControl.appendTo(this._mapContainer);
				    if (navigation.orientation == 'horizontal') {
				        this._createDivElement($("<div title='" + this._localizedLabels.zoomIn + "' class='e-icon1 e-incrementButton  icon_margin1' />"), $("<div class='e-icon1 nav-inc-" + isHor + "  e-innerIncrement'/>"), zoominOutDiv, "zoomIn");
				        this._createDivElement($("<div title='" + this._localizedLabels.zoomOut + "' class='e-icon1 e-incrementButton icon_margin2'/>"), $("<div class='e-icon1 nav-dec-" + isHor + " e-innerDecrement'/>"), zoominOutDiv, "zoomOut");
				    }
				    else {
				        this._createDivElement($("<div title='" + this._localizedLabels.zoomIn + "' class='e-icon1 e-incrementButton  icon_margin1' />"), $("<div class='e-icon1 nav-inc-" + isHor + "  e-innerIncrement'/>"), zoominOutDiv, "zoomIn");
				        this._createDivElement($("<div title='" + this._localizedLabels.zoomOut + "' class='e-icon1 e-incrementButton icon_margin2'/>"), $("<div class='e-icon1 nav-dec-" + isHor + " e-innerDecrement'/>"), zoominOutDiv, "zoomOut");
				    }
				    this._createDivElement($("<div title='" + this._localizedLabels.panTop + "' class='e-icon1 e-radialTop'/>"), $("<div class='e-icon1 e-arrowUp'/>"), baseDiv, "panTop");
                    this._createDivElement($("<div title='" + this._localizedLabels.panLeft + "' class='e-icon1 e-radialLeft'/>"), $("<div class='e-icon1 e-arrowLeft'/>"), baseDiv, "panLeft");
				    this._createDivElement($("<div title='" + this._localizedLabels.panRight + "' class='e-icon1 e-radialRight'/>"), $("<div class='e-icon1 e-arrowRight'/>"), baseDiv, "panRight");
                    this._createDivElement($("<div title='" + this._localizedLabels.panBottom + "' class='e-icon1 e-radialBottom'/>"), $("<div class='e-icon1 e-arrowDown'/>"), baseDiv, "panBottom");
                    var homeDiv = $("<div title='" + this._localizedLabels.home + "' class='e-icon1 e-home-bg'><div class='e-icon1 e-map-home'></div>");
				    homeDiv.appendTo(baseDiv);
				    homeDiv.mousedown({ className: "home", map: this }, this._navigationControlPressed);
				}
				else {
                    if (this.navigationControlData == null) {
                        this.navigationControlData = $("#" + this.model.navigationControl.content);
                        this.navigationControlData.css({ 'display': 'block' });                            
                        this.navigationControlData.appendTo(navigationControl);
                    }
                    else {                            
                        this.navigationControlData.appendTo(navigationControl);
                    }                                                
                    navigationControl.appendTo(this._mapContainer);
                                       
				    controlSize = { width: this.navigationControlData[0].getBoundingClientRect().right - this.navigationControlData[0].getBoundingClientRect().left, height: this.navigationControlData[0].getBoundingClientRect().bottom - this.navigationControlData[0].getBoundingClientRect().top };                    
                    var navPos = { x: 0, y: 0 };
                    if (navigation.dockPosition == null || navigation.dockPosition == ej.datavisualization.Map.Position.None) {
                        navPos.x = (this._width * navigation.absolutePosition.x) / 100;
                        navPos.y = (this._height * navigation.absolutePosition.y) / 100;
                    } else {
                        navPos = this._getPosition(navigation.dockPosition, controlSize);
                    }

                    if (baseLayer.legendSettings.dockOnMap && baseLayer.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Top && baseLayer.legendSettings.mode == ej.datavisualization.Map.LegendMode.Interactive) {
                        navigationControl.css({ "margin-left": navPos.x + "px", "margin-top": navPos.y + baseLayer.legendSettings.height  + "px" });
                    }
                    else if (baseLayer.legendSettings.dockOnMap && baseLayer.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Left && baseLayer.legendSettings.mode == ej.datavisualization.Map.LegendMode.Interactive) {
                            navigationControl.css({ "margin-left": navPos.x + baseLayer.legendSettings.width + 20 + (baseLayer.legendSettings.leftLabel.length * 10) + (baseLayer.legendSettings.rightLabel.length * 10)+ "px", "margin-top": navPos.y + "px" });
                    }
                    else if (baseLayer.legendSettings.dockOnMap && baseLayer.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Top && baseLayer.legendSettings.mode == ej.datavisualization.Map.LegendMode.Default) {
                        navigationControl.css({ "margin-left": navPos.x + "px", "margin-top": navPos.y + baseLayer.legendSettings.height + "px" });
                    }
                    else if (baseLayer.legendSettings.dockOnMap && baseLayer.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Left && baseLayer.legendSettings.mode == ej.datavisualization.Map.LegendMode.Default) {
                        navigationControl.css({ "margin-left": navPos.x + baseLayer.legendSettings.width + "px", "margin-top": navPos.y + "px" });
                    }
                    else {
                        navigationControl.css({ "margin-left": navPos.x + "px", "margin-top": navPos.y + "px" });
                    }
                }
            }                     

			function onchange(args) {
			    if (map != null && map._isRendered && map._zoomLevel() != args.value) {
                    map.zoom(args.value, false);
                }
            
            }

            function onslide(args) {
                if (map != null && map._isRendered && map._zoomLevel() != args.value) {
                    map.zoom(args.value, false);
                }
            }
        },

        _getPosition: function (position,size) {
            var Position = { x: 0, y: 0 };
            switch (position) {
                case ej.datavisualization.Map.Position.TopLeft:                   
                    break;
                case ej.datavisualization.Map.Position.TopCenter:
                    Position.x = (this._width / 2) - (size.width / 2);
                    break;
                case ej.datavisualization.Map.Position.TopRight:
                    Position.x = this._width - size.width;
                    break;
                case ej.datavisualization.Map.Position.CenterLeft:
                    Position.y = (this._height / 2) - (size.height / 2);
                    break;
                case ej.datavisualization.Map.Position.Center:
                    Position.x = (this._width / 2) - (size.width / 2);
                    Position.y = (this._height / 2) - (size.height / 2);
                    break;
                case ej.datavisualization.Map.Position.CenterRight:
                    Position.x = this._width - size.width;
                    Position.y = (this._height / 2) - (size.height / 2);
                    break;
                case ej.datavisualization.Map.Position.BottomLeft:
                    Position.y = this._height - size.height;
                    break;
                case ej.datavisualization.Map.Position.BottomCenter:
                    Position.x = (this._width / 2) - (size.width / 2);
                    Position.y = this._height - size.height;
                    break;
                case ej.datavisualization.Map.Position.BottomRight:
                    Position.x = this._width - size.width;
                    Position.y = this._height - size.height;
                    break;

            }
            return Position;
        },

        _renderMapElements: function () {           
            this._templateDiv = $("<div class='e-TemplateDiv'/>");
            this._templateDiv.appendTo(this._mapContainer);
            this._templateDiv.css({
                'pointer-events': 'none', 'overflow': 'hidden', "position":"absolute",
                'z-index': '1', 'height': this._height, 'width': this._width
            });			

            this.refreshLayers();       
            this.refreshNavigationControl(this.model.navigationControl);
        },
		
        _renderLegend: function () {

            var baseLayer = this.model.layers[this.baseMapIndex()];
            
            this._scrollLegendDiv = $("<div class='e-ScrollLegendDiv'/>");
            
            this._scrollLegendDiv.appendTo(this._mapContainer);

            this._legendContainer = $("<div id='e-LegendcontainerDiv'/>");
            this._legendContainer.appendTo(this._scrollLegendDiv);


            this._legendDiv.css({
                'height': this._legendDivHeight + "px", 'width': this._legendDivWidth + "px"
            })
            this._isNavigationPressed = true;
            this._legendDiv.appendTo(this._legendContainer);
            this._legendDiv[0].getBoundingClientRect();
            this._legendContainer.css({
                "position": "relative"
            })

            this._scrollLegendDiv.ejScroller({ height: Math.round(this._legendSize.height), width: Math.round(this._legendSize.width) });

            if (baseLayer.legendSettings.labelOrientation == undefined)
                baseLayer.legendSettings.labelOrientation == ej.datavisualization.Map.LabelOrientation.Vertical;
            if (!baseLayer.legendSettings.dockOnMap) {
                if (baseLayer.legendSettings.labelOrientation == ej.datavisualization.Map.LabelOrientation.Horizontal || baseLayer.legendSettings.labelOrientation == ej.datavisualization.Map.LabelOrientation.Vertical) {

                    var position = (baseLayer.legendSettings.position == undefined) ? "topleft" : baseLayer.legendSettings.position;
                    var legendPos = this._getPosition(position, this._legendSize);
                    this._scrollLegendDiv.css({
                         "position": "absolute",
                         'z-index': '2', "margin-left": legendPos.x + "px", "margin-top": legendPos.y
                    });
                }
            }
            else {

                if (baseLayer.legendSettings.mode == ej.datavisualization.Map.LegendMode.Interactive) {
                    pos = "none";
                    height = baseLayer.legendSettings.height + 50;
                    width = baseLayer.legendSettings.width + 20 + (baseLayer.legendSettings.leftLabel.length * 10) + (baseLayer.legendSettings.rightLabel.length * 10);
                }
                else {
                    pos = "auto";
                    height = baseLayer.legendSettings.height;
                    width = baseLayer.legendSettings.width;
                }
                this._scrollLegendDiv.css({
                    "position": "absolute",
                    'z-index': '2', 'height': this._legendSize.height, 'width': this._legendSize.width
                });

                if ((baseLayer.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Top || baseLayer.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Bottom) && baseLayer.legendSettings.alignment == ej.datavisualization.Map.Alignment.Center) {
                    this._scrollLegendDiv.css({
                        "margin-left": (this._width / 2) - (this._legendSize.width / 2)
                    });
                }
                else if ((baseLayer.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Top || baseLayer.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Bottom) && baseLayer.legendSettings.alignment == ej.datavisualization.Map.Alignment.Far) {
                    this._scrollLegendDiv.css({
                        "margin-left": this._width - this._legendSize.width
                    });
                }
                else if ((baseLayer.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Left || baseLayer.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Right) && baseLayer.legendSettings.alignment == ej.datavisualization.Map.Alignment.Center) {
                    this._scrollLegendDiv.css({
                        "margin-top": (this._height / 2) - (this._legendSize.height / 2)
                    });
                }
                else if ((baseLayer.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Left || baseLayer.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Right) && baseLayer.legendSettings.alignment == ej.datavisualization.Map.Alignment.Far) {
                    this._scrollLegendDiv.css({
                        "margin-top": this._height - this._legendSize.height
                    });
                }

                if (baseLayer.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Bottom) {
                    this._scrollLegendDiv.css({
                        "margin-top": this._height
                    });
                }
                else if (baseLayer.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Right) {

                    this._scrollLegendDiv.css({

                        "margin-left": this._width

                    });
                }
            }

           
            this.refreshNavigationControl(this.model.navigationControl);
        },
       
		_renderMapLayers:function(){
		
		 $(this._templateDiv).empty();
            var prevPathCount = 0;
            var baseLayer = this.model.layers[this.baseMapIndex()];
            if (baseLayer.layerType == ej.datavisualization.Map.LayerType.Geometry) {
                this._renderLayers(baseLayer, prevPathCount, this);
                if (baseLayer.shapeData != null)
                    prevPathCount = baseLayer._polygonData.length;
            }
            else {
                baseLayer._initializeLocalValues();
                var contribution = $("<div class='e-map-contribution'>");
                contribution[0].innerHTML = baseLayer.contribution;
                this._mapContainer.append(contribution);
            }
            for (var key = 0; key < this.model.layers[this.baseMapIndex()].subLayers.length; key++) {
                var sublayer = this.model.layers[this.baseMapIndex()].subLayers[key];
                sublayer._isBaseLayer = false;
                if (sublayer.layerType == ej.datavisualization.Map.LayerType.Geometry && sublayer.shapeData!=null) {
                    if (ej.util.isNullOrUndefined(sublayer._initializeLocalValues)) {
                        var subobj = new shapeLayer();
                        $.extend(subobj, sublayer);
                        $.extend(sublayer, subobj);
                    }
                    this._renderLayers(sublayer, prevPathCount, this);
                    prevPathCount += sublayer._polygonData.length;
                }
                else {
                    sublayer._initializeLocalValues();
                }
            }
            this.refreshMarkers();
            if (this._isSVG && this.enableAnimation() && !this._isTileMap) {
                this._refreshWithAnimation();
            }
            else {
                this._refrshLayers();
            }

		},

        refreshLayers: function () {          
		   var baseLayer = this.model.layers[this.baseMapIndex()];
		   this._processOData(baseLayer,this);          
		   this.shapeSelectionOnResize();
        },
		
		_processOData:function(layer,map){		    
		    if(layer.dataSource!=null){
                      if (layer.dataSource instanceof ej.DataManager) {
				          var queryPromise = layer.dataSource.executeQuery(layer.query);
			             queryPromise.done(function (e) {
			             if(e.result!=null)
				         {
                            layer.dataSource=e.result;
						    map._renderMapLayers();
				         }
			           });        
				  }
				 else
				 {
				    map._renderMapLayers();
				 }
            }
			else
			{
			  map._renderMapLayers();
			}
		}
		
		

    });

 

    var Tile = function (x, y) {
        this.X = x;
        this.Y = y;
        this.left = 0;
        this.top = 0;       
        this.height = 256;
        this.width = 256;
        this.src = null;
    };
   
    var shapeLayer = function () {
                
        this.enableSelection = true;
        this.selectionMode = "default";		
		this.bingMapType = "aerial";	
        this.key = "";   
        this.selectedItems = [];        
        this.enableMouseHover = false;
        this.shapeData = null;
        this.markers = [];
        this.dataSource = null;
        this.urlTemplate = 'http://a.tile.openstreetmap.org/level/tileX/tileY.png';
        this.showTooltip = false;
        this.tooltipTemplate = null;
        this.mapItemsTemplate = null;
        this.enableAnimation = false;

        this.legendSettings = {		
			showLegend:false,		
			showLabels:false,	
			rowSpacing: 10,
			textPath: null,
            columnSpacing:10,
			position: "topleft",			
			positionX: 0,		
			positionY:0,				
			height:0, 		
			width:0,
			iconHeight: 20,
			iconWidth: 20,		
			type:"layers", 		
			mode:"default", 					
			title: null, 			
			leftLabel:null, 						
			rightLabel:null,			
			icon:"rectangle",						
			dockOnMap:false,					
			dockPosition: "top",					
            labelOrientation: "vertical",
			alignment: "bottom",
            columnCount:0
        };

        this.labelSettings = {			
			showLabels: false, 						
			labelPath: "",			
			enableSmartLabel: false,			
			smartLabelSize:"fixed",			
			labelLength:2
		};        
        this.markerTemplate = null;       
		this.showMapItems = false;      
        this.layerType = 'geometry';
        this.geometryType = "geographic";
        this._colorPaletteSettings = {
            'Palette1':
            {
                'highlightColor': '#F7CD1C',
                'highlightStroke': 'white',
                'SelectionColor': '#F96C0D',
                'SelectionStroke': 'white'
                
            },
            'Palette2':
            {
                'highlightColor': '#68A3EA',
                'highlightStroke': 'White',
                'SelectionColor': '#116EF4',
                'SelectionStroke': 'White'
               
            },
            'Palette3':
            {
                'highlightColor': '#CCCCCC',
                'highlightStroke': 'white',
                'SelectionColor': '#4D4D4D',
                'SelectionStroke': 'white'
                
            }
        };
        this.colorPalettes = {
            'Palette1': ['#4A3825', '#736F3D','#F2DABD','#BF9D7E','#7F6039','#7F715F','#70845D','#CC995C','#736F3D','#89541B'],
            'Palette2': ['#E51400', '#730202','#EF6535','#C63477','#BF004D','#F0A30B','#CE1B1B','#97993D','#D6BF38','#835A2C'],
            'Palette3': ['#A4C400', '#008B00','#1BA0E2','#0050EF','#AA00FF','#D90073','#E51400','#F96800','#E3C800','#A20026']
        };
        
        this._prevPaletteIndex = 0;        
        this._newBounds = [];      
        this.subLayers = [];

        this.shapeSettings = {           
            highlightColor: "gray",          
            highlightBorderWidth: 1,            
            selectionColor: "gray",
            fill: "#E5E5E5",          
            radius: 5,
            strokeThickness: "0.2",            
            stroke: "#C1C1C1",
            colorPalette: 'palette1',
            highlightStroke: "#C1C1C1",
            selectionStroke: "#C1C1C1",           
            selectionStrokeWidth: 1,
            colorPath: null,
            colorValuePath : null,
            valuePath: null,
            enableGradient: false,        
            colorMappings: null,
            autoFill: false
        };

       
        this.bubbleSettings = {            
            showBubble: true,          
            bubbleOpacity: "0.9",         
            minValue: 10,
            maxValue: 20,
            color: "gray",
            colorValuePath : null,
            valuePath: null,
            colorMappings: null,
            showTooltip: false,
            tooltipTemplate: null,            
            colorPath: null
        };
    };

    shapeLayer.prototype =
    {        
        dataTypes: {
            dataSource: "data",
            markers: "array",
            subLayers: "array",
            shapeSettings: {
                colorMappings: "array"
            },
            bubbleSettings: {
                colorMappings: "array"
            }

        },
       
        _initializeLocalValues:function()
        {
            this._svgns = "http://www.w3.org/2000/svg";
            this._bounds = [];
            this._bubbleCollection = [];
            this._prevSelectedShapes = [];
            this._prevSelectedTemp = [];
            this._prevSelectedLegends = [];
            this._isBaseLayer = true;
            this._prevHoverdLegend = null;
            this._prevHoveredShape = null;
            this._labelCollection = [];
            this._scrollBar = null;
            this._mapShapes = [];
            this._bubbles = [];
            this._labelBounds = [];            
            this._bubbleCount = 0;
            this._mapItems = [];           
            this._mapMarkers = [];
            this.selectedItems;
			this._tooltipSize = { height: 0, width: 0 };
            this._smartLabels = [];
            this._labelData = [];
            this._interactiveArrow = null;
            this._legendRects = [];

        },
     
        _generateMarkerForLayers: function (map) {
            this._mapMarkers = [];
            var rootTop = map._rootgroup.getBoundingClientRect().top;
            var rootLeft = map._rootgroup.getBoundingClientRect().left;
            for (var key = 0; key < this.markers.length; key++) {
                var markerObeject = this.markers[key];               
                if (this.markerTemplate != null) {
                    var markerTemplateDiv = $('.markerTemplateDiv');
                    markerTemplateDiv = $("<div class='e-mapMarker' style='display:block;position:absolute;pointer-events: stroke;'></div>");                   
                    map._templateDiv.append(markerTemplateDiv);
                    $(markerTemplateDiv).css({ height: this._height, width: this._width, "margin-top": this._margintop, "margin-left": this._marginleft });
                    var htmlString = $("#" + this.markerTemplate).render(markerObeject);
					if(map.model.markerSelected==null)
					{
						
						$(markerTemplateDiv).css({  "pointer-events": "none"});
					}
                    $(markerTemplateDiv).html(htmlString);
                    map._on($(markerTemplateDiv), ej.eventType.mouseDown, { marker: $(markerTemplateDiv), data: markerObeject }, map._markerPressed);
                    map._on($(markerTemplateDiv), 'dblclick', { marker: $(markerTemplateDiv), data: markerObeject }, map._markerPressed);
                    map._on($(markerTemplateDiv), 'contextmenu', { marker: $(markerTemplateDiv), data: markerObeject }, map._markerPressed);
                    this._mapMarkers.push(markerTemplateDiv);
                }
                else {                    
                    var markerItem = $(' <div class="e-mapMarker" style="display:block;position:absolute;pointer-events: stroke;"><label>' + markerObeject.label + '</label></div>');// document.createElementNS(this._svgns, "text");
                    if (this._isSVG) {
                        map._templateDiv.append(markerItem);
                    }
                    else {
                        markerItem.appendTo(map._templateDiv);
                    }
					if(map.model.markerSelected==null)
					{
						
						$(markerItem).css({  "pointer-events": "none"});
					}
                    map._on($(markerItem), ej.eventType.mouseDown, { marker: $(markerItem), data: markerObeject }, map._markerPressed);
                    map._on($(markerItem), 'dblclick', { marker: $(markerItem), data: markerObeject }, map._markerPressed);
                    map._on($(markerItem), 'contextmenu', { marker: $(markerItem), data: markerObeject }, map._markerPressed);
                    this._mapMarkers.push(markerItem);

                }
                  var baseLayer = this;
                if (baseLayer.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Left) {
                    this._height = this._height;
                    this._width = this._width - parseFloat(width);
                    this._marginleft = parseFloat(width);
             }            
            }            
        },

        _contains : function(array,actualobj) {
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
       
          _shapeContains: function (array, actualobj) {
            var length = array.length;
            if (length > 0) {
                while (length--) {
                    if (array[length].shapeIndex === actualobj) {
                        return { isContains: true, index: array.length - length };
                    }
                }
            }
            return { isContains: false };

        },  

          _labelSizeCalculation: function (map) {

              var size = document.getElementsByClassName("e-map-labelContainer");
              var totalHeight = size[0].offsetHeight;
              var totalWidth = size[0].offsetWidth;
              
              map._width = map._width - totalWidth;
              map._marginleft = totalWidth;
              
          },
		
		 _sizeCalculation: function (map) {
		     var colorMappings = this.shapeSettings.colorMappings;
		     var isRange = false, colormap = false;
		     if (colorMappings != null || this.shapeSettings.colorPath != null || this.bubbleSettings.colorPath != null) {
		         if (colorMappings != null) {
		             if (colorMappings.rangeColorMapping != null) {
		                 colorMappings = colorMappings.rangeColorMapping;
		                 isRange = true;
		             }
		             else if (colorMappings.equalColorMapping != null) {
		                 colorMappings = colorMappings.equalColorMapping;
		             }
		         }
		         else if (this.shapeSettings.colorPath != null) {
		             colorMappings = this.dataSource;
		             colormap = true;
		         }
                        
                var width = 0;
                var height = 0;
                var rowSpacing = this.legendSettings.rowSpacing;
                var columnSpacing = this.legendSettings.columnSpacing;
                var iconWidth = this.legendSettings.iconWidth + 5;
                var iconHeight = this.legendSettings.iconHeight + 5;
                var legendHeight = iconHeight + rowSpacing;
                var totalHeight = this.legendSettings.iconHeight + rowSpacing;
                var totalWidth = 0;
                var yPos = 10;
                var xPos = 10;
                var legendSettings = this.legendSettings;
                var columnCount = this.legendSettings.columnCount;
                if (legendSettings.height == 0 && legendSettings.width == 0  && columnCount == 0) {
                    for (var i = 0; i < colorMappings.length; i++) {
                        var label = colorMappings[i].legendLabel != null ? colorMappings[i].legendLabel : (isRange ? colorMappings[i].from : colormap ? colorMappings[i][legendSettings.textPath] : colorMappings[i].value);
                        var labelwidth = this._calcWidth(label);
                        var legendWidth = iconWidth + labelwidth + columnSpacing ;

                        if ((legendSettings.dockOnMap && (legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Top || legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Bottom))||!legendSettings.dockOnMap) {
                            if (map._width < (width + legendWidth)) {
                                totalHeight = ((iconHeight) + rowSpacing) + totalHeight;
                                totalWidth = Math.max(totalWidth, width);
                                width = legendWidth;
                            }
                            else {
                                width += (legendWidth + 5);
                            }
                        }
                        else {

                            if (map._height < (height + iconHeight + rowSpacing)) {
                                totalWidth += width;
                                totalHeight = Math.max(totalHeight, height);
                                width = legendWidth;
                                height = 0;
                            }
                            else {
                                height += (iconHeight + rowSpacing);
                                width = Math.max(legendWidth, width);
                            }
                        }


                    }
                    if ((legendSettings.dockOnMap && (legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Top || legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Bottom)) || !legendSettings.dockOnMap) {
                        totalWidth = Math.max(totalWidth, width);
                        totalHeight += 5;
                    }
                    else {
                        totalWidth += (width + columnSpacing);
                        totalHeight = Math.max(totalHeight, height);
                    }

                }
                else if (columnCount == 0) {
                    if ((legendSettings.height.toString().indexOf("%")) != -1) {

                        totalHeight = (map._height / 100) * parseInt(legendSettings.height.toString().replace('%', ''))
                    }
                    else {

                        totalHeight = legendSettings.height;
                    }
                    if ((legendSettings.width.toString().indexOf("%")) != -1) {

                        totalWidth = (map._width / 100) * parseInt(legendSettings.width.replace('%', ''))
                    }
                    else {

                        totalWidth = legendSettings.width;
                    }

                }

                if (legendSettings.height == 0 && legendSettings.width == 0 && columnCount != 0) {

                    for (var i = 0; i < colorMappings.length; i++) {
                        var label = colorMappings[i].legendLabel != null ? colorMappings[i].legendLabel : (isRange ? colorMappings[i].from : colormap ? colorMappings[i][legendSettings.textPath] : colorMappings[i].value);
                        var labelwidth = this._calcWidth(label);

                        var legendWidth = iconWidth + labelwidth + columnSpacing ;

                        if (i % columnCount != 0) {
                            width += legendWidth;
                            if (i == columnCount - 1) {
                                totalWidth = Math.max(totalWidth, width);
                            }

                        }
                        else {
                            if (i != 0)
                                totalHeight = (iconWidth + rowSpacing) + totalHeight;
                            totalWidth = Math.max(totalWidth, width);
                            width = legendWidth;
                        }
                    }
                }
            }
        
        
            if (legendSettings.height != 0 && legendSettings.width != 0)
			{
				 totalHeight = legendSettings.height;
				 totalWidth = legendSettings.width;
            }

			map._legendSize = { height: totalHeight, width: totalWidth };
			if (legendSettings.dockOnMap) {
			    if (legendSettings.mode == ej.datavisualization.Map.LegendMode.Interactive) {
			        totalHeight = 55;
			    }
			    if (this.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Bottom) {
			        map._height = map._height - parseFloat(totalHeight);
			        this.legendSettings.tempWidth = width;
			    }

			    else if (this.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Top) {
			        map._height = map._height - parseFloat(totalHeight);
			        map._margintop = parseFloat(totalHeight);
			    }
			    else if (this.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Left) {

			        map._width = map._width - totalWidth;
			        map._marginleft = totalWidth;
			    }
			    else if (this.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Right) {
			        map._height = map._height;
			        map._width = map._width - totalWidth;
			    }
			}



        },

        
        _clearShapeWidth: function (scale, mapObject) {
            if (scale == null) scale = 1;
            for (var index = 0; index < this._mapShapes.length; index++) {
                var mapshape = this._mapShapes[index];
                if (!this._contains(this._prevSelectedShapes,mapshape.shape)) {
                    if (mapObject._isSVG) {
                        if (this.shapeSettings.colorMappings != null || this.shapeSettings.colorPath || this.shapeSettings.autoFill) {
                            mapshape.shape.setAttribute("fill", mapshape.shape.getAttribute("data-nodeValue"));                            
                            
                        }
                        else
                        {  
						    mapshape.shape.setAttribute("data-nodeValue", this.shapeSettings.fill);
                            mapshape.shape.setAttribute("fill", this.shapeSettings.fill);
                        }                        

                        mapshape.shape.setAttribute("stroke-width", (this.shapeSettings.strokeThickness / scale));
                        mapshape.shape.setAttribute("stroke", this.shapeSettings.stroke);
                    }
                    else {
                        mapshape.shape.fillcolor = mapshape.shape.style.behavior;
                        mapshape.shape.strokeweight = this.shapeSettings.strokeThickness;
                        mapshape.shape.strokecolor = this.shapeSettings.stroke;
                    }
                }
            }
            


        },
			
       _shapeSelection: function () {
            for (var index = 0; index < this._mapShapes.length; index++) {
                var mapshape = this._mapShapes[index];
                var check = this._shapeContains(this.selectedItems, mapshape.shapeIndex);
                if (check.isContains) {
                     if (!this._contains(this._prevSelectedShapes, mapshape.shape))
                     this._prevSelectedShapes.push(mapshape.shape);
                     if (this._isSVG) {
                        mapshape.shape.setAttribute("fill", this.shapeSettings.selectionColor);
                        mapshape.shape.setAttribute("stroke-width", this.shapeSettings.selectionStrokeWidth);
                        mapshape.shape.setAttribute("stroke", this.shapeSettings.selectionStroke);
                    }
                    else {
                        mapshape.shape.fillcolor = this.shapeSettings.selectionColor;
                        mapshape.shape.strokeweight = this.shapeSettings.selectionStrokeWidth;
                        mapshape.shape.strokecolor = this.shapeSettings.selectionStroke;
                    }
                }
            }
        },
                        		
		_createDefs: function () {
			var defs = document.createElementNS( this._svgns , "defs");
			return defs;
		},
		
		_createGradientElement: function (name, colors, x1, y1, x2, y2, element,count) {			
			if (Object.prototype.toString.call(colors) == '[object Array]') {
				var options = {
					'id': name.id + 'Gradient' + '_' + count,
					'x1': x1 + '%',
					'y1': y1 + '%',
					'x2': x2 + '%',
					'y2': y2 + '%',	
				};
				var cName = '#' + name.id + 'Gradient' + '_' + count;
                this._drawGradient(options, colors, element,cName);				
				return 'url(' + cName + ')';
			}			
			
		},

		_drawGradient: function (options, gradientEle, element,id) {
			var mappingCount = id.substring(1,(id.length/2)) == 'rootGroup' ? element.shapeSettings.colorMappings.rangeColorMapping.length : element.bubbleSettings.colorMappings.rangeColorMapping.length;				
			if ($(svgDocument).find('defs').length > mappingCount){ 
				 $(svgDocument).find('defs').remove();				
		    }
			var defs = this._createDefs();			
			var linerGradient = document.createElementNS( this._svgns , "linearGradient");
			$(linerGradient).attr(options);
				for (var i = 0; i < gradientEle.length; i++) {
					var offsetColor = 100/(gradientEle.length - 1);
					var stop = document.createElementNS(this._svgns , "stop");
					$(stop).attr({
						'offset': i * offsetColor + '%',
						'stop-color': gradientEle[i],
						'stop-opacity': 1
					});
					$(stop).appendTo(linerGradient);
				}
			if($(id).length == 0){	
				$(linerGradient).appendTo(defs);
				$(defs).appendTo(svgDocument);
			}
		},
                
		
        _calculateTextWidth: function (text) {
            var span = $('<span>' + text + '</span>');
            $('body').append(span);
            var width = span.width();
            span.remove();    
            return width;
        },
        
        _trimFunction: function (str, width) {
      
            var span = $("#spantag").text(str);
            var text = str;
            while (span.width() > width)
            {    
                text = text.slice(0, -2);
                span.text(text + "...");   
            }

            return text;
    
        },
               
        _createLabel:function(content, xpos, ypos,className) {
            var label = $("<div class="+className+"></div>"); // document.createElementNS(this._svgns, "text");
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
                "visibility": "hidden",				
                
            });
            return interactiveElement;
        },
        _getEllipseLegend: function (xPos, yPos, colormapping) {

            var rect = $("<div class='e-mapLegend'/>");
            rect.css({
                "height": colormapping.legendSettings.iconHeight + "px",
                "width": colormapping.legendSettings.iconWidth + "px",
                "border-radius": colormapping.legendSettings.iconHeight / 2 + "px",
                "left": xPos + "px",
                "top": yPos + "px",
                "position": "absolute"
            });
            return rect;

        },

        _getRectLegend: function (xPos, yPos, colormapping) {
            var rect = $("<div />");
            rect.css({
                "height": colormapping.legendSettings.iconHeight + "px",
                "width": colormapping.legendSettings.iconWidth + "px",
                "left": xPos + "px",
                "top": yPos + "px",
                "position": "absolute"
            });
            return rect;
        },
		
		_generateLegend: function (map) {

		    var isRange = true, colormap = false;
		    var colormapping = null;
		    if (this.shapeSettings.colorMappings != null) {
		        if (this.shapeSettings.colorMappings.rangeColorMapping != undefined) {
		            colormapping = this.shapeSettings.colorMappings.rangeColorMapping;
		        } else if (this.shapeSettings.colorMappings.equalColorMapping != undefined) {
		            colormapping = this.shapeSettings.colorMappings.equalColorMapping;
		            isRange = false;
		        }		        
		    }
		    else if (this.shapeSettings.colorPath != null) {
		        colormap = true;
		        isRange = false;
		        colormapping = this.dataSource;
		    }
                var xPos = 0;
                var yPos = 0;
                var legendSettings = this.legendSettings;
                var columnWidth = 0;
                var height1;
                var width1, commonEventArgs;
           
            var rowSpacing = legendSettings.rowSpacing;
            var columnSpacing = legendSettings.columnSpacing;
            var iconwidth = legendSettings.iconWidth + 5;
            var totalHeight = legendSettings.iconHeight + rowSpacing;
            var totalWidth = 0;
            var columnCount = legendSettings.columnCount;
            for (var i = 0; i < colormapping.length; i++) {
                var legend = $.extend(true, null, this.legendSettings);
                var label = colormapping[i].legendLabel = colormapping[i].legendLabel != null ? colormapping[i].legendLabel : (isRange ? colormapping[i].from : colormap ? colormapping[i][legendSettings.textPath] : colormapping[i].value);
                commonEventArgs = {
                    legendSettings: legend, legendLabel: colormapping[i].legendLabel,
                    fill: !isRange ? colormapping[i][this.shapeSettings.colorPath] : colormapping[i].color,
                    mapping: !isRange ? undefined : colormapping[i],
                    dataSource: !isRange ? colormapping[i] : undefined
                };
                map._trigger("legendItemRendering", { model: map.model, data: commonEventArgs });
                var labelwidth = this._calcWidth(commonEventArgs.legendLabel);

                var legendWidth = commonEventArgs.legendSettings.iconWidth + columnSpacing + labelwidth;
                var legendHight = commonEventArgs.legendSettings.iconHeight;


                if (columnCount != 0) {
                    if (i % columnCount != 0) {
                        this._drawLegend(commonEventArgs, xPos, yPos, map, isRange);
                        xPos += (legendWidth + 5);

                    }
                    else {
                        xPos = 0;
                        this._drawLegend(commonEventArgs, xPos, yPos, map, isRange);
                        xPos += (legendWidth + 5);
                        yPos += (commonEventArgs.legendSettings.iconHeight + rowSpacing);
                    }
                }
                else {
                    if (commonEventArgs.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Top || commonEventArgs.legendSettings.dockPosition == ej.datavisualization.Map.DockPosition.Bottom) {

                        if (map._legendSize.width < xPos + legendWidth) {
                            xPos = 0;
                            this._drawLegend(commonEventArgs, xPos, yPos, map, isRange);
                            xPos += legendWidth;
                            yPos += (commonEventArgs.legendSettings.iconHeight + rowSpacing);
                        }
                        else {
                            this._drawLegend(commonEventArgs, xPos, yPos, map, isRange);
                            xPos += legendWidth;
                        }
                    }
                    else {

                        if (map._legendSize.height < yPos + commonEventArgs.legendSettings.iconHeight) {

                            yPos = 0;
                            xPos += (columnWidth + (columnSpacing));
                            this._drawLegend(commonEventArgs, xPos, yPos, map, isRange);
                            columnWidth = 0;
                            yPos += (commonEventArgs.legendSettings.iconHeight + rowSpacing);
                        }
                        else {
                            this._drawLegend(commonEventArgs, xPos, yPos, map, isRange);
                            columnWidth = Math.max(columnWidth, legendWidth);
                            yPos += (commonEventArgs.legendSettings.iconHeight + rowSpacing);
                        }
                    }

                }

                height1 = map._legendDivHeight > yPos ? map._legendDivHeight : yPos + legendHight;
                width1 = map._legendDivWidth > xPos + legendWidth ? map._legendDivWidth : xPos + legendWidth;
                map._legendDivWidth = width1;
                map._legendDivHeight = height1;

            }
		},
		_drawLegendShape: function (colormapping,xPos,yPos,map,isRange) {
		    var legendItem;
		    if (colormapping.legendSettings.icon == ej.datavisualization.Map.LegendIcons.Circle) {
		        legendItem = this._getEllipseLegend(xPos, yPos, colormapping);
		    }
		    else {
		        legendItem = this._getRectLegend(xPos, yPos, colormapping);
		    }
		    xPos += (colormapping.legendSettings.iconWidth + 5);		    
		    $(legendItem).css("background-color", !isRange ? colormapping.dataSource._color ? colormapping.dataSource._color : colormapping.fill : colormapping.mapping._color ? colormapping.mapping._color : colormapping.fill);		    
		    legendItem.appendTo(map._legendDiv);
		    return xPos;
		},
		_drawLegendText: function (colormapping, xPos, yPos, map, isRange) {
		    var legendText = $("<div class='e-defaultLegendLabel'/>");
		    legendText.css({
		        "left": xPos + "px",
		        "top": yPos + "px",
		        "position": "absolute",
		        "text-overflow": "ellipsis",
		        "white-space": "nowrap",
		        "overflow": "hidden"
		    });
		    legendText[0].title = colormapping.legendLabel;
		    legendText[0].innerHTML = colormapping.legendLabel;
		    legendText.appendTo(map._legendDiv);
		    xPos += this._calcWidth(colormapping.legendLabel);
		    return xPos;
		},
		_drawLegend: function (colormapping, xPos, yPos, map, isRange) {
		    if (!map.model.enableRTL) {
		        xPos = this._drawLegendShape(colormapping, xPos, yPos, map, isRange);
		        this._drawLegendText(colormapping, xPos, yPos, map, isRange);
		    }
		    else {
		        xPos = this._drawLegendText(colormapping, xPos, yPos, map, isRange);
		        this._drawLegendShape(colormapping, xPos, yPos, map, isRange);
		    }
        },



      _generateLegends: function (map) {
            var colorMappings = this.shapeSettings.colorMappings;
            if (this.shapeSettings.colorPath != null || (colorMappings.rangeColorMapping != null) || (colorMappings.equalColorMapping != null)) {
                var xPos = 0;
                var yPos = 0;
                var legendSettings = this.legendSettings;
                var columnWidth = 0;
                var width = 0;
                var height = 0;
                var iconWidth = this.legendSettings.iconWidth + 5;
                var iconHeight = this.legendSettings.iconHeight + 5;
                var rowSpacing = this.legendSettings.rowSpacing;
                var columnSpacing = this.legendSettings.columnSpacing;
                var legendHeight = this.legendSettings.iconHeight + this.legendSettings.rowSpacing;
                var totalHeight = iconHeight + this.legendSettings.rowSpacing;
                var totalWidth = 0, text, titleText, totalwidth, totalheight;
                var leftLabel = map.model.enableRTL ? this.legendSettings.rightLabel : this.legendSettings.leftLabel;
                var rightLabel = map.model.enableRTL ? this.legendSettings.leftLabel : this.legendSettings.rightLabel;
                if ((this.legendSettings.showLegend == undefined || this.legendSettings.showLegend) && !this.shapeSettings.autoFill) {
                    $(map._mapContainer).append($('<div  id="labelTooltip" style="display:none;background-color:grey;padding-left:5px; padding-right:5px;position:absolute;z-index:1000;pointer-events:none;"/>'));
                    var baseLayer = this;
                    var xpos = 10;
                    var ypos = 0;

                    var totalHeight = this.iconHeight + this.legendSettings.rowSpacing;
                    var _legendheight = this.legendSettings.height;
                    var _legendwidth = this.legendSettings.width;
                    var legenddiv = $("<div/>");
                    if (baseLayer.legendSettings.dockOnMap) {
                        legenddiv = $(map._legendDiv);
                    }
                    else if (!baseLayer.legendSettings.dockOnMap && (baseLayer.legendSettings.mode != ej.datavisualization.Map.LegendMode.Interactive)) {
                        legenddiv = $(map._legendDiv);
                    }
                    else {
                        if (map._isSVG) {
                            legenddiv.appendTo(map._templateDiv);
                        }
                        else {
                            map._templateDiv.append(legenddiv);
                        }
                    }


                    if ((this.legendSettings.type == undefined || this.legendSettings.type == ej.datavisualization.Map.LegendType.Layers) && (this.shapeSettings.colorMappings != null || this.shapeSettings.colorPath != null)
                       && (this.legendSettings.mode == undefined || this.legendSettings.mode == ej.datavisualization.Map.LegendMode.Default || (this.legendSettings.mode == ej.datavisualization.Map.LegendMode.Interactive
                       && this.shapeSettings.colorMappings.equalColorMapping != null))) {

                        this._generateLegend(map);


                    } else if ((this.legendSettings.type == undefined || this.legendSettings.type == ej.datavisualization.Map.LegendType.Layers) && this.legendSettings.mode == ej.datavisualization.Map.LegendMode.Interactive && this.shapeSettings.colorMappings != null) {
                        var textcon = '';

                        if (this.legendSettings.height == 0)
                            _legendheight = 18;
                        if (this.legendSettings.width == 0)
                            _legendwidth = 150;

                        if (this.legendSettings.leftLabel == null)
                            this.legendSettings.leftLabel = '';
						if (this.legendSettings.rightLabel == null)
							this.legendSettings.rightLabel = '';
                        if (this.legendSettings.title != null) {
                            var titleObj = document.createElement("Label");
                            titleObj.innerHTML = this.legendSettings.title;
                            document.body.appendChild(titleObj);
                            var newxpos = xpos;
                            if (!this.legendSettings.showLabels)
                            newxpos = !map.model.enableRTL ? xpos + this.legendSettings.leftLabel.length * 10 : xpos + (_legendwidth - (titleObj.offsetWidth / 2));
                            document.body.removeChild(titleObj);
                            var _legendtitlewidth = this.legendSettings.title.length * 10;
                            text = titleText = this.legendSettings.title;

                            if (_legendtitlewidth > _legendwidth) {
                                for (var i = 1; i < titleText.toString().length; i++) {
                                    text = titleText.toString().substring(0, i - 1) + '...';
                                }
                            }
                            var textcon = this._createLabel(text, newxpos, ypos, 'e-interactivelegend-title');
                            textcon[0].title = titleText;
                            textcon.css({
                                "width": _legendwidth + "px"
                            });
                            if (map._isSVG)
                                textcon.appendTo(legenddiv);
                            else
                                legenddiv.append(textcon);
                            ypos += 25;
                        }

                        if (this.legendSettings.showLabels)
                            ypos += 25;

                        if (leftLabel != null && !this.legendSettings.showLabels) {
                            var textcon = this._createLabel(leftLabel, xpos, ypos - 3, 'e-interactivelegend-leftlabel');

                            if (map._isSVG)
                                textcon.appendTo(legenddiv);
                            else
                                legenddiv.append(textcon);
                            xpos = xpos + this.legendSettings.leftLabel.length * 10;
                        }

                        var interactiveElement = this._createInteractiveArrow(xpos, ypos + _legendheight);
                        interactiveElement.appendTo(legenddiv);
                        this._interactiveArrow = interactiveElement;

                        var _legendgroup = null;
                        if (!map._isSVG && this.shapeSettings.enableGradient) {
                            _legendgroup = map._createGroup(false, "legendGroup");
                            _legendgroup.style.left = 0 + 'px';
                            _legendgroup.style.top = 0 + 'px';
                            _legendgroup.style.position = "relative";
                            legenddiv.append(_legendgroup);
                        }
                        if (map.model.enableRTL) 
                            var mappings = colorMappings.rangeColorMapping.reverse();                            
                        else 
                           var mappings = colorMappings.rangeColorMapping;
                        
                        var mappings= colorMappings.rangeColorMapping;
                        for (var key = 0; key < mappings.length; key++) {
                            var colorMapping = mappings[key];
                            if (!colorMapping.hideLegend) {
                                var gradientCollection = [];
                                if (this.shapeSettings.enableGradient) {
                                    gradientCollection = colorMapping.gradientColors;
                                }

                                var obj = {};
                                if (this.shapeSettings.enableGradient) {
                                    if (map._isSVG) {
                                        var canvas = $("<canvas/>");
                                        var ctx = canvas[0].getContext("2d");
                                        var grd = ctx.createLinearGradient(0, 0, 300, 0);                                       
                                        for (var i = 0; i < gradientCollection.length; i++){ 
										   var colorValue = i/(gradientCollection.length-1);
                                           grd.addColorStop(colorValue, gradientCollection[i]);      
										}
                                        ctx.fillStyle = grd;
                                        ctx.fillRect(0, 0, 300, 300);
                                        canvas.css({
                                            "height": _legendheight + "px",
                                            "width": (_legendwidth / mappings.length) + "px",
                                            "margin-left": xpos + "px",
                                            "margin-top": ypos + "px",
                                            "opacity": "0.9",
                                            "filter": "alpha(opacity=90)", /* For IE8 and earlier */
                                            "position": "absolute"
                                        });
                                        canvas.appendTo(legenddiv);
                                    } else {
                                        var legendID = "legend" + key;
                                        var legendHtmlString = '<v:rect id=' + legendID + ' display="block" style="position:absolute;top: ' + (ypos - 2) + 'px;left:' + xpos + 'px;width:' + (_legendwidth / mappings.length) + 'px;height:' + _legendheight + 'px;"><v:fill opacity="0.9px" type="gradient" method="linear sigma" angle="270"/><v:stroke opacity="0px"/></v:rect>';
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
                                        "width": _legendwidth / this.shapeSettings.colorMappings.rangeColorMapping.length + "px",
                                        "background-color": colorMapping.color,
                                        "margin-left": xpos + "px",
                                        "margin-top": ypos + "px",
                                        "opacity": "0.9",
                                        "filter": "alpha(opacity=90)",/* For IE8 and earlier */
                                        "position": "absolute"
                                    });

                                    if (map._isSVG)
                                        rect.appendTo(legenddiv);
                                    else
                                        legenddiv.append(rect);
                                }

                                for (var i = 0; i < 10; i++) {
                                    obj = {};
                                    obj["marginLeft"] = xpos;
                                    this._legendRects.push(obj);
                                    xpos = xpos + (_legendwidth / mappings.length) / 10;
                                }
                                if (map.model.enableRTL && key == mappings.length - 2) {
                                    interactiveElement.css({ "margin-left": xpos + "px" });
                                }
                                if (this.legendSettings.showLabels) {
                                    var labelxpos = xpos - (_legendwidth / mappings.length);
                                    var labelypos = ypos - 25;
                                    var startlabel = this._createLabel((colorMapping.from), labelxpos, labelypos, 'e-legend-rangestartlabel');
                                    labelxpos = xpos;
                                    var endlabel = this._createLabel((colorMapping.to), labelxpos, labelypos);
                                    if (colorMapping.legendLabel != undefined)
                                        endlabel = this._createLabel((colorMapping.legendLabel), labelxpos - (colorMapping.legendLabel.length * 10) / 2, labelypos, 'e-legend-rangeendlabel');
                                    if (map._isSVG) {
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

                        if (rightLabel != null && !this.legendSettings.showLabels) {
                            var textcon = this._createLabel(rightLabel, xpos + 10, ypos - 3, 'e-interactivelegend-rightlabel');
                            if (map._isSVG)
                                textcon.appendTo(legenddiv);
                            else
                                legenddiv.append(textcon);
                            xpos = xpos + this.legendSettings.rightLabel.length * 10;
                        }

                        totalwidth = xpos + 10;
                        totalheight = ypos + _legendheight  + 10;
						map._legendSize = { width: totalwidth, height: totalheight };
						if (baseLayer.legendSettings.dockOnMap) {
						    if (this.legendSettings.dockPosition == 'left')
						        map._marginleft = totalwidth;
						    else if (this.legendSettings.dockPosition == 'top')
						        map._margintop = totalheight;
						    
						}
                    }

                    if (!baseLayer.legendSettings.dockOnMap && this.legendSettings.position == 'none') {
                        var posx = (map._width * this.legendSettings.positionX) / 100;
                        var posy = (map._height * this.legendSettings.positionY) / 100;
                        legenddiv.css({ "margin-left": posx + "px", "margin-top": posy + "px" });
                        
                    }
                    else if (!baseLayer.legendSettings.dockOnMap && (this.legendSettings.mode == ej.datavisualization.Map.LegendMode.Interactive)) {
                        var position = (this.legendSettings.position == undefined) ? "topleft" : this.legendSettings.position;
                        var controlSize = { width: totalwidth, height: totalheight };
                        var navPos = map._getPosition(position, controlSize);
                        legenddiv.css({ "margin-left": navPos.x + "px", "margin-top": navPos.y });

                    }
                }
                    

                   
                
            }
        },

      _generateLabels: function (map) {          
          
          var labeldiv = $("<div class='e-map-labelContainer'></div>");

          $(labeldiv).css({ "position": "absolute", "overflow": "scroll" });
                 
          for (var dataIndex = 0; dataIndex < this._polygonData.length; dataIndex++) {

              var ValueObject = this._polygonData[dataIndex].properties;
              var labelValue = map._reflection(ValueObject, this.labelSettings.labelPath);                          
              var labelElement = $("<div class='e-map-label'></div>");
              $(labelElement).css({ "margin-top":dataIndex*20, "position": "absolute" });
              labelElement[0].innerHTML = labelValue;
              labeldiv.append(labelElement);              
              map._mapContainer.append(labeldiv);              
              labelElement.mouseenter({ Param1: this, Param2: this._mapShapes[dataIndex], map: map }, map._polyEnterFunction);

              map._off($(labelElement), ej.eventType.mouseUp, map._polyClickFunction);              
              map._on($(labelElement), ej.eventType.mouseUp, { Param1: this._mapShapes[dataIndex], Param2: this, Param3: this._mapShapes[dataIndex].shape, param4: labelElement }, map._polyClickFunction);              

          }         

      },

        _calcWidth: function (text) {
            var span = $('<span  class="e-defaultLegendLabel">' + text + '</span>');
            $('body').append(span);
            var width = span.width()+5;
            span.remove();
            return width;
        },
       

		_generateBubbleLegends: function (map) {
		    if (this.legendSettings.showLegend == undefined || this.legendSettings.showLegend) {
			    var xpos = 10;
                var ypos = 10;
                var _bubblelegendheight = this.legendSettings.iconHeight;
                var _bubblelegendwidth = this.legendSettings.iconWidth;
                var bubblelegenddiv = $("<div/>");
                if (map._isSVG) {
                    bubblelegenddiv.appendTo(map._templateDiv);
                }
                else {
                    map._templateDiv.append(bubblelegenddiv);
                }
				var totalwidth = 0;
                var totalheight = 0;
                var isRange = true;
                var mappings = null;
                var iscolorPath = false;
                if (this.bubbleSettings.colorMappings != null) {
                    if (this.bubbleSettings.colorMappings.rangeColorMapping != undefined) {
                        mappings = this.bubbleSettings.colorMappings.rangeColorMapping;
                    } else if (this.bubbleSettings.colorMappings.equalColorMapping != undefined) {
                        mappings = this.bubbleSettings.colorMappings.equalColorMapping;
                        isRange = false;
                    }
                }
                else if (this.bubbleSettings.colorPath) {
                    mappings = this.dataSource;
                    isRange = false, iscolorPath = true;
                }
                if ((this.legendSettings.type == ej.datavisualization.Map.LegendType.Bubbles) && (this.bubbleSettings.colorMappings != null || this.bubbleSettings.colorPath)
                   && (this.legendSettings.mode == undefined || this.legendSettings.mode == ej.datavisualization.Map.LegendMode.Default || (this.legendSettings.mode == ej.datavisualization.Map.LegendMode.Interactive
                   && this.bubbleSettings.colorMappings.equalColorMapping != null))) {                    
				    if (this.legendSettings.iconHeight == undefined)				      
				    this.legendSettings.iconHeight = 20;
				    if (this.legendSettings.iconWidth == undefined)                    
				    this.legendSettings.iconWidth = 20;
                    for (var key = 0; key < mappings.length; key++) {
                        var legendsettings = $.extend(true, null, this.legendSettings);				        
                        var colorMapping = {
                            fill: mappings[key]._bubblecolor ? mappings[key]._bubblecolor : mappings[key].color ? mappings[key].color : mappings[key][this.bubbleSettings.colorPath],
                            legendLabel: mappings[key].legendLabel ? mappings[key].legendLabel : !isRange ? mappings[key][this.legendSettings.textPath] : mappings[key].from,
                            dataSource: mappings[key],
                            legendSettings: legendsettings
                        };
                        map._trigger("legendItemRendering", { model: map.model, data: colorMapping });
                        if (!colorMapping.hideLegend) {
                            var rect = $("<div class='e-mapBubbleLegend'/>");
                            if (!map.model.enableRTL) {
                                this._drawBubbleLegendIcon(colorMapping, xpos, ypos, rect);
                                var textcon = this._createLabel(colorMapping.legendLabel, xpos + colorMapping.legendSettings.iconWidth + 5, ypos, 'e-legendlabeltext');
                            } else {
                                xpos = 10;
                                var textcon = this._createLabel(colorMapping.legendLabel, xpos, ypos, 'e-legendlabeltext');
                                xpos += this._calcWidth(colorMapping.legendLabel);
                                this._drawBubbleLegendIcon(colorMapping, xpos, ypos, rect);
                            }
                            
							if (colorMapping.legendLabel != null) {
                                textcon[0].innerText= colorMapping.legendLabel;

                            } else {
							    colorMapping.legendLabel = textcon[0].innerText = isRange ? colorMapping.from : iscolorPath ? colorMapping[colorMapping.legendSettings.textPath] : colorMapping.value;
                            }
							if (map._isSVG) {
							    rect.appendTo(map._legendDiv);
							    textcon.appendTo(map._legendDiv);
                             }
                             else {
                                 bubblelegenddiv.append(rect);
                                 bubblelegenddiv.append(textcon);
							}
							if (totalwidth < (textcon[0].innerText.length * 10) + colorMapping.legendSettings.iconWidth)
							    totalwidth = (textcon[0].innerText.length * 10) + colorMapping.legendSettings.iconWidth;
                            var textHeight = textcon.height();
                            var rectHeight = rect.height();
                            if (textHeight > rectHeight) {
                                ypos += (textHeight + 5);
                            } else {
                                ypos += (rectHeight + 5);
                            }
						}
                    }
                    totalheight = ypos;
                }                
                map._legendDivHeight = totalheight;
                map._legendDivWidth = totalwidth;
                if (colorMapping.legendSettings.position == 'none') {
                    var posx = (map._width * colorMapping.legendSettings.positionX) / 100;
                    var posy = (map._height * colorMapping.legendSettings.positionY) / 100;
                    if (map._legendDiv)
                        map._legendDiv.css({ "left": posx + "px", "top": posy + "px" });
                } else {
				    var position = (this.legendSettings.position == undefined) ? "topleft" : this.legendSettings.position;
                    var controlSize = { width: totalwidth, height: totalheight };
                    var navPos = map._getPosition(position, map._legendSize);
                    if (map._legendDiv)
                        map._legendDiv.css({ "left": navPos.x + "px", "top": navPos.y + "px" });
                }
            }
				
		},
		_drawBubbleLegendIcon: function (colorMapping, xpos, ypos, rect) {
		    if (
                colorMapping.legendSettings.icon == ej.datavisualization.Map.LegendIcons.Circle) {
		        rect.css({
		            "height": colorMapping.legendSettings.iconHeight + "px",
		            "width": colorMapping.legendSettings.iconWidth + "px",
		            "border-radius": colorMapping.legendSettings.iconHeight / 2 + "px",
		            "background-color": colorMapping.fill,
		            "left": xpos + "px",
		            "top": ypos + "px",
		            "position": "absolute"
		        });
		    }
		    else {
		        rect.css({
		            "height": colorMapping.legendSettings.iconHeight + "px",
		            "width": colorMapping.legendSettings.iconWidth + "px",
		            "background-color": colorMapping.fill,
		            "left": xpos + "px",
		            "top": ypos + "px",
		            "position": "absolute"
		        });
		    }
		},
		
        _animateBubble: function (element, delayInterval, map) {
            var radius = { "fx": element.getAttribute("r") /2 },
                to = radius.fx * 2,
                scaleVal,
                $ele = $(element),
                layer = this;
            $(radius).delay(delayInterval).each(function () { }).animate(
                {
                    fx: to
                },
                {
                    duration: 700,

                    step: function (now) {
                        if (map._isSVG) {
                            $ele.attr("style", "display:block;pointer-events:stroke;");
                            $ele.attr("r", now);
                        }
                        else {
                        }
                    },
                    complete: function () {
                        layer._bubbleCount++;
                        if (layer._bubbleCount == layer._bubbles.length) {
                            layer._setMapElements();
                        }
                    }
                }

            );
        },
        
        _setMapElements: function () {
            for (var key = 0; key < this._mapItems.length; key++) {
                var item = this._mapItems[key];                
                $(item).css({ "display": "block" });
            }
        },

        _setMapItemsPositionWithAnimation: function (map) {
            this._bubbleCollection = [];
            for (var key = 0; key < this._bubbles.length; key++) {
                var bubble = this._bubbles[key];
                var bubblerad = this._bubbles[key].getAttribute('r');
                var position = this._bounds[key];               
                var xpos = ((position.x + map._translatePoint.x) * map._scale);
                var ypos = ((position.y + map._translatePoint.y) * map._scale);

                var finalPosition = map.validateBubblePosition(position.points, { x: xpos, y: ypos }, bubblerad);

                var ubound = 20;
                var lbound = 0;
                var randomValue = Math.floor(Math.random() * (ubound - lbound) + lbound);
                var delayInterval = parseInt(randomValue * 50);
                if (map._isSVG) {
                    $(bubble).attr({ "cx": finalPosition.x, "cy": finalPosition.y });
                }
                this._animateBubble(bubble, delayInterval, map);
                this._bubbleCollection.push(bubble);
            }
            for (var key = 0; key < this._mapMarkers.length; key++) {
                var item = this._mapMarkers[key];
                var marker;
                if (this.markers.length > 0) {
                    marker = this.markers[key];
                }                
                var position;
                if (map._isTileMap) {
                    position = map._convertTileLatLongtoPoint(marker.latitude != null ? marker.latitude : marker.Latitude, marker.longitude != null ? marker.longitude : marker.Longitude);
                }
                else {
                    position = map._convertLatLongtoPointforMarker(marker.latitude != null ? marker.latitude : marker.Latitude, marker.longitude != null ? marker.longitude : marker.Longitude);
                }

                if (this._isSVG) {
                    var xpos = position.x;
                }
                else {
                    var xpos = ((position.x + map._transformX) * map._scale);
                }
                var ypos = position.y;
                $(item).css({ "display":"block","left": xpos, "top": ypos - 100 });
                $(item).delay(500).each(function () { }).animate({ "top": ypos }, 500);
               
            }
            for (var key = 0; key < this._mapItems.length; key++) {
                var item = this._mapItems[key];
                var position = this._bounds[key];
                var box = item[0].getBoundingClientRect();               
                var cx = this._bubbleCollection[key] ?parseFloat(this._bubbleCollection[key].getAttribute("cx")) :0;
			    var cy =this._bubbleCollection[key] ? parseFloat(this._bubbleCollection[key].getAttribute("cy")):0;
			    var xpos = this._bubbleCollection[key] ? (cx - box.width / 2) : ((position.x + map._translatePoint.x) * map._scale) - (box.width / 2);
			    var ypos = this._bubbleCollection[key] ? (cy - box.height / 4) : ((position.y + map._translatePoint.y) * map._scale) - (box.height / 4);
                if(this._bubbles.length > 0)
				    $(item).css({ "left": xpos, "top": ypos, "display": "none" });
				else
                   $(item).css({ "left": xpos, "top": ypos, "display": "block" });
               
            }
            for (var key = 0; key < this._labelCollection.length; key++) {
                var item = this._labelCollection[key];
                var position = this._labelBounds[key];
                $(item).css("display", "block");
                var box = item[0].getBoundingClientRect();
                var boxwidth =map._isSVG?box.width: box.right - box.left;
                var boxheight=map._isSVG?box.height: box.bottom - box.top;
                var xpos = ((position.x + map._translatePoint.x) * map._scale) - (boxwidth / 2);
                var ypos = ((position.y + map._translatePoint.y) * map._scale) - (boxheight / 2);
                if (item[0].className = "e-smartLabelStyle") {                    
                    item[0].className = "e-labelStyle"; 
                     $(item[0]).css({ "pointer-events": "none", "position": "absolute" });                   
                }
                item[0].innerHTML = this._labelData[key];
                $(item).css({ "left": xpos, "top": ypos });

            }
            if (this.labelSettings!=null && this.labelSettings.showLabels) {
                this._validateSmartLabel(map);
            }
        },

        _resizeShapes: function (map) {
            var thickness = this.shapeSettings.strokeThickness / map._scale;
            if (this._mapShapes != undefined) {
            for (var i = 0; i < this._mapShapes.length; i++) {
                var element = this._mapShapes[i].shape;
                if (map._isSVG) {
                    if (element.localName == 'circle') {
                        element.setAttribute("r", this.shapeSettings.radius / map._scale);
                    } else {
                        if (this._contains(this._prevSelectedShapes,element)) {
                            element.setAttribute("stroke-width", this.shapeSettings.selectionStrokeWidth / map._scale);
                        } else {
                            element.setAttribute("stroke-width", thickness);
                        }
                    }
                } else {
                    if (element.nodeName == 'oval') {

                    } else {
                        if (this._contains(this._prevSelectedShapes,element)) {
                            element.strokeweight = this.shapeSettings.selectionStrokeWidth / map._scale;
                        } else {
                            element.strokeweight = thickness;
                        }
                    }
                }
            }
          }
        },
       
       _setMapItemsPosition: function(map) {
            this._bubbleCollection = [];
			
			if(this._bubbles!=undefined)
			{
            for (var key = 0; key < this._bubbles.length; key++) {
                var bubble = this._bubbles[key];
                var bubblerad = this._bubbles[key].getAttribute('r');
                var position = this._bounds[key];
                if (map._isSVG) {
                    var xpos = ((position.x + map._translatePoint.x) * map._scale);
                    var ypos = ((position.y + map._translatePoint.y) * map._scale);

                    var finalPosition = map.validateBubblePosition(position.points, { x: xpos, y: ypos }, bubblerad);

                    $(bubble).attr({ "cx": finalPosition.x, "cy": finalPosition.y });
                }
                else {
                    bubble = document.getElementById(bubble.id);
                    var xpos = ((position.x + map._translatePoint.x) * map._scale);
                    var ypos = ((position.y + map._translatePoint.y) * map._scale);

                    var finalPosition = map.validateBubblePosition(position.points, { x: xpos, y: ypos }, bubblerad);

                    var bubbleTop = finalPosition.y - (bubble.getBoundingClientRect().bottom - bubble.getBoundingClientRect().top) / 2;
                    var bubbleLeft = finalPosition.x - (bubble.getBoundingClientRect().right - bubble.getBoundingClientRect().left) / 2;
                    
                    $(bubble).css({
                        "left": bubbleLeft,
                        "top": bubbleTop
                    });
                }
                this._bubbleCollection.push(bubble);
            }
			}
			if(this._mapItems!=undefined)
			{
            for (var key = 0; key < this._mapItems.length; key++) {
                var item = this._mapItems[key];
                var position = this._bounds[key];
                $(item).css({"display":"block"});
                var box = item[0].getBoundingClientRect();
                var boxwidth = map._isSVG ? box.width : box.right - box.left;
                var boxheight = map._isSVG ? box.height : box.bottom - box.top;
			    var cx = this._bubbleCollection[key] ?parseFloat(this._bubbleCollection[key].getAttribute("cx")) :0;
			    var cy =this._bubbleCollection[key] ? parseFloat(this._bubbleCollection[key].getAttribute("cy")):0;
			    var xpos = this._bubbleCollection[key] ? (cx - box.width / 2) : ((position.x + map._translatePoint.x) * map._scale) - (box.width / 2);
			    var ypos = this._bubbleCollection[key] ? (cy - box.height / 4) : ((position.y + map._translatePoint.y) * map._scale) - (box.height / 4);
                $(item).css({ "left": xpos, "top": ypos });               
            }
			}
            if(this._mapMarkers!=undefined){
            for (var key = 0; key < this._mapMarkers.length; key++) {
                var item = this._mapMarkers[key];

                var marker;
                if (this.markers.length > 0) {
                    marker = this.markers[key];
                }               
                var position;
                if (map._isTileMap) {
                    position = map._convertTileLatLongtoPoint(marker.latitude != null ? marker.latitude : marker.Latitude, marker.longitude != null ? marker.longitude : marker.Longitude);
                }
                else {
                    position = map._convertLatLongtoPointforMarker(marker.latitude != null ? marker.latitude : marker.Latitude, marker.longitude != null ? marker.longitude : marker.Longitude);
                }            
                var xpos = position.x;               
                var ypos = position.y;            
                $(item).css({ "left": xpos, "top": ypos });                
            }
			}
			if(this._labelCollection!=undefined){
            for (var key = 0; key < this._labelCollection.length; key++) {
                var item = this._labelCollection[key];
                var position = this._labelBounds[key];
                $(item).css("display", "block");
                var box = item[0].getBoundingClientRect();
                var boxwidth = map._isSVG ? box.width : box.right - box.left;
                var boxheight = map._isSVG ? box.height : box.bottom - box.top;
                var xpos = ((position.x + map._translatePoint.x) * map._scale) - (boxwidth / 2);
                var ypos = ((position.y + map._translatePoint.y) * map._scale) - (boxheight / 2);
                if (item[0].className = "e-smartLabelStyle") {                    
                    item[0].className = "e-labelStyle";
                    $(item[0]).css("background-color", "transparent");
                    $(item[0]).css({ "pointer-events": "none", "position": "absolute" });
                }
                item[0].innerHTML = this._labelData[key];
                $(item).css({ "left": xpos, "top": ypos});
               
            }
			}
            if (this.labelSettings != null && this.labelSettings.showLabels) {
                this._validateSmartLabel(map);
            }
        },
       
        _validateSmartLabel: function (map) {
            this._smartLabels = [];
            var filledRects = [];
            if (this._labelCollection.length > 0) {
                for (var index = 0; index < this._mapShapes.length; index++) {
                    var shapemidPoint = this._labelBounds[index];
                    var midPoint = { x: (shapemidPoint.x + map._translatePoint.x) * map._scale, y: (shapemidPoint.y + map._translatePoint.y) * map._scale };

                    var rightMinPoint = { x: (shapemidPoint.rightMin.x + map._translatePoint.x) * map._scale, y: (shapemidPoint.rightMin.y + map._translatePoint.y) * map._scale };
                    var rightMaxPoint = { x: (shapemidPoint.rightMax.x + map._translatePoint.x) * map._scale, y: (shapemidPoint.rightMax.y + map._translatePoint.y) * map._scale };
                    var leftMinPoint = { x: (shapemidPoint.leftMin.x + map._translatePoint.x) * map._scale, y: (shapemidPoint.leftMin.y + map._translatePoint.y) * map._scale };
                    var leftMaxPoint = { x: (shapemidPoint.leftMax.x + map._translatePoint.x) * map._scale, y: (shapemidPoint.leftMax.y + map._translatePoint.y) * map._scale };

                    var labelElement = this._labelCollection[index];
                    if (midPoint.x > 0 && midPoint.x < map._width && midPoint.y > 0 && midPoint.y < map._height) {
                        var shape = this._mapShapes[index].shape;
                        var bounds = shape.getBoundingClientRect();                        
                        var flag = false;
                        var labelSize = labelElement[0].getBoundingClientRect();
                        var labelHeight = labelSize.height;
                        var labelWidth = labelSize.width;
                        if (!map._isSVG) {
                            bounds = { width: (bounds.right*map._scale) - (bounds.left*map._scale), height: (bounds.bottom *map._scale)- (bounds.top*map._scale) };
                            labelHeight = labelSize.bottom - labelSize.top;
                            labelWidth = labelSize.right - labelSize.left;
                        }

                        var rightIntersect = false, leftIntersect = false;
                        if ((labelWidth / 2 > rightMinPoint.x - midPoint.x || labelWidth / 2 > rightMaxPoint.x - midPoint.x)
                            && (labelHeight / 2 > midPoint.y - rightMinPoint.y || labelHeight / 2 > rightMaxPoint.y - midPoint.y)) {
                            rightIntersect = true;
                        }
                        else if ((labelWidth / 2 > midPoint.x - leftMinPoint.x || labelWidth / 2 > midPoint.x - leftMaxPoint.x)
                            && (labelHeight / 2 > midPoint.y - leftMinPoint.y || labelHeight / 2 > leftMaxPoint.y - midPoint.y)) {
                            leftIntersect = true;
                        }
                        
                        var leftPosition = 0;
                        var topPosition = 0;
                        var factor = 20;
                        var xArray = [];
                        var yArray = [];
                        if (labelHeight > bounds.height || labelWidth > bounds.width || (rightIntersect || leftIntersect)) {
                            
                            if (this.labelSettings.enableSmartLabel) {
                                if (this.labelSettings.smartLabelSize == ej.datavisualization.Map.LabelSize.Fixed) {
                                    labelHeight = 25;
                                    labelWidth = 15 * this.labelSettings.labelLength;
                                }
                                else {                                    
                                    labelWidth *= 1.3;
                                    labelHeight = 25;
                                }
                                while (!flag) {
                                    if (factor > 400) {
                                        flag = true;
                                    }
                                    xArray = pushToArray(factor);
                                    yArray = xArray;
                                    for (var xIndex = 0; xIndex < xArray.length; xIndex++) {
                                        for (var yIndex = 0; yIndex < xArray.length; yIndex++) {
                                            leftPosition = yArray[yIndex];
                                            topPosition = xArray[xIndex];                                           
                                            if (midPoint.x + leftPosition + labelWidth > map._width && midPoint.x < map._width) {
                                                leftPosition -=(midPoint.x + leftPosition + labelWidth)- map._width;
                                            }
                                            if (midPoint.x + leftPosition <0) {
                                                leftPosition =0;
                                            }
                                            if (midPoint.y + topPosition  <0) {
                                                topPosition=0;
                                            }
                                            if (midPoint.y + topPosition + labelHeight > map._height && midPoint.y < map._height) {
                                                topPosition -= (midPoint.y + topPosition + labelHeight) - map._height;
                                            }
                                            var rect = { left: midPoint.x + leftPosition, top: midPoint.y + topPosition, height: labelHeight, width: labelWidth };
                                            if (isEmpty(rect)) {
                                                var ele = map._getIntersectedElements(rect, this._mapShapes);
                                                if (ele != null && ele.length == 0) {
                                                    flag = true;                                                   
                                                    xIndex = xArray.length;
                                                    yIndex = xArray.length;
                                                    labelElement[0].className = 'e-smartLabelStyle';
                                                    $(labelElement).css({ "pointer-events": "stroke", "position": "absolute" });

                                                    if (this.labelSettings.smartLabelSize == ej.datavisualization.Map.LabelSize.Fixed) {
                                                        labelElement[0].innerHTML = labelElement[0].innerHTML.substring(0, this.labelSettings.labelLength);
                                                    }
                                                    labelElement.mouseenter({ Param1: this, Param2: this._mapShapes[index],map:map }, map._polyEnterFunction);
                                                    labelElement.mousemove({ Param1: this, Param2: this._mapShapes[index] }, map._polyMoveFunction);
                                                    $(labelElement).css({ left: midPoint.x + leftPosition, top: midPoint.y + topPosition, "background-color": map._isSVG ? shape.getAttribute("fill") : shape.fillcolor.value});
                                                    filledRects.push(rect);
                                                    var labelObj = {};
                                                    labelObj["shape"] = shape;
                                                    labelObj["legend"] = labelElement;
                                                    this._smartLabels.push(labelObj);
                                                }
                                            }
                                        }
                                    }
                                    factor += 10;
                                }
                            } else {
                                var canExecute = true;
                                var minY = 0;
                                var maxY = 0;
                                var flag = true;

                                // Finding Minimum and Maximum Y position point calculation
                                for (var j = 0; j < shapemidPoint.points.length; j++) {
                                    var point = { x: (shapemidPoint.points[j].x + map._translatePoint.x) * map._scale, y: (shapemidPoint.points[j].y + map._translatePoint.y) * map._scale };
                                    if (flag) {
                                        minY = point.y;
                                        maxY = point.y;
                                        flag = false;
                                    }
                                    else {
                                        minY = Math.min(minY, point.y);
                                        maxY = Math.max(maxY, point.y);
                                    }
                                }

                                var heightfactor = Math.floor((maxY - minY) / labelHeight);
                                var shapePoints = [];

                                // Grouping points based on label height
                                for (var k = 0; k < heightfactor; k++) {
                                    var groupPoints = [];
                                    shapePoints.push(groupPoints);
                                }

                                for (var j = 0; j < shapemidPoint.points.length; j++) {
                                    var point = { x: (shapemidPoint.points[j].x + map._translatePoint.x) * map._scale, y: (shapemidPoint.points[j].y + map._translatePoint.y) * map._scale };
                                    var positionfactor = Math.floor((point.y - minY) / labelHeight);
                                    if (positionfactor > 0)
                                        positionfactor -= 1;
                                    var groupPoints = shapePoints[positionfactor];
                                    if (groupPoints == undefined)
                                        groupPoints = [];
                                    groupPoints.push({ x: point.x, y: point.y });
                                    shapePoints[positionfactor] = groupPoints;
                                }

                                // Finding minimum and maximum x point calculation 
                                for (var j = 0; j < shapePoints.length; j++) {
                                    var groupPoints = shapePoints[j];
                                    flag = true;
                                    var minX =0, maxX =0, top = 0;
                                    var leftPoints = [], rightPoints = [];
                                    
                                    for (var k = 0; k < groupPoints.length; k++) {
                                        if (flag) {
                                            minX = groupPoints[k].x;
                                            maxX = groupPoints[k].x;
                                            top = groupPoints[k].y;
                                            flag = false;
                                        }
                                        else {
                                            minX = Math.min(minX, groupPoints[k].x);
                                            maxX = Math.max(maxX, groupPoints[k].x);
                                            if (groupPoints[k].x == maxX)
                                                top = groupPoints[k].y;
                                        }
                                        if (groupPoints[k].x < midPoint.x)
                                            leftPoints.push(groupPoints[k].x);
                                        if (groupPoints[k].x > midPoint.x)
                                            rightPoints.push(groupPoints[k].x);
                                    }

                                    if (bounds.left < map._mapContainer[0].getBoundingClientRect().left + 1) {
                                        minX = map._mapContainer[0].getBoundingClientRect().left + 1 - bounds.left;
                                        leftPoints.push(minX);
                                    }

                                    //  Checking intersection of points with label.
                                    var intersect = false;
                                    for (var k = 0; k < leftPoints.length; k++) {
                                        if (maxX - leftPoints[k] < labelWidth + 1) {
                                            intersect = true;
                                            break;
                                        }
                                    }
                                    if (!intersect) {
                                        for (var k = 0; k < rightPoints.length; k++) {
                                            if (rightPoints[k] - minX < labelWidth + 1) {
                                                intersect = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (maxX - minX > labelWidth + 1 && !intersect) {
                                        labelElement.css("left", bounds.left * map._scale + (minX - bounds.left * map._scale) + (maxX - minX) / 2 - labelWidth / 2 + "px");
                                        labelElement.css("top", top + "px");
                                        if (maxY - top < labelHeight)
                                            labelElement.css("top", top - labelHeight + "px");
                                        canExecute = false;
                                        break;
                                    }
                                }
                                if(canExecute)
                                    labelElement.css("display", "none");
                            }
                        }
                    } 
                }
            }

            function pushToArray(value) {
                var array = [];
                array.push(0);
                for (var j = 10; j <= value; j += 20) {
                    array.push(-j);
                    array.push(j);
                }

                return array;
            }

            function isEmpty(rect) {
                for (var i = 0; i < filledRects.length; i++) {
                    if (isIntersect(rect, filledRects[i]))
                        return false;
                }
                return true;
            }
           
            function isIntersect(rect1, rect2) {
                
                if (rect1.left - 2 >= (rect2.left + rect2.width) || rect1.left - 2 + rect1.width <= rect2.left - 2 ||
                    rect1.top - 2 >= rect2.top + rect2.height || rect1.top+rect1.height <= rect2.top-2) {
                    return false;
                }
                return true;
            }


        },
              
        _fillColors: function (value, colorMapping, shape, mapObject, item, shapePropertyData, isBubble) {

            if (colorMapping != null && colorMapping.rangeColorMapping != null) {

                this._fillRangeColors(value, colorMapping.rangeColorMapping, shape, mapObject, isBubble, item, shapePropertyData);
            }
            else if (colorMapping != null && colorMapping.equalColorMapping != null) {
                this._fillEqualColors(value, colorMapping, shape, mapObject, shapePropertyData, isBubble, item);
            }
            else if (this.shapeSettings.colorPath != null)
                this._fillIndividualColors(item, shape, this.shapeSettings, mapObject, isBubble, shapePropertyData);
        },

        _fillIndividualColors: function (item, shape, shapeSettings, map, isBubble, shapePropertyData) {
            var eventArgs = { fill: item[shapeSettings.colorPath], stroke: shapeSettings.stroke, strokeThickness: shapeSettings.strokeThickness, shapeData: item, shapeProperties: shapePropertyData };
            map._trigger("shapeRendering", { model: map.model, data: eventArgs });
            if (eventArgs.fill != item[shapeSettings.colorPath] || eventArgs.fill == null) {
                eventArgs.fill = eventArgs.fill == null ? shapePropertyData[shapeSettings.colorPath] ? shapePropertyData[shapeSettings.colorPath] : shapeSettings.fill : eventArgs.fill;
                item._color = eventArgs.fill;
            }
            if (map._isSVG) {
                shape.setAttribute('fill', eventArgs.fill);
                shape.setAttribute('stroke', eventArgs.stroke);
                shape.setAttribute('stroke-width', eventArgs.strokeThickness);
            }
            else {
                shape.fillcolor = eventArgs.fill;
                shape.strokecolor = eventArgs.stroke;
                shape.strokeweight = eventArgs.strokeThickness;
            }
            shape.highlightcolor = shape.highlightcolor;
        },
        _fillEqualColors: function (value, colorMapping, shape, mapObject, shapePropertyData, isBubble, item) {
            var layer = this, eventArgs;
            $.each(colorMapping.equalColorMapping, function (index, gValue) {
                if (gValue.value == value) {
                    eventArgs = { fill: gValue.color, stroke: layer.shapeSettings.stroke, strokeThickness: layer.shapeSettings.strokeThickness, shapeData: item, shapeProperties: shapePropertyData };
                    if (!isBubble)
                        mapObject._trigger("shapeRendering", { model: mapObject.model, data: eventArgs });
                    else
                        mapObject._trigger("bubbleRendering", { model: mapObject.model, data: eventArgs });
                    if (eventArgs.fill != gValue.color)
                        gValue._color = eventArgs.fill;
                    if (mapObject._isSVG) {
                        shape.setAttribute("fill", eventArgs.fill);
                        shape.setAttribute('stroke', eventArgs.stroke);
                        shape.setAttribute('stroke-width', eventArgs.strokeThickness);
                    }
                    else {
                        shape.fillcolor = eventArgs.color;
                        shape.strokecolor = eventArgs.stroke;
                        shape.strokeweight = eventArgs.strokeThickness;
                    }
					 shape.highlightcolor = gValue.highlightcolor;
                }
            });
        },
       
        _updateLegendRange: function (value, shapelayer, shape) {
            var colormapping = shapelayer.shapeSettings.colorMappings.rangeColorMapping, mapIdName, colorGradName;
            for (var index = 0; index < colormapping.length; index++) {
                var gradientCollection = null;
                var mapping = colormapping[index];
                if (shapelayer.shapeSettings.enableGradient) {
                    mapIdName = document.getElementById("rootGroup");
					colorGradName = shapelayer._createGradientElement(mapIdName,mapping.gradientColors,0,0,100,0,shapelayer,index);
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
                            if (shapelayer._legendRects[i] != undefined)
                                obj = shapelayer._legendRects[i];
                            if (shapelayer.shapeSettings.enableGradient) {                                
                                obj["color"] = colorGradName;                                
                            } else
                                obj["color"] = mapping.color;
                                $(shape).css({ "opacity": shapeOpacity });
                            return obj;
                        }
                        minRange = maxRange;
                        maxRange = maxRange + ((mapping.to - mapping.from) / 10);
                    }
                }
            }
        },

        _fillRangeColors: function (value, colormapping, shape, mapObject, isBubble, item, shapePropertyData) {
            var eventArgs;
            for (var index = 0; index < colormapping.length; index++) {
                var mapping = colormapping[index];
				 
				if (this.bubbleSettings.enableGradient) {
                    mapIdName = document.getElementById('svgDocument');					
					colorGradName = this._createGradientElement(mapIdName,colormapping[index].gradientColors,0,0,100,0,this,index);
					mapping.color = colorGradName;					
                }
				
                if (value >= mapping.from && value <= mapping.to) {
                    var shapeOpacity = this._getColorRatio(0.7, 1, value, mapping.from, mapping.to);
                    eventArgs = { from: mapping.from, to: mapping.to, fill: mapping.color, value: value, bubbleOpacity: this.bubbleSettings.bubbleOpacity ,shapeData: item, shapeProperty: shapePropertyData };
                    if (!isBubble) {
                        mapObject._trigger("shapeRendering", { model: mapObject.model, data: eventArgs });
                    }
                    else
                        mapObject._trigger("bubbleRendering", { model: mapObject.model, data: eventArgs });
                    if (mapObject._isSVG) {
                        shape.setAttribute('fill', eventArgs.fill);
                        shape.setAttribute('opacity', eventArgs.bubbleOpacity);
                    }
                    else {
                        shape.fillcolor = eventArgs.fill;
                    }
					shape.highlightcolor = mapping.highlightcolor;
                    $(shape).css({ "opacity": shapeOpacity });
                }
            }
        },
       
        _getColorRatio: function (min, max, value, minValue, maxValue) {
            var percent = (100 / (maxValue - minValue)) * (value - minValue);
            var colorCode = (((parseFloat(max) - parseFloat(min)) / 100) * percent) + parseFloat(min);
            return colorCode;
        }

    };

    $.fn.pinchZoom = function (rootgroup, map) {

        var stateOrigin,
                    stateTf,
                    root = this[0],
                    startTouches = [],

           getTouchEventPoint = function (evt) {

               var p = root.createSVGPoint(),
                   targetTouches = evt.targetTouches,
                   offsetX,
                   offsetY;

               if (targetTouches.length) {
                   var touch = targetTouches[0];
                   offsetX = touch.pageX;
                   offsetY = touch.pageY;
               }

               p.x = offsetX;
               p.y = offsetY;

               return p;
           },

        handleTouchStart = function (evt) {
            var g = rootgroup;
            stateTf = g.getCTM().inverse();
            stateOrigin = getTouchEventPoint(evt).matrixTransform(stateTf);
            var touches = evt.touches;
            if (touches.length >= 2) {
                evt.preventDefault();
                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i]
                      , found = false;
                    for (var j = 0; j < startTouches.length; j++) {
                        var startTouch = startTouches[j];
                        if (touch.identifier === startTouch.identifier) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        var touchCopy = $.extend({}, touch);
                        startTouches.push(touchCopy);
                    }
                }
            }
        },

        getDistance = function (touch1, touch2) {
            var x = touch2.pageX - touch1.pageX,
                y = touch2.pageY - touch1.pageY;
            return Math.sqrt((x * x) + (y * y));
        },

        setCTM = function (element, matrix) {
		    var isZoomIn=null;
            var s = "matrix(" + matrix.a + "," + matrix.b + "," + matrix.c + "," + matrix.d + "," + matrix.e + "," + matrix.f + ")";
            if (matrix.a > map._baseScale && map.model.zoomSettings.enableZoom && map.enablePan()) {
			if(matrix.a > map._scale)
			{
			     isZoomIn=true;
			}
			else if(matrix.a < map._scale)
			{
			isZoomIn=false;
			}
			    map._scale = matrix.a;
			    map._translatePoint.x = matrix.e / matrix.a;
			    map._translatePoint.y = matrix.f / matrix.a;
			    map._applyTransform(map._scale, map._translatePoint);
			    map.model.zoomSettings.level = map._scale - map._baseScale + 1;
			    map._zoomLevel(map._scale - map._baseScale + 1);
	    		if (isZoomIn != null && isZoomIn) {
	    		    map._trigger("zoomedIn", { originalEvent: null, zoomLevel: map._zoomLevel() });
				    map._updateSliderValue(false);
					map._resizeShape();
				}
				else if(isZoomIn!=null)
				{
				    map._trigger("zoomedOut", { originalEvent: null, zoomLevel: map._zoomLevel() });
				    map._updateSliderValue(false);
					map._resizeShape();
				}
	    		map._isDragging = true;
                map._refrshLayers();
            }

        },

        handleTouchEnd = function (evt) {
            var changedTouches = evt.changedTouches;
            for (var i = 0; i < changedTouches.length; i++) {
                var changedTouch = changedTouches[i];
                for (var j = 0; j < startTouches.length; j++) {
                    var startTouch = startTouches[j];
                    if (startTouch.identifier === changedTouch.identifier) {
                        var idx = startTouches.indexOf(startTouch);
                        startTouches.splice(idx, 1);
                    }
                }
            }

            //evt.preventDefault();
        },

        updateTouch = function (dstTouch, srcTouch) {
            dstTouch.pageX = srcTouch.pageX;
            dstTouch.pageY = srcTouch.pageY;
        },

        handleTouchMove = function (evt) {
            var g = rootgroup,
                touches = evt.touches,
                z,
                p,
                k;

            if (touches.length >= 2) {
                evt.preventDefault();
                var touch0 = touches[0]
                  , touch1 = touches[1]
                  , startTouch0 = startTouches[0]
                  , startTouch1 = startTouches[1];
                z = getDistance(touch0, touch1) / getDistance(startTouch0, startTouch1);
                p = root.createSVGPoint();
                p.x = (touch0.pageX + touch1.pageX) / 2;
                p.y = (touch0.pageY + touch1.pageY) / 2;
                p = p.matrixTransform(g.getCTM().inverse());
                k = root.createSVGMatrix().translate(p.x, p.y).scale(z).translate(-p.x, -p.y);
                setCTM(g, g.getCTM().multiply(k));
                if (typeof stateTf === "undefined") {
                    stateTf = g.getCTM().inverse();
                }
                stateTf = stateTf.multiply(k.inverse());
                updateTouch(startTouch0, touch0);
                updateTouch(startTouch1, touch1);
            } else if (!startTouches.length) {
                p = getTouchEventPoint(evt).matrixTransform(stateTf);
                setCTM(g, stateTf.inverse().translate(p.x - stateOrigin.x, p.y - stateOrigin.y));
            }
        };
        this[0].addEventListener('touchstart', handleTouchStart, false);
        this[0].addEventListener('touchend', handleTouchEnd, false);
        this[0].addEventListener('touchmove', handleTouchMove, false);


    };

    jQuery.uaMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
            [];

        return {
            browser: match[1] || "",
            version: match[2] || "0"
        };
    };
    
	ej.datavisualization.Map.Locale = ej.datavisualization.Map.Locale || {};
    ej.datavisualization.Map.Locale['default'] = ej.datavisualization.Map.Locale['en-US'] = {
        zoomIn: "Zoom In",
        zoomOut: "Zoom Out",
        panTop: "Pan Top",
        panBottom: "Pan Bottom",
        panLeft: "Pan Left",
		panRight: "Pan Right",
		home: "Home"
    };
	
    ej.datavisualization.Map.LayerType = {
        Geometry: "geometry",
        OSM: "osm",
        Bing: "bing"
    };
   
    ej.datavisualization.Map.LegendIcons = {       
        Rectangle: "rectangle",      
        Circle: "circle"
    };
   
    ej.datavisualization.Map.LabelSize = {       
        Fixed: "fixed",        
        Default: "default"
    };

    ej.datavisualization.Map.LegendMode = {       
        Default: "default",       
        Interactive: "interactive"		
    };

    ej.datavisualization.Map.BingMapType = {    
        Aerial: "aerial",    
        AerialWithLabel: "aerialwithlabel",    
        Road: "road",
    };

    ej.datavisualization.Map.GeometryType = {
        Normal: "normal",    
        Geographic: "geographic"
        
    };

    ej.datavisualization.Map.SelectionMode = {       
        Default: "default",       
        Multiple: "multiple"
    };

    ej.datavisualization.Map.ColorPalette = {        
        Palette1: "palette1", 
        Palette2: "palette2", 
        Palette3: "palette3", 
        CustomPalette: "custompalette"
    };
   
    ej.datavisualization.Map.LegendType = {
        Layers: "layers",
        Bubbles: "bubbles"
    }
 
    ej.datavisualization.Map.Position = {
        None: "none",
        TopLeft: "topleft",
        TopCenter: "topcenter",
        TopRight: "topright",
        CenterLeft: "centerleft",
        Center: "center",
        CenterRight: "centerright",
        BottomLeft: "bottomleft",
        BottomCenter: "bottomcenter",
        BottomRight: "bottomright"
    }
    
    ej.datavisualization.Map.DockPosition = {    
        Top: "top",	
        Bottom: "bottom",    
        Right: "right",    
        Left: "left"
    };
	 ej.datavisualization.Map.Alignment = {
        
        Near: "near",       
        Center: "center",       
        Far: "far"
    };
    
    ej.datavisualization.Map.LabelOrientation = {	
        Horizontal: "horizontal",	
        Vertical: "vertical"
    };
    
})(jQuery, Syncfusion);
