(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.clipboard = function (obj) {
        this.XLObj = obj;
        this._cutCells = [];
        this._copyCells = [];
        this._copyBackup = {};
        this._cData = "";
        this._isCut = false;
        this._copyRange = [];
        this._isSpecial = !obj.isPasteValuesOnly;
        this._isShape = false;
        this._copyRnge = {};
    };

    ej.spreadsheetFeatures.clipboard.prototype = {
        //Cut, copy and paste
        copy: function () {
            this._triggerKeyDown(67, true);
        },

        cut: function () {
            if (this.XLObj.model.isReadOnly)
                return;
            this._triggerKeyDown(88, true);
        },

        paste: function () {
			if(this.XLObj.model.isReadOnly)
				return;
            this._triggerKeyDown(86, true);
        },

        _initCopyPaste: function () {
            var xlId = this.XLObj._id, $div = ej.buildTag("div", {}, { position: "fixed", top: -1000, left: -1000 }, { id: xlId + "_copyPaste" });
            $("body").append($div);
            $div.append(ej.buildTag("textarea " + "." + xlId + "_copyTxt", {}, { width: 1, height: 1, overflow: "hidden", opacity: 0, resize: "none", cursor: "default" }, { id: xlId + "_hiddenTxt" }));
        },

        _copyPasteHandler: function (e) {
            var selCells, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), actSheet = xlObj.getSheet(sheetIdx), evtArgs;
            xlObj._isUndoRedo = false;
            if(!xlObj.model.allowEditing && (e.keyCode === 88 || e.keyCode === 86)){
             return false;
             }
            if ((e.keyCode === 67 || e.keyCode === 88 || e.keyCode === 86) && xlObj._preventctrlkey) {
                xlObj._showAlertDlg("Alert", "CtrlKeyErrorAlert", "CtrlKeyErrorAction", 450);
                return;
            }
            if (e.ctrlKey) {
                if (e.keyCode === 67) //copy
                {
					evtArgs = { reqType: "copy", startcell: actSheet._startCell, endcell: actSheet._endCell, selectedCells: actSheet._selectedCells };
					if (xlObj._trigActionBegin(evtArgs))
						return false;
                    this._getClipboard(e);
                    this._cutCells = [];
                    $.extend(true, this._copyCells,actSheet._selectedCells);
                    if (!this._copyCells.length)
                        this._copyCells = [xlObj.XLShape._picCellIdx];
                    setTimeout(function () {
                        xlObj._setSheetFocus();
                    }, 0);
                }
                else if (e.keyCode === 88) //cut
                {              
                    selCells = actSheet._selectedCells;
                    if (xlObj.model.allowLockCell && actSheet.isSheetProtected) {
                        if (xlObj._isPropExists([actSheet.selectedRange], "isLocked", sheetIdx))
                            return;
                    }
                    if (selCells.length && xlObj._isPropExists([actSheet.selectedRange], "isReadOnly", sheetIdx))
                        return;
					evtArgs = { reqType: "cut", startcell: actSheet._startCell, endcell: actSheet._endCell, selectedCells: actSheet._selectedCells };
					if (xlObj._trigActionBegin(evtArgs))
						return false;
                    if (selCells.length && xlObj._isPropExists([actSheet.selectedRange], "rule", sheetIdx))
                        xlObj.getRange(actSheet.selectedRange, sheetIdx).removeClass("e-hlcell")
                    this._copyCells = [];
                    $.extend(true, this._cutCells, selCells);
                    if (!this._cutCells.length)
                        this._cutCells = [xlObj.XLShape._picCellIdx];
                    this._getClipboard(e);
                    setTimeout(function () {
                        xlObj._setSheetFocus();
                    }, 0);
                }
                else if (e.keyCode === 86) //paste
                {
                    evtArgs = { reqType: "paste", isCopy: !this._cutCells.length, isShape: this._isShape, activecell: actSheet._activeCell };
                    !this._isShape && (evtArgs.cRange = this._copyRange);
                    if (xlObj._trigActionBegin(evtArgs))
                        return;
                    if (!xlObj.isUndefined(e.bubbles))
                        this._isSpecial = !xlObj.isPasteValuesOnly;
                    if (this._cData.length || this._copyBackup.elem)
                        $("#" + xlObj._id + "_hiddenTxt").val(this._cData).select();
                    else if (e.originalEvent)
                        $("#" + xlObj._id + "_hiddenTxt").select();
                    else {
                        $("#" + xlObj._id + "_hiddenTxt").val("");
                        xlObj._showAlertDlg("Alert", ["ClipboardAccessError", "Cut", "Copy", "Paste"], "ClipboardAccessError", 450);
                        return;
                    }
                    setTimeout(function () {
                        xlObj.XLClipboard._setClipboard();
                    }, 0);
                }
            }
            else if (e.keyCode === 27 && xlObj.element.find(".e-cdata").length) { //escape          
                xlObj.element.find("td.e-cutright, td.e-cutbottom").removeClass("e-cutright e-cutbottom");
                $("#" + xlObj._id + "_hiddenTxt").val("");
                this._cData = "";
                this._copyCells = [];
            }
        },

        _triggerKeyDown: function (keyCode, ctrlKey) {
            var xlObj = this.XLObj;
            xlObj._setSheetFocus();
            var e = $.Event("keydown");
            e.keyCode = keyCode;
            e.ctrlKey = ctrlKey;
            $("#" + xlObj._id).trigger(e);
        },

        _getClipboard: function (e) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), actSheet = xlObj.getSheet(sheetIdx), startcell = actSheet._startCell, endcell = actSheet._endCell;
            var selected = xlObj._getContent(sheetIdx).find(".e-selected"), actCell = xlObj.getActiveCellElem(sheetIdx)[0], fRange;
            if (!xlObj.model.allowClipboard)
                return;
            if (!xlObj.XLClipboard._copyBackup.cells && xlObj.model.showRibbon && !xlObj.model.isReadOnly) {
                xlObj.XLRibbon._enableButtons(["Home_Clipboard_Paste"], "ejButton");
                xlObj.XLRibbon._enableButtons(["Home_Clipboard_PasteOptions"], "ejSplitButton");
                if (xlObj.isPasteValuesOnly)
                    $("#" + xlObj._id + "_Ribbon_Paste").data("ejMenu").disableItemByID("PasteSpecial");
            }
            if (selected.length) {
                this._copyBackup = { cells: [], border: xlObj.model.allowCellFormatting && xlObj.XLFormat.getHashCodeClassAsArray(), table: [], filterRange: [] };
                var textContent = this._getSelectedData(startcell, endcell);
                if (xlObj.element.find(".e-cdata").length)
                    xlObj.element.find("td.e-cutright, td.e-cutbottom").removeClass("e-cutright e-cutbottom");
                $(selected).addClass("e-cdata");
                xlObj.XLSelection._focusBorder(startcell, endcell, xlObj._cutFocus);
                if (selected.length < 2 && !textContent.length)
                    this._cData = textContent = " ";
                else
                    this._cData = textContent;
                this._isCut = false;
                $("#" + xlObj._id + "_hiddenTxt").val(textContent).select();
                navigator.platform.toLowerCase().indexOf('mac') > -1 && document.execCommand("copy");
				this._copyBackup.actCellPos = { "top": actCell.offsetTop, "left": actCell.offsetLeft };
                if (this._copyBackup.cells[0]["cell"]["wrap"])
                    this._copyBackup.cells[0]["cell"]["wrap"] = "";
                if (e.keyCode == 67)
                    this._copyBackup.copypaste = true;
                this._isShape = false;
            }
            else {
                this._isShape = true;
                this._copyBackup = { elem: xlObj.getSheetElement(sheetIdx).find(".e-ss-activeimg"), isCut: e.keyCode === 88, sIdx: sheetIdx };
            }
            for (i = 0; i < selected.length; i++) {
                fRange = xlObj.XLEdit.getPropertyValue(xlObj._getCellIdx(selected[i]).rowIndex, xlObj._getCellIdx(selected[i]).colIndex, "formulaRange");
                if (fRange) {
                    if (this._copyRnge[fRange])
                        this._copyRnge[fRange].push({ rowIdx: xlObj._getCellIdx(selected[i]).rowIndex, colIdx: xlObj._getCellIdx(selected[i]).colIndex })
                    else
                        this._copyRnge[fRange] = [{ rowIdx: xlObj._getCellIdx(selected[i]).rowIndex, colIdx: xlObj._getCellIdx(selected[i]).colIndex }];
                }
            }
        },

        _getSelectedData: function (startCell, endCell) {
            var cData, xlObj = this.XLObj, textContent = "", cell, i, j, value, sheetIdx = xlObj.getActiveSheetIndex();
            if (startCell.rowIndex >= endCell.rowIndex) {
                var t = startCell;
                startCell = endCell;
                endCell = t;
            }
            this._copyRange = [];
            this._copyRange.push(xlObj.getActiveSheetIndex());
            this._copyRange.push(xlObj._getSelectedItems()[1]);
            for (i = startCell.rowIndex; i <= endCell.rowIndex; i++) {
                if (i !== startCell.rowIndex)
                    textContent += "\n";
                if (startCell.colIndex <= endCell.colIndex) {
                    for (j = startCell.colIndex; j <= endCell.colIndex; j++) {
                        cData = xlObj.getRangeData({ range: [i, j, i, j], property: ["type", "value", "value2"] })[0];
                        if (xlObj.getObjectLength(cData))
                            value = cData.type !== "general" ? cData.value2 : cData.value;
                        else
                            value = "";
                        this._updateCBackupData(i, j);
                        //if (cell) {
                            if (j !== endCell.colIndex)
                                textContent += value + "\t";
                            else {
                                textContent += value;
                            }
                        }
                    }
                else {
                    for (j = endCell.colIndex; j <= startCell.colIndex; j++) {
                        cData = xlObj.getRangeData({ range: [i, j, i, j], property: ["type", "value", "value2"] })[0];
                        if (xlObj.getObjectLength(cData))
                            value = cData.type !== "general" ? cData.value2 : cData.value;
                        else
                            value = "";
                        this._updateCBackupData(i, j);
                        //if (cell) {
                            if (j !== startCell.colIndex)
                                textContent += value + "\t";
                            else {
                                textContent += value;
                            }
                        //}
                        }
                    }
                }
            //get table details
            var tblMgr = xlObj.model.sheets[sheetIdx].tableManager, tblKeys, tblObj, tblRange, tblName = [], selectedRange = xlObj.model.sheets[sheetIdx].selectedRange;
            tblKeys = xlObj.getObjectKeys(tblMgr);
			for (var m = 0, rLen = tblKeys.length; m <= rLen; m++) {
                tblObj = $.extend(true, {}, tblMgr[tblKeys[m]]);
				if(xlObj.getObjectLength(tblObj)) {
					tblRange = tblObj.range;
					if (this._compareRange(selectedRange, tblRange)) {
						tblName.push(tblObj.name);
						tblObj.header = true;
						tblObj.tblId = tblKeys[m];
						this._copyBackup.table.push({ tblName: tblName, tblObj: tblObj, range: tblRange, sheetIdx: sheetIdx });
						break;
					}
				}
            }
            //get filtering details
            var fltrRange = xlObj.getRangeIndices(xlObj.model.sheets[sheetIdx].filterSettings.range);
            if (this._compareRange(selectedRange, fltrRange))
                this._copyBackup.filterRange = fltrRange;
            return textContent;
        },

        _updateCBackupData: function (rowIdx, colIdx) {
            var xlObj = this.XLObj;           
            var sheetIdx = xlObj.getActiveSheetIndex(), format, container = xlObj._dataContainer.sheets[sheetIdx], cellObj, regx = new RegExp("\\b" + "e-format" + ".*?\\b", "g");
            if (rowIdx in container && colIdx in container[rowIdx]) {
                cellObj = $.extend(true, {}, container[rowIdx][colIdx]);
                format = cellObj.format ? cellObj.format : "";
            }
            else {
                cellObj = {};
                format = "";
            }
            this._copyBackup.cells.push({ cell: cellObj, format: format });
        },

        _setClipboard: function () {
            var xlObj = this.XLObj;
            if (xlObj.model.isReadOnly)
                return;
			xlObj._isCopyPaste = true;
            var currentCellIdx, cHeight, tRange, pval, evtArgs, settings, contentRows, fval, overflow, prop, cellObj, prtctRange, row = [], cell = [], type, regx = new RegExp("\\b" + "e-format" + ".*?\\b", "g"), currentCell, isColor = false, partialTbl = false, currCell, sheetIdx = xlObj.getActiveSheetIndex(), details = { cSheetIndex: this._copyRange[0], pSheetIndex: sheetIdx, sheetIndex: sheetIdx }, pastedTable = [];
            var startCell = xlObj.getSheet(sheetIdx)._startCell, endCell = xlObj.getSheet(sheetIdx)._endCell, i, j, k = 0, m, rLen, addr, cFormatRule, splitStr, shapeObj = {}, shapeElem, fltr, currCellObj, shapeRegx = new RegExp("\\b" + "e-shapebdr" + ".*?\\b", "g"), bstyle = ["solid", "dashed", "dotted"], cname;
            var minRowIdx = (startCell.rowIndex < endCell.rowIndex) ? startCell.rowIndex : endCell.rowIndex, tblName, tblRange, tableObj = this._copyBackup.table, style, bcolor, copyRowIdx;
            var minColIdx = (startCell.colIndex < endCell.colIndex) ? startCell.colIndex : endCell.colIndex, container = xlObj._dataContainer, range, cellPos, sparklineId;
            var pstCells, selCells, cpyLen = this._copyCells.length, cutLen = this._cutCells.length, copyRangeKeys, multipleArrayFormula ;
            xlObj.isPasteValuesOnly && (this._isSpecial = false);
            if (this._copyRange.length) {
                prtctRange = xlObj.swapRange(xlObj.getRangeIndices(this._copyRange[1]));
                selCells = xlObj._getSelectedRange({ rowIndex: prtctRange[0], colIndex: prtctRange[1] }, { rowIndex: prtctRange[2], colIndex: prtctRange[3] });
                tRange = [minRowIdx, minColIdx, minRowIdx + (prtctRange[2] - prtctRange[0]), minColIdx + (prtctRange[3] - prtctRange[1])];
                pstCells = xlObj._getSelectedRange({ rowIndex: tRange[0], colIndex: tRange[1] }, { rowIndex: tRange[2], colIndex: tRange[3] });
				if (xlObj.model.allowLockCell && xlObj.getSheet(sheetIdx).isSheetProtected) {
					if (xlObj._isPropExists([tRange], "isLocked", sheetIdx))
						return;
				}
				if (xlObj._isPropExists([tRange], "isReadOnly", sheetIdx))
					return;
			}
            if ((minRowIdx === 0 && minColIdx === 0 && cpyLen === (this.XLObj.model.rowCount * this.XLObj.model.columnCount)) || cpyLen !== (this.XLObj.model.rowCount * this.XLObj.model.columnCount)) {
                var objIdx, actSheet = xlObj.model.sheets[sheetIdx], psheet = xlObj.model.sheets[this._copyBackup.sIdx], actCell = xlObj.getSheetElement(sheetIdx).find(".e-activecell"), shapeMgr = xlObj.getSheet(this._copyBackup.sIdx || this._copyRange[0] || sheetIdx).shapeMngr, pRange, className, len, cLen, isCut, cutCells, cSheetIdx = this._copyRange[0];
                if (this._isShape) {
                    if (!this._isSpecial)
                        return false;
                    var shapeIdx, id, cellIdx = xlObj.XLShape._picCellIdx, actCellIdx = xlObj.getActiveCell(sheetIdx);
                    shapeElem = this._copyBackup.elem;
                    id = shapeElem[0].id;
                    type = id.indexOf("picture") > -1 ? "picture" : "chart";
                    details = { sheetIndex: sheetIdx, cSheetIndex: this._copyBackup.sIdx, pSheetIndex: sheetIdx, operation: "shape", cShapeId: id, reqType: (this._copyBackup.isCut) ? "cut-paste" : "copy-paste" };
                    cellObj = $.extend(true, {}, container.sheets[this._copyBackup.sIdx][cellIdx.rowIndex][cellIdx.colIndex]);
                    cell = xlObj.getCell(actCellIdx.rowIndex, actCellIdx.colIndex);
                    $.extend(true, shapeObj, shapeMgr[type][id]);
                    details.cutCell = { rowIndex: cellIdx.rowIndex, colIndex: cellIdx.colIndex, obj: cellObj, shapeObj: $.extend(true, {}, shapeObj)};
                    shapeElem = xlObj.element.find("#" + shapeObj.id);
                    if (type === "picture") {
                        className = shapeElem[0].className;
                        if (className.indexOf("e-shapebdr") > -1) {
                            className = shapeElem[0].className.match(shapeRegx)[0];
                            style = className.replace("e-shapebdr", "").split("N");
                            bcolor = style[2];
                            xlObj.XLShape._createPicture(sheetIdx, actCellIdx, shapeMgr.sharedPics[shapeObj.data], cell[0].offsetTop, cell[0].offsetLeft, shapeObj.width, shapeObj.height, null, "#" + bcolor, bstyle[parseInt(style[1]) - 1], style[0] + "px");
                            (xlObj.model.showRibbon) && xlObj.XLRibbon._formatTabUpdate();
                        }
                        else {
                            xlObj.XLShape._createPicture(sheetIdx, actCellIdx, shapeMgr.sharedPics[shapeObj.data], cell[0].offsetTop, cell[0].offsetLeft, shapeObj.width, shapeObj.height);
                            (xlObj.model.showRibbon) && xlObj.XLRibbon._formatTabUpdate();
                        }
                    }
                    else {
                        if (!shapeObj.isChartSeries) {
                            range = shapeObj.range;
                            range = xlObj._getAlphaRange(sheetIdx, range[0], range[1], range[2], range[3]);
                            if (range.indexOf(":") === -1)
                                range = range + ":" + range;
                        }
                        shapeObj.top = cell[0].offsetTop;
                        shapeObj.left = cell[0].offsetLeft;
                        xlObj.XLChart.createChart(shapeObj.isChartSeries ? null : range, $.extend(true, {}, shapeObj));
                    }
                    this._isShape = this._copyBackup.isCut ? false : true;
                    this._cutCells = [];
                    if (!xlObj._isUndoRedo) {
                        cellObj = $.extend(true, {}, container.sheets[sheetIdx][actCellIdx.rowIndex][actCellIdx.colIndex]);
                        shapeObj = $.extend(true, {}, actSheet.shapeMngr[type][cellObj[type][0]]);
                        details.pShapeId = cellObj[type][0];
                        details.pasteCell = { rowIndex: actCellIdx.rowIndex, colIndex: actCellIdx.colIndex, obj: cellObj, shapeObj: shapeObj };
                        evtArgs = { sheetIndex: details.sheetIndex, cutCell: details.cutCell, pasteSheetIndex: details.pSheetIndex, operation: details.operation, reqType: details.reqType, pasteShapeId: details.pShapeId, pasteCell: details.pasteCell };
                        if (evtArgs.reqType === "cut-paste") {
                            evtArgs.cutSheetIndex = details.cSheetIndex;
                            evtArgs.cutShapeId = details.cShapeId;
                        }
                        else {
                            evtArgs.copySheetIndex = details.cSheetIndex;
                            evtArgs.copyshapeId = details.cShapeId;
                        }
                        xlObj._completeAction(details);
                        xlObj._trigActionComplete(evtArgs);
                        if (this._copyBackup.isCut) {
                            cellObj = $.extend(true, {}, container.sheets[this._copyBackup.sIdx][cellIdx.rowIndex][cellIdx.colIndex]);
                            cellObj[type].some(function (obj, i) {
                                if (shapeElem[0].id === psheet.shapeMngr[type][cellObj[type][i]].id) {
                                    objIdx = i;
                                    return true;
                                }
                                return false;
                            });
                            if (Object.keys(cellObj).length < 2 && cellObj[type].length < 2) {
                                delete container.sheets[this._copyBackup.sIdx][cellIdx.rowIndex][cellIdx.colIndex];
                                if (xlObj.getObjectLength(container.sheets[this._copyBackup.sIdx][cellIdx.rowIndex]) < 1)
                                    delete container.sheets[this._copyBackup.sIdx][cellIdx.rowIndex]
                            }
                            else if (cellObj[type].length < 2)
                                delete cellObj[type];
                            else
                                cellObj[type].splice(objIdx, 1);
                            delete psheet.shapeMngr[type][details.cShapeId];
                        }
                    }
                    if (this._copyBackup.isCut)
                        shapeElem.remove();
                }
                else {
                    isColor = (this._cData === $("#" + xlObj._id + "_hiddenTxt").val()) && (this._copyRange.length > 0);
                    if (isColor) {
                        if (xlObj.model.allowLockCell && xlObj.getSheet(sheetIdx).isSheetProtected) {
                            if (xlObj._isPropExists([tRange], "isLocked", sheetIdx))
                                return;
                        }
                        if (xlObj._isPropExists([tRange], "isReadOnly", sheetIdx))
                            return;
                    }
                    var shapes = [];
                    details.reqType = (cutLen > 0) ? "cut-paste" : "copy-paste";
                    if (xlObj.element.find(".e-selected").hasClass("e-readonly")) {
                        if (xlObj.element.find(".e-cdata").length)
                            xlObj.element.find(".e-cutright, .e-cutbottom").removeClass("e-cutright e-cutbottom");
                        return;
                    }
                    details.text = row = $("#" + xlObj._id + "_hiddenTxt").val().length ? $("#" + xlObj._id + "_hiddenTxt").val().split("\n") : [];
                    if (this._cData.length < 1 && details.text.length < 1)
                        return;
                    if (!isColor && row[row.length - 1] === "")
                        row.splice(row.length - 1, 1);
                    var pasteCells = [], shapes = [], hldata, value2, rowIdx, colIdx, cRowIdx, cColIdx;
                    if (isColor) {
                        details.isSpecial = this._isSpecial;
                        range = xlObj.getRangeIndices(this._copyRange[1]);
                        xlObj.setActiveSheetIndex(this._copyRange[0]);
                        details.cutBorder = { range: range, prevBorder: xlObj.model.allowCellFormatting && xlObj.XLFormat.getHashCodeClassAsArray(range) };
                        xlObj.setActiveSheetIndex(sheetIdx);
                    }
                    else
                        details.isSpecial = false;
                    if (details.reqType == "cut-paste") {
                        copyRangeKeys = xlObj.getObjectKeys(this._copyRnge);
						multipleArrayFormula = xlObj.XLEdit.getPropertyValue(selCells[0].rowIndex, selCells[0].colIndex, "hasMultipleFormulaArray");
                        for (var a = 0; a < copyRangeKeys.length; a++) {
                            cpyCells = this._copyRnge[copyRangeKeys[a]]
                                if (cutLen == 1 && multipleArrayFormula) {
                                    formulaArr = xlObj.XLEdit.getPropertyValue(this._cutCells[a].rowIndex, this._cutCells[a].colIndex, "hasFormulaArray");
                                    if (formulaArr) {
                                        xlObj._showAlertDlg("Alert", "ArrayaFormula", 430);
                                        this._copyRnge = {};
                                        return;
                                    }
                            }
                        }
                    }
                    if (cutLen) { //cut special
                        cutCells = [];
                        cSheetIdx = this._copyRange[0];
                        (!tableObj.length) && this._cutPasteBorder(prtctRange, tRange);
                        for (i = 0; i < cutLen; i++) {
                            rowIdx = this._cutCells[i].rowIndex;
                            colIdx = this._cutCells[i].colIndex;
                            currentCell = xlObj.getCell(rowIdx, colIdx, cSheetIdx);   //this._copyRange[0] is cutcell sheetIndex
                            cname = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "tableName") || "";
                            cell = { rowIndex: rowIdx, colIndex: colIdx, prevObj: {}, newObj: {}, shapes: [] };
                            if (!ej.isNullOrUndefined(container.sheets[cSheetIdx][rowIdx]))
                                $.extend(true, cell.prevObj, container.sheets[cSheetIdx][rowIdx][colIdx]);
                            else
                                cell.prevObj = {};
                            cellObj = ej.isNullOrUndefined(container.sheets[cSheetIdx][rowIdx]) ? {} : $.extend(true, {}, container.sheets[cSheetIdx][rowIdx][colIdx]);
                            if (currentCell && currentCell[0]) {
                                if (!("merge" in cell.prevObj)) {
                                    xlObj.XLEdit._updateCellValue({ rowIndex: rowIdx, colIndex: colIdx }, "", "", cSheetIdx);
                                    xlObj._refreshRowHeight(cSheetIdx, rowIdx);
                                }
                                if ("wrap" in cellObj) {
                                    addr = xlObj._generateHeaderText(colIdx + 1) + (rowIdx + 1);
                                    xlObj._dupDetails = true;
			                        xlObj.setActiveSheetIndex(cSheetIdx);
                                    xlObj.setWrapText("unwrap", addr + ":" + addr);
									xlObj.setActiveSheetIndex(sheetIdx);
                                    xlObj._dupDetails = false;
                                }
                                if ('cellType' in cellObj)
                                    xlObj.model.allowCellType && xlObj.XLCellType._removeControls(rowIdx, colIdx, cSheetIdx, true);
								if (xlObj.model.allowSparkline && 'sparkline' in cellObj) {                                   
									sparklineId = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "sparkline", cSheetIdx);
									cell.prevSparklineProp = $.extend(true, {}, xlObj.getSheet(cSheetIdx).shapeMngr.sparkline[sparklineId]);
									!this._copyBackup.sparkline && (this._copyBackup.sparkline = {});
									this._copyBackup.sparkline[sparklineId] = cell.prevSparklineProp;
									xlObj.XLSparkline._removeSparklineElem(rowIdx, colIdx, cSheetIdx);
								}
                                currentCell.removeClass("e-hyperlinks e-redft e-yellowft e-greenft e-redf e-redt");
                                currentCell.find('a').remove();
                                if (currentCell.hasClass("e-commentcell"))
                                    xlObj.XLComment.deleteComment([rowIdx, colIdx, rowIdx, colIdx], cSheetIdx);
                                if (xlObj.model.allowCellFormatting && !xlObj.XLRibbon._isDirtySelect) {
                                    partialTbl = (xlObj._checkTableRange(xlObj._getRangeArgs(range, "string")).status == "partial");
                                    if (tableObj.length) {
                                        for (m = 0, rLen = tableObj.length; m < rLen; m++)
                                            xlObj.XLFormat.removeStyle(range, { cellStyle: true, tableStyle: true, format: true, border: true, sheetIdx: tableObj[m].sheetIdx })
                                    }
                                    else if (!partialTbl)
                                        xlObj.XLFormat.removeStyle(range, { cellStyle: true, tableStyle: true, format: true });
                                }
                                if ((rowIdx in container.sheets[cSheetIdx]) && (colIdx in container.sheets[cSheetIdx][rowIdx])) {
                                    !ej.isNullOrUndefined(container.sheets[cSheetIdx][rowIdx][colIdx]) && (overflow = container.sheets[cSheetIdx][rowIdx][colIdx]['overflow']);
                                    if (partialTbl)
                                        xlObj.XLEdit._clearDataContainer({ cellIdx: { rowIndex: rowIdx, colIndex: colIdx }, sheetIdx: cSheetIdx, property: ["value", "value2", "type", "cFormatRule", "thousandSeparator", "rule", "calcValue", "align", "hyperlink", "comment", "decimalPlaces", "formatStr"] });
                                    else {
                                        delete container.sheets[cSheetIdx][rowIdx][colIdx];
                                        xlObj._textClip(rowIdx, colIdx, 'delete');
                                    }       
                                }
                                if (currentCell[0].className.match(regx) && xlObj._checkTableRange(xlObj._getRangeArgs(range, "string")).status != "partial")
                                    currentCell[0].className = currentCell[0].className.replace(regx, "");
                                if (!ej.isNullOrUndefined(container.sheets[cSheetIdx][rowIdx]))
                                    $.extend(true, cell.newObj, container.sheets[cSheetIdx][rowIdx][colIdx]);
                                else
                                    cell.newObj = {};
                                xlObj._setRowHdrHeight(cSheetIdx, xlObj._getCellIdx(currentCell[0]).rowIndex);
                            }
                            else if (xlObj.getObjectLength(cellObj)) {
                                prop = xlObj.getObjectKeys(cellObj);
                                partialTbl = (xlObj._checkTableRange(xlObj._getRangeArgs(range, "string")).status == "partial");
                                if (partialTbl) {
                                    prop.splice(prop.indexOf("tableName"), 1);
                                    prop.splice(prop.indexOf("tformats"), 1);
                                    prop.splice(prop.indexOf("format"), 1);
                                }
                                xlObj.clearRangeData([rowIdx, colIdx, rowIdx, colIdx], prop);
                                if (xlObj.model.allowCellType && ('cellType' in cellObj))
                                    delete container.sheetCellType[container.sheets[cSheetIdx][rowIdx][colIdx]['cellType']];                              
                            }
                            cutCells.push(cell);
                        }
                        for (m = 0, rLen = tableObj.length; m < rLen; m++) {
                            var tempIdx = xlObj.getActiveSheetIndex();
                            xlObj.gotoPage(cSheetIdx, false);
                            tblName = $.trim(tableObj[m].tblName);
                            xlObj.XLFormat.removeTable(xlObj._getTableID(null, tblName, cSheetIdx));
                            xlObj.gotoPage(tempIdx, false);
                        }
                        if (xlObj.model.allowCellFormatting && !partialTbl)
                            xlObj.XLFormat.removeStyle(range, { cellStyle: true, tableStyle: true, format: true });
                        xlObj.setActiveSheetIndex(cSheetIdx);
                        //xlObj.model.allowCellFormatting && xlObj.XLFormat.removeStyle(range, { cellStyle: true, tableStyle: true, border: true });
                        xlObj.setActiveSheetIndex(sheetIdx);
                        details.cutCells = cutCells;
                        details.cfat = { table: tblName, range: range };
                        isCut = true;
                        if (xlObj.element.find(".e-cdata").length)
                            xlObj.element.find(".e-cutright, .e-cutbottom").removeClass("e-cutright e-cutbottom");
                    }
                    else {
                        var copyCells = [];
                        if (this._isSpecial) {
                            for (i = 0; i < cpyLen; i++) {
                                rowIdx = this._copyCells[i].rowIndex;
                                colIdx = this._copyCells[i].colIndex;
                                cell = { rowIndex: rowIdx, colIndex: colIdx, prevObj: {}, newObj: {} };
                                if (!ej.isNullOrUndefined(container.sheets[sheetIdx][rowIdx]))
                                    $.extend(true, cell.prevObj, container.sheets[sheetIdx][rowIdx][colIdx]);
                                copyCells.push(cell);
                            }
                        }
                        else
                            copyCells = this._copyCells;
                        details.cutCells = copyCells;
                    }
                    if (row.length)
                        pRange = [minRowIdx, minColIdx, minRowIdx + row.length - 1, minColIdx + row[0].split("\t").length - 1];
                    else {
                        pRange = [minRowIdx, minColIdx, minRowIdx, minColIdx];
                        i = j = 1;
                    }
                    details.pasteBorder = { range: pRange, prevBorder: xlObj.model.allowCellFormatting && xlObj.XLFormat.getHashCodeClassAsArray(pRange) };
                    if (cpyLen) {
                        var l, pIdx, plen, colIdx, rowIdx, bordrs = [];
                        xlObj.XLFormat.removeStyle(tRange, { border: true, cellStyle: true, format: true });
                        for (l = 0, plen = pstCells.length; l < plen; l++) {
                            pIdx = pstCells[l];
                            rowIdx = selCells[l].rowIndex;
                            colIdx = selCells[l].colIndex;
                            bordrs = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "borders", this._copyRange[0]);
                            if (!xlObj.isUndefined(bordrs))
                                xlObj.XLFormat.applyBorder(bordrs, [pIdx.rowIndex, pIdx.colIndex, pIdx.rowIndex, pIdx.colIndex]);
                        }
                    }
                    var merge, isMHide, mergeIdx, cutCntnr, contentRows = xlObj._getContTBody(sheetIdx).find("rows");
                    for (i = 0, len = row.length; i < len; i++) {
                        cell = row[i].split("\t");
                        for (j = 0, cLen = cell.length; j < cLen; j++) {
                            currentCell = contentRows[xlObj._getRowIdx(minRowIdx + i)] ? xlObj.getCell(minRowIdx + i, minColIdx + j)[0] : undefined;
                            if (ej.isNullOrUndefined(currentCell)) {
                                if (actSheet.colCount <= minColIdx + j)
                                    xlObj.XLScroll._createNewColumn(sheetIdx, { rowIndex: -1, colIndex: -1 }, { rowIndex: -1, colIndex: -1 }, "insert");
                                else if (xlObj.model.scrollSettings.allowScrolling && !xlObj.model.scrollSettings.allowVirtualScrolling)
                                    xlObj.XLScroll._createNewRow(sheetIdx, -1, -1, "insert");
                                xlObj.XLScroll._refreshScroller(sheetIdx, "refresh", "all");
                                currentCell = xlObj.getCell(minRowIdx + i, minColIdx + j);
                            }
                            else
                                currentCell = $(currentCell);
                                currCell = { rowIndex: minRowIdx + i, colIndex: minColIdx + j };
                                currCell.prevObj = (!ej.isNullOrUndefined(container.sheets[sheetIdx][minRowIdx + i])) ? $.extend(true, {}, container.sheets[sheetIdx][minRowIdx + i][minColIdx + j]) : {};
                                if (!ej.isNullOrUndefined(currCell.prevObj)) {
                                    delete currCell.prevObj["isMHide"];
                                    delete currCell.prevObj["mergeIdx"];
                                    if (!ej.isNullOrUndefined(currCell.prevObj.cellType))
                                        currCell.prevObj.cTypeObj = container.sheetCellType[currCell.prevObj.cellType];
                                }
                                if (this._isCut && isColor)
                                    return;
                                currentCellIdx = { rowIndex: minRowIdx + i, colIndex: minColIdx + j };
                                if (this._isSpecial && isColor) { //paste special 
                                    rowIdx = currentCellIdx.rowIndex;
                                    colIdx = currentCellIdx.colIndex;
                                    cRowIdx = selCells[k].rowIndex;
                                    cColIdx = selCells[k].colIndex;
									className = xlObj._dataContainer.hashCode[this._copyBackup.cells[k].format];
									if (!("merge" in this._copyBackup.cells[k].cell) && !ej.isNullOrUndefined(className))
										xlObj.addClass(currentCell, className);
									cellObj = $.extend(true, {}, this._copyBackup.cells[k].cell);
									if (!(rowIdx in container.sheets[sheetIdx]))
										container.sheets[sheetIdx][rowIdx] = {};
									if (!(colIdx in container.sheets[sheetIdx][rowIdx]))
										container.sheets[sheetIdx][rowIdx][colIdx] = {};
									else {
										if ("comment" in container.sheets[sheetIdx][rowIdx][colIdx])
											xlObj.getCell(rowIdx, colIdx).removeClass("e-commentcell");
									}
									if (cellObj) {
										merge = $.extend(true, {}, xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "merge"));
										isMHide = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "isMHide");
										mergeIdx = $.extend(true, {}, xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "mergeIdx"));
										delete cellObj['overflow'];
										delete cellObj['isOverflow'];
										delete cellObj['tableName'];
										delete cellObj['isReadOnly'];
										delete cellObj['isLocked'];
										$.extend(true, container.sheets[sheetIdx][rowIdx][colIdx], cellObj);
										cutCntnr = container.sheets[sheetIdx][rowIdx][colIdx];
										if (xlObj.getObjectLength(merge))
											cutCntnr.merge = merge;
										else
											delete cutCntnr.merge;
										if (xlObj.getObjectLength(mergeIdx))
											cutCntnr.mergeIdx = mergeIdx;
										else
											delete cutCntnr.mergeIdx;
										if (!xlObj.isUndefined(isMHide))
											cutCntnr.isMHide = isMHide;
										else
											delete cutCntnr.isMHide;
										if(xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "value2")){
											xlObj._textClip(rowIdx, colIdx, 'delete');
											xlObj._textClip(rowIdx, colIdx, 'add');
										}
										if (cellObj.value2 && typeof cellObj.value2 == "string" && !cellObj.formatStr)
											value2 = container.sharedData[cellObj.value][0] === "=" ? container.sharedData[cellObj.value] : cellObj.value2;
										else
											value2 = container.sharedData[cellObj.value];
										if (cellObj.type === 3)
											value2 = this._getUpdatedCellFormula(value2, this._copyCells[k], { rowIdx: rowIdx, colIdx: colIdx });
										if (!("merge" in cellObj)) {
										    xlObj._dupDetails = true;
										    xlObj.XLEdit._updateCellValue(currentCellIdx, value2, null, null, cellObj.cellType);
										    xlObj._dupDetails = false;
											cHeight = xlObj.XLEdit.getPropertyValue(cRowIdx, 0, (details.reqType === "copy-paste") ? "cHeight" : "pHeight", this._copyRange[0]);
                                            if (!xlObj.isUndefined(cHeight)) {
                                                xlObj.XLEdit._updateDataContainer({ rowIndex: currentCellIdx.rowIndex, colIndex: 0 }, { dataObj: { pHeight: xlObj.getSheet(sheetIdx).rowsHeightCollection[currentCellIdx.rowIndex], cHeight: cHeight } });
                                                xlObj.getSheet(sheetIdx).rowsHeightCollection[currentCellIdx.rowIndex] = cHeight;
                                                if (xlObj._isRowViewable(sheetIdx, currentCellIdx.rowIndex))
                                                    xlObj.getRows(sheetIdx)[1][xlObj._getRowIdx(currentCellIdx.rowIndex)].style.height = cHeight + "px";
											}
										}
										if ("merge" in cellObj) {
											var length = 0, pstCell, pstCellObj, rowSpan, colSpan, merge = cellObj.merge;
											range = xlObj.getRangeIndices(merge.mRange);
											var rowCnt = range[2] - range[0], colCnt = range[3] - range[1], selectCells = xlObj.getSheet(sheetIdx)._selectedCells;
											var cellRange = xlObj._getAlphaRange(sheetIdx, currCell.rowIndex, currCell.colIndex, currCell.rowIndex + rowCnt, currCell.colIndex + colCnt);
											var mCell, sRowCnt = endCell.rowIndex - startCell.rowIndex, sColCnt = endCell.colIndex - startCell.colIndex;//sRowCnt is selected cell row count & sColCnt is selectedcell Colcount
											pstCell = xlObj._getSelectedRange({ rowIndex: currCell.rowIndex, colIndex: currCell.colIndex }, { rowIndex: currCell.rowIndex + rowCnt, colIndex: currCell.colIndex + colCnt });
											if (selCells.length >= selectCells.length || !(((sColCnt + 1) % (colCnt + 1)) === 0 && ((sRowCnt + 1) % (rowCnt + 1)) === 0)) {
												for (m = 0, rLen = pstCell.length; m < rLen; m++) {
													if (ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(pstCell[m].rowIndex, pstCell[m].colIndex, "isMHide"))) {
														pstCellObj = xlObj.XLEdit.getPropertyValue(pstCell[m].rowIndex, pstCell[m].colIndex, "merge");
														length++;
														if (!ej.isNullOrUndefined(pstCellObj)) {
															if (pstCellObj) {
																rowSpan = pstCellObj.mSpan.rowSpan;
																colSpan = pstCellObj.mSpan.colSpan;
															}
															if (!ej.isNullOrUndefined(rowSpan) && !ej.isNullOrUndefined(colSpan))
																length += (parseInt(rowSpan) * parseInt(colSpan)) - 1;
															if (pstCellObj.isCenterAlign) {
																if (xlObj._isRowViewable(sheetIdx, pstCell[m].rowIndex))
																	xlObj.getCell(pstCell[m].rowIndex, pstCell[m].colIndex).addClass("e-calign").removeClass("e-ralign");
															}
														}                                                   
													}
												}
												if (pstCell.length === length) {
												    if (cutLen) {
														var fCell = false, mCell = xlObj._getSelectedCells(cSheetIdx, merge.mRange).range, r, c, cpycontainer = xlObj._dataContainer.sheets[cSheetIdx];
														for (r = mCell[0]; r <= mCell[2]; r++) {
															for (c = mCell[1]; c <= mCell[3]; c++) {
																if (xlObj._isRowViewable(cSheetIdx, r))
																	xlObj.getCell(r, c, cSheetIdx).text("");
																(ej.isNullOrUndefined(cpycontainer[r])) && (cpycontainer[r] = {});
																(ej.isNullOrUndefined(cpycontainer[r][c])) && (cpycontainer[r][c] = {});
																if (!fCell) {
																	cpycontainer[r][c].merge = merge;
																	fCell = true;
																}
																else {
																	cpycontainer[r][c].isMHide = true;
																	cpycontainer[r][c].mergeIdx = { rowIndex: range[0], colIndex: range[1] };
																}
															}
														}
														xlObj.setActiveSheetIndex(cSheetIdx);
														xlObj._unMergeAllCells(this._copyRange[0], 0, xlObj._getSelectedRange({ rowIndex: range[0], colIndex: range[1] }, { rowIndex: range[2], colIndex: range[3] }), [], 0, 0);
														xlObj.setActiveSheetIndex(sheetIdx);
                                                    }
												}
                                                xlObj._paste = true;
                                                xlObj._dupDetails = true;
                                                if (!xlObj.isUndefined(currCell.prevObj.merge))
                                                    xlObj.unmergeCells(currCell.prevObj.merge.mRange);
                                                xlObj.unmergeCells(cellRange);
                                                xlObj.mergeCenter = merge.isCenterAlign;
                                                if (!xlObj.isUndefined(mCell) && mCell === "1")
                                                    xlObj.mergeAcrossCells(cellRange, true);
                                                else
                                                    xlObj.mergeCells(cellRange, true);
                                                xlObj._dupDetails = false;
                                                xlObj.XLEdit._updateCellValue(currentCellIdx, value2);
                                                if (!ej.isNullOrUndefined(className))
                                                    xlObj.addClass(currentCell, className);
                                            }
                                            else {
                                                var obj = $.extend(true, {}, cellObj);
                                                obj.value = obj.value2 = value2;
                                                if (!ej.isNullOrUndefined(className))
                                                    xlObj.getCell(range[0], range[1], this._copyRange[0]).addClass(className);
                                                xlObj.XLEdit._updateDataContainer({ rowIndex: range[0], colIndex: range[1] }, { dataObj: obj });
                                                xlObj._showAlertDlg("Alert", "MergeAlert", "", 250);
                                                return;
                                            }
                                        }                                  
										if ("hyperlink" in cellObj) {
											hldata = cellObj.hyperlink;
                                            if(currentCell) {
											    if (hldata && !hldata.webAddr)
												    currentCell.html(ej.buildTag("a.e-hyperlinks", xlObj.XLEdit.getPropertyValue(rowIdx,colIdx,'value2'), "", { href: "#" }));
											    else
												    currentCell.html(ej.buildTag("a.e-hyperlinks", xlObj.XLEdit.getPropertyValue(rowIdx,colIdx,'value2'), "", { href: hldata.webAddr, target: "_blank" }));
                                            }
										}
										if ("comment" in cellObj) {
											xlObj._removeClass(currentCell, "e-commentcell");
											xlObj.XLComment.setComment([rowIdx, colIdx, rowIdx, colIdx], null, false);
										}
										if ("cFormatRule" in cellObj) {
											cFormatRule = $.extend(true, [], cellObj.cFormatRule);
											cellObj.cFormatRule = [];
											for (m = 0, rLen = cFormatRule.length; m < rLen; m++) {
												splitStr = xlObj._dataContainer.cFormatData[cFormatRule[m]].split("_");
												xlObj.XLCFormat._cFormat(splitStr[0], splitStr[2], splitStr[3], splitStr[4], splitStr[5], null, null, [rowIdx, colIdx, rowIdx, colIdx], "paste", this._copyCells[k]);
											}
										}
										xlObj._isPaste = true;
										if ("wrap" in cellObj) {
											xlObj._dupDetails = true;
											addr = xlObj._generateHeaderText(colIdx + 1) + (rowIdx + 1);
											xlObj.setWrapText("wrap", addr + ":" + addr);
											xlObj._dupDetails = false;
										}
										if ('cellType' in cellObj) {
										    settings = $.extend(true, {}, xlObj._dataContainer.sheetCellType[cellObj['cellType']]);
										    delete settings["id"];
										    delete settings["value"];
										    delete settings["selectedIndex"];
										    delete settings["text"];
										    if (settings.type !== "DropDownList")
										        settings.text = '';
										    var cellType, alphRange = xlObj.getAlphaRange(rowIdx, colIdx);
										    for (m = 0; m < actSheet.cellTypes.length; m++) {
										        cellType = actSheet.cellTypes[m];
										        if (cellType["range"] == alphRange) {
										            actSheet.cellTypes.splice(m, 1);
										            break;
										        }
										    }
										    xlObj.XLEdit._clearDataContainer({ cellIdx: { rowIndex: rowIdx, colIndex: colIdx }, property: ["cellType"] });
										    xlObj.model.allowCellType && xlObj.XLCellType._renderControls(rowIdx, colIdx, sheetIdx, settings, false);
										}
										if (xlObj.model.allowSparkline && 'sparkline' in cellObj)											
											xlObj.XLSparkline._refreshSparklineClipboard(rowIdx, colIdx, sheetIdx, cSheetIdx, this._copyCells.length);
										xlObj._isPaste = true;
										if ("picture" in cellObj) {
										    delete cutCntnr.picture;
											for (m = 0, rLen = cellObj.picture.length; m < rLen; m++) {
											    cell = cpyLen ? this._copyCells[k] : this._cutCells[k];
												cellPos = this._copyBackup.actCellPos;
												currCellObj = xlObj.getRangeData([cell.rowIndex, cell.colIndex, cell.rowIndex, cell.colIndex], "", "", this._copyRange[0])[0];
												if ((!xlObj.isUndefined(currCellObj.picture) && currCellObj.picture.indexOf(cellObj.picture[m]) > -1) || !cpyLen) {
													$.extend(true, shapeObj, shapeMgr.picture[cellObj.picture[m]]);
													shapeElem = xlObj.element.find("#" + shapeObj.id);
													if (shapeObj.rowIndex === cell.rowIndex && shapeObj.colIndex === cell.colIndex) {
														shapeElem = xlObj.element.find("#" + shapeObj.id);
														className = shapeElem[0].className;
														if (className.indexOf("e-shapebdr") > -1) {
															className = shapeElem[0].className.match(shapeRegx)[0];
															style = className.replace("e-shapebdr", "").split("N");
															bcolor = style[2];
															xlObj.XLShape._createPicture(sheetIdx, currentCellIdx, shapeMgr.sharedPics[shapeObj.data], parseInt(shapeElem.css("top")) - cellPos.top + actCell[0].offsetTop, parseInt(shapeElem.css("left")) - cellPos.left + actCell[0].offsetLeft, shapeObj.width, shapeObj.height, null, "#" + bcolor, bstyle[parseInt(style[1]) - 1], style[0] + "px");
														}
														else
															xlObj.XLShape._createPicture(sheetIdx, currentCellIdx, shapeMgr.sharedPics[shapeObj.data], parseInt(shapeElem.css("top")) - cellPos.top + actCell[0].offsetTop, parseInt(shapeElem.css("left")) - cellPos.left + actCell[0].offsetLeft, shapeObj.width, shapeObj.height);
														if (this._copyRange[0] === sheetIdx)
															container.sheets[sheetIdx][minRowIdx + i][minColIdx + j].picture[m] = xlObj.getObjectKeys(shapeMgr.picture)[xlObj.getObjectLength(shapeMgr.picture) - 1];
														if (cutLen)
															shapeElem.remove();
													}
												}
											}
										}
										if ("chart" in cellObj) {
										    delete cutCntnr.chart;
											currCellObj = xlObj.getRangeData([rowIdx, colIdx, rowIdx, colIdx]);
											for (m = 0, rLen = cellObj.chart.length; m < rLen; m++) {
											    cell = cpyLen ? this._copyCells[k] : this._cutCells[k];
												cellPos = this._copyBackup.actCellPos;
												currCellObj = xlObj.getRangeData([cell.rowIndex, cell.colIndex, cell.rowIndex, cell.colIndex])[0];
												if ((!xlObj.isUndefined(currCellObj.chart) && currCellObj.chart.indexOf(cellObj.chart[m]) > -1) || !cpyLen) {
													$.extend(true, shapeObj, shapeMgr.chart[cellObj.chart[m]]);
													shapeElem = xlObj.element.find("#" + shapeObj.id);
													if (shapeObj.rowIndex === cell.rowIndex && shapeObj.colIndex === cell.colIndex) {
                                                        if (!shapeObj.isChartSeries) {
                                                            range = shapeObj.range;
                                                            range = xlObj._getAlphaRange(sheetIdx, range[0], range[1], range[2], range[3]);
                                                            if (range.indexOf(":") < 0)
                                                                range = range + ":" + range;
                                                        }
														shapeObj.top = parseInt(shapeElem.css("top")) - cellPos.top + actCell[0].offsetTop;
														shapeObj.left = parseInt(shapeElem.css("left")) - cellPos.left + actCell[0].offsetLeft;
                                                        xlObj.XLChart.createChart(shapeObj.isChartSeries ? null : range, shapeObj);
														container.sheets[sheetIdx][minRowIdx + i][minColIdx + j].chart[m] = xlObj.getObjectKeys(shapeMgr.chart)[xlObj.getObjectLength(shapeMgr.chart) - 1];
														if (cutLen)
															shapeElem.remove();
													}
												}
											}
										}
										if ('rule' in cellObj) {
										    if (cellObj.rule.type === "list")
										        xlObj._setddlCell();
										}
										xlObj._isPaste = false;
									}
									else {
										xlObj.XLEdit._updateCellValue(currentCellIdx, "");
										if (!ej.isNullOrUndefined(container.sheets[sheetIdx][rowIdx]))
											delete container.sheets[sheetIdx][rowIdx][colIdx];
									}
								}
								else { //paste values only
									pval = xlObj.XLEdit._parseValue(cell[j], currentCellIdx);
								    if (pval.type == "time" || pval.type == "datetime")
									{
										fval = xlObj._dateToInt(pval.value);
										xlObj.XLEdit._updateCellValue(currentCellIdx, fval);
									}
								    else
										xlObj.XLEdit._updateCellValue(currentCellIdx, pval.value);	
									if (cell[j].indexOf("=") > -1)
										xlObj.XLEdit._updateCellValue(currentCellIdx, currentCell.html()); //remove formula 
								}
                            k++;
                            currCell.newObj = (!ej.isNullOrUndefined(container.sheets[sheetIdx][minRowIdx + i])) ? $.extend(true, {}, container.sheets[sheetIdx][minRowIdx + i][minColIdx + j]) : {};
                            if ((ej.isNullOrUndefined(currCell.newObj)))
                                currCell.newObj = {};
                            currCell.prevObj.cTypeObj && (currCell.prevObj.selIdxChange = xlObj._isSelIdxChange);
                            pasteCells.push(currCell);
                        }
                        if (!ej.isNullOrUndefined(currentCell)) {
                            xlObj._setRowHdrHeight(sheetIdx, xlObj._getCellIdx(currentCell[0]).rowIndex);
                            if (xlObj.model.allowFreezing && xlObj.getSheet(sheetIdx)._isFreezed)
                                xlObj.XLFreeze._refreshFRowResize(xlObj._getCellIdx(currentCell[0]).rowIndex);
                        }  
                    }
                        xlObj._hasFormulaArray = false,  xlObj._hasMultipleFormulaArray = false;
                    if (row.length < 1)
                        i = 1;                   
                    if (cutLen) {
                        this._isCut = isCut;
                        this._cutCells = [];
                        this._cData = "";
                    }
                    this._formulaArrayPaste();
                    if (this._isSpecial && isColor) { //paste - border, filtering, table                        
                        var table = this._copyBackup.table, tObj, tmgr = xlObj.getSheet(sheetIdx).tableManager, tabId;
                        range = xlObj.getRangeIndices(this._copyRange[1]);
                        for (m = 0, rLen = table.length; m < rLen; m++) {
                            tblRange = this._copyBackup.table[m].range;
                            tObj = $.extend(true, {}, this._copyBackup.table[m].tblObj);
                            if (this._copyBackup.copypaste)
                                tObj.name = "Table" + (xlObj._tableCnt);
                            xlObj._dupDetails = true;
                            xlObj.XLFormat.createTable(tObj, xlObj._getAlphaRange(this._copyRange[0], tblRange[0] + minRowIdx - range[0], tblRange[1] + minColIdx - range[1], minRowIdx -
                            range[0] + tblRange[2], minColIdx - range[1] + tblRange[3]));
                            xlObj._dupDetails = false;
                            tabId = this._isCut ? tObj.tblId : this.XLObj.getObjectLength(tmgr);
                            pastedTable.push(tmgr[tabId]);
                            pastedTable[m].id = tabId;
                            pastedTable[m].totalRow && xlObj.XLFormat._updateTotalRow(sheetIdx, pastedTable[m].id, table[0].tblObj.fnNumber, pastedTable[m].range, true);
                        }
                        pRange = [minRowIdx, minColIdx, (i + minRowIdx - 1), (j + minColIdx - 1)];
                        //xlObj.model.allowCellFormatting && xlObj.XLFormat.updateFormat(this._copyBackup["border"], pRange);             //commented due to border issues      
                        if (cutLen && this._copyBackup.filterRange.length > 0 && this._copyRange[0] === sheetIdx) {
                            var fltrRange = this._copyBackup.filterRange;
                            xlObj.XLFilter.clearFilter();
                            fltr = xlObj._generateHeaderText(fltrRange[1] + minColIdx - range[1] + 1) + (fltrRange[0] + minRowIdx - range[0] + 1) + ":" + xlObj._generateHeaderText(minColIdx - range[1] + fltrRange[3] + 1) + (minRowIdx - range[0] + fltrRange[2] + 1);
                            xlObj.XLFilter.filter(fltr);
                        }
                        details.pasteBorder.newBorder = xlObj.model.allowCellFormatting && xlObj.XLFormat.getHashCodeClassAsArray(pRange);
                        xlObj.setActiveSheetIndex(this._copyRange[0]);
                        details.cutBorder.newBorder = xlObj.model.allowCellFormatting && xlObj.XLFormat.getHashCodeClassAsArray(range);
                        xlObj.setActiveSheetIndex(sheetIdx);
                    }
                    details.pfat = { table: this._copyBackup.table, range: range, minRowIdx: minRowIdx, minColIdx: minColIdx, ptable: pastedTable };
                    details.pfilter = fltr;
                    details.pasteCells = pasteCells;
                    xlObj.XLSelection.selectRange(({ rowIndex: minRowIdx, colIndex: minColIdx }), ({ rowIndex: (i + minRowIdx - 1), colIndex: (j + minColIdx - 1) }));
                    xlObj.getSheet(sheetIdx)._startCell = ({ rowIndex: minRowIdx, colIndex: minColIdx });
                    xlObj.getSheet(sheetIdx)._endCell = ({ rowIndex: (i + minRowIdx - 1), colIndex: (j + minColIdx - 1) });
                    if (xlObj.model.allowAutoFill)
                        xlObj.XLDragFill.positionAutoFillElement();
                    details.sheetIndex = sheetIdx;
                    xlObj._setSheetFocus();
                    xlObj.model.showRibbon && xlObj.XLRibbon._updateRibbonIcons();
                    evtArgs = { sheetIndex: details.sheetIndex, pasteCells: details.pasteCells, reqType: details.reqType, isSpecial: details.isSpecial, cutCells: details.cutCells, pasteSheetIndex: details.pSheetIndex };
                    if (evtArgs.reqType === "cut-paste")
                        evtArgs.cutSheetIndex = details.cSheetIndex;
                    else
                        evtArgs.copySheetIndex = details.cSheetIndex;
                    if (!xlObj._isUndoRedo) {
                        xlObj._completeAction(details);
                        xlObj._trigActionComplete(evtArgs);
                    }
                    copyRowIdx = (details.cutCells.length < 1) ? minRowIdx : details.cutCells[0].rowIndex;
                    xlObj.XLScroll._getRowHeights(sheetIdx, (minRowIdx < copyRowIdx) ? (minRowIdx > 0) ? minRowIdx - 1 : 0 : (copyRowIdx > 0) ? copyRowIdx - 1 : 0);
                }
                xlObj._isPaste = false;
                this._isCut = false;
                xlObj.XLSelection._refreshBorder();
                xlObj.model.allowAutoFill && xlObj.XLDragFill.positionAutoFillElement();
                if (xlObj.getSheet(sheetIdx)._isFreezed)
                    xlObj.XLFreeze._refreshSelection();
            }
            else
                xlObj._showAlertDlg("Alert", "FullSheetCopyPasteAlert", "", 375);
			xlObj._isCopyPaste = false;
        },

        _formulaArrayPaste :  function() {
            var xlObj = this.XLObj, range, sheetIdx = xlObj.getActiveSheetIndex(), formulaArrRange, copyCellRowDiff = 0, copyCellColDiff = 0, copyRowDiff = 0, pasteRowDiff = 0, pasteColDiff = 0, copyColDiff = 0, fArg, nAlpha, startCol, endRow, splitformula, newRnge, endCol, startRow, formulaRng, formulaRngColDiff, formulaRngRowDiff, selRng, copyRangeKeys = xlObj.getObjectKeys(this._copyRnge);
            for (var a = 0, len = copyRangeKeys.length; a < len; a++) {
                cpyCells = this._copyRnge[copyRangeKeys[a]];
                var startCell = xlObj.getSheet(sheetIdx)._startCell, endCell = xlObj.getSheet(sheetIdx)._endCell, minRowIdx, minColIdx;
                minRowIdx = (startCell.rowIndex < endCell.rowIndex) ? startCell.rowIndex : endCell.rowIndex;
                minColIdx = (startCell.colIndex < endCell.colIndex) ? startCell.colIndex : endCell.colIndex
                prtctRange = xlObj.swapRange(xlObj.getRangeIndices(copyRangeKeys[a]));
                tRange = [minRowIdx, minColIdx, minRowIdx + (prtctRange[2] - prtctRange[0]), minColIdx + (prtctRange[3] - prtctRange[1])];
                pstCells = xlObj._getSelectedRange({ rowIndex: tRange[0], colIndex: tRange[1] }, { rowIndex: tRange[2], colIndex: tRange[3] });
                pstCellRnge = xlObj.getAlphaRange(pstCells[0].rowIndex, pstCells[0].colIndex, pstCells[pstCells.length - 1].rowIndex, pstCells[pstCells.length - 1].colIndex)
                for (b = 0; b < cpyCells.length; b++) {
                    xlObj._hasFormulaArray = true, xlObj._hasMultipleFormulaArray = true;
                    if (b == 0) {
                        range = copyRangeKeys[a];
                        selRng = xlObj.getRangeIndices(range);

                        formulaArrRange = xlObj.getSheet(sheetIdx).formulaRange[range];
                        formula = xlObj.XLDragFill._parseFormula(formulaArrRange);
                        newRnge = formula[0] + ":" + formula[formula.length - 1];
                        formulaRng = xlObj.getRangeIndices(newRnge);
                        formulaRngColDiff = formulaRng[3] - formulaRng[1];
                        formulaRngRowDiff = formulaRng[2] - formulaRng[0];

						if(!this._isCut){
							//Copy position Difference
							if (formulaRng[0] < selRng[0])
								copyRowDiff = selRng[0] - formulaRng[0];
							else if (formulaRng[0] > selRng[0])
								copyRowDiff = formulaRng[0] - selRng[0];
							if (formulaRng[1] < selRng[1])
								copyColDiff = selRng[1] - formulaRng[1];
							else if (formulaRng[1] > selRng[1])
								copyColDiff = formulaRng[1] - selRng[1];

							//Paste positon Differnces
							pastCell = xlObj._getAlphaRange(sheetIdx, pstCells[b].rowIndex, pstCells[b].colIndex, pstCells[b].rowIndex, pstCells[b].colIndex);
							pasteRng = xlObj.getRangeIndices(pastCell);
							if (formulaRng[0] < pasteRng[0])
								pasteRowDiff = pasteRng[0] - formulaRng[0];
							else if (formulaRng[0] > pasteRng[0])
								pasteRowDiff = formulaRng[0] - pasteRng[0];
							if (formulaRng[1] < pasteRng[1])
								pasteColDiff = pasteRng[1] - formulaRng[1];
							else if (formulaRng[1] > pasteRng[1])
								pasteColDiff = formulaRng[1] - pasteRng[1];
						}
                        rowDiff = pasteRowDiff - copyRowDiff;
                        colDiff = pasteColDiff - copyColDiff;

                        for (var c = 0; c < formula.length; c++) {
                            formulaVal = formula[c].trim();
                            if (xlObj._isCellReference(formulaVal)) {
                                fRange = xlObj.getRangeIndices(formulaVal);
                                rowIndex = fRange[0] + rowDiff;
                                colIndex = fRange[1] + colDiff;
                                nAlpha = xlObj._getAlphaRange(sheetIdx, rowIndex, colIndex, rowIndex, colIndex);
                                formula[c] = nAlpha;
                            }
                        }
                        value2 =  "=" + formula.join("");
                        xlObj.getSheet(sheetIdx).formulaRange[pstCellRnge] = value2;
                        xlObj.XLEdit._updateCellValue({ rowIndex: pstCells[b].rowIndex, colIndex: pstCells[b].colIndex }, value2);
                    }
                    else {
                        xlObj.XLEdit._updateCellValue({ rowIndex: pstCells[b].rowIndex, colIndex: pstCells[b].colIndex }, value2);
                    }

                }

            }
            this._copyRnge = {};
        },
        _getUpdatedCellFormula: function (val, addr, curAddr) {
            var xlObj = this.XLObj, regx = /([A-Z].*?[0-9])/g, rowDiff = curAddr.rowIdx - addr.rowIndex, colDiff = curAddr.colIdx - addr.colIndex,
                addrs = xlObj.XLDragFill._parseFormula(val), i, len, sAdr, newCAdr, newRAdr;

            for (i = 0, len = addrs.length; i < len; i++) {
                if (addrs[i].match(regx)) {
                    sAdr = addrs[i].trim().match(/(\d+|\D+)/g);
                    newCAdr = xlObj._generateColCount(sAdr[0]) + colDiff;
                    newRAdr = parseInt(sAdr[1]) + rowDiff;
                    addrs[i] = newRAdr > 0 && newCAdr > 0 ? xlObj._generateHeaderText(newCAdr) + newRAdr.toString() : "#REF!";
                }
            }
            addrs = addrs.join('');
            return "=" + addrs;
        },

        _compareRange: function (range1, range2) {
            return (range1[0] <= range2[0] && range1[1] <= range2[1] && range1[2] >= range2[2] && range1[3] >= range2[3]);
        },
        _cutPasteBorder: function (startRange, endRange) {
            var k, pstIdx, colIdx, rowIdx, pstlen, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), bdrs = [], cCells = [], pstCells = [];
            xlObj.XLFormat.removeStyle(endRange, { cellStyle: true, border: true, format: true, sheetIdx: sheetIdx });
            cCells = xlObj._getSelectedRange({ rowIndex: startRange[0], colIndex: startRange[1] }, { rowIndex: startRange[2], colIndex: startRange[3] });
            pstCells = xlObj._getSelectedRange({ rowIndex: endRange[0], colIndex: endRange[1] }, { rowIndex: endRange[2], colIndex: endRange[3] });
            for (k = 0, pstlen = pstCells.length; k < pstlen; k++) {
                pstIdx = pstCells[k];
                rowIdx = cCells[k].rowIndex;
                colIdx = cCells[k].colIndex;
                bdrs = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "borders", this._copyRange[0]);
                if (!xlObj.isUndefined(bdrs))
                    xlObj.XLFormat.applyBorder(bdrs, [pstIdx.rowIndex, pstIdx.colIndex, pstIdx.rowIndex, pstIdx.colIndex]);
            }
            xlObj.setActiveSheetIndex(this._copyRange[0]);
            xlObj.XLFormat.removeStyle(startRange, { cellStyle: true, border: true, format: true });
            xlObj.setActiveSheetIndex(sheetIdx);
        }

    };
})(jQuery, Syncfusion);