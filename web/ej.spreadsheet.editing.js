(function ($, ej, undefined) {
   
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.editing = function (obj) {
        this.XLObj = obj;
        this._EditCellDetails = {
            value: null,
            rowIndex: -1,
            columnIndex: -1,
            fieldName: null,
            cell: null
        };        
        this._isEdit = false;
		this._isFEdit = false;
        this._isFormulaEdit = false;
        this._isFBarFocused = false;
        this._skipHTML = false;      
        this._editElem = null;
        this._filterIcon = null;
        this._isCellEdit = true;
        this._validOperators = ["+", "-", "*", "/", ","];
        this._invalidOperators = ["%"];
        this._validCharacters = ["+", "-", "*", "/", ",", "(", "="];
        this._textDecoration = false;
        this._editCell = null;
        this._acPosition = { left: 0, top: 0 };
        this._isValidation = false;
		this._cursorPosn = -1;
    };

    ej.spreadsheetFeatures.editing.prototype = {
        //Editing 
        getCurrentEditCellData: function () {
            var elem, value, xlObj = this.XLObj, cellIdx;
            if (this._isEdit) {
                elem = xlObj.element.find("#" + xlObj._id + "_Edit");
                value = elem.text();
                cellIdx = xlObj._getCellIdx(this._editCell[0]);
                if (this.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "type") != "text" && xlObj.isNumber(value))
                    value = parseFloat(value);
                return value;
            }
            return null;
        },

        getColumnIndexByField: function (field) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(xlObj.getActiveSheetIndex()), column, len;
            for (column = 0, len = sheet.columns.length; column < len; column++) {
                if (sheet.columns[column]["field"] === field)
                    break;
            }
            return column;
        },

        _processEditing: function () {
            if (this._editElem)
                return;
            this._editElem = ej.buildTag("div.e-field e-ss-input", "", {}, { id: this.XLObj._id + "_Edit", contenteditable: true });
			this._editElem.data("parentID", this.XLObj._id);
        },
		
        editCell: function (rowIdx, colIdx, oldData) {
            var xlObj = this.XLObj;
            if (!xlObj.model.allowEditing || !xlObj.model.allowSelection || xlObj._isCellProtected(rowIdx, colIdx, true) || xlObj.model.isReadOnly)
                return;
            var column, sheetIdx, sheet, input, args, actCell, prevValue, trgtTd, selObj, xlObj = this.XLObj, valElem = xlObj.element.find("#" + xlObj._id + "_ValElem"),
            value2, temp, culNumFmt, regExp, hasMerge = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "merge"), cellValue;
            if (!xlObj._intrnlReq && xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "mergeIdx"))
                return false;
            selObj = { rowIndex: rowIdx, colIndex: colIdx };
            sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), actCell = xlObj.getActiveCell(sheetIdx);
            if (xlObj._isRowViewable(sheetIdx,rowIdx))
                this._textDecoration = xlObj.getCell(rowIdx, colIdx).find("a").css("text-decoration") === "none";
            trgtTd = xlObj.getCell(rowIdx, colIdx), column = sheet.columns[colIdx];
			this._editCell = trgtTd;
            args = { 
                columnName: column.field,
                value: xlObj.getRangeData({ range: [rowIdx, colIdx, rowIdx, colIdx], valueOnly: true, sheetIdx: sheetIdx, skipDateTime: true })[0],
                columnObject: column,
                cell: trgtTd,
                rowIndex: rowIdx,
                colIndex:colIdx
            };
            if (!xlObj.isFormula(args.value) && ["longdate", "shortdate", "date", "time"].indexOf(this.getPropertyValue(rowIdx, colIdx, "type", sheetIdx)) > -1 && !xlObj.isNumber(this.getPropertyValue(rowIdx, colIdx, "value", sheetIdx)))
                args.value = xlObj._getEditValOfDateTime(rowIdx, colIdx);
            if (xlObj.model.locale != "en-US" && xlObj.isNumber(args.value)) {
                value2 = this.getPropertyValue(rowIdx, colIdx, "value2", sheetIdx), temp = args.value + "", culNumFmt = ej.preferredCulture(xlObj.model.locale).numberFormat, regExp = new RegExp("\\" + culNumFmt[","] + "\\d{3}");
                if (culNumFmt[","] == "." && (regExp.test(temp) || args.value != value2))
                    args.value = xlObj._getlocaleNumVal(temp, true);
            }
            if (xlObj._trigger("cellEdit", args))
                return;
            xlObj._cureditedCell = args.value;            
            if (this._isValidation) {              
                valElem.rules("remove");               
                this._isValidation = false;
            }
            if ((actCell.rowIndex !== rowIdx || actCell.colIndex !== colIdx) && !hasMerge) {
                sheet._activeCell = selObj;
                if (sheet._startCell.rowIndex <= rowIdx && sheet._startCell.colIndex <= colIdx && sheet._endCell.rowIndex >= rowIdx && sheet._endCell.colIndex >= colIdx)
                    xlObj.XLSelection.selectRange(sheet._startCell, sheet._endCell);
                else
                    xlObj.XLSelection.selectRange(selObj, selObj);
                if(xlObj.model.allowAutoFill)
					xlObj.XLDragFill.positionAutoFillElement();
            }
            if (!xlObj._intrnlReq && hasMerge) {
                xlObj.XLSelection.selectRange(hasMerge.mRange);
                if (xlObj.model.allowAutoFill)
                    xlObj.XLDragFill.positionAutoFillElement();
            }
            this._EditCellDetails = {
                rowIndex: rowIdx,
                value: args.value,
                columnIndex: colIdx,
                fieldName: column.field,
                cell: trgtTd
            };
            if (!oldData)
                args.value = "";
            cellValue = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "value2");
            prevValue =  oldData ?  ej.isNullOrUndefined(cellValue)  ? args.value : (cellValue.indexOf("%") > -1 )  ? cellValue : args.value : args.value;
            this._renderBulkEditObject(args, trgtTd, prevValue);
            if (this.getPropertyValue(sheet._activeCell.rowIndex, sheet._activeCell.colIndex, "rule", sheetIdx) && xlObj.model.allowDataValidation)
                xlObj.XLValidate._setValidation();
            input = $("#" + xlObj._id + "_Edit");
            if (this.getPropertyValue(rowIdx, colIdx, "hyperlink", sheetIdx))
                input.addClass("e-hyperlinks");
            if (this._textDecoration)
                input.css("text-decoration", "none");
            if (xlObj.model.allowComments && trgtTd.hasClass("e-commentcell"))
                xlObj.XLComment._visibleCmntCnt(trgtTd);
            args.cell.addClass(xlObj._browserDetails.name === "msie" ? "e-editedcell e-msie-edit" : "e-editedcell");
            if (xlObj.isFormula(args.value))
                this._processFormulaEditRange(args.value);
			if (xlObj.model.allowKeyboardNavigation)
                xlObj.XLCellNav._isNavigate = false;
            if (xlObj.model.enableContextMenu)
                $("#" + xlObj._id + "_contextMenuCell").data("ejMenu")._contextMenuEvents("_off"); //for enable default contextmenu - clipboard actions
			if (hasMerge) {
                 mergeWrap = xlObj.getCell(rowIdx, colIdx).find('#' + xlObj._id + '_Merge')[0];
			     mergeWrap && (mergeWrap.innerHTML = "")
				}
        },

        _renderBulkEditObject: function (cellArgs, td, prevValue) {
            var htmlString, currHeight, filterIcon, cellData = {}, xlObj = this.XLObj, prevHeight = td.height(), sheetIdx = xlObj.getActiveSheetIndex(),
                tdSpan = td.find(".e-filterspan"), content = xlObj._getJSSheetContent(sheetIdx).find(".e-spreadsheetcontentcontainer > .e-content"), format = xlObj.XLFormat.getFormatClass(td[0].className), obj;
            cellData[cellArgs.columnObject.field] = cellArgs.value;
            if (tdSpan.length) {
                filterIcon = { filterIcon: tdSpan, rowIndex: tdSpan.parentsUntil("table").eq(1).index(), colIndex: tdSpan.parent().index() };
                this._filterIcon = filterIcon;
            }
            currHeight = td.height();
            this._refreshTextNode(td[0]);
            if (td.hasClass('e-sswraptext') && prevHeight !== currHeight)
                td.height(prevHeight);
            var $elem = this._editElem;	
            $elem.text("");
            if (!ej.isNullOrUndefined(prevValue))
                $elem.text(prevValue);
            content.append($elem);
			if(xlObj._isClassHasProperty(format, 'text-align', 'right'))
				obj = {
					right: content.width() - td[0].offsetLeft - td[0].offsetWidth + 2,
					left: '',
					maxWidth : td[0].offsetLeft + td[0].offsetWidth + 2   //+2px for left padding like excel
				}
			else
				obj = {
					left: td[0].offsetLeft + 2,   //+2px for left padding like excel
					right: '',
					maxWidth : content.width() - (td.offset().left - (xlObj.element.offset().left + $(xlObj.getRows(sheetIdx)[0][0]).width())) - 2
				}
			$elem.css({ left: obj.left, right: obj.right, top: td[0].offsetTop + 1, '-webkit-user-select': 'text', cursor: "text", "min-height": currHeight - 1, height: "auto", lineHeight: "normal", wordWrap: "break-word", position: "absolute", minWidth: td.width(), whiteSpace: "pre-wrap" });   //+1px for top padding like excel
            if (this._editCell.hasClass("e-sswraptext")) {
                $elem.css({ width: td.width(), maxWidth: "" });
                $(xlObj.getRows(sheetIdx)[1][td.parent().attr("data-idx")]).height(xlObj.model.sheets[sheetIdx].rowsHeightCollection[td.parent().attr("idx")]);
                xlObj.XLScroll._getRowHeights(sheetIdx, td.parent().index());
            }
            else
                $elem.css({ width: "", maxWidth: obj.maxWidth });
            $elem.show();           
            this._refreshEditForm(td, $elem, cellArgs.value, prevValue, currHeight);			           
            this._isEdit = true;
            (xlObj.model.showRibbon) && xlObj.XLRibbon._disableRibbonIcons();
        },       

        _refreshEditForm: function (cell, elem, cellvalue, prevValue,height) {
            var i, len, clsNm, splitStr, cFormatRule, cellType, cellObj = {}, xlObj = this.XLObj, form = document.getElementById(xlObj._id + "EditForm"),
                formElem = $(form).find("input,select"), sheet = xlObj._dataContainer.sheets[xlObj.getActiveSheetIndex()],
                rowIdx = cell.parent().index();
            if(sheet && sheet[rowIdx] && sheet[rowIdx][cell[0].cellIndex])
                cellObj = sheet[rowIdx][cell[0].cellIndex];                           
            elem[0].className = "";
            cellType = this.getPropertyValueByElem(cell, "type") || "";
            if (cellType =="percentage") {
                if(!(prevValue.indexOf("%") >-1))
                    elem.prepend("%");
            }
            if (xlObj.isNumber(prevValue) && !(cellType.indexOf("text")>-1))
                    elem.addClass("e-ralign");
                if(cellType.indexOf("date") > -1 || cellType.indexOf("time") > -1)
                    elem.addClass("e-ralign");
                elem.css({ "border": "none", "outline": "none" });
                if(this.XLObj.model.allowCellFormatting)
                    clsNm = xlObj.XLFormat.getFormatClass(cell[0].className);
                elem.addClass(clsNm);
                if (xlObj.model.allowCellFormatting) {
                        elem.css({ "color": cell.css('color') });
                        elem.css({ "background-color": cell.css('background-color') });
                }
                elem.on("keyup", { xlObj: xlObj }, function (e) {
                    var sObj = e.data.xlObj;
                    sObj.XLEdit._isFormulaEdit = !$(e.target).text().indexOf("=");
                    if(sObj.XLEdit._isFormulaEdit)
                        sObj.XLEdit._processFormulaEditRange($(e.target).text());
                    if(sObj.model.allowFormulaBar)
                    sObj._getInputBox().val($(e.target).text());
                    sObj.XLEdit._isCellEdit = true;
                });
                elem.on("focus", { xlObj: xlObj }, function (e) {
                    var sObj = e.data.xlObj;
                    sObj.XLEdit._isCellEdit = true;
                });             
                xlObj._setFormulaSuggElem($("#" + xlObj._id+"_AutoComplete_suggestion"));            
                cellType =="percentage" ? elem.focus() : elem.focusEnd();
        },

        _renderAutoComplete: function (elem, value, height , flag) {
            var xlObj = this.XLObj, tmpClass = flag ? " e-cell-ac e-ss-editinput" : "";
            elem.ejAutocomplete({
                dataSource: xlObj._formulaCollection,
                value: value,
                cssClass: "e-ss-autocomplete" + tmpClass,
                width: "100%",
                height: height,
                htmlattributes: flag ? { display: "none" }:"",
                delaySuggestionTimeout: 10,
                minCharacter: 2,
                popupWidth: "170px",
                popupHeight: "150px",
                showEmptyResultText: false,
                autoFocus: true,
                template: "<span class='e-icon e-ss-function'> </span>" + "<div> ${display} </div>",
                select: $.proxy(this._formulaSelect, xlObj),
                open: $.proxy(this._formulaSuggestionStatus, xlObj),
                close: $.proxy(this._formulaSuggestionStatus, xlObj)
            });
            elem.data("ejAutocomplete")._bubbleEvent(true);
        },

        _refreshAutoComplete: function () {
            var xlObj = this.XLObj, acElem, inptBoxElem, wgt = "ejAutocomplete", dataSrc = "dataSource";
            inptBoxElem = $("#" + xlObj._id + "_inputbox").data(wgt);
            acElem = $("#" + xlObj._id + "_AutoComplete").data(wgt);
            if (xlObj.model.allowFormulaBar)
                inptBoxElem && inptBoxElem.option(dataSrc, xlObj._formulaCollection);
            acElem && acElem.option(dataSrc, xlObj._formulaCollection);
        },

		 _captureEditing: function () {
            var xlObj = this.XLObj, acElem, editCell, editElem, location, actElem = document.activeElement,
                actCell = xlObj.getActiveCell(); 
            if (actElem && actElem.tagName === "DIV" && xlObj._isRowViewable(null, actCell.rowIndex)) {
                acElem = xlObj.element.find("#" + xlObj._id + "_AutoComplete");
                acElem.val($(actElem).text());
                acElem.data("ejAutocomplete").search();
                editCell = xlObj.getActiveCellElem();
                editElem = xlObj.element.find("#" + xlObj._id + "_Edit")[0];
                location = editCell[0].getBoundingClientRect();
                this._acPosition.left = location.left + window.pageXOffset;
                this._acPosition.top = location.top + window.pageYOffset + $(editElem).height();
                $("#" + xlObj._id + "_AutoComplete_suggestion").css({ left: this._acPosition.left, top: this._acPosition.top });
             }
		 },
		
		 saveCell: function () {
		     var xlObj = this.XLObj;
		     if (!xlObj.model.allowEditing || xlObj.model.isReadOnly)
		         return;
			 this._cursorPosn = -1;
		     var i, j, actCell, form, autoEle, temp, formulaStr, prevFrmtObj, flen, column, cFormatStr, trgtTd, elem, obj, rHgt,
                cFormatRule, len, rowIdx, colIdx, args, prevValue, details, sheetIdx, sheet, cellIdx, rowHgt, fRange, fObj,
                rowIdx, isFormatChanged = false, rows, cellHeight, skipFormulaColl = ["ABS", "LEFT", "RIGHT", "TRIM", "UPPER", "VALUE"];
            if (this._isEdit) {
                sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), rows = xlObj.getRows(sheetIdx), form = $("#" + xlObj._id + "EditForm");
                trgtTd = this._editCell, column = sheet.columns[this._EditCellDetails.columnIndex];
                elem = xlObj.element.find("#" + xlObj._id + "_ValElem");
				var editElem = xlObj.element.find("#" + xlObj._id + "_Edit")[0], htmlVal=$(editElem).html();				 
				obj = xlObj._getCellIdx(trgtTd[0]);
				rowIdx = obj.rowIndex, colIdx = obj.colIndex;
                args = {
                    columnName: column.field,
                    value: this.getCurrentEditCellData(),
                    prevValue: this._EditCellDetails.value,
                    columnObject: column,
					rowIndex: rowIdx,
                    colIndex: colIdx,
                    cell: trgtTd,
					 isRefCells: false
                };
				if (xlObj.model.allowDataValidation && this._isValidation) {
				    elem.val(args.value);
				    form.css("display", "block");
				    if (!form.validate().element(elem[0])) {
				        form.css("display", "none");
				        return false;
				    }
				    form.css("display", "none");
				    args.hasValidation = true;
				}
				if ((args.value !== args.prevValue) && xlObj._trigger("cellSave", args))
                    return;
				prevFrmtObj = xlObj.getRangeData({ range: [rowIdx, colIdx, rowIdx, colIdx], property: ["type", "formatStr", "decimalPlaces"] })[0];
				if (xlObj.isFormula(args.value) && !this._formulaValidate(args.value))
				    return;
				prevValue = this._EditCellDetails.value || "";
                details = { sheetIndex: sheetIdx, rowIndex: rowIdx, colIndex: colIdx, cValue: args.value, reqType: "edit", iconName: "", pValue: prevValue };
                details.prevHeight = sheet.rowsHeightCollection[rowIdx];
				xlObj._dupDetails = true;
				this._updateCellValue({ rowIndex: rowIdx, colIndex: colIdx }, args.value);
				xlObj._dupDetails = false;
				if (this.getPropertyValue(rowIdx, colIdx, "wrap", sheetIdx)) {
					if(prevValue.length !== args.value.length )
					   xlObj._wrapTextLenCln([{ rowIndex: rowIdx, colIndex: colIdx }], sheet, "savcell", sheetIdx);
					rHgt = xlObj._getWrapCellHeight(sheetIdx, rowIdx, colIdx);
					xlObj._wrapCollection( rowIdx, colIdx, rHgt.cellHt, sheetIdx);
					if (xlObj._getRowHeight(rowIdx, sheetIdx) < rHgt.rowHt) {
						xlObj.setHeightToRows([{ rowIndex: rowIdx, height: rHgt.rowHt }]);
						xlObj.model.allowAutoFill && xlObj.XLDragFill.positionAutoFillElement();
					}
					this._updateDataContainer({ rowIndex: rowIdx, colIndex: colIdx }, {dataObj: {}});
				}
				if (xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "isFilterHeader"))
				    xlObj._removeClass(args.cell[0], xlObj._rAlign);
                if(this._textDecoration)
                    args.cell.find("a").css("text-decoration", "none");				
                if (args.hasValidation)
                    details["hasValidation"] = true;
                if (xlObj.isFormula(args.value) && (!xlObj.getObjectLength(prevFrmtObj) || prevFrmtObj.type==="general")) {
                    details.operation = "formula";
                    formulaStr = args.value;
                    formulaStr = xlObj.XLDragFill._parseFormula(formulaStr);
                    if (skipFormulaColl.indexOf(formulaStr[0]) === -1) {
                        for (j = 0, flen = formulaStr.length; j < flen; j++) {
                            temp = formulaStr[j];
                            if (temp != "(" && formulaStr[j + 1] != "(")
                                break;
                        }
                        if (temp.indexOf(":") > -1)
                            temp = temp.split(":")[0];
                        if (xlObj._isCellReference(temp)) {
                            temp = temp.replace(/\$/g, "");
                            fRange = xlObj.getRangeIndices(temp);
                            fObj = xlObj.getRangeData({ range: fRange, property: ["type", "formatStr", "decimalPlaces"] })[0];
                            if (xlObj.getObjectLength(fObj) && fObj.type != prevFrmtObj.type && fObj.type !== "general") {
                                xlObj._dupDetails = true;
                                isFormatChanged = true;
                                xlObj.XLFormat.format(fObj, xlObj._getAlphaRange(xlObj.getActiveSheetIndex(), rowIdx, colIdx, rowIdx, colIdx));
                                xlObj._dupDetails = false;
                                details.prevFrmtObj = xlObj.getObjectLength(prevFrmtObj) ? prevFrmtObj : { type: "general" };
                                details.curFrmtObj = fObj;
                            }
                        }
                    }
                }
                xlObj._setRowHdrHeight(sheetIdx, rowIdx);
				xlObj.model.allowFormulaBar && xlObj.updateFormulaBar();
				if(xlObj.model.scrollSettings.allowScrolling)
					xlObj.XLScroll._getRowHeights(sheetIdx, rowIdx);
                this._isEdit = this._isFormulaEdit = false;
                args.cell.removeClass("e-editedcell e-msie-edit");
                if (xlObj.model.allowKeyboardNavigation)
                    xlObj.XLCellNav._isNavigate = true;
                if (xlObj.model.showRibbon) {
                    xlObj.XLRibbon._enableRibbonIcons();
                    xlObj.XLRibbon._updateRibbonIcons();
                }
                xlObj._updateUndoRedoIcons();
                if (!xlObj.model.allowInsert) {
                    xlObj.XLRibbon._disableButtons(["Others_Cells_InsertCellOptions"], "ejSplitButton");
                    xlObj.XLRibbon._disableButtons(["Others_Cells_InsertCell"], "ejButton");
                }
                if (!xlObj.model.allowDelete) {
                    xlObj.XLRibbon._disableButtons(["Others_Cells_DeleteCellOptions"], "ejSplitButton");
                    xlObj.XLRibbon._disableButtons(["Others_Cells_DeleteCell"], "ejButton");
                }
                details.cFormatRule = cFormatRule = this.getPropertyValue(rowIdx, colIdx, "cFormatRule", sheetIdx);
				xlObj._dupDetails = true;
                if (xlObj.model.allowConditionalFormats && cFormatRule) {
                    for (i = 0, len = cFormatRule.length; i < len; i++) {
                        cFormatStr = cFormatRule[i].split("_");
                        cFormatStr[0] !== "formularule" && xlObj.XLCFormat._cFormat(cFormatStr[0], cFormatStr[2], cFormatStr[3], cFormatStr[4], cFormatStr[5], xlObj._generateHeaderText(colIdx + 1) + (rowIdx + 1));
                    }
					xlObj.XLCFormat.refreshCFormat(xlObj._getAlphaRange(sheetIdx, rowIdx, colIdx, rowIdx, colIdx));
                }
				xlObj._dupDetails = false;
                details["endCell"] = sheet._endCell;
                details["startCell"] = sheet._startCell;
				actCell = xlObj.getActiveCellElem();
				if (actCell) {
                    if (xlObj.model.allowComments && actCell.hasClass("e-commentcell"))
                        xlObj.XLComment._visibleCmntCnt(actCell, true);
                    if (actCell.hasClass("e-hlcell"))
                        xlObj.XLValidate.highlightInvalidData();
                }
                this._shiftKeyEnabled = this._isFBarFocused = false;
                xlObj._ctrlKeyCount = 0;
                if (!this._isFormulaEdit && xlObj.model.allowSelection)
                    xlObj.XLSelection._clearBorder(xlObj._formulaBorder.join(" ").replace(/,/g, " ") + " " + xlObj._ctrlFormulaBorder.join(" ").replace(/,/g, " "));
                if (xlObj.model.allowFormulaBar)
                {
                    autoEle = $("#" + xlObj._id + "_inputbox").data("ejAutocomplete");
                    if (autoEle)
                        autoEle.hide();
                }
                this._editElem.hide();
                xlObj.setSheetFocus();
                if (xlObj._browserDetails.name === "mozilla")  //ff issue - https://bugzilla.mozilla.org/show_bug.cgi?id=744408
                    htmlVal = htmlVal.slice(0, -4);
                if (htmlVal.indexOf('\n') > -1) {
                    details.altwrap = true;
                    this._updateDataContainer({ rowIndex: rowIdx, colIndex: colIdx }, { dataObj: { altTxt: true } });
                }
                if (this.getPropertyValue(rowIdx, colIdx, "altTxt", sheetIdx)) {
                    if (!this.getPropertyValue(rowIdx, colIdx, "wrap", sheetIdx))
                        xlObj.wrapText([rowIdx, colIdx, rowIdx, colIdx]);
                    if (!htmlVal.match(/\n/g))
                        this._clearDataContainer({ cellIdx: { rowIndex: rowIdx, colIndex: colIdx }, property: ["altTxt"] });
                }
				var sparklineId = this.getPropertyValue(rowIdx, colIdx, "sparkline", sheetIdx);
				if (xlObj.model.allowSparkline && sparklineId) {
					var sparkElem = xlObj.getCell(rowIdx, colIdx, sheetIdx).find(".e-sparkline");
					if(sparkElem.length < 1) {
						var sparklineProp = sheet.shapeMngr.sparkline[sparklineId[0]];
						xlObj.XLSparkline._createSparkline(sparklineProp, null, sheetIdx);
					}
				}
				details.newHeight = sheet.rowsHeightCollection[rowIdx]
                xlObj.XLScroll._getRowHeights(sheetIdx, rowIdx);
                if (xlObj.model.enableContextMenu)
                    $("#" + xlObj._id + "_contextMenuCell").data("ejMenu")._contextMenuEvents("_on"); //for disable default contextmenu - clipboard actions
                if (args.value !== args.prevValue || isFormatChanged) {
                    xlObj._completeAction(details);
                    xlObj._trigActionComplete(details);
                }
                return true;
            }
        },

        _formulaValidate: function (value) {
            var i, len, fValue, lPrnthsLen, rPrnthsLen, formulaLen, subStr, formulaCln, leftPos, rightPos, splitStr, formulaValue = value, xlObj = this.XLObj,
            customFormulas = xlObj.model.customFormulas, argsFormula = ["TODAY", "NOW", "TRUE", "FALSE", "ROW", "COLUMN", "SHEET", "SHEETS"];
            for (i = 0; i < customFormulas.length; i++)
                argsFormula.push(customFormulas[i]["formulaName"].toUpperCase());
			if (!this._isNamedRange(value)) {
                formulaLen = formulaValue.length;
                lPrnthsLen = formulaValue.split("(").length;
                rPrnthsLen = formulaValue.split(")").length;
                formulaCln = xlObj.getCalcEngine().getLibraryFunctions();
                if (formulaValue.startsWith("=") && formulaLen > 1) {
                    fValue = formulaValue = formulaValue.substring(1);
                    if (lPrnthsLen !== rPrnthsLen) {
                        xlObj._showAlertDlg("Alert", "MissingParenthesisAlert", "FormulaAlert", 440); // To check the parenthesis
                        return;
                    }
                    if (lPrnthsLen === 1 && rPrnthsLen === 1 && xlObj.isUndefined(formulaCln.getItem(fValue.toUpperCase())) && !this._isValidCell(formulaValue) && !(fValue.substring(0, leftPos) == "TRUE" || fValue.substring(0, leftPos) == "FALSE")) {
                        xlObj._showAlertDlg("Alert", "CorrectFormula", "FormulaAlert", 372);// To enter the correct formula
                        return;
                    }
                    do {
                        leftPos = fValue.indexOf("(");
                        rightPos = fValue.indexOf(")");
                        if (argsFormula.indexOf(fValue.substring(0, leftPos).toUpperCase()) < 0) {
                            if (leftPos + 1 === rightPos) {
                                xlObj._showAlertDlg("Alert", "CorrectArgument", "FormulaAlert", 372); // To pass correct argument
                                return;
                            }
                        }
                        fValue = fValue.substring(leftPos + 1);
                        if (fValue.indexOf(",") > -1)
                            fValue = fValue.substring(fValue.indexOf(",") + 1);
                    }
                    while (fValue.indexOf("(") > -1);
                }
            }
            return true;
        },

        _isValidCell: function (cellRange) {
           var xlObj = this.XLObj, splt, rangeSplt,rangeLen, isSheet = true, isVisible, i, j, len, operandCln = ["<=", ">=", "<", ">", "=","+","-","/","*","^", "&"];
            for (i = 0, len = operandCln.length; i < len; i++) {
                if (cellRange.indexOf(operandCln[i]) > -1){
					rangeSplt = cellRange.split(operandCln[i]);
					for(j=0, rangeLen = rangeSplt.length;j<rangeLen;j++){
						if(!rangeSplt[j].length)
							return false; 
						else if(rangeLen == j+1 && rangeSplt[j].length)
							return true; 
					}
				} 
                if(cellRange.indexOf("%") > -1 && cellRange.split("%").length == 2)
                      return true;					
            }
            cellRange = cellRange.trim();
            cellRange = cellRange.startsWith("=") ? cellRange.substring(1) : cellRange;
            if (cellRange.indexOf("!") > -1) {
                splt = cellRange.split("!");
                cellRange = splt[1];
                if (xlObj._getSheetIndexByName(splt[0]) < 1)
                    isSheet = false;
            }
            isVisible = cellRange.indexOf(":") > -1 ? xlObj._isvalidRange(cellRange) : xlObj._isvalidRange(cellRange + ":" + cellRange);
            return isVisible && isSheet;
        },
		
		updateValue: function(aRange, val, formatclass, sheetIdx){
		    var xlObj = this.XLObj, range, cellIdx;
		    if (xlObj.model.isReadOnly)
		        return;
		    range = xlObj.getRangeIndices(aRange);
		    cellIdx = {rowIndex: range[0], colIndex: range[1]};
		    xlObj._isPublic = true;
			if (xlObj.model.allowCellFormatting && xlObj.XLFormat._hasFormat(formatclass)) {
			    xlObj.XLFormat._createFormatClass(xlObj.XLFormat.getFormatFromHashCode(formatclass), formatclass);
			    xlObj.XLFormat._updateFormatClass(cellIdx, formatclass);
            }
			this._updateCellValue(cellIdx, val, formatclass, sheetIdx);
			xlObj._isPublic = false;
		},

		updateCellValue: function (cellIdx, val, formatclass, sheetIdx) {
		    var xlObj = this.XLObj;
		    xlObj._isPublic = true;
		    if (xlObj.model.allowCellFormatting && xlObj.XLFormat._hasFormat(formatclass)) {
		        xlObj.XLFormat._createFormatClass(xlObj.XLFormat.getFormatFromHashCode(formatclass), formatclass);
		        xlObj.XLFormat._updateFormatClass(cellIdx, formatclass);
		    }
		    this._updateCellValue(cellIdx, val, formatclass, sheetIdx);
		    xlObj._isPublic = false;
		},

		_updateCellValue: function (cellIdx, val, formatclass, sheetIdx, isCellType) {
		    var xlObj = this.XLObj;
		    if (!cellIdx || xlObj.model.isReadOnly)
		        return;
            var colIdx = cellIdx.colIndex, rowIdx = cellIdx.rowIndex, sheetIdx = xlObj._getSheetIndex(sheetIdx), actCell = xlObj.getActiveCell();
            if (xlObj.isFormula(val) && this.getPropertyValue(rowIdx, colIdx, "type", sheetIdx) !== "text") {
                this._updateDataContainer({ rowIndex: rowIdx, colIndex: colIdx }, { dataObj: { value: val }, sheetIdx: sheetIdx });
		        this._refreshCalcEngine(rowIdx, colIdx, true, val, sheetIdx);
		        xlObj._isFormulaSuggestion = false;
		    }
		    else if (val && val[0] == "'")
		        this._updateDataContainer({ rowIndex: rowIdx, colIndex: colIdx }, { dataObj: { value: val, value2: val.substr(1) }, sheetIdx: sheetIdx });
		    else {
		        this._updateCell({ rowIndex: rowIdx, colIndex: colIdx }, val, sheetIdx, isCellType);
		        this._refreshCalcEngine(rowIdx, colIdx, false, null, sheetIdx);
		    }
		    if (xlObj._isPublic) {
		        if (xlObj.model.allowDataValidation && this.getPropertyValue(rowIdx, colIdx, "isHighlight", sheetIdx))
		            xlObj.XLValidate.highlightInvalidData();
		        if (xlObj.model.allowConditionalFormats)
		            xlObj.XLCFormat.refreshCFormat([rowIdx, colIdx, rowIdx, colIdx]);
		        if (xlObj.model.allowComments)
		            xlObj.XLComment._updateCmntArrowPos();
		        if (actCell.rowIndex === rowIdx && actCell.colIndex === colIdx) {
		            xlObj.model.showRibbon && xlObj.XLRibbon._updateRibbonIcons();
		            xlObj.model.allowFormulaBar && xlObj.updateFormulaBar();
		        }
				if(this.getPropertyValue(rowIdx, colIdx, "wrap", sheetIdx)){
				   var sheet = xlObj.getSheet(sheetIdx);
			       xlObj._updateWrapCol("updatecellvalue", [cellIdx], sheet, sheetIdx);
				   if (xlObj._isRowViewable(sheetIdx, rowIdx))
                       xlObj.getRows(sheetIdx)[1][xlObj._getRowIdx(rowIdx)].style.height = sheet.rowsHeightCollection[rowIdx] + "px";
				   xlObj.model.allowSelection && xlObj.XLSelection._refreshBorder();
				   xlObj.model.allowAutoFill && xlObj.XLDragFill.positionAutoFillElement();
			    }
		        if (!ej.isNullOrUndefined(formatclass))
		            xlObj.XLFormat._updateRowHeight([rowIdx, colIdx,rowIdx,colIdx], sheetIdx);
		    }
		},

		updateCell: function (cell, val, sheetIdx) {
		    var xlObj = this.XLObj;
		    xlObj._isPublic = true;
		    this._updateCell(cell, val, sheetIdx);
		    xlObj._isPublic = false;
		},

		_updateCell: function (cell, val, sheetIdx, isCellType) {
		    var xlObj = this.XLObj;
		    if (!cell || xlObj.model.isReadOnly)
		        return;
		     sheetIdx = xlObj._getSheetIndex(sheetIdx);
		     var cHght, isUpdtDtcnr = true, sheet = xlObj.getSheet(sheetIdx), rIdx = cell.rowIndex, cIdx = cell.colIndex, ctype = ej.Spreadsheet.CellType, details, pValue = this.getPropertyValue(rIdx, cIdx, 'value2') || "", height = sheet.rowsHeightCollection[rIdx], cellElem = xlObj.getCell(rIdx, cIdx),
            // parse value
            valObj = this._parseValue(val, cell),
           cellInfo = xlObj.getRangeData({ range: [rIdx, cIdx, rIdx, cIdx], property: ["formatStr", "type", "thousandSeparator", "decimalPlaces", "cellType"], sheetIdx: sheetIdx })[0], container = xlObj._dataContainer;
			if(xlObj.model.isReadOnly)
				return;
            // cell type
			if (cellInfo.type && cellInfo.type != ctype.General) {
			    valObj.type = cellInfo.type;
			    if (valObj.type == ctype.Text) {
			        valObj.align = ej.Spreadsheet.Align.Left;
			        valObj.value = valObj.value2 = val;
			    }
                delete valObj.formatStr;
            }
            // cell format
            if (cellInfo.formatStr || cellInfo.type === ctype.Scientific || cellInfo.type === ctype.Fraction) {
                if(valObj.value2.indexOf("%") > -1)
                    valObj.value = xlObj.isNumber(valObj.value) ? valObj.value/100 : valObj.value;
                valObj.value2 = xlObj.XLFormat._format(valObj.value, { formatStr: cellInfo.formatStr, type: cellInfo.type, thousandSeparator: cellInfo.thousandSeparator, decimalPlaces: cellInfo.decimalPlaces }, cell);
            }
			if (xlObj.model.allowCellType && !xlObj.isUndefined(cellInfo.cellType))
				isUpdtDtcnr = xlObj.XLCellType._rfrshCtrlText(cellInfo, valObj.value);
			if (isUpdtDtcnr)// data updation
			    this._updateDataContainer(cell, { dataObj: valObj, sheetIdx: sheetIdx });
			else {
			    if (!xlObj.isUndefined(cellInfo.cellType) && ej.isNullOrUndefined(isCellType)) {
			        $("#" + container.sheetCellType[cellInfo.cellType]["id"]).data("ej" + container.sheetCellType[cellInfo.cellType]["type"]).destroy()
			        cellElem && (cellElem[0].innerHTML = "");
			        xlObj._removeClass(cellElem[0], "e-cellreadonly");
			        delete container.sheets[sheetIdx][rIdx][cIdx]["cellType"];
			    }
			    this._updateDataContainer(cell, { dataObj: valObj, sheetIdx: sheetIdx });
			}
            if (xlObj._isPublic && !xlObj._isScrolling) {
                if(this.getPropertyValue(rIdx, cIdx, "wrap")){
                    cHght = xlObj._getWrapCellHeight(sheetIdx, rIdx, cIdx);
                    if (cHght.cellHt > sheet.rowsHeightCollection[rIdx]) {
                        if (xlObj._isRowViewable(sheetIdx, rIdx))
                            xlObj.setHeightToRows([{ rowIndex: rIdx, height: cHght.rowHt }]);
                        else {
                            sheet.rowsHeightCollection[rIdx] = cHght.rowHt;
                            xlObj.XLScroll._getRowHeights(sheetIdx, rIdx);
                        }
                        xlObj._wrapCollection(rIdx, cIdx, cHght.cellHt, sheetIdx);
                    }
                }
            }
			if(this.getPropertyValue(rIdx, cIdx, "wrap", sheetIdx)){
				   var sheet = xlObj.getSheet(sheetIdx);
			       xlObj._updateWrapCol("updatecellvalue", [cell], sheet, sheetIdx);
				   if (xlObj._isRowViewable(sheetIdx, rIdx))
                       xlObj.getRows(sheetIdx)[1][xlObj._getRowIdx(rIdx)].style.height = sheet.rowsHeightCollection[rIdx] + "px";
				   xlObj.model.allowSelection && xlObj.XLSelection._refreshBorder();
				   xlObj.model.allowAutoFill && xlObj.XLDragFill.positionAutoFillElement();
			    }
			details = { sheetIndex: sheetIdx ? sheetIdx : xlObj.getActiveSheetIndex(), rowIndex: rIdx, colIndex: cIdx, reqType: 'edit', cValue: val, pValue: pValue ? pValue: "", prevHeight: height, newHeight: sheet.rowsHeightCollection[rIdx] };
			if (!xlObj._dupDetails) {
			    xlObj._completeAction(details);
			    xlObj._trigActionComplete(details);
			}
        },

        _parseValue: function (value, cell) {
            var localeNum, decimalplcs, isThouSep, cellType, prefCul, tSep, regExp, dSep, locale = this.XLObj.model.locale;
            if (cell) {
                decimalplcs = this.getPropertyValue(cell.rowIndex, cell.colIndex, "decimalPlaces");
                isThouSep = this.getPropertyValue(cell.rowIndex, cell.colIndex, "thousandSeparator");
                cellType = this.getPropertyValue(cell.rowIndex, cell.colIndex, "type");
            }
            prefCul = ej.preferredCulture(locale);
            tSep = prefCul.numberFormat[","] || ",";
            dSep = prefCul.numberFormat["."] || ".";
            regExp = new RegExp("^\\d+(\\" + tSep + "\\d{3})+$|\\d(\\" + tSep + "\\d{3})+\\" + dSep + "\\d+$");
            if (!cell || (cellType != "text" && cellType != "shortdate" && cellType != "date" && cellType != "time" && cellType != "longdate")) {
                localeNum = regExp.test(value) ? this.XLObj._getlocaleNumVal(value) : null;
                value = this.XLObj.isNumber(value) ? Number(value) : (ej.isNullOrUndefined(value) ? "" : ((typeof value === "object" && !this.XLObj._isDateTime(value)) ? JSON.stringify(value) : value));
            }
            var prop, temp, patrns, isRExp, formatStr, decPlaces, xlObj = this.XLObj, ctype = ej.Spreadsheet.CellType, rAlign = ej.Spreadsheet.Align.Right,
                value2 = (typeof value === "object" && !this.XLObj._isDateTime(value)) ? JSON.stringify(value) : value + "", type = ctype.General, idx = value2.indexOf(xlObj._currencySymbol);
            if (localeNum)
                value = localeNum;
            if (idx === 0 || (idx > -1 && idx === value2.length - 1)) {
                temp = ej.parseFloat(value2, 10, locale);
                if (temp) {
                    decPlaces = value2.indexOf(xlObj._decimalSeparator) > -1 ? xlObj._decimalCnt(temp) : 0;
                    decPlaces = decimalplcs > -1 ? decimalplcs : decPlaces;
                    return { type: ctype.Currency, value: temp, value2: value2, formatStr: xlObj._getFormatString(ctype.Currency, decPlaces), decimalPlaces: decPlaces, align: rAlign };
                }
            }
            if (value2.indexOf(xlObj._percentSymbol) > -1) {
                temp = $.trim(value2).replace(xlObj._percentSymbol, "");
                if (xlObj.isNumber(temp)) {
                    decPlaces = value2.indexOf(xlObj._decimalSeparator) > -1 ? xlObj._decimalCnt(temp) : 0;
                    decPlaces = decimalplcs > -1 ? decimalplcs : decPlaces;
                    return { type: ctype.Percentage, value: Number(temp), value2: value2, formatStr: xlObj._getFormatString(ctype.Percentage, decPlaces), decimalPlaces: decPlaces, align: rAlign };
                }
            }
            if (value2.indexOf(xlObj._decimalSeparator) > -1 && regExp.test(value2)) {
                temp = ej.parseFloat(value2, 10, locale);
                if (temp) {
                    decPlaces = value2.substr(value2.indexOf(xlObj._decimalSeparator) + 1).length;
                    if (decPlaces > 2)
                        decPlaces = 2;
                    value2 = ej.format(temp, "N" + decPlaces, locale);
                    decPlaces = decimalplcs > -1 ? decimalplcs : decPlaces;
                    return { type: ctype.Number, value: temp, value2: value2, formatStr: xlObj._getFormatString(ctype.Number, decPlaces), decimalPlaces: decPlaces, thousandSeparator: this.XLObj.isUndefined(isThouSep) ? true : isThouSep };
                }
            }
            if (value2.indexOf(tSep) > -1 && (cellType != "shortdate" && cellType != "date" && cellType != "time" && cellType != "longdate")) {
                if (regExp.test(value2)) {
                    temp = ej.parseInt(value2, 10, locale);
                    if (temp) {
                        decPlaces = 0;
                        value2 = ej.format(temp, "N" + decPlaces, locale);
                        decPlaces = decimalplcs > -1 ? decimalplcs : decPlaces;
                        return { type: ctype.Number, value: temp, value2: value2, formatStr: xlObj._getFormatString(ctype.Number, decPlaces), decimalPlaces: decPlaces, thousandSeparator: this.XLObj.isUndefined(isThouSep) ? true : isThouSep };
                    }
                }
            }
            patrns = prefCul.calendar.patterns
            isRExp = true, regExp = prefCul.calendar._parseRegExp;
            for (prop in patrns) {
                if (regExp && patrns[prop] in regExp)
                    temp = new RegExp(regExp[patrns[prop]].regExp).exec(value2);
                else {
                    isRExp = false;
                    temp = ej.parseDate(value2, patrns[prop], locale);
                }
                if (temp) {
                    if (!isRExp)
                        isRExp = true;
                    if (prop == "d") {
                        if (parseInt(temp[1]) > 12) {
                            temp = null;
                            continue;
                        }
                    }
                    break;
                }
            }
            if (temp) {
                if (isRExp)
                    temp = ej.parseDate(value2, patrns[prop], locale);
                if (temp) {
                    if (prop === "T" || prop === "t" || xlObj.XLFormat._customFormatSpecifierType[prop] === ctype.Time) {
                        temp.setYear(1990);
                        temp.setMonth(0);
                        temp.setDate(1);
                        type = ctype.Time;
                    }                    
                    else if (prop === "d")
                        type = ctype.ShortDate;
                    else if (prop === "D")
                        type = ctype.LongDate;
                    else
                        type = ctype.Date;
                    formatStr = "{0:" + patrns[prop] + "}";
                    value2 = xlObj.XLFormat._format(temp, { type: type, formatStr: formatStr });
                    return { type: type, value: temp, value2: value2, formatStr: formatStr, align: rAlign };  
                }
            }
            if (value2.toLowerCase() === "true" || value2.toLowerCase() === "false")
                value = value2 = value2.toUpperCase();
            return { type: type, value: value, value2: value2 };
        },

        updateCellWithContainer: function (data, range, sheetIdx, skipHiddenRow) {
            var xlObj = this.XLObj;
            if (xlObj.model.isReadOnly)
                return;
            var actCell, colIdx, rowIdx, cellData, cellIdx, cells, len, i = 0, j = 0,
                sheetIdx = xlObj._getSheetIndex(sheetIdx), range = range ? range : xlObj.getSheet(sheetIdx).selectedRange;
            cells = xlObj._getSelectedRange({ rowIndex: range[0], colIndex: range[1] }, { rowIndex: range[2], colIndex: range[3] });
            len = cells.length;
            while (i < len) {
                cellIdx = cells[i];
                rowIdx = cellIdx.rowIndex;
                if (!skipHiddenRow || !xlObj._isHiddenRow(rowIdx)) {
                    colIdx = cellIdx.colIndex;
                    cellData = data[j];
                    actCell = xlObj.getCell(rowIdx, colIdx, sheetIdx);                                         
                    this._updateDataContainer(cellIdx, { dataObj: cellData });
                    this._refreshCalcEngine(rowIdx, colIdx, xlObj.isFormula(cellData.value), cellData.value);
                    if (actCell && cellData.format)
                        xlObj.addClass(actCell[0], cellData.format);
                    if (actCell && cellData.hyperlink)
                        actCell.html(ej.buildTag('a.e-hyperlinks', cellData.value2, '', "cellAdr" in cellData.hyperlink ? { href: '#' } : { href: cellData.hyperlink.webAdr, target: '_blank' }));
                    if (cellData.comment)
                        xlObj.XLComment.setComment([rowIdx, colIdx, rowIdx, colIdx], null, false);
                    if (cellData.border)
                        xlObj.XLFormat.applyBorder(xlObj.XLFormat.getBorderFromHashCode(cellData.border), xlObj._getAlphaRange(sheetIdx, rowIdx, colIdx, rowIdx, colIdx));
                    if (actCell) {
                        if (cellData.rule && cellData.rule.isApply)
                            xlObj.addClass(actCell[0], 'e-hlcell');
                        else
                            xlObj._removeClass(actCell[0], 'e-hlcell');
                    }
                    j++;
                }
                i++;
            }
            if (xlObj.model.allowConditionalFormats)
                xlObj.XLCFormat.refreshCFormat(range);
        },

        _refreshCellAlignment: function (options) {
            options = options || {};
            var prop, skipCell, align = ej.Spreadsheet.Align, xlObj = this.XLObj, rowIdx = options.cellIdx.rowIndex, colIdx = options.cellIdx.colIndex, isMergeCell = this.getPropertyValue(rowIdx, colIdx, "merge");
            if (!(align in options)) {
                options.value = ej.isNullOrUndefined(options.value) ? this.getPropertyValue(rowIdx, colIdx, "value") : options.value;
                if (xlObj.isFormula(options.value))
                    options.value = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "calcValue");
                options.type = options.type ? options.type : this.getPropertyValue(rowIdx, colIdx, "type");
                if ((xlObj.isNumber(options.value) || typeof options.value === "object" || options.type === "shortdate") && options.type !== ej.Spreadsheet.CellType.Text && !(isMergeCell && isMergeCell.isCenterAlign))
                    options.align = align.Right;
                else if (xlObj._isBool(options.value) || (isMergeCell && isMergeCell.isCenterAlign))
                    options.align = align.Center;
                else
                    options.align = align.Left;
            }
            prop = this.getPropertyValue(rowIdx, colIdx, "align");
            if (xlObj._isInitLoad && !xlObj.isImport)
                skipCell = true;
            if (!options.align || (prop && prop != options.align))
                xlObj.clearRangeData([rowIdx, colIdx, rowIdx, colIdx], ["align"], "", "", "", skipCell);
            if (options.align)
                this._updateDataContainer(options.cellIdx, { dataObj: { align: options.align }, skipCell: skipCell , sheetIdx:options.sheetIdx});
        },

        _editingHandler: function (e) {
			if($(e.target).parents(".e-backstagecontent").length)
				return;
			var text, isRowVisible, xlObj = this.XLObj, sheetIdx, sheet, $trgt, readOnlyCells, sheetDt, cellObj, rIdx, cIdx, selRowIdx, rowIdx, colIdx,
                cName, i, j, len, m, n, rLen, cFormatStr, aRange, regxFormat, cFormatRule, selected, details, cell, mergeWrap, cellobjval, hasMergeIdx;
            if(e.keyCode === 53 && e.shiftKey) {
				text = this._editElem.text();
				percentCount = text.split("%");
				if(text.split("%").length == 2) {
					if(this._cursorPosn - text.indexOf("%") === -1) {
						this._editElem.setCursorPosition((xlObj._browserDetails.version === "8.0") ? document.selection.anchorOffset + 1 : window.getSelection().anchorOffset + 1);
						e.preventDefault();
						this._cursorPosn = -1;
						return;
					}
				}					
			}
			if ((e.keyCode === 61 || (!e.shiftKey && e.keyCode === 32) || (e.keyCode >= 48 && e.keyCode <= 59) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 111) || (e.keyCode === 173) || (e.keyCode >= 186 && e.keyCode <= 192) || (e.keyCode >= 219 && e.keyCode <= 222)) && !e.ctrlKey && !e.altKey) {
                sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), $trgt = xlObj.getCell(sheet._activeCell.rowIndex, sheet._activeCell.colIndex);
                if (!this._isEdit && (!xlObj._hasClass($trgt, "e-readonly") && !xlObj._hasClass($trgt, "e-cellreadonly"))) {
                    xlObj.element.find(".e-cdata").length && xlObj.element.find(".e-cutright, .e-cutbottom").removeClass("e-cutright e-cutbottom");                    
                    xlObj.XLCellNav._navToCell(sheet._activeCell.rowIndex, sheet._activeCell.colIndex);
                    hasMergeIdx = xlObj.XLEdit.getPropertyValue(sheet._activeCell.rowIndex, sheet._activeCell.colIndex, "mergeIdx");
                    xlObj._intrnlReq = true;
                    this.editCell(hasMergeIdx ? hasMergeIdx.rowIndex : sheet._activeCell.rowIndex, hasMergeIdx ? hasMergeIdx.colIndex : sheet._activeCell.colIndex, false);
                    xlObj._intrnlReq = false;
                }
				this._cursorPosn++;
            }
            else if (e.keyCode === 113 && !e.shiftKey && !e.ctrlKey) { //F2            
                sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), $trgt = xlObj.getCell(sheet._activeCell.rowIndex, sheet._activeCell.colIndex), this._isFEdit = true;
                if (!this._isEdit && (!xlObj._hasClass($trgt, "e-readonly") && !xlObj._hasClass($trgt, "e-cellreadonly"))) {
                    xlObj.element.find(".e-cdata").length && xlObj.element.find(".e-cutright, .e-cutbottom").removeClass("e-cutright e-cutbottom");
                    xlObj.XLCellNav._navToCell(sheet._activeCell.rowIndex, sheet._activeCell.colIndex);
                    hasMergeIdx = xlObj.XLEdit.getPropertyValue(sheet._activeCell.rowIndex, sheet._activeCell.colIndex, "mergeIdx");
                    xlObj._intrnlReq = true;
                    this.editCell(hasMergeIdx ? hasMergeIdx.rowIndex : sheet._activeCell.rowIndex, hasMergeIdx ? hasMergeIdx.colIndex : sheet._activeCell.colIndex, true);
                    xlObj._intrnlReq = false;
                }
				this._cursorPosn++;
            }
            else if (e.keyCode === 27 && this._isEdit) { //escape                
                sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), rIdx = sheet._activeCell.rowIndex, cIdx = sheet._activeCell.colIndex, $trgt = xlObj.getCell(rIdx, cIdx), sheetDt = xlObj._dataContainer.sheets[sheetIdx];
                if (xlObj.XLEdit.getPropertyValue(rIdx, cIdx, 'wrap') && xlObj.XLEdit.getPropertyValue(rIdx, cIdx, 'merge')) {
                    cell = xlObj.getCell(rIdx, cIdx, sheetIdx);
                    mergeWrap = cell.find('#' + xlObj._id + '_Merge')[0];
                }
                cellObj = rIdx in sheetDt && cIdx in sheetDt[rIdx] ? sheetDt[rIdx][cIdx] : cellObj;
                cellobjval = cellObj ? (typeof cellObj["value2"] === "string") ? cellObj["value2"] : xlObj._dataContainer.sharedData[cellObj["value"]] : "";
                xlObj.isFormula(cellobjval) && (cellobjval = this.getPropertyValue(rIdx, cIdx, "value2"));
                xlObj.element.find("#" + xlObj._id + "_Edit").hide();
                isRowVisible=xlObj._isRowViewable(sheetIdx,rIdx);
                if (isRowVisible) {
                    mergeWrap ? (mergeWrap.innerHTML = cellobjval) : this._refreshTextNode($trgt[0], cellobjval);
                    xlObj.setSheetFocus();
                    xlObj._setRowHdrHeight(sheetIdx, sheet._selectedCells[0].rowIndex);
                }
                if (xlObj.model.allowFormulaBar)
                    xlObj.updateFormulaBar();
                if (this._isFormulaEdit)
                    $("#" + xlObj._id + "_AutoComplete").data("ejAutocomplete").suggestionList.hide();
                this._isEdit = this._isFormulaEdit = this._isFBarFocused = false;
                xlObj._getContent(sheetIdx).find("td[class *='border']").removeClass(xlObj._formulaBorder.join(" ").replace(/,/g, " ") + " " + xlObj._ctrlFormulaBorder.join(" ").replace(/,/g, " "));
                if(isRowVisible){
                    if (xlObj.model.allowComments && $trgt.hasClass("e-commentcell"))
                        xlObj.XLComment._visibleCmntCnt($trgt, true);
                if(xlObj.model.allowAutoFill)
                    xlObj.XLDragFill.positionAutoFillElement();
                $trgt.removeClass("e-editedcell e-msie-edit");
            }
                xlObj.model.showRibbon && xlObj.XLRibbon._enableRibbonIcons();
				xlObj._getContent(xlObj.getActiveSheetIndex()).find(".e-error").remove();
                if(!ej.isNullOrUndefined(xlObj.XLCellNav)) xlObj.XLCellNav._isNavigate = true;
            }
            else if (e.keyCode === 46) { //delete   
                if (!this._isEdit) {
					if (xlObj._preventctrlkey) {
						xlObj._showAlertDlg("Alert", "CtrlKeyErrorAlert", "CtrlKeyErrorAction", 450);
						return;
					}
                    sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), $trgt = xlObj.getCell(sheet._activeCell.rowIndex, sheet._activeCell.colIndex);
                    regxFormat = new RegExp("\\b" + "e-format" + ".*?\\b", "g"), cFormatRule;
                    selected = sheet._selectedCells, text = xlObj.getRangeData({ range: [selected[0].rowIndex, selected[0].colIndex, selected[selected.length - 1].rowIndex, selected[selected.length - 1].colIndex] });
                    if (xlObj.model.allowLockCell && sheet.isSheetProtected) {
                        if (xlObj._isPropExists([sheet.selectedRange], "isLocked", sheetIdx))
                            return;
                    }
                    if (xlObj._isPropExists([sheet.selectedRange], "isReadOnly", sheetIdx))
                        return;          
                    if (!this._isEdit) {
                        xlObj.element.find(".e-cdata").length && xlObj.element.find(".e-cutright, .e-cutbottom").removeClass("e-cutright e-cutbottom");
                        var tblMgr = xlObj.model.sheets[sheetIdx].tableManager, tblObj, tblRange, tblCells, objKeys = xlObj.getObjectKeys(tblMgr);
                        for (m = 0, rLen = xlObj.getObjectLength(tblMgr) ; m < rLen; m++) {
                            tblRange = tblMgr[objKeys[m]].range;
                            if (xlObj.XLClipboard._compareRange([selected[0].rowIndex, selected[0].colIndex, selected[selected.length - 1].rowIndex, selected[selected.length - 1].colIndex], tblRange)) {
                                aRange = xlObj._getAlphaRange(sheetIdx, tblRange[0], tblRange[1], tblRange[2], tblRange[3]);
                                xlObj.clearAll(aRange);
                                return;
                            }
                        }
                        if (!xlObj._hasClass($trgt, "e-readonly")) // need to remove e-readonly
                            xlObj.clearRangeData(null, ["value", "value2", "hyperlink"]);
                            selRowIdx = selected[0].rowIndex;
                        for (i = 0, len = selected.length; i < len; i++) {
                            rowIdx = selected[i].rowIndex;
                            colIdx = selected[i].colIndex;
                            xlObj._textClip(rowIdx, colIdx, "delete");
                            if (!this.getPropertyValue(rowIdx, colIdx, "isReadOnly")) {
                                if (xlObj.model.allowFormulaBar)
                                    xlObj._getInputBox().val('');
                                cFormatRule = this.getPropertyValue(rowIdx, colIdx, "cFormatRule");
                                if (xlObj.model.allowConditionalFormats && cFormatRule && cFormatRule.length) {
                                    for (j = 0, rLen = cFormatRule.length; j < rLen; j++) {
                                        cFormatStr = cFormatRule[j].split("_");
                                        xlObj.XLCFormat._cFormat(cFormatStr[0], cFormatStr[2], cFormatStr[3], cFormatStr[4], cFormatStr[5], cFormatStr[6]);
                                    }
                                }
								if(selRowIdx !== rowIdx){
									xlObj._setRowHdrHeight(sheetIdx, rowIdx);
									selRowIdx++;
								}
                            }
                        }
                        xlObj.XLSelection._refreshBorder();
                    }
                     details = { sheetIndex: sheetIdx, range: [selected[0].rowIndex, selected[0].colIndex, selected[selected.length - 1].rowIndex, selected[selected.length - 1].colIndex], bData: text, reqType: "clear-content" };
                     xlObj._completeAction(details);
                     xlObj._trigActionComplete(details);
                }
                else {
                    if (xlObj._ctrlKeyCount > 0) {
                        xlObj._ctrlKeyCount = 0;
                        xlObj._formulaRange = [];
                        xlObj.XLSelection._clearBorder(xlObj._formulaBorder.join(" ").replace(/,/g, " ") + " " + xlObj._ctrlFormulaBorder.join(" ").replace(/,/g, " "));
                    }
                }
            }
            else if (!e.ctrlKey && !e.shiftKey && e.keyCode === 8) { //backspace
                sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), $trgt = xlObj.getCell(sheet._activeCell.rowIndex, sheet._activeCell.colIndex);
                if (!this._isEdit && (!xlObj._hasClass($trgt, "e-readonly") && !xlObj._hasClass($trgt, "e-cellreadonly"))) {
                    xlObj.element.find(".e-cdata").length && xlObj.element.find(".e-cutright, .e-cutbottom").removeClass("e-cutright e-cutbottom");
                    $trgt = xlObj.getCell(sheet._activeCell.rowIndex, sheet._activeCell.colIndex);
                    hasMergeIdx = xlObj.XLEdit.getPropertyValue(sheet._activeCell.rowIndex, sheet._activeCell.colIndex, "mergeIdx");
                    xlObj._intrnlReq = true;
                    this.editCell(hasMergeIdx ? hasMergeIdx.rowIndex : sheet._activeCell.rowIndex, hasMergeIdx ? hasMergeIdx.colIndex : sheet._activeCell.colIndex, false);
                    xlObj._intrnlReq = false;
                    xlObj._setRowHdrHeight(sheetIdx, sheet._activeCell.rowIndex);
                    if (xlObj.model.allowFormulaBar)
                    xlObj._getInputBox().val("");
                }
            }
            else if ((((e.keyCode === 13 && !e.altKey) || e.keyCode === 9)) && this._isEdit && xlObj.model.allowKeyboardNavigation && !xlObj.XLCellNav._isNavigate && !this._isFormulaEdit) { //enter  
                e.preventDefault();
                if(!ej.isNullOrUndefined(xlObj.XLCellNav)) xlObj.XLCellNav._isNavigate = true;
            }
            else if ((e.keyCode === 13 && e.altKey) && this._isEdit) { //alt + enter  
                e.preventDefault();
                var editElem = xlObj.element.find("#" + xlObj._id + "_Edit");
                editElem.focus();
                editElem.altEnter();
            }
        },

        _focusElements: function (cell) {
            $(cell).not(":hidden").focus().setInputPos($(cell).text().length);
        },

        _updateUsedRange: function (rowIdx, colIdx, sheetIdx) {
            var xlObj = this.XLObj, usedRange = xlObj.getSheet(sheetIdx ? sheetIdx : xlObj.getActiveSheetIndex()).usedRange;
            if(usedRange.rowIndex < rowIdx)
                usedRange.rowIndex = rowIdx;
            if(usedRange.colIndex < colIdx)
                usedRange.colIndex = colIdx;
        },

        _updateDataContainer: function (cellIdx, options) {
            var i, j, k, $cell, cell, mergeWrap, mergeWrapval, newText, ctype, atype, colObj, index, data, arr, cellData, colIdx, rowIdx, isDate, isBool, cellObj, id,
                innerTag, container, sheetData, rowData, prefix, regx, prevVal, textNode, bool, hcode, child, format = "e-format", cellInfo,
                canRefresh = false, border = "e-border", dataObj = options.dataObj, xlObj = this.XLObj, sheetIdx = xlObj._getSheetIndex(options.sheetIdx), sheet = xlObj.getSheet(sheetIdx), sparklineId, sparklineProp;
            if (!options.skipCell && xlObj._isRowViewable(sheetIdx, cellIdx.rowIndex)) {
                $cell = xlObj.getCell(cellIdx.rowIndex, cellIdx.colIndex, sheetIdx);
                cell = $cell[0];
            }
            if (dataObj) {
                ctype = ej.Spreadsheet.CellType, atype = ej.Spreadsheet.Align, container = xlObj._dataContainer,
                colIdx = cellIdx.colIndex, rowIdx = cellIdx.rowIndex, arr = xlObj._cellProp, sheetData = container.sheets[sheetIdx];
                if (rowIdx in sheetData) {
                    rowData = sheetData[rowIdx];
                    if (colIdx in rowData)
                        colObj = rowData[colIdx];
                    else
						rowData[colIdx] = colObj = {};
                }
                else {
                    rowData = sheetData[rowIdx] = {};
					rowData[colIdx] = colObj = {};
                }
                if (cell) {
                    if (xlObj._hasClass(cell, 'e-sswraptext')) {
						xlObj._removeClass(cell, 'e-sswraptext');
						xlObj.addClass(cell, 'e-sswraptext');
					}
                    if (this.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, 'merge', sheetIdx)) {
                        mergeWrap = $cell.find('#' + xlObj._id + '_Merge')[0];
                        if (mergeWrap) {
                            textNode = mergeWrap.lastChild;
                            if (textNode) {
                                if (textNode.nodeType === 1) {
                                    xlObj._hasClass(textNode, 'e-hyperlinks') && (textNode.textContent = '');
                                    xlObj._hasClass(textNode, 'e-comment') && (textNode.lastChild.textContent = '');
                                }
                                else
                                    textNode.textContent = '';
                            }
                            else
                                mergeWrap.textContent = '';
                            mergeWrapval = mergeWrap.innerHTML;
                            $(mergeWrap).remove();
                        }
					}
				}					
                for (i in dataObj) {
                    data = dataObj[i];
					(typeof(data) === "string" && $.trim(data).length === 0) && (data = "");
                    switch (i) {
                        case arr[0]:
                        case arr[4]:
                        case arr[5]:
                        case arr[11]:
                            index = container.sharedData.indexOf(data);
                            if (index === -1) {
                                index = container.sharedData.push(data);
                                index--;
                            }
                            colObj[i] = index;
                            if (sheet._isLoaded && i === arr[0] && !xlObj._intrnlUpdate)
                                canRefresh = true;
                            break;
                        case arr[1]:
                            prevVal = this.getPropertyValue(rowIdx, colIdx, "value2", sheetIdx);
                            if (dataObj.type && dataObj.type != ctype.General && dataObj.type != ctype.Text)
                                colObj[i] = dataObj.value2;
                            else {
                                index = container.sharedData.indexOf(dataObj.value2);
                                if (index === -1) {
                                    index = container.sharedData.push(dataObj.value2);
                                    index--;
                                }
                                colObj[i] = index;
                            }
                            if (cell && !('cellType' in dataObj)) {
                                innerTag = cell.getElementsByTagName("a");
                                if (innerTag.length)
                                    this._refreshTextNode(cell, dataObj.value2);
                                else if (colObj[arr[24]] > -1) {
									cellObj = container.sheetCellType[colObj[arr[24]]], id = cellObj.id;
									if ($('#' + id).length === 0)
										return;
									if (dataObj.value2) {
										switch (cellObj.type) {
											case 'Button':
											$('#' + id).ejButton('instance').option('text', dataObj.value2);
											 break;
										}
									}
								}
								else {
									isDate = (dataObj.value2.toString().length > 7) && !isNaN(new Date(dataObj.value2).valueOf()), isBool = ['true', 'yes', 'false', 'no'].indexOf(dataObj.value2.toString().toLowerCase()) > -1;
									if (xlObj.model.allowCellType && xlObj.model.allowAutoCellType && (isDate || isBool)) {
										if (isDate) {
											xlObj.XLCellType._rangeCellTypes([{ 'settings': { 'type': 'DatePicker' }, 'range':  xlObj._getAlphaRange(sheetIdx, rowIdx, colIdx, rowIdx, colIdx) }], sheetIdx, true);
											$("#" + xlObj._dataContainer.sheetCellType[colObj[arr[24]]].id).ejDatePicker('instance').option('value', dataObj.value2);
										}
										else if (isBool) {
											xlObj.XLCellType._rangeCellTypes([{ 'settings': { 'type': 'CheckBox' }, 'range':  xlObj._getAlphaRange(sheetIdx, rowIdx, colIdx, rowIdx, colIdx) }], sheetIdx, true);
											$("#" + xlObj._dataContainer.sheetCellType[colObj[arr[24]]].id).ejCheckBox('instance').option('checked', (['true', 'yes'].indexOf(dataObj.value2.toString().toLowerCase()) > -1) ? true : false);
										}
									}
									else 
										this._skipHTML ? cell.innerHTML.concat(dataObj.value2) : this._refreshTextNode(cell, dataObj.value2);
                                }
                            }
							this._refreshCellAlignment({ cellIdx: cellIdx, value: dataObj.value, type: dataObj.type, sheetIdx:sheetIdx  });
                            if (!xlObj._isSort)
                                if (xlObj.model.allowOverflow && xlObj._canOverflow) {
                                    if (prevVal || dataObj.value2) {
                                        if (ej.isNullOrUndefined(prevVal))
                                            bool = true;
                                        else {
                                            if (prevVal.length <= dataObj.value2.length)
                                                bool = true;
                                            else
                                                bool = false;
                                        }
                                        xlObj._textClip(rowIdx, colIdx, bool ? 'add' : 'delete');
                                        if (!bool && dataObj.value2.length > 0)
                                            xlObj._textClip(rowIdx, colIdx, 'add');
                                    }
                                }
                                else if (xlObj._canOverflow)
                                    xlObj.refreshOverflow([rowIdx, colIdx, rowIdx, colIdx], sheetIdx);
                            colObj["isDirty"] = true;
                            break;
                        case arr[2]:
                            colObj[i] = container.cellType.indexOf(dataObj.type);
                            break;
                        case arr[3]:
                            j = 0, k = data.length;
                            while (j < k) {
                                index = container.cFormatData.indexOf(data[j]);
                                if (index === -1) {
                                    index = container.cFormatData.push(data[j]);
                                    index--;
                                }
                                if (colObj[i]) {
                                    if (colObj[i].indexOf(index) === -1)
                                        colObj[i].push(index);
                                }
                                else
                                    colObj[i] = [index];
                                j++;
                            }
                            break;
                        case arr[6]:
                            index = container.valData.indexOf(data.customVal);
                            if (index === -1) {
                                index = container.valData.push(data.customVal);
                                index--;
                            }
                            colObj[i] = JSON.parse(JSON.stringify(data));
                            colObj[i].customVal = index;
                            break;
                        case arr[7]:
                        case arr[8]:
                            if (cell) {
                                prefix = i === arr[8] ? border : format, regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
                                cell.className = cell.className.replace(regx, "");                                                                
                                xlObj.addClass(cell, data);
                            }
                            index = container.hashCode.indexOf(data);
                            if (index === -1) {
                                index = container.hashCode.push(data);
                                index--;
                            }
                            colObj[i] = index;
                            break;
                        case arr[9]:
                        case arr[10]:
                        case arr[26]:
                        case arr[27]:
                            if (colObj[i]) {
                                if (colObj[i].indexOf(data) === -1)
                                    colObj[i].push(data);
                            }
                            else
                                colObj[i] = [data];
                            break;
                        case arr[12]:
                            colObj[i] = data;
                            if (cell) {
                                if (data === atype.Center)
                                    xlObj.addClass(cell, xlObj._cAlign);
                                else if (data === atype.Right)
                                    xlObj.addClass(cell, xlObj._rAlign);
                                else
                                    $(cell).removeClass(xlObj._rAlign + " " + xlObj._cAlign);
                            }
                            break;
                        case arr[14]:
                        case arr[16]:
                            hcode = xlObj.XLFormat.getFormatHashCode(data);
                            index = container.hashCode.indexOf(hcode);
                            if (index === -1) {
                                xlObj.XLFormat._createFormatClass(data, hcode);
                                index = container.hashCode.push(hcode);
                                index--;
                            }
                            colObj[i] = index;
                            break;
                        case arr[15]:
                        case arr[17]:
                            data = xlObj.XLFormat._getBorderHashCode(data, true);
                            index = container.hashCode.indexOf(data);
                            if (index === -1) {
                                index = container.hashCode.push(data);
                                index--;
                            }
                            colObj[i] = index;
                            break;
                        default:
                            colObj[i] = data;
                    }
                }
                this._updateUsedRange(cellIdx.rowIndex, cellIdx.colIndex, sheetIdx);
                if (canRefresh) {
                    if (xlObj.model.allowCharts)
                        xlObj.XLChart._refreshChartElements(rowIdx, colIdx, sheetIdx);
                   if(xlObj.model.allowSparkline) 
                           xlObj.XLSparkline.refreshSparkline(rowIdx, colIdx, sheetIdx);
                    if (xlObj.model.allowConditionalFormats)
                        xlObj.XLCFormat._refreshCFormatFormula(rowIdx, colIdx, sheetIdx);
                    xlObj._updateBatchDetails(rowIdx, colIdx, sheetIdx);
                    canRefresh = false;
                }
                if (cell && this.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, 'merge', sheetIdx)) {
                    var cellMerge = this.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, 'merge', sheetIdx), cellHeight = (sheet._rowHeightCollection[cellIdx.rowIndex + cellMerge.mSpan.rowSpan] - sheet._rowHeightCollection[cellIdx.rowIndex]) || Math.floor($cell.height());
                    if (xlObj._isRowViewable(sheetIdx, cellIdx.rowIndex)) {
                        newText = this.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, 'value2', sheetIdx);
						newText = newText || "";
				        this._refreshTextNode(cell);
				        mergeWrapval = (mergeWrapval) ? mergeWrapval.concat(dataObj.value2 || newText) : (dataObj.value2 || newText);
				        mergeWrap = $cell.find('#' + xlObj._id + '_Merge')[0];
				        if (!mergeWrap) {
							sparklineId = this.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, 'sparkline', sheetIdx);
							if(!xlObj._isCopyPaste && xlObj.model.allowSparkline && sparklineId) {
								sparklineId = sparklineId[0];
								sparklineProp = xlObj.getSheet(sheetIdx).shapeMngr["sparkline"][sparklineId];
								if($cell.find(".e-ss-sparkline").length) {
									$("#" + sparklineId).ejSparkline("destroy");
									xlObj.XLSparkline._wireSparklineEvents("_off");
									cell.innerHTML = "<div id =" + xlObj._id + "_Merge style = 'border :0px;overflow: hidden;max-height:" + (cellHeight - 1) + "px'>" + cell.innerHTML.concat(ej.isNullOrUndefined(mergeWrapval) ? "" : mergeWrapval) + "</div>"; //-1 to set the height less than cell height to avoid misalignment
									$("#" + sparklineId).ejSparkline(sparklineProp);
									xlObj.XLSparkline._wireSparklineEvents("_on");
								}
								else {
									cell.innerHTML = "<div id =" + xlObj._id + "_Merge style = 'border :0px;overflow: hidden;max-height:" + (cellHeight - 1) + "px'>" + cell.innerHTML.concat(ej.isNullOrUndefined(mergeWrapval) ? "" : mergeWrapval) + "</div>"; //-1 to set the height less than cell height to avoid misalignment
									if($(cell).find('svg[id *= "sparkline_svg"]').length) {
										$(cell).find('svg[id *= "sparkline_svg"]').remove();
										$("#" + sparklineId).ejSparkline(sparklineProp);
										xlObj.XLSparkline._wireSparklineEvents("_on");
									}
									else {
										cellInfo = xlObj._getCellInfo(cellIdx, sheetIdx);									
										xlObj.XLSparkline._createSparkline(sparklineProp, cellInfo, sheetIdx);
									}
								}
							}
							else
								cell.innerHTML = "<div id =" + xlObj._id + "_Merge style = 'border :0px;overflow: hidden;max-height:" + (cellHeight - 1) + "px'>" + cell.innerHTML.concat(ej.isNullOrUndefined(mergeWrapval) ? "" : mergeWrapval) + "</div>"; //-1 to set the height less than cell height to avoid misalignment
				            mergeWrap = $cell.find('#' + xlObj._id + '_Merge')[0];
				        }
				        child = mergeWrap.children;
				        if (child.length) {
							for(var i = 0;i < child.length; i++){
								if(xlObj._hasClass(mergeWrap.children[i], 'e-comment'))
									mergeWrap.children[i].lastChild.textContent = this.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, 'comment', sheetIdx).value;
								if(xlObj._hasClass(mergeWrap.children[i], 'e-hyperlinks')){
									mergeWrap.lastChild.textContent = '';
									mergeWrap.children[i].textContent = this.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, 'value2', sheetIdx);
								}
							}
				        }
				    }
				}
                if ((Object.keys ? Object.keys(colObj).length : xlObj.getObjectLength(colObj)) === 3) {
                    cellData = xlObj.getRangeData({ range: [rowIdx, colIdx, rowIdx, colIdx], property: arr.slice(0, 3) })[0];
                    if (cellData.value === "" && cellData.value2 === "" && cellData.type === ej.Spreadsheet.CellType.General)
                        xlObj.clearRangeData([rowIdx, colIdx, rowIdx, colIdx], arr.slice(0, 3));
                }
                if (sheet._isLoaded && !xlObj.isDirty && !xlObj._intrnlReq && !xlObj.isImport)
                    xlObj.isDirty = true;
            }
            else if (cell)
                this._refreshTextNode(cell);
        },

        _clearDataContainer: function (options) {
            var i, cell, rng, aTag, prop, mergeWrap, prevVal, colData, hl, canRefresh, value, canClip = false, dupdetails, xlObj = this.XLObj, sheetIdx = xlObj._getSheetIndex(options.sheetIdx), arr = xlObj._cellProp,
                rowIdx = options.cellIdx.rowIndex, colIdx = options.cellIdx.colIndex, props = options.property || [], isClear = false, formattedval, dataObj,
                container = xlObj._dataContainer, sheetData = container.sheets[sheetIdx];
            if (props.length && rowIdx in sheetData && colIdx in sheetData[rowIdx]) {                
                colData = sheetData[rowIdx][colIdx], i = props.length;
                if (!options.skipCell && xlObj._isRowViewable(sheetIdx, rowIdx))
                    cell = xlObj.getCell(rowIdx, colIdx, sheetIdx);
                while (i--) {
                    value = null, canRefresh = false;
                    prop = props[i];
                    switch (prop) {
                        case arr[0]:
                            value = this.getPropertyValue(rowIdx, colIdx, prop, sheetIdx);                                                       
                            xlObj._updateBatchDetails(rowIdx, colIdx, sheetIdx);                            
                            canRefresh = true;
                            break;
                        case arr[1]:
                            prevVal = this.getPropertyValue(rowIdx, colIdx, 'value2');
                            if (cell) {
                                this._refreshTextNode(cell[0]);
                                mergeWrap = cell.find('#' + xlObj._id + '_Merge');
                                mergeWrap.length && (mergeWrap[0].innerHTML = "");
                            }
                            if (prevVal)
								canClip = true;
                            break;
                        case arr[3]:
                            value = this.getPropertyValue(rowIdx, colIdx, prop, sheetIdx);
                            if (value && cell) {
                                $(cell).removeClass("e-redft e-yellowft e-greenft e-redf e-redt");
                                cell[0].style.color = "";
                                cell[0].style.backgroundColor = "";
                                cell.removeClass("e-cformat");
                            }
                            break;
                        case arr[7]:
                        case arr[8]:
                            value = this.getPropertyValue(rowIdx, colIdx, prop, sheetIdx);
                            if (value && cell)
                                xlObj._removeClass(cell[0], value);
                            break;
						case arr[14]:
							value = this.getPropertyValue(rowIdx, colIdx, prop, sheetIdx);
							if (value && value['text-align'] && value['text-align'] === 'right' && cell)
								xlObj._removeClass(cell[0], 'e-rightalign');
							break;
                        case arr[12]:
                            value = colData[prop];
                            if (value && cell)
                                xlObj._removeClass(cell[0], value === ej.Spreadsheet.Align.Center ? xlObj._cAlign : xlObj._rAlign);
                            break;
                        case arr[13]:
							value = colData[prop];
							if(value && cell){
							    hl = cell[0].lastChild.textContent;
							    if (options.status === "clear-content") {
							        cell[0].lastChild.textContent = "";
							        break;
							    }
							    else if (options.status === "clear-format") {
							        aTag = cell.find("a");
							        if (xlObj._hasClass(aTag[0], "e-hyperlinks"))
							            aTag.css({ "color": "#444445", "text-decoration": "none" }).removeClass("e-hyperlinks");
							        break;
							    }
							    cell.find("a").remove();
								if(ej.isNullOrUndefined(cell[0].lastChild))
								    cell[0].textContent = hl;
                                else
								    cell[0].lastChild.textContent = hl;
							}
							break;
                        case arr[18]:
                            value = colData[prop];
                            if (value && cell) {
                                cell.removeClass("e-filterhdr");
                                cell.find(".e-filterspan").remove();
                            }
                            break;
                        case arr[21]:
                            xlObj.XLComment && xlObj.XLComment.deleteComment([rowIdx, colIdx,rowIdx, colIdx]);
                            break;
                        case arr[5]:
                        case arr[22]:
                        case arr[23]:
							if(!isClear){
								value = this.getPropertyValue(rowIdx, colIdx);
								xlObj.isUndefined(value) && (value = "");
								dataObj = {decimalPlaces: 0, thousandSeparator: false, formatStr: "", type: "general", value: value};
								dataObj.value2 = formattedval = xlObj.XLFormat._getFormattedValue(rowIdx, colIdx, dataObj, value);
							    xlObj.XLEdit._updateDataContainer({rowIndex: rowIdx, colIndex: colIdx}, { dataObj: dataObj });
								isClear = true;
							}
							break;
                        case arr[25]:
                            delete sheetData[rowIdx][colIdx][prop];
							break;                        
                    }
                    if (options.status === "clear-content" && prop === "hyperlink") {
                        if (this.getPropertyValue(rowIdx, colIdx, prop, sheetIdx)) {
                            delete sheetData[rowIdx][colIdx][prop]["webAddr"];
                            delete sheetData[rowIdx][colIdx][prop]["cellAddr"];
                        }
                    }
                    else
                        delete sheetData[rowIdx][colIdx][prop];
					if (canRefresh) {
					    this._refreshCalcEngine(rowIdx, colIdx, false, value);
					    xlObj.model.allowCharts && xlObj.XLChart._refreshChartElements(rowIdx, colIdx, sheetIdx);
                        if(xlObj.model.allowSparkline) 
                           xlObj.XLSparkline.refreshSparkline(rowIdx, colIdx, sheetIdx);
					}
                }
				if(canClip)
					xlObj._textClip(rowIdx, colIdx, 'delete');
                if(sheetData[rowIdx] && !xlObj.getObjectLength(sheetData[rowIdx][colIdx]))
                    delete sheetData[rowIdx][colIdx];
                if (!xlObj.getObjectLength(sheetData[rowIdx]))
                    delete sheetData[rowIdx];
            }
        },

        getPropertyValue: function (rowIdx, colIdx, prop, sheetIdx) {
            var value, coldata, val, i, j, ctype, xlObj = this.XLObj, container = xlObj._dataContainer,
                sheets = container.sheets, cellProp = xlObj._cellProp;
            sheetIdx = xlObj._getSheetIndex(sheetIdx);
            if (!xlObj._intrnlUpdate)
                this._refreshContainer(rowIdx, sheetIdx);
            if (sheets[sheetIdx] && sheets[sheetIdx][rowIdx] && sheets[sheetIdx][rowIdx][colIdx]) {
                coldata = sheets[sheetIdx][rowIdx][colIdx];
                if (coldata) {
                    prop = prop || "value";
                    val = coldata[prop];
                    switch (prop) {
                        case "value":
                        case "range":
                        case "thousandSeparator":
                        case "calcValue":
                            value = container.sharedData[val];
                            break;
                        case "format":
                        case "border":
                            value = container.hashCode[val];
                            break;
                        case "value2":
                            ctype = ej.Spreadsheet.CellType;
                            value = (!xlObj.isUndefined(coldata.type) && [ctype.General, ctype.Text].indexOf(container.cellType[coldata.type]) === -1) ? coldata.value2 : container.sharedData[coldata.value2];
                            break;
                        case "type":
                            value = container.cellType[coldata.type];
                            break;
                        case "cFormatRule":
                            i = j = 0;
                            value = [];
                            if (!xlObj.isUndefined(val))
                                j = val.length;
                            while (i < j) {
                                if (coldata[prop][i] in container.cFormatData)
                                    value.push(container.cFormatData[coldata[prop][i]]);
                                i++;
                            }
                            break;
                        case "rule":
                            if (!xlObj.isUndefined(val)) {
                                value = {};
                                $.extend(true, value, val);
                                value.customVal = container.valData[value.customVal];
                            }
                            break;
                        case cellProp[14]:
                        case cellProp[15]:
                        case cellProp[16]:
                        case cellProp[17]:
                            if (!xlObj.isUndefined(val)) {
                                value = container.hashCode[val];
                                value = value.indexOf("e-format") === -1 ? xlObj.XLFormat.getBorderFromHashCode(value, true) : xlObj.XLFormat.getFormatFromHashCode(value);
                            }
                            break;
                        case "cTypeDetail":
                            var cType = xlObj._dataContainer.sheetCellType[coldata["cellType"]];
                            if (cType && cType.type == "DropDownList" && cType.selectedIndex > -1 && cType.dataSource) {
                                cType.text = cType.dataSource[cType.selectedIndex].text;
                                cType.value = cType.dataSource[cType.selectedIndex].value;
                            }
                            value = cType;
                            break;
                        case "isLocked":
                            value = val;
                            if (xlObj._isDefaultLocked)
                                value = !value;
                            break;
                        default:
                            value = val;
                    }
                }
            }
            else if (xlObj._isDefaultLocked && prop === "isLocked")
                value = !value;
            return value;
        },

        _refreshContainer: function (rowIdx, sheetIdx) {
            var blkInfo, xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx);
            if (!sheet._isImported && sheet._hasDataSrc) { // data source => data container
                xlObj._intrnlUpdate = true;
                if (xlObj.model.scrollSettings.allowVirtualScrolling) {
                    blkInfo = xlObj._getBlockInfo(rowIdx, sheetIdx, true);
                    if (sheet._virtualDataMngrLoadedBlks.indexOf(blkInfo.orgIdx) === -1) {
                        sheet._virtualDataMngrLoadedBlks.push(blkInfo.orgIdx);
                        this._ensureDataMngr(blkInfo.orgRange, sheetIdx);
                    }
                    if (sheet._virtualDataLoadedBlks.indexOf(blkInfo.orgIdx) === -1) {
                        sheet._virtualDataLoadedBlks.push(blkInfo.orgIdx);
                        xlObj._canOverflow = false;
                        xlObj._refreshDataSrc(blkInfo.orgRange, sheetIdx);
                        xlObj._refreshCellData(blkInfo.orgRange, sheetIdx);
                        xlObj._canOverflow = true;
                        xlObj._refreshOverflow(blkInfo.orgRange);
                    }
                }
                else if (!sheet._isLoaded && !sheet._isDataMoved) {
                    sheet._isDataMoved = true;
                    xlObj._canOverflow = false;
                    xlObj._refreshDataSrc(null, sheetIdx);
                    xlObj._refreshCellData(null, sheetIdx);
                    xlObj._canOverflow = true;
                    xlObj._refreshOverflow();
                }
                xlObj._intrnlUpdate = false;
            }
        },

        _ensureDataMngr: function (range, sheetIdx) {
            var len, k, skip, props, setting, promise, i = 0, xlObj = this.XLObj, settings = xlObj.getDataSettings(sheetIdx), j, queryObj;
            if (settings) {
                j = settings.length;
                while (i < j) {
                    setting = settings[i];
                    if (xlObj._inRow(setting.range, range[0]) && setting._dataManager) {
                        props = this._getQueryPropWithValues(range.slice(0), setting.range);
                        queryObj = ej.pvt.filterQueries(setting.query.queries, "onSkip");
                        skip = props.skip || 0;
                        if (setting._skip)
                            skip += setting._skip;
                        if (skip)
                            if (queryObj.length)
                                queryObj[0]["e"]["nos"] = skip;
                            else
                                setting.query.skip(skip);
                        queryObj = ej.pvt.filterQueries(setting.query.queries, "onTake");
                        if (props.take)
                            if (queryObj.length)
                                queryObj[0]["e"]["nos"] = props.take;
                            else
                                setting.query.take(props.take);
                        setting._dataManager.dataSource.async = false;
                        promise = setting._dataManager.executeQuery(setting.query);
                        promise.done(function (e) {
                            len = e.result.length;
                            if (len) {
                                k = 0;
                                while (k < len) {
                                    setting._jsonData[props.skip + k] = e.result[k];
                                    k++;
                                }
                            }
                        });
                        setting._dataManager.dataSource.async = true;
                    }
                    i++;
                }
            }
        },

        _getQueryPropWithValues: function (crange, arange) {
            var cnt, obj = {}, xlObj = this.XLObj;
            cnt = crange[0] - arange[0];
            obj.skip = cnt;
            if (arange[2] < crange[2])
                crange[2] = arange[2];
            if (xlObj._inRow(arange, crange[2])) {
                cnt = (crange[2] - crange[0]) + 1;
                obj.take = cnt;
            }
            return obj;
        },

        getPropertyValueByElem: function (elem, property, sheetIdx) {
            if (!ej.isNullOrUndefined(elem[0])) {
                var cellIndex;
                if (elem.hasClass("e-hyperlinks"))
                    cellIndex = this.XLObj._getCellIdx(elem.parent()[0]);
                else
                    cellIndex = this.XLObj._getCellIdx(elem[0]);
                return (this.getPropertyValue(cellIndex.rowIndex, cellIndex.colIndex, property, sheetIdx));
            }
        },

        _getPropWithCellIdx: function (range, prop, sheetIdx, formulaOnly) {
            var val, arr = [], minr = range[0], maxr = range[2], minc, maxc = range[3], xlObj = this.XLObj, sheetIdx = xlObj._getSheetIndex(sheetIdx),
                sheet = xlObj._dataContainer.sheets[sheetIdx];
            while (minr <= maxr) {
                if (sheet[minr]) {
                    minc = range[1];
                    while (minc <= maxc) {
                        if (sheet[minr][minc]) {
                            val = this.getPropertyValue(minr, minc, prop, sheetIdx);
                            if (!xlObj.isUndefined(val)) {
                                if (formulaOnly) {
                                    if (xlObj.isFormula(val))
                                        arr.push({ rowIdx: minr, colIdx: minc, value: val });
                                }
                                else
                                    arr.push({ rowIdx: minr, colIdx: minc, value: val });
                            }
                        }
                        minc++;
                    }
                }
                minr++;
            }
            return arr;
        },

        _refreshCalcEngine: function (rowIdx, colIdx, isFormula, val, sheetIdx) {
            var cellArgs, family, cellRef, xlObj = this.XLObj, sheetIdx = xlObj._getSheetIndex(sheetIdx),
                sheet = xlObj.getSheet(sheetIdx), calcEngine = xlObj._calcEngine;
            if (isFormula) {
                val = this._parseSheetRef(val);
                cellArgs = new ValueChangedArgs(rowIdx + 1, colIdx + 1, val);
                calcEngine.valueChanged(sheet.sheetInfo.value, cellArgs, xlObj._computeFormula ? true : (xlObj._impData ? sheet._isLoaded : true));
                xlObj._applyFormula(sheetIdx, rowIdx, colIdx);
            }
            else {
                family = CalcEngine.getSheetFamilyItem(sheet.sheetInfo.value);
                cellRef = RangeInfo.getAlphaLabel(colIdx + 1) + (rowIdx + 1);
                if (calcEngine.isSheetMember() && !ej.isNullOrUndefined(family.parentObjectToToken))
                    cellRef = family.parentObjectToToken.getItem(sheet.sheetInfo.value) + cellRef;
                if (calcEngine.getFormulaInfoTable().containsKey(cellRef)) {
                    calcEngine.getFormulaInfoTable().remove(cellRef);
                    if (calcEngine.getDependentCells().contains(cellRef))
                        calcEngine.clearFormulaDependentCells(cellRef);
                }
				calcEngine.getComputedValue().clear();
                calcEngine.refresh(cellRef);
				calcEngine.getComputedValue().clear();
                var currCell = calcEngine.getDependentCells(), idx = currCell.keys().indexOf(cellRef), depCell, range, depCellsColl;
                if (idx > -1) {
                    depCellsColl = calcEngine.getDependentCells().values()[idx];
                    for (var i = 0, len = depCellsColl.length; i < len; i++) {
                        depCell = depCellsColl[i].split("!");
                        range = xlObj.getRangeIndices(depCell[2]);
                        if (xlObj.model.allowCharts)
                            xlObj.XLChart._refreshChartElements(range[0], range[1], parseInt(depCell[1]) + 1);
                    }
                }
            }
        },

        _parseSheetRef: function (fValue, isNMValue) {
            var regx, escapeRegx = new RegExp("[!@#$%^&()+=\';,.{}|\":<>~_-]", 'g'), i = 0, xlObj = this.XLObj, sheetCount = xlObj.model.sheetCount, temp = [], sheetNames = [], sheetInfo = xlObj._getSheetNames(), exp = '(?=[\'!])(?=[^"]*(?:"[^"]*"[^"]*)*$)';

            while (i < sheetInfo.length) {
                sheetNames.push(sheetInfo[i].text);
                i++;
            }

            for (i = 0; i < sheetCount; i++) {
                if (sheetInfo[i].value !== sheetInfo[i].text) {
                    regx = new RegExp(sheetInfo[i].text.replace(escapeRegx, "\\$&") + exp, 'gi');
                    if (fValue.match(regx)) {
                        fValue = fValue.replace(regx, i + "/");
                        temp.push(i);
                    }
                    if (sheetNames.indexOf(sheetInfo[i].value) < 0 && fValue.indexOf(sheetInfo[i].value) > -1 && !isNMValue) {
                        regx = new RegExp(sheetInfo[i].value + exp, 'gi');
                        if (fValue.match(regx)) {
                            fValue = fValue.replace(regx, xlObj._newSIndex + "/");
                            temp.push(xlObj._newSIndex);
                        }
                    }
                }
            }

            i = 0;

            while (i < temp.length) {
                regx = new RegExp(temp[i] + "/" + exp, 'gi');
                fValue = fValue.replace(regx, temp[i] === xlObj._newSIndex ? xlObj._generateSheetName(xlObj._newSIndex) : sheetInfo[temp[i]].value);
                i++;
            }
            return fValue;
        },

        _refreshTextNode: function (td, value) {
            var xlObj = this.XLObj;
            value = ej.isNullOrUndefined(value) ? "" : value;
            if (!xlObj.isUndefined(td)) {
                var node = td.lastChild;
                if (node && (node.nodeType === 3 || (node.nodeType === 1 && node.tagName === "A")))
                    (xlObj._browserDetails.name === "msie" && xlObj._browserDetails.version === "8.0") ? (node.nodeValue = value) : (node.textContent = value);
                else
                    td.appendChild(document.createTextNode(value));
            }
        },

        _formulaSelect: function (args) {
            var value, text = value = args.text;
            if (!this.XLEdit._isNamedRange(value) && !(text.slice(1) == "TRUE" || text.slice(1) == "FALSE"))
                text += "(";
            this.XLEdit._editElem.text(text);
            if (this.model.allowFormulaBar)
                this._getInputBox().val(text);
            this.XLEdit._editElem.focusEnd();
            this._isFormulaSuggestion = false;
            this.XLCellNav._canKeyBoardNavigate = false;
        },

        _isNamedRange: function(value) {
            var nameMngr = this.XLObj.model.nameManager, i = nameMngr.length;
            value = value.slice(1);
            if (i) {
                while (i--) {
                    if (nameMngr[i].name.toUpperCase() === value.toUpperCase())
                        return true;
                }
            }
            return false;
        },

        _formulaBoxInputChange: function (e) {
            var sheetIdx = this.getActiveSheetIndex(), acell = this.getSheet(sheetIdx)._activeCell, hasMergeIdx;
            var ielem = this.element.find("#"+this._id+"_Edit");
            this.XLEdit._isFormulaEdit = !e.target.value.indexOf("=");
            this.XLEdit._isFormulaEdit && this.XLEdit._processFormulaEditRange(e.target.value, true);
            if (!this.XLEdit._isEdit) {
                this.XLCellNav._navToCell(acell.rowIndex, acell.colIndex);
                hasMergeIdx = this.XLEdit.getPropertyValue(acell.rowIndex, acell.colIndex, "mergeIdx");
                this._intrnlReq = true;
                this.XLEdit.editCell(hasMergeIdx ? hasMergeIdx.rowIndex : acell.rowIndex, hasMergeIdx ? hasMergeIdx.colIndex : acell.colIndex, true);
                this._intrnlReq = false;
                ielem = this.element.find("#" + this._id + "_Edit");
            }
            ielem.text(e.target.value);
            e.target.focus();
            this.XLEdit._isCellEdit = false;
        },

        _formulaSuggestionStatus: function (args) {
            this._isFormulaSuggestion = args.type === "open";
        },

        _updateFormulaCellRange: function (val, ctrlKey) {
            var idx, xlObj = this.XLObj, ielem = xlObj.element.find("#" + xlObj._id + "_Edit").not(":hidden"), otext, lastChar;
            if (!ielem.length && this._isFormulaEdit) {
                ielem = xlObj.element.find("#" + xlObj._id + "_Edit");
                val = xlObj.getSheet().sheetInfo.text + "!" + val;
            }
            otext = ielem.text();
            lastChar = otext[otext.length - 1];
            if (ctrlKey && this._validCharacters.indexOf(lastChar) === -1)
                otext = otext + ",";
            else {
                idx = this._getCharPosition(otext);
                if (idx > -1)
                    otext = otext.substr(0, [idx + 1]);
            }
            val = otext + val;
            ielem.text(val);
            this._editElem.focusEnd();
            if(xlObj.model.allowFormulaBar)
            xlObj._getInputBox().val(val);
        },

        _getCharPosition: function (val) {
            var len = val.length;
            while (len--) {
                if (this._validCharacters.indexOf(val[len]) > -1)
                    return len;
            }
            return -1;
        },

        _processFormulaEditRange: function (val, isInputBox) {
            var str, lastChar, i = 0, xlObj = this.XLObj, parsedVal = xlObj.XLDragFill._parseFormula(val), len = parsedVal.length;
            xlObj._ctrlKeyCount = 0;
            xlObj._formulaRange = [];
            xlObj.XLSelection._clearBorder(xlObj._arrayAsString(xlObj._ctrlFormulaBorder.concat(xlObj._formulaBorder)));
            while (i < len) {
                str = parsedVal[i];
                if (this._invalidOperators.indexOf(str) > -1)
                    break;
                if (xlObj._isCellReference(str)) {
                    str = str.replace(/\$/g, "");
                    if (parsedVal[i + 1] === ":") {
                        i++;
                        if (xlObj._isCellReference(parsedVal[i + 1])) {
                            str = str + ":" + parsedVal[i + 1];
                            i++;
                        }
                    }
                    this._updateFormulaEditRange(str, xlObj._ctrlKeyCount)
                    xlObj._ctrlKeyCount++;
                }
                i++;
            }
            lastChar = val.charAt(val.length - 1);
            if (lastChar === "(" && val.split("(").length === 2) {
                xlObj._isFormulaSuggestion = false;
                if (xlObj.model.allowFormulaBar)
                    xlObj._getInputBox().val(val);
                isInputBox ? $("#" + xlObj._id + "_inputbox_suggestion").hide() : xlObj._getFormulaSuggElem().hide();
            }
            else if (lastChar === ")" && xlObj.isFormula(val)) {
                xlObj.XLEdit._isFormulaEdit = false;
                xlObj._formulaRange = [];
                xlObj._ctrlKeyCount = 0;
            }
            if (lastChar === ":") {
                xlObj._shiftKeyEnabled = true;
                xlObj._ctrlKeyCount--;
            }
            else if (this._validOperators.indexOf(lastChar) > -1) {
                xlObj._dStartCell = xlObj.getSheet(xlObj.getActiveSheetIndex())._activeCell;
                xlObj._shiftKeyEnabled = false;
            }
        },

        _updateFormulaEditRange: function (str, i) {
            var xlObj = this.XLObj, indices = xlObj.getRangeIndices(str);
            xlObj._formulaRange[i] = str;
            xlObj._dStartCell = { rowIndex: indices[0], colIndex: indices[1] };
            xlObj._dEndCell = { rowIndex: indices[2], colIndex: indices[3] };
            xlObj.XLSelection._focusBorder(xlObj._dStartCell, xlObj._dEndCell, xlObj._formulaBorder[i % 6]);
        },

        calcOption: function (isAutomatic) {
            var xlObj = this.XLObj;
			if(xlObj.model.isReadOnly)
			    return;
			var calcObj, range, aIdx = xlObj.getActiveSheetIndex(), i;
            for (var i = 1, len = xlObj._sheets.length; i < len; i++) {
                calcObj = xlObj._calcEngine;
                if (isAutomatic) {
                    calcObj.setCalculatingSuspended(false);
                    range = xlObj.getSheet(i).usedRange;
                    xlObj.setActiveSheetIndex(i);
                    calcObj.grid = xlObj.model.sheets[i].sheetInfo.value;
                    calcObj.refreshRange(RangeInfo.cells(1, 1, range.rowIndex + 1, range.colIndex + 1));
                }
                else
                    calcObj.setCalculatingSuspended(true);
            }
            xlObj.setActiveSheetIndex(aIdx);
        },

        calcNow: function (sheetIdx) {
            var xlObj = this.XLObj;
			if(xlObj.model.isReadOnly)
			    return;
			var i = 1, calcObj, range, len = xlObj._sheets.length, aIdx = xlObj.getActiveSheetIndex(), details;
            if (sheetIdx) {
                i = sheetIdx;
                len = sheetIdx + 1;
            }
            while (i < len) {
                calcObj = xlObj._calcEngine;
                calcObj.setCalculatingSuspended(false);
                range = xlObj.getSheet(i).usedRange;
                xlObj.setActiveSheetIndex(i);
                calcObj.grid = xlObj.model.sheets[i].sheetInfo.value;
                calcObj.refreshRange(RangeInfo.cells(1, 1, range.rowIndex + 1, range.colIndex + 1));
                calcObj.setCalculatingSuspended(true);
                i++;
            }
            xlObj.setActiveSheetIndex(aIdx);
            details = { sheetIndex: aIdx, reqType: "calc-now" };
            xlObj._completeAction(details);
            xlObj._trigActionComplete(details);
        },

        _rangeHasProperty: function (range, property, rDataColl) {
            if (range)
                rDataColl = this.XLObj.getRangeData({ range: range, property: [property] });
            var i = 0, len = rDataColl.length;
            while (i < len) {
                if (!this.XLObj.isUndefined(rDataColl[i][property]))
                    return true;
                i++;
            }
        },

        saveEditingValue: function () {
        var xlObj = this.XLObj;
		if(xlObj.model.isReadOnly)
		    return;
		var i, j, sheet, conSheet, sheetCln, rowIdx, colIdx, len, value, rowCln, editedValue = [], sheets = {}, colCln, rLen, cLen, container = xlObj._dataContainer, sheetIdx;
        sheetCln = Object.getOwnPropertyNames(container.sheets);
        sheets["EditedData"] = [];
        for (sheet = 0, len = sheetCln.length; sheet < len; sheet++) {
            conSheet = container.sheets[sheetCln[sheet]];
            rowCln = Object.getOwnPropertyNames(conSheet);
            for (i = 0, rLen = rowCln.length; i < rLen; i++) {
                rowIdx = parseInt(rowCln[i]);
                colCln = Object.getOwnPropertyNames(conSheet[rowIdx]);
                for (j = 0, cLen = colCln.length; j < cLen; j++) {
                    colIdx = parseInt(colCln[j]);
                    if (conSheet[rowIdx][colIdx]["isDirty"]) {
                        sheetIdx = parseInt(sheetCln[sheet]);
                        value = { "SheetIndex": sheetIdx, "Value": this.getPropertyValue(rowIdx, colIdx, "value2", sheetIdx), "CellIndex": { "RowIndex": rowIdx, "ColIndex": colIdx } };
                        delete conSheet[rowIdx][colIdx]["isDirty"];
                        sheets["EditedData"].push(value);
                    }
                }
            }
        }
        return sheets;
    }

       };

    $.fn.focusEnd = function () {  
        $(this).focus();
        var tmp = $('<span />').appendTo($(this)),
            node = tmp.get(0),
            range = null,
            sel = null;
        if (document.selection) {
            range = document.body.createTextRange();
            range.moveToElementText(node);
            range.select();
        } else if (window.getSelection) {
            var ele = this[0];
            range = document.createRange();
            sel = window.getSelection();
            range.setStart(ele, 1);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            ele.focus();
        }
        tmp.remove();
        return this;
    }

    $.fn.altEnter = function () {      
            var sel, node, offset, text, textBefore, textAfter, range;
            sel = window.getSelection();
            node = sel.anchorNode;
			offset = (node.nodeType === 3) ? sel.anchorOffset : node.textContent.length - 1;
            text = node.textContent;
            textBefore = text.slice(0, offset);
            textAfter = text.slice(offset) || ' ';
            node.textContent = textBefore + '\n' + textAfter;
            range = document.createRange();
			if(node.nodeType === 3) {
				range.setStart(node, offset + 1);
				range.setEnd(node, offset + 1);
			}
			else 
				$(node).setInputPos(offset);
            sel.removeAllRanges();
            sel.addRange(range);               
    }

    $.fn.setCursorPosition = function (position) {
        var node = this;
        node.focus();
        var textNode = node[0].firstChild, range = document.createRange(), sel;
        if(textNode){
			range.setStart(textNode, position);
			range.setEnd(textNode, position);
		}
        sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
   

})(jQuery, Syncfusion);