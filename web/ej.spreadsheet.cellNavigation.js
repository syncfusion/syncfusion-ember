(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.cellNavigation = function (obj) {
        this.XLObj = obj;
        this._canKeyBoardNavigate = true;
        this._isNavigate = true;
    };

    ej.spreadsheetFeatures.cellNavigation.prototype = {
        _selectionKeyDownHandler: function (e) {
            var val, selRange, scell, cellInfo, ecell, range, classname, obj, startCell, isRowcolSel, isMergeCell = false, cells = [], xlObj = this.XLObj,
                sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), keyCode = e.keyCode, shiftKey = e.shiftKey,
                ctrlKey = e.ctrlKey, key = { keyCode: keyCode, shiftKey: shiftKey, ctrlKey: ctrlKey, altKey: e.altKey }, _isChanged = false,
                activecell = sheet._activeCell, endCell = sheet._endCell, rowCount = sheet.rowCount, colCount = sheet.colCount, container = xlObj._dataContainer, rowdata, i, j, usedrange = sheet.usedRange;
            if (((keyCode === 9 && this._canKeyBoardNavigate) || keyCode === 13) && !ctrlKey) { // tab & Enter Key
                e.preventDefault(); // to prevent default browser actions
                val = xlObj.XLEdit.getCurrentEditCellData();
                if (xlObj.isFormula(val) && !xlObj.XLEdit._formulaValidate(val))
                    return;
                if (xlObj.XLEdit._isFormulaEdit && !xlObj._isFormulaSuggestion) {
                    if (val.length > 1) {
                        if (!this._isValidParameter(val)) {
                            xlObj._showAlertDlg("Alert", "MissingParenthesisAlert", "FormulaAlert", 440);
                            return;
                        }
                        else {
                            if (!xlObj.isFormula(val)) {
                                val = val + ")";
								if(val.split("(").length!== val.split(")").length){
								  xlObj._showAlertDlg("Alert", "MissingParenthesisAlert", "FormulaAlert", 440);
                                 return;
							}
                                xlObj.XLEdit._editElem.text(val);
                                if(xlObj.model.allowFormulaBar)
                                xlObj._getInputBox().val(val);
                            }
                            xlObj.XLEdit.saveCell();
                            xlObj._getContent(sheetIdx).find("td").removeClass(xlObj._formulaBorder.join(" ").replace(/,/g, " ") + " " + xlObj._ctrlFormulaBorder.join(" ").replace(/,/g, " "));
                            xlObj.XLSelection._cleanUp();
                            xlObj.XLSelection.selectRange(sheet._activeCell, sheet._activeCell);
                            xlObj.XLEdit._isFormulaEdit = false;
                            xlObj._formulaRange = [];
                            xlObj._ctrlKeyCount = 0;
                        }
                    }
                    else {
                        xlObj.XLEdit.saveCell();
                        xlObj.XLEdit._isFormulaEdit = false;
                    }
                }
                else if (keyCode === 9 && xlObj.XLEdit._isEdit)
                    xlObj.XLEdit.saveCell();
                selRange = sheet.selectedRange;
                isRowcolSel = sheet._isRowSelected || sheet._isColSelected;
                if (isRowcolSel) {
                    if (selRange[0] === selRange[2] || selRange[1] === selRange[3])
                        cells.push({ rowIndex: selRange[0], colIndex: selRange[1] });
                    else
                        cells = sheet._selectedCells;
                }
                else
                    cells = sheet._selectedCells;
                if (cells.length) {
                    if (cells.length === 1 || (!isRowcolSel && this._isRangeMerged(cells))) {
                        if (sheet._isRowSelected) {
                            if (shiftKey) {
                                if (activecell.colIndex > 0)
                                    this._navigateRow("Backward", key);
                            }
                            else {
                                if (activecell.colIndex < 39)
                                    this._navigateRow("Forward", key);
                            }
                        }
                        else if (sheet._isColSelected) {
                            if (shiftKey) {
                                if (activecell.rowIndex > 0)
                                    this._navigateCol("Backward", key);
                            }
                            else {
                                if (activecell.rowIndex < 39)
                                    this._navigateCol("Forward", key);
                            }
                        }
                        else {
                            if (shiftKey) {
                                if (keyCode === 9 && activecell.colIndex > 0)
                                    this._navigateCell(activecell.rowIndex, activecell.colIndex - 1, key); //shifttab
                                else if (keyCode === 13 && activecell.rowIndex > 0)
                                    this._navigateCell(activecell.rowIndex - 1, activecell.colIndex, key); //shiftenter
                            }
                            else {
                                if (keyCode === 9 && activecell.colIndex < colCount)
                                    this._navigateCell(activecell.rowIndex, activecell.colIndex + 1, key); //tab
                                else if (keyCode === 13 && activecell.rowIndex < rowCount)
                                    this._navigateCell(activecell.rowIndex + 1, activecell.colIndex, key); //enter
                            }
                        }
                    }
                    else {
                        if (shiftKey)
                            keyCode === 9 ? this._navigateRange("ShiftTab", key) : this._navigateRange("ShiftEnter", key);
                        else
                            keyCode === 9 ? this._navigateRange("Tab", key) : this._navigateRange("Enter", key);
                    }
                }
            } else if ((keyCode === 37 || (keyCode === 38 && !xlObj._isFormulaSuggestion) || keyCode === 39 || (keyCode === 40 && !xlObj._isFormulaSuggestion)) && this._isNavigate) { //left ,up, right & down arrow
                e.preventDefault(); // to prevent default browser actions
                if (xlObj.XLEdit._isFormulaEdit) { // for formula navigation
                    range = xlObj.swapRange([xlObj._dStartCell.rowIndex, xlObj._dStartCell.colIndex, xlObj._dEndCell.rowIndex, xlObj._dEndCell.colIndex]);
                    xlObj.getRange([!range[0] ? range[0] : range[0] - 1, !range[1] ? range[1] : range[1] - 1, range[2], range[3]]).removeClass(xlObj._formulaBorder[xlObj._ctrlKeyCount % 6].join(' ') + " " + xlObj._ctrlFormulaBorder[xlObj._ctrlKeyCount % 6].join(' '));
                    if (ctrlKey) { //ctrl key support
                        scell = xlObj._dStartCell;
                        if (keyCode === 37 && scell.colIndex > 0)  // min column count reached? left arrow 
                            xlObj._dStartCell = xlObj._dEndCell = { rowIndex: scell.rowIndex, colIndex: 0 };
                        else if (keyCode === 38 && scell.rowIndex > 0)  // min row count reached? up arrow
                            xlObj._dStartCell = xlObj._dEndCell = { rowIndex: 0, colIndex: scell.colIndex };
                        else if (keyCode === 39 && scell.colIndex < sheet.colCount) // max column count reached ? right arrow
                            xlObj._dStartCell = xlObj._dEndCell = { rowIndex: scell.rowIndex, colIndex: sheet.colCount };
                        else if (keyCode === 40 && scell.rowIndex < rowCount) //max row count reached? down arrow
                            xlObj._dStartCell = xlObj._dEndCell = { rowIndex: sheet.colCount, colIndex: scell.colIndex };
                    }
                    if (shiftKey || xlObj._shiftKeyEnabled) { // shift key support
                        ecell = xlObj._dEndCell;
                        scell = xlObj._dStartCell;
                        if (keyCode === 37 && scell.colIndex > 0)
                            xlObj._dStartCell = { rowIndex: scell.rowIndex, colIndex: scell.colIndex - 1 };
                        else if (keyCode === 38 && scell.rowIndex > 0)
                            xlObj._dStartCell = { rowIndex: scell.rowIndex - 1, colIndex: scell.colIndex };
                        else if (keyCode === 39 && ecell.colIndex < sheet.colCount)
                            xlObj._dEndCell = { rowIndex: ecell.rowIndex, colIndex: ecell.colIndex + 1 };
                        else if (keyCode === 40 && ecell.rowIndex < sheet.rowCount)
                            xlObj._dEndCell = { rowIndex: ecell.rowIndex + 1, colIndex: ecell.colIndex };
                    }
                    else {
                        scell = xlObj._dStartCell;
                        if (keyCode === 37 && scell.colIndex > 0)  // min column count reached? left arrow
                            xlObj._dStartCell = xlObj._dEndCell = { rowIndex: scell.rowIndex, colIndex: scell.colIndex - 1 }; // left
                        else if (keyCode === 38 && scell.rowIndex > 0) // min row index reached?
                            xlObj._dStartCell = xlObj._dEndCell = { rowIndex: scell.rowIndex - 1, colIndex: scell.colIndex }; // up
                        else if (keyCode === 39 && scell.colIndex < sheet.colCount) // max col count reached?
                            xlObj._dStartCell = xlObj._dEndCell = { rowIndex: scell.rowIndex, colIndex: scell.colIndex + 1 }; // right
                        else if (keyCode === 40 && scell.rowIndex < sheet.rowCount)  // max row count reached?
                            xlObj._dStartCell = xlObj._dEndCell = { rowIndex: scell.rowIndex + 1, colIndex: scell.colIndex }; // down   
                    }
                    xlObj.XLSelection._processFormulaRange(xlObj._ctrlFormulaBorder);
                    xlObj._formulaRange[xlObj._ctrlKeyCount] = xlObj._getProperAlphaRange(sheetIdx, xlObj._dStartCell.rowIndex, xlObj._dStartCell.colIndex, xlObj._dEndCell.rowIndex, xlObj._dEndCell.colIndex);
                }
                else {
                    if (ctrlKey) { //ctrl key support
                        if (keyCode === 37 && activecell.colIndex > 0){  //  left arrow 
                            rowdata = container.sheets[sheetIdx][activecell.rowIndex];
                            i = activecell.colIndex - 1;
                            if (rowdata && i < usedrange.colIndex) { //Active row is non -empty && active column less than used range column
                                if ( xlObj.XLEdit.getPropertyValue(activecell.rowIndex, i+1, "value2") && xlObj.XLEdit.getPropertyValue(activecell.rowIndex, i, "value2")) { //active column is non - empty
                                    while (xlObj.XLEdit.getPropertyValue(activecell.rowIndex, i, "value2") && i <= usedrange.colIndex)
                                        i--;
                                    colCount = i + 1;
                                }
                                else { //Active column is empty
                                    while (!xlObj.XLEdit.getPropertyValue(activecell.rowIndex, i, "value2") && i < usedrange.colIndex && i > 0)
                                        i--;
                                    colCount = i;
                                }
                            }
                            else {// Active column greater than used range column
                                if (!xlObj.XLEdit.getPropertyValue(activecell.rowIndex, usedrange.colIndex, "value2")) {//used range is empty
                                    i = usedrange.colIndex;
                                    while ( i > 0 && !xlObj.XLEdit.getPropertyValue(activecell.rowIndex, i, "value2"))
                                        i--;
                                    colCount = i;
                                }
                                else //used range is non - empty
                                    colCount = usedrange.colIndex;  //used range is non-empty 
                            }
                            this._navigateCell(activecell.rowIndex, colCount, key);
                        }  
                        else if (keyCode === 38 && activecell.rowIndex > 0) {  // up arrow
                            rowdata = container.sheets[sheetIdx];
                            i = activecell.rowIndex - 1;
                            if (i <= usedrange.rowIndex) {//Active row lees then used range
                                if (rowdata[i] && xlObj.XLEdit.getPropertyValue(i + 1, activecell.colIndex, "value2") && xlObj.XLEdit.getPropertyValue(i, activecell.colIndex, "value2")) { //previous row is non-empty and active column in previous row is non - empty
                                    while (xlObj.XLEdit.getPropertyValue(i, activecell.colIndex, "value2") && i <= usedrange.rowIndex)
                                        i--;
                                    rowCount = i + 1;
                                }
                                else {  //active column in previous row is empty
                                    while (!xlObj.XLEdit.getPropertyValue(i, activecell.colIndex, "value2") && i > 0)
                                        i--
                                    rowCount = i;
                                }
                            }
                            else { //active row greatrer than used range
                                if (!xlObj.XLEdit.getPropertyValue(usedrange.rowIndex, activecell.colIndex, "value2")) { //used range is empty
                                    i = usedrange.rowIndex;
                                    while (i > 0 && !xlObj.XLEdit.getPropertyValue(i, activecell.colIndex, "value2"))
                                        i--;
                                    rowCount = i;
                                }
                                else //used range is non - empty
                                    rowCount = usedrange.rowIndex;
                            }
                            this._navigateCell(rowCount, activecell.colIndex, key);
                        }
                        else if (keyCode === 39 && activecell.colIndex < colCount - 1){//  right arrow
                            rowdata = container.sheets[sheetIdx][activecell.rowIndex];
                            i = activecell.colIndex + 1;
                            if (rowdata && i <= usedrange.colIndex) {// Active row is non - empty and active column less than / equalto used range
                                if (xlObj.XLEdit.getPropertyValue(activecell.rowIndex, i-1, "value2") && xlObj.XLEdit.getPropertyValue(activecell.rowIndex, i, "value2")) {//Active column is non - empty
                                    while (xlObj.XLEdit.getPropertyValue(activecell.rowIndex, i, "value2") && i <= usedrange.colIndex)
                                        i++;
                                    colCount = i - 1;
                                }
                                else { //Active column is empty
                                    while (!xlObj.XLEdit.getPropertyValue(activecell.rowIndex, i, "value2") && i < usedrange.colIndex)
                                        i++;
                                    colCount = (!xlObj.XLEdit.getPropertyValue(activecell.rowIndex, i, "value2")) ? sheet.colCount : i;
                                }
                            }
                            else // Active column is greater than used range column
                                colCount = sheet.colCount;
                            (colCount === sheet.colCount) && --colCount;
                            this._navigateCell(activecell.rowIndex, colCount, key);
                        }
                        else if (keyCode === 40 && activecell.rowIndex < rowCount - 1) {// down arrow
                            rowdata = container.sheets[sheetIdx];
                            i = activecell.rowIndex + 1;
                            if (i < usedrange.rowIndex) {// active row index less than used range row index
                                if (rowdata[i] && xlObj.XLEdit.getPropertyValue(i - 1, activecell.colIndex, "value2") && xlObj.XLEdit.getPropertyValue(i, activecell.colIndex, "value2")) {//active column  next row is non - empty
                                    while (xlObj.XLEdit.getPropertyValue(i, activecell.colIndex, "value2") && i <= usedrange.rowIndex)
                                        i++;
                                    rowCount = i - 1;
                                }
                                else {//active column in next row is empty 
                                    while (!xlObj.XLEdit.getPropertyValue(i, activecell.colIndex, "value2") && i < sheet.rowCount)
                                        i++
                                    rowCount = i;
                                }
                            }
                            else //Active row greater or equal to used range
                                rowCount = sheet.rowCount - 1;
                            (rowCount === sheet.rowCount) && --rowCount;
                            this._navigateCell(rowCount, activecell.colIndex, key);
                        }
                    }
                    else if (shiftKey) {
                        if (keyCode === 37 && endCell.colIndex > 0)
                            sheet._endCell = { rowIndex: endCell.rowIndex, colIndex: endCell.colIndex - 1 };
                        else if (keyCode === 38 && endCell.rowIndex > 0){
							_isChanged = true;
                            sheet._endCell = { rowIndex: endCell.rowIndex - 1, colIndex: endCell.colIndex };
						}
                        else if (keyCode === 39 && endCell.colIndex < colCount)
                            sheet._endCell = { rowIndex: endCell.rowIndex, colIndex: endCell.colIndex + 1 };
                        else if (keyCode === 40 && endCell.rowIndex < rowCount){
                            _isChanged = true;
							sheet._endCell = { rowIndex: endCell.rowIndex + 1, colIndex: endCell.colIndex };
						}
                        if ((sheet.rowCount === sheet._endCell.rowIndex || sheet.colCount === sheet._endCell.colIndex) && xlObj.model.scrollSettings.scrollMode === "normal")
                            return;
                        if ((sheet.rowCount === sheet._endCell.rowIndex || sheet.colCount === sheet._endCell.colIndex) && !xlObj.model.scrollSettings.allowScrolling)
                            return;
                        if (xlObj.model.scrollSettings.allowScrolling) {
                            if (sheet.rowCount === sheet._endCell.rowIndex && keyCode === 40)
                                xlObj._scrollContent({ x: 0, y: +xlObj.model.rowHeight });
                            else if (sheet.colCount - 1 === sheet._endCell.colIndex && keyCode === 39)
                                xlObj._scrollContent({ x: +xlObj.model.columnWidth, y: 0 });
                        }
                        if (this._isHiddenCell(sheet._endCell)) {
                            obj = { rowIndex: sheet._endCell.rowIndex, colIndex: sheet._endCell.colIndex };
                            this._skipHiddenRowsAndCols(obj, key);
                            sheet._endCell.rowIndex = obj.rowIndex;
                            sheet._endCell.colIndex = obj.colIndex;
                        }
                        if (xlObj._isPropExists([[sheet._startCell.rowIndex, sheet._endCell.colIndex, sheet._endCell.rowIndex, sheet._endCell.colIndex]], "merge") || xlObj._isPropExists([[sheet._startCell.rowIndex, sheet._endCell.colIndex, sheet._endCell.rowIndex, sheet._endCell.colIndex]], "isMHide")) //Row wise support
                            isMergeCell = true;
                        if (xlObj.XLEdit.getPropertyValue(sheet._endCell.rowIndex, sheet._endCell.colIndex, "isMHide") || xlObj.XLEdit.getPropertyValue(sheet._endCell.rowIndex, sheet._endCell.colIndex, "merge") || (_isChanged && xlObj._isPropExists([[sheet._endCell.rowIndex, sheet._startCell.colIndex, sheet._endCell.rowIndex, sheet._endCell.colIndex]], "merge") || xlObj._isPropExists([[sheet._endCell.rowIndex, sheet._startCell.colIndex, sheet._endCell.rowIndex, sheet._endCell.colIndex]], "isMHide")) || isMergeCell) {
							_isChanged = false;
                            xlObj.XLSelection._processBoundary();
							if(keyCode === 37 || keyCode == 38){
								startCell = sheet._endCell;
								sheet._endCell = sheet._startCell;
								sheet._startCell = startCell;
							}
						}
                        if (sheet._endCell.colIndex <= sheet._leftCol.idx || sheet._endCell.colIndex >= sheet._rightCol.idx || sheet._endCell.rowIndex <= sheet._topRow.idx || sheet._endCell.rowIndex >= sheet._bottomRow.idx)
                            this._scrollToCell(sheet._endCell, key);
                        xlObj.XLSelection.selectRange(sheet._startCell, sheet._endCell);
                        if (xlObj.model.allowAutoFill)
                            xlObj.XLDragFill.positionAutoFillElement();
                    }
                    else {
                        key = { keyCode: keyCode, shiftKey: false, ctrlKey: false, altKey: false };
                        if (keyCode === 37 && activecell.colIndex > 0)  // min column count reached? left arrow
                            this._navigateCell(activecell.rowIndex, activecell.colIndex - 1, key);//left
                        else if (keyCode === 38 && activecell.rowIndex > 0) // min row index reached?
                            this._navigateCell(activecell.rowIndex - 1, activecell.colIndex, key);//up
                        else if (keyCode === 39 && activecell.colIndex < colCount) // max col count reached?
                            this._navigateCell(activecell.rowIndex, activecell.colIndex + 1, key);//right
                        else if (keyCode === 40 && activecell.rowIndex < rowCount)  // max row count reached?
                            this._navigateCell(activecell.rowIndex + 1, activecell.colIndex, key);//down
                        else
                            return false;
                    }
                }
            }
        },

        _navigateCell: function (rowindex, colindex, key) { // select cell by rowindex and colindex
            var colgrp, cellInfo, isSpan, activeCell, cell, actCell, leftCol, actCellMerge, rows, rowIdx, colIdx, rIdx, cIdx, hiddenHgt, hiddenWth, obj = { rowIndex: rowindex, colIndex: colindex },
                xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), cont = xlObj._getContent(sheetIdx),
                hScroll = cont.find("#hscrollBar").data("ejScrollBar"), vScroll = cont.find("#vscrollBar").data("ejScrollBar"),
                content = cont.find(".e-content"), xlEdit = xlObj.XLEdit, scrollReach = false, cntOffsetWidth = content[0].offsetWidth;
            hiddenHgt = hiddenWth = 0;
            if ((sheet.rowCount === obj.rowIndex || sheet.colCount === obj.colIndex) && (xlObj.model.scrollSettings.scrollMode === "normal"))
                return;
            if (sheet.rowCount === obj.rowIndex && xlObj.model.scrollSettings.allowVirtualScrolling)
                return;
            if ((sheet.rowCount === obj.rowIndex || sheet.colCount === obj.colIndex) && !xlObj.model.scrollSettings.allowScrolling)
                return;
            if (sheet.rowCount === obj.rowIndex) {
                xlObj.XLScroll._scrollY(sheetIdx);
                scrollReach = true;
            }
            if (!xlObj._isAutoWHMode && sheet.colCount === obj.colIndex && xlObj.model.scrollSettings.scrollMode === ej.Spreadsheet.scrollMode.Infinite) {
                xlObj.XLScroll._scrollX(sheetIdx);
                scrollReach = true;
            }
            this._navToCell(rowindex, colindex);
            activeCell = xlObj.getCell(obj.rowIndex, obj.colIndex);
            if (this._isHiddenCell(obj))
                this._skipHiddenRowsAndCols(obj, key);
            actCellMerge = xlEdit.getPropertyValue(sheet._activeCell.rowIndex, sheet._activeCell.colIndex, "merge");
            if (actCellMerge && xlEdit.getPropertyValue(obj.rowIndex, obj.colIndex, "mergeIdx"))
                this._updateMergeRange(actCellMerge, obj, key);
            sheet._activeCell = sheet._endCell = sheet._startCell = obj;
            if ((xlObj.XLEdit.getPropertyValue(obj.rowIndex, obj.colIndex, "mergeIdx") || xlObj.hasSpan(obj))) {
                xlObj.XLSelection._processBoundary();
                sheet._activeCell = sheet._startCell;
                activeCell = xlObj.getCell(sheet._activeCell.rowIndex, sheet._activeCell.colIndex);
                isSpan = true;
            }
            cellInfo = xlObj._getCellInfo(obj, sheetIdx);
            leftCol = sheet._leftCol.idx > 0 ? sheet._leftCol.idx - 1 : sheet._leftCol.idx;
            if (xlObj.model.scrollSettings.allowScrolling && (sheet._bottomRow.idx <= obj.rowIndex) && (key.keyCode === 40 || (key.keyCode === 13 && !key.shiftKey)) && !scrollReach && !sheet._isFreezed) {
                vScroll._scrollData.step = 1;
                if (key.ctrlKey && key.keyCode === 40)
                    xlObj.XLScroll._scrollSelectedPosition(sheetIdx, xlObj.getActiveCell(sheetIdx));
                else
                    vScroll.scroll(vScroll.value() + (xlObj._isFrozen(sheet.frozenRows) ? xlObj._getRowHeight(sheet._ftopRowIdx, sheetIdx) : cellInfo.height), true);
            }
            else if (xlObj.model.scrollSettings.allowScrolling && !xlObj._isFrozen(sheet.frozenRows) && (sheet._topRow.idx > obj.rowIndex) && (key.keyCode === 38 || (key.keyCode === 13 && key.shiftKey)) && !scrollReach && !xlObj._hasClass(cont.find("tr").eq(obj.rowIndex)[0], 'e-fr-hide')) {
                vScroll._scrollData.step = -1;
                if (obj.rowIndex > 0)
                    (key.ctrlKey) ? vScroll.scroll(cellInfo.top , true) : vScroll.scroll(vScroll.value() - cellInfo.height, true);
                else
                    vScroll.scroll(0);
            }
            if (xlObj.model.scrollSettings.allowScrolling && colindex >= sheet._rightCol.idx && cntOffsetWidth <= ((sheet._colWidthCollection[sheet._activeCell.colIndex] - sheet._colWidthCollection[leftCol]) + cellInfo.width) && (key.keyCode === 39 || (key.keyCode === 9 && !key.shiftKey)) && !scrollReach && !sheet._isFreezed) {
                hScroll._scrollData.step = 1;
                if (key.ctrlKey && key.keyCode === 39)
                    hScroll.scroll((cellInfo.left + cellInfo.width) - hScroll._scrollData.handleSpace, true);
                else
                    hScroll.scroll(hScroll.value() + (xlObj._isFrozen(sheet.frozenColumns) ? xlObj._getColWidth(sheet._fleftColIdx, sheetIdx) : cellInfo.width), true);
            }
            else if (xlObj.model.scrollSettings.allowScrolling && !xlObj._isFrozen(sheet.frozenColumns) && (leftCol >= obj.colIndex) && (key.keyCode === 37 || (key.keyCode === 9 && key.shiftKey)) && !scrollReach) {
                hScroll._scrollData.step = -1;
                if (obj.colIndex > 0)
                    (key.ctrlKey) ? hScroll.scroll(cellInfo.left, true) : hScroll.scroll(hScroll.value() - cellInfo.width, true);
                else
                    hScroll.scroll(0);
            }
            else if (xlObj.model.scrollSettings.allowScrolling && key.ctrlKey && !scrollReach && !sheet._isFreezed) {
                if (key.keyCode === 37)
                    hScroll.scroll(cellInfo.left, true)
                else if (key.keyCode === 38)
                    vScroll.scroll(cellInfo.top, true);
                else if (key.keyCode === 39)
                    hScroll.scroll(cellInfo.left - hScroll._scrollData.handleSpace, true);
                else
                    xlObj.XLScroll._scrollSelectedPosition(sheetIdx, xlObj.getActiveCell(sheetIdx));
            }
            colgrp = cont.find("col");
            rows = $(xlObj.getRows(sheetIdx)[1]), rowIdx = sheet._startCell.rowIndex, colIdx = sheet._startCell.colIndex;
            if ((cntOffsetWidth >= cellInfo.left || content.offset().left + cntOffsetWidth >= (cellInfo.left + cellInfo.width)) && (key.keyCode == 39 || (key.keyCode == 9 && !key.shiftKey))) 
                xlObj.XLSelection.selectRange(sheet._startCell, sheet._startCell);
            else if (!colgrp.eq(colIdx).hasClass("e-fc-hide") || (key.keyCode == 37 || (key.keyCode == 9 && key.shiftKey))) 
                xlObj.XLSelection.selectRange(sheet._startCell, sheet._endCell);
            else if (!rows.eq(rowIdx).hasClass("e-fr-hide") && (key.keyCode == 38 || (key.keyCode == 13 && key.shiftKey))) 
                xlObj.XLSelection.selectRange(sheet._startCell, sheet._endCell);
            else if (((content.offset().top + content[0].offsetHeight) >= cellInfo.top || content.offset().top + content[0].offsetHeight >= (cellInfo.top + cellInfo.height)) && (key.keyCode == 40 || (key.keyCode == 13 && !key.shiftKey))) 
                xlObj.XLSelection.selectRange(sheet._startCell, sheet._endCell);
            if (isSpan) {
                if (key.keyCode === 37 || (key.shiftKey && key.keyCode === 9))
                    obj.colIndex = sheet._startCell.colIndex;
                else if (key.keyCode === 38 || (key.shiftKey && key.keyCode === 13))
                    obj.rowIndex = sheet._startCell.rowIndex;
                else if (key.keyCode === 39 || key.keyCode === 9)
                    obj.colIndex = sheet._endCell.colIndex;
                else if (key.keyCode === 40 || key.keyCode === 13)
                    obj.rowIndex = sheet._endCell.rowIndex;
                sheet._activeCell = obj;
            }
            sheet._startCell = obj;
            while ((key.keyCode === 37 || (key.shiftKey && key.keyCode === 9)) && xlObj._hasClass(colgrp[sheet._startCell.colIndex], 'e-c-hide')) {
                xlObj._removeClass(colgrp[sheet._startCell.colIndex], 'e-fc-hide');
                sheet._startCell.colIndex--;
            }
            while ((key.keyCode === 38 || (key.shiftKey && key.keyCode === 13)) && xlObj._hasClass(cont.find('tr')[sheet._startCell.rowIndex], 'e-r-hide')) {
                xlObj._removeClass(cont.find('tr')[sheet._startCell.rowIndex], 'e-fr-hide');
                sheet._startCell.rowIndex--;
            }
            while ((key.keyCode === 39 || key.keyCode === 9) && xlObj._hasClass(colgrp[sheet._startCell.colIndex], 'e-c-hide'))
                sheet._startCell.colIndex++;
            while ((key.keyCode === 40 || key.keyCode === 13) && xlObj._hasClass(cont.find('tr')[sheet._startCell.rowIndex], 'e-r-hide'))
                sheet._startCell.rowIndex++;
            rIdx = sheet._startCell.rowIndex, cIdx = sheet._startCell.colIndex;
			if(xlObj.model.selectionSettings.selectionType === "row")
			    xlObj.XLSelection.selectRows(rIdx, rIdx);
			else if( xlObj.model.selectionSettings.selectionType === "column")
			    xlObj.XLSelection.selectColumns(cIdx, cIdx);
			if (xlObj.model.showRibbon)
			    xlObj.XLRibbon._updateRibbonIcons();
            if (xlObj.model.allowAutoFill)
                xlObj.XLDragFill.positionAutoFillElement();
        },

        _navToCell: function (rowIdx, colIdx) {
            var xlObj = this.XLObj, actSheet = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(), hiddenHgt, hiddenWth;
			hiddenHgt = hiddenWth = 0;
            if (sheet._isFreezed) {
                if (sheet._frozenRows - 1 <= rowIdx && rowIdx < sheet._ftopRowIdx) {
                    for (i = rowIdx; i < sheet._ftopRowIdx; i++)
                        hiddenHgt += sheet.rowsHeightCollection[i];
                    xlObj._scrollContent({ y: -hiddenHgt });
                }
                else if (sheet._frozenRows - 1 <= rowIdx && rowIdx > sheet._bottomRow.idx) {
                    for (i = sheet._bottomRow.idx; i < rowIdx; i++)
                        hiddenHgt += sheet.rowsHeightCollection[i];
                    xlObj._scrollContent({ y: +hiddenHgt });
                }
                    
                if (sheet._frozenColumns - 1 <= colIdx && colIdx < sheet._fleftColIdx) {
                    for (i = colIdx; i < sheet._fleftColIdx; i++)
                        hiddenWth += sheet.columnsWidthCollection[i];
                    xlObj._scrollContent({ x: -hiddenWth });
                }
                else if (sheet._frozenColumns - 1 <= colIdx && colIdx > sheet._rightCol.idx) {
                    for (i = sheet._rightCol.idx; i < colIdx; i++)
                        hiddenWth += sheet.columnsWidthCollection[i];
                    xlObj._scrollContent({ x: +hiddenWth });
                }
            }
        },
        _navigateRange: function (args, key) { // active cell changes at range of cells,rows,columns
            var xlObj = this.XLObj, sheet = xlObj.getSheet(xlObj.getActiveSheetIndex()), startcell = sheet._startCell, endcell = sheet._endCell, activecell = sheet._activeCell,
                minrowindex = startcell.rowIndex < endcell.rowIndex ? startcell.rowIndex : endcell.rowIndex,
                maxrowindex = startcell.rowIndex > endcell.rowIndex ? startcell.rowIndex : endcell.rowIndex,
                mincolindex = startcell.colIndex < endcell.colIndex ? startcell.colIndex : endcell.colIndex,
                maxcolindex = startcell.colIndex > endcell.colIndex ? startcell.colIndex : endcell.colIndex;
            if (args == "Tab") {
                if (activecell.colIndex < maxcolindex)
                    this._navigateRow("Forward", key);
                else if (activecell.rowIndex < maxrowindex)
                    this._updateActiveCell(activecell.rowIndex + 1, mincolindex, key, args);
                else if (activecell.rowIndex == maxrowindex && activecell.colIndex == maxcolindex)
                    this._updateActiveCell(minrowindex, mincolindex, key, args);
                else
                    return false;
            }
            else if (args == "Enter") {
                if (activecell.rowIndex < maxrowindex)
                    this._navigateCol("Forward", key);
                else if (activecell.colIndex < maxcolindex)
                    this._updateActiveCell(minrowindex, activecell.colIndex + 1, key, args);
                else if (activecell.rowIndex == maxrowindex && activecell.colIndex == maxcolindex)
                    this._updateActiveCell(minrowindex, mincolindex, key, args);
                else
                    return false;
            }
            else if (args == "ShiftTab") {
                if (activecell.colIndex > mincolindex)
                    this._navigateRow("Backward", key);
                else if (activecell.rowIndex > minrowindex)
                    this._updateActiveCell(activecell.rowIndex - 1, maxcolindex, key, args);
                else if (activecell.rowIndex == minrowindex && activecell.colIndex == mincolindex)
                    this._updateActiveCell(maxrowindex, maxcolindex, key, args);
                else
                    return false;
            }
            else { // shift enter
                if (activecell.rowIndex > minrowindex)
                    this._navigateCol("Backward", key);
                else if (activecell.colIndex > mincolindex)
                    this._updateActiveCell(maxrowindex, activecell.colIndex - 1, key, args);
                else if (activecell.rowIndex == minrowindex && activecell.colIndex == mincolindex)
                    this._updateActiveCell(maxrowindex, maxcolindex, key, args);
                else
                    return false;
            }
        },

        _navigateRow: function (args, key) { // active cell changes at single row
            var idx, action, xlObj = this.XLObj, activecell = xlObj.getSheet(xlObj.getActiveSheetIndex())._activeCell;
            if (args === "Forward") {
                idx = 1;
                action = "Tab";
            }
            else {
                idx = -1;
                action = "ShiftTab";
            }
            this._updateActiveCell(activecell.rowIndex, activecell.colIndex + idx, key, action);
        },

        _navigateCol: function (args, key) { // active cell changes at single column
            var idx, action, xlObj = this.XLObj, activecell = xlObj.getSheet(xlObj.getActiveSheetIndex())._activeCell;
            if (args === "Forward") {
                idx = 1;
                action = "Enter";
            }
            else {
                idx = -1;
                action = "ShiftEnter";
            }
            this._updateActiveCell(activecell.rowIndex + idx, activecell.colIndex, key, action);
        },

        _updateActiveCell: function (rowindex, colindex, key, args) { // to update active cell by removing existing active cell
            var xlObj = this.XLObj, sheet = xlObj.getSheet(xlObj.getActiveSheetIndex()), activecell = sheet._activeCell;
            xlObj._removeClass(xlObj.getCell(activecell.rowIndex, activecell.colIndex), "e-activecell");
            sheet._activeCell = { rowIndex: rowindex, colIndex: colindex };
            if (key && this._isHiddenCell(sheet._activeCell))
                this._skipHiddenRowsAndCols(sheet._activeCell, key, true, args);
            if (this._isMergedCell(sheet._activeCell))
                this._skipMergedCells(sheet._activeCell, key);
            this._scrollToCell(sheet._activeCell, key);
            xlObj.addClass(xlObj.getCell(sheet._activeCell.rowIndex, sheet._activeCell.colIndex), "e-activecell")
            if(xlObj.model.allowFormulaBar)
            xlObj.updateFormulaBar();
            xlObj.setSheetFocus();
        },

        _isValidParameter: function (val) {
            var index = val.indexOf("(");
            if (index > -1) {
                val = val.split("(");
                return val[1].length > 0;
            }
            return true;
        },

        _skipHiddenRowsAndCols: function (obj, key, inRange, args) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(xlObj.getActiveSheetIndex()), canIterate = true;
            if (inRange)
                this._navigateRange(args, key);
            else {
                if ((key.keyCode === 37 || (key.keyCode === 9 && key.shiftKey) || (key.keyCode === 39 && key.ctrlKey)) && obj.colIndex)
                    obj.colIndex--;
                else if ((key.keyCode === 38 || (key.keyCode === 13 && key.shiftKey) || (key.keyCode === 40 && key.ctrlKey)) && obj.rowIndex)
                    obj.rowIndex--;
                else if ((key.keyCode === 39 || key.keyCode === 9 || (key.keyCode === 37 && key.ctrlKey)) && obj.colIndex < sheet.colCount - 1)
                    obj.colIndex++;
                else if ((key.keyCode === 40 || key.keyCode === 13 || (key.keyCode === 38 && key.ctrlKey)) && obj.rowIndex < sheet.rowCount - 1)
                    obj.rowIndex++;
                else
                    canIterate = false;
                if (this._isHiddenCell(obj) && canIterate)
                    this._skipHiddenRowsAndCols(obj, key);
                else if (!canIterate) {
                    if ((key.keyCode === 37 || (key.keyCode === 9 && key.shiftKey)) && !obj.colIndex)
                        obj.colIndex = (key.keyCode === 37 && key.shiftKey) ? sheet._endCell.colIndex + 1 : sheet._startCell.colIndex;
                    else if ((key.keyCode === 38 || (key.keyCode === 13 && key.shiftKey)) && !obj.rowIndex)
                        obj.rowIndex = (key.keyCode === 38 && key.shiftKey) ? sheet._endCell.rowIndex + 1 : sheet._startCell.rowIndex;
                    else if (xlObj.model.scrollSettings.scrollMode === ej.Spreadsheet.scrollMode.Normal) {
                        if ((key.keyCode === 40 || key.keyCode === 13 || (key.keyCode === 40 && key.shiftKey)) && obj.rowIndex == sheet.rowCount - 1)
                            obj.rowIndex = (key.keyCode === 40 && key.shiftKey) ? sheet._endCell.rowIndex - 1 : sheet._startCell.rowIndex;
                    }
                }
            }
        },

        _isHiddenCell: function (cellIdx) {
            return this.XLObj.XLEdit.getPropertyValue(0, cellIdx.colIndex, "isCHide") || this.XLObj.XLEdit.getPropertyValue(cellIdx.rowIndex, 0, "isRHide") || this.XLObj.XLEdit.getPropertyValue(cellIdx.rowIndex, 0, "isFilterHide") || false;
        },

        _isMergedCell: function (cellIdx) {
            return this.XLObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "isMHide") || this.XLObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "merge");
        },

        _skipMergedCells: function (obj, key, xtendSelection) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(xlObj.getActiveSheetIndex()), startcell = sheet._startCell,
                endcell = sheet._endCell, canIterate = true, regx = xlObj._rcRegx, isSelected = false;
            minr = startcell.rowIndex < endcell.rowIndex ? startcell.rowIndex : endcell.rowIndex,
            maxr = startcell.rowIndex > endcell.rowIndex ? startcell.rowIndex : endcell.rowIndex,
            minc = startcell.colIndex < endcell.colIndex ? startcell.colIndex : endcell.colIndex,
            maxc = startcell.colIndex > endcell.colIndex ? startcell.colIndex : endcell.colIndex;
            if (key.shiftKey && key.keyCode === 9)
                obj.colIndex--;
            else if (key.keyCode === 9)
                obj.colIndex++;
            else if (key.shiftKey && key.keyCode === 13)
                obj.rowIndex--;
            else if (key.keyCode === 13)
                obj.rowIndex++;
            else
                canIterate = false;
            if (obj.colIndex > maxc) {
                obj.colIndex = minc;
                obj.rowIndex = (obj.rowIndex === maxr ? minr : obj.rowIndex + 1);
            }
            else if (obj.colIndex < minc) {
                obj.colIndex = maxc;
                obj.rowIndex = (obj.rowIndex === minr ? maxr : obj.rowIndex - 1);
            }
            else if (obj.rowIndex > maxr) {
                obj.rowIndex = minr;
                obj.colIndex = (obj.colIndex === maxc ? minc : obj.colIndex + 1);
            }
            else if (obj.rowIndex < minr) {
                obj.rowIndex = maxr;
                obj.colIndex = (obj.colIndex === minc ? maxc : obj.colIndex - 1);
            }
            if (this._isMergedCell(obj) && canIterate)
                this._skipMergedCells(obj, key);
        },

        _updateMergeRange: function (merge, obj, key) {
            var xlObj = this.XLObj, colspan = merge.mSpan.colSpan - 1, rowspan = merge.mSpan.rowSpan - 1;
            if (!key.shiftKey && (key.keyCode === 39 || key.keyCode === 9))
                obj.colIndex = obj.colIndex + colspan;
            else if (!key.shiftKey && (key.keyCode === 40 || key.keyCode === 13))
                obj.rowIndex = obj.rowIndex + rowspan;
        },

        _isRangeMerged: function (cells) {
            var mergeCells, obj = {}, xlObj = this.XLObj, cell = cells[0], merge = xlObj.XLEdit.getPropertyValue(cell.rowIndex, cell.colIndex, "merge");
            if (merge) {
                obj = { rowIndex: cells[0].rowIndex + merge.mSpan.rowSpan - 1, colIndex: cells[0].colIndex + merge.mSpan.colSpan - 1 };
                mergeCells = xlObj._getSelectedRange(cells[0], obj);
                if (mergeCells.length === cells.length)
                    return true;
            }
        },

        _scrollToCell: function (obj, key) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), cellInfo = xlObj._getCellInfo(obj, sheetIdx),
                sheet = xlObj.getSheet(sheetIdx), cont = xlObj._getContent(sheetIdx), content = cont.find(".e-content"),
                hScroll = cont.find("#hscrollBar").data("ejScrollBar"), vScroll = cont.find("#vscrollBar").data("ejScrollBar");
            if (xlObj.model.scrollSettings.scrollMode === "normal" && sheet.colCount - 1 === obj.colIndex)
                return;
            if (sheet._bottomRow.idx > 0 && obj.rowIndex > sheet._bottomRow.idx - 1 && sheet.rowCount - 1 > obj.rowIndex && key.keyCode === 40)
                 vScroll.scroll(vScroll.value() + cellInfo.height, true);
            else if (obj.rowIndex - 1 < sheet._topRow.idx && key.keyCode === 38) {
                vScroll._scrollData.step = -1;
                (obj.rowIndex > 0) ? vScroll.scroll(cellInfo.top, true) : vScroll.scroll(0);
            }
            else if (obj.colIndex < sheet._leftCol.idx)
                (obj.colIndex > 0) ? hScroll.scroll(hScroll.value() - cellInfo.width, true) : hScroll.scroll(0);
            else if (content[0].offsetWidth <= (cellInfo.left + cellInfo.width)) {
                    if (key.keyCode === 39) 
                        (sheet.colCount === obj.colIndex + 1) ? xlObj.XLScroll._scrollX(sheetIdx) : hScroll.scroll(hScroll.value() + cellInfo.width, true);
                    else if (key.keyCode === 37) {
                        hScroll._scrollData.step = -1;
                        hScroll.scroll(cellInfo.left, true);
                    }
            }              
        }
    };
})(jQuery, Syncfusion);