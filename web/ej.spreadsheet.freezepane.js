(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.freezepane = function (obj) {
        this.XLObj = obj;
        this._hfreeze = null;
        this._vfreeze = null;
    };

    ej.spreadsheetFeatures.freezepane.prototype = {
        _setHFreeze: function(elem) {
            this._hfreeze = elem;
         },

         _getHFreeze: function() {
            return this._hfreeze;
         },

         _setVFreeze: function(elem) {
            this._vfreeze = elem;
         },

         _getVFreeze: function() {
            return this._vfreeze;
         },

        _initFreeze: function() {
            var hfreeze, vfreeze, px = "px", div = "div", hide = "e-hide", xlObj = this.XLObj,
                sheet = xlObj.getSheet(), sslist = xlObj.getMainPanel().find(".e-spreadsheet-list")[0];
            hfreeze = document.createElement(div);
            hfreeze.id = xlObj._id + "_hfreeze";
            hfreeze.className = "e-frow " + hide;
            sslist.appendChild(hfreeze);
            this._setHFreeze($(hfreeze));
            vfreeze = document.createElement(div);
            vfreeze.id = xlObj._id + "_vfreeze";
            vfreeze.className = "e-fcol " + hide;
            sslist.appendChild(vfreeze);
            this._setVFreeze($(vfreeze));
        },

        _refreshFreeze: function() {
            var px = "px", hide = "e-hide", xlObj = this.XLObj, sheet = xlObj.getSheet(), freeze = this._getHFreeze()[0];
            if (!freeze)
                this._initFreeze();
            if (xlObj._isFrozen(xlObj.getFrozenRows())) {
                xlObj._removeClass(freeze, hide);
                freeze.style.top = sheet._fDivTop;
                if (xlObj.model._isActPanelVisible)
                    freeze.style.width = (xlObj._getJSSheetContent(xlObj.getActiveSheetIndex()).width() - (sheet.showHeadings ? xlObj._rowHeaderWidth : 0) + 10) + px;
                else
                    freeze.style.width = sheet._vPortWth + (sheet.showHeadings ? xlObj._rowHeaderWidth : 0) - 4 + px;
            }
            else
                xlObj.addClass(freeze, hide);
            freeze = this._getVFreeze()[0];
            if (xlObj._isFrozen(xlObj.getFrozenColumns())) {
                xlObj._removeClass(freeze, hide);
                freeze.style.left = sheet._fDivLeft;
                freeze.style.height = (sheet._vPortHgt + (sheet.showHeadings ? xlObj._colHeaderHeight : 0)) - 4  + px;
            }
            else
                xlObj.addClass(freeze, hide);
        },

        freezeTopRow: function() {
            var xlObj = this.XLObj, sheet = xlObj.getSheet();
            if (xlObj._isFrozen(sheet.frozenRows) || xlObj._isFrozen(sheet.frozenColumns)) {
                xlObj._intrnlReq = true;
                this.unfreezePanes();
                xlObj._intrnlReq = false;
            }
            this._freeze(sheet._topRow.idx + 1);
        },

        freezeLeftColumn: function() {
            var xlObj = this.XLObj, sheet = xlObj.getSheet();
            if (xlObj._isFrozen(sheet.frozenColumns)) {
                xlObj._intrnlReq = true;
                this.unfreezePanes();
                xlObj._intrnlReq = false;
            }
            this._freeze(null, sheet._leftCol.idx + 1);
        },

        freezeRows: function(rowIdx) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet();
            if (xlObj._isFrozen(sheet.frozenRows) || xlObj._isFrozen(sheet.frozenColumns)) {
                xlObj._intrnlReq = true;
                this.unfreezePanes();
                xlObj._intrnlReq = false;
            }
            this._freeze(rowIdx);
        },

        freezeColumns: function(colIdx) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet();
            if (xlObj._isFrozen(sheet.frozenColumns)) {
                xlObj._intrnlReq = true;
                this.unfreezePanes();
                xlObj._intrnlReq = false;
            }
            this._freeze(null, colIdx);
        },

        freezePanes: function(rowIdx, colIdx) {
            var range, xlObj = this.XLObj;
            if (!xlObj.isNumber(rowIdx)) {
                range = xlObj._toIntrnlRange(rowIdx);
                rowIdx = range[0], colIdx = range[1];
            }
            this._freeze(rowIdx, colIdx);
        },

        unfreezePanes: function() {
            this._freeze();
            this._refreshSelection();
        },

        _freeze: function(rowIdx, colIdx) {
            var px, idx, hide, sheet, offset, freeze, rrefresh, crefresh, xlObj = this.XLObj, ftopRowIdx, fleftColIdx,
                args = { sheetIndex: xlObj.getActiveSheetIndex() }, hasRow = ej.isNullOrUndefined(rowIdx), hasCol = ej.isNullOrUndefined(colIdx);
            if (hasRow && hasCol)
                args["reqType"] = "unfreezePanes";
            else if (hasCol)
                args["reqType"] = "freezeRow";
            else if (hasRow)
                args["reqType"] = "freezeColumn";
            else
                args["reqType"] = "freezePanes";
            rrefresh = crefresh = true;
            if (!xlObj.model.allowFreezing)
                 return;
            px = "px", hide = "e-hide", sheet = xlObj.getSheet(), freeze = this._getHFreeze()[0];
            if (!ej.isNullOrUndefined(rowIdx)) {
                if (rowIdx === 0 || rowIdx < sheet._topRow.idx || rowIdx > sheet._bottomRow.idx)
                    rowIdx = xlObj._getMidCell().rowIdx;
                offset = xlObj._getIdxWithOffset(rowIdx).yOffset;
                if (sheet._topRow.idx === rowIdx && sheet._scrollTop !== offset)
                    xlObj.XLScroll._vScroller().scroll(offset);
                xlObj._removeClass(freeze, hide);
                sheet._isFreezed = true;
                freeze.style.top = sheet._fDivTop = (offset - sheet._scrollTop + (sheet.showHeadings ? (xlObj._colHeaderHeight - 2) : 0)) + px;
                freeze.style.width = sheet._vPortWth + (sheet.showHeadings ? xlObj._rowHeaderWidth : 0) - 4 + px;
                sheet._contScrollTop = sheet._scrollTop;
             }
             else {
                 idx = xlObj.getFrozenRows();
                 if (xlObj._isFrozen(idx)) {
                     rowIdx = 0;
                     ftopRowIdx = sheet._ftopRowIdx - 1;
                     this._showFreezeRow(idx, ftopRowIdx);
                    if (xlObj.model.scrollSettings.allowVirtualScrolling)
                        xlObj.refreshContent();  
                    while (ftopRowIdx >= idx) {
                        if (sheet._fHMergeRows.indexOf(idx) > -1) {
                            sheet._fHMergeRows.splice(sheet._fHMergeRows.indexOf(idx), 1);
                            xlObj._refreshSHMergeCells(null, [idx], 1, "row", "show");
                        }
                        idx++;
                    }
                    xlObj.addClass(freeze, hide);
                    sheet._isFreezed = false;
                 }
                else
                    rrefresh = false;
             }
             if (rrefresh) {
                 sheet._ftopRowIdx = rowIdx;
                 sheet._frozenHeight = xlObj._getRowOffsetTop(sheet, rowIdx);
                 sheet.paneTopLeftCell = xlObj.getAlphaRange(rowIdx, sheet._fleftColIdx);
                 xlObj.setFrozenRows(rowIdx);
                 sheet._frozenRows = rowIdx + 1;
             }
             freeze = this._getVFreeze()[0];
             if (!ej.isNullOrUndefined(colIdx)) {
                 if (colIdx === 0 || colIdx < sheet._leftCol.idx || colIdx > sheet._rightCol.idx)
                     colIdx = xlObj._getMidCell().colIdx;
                 offset = xlObj._getIdxWithOffset(null, colIdx).xOffset;
                 if (sheet._leftCol.idx === colIdx && sheet._scrollLeft !== offset)
                     xlObj.XLScroll._hScroller().scroll(offset);
                 offset = (offset + (sheet.showHeadings ? xlObj._rowHeaderWidth : 0)) - 1;
                 xlObj._removeClass(freeze, hide);
                 sheet._isFreezed = true;
                 freeze.style.left = sheet._fDivLeft = (offset - sheet._scrollLeft) + px;
                 freeze.style.height = (sheet._vPortHgt + (sheet.showHeadings ? xlObj._colHeaderHeight : 0)) - 4 + px;
                 sheet._contScrollLeft = sheet._scrollLeft;
             }
             else {
                 idx = xlObj.getFrozenColumns();
                 if (xlObj._isFrozen(idx)) {
                     colIdx = 0;
                     fleftColIdx = sheet._fleftColIdx - 1;
                     this._showFreezeCol(idx, fleftColIdx);
                     while (fleftColIdx >= idx) {
                         if (sheet._fHMergeCols.indexOf(idx.toString()) > -1) {
                             sheet._fHMergeCols.splice(sheet._fHMergeCols.indexOf(idx.toString()), 1);
                             xlObj._refreshSHMergeCells(null, [idx], 1, "column", "show");
                         }
                         idx++;
                     }
                     xlObj.addClass(freeze, hide);
                     sheet._isFreezed = false;
                 }
                 else
                     crefresh = false;
             }
             if (crefresh) {
                 sheet._fleftColIdx = colIdx;
                 sheet._frozenWidth = xlObj._getColOffsetLeft(sheet, colIdx);
                 sheet.paneTopLeftCell = xlObj.getAlphaRange(sheet._ftopRowIdx, colIdx);
                 xlObj.setFrozenColumns(colIdx);
                 sheet._frozenColumns = colIdx + 1;
             }
             if (rrefresh || crefresh) {
                xlObj.XLScroll._refreshScroller(null, null, rrefresh && crefresh ? "all" : (rrefresh ? "vertical" : "horizontal"));
                if (rrefresh)
                   xlObj.model.scrollSettings.allowScrolling && xlObj.XLScroll._vScroller().scroll(xlObj._isFrozen(xlObj.getFrozenRows()) ? 0 : sheet._contScrollTop);
                if (crefresh)
                    xlObj.model.scrollSettings.allowScrolling && xlObj.XLScroll._hScroller().scroll(xlObj._isFrozen(xlObj.getFrozenColumns()) ? 0 : sheet._contScrollLeft);
            }
            if (rrefresh)
                args["rowIndex"] = rowIdx;
            if (crefresh)
                args["colIndex"] = colIdx;
            if (!xlObj._intrnlReq)
                xlObj._trigActionComplete(args);
        },

        _frozenScrollHandler: function(args) {
            var count, retVal, i = 0, xlObj = this.XLObj, xlScroll = xlObj.XLScroll, sheet = xlObj.getSheet(),
                sheetIdx = xlObj.getActiveSheetIndex(), vScroll = xlScroll._vScroller(sheetIdx), hScroll = xlScroll._hScroller(sheetIdx);
            if (args.model.orientation === ej.ScrollBar.Orientation.Vertical) {
                args["reachedEnd"] = Math.ceil(parseFloat(vScroll.element.find(".e-vhandle").css('top'))) + Math.ceil(parseFloat(vScroll.element.find(".e-vhandle").height())) >= vScroll.element.find(".e-vhandlespace").height() - 2;
                if (args.scrollData.up || args.reachedEnd && xlObj.model.scrollSettings.scrollMode === ej.Spreadsheet.scrollMode.Infinite) {
                    count = ((args.scrollTop - sheet._scrollTop) / sheet.rowHeight);
                    if (sheet._bottomRow.idx + count >= sheet.rowCount - 1) {
                        if (!xlObj.model.scrollSettings.allowVirtualScrolling)
                            xlObj.XLScroll._scrollBottom(sheetIdx);
                        else {
							while(count >= sheet.rowCount){
								i=0;
                            sheet._virtualBlockCnt++;
                            sheet.rowCount += sheet._virtualBlockRowCnt;
                            while (i < sheet._virtualBlockRowCnt) {
                                sheet.rowsHeightCollection.push(sheet.rowHeight);
                                i++;
                            }
						    }
                        }
                    }
                    xlObj.XLScroll._refreshScroller(sheetIdx, "refresh", "vertical");
                }
                if (xlScroll._isIntrnlScroll) {
                    this._scrollFreeze(xlScroll._scrollIdx);
                    xlScroll._scrollIdx = 0;
                    sheet._scrollTop = args.scrollTop;
                }
                else {
                    if (args.scrollTop != sheet._scrollTop && (!args.reachedEnd || xlObj.model.scrollSettings.scrollMode === ej.Spreadsheet.scrollMode.Infinite)) {
                        retVal = this._ensureFreezeScrollPos(args);
                        if (!xlObj.isUndefined(retVal.resetTo)) {
                            xlScroll._isIntrnlScroll = true;
                            xlScroll._scrollIdx = retVal.rowIdx;
                            xlScroll._vScroller().scroll(retVal.resetTo);
                            xlScroll._isIntrnlScroll = false;
                        }
                        else {
                            this._scrollFreeze(retVal.rowIdx);
                            sheet._scrollTop = args.scrollTop;
                        }
                    }
                }
            }
            else {
                args["reachedEnd"] = Math.ceil(parseFloat(hScroll.element.find(".e-hhandle").css('left'))) + Math.ceil(parseFloat(hScroll.element.find(".e-hhandle").width())) >= xlObj.element.find(".e-hhandlespace").width() - 2;
                count = ((args.scrollLeft - sheet._scrollLeft) / sheet.columnWidth);
                if (args.reachedEnd || (xlObj.model.scrollSettings.scrollMode === ej.Spreadsheet.scrollMode.Infinite && sheet._rightCol.idx + count >= sheet.colCount - 1)) {
                    xlObj.XLScroll._scrollRight(sheetIdx);
                    xlObj.XLScroll._refreshScroller(sheetIdx, "refresh", "horizontal");
                }
                if (xlScroll._isIntrnlScroll) {
                    this._scrollFreeze(null, xlScroll._scrollIdx);
                    xlScroll._scrollIdx = 0;
                    sheet._scrollLeft = args.scrollLeft;
                }
                else {
                    if (args.scrollLeft != sheet._scrollLeft && (!args.reachedEnd || xlObj.model.scrollSettings.scrollMode === ej.Spreadsheet.scrollMode.Infinite)) {
                        retVal = this._ensureFreezeScrollPos(args);
                        if (!xlObj.isUndefined(retVal.resetTo)) {
                            xlScroll._isIntrnlScroll = true;
                            xlScroll._scrollIdx = retVal.colIdx;
                            xlScroll._hScroller().scroll(retVal.resetTo);
                            xlScroll._isIntrnlScroll = false;
                        }
                        else {
                            this._scrollFreeze(null, retVal.colIdx);
                            sheet._scrollLeft = args.scrollLeft;
                        }
                    }
                }
            }
			 if(xlObj.model.allowComments) 
				 xlObj.XLComment._updateCmntArrowPos();
        },

         _ensureFreezeScrollPos: function(args) {
             var pos, retVal, obj = {}, hideTypes = [ej.Spreadsheet.HideTypes.Freeze], xlObj = this.XLObj, sheet = xlObj.getSheet();
            if (args.model.orientation === ej.ScrollBar.Orientation.Vertical) {
                pos = args.scrollTop + sheet._frozenHeight;
                retVal = xlObj._getIdxWithOffset(pos, null, true, hideTypes);
                obj.rowIdx = retVal.rowIdx;
                if (pos !== retVal.yOffset)
                    obj.resetTo = retVal.yOffset - sheet._frozenHeight;
            }
            else {
                pos = args.scrollLeft + sheet._frozenWidth;
                retVal = xlObj._getIdxWithOffset(null, pos, true, hideTypes);
                obj.colIdx = retVal.colIdx;
                if (pos !== retVal.xOffset)
                    obj.resetTo = retVal.xOffset - sheet._frozenWidth;
            }
            return obj;
         },
         
         _scrollFreeze: function (rowIdx, colIdx) {
            var idx, xlObj = this.XLObj, sheet = xlObj.getSheet(), sheetIdx = xlObj.getActiveSheetIndex();
            if (rowIdx && sheet._ftopRowIdx !== rowIdx) {
                if (sheet._ftopRowIdx < rowIdx) {
                    idx = rowIdx - sheet._ftopRowIdx === 1 ? sheet._ftopRowIdx : rowIdx - 1;
                    this._hideFreezeRow(sheet._ftopRowIdx, idx);
                    this._refreshShape(sheet._ftopRowIdx, idx, true);
                 }
                else {
                    idx = sheet._ftopRowIdx - rowIdx === 1 ? rowIdx : sheet._ftopRowIdx - 1;
                    this._showFreezeRow(rowIdx, idx);
                    this._refreshShape(rowIdx, idx, true);
                }
                if (xlObj.model.scrollSettings.allowVirtualScrolling)
                    xlObj.refreshContent();
                while (idx >= rowIdx) {
                    if(sheet._fHMergeRows.indexOf(idx) > -1){
                        sheet._fHMergeRows.splice(sheet._fHMergeRows.length - 1, 1);
                        xlObj._refreshSHMergeCells(null, [idx], 1, "row", "show")
                    }
                    idx--;
                }
                sheet._ftopRowIdx = rowIdx;
                sheet.paneTopLeftCell = xlObj.getAlphaRange(rowIdx, sheet._fleftColIdx);
             }
             else if (colIdx && sheet._fleftColIdx !== colIdx) {
                 if (sheet._fleftColIdx < colIdx) {
                     idx = colIdx - sheet._fleftColIdx === 1 ? sheet._fleftColIdx : colIdx - 1;
                     this._hideFreezeCol(sheet._fleftColIdx, idx);
                     this._refreshShape(sheet._fleftColIdx, idx);
                 }
                 else {
                     idx = sheet._fleftColIdx - colIdx === 1 ? colIdx : sheet._fleftColIdx - 1;
                     this._showFreezeCol(colIdx, idx);
                     this._refreshShape(colIdx, idx);
                 }
                 while (idx >= colIdx) {
                     if (sheet._fHMergeCols.indexOf(idx.toString()) > -1) {
                         sheet._fHMergeCols.splice(sheet._fHMergeCols.length - 1, 1);
                         xlObj._refreshSHMergeCells(null, [idx], 1, "column", "show");
                     }
                     idx--;
                 }
                 sheet._fleftColIdx = colIdx;
                 sheet.paneTopLeftCell = xlObj.getAlphaRange(sheet._ftopRowIdx, colIdx);
             }
            if (xlObj.model.scrollSettings.allowScrolling) {
                xlObj.XLScroll._getRowHeights(sheetIdx, 1);
                xlObj.XLScroll._refreshScroller(sheetIdx, "refresh", "vertical");
                xlObj.XLScroll._getFirstRow(sheetIdx);
            }
            this._refreshSelection();
         },

         _refreshShape: function (sIdx, eIdx, isRow) {
             var i, cellIdx, shapeData, chartId, shapeId, picId, pivotId, range, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), shape = sheet.shapeMngr, pvtMngr = sheet.pivotMngr;
             range = isRow ? [sIdx, 0, eIdx, sheet.colCount] : [0, sIdx, sheet.rowCount, eIdx];
             shapeData = xlObj.getRangeData({ range: range, property: ["picture", "chart"] });
             for (i = 0; i < shapeData.length; i++) {
                 if (shapeData[i].picture) {
                     picId = shapeData[i].picture[xlObj.getObjectLength(shapeData[i].picture)];
                     shapeId = isRow ? shape.picture[picId].rowIndex : shape.picture[picId].colIndex;
                     this._freezeShape($("#" + picId)[0], isRow ? sheet._hiddenFreezeRows.indexOf(shapeId) > -1 : sheet._hiddenFreezeCols.indexOf(shapeId) > -1);
                 }
                 if (shapeData[i].chart) {
                     chartId = shapeData[i].chart[xlObj.getObjectLength(shapeData[i].chart)];
                     shapeId = isRow ? shape.chart[chartId].rowIndex : shape.chart[chartId].colIndex;
                     this._freezeShape($("#" + chartId)[0], isRow ? sheet._hiddenFreezeRows.indexOf(shapeId) > -1 : sheet._hiddenFreezeCols.indexOf(shapeId) > -1);
                 }
                 if (shapeData[i].pivot) {
                     pivotId = shapeData[i].pivot[xlObj.getObjectLength(shapeData[i].pivot)];
                     shapeId = isRow ? pvtMngr.pivot[pivotId].rowIndex : pvtMngr.pivot[pivotId].colIndex;
                     this._freezeShape($("#" + pivotId)[0], isRow ? sheet._hiddenFreezeRows.indexOf(shapeId) > -1 : sheet._hiddenFreezeCols.indexOf(shapeId) > -1);
                 }
             }
             this._updateShapePos(isRow);
         },

         _updateShapePos: function (isRow) {
             var topVal, leftVal, lastRow, lastCol, totRowDiff = 0, totColDiff = 0, key, elemId, prop, shapeColl, mngrKey, xlObj = this.XLObj, sheet = xlObj.getSheet(),
             shapeMngr = sheet.shapeMngr, fRHiddenColls = sheet._hiddenFreezeRows, fCHiddenColls = sheet._hiddenFreezeCols;

             if (isRow)
                 totRowDiff = this._getFreezeHidenDim(true);
             else
                 totColDiff = this._getFreezeHidenDim();

             for (mngrKey in shapeMngr) {
                 if (["chart", "picture"].indexOf(mngrKey) > -1) {
                     shapeColl = shapeMngr[mngrKey];
                     for (key in shapeColl) {
                         prop = shapeColl[key], elemId = prop.id, topVal = prop.top, leftVal = prop.left, lastRow = fRHiddenColls[fRHiddenColls.length - 1] || 0, lastCol = fCHiddenColls[fCHiddenColls.length - 1] || 0;
                         if (isRow) {
                             if (lastRow <= prop.rowIndex) {
                                 topVal -= totRowDiff;
                                 xlObj.getSheetElement().find("#" + elemId).css({ top: topVal });
                             }
                         }
                         else {
                             if (lastCol <= prop.colIndex) {
                                 leftVal -= totColDiff;
                                 xlObj.getSheetElement().find("#" + elemId).css({ left: leftVal });
                             }
                         }
                     }
                 }
             }
         },

         _getFreezeHidenDim: function (isHeight) {
             var xlObj = this.XLObj, sheet = xlObj.getSheet(), hiddenColls, dimenColls, totalVal = 0, i = 0;

             if (isHeight) {
                 hiddenColls = sheet._hiddenFreezeRows;
                 dimenColls = sheet.rowsHeightCollection;
             }
             else {
                 hiddenColls = sheet._hiddenFreezeCols;
                 dimenColls = sheet.columnsWidthCollection;
             }

             for (i = 0; i < hiddenColls.length; i++) {
                 totalVal += dimenColls[hiddenColls[i]];
             }

             return totalVal;
         },
         
         _freezeShape: function (shapeElem, isHidden) {
             var xlObj = this.XLObj;
             if (isHidden)
                 xlObj.addClass(shapeElem, "e-hide");
             else
                 xlObj._removeClass(shapeElem, "e-hide");
         },

         _hideFreezeRow: function(srowIdx, eRowIdx) {
             var i, xlObj = this.XLObj, scrollSettings = xlObj.model.scrollSettings, isVirtualScroll = scrollSettings.allowScrolling && scrollSettings.allowVirtualScrolling, 
                sheetIdx = xlObj.getActiveSheetIndex(), rowColl = xlObj.getRows(sheetIdx), hdrRows = rowColl[0], rows = rowColl[1], sheet = xlObj.getSheet(sheetIdx), usedRange = sheet.usedRange;
             while (srowIdx <= eRowIdx) {
                 i = 0;
                if (sheet._hiddenFreezeRows.indexOf(srowIdx) === -1)
                    sheet._hiddenFreezeRows.push(srowIdx);
                if (!isVirtualScroll && xlObj._isRowViewable(sheetIdx, srowIdx)) {
                    xlObj.addClass(rows[srowIdx], "e-r-hide");
                    xlObj.addClass(hdrRows[srowIdx], "e-r-hide");
                }
                while (i < usedRange.colIndex) {
                    if(xlObj.XLCellNav._isMergedCell({ rowIndex: srowIdx, colIndex: i }))
                    {   
                        sheet._fHMergeRows.push(srowIdx);
                        xlObj._refreshSHMergeCells(sheetIdx, [srowIdx], 1, "row", "hide");
                        break;
                    }
                    i++;
                }
                srowIdx++;
             }
         },

         _showFreezeRow: function(srowIdx, eRowIdx) {
             var idx, isFHide, xlObj = this.XLObj, scrollSettings = xlObj.model.scrollSettings, isVirtualScroll = scrollSettings.allowScrolling && scrollSettings.allowVirtualScrolling,
                sheetIdx = xlObj.getActiveSheetIndex(), rowColl = xlObj.getRows(sheetIdx), hdrRows = rowColl[0], rows = rowColl[1], sheet = xlObj.getSheet();
             while (srowIdx <= eRowIdx) {
                idx = sheet._hiddenFreezeRows.indexOf(srowIdx);
                if (xlObj.model.allowFiltering)
                     isFHide = this._refreshFiltering(srowIdx);
                if (idx > -1) {
                    sheet._hiddenFreezeRows.splice(idx, 1);
                    if (!isVirtualScroll && xlObj._isRowViewable(sheetIdx, srowIdx) && !isFHide) {
                        xlObj._removeClass(rows[srowIdx], "e-r-hide");
                        xlObj._removeClass(hdrRows[srowIdx], "e-r-hide");
                    }
                }
                srowIdx++;
            }
        },
         _refreshFiltering: function (rowIdx) {
             var isFHide = false, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet();
             if (!ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(rowIdx, 0, "isFilterHide", sheetIdx))) {
                 if (sheet._filterHRowsColl.indexOf(rowIdx) === -1)
                     sheet._filterHRowsColl.push(rowIdx);
                 isFHide = true;
                 return isFHide;
             }
             return isFHide;
         },
        _hideFreezeCol: function(scolIdx, ecolIdx) {
            var diff, cells, j, hide = "e-fcol-hide", i = scolIdx, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(),
                usedRange = sheet.usedRange, idxColl = xlObj.model.scrollSettings.allowVirtualScrolling ? sheet._virtualRowIdx : sheet._rowIdxColl,
                hdr = xlObj._getJSSheetHeader(sheetIdx), cont = xlObj._getContent(sheetIdx), th = hdr.find("th"),
                hdrColGrp = hdr.find("col"), contColGrp = cont.find("col"), hdrTable = hdr.find("table");
            diff = xlObj._getWidth(scolIdx, ecolIdx);
            while (i <= ecolIdx) {
                j = 0;
                if (sheet._hiddenFreezeCols.indexOf(i) === -1)
                    sheet._hiddenFreezeCols.push(i);
                xlObj.addClass(th[i], hide);
                xlObj.addClass(hdrColGrp[i], hide);
                xlObj.addClass(contColGrp[i], hide);
                while (j < usedRange.rowIndex) {
                    if (xlObj.XLCellNav._isMergedCell({ rowIndex: j, colIndex: i })) {
                        sheet._fHMergeCols.push(i.toString());
                        xlObj._refreshSHMergeCells(sheetIdx, [i], 1, "column", "hide");
                        break;
                    }
                    j++;
                }
                i++; 
            }
            cells = xlObj.getRange([idxColl[0], scolIdx, idxColl[idxColl.length - 1], ecolIdx]);
            i = cells.length;
            if (i) {
                while (i--)
                    xlObj.addClass(cells[i], hide);
            }
            diff = hdrTable.width() - diff;
            hdrTable.width(diff);
            cont.find(".e-table").width(diff);
        },

        _getWidth: function(scolIdx, ecolIdx) {
            var wth = 0, sheet = this.XLObj.getSheet();
            for (; scolIdx <= ecolIdx; scolIdx++)
                wth += sheet.columnsWidthCollection[scolIdx];
            return wth;
        },

        _showFreezeCol: function(scolIdx, ecolIdx) {
            var idx, diff, cells, hide = "e-fcol-hide", i = scolIdx, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(), hdr = xlObj._getJSSheetHeader(sheetIdx), cont = xlObj._getContent(sheetIdx), th = hdr.find("th"),
                idxColl = xlObj.model.scrollSettings.allowVirtualScrolling ? sheet._virtualRowIdx : sheet._rowIdxColl,
                hdrColGrp = hdr.find("col"), contColGrp = cont.find("col"), hdrTable = hdr.find("table");
            diff = xlObj._getWidth(0, sheet.colCount - 1) - (sheet._frozenColumns - 1 < scolIdx ? xlObj._getWidth(sheet._frozenColumns - 1, scolIdx) : 0);
            while (i <= ecolIdx) {
                idx = sheet._hiddenFreezeCols.indexOf(i);
                if (idx > -1) {
                    sheet._hiddenFreezeCols.splice(idx, 1);
                    xlObj._removeClass(th[i], hide);
                    xlObj._removeClass(hdrColGrp[i], hide);
                    xlObj._removeClass(contColGrp[i], hide);
                }
                i++; 
            }
            cells = xlObj.getRange([idxColl[0], scolIdx, idxColl[idxColl.length - 1], ecolIdx]);
            i = cells.length;
            if (i) {
                while (i--)
                    xlObj._removeClass(cells[i], hide);
            }
            hdrTable.width(diff);
            cont.find(".e-table").width(diff);
        },

        _refreshSelection: function () {
            var sRIdx, eRIdx, sCIdx, eCIdx, isTrue = false, xlObj = this.XLObj, sheet = xlObj.getSheet(),
                sRange = sheet.selectedRange, rIdx = sRange[2], cIdx = sRange[3], startRow = sRange[0], startCol = sRange[1];
            if (sheet._endCell.rowIndex + 1 >= sheet._frozenRows && sheet._endCell.rowIndex < sheet._ftopRowIdx && sheet._startCell.rowIndex < sheet._frozenRows - 1) {
                rIdx = sheet._frozenRows - 2;
                isTrue = true;
            }
            else {
                sRIdx = sRange[0], eRIdx = sRange[2];
                if (sheet._frozenRows - 1 <= sRIdx)
                    while (sRIdx <= eRIdx) {
                        if (sRIdx < sheet._ftopRowIdx)
                            sRIdx++;
                        else {
                            startRow = sRIdx;
                            break;
                        }
                    }
            }
            if (sRange[3] + 1 >= sheet._frozenColumns && sRange[3] < sheet._fleftColIdx && sRange[1] < sheet._frozenColumns - 1) {
                cIdx = sheet._frozenColumns - 2;
                isTrue = true;
            }
            else {
                sCIdx = sRange[1], eCIdx = sRange[3];
                if (sheet._frozenColumns - 1 <= sCIdx)
                    while (sCIdx <= eCIdx) {
                        if (sCIdx < sheet._fleftColIdx)
                            sCIdx++;
                        else {
                            startCol = sCIdx;
                            break;
                        }
                    }
            }
            if (sRIdx == eRIdx + 1 || sCIdx == eCIdx + 1)
                xlObj.XLSelection._hideShowSelElem("hide");
            else {
                xlObj.model.allowSelection && xlObj.XLSelection._refreshBorder([startRow, startCol, rIdx, cIdx]);
                if (isTrue)
					xlObj.addClass(xlObj.getAutoFillElem()[0], "e-hide")
				else
					xlObj.model.allowAutoFill && xlObj.XLDragFill.positionAutoFillElement();
            }
        },
        
        _selectionScroll: function (isShiftKey) {
            var i, diff, trgt, hiddenWth, hiddenHgt = hiddenWth = 0, xlObj = this.XLObj, sheet = xlObj.getSheet(), sheetIdx = xlObj.getActiveSheetIndex();
            if (xlObj._isFrozen(sheet.frozenRows)) {
                // To Scroll vertically from top to bottom
                if (sheet._startCell.rowIndex + 1 < sheet._frozenRows && sheet._endCell.rowIndex + 1 > sheet._frozenRows && sheet.selectedRange[2] < sheet._ftopRowIdx) {
                    if (sheet._ftopRowIdx + 1 - sheet._frozenRows > 0) {
                        diff = sheet._endCell.rowIndex - sheet._ftopRowIdx;
                        sheet._endCell.rowIndex = sheet._frozenRows - 1 + diff;
                        for (i = sheet._frozenRows - 1; i < sheet._ftopRowIdx; i++)
                            hiddenHgt += sheet.rowsHeightCollection[i];
                        xlObj._scrollContent({ y: -hiddenHgt });
                    }
                }
                // To Scroll vertically from bottom to top
                else if (sheet.selectedRange[2] - sheet._endCell.rowIndex > 0 && sheet._ftopRowIdx > sheet._frozenRows - 1 && !sheet._isColSelected
                    && sheet._endCell.rowIndex < sheet._frozenRows - 1 && sheet.selectedRange[2] - sheet.selectedRange[0] > 0 && sheet.selectedRange[2] >= sheet._ftopRowIdx - 1) {
                    sheet._endCell.rowIndex = sheet._ftopRowIdx - 1;
                    trgt = xlObj.getCell(sheet._frozenRows - 2, sheet._endCell.colIndex)[0];
                    xlObj.XLSelection._scrollCalculation(sheetIdx, trgt, { position: "vertical", action: "Decrement" });
                }
            }
            if (xlObj._isFrozen(sheet.frozenColumns)) {
                // To Scroll Horizontally from left to right
                if (sheet._startCell.colIndex + 1 < sheet._frozenColumns && sheet._endCell.colIndex + 1 > sheet._frozenColumns && sheet.selectedRange[3] < sheet._fleftColIdx) {
                    if (sheet._fleftColIdx + 1 - sheet._frozenColumns > 0) {
                        diff = sheet._endCell.colIndex - sheet._fleftColIdx;
                        sheet._endCell.colIndex = sheet._frozenColumns - 1 + diff;
                        for (i = sheet._frozenColumns - 1; i < sheet._fleftColIdx; i++)
                            hiddenWth += sheet.columnsWidthCollection[i];
                        xlObj._scrollContent({ x: -hiddenWth });
                    }
                }
                // To Scroll Horizontally from right to left
                else if (sheet.selectedRange[3] - sheet._endCell.colIndex > 0 && sheet._fleftColIdx > sheet._frozenColumns - 1 && !sheet._isRowSelected
                    && sheet._endCell.colIndex < sheet._frozenColumns - 1 && sheet.selectedRange[3] - sheet.selectedRange[1] > 0 && sheet.selectedRange[3] >= sheet._fleftColIdx - 1) {
                    sheet._endCell.colIndex = sheet._fleftColIdx - 1;
                    trgt = xlObj.getCell(sheet._frozenColumns - 2, sheet._endCell.colIndex)[0];
                    xlObj.XLSelection._scrollCalculation(sheetIdx, trgt, { position: "horizontal", action: "Decrement" });
                }
            }
        },
        _refreshFColResize: function (colIdx) {
            var diff, offset, px = "px", xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(), fCol = xlObj.getFrozenColumns() + 1, vfreeze = this._getVFreeze()[0], width = sheet._frozenWidth, left = parseInt(this._getVFreeze()[0].style.left);
            xlObj.XLScroll._getColWidths(sheetIdx, colIdx);
            sheet._frozenWidth = xlObj._getColOffsetLeft(sheet, fCol - 1);
            diff = (width > sheet._frozenWidth) ? width - sheet._frozenWidth : sheet._frozenWidth - width;
            if (colIdx < fCol - 1)
                vfreeze.style.left = sheet._fDivLeft = (width >= sheet._frozenWidth) ? (left - diff) + px : (left + diff) + px;
        },
        _refreshFRowResize: function (rowIdx) {
            var diff, offset, px = "px", xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(), fRow = xlObj.getFrozenRows() + 1, hfreeze = this._getHFreeze()[0], height = sheet._frozenHeight, top = parseInt(this._getHFreeze()[0].style.top);
            xlObj.XLScroll._getRowHeights(sheetIdx, rowIdx);
            sheet._frozenHeight = xlObj._getRowOffsetTop(sheet, fRow - 1);
            diff = (height > sheet._frozenHeight) ? height - sheet._frozenHeight : sheet._frozenHeight - height;
            if (rowIdx < fRow - 1)
                hfreeze.style.top = sheet._fDivTop = (height >= sheet._frozenHeight) ? (top - diff) + px : (top + diff) + px;
        },

        _refreshFreezeRowDiv: function () {
            var xlObj = this.XLObj, sheet = xlObj.getSheet();
            sheet._fDivTop = xlObj._getIdxWithOffset(sheet._frozenRows - 1).yOffset - sheet._contScrollTop + (sheet.showHeadings ? (xlObj._colHeaderHeight - 2) : 0) + "px";
            sheet._frozenHeight = xlObj._getRowOffsetTop(sheet, sheet._frozenRows - 1);
            this._refreshFreeze();
        },

        _refreshFreezeColDiv: function () {
            var xlObj = this.XLObj, sheet = xlObj.getSheet();
            sheet._fDivLeft = xlObj._getColOffsetLeft(sheet, sheet._frozenColumns - 1) - sheet._contScrollLeft + (sheet.showHeadings ? xlObj._rowHeaderWidth : 0) - 1 + "px";
            sheet._frozenWidth = xlObj._getColOffsetLeft(sheet, sheet._frozenColumns - 1);
            this._refreshFreeze();
        }
    };
})(jQuery, Syncfusion);
