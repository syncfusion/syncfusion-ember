(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.selection = function (obj) {
        this.XLObj = obj;
        this._isRightClick = false;
        this._colhdrClick = false;
        this._rowhdrClick = false;
        this._aFillDownHandler = false;
        this._isOutsideBordering = false;
        this._isGridBordering = false;
        this._isRowSelected = false;
        this._isColSelected = false;
        this._isEndReached = true;
        this._canTouchMove = false;
    };

    ej.spreadsheetFeatures.selection.prototype = {
        _selectionMouseDownHandler: function (e) {
            var moveEvt, endEvt, xlObj = this.XLObj, sheet = xlObj.getSheet(), trgt = e.target;
            if (xlObj._isTouchEvt) {
                if (xlObj._browserDetails.name === "msie")
                    e.preventDefault();
                if (xlObj._isSelected(e.target) || xlObj._hasClass(e.target, "e-autofill")) {
                    moveEvt = xlObj._getBrowserEvt("move");
                    this._canTouchMove = true;
                }
                endEvt = xlObj._getBrowserEvt("end");
            }
            else {
                e.preventDefault();
                moveEvt = xlObj._getBrowserEvt('move', true);
                endEvt = xlObj._getBrowserEvt('end', true);
                endEvt += " mouseleave"
            }
            xlObj._on($(document), endEvt, this._mouseUpHandler);
            if ((e.which === 3 || e.button === 2) || xlObj.model.selectionSettings.selectionUnit === ej.Spreadsheet.SelectionUnit.Single)
                this._isRightClick = true;
            else if (moveEvt)
                xlObj._on(xlObj.element, moveEvt, this._mouseMoveHandler);
            if (trgt.tagName == "TD") {
                if (xlObj.XLEdit._isFormulaEdit) {
                    if (e.ctrlKey) {
                        this._clearBorder(xlObj._arrayAsString(xlObj._ctrlFormulaBorder));
                        xlObj._ctrlKeyCount = xlObj._formulaRange.length;
                    }
                    xlObj._dStartCell = xlObj._getCellIdx(trgt);
                }
                else if (e.shiftKey && sheet._startCell.rowIndex != -1)
                    sheet._endCell = xlObj._getCellIdx(trgt);
                else {
                    sheet._startCell = xlObj._getCellIdx(trgt);
                    sheet._activeCell = xlObj._getCellIdx(trgt);
                }
                if (trgt.className.indexOf("e-rowheader") > -1)
                    this._rowhdrClick = true;
            }
            else if (trgt.parentNode.tagName == "TH") {  // check for parentnode issue for all
                if (e.shiftKey && sheet._startCell.rowIndex != -1)
                    sheet._endCell = { rowIndex: 0, colIndex: trgt.parentNode.cellIndex };
                else {
                    sheet._startCell = { rowIndex: 0, colIndex: trgt.parentNode.cellIndex };
                    sheet._activeCell = { rowIndex: 0, colIndex: trgt.parentNode.cellIndex };
                }
                if (trgt.className.indexOf("e-headercelldiv") > -1)
                    this._colhdrClick = true;
            }
            else if (trgt.className == "e-autofill")
                this._aFillDownHandler = true;
        },

        _mouseMoveHandler: function (e) {
            var status, chngdTouch, trgtCell, xlObj = this, selObj = xlObj.XLSelection, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx),
                trgt = e.target, range, type = xlObj.model.selectionSettings.selectionType, types = ej.Spreadsheet.SelectionType, imgElem = $(e.target).get(0), cont;
            if (xlObj._isTouchEvt) {
                xlObj._isTouchMoveSel = true;
                chngdTouch = xlObj._getOriginalEvt(e);
                trgt = document.elementFromPoint(chngdTouch.clientX, chngdTouch.clientY);
                if (!trgt)
                    return;
            }
            if ($(trgt).hasClass("e-rowcell") || $(trgt).hasClass("e-rowheader")) {
                this.XLSelection._isEndReached = false;
                xlObj._getContent(sheetIdx).find("td[class *='border']").removeClass(xlObj._ctrlFormulaBorder[xlObj._ctrlKeyCount % 6].join(" "));
                if (xlObj.XLEdit._isFormulaEdit) {
                    if (e.ctrlKey) {
                        xlObj._dEndCell = xlObj._getCellIdx(trgt);
                        selObj._processFormulaRange(xlObj._ctrlFormulaBorder, true);
                    }
                    else {
                        xlObj._dEndCell = xlObj._getCellIdx(trgt);
                        selObj._processFormulaRange(xlObj._ctrlFormulaBorder, true);
                    }
                    return;
                }
                else if (selObj._aFillDownHandler && $(trgt).parents(".e-rowheadercontent").length === 0) {
                    if (xlObj.model.allowAutoFill) {
                        trgtCell = xlObj._getCellIdx(e.target);
                        if (sheet._isFreezed && trgtCell.rowIndex <= sheet.frozenRows && sheet._hiddenFreezeRows.indexOf(sheet.frozenRows) > -1)
                            selObj._scrollCalculation(sheetIdx, trgt, { position: "vertical", action: "Decrement" });
                        else if (sheet._isFreezed && trgtCell.colIndex <= sheet.frozenColumns && sheet._hiddenFreezeCols.indexOf(sheet.frozenColumns) > -1)
                            selObj._scrollCalculation(sheetIdx, trgt, { position: "horizontal", action: "Decrement" });
                        else
                            xlObj.XLDragFill._selectAutoFillRange(trgt);
                        return;
                    }  
                }
                else {
                    sheet._startCell = sheet._activeCell;
                    sheet._endCell = xlObj._getCellIdx(trgt);
                    if (sheet._isFreezed)
                        xlObj.XLFreeze._selectionScroll();
                    selObj._processBoundary();
                    if ($(trgt).parents(".e-spreadsheetcontentcontainer").length > 0) {
                        if (e.ctrlKey && xlObj.model.selectionSettings.selectionType === ej.Spreadsheet.SelectionType.Default && xlObj.model.selectionSettings.selectionUnit === ej.Spreadsheet.SelectionUnit.MultiRange) {
                            cont = xlObj._getContent(xlObj.getActiveSheetIndex());
							cont.find("td[class *='activecell']").removeClass("e-activecell");
							cont.find("td[class *='focus']").removeClass("e-focusright e-focusbottom");
                            range = xlObj.swapRange([sheet._startCell.rowIndex, sheet._startCell.colIndex, sheet._endCell.rowIndex, sheet._endCell.colIndex]);
                            xlObj.getRange(range).addClass("e-ctrlselected");
                            selObj._focusRange(sheet._startCell, sheet._endCell, xlObj._selectionBorder);
                            xlObj.model.allowAutoFill && xlObj.XLDragFill.hideAutoFillElement();
                            return;
                        }
                        else {
                            if (type === types.Row || selObj._rowhdrClick)
                                selObj.selectRows(sheet._startCell.rowIndex, sheet._endCell.rowIndex);
                            else if (type === types.Column || selObj._colhdrClick)
                                selObj.selectColumns(sheet._startCell.colIndex, sheet._endCell.colIndex);
                            else
                                selObj.selectRange(sheet._startCell, sheet._endCell, trgt);
                            if (sheet._isFreezed)
                                xlObj.XLFreeze._refreshSelection();
                        }
                    }
                    else if ($(trgt).parents(".e-rowheadercontent").length > 0)
                        if (selObj._colhdrClick || selObj._rowhdrClick) {
                            if (type === types.Column)
                                selObj.selectColumns(0, sheet.colCount - 1);
                            else
                                selObj.selectRows(sheet._startCell.rowIndex, sheet._endCell.rowIndex);
                            if (sheet._isFreezed)
                                xlObj.XLFreeze._refreshSelection();
                        }
                        else {
                            status = { position: "horizontal", action: "Decrement" };
                            selObj._scrollCalculation(sheetIdx, trgt, status);
                        }
                    else
                        return;
                }
            }
            else if (!ej.isNullOrUndefined(trgt.parentNode) && trgt.parentNode.tagName == "TH") {
                sheet._endCell = { rowIndex: 0, colIndex: trgt.parentNode.cellIndex };
                sheet._startCell = sheet._activeCell;
                if (sheet._isFreezed)
                        xlObj.XLFreeze._selectionScroll();
                selObj._processBoundary();
                if (selObj._colhdrClick || selObj._rowhdrClick) {
                    if (type === types.Row)
                        selObj.selectRows(0, sheet.rowCount - 1);
                    else
                        selObj.selectColumns(sheet._startCell.colIndex, sheet._endCell.colIndex);
                    if (sheet._isFreezed)
                        xlObj.XLFreeze._refreshSelection();
                }
                else {
                    status = { position: "vertical", action: "Decrement" };
                    selObj._scrollCalculation(sheetIdx, trgt, status);
                }
            }
            else if (imgElem.id.indexOf("sparkline") > 1 || imgElem.id.indexOf("chart") < 1 && (trgt.className.indexOf("e-hhandlespace") > -1 || trgt.className.indexOf("e-hhandle") > -1 || trgt.className.indexOf("e-hup") > -1 || trgt.className.indexOf("e-hdown") > -1)) {
                status = { position: "vertical", action: "Increment" };
                selObj._scrollCalculation(sheetIdx, trgt, status);
            }

            else if (imgElem.id.indexOf("chart") < 1 && (trgt.className.indexOf("e-vhandlespace") > -1 || trgt.className.indexOf("e-vhandle") > -1 || trgt.className.indexOf("e-vup") > -1 || trgt.className.indexOf("e-vdown") > -1)) {
                status = { position: "horizontal", action: "Increment" };
                selObj._scrollCalculation(sheetIdx, trgt, status);
            }
            else
                return;
        },

        _mouseUpHandler: function (e) {
            e.target = this._changeTargetWithOffset(e);
            var trgt, $trgt, mergeBtn, style, prctRange, cells, cell, currcell, autofillRange, options, btnObj, moveEvt, endEvt, chngdTouch, prfmDragFill = true,
                xlObj = this, selObj = xlObj.XLSelection, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), range = sheet.selectedRange,
                sheetElement = xlObj.getSheetElement(sheetIdx), type = xlObj.model.selectionSettings.selectionType, scell = sheet._startCell, eCell = sheet._endCell,
                types = ej.Spreadsheet.SelectionType,cont = xlObj._getJSSheetContent(sheetIdx).find(".e-spreadsheetcontentcontainer > .e-content"), isRibbonUpdated = false;
            if (!xlObj.XLEdit._isEdit)
                xlObj._setSheetFocus();
            if (xlObj._isTouchEvt) {
                endEvt = xlObj._getBrowserEvt("end");
                if (selObj._canTouchMove)
                    moveEvt = xlObj._getBrowserEvt("move");
                xlObj._isTouchMoveSel = false;
            }
            else {
                moveEvt = xlObj._getBrowserEvt('move', true);
                endEvt = xlObj._getBrowserEvt('end', true);
                endEvt += " mouseleave"
            }
            if (moveEvt)
                xlObj._off(xlObj.element, moveEvt, selObj._mouseMoveHandler);
            xlObj._off($(document), endEvt, selObj._mouseUpHandler);
            if (xlObj._isTouchEvt) {
                if (!selObj._aFillDownHandler && xlObj._isTouchScroll || (!selObj._canTouchMove && !xlObj._isUniqueTarget(xlObj._touchArgs, e))) {
                    selObj._canTouchMove = xlObj._isTouchScroll = false;
                    return;
                }
                selObj._canTouchMove = xlObj._isTouchScroll = false;
                chngdTouch = xlObj._getOriginalEvt(e);
                trgt = document.elementFromPoint(chngdTouch.clientX, chngdTouch.clientY);
                if (!trgt) {
                    if (this.model.allowAutoFill)
                        this.XLDragFill.positionAutoFillElement();
                    return;
                }
            }            
            trgt = trgt || e.target, $trgt = $(trgt);
			if (trgt.tagName == "TD" || (trgt.tagName == "INPUT" && !$trgt.parents(".e-formulabar").length) || selObj._aFillDownHandler) {
			    if ($trgt.parents(".e-rowheadercontent").length) {
			        selObj._isOutsideBordering = selObj._isGridBordering = false;
					cont.removeClass("e-ss-drwbrdrcursor e-ss-drwbrdrgridcursor").addClass("e-ss-cursor");
				}
			    xlObj._preventctrlkey = e.ctrlKey;
			    if (xlObj.XLEdit._isFormulaEdit) {
			        cont.find("td[class *='border']").removeClass(xlObj._ctrlFormulaBorder.join(" ").replace(/,/g, " "));
                    if (e.ctrlKey) {
                        xlObj._dEndCell = xlObj._getCellIdx(trgt);
                        selObj._processFormulaRange(xlObj._formulaBorder);
                    }
                    else {
                        selObj._clearBorder(xlObj._formulaBorder.join(" ").replace(/,/g, " ") + " " + xlObj._ctrlFormulaBorder.join(" ").replace(/,/g, " "));
                        xlObj._ctrlKeyCount = 0;
                        xlObj._dEndCell = xlObj._getCellIdx(trgt);
                        selObj._processFormulaRange(xlObj._formulaBorder);
                        xlObj._formulaRange = [];
                    }
                    xlObj._formulaRange.push(xlObj._getProperAlphaRange(sheetIdx, xlObj._dStartCell.rowIndex, xlObj._dStartCell.colIndex, xlObj._dEndCell.rowIndex, xlObj._dEndCell.colIndex));
                    return;
                }
                else if (selObj._aFillDownHandler) {
                    currcell = trgt.tagName === "TD" ? xlObj._getCellIdx(trgt) : xlObj._dautoFillCell;
                    if (xlObj.model.allowAutoFill)
                        autofillRange = xlObj.XLDragFill._getAutoFillRange(currcell);
                    if (!autofillRange || !autofillRange.fillRange) {
                        selObj._aFillDownHandler = false;
                        xlObj.XLDragFill && xlObj.XLDragFill.positionAutoFillElement();
                        return;
                    }
                    prctRange = xlObj.swapRange(autofillRange.fillRange);
                    if (xlObj.model.allowLockCell && xlObj.getSheet(sheetIdx).isSheetProtected) {                  
                        if (xlObj._isPropExists([prctRange], "isLocked", sheetIdx))
                           prfmDragFill=false;                       
                    }
                    if (prfmDragFill && xlObj._isPropExists([prctRange], "isReadOnly", sheetIdx))
                        prfmDragFill = false;
                    if (!prfmDragFill) {
                        selObj._aFillDownHandler = false;
                        xlObj.XLSelection.selectRange(scell, eCell);
						isRibbonUpdated = true;
                        xlObj.XLDragFill.positionAutoFillElement();
                        return;
                    }
                    else if ("direction" in autofillRange) {
                        xlObj._pStartCell = sheet._startCell;
                        xlObj._pEndCell = sheet._endCell;
                        xlObj._pFillCell = currcell;
                        if (xlObj.inRange(sheet.selectedRange, currcell.rowIndex, currcell.colIndex))
                            xlObj.clearRangeData(null, null, $(selObj.getSelectedCells()).not(".e-autofillcell"));
                        else if(xlObj.model.allowAutoFill)
                            xlObj.XLDragFill.autoFill({ dataRange: sheet.selectedRange, fillRange: autofillRange.fillRange, direction: autofillRange.direction, fillType: xlObj.model.autoFillSettings.fillType });
                        sheet._startCell = autofillRange.startCell;
                        sheet._endCell = autofillRange.endCell;
                    }
                    else
                        selObj._aFillDownHandler = false;
                    selObj.refreshSelection(xlObj.swapRange([autofillRange.startCell.rowIndex, autofillRange.startCell.colIndex, autofillRange.endCell.rowIndex, autofillRange.endCell.colIndex]));
                }
                else if (selObj._isOutsideBordering || selObj._isGridBordering) {  // for border drawing
                    style = (xlObj._borderStyle == "double")? "3px " + xlObj._borderStyle + " " + xlObj._borderColor:"1px " + xlObj._borderStyle + " " + xlObj._borderColor ;
                    if (selObj._isRightClick)
                        sheet._endCell = sheet._startCell;
                    else {
                        sheet._startCell = sheet._activeCell;
                        sheet._endCell = xlObj._getCellIdx(trgt);
                        selObj._processBoundary();
                    }
                    if ($trgt.parents(".e-spreadsheetcontentcontainer").length) {
                        options = { top: style, right: style, bottom: style, left: style };
                        if (selObj._isGridBordering)
                            options.isGridBorder = true;
                        xlObj.XLFormat.applyBorder(options, xlObj.swapRange([sheet._startCell.rowIndex, sheet._startCell.colIndex, sheet._endCell.rowIndex, sheet._endCell.colIndex]));
                        selObj._cleanUp(true);
                    }
                    else
                        return;
                }
                else {
                    if (trgt.tagName == "INPUT" && $trgt.parents("tr").length)
                        sheet._endCell = selObj._isRightClick ? sheet._startCell : xlObj._getCellIdx($trgt.parents("td")[0]);
                    else {
                        if (selObj._isRightClick)
                            sheet._endCell = sheet._startCell;
                        else {
                            sheet._startCell = sheet._activeCell;
                            sheet._endCell = xlObj._getCellIdx(trgt);
                            selObj._processBoundary();
                        }
                    }
                    if ($trgt.parents(".e-spreadsheetcontentcontainer").length) {
                        if (e.ctrlKey && xlObj.model.selectionSettings.selectionType === ej.Spreadsheet.SelectionType.Default && xlObj.model.selectionSettings.selectionUnit === ej.Spreadsheet.SelectionUnit.MultiRange) {
                            cont.find("td[class *='activecell']").removeClass("e-activecell");
							cont.find("td[class *='focus']").removeClass("e-focustop e-focusleft");
							cont.find("td[class *='ctrlselected']").removeClass("e-ctrlselected");
                            range = xlObj.swapRange([sheet._startCell.rowIndex, sheet._startCell.colIndex, sheet._endCell.rowIndex, sheet._endCell.colIndex]);
                            xlObj.getRange(range).addClass("e-selected");
                            xlObj.getCell(sheet._activeCell.rowIndex, sheet._activeCell.colIndex).addClass('e-activecell');
                            selObj._focusRange(sheet._startCell, sheet._endCell, xlObj._selectionBorder);
                            if(xlObj.model.allowAutoFill)
                                xlObj.XLDragFill.hideAutoFillElement();
                            xlObj.getSheet(sheetIdx)._selectedCells.push(xlObj._getSelectedRange(xlObj.getSheet(sheetIdx)._startCell, xlObj.getSheet(sheetIdx)._endCell));  // consider
                            if(xlObj.model.showRibbon && xlObj.model.allowComments && sheetElement.find(".e-selected.e-commentcell").length)
                                xlObj.XLRibbon._enableButtons(["Review_Comments_DeleteComment"], "ejButton");
                            return;
                        }
                        else {
                            if (type === types.Row || selObj._rowhdrClick)
                                selObj.selectRows(sheet._startCell.rowIndex, sheet._endCell.rowIndex);
                            else if (type === types.Column || selObj._colhdrClick)
                                selObj.selectColumns(sheet._startCell.colIndex, sheet._endCell.colIndex);
                            else
                                selObj.selectRange(sheet._startCell, sheet._endCell, trgt);
							isRibbonUpdated = true;
                            if (sheet._isFreezed)
                                xlObj.XLFreeze._refreshSelection();
                        }
                    }
                    else if ($trgt.parents(".e-rowheadercontent").length) {
                        if (selObj._colhdrClick || selObj._rowhdrClick) {
                            if (type === types.Column)
                                selObj.selectColumns(0, sheet.colCount - 1);
                            else
                                selObj.selectRows(sheet._startCell.rowIndex, sheet._endCell.rowIndex);
							isRibbonUpdated = true;
                            selObj._hdrClick = false;
                        }
                        selObj._isOutsideBordering = selObj._isGridBordering = false;
						cont.removeClass("e-ss-drwbrdrcursor e-ss-drwbrdrgridcursor").addClass("e-ss-cursor");
                    }
                    else
                        return;
                }
                if (trgt.tagName === "TD" && xlObj.model.showRibbon) {
                    btnObj = $("#" + xlObj._id + "_Ribbon_clearfilter").data("ejButton");
                    if (btnObj)
                        xlObj.XLRibbon._changeClrFltrStatus(btnObj, "button", xlObj._getCellIdx(trgt));
                }
			}
            else if (!selObj._aFillDownHandler && !ej.isNullOrUndefined(trgt.parentNode) && trgt.parentNode.tagName == "TH") {
                sheet._startCell = sheet._activeCell;
                sheet._endCell = selObj._isRightClick ? sheet._startCell : { rowIndex: 0, colIndex: trgt.parentNode.cellIndex };
                selObj._processBoundary();
                if (selObj._colhdrClick || selObj._rowhdrClick) {
                    if (type === types.Row)
                        selObj.selectRows(0, sheet.rowCount - 1);
                    else
                        selObj.selectColumns(sheet._startCell.colIndex, sheet._endCell.colIndex);
					isRibbonUpdated = true;
                }
                selObj._isOutsideBordering = selObj._isGridBordering = false;
				cont.removeClass("e-ss-drwbrdrcursor e-ss-drwbrdrgridcursor").addClass("e-ss-cursor");
            }
            else if (typeof trgt.className != "object" && trgt.className && trgt.className.indexOf("e-spreadsheetcolumnheader") > -1) {
                selObj.selectSheet(true);
                selObj._isOutsideBordering = selObj._isGridBordering = false;
				cont.removeClass("e-ss-drwbrdrcursor e-ss-drwbrdrgridcursor").addClass("e-ss-cursor");
            }
			if(xlObj.model.allowCellFormatting && xlObj.XLFormat._formatEnable)
			    xlObj.XLFormat._fPMouseUp(e);
			if(xlObj.model.showRibbon && !isRibbonUpdated)
			    xlObj.XLEdit._isEdit ? xlObj.XLRibbon._disableRibbonIcons() : xlObj.XLRibbon._updateRibbonIcons();
			if (xlObj.model.allowAutoFill && !selObj._isOutsideBordering && !selObj._isGridBordering)
			    xlObj.XLDragFill.positionAutoFillElement(selObj._aFillDownHandler);
            selObj._isRightClick = selObj._aFillDownHandler = false;
            selObj._colhdrClick = selObj._rowhdrClick = false;
            if (xlObj.model.showRibbon) {
                mergeBtn = $("#" + xlObj._id + "_Ribbon_merge").data("ejSplitButton");
                if (!ej.isNullOrUndefined(mergeBtn) && (xlObj.model.allowLockCell && !sheet.isSheetProtected))
                    xlObj.XLRibbon._isDirtySelect ? mergeBtn.option("enabled", false) : mergeBtn.option("enabled", true);
            }
            if (xlObj.model.allowEditing && this.XLEdit._isEdit) {
                cell = xlObj.getSheet(sheetIdx)._startCell;
                xlObj.getCell(cell.rowIndex, cell.colIndex).find('.e-ss-input').focus();
            }
        },

        _processBoundary: function () {
            var i, status, cell, cells, mergeIdx, idx, arr = [], xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(),
                sheet = xlObj.getSheet(sheetIdx), sCell = sheet._startCell, eCell = sheet._endCell,
                range = xlObj.swapRange([sCell.rowIndex, sCell.colIndex, eCell.rowIndex, eCell.colIndex]);
            sheet._startCell = { rowIndex: range[0], colIndex: range[1] };
            sheet._endCell = { rowIndex: range[2], colIndex: range[3] }; 
            cells = xlObj._getSelectedRange({ rowIndex: range[0], colIndex: range[1] }, { rowIndex: range[0], colIndex: range[3] });// top
            cells = cells.concat(xlObj._getSelectedRange({ rowIndex: range[0], colIndex: range[3] }, { rowIndex: range[2], colIndex: range[3] }));// right
            cells = cells.concat(xlObj._getSelectedRange({ rowIndex: range[2], colIndex: range[1] }, { rowIndex: range[2], colIndex: range[3] }));// bottom
            cells = cells.concat(xlObj._getSelectedRange({ rowIndex: range[0], colIndex: range[1] }, { rowIndex: range[2], colIndex: range[1] }));// left
            i = cells.length;
            while (i--) {
                cell = cells[i];
                mergeIdx = xlObj.XLEdit.getPropertyValue(cells[i].rowIndex, cells[i].colIndex, "mergeIdx", sheetIdx);
                idx = (cell.rowIndex + ":" + cell.colIndex).toString();
                status = xlObj.hasSpan(cell) && arr.indexOf(idx) === -1 && (arr.push(idx), this._updateRange(cell, range));
                if (mergeIdx) {
                    idx = (mergeIdx.rowIndex + ":" + mergeIdx.colIndex).toString();
                    if (arr.indexOf(idx) === -1) {
                        arr.push(idx);
                        status = this._updateRange(mergeIdx, range);
                    }
                }
                if (status)
                    break;
            }
            if(status)
                this._processBoundary();
        },

        _updateRange: function (cell, range) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), temp = range.slice(0),
            mergeRange = xlObj._getMergedIdx(cell.rowIndex, cell.colIndex), minr = cell.rowIndex,
            minc = cell.colIndex, maxr = mergeRange.rowIndex, maxc = mergeRange.colIndex;
            minr < range[0] && (range[0] = minr);
            minc < range[1] && (range[1] = minc);
            maxr > range[2] && (range[2] = maxr);
            maxc > range[3] && (range[3] = maxc);
            if (range[0] != temp[0] || range[1] != temp[1] || range[2] != temp[2] || range[3] != temp[3]) {
                sheet._startCell = { rowIndex: range[0], colIndex: range[1] };
                sheet._endCell = { rowIndex: range[2], colIndex: range[3] };
                return true;
            }
        },

        selectRange: function (range, endCell, trgt, isbgSelect) {
            var args, cells, cnt, currRange, isTrue, isUndefined, isVirScroll, prevRange, sheet, sheetIdx, startCell = range,
                xlObj = this.XLObj, selected = "e-selected";
            if (!xlObj.model.allowSelection)
                return;
            if (!xlObj._isObject(range)) {
                range = xlObj._getRangeArgs(range, "object");
                startCell = { rowIndex: range[0], colIndex: range[1] };
                endCell = { rowIndex: range[2], colIndex: range[3] };
            }
            sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx);
            isVirScroll = xlObj.model.scrollSettings.allowVirtualScrolling;
            if (isVirScroll)
                sheet._goToCollection = { multiple: false, selected: [] };
            prevRange = sheet.selectedRange;
            currRange = xlObj.swapRange([startCell.rowIndex, startCell.colIndex, endCell.rowIndex, endCell.colIndex]);
            isTrue = !(xlObj.isImport || xlObj.model.isImport) && (!sheet._isImported || sheet._isLoaded);
            if (isTrue && xlObj.model.beforeCellSelect) {
                args = { prevRange: prevRange, currRange: currRange, sheetIdx: sheetIdx };
                if (trgt)
                    args.target = trgt;
                if (!xlObj._intrnlReq && xlObj._trigger("beforeCellSelect", args))
                    return false;
            }
            xlObj._dStartCell = startCell;
            xlObj._dEndCell = endCell;
            sheet.selectedRange = currRange.slice(0);
            !xlObj._isScrolling && this._cleanUp(false);
            if (xlObj.model.scrollSettings.allowScrolling && isVirScroll && sheet._isColSelected) {
                if (sheet._virtualRowIdx.indexOf(currRange[0]) === -1)
                    currRange[0] = sheet._virtualRowIdx[0];
                if (sheet._virtualRowIdx.indexOf(currRange[2]) === -1)
                    currRange[2] = sheet._virtualRowIdx[sheet._virtualRowIdx.length - 1];
            }
            isUndefined = xlObj.isUndefined(isbgSelect);
            if (isUndefined) {
                cells = xlObj.getRange(currRange);
                cnt = cells.length;
                if (cnt) {
                    while (cnt--)
                        xlObj.addClass(cells[cnt], selected);
                }
            }            
            if (!xlObj.inRange(sheet.selectedRange, sheet._activeCell.rowIndex, sheet._activeCell.colIndex)) // to set first cell as active cell #default
                sheet._activeCell = { rowIndex: sheet.selectedRange[0], colIndex: sheet.selectedRange[1] };
            sheet._activeCell = xlObj._getMergeParent(sheet._activeCell.rowIndex, sheet._activeCell.colIndex);            
            if (xlObj._isRowViewable(sheetIdx, sheet._activeCell.rowIndex))
                xlObj.addClass(xlObj.getCell(sheet._activeCell.rowIndex, sheet._activeCell.colIndex)[0], "e-activecell");               
            if (isUndefined) {
                this._focusRange(startCell, endCell, xlObj._selectionBorder);
                this._highlightHeader(currRange);
            }
            sheet._selectedCells = xlObj._getSelectedRange(startCell, endCell);
            if (xlObj.model.allowFormulaBar && !xlObj.XLEdit._isFormulaEdit)                
                xlObj.updateFormulaBar();
			xlObj.XLDragFill && xlObj.XLDragFill.positionAutoFillElement();
            if(isUndefined && (xlObj.model.enableContextMenu || xlObj.model.showRibbon))
                xlObj.XLRibbon._dirtySelect(cells);
            xlObj._isMultiSelect = true;
            if (xlObj.model.showRibbon && !xlObj._isScrolling)
                xlObj.XLRibbon._updateRibbonIcons();
            if (!xlObj._isSheetNavigate)
                sheet._isEmptyActiveCell = sheet._isRangeSelected = sheet._isRowSelected = sheet._isColSelected = sheet._isSheetSelected = false;
            if (isTrue && xlObj.model.cellSelected) {
                args = { selectedRange: sheet.selectedRange, target: trgt, sheetIdx: sheetIdx };
                if (!xlObj._intrnlReq)
                    xlObj._trigger("cellSelected", args);
            }
        },

        selectRow: function (rowIdx) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(xlObj.getActiveSheetIndex());
            if (!xlObj.model.allowSelection)
                return;
            sheet._startCell = { rowIndex: rowIdx, colIndex: 0 };
            sheet._endCell = { rowIndex: rowIdx, colIndex: sheet.colCount - 1 };
            this.selectRange(sheet._startCell, sheet._endCell);
            this._selectRow(xlObj._getRowIdx(rowIdx), "e-rowselected");
            sheet._isRowSelected = true;
            this._isRowSelected = true;
        },

        selectRows: function (startIndex, endIndex) {
            var sheet, xlObj = this.XLObj;
            if (!xlObj.model.allowSelection)
                return;
            sheet = xlObj.getSheet(xlObj.getActiveSheetIndex());            
            sheet._startCell = { rowIndex: startIndex, colIndex: 0 };
            sheet._endCell = { rowIndex: endIndex, colIndex: sheet.colCount - 1 };
            this.selectRange(sheet._startCell, sheet._endCell);
            this._markHeaderSelection([sheet._startCell.rowIndex, sheet._startCell.colIndex, sheet._endCell.rowIndex, sheet._endCell.colIndex], "row");
            sheet._isRowSelected = true;
            this._isRowSelected = true;
        },

        selectColumn: function (colIdx) {
            var sheet, xlObj = this.XLObj;
            if (!xlObj.model.allowSelection)
                return;
            sheet = xlObj.getSheet(xlObj.getActiveSheetIndex());
            sheet._startCell = { rowIndex: 0, colIndex: colIdx };
            sheet._endCell = { rowIndex: sheet.rowCount - 1, colIndex: colIdx };
            this.selectRange(sheet._startCell, sheet._endCell);
            this._selectColumn(colIdx, "e-colselected");
            sheet._isColSelected = true;
            this._isColSelected = true;
        },

        selectColumns: function (startIndex, endIndex) {
            var sheet, xlObj = this.XLObj;
            if (!xlObj.model.allowSelection)
                return;
            sheet = xlObj.getSheet(xlObj.getActiveSheetIndex());
            sheet._startCell = { rowIndex: 0, colIndex: startIndex };
            sheet._endCell = { rowIndex: sheet.rowCount - 1, colIndex: endIndex };
            this.selectRange(sheet._startCell, sheet._endCell);
            this._markHeaderSelection([sheet._startCell.rowIndex, sheet._startCell.colIndex, sheet._endCell.rowIndex, sheet._endCell.colIndex], "column");
            sheet._isColSelected = true;
            this._isColSelected = true;
        },

        selectSheet: function (isMouse) {
            var  rowIdx, colIdx, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), actCell = xlObj.getActiveCell();
            if (!xlObj.model.allowSelection)
                return;
            if(isMouse){
				rowIdx = sheet._topRow.idx;
				colIdx = sheet._leftCol.idx;
				if(actCell.rowIndex != rowIdx || actCell.colIndex != colIdx){
					sheet._activeCell = { rowIndex: sheet._topRow.idx, colIndex: sheet._leftCol.idx };
					xlObj.XLScroll.scrollToCell(xlObj._getRangeArgs([rowIdx, colIdx, rowIdx, colIdx]));
				}
			}
            sheet._startCell = { rowIndex: 0, colIndex: 0 };
            sheet._endCell = { rowIndex: sheet.rowCount - 1, colIndex: sheet.colCount - 1 };
            this.selectRange(sheet._startCell, sheet._endCell);
            xlObj.element.find(".e-spreadsheetcolumnheader").addClass("e-sheetselected");           
            sheet._isSheetSelected = true;
        },

        refreshSelection: function (range) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(xlObj.getActiveSheetIndex()), range = xlObj._getRangeArgs(range, "object"),
                minr = range[0], minc = range[1], maxr = range[2], maxc = range[3];
            if (sheet._isRowSelected)
                this.selectRows(minr, maxr);
            else if (sheet._isColSelected)
                this.selectColumns(minc, maxc);
            else if (sheet._isSheetSelected)
                this.selectSheet();
            else
                this.selectRange({ rowIndex: minr, colIndex: minc }, { rowIndex: maxr, colIndex: maxc });
        },

        getSelectedCells: function (sheetIdx) {
            return this.XLObj._getContent(this.XLObj._getSheetIndex(sheetIdx))[0].querySelectorAll("td.e-selected");
        },

        _select: function (args, classname) {
            var elem = this.XLObj.getCell(args.rowIndex, args.colIndex);
            if (elem)
                elem.addClass(classname);
        },

        _selectRow: function (args, classname) {
            var elem = this.XLObj._getJSSheetRowHeaderContent(this.XLObj.getActiveSheetIndex()).find("td:eq(" + args + ")");
            if (elem)
                elem.addClass(classname);
        },

        _selectRows: function (startRIndex, endRIndex, classname) {
            var len, sRIndex, eRIndex, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(),
                sheet = xlObj.getSheet(sheetIdx), elems = xlObj._getJSSheetRowHeaderContent(sheetIdx).find("td");
            sRIndex = xlObj._getRowIdx(startRIndex);
            eRIndex = xlObj._getRowIdx(endRIndex);
            if (sRIndex === -1) {
                if (startRIndex < sheet._virtualRowIdx[0])
                    sRIndex = 0;
                else
                    return;
            }
            if (eRIndex === -1) {
                len = sheet._virtualRowIdx.length - 1;
                if (endRIndex > sheet._virtualRowIdx[len])
                    eRIndex = len;
                else
                    return;
            }
            elems = (sRIndex !== eRIndex) ? elems.slice(sRIndex, eRIndex + 1) : elems.eq(eRIndex);
            len = elems.length;
            if (len) {
                while (len--)
                    xlObj.addClass(elems[len], classname);
            }            
        },


        _selectColumn: function (args, classname) {
            var elem = this.XLObj._getJSSheetHeader(this.XLObj.getActiveSheetIndex()).find("th:eq(" + args + ")");
            if (elem)
                elem.addClass(classname);
        },

        _selectColumns: function (startCIndex, endCIndex, classname) {
            var i, xlObj = this.XLObj, elems = xlObj._getJSSheetHeader(xlObj.getActiveSheetIndex()).find("th");
            elems = (endCIndex !== startCIndex) ? elems.slice(startCIndex, endCIndex + 1) : elems.eq(endCIndex);
            i = elems.length;            
            if (i) {
                while (i--)
                    xlObj.addClass(elems[i], classname);
            }
        },

        _focusBorder: function (startcell, endcell, classes) {  // consider
            var xlObj = this.XLObj, range = xlObj.swapRange([startcell.rowIndex, startcell.colIndex, endcell.rowIndex, endcell.colIndex]),
            minr = range[0], minc = range[1], maxr = range[2], maxc = range[3];
            if(minr)
                xlObj.getRange([minr - 1, minc, minr - 1, maxc]).addClass(classes[1]); // top, original minr -1 in 3rd args, minc in 2nd args                            
            xlObj.getRange([minr, maxc, maxr, maxc]).addClass(classes[0]); // right
            xlObj.getRange([maxr, minc, maxr, maxc]).addClass(classes[1]); // bottom
            if(minc)
                xlObj.getRange([minr, minc - 1, maxr, minc - 1]).addClass(classes[0]); // left, original is minc - 1 in 2nd args, maxr in 3rd args
        },

        _focusRange: function (startcell, endcell, border) {
            var elem, i = 4, xlObj = this.XLObj, elems = [xlObj.getFocusTopElem(), xlObj.getFocusRightElem(), xlObj.getFocusBottomElem(), xlObj.getFocusLeftElem()],
                classes = ["e-focustop ", "e-focusright ", "e-focusbottom ", "e-focusleft "];            
            while (i--) {
                elem = elems[i][0];
                xlObj._removeClass(elem);
                xlObj.addClass(elem, classes[i] + border[i]);
            }
            this._refreshBorder(xlObj.swapRange([startcell.rowIndex, startcell.colIndex, endcell.rowIndex, endcell.colIndex]));
        },

        _refreshBorder: function (range) {
            range = range ? range : this.XLObj.getSheet().selectedRange;
            var type, time, bleft, lleft, ttop, tleft, hide = "e-hide", i = 4, minr = range[0], minc = range[1], xlObj = this.XLObj, focusInfo = this._focusInfo(range), 
                topElem = xlObj.getFocusTopElem(), rightElem = xlObj.getFocusRightElem(), bottomElem = xlObj.getFocusBottomElem(),
                leftElem = xlObj.getFocusLeftElem(), elems = [topElem, rightElem, bottomElem, leftElem], ltop = ttop = focusInfo.topLeft.top,      
                twid = (focusInfo.topRight.left + focusInfo.topRight.width) - focusInfo.topLeft.left,
                rtop = focusInfo.topRight.top, rleft = focusInfo.topRight.left + focusInfo.topRight.width, rhgt = (focusInfo.bottomRight.top + focusInfo.bottomRight.height) - rtop,
                btop = focusInfo.bottomLeft.top + focusInfo.bottomLeft.height, bwid = (focusInfo.bottomRight.left + focusInfo.bottomRight.width) - focusInfo.bottomLeft.left, lhgt = btop - ttop;
            bleft = lleft = tleft = focusInfo.topLeft.left;
            while (i--)
                xlObj._removeClass(elems[i][0], hide);
            if (xlObj.model.selectionSettings.enableAnimation) {
                type = xlObj.model.selectionSettings.animationType;
                time = xlObj.model.selectionSettings.animationTime;
                minr ? topElem.animate({ top: ttop.toString(), left: tleft.toString(), width: twid.toString() }, time, type) : topElem.addClass(hide);
                rightElem.animate({ top: rtop.toString(), left: rleft.toString(), height: rhgt.toString() }, time, type);
                bottomElem.animate({ top: btop.toString(), left: bleft.toString(), width: bwid.toString() }, time, type);
                minc ? leftElem.removeClass(hide).animate({ top: ltop.toString(), left: lleft.toString(), height: lhgt.toString() }, time, type) : leftElem.addClass(hide);
            }
            else {
				if(topElem) {
					if(minr) {
						topElem[0].style.top = ttop + "px";
						topElem[0].style.left = tleft + "px";
						topElem[0].style.width = twid + "px";					
					}
					else
						topElem.addClass(hide)
				}
				if(rightElem) {
					rightElem[0].style.top = rtop + "px";
					rightElem[0].style.left = rleft + "px";
					rightElem[0].style.height = rhgt + "px";
				}
				if(bottomElem) {
					bottomElem[0].style.top = btop + "px";
					bottomElem[0].style.left = bleft + "px";
					bottomElem[0].style.width = bwid + "px";					
				}
				if(leftElem) {
					if(minc) {
						leftElem[0].style.top = ltop + "px";
						leftElem[0].style.left = lleft + "px";
						leftElem[0].style.height = lhgt + "px";					
					}
					else
						leftElem.addClass(hide)
				}
            }
        },

        _focusInfo: function (range) {
            var obj = {}, minr = range[0], minc = range[1], maxr = range[2], maxc = range[3], xlObj = this.XLObj;
            obj.topLeft = xlObj._getCellInfo({ rowIndex: minr, colIndex: minc });
            obj.topRight = xlObj._getCellInfo((minc === maxc) ? { rowIndex: minr, colIndex: maxc } : xlObj._getMergedIdx(minr, maxc));
            obj.bottomLeft = xlObj._getCellInfo({ rowIndex: maxr, colIndex: minc });
            obj.bottomRight = xlObj._getCellInfo(xlObj._getMergedIdx(maxr, maxc));
            return obj;
        },

        _highlightHeader: function (range) {
            this._selectRows(range[0], range[2], "e-rowhighlight");
            this._selectColumns(range[1], range[3], "e-colhighlight");
        },

        _hideShowSelElem: function (dsply) {
            var xlObj = this.XLObj, method = (dsply === "block") ? "_removeClass" : "addClass";
            if (!xlObj.model.allowSelection)
                return;
            xlObj[method](xlObj.getAutoFillElem()[0], "e-hide");
            xlObj[method](xlObj.getFocusBottomElem()[0], "e-hide");
            xlObj[method](xlObj.getFocusTopElem()[0], "e-hide");
            xlObj[method](xlObj.getFocusLeftElem()[0], "e-hide");
            xlObj[method](xlObj.getFocusRightElem()[0], "e-hide");
        },

        _markHeaderSelection: function (range, type) {
            var i, j, xlObj = this.XLObj;
            range = xlObj.swapRange(range);
            i = range[0];
            if (type === "row") {
                j = range[2];
                while (i <= j) {
					if(xlObj._isRowViewable(xlObj.getActiveSheetIndex(), i))
						this._selectRow(xlObj._getRowIdx(i), "e-rowselected");
                    i++;
                }
            }
            else {
                i = range[1];
                j = range[3];
                while (i <= j) {
                    this._selectColumn(i, "e-colselected");
                    i++;
                }
            }
        },

        _processFormulaRange: function (border, ismousemove) {
            var alpharange, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), scell = xlObj._dStartCell, ecell = xlObj._dEndCell,
                editcell = xlObj._getContent(sheetIdx).find(".e-editedcell");
            this._focusBorder(scell, ecell, border[xlObj._ctrlKeyCount % 6]);                        
            if (xlObj.model.allowAutoFill) {
                alpharange = xlObj._getAlphaRange(sheetIdx, scell.rowIndex, scell.colIndex, ecell.rowIndex, ecell.colIndex);
                xlObj.XLDragFill.hideAutoFillElement();
                xlObj.XLEdit._updateFormulaCellRange(alpharange);
            }
            xlObj.XLEdit._isCellEdit ? xlObj.XLEdit._focusElements(editcell) : xlObj._getInputBox().focus();
        },


        _scrollCalculation: function (sheetIdx, target, status) {
            var interval, reachedEnd, hScroll, vScroll, xlObj = this.XLObj, sheet, diff;
            if (xlObj.model.scrollSettings.allowVirtualScrolling)
                return;
            sheet = xlObj.getSheet(xlObj.getActiveSheetIndex());
            xlObj.XLSelection._isEndReached = true;
            interval = setInterval(function (e) {
                hScroll = xlObj.XLScroll._hScroller(sheetIdx);
                vScroll = xlObj.XLScroll._vScroller(sheetIdx);
                if (!xlObj.XLSelection._isEndReached) {
                    clearInterval(interval);
                    return;
                }
                if (status.position === "horizontal") {
                    if (status.action == "Increment") {
                        reachedEnd = Math.ceil(parseFloat(hScroll.element.find(".e-hhandle").css('left'))) + Math.ceil(parseFloat(hScroll.element.find(".e-hhandle").width())) >= hScroll.element.find(".e-hhandlespace").width() - 2;
                        if (reachedEnd) {
                            if (xlObj.model.scrollSettings.scrollMode != ej.Spreadsheet.scrollMode.Normal)
                                xlObj.XLScroll._scrollX(sheetIdx);
                            else
                                clearInterval(interval);
                        }
                        else
                            hScroll.scroll(hScroll.value() + sheet.columnWidth, true);
                        if (!xlObj.XLShape._shapeROStart && !xlObj.XLShape._shapeRSStart)
                            sheet._endCell.colIndex = sheet.colCount - 1;
                    }
                    else {
                        diff = hScroll.value() - sheet.columnWidth;
                        if(diff < 0)
                            diff = 0;
                        if(hScroll.value() >= 0)
                            hScroll.scroll(diff, true);
                        if (xlObj.XLSelection._aFillDownHandler)
                            sheet._endCell.colIndex = sheet._leftCol.idx;
                        if (sheet._frozenColumns > 1) {
                            sheet._startCell = sheet._activeCell;
                            sheet._endCell.rowIndex = (sheet.selectedRange[2] === sheet._startCell.rowIndex) ? sheet.selectedRange[0] : sheet.selectedRange[2];
                            sheet._endCell.colIndex = sheet._fleftColIdx;
                        }
                    }
                }
                else if (status.position === "vertical") {
                    if (status.action == "Increment") {
                        reachedEnd = Math.ceil(parseFloat(vScroll.element.find(".e-vhandle").css('top'))) + Math.ceil(parseFloat(vScroll.element.find(".e-vhandle").height())) >= vScroll.element.find(".e-vhandlespace").height() - 2;
                        if (reachedEnd) {
                            if (xlObj.model.scrollSettings.scrollMode != ej.Spreadsheet.scrollMode.Normal)
                                xlObj.XLScroll._scrollY(sheetIdx);
                            else
                                clearInterval(interval);
                        }
                        else
                            vScroll.scroll(vScroll.value() + xlObj.model.rowHeight, true);
                        if (!xlObj.XLShape._shapeROStart && !xlObj.XLShape._shapeRSStart)
                            sheet._endCell.rowIndex = sheet.rowCount - 1;
                    }
                    else {
                        diff = vScroll.value() - xlObj.model.rowHeight;
                        if(diff < 0)
                            diff = 0;
                        if(vScroll.value() > 0)
                            vScroll.scroll(diff, true);
                        if (!xlObj.XLShape._shapeROStart && !xlObj.XLShape._shapeRSStart) {
                            if (sheet._topRow.idx < 1 && sheet._ftopRowIdx + 1 === sheet._frozenRows)
                                return;
                            sheet._startCell = sheet._activeCell;
                            sheet._endCell.rowIndex = sheet._frozenRows > 1 ? sheet._ftopRowIdx : sheet._topRow.idx - 1;
                            sheet._endCell.colIndex = sheet._frozenRows > 1 ? (sheet.selectedRange[3] === sheet._startCell.colIndex) ? sheet.selectedRange[1] : sheet.selectedRange[3] : target.parentNode.cellIndex;
                        }
                    }
                }
                if (!xlObj.XLShape._shapeROStart && !xlObj.XLShape._shapeRSStart) {
                    if (xlObj.XLSelection._aFillDownHandler)
                        xlObj.XLDragFill._selectAutoFillRange(null, sheet._endCell)
                    else
                        xlObj.XLSelection.selectRange(sheet._startCell, sheet._endCell);
                }
            }, 200);
            if (xlObj._browserDetails.name === "msie" && xlObj._browserDetails.version === "8.0") {
                target.attachEvent("onmouseup", function (e) {
                    clearInterval(interval);
                });
                document.attachEvent("onmouseup", function (e) {
                    clearInterval(interval);
                });
            }
            else {
            target.addEventListener("mouseup", function (e) {
                clearInterval(interval);
            });
            document.addEventListener("mouseup", function (e) {
                clearInterval(interval);
            });
            }
        },

        _cleanUp: function (border) {
            var i, cells, isNormal = false, hide = "e-hide", xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), topElem = xlObj.getFocusTopElem(),
               sElem = xlObj.getSheetElement(sheetIdx), className = "e-activecell|e-selected|e-rowhighlight|e-colhighlight|e-rowselected|e-colselected|e-sheetselected";
            if (xlObj.model.allowAutoFill)
                xlObj.XLDragFill._autoFillCleanUp();
            if (sheet._isSheetSelected && !xlObj.model.scrollSettings.allowVirtualScrolling) {
                isNormal = true;
                sElem.detach();
            }
            cells = sElem.find(".e-selected,.e-rowselected,.e-colselected,.e-rowhighlight,.e-colhighlight,.e-sheetselected,.e-activecell");
            i = cells.length;
            while (i--)
                cells[i].className = cells[i].className.replace(new RegExp(className, "g"), '').replace(/ +/g, ' ');
            if (isNormal)
                xlObj.getMainPanel(sheetIdx).find(".e-spreadsheet-list").append(sElem);
            if (border && topElem) {
                xlObj.addClass(topElem[0], hide);
                xlObj.addClass(xlObj.getFocusRightElem()[0], hide);
                xlObj.addClass(xlObj.getFocusBottomElem()[0], hide);
                xlObj.addClass(xlObj.getFocusLeftElem()[0], hide);
            }
            sheet._selectedCells = [];
        },
        clearAll: function (skipBorder) {
            this._cleanUp(!skipBorder);
        },
        _clearBorder: function (classes) {
            var xlObj = this.XLObj;
            xlObj._getContent(xlObj.getActiveSheetIndex()).find("td[class *='border']").removeClass(classes);
        }
    };
})(jQuery, Syncfusion);