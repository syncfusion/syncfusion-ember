(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.validation = function (obj) {
        this.XLObj = obj;
        this._ruleSymbols = { "Greater": ">", "GreaterOrEqual": ">=", "Less": "<", "LessOrEqual": "<=", "Equal": "==", "NotEqual": "!=", "Between": ">=&&<=&&=", "NotBetween": ">=&&<=&&!" };
        this._isErrorVisible = false;
    };

    ej.spreadsheetFeatures.validation.prototype = {
        //Validation
        _setValidation: function () {
            if (!this.XLObj.model.allowDataValidation || !$.validator)
                return;
            this._initValidator();
            this._setValidationToField();
        },

        _initValidator: function () {
            var elem = $("#" + this.XLObj._id + "EditForm");
            if (ej.isOnWebForms)
                $.data(elem[0], "validator", null);
            elem.validate({
                errorClass: "e-field-validation-error",
                errorElement: "div",
                wrapper: "div",
                errorPlacement: function (error, ele) {
                    var xlObj = $("#" + $(ele).data("id")).data("ejSpreadsheet"), $content = xlObj._getJSSheetContent(xlObj.getActiveSheetIndex()).find(".e-spreadsheetcontentcontainer > .e-content");
                    var $td = xlObj.XLEdit._editCell, $container = $(error).addClass("e-error");                   
                    $content.append($container);
                    $container.prepend(ej.buildTag("div.e-errortail e-toparrow"));
                    $container.css({ left: $td[0].offsetLeft, top: $td[0].offsetTop + $td[0].offsetHeight });
                    xlObj.XLValidate._isErrorVisible = true;
                }
            });
        },

        _setValidationToField: function () {
            var xlObj = this.XLObj, rules = xlObj.XLEdit.getPropertyValueByElem(xlObj.getActiveCellElem(), "rule");
            delete rules.type;
            delete rules.isApply;
			delete rules.isHighlight;
            xlObj.element.find("#" + xlObj._id + "_ValElem").rules("add", rules);
            var validator = xlObj.element.find("#" + xlObj._id + "EditForm").validate();
            if (!ej.isNullOrUndefined(rules.required)) {
                validator.settings.messages[name] = {};
                validator.settings.messages[name].required = xlObj.XLEdit._EditCellDetails.fieldName + (xlObj.XLEdit._EditCellDetails.rowIndex + 1) + " is required";
            }
            xlObj.XLEdit._isValidation = true;
        },

        applyDVRules: function (range, values, type, required, showErrorAlert) {
            var details, $trgt, dlgHt, len, evtArgs, rule = {}, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), isHLight = false, rng, selected, detailVal;
            switch (type) {
                case "decimal":
                    if (parseFloat(values[1]) > parseFloat(values[2])) {
                        xlObj._showAlertDlg("Alert", "NumberValidationAlert", "", 400);
                        return;
                    }
                    break;
                case "date":
                    if(new Date(values[1]) > new Date(values[2])) {
                        xlObj._showAlertDlg("Alert", "DateValidationAlert", "", 400);
                        return;
                    }
                    break;
                case "time":
                    var time1 = Date.parse("01/01/1990 " + values[1]), time2 = Date.parse("01/01/1990 " + values[2]);
                    if (values[2] && values[2].length && time1 > time2) {
                        xlObj._showAlertDlg("Alert", "TimeValidationAlert", "", 400);
                        return;
                    }
                    break;
                default:
                    if (parseInt(values[1]) > parseInt(values[2])) {
                        xlObj._showAlertDlg("Alert", "NumberValidationAlert", "", 400);
                        return;
                    }
                    break;
            }
			if (xlObj.model.isReadOnly || !xlObj.model.allowDataValidation || (!xlObj.model.allowSelection && ej.isNullOrUndefined(range)))
			    return;
			rng = xlObj._getRangeArgs(range, "object");
			selected = xlObj._getSelectedCells(sheetIdx, rng).selCells;
			xlObj._showDialog(xlObj._id + "_Ribbon_Data_DataTools_DataValidation");
            rule.required = !required;
			if ((values[0] != "Between" || values[0] != "NotBetween") && values.length < 3)                 
                values.push("");                            
            switch (type) {
                case "number":
                    values.push("parseInt");
                    rule.digits = true;
                    values.push("number");
                    break;
                case "decimal":
                    values.push("parseFloat");
                    rule.number = true;
                    values.push("decimal");
                    break;
                case "date":
                    values.push("parseDate");
                    rule.date = true;
                    values.push("date");
                    break;
                case "time":
                    values.push("parseTime");
                    values.push("time");
                    break;
                case "text":
                    values[1] = "^" + values[1];
                    values[2] = "^" + values[2];
                    values.push("length");
                    values.push("text");
                    break;
                case "list":
                    var dataSrc = values[1];
                    values = [];
                    values.push(dataSrc);
                    values.push("list");
                    break;
            }
            values.push(showErrorAlert);
            values.push(range ? range : xlObj._getSelectedItems(sheetIdx, range)[1]);
            values.push(sheetIdx);
            rule.customVal = values.join("_");
            rule.isApply = false;
            rule.type = type;
            var selCells = [], cell = {}, cellObj;
            for (var i = 0, len = selected.length; i < len; i++) {
                cell = { rowIndex: selected[i].rowIndex, colIndex: selected[i].colIndex, prevRule: xlObj.XLEdit.getPropertyValue(selected[i].rowIndex, selected[i].colIndex, "rule") };
                if(xlObj._isRowViewable(sheetIdx, selected[i].rowIndex)) {
                    $trgt = xlObj.getCell(selected[i].rowIndex, selected[i].colIndex);
                    $trgt.hasClass("e-hlcell") && (isHLight = true);
                    $trgt.removeData("rule");
                    $trgt.removeClass("e-hlcell");
                }         
                xlObj.XLEdit._updateDataContainer({ rowIndex: selected[i].rowIndex, colIndex: selected[i].colIndex }, { dataObj: { "rule": rule } });
                if (xlObj.model.actionComplete !== null)
                    cell["newRule"] = xlObj.XLEdit.getPropertyValue(selected[i].rowIndex, selected[i].colIndex, "rule");
                selCells.push(cell);
            }
            if (isHLight === true)
                this.highlightInvalidData();
            if ((!sheet._isImported || sheet._isLoaded) && !xlObj._isUndoRedo && !xlObj._isExport) {
                detailVal = (values[2] == "") ? ([values[0], values[1]]) : ([values[0], values[1], values[2]])
                details = { showErrorAlert: values[5], values: detailVal, required: !rule.required, rule: rule, sheetIndex: sheetIdx, reqType: "validation", operation: "apply-validation", selectedCell: selCells, range: xlObj._getAlphaRange(sheetIdx, selected[0].rowIndex, selected[0].colIndex, selected[selected.length - 1].rowIndex, selected[selected.length - 1].colIndex) };
                evtArgs = { showErrorAlert: details.showErrorAlert, values: details.values, isRequired: details.required, rule: details.rule, sheetIndex: details.sheetIndex, reqType: details.reqType, operation: details.operation, selectedCell: details.selectedCell, range: details.range };
                xlObj._completeAction(details);
                xlObj._trigActionComplete(evtArgs);
            }
        },

        clearDV: function (range) {
            var xlObj = this.XLObj, selected;
            if(!xlObj.model.allowDataValidation || xlObj.model.isReadOnly || !xlObj.model.allowSelection)
				return;
            var $trgt, selectedCells, rng, sheetIdx = xlObj.getActiveSheetIndex(), details = { sheetIndex: sheetIdx, reqType: "validation", operation: "clear-validation", selectedCell: [] };
            rng = xlObj._getRangeArgs(range, "object");
            selectedCells = xlObj._getSelectedCells(sheetIdx, rng).selCells;
            for (var i = 0, len = selectedCells.length; i < len; i++) {
                details.selectedCell.push({ rowIndex: selectedCells[i].rowIndex, colIndex: selectedCells[i].colIndex, rules: xlObj.XLEdit.getPropertyValue(selectedCells[i].rowIndex , selectedCells[i].colIndex, "rule") });
                xlObj.clearRangeData([selectedCells[i].rowIndex, selectedCells[i].colIndex, selectedCells[i].rowIndex, selectedCells[i].colIndex], ["rule"]);
                if (xlObj._isRowViewable(sheetIdx, selectedCells[i].rowIndex)) {
                    $trgt = xlObj.getCell(selectedCells[i].rowIndex, selectedCells[i].colIndex);
					if (!ej.isNullOrUndefined(xlObj._ddlCell)) {
                        xlObj.element.find("#" + xlObj._id + "ddl").ejDropDownList("hidePopup");
                        xlObj.element.find("#" + xlObj._id + "ddlspan").remove();
                        xlObj._ddlCell = null;
                    }
					details.hlStatus = $trgt.hasClass("e-hlcell");
                    $trgt.removeClass("e-hlcell");
                }
            }
			details.range = xlObj._getAlphaRange(sheetIdx, selectedCells[0].rowIndex, selectedCells[0].colIndex, selectedCells[selectedCells.length - 1].rowIndex, selectedCells[selectedCells.length - 1].colIndex);
			if (!xlObj._isUndoRedo && !xlObj._dupDetails)
			{
			    xlObj._completeAction(details);
			    xlObj._trigActionComplete(details);
			}
        },

        clearHighlightedValData: function (range) {
            var xlObj = this.XLObj;
            if (!xlObj.model.allowDataValidation || xlObj.model.isReadOnly)
                return;
            var selected, rng, trgt, sheetIdx = xlObj.getActiveSheetIndex();
            rng = xlObj._getRangeArgs(range, "object");
            selected = xlObj._getSelectedCells(sheetIdx, rng).selCells;
            for (var i = 0, len = selected.length; i < len; i++) {
                if (xlObj._isRowViewable(sheetIdx, selected[i].rowIndex)) {
                    trgt = xlObj.getCell(selected[i].rowIndex, selected[i].colIndex);
                    trgt.removeClass("e-hlcell");
                }
               if (!ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(selected[i].rowIndex, selected[i].colIndex, "rule")))
                    xlObj._dataContainer.sheets[sheetIdx][selected[i].rowIndex][selected[i].colIndex].rule.isApply = false;
            }
            if (!xlObj._isUndoRedo) {
                var details = { sheetIndex: sheetIdx, reqType: "validation", operation: "cl-hl-data", range: (ej.isNullOrUndefined(range)) ? this.XLObj._getAlphaRange(1, selected[0].rowIndex, selected[0].colIndex, selected[selected.length - 1].rowIndex, selected[selected.length - 1].colIndex) : range };
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
        },

        _checkValidation: function (value, params, isHighlight, sheetIdx) {
            var xlObj = this.XLObj, len, listVal, cellAddr, calcNamedRanges, isNamedRange, locale = xlObj.model.locale, temp = value;
            sheetIdx = xlObj._getSheetIndex(sheetIdx);
            if (!JSON.parse(params[params.length - 3]) && !isHighlight)
                return true;
			if(params[4] === "time") {
				var patterns = ej.preferredCulture(locale).calendar.patterns;
			    value = xlObj.formatting("{0:" + patterns["T"] + "}", ej.parseDate(value, patterns["dT"]), locale);
			   if(!value.length)
				   value = temp;
			}
            value = this._convertValueByType(value, params[4]);
            params[1] = this._convertValueByType(params[1], params[4]);
            params[2] = this._convertValueByType(params[2], params[4]);
            if (value.length) {
                if (params[params.length - 4] === "list") {
                    var i, isMatch = false;
                    if (params[0].indexOf(",") > -1)
                        listVal = params[0].split(",");
                    else if (params[0].indexOf("=") > -1) {
                        cellAddr = params[0].split("=")[1];
                        calcNamedRanges = xlObj.getCalcEngine().getNamedRanges();
                        isNamedRange = calcNamedRanges.getItem(cellAddr.toUpperCase());
                        if (isNamedRange)
                            cellAddr = isNamedRange;
                        if (cellAddr.indexOf('!') > -1) {
                            sheetIdx = isNamedRange ? xlObj._getSheetIdxFromSheetValue(cellAddr.split('!')[0]) : xlObj._getSheetIndexByName(cellAddr.split('!')[0]);
                            listVal = (cellAddr.split('!')[1].indexOf('$') > -1) ? xlObj.getRangeData({ sheetIdx: sheetIdx, range: xlObj.getRangeIndices(cellAddr.split('!')[1].split('$').join("")), valueOnly: true }) : (cellAddr.indexOf('$') > -1) ? xlObj.getRangeData({ sheetIdx: sheetIdx, range: xlObj.getRangeIndices(cellAddr.split('$').join("")), valueOnly: true }) : xlObj.getRangeData({ sheetIdx: sheetIdx, range: xlObj.getRangeIndices(cellAddr.split('!')[1]), valueOnly: true });
                        }
                        else
                            listVal = xlObj.getRangeData({ sheetIdx: sheetIdx, range: xlObj.getRangeIndices(cellAddr), valueOnly: true });
                    }
                    else
                        listVal = value;
                    for (i = 0, len = listVal.length; i < len; i++) {
                        isMatch = listVal[i].toString() === value;
                        if (isMatch)
                            break;
                    }
                    ej.Spreadsheet.msg = xlObj._getLocStr("ListAlertMsg");
                    return isMatch;
                }
                else {
                    var val, range;
                    params[0] = this._ruleSymbols[params[0]];
                    if (params[1].indexOf("=") > -1) {
                        val = params[1].replace("=", "");
                        range = this.getRangeIndices(val + ":" + val);
                        params[1] = xlObj.XLEdit.getPropertyValue(range[0], range[1], null, sheetIdx).toString();
                    }
                    if (params[2].indexOf("=") > -1) {
                        val = params[2].replace("=", "");
                        range = this.getRangeIndices(val + ":" + val);
                        params[2] = xlObj.XLEdit.getPropertyValue(range[0], range[1], null, sheetIdx).toString();
                    }
                    if (params[0].length <= 2) {
                        ej.Spreadsheet.msg = "The " + params[4] + " should be " + ej.Spreadsheet.ValidationText[params[0]] + " " + params[1].replace("^", "");
                        return xlObj.operators[params[0]](xlObj.parse[params[3]](value), xlObj.parse[params[3]](params[1]));
                    }
                    else {
                        var op = [];
                        op = params[0].split("&&");
                        ej.Spreadsheet.msg = "The " + params[4] + " should" + ej.Spreadsheet.ValidationText[op[2]] + " be between" + " " + params[1].replace("^", "") + " and " + params[2].replace("^", "");
                        return xlObj.operators[op[2]]((xlObj.operators[op[0]](xlObj.parse[params[3]](value), xlObj.parse[params[3]](params[1])) && xlObj.operators[op[1]](xlObj.parse[params[3]](value), xlObj.parse[params[3]](params[2]))));
                    }
                }
            }
            else
                return true;
        },

        _convertValueByType: function (value, type) {
            if (value.length) {
                var xlObj = this.XLObj;
                switch (type) {
                    case "number":
                    case "decimal":
                        if (xlObj._isValidDate(value))
                            value = xlObj._dateToInt(value);
                        break;
                    case "date":
                        if ($.isNumeric(value))
                            value = xlObj.intToDate(value).toString();
                        break;
                }
            }
            return value;
        },

        highlightInvalidData: function (range) {
            var xlObj = this.XLObj;
            if (!xlObj.model.allowDataValidation || xlObj.model.isReadOnly)
				return;
            var len, value, selected, cell, isApply, i, rng, sheetIdx = xlObj.getActiveSheetIndex(), rule;
            rng = xlObj._getRangeArgs(range, "object");
            selected = xlObj._getSelectedCells(sheetIdx, rng).selCells;
            range = xlObj._getAlphaRange(sheetIdx, rng[0], rng[1], rng[2], rng[3]);
            for (i = 0, len = selected.length; i < len; i++) {
                rule = xlObj.XLEdit.getPropertyValue(selected[i].rowIndex, selected[i].colIndex, "rule", sheetIdx);
				if (!rule)
                    continue;
				if (xlObj.XLEdit.getPropertyValue(selected[i].rowIndex, selected[i].colIndex, null, sheetIdx) && !ej.isNullOrUndefined(rule)) {
				    value = (xlObj.XLEdit.getPropertyValue(selected[i].rowIndex, selected[i].colIndex, "type", sheetIdx) === "datetime" || xlObj.XLEdit.getPropertyValue(selected[i].rowIndex, selected[i].colIndex, "type", sheetIdx) === "time") ? xlObj.XLEdit.getPropertyValue(selected[i].rowIndex, selected[i].colIndex, "value2", sheetIdx).toString() : xlObj.XLEdit.getPropertyValue(selected[i].rowIndex, selected[i].colIndex, null, sheetIdx).toString();
                    isApply = rule ? !(this._checkValidation(value, rule.customVal.split("_"), true, sheetIdx)) : false;
                    xlObj._dataContainer.sheets[sheetIdx][selected[i].rowIndex][selected[i].colIndex].rule.isApply = isApply;
                }
                else if (!ej.isNullOrUndefined(rule))
                    isApply = rule.required;
                if(xlObj._isRowViewable(sheetIdx, selected[i].rowIndex)){
                    cell = xlObj.getCell(selected[i].rowIndex, selected[i].colIndex, sheetIdx);
                    if (isApply)
                        cell.addClass("e-hlcell");
                    else
                        cell.removeClass("e-hlcell");
                }
				xlObj.XLEdit._updateDataContainer({ rowIndex: selected[i].rowIndex, colIndex: selected[i].colIndex }, { dataObj: { isHighlight: true }, sheetIdx: sheetIdx });
            }
            if (!xlObj._isUndoRedo) {
                var details = { sheetIndex: sheetIdx, reqType: "validation", operation: "hl-data", range: range };
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
        },

        _replaceRule: function (idx, newRule, range) {
            // replace the rules in shared data
            this.XLObj._dataContainer.cFormatData[idx] = newRule;
        },
		
		 _addDVMethod: function(){
            !ej.isNullOrUndefined($.validator) && $.validator.addMethod("customVal", function (value, elem, params) {        
                var xlObj = $("#" + $(elem).data("id")).data("ejSpreadsheet"), $content = xlObj._getJSSheetContent(xlObj.getActiveSheetIndex()).find(".e-spreadsheetcontentcontainer > .e-content");
                $content.find(".e-error").remove();
                if (xlObj.model.showRibbon && $("#" + xlObj._id + "_Ribbon_freetext").length && !$("#" + xlObj._id + "_Ribbon_freetext").data("ejCheckBox").isChecked())
                    return true;
                return xlObj.XLValidate._checkValidation(value, params.split("_"));
            }, ej.Spreadsheet.getMsg);
        }			
    };
})(jQuery, Syncfusion);