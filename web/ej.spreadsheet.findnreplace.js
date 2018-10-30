(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.findnreplace = function (obj) {
        this.XLObj = obj;
        this._findCount = 0;
        this._isApplied = false;
        this.caseSen = {
            "true": function (a) { return a.toString(); },
            "false": function (a) { return a.toString().toLowerCase(); }
        };
        this.isEMatch = {
            "true": function (a, b) {
                return a == b;
            },
            "false": function (a, b) {
                if (a.length && !b.length)
                    return;
                return a.indexOf(b) > -1;
            }
        };
    };

    ej.spreadsheetFeatures.findnreplace.prototype = {
        //Find and Replace       

        replaceAllBySheet: function (findData, replaceData, isCSen, isEMatch) {
			if (!this.XLObj.model.allowSearching || !this.XLObj.model.allowEditing || this.XLObj.model.isReadOnly)
                return;
            this._replaceAllData(findData, replaceData, isCSen, isEMatch, "value", "sheet");
        },

        replaceAllByBook: function (findData, replaceData, isCSen, isEMatch) {
			if (!this.XLObj.model.allowSearching || !this.XLObj.model.allowEditing || this.XLObj.model.isReadOnly)
                return;
            this._replaceAllData(findData, replaceData, isCSen, isEMatch, "value", "workbook");
        },

        findNext: function (value, options, sIndex) {
			ej.isNullOrUndefined(sIndex) && (sIndex = this.XLObj.getActiveSheetIndex());
            this._findNext(value, sIndex, options.isCSen, options.isEMatch, options.type, options.mode, options.searchBy);
        },

        findPrevious: function (value, options, sIndex) {
			ej.isNullOrUndefined(sIndex) && (sIndex = this.XLObj.getActiveSheetIndex());
            this._findPrev(value, sIndex, options.isCSen, options.isEMatch, options.type, options.mode, options.searchBy);
        },

        _findNext: function (input, sIndex, isCSen, isEMatch, type, mode, searchBy) {
            var i, j, s, k, tmp, selCells, cell, rowIdx, usedRange, len, rfrshcIdx, rfrshrIdx, colIdx, rowCount, colCount, evtArgs,
                matched, tmpSIndex, isFinded, fRange = [], searchRows = searchBy === "rows",
                xlObj = this.XLObj, isFindSelected = false, sheetIdx = sIndex ? sIndex : xlObj.getActiveSheetIndex(),
                actSheet = xlObj.getSheet(sheetIdx), actCell = actSheet._activeCell, args = {
                    sheetIndex: sIndex,
                    value: input,
                    isCaseSensitive: isCSen,
                    isEntireMatch: isEMatch,
                    searchBy: searchBy,
                    mode: mode,
                    findType: type,
                    reqType: "findNext"
                };
            evtArgs = { sheetIndex: args.sheetIndex, value: args.value, isCaseSensitive: args.isCaseSensitive, isEntireMatch: args.isEntireMatch, searchBy: args.searchBy, mode: args.mode, findType: args.findType, reqType: args.reqType };
            if (!xlObj._intrnlReq && xlObj._trigActionBegin(evtArgs))
                return true;
            if (xlObj.model.allowEditing && xlObj.XLEdit._isEdit)
                xlObj.XLEdit.saveCell();
            input = args.value;
            sIndex = args.sheetIndex;
            isCSen = args.isCaseSensitive;
            isEMatch = args.isEntireMatch;
            type = args.findType; mode = args.mode;
            searchBy = args.searchBy;
            selCells = actSheet._selectedCells;
            len = selCells.length;
            usedRange = actSheet.usedRange;
            if (len === 1 || mode === "workbook")
                fRange = [actCell.rowIndex, actCell.colIndex, usedRange.rowIndex + 1, usedRange.colIndex + 1];
            else {
                isFindSelected = true;
                cell = selCells[len - 1];
                fRange = [actCell.rowIndex, actCell.colIndex, cell.rowIndex + 1, cell.colIndex + 1];
            }
            rowIdx = fRange[0], colIdx = fRange[1], rowCount = fRange[2], colCount = fRange[3];
            if (!searchRows) {
                tmp = rowIdx;
                rowIdx = colIdx;
                colIdx = tmp;
                tmp = rowCount;
                rowCount = colCount;
                colCount = tmp;
            }
            if (mode === "sheet") {
                for (i = rowIdx; i < rowCount; i++) {
                    if (i !== rowIdx) {
                        cell = selCells[0];
                        colIdx = isFindSelected ? (searchRows ? cell.colIndex : cell.rowIndex) : 0;
                    }
                    for (j = colIdx; j < colCount; j++) {
                        matched = this._compareValues(searchRows ? i : j, searchRows ? j : i, sheetIdx, input, isCSen, isEMatch, type);
                        if (matched) {
                            if (!(i === rowIdx && j === colIdx)) {
                                this._updateSelection(searchRows ? i : j, searchRows ? j : i);
                                this._findCount++;
                                args = { reqType: "findNext", activeCell: xlObj.getActiveCellElem() };
                                if (xlObj._trigActionComplete(args))
                                    return;
                                return true;
                            }
                        }
                    }
                }
            }
            else {
                for (s = sheetIdx, k = xlObj.model.sheetCount; s <= k; s++) {
                    usedRange = xlObj.model.sheets[s].usedRange;
                    if (s !== sheetIdx) {
                        colIdx = 0;
                        rowIdx = 0;
                        rowCount = searchRows ? usedRange.rowIndex : usedRange.colIndex;
                        colCount = searchRows ? usedRange.colIndex : usedRange.rowIndex;
                    }
                    for (i = rowIdx; i < rowCount + 1; i++) {
                        if (i !== rowIdx)
                            colIdx = 0;
                        for (j = colIdx; j < colCount + 1; j++) {
                            matched = this._compareValues(searchRows ? i : j, searchRows ? j : i, s, input, isCSen, isEMatch, type);
                            if (matched) {
                                if (!(s === sheetIdx && i === rowIdx && j === colIdx)) {
                                    this._updateSelection(searchRows ? i : j, searchRows ? j : i, s);
                                    this._findCount++;
                                    xlObj._intrnlReq = false;
                                    args = { reqType: "findNext", activeCell: xlObj.getActiveCellElem() };
                                    if (xlObj._trigActionComplete(args))
                                        return;
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            if (!this._findCount) {
                rfrshcIdx = 0, rfrshrIdx = 0;
                tmpSIndex = (mode === "sheet") ? sheetIdx : 1;
                if (isFindSelected) {
                    cell = selCells[0];
                    rfrshrIdx = selCells[0].rowIndex, rfrshcIdx = selCells[0].colIndex;
                }
                this._updateSelection(rfrshrIdx, rfrshcIdx, tmpSIndex);
                this._findCount++;
                if (this._compareValues(rfrshrIdx, rfrshcIdx, tmpSIndex, input, isCSen, isEMatch, type))
                    return true;
                else {
                    xlObj._intrnlReq = true;
                    isFinded = this._findNext(input, tmpSIndex, isCSen, isEMatch, type, mode, searchBy);
                    return isFinded;
                }

            }
            return false;
        },

        _findPrev: function (input, sIndex, isCSen, isEMatch, type, mode, searchBy) {
            var i, j, s, matched, tmpSIndex, isFinded, cell, selCells, len, rfrshcIdx, rfrshrIdx, rowIdx, colIdx, rowCount, evtArgs,
                colCount, isFindSelected = false, fRange = [], tmpRIdx = 0, tmpCIdx = 0, searchRows = searchBy === "rows", tmp,
                xlObj = this.XLObj, sheetIdx = sIndex ? sIndex : xlObj.getActiveSheetIndex(),
                actSheet = xlObj.getSheet(sheetIdx), usedRange = actSheet.usedRange,
                actCell = actSheet._activeCell, args = {
                    sheetIndex: sIndex,
                    value: input,
                    isCaseSensitive: isCSen,
                    isEntireMatch: isEMatch,
                    searchBy: searchBy,
                    mode: mode,
                    findType: type,
                    reqType: "findPrevious"
                };
            evtArgs = { sheetIndex: args.sheetIndex, value: args.value, isCaseSensitive: args.isCaseSensitive, isEntireMatch: args.isEntireMatch, searchBy: args.searchBy, mode: args.mode, findType: args.findType, reqType: args.reqType };
            if (xlObj._trigActionBegin(evtArgs))
                return true;
            if (xlObj.model.allowEditing && xlObj.XLEdit._isEdit)
                xlObj.XLEdit.saveCell();
            input = args.value;
            sIndex = args.sheetIndex;
            isCSen = args.isCaseSensitive;
            isEMatch = args.isEntireMatch;
            type = args.findType;
            mode = args.mode;
            searchBy = args.searchBy;
            selCells = actSheet._selectedCells;
            len = selCells.length;
            if (len === 1 || mode === "workbook")
                fRange = [actCell.rowIndex, actCell.colIndex, usedRange.rowIndex + 1, usedRange.colIndex + 1];
            else {
                cell = selCells[len - 1];
                fRange = [actCell.rowIndex, actCell.colIndex, cell.rowIndex, cell.colIndex];
                isFindSelected = true;
            }
            rowIdx = fRange[0], colIdx = fRange[1], rowCount = fRange[2], colCount = fRange[3];
            if (!searchRows) {
                tmp = rowIdx;
                rowIdx = colIdx;
                colIdx = tmp;
                tmp = rowCount;
                rowCount = colCount;
                colCount = tmp;
            }
            if (mode === "sheet") {
                if (isFindSelected) {
                    cell = selCells[0];
                    tmpRIdx = searchRows ? cell.rowIndex : cell.colIndex, tmpCIdx = searchRows ? cell.colIndex : cell.rowIndex;
                }
                for (i = rowIdx; i >= tmpRIdx; i--) {
                    if (i !== rowIdx)
                        colIdx = colCount;
                    for (j = colIdx; j >= tmpCIdx; j--) {
                        matched = this._compareValues(searchRows ? i : j, searchRows ? j : i, sheetIdx, input, isCSen, isEMatch, type);
                        if (matched) {
                            if (!(i === rowIdx && j === colIdx)) {
                                this._updateSelection(searchRows ? i : j, searchRows ? j : i);
                                this._findCount++;
                                args = { reqType: "findPrevious", activeCell: xlObj.getActiveCellElem() };
                                if (xlObj._trigActionComplete(args))
                                    return;
                                return true;
                            }
                        }
                    }
                }
            }
            else {
                for (s = sheetIdx; s >= 1; s--) {
                    usedRange = xlObj.model.sheets[s].usedRange;
                    if (s !== sheetIdx) {
                        rowCount = searchRows ? usedRange.rowIndex : usedRange.colIndex;
                        colCount = searchRows ? usedRange.colIndex : usedRange.rowIndex;
                        colIdx = colCount;
                        rowIdx = rowCount;
                    }
                    for (i = rowIdx; i >= 0; i--) {
                        if (i !== rowIdx)
                            colIdx = colCount + 1;
                        for (j = colIdx; j >= 0; j--) {
                            matched = this._compareValues(searchRows ? i : j, searchRows ? j : i, s, input, isCSen, isEMatch, type);
                            if (matched) {
                                if (!(s === sheetIdx && i === rowIdx && j === colIdx)) {
                                    this._updateSelection(searchRows ? i : j, searchRows ? j : i, s);
                                    this._findCount++;
                                    args = { reqType: "findPrevious", activeCell: xlObj.getActiveCellElem() };
                                    if (xlObj._trigActionComplete(args))
                                        return;
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            if (!this._findCount) {
                tmpSIndex = (mode === "sheet") ? sheetIdx : xlObj.model.sheetCount;
                rfrshrIdx = xlObj.model.sheets[tmpSIndex].usedRange.rowIndex, rfrshcIdx = xlObj.model.sheets[tmpSIndex].usedRange.colIndex;
                if (isFindSelected) {
                    cell = selCells[len - 1];
                    rfrshrIdx = cell.rowIndex, rfrshcIdx = cell.colIndex;
                }
                this._updateSelection(rfrshrIdx, rfrshcIdx, tmpSIndex);
                this._findCount++;
                if (this._compareValues(rfrshrIdx, rfrshcIdx, tmpSIndex, input, isCSen, isEMatch, type))
                    return true;
                else {
                    isFinded = this._findPrev(input, tmpSIndex, isCSen, isEMatch, type, mode, searchBy);
                    return isFinded;
                }
            }
            return false;
        },

        _compareValues: function (rowIdx, colIdx, sheetIdx, input, isCSen, isEMatch, type) {
            var xlObj = this.XLObj, value = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, null, sheetIdx) ? xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, null, sheetIdx).toString() : "";
            var isFormula = xlObj.isFormula(value) || (type === "formula" && value === "=");
            var isDateTime = xlObj._isDateTime(xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "value", sheetIdx));
            if (type === "value")
                if (isDateTime)
                    value = value ? this.caseSen[isCSen](xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "value2", sheetIdx)) : "";
                else
                    value = value && !isFormula ? this.caseSen[isCSen](value) : "";
            else if (type === "formula") {
                value = isFormula ? this.caseSen[isCSen](value) : "";
            }
            else
                value = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment", sheetIdx) ? this.caseSen[isCSen](xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment", sheetIdx).value) : "";
            input = this.caseSen[isCSen](input);
            return (this.isEMatch[isEMatch](value, input));
        },

        _replace: function (cell, sIndex, input1, input2, isCSen) {
            var xlObj = this.XLObj, cellElem, sheetIdx = xlObj.getActiveSheetIndex();
            if(xlObj.XLEdit.getPropertyValue(cell.rowIndex, cell.colIndex, "isLocked", sheetIdx))
               return false;
            var value = xlObj.XLEdit.getPropertyValue(cell.rowIndex, cell.colIndex, null, sIndex) ? xlObj.XLEdit.getPropertyValue(cell.rowIndex, cell.colIndex, null, sIndex).toString() : "", regx = new RegExp(input1.toString().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig"),
            newData = (value !== "" && input1 !== "") ? (isCSen ? value.replace(input1, input2) : value.replace(regx, input2)) : input2;
            if (!(sIndex === sheetIdx))
                xlObj.gotoPage(sIndex);
            xlObj.XLEdit._updateCellValue(cell, newData);
        },

        _replaceData: function (input1, input2, sIndex, isCSen, isEMatch, type, direction, mode, searchBy) {
            var details, prop ,cell, xlObj = this.XLObj, sheetIdx = sIndex ? sIndex : xlObj.model.activeSheetIndex, actSheet = xlObj.getSheet(sheetIdx), rowIdx = actSheet._activeCell.rowIndex, colIdx = actSheet._activeCell.colIndex, isFinded;
            if(!xlObj.model.allowEditing)
            return false;
            if (xlObj.model.allowLockCell && xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "isLocked", sheetIdx)) {
                xlObj._popUplockCellAlert();
                return;
            }
            if (xlObj.model.allowEditing && xlObj.XLEdit._isEdit)
                xlObj.XLEdit.saveCell();
            if (this._compareValues(rowIdx, colIdx, sheetIdx, input1, isCSen, isEMatch, type)) {
                prop = (type === "formula") ? "value" : "value2";
                details = { sheetIndex: sheetIdx, reqType: "find-replace", operation: "replace", rowIndex: rowIdx, colIndex: colIdx, sIndex: sIndex };
                details.prevData = { value: xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, prop) };
                this._replace({ rowIndex: rowIdx, colIndex: colIdx }, sIndex, input1, input2, isCSen);
                details.newData = { value: xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, prop) };
                this._findCount = 0;
                isFinded = direction === "up" ? this._findPrev(input1, sheetIdx, isCSen, isEMatch, type, mode, searchBy) : this._findNext(input1, sheetIdx, isCSen, isEMatch, type, mode, searchBy);
                if (!isFinded)
                    this._updateSelection(rowIdx, colIdx, sheetIdx);
                if (!xlObj._isUndoRedo) {
                    xlObj._completeAction(details);
                    xlObj._trigActionComplete(details);
                }
            }
            else
                xlObj._showAlertDlg("Alert", "ReplaceNotFound", "");

        },

        _replaceAllData: function (input1, input2, isCSen, isEMatch, type, sType) {
            var details, cell, prop , cellInfo, selCells = [], skipCount = 0, sheetProtected = false, curSheet, xlObj = this.XLObj, sheetCount = xlObj.model.sheetCount, sheetIdx = xlObj.model.activeSheetIndex, actSheet = xlObj.getSheet(sheetIdx), usedRange = actSheet.usedRange, rowIdx = actSheet._activeCell.rowIndex, colIdx = actSheet._activeCell.colIndex, i, j, s, m, n, count = 0;
            details = { sheetIndex: sheetIdx, reqType: "find-replace", operation: "replaceAll", isCSen: isCSen, isEMatch: isEMatch };
            prop = (type === "formula") ? "value" : "value2";
            if(!xlObj.model.allowEditing)
              return false;
		    xlObj._dupDetails = true;
            if (xlObj.model.allowEditing && xlObj.XLEdit._isEdit)
                xlObj.XLEdit.saveCell();
            if (sType === "sheet") {
                if (xlObj.model.allowLockCell && actSheet.isSheetProtected)
                    sheetProtected = true;
                else {
                    for (i = 0, m = usedRange.rowIndex + 1; i < m; i++) {
                        for (j = 0, n = usedRange.colIndex + 1; j < n; j++)
                            if (this._compareValues(i, j, sheetIdx, input1, isCSen, isEMatch, type)) {
                                cellInfo = { rowIndex: i, colIndex: j, prevData: { value: xlObj.XLEdit.getPropertyValue(i, j, prop) }, sheetIndex: sheetIdx };
                                this._replace({ rowIndex: i, colIndex: j }, sheetIdx, input1, input2, isCSen);
                                count++;
                                cellInfo.newData = { value: xlObj.XLEdit.getPropertyValue(i, j, prop) };
                                selCells.push(cellInfo);
                            }
                    }
                }
            }
            else {
                for (s = 1; s <= sheetCount; s++) {
                    curSheet = xlObj.model.sheets[s];
                    if (xlObj.model.allowLockCell && curSheet.isSheetProtected) {
                        skipCount++;
                        continue;
                    }
                    usedRange = curSheet.usedRange;
                    for (i = 0, m = usedRange.rowIndex + 1; i < m; i++) {
                        for (j = 0, n = usedRange.colIndex + 1; j < n; j++)
                            if (this._compareValues(i, j, s, input1, isCSen, isEMatch, type)) {
                                cellInfo = { rowIndex: i, colIndex: j, prevData: { value: xlObj.XLEdit.getPropertyValue(i, j, prop,s) }, sheetIndex: s };
                                this._replace({ rowIndex: i, colIndex: j }, s, input1, input2, isCSen);
                                count++;
                                cellInfo.newData = { value: xlObj.XLEdit.getPropertyValue(i, j, prop) };
                                selCells.push(cellInfo);
                            }
                    }
                }
            }
            if (sheetProtected || skipCount === sheetCount) {
                xlObj._popUplockCellAlert();
                return;
            }
			xlObj._dupDetails = false;
            details.selectedCell = selCells;
            this._updateSelection(rowIdx, colIdx);
            if (!xlObj._isUndoRedo) {
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
            xlObj.hideWaitingPopUp();
            var alertText = xlObj._getLocStr("ReplaceData").split("/");
            alertText = "T-" + alertText[0] + count + " " + alertText[1];
            $("#" + xlObj._id + "_FRDialog").ejDialog("close");
            xlObj._showAlertDlg("Alert", alertText, "", 325);
        },

        _updateSelection: function (rowIdx, colIdx, sIndex) {
            var cellIdx = { rowIndex: rowIdx, colIndex: colIdx }, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx);
            if (!sIndex)
                sIndex = sheetIdx;
            if (sIndex && sIndex !== sheetIdx)
                xlObj.gotoPage(sIndex, false);
            if (xlObj.getSheetElement(sheetIdx).find(".e-selected:visible").length < 2 || !xlObj.inRange(sheet.selectedRange, rowIdx, colIdx)) {
                xlObj.setActiveCell(cellIdx.rowIndex, cellIdx.colIndex, sIndex);
                xlObj.XLSelection.selectRange(cellIdx, cellIdx);
                sheet._startCell = cellIdx;
                sheet._endCell = cellIdx;
            }
            else {
                xlObj.XLCellNav._updateActiveCell(rowIdx, colIdx);
            }
            if (xlObj.model.scrollSettings.allowScrolling)
                if (xlObj._isFrozen(sheet.frozenRows) || xlObj._isFrozen(sheet.frozenColumns)) 
                    this._freezeScroll(cellIdx.rowIndex, cellIdx.colIndex, sheet);
                else
                    xlObj.XLScroll._scrollSelectedPosition(sIndex, xlObj.getActiveCell(sIndex));
            if (xlObj.model.allowAutoFill)
                xlObj.XLDragFill.positionAutoFillElement();
        },
 
        //GoTo
        _getSelRangeDetails: function (selected) {
            var rowIdx = selected[selected.length - 1].rowIndex - selected[0].rowIndex, colIdx = selected[selected.length - 1].colIndex - selected[0].colIndex;
            var startRow = selected[0].rowIndex, startCol = selected[0].colIndex;
            return [rowIdx, colIdx, startRow, startCol];
        },

        goTo: function (range) {
            var xlObj = this.XLObj;
            if (xlObj.model.isReadOnly)
                return;
            xlObj._showDialog(xlObj._id + "_Ribbon_Others_Editing_FindSelect");
            if (range.startsWith("="))
                range = range.split("=")[1];
            var isApply, lbObj, rangeCells, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), startCell, endCell, txt = xlObj._getDollarAlphaRange(sheet.selectedRange);
            var temp = xlObj.XLRibbon._getAddrFromDollarAddr(range);
            range = temp[1];
            temp[0] && xlObj.gotoPage(temp[0], false);
            range = xlObj.getRangeIndices(range), rangeCells = xlObj._getSelectedRange({ rowIndex: range[0], colIndex: range[1] }, { rowIndex: range[2], colIndex: range[3] });
            startCell = rangeCells[0];
            endCell = rangeCells[rangeCells.length - 1];
            xlObj.setActiveCell(startCell.rowIndex, startCell.colIndex);
            xlObj.model.allowSelection && xlObj.XLSelection.selectRange(startCell, endCell);
            if (xlObj._isFrozen(sheet.frozenRows) || xlObj._isFrozen(sheet.frozenColumns)) 
                this._freezeScroll(startCell.rowIndex, startCell.colIndex, sheet);
            else
                xlObj.XLScroll._scrollSelectedPosition(xlObj.getActiveSheetIndex(), startCell);
			xlObj.XLDragFill && xlObj.XLDragFill.positionAutoFillElement();
            sheet._startCell = startCell;
            sheet._endCell = endCell;
            xlObj._setSheetFocus();
            isApply = $.grep(xlObj.XLRibbon._addrList, function (e) {
                return e.value === txt;
            });
            if (isApply.length < 1) {
                xlObj.XLRibbon._addrList.push({ value: txt, text: txt });
                lbObj = $("#" + xlObj._id + "_GotoAddr").data("ejListBox");
                xlObj.XLRibbon._addrList = JSON.parse(JSON.stringify(xlObj.XLRibbon._addrList));
                lbObj.model.dataSource = xlObj.XLRibbon._addrList;
                lbObj.option("fields", { dataSource: xlObj.XLRibbon._addrList });
            }
        },

        goToSpecial: function (type, options){
            this._applyGoToRule(type, options.isNumber, options.isText, options.isLogical, options.isError);
        },

        _applyGoToRule: function (type, isNumber, isText, isLogical, isError) {
            var xlObj = this.XLObj;
            xlObj.showWaitingPopUp();
            switch (type) {
                case "blanks":
                    this._applyGotoBlanks();
                    break;
                case "formulas":
                    this._applyGotoFormulas(isNumber, isText, isLogical, isError);
                    break;
                case "comments":
                    this._applyGotoComments();
                    break;
                case "datavalidation":
                    this._applyGotoValidation();
                    break;
                case "cformat":
                    this._applyGotoCFormat();
                    break;
                case "lastcell":
                    var sheetIdx = xlObj.getActiveSheetIndex(), usedRange = xlObj.model.sheets[sheetIdx].usedRange;
                    xlObj.XLSelection.selectRange({ rowIndex: usedRange.rowIndex, colIndex: usedRange.colIndex }, { rowIndex: usedRange.rowIndex, colIndex: usedRange.colIndex });
                    this._updateSelection(usedRange.rowIndex, usedRange.colIndex, sheetIdx);
                    break;
                case "constants":
                    this._applyGotoConstants(isNumber, isText, isLogical, isError);
                    break;
                case "rowdiff":
                    this._applyGotoRowDiff();
                    break;
                case "coldiff":
                    this._applyGotoColDiff();
                    break;
                case "visiblecells":
                    break;
            }
            xlObj.hideWaitingPopUp();
        },

        _applyGotoBlanks: function () {
            var i, j, cell, lastcell, goToLen, rIdx, cIdx, isViewed = false, selCells = [], temp, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(),
                usedRange = xlObj.model.sheets[sheetIdx].usedRange, value, rowIdx = usedRange.rowIndex, colIdx = usedRange.colIndex,
                sheet=xlObj.getSheet(sheetIdx),selected = sheet._selectedCells, startRow = 0, startCol = 0,
                details = { sheetIndex: sheetIdx, reqType: "find-replace", operation: "blanks" };
            sheet._goToCollection = { multiple: false, selected: [] };
            if (selected.length > 1) {
                temp = this._getSelRangeDetails(selected);
                rowIdx = temp[0];
                colIdx = temp[1];
                startRow = temp[2];
                startCol = temp[3];
                sheet._goToCollection.multiple = true;
            }
            for (i = 0; i <= rowIdx; i++) {
                for (j = 0; j <= colIdx; j++) {
                    rIdx = i + startRow, cIdx = j + startCol;
                    value = xlObj.XLEdit.getPropertyValue(rIdx, cIdx) ? xlObj.XLEdit.getPropertyValue(rIdx, cIdx).toString() : "";
                    if (xlObj._isRowViewable(sheetIdx, rIdx)) {
                        cell = xlObj.getCell(rIdx, cIdx, sheetIdx);
                        isViewed = true;
                    }
                    if (!value.length) {
                        selCells.push({ rowIndex: rIdx, colIndex: cIdx, isApply: true });
                        if (xlObj.model.scrollSettings.allowVirtualScrolling)
                            sheet._goToCollection.selected.push(rIdx + ":" + cIdx);
                        if (isViewed) {
                            cell.addClass("e-selected");
                            lastcell = [rIdx, cIdx];
                        }
                    } else {
                        if (isViewed)
                            cell.removeClass("e-selected");                      
                    }
                }
                isViewed = false;
            }
            goToLen = sheet._goToCollection.selected.length;
            if ((xlObj._isFrozen(sheet.frozenRows) || xlObj._isFrozen(sheet.frozenColumns))) {
                if (goToLen)
                    lastcell = sheet._goToCollection.selected[goToLen - 1].split(":");
                if (lastcell && lastcell.length)
                    this._freezeScroll(lastcell[0], lastcell[1], sheet);
            }
            details.selectedCell = selCells;
            if (!xlObj._isUndoRedo) {
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
        },

        _applyGotoComments: function () {
            var i, j, cell, lastcell, goToLen, rIdx, cIdx, isViewed = false, selCells = [], temp, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), usedRange = xlObj.getSheet(sheetIdx).usedRange,
                value, rowIdx = usedRange.rowIndex, colIdx = usedRange.colIndex, sheet = xlObj.getSheet(sheetIdx), selected = sheet._selectedCells, startRow = 0, startCol = 0;
            var details = { sheetIndex: sheetIdx, reqType: "find-replace", operation: "comments" };
            sheet._goToCollection = { multiple: false, selected: [] };
            this._isApplied = false;
            if (selected.length > 1) {
                temp = this._getSelRangeDetails(selected);
                rowIdx = temp[0];
                colIdx = temp[1];
                startRow = temp[2];
                startCol = temp[3];
                sheet._goToCollection.multiple = true;
            }
            for (i = 0; i <= rowIdx; i++) {
                for (j = 0; j <= colIdx; j++) {
                    rIdx = i + startRow, cIdx = j + startCol;
                    value = xlObj.XLEdit.getPropertyValue(rIdx, cIdx, "comment");
                    if (xlObj._isRowViewable(sheetIdx, rIdx)) {
                        cell = xlObj.getCell(rIdx, cIdx, sheetIdx);
                        isViewed = true;
                    }
                    if (!ej.isNullOrUndefined(value)) {
                        selCells.push({ rowIndex: rIdx, colIndex: cIdx, isApply: true });
                        if (xlObj.model.scrollSettings.allowVirtualScrolling)
                            sheet._goToCollection.selected.push(rIdx + ":" + cIdx);
                        if (isViewed) {
                            cell.addClass("e-selected");
                            this._isApplied = true;
                            lastcell = [rIdx, cIdx];
                        }
                    } else {
                        if (isViewed)
                            cell.removeClass("e-selected");                         
                    }
                }
                isViewed = false;
            }
            goToLen = sheet._goToCollection.selected.length;
            if ((xlObj._isFrozen(sheet.frozenRows) || xlObj._isFrozen(sheet.frozenColumns))) {
                if (goToLen)
                    lastcell = sheet._goToCollection.selected[goToLen - 1].split(":");
                if (lastcell && lastcell.length)
                    this._freezeScroll(lastcell[0], lastcell[1], sheet);
            }
            if (!this._isApplied && !goToLen)
                xlObj._showAlertDlg("Alert", "NoCellFound", "", 200);          
            details.selectedCell = selCells;
            if (!xlObj._isUndoRedo && this._isApplied) {
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
        },

        _applyGotoFormulas: function (isNumber, isText, isLogical, isError) {
            var i, j, cell, rIdx, cIdx, lastcell, goToLen, isViewed = false, selCells = [], temp, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(),
                value, value2, isFormula, usedRange = xlObj.model.sheets[sheetIdx].usedRange, rowIdx = usedRange.rowIndex,
                colIdx = usedRange.colIndex, sheet=xlObj.getSheet(sheetIdx) , selected = sheet._selectedCells, startRow = 0, startCol = 0,
                details = { sheetIndex: sheetIdx, reqType: "find-replace", operation: "formulas" };
            sheet._goToCollection = { multiple: false, selected: [] };
            this._isApplied = false;
            if (selected.length > 1) {
                temp = this._getSelRangeDetails(selected);
                rowIdx = temp[0];
                colIdx = temp[1];
                startRow = temp[2];
                startCol = temp[3];
                sheet._goToCollection.multiple = true;
            }
            for (i = 0; i <= rowIdx; i++) {
                for (j = 0; j <= colIdx; j++) {
                    rIdx = i + startRow, cIdx = j + startCol;
                    value = !ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(rIdx, cIdx)) ? xlObj.XLEdit.getPropertyValue(rIdx, j + startCol).toString() : "";
                    value2 = !ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(rIdx, cIdx, "value2")) ? xlObj.XLEdit.getPropertyValue(rIdx, cIdx, "value2").toString() : "";
                    isFormula = value.charAt(0) === "=" && typeof value2 === "string";
                    if (xlObj._isRowViewable(sheetIdx, rIdx)) {
                        cell = xlObj.getCell(rIdx, cIdx, sheetIdx);
                        isViewed = true;
                    }
                    if (isFormula && ((isNumber && ($.isNumeric(value2))) || (isText && (!(value2.toLowerCase() === "true" || value2.toLowerCase() === "false") && !$.isNumeric(value2) && !(value2.length !== 0 && (value2.indexOf("#") === 0 && value2.lastIndexOf("?") === value2.length - 1) && value2.length > 0))) || (isLogical && (value2.toLowerCase() === "true" || value2.toLowerCase() === "false")) || (isError && value2.length !== 0 && (xlObj._calcEngine.getErrorStrings().indexOf(value2) > -1)))) {
                        selCells.push({ rowIndex: rIdx, colIndex: cIdx, isApply: true });
                        if (xlObj.model.scrollSettings.allowVirtualScrolling)
                            sheet._goToCollection.selected.push(rIdx + ":" + cIdx);
                        if (isViewed) {
                            cell.addClass("e-selected");
                            this._isApplied = true;
                            lastcell = [rIdx, cIdx];
                        }
                    } else {
                        if (isViewed) 
                            cell.removeClass("e-selected");
                    }
                }
                isViewed = false;
            }
            goToLen = sheet._goToCollection.selected.length;
            if ((xlObj._isFrozen(sheet.frozenRows) || xlObj._isFrozen(sheet.frozenColumns))) {
                if(goToLen)
                    lastcell = sheet._goToCollection.selected[goToLen - 1].split(":");
                if (lastcell && lastcell.length)
                    this._freezeScroll(lastcell[0], lastcell[1], sheet);
            }
            if (!this._isApplied && !goToLen)
                xlObj._showAlertDlg("Alert", "NoCellFound", "", 200);         
            details.selectedCell = selCells;
            if (!xlObj._isUndoRedo && this._isApplied) {
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
        },

        _applyGotoValidation: function () {
            var i, j, cell, rIdx, cIdx, lastcell, goToLen, isViewed = false, selCells = [], temp, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(),
                usedRange = xlObj.model.sheets[sheetIdx].usedRange, value, rowIdx = usedRange.rowIndex, colIdx = usedRange.colIndex,
                sheet=xlObj.getSheet(sheetIdx) , selected = sheet._selectedCells, startRow = 0, startCol = 0,
                details = { sheetIndex: sheetIdx, reqType: "find-replace", operation: "validations" };
            this._isApplied = false;
            sheet._goToCollection = {multiple:false,selected:[]};
            if (selected.length > 1) {
                temp = this._getSelRangeDetails(selected);
                rowIdx = temp[0];
                colIdx = temp[1];
                startRow = temp[2];
                startCol = temp[3];
                sheet._goToCollection.multiple = true;
            }
            for (i = 0; i <= rowIdx; i++) {
                for (j = 0; j <= colIdx; j++) {
                    rIdx = i + startRow, cIdx = j + startCol;
                    value = xlObj.XLEdit.getPropertyValue(rIdx, cIdx, "rule");
                    if (xlObj._isRowViewable(sheetIdx, rIdx)) {
                        cell = xlObj.getCell(rIdx, cIdx, sheetIdx);
                        isViewed = true;
                    }
                    if (!ej.isNullOrUndefined(value)) {
                        selCells.push({ rowIndex: rIdx , colIndex: cIdx , isApply: true });
                        if (xlObj.model.scrollSettings.allowVirtualScrolling)
                            sheet._goToCollection.selected.push(rIdx + ":" + cIdx);
                        if (isViewed) {
                            cell.addClass("e-selected");
                            this._isApplied = true;
                            lastcell = [rIdx, cIdx];
                        }
                    } else {
                        if (isViewed)
                            cell.removeClass("e-selected");                   
                    }
                }
                isViewed = false;
            }
            goToLen = sheet._goToCollection.selected.length;
            if ((xlObj._isFrozen(sheet.frozenRows) || xlObj._isFrozen(sheet.frozenColumns))) {
                if (goToLen)
                    lastcell = sheet._goToCollection.selected[goToLen - 1].split(":");
                if (lastcell && lastcell.length)
                    this._freezeScroll(lastcell[0], lastcell[1], sheet);
            }
            if (!this._isApplied && !goToLen)
                xlObj._showAlertDlg("Alert", "NoCellFound", "", 200);          
            details.selectedCell = selCells;
            if (!xlObj._isUndoRedo && this._isApplied) {
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
        },

        _applyGotoCFormat: function () {
            var i, j, cell, rIdx, cIdx, lastcell, goToLen, isViewed = false, selCells = [], temp, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(),
                usedRange = xlObj.model.sheets[sheetIdx].usedRange, value, rowIdx = usedRange.rowIndex, colIdx = usedRange.colIndex,
                sheet = xlObj.getSheet(sheetIdx), selected = sheet._selectedCells, startRow = 0, startCol = 0,
                details = { sheetIndex: sheetIdx, reqType: "find-replace", operation: "conditions" };
            this._isApplied = false;
            sheet._goToCollection = {multiple:false,selected:[]};
            if (selected.length > 1) {
                temp = this._getSelRangeDetails(selected);
                rowIdx = temp[0];
                colIdx = temp[1];
                startRow = temp[2];
                startCol = temp[3];
                sheet._goToCollection.multiple = true;
            }
            for (i = 0; i <= rowIdx; i++) {
                for (j = 0; j <= colIdx; j++) {
                    rIdx=i + startRow,cIdx=j + startCol;
                    value = xlObj.XLEdit.getPropertyValue(rIdx,cIdx, "cFormatRule");
                    if (xlObj._isRowViewable(sheetIdx, rIdx)) {
                        cell = xlObj.getCell(rIdx, cIdx, sheetIdx);
                        isViewed = true;
                    }
                    if (!ej.isNullOrUndefined(value) && value.length) {
                        selCells.push({ rowIndex: rIdx, colIndex: cIdx, isApply: true });
                        if(xlObj.model.scrollSettings.allowVirtualScrolling) 
                            sheet._goToCollection.selected.push(rIdx + ":" + cIdx);
                        if (isViewed) {
                            cell.addClass("e-selected");
                            this._isApplied = true;
                            lastcell = [rIdx, cIdx];
                        }
                    } else {
                        if (isViewed) 
                            cell.removeClass("e-selected");
                    }
                }
                isViewed = false;
            }
            goToLen = sheet._goToCollection.selected.length;
            if ((xlObj._isFrozen(sheet.frozenRows) || xlObj._isFrozen(sheet.frozenColumns))) {
                if (goToLen)
                    lastcell = sheet._goToCollection.selected[goToLen - 1].split(":");
                if (lastcell && lastcell.length)
                    this._freezeScroll(lastcell[0], lastcell[1], sheet);
            }
            if (!this._isApplied && !goToLen)
                xlObj._showAlertDlg("Alert", "NoCellFound", "", 200);           
            details.selectedCell = selCells;
            if (!xlObj._isUndoRedo && this._isApplied) {
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
        },

        _applyGotoConstants: function (isNumber, isText, isLogical, isError) {
            var i, j, cell, rIdx, cIdx, lastcell, goToLen, isViewed = false, selCells = [], isFormula, temp, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(),
                value, value2, usedRange = xlObj.model.sheets[sheetIdx].usedRange, rowIdx = usedRange.rowIndex, colIdx = usedRange.colIndex,
                sheet = xlObj.getSheet(sheetIdx), selected = sheet._selectedCells, startRow = 0, startCol = 0;
            this._isApplied = false;
            sheet._goToCollection = { multiple: false, selected: [] };
            if (selected.length > 1) {
                temp = this._getSelRangeDetails(selected);
                rowIdx = temp[0];
                colIdx = temp[1];
                startRow = temp[2];
                startCol = temp[3];
                sheet._goToCollection.multiple = true;
            }
            for (i = 0; i <= rowIdx; i++) {
                for (j = 0; j <= colIdx; j++) {
                    rIdx=i + startRow,cIdx=j + startCol;
                    value = ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(rIdx,cIdx )) ? "" : xlObj.XLEdit.getPropertyValue(rIdx, cIdx).toString();
                    value2 = ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(rIdx, cIdx, "value2")) ? "" : xlObj.XLEdit.getPropertyValue(rIdx, cIdx, "value2").toString();
                    isFormula = value.charAt(0) === "=" && typeof value2 === "string";
                    if (xlObj._isRowViewable(sheetIdx, rIdx)) {
                        cell = xlObj.getCell(rIdx, cIdx, sheetIdx);
                        isViewed = true;
                    }
                    if (!isFormula && ((isNumber && ($.isNumeric(value))) || (isText && (!(value.toLowerCase() === "true" || value.toLowerCase() === "false") && !$.isNumeric(value) && value.length > 0)) || (isLogical && (value.toLowerCase() === "true" || value.toLowerCase() === "false") || (isError && value2.length !== 0 && (value2.indexOf("#") === 0 ))))) {
                        selCells.push({ rowIndex: rIdx, colIndex: cIdx, isApply: true });
                        if (xlObj.model.scrollSettings.allowVirtualScrolling)
                            sheet._goToCollection.selected.push(rIdx + ":" + cIdx);

                        if (isViewed) {
                            cell.addClass("e-selected");
                            this._isApplied = true;
                            lastcell = [rIdx, cIdx];
                        }
                    } else {
                        if (isViewed) 
                            cell.removeClass("e-selected");                           
                    }
                }
                isViewed = false;
            }
            goToLen = sheet._goToCollection.selected.length;
            if ((xlObj._isFrozen(sheet.frozenRows) || xlObj._isFrozen(sheet.frozenColumns))) {
                if (goToLen)
                    lastcell = sheet._goToCollection.selected[goToLen - 1].split(":");
                if (lastcell && lastcell.length)
                    this._freezeScroll(lastcell[0], lastcell[1], sheet);
            }
            if (!this._isApplied && !goToLen)
                xlObj._showAlertDlg("Alert", "NoCellFound", "", 200);
        },

        _applyGotoColDiff: function () {
            var i, j, cell, cIdx, rIdx, lastcell, goToLen, isViewed = false, selCells = [], temp, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(),
                usedRange = xlObj.model.sheets[sheetIdx].usedRange, value, rowIdx = usedRange.rowIndex, colIdx = usedRange.colIndex,
                sheet=xlObj.getSheet(sheetIdx), selected = sheet._selectedCells, startRow = 0, startCol = 0,
               details = { sheetIndex: sheetIdx, reqType: "find-replace", operation: "coldiff" }, result;
            this._isApplied = false;
            sheet._goToCollection = { multiple: false, selected: [] };
            if (selected.length > 1) {
                temp = this._getSelRangeDetails(selected);
                rowIdx = temp[0];
                colIdx = temp[1];
                startRow = temp[2];
                startCol = temp[3];
                sheet._goToCollection.multiple = true;
                for (i = 0; i <= colIdx; i++) {
                    cIdx=i + startCol;
                    result = xlObj.XLEdit.getPropertyValue(startRow, cIdx) ? xlObj.XLEdit.getPropertyValue(startRow, cIdx).toString() : "";
                    for (j = 0; j <= rowIdx; j++) {
                        rIdx = j + startRow;
                        value = xlObj.XLEdit.getPropertyValue(rIdx, cIdx) ? xlObj.XLEdit.getPropertyValue(rIdx, cIdx).toString() : "";
                        if (xlObj._isRowViewable(sheetIdx, rIdx)) {
                            cell = xlObj.getCell(rIdx, cIdx, sheetIdx);
                            isViewed = true;
                        }
                        if (value === result) {
                            if (isViewed)
                                cell.removeClass("e-selected");
                        }
                        else {
                            selCells.push({ rowIndex: rIdx, colIndex: cIdx, isApply: true });
                            if (xlObj.model.scrollSettings.allowVirtualScrolling)
                                sheet._goToCollection.selected.push(rIdx+":"+cIdx);
                            if (isViewed) {
                                cell.addClass("e-selected");
                                this._isApplied = true;
                                lastcell = [rIdx, cIdx];
                            }
                        }
                    }
                    isViewed = false;
                }
            }
            goToLen = sheet._goToCollection.selected.length;
            if ((xlObj._isFrozen(sheet.frozenRows) || xlObj._isFrozen(sheet.frozenColumns))) {
                if (goToLen)
                    lastcell = sheet._goToCollection.selected[goToLen - 1].split(":");
                if (lastcell && lastcell.length)
                    this._freezeScroll(lastcell[0], lastcell[1], sheet);
            }
            if (!this._isApplied && !goToLen)
                xlObj._showAlertDlg("Alert", "NoCellFound", "", 200);      
            details.selectedCell = selCells;
            if (!xlObj._isUndoRedo && this._isApplied) {
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
        },
        _applyGotoRowDiff: function () {
            var i, j, cell, lastcell, goToLen, rIdx, cIdx, isViewed = false, selCells = [], temp, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(),
                usedRange = xlObj.model.sheets[sheetIdx].usedRange, value, rowIdx = usedRange.rowIndex, colIdx = usedRange.colIndex,
                sheet=xlObj.getSheet(sheetIdx), selected = sheet._selectedCells, startRow = 0, startCol = 0, result,
                details = { sheetIndex: sheetIdx, reqType: "find-replace", operation: "rowdiff" };
            this._isApplied = false;
            sheet._goToCollection = { multiple: false, selected: [] };
            if (selected.length > 1) {
                temp = this._getSelRangeDetails(selected);
                rowIdx = temp[0];
                colIdx = temp[1];
                startRow = temp[2];
                startCol = temp[3];
                sheet._goToCollection.multiple = true;
                for (i = 0; i <= rowIdx; i++) {
                    rIdx = i + startRow;
                    result = xlObj.XLEdit.getPropertyValue(rIdx, startCol) ? xlObj.XLEdit.getPropertyValue(rIdx, startCol).toString() : "";
                    for (j = 0; j <= colIdx; j++) {
                        cIdx = j + startCol;
                        value = xlObj.XLEdit.getPropertyValue(rIdx, cIdx) ? xlObj.XLEdit.getPropertyValue(rIdx, cIdx).toString() : "";
                        if (xlObj._isRowViewable(sheetIdx, rIdx)) {
                            cell = xlObj.getCell(rIdx, cIdx, sheetIdx);
                            isViewed = true;
                        }
                        if (value === result) {
                            if (isViewed)
                                cell.removeClass("e-selected");                          
                        }
                        else {
                            selCells.push({ rowIndex: rIdx, colIndex: cIdx, isApply: true });
                            if (xlObj.model.scrollSettings.allowVirtualScrolling)
                                sheet._goToCollection.selected.push(rIdx + ":" + cIdx);
                            if (isViewed) {
                                cell.addClass("e-selected");
                                this._isApplied = true;
                                lastcell = [rIdx, cIdx];
                            }
                        }
                    }
                    isViewed = false;
                }
            }
            goToLen = sheet._goToCollection.selected.length;
            if ((xlObj._isFrozen(sheet.frozenRows) || xlObj._isFrozen(sheet.frozenColumns))) {
                if (goToLen)
                    lastcell = sheet._goToCollection.selected[goToLen - 1].split(":");
                if (lastcell && lastcell.length)
                    this._freezeScroll(lastcell[0], lastcell[1], sheet);
            }
            if (!this._isApplied && !goToLen)
                xlObj._showAlertDlg("Alert", "NoCellFound", "", 200);
            details.selectedCell = selCells;
            if (!xlObj._isUndoRedo && this._isApplied) {
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
        },
        _freezeScroll: function (rowIdx, colIdx, sheet) { // To scroll last found cell when rows and columns are freezed
            var diff, xlObj = this.XLObj;
            diff = xlObj._getIdxWithOffset(rowIdx, colIdx, false, ["freeze"]);
            if (sheet._ftopRowIdx > rowIdx || rowIdx > sheet._bottomRow.idx)
                xlObj._scrollContent({ y: (diff.yOffset - sheet._frozenHeight) + 1 }, true);
            if (sheet._fleftColIdx > colIdx || colIdx > sheet._rightCol.idx)
                xlObj._scrollContent({ x: ((diff.xOffset) - sheet._frozenWidth) + 1 }, true);
        }
    };
})(jQuery, Syncfusion);

$.fn.setInputPos = function (start, end) {
    if (!end) end = start;
    if ($(this).is(":visible")) {
        return this.each(function () {
            if (this.setSelectionRange) {
                this.focus();
                this.setSelectionRange(start, end);
            } else if (this.createTextRange) {
                var range = this.createTextRange();
                range.collapse(true);
                range.moveEnd("character", end);
                range.moveStart("character", start);
                range.select();
            }
        });
    }
};