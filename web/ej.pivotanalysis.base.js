(function ($, ej, undefined) {

    ej.PivotAnalysis = {

        _initProperties: function () {
            this._colkeyvalues = [];
            this._rowKeyValues = [];
            this._colKeysCalcValues = [];
            this._rowKeysCalcValues = [];
            this._tableKeysCalcValues = [];
            this._gridMatrix = null;
            this._rowTotCalc = [];
            this._colTotCalc = [];
            this._transposeEngine = [];
            this._tRowCnt = 0;
            this._tColCnt = 0;
            this._cellType = "";
            this._valueFilterArray = ej.isNullOrUndefined(this._valueFilterArray) ? [] : this._valueFilterArray;
            this._currentFilterVal = {};
            this._fieldMembers = {};
            this._summaryTypes = [];
            this._editCellsInfo = [];
            this._locale = "en-US";
            this._valueSorting = ej.isNullOrUndefined(this._valueSorting) ? null : this._valueSorting;
            this._sort = ej.isNullOrUndefined(this._sort) ? null : this._sort;
            this._isPaging = false;
            this._colHdrLen = 1;
            this._rowHdrLen = 1;
            this._rowMembers = {};
            this._colMembers = {};
            this._calcMembers = {};
        },

        setFieldCaptions: function (dataSource) {
            $.each(dataSource.rows, function (index, value) { if (ej.isNullOrUndefined(value.fieldCaption)) value.fieldCaption = value.fieldName; });
            $.each(dataSource.columns, function (index, value) { if (ej.isNullOrUndefined(value.fieldCaption)) value.fieldCaption = value.fieldName; });
            $.each(dataSource.filters, function (index, value) { if (ej.isNullOrUndefined(value.fieldCaption)) value.fieldCaption = value.fieldName; });
            $.each(dataSource.values, function (index, value) { if (ej.isNullOrUndefined(value.fieldCaption)) value.fieldCaption = value.fieldName; });
        },

        getTreeViewData: function (dataSource) {
            var pivotFieldList = new Array(), treeViewData = new Array();
            if (dataSource.data != null) {
                for (var i = 0; i < dataSource.data.length; i++) {
                    jQuery.each(dataSource.data[i], function (fieldName, value) {
                        if ((jQuery.inArray(fieldName, pivotFieldList)) == -1)
                            pivotFieldList.push(fieldName);
                    });
                }
            }
            jQuery.each(dataSource.values, function (item, value) {
                if (value.isCalculatedField == true && (jQuery.inArray(value.fieldName, pivotFieldList)) == -1)
                    pivotFieldList.push(value.fieldName);
            });

            var multipleArrays = [dataSource.rows, dataSource.columns, dataSource.filters, dataSource.values];
            var singleArray = [].concat.apply([], multipleArrays);
            for (var i = 0; i < pivotFieldList.length; i++) {
                for (var j = 0; j < singleArray.length; j++) {
                    if ((pivotFieldList[i]["caption"] == undefined || pivotFieldList[i]["caption"] == "") && (singleArray[j].fieldName == pivotFieldList[i]))
                        pivotFieldList[i] = { name: singleArray[j].fieldName, caption: singleArray[j].fieldCaption, format: singleArray[j].format, formatString: singleArray[j].formatString, showSubTotal: !ej.isNullOrUndefined(singleArray[j].showSubTotal) ? singleArray[j].showSubTotal : true };
                }
                if (pivotFieldList[i]["caption"] == undefined || pivotFieldList[i]["caption"] == "")
                    pivotFieldList[i] = { name: pivotFieldList[i].name || pivotFieldList[i], caption: pivotFieldList[i].name || pivotFieldList[i]};
            }
            for (var t = 0; t < pivotFieldList.length; t++) {
                var checkedState = $.grep(dataSource.rows, function (item) { return item.fieldName == pivotFieldList[t].name; }).length > 0 || $.grep(dataSource.columns, function (item) { return item.fieldName == pivotFieldList[t].name; }).length > 0 || $.grep(dataSource.values, function (item) { return item.fieldName == pivotFieldList[t].name; }).length > 0 || $.grep(dataSource.filters, function (item) { return item.fieldName == pivotFieldList[t].name; }).length > 0;
                treeViewData.push({ id: pivotFieldList[t].name, name: pivotFieldList[t].name, caption: pivotFieldList[t].caption, format: pivotFieldList[t].format, formatString: pivotFieldList[t].formatString, showSubTotal: !ej.isNullOrUndefined(pivotFieldList[t].showSubTotal) ? pivotFieldList[t].showSubTotal : true, isSelected: checkedState, spriteCssClass: "" });
            }
            return treeViewData;
        },

        pivotEnginePopulate: function (model) {
            var dataSource = model.dataSource, currentObj = this, isLiteral = false;
            this._initProperties();
            if ( model.dataSource.enableAdvancedFilter && this._valueFilterArray.length == 0)
            {
                this._valueFilterArray = $.grep(dataSource.columns, function (item) { if (item.advancedFilter && item.advancedFilter.length > 0 && item.advancedFilter[0].advancedFilterType == ej.Pivot.AdvancedFilterType.ValueFilter) return item.advancedFilter; });
                var rowFilters = $.grep(dataSource.rows, function (item) { if (item.advancedFilter && item.advancedFilter.length > 0 && item.advancedFilter[0].advancedFilterType == ej.Pivot.AdvancedFilterType.ValueFilter) return item.advancedFilter; });
                if(rowFilters.length>0)
                    $.merge(this._valueFilterArray, rowFilters);
            }
            this._locale = model.locale;
            var colAxis = dataSource.columns, rowAxis = dataSource.rows, filters = dataSource.filters, calcValues = dataSource.values, colLen, jsonObj = [], pivotFieldList = [], rowLen;
            for (var lit = 0; dataSource.values.length > lit; lit++)
            {
                var formatSt = "";
                if (dataSource.values[lit].format)
                    formatSt = dataSource.values[lit].format.toLowerCase();
                if (formatSt == "string" || formatSt == "text" || formatSt == "literal") {
                    isLiteral = true;
                    break;
                }
            }
            this._editCellsInfo = [];
            if (!ej.isNullOrUndefined(model.editCellsInfo)) {
                var rowHeaders = model.editCellsInfo.rowHeader, colHeaders = model.editCellsInfo.columnHeader, values = model.editCellsInfo.JSONRecords;

                if (!ej.isNullOrUndefined(values)) {
                    for (uV = 0; uV < values.length; uV++) {
                        var fields = {};
                        if (rowAxis.length > 0)
                            fields["row"] = rowHeaders[uV].toString().split('#').splice(0, rowAxis.length).join(">#>");
                        if (colAxis.length > 0)
                            fields["column"] = colHeaders[uV].toString().split('#').splice(0, colAxis.length).join(">#>");
                        fields["value"] = colHeaders[uV].toString().split('#')[colHeaders[uV].toString().split('#').length - 1] + "#" + values[uV].Value;
                        this._editCellsInfo.push(fields);
                    }
                    for (var vC = 0; vC < calcValues.length; vC++) {
                        $.each(this._editCellsInfo, function (index, val) {
                            if (calcValues[vC].fieldName == val["value"].split('#')[0])
                                ej.PivotAnalysis._editCellsInfo[index]["value"] = vC + "#" + val["value"].split('#')[1];
                        })
                    }
                }
            }

            for (var i = 0; i < calcValues.length; i++) this._summaryTypes.push(calcValues[i].summaryType != null && calcValues[i].summaryType != undefined ? calcValues[i].summaryType : ej.PivotAnalysis.SummaryType.Sum);
            if (dataSource.data != null) {
                var list;
                for (var cnt = 0; cnt < dataSource.data.length; cnt++) {
                    list = jQuery.extend(true, {}, dataSource.data[cnt]);
                    var table = { keys: [], uniqueName: "", value: null }, row = { keys: [], uniqueName: "", value: null }, col = { keys: [], uniqueName: "", value: null }, values = { keys: [], uniqueName: "", value: null };
                    var isExcluded = false;

                    for (var i = 0; i < filters.length; i++) {
                        var val = this._getReflectedValue(list, filters[i].fieldName, null, null);
                        if (this._fieldMembers[filters[i].fieldName] == undefined || this._fieldMembers[filters[i].fieldName] == null)
                            this._fieldMembers[filters[i].fieldName] = [val];
                        else if ($.inArray(val, this._fieldMembers[filters[i].fieldName]) == -1)
                            this._fieldMembers[filters[i].fieldName].push(val);
                        if (filters[i].filterItems != null && filters[i].filterItems != undefined) {
                            if (((filters[i].filterItems.filterType == ej.PivotAnalysis.FilterType.Exclude || filters[i].filterItems.filterType == null) && $.inArray(val, filters[i].filterItems.values) >= 0) || (filters[i].filterItems.filterType == ej.PivotAnalysis.FilterType.Include && $.inArray(val, filters[i].filterItems.values) < 0)) {
                                isExcluded = true;
                                break;
                            }
                        }
                    }

                    for (var nC = 0; nC < calcValues.length; nC++) {
                        var val = "";
                        if (calcValues[nC] != undefined && calcValues[nC] != null) {
                            list[calcValues[nC].fieldName] = model.dataSource.isFormattedValues ? this._getNumber($(list).prop(calcValues[nC].fieldName), calcValues[nC].formatString) : list[calcValues[nC].fieldName];
                            val = this._getReflectedValue(list, calcValues[nC].fieldName, calcValues[nC].format, calcValues[nC].formatString);
                            if (this._fieldMembers[calcValues[nC].fieldName] == undefined || this._fieldMembers[calcValues[nC].fieldName] == null)
                                this._fieldMembers[calcValues[nC].fieldName] = [val];
                            else if ($.inArray(val, this._fieldMembers[calcValues[nC].fieldName]) == -1)
                                this._fieldMembers[calcValues[nC].fieldName].push(val);
                        }
                        var outputString = val != null ? val.toString().replace(/([AMPME~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,-.\/? ])+/g, '') : "0";
                        outputString = outputString.replace(ej.globalize.preferredCulture(this._locale).numberFormat.currency.symbol, "");
                        if ($.isNumeric(outputString) || calcValues[nC].format == "date")
                            values.keys.push((val != null ? val : 0));
                        else {
                            values.keys.push(1);
                            if (isLiteral) {
                                if (values.uniqueName == "")
                                    values.uniqueName = [];
                                if (!ej.isNullOrUndefined(calcValues[nC].format) && (calcValues[nC].format.toLowerCase() == "string" || calcValues[nC].format.toLowerCase() == "literal" || calcValues[nC].format.toLowerCase() == "text")) {
                                    values.uniqueName.push(val);
                                }
                                else
                                    values.uniqueName.push(" ");
                            }
                        }
                    }

                    for (var rC = 0; rC < rowAxis.length; rC++) {
                        var val = "";
                        if (rowAxis[rC] != undefined && rowAxis[rC] != null) {
                            val = this._getReflectedValue(list, rowAxis[rC].fieldName, !ej.isNullOrUndefined(rowAxis[rC].format) ? rowAxis[rC].format : null, (!ej.isNullOrUndefined(rowAxis[rC].format) && !ej.isNullOrUndefined(rowAxis[rC].formatString)) ? rowAxis[rC].formatString : null);
                            if (this._fieldMembers[rowAxis[rC].fieldName] == undefined || this._fieldMembers[rowAxis[rC].fieldName] == null)
                                this._fieldMembers[rowAxis[rC].fieldName] = [val];
                            else if ($.inArray(val, this._fieldMembers[rowAxis[rC].fieldName]) == -1)
                                this._fieldMembers[rowAxis[rC].fieldName].push(val);

                            // Label filter implementation
                            if (dataSource.enableAdvancedFilter && !ej.isNullOrUndefined(rowAxis[rC].advancedFilter) && rowAxis[rC].advancedFilter.length && rowAxis[rC].advancedFilter[0].advancedFilterType == ej.Pivot.AdvancedFilterType.LabelFilter) {
                                var isFiltered = this._applyLabelFilter(rowAxis[rC].advancedFilter, val);
                                if (isFiltered) {
                                    isExcluded = true;
                                    break;
                                }
                            }
                            else if (rowAxis[rC].filterItems != null && rowAxis[rC].filterItems != undefined) {
                                if (((rowAxis[rC].filterItems.filterType == ej.PivotAnalysis.FilterType.Exclude || rowAxis[rC].filterItems.filterType == null) && $.inArray(val, rowAxis[rC].filterItems.values) >= 0) || (rowAxis[rC].filterItems.filterType == ej.PivotAnalysis.FilterType.Include && $.inArray(val, rowAxis[rC].filterItems.values) < 0)) {
                                    isExcluded = true;
                                    break;
                                }
                            }
                        }
                        if (val == null || !val.toString().replace(/^\s+|\s+$/gm, ''))
                            val = "(blank)";
                        row.keys.push(val)
                        row.uniqueName += (row.uniqueName == "" ? val : (">#>" + val));
                        table.keys.push(val);
                        table.uniqueName += (table.uniqueName == "" ? val : (">#>" + val));
                    }

                    for (var cC = 0; cC < colAxis.length; cC++) {
                        var val = "";
                        if (colAxis[cC] != undefined && colAxis[cC] != null) {
                            val = this._getReflectedValue(list, colAxis[cC].fieldName, !ej.isNullOrUndefined(colAxis[cC].format) ? colAxis[cC].format : null, (!ej.isNullOrUndefined(colAxis[cC].format) && !ej.isNullOrUndefined(colAxis[cC].formatString)) ? colAxis[cC].formatString : null);
                            if (this._fieldMembers[colAxis[cC].fieldName] == undefined || this._fieldMembers[colAxis[cC].fieldName] == null)
                                this._fieldMembers[colAxis[cC].fieldName] = [val];
                            else if ($.inArray(val, this._fieldMembers[colAxis[cC].fieldName]) == -1)
                                this._fieldMembers[colAxis[cC].fieldName].push(val);

                            // Label filter implementation
                            if (dataSource.enableAdvancedFilter && !ej.isNullOrUndefined(colAxis[cC].advancedFilter) && colAxis[cC].advancedFilter.length && colAxis[cC].advancedFilter[0].advancedFilterType == ej.Pivot.AdvancedFilterType.LabelFilter) {
                                var isFiltered = this._applyLabelFilter(colAxis[cC].advancedFilter, val);
                                if (isFiltered) {
                                    isExcluded = true;
                                    break;
                                }
                            }
                            else if (colAxis[cC].filterItems != null && colAxis[cC].filterItems != undefined) {
                                if (((colAxis[cC].filterItems.filterType == ej.PivotAnalysis.FilterType.Exclude || colAxis[cC].filterItems.filterType == null) && $.inArray(val, colAxis[cC].filterItems.values) >= 0) || (colAxis[cC].filterItems.filterType == ej.PivotAnalysis.FilterType.Include && $.inArray(val, colAxis[cC].filterItems.values) < 0)) {
                                    isExcluded = true;
                                    break;
                                }
                            }
                        }
                        if (val == null || !val.toString().replace(/^\s+|\s+$/gm, ''))
                            val = "(blank)";
                        col.keys.push(val);
                        col.uniqueName += (col.uniqueName == "" ? val : (">#>" + val));
                        table.keys.push(val);
                        table.uniqueName += (table.uniqueName == "" ? val : (">#>" + val));
                    }

                    if (!isExcluded) {
                        this._isMemberExist("row", row, $.extend(true, {}, values), dataSource);
                        this._isMemberExist("column", col, $.extend(true, {}, values), dataSource);
                        if ((model.enablePaging || model.enableVirtualScrolling) && !(row.keys.length == 0 && col.keys.length == 0)) {
                            if (row.keys.length > 0 && col.keys.length > 0) {
                                for (var rCnt = 0; rCnt < row.keys.length; rCnt++) {
                                    for (var cCnt = 0; cCnt < col.keys.length; cCnt++) {
                                        if (row.keys.length == rCnt + 1 && col.keys.length == cCnt + 1)
                                            this._isMemberExist("calc", { keys: row.keys.slice(0, rCnt + 1).concat(col.keys.slice(0, cCnt + 1)), uniqueName: row.keys.slice(0, rCnt + 1).concat(col.keys.slice(0, cCnt + 1)).join('>#>'), value: null }, $.extend(true, {}, values), dataSource);
                                        else
                                            this._isMemberExist("calc", { cellType: "SubTot", keys: row.keys.slice(0, rCnt + 1).concat(col.keys.slice(0, cCnt + 1)), uniqueName: row.keys.slice(0, rCnt + 1).concat(col.keys.slice(0, cCnt + 1)).join('>#>'), value: null }, $.extend(true, {}, values), dataSource);
                                    }
                                }
                            }
                            else if (row.keys.length == 0) {
                                for (var cCnt = 0; cCnt < col.keys.length; cCnt++) {
                                    if (col.keys.length == cCnt + 1)
                                        this._isMemberExist("calc", { keys: col.keys.slice(0, cCnt + 1), uniqueName: col.keys.slice(0, cCnt + 1).join('>#>'), value: null }, $.extend(true, {}, values), dataSource);
                                    else
                                        this._isMemberExist("calc", { cellType: "SubTot", keys: col.keys.slice(0, cCnt + 1), uniqueName: col.keys.slice(0, cCnt + 1).join('>#>'), value: null }, $.extend(true, {}, values), dataSource);
                                }
                            }
                            else {
                                for (var rCnt = 0; rCnt < row.keys.length; rCnt++) {
                                    if (row.keys.length == rCnt + 1)
                                        this._isMemberExist("calc", { keys: row.keys.slice(0, rCnt + 1), uniqueName: row.keys.slice(0, rCnt + 1).join('>#>'), value: null }, $.extend(true, {}, values), dataSource);
                                    else
                                        this._isMemberExist("calc", { cellType: "SubTot", keys: row.keys.slice(0, rCnt + 1), uniqueName: row.keys.slice(0, rCnt + 1).join('>#>'), value: null }, $.extend(true, {}, values), dataSource);
                                }
                            }
                        }
                        else
                            this._isMemberExist("calc", table, $.extend(true, {}, values), dataSource);
                    }
                }
            }

            for (var i = 0; i < calcValues.length; i++) {
                var temp = $.grep(calcValues, function (value) { return (value.isCalculatedField == true) });
                if (calcValues[i].isCalculatedField && temp.length != calcValues.length) {
                    for (var j = 0; j < this._tableKeysCalcValues.length; j++) {
                        var formula = calcValues[i].formula.replace(/\s/g, "");
                        for (var k = 0; k < calcValues.length; k++) {
                            if (calcValues[k].isCalculatedField != true) {
                                var value = ej.globalize.parseFloat(this._tableKeysCalcValues[j].value.keys[k] == null ? "0" : calcValues[k].format == "date" ? this._dateToInt(this._tableKeysCalcValues[j].value.keys[k].toString()).toString() : calcValues[k].format == "time" ? this._dateToInt(new Date("1900", this._tableKeysCalcValues[j].value.keys[k].toString().split(":")[0], this._tableKeysCalcValues[j].value.keys[k].toString().split(":")[1], this._tableKeysCalcValues[j].value.keys[k].toString().split(":")[2].split(" ")[0]).toString()).toString() : this._tableKeysCalcValues[j].value.keys[k].toString(),this._locale);
                                formula = formula.replace(new RegExp(calcValues[k].fieldName, 'g'), calcValues[k].format == "percentage" && value != 0 ? (value < 0 ? "(" + value / 100 + ")" : value) : (value < 0 ? "(" + value + ")" : value));
                            }
                        }
                        if (formula.indexOf("^") > -1)
                            formula = this._powerFunction(formula);
                        var oldValue = (!isNaN(eval(formula))) && isFinite(eval(formula)) ? this._getReflectedValue({ calcField: eval(formula) }, "calcField", calcValues[i].format, calcValues[i].formatString) : dataSource.values[i].format == null ? 0 : "0";
                        var newValue = dataSource.values[i].format == null ? 0 : "0";
                        this._tableKeysCalcValues[j].value.keys[i] = this._getSummaryValue(oldValue, newValue, 1, this._summaryTypes[i], dataSource.values[i].format, dataSource.values[i].formatString);
                    }
                }
                else if (calcValues[i].isCalculatedField) {
                    var val = { keys: [], uniqueName: "", value: null };
                    for (var j = 0; j < this._tableKeysCalcValues.length; j++) {
                        for (var k = 0; k < calcValues.length && calcValues[k].isCalculatedField; k++) {
                            var formula = calcValues[k].formula.replace(/\s/g, "");
                            if (formula.indexOf("^") > -1)
                                formula = this._powerFunction(formula);
                            var oldValue = (!isNaN(eval(formula))) && isFinite(eval(formula)) ? this._getReflectedValue({ calcField: eval(formula) }, "calcField", calcValues[k].format, calcValues[k].formatString) : dataSource.values[k].format == null ? 0 : "0";
                            var newValue = dataSource.values[k].format == null ? 0 : "0";
                            val.keys.push(this._getSummaryValue(oldValue, newValue, 1, "sum", dataSource.values[k].format, dataSource.values[k].formatString));
                        }
                        this._tableKeysCalcValues[j].value = val;
                        val = { keys: [], uniqueName: "", value: null };
                    }
                }
            }
            if (rowAxis.length > 0)
                this._rowKeysCalcValues = this._sortHeaders(this._rowKeysCalcValues, rowAxis, 0);
            if (colAxis.length > 0)
                this._colKeysCalcValues = this._sortHeaders(this._colKeysCalcValues, colAxis, 0);

            this._colkeyvalues = $.extend([], this._colKeysCalcValues);
            this._rowKeyValues = $.extend([], this._rowKeysCalcValues);
            if (colAxis.length > 0)
                this._insertTotalHeader(colAxis, this._colKeysCalcValues);
            if (rowAxis.length > 0)
                this._insertTotalHeader(rowAxis, this._rowKeysCalcValues);
            else if (calcValues.length > 0) {
                if (this._rowKeysCalcValues.length > 0)
                    this._rowKeysCalcValues[0].keys[0] = "Grand Total";
                else {
                    this._rowKeysCalcValues.push({ keys: [""], value: { keys: [] } });
                    for (var i = 0; i < calcValues.length; i++) {
                        this._rowKeysCalcValues[0].value.keys.push();
                    }
                    this._rowKeysCalcValues[0].keys[0] = "Grand Total";
                }
            }
            return this._fillEngine(model);
        },

        _fillEngine: function (model) {
            if (model.enablePaging || model.enableVirtualScrolling) {
                this._isPaging = true; this._colHdrLen = 1; this._rowHdrLen = 1;
                this._controlObj._colKeysCalcValues = $.extend(true, [], this._colKeysCalcValues);
                this._controlObj._rowKeysCalcValues = $.extend(true, [], this._rowKeysCalcValues);
                this._controlObj._tableKeysCalcValues = $.extend(true, [], this._tableKeysCalcValues);
                this._cropHeaders();
                this._applyPaging();
            }
            var dataSource = model.dataSource, jsonObj = [];
            var colAxis = dataSource.columns, rowAxis = dataSource.rows, filters = dataSource.filters, calcValues = dataSource.values;
            this._tRowCnt = 0, this._tColCnt = 0;
            this._currentFilterVal = this._valueFilterArray.length > 0 ? this._valueFilterArray[0] : {};
            this._calculateValues(dataSource);
            for (var i = 0; i < this._valueFilterArray.length; i++) {
                if (this._advancedFilterInfo.length > 0) {
                    var me = this;
                    this._rowKeysCalcValues = this._filterKeyValues(this._rowKeyValues);
                    this._colKeysCalcValues = this._filterKeyValues(this._colkeyvalues);
                    this._gridMatrix = null;
                    this._colkeyvalues = $.extend([], this._colKeysCalcValues);
                    this._rowKeyValues = $.extend([], this._rowKeysCalcValues);

                    if (colAxis.length > 0)
                        this._insertTotalHeader(colAxis, this._colKeysCalcValues);
                    if (rowAxis.length > 0)
                        this._insertTotalHeader(rowAxis, this._rowKeysCalcValues);
                    else if (calcValues.length > 0)
                        this._rowKeysCalcValues[0].keys[0] = "Grand Total";
                    this._tRowCnt = 0, this._tColCnt = 0;
                    if (this._valueFilterArray.length != i + 1)
                        this._currentFilterVal = this._valueFilterArray[i + 1];
                    else
                        this._currentFilterVal = {};
                    this._calculateValues(dataSource);
                }
            }
            var isColumnEmpty = (this._colKeysCalcValues.length == 1 && this._colKeysCalcValues[0].cellType == "RGTot");
            this._colTotCalc = [], this._rowTotCalc = [], this._colKeysCalcValues = []; this._rowKeysCalcValues = []; this._tableKeysCalcValues = [];
            this._transposeEngineCreation();
            if (!ej.isNullOrUndefined(model.valueSortSettings) && !ej.isNullOrUndefined(model.valueSortSettings.sortOrder) && model.valueSortSettings.sortOrder != "none" && model.dataSource.values.length > 0 && (!ej.isNullOrUndefined(this._valueSorting) || (!ej.isNullOrUndefined(model.valueSortSettings.headerText) && model.valueSortSettings.headerText != ""))) {
                var j = 0;
                model.valueSortSettings.headerDelimiters = model.valueSortSettings.headerDelimiters == undefined ? "##" : model.valueSortSettings.headerDelimiters;
                if (ej.isNullOrUndefined(this._valueSorting)) {
                    for (var i = 0; i < this._transposeEngine.length; i++) {
                        for (var k = 0; k < model.valueSortSettings.headerText.split(model.valueSortSettings.headerDelimiters).length; k++) {
                            if (!ej.isNullOrUndefined(this._transposeEngine[i][k]) && this._transposeEngine[i][k].Value == model.valueSortSettings.headerText.split(model.valueSortSettings.headerDelimiters)[k]) {
                                j++;
                            }
                        }
                        if (j == model.valueSortSettings.headerText.split(model.valueSortSettings.headerDelimiters).length) {
                            this._valueSorting = i;
                            break;
                        }
                        j = 0;
                    }
                    this._sort = (!ej.isNullOrUndefined(model.valueSortSettings) && !ej.isNullOrUndefined(model.valueSortSettings.sortOrder)) ? model.valueSortSettings.sortOrder : this._sort;
                    if ((model.dataSource.columns.length + 1) == model.valueSortSettings.headerText.split(model.valueSortSettings.headerDelimiters).length && !ej.isNullOrUndefined(this._valueSorting))
                        this._applyValueSorting(model);
                }
                else {
                    this._applyValueSorting(model);
                }
            }
            for (var rCnt = 0; rCnt < (this._tColCnt - 1) ; rCnt++) {
                var rowLen = rowAxis.length == 0 ? 1 : (this._isPaging ? this._rowHdrLen : rowAxis.length);
                if (rCnt < rowLen) {
                    var emptyCellColSpan = (isColumnEmpty ? 1 : (this._isPaging ? this._colHdrLen : colAxis.length)) + (dataSource.values.length > 0 ? 1 : 0);
                    if (emptyCellColSpan == 0 && rowLen > 0) emptyCellColSpan = 1;
                    for (var tcnt = 0; tcnt < emptyCellColSpan ; tcnt++) {
                        if (this._gridMatrix.length > 0)
                            jsonObj.push({
                                Index: rCnt + ',' + tcnt, CSS: "none", Value: "", State: 0,
                                ColSpan: ((rCnt == 0 && tcnt == 0) ? rowLen : 1),
                                RowSpan: ((rCnt == 0 && tcnt == 0) ? (isColumnEmpty ? 1 : (this._isPaging ? this._colHdrLen : colAxis.length)) + (dataSource.values.length > 0 ? 1 : 0) : 1), Info: "", Span: "None", Expander: 0
                            });
                    }
                }
                for (var cCnt = 0; cCnt < (this._tRowCnt - 1) ; cCnt++) {
                    if (this._transposeEngine[rCnt] != undefined && this._transposeEngine[rCnt][cCnt] != undefined && !(cCnt < (isColumnEmpty ? 1 : (this._isPaging ? this._colHdrLen : colAxis.length)) + (dataSource.values.length > 0 ? 1 : 0) && rCnt < rowLen))
                        jsonObj.push(this._transposeEngine[rCnt][cCnt]);
                }
            }
            this._gridMatrix = [];
            if (dataSource.rows[0] == undefined)
                dataSource.rows.length = 0;
            return ({ json: jsonObj, pivotEngine: this._transposeEngine });
        },

        _cropHeaders: function(){
            var rowDrillHdrs = this._controlObj._drillHeaders.row, colDrillHdrs = this._controlObj._drillHeaders.column, tmpArray = [], hdrSec = 2, collapseByDefault = this._controlObj.model.enableCollapseByDefault, rowLen = this._controlObj.model.dataSource.rows.length, colLen = this._controlObj.model.dataSource.columns.length;
            do {
                var hdrCalcValues = hdrSec == 2 ? $.extend(true, [], this._rowKeysCalcValues) : $.extend(true, [], this._colKeysCalcValues);
                if (collapseByDefault || (hdrSec == 2 ? rowDrillHdrs.length > 0 : colDrillHdrs.length > 0)) {
                    var lvl = 0; lockedName = "";
                    for (var cnt = hdrCalcValues.length - 1; cnt >= 0 ; cnt--) {
                        if (!ej.isNullOrUndefined(hdrCalcValues[cnt])) {
                            if (!ej.isNullOrUndefined(hdrCalcValues[cnt].cellType) && !ej.isNullOrUndefined(hdrCalcValues[cnt].uniqueName) && (hdrCalcValues[cnt].uniqueName.indexOf(">#>") == -1 ? (hdrCalcValues[cnt].uniqueName != lockedName) : (hdrCalcValues[cnt].uniqueName.indexOf(lockedName) == -1))) {
                                lockedName = "";
                                lvl = hdrCalcValues[cnt].level;
                            }
                            if (collapseByDefault && hdrCalcValues[cnt].level == 0 && lockedName == "")
                                lvl = 0;
                            if ((!collapseByDefault ? lockedName == "" : hdrCalcValues[cnt].level == lvl) && !ej.isNullOrUndefined(hdrCalcValues[cnt].cellType) && !ej.isNullOrUndefined(hdrCalcValues[cnt].uniqueName) && (hdrSec == 2 ? rowDrillHdrs.indexOf(hdrCalcValues[cnt].uniqueName) > -1 : colDrillHdrs.indexOf(hdrCalcValues[cnt].uniqueName) > -1)) {
                                lockedName = hdrCalcValues[cnt].uniqueName;
                                lvl++;
                            }
                            var isSameName = lockedName == hdrCalcValues[cnt].uniqueName, isTot = hdrCalcValues[cnt].cellType == "RGTot", isSameLevel = hdrCalcValues[cnt].level == lvl;
                            if (collapseByDefault ? (isSameName || isTot || isSameLevel || (hdrSec == 2 ? lvl > rowLen - 2 : lvl > colLen - 2)) : (lockedName == "" || ej.isNullOrUndefined(hdrCalcValues[cnt].uniqueName) || isSameName)) {
                                if ((collapseByDefault ? (isSameLevel) : (isSameName)) && !ej.isNullOrUndefined(hdrCalcValues[cnt].keys) && hdrCalcValues[cnt].keys.length > 0 && !isTot && hdrCalcValues[cnt].uniqueName != "") {
                                    hdrCalcValues[cnt].keys[hdrCalcValues[cnt].keys.length - 1] = hdrCalcValues[cnt].keys[hdrCalcValues[cnt].keys.length - 1].replace(" Total", "");
                                    hdrCalcValues[cnt].expander = 2;
                                }
                                tmpArray.push(hdrCalcValues[cnt]);
                            }
                        }
                    }
                    hdrSec == 2 ? this._rowKeysCalcValues = $.extend(true, [], tmpArray.reverse()) : this._colKeysCalcValues = $.extend(true, [], tmpArray.reverse());
                }
                tmpArray = [];
                hdrSec--;
            } while (hdrSec > 0);
        },

        _applyPaging: function () {            
            var tmpArray = [];
            this._controlObj._seriesPageCount = this._controlObj.model.enablePaging ? this._rowKeysCalcValues.length : Math.ceil(this._rowKeysCalcValues.length / this._controlObj.model.dataSource.pagerOptions.seriesPageSize);
            this._controlObj._categPageCount = this._controlObj.model.enablePaging ? (this._colKeysCalcValues.length * (this._controlObj.model.dataSource.values.length > 0 ? this._controlObj.model.dataSource.values.length : 1)) : Math.ceil((this._colKeysCalcValues.length * (this._controlObj.model.dataSource.values.length > 0 ? this._controlObj.model.dataSource.values.length : 1)) / this._controlObj.model.dataSource.pagerOptions.categoricalPageSize);
            this._controlObj._categPageCount = this._controlObj._categPageCount == 0 ? 1 : this._controlObj._categPageCount;
            this._controlObj.model.dataSource.pagerOptions.seriesCurrentPage = (this._controlObj.model.dataSource.pagerOptions.seriesCurrentPage * this._controlObj.model.dataSource.pagerOptions.seriesPageSize) > this._rowKeysCalcValues.length ? Math.ceil(this._rowKeysCalcValues.length / this._controlObj.model.dataSource.pagerOptions.seriesPageSize) : this._controlObj.model.dataSource.pagerOptions.seriesCurrentPage;
            this._controlObj.model.dataSource.pagerOptions.categoricalCurrentPage = (this._controlObj.model.dataSource.pagerOptions.categoricalCurrentPage * this._controlObj.model.dataSource.pagerOptions.categoricalPageSize) > (this._colKeysCalcValues.length * (this._controlObj.model.dataSource.values.length > 0 ? this._controlObj.model.dataSource.values.length : 1)) ? Math.ceil((this._colKeysCalcValues.length * (this._controlObj.model.dataSource.values.length > 0 ? this._controlObj.model.dataSource.values.length : 1)) / this._controlObj.model.dataSource.pagerOptions.categoricalPageSize) : this._controlObj.model.dataSource.pagerOptions.categoricalCurrentPage;
            this._controlObj.model.dataSource.pagerOptions.categoricalCurrentPage = this._controlObj.model.dataSource.pagerOptions.categoricalCurrentPage == 0 ? 1 : this._controlObj.model.dataSource.pagerOptions.categoricalCurrentPage;
            this._controlObj._seriesCurrentPage = this._controlObj.model.dataSource.pagerOptions.seriesCurrentPage;
            this._controlObj._categCurrentPage = this._controlObj.model.dataSource.pagerOptions.categoricalCurrentPage;
            var rowStartPage = (this._controlObj.model.dataSource.pagerOptions.seriesCurrentPage * this._controlObj.model.dataSource.pagerOptions.seriesPageSize) - this._controlObj.model.dataSource.pagerOptions.seriesPageSize;
            var colStartPage = Math.ceil(((this._controlObj.model.dataSource.pagerOptions.categoricalCurrentPage * this._controlObj.model.dataSource.pagerOptions.categoricalPageSize) - this._controlObj.model.dataSource.pagerOptions.categoricalPageSize) / (this._controlObj.model.dataSource.values.length > 0 ? this._controlObj.model.dataSource.values.length : 1));
            var rowEndPage = rowStartPage + this._controlObj.model.dataSource.pagerOptions.seriesPageSize;
            var colEndPage = Math.ceil(((this._controlObj.model.dataSource.pagerOptions.categoricalCurrentPage * this._controlObj.model.dataSource.pagerOptions.categoricalPageSize)) / (this._controlObj.model.dataSource.values.length > 0 ? this._controlObj.model.dataSource.values.length : 1));
            var colStartPage = (((this._controlObj.model.dataSource.pagerOptions.categoricalCurrentPage - 1) * this._controlObj.model.dataSource.pagerOptions.categoricalPageSize) % this._controlObj.model.dataSource.values.length) > 0 ? colStartPage - 1 : colStartPage;            
            for (var i = rowStartPage; i < rowEndPage ; i++) {
                tmpArray.push(this._rowKeysCalcValues[i]);
            }
            tmpArray = this._spanCalculation(tmpArray);
            this._rowKeysCalcValues = $.extend(true, [], tmpArray);
            tmpArray = [];
            for (var i = colStartPage; i < colEndPage ; i++) {
                tmpArray.push(this._colKeysCalcValues[i]);
            }
            tmpArray = this._spanCalculation(tmpArray);
            this._colKeysCalcValues = $.extend(true, [], tmpArray);
        },

        _spanCalculation: function (croppedArray) {
            for (var aCnt = 0; aCnt < croppedArray.length; aCnt++) {
                if (croppedArray.length > 0 && !ej.isNullOrUndefined(croppedArray[aCnt]) && !ej.isNullOrUndefined(croppedArray[aCnt].uniqueName)) {
                    var hdrSplit = croppedArray[aCnt].uniqueName.split('>#>'), tmpArray = [];
                    croppedArray[aCnt].keys[croppedArray[aCnt].level] = croppedArray[aCnt].keys[0];
                    croppedArray[aCnt].span = ej.isNullOrUndefined(croppedArray[aCnt].span) ? [] : croppedArray[aCnt].span;
                    for (var i = ej.isNullOrUndefined(croppedArray[aCnt].level) ? (croppedArray[aCnt].span.length > 0 ? (croppedArray[aCnt].span.length - 2) : (croppedArray[aCnt].keys.length - 2)) : (croppedArray[aCnt].level - 1) ; i >= 0; i--) {
                        var cnt = aCnt + 1;
                        croppedArray[aCnt].keys[i] = hdrSplit[i];
                        croppedArray[aCnt].span[i] = 1;
                        do {
                            if (!ej.isNullOrUndefined(croppedArray[cnt]) && croppedArray[cnt].uniqueName.split('>#>').indexOf(hdrSplit[i]) > -1 && croppedArray[cnt].uniqueName.split('>#>').indexOf(hdrSplit[i]) < croppedArray[cnt].uniqueName.split('>#>').length - 1)
                                croppedArray[aCnt].span[i]++;
                            else
                                break;
                            cnt++;
                        } while (cnt < croppedArray.length);
                    }
                    if (!ej.isNullOrUndefined(croppedArray[aCnt].span) && croppedArray[aCnt].span.length == 0)
                        delete croppedArray[aCnt].span;
                }
            }
            var maxSpan = croppedArray.length;
            croppedArray = $.map(croppedArray, function (item, index) {
                if (!ej.isNullOrUndefined(item) && !ej.isNullOrUndefined(item.span)) {
                    for (var i = 0; i < item.span.length; i++) {
                        item.span[i] = (item.span[i] > maxSpan - index) ? (maxSpan - index) : item.span[i]
                    }
                }
                return item;
            });
            return croppedArray;
        },
       
        _applyValueSorting: function (model) {
            var value = [], summary = [], k = 0, sumIndex = 0,hText = "";
            for (var i = 0; i < this._transposeEngine.length; i++) {
                value[k] = [];
                if (ej.isNullOrUndefined(summary[sumIndex])) summary[sumIndex] = [];
                for (var j = 0; j < this._transposeEngine[i].length && this._valueSorting == Number(this._transposeEngine[i][j].Index.split(",")[0]) ; j++) {
                    if (this._transposeEngine[i][j].CSS == "colheader" || $.trim(this._transposeEngine[i][j].CSS) == "calc" || this._transposeEngine[i][j].CSS == "colheader calc" || this._transposeEngine[i][j].CSS == "summary cstot" || this._transposeEngine[i][j].CSS == "summary cstot calc" || this._transposeEngine[i][j].CSS == "summary cgtot" || this._transposeEngine[i][j].CSS == "summary cgtot calc") {
                        hText = hText == "" ? this._transposeEngine[i][j].Value : hText + model.valueSortSettings.headerDelimiters + this._transposeEngine[i][j].Value;
                    }
                    if (this._transposeEngine[model.dataSource.rows.length][j].CSS == "value") {
                        value[k].push(this._transposeEngine[i][j]);
                        sumIndex = 0;
                    }
                    if (this._transposeEngine[model.dataSource.rows.length][j].CSS == "summary value") {
                        summary[sumIndex].push(this._transposeEngine[i][j]);
                        if (value[k].length > 0) {
                            k = k + 1;
                            value[k] = [];
                        }
                        if (this._transposeEngine[0][j].CSS != "summary rgtot" && summary[sumIndex].length > 0)
                            sumIndex++;
                        if (ej.isNullOrUndefined(summary[sumIndex])) summary[sumIndex] = [];
                    }
                }
            }
            model.valueSortSettings.headerText = hText; model.valueSortSettings.sortOrder = this._sort;
            for (var k = 0; k < value.length; k++) {
                for (var i = 0; i < value[k].length; i++) {
                    for (var j = i; j < value[k].length; j++) {
                        var sort = this._sort == "descending" ? (this._getNumber(value[k][i].Value) < this._getNumber(value[k][j].Value)) : (this._getNumber(value[k][i].Value) > this._getNumber(value[k][j].Value));
                        if (sort) {
                            var temp = value[k][j];
                            value[k][j] = value[k][i];
                            value[k][i] = temp;
                        }
                    }
                }
            }
            for (var k = 0; k < value.length; k++) { if (value[k].length == 0) value.splice(k, 1); };
            var index = [];
            for (var i = 0; i < this._tRowCnt - 1; i++) {
                index[i] = {index: 0,level:-1};
            }
            var val = 0,region = [],regionS = [];
            for (var k = summary.length - 2; k >= 0 ; k--) {
                var ind = 0;
                for (var j = 0; j < summary[k].length; j++) {
                    for (var i = j; i < summary[k].length; i++) {
                        var sort = this._sort == "descending" ? (this._getNumber(summary[k][j].Value) < this._getNumber(summary[k][i].Value)) : (this._getNumber(summary[k][j].Value) > this._getNumber(summary[k][i].Value));
                        if (sort) {
                            var temp = summary[k][i];
                            summary[k][i] = summary[k][j];
                            summary[k][j] = temp;
                        }
                    }
                }
                if (val == 0) {
                    for (var j = 0; j < summary[k].length; j++) {
                        ind = ind == 0 ? (this._transposeEngine[val][Number(summary[k][j].Index.split(",")[1])].MCnt + model.dataSource.columns.length + 1) : (this._transposeEngine[val][Number(summary[k][j].Index.split(",")[1])].MCnt + ind + 1);
                        index[ind] = { index: Number(summary[k][j].Index.split(",")[1]), level: val };
                        if (region[j] == undefined)
                            region[j] = {};
                        region[j].end = Number(summary[k][j].Index.split(",")[1]); region[j].start = Number(summary[k][j].Index.split(",")[1]) - this._transposeEngine[val][Number(summary[k][j].Index.split(",")[1])].MCnt;
                    }
                }
                else {
                    var arr = [], m = 0;
                    for (var l = 0; l < region.length; l++) {
                        arr = [];
                        for (var j = 0; j < summary[k].length ; j++) {
                            if (Number(summary[k][j].Index.split(",")[1]) > region[l].start && Number(summary[k][j].Index.split(",")[1]) < region[l].end)
                                arr.push(summary[k][j]);
                        }
                        for (var j = 0; j < arr.length; j++) {
                            ind = ind == 0 ? (this._transposeEngine[val][Number(arr[j].Index.split(",")[1])].MCnt + model.dataSource.columns.length + 1) : (this._transposeEngine[val][Number(arr[j].Index.split(",")[1])].MCnt + ind + 1);
                            index[ind] = { index: Number(arr[j].Index.split(",")[1]), level: val};
                            if (regionS[m] == undefined)
                                regionS[m] = {};
                            regionS[m].end = Number(arr[j].Index.split(",")[1]); regionS[m].start = Number(arr[j].Index.split(",")[1]) - this._transposeEngine[val][Number(arr[j].Index.split(",")[1])].MCnt;
                            m++;
                        }
                        while (ind < this._tRowCnt - 2 && (index[ind].level > index[ind + 1].level))
                        {
                            ind++;
                        }
                        ind--;
                    }
                    region = jQuery.extend(true, [], regionS);
                }
                val++;
            }
            if (summary.length == 1 && summary[0].length > 0) {
                var num = model.dataSource.columns.length + 1;
                for (var i = 0; i < value[0].length; i++) {
                    index[num] = { index: Number(value[0][i].Index.split(",")[1]) };
                    num++;
                }
            }
            var cnt = model.dataSource.columns.length + 1;
            for (var l = 0; l < region.length; l++) {               
                for (var k = 0; k < value.length; k++) {
                    if (Number(value[k][0].Index.split(",")[1]) >= region[l].start && Number(value[k][0].Index.split(",")[1]) <= region[l].end) {
                        var j = 0;
                        for (var i = region[l].start; i < region[l].end; i++) {
                            index[cnt] = { index: Number(value[k][j].Index.split(",")[1])};
                            j++;
                            cnt++;
                        }
                        cnt++;
                        while (index[cnt].index != 0 && cnt <= index.length) {
                            cnt++;
                        }
                    }
                }
            }
            var arrMat = [];
            for (var i = 0; i < (model.dataSource.columns.length + 1) ; i++) {
                index[i] = { index: i };
            }
            for (var i = 0; i < index.length - 1; i++) {
                arrMat.push(this._gridMatrix[index[i].index]);
            }
            arrMat.push(this._gridMatrix[i]);
            for (var i = 0; i < this._gridMatrix.length && this._gridMatrix[i] != undefined && arrMat[i] != undefined; i++) {
                for (var j = 0; j < this._gridMatrix[i].length && this._gridMatrix[i][j] != undefined; j++) {
                    if (this._gridMatrix[i][j] != undefined && arrMat[i][j] != undefined) {
                        arrMat[i][j].Index = this._gridMatrix[i][j].Index;
                    }
                }
            }
            for (var j = 0; j < model.dataSource.rows.length - 1; j++) {
                var sum = model.dataSource.columns.length + 1, span = 0, k = 0;
                var isSum = false;
                for (var i = (model.dataSource.columns.length + (model.dataSource.values.length > 0 ? 1 : 0)) ; i < arrMat.length; i++) {
                    if (arrMat[i] != undefined && arrMat[i][j] != undefined && arrMat[i][j].CSS == "rowheader" && arrMat[i][j].RowSpan != undefined) {
                        isSum = true;
                        span = span > arrMat[i][j].RowSpan ? span : arrMat[i][j].RowSpan;
                    }
                    if (arrMat[i] != undefined && arrMat[i][j] != undefined && arrMat[i][j].CSS == "summary rstot" && isSum && !ej.isNullOrUndefined(arrMat[sum])) {
                        isSum = false;
                        while (arrMat[sum] == undefined || arrMat[sum][j] == undefined) {
                            sum++;
                        }
                        arrMat[sum][j].RowSpan = span;
                        span = 0;
                        var len = 0;
                        sum = i + 1;
                        k++;
                    }
                }
            }
            this._gridMatrix = arrMat;
            this._transposeEngineCreation();
        },

        _transposeEngineCreation: function () {
            this._tColCnt = (this._isPaging && this._gridMatrix.length > 0) ? (!ej.isNullOrUndefined(this._gridMatrix[0]) && this._gridMatrix[0].length > 0 ? this._gridMatrix[0].length + 1 : this._gridMatrix[this._gridMatrix.length - 1].length + 1) : this._tColCnt;
            for (var rCnt = 0; rCnt < (this._tRowCnt - 1) ; rCnt++) {
                for (var cCnt = 0; cCnt < (this._tColCnt - 1) ; cCnt++) {
                    if (this._transposeEngine[cCnt] == undefined)
                        this._transposeEngine[cCnt] = [];
                    if (this._gridMatrix[rCnt] != undefined && this._gridMatrix[rCnt][cCnt] != undefined) {
                        var value =  ((typeof (this._gridMatrix[rCnt][cCnt]) === 'string' || typeof (this._gridMatrix[rCnt][cCnt]) === 'number' || typeof (this._gridMatrix[rCnt][cCnt]) === 'object') ? this._gridMatrix[rCnt][cCnt].Value == 0 ? "" : this._gridMatrix[rCnt][cCnt].Value == undefined ? "" : !ej.isNullOrUndefined(this._gridMatrix[rCnt][cCnt].valueText) ? this._gridMatrix[rCnt][cCnt].valueText : this._gridMatrix[rCnt][cCnt].Value : "");
                        this._transposeEngine[cCnt][rCnt] = {
                            Index: cCnt + ',' + rCnt,
                            CSS: this._gridMatrix[rCnt][cCnt].CSS,
                            Value: (typeof(value) == 'string' && value.indexOf("%####%") >-1 )?  value.replace("%####%","") : value,
                            State: this._gridMatrix[rCnt][cCnt].State,
                            RowSpan: (this._gridMatrix[rCnt][cCnt].RowSpan != undefined ? this._gridMatrix[rCnt][cCnt].RowSpan : 1),
                            ColSpan: (this._gridMatrix[rCnt][cCnt].ColSpan != undefined ? this._gridMatrix[rCnt][cCnt].ColSpan : 1), Info: this._gridMatrix[rCnt][cCnt].Info, Span: "None", Expander: this._gridMatrix[rCnt][cCnt].Expander, MCnt: (this._gridMatrix[rCnt][cCnt].MCnt != undefined ? this._gridMatrix[rCnt][cCnt].MCnt : 1)
                        };
                    }
                    else if (this._gridMatrix[rCnt] != undefined)
                        this._transposeEngine[cCnt][rCnt] = {
                            Index: cCnt + ',' + rCnt, CSS: "none", Value: "", State: 0,
                            RowSpan: 1,
                            ColSpan: 1, Info: "", Span: "None", Expander: 0
                        };
                }
            }
        },

        _filterKeyValues: function (keyCollection) {
            var me = this;
          var filteredCol=  $.grep(keyCollection, function (value) {
                var isFound = false;
                for (var i = 0; i < (!ej.isNullOrUndefined(value.uniqueName) && value.uniqueName.split(">#>").length) ; i++) {
                    isFound = $.inArray(value.uniqueName.split(">#>")[i], me._advancedFilterInfo) > -1 ? true : isFound;
                    isFound = $.inArray(value.uniqueName, me._advancedFilterInfo) > -1 ? true : isFound;
                    if (isFound)
                        break;
                }
                if (!isFound)
                    return value;
          });
          return filteredCol;
        },
        _getFilteredIndex: function (currFieldItems,values, kCnt, keyCol) {
            return $.map(values, function (value, index) {
                if (currFieldItems.length > 0 && keyCol[kCnt].keys.length > 0 &&
                    currFieldItems[keyCol[kCnt].keys.length - 1].advancedFilter &&
                    currFieldItems[keyCol[kCnt].keys.length - 1].advancedFilter.length > 0 &&
                    (currFieldItems[keyCol[kCnt].keys.length - 1].advancedFilter[0].measure == value.fieldName ||
                    currFieldItems[keyCol[kCnt].keys.length - 1].advancedFilter[0].name == value.fieldName
                    ))
                    return index;
            })[0];
        },
        _applyValueFilter: function (filterInfo, filterValue) {
            var isFiltered = false;
            if (filterInfo.length > 0 && !ej.isNullOrUndefined(filterValue)) {
                var filterOperator = filterInfo[0].valueFilterOperator, filterValues = filterInfo[0].values;
                switch (filterOperator.toLowerCase()) {
                    case "equals":
                        isFiltered = !(filterValue == JSON.parse(filterInfo[0].values[0]));
                        break;
                    case "notequals":
                        isFiltered = !(filterValue != JSON.parse(filterInfo[0].values[0]));
                        break;
                    case "greaterthan":
                        isFiltered = !(filterValue > JSON.parse(filterInfo[0].values[0]));
                        break;
                    case "greaterthanorequalto":
                        isFiltered = !(filterValue >= JSON.parse(filterInfo[0].values[0]));
                        break;
                    case "lessthan":
                        isFiltered = !(filterValue < JSON.parse(filterInfo[0].values[0]));
                        break;
                    case "lessthanorequalto":
                        isFiltered = !(filterValue <= JSON.parse(filterInfo[0].values[0]));
                        break;
                    case "between":
                        isFiltered = (!(filterValue > JSON.parse(filterValues[0])) || (!((filterValue < JSON.parse(filterValues[1])))));
                        break;
                    case "notbetween":
                        isFiltered = !(!(filterValue > JSON.parse(filterValues[0])) || (!((filterValue < JSON.parse(filterValues[1])))));
                        break;
                    default:
                        isFiltered = !(filterValue == JSON.parse(filterInfo[0].values[0]));
                        break;
                }
            }
            return isFiltered;
        },
        _applyLabelFilter: function (filterInfo, memberCaption)
        {
            if (filterInfo.length > 0) {
                var filterOperator = filterInfo[0].labelFilterOperator, filterValues = filterInfo[0].values, isFiltered = false;
                memberCaption = !ej.isNullOrUndefined(memberCaption) ? memberCaption.toString():"";
                switch (filterOperator.toLowerCase()) {
                    case "equals":
                        isFiltered = !(memberCaption.toLowerCase() ==(filterValues[0].toLowerCase()));
                        break;
                    case "notequals":
                        isFiltered = (memberCaption.toLowerCase() == (filterValues[0].toLowerCase()));
                        break;
                    case "contains":
                        isFiltered = !(memberCaption.toLowerCase().indexOf(filterValues[0].toLowerCase()) > -1);
                        break;
                    case "notcontains":
                        isFiltered = (memberCaption.toLowerCase().indexOf(filterValues[0].toLowerCase()) > -1);
                        break;
                    case "beginswith":
                        isFiltered = !(memberCaption.toLowerCase().indexOf(filterValues[0].toLowerCase()) ==0);
                        break;
                    case "notbeginswith":
                        isFiltered = (memberCaption.toLowerCase().indexOf(filterValues[0].toLowerCase()) == 0);
                        break;
                    case "endswith":
                        isFiltered = ej.isNullOrUndefined((memberCaption.toLowerCase().match(filterValues[0].toLowerCase() + "$")));
                        break;
                    case "notendswith":
                        isFiltered = !ej.isNullOrUndefined((memberCaption.toLowerCase().match(filterValues[0].toLowerCase() + "$")));
                        break;
                    case "greaterthan":
                        isFiltered = !((memberCaption.toLowerCase()>(filterValues[0].toLowerCase())));
                        break;
                    case "greaterthanorequalto":
                        isFiltered = !((memberCaption.toLowerCase() >= (filterValues[0].toLowerCase())));
                        break;
                    case "lessthan":
                        isFiltered = !((memberCaption.toLowerCase() < (filterValues[0].toLowerCase())));
                        break;
                    case "lessthanorequalto":
                        isFiltered = !((memberCaption.toLowerCase() <= (filterValues[0].toLowerCase())));
                        break;
                    case "between":
                        isFiltered = (!(memberCaption.toLowerCase() > (filterValues[0].toLowerCase())) && (!((memberCaption.toLowerCase() < (filterValues[1].toLowerCase())))));
                        break;
                    case "notbetween":
                          isFiltered =!( !((memberCaption.toLowerCase() > (filterValues[0].toLowerCase()))) && !((memberCaption.toLowerCase() < (filterValues[1].toLowerCase()))));
                        break;
                    default:
                        isFiltered = !(memberCaption.toLowerCase().indexOf(filterValues[0].toLowerCase()) > -1);
                        break;
                }
                return isFiltered;
            }
        },

        getMembers: function (field, data) {
            if (ej.isNullOrUndefined(data))
                return ej.isNullOrUndefined(this._fieldMembers) ? [] : ej.isNullOrUndefined(this._fieldMembers[field]) ? [] : this._fieldMembers[field];
            else {
                var memberList = {};
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];
                    $.each(dataItem, function (item, value) {
                        if (ej.isNullOrUndefined(memberList[item]))
                            memberList[item] = [value];
                        else if(memberList[item].indexOf(value)<0)
                            memberList[item].push(value);
                    });
                }
                return memberList[field];
            }
        },

        _powerFunction: function (formula) {
            if (formula.indexOf("^") > -1) {
                var items = [];
                while (formula.indexOf("(") > -1) {
                    formula = formula.replace(/(\([^\(\)]*\))/g, function (text, item) {
                        items.push(item);
                        return ("~" + (items.length - 1));
                    });
                }

                items.push(formula);
                formula = "~" + (items.length - 1);
                while (formula.indexOf("~") > -1) {
                    formula = formula.replace(new RegExp("~" + "(\\d+)", "g"), function (text, index) {
                        return items[index].replace(/(\w*)\^(\w*)/g, "Math.pow" + "($1,$2)");
                    });
                }
            }
            return formula;
        },
        _calculatedFieldSummaryValue: function (index, calValue, dataSource) {
            if (dataSource.values[index].isCalculatedField == true) {
                var formula = dataSource.values[index].formula.replace(/\s/g, "");
                for (var i = 0; i < dataSource.values.length; i++) {
                    if (dataSource.values[i].isCalculatedField != true) {
                        var value= ej.globalize.parseFloat(calValue[i] == null ? "0" : dataSource.values[i].format == "date" ? this._dateToInt(calValue[i].toString()).toString() : dataSource.values[i].format == "time" ? this._dateToInt(new Date("1900", calValue[i].toString().split(":")[0], calValue[i].toString().split(":")[1], calValue[i].toString().split(":")[2].split(" ")[0]).toString()).toString() : calValue[i].toString(),this._locale);
                        formula = formula.replace(new RegExp(dataSource.values[i].fieldName, 'g'), dataSource.values[i].format == "percentage" && value != 0 ? (value < 0 ? "(" + value / 100 + ")" : value) : (value < 0 ? "(" + value + ")" : value));
                    }
                }
                if (formula.indexOf("^") > -1)
                    formula = this._powerFunction(formula);
                var oldValue = (!isNaN(eval(formula))) && isFinite(eval(formula)) ? this._getReflectedValue({ calcField: eval(formula) }, "calcField", dataSource.values[index].format, dataSource.values[index].formatString) : dataSource.values[index].format == null ? 0 : "0";
                var newValue = dataSource.values[index].format == null ? 0 : "0";
                return this._getSummaryValue(oldValue, newValue, 1, this._summaryTypes[index] == "count" ? "sum" : this._summaryTypes[index], dataSource.values[index].format, dataSource.values[index].formatString);
            }
        },

        _sortHeaders: function (memberArray, axisElements, level) {
            var subArray = [], resultantArray = [], membersCount = 0;
            var sortedArray;
            if (axisElements[level].sortOrder != ej.PivotAnalysis.SortOrder.None){
                if (!ej.isNullOrUndefined(axisElements[level].format))
                    sortedArray = this._getSortedHeaders(memberArray, axisElements, level);
                else
                    sortedArray = ej.DataManager(memberArray).executeLocal(ej.Query().sortBy("keys." + level, axisElements[level].sortOrder != null && axisElements[level].sortOrder == ej.PivotAnalysis.SortOrder.Descending ? ej.sortOrder.Descending : ej.sortOrder.Ascending, false));
            }
            else
                sortedArray = memberArray;
            while (membersCount < sortedArray.length) {
                var memberName = sortedArray[membersCount].keys[level];
                subArray = $.grep(sortedArray, function (item) { return item.keys[level] == memberName; });
                if (subArray.length > 1 && level + 1 < sortedArray[membersCount].keys.length)
                    subArray = this._sortHeaders(subArray, axisElements, level + 1);
                resultantArray = resultantArray.concat(subArray);
                membersCount += subArray.length;
            }
            return resultantArray;
        },
        _getSortedHeaders: function (memberArray, axisElements, level) {
            return axisElements[level].sortOrder == ej.PivotAnalysis.SortOrder.Descending ? memberArray.sort(function (a, b) {
                return ej.PivotAnalysis._formatToInt(b.keys[level], ej.isNullOrUndefined(axisElements[level].format) ? null : axisElements[level].format, ej.isNullOrUndefined(axisElements[level].formatString) ? null : axisElements[level].formatString) - ej.PivotAnalysis._formatToInt(a.keys[level], ej.isNullOrUndefined(axisElements[level].format) ? null : axisElements[level].format, ej.isNullOrUndefined(axisElements[level].formatString) ? null : axisElements[level].formatString)
            }) : memberArray.sort(function (a, b) { return ej.PivotAnalysis._formatToInt(a.keys[level], ej.isNullOrUndefined(axisElements[level].format) ? null : axisElements[level].format, ej.isNullOrUndefined(axisElements[level].formatString) ? null : axisElements[level].formatString) - ej.PivotAnalysis._formatToInt(b.keys[level], ej.isNullOrUndefined(axisElements[level].format) ? null : axisElements[level].format, ej.isNullOrUndefined(axisElements[level].formatString) ? null : axisElements[level].formatString) });
        },

        _isValidTime: function (val) {
            var timeSplit = val.indexOf(':') > -1 ? val.split(':') : [];
            if (timeSplit.length == 3) {
                timeSplit[3] = timeSplit[2].indexOf(' ') > -1 ? timeSplit[2].split(' ')[1] : "AM";
                timeSplit[2] = timeSplit[2].indexOf(' ') > -1 ? timeSplit[2].split(' ')[0] : timeSplit[2];
                if ((Number(timeSplit[0]) > -1 && Number(timeSplit[0]) < 13) && (Number(timeSplit[1]) > -1 && Number(timeSplit[1]) < 61) && jQuery.isNumeric(timeSplit[2]) && (timeSplit[3] == "AM" || timeSplit[3] == "PM"))
                    return true;
                else
                    return false;
            }
            else
                return false;
        },

        _getNumber: function (value, formatString) {
            if (!ej.isNullOrUndefined(value)) {
                if (jQuery.isNumeric(value.toString().replace(/[,.]/g, ''))) {
                    value = value.toString().replace(/[,]/g, ej.preferredCulture(this._locale).numberFormat[","] == ',' ? '' : '~').replace(/[.]/g, ej.preferredCulture(this._locale).numberFormat["."] == '.' ? '.' : '');
                    value = Number(value.toString().replace(/[~]/g, '.'));
                }
                else {
                    if (this._isValidTime(value))
                        value = this._formatToInt(value, "time", formatString);
                    else if (!ej.isNullOrUndefined(ej.parseDate(value, formatString == undefined ? "MM/dd/yyyy" : formatString)))
                        value = this._formatToInt(value, "date", formatString);
                    else if (value.indexOf('/') != -1 && value.split('/') == 2)
                        value = this._formatToInt(value, "fraction", undefined);
                    else if ($.trim(value).indexOf('%') == $.trim(value).length - 1)
                        value = Number(value.replace(/[^\d.-]/g, '')) / 100;
                    else {
                        if (/[a-zA-Z]/.test(value))
                            value = 1
                        else
                            value = Number(value.replace(/[^\d.-]/g, ''));
                    }
                }
            }
            return value;
        },

        _setFormat: function (val, format, formatString) {
            switch (format) {
                case "percentage":
                    var division = jQuery.isNumeric(val) ? 1 : 100;
                    val = typeof val == "string" ? $.trim(val.toString().split(ej.preferredCulture(this._locale).numberFormat[","]).join('').replace(',', '.').replace(ej.preferredCulture(this._locale).numberFormat.percent.symbol, "")) : val;
                    val = jQuery.isNumeric(val) ? val : 0;
                    val = ej.widgetBase.formatting(formatString || "{0:P}", val == "" ? 0 : val / division, this._locale);
                    break;
                case "decimal":
                case "number":
                    val = typeof val == "string" ? val.toString().split(ej.preferredCulture(this._locale).numberFormat[","]).join('').replace(',', '.') : val;
                    val = jQuery.isNumeric(val) ? val : 0;
                    val = ej.widgetBase.formatting(formatString || "{0:N}", val, this._locale);
                    break;
                case "currency":
                    val = typeof val == "string" ? $.trim(val.toString().split(ej.preferredCulture(this._locale).numberFormat[","]).join('').replace(',', '.').replace(ej.preferredCulture(this._locale).numberFormat.currency.symbol, "")) : val;
                    val = jQuery.isNumeric(val) ? val : 0;
                    val = ej.widgetBase.formatting(formatString || "{0:C2}", val == "" ? 0 : val, this._locale);
                    break;
                case "date":
                    if (jQuery.isNumeric(val)) {
                        val = new Date(((Number(val) - 2) * (1000 * 3600 * 24)) + new Date("01/01/1900").getTime());
                        if (this._isDateTime(val))
                            val = ej.widgetBase.formatting("{0:" + (formatString == undefined ? "MM/dd/yyyy" : formatString) + "}", val, this._locale)
                    }
                    else if (new Date(val) != "Invalid Date") {
                        val = new Date(val);
                        val = ej.widgetBase.formatting("{0:" + (formatString == undefined ? "MM/dd/yyyy" : formatString) + "}", val, this._locale)
                    }
                    else {
                        val = new Date(((Number(0) - 2) * (1000 * 3600 * 24)) + new Date("01/01/1900").getTime());
                        val = ej.widgetBase.formatting("{0:" + (formatString == undefined ? "MM/dd/yyyy" : formatString) + "}", val, this._locale)
                    }
                    break;
                case "scientific":
                    val = typeof val == "string" ? val.split(ej.preferredCulture(this._locale).numberFormat[","]).join('').replace(',', '.') : val;
                    val = jQuery.isNumeric(val) ? val : 0;
                    val = Number(val).toExponential(2).replace("e", "E");
                    break;
                case "accounting":
                    val = this._toAccounting(val, formatString||"{0:C2}", this._locale);
                    break;
                case "time":
                    if (jQuery.isNumeric(val)) {
                        val = new Date(((Number(val) - 2) * (1000 * 3600 * 24)) + new Date("01/01/1900").getTime());
                        if (this._isDateTime(val))
                            val = ej.widgetBase.formatting("{0:h:mm:ss tt}", val, this._locale);
                    }
                    else if (this._isValidTime(val))
                        val = ej.widgetBase.formatting("{0:h:mm:ss tt}", val, this._locale);
                    else {
                        val = new Date(((Number(0) - 2) * (1000 * 3600 * 24)) + new Date("01/01/1900").getTime());
                        val = ej.widgetBase.formatting("{0:h:mm:ss tt}", val, this._locale);
                    }
                    break;
                case "fraction":
                    val = typeof val == "string" ? val.split(ej.preferredCulture(this._locale).numberFormat[","]).join('').replace(',', '.') : val;
                    val = jQuery.isNumeric(val) ? this._toFraction(val) : this._toFraction(0);
                    val = "numerator" in val ? val.integer + " " + val.numerator + "/" + val.denominator : val.integer
                    break;
                default: val;
            }
            return val;
        },

        _getReflectedValue: function (recSet, fieldName, format, formatString) {
            var val = $(recSet).prop(fieldName);
            if (val == null)
                return val;
            else if (!jQuery.isNumeric(val))
                format = formatString = null;
            return this._setFormat(val, format, formatString);
        },

        _formatToInt: function (value, format, formatString) {
            switch (format) {
                case "date":
                    value = ej.parseDate(value.toString(), (formatString == undefined ? "MM/dd/yyyy" : formatString), this._locale) != null ? this._dateToInt(ej.parseDate(value, (formatString == undefined ? "MM/dd/yyyy" : formatString), this._locale)) : value;
                    break;
                case "percentage":
                    value = value != 0 ? ej.globalize.parseFloat(value.toString(), this._locale) / 100 : Number(value);
                    break;
                case "currency":
                case "accounting":
                    value = value != 0 ? ej.globalize.parseFloat(ej.globalize.format(value.toString(), "c", this._locale), this._locale) : Number(value);
                    break;
                case "decimal":
                case "number":
                    value = value != 0 ? ej.globalize.parseFloat(value.toString(), this._locale) : Number(value);
                    break;
                case "scientific":
                    value = value != 0 || value == 0.00E+0 ? parseFloat(value) : Number(value);
                    break;
                case "time":
                    if (!this._isNumber(value)) {
                        var time = value.toString().split(":");
                        time = new Date("1900", time[0], time[1], time[2].split(" ")[0]).toString();
                        value = this._dateToInt(time);
                    }
                    break;
                case "fraction":
                    var temp1 = parseFloat(value.toString().split(" ")[0]),
                        temp2 = eval(value.toString().split(" ")[1]) != undefined ? parseFloat(eval(value.toString().split(" ")[1])) : parseFloat(0),
                    value = value != 0 ? temp1 + temp2 : Number(value);
                    break;
            }
            return value;
        },

        _isDateTime: function (date) {
            return Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date.valueOf());
        },
        _toAccounting: function (value, formatStr, locale) {
            var numFormat = ej.preferredCulture(locale).numberFormat, prefix, suffix, symbol = numFormat.currency.symbol;
            val = ej.widgetBase.formatting(formatStr, value);
            val = val.indexOf(' ') > -1 ? val.split(' ').join('') : val;
            var trunVal = val.replace(symbol, ""), idx = jQuery.isNumeric(trunVal.toString().split(numFormat[","]).join('').replace(',', '.')) ? val.indexOf(symbol) : 0;
            trunVal = jQuery.isNumeric(trunVal.toString().split(',').join('')) ? trunVal : "0.00";
            if (!idx || (Number(trunVal) < 0 && idx === 1)) {
                prefix = symbol;
                suffix = trunVal;
            }
            else {
                prefix = trunVal;
                suffix = symbol;
            }
            value = prefix + "   " + suffix;
            return value;
        },
        _toFraction: function (value) {
            if (this._isNumber(value)) {
                var input = value.toString(), integerVal = input.split(".")[0], decimalVal = input.split(".")[1];
                if (!decimalVal)
                    return { integer: value };
                var wholeVal = (+decimalVal).toString(), placeVal = this._getPlaceValue(decimalVal, wholeVal), gcd = this._getGCD(wholeVal, placeVal);
                return { integer: integerVal, numerator: Number(wholeVal) / gcd, denominator: Number(placeVal) / gcd };
            }
            return null;
        },
        _isNumber: function (val) {
            return val - parseFloat(val) >= 0;
        },
        _getGCD: function (a, b) {  //make generic gcd of multiple no
            a = Number(a);
            b = Number(b);
            if (!b)
                return a;
            return this._getGCD(b, a % b);
        },
        _getPlaceValue: function (val, digit) {
            var index = val.indexOf(digit) + digit.length;
            return "1" + Array(index + 1).join("0");
        },
        _cellEdit: function (axisData, value, valPos, dataSource) {
            $.each(this._editCellsInfo, function (index, val) {
                if (axisData == ((ej.isNullOrUndefined(val.row) && ej.isNullOrUndefined(val.column)) ? "" : (ej.isNullOrUndefined(val.row) ? val.column : (ej.isNullOrUndefined(val.column) ? val.row : val.row + ">#>" + val.column))) && valPos == parseInt(val.value.split('#')[0])) {
                    value = ej.PivotAnalysis._setFormat(ej.isNullOrUndefined(dataSource.format) ? (jQuery.isNumeric(val.value.split('#')[1].toString().split(',').join('')) ? parseFloat(val.value.split('#')[1].toString().split(',').join('')) : 0) : val.value.split('#')[1], dataSource.format, dataSource.formatString);
                    return false;
                }
            })
            return value;
        },
        _isMemberExist: function (axis, axisData, value, dataSource) {
            var currentObj = this;
            switch (axis) {
                case "row":
                    var pos, flag = false;                    
                    var hdrIndex = this._rowKeysCalcValues.length == 0 ? 0 : this._rowMembers[axisData.uniqueName];
                    if (hdrIndex > -1) { flag = true; pos = hdrIndex; }
                    if (this._rowKeysCalcValues.length == 0) {
                        this._rowKeysCalcValues.push(axisData);
                        this._rowMembers[axisData.uniqueName] = this._rowKeysCalcValues.length - 1;
                    }
                    if (flag) {
                        for (var vC = 0; vC < value.keys.length; vC++)
                            if (this._rowKeysCalcValues[pos].value == null) {
                                this._rowKeysCalcValues[pos].value = value;
                                break;
                            }
                            else
                                this._rowKeysCalcValues[pos].value.keys[vC] += value.keys[vC];
                    }
                    else {
                        this._rowKeysCalcValues.push(axisData);
                        this._rowMembers[axisData.uniqueName] = this._rowKeysCalcValues.length - 1;
                    }
                    break;
                case "column":
                    var pos, flag = false;                    
                    var hdrIndex = this._colKeysCalcValues.length == 0 ? 0 : this._colMembers[axisData.uniqueName];
                    if (hdrIndex > -1) { flag = true; pos = hdrIndex; }
                    if (this._colKeysCalcValues.length == 0 && (dataSource.columns.length > 0 || dataSource.values.length > 0)) {
                        this._colKeysCalcValues.push(axisData);
                        this._colMembers[axisData.uniqueName] = this._colKeysCalcValues.length - 1;
                    }
                    if (flag) {
                        for (var vC = 0; vC < value.keys.length; vC++)
                            if (this._colKeysCalcValues[pos].value == null) {
                                this._colKeysCalcValues[pos].value = value;
                                break;
                            }
                            else
                                this._colKeysCalcValues[pos].value.keys[vC] += value.keys[vC];
                    }
                    else if (dataSource.columns.length > 0 || dataSource.values.length > 0) {
                        this._colKeysCalcValues.push(axisData);
                        this._colMembers[axisData.uniqueName] = this._colKeysCalcValues.length - 1;
                    }
                    break;
                case "calc":
                    var pos, flag = false;                    
                    var hdrIndex = this._tableKeysCalcValues.length == 0 ? 0 : this._calcMembers[axisData.uniqueName];
                    if (hdrIndex > -1) { flag = true; pos = hdrIndex; }
                    if (this._tableKeysCalcValues.length == 0) {
                        this._tableKeysCalcValues.push(axisData);
                        this._calcMembers[axisData.uniqueName] = this._tableKeysCalcValues.length - 1;
                    }
                    if (flag) {
                        for (var vC = 0; vC < value.keys.length; vC++) {
                            if (this._tableKeysCalcValues[pos].value == null) {
                                this._tableKeysCalcValues[pos].value = value;
                                this._tableKeysCalcValues[pos].value["count"] = 1;
                                for (var i = 0; i < value.keys.length; i++) {
                                    if (this._summaryTypes[i] == ej.PivotAnalysis.SummaryType.Count)
                                        this._tableKeysCalcValues[pos].value.keys[i] = this._tableKeysCalcValues[pos].value.count;
                                }
                                break;
                            }
                            else {
                                var calVal = dataSource.values[vC];
                                if (this._tableKeysCalcValues[pos].value.uniqueName[vC] != value.uniqueName[vC] || (!ej.isNullOrUndefined(calVal.formatString) && calVal.formatString.toLowerCase() == "single-entry"))
                                    this._tableKeysCalcValues[pos].value.uniqueName[vC] = " ";
                                if (vC == 0)
                                    this._tableKeysCalcValues[pos].value.count++;
                                if (dataSource.values[vC].isCalculatedField != true)
                                    this._tableKeysCalcValues[pos].value.keys[vC] = this._getSummaryValue(this._tableKeysCalcValues[pos].value.keys[vC], value.keys[vC], this._tableKeysCalcValues[pos].value.count, this._summaryTypes[vC], dataSource.values[vC].format, dataSource.values[vC].formatString);
                            }
                        }
                    }
                    else {
                        this._tableKeysCalcValues.push(axisData);
                        this._calcMembers[axisData.uniqueName] = this._tableKeysCalcValues.length - 1;
                        this._tableKeysCalcValues[this._tableKeysCalcValues.length - 1].value = value;
                        for (var i = 0; i < value.keys.length; i++) {
                            if (this._summaryTypes[i] == ej.PivotAnalysis.SummaryType.Count)
                                this._tableKeysCalcValues[this._tableKeysCalcValues.length - 1].value.keys[i] = 1;
                            this._tableKeysCalcValues[this._tableKeysCalcValues.length - 1].value["count"] = 1;
                        }
                    }
                    break;
            }
        },

        _getSummaryValue: function (oldValue, newValue, count, type, format, formatString) {
            oldValue = this._formatToInt(oldValue, format, formatString);
            newValue = this._formatToInt(newValue, format, formatString);
            switch (type) {
                case ej.PivotAnalysis.SummaryType.Sum:
                    oldValue += newValue;
                    break;
                case ej.PivotAnalysis.SummaryType.Average:
                    oldValue = (oldValue * (count - 1) + newValue) / count;
                    if (Math.floor(oldValue) != oldValue) oldValue = Number(oldValue.toFixed(2));
                    break;
                case ej.PivotAnalysis.SummaryType.Min:
                    oldValue = count == 1 ? newValue : Math.min(oldValue, newValue);
                    break;
                case ej.PivotAnalysis.SummaryType.Max:
                    oldValue = count == 1 ? newValue : Math.max(oldValue, newValue);
                    break;
                case ej.PivotAnalysis.SummaryType.Count:
                    oldValue = count;
                    break;
            }
            switch (format) {
                case "percentage":
                    oldValue = ej.widgetBase.formatting( formatString || "{0:P}", oldValue, this._locale);
                    break;
                case "decimal":
                case "number":
                    oldValue = ej.widgetBase.formatting( formatString || "{0:N}", oldValue, this._locale);
                    break;
                case "date":
                    oldValue = new Date(((Number(oldValue) - 2) * (1000 * 3600 * 24)) + new Date("01/01/1900").getTime());
                    if (this._isDateTime(oldValue))
                        oldValue = ej.widgetBase.formatting("{0:" + (formatString == undefined ? "MM/dd/yyyy" : formatString) + "}", oldValue, this._locale);
                    break;
                case "currency":
                    oldValue = ej.widgetBase.formatting(formatString || "{0:C2}", oldValue, this._locale);
                    break;
                case "scientific":
                    oldValue = oldValue.toExponential(2).replace("e", "E");
                    break;
                case "accounting":
                    oldValue = this._toAccounting(oldValue, formatString || "{0:C2}", this._locale);
                    break;
                case "time":
                    oldValue = new Date(((Number(oldValue) - 2) * (1000 * 3600 * 24)) + new Date("01/01/1900").getTime());
                    if (this._isDateTime(oldValue))
                        oldValue = ej.widgetBase.formatting("{0:h:mm:ss tt}", oldValue, this._locale);
                    break;
                case "fraction":
                    oldValue = this._toFraction(oldValue);
                    oldValue = "numerator" in oldValue ? oldValue.integer + " " + oldValue.numerator + "/" + oldValue.denominator : oldValue.integer
                    break;
                default: oldValue;
            }
            return oldValue;
        },
        _dateToInt: function (date) {
            var date1 = new Date("01/01/1900"), date2 = this._isDateTime(date) ? date : new Date(date),
            timeDiff = (date2.getTime() - date1.getTime()),
            diffDays = (timeDiff / (1000 * 3600 * 24)) + 2;
            return diffDays;
        },
        _insertTotalHeader: function (axisItems, headerList) {
            if (axisItems.length <= 1) {
                headerList.push({ cellType: "RGTot", keys: ["Grand Total"], tot: "sub" });
                return;
            }
            var level = -1;
            for (var lC = axisItems.length - 2; lC >= 0; lC--) {
                level++;
                var pivotCount = headerList.length;
                if (pivotCount > 0) {
                    var prevVal = headerList[0].uniqueName.split('>#>'), prevTxt = headerList[0].keys[level];
                    prevVal = prevVal.slice(0, lC + 1).join('>#>');
                    var newVal = "", prevCnt = 0, newTxt = "";
                    for (var hCnt = 1; hCnt <= pivotCount; hCnt++) {
                        if (headerList[hCnt] != undefined) {

                            newVal = headerList[hCnt].uniqueName.split('>#>');
                            newVal = newVal.slice(0, lC + 1).join('>#>');
                            newTxt = headerList[hCnt].keys[lC + 1];
                        }
                        else {
                            newVal = undefined;
                        }
                        if (newVal != undefined && newVal.indexOf("%####%") == -1) {
                            if (prevVal != undefined && ((newVal != prevVal))) {
                                headerList.splice(hCnt, 0, { keys: [prevVal.split('>#>')[lC] + " Total" + "%####%"], cellType: "SubTot", uniqueName: prevVal, level: lC, mSpan: hCnt - prevCnt });
                                if (headerList[prevCnt]['span'] == undefined)
                                    headerList[prevCnt]['span'] = [];

                                headerList[prevCnt]['span'][lC] = hCnt - prevCnt;

                                hCnt++; pivotCount++; prevVal = newVal; prevCnt = hCnt; prevTxt = newTxt;
                            }

                        }
                        else if (prevVal != undefined) {
                            headerList.splice(hCnt, 0, { keys: [prevVal.split('>#>')[lC] + " Total"+"%####%"], cellType: "SubTot:", uniqueName: prevVal, level: lC, mSpan: hCnt - prevCnt });
                            if (headerList[prevCnt]['span'] == undefined)

                                headerList[prevCnt]['span'] = [];
                            headerList[prevCnt]['span'][lC] = hCnt - prevCnt;
                            hCnt++; pivotCount++; prevVal = newVal; prevCnt = hCnt; prevTxt = newTxt;
                        }
                    }
                }
            }
            headerList.push({ cellType: "RGTot", keys: ["Grand Total"] });
        },

        _isPreviousLevelEqual: function (headerList, hCnt, prevCnt, level) {
            for (var prev = level - 1; prev >= 0; prev--) {
                if (headerList[hCnt].keys[prev] != headerList[prevCnt].keys[prev])
                    return true;
                else
                    return false;
            }
        },

        _calculateValues: function (dataSource) {
            var rowCount = this._rowKeysCalcValues.length + (dataSource.values.length > 0 ? 1 : 0);
            var colCount = this._colKeysCalcValues.length == 0 ? 1 : (this._colKeysCalcValues.length * (dataSource.values.length == 0 ? 1 : dataSource.values.length)) + 1 - ((this._isPaging && dataSource.values.length > 0 && dataSource.pagerOptions.categoricalPageSize < dataSource.values.length * this._colKeysCalcValues.length) ? (dataSource.values.length - ((dataSource.pagerOptions.categoricalCurrentPage * dataSource.pagerOptions.categoricalPageSize) % dataSource.values.length == 0 ? (dataSource.pagerOptions.categoricalCurrentPage * dataSource.pagerOptions.categoricalPageSize) : ((dataSource.pagerOptions.categoricalCurrentPage * dataSource.pagerOptions.categoricalPageSize) % dataSource.values.length))) : 0);
            if (this._isPaging) {
                if (dataSource.columns.length == 0)
                    ej.PivotAnalysis._colHdrLen = 0;
                else
                    $.each(this._colKeysCalcValues, function (idx, itm) { if (!ej.isNullOrUndefined(itm) && itm.keys.length > ej.PivotAnalysis._colHdrLen) ej.PivotAnalysis._colHdrLen = itm.keys.length });
                if (dataSource.rows.length == 0)
                    ej.PivotAnalysis._rowHdrLen = 0;
                else
                    $.each(this._rowKeysCalcValues, function (idx, itm) { if (!ej.isNullOrUndefined(itm) && itm.keys.length > ej.PivotAnalysis._rowHdrLen) ej.PivotAnalysis._rowHdrLen = itm.keys.length });
            }
            this._gridMatrix = new Array(rowCount + (this._isPaging ?this._rowHdrLen : dataSource.rows.length) + 1);
            this._populateRowHeaders(dataSource, rowCount + (this._isPaging ? this._rowHdrLen : dataSource.rows.length) + 1, (dataSource.rows.length == 0 ? 1 : (this._isPaging ? this._rowHdrLen : dataSource.rows.length)));            
            var colHdRowCnt = (this._isPaging ? this._colHdrLen : dataSource.columns.length) + 1, colHdColCnt = ((this._isPaging && (dataSource.pagerOptions.categoricalPageSize + 1) < colCount) ? (dataSource.pagerOptions.categoricalPageSize + 1) : colCount) + (dataSource.rows.length == 0 ? 1 : (this._isPaging ? this._rowHdrLen : dataSource.rows.length));
            this._populateColumnHeaders(dataSource, colHdRowCnt, colHdColCnt);
            this._advancedFilterInfo = [];
            if (dataSource.values.length > 0)
                this._populateCalcTable(dataSource);      
            this._tRowCnt = rowCount + colHdRowCnt, this._tColCnt = colHdColCnt;
        },

        _populateRowHeaders: function (dataSource, rowCnt, columnCount) {
            if (this._rowKeysCalcValues.length == 0)
                return;
            var rowIndex;
            if (this._colKeysCalcValues.length == 1 && this._colKeysCalcValues[0].cellType == "RGTot")
                rowIndex = 1 + (dataSource.values.length > 0 ? 1 : 0);
            else
                rowIndex = (this._isPaging ? this._colHdrLen : dataSource.columns.length) + (dataSource.values.length > 0 ? 1 : 0);
            this._gridMatrix = [];
            var previousValue = "";
            for (var cnt = 0; cnt < this._rowKeysCalcValues.length; cnt++) {
                previousValue = this._rowKeysCalcValues[cnt];
                {
                    var colIndex = 0, tempCIndx = 0, tempCSpan = 0, rowKLen = 0;
                    if (this._rowKeysCalcValues[cnt].keys != undefined && this._rowKeysCalcValues[cnt].keys.length != 0) {
                        this._gridMatrix[rowIndex] = new Array(columnCount);
                        rowKLen = this._rowKeysCalcValues[cnt].keys.length;
                        for (var kCnt = 0; kCnt < rowKLen; kCnt++) {
                            if (this._rowKeysCalcValues[cnt].cellType != undefined && ej.isNullOrUndefined(this._rowKeysCalcValues[cnt].span)) {
                                if (this._rowKeysCalcValues[cnt].cellType.indexOf("SubTot") > -1) {
                                    tempCIndx = colIndex == 0 ? (this._rowKeysCalcValues[cnt].level + colIndex) : colIndex;
                                    tempCSpan = columnCount - this._rowKeysCalcValues[cnt].level;
                                    this._cellType = "summary rstot";
                                }
                                else {
                                    this._cellType = "summary rgtot";
                                    tempCIndx = colIndex; tempCSpan = this._isPaging ? this._rowHdrLen : dataSource.rows.length;
                                }
                            }
                            else {
                                this._cellType = "rowheader";
                                tempCIndx = colIndex;
                                tempCSpan = 1;
                            }
                            var expand = rowKLen > 1 ? rowKLen - kCnt > 1 ? 1 : (!ej.isNullOrUndefined(this._rowKeysCalcValues[cnt].expander) ? 2 : 0) : (!ej.isNullOrUndefined(this._rowKeysCalcValues[cnt].expander) ? 2 : 0);
                            var obj = $.extend(true, [], this._rowKeysCalcValues[cnt].keys);
                            this._gridMatrix[rowIndex][tempCIndx] = {
                                Index: tempCIndx + ',' + rowIndex, CSS: this._cellType, Value: this._rowKeysCalcValues[cnt].keys[kCnt], State: expand,
                                RowSpan: (this._rowKeysCalcValues[cnt].span != undefined ? this._rowKeysCalcValues[cnt].span[kCnt] : 1),
                                ColSpan: tempCSpan, Info: obj.splice(0, kCnt + 1).join('>#>'), Span: "None", Expander: (this._rowKeysCalcValues[cnt].span != undefined ? (this._rowKeysCalcValues[cnt].span[kCnt] != undefined ? 1 : !ej.isNullOrUndefined(this._rowKeysCalcValues[cnt].expander) ? 1 : 0) : (!ej.isNullOrUndefined(this._rowKeysCalcValues[cnt].expander) ? 2 : 0)), MCnt: (this._rowKeysCalcValues[cnt].mSpan != undefined && ej.isNullOrUndefined(this._rowKeysCalcValues[cnt].span)) ? this._rowKeysCalcValues[cnt].mSpan : 0
                            };
                            if (this._rowKeysCalcValues[cnt].level - kCnt == 1)
                                delete this._rowKeysCalcValues[cnt].span;
                            colIndex++;
                        }
                    }
                    rowIndex++;
                }
            }
            this._cellType = "";
        },

        _populateColumnHeaders: function (dataSource, colHdRowCnt, colHdColCnt) {
            if (this._colKeysCalcValues.length == 0)
                return;
            var tempCnt, colKLen, tempRIndx, tempRSpan, tempCSpan;
            var colIndex = tempCnt = (dataSource.rows.length == 0 ? 1 : (this._isPaging ? this._rowHdrLen : dataSource.rows.length)), loopCnt = dataSource.values.length == 0 ? 1 : dataSource.values.length, prevVal = "", rowIndex = colKLen = 0;
            var lastRow = (this._colKeysCalcValues.length == 1 && this._colKeysCalcValues[0].cellType == "RGTot") ? 1 : (this._isPaging ? this._colHdrLen : dataSource.columns.length);            
            for (var cnt = 0; cnt < this._colKeysCalcValues.length; cnt++) {
                rowIndex = 0, tempRIndx = 0, tempRSpan = 0, tempCSpan = 0, tmpCnt = loopCnt, tolerance = 0;
                if (this._isPaging && dataSource.values.length > 0) {   
                    tolerance = ((dataSource.pagerOptions.categoricalCurrentPage - 1) * dataSource.pagerOptions.categoricalPageSize) % dataSource.values.length;
                    if (cnt == 0) {
                        tmpCnt = ((dataSource.pagerOptions.categoricalCurrentPage == 1 && dataSource.values.length > dataSource.pagerOptions.categoricalPageSize) ? dataSource.pagerOptions.categoricalPageSize : dataSource.values.length) - ((dataSource.pagerOptions.categoricalCurrentPage - 1) * dataSource.pagerOptions.categoricalPageSize) % dataSource.values.length;
                        tmpCnt = tmpCnt < 1 ? dataSource.values.length : (dataSource.values.length > dataSource.pagerOptions.categoricalPageSize && tmpCnt > dataSource.pagerOptions.categoricalPageSize ? dataSource.pagerOptions.categoricalPageSize : tmpCnt);
                    }
                    else if (this._colKeysCalcValues.length - cnt == 1) {
                        tmpCnt = ((dataSource.pagerOptions.categoricalCurrentPage * dataSource.pagerOptions.categoricalPageSize) % dataSource.values.length);
                        tmpCnt = tmpCnt < 1 || (dataSource.pagerOptions.categoricalPageSize >= ((dataSource.values.length * this._colKeysCalcValues.length) - (((dataSource.pagerOptions.categoricalCurrentPage - 1) * dataSource.pagerOptions.categoricalPageSize) % dataSource.values.length))) ? dataSource.values.length : tmpCnt;
                    }
                    else
                        tmpCnt = dataSource.values.length;
                }

                prevVal = this._colKeysCalcValues[cnt].keys;
                if (this._gridMatrix[rowIndex] == undefined)
                    this._gridMatrix[rowIndex] = new Array();
                colKLen = this._colKeysCalcValues[cnt].keys.length;
                for (var kCnt = 0; kCnt < colKLen; kCnt++) {
                    if (this._gridMatrix[rowIndex] == undefined)
                        this._gridMatrix[rowIndex] = new Array();

                    if (this._colKeysCalcValues[cnt].cellType != undefined && ej.isNullOrUndefined(this._colKeysCalcValues[cnt].span)) {
                        if (this._colKeysCalcValues[cnt].cellType.indexOf("SubTot") > -1) {
                            tempRIndx = rowIndex == 0 ? (this._colKeysCalcValues[cnt].level + rowIndex) : rowIndex;
                            tempRSpan = colHdRowCnt - this._colKeysCalcValues[cnt].level - 1;
                            this._cellType = "summary cstot";
                        }
                        else {
                            tempRIndx = rowIndex;
                            tempRSpan = (this._colKeysCalcValues.length == 1 && this._colKeysCalcValues[0].cellType == "RGTot") ? 1 : (this._isPaging ? this._colHdrLen : dataSource.columns.length);
                            this._cellType = "summary cgtot";
                        }
                    }
                    else {
                        tempRIndx = rowIndex;
                        tempRSpan = 1;
                        this._cellType = "colheader";
                    }
                    var expand = colKLen > 1 ? colKLen - kCnt > 1 ? 1 : (!ej.isNullOrUndefined(this._colKeysCalcValues[cnt].expander) ? 2 : 0) : (!ej.isNullOrUndefined(this._colKeysCalcValues[cnt].expander) ? 2 : 0);
                    for (var cCnt = 0; cCnt < tmpCnt; cCnt++) {
                        var obj = $.extend(true, [], this._colKeysCalcValues[cnt].keys);
                        this._gridMatrix[tempRIndx][(loopCnt * cnt) + cCnt + tempCnt - (cnt > 0 ? tolerance : 0)] = {
                            Index: colIndex + ',' + tempRIndx, CSS: this._cellType, Value: this._colKeysCalcValues[cnt].keys[kCnt], State: expand,
                            ColSpan: (cCnt > 0 ? 1 : this._isPaging && cnt == 0 && !ej.isNullOrUndefined(this._colKeysCalcValues[cnt].span) && this._colKeysCalcValues[cnt].span[kCnt] >= this._colKeysCalcValues.length ? dataSource.pagerOptions.categoricalPageSize : ((this._colKeysCalcValues[cnt].span != undefined ? this._colKeysCalcValues[cnt].span[kCnt] == undefined ? 1 : this._colKeysCalcValues[cnt].span[kCnt] : 1) * (this._colKeysCalcValues.length - cnt == 1 ? tmpCnt : loopCnt) - (cnt == 0 ? tolerance : 0))),
                            RowSpan: tempRSpan, Info: obj.splice(0, kCnt + 1).join('>#>'), Span: "None", Expander: (cCnt > 0 ? (!ej.isNullOrUndefined(this._colKeysCalcValues[cnt].expander) ? 1 : 0) : (this._colKeysCalcValues[cnt].span != undefined ? (this._colKeysCalcValues[cnt].span[kCnt] != undefined ? 1 : (!ej.isNullOrUndefined(this._colKeysCalcValues[cnt].expander) ? 1 : 0)) : (!ej.isNullOrUndefined(this._colKeysCalcValues[cnt].expander) ? 1 : 0)))
                        };
                    }
                    if (this._colKeysCalcValues[cnt].level - kCnt == 1)
                        delete this._colKeysCalcValues[cnt].span;
                    rowIndex++;
                }                
                if (dataSource.values.length > 0) {
                    for (var cCnt = 0; cCnt < tmpCnt; cCnt++) {
                        if (this._gridMatrix[lastRow] == undefined)
                            this._gridMatrix[lastRow] = new Array();
                        
                        var valPos = (this._isPaging && dataSource.values.length > 0 && cnt == 0) ? (((dataSource.pagerOptions.categoricalCurrentPage - 1) * dataSource.pagerOptions.categoricalPageSize) % dataSource.values.length) + cCnt : cCnt;
                        this._gridMatrix[lastRow][(loopCnt * cnt) + cCnt + tempCnt - (cnt > 0 ? tolerance : 0)] = {
                            Index: ((loopCnt * cnt) + cCnt + tempCnt - (cnt > 0 ? tolerance : 0)) + ',' + rowIndex, CSS: this._cellType + " calc", Value: dataSource.values[valPos].fieldCaption == undefined ? dataSource.values[valPos].fieldName : dataSource.values[valPos].fieldCaption, State: 0,
                            ColSpan: 1,
                            RowSpan: 1, Info: "", Span: "None", Expander: 0
                        };
                    }
                }
                colIndex++;
            }
            this._cellType = "";
            if (this._isPaging && dataSource.values.length > 0 && this._colKeysCalcValues.length > 0 && colHdRowCnt > 1) {
                for (var cCnt = 0; cCnt < colHdRowCnt; cCnt++) {
                    for (var rCnt = 0 ; rCnt < this._gridMatrix[cCnt].length; rCnt++) {
                        if (!ej.isNullOrUndefined(this._gridMatrix[cCnt][rCnt]) && this._gridMatrix[cCnt][rCnt].ColSpan > (this._gridMatrix[cCnt].length - rCnt))
                            this._gridMatrix[cCnt][rCnt].ColSpan = this._gridMatrix[cCnt].length - rCnt;
                    }
                }
            }
        },

        _populateCalcTable: function (dataSource) {
            var calValue = [],calTxt = null, calCnt = dataSource.values.length, currentObj = this;
            this._rowTotCalc = [];
            this._rowTotCalc = [];
            var colIndex = (dataSource.rows.length == 0 ? 1 : (this._isPaging ? this._rowHdrLen : dataSource.rows.length)), sTot = 0, isUniqe = false, totRIndx = 0;
            var rowIndex = (this._colKeysCalcValues.length == 1 && this._colKeysCalcValues[0].cellType == "RGTot") ? 2 : ((this._isPaging ? this._colHdrLen : dataSource.columns.length) + 1);
            var rwIndx = rowIndex, clIndx, totFlagR = false, totCIndx = 0, totFlagC = false;
            var calcValues = $.grep(this._tableKeysCalcValues, function (item) { if (ej.isNullOrUndefined(item.cellType)) return item });
            var calcTotValues = $.grep(this._tableKeysCalcValues, function (item) { if (!ej.isNullOrUndefined(item.cellType)) return item });            
            for (var rCnt = 0; rCnt < this._rowKeysCalcValues.length; rCnt++) {
                this._colTotCalc = []; clIndx = colIndex;
                isUniqe = true;
                if (this._gridMatrix[rCnt + rowIndex] == undefined)
                    this._gridMatrix[rCnt + rowIndex] = new Array();
                this._rowTotCalc[totRIndx] = new Array();

                for (var cCnt = 0; cCnt < this._colKeysCalcValues.length; cCnt++) {
                    calValue = [];
                    calTxt = null;
                    this._cellType = "value";
                    var calcStartPos = (this._isPaging && dataSource.values.length > 0 && cCnt == 0) ? (((dataSource.pagerOptions.categoricalCurrentPage - 1) * dataSource.pagerOptions.categoricalPageSize) % dataSource.values.length) : 0;
                    var calcEndPos = (this._isPaging && dataSource.values.length > 0 && this._colKeysCalcValues.length - cCnt == 1 && cCnt > 0) ? ((dataSource.pagerOptions.categoricalCurrentPage * dataSource.pagerOptions.categoricalPageSize) % dataSource.values.length) : calCnt;
                    calcEndPos = calcEndPos < 1 || (this._isPaging && dataSource.pagerOptions.categoricalPageSize >= ((dataSource.values.length * this._colKeysCalcValues.length) - (((dataSource.pagerOptions.categoricalCurrentPage - 1) * dataSource.pagerOptions.categoricalPageSize) % dataSource.values.length))) ? calCnt : calcEndPos;
                    if (dataSource.columns.length > 0 && dataSource.rows.length > 0) {
                        if (currentObj._isPaging && (currentObj._rowKeysCalcValues[rCnt].cellType == "RGTot" || currentObj._colKeysCalcValues[cCnt].cellType == "RGTot")) {
                            var cCount = 0;
                            $.grep(calcValues, function (item) {
                                if ((currentObj._rowKeysCalcValues[rCnt].cellType == "RGTot" && currentObj._colKeysCalcValues[cCnt].cellType == "RGTot") ? true : (currentObj._rowKeysCalcValues[rCnt].cellType == "RGTot" ? item.uniqueName.indexOf(currentObj._colKeysCalcValues[cCnt].uniqueName) > -1 : item.uniqueName.indexOf(currentObj._rowKeysCalcValues[rCnt].uniqueName) > -1)) {
                                    cCount++;
                                    for (ky = 0 ; ky < item.value.keys.length; ky++) {
                                        if (ej.isNullOrUndefined(calValue[ky]))
                                            calValue.push(item.value.keys[ky]);
                                        else {
                                            if (dataSource.values[ky].isCalculatedField)
                                                calValue[ky] = ej.PivotAnalysis._calculatedFieldSummaryValue(ky, calValue, dataSource);
                                            else
                                                calValue[ky] = ej.PivotAnalysis._getSummaryValue(calValue[ky], item.value.keys[ky], cCount, ej.PivotAnalysis._summaryTypes[ky] == "count" ? "sum" : ej.PivotAnalysis._summaryTypes[ky], dataSource.values[ky].format, dataSource.values[ky].formatString);
                                        }
                                    }
                                }
                            });
                        }
                        else {
                            $.grep((currentObj._isPaging && ((!ej.isNullOrUndefined(currentObj._rowKeysCalcValues[rCnt].cellType) && currentObj._rowKeysCalcValues[rCnt].cellType.indexOf("SubTot") > -1) || (!ej.isNullOrUndefined(currentObj._colKeysCalcValues[cCnt].cellType) && currentObj._colKeysCalcValues[cCnt].cellType.indexOf("SubTot") > -1))) ? calcTotValues : calcValues, function (item) {
                                if (item.uniqueName == currentObj._rowKeysCalcValues[rCnt].uniqueName + ">#>" + currentObj._colKeysCalcValues[cCnt].uniqueName) {
                                    for (ky = 0 ; ky < item.value.keys.length; ky++)
                                        calValue.push(item.value.keys[ky]);
                                    if (item.value.uniqueName != "")
                                        calTxt = item.value.uniqueName;
                                }
                                return;
                            });
                        }
                    }
                    else if (dataSource.rows.length == 0) {
                        if (currentObj._isPaging) {
                            var cCount = 0;
                            $.grep(calcValues, function (item) {
                                if (currentObj._colKeysCalcValues[cCnt].cellType == "RGTot" ? true : item.uniqueName.indexOf(currentObj._colKeysCalcValues[cCnt].uniqueName) > -1) {
                                    cCount++;
                                    for (ky = 0 ; ky < item.value.keys.length; ky++) {
                                        if (ej.isNullOrUndefined(calValue[ky]))
                                            calValue.push(item.value.keys[ky]);
                                        else {
                                            if (dataSource.values[ky].isCalculatedField)
                                                calValue[ky] = ej.PivotAnalysis._calculatedFieldSummaryValue(ky, calValue, dataSource);
                                            else
                                                calValue[ky] = ej.PivotAnalysis._getSummaryValue(calValue[ky], item.value.keys[ky], cCount, ej.PivotAnalysis._summaryTypes[ky] == "count" ? "sum" : ej.PivotAnalysis._summaryTypes[ky], dataSource.values[ky].format, dataSource.values[ky].formatString);
                                        }
                                    }
                                }
                            });
                        }
                        else {
                            $.grep(currentObj._tableKeysCalcValues, function (item) {
                                if (item.uniqueName == currentObj._colKeysCalcValues[cCnt].uniqueName) {
                                    for (ky = 0 ; ky < item.value.keys.length; ky++)
                                        calValue.push(item.value.keys[ky]);
                                    if (item.value.uniqueName != "")
                                        calTxt = item.value.uniqueName;
                                }
                                return;
                            });
                        }
                    }
                    else {
                        if (currentObj._isPaging) {
                            var cCount = 0;
                            $.grep(calcValues, function (item) {
                                if (currentObj._rowKeysCalcValues[rCnt].cellType == "RGTot" ? true : item.uniqueName.indexOf(currentObj._rowKeysCalcValues[rCnt].uniqueName) > -1) {
                                    cCount++;
                                    for (ky = 0 ; ky < item.value.keys.length; ky++) {
                                        if (ej.isNullOrUndefined(calValue[ky]))
                                            calValue.push(item.value.keys[ky]);
                                        else {
                                            if (dataSource.values[ky].isCalculatedField)
                                                calValue[ky] = ej.PivotAnalysis._calculatedFieldSummaryValue(ky, calValue, dataSource);
                                            else
                                                calValue[ky] = ej.PivotAnalysis._getSummaryValue(calValue[ky], item.value.keys[ky], cCount, ej.PivotAnalysis._summaryTypes[ky] == "count" ? "sum" : ej.PivotAnalysis._summaryTypes[ky], dataSource.values[ky].format, dataSource.values[ky].formatString);
                                        }
                                    }
                                }
                            });
                        }
                        else {
                            $.grep(currentObj._tableKeysCalcValues, function (item) {
                                if (item.uniqueName == currentObj._rowKeysCalcValues[rCnt].uniqueName) {
                                    for (ky = 0 ; ky < item.value.keys.length; ky++)
                                        calValue.push(item.value.keys[ky]);
                                    if (item.value.uniqueName != "")
                                        calTxt = item.value.uniqueName;
                                }
                                return;
                            });
                        }
                    }
                    if (this._editCellsInfo.length > 0)
                        for (var val = 0; val < dataSource.values.length; val++) {
                            calValue[val] = ej.PivotAnalysis._cellEdit((dataSource.columns.length > 0 && dataSource.rows.length > 0) ? (this._rowKeysCalcValues[rCnt].uniqueName + ">#>" + this._colKeysCalcValues[cCnt].uniqueName) : (dataSource.rows.length == 0 ? this._colKeysCalcValues[cCnt].uniqueName : this._rowKeysCalcValues[rCnt].uniqueName), calValue[val], val, dataSource.values[val]);
                        }
                    if (this._colKeysCalcValues[cCnt].cellType != undefined && (this._colKeysCalcValues[cCnt].cellType.indexOf("SubTot") > -1 || this._colKeysCalcValues[cCnt].cellType.indexOf("RGTot") > -1)) {
                        if (!this._isPaging) {
                            calValue = []; calTxt = null;
                            for (var ky = 0; ky < calCnt; ky++) {
                                var count = 0, cCount = 0;
                                for (var tCnt = clIndx ; tCnt <= ((cCnt * calCnt) + colIndex) ; tCnt++) {
                                    if (this._gridMatrix[rCnt + rowIndex] != undefined && this._gridMatrix[rCnt + rowIndex][clIndx + (count * calCnt) + ky] != undefined && this._gridMatrix[rCnt + rowIndex][clIndx + (count * calCnt) + ky].Value != undefined) {
                                        if (calValue[ky] == undefined)
                                            calValue[ky] = 0;
                                        cCount++;

                                        if (dataSource.values[ky].isCalculatedField)
                                            calValue[ky] = this._calculatedFieldSummaryValue(ky, calValue, dataSource);
                                        else
                                            calValue[ky] = this._getSummaryValue(calValue[ky], this._gridMatrix[rCnt + rowIndex][clIndx + (count * calCnt) + ky].Value, cCount, this._summaryTypes[ky] == "count" ? "sum" : this._summaryTypes[ky], dataSource.values[ky].format, dataSource.values[ky].formatString);
                                    }
                                    count++;
                                }

                            }
                            sTot = 0;
                            clIndx = ((cCnt + 1) * calCnt) + colIndex;
                            if (calValue != 0) {
                                this._colTotCalc.push({ uniqueName: this._colKeysCalcValues[cCnt].uniqueName, level: this._colKeysCalcValues[cCnt].level, value: calValue });
                            }
                            if (this._colKeysCalcValues[cCnt - 1] != undefined && this._colKeysCalcValues[cCnt - 1].cellType != undefined && this._colKeysCalcValues[cCnt - 1].cellType.indexOf("SubTot") > -1 && this._colKeysCalcValues[cCnt - 1].cellType.indexOf("RGTot") == -1) {
                                var tempVal = $(this._colTotCalc).filter(function (index, x) {
                                    return x != undefined && x.uniqueName != undefined && currentObj._colKeysCalcValues[cCnt].uniqueName != undefined && x.level != undefined && currentObj._colKeysCalcValues[cCnt].level != undefined && x.uniqueName.indexOf(currentObj._colKeysCalcValues[cCnt].uniqueName) === 0 && currentObj._colKeysCalcValues[cCnt].level + 1 == x.level;

                                }).map(function (ind, val) {
                                    for (var ky = 0; ky < val.value.length; ky++) {
                                        calValue[ky] = ej.isNullOrUndefined(calValue[ky]) ? 0 : calValue[ky];
                                        val.value[ky] = ej.isNullOrUndefined(val.value[ky]) ? 0 : val.value[ky];
                                        if (dataSource.values[ky].isCalculatedField)
                                            calValue[ky] = ej.PivotAnalysis._calculatedFieldSummaryValue(ky, calValue, dataSource);
                                        else
                                            calValue[ky] += val.value[ky];
                                    }
                                    return calValue;
                                });

                                if (calValue != 0) {
                                    this._colTotCalc.push({ uniqueName: this._colKeysCalcValues[cCnt].uniqueName, level: this._colKeysCalcValues[cCnt].level, value: calValue });

                                }
                            }
                        }
                        this._cellType = "summary value";
                    }
                    if (this._colKeysCalcValues[cCnt].cellType != undefined && this._colKeysCalcValues[cCnt].cellType.indexOf("RGTot") > -1 && calValue == 0) {
                        if (!this._isPaging) {
                            calValue = [];
                            calTxt = null;
                            var cCount = 0;
                            var tempVal = $(this._colTotCalc).filter(function (index, x) {
                                return x != undefined && x != undefined && x.level != undefined && x.level == 0;
                            }).map(function (ind, val) {

                                for (var ky = 0; ky < val.value.length; ky++) {
                                    calValue[ky] = ej.isNullOrUndefined(calValue[ky]) ? 0 : calValue[ky];
                                    val.value[ky] = ej.isNullOrUndefined(val.value[ky]) ? 0 : val.value[ky];
                                    cCount++;
                                    if (dataSource.values[ky].isCalculatedField)
                                        calValue[ky] = ej.PivotAnalysis._calculatedFieldSummaryValue(ky, calValue, dataSource);
                                    else
                                        calValue[ky] = ej.PivotAnalysis._getSummaryValue(calValue[ky], val.value[ky], cCount, currentObj._summaryTypes[ky] == "count" ? "sum" : currentObj._summaryTypes[ky], dataSource.values[ky].format, dataSource.values[ky].formatString);
                                }
                                return calValue;
                            });
                        }
                        this._cellType = "summary value";
                    }
                    if (this._rowKeysCalcValues[rCnt].cellType != undefined && (this._rowKeysCalcValues[rCnt].cellType.indexOf("SubTot") > -1 || this._rowKeysCalcValues[rCnt].cellType.indexOf("RGTot") > -1)) {
                        if (!this._isPaging) {
                            calValue = [];
                            calTxt = null;
                            var memberName = this._rowKeysCalcValues[rCnt].uniqueName;
                            if (this._rowKeysCalcValues[rCnt - 1] != undefined && this._rowKeysCalcValues[rCnt - 1].cellType != undefined && this._rowKeysCalcValues[rCnt - 1].cellType.indexOf("SubTot") > -1 && this._rowKeysCalcValues[rCnt].cellType.indexOf("RGTot") == -1) {
                                var cCount = 0;
                                var tempVal = $(this._rowTotCalc).filter(function (index, x) {
                                    return x[0] != undefined && x[0].uniqueName != undefined && currentObj._rowKeysCalcValues[rCnt].uniqueName != undefined && x[0].level != undefined && currentObj._rowKeysCalcValues[rCnt].level != undefined && x[0].uniqueName.indexOf(currentObj._rowKeysCalcValues[rCnt].uniqueName) === 0 && currentObj._rowKeysCalcValues[rCnt].level + 1 == x[0].level;
                                }).map(function (ind, val) {
                                    if (val[colIndex + cCnt].length > 0) {
                                        cCount++;
                                        for (var ky = 0; ky < val[colIndex + cCnt].length; ky++) {
                                            calValue[ky] = ej.isNullOrUndefined(calValue[ky]) ? 0 : calValue[ky];
                                            val[colIndex + cCnt][ky] = ej.isNullOrUndefined(val[colIndex + cCnt][ky]) ? 0 : val[colIndex + cCnt][ky];
                                            if (dataSource.values[ky].isCalculatedField)
                                                calValue[ky] = ej.PivotAnalysis._calculatedFieldSummaryValue(ky, calValue, dataSource);
                                            else
                                                calValue[ky] = ej.PivotAnalysis._getSummaryValue(calValue[ky], val[colIndex + cCnt][ky], cCount, currentObj._summaryTypes[ky] == "count" ? "sum" : currentObj._summaryTypes[ky], dataSource.values[ky].format);
                                        }
                                    }
                                    return calValue;
                                });
                            }
                            if (this._rowKeysCalcValues[rCnt].cellType != undefined && this._rowKeysCalcValues[rCnt].cellType.indexOf("RGTot") > -1) {
                                var cCount = 0;
                                var tempVal = $(this._rowTotCalc).filter(function (index, x) {
                                    return x != undefined && x[0] != undefined && x[0].level != undefined && x[0].level == 0;
                                }).map(function (ind, val) {
                                    if (val[colIndex + cCnt].length > 0) {
                                        cCount++;
                                        for (var ky = 0; ky < val[colIndex + cCnt].length; ky++) {
                                            calValue[ky] = ej.isNullOrUndefined(calValue[ky]) ? 0 : calValue[ky];
                                            val[colIndex + cCnt][ky] = ej.isNullOrUndefined(val[colIndex + cCnt][ky]) ? 0 : val[colIndex + cCnt][ky];
                                            if (dataSource.values[ky].isCalculatedField)
                                                calValue[ky] = ej.PivotAnalysis._calculatedFieldSummaryValue(ky, calValue, dataSource);
                                            else
                                                calValue[ky] = ej.PivotAnalysis._getSummaryValue(calValue[ky], val[colIndex + cCnt][ky], cCount, currentObj._summaryTypes[ky] == "count" ? "sum" : currentObj._summaryTypes[ky], dataSource.values[ky].format, dataSource.values[ky].formatString);
                                        }
                                    }
                                    return calValue;
                                });
                            }
                            var cCount = 1;
                            for (var tCnt = rwIndx ; tCnt <= (rCnt + rowIndex) ; tCnt++) {
                                var isAvailable = false;
                                for (var ky = 0; ky < calCnt; ky++) {
                                    var count = 0;
                                    if (this._gridMatrix[tCnt] != undefined && this._gridMatrix[tCnt][colIndex + (cCnt * calCnt) + ky] != undefined && this._gridMatrix[tCnt][colIndex + (cCnt * calCnt) + ky].Value != undefined) {
                                        if (calValue[ky] == undefined)
                                            calValue[ky] = 0;
                                        isAvailable = true;
                                        if (dataSource.values[ky].isCalculatedField)
                                            calValue[ky] = this._calculatedFieldSummaryValue(ky, calValue, dataSource);
                                        else
                                            calValue[ky] = this._getSummaryValue(calValue[ky], this._gridMatrix[tCnt][colIndex + (cCnt * calCnt) + ky].Value, cCount, this._summaryTypes[ky] == "count" ? "sum" : this._summaryTypes[ky], dataSource.values[ky].format, dataSource.values[ky].formatString);
                                    }
                                    count++;
                                }
                                if (isAvailable) cCount++;
                            }

                            sTot = 0;
                            totFlagR = true;
                            if (isUniqe) {
                                this._rowTotCalc[totRIndx][0] = { uniqueName: this._rowKeysCalcValues[rCnt].uniqueName, level: this._rowKeysCalcValues[rCnt].level };
                                isUniqe = false;
                            }
                            this._rowTotCalc[totRIndx][colIndex + cCnt] = calValue;
                        }
                        this._cellType = "summary value";
                    }

                    //VALUE FILTER IMPLEMENTTAION
                    if (dataSource.enableAdvancedFilter) {
                        var filterIndex = 0, me = this, filterVal;
                        var fieldItem = this._currentFilterVal.fieldName ? ej.Pivot.getReportItemByFieldName(this._currentFilterVal.fieldName, dataSource) : null;
                        if (fieldItem != null && fieldItem.axis == "rows")
                            filterIndex = this._getFilteredIndex(dataSource.rows, dataSource.values, rCnt, me._rowKeysCalcValues);
                        if (!ej.isNullOrUndefined(filterIndex) && fieldItem != null && fieldItem.axis != "rows")
                            filterIndex = this._getFilteredIndex(dataSource.columns, dataSource.values, cCnt, me._colKeysCalcValues);

                        if (!ej.isNullOrUndefined(filterIndex)) {
                            var rowFilterValue = (this._rowKeysCalcValues[rCnt].keys.length > 0 && dataSource.rows.length > 0 && dataSource.rows[this._rowKeysCalcValues[rCnt].keys.length - 1].advancedFilter && dataSource.rows[this._rowKeysCalcValues[rCnt].keys.length - 1].advancedFilter.length > 0 && dataSource.rows[this._rowKeysCalcValues[rCnt].keys.length - 1].advancedFilter[0].advancedFilterType == ej.Pivot.AdvancedFilterType.ValueFilter) ? 1 : null;
                            var isRowFiltered = (fieldItem && fieldItem != null && rowFilterValue != null && dataSource.rows[this._rowKeysCalcValues[rCnt].keys.length - 1].fieldName == fieldItem.item.fieldName) ? this._applyValueFilter(
                                dataSource.rows[this._rowKeysCalcValues[rCnt].keys.length - 1].advancedFilter
                                , calValue[filterIndex]) : false;

                            //ROW FILTER
                            if ((this._colKeysCalcValues[cCnt].keys.indexOf("Grand Total") >= 0) && isRowFiltered && this._rowKeysCalcValues[rCnt].uniqueName)
                                this._advancedFilterInfo.push(this._rowKeysCalcValues[rCnt].uniqueName);
                            else if (dataSource.columns.length == 0 && isRowFiltered && this._rowKeysCalcValues[rCnt].uniqueName)
                                this._advancedFilterInfo.push(this._rowKeysCalcValues[rCnt].uniqueName);

                            // COLUMN FILTER
                            var colFilterValue = (this._colKeysCalcValues[cCnt].keys.length > 0 && dataSource.columns.length > 0 && dataSource.columns[this._colKeysCalcValues[cCnt].keys.length - 1].advancedFilter && dataSource.columns[this._colKeysCalcValues[cCnt].keys.length - 1].advancedFilter.length > 0 && dataSource.columns[this._colKeysCalcValues[cCnt].keys.length - 1].advancedFilter[0].advancedFilterType == ej.Pivot.AdvancedFilterType.ValueFilter) ? 1 : null;
                            var isColFiltered = (fieldItem != null && colFilterValue != null && dataSource.columns[this._colKeysCalcValues[cCnt].keys.length - 1].fieldName == fieldItem.item.fieldName) ? this._applyValueFilter(dataSource.columns[this._colKeysCalcValues[cCnt].keys.length - 1].advancedFilter, calValue[filterIndex]) : false;

                            if (this._colKeysCalcValues[cCnt].uniqueName && jQuery.type(this._rowKeysCalcValues[rCnt].keys[0]) === "string" && this._rowKeysCalcValues[rCnt].keys[0].indexOf("Grand Total") > -1 && isColFiltered)
                                this._advancedFilterInfo.push(this._colKeysCalcValues[cCnt].uniqueName);
                        }
                    }

                    var diff = (this._isPaging && dataSource.values.length > 0) ? (((dataSource.pagerOptions.categoricalCurrentPage - 1) * dataSource.pagerOptions.categoricalPageSize) % dataSource.values.length) : 0;
                    for (var val = calcStartPos; val < calcEndPos; val++) {
                        if (calValue != undefined && calValue.length != undefined) {
                            var valTxt = null;
                            if (calTxt != null && calTxt[val] != "" && calTxt[val] != " ")
                                valTxt = calTxt[val];
                            this._gridMatrix[rowIndex + rCnt][(calCnt * cCnt) + val + colIndex - diff] = {
                                Index: ((calCnt * cCnt) + val + colIndex - diff) + ',' + rowIndex + rCnt, CSS: this._cellType, Value: calValue[val], valueText: valTxt, State: 0,
                                ColSpan: 1,
                                RowSpan: 1, Info: "", Span: "None", Expander: 0
                            };
                        }
                        else
                            this._gridMatrix[rowIndex + rCnt][(calCnt * cCnt) + val + colIndex - diff] = 0;
                    }
                }
                if (totFlagR) {
                    totRIndx++;
                    rwIndx = rCnt + rowIndex + 1; totFlagR = false;
                }
            }
            for (var rCnt = 0; rCnt < this._rowKeysCalcValues.length; rCnt++) {
                for (cCnt = 0; cCnt < this._colKeysCalcValues.length; cCnt++) {
                    var calcStartPos = (this._isPaging && dataSource.values.length > 0 && cCnt == 0) ? (((dataSource.pagerOptions.categoricalCurrentPage - 1) * dataSource.pagerOptions.categoricalPageSize) % dataSource.values.length) : 0;
                    var calcEndPos = (this._isPaging && dataSource.values.length > 0 && this._colKeysCalcValues.length - cCnt == 1 && cCnt > 0) ? ((dataSource.pagerOptions.categoricalCurrentPage * dataSource.pagerOptions.categoricalPageSize) % dataSource.values.length) : calCnt;
                    calcEndPos = calcEndPos < 1 || (this._isPaging && dataSource.pagerOptions.categoricalPageSize >= ((dataSource.values.length * this._colKeysCalcValues.length) - (((dataSource.pagerOptions.categoricalCurrentPage - 1) * dataSource.pagerOptions.categoricalPageSize) % dataSource.values.length))) ? calCnt : calcEndPos;
                    for (var val = calcStartPos; val < calcEndPos; val++) {
                        if (dataSource.values[val].isCalculatedField && this._gridMatrix[rowIndex + rCnt][(calCnt * cCnt) + val + colIndex - diff].Value == null) {
                            this._gridMatrix[rowIndex + rCnt][(calCnt * cCnt) + val + colIndex - diff].Value = this._calculatedFieldSummaryValue(val, [], dataSource);
                        }
                    }
                }
            }
            return this._gridMatrix;
        }
    }

    ej.PivotAnalysis.SortOrder = {
        Ascending: "ascending",
        Descending: "descending",
        None:"none"
    };

    ej.PivotAnalysis.FilterType = {
        Exclude: "exclude",
        Include: "include"
    };

    ej.PivotAnalysis.SummaryType = {
        Sum: "sum",
        Average: "average",
        Count: "count",
        Min: "min",
        Max: "max"
    };

})(jQuery, Syncfusion);