(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.dragAndDrop = function (obj) {
        this.XLObj = obj;
        this._isDragAndDropStart = false;
        this._dragAndDropCell = { rowIndex: 0, colIndex: 0 };
        this._isDragAndDropped = false;
        this._allowDragAndDrop = false;
		this._target = null;
        this._cellIdx = {};
    };

    ej.spreadsheetFeatures.dragAndDrop.prototype = {
        moveRangeTo: function (sourcerange, destinationrange) {
            this._moveRangeTo(sourcerange, destinationrange);
        },

        _moveRangeTo: function(sourcerange, destinationrange, property) {
            var xlObj = this.XLObj;
            if (!xlObj.model.allowDragAndDrop || xlObj.model.isReadOnly || !xlObj.model.allowEditing)
                return;
            var sheetIdx, sheet, data, details, format, dStartCell, dEndCell, tabDetails, sourcecformatrule, destinationcformatrule, trule, range, isTable,
                sourceRowHt = [], destRowHt = [], prevDestRowHt = [], isFilter;
            sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx);
            sourcerange = xlObj.swapRange(xlObj._toIntrnlRange(sourcerange, sheetIdx));
            destinationrange = xlObj.swapRange(xlObj._toIntrnlRange(destinationrange, sheetIdx));
            destinationrange[2] = destinationrange[0] + (sourcerange[2] - sourcerange[0]);
            destinationrange[3] = destinationrange[1] + (sourcerange[3] - sourcerange[1]);
            dStartCell = { rowIndex: destinationrange[0], colIndex: destinationrange[1] };
            dEndCell = { rowIndex: destinationrange[2], colIndex: destinationrange[3] };
			property = property || ["value", "value2", "type", "formatStr", "decimalPlaces", "thousandSeparator", "range", "format", "border", "borders", "comment", "hyperlink", "picture", "cFormatRule", "rule", "chart", "isLocked", "wrap", "formats", "tformats", "tborders", "isFilterHeader", "filterState", "isFilterVisible", "tableName"];
            data = xlObj.getRangeData({ range: sourcerange, property: property });
            if (xlObj.model.allowCellFormatting)
                format = xlObj.XLFormat.getHashCodeClassAsArray(sourcerange);
            if (xlObj.model.allowConditionalFormats)
                sourcecformatrule = xlObj.XLEdit.getPropertyValue(sourcerange[0], sourcerange[1], "cFormatRule");
            if (!xlObj.isUndefined(sourcecformatrule) && sourcecformatrule.length > 0) {
                trule = sourcecformatrule[0].split("_");
                sourcecformatrule = { action: trule[0], inputs: [trule[2], trule[3]], color: trule[4], range: trule[5] };
            }
            for (var i = sourcerange[0]; i <= sourcerange[2]; i++){
                sourceRowHt.push({ rowIndex: i, height: sheet.rowsHeightCollection[i] });
				for (var j = sourcerange[1]; j <= sourcerange[3]; j++)
					if (xlObj.XLEdit.getPropertyValue(i, j, 'wrap'))
						xlObj.setWrapText("unwrap", xlObj._getAlphaRange(sheetIdx, i, j, i, j));
			}
            details = {
                sheetIndex: sheetIdx,
                reqType: "reorder-cells",
                sourceData: $.extend(true, [], data),
                sourceRange: sourcerange,
                destinationRange: destinationrange,
                sourceFormat: format,
                destinationFormat: xlObj.model.allowCellFormatting && xlObj.XLFormat.getHashCodeClassAsArray(destinationrange),
                destinationData: xlObj.getRangeData({ range: destinationrange }),
                sourceCFormat: sourcecformatrule,
                sourceHeight: sourceRowHt,
				property: property
            };
            if (xlObj.XLRibbon._isDirtySelect) {
                xlObj._showAlertDlg("Alert", "DragAlert", null, 440);
                xlObj.performSelection(sourcerange);
                return;
            }
            else {
                isTable = xlObj._checkTableRange(xlObj._getAlphaRange(sheetIdx, sourcerange[0], sourcerange[1], sourcerange[2], sourcerange[3]));
                isFilter = xlObj._checkFilterRange(xlObj._getAlphaRange(sheetIdx, sourcerange[0], sourcerange[1], sourcerange[2], sourcerange[3]));
                xlObj._dupDetails = true;
                if (isTable.status === 'full') {
                    details.tblObj = isTable.tableObj;
                    details.tblObj.tblId = isTable.tblId;
                    details.tblObj.header = true;
                    xlObj.XLFormat.removeTable(isTable.tblId);
                    xlObj.XLFormat.removeStyle(isTable.range);
                }
                else if (isFilter.status === "full") {
                    details.tRange = isFilter.tRange;
                    xlObj.XLFilter.clearFilter("remove");
                }
                else if (isTable.status === 'partial' || isFilter.status === "partial" || xlObj.XLRibbon._isFilterSelect.isFiltered) {
                    xlObj._showAlertDlg("Alert", "DragAlert", null, 440);
                    xlObj.performSelection(sourcerange);
                    return;
                }
                if (xlObj.model.allowComments)
                    xlObj.XLComment.deleteComment();
                xlObj.clearRangeData(sourcerange, property);
                xlObj.clearRangeData(destinationrange, property);
                if (!ej.isNullOrUndefined(xlObj._ddlCell)) {
                    xlObj.element.find("#" + xlObj._id + "ddl").ejDropDownList("hidePopup");
                    xlObj.element.find("#" + xlObj._id + "ddlspan").remove();
                    xlObj._ddlCell = null;
                }
                if (xlObj.model.allowCellFormatting && !xlObj.XLRibbon._isDirtySelect) {
                    xlObj.XLFormat.removeStyle(sourcerange);
                    xlObj.XLFormat.removeStyle(destinationrange, { cellStyle: true, format: true, border: true });
                }
                if (xlObj.model.allowConditionalFormats)
                    xlObj.XLCFormat.clearCF(sourcerange, true);
                data[0].cFormatRule = [];
                if (details.tblObj) {
                    details.tblObj.destrange = xlObj._getAlphaRange(sheetIdx, destinationrange[0], destinationrange[1], destinationrange[2], destinationrange[3]);
                    xlObj.XLClipboard._isCut = true;
                    xlObj.XLFormat.createTable(details.tblObj, details.tblObj.destrange);
                    xlObj.XLClipboard._isCut = false;
                }
                this._dragDefineName(sourcerange, destinationrange, sheetIdx);
				var k = 0, rowHtColl = $.extend(true, [], sheet.rowsHeightCollection);
                for (var i = destinationrange[0]; i <= destinationrange[2]; i++) {
                    prevDestRowHt.push({ rowIndex: i, height: rowHtColl[i] })
                    destRowHt.push({ rowIndex: xlObj._getRowIdx(i), height: rowHtColl[i] > 20 ? rowHtColl[i] : sourceRowHt[k].height });
                    k++;
                }
                xlObj.updateData(data, destinationrange);
                if (isFilter.tRange) {
                    xlObj.XLFilter.filter(xlObj._getAlphaRange(sheetIdx, destinationrange[0], destinationrange[1], destinationrange[2], destinationrange[3]));
                    xlObj._dupDetails = false;
                }
                (details.tblObj && details.tblObj.totalRow) && xlObj.XLFormat._updateTotalRow(sheetIdx, details.tblObj.tblId, details.tblObj.fnNumber, destinationrange, false);
                if (xlObj.model.allowCellFormatting)
                    xlObj.XLFormat.updateFormat(format, destinationrange);
                if (xlObj.model.allowConditionalFormats && !xlObj.isUndefined(trule)) {
                    range = xlObj._getAlphaRange(1, destinationrange[0], destinationrange[1], destinationrange[2], destinationrange[3]);
                    destinationcformatrule = { action: trule[0], inputs: [trule[2], trule[3]], color: trule[4], range: range };
                    details.destinationCFormat = destinationcformatrule;
                    xlObj.XLCFormat.setCFRule(destinationcformatrule);
                }                
                xlObj.setHeightToRows(destRowHt);
                details.destHeight = destRowHt;
                details.prevDestRowHt = prevDestRowHt;
                xlObj.setActiveCell(dStartCell.rowIndex, dStartCell.colIndex);
                if (xlObj.model.allowSelection) {
                    if (!dStartCell.rowIndex && dEndCell.rowIndex === sheet.rowCount - 1)
                        xlObj.XLSelection.selectColumns(dStartCell.colIndex, dEndCell.colIndex);
                    else if (!dStartCell.colIndex && dEndCell.colIndex === sheet.colCount - 1)
                        xlObj.XLSelection.selectRows(dStartCell.rowIndex, dEndCell.rowIndex);
                    else
                        xlObj.XLSelection.selectRange(dStartCell, dEndCell);
                    if (sheet._isFreezed)
                        xlObj.XLFreeze._refreshSelection();
                }
                xlObj._dupDetails = false;
                if (!xlObj._isUndoRedo && xlObj.XLFormat && !xlObj.XLFormat._isFAT) {
                    xlObj._completeAction(details);
                    xlObj._trigActionComplete(details);
                }
            }
        },

        _dragDefineName: function (sourcerange, destinationrange, sheetIdx) {
            var xlObj = this.XLObj, nmgr = xlObj.model.nameManager, nmLength = nmgr.length, selectedCells = xlObj._getSelectedCells(sheetIdx, sourcerange).selCells, name, rng, formulaCol, len, sheet = xlObj.getSheet(sheetIdx),
                destSelectedCells = xlObj._getSelectedCells(sheetIdx, destinationrange).selCells, isnmgr, rowIdx, colIdx, nmRangeObj, calcObj = xlObj._calcEngine, depntCellRange, namedRange, dept;
            if (nmLength) {
                for (var i = 0 ; i < nmLength; i++) {
                    nmRangeObj = xlObj._getRangeArgs(xlObj.XLRibbon._getAddrFromDollarAddr(nmgr[i].refersto)[1], "object");
                    if (xlObj.XLClipboard._compareRange(sourcerange, nmRangeObj)) {
                        for (var k = 0; k < selectedCells.length; k++) {
                            if (selectedCells[k].rowIndex == nmRangeObj[0] && selectedCells[k].colIndex == nmRangeObj[3]) {
                                rowIdx = destSelectedCells[k].rowIndex;
                                colIdx = destSelectedCells[k].colIndex;
                                calcDpdntCells = calcObj.getDependentCells().items;
                                obj = Object.keys(calcDpdntCells)[i];
                                if (obj) {
                                    depntCellRange = obj.split("!")[2];
                                    namedRange = xlObj._getRangeArgs(nmRangeObj, "string");
                                    if (depntCellRange == namedRange)
                                        nmgr[i].refersto = xlObj._getDollarAlphaRange([rowIdx, colIdx, rowIdx, colIdx]);
                                    dept = calcObj.getDependentCells().remove('!0!' + depntCellRange);
                                    name = obj.replace(namedRange, xlObj._getRangeArgs([rowIdx, colIdx, rowIdx, colIdx], "string"));
                                    calcObj.getDependentCells().add(name, dept);
                                    isnmgr = true;
                                }
                            }
                        }
                    }
                }
                len = Object.keys(sheet._formulaCollection).length;
                if (len) {
                    for (var j = 0; j < len; j++) {
                        if (isnmgr && dept[j]) {
                            rng = xlObj._getRangeArgs(dept[j].split("!")[2], "object");
                            formulaCol = sheet._formulaCollection[rng[0]][rng[1]];
                            formulaCol._formulaValue = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "value2", sheetIdx);
                            formulaCol._parsedFormula = name;
                            calcObj.getNamedRanges().items[formulaCol._formulaText.split("=")[1].toUpperCase()] = name;
                        }
                    }
                }
            }
        },

        _dMouseHover: function (e) {
            var cellIdx, isLeft, isTop, isRight, isBottom, post, xy, x, y, target = e.target, xlObj = this.XLObj,
                sheetIdx = xlObj.getActiveSheetIndex(), range = xlObj.getSheet(sheetIdx).selectedRange;
            if (xlObj._hasClass(target, "e-rowcell"))
                cellIdx = xlObj._getCellIdx(target);
            if (cellIdx && xlObj.inRange(range, cellIdx.rowIndex, cellIdx.colIndex) && (cellIdx.rowIndex === range[0] || cellIdx.rowIndex === range[2] || cellIdx.colIndex === range[1] || cellIdx.colIndex === range[3]) && !xlObj._isTouchEvt) {
                post = e.target.getBoundingClientRect();
                xy = xlObj._setXY(e);
                x = xy[0];
                y = xy[1];
                isLeft = x - xlObj.getFocusLeftElem().offset().left;
                isLeft = isLeft >= 0 && isLeft <= 5;
                isTop = y - xlObj.getFocusTopElem()[0].getBoundingClientRect().top;
                isTop = isTop >= 0 && isTop <= 5;
                isRight = xlObj.getFocusRightElem().offset().left - x;
                isRight = isRight >= 0 && isRight <= 5;
                isBottom = xlObj.getFocusBottomElem()[0].getBoundingClientRect().top - y;
                isBottom = isBottom >= 0 && isBottom <= 5;
                if ((isLeft && x <= post.left + 5 && x >= post.left)/*left*/ || (isTop && y <= post.top + 5 && y >= post.top)/*top*/ || (isRight && x >= post.right - 5 && x <= post.right)/*right*/ || (isBottom && y >= post.bottom - 5 && y <= post.bottom)/*bottom*/) {
                    xlObj.addClass(target, 'e-cursormove');
                    this._isDragAndDropStart = true;
                    return;
                }
            }
            if (this._isDragAndDropStart && !xlObj._isTouchEvt) {
                xlObj._getContent(sheetIdx).find(".e-cursormove").removeClass("e-cursormove");
                this._isDragAndDropStart = false;
            }
        },

        _dragtouch: function (x, y) {
            var isLeft, isTop, isRight, isBottom, xlObj = this.XLObj;
            isLeft = x - xlObj.getFocusLeftElem().offset().left;
            isTop = y - xlObj.getFocusTopElem().offset().top;
            isRight = xlObj.getFocusRightElem().offset().left - x;
            isBottom = xlObj.getFocusBottomElem().offset().top - y;
            if (isLeft >= -10 && isLeft <= 10 || isTop >= -5 && isTop <= 0 || isRight >= -10 && isRight <= 10 || isBottom >= -5 && isBottom <= 0)
                this._isDragAndDropStart = true;
            else
                this._isDragAndDropStart = false;
        },

        _dMouseDown: function (e) {
            var xlObj = this.XLObj;
            if (xlObj.model.isReadOnly || !xlObj.model.allowEditing)
                return;
            var range, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx);
            e.preventDefault();
            e.stopImmediatePropagation();
            range = xlObj.swapRange([sheet._startCell.rowIndex, sheet._startCell.colIndex, sheet._endCell.rowIndex, sheet._endCell.colIndex]);
            (e.target.nodeName === "TD") && (this._dragAndDropCell = xlObj._getCellIdx(e.target));
            xlObj._dStartCell = { rowIndex: range[0], colIndex: range[1] };
            xlObj._dEndCell = { rowIndex: range[2], colIndex: range[3] };
            if (xlObj._trigger('dragStart', { sheetIndex: sheetIdx, target: e.target, currentCell: this._dragAndDropCell, dragAndDropRange: { startCell: sheet._startCell, endCell: sheet._endCell } }))
                return;
            this._allowDragAndDrop = true;
        },

        _dMouseMove: function (e) {
            if (this._allowDragAndDrop) {
                var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), target = e.target, cellIdx = xlObj._getCellIdx(target), touchEnd;
                if (xlObj._isTouchEvt) {
                    touchEnd = xlObj._getOriginalEvt(e);
                    target = document.elementFromPoint(touchEnd.clientX, touchEnd.clientY);
                    if (target.parentNode && target.parentNode.attributes.getNamedItem("data-idx"))
                        cellIdx = xlObj._getCellIdx(target);
                }
                if (xlObj._trigger("drag", { sheetIndex: sheetIdx, target: target, currentCell: cellIdx, dragAndDropRange: { startCell: sheet._startCell, endCell: sheet._endCell } }))
                    return;
                if (xlObj._isFrozen(sheet.frozenRows) && this._isDragAndDropped && sheet._frozenRows - 1 < sheet._ftopRowIdx && sheet._startCell.rowIndex > sheet._frozenRows - 1 && cellIdx.rowIndex < sheet._frozenRows - 1)
                    cellIdx.rowIndex = sheet._ftopRowIdx;
                if (xlObj._isFrozen(sheet.frozenColumns) && this._isDragAndDropped && sheet._frozenColumns - 1 < sheet._fleftColIdx && sheet._startCell.colIndex > sheet._frozenColumns - 1 && cellIdx.colIndex < sheet._frozenColumns - 1)
                    cellIdx.colIndex = sheet._fleftColIdx;
                this._cellIdx = cellIdx;
                xlObj.XLSelection._focusBorder(sheet._startCell, sheet._endCell, xlObj._thinBorder);
                this._updateDCells(cellIdx);
                if (sheet._isFreezed)
                    this._refreshFocusRange();
                else
                    xlObj.XLSelection._focusRange(xlObj._dStartCell, xlObj._dEndCell, xlObj._autofillBorder);
            }
            else if (!this.XLObj._isTouchEvt)
                this._dMouseHover(e);
        },
        
        _refreshFocusRange: function () {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(), eCIdx = xlObj._dEndCell.colIndex, eRIdx = xlObj._dEndCell.rowIndex, sCIdx = xlObj._dStartCell.colIndex, sRIdx = xlObj._dStartCell.rowIndex;
            if (sheet._frozenRows - 1 < sheet._ftopRowIdx) {
                if (sheet._startCell.rowIndex < sheet._frozenRows - 1) {
                    if (eRIdx >= sheet._frozenRows - 1) {
                        if (eRIdx < sheet._ftopRowIdx)
                            eRIdx = sheet._frozenRows - 2;
                        else if (eRIdx > sheet._ftopRowIdx && sRIdx < sheet._ftopRowIdx)
                            sRIdx = sheet._ftopRowIdx;
                    }
                }
                else
                    sRIdx = (sRIdx < sheet._ftopRowIdx && sRIdx > sheet._frozenRows - 1) ? sheet._ftopRowIdx : xlObj._dStartCell.rowIndex;
            }
            if (sheet._frozenColumns - 1 < sheet._fleftColIdx) {
                if (sheet._startCell.colIndex < sheet._frozenColumns - 1) {
                    if (eCIdx >= sheet._frozenColumns - 1) {
                        if (eCIdx < sheet._fleftColIdx)
                            eCIdx = sheet._frozenColumns - 2;
                        else if (eCIdx > sheet._fleftColIdx && sCIdx < sheet._fleftColIdx)
                            sCIdx = sheet._fleftColIdx;
                    }
                }
                else
                    sCIdx = (sCIdx < sheet._fleftColIdx && sCIdx > sheet._frozenColumns - 1) ? sheet._fleftColIdx : xlObj._dStartCell.colIndex;
            }
                xlObj.XLSelection._focusRange({ rowIndex: sRIdx, colIndex: sCIdx }, { rowIndex: eRIdx, colIndex: eCIdx }, xlObj._autofillBorder);
        },
        
        _dMouseUp: function (e) {
            if (this._isDragAndDropped) {
                var xlObj = this.XLObj, prfmDragDrop = true, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), vscroll = $("#vscrollBar").data('ejScrollBar'), hscroll = $("#hscrollBar").data('ejScrollBar'),
                    preventDrop = false, range = [xlObj._dStartCell.rowIndex, xlObj._dStartCell.colIndex, xlObj._dEndCell.rowIndex, xlObj._dEndCell.colIndex], startCell = { rowIndex: -1, colIndex: -1 },
                    args = { sheetIndex: sheetIdx, isAlert: false, target: e.target, currCell: this._dragAndDropCell, dragAndDropRange: { startCell: sheet._startCell, endCell: sheet._endCell } },
                    thinBorder = xlObj._arrayAsString(xlObj._thinBorder);
                if (xlObj.model.scrollSettings.allowScrolling && (xlObj._dEndCell.rowIndex > sheet.rowCount)) {
                    for (var i = 0, len = (xlObj._dEndCell.rowIndex - xlObj._dStartCell.rowIndex); i < len; i++){
                        xlObj.XLScroll._createNewRow(sheetIdx, -1, -1, "insert");
                    }
                    vscroll._scrollData.step = 1;
                    vscroll.scroll(sheet._scrollTop + ((xlObj._dEndCell.rowIndex - xlObj._dStartCell.rowIndex) * sheet.rowHeight));
                }
                if (xlObj._dEndCell.colIndex > sheet.colCount) {
                    for (var i = 0, len = (xlObj._dEndCell.colIndex - xlObj._dStartCell.colIndex) ; i < len; i++) {
                        xlObj.XLScroll._createNewColumn(sheetIdx, startCell, startCell, "insert");
                    }
                    hscroll._scrollData.step = 1;
                    hscroll.scroll(sheet._scrollLeft + ((xlObj._dEndCell.colIndex - xlObj._dStartCell.colIndex) * sheet.columnWidth));
                }
                this._target = e.target;
                if (xlObj._isUniqueRange(sheet.selectedRange, xlObj.swapRange(range)))
                    this._preventDrop(sheet);
                else {
                    if (xlObj.model.allowLockCell && sheet.isSheetProtected) {
                        if (xlObj._isPropExists([range, sheet.selectedRange], "isLocked", sheetIdx))
                            prfmDragDrop = false;
                    }
                    if (prfmDragDrop && xlObj._isPropExists([range, sheet.selectedRange], "isReadOnly", sheetIdx))
                        prfmDragDrop = false;
                    if (!prfmDragDrop) {
                        this._preventDrop(sheet);
                        xlObj.XLSelection._clearBorder(thinBorder);
                        this._allowDragAndDrop = this._isDragAndDropStart = this._isDragAndDropped = false;
                        return;
                    }
                    preventDrop = xlObj._trigger("beforeDrop", args);
                    if (!args.isAlert && !preventDrop && xlObj._rangeHasData(range))
                        xlObj._showAlertDlg("", "DropAlert", "Drop", 498);
                    else if (!xlObj._rangeHasData(range)) {
                        this.moveRangeTo([sheet._startCell.rowIndex, sheet._startCell.colIndex, sheet._endCell.rowIndex, sheet._endCell.colIndex], [xlObj._dStartCell.rowIndex, xlObj._dStartCell.colIndex, xlObj._dEndCell.rowIndex, xlObj._dEndCell.colIndex]);
                        sheet._startCell = xlObj._dStartCell;
                        sheet._endCell = xlObj._dEndCell;
                        if (sheet._isFreezed)
                            xlObj.XLFreeze._refreshSelection();
                    }
                    else
                        this._preventDrop(sheet);
                }
                xlObj.XLSelection._clearBorder(thinBorder);
                if (xlObj.model.allowAutoFill)                    
					xlObj.XLDragFill.positionAutoFillElement();            
			}
            this._allowDragAndDrop = this._isDragAndDropStart = this._isDragAndDropped = false;
        },
        _scrollHover: function (e) {
            var pix, interval, trgtIdx, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), dColIdx = this._cellIdx.colIndex, dRowIdx = this._cellIdx.rowIndex,
                scrollObj = xlObj.XLScroll, vScroll = scrollObj._vScroller(sheetIdx), hScroll = scrollObj._hScroller(sheetIdx);
            if ($(e.target).parents('.e-vscrollbar').length > 0) {
                interval = setInterval(function () {
                    pix = sheet._scrollLeft + (xlObj._isFrozen(sheet.frozenColumns) ? sheet.columnsWidthCollection[sheet._fleftColIdx] : sheet.columnWidth);
                    hScroll._scrollData.step = 1;
                    hScroll.scroll(pix);
                    xlObj.XLSelection._focusBorder(sheet._startCell, sheet._endCell, xlObj._thinBorder);
                    xlObj.XLDragDrop._updateDCells({ rowIndex: dRowIdx, colIndex: sheet._rightCol.idx - 1 });
                    xlObj.XLSelection._focusRange(xlObj._dStartCell, xlObj._dEndCell, xlObj._autofillBorder);
                    return;
                }, 200);
            }
            else if (e.target.className.indexOf('e-rowheader') > -1) {
                interval = setInterval(function () {
                    pix = sheet._scrollLeft - sheet.columnWidth;
                    hScroll._scrollData.step = -1;
                    if (pix > -1)
                        hScroll.scroll(pix);
                    else
                        hScroll.scroll(0);
                        xlObj.XLSelection._focusBorder(sheet._startCell, sheet._endCell, xlObj._thinBorder);
                        xlObj.XLDragDrop._updateDCells({ rowIndex: dRowIdx, colIndex: sheet._leftCol.idx });
                        xlObj.XLSelection._focusRange(xlObj._dStartCell, xlObj._dEndCell, xlObj._autofillBorder);
                    return;
                }, 200);
            }
            else if ($(e.target).parents('.e-spreadsheetfooter').length > 0 || e.target.className.indexOf('e-spreadsheetfooter') > -1 || $(e.target).parents('.e-hscrollbar').length > 0) {
                interval = setInterval(function () {
                    if (xlObj.model.scrollSettings.allowVirtualScrolling)
                        sheet._isVirtualEndReached ? vScroll.scroll(sheet._scrollTop) : vScroll.scroll(sheet._scrollTop + (xlObj._isFrozen(sheet.frozenRows) ? sheet.rowsHeightCollection[sheet._ftopRowIdx] : sheet.rowHeight));
                    else {
                        vScroll._scrollData.step = 1;
                        vScroll.scroll(sheet._scrollTop + (xlObj._isFrozen(sheet.frozenRows) ? sheet.rowsHeightCollection[sheet._ftopRowIdx] : sheet.rowHeight));
                    }
                    xlObj.XLSelection._focusBorder(sheet._startCell, sheet._endCell, xlObj._thinBorder);
                    xlObj.XLDragDrop._updateDCells({ rowIndex: sheet._bottomRow.idx - 1, colIndex: dColIdx });
                    xlObj.XLSelection._focusRange(xlObj._dStartCell, xlObj._dEndCell, xlObj._autofillBorder);
                    return;
                }, 200);
            }
            else if (e.target.className.indexOf('e-headercell') > -1) {
                interval = setInterval(function () {
                    pix = sheet._scrollTop - sheet.rowHeight;
                    vScroll._scrollData.step = -1;
                    (pix > -1) ? vScroll.scroll(pix): vScroll.scroll(0);
                    xlObj.XLSelection._focusBorder(sheet._startCell, sheet._endCell, xlObj._thinBorder);
                    xlObj.XLDragDrop._updateDCells({ rowIndex: sheet._topRow.idx, colIndex: dColIdx });
                    xlObj.XLSelection._focusRange(xlObj._dStartCell, xlObj._dEndCell, xlObj._autofillBorder);
                    return;
                }, 200);
            }
            else if (e.target.className.indexOf("e-rowcell") > -1) {
                trgtIdx = xlObj._getCellIdx(e.target);
                if ((xlObj._isFrozen(sheet.frozenRows) && trgtIdx.rowIndex < sheet._frozenRows - 1) && sheet._startCell.rowIndex >= sheet._frozenRows - 1) {
                    interval = setInterval(function () {
                        if (xlObj._dStartCell.rowIndex > sheet._ftopRowIdx || !xlObj.XLDragDrop._isDragAndDropped || sheet._frozenRows - 1 === sheet._ftopRowIdx) {
                            if (xlObj._dStartCell.colIndex > sheet._fleftColIdx || !xlObj.XLDragDrop._isDragAndDropped || sheet._frozenColumns - 1 === sheet._fleftColIdx)
                                clearInterval(interval);
                            return;
                        }
                        pix = sheet._scrollTop - sheet.rowHeight;
                        vScroll._scrollData.step = -1;
                        (pix > -1) ? vScroll.scroll(pix) : vScroll.scroll(0);
                        xlObj.XLSelection._focusBorder(sheet._startCell, sheet._endCell, xlObj._thinBorder);
                        xlObj.XLDragDrop._updateDCells({ rowIndex: sheet._ftopRowIdx, colIndex: xlObj.XLDragDrop._cellIdx.colIndex });
                        xlObj.XLSelection._focusRange(xlObj._dStartCell, xlObj._dEndCell, xlObj._autofillBorder);
                        xlObj.XLDragDrop._refreshFocusRange();
                        return;
                    }, 200);
                }
                if ((xlObj._isFrozen(sheet.frozenColumns) && trgtIdx.colIndex < sheet._frozenColumns - 1) && sheet._startCell.colIndex >= sheet._frozenColumns - 1) {
                    interval = setInterval(function () {
                        if (xlObj._dStartCell.colIndex > sheet._fleftColIdx || !xlObj.XLDragDrop._isDragAndDropped || sheet._frozenColumns - 1 === sheet._fleftColIdx) {
                            if (xlObj._dStartCell.rowIndex > sheet._ftopRowIdx || !xlObj.XLDragDrop._isDragAndDropped || sheet._frozenRows - 1 === sheet._ftopRowIdx)
                                clearInterval(interval);
                            return;
                        }
                        pix = sheet._scrollLeft - sheet.columnWidth;
                        hScroll._scrollData.step = -1;
                        (pix > -1) ? hScroll.scroll(pix) : hScroll.scroll(0);
                        xlObj.XLSelection._focusBorder(sheet._startCell, sheet._endCell, xlObj._thinBorder);
                        xlObj.XLDragDrop._updateDCells({ rowIndex: xlObj.XLDragDrop._cellIdx.rowIndex, colIndex: sheet._fleftColIdx });
                        xlObj.XLSelection._focusRange(xlObj._dStartCell, xlObj._dEndCell, xlObj._autofillBorder);
                        xlObj.XLDragDrop._refreshFocusRange();
                        return;
                    }, 200);
                }
            }
            if (xlObj._browserDetails.name === "msie" && xlObj._browserDetails.version === "8.0") {
                e.target.attachEvent("onmouseleave", function () {
                    clearInterval(interval);
                    return;
                });
                document.attachEvent("onmouseleave", function () {
                    clearInterval(interval);
                    return;
                });
                e.target.attachEvent("onmouseup", function () {
                    clearInterval(interval);
                    return;
                });
            }
            else {
            e.target.addEventListener("mouseleave", function () {
                clearInterval(interval);
                return;
            });
            document.addEventListener("mouseleave", function () {
                clearInterval(interval);
                return;
            });
            e.target.addEventListener("mouseup", function () {
                clearInterval(interval);
                xlObj.XLDragDrop._dMouseUp(e);
                return;
                });
            }
        },
        _preventDrop: function (sheet) {
            var xlObj = this.XLObj;
            xlObj.XLSelection._focusRange(sheet._startCell, sheet._endCell, xlObj._selectionBorder);
            xlObj._dStartCell = sheet._startCell;
            xlObj._dEndCell = sheet._endCell;
        },

        _updateDCells: function (cellIdx) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx),
                isRange = xlObj.isRange(sheet.selectedRange);
            if (!(sheet._isColSelected && xlObj.inRange(sheet.selectedRange, 0, sheet._startCell.colIndex))) {
                if (cellIdx.rowIndex < this._dragAndDropCell.rowIndex && xlObj._dStartCell.rowIndex) {
                    xlObj._dStartCell.rowIndex = xlObj._dStartCell.rowIndex - (this._dragAndDropCell.rowIndex - cellIdx.rowIndex);
                    xlObj._dEndCell.rowIndex = isRange ? xlObj._dEndCell.rowIndex - (this._dragAndDropCell.rowIndex - cellIdx.rowIndex) : xlObj._dStartCell.rowIndex;
                }
                else if (cellIdx.rowIndex > this._dragAndDropCell.rowIndex) {
                    xlObj._dStartCell.rowIndex = xlObj._dStartCell.rowIndex + (cellIdx.rowIndex - this._dragAndDropCell.rowIndex);
                    xlObj._dEndCell.rowIndex = isRange ? xlObj._dEndCell.rowIndex + (cellIdx.rowIndex - this._dragAndDropCell.rowIndex) : xlObj._dStartCell.rowIndex;
                }
            }
            if (!(sheet._isRowSelected && xlObj.inRange(sheet.selectedRange, sheet._startCell.rowIndex, 0))) {
                if (cellIdx.colIndex < this._dragAndDropCell.colIndex && xlObj._dStartCell.colIndex) {
                    xlObj._dStartCell.colIndex = xlObj._dStartCell.colIndex - (this._dragAndDropCell.colIndex - cellIdx.colIndex);
                    xlObj._dEndCell.colIndex = isRange ? xlObj._dEndCell.colIndex - (this._dragAndDropCell.colIndex - cellIdx.colIndex) : xlObj._dStartCell.colIndex;
                }
                else if (cellIdx.colIndex > this._dragAndDropCell.colIndex) {
                    xlObj._dStartCell.colIndex = xlObj._dStartCell.colIndex + (cellIdx.colIndex - this._dragAndDropCell.colIndex);
                    xlObj._dEndCell.colIndex = isRange ? xlObj._dEndCell.colIndex + (cellIdx.colIndex - this._dragAndDropCell.colIndex) : xlObj._dStartCell.colIndex;
                }
            }
            this._dragAndDropCell = cellIdx;
            this._isDragAndDropped = true;
        }
    };
})(jQuery, Syncfusion);