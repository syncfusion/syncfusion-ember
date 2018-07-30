/**
* @fileOverview Plugin to style the Html Button elements
* @copyright Copyright Syncfusion Inc. 2001 - 2013. All rights reserved.s
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {
  
    ej.widget("ejBulletGraph", "ej.datavisualization.BulletGraph",    {
    
        element: null,

        model: null,
        validTags: ["div"],
    
        _tags: [{
            tag: 'qualitativeRanges',
            attr: ['rangeEnd', 'rangeStroke', 'rangeOpacity']
        },
        {
            tag: 'quantitativeScaleSettings.featureMeasures',
            attr: ['value', 'comparativeMeasureValue']
        }],
    
        defaults:   {
              
            locale: null,
			
			enableGroupSeparator: false,
			
			value: 0,
              
            comparativeMeasureValue: 0,
              
            width: null,
              
            height: null,
              
            theme: "flatlight",
              
            orientation: "horizontal",
              
            flowDirection: "forward",
              
            qualitativeRangeSize: 32,
              
            quantitativeScaleLength: 475,
              
            tooltipSettings:   {
                  
                  
                enableCaptionTooltip: false,
                  
                captionTemplate: null,
                  
                visible: true,
                  
                template: null
            },
              
            quantitativeScaleSettings:    {
                  
                location: {
                      
                    x: 10,
                      
                    y: 10
                },
                  
                minimum: 0,
                  
                maximum: 10,
                  
                interval: 1,
                  
                minorTicksPerInterval: 4,
                  
                majorTickSettings: {
                      
                    size: 13,
                      
                    stroke: null,
                      
                    width: 2
                },
                  
                minorTickSettings: {
                      
					size: 7,
                 
                    stroke: null,
                      
                    width: 2
                },
                  
                tickPosition: "far",
                  
                tickPlacement: "outside",
                  
                labelSettings: {
                      
                    labelPlacement: "outside",
                      
                    labelPrefix: "",
                      
                    labelSuffix: "",
                      
                    stroke: null,
                      
                    size: 12,
                      
                    offset: 15,
                      
                    font: {
                          
                        fontFamily: 'Segoe UI',
                          
                        fontStyle: 'Normal ',
                          
                        fontWeight: 'regular',
                          
                        opacity: 1
                    },
                      
                    position: "below"
                },
                  
                featuredMeasureSettings: {
                      

                    stroke: null,
                      
                    width: 6
                },
                  
                comparativeMeasureSettings: {
                      
                    stroke: null,
                      
                    width: 5
                },
                  
                featureMeasures: [{
                      
                    value: null,
                      
                    comparativeMeasureValue: null,
                      
                    category: null
                }]
            },
              
            fields: {
                  
                dataSource: null,
                  
                query: null,
                  
                tableName: null,
                  
                category: null,
                  
                featureMeasures: null,
                  
                comparativeMeasure: null
            },
              
            enableAnimation: true,
              
            enableResizing: true,
              
            isResponsive: true,
              
            applyRangeStrokeToTicks: false,
              
            applyRangeStrokeToLabels: false,
              
            qualitativeRanges: [{
                  
                rangeEnd: 4.3,
                  
                rangeStroke: null,
                  
                rangeOpacity: 1
            }, {
                  
                rangeEnd: 7.3,
                  
                rangeStroke: null,
                  
                rangeOpacity: 1
            }, {
                  
                rangeEnd: 10,
                  
                rangeStroke: null,
                  
                rangeOpacity: 1
            }],
              
            captionSettings: {
                  
                enableTrim: true,
                  
                textPosition: 'float',
                  
                textAlignment: 'Near',
                  
                textAnchor: 'start',
                  
                padding: 5,
                  
                textAngle: 0,
                  
                location: {
                      
                    x: 17,
                      
                    y: 30
                },
                  
                text: "",
                  
                font: {
                      
                    color: null,
                      
                    fontFamily: 'Segoe UI',
                      
                    fontStyle: 'Normal',
                      
                    size: '12px',
                      
                    fontWeight: 'regular',
                      
                    opacity: 1
                },
                  
                subTitle: {
                      
               textPosition: 'float',
                 
               textAlignment: 'Near',
                 
               textAnchor: 'start',
                 
                    padding: 5,
                      
                    textAngle: 0,
                      
                    text: "",
                      
                    location: {
                          
                        x: 10,
                          
                        y: 45
                    },
                      
                    font: {
                          
                        color: null,                          
                        
                        fontFamily: 'Segoe UI',
                          
                        
                        fontStyle: 'Normal ',                          
                        
                        size: '12px',
                          
                        fontWeight: 'regular',
                          
                        opacity: 1
                    }
                },

                  
                indicator: {
                      
                    textPosition: 'float',
                      
                    textAlignment: 'Near',
                      
                    textAnchor: 'start',
                      
                    padding:5,
                      
                    visible: false,
                      
                    textAngle: 0,
                      
                    textSpacing: 3,
                      
                    text: "",                    
                      
                    symbol: {
                          
                        border: {
                              
                            color: null,
                              
                            width: 1,
                        },
                          
                        color: null,
                          
                        shape: "",
                          
                        imageURL: "",
                          
                        size: {
                              
                            width: 10,
                              
                            height: 10
                        },
                          
                        opacity: 1
                    },
                      
                    location: {
                          
                        x: 10,
                          
                        y: 60
                    },
                      
                    font: {
                          
                        color: null,
                          

                        fontFamily: 'Segoe UI',
                          

                        fontStyle: 'Normal ',
                          

                        size: '12px',
                          
                        fontWeight: 'regular',
                          
                        opacity: 1
                    }
                }
            },

              
              
            load: '',

            click: '',

            doubleClick: '',

            rightClick: '',
              
            drawTicks: null,
              
            drawLabels: null,
              
            drawCaption: null,
              
            drawIndicator: null,
              
            drawQualitativeRanges: null,
              
            drawFeatureMeasureBar: null,
              
            drawCategory: null,
              
            drawComparativeMeasureSymbol: null
        },

        observables: ["value", "comparativeMeasureValue"],
        value: ej.util.valueFunction("value"),
        comparativeMeasureValue: ej.util.valueFunction("comparativeMeasureValue"),
          
        dataTypes: {
            quantitativeScaleSettings: {
                labelSettings: "data",
                featureMeasures: "array"
            },
            fields: { dataSource: "data", query: "data" },
            qualitativeRanges: "array",
            captionSettings: "data",
            isResponsive: "boolean",
        },

        // constructor function
          
        _init: function () {
            this._renderBulletGraph();
        },
          
		 _destroy: function () {
            $(this.element).removeClass("e-datavisualization-bulletgraph e-js").find("#" + this.svgObject.id).remove();
        },
        _isSVG: function () {
            if (window.SVGSVGElement)
                return true;
            else
                return false;
        },
          
        _value: ej.util.valueFunction("value"),
        _comparativeMeasureValue: ej.util.valueFunction("comparativeMeasureValue"),
          
        _qualitativeRanges: function (index, property, value, old) {
            this.redraw();
            this._trigger('refresh');
        },
          
        _quantitativeScaleSettings_featureMeasures: function (index, property, value, old) {
            this.redraw();
            this._trigger('refresh');
        },
          
        _renderBulletGraph: function () {
            if (this._isSVG()) {
                this.svgRenderer = new ej.EjSvgRender(this.element);
                this.svgObject = this.svgRenderer.svgObj;
                this._trigger("load");
                this._setSvgSize(this);
                this._setTheme(ej.datavisualization.BulletGraph.Themes, this.model.theme);
                this.bindEvents();
                this._renderBulletElements();               
                if (this.model.enableAnimation)
                    this._animateMeasures();
            }
        },
          
        _animateMeasures: function () {
            this._doAnimation();
            this._doLineAnimation();
        },

        _setSvgSize: function (sender) {
            var chartObj = sender;
            var containerHeight = $(chartObj.element).height();
            var height = 90; //set default height if size not specified to chart or container
            var width = (ej.isTouchDevice()) ? 250 : 595;
            var containerWidth = $(chartObj.element).width();
            if (chartObj.model.width)
                width = parseInt(chartObj.model.width);
            else if (containerWidth > 0 && containerWidth < 595)
                width = containerWidth;
            else if(containerWidth > 595)
                width = 595;

            $(chartObj.svgObject).width(width);

            if (chartObj.model.height)
                height = parseInt(chartObj.model.height);
            else if (containerHeight > 0)
                height = containerHeight;
            else
                $(chartObj.svgObject).css("display", "block");
            $(chartObj.svgObject).height(height);


			chartObj.svgObject.setAttribute('width', width);
            chartObj.svgObject.setAttribute('height', height);
        },
        _renderBulletElements: function () {
            var width = this.model.width ? this.model.width : 595;
            var height = this.model.height ? this.model.height : 90;
            this.svgObject.setAttribute('viewBox', "0 0 " + width + " " + height);
            this.svgObject.setAttribute('preserveAspectRatio', "xMinYMin");
            this.svgWidth = $(this.svgObject).width();
            this.svgHeight = $(this.svgObject).height();
            var captionGroup = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_captionGroup' });
            var scaleGroup = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_scaleGroup' });
            var bulletGroup = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_outerWrap' });

            this._initializeValues();
            var intervalValue = ((this.model.quantitativeScaleLength) / ((this._scale.maximum - this._scale.minimum) / this._scale.interval));

            //render captionSettings
            this._drawCaption();

            //render indicator
            this._drawIndicator();

            //render caption group
            this._drawCaptionGroup(captionGroup);

            //render scale
            this._scaleGroup = scaleGroup;
            this._drawScale(captionGroup, scaleGroup);

            //draw ranges
            this._drawQualitativeRanges(scaleGroup);

            //render ticks
            this._drawMajorTicks(intervalValue, scaleGroup);
            this._drawMinorTicks(intervalValue, scaleGroup);

            //render labels
            this._drawLabels(intervalValue, scaleGroup);

            // data binding
            this._bindData();
                        
            $(scaleGroup).appendTo(bulletGroup);
            $(captionGroup).appendTo(bulletGroup);

            this._changeOrientation(scaleGroup);

            $(bulletGroup).appendTo(this.svgObject);
            $(this.svgObject).appendTo(this.element);

            this._bindHighlightRemoving(); // binding highlight style removing function for feature measure bars
            
        },

        _bindHighlightRemoving:function(){
            var isPointer = this.model.browserInfo.isMSPointerEnabled, touchStartOut,
            isIE11Pointer = this.model.browserInfo.pointerEnabled;
            touchStartOut = isPointer ? (isIE11Pointer ? "pointerout" : "MSPointerOut") : "touchout mouseout",
            this._on($("[id*=" + this.svgObject.id + "_FeatureMeasure_" + "]"), touchStartOut, function (evt) {
                if (!this.isTouch(evt))
                    $(evt.target).attr("opacity", 1);
            });
        },
      
        _drawCaptionGroup: function (captionGroup) {
            var caption = this.model.captionSettings;
            var subTitle = caption.subTitle;
            var indicator = (this._indicator ? this._indicator.settings : caption.indicator);
            var location;

            caption._location = subTitle._location = indicator._location = location;

            var smartCaptionPlacement = (caption.textPosition.toLowerCase()!='float' && caption.text!="");
            var smartSubTitlePlacement = (subTitle.textPosition.toLowerCase() != 'float' && subTitle.text != "");
            var smartIndicatorPlacement = indicator.visible && (indicator.textPosition.toLowerCase() != 'float');

            if (smartCaptionPlacement || smartSubTitlePlacement || smartIndicatorPlacement) {                

                var captionSize = ej.EjSvgRender.utils._measureText(caption.text, null, caption.font);
                var subTitleSize = ej.EjSvgRender.utils._measureText(subTitle.text, null, subTitle.font);
                var indicatorTextSize;
                var indicatorRegion;
                if (indicator.visible) {                    
                    indicatorTextSize = this._indicator.bounds;
                    var indicatorSize = {
                        width: indicator.symbol.size.width + indicatorTextSize.width + indicator.textSpacing,
                        height: Math.max(indicator.symbol.size.height, indicatorTextSize.height)
                    }
                    indicatorRegion = {
                        x: 0,
                        y: 0,
                        width: indicatorSize.width,
                        height: indicatorSize.height,
                        padding: indicator.padding,
                        anchor: indicator.textAnchor.toLowerCase(),
                        alignment: indicator.textAlignment.toLowerCase()
                    };
                }

                var captionRegion = { 
                    x: 0, 
                    y: 0, 
                    width: captionSize.width,                    
                    height: parseFloat(caption.font.size),
                    padding: caption.padding,
                    anchor: caption.textAnchor.toLowerCase(),
                    alignment: caption.textAlignment.toLowerCase()
                };
                var subTitleRegion = {
                    x: 0,
                    y: 0,
                    width: subTitleSize.width,
                    height: parseFloat(subTitle.font.size),
                    padding: subTitle.padding,
                    anchor: subTitle.textAnchor.toLowerCase(),
                    alignment: subTitle.textAlignment.toLowerCase()
                };
                
                var scaleRegion = { x: this._scale.location.x, y: this._scale.location.y, width: this.model.quantitativeScaleLength, height: this.model.qualitativeRangeSize };
                var elements= [ smartCaptionPlacement ?caption : null, smartSubTitlePlacement ? subTitle : null, smartIndicatorPlacement ? indicator : null];

                this._positionTextGroup(elements, [captionRegion, subTitleRegion, indicatorRegion], scaleRegion);
                this._locateTextGroup(elements, [captionRegion, subTitleRegion, indicatorRegion]);
            }
            var captionLocation = caption._location == undefined ? caption.location : caption._location;
            var subTitleLocation = subTitle._location == undefined ? subTitle.location : subTitle._location;
            var indicatorLocation = indicator._location == undefined ? indicator.location : indicator._location;

            caption.displayText = caption.text;
            if (caption.enableTrim == true) {
                captionLocation.x = captionLocation.x < 0 ? 0 : captionLocation.x;
                captionLocation.y = captionLocation.y < 0 ? 0 : captionLocation.y;
                caption.displayText = this._displayText(caption, captionLocation);
            }
            if (subTitle.text != "") {
                subTitle.displayText = subTitle.text;
                if (caption.enableTrim == true) {
                    subTitleLocation.x = subTitleLocation.x < 0 ? 0 : subTitleLocation.x;
                    subTitleLocation.y = subTitleLocation.y < 0 ? 0 : subTitleLocation.y;
                    subTitle.displayText = this._displayText(subTitle, subTitleLocation);
                }
            }
            if (indicator.visible) {
                indicator.displayText = indicator.text;
                if (this.model.captionSettings.enableTrim == true) {
                    indicatorLocation.x = indicatorLocation.x < 0 ? 0 : indicatorLocation.x;
                    indicatorLocation.y = indicatorLocation.y < 0 ? 0 : indicatorLocation.y;
                }
                var location = (indicator._location ? indicator._location : indicator.location);
                var symbolRect = {
                    'x': location.x + indicator.symbol.size.width / 2,
                    'y': location.y - indicator.symbol.size.height / 2,
                    'width': indicator.symbol.size.width,
                    'height': indicator.symbol.size.height,
                };
                var textOptions = this._indicatorTextOptions(indicator, symbolRect, this._indicator.bounds, this.svgObject.id + '_Indicator');
                var symbolOptions = this._indicatorSymbolOptions(captionGroup, indicator);
                this._drawBulletSymbol(this._indicator.settings.symbol.shape, symbolRect, symbolOptions, captionGroup);
                if (this.model.captionSettings.enableTrim == true)
                    indicator.displayText = this._displayText(indicator, symbolRect);
            }
            caption.displayText = caption.textPosition.toLowerCase() != "float" ? this._captionOverlap(this.model.captionSettings) : caption.displayText;
            this.svgRenderer.drawText(this._textOptions(caption, this.svgObject.id + '_Caption'), caption.displayText, captionGroup);
            if (subTitle.text != ""){
                subTitle.displayText = subTitle.textPosition.toLowerCase() != "float" ? this._subOverlap(this.model.captionSettings.subTitle) : subTitle.displayText;
                this.svgRenderer.drawText(this._textOptions(subTitle, this.svgObject.id + '_SubTitle'), subTitle.displayText, captionGroup);
            }   
            if (indicator.visible) {
                indicator.displayText = indicator.textPosition.toLowerCase() != "float" ? this._indOverlap(indicator,symbolRect) : indicator.displayText;
                this.svgRenderer.drawText(textOptions, indicator.displayText, captionGroup);
            }
        },
        // text overlap method is perform herer for caption , subtitle and indicator when position is except float
       _captionOverlap: function (settings) {
                var gap, isRotate;
				isRotate = true;
                if ((settings.textPosition == settings.subTitle.textPosition) && (settings.textAlignment == settings.subTitle.textAlignment) && settings.textAngle > 0 && settings.textAngle < 120 ) {
                    gap = settings.subTitle._location.y - settings._location.y;
                }
                else if ((settings.textPosition == settings.indicator.textPosition) && (settings.textAlignment == settings.indicator.textAlignment) && settings.textAngle > 0 && settings.textAngle < 120 ){
                    gap = settings.indicator._location.y - settings._location.y;
                }
                else{
                   if ((settings.textPosition == settings.subTitle.textPosition) && (settings._location.y < settings.subTitle._location.y) && settings.textAngle > 0 && settings.textAngle < 180 ){
                       gap = settings.subTitle._location.y - settings._location.y;
                   }
                   else if ((settings.textPosition == settings.subTitle.textPosition) && (settings._location.y > settings.subTitle._location.y) && settings.textAngle > 190 && settings.textAngle < 360     ){
                        gap = settings._location.y - settings.subTitle._location.y;
                   }
                   else if ((settings.textPosition == settings.indicator.textPosition) && (settings._location.y < settings.indicator._location.y) && settings.textAngle > 0 && settings.textAngle < 180 ){
                       gap = settings.indicator._location.y - settings._location.y;
                   }
                   else if ((settings.textPosition == settings.indicator.textPosition) && (settings._location.y > settings.indicator._location.y) && settings.textAngle > 190 && settings.textAngle < 360    ){
                        gap = settings._location.y - settings.indicator._location.y;
                   }
                }
                 var text = this._trim(settings.displayText,settings,gap,isRotate);           
            return text;             
        },
        _indOverlap: function (settings,loc) {
            var gap, isRotate;
			isRotate = true;
            var subTitle = this.model.captionSettings.subTitle;
            var title = this.model.captionSettings;
             if ((settings.textPosition == subTitle.textPosition) && (settings.textAlignment == subTitle.textAlignment) && settings.textAngle > 190 && settings.textAngle < 360 ) {
                    gap = loc.y - subTitle._location.y;
                }
                else if ((settings.textPosition == title.textPosition) && (settings.textAlignment ==title.textAlignment) && settings.textAngle > 190 && settings.textAngle < 360 ){
                    gap = loc.y - title._location.y;
                }
                else{
                   if ((settings.textPosition == subTitle.textPosition) && (settings._location.y < subTitle._location.y) && settings.textAngle > 0 && settings.textAngle < 180 ){
                       gap = subTitle._location.y - settings._location.y;
                   }
                   else if ((settings.textPosition == subTitle.textPosition) && (settings._location.y > subTitle._location.y) && settings.textAngle > 190 && settings.textAngle < 360     ){
                        gap = settings._location.y - subTitle._location.y;
                   }
                   else if ((settings.textPosition == title.textPosition) && (settings._location.y < title._location.y) && settings.textAngle > 0 && settings.textAngle < 180 ){
                       gap = title._location.y - settings._location.y;
                   }
                   else if ((settings.textPosition == title.textPosition) && (settings._location.y > title._location.y) && settings.textAngle > 190 && settings.textAngle < 360    ){
                        gap = settings._location.y - title._location.y;
                   }
                }
                 var text = this._trim(settings.displayText,settings,gap,isRotate);           
            return text;             
        },
        _subOverlap: function (settings) {
            var gap, isRotate;
			isRotate = true;
            var indicator = this.model.captionSettings.indicator;
            var title = this.model.captionSettings;
             if ((settings.textPosition == indicator.textPosition) && (settings.textAlignment == indicator.textAlignment) && settings.textAngle > 0 && settings.textAngle < 180 ) {
                    gap = indicator._location.y - settings._location.y;
                }
                else if ((settings.textPosition == title.textPosition) && (settings.textAlignment ==title.textAlignment) && settings.textAngle > 190 && settings.textAngle < 360 ){
                    gap = settings._location.y - title._location.y;
                }
                else{
                   if ((settings.textPosition == indicator.textPosition) && (settings._location.y < indicator._location.y) && settings.textAngle > 0 && settings.textAngle < 180 ){
                       gap = indicator._location.y - settings._location.y;
                   }
                   else if ((settings.textPosition == indicator.textPosition) && (settings._location.y > indicator._location.y) && settings.textAngle > 190 && settings.textAngle < 360     ){
                        gap = settings._location.y - indicator._location.y;
                   }
                   else if ((settings.textPosition == title.textPosition) && (settings._location.y < title._location.y) && settings.textAngle > 0 && settings.textAngle < 180 ){
                       gap = title._location.y - settings._location.y;
                   }
                   else if ((settings.textPosition == title.textPosition) && (settings._location.y > title._location.y) && settings.textAngle > 190 && settings.textAngle < 360    ){
                        gap = settings._location.y - title._location.y;
                   }
                }
                 var text = this._trim(settings.displayText,settings,gap,isRotate);           
            return text;             
        },
        // rotated label width calculated here
        rotatedLabel: function (font, sender, value, rotatedLabel) {
            var rotatedOptions = {
                'font-size': font.size,
                'transform': 'rotate(' + value + ',0,0)',
                'font-family': font.fontFamily,
                'font-style': font.fontStyle,
                'rotateAngle': 'rotate(' + value + 'deg)',
                'text-anchor': 'middle'
            };
            var text = sender.svgRenderer.createText(rotatedOptions, rotatedLabel);
            var width = Math.ceil((ej.EjSvgRender.utils._measureBounds(text, sender).width));
            return width;
        },
        // Trim size calculated here
        calcGap: function (angle, location, maxWidth, maxHeight, isRotate, Width, Height) {
            var trimSize, space, rotate;
            if (angle >= 0 && angle <= 90) {

                if (((maxHeight + location.y) >= Height)&& angle > 0) {
                    space = Height - location.y;
                    isRotate = true;
                }
                else if (((maxHeight + location.y) <= Height) && ((maxWidth + location.x) >= Width) && angle > 0) {
                    space = Width - location.x;
                }
                else {
                    if (((maxHeight + location.y) <= Height) && (angle > 0)) {
                        space = Height - location.y;
                        isRotate = true;
                    }
                    else
                        space = Width - location.x;
                }
            }
            else if (angle > 90 && angle < 180) {

                if (((maxHeight + location.y) >= Height)) {
                    space = Height - location.y;
                    isRotate = true;
                }
                else if (((maxHeight + location.y) <= Height) && ((maxWidth + location.x) >= Width)) {
                    space = location.x;
                }
                else {
                    if ((maxWidth + location.x) <= Width) {
                        space = location.x;
                    }
                    else {
                        space = Height - location.y;
                        isRotate = true;
                    }

                }
            }
            else if (angle >= 180 && angle < 270) {

                if ((location.x - maxWidth) >= 0) {
                    space = location.y;
                    isRotate = true;
                }
                else if (((location.y - maxHeight) <= 0) && ((location.x - maxWidth) <= 0)) {
                    space = location.x;
                }
                else {
                    if ((location.y - maxHeight) <= 0) {
                        space = Height - location.y;
                        isRotate = true;
                    }
                    else {
                        space = location.x;
                    }
                }

            }
            else {
                if ((maxWidth + location.x) <= Width) {
                    space = location.y;
                    isRotate = true;
                }
                else if (((location.y - maxHeight) >= 0) && ((maxWidth + location.x) >= Width)) {
                    space = Width - location.x;
                }
                else {
                    if ((maxWidth + location.x) >= Width) {
                        space = Width - location.x;
                    }
                    else {
                        space = location.y;
                        isRotate = true;
                    }
                }
            }

            return { trimSize: space, rotate: isRotate };
        },
        // Scale Location calculated here
        _scaleLoc: function () {
            var scale = this._scale;
            var offset = scale.labelSettings.offset;
            var tickSize = scale.majorTickSettings.size;
            var pointY, pointHeight;
            var label = this._scale.labelSettings;
            var labelBounds = ej.EjSvgRender.utils._measureText(label.labelPrefix + scale.maximum + label.labelSuffix, null, label);
            var labelSize = (this._orientation == ej.datavisualization.BulletGraph.Orientation.Horizontal) ? labelBounds.height : labelBounds.width;            
            pointY = scale.location.y;
            var qualitativeRangeSize = this.model.qualitativeRangeSize;
            var placement = this._tickPosition + this._tickPlacement + this._labelPosition + this._labelPlacement;
            if (this._tickPosition == "center")
                tickSize = (tickSize > qualitativeRangeSize) && ((tickSize - qualitativeRangeSize) / 2);
            switch (placement) {
                case 'faroutsidebelowoutside':
                    pointHeight = pointY + labelSize + qualitativeRangeSize + offset + ((tickSize > offset) && (tickSize - offset));
                    break;
                case 'faroutsidebelowinside':
                    pointHeight = pointY + tickSize + qualitativeRangeSize 
                    pointY = pointY - (((offset + labelSize) > qualitativeRangeSize) && ((offset + labelSize) - qualitativeRangeSize));
                    break;
                case 'faroutsideaboveoutside':
                    pointHeight = pointY + tickSize + qualitativeRangeSize;
                    pointY = pointY - (offset + labelSize)
                    break;
                case 'faroutsideaboveinside':
                    pointHeight = pointY + tickSize + qualitativeRangeSize + (((offset + labelSize) > (qualitativeRangeSize + tickSize)) ? ((offset + labelSize) - (qualitativeRangeSize + tickSize)) : 0 );
                    break;
                case 'farinsidebelowoutside':
                    pointHeight = pointY + labelSize + qualitativeRangeSize + offset;
                    pointY = pointY - ((tickSize > qualitativeRangeSize) && (tickSize - qualitativeRangeSize));
                    break;
                case 'farinsidebelowinside':
                    pointHeight = pointY + qualitativeRangeSize;
                    pointY = pointY - ((tickSize > qualitativeRangeSize) && (tickSize -qualitativeRangeSize)) - (((offset + labelSize) > (qualitativeRangeSize + tickSize)) && (offset + labelSize - tickSize)) 
                    break;
                case 'farinsideaboveoutside':
                    pointHeight = pointY + qualitativeRangeSize;
                    pointY = pointY - (offset + labelSize) - ((tickSize > (offset + labelSize + qualitativeRangeSize)) && (tickSize - (offset + labelSize + qualitativeRangeSize)));
                    break;
                case 'farinsideaboveinside':
                    pointHeight = pointY + qualitativeRangeSize + (((offset + labelSize) > qualitativeRangeSize) && (labelSize + offset - qualitativeRangeSize));
                    pointY = pointY - ((tickSize > qualitativeRangeSize) && (tickSize - qualitativeRangeSize));
                    break;
                case 'nearoutsidebelowoutside':
                    pointHeight = pointY + qualitativeRangeSize + offset + labelSize;
                    pointY = pointY - tickSize;
                    break;
                case 'nearoutsidebelowinside':
                    pointHeight = pointY + qualitativeRangeSize;
                    pointY = pointY - tickSize - (((offset + labelSize) > (qualitativeRangeSize + tickSize)) && ((offset + labelSize) - (qualitativeRangeSize + tickSize)));
                    break;
                case 'nearoutsideaboveoutside':
                    pointHeight = pointY + qualitativeRangeSize;
                    pointY = pointY - tickSize - ((tickSize < (offset + labelSize)) && (offset + labelSize - tickSize));
                    break;
                case 'nearoutsideaboveinside':
                    pointHeight = pointY + qualitativeRangeSize + (((offset + labelSize) > qualitativeRangeSize) && (offset + labelSize - qualitativeRangeSize));
                    pointY = pointY - tickSize;
                    break;
                case 'nearinsidebelowoutside':
                    pointHeight = pointY + qualitativeRangeSize + ((tickSize > (offset + labelSize + qualitativeRangeSize)) ? (tickSize - (qualitativeRangeSize)) : (offset + labelSize));
                    break;
                case 'nearinsidebelowinside':
                    pointHeight = pointY + qualitativeRangeSize + ((tickSize > qualitativeRangeSize) && (tickSize - qualitativeRangeSize));
                    pointY = pointY - (((offset + labelSize) > qualitativeRangeSize) && (offset + labelSize - qualitativeRangeSize));
                    break;
                case 'nearinsideaboveoutside':
                    pointHeight = pointY + ((tickSize > qualitativeRangeSize) ? tickSize : qualitativeRangeSize);
                    pointY = pointY - offset - labelSize;
                    break;
                case 'nearinsideaboveinside':
                    pointHeight = pointY + qualitativeRangeSize + ((tickSize > (labelSize + offset)) ? (tickSize - qualitativeRangeSize) : (labelSize + offset - qualitativeRangeSize));
                    break;
                case 'centeroutsidebelowoutside':
                    pointHeight = pointY + qualitativeRangeSize + ((tickSize > offset + labelSize) ? tickSize : offset + labelSize);
                    pointY = pointY - tickSize;
                    break;
                case 'centeroutsidebelowinside':
                    pointHeight = pointY + qualitativeRangeSize + tickSize;
                    pointY = pointY - tickSize - (((offset + labelSize) > (qualitativeRangeSize + tickSize)) && ((offset + labelSize) - (qualitativeRangeSize + tickSize)));
                    break;
                case 'centeroutsideaboveoutside':
                    pointHeight = pointY + qualitativeRangeSize + tickSize;
                    pointY = pointY - tickSize - ((tickSize < (offset + labelSize)) && (offset + labelSize - tickSize));
                    break;
                case 'centeroutsideaboveinside':
                    pointHeight = pointY + qualitativeRangeSize + (((offset + labelSize) > (qualitativeRangeSize + tickSize)) ? (offset + labelSize - qualitativeRangeSize - tickSize) : tickSize);
                    pointY = pointY - tickSize;
                    break;
                case 'centerinsidebelowoutside':
                    pointHeight = pointY + qualitativeRangeSize + ((tickSize > (offset + labelSize)) ? tickSize : (offset + labelSize));
                    pointY = pointY - tickSize;
                    break;
                case 'centerinsidebelowinside':
                    pointHeight = pointY + qualitativeRangeSize + tickSize;
                    pointY = pointY -  (((offset + labelSize - qualitativeRangeSize) > tickSize ) ? (offset + labelSize - qualitativeRangeSize) : tickSize);
                    break;
                case 'centerinsideaboveoutside':
                    pointHeight = pointY + qualitativeRangeSize + tickSize;
                    pointY = pointY - tickSize - ((tickSize < (offset + labelSize)) && (offset + labelSize - tickSize));
                    break;
                case 'centerinsideaboveinside':
                    pointHeight = pointY + qualitativeRangeSize + ((tickSize > (labelSize + offset)) ? tickSize : (labelSize + offset - qualitativeRangeSize));
                    pointY = pointY - tickSize;
                    break;
            }
            return {x: scale.location.x, y: pointY, height:pointHeight };

        },
        // display text method for trimming
        _displayText: function (settings, loc) {
             var location = $.extend(true, loc);
            var angle = settings.textAngle % 360;
            var text = settings.text;
            var font = settings.font;
            var scale = this._scale;
            var label = this._scale.labelSettings;
            var labelWidth = ej.EjSvgRender.utils._measureText(label.labelPrefix + scale.minimum + label.labelSuffix, null, label).width;
            var textWidth = ej.EjSvgRender.utils._measureText(text, null, font).width;
            var maxHeight = ej.EjSvgRender.utils.rotatedLabel(settings, this, angle, settings.text);
            var maxWidth = this.rotatedLabel(font, this, angle, settings.text);
            var gap, padding = 5;
            var height =this.svgHeight;
            var width = this.svgWidth;
            var isRotate = false;
            var scaleLocation = this._scaleLoc();
            if (settings.textSpacing) {
                textWidth = textWidth + settings.textSpacing;
                maxWidth = maxWidth + settings.textSpacing;
            }

            if (this._orientation == ej.datavisualization.BulletGraph.Orientation.Horizontal) {

               if ((location.x <= scaleLocation.x) && (scaleLocation.y <= location.y) && (location.y <= scaleLocation.height)) {
                    width = (scale.location.x - labelWidth / 2);
               }
               else if ((location.x <= scaleLocation.x) && (location.y <= scaleLocation.y) && (angle < 90)) {
                    height = scaleLocation.y;
               }
               else if ((location.x >= scaleLocation.x) && (location.x <= (scaleLocation.x + this.model.quantitativeScaleLength)) && (location.y <= scaleLocation.y)) {
                    height = scaleLocation.y;
               }
               else if ((location.y <= scaleLocation.y) && (location.x >= (scaleLocation.x + this.model.quantitativeScaleLength)) && (angle >= 90)) {
                    height = scaleLocation.y;
               }

               else if ((location.x >= (scaleLocation.x + this.model.quantitativeScaleLength)) && (scaleLocation.y <= location.y) && (location.y <= scaleLocation.height) && (angle < 270)) {
                    width = width - (scaleLocation.x + this.model.quantitativeScaleLength);
                    location.x = location.x - (scaleLocation.x + this.model.quantitativeScaleLength);
               }
               else if ((location.x <= scaleLocation.x) && (location.y >= scaleLocation.height) && (angle > 270)) {
                    location.y = location.y - scaleLocation.height;
               }
               else if ((location.x >= scaleLocation.x) && (location.x <= (scaleLocation.x + this.model.quantitativeScaleLength)) && (location.y >= scaleLocation.height)) {
                    location.y = location.y - scaleLocation.height;
               }
               else if ((location.x >= (scaleLocation.x + this.model.quantitativeScaleLength)) && (location.y >= scaleLocation.height) && (angle >= 180) && (angle < 270)) {
                    location.y = location.y - scaleLocation.height;
               }

               gap = this.calcGap(angle, location, maxWidth, maxHeight, isRotate, width, height);
               isRotate = gap.rotate;
               gap = gap.trimSize;
            }
            else {
                var scaleWidth = scaleLocation.height - scaleLocation.y;
                scaleLocation.y =this.svgHeight - scale.location.y - this.model.quantitativeScaleLength;
                scaleLocation.height = scaleLocation.y + this.model.quantitativeScaleLength;

                if ((location.x <= scaleLocation.x) && (scaleLocation.y <= location.y) && (location.y <= scaleLocation.height)) {
                    width = (scale.location.x - labelWidth / 2);
                }
                else if ((location.x <= scaleLocation.x) && (location.y <= scaleLocation.y) && (angle < 90)) {
                    height = scaleLocation.y;
                }
                else if ((location.x >= scaleLocation.x) && (location.x <= (scaleLocation.x + scaleWidth)) && (location.y <= scaleLocation.y)) {
                    height = scaleLocation.y;
                }
                else if ((location.y <= scaleLocation.y) && (location.x >= (scaleLocation.x + scaleWidth)) && (angle >= 90)) {
                    height = scaleLocation.y;
                }

                else if ((location.x >= (scaleLocation.x + scaleWidth)) && (scaleLocation.y <= location.y) && (location.y <= scaleLocation.height) && (angle <= 260)) {
                    width = width - (scaleLocation.x + scaleWidth);
                    location.x = location.x - (scaleLocation.x + scaleWidth);
                }
                else if ((location.x <= scaleLocation.x) && (location.y >= scaleLocation.height) && (angle >= 280)) {
                    location.y = location.y - scaleLocation.height;
                }
                else if ((location.x >= scaleLocation.x) && (location.x <= (scaleLocation.x + scaleWidth)) && (location.y >= scaleLocation.height)) {
                    location.y = location.y - scaleLocation.height;
                }
                else if ((location.x >= (scaleLocation.x + scaleWidth)) && (location.y >= scaleLocation.height) && (angle >= 180) && (angle <= 260)) {
                    location.y = location.y - scaleLocation.height;
                }

                gap = this.calcGap(angle, location, maxWidth, maxHeight, isRotate, width, height);
                isRotate = gap.rotate;
                gap = gap.trimSize;
            }
            // Trimming opetation called here
            var displayText = text;
            displayText = this._trim(text,settings,gap,isRotate);
            return displayText;
        },

        // trim calculation perform here
        _trim: function (text, settings, gap, isRotate) {
            var displayText = text;
            var maxWidth = this.rotatedLabel(settings.font, this, settings.textAngle, text);
            var textWidth = ej.EjSvgRender.utils._measureText(text, null, settings.font).width;
            if (settings.textSpacing) {
                textWidth = textWidth + settings.textSpacing;
                maxWidth = maxWidth + settings.textSpacing;
            }
            if (textWidth > gap && text != "") {
                var space;
                for (var t = 1; t <= text.toString().length; t++) {
                    text = displayText.toString().substring(0, t) + '... ';
                    if (isRotate == true)
                        space = ej.EjSvgRender.utils.rotatedLabel(settings, this, settings.textAngle, text);
                    else
                        space = ej.EjSvgRender.utils._measureText(text, null, settings.font).width;

                    if (settings.textSpacing) {
                        space = space + settings.textSpacing;
                    }
                    if (space >= gap) {
                        text = text.toString().substring(0, t - 1) + '... ';
                        displayText = text;
                        break;
                    }
                }
                var temp = displayText.toString(0, text.toString.lenght - 4);
                if (temp != displayText)
                    displayText = text;
            }
            return displayText;
        },
       
        _getVerticalScaleLocation: function(scaleWidth){
            return { x: this._scale.location.y, y:this.svgHeight - this._scale.location.x - scaleWidth };

        },
      
        _horizontalTextPositioning: function (element, region, scaleLocation, scaleRegion, regions) {
            var position = element.textPosition.toLowerCase();
            var alignment = region.alignment;
            var scaleLocation = this._scaleLoc();
            var label = this._scale.labelSettings;
            var maxLabelWidth = ej.EjSvgRender.utils._measureText(label.labelPrefix + this._scale.maximum + label.labelSuffix, null, label).width;            
            switch (position) {
                case 'left':
                    region.x = scaleLocation.x - region.width - region.padding - maxLabelWidth/2;
                    region.y = scaleLocation.y + ((alignment == 'center') ? scaleRegion.height / 2 + region.height/3: (alignment == 'far' ? scaleRegion.height : region.height));
                    regions[0].push(region);
                    break;
                case 'right':
                    region.x = scaleLocation.x + scaleRegion.width + region.padding + maxLabelWidth/2;
                    region.y = scaleLocation.y + ((alignment == 'center') ? scaleRegion.height / 2 + region.height / 3 : (alignment == 'far' ? scaleRegion.height : region.height));
                    regions[1].push(region);
                    break;
                case 'top':
                    region.x = (alignment == 'center') ? scaleRegion.x + scaleRegion.width / 2 - region.width / 2 : (alignment == 'near' ? scaleRegion.x : scaleRegion.x + scaleRegion.width - region.width);
                    region.y = scaleLocation.y - region.padding;
                    regions[2].push(region);
                    break;
                case 'bottom':                    
                    region.x = (alignment == 'center') ? scaleRegion.x + scaleRegion.width / 2 - region.width / 2 : (alignment == 'near' ? scaleRegion.x : scaleRegion.x + scaleRegion.width - region.width);
                    region.y = scaleLocation.height + region.height / 2 + region.padding;
                    regions[3].push(region);
                    break;
            }
        },
       
        _VerticalTextPositioning: function (element, region, scaleLocation, scaleRegion, regions) {
            var position = element.textPosition.toLowerCase();
            var alignment = region.alignment;
            var scaleBounds = this._scaleLoc();
            switch (position) {
                case 'left':
                    region.x = scaleBounds.y - region.width - region.padding;
                    region.y = scaleLocation.y + ((alignment == 'center') ? scaleRegion.height / 2 + region.height / 3 : (alignment == 'far' ? scaleRegion.height : region.height));
                    if (this._tickPosition == 'near' && this._tickPlacement == 'inside' && (this._labelPosition=='above' && this._labelPlacement=='inside'))
                        region.x += this._scale.majorTickSettings.size;
                    regions[0].push(region);
                    break;
                case 'right':
                    region.x = scaleBounds.height + region.padding;
                    region.y = scaleLocation.y + ((alignment == 'center') ? scaleRegion.height / 2 + region.height / 3 : (alignment == 'far' ? scaleRegion.height : region.height));
                    regions[1].push(region);
                    break;
                case 'top':
                    region.x = scaleRegion.x - region.width / 2 + (alignment == 'center' ? scaleRegion.width / 2 : (alignment == 'far' && scaleRegion.width));
                    region.y = scaleRegion.y - region.padding;                   
                    regions[2].push(region);
                    break;
                case 'bottom':
                    region.x = scaleRegion.x - region.width / 2 + (alignment=='center' ? scaleRegion.width / 2 : (alignment == 'far' && scaleRegion.width));
                    region.y = scaleRegion.y + scaleRegion.height + region.height + region.padding - region.height / 3 + this._scale.labelSettings.size / 2;
                    regions[3].push(region);
                    break;
            }
        },
    
        _positionTextGroup: function (elements, regions, horScaleRegion) {
            var elementRegions=[[], [], [], []];
            var isHorizontal = (this._orientation == 'horizontal');            
            var scaleLocation = isHorizontal ? this._scaleLocation : this._getVerticalScaleLocation(horScaleRegion.width);
            var scaleRegion = isHorizontal ? horScaleRegion : { x: scaleLocation.x, y: scaleLocation.y, width: horScaleRegion.height, height: horScaleRegion.width };
            for (var i = 0; i < elements.length; i++) {
                if (elements[i]) {
                    if (isHorizontal)
                        this._horizontalTextPositioning(elements[i], regions[i], scaleLocation, scaleRegion, elementRegions);
                    else
                        this._VerticalTextPositioning(elements[i], regions[i], scaleLocation, scaleRegion, elementRegions);
                }                
            }
            this._avoidElementsOverlapping(elementRegions);
        },
       
        _avoidElementsOverlapping: function (regions) {
            for (var j = 0; j < regions.length; j++) {
                var region = regions[j];
                var isOverlap = false;
                do {
                    for (var i = 0; i < region.length; i++) {
                        for (var k = i - 1; k >= 0; k--) {
                            if (this._isOverlapping(region[i], region[k])) {
                                switch (j) {
                                    //Placing overlapped text for left and right positioned text elements
                                    case 0:
                                    case 1:
                                        if (region[k].y > region[i].y)
                                            region[k].y = region[i].y + region[k].height + (region[k].padding > 1 ? region[k].padding : 1);
                                        else
                                            region[i].y = region[k].y + region[i].height + (region[i].padding > 1 ? region[i].padding : 1);
                                        break;
                                        //Placing overlapped text at top position
                                    case 2:
                                        region[k].y = region[i].y - region[i].height - (region[k].padding > 1 ? region[k].padding : 1);
                                        break;
                                        //Placing overlapped text at bottom position
                                    default:
                                        region[i].y = region[k].y + region[k].height + (region[k].padding > 1 ? region[k].padding : 1);
                                        break;
                                }
                                isOverlap = true;
                                break;
                            }
                            else
                                isOverlap = false;
                        }
                    }
                } while (isOverlap);
            }
            this._applyLeftRightAnchor([regions[0], regions[1]]);
            this._applyTopBottomAnchor([regions[2], regions[3]]);
        },
      
        _locateTextGroup: function (elements, regions) {            
            for (var i = 0; i < elements.length; i++) {
                if (elements[i]) {
                    elements[i]._location = { x: 0, y: 0 };
                    elements[i]._location.x = regions[i].x;
                    elements[i]._location.y = regions[i].y;
                }
            }
        },
     
        _applyLeftRightAnchor: function (regions) {
            var anchor;
            for (var i = 0; i < regions.length; i++) {
                var region = regions[i];
                var maxSize = 0;
                for (var j = 0; j < region.length; j++)
                    maxSize = Math.max(maxSize, region[j].width);
                for (var j = 0; j < region.length; j++) {
                    anchor = region[j].anchor;
                    if (anchor == 'start')
                        region[j].x += (i == 0) && (region[j].width - maxSize);
                    else if (anchor == 'middle')
                        region[j].x += (i == 0) ? (region[j].width - maxSize) / 2 : (maxSize - region[j].width) / 2;
                    else
                        region[j].x += (i != 0) && (maxSize - region[j].width);
                }
            }
        },
     
        _applyTopBottomAnchor: function (regions) {            
            for (var i = 0; i < regions.length; i++) {
                var nearAlignment = [], farAlignment = [], centerAlignment = [];
                var region = regions[i];
                for (var j = 0; j < region.length; j++)
                    if (region[j].alignment == 'near')
                        nearAlignment.push(region[j])
                    else if (region[j].alignment == 'far')
                        farAlignment.push(region[j]);
                    else
                        centerAlignment.push(region[j]);

                this._applyNearAnchor(nearAlignment);
                this._applyCenterAnchor(centerAlignment);
                this._applyFarAnchor(farAlignment);
            }
        },
       
        _applyNearAnchor: function (regions) {
            if (regions.length > 1) {
                var maxSize = 0;
                for (var i = 0; i < regions.length; i++)
                    maxSize = Math.max(maxSize, regions[i].width);
                for (var i = 0; i < regions.length; i++)
                    if (regions[i].anchor == 'start')
                        regions[i].x += (this._orientation == 'vertical') && (regions[i].width - maxSize) / 2;
                    else if (regions[i].anchor == 'middle')
                        regions[i].x += (this._orientation == 'horizontal') && (maxSize - regions[i].width) / 2;
                    else
                        regions[i].x += (this._orientation == 'horizontal') ? (maxSize - regions[i].width) : (maxSize - regions[i].width) / 2;
            }
        },
      
        _applyCenterAnchor: function (regions) {
            if (regions.length > 1) {
                var maxSize = 0;
                for (var i = 0; i < regions.length; i++)
                    maxSize = Math.max(maxSize, regions[i].width);
                for (var i = 0; i < regions.length; i++)
                    if (regions[i].anchor == 'start')
                        regions[i].x += (regions[i].width - maxSize) / 2;
                    else if (regions[i].anchor == 'end')
                        regions[i].x += (maxSize - regions[i].width) / 2;
            }
        },
     
        _applyFarAnchor: function (regions) {
            if (regions.length > 1) {
                var maxSize = 0;
                for (var i = 0; i < regions.length; i++)
                    maxSize = Math.max(maxSize, regions[i].width);
                for (var i = 0; i < regions.length; i++)
                    if (regions[i].anchor == 'start')
                        regions[i].x += (this._orientation == 'horizontal') ? regions[i].width - maxSize : (regions[i].width - maxSize) / 2;
                    else if (regions[i].anchor == 'middle')
                        regions[i].x += (this._orientation == 'horizontal') && (regions[i].width - maxSize) / 2;
                    else if (regions[i].anchor == 'end')
                        regions[i].x += (this._orientation == 'vertical') && (maxSize - regions[i].width) / 2;
            }
        },
       
        _isOverlapping: function (reg1, reg2) {
            return !(reg1.x + reg1.width < reg2.x || reg1.x > reg2.x + reg2.width || reg1.y - reg1.height > reg2.y || reg1.y < reg2.y - reg2.height);
        },
        
        _initializeValues: function () {
            this._scale = this.model.quantitativeScaleSettings;
            this._labelPosition = this._scale.labelSettings.position.toLowerCase();
            this._tickPosition = this._scale.tickPosition.toLowerCase();
            this._flowDirection = this.model.flowDirection.toLowerCase();
            this._orientation = this.model.orientation.toLowerCase();
            this._tickPlacement = this._scale.tickPlacement.toLowerCase();
            this._labelPlacement = this._scale.labelSettings.labelPlacement.toLowerCase();
        },
      
        _changeOrientation: function (bulletGroup) {
            if (this._orientation == ej.datavisualization.BulletGraph.Orientation.Vertical) {               
                bulletGroup.setAttribute("transform", "translate(0," +this.svgHeight +")rotate(-90)");
            }
        },
       
        _setModel: function (options) {
            var isFlag = true;
            for (var key in options) {
                this.model.enableAnimation = false;
                switch (key) {
                    case "height":
                        this.model.height = options[key];
                        break;
                    case "width":
                        this.model.width = options[key];
                        break;
                    case "theme":
                        this.model.theme = options[key];
                        this._setTheme(ej.datavisualization.BulletGraph.Themes, this.model.theme);
                        break;
                    case "orientation":
                        this.model.orientation = options[key];
                        break;
                    case "flowDirection":
                        this.model.flowDirection = options[key];
                        break;
                    case "qualitativeRangeSize":
                        this.model.qualitativeRangeSize = options[key];
                        break;
                    case "quantitativeScaleLength":
                        this.model.quantitativeScaleLength = options[key];
                        break;
                    case "quantitativeScaleSettings":
                        $.extend(true, this.model.quantitativeScaleSettings, {}, options[key]);
                        break;
                    case "applyRangeStrokeToTicks":
                        this.model.applyRangeStrokeToTicks = options[key];
                        break;
                    case "applyRangeStrokeToLabels":
                        this.model.applyRangeStrokeToLabels = options[key];
                        break;
                    case "qualitativeRanges":
                        $.extend(true, this.model.qualitativeRanges, {}, options[key]);
                        break;
                    case "captionSettings":
                        $.extend(true, this.model.captionSettings, {}, options[key]);
                        break;
                    case "dataSource":
                        $.extend(true, this.model.fields, {}, options[key]);
                        break;
                    case "value":
                        for (var i = 0; this.model.quantitativeScaleSettings.featureMeasures[i] != null; i++) {
                            this.model.quantitativeScaleSettings.featureMeasures[i].value = parseFloat(this.value());
                        }
                        break;
                    case "comparativeMeasureValue":
                        for (var i = 0; this.model.quantitativeScaleSettings.featureMeasures[i] != null; i++) {
                            this.model.quantitativeScaleSettings.featureMeasures[i].comparativeMeasureValue = parseFloat(this.comparativeMeasureValue());
                        }
                        break;
                    case "enableAnimation":
                        this.model.enableAnimation = options[key];
                        if (this.model.enableAnimation) {
                            $(this.svgObject).empty();
                            this._renderBulletElements();
                            this._animateMeasures();
                        }
                        isFlag = false;
                        break;
                }
            }
            if (isFlag) {
                $(this.svgObject).empty();
                this._renderBulletElements();
            }
        },
      
        _bindData: function () {

            if (!ej.isNullOrUndefined(this.model.fields) && this.model.fields["dataSource"] != null) {
                if (this.model.fields["dataSource"] instanceof ej.DataManager) {
                    this._initDataSource();
                }
                else {
                    this._dataCount = this.model.fields["dataSource"].length;
                    this._drawMeasures();
                }
            }
            else {      //this.model.quantitativeScaleSettings.featureMeasures != null
                this._dataCount = this._scale.featureMeasures.length;
                this._drawMeasures();
            }
        },
      
        _drawMeasures: function () {
            this._drawFeatureMeasureBar();
            this._drawComparativeMeasureSymbol();
        },
      
        _initDataSource: function () {
            var query = this._columnToSelect(this.model.fields);
            var proxy = this;
            var queryPromise = this.model.fields["dataSource"].executeQuery(query);
            queryPromise.done(function (e) {
                proxy.model.fields["dataSource"] = e.result;
                proxy._dataCount = e.result.length;
                proxy._drawFeatureMeasureBar();
                proxy._drawComparativeMeasureSymbol();
                proxy._bindHighlightRemoving();
            });
        },
      
        _columnToSelect: function (mapper) {
            var column = [], queryManager = ej.Query();
            if (ej.isNullOrUndefined(mapper.query)) {
                for (var col in mapper) {
                    if (col !== "tableName" && col !== "query" && col !== "dataSource")
                        column.push(mapper[col]);
                }
                if (column.length > 0)
                    queryManager.select(column);
                if (!this.model.fields["dataSource"].dataSource.url.match(mapper.tableName + "$"))
                    !ej.isNullOrUndefined(mapper.tableName) && queryManager.from(mapper.tableName);
            }
            else
                queryManager = mapper.query;
            return queryManager;
        },
             
        _drawCaption: function () {
            if (this.model.drawCaption) {
                var data = { font: this.model.captionSettings.font, location: this.model.captionSettings.location, subTitle: this.model.captionSettings.subTitle, text: this.model.captionSettings.text, textAngle: this.model.captionSettings.textAngle };
                this._trigger("drawCaption", data);
                this.model.captionSettings = $.extend(this.model.captionSettings, data);
            }
        },
      
        _drawBulletSymbol: function(shape, symbolRect, symbolOptions, captionGroup){
            var arrowPath = "M" + " " + ((symbolRect.x - (symbolRect.width / 2)) + symbolRect.width) + " " + (symbolRect.y + (symbolRect.height / 4)) + " "
                    + "L" + " " + ((symbolRect.x - (symbolRect.width / 2)) + symbolRect.width) + " " + (symbolRect.y + (-symbolRect.height / 4)) + " "
                    + "L" + " " + ((symbolRect.x - (symbolRect.width / 2)) + (symbolRect.width / 2)) + " " + (symbolRect.y + (-symbolRect.height / 4)) + " "
                    + "L" + " " + ((symbolRect.x - (symbolRect.width / 2)) + (symbolRect.width / 2)) + " " + (symbolRect.y + (-symbolRect.height / 2)) + " "
                    + "L" + " " + ((symbolRect.x - (symbolRect.width / 2))) + " " + (symbolRect.y) + " "
                    + "L" + " " + ((symbolRect.x - (symbolRect.width / 2)) + (symbolRect.width / 2)) + " " + (symbolRect.y + (symbolRect.height / 2)) + " "
                    + "L" + " " + ((symbolRect.x - (symbolRect.width / 2)) + (symbolRect.width / 2)) + " " + (symbolRect.y + (symbolRect.height / 4)) + " "
                    + "L" + " " + ((symbolRect.x - (symbolRect.width / 2)) + symbolRect.width) + " " + (symbolRect.y + (symbolRect.height / 4));

            switch (shape.toLowerCase()) {
                case 'circle':
                    var radius = Math.min(symbolRect.height, symbolRect.width) / 2;
                    symbolOptions.cx = symbolRect.x;
                    symbolOptions.cy = symbolRect.y,
                    symbolOptions.r = radius,
                    this.svgRenderer.drawCircle(symbolOptions, captionGroup);
                    break;

                case 'leftarrow':                        
                    symbolOptions.d = arrowPath;
                    this.svgRenderer.drawPath(symbolOptions, captionGroup);
                    break;
                case 'rightarrow':
                    symbolOptions.d = arrowPath;
                    symbolOptions.transform = 'rotate(180,' + (symbolRect.x) + ',' + symbolRect.y + ')';
                    this.svgRenderer.drawPath(symbolOptions, captionGroup);
                    break;
                case 'uparrow':
                    symbolOptions.d = arrowPath;
                    symbolOptions.transform = 'rotate(90,' + (symbolRect.x) + ',' + symbolRect.y + ')';
                    this.svgRenderer.drawPath(symbolOptions, captionGroup);
                    break;
                case 'downarrow':
                    symbolOptions.d = arrowPath;
                    symbolOptions.transform = 'rotate(-90,' + (symbolRect.x) + ',' + symbolRect.y + ')';
                    this.svgRenderer.drawPath(symbolOptions, captionGroup);
                    break;
                case 'cross':
                    var crossPath = "M" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y) + " "
                        + "L" + " " + (symbolRect.x + (symbolRect.width / 2)) + " " + (symbolRect.y) + " " +
                        "M" + " " + (symbolRect.x) + " " + (symbolRect.y + (symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x) + " " + (symbolRect.y + (-symbolRect.height / 2));
                    symbolOptions.d = crossPath;
                    symbolOptions.stroke = (symbolOptions.stroke) ? symbolOptions.stroke : symbolOptions.fill;
                    this.svgRenderer.drawPath(symbolOptions, captionGroup);
                    break;
                case 'horizontalline':
                    var horizPath = "M" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y) + " " + "L" + " " + (symbolRect.x + (symbolRect.width / 2)) + " " + (symbolRect.y);
                    symbolOptions.d = horizPath;
                    symbolOptions.stroke = (symbolOptions.stroke) ? symbolOptions.stroke : symbolOptions.fill;
                    this.svgRenderer.drawPath(symbolOptions, captionGroup);
                    break;
                case 'verticalline':
                    var verPath = "M" + " " + (symbolRect.x) + " " + (symbolRect.y + (symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x) + " " + (symbolRect.y + (-symbolRect.height / 2));
                    symbolOptions.d = verPath;
                    symbolOptions.stroke = (symbolOptions.stroke) ? symbolOptions.stroke : symbolOptions.fill;
                    this.svgRenderer.drawPath(symbolOptions, captionGroup);
                    break;
                case 'triangle':
                    var triPath = "M" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y + (symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x) + " " + (symbolRect.y + (-symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (symbolRect.width / 2)) + " " + (symbolRect.y + (symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y + (symbolRect.height / 2)) + " Z";
                    symbolOptions.d = triPath;
                    this.svgRenderer.drawPath(symbolOptions, captionGroup);
                    break;
                case 'invertedtriangle':
                    var triPath = "M" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y + (symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x) + " " + (symbolRect.y + (-symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (symbolRect.width / 2)) + " " + (symbolRect.y + (symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y + (symbolRect.height / 2)) + " Z";
                    symbolOptions.d = triPath;
                    symbolOptions.transform = 'rotate(180,' + (symbolRect.x) + ',' + symbolRect.y + ')';
                    this.svgRenderer.drawPath(symbolOptions, captionGroup);
                    break;
                case 'hexagon':
                    var hexPath = "M" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y) + " "
                        + "L" + " " + (symbolRect.x + (-symbolRect.width / 4)) + " " + (symbolRect.y + (-symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (symbolRect.width / 4)) + " " + (symbolRect.y + (-symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (symbolRect.width / 2)) + " " + (symbolRect.y) + " "
                        + "L" + " " + (symbolRect.x + (symbolRect.width / 4)) + " " + (symbolRect.y + (symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (-symbolRect.width / 4)) + " " + (symbolRect.y + (symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y);
                    symbolOptions.d = hexPath;
                    this.svgRenderer.drawPath(symbolOptions, captionGroup);
                    break;
                case 'wedge':
                    var wedgePath = "M" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y) + " "
                        + "L" + " " + (symbolRect.x + symbolRect.width / 2) + " " + (symbolRect.y + (-symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (symbolRect.width / 4)) + " " + (symbolRect.y) + " "
                        + "L" + " " + (symbolRect.x + (symbolRect.width / 2)) + " " + (symbolRect.y + (symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y);
                    symbolOptions.d = wedgePath;
                    this.svgRenderer.drawPath(symbolOptions, captionGroup);
                    break;
                case 'pentagon':
                    var eq = 72;
                    var radius = Math.sqrt(symbolRect.height * symbolRect.height + symbolRect.width * symbolRect.width) / 2;
                    var sb = ej.EjSvgRender.utils._getStringBuilder();
                    for (var i = 0; i <= 5; i++) {
                        var deg = i * eq;
                        var rad = (Math.PI / 180) * deg;
                        var x1 = radius * Math.cos(rad);
                        var y1 = radius * Math.sin(rad);
                        if (i == 0)
                            sb.append("M" + " " + (symbolRect.x + x1) + " " + (symbolRect.y + y1) + " ");

                        else
                            sb.append("L" + " " + (symbolRect.x + x1) + " " + (symbolRect.y + y1) + " ");

                    }                        
                    symbolOptions.d = sb.toString();
                    this.svgRenderer.drawPath(symbolOptions, captionGroup);
                    break;
                case 'star':
                    var starPath = "M" + " " + (symbolRect.x + (symbolRect.width / 3)) + " " + (symbolRect.y + (-symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y + (symbolRect.height / 6)) + " "
                        + "L" + " " + (symbolRect.x + (symbolRect.width / 2)) + " " + (symbolRect.y + (symbolRect.height / 6)) + " "
                        + "L" + " " + (symbolRect.x + (-symbolRect.width / 3)) + " " + (symbolRect.y + (-symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x) + " " + (symbolRect.y + (symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (symbolRect.width / 3)) + " " + (symbolRect.y + (-symbolRect.height / 2));
                    symbolOptions.d = starPath;
                    this.svgRenderer.drawPath(symbolOptions, captionGroup);
                    break;
                case 'rectangle':
                    var rectPath = "M" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y + (-symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (symbolRect.width / 2)) + " " + (symbolRect.y + (-symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (symbolRect.width / 2)) + " " + (symbolRect.y + (symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y + (symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y + (-symbolRect.height / 2));
                    symbolOptions.d = rectPath;
                    this.svgRenderer.drawPath(symbolOptions, captionGroup);
                    break;
                case 'trapezoid':
                    var path = "M" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y) + " "
                        + "L" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y + (-symbolRect.height / 4)) + " "
                        + "L" + " " + (symbolRect.x + (-symbolRect.width / 2) + (symbolRect.width)) + " " + (symbolRect.y + (-symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (-symbolRect.width / 2) + (symbolRect.width)) + " " + (symbolRect.y + (symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y + (symbolRect.height / 4)) + " "
                        + "L" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y);
                    symbolOptions.d = path;
                    this.svgRenderer.drawPath(symbolOptions, captionGroup);
                    break;
                case 'diamond':
                    var path = "M" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y) + " "
                        + "L" + " " + (symbolRect.x) + " " + (symbolRect.y + (-symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (symbolRect.width / 2)) + " " + (symbolRect.y) + " "
                        + "L" + " " + (symbolRect.x) + " " + (symbolRect.y + (symbolRect.height / 2)) + " "
                        + "L" + " " + (symbolRect.x + (-symbolRect.width / 2)) + " " + (symbolRect.y);
                    symbolOptions.d = path;
                    this.svgRenderer.drawPath(symbolOptions, captionGroup);
                    break;
                case 'ellipse':                        
                    symbolOptions.cx = symbolRect.x;
                    symbolOptions.cy = symbolRect.y;
                    symbolOptions.rx = symbolRect.width/2;
                    symbolOptions.ry = symbolRect.height/2;
                    this.svgRenderer.drawEllipse(symbolOptions, captionGroup);
                    break;
                case 'image':
                    symbolOptions.x = symbolRect.x - symbolRect.width / 2;
                    symbolOptions.y = symbolRect.y - symbolRect.height / 2;
                    symbolOptions.width = symbolRect.width;
                    symbolOptions.height = symbolRect.height;
                    symbolOptions.href = this.model.captionSettings.indicator.symbol.imageURL;
                    symbolOptions.visibility = 'visible';
                    this.svgRenderer.drawImage(symbolOptions, captionGroup);
                    break;
                default:
                    break;
            }                
        },
       
        _drawIndicator: function () {
            if (this.model.captionSettings.indicator.visible) {
                var indicatorSettings = this.model.captionSettings.indicator;
                var indicatorEventArgs = $.extend({}, { indicatorSettings: this.model.captionSettings.indicator });
                if (this.model.drawIndicator) {
                    this._trigger("drawIndicator", indicatorEventArgs);
                    if (indicatorEventArgs.cancel == false) {
                        indicatorSettings = indicatorEventArgs.indicatorSettings;
                        this.model.captionSettings.indicator = indicatorSettings;
                    }
                }
                var textBounds = ej.EjSvgRender.utils._measureText(indicatorSettings.text, null, indicatorSettings.font);
                this._indicator = { 'bounds': textBounds, 'settings': indicatorSettings };
            }
        },
      
        _indicatorTextOptions: function (settings, rect, bounds, id) {
            var location = settings._location ? settings._location : settings.location;
            return {
                'class' : id,
                'x': location.x + rect.width + settings.textSpacing,
                'y': location.y - rect.height / 2 + parseFloat(settings.font.size) / 3,
                'fill': settings.font.color,
                'font-size': settings.font.size,
                'font-family': settings.font.fontFamily,
                'font-style': settings.font.fontStyle,
                'font-weight': settings.font.fontWeight,
                'text-anchor': 'start',
                'opacity': settings.font.opacity,
                'transform': 'rotate(' + settings.textAngle + ',' + rect.x  + ',' + rect.y + ')'
            };
        },
      
        _indicatorSymbolOptions: function (group, settings) {
            return {
                'id': group.id + '_indicatorSymbol',
                'stroke': settings.symbol.border.color,
                'fill': settings.symbol.color,
                'stroke-width': settings.symbol.border.width,
                'opacity': settings.symbol.opacity
            };
        },
       
        _textOptions: function (text, id) {
            var location = (text._location ? text._location : text.location);
            var textOptions = {
                'class': id,
                'x': location.x,
                'y': location.y,
                'fill': text.font.color,
                'font-size': text.font.size,
                'font-family': text.font.fontFamily,
                'font-style': text.font.fontStyle,
                'font-weight': text.font.fontWeight,
                'text-anchor': 'start',
                'opacity': text.font.opacity,
				'cursor':'default',
                'transform': 'rotate(' + text.textAngle + ',' + (location.x) + ',' + (location.y) + ')'
            };
            return textOptions;
        },
       
        _drawScale: function (captionGroup, scaleGroup) {
            var scaleLocation = this._scale._location ? this._scale._location : this._scale.location;
            var pointY, pointX;
            if (this._tickPosition == ej.datavisualization.BulletGraph.TickPosition.Far || this._tickPosition == ej.datavisualization.BulletGraph.TickPosition.Center)
                pointY = (this._labelPosition == ej.datavisualization.BulletGraph.LabelPosition.Below) ? scaleLocation.y : scaleLocation.y + this._scale.labelSettings.offset + this._scale.labelSettings.size;
            else
                pointY = (this._labelPosition == ej.datavisualization.BulletGraph.LabelPosition.Below) ? scaleLocation.y + this._scale.majorTickSettings.size : scaleLocation.y + this._scale.labelSettings.offset + this._scale.labelSettings.size + this._scale.majorTickSettings.size;

            if (this._flowDirection == ej.datavisualization.BulletGraph.FlowDirection.Forward)
                pointX = scaleLocation.x;
            else
                pointX = (this._orientation == ej.datavisualization.BulletGraph.Orientation.Horizontal) ? scaleLocation.x - this._scale.labelSettings.offset : scaleLocation.x;

            var scaleOptions = {
                'id': this.svgObject.id + '_SvgScale',
                'x': pointX,
                'y': pointY,
                'width': this.model.quantitativeScaleLength,
                'height': this.model.qualitativeRangeSize,
                'fill': "transparent",
                'stroke-width': 0
            };
            this.svgRenderer.drawRect(scaleOptions, scaleGroup);
        },
     
        _drawMajorTicks: function (intervalValue, scaleGroup) {
            var majorPointX, y1, tickIndex = 0;
            var scaleLocation = this._scale.location;
            var isTicksInside = (this._tickPlacement == 'inside');
            var locX = this._scale.location.x;
            var scaleLength = this.model.quantitativeScaleLength;
            var labelOffset = this._scale.labelSettings.offset;

            var rangeSize = this.model.qualitativeRangeSize;
            var majorTickWidth = this._scale.majorTickSettings.width;
            var majorTickSize = this._scale.majorTickSettings.size;

            var isHorizontal = (this._orientation == ej.datavisualization.BulletGraph.Orientation.Horizontal);
            var isForward = (this._flowDirection == ej.datavisualization.BulletGraph.FlowDirection.Forward);
            var isBelow = (this._labelPosition == ej.datavisualization.BulletGraph.LabelPosition.Below);

            if (isForward)
                majorPointX = isHorizontal ? locX + (majorTickWidth / 2) : locX + scaleLength + (majorTickWidth / 2);
            else
                majorPointX = isHorizontal ? locX + scaleLength - (majorTickWidth / 2) : locX + (majorTickWidth / 2);
            
            if(this._tickPosition == 'far')
                y1 = scaleLocation.y + rangeSize + (isTicksInside ? -majorTickSize : 0);
            else if(this._tickPosition == 'near')
                y1 = scaleLocation.y + (isTicksInside ? 0 : -majorTickSize);
            else
                y1 = scaleLocation.y + (rangeSize / 2) - (majorTickSize / 2);
            
            var min = this._scale.minimum;
            var max = this._scale.maximum;
            var interval = this._scale.interval;
            
            for (var i = min; i <= max; i += interval) {
                tickIndex++;
                if (i >= max)
                    if (isHorizontal && !isForward)
                        majorPointX += majorTickWidth;
                    else
                        majorPointX -= majorTickWidth;
                if (!isHorizontal && isForward)
                    majorPointX = (i >= max) ? majorPointX + (majorTickWidth) : (i == min) ? majorPointX - (majorTickWidth) : majorPointX;

                if (this.model.applyRangeStrokeToTicks)
                   var strokeColor = this._bindingRangeStrokes(majorPointX - (majorTickWidth / 2));

                var options = this._majorTickLines(this._scale, majorPointX, y1, strokeColor);

                if (!isHorizontal && isForward && i == min)
                    majorPointX = majorPointX + majorTickWidth;
                
                if (this.model.drawTicks) {
                    data = { majorTickSettings: this._scale.majorTickSettings, minorTickSettings: this._scale.minorTickSettings, minorTicksPerInterval: this._scale.minorTicksPerInterval, maximum: max, minimum: min, interval: interval };
                    this._trigger("drawTicks", data);                    
                    options = this._majorTickLines(data, majorPointX, y1, strokeColor);
                }
                var majorTicks = this.svgRenderer.createLine(options);
                majorPointX = ((!isForward && isHorizontal) || (isForward && !isHorizontal)) ? majorPointX - intervalValue : majorPointX + intervalValue;
                scaleGroup.appendChild(majorTicks);
            }
        },
        _majorTickLines: function (data, majorPointX, y1, strokeColor) {
            var options = {
                'x1': majorPointX,
                'y1': y1,
                'x2': majorPointX,
                'y2': y1 + data.majorTickSettings.size,
                'stroke-width': data.majorTickSettings.width,
                'stroke': (this.model.applyRangeStrokeToTicks && strokeColor) ? strokeColor : data.majorTickSettings.stroke
            };
            return options;
        },
       
        _forwardStrokeBinding: function (majorPointX) {
            if (majorPointX >= this._scale.location.x && majorPointX <= (this._rangeCollection[0] + this._scale.location.x)) {
                return this.model.qualitativeRanges[0].rangeStroke;
            }
            for (var k = 0; k <= this._rangeCollection.length - 1; k++) {
                if (majorPointX >= (this._rangeCollection[k] + this._scale.location.x) && majorPointX <= (this._rangeCollection[k + 1] + this._scale.location.x))
                    return this.model.qualitativeRanges[k + 1].rangeStroke;
            }
        },
       
        _backwardStrokeBinding: function (majorPointX) {
            if (majorPointX >= this._rangeCollection[this._rangeCollection.length - 1]) {
                return this.model.qualitativeRanges[0].rangeStroke;
            }
            for (var k = 0; k <= this._rangeCollection.length - 1; k++) {
                if (majorPointX >= this._rangeCollection[k] && majorPointX < this._rangeCollection[k + 1]) {
                    var index = $.inArray(this._rangeCollection[k], this._rangeCollection)
                    return this.model.qualitativeRanges[(this._rangeCollection.length - 1) - index].rangeStroke;
                }
            }
        },
      
        _bindingRangeStrokes: function (majorPointX) {
            if (this._rangeCollection.length == 1) {
                if (majorPointX >= this._scale.location.x && majorPointX <= (this._rangeCollection[0] + this._scale.location.x))
                    return this.model.qualitativeRanges[0].rangeStroke;
            }
            else {
                if ((this.model.orientation == ej.datavisualization.BulletGraph.Orientation.Horizontal && this._flowDirection == ej.datavisualization.BulletGraph.FlowDirection.Forward) || (this.model.orientation == ej.datavisualization.BulletGraph.Orientation.Vertical && this._flowDirection == ej.datavisualization.BulletGraph.FlowDirection.Backward)) {
                    return this._forwardStrokeBinding(majorPointX);
                }
                else {
                    return this._backwardStrokeBinding(majorPointX);
                }
            }
        },
       
        _drawMinorTicks: function (intervalValue, scaleGroup) {
            var majorPointX, minorPointX, y1, y2, x, tickIndex = 0;

            var isForward = (this._flowDirection == ej.datavisualization.BulletGraph.FlowDirection.Forward);
            var isHorizontal = (this._orientation == ej.datavisualization.BulletGraph.Orientation.Horizontal);

            var isTicksInside = (this._tickPlacement == 'inside');
            var locX = this._scale.location.x;
            var rangeSize = this.model.qualitativeRangeSize;
            var labelOffset = this._scale.labelSettings.offset;

            var majorTickSize = this._scale.majorTickSettings.size;
            var minorTickSize = this._scale.minorTickSettings.size;
            var minorTickWidth = this._scale.minorTickSettings.width;
            var scaleLength = this.model.quantitativeScaleLength;

            if (isForward)
                majorPointX = isHorizontal ? locX : locX + scaleLength;
            else
                majorPointX = isHorizontal ? locX + scaleLength - (minorTickWidth / 2) : locX;

            switch (this._tickPosition) {
                case 'far':
                    y1 = this._scale.location.y + rangeSize;
                    y2 = y1 + (isTicksInside ? -minorTickSize : minorTickSize);
                    break;
                case 'near':
                    y1 = this._scale.location.y + (isTicksInside ? minorTickSize : -minorTickSize);
                    y2 = this._scale.location.y;
                    break;                
                default:
                    y1 = this._scale.location.y + (rangeSize / 2) - (minorTickSize / 2);
                    y2 = y1 + minorTickSize;
                    break;
            }
            var maxLimit = this._scale.maximum;
            var min = this._scale.minimum;
            var interval = this._scale.interval;
            var minorTicksPerInterval = this._scale.minorTicksPerInterval;
           
            for (var i = min; i <= maxLimit; i += interval) {
                minorPointX = intervalValue / minorTicksPerInterval;

                for (var j = 1; j <= minorTicksPerInterval; j++) {
                    tickIndex++;
                    x = ((!isHorizontal && isForward) || (isHorizontal && !isForward))
                        ? majorPointX - minorPointX + (minorPointX / (minorTicksPerInterval + 1))
                        : majorPointX + minorPointX - (minorPointX / (minorTicksPerInterval + 1));

                    if (!isForward && isHorizontal) {
                        if (tickIndex >= ((maxLimit - min) * minorTicksPerInterval))
                            x += (minorTickWidth / 2);
                    }

                    if (this.model.applyRangeStrokeToTicks)
                       var strokeColor = this._bindingRangeStrokes(x);
                   
                    var options = this._minorTickLines(this._scale, x, y1, y2, strokeColor);
                    if (this.model.drawTicks) {
                        data = { majorTickSettings: this._scale.majorTickSettings, minorTickSettings: this._scale.minorTickSettings, minorTicksPerInterval: this._scale.minorTicksPerInterval, maximum: this._scale.maximum, minimum: this._scale.minimum, interval: this._scale.interval };
                        this._trigger("drawTicks", data);
                        this._scale = $.extend(this._scale, data);
                        options = this._minorTickLines(data, x, y1, y2, strokeColor);
                    }
                   
                    var chkMax;
                    if (!isForward && isHorizontal) {
                        chkMax = (scaleLength + locX + 1);
                        if (x <= chkMax && x >= locX + 1) {
                            var minorTicks = this.svgRenderer.createLine(options);
                            scaleGroup.appendChild(minorTicks);
                        }
                    }
                    else if (isForward && !isHorizontal) {
                        chkMax = (locX + 1);
                        if (x >= chkMax) {
                            var minorTicks = this.svgRenderer.createLine(options);
                            scaleGroup.appendChild(minorTicks);
                        }
                    }
                    else {
                        chkMax = scaleLength + locX + 1;
                        if (x <= chkMax) {
                            var minorTicks = this.svgRenderer.createLine(options);
                            scaleGroup.appendChild(minorTicks);
                        }
                    }
                    
                    minorPointX = (intervalValue / minorTicksPerInterval) * (j + 1);
                }
                majorPointX = ((!isForward && isHorizontal) || (isForward && !isHorizontal)) ? majorPointX - intervalValue : majorPointX + intervalValue;
            }
        },
        _minorTickLines: function (data, x, y1, y2, strokeColor) {
            var options = {
                'x1': x,
                'y1': y1,
                'x2': x,
                'y2': y2,
                'stroke-width': data.minorTickSettings.width,
                'stroke': (this.model.applyRangeStrokeToTicks && strokeColor) ? strokeColor : data.minorTickSettings.stroke
            };
            return options;
        },
       
        _drawLabels: function (intervalValue, scaleGroup) {
            var labelX, pointY, locale = this.model.locale, localizedText = locale && this.model.enableGroupSeparator, text, transformText;
            var isForward = (this._flowDirection == ej.datavisualization.BulletGraph.FlowDirection.Forward);
            var isHorizontal = (this._orientation == ej.datavisualization.BulletGraph.Orientation.Horizontal);

            var locX = this._scale.location.x;
            var offset = this._scale.labelSettings.offset;
            var scaleLength = this.model.quantitativeScaleLength;

            var majorTickWidth = this._scale.majorTickSettings.width;
            var displayText;
            if (isForward)
                labelX = isHorizontal ? locX : locX + scaleLength;
            else
                labelX = isHorizontal ? locX + scaleLength : locX;
            
            var placement = this._tickPosition + this._labelPlacement;
            var isLabelsBelow = (this._labelPosition == ej.datavisualization.BulletGraph.LabelPosition.Below);

            var locY = this._scale.location.y;
            var rangeSize = this.model.qualitativeRangeSize;
            var labelSize = this._scale.labelSettings.size;
            var majorTickSize = this._scale.majorTickSettings.size;

            switch (placement) {
                case 'faroutside':
                case 'centeroutside':                    
                    pointY = isLabelsBelow ? this._scale.location.y + rangeSize + offset + labelSize : this._scale.location.y - offset;
                    break;
                case 'farinside':
                case 'centerinside':
                    pointY = isLabelsBelow ? this._scale.location.y + rangeSize - offset : this._scale.location.y + offset + (isHorizontal ? labelSize : 0);
                    break;
                case 'nearoutside':
                    pointY = isLabelsBelow ? this._scale.location.y + rangeSize + offset + labelSize : this._scale.location.y - offset;
                    break;
                case 'nearinside':
                    pointY = isLabelsBelow ? this._scale.location.y + rangeSize - offset : this._scale.location.y + offset + labelSize;
                    break;
            }
            var min = this._scale.minimum;
            var max = this._scale.maximum;
            var interval = this._scale.interval;
            var isLabelsInside = (this._labelPlacement == "inside");

            for (var i = min; i <= max; i += interval) {               
                var y = pointY;
                var x = labelX;
                var font = this._scale.labelSettings.font;
                font.size = labelSize;
                var labelWidth = {width: 0, height: 0};
                if (!isHorizontal) {
                    var label = this._scale.labelSettings.labelPrefix + i + this._scale.labelSettings.labelSuffix;
                    switch (placement) {
                        case 'faroutside':
                        case 'centeroutside':
                            if (isLabelsBelow)
                                y -= labelSize;
                            else {
                                labelWidth = ej.EjSvgRender.utils._measureText(label, null, font);
                                y -= labelWidth.width;
                            }
                            break;
                        case 'farinside':
                        case 'centerinside':
                            if (isLabelsBelow) {                                
                                labelWidth = ej.EjSvgRender.utils._measureText(label, null, font);
                                y -= labelWidth.width;
                            }
                            break;
                        case 'nearoutside':
                            if (!isLabelsBelow) {
                                labelWidth = ej.EjSvgRender.utils._measureText(label, null, font);
                                y -= labelWidth.width;
                            }
                            else
                                y -= labelSize;
                            break;
                        case 'nearinside':
                            if (isLabelsBelow) {
                                labelWidth = ej.EjSvgRender.utils._measureText(label, null, font);
                                y -= labelWidth.width;
                            }
                            else
                                y -= labelSize;
                            break;
                    }                    
                    x -= labelSize/3;
                    transformText = 'rotate(' + 90 + ',' + (x) + ',' + (y) + ')';
                }
                else
                    transformText = 'rotate(' + 0 + ',' + (x) + ',' + (y) + ')';

                if (this.model.applyRangeStrokeToLabels)
                   var strokeColor = this._bindingRangeStrokes(labelX);
                var labelOptions = this._labelOptions(this.model.quantitativeScaleSettings.labelSettings, x, y, transformText,strokeColor);
                if (this.model.drawLabels) {
                    var data = { font: this._scale.labelSettings.font, labelPrefix: this._scale.labelSettings.labelPrefix, labelSuffix: this._scale.labelSettings.labelSuffix, offset: offset, size: labelSize, stroke: this._scale.labelSettings.stroke };
                    this._trigger("drawLabels", data);
                    labelOptions = this._labelOptions(data, x, y, transformText,strokeColor);
                }

                if (isForward)
                    labelX = isHorizontal ? labelX + intervalValue : labelX - intervalValue;
                else
                    labelX = isHorizontal ? labelX - intervalValue : labelX + intervalValue;
                
				 text = localizedText ? i.toLocaleString(locale) : i;
                 displayText = text;
                if (!ej.util.isNullOrUndefined(labelOptions.labelPrefix))
                    displayText = labelOptions.labelPrefix + text;
                if (!ej.util.isNullOrUndefined(labelOptions.labelSuffix))
                    displayText = displayText + labelOptions.labelSuffix;
                             
                this.svgRenderer.drawText(labelOptions,displayText, scaleGroup);
            }
        },

        _labelOptions: function (data, labelX, pointY, transformText, strokeColor) {
            var labelOptions = {
                'x': labelX,
                'y': pointY,
                'text-anchor': (this._orientation == ej.datavisualization.BulletGraph.Orientation.Horizontal) ? 'middle' : 'start',
                'fill': (this.model.applyRangeStrokeToLabels && strokeColor) ? strokeColor : data.stroke,
                'font-size': data.size + "px",
                'font-family': data.font.fontFamily,
                'font-style': data.font.fontStyle,
                'font-weight': data.font.fontWeight,
                'opacity': data.font.opacity,
                'transform': transformText,
             
            };
            if (data.labelPrefix != "")
                labelOptions.labelPrefix = data.labelPrefix;
            if (data.labelSuffix != "")
                labelOptions.labelSuffix = data.labelSuffix;
            return labelOptions;
        },
      
        _drawQualitativeRanges: function (scaleGroup) {
            var pointX = this._scale.location.x, pointY = this._scale.location.y, width;
            var isForward = (this._flowDirection == ej.datavisualization.BulletGraph.FlowDirection.Forward);
            var isHorizontal = (this._orientation == ej.datavisualization.BulletGraph.Orientation.Horizontal);
            var labelOffset = this._scale.labelSettings.offset;

            this._rangeCollection = [];

            var placement = this._tickPosition + this._labelPlacement;
            var isLabelBelow = (this._labelPosition == ej.datavisualization.BulletGraph.LabelPosition.Below);

            var scaleHeight = this.model.qualitativeRangeSize;
            
            var locX = this._scale.location.x;
            var min = this._scale.minimum;
            var max = this._scale.maximum;
            var scaleLength = this.model.quantitativeScaleLength;            

            for (var i = this.model.qualitativeRanges.length - 1; i >= 0; i--) {
                var data = { object: this, rangeIndex: i, rangeOptions: this.model.qualitativeRanges[i], rangeEndValue: this.model.qualitativeRanges[i].rangeEnd };
                if (this.model.drawQualitativeRanges)
                    this._trigger("drawQualitativeRanges", data);
                var rangeEnd = data.rangeEndValue;
                rangeEnd = (rangeEnd > max) ? max : rangeEnd;
                if (isForward) {
                    pointX = isHorizontal ? locX : locX + (scaleLength - scaleLength / ((max - min) / ((max - min) - (max - rangeEnd))));
                    width = isHorizontal ? scaleLength / ((max - min) / ((max - min) - (max - rangeEnd))) : scaleLength / ((max - min) / ((max - min) - (max - rangeEnd)));
                }
                else {
                    pointX = isHorizontal ? locX + (scaleLength - scaleLength / ((max - min) / ((max - min) - (max - rangeEnd)))) : locX;
                    width = isHorizontal ? scaleLength / ((max - min) / ((max - min) - (max - rangeEnd))) : scaleLength / ((max - min) / ((max - min) - (max - rangeEnd)));
                }
                var rangeOptions = {
                    'x': pointX,
                    'y': pointY,
                    'height': this.model.qualitativeRangeSize,
                    'width': (width > 0) ? (width < scaleLength ? width : scaleLength) : 0,
                    'fill': data.rangeOptions.rangeStroke,
                    'opacity': data.rangeOptions.rangeOpacity
                };
                ((isHorizontal && isForward) || (!isHorizontal && !isForward)) ? this._rangeCollection.push(width) : this._rangeCollection.push(pointX);                
                this.svgRenderer.drawRect(rangeOptions, scaleGroup);
            }
            this._rangeCollection.sort(this._sortRangeCollection);
        },
      
        _sortRangeCollection: function (a, b) {
            return (a - b);
        },
      
        _calculateFeatureMeasureBounds: function (value, categoryValue) {
            var min = this._scale.minimum;
            value = (value < min && min < 0) ? min : value;                
            if (value >= min) {
                var x, lx, width;
                var locX = this._scale.location.x;
                var scaleLength = this.model.quantitativeScaleLength;
                var diff = this._scale.maximum - this._scale.minimum;
                var valueDiff = this._scale.maximum - value;
                var orientation = this._flowDirection.toLowerCase() + this._orientation.toLowerCase();
                categoryValue = (categoryValue == null) ? "" : categoryValue;
                var font = this._scale.labelSettings.font;
                font.size = this._scale.labelSettings.size;
                var stringLength = ej.EjSvgRender.utils._measureText(categoryValue.toString(), null, font).width;

                switch (orientation) {
                    case 'forwardhorizontal':
                    case 'backwardvertical':                        
                            x = locX + ((min > 0) ? 0 : scaleLength / diff * Math.abs(min));
                            width = scaleLength / (diff / ( (min > 0) ? diff - valueDiff : value));                            
                            if (value < 0) {
                                width = Math.abs(width);
                                x -= width;
                            }
                            width = (x + width < locX + scaleLength) ? width : locX + scaleLength - x;
                            lx = locX - ((orientation == 'forwardhorizontal') ? (stringLength / 2 + this._scale.labelSettings.offset) : this._scale.labelSettings.offset);
                            break;
                    default:
                        x = locX + (scaleLength - scaleLength / (diff / (diff - valueDiff)));
                        width = (min > 0) ? scaleLength / (diff / (diff - valueDiff)) : scaleLength / (diff / (value));
                        if (value < 0) {
                            width = Math.abs(width);
                            x -= width;
                        }
                        if (x < locX ) {
                            width = x + width - locX;
                            x = locX;
                        }                        
                        lx = locX + scaleLength + ((orientation == 'backwardhorizontal') ? (stringLength / 2 + this._scale.labelSettings.offset) : this._scale.labelSettings.offset);
                        break;
                }
                return { pointX: x, Width: width, lPointX: lx };
            }
            return false;
        },
      
        _drawFeatureMeasureBar: function () {
            var j = 1, count, value, categoryValue, transformText;
            var pointY, lPointY, locale = this.model.locale, localizedText = locale && this.model.enableGroupSeparator;
            var isDataFields = (!ej.isNullOrUndefined(this.model.fields) && this.model.fields["dataSource"] != null);
            var isVertical = (this._orientation == ej.datavisualization.BulletGraph.Orientation.Vertical);
            var bulletValue = (typeof (this.model.value) == 'function') ? this._value() : this.model.value;
            if (this._dataCount > 0) {
                for (var i = this._dataCount - 1; i >= 0; i--) {
                    value = isDataFields ? this.model.fields["dataSource"][i][this.model.fields.featureMeasures] : (ej.isNullOrUndefined(this._scale.featureMeasures[i].value) ? bulletValue : this._scale.featureMeasures[i].value);
                    categoryValue = isDataFields ? this.model.fields["dataSource"][i][this.model.fields.category] : this._scale.featureMeasures[i].category;

                    pointY = this._scale.location.y + (((this.model.qualitativeRangeSize / this._dataCount) * j) / 2) - (this._scale.featuredMeasureSettings.width / 2);
                    lPointY = this._scale.location.y + (((this.model.qualitativeRangeSize / this._dataCount) * j) / 2) + (this._scale.featuredMeasureSettings.width / 2) - 1;

                    var bounds = this._calculateFeatureMeasureBounds(value, categoryValue);
                    if (bounds) {

                        var featureBarOptions = this._featureBar(this._scale, bounds.pointX, pointY, bounds.Width, i);
                        if (this.model.drawFeatureMeasureBar) {
                            var data = { featuredMeasureSettings: this._scale.featuredMeasureSettings };
                            this._trigger("drawFeatureMeasureBar", data);
                            featureBarOptions = this._featureBar(data, bounds.pointX, pointY, bounds.Width, i);
                        }
                        this.svgRenderer.drawRect(featureBarOptions, this._scaleGroup);

                        if (isVertical)
                            transformText = 'rotate(' + 90 + ',' + bounds.lPointX + ',' + (lPointY - 4) + ')';
                        else
                            transformText = 'rotate(' + 0 + ',' + bounds.lPointX + ',' + lPointY + ')';


                        var categoryOptions = this._drawcategory(this.model.quantitativeScaleSettings.labelSettings, bounds.lPointX, lPointY, transformText);
                        if (this.model.drawCategory) {
                            var data = { size: this.model.quantitativeScaleSettings.labelSettings.size, stroke: this.model.quantitativeScaleSettings.labelSettings.stroke, font: this.model.quantitativeScaleSettings.labelSettings.font, categoryValue: categoryValue };
                            this._trigger("drawCategory", data);
                            categoryOptions = this._drawcategory(data, bounds.lPointX, lPointY, transformText);
                            categoryValue = data.categoryValue;
                        }
                        if (!ej.isNullOrUndefined(categoryValue))
                            this.svgRenderer.drawText(categoryOptions, localizedText ? categoryValue.toLocaleString(locale) : categoryValue, this._scaleGroup);
                        j += 2;
                        this.value(value);
                    }
                }

            }
        },
        _drawcategory: function (category, lPointX, lPointY, transformText) {
            var categoryOptions = {
                'x': lPointX,
                'y': lPointY + (this._scale.featuredMeasureSettings.width / 2),
                'text-anchor': 'middle',
                'fill': category.stroke,
                'font-size': category.size + "px",
                'font-family': category.font.fontFamily,
                'font-style': category.font.fontStyle,
                'font-weight': category.font.fontWeight,
                'opacity': category.font.opacity,
                'transform': transformText
            };
            return categoryOptions;
        },
        _featureBar: function (data, pointX, pointY, width, i) {
            var featureBarOptions = {
                'class': this.svgObject.id + "_FeatureMeasure",
                'id': this.svgObject.id + "_FeatureMeasure_" + i,
                'x': pointX,
                'y': pointY,
                'height': data.featuredMeasureSettings.width,
                'width': width,
                'fill': data.featuredMeasureSettings.stroke            
            };           
            return featureBarOptions;
        },
       
        _drawComparativeMeasureSymbol: function () {
            var j = 1, value;
            var y1, y2, x1;

            var isForward = (this._flowDirection == ej.datavisualization.BulletGraph.FlowDirection.Forward);
            var isHorizontal = (this._orientation == ej.datavisualization.BulletGraph.Orientation.Horizontal);
            var bulletCMValue = (typeof (this.model.comparativeMeasureValue) == 'function') ? this._comparativeMeasureValue() : this.model.comparativeMeasureValue;
            if (this._dataCount > 0) {
                for (var i = this._dataCount - 1; i >= 0; i--) {
                    value = (!ej.isNullOrUndefined(this.model.fields) && this.model.fields["dataSource"] != null) ? this.model.fields["dataSource"][i][this.model.fields.comparativeMeasure] : (ej.isNullOrUndefined(this._scale.featureMeasures[i].comparativeMeasureValue) ? bulletCMValue : this._scale.featureMeasures[i].comparativeMeasureValue);
                    if (value >= this._scale.minimum && value <= this._scale.maximum) {
                        y1 = this._scale.location.y + (((this.model.qualitativeRangeSize / this._dataCount) * j) / 2) - (this._scale.featuredMeasureSettings.width / 2) - this._scale.featuredMeasureSettings.width;
                        y2 = this._scale.location.y + (((this.model.qualitativeRangeSize / this._dataCount) * j) / 2) - (this._scale.featuredMeasureSettings.width / 2) + (2 * this._scale.featuredMeasureSettings.width);
                        
                        if (isForward)
                            x1 = isHorizontal ? this._scale.location.x + (this.model.quantitativeScaleLength / ((this._scale.maximum - this._scale.minimum) / ((this._scale.maximum - this._scale.minimum) - (this._scale.maximum - value)))) : this._scale.location.x + (this.model.quantitativeScaleLength - (this.model.quantitativeScaleLength / ((this._scale.maximum - this._scale.minimum) / ((this._scale.maximum - this._scale.minimum) - (this._scale.maximum - value)))));
                        else
                            x1 = isHorizontal ? this._scale.location.x + (this.model.quantitativeScaleLength - (this.model.quantitativeScaleLength / ((this._scale.maximum - this._scale.minimum) / ((this._scale.maximum - this._scale.minimum) - (this._scale.maximum - value))))) : this._scale.location.x + (this.model.quantitativeScaleLength / ((this._scale.maximum - this._scale.minimum) / ((this._scale.maximum - this._scale.minimum) - (this._scale.maximum - value))));

                        var compareMeasureOptions = this._compareMeasure(this._scale, x1, y1, y2, i, value);
                        if (this.model.drawComparativeMeasureSymbol) {
                            var data = { comparativeMeasureSettings: this._scale.comparativeMeasureSettings };
                            this._trigger("drawComparativeMeasureSymbol", data);
                            compareMeasureOptions = this._compareMeasure(data, x1, y1, y2, i, value);
                        }
                       
                        this.svgRenderer.drawLine(compareMeasureOptions, this._scaleGroup);
                        j += 2;
                        this.comparativeMeasureValue(value);
                    }
                }
            }
        },
        _compareMeasure: function(data, x1, y1, y2, i, value){
            var compareMeasureOptions = {
                'class': this.svgObject.id + "_ComparativeMeasure",
                'id': this.svgObject.id + "_ComparativeMeasure_" + i,
                'x1': (value == this._scale.maximum) ? x1 - (data.comparativeMeasureSettings.width / 2) : (value == this._scale.minimum) ? x1 + (data.comparativeMeasureSettings.width / 2) : x1,
                'y1': y1,
                'x2': (value == this._scale.maximum) ? x1 - (data.comparativeMeasureSettings.width / 2) : (value == this._scale.minimum) ? x1 + (data.comparativeMeasureSettings.width / 2) : x1,
                'y2': y2,
                'stroke-width': data.comparativeMeasureSettings.width,
                'stroke': data.comparativeMeasureSettings.stroke
            };
            return compareMeasureOptions;
        },
       
        _setTheme: function (jsonObj, themeName) {
            var result = [];
            this._scale = this.model.quantitativeScaleSettings;
            for (var name in jsonObj) {
                result.push(name);
            }
            for (var i = 0; i < result.length; i++) {
                this._scale.majorTickSettings.stroke = ((!this._scale.majorTickSettings.stroke || this._scale.majorTickSettings.stroke == jsonObj[result[i]].quantitativeScaleSettings.majorTickSettings.stroke) ? jsonObj[themeName].quantitativeScaleSettings.majorTickSettings.stroke : this._scale.majorTickSettings.stroke);
                this._scale.minorTickSettings.stroke = ((!this._scale.minorTickSettings.stroke || this._scale.minorTickSettings.stroke == jsonObj[result[i]].quantitativeScaleSettings.minorTickSettings.stroke) ? jsonObj[themeName].quantitativeScaleSettings.minorTickSettings.stroke : this._scale.minorTickSettings.stroke);
                this._scale.labelSettings.stroke = ((!this._scale.labelSettings.stroke || this._scale.labelSettings.stroke == jsonObj[result[i]].quantitativeScaleSettings.labelSettings.stroke) ? jsonObj[themeName].quantitativeScaleSettings.labelSettings.stroke : this._scale.labelSettings.stroke);
                this._scale.featuredMeasureSettings.stroke = ((!this._scale.featuredMeasureSettings.stroke || this._scale.featuredMeasureSettings.stroke == jsonObj[result[i]].quantitativeScaleSettings.featuredMeasureSettings.stroke) ? jsonObj[themeName].quantitativeScaleSettings.featuredMeasureSettings.stroke : this._scale.featuredMeasureSettings.stroke);
                this._scale.comparativeMeasureSettings.stroke = ((!this._scale.comparativeMeasureSettings.stroke || this._scale.comparativeMeasureSettings.stroke == jsonObj[result[i]].quantitativeScaleSettings.comparativeMeasureSettings.stroke) ? jsonObj[themeName].quantitativeScaleSettings.comparativeMeasureSettings.stroke : this._scale.comparativeMeasureSettings.stroke);
                this.model.captionSettings.font.color = ((!this.model.captionSettings.font.color || this.model.captionSettings.font.color == jsonObj[result[i]].captionSettings.font.color) ? jsonObj[themeName].captionSettings.font.color : this.model.captionSettings.font.color);
                this.model.captionSettings.subTitle.font.color = ((!this.model.captionSettings.subTitle.font.color || this.model.captionSettings.subTitle.font.color == jsonObj[result[i]].captionSettings.subTitle.font.color) ? jsonObj[themeName].captionSettings.subTitle.font.color : this.model.captionSettings.subTitle.font.color);
                this.model.captionSettings.indicator.font.color = ((!this.model.captionSettings.indicator.font.color || this.model.captionSettings.indicator.font.color == jsonObj[result[i]].captionSettings.indicator.font.color) ? jsonObj[themeName].captionSettings.indicator.font.color : this.model.captionSettings.indicator.font.color);
                this.model.captionSettings.indicator.symbol.color = ((!this.model.captionSettings.indicator.symbol.color || this.model.captionSettings.indicator.symbol.color == jsonObj[result[i]].captionSettings.indicator.symbol.color) ? jsonObj[themeName].captionSettings.indicator.symbol.color : this.model.captionSettings.indicator.symbol.color);
                for (var j = 0; j < this.model.qualitativeRanges.length; j++)
                    this.model.qualitativeRanges[j].rangeStroke = ((!this.model.qualitativeRanges[j].rangeStroke) ? (ej.isNullOrUndefined(jsonObj[themeName].qualitativeRanges[j]) ? jsonObj[themeName].qualitativeRanges[0].rangeStroke : jsonObj[themeName].qualitativeRanges[j].rangeStroke) : this.model.qualitativeRanges[j].rangeStroke);
            }
            //            this.model = $.extend(true, this.model, jsonObj[themeName], this.model);
        },

      
       
        _onDrawQualitativeRanges: function (rangeOptions, rangeEnd, rangeIndex) {
            var data = { object: this, scaleElement: this.model.quantitativeScaleSettings, rangeIndex: rangeIndex, rangeElement: rangeOptions, rangeEndValue: rangeEnd };
            this._trigger("drawQualitativeRanges", data);
        },
        
       
        _doAnimation: function () {
            var elements = $("." + this.svgObject.id + "_FeatureMeasure");
            for (var i = elements.length - 1; i >= 0; i--) {
                var element = elements[i];
                this._animateFeatureBar(element);
            }
        },
      
        _doLineAnimation: function () {
            var compareElements = $("." + this.svgObject.id + "_ComparativeMeasure");
            var secondsPerPoint = 2000 / compareElements.length;
            for (var i = compareElements.length - 1; i >= 0; i--) {
                var element = compareElements[i];
                $(element).attr("transform", "scale(0)");
                this._doLineSymbol(element, secondsPerPoint, i);
            }
        },
       
        _animateFeatureBar: function (element) {
            var box = element.getBBox();
            var left, top, scaleVal;
            if (((this._orientation == ej.datavisualization.BulletGraph.Orientation.Horizontal) && (this._flowDirection == ej.datavisualization.BulletGraph.FlowDirection.Backward)) || ((this._orientation == ej.datavisualization.BulletGraph.Orientation.Vertical) && (this._flowDirection == ej.datavisualization.BulletGraph.FlowDirection.Forward))) {
                left = box.x + box.width;
                top = box.y + box.height;
            }
            else {
                left = box.x;
                top = box.y;
            }
            $(element).animate(
            {
                scale: 1
            },
            {
                duration: 1000,

                step: function (now) {
                    scaleVal = now;
                    $(element).attr("transform", "translate(" + left + " " + top + ") scale(" + now + ",1) translate(" + (-left) + " " + (-top) + ")");
                }
            });
        },
      
        _doLineSymbol: function (element, sec, val) {
            var beginTime = parseInt(val * sec);
            var box = element.getBBox();
            var centerX = box.x + (box.width / 2);
            var centerY = box.y + (box.height / 2);
            $(element).delay(beginTime).animate(
                {
                    scale: 1
                },
                {
                    duration: 200,
                    step: function (now) {
                        $(element).attr("transform", "translate(" + centerX + " " + centerY + ") scale(" + now + ") translate(" + (-centerX) + " " + (-centerY) + ")");
                    }
                });
        },
      
        bindEvents: function () {
            var browserInfo = ej.EjSvgRender.utils.browserInfo(),
            isPointer = browserInfo.isMSPointerEnabled,
            isIE11Pointer = browserInfo.pointerEnabled,
            touchStartEvent = isPointer ? (isIE11Pointer ? "pointerdown" : "MSPointerDown") : "touchstart mousedown",
            touchStopEvent = isPointer ? (isIE11Pointer ? "pointerup" : "MSPointerUp") : "touchend mouseup",
            touchMoveEvent = isPointer ? (isIE11Pointer ? "pointermove" : "MSPointerMove") : "touchmove mousemove",
            touchCancelEvent = isPointer ? (isIE11Pointer ? "pointerleave" : "MSPointerOut") : "touchleave mouseleave";
            this.model.browserInfo = browserInfo;

            this._on($(this.svgObject), touchMoveEvent, this._bulletMouseMove);
            this._on($(this.svgObject), touchCancelEvent, this._bulletMouseLeave);
            this._on($(this.svgObject), touchStartEvent, this._bulletMouseDown);
            this._on($(this.svgObject), touchStopEvent, this._bulletMouseUp);
            this._on($(this.svgObject), "contextmenu", this._bulletRightClick);
            this._on($(this.svgObject), "click", this._bulletClick);
             
            if (this.model.enableResizing || this.model.isResponsive) {
                if (!ej.isTouchDevice())
                    this._on($(window), "resize", this._bulletResize);
                else
                    this._on($(window), "orientationchange", this._bulletResize);
            }
        },

        _unwireEvents: function(){
            this._off($(this.svgObject), "contextmenu", this._bulletRightClick);
            this._off($(this.svgObject), "click", this._bulletClick);
        },
       
        isDevice: function () {
            // return (/mobile|tablet|android|kindle/i.test(navigator.userAgent.toLowerCase()));
            // comment above line temporary. Due to the below code event wont bind for tablet device
            return (/mobile|tablet|android|kindle/i.test(navigator.userAgent.toLowerCase()));
        },
       
        _bulletResize: function () {
            var bullet = this,
				height = this.model.height,
				width = this.model.width;
            var $svgObj = $(bullet.svgObject);
            var height = 90;
            var width = (ej.isTouchDevice()) ? 250 : 595;
            var containerWidth = $(bullet.element).width();
            if (bullet.model.width)
                width = parseInt(bullet.model.width);
            else if (containerWidth > 0 && containerWidth < 595)
                width = containerWidth;
            else if(containerWidth > 595)
                width = 595;
            if (bullet.model.height)
                height = parseInt(bullet.model.height);
            var containerHeight = $(bullet.element).height() > height ? height : $(bullet.element).height();
            if (this.resizeTO) clearTimeout(this.resizeTO);
            this.resizeTO = setTimeout(function () {
				if(width < $(bullet.element).width())
					$svgObj.width(width);
				else
					$svgObj.width($(bullet.element).width());
                $svgObj.height(containerHeight);
                bullet.redraw();
            }, 500);
        },
		
        _bulletMouseLeave: function (evt) {
            if (!this.isTouch(evt)) {
                $('#tooltip').remove();
                $(".tooltipDiv" + this._id).remove();            
            }
		},
		isTouch: function (evt) {
		    var event = evt.originalEvent ? evt.originalEvent : evt;
		    if ((event.pointerType == "touch") || (event.pointerType == 2) || (event.type.indexOf("touch") > -1))
		        return true;
		    return false;
		},
       
        _bulletMouseMove: function (evt) {
            var currentVal, targetVal, categoryVal, measureId, targetId, targetClass;        
            targetId = $(evt.target).attr("id"),
            targetClass = $(evt.target).attr("class");           
            if (!this.isTouch(evt)) {
                $('#tooltip').remove();
                $(".tooltipDiv" + this._id).remove();
                this._elementTooltip(evt, targetClass, targetId);
                this._displayTooltip(evt, targetClass, targetId);
            }
         
        },

        _bulletMouseDown: function (evt) {
            if (this.isTouch(evt)) {
                $('#tooltip').remove();
                $(".tooltipDiv" + this._id).remove();
                var targetId = $(evt.target).attr("id"),
                    targetClass = $(evt.target).attr("class");
                this._elementTooltip(evt, targetClass, targetId);
                this._displayTooltip(evt, targetClass, targetId);
            }
            if(ej.isTouchDevice() && this.model.rightClick != '')
                this._longPressTimer = new Date();
        },
        _bulletMouseUp: function (evt) {
            if (this.isTouch(evt)) {
                var bullet = this, element;
                window.clearTimeout(bullet.model.timer);
                if ($(".tooltipDiv" + this._id).length == 1)
                    element = $(".tooltipDiv" + this._id);
                if (element) {                   
                    bullet.model.trackerElement = element;
                    bullet.model.timer = setTimeout(function () {
                        if (bullet.model.trackerElement)
                            $(".tooltipDiv" + bullet._id).fadeOut(500, function () {
                                $(".tooltipDiv" + bullet._id).remove();
                                $("[id*=" + bullet.svgObject.id + "_FeatureMeasure_" + "]").attr("opacity", "1");
                            });
                    }, 1200);
                }
            }
            if(ej.isTouchDevice() && this.model.rightClick != '' && new Date() - this.model._longPressTimer > 1500)
                this._bulletRightClick(evt);
        },

        _bulletClick: function(e){
            var end = new Date();
            if(this.model.click != '')
                this._trigger("click", {data: {event: e}});
            if(this._doubleTapTimer != null && end - this._doubleTapTimer < 300)
                this._bulletDoubleClick(e);
            this._doubleTapTimer = end;
        },

        _bulletDoubleClick: function(e){
            if(this.model.doubleClick != '')
                this._trigger("doubleClick", {data: {event: e}});
        },

        _bulletRightClick: function(e){
            if(this.model.rightClick != '')
                this._trigger("rightClick", { data:{event: e}});
        },

        _elementTooltip: function (evt,targetClass, targetId) {             
            var captionSettings = this.model.captionSettings,
             tooltipdiv = $("<div></div>").attr({ 'id': 'tooltip', "class": "tooltipDiv" + this._id }),
             pointer = this.mousePosition(evt);
           var str = "";
            // adding css prop to the div
            $(tooltipdiv).css({
                "left": pointer.pageX + 10,
                "top": pointer.pageY + 10,
                "display": "block",
                "position": "absolute",
                "z-index": "13000",
                "cursor": "default",
                "font-family": "Segoe UI",
                "color": "#707070",
                "font-size": "12px",
                "background-color": "#FFFFFF",
                "border": "1px solid #707070"
            });
            if (targetClass == this.svgObject.id + "_Caption")
                str = evt.target.textContent == captionSettings.text ? "" : captionSettings.text;
            else if (targetClass == this.svgObject.id + "_SubTitle")
                str = evt.target.textContent == captionSettings.subTitle.text ? "" : captionSettings.subTitle.text;
            else if (targetClass == this.svgObject.id + "_Indicator")
                str = evt.target.textContent == captionSettings.indicator.text ? "" : captionSettings.indicator.text;
            if (str != "") {
                $(tooltipdiv).html("&nbsp" + str + "&nbsp");
                $(document.body).append(tooltipdiv);
            }
            else if (this.model.tooltipSettings.enableCaptionTooltip && (targetClass == this.svgObject.id + '_Caption' || targetClass == this.svgObject.id + '_SubTitle' || targetClass == this.svgObject.id + '_Indicator')) {
                var text = $('.' + targetClass).text();
                var data = { Text: text };
                var template = this.model.tooltipSettings.captionTemplate;
                if ($('.tooltipDiv' + this._id).length == 0) {
                    tooltipdiv = $("<div></div>").attr('class', 'tooltipDiv' + this._id).css({ 'position': 'absolute', 'z-index': '13000', 'display': 'block' });                   
                    $(document.body).append(tooltipdiv);
                    
                }
                if (template != "" && template != null) {
                    var cloneNode = document.getElementById(template);
                    cloneNode = (cloneNode ? $(cloneNode).clone() : $(template));
                    $(cloneNode).css("display", "block").appendTo(tooltipdiv);
                    $(tooltipdiv).html($(cloneNode).render(data));
                } else {
                    $(tooltipdiv).html(text);
                }
                $(tooltipdiv).css('font-size', '12px');
                var xPos = pointer.clientX + $(document).scrollLeft() + 10;
                var yPos = pointer.clientY + $(document).scrollTop() + 10;
                xPos = ((xPos + $(tooltipdiv).width()) < $(window).width()) ? (xPos) : (xPos - $(tooltipdiv).width());
                yPos = ((yPos + $(tooltipdiv).height()) < $(window).height()) ? (yPos) : (yPos - $(tooltipdiv).height());

                if (xPos === undefined || xPos === null)
                    xPos = pointer.clientX + $(document).scrollLeft() + 10;
                if (yPos === undefined || yPos === null)
                    yPos = pointer.clientY + $(document).scrollTop() + 10;
                $(tooltipdiv).css({
                    'left': xPos,
                    'top': yPos,
                    '-webkit-border-radius': "5px 5px 5px 5px",
                    '-moz-border-radius': "5px 5px 5px 5px",
                    '-o-border-radius': "5px 5px 5px 5px",
                    'border-radius': "5px 5px 5px 5px",
                    'background-color': "White",
                    'border': "1px Solid Black",
                    'padding-bottom': "5px",
                    'padding-left': "5px",
                    'padding-right': "5px",
                    'padding-top': "5px"
                });

            }
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
        _displayTooltip: function (evt, targetClass, targetId) {
            if (targetClass != "undefined" && (targetClass == this.svgObject.id + '_FeatureMeasure' || targetClass == this.svgObject.id + '_ComparativeMeasure')) {
                var locale = this.model.locale, localizedText = locale && this.model.enableGroupSeparator, data, measureId, currentVal, targetVal, categoryVal, tooltipdiv;
                var bulletValue = (typeof (this.model.value) == 'function') ? this._value() : this.model.value,
                 bulletCMValue = (typeof (this.model.comparativeMeasureValue) == 'function') ? this._comparativeMeasureValue() : this.model.comparativeMeasureValue,
                 pointer = this.mousePosition(evt);
                measureId = targetId.substring(targetId.lastIndexOf("_") + 1);
                currentVal = (!ej.isNullOrUndefined(this.model.fields) && this.model.fields["dataSource"] != null) ? this.model.fields["dataSource"][measureId][this.model.fields.featureMeasures] : (ej.isNullOrUndefined(this._scale.featureMeasures[measureId].value) ? bulletValue : this._scale.featureMeasures[measureId].value);
                targetVal = (!ej.isNullOrUndefined(this.model.fields) && this.model.fields["dataSource"] != null) ? this.model.fields["dataSource"][measureId][this.model.fields.comparativeMeasure] : (ej.isNullOrUndefined(this._scale.featureMeasures[measureId].comparativeMeasureValue) ? bulletCMValue : this._scale.featureMeasures[measureId].comparativeMeasureValue);
                categoryVal = (!ej.isNullOrUndefined(this.model.fields) && this.model.fields["dataSource"] != null) ? (ej.isNullOrUndefined(this.model.fields["dataSource"][measureId][this.model.fields.category])) ? null : this.model.fields["dataSource"][measureId][this.model.fields.category] : (ej.isNullOrUndefined(this._scale.featureMeasures[measureId].category)) ? null : this._scale.featureMeasures[measureId].category;
				if (localizedText)
					data = {currentValue: currentVal.toLocaleString(locale), targetValue: targetVal.toLocaleString(locale), 
							category: (!ej.util.isNullOrUndefined(categoryVal) ? categoryVal.toLocaleString(locale) : categoryVal)};
				else
					data = {currentValue: currentVal, targetValue: targetVal, category: categoryVal};
                if ($('.tooltipDiv' + this._id).length == 0) {
                    tooltipdiv = $("<div></div>").attr('class', 'tooltipDiv' + this._id).css({ 'position': 'absolute', 'z-index': '13000', 'display': 'block' });                  
                    $(document.body).append(tooltipdiv);                   
                }
                if (this.model.tooltipSettings.template != "" && this.model.tooltipSettings.template != null) {
                    var cloneNode = $("#" + this.model.tooltipSettings.template).clone();
                    $(cloneNode).css("display", "block").appendTo(tooltipdiv);
                    $(tooltipdiv).html($(cloneNode).render(data));
                } else {
                    var category = (!ej.isNullOrUndefined(data.category)) ? ("<br/> Category : " + data.category) : "";
                    $(tooltipdiv).html("Current : " + data.currentValue + "<br/> Target : " + data.targetValue + category);
                }
                $(tooltipdiv).css("font-size", "12px");
                var xPos = pointer.clientX + $(document).scrollLeft() + 10;
                var yPos = pointer.clientY + $(document).scrollTop() + 10;
                xPos = ((xPos + $(tooltipdiv).width()) < $(window).width()) ? (xPos) : (xPos - $(tooltipdiv).width());
                yPos = ((yPos + $(tooltipdiv).height()) < $(window).height()) ? (yPos) : (yPos - $(tooltipdiv).height());

                if (xPos === undefined || xPos === null)
                    xPos = pointer.clientX + $(document).scrollLeft() + 10;
                if (yPos === undefined || yPos === null)
                    yPos = pointer.clientY + $(document).scrollTop() + 10;
                $(tooltipdiv).css({
                    'left': xPos,
                    'top': yPos,
                    '-webkit-border-radius': "5px 5px 5px 5px",
                    '-moz-border-radius': "5px 5px 5px 5px",
                    '-o-border-radius': "5px 5px 5px 5px",
                    'border-radius': "5px 5px 5px 5px",
                    'background-color': "White",
					'color':"black",
                    'border': "1px Solid Black",
                    'padding-bottom': "5px",
                    'padding-left': "5px",
                    'padding-right': "5px",
                    'padding-top': "5px"
                });
                if (targetClass == this.svgObject.id + '_FeatureMeasure')
                    $("#" + targetId).attr("opacity", "0.7");
            }          
            
        },

       
        redraw: function () {
            $(this.svgObject).empty();
            this._renderBulletElements();
        },
        
        destroy: function () {
            this._unwireEvents();
            $(this.element).removeClass("e-bulletgraph e-js").find("#" + this.svgObject.id).remove();
        },
          
        setFeatureMeasureBarValue: function (index, measureValue) {
            this._scale = this.model.quantitativeScaleSettings;
            var length = (!ej.isNullOrUndefined(this.model.fields) && this.model.fields["dataSource"] != null) ? this.model.fields["dataSource"].length : this._scale.featureMeasures.length;   
            if (index < length && measureValue != null) {
                if (!ej.isNullOrUndefined(this.model.fields) && this.model.fields["dataSource"] != null)
                    this.model.fields["dataSource"][index][this.model.fields.featureMeasures] = measureValue;
                else
                    this._scale.featureMeasures[index].value = measureValue;
                this.redraw();
                if (this.model.enableAnimation)
                    this._doAnimation();
            }
        },
          
        setComparativeMeasureSymbol: function (index, measureValue) {
            this._scale = this.model.quantitativeScaleSettings;
            var length = (!ej.isNullOrUndefined(this.model.fields) && this.model.fields["dataSource"] != null) ? this.model.fields["dataSource"].length : this._scale.featureMeasures.length;   
            if (index < length && measureValue != null) {
                if (!ej.isNullOrUndefined(this.model.fields) && this.model.fields["dataSource"] != null)
                    this.model.fields["dataSource"][index][this.model.fields.comparativeMeasure] = measureValue;
                else
                    this._scale.featureMeasures[index].comparativeMeasureValue = measureValue;
                this.redraw();
                if (this.model.enableAnimation)
                    this._doLineAnimation();
            }
        }

    });
      
    ej.datavisualization.BulletGraph.Orientation = {
          
        Horizontal: "horizontal",
          
        Vertical: "vertical"
    };
      
    ej.datavisualization.BulletGraph.TickPlacement = {
          
        Inside: "inside",
          
        Outside: "outside"
    };
      
    ej.datavisualization.BulletGraph.LabelPlacement = {
          
        Inside: "inside",
          
        Outside: "outside"
    };
      
    ej.datavisualization.BulletGraph.Shape = {
          
        Circle: "circle",
          
        Cross: "cross",
          
        Diamond: "diamond",
          
        DownArrow: "downarrow",
          
        Ellipse: "ellipse",
          
        HorizontalLine: "horizontalLine",
          
        Image: "image",
          
        InvertedTriangle: "invertedtriangle",
          
        LeftArrow: "leftarrow",
          
        Pentagon: "pentagon",
          
        Rectangle: "Rectangle",
          
        RightArrow: "rightarrow",
          
        Star: "star",
          
        Trapezoid: "trapezoid",
          
        Triangle: "triangle",
          
        UpArrow: "uparrow",
          
        VerticalLine: "verticalline",
          
        Wedge: "wedge",
    };
      
    ej.datavisualization.BulletGraph.TickPosition = {
          
        Far: "far",
          
        Near: "near",
          
        Center: "center"
    };
      
    ej.datavisualization.BulletGraph.LabelPosition = {
          
        Below: "below",
          
        Above: "above"
    };
      
    ej.datavisualization.BulletGraph.FlowDirection = {
          
        Forward: "forward",
          
        Backward: "backward"
    };
      
    ej.datavisualization.BulletGraph.FontStyle = {
          
        Normal: "Normal",
          
        Italic: "Italic",
          
        Oblique: "Oblique"
    };
      
    ej.datavisualization.BulletGraph.FontWeight = {
          
        Normal: "Normal",
          
        Bold: "Bold",
          
        Bolder: "Bolder",
          
        Lighter: "Lighter"
    };
      
    ej.datavisualization.BulletGraph.Themes = {
          
        flatlight: {
            quantitativeScaleSettings: {
                majorTickSettings: { stroke: "#191919" },
                minorTickSettings: { stroke: "#191919" },
                labelSettings: {
                    stroke: "#191919"
                },
                featuredMeasureSettings: { stroke: "#191919" },
                comparativeMeasureSettings: { stroke: "#191919" }
            },
            qualitativeRanges: [{
                rangeStroke: "#ebebeb"
            }, {
                rangeStroke: "#d8d8d8"
            }, {
                rangeStroke: "#7f7f7f"
            }],
            captionSettings: {
                font: { color: "#191919" },
                subTitle: {
                    font: { color: "#191919" }
                },
                indicator: {
                    font: { color: "#191919" },
                    symbol: { color: "#191919" }
                }
            }
        },
        material: {
            quantitativeScaleSettings: {
                majorTickSettings: { stroke: "#333333" },
                minorTickSettings: { stroke: "#191919" },
                labelSettings: {
                    stroke: "#333333"
                },
                featuredMeasureSettings: { stroke: "#333333" },
                comparativeMeasureSettings: { stroke: "#333333" }
            },
            qualitativeRanges: [{
                rangeStroke: "#ebebeb"
            }, {
                rangeStroke: "#d8d8d8"
            }, {
                rangeStroke: "#7f7f7f"
            }],
            captionSettings: {
                font: { color: "#333333" },
                subTitle: {
                    font: { color: "#333333" }
                },
                indicator: {
                    font: { color: "#333333" },
                    symbol: { color: "#333333" }
                }
            }
        },
          
        flatdark: {
              
            quantitativeScaleSettings: {
                majorTickSettings: { stroke: "#ffffff" },
                minorTickSettings: { stroke: "#ffffff" },
                labelSettings: {
                    stroke: "#ffffff"
                },
                featuredMeasureSettings: { stroke: "#ffffff" },
                comparativeMeasureSettings: { stroke: "#ffffff" }
            },
            qualitativeRanges: [{
                rangeStroke: "#b3b3b3"
            }, {
                rangeStroke: "#999999"
            }, {
                rangeStroke: "#4d4d4d"
            }],
            captionSettings: {
                font: { color: "#ffffff" },
                subTitle: {
                    font: { color: "#ffffff" }
                },
                indicator: {
                    font: { color: "#ffffff" },
                    symbol: { color: "#ffffff" }
                }
            }
        }
    };

})(jQuery, Syncfusion);
