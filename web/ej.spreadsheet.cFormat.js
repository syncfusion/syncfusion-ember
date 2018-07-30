(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.cFormat = function (obj) {
        this.XLObj = obj;
    };

    ej.spreadsheetFeatures.cFormat.prototype = {

        //Conditional formatting   

        getCFRule: function (rowIdx, colIdx) {
            var xlObj = this.XLObj, sIndex=xlObj.getActiveSheetIndex();
            var ruleColl = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, ["cFormatRule"]);
            var rules = [], names = xlObj._dataContainer.cFormatData, splitStr;
            if (ruleColl) {
                for (var i = 0, len = ruleColl.length; i < len; i++) {
                    splitStr = names[ruleColl[i]].split("_");
                    rules.push({ "action": splitStr[0], "inputs": [splitStr[2], splitStr[3]], "color": splitStr[4], "bgColor": splitStr[5], "range": splitStr[6], "isApplied": JSON.parse(splitStr[8]) });
                }
            }
            return rules;
        },

        setCFRule: function (rule) {
            var xlObj = this.XLObj;
			if(xlObj.model.isReadOnly)
				return;
            if (!xlObj.model.allowConditionalFormats)
                return;
            var input1 = rule.inputs[0], input2 = rule.inputs[1];
            this._cFormat(rule.action, input1, input2, rule.color, rule.bgColor, rule.range, xlObj.getActiveSheetIndex());
        },

        _updateCFormatRule: function (rule, isApply) {
            rule = rule.indexOf("true") > -1 ? rule.replace("true", isApply) : rule.replace("false", isApply);
            return rule;
        },

        _getRuleIndex: function (rule, ruleCol) {
            if (ej.isNullOrUndefined(ruleCol))
                return -1;
            for (var i = 0, len = ruleCol.length; i < len; i++) {
                if (ruleCol[i] === rule)
                    return i;
            }
            return -1;
        },
        _refreshCFormatFormula: function (rowIdx, colIdx, sheetIdx) {
            var xlObj = this.XLObj, sheetData = xlObj.getSheet(sheetIdx)._cFormatFormula, cellDetail, action, range;
            if(!xlObj.isUndefined(sheetData[rowIdx]) && !xlObj.isUndefined(sheetData[rowIdx][colIdx]))
            {
                cellDetail = sheetData[rowIdx][colIdx][0].Formula;
                this._applyFormulaValues(cellDetail.referCell, cellDetail.cFColor, cellDetail.bgColor, "formularule", cellDetail.addr, sheetIdx, range, cellDetail.applyCell);
            }
        },

        _applyFormulaValues: function (input, cFColor, bgColor, action, addr, sheetIdx, range, cell,status, copyCell) {
            var xlObj = this.XLObj, selected, i,j, len, value,inputSplt, rangeIndex, formula, getSheet = xlObj.getSheet(sheetIdx), formulaCell, rowIdx, colIdx, operandCln, tRule, isApply, prevStatus = true, ruleIdx = -1, input2, splt = [], operand, calcEngine, referCell;
            if (ej.isNullOrUndefined(range) && ej.isNullOrUndefined(addr))
                selected = getSheet._selectedCells;
            else if (!ej.isNullOrUndefined(addr))
                selected = xlObj._getMultiRangeCells(addr);
            else
                selected = xlObj._getMultiRangeCells(range);
            addr = xlObj._getAlphaRange(sheetIdx, selected[0].rowIndex, selected[0].colIndex, selected[selected.length - 1].rowIndex, selected[selected.length - 1].colIndex);
            if (xlObj.isUndefined(action)) {
                calcEngine = xlObj._calcEngine;
                var cellArgs = new ValueChangedArgs(-1, -1, input);
                calcEngine.valueChanged(getSheet.sheetInfo.value, cellArgs);
                input = (calcEngine.getFormulaInfoTable().getItem("!" + (sheetIdx - 1) + "!-1").getFormulaValue() === "TRUE") ? true : false;
                if (xlObj._isBool(input))
                    isApply = input;
                else
                    isApply = false;
                tRule = "formularule" + "_" + action + "_" + input + "__" + cFColor + "_" + bgColor + "_" + addr + "_" + xlObj.getActiveSheetIndex();
                this._applyCFormatRule({ rowIndex: cell.rowIndex, colIndex: cell.colIndex }, tRule, ruleIdx, isApply, prevStatus, cFColor, bgColor);
            }
            else {
                operandCln = ["<=",">=","<",">","="];
                if (input.startsWith("="))
                    input = input.substr(1);
				if (input.indexOf("==") > -1) {
                    xlObj._showAlertDlg("Alert", "NewRuleAlert", "", 430);
                    return true;
                }
                for (i = 0, len = operandCln.length; i < len;i++) {
                    if (input.indexOf(operandCln[i]) > -1) {
                        splt = input.split(operandCln[i]);
                        operand = operandCln[i];
                    }
                }
              if(!splt.length)
                  splt[0] = input;
              inputSplt = splt.slice();
                if (status === "paste") {
                    var difRowIdx, difColIdx, cell, input = "";
                    for(i=0,len=splt.length;i<len;i++){  
                        if (xlObj._isvalidRange(splt[i] + ":" + splt[i])) {
                            cell = xlObj._getMultiRangeCells(splt[i]);
                            difRowIdx = range[0] - copyCell.rowIndex;
                            difColIdx = range[1] - copyCell.colIndex;
                            splt[i] = xlObj._getAlphaRange(sheetIdx, cell[0].rowIndex + difRowIdx, cell[0].colIndex + difColIdx, cell[0].rowIndex + difRowIdx, cell[0].colIndex + difColIdx);
                        }
                    }
                    input = (len === 2) ? splt[0] + operand + splt[1] : splt[0];
                }
                rangeIndex = this._formulaCellRefer(splt, selected);
                for (i = 0, len = selected.length; i < len; i++) {
                    rowIdx = selected[i].rowIndex;
                    colIdx = selected[i].colIndex;
                    referCell = this._formulaCellRange({ rowIndex: rowIdx, colIndex: colIdx }, rangeIndex, inputSplt, operand, sheetIdx);
                    formula = referCell.formula;
                    calcEngine = xlObj._calcEngine;
                    var cellArgs = new ValueChangedArgs(-1,-1 , formula);
                    calcEngine.valueChanged(getSheet.sheetInfo.value, cellArgs);
                    input2 = (calcEngine.getFormulaInfoTable().getItem("!" + (sheetIdx - 1) + "!-1").getFormulaValue() === "TRUE") ? true : false;
                    if (xlObj._isBool(input2))
                        isApply = input2;
                    else
                        isApply = false;
                    tRule = "formularule" + "_" + operand + "_" + input + "/" + formula + "__" + cFColor + "_" + bgColor + "_" + addr + "_" + xlObj.getActiveSheetIndex();
                    for (j = 0; j < xlObj.getObjectLength(referCell)-1;j++)
                        this._formulaCellUpdate({ rowIndex: referCell["referCell" + j].rowIndex, colIndex: referCell["referCell" + j].colIndex }, { rowIndex: rowIdx, colIndex: colIdx }, input, formula, addr, cFColor, bgColor, sheetIdx);
                    this._applyCFormatRule({ rowIndex: rowIdx, colIndex: colIdx }, tRule, ruleIdx, isApply, prevStatus, cFColor, bgColor);
                    if (!isApply && xlObj._isRowViewable(sheetIdx, rowIdx))
                        xlObj.getCell(rowIdx, colIdx, sheetIdx).removeClass("e-redft e-yellowft e-greenft e-redf e-redt");
                }
            }
        },

        _formulaCellUpdate: function (referCell, currCell, input, formula, addr, cFColor, bgColor, sheetIdx) {
            var xlObj = this.XLObj, sheetData = xlObj.getSheet(sheetIdx)._cFormatFormula, rowData, referRowIdx = referCell.rowIndex, referColIdx = referCell.colIndex;
            if (referRowIdx in sheetData) {
                rowData = sheetData[referRowIdx];
                if (referColIdx in rowData)
                    rowData[referColIdx].push({ "Formula": { "applyCell": currCell, "formula": input, "referCell": formula, "addr": addr, "cFColor": cFColor, "bgColor": bgColor } });
                else {
                    rowData[referColIdx] = [];
                    rowData[referColIdx].push({ "Formula": { "applyCell": currCell, "formula": input, "referCell": formula, "addr": addr, "cFColor": cFColor, "bgColor": bgColor } });
                }
            }
            else {
                rowData = sheetData[referRowIdx] = {};
                rowData[referColIdx] = [];
                rowData[referColIdx].push({ "Formula": { "applyCell": currCell, "formula": input, "referCell": formula, "addr": addr, "cFColor": cFColor, "bgColor": bgColor } });
            }
        },

        _formulaCellRange: function (selected, rangeIndex, inputFormula, operand,sheetIdx) {
            var i, len, formula, xlObj = this.XLObj, k = 0, j, aRange = [], index = 0, objLen = xlObj.getObjectLength(rangeIndex), spltFormula, referRowIdx, referColIdx, alphaRange = {}, range = {};
            for (i = 0; i < objLen; i++) {
                if (xlObj._isObject(rangeIndex["range" + i])) {
                    referRowIdx = selected.rowIndex + rangeIndex["range" + i].rowIndex;
                    referColIdx = selected.colIndex + rangeIndex["range" + i].colIndex;
                    alphaRange["range" + i] = xlObj._getAlphaRange(sheetIdx, referRowIdx, referColIdx, referRowIdx, referColIdx);
                }
                else {
                    referRowIdx = selected.rowIndex;
                    referColIdx = selected.colIndex;
                    alphaRange["range" + i] = rangeIndex["range" + i];
                }
                range["referCell" + i] = { rowIndex: referRowIdx, colIndex: referColIdx };
            }
            for (j = 0; j < inputFormula.length; j++) {
                spltFormula = xlObj.XLDragFill._parseFormula("=" + inputFormula[j]);
                for (i = 0, len = spltFormula.length; i < len; i++) {
                    if (xlObj._isvalidRange(spltFormula[i] + ":" + spltFormula[i])) {
                        spltFormula[i] = alphaRange["range" + k];
                        k++;
                    }

                }
                aRange[index] = spltFormula.join("");
                index++;
            }
            if(xlObj.isUndefined(operand))
                formula = "=" + aRange[0];
            else
                formula = "=" + aRange[0] + operand + aRange[1];
            range["formula"] =formula ;
            return range;
        },

        _formulaCellRefer: function (splt, selected) {
            var xlObj = this.XLObj, j, i, len, formulaCell, index = 0, spltFormula, aRange = [], alphRange, rangeSplit, difRowIndex, difColIndex, rangeIndex = {}, refer;
            for (j = 0; j < splt.length; j++) {
                if (xlObj.isFormula("=" + splt[j])) {
                    spltFormula = xlObj.XLDragFill._parseFormula(splt[j]);
                    for (i = 0, len = spltFormula.length; i < len; i++) {
                        if (xlObj._isvalidRange(spltFormula[i] + ":" + spltFormula[i])) {
                            aRange[index] = spltFormula[i];
                            index++;
                        }
                    }
                }
                else {
                    aRange[index] = splt[j];
                    index++;
                }
                }
            splt = aRange;
            for (i = 0; i < splt.length; i++) {
                alphRange = splt[i].startsWith("=") ? splt[i].split("=")[1] : splt[i];
                rangeSplit = alphRange.split("$").length;
                if (xlObj._isvalidRange(splt[i] + ":" + splt[i])) {
                    if (xlObj._isvalidRange(alphRange + ":" + alphRange)) {
                        if (alphRange.indexOf("$") < 0)
                            refer = "RCRefer";
                        else if (alphRange.startsWith("$") && rangeSplit === 3)
                            refer = "CellRefer"
                        else if (alphRange.startsWith("$") && rangeSplit === 2)
                            refer = "RRefer";
                        else if (!alphRange.startsWith("$") && alphRange.indexOf("$") > -1)
                            refer = "CRefer";
                    }
                    if (splt[i].indexOf("$") > -1)
                        splt[i] = splt[i].split("$").join("");
                    formulaCell = xlObj._getMultiRangeCells(splt[i]);
                    switch (refer) {
                        case "RCRefer":
                            difRowIndex = formulaCell[0].rowIndex - selected[0].rowIndex;
                            difColIndex = formulaCell[0].colIndex - selected[0].colIndex;
                            break;
                        case "RRefer":
                            difRowIndex = formulaCell[0].rowIndex - selected[0].rowIndex;
                            difColIndex = formulaCell[0].colIndex;
                            break;
                        case "CRefer":
                            difRowIndex = formulaCell[0].rowIndex;
                            difColIndex = formulaCell[0].colIndex - selected[0].colIndex;
                            break;
                        case "CellRefer":
                            difRowIndex = formulaCell[0].rowIndex;
                            difColIndex = formulaCell[0].colIndex;
                            break;

                    }
                    splt[i] = { rowIndex: difRowIndex, colIndex: difColIndex };
                }
                rangeIndex["range" + i] = splt[i];
            }
            return rangeIndex;
        },

        _clearCFormula: function (rowIdx, colIdx, sheetIdx) {
            var xlObj = this.XLObj, splt=[],aRange=[],index=0,spltFormula, i,len,sheetdata, cFormatRule = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "cFormatRule"),referCell, operandCln,
            sheetData = xlObj.getSheet(sheetIdx)._cFormatFormula;
            if (cFormatRule && cFormatRule[0].split("_")[0] === 'formularule') {
                input = cFormatRule[0].split("_")[2].split("/")[1];
                if (input.startsWith("="))
                    input = input.substr(1);
                if (xlObj.isFormula("=" + input)) {
                    operandCln = ["<=", ">=", "<", ">", "="];
                    for (i = 0, len = operandCln.length; i < len; i++) {
                        if (input.indexOf(operandCln[i]) > -1)
                            splt = input.split(operandCln[i]);
                    }
                    if (!splt.length)
                        splt[0] = input;
                    for (i = 0, len = splt.length; i < len ; i++) {
                        if (xlObj.isFormula("=" + splt[i])) {
                            spltFormula = xlObj.XLDragFill._parseFormula(splt[i]);
                            for (j = 0; j < spltFormula.length; j++) {
                                if (xlObj._isvalidRange(spltFormula[j] + ":" + spltFormula[j])) {
                                    aRange[index] = spltFormula[j];
                                    index++;
                                }
                            }
                        }
                        else {
                            aRange[index] = splt[i];
                            index++;
                        }
                    }
                            for (i = 0, len = aRange.length; i < len ; i++) {
                                referCell = xlObj._getMultiRangeCells(aRange[i])[0];
                            if (!xlObj.isUndefined(sheetData[referCell.rowIndex])) {
                            if (!xlObj.isUndefined(sheetData[referCell.rowIndex][referCell.colIndex]))
                                delete sheetData[referCell.rowIndex][referCell.colIndex];
                            if (!xlObj.getObjectLength(sheetData[referCell.rowIndex]))
                                delete sheetData[referCell.rowIndex];
                        }

                    }
                }
            }
        },

        _cFormat: function (action, input1, input2, cFColor, bgColor, addr, sheetIdx, range, status, copyCell) {
            var xlObj = this.XLObj, cell, isApplied;
            if (!xlObj.model.allowConditionalFormats)
                return;
            bgColor = xlObj.isUndefined(bgColor) ? "" : bgColor;
            cFColor = xlObj.isUndefined(cFColor) ? "" : cFColor;
            xlObj.showWaitingPopUp();
            sheetIdx = sheetIdx ? sheetIdx : xlObj.getActiveSheetIndex();
            if (ej.isNullOrUndefined(action))
                action = "lessthan";
            var sheet = xlObj.getSheet(sheetIdx), rangeData = (!range) ? xlObj._getRangeArgs(addr, "object") : xlObj._getRangeArgs(range, "object"), details = { cFAction: action, input1: input1, input2: input2, cFColor: cFColor, bgColor: bgColor, sheetIndex: sheetIdx, reqType: "cond-format", action: "add", range: addr, data: rangeData };
            switch (action) {
                case "greaterthan":
                    this._applyGLEValues(">", input1, cFColor, bgColor, action, addr, sheetIdx, range);
                    break;
                case "greaterequalto":
                    this._applyGLEValues(">=", input1, cFColor, bgColor, action, addr, sheetIdx, range);
                    break;
                case "lessthan":
                    this._applyGLEValues("<", input1, cFColor, bgColor, action, addr, sheetIdx, range);
                    break;
                case "lessequalto":
                    this._applyGLEValues("<=", input1, cFColor, bgColor, action, addr, sheetIdx, range);
                    break;
                case "equalto":
                    this._applyGLEValues("==", input1, cFColor, bgColor, action, addr, sheetIdx, range);
                    break;
                case "notequalto":
                    this._applyGLEValues("!=", input1, cFColor, bgColor, action, addr, sheetIdx, range);
                    break;
                case "between":
                    this._applyBetweenValues("=", input1, input2, cFColor, bgColor, action, addr, sheetIdx, range);
                    break;
                case "notbetween":
                    this._applyBetweenValues("!", input1, input2, cFColor, bgColor, action, addr, sheetIdx, range);
                    break;
                case "textcontains":
                    this._applyContainsValues(input1, cFColor, bgColor, action, addr, sheetIdx, range);
                    break;
                case "dateoccur":
                    this._applyDateContainsValues(input1, cFColor, bgColor, action, addr, sheetIdx, range);
                    break;
                case "formularule":
                    if (input1.indexOf("/") > -1)
                        input1 = input1.split("/")[1];
                    isApplied = this._applyFormulaValues(input1, cFColor, bgColor, action, addr, sheetIdx, range, cell, status, copyCell);
                    break;
            }
            if ((!sheet._isImported || sheet._isLoaded) && !xlObj._isUndoRedo && status !== "paste" && !xlObj._dupDetails && !xlObj._isExport && !isApplied){
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
            xlObj.hideWaitingPopUp();
        },

        clearCF: function (range) {
            var xlObj = this.XLObj;
            if (xlObj.model.isReadOnly)
                return;
            var sheetIdx = xlObj.getActiveSheetIndex(), rowIdx, colIdx, details = { sheetIndex: sheetIdx, reqType: "cond-format", action: "clear", rule: [] }, sheet = xlObj.getSheet(sheetIdx);
            if (!xlObj.model.allowConditionalFormats)
                return;
            var i, len, cFormatData = xlObj._dataContainer.cFormatData, selected;
            details.selection = !xlObj.isUndefined(range);
            range = range ? xlObj._getRangeArgs(range, "object") : [0, 0, sheet.rowCount - 1, sheet.colCount - 1];
            selected = xlObj._getSelectedCells(sheetIdx, range).selCells;
            for (i = 0, len = selected.length; i < len; i++) {
				rowIdx = selected[i].rowIndex, colIdx = selected[i].colIndex;
                if (!ej.isNullOrUndefined(xlObj._dataContainer.sheets[sheetIdx][rowIdx]))
                    if (!ej.isNullOrUndefined(xlObj._dataContainer.sheets[sheetIdx][rowIdx][colIdx]))
                        if (!ej.isNullOrUndefined(xlObj._dataContainer.sheets[sheetIdx][rowIdx][colIdx].cFormatRule)) {
                            details.rule.push(this.getCFRule(rowIdx, colIdx));
                            this._clearCFormula(rowIdx, colIdx, sheetIdx);
                            xlObj.clearRangeData([rowIdx, colIdx, rowIdx, colIdx], ["cFormatRule"]);
                        }
            }
            var rule = details.selection ? "clear_" + sheetIdx + "_" + xlObj._getSelectedItems()[1] : "clear_" + sheetIdx + "_" + "entire";
            if (cFormatData.indexOf(rule) === -1)
                cFormatData.push(rule);
            if (!xlObj._isUndoRedo && !xlObj._dupDetails) {
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
        },

        _getValueForCFormat: function (cell, sheetIdx) {
            var xlObj = this.XLObj, rowIdx = cell.rowIndex, colIdx = cell.colIndex, cellObj = xlObj.getRangeData({ range: [rowIdx, colIdx, rowIdx, colIdx], sheetIdx: sheetIdx });
            var value = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx), value2 = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "value2");
            value = !ej.isNullOrUndefined(value) ? value.toString() : "";
            if (value2 && (typeof value2 == "string" && !cellObj.formatStr && value[0] === "=") || (xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "type") === "datetime") || (xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "type") === "shortdate") || (xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "type") === "longdate") || (xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "type") === "time"))
                value = value2;
            return value;
        },

        _applyGLEValues: function (op, input, cFColor, bgColor, action, addr, sheetIdx, range) {
            var len, xlObj = this.XLObj, value, selected, rowIdx, colIdx, temp, isApply, prevStatus, tRule, ruleIdx, type, numRegx = new RegExp(/[^.0-9]+/g), txtRegx = new RegExp(/[^.-a-zA-Z 0-9]+/g);
            var sheet = xlObj.getSheet(sheetIdx), startCell = sheet._startCell, endCell = sheet._endCell, j, inputValue = input;
            var referCell, rangeIndex, inputSplit = [], rangeData = (!range) ? xlObj._getRangeArgs(addr, "object") : xlObj._getRangeArgs(range, "object");
            selected = xlObj._getSelectedCells(sheetIdx, rangeData).selCells;
            if (inputValue.startsWith("=")) {
                var operand, operandCln;
                inputValue = inputValue.substr(1);
                operandCln = ["<=", ">=", "<", ">", "="];
                for (i = 0, len = operandCln.length; i < len; i++) {
                    if (inputValue.indexOf(operandCln[i]) > -1) {
                        inputSplit = inputSplit.split(operandCln[i]);
                        operand = operandCln[i];
                    }
                }
                if (!inputSplit.length)
                    inputSplit[0] = inputValue;
                rangeIndex = this._formulaCellRefer(inputSplit, selected);
            }
            for (var i = 0, len = selected.length; i < len; i++) {
                rowIdx = selected[i].rowIndex; colIdx = selected[i].colIndex;
                input = input.replace(/^"|"$/g, "");
                if (input.startsWith("=")) {
                    var calcEngine = xlObj._calcEngine;
                    referCell = this._formulaCellRange({ rowIndex: rowIdx, colIndex: colIdx }, rangeIndex, inputSplit, operand, sheetIdx);
                    var cellArgs = new ValueChangedArgs(-1, -1, referCell.formula);
                    calcEngine.valueChanged(xlObj.getSheet(sheetIdx).sheetInfo.value, cellArgs);
                    input = calcEngine.getFormulaInfoTable().getItem("!0!-1").getFormulaValue();
                    if (xlObj._isBool(input))
                        isApply = (input === "TRUE") ? true : false;
                    else
                        isApply = false;
                    if (ej.isNullOrUndefined(input))
                        input = "0";
                }
                if (xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "isMHide") || xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "isFilterHide"))
                    continue;
                value = this._getValueForCFormat({rowIndex: rowIdx, colIndex: colIdx}, sheetIdx);
                type = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "type") ? xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "type") : "general";
                prevStatus = true;
                ruleIdx = -1;
                if (ej.isNullOrUndefined(value) || (!value.length && action != "equalto") || input == "0") {
                    if ($.isNumeric(input)){
                        if ( input > 0 )
                            isApply = (action === "lessthan" || action === "lessequalto" || action === "notequalto");
                        else if ( input < 0)
                            isApply = (action === "greaterthan" || action === "greaterequalto" || action === "notequalto");
                        else 
                            isApply = (action === "equalto" || action === "lessequalto" || action === "greaterequalto");
                    }
                }
                else if ($.isNumeric(input)) {
                    if ($.isNumeric(value)) {
                        value = parseFloat(value);
                        isApply = xlObj.operators[op](value, parseFloat(input.replace(txtRegx, "")));
                    }
                    else if (xlObj._isValidDate(value)) {
                        isApply = xlObj.operators[op](xlObj._dateToInt(value), parseFloat(input));
                    }
                    else if (xlObj._isValidTime(value))
                        continue;
                    else
                        isApply = xlObj.operators[op](value.toLowerCase(), input.toLowerCase());
                }
                else if (input.lastIndexOf("%") === input.length - 1 && $.isNumeric(input.replace(numRegx, ""))) {
                    if (type === "percentage")
                        isApply = xlObj.operators[op](parseFloat(value), parseFloat(input.replace(numRegx, "")));
                    else
                        isApply = $.isNumeric(value) ? xlObj.operators[op](parseFloat(value), 0) : xlObj.operators[op](value.length, 0);
                }
                else if (input.indexOf("$") === 0 && $.isNumeric(input.replace(numRegx, ""))) {
                    if (type === "accounting" || type !== "currency" || $.isNumeric(value))
                        isApply = xlObj.operators[op](parseFloat(value), parseFloat(input.replace(numRegx, "")));
                    else
                        isApply = ((xlObj.operators[op](value.length, 0) || xlObj._isValidDate(value)) && !xlObj._isValidTime(value));
                }
                else if (xlObj._isValidDate(input)) {
                    if (xlObj._isValidDate(value)) {
                        isApply = xlObj.operators[op](xlObj._dateToInt(new Date(value)), xlObj._dateToInt(new Date(input)));
                    }
                    else if (!xlObj._isValidTime(value)) {
                        if ($.isNumeric(value))
                            isApply = xlObj.operators[op](parseFloat(value), xlObj._dateToInt(input));
                        else
                            isApply = xlObj.operators[op](value.length, xlObj._dateToInt(input));
                    }
                }
                else if (xlObj._isValidTime(input)) {
                    if (xlObj._isValidTime(value))
                        isApply = xlObj.operators[op](xlObj.parse.parseTime(value), xlObj.parse.parseTime(input));
                    else
                        isApply = $.isNumeric(value) ? xlObj.operators[op](parseFloat(value), 0) : xlObj.operators[op](value.length, 0);
                }
                else
                    isApply = xlObj.operators[op](value.toLowerCase(), input.toLowerCase());
                if (ej.isNullOrUndefined(addr))
                    addr = xlObj._generateHeaderText(startCell.colIndex + 1) + (startCell.rowIndex + 1) + ":" + xlObj._generateHeaderText(endCell.colIndex + 1) + (endCell.rowIndex + 1);
                tRule = action + "_" + op + "_" + input + "__" + cFColor + "_" + bgColor + "_" + addr + "_" + xlObj.getActiveSheetIndex();
                if (inputValue.startsWith("=")) {
                    input = inputValue.substr(1);
                    tRule = action + "_" + op + "_" + input + "__" + cFColor + "_" + bgColor + "_" + addr + "_" + xlObj.getActiveSheetIndex();
                    for (j = 0; j < xlObj.getObjectLength(referCell) - 1 ; j++)
                        this._formulaCellUpdate({ rowIndex: referCell["referCell" + j].rowIndex, colIndex: referCell["referCell" + j].colIndex }, { rowIndex: rowIdx, colIndex: colIdx }, input, referCell.formula, addr, cFColor, sheetIdx);
                }
                this._applyCFormatRule({ rowIndex: rowIdx, colIndex: colIdx }, tRule, ruleIdx, isApply, prevStatus, cFColor, bgColor);
            }
        },

        _applyBetweenValues: function (op, input1, input2, cFColor, bgColor, action, addr, sheetIdx, range) {
            var rowIdx, colIdx, xlObj = this.XLObj, value, $trgt, selected, temp, isApply, prevStatus, tRule, ruleIdx, type, numRegx = new RegExp(/[^.0-9]+/g), txtRegx = new RegExp(/[^.-a-zA-Z 0-9]+/g), convDate;
            var sheet = xlObj.getSheet(sheetIdx), startCell = sheet._startCell, endCell = sheet._endCell;
            if (!xlObj.operators["<"](xlObj.isNumber(input1) ? parseFloat(input1) : input1, xlObj.isNumber(input2) ? parseFloat(input2) : input2)) {
                temp = input2;
                input2 = input1;
                input1 = temp;
            }
            selected = (ej.isNullOrUndefined(range) && ej.isNullOrUndefined(addr)) ? xlObj.getSheet(sheetIdx)._selectedCells : xlObj._getSelectedCells(sheetIdx, addr).selCells;          
            for (var i = 0, len = selected.length; i < len; i++) {
                rowIdx = selected[i].rowIndex; colIdx = selected[i].colIndex;
                if (xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "isMHide") || xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "isFilterHide"))
                    continue;
                value = this._getValueForCFormat({rowIndex: rowIdx, colIndex: colIdx}, sheetIdx);
                type = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "type") ? xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "type") : "general";
                prevStatus = true;
                ruleIdx = -1;
                if (ej.isNullOrUndefined(value) || !value.length){
                    if ($.isNumeric(input1) && $.isNumeric(input2)){
                        if ( (input1 > 0 && input2 > 0) || ( input1 < 0 && input2 < 0) )
                            isApply = (action === "notbetween");
                        else
                            isApply = (action === "between");
                    }
                }
                else if ($.isNumeric(input1.replace(txtRegx, "")) && $.isNumeric(input2.replace(txtRegx, "")) && type !== "percentage" && type !== "currency" && type !== "accounting") {
                    input1 = input1.replace(txtRegx, "");
                    input2 = input2.replace(txtRegx, "");
                    if ($.isNumeric(value))
                        isApply = xlObj.operators[op](parseFloat(value) >= parseFloat(input1) && parseFloat(value) <= parseFloat(input2));
                    else if (xlObj._isValidDate(value)) {
                        isApply = xlObj.operators[op](xlObj._dateToInt(value) >= parseFloat(input1) && convDate <= parseFloat(input2));
                    }
                    else if (xlObj._isValidTime(value))
                        continue;
                    else
                        isApply = xlObj.operators[op](value.toLowerCase() >= input1.toLowerCase() && value.toLowerCase() <= input2.toLowerCase());
                }
                else if (input1.lastIndexOf("%") === input1.length - 1 && $.isNumeric(input1.replace(numRegx, "")) && input2.lastIndexOf("%") === input2.length - 1 && $.isNumeric(input2.replace(numRegx, "")) && type === "percentage")
                    isApply = xlObj.operators[op](parseFloat(value) >= parseFloat(input1.replace(numRegx, "")) && parseFloat(value) <= parseFloat(input2.replace(numRegx, "")));
                else if (input1.indexOf("$") === 0 && $.isNumeric(input1.replace(numRegx, "")) && input2.indexOf("$") === 0 && $.isNumeric(input2.replace(numRegx, "")) && (type === "accounting" || type !== "currency"))
                    isApply = xlObj.operators[op](parseFloat(value) >= parseFloat(input1.replace(numRegx, "")) && parseFloat(value) <= parseFloat(input2.replace(numRegx, "")));
                else if (xlObj._isValidDate(input1) && xlObj._isValidDate(input2)) {
                    var date1 = xlObj._dateToInt(new Date(value)), date2 = xlObj._dateToInt(new Date(input1)), date3 = xlObj._dateToInt(new Date(input2));
                    isApply = xlObj.operators[op](date1 >= date2 && date1 <= date3);
                }
                else if (xlObj._isValidTime(input1) && xlObj._isValidTime(input2) && xlObj._isValidTime(value))
                    isApply = xlObj.operators[op](xlObj.parse.parseTime(value) >= xlObj.parse.parseTime(input1) && xlObj.parse.parseTime(value) <= xlObj.parse.parseTime(input2));
                else if ($.isNumeric(value))
                    isApply = xlObj.operators[op](parseFloat(value) >= parseFloat(input1) && parseFloat(value) <= parseFloat(input2));
                else
                    isApply = xlObj.operators[op](value.toLowerCase() >= input1.toLowerCase() && value.toLowerCase() <= input2.toLowerCase());
                if (ej.isNullOrUndefined(addr))
                    addr = xlObj._generateHeaderText(startCell.colIndex + 1) + (startCell.rowIndex + 1) + ":" + xlObj._generateHeaderText(endCell.colIndex + 1) + (endCell.rowIndex + 1);
                tRule = action + "_" + op + "_" + input1 + "_" + input2 + "_" + cFColor + "_" + bgColor + "_" + addr + "_" + xlObj.getActiveSheetIndex();
                this._applyCFormatRule({ rowIndex: rowIdx, colIndex: colIdx }, tRule, ruleIdx, isApply, prevStatus, cFColor, bgColor);
            }
        },

        _applyContainsValues: function (input, cFColor, bgColor, action, addr, sheetIdx, range) {
            var rowIdx, colIdx, type, xlObj = this.XLObj, value, $trgt, selected, temp, isApply, prevStatus, tRule, ruleIdx, txtRegx = new RegExp(/[^.-a-zA-Z 0-9]+/g);
            var sheet = xlObj.getSheet(sheetIdx), startCell = sheet._startCell, endCell = sheet._endCell;
            selected = (ej.isNullOrUndefined(range) && ej.isNullOrUndefined(addr)) ? xlObj.getSheet(sheetIdx)._selectedCells : xlObj._getSelectedCells(sheetIdx, addr).selCells;
            for (var i = 0, len = selected.length; i < len; i++) {
                rowIdx = selected[i].rowIndex; colIdx = selected[i].colIndex;
                if (xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "isMHide") || xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "isFilterHide"))
                    continue;
                value = this._getValueForCFormat({ rowIndex: rowIdx, colIndex: colIdx }, sheetIdx);
                type = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "type") ? xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "type") : "general";
                prevStatus = true;
                ruleIdx = -1;
                if (ej.isNullOrUndefined(value) || !value.length)
                    isApply = false;
                else if ($.isNumeric(input.replace(txtRegx, ""))) {
                    input = input.replace(txtRegx, "");
                    if (xlObj._isValidDate(value))
                        value = ((xlObj._dateToInt(value))).toString();
                    isApply = value.indexOf(input) > -1;
                }
                else if (xlObj._isValidDate(input)) {
                    if (xlObj._isValidDate(value))
                        value = xlObj._dateToInt(value).toString();
                    isApply = value.indexOf(xlObj._dateToInt(input)) > -1;
                }
                else if (xlObj._isValidTime(input)) {
                    if (xlObj._isValidTime(value))
                        value = xlObj._dateToInt("01/01/1990 " + value).toString();
                    isApply = value.indexOf(xlObj._dateToInt("01/01/1990 " + input)) > -1;
                }
                else
                    isApply = value.toLowerCase().indexOf(input.toLowerCase()) > -1;
                if (ej.isNullOrUndefined(addr))
                    addr = xlObj._generateHeaderText(startCell.colIndex + 1) + (startCell.rowIndex + 1) + ":" + xlObj._generateHeaderText(endCell.colIndex + 1) + (endCell.rowIndex + 1);
                tRule = action + "__" + input + "__" + cFColor + "_" + bgColor + "_" + addr + "_" + xlObj.getActiveSheetIndex();
                this._applyCFormatRule({rowIndex: rowIdx, colIndex: colIdx}, tRule, ruleIdx, isApply, prevStatus, cFColor, bgColor);
            }
        },

        _applyDateContainsValues: function (input, cFColor, bgColor, action, addr, sheetIdx, range) {
            var rowIdx, colIdx, xlObj = this.XLObj, value, $trgt, isApply = false, tRule, ruleIdx;
            var sheet = xlObj.getSheet(sheetIdx), startCell = sheet._startCell, endCell = sheet._endCell, selected;
            selected = (ej.isNullOrUndefined(range) && ej.isNullOrUndefined(addr)) ? xlObj.getSheet(sheetIdx)._selectedCells : xlObj._getSelectedCells(sheetIdx, addr).selCells;
            for (var i = 0, len = selected.length; i < len; i++) {
                rowIdx = selected[i].rowIndex; colIdx = selected[i].colIndex;
                if (xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "isMHide") || xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "isFilterHide"))
                    continue;
                value = this._getValueForCFormat({ rowIndex: rowIdx, colIndex: colIdx }, sheetIdx);
                ruleIdx = -1;
                if (ej.isNullOrUndefined(value) || !value.length)
                    isApply = false;
                else if (xlObj._isValidDate(input)) {
                    var date1 = new Date(value), date2 = new Date(input);
                    isApply = (date1 - date2) === 0;
                }
                if (ej.isNullOrUndefined(addr))
                    addr = xlObj._generateHeaderText(startCell.colIndex + 1) + (startCell.rowIndex + 1) + ":" + xlObj._generateHeaderText(endCell.colIndex + 1) + (endCell.rowIndex + 1);
                tRule = action + "__" + input + "__" + cFColor + "_" + bgColor + "_" + addr + "_" + xlObj.getActiveSheetIndex();
                this._applyCFormatRule({ rowIndex: rowIdx, colIndex: colIdx }, tRule, ruleIdx, isApply, true, cFColor, bgColor);
            }
        },

        refreshCFormat: function (range) {
            var xlObj = this.XLObj, dupDetails = xlObj._dupDetails;
			if(xlObj.model.isReadOnly)
				return;
			xlObj._dupDetails = true;
            if (!xlObj.model.allowConditionalFormats)
                return;
            var i, j, rules = [], sheetIdx = xlObj.getActiveSheetIndex(), cFormatStr, selected, cFormatRule, len, rLen, rowIdx, colIdx;
            selected = xlObj._getSelectedCells(sheetIdx, range).selCells;
            for (i = 0, len = selected.length; i < len; i++) { //getting rules & clear rules
                rowIdx = selected[i].rowIndex; colIdx = selected[i].colIndex;
                cFormatRule = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "cFormatRule");
                if (!xlObj.isUndefined(cFormatRule) && cFormatRule.length)
                    for (j = 0, rLen = cFormatRule.length; j < rLen; j++) {
                        cFormatRule[j] = cFormatRule[j].replace("_true", "").replace("_false", "");
                        if (rules.indexOf(cFormatRule[j]) < 0)
                            rules.push(cFormatRule[j]);
                    }
                if(xlObj._isRowViewable(sheetIdx, rowIdx))
                    xlObj.getCell(rowIdx, colIdx, sheetIdx).removeClass("e-redft e-yellowft e-greenft e-redf e-redt");
                xlObj.clearRangeData([rowIdx, colIdx, rowIdx, colIdx], ["cFormatRule"], selected[i]);
            }
            //apply rules
            for (j = 0, rLen = rules.length; j < rLen; j++) {
                cFormatStr = rules[j].split("_");
                this._cFormat(cFormatStr[0], cFormatStr[2], cFormatStr[3], cFormatStr[4], cFormatStr[5], cFormatStr[6]);
            }
            xlObj._dupDetails = dupDetails;
        },
        _applyColors: function (cFColor, cfColors, actCell, bgColor) {
            if (cFColor.length && cfColors.indexOf(cFColor) > -1)
                actCell && actCell.removeClass(cfColors).addClass("e-" + cFColor);
            else {
                if (cFColor.length && cfColors.indexOf(cFColor) < 0)
                    actCell && actCell.removeClass(cfColors).css({ "color": cFColor }).addClass("e-cformat");
                if (bgColor.length && cfColors.indexOf(bgColor) < 0) {
                    if (actCell) {
                        actCell.removeClass(cfColors).css({ "background-color": bgColor });
                        !actCell.hasClass("e-cformat") && actCell.addClass("e-cformat")
                    }
                }
            }
        },
        _applyCFormatRule: function (cell, tRule, ruleIdx, isApply, prevStatus, cFColor, bgColor) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), rowIdx = cell.rowIndex, colIdx = cell.colIndex, isViewed, actCell, cFormatRule = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "cFormatRule"), rule, idx, isUpdate = true, cfColors = "e-redft e-yellowft e-greenft e-redf e-redt";
            if (this._getRuleIndex(tRule + "_true", cFormatRule) > -1)
                ruleIdx = this._getRuleIndex(tRule + "_true", cFormatRule); //check already rule exists
            if (this._getRuleIndex(tRule + "_false", cFormatRule) > -1)
                ruleIdx = this._getRuleIndex(tRule + "_false", cFormatRule);
            if (ruleIdx > -1) { //change rule index in cellobj and container for rule true, false changes
                rule = cFormatRule[ruleIdx];
                idx = xlObj._dataContainer.cFormatData.indexOf(this._updateCFormatRule(rule, isApply));
                if (idx > -1)
                    xlObj._dataContainer.sheets[sheetIdx][rowIdx][colIdx].cFormatRule[ruleIdx] = idx;
                else {
                    xlObj._dataContainer.cFormatData.push(this._updateCFormatRule(rule, isApply));
                    xlObj._dataContainer.sheets[sheetIdx][rowIdx][colIdx].cFormatRule[ruleIdx] = xlObj._dataContainer.cFormatData.length - 1;
                }
            }
            cFormatRule = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "cFormatRule");
            if (xlObj._isRowViewable(sheetIdx, rowIdx)) {
                isViewed = true;
                actCell = xlObj.getCell(rowIdx, colIdx);
            }
            if (!xlObj.isUndefined(cFormatRule) && (cFormatRule.length > 0 && (!(tRule + "_true" === cFormatRule[ruleIdx] || tRule + "_false" === cFormatRule[ruleIdx]) || (cFormatRule.length > 1)))) { //check and change prev applied status for multirule
                for (var j = 0, len = cFormatRule.length; j < len; j++) {
                    rule = cFormatRule[j].split("_");
                    //if (rule[7] === "true" && rule[4] === cFColor)
                    //    prevStatus = false;
                }
                if (isViewed)
                    if (isApply) {
                        this._applyColors(cFColor, cfColors, actCell, bgColor);
                    }
            }
            else {
                if (isViewed)
                    if (isApply)
                        this._applyColors(cFColor, cfColors, actCell, bgColor);
            }
            //for editing 
            if (cFormatRule && cFormatRule.length) {
                var range1 = xlObj.getRangeIndices(tRule.split("_")[6]), range2 = xlObj.getRangeIndices(cFormatRule[0].split("_")[6]), ruleArray = tRule.split("_");
                ruleArray.splice(6, 1);//remove sheet index
                ruleArray.splice(5, 1);//remove address
                if (cFormatRule[0].indexOf(ruleArray.join("_")) > -1 && xlObj.inRange(range2, range1[0], range1[1]))
                    isUpdate = false;
            }
            if (isUpdate && (this._getRuleIndex(tRule + "_true", cFormatRule) < 0 && this._getRuleIndex(tRule + "_false", cFormatRule) < 0))  //apply rule for first time while applying        
                xlObj.XLEdit._updateDataContainer(cell, { dataObj: { "cFormatRule": [tRule + "_" + isApply] }, skipCell: !isApply });
        }
    };
})(jQuery, Syncfusion);