(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.dragFill = function (obj) {
        this.XLObj = obj;
        this._customList = [
            ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        ];
        this._property = ["value", "value2", "type", "formatStr", "decimalPlaces", "thousandSeparator", "hyperlink", "format", "rule"];
        this._fillInfo = null;
        this._verticalFill = false;
        this._uniqueOBracket = String.fromCharCode(129);
        this._uniqueCBracket = String.fromCharCode(130);
        this._uniqueCSeparator = String.fromCharCode(131);
        this._uniqueCOperator = String.fromCharCode(132);
        this._uniquePOperator = String.fromCharCode(133);
        this._uniqueSOperator = String.fromCharCode(134);
        this._uniqueMOperator = String.fromCharCode(135);
        this._uniqueDOperator = String.fromCharCode(136);
        this._uniqueModOperator = String.fromCharCode(137);
        this._uniqueConcateOperator = String.fromCharCode(138);
		this._uniqueEqualOperator = String.fromCharCode(139);
		this._uniqueExpOperator = String.fromCharCode(140);
		this._uniqueGTOperator = String.fromCharCode(141);
		this._uniqueLTOperator = String.fromCharCode(142);
    };

    ej.spreadsheetFeatures.dragFill.prototype = {
        positionAutoFillElement: function (isdragfill) {
            var mergeIdx, rowIdx, colIdx, cellInfo, hdrInfo, sheetIdx, sheet, top = 0, left = 0,
                tdiff = 0, ldiff = 0, otdiff = 0, oldiff = 0, xlObj = this.XLObj, hide = "e-hide";
            if (!xlObj.model.allowAutoFill || !xlObj.model.allowSelection)
                return;
            sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx);
            if (sheet._isRowSelected) {
                tdiff = -3;
                ldiff = -1;
                otdiff = 5;
                oldiff = 4;
                rowIdx = sheet.selectedRange[2];
                colIdx = sheet.selectedRange[1];
                left = xlObj._isFrozen(sheet.frozenColumns) ? xlObj._getContent(sheetIdx).find(".e-content").scrollLeft() : sheet._scrollLeft;
            }
            else if (sheet._isColSelected) {
                ldiff = -3;
                oldiff = 5;
                rowIdx = sheet.selectedRange[0];
                colIdx = sheet.selectedRange[3];
                top = xlObj._isFrozen(sheet.frozenRows) ? xlObj._getContent(sheetIdx).find(".e-content").scrollTop() : sheet._scrollTop;
            }
            else if (sheet._isSheetSelected) {
                this.hideAutoFillElement();
                return;
            }
            else {
                tdiff = -3;
                ldiff = -3;
                otdiff = 1;
                oldiff = 3;
                rowIdx = sheet.selectedRange[2];
                colIdx = sheet.selectedRange[3];
            }
            mergeIdx = xlObj._getMergedIdx(rowIdx, colIdx);
            rowIdx = mergeIdx.rowIndex;
            colIdx = mergeIdx.colIndex;
            cellInfo = xlObj._getCellInfo({ rowIndex: rowIdx, colIndex: colIdx });
            if (!sheet._isColSelected)
                top += cellInfo.height;
            if (!sheet._isRowSelected)
                left += cellInfo.width;
            top += cellInfo.top;
            left += cellInfo.left;
            xlObj.getAutoFillElem() && xlObj.getAutoFillElem().removeClass(hide).css({top: Math.round(top) + tdiff, left: Math.round(left) + ldiff });
            if (xlObj.model.autoFillSettings.showFillOptions && isdragfill && xlObj.model.allowEditing && !xlObj.model.isReadOnly)
                xlObj._getAutoFillOptElem().removeClass(hide).css({ top: top + otdiff, left: left + oldiff });
            sheet._autoFillCell = xlObj._dautoFillCell = { rowIndex: rowIdx, colIndex: colIdx };
        },

        hideAutoFillElement: function () {
            var elem = this.XLObj.getAutoFillElem();
            if (elem)
                elem.addClass("e-hide");
        },

        hideAutoFillOptions: function () {
            var elem = this.XLObj._getAutoFillOptElem();
            if (elem) {
                if(!elem.find("button").data("ejSplitButton"))
                   this.XLObj._initializeSplitButton();
                elem.find("button").data("ejSplitButton")._hidePopup();
                elem.addClass("e-hide");
            }
        },

        autoFill: function (options) {
            var xlObj = this.XLObj;
            options = options || {};
            if (!xlObj.model.allowAutoFill || !options.dataRange || !options.fillRange || !options.direction || !xlObj.model.allowEditing || xlObj.model.isReadOnly)
                return;
            var bHeight, details, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), aOpt = ej.Spreadsheet.AutoFillOptions;
            this._fillInfo = this._getFillInfo(options);
            options.fillType = options.fillType || this._fillInfo.fillType;
            this._verticalFill = (options.direction === "down" || options.direction === "up");
            options.sheetIdx = sheetIdx;
            options.dataRange = xlObj._toIntrnlRange(options.dataRange, sheetIdx);
            options.fillRange = xlObj._toIntrnlRange(options.fillRange, sheetIdx);
            bHeight = $.extend(true, {}, sheet.rowsHeightCollection)
            details = { sheetIndex: options.sheetIdx, bHeight: bHeight, reqType: "auto-fill", direction: options.direction, range: options.fillRange, bRange: options.dataRange, bData: xlObj.getRangeData({ range: options.fillRange }), bFormat: xlObj.model.allowCellFormatting && xlObj.XLFormat.getHashCodeClassAsArray(options.fillRange) };
            details.rowSel = sheet._isRowSelected;
            details.colSel = sheet._isColSelected;
            if (xlObj._trigger("autoFillBegin", options))
                return false;
            switch (options.fillType) {
                case aOpt.FillSeries:
                case aOpt.FillWithoutFormatting:
                    this._fillSeries(options);
                    break;
                case aOpt.CopyCells:
                case aOpt.FillFormattingOnly:
                    this._copyCells(options);
                    break;
                case aOpt.FlashFill:
                    details.actionType = "flash-fill";
                    details.bdData = xlObj.getRangeData({ range: options.dataRange });
                    this._flashFill(options);
                    details.adData = xlObj.getRangeData({ range: options.dataRange });
                    break;
            }
            details.aData = xlObj.getRangeData({ range: options.fillRange });
            details.aHeight = $.extend(true, {}, sheet.rowsHeightCollection)
            if (xlObj.model.allowCellFormatting)
                details.aFormat = xlObj.XLFormat.getHashCodeClassAsArray(options.fillRange);
            if (!options.isKeyFill)
                this.positionAutoFillElement(true);
            xlObj._completeAction(details);
            xlObj._trigActionComplete(details);
            xlObj._trigger("autoFillComplete", options);
        },

		_updateFillValues: function(isVFill, dminr, dminc, dmaxr, dmaxc, fminr, fminc, fmaxr, fmaxc, i) {
		    var pStart, pEnd, fStart, fEnd, patrnRange, fillRange;
			if (isVFill) {
				pStart = { rowIndex: dminr, colIndex: dminc + i };
                pEnd = { rowIndex: dmaxr, colIndex: dminc + i };
                fStart = { rowIndex: fminr, colIndex: fminc + i };
                fEnd = { rowIndex: fmaxr, colIndex: fminc + i };
            }
            else {
                pStart = { rowIndex: dminr + i, colIndex: dminc };
                pEnd = { rowIndex: dminr + i, colIndex: dmaxc };
                fStart = { rowIndex: fminr + i, colIndex: fminc };
                fEnd = { rowIndex: fminr + i, colIndex: fmaxc };
            }
			patrnRange = [pStart.rowIndex, pStart.colIndex, pEnd.rowIndex, pEnd.colIndex];
            fillRange = [fStart.rowIndex, fStart.colIndex, fEnd.rowIndex, fEnd.colIndex];
			return {patrnRange : patrnRange, fillRange: fillRange};
		},
		
        _fillSeries: function (options) {
            var val, plen, patterns, patrn, pRanges, patrnRange, fillRange, formatObj, linkData, data, temp, dlen, j, k, l, tlen, tot, hasRef, format, formats,
                cells, clen, cellIdx, cellProps, i = 0, dataObj = {}, xlObj = this.XLObj, pos = ej.Spreadsheet.autoFillDirection, ctype = ej.Spreadsheet.CellType,
                dminr = options.dataRange[0], dminc = options.dataRange[1], dmaxr = options.dataRange[2], dmaxc = options.dataRange[3],
                fminr = options.fillRange[0], fminc = options.fillRange[1], fmaxr = options.fillRange[2], fmaxc = options.fillRange[3],
                isVFill = [pos.Down, pos.Up].indexOf(options.direction) > -1, isRFill = [pos.Up, pos.Left].indexOf(options.direction) > -1,
                len = isVFill ? dmaxc - dminc : dmaxr - dminr, withFrmt = options.fillType === ej.Spreadsheet.AutoFillOptions.FillSeries;
            while (i <= len) {
				pRanges = this._updateFillValues(isVFill, dminr, dminc, dmaxr, dmaxc, fminr, fminc, fmaxr, fmaxc, i);
				patrnRange = pRanges.patrnRange;
				fillRange = pRanges.fillRange;
                patterns = this._getPattern(patrnRange, { isRFill: isRFill, isVFill: isVFill });
                data = xlObj.getRangeData({ range: patrnRange, property: ["hyperlink", "rule", "cFormatRule", "type", "formatStr", "decimalPlaces", "wrap"] });
                dlen = data.length;
                if (!patterns)
                    return;
                plen = patterns.length;
                xlObj.clearRangeData(fillRange, [withFrmt ? "formatStr" : null, "hyperlink", withFrmt ? "cFormatRule" : null, "rule", "format"]);
                if (withFrmt) {
                    if (xlObj.model.allowCellFormatting)
                        xlObj.XLFormat.removeStyle(fillRange);
                    format = xlObj.getRangeData({ range: patrnRange, property: ["format", "formats"] });
                }
                cells = xlObj._getSelectedRange({ rowIndex: fillRange[0], colIndex: fillRange[1] }, { rowIndex: fillRange[2], colIndex: fillRange[3] });
                clen = cells.length;
                if (isRFill) {
                    cells = cells.reverse();
                    patterns = patterns.reverse();
                    patterns = this._ensurePattern(patterns);
                    data = data.reverse();
                    if (withFrmt)
                        format = format.reverse();
                }
                j = 0;
                while (j < clen) {
                    dataObj = {};
                    cellIdx = cells[j];
                    patrn = patterns[j % plen];
                    if (xlObj.isNumber(patrn))
                        patrn = patterns[patrn];
                    switch (patrn.type) {
                        case ctype.Number:
                            val = xlObj._round(patrn.regVal.a + (patrn.regVal.b * patrn.i), 5);
                            if (isRFill)
                                patrn.i--;
                            else
                                patrn.i++;
                            break;
                        case ctype.String:
                            val = patrn.val[patrn.i % patrn.val.length];
                            patrn.i++;
                            break;
                        case ctype.Formula:
                            hasRef = false;
                            val = "=";
                            k = 0;
                            tlen = patrn.val.length;
                            while (k < tlen) {
                                temp = patrn.val[k];
                                if (xlObj._isObject(temp)) {
                                    hasRef = true;
                                    tot = xlObj._round(temp.a + (temp.b * patrn.i), 0);
                                    if (tot < 1)
                                        val += "#REF!";
                                    else
                                        val += isVFill ? temp.c + (temp.b ? tot : '$' + tot) : (temp.b ? xlObj._generateHeaderText(tot) : '$' + xlObj._generateHeaderText(tot)) + temp.c;
                                }
                                else
                                    val += temp;
                                k++;
                            }
                            if (hasRef && isRFill)
                                patrn.i--;
                            else
                                patrn.i++;
                            break;
                        case ctype.Custom:
                            val = xlObj._round(patrn.regVal.a + (patrn.regVal.b * patrn.i), 0);
                            if (val < 0)
                                val = (val % patrn.len) + patrn.len;
                            if (val >= patrn.len)
                                val = val % patrn.len;
                            val = patrn.val[val];
                            if (isRFill)
                                patrn.i--;
                            else
                                patrn.i++;
                            break;
                    }
                    l = j % dlen;
                    cellProps = data[l];
                    xlObj._dupDetails = true;
                    xlObj.XLEdit.updateCellValue(cellIdx, val, withFrmt ? format[l].format : null);
                    xlObj._dupDetails = false;
                    if (withFrmt) {
                        if (xlObj.model.allowCellFormatting && (cellProps.type && cellProps.type != "general"))
                            this._updateNFormat(cellProps, cellIdx.rowIndex, cellIdx.colIndex);
                        if (xlObj.model.allowConditionalFormats && cellProps.cFormatRule)
                            this._updateCFormat(cellIdx, cellProps.cFormatRule);
                        formats = format[l].formats;
                        if (formats)
                            dataObj.formats = formats;
                        if (xlObj.model.allowHyperlink && cellProps.hyperlink)
                            this._updateHyperlinkTag(cellProps.hyperlink, cellIdx);
                    }
                    if (xlObj.model.allowDataValidation && cellProps.rule)
                        dataObj.rule = cellProps.rule;
                    if (xlObj.getObjectLength(dataObj))
                        xlObj.XLEdit._updateDataContainer(cellIdx, { dataObj: dataObj });
                    if (xlObj.model.allowWrap && cellProps.wrap) 
                        xlObj.setWrapText("wrap",[cellIdx.rowIndex, cellIdx.colIndex, cellIdx.rowIndex, cellIdx.colIndex]);
                    j++;
                }
                i++;
            }
        },

        _copyCells: function (options) {
            var i, j, k, l, patrnRange, fillRange, linkData, pRanges, data, flen, hlen, format, formats, cells, clen, props,
                cellProps, cellIdx, dataObj = {}, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), i = 0, pos = ej.Spreadsheet.autoFillDirection,
                dminr = options.dataRange[0], dminc = options.dataRange[1], dmaxr = options.dataRange[2], dmaxc = options.dataRange[3],
                fminr = options.fillRange[0], fminc = options.fillRange[1], fmaxr = options.fillRange[2], fmaxc = options.fillRange[3],
                isVFill = [pos.Down, pos.Up].indexOf(options.direction) > -1, isRFill = [pos.Up, pos.Left].indexOf(options.direction) > -1,
                len = isVFill ? dmaxc - dminc : dmaxr - dminr, formatOnly = options.fillType === ej.Spreadsheet.AutoFillOptions.FillFormattingOnly;
            while (i <= len) {
                pRanges = this._updateFillValues(isVFill, dminr, dminc, dmaxr, dmaxc, fminr, fminc, fmaxr, fmaxc, i);
				patrnRange = pRanges.patrnRange;
				fillRange = pRanges.fillRange;                
                if (xlObj.model.allowCellFormatting) {
                    if (fillRange[0] == fillRange[2])
                        for (var m = [1]; m <= [3]; m++) {
                             if (!xlObj.XLEdit.getPropertyValue(fillRange[0], m, "tformats") && !xlObj.XLEdit.getPropertyValue(fillRange[0], m, "formats"))
                                xlObj.XLFormat.removeStyle([fillRange[0], m, fillRange[2], m]);
                        }
                    else
                        for (var n = fillRange[0]; n <= fillRange[2]; n++) {
                            if (!xlObj.XLEdit.getPropertyValue(n, fillRange[1], "tformats") && !xlObj.XLEdit.getPropertyValue(fillRange[0], m, "formats"))
                                xlObj.XLFormat.removeStyle([n, fillRange[1], n, fillRange[3]]);
                        }
                }
                if (!formatOnly) {
                    props = ["value", "value2", "type", "formatStr", "format", "decimalPlaces", "thousandSeparator", "hyperlink"];
                    if (xlObj.model.allowConditionalFormats)
                        props.push("cFormatRule");
                    if (xlObj.model.allowDataValidation)
                        props.push("rule");
                    xlObj.clearRangeData(fillRange, props);
                    data = xlObj.getRangeData({ range: patrnRange, property: ["value", "hyperlink", "rule", "cFormatRule", "type", "decimalPlaces", "formatStr"] });
                }
                else {
                    xlObj.clearRangeData(fillRange, ["format"]);
                    data = xlObj.getRangeData({ range: patrnRange, property: ["cFormatRule", "type", "decimalPlaces", "formatStr"] });
                }
                format = xlObj.getRangeData({ range: patrnRange, property: ["format", "formats"] });
                flen = format.length;
                cells = xlObj._getSelectedRange({ rowIndex: fillRange[0], colIndex: fillRange[1] }, { rowIndex: fillRange[2], colIndex: fillRange[3] });
                clen = cells.length;
                j = 0;
                if (isRFill) {
                    cells = cells.reverse();
                    format = format.reverse();
                    if (!formatOnly)
                        data = data.reverse();
                }
                if (formatOnly) {
                    while (j < clen) {
                        dataObj = {};
                        k = j % flen;
                        cellIdx = cells[j];
                        cellProps = data[k];
                        if (xlObj.model.allowCellFormatting) {
                            xlObj.XLFormat._updateFormatClass(cellIdx, format[k].format);
                            this._updateNFormat(cellProps, cellIdx.rowIndex, cellIdx.colIndex);
                        }
                        formats=format[k].formats;
                        if (formats)
                            dataObj.formats = formats;
                        if (xlObj.getObjectLength(dataObj))
                            xlObj.XLEdit._updateDataContainer(cellIdx, { dataObj: dataObj });
                        if (xlObj.model.allowConditionalFormats && cellProps.cFormatRule)
                            this._updateCFormat(cellIdx, cellProps.cFormatRule);
                        if (xlObj.model.allowCellType)
                            xlObj.XLCellType._rfrshCtrlText(cellIdx);
                        j++;
                    }
                }
                else {
                    while (j < clen) {
                        dataObj = {};
                        k = j % flen;
                        cellIdx = cells[j];
                        cellProps = data[k];
                        xlObj._dupDetails = true;
                        xlObj.XLEdit.updateCellValue(cellIdx, cellProps.value, format[k].format);
                        xlObj._dupDetails = false;
                        if (xlObj.model.allowCellFormatting &&(cellProps.type && cellProps.type != "general"))
                            this._updateNFormat(cellProps, cellIdx.rowIndex, cellIdx.colIndex);
                        if (xlObj.model.allowHyperlink && cellProps.hyperlink)
                            this._updateHyperlinkTag(cellProps.hyperlink, cellIdx);
                        formats = format[k].formats;
                        if (formats)
                            dataObj.formats = formats;
                        if (xlObj.model.allowDataValidation && cellProps.rule)
                            dataObj.rule = cellProps.rule;
                        if (xlObj.getObjectLength(dataObj))
                            xlObj.XLEdit._updateDataContainer(cellIdx, { dataObj: dataObj });
                        if (xlObj.model.allowConditionalFormats && cellProps.cFormatRule)
                            this._updateCFormat(cellIdx, cellProps.cFormatRule);
                        j++;
                    }
                }
                i++;
            }
        },

        _flashFill: function (options) {
            var cells, data, i, xlObj = this.XLObj, dminr = options.dataRange[0], dmaxr = options.dataRange[2], fminr = options.fillRange[0];
            var fminc = options.fillRange[1], fmaxr = options.fillRange[2], fmaxc = options.fillRange[3], patrn = this._getFlashFillPattern(options.dataRange, "left");
            if (patrn) {
                data = xlObj.getRangeData({ range: [fminr, patrn.colIndex, fmaxr, patrn.colIndex], valueOnly: true, skipDateTime: true });
                if (patrn.subStr > -1)
                    data = this._splitString(data, " ", patrn.subStr);
                cells = xlObj._getSelectedRange({ rowIndex: fminr, colIndex: fminc }, { rowIndex: fmaxr, colIndex: fmaxc });
                i = cells.length;
                while (i--)
                    xlObj.XLEdit._updateCellValue(cells[i], data[i]);
            }
            else {
                if (fminr > dminr)
                    fminr = dminr;
                if (fmaxr < dmaxr)
                    fmaxr = dmaxr;
                xlObj._getAutoFillOptElem().addClass("e-hide");
                xlObj.updateUniqueData({ value: "", value2: "", type: "general" }, [fminr, fminc, fmaxr, fmaxc]);
                xlObj._showAlertDlg("Alert", "FlashFillAlert");
            }
        },

        _getFlashFillPattern: function (range, move) {
            var resp, value, splval, slen, j, val, i = 0, subStr = -1, xlObj = this.XLObj, data = xlObj.getRangeData({ range: range, valueOnly: true, skipDateTime: true }),
                dlen = data.length, minr = range[0], right = ej.Spreadsheet.autoFillDirection.Right, isRight = move === right;
            if (!data.join().replace(/,/g, '').length)
                return;
            val = data[0].toString();
            i = range[1];
            if (i === 0)
				isRight = true;
			isRight ? i++ : i--;
            while ( i > -1) {
                    value = xlObj.XLEdit.getPropertyValue(minr, i);
                    value = xlObj.isUndefined(value) ? "" : value.toString();
                    if (!value.length)
                        break;
                    else {
                        if (value === val) {
                            if (dlen > 1) {
                                resp = this._matchData(minr, i, data);
                                if (resp)
                                    return resp;
                            }
                            else
                                return { colIndex: i, subStr: subStr };
                        }
                        splval = value.split(" ");
                        slen = splval.length;
                        j = 0;
                        while (j < slen) {
                            if (val === splval[j]) {
                                subStr = j;
                                if (dlen > 1) {
                                    resp = this._matchData(minr, i, data);
                                    if (resp) {
                                        if (subStr > resp.subStr)
                                            resp.subStr = subStr;
                                        return resp;
                                    }
                                }
                                else
                                    return { colIndex: i, subStr: subStr };
                            }
                            j++;
                        }
						isRight ? i++ : i--;
                    }
            }
            if (!isRight)
                    return this._getFlashFillPattern(range, right);
        },

        _matchData: function (rowIdx, colIdx, data) {
            var j, match = false, val, value, splval, slen, i = 1, subStr = -1, dlen = data.length;
            while (i < dlen) {
                match = false;
                val = data[i].toString();
                value = this.XLObj.XLEdit.getPropertyValue(rowIdx + i, colIdx);
                value = ej.isNullOrUndefined(value) ? "" : value.toString();
                if (val === value) {
                    match = true;
                    i++;
                    continue;
                }
                splval = value.split(" ");
                slen = splval.length;
                j = 0;
                while (j < slen) {
                    if (val === splval[j]) {
                        if (subStr < j)
                            subStr = j;
                        match = true;
                        break;
                    }
                    j++;
                }
                i++;
            }
            if (match && i === dlen)
                return { colIndex: colIdx, subStr: subStr };
        },

        _splitString: function (array, splitter, index) {
            var data, val, i = array.length, j;
            while (i--) {
                j = index;
                data = array[i].split(splitter);
                while (j > -1) {
                    val = data[j];
                    if (val)
                        break;
                    j--;
                }
                array[i] = val;
            }
            return array;
        },

        _getPattern: function (range, options) {
            var j, idx, temp, regVal, custColl, lCaseColl, lCaseVal, isLCase, diff, len, i = 0, pattern = [], xlObj = this.XLObj,
                ctype = ej.Spreadsheet.CellType, patrns = this._getDataPattern(range), plen = patrns.length, patrn;
            if (patrns) {
                while (i < plen) {
                    patrn = patrns[i];
                    switch (patrn.type) {
                        case ctype.Number:
                            idx = pattern.length;
                            len = patrn.val.length;
                            diff = options.isRFill ? -1 : len;
                            if (len === 1)
                                patrn.val.push(patrn.val[0] + 1);
                            regVal = this._getPredictionValue(patrn.val);
                            temp = { regVal: regVal, type: patrn.type, i: diff };
                            pattern.push(temp);
                            j = 1;
                            while (j < len) {
                                pattern.push(idx);
                                j++;
                            }
                            break;
                        case ctype.String:
                            idx = pattern.length;
                            temp = { val: patrn.val, type: patrn.type, i: 0 };
                            pattern.push(temp);
                            j = 1;
                            len = patrn.val.length;
                            while (j < len) {
                                pattern.push(idx);
                                j++;
                            }
                            break;
                        case ctype.Formula:
                            len = patrn.val.length;
                            patrn = this._getFormulaPattern(patrn.val, options);
                            diff = options.isRFill ? -1 : len;
                            if (patrn.isInPattern) {
                                idx = pattern.length;
                                temp = { val: patrn.val, type: ctype.Formula, i: diff };
                                pattern.push(temp);
                                j = 1;
                                while (j < len) {
                                    pattern.push(idx);
                                    j++;
                                }
                            }
                            else {
                                j = 0;
                                diff = options.isRFill ? -1 : 1;
                                while (j < len) {
                                    pattern.push({ val: patrn.val[j], type: ctype.Formula, i: diff });
                                    j++;
                                }
                            }
                            break;
                        default:
                            if (patrn.type.indexOf(ctype.Custom) > -1) {
                                idx = pattern.length;
                                len = patrn.val.length;
                                diff = options.isRFill ? -1 : len;
                                custColl = this._customList[Number(patrn.type.replace(ctype.Custom, ''))];
                                isLCase = custColl.indexOf(patrn.val[0]) === -1;
                                lCaseColl = xlObj.toArrayLowerCase(custColl.slice(0));
                                lCaseVal = xlObj.toArrayLowerCase(patrn.val);
                                regVal = this._getCustomPredictionValue(lCaseVal, lCaseColl);
                                temp = { val: isLCase ? lCaseColl : custColl, regVal: regVal, i: diff, type: ctype.Custom, len: custColl.length };
                                pattern.push(temp);
                                j = 1;
                                while (j < len) {
                                    pattern.push(idx);
                                    j++;
                                }
                            }
                    }
                    i++;
                }
                return pattern;
            }
        },

        _getCustomPredictionValue: function (data, coll) {
            var i = 0, temp = [], len = data.length;
            while (i < len) {
                temp.push(coll.indexOf(data[i]));
                i++;
            }
            if (temp.length === 1)
                temp.push(temp[0] + 1);
            return this._getPredictionValue(temp);
        },

        _getDataPattern: function (range) {
            var val, type, i = 0, obj = {}, patrn = [], data = this.XLObj.getRangeData({ range: range, valueOnly: true, skipDateTime: true }), dlen = data.length;
            if (dlen) {
                while (i < dlen) {
                    val = data[i];
                    type = this._getType(val);
                    if (i === 0)
                        obj = { val: [val], type: type };
                    else if (type === obj.type)
                        obj.val.push(val);
                    else {
                        patrn.push(obj);
                        obj = { val: [val], type: type };
                    }
                    i++;
                }
                patrn.push(obj);
                return patrn;
            }
        },

        _getFormulaPattern: function (data, options) {
            var patrn, j, temp, isInPatrn, xlObj = this.XLObj, patrns = [], i = 0, len = data.length, cRfrType;
            while (i < len) {
                patrns.push(this._parseFormula(data[i]));
                i++;
            }
            isInPatrn = this._isInPattern(patrns, options.isVFill);
            if (isInPatrn) {
                patrn = patrns[0];
                i = patrn.length;
                while (i--) {
                    temp = patrn[i];
                    cRfrType = xlObj._isCellReference(temp);
                    if (cRfrType && (cRfrType !== "absolute"))
                        patrn[i] = this._getCellRefPrediction(temp, options, null, cRfrType);
                }
                return { isInPattern: isInPatrn, val: patrn };
            }
            else {
                i = 0;
                while (i < len) {
                    patrn = patrns[i];
                    j = patrn.length;
                    while (j--) {
                        temp = patrn[j];
                        cRfrType = xlObj._isCellReference(temp);
                        if (cRfrType && (cRfrType !== "absolute"))
                            patrns[i][j] = this._getCellRefPrediction(temp, options, len, cRfrType);
                    }
                    i++;
                }
                return { isInPattern: isInPatrn, val: patrns };
            }
        },

        _getCellRefPrediction: function (text, options, length, rfrType) {
            text = text.toUpperCase();
            var eStr = "", aRegx = new RegExp("[a-z$]", "gi"), nRegx = new RegExp("[0-9$]", "g"), str = options.isVFill ? text.replace(nRegx, eStr) : text.replace(aRegx, eStr),
                temp = options.isVFill ? Number(text.replace(aRegx, eStr)) : this.XLObj._generateColCount(text.replace(nRegx, eStr)), arr = [temp], isColAbslt = text[0] === '$';            
            if (length && length !== 1)
                arr.push(temp + length);
            else
                arr.push(temp + 1);
            temp = this._getPredictionValue(arr);
            if (rfrType && (rfrType === "mixed")) {
                if (isColAbslt === options.isVFill)
                    str = '$' + str;
                else
                    temp.b = 0;
            }
            temp.c = str;
            return temp;
        },

        _isInPattern: function (patrn, isVFill) {
            var oldPatrn, olen, newPatrn, nlen, oldStr, newStr, oldInt, newInt, xlObj = this.XLObj, eStr = "",
                i = 0, j = 1, plen = patrn.length, nregx = new RegExp("[0-9$]", "g"), aregx = new RegExp("[a-z$]", "gi");
            if (plen === 1)
                return false;
            while (j < plen) {
                oldPatrn = patrn[i];
                newPatrn = patrn[j];
                olen = oldPatrn.length;
                nlen = newPatrn.length;
                if (olen !== nlen)
                    return false;
                else {
                    while (olen--) {
                        oldStr = oldPatrn[olen];
                        newStr = newPatrn[olen];
                        if (xlObj._isCellReference(oldStr) === xlObj._isCellReference(newStr)) {
                            if (isVFill) {
                                oldInt = Number(oldStr.replace(aregx, eStr));
                                newInt = Number(newStr.replace(aregx, eStr));
                            }
                            else {
                                oldInt = xlObj._generateColCount(oldStr.replace(nregx, eStr));
                                newInt = xlObj._generateColCount(newStr.replace(nregx, eStr));
                            }
                            if (oldInt !== newInt - 1)
                                return false;
                        }
                        else if (oldStr !== newStr)
                            return false;
                    }
                }
                i++;
                j++;
            }
            return true;
        },

        _parseFormula: function (formula) {
            var temp, str, len, i = 0, arr = [];
            formula = this._markSpecialChar(formula.replace("=", ""));
            formula = formula.split(/\(|\)|=|\^|>|<|,|:|\+|-|\*|\/|%|&/g);
            len = formula.length;
            while (i < len) {
                temp = formula[i];
                if (!temp) {
                    i++;
                    continue;
                }
                if (temp.length === 1)
                    arr.push(this._isUniqueChar(temp) ? this._getUniqueCharVal(temp) : temp);
                else {
                    str = temp[0];
                    if (temp.indexOf('!') > 0) {
                        if (this._isUniqueChar(str)) {
                            arr.push(this._getUniqueCharVal(str));
                            temp = temp.substr(1);
                        }
                        str = temp.indexOf('!') + 1;
                        arr.push(temp.substr(0, str));
                        arr.push(temp.substr(str));
                    }
                    else if (this._isUniqueChar(str)) {
                        arr.push(this._getUniqueCharVal(str));
                        arr.push(temp.substr(1));
                    }
                    else
                        arr.push(temp);
                }
                i++;
            }
            return arr;
        },

        _getUniqueCharVal: function (str) {
            switch (str) {
                case this._uniqueOBracket:
                    return "(";
                case this._uniqueCBracket:
                    return ")";
                case this._uniqueCSeparator:
                    return ",";
                case this._uniqueCOperator:
                    return ':';
                case this._uniquePOperator:
                    return "+";
                case this._uniqueSOperator:
                    return "-";
                case this._uniqueMOperator:
                    return "*";
                case this._uniqueDOperator:
                    return "/";
                case this._uniqueModOperator:
                    return "%";
                case this._uniqueConcateOperator:
                    return "&";
				case this._uniqueEqualOperator:
					return "=";
				case this._uniqueExpOperator:
					return "^";
				case this._uniqueGTOperator :
					return ">";
				case this._uniqueLTOperator :
					return "<";
            }
            return "";
        },

        _isUniqueChar: function (str) {
            var code = str.charCodeAt(str);
            return code >= 129 && code <= 142;
        },

        _markSpecialChar: function (formula) {
            formula = formula.replace(/\(/g, "(" + this._uniqueOBracket).replace(/\)/g, ")" + this._uniqueCBracket);
            formula = formula.replace(/,/g, "," + this._uniqueCSeparator).replace(/:/g, ":" + this._uniqueCOperator);
            formula = formula.replace(/\+/g, "+" + this._uniquePOperator).replace(/-/g, "-" + this._uniqueSOperator);
            formula = formula.replace(/\*/g, "*" + this._uniqueMOperator).replace(/\//g, "/" + this._uniqueDOperator);
            formula = formula.replace(/&/g, "&" + this._uniqueConcateOperator);
			formula = formula.replace(/=/g, "=" + this._uniqueEqualOperator);
			formula = formula.replace(/\^/g, "^" + this._uniqueExpOperator);
			formula = formula.replace(/>/g, ">" + this._uniqueGTOperator ).replace(/</g, "<" + this._uniqueLTOperator );
            return formula.replace(/%/g, "%" + this._uniqueModOperator);
        },

        _getPredictionValue: function (args) {
            var i = 0, sumx = 0, sumy = 0, sumxy = 0, sumxx = 0, n = args.length;
            while (i < n) {
                sumx = sumx + i;
                sumy = sumy + Number(args[i]);
                sumxy = sumxy + (i * Number(args[i]));
                sumxx = sumxx + (i * i);
                i++;
            }
            var a = this.XLObj._round(((sumy * sumxx) - (sumx * sumxy)) / ((n * sumxx) - (sumx * sumx)), 5), b = this.XLObj._round(((n * sumxy) - (sumx * sumy)) / ((n * sumxx) - (sumx * sumx)), 5);
            return { a: a, b: b };
        },

        _getType: function (val) {
            var type = this._isCustomType(val), ctype = ej.Spreadsheet.CellType, xlObj = this.XLObj;
            if (type)
                type = type;
            else if (xlObj.isFormula(val))
                type = ctype.Formula;
            else if (xlObj.isNumber(val))
                type = ctype.Number;
            return type || ctype.String;
        },

        _isCustomType: function (val) {
            val = val + "";
            val = val.toLowerCase();
            var i = this._customList.length;
            while (i--) {
                if (this.XLObj.toArrayLowerCase(this._customList[i].slice(0)).indexOf(val) > -1)
                    return ej.Spreadsheet.CellType.Custom + i;
            }
            return false;
        },

        _ensurePattern: function (patterns) {
            var patrn, idx = -1, i = patterns.length;
            while (i--) {
                patrn = patterns[i];
                if (this.XLObj._isObject(patrn)) {
                    idx = i;
                    if (patrn.type === ej.Spreadsheet.CellType.String)
                        patrn.val = patrn.val.reverse();
                }
                else
                    patterns[i] = idx;
            }
            return patterns;
        },

        _selectAutoFillRange: function (trgt, idx) {
            if (trgt)
                idx = this.XLObj._getCellIdx(trgt);
            var i, cells, xlObj = this.XLObj, range = this._getAutoFillRange(idx);
            if (!range)
                return;
            this._autoFillCleanUp();
            cells = xlObj.getRange([range.startCell.rowIndex, range.startCell.colIndex, range.endCell.rowIndex, range.endCell.colIndex]);
            i = cells.length;
            while (i--)
                xlObj.addClass(cells[i], "e-autofillcell");
            xlObj.XLSelection._focusRange(range.startCell, range.endCell, xlObj._autofillBorder);
            xlObj._dautoFillCell = idx;
        },

        _getAutoFillRange: function (idx) {
            var dir = ej.Spreadsheet.autoFillDirection, xlObj = this.XLObj, sheet = xlObj.getSheet(xlObj.getActiveSheetIndex()), scell = sheet._startCell,
                ecell = sheet._endCell, acell = sheet._autoFillCell, range = sheet.selectedRange, minr = range[0], minc = range[1], maxr = range[2],
                maxc = range[3], inRange = xlObj.inRange(range, idx.rowIndex, idx.colIndex), minIdx = { rowIndex: minr, colIndex: minc },
                maxIdx = { rowIndex: maxr, colIndex: maxc };
            if (idx.rowIndex < acell.rowIndex) {// up 
                if (sheet._isFreezed && idx.rowIndex <= sheet.frozenRows && sheet._hiddenFreezeRows.indexOf(sheet.frozenRows) > -1)
                    idx.rowIndex = sheet._ftopRowIdx;
                if ((minr - idx.rowIndex > idx.colIndex - maxc) && (minr - idx.rowIndex > minc - idx.colIndex))
                    return inRange ? { startCell: minIdx, endCell: { rowIndex: idx.rowIndex, colIndex: maxc } } : { startCell: maxIdx, endCell: { rowIndex: idx.rowIndex, colIndex: minc }, fillRange: [idx.rowIndex, minc, minr - 1, maxc], direction: dir.Up };
               else if (idx.colIndex > acell.colIndex )
                    return { startCell: minIdx, endCell: { rowIndex: maxr, colIndex: idx.colIndex }, fillRange: [minr, maxc + 1, maxr, idx.colIndex], direction: dir.Right };
                else if(idx.colIndex < acell.colIndex )
                    return inRange ? { startCell: minIdx, endCell: maxIdx } : { startCell: maxIdx, endCell: { rowIndex: minr, colIndex: idx.colIndex }, fillRange: [minr, idx.colIndex, maxr, minc - 1], direction: dir.Left };
              
            }
            else if (idx.colIndex > acell.colIndex) {// right
                if ((idx.rowIndex - maxr > idx.colIndex - maxc))
                    return { startCell: minIdx, endCell: { rowIndex: idx.rowIndex, colIndex: maxc }, fillRange: [maxr + 1, minc, idx.rowIndex, maxc], direction: dir.Down };
                else
                    return { startCell: minIdx, endCell: { rowIndex: maxr, colIndex: idx.colIndex }, fillRange: [minr, maxc + 1, maxr, idx.colIndex], direction: dir.Right };
            }

            else if (idx.colIndex < acell.colIndex) { // left
                if (sheet._isFreezed && idx.colIndex <= sheet.frozenColumns && sheet._hiddenFreezeCols.indexOf(sheet.frozenColumns) > -1)
                    idx.colIndex = sheet._fleftColIdx;
                if ((idx.rowIndex - maxr > maxc - idx.colIndex) || ((idx.rowIndex - minr > maxc - idx.colIndex) && idx.rowIndex !== maxr))
                    return { startCell: minIdx, endCell: { rowIndex: idx.rowIndex, colIndex: maxc }, fillRange: [maxr + 1, minc, idx.rowIndex, maxc], direction: dir.Down };
                else
                    return inRange ? { startCell: minIdx, endCell: maxIdx } : { startCell: maxIdx, endCell: { rowIndex: minr, colIndex: idx.colIndex }, fillRange: [minr, idx.colIndex, maxr, minc - 1], direction: dir.Left };
            }
            else if (idx.rowIndex > acell.rowIndex) // down                
                return { startCell: minIdx, endCell: { rowIndex: idx.rowIndex, colIndex: maxc }, fillRange: [maxr + 1, minc, idx.rowIndex, maxc], direction: dir.Down };
            else if (idx.rowIndex === acell.rowIndex && idx.colIndex === acell.colIndex)
                return { startCell: scell, endCell: ecell };
        },

        _getDirection: function (endCell, currcell, isVerticalFill) {
            var dir = ej.Spreadsheet.autoFillDirection;
            isVerticalFill = this.XLObj.isUndefined(isVerticalFill) ? this._verticalFill : isVerticalFill;
            if (isVerticalFill) {
                if (currcell.rowIndex < endCell.rowIndex) // up
                    return dir.Up;
                else if (currcell.rowIndex > endCell.rowIndex) // down
                    return dir.Down;
                else if (currcell.colIndex > endCell.colIndex) // right
                    return dir.Right;
                else if (currcell.colIndex < endCell.colIndex) // left
                    return dir.Left;
            }
            else {
                if (currcell.colIndex > endCell.colIndex) // right
                    return dir.Right;
                else if (currcell.colIndex < endCell.colIndex) // left
                    return dir.Left;
                else if (currcell.rowIndex < endCell.rowIndex) // up
                    return dir.Up;
                else if (currcell.rowIndex > endCell.rowIndex) // down
                    return dir.Down;
            }
            return null;
        },

        _getFillRange: function (pStartCell, pEndCell, pFillCell, direction) {
            var dir = ej.Spreadsheet.autoFillDirection;
            switch (direction) {
                case dir.Up:
                    return [pFillCell.rowIndex, pStartCell.colIndex, pStartCell.rowIndex - 1, pEndCell.colIndex];
                case dir.Right:
                    return [pStartCell.rowIndex, pEndCell.colIndex + 1, pEndCell.rowIndex, pFillCell.colIndex];
                case dir.Down:
                    return [pEndCell.rowIndex + 1, pStartCell.colIndex, pFillCell.rowIndex, pEndCell.colIndex];
                case dir.Left:
                    return [pStartCell.rowIndex, pFillCell.colIndex, pEndCell.rowIndex, pStartCell.colIndex - 1];
            }
            return null;
        },

        _autoFillOptionClick: function (args) {
            var dragFill, sheet, dir, dataRange, fillRange, sCell, eCell, autoElem = $("#" + args.model.targetID).find("#" + args.ID).find(">>");
            if (this._hasClass(autoElem[0], "e-ss-fillselect"))
                return;
            dragFill = this.XLDragFill, sheet = this.getSheet(this.getActiveSheetIndex()), dir = dragFill._getDirection(this._pEndCell, this._pFillCell);
            dataRange = this.swapRange([this._pStartCell.rowIndex, this._pStartCell.colIndex, this._pEndCell.rowIndex, this._pEndCell.colIndex]);
            fillRange = dragFill._getFillRange(this._pStartCell, this._pEndCell, this._pFillCell, dir), sCell = sheet._startCell, eCell = sheet._endCell;
            this._isUndo = true;
            this._performUndoRedo();
            if (!sheet._isColSelected && !sheet._isRowSelected) {
                sheet._startCell = sCell;
                sheet._endCell = eCell;
                this.XLSelection.selectRange(sheet._startCell, sheet._endCell);
            }
            dragFill.positionAutoFillElement(true);
            dragFill.autoFill({ dataRange: dataRange, fillRange: fillRange, direction: dir, fillType: args.ID });
            dragFill._fillInfo.fillType = args.ID;
            this._isUndo = false;
        },

        _autoFillCleanUp: function () {
            var i, cname, cells, cell, hide = "e-hide", xlObj = this.XLObj, aElem = xlObj.getAutoFillElem(), aOpt = xlObj._getAutoFillOptElem();
            if (aElem)
                xlObj.addClass(aElem[0], hide);
            if (aOpt)
                xlObj.addClass(aOpt[0], hide);
            cells = xlObj._getContent(xlObj.getActiveSheetIndex())[0].querySelectorAll("td.e-autofillcell");
            i = cells.length;
            while (i--) {
                cell = cells[i];
                cname = cell.className;
                cname = cname.replace(/e-autofillcell|e-blur/g, "");
                cname = cname.replace(/ +/g, " ");
                cell.className = cname;
            }
        },

        _autoFillClick: function () {
            var len, i = 0, cname = "e-ss-fillselect", elems = $("#" + this._id + "_ctxtmenu").find("li"), enabledItem = elems.find("." + cname);
            // to remove existing enabled item
            if (enabledItem.length) {
                enabledItem = enabledItem[0];
                this._removeClass(enabledItem, cname);
                this.addClass(enabledItem, "e-ss-filloption");
            }
            // to show all elements 
            elems.show();
            // to hide some options based on scenario
            len = this.XLDragFill._fillInfo.disableItems.length;
            while (i < len) {
                $(elems[this.XLDragFill._fillInfo.disableItems[i]]).hide();
                i++;
            }
            // to select fill type item
            elems.filter("#" + this.XLDragFill._fillInfo.fillType).find("span").addClass(cname);
        },

        _fillRange: function (verticalFill, range) {
            var dirc, isProperKey, pRange, cells, minr, minc, maxr, maxc, args = { isKeyFill: true }, xlObj = this.XLObj,
                sheetIdx=xlObj.getActiveSheetIndex(),sheet = xlObj.getSheet(sheetIdx), direction = ej.Spreadsheet.autoFillDirection;
            range = range ? range : sheet.selectedRange;
            minr = range[0], minc = range[1], maxr = range[2], maxc = range[3];
            dirc = this._getDirection({ rowIndex: minr, colIndex: minc }, { rowIndex: maxr, colIndex: maxc }, verticalFill);
            isProperKey = verticalFill ? dirc === direction.Down : dirc === direction.Right;
            if (xlObj.isRange(range) && isProperKey) {
                if (verticalFill) {
                    args.dataRange = [minr, minc, minr, maxc];
                    args.fillRange = [minr + 1, minc, maxr, maxc];
                }
                else {
                    args.dataRange = [minr, minc, maxr, minc];
                    args.fillRange = [minr, minc + 1, maxr, maxc];
                }
            }
            else {
                if (verticalFill) {
                    if (!minr)
                        return;
                    args.dataRange = [minr - 1, minc, minr - 1, maxc];
                }
                else {
                    if (!minc)
                        return;
                    args.dataRange = [minr, minc - 1, maxr, minc - 1];
                }
                args.fillRange = range;
            }
            args.direction = verticalFill ? direction.Down : direction.Right;
            args.fillType = ej.Spreadsheet.AutoFillOptions.CopyCells;
            pRange = xlObj.swapRange(args.fillRange);
            if (xlObj.model.allowLockCell && sheet.isSheetProtected) {            
                if (xlObj._isPropExists(([pRange]),"isLocked", sheetIdx))
                    return;
            }
            if (xlObj._isPropExists(([pRange]), "isReadOnly", sheetIdx))
                return;
            this.autoFill(args);
        },

        _getFillInfo: function (options) {
            var i, val, isStringType = true, fillType = ej.Spreadsheet.AutoFillOptions.CopyCells, disableItems = [],
                xlObj = this.XLObj, pos = ej.Spreadsheet.autoFillDirection, isVFill = [pos.Down, pos.Up].indexOf(options.direction) > -1,
                data = xlObj.getRangeData({ range: options.dataRange, valueOnly: true, skipDateTime: true }), len = data.join().replace(/,/g, '').length;
            if (xlObj.isRange(options.dataRange) && len) {
                i = data.length;
                while (i--) {
                    val = data[i];
                    if (xlObj.isNumber(val) || xlObj.isFormula(val) || this._isCustomType(val)) {
                        isStringType = false;
                        fillType = xlObj.model.autoFillSettings.fillType;
                        break;
                    }
                }
            }
            else {
                val = data[0];
                if (xlObj.isNumber(val) || xlObj.isFormula(val) || this._isCustomType(val)) {
                    isStringType = false;
                    fillType = xlObj.model.autoFillSettings.fillType;
                }
            }            
            if (!len || isStringType) {
                disableItems.push(1);
                fillType = (options.fillType == "fillseries") ? fillType : options.fillType;
            }
            if (!isVFill || (isVFill && options.dataRange[1] !== options.dataRange[3]))
                disableItems.push(4);
            return { fillType: fillType, disableItems: disableItems };
        },

        _updateHyperlinkTag: function (hlData, cellIdx) {
            var cell, xlObj = this.XLObj, val = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "value2");
            if (xlObj._isRowViewable(xlObj.getActiveSheetIndex(), cellIdx.rowIndex)) {
                cell = xlObj.getCell(cellIdx.rowIndex, cellIdx.colIndex);
                if(cell[0].lastChild.nodeType === 3)
                    $(cell[0].lastChild).remove();
              cell.append(ej.buildTag("a.e-hyperlinks", val, "", !hlData.webAddr ? { href: "#" } : { href: hlData.webAddr, target: "_blank" }));

            }
            xlObj.XLEdit._updateDataContainer(cellIdx, { dataObj: { hyperlink: hlData } });
        },

        _updateCFormat: function (cellIdx, rule) {
            var splitStr,  i = 0, xlObj = this.XLObj, len = rule.length;
            xlObj._dupDetails = true;
            while (i < len) {
                splitStr = rule[i].split("_");
                xlObj.XLCFormat._cFormat(splitStr[0], splitStr[2], splitStr[3], splitStr[4],splitStr[5], null, null, [cellIdx.rowIndex, cellIdx.colIndex, cellIdx.rowIndex, cellIdx.colIndex]);
                i++;
            }
            xlObj._dupDetails = false;
        },

        _updateNFormat: function (data, rowIdx, colIdx) {
            var formatObj = { type: data.type }, xlObj = this.XLObj;            
            if (data.type != "general") {
                if (data.formatStr)
                    formatObj.formatStr = data.formatStr;
                if ("decimalPlaces" in data)
                    formatObj.decimalPlaces = data.decimalPlaces;
            }
            xlObj._dupDetails = true;
            xlObj.XLFormat.format(formatObj, xlObj._getAlphaRange(xlObj.getActiveSheetIndex(), rowIdx, colIdx, rowIdx, colIdx));
            xlObj._dupDetails = false;
        }
    };
})(jQuery, Syncfusion);