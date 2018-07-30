(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.filter = function (obj) {
        this.XLObj = obj;
        this._isSearchEdit = false;
        this._isDecimal = false;
        this._colName = "";
        this._colType = "";
        this._tableId = "";
    };

    ej.spreadsheetFeatures.filter.prototype = {
        //Filtering
        _renderExcelFilter: function () {
            var xlObj = this.XLObj, model = { instance: xlObj, showSortOptions: xlObj.model.allowSorting, maxFilterLimit: xlObj.model.sheets[xlObj.getActiveSheetIndex()].filterSettings.maxFilterChoices, filterHandler: ej.proxy(this._filterHandler, this), cancelHandler: ej.proxy(this._cancelHandler, this), customFilterHandler: ej.proxy(this._customFilterHandler, this), enableComplexBlankFilter: false, blankValue: "", interDeterminateState: true };
            xlObj._excelFilter = new ej.excelFilter(model);
            xlObj.element.append(ej.buildTag("div#" + xlObj._id + "_filter_custom.e-filterdlg" + ".e-" + xlObj._id + "-dlg", "", { display: 'none' }));
        },

        _customFilterHandler: function () {
            var xlObj = this.XLObj;
            if (this._isDecimal) {
                $("#" + xlObj._id + "number_CustomValue1").ejNumericTextbox("option", { decimalPlaces: 2 });
                $("#" + xlObj._id + "number_CustomValue2").ejNumericTextbox("option", { decimalPlaces: 2 });
            }
        },

        _renderFilterDialogs: function (type) {
            var xlObj = this.XLObj;
            if(document.getElementById(xlObj._id + "_filter_custom").className.indexOf("e-dialog") < 0)
                this._renderCustomFilter();
            xlObj._excelFilter.renderDialog(type);
            this._refreshCustomFilter(type);
            xlObj.element.find(".e-excelfilter.e-dlgcontainer").hide();
            $(document.body).append($("#" + xlObj._id + type + "_excelDlg"));
        },

        _createSelection: function (sheetIdx, startrowIndex, endrowIndex, colIndex, filteredIndex) {
            var xlObj = this.XLObj, usedRow = xlObj.getSheet(sheetIdx).usedRange.rowIndex, endRowIdx = endrowIndex, x = 0, isHide, value2;
            for (var i = endrowIndex; i <= usedRow; i++) {
                isHide = xlObj.XLEdit.getPropertyValue(i, x, "isHide");
                value2 = xlObj.XLEdit.getPropertyValue(i, colIndex, "value2", sheetIdx);
                if (xlObj.XLEdit.getPropertyValue(i, colIndex, "tableName", sheetIdx))
                    break;
                if ((!isHide && !xlObj.XLEdit.getPropertyValue(i, colIndex, "isMHide") && !value2) && i >= endrowIndex)
                    return { endRowIndex: i, filteredIndex: filteredIndex };
                else if (!isHide && value2) {
                    endRowIdx = i + 1;
                    filteredIndex.push(i);
                }
                else
                    endRowIdx = endRowIdx;
            }
            return { endRowIndex: endRowIdx, filteredIndex: filteredIndex };
        },

        _getSelectedRangeData: function (startCell, endCell, tableId, cellIndex) {
            var temp, xlObj = this.XLObj, x = 0, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), filteredRangeIndex = [], columnName, i, j, cellData,
                selCellColor = [], color, cells, celldatatemp, rangeData = [], container = xlObj._dataContainer, sheetData = container.sheets[sheetIdx], multiFltrIdx = xlObj.getSheet(sheetIdx)._multifilterIdx;
            if (tableId === -1)
                sheet.filterSettings.range = xlObj._generateHeaderText(multiFltrIdx[0] + 1) + startCell.rowIndex + ":" + xlObj._generateHeaderText(multiFltrIdx[multiFltrIdx.length - 1] + 1) + (endCell.rowIndex + 1);
            if (sheet._multipleFiltering)
                endCell.colIndex = sheet._multifilterIdx[sheet._multifilterIdx.length - 1];
            for (i = startCell.rowIndex; i <= endCell.rowIndex; i++) {
				temp = {};
				for (j = startCell.colIndex; j <= endCell.colIndex; j++) {
				    columnName = xlObj._generateHeaderText(j + 1);
				    if (i in sheetData) {
				        if (!(x in sheetData[i]) || (x in sheetData[i] && (ej.isNullOrUndefined(sheetData[i][x].isRHide) && ej.isNullOrUndefined(sheetData[i][x].isFHide)))) {
				            if (!(x in sheetData[i]) || (x in sheetData[i] && (ej.isNullOrUndefined(sheetData[i][x].isFilterHide) || (!ej.isNullOrUndefined(sheetData[i][x].isFilterHide) && sheetData[i][x].filterID === tableId)))) {
				                temp["idx"] = i;
				                if (i in sheetData && j in sheetData[i]) {
				                    cellData = sheetData[i][j];
				                    if (j === cellIndex) {
				                        color = xlObj.XLEdit.getPropertyValue(i, j, "formats");
				                        if (!ej.isNullOrUndefined(color)) {
				                            cells = { id: j, background: color["background-color"], foreground: color["color"] };
				                            selCellColor.push(cells);
				                        }
				                    }
				                    if (ej.isNullOrUndefined(container.sharedData[cellData.value]))
				                        temp[columnName] = ""; 
				                    else
				                        temp[columnName] = xlObj._isDateTime(container.sharedData[cellData.value]) ? cellData.value2 : container.sharedData[xlObj.isFormula(container.sharedData[cellData.value]) ? cellData.value2 : cellData.value];
				                }
				                else
				                    temp[columnName] = "";
				            }
				        }
				    }
				    if (!(i in sheetData) && i < endCell.rowIndex) {
				        temp["idx"] = i;
				        temp[columnName] = "";
				    }
                }
                if (xlObj.getObjectLength(temp) > 0) {
                    rangeData.push(temp);
                    filteredRangeIndex.push(i);
                }
            }
            sheet._selectedCellColors = selCellColor;
            sheet._selectedRange = { startRow: startCell.rowIndex, endRow: endCell.rowIndex, dataSourceIndexes: filteredRangeIndex };
            sheet.filterSettings.filteredRange = rangeData;
        },

        _getColumnType: function (sheetIdx, startRow, endRow, cellIndex) {
            var cellType = "string", value, type;
            for (var i = startRow; i < endRow; i++) {
                value = this.XLObj.XLEdit.getPropertyValue(i, cellIndex, "value", sheetIdx);
                type = this.XLObj.XLEdit.getPropertyValue(i, cellIndex, "type", sheetIdx);
                if (type == "text" || ( !$.isNumeric(value)) ) {
                    cellType = "string";
                    return cellType;
                }
                else {
                    if (!this._isDecimal)
                        this._isDecimal = ((value % 1) != 0);
                    cellType = "number";
                }
            }
            return cellType;
        },

        _getColumnByField: function (sheetIdx, field) {
            var xlObj = this.XLObj, column, sheet = xlObj.getSheet(sheetIdx);
            for (column = 0; column < sheet.columns.length; column++)
                if (sheet.columns[column]["field"] === field)
                    break;
            return column === sheet.columns.length ? null : sheet.columns[column];
        },

		_checkEmptyText: function (sheetIdx) {
            var xlObj = this.XLObj, selectedCell = xlObj.model.sheets[sheetIdx]._selectedCells;
            for (var i = 0, len = selectedCell.length; i < len; i++) {
                if (!ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(selectedCell[i].rowIndex, selectedCell[i].colIndex, "value", sheetIdx)))
                    return true;
            }
            xlObj._showAlertDlg("Alert", "Alert", null, 440);
            return false;
        },

        _getFilterIcon: function () {
            var filterIcon = ej.buildTag("span .e-icon", "", {});
            filterIcon.addClass("e-spanfilter e-filterspan e-ssfilter");
            return filterIcon;
        },

        filterByActiveCell: function () {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), value;
            if (!xlObj.model.allowFiltering || xlObj.model.isReadOnly)
                return;
                var activeCell = xlObj.model.sheets[sheetIdx]._activeCell, activeElem = xlObj.getCell(activeCell.rowIndex, activeCell.colIndex), selCells = xlObj.model.sheets[sheetIdx]._selectedCells;
                if (this._checkEmptyText(sheetIdx)) {
                    if (activeElem.find("span").is('.e-ssfiltered, .e-ssfilter, .e-ssfilter-asc, .e-ssfiltered-asc, .e-ssfilter-dsc, .e-ssfiltered-dsc'))
                        xlObj._showAlertDlg("Alert", "HeaderAlert", "", 440);
                    else {
                        value = xlObj.XLEdit.getPropertyValue(activeCell.rowIndex, activeCell.colIndex, "value", sheetIdx);
                        value = xlObj._isDateTime(value) ? xlObj.XLEdit.getPropertyValue(activeCell.rowIndex, activeCell.colIndex, "value2", sheetIdx) : value;
                        this._filterActiveCell(sheetIdx, activeCell, selCells, value);
                    }
                }
        },

        _filterActiveCell: function (sheetIdx, activeCell, selCells, value, range) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx);
            sheet._activeCell = activeCell;
            this._filterByValue(sheetIdx, range, sheet.columns[activeCell.colIndex].field, "or", "equal", value, selCells);
            xlObj.model.allowComments && xlObj.XLComment._updateCmntArrowPos();
        },

        _filterByValue: function (sheetIdx, range, columnName, pred, operator, value, selCells) {
            var xlObj = this.XLObj, selCells, rng, activeCell, filterColumn, fQMgr, query, obj, objectIndex = -1, i, len, fltrVal,
                arg = {}, tabRange, details, colIdx = xlObj.XLEdit.getColumnIndexByField(columnName), sheet = xlObj.getSheet(sheetIdx);
            if (ej.isNullOrUndefined(range))
                selCells = selCells;
            else {
                rng = xlObj.getRangeIndices(range);
                selCells = xlObj._getSelectedRange({ rowIndex: rng[0] + 1, colIndex: rng[1] }, { rowIndex: rng[2], colIndex: rng[3] });            }
            activeCell = selCells[0];
            if (!ej.isNullOrUndefined(range)) {
                fltrVal = xlObj.XLEdit.getPropertyValue(activeCell.rowIndex, activeCell.colIndex, "value2", sheetIdx);
                if (ej.isNullOrUndefined(fltrVal) || fltrVal !== value) {
                    for (i = rng[0]; i < rng[2]; i++) {
                        fltrVal = xlObj.XLEdit.getPropertyValue(i, colIdx, "value2", sheetIdx);
                        if (!ej.isNullOrUndefined(fltrVal) && fltrVal === value) {
                            activeCell = { rowIndex: i, colIndex: colIdx };
                            break;
                        }
                    }
                }
            }
            details = { currentFilteringColumn: columnName, action: "filter", predicated: pred, requestType: "filterbycell", reqType: "filter", filteredValue: value, selCells: $.extend(true, [], selCells), activeCell: activeCell };
            tabRange = this._applyFilterByValue(sheetIdx, activeCell, selCells, value);
            xlObj._excelFilter._predicates[sheetIdx] = {};
            filterColumn = { field: columnName, value: value, predicate: pred, operator: operator, matchcase: false };
            arg.currentFilterCollection = value;
            xlObj._excelFilter._predicates[sheetIdx][columnName] = ej.Predicate(columnName, operator, value);
            sheet.filterSettings.filteredColumns.push(filterColumn);
            fQMgr = ej.DataManager(sheet.filterSettings.filteredColumns);
            query = new ej.Query().where("field", ej.FilterOperators.equal, columnName);
            obj = fQMgr.executeLocal(query);
            for (i = 0, len = obj.length; i < len; i++) {
                objectIndex = $.inArray(obj[i], sheet.filterSettings.filteredColumns);
                (objectIndex > -1) && sheet.filterSettings.filteredColumns.splice(objectIndex, 1);
            }
            sheet.filterSettings.filteredColumns.push(filterColumn);
            details.filteredcolumns = tabRange.filteredColumns = sheet.filterSettings.filteredColumns;
            if (tabRange.filteredColumns.length < 1) {
                var multiIdx = tabRange.multifilterIdx, fieldName;
                for (var i = multiIdx[0]; i <= multiIdx[multiIdx.length - 1]; i++) {
                    fieldName = xlObj._generateHeaderText(i + 1);
                    if (!ej.isNullOrUndefined(tabRange.fColumns[fieldName]))
                        tabRange.fColumns[fieldName] = [];
                }
            }
            else
                tabRange.fColumns[columnName] = $.extend(true, [], tabRange.filteredColumns);
            tabRange.predicate = xlObj._excelFilter._predicates[sheetIdx];
            details.tableID = tabRange.tableID;
            details.filteredCells = tabRange.filteredCells;
            xlObj.XLSelection._refreshBorder();
            details.operation = "filterbycell";
            details.selRange = xlObj._getAlphaRange(sheetIdx, tabRange.startRow - 1, tabRange.multifilterIdx[0], tabRange.endRow, tabRange.multifilterIdx[tabRange.multifilterIdx.length - 1]);
            xlObj._processBindings(details) && (sheet.filterSettings.filteredColumns = temp);
        },

        _applyFilterByValue: function (sheetIdx, activeCell, selCells, value) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx), cellIndex = [], endCell, startRowIdx, endRowIdx, filterIcon, filtrIconsCol, tableID, actCellCls = xlObj.getCell(activeCell.rowIndex, activeCell.colIndex)[0].className,
                tab = sheet.filterSettings.tableRange, filteredCells = [], tabRange, tabIdx, exists = false, activeObj, i, j, len, isVirtualScroll = xlObj.model.scrollSettings.allowVirtualScrolling, filterColl = xlObj.getSheet(sheetIdx)._filterColl, filterCollObj;
            tableID = xlObj.XLEdit.getPropertyValue(activeCell.rowIndex, activeCell.colIndex, "tableName", sheetIdx);
            tableID = tableID ? xlObj._getTableID(tableID) : -1;
            for (i = 0, len = tab.length; i < len; i++) {
                if (tab[i].tableID === tableID) {
                    tabIdx = i;
                    break;
                }
            }
            if (!ej.isNullOrUndefined(tabIdx) && ((tab[tabIdx].tableID === tableID) && tab[tabIdx].selectedCellIndexes.indexOf(activeCell.colIndex) !== -1) && ((tab[i].startRow <= activeCell.rowIndex) && (tab[i].endRow >= activeCell.rowIndex))) {
                tabRange = tab[tabIdx];
                sheet.filterSettings.filteredRange = tab[tabIdx].filteredRange;
                sheet._selectedRange = tab[tabIdx].selectedRange;
				tabRange.action = "filtering";
            }
            else {
                sheet._multipleFiltering = false;
                sheet._multifilterIdx = [];
                xlObj._dupDetails = true;
                this.clearFilter("remove");
                xlObj._dupDetails = false;
                var rowKeys = xlObj.getObjectKeys(filterColl), colKeys, cell;
                for (i = rowKeys.length - 1; i >= 0; i--) {
                    colKeys = xlObj.getObjectKeys(filterColl[i]);
                    for (j = colKeys.length - 1; j >= 0; j--) {
                        if (xlObj._isRowViewable(sheetIdx, rowKeys[i])) {
                            cell = xlObj.getCell(rowKeys[i], colKeys[j]);
                            cell.find(".e-filterspan").remove();
                            cell.removeClass("e-filterhdr");
                        }
                        delete filterColl[rowKeys[i]][colKeys[j]];
                    }
                }
                if (selCells.length < 2 || (selCells[0].rowIndex === selCells[selCells.length - 1].rowIndex)) {
                    startRowIdx = -1;
                    endRowIdx = selCells[selCells.length - 1].rowIndex;
                    for (var i = selCells[0].rowIndex; i >= 0; i--) {
                        if (ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(i, selCells[0].colIndex, "value2"))) {
                            startRowIdx = i;
                            break;
                        }
                    }
                    startRowIdx = (startRowIdx === -1) ? 1 : startRowIdx + 2; // For text cell is act as a header
                    endRowIdx = this._createSelection(sheetIdx, startRowIdx, endRowIdx, selCells[0].colIndex, []).endRowIndex - 1;
                    endCell = { rowIndex: endRowIdx, colIndex: activeCell.colIndex };
                    this._getSelectedRangeData({ rowIndex: startRowIdx, colIndex: activeCell.colIndex }, endCell, -1, activeCell.colIndex);
                }
                else {
                    startRowIdx = activeCell.rowIndex;
                    endRowIdx = this._createSelection(sheetIdx, startRowIdx, selCells[selCells.length - 1].rowIndex, selCells[0].colIndex, []).endRowIndex - 1;
                    endCell = { rowIndex: endRowIdx, colIndex: activeCell.colIndex };
                    this._getSelectedRangeData({ rowIndex: startRowIdx, colIndex: activeCell.colIndex }, endCell, -1, activeCell.colIndex);
                }
                var fltrColl = xlObj.getSheet(sheetIdx)._filterColl;
                for (i = selCells[0].colIndex, len = selCells[selCells.length - 1].colIndex; i <= len; i++) {
                    cellIndex.push(i);
                    filterIcon = this._getFilterIcon();
                    startRowIdx = (startRowIdx === 0) ? 1 : startRowIdx;
                    activeObj = { rowIndex: startRowIdx - 1, colIndex: i };
                    this._applyFilterIcon(activeObj, filterIcon);
                    filteredCells.push(activeObj);
                }
                xlObj.XLScroll._getColWidths(sheetIdx, selCells[0].colIndex);
                (cellIndex.length > 1) && (sheet._multipleFiltering = true);
                sheet._multifilterIdx = cellIndex;
                sheet._selectedCellIndexes = cellIndex;
                for (i = 0, len = tab.length; i < len; i++) {
                    if (tab[i].tableID === tableID) {
                        tabIdx = i;
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    sheet.filterSettings.tableRange.push({ action: "filtering", filterCollection: [],
                        startRow: startRowIdx, endRow: endCell.rowIndex, tableID: -1, fColumns: {}, flterdIdxes: [], multiFiltering: sheet._multipleFiltering, multifilterIdx: sheet._multifilterIdx, selectedCellIndexes: sheet._multifilterIdx, selectedRange: $.extend(true, {}, sheet._selectedRange), filteredRange: sheet.filterSettings.filteredRange, hiddenIdx: []
                    });
                    tabRange = tab[tab.length - 1];
                }
                else {
                    tabRange = tab[tabIdx];
                    tabRange.startRow = activeCell.rowIndex;
                    tabRange.endRow = endCell.rowIndex;
                    tabRange.multiFiltering = sheet._multipleFiltering;
                    tabRange.multifilterIdx = sheet._multifilterIdx;
                    tabRange.selectedCellIndexes = sheet._multifilterIdx;
                    tabRange.selectedRange = $.extend(true, {}, sheet._selectedRange);
                    tabRange.filteredRange = $.extend(true, {}, sheet.filterSettings.filteredRange);
                    tabRange.hiddenIdx = [];
                    tabRange.flterdIdxes = [];
                    tabRange.fColumns = {};
                    tabRange.tableID = tableID;
                    tabRange.filterCollection = [];
					tabRange.action= "filtering";
                }
                tabRange.filteredCells = filteredCells;
            }
            return tabRange;
        },

        clearFilter: function (status) {
            var xlObj = this.XLObj;
            if (xlObj.model.isReadOnly)
                return;
            var isCleared = false, isFilterApplied = false, sheetIdx = xlObj.getActiveSheetIndex(), columnName, fltrdCol, sheet = xlObj.getSheet(sheetIdx), filterColl = $.extend(true, {}, sheet._filterColl), dupDetails = xlObj._dupDetails,
                selRange, tblRange = sheet.filterSettings.tableRange, tabIdx = -1, i, j, len, filterRange, filteredCells = [], container = xlObj._dataContainer.sheets[sheetIdx];
            var rowKey, colKey, rowKeys = xlObj.getObjectKeys(filterColl), colKeys, cell, filterCollection = [], fltrdRange = sheet.filterSettings.filteredRange, filteredCols = sheet.filterSettings.filteredColumns, range = sheet.filterSettings.range;
            if(!tblRange.length)
				return;
			for (i = 0; i < tblRange.length; i++) {
                if (tblRange[i].tableID === -1) {
                    tabIdx = i;
					isFilterApplied = true;
                    break;
                }
            }
			if(!isFilterApplied)
				return;
			selRange = tblRange[tabIdx].selectedRange;
			for (i = rowKeys.length - 1; i >= 0; i--) {
                colKeys = xlObj.getObjectKeys(filterColl[rowKeys[i]]);
                for (j = colKeys.length - 1; j >= 0; j--) {
					rowKey = parseInt(rowKeys[i]);
					colKey = parseInt(colKeys[j]);
                    if (ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(rowKey, colKey, "tableName", sheetIdx))) {
                        filteredCells.push({ rowIndex: rowKey, colIndex: colKey });
                        fltrdCol = filterColl[rowKeys[i]][colKeys[j]];
                        if (fltrdCol.status.indexOf("e-ssfiltered") > -1) {
                            columnName = xlObj.model.sheets[sheetIdx].columns[colKeys[j]].field;
							filterCollection.push({"fieldName": columnName, "filterCollection": tblRange[tabIdx].filterCollection, action: "filtering", tableID: -1, predicate : xlObj._excelFilter._predicates[sheetIdx][columnName]} );
                            delete xlObj._excelFilter._predicates[sheetIdx][columnName];
							xlObj._dupDetails = true;
                            this._clearFilterColumn(columnName, "", "", "Or", "", "", -1);
							xlObj._dupDetails = false;
                            isCleared = true;
                        }
                        if (status === "remove") {
                            delete filterColl[rowKeys[i]][colKeys[j]];
                            delete container[rowKeys[i]][colKeys[j]]["isFilterHeader"];
                            delete container[rowKeys[i]][colKeys[j]]["filterState"];
                            delete container[rowKeys[i]][colKeys[j]]["isFilterVisible"];
                            if(xlObj._isRowViewable(sheetIdx, rowKey)) {
                                cell = xlObj.getCell(rowKey, colKey);
                                $.isNumeric(xlObj.XLEdit.getPropertyValue(rowKey, colKey)) && cell.addClass(xlObj._rAlign);
                                cell.find(".e-filterspan").remove();
								xlObj.addClass(cell[0], "e-wrapword");
								if(xlObj.XLEdit.getPropertyValue(rowKey, colKey, "isFilterWrap"))
									xlObj.setWrapText("wrap", xlObj._getAlphaRange(sheetIdx, rowKey,colKey, rowKey, colKey));
                                xlObj._removeClass(cell[0], "e-filterhdr");
                            }
                        }
                    }
                }
            }
			if (status === "remove") {
			    xlObj._dupDetails = dupDetails;
			    sheet._filterColl = filterColl;
                (tabIdx > -1) && (filterRange = tblRange.splice(tabIdx, 1)[0]);
                xlObj.model.allowComments && xlObj.XLComment._updateCmntArrowPos();
                if (!xlObj._isUndoRedo && !xlObj._dupDetails) {
                    var details = { sheetIndex: sheetIdx, operation: "remove-filter", status: status, process: "apply-filter", filteredCells: filteredCells, requestType: "filter", reqType: "filter", fRange: xlObj.getSheet(sheetIdx).filterSettings.range, filterRange: filterRange, filterCollection: filterCollection, filteredCols : filteredCols, fltrdRange: fltrdRange, selRange: selRange};
                    xlObj._completeAction(details);
                    xlObj._trigActionComplete(details);
                }
            }
            if (isCleared) {
                $("#" + xlObj._id + "_Ribbon_Data_SortFilter_ClearFilter").ejButton("disable");
            }
        },

        filter: function (range) {
            var xlObj = this.XLObj;
            if (!xlObj.model.allowFiltering || xlObj.model.isReadOnly)
                return;
                var sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), applyFltr = false, activeCell = sheet._activeCell, tableId, colIdx,
					tabRange = sheet.filterSettings.tableRange, tabIdx, i, len, stRow, fltrStr, args;
                sheet._multipleFiltering = false;
                sheet._multifilterIdx = [];
                tableId = xlObj.XLEdit.getPropertyValue(activeCell.rowIndex, activeCell.colIndex, "tableName", sheetIdx);
				if (!ej.isNullOrUndefined(tableId))
					tableId = xlObj._getTableID(tableId);
                for (i = 0, len = tabRange.length; i < len; i++) {
                    if (tabRange[i].tableID === -1)
                        applyFltr = true;
                    tabIdx = i;
                }
                args = { range: xlObj._getRangeArgs(range, "string"), reqType: ej.Spreadsheet.Actions.Filtering, sheetIndex: sheetIdx };
                if (xlObj._trigActionBegin(args))
                    return true;
                range = args.range;
                if (applyFltr) {
                    this.clearFilter("remove");
                    sheet.filterSettings.filteredRange = [];
                    sheet._selectedRange = {};
                    sheet._selectedCellIndexes = [];
                    sheet.filterSettings.filteredColumns = [];
                    xlObj._excelFilter._predicates[sheetIdx] = {};
                }
                if (!ej.isNullOrUndefined(tableId) && tableId > -1) {
                    stRow = tabRange[tabIdx].startRow;
                    colIdx = tabRange[tabIdx].multifilterIdx;
                    for (i = 0, len = colIdx.length; i < len; i++) {
                        fltrStr = this._getFilterHeader(sheetIdx, stRow, colIdx[i]);
                        if (!ej.isNullOrUndefined(fltrStr) && fltrStr.status.indexOf("e-ssfiltered") > -1)
                            this._clearFilterColumn(sheet.columns[i].field, "", "", "", "", "", tableId);
                    }
                    this._clearFilterTableIcon(sheetIdx, tableId);
                    applyFltr = true;
                }
                if (applyFltr) {
                    args = { sheetIdx: sheetIdx, reqType: "clear-Filter" };
                    if (xlObj._trigActionComplete(args))
                        return;
                }
                else
                    this._filterCellRange(sheetIdx, range);
                xlObj._isFiltered = !applyFltr;
                xlObj.model.allowComments && xlObj.XLComment._updateCmntArrowPos();
        },

        _applyFilterIcon: function (activeObj, filterIcon) {
            var activeEle, xlObj = this.XLObj, ralign = this.XLObj._rAlign, sheetIdx = xlObj.getActiveSheetIndex(), rowIdx = activeObj.rowIndex, colIdx = activeObj.colIndex, sheet = xlObj.getSheet(sheetIdx),
			    isViewed = xlObj._isRowViewable(sheetIdx, rowIdx), filterColl = sheet._filterColl, isWrap = false;
			if (isViewed) {
                activeEle = xlObj.getCell(rowIdx, colIdx, sheetIdx);
                activeEle[0].insertBefore(filterIcon[0], activeEle[0].childNodes[activeEle[0].childNodes.length - 1]);
				activeEle.addClass("e-filterhdr");
                activeEle.removeClass("e-ralign");
            }
			if(xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "wrap", sheetIdx)) {
				isWrap = true;
				xlObj.setWrapText("unwrap", xlObj._getAlphaRange(sheetIdx, rowIdx,colIdx, rowIdx, colIdx));
            }
			xlObj.XLEdit._updateDataContainer({ rowIndex: rowIdx, colIndex: colIdx }, { dataObj: { isFilterHeader: true, filterState: "filter", isFilterVisible: true, isFilterWrap: isWrap }, sheetIdx: sheetIdx })
            if (xlObj.isNumber(xlObj.model.allowFiltering && xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "value2", sheetIdx)))
                isViewed && xlObj._removeClass(activeEle[0], ralign);
            if (!(rowIdx in filterColl))
                filterColl[rowIdx] = {};
            if (!(colIdx in filterColl[rowIdx]))
                filterColl[rowIdx][colIdx] = {};
            filterColl[rowIdx][colIdx].status = "e-ssfilter";
            filterColl[rowIdx][colIdx].isTable = (filterIcon[0].className.indexOf("e-ft") > -1);
        },

        _postionFilterIcon: function (activeElem, filterIcon) {
            var xlObj = this.XLObj, actCell = activeElem || xlObj.getActiveCellElem(), fltrIcon = filterIcon || actCell.find(".e-filterspan"), contWidth, contHeight,
                cellIdx = xlObj._getCellIdx(actCell[0]);
            if (xlObj.model.allowResizing) {
                contWidth = xlObj.XLResize._getContentWidth(cellIdx.colIndex, xlObj.getActiveSheetIndex(), cellIdx.rowIndex, cellIdx.rowIndex);
                contHeight = xlObj.XLResize._getContentHeight(cellIdx.rowIndex, xlObj.getActiveSheetIndex());
            }
            //fltrIcon.css("margin-top", (xlObj._hasClass(actCell[0], "e-sswraptext") && contWidth > actCell.width()) ? Math.floor(contHeight - 25) : ""); //25px - filter span height + padding
        },

        _filterCellRange: function (sheetIdx, range) {
            var xlObj = this.XLObj, selCells, addFilter = false, exists, tableIdx, tableRange, isVisible, cellIndex = [], rowIconIdx = -1, selFilterPosn = false, colCount = 0,
                filterIcon, i, j, k, len, ln, rng, startCell, endCell, tabRange, sheet = xlObj.getSheet(sheetIdx), filteredRangeIndex = [], isSingleCell = false, pCells,
                filterCellIndex = [], filteredCells = [], isEmpty = false, details = { sheetIndex: sheetIdx, reqType: "filter", operation: "apply-filter" };
            if (ej.isNullOrUndefined(range)) {
                if (!xlObj.model.allowSelection)
                    return;
                selCells = sheet._selectedCells;
            }
            else {
                rng = xlObj.getRangeIndices(range);
                selCells = xlObj._getSelectedRange({ rowIndex: rng[0], colIndex: rng[1] }, { rowIndex: rng[2], colIndex: rng[3] });
            }
            if (selCells.length < 2) {
                pCells = selCells;
                !ej.isNullOrUndefined(range) && xlObj.performSelection(range, sheetIdx);
                xlObj.selectAll(false);
                selCells = sheet._selectedCells;
                isSingleCell = true;                
            }
			xlObj.XLRibbon._dirtySelect();
			if (xlObj.XLRibbon._isDirtySelect || selCells.length == 0)
				return;
            for (i = selCells[0].colIndex, len = selCells[selCells.length - 1].colIndex; i <= len ; i++) {
                cellIndex.push(i);
                rowIconIdx = selCells[0].rowIndex;
                if (isSingleCell) {
                    if (!sheet._isSheetSelected) {
                        filterCellIndex.push(i);
                        sheet._multifilterIdx.push(i);
                        addFilter = true;
                    }
                }
                else {
                    if (!selFilterPosn || cellIndex.length > 0)
                        for (j = rowIconIdx, ln = selCells[selCells.length - 1].rowIndex; j <= ln; j++) {
                            isVisible = xlObj._isRowVisible(sheetIdx, j);
                            if (isVisible) {
                                if (xlObj.XLEdit.getPropertyValue(j, i, "value2", sheetIdx) || (filterCellIndex.length && xlObj.XLEdit.getPropertyValue(0, i, "isCHide", sheetIdx))) {
                                    if (rowIconIdx === -1 || rowIconIdx > j)
                                        rowIconIdx = j;
                                    selFilterPosn = true;
                                    addFilter = true;
                                    isEmpty = true;
                                }
                            }
                            (rowIconIdx < j && colCount === 0) && filteredRangeIndex.push(j);
                        }
                    if (isEmpty) {
                        filterCellIndex.push(i);
                        sheet._multifilterIdx.push(i);
                        isEmpty = false;
                    }
                }
                colCount++;
            }
            (filterCellIndex.length > 1) && (sheet._multipleFiltering = true);
            filteredCells = [];
            if (addFilter) {
                for (i = 0, len = filterCellIndex.length; i < len; i++) {
                    filterIcon = this._getFilterIcon();
                    this._applyFilterIcon({ rowIndex: rowIconIdx, colIndex: filterCellIndex[i] }, filterIcon);
                    filteredCells.push({ rowIndex: rowIconIdx, colIndex: filterCellIndex[i] });
                }
                startCell = { rowIndex: rowIconIdx + 1, colIndex: selCells[0].colIndex };
                endCell = { rowIndex: selCells[selCells.length - 1].rowIndex };
                sheet._selectedRange = { startRow: startCell.rowIndex, endRow: endCell.rowIndex, dataSourceIndexes: filteredRangeIndex };
                this._getSelectedRangeData(startCell, selCells[selCells.length - 1], -1, startCell.colIndex);
                sheet._selectedCellIndexes = cellIndex;
                details = {
                    sheetIndex: sheetIdx,
                    filteredCells: filteredCells,
                    reqType: "filter",
                    operation: "apply-filter",
                    tableID: -1
                }
                tableRange = sheet.filterSettings.tableRange;
                for (i = 0, len = tableRange.length; i < len; i++) {
                    if (tableRange[i].tableID === -1) {
                        exists = true;
                        tableIdx = i;
                    }
                }
                if (!exists)
                    sheet.filterSettings.tableRange.push({ filterCollection: [], startRow: startCell.rowIndex, endRow: endCell.rowIndex, tableID: -1, multiFiltering: sheet._multipleFiltering, multifilterIdx: sheet._multifilterIdx, selectedCellIndexes: sheet._multifilterIdx, selectedRange: sheet._selectedRange, filteredRange: sheet.filterSettings.filteredRange, filteredColumns: sheet.filterSettings.filteredColumns, fColumns: {}, predicate: {}, hiddenIdx: [], fltrdIdxes: [], filterColumnName: [] });
                else {
                    tabRange = sheet.filterSettings.tableRange[tableIdx];
                    tabRange.startRow = startCell.rowIndex;
                    tabRange.endRow = endCell.rowIndex;
                    tabRange.multiFiltering = sheet._multipleFiltering;
                    tabRange.multifilterIdx = sheet._multifilterIdx;
                    tabRange.selectedCellIndexes = sheet._multifilterIdx;
                    tabRange.selectedRange = sheet._selectedRange;
                    tabRange.filteredRange = sheet.filterSettings.filteredRange;
                    tabRange.filteredColumns = sheet.filterSettings.filteredColumns;
                    tabRange.predicate = xlObj._excelFilter._predicates[sheetIdx];
                    tabRange.hiddenIdx = [];
                    tabRange.flterdIdxes = [];
                    tabRange.fColumns = {};
                    tabRange.filterColumnName = [];
                    tabRange.filterCollection = [];
                }
                xlObj.XLScroll._getColWidths(sheetIdx, sheet._multifilterIdx[0]);
                if ((!sheet._isImported || sheet._isLoaded)&& !xlObj._isExport) {
                    if (pCells)
                        range = [pCells[0].rowIndex, pCells[0].colIndex, pCells[pCells.length - 1].rowIndex, pCells[pCells.length - 1].colIndex];
                    else if (xlObj.isUndefined(range))
                        range = [selCells[0].rowIndex, selCells[0].colIndex, selCells[selCells.length - 1].rowIndex, selCells[selCells.length - 1].colIndex];
                    else
                        range = xlObj.getRangeIndices(range);
                    xlObj._completeAction(details);
                    xlObj._trigActionComplete(details);
					!ej.isNullOrUndefined(range) && xlObj.performSelection(range, sheetIdx);
                }
            }
            else
                xlObj._showAlertDlg("Alert", "Alert", "", 440);

        },
      
        openFilterDialog: function (range) {
            var filterSpan, xlObj = this.XLObj;
            if (xlObj.model.isReadOnly)
                return;
            if (typeof (range) === "string")
                range = xlObj.getRangeIndices(range);
            filterSpan = xlObj.getCell(range[0], range[1]).find('span.e-filterspan');
            (filterSpan.length > 0) && this._filterClickHandler({ target: filterSpan[0] });
        },

        _filterClickHandler: function (e) {
            var xlObj = this.XLObj, trgtCell, isTable, $target = $(e.target), sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), isFiltered = false, endRowIdx, columnName, columns, colType, i, len, startIdx, endIdx, curIdx,
                actCell, fltrVal, tableId, selectedRange, tableRange, tableFilteredColumn = [], tablePredicate = {}, position, startCell, endCell, tabIdx, selection, isVirtualScroll = xlObj.model.scrollSettings.allowVirtualScrolling, trgtPos = $(e.target).position(), shtPos = xlObj.getSheetElement(sheetIdx).find('.e-spreadsheetcontentcontainer').position(), strMenuObj, numMenuObj, oper = ["showItems", "hideItems"];
            columnName = xlObj._generateHeaderText(e.target.parentNode.cellIndex + 1);
            this._isDecimal = false;
            if ((xlObj.model.allowLockCell && xlObj.getSheet(sheetIdx).isSheetProtected) || xlObj.preventFilterPopup)
                return;
            ($target[0].className.indexOf("e-ssfiltered") > -1) && (isFiltered = true);
            curIdx = e.target.parentNode.cellIndex;
            if ($target[0].className.indexOf("e-ssfilter") > -1) {
                tableRange = xlObj.model.sheets[sheetIdx].filterSettings.tableRange;
				trgtCell = xlObj._getCellIdx($target.parent()[0]);
				isTable = xlObj.XLEdit.getPropertyValue(trgtCell.rowIndex, trgtCell.colIndex, "tableName");
				tableId = (!ej.isNullOrUndefined(isTable)) ? parseInt(isTable.replace("e-table","")) : -1;
                for (i = 0, len = tableRange.length; i < len; i++) {
                    if (tableRange[i].tableID === tableId) {
                        tabIdx = i;
                        if (tableRange[i].multiFiltering) {
                            startIdx = tableRange[i].multifilterIdx[0];
                            endIdx = tableRange[i].multifilterIdx[tableRange[i].multifilterIdx.length - 1];
                        }
                        else
                            startIdx = endIdx = e.target.parentNode.cellIndex;
                        startCell = { rowIndex: tableRange[i].startRow, colIndex: startIdx };
                        endCell = { rowIndex: tableRange[i].endRow, colIndex: endIdx };
                        sheet._multipleFiltering = tableRange[i].multiFiltering;
                        sheet._multifilterIdx = tableRange[i].multifilterIdx;
                        selectedRange = sheet._selectedRange = tableRange[i].selectedRange;
                        sheet.filterSettings.filteredRange = tableRange[i].filteredRange;
                        sheet._selectedCellIndexes = tableRange[i].selectedCellIndexes;
                    }
                }
                if (tableId === -1) {
                    selection = this._createSelection(sheetIdx, selectedRange.startRow, selectedRange.endRow, curIdx, selectedRange.dataSourceIndexes);
                    endRowIdx = (selection.endRowIndex > selectedRange.endRow) ? selection.endRowIndex - 1 : selection.endRowIndex;
                    if (selectedRange.endRow != endRowIdx) {
                        for (var i = selectedRange.endRow + 1; i <= endRowIdx; i++) {
                            fltrVal = { field: columnName, value: xlObj.XLEdit.getPropertyValue(i, curIdx, "value2", sheetIdx), matchcase: false, operator: "equal", predicate: "or" };
                            sheet.filterSettings.filteredColumns.push(fltrVal);
                            tableRange[tabIdx].filteredColumns.push(fltrVal);
                            tableRange[tabIdx].selectedRange.endRow = endRowIdx;
                        }
                    }
                    endCell = { rowIndex: endRowIdx, colIndex: curIdx };
                    tableRange[tabIdx].selectedRange = sheet._selectedRange = { startRow: startCell.rowIndex, endRow: endCell.rowIndex, dataSourceIndexes: selection.filteredIndex };
                    tableRange[tabIdx].endRow = endRowIdx;
                }
                this._getSelectedRangeData(startCell, endCell, tableId, curIdx);
                columns = sheet.columns;
                colType = this._getColumnType(sheetIdx, selectedRange.startRow, selectedRange.endRow, curIdx);
                for (i = 0, len = columns.length; i < len; i++) {
                    if (columns[i].field === columnName) {
                        xlObj._$colType = colType;
                        xlObj._$curFieldName = columns[i].field;
                        break;
                    }
                }
                xlObj._showDialog(xlObj._id + "_Filter", xlObj._$colType);
                position = xlObj._getXYPos($target, $("#" + xlObj._id + xlObj._$colType + "_excelDlg"), 18, 18); // 18 for filter Icons
                tableRange = xlObj.model.sheets[sheetIdx].filterSettings.tableRange;
                for (i = 0, len = tableRange.length; i < len; i++) {
                    if (tableRange[i].tableID === tableId) {
                        tableFilteredColumn = tableRange[i].filteredColumns;
                        tablePredicate = tableRange[i].predicate;
                    }
                }
                xlObj._excelFilter._predicates[sheetIdx] = tablePredicate;
                this._isSearchEdit = true;
                $.extend(true, xlObj._excelFilter._columnsFiltered, sheet._filteredColumns);
                if (xlObj._phoneMode || xlObj._tabMode)
                    this._openNormalFilterDlg(columnName, xlObj._$colType, tableId, tabIdx);
                else
                    xlObj._excelFilter.openXFDialog({ field: columnName, dataSource: sheet.filterSettings.filteredRange ? sheet.filterSettings.filteredRange : sheet.dataSource, position: { X: position.xPos, Y: position.yPos }, type: xlObj._$colType, format: xlObj._$colFormat, filteredColumns: tableFilteredColumn, sortedColumns: [], key: sheetIdx, tableID: tableId, selectedColors: sheet._selectedCellColors, isFiltered: isFiltered, blank: "", enableColor: true, filteredByColor: sheet._filteredByColor });
            }
			strMenuObj = $("#" + xlObj._id + "string_MenuItem").data("ejMenu");
			numMenuObj = $("#" + xlObj._id + "number_MenuItem").data("ejMenu");
			strMenuObj && strMenuObj[xlObj.model.allowSorting ? oper[0] : oper[1]](strMenuObj.element.find("li:lt(4)"));
			numMenuObj && numMenuObj[xlObj.model.allowSorting ? oper[0] : oper[1]](numMenuObj.element.find("li:lt(4)"));			
        },

        _cancelHandler: function () {
            this._isSearchEdit = false;
        },

        applyFilter: function (args) {
            var xlObj = this.XLObj, predicate = args.predicate || ej.Predicate(args.field, args.operator, args.value, !args.matchcase), tablePredicate, tableRange, fColl = [], sheetIdx = xlObj.getActiveSheetIndex(), i, field;
            tableRange = xlObj.model.sheets[sheetIdx].filterSettings.tableRange;
            !xlObj._isFiltered && xlObj.XLFilter.filter(args.filterRange);
            if (ej.isNullOrUndefined(xlObj._excelFilter._predicates[sheetIdx])) {
                xlObj._excelFilter._predicates[sheetIdx] = {};
                xlObj._excelFilter._predicates[sheetIdx][args.field] = {};
            }
            xlObj._excelFilter._predicates[sheetIdx][args.field] = predicate;
            if (args.filterCollection)
                fColl = args.filterCollection;
            else
                fColl.push({ actualFilterOperator: args.operator, actualFilterValue: args.value, actualPredicate: args.predicate, field: args.field, isCustom: true, matchcase: args.matchcase, operator: args.operator, predicate: args.predicate, value: args.value });
            this._filterHandler({ action: "filtering", fieldName: args.field, tableID: args.tableID || -1, ejpredicate: predicate, filterCollection: fColl });
        },


        _filterHandler: function (args) {
			if(args.originalEvent) {
				var clName = args.originalEvent.target.parentElement.className;
				if(clName && clName.indexOf("hdr") > -1)
					return;
			}
			var i, len, tab, startRow, avble = false, tabIdx = -1, colIdx, range, arg = {}, fQMgr, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), query, obj, objectIndex, filterObj, tableFilteredColumn = [], tablePredicate = {}, cell, isSelAllChkBox, isSrchVal;
            arg.requestType = (args.action === "sorting" || args.action === "filterbycolor") ? args.action : "filtering";
            tab = sheet.filterSettings.tableRange;
            
            xlObj.XLFilter._isSearchEdit = false;
            for (i = 0, len = tab.length; i < len; i++) {
                if (tab[i].tableID === args.tableID) {
                    $.extend(true, tableFilteredColumn, tab[i].filteredColumns);
                    tablePredicate = tab[i].predicate;
                    avble = true;
                    tabIdx = i;
                }
            }
            if (args.action === "clearfiltering" && args.reqType === "filterbycolor")
                arg.requestType = tab[tabIdx].action;
            arg.tableID = args.tableID;
            if (args.action === "filtering" || args.action === "clearfiltering") {
				arg.rowIndex = tab[tabIdx].startRow - 1;
				arg.colIndex = xlObj._generateColCount(args.fieldName) - 1;
                fQMgr = ej.DataManager(tableFilteredColumn);
                query = new ej.Query().where("field", ej.FilterOperators.equal, args.fieldName);
                obj = fQMgr.executeLocal(query);
                arg.filteredColumns = tableFilteredColumn;
                for (i = 0, len = obj.length; i < len; i++) {
                    objectIndex = $.inArray(obj[i], tableFilteredColumn);
                    (objectIndex >= 0) && tableFilteredColumn.splice(objectIndex, 1);
                }
                if (args.action === "clearfiltering")
                    delete xlObj._excelFilter._predicates[sheetIdx][args.fieldName];
                else
                    ej.merge(tableFilteredColumn, args.filterCollection);
                tablePredicate = xlObj._excelFilter._predicates[sheetIdx];
            }
            if (avble) {
                tab[tabIdx].filteredColumns = tableFilteredColumn;
                tab[tabIdx].filterCollection = args.filterCollection;
                tab[tabIdx].predicate = tablePredicate;
                tab[tabIdx].action = args.action;
                if (tableFilteredColumn.length < 1) {
                    var multiIdx = tab[tabIdx].multifilterIdx, fieldName;
                    for (var i = multiIdx[0]; i <= multiIdx[multiIdx.length - 1]; i++) {
                        fieldName = xlObj._generateHeaderText(i + 1);
                        if (!ej.isNullOrUndefined(tab[tabIdx].fColumns[fieldName]))
                            tab[tabIdx].fColumns[fieldName] = [];
                    }
                }
                else
                    tab[tabIdx].fColumns[args.fieldName] = $.extend(true, [], tableFilteredColumn);
            }
			range = sheet.filterSettings.tableRange[tabIdx].selectedRange;
            var colIndexs = sheet.filterSettings.tableRange[tabIdx].selectedCellIndexes, filterColl = sheet._filterColl;
            if (args.action === "filtering" || args.action === "clearfiltering") {
                arg.currentFilteringColumn = args.fieldName;
                arg.ejpredicate = args.ejpredicate;
                arg.filterCollection = $.extend(true, [], args.filterCollection);
                arg.action = args.action;
                if (arg.requestType === "filterbycolor")
                    arg.reqType = arg.requestType;
                else
                    arg.reqType = "filter";
                arg.sheetIndex = sheetIdx;
                arg.filteredcolumns = tableFilteredColumn;
                arg.predicate = tablePredicate;
            }
            else if (args.action === "sorting") {
                if (!xlObj.model.allowSorting)
                    return;
                arg.requestType = arg.action = args.action;
                colIdx = xlObj.XLEdit.getColumnIndexByField(args.sortDetails.field);
                xlObj.XLSort._isSortByFilter = true;
				if(xlObj.XLSort.sortByRange(xlObj.swapRange([range.startRow, colIndexs[0], range.endRow, colIndexs[colIndexs.length - 1]]), args.sortDetails.field, args.sortDetails.direction, args.tableID))
					return;
                this._changeSortIcon({ rowIndex: range.startRow - 1, colIndex: colIdx }, args.sortDetails.direction);
                for (var i = 0, len = colIndexs.length; i < len; i++) {
                    if (colIndexs[i] != colIdx && ((filterColl[range.startRow - 1][colIndexs[i]].status.indexOf("-asc") > -1) || (filterColl[range.startRow - 1][colIndexs[i]].status.indexOf("-dsc") > -1))) {
                        filterColl[range.startRow - 1][colIndexs[i]].status = "e-ssfilter";
                        if (xlObj._isRowViewable(sheetIdx, range.startRow - 1)) {
                            cell = xlObj.getCell(range.startRow - 1, colIndexs[i]).find('.e-filterspan')[0];
                            xlObj._removeClass(cell, "e-ssfilter-asc");
                            xlObj._removeClass(cell, "e-ssfilter-dsc");
                            xlObj.addClass(cell, "e-ssfilter");
                        }
                    }
                }
            }
            else {
                arg.requestType = arg.action = args.action;
                arg.range = sheet._selectedRange;
				if(xlObj.model.allowSorting && xlObj.XLSort._sortRangeAlert([range.startRow, colIndexs[0], range.endRow, colIndexs[colIndexs.length - 1]]))
					return;
                var colors;
                if (args.action === "sortbycolor") {
                    arg.sortColumn = args.sortDetails.field;
                    arg.operation = args.sortDetails.operation;
                    colors = args.sortDetails.color.replace("rgb(", "").replace(")", "").split(",");
                }
                else {
                    if (xlObj._isUndoRedo) {
                        arg.filterColumn = args.columnName;
                        arg.operation = args.operation;
                    }
                    else {
                        arg.filterColumn = args.filterDetails.field;
                        arg.operation = args.filterDetails.operation;
                        colors = args.filterDetails.color.replace("rgb(", "").replace(")", "").split(",");
                    }
                    arg.tableID = args.tableID;
                    xlObj.model.sheets[sheetIdx]._filteredByColor = arg.filterColumn;
                }
                var r, g, b;
                if (!xlObj._isUndoRedo) {
                    r = colors[0];
                    g = colors[1];
                    b = colors[2];
                }
                if (arg.operation === "sortbgcolor" || arg.operation === "filterbgcolor")
                    arg.bgcolor = xlObj._isUndoRedo ? args.bgcolor : this._convertrgbtohex(parseInt(r), parseInt(g), parseInt(b));
                else
                    arg.fgcolor = xlObj._isUndoRedo ? args.fgcolor : this._convertrgbtohex(parseInt(r), parseInt(g), parseInt(b));
            }
            arg.oprType = "filter";
            arg.selRange = xlObj._getAlphaRange(sheetIdx, tab[tabIdx].startRow - 1, tab[tabIdx].multifilterIdx[0], tab[tabIdx].endRow, tab[tabIdx].multifilterIdx[tab[tabIdx].multifilterIdx.length - 1]);
            if (args.action !== "sorting")
                xlObj._processBindings(arg) && (tableFilteredColumn = temp);
            if (args.action === "clearfiltering")
                xlObj.XLRibbon._isFilterSelect.status = false;
            xlObj.model.allowComments && xlObj.XLComment._updateCmntArrowPos();
            xlObj.model.allowSelection && xlObj.XLSelection._refreshBorder();
			if(xlObj.model.showRibbon)
				xlObj.XLRibbon._refreshRibbonIcons();
			if (xlObj._isFrozen(xlObj.getFrozenRows()))
			    xlObj.XLFreeze._refreshFreezeRowDiv();
        },

        _convertrgbtohex: function (r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },

        _clearFilterColumn: function (fieldName, filterOperator, filterValue, predicate, matchcase, actualFilterValue, tableId) {
            var xlObj = this.XLObj, tabRange, args = {}, i, len, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), firstLoop = false, filterObject = {}, dataManger, query, obj, objectIndex,
                tab = sheet.filterSettings.tableRange, filteredcolumns = [], fltrcolIdx;
            args.requestType = ej.Grid.Actions.Filtering;
            args.currentFilterObject = [];
            (!Array.isArray(filterOperator)) && (filterOperator = $.makeArray(filterOperator));
            (!Array.isArray(filterValue)) && (filterValue = $.makeArray(filterValue));
            this._currentFilterColumn = this._getColumnByField(sheetIdx, fieldName);
            for (var idx = 0, ln = filterOperator.length; idx < ln; idx++) {
                filterObject = { field: fieldName, operator: filterOperator[idx], value: filterValue[idx], matchcase: matchcase, predicate: predicate, actualFilterValue: actualFilterValue };
                if (!firstLoop) {
                    for (i = 0, len = tab.length; i < len; i++) {
                        if (tab[i].tableID === tableId) {
                            tabRange = tab[i];
                            $.extend(true, filteredcolumns, tab[i].filteredColumns);
                            xlObj._excelFilter._predicates[sheetIdx] = tab[i].predicate;
                            sheet.filterSettings.filteredRange = sheet.filterSettings.tableRange[i].filteredRange;
                            sheet._selectedCellIndexes = tab[i].selectedCellIndexes;
                            sheet._selectedRange = tab[i].selectedRange;
                            sheet._multifilterIdx = tab[i].multifilterIdx;
                        }
                    }
                    dataManger = ej.DataManager(filteredcolumns);
                    query = new ej.Query().where("field", ej.FilterOperators.equal, filterObject.field);
                    obj = dataManger.executeLocal(query);
                    for (i = 0, len = obj.length; i < len; i++) {
                        objectIndex = $.inArray(obj[i], filteredcolumns);
                        if (objectIndex !== -1)
                            filteredcolumns.splice(objectIndex, 1);
                    }
                }
            }
            fltrcolIdx = $.inArray(fieldName, sheet._filteredColumns);
            if (fltrcolIdx > -1)
                sheet._filteredColumns.splice(fltrcolIdx, 1);
            if (xlObj._isUndoRedo && xlObj.isUndefined(tabRange))
                return;
            firstLoop = true;
            delete xlObj._excelFilter._predicates[sheetIdx][fieldName];
            tabRange.filteredColumns = filteredcolumns;
            tabRange.predicate = xlObj._excelFilter._predicates[sheetIdx];
            args.currentFilterObject.push(filterObject);
            args.filterCollection = filteredcolumns;
            args.currentFilteringColumn = fieldName;
            args.filteredcolumns = filteredcolumns;
            args.action = "clearfiltering";
            args.reqType = "filter";
            args.tableID = tableId;
            args.selRange = xlObj._getAlphaRange(sheetIdx, tabRange.startRow - 1, tabRange.multifilterIdx[0], tabRange.endRow, tabRange.multifilterIdx[tabRange.multifilterIdx.length - 1]);
            if (xlObj._processBindings(args)) {
                sheet.filterSettings.filteredColumns.reverse().splice(0, filterOperator.length);
                sheet.filterSettings.filteredColumns.reverse();
            }
            xlObj.model.allowComments && xlObj.XLComment._updateCmntArrowPos();
            xlObj.model.allowSelection && xlObj.XLSelection._refreshBorder();
        },

        _getFilterHeader: function (sheetIdx, rowIdx, colIdx) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx), filterColl = sheet._filterColl;
            if (!ej.isNullOrUndefined(filterColl[rowIdx]) && !ej.isNullOrUndefined(filterColl[rowIdx][colIdx]))
                return filterColl[rowIdx][colIdx];
        },

        //Format As Table
        _filterTable: function (sheetIdx, id, range) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx), cellIndex = [], alfltr = false, multiFltr = false, tabRange, filterIcon, filClass,
                filterHdr;
            sheet._multipleFiltering = false;
            sheet._multifilterIdx = [];
            var endCell = range ? range.endCell : $.extend(true, {}, sheet._endCell), startCell = range ? range.startCell : $.extend(true, {}, sheet._startCell);
            for (var i = startCell.colIndex; i <= endCell.colIndex; i++) {
                filterHdr = this._getFilterHeader(sheetIdx, startCell.rowIndex, i);
                if (!ej.isNullOrUndefined(filterHdr) && filterHdr.status.indexOf("e-ssfilter") > -1)
                    alfltr = true;
                else {
                    filterIcon = this._getFilterIcon();
                    filClass = "e-ft" + id;
                    filterIcon.addClass(filClass);
                    this._applyFilterIcon({ rowIndex: startCell.rowIndex, colIndex: i }, filterIcon);
                    cellIndex.push(i);
                    sheet._multifilterIdx.push(i);
                }
            }
            xlObj.XLScroll._getColWidths(sheetIdx, startCell.colIndex);
            if (!alfltr) {
                if (cellIndex.length > 1) {
                    sheet._multipleFiltering = true;
                    multiFltr = true;
                }
                startCell.rowIndex = startCell.rowIndex + 1;
                this._getSelectedRangeData(startCell, endCell, id, startCell.colIndex);
                if (!xlObj._isFATResize)
                    sheet.filterSettings.tableRange.push({filterCollection: [], startRow: startCell.rowIndex, endRow: endCell.rowIndex, tableID: id, multiFiltering: multiFltr, multifilterIdx: cellIndex, selectedCellIndexes: cellIndex, selectedRange: $.extend(true, {}, sheet._selectedRange), filteredRange: sheet.filterSettings.filteredRange, filteredColumns: sheet.filterSettings.filteredColumns, fColumns: {}, predicate: {}, hiddenIdx: [], filterColumnName:[] });
                else {
                    tabRange = sheet.filterSettings.tableRange;
                    if (tabRange.length)
                        for (var i = 0, len = tabRange.length; i < len; i++) {
                            if (tabRange[i].tableID === id) {
                                tabRange[i].endRow = endCell.rowIndex;
                                break;
                            }
                        }
                    xlObj._isFATResize = false;
                }
            }
        },

        _clearFilterTable: function (sheetIdx, tableId, rmFltr) {
			var sheet = this.XLObj.getSheet(sheetIdx ? sheetIdx : this.getActiveSheetIndex()),tableRange;
            tableRange = sheet.filterSettings.tableRange; 
            for (var i = 0, len = tableRange.length; i < len; i++) {
                if (tableRange[i].tableID === tableId){
                    this._clearAllFilter(sheetIdx, i, rmFltr);
					len = tableRange.length;
				}
			}
        },

        _clearAllFilter: function (sheetIdx, tabIdx, rmFltr) {
            var len, xlObj = this.XLObj, container = xlObj._dataContainer.sheets[sheetIdx], sheet = xlObj.getSheet(sheetIdx), tableRange = sheet.filterSettings.tableRange, fltrCell, cell, j, ln, field,
                multiIdx, startRow, isViewable, fltrState;
            sheet._selectedRange = tableRange[tabIdx].selectedRange;
            multiIdx = tableRange[tabIdx].multifilterIdx;
            startRow = tableRange[tabIdx].startRow;
            for (j = 0, ln = multiIdx.length; j < ln; j++) {
                field = sheet.columns[multiIdx[j]].field;
                fltrState = xlObj.XLEdit.getPropertyValue(startRow - 1, multiIdx[j], "filterState");
                if (!ej.isNullOrUndefined(fltrState) && fltrState.indexOf("filtered") > -1)
                    this._clearFilterColumn(field, "", "", "Or", "", "", tableRange[tabIdx].tableID);
                if (!rmFltr) {
                    if (xlObj._isRowViewable(sheetIdx, startRow - 1)) {
                        fltrCell = xlObj.getCell(startRow - 1, multiIdx[j]);
						xlObj.addClass(fltrCell[0], "e-wrapword");
                        cell = fltrCell.find('.e-filterspan');
                        $(cell).remove();
                        fltrCell.removeClass("e-filterhdr");
                    }
                    if (container[startRow - 1][multiIdx[j]])
                    {
                        delete container[startRow - 1][multiIdx[j]]["isFilterHeader"];
                        delete container[startRow - 1][multiIdx[j]]["filterState"];
                    }
                    delete sheet._filterColl[startRow - 1][multiIdx[j]];
                }
            }
            if (!rmFltr) {
                tableRange.splice(tabIdx, 1);
                len = tableRange.length;
            }
        },

        _clearFilterTableIcon: function (sheetIdx, tableId) {
            var xlObj = this.XLObj, isFilterVisible, filterSpan, sheet = xlObj.getSheet(sheetIdx), tableRange = sheet.filterSettings.tableRange, multiIdx, startRow, j, ln, cell;
            for (var i = 0, len = tableRange.length; i < len; i++) {
                if (tableRange[i].tableID === tableId) {
                    sheet._selectedRange = tableRange[i].selectedRange;
                    sheet.filterSettings.filteredRange = tableRange[i].filteredRange;
                    multiIdx = tableRange[i].multifilterIdx;
                    startRow = tableRange[i].startRow;
                    for (j = 0, ln = multiIdx.length; j < ln; j++) {
                        //Need to Update in Container ( filter Icon is hidden or not )
                        isFilterVisible = xlObj.XLEdit.getPropertyValue(startRow - 1, multiIdx[j], "isFilterVisible");
                        if (xlObj._isRowViewable(sheetIdx, startRow - 1)) {
                            cell = xlObj.getCell(startRow - 1, multiIdx[j]);
							filterSpan = cell.find('.e-filterspan');
                            if(isFilterVisible) {
								filterSpan.hide();
								xlObj._removeClass(cell[0], "e-filterhdr");
							}
							else {
								xlObj.addClass(cell[0], "e-filterhdr");
								filterSpan.show();
							}
                        }
                        xlObj.XLEdit._updateDataContainer({ rowIndex: startRow - 1, colIndex: multiIdx[j] }, { dataObj: { isFilterVisible: !isFilterVisible } });
                    }
                }
            }
        },

        _insertFilterIcon: function (i, j, tabRange, fRow, fApplied) { //fRow- Filtered Row, fApplied - filter Applied
            var filterIcon, filClass;
            filterIcon = this._getFilterIcon();
            if (tabRange.tableID > -1) 
                this.XLObj.XLEdit._updateDataContainer({ rowIndex: i, colIndex: j }, { dataObj: { tableName: "e-table" + tabRange.tableID } });
            this._applyFilterIcon({ rowIndex: i, colIndex: j }, filterIcon);
        },

        _changeFilterIcon: function (cellObj, status, fltrState) {
            var fSpan, activeCell, fltrStr, isViewed = false, xlObj = this.XLObj, rowIdx = cellObj.rowIndex, colIdx = cellObj.colIndex, ralign = xlObj._rAlign, sheetIdx = xlObj.getActiveSheetIndex();
            fltrStr = this._getFilterHeader(sheetIdx, rowIdx, colIdx).status;
            if (xlObj._isRowViewable(sheetIdx, rowIdx)) {
                activeCell = xlObj.getCell(rowIdx, colIdx);
                fSpan = activeCell.find('.e-filterspan')[0];
                activeCell.removeClass(ralign);
                isViewed = true;
            }
            if (status === "filter") {
                if (fltrState.indexOf("filtered") < 0) {
                    xlObj.XLEdit._updateDataContainer({ rowIndex: rowIdx, colIndex: colIdx }, { dataObj: { filterState: fltrState.replace("filter", "filtered") } });
                    xlObj.getSheet(sheetIdx)._filterColl[rowIdx][colIdx].status = fltrStr.replace("e-ssfilter", "e-ssfiltered");
                    if (isViewed)
                        fSpan.className = fSpan.className.replace("e-ssfilter", "e-ssfiltered");
                }
            }
            else {
                xlObj.XLEdit._updateDataContainer({ rowIndex: rowIdx, colIndex: colIdx }, { dataObj: { filterState: fltrState.replace("filtered", "filter") } });
                xlObj.getSheet(sheetIdx)._filterColl[rowIdx][colIdx].status = fltrStr.replace("e-ssfiltered", "e-ssfilter");
                if (isViewed && !xlObj.isUndefined(fSpan))
                    fSpan.className = fSpan.className.replace("e-ssfiltered", "e-ssfilter");
            }
        },

        _changeSortIcon: function (cellObj, status) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), fSpan, idx, fltrStr, fStr, isViewed = false, filterColl = xlObj.getSheet(sheetIdx)._filterColl;
            fltrStr = filterColl[cellObj.rowIndex][cellObj.colIndex].status;
            idx = (fltrStr.indexOf("e-ssfiltered") > -1) ? 12 : 10;
            fStr = fltrStr.substr(0, idx);
            if (xlObj._isRowViewable(sheetIdx, cellObj.rowIndex)) {
                var fSpan = xlObj.getCell(cellObj.rowIndex, cellObj.colIndex).find('.e-filterspan')[0];
                fltrStr = fSpan.className;
                idx = fltrStr.indexOf("e-ssfilter") + idx;
                isViewed = true;
            }
            if (status === "ascending") {
                filterColl[cellObj.rowIndex][cellObj.colIndex]["status"] = fStr + "-asc";
                if (isViewed)
                    fSpan.className = fltrStr.substr(0, idx) + "-asc";
            }
            else {
                filterColl[cellObj.rowIndex][cellObj.colIndex]["status"] = fStr + "-dsc";
                if (isViewed)
                    fSpan.className = fltrStr.substr(0, idx) + "-dsc";
            }
        },

        _extendFilterRange: function (tid, range) {//extend the filter range
            var xlObj = this.XLObj, dataSrcIdx, tabRange = xlObj.getSheet(xlObj.getActiveSheetIndex()).filterSettings.tableRange;
            if (tabRange.length) {
                for (var i = 0, len = tabRange.length; i < len; i++) {
                    if (tabRange[i].tableID == tid) {
                        if (tabRange[i].endRow < range[2]) {
                            dataSrcIdx = tabRange[i].selectedRange.dataSourceIndexes;
                            tabRange[i].endRow = tabRange[i].selectedRange.endRow = range[2];
                            if (dataSrcIdx[dataSrcIdx.length - 1] < tabRange[i].endRow) {
                                for (var j = dataSrcIdx[dataSrcIdx.length - 1], len = tabRange[i].endRow; j < len; j++)
                                    dataSrcIdx.push(j + 1);
                            }
                        }
                        break;
                    }
                }
            }
        },

        _updateFilterIcons: function (stRow, endRow, colIdx, action) {
            var xlObj = this.XLObj, fltrState, cellObj, numFltr = $("#" + xlObj._id + "numberSelectAll").ejCheckBox("instance"), isNumFltr = numFltr ? false : numFltr.model.checked,
                strFltr = $("#" + xlObj._id + "stringSelectAll").ejCheckBox("instance"), isStrFltr = strFltr ? false : strFltr.model.checked;
            for (var i = stRow; i <= endRow; i++) {
                cellObj = { rowIndex: i, colIndex: colIdx };
                fltrState = xlObj.XLEdit.getPropertyValue(i, colIdx, "filterState");
                if (fltrState.indexOf("filtered") > -1 && (action == "clearfiltering" || (isNumFltr || isStrFltr)))
                    this._changeFilterIcon(cellObj, "filtered", fltrState);
                else if (fltrState.indexOf("filtered") < 0 && action != "clearfiltering")
                    this._changeFilterIcon(cellObj, "filter", fltrState);
                break;
            }
        },

        _fltrRowHighlight: function (startRow, endRow, status, tableID, fltrLen) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), rowHdrCnt = xlObj._getJSSheetRowHeaderContent(sheetIdx), rowHdrCell = rowHdrCnt.find("table tr:gt(" + (startRow - 1) + "):lt(" + ((endRow - startRow) + 1) + ")"), range, tableCltn = xlObj.model.sheets[sheetIdx].filterSettings.tableRange, len, i, startHdrRow, endHdrRow;
            var filterRowCln = xlObj.model.sheets[sheetIdx].filteredRowsCollection;
            if (xlObj.model.scrollSettings.allowVirtualScrolling) {
                rowHdrCell = rowHdrCnt.find("table tr").filter(function () { return ($(this).attr("data-idx") >= startRow && $(this).attr("data-idx") <= endRow); });
            }
            if (status === "clear") {
                rowHdrCell.find("td[class *='filterhiglight']").removeClass("e-filterhiglight");
                xlObj.clearRangeData([startRow, 0, endRow, 0], ["isFilterHighlight"]);
                if (filterRowCln.length) {
                    for (var j = 0; j < filterRowCln.length; j++) {
                        for (i = 0, len = tableCltn.length; i < len; i++) {
                            if (filterRowCln[j] >= tableCltn[i].startRow && filterRowCln[j] <= tableCltn[i].endRow && !xlObj.XLEdit.getPropertyValue(filterRowCln[j], 0, "isRHide")) {
                                xlObj.updateUniqueData({ "isFilterHighlight": true }, [tableCltn[i].startRow, 0, tableCltn[i].endRow, 0]);
                                if (xlObj.model.scrollSettings.allowVirtualScrolling)
                                    rowHdrCnt.find("table tr").filter(function () { return ($(this).attr("data-idx") >= tableCltn[i].startRow && $(this).attr("data-idx") <= tableCltn[i].endRow); }).find("td").addClass("e-filterhiglight");
                                else
                                    rowHdrCnt.find("table tr:gt(" + (tableCltn[i].startRow - 1) + "):lt(" + ((tableCltn[i].endRow - tableCltn[i].startRow) + 1) + ")").find("td").addClass("e-filterhiglight");
                            }
                        }
                    }
                }
            }
            else if (status === "add") {
                rowHdrCell.find("td").addClass("e-filterhiglight");
                xlObj.updateUniqueData({ "isFilterHighlight": true }, [startRow, 0, endRow, 0]);
            }
        },

        _checkFilterApplied: function (sheetIdx, rowIdx, rowCount, colIdx, colCount, status) {
            var chkObj, xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx), tblRange = sheet.filterSettings.tableRange, isAlert;
            xlObj._isFilterApplied = false;
            for (var i = 0, len = tblRange.length; i < len; i++) {
                isAlert = false;
				if(tblRange[i].filteredColumns.length) {
					chkObj = xlObj._checkFilterMerge(sheetIdx, [tblRange[i].startRow - 1, tblRange[i].multifilterIdx[0], tblRange[i].endRow, tblRange[i].multifilterIdx[tblRange[i].multifilterIdx.length - 1]], rowIdx, rowCount, colIdx, colCount, status, "filter", isAlert);
					xlObj._isFilterApplied = !chkObj.isAlert;
				}
				else
					xlObj._isFilterApplied = false;
				if(xlObj._isFilterApplied)
					return true;
            }   
			return false;
        },

        _updateFilterCollection: function (sheetIdx, idx, count, position, operation) {
            var i, j, c, iLen,fTable, jLen,tid, cLen, startCell, endCell, xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx), tblRange = sheet.filterSettings.tableRange, tbl, colIdx,
                isVirtualScroll = xlObj.model.scrollSettings.allowVirtualScrolling, fltrState, field;
            count = count + 1;
            if (position === "row") {
                for (i = 0, iLen = tblRange.length; i < iLen; i++) {
                    tbl = tblRange[i];
                    colIdx = tbl.multifilterIdx;
                    if (operation === "insert") {
                        if (idx <= tbl.endRow) {
                            tbl.endRow = tbl.endRow + count;
                            if (idx < tbl.startRow) {
                                tbl.startRow = tbl.startRow + count;
                                if (tbl.tableID > -1)
                                    xlObj.XLFormat._refreshTableRowCol({ tid: tbl.tableID, pos: position, cnt: count, isInsertBefore: true });
                            }
                            else {
                                if (tbl.tableID > -1)
                                    xlObj.XLFormat._refreshTableRowCol({ tid: tbl.tableID, pos: position, cnt: count});
                            }
                        }
                    }
                    else {
                        if (idx <= tbl.endRow) {
                            tbl.endRow = tbl.endRow - count;                            
                            if (idx < tbl.startRow) {
                                tbl.startRow = tbl.startRow - count;
                                if (tbl.tableID > -1)
                                    xlObj.XLFormat._refreshTableRowCol({ tid: tbl.tableID, pos: position, cnt: -count, isInsertBefore: true });
                            }
                            else {
                                if (tbl.tableID > -1)
                                    xlObj.XLFormat._refreshTableRowCol({ tid: tbl.tableID, pos: position, cnt: -count });
                            }
                        }
                    }
                    startCell = { rowIndex: tbl.startRow, colIndex: colIdx[0] };
                    endCell = { rowIndex: tbl.endRow, colIndex: colIdx[colIdx.length - 1] };
                    this._getSelectedRangeData(startCell, endCell, tbl.tableID);
                    tbl.selectedRange = $.extend(true, {}, sheet._selectedRange);
                    tbl.filteredRange = $.extend(true, {}, sheet.filterSettings.filteredRange);
                }
            }
            else {
                var container = xlObj._dataContainer.sheets[sheetIdx], cIdx, dupCol;
                for (i = 0, iLen = tblRange.length; i < iLen; i++) {
                    tbl = tblRange[i], colIdx = tbl.multifilterIdx;
                    dupCol = $.extend(true, [], colIdx);
					cIdx = 0;
                    this._updateFilteredColumns(i, idx, count, operation);
                    if (operation === "insert") {
                        if (idx <= colIdx[0]) {
                            for (j = colIdx.length - 1; j >= 0; j--) {
                                colIdx[cIdx] = colIdx[cIdx] + count;
                                cIdx++;
                            }
                            if (tbl.tableID > -1)
                                xlObj.XLFormat._refreshTableRowCol({ tid: tbl.tableID, pos: position, cnt: count,isInsertBefore:true });
                        }
                        else if (idx <= colIdx[colIdx.length - 1]) {
                            if (tbl.tableID > -1)
                                xlObj.XLFormat._refreshTableRowCol({ tid: tbl.tableID, pos: position, cnt: count });
                            for (j = dupCol[dupCol.length - 1], jLen = dupCol[dupCol.length - 1] + count; j <= jLen; j++) {
                                if (colIdx.indexOf(j) === -1)
                                    colIdx.push(j);
                            }
                        }
                    }
                    else {
                        if (idx <= colIdx[0]) {
                            for (j = 0; j < colIdx.length; j++)
                                colIdx[j] = colIdx[j] - count;
                            if (tbl.tableID > -1)
                                xlObj.XLFormat._refreshTableRowCol({ tid: tbl.tableID, pos: position, cnt: -count, isInsertBefore: true });
                        }
                        else if (idx <= colIdx[colIdx.length - 1]) {
                            for (c = idx, cLen = colIdx[colIdx.length - 1]; c <= cLen; c++) {
                                field = xlObj._generateHeaderText(c + 1);
                                fltrState = xlObj.XLEdit.getPropertyValue(tbl.startRow - 1, c, "filterState");
                                if (!ej.isNullOrUndefined(fltrState) && fltrState.indexOf("filtered") > -1)
                                    this._clearFilterColumn(field, "", "", "Or", "", "", tbl.tableID);
                            }
                            colIdx.splice(colIdx.length - count, count);
                            if (tbl.tableID > -1)
                                xlObj.XLFormat._refreshTableRowCol({ tid: tbl.tableID, pos: position, cnt: -count });
                        }
                    }
                    startCell = { rowIndex: tbl.startRow, colIndex: colIdx[0] };
                    endCell = { rowIndex: tbl.endRow, colIndex: colIdx[colIdx.length - 1] };
                    this._getSelectedRangeData(startCell, endCell, tbl.tableID);
                    tbl.selectedRange = $.extend(true, {}, sheet._selectedRange);
                    tbl.filteredRange = $.extend(true, {}, sheet.filterSettings.filteredRange);
                    if (colIdx.length < 2)
                        tbl.multiFiltering = false;
                }
            }
        },

        _updateFilteredColumns: function (tabIdx, cIdx, count, operation) {
            var xlObj = this.XLObj, filterIdx, sheetIdx = xlObj.getActiveSheetIndex(), field, tableRange = xlObj.getSheet(sheetIdx).filterSettings.tableRange[tabIdx],
                filteredColumns = $.extend(true, [], tableRange.filteredColumns), fColumns = $.extend(true, {}, tableRange.fColumns), fCols = $.extend(true, {}, tableRange.fColumns),
                colIdxes = tableRange.multifilterIdx;
            for (var i = 0, len = filteredColumns.length; i < len; i++) {
                colIdx = xlObj.XLEdit.getColumnIndexByField(tableRange.filteredColumns[i]["field"]);
                if (cIdx <= colIdx) {
                    if (operation === "delete")
                        if (cIdx === colIdx)
                            filteredColumns.splice(i, 1);
                        else
                            filteredColumns[i]["field"] = xlObj._generateHeaderText(colIdx - count + 1);
                    else
                        filteredColumns[i]["field"] = xlObj._generateHeaderText(colIdx + count + 1);
                }
            }
            tableRange.filteredColumns = filteredColumns;
            var filter, pCol, cCol, pColHeaderTxt, cColHeaderTxt, avble = false, fColKeys1 = xlObj.getObjectKeys(tableRange.fColumns), fColKeys = xlObj.getObjectKeys(fColumns);
            tableRange.predicate = tableRange.predicate;
            for (var i = fColKeys.length - 1; i >= 0 ; i--) {
                filterIdx = xlObj.XLEdit.getColumnIndexByField(fColKeys[i]);
                for (var k = cIdx; k < cIdx + count; k++) {
                    if (k <= filterIdx) {
                        filter = $.extend(true, [], fColumns[fColKeys[i]]);
                        for (var j = 0; j < filter.length; j++) {
                            colIdx = xlObj.XLEdit.getColumnIndexByField(filter[j]["field"]);
                            if (k <= colIdx) {
                                if (operation === "delete")
                                    if (k === colIdx)
                                        filter.splice(i, 1);
                                    else
                                        filter[j]["field"] = xlObj._generateHeaderText(colIdx - count + 1);
                                else
                                    filter[j]["field"] = xlObj._generateHeaderText(colIdx + count + 1);
                            }
                        }
                        pCol = xlObj.XLEdit.getColumnIndexByField(fColKeys[i]);
                        pColHeaderTxt = xlObj._generateHeaderText(pCol + 1);
                        if (operation === "delete") {
                            cCol = pCol - count;
                            if (k === pCol) {
                                delete tableRange.predicate[pColHeaderTxt];
                                delete fCols[pColHeaderTxt];
                            }
                            else {
                                cColHeaderTxt=xlObj._generateHeaderText(cCol + 1);
                                fCols[cColHeaderTxt] = filter;
                                delete fCols[pColHeaderTxt];
                                tableRange.predicate[cColHeaderTxt] = xlObj._excelFilter.generatePredicate(filter);
                                delete tableRange.predicate[pColHeaderTxt];
                            }
                        }
                        else {
                            cCol = pCol + count;
                            cColHeaderTxt = xlObj._generateHeaderText(cCol + 1);
                            fCols[cColHeaderTxt] = filter;
                            delete fCols[pColHeaderTxt];
                            tableRange.predicate[cColHeaderTxt] = xlObj._excelFilter.generatePredicate(filter);
                            delete tableRange.predicate[pColHeaderTxt];
                        }
                    }
                }            
			}
            tableRange.fColumns = fCols;       
        },
        
        _renderCustomFilter: function () {
            var xlObj = this.XLObj, dlgId = xlObj._id + "_filter_custom", $dlg = $("#" + dlgId), $content = ej.buildTag("div#" + dlgId + "_content"),
                $filter = ej.buildTag("input#" + dlgId + "_filterBtn.e-filter", {}, {}, { "type": "button", "value": "Filter" }), $clear = ej.buildTag("input#" + dlgId + "_clearBtn.e-clear", {}, {}, { "type": "button", "value": "Clear" });
            $dlg.append($content.append(ej.buildTag("div.e-fltrbtndiv").append($filter).append($clear)));
            this._createButton("filter", $filter);
            this._createButton("clear", $clear);
            $dlg.ejDialog({ enableModal: true, showOnInit: false, enableResize: false, allowKeyboardNavigation: false, title: xlObj._getLocStr("Filter"), width: "100%", height: "100%", cssClass: "e-ss-dialog e-" + xlObj._id + "-dlg", open: function () { $("#" + xlObj._id + "_formatdlg_okbtn").focus(); }, close: ej.proxy(this._customFltrDlgClose, this) });
        },

        _customFltrDlgClose: function () {
            $("#" + this.XLObj._id + "_filter_custom_" + this._colType).hide(); 
        },

        _refreshCustomFilter: function (type) {
            var xlObj = this.XLObj, dlgId = xlObj._id + "_filter_custom", $drpdown = ej.buildTag("input#" + dlgId + "_" + type + "_ddinput.e-" + xlObj._id + "_customddl", {}, {}, { "type": "text" }), $tBox = ej.buildTag("input#" + dlgId + "_" + type + "_acString.e-filterval", {}, {"height": "26px", "width": "100%"}, { "type": "text" }), filterType, strMenuOpt = [{ text: "Equal", value: "equal" }, { text: "Not Equal", value: "notequal" }, { text: "Starts With", value: "startswith" }, { text: "Ends With", value: "endswith" }, { text: "Contains", value: "contains" }],
                $content = $("#" + dlgId + "_content"), numMenuOpt = [{ text: "Equal", value: "equal" }, { text: "Not Equal", value: "notequal" }, { text: "Less Than", value: "lessthan" }, { text: "Less Than Or Equal", value: "lessthanorequal" }, { text: "Greater Than", value: "greaterthan" }, { text: "Greater Than Or Equal", value: "greaterthanorequal" }, { text: "Between", value: "between" }];
            $content.prepend(ej.buildTag("div#" + dlgId + "_" + type, "", { display: "none" }).append(ej.buildTag("div.e-operdiv").append($drpdown)).append(ej.buildTag("div.e-textdiv").append($tBox)));
            $drpdown.ejDropDownList({ dataSource: numMenuOpt, width: "100%", fields: { id: "value", text: "text", value: "value" }, select: $.proxy(this._onNumFormatSelect, this), selectedItemIndex: 0 });
            switch (type) {
                case "string":
                    $drpdown.ejDropDownList("option", { dataSource: strMenuOpt, selectedItemIndex: 0 });
                    $tBox.ejAutocomplete({
                        width: "100%", height: 26, enableDistinct: true,
                        focusIn: function (args) {
                            filterType = $drpdown.ejDropDownList("model.value");
                        },
                    });
                    break;
                case "number":
                    $tBox.ejNumericTextbox({ showSpinButton: false, height: "26px", decimalPlaces: 2, width: "100%" });
                    break;
                case "boolean":
                    $tchkBox.ejCheckBox({});
                    break;
                case "date":
                    $tBox.ejDatePicker({ width: "100%" });
                    break;
            }
        },

        _createButton: function (name, element) {
            var $func = (name == "filter") ? ej.proxy(this._fltrBtnHandler, this) : ej.proxy(this._fltrClrHandler, this);
            element.ejButton({ size: "normal", type: "button", height: 22, width: 60, "click": $func, showRoundedCorner: true});
        },

        _fltrBtnHandler: function(e){
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), dlgId = xlObj._id + "_filter_custom", filterType = $("#" + dlgId + "_" + this._colType + "_ddinput").ejDropDownList("model.value"), filterVal = $("#" + dlgId + "_" + this._colType + "_acString").val();            
            arg = { action: "filtering", filterCollection: [{ field: this._colName, matchcase: true, operator: filterType, value: filterVal, predicate: "or" }], fieldName: this._colName, ejpredicate: { field: this._colName, operator: filterType, value: filterVal, isComplex: false, ignoreCase: false }, tableID: this._tableId };
            xlObj._excelFilter._predicates[sheetIdx][this._colName] = ej.Predicate(this._colName, filterType, filterVal);
            this._filterHandler(arg);
            $("#" + dlgId).ejDialog("close");
            $("#" + dlgId + "_" + this._colType).hide();
        },

        _fltrClrHandler: function(e) {
            var xlObj = this.XLObj, dlgId = xlObj._id + "_filter_custom", filterType = $("#" + dlgId + "_" + this._colType + "_ddinput").ejDropDownList("model.value");
            this._clearFilterColumn(this._colName, "", "", "Or", "", "", this._tableId);
            $("#" + dlgId).ejDialog("close");
            $("#" + dlgId + "_" + this._colType).hide();
        },

        _openNormalFilterDlg: function (colName, type, tableId, tableIdx) {
            var xlObj = this.XLObj, dlgId = xlObj._id + "_filter_custom";
            $("#" + dlgId + "_" + type).show();
            $("#" + dlgId).ejDialog("open");
            $("#" + dlgId + "_" + type + "_ddinput").ejDropDownList("option", { selectedItemIndex: 0 });
            this._colName = colName; this._colType = type; this._tableId = tableId;
            if (type === "string")
                $("#" + dlgId + "_" + type + "_acString").ejAutocomplete("option", { fields: { key: this._colName, text: this._colName }, dataSource: xlObj.getSheet(xlObj.getActiveSheetIndex()).filterSettings.tableRange[tableIdx].filteredRange })
        }
	};
})(jQuery, Syncfusion);