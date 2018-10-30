(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.cellFormatting = function (obj) {
        this.XLObj = obj;
        this._formatEnable = false;
        this._thousandSeparator = ej.preferredCulture(this.XLObj.model.locale).numberFormat[","];
        this._formatAsTableStyle = {};
        this._rowLength = null;
        this._colLength = null;
        this._getFormat = null;
        this._getEformatClass = null;
        this._borderPosition = ["top", "right", "bottom", "left"];
        this._cellObj = null;
        this._isFAT = false;
        this._customFormatSpecifierType = {};
        this._customFontFamily = {};
        this._isHeaderAdded = false;
        this._styleDlgClick = false;
    };

    ej.spreadsheetFeatures.cellFormatting.prototype = {
        format: function (formatObj, range) {
			var xlObj = this.XLObj;
			if (!xlObj.model.allowCellFormatting || xlObj.model.isReadOnly)
				return;
			var info, cellIdx, cells, colWidh, tFormats, cellInfo, globalWidth, $cell, cell, len, cssclass, formattedval, args, cHght, cWidth, rows, val, extFormat, maxc, i = 0,
                cellObj = {}, selCells = [], style = "style", options = {}, format = "format", sep = "thousandSeparator",
                sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), ralign = xlObj._rAlign, container = xlObj._dataContainer,
                details = { sheetIndex: sheetIdx, reqType: "cell-format" }, dupDetails = xlObj._dupDetails, isRfrshCmtPos = false, rowHtColl = sheet.rowsHeightCollection, rowHt = 0, mergeObj;
            cells = xlObj._getMultiRangeCells(range);
            len = cells.length;
            if (xlObj._trigger("beforeCellFormat", { sheetIndex: sheetIdx, format: formatObj, cells: cells }))
                return false; 
            if (len) {
                formatObj = this._getFormatObj(formatObj);
                if (style in formatObj || format in formatObj) {
                    details.oprType = style in formatObj ? "style" : "format";
                    maxc = cells[len - 1].colIndex;
                    while (i < len) {
                        cellIdx = cells[i], args = { sheetIndex: sheetIdx, format: formatObj, cell: cellIdx };
                        this._cellObj = {};
                        info = { rowIndex: cellIdx.rowIndex, colIndex: cellIdx.colIndex, beforeFormat: {}, afterFormat: {}, bRowHeight: xlObj.model.allowResizing && xlObj.XLResize.getRowHeight(cellIdx.rowIndex) };
                        if (!ej.isNullOrUndefined(container.sheets[sheetIdx][info.rowIndex]))
                            cellObj = ej.isNullOrUndefined(container.sheets[sheetIdx][info.rowIndex][info.colIndex]) ? {} : container.sheets[sheetIdx][info.rowIndex][info.colIndex];
                        else
                            cellObj = {};
                        if (xlObj._isRowViewable(sheetIdx, cellIdx.rowIndex)) {
                            $cell = xlObj.getCell(cellIdx.rowIndex, cellIdx.colIndex);
                            cell = $cell[0];
                        }
                        if (style in formatObj) {
                            info.prevClass = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, format);
                            info.prevClass = info.prevClass ? info.prevClass : "";
                            extFormat = this._getExtendedFormat(cellIdx, formatObj.style);
							if(extFormat['format']['text-align'] && extFormat['format']['text-align'].toLowerCase() === 'right' && !xlObj._hasClass(cell, 'e-rightalign'))
								xlObj.addClass(cell, 'e-rightalign');
							else if((!extFormat['format']['text-align'] || extFormat['format']['text-align'].toLowerCase() !== 'right') && xlObj._hasClass(cell, 'e-rightalign'))
								xlObj._removeClass(cell, 'e-rightalign');
                            this._cellObj.formats = $.extend(true, {}, extFormat.format);
                            tFormats = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "tformats");
                            if (tFormats)
                                extFormat.format = $.extend(tFormats, extFormat.format);
                            this._cellObj.format = info.className= this._createFormatClass(extFormat.format);                     
                            info.beforeFormat = $.extend(true, {}, cellObj);
                            if (("font-family" in formatObj["style"] || "font-size" in formatObj["style"]) && !xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "isMHide") && ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "merge"))) {              val = xlObj.XLEdit.getPropertyValue(info.rowIndex, info.colIndex);
                                if (xlObj.model.allowResizing && (xlObj.isNumber(val) || xlObj._isDateTime(val) || xlObj.isTime(val))) {
                                    cWidth = xlObj.XLResize._getContentWidth(info.colIndex, sheetIdx, info.rowIndex, info.rowIndex) + 2;
                                    if (cWidth > sheet.columnsWidthCollection[info.colIndex])
                                        xlObj.setWidthToColumns([{ colIndex: info.colIndex, width: cWidth }]);
                                }
                                if (xlObj.model.allowSelection)
                                    xlObj.XLSelection._refreshBorder();
                                isRfrshCmtPos = true;
                            }
                            args.cssClass = extFormat.className;
                        }
                        if (format in formatObj && formatObj.type) {
                            formattedval = xlObj.XLEdit.getPropertyValue(info.rowIndex, info.colIndex);
                            formattedval = ej.isNullOrUndefined(formattedval) ? "" : formattedval;
                            this._cellObj.value = formattedval;
                            this._cellObj.type = formatObj.type;
                            this._cellObj.formatStr = formatObj.format.formatStr;
                            this._cellObj.decimalPlaces = formatObj.format.decimalPlaces;
                            this._cellObj.thousandSeparator = formatObj.format[sep] ? true : false;
                            this._cellObj.canUpdate = true;
                            info.beforeFormat = $.extend(true, {}, cellObj);
							formattedval = this._getFormattedValue(info.rowIndex, info.colIndex, this._cellObj, formattedval);
                            args.value = this._cellObj.value;
                            args.value2 = this._cellObj["value2"] = ej.isNullOrUndefined(formattedval) ? "" : formattedval[0] == "'" ? formattedval.substr(1): (formattedval + "");
                            delete this._cellObj.canUpdate;
                            info.beforeFormat.Oprtype = this._cellObj.type;
                        }
						if(xlObj.XLEdit.getPropertyValue(info.rowIndex, info.colIndex, 'value2'))
                            xlObj._textClip(info.rowIndex, info.colIndex, 'delete');
                        xlObj.XLEdit._updateDataContainer(info, { dataObj: this._cellObj });
						if ((style in formatObj && ("font-family" in formatObj["style"] || "font-size" in formatObj["style"])) && !xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "isMHide")) {                         
						    colWidh = sheet.columnsWidthCollection[info.colIndex];
						    cHght = xlObj._detailsFromGlobalSpan(info.rowIndex, info.colIndex, "height", xlObj.XLEdit.getPropertyValue(info.rowIndex, info.colIndex, "value2"), colWidh);
					        if (xlObj.XLEdit.getPropertyValue(info.rowIndex, 0, "wrapRow") ? (sheet.rowsHeightCollection[info.rowIndex] < cHght) : true)
							    mergeObj = xlObj.XLEdit.getPropertyValue(info.rowIndex, info.colIndex, "merge");
                            if (cHght >= xlObj.model.rowHeight && (!xlObj.XLEdit.getPropertyValue(info.rowIndex, info.colIndex, "mergeIdx") && !mergeObj )|| (mergeObj && mergeObj.mSpan.rowSpan <=1)) {
                                    xlObj._updateFormatColl(sheetIdx, info.rowIndex, info.colIndex, cHght);
                                    cHght = xlObj._getFormattedHeight(sheetIdx, info.rowIndex);
                                    if (cell)
                                        $cell.parent().outerHeight(cHght);
                                    sheet.rowsHeightCollection[info.rowIndex] = cHght;
                                    xlObj.XLEdit._updateDataContainer({ rowIndex: info.rowIndex, colIndex: 0 }, { dataObj: { pHeight: sheet.rowsHeightCollection[info.rowIndex], cHeight: cHght } });
                                    isRfrshCmtPos = true;
                                    if (xlObj.model.allowFreezing) {
                                        xlObj.XLFreeze._refreshFRowResize(cellIdx.rowIndex);
                                        xlObj.XLFreeze._refreshFColResize(cellIdx.colIndex);
                                    }
                                }
					    }
                        cellInfo = xlObj._getCellInfo(cellIdx);
                        xlObj._dupDetails = true;
                        if (format in formatObj && ["text", "general"].indexOf(this._cellObj.type) === -1) {
                            var data = xlObj.getRangeData({ range: [cellIdx.rowIndex, cellIdx.colIndex, cellIdx.rowIndex, cellIdx.colIndex], property: ['value2', "formats", "altTxt", "type"] });
                            if (xlObj._browserDetails.name == "msie" && xlObj._browserDetails.version == "8.0")
                                globalWidth = xlObj._detailsFromGlobalSpan(cellIdx.rowIndex, cellIdx.colIndex, "width", this._cellObj.value2);
                            else
                                globalWidth = xlObj._getTextContentWidth(data[0], this._cellObj.value2);
                            if (globalWidth > cellInfo.width)
                                xlObj.XLResize.setColWidth(cellIdx.colIndex, globalWidth);
                            if (xlObj.model.allowFreezing)
                                xlObj.XLFreeze._refreshFColResize(cellIdx.colIndex);
                        }
                        xlObj._dupDetails = false;
                        xlObj._dupDetails = dupDetails;
                        if (sheet._isColSelected && sheet.selectedRange[1] <= info.colIndex && info.colIndex <= sheet.selectedRange[3])
                            sheet._columnStyles[info.colIndex] = $.extend(true, sheet._columnStyles[info.colIndex], this._cellObj);
                        if (sheet._isRowSelected && sheet.selectedRange[0] <= info.rowIndex && info.rowIndex <= sheet.selectedRange[2])
                            sheet._rowStyles[info.rowIndex] = $.extend(true, sheet._rowStyles[info.rowIndex], this._cellObj);
                        this._cellObj = null;
                        if (!ej.isNullOrUndefined(container.sheets[sheetIdx][info.rowIndex]))
                            cellObj = ej.isNullOrUndefined(container.sheets[sheetIdx][info.rowIndex][info.colIndex]) ? {} : container.sheets[sheetIdx][info.rowIndex][info.colIndex];
                        else
                            cellObj = {};
                        info.afterFormat = $.extend(true, {}, cellObj);
                        info.afterFormat.Oprtype = info.beforeFormat.Oprtype;
                        info.aRowHeight = xlObj.model.allowResizing && xlObj.XLResize.getRowHeight(cellIdx.rowIndex);
                        selCells.push(info);
						xlObj._trigger("cellFormatting", args);
						if(xlObj.XLEdit.getPropertyValue(info.rowIndex, info.colIndex, 'value2'))
                            xlObj._textClip(info.rowIndex, info.colIndex, 'add');
						if (maxc === info.colIndex)
						    xlObj._setRowHdrHeight(sheetIdx, info.rowIndex);
						i++;						
                    }
                    details.selectedCell = selCells;
                    details.range = sheet.selectedRange;
                    xlObj.XLScroll._getRowHeights(sheetIdx, cells[0].rowIndex);
                    if (isRfrshCmtPos && (!sheet._isImported || sheet._isLoaded) && xlObj.model.allowComments && !xlObj._isExport)
                        xlObj.XLComment._updateCmntArrowPos(null, sheetIdx);
                }
                xlObj.model.allowFormulaBar && xlObj.updateFormulaBar();
                if ("border" in formatObj && !xlObj._isMultiRange(range))
                    this.applyBorder(formatObj.border, range, details);
                else if ((!sheet._isImported || sheet._isLoaded) && !xlObj._isUndoRedo && !xlObj._dupDetails && !xlObj._isSort && !xlObj._isExport) {
                    xlObj._completeAction(details);
                    xlObj._trigActionComplete(details);
                }
            }
        },

		_getFormattedValue: function(rowIdx, colIdx, cellObj, formattedval) {
			var type, xlObj = this.XLObj, options = {}, formattedval = ej.isNullOrUndefined(formattedval) ? "" : xlObj.XLEdit.getPropertyValue(rowIdx, colIdx);
			if (ej.isNullOrUndefined(formattedval))
			    formattedval = "";
			if (xlObj.isFormula(formattedval)) {
				formattedval = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "calcValue");
                cellObj.canUpdate = false;
            }
            if (["text", "general"].indexOf(cellObj.type) !== -1) {
                if (xlObj._isDateTime(formattedval)) {
                    type = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "type");
                    formattedval = xlObj._dateToInt(formattedval, type === ej.Spreadsheet.CellType.Time);
                    cellObj.value = formattedval;
                }
                if(cellObj.type === ej.Spreadsheet.CellType.Text)
                    options.align = "";
                else if (xlObj.isNumber(formattedval) && xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "align") != "right")
                    options.align = ej.Spreadsheet.Align.Right;
                if ("align" in options) {
                    options.cellIdx = {rowIndex: rowIdx, colIndex: colIdx};
                    xlObj.XLEdit._refreshCellAlignment(options);
                }
			}
            else {
				if (xlObj._isDateTime(formattedval))
                    type = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "type");
                formattedval = this._format(formattedval, { formatStr: cellObj.formatStr, type: cellObj.type, thousandSeparator: cellObj.thousandSeparator, decimalPlaces: cellObj.decimalPlaces, cellObj: cellObj, isTime: type === ej.Spreadsheet.CellType.Time }, { rowIndex: rowIdx, colIndex: colIdx });
			}
			return formattedval;
		},
		
        _format: function (value, formatObj, cell) {
            var xlObj = this.XLObj, formatstr = formatObj.formatStr,
                temp = xlObj.isUndefined(value) ? "" : value, type = formatObj.type || "", ctype = ej.Spreadsheet.CellType,
                locale = xlObj.model.locale, prefix = ["."].indexOf(this._thousandSeparator) > -1 ? '\\' : "", regx = new RegExp(prefix + this._thousandSeparator, "g");
            value = temp.toString();
			xlObj.XLEdit._formatCellVal = null;
            switch (type) {
                case ctype.Accounting:
                    if (xlObj._isDateTime(temp)) {
                        temp = xlObj._dateToInt(temp);
						xlObj.XLEdit._formatCellVal = temp;
                        if (this._cellObj && this._cellObj.canUpdate)
                            this._cellObj.value = temp;
                    }
                    if (xlObj.isNumber(temp))
                        temp = xlObj.toAccounting(formatstr, temp, locale);
                    break;
                case ctype.Currency:
                case ctype.Number:
                case ctype.Percentage:
                    if (xlObj._isDateTime(temp)) {
                        temp = xlObj._dateToInt(temp);
						xlObj.XLEdit._formatCellVal = temp;
                        if (this._cellObj && this._cellObj.canUpdate)
                            this._cellObj.value = temp;
                    }
                    if (xlObj.isNumber(temp)) {
                        temp = xlObj.formatting(formatstr, temp, locale);
                        if (!formatObj.thousandSeparator && [ctype.Number, ctype.Percentage].indexOf(type) > -1 && this._thousandSeparator)
                            temp = temp.replace(regx, "");
                    }
                    break;
                case ctype.Scientific:
                    if (xlObj._isDateTime(temp)) {
                        temp = xlObj._dateToInt(temp);
						xlObj.XLEdit._formatCellVal = temp;
                        if (this._cellObj && this._cellObj.canUpdate)
                            this._cellObj.value = temp;
                    }
                    if (xlObj.isNumber(temp))
                        temp = xlObj.toExponential(temp, formatObj.decimalPlaces);
                    break;
                case ctype.Fraction:
                    if (xlObj._isDateTime(temp)) {
                        temp = xlObj._dateToInt(temp);
						xlObj.XLEdit._formatCellVal = temp;
                        if (this._cellObj && this._cellObj.canUpdate)
                            this._cellObj.value = temp;
                    }
                    if (xlObj.isNumber(temp)) {
                        temp = xlObj.toFraction(temp);
                        temp = "numerator" in temp ? temp.integer + " " + temp.numerator + "/" + temp.denominator : temp.integer;
                    }
                    break;
                case ctype.LongDate:
                case ctype.ShortDate:
                case ctype.Date:
                case ctype.Time:
                case ctype.DateTime:
                    if (typeof temp === "string")
                        temp = xlObj._isValidTime(temp) ? new Date("01/01/1990 " + temp) : new Date(temp);
                    if (!isNaN(ej.parseFloat(temp.toString(), 10, locale))) {
                        temp = xlObj.intToDate(temp);
					}
                    else if (!xlObj._isDateTime(temp)) 
                        temp = ej.parseDate(temp);
                    if (temp && this._cellObj && this._cellObj.canUpdate) {
                        this._cellObj.value = temp;
						xlObj.XLEdit._formatCellVal = temp;
					}
                    if (xlObj._isDateTime(temp))
                        temp = xlObj.formatting(formatstr, temp, locale);
                    break;
                case ctype.String:
                    var pos = formatstr.indexOf("\\"), hasPos = formatstr.indexOf("#"), str = formatstr.split("\\").join("");
                    if (hasPos < 0)
                        hasPos = formatstr.indexOf("0");
                    if (pos < hasPos)
                        temp = str.substr(pos, str.length - 1) + value;
                    else if (pos > hasPos)
                        temp = value + str.substr(hasPos + 1, str.length);
                    break;
            }
            return ej.isNullOrUndefined(temp) ? value : temp;
        },

        createTable: function (tableObj, range) {
			var xlObj = this.XLObj;
			if (!xlObj.model.allowFormatAsTable || (!xlObj.model.allowSelection && ej.isNullOrUndefined(range) || ( xlObj.getSheet()._isLoaded && xlObj.model.isReadOnly)))
                return;
            ej.isNullOrUndefined(tableObj.format) && (tableObj.format = this._getTableLayoutFromName(tableObj.formatName).format);
            ej.isNullOrUndefined(tableObj.showHeaderRow) && (tableObj.showHeaderRow = true);
            var details, evtArgs, pcells, trange, cname, tmpRange, tlength, minr, minc, maxr, maxc, tname = tableObj.name || "", filterHdr,
                sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), tmgr = sheet.tableManager, scell = sheet._startCell,
                ecell = sheet._endCell, str = "formatName", args = { sheetIndex: sheetIdx, tableStyle: tableObj, reqType: "format-table" },
                format = tableObj.format || this._getTableLayoutFromName(tableObj.formatName).format, obj = { format: format }, dupDetails = xlObj._dupDetails, fltrColElem = xlObj.element.find("#" + xlObj._id + "_Ribbon_tsofiltercolumn");
            evtArgs = { range: ej.isNullOrUndefined(range) ? [scell.rowIndex, scell.colIndex, ecell.rowIndex, ecell.colIndex] : range, sheetIndex: args.sheetIndex, tableStyle: args.tableStyle, reqType: args.reqType}
            if (xlObj._trigActionBegin(evtArgs) || !format)
                return;
            tableObj = args.tableStyle;
            this._isFAT = true;
            range = xlObj._getRangeArgs(range, "object");
            if (xlObj._isUndoRedo)
                trange = $.merge([], range);
            else {
                trange = range ? range : sheet.selectedRange;
				for (var i = trange[0]; i <= trange[2]; i++) {
					for(var j = trange[1]; j <= trange[3]; j++) {
						filterHdr = xlObj.XLFilter._getFilterHeader(sheetIdx, i, j);
						if (!ej.isNullOrUndefined(filterHdr) && filterHdr.status.indexOf("e-ssfilter") > -1) {
							xlObj._showAlertDlg("Alert", "FilterAlert", "", 440);
							return;
						}
					}
				}
			}
            if (tableObj.name && !xlObj.XLRibbon._validateNamedRange(tableObj.name, xlObj._getDollarAlphaRange(trange, true), "Workbook") && !xlObj.XLClipboard._isCut)
                return;
            cname = xlObj.XLEdit.getPropertyValue(trange[0], trange[1], "tableName") || "";
            if (!sheet._isImported || sheet._isLoaded) {
				pcells = xlObj.getRange(trange);
				details = { sheetIndex: sheetIdx, reqType: "format-table", beforeFormat: this.getHashCodeClassAsArray(), beforeRange: $.extend(true, [], trange), pcells: pcells, beforeRangeHeader: xlObj.getRangeData({ range: [trange[0], trange[1], trange[0], trange[3]] }) };
                tmpRange = tableObj.header?[trange[0], trange[1], trange[2], trange[3]]:[trange[0], trange[1], trange[2] + 1, trange[3]];
                details.beforeRangeData = xlObj.getRangeData({ range: tmpRange }),
                details.beforeMergeRange = xlObj.XLEdit._getPropWithCellIdx(tmpRange, "merge", sheetIdx);
                xlObj._dupDetails = true;
                if (details.beforeMergeRange.length)
                    xlObj.unmergeCells(xlObj._getAlphaRange(sheetIdx, tmpRange[0], tmpRange[1], tmpRange[2], tmpRange[3]));
                xlObj._dupDetails = false;
            }
            if (str in tableObj)
                obj[str] = tableObj.formatName;
            if ("showHeaderRow" in tableObj)
                obj["showHeaderRow"] = tableObj.showHeaderRow;
			if ("totalRow" in tableObj)
                obj["totalRow"] = tableObj.totalRow;
            if (!cname) {
                if (xlObj.XLClipboard._isCut){
                    while (tableObj.tblId in tmgr)
                        tableObj.tblId++;
                    tlength = parseInt(tableObj.tblId);
                }    
                else
                    tlength = xlObj.getObjectLength(tmgr) + 1;
                tname = tname.length ? tname : 'Table' + tlength;
                xlObj.model.sheets[sheetIdx]._header[tlength] = { header: tableObj.header };
                if (sheet._isLoaded) {
                    if (tableObj.header) {
                        if (range) {
                            sheet._startCell = { rowIndex: range[0], colIndex: range[1] };
                            sheet._endCell = { rowIndex: range[2], colIndex: range[3] };
                            xlObj.XLSelection.selectRange(sheet._startCell, sheet._endCell);
                            if (xlObj.model.allowAutoFill && (!sheet._isImported || sheet._isLoaded))
                                xlObj.XLDragFill.positionAutoFillElement();
                        }
                        else
                            range = xlObj.swapRange([scell.rowIndex, scell.colIndex, ecell.rowIndex, ecell.colIndex]);
                        if (range[0] === range[2]) {
                            trange = range;
                            trange[2] = trange[2] + 1;
                        }
                    }
                    else {
                        if (xlObj._isUndoRedo)
                            trange = $.extend(true, [], range);
                        else {
                            trange = range ? range : xlObj.swapRange([scell.rowIndex, scell.colIndex, ecell.rowIndex, ecell.colIndex]);
                            range = trange;
                        }
                        if (xlObj.model.allowDragAndDrop)
                            xlObj.XLDragDrop._moveRangeTo(trange, [trange[0] + 1, trange[1], trange[2] + 1, trange[3]], ["value", "value2", "type", "formatStr", "decimalPlaces", "thousandSeparator", "range", "format", "border", "borders", "comment", "hyperlink", "picture", "cFormatRule", "rule", "chart", "isLocked", "wrap", "formats", "tformats", "tborders", "tableName"]);
                        sheet._startCell = { rowIndex: trange[0], colIndex: trange[1] };
                        sheet._endCell = { rowIndex: trange[2] + 1, colIndex: trange[3] };
                        xlObj.XLSelection.selectRange(sheet._startCell, sheet._endCell);
                        if (xlObj.model.allowAutoFill && (!sheet._isImported || sheet._isLoaded))
                            xlObj.XLDragFill.positionAutoFillElement();
                        trange[2] = trange[2] + 1;
                    }
                }
                if("dataSource" in tableObj)
                    xlObj._updateRangeValue(sheetIdx, { showHeader: "showHeader" in tableObj ? tableObj.showHeader : true, startCell: xlObj._getAlphaRange(sheetIdx, range[0], range[1], range[0], range[1]), dataSource: tableObj.dataSource }, false);
                xlObj.updateUniqueData({ tableName: 'e-table' + tlength }, range);
                tmgr[tlength] = { name: tname, range: trange, showHeaderRow: tableObj.showHeaderRow };
                tableObj.fnNumber && (tmgr[tlength].fnNumber = tableObj.fnNumber);
                tmgr[tlength]["isFilter"] = tableObj.showHeaderRow;
                xlObj.XLRibbon._isDesignTab = true;
                xlObj._dupDetails = true;
                this._createTable(tlength, obj);
                tableObj.showHeaderRow && xlObj.model.allowFiltering && xlObj.XLFilter._filterTable(sheetIdx, tlength, { startCell: { rowIndex: range[0], colIndex: range[1] }, endCell: { rowIndex: range[2], colIndex: range[3] } });
                xlObj._dupDetails = false;
                this._updateTblStyleOptns(tlength, tableObj);
                if ((!sheet._isImported || sheet._isLoaded) && !tableObj.hideTab)
                    xlObj.XLRibbon._designTabUpdate(tlength, { rowIndex: range[0], colIndex: range[1] });
                if (xlObj.model.allowComments)
                    xlObj.XLComment._updateCmntArrowPos();
            }
            else {
                this._formatAsTableStyle = obj;
                xlObj._dupDetails = true;
                this._createTable(xlObj._getTableID(cname), obj);
                xlObj._dupDetails = false;
                xlObj._undoCollection.pop();
                xlObj._undoCollection.pop();
            }
            if (!sheet._isImported || sheet._isLoaded) {
                xlObj.XLRibbon._dirtySelect(xlObj.getRange(range));
                details.tableID = tlength;
                details.tableStyle = tableObj;
                details.afterRange = trange;
                xlObj._dupDetails = dupDetails;
                evtArgs = { pCells: details.pcells, reqType: details.reqType, sheetIndex: details.sheetIndex, tableID: details.tableID, tableStyle: details.tableStyle };
                if (!xlObj._isPaste && !xlObj._isUndoRedo && !xlObj._dupDetails && !xlObj._isExport)
                {
                    xlObj._completeAction(details);
                    xlObj._trigActionComplete(evtArgs);
                }
            }
            fltrColElem.length && fltrColElem.ejCheckBox("option", { checked: true });
			xlObj.XLRibbon.addNamedRange(tname, xlObj._getDollarAlphaRange(range, true), null, sheetIdx, "Workbook");
			this._updateTableFormula("addRange", tmgr[tlength], sheetIdx);
			var keys = xlObj.getObjectKeys(xlObj._tableRangesFormula[tname]), keysLen = keys.length;
			 xlObj._tableFormulaCollection[tname] = [];
				for(var j=0;j<keysLen;j++)
				    xlObj._tableFormulaCollection[tname].push({"text": "[" + keys[j] + "]", "display":keys[j]});
			sheet._isLoaded && xlObj.XLSelection._refreshBorder();
			this._isFAT = false;
			return tableObj.name;
        },

        _createTable: function (tableId, options) {
            var cellIdx, i, j, k, l, style, arange, val, txt, len, eformat, canUpdate, args, dstyle, idx = 1, col = "Column", frmt = "format", frmts = frmt + "s",
                tfrmts = "t" + frmts, bdr = "border", frmtName = "formatName", hdrLyt = "headerLayout", cntLyt = "contentLayout",
                cntBdr = "contentBorder", val2 = "value2", tblName = "tableName", hlk = "hyperlink", tableName = "e-table" + tableId,
                hasStyle = false, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx),
                table = sheet.tableManager[tableId], range = table.range, minr = range[0],
                minc = range[1], maxr = range[2], maxc = range[3], fltrColElem = xlObj.element.find("#" + xlObj._id + "_Ribbon_tsofiltercolumn"),tempArr = [], pos =2, tempVal;
            table[frmt] = options.format;
            if (options.formatName)
                table[frmtName] = options.formatName;
            if (table.showHeaderRow)
                options["showHeaderRow"] = table.showHeaderRow;
            this.removeStyle(range, { tableStyle: true, border: true, sheetIdx: sheetIdx });
            if (options.showHeaderRow && hdrLyt in options.format) {
                style = $.extend(true, {}, options.format.headerLayout);
                if (bdr in style) {
                    arange = xlObj._getProperAlphaRange(sheetIdx, minr, minc, minr, maxc);
                    xlObj._intrnlReq = true;
                    xlObj._isTableBrdrEnd = true;
                    this.applyBorder(style.border, arange);
                    xlObj._intrnlReq = false;
                    delete style.border;
                }
            }
            hasStyle = xlObj.getObjectLength(style) > 0;
            i = minr, j = minc, k = maxc;
            if (options.showHeaderRow) {
                while (j <= k) {
                    canUpdate = false, args = {};
                    cellIdx = { rowIndex: i, colIndex: j };
                    val = xlObj.XLEdit.getPropertyValue(i, j, val2) || "";
                    txt = col + idx;
                    if (xlObj.XLEdit.getPropertyValue(i, j, tblName, sheetIdx) !== tableName) {
                        args.tableName = tableName;
                        canUpdate = true;
                    }
                    if (!val.length) {
                        xlObj.XLEdit._updateCell(cellIdx, txt);
                        idx++;
                    }
                    else if (val.toLowerCase() === txt.toLowerCase())
                        idx++;
					tempVal = val.toLowerCase();
					if(val.length) {
						if(tempArr.indexOf(tempVal)< 0)
						   tempArr.push(tempVal);
					    else {
						   val = val + pos;
						   pos++;
						   tempArr.push(val.toLowerCase());
						   xlObj.XLEdit._updateCell(cellIdx, val);
					    }
					}
                    if (hasStyle) {
                        eformat = this._getExtendedFormat(cellIdx, style, this._isFAT);
                        args.format = this._createFormatClass(eformat.format);
                        args.tformats = style;
                        canUpdate = true;
                    }
                    if (canUpdate)
                        xlObj.XLEdit._updateDataContainer(cellIdx, { dataObj: args, sheetIdx: sheetIdx });
                    j++;
                }
            }
			if(xlObj.isImport || xlObj.model.isImport)
				maxr = options.totalRow ? (maxr + 1) : maxr;
            if (cntLyt in options.format) {
                len = options.format.contentLayout.length;
                idx = 0, i = options.showHeaderRow ? (minr + 1) : minr, j = maxr;
                while (i <= j) {
                    style = $.extend(true, {}, options.format.contentLayout[idx % len]);
                    if (bdr in style) {
                        arange = xlObj._getProperAlphaRange(sheetIdx, i, minc, i, maxc);
                        xlObj._intrnlReq = true;
                        xlObj._isTableBrdrEnd = true;
                        this.applyBorder(style.border, arange);
                        xlObj._intrnlReq = false;
                        delete style.border;
                    }
                    if (xlObj.getObjectLength(style)) {
                        k = minc, l = maxc;
                        while (k <= l) {
                            args = {}, cellIdx = { rowIndex: i, colIndex: k };
                            dstyle = $.extend({}, style);
                            if (xlObj.XLEdit.getPropertyValue(i, k, tblName, sheetIdx) !== tableName)
                                args.tableName = tableName;                                                            
                            if (dstyle.color && xlObj.XLEdit.getPropertyValue(i, k, hlk))
                                delete dstyle.color;
                            eformat = this._getExtendedFormat(cellIdx, dstyle, this._isFAT);
                            args.format = this._createFormatClass(eformat.format);
                            args.tformats = style;
                            xlObj.XLEdit._updateDataContainer(cellIdx, { dataObj: args, sheetIdx: sheetIdx });
                            k++;
                        }
                    }
                    i++;
                    idx++;
                }  
            }
            if (cntBdr in options.format) {
                arange = xlObj._getProperAlphaRange(sheetIdx, minr + 1, minc, maxr, maxc);
                xlObj._intrnlReq = true;
                xlObj._isTableBrdrEnd = true;
                this.applyBorder($.extend({}, options.format.contentBorder.border), arange);
                xlObj._intrnlReq = false;
            }
            if (xlObj.model.scrollSettings.allowVirtualScrolling & xlObj._isTableBrdrEnd) {
                xlObj.XLScroll._refreshScroller(sheetIdx, "refresh", "vertical");
                xlObj._isTableBrdrEnd = false;
            }
            if (!xlObj.XLClipboard._isCut)
                xlObj._tableCnt++;
        },
 
         resizeTable: function(range, tableName, sheetIndex) {
              var xlObj = this.XLObj, tableId = xlObj._getTableID(null,tableName);
              xlObj.XLRibbon._resizeTable(range, tableId, sheetIndex)
        },
        firstColumn: function (tableName, sheetIdx) {
            var xlObj = this.XLObj, tid = xlObj._getTableID(null,tableName), checkBoxObj;
            xlObj.XLRibbon._isFirstColumn = true;
            xlObj.XLRibbon._firstLastColumn(tid, sheetIdx);
            xlObj.XLRibbon._isFirstColumn = false;
        },
        lastColumn: function (tableName, sheetIdx) {
             var xlObj = this.XLObj, tid = xlObj._getTableID(null,tableName);
             xlObj.XLRibbon._firstLastColumn(tid, sheetIdx);
        },
        totalRow: function(tableName, sheetIdx) {
             var xlObj = this.XLObj, tid = xlObj._getTableID(null,tableName), sheet = xlObj.getSheet(sheetIdx);
             xlObj.XLRibbon._totalRow(tid,sheetIdx)
                     },
        filterButton: function(tableName, sheetIdx, isFilter) {
             var xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx), tmgr = sheet.tableManager, tid = xlObj._getTableID(null,tableName);
             xlObj.XLFilter._clearFilterTableIcon(sheetIdx,tid);
             tmgr[tid]["isFilter"] = isFilter;
        },
        _updateTblStyleOptns: function (tdId, tbObj) {
            var tmgrDt, tRange, fstCol = "firstColumn", lstCol = "lastColumn", bold = "bold", normal = "normal", trow = "totalRow",
                isFilter = "isFilter", xlObj = this.XLObj, sheetIdx = xlObj._getSheetIndex(), sheet = xlObj.getSheet(sheetIdx), tmgr = sheet.tableManager;
            if (tdId in tmgr) {
                tmgrDt = tmgr[tdId];
                tRange = tmgrDt.range;
                tmgrDt[isFilter] = isFilter in tbObj ? tbObj.isFilter : ("showHeaderRow" in tbObj ? tbObj["showHeaderRow"] : true);
                if (xlObj.model.allowFiltering && !tmgrDt[isFilter])
                    xlObj.XLFilter._clearFilterTableIcon(sheetIdx, tdId);
                xlObj._dupDetails = true;
                if (fstCol in tbObj) {
                    tmgrDt[fstCol] = tbObj.firstColumn;
                    this.format({ style: { "font-weight": tmgrDt[fstCol] ? bold : normal } }, xlObj._getProperAlphaRange(sheetIdx, tRange[0] + 1, tRange[1], tRange[2], tRange[1]));
                }
                if (lstCol in tbObj) {
                    tmgrDt[lstCol] = tbObj.lastColumn;
                    this.format({ style: { "font-weight": tmgrDt[lstCol] ? bold : normal } }, xlObj._getProperAlphaRange(sheetIdx, tRange[0] + 1, tRange[3], tRange[2], tRange[3]));
                }
                xlObj._dupDetails = false
                if (trow in tbObj)
                    tmgrDt[trow] = tbObj.totalRow;
            }
        },

        removeTable: function (tableId) {
			var xlObj = this.XLObj;
			if (!xlObj.model.allowFormatAsTable || xlObj.model.isReadOnly)
                return;
            var tclass, cells, len, formats, tformats, borders, tborders, i = 0, sheetIdx = xlObj.getActiveSheetIndex(), tmgr = xlObj.getSheet(sheetIdx).tableManager, range = tmgr[tableId].range, name = tmgr[tableId].name, fltrColElem = xlObj.element.find("#" + xlObj._id + "_Ribbon_tsofiltercolumn");
            this._updateTableFormula("removeTable", tmgr[tableId],sheetIdx);
			if (tableId in tmgr) {               
                xlObj.clearRangeData(range, ["tableName"]);
                cells = xlObj._getSelectedRange({ rowIndex: range[0], colIndex: range[1] }, { rowIndex: range[2], colIndex: range[3] });
                len=cells.length;
                if (len){
                    while (i < len){
                        formats = xlObj.XLEdit.getPropertyValue(cells[i].rowIndex, cells[i].colIndex, "formats");
                        tformats = xlObj.XLEdit.getPropertyValue(cells[i].rowIndex, cells[i].colIndex, "tformats");
                        borders = xlObj.XLEdit.getPropertyValue(cells[i].rowIndex, cells[i].colIndex, "borders");
                        tborders = xlObj.XLEdit.getPropertyValue(cells[i].rowIndex, cells[i].colIndex, "tborders");
                        if (tformats) {
                            $.extend(tformats, formats);
                            xlObj.XLEdit._updateDataContainer(cells[i], { dataObj: { formats: tformats } });
                        }

                        if (tborders) {
                            $.extend(tborders, borders);
                            xlObj.XLEdit._updateDataContainer(cells[i], { dataObj: { borders: tborders } });
                        }
                        xlObj.XLEdit._clearDataContainer({ cellIdx:{rowIndex:cells[i].rowIndex,colIndex:cells[i].colIndex}, property: ["tformats", "tborders"] });
                        i++;
                    }
                }
                if (xlObj.model.allowFiltering && !xlObj._isFATResize)
                    xlObj.XLFilter._clearFilterTable(sheetIdx, parseInt(tableId));
                delete tmgr[tableId];
                delete xlObj.model.sheets[sheetIdx]._header[tableId];
                xlObj.XLRibbon.removeNamedRange(name);
                fltrColElem.length && fltrColElem.ejCheckBox("option", { checked: false });
                xlObj.XLRibbon._toggleDesignTab(xlObj.getActiveCell(sheetIdx));
            }
        },

        _renameTable: function (cname) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), tmgr = xlObj.getSheet(sheetIdx).tableManager, tid = xlObj._getTableID(cname), tname, trange, details, robj = $('#' + xlObj._id + '_Ribbon').data('ejRibbon'), newName;
            if (tid) {
                newName = document.getElementById(xlObj._id + '_Ribbon_Design_Properties_TableName') && document.getElementById(xlObj._id + '_Ribbon_Design_Properties_TableName').value;
                tname = tmgr[tid].name;
                if (tname != newName) {
                    trange = xlObj._getDollarAlphaRange(tmgr[tid].range, true);
                    if (xlObj.XLRibbon._validateNamedRange(newName, trange)) {
                        details = { sheetIndex: sheetIdx, reqType: "format-table", action: "renaming", range: trange, tableId: parseInt(tid), prevName: tname };
                        xlObj.XLRibbon.removeNamedRange(tname);
                        tmgr[tid].name = newName;
                        xlObj.XLRibbon.addNamedRange(tmgr[tid].name, trange, null, sheetIdx);
						this._updateTableFormula("rename", tmgr[tid],sheetIdx, tname);
                        details.newName = tmgr[tid].name;
                        robj.showTab(xlObj._getLocStr('Design'));
                        xlObj._completeAction(details);
                        xlObj._trigActionComplete(details);
                    }
                }
            }
        },

        _getTableLayoutFromName: function (name) {
            if (!name)
                return;
            return this.XLObj._FATStyles[name];
        },

        _getTableIdxFromName: function (name) {
            var xlObj = this.XLObj, tmgr = xlObj.getSheet(xlObj.getActiveSheetIndex()).tableManager,
                len = xlObj.getObjectLength(tmgr);
            if (len) {
                while (len--) {
                    if (tmgr[len].name === name)
                        return len;
                }
            }
            return -1;
        },

        convertToRange: function (options) {
			var xlObj = this.XLObj;
			if(xlObj.model.isReadOnly)
				return;
            if (options.alert)
                xlObj._showAlertDlg("", "ConverToRangeAlert", "ConvertToRange", 498);
            else
                this._convertToRange(options);
        },

        _convertToRange: function(options) {
            var i, tableId, xlObj = this.XLObj, sheetIdx = options.sheetIdx || xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), tid, details,
            tmgr = xlObj.getSheet(sheetIdx).tableManager, tableRange = sheet.filterSettings.tableRange;
            tid = options.tableId || xlObj._getTableID(null, document.getElementById(xlObj._id + '_Ribbon_Design_Properties_TableName') && document.getElementById(xlObj._id + '_Ribbon_Design_Properties_TableName').value);
            for (i = 0; i < tableRange.length; i++)
                tableRange[i].tableID == tid && (tableId = i);
            if (xlObj.getObjectLength(tmgr))
                details = {
                    sheetIndex: sheetIdx, reqType: "format-table", action: "Design_Tools_ConvertToRange", beforeFormat: xlObj.XLFormat.getHashCodeClassAsArray(),
                    tableID: tid, name: tmgr[tid].name, format: tmgr[tid].format, formatName: tmgr[tid].formatName, tableRange: tableRange[tableId], beforeRange: tmgr[tid].range,
                    isFilter: tmgr[tid].isFilter, header: $.extend(true, [], sheet._header[tid]), firstColumn: tmgr[tid].firstColumn, lastColumn: tmgr[tid].lastColumn, totalRow: tmgr[tid].totalRow, fnNumber: tmgr[tid].fnNumber
                };
            if (xlObj.isNumber(tid))
                xlObj.XLFormat.removeTable(tid);
            xlObj.model.showRibbon && xlObj.XLRibbon._toggleDesignTab(xlObj.getActiveCell());
            xlObj._completeAction(details);
            xlObj._trigActionComplete(details);
        },

        _calculateTotalRow: function (sheetIdx, tid, isChecked, isShift, isOk) {
            var i, xlObj = this.XLObj, cells, pCells = [], cCells = [], aRange, tRange, range, isString = false, rData, sheet = xlObj.getSheet(sheetIdx), tmgr = sheet.tableManager, insAlert, selCells = sheet._selectedCells,
                details, chkboxId = xlObj._id + "_Ribbon_Design_TableStyleOptions_TotalRow", chkBoxObj = $("#" + chkboxId).data("ejCheckBox"), startCell, endCell, isUndo = xlObj._isUndo, isUndoRedo = xlObj._isUndoRedo, isDupDetails = xlObj._dupDetails;
            tid = tid || parseInt(document.getElementById(xlObj._id + '_tableid').value);
            range = tmgr[tid].range;
            pCells.push(xlObj.getRangeData({ range: [range[2] + 1, range[1], range[2] + 1, range[3]] }))
            aRange = xlObj._getProperAlphaRange(sheetIdx, range[0] + 1, range[3], range[2], range[3]);
            cells = xlObj._getSelectedRange({ rowIndex: range[2] + 1, colIndex: range[1] }, { rowIndex: range[2] + 1, colIndex: range[3] });
            if (isChecked) {
                startCell = { rowIndex: range[2] + 1, colIndex: range[1] };
                endCell = { rowIndex: range[2] + 1, colIndex: range[3] };
                xlObj._dupDetails = xlObj._isTotalRow = true;
                xlObj._insRows = { startRow: startCell.rowIndex, endRow: endCell.rowIndex };
                xlObj._isUndo = false;
                if (!isOk) {
                    insAlert = xlObj.insertShiftBottom(startCell, endCell);
                    if (insAlert)
                        return;
                }
                xlObj._isUndo = isUndo;
                xlObj._isUndoRedo = isUndoRedo;
                xlObj._dupDetails = xlObj._isTotalRow = false;
                if (!xlObj._isFilterApplied || xlObj._insDelStatus == "insert") {
                    if (cells.length > 1)
                        xlObj.XLEdit._updateCellValue(cells[0], isChecked ? 'Total' : '');
                    if (!tmgr[tid]["fnNumber"] && isChecked) {
                        rData = ej.distinct(xlObj.getRangeData({ range: xlObj.getRangeIndices(aRange), valueOnly: true }));
                        rData = rData.filter(Boolean);
                        i = rData.length;
                        if (i) {
                            while (i--) {
                                if (!xlObj.isNumber(rData[i])) {
                                    isString = true;
                                    break;
                                }
                            }
                        }
                        else
                            isString = true;
                        tmgr[tid]["fnNumber"] = isString ? 103 : 109;
                    }
                    xlObj.XLEdit._updateCellValue(cells[cells.length - 1], isChecked ? '=SUBTOTAL(' + tmgr[tid]["fnNumber"] + ',' + aRange + ')' : '');
                    tmgr[tid].range[2] += 1;
                    xlObj._insDelStatus == "";
                }
            }
            else {
                startCell = { rowIndex: range[2], colIndex: range[1] };
                endCell = { rowIndex: range[2], colIndex: range[3] };
                xlObj._dupDetails = xlObj._isTotalRow = true;
				if(xlObj.model.allowFiltering)
				    xlObj.XLFilter._checkFilterApplied(sheetIdx, startCell.rowIndex, 1, startCell.colIndex, 1, "filter");
				xlObj._checkTableApplied(sheetIdx, startCell.rowIndex, 1, startCell.colIndex, 1, "shiftUp");
				if (xlObj._isFilterApplied || xlObj._isTableApplied) {
				    xlObj._intrnlReq = true;
				    xlObj._isUndo = false;
				    xlObj.deleteEntireRow(startCell.rowIndex, endCell.rowIndex);
				    xlObj._isUndo = isUndo;
				    xlObj._intrnlReq = false;
				    isShift = false;
				}
				else
				    xlObj._deleteShiftUp(sheetIdx, startCell, endCell, { startCol: startCell.colIndex, colCount: (endCell.colIndex - startCell.colIndex) + 1, startRow: startCell.rowIndex, rowCount: (endCell.rowIndex - startCell.rowIndex) + 1, status: "shiftUp" });
				xlObj._isTotalRow = false;
				tmgr[tid].range[2] -= 1;
            }
            xlObj._dupDetails = isDupDetails;
            isChecked ? tmgr[tid]["totalRow"] = true : "totalRow" in tmgr[tid] && delete tmgr[tid]["totalRow"];
            tRange = tmgr[tid].range;
            xlObj.XLFormat._createTable(tid, { format: tmgr[tid].format });
			this._updateTableFormula("totalRow", tmgr[tid], sheetIdx);
            cCells.push(xlObj.getRangeData({ range: [tRange[2] + 1, tRange[1], tRange[2] + 1, tRange[3]] }))
            details = { sheetIndex: sheetIdx, reqType: "format-table", action: "totalrow", range: aRange, check: isChecked, id: chkboxId, cell: cells, tmgr: tmgr, tableId: tid, pcells: pCells[0], curCells: cCells[0], fnNumber: tmgr[tid]["fnNumber"] , isShift: isShift};
            if(isOk)
                xlObj._dupDetails = xlObj._isUndoRedo = false;
            if (!xlObj._dupDetails) {
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
			xlObj.performSelection({ rowIndex: selCells[0].rowIndex, colIndex: selCells[0].colIndex }, { rowIndex: selCells[selCells.length - 1].rowIndex, colIndex: selCells[selCells.length - 1].colIndex });
            xlObj._dupDetails = false;
        },

        _updateTotalRow: function (sheetIdx, tblId, fnNumber, range, isClear) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx), tmgr = sheet.tableManager;
            tmgr[tblId].fnNumber = fnNumber;
            isClear && xlObj._clearFormula(range[2], range[3]);
            xlObj.XLEdit._updateCellValue({ rowIndex: range[2], colIndex: range[3] }, '=SUBTOTAL(' + tmgr[tblId].fnNumber + ',' + xlObj._getAlphaRange(sheetIdx, range[0] + 1, range[3], range[2] - 1, range[3]) + ')');
        },

        customFormatParser: function (input) {
            if (!this.XLObj.model.allowCellFormatting)
                return;
            var str, type, splitter, formatObj = {}, ctype = ej.Spreadsheet.CellType, pre = "{0:", suf = "}", n = "N",
                p = "P", d = ".", c = ",", z = "0";
            input = ej.isNullOrUndefined(input) ? "" : input.toString();
            if (Number(input) === 0) {
                if (input.indexOf(d) > -1) {
                    splitter = input.split(d);
                    str = pre + n + splitter[1].length + suf;
                }
                else
                    str = pre + "D" + input.length + suf;
                type = ctype.Number;
            }
            else if (!input.indexOf("#") && input.indexOf(c) > -1 && input.lastIndexOf(z) === input.length - 1) {
                if (input.indexOf(d) > -1) {
                    splitter = input.split(d);
                    str = pre + n + splitter[1].length + suf;
                }
                else
                    str = pre + n + z + suf;
                formatObj["thousandSeparator"] = true;
                type = ctype.Number;
            }
            else if (input.lastIndexOf("%") === input.length - 1 && Number(input.replace(/%/g, "")) === 0) {
                if (input.indexOf(d) > -1) {
                    splitter = input.split(d);
                    str = pre + p + --splitter[1].length + suf;
                }
                else
                    str = pre + p + z + suf;
                type = ctype.Percentage;
            }
            else if (/^[dMy/\-\s,]+$/.test(input)) {
                str = pre + input + suf;
                type = ctype.Date;
            }
            else if (/^[hmst:\s]+$/.test(input)) {
                str = pre + input + suf;
                type = ctype.Time;
            }
            else if (input.indexOf("\\")>-1)
            {
                formatObj["formatStr"] = input;
                formatObj["type"] = "string";
            }
            if (str) {
                formatObj["formatStr"] = str;
                formatObj["type"] = type;
            }
            return formatObj;
        },

        addCustomFormatSpecifier: function (name, formatSpecifier, type) {
            var i, cellTypes = ej.Spreadsheet.CellType, culture = ej.preferredCulture(this.XLObj.model.locale);
            if ([cellTypes.Date, cellTypes.DateTime, cellTypes.LongDate, cellTypes.ShortDate, cellTypes.Time].indexOf(type) > -1) {
                for (i in culture.calendar.patterns)
                    if (culture.calendar.patterns[i] == formatSpecifier)
                        return;
                if (!name)
                    name = "cDFrmt" + Object.keys(culture.calendar.patterns).length;
                culture.calendar.patterns[name] = formatSpecifier;
                ej.globalize._getDateParseRegExp(culture.calendar, formatSpecifier);
                this._customFormatSpecifierType[name] = type;
            }
        },

        addFontFamily: function (fontName) {
            var key, ddObj, ddDataSrc, selectedIdx, ddText = fontName, customFont = this._customFontFamily, xlObj = this.XLObj, fontVal = 49, tVal;
            fontName = fontName.toLowerCase();
            if (xlObj.isUndefined(customFont[fontName])) {
                for (key in customFont) {
                    tVal = parseInt(customFont[key]);
                    if (tVal > fontVal)
                        fontVal = tVal;
                }
                fontVal++;
                if (xlObj.model.showRibbon) {
                    ddObj = $("#" + xlObj._id + "_Ribbon_Home_Font_FontFamily").data("ejDropDownList");
                    ddDataSrc = $.extend(true, [], xlObj.XLRibbon._fontFamily);
                    ddDataSrc.push({ text: ddText, value: fontVal });
                    if (ddObj) {
                        selectedIdx = ddObj.model.selectedItemIndex;
                        ddObj.option({ dataSource: ddDataSrc });
                        ddObj._initValue = true;
                        ddObj.selectItemByIndex(selectedIdx);
                        ddObj._initValue = false;
                        xlObj.XLRibbon._fontFamily = ddDataSrc;
                    }
                }
                customFont[fontName] = fontVal + "";
                ej.Spreadsheet.FontFamily[fontName] = fontVal + "";
            }
        },

        removeFontFamily: function (fontName) {            
            var i, ddObj, customFont = this._customFontFamily, xlObj = this.XLObj, ddDataSrc, selectedIdx;
            if (xlObj.model.showRibbon) {
                ddObj = $("#" + xlObj._id + "_Ribbon_Home_Font_FontFamily").data("ejDropDownList");
                ddDataSrc = $.extend(true, [], xlObj.XLRibbon._fontFamily);
                for (i = 0; i < ddDataSrc.length; i++) {
                    if (ddDataSrc[i]["text"] === fontName) {
                        ddDataSrc.splice(i, 1);
                        if (ddObj) {
                            selectedIdx = ddObj.model.selectedItemIndex;
                            ddObj.option({ dataSource: ddDataSrc });
                            ddObj._initValue = true;
                            ddObj.selectItemByIndex(selectedIdx);
                            ddObj._initValue = false;
                        }
                        xlObj.XLRibbon._fontFamily = ddDataSrc;
                        break;
                    }
                }
            }
            fontName = fontName.toLowerCase();
            if (!xlObj.isUndefined(customFont[fontName])) {
                delete customFont[fontName];
                if (!xlObj.isUndefined(ej.Spreadsheet.FontFamily[fontName]))
                    delete ej.Spreadsheet.FontFamily[fontName];
            }
        },

        applyBorder: function (options, range, details) {
			var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx);
			if (!xlObj.model.allowCellFormatting || !xlObj.model.formatSettings.allowCellBorder || (sheet._isLoaded && xlObj.model.isReadOnly))
                return;
            range = xlObj._getRangeArgs(range, "object", sheetIdx);
            if (!sheet._isImported || sheet._isLoaded) {
                if (!details)
                    details = { sheetIndex: sheetIdx, reqType: "cell-format", process: "border", options: $.extend(true, {}, options) };
                details.range = range;
                details.beforeFormat = this.getHashCodeClassAsArray(range);
                details.property = options.property;
                details.prevHeight = [];
                details.newHeight = [];
                delete options.property;
            }
            if (xlObj.getObjectLength(options)) {
                if (options.isGridBorder)
                    this._applyAllBorderCss(options, range, details);
                else
                    this._applyBorderCss(options, range, details)
            }
            else
                this.removeStyle(range, { cellStyle: true, border: true, sheetIdx: sheetIdx });
            if ((!sheet._isImported || sheet._isLoaded) && !xlObj._isUndoRedo) {
                xlObj._refreshRangeTRHght(sheetIdx, range);
                if (ej.isNullOrUndefined(options.tableID) && !this._dupDetails) {
                    details.afterFormat = this.getHashCodeClassAsArray(range);
                    if (!xlObj._intrnlReq) {
                        xlObj._completeAction(details);
                        xlObj._trigActionComplete(details);
                    }
                }
            }
        },

        updateDecimalPlaces: function (type, range) {
			var xlObj = this.XLObj;
			if (!xlObj.model.allowCellFormatting || !xlObj.model.formatSettings.allowDecimalPlaces || xlObj.model.isReadOnly)
                return;
            var len, cell, temp, cells, rowIdx, colIdx, dataAttr, i = 0, obj = {}, cellObj,
                sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), container = xlObj._dataContainer,
                details = { action: "decimal", reqType: "cell-format", sheetIndex: sheetIdx, oprType: "format" }, selCells = [];
            range = xlObj._getRangeArgs(range, "object");
            cells = xlObj._getSelectedCells(sheetIdx, range).selCells;
            len = cells.length;
            while (i < len) {
                rowIdx = cells[i].rowIndex; colIdx = cells[i].colIndex;
                dataAttr = xlObj.getRangeData({ range: [rowIdx, colIdx, rowIdx, colIdx] })[0];
                cell = { rowIndex: rowIdx, colIndex: colIdx, afterFormat: {}, beforeFormat: {} };
                cellObj = xlObj._dataContainer.sheets[sheetIdx][rowIdx][colIdx];
                $.extend(true, cell.beforeFormat, cellObj);
                if (xlObj.isNumber(dataAttr.value)) {
                    if (xlObj.isUndefined(dataAttr.decimalPlaces))
                        dataAttr.decimalPlaces = xlObj._decimalCnt(dataAttr.value);
                    obj["type"] = dataAttr.type === ej.Spreadsheet.CellType.General ? ej.Spreadsheet.CellType.Number : dataAttr.type;
                    obj["decimalPlaces"] = dataAttr.decimalPlaces = type === "DecreaseDecimal" ? (dataAttr.decimalPlaces > 0 ? dataAttr.decimalPlaces - 1 : dataAttr.decimalPlaces) : dataAttr.decimalPlaces + 1;
                    obj["formatStr"] = xlObj._getFormatString(obj.type, obj.decimalPlaces);
                    temp = this._format(dataAttr.value, { formatStr: obj.formatStr, type: obj.type, thousandSeparator: dataAttr.thousandSeparator, decimalPlaces: obj.decimalPlaces });
                    obj["value2"] = temp;
                    if (xlObj.XLResize && xlObj.XLResize._getContentWidth(colIdx, sheetIdx, 0, xlObj.getSheet(sheetIdx).usedRange.rowIndex) >= (sheet.columnsWidthCollection[colIdx] - 5)) {
                        xlObj._dupDetails = true;
                        xlObj.XLResize._fitWidth(colIdx);
                        xlObj._dupDetails = false;
                        xlObj.XLSelection.refreshSelection();
                        if (xlObj.model.allowAutoFill)
                            xlObj.XLDragFill.positionAutoFillElement();
                    }
                    xlObj.XLEdit._updateDataContainer({ rowIndex: rowIdx, colIndex: colIdx }, { dataObj: obj });
                    cell.beforeFormat.Oprtype = obj.type;
                }
                dataAttr = xlObj.getRangeData({ range: [rowIdx, colIdx, rowIdx, colIdx] })[0];
                cellObj = xlObj._dataContainer.sheets[sheetIdx][rowIdx][colIdx];
                $.extend(true, cell.afterFormat, cellObj);
                cell.afterFormat.Oprtype = cell.beforeFormat.Oprtype;
                selCells.push(cell);
                i++;
            }
            details.selectedCell = selCells;
            if (!xlObj._isUndoRedo) {
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
        },

        getFormatClass: function (classname, isborder) {
            var str = isborder ? "e-border" : "e-format", regx = new RegExp('\\b' + str + '.*?\\b', 'g');
            return classname.indexOf(str) !== -1 ? classname.match(regx)[0] : "";
        },

        getHashCodeClassAsArray: function (range) {
            var cells, len, cname, i = 0, obj = { format: [] }, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), arr = ["topborder", "leftborder"];
            range = xlObj._toIntrnlRange(range, sheetIdx);
            range = range ? xlObj.swapRange(range) : xlObj.getSheet(sheetIdx).selectedRange;
            cells = xlObj.getRange(range), len = cells.length;
            while (i < len) {
                cname = cells[i].className;
                obj.format.push(this.getFormatClass(cname) + " " + this.getFormatClass(cname, true));
                i++;
            }
            i = 2;
            while (i--)
                obj[arr[i]] = this._getBorderArray(range, arr[i]);
            return obj;
        },

        _getBorderArray: function (range, position) {
            var length, i = 0, arr = [], xlObj = this.XLObj, str = "topborder", minindex = position === str ? range[0] - 1 : range[1] - 1, cells;
            if (minindex >= 0) {
                cells = position === str ? xlObj.getRange([range[0] - 1, range[1], range[0] - 1, range[3]]) : xlObj.getRange([range[0], range[1] - 1, range[2], range[1] - 1]);
                length = cells.length;
                while (i < length) {
                    arr.push(this.getFormatClass(cells[i].className, true));
                    i++;
                }
            }
            else {
                length = position === str ? (range[3] - range[1]) + 1 : (range[2] - range[0]) + 1;
                while (length--)
                    arr.push("");
            }
            return arr;
        },

        removeStyle: function (range, options) {
            var xlObj = this.XLObj;
            if (xlObj.model.isReadOnly)
                return;
            options = options || { cellStyle: true, tableStyle: true, format: true, border: true };
            var cells, len, idx, cellIdx, hcode, styles, cstyles, tstyles, hstyles, ncstyles, ntstyles, props, maxr, maxc, canRemove, canClear, i = 0, pos = this._borderPosition,
                sheetIdx = xlObj._getSheetIndex(options.sheetIdx), sheet = xlObj.getSheet(sheetIdx), curSheetIdx = xlObj.getActiveSheetIndex();
            range = xlObj._getRangeArgs(range, "object");
            cells = xlObj._getSelectedCells(sheetIdx, range).selCells;           
            len = cells.length;
            if (options.sheetIdx && options.sheetIdx != curSheetIdx)
                xlObj.gotoPage(options.sheetIdx, false);
            while (i < len) {
                canRemove = false;
                cellIdx = cells[i];
                if (!options.skipHiddenRow || !xlObj._isHiddenRow(cellIdx.rowIndex, options.sheetIdx)) {
                    if (options.format) {
                        if (options.cellStyle && options.tableStyle)
                            xlObj.XLEdit._clearDataContainer({ cellIdx: cellIdx, property: ["format", "formats", "tformats"], sheetIdx: options.sheetIdx });
                        else if ((options.cellStyle && xlObj._hasCellStyle(cellIdx.rowIndex, cellIdx.colIndex, options.sheetIdx) || (options.tableStyle && xlObj._isTableRange(cellIdx.rowIndex, cellIdx.colIndex, options.sheetIdx)))) {
                            props = [options.cellStyle ? "formats" : "tformats"];
                            styles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, options.cellStyle ? "tformats" : "formats", options.sheetIdx);
                            if (styles) {
                                hcode = this.getFormatHashCode(styles);
                                this._updateFormatClass(cellIdx, hcode);
                            }
                            else
                                props.push("format");
                            xlObj.XLEdit._clearDataContainer({ cellIdx: cellIdx, property: props, sheetIdx: options.sheetIdx });
                        }
                    }
                    if (options.border) {
                        if (options.cellStyle && options.tableStyle) {
                            cstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "borders", options.sheetIdx) || {};
                            tstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "tborders", options.sheetIdx) || {};
                            $.extend(tstyles, cstyles);                            
                            if (pos[0] in tstyles && cellIdx.rowIndex) {
                                idx = cellIdx.rowIndex - 1;
                                hcode = xlObj.XLEdit.getPropertyValue(idx, cellIdx.colIndex, "border", options.sheetIdx);
                                hstyles = this.getBorderFromHashCode(hcode);
                                ncstyles = xlObj.XLEdit.getPropertyValue(idx, cellIdx.colIndex, "borders", options.sheetIdx) || {};
                                ntstyles = xlObj.XLEdit.getPropertyValue(idx, cellIdx.colIndex, "tborders", options.sheetIdx) || {};
                                $.extend(ntstyles, ncstyles);
                                this._remStyle(idx, cellIdx.colIndex, ntstyles, hstyles, "bottom", "bottom", true);
                                canRemove = true;
                            }                            
                            if (pos[1] in tstyles) {
                                canClear = true;
                                idx = cellIdx.colIndex + 1;
                                hcode = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "border", options.sheetIdx);
                                hstyles = this.getBorderFromHashCode(hcode);
                                if (idx < sheet.colCount) {
                                    ncstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, idx, "borders", options.sheetIdx) || {};
                                    ntstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, idx, "tborders", options.sheetIdx) || {};
                                    $.extend(ntstyles, ncstyles);
                                    if (pos[3] in ntstyles) {
                                        if (hstyles.right != ntstyles.left) {
                                            hstyles.right = ntstyles.left;
                                            hcode = this._getBorderHashCode(hstyles);
                                            this._updateFormatClass(cellIdx, hcode, true);
                                        }
                                        canClear = false;
                                    }
                                }
                                if (canClear) {                                    
                                    delete hstyles.right;
                                    if (xlObj.getObjectLength(hstyles)) {
                                        hcode = this._getBorderHashCode(hstyles);
                                        this._updateFormatClass(cellIdx, hcode, true);
                                    }
                                    else
                                        xlObj.XLEdit._clearDataContainer({ cellIdx: cellIdx, property: ["border"] });
                                }
                                canRemove = true;
                            }
                            if (pos[2] in tstyles) {
                                canClear = true;
                                idx = cellIdx.rowIndex + 1;
                                hcode = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "border", options.sheetIdx);
                                hstyles = this.getBorderFromHashCode(hcode);
                                if (idx < sheet.rowCount) {
                                    ncstyles = xlObj.XLEdit.getPropertyValue(idx, cellIdx.colIndex, "borders", options.sheetIdx) || {};
                                    ntstyles = xlObj.XLEdit.getPropertyValue(idx, cellIdx.colIndex, "tborders", options.sheetIdx) || {};
                                    $.extend(ntstyles, ncstyles);
                                    if (pos[0] in ntstyles) {
                                        if (hstyles.bottom != ntstyles.top) {
                                            hstyles.bottom = ntstyles.top;
                                            hcode = this._getBorderHashCode(hstyles);
                                            this._updateFormatClass(cellIdx, hcode, true);
                                        }
                                        canClear = false;
                                    }
                                }
                                if (canClear) {
                                    delete hstyles.bottom;
                                    if (xlObj.getObjectLength(hstyles)) {
                                        hcode = this._getBorderHashCode(hstyles);
                                        this._updateFormatClass(cellIdx, hcode, true);
                                    }
                                    else
                                        xlObj.XLEdit._clearDataContainer({ cellIdx: cellIdx, property: ["border"] });
                                }
                                canRemove = true;
                            }
                            if (pos[3] in tstyles && cellIdx.colIndex) {
                                idx = cellIdx.colIndex - 1;
                                hcode = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, idx, "border", options.sheetIdx);
                                hstyles = this.getBorderFromHashCode(hcode);
                                ncstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, idx, "borders", options.sheetIdx) || {};
                                ntstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, idx, "tborders", options.sheetIdx) || {};
                                $.extend(ntstyles, ncstyles);
                                this._remStyle(cellIdx.rowIndex, idx, ntstyles, hstyles, "right", "right", true);
                                canRemove = true;
                            }
                            if(canRemove)
                                xlObj.XLEdit._clearDataContainer({ cellIdx: cellIdx, property: ["borders", "tborders"] });
                        }
                        else if (options.cellStyle) {                          
                            cstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "borders", options.sheetIdx) || {};
                            tstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "tborders", options.sheetIdx) || {};
                            if (pos[0] in cstyles && cellIdx.rowIndex) {
                                idx = cellIdx.rowIndex - 1;
                                hcode = xlObj.XLEdit.getPropertyValue(idx, cellIdx.colIndex, "border", options.sheetIdx);
                                hstyles = this.getBorderFromHashCode(hcode);
                                ncstyles = xlObj.XLEdit.getPropertyValue(idx, cellIdx.colIndex, "borders", options.sheetIdx) || {};
                                ntstyles = xlObj.XLEdit.getPropertyValue(idx, cellIdx.colIndex, "tborders", options.sheetIdx) || {};
                                $.extend(ntstyles, ncstyles);
                                if ("bottom" in ntstyles) {
                                    if (cstyles.bottom === hstyles.bottom) {
                                        if ("top" in tstyles) {                                            
                                            hstyles.bottom = tstyles.top;
                                            hcode = this._getBorderHashCode(hstyles);
                                            this._updateFormatClass({ rowIndex: idx, colIndex: cellIdx.colIndex }, hcode, true);
                                        }
                                        else if (ntstyles.bottom != hstyles.bottom) {
                                            hstyles.bottom = ntstyles.bottom;
                                            hcode = this._getBorderHashCode(hstyles);
                                            this._updateFormatClass({ rowIndex: idx, colIndex: cellIdx.colIndex }, hcode, true);
                                        }
                                    }
                                }
                                else
                                    this._remStyle(idx, cellIdx.colIndex, ntstyles, hstyles, "top", "bottom");
                                canRemove = true;
                            }
                            if (pos[1] in cstyles) {
                                idx = cellIdx.colIndex + 1;
                                hcode = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "border", options.sheetIdx);
                                hstyles = this.getBorderFromHashCode(hcode);
                                if (idx < sheet.colCount) {
                                    ncstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, idx, "borders", options.sheetIdx) || {};
                                    ntstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, idx, "tborders", options.sheetIdx) || {};
                                    $.extend(ntstyles, ncstyles);
                                    if ("left" in ntstyles) {
                                        if (cstyles.right === hstyles.right) {
                                            if ("right" in tstyles) {
                                                hstyles.right = tstyles.right;
                                                hcode = this._getBorderHashCode(hstyles);
                                                this._updateFormatClass(cellIdx, hcode, true);
                                            }
                                            else if (ntstyles.left != hstyles.right) {
                                                hstyles.right = ntstyles.left;
                                                hcode = this._getBorderHashCode(hstyles);
                                                this._updateFormatClass(cellIdx, hcode, true);
                                            }
                                        }
                                    }
                                    else
                                       this._remStyle(cellIdx.rowIndex, cellIdx.colIndex, tstyles, hstyles, "right", "right");
                                }
                                else
                                    this._remStyle(cellIdx.rowIndex, cellIdx.colIndex, tstyles, hstyles, "right", "right");
                                canRemove = true;
                            }
                            if (pos[2] in cstyles) {
                                idx = cellIdx.rowIndex + 1;
                                hcode = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "border", options.sheetIdx);
                                hstyles = this.getBorderFromHashCode(hcode);
                                if (idx < sheet.rowCount) {
                                    ncstyles = xlObj.XLEdit.getPropertyValue(idx, cellIdx.colIndex, "borders", options.sheetIdx) || {};
                                    ntstyles = xlObj.XLEdit.getPropertyValue(idx, cellIdx.colIndex, "tborders", options.sheetIdx) || {};
                                    $.extend(ntstyles, ncstyles);
                                    if ("top" in ntstyles) {
                                        if (cstyles.bottom === hstyles.bottom) {
                                            if ("bottom" in tstyles) {
                                                hstyles.bottom = tstyles.bottom;
                                                hcode = this._getBorderHashCode(hstyles);
                                                this._updateFormatClass(cellIdx, hcode, true);
                                            }
                                            else if (ntstyles.top != hstyles.bottom) {
                                                hstyles.bottom = ntstyles.top;
                                                hcode = this._getBorderHashCode(hstyles);
                                                this._updateFormatClass(cellIdx, hcode, true);
                                            }
                                        }
                                    }
                                    else
                                        this._remStyle(cellIdx.rowIndex, cellIdx.colIndex, tstyles, hstyles, "bottom", "bottom");
                                }
                                else
                                    this._remStyle(cellIdx.rowIndex, cellIdx.colIndex, tstyles, hstyles, "bottom", "bottom");
                                canRemove = true;
                            }
                            if (pos[3] in cstyles && cellIdx.colIndex) {
                                idx = cellIdx.colIndex - 1;
                                hcode = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, idx, "border", options.sheetIdx);
                                hstyles = this.getBorderFromHashCode(hcode);
                                ncstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, idx, "borders", options.sheetIdx) || {};
                                ntstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, idx, "tborders", options.sheetIdx) || {};
                                $.extend(ntstyles, ncstyles);
                                if ("right" in ntstyles) {
                                    if (cstyles.left === hstyles.right) {
                                        if ("left" in tstyles) {
                                            hstyles.right = tstyles.left;
                                            hcode = this._getBorderHashCode(hstyles);
                                            this._updateFormatClass({ rowIndex: cellIdx.rowIndex, colIndex: idx }, hcode, true);
                                        }
                                        else if (ntstyles.right != hstyles.right) {
                                            hstyles.right = ntstyles.right;
                                            hcode = this._getBorderHashCode(hstyles);
                                            this._updateFormatClass({ rowIndex: cellIdx.rowIndex, colIndex: idx }, hcode, true);
                                        }
                                    }
                                }
                                        else
                                    this._remStyle(cellIdx.rowIndex, idx, tstyles, hstyles, "left", "right");
                                canRemove = true;
                            }
                            if (canRemove)
                                xlObj.XLEdit._clearDataContainer({ cellIdx: cellIdx, property: ["borders"] });
                            if (xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "merge", sheetIdx))
                                xlObj.XLEdit._clearDataContainer({ cellIdx: cellIdx, property: ["border"] });
                        }
                        else if (options.tableStyle) {
                            cstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "borders", options.sheetIdx) || {};
                            tstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "tborders", options.sheetIdx) || {};
                            if ("top" in tstyles && !("top" in cstyles) && cellIdx.rowIndex) {
                                idx = cellIdx.rowIndex - 1;
                                hcode = xlObj.XLEdit.getPropertyValue(idx, cellIdx.colIndex, "border", options.sheetIdx);
                                hstyles = this.getBorderFromHashCode(hcode);
                                ncstyles = xlObj.XLEdit.getPropertyValue(idx, cellIdx.colIndex, "borders", options.sheetIdx) || {};
                                ntstyles = xlObj.XLEdit.getPropertyValue(idx, cellIdx.colIndex, "tborders", options.sheetIdx) || {};
                                $.extend(ntstyles, ncstyles);
                                this._remStyle(idx, cellIdx.colIndex, ntstyles, hstyles, "bottom", "bottom", true);
                                canRemove = true;
                            }
                            if ("right" in tstyles && !("right" in cstyles)) {
                                idx = cellIdx.colIndex + 1;
                                hcode = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "border", options.sheetIdx);
                                hstyles = this.getBorderFromHashCode(hcode);
                                if (idx < sheet.colCount) {
                                    ncstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, idx, "borders", options.sheetIdx) || {};
                                    ntstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, idx, "tborders", options.sheetIdx) || {};
                                    $.extend(ntstyles, ncstyles);
                                    this._remStyle(cellIdx.rowIndex, cellIdx.colIndex, ntstyles, hstyles, "left", "right", true);
                                        }
                                    else {
                                        delete hstyles.right;
                                        if (xlObj.getObjectLength(hstyles)) {
                                            hcode = this._getBorderHashCode(hstyles);
                                            this._updateFormatClass(cellIdx, hcode, true);
                                        }
                                        else
                                            xlObj.XLEdit._clearDataContainer({ cellIdx: cellIdx, property: ["border"] });
                                    }
                                canRemove = true;
                            }
                            if ("bottom" in tstyles && !("bottom" in cstyles)) {
                                idx = cellIdx.rowIndex + 1;
                                hcode = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "border", options.sheetIdx);
                                hstyles = this.getBorderFromHashCode(hcode);
                                if (idx < sheet.rowCount) {
                                    ncstyles = xlObj.XLEdit.getPropertyValue(idx, cellIdx.colIndex, "borders", options.sheetIdx) || {};
                                    ntstyles = xlObj.XLEdit.getPropertyValue(idx, cellIdx.colIndex, "tborders", options.sheetIdx) || {};
                                    $.extend(ntstyles, ncstyles);
                                    this._remStyle(cellIdx.rowIndex, cellIdx.colIndex, ntstyles, hstyles, "top", "bottom", true);
                                        }
                                    else {
                                        delete hstyles.bottom;
                                        if (xlObj.getObjectLength(hstyles)) {
                                            hcode = this._getBorderHashCode(hstyles);
                                            this._updateFormatClass(cellIdx, hcode, true);
                                        }
                                        else
                                            xlObj.XLEdit._clearDataContainer({ cellIdx: cellIdx, property: ["border"] });
                                    }
                                canRemove = true;
                            }
                            if ("left" in tstyles && !("left" in cstyles) && cellIdx.colIndex) {
                                idx = cellIdx.colIndex - 1;
                                hcode = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, idx, "border", options.sheetIdx);
                                hstyles = this.getBorderFromHashCode(hcode);
                                ncstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, idx, "borders", options.sheetIdx) || {};
                                ntstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, idx, "tborders", options.sheetIdx) || {};
                                $.extend(ntstyles, ncstyles);
                                this._remStyle(cellIdx.rowIndex, idx, ntstyles, hstyles, "right", "right", true);
                                canRemove = true;
                            }
                            if (canRemove)
                                xlObj.XLEdit._clearDataContainer({ cellIdx: cellIdx, property: ["tborders"] });
                        }
                    }
                }
                i++;
            }
            if (options.sheetIdx && options.sheetIdx != curSheetIdx)
                xlObj.gotoPage(curSheetIdx, false);
        },

        _remStyle: function (rowIdx, colIdx, ntstyles, hstyles, type1, type2, isCond) {
            var xlObj = this.XLObj;
            if (type1 in ntstyles) {
				if(!isCond || (ntstyles[type1] != hstyles[type2])) {
                    hstyles[type2] = ntstyles[type1];
                    this._updateFormatClass({ rowIndex: rowIdx, colIndex: colIdx }, this._getBorderHashCode(hstyles), true);
                }
            }
            else {
                delete hstyles[type2];
                if (xlObj.getObjectLength(hstyles))
                    this._updateFormatClass({ rowIndex: rowIdx, colIndex: colIdx }, this._getBorderHashCode(hstyles), true);
                else
                    xlObj.XLEdit._clearDataContainer({ cellIdx: { rowIndex: rowIdx, colIndex: colIdx }, property: ["border"] });
            }
        },

        _refreshStyles: function (range, type, isTable) {
            var styles, tstyles, cssClass, frmt = "format", bdr = "border", frmts = "formats", bdrs = "borders", tfrmts = "tformats",
                tbdrs = "tborders", rgt = "right", btm = "bottom", isFormat = !type || type === frmt, isBorder = !type || type === bdr, xlObj = this.XLObj,
                cells = xlObj._getSelectedRange({ rowIndex: range[0], colIndex: range[1] }, { rowIndex: range[2], colIndex: range[3] }),
                i = cells.length;
            while (i--) {
                cellIdx = cells[i];
                if (isFormat) {
                    styles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, frmts) || {};
                    tstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, tfrmts) || {};
                    $.extend(tstyles, styles);
                    if (xlObj.getObjectLength(tstyles)) {
                        cssClass = this._createFormatClass(tstyles);
                        this._updateFormatClass(cellIdx, cssClass, false);
                    }
                    else if(xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, frmt))
                        xlObj.XLEdit._clearDataContainer({ cellIdx: cellIdx, property: [frmt] });
                }
                if (isBorder) {
                    styles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, bdrs) || {};
                    tstyles = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, tbdrs) || {};
                    $.extend(tstyles, styles);
                    if (xlObj.getObjectLength(tstyles)) {
                        cssClass = this._getBorderHashCode(tstyles);
                        this._updateFormatClass(cellIdx, cssClass, true);
                    }
                    else if (xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, bdr)) {
                        if (isTable) {

                        }
                        style = this.getBorderFromHashCode(hCode);
                        if (rgt in style) {

                        }
                        if (xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, bdr))
                            xlObj.XLEdit._clearDataContainer({ cellIdx: cellIdx, property: [bdr] });
                    }
                }
            }
        },

        updateFormat: function (formatobj, range) {
            var xlObj = this.XLObj;
            if (xlObj.model.isReadOnly)
                return;
            var i, cells, pos = ["topborder", "leftborder"], arr = formatobj.format;
            range = xlObj._getRangeArgs(range, "object");
            cells = xlObj._getSelectedCells(xlObj.getActiveSheetIndex(), range).selCells;
            i = cells.length;
            while (i--){
				arr[i] && this._createFormatClass(this.getFormatFromHashCode(arr[i]), arr[i]);
                this._updateHashCodeClass(cells[i], arr[i]);
			}
            i = 2;
            while (i--)
                this._updateBorderClass(range, formatobj[pos[i]], pos[i]);
        },

        _updateBorderClass: function (range, format, position) {
            var i, cells, xlObj = this.XLObj, str = "topborder", index = position === str ? range[0] - 1 : range[1] - 1;
            if (index >= 0) {
                cells = position === str ? xlObj._getSelectedRange({ rowIndex: range[0] - 1, colIndex: range[1]},{ rowIndex: range[0] - 1, colIndex: range[3]}) : xlObj._getSelectedRange({ rowIndex: range[0], colIndex: range[1] - 1}, {rowIndex: range[2], colIndex: range[1] - 1});
                i = cells.length;
                while (i--) {
					this._createFormatClass({border:this.getBorderFromHashCode(format[i])}, format[i]);
                    this._updateFormatClass(cells[i], format[i], true);
				}
            }
        },

        updateUniqueFormat: function (formatcls, range, cellstyle) {
            var xlObj = this.XLObj;
            if (xlObj.model.isReadOnly)
                return;
            var sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), range, cells, formatclass, i, cHght, cell, formtObj,
            range = xlObj._getRangeArgs(range, "object");
            cells = xlObj._getSelectedCells(sheetIdx, range).selCells;
            i = cells.length;
            while (i--) {
                formatclass = xlObj._isUndoRedo ? ((ej.isNullOrUndefined(formatcls[i]['format'])) ? "e-format" : formatcls[i]['format']) : formatcls;
				 this._createFormatClass(formatclass.indexOf("e-format") > -1 ? this.getFormatFromHashCode(formatclass): {border:this.getBorderFromHashCode(formatclass)}, formatclass, cellstyle);
				 this._updateFormatClass(cells[i], formatclass);
				 formtObj = this.getFormatFromHashCode(formatclass);
				 xlObj.XLEdit._updateDataContainer(cells[i], { dataObj: { formats: formtObj }, sheetIdx: sheetIdx });
            }
            if (cellstyle == "Title" || cellstyle == "Heading 4" || !ej.isNullOrUndefined(formtObj["font-size"]))
                this._updateRowHeight(range, sheetIdx);
        },

        _updateRowHeight: function (range, sheetIdx) {

            var xlObj = this.XLObj, sheetIdx = sheetIdx ? sheetIdx : xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx),
            cells = xlObj._getSelectedCells(sheetIdx, range).selCells, cell, cHght;
            i = cells.length;
            while (i--) {
                if (xlObj._isRowViewable(sheetIdx, cells[i].rowIndex))
                    cell = xlObj.getCell(cells[i].rowIndex, cells[i].colIndex);
                cHght = xlObj._detailsFromGlobalSpan(cells[i].rowIndex, cells[i].colIndex, "height", xlObj.XLEdit.getPropertyValue(cells[i].rowIndex, cells[i].colIndex, "value2"), sheet.columnsWidthCollection[cells[i].colIndex]);
                if (cHght >= xlObj.model.rowHeight && !(xlObj.XLEdit.getPropertyValue(cells[i].rowIndex, cells[i].colIndex, "wrap") && xlObj.XLEdit.getPropertyValue(cells[i].rowIndex, cells[i].colIndex, "merge")) && !xlObj.XLEdit.getPropertyValue(cells[i].rowIndex, cells[i].colIndex, "mergeIdx")) {
                    xlObj._updateFormatColl(sheetIdx, cells[i].rowIndex, cells[i].colIndex, cHght);
                    cHght = xlObj._getFormattedHeight(sheetIdx, cells[i].rowIndex);
                    (cell) && cell.parent().outerHeight(cHght);
                    xlObj.XLEdit._updateDataContainer({ rowIndex: cells[i].rowIndex, colIndex: 0 }, { dataObj: { pHeight: sheet.rowsHeightCollection[cells[i].rowIndex], cHeight: cHght } });
                    sheet.rowsHeightCollection[cells[i].rowIndex] = cHght;
                    if (xlObj.model.allowFreezing)
                        xlObj.XLFreeze._refreshFRowResize(cells[i].rowIndex);
                }
            }
            xlObj._refreshRangeTRHght(sheetIdx, xlObj.swapRange(range));
        },

        _hasFormat: function (formatclass) {
            if (formatclass)
                return !ej.isNullOrUndefined(formatclass.match(/e-format|e-border/));
            return false;
        },

        getFormatHashCode: function (style) {
            var hcode, key, code = "", i = 0, bg = "background-color", clr = "color", ff = "font-family", fs = "font-size",
                arr = ["font-style", "text-decoration", "vertical-align", "text-align", "font-weight"], cnt = arr.length,
                prop = ["FontStyle", "TextDecoration", "VerticalAlign", "TextAlign", "FontWeight"], ti = "text-indent";
            code = bg in style ? style[bg].replace("#", "") : "6N";
            code += clr in style ? style[clr].replace("#", "") : "6N";
            if (ff in style) {
                hcode = this._getStyleCode("FontFamily", style[ff]);
                code += hcode || "2N";
            }
            else
                code += "2N";
            code += fs in style ? this._getFontCode(style[fs]) : "2N";
            while (i < cnt) {
                key = arr[i];
                if (key in style) {
                    hcode = this._getStyleCode(prop[i], style[key]);
                    code += hcode || "1N";
                }
                else
                    code += "1N";
                i++;
            }
            if (!code.endsWith("N"))
                code = code + "N";
            if (ti in style)
                code += style[ti].replace(/pt|-|\+/g, "");
            return "e-format" + code;
        },

        getFormatFromHashCode: function (code) {
            var i, j, pt, ff, FF, fs, arr, cnt, len, prop, temp, style = {}, str = "e-format";
            code = code || "";
            if (!code.indexOf(str)) {
                pt = "pt";
                i = j = 0;
                prop = ["FontStyle", "TextDecoration", "VerticalAlign", "TextAlign"];
                arr = ["font-style", "text-decoration", "vertical-align", "text-align"];
                cnt = arr.length;
                temp = code.replace(str, "").split("N");
                if (temp[i].length === 1)
                    i++;
                else {
                    style["background-color"] = "#" + temp[i].slice(0, 6);
                    temp[i] = temp[i].substr(6);
                }
                if (temp[i].length === 1)
                    i++;
                else {
                    style["color"] = "#" + temp[i].slice(0, 6);
                    temp[i] = temp[i].substr(6);
                }
                len = temp[i].length;
                if (len === 1)
                    i++;
                else {
                    FF = "FontFamily";
                    ff = "font-family";
                    if (len === 2) {
                        style[ff] = this._getCodeStyle(FF, temp[i].slice(0, 1) + "1N");
                        i++;
                    }
                    else {
                        style[ff] = this._getCodeStyle(FF, temp[i].slice(0, 2));
                        temp[i] = temp[i].substr(2);
                    }
                }
                len = temp[i].length;
                if (len === 1)
                    i++;
                else {
                    fs = "font-size";
                    if (len === 2) {
                        style[fs] = temp[i].slice(0, 1) + pt;
                        i++;
                    }
                    else {
                        style[fs] = temp[i].slice(0, 2) + pt;
                        temp[i] = temp[i].substr(2);
                    }
                }
                while (j < cnt) {
                    if (temp[i].length === 1)
                        i++;
                    else {                        
                        style[arr[j]] = this._getCodeStyle(prop[j], temp[i].slice(0, 1));
                        temp[i] = temp[i].substr(1);
                    }
                    j++;
                }
                if (temp[i] === "2")
                    style["font-weight"] = "bold";
                 i++;
                if (temp[i])
                    style["text-indent"] = temp[i] + pt;
            }
            return style;
        },

        getBorderFromHashCode: function (code, isComplete) {
            var temp, i = 0, obj = {}, prefix = "e-border", bdrPos = this._borderPosition;
            code = code || "";
            if (!code.indexOf(prefix)) {
                temp = code.replace(prefix, "").split("N");
                if (temp[i].length > 1) {
                    obj[bdrPos[1]] = this._concatBorderCode(temp[i]);
                    temp[i] = temp[i].substr(8);
                }
                else
                    i += 3;
                if (temp[i].length > 1) {
                    obj[bdrPos[2]] = this._concatBorderCode(temp[i]);
                    if (isComplete)
                        temp[i] = temp[i].substr(8);
                }
                else
                    i += 3;
                if (isComplete) {
                    if (temp[i].length > 1) {
                        obj[bdrPos[0]] = this._concatBorderCode(temp[i]);
                        temp[i] = temp[i].substr(8);
                    }
                    else
                        i += 3;
                    if (temp[i].length > 1)
                        obj[bdrPos[3]] = this._concatBorderCode(temp[i]);
                }
            }
            return obj;
        },

        _formatPainter: function () {
            var xlObj = this.XLObj;
            if (!xlObj.model.allowFormatPainter || !xlObj.model.allowCellFormatting)
                return;
            var sheetIdx = xlObj.getActiveSheetIndex(), i, j, cellIdx = 0, sheet = xlObj.getSheet(sheetIdx), startCell = sheet._startCell, endCell = sheet._endCell;
            this._rowLength = (endCell.rowIndex - startCell.rowIndex) + 1, this._colLength = (endCell.colIndex - startCell.colIndex) + 1;
            var rowLen = this._rowLength, colLen = this._colLength, getData;
            getData = xlObj.getRangeData({ range: [startCell.rowIndex, startCell.colIndex, endCell.rowIndex, endCell.colIndex], property: ["value", "value2", "type", "wrap", "formatStr", "thousandSeparator", "decimalPlaces", "cFormatRule", "hyperlink", "format", "cellType"] });
            this._getEformatClass = new Array(rowLen);
            for (i = 0; i < rowLen; i++) {
                this._getEformatClass[i] = new Array(colLen);
                for (j = 0; j < colLen; j++) {
                    this._getEformatClass[i][j] = { "rangeData": getData[cellIdx] };
                    cellIdx++;
                }
            }
        },

        _fPMouseUp: function (e) {
            var obj, cell, cellType, evtArgs, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), sheetCont = xlObj._getContent(sheetIdx).find("div.e-content"),
                colcount = 0, topborder = 0, leftborder = 0, cFRule, fClass, getCell = sheet._selectedCells, startCell = sheet._startCell, endCell = sheet._endCell,
                i, j, cellIndex = 0, cellCount = 0, cFormatStr, rule, cellAddr, len, k, rowlength = (endCell.rowIndex - startCell.rowIndex), collength = (endCell.colIndex - startCell.colIndex),
                alphaRange, xlEdit = xlObj.XLEdit, getType, selRange = sheet.selectedRange, rangeVal = xlObj.getRangeData({ range: selRange, property: ["wrap", "hyperlink", "value", "value2", "cFormatRule", "format", "cellType", "formats", "formatStr", "decimalPlaces", "thousandSeparator","type"] }),
             details = { sheetIndex: sheetIdx, reqType: "format-painter", range: selRange, beforeData: rangeVal, bFormat: this.getHashCodeClassAsArray(selRange), unwrapCells: [], wrapCells: [] }, fpElem = xlObj.element.find("#" + xlObj._id + "_Ribbon_Home_Clipboard_FormatPainter");
            xlObj._dupDetails = true;
            for (i = 0; i <= rowlength; i++) {
                cellCount++; 
                for (j = 0; j <= collength; j++) {
                    colcount++;
                    alphaRange = xlObj._getAlphaRange(sheetIdx, getCell[cellIndex].rowIndex, getCell[cellIndex].colIndex, getCell[cellIndex].rowIndex, getCell[cellIndex].colIndex);
                    cell = getCell[cellIndex];
                    getType = this._getEformatClass[i][j];
                    this.removeStyle([getCell[cellIndex].rowIndex, getCell[cellIndex].colIndex, getCell[cellIndex].rowIndex, getCell[cellIndex].colIndex], { cellStyle: true, tableStyle: false, format: true });               
                    obj = { type: getType.rangeData.type ? getType.rangeData.type : "general" };
                    if (getType.rangeData.format)
                        obj.style=this.getFormatFromHashCode(getType.rangeData.format);
                    if (getType.rangeData.formatStr)
                        obj.formatStr = getType.rangeData.formatStr;
                    if (getType.rangeData.decimalPlaces)
                        obj.decimalPlaces = getType.rangeData.decimalPlaces;
                    if (getType.rangeData.thousandSeparator)
                        obj.thousandSeparator = getType.rangeData.thousandSeparator;
                    this.format(obj, alphaRange);
					if (getType.rangeData.cellType) {
						cellType = xlObj._dataContainer.sheetCellType[getType.rangeData.cellType];
						cellType.text = '';
						xlObj.XLCellType._renderControls(getCell[cellIndex].rowIndex, getCell[cellIndex].colIndex, sheetIdx, cellType);
					}
                    if (!ej.isNullOrUndefined(getType.rangeData.cFormatRule)) {
                        for (k = 0, len = getType.rangeData.cFormatRule.length; k < len; k++) {
                            cFRule = getType.rangeData.cFormatRule[k];
                            rule = cFRule.split("_");
                            cellAddr = rule[5];
                            rule[rule.indexOf(cellAddr)] = alphaRange;
                            xlObj._dataContainer.cFormatRule = rule.join("_");
                            cFormatStr = xlObj._dataContainer.cFormatRule.split("_");
                            xlObj.XLCFormat._cFormat(cFormatStr[0], cFormatStr[2], cFormatStr[3], cFormatStr[4], cFormatStr[5]);
                        }
                    }
                    if (rangeVal[cellIndex].wrap && !getType.rangeData.wrap){
                        xlObj.setWrapText("unwrap", alphaRange);
						details.wrapCells.push({rowIndex: getCell[cellIndex].rowIndex, colIndex: getCell[cellIndex].colIndex});
					}
                    else if (!rangeVal[cellIndex].wrap && getType.rangeData.wrap){
                        xlObj.setWrapText("wrap", alphaRange);
						details.unwrapCells.push({rowIndex: getCell[cellIndex].rowIndex, colIndex: getCell[cellIndex].colIndex});
					}
                    if (getType.rangeData.hyperlink && !rangeVal[cellIndex].hyperlink)
                        this.format({ style: { "text-decoration": "underline", "color": xlObj._hlColor } }, alphaRange);
                    else if (!getType.rangeData.hyperlink && rangeVal[cellIndex].hyperlink) {
                        this.format({ style: { "text-decoration": "none" } }, alphaRange);
                        xlObj.addClass(xlObj.getCell(cell.rowIndex, cell.colIndex, sheetIdx).find("a"), xlEdit.getPropertyValue(cell.rowIndex, cell.colIndex, "format", sheetIdx));
                    }
                    //if (i === 0) {    // border not supported in formatpainter
                    //    startCell.rowIndex > 0 && this._updateFormatClass(xlObj.getCell(startCell.rowIndex - 1, startCell.colIndex + (colcount - 1), sheetIdx)[0], this._getFormat.topborder[topborder]);
                    //    topborder++;
                    //    (this._getFormat.topborder.length === topborder) && (topborder = 0);
                    //}
                    //if (j === 0) {
                    //    startCell.colIndex > 0 && this._updateFormatClass(xlObj.getCell(startCell.rowIndex + (cellCount - 1), startCell.colIndex - 1, sheetIdx)[0], this._getFormat.leftborder[leftborder]);
                    //    leftborder++;
                    //    (this._getFormat.topborder.length === leftborder) && (leftborder = 0);
                    //}
                    cellIndex++;
                    if (colcount === collength + 1) {
                        colcount = 0;
                        break;
                    }
                    (this._colLength === j + 1) && (j = -1);
                }
                if (cellCount === rowlength + 1)
                    break;
                (this._rowLength === i + 1) && (i = -1);
            }
            this._formatEnable = false;
            sheetCont.addClass("e-ss-cursor");
            sheetCont.removeClass("e-ss-fpcursor");
            fpElem.length && fpElem.ejToggleButton("option", { toggleState: false });
            xlObj._dupDetails = false;
            details["afterData"] = xlObj.getRangeData({ range: selRange, property: ["wrap", "hyperlink", "value", "value2", "cFormatRule", "format", "cellType", "formats", "formatStr", "decimalPlaces", "thousandSeparator","type"] });
			details.aFormat = this.getHashCodeClassAsArray(selRange);
			xlObj.XLSelection.refreshSelection();
			xlObj.XLDragFill && xlObj.XLDragFill.positionAutoFillElement();
			evtArgs = { sheetIndex: details.sheetIndex, currData:details["afterData"], currFormat:details.aFormat, reqType: details.reqType, range: details.range, prevData:details.beforeData, prevFormat: details.bFormat, unwrapCells: details.unwrapCells, wrapCells: details.wrapCells };
			if (!xlObj._isUndoRedo) {
			    xlObj._completeAction(details);
			    xlObj._trigActionComplete(evtArgs);
			}
        },

        _getFormatObj: function (obj) {
            if ("type" in obj || "formatStr" in obj) {
                var format = {}, sep = "thousandSeparator";
                format["formatStr"] = "formatStr" in obj ? obj.formatStr : this.XLObj._getFormatString(obj.type, obj.decimalPlaces);
                format["decimalPlaces"] = "decimalPlaces" in obj ? obj.decimalPlaces : ["currency", "accounting", "number"].indexOf(obj.type) !== -1 ? parseInt(format.formatStr.replace(/{0:|[A-Z]|}/g, "")) : 0;
                if (sep in obj)
                    format[sep] = obj[sep];
                else if (obj.type === "number")
                    format[sep] = true;
                obj["format"] = format;
            }
            if ("style" in obj && obj.style.border) {
                obj["border"] = obj.style.border;
                delete obj.style.border;
                if (!this.XLObj.getObjectLength(obj.style))
                    delete obj.style;
            }
            return obj;
        },

        _createFormatClass: function (args, hashcode, isCellStyle) {
            var properties, container = this.XLObj._dataContainer.hashCode;
            hashcode = hashcode || this.getFormatHashCode(args);
            if (container.indexOf(hashcode) !== -1 && !isCellStyle)
                return hashcode;
            properties = this._getCssPropertyAsString(args);
            this._writeCssRules(hashcode, properties, isCellStyle);
            (container.indexOf(hashcode) === -1) && container.push(hashcode);
            return hashcode;
        },

        _writeCssRules: function (hashcode, rules, isCellStyle, isCellType) {
            var stag = document.getElementById(this.XLObj._id + "_sscustomformat"), pnlCss = "  ", prop = ".e-spreadsheet .e-spreadsheetmainpanel ." + hashcode + " {" + rules + "}";
            !isCellType && (stag.styleSheet ? stag.styleSheet.cssText += prop : stag.appendChild(document.createTextNode(prop)));
			if(isCellStyle) {
				prop = prop.replace(".e-spreadsheetmainpanel ", "");
				stag.styleSheet ? stag.styleSheet.cssText += prop : stag.appendChild(document.createTextNode(prop));
			}			
        },

        _getCssPropertyAsString: function (args) {
            var str = "", prop, j, k;
            if ("border" in args) {
                prop = args.border;
                for (j in prop)
                    args["border-" + j] = prop[j];
                delete args.border;
            }
            for (k in args)
                str = str + (k + ":" + args[k] + ";");
            return str;
        },

        _splitBorderCode: function (code) {
            code = code.split(" ");
            return code[0].replace("px", "") + this._getStyleCode("BorderStyle", code[1]) + code[2].replace("#", "");
        },

        _concatBorderCode: function (code) {
            return code.substr(0, 1) + "px " + this._getCodeStyle("BorderStyle", code.substr(1, 1)) + " #" + code.substr(2, 6);
        },

        _getCodeStyle: function (obj, value) {
            obj = ej.Spreadsheet[obj];
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (obj[prop] === value)
                        return prop;
                }
            }
            return "";
        },

        _getStyleCode: function (prop, val) {
            val = val || "";
            return ej.Spreadsheet[prop][val.toLowerCase()];
        },

        _getFontCode: function (args) {
            var temp = args.replace(/pt|-|\+/g, "");
            return temp.length === 2 ? temp : (temp.length === 1 ? temp + "1N" : "2N");
        },

        _getExtendedFormat: function (cellIdx, style, isTable) {
            var format = this.XLObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "formats") || {};
            if (isTable) {
                $.extend(style, format);
                return { format: style };
            }
            if (format["text-indent"] && style["text-align"]) {
                delete format["text-indent"];
                delete format["text-align"];
                $.extend(style, format);
                return { format: style };
            }
            else {
                $.extend(format, style);
                return { format: format };
            }
        },

        _updateHashCodeClass: function (cellIdx, cssclass) {
            var format, border, xlObj = this.XLObj, frmt = "e-format", bdr = "e-border", obj = {},
                fregx = xlObj._formatRegx, bregx = xlObj._borderRegx;
            if (cssclass) {
                format = cssclass.indexOf(frmt) > -1;
                border = cssclass.indexOf(bdr) > -1;
                if (format)
                    obj.format = cssclass.match(fregx)[0];
                if (border)
                    obj.border = cssclass.match(bregx)[0];
                if(format || border)
                    xlObj.XLEdit._updateDataContainer({ rowIndex: cellIdx.rowIndex, colIndex: cellIdx.colIndex }, { dataObj: obj });
            }
        },

        _updateFormatClass: function (cellIdx, cssclass, isborder) {
            var format = "e-format", border = "e-border";
            if (cssclass && (cssclass.indexOf(format) > -1 || cssclass.indexOf(border) > -1))                                
                this.XLObj.XLEdit._updateDataContainer(cellIdx, { dataObj: isborder ? { border: cssclass } : { format: cssclass } });
        },

        _applyBorderCss: function (options, range, details) {
            var i, bdrpos = this._borderPosition, top = bdrpos[0], rgt = bdrpos[1], btm = bdrpos[2], lft = bdrpos[3],
                minr = range[0], minc = range[1], maxr = range[2], maxc = range[3];
            if (top in options) {
                if (minr)
                    this._updateBorder([minr - 1, minc, minr - 1, maxc], options, btm, true, details);
                else
                    this._updateBorderObj([minr, minc, minr, maxc], options, top);
            }
            if (rgt in options)
                this._updateBorder([minr, maxc, maxr, maxc], options, rgt,"",details);
            if (btm in options)
                this._updateBorder([maxr, minc, maxr, maxc], options, btm,"", details);
            if (lft in options) {
                if (minc)
                    this._updateBorder([minr, minc - 1, maxr, minc - 1], options, rgt, true,details);
                else
                    this._updateBorderObj([minr, minc, maxr, minc], options, lft);
            }
        },

        _applyAllBorderCss: function (options, range, details) {
            var right = this._borderPosition[1], btm = this._borderPosition[2], minr = range[0], minc = range[1],
                maxr = range[2], maxc = range[3];
            this._updateBorder(range, options, right + " " + btm, "", details);
            if (minr)
                this._updateBorder([minr - 1, minc, minr - 1, maxc], options, btm, true, details);
            if (minc)
                this._updateBorder([minr, minc - 1, maxr, minc - 1], options, right, true, details);
        },

        _updateBorderObj: function (range, options, props) {
            var k, l , pBdr, cellIdx, i = range[0], j = range[2];
            while (i <= j) {
                k = range[1], l = range[3];
                while (k <= l) {
                    cellIdx = { rowIndex: i, colIndex: k };
                    pBdr = this._extendBorderObj(cellIdx, this._parseBorder(options, props).border, this._isFAT);
                    this.XLObj.XLEdit._updateDataContainer(cellIdx, { dataObj: this._isFAT ? { tborders: pBdr } : { borders: pBdr } });
                    k++;
                }
                i++;
            }
        },

        _updateBorder: function (range, options, props, isDuplicate, details) {
            var k, l, rowIdx, colIdx, hColIdx, hRowIdx, cellIdx, prevIdx, sameRow, hCode, extBdr, pextBdr, bdrObj, pbdrObj, borders, canUpdt = false, isTop = false,
                bdrPos = this._borderPosition, i = range[0], j = range[2], isGridBdr = options.isGridBorder, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), rangeData = xlObj.getRangeData({range:range, property: ["merge","isMHide","mergeIdx"] }), cells = 0; // pextbdr - previous cell extended border
            delete options.isGridBorder;
            while (i <= j) {
                k = range[1], l = range[3];
                while (k <= l) {
                    cellIdx = { rowIndex: i, colIndex: k };
                    rowIdx = i;
                    colIdx = k;
                    if (isDuplicate) {
                        isTop = props === bdrPos[2];
                        if (isTop)
                            rowIdx++;
                        else
                            colIdx++;
                        extBdr = this._parseBorder(options, isTop ? bdrPos[0] : bdrPos[3]).border;
                    }
                    else
                        extBdr = this._parseBorder(options, props).border;
                    if (!isGridBdr) {
                        if (isDuplicate) {
                            prevIdx = { rowIndex: rowIdx, colIndex: colIdx };
                            pextBdr = this._extendBorderObj(prevIdx, extBdr, this._isFAT);
                            xlObj.XLEdit._updateDataContainer(prevIdx, { dataObj: this._isFAT ? { tborders: pextBdr } : { borders: pextBdr }, skipCell: options.skipCell });
                        }
                        else {
                            pextBdr = this._extendBorderObj(cellIdx, this._parseBorder(options, props).border, this._isFAT);
                            canUpdt = true;
                        }
                    }
                    else if (!isDuplicate) {
                        pextBdr = this._extendBorderObj(cellIdx, options, this._isFAT);
                        canUpdt = true;
                    }
                    if (canUpdt)
                        xlObj.XLEdit._updateDataContainer(cellIdx, { dataObj: this._isFAT ? { tborders: pextBdr } : { borders: pextBdr }, skipCell: options.skipCell });
                    if (!(isDuplicate && xlObj.hasSpan(cellIdx))) {
                        hColIdx = cellIdx.colIndex;
                        if (props === bdrPos[1] && isDuplicate && hColIdx) {
                            while (hColIdx) {
                                if (!xlObj.XLEdit.getPropertyValue(0, hColIdx, "isCHide"))
                                    break;
                                hColIdx--;
                            }
                        }
                        hRowIdx = cellIdx.rowIndex;
                        if (props === bdrPos[2] && isDuplicate && hRowIdx) {
                            while (hRowIdx) {
                                if (!xlObj.XLEdit.getPropertyValue(hRowIdx, 0, "isRHide"))
                                    break;
                                hRowIdx--;
                            }
                        }
                        pbdrObj = xlObj.XLEdit.getPropertyValue(hRowIdx, hColIdx, "border");
                        if (pbdrObj)
                            pbdrObj = this.getBorderFromHashCode(pbdrObj);
                        else
                            pbdrObj = xlObj.XLEdit.getPropertyValue(hRowIdx, hColIdx, "borders") || {};
                        if (isDuplicate) {
                            pextBdr = {};
                            if (bdrPos[1] in pbdrObj)
                                pextBdr[bdrPos[3]] = pbdrObj[bdrPos[1]];
                            if (bdrPos[2] in pbdrObj)
                                pextBdr[bdrPos[0]] = pbdrObj[bdrPos[2]];
                            extBdr = this._isFAT ? $.extend(extBdr, pextBdr) : $.extend(pextBdr, extBdr);
                        }
                        else
                            extBdr = this._isFAT ? $.extend(extBdr, pbdrObj) : $.extend(pbdrObj, extBdr);
                        bdrObj = this._parseBorder(extBdr, bdrPos[1] + " " + bdrPos[2], isDuplicate);
                        hCode = this._getBorderHashCode(bdrObj.border);
                        this._createFormatClass(bdrObj, hCode);
                        if(rangeData[cells]["isMHide"])
							this._updateFormatClass({ rowIndex: rangeData[cells]["mergeIdx"].rowIndex, colIndex: rangeData[cells]["mergeIdx"].colIndex }, hCode, true);
                        this._updateFormatClass({ rowIndex: hRowIdx, colIndex: hColIdx }, hCode, true);
                        if ((xlObj.getObjectKeys(bdrObj.border).indexOf("bottom") > -1 && bdrObj.border.bottom.indexOf("double") > -1 || (!ej.isNullOrUndefined(bdrObj["border-bottom"]) && bdrObj["border-bottom"].indexOf("double") > -1)) && sameRow != hRowIdx){
                            var cHght = Math.round(xlObj._detailsFromGlobalSpan(hRowIdx, hColIdx, "height", xlObj.XLEdit.getPropertyValue(hRowIdx, hColIdx, "value2"), sheet.columnsWidthCollection[hColIdx]));
                            if (cHght >= sheet.rowsHeightCollection[hRowIdx]) {
                                if (!xlObj._isUndoRedo && (!sheet._isImported || sheet._isLoaded))
                                    details.prevHeight.push([hRowIdx, sheet.rowsHeightCollection[hRowIdx]]);
                                xlObj._dupDetails = true;
                                xlObj.XLResize.setRowHeight(hRowIdx, cHght + 3);
                                xlObj._dupDetails = false;
                                sameRow = hRowIdx;
                                sheet.rowsHeightCollection[hRowIdx] = cHght + 3;
                                if (!xlObj._isUndoRedo && (!sheet._isImported || sheet._isLoaded))
                                    details.newHeight.push([hRowIdx, cHght + 3]);
                           }
                        }
                    }
                    k++;
					cells++;
                }
                i++;
            }
        },

        _extendBorderObj: function (cellIdx, options, isTable) {
            var xlObj = this.XLObj, bdrObj = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, isTable ? "tborders" : "borders") || {};
            $.extend(bdrObj, options);
            return bdrObj;
        },

        _getBorderHashCode: function (args, isComplete) {
            var code = "", def = "1N1N6N", bdrPos = this._borderPosition, top = bdrPos[0], rgt = bdrPos[1], btm = bdrPos[2], lft = bdrPos[3];
            code = rgt in args ? this._splitBorderCode(args[rgt]) : def;
            code += btm in args ? this._splitBorderCode(args[btm]) : def;
            if (isComplete) {
                code += top in args ? this._splitBorderCode(args[top]) : def;
                code += lft in args ? this._splitBorderCode(args[lft]) : def;
            }
            return "e-border" + code;
        },

        _parseBorder: function (options, props, isDuplicate) {
            var i, key, prop, value, obj = { border: {} }, bdrPos = this._borderPosition;
            props = props.split(" ");
            i = props.length;
            while (i--) {
                prop = key = props[i];
                if (isDuplicate)
                    prop = key === bdrPos[1] ? bdrPos[3] : bdrPos[0];
                value = options[prop];
                if (value)
                    obj.border[key] = value;
            }
            return obj;
        },

        _refreshTableRowCol: function (options) {
            var xlObj = this.XLObj,sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx) , tableMngr = sheet.tableManager, curTable = tableMngr[options.tid];           
            if (curTable) {
                if (options.isInsertBefore)
                {
                    if (options.pos === "row")
                    {
                        curTable.range[0] += options.cnt;
                        curTable.range[2] += options.cnt;
                    }
                    else {
                        curTable.range[1] += options.cnt;
                        curTable.range[3] += options.cnt;
                    }
                }
                else {
                    if (options.pos === "row")
                        curTable.range[2] = curTable.range[2] + options.cnt;
                    else
                        curTable.range[3] = curTable.range[3] + options.cnt;
                    xlObj._dupDetails = true;
                    xlObj.XLFormat._createTable(options.tid, { format: curTable.format });
					this._updateTableFormula("updateRange", curTable, sheetIdx)
                    xlObj._dupDetails = false;
                }
            }

        },

        _refreshHiddenBorder: function (start, end, isRow, hide) {
            var i, j, k, l, m, n, o, pRoC, eRoC, hCode, brdr, isHide, cStyle, dupBrdr, pCelBrdr, sCelBrdr, pTblBrdr, sTblBrdr, eCelBrdr, eTblBrdr, xlEdit = this.XLObj.XLEdit, uIdx = this.XLObj.getSheet().usedRange;
            if (isRow) {
                brdr = "bottom";
                dupBrdr = "top";
                isHide = "isRHide";
                uIdx = uIdx.colIndex;
            }
            else {
                brdr = "right";
                dupBrdr = "left";
                isHide = "isCHide";
                uIdx = uIdx.rowIndex;
            }
            if (hide) {
                pRoC = start, eRoC = end;
                while (eRoC++) {
                    l = isRow ? eRoC : 0;
                    m = isRow ? 0 : eRoC;
                    if (!xlEdit.getPropertyValue(l, m, isHide))
                        break;
                }
                while (pRoC) {
                    l = isRow ? pRoC : 0;
                    m = isRow ? 0 : pRoC;
                    if (!xlEdit.getPropertyValue(l, m, isHide))
                        break;
                    pRoC--;
                }
                for (i = 0; i <= uIdx; i++) {
                    if (isRow) {
                        l = pRoC;
                        j = n = start;
                        k = m = o = i;
                    }
                    else {
                        m = pRoC;
                        j = l = n = i;
                        k = o = start;
                    }
                    if (xlEdit.getPropertyValue(j, k, "isMHide")) {
                        j = xlEdit.getPropertyValue(j, k, "mergeIdx");
                        k = j.colIndex;
                        j = j.rowIndex;
                    }
                    pCelBrdr = xlEdit.getPropertyValue(l, m, "borders");
                    sCelBrdr = xlEdit.getPropertyValue(j, k, "borders");
                    pTblBrdr = xlEdit.getPropertyValue(l, m, "tborders");
                    sTblBrdr = xlEdit.getPropertyValue(n, o, "tborders");
                    if ((!pCelBrdr || (pCelBrdr && !pCelBrdr[brdr])) && ((sCelBrdr && sCelBrdr[dupBrdr]) || ((!pTblBrdr || (pTblBrdr && !pTblBrdr[brdr])) && sTblBrdr && sTblBrdr[dupBrdr]))) {
                        hCode = xlEdit.getPropertyValue(l, m, "border");
                        cStyle = this.getBorderFromHashCode(hCode);
                        delete cStyle[brdr];
                        if (pTblBrdr && pTblBrdr[brdr])
                            cStyle[brdr] = pTblBrdr[brdr];
                        if (cStyle.bottom || cStyle.right) {
                            hCode = this._getBorderHashCode(cStyle);
                            xlEdit._updateDataContainer({ rowIndex: l, colIndex: m }, { dataObj: { border: hCode } });
                        }
                        else
                            xlEdit._clearDataContainer({ cellIdx: { rowIndex: l, colIndex: m }, property: ["border"] });
                    }
                    if (isRow) {
                        o = pRoC;
                        j = l = eRoC;
                        k = m = n = i;
                    }
                    else {
                        n = pRoC;
                        k = m = eRoC;
                        j = l = o = i;
                    }
                    if (xlEdit.getPropertyValue(j, k, "isMHide")) {
                        j = xlEdit.getPropertyValue(j, k, "mergeIdx");
                        k = j.colIndex;
                        j = j.rowIndex;
                    }
                    eCelBrdr = xlEdit.getPropertyValue(j, k, "borders");
                    eTblBrdr = xlEdit.getPropertyValue(l, m, "tborders");
                    if ((!pCelBrdr || (pCelBrdr && !pCelBrdr[brdr])) && ((eCelBrdr && eCelBrdr[dupBrdr]) || ((!pTblBrdr || (pTblBrdr && !pTblBrdr[brdr])) && eTblBrdr && eTblBrdr[dupBrdr]))) {
                        cStyle = {};
                        if (pCelBrdr || xlEdit.getPropertyValue(o, n, "border")) {
                            hCode = xlEdit.getPropertyValue(o, n, "border");
                            cStyle = this.getBorderFromHashCode(hCode);
                        }
                        cStyle[brdr] = (eCelBrdr && eCelBrdr[dupBrdr]) ? eCelBrdr[dupBrdr] : eTblBrdr[dupBrdr];
                        hCode = this._getBorderHashCode(cStyle);
                        xlEdit._updateDataContainer({ rowIndex: o, colIndex: n }, { dataObj: { border: hCode } });
                    }
                }
            }
            else {
                l = isRow ? start - 1 : 0;
                m = isRow ? 0 : start - 1;
                if (xlEdit.getPropertyValue(l, m, isHide)) {
                    pRoC = start - 1;
                    while (pRoC) {
                        l = isRow ? pRoC : 0;
                        m = isRow ? 0 : pRoC;
                        if (!xlEdit.getPropertyValue(l, m, isHide))
                            break;
                        pRoC--;
                    }
                    for (i = 0; i <= uIdx; i++) {
                        if (isRow) {
                            l = pRoC;
                            k = m = o = i;
                            j = n = start - 1;
                        }
                        else {
                            m = pRoC;
                            j = l = n = i;
                            k = o = start - 1;
                        }
                        if (xlEdit.getPropertyValue(j, k, "isMHide")) {
                            j = xlEdit.getPropertyValue(j, k, "mergeIdx");
                            k = j.colIndex;
                            j = j.rowIndex;
                        }
                        pCelBrdr = xlEdit.getPropertyValue(l, m, "borders");
                        sCelBrdr = xlEdit.getPropertyValue(j, k, "borders");
                        pTblBrdr = xlEdit.getPropertyValue(l, m, "tborders");
                        sTblBrdr = xlEdit.getPropertyValue(n, o, "tborders");
                        cStyle = this.getBorderFromHashCode(xlEdit.getPropertyValue(l, m, "border"));
                        if ((((!pCelBrdr || (pCelBrdr && !pCelBrdr[brdr])) || (pCelBrdr && pCelBrdr[brdr] !== (cStyle && cStyle[brdr]))) && ((!pTblBrdr || (pTblBrdr && !pTblBrdr[brdr])) || (pTblBrdr && pTblBrdr[brdr] && (xlEdit.getPropertyValue(l, m, "border") !== this._getBorderHashCode(pTblBrdr)
                            || (sCelBrdr && sCelBrdr[dupBrdr]))))) && (((sCelBrdr && sCelBrdr[dupBrdr]) || ((cStyle && cStyle[brdr]) && (!sCelBrdr || (sCelBrdr && !sCelBrdr[dupBrdr])))) || ((sTblBrdr && sTblBrdr[dupBrdr])))) {
                            l = isRow ? j : k;
                            m = isRow ? k : j;
                            this._showHiddenBorder(pRoC, l, m, i, isRow);
                        }

                    }
                    for (i = 0; i <= uIdx; i++) {
                        if (isRow) {
                            l = j - 1;
                            j = n = start;
                            k = o = m = i;
                        }
                        else {
                            m = k - 1;
                            j = l = n = i;
                            k = o = start;
                        }
                        if (xlEdit.getPropertyValue(j, k, "isMHide")) {
                            j = xlEdit.getPropertyValue(j, k, "mergeIdx");
                            k = j.colIndex;
                            j = j.rowIndex;
                        }
                        sCelBrdr = xlEdit.getPropertyValue(l, m, "borders");
                        eCelBrdr = xlEdit.getPropertyValue(j, k, "borders");
                        sTblBrdr = xlEdit.getPropertyValue(l, m, "tborders");
                        eTblBrdr = xlEdit.getPropertyValue(n, o, "tborders");
                        cStyle = this.getBorderFromHashCode(xlEdit.getPropertyValue(l, m, "border"));
                        if ((((!sCelBrdr || (sCelBrdr && !sCelBrdr[brdr])) || (sCelBrdr && sCelBrdr[brdr] !== (cStyle && cStyle[brdr]))) && ((!sTblBrdr || (sTblBrdr && !sTblBrdr[brdr])) || (sTblBrdr && sTblBrdr[brdr] && xlEdit.getPropertyValue(n, o, "border") !== this._getBorderHashCode(sTblBrdr))))
                            && (((eCelBrdr && eCelBrdr[dupBrdr]) || ((cStyle && cStyle[brdr]) && (!eCelBrdr || (eCelBrdr && !eCelBrdr[dupBrdr])))) || (eTblBrdr && eTblBrdr[dupBrdr]))) {
                            l = isRow ? j : k;
                            m = isRow ? k : j;
                            this._showHiddenBorder(start - 1, l, m, i, isRow);
                        }
                    }
                }
                for (start; start < end; start++) {
                    eRoC = start + 1;
                    if (isRow) {
                        l = eRoC;
                        m = k = 0;
                        j = start;
                    }
                    else {
                        m = eRoC;
                        l = j = 0;
                        k = start;
                    }
                    if (xlEdit.getPropertyValue(l, m, isHide) || xlEdit.getPropertyValue(j, k, isHide)) {
                        for (i = 0; i <= uIdx; i++) {
                            if (isRow) {
                                j = eRoC;
                                k = m = i;
                                l = start;
                            }
                            else {
                                j = l = i;
                                k = eRoC;
                                m = start;
                            }
                            if (xlEdit.getPropertyValue(j, k, "isMHide")) {
                                j = xlEdit.getPropertyValue(j, k, "mergeIdx");
                                k = j.colIndex;
                                j = j.rowIndex;
                            }
                            sCelBrdr = xlEdit.getPropertyValue(l, m, "borders");
                            eCelBrdr = xlEdit.getPropertyValue(j, k, "borders");
                            sTblBrdr = xlEdit.getPropertyValue(l, m, "tborders");
                            eTblBrdr = xlEdit.getPropertyValue(j, k, "tborders");
                            cStyle = this.getBorderFromHashCode(xlEdit.getPropertyValue(l, m, "border"));
                            if ((((!sCelBrdr || (sCelBrdr && !sCelBrdr[brdr])) || (sCelBrdr && sCelBrdr[brdr] !== (cStyle && cStyle[brdr]))) && ((!sTblBrdr || (sTblBrdr && !sTblBrdr[brdr])) || (sTblBrdr && sTblBrdr[brdr] && (xlEdit.getPropertyValue(l, m, "border") !== this._getBorderHashCode(sTblBrdr)
                                || (eCelBrdr && eCelBrdr[dupBrdr]))))) && (((eCelBrdr && eCelBrdr[dupBrdr]) || ((cStyle && cStyle[brdr]) && (!eCelBrdr || (eCelBrdr && !eCelBrdr[dupBrdr])))) || (eTblBrdr && eTblBrdr[dupBrdr]))) {
                                j = isRow ? k : j;
                                this._showHiddenBorder(start, eRoC, j, i, isRow);
                            }
                        }
                    }
                }
            }
        },

        _showHiddenBorder: function (start, end, idx, mrgIdx, isRow) {
            var i, j, l, m, n, o, brdr, hCode, cStyle, sCelBrdr, eCelBrdr, eTblBrdr, sTblBrdr, dupBrdr, xlEdit = this.XLObj.XLEdit;
            if (isRow) {
                l = end;
                o = mrgIdx;
                j = m = idx;
                i = n = start;
                brdr = "bottom";
                dupBrdr = "top";
            }
            else {
                m = end;
                n = mrgIdx;
                i = l = idx;
                j = o = start;
                brdr = "right";
                dupBrdr = "left";
            }
            hCode = xlEdit.getPropertyValue(i, j, "border");
            cStyle = this.getBorderFromHashCode(hCode);
            if (cStyle[brdr])
                delete cStyle[brdr];
            sTblBrdr = xlEdit.getPropertyValue(i, j, "tborders");
            eCelBrdr = xlEdit.getPropertyValue(l, m, "borders");
            eTblBrdr = xlEdit.getPropertyValue(l, m, "tborders");
            sCelBrdr = xlEdit.getPropertyValue(n, o, "borders");
            if (sCelBrdr && sCelBrdr[brdr])
                cStyle[brdr] = sCelBrdr[brdr];
            else if (eCelBrdr && eCelBrdr[dupBrdr])
                cStyle[brdr] = eCelBrdr[dupBrdr];
            else if ((sTblBrdr && sTblBrdr[brdr]) || (eTblBrdr && eTblBrdr[dupBrdr]))
                cStyle[brdr] = (sTblBrdr && sTblBrdr[brdr]) ? sTblBrdr[brdr] : eTblBrdr[dupBrdr];
            if (cStyle.bottom || cStyle.right) {
                hCode = this._getBorderHashCode(cStyle);
                xlEdit._updateDataContainer({ rowIndex: n, colIndex: o }, { dataObj: { border: hCode } });
            }
            else
                xlEdit._clearDataContainer({ cellIdx: { rowIndex: i, colIndex: j }, property: ["border"] });
        },

		 _resizeFormatTableMenu: function () {
            var xlObj = this.XLObj, elem = document.getElementById(xlObj._id + "_formatastable");
            if (xlObj._tabMode || xlObj._phoneMode) {
	            $("#" + xlObj._id + "_Ribbon").append($("#" + xlObj._id + "_formatastable").parent());
                xlObj._removeClass(elem, "e-formatastable");
                xlObj.addClass(elem, "e-formatastable-adaptive");
                elem.style.height = xlObj._dlgHeight + "px";
            }
            else {
                xlObj._removeClass(elem, "e-formatastable-adaptive");
                xlObj.addClass(elem, "e-formatastable");
            }
        },

        _resizeStyleMenu: function () {
            var xlObj = this.XLObj, elem = document.getElementById(xlObj._id + "_cellstyles");
            if (xlObj._tabMode || xlObj._phoneMode) {
	            $("#" + xlObj._id + "_Ribbon").append($("#" + xlObj._id + "_cellstyles").parent());
                xlObj._removeClass(elem, "e-cellstyles");
                xlObj.addClass(elem, "e-cellstyles-adaptive");
                elem.style.height = xlObj._dlgHeight + "px";
            }
            else {
                xlObj._removeClass(elem, "e-cellstyles-adaptive");
                xlObj.addClass(elem, "e-cellstyles");
            }
        },

        _resizeBorderMenu: function (args) {
            var xlObj = this.XLObj, $borderElem = xlObj.element.find(".e-bordercontainer");
            if (xlObj._phoneMode) {
	            $("#" + xlObj._id + "_Ribbon").append($("#" + xlObj._id + "_Ribbon_Border").parent());
                if ($borderElem.length)
                    $borderElem.show();
                else {
                    this._createBorderDiv();
                    xlObj.element.find(".e-bordercontainer").show();
                }
				xlObj.addClass($borderElem[0], "e-border e-adaptive");
                args.cancel = true;
                var splitBtn = $("#" + xlObj._id + "_Ribbon_Home_Font_Border").ejSplitButton("instance");
                splitBtn.contstatus = true;
            }				
        },

        _customStyleDlg: function () {
            var xlObj = this.XLObj, $dlg, $label, $okBtn,$formatBtn, $canBtn, $btndiv, $div;
            $dlg = ej.buildTag("div", "", "", { id: xlObj._id + "_CustomCellDialog" });
            $btndiv = ej.buildTag("div.e-dlg-btnfields");
            $frmtDiv1 = ej.buildTag("div.e-dlg-btnfields"); $frmtDiv2 = ej.buildTag("div.e-dlg-btnctnr"); $div = ej.buildTag("div.e-dlg-btnctnr");
            $label = "<div class= 'e-dlgctndiv'><table><tr class= 'e-dlgtd-fields '><td style='width: 22%;'><label>" + xlObj._getLocStr("StyleName") + ":</label></td><td style= 'padding-left: 10px;'><input id ='" + xlObj._id + "_StyleName' type ='text' value = 'Style' class = 'ejinputtext'/></td></tr></table></div>";
            $dlg.append($label);
            $okBtn = ej.buildTag("input", "", "", { id: xlObj._id + "_CustomCellDlgOkBtn" ,type: "submit" });
            $formatBtn = ej.buildTag("input", "", "", { id: xlObj._id + "_CustomCellDlgFrmtBtn", type: "submit" });
            $canBtn = ej.buildTag("input", "", "", { id: xlObj._id + "_CustomCellDlgCanBtn" });
            $okBtn.ejButton({ text: xlObj._getLocStr("Ok"), showRoundedCorner: true, width: 60, click: ej.proxy(this._dlgOK, this), enabled: true, cssClass: "e-ss-okbtn" });
            $formatBtn.ejButton({ text: xlObj._getLocStr("Format")+"...", showRoundedCorner: true, width: 60, click: ej.proxy(this._dlgFrmt, this), enabled: true, cssClass: "e-ss-okbtn" });
            $canBtn.ejButton({ text: xlObj._getLocStr("Cancel"), click: ej.proxy(this._dlgCancel, xlObj), showRoundedCorner: true, width: 60 });
            $dlg.append($frmtDiv1.append($frmtDiv2.append($formatBtn)));
            $btndiv.append($div.append($okBtn, $canBtn));
            $dlg.append($btndiv);
            $dlg.ejDialog({
                enableModal: true, showOnInit: false, enableResize: false, allowKeyboardNavigation: false, title: xlObj._getLocStr("Style"), width: "auto", height: "auto", cssClass: "e-ss-dialog e-" + xlObj._id + "-dlg", close: ej.proxy(this._dlgCancel, xlObj),
                open: ej.proxy(function (e) {
                    var styleNameElm = $("#" + xlObj._id + "_StyleName");
                    styleNameElm.focus().setInputPos(styleNameElm.val().length).select();
                })
            });
        },

        _dlgOK: function (args) {
            var xlObj = this.XLObj, xlFormat = xlObj.XLFormat, xlCmenu = xlObj.XLCMenu, dataMngr = $("#" + xlObj._id + "_formatdlg_format_dataMnger").data();
            if (xlCmenu) {
                if (xlFormat._styleDlgClick)
                    (xlCmenu._modifyClick) ? this.modifyCustomStyle(xlCmenu._oldCustomName, $.extend(true, {}, dataMngr), $("#" + xlObj._id + "_StyleName").val()) : this.addNewCustomStyle($("#" + xlObj._id + "_StyleName").val(), $.extend(true, {}, dataMngr));
                else
                (xlCmenu._modifyClick) ? this.modifyCustomStyle(xlCmenu._oldCustomName, xlObj._dataContainer.customCellStyle[xlCmenu._oldCustomName], $("#" + xlObj._id + "_StyleName").val()) : this.addNewCustomStyle($("#" + xlObj._id + "_StyleName").val(), { style: { "font-family": "Calibri", "font-weight": "normal", "font-style": "normal", "font-size": "11pt", "text-decoration": "none", "color": "#333333" }, NumFormat: { "type": "general" } });
            }
            else
                (xlFormat._styleDlgClick) ? this.addNewCustomStyle($("#" + xlObj._id + "_StyleName").val(), $.extend(true, {}, dataMngr)) : this.addNewCustomStyle($("#" + xlObj._id + "_StyleName").val(), { style: { "font-family": "Calibri", "font-weight": "normal", "font-style": "normal", "font-size": "11pt", "text-decoration": "none", "color": "#333333" }, NumFormat: { "type": "general" } });
            $("#" + xlObj._id + "_CustomCellDialog").ejDialog("close");
            xlFormat._styleDlgClick = false;
            if (xlCmenu) {
                xlCmenu._modifyClick = false;
                xlCmenu._oldCustomName = xlCmenu._target = "";
            }
        },

        _dlgFrmt: function (args) {
            var xlObj = this.XLObj;
            xlObj.XLFormat._styleDlgClick = true;
            xlObj._showDialog(xlObj._id + "_FormatCells");
            
        },

        _styleDlgOpen: function () {
            var xlObj = this.XLObj, val = (xlObj.model.enableContextMenu) ? xlObj.XLCMenu._target:"";
            $("#" + xlObj._id + "_StyleName").val(val);
            $("#" + xlObj._id + "_CustomCellDialog").ejDialog("open");
        },

        _dlgCancel: function (args) {
            var menuObj = this.XLCMenu;
            $("#" + this._id + "_CustomCellDialog").ejDialog("close");
            this.XLFormat._styleDlgClick = false;
            if (menuObj) {
                menuObj._modifyClick = false;
                menuObj._oldCustomName = menuObj._target = "";
            }
        },
        addNewCustomStyle: function (styleName, options) {
            var xlObj = this.XLObj, container = xlObj._dataContainer;
            if (!(xlObj.isImport || xlObj.model.isImport)) {
                if (this._isHeaderAdded && xlObj.getObjectKeys(container.customCellStyle).indexOf(styleName) > -1) {
                    xlObj._showAlertDlg("Alert", "cellStyleAlert", "cellStyleAlert", 200);
                    return;
                }
            }
            var hashCode = this._createFormatClass(options.style, "", true), xlMenuObj = xlObj.XLCMenu, parent = $("#" + xlObj._id + "_cellstyles"), $cellDiv = ej.buildTag("div.e-cellstylecell e-customcellstyle" + " " + hashCode, styleName, "", { title: styleName });
            if (parseInt(options.style["font-size"]) > 11)
                $cellDiv.css({ "font-size": "11pt" });
            // cell styles drop down changes
            if (this._isHeaderAdded)
                parent.children().eq(1).append($cellDiv);
            else {
                $contentDiv = ej.buildTag("div.e-cellstylecontent"), $headerDiv = ej.buildTag("div.e-cellstyleheader", "Custom");
                $contentDiv.append($cellDiv);
                parent.prepend($contentDiv).prepend($headerDiv);
                parent.children().eq(0).append($("#" + xlObj._id + "_cellstyles_back"));
                this._isHeaderAdded = true;
                if(xlMenuObj)
                    xlMenuObj._createMenu(ej.buildTag("ul .e-spreadsheet e-" + xlMenuObj._uniqueClass, " ", { display: "none" }, { id: xlObj._id + "_contextMenuCellStyles" }), xlObj.XLCMenu._cellStylesMenuData, "  .e-cellstylecontent");
            }
            if (ej.isNullOrUndefined(container.customCellStyle[styleName]))
                container.customCellStyle[styleName] = options;
            if (xlMenuObj) {
                menuObj = $("#" + xlObj._id + "_contextMenuCellStyles").data("ejMenu");
                menuObj.model.contextMenuTarget = " .e-customcellstyle";
            }
        },

        modifyCustomStyle: function (oldStyleName, options, newStyleName) {
            var xlObj = this.XLObj, container = xlObj._dataContainer;
            if (this._isHeaderAdded && xlObj.getObjectKeys(container.customCellStyle).indexOf(oldStyleName) === -1) {
                xlObj._showAlertDlg("Alert", "modifyCellStyleAlert", "modifyCellStyleAlert", 200);
                return;
            }
            else if (this._isHeaderAdded && xlObj.getObjectKeys(container.customCellStyle).indexOf(newStyleName) > -1 && oldStyleName != newStyleName)
                return;
            $.extend(container.customCellStyle[oldStyleName], options);
            var hashCode = this._createFormatClass(container.customCellStyle[oldStyleName].style, "", true), cellDiv = $("#" + xlObj._id + "_cellstyles").children().eq(1).find("div[title=\"" + oldStyleName + "\"]");
            xlObj._removeClass(cellDiv[0], cellDiv[0].classList[2]);
            xlObj.addClass(cellDiv[0], hashCode);
            if (oldStyleName != newStyleName) {
                container.customCellStyle[newStyleName] = container.customCellStyle[oldStyleName];
                delete container.customCellStyle[oldStyleName];
                cellDiv.attr('title', newStyleName);
                cellDiv.html(newStyleName);
            }
        },

        deleteCustomStyle: function (styleName) {
            var xlObj = this.XLObj, container = xlObj._dataContainer;
            if (this._isHeaderAdded && xlObj.getObjectKeys(container.customCellStyle).indexOf(styleName) === -1) {
                xlObj._showAlertDlg("Alert", "modifyCellStyleAlert", "", 200);
                return;
            }
            var parent = $("#" + xlObj._id + "_cellstyles").children(); parent.eq(1).find("div[title=\"" + styleName + "\"]").remove();
            delete container.customCellStyle[styleName];
            if (parent.eq(1).children().length === 0) {
                parent[0].remove();
                parent[1].remove()
                $("#" + xlObj._id + "_cellstyles").children().eq(0).append("<span id ='" + xlObj._id + "_cellstyles_back' class = 'e-cellstyles-back e-icon e-ss-leftarrow'/>");
                this._isHeaderAdded = false;
            }
        },

        applyCustomCellStyle: function (styleName,range) {
            var xlObj = this.XLObj, container = xlObj._dataContainer;
            if (this._isHeaderAdded && xlObj.getObjectKeys(container.customCellStyle).indexOf(styleName) === -1) {
                xlObj._showAlertDlg("Alert", "modifyCellStyleAlert", "modifyCellStyleAlert", 200);
                return;
            }
            var formatObj = { style: container.customCellStyle[styleName].style }
            $.extend(formatObj, container.customCellStyle[styleName].NumFormat)
            this.format(formatObj, range);
        },

        _createBorderDiv: function () {
            var xlObj = this.XLObj, hdrdiv = "<div class='e-ss-bdr-header'><span id ='" + xlObj._id + "_border_back' class = 'e-border-back e-icon e-ss-leftarrow'/></div><div class='e-ss-border-content'>", contDiv = '', div = ej.buildTag("div#" + xlObj._id + "_bordercontainer.e-bordercontainer", {}, { display: 'none', height: xlObj._responsiveHeight - 2 }), borderObj = xlObj.XLRibbon._borderMenuData;
            for (var i = 0;i < 13; i++)
                contDiv += "<div class = 'e-bordercell' id=" + borderObj[i].id + ">" + xlObj._renderDIV('e-ss-border ' + borderObj[i].sprite + " e-ss-menu", "", borderObj[i].text) + "</div>";
            hdrdiv += contDiv + "</div>";
            div.append($(hdrdiv));
            $("#" + xlObj._id + "_Ribbon").append(div);
            xlObj._on($('#' + xlObj._id + '_bordercontainer'), "click", xlObj._borderSelectionClick);
        },
		
        _updateTableFormula: function(operation, tmgr, sheetIdx, oldName) {
            var xlObj = this.XLObj, calcEngine = xlObj.getCalcEngine(), isUpdate = false, isRename= false, xlEdit = xlObj.XLEdit;
            if(operation === "updateRange")
                isUpdate = true;
            if(operation === "rename")
                isRename = true;
            if(operation === "addRange" || isUpdate) {
                var i, range = tmgr.range,colsName,cells, name = tmgr.name, tableRangesFormula, tableFormulaCln ={}, colsLen;
                colsName = xlObj.getRangeData({ range:[range[0], range[1], range[0], range[3]], property: ["value2"], sheetIdx:sheetIdx });
                for(i=0,colsLen = colsName.length;i<colsLen;i++) {
                    if(isUpdate)
                        calcEngine.removeNamedRange(name + "[" + colsName[i].value2 +"]");
                    tableFormulaCln[colsName[i].value2] = xlEdit._parseSheetRef(xlObj._getDollarAlphaRange([range[0]+1, range[1]+i,  range[2], range[1]+i]));
                    calcEngine.addNamedRange(name + "[" + colsName[i].value2 +"]", tableFormulaCln[colsName[i].value2]);
                }
                if(isUpdate) {
                    calcEngine.removeNamedRange(name + "[#All]");
                    calcEngine.removeNamedRange(name + "[#Data]");
                    calcEngine.removeNamedRange(name + "[#Headers]");
                }
                if(tmgr.totalRow) {
                    calcEngine.removeNamedRange(name + "[#Rows]");
                    tableFormulaCln["#Rows"] = xlEdit._parseSheetRef(xlObj._getDollarAlphaRange([range[2], range[1], range[2], range[3]]));
                    calcEngine.addNamedRange(name + "[#Rows]",tableFormulaCln["#Rows"]);
                }
                tableFormulaCln["#All"] = xlEdit._parseSheetRef(xlObj._getDollarAlphaRange(range));
                calcEngine.addNamedRange(name + "[#All]",tableFormulaCln["#All"]);
                tableFormulaCln["#Data"] = xlEdit._parseSheetRef(xlObj._getDollarAlphaRange([range[0]+1, range[1], range[2], range[3]]));
                calcEngine.addNamedRange(name + "[#Data]",tableFormulaCln["#Data"] );
                tableFormulaCln["#Headers"] = xlEdit._parseSheetRef(xlObj._getDollarAlphaRange([range[0], range[1], range[0], range[3]]));
                calcEngine.addNamedRange(name + "[#Headers]",tableFormulaCln["#Headers"] );
                xlObj._tableRangesFormula[tmgr.name] = tableFormulaCln;
            }
            else if(operation === "totalRow") {
                if(calcEngine.namedRangeValues.containsKey(tmgr.name+"[#Rows]"))
                    calcEngine.removeNamedRange(tmgr.name+"[#Rows]");
                if(tmgr.totalRow) {
                    xlObj._tableRangesFormula[tmgr.name]["#Rows"] = xlEdit._parseSheetRef(xlObj._getDollarAlphaRange([tmgr.range[2], tmgr.range[1], tmgr.range[2], tmgr.range[3]]));
                    calcEngine.addNamedRange(tmgr.name+"[#Rows]",xlObj._tableRangesFormula[tmgr.name]["#Rows"]);
                }
                else 
                    xlObj._tableRangesFormula[tmgr.name]["#Rows"] && delete xlObj._tableRangesFormula[tmgr.name]["#Rows"];
					
                xlObj._tableRangesFormula[tmgr.name]["#All"]  = xlEdit._parseSheetRef(xlObj._getDollarAlphaRange(tmgr.range));
                calcEngine.removeNamedRange(tmgr.name+"[#All]");
                calcEngine.addNamedRange(tmgr.name+"[#All]",xlObj._tableRangesFormula[tmgr.name]["#All"]);
            }
            else if(operation === "removeTable" || isRename) {
                if(!isRename)
                    oldName = tmgr.name;
                var i, keyLen, name = tmgr.name, keys = xlObj.getObjectKeys(xlObj._tableRangesFormula[oldName]);
                for(i=0,keyLen = keys.length;i<keyLen;i++) {
                    calcEngine.removeNamedRange(oldName + "[" + keys[i] + "]");
                    if(isRename)
                        calcEngine.addNamedRange(name + "[" + keys[i] + "]", xlObj._tableRangesFormula[oldName][keys[i]] );
                }
                if(isRename)
                    xlObj._tableFormulaCollection[name] = xlObj._tableFormulaCollection[oldName];
                delete xlObj._tableRangesFormula[oldName];
                delete xlObj._tableFormulaCollection[oldName];
            }
        },
        _updateTableColName: function(rowIdx, colIdx, preVal, val, sheetIdx, tableClass) {
            var xlObj = this.XLObj, tid = xlObj._getTableID(tableClass), tmgr = xlObj.getSheet(sheetIdx).tableManager, range = tmgr[tid].range, tempVal = val.toUpperCase();
            if(range[0] === rowIdx && preVal.length && preVal.toUpperCase() !== tempVal ) {
                var calcEngine = xlObj.getCalcEngine(), keys, i, len, name = tmgr[tid].name, colsName = xlObj.getRangeData({ range:[range[0], range[1], range[0], range[3]], property: ["value2"], sheetIdx:sheetIdx }), j=2, tempArr = [], inc;
				    for(i=0, len = colsName.length;i<len;i++) {
					   tempArr[i] = colsName[i].value2 ? colsName[i].value2.toUpperCase() : "";
					   if(tempArr[i] === tempVal) {
						  val = val + j;
					      j++;
					    }
				    }
				    while(tempArr.indexOf(val.toUpperCase()) > -1) {
					inc = parseInt(val.slice(-1));					
					val = val.substring(0,val.length-1);
					val = (inc==NaN) ? val + j : (inc++ && val + inc);
				    }
                calcEngine.removeNamedRange(name + "[" + preVal + "]");
                calcEngine.addNamedRange(name + "[" + val + "]", xlObj._tableRangesFormula[name][preVal]);
                xlObj._tableRangesFormula[name][val] = xlObj._tableRangesFormula[name][preVal];
                delete xlObj._tableRangesFormula[name][preVal];
                keys = xlObj.getObjectKeys(xlObj._tableRangesFormula[name]);
                xlObj._tableFormulaCollection[name] = [];
                for(i=0, len = keys.length;i<len;i++)
                    xlObj._tableFormulaCollection[name].push({"text": "[" + keys[i] + "]", "display":keys[i]});
            }
			return val;
        }
    };

    ej.Spreadsheet.FontFamily = {
        "angsana new": "11N",
        "arial": "21N",
        "arial black": "31N",
        "batang": "41N",
        "book antiqua": "51N",
        "browallia new": "61N",
        "calibri": "71N",
        "cambria": "81N",
        "candara": "91N",
        "century": "10",
        "comic sans ms": "11",
        "consolas": "12",
        "constantia": "13",
        "corbel": "14",
        "cordia new": "15",
        "courier": "16",
        "courier new": "17",
        "dilleniaupc": "18",
        "dotum": "19",
        "fangsong": "20",
        "garamond": "21",
        "georgia": "22",
        "gulim": "23",
        "gungsuh": "24",
        "kaiti": "25",
        "jasmineupc": "26",
        "malgun gothic": "27",
        "mangal": "28",
        "meiryo": "29",
        "microsoft jhenghei": "30",
        "microsoft yahei": "31",
        "mingliu": "32",
        "mingliu_hkscs": "33",
        "ms gothic": "34",
        "ms mincho": "35",
        "ms pgothic": "36",
        "ms pmincho": "37",
        "pmingliu": "38",
        "pmingliu-extb": "39",
        "simhei": "40",
        "simsun": "41",
        "simsun-extb": "42",
        "tahoma": "43",
        "times": "44",
        "times new roman": "45",
        "trebuchet ms": "46",
        "verdana": "47",
        "yu gothic": "48",
        "yu mincho": "49"
    };

    ej.Spreadsheet.FontStyle = {
        "normal": "1",
        "italic": "2",
        "oblique": "3"
    };

    ej.Spreadsheet.TextAlign = {
        "left": "1",
        "right": "2",
        "center": "3",
        "justify": "4"
    };

    ej.Spreadsheet.VerticalAlign = {
        "top": "1",
        "middle": "2",
        "bottom": "3"
    };

    ej.Spreadsheet.TextDecoration = {
        "none": "1",
        "underline": "2",
        "overline": "3",
        "line-through": "4",
        "line-through underline": "5"
    };

    ej.Spreadsheet.FontWeight = {
        normal: "1",
        bold: "2"
    };

    ej.Spreadsheet.BorderStyle = {
        solid: "1",
        dashed: "2",
        dotted: "3",
        double: "4"
    };

    ej.Spreadsheet.CellFormat = {
        number: "{0:N2}",
        currency: "{0:C2}",
        accounting: "{0:C2}",
        percentage: "{0:P2}",
        shortdate: "{0:M/d/yyyy}",
        longdate: "{0:dddd, MMMM dd, yyyy}",
        time: "{0:h:mm:ss tt}",
        scientific: "{0:N2}",
    };

})(jQuery, Syncfusion);