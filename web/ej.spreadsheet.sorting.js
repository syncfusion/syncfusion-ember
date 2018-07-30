(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.sorting = function (obj) {
        this.XLObj = obj;
		this._isSortByFilter = false;
    };

    ej.spreadsheetFeatures.sorting.prototype = {
        _sortHandler: function (args) {
            var i, ctype1, ctype2, val1, val2, direction, tname, tableId, rIdx, cIdx, alphRange, format, cellIdx, color = {},
                columnName = "", range = {}, xlObj = this.XLObj, regx = xlObj._formatRegx, sheetIdx = xlObj.getActiveSheetIndex(),
                sheet = xlObj.getSheet(sheetIdx), cell = sheet._selectedCells, stRowIdx;
            columnName = sheet.columns[sheet._activeCell.colIndex].field;
			this._isSortByFilter = false;
            if (args != "PutCellColor" && args != "PutFontColor") {
                if (!xlObj.model.allowSorting || !sheet._selectedCells.length)
                    return;
                (cell.length === 1) && xlObj.selectAll(false);
                direction = (args === "Ribbon_SortZtoA" || args === "SortZtoA") ? ej.sortOrder.Descending : ej.sortOrder.Ascending;
                tname = xlObj.XLEdit.getPropertyValue(sheet._activeCell.rowIndex, sheet._activeCell.colIndex, "tableName", sheetIdx) || "";
                tableId = xlObj._getTableID(tname);
                if (!ej.isNullOrUndefined(tableId)) {
                    range = sheet.tableManager[tableId].range.slice(0);
                    range[0]++;						
                }
                else {
                    range = sheet.selectedRange.slice(0), rIdx = range[0], cIdx = range[1];
                    if (rIdx === range[2])
                        return;
                    val1 = xlObj.XLEdit.getPropertyValue(rIdx, cIdx);
                    for (i = rIdx + 1; i <= range[2]; i++) {
                        if (!xlObj._isHiddenRow(i)) {
                            val2 = xlObj.XLEdit.getPropertyValue(i, cIdx);
                            break;
                        }
                    }
                    ctype1 = xlObj.isNumber(val1) ? ej.Spreadsheet.CellType.Number : ej.Spreadsheet.CellType.String;
                    ctype2 = xlObj.isNumber(val2) ? ej.Spreadsheet.CellType.Number : ej.Spreadsheet.CellType.String;
					 if(!xlObj.XLEdit.getPropertyValue(rIdx, cIdx, "merge") && !xlObj.XLEdit.getPropertyValue(i, cIdx, "merge"))
						if(!xlObj.XLEdit.getPropertyValue(range[0], range[1], "calcValue"))
						    if (ctype1 != ctype2 || (xlObj.XLEdit.getPropertyValue(range[0], range[1], "wrap")) || xlObj.XLEdit.getPropertyValue(range[0], range[1], "isFilterHeader"))
								range[0]++;
                }
                this.sortByRange(range, columnName, direction);
            }
            else {
                stRowIdx = (cell.length === 1) ? this._selectSortRange(sheetIdx, cell[0]) : sheet._startCell.rowIndex;
                alphRange = xlObj._getAlphaRange(sheetIdx, stRowIdx, cell[0].colIndex, (cell.length === 1) ? cell[0].rowIndex : sheet._endCell.rowIndex, cell[0].colIndex);
				format = xlObj.XLEdit.getPropertyValue(sheet._activeCell.rowIndex, sheet._activeCell.colIndex, "formats");
                if (!xlObj.isUndefined(format)) {
                    format["background-color"] && (color["background-color"] = format["background-color"].toLowerCase());
                    format["color"] && (color["color"] = format["color"].toLowerCase());
                    this.sortByColor(args, color, alphRange);
                }
            }
			if (cell.length === 1) {
                xlObj.XLSelection.selectRange(cell[0], cell[0], sheetIdx)
                sheet._startCell = sheet._endCell = cell[0];
                xlObj.model.allowAutoFill && xlObj.XLDragFill.positionAutoFillElement();
            }
        },

        _selectSortRange: function (sheetIdx, activeCell) {
            var xlObj = this.XLObj, tableRange = xlObj.getSheet(sheetIdx).filterSettings.tableRange;
            for (var i = 0, len = tableRange.length; i < len; i++)
                if ((tableRange[i].multifilterIdx.indexOf(activeCell.colIndex) > -1) && (activeCell.rowIndex > tableRange[i].startRow - 1) && (activeCell.rowIndex < tableRange[i].endRow + 1))
                    return tableRange[i].startRow;
            xlObj.selectAll();
            return xlObj.getSheet(sheetIdx)._selectedCells[0].rowIndex;
        },

        sortByColor: function (operation, color, range) {
            var xlObj = this.XLObj;
            range = xlObj._getRangeArgs(range, "object");
            if (!xlObj.model.allowSorting || this._sortRangeAlert(range) || xlObj.model.isReadOnly)
                return;
            var sheetIdx = xlObj.getActiveSheetIndex(), sortObj = {oprType: operation}, startRowIndex, endRowIndex, sheet = xlObj.getSheet(sheetIdx), columnName;
            columnName = sheet.columns[range[1]].field;
            if (!ej.isNullOrUndefined(color)) {
                if (operation === "PutCellColor") {
                    if (color["background-color"])
                        color = color["background-color"];
                    sortObj.operation = "sortbgcolor";
                    sortObj.bgcolor = color;
                }
                else {
                    if (color["color"])
                        color = color["color"];
                    sortObj.operation = "sortfgcolor";
                    sortObj.fgcolor = color;
                }
                sortObj.requestType = sortObj.action = "sortbycolor";
                sortObj.sortColumn = columnName;
                sortObj.selRange = { startCell: { "rowIndex": range[0], "colIndex": range[1] }, endCell: { "rowIndex": range[2], "colIndex": range[3] } };
                sortObj.rangeData = xlObj.getRangeDataAsObject(sortObj.selRange.startCell, sortObj.selRange.endCell, true)[0];
				sortObj.sortRange = range;
                startRowIndex = range[0]; //this._getSortColorRange({ "rowIndex": range[0], "colIndex": range[1] });
                if (!ej.isNullOrUndefined(startRowIndex)) {
                    endRowIndex = xlObj.XLFilter._createSelection(sheetIdx, startRowIndex, range[2], range[1], []).endRowIndex;
                    startRowIndex = (operation === "PutCellColor" || operation === "PutFontColor") ? startRowIndex : startRowIndex;
                    sortObj.range = xlObj.model.sheets[sheetIdx]._selectedRange = { startRow: startRowIndex, endRow: endRowIndex, dataSourceIndexes: [] };
                    xlObj._processBindings(sortObj);
                }
            }
        },

        _getSortColorRange: function (activeCell) {
            var xlObj = this.XLObj, actElem = xlObj.getCell(activeCell.rowIndex, activeCell.colIndex), addSort = false, k, j;
            var startRowIndex = 0, prevText = false, rowIndex = activeCell.rowIndex, colIndex = activeCell.colIndex;
            if (actElem.text().length < 1) {
                //Active Element is Empty in the Top
                for (j = rowIndex; j < (rowIndex + 2) ; j++) {
                    actElem = xlObj.getCell(j, colIndex);
                    if (actElem.is(":visible") && actElem.text().length > 0) {
                        addSort = true;
                        startRowIndex = j;
                        break;
                    }
                }

                //Active Element is Empty in the Bottom
                if (!addSort) {
                    for (j = rowIndex; j > (rowIndex - 2); j--) {
						if (j > -1) {
							actElem = xlObj.getCell(j, colIndex);
							if (actElem.text().length === 0) {
								if (j > 0) {
									actElem = xlObj.getCell(j - 1, colIndex);
									actElem.text().length == 0 && (prevText = true);
								}
							}
						}
                    }
                    if (!prevText) {
                        for (j = rowIndex - 2; j > 0; j--) {
							actElem = xlObj.getCell(j, colIndex);
							if (actElem.is(":visible") && actElem.text().length === 0) {
								k = j + 1;
								addSort = true;
								startRowIndex = k;
								break;
							}
                        }
                    }
                }
            } else {
                //Active Element is Middle of the Column
                for (j = rowIndex; j >= 0; j--) {
                    actElem = xlObj.getCell(j, colIndex);
                    if (actElem.is(":visible") && actElem.text().length === 0) {
                        k = j + 1;
                        addSort = true;
                        startRowIndex = k;
                        break;
                    }
                    if (!addSort && j == 0) {
                        startRowIndex = j;
                        addSort = true;
                    }
                }
            }
            if (!addSort) {
                //display an alert message to select the cell which is having a value
                xlObj._showAlertDlg("Alert", "Alert", null, 630);
            } else
                return startRowIndex;
        },

		_sortRangeAlert: function(range){
			var xlObj = this.XLObj;
			var cKeys, mRange, sheetIdx = sheetIdx ? sheetIdx : xlObj.getActiveSheetIndex(), mergeObj, mCells = xlObj.getSheet(sheetIdx)._mergeColl, range = xlObj._getRangeArgs(range, "object"),
				rKeys = xlObj.getObjectKeys(mCells);
			for(var i = 0, rLen = rKeys.length; i < rLen; i++) {
				cKeys = xlObj.getObjectKeys(mCells[rKeys[i]]);
                for (var j = 0, jlen = cKeys.length; j < jlen; j++) {
                    mergeObj = xlObj._dataContainer.sheets[sheetIdx][rKeys[i]][cKeys[j]]["merge"];
					mRange = xlObj.getRangeIndices(mergeObj.mRange)
					if((range[0] <= mRange[0] && range[2] >= mRange[2]) || (range[0] >= mRange[0] && range[2] < mRange[2])) {
		                xlObj._showAlertDlg("Alert", "MergeSortAlert", '', 380);
						return true;
					}
				}
			}
			if(xlObj.XLEdit._rangeHasProperty(range, 'calcValue')){
				xlObj._showAlertDlg("Alert", "FormulaSortAlert", '', 315);
				return true;
			}
			return false;
		},
		
        sortByRange: function (range, columnName, direction, tableID) {
            var xlObj = this.XLObj;
            if(!xlObj.model.allowSorting || xlObj.model.isReadOnly)
				return;
            var len, sheetIdx = xlObj.getActiveSheetIndex(), i = 0, rangeData = [], args = {}, filterIcon = [], filterIcons,
                alpRange, fltrRng, colSelected = xlObj._getJSSheetHeader(sheetIdx).find(".e-colselected").length;
            if (!xlObj.model.allowSorting)
                return;
            range = xlObj._getRangeArgs(range, "object");
			if(this._sortRangeAlert(range))
				return true;
			if(this._isSortByFilter && colSelected < 1) {
				fltrRng = this._isSortByFilter ? range[0] - 1 : range[0];
				alpRange = xlObj._getAlphaRange(sheetIdx, fltrRng, range[1], fltrRng + 1, range[3]);
				filterIcons = xlObj._getAlphaRangeCells(alpRange).find(".e-filterspan");
				len = filterIcons.length;
				while (i < len) {
					filterIcon.push({ colIndex: filterIcons[i].parentNode.cellIndex, rowIndex: filterIcons.eq(i).parents("tr").index() });
					i++;
				}
				if(filterIcons.length)
					range[0] = this._isSortByFilter ? range[0] : range[0] + 1;
			}
			rangeData = xlObj.getRangeDataAsObject({ rowIndex: range[0], colIndex: range[1] }, { rowIndex: range[2], colIndex: range[3] }, true)[0];
			args.requestType = args.reqType = ej.Spreadsheet.Actions.Sorting;
            args.range = range;
            args.columnName = columnName;
            args.rangeData = rangeData;
            args.action = "sorting";
            args.sortDirection = direction;
            args.filterIcon = filterIcon;
			args.isSortByFilter = this._isSortByFilter;
			args.colSelected = colSelected;
            xlObj._processBindings(args);
			if(colSelected && this._isSortByFilter)
				xlObj.XLFilter._changeSortIcon({rowIndex: range[0] - 1, colIndex: range[1]}, direction);
			return false;
        },

        _sortComplete: function (args) {
            var i, xlObj = this.XLObj, range = args.range, data = this._swapSortedDatas(args), swappedData = data[1];
            xlObj._dupDetails = true;
            args.rangeData = data[0];
            if (xlObj.model.allowComments)
                xlObj.XLComment.deleteComment(range, null, true, "comment");
            xlObj._removeHyperlink(null, null, true, range);
            xlObj._isSort = true;
            xlObj.clearRangeData(range, ["value", "value2", "type", "formatStr", "decimalPlaces", "thousandSeparator", "comment", "hyperlink", "format"], null, true);
            if (xlObj.model.allowCellFormatting)
                xlObj.XLFormat.removeStyle(range, { cellStyle: true, tableStyle: true, format: true, skipHiddenRow: true });
            xlObj.XLEdit.updateCellWithContainer(swappedData, range, null, true);
            xlObj._isSort = false;
            xlObj.refreshOverflow([range[0], range[1], range[2], range[3]], xlObj.getActiveSheetIndex());
            this._refreshRowHeight(range, swappedData);
            xlObj._dupDetails = false;
        },

        _refreshRowHeight: function (range, swappedData) {
            var rowIdx, idx, i = 0, j = 0, xlObj = this.XLObj, sheetIdx = xlObj._getSheetIndex(), sheet = xlObj.getSheet(sheetIdx), trContent = xlObj._getJSSheetContent(sheetIdx).find(".e-content"), rHContent = xlObj._getJSSheetRowHeaderContent(sheetIdx);
            while (range[0] + i <= range[2]) {
                rowIdx = range[0] + i;
                idx = (i - j) * ((range[3] - range[1]) + 1); // first cell Idx in each row, excluding hidden row
                while (sheet.hideRowsCollection.indexOf(rowIdx) > -1 || sheet._hiddenFreezeRows.indexOf(rowIdx) > -1 && rowIdx < range[2])
                    rowIdx++ && i++ && j++;
				if(!xlObj.model.scrollSettings.allowVirtualScrolling && swappedData[idx]){
					trContent.find("tr:eq(" + rowIdx + ")").height(swappedData[idx].rheight);
					rHContent.find("tr:eq(" + rowIdx + ")").height(swappedData[idx].rheight);
				}
                if (swappedData[idx])
                    sheet.rowsHeightCollection[rowIdx] = swappedData[idx].rheight;
                i++;
            }
            xlObj.XLScroll._getRowHeights(sheetIdx, rowIdx);
			if(xlObj.model.scrollSettings.allowVirtualScrolling)
				xlObj.refreshContent(sheetIdx);
            if (sheet._isFreezed)
                xlObj.XLFreeze._refreshFreezeRowDiv();
        },

        _swapSortedDatas: function (args) {
            var text, idx, oIdx, j, rowIdx, i = 0, k = 0, l = 0, oldInst = [], total = [], arr = [], sheet = this.XLObj.getSheet(), viewData = args.model.currentViewData,
                vlen = viewData.length, colIdx = this.XLObj._generateColCount(args.columnName) - 1, olen,
                range = args.range, tCols = (range[3] - range[1]) + 1, ccIdx = colIdx - range[1],
                oldData = this.XLObj.getRangeData({ range: range, property: ["value", "value2", "type", "formatStr", "formats","decimalPlaces","thousandSeparator", "range", "format", "comment", "hyperlink", "rule"], skipHiddenRow: true });
            while (range[0] + k <= range[2]) {
                rowIdx = range[0] + k;
                idx = (k - l) * ((range[3] - range[1]) + 1);// first cell Idx in each row, excluding hidden row
                while ((sheet.hideRowsCollection.indexOf(rowIdx) > -1 || sheet._hiddenFreezeRows.indexOf(rowIdx) > -1) && rowIdx < range[2])
                    rowIdx++ && k++ && l++;
                if (oldData[idx])
                    oldData[idx].rheight = sheet.rowsHeightCollection[rowIdx];
                k++;
            }
            $.extend(true, oldInst, oldData);
			total.push(oldInst);
			while (i < vlen) {
                text = viewData[i][args.columnName];
                j = ccIdx;
                olen = oldData.length;
                while (j < olen) {
                    if (oldData[j].value === text) {
                        idx = this._getMinIdx(j, tCols);
						arr = arr.concat(oldData.splice(idx, tCols));
                        break;
                    }
                    j += tCols;
                }
                i++;
            }
			total.push(arr);
            return total;
        },

        _getMinIdx: function (ccIdx, tCols) {
            var i, j;
            i = j = tCols;
            if (ccIdx < tCols)
                return 0;
            while (i <= ccIdx) {
                j += tCols;
                if (j > ccIdx)
                    return i;
                i += tCols;
            }
        }
    };
})(jQuery, Syncfusion);