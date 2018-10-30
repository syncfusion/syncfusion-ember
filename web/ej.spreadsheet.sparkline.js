(function ($, ej, undefined) {

    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};
    ej.spreadsheetFeatures.sparkLine = function (obj) {
        this.XLObj = obj;
        this.rowIdx = "";
        this.colIdx = "";
        this.dRange = "";
        this.location = "";
    };

    ej.spreadsheetFeatures.sparkLine.prototype = {
        createSparkline: function (dataRange, locationRange, type, options, sheetIdx) {
            var xlObj = this.XLObj, j, cnt, drow, dcol, lrow, lcol, sparklineString = false,sameDLRnge= false, dtRange, dollarToRnge, dollarToLocRnge, dataRange, sparkline, sparklineElem, sheet, details, sheetIdx, sparklineDiv,lRange, locnlen, cellInfo, selectedDataRnge, selectedLocRnge, sheetIndex, dataRngeValue, cell, dRowIdx, dColIdx, dRnglen, arr = [], range= [], tabUpdate = false, array = {};
            if (!xlObj.model.allowSparkline || xlObj.model.ReadOnly)
                return;
            options = options || {};
            if ((dataRange == "") || (locationRange == ""))
                xlObj._showAlertDlg("Alert", "EmptyDLRnge", 630);
            sheetIdx = sheetIdx || xlObj.getActiveSheetIndex();
            sheet = xlObj.getSheet(sheetIdx);
            dollarToRnge = xlObj.XLRibbon._getAddrFromDollarAddr(dataRange);
            dollarToLocRnge = xlObj.XLRibbon._getAddrFromDollarAddr(locationRange);
            dataRnge = xlObj._getSelectedCells(sheetIdx, dollarToRnge[1]) || xlObj._getSelectedCells();
            locRnge = xlObj._getSelectedCells(sheetIdx, dollarToLocRnge[1]) || xlObj._getSelectedCells();
            options.highPointColor = options.highPointColor || null;
            options.lowPointColor = options.lowPointColor || null;
            options.negativePointColor = options.negativePointColor || null;
            options.startPointColor = options.startPointColor || null;
            options.endPointColor = options.endPointColor || null;
            selectedDataRnge = dataRnge.range;
            drow = selectedDataRnge[2] - selectedDataRnge[0] + 1;
            dcol = selectedDataRnge[3] - selectedDataRnge[1] + 1;
            selectedLocRnge = locRnge.range;
            lrow = selectedLocRnge[2] - selectedLocRnge[0] + 1;
            lcol = selectedLocRnge[3] - selectedLocRnge[1] + 1;
            if ((locRnge.range[0] == locRnge.range[2]) || (locRnge.range[1] == locRnge.range[3])) { // check if the loc range are all in single col or row
                if ((dataRnge.range[0] == dataRnge.range[2]) || (dataRnge.range[1] == dataRnge.range[3])) { // check the selected range is single row or column or mul row or col
                    if ((locRnge.selCells.length == 1)) { //  select singlerow or single column
                        for (j = 0, locnlen = locRnge.selCells.length; j < locnlen; j++) {
                            this.rowIdx = locRnge.selCells[j].rowIndex;
                            this.colIdx = locRnge.selCells[j].colIndex;
                            sparkline = xlObj.XLEdit.getPropertyValue(this.rowIdx, this.colIdx, "sparkline");
                            sparkline && xlObj._getContent(sheetIdx).find("#" + sparkline[0]).remove();
                            cellInfo = xlObj._getCellInfo({ rowIndex: this.rowIdx, colIndex: this.colIdx }, sheetIdx);
                            for (var i = 0, dRnglen = dataRnge.selCells.length; i < dRnglen; i++) {
                                dRowIdx = dataRnge.selCells[i].rowIndex;
                                dColIdx = dataRnge.selCells[i].colIndex;
                                dataRngeValue = xlObj.XLEdit.getPropertyValue(dRowIdx, dColIdx, "value", sheetIdx);
                                if (typeof dataRngeValue === "string")
                                    sparklineString = true;
                                arr.push(dataRngeValue);
                                range.push(dRowIdx,dColIdx);
                            }
							dtRange = xlObj._getAlphaRange(sheetIdx, range[0], range[1], range[range.length - 2], range[range.length - 1]);
                        }
                        if (sparklineString)
                            xlObj._showAlertDlg("Alert", "SparklineDataAlert", 630);
                        else if (typeof dataRngeValue === "number") {
                            sparklineElem = this._renderBaseElem(cellInfo, type, this.rowIdx, this.colIdx, sheetIdx);
                            array = { dataSource: arr, type: type, isResponsive: true, id: sparklineElem[0].id, rowIndex: this.rowIdx, colIndex: this.colIdx, cellInfo: cellInfo, DataRange: dtRange, LocationRange: dollarToLocRnge[1], reqType: "sparkline", shapeType: "sparkline", action: "create", sparklineType: type, range: range, fill: "#33ccff" };
                            sparklineElem.ejSparkline($.extend(array, options));
                            xlObj.XLShape._updateShapeMngr({ rowIndex: this.rowIdx, colIndex: this.colIdx }, { "sparkline": $.extend(array, options) }, "sparkline");
                            if (!xlObj._isUndoRedo) {
                                details = $.extend(array, options);
                                details["sheetIndex"] = sheetIdx;
                                xlObj._completeAction(details);
                                xlObj._trigActionComplete(details);
                            }
                            tabUpdate = true;
                        }
                    }
                    else if (dataRnge.selCells.length == (locRnge.selCells.length)) //check datarnge and locrnge length to be equal
                    {
                        for (var k = 0, dRnglen = dataRnge.selCells.length; k < dRnglen; k++) {
                            this.rowIdx = locRnge.selCells[k].rowIndex;
                            this.colIdx = locRnge.selCells[k].colIndex;
                            sparkline = xlObj.XLEdit.getPropertyValue(this.rowIdx, this.colIdx, "sparkline");
                            sparkline && xlObj._getContent(sheetIdx).find("#" + sparkline[0]).remove();
                            cellInfo = xlObj._getCellInfo({ rowIndex: this.rowIdx, colIndex: this.colIdx }, sheetIdx);
                            dataRngeValue = xlObj.XLEdit.getPropertyValue(dataRnge.selCells[k].rowIndex, dataRnge.selCells[k].colIndex, "value", sheetIdx);
                            sameDLRnge == true;
                            range.push(dataRnge.selCells[k].rowIndex,dataRnge.selCells[k].colIndex);
                            if (typeof dataRngeValue === "string")
                                xlObj._showAlertDlg("Alert", "SparklineDataAlert", 630);
                            else if (typeof dataRngeValue === "number")
                                 {
                                    sparklineElem = this._renderBaseElem(cellInfo, type, this.rowIdx, this.colIdx, sheetIdx);
									dtRange = xlObj._getAlphaRange(sheetIdx, dataRnge.selCells[k].rowIndex, dataRnge.selCells[k].colIndex, dataRnge.selCells[k].rowIndex, dataRnge.selCells[k].colIndex);
                                    array = { dataSource: [dataRngeValue], type: type, isResponsive: true, id: sparklineElem[0].id, rowIndex: this.rowIdx, colIndex: this.colIdx, cellInfo: cellInfo, DataRange: dtRange, LocationRange: dollarToLocRnge[1], reqType: "sparkline", shapeType: "sparkline", action: "create", sparklineType: type, range:range, fill: "#33ccff" }
                                    sparklineElem.ejSparkline($.extend(array, options));
                                    xlObj.XLShape._updateShapeMngr({ rowIndex: this.rowIdx, colIndex: this.colIdx }, { "sparkline": $.extend(array, options) }, "sparkline");
                                    if (!xlObj._isUndoRedo) {
                                        details = $.extend(array, options);
                                        details["sheetIndex"] = sheetIdx;
                                        xlObj._completeAction(details);
                                        xlObj._trigActionComplete(details);
                                    }
                                    tabUpdate = true;
                                }
                        }
                    }
                    else
                        xlObj._showAlertDlg("Alert", "SparklineLocAlert", 630);
                }
                else if ((drow == lrow) || (drow == lcol)) {   // multiple row or col   ******** row  ****** 
                    dRowIdx = dataRnge.selCells[0].rowIndex;
                    for (j = 0, locnlen = locRnge.selCells.length; j < locnlen; j++) {
                        this.rowIdx = locRnge.selCells[j].rowIndex;
                        this.colIdx = locRnge.selCells[j].colIndex;
                        sparkline = xlObj.XLEdit.getPropertyValue(this.rowIdx, this.colIdx, "sparkline");
                        sparkline && xlObj._getContent(sheetIdx).find("#" + sparkline[0]).remove();
                        cellInfo = xlObj._getCellInfo({ rowIndex: this.rowIdx, colIndex: this.colIdx }, sheetIdx);
						range = [];
                        for (var i = 0; i < dcol; i++) {
                            dColIdx = dataRnge.selCells[i].colIndex;
                            dataRngeValue = xlObj.XLEdit.getPropertyValue(dRowIdx, dColIdx, "value", sheetIdx);
                            if (typeof dataRngeValue === "string")
                                sparklineString = true;
                            arr.push(dataRngeValue);
                            range.push(dRowIdx, dColIdx);
                        }
                        lRange = xlObj._getAlphaRange(sheetIdx, this.rowIdx,this.colIdx,this.rowIdx,this.colIdx);
						dtRange = xlObj._getAlphaRange(sheetIdx, range[0], range[1], range[range.length - 2], range[range.length - 1]);
                        if (sparklineString)
                            xlObj._showAlertDlg("Alert", "SparklineDataAlert", 630);
                        else if (typeof dataRngeValue === "number")
                            sparklineElem = this._renderBaseElem(cellInfo, type, this.rowIdx, this.colIdx, sheetIdx);
                        array = { dataSource: arr, type: type, isResponsive: true, id: sparklineElem[0].id, rowIndex: this.rowIdx, colIndex: this.colIdx, cellInfo: cellInfo, DataRange: dtRange, LocationRange: lRange, reqType: "sparkline", shapeType: "sparkline", action: "create", sparklineType: type, range: range, fill: "#33ccff" }
                        sparklineElem.ejSparkline($.extend(array, options));
                        xlObj.XLShape._updateShapeMngr({ rowIndex: this.rowIdx, colIndex: this.colIdx }, { "sparkline": $.extend(array, options) }, "sparkline");
                        dRowIdx++;
                        arr = [];
                        if (!xlObj._isUndoRedo) {
                            details = $.extend(array, options);
                            details["sheetIndex"] = sheetIdx;
                            xlObj._completeAction(details);
                            xlObj._trigActionComplete(details);
                        }
                        tabUpdate = true;
                    }
                }
                else if ((dcol == lrow) || (dcol == lcol)) {  // col
                    dColIdx = dataRnge.selCells[0].colIndex;
                    for (j = 0, locnlen = locRnge.selCells.length; j < locnlen; j++) {
                        this.rowIdx = locRnge.selCells[j].rowIndex;
                        this.colIdx = locRnge.selCells[j].colIndex;
                        sparkline = xlObj.XLEdit.getPropertyValue(this.rowIdx, this.colIdx, "sparkline");
                        sparkline && xlObj._getContent(sheetIdx).find("#" + sparkline[0]).remove();
                        cellInfo = xlObj._getCellInfo({ rowIndex: this.rowIdx, colIndex: this.colIdx }, sheetIdx);
                        dRowIdx = dataRnge.selCells[0].rowIndex;
						range = [];
                        for (var i = 0; i < drow; i++) {
                            dataRngeValue = xlObj.XLEdit.getPropertyValue(dRowIdx, dColIdx, "value", sheetIdx);
                            if (typeof dataRngeValue === "string")
                                sparklineString = true;
                            arr.push(dataRngeValue);
                            range.push(dRowIdx, dColIdx);
                            dRowIdx++;
                        }
                        lRange = xlObj._getAlphaRange(sheetIdx, this.rowIdx,this.colIdx,this.rowIdx,this.colIdx);
						dtRange = xlObj._getAlphaRange(sheetIdx, range[0], range[1], range[range.length - 2], range[range.length - 1]);
                        if (sparklineString)
                            xlObj._showAlertDlg("Alert", "SparklineDataAlert", 630);
                        else if (typeof dataRngeValue === "number")
                            sparklineElem = this._renderBaseElem(cellInfo, type, this.rowIdx, this.colIdx, sheetIdx);
                        array = { dataSource: arr, type: type, isResponsive: true, id: sparklineElem[0].id, rowIndex: this.rowIdx, colIndex: this.colIdx, cellInfo: cellInfo, DataRange: dtRange, LocationRange: lRange, reqType: "sparkline", shapeType: "sparkline", action: "create", sparklineType: type, range: range, fill: "#33ccff" };
                        sparklineElem.ejSparkline($.extend(array, options));
                        xlObj.XLShape._updateShapeMngr({ rowIndex: this.rowIdx, colIndex: this.colIdx }, { "sparkline": $.extend(array, options) }, "sparkline");
                        dColIdx++;
                        arr = [];
                        if (!xlObj._isUndoRedo) {
                            details = $.extend(array, options);
                            details["sheetIndex"] = sheetIdx;
                            xlObj._completeAction(details);
                            xlObj._trigActionComplete(details);
                        }
                        tabUpdate = true;
                    }
                }
                else
                    xlObj._showAlertDlg("Alert", "SparklineLocAlert", 630);
            }
            else
                xlObj._showAlertDlg("Alert", "SparklineAlert", 630);
            if ((xlObj.model.showRibbon) && (tabUpdate))
                this._sparklineDesignTabUpdate(sparklineElem[0].id);
			this._wireSparklineEvents("_on");
        },

        _createSparkline: function (sparklineProp, cellInfo, sheetIdx) {
            var xlObj = this.XLObj, sparklineElem, sheetIdx = sheetIdx || xlObj.getActiveSheetIndex();
            if (xlObj.isImport || xlObj.model.isImport) {
                sparklineElem = this._renderBaseElement(cellInfo.top, cellInfo.left, cellInfo.height, cellInfo.width, sparklineProp.rowIndex, sparklineProp.colIndex, sparklineProp.type, sheetIdx, sparklineProp.id)
                sparklineElem.ejSparkline(sparklineProp);
                sparklineProp["cellInfo"] = cellInfo;
                sparklineProp["id"] = sparklineElem[0].id;
                xlObj.XLShape._updateShapeMngr({ rowIndex: sparklineProp.rowIndex, colIndex: sparklineProp.colIndex }, { "sparkline": sparklineProp }, "sparkline");
            }
            else {
				cellInfo = cellInfo || sparklineProp.cellInfo;
                sparklineElem = this._renderBaseElement(cellInfo.top, cellInfo.left, sparklineProp.cellInfo.height, sparklineProp.cellInfo.width, sparklineProp.rowIndex, sparklineProp.colIndex, sparklineProp.type, sheetIdx,sparklineProp.id);
                sparklineElem.ejSparkline(sparklineProp);
            }
			this._wireSparklineEvents("_on");
        },
        _renderBaseElement: function (top, left, height, width, rowIndex, colIndex, type, sheetIndex, sparklineId) {
            var xlObj = this.XLObj, div, actCell;
            div = $("<div id='"+ sparklineId + "' class='e-ss-sparkline'  style='top:" + top + "px; left:" + left + "px; height:" + (height - 1) + "px; width:" + width + "px;' ></div>");
            div.data("parentID", xlObj._id);
			actCell = xlObj.getCell(rowIndex, colIndex, sheetIndex);
			if(actCell.find('div[id *= "_Merge"]').length)
				actCell.find('div[id *= "_Merge"]').prepend(div[0]);
			else
				actCell.prepend(div[0]);
            return div;
        },

        _initSparklineDialog: function () {
            var xlObj = this.XLObj, $dlg, $okBtn, $canBtn, $btndiv, $btnctnr;
            $dlg = ej.buildTag("div#" + xlObj._id + "_SparklineDialog");
            xlObj.element.append($dlg);
            $dlg.append(ej.buildTag("div#" + xlObj._id + "_Sparkline.e-dlgctndiv"));
            $btndiv = ej.buildTag("div#" + xlObj._id + "sparklineBtnDiv.e-dlg-btnfields");
            $btnctnr = ej.buildTag("div.e-dlg-btnctnr");
            $okBtn = ej.buildTag("input#" + xlObj._id + "sparklineDialog_OKBtn", "", {}, { type: "button" });
            $canBtn = ej.buildTag("input#" + xlObj._id + "sparklineDialog_CancelBtn", "", {}, { type: "button" });
            $okBtn.ejButton({ text: xlObj._getLocStr("Ok"), showRoundedCorner: true, width: "25%", click: ej.proxy(this._dlgSparklineOk, this), enabled: true, cssClass: "e-ss-okbtn" });
            $canBtn.ejButton({ text: xlObj._getLocStr("Cancel"), click: ej.proxy(this._dlgSparklineCancel, this), showRoundedCorner: true, width: "25%" });
            $btndiv.append($btnctnr.append($okBtn, $canBtn));
            $dlg.append($btndiv);
            $dlg.ejDialog({ enableModal: true, showOnInit: false, enableResize: false, allowKeyboardNavigation: false, title: xlObj._getLocStr("SparklineChart"), width: "auto", cssClass: "e-ss-dialog e-ss-sparklinedlg e-" + xlObj._id + "-dlg", close: ej.proxy(this._dialogClose, this) });
        },
        _dlgSparklineOk: function () {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), sparkline, sparklineId,newLocationRange, newDataRange, details, sparklineDiv, dlg = $("#" + xlObj._id + "_SparklineDialog"), arr = [], i, newDataRnge, newLocRnge, dollarToDRnge, type;
            if($("#" + xlObj._id + "_Form_Ribbon_SparklineRange").valid() && $("#" + xlObj._id + "_Form_Ribbon_SparklineLocation").valid()) {
            if (xlObj.XLRibbon._isEditGroupLocationClick) {
                dollarToDRnge = xlObj.XLRibbon._getAddrFromDollarAddr(this.dRange);
                newLocationRange = $("#" + xlObj._id + "_Ribbon_SparklineLocation").val();
                newDataRange = $("#" + xlObj._id + "_Ribbon_SparklineRange").val();
                if ((((dollarToDRnge[1] == newDataRange || dollarToDRnge[1].toLowerCase() == newDataRange) && this.location != newLocationRange) || ((dollarToDRnge[1] != newDataRange || dollarToDRnge[1].toLowerCase() != newDataRange) && this.location == newLocationRange)) || ((dollarToDRnge[1] != newDataRange || dollarToDRnge[1].toLowerCase() != newDataRange) && this.location != newLocationRange)) {
                    sparklineDiv = xlObj._getContent(sheetIdx).find("#" + xlObj._id + "_" + "S" + sheetIdx + "_" + xlObj.XLRibbon._sparklineDesignType + "_" + this.rowIdx + "_" + this.colIdx);
                    sparklineId = xlObj.XLEdit.getPropertyValue(xlObj._getSelectedCells().selCells[0].rowIndex, xlObj._getSelectedCells().selCells[0].colIndex, "sparkline")[0];
                    sparkline = sheet.shapeMngr.sparkline[sparklineDiv[0].id];
                    type = sparkline.type;
                    delete xlObj._dataContainer.sheets[sheetIdx][this.rowIdx][this.colIdx];
                    delete sheet.shapeMngr.sparkline[sparklineDiv[0].id];
                    sparklineDiv.remove();
                    this.createSparkline(newDataRange, newLocationRange, type);
                    dlg.ejDialog("close");
                    xlObj.XLRibbon._isEditGroupLocationClick = false;
                }
            }
            else {
                this.dRange = $("#" + xlObj._id + "_Ribbon_SparklineRange").val();
                this.location = $("#" + xlObj._id + "_Ribbon_SparklineLocation").val();
                this.createSparkline(this.dRange, this.location, xlObj.XLRibbon._sparklineDesignType);
            }
            dlg.ejDialog("close");
            }
        },
        _dlgSparklineDesignOk: function () {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sparklineId, locRange, details, dlg = $("#" + xlObj._id + "_sparklinedesigndlg");
            if($("#" + xlObj._id + "_Form_datarange").valid()) {  
            locRange = xlObj.getAlphaRange(xlObj._getSelectedCells(sheetIdx).selCells[0].rowIndex, xlObj._getSelectedCells(sheetIdx).selCells[0].colIndex);
            sparklineId = xlObj.XLEdit.getPropertyValue(xlObj._getSelectedCells().selCells[0].rowIndex, xlObj._getSelectedCells().selCells[0].colIndex, "sparkline")[0];
            this.createSparkline($("#" + xlObj._id + "_datarange").val(), locRange, xlObj.getSheet(sheetIdx).shapeMngr.sparkline[sparklineId].type);
            xlObj.XLRibbon._isEditSingleSparklineClick = false;
            dlg.ejDialog("close");
            }
        },

        _dlgSparklineCancel: function () {
            var xlObj = this.XLObj;
            $("#" + xlObj._id + "_SparklineDialog").ejDialog("close");
            xlObj._setSheetFocus();
        },
        _dlgSparklineDesignCancel: function () {
            var xlObj = this.XLObj;
            $("#" + xlObj._id + "_sparklinedesigndlg").ejDialog("close");
            xlObj._setSheetFocus();
        },

        _renderSparklineDialog: function () {
            var xlObj = this.XLObj;
            if ($("#" + xlObj._id + "_Ribbon_SparklineDiv").length < 1) {
                var $sparklineDiv, $label, $table, $tr, $td, input;
                $sparklineDiv = ej.buildTag("div.e-dlgctndiv", "", {}, { id: xlObj._id + "_Ribbon_SparklineDiv" });
                $table = ej.buildTag("table", "", {}, { "cellpadding": 0, "cellspacing": 0 });
                $tr = ej.buildTag("tr");
                $td = ej.buildTag("td");
                $td.attr("colspan", 1);
                $table.append($tr.append($td));

                $tr = ej.buildTag("tr.e-ss-changerange");
                $td = ej.buildTag("td", "");
                $label = ej.buildTag("label", " " + xlObj._getLocStr("DataRange"));
                $td.append($label);
                $tr.append($td);
                $td = ej.buildTag("td", "");
                input = ej.buildTag("input.ejinputtext", "", {}, { id: xlObj._id + "_Ribbon_SparklineRange", type: "text" });
                input.data("parentID", xlObj._id);
                $tr.append($td.append(input));
                $table.append($tr);

                $tr = ej.buildTag("tr");
                $td = ej.buildTag("td");
                $label = ej.buildTag("label", "");
                $td.append($label);
                $td.attr("colspan", 2);
                $table.append($tr.append($td));

                $tr = ej.buildTag("tr");
                $td = ej.buildTag("td");
                $label = ej.buildTag("label", " " + xlObj._getLocStr("LocationRange"));
                $td.append($label);
                $label = ej.buildTag("label", "  ");
                $td.append($label);
                $tr.append($td);
                $td = ej.buildTag("td");
                input = ej.buildTag("input.ejinputtext", "", {}, { id: xlObj._id + "_Ribbon_SparklineLocation", type: "text" });
                input.data("parentID", xlObj._id);
                $tr.append($td.append(input));
                $table.append($tr);

                $("#" + xlObj._id + "_Sparkline").append($sparklineDiv.append($table));
                $("#" + xlObj._id + "_Ribbon_SparklineLocation").wrap("<form id='" + xlObj._id + "_Form_Ribbon_SparklineLocation' onsubmit='return false'></form>");
                xlObj.XLRibbon._dialogValidate("_Ribbon_SparklineLocation");
                $("#" + xlObj._id + "_Ribbon_SparklineRange").wrap("<form id='" + xlObj._id + "_Form_Ribbon_SparklineRange' onsubmit='return false'></form>");
                xlObj.XLRibbon._dialogValidate("_Ribbon_SparklineRange");
            }
        },
        _tabInsert: function () {
            var createdObj, xlObj = this.XLObj, imgtop = "imagetop";
            createdObj = {
                text: "Sparkline Charts",
                id: "SparklineCharts",
                alignType: ej.Ribbon.alignType.rows,
                content: [{
                    groups: [
                        xlObj.XLRibbon._generateBtn("Insert_Sparkline_Line", "LineChart", "imageonly", "e-icon e-ss-linesparkline", 30, xlObj.XLRibbon._smallBtnHeight, "LineSparklineTitle", "LineSparklineContent", false, "ej.ImagePosition.ImageTop"),
                        xlObj.XLRibbon._generateBtn("Insert_Sparkline_Column", "ColumnChart", "imageonly", "e-icon e-ss-columnsparkline", 30, xlObj.XLRibbon._smallBtnHeight, "ColumnSparklineTitle", "ColumnSparklineContent", false, "ej.ImagePosition.ImageTop"),
                        xlObj.XLRibbon._generateBtn("Insert_Sparkline_Winloss", "Win/Loss Chart", "imageonly", "e-icon e-ss-winlosssparkline", 30, xlObj.XLRibbon._smallBtnHeight, "WinLossSparklineTitle", "WinLossSparklineContent", false, "ej.ImagePosition.ImageTop"),
                    ],
                },
                {
                    groups: [
                        //xlObj.XLRibbon._generateBtn("Insert_Sparkline_Area", "AreaChart", "imageonly", "e-icon e-ss-areasparkline", 30, xlObj.XLRibbon._smallBtnHeight, "AreaSparklineTitle", "AreaSparklineContent", false,  "ej.ImagePosition.ImageTop"),
                        //xlObj.XLRibbon._generateBtn("Insert_Sparkline_Pie", "PieChart", "imageonly", "e-icon e-ss-piesparkline", 30, xlObj.XLRibbon._smallBtnHeight, "PieSparklineTitle", "PieSparklineContent", false,  "ej.ImagePosition.ImageTop"),
                    ],
                },
                ]
            };
            return createdObj;
        },
        _contextualTabInsert: function () {
            var xlObj = this.XLObj, xlId = xlObj._id, imgtop = "imagetop";
            createdObj = {
                backgroundColor: "#EAF6BD",
                borderColor: "#90AA3C",
                tabs: [
                    {
                        id: "sparklinedesign",
                        text: xlObj._getLocStr("SPARKLINEDESIGN"),
                        groups: [
                            {
                                text: "Sparkline",
                                alignType: ej.Ribbon.alignType.columns,
                                content: [{
                                    groups: [
                                        xlObj.XLRibbon._generateSplitBtn("SparklineDesign_Sparkline_EditData", "EditData", "textandimage", xlId + "_Ribbon_SElement", "", "e-icon e-ss-editdata", false, 65, xlObj.XLRibbon._bigBtnHeight, "bottom", ej.ImagePosition.ImageTop, "dropdown", "e-spreadsheet e-sparklineeditdatabtn", "EditData", "EditDataContent")
                                    ]
                                }]
                            },
                            {
                                text: "Type",
                                alignType: ej.Ribbon.alignType.rows,
                                content: [{
                                    groups: [
                                        xlObj.XLRibbon._generateBtn("SparklineDesign_Line", "LineChart", "imageonly", "e-icon e-ss-linesparkline", 30, xlObj.XLRibbon._smallBtnHeight, "LineSparklineTitle", "LineSparklineContent", false, imgtop),
                                        xlObj.XLRibbon._generateBtn("SparklineDesign_Column", "ColumnChart", "imageonly", "e-icon e-ss-columnsparkline", 30, xlObj.XLRibbon._smallBtnHeight, "ColumnSparklineTitle", "ColumnSparklineContent", false, imgtop),
                                        xlObj.XLRibbon._generateBtn("SparklineDesign_Winloss", "Win/Loss Chart", "imageonly", "e-icon e-ss-winlosssparkline", 30, xlObj.XLRibbon._smallBtnHeight, "WinLossSparklineTitle", "WinLossSparklineContent", false, imgtop),
                                    ],
                                },
                                {
                                    groups: [
                                        //xlObj.XLRibbon._generateBtn("SparklineDesign_Area", "AreaChart", "imageonly", "e-icon e-ss-areasparkline", 30, xlObj.XLRibbon._smallBtnHeight, "AreaSparklineTitle", "AreaSparklineContent", false, imgtop),
                                        //xlObj.XLRibbon._generateBtn("SparklineDesign_Pie", "PieChart", "imageonly", "e-icon e-ss-piesparkline", 30, xlObj.XLRibbon._smallBtnHeight, "PieSparklineTitle", "PieSparklineContent", false, imgtop),
                                    ],
                                }]
                            },
                            {
                                text: "Show",
                                alignType: ej.Ribbon.alignType.rows,
                                type: "custom",
                                contentID: xlId + "_Ribbon_SparklineDesign_Show"

                            },
                            {
                                text: "Style",
                                alignType: ej.Ribbon.alignType.columns,
                                content: [{
                                    groups: [
                                        xlObj.XLRibbon._generateSplitBtn("SparklineDesign_Style_SparklineColor", "SparklineColor", "textandimage", xlId + "_Ribbon_SparklineBorder", "", "e-icon e-ss-sparklinecolor", false, 140, xlObj.XLRibbon._mediumBtnHeight, "left", "", "dropdown", "e-ss-pictbrdrbtn", "SparklineColorTitle", "SparklineColorContent"),
                                        xlObj.XLRibbon._generateSplitBtn("SparklineDesign_Style_MarkerColor", "MarkerColor", "textandimage", xlId + "_Ribbon_MarkerColorBorder", "", "e-icon e-ss-markercolor", false, 140, xlObj.XLRibbon._mediumBtnHeight, "left", "", "dropdown", "e-ss-markercolorbtn", "MarkerColor", "MarkerColorContent")
                                    ],
                                }]
                            },

                        ]
                    }]
            };
            return createdObj;
        },

        _sparklineDlgBox: function () {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), dlg = $("#" + xlObj._id + "_SparklineDialog"), sheet = xlObj.getSheet(sheetIdx), dataRnge, range, sparkline;
            info = { sheetIndex: sheetIdx, model: xlObj.model.sheets };
            $("#" + xlObj._id + "_Ribbon_SparklineRange").val("");
            $("#" + xlObj._id + "_Ribbon_SparklineLocation").val("");
            if (sheet._selectedCells.length >= 1) {
                range = sheet.selectedRange;
                sparkline = xlObj.XLEdit.getPropertyValue(xlObj._getSelectedCells().selCells[0].rowIndex, xlObj._getSelectedCells().selCells[0].colIndex, "sparkline");
                if (sparkline)
                    dataRnge = $("#" + xlObj._id + "_Ribbon_SparklineRange").val(xlObj.getSheet(sheetIdx).shapeMngr.sparkline[sparkline].DataRange);
                else
                    dataRnge = $("#" + xlObj._id + "_Ribbon_SparklineRange").val(sheet.sheetInfo.text + "!$" + xlObj._generateHeaderText(range[1] + 1) + "$" + (range[0] + 1) + ":$" + xlObj._generateHeaderText(range[3] + 1) + "$" + (range[2] + 1));
            }
            else if (!xlObj.isUndefined(xlObj.XLEdit.getPropertyValueByElem(xlObj.getActiveCellElem()))) {
                xlObj.selectAll(false);
                $("#" + xlObj._id + "_Ribbon_SparklineRange").val(sheet.sheetInfo.text + "!$" + xlObj._generateHeaderText(sheet._startCell.colIndex + 1) + "$" + (sheet._startCell.rowIndex + 1) + ":$" + xlObj._generateHeaderText(sheet._endCell.colIndex + 1) + "$" + (sheet._endCell.rowIndex + 1));
            }
            dlg.find(".e-ss-changerange").show();
            dlg.data("ejDialog").option("title", xlObj._getLocStr("CreateSparkline"));
            dlg.ejDialog("open");
        },

        _sparklinDesignDlg: function () {
            var xlObj = this.XLObj;
            $('#' + xlObj._id + '_sparklinedesigndlg').ejDialog('open');
        },

        _renderSparklineDesignDlg: function () {
            var htmlstr, xlObj = this.XLObj, datarange = xlObj._getLocStr('SelectDataSource');
            htmlstr = '<div id=' + xlObj._id + '_sparklinedesigndlg><div class="e-dlg-fields e-dlgctndiv"><table cellspacing="0" cellpadding="0"><tr><td>' + datarange + '</td></tr><tr><td style="padding-top: 11px;"><input id="' + xlObj._id + '_datarange" class="e-ss-changerange" style="width: 100%;"/></td><tr class="e-dlgtd-fields"><td></td></tr></table></div><div class="e-dlg-btnfields"><div class="e-dlg-btnctnr"><button id=' + xlObj._id + '_sparklinedesigndlgok>' + xlObj._getLocStr('Ok') + '</button><button id=' + xlObj._id + '_sparklinedesigndlgcancel>' + xlObj._getLocStr('Cancel') + '</button></div></div></div>'
            xlObj.element.append(htmlstr);
            $("#" + xlObj._id + "_datarange").data("parentID",xlObj._id);
            $("#" + xlObj._id + "_datarange").wrap("<form id='" + xlObj._id + "_Form_datarange' onsubmit='return false'></form>");
            xlObj.XLRibbon._dialogValidate("_datarange");
            $('#' + xlObj._id + '_sparklinedesigndlgok').ejButton({ showRoundedCorner: true, width: "20%", click: $.proxy(this._dlgSparklineDesignOk, this) });
            $('#' + xlObj._id + '_sparklinedesigndlgcancel').ejButton({ showRoundedCorner: true, width: "20%", click: $.proxy(this._dlgSparklineDesignCancel, this) });
            $('#' + xlObj._id + '_sparklinedesigndlg').ejDialog({ showOnInit: false, width: "auto", showRoundedCorner: true, title: xlObj._getLocStr('EditSingleSparklineData'), enableModal: true, enableResize: false, cssClass: "e-ss-dialog e-" + xlObj._id + "-dlg", close: ej.proxy(this._dialogClose, this) });
        },

        _renderBaseElem: function (cellInfo, type, rowIndex, colIndex, sheetIdx) {
            var xlObj = this.XLObj, div;
            div = $("<div id='" + xlObj._id + "_" + "S" + sheetIdx + "_" + type + "_" + rowIndex + "_" + colIndex + "' class='e-ss-sparkline'  style='top:" + cellInfo.top + "px; left:" + cellInfo.left + "px; height:" + (cellInfo.height - 1) + "px; width:" + cellInfo.width + "px;'></div>");
            div.data("parentID", xlObj._id);
            xlObj.getCell(this.rowIdx, this.colIdx).prepend(div);
            xlObj._selectActiveCell(this.rowIdx, this.colIdx);
            return div;
        },
        _sparklineElementTag: function () {
            var xlObj = this.XLObj, element = '<ul id=' + xlObj._id + '_Ribbon_SElement class="selement" style="width: 17%">';
            element += '<li class="editgrouplocation" id="EditGroupLocation"><a><span id="editsparkline" class="e-ss-editdatasparkline" style= margin-top:"0px";></span>' + xlObj._getLocStr("EditDataContent") + '</a><li>';
            element += '<li class="editsinglesparklinedata" id="EditSingleSparklineData"><a>' + xlObj._getLocStr("EditSingleSparklineData") + '</a><li>';
            return element;
        },
        _sparklineColor: function () {
            var xlObj = this.XLObj;
            return "<ul id=" + xlObj._id + "_Ribbon_SparklineBorder style='width:16%'><li id='" + xlObj._id + "sparklinecolor'><input id='" + xlObj._id + "_Ribbon_SparklineColor' style='display:none; width: 18%'></input></li></ul>";
        },
        _markerColor: function () {
            var xlObj = this.XLObj;
            return "<ul id=" + xlObj._id + "_Ribbon_MarkerColorBorder style='display:none' class='e-ss-pictureborder'><li id='" + xlObj._id + "MarkerNegativePoint'><a>" + xlObj._getLocStr("NegativePoints") + "</a><ul><li><input id='" + xlObj._id + "_Ribbon_MarkerNegativePoint'></input></li></ul></li><li id='" + xlObj._id + "MarkerHighPoint'><a>" + xlObj._getLocStr("HighPoint") + "</a><ul><li><input id='" + xlObj._id + "_Ribbon_MarkerHighPoint'></input></li></ul></li><li id='" + xlObj._id + "MarkerLowPoint'><a>" + xlObj._getLocStr("LowPoint") + "</a><ul><li><input id='" + xlObj._id + "_Ribbon_MarkerLowPoint'></input></li></ul></li></ul>";
        },
        _renderSparklineTab: function () {
            var xlObj = this.XLObj, xlEle = xlObj.element, xlId = xlObj._id, fontStr = xlId + "_Ribbon_SparklineDesign_Sparkline_", rbnId = xlId + "_Ribbon", htmlstr = '', groupId = xlObj._id + "_Ribbon_SparklineDesign_Show";
            xlEle.append(this._sparklineElementTag());
            xlEle.append(this._sparklineColor());
            xlEle.append(this._markerColor());
            htmlstr = '<div id=' + groupId + '><div class="e-tablestyleoptionsrow"><div class="e-sparklinedesignshowcell"><input id=' + groupId + '_HighPoint type="checkbox" /><label class="e-tablestyleoptionslabel" for="' + groupId + '_HighPoint">' + xlObj._getLocStr('HighPoint') + '</label></div><div class="e-sparklinedesignshowcell"><input id=' + groupId + '_FirstPoint type="checkbox"/><label class="e-tablestyleoptionslabel" for="' + groupId + '_FirstPoint">' + xlObj._getLocStr('FirstPoint') + '</label></div></div><div class="e-tablestyleoptionsrow"><div class="e-sparklinedesignshowcell"><input id=' + groupId + '_LowPoint type="checkbox"/><label class="e-tablestyleoptionslabel" for="' + groupId + '_LowPoint">' + xlObj._getLocStr('LowPoint') + '</label></div><div class="e-sparklinedesignshowcell"><input id=' + groupId + '_LastPoint type="checkbox"/><label class="e-tablestyleoptionslabel" for="' + groupId + '_LastPoint">' + xlObj._getLocStr('LastPoint') + '</label></div></div><div class="e-tablestyleoptionsrow"><div class="e-sparklinedesignshowcell"><input id=' + groupId + '_NegativePoints type="checkbox"/><label class="e-tablestyleoptionslabel" for="' + groupId + '_NegativePoints">' + xlObj._getLocStr('NegativePoint') + '</label></div><div id= "markers" class="e-sparklinedesignshowcell"><input id=' + groupId + '_Markers type="checkbox" /><label class="e-tablestyleoptionslabel" for="' + groupId + '_Markers">' + xlObj._getLocStr('Markers') + '</label></div></div>';
            xlObj.element.append(htmlstr);
            $("#" + groupId + "_HighPoint").ejCheckBox({ change: xlObj.XLRibbon._ribbonClickHandler });
            $("#" + groupId + "_FirstPoint").ejCheckBox({ change: xlObj.XLRibbon._ribbonClickHandler });
            $("#" + groupId + "_LowPoint").ejCheckBox({ change: xlObj.XLRibbon._ribbonClickHandler });
            $("#" + groupId + "_LastPoint").ejCheckBox({ change: xlObj.XLRibbon._ribbonClickHandler });
            $("#" + groupId + "_NegativePoints").ejCheckBox({ change: xlObj.XLRibbon._ribbonClickHandler });
            $("#" + groupId + "_Markers").ejCheckBox({ change: xlObj.XLRibbon._ribbonClickHandler });
            $("#" + rbnId + "_SparklineColor").ejColorPicker({ modelType: "palette", presetType: "basic", cssClass: "e-ss-colorpicker e-ss-menuclrpkr", open: $.proxy(xlObj.XLRibbon._colorPickerHandler, this, "Ribbon_SparklineDesign_Style_SparklineColor"), change: xlObj.XLRibbon._ribbonClickHandler });
            $("#" + rbnId + "_SparklineColor_popup").css({ "display": "block", "height": "135px" });
            $("#" + xlObj._id + "sparklinecolor").append($("#" + rbnId + "_SparklineColor_popup"));
            $("#" + rbnId + "_SparklineColorWrapper").hide();
            $("#" + rbnId + "_MarkerNegativePoint").ejColorPicker({ modelType: "palette", presetType: "basic", cssClass: "e-ss-colorpicker e-ss-menuclrpkr", change: xlObj.XLRibbon._ribbonClickHandler });
            $("#" + rbnId + "_MarkerNegativePoint_popup").css({ "display": "block", "height": "135px" });
            $("#" + xlObj._id + "MarkerNegativePoint ul li").append($("#" + rbnId + "_MarkerNegativePoint_popup"));
            $("#" + rbnId + "_MarkerNegativePointWrapper").hide();
            $("#" + rbnId + "_MarkerHighPoint").ejColorPicker({ modelType: "palette", presetType: "basic", cssClass: "e-ss-colorpicker e-ss-menuclrpkr", change: xlObj.XLRibbon._ribbonClickHandler });
            $("#" + rbnId + "_MarkerHighPoint_popup").css({ "display": "block", "height": "135px" });
            $("#" + xlObj._id + "MarkerHighPoint ul li").append($("#" + rbnId + "_MarkerHighPoint_popup"));
            $("#" + rbnId + "_MarkerHighPointWrapper").hide();
            $("#" + rbnId + "_MarkerLowPoint").ejColorPicker({ modelType: "palette", presetType: "basic", cssClass: "e-ss-colorpicker e-ss-menuclrpkr", change: xlObj.XLRibbon._ribbonClickHandler });
            $("#" + rbnId + "_MarkerLowPoint_popup").css({ "display": "block", "height": "135px" });
            $("#" + xlObj._id + "MarkerLowPoint ul li").append($("#" + rbnId + "_MarkerLowPoint_popup"));
            $("#" + rbnId + "_MarkerLowPointWrapper").hide();
        },

        _sparklineDesignTabUpdate: function (sparklineId) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(xlObj.getActiveSheetIndex()), xlId = xlObj._id, sparkline;
            sparkline = sheet.shapeMngr.sparkline;
             if (xlObj.model.showRibbon) {
                var rObj = $("#" + xlObj._id + '_Ribbon').data('ejRibbon');
                rObj.showTab(xlObj._getLocStr("SPARKLINEDESIGN"));
                if (!rObj._isCollapsed)
                    rObj.option({ selectedItemIndex: xlObj.XLRibbon._getTabIndex("sparklinedesign") });
                if(sparkline[sparklineId].type =="Winloss") {
                    $("#" + xlId + "_Ribbon_SparklineDesign_Show_FirstPoint").ejCheckBox({enabled: false});
                    $("#" + xlId + "_Ribbon_SparklineDesign_Show_LastPoint").ejCheckBox({enabled: false});
                    $("#" + xlId + "_Ribbon_SparklineDesign_Show_HighPoint").ejCheckBox({enabled: false});
                    $("#" + xlId + "_Ribbon_SparklineDesign_Show_LowPoint").ejCheckBox({enabled: false});
                    $("#" + xlId + "_Ribbon_SparklineDesign_Show_NegativePoints").ejCheckBox({enabled: false});
                    $("#" + xlId + "_Ribbon_SparklineDesign_Show_Markers").ejCheckBox({enabled: false});
                    xlObj.element.find("#" + xlObj._id  + "_Ribbon_sparklinedesign_Style_SparklineDesign_Style_MarkerColor").hide();
                }
                else {
                    $("#" + xlId + "_Ribbon_SparklineDesign_Show_FirstPoint").ejCheckBox({enabled: true});
                    $("#" + xlId + "_Ribbon_SparklineDesign_Show_LastPoint").ejCheckBox({enabled: true});
                    $("#" + xlId + "_Ribbon_SparklineDesign_Show_HighPoint").ejCheckBox({enabled: true});
                    $("#" + xlId + "_Ribbon_SparklineDesign_Show_LowPoint").ejCheckBox({enabled: true});
                    $("#" + xlId + "_Ribbon_SparklineDesign_Show_NegativePoints").ejCheckBox({enabled: true});
                    $("#" + xlId + "_Ribbon_SparklineDesign_Show_Markers").ejCheckBox({enabled: true});
                    xlObj.element.find("#" + xlObj._id +  "_Ribbon_sparklinedesign_Style_SparklineDesign_Style_MarkerColor").show();
                }
              if((sparkline[sparklineId].type =="Column") || (sparkline[sparklineId].type =="Winloss"))
                    xlObj.element.find("#" + "markers").hide();
                else
                    xlObj.element.find("#" + "markers").show();
                xlObj.XLRibbon._isSetModel = true;
                $("#" + xlId + "_Ribbon_SparklineDesign_Show_FirstPoint").data("ejCheckBox").option({ checked: sparkline[sparklineId]["FirstPoint"] ? true : false });
                $("#" + xlId + "_Ribbon_SparklineDesign_Show_LastPoint").data("ejCheckBox").option({ checked: sparkline[sparklineId]["LastPoint"] ? true : false });
                $("#" + xlId + "_Ribbon_SparklineDesign_Show_HighPoint").data("ejCheckBox").option({ checked: sparkline[sparklineId]["HighPoint"] ? true : false });
                $("#" + xlId + "_Ribbon_SparklineDesign_Show_LowPoint").data("ejCheckBox").option({ checked: sparkline[sparklineId]["LowPoint"] ? true : false });
                $("#" + xlId + "_Ribbon_SparklineDesign_Show_NegativePoints").data("ejCheckBox").option({ checked: sparkline[sparklineId]["NegativePoints"] ? true : false });
                $("#" + xlId + "_Ribbon_SparklineDesign_Show_Markers").length && $("#" + xlId + "_Ribbon_SparklineDesign_Show_Markers").data("ejCheckBox").option({ checked: sparkline[sparklineId]["Markers"] ? true : false });
                xlObj.XLRibbon._isSetModel = false;
            }
        },
        _toggleSparklineDesignTab: function () {
            var xlObj = this.XLObj;
            xlObj.XLRibbon._toggleContextualTab(xlObj._getLocStr("SPARKLINEDESIGN"));
        },
        _undoForSparkline: function (val) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(val.sheetIndex), dataContainer = xlObj._dataContainer, sparklineObj = sheet.shapeMngr.sparkline; 
				sparklineElem = xlObj._getContent(val.sheetIndex).find("#" + val.id);
            switch (val.action) {
                case "create":
                    var sparklineDiv = sparklineElem;
                    sparkline = xlObj.XLEdit.getPropertyValue(val.rowIndex, val.colIndex, "sparkline");
                    if (sparkline) {
                        sparklineDiv.remove();
                        if (sparklineObj == sparklineDiv[0].id)
                            delete sparklineObj[sparklineDiv[0].id];
                        delete sparklineObj[val.id];
                        delete dataContainer.sheets[val.sheetIndex][val.rowIndex][val.colIndex];
                    }
                    val.action = "remove";
                    break;
                case "sparklinehighpoint":
                    if (xlObj._isUndo)
                        sparklineElem.ejSparkline({ highPointColor: val.prev["sparklinehighpoint"] });
                    else {
                        sparklineElem.ejSparkline({ highPointColor: val.sparklinehighpoint });
                        sparklineObj[val.id]["HighPoint"] = true;
                        sparklineObj[val.id]["highPointColor"] = val.sparklinehighpoint;
                    }
                    break;
                case "sparklinenegativepoint":
                    if (xlObj._isUndo)
                        sparklineElem.ejSparkline({ negativePointColor: val.prev["sparklinenegativepoint"] });
                    else {
                        sparklineElem.ejSparkline({ negativePointColor: val.sparklinenegativepoint });
                        sparklineObj[val.id]["NegativePoints"] = true;
                        sparklineObj[val.id]["negativePointColor"] = val.sparklinehighpoint;
                    }
                    break;
                case "sparklinelowpoint":
                    if (xlObj._isUndo)
                        sparklineElem.ejSparkline({ lowPointColor: val.prev["sparklinelowpoint"] });
                    else {
                        sparklineElem.ejSparkline({ lowPointColor: val.sparklinelowpoint });
                        sparklineObj[val.id]["LowPoint"] = true;
                        sparklineObj[val.id]["lowPointColor"] = val.sparklinelowpoint;
                    }
                    break;
                case "sparklinefirstpoint":
                    if (xlObj._isUndo)
                        sparklineElem.ejSparkline({ startPointColor: val.prev["sparklinefirstpoint"] });
                    else {
                        sparklineElem.ejSparkline({ startPointColor: val.sparklinefirstpoint });
                        sparklineObj[val.id]["FirstPoint"] = true;
                        sparklineObj[val.id]["startPointColor"] = val.sparklinefirstpoint;
                    }
                    break;
                case "sparklinelastpoint":
                    if (xlObj._isUndo)
                        sparklineElem.ejSparkline({ endPointColor: val.prev["sparklinelastpoint"] });
                    else {
                        sparklineElem.ejSparkline({ endPointColor: val.sparklinelastpoint });
                        sparklineObj[val.id]["LastPoint"] = true;
                        sparklineObj[val.id]["endPointColor"] = val.sparklinelastpoint;
                    }
                    break;
                case "sparklinetype":
                    xlObj._isUndo ?  this.changeType(val.id, val.prev["sparklineType"], val.sheetIndex) :  this.changeType(val.prev["sparklineId"], val.sparklineType, val.sheetIndex);
                    break;
                case "sparklinecolor":
                    if (xlObj._isUndo)
                        sparklineElem.ejSparkline({ fill: val.prev["sColor"] });
                    else {
                        sparklineElem.ejSparkline({ fill: val.sColor });
                        sparklineObj[val.id]["sparklineColor"] = true;
                        sparklineObj[val.id]["sparklineColor"] = val.sColor;
                    }
                    break;
                case "remove":
                    this.createSparkline(val.DataRange, val.LocationRange, val.sparklineType, { highPointColor: val.highPointColor, lowPointColor: val.lowPointColor, NegativePointColor: val.NegativePointColor, startPointColor: val.startPointColor, endPointColor: val.endPointColor });
                    val.action = "create";
                    break;
				case "markerSettings":
					if(val.isVisible) {
						sparklineObj[val.id]["Markers"] = true;
						sparklineObj[val.id]["markerSettings"] = { visible: true };
						sparklineElem.ejSparkline({ markerSettings: {visible: true } });
					}
					else {
						sparklineObj[val.id]["Markers"] = false;
						sparklineObj[val.id]["markerSettings"] = { visible: false };
						sparklineElem.ejSparkline({ markerSettings: {visible: null } });
					}
					val.isVisible = !val.isVisible;
					break;
            }
        },
        changeType: function (sparklineId, type, sheetIdx) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), details, sparkline,sparklineProp,
            sparklineElem = xlObj._getContent(sheetIdx).find("#" + sparklineId);
            sparklineProp = sheet.shapeMngr.sparkline[sparklineId];
            sparklineElem.remove();
            delete xlObj._dataContainer.sheets[sheetIdx][sparklineProp.rowIndex][sparklineProp.colIndex];
            sparklineProp.type = type;
            sparklineProp.id = xlObj._id + "_" + "S" + sheetIdx +"_" + type +"_"+ sparklineProp.rowIndex +"_"+sparklineProp.colIndex;
            this._createSparkline(sparklineProp, sparklineProp.cellInfo, sheetIdx);
            delete sheet.shapeMngr.sparkline[sparklineId];
            xlObj.XLShape._updateShapeMngr({ rowIndex: sparklineProp.rowIndex, colIndex: sparklineProp.colIndex }, { "sparkline": sparklineProp }, "sparkline");
            details = { sheetIndex: sheetIdx, reqType: "sparkline", action: "sparklinetype", id: sparklineProp.id , cellInfo: sparklineProp.cellInfo, rowIndex: sparklineProp.rowIndex, colIndex:sparklineProp.colIndex, dataSource: sparklineProp.dataSource};
            details.prev = { sparklineType: sparklineProp["sparklineType"], sparklineId : sparklineId };
            details.sparklineType = type;
            xlObj._completeAction(details);
            xlObj._trigActionComplete(details);
        },

        changePointColor: function (sparklineId, options, sheetIdx, isChecked) {
            var xlObj = this.XLObj, sheetIdx = sheetIdx || xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), details, sparkline, 
				sparklineElem = xlObj._getContent(sheetIdx).find("#" + sparklineId), checkboxStatus, selColor;
            sparkline = sheet.shapeMngr.sparkline;
            for (option in options)
                val = options[option];
            switch (option) {
                case "highPointColor":
                    details = { sheetIndex: sheetIdx, reqType: "sparkline", action: "sparklinehighpoint", id: sparklineId };
                    details.prev = (sparkline[sparklineId].type.toLowerCase() == "line") ? { sparklinehighpoint: sparklineElem.data('ejSparkline').model.stroke } : { sparklinehighpoint: sparkline[sparklineId][option] };
					if(isChecked) {
						sparkline[sparklineId]["HighPoint"] = true;
						sparkline[sparklineId]["highPointColor"] = val;
					}
					else {
						delete sparkline[sparklineId]["HighPoint"];
						delete sparkline[sparklineId]["highPointColor"];
						options = { highPointColor: null };
					}					
                    sparklineElem.ejSparkline(options);
                    details.sparklinehighpoint = val;
                    break;
                case "lowPointColor":
                    details = { sheetIndex: sheetIdx, reqType: "sparkline", action: "sparklinelowpoint", id: sparklineId };
                    details.prev = (sparkline[sparklineId].type.toLowerCase() == "line") ? { sparklinelowpoint: sparklineElem.data('ejSparkline').model.stroke } : { sparklinelowpoint: sparkline[sparklineId][option] };
                    if(isChecked) {
						sparkline[sparklineId]["LowPoint"] = true;
						sparkline[sparklineId]["lowPointColor"] = val;
                    }
					else {
                        delete sparkline[sparklineId]["LowPoint"];
                        delete sparkline[sparklineId]["lowPointColor"];
                        options = { lowPointColor: null };
                    }
					sparklineElem.ejSparkline(options);
                    details.sparklinelowpoint = val;
                    break;

                case "startPointColor":
                    details = { sheetIndex: sheetIdx, reqType: "sparkline", action: "sparklinefirstpoint", id: sparklineId };
                    details.prev = { sparklinefirstpoint:  sparklineElem.data('ejSparkline').model.stroke };
					if(isChecked) {
						sparkline[sparklineId]["FirstPoint"] = true;
						sparkline[sparklineId]["startPointColor"] = val;
					}
					else {
						delete sparkline[sparklineId]["FirstPoint"];
                        delete sparkline[sparklineId]["startPointColor"];
                        options = { startPointColor: null };
					}
                    sparklineElem.ejSparkline(options);                   
                    details.sparklinefirstpoint = val;
                    break;

                case "endPointColor":
                    details = { sheetIndex: sheetIdx, reqType: "sparkline", action: "sparklinelastpoint", id: sparklineId };
                    details.prev = { sparklinelastpoint:  sparklineElem.data('ejSparkline').model.stroke };
					if(isChecked) {
						sparkline[sparklineId]["LastPoint"] = true;
						sparkline[sparklineId]["endPointColor"] = val;
					}
					else {
						delete sparkline[sparklineId]["LastPoint"];
                        delete sparkline[sparklineId]["endPointColor"];
                        options = { endPointColor: null };
					}
                    sparklineElem.ejSparkline(options);
                    details.sparklinelastpoint = val;
                    break;

                case "negativePointColor":
                    details = { sheetIndex: sheetIdx, reqType: "sparkline", action: "sparklinenegativepoint", id: sparklineId };
                    details.prev = (sparkline[sparklineId].type.toLowerCase() == "line") ? { sparklinenegativepoint: sparklineElem.data('ejSparkline').model.stroke } : { sparklinenegativepoint: sparkline[sparklineId][option] };
					if(isChecked) {
	                    sparkline[sparklineId]["NegativePoints"] = true;
						sparkline[sparklineId]["negativePointColor"] = val;
					}
					else {
						delete sparkline[sparklineId]["NegativePoints"];
                        delete sparkline[sparklineId]["negativePointColor"];
                        options = { negativePointColor: null };
					}
                    sparklineElem.ejSparkline(options);
                    details.sparklinenegativepoint = val;
                    break;

                case "fill":
                    sparkline[sparklineId]["sparklinecolor"] = true;
                    details = { sheetIndex: sheetIdx, reqType: "sparkline", action: "sparklinecolor", id: sparklineId };
                    details.sColor = val;
                    if(sparkline[sparklineId].type.toLowerCase() == "line") {
						sparkline[sparklineId]["stroke"] = val;
						details.prev = { sColor: sparklineElem.data('ejSparkline').model.stroke };
						sparklineElem.ejSparkline("option", { stroke: val });
					}
					else {
						sparkline[sparklineId][option] = val;
						details.prev = { sColor: sparklineElem.data('ejSparkline').model.fill };
						sparklineElem.ejSparkline("option", { fill: val });
					}
                    break;
				case "markerSettings":
					var visibleProp;
                    details = { sheetIndex: sheetIdx, reqType: "sparkline", action: "markerSettings", id: sparklineId, isVisible: sparkline[sparklineId]["Markers"] };
					if (sparkline[sparklineId].type == "Line") {
                        if (isChecked) {
							visibleProp = { visible: true };
                            $("#" + sparklineId).ejSparkline("option", { markerSettings: { visible: true } });
                            sparkline[sparklineId]["Markers"] = true;
                        }
                        else {
							visibleProp = { visible: false };
                            $("#" + sparklineId).ejSparkline("option", { markerSettings: { visible: null } });
                            sparkline[sparklineId]["Markers"] = false;
                        }
                        sparkline[sparklineId]["markerSettings"] = visibleProp;
                    }
					break;
            }
			xlObj._completeAction(details);
            xlObj._trigActionComplete(details);
        },

        _sparklineResize: function (sparklineId, option, sheetIdx) {
            var xlObj = this.XLObj, sparklineObj, shapeManager, sparklineElem =  xlObj._getContent(sheetIdx).find("#" + sparklineId);
			sparklineElem.css(option);
            sparklineObj = sparklineElem.data("ejSparkline");
            sparklineObj.model.size = option;
            sparklineObj.resize();
            shapeManager = xlObj.getSheet(sheetIdx).shapeMngr.sparkline;
            shapeManager[sparklineId].cellInfo.width = option.width
            shapeManager[sparklineId].cellInfo.height = option.height;
        },
		
        _clearSparkline: function (classes) {
            var xlObj = this.XLObj;
            xlObj.XLSelection._clearBorder(classes);
            xlObj.getSheet(xlObj.getActiveSheetIndex())._isSparklineBorder = false;
        },
		
        refreshSparkline: function (rowIdx, colIdx, sheetIdx) {
           var xlObj = this.XLObj, sparkline, sparklineStr = false, dataSource, arr = [],range, dataValue, i, sparklineProp, sheetCnt = 1, cnt = xlObj.model.sheetCount + 1;
            while (sheetCnt < cnt) {
                sparkline = xlObj.getSheet(sheetCnt).shapeMngr.sparkline;
                i = xlObj.getObjectLength(sparkline);
                if (i) {
                    while (i--) {
                        sparklineProp = sparkline[xlObj.getObjectKeys(sparkline)[i]];
						range = xlObj.getRangeIndices(sparklineProp.DataRange);
                        if ((sheetCnt === sheetIdx) && (this.XLObj.inRange(range, rowIdx, colIdx))) {                            
                            dataValue = xlObj.getRangeData({ range: range, valueOnly: true, sheetIdx: sparklineProp.sheetIndex, skipFormula: true });
                            for (j = 0, len = dataValue.length; j < len; j++) {
                                dataSource = dataValue[j];
                                if (dataSource == "")
                                    dataValue[j] = 0;
                                else if (typeof dataSource === "string") {
                                    sparklineStr = true;
                                    break;
                                }
                            }
                            if (sparklineStr) {
                                xlObj._showAlertDlg("Alert", "SparklineDataAlert", 630);
                                sparklineStr = false;
                            }
                            else {
                                xlObj._getContent(sheetIdx).find("#" + sparklineProp.id).ejSparkline({ dataSource: dataValue });
                                sparklineProp.dataSource = dataValue;
                            }
                        }
                    }
                }
                sheetCnt++;
            }
        },
		
		_refreshContentWithSparkline: function(sheetIdx) {
			var xlObj = this.XLObj, orgSparkline = xlObj.getSheet(sheetIdx).shapeMngr.sparkline, i, sparklineProp, len, cellInfo, sparklineColl = {},
				dupSparkline = $.extend(true, {}, xlObj.getSheet(sheetIdx).shapeMngr.sparkline), sparklineObj = xlObj.getObjectKeys(dupSparkline);
			var splitId, newId;
			for (i = 0, len = sparklineObj.length; i < len; i++) {
				sparklineProp = dupSparkline[sparklineObj[i]];
				if(xlObj._copySheet) {
					delete xlObj.getSheet(sheetIdx).shapeMngr.sparkline[sparklineObj[i]];
					splitId = sparklineObj[i].replace(xlObj._id, "").split("_");
					splitId[0] = xlObj._id;
					splitId[1] = "S" + sheetIdx;
					newId = splitId.join("_");
					sparklineProp["id"] = newId;
					sparklineColl[newId] = sparklineProp;
					xlObj._dataContainer.sheets[sheetIdx][sparklineProp.rowIndex][sparklineProp.colIndex]["sparkline"] = [newId];
				}
				if(xlObj._isRowViewable(sheetIdx, sparklineProp.rowIndex)) {
					if(!xlObj._getContent(sheetIdx).find("#" + sparklineProp["id"]).length) {
						cellInfo = xlObj._getCellInfo({ rowIndex: sparklineProp.rowIndex, colIndex: sparklineProp.colIndex }, sheetIdx)
						this._createSparkline(sparklineProp, cellInfo, sheetIdx);
					}
				}
			}
			if(xlObj._copySheet) 
				xlObj.getSheet(sheetIdx).shapeMngr.sparkline = sparklineColl;
		},
		
		_renderSparklineContent: function(table, sheetIdx) {
			var xlObj = this.XLObj, sparkline = xlObj.getSheet(sheetIdx).shapeMngr.sparkline, sparklineObj = xlObj.getObjectKeys(sparkline), cell, sparkDiv,
				rowIndex, colIndex;
			for (i = 0, len = sparklineObj.length; i < len; i++) {
				sparklineProp = sparkline[sparklineObj[i]];
				rowIndex = sparklineProp.rowIndex;
				colIndex = sparklineProp.colIndex;
				cell = table.rows[rowIndex].cells[colIndex];
				sparkDiv = $("<div id='" + xlObj._id + "_" + "S" + sheetIdx + "_" + sparklineProp.type + "_" + rowIndex + "_" + colIndex + "' class='e-ss-sparkline'  style='height:" + (sparklineProp.height - 1) + "px; width:" + sparklineProp.width + "px;' ></div>");
				$(cell).append(sparkDiv);
				$(table).find("#" + sparkDiv[0].id).ejSparkline(sparklineProp);
			}
		},
		
		_refreshSparklinePos: function (startCell, sheetIdx) {
            var i, len, cellInfo, xlObj = this.XLObj, sheetIdx = sheetIdx || xlObj._getSheetIndex(sheetIdx), 
				sheet = xlObj.getSheet(sheetIdx), sparklineColl = xlObj._getContent(sheetIdx).find(".e-ss-sparkline");
            startCell = startCell || {};
            for (i = 0, len = sparklineColl.length; i < len; i++) {
                sparklineCell = $(sparklineColl[i]);
				cellIdx = xlObj._getCellIdx($(sparklineCell[0]).parents('td')[0]);
                if ((cellIdx.rowIndex < startCell.rowIndex) || (cellIdx.colIndex < startCell.colIndex))
                    continue;
				cellInfo = xlObj._getCellInfo({ rowIndex: cellIdx.rowIndex, colIndex: cellIdx.colIndex }, sheetIdx);                   
                sparklineCell.css({ "top": cellInfo.top + "px", "left": cellInfo.left + "px" });
            }
        },
		
		_refreshSparklineForInsDel: function(rowIdx, colIdx, count, action, operation, sheetIdx) {
			var xlObj = this.XLObj, sparklineProp, oldSparklineId, newSparklineId;
			if(xlObj._checkIndicesInContainer(sheetIdx, rowIdx, colIdx, "sparkline")) {
				oldSparklineId = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "sparkline", sheetIdx)[0];
				sparklineProp = $.extend(true, {}, xlObj.getSheet(sheetIdx).shapeMngr.sparkline[oldSparklineId])
				newSparklineId = oldSparklineId.replace(xlObj._id, "").split("_");				
				if(action === "row")
					newSparklineId[3] = (operation === "insert") ? parseInt(newSparklineId[3]) + count : parseInt(newSparklineId[3]) - count;
				else
					newSparklineId[4] = (operation === "insert") ? parseInt(newSparklineId[4]) + count : parseInt(newSparklineId[4]) - count;
				newSparklineId[0] = xlObj._id;
				newSparklineId = newSparklineId.join("_");
				sparklineProp["id"] = newSparklineId;
				sparklineProp["rowIndex"] = rowIdx;
				sparklineProp["colIndex"] = colIdx;	
				delete xlObj.getSheet(sheetIdx).shapeMngr.sparkline[oldSparklineId];
				xlObj.getSheet(sheetIdx).shapeMngr.sparkline[newSparklineId] = sparklineProp;
				xlObj._dataContainer.sheets[sheetIdx][rowIdx][colIdx]["sparkline"] = [newSparklineId];		
			}		
		},
		
		_refreshSparklineClipboard: function(rowIdx, colIdx, pastesheetIdx, copySheetIdx, isCopy) {
			var xlObj = this.XLObj, copySparklineId = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "sparkline", pastesheetIdx)[0], 
				sparklineProp = $.extend(true, {}, xlObj.getSheet(copySheetIdx).shapeMngr.sparkline[copySparklineId]);
			if(xlObj.XLClipboard._copyBackup["sparkline"] && xlObj.XLClipboard._copyBackup["sparkline"][copySparklineId])
				sparklineProp = xlObj.XLClipboard._copyBackup["sparkline"][copySparklineId];
			else
				sparklineProp = $.extend(true, {}, xlObj.getSheet(copySheetIdx).shapeMngr.sparkline[copySparklineId]);
			pasteSparkleneId = copySparklineId.replace(xlObj._id, "").split("_");
			pasteSparkleneId[0] = xlObj._id;
			pasteSparkleneId[1] = "S" + pastesheetIdx;
			pasteSparkleneId[3] = rowIdx;
			pasteSparkleneId[4] = colIdx;
			pasteSparkleneId = pasteSparkleneId.join("_");
			sparklineProp["id"] = pasteSparkleneId;
			sparklineProp["rowIndex"] = rowIdx;
			sparklineProp["colIndex"] = colIdx;
			xlObj.getSheet(pastesheetIdx).shapeMngr.sparkline[pasteSparkleneId] = sparklineProp;
			xlObj._dataContainer.sheets[pastesheetIdx][rowIdx][colIdx]["sparkline"] = [pasteSparkleneId];
			if(xlObj._isRowViewable(pastesheetIdx, rowIdx)) {
				if(!xlObj._getContent(pastesheetIdx).find("#" + pasteSparkleneId).length) {
					cellInfo = xlObj._getCellInfo({ rowIndex: rowIdx, colIndex: colIdx }, pastesheetIdx)
					this._createSparkline(sparklineProp, cellInfo, pastesheetIdx);
				}
			}
			if(!isCopy) {
				delete xlObj.getSheet(copySheetIdx).shapeMngr.sparkline[copySparklineId];
			}
		},
		_removeSparklineElem: function(rowIdx, colIdx, sheetIdx, isConainerClear) {
			var xlObj = this.XLObj, sparklineId = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "sparkline", sheetIdx), sparklineElem, shapeMngr = xlObj.getSheet(sheetIdx).shapeMngr.sparkline, sparkline ,details;
			if(sparklineId) {
				sparklineId = sparklineId[0];
                sparkline = shapeMngr[sparklineId];
				sparklineElem = xlObj._getContent(sheetIdx).find("#" + sparklineId);
				sparklineElem.ejSparkline("destroy");
				this._wireSparklineEvents("_off");
                details = { sheetIndex: sheetIdx, reqType: "sparkline", shapeType: "sparkline", action: "remove" };
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
				sparklineElem.remove();
				if(isConainerClear) {
					delete xlObj._dataContainer.sheets[sheetIdx][rowIdx][colIdx]["sparkline"];
					delete xlObj.getSheet(sheetIdx).shapeMngr.sparkline[sparklineId];
				}
			}
		},
		
		_wireSparklineEvents: function(action) {
			var xlObj = this.XLObj, elem = xlObj.element;
			xlObj[action](elem, ($.isFunction($.fn.doubletap) && (xlObj.model.enableTouch && (parseInt(xlObj._browserDetails.version) > 8)) && !xlObj._browserDetails.isMSPointerEnabled) ? "doubletap" : "dblclick", ".e-ss-sparkline", xlObj._dblClickHandler);
			xlObj[action]($("#svg"), ($.isFunction($.fn.doubletap) && (xlObj.model.enableTouch && (parseInt(xlObj._browserDetails.version) > 8)) && !xlObj._browserDetails.isMSPointerEnabled) ? "doubletap" : "dblclick", xlObj._dblClickHandler);
			xlObj[action]($("#rect"), ($.isFunction($.fn.doubletap) && (xlObj.model.enableTouch && (parseInt(xlObj._browserDetails.version) > 8)) && !xlObj._browserDetails.isMSPointerEnabled) ? "doubletap" : "dblclick", xlObj._dblClickHandler);
			xlObj[action]($("#path"), ($.isFunction($.fn.doubletap) && (xlObj.model.enableTouch && (parseInt(xlObj._browserDetails.version) > 8)) && !xlObj._browserDetails.isMSPointerEnabled) ? "doubletap" : "dblclick", xlObj._dblClickHandler);
			xlObj[action]($("#circle"), ($.isFunction($.fn.doubletap) && (xlObj.model.enableTouch && (parseInt(xlObj._browserDetails.version) > 8)) && !xlObj._browserDetails.isMSPointerEnabled) ? "doubletap" : "dblclick", xlObj._dblClickHandler);
		}
    }
})(jQuery, Syncfusion)