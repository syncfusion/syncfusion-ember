(function ($, ej, undefined) {

    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.resizing = function (obj) {
        this.XLObj = obj;
        this._$visualElem = $();
        this._currentHCell = -1;
        this._colMinWidth = 15;
        this._rowMinHeight = 20;
        this._allowStart = false;
        this._resizeStart = false;
        this._resizeType = "";
        this._tableY = null;
        this._oldWidth = null;
        this._orgX = null;
        this._orgY = null;
        this._extra = null;
        this._initialTableWidth = null;
        this._resizeElt = null;
        this._tableX = null;
        this._oldHeight = null;
        this._initialTableHeight = null;
        this._resizerowId = 0;
        this._sparklineResize = false;
    };

    ej.spreadsheetFeatures.resizing.prototype = {
        //Resizing

        getColWidth: function (colIdx) {
            return this.XLObj.getSheet(this.XLObj.getActiveSheetIndex()).columnsWidthCollection[colIdx];
        },

        getRowHeight: function (rowIdx) {
            return this.XLObj.getSheet(this.XLObj.getActiveSheetIndex()).rowsHeightCollection[rowIdx];
        },

        setColWidth: function (colIdx, size) {
            if (!this.XLObj.model.allowResizing)
                return;
            var sheetIdx = this.XLObj.getActiveSheetIndex();
            this._currentHCell = colIdx;
            this._resizeColumnUsingDiff(size, this.XLObj.getSheet(sheetIdx).columnsWidthCollection[colIdx], [colIdx]);
            this.XLObj.XLScroll._getColWidths(sheetIdx, colIdx);
            this.XLObj.XLSelection.refreshSelection();
        },

        setRowHeight: function (rowIdx, size) {
            var xlObj = this.XLObj;
            if (!this.XLObj.model.allowResizing)
                return;
            var sheetIdx = this.XLObj.getActiveSheetIndex()
            this._currentHCell = rowIdx;
            this._resizeRowUsingDiff(size, this.XLObj.getSheet(sheetIdx).rowsHeightCollection[rowIdx], [rowIdx]);
        },

        _headerMouseDown: function (e) {
            e.preventDefault();
            this._colMouseDown(e);
        },

        _colMouseDown: function (e) {
            var xy, xlObj = this.XLObj, args = {};
            xy = xlObj._setXY(e, navigator.userAgent.indexOf("WebKit") > -1);
            this._orgX = xy[0] + document.documentElement.scrollLeft;
            this._orgY = xy[1];
            if (xlObj._isTouchEvt)
                this._mouseHover(e);
            if (this._allowStart && (($(e.target).css("cursor") === "col-resize") || xlObj._isTouchEvt)) {
                args.event = e;
                args.target = e.target;
                args.colIndex = this._currentHCell;
                args.oldWidth = e.target.getBoundingClientRect().width;
                args.reqType = "column-resize";
                if (xlObj._trigger("resizeStart", args)) {
                    return;
                }
                if (e.button !== 2)
                    this._start(this._orgX, this._orgY);
                this._resizeType = "Col";
                e.preventDefault();
            }
        },

        _mouseHover: function (e) {
            var nlx, xlObj = this.XLObj, trgt = e.target, sheetIdx = xlObj.getActiveSheetIndex(), header = xlObj._getJSSheetHeader(sheetIdx);
            if (this._$visualElem.is(":visible"))
                return;
            if (xlObj._hasClass(trgt, "e-headercelldiv"))
                trgt = trgt.parentNode;
            if (xlObj._hasClass(trgt, "e-headercell")) {
                var resCell = trgt, location = resCell.getBoundingClientRect(), xy = xlObj._setXY(e), x = xy[0], y = xy[1];
                nlx = $(header.find(".e-table")[0]).width() + $(header.find(".e-columnheader")[0]).offset().left;
                if (((x >= (location.left + document.documentElement.scrollLeft + resCell.offsetWidth - (xlObj._isTouchEvt ? 15 : 7))) || ((x < (location.left + (xlObj._isTouchEvt ? 13 : 0))))) && (x < nlx) && (x >= location.left) && (y <= location.top + document.documentElement.scrollTop + trgt.offsetHeight)) {
                    this._currentHCell = header.find(".e-headercell").index(resCell);
                    if (this._currentHCell < 1 && x < (location.left + resCell.offsetWidth - (xlObj._isTouchEvt ? 15 : 5)) || (this._preventColResize(this._currentHCell, false)))
                        return;
                    xlObj.addClass(trgt, "e-ss-colresize");
                    this._allowStart = true;
                }
                else {
                    xlObj._removeClass($(".e-ss-colresize")[0], "e-ss-colresize");
                    this._allowStart = false;
                    this._currentHCell = -1;
                }
            }
        },
        _preventColResize: function (colIdx, isCMenu) {
            this._currentHCell = colIdx;
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), pivotIdCol = [], pvtMngr = xlObj.getSheet(sheetIdx).pivotMngr.pivot,
                pivotIdCol = xlObj.getObjectKeys(pvtMngr), pvtColIdx, colCount, pvtObj, count, i,
                pivotCount = pivotIdCol.length;
            if (pivotIdCol.length) {
                for (i = 0; i < pivotCount; i++) {
                    pvtColIdx = pvtMngr[pivotIdCol[i]].colIndex;
                    pvtObj = xlObj.element.find('#' + pivotIdCol[i]).data("ejPivotGrid");
                    count = (pvtObj.calculateCellWidths().columnWidths).length;
                    if (!count)
                        count = 3;
                    colCount = pvtColIdx + count;
                    if (isCMenu)
                        return this._currentHCell >= pvtColIdx && this._currentHCell < colCount;
                    else
                        return this._currentHCell >= pvtColIdx && this._currentHCell <= colCount;
                }
            }
        },

        _start: function (x, y) {
            var xlObj = this.XLObj, height, sheetIdx = xlObj.getActiveSheetIndex(), header = xlObj._getJSSheetHeader(sheetIdx), row = header.find(".e-columnheader"), cells = row.find(".e-headercell"), cell, rect;
            if (this._currentHCell > -1 && this._currentHCell < cells.length)
                cell = cells[this._currentHCell];
            if (ej.isNullOrUndefined(cell))
                return;
            rect = cell.getBoundingClientRect();
            this._tableY = rect.top + parseInt(navigator.userAgent.indexOf("WebKit") > -1 ? document.body.scrollTop : document.documentElement.scrollTop);
            if (this._allowStart) {
                this._$visualElem = $(document.createElement("div"));
                height = xlObj._getJSSheetContent(sheetIdx).height() + header.height();
                this._$visualElem.addClass("e-reSizeColbg").appendTo(xlObj.element).css({ height: height + "px" }).addClass("e-ss-colresize");
                this._$visualElem.css({ left: x - 1, top: this._tableY });
                this._oldWidth = cell.offsetWidth;
                this._extra = x - this._orgX;
                this._resizeStart = true;
            }
            else {
                this._currentHCell = -1;
            }
        },

        _cMouseMove: function (e) {
            if (this._resizeStart) {
                var x = this.XLObj._setXY(e, navigator.userAgent.indexOf("WebKit") > -1)[0];
                x += document.documentElement.scrollLeft;
                e.preventDefault();
                this._moveVisual(x);
                this.XLObj.addClass(e.target, "e-ss-colresize");
            }
            else
                this._mouseHover(e);
        },

        _reSize: function (x) {
            // Function used for Resizing the column                     
            var oldWidth, xlObj = this.XLObj, groupedColumn, sheetIdx = xlObj.getActiveSheetIndex(), i, header = xlObj._getJSSheetHeader(sheetIdx), colSelected = header.find(".e-colselected"), colLen = colSelected.length, currentCHCellIdx, currentCHCells = [];
            this._initialTableWidth = xlObj._getJSSheetHeader(sheetIdx).find(".e-headercontent").width();
            this._getResizableCell();
            if (this._currentHCell > -1 && this._resizeStart) {
                oldWidth = xlObj.getSheet(sheetIdx).columnsWidthCollection[this._currentHCell];
                (colLen > 0) && (currentCHCellIdx = colSelected[0].cellIndex);
                for (i = 0; i < colLen; i++) {
                    (this._currentHCell === currentCHCellIdx) && (groupedColumn = true);
                    currentCHCells.push(currentCHCellIdx);
                    currentCHCellIdx++;
                }
                (!groupedColumn) && (currentCHCells = [this._currentHCell]);
                this._resizeColumnUsingDiff(x - this._orgX + oldWidth, oldWidth, currentCHCells);
                if (xlObj._isAutoWHMode)
                    xlObj._autoSSWidthHeight();
                if (xlObj.model.allowAutoFill) {
                    xlObj.XLDragFill.positionAutoFillElement();
                    xlObj.XLDragFill.hideAutoFillOptions();
                }
                if ($("#" + xlObj._id + "ddlspan").length)
                    xlObj._ddlPosition();
            }
            xlObj.XLScroll._getRowHeights(sheetIdx, this._currentHCell);
            if (xlObj.model.allowFreezing)
                xlObj.XLFreeze._refreshFColResize(this._currentHCell);
            xlObj.model.allowSelection && xlObj.XLSelection._refreshBorder();
            this._removeVisualElem();
        },

        _resizeColumnUsingDiff: function (newWidth, oldWidth, currentCHCells) {
            var sparkline, span, cellObj, txtVal, txtWidth, columnCells, overflowCells, $headerCol, $ContentCol, xlObj = this.XLObj, details = {}, sheetIdx = xlObj.getActiveSheetIndex(), header = xlObj._getJSSheetHeader(sheetIdx);
            if (newWidth > 0) {
                newWidth = newWidth > this._colMinWidth ? newWidth : this._colMinWidth;
                for (var i = 0, len = currentCHCells.length; i < len; i++) {
                    if (xlObj.XLEdit.getPropertyValue(0, currentCHCells[i], "wrapCol") && xlObj.XLEdit.getPropertyValue(0, currentCHCells[i], "wrapWidth") > newWidth) {
                        xlObj._dupDetails = true;
                        continue;
                    }
                    $headerCol = header.find("col:eq(" + currentCHCells[i] + ")");
				    $ContentCol = xlObj._getJSSheetContent(sheetIdx).find(".e-spreadsheetcontentcontainer").find("col:eq(" + currentCHCells[i] + ")");
				    $headerCol.outerWidth(newWidth);
				    $ContentCol.width(newWidth);
				    xlObj.XLShape && xlObj.XLShape._refreshShapePosOnResize(currentCHCells[i], newWidth, true, sheetIdx);
				    xlObj.getSheet(sheetIdx).columnsWidthCollection[currentCHCells[i]] = newWidth;
				    if (newWidth < oldWidth) {
				        columnCells = xlObj._getContent(sheetIdx).find(".e-rowcell:nth-child(" + (currentCHCells[i] + 1) + ")");
                        for (var j = 0, length = columnCells.length; j < length; j++) {
                            cellObj = xlObj._getCellIdx(columnCells[j]);
                            txtVal = xlObj.XLEdit.getPropertyValue(cellObj.rowIndex, cellObj.colIndex, "value2");
                            sparkline = xlObj.XLEdit.getPropertyValue(cellObj.rowIndex, cellObj.colIndex, "sparkline", sheetIdx);
                            if (sparkline)
                               xlObj.XLSparkline._sparklineResize(sparkline[0], {width: newWidth}, sheetIdx);
                            if (txtVal) {
                                xlObj._refreshGlobalSpan();
                                span = $('#' + xlObj._id + '_emptySpan');
                                xlObj.addClass(span[0], 'e-rowcell');
                                span.text(txtVal);
                                txtWidth = span.outerWidth();
                                xlObj._refreshGlobalSpan();
                                if (newWidth < txtWidth) {
                                    xlObj._textClip(cellObj.rowIndex, cellObj.colIndex, "delete");
                                    xlObj._textClip(cellObj.rowIndex, cellObj.colIndex, "add", txtWidth);
                                }
                            }
                        }
                    }
                    else {
                        overflowCells = xlObj._getContent(sheetIdx).find(".e-rowcell.e-ofbrdr:nth-child(" + (currentCHCells[i] + 1) + ")");
                        rowIndex= xlObj.getSheet(sheetIdx).usedRange.rowIndex;
                        for (var k = 0; k <= rowIndex; k++) {
							sparkline = xlObj.XLEdit.getPropertyValue(k,currentCHCells[i] , "sparkline", sheetIdx);
							if (sparkline) {
								xlObj.XLScroll._getColWidths(sheetIdx, currentCHCells[0]);
								cellInfo = xlObj._getCellInfo({ rowIndex: k, colIndex: currentCHCells[i] }, sheetIdx);
								xlObj._getContent(sheetIdx).find("#" + sparkline[0]).css({top: cellInfo.top, left: cellInfo.left});
								sparklineId = xlObj._dataContainer.sheets[sheetIdx][k][currentCHCells[i]].sparkline[0].split("_")[4];
								if (sparklineId == currentCHCells[i]) 
									xlObj.XLSparkline._sparklineResize(sparkline[0],{width:newWidth}, sheetIdx);
                            }
                        }
                        for (var j = 0, leng = overflowCells.length; j < leng; j++) {
                            cellObj = xlObj._getCellIdx(overflowCells[j]);
                            xlObj._textClip(cellObj.rowIndex, cellObj.colIndex, "delete", "", true);
                            xlObj._textClip(cellObj.rowIndex, cellObj.colIndex, "add", "", true);
                        }
                    }
                }
                header.find(".e-columnheader").css("cursor", "default");
                if (!xlObj._dupDetails) {
                    details = { sheetIndex: sheetIdx, cols: currentCHCells, newWidth: newWidth, oldWidth: oldWidth, reqType: "resize-column" };
                    if (oldWidth !== newWidth) {
                        xlObj._completeAction(details);
                        xlObj._trigActionComplete(details);
                    }
                }
                xlObj._dupDetails && (xlObj._dupDetails = false);
                xlObj.XLScroll._getColWidths(sheetIdx, currentCHCells[0]);
                if (xlObj.model.scrollSettings.allowScrolling) {
                    xlObj.XLScroll._refreshScroller(sheetIdx, "refresh", "all");
                    xlObj.XLScroll._getFirstColumn(sheetIdx);
                }
				if(xlObj.XLSparkline)
					xlObj.XLSparkline._refreshSparklinePos({rowIndex: 0, colIndex: currentCHCells[0]}, sheetIdx);
            }
        },

        _calculateWidth: function () {
            var xlObj = this.XLObj, colgroup = xlObj._getJSSheetHeader(xlObj.getActiveSheetIndex()).find("col"), width = 0;
            for (var i = 0; i < colgroup.length; i++)
                width += colgroup.eq(i).width();
            return width;

        },

        _cMouseUp: function (e) {
            if (this._resizeStart) {
                var x, xlObj = this.XLObj, currentHCell = this._currentHCell, cWidthColl = xlObj.getSheet(xlObj.getActiveSheetIndex()).columnsWidthCollection, args = {};
                x = xlObj._setXY(e, navigator.userAgent.indexOf("WebKit") > -1)[0];
                x += document.documentElement.scrollLeft;
                args.event = e;
                args.target = e.target;
                args.oldWidth = cWidthColl[currentHCell];
                args.colIndex = this._currentHCell;
                this._reSize(x);
                args.newWidth = cWidthColl[currentHCell];
                args.reqType = "column-resize";
                if (this.XLObj._trigger("resizeEnd", args)) {
                    return;
                }
                xlObj.element.find("#" + xlObj._id + "ddl").ejDropDownList("hidePopup");
            }
        },

        _getResizableCell: function (e) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), row = xlObj._getJSSheetHeader(sheetIdx).find(".e-columnheader"), cell = row.find(".e-headercell");
            var scrollLeft = navigator.userAgent.indexOf("WebKit") > -1 ? document.body.scrollLeft : document.documentElement.scrollLeft, xlimit, point, hdnColCnt = 0;
            for (var i = 0, len = cell.length; i < len; i++) {
                point = cell[i].getBoundingClientRect();
                xlimit = point.left + scrollLeft + 5;
                if (xlimit > this._orgX) {
                    if (xlObj.isUndefined(e))
                        this._currentHCell = i - 1;
                    else
                        e.target = xlObj._getJSSheetHeader(sheetIdx).find('th:eq(' + (i - 1) + ')')[0];
                    return;
                }
            }
        },

        _moveVisual: function (x) {
            /// Used to move the visual element in mouse move
            var xlObj = this.XLObj, bounds = xlObj._getJSSheetHeader(xlObj.getActiveSheetIndex()).find(".e-headercontent")[0].getBoundingClientRect();
            if ((bounds.left + document.documentElement.scrollLeft + bounds.width < x) || (x < bounds.left + document.documentElement.scrollLeft))
                this._$visualElem.remove();
            else if (this._currentHCell > -1)
                this._$visualElem.css({ left: x - 1, top: this._tableY });
        },

        _rowMouseDown: function (e) {
            var x, y, xy, args = {}, xlObj = this.XLObj;
            if (xlObj._isTouchEvt)
                this._rowMouseHover(e);
            if (this._allowStart && ($(e.target).css("cursor") === "row-resize")) {
                xy = xlObj._setXY(e, navigator.userAgent.indexOf("WebKit") > -1);
                x = xy[0];
                y = xy[1];
                y += document.documentElement.scrollTop;
                args.event = e;
                args.target = e.target;
                args.rowIndex = this._currentHCell;
                args.oldHeight = e.target.getBoundingClientRect().height;
                args.reqType = "row-resize";
                if (this.XLObj._trigger("resizeStart", args)) {
                    return;
                }
                if (e.button !== 2)
                    this._rowStart(x, y);
                this._resizeType = "Row";
                e.preventDefault();
            }
            return false;
        },

        _rowMouseHover: function (e) {
            if (this._$visualElem.is(":visible"))
                return;
            var $trgt = $(e.target);
            if ($trgt.hasClass("e-rowheader")) {
                var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), rHContent = xlObj._getJSSheetRowHeaderContent(sheetIdx);
                var resCell = $trgt.get(0), location = resCell.getBoundingClientRect(), xy = xlObj._setXY(e), x = xy[0], y = xy[1];
                var nly = xlObj._getJSSheetRowHeader(sheetIdx).find(".e-table").height() + rHContent.find("tbody").offset().top;
                if (((y >= (location.top + document.documentElement.scrollTop + resCell.offsetHeight - (xlObj._isTouchEvt ? 8 : 7))) || ((y < (location.top + (xlObj._isTouchEvt ? 8 : 0))))) && (y < nly) && (y >= location.top) && (x <= location.left + document.documentElement.scrollLeft + e.target.offsetWidth)) {
                    this._resizeElt = $trgt.parent();
                    this._currentHCell = xlObj.model.scrollSettings.allowVirtualScrolling ? parseInt(this._resizeElt.attr('data-idx')) : this._resizeElt[0].rowIndex;
                    if (this._currentHCell < 1 && y < (location.top + resCell.offsetHeight - (xlObj._isTouchEvt ? 8 : 5)) || (this._preventRowResize(this._currentHCell, false)))
                        return;
                    $trgt.addClass("e-ss-rowresize");
                    this._allowStart = true;
                }
                else {
                    $(".e-ss-rowresize").removeClass("e-ss-rowresize");
                    this._allowStart = false;
                    this._currentHCell = -1;
                }
                this._resizerowId = e.target.parentNode.getAttribute('data-idx');
            }
        },

        _preventRowResize: function (rowIdx, isCMenu) {
            this._currentHCell = rowIdx;
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), pivotIdCol = [], pvtMngr = xlObj.getSheet(sheetIdx).pivotMngr.pivot,
                pivotIdCol = xlObj.getObjectKeys(pvtMngr), pvtRowIdx, rowCount, pvtObj, count, i,
                pivotCount = pivotIdCol.length;
            if (pivotIdCol.length) {
                for (i = 0; i < pivotCount; i++) {
                    pvtRowIdx = pvtMngr[pivotIdCol[i]].rowIndex;
                    pvtObj = xlObj.element.find('#' + pivotIdCol[i]).data("ejPivotGrid");
                    count = pvtObj._rowCount;
                    if (!count)
                        count = 4;
                    rowCount = pvtRowIdx + count;
                    if (isCMenu)
                        return this._currentHCell >= pvtRowIdx && this._currentHCell < rowCount;
                    else
                        return this._currentHCell >= (pvtRowIdx - 1) && this._currentHCell <= rowCount;
                }
            }
        },
        _rowStart: function (x, y) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), currHCell = this._resizeElt[0].rowIndex, cells = xlObj._getJSSheetRowHeader(sheetIdx).find(".e-rowheader"), cell, rect, width;
            if (this._currentHCell > -1 && currHCell < cells.length)
                cell = cells[currHCell];
            if (!cell)
                return;
            rect = cell.getBoundingClientRect();
            this._tableX = rect.left + parseInt(navigator.userAgent.indexOf("WebKit") > -1 ? document.body.scrollLeft : document.documentElement.scrollLeft);
            if (this._allowStart) {
                this._$visualElem = $(document.createElement("div"));
                width = xlObj._getJSSheetContent(sheetIdx).width();
                this._$visualElem.addClass("e-reSizeRowbg").appendTo(xlObj.element).css({ width: width + "px" }).addClass("e-ss-rowresize");
                this._$visualElem.css({ top: y - 3, left: this._tableX });
                this._oldHeight = cell.offsetHeight;
                this._orgX = x;
                this._orgY = y;
                this._extra = y - this._orgY;
                this._resizeStart = true;
            }
            else {
                this._currentHCell = -1;
            }
        },

        _rMouseMove: function (e) {
            if (this._resizeStart) {
                var y = this.XLObj._setXY(e, navigator.userAgent.indexOf("WebKit") > -1)[1];
                y += document.documentElement.scrollTop;
                e.preventDefault();
                $(e.target).addClass("e-ss-rowresize");
                this._moveRowVisual(y);
            }
            else
                this._rowMouseHover(e);
        },

        _rowResize: function (x, y) {
            // Function used for Resizing the row                      
            var oldHeight, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), rows = xlObj.getRows(sheetIdx)[1], isWrap = false, i, rHContent = xlObj._getJSSheetRowHeaderContent(sheetIdx), selRHCells = rHContent.find(".e-rowselected"), rowLen = selRHCells.length, currentRHCellIdx, groupedRow, currentRHCells = [], hdnRowCnt = 0, k;
            this._initialTableHeight = xlObj._getJSSheetRowHeader(sheetIdx).find(".e-rowheadercontent").height();
            this._getResizableRowCell();
            isWrap = $(rows[this._currentHCell]).find(".e-sswraptext").length > 0;
            if (this._currentHCell > -1 && this._resizeStart) {
                for (k = 0; k <= this._resizerowId; k++)
                    (xlObj.XLEdit.getPropertyValue(k, 0, "isRHide")) && hdnRowCnt++;
                oldHeight = xlObj.getSheet(sheetIdx).rowsHeightCollection[this._currentHCell + hdnRowCnt];
                if (!isWrap || (isWrap && (y - this._orgY + oldHeight) > oldHeight)) {
                    (rowLen > 0) && (currentRHCellIdx = selRHCells[0].parentNode.rowIndex);
                    for (i = 0; i < rowLen; i++) {
                        (this._currentHCell === currentRHCellIdx) && (groupedRow = true);
                        currentRHCells.push(currentRHCellIdx);
                        currentRHCellIdx++;
                    }
                    (!groupedRow) && (currentRHCells = [this._currentHCell]);
                    this._resizeRowUsingDiff(y - this._orgY + oldHeight, oldHeight, currentRHCells);
                }
                if (xlObj.model.allowAutoFill) {
                    xlObj.XLDragFill.positionAutoFillElement();
                    xlObj.XLDragFill.hideAutoFillOptions();
                }
                if (xlObj._isAutoWHMode && xlObj.model.showRibbon)
                    xlObj._autoSSWidthHeight(sheetIdx, true);
            }
            if (xlObj.model.allowSelection)
                xlObj.XLSelection._refreshBorder();
            this._removeVisualElem();
        },

        _resizeRowUsingDiff: function (newHeight, oldHeight, currentRHCells) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), details = {}, rHContent = xlObj._getJSSheetRowHeaderContent(sheetIdx), len, $headerCol, $ContentCol, rowIdx, virtRowIdx, isHtOk,sparkline,rowIndex, colIndex;
            if (newHeight > 0) {
                newHeight = newHeight > this._rowMinHeight ? newHeight : this._rowMinHeight;
                for (var i = 0, len = currentRHCells.length; i < len; i++) {
                    rowIdx = currentRHCells[i];
                    virtRowIdx = xlObj.model.scrollSettings.allowVirtualScrolling ? xlObj.getSheet(sheetIdx)._virtualRowIdx.indexOf(rowIdx) : rowIdx;
                    isHtOk = this._getContentHeight(rowIdx, sheetIdx) <= newHeight;
                    if (xlObj._isRowViewable(sheetIdx, rowIdx) && (xlObj._isUndoRedo || isHtOk)) {
                        $headerCol = rHContent.find("tr:eq(" + virtRowIdx + ")");
                        $ContentCol = xlObj._getJSSheetContent(sheetIdx).find(".e-content").find("tr:eq(" + virtRowIdx + ")");
                        $headerCol.outerHeight(newHeight);
                        $ContentCol.height(newHeight);
                        colIndex= xlObj.getSheet(sheetIdx).usedRange.colIndex;
						for (var l = 0; l <= colIndex; l++) {
							sparkline = xlObj.XLEdit.getPropertyValue(currentRHCells[i], l, "sparkline", sheetIdx);
							if (sparkline) {
								xlObj.XLScroll._getRowHeights(sheetIdx, currentRHCells[0]);
								cellInfo = xlObj._getCellInfo({ rowIndex: currentRHCells[i], colIndex: colIndex }, 1);
								$("#" + sparkline[0]).css({top:cellInfo.top});
								sparklineId = xlObj._dataContainer.sheets[sheetIdx][currentRHCells[i]][l].sparkline[0].split("_")[3];
								if (sparklineId == currentRHCells[i])
									xlObj.XLSparkline._sparklineResize(sparkline[0], {height: newHeight}, sheetIdx);
                            }
                        }
				    }
				    xlObj.XLShape && xlObj.XLShape._refreshShapePosOnResize(currentRHCells[i], newHeight, false, sheetIdx);
				    if (xlObj._isUndoRedo || isHtOk)
                        xlObj.getSheet(sheetIdx).rowsHeightCollection[rowIdx] = newHeight;
                }
                xlObj.XLScroll._getRowHeights(sheetIdx, currentRHCells[0]);
                rHContent.find("tbody").css("cursor", "default");
                rHContent.find("tbody").children().css("cursor", "default");
                if (!xlObj._dupDetails) {
                    details = { sheetIndex: sheetIdx, rows: currentRHCells, newHeight: newHeight, oldHeight: oldHeight, reqType: "resize-row" };
                    if (oldHeight !== newHeight && !xlObj._dupDetails) {
                        xlObj._completeAction(details);
                        xlObj._trigActionComplete(details);
                    }
                }
                if (xlObj.model.allowFreezing)
                    xlObj.XLFreeze._refreshFRowResize(rowIdx);
                if (xlObj.model.scrollSettings.allowScrolling) {
                    xlObj.XLScroll._refreshScroller(sheetIdx, "refresh", "all");
                    xlObj.XLScroll._getFirstRow(sheetIdx);
                }
				if(xlObj.XLSparkline)
					xlObj.XLSparkline._refreshSparklinePos({rowIndex: currentRHCells[0], colIndex: 0}, sheetIdx);
            }
        },

        _findRowsHeight: function (rows) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), actSheet = xlObj.getSheet(sheetIdx), trColl = xlObj._getJSSheetContent(sheetIdx).find("tbody").children(), index;
            for (var i = 0, len = rows.length; i < len; i++) {
                index = rows[i];
                if (xlObj._sheets[sheetIdx]._Rows[0])
                    actSheet.rowsHeightCollection[index] = trColl.eq(index).height();
            }
        },

        _calculateHeight: function () {
            var xlObj = this.XLObj, rows = xlObj.getRows(xlObj.getActiveSheetIndex())[0], height = 0;
            for (var i = 0, len = rows.length; i < len; i++)
                height += rows.eq(i).height();
            return height;
        },

        _rMouseUp: function (e) {
            if (this._resizeStart) {
                var xlObj = this.XLObj, currentHCell = this._currentHCell, rHeightColl = xlObj.getSheet(xlObj.getActiveSheetIndex()).rowsHeightCollection, args = {}, x, y, xy = xlObj._setXY(e, navigator.userAgent.indexOf("WebKit") > -1);
                x = xy[0];
                y = xy[1];
                y += document.documentElement.scrollTop;
                args.event = e;
                args.target = e.target;
                args.oldHeight = rHeightColl[currentHCell];
                args.rowIndex = this._currentHCell;
                this._rowResize(x, y);
                args.newHeight = rHeightColl[currentHCell];
                args.reqType = "row-resize";
                if (this.XLObj._trigger("resizeEnd", args)) {
                    return;
                }
                if ($("#" + this.XLObj._id + "ddlspan").length)
                    this.XLObj._ddlPosition();
            }
        },

        _getResizableRowCell: function (e) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), cell = xlObj._getJSSheetContent(sheetIdx).find(".e-rowheader"), scrollTop = navigator.userAgent.indexOf("WebKit") > -1 ? document.body.scrollTop : document.documentElement.scrollTop, ylimit, point, count = 1, idx;
            for (var i = 0, len = cell.length; i < len; i++) {
                point = cell[i].getBoundingClientRect();
                if (point.top === 0) count++;
                ylimit = point.top + scrollTop + 5;
                if (ylimit > this._orgY) {
                    if (xlObj.isUndefined(e)) {
                        idx = $(cell[i - 1]).is(":visible") ? i - 1 : i - count;
                        this._currentHCell = xlObj._getCellIdx(cell[idx]).rowIndex;
                    }
                    else
                        e.target = xlObj._getJSSheetRowHeader(sheetIdx).find('tr:eq(' + i + ') td')[0];
                    return;
                }
            }
        },

        _moveRowVisual: function (y) {
            /// Used to move the visual element in mouse move
            var xlObj = this.XLObj, bounds = xlObj._getJSSheetContent(xlObj.getActiveSheetIndex()).find(".e-rowheadercontent")[0].getBoundingClientRect();
            if ((bounds.top + document.documentElement.scrollTop + bounds.height < y) || (y < bounds.top + document.documentElement.scrollTop))
                this._$visualElem.remove();
            else if (this._currentHCell > -1)
                this._$visualElem.css({ top: y - 3, left: this._tableX });
        },

        //Activation panel resizing
        _apMouseDown: function (e) {
            var x, xlObj = this.XLObj;
            if (xlObj._isTouchEvt)
                this._apMouseHover(e);
            if (this._allowStart && ($(e.target).closest("div").css("cursor") === "col-resize")) {
                x = xlObj._setXY(e, navigator.userAgent.indexOf("WebKit") > -1)[0];
                x += document.documentElement.scrollLeft;
                if (e.button !== 2)
                    this._apStart(x);
                this._resizeType = "AP";
                e.preventDefault();
            }
            return false;
        },

        _apMouseHover: function (e) {
            var xlObj = this.XLObj;
            if (this._$visualElem.is(":visible"))
                return;
            var $trgt = $(e.target), resizableElt = $trgt.get(0), location = xlObj.getActivationPanel()[0].getBoundingClientRect(), x = xlObj._setXY(e)[0];
            if ((x <= (location.left + (xlObj._isTouchEvt ? 20 : 4))) && (x >= location.left)) {
                $trgt.parent().addClass("e-ss-apresize");
                this._allowStart = true;
            }
            else {
                xlObj.element.find(".e-ss-apresize").removeClass("e-ss-apresize");
                this._allowStart = false;
            }
        },

        _apStart: function (x) {
            var xlObj = this.XLObj, cell = xlObj.getActivationPanel()[0], rect = cell.getBoundingClientRect(), sheetIdx = xlObj.getActiveSheetIndex(), height;
            this._tableY = rect.top + parseInt(navigator.userAgent.indexOf("WebKit") > -1 ? document.body.scrollTop : document.documentElement.scrollTop);
            if (this._allowStart) {
                this._$visualElem = $(document.createElement("div"));
                height = xlObj._getJSSheetContent(sheetIdx).height() + xlObj._getJSSheetHeader(sheetIdx).height();
                this._$visualElem.addClass("e-reSizeAPbg").appendTo(xlObj.element).css({ height: height + "px" }).addClass("e-ss-apresize");
                this._$visualElem.css({ left: x, top: this._tableY });
                this._resizeStart = true;
            }
        },

        _apMouseMove: function (e) {
            if (this._resizeStart) {
                var xlObj = this.XLObj, x = xlObj._setXY(e, navigator.userAgent.indexOf("WebKit") > -1)[0];
                x += document.documentElement.scrollLeft;
                e.preventDefault();
                this._apMoveVisual(x);
            }
            else
                this._apMouseHover(e);
        },

        _apMouseUp: function (e) {
            if (this._resizeStart) {
                var xlObj = this.XLObj, x = xlObj._setXY(e, navigator.userAgent.indexOf("WebKit") > -1)[0];
                x += document.documentElement.scrollLeft;
                this._apReSize(x);
            }
        },

        _apMoveVisual: function (x) {
            this._$visualElem.css({ left: x - 5, top: this._tableY });
        },

        _apReSize: function (x) {
            var xlObj = this.XLObj, prevWidth = xlObj.model.activationPanelWidth, isScrollWidth = 0, settings = $.extend(true, {}, xlObj.model.scrollSettings), actPanel = xlObj.getActivationPanel(), desObj;
            settings.width = xlObj._responsiveWidth;
            settings.height = xlObj._responsiveHeight;
            xlObj.model.activationPanelWidth = Math.abs(settings.width - (x - xlObj.element.offset().left));
            if (xlObj.model.enablePivotTable) {
                var scrObj = xlObj.getActivationPanel().data("ejScroller");
                isScrollWidth = xlObj.getActivationPanel().find(".e-vscrollbar").length ? 20 : 2;
                actPanel.find(".e-ss-pivotfield").width(xlObj.model.activationPanelWidth - isScrollWidth);
                actPanel.find("#" + xlObj._id + "_PivotField").width(xlObj.model.activationPanelWidth - isScrollWidth);
                if (prevWidth > xlObj.model.activationPanelWidth) {
                    scrObj.option({ width: xlObj.model.activationPanelWidth - 1 });
                    xlObj._setSheetWidthHeight(xlObj.getActiveSheetIndex(), { width: settings.width, height: settings.height }, null, "resize");
                }
                else {
                    xlObj._setSheetWidthHeight(xlObj.getActiveSheetIndex(), { width: settings.width, height: settings.height }, null, "resize");
                    scrObj.option({ width: xlObj.model.activationPanelWidth - 1 });
                }
                desObj = xlObj.getActivationPanel().find("#" + xlObj._id + "_PivotTableSchema_" + xlObj._getContent(xlObj.getActiveSheetIndex()).find(".e-ss-activepivot")[0].id).data("ejPivotSchemaDesigner");
                desObj._reSizeHandler();
                scrObj.refresh();
            }
            this._removeVisualElem();
        },

        _removeVisualElem: function () {
            var xlObj = this.XLObj;
            this._$visualElem.remove();
            xlObj.element.find(".e-reSizeRowbg").remove();
            this._resizeStart = false;
            this._currentHCell = -1;
            this._resizeType = "";
            this._allowStart = false;
            if (xlObj.model.allowComments)
                xlObj.XLComment._updateCmntArrowPos();
        },

        //Resize To Fit Width
        fitWidth: function (colIdxes) {
            //colIdxes is the array of column indexes to be resized
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex();
            if (!xlObj.model.allowResizing)
                return;
            for (var i = 0, len = colIdxes.length; i < len; i++)
                this._fitWidth(colIdxes[i], 0, xlObj.getSheet(sheetIdx).usedRange.rowIndex);
            if (xlObj.model.scrollSettings.allowScrolling) {
                xlObj.XLScroll._getColWidths(sheetIdx, colIdxes[0] + 1);
                xlObj.XLScroll._refreshScroller(sheetIdx, "refresh", "horizontal");
            }
            xlObj.model.allowSelection && xlObj.XLSelection._refreshBorder();
            if (xlObj.model.allowComments)
                xlObj.XLComment._updateCmntArrowPos(null, sheetIdx, { colIndex: colIdxes[i] });
        },

        _resizeToFitWidth: function (e) {
            var xlObj = this.XLObj, $trgt = $(e.target), sheetIdx = xlObj.getActiveSheetIndex(), endRowIdx = xlObj.getSheet(sheetIdx).usedRange.rowIndex;
            this._getResizableCell(e);
            this._fitWidth(e.target.cellIndex, 0, endRowIdx);
            if (xlObj.model.scrollSettings.allowScrolling) {
                xlObj.XLScroll._getColWidths(xlObj.getActiveSheetIndex(), e.target.cellIndex + 1);
                xlObj.XLScroll._refreshScroller(sheetIdx, "refresh", "horizontal");
            }
            xlObj.model.allowSelection && xlObj.XLSelection._refreshBorder();
            if (xlObj.model.allowAutoFill)
                xlObj.XLDragFill.positionAutoFillElement();
            if (xlObj.model.allowComments)
                xlObj.XLComment._updateCmntArrowPos(null, sheetIdx, { colIndex: e.target.cellIndex });
        },

        _fitWidth: function (colIdx, stRowIdx, endRowIdx) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), trgt = xlObj._getJSSheetHeader(sheetIdx).find(".e-headercell")[colIdx], $cellDiv = $(trgt).children(".e-headercelldiv"),
                finalWidth = 0, headerWidth = 0, contentWidth = 0, sheet = xlObj.getSheet(sheetIdx);
            endRowIdx = endRowIdx ? endRowIdx : sheet.usedRange.rowIndex;
            contentWidth = Math.round(this._getContentWidth(colIdx, sheetIdx, stRowIdx, endRowIdx));
            headerWidth = this._getHeaderContentWidth($cellDiv, sheetIdx);
            if (contentWidth > 1) {
                finalWidth = headerWidth > contentWidth ? headerWidth : contentWidth;
                var details = { target: trgt, sheetIndex: sheetIdx, colIndex: colIdx, newWidth: finalWidth, oldWidth: trgt.offsetWidth, reqType: "resize-fit-width" };
                if (finalWidth > 0) {
                    if (finalWidth < 20)
                        finalWidth = 30;
                    for (var i = stRowIdx; i <= endRowIdx + 1; i++) {
                        sparkline = xlObj.XLEdit.getPropertyValue(stRowIdx, colIdx, "sparkline", sheetIdx);
                        if (sparkline) 
                            xlObj.XLSparkline._sparklineResize(sparkline[0], { width: finalWidth }, sheetIdx);
                         stRowIdx++;   
                    }
					xlObj.XLShape && xlObj.XLShape._refreshShapePosOnResize(colIdx, finalWidth, true, sheetIdx);
                    this._applyWidth(trgt, sheetIdx, colIdx, finalWidth);
                    if (xlObj.model.allowFreezing)
                        xlObj.XLFreeze._refreshFColResize(colIdx);
                    xlObj.model.allowAutoFill && xlObj.XLDragFill.positionAutoFillElement();
                    if ((!sheet._isImported || sheet._isLoaded) && !xlObj._isUndoRedo && !xlObj._dupDetails && !xlObj._isExport) {
                        xlObj._completeAction(details);
                        xlObj._trigActionComplete(details);
                    }
                }
            }
            xlObj.XLEdit._updateDataContainer({ rowIndex: 0, colIndex: colIdx }, { dataObj: { isFitWidth: true } });
        },

        _applyWidth: function (trgt, activeIdx, cellIndex, finalWidth) {
            var xlObj = this.XLObj;
            xlObj._getJSSheetHeader(activeIdx).find("col:eq(" + cellIndex + ")").width(finalWidth);
            xlObj._getJSSheetContent(activeIdx).find("col:eq(" + (cellIndex + 1) + ")").width(finalWidth);
            xlObj.getSheet(activeIdx).columnsWidthCollection[cellIndex] = finalWidth;
            xlObj.getSheet(activeIdx).columns[cellIndex].width = finalWidth;
        },

        _getContentWidth: function (colIdx, sheetIdx, stRowIdx, endRowIdx) {
            var j, contentWidth = 0, cellObj, cellWidth, xlObj = this.XLObj, sheetData = xlObj._dataContainer.sheets[sheetIdx], tdWidth;
            for (j = stRowIdx; j <= endRowIdx; j++) {
                if (!ej.isNullOrUndefined(sheetData[j]))
                    cellObj = sheetData[j][colIdx];
                if (!ej.isNullOrUndefined(cellObj))
                    cellWidth = this._getCalculatedCellWidth(sheetIdx, cellObj);
                else {
                    cellObj = {};
                    cellWidth = { spanWidth: 0, paddingWidth: 0 };
                }
                tdWidth = xlObj._detailsFromGlobalSpan(j, colIdx, "width", xlObj.XLEdit.getPropertyValue(j, colIdx, "value2"), undefined, true);
                tdWidth = tdWidth + cellWidth.spanWidth + cellWidth.paddingWidth + 4; // for some spacing
                if (tdWidth > contentWidth)
                    contentWidth = tdWidth;
            }
            return contentWidth;
        },

        _getCalculatedCellWidth: function (sheetIdx, object) {
            var spanWidth = 0, paddingWidth = 0;
            if ("isFilterHeader" in object) {
                if ("isFilterVisible" in object)
                    spanWidth += 17; //15 for filter span width, 2 for right and left border               
            }
            else {
                spanWidth += 0;
                // add spanWidth for Pivot Table spans
            }
            paddingWidth = 3; // 1 for padding right, 2 for padding left
            return { spanWidth: spanWidth, paddingWidth: paddingWidth };
        },

        _getHeaderContentWidth: function ($cellDiv, sheetIndex) {
            var headerWidth = 0, $span = ej.buildTag("span", {}, {}), content = $cellDiv.html();
            $span.html(content);
            $cellDiv.html($span);
            headerWidth = $cellDiv.find("span:first").width();
            headerWidth = headerWidth + 10; // for some space
            $cellDiv.html(content);
            return headerWidth;
        },

        //Resize To Fit Height
        fitHeight: function (rowIdxes) {
            var xlObj = this.XLObj;
            if (!xlObj.model.allowResizing)
                return;
            var sheetIdx = xlObj.getActiveSheetIndex(); // rowIdxes is the array of rows to be resized
            for (var i = 0, len = rowIdxes.length; i < len; i++) {               
                this._fitHeight(rowIdxes[i], rowIdxes[i]);
				xlObj._setRowHdrHeight(sheetIdx, rowIdxes[i]);
			}
            if (xlObj.model.scrollSettings.allowScrolling) {
                xlObj.XLScroll._getRowHeights(sheetIdx, rowIdxes[0]);
                xlObj.XLScroll._refreshScroller(sheetIdx, "refresh", "vertical");
            }
            if (xlObj.model.allowSelection)
                xlObj.XLSelection._refreshBorder();
            if (xlObj.model.allowComments)
                xlObj.XLComment._updateCmntArrowPos(null, sheetIdx, { rowIndex: rowIdxes[0] });
        },

        _resizeToFitHeight: function (e) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), rowIndex = e.target.parentNode.rowIndex, orgRowIdx;
            orgRowIdx = xlObj.model.scrollSettings.allowVirtualScrolling ? xlObj.getSheet(sheetIdx)._virtualRowIdx[rowIndex] : rowIndex;
            this._getResizableRowCell(e);
            this._fitHeight(rowIndex, orgRowIdx);
            xlObj._setRowHdrHeight(sheetIdx, orgRowIdx);
            if (xlObj.model.scrollSettings.allowScrolling) {
                xlObj.XLScroll._getRowHeights(xlObj.getActiveSheetIndex(), orgRowIdx);
                xlObj.XLScroll._refreshScroller(sheetIdx, "refresh", "vertical");
            }
            if (xlObj.model.allowSelection)
                xlObj.XLSelection._refreshBorder();
            if (xlObj.model.allowAutoFill)
                xlObj.XLDragFill.positionAutoFillElement();
            if (xlObj.model.allowComments)
                xlObj.XLComment._updateCmntArrowPos(null, sheetIdx, { rowIndex: rowIndex });
        },

        _fitHeight: function (rowIndex, orgRowIdx) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), trgt = xlObj._getJSSheetRowHeader(sheetIdx).find(".e-rowheader")[rowIndex],
                finalHeight = 0, contentHeight = 0, headerHeight, $span = ej.buildTag("span", {}, { height: 20, width: 30 });
            contentHeight = this._getContentHeight(orgRowIdx, sheetIdx, xlObj.XLEdit.getPropertyValue(orgRowIdx, 0, "wrapRow"));
            $span.html(orgRowIdx + 1);
            xlObj.element.append($span);
            headerHeight = xlObj.element.find("span:last").outerHeight(true);
            xlObj.element.find("span:last").remove();
            headerHeight = headerHeight + 4; // some Spacing.
            finalHeight = (contentHeight < headerHeight) ? headerHeight : contentHeight;
            var details = { target: trgt, sheetIndex: sheetIdx, rowIndex: orgRowIdx, newHeight: finalHeight, oldHeight: sheet.rowsHeightCollection[rowIndex], reqType: "resize-fit-height" };
			xlObj.XLShape && xlObj.XLShape._refreshShapePosOnResize(rowIndex, finalHeight, false, sheetIdx);
            if (xlObj._isRowViewable(sheetIdx, orgRowIdx)) {
                $(trgt.parentElement).height(finalHeight);
                $(xlObj._getContent(sheetIdx).find("tr")[rowIndex]).height(finalHeight);
            }
            xlObj.getSheet(sheetIdx).rowsHeightCollection[orgRowIdx] = finalHeight;
            colIndex = xlObj.getSheet(sheetIdx).usedRange.colIndex;
            for (var k = 0; k <= colIndex; k++) {
                sparkline = xlObj.XLEdit.getPropertyValue(rowIndex, colIndex, "sparkline", sheetIdx); 
                if (sparkline)
                    xlObj.XLSparkline._sparklineResize(sparkline[0], { height: finalHeight }, sheetIdx);
            }
            if (xlObj.model.allowFreezing)
                xlObj.XLFreeze._refreshFRowResize(rowIndex);
            if (xlObj.model.scrollSettings.allowScrolling)
                xlObj.XLScroll._refreshScroller(sheetIdx, "refresh", "all");
            if ((!sheet._isImported || sheet._isLoaded) && !xlObj._dupDetails && !xlObj._isExport) {
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
            if (xlObj.model.allowAutoFill)
                xlObj.XLDragFill.positionAutoFillElement();
            xlObj.XLEdit._updateDataContainer({ rowIndex: orgRowIdx, colIndex: 0 }, { dataObj: { "isFitHeight": true } });
        },

        _getContentHeight: function (rowIdx, sheetIdx, isWrapRow) {
            var xlObj = this.XLObj, contentHeight = 0, $span, tdHeight, format = "", regx = xlObj._formatRegx, $td, content, sheet = xlObj.getSheet(sheetIdx),
                cKeys = xlObj.getObjectKeys(xlObj._dataContainer.sheets[sheetIdx][rowIdx]), rHtColl = sheet.rowsHeightCollection[rowIdx], cWtColl = sheet.columnsWidthCollection;
            for (var i = 0, len = cKeys.length; i < len; i++) {
                tdHeight = xlObj._detailsFromGlobalSpan(rowIdx, cKeys[i], "height", xlObj.XLEdit.getPropertyValue(rowIdx, cKeys[i], "value2"), isWrapRow ? cWtColl[i] : undefined, true);
                if (tdHeight > contentHeight)
                    contentHeight = tdHeight;
            }
            return contentHeight;
        },

        _setRowHdrHeightResize: function (sheetIdx, colIdx) {
            var xlObj = this.XLObj, shtRows = xlObj.getRows(sheetIdx), rowHdrs = shtRows[0], endRowIdx = xlObj.getSheet(sheetIdx).usedRange.rowIndex;
            for (var i = 0; i <= endRowIdx; i++) {
                if (!ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(i, colIdx, "mergeIdx")) || !ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(i, colIdx, "merge")))
                    continue;
                if (xlObj._isRowViewable(sheetIdx, i)) {
                    tdHeight = xlObj._detailsFromGlobalSpan(i, colIdx, "height", xlObj.XLEdit.getPropertyValue(i, colIdx, "value2"));
                    $(rowHdrs[i]).height(tdHeight);
                }
            }
        },
    };
})(jQuery, Syncfusion);