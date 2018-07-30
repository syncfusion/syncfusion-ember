/**
* @fileOverview Plugin to style the Barcode elements
* @copyright Copyright Syncfusion Inc. 2001 - 2014. All rights reserved.
* Use of this code is subject to the terms of our license.
* A copy of the current license can be obtained at any time by e-mailing
* licensing@syncfusion.com. Any infringement will be prosecuted under
* applicable laws.
* @version 12.1
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {
    /** ejBarcode is the plugin name.*/
    /** "ej.datavisualization.Barcode" is "namespace.className" will hold functions and properties.*/
   
    ej.widget("ejBarcode", "ej.datavisualization.Barcode", {
        /** Widget element will be automatically set in this*/
        element: {
            target: null
        },

        /** User defined model will be automatically set in this*/
        model: null,
        validTags: ["div", "span"],
        _rootCSS: "e-barcode",

        defaults: {
            displayText: true,
            text: "",
            height: "",
            width: "",
            symbologyType: "qrbarcode",
            textColor: 'black',
            lightBarColor: 'white',
            darkBarColor: 'black',
            quietZone: {
                left: 1,
                top: 1,
                right: 1,
                bottom: 1,
                all: 1
            },
            narrowBarWidth: 1,
            wideBarWidth: 3,
            barHeight: 150,
            barcodeToTextGapHeight: 10,
            xDimension: 4,
            encodeStartStopSymbol: true,
            load: null,
            enabled: true,
        },

        /**
         * Specify the data types for default properties 
         * @private
         */
        dataTypes: {
            displayText: "boolean",
            text: "string",
            enabled: "boolean",
            symbologyType: "enum",
            narrowBarWidth: "number",
            wideBarWidth: "number",
            barHeight: "number",
            encodeStartStopSymbol: "boolean"
        },

        /**
         * @private
         */
        _defaultScaleValues: function () {
            return {
                enabled: true,
                displayText: true,
                text: "",
                symbologyType: "qrbarcode",
                textColor: 'black',
                lightBarColor: 'white',
                darkBarColor: 'black',
                quietZone: { left: 1, top: 1, right: 1, bottom: 1 },
                narrowBarWidth: 1,
                wideBarWidth: 3,
                barHeight: 150,
                barcodeToTextGapHeight: 10,
                xDimension: 4,
                encodeStartStopSymbol: true
            };
        },

        /**
         * @constructor
         * @private
         */
        _init: function () {
            this._initialize();
            this._renderBarcode();
        },

        /**
         * @private
         */
        _destroy: function () {
            this.element.empty();
        },

        /**
        * To configure the properties at runtime using SetModel		
        * @private
        */
        _setModel: function (options) {
            var option;
            for (option in options) {
                switch (option) {
                    case "enabled": this._disabled(!options[option]); break;
                    case "height": this.model.height = options[option]; break;
                    case "width": this.model.width = options[option]; break;
                    case "lightBarColor": this.model.lightBarColor = options[option]; break;
                    case "darkBarColor": this.model.darkBarColor = options[option]; break;
                    case "textColor": this.model.textColor = options[option]; break;
                    case "displayText": this.model.displayText = options[option]; break;
                    case "quietZone": this.model.quietZone = options[option]; break;
                    case "narrowBarWidth": this.model.narrowBarWidth = options[option]; break;
                    case "wideBarWidth": this.model.wideBarWidth = options[option]; break;
                    case "barHeight": this.model.barHeight = options[option]; break;
                    case "xDimension": this.model.xDimension = options[option]; break;
                    case "encodeStartStopSymbol": this.model.encodeStartStopSymbol = options[option]; break;
                    case "symbologyType":
                        this.model.symbologyType = options[option];
                        this._itemInitialize();
                        break;
                    case "text":
                        this.model.text = options[option];
                        this._itemInitialize();
                        break;
                }
            }
            this._renderBarcode();
        },

        /**
         * Initializes control.
         * @private
         */
        _initialize: function () {
            this.BarcodeEl = this.element;
            this.target = this.element[0];
            this._itemInitialize();
            this.Model = this.model;
        },

        /**
         * Renders barcode.
         * @private
         */
        _renderBarcode: function () {
            this.initialize();
        },

        /**
         * @private
         */
        _itemInitialize: function () {
            var proxy = this;
            if (this.model.scales != null) {
                $.each(this.model.scales, function (index, element) {
                    element = proxy._checkArrayObject(element, index);
                    var obj = proxy._defaultScaleValues();
                    $.extend(obj, element);
                    $.extend(element, obj);
                });
            }
            else {
                this.model.scales = [this._defaultScaleValues()];
            }
        },

        /**
         * @private
         */
        _checkArrayObject: function (element, initialName) {
            var proxy = this;
            $.each(element, function (name, innerElement) {
                if (innerElement instanceof Array) {
                    innerElement = proxy._checkArrayObject(innerElement, name);
                }
                else if (innerElement != null && typeof innerElement == "object") {
                    var allObjects = proxy._defaultScaleValues();
                    innerElement = proxy._LoadIndividualDefaultValues(innerElement, allObjects, (typeof name === "number") ? initialName : name);
                }
            });
            return element;
        },

        /**
         * @private
         */
        _LoadIndividualDefaultValues: function (obj, allObjects, name) {
            var defaultObj = null;
            var proxy = this;
            $.each(allObjects, function (n, element) {
                if (name == n) {
                    defaultObj = element;
                    return;
                }
            });
            if (defaultObj instanceof Array) defaultObj = defaultObj[0];

            $.each(obj, function (objName, Ele) {
                if (Ele instanceof Array) {
                    Ele = proxy._checkArrayObject(Ele, name);
                }
                else if (Ele != null && typeof Ele == "object") {
                    Ele = proxy._LoadIndividualDefaultValues(Ele, defaultObj, (typeof objName === "number") ? name : objName);
                }
            });

            $.extend(defaultObj, obj);
            $.extend(obj, defaultObj);
            return obj;
        },

        /**
         * Initializes the control.
         * @private
         */
        initialize: function () {
            if (!this.model.enabled)
                return;

            this._initObject(this);

            if (this.Model.text != null)
                this._findBarcodeType();
        },

        /**
        * To enable the barcode 
        */
        enable: function () {
            if (!this.model.enabled) {
                this.element.removeClass("e-disable");
                this.model.enabled = true;
            }
        },
        
        /**
        * To change the height of Barcode
        */
        height: function (value) {
            this.Model.height = value;
        },
        
        /**
        * To change the width of Barcode
        */
        width: function (value) {
            this.Model.width = value;
        },
        
        /**
        * To resize the barcode 
        */
        resize: function () {
            if (this.Model.text != null)
                this._findBarcodeType();
        },

        /**
        * To disable the barcode  
        */
        disable: function () {
            if (this.model.enabled) {
                this.element.addClass("e-disable");
                this.model.enabled = false;
            }
        },

        /**
         * @private
         */
        _disabled: function (boolean) {
            if (boolean) this.disable();
            else this.enable();
        },

        /**
         * Initializes rendering canvas.
         * @private
         */
        _initObject: function (element) {
            element.BarcodeEl = $("#" + element.target.id);
            if (element.canvasEl)
                element.canvasEl.remove();
            else
                element.canvasEl = $("<canvas></canvas>");
            element.BarcodeEl.append(element.canvasEl);
            element.BarcodeEl.css("width", element.model.width);
            element.BarcodeEl.css("height", element.model.height);
            element.canvasEl[0].setAttribute("width", element.BarcodeEl.width());
            element.canvasEl[0].setAttribute("height", element.BarcodeEl.height());
            element.centerX = element.canvasEl[0].width / 2;
            element.centerY = element.canvasEl[0].height / 2;
            var elem = element.canvasEl[0];
            if (typeof window.G_vmlCanvasManager != "undefined") {
                elem = window.G_vmlCanvasManager.initElement(elem);
            }
            if (!elem || !elem.getContext) {
                return;
            }
            element.contextEl = element.canvasEl[0].getContext("2d");

            if (element.contextEl == undefined) //IE 8
                return;
        },

        /**
         * Finds the barcode type and encodes text.
         * @private
         */
        _findBarcodeType: function () {
            if (this.contextEl == undefined) //IE 8
                return;

            if (this.Model.text == "")
                return;

            this.textFont = { size: "12px", fontFamily: "Segoe UI", fontStyle: "Regular" };

            if (this.model.quietZone.all > 1)
                this.model.quietZone.left = this.model.quietZone.right = this.model.quietZone.top = this.model.quietZone.bottom = this.model.quietZone.all;

            var intercharacterGap = 1;
            var extendedText = "";
            var continuous = false;
            var validatorExp = "";
            var encodedText = this.Model.text;
            var startSymbol, stopSymbol, symbolTable, extendedCodes;

            var type = this.Model.symbologyType;
            var oneD = true;

            /** Apply symbology setting.*/
            if (ej.datavisualization.Barcode.SymbologyType.dataMatrix == type || ej.datavisualization.Barcode.SymbologyType.qrBarcode == type) {
                oneD = false;
            }
            else {
                startSymbol = ej.datavisualization.Barcode.symbologySettings[type].startSymbol;
                stopSymbol = ej.datavisualization.Barcode.symbologySettings[type].stopSymbol;
                validatorExp = ej.datavisualization.Barcode.symbologySettings[type].validatorExp;
                symbolTable = ej.datavisualization.Barcode.symbologySettings[type].symbolTable;
                extendedCodes = ej.datavisualization.Barcode.symbologySettings[type].extendedCodes;

                encodedText = this._calculateCheckDigit(encodedText, symbolTable, type);

                if (ej.datavisualization.Barcode.SymbologyType.code39Extended == type) {
                    var cArray = encodedText.split("");
                    var builder = "";
                    for (var j = 0; j < cArray.length; j++) {
                        var item = cArray[j];
                        for (var k = 0; k < extendedCodes.length; k++) {
                            if (extendedCodes[k][0] == item) {
                                var chArray = extendedCodes[k][1];
                                if (!(chArray == undefined)) {
                                    for (var i = 0; i < chArray.length; i++) {
                                        builder += chArray[i];
                                    }
                                }
                            }
                        }
                    }
                    extendedText = builder;
                }
                else if (ej.datavisualization.Barcode.SymbologyType.code93Extended == type) {
                    var cArray = encodedText.split("");
                    var builder = "";
                    for (var j = 0; j < cArray.length; j++) {
                        var item = cArray[j];
                        for (var k = 0; k < extendedCodes.length; k++) {
                            if (extendedCodes[k][0] == item) {
                                var chArray = extendedCodes[k][1];
                                if (!(chArray == undefined)) {
                                    for (var i = 0; i < chArray.length; i++) {
                                        builder += chArray[i];
                                    }
                                }
                            }
                        }
                    }
                    extendedText = builder;
                }
            }

            /** Process one dimensional barcode.*/
            if (oneD) {
                if (!this._validateText(this.Model.text, validatorExp)) {
                    console.log("Barcode Text contains characters that are not accepted by this barcode specification.");
                    return;
                }

                if (this.model.symbologyType == "code32" && this.model.text.length != 8) {
                    console.log("Barcode Text Length that are not accepted by this barcode specification.");
                    return;
                }

                if (extendedText.length > 0)
                    encodedText = extendedText;
				
				if(this.model.symbologyType == "ean")
					this.Model.encodeStartStopSymbol = true;
				
				if(this.model.symbologyType == "ean" && ( this.model.text.length != 7 && this.model.text.length != 12) ) {
					console.log("Barcode Text Length that are not accepted by this barcode specification, EAN barcode can accept only 7 or 13 characters.");
					return;
				}

                if (this.Model.encodeStartStopSymbol)
                    encodedText = startSymbol.toString() + encodedText + stopSymbol.toString();

                var w = this._getCharWidth(encodedText, symbolTable);

                if (continuous == false)
                    w -= (intercharacterGap * encodedText.length);
                else {
                    w -= (extendedText.length > 0) ?
                        intercharacterGap * (extendedText.length - this.Model.text.length) :
                        intercharacterGap;
                }

                var textHeight = parseInt(this.Model.displayText ? this.textFont.size.replace('px', '') : 0);
                var h = this.Model.quietZone.top + this.Model.quietZone.bottom + this.Model.barHeight + intercharacterGap + (this.Model.displayText ? (textHeight + this.Model.barcodeToTextGapHeight) : 0);
                w += this.Model.quietZone.left + this.Model.quietZone.right;

                

                /** Draw one dimensional barcode.*/
                this._draw1DBarcode(encodedText, symbolTable, w);
            }
                /** Process two dimensional barcode.*/
            else {
                if (ej.datavisualization.Barcode.SymbologyType.dataMatrix == type)
                    this._buildDataMatrix();
                else if (ej.datavisualization.Barcode.SymbologyType.qrBarcode == type)
                    this._buildQRBarcode();
            }

            /** Raise load event*/
            this._raiseEvent("load");
        },

        /**
         * Calculate the checkdigit value.
         * @private
         */
        _calculateCheckDigit: function (encodedText, symbolTable, type) {
			var originalEncodedText = encodedText;
            if (type == "code128b") {
                var checkValue = 0;
                var char = [encodedText.split("")];
                for (var m = 0; m < encodedText.split("").length; m++) {
                    var item = char[0][m];
                    var checkdigit = this._findCheckDigit(item, symbolTable)[1];
                    checkValue += (checkdigit * (m + 1));

                }
                //The start character value for the code128B is 104.
                checkValue += 104;
                //To claculate the checksum value.
                checkValue = checkValue % 0x67;
                var ch = [1];
                for (var e = 0; e < symbolTable.length; e++) {
                    if (e == checkValue) {
                        ch[0] = symbolTable[e][0];
                    }
                }
                encodedText += ch.toString();
            }
            else {
                if(type=="upcbarcode")
                {
                    var char = [encodedText.split("")];
                    var iSum = 0;
                    var iDigit = 0;
                    for (var m = 0; m < encodedText.split("").length; m++) {
                        if (m < 11) {
                            iDigit = encodedText[m];
                            if (m % 2 == 0) {    // odd
                                iSum += iDigit * 3;
                            }
                            else {    // even
                                iSum += iDigit * 1;
                            }
                        }

                    }
                    var iCheckSum = (10 - (iSum % 10)) % 10;
                    var data = encodedText.split("");
                    // Add the leading digit pattern for the text.
                    var str =6;
                    for (var k = 0; k < data.length; k++)
                    {
                        if (k == 6)
                        {
                            // Add the separator digit to middle of the text.
                            str += "B" + data[k];

                        }
                        else
                        {
                            if (k != 11 )
                                str += data[k];
                        }

                    }
                    encodedText = str;

                    //Add the checkdigit value. 
                    encodedText += iCheckSum;

                    //Add the ending digit pattern for the text.
                    encodedText += 6;
                   
                }
				if(type=="ean")
				{
					if(encodedText.length == 12){
						var char = [encodedText.split("")];
						var iSum = 0;
						var iDigit = 0;
						for (var m = 0; m < encodedText.split("").length; m++) {
							if (m < 12) {
								iDigit = encodedText[m];
								if (m % 2 == 0) {    // even
									iSum += iDigit * 1;
								}
								else {    // odd
									iSum += iDigit * 3;
								}
							}
						}
						var iCheckSum = (10 - (iSum % 10)) % 10;
						var data = encodedText.split("");
						// Add the leading digit pattern for the text.
						var str = "A";
						for (var k = 0; k < data.length; k++)
						{
							if (k == 7)
							{
								// Add the separator digit to middle of the text.
								str += "B" + data[k];

							}
							else
							{
								if (k != 12 )
                                str += data[k];
							}

						}
						encodedText = str;

						//Add the checkdigit value. 
						encodedText += iCheckSum;
						originalEncodedText += iCheckSum;

						//Add the ending digit pattern for the text.
						encodedText += "A";
					}
					else if(encodedText.length == 7){
						var char = [encodedText.split("")];
						var iSum = 0;
						var iDigit = 0;
						for (var m = 0; m < encodedText.split("").length; m++) {
							if (m < 7) {
								iDigit = encodedText[m];
								if (m % 2 == 0) {    // odd
									iSum += iDigit * 3;
								}
								else {    // even
									iSum += iDigit * 1;
								}
							}
						}
						var iCheckSum = (10 - (iSum % 10)) % 10;
						var data = encodedText.split("");
						// Add the leading digit pattern for the text.
						var str = "A";
						for (var k = 0; k < data.length; k++)
						{
							if (k == 4)
							{
								// Add the separator digit to middle of the text.
								str += "B" + data[k];

							}
							else
							{
								if (k != 7 )
                                str += data[k];
							}

						}
						encodedText = str;

						//Add the checkdigit value. 
						encodedText += iCheckSum;
						originalEncodedText += iCheckSum;

						//Add the ending digit pattern for the text.
						encodedText += "A";
					}	
				}
            }
            return encodedText;

        },

        /**
       * Finds the checkdigit value from symboltable.
       * @private
       */
        _findCheckDigit: function (encodedText, symbolTable) {
            for (var i = 0; i < symbolTable.length; i++) {
                if (symbolTable[i][0] == encodedText) {
                    return symbolTable[i];
                }
            }
        },

        /**
         * Load event.
         * @private
         * @event
         */
        _raiseEvent: function (event) {
            if (this.model[event])
                this._trigger(event);
        },

        /**
         * Generates QR barcode.
         * @private
         */
        _buildQRBarcode: function () {
            var txt = this.Model.text;
            this.m_EciAssignmentNumber = 3;
            this.mode = "numeric";
            this.isEci = false;
            this.m_Version = 1;
            var dataCapacityOfVersions = new Array(14, 26, 42, 62, 84, 106, 122, 152, 180, 213, 251, 287, 331, 362, 412, 450, 504, 560, 624, 666, 711, 779, 857, 911, 997, 1059, 1125, 1190, 1264, 1370, 1452, 1538, 1628, 1722, 1809, 1911, 1989, 2099, 2213, 2331);
            for (var i = 0; i < txt.length; i++) {
                var cCode = txt.charCodeAt(i);
                if (cCode < 58 && cCode > 47) {
                    /** numeric only*/
                }
                else if ((cCode < 91 && cCode > 64) || txt[i] == '$' || txt[i] == '%' || txt[i] == '*' || txt[i] == '+' || txt[i] == '-' || txt[i] == '.' || txt[i] == '/' || txt[i] == ':' || txt[i] == ' ') {
                    this.mode = "alphanumeric";
                }
                else if ((cCode >= 65377 && cCode <= 65439) || (cCode >= 97 && cCode <= 122)) {
                    this.mode = "binary";
                    break;
                }
                else {
                    this.mode = "binary";
                    this.isEci = true;
                    break;
                }
            }
            if (this.mode == "numeric")
                dataCapacityOfVersions = new Array(34, 63, 101, 149, 202, 255, 293, 365, 432, 513, 604, 691, 796, 871, 991, 1082, 1212, 1346, 1500, 1600, 1708, 1872, 2059, 2188, 2395, 2544, 2701, 2857, 3035, 3289, 3486, 3693, 3909, 4134, 4343, 4588, 4775, 5039, 5313, 5596);
            else if (this.mode == "alphanumeric")
                dataCapacityOfVersions = new Array(20, 38, 61, 90, 122, 154, 178, 221, 262, 311, 366, 419, 483, 528, 600, 656, 734, 816, 909, 970, 1035, 1134, 1248, 1326, 1451, 1542, 1637, 1732, 1839, 1994, 2113, 2238, 2369, 2506, 2632, 2780, 2894, 3054, 3220, 3391);

            if (this.isEci == true) {
                this.m_EciAssignmentNumber = this._findECINumber(txt);
            }
            for (var i = 0; i < dataCapacityOfVersions.length; i++) {
                if (dataCapacityOfVersions[i] > txt.length) {
                    this.m_Version = i + 1;
                    break;
                }
            }

            this.qrbarcodeValues = { Version: this.m_Version, ErrorCorrectionLevel: 1, NumberOfDataCodeWord: this._getNumberOfDataCodeWord(), NumberOfErrorCorrectingCodeWords: this._getNumberOfErrorCorrectingCodeWords(), NumberOfErrorCorrectionBlocks: this._getNumberOfErrorCorrectionBlocks(), End: this._getEnd(), DataCapacity: this._getDataCapacity(), FormatInformation: this._getFormatInformation(), VersionInformation: this._getVersionInformation() };
            this.noOfModules = (this.m_Version - 1) * 4 + 21;

            this.moduleValue = this._create2DArray(this.noOfModules, this.noOfModules);

            for (var i = 0; i < this.noOfModules; i++) {
                for (var j = 0; j < this.noOfModules; j++) {
                    this.moduleValue[i][j] = { IsBlack: false, IsFilled: false, IsPDP: false };
                }
            }

            this._drawPDP(0, 0);
            this._drawPDP(this.noOfModules - 7, 0);
            this._drawPDP(0, this.noOfModules - 7);
            this._drawTimingPattern();

            if (this.m_Version != 1) {
                var allignCoOrdinates = this._getAlignmentPatternCoOrdinates();

                for (var i = 0; i < allignCoOrdinates.length; i++) {
                    for (var j = 0; j < allignCoOrdinates.length; j++) {
                        var x = allignCoOrdinates[i];
                        var y = allignCoOrdinates[j];
                        if (this.moduleValue[x][y].IsPDP != true)
                            this._drawAlignmentPattern(x, y);
                    }
                }
            }

            this._allocateFormatVersionInfo();
            this._encodeData();
            this._drawFormatInformation();
            this._addQuietZone();

            var w = this.moduleValue.length * this.Model.xDimension;
            var h = this.moduleValue[0].length * this.Model.xDimension;

            

            this.contextEl.beginPath();
            this.contextEl.fillStyle = 'white';
            this.contextEl.fillRect(0, 0, w, h);
            this.contextEl.closePath();

            /** Draw QR barcode in canvas.*/
            this._drawQRBarcode(h, w);
        },

        /** 
         * Allocate format and version information.
         * @private
         */
        _allocateFormatVersionInfo: function () {
            for (var i = 0; i < 9; i++) {
                this.moduleValue[8][i].IsFilled = true;
                this.moduleValue[i][8].IsFilled = true;
            }
            for (var i = this.noOfModules - 8; i < this.noOfModules; i++) {
                this.moduleValue[8][i].IsFilled = true;
                this.moduleValue[i][8].IsFilled = true;
            }
            if (this.m_Version > 6) {
                var versionInformation = this.qrbarcodeValues.VersionInformation;
                var count = 0;
                for (var i = 0; i < 6; i++) {
                    for (var j = 2; j >= 0; j--) {
                        this.moduleValue[i][this.noOfModules - 9 - j].IsBlack = versionInformation[count] == 1 ? true : false;
                        this.moduleValue[i][this.noOfModules - 9 - j].IsFilled = true;

                        this.moduleValue[this.noOfModules - 9 - j][i].IsBlack = versionInformation[count++] == 1 ? true : false;
                        this.moduleValue[this.noOfModules - 9 - j][i].IsFilled = true;
                    }
                }
            }
        },

        /**
         * @private
         */
        _drawTimingPattern: function () {
            for (var i = 8; i < this.noOfModules - 8; i += 2) {
                this.moduleValue[i][6].IsBlack = true;
                this.moduleValue[i][6].IsFilled = true;

                this.moduleValue[i + 1][6].IsBlack = false;
                this.moduleValue[i + 1][6].IsFilled = true;

                this.moduleValue[6][i].IsBlack = true;
                this.moduleValue[6][i].IsFilled = true;

                this.moduleValue[6][i + 1].IsBlack = false;
                this.moduleValue[6][i + 1].IsFilled = true;
            }
            this.moduleValue[this.noOfModules - 8][8].IsBlack = true;
            this.moduleValue[this.noOfModules - 8][8].IsFilled = true;
        },

        /** 
         * Draws QR barcode.
         * @private
         */
        _drawQRBarcode: function (ht, w) {
            var quietZone = this.Model.quietZone.all;
            if (quietZone < 2)
                quietZone = 2;

            var whiteBrush = 'white';
            var blackBrush = 'black';
            
            var dim = parseInt(this.Model.xDimension);
            if(this.Model.height != "" && this.Model.width != "")
			{
            this.Model.height = this._getProperValue(this.Model.height);
            this.Model.width = this._getProperValue(this.Model.width);
            }
			else
			{ 
			this.Model.height = ht;
			this.Model.width = w;
			this.canvasEl[0].setAttribute("width", this.Model.width);
            this.BarcodeEl.css("width", this.Model.width);
			this.canvasEl[0].setAttribute("height", this.Model.height);
            this.BarcodeEl.css("height", this.Model.height);
			}			
            var dimension = Math.min(this.Model.width, this.Model.height);
            
            if(dimension != 0)
                dim = dimension / (this.noOfModules + (2 * quietZone));

            var y = 0;

            var w = this.noOfModules + 2 * quietZone, h = this.noOfModules + 2 * quietZone;

            this.contextEl.beginPath();

            for (var i = 0; i < w; i++) {
                var x = 0;

                for (var j = 0; j < h; j++) {
                    var colorBrush = null;
                    if (this.moduleValue[i][j].IsBlack)
                       colorBrush = this.model.darkBarColor;
						
					else
				
                      colorBrush = this.model.lightBarColor;

                    if (this.dataAllocationValues[j][i].IsFilled)
                        if (this.dataAllocationValues[j][i].IsBlack)
                            colorBrush = 'black';

                    this.contextEl.fillStyle = colorBrush;
                    this.contextEl.fillRect(x, y, dim, dim)

                    x += dim;
                }

                y += dim;
            }

            this.contextEl.closePath();
            this.contextEl.stroke();
        },


         _getProperValue: function (value) {
             if(value == "")
                return "";
             if(typeof(value) == "string")
             {
                value = value.replace("px","");
                return parseInt(value);
             }
             else if(typeof(value) == "number")
                return value;
             return 0;
         },
         
        /** 
         * Adds quiet zone to the barcode.
         * @private
         */
        _addQuietZone: function () {
            var quietZone = this.Model.quietZone.all;
            if (quietZone < 2)
                quietZone = 2;
            var w = this.noOfModules + 2 * quietZone;
            var h = this.noOfModules + 2 * quietZone;
            var tempValue1 = this._create2DArray(w, h);
            var tempValue2 = this._create2DArray(w, h);

            /** Initialize array.*/
            for (var i = 0; i < w; i++) {
                for (var j = 0; j < h; j++) {
                    tempValue1[i][j] = { IsBlack: false, IsFilled: false, IsPDP: false };
                    tempValue2[i][j] = { IsBlack: false, IsFilled: false, IsPDP: false };
                }
            }

            for (var i = quietZone; i < w - quietZone; i++) {
                for (var j = quietZone; j < h - quietZone; j++) {
                    tempValue1[i][j] = this.moduleValue[i - quietZone][j - quietZone];
                    tempValue2[i][j] = this.dataAllocationValues[i - quietZone][j - quietZone];
                }
            }

            this.moduleValue = tempValue1;
            this.dataAllocationValues = tempValue2;
        },

        /** 
         * Adds format information to the barcode.
         * @private
         */
        _drawFormatInformation: function () {
            var formatInformation = this.qrbarcodeValues.FormatInformation;

            var count = 0;
            for (var i = 0; i < 7; i++) {
                /** Draw from 14 to 8.*/
                if (i == 6)
                    this.moduleValue[i + 1][8].IsBlack = formatInformation[count] == 1 ? true : false;
                else
                    this.moduleValue[i][8].IsBlack = formatInformation[count] == 1 ? true : false;

                this.moduleValue[8][this.noOfModules - i - 1].IsBlack = formatInformation[count++] == 1 ? true : false;
            }
            count = 14;
            for (var i = 0; i < 7; i++) {
                /** Draw from 0 to 6.*/
                if (i == 6)
                    this.moduleValue[8][i + 1].IsBlack = formatInformation[count] == 1 ? true : false;
                else
                    this.moduleValue[8][i].IsBlack = formatInformation[count] == 1 ? true : false;
                this.moduleValue[this.noOfModules - i - 1][8].IsBlack = formatInformation[count--] == 1 ? true : false;
            }

            /** Draw 7.*/
            this.moduleValue[8][8].IsBlack = formatInformation[7] == 1 ? true : false;
            this.moduleValue[8][this.noOfModules - 8].IsBlack = formatInformation[7] == 1 ? true : false;
        },

        /** 
         * @private
         */
        _dataAllocationAndMasking: function (Data) {
            var num = this.noOfModules;
            this.dataAllocationValues = this._create2DArray(num, num);
            var point = 0;

            for (var i = 0; i < num; i++) 
                for (var j = 0; j < num; j++) 
                    this.dataAllocationValues[i][j] = { IsBlack: false, IsFilled: false, IsPDP: false };

            for (var i = num - 1; i >= 0; i -= 2) {
                for (var j = num - 1; j >= 0; j--)
                    point = this._allocateValues(Data, i, j, point);

                i -= 2;
                if (i == 6)
                    i--;

                for (var j = 0; j < num; j++)
                    point = this._allocateValues(Data, i, j, point);
            }
            for (var i = 0; i < num; i++)
                for (var j = 0; j < num; j++)
                    if (!this.moduleValue[i][j].IsFilled) {
                        var flag = this.dataAllocationValues[i][j].IsBlack;
                        if (flag)
                            this.dataAllocationValues[i][j].IsBlack = false;
                        else
                            this.dataAllocationValues[i][j].IsBlack = true;
                    }


        },

        /** 
         * @private
         */
        _allocateValues: function (Data, i, j, point) {
            if (!(this.moduleValue[i][j].IsFilled && this.moduleValue[i - 1][j].IsFilled)) {
                if (!this.moduleValue[i][j].IsFilled) {
                    if (point + 1 < Data.length)
                        this.dataAllocationValues[i][j].IsBlack = Data[point++];
                    if ((i + j) % 3 == 0) {
                        if (this.dataAllocationValues[i][j].IsBlack)
                            this.dataAllocationValues[i][j].IsBlack = true;
                        else
                            this.dataAllocationValues[i][j].IsBlack = false;
                    }
                    else {
                        if (this.dataAllocationValues[i][j].IsBlack)
                            this.dataAllocationValues[i][j].IsBlack = false;
                        else
                            this.dataAllocationValues[i][j].IsBlack = true;
                    }

                    this.dataAllocationValues[i][j].IsFilled = true;
                }

                if (!this.moduleValue[i - 1][j].IsFilled) {
                    if (point + 1 < Data.length)
                        this.dataAllocationValues[i - 1][j].IsBlack = Data[point++];
                    if ((i - 1 + j) % 3 == 0) {
                        if (this.dataAllocationValues[i - 1][j].IsBlack)
                            this.dataAllocationValues[i - 1][j].IsBlack = true;
                        else
                            this.dataAllocationValues[i - 1][j].IsBlack = false;
                    }
                    else {
                        if (this.dataAllocationValues[i - 1][j].IsBlack)
                            this.dataAllocationValues[i - 1][j].IsBlack = false;
                        else
                            this.dataAllocationValues[i - 1][j].IsBlack = true;
                    }
                    this.dataAllocationValues[i - 1][j].IsFilled = true;
                }
            }

            return point;
        },

        /** 
         * Encodes data.
         * @private
         */
        _encodeData: function () {
            var eData = new Array();
            var c = -1;

            switch (this.mode) {
                case "numeric":
                    eData[++c] = false;
                    eData[++c] = false;
                    eData[++c] = false;
                    eData[++c] = true;
                    break;

                case "alphanumeric":
                    eData[++c] = false;
                    eData[++c] = false;
                    eData[++c] = true;
                    eData[++c] = false;
                    break;

                case "binary":
                    if (this.isEci) {
                        /** Add ECI Mode Indicator.*/
                        eData[++c] = false;
                        eData[++c] = true;
                        eData[++c] = true;
                        eData[++c] = true;

                        /** Add ECI assignment number.*/
                        var numberInBool = this._stringToBoolArray(this.m_EciAssignmentNumber.toString(), 8);
                        for (var e = 0; e < numberInBool.length; e++)
                            eData[++c] = numberInBool[e];
                    }
                    eData[++c] = false;
                    eData[++c] = true;
                    eData[++c] = false;
                    eData[++c] = false;
                    break;
            }

            var numberOfBitsInCharacterCountIndicator = 0;
            if (this.m_Version < 10) {
                switch (this.mode) {
                    case "numeric":
                        numberOfBitsInCharacterCountIndicator = 10;
                        break;
                    case "alphanumeric":
                        numberOfBitsInCharacterCountIndicator = 9;
                        break;
                    case "binary":
                        numberOfBitsInCharacterCountIndicator = 8;
                        break;
                }
            }
            else if (this.m_Version < 27) {
                switch (this.mode) {
                    case "numeric":
                        numberOfBitsInCharacterCountIndicator = 12;
                        break;
                    case "alphanumeric":
                        numberOfBitsInCharacterCountIndicator = 11;
                        break;
                    case "binary":
                        numberOfBitsInCharacterCountIndicator = 16;
                        break;
                }
            }
            else {
                switch (this.mode) {
                    case "numeric":
                        numberOfBitsInCharacterCountIndicator = 14;
                        break;
                    case "alphanumeric":
                        numberOfBitsInCharacterCountIndicator = 13;
                        break;
                    case "binary":
                        numberOfBitsInCharacterCountIndicator = 16;
                        break;
                }
            }

            var dataStringArray = this.Model.text;
            var numberOfBitsInCharacterCountIndicatorInBool = this._intToBoolArray(dataStringArray.length, numberOfBitsInCharacterCountIndicator);

            for (var i = 0; i < numberOfBitsInCharacterCountIndicator; i++)
                eData[++c] = numberOfBitsInCharacterCountIndicatorInBool[i];

            if (this.mode == "numeric") {
                var number = "";
                for (var i = 0; i < dataStringArray.length; i++) {
                    var numberInBool = new Array();
                    number += dataStringArray[i];

                    if (i % 3 == 2 && i != 0 || i == dataStringArray.length - 1) {
                        if (number.length == 3)
                            numberInBool = this._stringToBoolArray(number, 10);
                        else if (number.length == 2)
                            numberInBool = this._stringToBoolArray(number, 7);
                        else
                            numberInBool = this._stringToBoolArray(number, 4);
                        number = "";
                        for (var j = 0; j < numberInBool.length; j++)
                            eData[++c] = numberInBool[j];
                    }
                }
            }
            else if (this.mode == "alphanumeric") {
                var numberInString = "";
                var number = 0;
                for (var i = 0; i < dataStringArray.length; i++) {
                    var numberInBool = new Array();
                    numberInString += dataStringArray[i];

                    if (i % 2 == 0 && i + 1 != dataStringArray.length)
                        number = 45 * this._getAlphanumericvalues(dataStringArray[i]);

                    if (i % 2 == 1 && i != 0) {
                        number += this._getAlphanumericvalues(dataStringArray[i]);
                        numberInBool = this._intToBoolArray(number, 11);
                        number = 0;
                        for (var n = 0; n < numberInBool.length; n++)
                            eData[++c] = numberInBool[n];
                        numberInString = "";
                    }
                    if (i != 1 && numberInString != null)
                        if (i + 1 == dataStringArray.length && numberInString.length == 1) {
                            number = this._getAlphanumericvalues(dataStringArray[i]);
                            numberInBool = this._intToBoolArray(number, 6);
                            number = 0;
                            for (var j = 0; j < numberInBool.length; j++)
                                eData[++c] = numberInBool[j];
                        }
                }
            }
            else if (this.mode = "binary") {
                {
                    for (var i = 0; i < dataStringArray.length; i++) {
                        var number = 0;
                        if ((dataStringArray.charCodeAt(i) >= 32 && dataStringArray.charCodeAt(i) <= 126) || (dataStringArray.charCodeAt(i) >= 161 && dataStringArray.charCodeAt(i) <= 255))
                            number = dataStringArray.charCodeAt(i);
                        else if (dataStringArray.charCodeAt(i) >= 65377 && dataStringArray.charCodeAt(i) <= 65439)
                            number = dataStringArray.charCodeAt(i) - 65216;
                        else {
                            console.log("Input text contains non-convertable characters");
                            return;
                        }
                        var numberInBool = this._intToBoolArray(number, 8);
                        for (var j = 0; j < numberInBool.length; j++)
                            eData[++c] = numberInBool[j];
                    }
                }
            }

            /** Terminator.*/
            for (var i = 0; i < 4; i++)
                if (eData.length / 8 == this.qrbarcodeValues.NumberOfDataCodeWord)
                    break;
                else
                    eData[++c] = false;

            /** Encode to code words.*/
            for (; ;)              /** Add Padding Bits.*/
            {
                if (eData.length % 8 == 0)
                    break;
                else
                    eData[++c] = false;
            }

            for (; ;) {
                if (eData.length / 8 == this.qrbarcodeValues.NumberOfDataCodeWord)
                    break;
                else {
                    eData[++c] = false;       //11101100
                    eData[++c] = true;
                    eData[++c] = true;
                    eData[++c] = false;
                    eData[++c] = true;
                    eData[++c] = true;
                    eData[++c] = false;
                    eData[++c] = false;
                }
                if (eData.length / 8 == this.qrbarcodeValues.NumberOfDataCodeWord)
                    break;
                else {
                    eData[++c] = false;       //00010001
                    eData[++c] = false;
                    eData[++c] = false;
                    eData[++c] = true;
                    eData[++c] = false;
                    eData[++c] = false;
                    eData[++c] = false;
                    eData[++c] = true;
                }
            }

            var dataBits = this.qrbarcodeValues.NumberOfDataCodeWord;
            var blocks = this.qrbarcodeValues.NumberOfErrorCorrectionBlocks;

            var totalBlockSize = blocks[0];
            if (blocks.length == 6)
                totalBlockSize = blocks[0] + blocks[3];

            var ds1 = new Array(totalBlockSize);

            var testEncodeData = eData;
            var n = -1;
            if (blocks.length == 6)     /** If seperated into two seperate blocks.*/
            {
                var dataCodeWordLength = blocks[0] * blocks[2] * 8;
                testEncodeData = new Array(dataCodeWordLength);
                for (var i = 0; i < dataCodeWordLength; i++)
                    testEncodeData[++n] = eData[i];
            }
            var dsOne = this._create2DArray(blocks[0], testEncodeData.length / 8 / blocks[0]);
            dsOne = this._createBlocks(testEncodeData, blocks[0]);

            for (var i = 0; i < blocks[0]; i++) {
                ds1[i] = this._splitCodeWord(dsOne, i, testEncodeData.length / 8 / blocks[0]);
            }

            n = -1;
            if (blocks.length == 6) {
                testEncodeData = new Array();
                for (var i = parseInt(blocks[0] * blocks[2] * 8) ; i < eData.length; i++)
                    testEncodeData[++n] = eData[i];

                var dsTwo = this._create2DArray(blocks[0], testEncodeData.length / 8 / blocks[3]);
                dsTwo = this._createBlocks(testEncodeData, blocks[3]);

                for (var i = blocks[0], count = 0; i < totalBlockSize; i++)
                    ds1[i] = this._splitCodeWord(dsTwo, count++, testEncodeData.length / 8 / blocks[3]);
            }
            eData = new Array();
            c = -1;
            for (var i = 0; i < 125; i++) {
                for (var k = 0; k < totalBlockSize; k++)
                    for (var j = 0; j < 8; j++)
                        if (i < ds1[k].length) {
                            var temp = ds1[k][i][j];
                            eData[++c] = (temp == '1' ? true : false);
                        }
            }

            this.corCodeWords = { DataBits: this.qrbarcodeValues.NumberOfDataCodeWord, ECCW: this.qrbarcodeValues.NumberOfErrorCorrectingCodeWords, DC: 0 };

            var dataBits = this.corCodeWords.DataBits;
            var eccw = this.corCodeWords.ECCW;
            blocks = this.qrbarcodeValues.NumberOfErrorCorrectionBlocks;

            if (blocks.length == 6)
                this.corCodeWords.DataBits = (dataBits - blocks[3] * blocks[5]) / blocks[0];
            else
                this.corCodeWords.DataBits = dataBits / blocks[0];

            this.corCodeWords.ECCW = eccw / totalBlockSize;
            var polynomial = new Array(totalBlockSize);
            var count = 0;

            for (var i = 0; i < blocks[0]; i++) {
                this.corCodeWords.DC = ds1[count];
                polynomial[count++] = this._getERCW();
            }
            if (blocks.length == 6) {
                this.corCodeWords.DataBits = (dataBits - blocks[0] * blocks[2]) / blocks[3];

                for (var i = 0; i < blocks[3]; i++) {
                    this.corCodeWords.DC = ds1[count];
                    polynomial[count++] = this._getERCW();
                }
            }
            var polyLength = polynomial[0].slice(-1)[polynomial.length - 1];
            if (typeof polyLength == 'undefined')
                polynomial[0].length = polynomial[0].length - 1;
            if (blocks.length != 6) {
                for (var i = 0; i < polynomial[0].length; i++) {
                    for (var k = 0; k < blocks[0]; k++)
                        for (var j = 0; j < 8; j++)
                            if (i < polynomial[k].length)
                                eData[++c] = (polynomial[k][i][j] == '1' ? true : false);
                }
            }
            else {
                for (var i = 0; i < polynomial[0].length; i++) {
                    for (var k = 0; k < totalBlockSize; k++)
                        for (var j = 0; j < 8; j++)
                            if (i < polynomial[k].length)
                                eData[++c] = (polynomial[k][i][j] == '1' ? true : false);
                }
            }


            this._dataAllocationAndMasking(eData);
        },

        /** 
         * @private
         */
        _getERCW: function () {
            var decimalRepresentation;
            var ecw;
            var decimalValue = new Array(this.corCodeWords.DataBits);
            var gx = new Array();

            switch (this.corCodeWords.ECCW) {
                case 7:
                    gx = new Array(0, 87, 229, 146, 149, 238, 102, 21);
                    gx = this._getElement(gx);
                    break;
                case 10:
                    gx = new Array(0, 251, 67, 46, 61, 118, 70, 64, 94, 32, 45);
                    gx = this._getElement(gx);
                    break;
                case 13:
                    gx = new Array(0, 74, 152, 176, 100, 86, 100, 106, 104, 130, 218, 206, 140, 78);
                    gx = this._getElement(gx);
                    break;
                case 15:
                    gx = new Array(0, 8, 183, 61, 91, 202, 37, 51, 58, 58, 237, 140, 124, 5, 99, 105);
                    gx = this._getElement(gx);
                    break;
                case 16:
                    gx = new Array(0, 120, 104, 107, 109, 102, 161, 76, 3, 91, 191, 147, 169, 182, 194, 225, 120);
                    gx = this._getElement(gx);
                    break;
                case 17:
                    gx = new Array(0, 43, 139, 206, 78, 43, 239, 123, 206, 214, 147, 24, 99, 150, 39, 243, 163, 136);
                    gx = this._getElement(gx);
                    break;
                case 18:
                    gx = new Array(0, 215, 234, 158, 94, 184, 97, 118, 170, 79, 187, 152, 148, 252, 179, 5, 98, 96, 153);
                    gx = this._getElement(gx);
                    break;
                case 20:
                    gx = new Array(0, 17, 60, 79, 50, 61, 163, 26, 187, 202, 180, 221, 225, 83, 239, 156, 164, 212, 212, 188, 190);
                    gx = this._getElement(gx);
                    break;
                case 22:
                    gx = new Array(0, 210, 171, 247, 242, 93, 230, 14, 109, 221, 53, 200, 74, 8, 172, 98, 80, 219, 134, 160, 105, 165, 231);
                    gx = this._getElement(gx);
                    break;
                case 24:
                    gx = new Array(0, 229, 121, 135, 48, 211, 117, 251, 126, 159, 180, 169, 152, 192, 226, 228, 218, 111, 0, 117, 232, 87, 96, 227, 21);
                    gx = this._getElement(gx);
                    break;
                case 26:
                    gx = new Array(0, 173, 125, 158, 2, 103, 182, 118, 17, 145, 201, 111, 28, 165, 53, 161, 21, 245, 142, 13, 102, 48, 227, 153, 145, 218, 70);
                    gx = this._getElement(gx);
                    break;
                case 28:
                    gx = new Array(0, 168, 223, 200, 104, 224, 234, 108, 180, 110, 190, 195, 147, 205, 27, 232, 201, 21, 43, 245, 87, 42, 195, 212, 119, 242, 37, 9, 123);
                    gx = this._getElement(gx);
                    break;
                case 30:
                    gx = new Array(0, 41, 173, 145, 152, 216, 31, 179, 182, 50, 48, 110, 86, 239, 96, 222, 125, 42, 173, 226, 193, 224, 130, 156, 37, 251, 216, 238, 40, 192, 180);
                    gx = this._getElement(gx);
                    break;
                case 32:
                    gx = new Array(0, 10, 6, 106, 190, 249, 167, 4, 67, 209, 138, 138, 32, 242, 123, 89, 27, 120, 185, 80, 156, 38, 69, 171, 60, 28, 222, 80, 52, 254, 185, 220, 241);
                    gx = this._getElement(gx);
                    break;
                case 34:
                    gx = new Array(0, 111, 77, 146, 94, 26, 21, 108, 19, 105, 94, 113, 193, 86, 140, 163, 125, 58, 158, 229, 239, 218, 103, 56, 70, 114, 61, 183, 129, 167, 13, 98, 62, 129, 51);
                    gx = this._getElement(gx);
                    break;
                case 36:
                    gx = new Array(0, 200, 183, 98, 16, 172, 31, 246, 234, 60, 152, 115, 0, 167, 152, 113, 248, 238, 107, 18, 63, 218, 37, 87, 210, 105, 177, 120, 74, 121, 196, 117, 251, 113, 233, 30, 120);
                    gx = this._getElement(gx);
                    break;
                case 40:
                    gx = new Array(0, 59, 116, 79, 161, 252, 98, 128, 205, 128, 161, 247, 57, 163, 56, 235, 106, 53, 26, 187, 174, 226, 104, 170, 7, 175, 35, 181, 114, 88, 41, 47, 163, 125, 134, 72, 20, 232, 53, 35, 15);
                    gx = this._getElement(gx);
                    break;
                case 42:
                    gx = new Array(0, 250, 103, 221, 230, 25, 18, 137, 231, 0, 3, 58, 242, 221, 191, 110, 84, 230, 8, 188, 106, 96, 147, 15, 131, 139, 34, 101, 223, 39, 101, 213, 199, 237, 254, 201, 123, 171, 162, 194, 117, 50, 96);
                    gx = this._getElement(gx);
                    break;
                case 44:
                    gx = new Array(0, 190, 7, 61, 121, 71, 246, 69, 55, 168, 188, 89, 243, 191, 25, 72, 123, 9, 145, 14, 247, 1, 238, 44, 78, 143, 62, 224, 126, 118, 114, 68, 163, 52, 194, 217, 147, 204, 169, 37, 130, 113, 102, 73, 181);
                    gx = this._getElement(gx);
                    break;
                case 46:
                    gx = new Array(0, 112, 94, 88, 112, 253, 224, 202, 115, 187, 99, 89, 5, 54, 113, 129, 44, 58, 16, 135, 216, 169, 211, 36, 1, 4, 96, 60, 241, 73, 104, 234, 8, 249, 245, 119, 174, 52, 25, 157, 224, 43, 202, 223, 19, 82, 15);
                    gx = this._getElement(gx);
                    break;
                case 48:
                    gx = new Array(0, 228, 25, 196, 130, 211, 146, 60, 24, 251, 90, 39, 102, 240, 61, 178, 63, 46, 123, 115, 18, 221, 111, 135, 160, 182, 205, 107, 206, 95, 150, 120, 184, 91, 21, 247, 156, 140, 238, 191, 11, 94, 227, 84, 50, 163, 39, 34, 108);
                    gx = this._getElement(gx);
                    break;
                case 50:
                    gx = new Array(0, 232, 125, 157, 161, 164, 9, 118, 46, 209, 99, 203, 193, 35, 3, 209, 111, 195, 242, 203, 225, 46, 13, 32, 160, 126, 209, 130, 160, 242, 215, 242, 75, 77, 42, 189, 32, 113, 65, 124, 69, 228, 114, 235, 175, 124, 170, 215, 232, 133, 205);
                    gx = this._getElement(gx);
                    break;
                case 52:
                    gx = new Array(0, 116, 50, 86, 186, 50, 220, 251, 89, 192, 46, 86, 127, 124, 19, 184, 233, 151, 215, 22, 14, 59, 145, 37, 242, 203, 134, 254, 89, 190, 94, 59, 65, 124, 113, 100, 233, 235, 121, 22, 76, 86, 97, 39, 242, 200, 220, 101, 33, 239, 254, 116, 51);
                    gx = this._getElement(gx);
                    break;
                case 54:
                    gx = new Array(0, 183, 26, 201, 87, 210, 221, 113, 21, 46, 65, 45, 50, 238, 184, 249, 225, 102, 58, 209, 218, 109, 165, 26, 95, 184, 192, 52, 245, 35, 254, 238, 175, 172, 79, 123, 25, 122, 43, 120, 108, 215, 80, 128, 201, 235, 8, 153, 59, 101, 31, 198, 76, 31, 156);
                    gx = this._getElement(gx);
                    break;
                case 56:
                    gx = new Array(0, 106, 120, 107, 157, 164, 216, 112, 116, 2, 91, 248, 163, 36, 201, 202, 229, 6, 144, 254, 155, 135, 208, 170, 209, 12, 139, 127, 142, 182, 249, 177, 174, 190, 28, 10, 85, 239, 184, 101, 124, 152, 206, 96, 23, 163, 61, 27, 196, 247, 151, 154, 202, 207, 20, 61, 10);
                    gx = this._getElement(gx);
                    break;
                case 58:
                    gx = new Array(0, 82, 116, 26, 247, 66, 27, 62, 107, 252, 182, 200, 185, 235, 55, 251, 242, 210, 144, 154, 237, 176, 141, 192, 248, 152, 249, 206, 85, 253, 142, 65, 165, 125, 23, 24, 30, 122, 240, 214, 6, 129, 218, 29, 145, 127, 134, 206, 245, 117, 29, 41, 63, 159, 142, 233, 125, 148, 123);
                    gx = this._getElement(gx);
                    break;
                case 60:
                    gx = new Array(0, 107, 140, 26, 12, 9, 141, 243, 197, 226, 197, 219, 45, 211, 101, 219, 120, 28, 181, 127, 6, 100, 247, 2, 205, 198, 57, 115, 219, 101, 109, 160, 82, 37, 38, 238, 49, 160, 209, 121, 86, 11, 124, 30, 181, 84, 25, 194, 87, 65, 102, 190, 220, 70, 27, 209, 16, 89, 7, 33, 240);
                    gx = this._getElement(gx);
                    break;
                case 62:
                    gx = new Array(0, 65, 202, 113, 98, 71, 223, 248, 118, 214, 94, 0, 122, 37, 23, 2, 228, 58, 121, 7, 105, 135, 78, 243, 118, 70, 76, 223, 89, 72, 50, 70, 111, 194, 17, 212, 126, 181, 35, 221, 117, 235, 11, 229, 149, 147, 123, 213, 40, 115, 6, 200, 100, 26, 246, 182, 218, 127, 215, 36, 186, 110, 106);
                    gx = this._getElement(gx);
                    break;
                case 64:
                    gx = new Array(0, 45, 51, 175, 9, 7, 158, 159, 49, 68, 119, 92, 123, 177, 204, 187, 254, 200, 78, 141, 149, 119, 26, 127, 53, 160, 93, 199, 212, 29, 24, 145, 156, 208, 150, 218, 209, 4, 216, 91, 47, 184, 146, 47, 140, 195, 195, 125, 242, 238, 63, 99, 108, 140, 230, 242, 31, 204, 11, 178, 243, 217, 156, 213, 231);
                    gx = this._getElement(gx);
                    break;
                case 66:
                    gx = new Array(0, 5, 118, 222, 180, 136, 136, 162, 51, 46, 117, 13, 215, 81, 17, 139, 247, 197, 171, 95, 173, 65, 137, 178, 68, 111, 95, 101, 41, 72, 214, 169, 197, 95, 7, 44, 154, 77, 111, 236, 40, 121, 143, 63, 87, 80, 253, 240, 126, 217, 77, 34, 232, 106, 50, 168, 82, 76, 146, 67, 106, 171, 25, 132, 93, 45, 105);
                    gx = this._getElement(gx);
                    break;
                case 68:
                    gx = new Array(0, 247, 159, 223, 33, 224, 93, 77, 70, 90, 160, 32, 254, 43, 150, 84, 101, 190, 205, 133, 52, 60, 202, 165, 220, 203, 151, 93, 84, 15, 84, 253, 173, 160, 89, 227, 52, 199, 97, 95, 231, 52, 177, 41, 125, 137, 241, 166, 225, 118, 2, 54, 32, 82, 215, 175, 198, 43, 238, 235, 27, 101, 184, 127, 3, 5, 8, 163, 238);
                    gx = this._getElement(gx);
                    break;
            }

            decimalValue = this._toDecimal(this.corCodeWords.DC, decimalValue);
            decimalRepresentation = this._divide(gx, decimalValue);
            ecw = this._toBinary(decimalRepresentation);
            return ecw;
        },

        /** 
         * Convert to binary.
         * @private
         */
        _toBinary: function (decimalRepresentation) {
            var toBinary = new Array(this.corCodeWords.ECCW);
            for (var i = 0; i < decimalRepresentation.length; i++) {
                var temp = decimalRepresentation[i].toString(2);
                var str = new String();
                for (var j = 0; j < (8 - temp.length) ; j++)
                    str += "0";
                toBinary[i] = str + temp;
            }
            return toBinary;
        },

        /** 
         * @private
         */
        _divide: function (gx, decimalValue) {
            var alpha = new Array(1, 2, 4, 8, 16, 32, 64, 128, 29, 58, 116, 232, 205, 135, 19, 38, 76, 152, 45, 90, 180, 117, 234, 201, 143, 3, 6, 12, 24, 48, 96, 192, 157, 39, 78, 156, 37, 74, 148, 53, 106, 212, 181, 119, 238, 193, 159, 35, 70, 140, 5, 10, 20, 40, 80, 160, 93, 186, 105, 210, 185, 111, 222, 161, 95, 190, 97, 194, 153, 47, 94, 188, 101, 202, 137, 15, 30, 60, 120, 240, 253, 231, 211, 187, 107, 214, 177, 127, 254, 225, 223, 163, 91, 182, 113, 226, 217, 175, 67, 134, 17, 34, 68, 136, 13, 26, 52, 104, 208, 189, 103, 206, 129, 31, 62, 124, 248, 237, 199, 147, 59, 118, 236, 197, 151, 51, 102, 204, 133, 23, 46, 92, 184, 109, 218, 169, 79, 158, 33, 66, 132, 21, 42, 84, 168, 77, 154, 41, 82, 164, 85, 170, 73, 146, 57, 114, 228, 213, 183, 115, 230, 209, 191, 99, 198, 145, 63, 126, 252, 229, 215, 179, 123, 246, 241, 255, 227, 219, 171, 75, 150, 49, 98, 196, 149, 55, 110, 220, 165, 87, 174, 65, 130, 25, 50, 100, 200, 141, 7, 14, 28, 56, 112, 224, 221, 167, 83, 166, 81, 162, 89, 178, 121, 242, 249, 239, 195, 155, 43, 86, 172, 69, 138, 9, 18, 36, 72, 144, 61, 122, 244, 245, 247, 243, 251, 235, 203, 139, 11, 22, 44, 88, 176, 125, 250, 233, 207, 131, 27, 54, 108, 216, 173, 71, 142);
            var eccWords = this.corCodeWords.ECCW;
            var messagePolynom = [];
            for (var i = 0; i < decimalValue.length; i++) {
                messagePolynom.push({
                Exponent: decimalValue.length - 1 - i,
                Coefficient: decimalValue[i]
            })
            }

            var generatorPolynom = [];
            for (var i = 0; i < gx.length; i++)
            {
                generatorPolynom.push({
                Exponent: gx.length - 1 - i,
                Coefficient: this._findElement(gx[i], alpha)
            })
            }

            for (var i = 0; i < messagePolynom.length; i++)
            {
                messagePolynom[i].Exponent = messagePolynom[i].Exponent + eccWords;
            }

            var genLeadtermFactor = messagePolynom[0].Exponent - generatorPolynom[0].Exponent;
            for (var i = 0; i < generatorPolynom.length; i++) {
                generatorPolynom[i].Coefficient = generatorPolynom[i].Coefficient;
                generatorPolynom[i].Exponent = generatorPolynom[i].Exponent + genLeadtermFactor;
            }

            var leadTermSource = messagePolynom;
            for (var i = 0; i < messagePolynom.length; i++)
            {
                if (leadTermSource[0].Coefficient == 0) {
                    leadTermSource.splice(0, 1);
                }
                else {
                    var alphaNotation = this._convertToAlphaNotation(leadTermSource, alpha);
                    var resPoly = this._multiplyGeneratorPolynomByLeadterm(generatorPolynom, alphaNotation[0], i);
                    resPoly = this._convertToDecNotation(resPoly,alpha);
                    resPoly = this._XORPolynoms(leadTermSource, resPoly);
                    leadTermSource = resPoly;
                }

            }
            var returnArray = [];
            for (var i = 0; i < leadTermSource.length; i++) {
                returnArray.push(leadTermSource[i].Coefficient);
            }
            return returnArray;
        },

        /** 
         * @private
         */
         _convertToAlphaNotation: function(poly, alpha) {
             var newPoly = [];
             for (var i = 0; i < poly.length; i++) {
                 if (poly[i].Coefficient != 0) {
                     newPoly.push({
                         Exponent: poly[i].Exponent,
                         Coefficient: this._findElement(poly[i].Coefficient, alpha)
                     })
                 }
             }
             return newPoly;
         },

         /** 
         * @private
         */
         _multiplyGeneratorPolynomByLeadterm: function(genPolynom, leadTerm, lowerExponentBy) {
             var tempPolynom = [];
             for (var i = 0; i < genPolynom.length; i++) {
                 tempPolynom.push({
                     Exponent: genPolynom[i].Exponent - lowerExponentBy,
                     Coefficient: (genPolynom[i].Coefficient + leadTerm.Coefficient) % 255
             })
             }
             return tempPolynom;
         },

         /** 
         * @private
         */
         _convertToDecNotation: function(poly, alpha) {
             var tempPolynom = [];
             for (var i = 0; i < poly.length; i++) {
             tempPolynom.push({
                     Exponent: poly[i].Exponent,
                     Coefficient:  this._getIntValFromAlphaExp(poly[i].Coefficient, alpha)
             })
             }
             return tempPolynom;
         },

         /** 
         * @private
         */
         _getIntValFromAlphaExp: function(element, alpha) {
             if (element > 255)
            {
                element = element - 255;
            }
            return alpha[element];
         },
         
         
         /** 
         * @private
         */
         _XORPolynoms: function(messagePolynom, resPolynom) {
              var resultPolynom = [];
              var longPoly = [];
              var shortPoly = [];
            if (messagePolynom.length >= resPolynom.length)
            {
                longPoly = messagePolynom;
                shortPoly = resPolynom;
            }
            else
            {
                longPoly = resPolynom;
                shortPoly = messagePolynom;
            }
            
            for (var i = 0; i < longPoly.length; i++)
            {
            resultPolynom.push({
                     Exponent: messagePolynom[0].Exponent - i,
                     Coefficient:  longPoly[i].Coefficient ^ (shortPoly.length > i ? shortPoly[i].Coefficient : 0)
             })
            }
            resultPolynom.splice(0, 1);
            return resultPolynom;
         },

        /** 
         * @private
         */
        _findElement: function (element, alpha) {
            var j = 0;
            for (; j < alpha.length; j++) {
                if (element == alpha[j])
                    break;
            }
            return j;
        },

        /** 
         * @private
         */
        _getElement: function (element) {
            var gx = new Array(element.length);
            var alpha = new Array(1, 2, 4, 8, 16, 32, 64, 128, 29, 58, 116, 232, 205, 135, 19, 38, 76, 152, 45, 90, 180, 117, 234, 201, 143, 3, 6, 12, 24, 48, 96, 192, 157, 39, 78, 156, 37, 74, 148, 53, 106, 212, 181, 119, 238, 193, 159, 35, 70, 140, 5, 10, 20, 40, 80, 160, 93, 186, 105, 210, 185, 111, 222, 161, 95, 190, 97, 194, 153, 47, 94, 188, 101, 202, 137, 15, 30, 60, 120, 240, 253, 231, 211, 187, 107, 214, 177, 127, 254, 225, 223, 163, 91, 182, 113, 226, 217, 175, 67, 134, 17, 34, 68, 136, 13, 26, 52, 104, 208, 189, 103, 206, 129, 31, 62, 124, 248, 237, 199, 147, 59, 118, 236, 197, 151, 51, 102, 204, 133, 23, 46, 92, 184, 109, 218, 169, 79, 158, 33, 66, 132, 21, 42, 84, 168, 77, 154, 41, 82, 164, 85, 170, 73, 146, 57, 114, 228, 213, 183, 115, 230, 209, 191, 99, 198, 145, 63, 126, 252, 229, 215, 179, 123, 246, 241, 255, 227, 219, 171, 75, 150, 49, 98, 196, 149, 55, 110, 220, 165, 87, 174, 65, 130, 25, 50, 100, 200, 141, 7, 14, 28, 56, 112, 224, 221, 167, 83, 166, 81, 162, 89, 178, 121, 242, 249, 239, 195, 155, 43, 86, 172, 69, 138, 9, 18, 36, 72, 144, 61, 122, 244, 245, 247, 243, 251, 235, 203, 139, 11, 22, 44, 88, 176, 125, 250, 233, 207, 131, 27, 54, 108, 216, 173, 71, 142);
            for (var i = 0; i < element.length; i++) {
                if (element[i] > 255)
                    element[i] = element[i] - 255;
                gx[i] = alpha[element[i]];
            }
            return gx;
        },

        /** 
         * @private
         */
        _toDecimal: function (inString) {
            var decimalValue = new Array(inString.length);
            for (var i = 0; i < inString.length; i++)
                decimalValue[i] = parseInt(inString[i], 2);

            return decimalValue;
        },

        /** 
         * @private
         */
        _splitCodeWord: function (ds, blk, count) {
            count = parseInt(count);
            var ds1 = new Array(count);
            for (var i = 0; i < count; i++)
                ds1[i] = ds[blk][i];
            return ds1;
        },

        /** 
         * Create blocks for datamatrix barcode.
         * @private
         */
        _createBlocks: function (data, noOfBlocks) {
            var ret = this._create2DArray(noOfBlocks, data.length / 8 / noOfBlocks);
            var stringValue = "";
            var j = 0, i = 0, blockNumber = 0;

            for (; j < data.length; j++) {
                if (j % 8 == 0 && j != 0) {
                    ret[blockNumber][i] = stringValue;
                    stringValue = "";
                    i++;

                    if (i == (data.length / noOfBlocks / 8)) {
                        blockNumber++;
                        i = 0;
                    }
                }

                stringValue += data[j] ? 1 : 0;
            }
            ret[blockNumber][i] = stringValue;
            return ret;
        },

        /** 
         * Returns alphanumeric values for the character.
         * @private
         */
        _getAlphanumericvalues: function (charValue) {
            var valueInInt = -1;
            var alphaNumArray = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' ', '$', '%', '*', '+', '-', '.', '/', ':');
            valueInInt = alphaNumArray.indexOf(charValue);
            return valueInInt;
        },

        /** 
         * @private
         */
        _stringToBoolArray: function (numberInString, noOfBits) {
            var numberInBool = new Array(noOfBits);

            var number = 0;
            for (var i = 0; i < numberInString.length; i++)
                number = number * 10 + numberInString.charCodeAt(i) - 48;

            for (var i = 0; i < noOfBits; i++)
                numberInBool[noOfBits - i - 1] = ((number >> i) & 1) == 1;

            return numberInBool;
        },

        /** 
         * @private
         */
        _intToBoolArray: function (number, noOfBits) {
            var numberInBool = new Array(noOfBits);
            for (var i = 0; i < noOfBits; i++)
                numberInBool[noOfBits - i - 1] = ((number >> i) & 1) == 1;
            return numberInBool;
        },

        /** 
         * @private
         */
        _drawPDP: function (x, y) {
            var i, j;
            for (i = x, j = y; i < x + 7; i++, j++) {
                this.moduleValue[i][y].IsBlack = true;
                this.moduleValue[i][y].IsFilled = true;
                this.moduleValue[i][y].IsPDP = true;

                this.moduleValue[i][y + 6].IsBlack = true;
                this.moduleValue[i][y + 6].IsFilled = true;
                this.moduleValue[i][y + 6].IsPDP = true;

                if (y + 7 < this.noOfModules) {
                    this.moduleValue[i][y + 7].IsBlack = false;
                    this.moduleValue[i][y + 7].IsFilled = true;
                    this.moduleValue[i][y + 7].IsPDP = true;
                }
                else if (y - 1 >= 0) {
                    this.moduleValue[i][y - 1].IsBlack = false;
                    this.moduleValue[i][y - 1].IsFilled = true;
                    this.moduleValue[i][y - 1].IsPDP = true;
                }

                this.moduleValue[x][j].IsBlack = true;
                this.moduleValue[x][j].IsFilled = true;
                this.moduleValue[x][j].IsPDP = true;

                this.moduleValue[x + 6][j].IsBlack = true;
                this.moduleValue[x + 6][j].IsFilled = true;
                this.moduleValue[x + 6][j].IsPDP = true;

                if (x + 7 < this.noOfModules) {
                    this.moduleValue[x + 7][j].IsBlack = false;
                    this.moduleValue[x + 7][j].IsFilled = true;
                    this.moduleValue[x + 7][j].IsPDP = true;
                }
                else if (x - 1 >= 0) {
                    this.moduleValue[x - 1][j].IsBlack = false;
                    this.moduleValue[x - 1][j].IsFilled = true;
                    this.moduleValue[x - 1][j].IsPDP = true;
                }
            }

            if (x + 7 < this.noOfModules && y + 7 < this.noOfModules) {
                this.moduleValue[x + 7][y + 7].IsBlack = false;
                this.moduleValue[x + 7][y + 7].IsFilled = true;
                this.moduleValue[x + 7][y + 7].IsPDP = true;
            }
            else if (x + 7 < this.noOfModules && y + 7 >= this.noOfModules) {
                this.moduleValue[x + 7][y - 1].IsBlack = false;
                this.moduleValue[x + 7][y - 1].IsFilled = true;
                this.moduleValue[x + 7][y - 1].IsPDP = true;
            }
            else if (x + 7 >= this.noOfModules && y + 7 < this.noOfModules) {
                this.moduleValue[x - 1][y + 7].IsBlack = false;
                this.moduleValue[x - 1][y + 7].IsFilled = true;
                this.moduleValue[x - 1][y + 7].IsPDP = true;
            }

            x++;
            y++;
            for (i = x, j = y; i < x + 5; i++, j++) {
                this.moduleValue[i][y].IsBlack = false;
                this.moduleValue[i][y].IsFilled = true;
                this.moduleValue[i][y].IsPDP = true;

                this.moduleValue[i][y + 4].IsBlack = false;
                this.moduleValue[i][y + 4].IsFilled = true;
                this.moduleValue[i][y + 4].IsPDP = true;

                this.moduleValue[x][j].IsBlack = false;
                this.moduleValue[x][j].IsFilled = true;
                this.moduleValue[x][j].IsPDP = true;

                this.moduleValue[x + 4][j].IsBlack = false;
                this.moduleValue[x + 4][j].IsFilled = true;
                this.moduleValue[x + 4][j].IsPDP = true;
            }

            x++;
            y++;
            for (i = x, j = y; i < x + 3; i++, j++) {
                this.moduleValue[i][y].IsBlack = true;
                this.moduleValue[i][y].IsFilled = true;
                this.moduleValue[i][y].IsPDP = true;

                this.moduleValue[i][y + 2].IsBlack = true;
                this.moduleValue[i][y + 2].IsFilled = true;
                this.moduleValue[i][y + 2].IsPDP = true;

                this.moduleValue[x][j].IsBlack = true;
                this.moduleValue[x][j].IsFilled = true;
                this.moduleValue[x][j].IsPDP = true;

                this.moduleValue[x + 2][j].IsBlack = true;
                this.moduleValue[x + 2][j].IsFilled = true;
                this.moduleValue[x + 2][j].IsPDP = true;
            }
            this.moduleValue[x + 1][y + 1].IsBlack = true;
            this.moduleValue[x + 1][y + 1].IsFilled = true;
            this.moduleValue[x + 1][y + 1].IsPDP = true;
        },

        /** 
         * @private
         */
        _drawAlignmentPattern: function (x, y) {
            var i, j;
            for (i = x - 2, j = y - 2; i < x + 3; i++, j++) {
                this.moduleValue[i][y - 2].IsBlack = true;
                this.moduleValue[i][y - 2].IsFilled = true;

                this.moduleValue[i][y + 2].IsBlack = true;
                this.moduleValue[i][y + 2].IsFilled = true;

                this.moduleValue[x - 2][j].IsBlack = true;
                this.moduleValue[x - 2][j].IsFilled = true;

                this.moduleValue[x + 2][j].IsBlack = true;
                this.moduleValue[x + 2][j].IsFilled = true;
            }

            for (i = x - 1, j = y - 1; i < x + 2; i++, j++) {
                this.moduleValue[i][y - 1].IsBlack = false;
                this.moduleValue[i][y - 1].IsFilled = true;

                this.moduleValue[i][y + 1].IsBlack = false;
                this.moduleValue[i][y + 1].IsFilled = true;

                this.moduleValue[x - 1][j].IsBlack = false;
                this.moduleValue[x - 1][j].IsFilled = true;

                this.moduleValue[x + 1][j].IsBlack = false;
                this.moduleValue[x + 1][j].IsFilled = true;
            }
            this.moduleValue[x][y].IsBlack = true;
            this.moduleValue[x][y].IsFilled = true;
        },

        /** 
         * @private
         */
        _getAlignmentPatternCoOrdinates: function () {
            var allign = new Array();
            switch (this.m_Version) {
                case 2:
                    allign = new Array(6, 18);
                    break;
                case 3:
                    allign = new Array(6, 22);
                    break;
                case 4:
                    allign = new Array(6, 26);
                    break;
                case 5:
                    allign = new Array(6, 30);
                    break;
                case 6:
                    allign = new Array(6, 34);
                    break;
                case 7:
                    allign = new Array(6, 22, 38);
                    break;
                case 8:
                    allign = new Array(6, 24, 42);
                    break;
                case 9:
                    allign = new Array(6, 26, 46);
                    break;
                case 10:
                    allign = new Array(6, 28, 50);
                    break;
                case 11:
                    allign = new Array(6, 30, 54);
                    break;
                case 12:
                    allign = new Array(6, 32, 58);
                    break;
                case 13:
                    allign = new Array(6, 34, 62);
                    break;
                case 14:
                    allign = new Array(6, 26, 46, 66);
                    break;
                case 15:
                    allign = new Array(6, 26, 48, 70);
                    break;
                case 16:
                    allign = new Array(6, 26, 50, 74);
                    break;
                case 17:
                    allign = new Array(6, 30, 54, 78);
                    break;
                case 18:
                    allign = new Array(6, 30, 56, 82);
                    break;
                case 19:
                    allign = new Array(6, 30, 58, 86);
                    break;
                case 20:
                    allign = new Array(6, 34, 62, 90);
                    break;
                case 21:
                    allign = new Array(6, 28, 50, 72, 94);
                    break;
                case 22:
                    allign = new Array(6, 26, 50, 74, 98);
                    break;
                case 23:
                    allign = new Array(6, 30, 54, 78, 102);
                    break;
                case 24:
                    allign = new Array(6, 28, 54, 80, 106);
                    break;
                case 25:
                    allign = new Array(6, 32, 58, 84, 110);
                    break;
                case 26:
                    allign = new Array(6, 30, 58, 86, 114);
                    break;
                case 27:
                    allign = new Array(6, 34, 62, 90, 118);
                    break;
                case 28:
                    allign = new Array(6, 26, 50, 74, 98, 122);
                    break;
                case 29:
                    allign = new Array(6, 30, 54, 78, 102, 126);
                    break;
                case 30:
                    allign = new Array(6, 26, 52, 78, 104, 130);
                    break;
                case 31:
                    allign = new Array(6, 30, 56, 82, 108, 134);
                    break;
                case 32:
                    allign = new Array(6, 34, 60, 86, 112, 138);
                    break;
                case 33:
                    allign = new Array(6, 30, 58, 86, 114, 142);
                    break;
                case 34:
                    allign = new Array(6, 34, 62, 90, 118, 146);
                    break;
                case 35:
                    allign = new Array(6, 30, 54, 78, 102, 126, 150);
                    break;
                case 36:
                    allign = new Array(6, 24, 50, 76, 102, 128, 154);
                    break;
                case 37:
                    allign = new Array(6, 28, 54, 80, 106, 132, 158);
                    break;
                case 38:
                    allign = new Array(6, 32, 58, 84, 110, 136, 162);
                    break;
                case 39:
                    allign = new Array(6, 26, 54, 82, 110, 138, 166);
                    break;
                case 40:
                    allign = new Array(6, 30, 58, 86, 114, 142, 170);
                    break;
            }
            return allign;
        },

        /** 
         * @private
         */
        _findECINumber: function (text) {
            var num = 3;
            for (var i = 0; i < text.length; i++) {
                var cCode = text.charCodeAt(i);
                if (cCode >= 32 && cCode <= 255) {
                    continue;
                }

                var check = cCode.toString(16);
                var CP437CharSet = new Array("2591", "2592", "2593", "2502", "2524", "2561", "2562", "2556", "2555", "2563", "2551", "2557", "255D", "255C", "255B", "2510", "2514", "2534", "252C", "251C", "2500", "253C", "255E", "255F", "255A", "2554", "2569", "2566", "2560", "2550", "256C", "2567", "2568", "2564", "2565", "2559", "2558", "2552", "2553", "256B", "256A", "2518", "250C", "2588", "2584", "258C", "2590", "2580", "25A0");
                var latin2CharSet = new Array("104", "2D8", "141", "13D", "15A", "160", "15E", "164", "179", "17D", "17B", "105", "2DB", "142", "13E", "15B", "2C7", "161", "15F", "165", "17A", "2DD", "17E", "17C", "154", "102", "139", "106", "10C", "118", "11A", "10E", "110", "143", "147", "150", "158", "16E", "170", "162", "155", "103", "13A", "107", "10D", "119", "11B", "10F", "111", "144", "148", "151", "159", "16F", "171", "163", "2D9");
                var latin3CharSet = new Array("126", "124", "130", "15E", "11E", "134", "17B", "127", "125", "131", "15F", "11F", "135", "17C", "10A", "108", "120", "11C", "16C", "15C", "10B", "109", "121", "11D", "16D", "15D");
                var latin4CharSet = new Array("104", "138", "156", "128", "13B", "160", "112", "122", "166", "17D", "105", "2DB", "157", "129", "13C", "2C7", "161", "113", "123", "167", "14A", "17E", "14B", "100", "12E", "10C", "118", "116", "12A", "110", "145", "14C", "136", "172", "168", "16A", "101", "12F", "10D", "119", "117", "12B", "111", "146", "14D", "137", "173", "169", "16B");
                var windows1250CharSet = new Array("141", "104", "15E", "17B", "142", "105", "15F", "13D", "13E", "17C");
                var windows1251CharSet = new Array("402", "403", "453", "409", "40A", "40C", "40B", "40F", "452", "459", "45A", "45C", "45B", "45F", "40E", "45E", "408", "490", "401", "404", "407", "406", "456", "491", "451", "454", "458", "405", "455", "457");
                var windows1252CharSet = new Array("20AC", "201A", "192", "201E", "2026", "2020", "2021", "2C6", "2030", "160", "2039", "152", "17D", "2018", "2019", "201C", "201D", "2022", "2013", "2014", "2DC", "2122", "161", "203A", "153", "17E", "178");
                var windows1256CharSet = new Array("67E", "679", "152", "686", "698", "688", "6AF", "6A9", "691", "153", "6BA", "6BE", "6C1");

                /** Check for CP437*/
                if (CP437CharSet.indexOf(check) != -1) {
                    num = 2;
                    break;
                }
                    /** Check for ISO/IEC 8859-2*/
                else if (latin2CharSet.indexOf(check) != -1) {
                    num = 4;
                    break;
                }
                    /** Check for ISO/IEC 8859-3*/
                else if (latin3CharSet.indexOf(check) != -1) {
                    num = 5;
                    break;
                }
                    /** Check for ISO/IEC 8859-4*/
                else if (latin4CharSet.indexOf(check) != -1) {
                    num = 6;
                    break;
                }
                    /** Check for ISO/IEC 8859-5*/
                else if (check >= 1025 && check <= 1119 && check != 1037 && check != 1104 && check != 1117) {
                    num = 7;
                    break;
                }
                    /** Check for ISO/IEC 8859-6*/
                else if ((check >= 1569 && check <= 1594) || (check >= 1600 && check <= 1618) || check == 1567 || check == 1563 || check == 1548) {
                    num = 8;
                    break;
                }
                    /** Check for ISO/IEC 8859-7*/
                else if ((check >= 900 && check <= 974) || check == 890) {
                    num = 9;
                    break;
                }
                    /** Check for ISO/IEC 8859-8*/
                else if (check >= 1488 && check <= 1514) {
                    num = 10;
                    break;
                }
                    /** Check for ISO/IEC 8859-8*/
                else if (check >= 3585 && check <= 3675) {
                    num = 13;
                    break;
                }
                    /** Check for Windows1250*/
                else if ((windows1250CharSet.indexOf(check) != 1) || (check >= 1569 && check <= 1610)) {
                    num = 21;
                    break;
                }
                    /** Check for Windows1251*/
                else if ((windows1251CharSet.indexOf(check) != 1) || (check >= 1040 && check <= 1103)) {
                    num = 22;
                    break;
                }
                    /** Check for Windows1252*/
                else if (windows1252CharSet.indexOf(check) != -1) {
                    num = 23;
                    break;
                }
                    /** Check for Windows1256*/
                else if (windows1256CharSet.indexOf(check) != -1) {
                    num = 24;
                    break;
                }
            }
            return num;
        },

        /** 
         * @private
         */
        _getNumberOfDataCodeWord: function () {
            var countOfDataCodeWord = 0;

            switch (this.m_Version) {
                case 1:
                    countOfDataCodeWord = 16;
                    break;
                case 2:
                    countOfDataCodeWord = 28;
                    break;
                case 3:
                    countOfDataCodeWord = 44;
                    break;
                case 4:
                    countOfDataCodeWord = 64;
                    break;
                case 5:
                    countOfDataCodeWord = 86;
                    break;
                case 6:
                    countOfDataCodeWord = 108;
                    break;
                case 7:
                    countOfDataCodeWord = 124;
                    break;
                case 8:
                    countOfDataCodeWord = 154;
                    break;
                case 9:
                    countOfDataCodeWord = 182;
                    break;
                case 10:
                    countOfDataCodeWord = 216;
                    break;
                case 11:
                    countOfDataCodeWord = 254;
                    break;
                case 12:
                    countOfDataCodeWord = 290;
                    break;
                case 13:
                    countOfDataCodeWord = 334;
                    break;
                case 14:
                    countOfDataCodeWord = 365;
                    break;
                case 15:
                    countOfDataCodeWord = 415;
                    break;
                case 16:
                    countOfDataCodeWord = 453;
                    break;
                case 17:
                    countOfDataCodeWord = 507;
                    break;
                case 18:
                    countOfDataCodeWord = 563;
                    break;
                case 19:
                    countOfDataCodeWord = 627;
                    break;
                case 20:
                    countOfDataCodeWord = 669;
                    break;
                case 21:
                    countOfDataCodeWord = 714;
                    break;
                case 22:
                    countOfDataCodeWord = 782;
                    break;
                case 23:
                    countOfDataCodeWord = 860;
                    break;
                case 24:
                    countOfDataCodeWord = 914;
                    break;
                case 25:
                    countOfDataCodeWord = 1000;
                    break;
                case 26:
                    countOfDataCodeWord = 1062;
                    break;
                case 27:
                    countOfDataCodeWord = 1128;
                    break;
                case 28:
                    countOfDataCodeWord = 1193;
                    break;
                case 29:
                    countOfDataCodeWord = 1267;
                    break;
                case 30:
                    countOfDataCodeWord = 1373;
                    break;
                case 31:
                    countOfDataCodeWord = 1455;
                    break;
                case 32:
                    countOfDataCodeWord = 1541;
                    break;
                case 33:
                    countOfDataCodeWord = 1631;
                    break;
                case 34:
                    countOfDataCodeWord = 1725;
                    break;
                case 35:
                    countOfDataCodeWord = 1812;
                    break;
                case 36:
                    countOfDataCodeWord = 1914;
                    break;
                case 37:
                    countOfDataCodeWord = 1992;
                    break;
                case 38:
                    countOfDataCodeWord = 2102;
                    break;
                case 39:
                    countOfDataCodeWord = 2216;
                    break;
                case 40:
                    countOfDataCodeWord = 2334;
                    break;
            }

            return countOfDataCodeWord;
        },

        /** 
         * Returns the number of error correcting codewords based on QR version.
         * @private
         */
        _getNumberOfErrorCorrectingCodeWords: function () {
            var index = (this.m_Version - 1) * 4;
            index += 1;
            var numberOfErrorCorrectingCodeWords = new Array(7, 10, 13, 17, 10, 16, 22, 28, 15, 26, 36, 44, 20, 36, 52, 64, 26, 48, 72, 88, 36, 64, 96, 112, 40, 72, 108, 130, 48, 88, 132, 156, 60, 110, 160, 192, 72, 130, 192, 224, 80, 150, 224, 264, 96, 176, 260, 308, 104, 198, 288, 352, 120, 216, 320, 384, 132, 240, 360, 432, 144, 280, 408, 480, 168, 308, 448, 532, 180, 338, 504, 588, 196, 364, 546, 650, 224, 416, 600, 700, 224, 442, 644, 750, 252, 476, 690, 816, 270, 504, 750, 900, 300, 560, 810, 960, 312, 588, 870, 1050, 336, 644, 952, 1110, 360, 700, 1020, 1200, 390, 728, 1050, 1260, 420, 784, 1140, 1350, 450, 812, 1200, 1440, 480, 868, 1290, 1530, 510, 924, 1350, 1620, 540, 980, 1440, 1710, 570, 1036, 1530, 1800, 570, 1064, 1590, 1890, 600, 1120, 1680, 1980, 630, 1204, 1770, 2100, 660, 1260, 1860, 2220, 720, 1316, 1950, 2310, 750, 1372, 2040, 2430);
            return numberOfErrorCorrectingCodeWords[index];
        },

        /** 
         * Returns the number of error correction blocks based on QR version.
         * @private
         */
        _getNumberOfErrorCorrectionBlocks: function () {
            var numberOfErrorCorrectionBlocks = new Array();
            switch (this.m_Version) {
                case 1:
                case 2:
                case 3:
                    numberOfErrorCorrectionBlocks[0] = 1;
                    break;
                case 4:
                case 5:
                    numberOfErrorCorrectionBlocks[0] = 2;
                    break;
                case 6:
                case 7:
                    numberOfErrorCorrectionBlocks[0] = 4;
                    break;
                case 8:
                    numberOfErrorCorrectionBlocks = new Array(2, 60, 38, 2, 61, 39);
                    break;
                case 9:
                    numberOfErrorCorrectionBlocks = new Array(3, 58, 36, 2, 59, 37);
                    break;
                case 10:
                    numberOfErrorCorrectionBlocks = new Array(4, 69, 43, 1, 70, 44);
                    break;
                case 11:
                    numberOfErrorCorrectionBlocks = new Array(1, 80, 50, 4, 81, 51);
                    break;
                case 12:
                    numberOfErrorCorrectionBlocks = new Array(6, 58, 36, 2, 59, 37);
                    break;
                case 13:
                    numberOfErrorCorrectionBlocks = new Array(8, 59, 37, 1, 60, 38);
                    break;
                case 14:
                    numberOfErrorCorrectionBlocks = new Array(4, 64, 40, 5, 65, 41);
                    break;
                case 15:
                    numberOfErrorCorrectionBlocks = new Array(5, 65, 41, 5, 66, 42);
                    break;
                case 16:
                    numberOfErrorCorrectionBlocks = new Array(7, 73, 45, 3, 74, 46);
                    break;
                case 17:
                    numberOfErrorCorrectionBlocks = new Array(10, 74, 46, 1, 75, 47);
                    break;
                case 18:
                    numberOfErrorCorrectionBlocks = new Array(9, 69, 43, 4, 70, 44);
                    break;
                case 19:
                    numberOfErrorCorrectionBlocks = new Array(3, 70, 44, 11, 71, 45);
                    break;
                case 20:
                    numberOfErrorCorrectionBlocks = new Array(3, 67, 41, 13, 68, 42);
                    break;
                case 21:
                case 22:
                    numberOfErrorCorrectionBlocks[0] = 17;
                    break;
                case 23:
                    numberOfErrorCorrectionBlocks = new Array(4, 75, 47, 14, 76, 48);
                    break;
                case 24:
                    numberOfErrorCorrectionBlocks = new Array(6, 73, 45, 14, 74, 46);
                    break;
                case 25:
                    numberOfErrorCorrectionBlocks = new Array(8, 75, 47, 13, 76, 48);
                    break;
                case 26:
                    numberOfErrorCorrectionBlocks = new Array(19, 74, 46, 4, 75, 47);
                    break;
                case 27:
                    numberOfErrorCorrectionBlocks = new Array(22, 73, 45, 3, 74, 46);
                    break;
                case 28:
                    numberOfErrorCorrectionBlocks = new Array(3, 73, 45, 23, 74, 46);
                    break;
                case 29:
                    numberOfErrorCorrectionBlocks = new Array(21, 73, 45, 7, 74, 46);
                    break;
                case 30:
                    numberOfErrorCorrectionBlocks = new Array(19, 75, 47, 10, 76, 48);
                    break;
                case 31:
                    numberOfErrorCorrectionBlocks = new Array(2, 74, 46, 29, 75, 47);
                    break;
                case 32:
                    numberOfErrorCorrectionBlocks = new Array(10, 74, 46, 23, 75, 47);
                    break;
                case 33:
                    numberOfErrorCorrectionBlocks = new Array(14, 74, 46, 21, 75, 47);
                    break;
                case 34:
                    numberOfErrorCorrectionBlocks = new Array(14, 74, 46, 23, 75, 47);
                    break;
                case 35:
                    numberOfErrorCorrectionBlocks = new Array(12, 75, 47, 26, 76, 48);
                    break;
                case 36:
                    numberOfErrorCorrectionBlocks = new Array(6, 75, 47, 34, 76, 48);
                    break;
                case 37:
                    numberOfErrorCorrectionBlocks = new Array(29, 74, 46, 14, 75, 47);
                    break;
                case 38:
                    numberOfErrorCorrectionBlocks = new Array(13, 74, 46, 32, 75, 47);
                    break;
                case 39:
                    numberOfErrorCorrectionBlocks = new Array(40, 75, 47, 7, 76, 48);
                    break;
                case 40:
                    numberOfErrorCorrectionBlocks = new Array(18, 75, 47, 31, 76, 48);
                    break;
            }

            return numberOfErrorCorrectionBlocks;
        },

        /** 
         * Returns the end values based on qr version
         * @private
         */
        _getEnd: function () {
            var endValues = new Array(208, 359, 567, 807, 1079, 1383, 1568, 1936, 2336, 2768, 3232, 3728, 4256, 4651, 5243, 5867, 6523, 7211, 7931, 8683, 9252, 10068, 10916, 11796, 12708, 13652, 14628, 15371, 16411, 17483, 18587, 19723, 20891, 22091, 23008, 24272, 25568, 26896, 28256, 29648);
            return endValues[this.m_Version - 1];
        },

        /** 
         * Returns the data capacity based on QR version
         * @private
         */
        _getDataCapacity: function () {
            var dataCapacityValues = new Array(26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733, 815, 901, 991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185, 2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706);
            return dataCapacityValues[this.m_Version - 1];
        },

        /** 
         * @private
         */
        _getFormatInformation: function () {
            var formatInformation = new Array(1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1);
            return formatInformation;
        },

        /** 
         * Returns the QR version
         * @private
         */
        _getVersionInformation: function () {
            var versionInformation = new Array();
            switch (this.m_Version) {
                case 7:
                    versionInformation = new Array(0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0);
                    break;
                case 8:
                    versionInformation = new Array(0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0);
                    break;
                case 9:
                    versionInformation = new Array(1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0);
                    break;
                case 10:
                    versionInformation = new Array(1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0);
                    break;
                case 11:
                    versionInformation = new Array(0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0);
                    break;
                case 12:
                    versionInformation = new Array(0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0);
                    break;
                case 13:
                    versionInformation = new Array(1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0);
                    break;
                case 14:
                    versionInformation = new Array(1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0);
                    break;
                case 15:
                    versionInformation = new Array(0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0);
                    break;
                case 16:
                    versionInformation = new Array(0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0);
                    break;
                case 17:
                    versionInformation = new Array(1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0);
                    break;
                case 18:
                    versionInformation = new Array(1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0);
                    break;
                case 19:
                    versionInformation = new Array(0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0);
                    break;
                case 20:
                    versionInformation = new Array(0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0);
                    break;
                case 21:
                    versionInformation = new Array(1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0);
                    break;
                case 22:
                    versionInformation = new Array(1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0);
                    break;
                case 23:
                    versionInformation = new Array(0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0);
                    break;
                case 24:
                    versionInformation = new Array(0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0);
                    break;
                case 25:
                    versionInformation = new Array(1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0);
                    break;
                case 26:
                    versionInformation = new Array(1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0);
                    break;
                case 27:
                    versionInformation = new Array(0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0);
                    break;
                case 28:
                    versionInformation = new Array(0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0);
                    break;
                case 29:
                    versionInformation = new Array(1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0);
                    break;
                case 30:
                    versionInformation = new Array(1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0);
                    break;
                case 31:
                    versionInformation = new Array(0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0);
                    break;
                case 32:
                    versionInformation = new Array(1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1);
                    break;
                case 33:
                    versionInformation = new Array(0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1);
                    break;
                case 34:
                    versionInformation = new Array(0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1);
                    break;
                case 35:
                    versionInformation = new Array(1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1);
                    break;
                case 36:
                    versionInformation = new Array(1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1);
                    break;
                case 37:
                    versionInformation = new Array(0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1);
                    break;
                case 38:
                    versionInformation = new Array(0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1);
                    break;
                case 39:
                    versionInformation = new Array(1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1);
                    break;
                case 40:
                    versionInformation = new Array(1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1);
                    break;
            }

            return versionInformation;
        },

        /** 
         * Returns the code points of the text
         * @private
         */
        _getStringCodePoints: (function () {
            function surrogatePairToCodePoint(charCode1, charCode2) {
                return ((charCode1 & 0x3FF) << 10) + (charCode2 & 0x3FF) + 0x10000;
            }

            /** Read string in character by character and create an array of code points.*/
            return function (str) {
                var codePoints = [], i = 0, charCode;
                while (i < str.length) {
                    charCode = str.charCodeAt(i);
                    if ((charCode & 0xF800) == 0xD800)
                        codePoints.push(surrogatePairToCodePoint(charCode, str.charCodeAt(++i)));
                    else
                        codePoints.push(charCode);
                    ++i;
                }
                return codePoints;
            }
        })(),

        /** 
         * Creates 2 dimensional array.
         * @private
         */
        _create2DArray: function (rows, columns) {
            rows = parseInt(rows);
            columns = parseInt(columns);
            var twoDArray = new Array(rows);

            for (var i = 0; i < rows; i++)
                twoDArray[i] = new Array(columns);

            return twoDArray;
        },

        /** 
         * Builds datamatrix barcode.
         * @private
         */
        _buildDataMatrix: function () {
            var symbolAttributes = [[10, 10, 1, 1, 3, 5, 1, 3], [12, 12, 1, 1, 5, 7, 1, 5], [14, 14, 1, 1, 8, 10, 1, 8], [16, 16, 1, 1, 12, 12, 1, 12], [18, 18, 1, 1, 18, 14, 1, 18], [20, 20, 1, 1, 22, 18, 1, 22], [22, 22, 1, 1, 30, 20, 1, 30], [24, 24, 1, 1, 36, 24, 1, 36], [26, 26, 1, 1, 44, 28, 1, 44], [32, 32, 2, 2, 62, 36, 1, 62], [36, 36, 2, 2, 86, 42, 1, 86], [40, 40, 2, 2, 114, 48, 1, 114], [44, 44, 2, 2, 144, 56, 1, 144], [48, 48, 2, 2, 174, 68, 1, 174], [52, 52, 2, 2, 204, 84, 2, 102], [64, 64, 4, 4, 280, 112, 2, 140], [72, 72, 4, 4, 368, 144, 4, 92], [80, 80, 4, 4, 456, 192, 4, 114], [88, 88, 4, 4, 576, 224, 4, 144], [96, 96, 4, 4, 696, 272, 4, 174], [104, 104, 4, 4, 816, 336, 6, 136], [120, 120, 6, 6, 1050, 408, 6, 175], [132, 132, 6, 6, 1304, 496, 8, 163], [144, 144, 6, 6, 1558, 620, 10, 156], [8, 18, 1, 1, 5, 7, 1, 5], [8, 32, 2, 1, 10, 11, 1, 10], [12, 26, 1, 1, 16, 14, 1, 16], [12, 36, 2, 1, 22, 18, 1, 22], [16, 36, 2, 1, 32, 24, 1, 32], [16, 48, 2, 1, 49, 28, 1, 49]];
            var codeWords = this._getStringCodePoints(this.Model.text);
            var correctionCodewords;
            var symAttr;

            /** ASCII Encoder.*/
            var encodedPoints = new Array(); var n = 0;
            for (var e = 0; e < codeWords.length; e++) {
                if (codeWords[e] < 127)
                    encodedPoints[n] = codeWords[e] + 1;
                else {
                    encodedPoints[n++] = 235;
                    encodedPoints[n] = codeWords[e] - 127;
                }
                n++;
            }

            /** Find symbol attribute.*/
            for (var e = 0; e < symbolAttributes.length; e++) {
                if (symbolAttributes[e][4] >= codeWords.length) {
                    symAttr = symbolAttributes[e];
                    break;
                }
            }

            if (symAttr[4] > encodedPoints.length) { //pad codewords
                var l = encodedPoints.length;
                var temp = new Array(symAttr[4]);
                var t = 0;

                for (var i = 0; i < l; i++)
                    temp[i] = encodedPoints[i];

                if (l < (symAttr[4] + 1))
                    temp[l] = 129; // denotes padding.

                l++;
                while (l < symAttr[4]) {	// more padding
                    var v = 129 + (((l + 1) * 149) % 253) + 1;
                    if (v > 254)
                        v -= 254;
                    temp[l++] = v;
                }

                encodedPoints = temp;
            }

            correctionCodewords = symAttr[5];
            var errCorrArray = this._errorCorrection(correctionCodewords, encodedPoints);

            var finalCodeWord = encodedPoints.concat(errCorrArray);
            var dataMatrixArray = this._createMatrix(finalCodeWord, symAttr);

            var w = dataMatrixArray.length * this.Model.xDimension;
            var h = dataMatrixArray[0].length * this.Model.xDimension;         

            this.contextEl.beginPath();
            this.contextEl.fillStyle = 'white';
            this.contextEl.fillRect(0, 0, w, h);
            this.contextEl.closePath();

            /** Draw DataMatrix.*/
            this._drawDataMatrix(dataMatrixArray, w, h);
        },

        /** 
         * Draws datamatrix barcode.
         * @private
         */
        _drawDataMatrix: function (dmArray, w, h) {
            
            var dim = parseInt(this.Model.xDimension);
            
            if(dmArray.length == dmArray[0].length && this.Model.height != "" && this.Model.width != "")
            {
                this.Model.height = this._getProperValue(this.Model.height);
                this.Model.width = this._getProperValue(this.Model.width);
            
                var dimension = Math.min(this.Model.width, this.Model.height);
            
                dim = dimension / dmArray.length;
            }
			else
			{
			this.Model.height = h;
			this.Model.width = w;
		    this.canvasEl[0].setAttribute("width", this.Model.width);
           this.BarcodeEl.css("width", this.Model.width);
			this.canvasEl[0].setAttribute("height", this.Model.height);
           this.BarcodeEl.css("height", this.Model.height);
			}
			
            var y = 0;

            this.contextEl.beginPath();

            for (var i = 0; i < dmArray.length; i++) {
                var x = 0;
                for (var j = 0; j < dmArray[i].length; j++) {
                    var colorBrush = null;
                    if (dmArray[i][j] == 1)
                        colorBrush = this.model.darkBarColor;
						else
						colorBrush = this.model.lightBarColor;
                    this.contextEl.fillStyle = colorBrush;
                    this.contextEl.fillRect(x, y, dim, dim)
                    x += dim;
                }
                y += dim;
            }

            this.contextEl.closePath();
            this.contextEl.stroke();
        },

        /** 
         * Creates matrix.
         * @private
         */
        _createMatrix: function (codeWord, symAttr) {
            var x, y, NC, NR;
            var places = new Array();

            var W = symAttr[1], H = symAttr[0];
            var FW = W / symAttr[2], FH = H / symAttr[3];

            NC = W - 2 * (W / FW);
            NR = H - 2 * (H / FH);

            var places = new Array(NC * NR);
            this._ecc200placement(places, NR, NC);
            var matrix = new Array(W * H);

            for (var i = 0; i < matrix.length; i++)
                matrix[i] = 0;

            for (y = 0; y < H; y += FH) {
                for (x = 0; x < W; x++)
                    matrix[parseInt(y * W) + x] = 1;
                for (x = 0; x < W; x += 2)
                    matrix[parseInt((y + FH - 1) * W) + x] = 1;
            }
            for (x = 0; x < W; x += FW) {
                for (y = 0; y < H; y++)
                    matrix[parseInt(y * W) + x] = 1;
                for (y = 0; y < H; y += 2)
                    matrix[parseInt(y * W) + x + FW - 1] = 1;
            }
            for (y = 0; y < NR; y++) {
                for (x = 0; x < NC; x++) {
                    var v = places[((NR - y - 1) * NC) + x];
                    if (v == 1 || v > 7 && (codeWord[(v >> 3) - 1] & (1 << (v & 7))) != 0) {
                        var inde = parseInt((parseInt(1 + y + (2 * parseInt(y / (FH - 2)))) * W) + 1 + x + +(2 * parseInt(x / (FW - 2))));
                        matrix[inde] = 1;
                    }
                }
            }

            var _w = symAttr[1], _h = symAttr[0];

            var tempArray = this._create2DArray(_w, _h);

            for (var x1 = 0; x1 < _w; x1++) {
                for (var y1 = 0; y1 < _h; y1++) {
                    tempArray[x1][y1] = matrix[(_w * y1) + x1];
                }
            }

            /** Rotate the array left.*/
            var tempArray2 = this._create2DArray(_h, _w);

            for (var i = 0; i < _h; i++) {
                for (var j = 0; j < _w; j++) {
                    tempArray2[_h - 1 - i][j] = tempArray[j][i];
                }
            }

            var w = symAttr[0] + (this.Model.quietZone.top + this.Model.quietZone.bottom);
            var h = symAttr[1] + (this.Model.quietZone.left + this.Model.quietZone.right);
            var quietZone = this.Model.quietZone.all;

            var dataMatrixArray = this._create2DArray(w, h);

            for (var i = 0; i < w; i++)
                for (var j = 0; j < h; j++)
                    dataMatrixArray[i][j] = 0;

            for (var i = quietZone; i < w - quietZone; i++) {
                for (var j = quietZone; j < h - quietZone; j++) {
                    dataMatrixArray[i][j] = tempArray2[i - quietZone][j - quietZone];
                }
            }

            return dataMatrixArray;
        },

        /** 
         * @private
         */
        _ecc200placement: function (array, NR, NC) {
            var r, c, p;
            // invalidate
            for (r = 0; r < NR; r++)
                for (c = 0; c < NC; c++)
                    array[r * NC + c] = 0;
            // start
            p = 1;
            r = 4;
            c = 0;
            do {
                // check corner
                if (r == NR && !(c != 0))
                    this._ecc200placementcornerA(array, NR, NC, p++);
                if ((r == NR - 2) && !(c != 0) && ((NC % 4) != 0))
                    this._ecc200placementcornerB(array, NR, NC, p++);
                if (r == NR - 2 && !(c != 0) && (NC % 8) == 4)
                    this._ecc200placementcornerC(array, NR, NC, p++);
                if (r == NR + 4 && c == 2 && !((NC % 8) != 0))
                    this._ecc200placementcornerD(array, NR, NC, p++);
                // up/right
                do {
                    if (r < NR && c >= 0 && !(array[r * NC + c] != 0)) {
                        this._ecc200placementblock(array, NR, NC, r, c, p++);
                    }
                    r -= 2;
                    c += 2;
                }
                while (r >= 0 && c < NC);
                r++;
                c += 3;
                // down/left
                do {
                    if (r > -1) {
                        if (c < NC && !(array[r * NC + c] != 0)) {
                            this._ecc200placementblock(array, NR, NC, r, c, p++);
                        }
                    }
                    r += 2;
                    c -= 2;
                }
                while (r < NR && c >= 0);
                r += 3;
                c++;
            }
            while (r < NR || c < NC);
            // unfilled corner
            if (!(array[NR * NC - 1] != 0))
                array[NR * NC - 1] = array[NR * NC - NC - 2] = 1;
        },

        /** 
         * @private
         */
        _ecc200placementcornerA: function (array, NR, NC, p) {
            this._ecc200placementbit(array, NR, NC, NR - 1, 0, p, 7);
            this._ecc200placementbit(array, NR, NC, NR - 1, 1, p, 6);
            this._ecc200placementbit(array, NR, NC, NR - 1, 2, p, 5);
            this._ecc200placementbit(array, NR, NC, 0, NC - 2, p, 4);
            this._ecc200placementbit(array, NR, NC, 0, NC - 1, p, 3);
            this._ecc200placementbit(array, NR, NC, 1, NC - 1, p, 2);
            this._ecc200placementbit(array, NR, NC, 2, NC - 1, p, 1);
            this._ecc200placementbit(array, NR, NC, 3, NC - 1, p, 0);
        },

        /** 
         * @private
         */
        _ecc200placementcornerB: function (array, NR, NC, p) {
            this._ecc200placementbit(array, NR, NC, NR - 3, 0, p, 7);
            this._ecc200placementbit(array, NR, NC, NR - 2, 0, p, 6);
            this._ecc200placementbit(array, NR, NC, NR - 1, 0, p, 5);
            this._ecc200placementbit(array, NR, NC, 0, NC - 4, p, 4);
            this._ecc200placementbit(array, NR, NC, 0, NC - 3, p, 3);
            this._ecc200placementbit(array, NR, NC, 0, NC - 2, p, 2);
            this._ecc200placementbit(array, NR, NC, 0, NC - 1, p, 1);
            this._ecc200placementbit(array, NR, NC, 1, NC - 1, p, 0);
        },

        /** 
         * @private
         */
        _ecc200placementcornerC: function (array, NR, NC, p) {
            this._ecc200placementbit(array, NR, NC, NR - 3, 0, p, 7);
            this._ecc200placementbit(array, NR, NC, NR - 2, 0, p, 6);
            this._ecc200placementbit(array, NR, NC, NR - 1, 0, p, 5);
            this._ecc200placementbit(array, NR, NC, 0, NC - 2, p, 4);
            this._ecc200placementbit(array, NR, NC, 0, NC - 1, p, 3);
            this._ecc200placementbit(array, NR, NC, 1, NC - 1, p, 2);
            this._ecc200placementbit(array, NR, NC, 2, NC - 1, p, 1);
            this._ecc200placementbit(array, NR, NC, 3, NC - 1, p, 0);
        },

        /** 
         * @private
         */
        _ecc200placementcornerD: function (array, NR, NC, p) {
            this._ecc200placementbit(array, NR, NC, NR - 1, 0, p, 7);
            this._ecc200placementbit(array, NR, NC, NR - 1, NC - 1, p, 6);
            this._ecc200placementbit(array, NR, NC, 0, NC - 3, p, 5);
            this._ecc200placementbit(array, NR, NC, 0, NC - 2, p, 4);
            this._ecc200placementbit(array, NR, NC, 0, NC - 1, p, 3);
            this._ecc200placementbit(array, NR, NC, 1, NC - 3, p, 2);
            this._ecc200placementbit(array, NR, NC, 1, NC - 2, p, 1);
            this._ecc200placementbit(array, NR, NC, 1, NC - 1, p, 0);
        },

        /** 
         * @private
         */
        _ecc200placementblock: function (array, NR, NC, r, c, p) {
            this._ecc200placementbit(array, NR, NC, r - 2, c - 2, p, 7);
            this._ecc200placementbit(array, NR, NC, r - 2, c - 1, p, 6);
            this._ecc200placementbit(array, NR, NC, r - 1, c - 2, p, 5);
            this._ecc200placementbit(array, NR, NC, r - 1, c - 1, p, 4);
            this._ecc200placementbit(array, NR, NC, r - 1, c - 0, p, 3);
            this._ecc200placementbit(array, NR, NC, r - 0, c - 2, p, 2);
            this._ecc200placementbit(array, NR, NC, r - 0, c - 1, p, 1);
            this._ecc200placementbit(array, NR, NC, r - 0, c - 0, p, 0);
        },

        /** 
         * @private
         */
        _ecc200placementbit: function (array, NR, NC, r, c, p, b) {
            if (r < 0) {
                r += NR;
                c += 4 - ((NR + 4) % 8);
            }
            if (c < 0) {
                c += NC;
                r += 4 - ((NC + 4) % 8);
            }
            array[r * NC + c] = (p << 3) + b;
        },

        /** 
         * Adds error correction codeword.
         * @private
         */
        _errorCorrection: function (num, codeWords) {
            var i, k, index = 1;
            var rsPolynomial;
            var temp = new Array(num + 1);

            /** Create log array.*/
            {
                var m_log = new Array(256);
                var m_aLog = new Array(256);

                m_log[0] = -255;
                m_aLog[0] = 1;

                for (var i = 1; i <= 255; i++) {
                    m_aLog[i] = m_aLog[i - 1] * 2;

                    if (m_aLog[i] >= 256)
                        m_aLog[i] = m_aLog[i] ^ 301;

                    m_log[m_aLog[i]] = i;
                }
            }

            /** CreateRSPolynomial.*/
            temp[0] = 1;
            for (i = 1; i <= num; i++) {
                temp[i] = 1;
                for (k = i - 1; k > 0; k--) {
                    if (temp[k] != 0)
                        temp[k] = m_aLog[(m_log[temp[k]] + index) % 255];
                    temp[k] ^= temp[k - 1];
                }
                temp[0] = m_aLog[(m_log[temp[0]] + index) % 255];
                index++;
            }

            rsPolynomial = new Array(num);
            for (var e = 0; e < rsPolynomial.length; e++)
                rsPolynomial[e] = temp[e];

            var t = 0;

            /** Create error correction array.*/
            var errCorrArray = new Array(num);

            for (var i = 0; i < num; i++)
                errCorrArray[i] = 0;

            for (var i = 0; i < codeWords.length; i++) {
                t = errCorrArray[num - 1] ^ codeWords[i];
                for (var j = num - 1; j > 0; j--) {
                    if (t != 0 && rsPolynomial[j] != 0)
                        errCorrArray[j] = (errCorrArray[j - 1] ^ m_aLog[(m_log[t] + m_log[rsPolynomial[j]]) % 255]);
                    else
                        errCorrArray[j] = errCorrArray[j - 1];
                }
                if (t != 0 && rsPolynomial[0] != 0)
                    errCorrArray[0] = (m_aLog[(m_log[t] + m_log[rsPolynomial[0]]) % 255]);
                else
                    errCorrArray[0] = 0;
            }

            errCorrArray = errCorrArray.reverse();
            return errCorrArray;
        },

        /** 
         * Validates the text against the barcode type.
         * @private
         */
        _validateText: function (str, exp) {
            var patt = new RegExp(exp);
            return patt.test(str);
        },

        /** 
         * @private
         */
        _getCharWidth: function (encodedText, symbolTable) {
            var charW = 0;
            var intercharacterGap = this.Model.narrowBarWidth;
            var charArray = encodedText.split("");
            for (var e = 0; e < charArray.length; e++)
                charW = charW + intercharacterGap + this._getWidth(symbolTable, charArray[e]);

            return charW;
        },

        /** 
         * @private
         */
        _getWidth: function (symbolTable, c) {
            var check = false;
            var wid = 0;
            var continuous;
            for (var e = 0; e < symbolTable.length; e++) {
                if (symbolTable[e][0] == c) {
                    var bars = symbolTable[e][2];
                    for (var i = 0; i < bars.length; i++) {
                        if (check == false) {
                            if (bars.length % 2 != 0)
                                continuous = true;
                        }

                        wid = wid + (bars[i] * this.Model.narrowBarWidth);
                        check = true;
                    }
                    return wid;
                }
            }
            return wid;
        },

        /** 
         * Draws 1 dimensional barcode.
         * @private
         */
        _draw1DBarcode: function (encodedText, symbolTable, w) {
            if (symbolTable.length > 0) {
                var charArray = encodedText.split("");
                var left = this.Model.quietZone.left;
                var top = this.Model.quietZone.top;

                var textSize = parseInt(this.textFont.size.replace('px', ''));
				this.Model.height = top + this.Model.barHeight + this.Model.quietZone.bottom;
				this.Model.width = w;
                if (this.Model.displayText) {
                    this.Model.height += (textSize + this.Model.barcodeToTextGapHeight);
                }
				 this.canvasEl[0].setAttribute("width", this.Model.width);
                this.BarcodeEl.css("width", this.Model.width);
                this.canvasEl[0].setAttribute("height", this.Model.height);
                this.BarcodeEl.css("height", this.Model.height);
				
                var wid = this.Model.width;
                var hei = this.Model.height;

                //find number of bars here
                var totalBars = 0;
				
				if (this.model.symbologyType == "ean" && encodedText.length == 18) {
					
					var parityTable = [["Odd","Odd","Odd","Odd","Odd","Odd"],["Odd","Odd","Even","Odd","Even","Even"],["Odd","Odd","Even","Even","Odd","Even"],["Odd","Odd","Even","Even","Even","Odd"],["Odd","Even","Odd","Odd","Even","Even"],["Odd","Even","Even","Odd","Odd","Even"],["Odd","Even","Even","Even","Odd","Odd"],["Odd","Even","Odd","Even","Odd","Even"],["Odd","Even","Odd","Even","Even","Odd"],["Odd","Even","Even","Odd","Even","Odd"]];
					var symbolTableOdd = [["0", 0, [3, 2, 1, 1]], ["1", 1, [2, 2, 2, 1]], ["2", 2, [2, 1, 2, 2]], ["3", 3, [1, 4, 1, 1]], ["4", 4, [1, 1, 3, 2]], ["5", 5, [1, 2, 3, 1]], ["6", 6, [1, 1, 1, 4]], ["7", 7, [1, 3, 1, 2]], ["8", 8, [1, 2, 1, 3]], ["9", 9, [3, 1, 1, 2]], ["B", 0 , [1, 1, 1, 1]]];
					var symbolTableEven = [["0", 0, [1, 1, 2, 3]], ["1", 1, [1, 2, 2, 2]], ["2", 2, [2, 2, 1, 2]], ["3", 3, [1, 1, 4, 1]], ["4", 4, [2, 3, 1, 1]], ["5", 5, [1, 3, 2, 1]], ["6", 6, [4, 1, 1, 1]], ["7", 7, [2, 1, 3, 1]], ["8", 8, [3, 1, 2, 1]], ["9", 9, [2, 1, 1, 3]]];
					var symbolTableRight = [["0", 0, [3, 2, 1, 1]], ["1", 1, [2, 2, 2, 1]], ["2", 2, [2, 1, 2, 2]], ["3", 3, [1, 4, 1, 1]], ["4", 4, [1, 1, 3, 2]], ["5", 5, [1, 2, 3, 1]], ["6", 6, [1, 1, 1, 4]], ["7", 7, [1, 3, 1, 2]], ["8", 8, [1, 2, 1, 3]], ["9", 9, [3, 1, 1, 2]]];
					var value = encodedText[2];
					var leftHandValue = parityTable[value];
					var data = encodedText.split("");
					var symbolTableEan = new Array;
					var i = 0;
					var j = 0;
					for(i = 3;i<data.length/2;i++)
					{
						if(leftHandValue[j] == "Odd")
						{
							var value = data[i];
							symbolTableEan.push(symbolTableOdd[value]);
						}
						else
						{
							var value = data[i];
							symbolTableEan.push(symbolTableEven[value]);
						}
						j++;
					}
					if(i == data.length/2)
					{
						if(leftHandValue[j] == "Odd")
						{
							var value = data[i+1];
							symbolTableEan.push(symbolTableOdd[value]);
						}
						else
						{
							var value = data[i+1];
							symbolTableEan.push(symbolTableEven[value]);
						}
					}
						
					var stringRightHandSide = "";
					for(var i = 10;i<data.length-2;i++)
					{
						stringRightHandSide += data[i];
					}
					for(var i = 0;i<stringRightHandSide.length;i++)
					{
						var value = stringRightHandSide[i];
						symbolTableEan.push(symbolTableRight[value]);
					}
					var arrayA = ["A", 0 , [1, 1, 1, 1]];
					symbolTableEan.push(arrayA);
					symbolTableEan.push(symbolTable[symbolTable.length-1]);
					var encodedString = "";
					for(var i = 0;i<data.length;i++)
					{
						if(i != 2){
						encodedString += data[i];
						}
					}
					
					for (var e = 0; e < charArray.length; e++) {
                    for (var h = 0; h < symbolTable.length; h++) {
                        if (symbolTable[h][0] == charArray[e]) {
                            var bars = symbolTable[h][2];
                            for (var i = 0; i < bars.length; i++) {
                                var barWidth = bars[i] * this.Model.narrowBarWidth;
                                totalBars += bars[i];
                                
                            }
                            if (bars.length % 2 != 0)
                              totalBars++;
                        }
                    }
				}
                
                
				var narrowBarWid = (this._getProperValue(this.Model.width) - this.Model.quietZone.right - this.Model.quietZone.left) / (totalBars);
				if (narrowBarWid < 1) {
                    narrowBarWid = 1;
                }
                this.Model.narrowBarWidth = Math.floor(narrowBarWid);
                // return the decimal value of narrobarwidth.
                var decimalValue = (narrowBarWid % 1).toFixed(3);
                var totalBarsWidth = totalBars * decimalValue;
                left = parseInt(this.model.quietZone.left) + Math.round(totalBarsWidth / 2);
          
                this.model.barHeight = this._getProperValue(this.Model.height) - this.Model.quietZone.top - this.Model.quietZone.bottom -(textSize + this.Model.barcodeToTextGapHeight);
                if (this.model.barHeight < 0) this.model.barHeight = 0;
                var intercharacterGap = this.Model.narrowBarWidth;
                this.contextEl.fillStyle = 'white';
                this.contextEl.fillRect(0, 0, wid, hei);
				charArray = encodedString.split("");
				
					var k=0;
					for (var e = 0; e < charArray.length; e++) {
                    for (var h = 0; h < symbolTableEan.length; h++) {
                        if (symbolTableEan[h][0] == charArray[e]) {
							if (symbolTableEan[k][0] == charArray[e] || symbolTableEan[h][0] == "A" || symbolTableEan[h][0] == "B" ) {
								if(symbolTableEan[h][0] == "A" || symbolTableEan[h][0] == "B"){
									var bars = symbolTableEan[h][2];
								}else{
									var bars = symbolTableEan[k][2];
								}
								
								for (var i = 0; i < bars.length; i++) {
                                    var barWidth = bars[i] * this.Model.narrowBarWidth;
                                    if (e > 1 && e <= 7) {
                                       
                                        if (i % 2 != 0) {

                                            this.contextEl.beginPath();
                                            this.contextEl.fillStyle = this.Model.darkBarColor;
                                            this.contextEl.fillRect(left, top, barWidth, this.Model.barHeight)
                                            this.contextEl.closePath();
                                        }
										else {
                                           
                                                this.contextEl.beginPath();
                                                this.contextEl.fillStyle = this.model.lightBarColor;
                                                this.contextEl.fillRect(left, top, barWidth, this.model.barHeight);
                                          
                                        }									
                                    }
                                    else 
                                    {
                                        if(i % 2 == 0)
                                        {
                                            this.contextEl.beginPath();
                                            this.contextEl.fillStyle = this.Model.darkBarColor;
                                            this.contextEl.fillRect(left, top, barWidth, this.Model.barHeight)
                                            this.contextEl.closePath();
                                        }
                                        else {
                                           
                                                this.contextEl.beginPath();
                                                this.contextEl.fillStyle = this.model.lightBarColor;
                                                this.contextEl.fillRect(left, top, barWidth, this.model.barHeight);
                                          
                                        }
                                    }                                  
                                    left += barWidth;
                                    if(e == 1&& i==bars.length-1)
                                    {
                                        left -= barWidth;
                                    }
									
                                }
								if(symbolTableEan[h][0] !="A")
								{
									k++;
								}
                            }
							var x = left;
							if (bars.length % 2 != 0 || this.model.symbologyType=="ean" && e==7)
							{
                                left += intercharacterGap;
								var value = left-x;
								this.contextEl.beginPath();
                                this.contextEl.fillStyle = this.model.lightBarColor;
                                this.contextEl.fillRect(x, top, barWidth, this.model.barHeight);
							}
							}
						}
					}
				}
				
			else
			{				
                for (var e = 0; e < charArray.length; e++) {
                    for (var h = 0; h < symbolTable.length; h++) {
                        if (symbolTable[h][0] == charArray[e]) {
                            var bars = symbolTable[h][2];
                            for (var i = 0; i < bars.length; i++) {
                                var barWidth = bars[i] * this.Model.narrowBarWidth;
                                totalBars += bars[i];
                                
                            }
                            if (bars.length % 2 != 0)
                              totalBars++;
                        }
                    }
                }
                
                var narrowBarWid = (this._getProperValue(this.Model.width) - this.Model.quietZone.right - this.Model.quietZone.left) / (totalBars);
                if (narrowBarWid < 1) {
                    narrowBarWid = 1;
                }
                this.Model.narrowBarWidth = Math.floor(narrowBarWid);
                // return the decimal value of narrobarwidth.
                var decimalValue = (narrowBarWid % 1).toFixed(3);
                var totalBarsWidth = totalBars * decimalValue;
                left = parseInt(this.model.quietZone.left) + Math.round(totalBarsWidth / 2);
          
                this.model.barHeight = this._getProperValue(this.Model.height) - this.Model.quietZone.top - this.Model.quietZone.bottom -(textSize + this.Model.barcodeToTextGapHeight);
                if (this.model.barHeight < 0) this.model.barHeight = 0;
                var intercharacterGap = this.Model.narrowBarWidth;
                this.contextEl.fillStyle = 'white';
                this.contextEl.fillRect(0, 0, wid, hei);

                for (var e = 0; e < charArray.length; e++) {
                    for (var h = 0; h < symbolTable.length; h++) {
                        if (symbolTable[h][0] == charArray[e]) {
                            var bars = symbolTable[h][2];
                            if (this.model.symbologyType == "upcbarcode") {
                                for (var i = 0; i < bars.length; i++) {
                                    var barWidth = bars[i] * this.Model.narrowBarWidth;
                                    if (e > 1 && e <= 7) {
                                       
                                        if (i % 2 != 0) {

                                            this.contextEl.beginPath();
                                            this.contextEl.fillStyle = this.Model.darkBarColor;
                                            this.contextEl.fillRect(left, top, barWidth, this.Model.barHeight)
                                            this.contextEl.closePath();
                                        }
										else {
                                           
                                                this.contextEl.beginPath();
                                                this.contextEl.fillStyle = this.model.lightBarColor;
                                                this.contextEl.fillRect(left, top, barWidth, this.model.barHeight);
                                          
                                        }										
                                    }
                                    else 
                                    {
                                        if(i % 2 == 0)
                                        {
                                            this.contextEl.beginPath();
                                            this.contextEl.fillStyle = this.Model.darkBarColor;
                                            this.contextEl.fillRect(left, top, barWidth, this.Model.barHeight)
                                            this.contextEl.closePath();
                                        }
                                        else {
                                           
                                                this.contextEl.beginPath();
                                                this.contextEl.fillStyle = this.model.lightBarColor;
                                                this.contextEl.fillRect(left, top, barWidth, this.model.barHeight);
                                          
                                        }
                                    }                                  
                                    left += barWidth;
                                    if(e == 1&& i==bars.length-1)
                                    {
                                        left -= barWidth;
                                    }
                                   
                                }
                            }
							else if (this.model.symbologyType == "ean" && encodedText.length == 13 ) {
								
								for (var i = 0; i < bars.length; i++) {
										var barWidth = bars[i] * this.Model.narrowBarWidth;
										if (e > 1 && e <= 5) {
                                       
											if (i % 2 != 0) {

												this.contextEl.beginPath();
												this.contextEl.fillStyle = this.Model.darkBarColor;
												this.contextEl.fillRect(left, top, barWidth, this.Model.barHeight)
												this.contextEl.closePath();
											}
											else {
                                           
                                                this.contextEl.beginPath();
                                                this.contextEl.fillStyle = this.model.lightBarColor;
                                                this.contextEl.fillRect(left, top, barWidth, this.model.barHeight);
                                          
											}										
										}
										else 
										{
											if(i % 2 == 0)
											{
												this.contextEl.beginPath();
												this.contextEl.fillStyle = this.Model.darkBarColor;
												this.contextEl.fillRect(left, top, barWidth, this.Model.barHeight)
												this.contextEl.closePath();
											}
											else {
                                           
                                                this.contextEl.beginPath();
                                                this.contextEl.fillStyle = this.model.lightBarColor;
                                                this.contextEl.fillRect(left, top, barWidth, this.model.barHeight);
                                          
											}
										}                                  
										left += barWidth;
										if(e == 1&& i==bars.length-1)
										{
											left -= barWidth;
										}
                                   
									}
								}
								else {
									for (var i = 0; i < bars.length; i++) {
										var barWidth = bars[i] * this.Model.narrowBarWidth;
										if (i % 2 == 0) {
											this.contextEl.beginPath();
											this.contextEl.fillStyle = this.Model.darkBarColor;
											this.contextEl.fillRect(left, top, barWidth, this.Model.barHeight)
											this.contextEl.closePath();
										}
										else {
											this.contextEl.beginPath();
											this.contextEl.fillStyle = this.model.lightBarColor;
											this.contextEl.fillRect(left, top, barWidth, this.model.barHeight);
											this.contextEl.closePath();
										}
										left += barWidth;                  
									}
								}
								var x = left;
								if (bars.length % 2 != 0 || this.model.symbologyType=="upcbarcode" && e==7 || this.model.symbologyType=="ean" && e==5 )
								{
									left += intercharacterGap;
									var value = left-x;
									this.contextEl.beginPath();
									this.contextEl.fillStyle = this.model.lightBarColor;
									this.contextEl.fillRect(x, top, barWidth, this.model.barHeight);
								}
							}
						}
					}
				}

                

                //this.Model.width = left += (this.Model.quietZone.right);

                /** Draws text for 1D barcodes.*/
                if (this.Model.displayText) {
                    var txtF = (this.textFont.fontStyle.toLowerCase() == "regular") ? "" : +this.textFont.fontStyle.toLowerCase() + " ";
                    txtF += this.textFont.size + " " + this.textFont.fontFamily.toLowerCase() + ",sans-serif";
                    this.contextEl.font = txtF;

                    var textWidth = 0;
                    textWidth = this.contextEl.measureText(this.Model.text).width;
                    if (this.Model.width < textWidth) {
                        //this.Model.width = textWidth;
                        this.canvasEl[0].setAttribute("width", this.Model.width);
                        this.BarcodeEl.css("width", this.Model.width);
                    }

                    this.contextEl.beginPath();
                    this.contextEl.fillStyle = this.Model.textColor;
                    this.contextEl.textAlign = "center";
                    hei = hei - textSize + textSize / 2;
                    if (this.model.symbologyType == "upcbarcode")
                    {
                        var data = encodedText.split("");
                        var txt = '';
                        for (var k = 0; k < data.length; k++)
                        {
                            if (k > 1 && k <= 7 || (k > 8 && k <= 14))
                                txt += data[k];
                        }
                        this.contextEl.fillText(txt, (this.Model.width / 2), hei);
                    }
					else if(this.model.symbologyType == "ean" && encodedText.length == 18 )
					{
						var data = encodedText.split("");
                        var txt = '';
                        for (var k = 0; k < data.length; k++)
                        {
                            if (k > 1 && k <= 8 || (k > 9 && k <= 15))
                                txt += data[k];
                        }
                        this.contextEl.fillText(txt, (this.Model.width / 2), hei);
					}
					else if(this.model.symbologyType == "ean" && encodedText.length == 13)
					{
						var data = encodedText.split("");
                        var txt = '';
                        for (var k = 0; k < data.length; k++)
                        {
                            if (k > 1 && k <= 5 || (k > 6 && k <= 10))
                                txt += data[k];
                        }
                        this.contextEl.fillText(txt, (this.Model.width / 2), hei);
					}
					
                    else
                    this.contextEl.fillText(this.Model.text, (this.Model.width / 2), hei);
                    this.contextEl.closePath();
                    this.contextEl.stroke();
                }
            }
        }
    });

    /**
     * Enum for Symbol type.
	 * @enum {string}
     * @global
     */
    ej.datavisualization.Barcode.SymbologyType = {
        /** Specifies Code 39 Barcode. */
        code39: "code39",
        /** Specifies Code 39 Extended Barcode. */
        code39Extended: "code39extended",
        /** Specifies Code 11 Barcode. */
        code11: "code11",
        /** Specifies Codabar Barcode. */
        codabar: "codabar",
        /** Specifies Code 32 Barcode. */
        code32: "code32",
        /** Specifies Code 93 Barcode. */
        code93: "code93",
        /** Specifies Code 93 Extended Barcode. */
        code93Extended: "code93extended",
        /** Specifies Code 128 A Barcode. */
        code128A: "code128a",
        /** Specifies Code 128 B Barcode. */
        code128B: "code128b",
        /** Specifies Code 128 C Barcode. */
        code128C: "code128c",
        /** Specifies DataMatrix Barcode. */
        dataMatrix: "datamatrix",
        /** Specifies QR Barcode. */
        qrBarcode: "qrbarcode",
        /** Specifies UPC-A Barcode. */
        upca:"upcbarcode",
		/** Specifies EAN-8 And EAN-13 Barcode. */
		ean:"ean",
    };

    /**
     * Enum for Symbol type.
     * @readonly
     * @private
     */
    ej.datavisualization.Barcode.symbologySettings = {
        /** Specifies symbology settinngs for the Code 39 Barcode. */
        code39: {
            startSymbol: '*',
            stopSymbol: '*',
            validatorExp: "^[\x41-\x5A\x30-\x39\-\.\$\/\+\%\ ]+$",
            symbolTable: [["0", 0, [1, 1, 1, 3, 3, 1, 3, 1, 1]], ["1", 1, [3, 1, 1, 3, 1, 1, 1, 1, 3]], ["2", 2, [1, 1, 3, 3, 1, 1, 1, 1, 3]], ["3", 3, [3, 1, 3, 3, 1, 1, 1, 1, 1]], ["4", 4, [1, 1, 1, 3, 3, 1, 1, 1, 3]], ["5", 5, [3, 1, 1, 3, 3, 1, 1, 1, 1]], ["6", 6, [1, 1, 3, 3, 3, 1, 1, 1, 1]], ["7", 7, [1, 1, 1, 3, 1, 1, 3, 1, 3]], ["8", 8, [3, 1, 1, 3, 1, 1, 3, 1, 1]], ["9", 9, [1, 1, 3, 3, 1, 1, 3, 1, 1]], ["A", 10, [3, 1, 1, 1, 1, 3, 1, 1, 3]], ["B", 11, [1, 1, 3, 1, 1, 3, 1, 1, 3]], ["C", 12, [3, 1, 3, 1, 1, 3, 1, 1, 1]], ["D", 13, [1, 1, 1, 1, 3, 3, 1, 1, 3]], ["E", 14, [3, 1, 1, 1, 3, 3, 1, 1, 1]], ["F", 15, [1, 1, 3, 1, 3, 3, 1, 1, 1]], ["G", 16, [1, 1, 1, 1, 1, 3, 3, 1, 3]], ["H", 17, [3, 1, 1, 1, 1, 3, 3, 1, 1]], ["I", 18, [1, 1, 3, 1, 1, 3, 3, 1, 1]], ["J", 19, [1, 1, 1, 1, 3, 3, 3, 1, 1]], ["K", 20, [3, 1, 1, 1, 1, 1, 1, 3, 3]], ["L", 21, [1, 1, 3, 1, 1, 1, 1, 3, 3]], ["M", 22, [3, 1, 3, 1, 1, 1, 1, 3, 1]], ["N", 23, [1, 1, 1, 1, 3, 1, 1, 3, 3]], ["O", 24, [3, 1, 1, 1, 3, 1, 1, 3, 1]], ["P", 25, [1, 1, 3, 1, 3, 1, 1, 3, 1]], ["Q", 26, [1, 1, 1, 1, 1, 1, 3, 3, 3]], ["R", 27, [3, 1, 1, 1, 1, 1, 3, 3, 1]], ["S", 28, [1, 1, 3, 1, 1, 1, 3, 3, 1]], ["T", 29, [1, 1, 1, 1, 3, 1, 3, 3, 1]], ["U", 30, [3, 3, 1, 1, 1, 1, 1, 1, 3]], ["V", 31, [1, 3, 3, 1, 1, 1, 1, 1, 3]], ["W", 32, [3, 3, 3, 1, 1, 1, 1, 1, 1]], ["X", 33, [1, 3, 1, 1, 3, 1, 1, 1, 3]], ["Y", 34, [3, 3, 1, 1, 3, 1, 1, 1, 1]], ["Z", 35, [1, 3, 3, 1, 3, 1, 1, 1, 1]], ["-", 36, [1, 3, 1, 1, 1, 1, 3, 1, 3]], [".", 37, [3, 3, 1, 1, 1, 1, 3, 1, 1]], [" ", 38, [1, 3, 3, 1, 1, 1, 3, 1, 1]], ["$", 39, [1, 3, 1, 3, 1, 3, 1, 1, 1]], ["/", 40, [1, 3, 1, 3, 1, 1, 1, 3, 1]], ["+", 41, [1, 3, 1, 1, 1, 3, 1, 3, 1]], ["%", 42, [1, 1, 1, 3, 1, 3, 1, 3, 1]], ["*", 0, [1, 3, 1, 1, 3, 1, 3, 1, 1]]]
        },
        /** Specifies symbology settings for the Code 39 Extended Barcode. */
        code39extended: {
            startSymbol: '*',
            stopSymbol: '*',
            validatorExp: "^[\x00-\x7F]+$",
            symbolTable: [["0", 0, [1, 1, 1, 3, 3, 1, 3, 1, 1]], ["1", 1, [3, 1, 1, 3, 1, 1, 1, 1, 3]], ["2", 2, [1, 1, 3, 3, 1, 1, 1, 1, 3]], ["3", 3, [3, 1, 3, 3, 1, 1, 1, 1, 1]], ["4", 4, [1, 1, 1, 3, 3, 1, 1, 1, 3]], ["5", 5, [3, 1, 1, 3, 3, 1, 1, 1, 1]], ["6", 6, [1, 1, 3, 3, 3, 1, 1, 1, 1]], ["7", 7, [1, 1, 1, 3, 1, 1, 3, 1, 3]], ["8", 8, [3, 1, 1, 3, 1, 1, 3, 1, 1]], ["9", 9, [1, 1, 3, 3, 1, 1, 3, 1, 1]], ["A", 10, [3, 1, 1, 1, 1, 3, 1, 1, 3]], ["B", 11, [1, 1, 3, 1, 1, 3, 1, 1, 3]], ["C", 12, [3, 1, 3, 1, 1, 3, 1, 1, 1]], ["D", 13, [1, 1, 1, 1, 3, 3, 1, 1, 3]], ["E", 14, [3, 1, 1, 1, 3, 3, 1, 1, 1]], ["F", 15, [1, 1, 3, 1, 3, 3, 1, 1, 1]], ["G", 16, [1, 1, 1, 1, 1, 3, 3, 1, 3]], ["H", 17, [3, 1, 1, 1, 1, 3, 3, 1, 1]], ["I", 18, [1, 1, 3, 1, 1, 3, 3, 1, 1]], ["J", 19, [1, 1, 1, 1, 3, 3, 3, 1, 1]], ["K", 20, [3, 1, 1, 1, 1, 1, 1, 3, 3]], ["L", 21, [1, 1, 3, 1, 1, 1, 1, 3, 3]], ["M", 22, [3, 1, 3, 1, 1, 1, 1, 3, 1]], ["N", 23, [1, 1, 1, 1, 3, 1, 1, 3, 3]], ["O", 24, [3, 1, 1, 1, 3, 1, 1, 3, 1]], ["P", 25, [1, 1, 3, 1, 3, 1, 1, 3, 1]], ["Q", 26, [1, 1, 1, 1, 1, 1, 3, 3, 3]], ["R", 27, [3, 1, 1, 1, 1, 1, 3, 3, 1]], ["S", 28, [1, 1, 3, 1, 1, 1, 3, 3, 1]], ["T", 29, [1, 1, 1, 1, 3, 1, 3, 3, 1]], ["U", 30, [3, 3, 1, 1, 1, 1, 1, 1, 3]], ["V", 31, [1, 3, 3, 1, 1, 1, 1, 1, 3]], ["W", 32, [3, 3, 3, 1, 1, 1, 1, 1, 1]], ["X", 33, [1, 3, 1, 1, 3, 1, 1, 1, 3]], ["Y", 34, [3, 3, 1, 1, 3, 1, 1, 1, 1]], ["Z", 35, [1, 3, 3, 1, 3, 1, 1, 1, 1]], ["-", 36, [1, 3, 1, 1, 1, 1, 3, 1, 3]], [".", 37, [3, 3, 1, 1, 1, 1, 3, 1, 1]], [" ", 38, [1, 3, 3, 1, 1, 1, 3, 1, 1]], ["$", 39, [1, 3, 1, 3, 1, 3, 1, 1, 1]], ["/", 40, [1, 3, 1, 3, 1, 1, 1, 3, 1]], ["+", 41, [1, 3, 1, 1, 1, 3, 1, 3, 1]], ["%", 42, [1, 1, 1, 3, 1, 3, 1, 3, 1]], ["*", 0, [1, 3, 1, 1, 3, 1, 3, 1, 1]]],
            extendedCodes: [['\0', ['%', 'U']], [String.fromCharCode(parseInt('0001', 16)), ['$', 'A']], [String.fromCharCode(parseInt('0002', 16)), ['$', 'B']], [String.fromCharCode(parseInt('0003', 16)), ['$', 'C']], [String.fromCharCode(parseInt('0004', 16)), ['$', 'D']], [String.fromCharCode(parseInt('0005', 16)), ['$', 'E']], [String.fromCharCode(parseInt('0006', 16)), ['$', 'F']], ['\a', ['$', 'G']], ['\b', ['$', 'H']], ['\t', ['$', 'I']], ['\n', ['$', 'J']], ['\v', ['$', 'K']], ['\f', ['$', 'L']], ['\r', ['$', 'M']], [String.fromCharCode(parseInt('000e', 16)), ['$', 'N']], [String.fromCharCode(parseInt('000f', 16)), ['$', 'O']], [String.fromCharCode(parseInt('0010', 16)), ['$', 'P']], [String.fromCharCode(parseInt('0011', 16)), ['$', 'Q']], [String.fromCharCode(parseInt('0012', 16)), ['$', 'R']], [String.fromCharCode(parseInt('0013', 16)), ['$', 'S']], [String.fromCharCode(parseInt('0014', 16)), ['$', 'T']], [String.fromCharCode(parseInt('0015', 16)), ['$', 'U']], [String.fromCharCode(parseInt('0016', 16)), ['$', 'V']], [String.fromCharCode(parseInt('0017', 16)), ['$', 'W']], [String.fromCharCode(parseInt('0018', 16)), ['$', 'X']], [String.fromCharCode(parseInt('0019', 16)), ['$', 'Y']], [String.fromCharCode(parseInt('001a', 16)), ['$', 'Z']], [String.fromCharCode(parseInt('001b', 16)), ['%', 'A']], [String.fromCharCode(parseInt('001c', 16)), ['%', 'B']], [String.fromCharCode(parseInt('001d', 16)), ['%', 'C']], [String.fromCharCode(parseInt('001e', 16)), ['%', 'D']], [String.fromCharCode(parseInt('001f', 16)), ['%', 'E']], [' ', [' ']], ['!', ['/', 'A']], ['"', ['/', 'B']], ['#', ['/', 'C']], ['$', ['/', 'D']], ['%', ['/', 'E']], ['&', ['/', 'F']], ['\'', ['/', 'G']], ['(', ['/', 'H']], [')', ['/', 'I']], ['*', ['/', 'J']], ['+', ['/', 'K']], [',', ['/', 'L']], ['-', ['/', 'M']], ['.', ['/', 'N']], ['/', ['/', 'O']], ['0', ['0']], ['1', ['1']], ['2', ['2']], ['3', ['3']], ['4', ['4']], ['5', ['5']], ['6', ['6']], ['7', ['7']], ['8', ['8']], ['9', ['9']], [':', ['/', 'Z']], [';', ['%', 'F']], ['<', ['%', 'G']], ['=', ['%', 'H']], ['>', ['%', 'I']], ['?', ['%', 'J']], ['@', ['%', 'V']], ['A', ['A']], ['B', ['B']], ['C', ['C']], ['D', ['D']], ['E', ['E']], ['F', ['F']], ['G', ['G']], ['H', ['H']], ['I', ['I']], ['J', ['J']], ['K', ['K']], ['L', ['L']], ['M', ['M']], ['N', ['N']], ['O', ['O']], ['P', ['P']], ['Q', ['Q']], ['R', ['R']], ['S', ['S']], ['T', ['T']], ['U', ['U']], ['V', ['V']], ['W', ['W']], ['X', ['X']], ['Y', ['Y']], ['Z', ['Z']], ['[', ['%', 'K']], ['\\', ['%', 'L']], [']', ['%', 'M']], ['^', ['%', 'N']], ['_', ['%', 'O']], ['`', ['%', 'W']], ['a', ['+', 'A']], ['b', ['+', 'B']], ['c', ['+', 'C']], ['d', ['+', 'D']], ['e', ['+', 'E']], ['f', ['+', 'F']], ['g', ['+', 'G']], ['h', ['+', 'H']], ['i', ['+', 'I']], ['j', ['+', 'J']], ['k', ['+', 'K']], ['l', ['+', 'L']], ['m', ['+', 'M']], ['n', ['+', 'N']], ['o', ['+', 'O']], ['p', ['+', 'P']], ['q', ['+', 'Q']], ['r', ['+', 'R']], ['s', ['+', 'S']], ['t', ['+', 'T']], ['u', ['+', 'U']], ['v', ['+', 'V']], ['w', ['+', 'W']], ['x', ['+', 'X']], ['y', ['+', 'Y']], ['z', ['+', 'Z']], ['{', ['%', 'P']], ['|', ['%', 'Q']], ['}', ['%', 'R']], ['~', ['%', 'S']], [String.fromCharCode(parseInt('007f', 16)), ['%', 'T']]]
        },
        /** Specifies symbology settings for the Code 11 Barcode. */
        code11: {
            startSymbol: '*',
            stopSymbol: '*',
            validatorExp: "^[0-9\-]*$",
            symbolTable: [["0", 0, [1, 1, 1, 1, 2]], ["1", 1, [2, 1, 1, 1, 2]], ["2", 2, [1, 2, 1, 1, 2]], ["3", 3, [2, 2, 1, 1, 1]], ["4", 4, [1, 1, 2, 1, 2]], ["5", 5, [2, 1, 2, 1, 1]], ["6", 6, [1, 2, 2, 1, 1]], ["7", 7, [1, 1, 1, 2, 2]], ["8", 8, [2, 1, 1, 2, 1]], ["9", 9, [2, 1, 1, 1, 1]], ["-", 10, [1, 1, 2, 1, 1]], ["*", 0, [1, 1, 2, 2, 1]]]
        },
        /** Specifies symbology settings for the Codabar Barcode. */
        codabar: {
            startSymbol: 'A',
            stopSymbol: 'B',
            validatorExp: "^[0-9\-\.\$\/\:\+]*$",
            symbolTable: [["0", 0, [1, 1, 1, 1, 1, 2, 2]], ["1", 0, [1, 1, 1, 1, 2, 2, 1]], ["2", 0, [1, 1, 1, 2, 1, 1, 2]], ["3", 0, [2, 2, 1, 1, 1, 1, 1]], ["4", 0, [1, 1, 2, 1, 1, 2, 1]], ["5", 0, [2, 1, 1, 1, 1, 2, 1]], ["6", 0, [1, 2, 1, 1, 1, 1, 2]], ["7", 0, [1, 2, 1, 1, 2, 1, 1]], ["8", 0, [1, 2, 2, 1, 1, 1, 1]], ["9", 0, [2, 1, 1, 2, 1, 1, 1]], ["-", 0, [1, 1, 1, 2, 2, 1, 1]], ["$", 0, [1, 1, 2, 2, 1, 1, 1]], [":", 0, [2, 1, 1, 1, 2, 1, 2]], ["/", 0, [2, 1, 2, 1, 1, 1, 2]], [".", 0, [2, 1, 2, 1, 2, 1, 1]], ["+", 0, [1, 1, 2, 1, 2, 1, 2]], ["A", 0, [1, 1, 2, 2, 1, 2, 1]], ["B", 0, [1, 1, 1, 2, 1, 2, 2]]]
        },
        /** Specifies symbology settings for the Code 32 Barcode. */
        code32: {
            startSymbol: '*',
            stopSymbol: '*',
            validatorExp: "^[\x41-\x5A\x30-\x39\x20\-\*\.\$\/\+\%]+$",
            symbolTable: [["0", 0, [1, 1, 1, 3, 3, 1, 3, 1, 1]], ["1", 1, [3, 1, 1, 3, 1, 1, 1, 1, 3]], ["2", 2, [1, 1, 3, 3, 1, 1, 1, 1, 3]], ["3", 3, [3, 1, 3, 3, 1, 1, 1, 1, 1]], ["4", 4, [1, 1, 1, 3, 3, 1, 1, 1, 3]], ["5", 5, [3, 1, 1, 3, 3, 1, 1, 1, 1]], ["6", 6, [1, 1, 3, 3, 3, 1, 1, 1, 1]], ["7", 7, [1, 1, 1, 3, 1, 1, 3, 1, 3]], ["8", 8, [3, 1, 1, 3, 1, 1, 3, 1, 1]], ["9", 9, [1, 1, 3, 3, 1, 1, 3, 1, 1]], ["B", 10, [1, 1, 3, 1, 1, 3, 1, 1, 3]], ["C", 11, [3, 1, 3, 1, 1, 3, 1, 1, 1]], ["D", 12, [1, 1, 1, 1, 3, 3, 1, 1, 3]], ["F", 13, [1, 1, 3, 1, 3, 3, 1, 1, 1]], ["G", 14, [1, 1, 1, 1, 1, 3, 3, 1, 3]], ["H", 15, [3, 1, 1, 1, 1, 3, 3, 1, 1]], ["J", 0x10, [1, 1, 1, 1, 3, 3, 3, 1, 1]], ["K", 0x11, [3, 1, 1, 1, 1, 1, 1, 3, 3]], ["L", 0x12, [1, 1, 3, 1, 1, 1, 1, 3, 3]], ["M", 0x13, [3, 1, 3, 1, 1, 1, 1, 3, 1]], ["N", 20, [1, 1, 1, 1, 3, 1, 1, 3, 3]], ["P", 0x15, [1, 1, 3, 1, 3, 1, 1, 3, 1]], ["Q", 0x16, [1, 1, 1, 1, 1, 1, 3, 3, 3]], ["R", 0x17, [3, 1, 1, 1, 1, 1, 3, 3, 1]], ["S", 0x18, [1, 1, 3, 1, 1, 1, 3, 3, 1]], ["T", 0x19, [1, 1, 1, 1, 3, 1, 3, 3, 1]], ["U", 0x1a, [3, 3, 1, 1, 1, 1, 1, 1, 3]], ["V", 0x1b, [1, 3, 3, 1, 1, 1, 1, 1, 3]], ["W", 0x1c, [3, 3, 3, 1, 1, 1, 1, 1, 1]], ["X", 0x1d, [1, 3, 1, 1, 3, 1, 1, 1, 3]], ["Y", 30, [3, 3, 1, 1, 3, 1, 1, 1, 1]], ["Z", 0x1f, [1, 3, 3, 1, 3, 1, 1, 1, 1]], ["*", 0, [1, 3, 1, 1, 3, 1, 3, 1, 1]]]
        },
        /** Specifies symbology settings for the Code 93 Barcode. */
        code93: {
            startSymbol: '*',
            stopSymbol: String.fromCharCode(parseInt('00ff', 16)),
            validatorExp: "^[\x41-\x5A\x30-\x39\-\.\$\/\+\%\ ]+$",
            symbolTable: [["0", 0, [1, 3, 1, 1, 1, 2]], ["1", 1, [1, 1, 1, 2, 1, 3]], ["2", 2, [1, 1, 1, 3, 1, 2]], ["3", 3, [1, 1, 1, 4, 1, 1]], ["4", 4, [1, 2, 1, 1, 1, 2]], ["5", 5, [1, 2, 1, 2, 1, 2]], ["6", 6, [1, 2, 1, 3, 1, 1]], ["7", 7, [1, 1, 1, 1, 1, 4]], ["8", 8, [1, 3, 1, 2, 1, 1]], ["9", 9, [1, 4, 1, 1, 1, 1]], ["A", 10, [2, 1, 1, 1, 1, 3]], ["B", 11, [2, 1, 1, 2, 1, 2]], ["C", 12, [2, 1, 1, 3, 1, 1]], ["D", 13, [2, 2, 1, 1, 1, 2]], ["E", 14, [2, 2, 1, 2, 1, 1]], ["F", 15, [2, 3, 1, 1, 1, 1]], ["G", 0x10, [1, 1, 2, 1, 1, 3]], ["H", 0x11, [1, 1, 2, 2, 1, 2]], ["I", 0x12, [1, 1, 2, 3, 1, 1]], ["J", 0x13, [1, 2, 2, 1, 1, 2]], ["K", 20, [1, 3, 2, 1, 1, 1]], ["L", 0x15, [1, 1, 1, 1, 2, 3]], ["M", 0x16, [1, 1, 1, 2, 2, 2]], ["N", 0x17, [1, 1, 1, 3, 2, 1]], ["O", 0x18, [1, 2, 1, 1, 2, 2]], ["P", 0x19, [1, 3, 1, 1, 2, 1]], ["Q", 0x1a, [2, 1, 2, 1, 1, 2]], ["R", 0x1b, [2, 1, 2, 2, 1, 1]], ["S", 0x1c, [2, 1, 1, 1, 2, 2]], ["T", 0x1d, [2, 1, 1, 2, 2, 1]], ["U", 30, [2, 2, 1, 1, 2, 1]], ["V", 0x1f, [2, 2, 2, 1, 1, 1]], ["W", 0x20, [1, 1, 2, 1, 2, 2]], ["X", 0x21, [1, 1, 2, 2, 2, 1]], ["Y", 0x22, [1, 2, 2, 1, 2, 1]], ["Z", 0x23, [1, 2, 3, 1, 1, 1]], ["-", 0x24, [1, 2, 1, 1, 3, 1]], [".", 0x25, [3, 1, 1, 1, 1, 2]], [" ", 0x26, [3, 1, 1, 2, 1, 1]], ["$", 0x27, [3, 2, 1, 1, 1, 1]], ["/", 40, [1, 1, 2, 1, 3, 1]], ["+", 0x29, [1, 1, 3, 1, 2, 1]], ["%", 0x2a, [2, 1, 1, 1, 3, 1]], ["*", 0, [1, 1, 1, 1, 4, 1]], [String.fromCharCode(parseInt('00ff', 16)), 0, [1, 1, 1, 1, 4, 1, 1]], [String.fromCharCode(parseInt('00fb', 16)), 0x2b, [1, 2, 1, 2, 2, 0]], [String.fromCharCode(parseInt('00fc', 16)), 0x2c, [3, 1, 2, 1, 1, 1]], [String.fromCharCode(parseInt('00fd', 16)), 0x2d, [3, 1, 1, 1, 2, 1]], [String.fromCharCode(parseInt('00fe', 16)), 0x2e, [1, 2, 2, 2, 1, 1]]]
        },
        /** Specifies symbology settings for the Code 93 Extended Barcode. */
        code93extended: {
            startSymbol: '*',
            stopSymbol: String.fromCharCode(parseInt('00ff', 16)),
            validatorExp: "^[\x00-\x7F\x00fb\x00fd\x00fe\'þ'\'ü'\'ý']+$",
            symbolTable: [["0", 0, [1, 3, 1, 1, 1, 2]], ["1", 1, [1, 1, 1, 2, 1, 3]], ["2", 2, [1, 1, 1, 3, 1, 2]], ["3", 3, [1, 1, 1, 4, 1, 1]], ["4", 4, [1, 2, 1, 1, 1, 2]], ["5", 5, [1, 2, 1, 2, 1, 2]], ["6", 6, [1, 2, 1, 3, 1, 1]], ["7", 7, [1, 1, 1, 1, 1, 4]], ["8", 8, [1, 3, 1, 2, 1, 1]], ["9", 9, [1, 4, 1, 1, 1, 1]], ["A", 10, [2, 1, 1, 1, 1, 3]], ["B", 11, [2, 1, 1, 2, 1, 2]], ["C", 12, [2, 1, 1, 3, 1, 1]], ["D", 13, [2, 2, 1, 1, 1, 2]], ["E", 14, [2, 2, 1, 2, 1, 1]], ["F", 15, [2, 3, 1, 1, 1, 1]], ["G", 0x10, [1, 1, 2, 1, 1, 3]], ["H", 0x11, [1, 1, 2, 2, 1, 2]], ["I", 0x12, [1, 1, 2, 3, 1, 1]], ["J", 0x13, [1, 2, 2, 1, 1, 2]], ["K", 20, [1, 3, 2, 1, 1, 1]], ["L", 0x15, [1, 1, 1, 1, 2, 3]], ["M", 0x16, [1, 1, 1, 2, 2, 2]], ["N", 0x17, [1, 1, 1, 3, 2, 1]], ["O", 0x18, [1, 2, 1, 1, 2, 2]], ["P", 0x19, [1, 3, 1, 1, 2, 1]], ["Q", 0x1a, [2, 1, 2, 1, 1, 2]], ["R", 0x1b, [2, 1, 2, 2, 1, 1]], ["S", 0x1c, [2, 1, 1, 1, 2, 2]], ["T", 0x1d, [2, 1, 1, 2, 2, 1]], ["U", 30, [2, 2, 1, 1, 2, 1]], ["V", 0x1f, [2, 2, 2, 1, 1, 1]], ["W", 0x20, [1, 1, 2, 1, 2, 2]], ["X", 0x21, [1, 1, 2, 2, 2, 1]], ["Y", 0x22, [1, 2, 2, 1, 2, 1]], ["Z", 0x23, [1, 2, 3, 1, 1, 1]], ["-", 0x24, [1, 2, 1, 1, 3, 1]], [".", 0x25, [3, 1, 1, 1, 1, 2]], [" ", 0x26, [3, 1, 1, 2, 1, 1]], ["$", 0x27, [3, 2, 1, 1, 1, 1]], ["/", 40, [1, 1, 2, 1, 3, 1]], ["+", 0x29, [1, 1, 3, 1, 2, 1]], ["%", 0x2a, [2, 1, 1, 1, 3, 1]], ["*", 0, [1, 1, 1, 1, 4, 1]], [String.fromCharCode(parseInt('00ff', 16)), 0, [1, 1, 1, 1, 4, 1, 1]], [String.fromCharCode(parseInt('00fb', 16)), 0x2b, [1, 2, 1, 2, 2, 0]], [String.fromCharCode(parseInt('00fc', 16)), 0x2c, [3, 1, 2, 1, 1, 1]], [String.fromCharCode(parseInt('00fd', 16)), 0x2d, [3, 1, 1, 1, 2, 1]], [String.fromCharCode(parseInt('00fe', 16)), 0x2e, [1, 2, 2, 2, 1, 1]]],
            extendedCodes: [['\0', [String.fromCharCode(parseInt('00fc', 16)), 'U']], [String.fromCharCode(parseInt('0001', 16)), [String.fromCharCode(parseInt('00fb', 16)), 'A']], [String.fromCharCode(parseInt('0002', 16)), [String.fromCharCode(parseInt('00fb', 16)), 'B']], [String.fromCharCode(parseInt('0003', 16)), [String.fromCharCode(parseInt('00fb', 16)), 'C']], [String.fromCharCode(parseInt('0004', 16)), [String.fromCharCode(parseInt('00fb', 16)), 'D']], [String.fromCharCode(parseInt('0005', 16)), [String.fromCharCode(parseInt('00fb', 16)), 'E']], [String.fromCharCode(parseInt('0006', 16)), [String.fromCharCode(parseInt('00fb', 16)), 'F']], ['\a', [String.fromCharCode(parseInt('00fb', 16)), 'G']], ['\b', [String.fromCharCode(parseInt('00fb', 16)), 'H']], ['\t', [String.fromCharCode(parseInt('00fb', 16)), 'I']], ['\n', [String.fromCharCode(parseInt('00fb', 16)), 'J']], ['\v', [String.fromCharCode(parseInt('00fb', 16)), 'K']], ['\f', [String.fromCharCode(parseInt('00fb', 16)), 'L']], ['\r', [String.fromCharCode(parseInt('00fb', 16)), 'M']], [String.fromCharCode(parseInt('000e', 16)), [String.fromCharCode(parseInt('00fb', 16)), 'N']], [String.fromCharCode(parseInt('000f', 16)), [String.fromCharCode(parseInt('00fb', 16)), 'O']], [String.fromCharCode(parseInt('0010', 16)), [String.fromCharCode(parseInt('00fb', 16)), 'P']], [String.fromCharCode(parseInt('0011', 16)), [String.fromCharCode(parseInt('00fb', 16)), 'Q']], [String.fromCharCode(parseInt('0012', 16)), [String.fromCharCode(parseInt('00fb', 16)), 'R']], [String.fromCharCode(parseInt('0013', 16)), [String.fromCharCode(parseInt('00fb', 16)), 'S']], [String.fromCharCode(parseInt('0014', 16)), [String.fromCharCode(parseInt('00fb', 16)), 'T']], [String.fromCharCode(parseInt('0015', 16)), [String.fromCharCode(parseInt('00fb', 16)), 'U']], [String.fromCharCode(parseInt('0016', 16)), [String.fromCharCode(parseInt('00fb', 16)), 'V']], [String.fromCharCode(parseInt('0017', 16)), [String.fromCharCode(parseInt('00fb', 16)), 'W']], [String.fromCharCode(parseInt('0018', 16)), [String.fromCharCode(parseInt('00fb', 16)), 'X']], [String.fromCharCode(parseInt('0019', 16)), [String.fromCharCode(parseInt('00fb', 16)), 'Y']], [String.fromCharCode(parseInt('001a', 16)), [String.fromCharCode(parseInt('00fb', 16)), 'Z']], [String.fromCharCode(parseInt('001b', 16)), [String.fromCharCode(parseInt('00fc', 16)), 'A']], [String.fromCharCode(parseInt('001c', 16)), [String.fromCharCode(parseInt('00fc', 16)), 'B']], [String.fromCharCode(parseInt('001d', 16)), [String.fromCharCode(parseInt('00fc', 16)), 'C']], [String.fromCharCode(parseInt('001e', 16)), [String.fromCharCode(parseInt('00fc', 16)), 'D']], [String.fromCharCode(parseInt('001f', 16)), [String.fromCharCode(parseInt('00fc', 16)), 'E']], [' ', [' ']], ['!', [String.fromCharCode(parseInt('00fd', 16)), 'A']], ['"', [String.fromCharCode(parseInt('00fd', 16)), 'B']], ['#', [String.fromCharCode(parseInt('00fd', 16)), 'C']], ['$', [String.fromCharCode(parseInt('00fd', 16)), 'D']], ['%', [String.fromCharCode(parseInt('00fd', 16)), 'E']], ['&', [String.fromCharCode(parseInt('00fd', 16)), 'F']], ['\'', [String.fromCharCode(parseInt('00fd', 16)), 'G']], ['(', [String.fromCharCode(parseInt('00fd', 16)), 'H']], [')', [String.fromCharCode(parseInt('00fd', 16)), 'I']], ['*', [String.fromCharCode(parseInt('00fd', 16)), 'J']], ['+', [String.fromCharCode(parseInt('00fd', 16)), 'K']], [',', [String.fromCharCode(parseInt('00fd', 16)), 'L']], ['-', [String.fromCharCode(parseInt('00fd', 16)), 'M']], ['.', [String.fromCharCode(parseInt('00fd', 16)), 'N']], ['/', [String.fromCharCode(parseInt('00fd', 16)), 'O']], ['0', ['0']], ['1', ['1']], ['2', ['2']], ['3', ['3']], ['4', ['4']], ['5', ['5']], ['6', ['6']], ['7', ['7']], ['8', ['8']], ['9', ['9']], [':', [String.fromCharCode(parseInt('00fd', 16)), 'Z']], [';', [String.fromCharCode(parseInt('00fc', 16)), 'F']], ['<', [String.fromCharCode(parseInt('00fc', 16)), 'G']], ['=', [String.fromCharCode(parseInt('00fc', 16)), 'H']], ['>', [String.fromCharCode(parseInt('00fc', 16)), 'I']], ['?', [String.fromCharCode(parseInt('00fc', 16)), 'J']], ['@', [String.fromCharCode(parseInt('00fc', 16)), 'V']], ['A', ['A']], ['B', ['B']], ['C', ['C']], ['D', ['D']], ['E', ['E']], ['F', ['F']], ['G', ['G']], ['H', ['H']], ['I', ['I']], ['J', ['J']], ['K', ['K']], ['L', ['L']], ['M', ['M']], ['N', ['N']], ['O', ['O']], ['P', ['P']], ['Q', ['Q']], ['R', ['R']], ['S', ['S']], ['T', ['T']], ['U', ['U']], ['V', ['V']], ['W', ['W']], ['X', ['X']], ['Y', ['Y']], ['Z', ['Z']], ['[', [String.fromCharCode(parseInt('00fc', 16)), 'K']], ['\\', [String.fromCharCode(parseInt('00fc', 16)), 'L']], [']', [String.fromCharCode(parseInt('00fc', 16)), 'M']], ['^', [String.fromCharCode(parseInt('00fc', 16)), 'N']], ['_', [String.fromCharCode(parseInt('00fc', 16)), 'O']], ['`', [String.fromCharCode(parseInt('00fc', 16)), 'W']], ['a', [String.fromCharCode(parseInt('00fe', 16)), 'A']], ['b', [String.fromCharCode(parseInt('00fe', 16)), 'B']], ['c', [String.fromCharCode(parseInt('00fe', 16)), 'C']], ['d', [String.fromCharCode(parseInt('00fe', 16)), 'D']], ['e', [String.fromCharCode(parseInt('00fe', 16)), 'E']], ['f', [String.fromCharCode(parseInt('00fe', 16)), 'F']], ['g', [String.fromCharCode(parseInt('00fe', 16)), 'G']], ['h', [String.fromCharCode(parseInt('00fe', 16)), 'H']], ['i', [String.fromCharCode(parseInt('00fe', 16)), 'I']], ['j', [String.fromCharCode(parseInt('00fe', 16)), 'J']], ['k', [String.fromCharCode(parseInt('00fe', 16)), 'K']], ['l', [String.fromCharCode(parseInt('00fe', 16)), 'L']], ['m', [String.fromCharCode(parseInt('00fe', 16)), 'M']], ['n', [String.fromCharCode(parseInt('00fe', 16)), 'N']], ['o', [String.fromCharCode(parseInt('00fe', 16)), 'O']], ['p', [String.fromCharCode(parseInt('00fe', 16)), 'P']], ['q', [String.fromCharCode(parseInt('00fe', 16)), 'Q']], ['r', [String.fromCharCode(parseInt('00fe', 16)), 'R']], ['s', [String.fromCharCode(parseInt('00fe', 16)), 'S']], ['t', [String.fromCharCode(parseInt('00fe', 16)), 'T']], ['u', [String.fromCharCode(parseInt('00fe', 16)), 'U']], ['v', [String.fromCharCode(parseInt('00fe', 16)), 'V']], ['w', [String.fromCharCode(parseInt('00fe', 16)), 'W']], ['x', [String.fromCharCode(parseInt('00fe', 16)), 'X']], ['y', [String.fromCharCode(parseInt('00fe', 16)), 'Y']], ['z', [String.fromCharCode(parseInt('00fe', 16)), 'Z']], ['{', [String.fromCharCode(parseInt('00fc', 16)), 'P']], ['|', [String.fromCharCode(parseInt('00fc', 16)), 'Q']], ['}', [String.fromCharCode(parseInt('00fc', 16)), 'R']], ['~', [String.fromCharCode(parseInt('00fc', 16)), 'S']], [String.fromCharCode(parseInt('007f', 16)), [String.fromCharCode(parseInt('00fc', 16)), 'T']]],
        },
        /** Specifies symbology settings for the Code 128 A Barcode. */
        code128a: {
            startSymbol: String.fromCharCode(parseInt('00f9', 16)),
            stopSymbol: String.fromCharCode(parseInt('00ff', 16)),
            validatorExp: "[\0\x0001\x0002\x0003\x0004\x0005\x0006\a\b\t\n\v\f\r\x000e\x000f\x0010\x0011\x0012\x0013\x0014\x0015\x0016\x0017\x0018\x0019\x001a\x001b\x001c\x001d\x001e\x001f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\x00f0\x00f1\x00f2\x00f3\x00f4]",
            symbolTable: [["\0", 0x40, [1, 1, 1, 4, 2, 2]], [String.fromCharCode(parseInt('0001', 16)), 0x41, [1, 2, 1, 1, 2, 4]], [String.fromCharCode(parseInt('0002', 16)), 0x42, [1, 2, 1, 4, 2, 1]], [String.fromCharCode(parseInt('0003', 16)), 0x43, [1, 4, 1, 1, 2, 2]], [String.fromCharCode(parseInt('0004', 16)), 0x44, [1, 4, 1, 2, 2, 1]], [String.fromCharCode(parseInt('0005', 16)), 0x45, [1, 1, 2, 2, 1, 4]], [String.fromCharCode(parseInt('0006', 16)), 70, [1, 1, 2, 4, 1, 2]], ["\a", 0x47, [1, 2, 2, 1, 1, 4]], ["\b", 0x48, [1, 2, 2, 4, 1, 1]], ["\t", 0x49, [1, 4, 2, 1, 1, 2]], ["\n", 0x4a, [1, 4, 2, 2, 1, 1]], ["\v", 0x4b, [2, 4, 1, 2, 1, 1]], ["\f", 0x4c, [2, 2, 1, 1, 1, 4]], ["\r", 0x4d, [4, 1, 3, 1, 1, 1]], [String.fromCharCode(parseInt('000e', 16)), 0x4e, [2, 4, 1, 1, 1, 2]], [String.fromCharCode(parseInt('000f', 16)), 0x4f, [1, 3, 4, 1, 1, 1]], [String.fromCharCode(parseInt('0010', 16)), 80, [1, 1, 1, 2, 4, 2]], [String.fromCharCode(parseInt('0011', 16)), 0x51, [1, 2, 1, 1, 4, 2]], [String.fromCharCode(parseInt('0012', 16)), 0x52, [1, 2, 1, 2, 4, 1]], [String.fromCharCode(parseInt('0013', 16)), 0x53, [1, 1, 4, 2, 1, 2]], [String.fromCharCode(parseInt('0014', 16)), 0x54, [1, 2, 4, 1, 1, 2]], [String.fromCharCode(parseInt('0015', 16)), 0x55, [1, 2, 4, 2, 1, 1]], [String.fromCharCode(parseInt('0016', 16)), 0x56, [4, 1, 1, 2, 1, 2]], [String.fromCharCode(parseInt('0017', 16)), 0x57, [4, 2, 1, 1, 1, 2]], [String.fromCharCode(parseInt('0018', 16)), 0x58, [4, 2, 1, 2, 1, 1]], [String.fromCharCode(parseInt('0019', 16)), 0x59, [2, 1, 2, 1, 4, 1]], [String.fromCharCode(parseInt('001a', 16)), 90, [2, 1, 4, 1, 2, 1]], [String.fromCharCode(parseInt('001b', 16)), 0x5b, [4, 1, 2, 1, 2, 1]], [String.fromCharCode(parseInt('001c', 16)), 0x5c, [1, 1, 1, 1, 4, 3]], [String.fromCharCode(parseInt('001d', 16)), 0x5d, [1, 1, 1, 3, 4, 1]], [String.fromCharCode(parseInt('001e', 16)), 0x5e, [1, 3, 1, 1, 4, 1]], [String.fromCharCode(parseInt('001f', 16)), 0x5f, [1, 1, 4, 1, 1, 3]], [" ", 0, [2, 1, 2, 2, 2, 2]], ["!", 1, [2, 2, 2, 1, 2, 2]], ["\"", 2, [2, 2, 2, 2, 2, 1]], ["#", 3, [1, 2, 1, 2, 2, 3]], ["$", 4, [1, 2, 1, 3, 2, 2]], ["%", 5, [1, 3, 1, 2, 2, 2]], ["&", 6, [1, 2, 2, 2, 1, 3]], ["\'", 7, [1, 2, 2, 3, 1, 2]], ["(", 8, [1, 3, 2, 2, 1, 2]], [")", 9, [2, 2, 1, 2, 1, 3]], ["*", 10, [2, 2, 1, 3, 1, 2]], ["+", 11, [2, 3, 1, 2, 1, 2]], [",", 12, [1, 1, 2, 2, 3, 2]], ["-", 13, [1, 2, 2, 1, 3, 2]], [".", 14, [1, 2, 2, 2, 3, 1]], ["/", 15, [1, 1, 3, 2, 2, 2]], ["0", 0x10, [1, 2, 3, 1, 2, 2]], ["1", 0x11, [1, 2, 3, 2, 2, 1]], ["2", 0x12, [2, 2, 3, 2, 1, 1]], ["3", 0x13, [2, 2, 1, 1, 3, 2]], ["4", 20, [2, 2, 1, 2, 3, 1]], ["5", 0x15, [2, 1, 3, 2, 1, 2]], ["6", 0x16, [2, 2, 3, 1, 1, 2]], ["7", 0x17, [3, 1, 2, 1, 3, 1]], ["8", 0x18, [3, 1, 1, 2, 2, 2]], ["9", 0x19, [3, 2, 1, 1, 2, 2]], [":", 0x1a, [3, 2, 1, 2, 2, 1]], [";", 0x1b, [3, 1, 2, 2, 1, 2]], ["<", 0x1c, [3, 2, 2, 1, 1, 2]], ["=", 0x1d, [3, 2, 2, 2, 1, 1]], [">", 30, [2, 1, 2, 1, 2, 3]], ["?", 0x1f, [2, 1, 2, 3, 2, 1]], ["@", 0x20, [2, 3, 2, 1, 2, 1]], ["A", 0x21, [1, 1, 1, 3, 2, 3]], ["B", 0x22, [1, 3, 1, 1, 2, 3]], ["C", 0x23, [1, 3, 1, 3, 2, 1]], ["D", 0x24, [1, 1, 2, 3, 1, 3]], ["E", 0x25, [1, 3, 2, 1, 1, 3]], ["F", 0x26, [1, 3, 2, 3, 1, 1]], ["G", 0x27, [2, 1, 1, 3, 1, 3]], ["H", 40, [2, 3, 1, 1, 1, 3]], ["I", 0x29, [2, 3, 1, 3, 1, 1]], ["J", 0x2a, [1, 1, 2, 1, 3, 3]], ["K", 0x2b, [1, 1, 2, 3, 3, 1]], ["L", 0x2c, [1, 3, 2, 1, 3, 1]], ["M", 0x2d, [1, 1, 3, 1, 2, 3]], ["N", 0x2e, [1, 1, 3, 3, 2, 1]], ["O", 0x2f, [1, 3, 3, 1, 2, 1]], ["P", 0x30, [3, 1, 3, 1, 2, 1]], ["Q", 0x31, [2, 1, 1, 3, 3, 1]], ["R", 50, [2, 3, 1, 1, 3, 1]], ["S", 0x33, [2, 1, 3, 1, 1, 3]], ["T", 0x34, [2, 1, 3, 3, 1, 1]], ["U", 0x35, [2, 1, 3, 1, 3, 1]], ["V", 0x36, [3, 1, 1, 1, 2, 3]], ["W", 0x37, [3, 1, 1, 3, 2, 1]], ["X", 0x38, [3, 3, 1, 1, 2, 1]], ["Y", 0x39, [3, 1, 2, 1, 1, 3]], ["Z", 0x3a, [3, 1, 2, 3, 1, 1]], ["[", 0x3b, [3, 3, 2, 1, 1, 1]], ["\\", 60, [3, 1, 4, 1, 1, 1]], ["]", 0x3d, [2, 2, 1, 4, 1, 1]], ["^", 0x3e, [4, 3, 1, 1, 1, 1]], ["_", 0x3f, [1, 1, 1, 2, 2, 4]], [String.fromCharCode(parseInt('00f0', 16)), 0x66, [4, 1, 1, 1, 3, 1]], [String.fromCharCode(parseInt('00f1', 16)), 0x61, [4, 1, 1, 1, 1, 3]], [String.fromCharCode(parseInt('00f2', 16)), 0x60, [1, 1, 4, 3, 1, 1]], [String.fromCharCode(parseInt('00f3', 16)), 0x65, [3, 1, 1, 1, 4, 1]], [String.fromCharCode(parseInt('00f4', 16)), 0x62, [4, 1, 1, 3, 1, 1]], [String.fromCharCode(parseInt('00fc', 16)), 0x63, [1, 1, 3, 1, 4, 1]], [String.fromCharCode(parseInt('00fb', 16)), 100, [1, 1, 4, 1, 3, 1]], [String.fromCharCode(parseInt('00f9', 16)), 0x67, [2, 1, 1, 4, 1, 2]], [String.fromCharCode(parseInt('00ff', 16)), -1, [2, 3, 3, 1, 1, 1, 2]]],
        },
        /** Specifies symbology settings for the Code 128 B Barcode. */
        code128b: {
            startSymbol: String.fromCharCode(parseInt('00fd', 16)),
            stopSymbol: String.fromCharCode(parseInt('00ff', 16)),
            validatorExp: "^[\x00-\x7F]",
            symbolTable: [[" ", 0, [2, 1, 2, 2, 2, 2]], ["!", 1, [2, 2, 2, 1, 2, 2]], ["\"", 2, [2, 2, 2, 2, 2, 1]], ["#", 3, [1, 2, 1, 2, 2, 3]], ["$", 4, [1, 2, 1, 3, 2, 2]], ["%", 5, [1, 3, 1, 2, 2, 2]], ["&", 6, [1, 2, 2, 2, 1, 3]], ["\'", 7, [1, 2, 2, 3, 1, 2]], ["(", 8, [1, 3, 2, 2, 1, 2]], [")", 9, [2, 2, 1, 2, 1, 3]], ["*", 10, [2, 2, 1, 3, 1, 2]], ["+", 11, [2, 3, 1, 2, 1, 2]], [",", 12, [1, 1, 2, 2, 3, 2]], ["-", 13, [1, 2, 2, 1, 3, 2]], [".", 14, [1, 2, 2, 2, 3, 1]], ["/", 15, [1, 1, 3, 2, 2, 2]], ["0", 0x10, [1, 2, 3, 1, 2, 2]], ["1", 0x11, [1, 2, 3, 2, 2, 1]], ["2", 0x12, [2, 2, 3, 2, 1, 1]], ["3", 0x13, [2, 2, 1, 1, 3, 2]], ["4", 20, [2, 2, 1, 2, 3, 1]], ["5", 0x15, [2, 1, 3, 2, 1, 2]], ["6", 0x16, [2, 2, 3, 1, 1, 2]], ["7", 0x17, [3, 1, 2, 1, 3, 1]], ["8", 0x18, [3, 1, 1, 2, 2, 2]], ["9", 0x19, [3, 2, 1, 1, 2, 2]], [":", 0x1a, [3, 2, 1, 2, 2, 1]], [";", 0x1b, [3, 1, 2, 2, 1, 2]], ["<", 0x1c, [3, 2, 2, 1, 1, 2]], ["=", 0x1d, [3, 2, 2, 2, 1, 1]], [">", 30, [2, 1, 2, 1, 2, 3]], ["?", 0x1f, [2, 1, 2, 3, 2, 1]], ["@", 0x20, [2, 3, 2, 1, 2, 1]], ["A", 0x21, [1, 1, 1, 3, 2, 3]], ["B", 0x22, [1, 3, 1, 1, 2, 3]], ["C", 0x23, [1, 3, 1, 3, 2, 1]], ["D", 0x24, [1, 1, 2, 3, 1, 3]], ["E", 0x25, [1, 3, 2, 1, 1, 3]], ["F", 0x26, [1, 3, 2, 3, 1, 1]], ["G", 0x27, [2, 1, 1, 3, 1, 3]], ["H", 40, [2, 3, 1, 1, 1, 3]], ["I", 0x29, [2, 3, 1, 3, 1, 1]], ["J", 0x2a, [1, 1, 2, 1, 3, 3]], ["K", 0x2b, [1, 1, 2, 3, 3, 1]], ["L", 0x2c, [1, 3, 2, 1, 3, 1]], ["M", 0x2d, [1, 1, 3, 1, 2, 3]], ["N", 0x2e, [1, 1, 3, 3, 2, 1]], ["O", 0x2f, [1, 3, 3, 1, 2, 1]], ["P", 0x30, [3, 1, 3, 1, 2, 1]], ["Q", 0x31, [2, 1, 1, 3, 3, 1]], ["R", 50, [2, 3, 1, 1, 3, 1]], ["S", 0x33, [2, 1, 3, 1, 1, 3]], ["T", 0x34, [2, 1, 3, 3, 1, 1]], ["U", 0x35, [2, 1, 3, 1, 3, 1]], ["V", 0x36, [3, 1, 1, 1, 2, 3]], ["W", 0x37, [3, 1, 1, 3, 2, 1]], ["X", 0x38, [3, 3, 1, 1, 2, 1]], ["Y", 0x39, [3, 1, 2, 1, 1, 3]], ["Z", 0x3a, [3, 1, 2, 3, 1, 1]], ["[", 0x3b, [3, 3, 2, 1, 1, 1]], ["\\", 60, [3, 1, 4, 1, 1, 1]], ["]", 0x3d, [2, 2, 1, 4, 1, 1]], ["^", 0x3e, [4, 3, 1, 1, 1, 1]], ["_", 0x3f, [1, 1, 1, 2, 2, 4]], ["`", 0x40, [1, 1, 1, 4, 2, 2]], ["a", 0x41, [1, 2, 1, 1, 2, 4]], ["b", 0x42, [1, 2, 1, 4, 2, 1]], ["c", 0x43, [1, 4, 1, 1, 2, 2]], ["d", 0x44, [1, 4, 1, 2, 2, 1]], ["e", 0x45, [1, 1, 2, 2, 1, 4]], ["f", 70, [1, 1, 2, 4, 1, 2]], ["g", 0x47, [1, 2, 2, 1, 1, 4]], ["h", 0x48, [1, 2, 2, 4, 1, 1]], ["i", 0x49, [1, 4, 2, 1, 1, 2]], ["j", 0x4a, [1, 4, 2, 2, 1, 1]], ["k", 0x4b, [2, 4, 1, 2, 1, 1]], ["l", 0x4c, [2, 2, 1, 1, 1, 4]], ["m", 0x4d, [4, 1, 3, 1, 1, 1]], ["n", 0x4e, [2, 4, 1, 1, 1, 2]], ["o", 0x4f, [1, 3, 4, 1, 1, 1]], ["p", 80, [1, 1, 1, 2, 4, 2]], ["q", 0x51, [1, 2, 1, 1, 4, 2]], ["r", 0x52, [1, 2, 1, 2, 4, 1]], ["s", 0x53, [1, 1, 4, 2, 1, 2]], ["t", 0x54, [1, 2, 4, 1, 1, 2]], ["u", 0x55, [1, 2, 4, 2, 1, 1]], ["v", 0x56, [4, 1, 1, 2, 1, 2]], ["w", 0x57, [4, 2, 1, 1, 1, 2]], ["x", 0x58, [4, 2, 1, 2, 1, 1]], ["y", 0x59, [2, 1, 2, 1, 4, 1]], ["z", 90, [2, 1, 4, 1, 2, 1]], ["{", 0x5b, [4, 1, 2, 1, 2, 1]], ["|", 0x5c, [1, 1, 1, 1, 4, 3]], ["}", 0x5d, [1, 1, 1, 3, 4, 1]], ["~", 0x5e, [1, 3, 1, 1, 4, 1]], [String.fromCharCode(parseInt('007f', 16)), 0x5f, [1, 1, 4, 1, 1, 3]], [String.fromCharCode(parseInt('00f0', 16)), 0x66, [4, 1, 1, 1, 3, 1]], [String.fromCharCode(parseInt('00f1', 16)), 0x61, [4, 1, 1, 1, 1, 3]], [String.fromCharCode(parseInt('00f2', 16)), 0x60, [1, 1, 4, 3, 1, 1]], [String.fromCharCode(parseInt('00f3', 16)), 100, [1, 1, 4, 1, 3, 1]], [String.fromCharCode(parseInt('00f4', 16)), 0x62, [4, 1, 1, 3, 1, 1]], [String.fromCharCode(parseInt('00fc', 16)), 0x63, [1, 1, 3, 1, 4, 1]], [String.fromCharCode(parseInt('00fa', 16)), 0x65, [3, 1, 1, 1, 4, 1]], [String.fromCharCode(parseInt('00fd', 16)), 0x68, [2, 1, 1, 2, 1, 4]], [String.fromCharCode(parseInt('00ff', 16)), -1, [2, 3, 3, 1, 1, 1, 2]]],
        },
        /** Specifies symbology settings for the Code 128 C Barcode. */
        code128c: {
            startSymbol: String.fromCharCode(parseInt('00fe', 16)),
            stopSymbol: String.fromCharCode(parseInt('00ff', 16)),
            validatorExp: "[0-9]",
            symbolTable: [["\0", 0, [2, 1, 2, 2, 2, 2]], [String.fromCharCode(parseInt('0001', 16)), 1, [2, 2, 2, 1, 2, 2]], [String.fromCharCode(parseInt('0002', 16)), 2, [2, 2, 2, 2, 2, 1]], [String.fromCharCode(parseInt('0003', 16)), 3, [1, 2, 1, 2, 2, 3]], [String.fromCharCode(parseInt('0004', 16)), 4, [1, 2, 1, 3, 2, 2]], [String.fromCharCode(parseInt('0005', 16)), 5, [1, 3, 1, 2, 2, 2]], [String.fromCharCode(parseInt('0006', 16)), 6, [1, 2, 2, 2, 1, 3]], ["\a", 7, [1, 2, 2, 3, 1, 2]], ["\b", 8, [1, 3, 2, 2, 1, 2]], ["\t", 9, [2, 2, 1, 2, 1, 3]], ["\n", 10, [2, 2, 1, 3, 1, 2]], ["\v", 11, [2, 3, 1, 2, 1, 2]], ["\f", 12, [1, 1, 2, 2, 3, 2]], ["\r", 13, [1, 2, 2, 1, 3, 2]], [String.fromCharCode(parseInt('000e', 16)), 14, [1, 2, 2, 2, 3, 1]], [String.fromCharCode(parseInt('000f', 16)), 15, [1, 1, 3, 2, 2, 2]], [String.fromCharCode(parseInt('0010', 16)), 0x10, [1, 2, 3, 1, 2, 2]], [String.fromCharCode(parseInt('0011', 16)), 0x11, [1, 2, 3, 2, 2, 1]], [String.fromCharCode(parseInt('0012', 16)), 0x12, [2, 2, 3, 2, 1, 1]], [String.fromCharCode(parseInt('0013', 16)), 0x13, [2, 2, 1, 1, 3, 2]], [String.fromCharCode(parseInt('0014', 16)), 20, [2, 2, 1, 2, 3, 1]], [String.fromCharCode(parseInt('0015', 16)), 0x15, [2, 1, 3, 2, 1, 2]], [String.fromCharCode(parseInt('0016', 16)), 0x16, [2, 2, 3, 1, 1, 2]], [String.fromCharCode(parseInt('0017', 16)), 0x17, [3, 1, 2, 1, 3, 1]], [String.fromCharCode(parseInt('0018', 16)), 0x18, [3, 1, 1, 2, 2, 2]], [String.fromCharCode(parseInt('0019', 16)), 0x19, [3, 2, 1, 1, 2, 2]], [String.fromCharCode(parseInt('001a', 16)), 0x1a, [3, 2, 1, 2, 2, 1]], [String.fromCharCode(parseInt('001b', 16)), 0x1b, [3, 1, 2, 2, 1, 2]], [String.fromCharCode(parseInt('001c', 16)), 0x1c, [3, 2, 2, 1, 1, 2]], [String.fromCharCode(parseInt('001d', 16)), 0x1d, [3, 2, 2, 2, 1, 1]], [String.fromCharCode(parseInt('001e', 16)), 30, [2, 1, 2, 1, 2, 3]], [String.fromCharCode(parseInt('001f', 16)), 0x1f, [2, 1, 2, 3, 2, 1]], [" ", 0x20, [2, 3, 2, 1, 2, 1]], ["!", 0x21, [1, 1, 1, 3, 2, 3]], ["\"", 0x22, [1, 3, 1, 1, 2, 3]], ["#", 0x23, [1, 3, 1, 3, 2, 1]], ["$", 0x24, [1, 1, 2, 3, 1, 3]], ["%", 0x25, [1, 3, 2, 1, 1, 3]], ["&", 0x26, [1, 3, 2, 3, 1, 1]], ["\'", 0x27, [2, 1, 1, 3, 1, 3]], ["[", 40, [2, 3, 1, 1, 1, 3]], [")", 0x29, [2, 3, 1, 3, 1, 1]], ["*", 0x2a, [1, 1, 2, 1, 3, 3]], ["+", 0x2b, [1, 1, 2, 3, 3, 1]], [",", 0x2c, [1, 3, 2, 1, 3, 1]], ["-", 0x2d, [1, 1, 3, 1, 2, 3]], [".", 0x2e, [1, 1, 3, 3, 2, 1]], ["/", 0x2f, [1, 3, 3, 1, 2, 1]], ["0", 0x30, [3, 1, 3, 1, 2, 1]], ["1", 0x31, [2, 1, 1, 3, 3, 1]], ["2", 50, [2, 3, 1, 1, 3, 1]], ["3", 0x33, [2, 1, 3, 1, 1, 3]], ["4", 0x34, [2, 1, 3, 3, 1, 1]], ["5", 0x35, [2, 1, 3, 1, 3, 1]], ["6", 0x36, [3, 1, 1, 1, 2, 3]], ["7", 0x37, [3, 1, 1, 3, 2, 1]], ["8", 0x38, [3, 3, 1, 1, 2, 1]], ["9", 0x39, [3, 1, 2, 1, 1, 3]], [":", 0x3a, [3, 1, 2, 3, 1, 1]], [";", 0x3b, [3, 3, 2, 1, 1, 1]], ["<", 60, [3, 1, 4, 1, 1, 1]], ["=", 0x3d, [2, 2, 1, 4, 1, 1]], [">", 0x3e, [4, 3, 1, 1, 1, 1]], ["?", 0x3f, [1, 1, 1, 2, 2, 4]], ["@", 0x40, [1, 1, 1, 4, 2, 2]], ["A", 0x41, [1, 2, 1, 1, 2, 4]], ["B", 0x42, [1, 2, 1, 4, 2, 1]], ["C", 0x43, [1, 4, 1, 1, 2, 2]], ["D", 0x44, [1, 4, 1, 2, 2, 1]], ["E", 0x45, [1, 1, 2, 2, 1, 4]], ["F", 70, [1, 1, 2, 4, 1, 2]], ["G", 0x47, [1, 2, 2, 1, 1, 4]], ["H", 0x48, [1, 2, 2, 4, 1, 1]], ["I", 0x49, [1, 4, 2, 1, 1, 2]], ["J", 0x4a, [1, 4, 2, 2, 1, 1]], ["K", 0x4b, [2, 4, 1, 2, 1, 1]], ["L", 0x4c, [2, 2, 1, 1, 1, 4]], ["M", 0x4d, [4, 1, 3, 1, 1, 1]], ["N", 0x4e, [2, 4, 1, 1, 1, 2]], ["O", 0x4f, [1, 3, 4, 1, 1, 1]], ["P", 80, [1, 1, 1, 2, 4, 2]], ["Q", 0x51, [1, 2, 1, 1, 4, 2]], ["R", 0x52, [1, 2, 1, 2, 4, 1]], ["S", 0x53, [1, 1, 4, 2, 1, 2]], ["T", 0x54, [1, 2, 4, 1, 1, 2]], ["U", 0x55, [1, 2, 4, 2, 1, 1]], ["V", 0x56, [4, 1, 1, 2, 1, 2]], ["W", 0x57, [4, 2, 1, 1, 1, 2]], ["X", 0x58, [4, 2, 1, 2, 1, 1]], ["Y", 0x59, [2, 1, 2, 1, 4, 1]], ["Z", 90, [2, 1, 4, 1, 2, 1]], ["[", 0x5b, [4, 1, 2, 1, 2, 1]], ["\\", 0x5c, [1, 1, 1, 1, 4, 3]], ["]", 0x5d, [1, 1, 1, 3, 4, 1]], ["^", 0x5e, [1, 3, 1, 1, 4, 1]], ["_", 0x5f, [1, 1, 4, 1, 1, 3]], ["`", 0x60, [1, 1, 4, 3, 1, 1]], ["a", 0x61, [4, 1, 1, 1, 1, 3]], ["b", 0x62, [4, 1, 1, 3, 1, 1]], ["c", 0x63, [1, 1, 3, 1, 4, 1]], [String.fromCharCode(parseInt('00f0', 16)), 0x66, [4, 1, 1, 1, 3, 1]], [String.fromCharCode(parseInt('00fa', 16)), 0x65, [3, 1, 1, 1, 4, 1]], [String.fromCharCode(parseInt('00fb', 16)), 100, [1, 1, 4, 1, 3, 1]], [String.fromCharCode(parseInt('00fe', 16)), 0x69, [2, 1, 1, 2, 3, 2]], [String.fromCharCode(parseInt('00ff', 16)), -1, [2, 3, 3, 1, 1, 1, 2]]],
        },
        /** Specifies symbology settings for the UPC-A Barcode. */
        upcbarcode: {
            startSymbol: String.fromCharCode(parseInt('00fd', 16)),
            stopSymbol: String.fromCharCode(parseInt('00ff', 16)),
            validatorExp: "[0-9]",
            symbolTable: [["0", 0, [3, 2, 1, 1]], ["1", 1, [2, 2, 2, 1]], ["2", 2, [2, 1, 2, 2]], ["3", 3, [1, 4, 1, 1]], ["4", 4, [1, 1, 3, 2]], ["5", 5, [1, 2, 3, 1]], ["6", 6, [1, 1, 1, 4]], ["7", 7, [1, 3, 1, 2]], ["8", 8, [1, 2, 1, 3]], ["9", 9, [3, 1, 1, 2]], ["B", 0 , [1, 1, 1, 1]]],
        },
		/** Specifies symbology settings for EAN-8 And EAN-13 barcode. */
		ean: {
			startSymbol: String.fromCharCode(parseInt('00fd', 16)),
			stopSymbol:String.fromCharCode(parseInt('00fd', 16)),
			validatorExp: "^[0-9]+$",
			symbolTable:[["0", 0, [3, 2, 1, 1]], ["1", 1, [2, 2, 2, 1]], ["2", 2, [2, 1, 2, 2]], ["3", 3, [1, 4, 1, 1]], ["4", 4, [1, 1, 3, 2]], ["5", 5, [1, 2, 3, 1]], ["6", 6, [1, 1, 1, 4]], ["7", 7, [1, 3, 1, 2]], ["8", 8, [1, 2, 1, 3]], ["9", 9, [3, 1, 1, 2]], ["A", 0 , [1, 1, 1, 1]],  ["B", 0 , [1, 1, 1, 1]]],
		},
    };

})(jQuery, Syncfusion);