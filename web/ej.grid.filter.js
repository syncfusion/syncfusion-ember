(function ($, ej, undefined) {
    ej.gridFeatures = ej.gridFeatures || {};
    ej.gridFeatures.filter = {

        getFilterBar: function () {
            return this._gridFilterBar;
        },

        setGridFilterBar: function (value) {
            this._gridFilterBar = value;
        },

        filterColumn: function (fieldName, filterOperator, filterValue, predicate, matchcase, actualFilterValue, actualOperator) {
            if (!this.model.allowFiltering)
                return;
            var column = this.getColumnByField(fieldName), _format;
            if (!ej.isNullOrUndefined(column) && !ej.isNullOrUndefined(column.filterBarTemplate) && column.type == "boolean" && filterValue == "true" || filterValue == "false")
                filterValue = JSON.parse(filterValue);
            if (column && ej.isNullOrUndefined(column.format)) {
                if (column.type == "date")
                    _format = ej.preferredCulture().calendar.patterns.d; //System Date format
                else if (column.type == "datetime")
                    _format = ej.preferredCulture().calendar.patterns.f; //System DateTime format
            }
            else if (column)
                _format = column.format.replace("{0:", "").replace('}', "");
            if (!ej.isNullOrUndefined(column) && !ej.isNullOrUndefined(column.filterBarTemplate) && (column.type == "date" || column.type == "datetime") && filterValue.length > 0) {
                filterValue = ej.parseDate(filterValue, _format, this.model.locale);
            }
            var filterCollection = [];
            if (typeof (fieldName) == "object")
                filterCollection = fieldName;
            else
                filterCollection.push({ field: fieldName, operator: filterOperator, value: filterValue, predicate: predicate, matchcase: matchcase, actualFilterValue: actualFilterValue });

            for (var i = 0; i < filterCollection.length; i++) {
                var fieldName = filterCollection[i].field, filterOperator = filterCollection[i].operator,
                filterValue = filterCollection[i].value, predicate = filterCollection[i].predicate,
                matchcase = !ej.isNullOrUndefined(filterCollection[i].matchcase) ? filterCollection[i].matchcase : false, actualFilterValue = filterCollection[i].actualFilterValue;
                var args = {};
                args.requestType = ej.Grid.Actions.Filtering;
                args.currentFilterObject = [];
                this._$curFieldName = fieldName;
                if (!$.isArray(filterOperator))
                    filterOperator = $.makeArray(filterOperator);
                if (!$.isArray(filterValue))
                    filterValue = $.makeArray(filterValue);
                if (!$.isArray(predicate))
                    predicate = $.makeArray(predicate);
                var firstLoop = false;
                var filterCol = this._filterCollection;
                this._currentFilterColumn =(!ej.isNullOrUndefined(column) && !ej.isNullOrUndefined(column.foreignKeyValue) && (this._$curFilterValue != column.foreignKeyValue) && ej.isNullOrUndefined(column.filterBarTemplate))? this._currentFilterColumn :this.getColumnByField(fieldName);
                for (var index = 0; index < filterOperator.length; index++) {
                    var filterObject = {
                        field: fieldName,
                        operator: filterOperator[index],
                        value: filterValue[index],
                        matchcase: matchcase,
                        predicate: predicate[index],
                        actualFilterValue: ej.getObject("value", actualFilterValue),
                        actualOperator: ej.getObject("operator", actualFilterValue)
                    };
                    var predicated = ej.getObject("ejpredicate", actualFilterValue);
                    if (predicated)
                        filterObject = predicated;
                    if ((this._$colType == null || this.model.filterSettings.filterType == "filterbar") && !ej.isNullOrUndefined(this._currentFilterColumn))
                        this._$colType = this._currentFilterColumn.type;
                    if (this.model.filterSettings.filteredColumns.length == 0 && filterObject.value !== "") {
                        if ((this._$colType == "date" || this._$colType == "datetime") && this.model.filterSettings.filterType !== "excel" && (filterOperator == "equal" || filterOperator == "notequal") && typeof (filterObject.value) !== "string")
                            this._setDateFilters(filterObject);
                        else
                            this.model.filterSettings.filteredColumns.push(filterObject);
                    } else {
                        var proxy = this;
                        if (!firstLoop) {
                            var dataManger = ej.DataManager(this.model.filterSettings.filteredColumns);
                            var query = new ej.Query().where("field", ej.FilterOperators.equal, filterObject.field);
                            var object = dataManger.executeLocal(query);
                            for (var j = 0; j < object.length; j++) {
                                var objectIndex = $.inArray(object[j], this.model.filterSettings.filteredColumns)
                                if (objectIndex != -1)
                                    this.model.filterSettings.filteredColumns.splice(objectIndex, 1);
                            }
                        }
                        if (filterObject.value !== "") {
                            if ((this._$colType == "date" || this._$colType == "datetime") && this.model.filterSettings.filterType !== "excel" && (filterOperator == "equal" || filterOperator == "notequal") && typeof (filterObject.value) !== "string")
                                this._setDateFilters(filterObject);
                            else
                                this.model.filterSettings.filteredColumns.push(filterObject);
                        }
                    }
                    firstLoop = true;
                    args.currentFilterObject.push(filterObject);
                }
                args.filterCollection = this.model.filterSettings.filteredColumns;
                args.currentFilteringColumn = fieldName;
                var returnValue = this._processBindings(args);
                if (returnValue) {
                    this.model.filterSettings.filteredColumns.reverse().splice(0, filterOperator.length);
                    this.model.filterSettings.filteredColumns.reverse();
                }
                if (this.model.filterSettings.filterType == "filterbar") {
					var filterbaroperator = null, operSymbols = ej.data.operatorSymbols;
					for(var oper in operSymbols){
						if(operSymbols[oper] == filterOperator[0]){
							filterbaroperator=oper; 
							break;
						}
					}
				    var col = this._currentFilterColumn;
			        var fltrId = !ej.isNullOrUndefined(col) && ej.isNullOrUndefined(col["foreignKeyValue"]) ? fieldName : fieldName  + "_" + col["foreignKeyValue"] ;
					var filterBarCell = this.getHeaderTable().find("#" + fltrId.replace(/[^a-z0-9|s\_]/gi, '') + "_filterBarcell"), reg = /[<=|>=|<|>]+/;
                    var checkOper = !ej.isNullOrUndefined(operSymbols[filterBarCell.val().match(reg)]) && operSymbols[filterBarCell.val().match(reg)][0] == filterbaroperator;
                    if (filterBarCell.val() == "" || ((filterBarCell.val() != filterValue) || !checkOper) && !this._fltrBarcell) {
                        if (filterValue[0] instanceof Date)
                            this._setFilterbarValues(filterBarCell,ej.format(filterValue[0], _format, this.model.locale),filterOperator[0]);
                        else
                            this._setFilterbarValues(filterBarCell,filterValue[0],filterOperator[0]);
                        this._currentFilterbarValue = filterValue;
                        this.filterStatusMsg = "";
                        this._showFilterMsg();
                    }
                }
                if (!ej.isNullOrUndefined(column) && !ej.isNullOrUndefined(column.filterBarTemplate)) {
                    this.filterStatusMsg = "";
                    this._currentFilterbarValue = args.currentFilterObject[0].value;
                    if (this._oldFilterColumn != column && (this.filterColumnCollection.length > 0 && $.inArray(column, this.filterColumnCollection) == -1))
                        this.filterColumnCollection.push(column);
                    this._oldFilterColumn = this._currentFilterColumn = column;
                    this._showFilterMsg();
                }
                this._fltrBarcell = false;
            }
        },

        search: function (searchString) {
            var args = {};
            if ($("#" + this._id + "_search").find("input").val() != searchString);
            $("#" + this._id + "_search").find("input").val(searchString);
            args.requestType = ej.Grid.Actions.Search;
            args.keyValue = searchString;
            this.model.searchSettings.fields = this.model.searchSettings.fields.length != 0 ? this.model.searchSettings.fields : this.getColumnFieldNames();
            if (searchString != "" || this.model.searchSettings.key != "") {
                this.model.searchSettings.key = searchString.toLowerCase() == this.localizedLabels.True.toLowerCase() ? "true" : searchString.toLowerCase() == this.localizedLabels.False.toLowerCase() ? "false" : searchString;
                this._processBindings(args);
            }
            this._primaryKeyValues = [];
        },
        _filterBarHandler: function (e) {
            var keycode = e.keyCode, $target = $(e.target);
            if ($target.closest(".e-grid").attr("id") !== this._id)
                return;
            if ((this.model.filterSettings["filterBarMode"] == "immediate" || keycode == 13) && keycode != 9) {
                var $target = $(e.target);
                this.filterStatusMsg = "";
                var fieldName = $target.prop("id").replace("_filterBarcell", "");
                var column;
                for (var k = 0; k < this.model.columns.length; k++) {
                    if (!ej.isNullOrUndefined(this.model.columns[k].foreignKeyValue) && fieldName.indexOf("_" + this.model.columns[k].foreignKeyValue) != -1) {
                        column = this.model.columns[k];
                        break;
                    }
                    else
                        if (this.model.columns[k].field.replace(/[^a-z0-9|s\_]/gi, '') == fieldName) {
                            column = this.model.columns[k];
                            break;
                        }
                }
                if (column == null)
                    return;
                this._currentFilterColumn = column;
                this._$curFieldName = column.field;
				this._$curFilterValue = column.foreignKeyValue; 
                if (this._currentFilterColumn != this._oldFilterColumn)
                    this.filterValueOldLength = 0;
                this._currentFilterbarValue = $target.val().toLowerCase() == this.localizedLabels.True.toLowerCase() ? "true" : $target.val().toLowerCase() == this.localizedLabels.False.toLowerCase() ? "false" : $target.val();
                this.filterValueCurrentLength = this._currentFilterbarValue.length;
                if (((this.filterValueCurrentLength == 0 && this.filterValueOldLength == 0) || this._currentFilterbarValue == this.OldfilterValue) && this._currentFilterColumn == this._oldFilterColumn && !this.model.scrollSettings.enableVirtualization) {
                    this._showFilterMsg();
                    return;
                }
                this._skipFilterProcess = this._checkForSkipInput();
                if (!this._skipFilterProcess) {
                    this._processFilter(e);
                } else {
                    if (this._currentFilterColumn.type == "string") {
                        this.filterStatusMsg = "Invalid Filter Data";
                        this._showFilterMsg();
                    } else {
                        this._skipFilterProcess = false;
                        if (!this.model.scrollSettings.enableVirtualization)
                            this._showFilterMsg();
                        return;
                    }
                }
            }
        },
       _renderResponsiveFilter: function () {
            var $outerDiv = ej.buildTag('div#'+this._id+'responsiveFilter.e-resFilterDiv', '', { 'width': '100%', 'padding': '0px' });
            var height = $(window).height() + 1;
            var headerHieght = height * (8 / 100);
            var width = this.element.height() > height ? $(window).width() + 16.5 : $(window).width();
            var $columnDiv = ej.buildTag('div.columnDiv', '', { width: '100%' });
            for (var i = 0; i < this.model.columns.length; i++) {
                var $cDiv = ej.buildTag('div.e-responsivefilterColDiv', '', { width: '100%' }, { 'data-ej-mappingname': this.model.columns[i].field });
                var $span = ej.buildTag('span', this.model.columns[i].headerText, { 'margin-left': '4%' });
                $cDiv.append($span);
                $columnDiv.append($cDiv);
            }
            $outerDiv.append($columnDiv);
            this.element.append($outerDiv);
            var gridObj = this;
            var widt = this.element.outerWidth();
            var $headerDiv = ej.buildTag('div.e-resFilterDialogHeaderDiv', '', { 'height': headerHieght });
            var $span = ej.buildTag('div.e-labelRes', '<span>Filter</span>');
            var $resIcon = ej.buildTag('div.e-resFilterleftIcon', '', { 'margin-top': '3%' });
            var $resspan = ej.buildTag('span.e-icon e-responsiveFilterClear e-resIcon', '', { 'font-size': '23px' });
            var $divIcon = ej.buildTag('div.e-resFIlterRigthIcon', '', { 'float': 'right', 'margin-top': '3%' }, { closeDialogue: 'responsiveFilter', gridEle: true });
            var $spanIcon = ej.buildTag('span.e-icon e-responisveClose e-resIcon', '', { 'font-size': '23px' }, { closeDialogue: 'responsiveFilter', gridEle: true });
            $divIcon.click(function (e) {
                $("#"+gridObj._id+"responsiveFilter").css('display', 'none');
                gridObj.element.css('display', 'block');
            });
            $resIcon.click(function (e) {
                $("#"+gridObj._id+"responsiveFilter").find('.e-responsivefilterColDiv').find('.e-filternone').click();
            });
            $headerDiv.append($resIcon.append($resspan));
            $headerDiv.append($span).append($divIcon.append($spanIcon));
            $outerDiv.prepend($headerDiv);
            $outerDiv.insertAfter(this.element);
            $outerDiv.css('display', 'none');		
            this._on($("#"+this._id+"responsiveFilter"),"click", ".e-responsivefilterColDiv", $.proxy(this._mouseClickHandler, this)) ;
        },
        _closeDivIcon: function (sender) {
            var $div = $(sender.target);
            if (!ej.isNullOrUndefined($div.attr('closeDialogue'))) {
                var $dialog = $("#" + $div.attr('closeDialogue'));
                if (!ej.isNullOrUndefined($dialog.data('ejDialog')))
                    $dialog.ejDialog('close');
                else
                    $dialog.css('display', 'none');
            }
            if (!ej.isNullOrUndefined($div.attr('gridEle'))) {
                this.element.css('display', 'block');
            }
            if (!ej.isNullOrUndefined($div.attr('openDialogue'))) {
                if (this.model.enableResponsiveRow || $div.attr('closeDialogue').indexOf('Custom') != -1) {
                    var $dialog = $("#" + $div.attr('openDialogue'));
                    if (!ej.isNullOrUndefined($dialog.data('ejDialog')))
                        $dialog.ejDialog('open');
                    else
                        $dialog.css('display', 'block');
                }
                else
                    this.element.css('display', 'block');
            }
        },
        _setResponsiveFilterIcon: function () {
            var $div = $("#"+this._id+"responsiveFilter").find('.columnDiv'), $proxy = this;
            $div.find('.e-filtericon').remove();
            for (var i = 0; i < this.model.filterSettings.filteredColumns.length; i++) {
                var column = this.model.filterSettings.filteredColumns[i];
                var $selcDiv = $div.find('.e-responsivefilterColDiv[data-ej-mappingname=' + column.field + ']');
                var $divIcon = ej.buildTag('div.e-filtericon e-icon e-resIcon e-filterset e-filternone e-filterreset', '', { float: 'right', height: '22px', width: '21px', 'font-size': '20px', 'margin-right': '3%', 'margin-top': '2%' });
                var $iconSapn = ej.buildTag('span.e-filtericon e-icon e-resIcon e-filterset e-filternone', '', {}, { 'colType': column.type });
                $selcDiv.find('.e-filternone').remove();
                $selcDiv.append($divIcon);
                $iconSapn.click(function (e) {
                    var $target = e.target;
                    $proxy._$colType = $target.attr('colType');
                    $proxy._fltrClrHandler();
                    $target.remove();
                })
            }
        },
        _renderExcelFilter: function () {
            var filterCol = this.model.filterSettings.filteredColumns.length != 0 ? this.model.filterSettings.filteredColumns[0].field : null;
            var model = {
                instance: this,
                showSortOptions: this.model.allowSorting,
                allowFormatFiltering: this.model.filterSettings.allowFormatFiltering,
                allowCaseSensitive: this.model.filterSettings.enableCaseSensitivity,
                maxFilterLimit: this.model.filterSettings.maxFilterChoices,
                interDeterminateState: this.model.filterSettings.enableInterDeterminateState,
                enableComplexBlankFilter: this.model.filterSettings.enableComplexBlankFilter,
                blankValue: this.model.filterSettings.blankValue,
                filterHandler: ej.proxy(this._filterHandler, this),
                initFilterCol: filterCol,
                actionBegin: "actionBegin",
                actionComplete: "actionComplete"
            };
            this._excelFilter = new ej.excelFilter(model);
            $.extend(this._excelFilter, this.model.filterSettings);
        },
        _filterHandler: function (args) {
            var arg = {}, fQMgr;
            arg.requestType = args.action == "sorting" ? args.action : "filtering";
            var temp = this.model.filterSettings.filteredColumns;
            if (args.action == "filtering") {
                fQMgr = ej.DataManager(this.model.filterSettings.filteredColumns);
                var query = new ej.Query().where("field", ej.FilterOperators.equal, args.fieldName);
                var object = fQMgr.executeLocal(query);
                for (var i = 0; i < object.length; i++) {
                    var objectIndex = $.inArray(object[i], this.model.filterSettings.filteredColumns)
                    if (objectIndex != -1)
                        this.model.filterSettings.filteredColumns.splice(objectIndex, 1);
                }
                ej.merge(this.model.filterSettings.filteredColumns, args.filterCollection);
                args.currentFilterCollection = args.filterCollection;
            }
            else if (args.action == "clearfiltering") {
                var filterObj = args.filterDetails;
                delete this._excelFilter._predicates[0][args.fieldName];
                this.filterColumn(filterObj.field, filterObj.operator, filterObj.value, filterObj.predicate);
                for (var i = 0; i < this.filterColumnCollection.length; i++) {
                    if (this.filterColumnCollection[i].field == filterObj.field)
                        this.filterColumnCollection.splice(i, 1);
                }
                return;
            }
            else if (args.action == "sorting") {
                var sortObj = args.sortDetails;
                if (ej.gridFeatures.sort)
                    this.sortColumn(sortObj.field, sortObj.direction);
                this._excelFilter.closeXFDialog();
                return;
            }

            arg.currentFilteringColumn = args.fieldName;
			arg.filterCollection = args.filterCollection;
            arg.predicated = args.ejpredicate;
            var returnValue = this._processBindings(arg);
            if (returnValue)
                this.model.filterSettings.filteredColumns = temp;
        },
        _renderFiltering: function () {
            var $headerTable = this.getHeaderTable(), args, temp;
            var $tr = ej.buildTag('tr.e-filterbar'), $trClone, filteredFields = [], $input;
            if (this.model.detailsTemplate || this.model.childGrid) $tr.append(ej.buildTag('th.e-filterbarcell e-mastercell'));
            for (var column = 0; column < this.model.columns.length; column++) {
                var $th = ej.buildTag('th.e-filterbarcell'), $div = ej.buildTag('div.e-filterdiv'), $span = ej.buildTag('span.e-cancel e-icon e-hide');
                var fltrField = ej.isNullOrUndefined(this.model.columns[column]["field"]) ? this.model.columns[column]["field"] : this.model.columns[column].field.replace(/[^a-z0-9|s_]/gi, ''), fltrId = ej.isNullOrUndefined(this.model.columns[column]["foreignKeyValue"]) ? fltrField + "_filterBarcell" : fltrField + "_" + this.model.columns[column]["foreignKeyValue"] + "_filterBarcell";
                if(!ej.isNullOrUndefined(this.model.columns[column]["priority"]))
					$($th).addClass("e-table-priority-" + this.model.columns[column]["priority"]);
				if (this.model.columns[column]["allowFiltering"] != false && !ej.isNullOrUndefined(this.model.columns[column].filterBarTemplate) && !ej.isNullOrUndefined(this.model.columns[column]["field"])) {
                    $th.addClass('e-fltrtemp');
                    $div.addClass('e-fltrtempdiv');
                    if (ej.isNullOrUndefined(this.model.columns[column].filterBarTemplate.create)) {
                        $input = ej.buildTag('input e-filtertext', "", {}, { title: this.model.columns[column]["headerText"] + this.localizedLabels.FilterbarTitle, id: fltrId, "class": "e-filterUi_input e-filtertext e-fltrTemp" });
                    }
                    else {
                        args = { columnIndex: column, column: this.model.columns[column] }
                        temp = this.model.columns[column].filterBarTemplate.create;
                        if (typeof temp == "string")
                            temp = ej.util.getObject(temp, window);
                        $input = temp(args)
                        $input = $($input).attr({ title: this.model.columns[column]["headerText"] + this.localizedLabels.FilterbarTitle, id: fltrId, "class": "e-filterUi_input e-filtertext e-fltrTemp" });
                    }
                }
                else {
                    $div.addClass('e-fltrinputdiv');
                    var fltrField = this.model.columns[column]["field"], fltrId = ej.isNullOrUndefined(this.model.columns[column]["foreignKeyValue"]) ? fltrField + "_filterBarcell" : fltrField + "_" + this.model.columns[column]["foreignKeyValue"] + "_filterBarcell";
                    $input = ej.buildTag('input.e-ejinputtext e-filtertext', "", {}, { title: this.model.columns[column]["headerText"] + this.localizedLabels.FilterbarTitle, type: "search", id: fltrId.replace(/[^a-z0-9|s\_]/gi, '') });
                }
                if (this.model.filterSettings.filteredColumns.length > 0 && this.model.filterSettings.filterType == "filterbar" && $.inArray(this.model.columns[column].field, filteredFields) == -1) {
                    for (var fColumn = 0; fColumn < this.model.filterSettings.filteredColumns.length; fColumn++) {
                        if (this.getColumnIndexByField(this.model.filterSettings.filteredColumns[fColumn].field) == column) {
                            this._setFilterbarValues($input,this.model.filterSettings.filteredColumns[fColumn].value,this.model.filterSettings.filteredColumns[fColumn].operator);
                            if ($.inArray(this.model.filterSettings.filteredColumns[fColumn].field, filteredFields) == -1) filteredFields.push(this.model.filterSettings.filteredColumns[fColumn].field);
                        }
                    }
                }
                if (this.model.columns[column]["allowFiltering"] === false || this.model.columns[column]["field"] == "" || ej.isNullOrUndefined(this.model.columns[column]["field"])) {
                    $input.attr("disabled", true).addClass("e-disable");
                    this._disabledFilterableColumns.push(this.model.columns[column]["headerText"]);
                }
                this.model.columns[column]["visible"] === false && $th.addClass("e-hide");
                !ej.isNullOrUndefined(this.model.columns[column]["cssClass"]) && $th.addClass(this.model.columns[column]["cssClass"]);
                if (this.model.columns[column]["allowFiltering"] != false && !ej.isNullOrUndefined(this.model.columns[column].filterBarTemplate))
                    $div.append($input);
                else
                    $div.append($input).append($span);
                $tr.append($th.append($div));
                if (column == this.model.scrollSettings.frozenColumns - 1) {
                    $trClone = $tr.clone();
                    $headerTable.find("thead").first().append($trClone);
                    $tr.empty();
                }
            }
            $headerTable.find("thead").last().append($tr);
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 10) {
                var filterBarCell = $headerTable.find("thead").find(".e-ejinputtext.e-filtertext");
                for (var cell = 0; cell < filterBarCell.length; cell++)
                    ej.ieClearRemover(filterBarCell[cell]);
            }
            this.setGridFilterBar($tr);
        },
        _renderFilterBarTemplate: function () {
            var args, temp1, temp2, flag = false;
            for (var count = 0 ; count < this.model.columns.length; count++) {
                if (this.model.columns[count]["allowFiltering"] != false && !ej.isNullOrUndefined(this.model.columns[count].filterBarTemplate) && !ej.isNullOrUndefined(this.model.columns[count]["field"])) {
                    temp1 = this.model.columns[count].filterBarTemplate.read;
                    if (typeof temp1 == "string")
                        temp1 = ej.util.getObject(temp1, window);
                    if (this.model.columns[count].foreignKeyField)
                        args = { element: this.getHeaderTable().find('.e-filterbar').find('.e-fltrtemp').find("#" + this.model.columns[count].field.replace(/[^a-z0-9|s_]/gi, '') + "_" + this.model.columns[count].foreignKeyValue.replace(/[^a-z0-9|s_]/gi, '') + "_filterBarcell"), columnIndex: count, column: this.model.columns[count] }
                    else
                        args = { element: this.getHeaderTable().find('.e-filterbar').find('.e-fltrtemp').find("#" + this.model.columns[count].field.replace(/[^a-z0-9|s_]/gi, '') + "_filterBarcell"), columnIndex: count, column: this.model.columns[count] }
                    if (typeof args.column.filterBarTemplate.read == "string")
                        args.column.filterBarTemplate.read = temp1;
                    temp2 = this.model.columns[count].filterBarTemplate.write;
                    if (typeof temp2 == "string")
                        temp2 = ej.util.getObject(temp2, window);
                    if (this.model.filterSettings.filteredColumns.length > 0) {
                        for (var index = 0 ; index < this.model.filterSettings.filteredColumns.length; index++) {
                            if (this.model.columns[count].field == this.model.filterSettings.filteredColumns[index].field)
                                args.modelVal = this.model.filterSettings.filteredColumns[index].value;
                        }
                    }
                    temp2.call(this, args);
                    flag = true
                }
            }
            if (flag)
                this.model.filterSettings.filterBarMode = ej.Grid.FilterBarMode.OnEnter;
        },
        _closeFilterDlg: function () {
            if (!ej.isNullOrUndefined($("#" + this._id + "_" + this._$colType + "Dlg").data('ejDialog')))
                $("#" + this._id + "_" + this._$colType + "Dlg").ejDialog('close');
            else
                $("#" + this._id + "_" + this._$colType + "Dlg").css('display', 'none');
            this._$fDlgIsOpen = false;
            this._$menuDlgIsOpen = false;
        },
        _filterBarClose: function (e) {
            var $target = $(e.target);
            if ($target.closest(".e-grid").attr("id") !== this._id)
                return;
            if (e.type == "click" && $target.hasClass("e-cancel")) {
                var $targetText = $target.prev();
                $targetText.focus().val("");
                $targetText.trigger("keyup");
                e.stopPropagation();
            }
            if (e.type == "focusin" && $target.hasClass("e-filtertext")) {
                $target = $(e.target).next();
                this.getFilterBar().find(".e-cancel").addClass("e-hide");
                $target.removeClass("e-hide");
            }
        },
        _processFilter: function (e) {
            if (!this._alreadyFilterProcessed) {
                this._alreadyFilterProcessed = true;
                this._startTimer(e);
            } else {
                this._stopTimer();
                this._startTimer(e);
            }
        },
        _startTimer: function (e) {
            var proxy = this;
            var delay = e.keyCode == 13 ? 0 : proxy.model.filterSettings.immediateModeDelay;
            this._timer = window.setTimeout(
                function () {
                    proxy._onTimerTick();
                },
                delay);
        },
        _stopTimer: function () {
            if (this._timer != null)
                window.clearTimeout(this._timer);
        },

        _onTimerTick: function () {
            this.OldfilterValue = this._currentFilterbarValue;
            this._oldFilterColumn = this._currentFilterColumn;
            this.filterValueOldLength = this.filterValueCurrentLength;
            this._findPredicate();
            var result = null;
            var matchcase = this._currentFilterColumn.type == "string" ? false : true;
            var collection = $.extend([], this.model.filterSettings.filteredColumns);
            for (var i = 0; i < collection.length; i++) {
                if (this.getHeaderContent().find(".e-filterbar #" + collection[i].field.replace(/[^a-z0-9|s\_.]/gi, '') + "_filterBarcell").val() == "") {
                    if ($.inArray(this.model.filterSettings.filteredColumns[i], this.filterColumnCollection) != -1)
                        this.filterColumnCollection.splice(i, 1);
                    this.model.filterSettings.filteredColumns.splice(i, 1);
                }
            }
            if (this._currentFilterColumn.type == "date" || this._currentFilterColumn.type == "datetime") {
                for (var j = 0; j < this.model.filterSettings.filteredColumns.length; j++) {
                    if (this.model.filterSettings.filteredColumns[j].isComplex) {
                        var preobject = this.model.filterSettings.filteredColumns[j].predicates;
                        if (this.model.filterSettings.filteredColumns.length == 1) {
                            this.model.filterSettings.filteredColumns = preobject;
                        }
                        else {
                            this.model.filterSettings.filteredColumns[j] = preobject[0];
                            this.model.filterSettings.filteredColumns.push(preobject[1]);
                        }
                    }
                }
            }
            if (!this._skipFilterProcess) {
                if (this._currentFilterColumn.foreignKeyValue && this._currentFilterColumn.dataSource && this._currentFilterbarValue != "")
                    this._fltrForeignKeyValue(this._operator, this._currentFilterbarValue, matchcase,
                                              this._currentFilterColumn.dataSource, this._currentFilterColumn.foreignKeyField,
                                              this._currentFilterColumn.foreignKeyValue, this._currentFilterColumn.type);
                else {
                    if (ej.isNullOrUndefined(this._currentFilterColumn.filterBarTemplate)) {
                        this._fltrBarcell = true;
                        this.filterColumn(this._currentFilterColumn.field, this._operator, this._currentFilterbarValue, this._predicate, matchcase);
                    }
                }
            }
            else
                this.filterStatusMsg = "Invalid Filter Data";
            if (!this.model.scrollSettings.enableVirtualization && ej.isNullOrUndefined(this._currentFilterColumn.filterBarTemplate))
                this._showFilterMsg();
            this._stopTimer();
        },

        _findPredicate: function () {
            var _value = this._currentFilterbarValue.replace(/ && /i, " and ").replace(" || ", " or ");
            var _predicateFinder = _value.split(' ');
            this._predicate = "and";
            if (_predicateFinder.length != 0) {
                if ($.isFunction(ej.Predicate[_predicateFinder[1]])) {
                    this._skipFilterProcess = false;
                    this._predicate = _predicateFinder[1];
                    var valuesArray = _value.split(" " + _predicateFinder[1] + " ");
                    var tempOperator = [];
                    var filterValues = [];
                    for (var i = 0; i < valuesArray.length; i++) {
                        this._validateFilterValue(valuesArray[i]);
                        tempOperator.push(this._operator);
                        if (this._currentFilterColumn.type == "number")
                            filterValues.push(this._currentFilterbarValue);
                        else if (this._currentFilterColumn.type == "string")
                            filterValues.push(valuesArray[i]);
                    }
                    this._currentFilterbarValue = filterValues;
                    this._operator = tempOperator;
                } else
                    this._validateFilterValue($.trim(this._currentFilterbarValue));
            } else
                this._validateFilterValue($.trim(this._currentFilterbarValue));
        },

        _validateFilterValue: function (_value) {
            switch (this._currentFilterColumn.type) {
                case "number":
                    this._operator = ej.FilterOperators.equal;
                    var stringSkipInput = new Array(">", "<", "=", "!");
                    for (var i = 0; i < _value.length; i++) {
                        if (jQuery.inArray(_value[i], stringSkipInput) != -1) {
                            break;
                        }
                    }
                    if (i != _value.length) {
                        this._getOperator(_value.substring(i));
                        if (i != 0)
                            this._currentFilterbarValue = _value.substring(0, i);
                    }
					else if(!ej.isNullOrUndefined(this._currentFilterColumn.filterOperator))
						this._operator = this._currentFilterColumn.filterOperator;	
                    if (this._currentFilterbarValue != "" && _value.length >= 1)
                        this._currentFilterbarValue = ej.parseFloat(this._currentFilterbarValue, this.model.locale);
                    else
                        this._currentFilterbarValue = _value.length > 1 ? ej.parseFloat(_value, this.model.locale) : _value;
                    break;
                case "date":
                case "datetime":
                    this._operator = ej.FilterOperators.equal;
                    this._getOperator(_value);
                    var _format;
                    if (ej.isNullOrUndefined(this._currentFilterColumn.format)) {
                        if (this._currentFilterColumn.type == "date")
                            _format = ej.preferredCulture().calendar.patterns.d; //System Date format
                        else
                            _format = ej.preferredCulture().calendar.patterns.f; //System DateTime format
                    }
                    else
                        _format = this._currentFilterColumn.format.replace("{0:", "").replace('}', "");
                    if (this._currentFilterbarValue != "") {
                        var filterbarValue = ej.parseDate(this._currentFilterbarValue, _format, this.model.locale);
                        if (!ej.isNullOrUndefined(filterbarValue))
                            this._currentFilterbarValue = ej.parseDate(this._currentFilterbarValue, _format, this.model.locale);
                        else
                            this.filterStatusMsg = "Invalid Filter Data";
                    }
                    break;
                case "string":
                    if (_value.charAt(0) == '*') {
                        this._currentFilterbarValue = this._currentFilterbarValue.slice(1);
                        this._operator = ej.FilterOperators.startsWith;
                    }
                    else if (_value.charAt(_value.length - 1) == '%') {
                        this._currentFilterbarValue = this._currentFilterbarValue.slice(0, -1);
                        this._operator = ej.FilterOperators.startsWith;
                    }
                    else if (_value.charAt(0) == '%') {
                        this._currentFilterbarValue = this._currentFilterbarValue.slice(1);
                        this._operator = ej.FilterOperators.endsWith;
                    }
					else if(!ej.isNullOrUndefined(this._currentFilterColumn.filterOperator))
						this._operator = this._currentFilterColumn.filterOperator;	
                    else
                        this._operator = ej.FilterOperators.startsWith;
                    break;
                case "boolean":
                case "checkbox":
                    if (this._currentFilterbarValue.toLowerCase() == "true" || this._currentFilterbarValue == "1")
                        this._currentFilterbarValue = true;
                    else if (this._currentFilterbarValue.toLowerCase() == "false" || this._currentFilterbarValue == "0")
                        this._currentFilterbarValue = false;
                    this._operator = ej.FilterOperators.equal;
                    break;
                default:
                    this._operator = ej.FilterOperators.equal;
            }
        },
        _getOperator: function (_value) {
            if (_value.charAt(0) == "=") {
                this._operator = ej.FilterOperators.equal;
                this._currentFilterbarValue = _value.substring(1);
            }
            if (ej.data.operatorSymbols[_value.charAt(0)] !== undefined || ej.data.operatorSymbols[_value.slice(0, 2)] !== undefined) {
                this._operator = ej.data.operatorSymbols[_value.charAt(0)];
                this._currentFilterbarValue = _value.substring(1);
                if (this._operator === undefined) {
                    this._operator = ej.data.operatorSymbols[_value.slice(0, 2)];
                    this._currentFilterbarValue = _value.substring(2);
                }
            }
            if (this._operator == ej.FilterOperators.lessThan || this._operator == ej.FilterOperators.greaterThan) {
                if (this._currentFilterbarValue.charAt(0) == "=") {
                    this._operator = this._operator + "orequal";
                    this._currentFilterbarValue = this._currentFilterbarValue.substring(1);
                }
            }

        },

        _checkForSkipInput: function () {
            var isSkip = false;
            var skipInput = new Array("=", " ", "!");
            var context = this;
            if (this._currentFilterColumn.type == "number") {
                if (ej.data.operatorSymbols[this._currentFilterbarValue] !== undefined || $.inArray(this._currentFilterbarValue, skipInput) != -1)
                    isSkip = true;
            }
            if (this._currentFilterColumn.type == "string") {
                var stringSkipInput = new Array(">", "<", "=", "!");
                for (var i = 0; i < this._currentFilterbarValue.length; i++) {
                    if ($.inArray(this._currentFilterbarValue[i], stringSkipInput) != -1)
                        isSkip = true;
                }
            }
            return isSkip;
        },
		_setFilterbarValues: function(elem,val,operator){
			if (operator == "greaterthan")
				elem.val(">" + val);
			else if (operator == "greaterthanorequal")
				elem.val(">=" + val);
			else if (operator == "lessthan")
				elem.val("<" + val);
			else if (operator == "lessthanorequal")
				elem.val("<=" + val);
			else if (operator == "notequal")
				elem.val("!=" + val);
			else
				elem.val(val);
		},
        _showFilterMsg: function () {
            var index = !ej.isNullOrUndefined(this._currentFilterColumn) && $.inArray(this._currentFilterColumn, this.filterColumnCollection);
            if (this._currentFilterbarValue !== "" && index == -1)
                this.filterColumnCollection.push(this._currentFilterColumn);
            if (this._currentFilterbarValue === "" && index != -1) {
                this.filterColumnCollection.splice(index, 1);
            }
            if ((!this._skipFilterProcess || this.filterColumnCollection.length > 0) && this.filterStatusMsg != "Invalid Filter Data") {
                for (var index = 0; index < this.filterColumnCollection.length; index++) {
                    if (!ej.isNullOrUndefined(this.filterColumnCollection[index])) {
                        var val, filterColumnName, hTxt = this.filterColumnCollection[index].headerText;
                        if (this.filterColumnCollection[index].disableHtmlEncode)
                            hTxt = this._htmlEscape(hTxt);
                        if (this.filterColumnCollection[index].field.indexOf('.') != -1) {
                              filterColumnName = (this.filterColumnCollection[index].field.replace(/[^a-z0-9|s\_]/gi, ''));
                            val = $("#" + filterColumnName + "_filterBarcell").val();
                        }
                        else {
                            var fltrId = ej.isNullOrUndefined(this.filterColumnCollection[index]["foreignKeyValue"]) ? this.filterColumnCollection[index].field.replace(/[^a-z0-9|s\_.]/gi, '') + "_filterBarcell" : this.filterColumnCollection[index].field.replace(/[^a-z0-9|s\_.]/gi, '') + "_" + this.filterColumnCollection[index]["foreignKeyValue"] + "_filterBarcell";
                            var column = this._currentFilterColumn || this.getColumnByField(this.filterColumnCollection[index].field);
							if (column.type == "boolean" && !ej.isNullOrUndefined(column.filterBarTemplate) && this.element.find("#" + fltrId).hasClass('e-checkbox e-js'))
                                val = this.element.find("#" + fltrId).parent().attr('aria-checked');
                            else
                                val = this.element.find("#" + fltrId).val();
                        }
                        if (val != "") {
                            if (index > 0 && this.filterStatusMsg != "")
                                this.filterStatusMsg += " && ";
                            this.filterStatusMsg += hTxt + ": " + val;
                        }
                    }
                }
            }

            if (this.model.allowPaging)
                this.getPager().ejPager("model.externalMessage", this.filterStatusMsg);
           else if(!this.model.scrollSettings.enableVirtualization){
                if (this.model.scrollSettings.allowVirtualScrolling)
                    this.$pagerStatusBarDiv.find(".e-pagerfiltermsg").html(this.filterStatusMsg).css("display", "block");
                else
                    this.$pagerStatusBarDiv.find("div").html(this.filterStatusMsg);
                if (this.filterStatusMsg.length)
                    this.$pagerStatusBarDiv.css("display", "block");
                else
                    this.model.scrollSettings.allowVirtualScrolling ? this.$pagerStatusBarDiv.find(".e-pagerfiltermsg").hide() : this.$pagerStatusBarDiv.hide();
            }
            if (this.filterStatusMsg == "Invalid Filter Data") {
                index = $.inArray(this._currentFilterColumn, this.filterColumnCollection);
                this.filterColumnCollection.splice(index, 1);
            }
            this.filterStatusMsg = "";
        },
        _renderFilterDialogs: function () {
            var $strDlg, $numDlg, $boolDlg, $dateDlg, $datetimeDlg, $guidDlg;

            $.each(this.model.columns, ej.proxy(function (indx, col) {
                if (col.type == "string" && (!$strDlg || !ej.isNullOrUndefined(col.filterType))) {
                    if (ej.isNullOrUndefined(col.filterType))
                        $strDlg = true;
                    this._renderFilters(col);
                } else if (col.type == "guid" && (!$guidDlg || !ej.isNullOrUndefined(col.filterType))) {
                    if (ej.isNullOrUndefined(col.filterType))
                        $guidDlg = true;
                    this._renderFilters(col);
                } else if (col.type == "number" && (!$numDlg || !ej.isNullOrUndefined(col.filterType))) {
                    if (ej.isNullOrUndefined(col.filterType))
                        $numDlg = true;
                    this._renderFilters(col);
                } else if (col.type == "date" && (!$dateDlg || !ej.isNullOrUndefined(col.filterType))) {
                    if (ej.isNullOrUndefined(col.filterType))
                        $dateDlg = true;
                    this._renderFilters(col);
                } else if (col.type == "datetime" && (!$datetimeDlg || !ej.isNullOrUndefined(col.filterType))) {
                    if (ej.isNullOrUndefined(col.filterType))
                        $datetimeDlg = true;
                    this._renderFilters(col);
                } else if (col.type == "boolean" && (!$boolDlg || !ej.isNullOrUndefined(col.filterType))) {
                    if (ej.isNullOrUndefined(col.filterType))
                        $boolDlg = true;
                    this._renderFilters(col);
                }
            }, this));
        },
        _renderFilters: function (col) {
            if ((this._isExcelFilter && col.filterType != "menu") || col.filterType == "excel") {
                if (ej.isNullOrUndefined(this._excelFilter)) {
                    this._renderExcelFilter();
                    this._excelFilterRendered = true;
                }
                this._excelFilter.renderDialog(col.type);
            }
            else
                eval(this["_render" + col.type.substring(0, 1).toUpperCase() + col.type.substring(1) + "Dialog"](col));
        },
        _renderStringDialog: function () {
            var $id = this._id + "_stringDlg";
            if ($("#" + $id).length > 0) return;
            var $content = ej.buildTag("div#" + $id + ".e-dlgcontainer e-filterDialog");
            $content.appendTo("body");
            this._renderDlgContent($content, "string");
            if (!this.model.isResponsive || !this._mediaStatus)
                this._renderFDialog($id);
        },
        _renderBooleanDialog: function () {
            var $id = this._id + "_booleanDlg";
            if ($("#" + $id).length > 0) return;
            var $content = ej.buildTag("div#" + $id + ".e-dlgcontainer e-filterDialog");
            $content.appendTo("body");
            this._renderDlgContent($content, "boolean");
            if (!this.model.isResponsive || !this._mediaStatus) {
                this._renderFDialog($id);
                if (!this.model.filterSettings.showPredicate)
                    $("#" + $id).ejDialog({ minHeight: 90, width: "100%" });
                else
                    $("#" + $id).ejDialog({ minHeight: 136, width: "100%" });
            }
        },
        _renderGuidDialog: function () {
            var $id = this._id + "_guidDlg";
            if ($("#" + $id).length > 0) return;
            var $content = ej.buildTag("div#" + $id + ".e-dlgcontainer e-filterDialog");
            $content.appendTo("body");
            this._renderDlgContent($content, "guid");
            if (!this.model.isResponsive || !this._mediaStatus)
                this._renderFDialog($id);
        },
        _renderNumberDialog: function () {
            var $id = this._id + "_numberDlg";
            if ($("#" + $id).length > 0) return;
            var $content = ej.buildTag("div#" + $id + ".e-dlgcontainer e-filterDialog");
            $content.appendTo("body");
            this._renderDlgContent($content, "number");
            if (!this.model.isResponsive || !this._mediaStatus)
                this._renderFDialog($id);
        },
        _renderDateDialog: function (col) {
            var $id = this._id + "_dateDlg";
            if ($("#" + $id).length > 0) return;
            var $content = ej.buildTag("div#" + $id + ".e-dlgcontainer e-filterDialog");
            $content.appendTo("body");
            this._renderDlgContent($content, "date", col);
            if (!this.model.isResponsive || !this._mediaStatus)
                this._renderFDialog($id);
        },
        _renderDatetimeDialog: function (col) {
            var $id = this._id + "_datetimeDlg";
            if ($("#" + $id).length > 0) return;
            var $content = ej.buildTag("div#" + $id + ".e-dlgcontainer e-filterDialog");
            $content.appendTo("body");
            this._renderDlgContent($content, "datetime", col);
            if (!this.model.isResponsive || !this._mediaStatus)
                this._renderFDialog($id);
        },
        _renderFDialog: function (id) {
            $("#" + id).ejDialog({ showOnInit: false, "enableRTL": this.model.enableRTL, "cssClass": this.model.cssClass, "showHeader": false, width: 260, enableResize: false, allowKeyboardNavigation: false, content: "#" + this._id });
        },
        _closeFDialog: function () {
            if (this._isExcelFilter || this._excelFilterRendered)
                this._excelFilter.closeXFDialog();
            if (this._$menuDlgIsOpen)
                this._closeFilterDlg();
        },
        _renderDlgContent: function (content, type, col) {
            content.addClass("e-grid");
            var $predicate = ej.buildTag("div.e-predicate"), $operator = ej.buildTag("div.e-operator"), $value = ej.buildTag("div.e-value"), $value1 = ej.buildTag("div.e-value1");
            var $strOp = this.localizedLabels.StringMenuOptions;
            var $numOp = this.localizedLabels.NumberMenuOptions;
            var $drdown = ej.buildTag("input#" + this._id + type + "_ddinput", {}, {}, { "type": "text" });
            var $drdownDiv = ej.buildTag("div#" + this._id + type + "_dropdown");
            var $drdownUl = ej.buildTag("ul");
            var $radio = ej.buildTag("input", {}, {}, { "type": "radio", "name": this._id + "_predicate" + type, "value": "or" });
            var $andRadio = ej.buildTag("input", {}, {}, { "type": "radio", "name": this._id + "_predicate" + type, "value": "and", "checked": "checked" });
            var $cbox;
            $predicate.append($andRadio)
                .append(ej.buildTag("span.e-caption").html(this.localizedLabels.PredicateAnd))
                .append($radio)
                .append(ej.buildTag("span.e-caption").html(this.localizedLabels.PredicateOr));
            !this.model.filterSettings.showPredicate && $predicate.hide();
            if (type == "string") {
                $cbox = ej.buildTag("input", {}, {}, { "type": "checkbox" });
                $predicate.append($cbox)
                    .append(ej.buildTag("span.e-caption").html(this.localizedLabels.MatchCase));
                $.each($strOp, function (indx, operator) {
                    $drdownUl.append(ej.buildTag("li", {}, {}, { "value": operator.value }).html(operator.text));
                });
            }
            if (type == "number" || type == "date" || type == "datetime" || type == "guid") {
                if (type == "guid")
                    $numOp = $numOp.slice(4, 6);
                $.each($numOp, function (indx, operator) {
                    $drdownUl.append(ej.buildTag("li", {}, {}, { "value": operator.value }).html(operator.text));
                });
            }
            if (type != "boolean") {
                $drdownDiv.append($drdownUl);
                $operator.append($drdown);
                $operator.append($drdownDiv);
            }
            var $tBox = ej.buildTag("input", {}, {}, { "type": "text" }), $tBox1 = ej.buildTag("input", {}, {}, { "type": "text" });
            var $tchkBox = ej.buildTag("input", {}, {}, { "type": "checkbox" });
            var filterVal = this.model.enableResponsiveRow ? 'OKButton' : 'Filter';
            var clearVal = this.model.enableResponsiveRow ? 'CancelButton' : 'Clear';
            var $filter = ej.buildTag("input.e-filter e-flat e-btnsub", {}, {}, { "type": "button", "value": this.localizedLabels[filterVal] });
            var $clear = ej.buildTag("input.e-clear e-flat e-btncan", {}, {}, { "type": "button", "value": this.localizedLabels[clearVal] });
            $value.append(ej.buildTag("span.e-caption").html(this.localizedLabels.FilterMenuCaption)), $value1.append(ej.buildTag("span.e-caption").html(this.localizedLabels.FilterMenuToCaption));
            content.append($predicate);
            if (type == "boolean") {
                $value.find("span.e-caption").css("top", "1px");
                $value.append($tchkBox);
            }
            else {
                $value.append(ej.buildTag("br")).append($tBox);
                content.append($operator);
            }
            content.append($value);
            $value1.append(ej.buildTag("br")).append($tBox1);
            content.append($value1);
            $value1.addClass("e-hide");
            content.append(ej.buildTag("div.e-dlgBtns").append($filter)
                .append($clear));
            var betresult = [$value, $value1];
            if (type != "boolean")
                $drdown.ejDropDownList({ "cssClass": this.model.cssClass, "enableRTL": this.model.enableRTL, "targetID": this._id + type + "_dropdown", width: "100%", height: "26px", selectedItemIndex: 0, select: ej.proxy(this._openfset, this, betresult) });
            $radio.ejRadioButton({ "cssClass": this.model.cssClass, "enableRTL": this.model.enableRTL });
            $andRadio.ejRadioButton({ "cssClass": this.model.cssClass, "enableRTL": this.model.enableRTL, checked: true });
            if ($cbox)
                $cbox.ejCheckBox({ "cssClass": this.model.cssClass, "enableRTL": this.model.enableRTL });
            content.css("display", "none");
            this._createButton("filter", $filter);
            this._createButton("clear", $clear);
            var NumberDlgstyle = { "cssClass": this.model.cssClass, locale: this.model.locale, "enableRTL": this.model.enableRTL, showSpinButton: false, height: "26px", decimalPlaces: 2, width: "100%", watermarkText: this.localizedLabels.NumericTextBoxWaterMark };
            if (type == "number")
                $tBox.ejNumericTextbox(NumberDlgstyle),
                $tBox1.ejNumericTextbox(NumberDlgstyle);
            else if (type == "guid")
                $tBox.css({ "height": "26px", "width": "100%" });
            else if (type == "date" || type == "datetime") {
                var cnt = type == "date" ? "Date" : "DateTime";
                $tBox.attr("id", this._id + "_dp" + cnt), $tBox1.attr("id", this._id + "_dpTo" + cnt);
                var DateDlgstyle = { "cssClass": this.model.cssClass, "enableRTL": this.model.enableRTL, enableStrictMode: true, width: "100%", locale: this.model.locale }
                if (type == "date")
                    DateDlgstyle["watermarkText"] = this.localizedLabels.DatePickerWaterMark;
                if (!ej.isNullOrUndefined(col.format)){
                    var fmt = type == "date" ? "dateFormat" : "dateTimeFormat";
                    DateDlgstyle[fmt] = col.format.replace(/{0:|}/g, function () { return "" })
                }                    
                $tBox["ej" + cnt + "Picker"](DateDlgstyle);
                $tBox1["ej" + cnt + "Picker"](DateDlgstyle);
            }
            else if (type == "boolean")
                $tchkBox.ejCheckBox({ "cssClass": this.model.cssClass, "enableRTL": this.model.enableRTL });
            else if (type == "string") {
                $tBox.attr("id", this._id + "_acString");
                $tBox.ejAutocomplete({
                    "cssClass": this.model.cssClass, "enableRTL": this.model.enableRTL, "dataSource": this._dataSource(), width: "100%", height: 26, enableDistinct: true, focusIn: function (args) {
                        var $dropdown = this.element.closest(".e-dialog").find(".e-dropdownlist");
                        var $matchcase = this.element.closest(".e-dialog").find(".e-checkbox").prop("checked");
                        this.model.filterType = $dropdown.ejDropDownList("model.value");
                        this.model.caseSensitiveSearch = $matchcase;
                    },
                    open: function (args) {
                        var doped = !this.element.closest(".e-dialog").ejDialog("isOpened")
                        this.suggestionList.css({ visibility: (doped ? "hidden" : "visible") });
                    }

                });
            }
        },
        _createButton: function (name, element) {
            var $func = name == "filter" ? ej.proxy(this._fltrBtnHandler, this) : ej.proxy(this._fltrClrHandler, this);
            element.ejButton({ "cssClass": this.model.cssClass, "enableRTL": this.model.enableRTL, "click": $func });
        },
        _getIdField: function () {
            var $key;
            $.each(this.model.columns, function (indx, col) {
                if (col.key) {
                    $key = col.field;
                    return false;
                }
            });
            return $key;
        },
        _openfset: function (betresult, args) {
            var margin = "5%", padding = "10px";
            if (args.value == "Between") {
                betresult[0].find(".e-caption").eq(0).html(this.localizedLabels.FilterMenuFromCaption)
                betresult[1].removeClass("e-hide");
                $(betresult[1]).css({ "padding-top": padding });
                if (this.model.isResponsive && this._mediaStatus)
                    margin = padding = "0px";
            }
            else {
                betresult[1].addClass("e-hide");
                betresult[0].find(".e-caption").eq(0).html(this.localizedLabels.FilterMenuCaption)
            }
            $(".e-responsiveLabelDiv").css({ "margin-top": margin }), $(".e-operator").css({ "padding-top": padding });
        },
        _filterCompleteAction: function () {
            if (this.model.allowPaging)
                this._refreshGridPager();
            if (this.model.scrollSettings.allowVirtualScrolling) {
                var model = this._refreshVirtualPagerInfo();
                this._showPagerInformation(model);
            }
            if (this.model.filterSettings.filterType == "menu" || this._isExcelFilter) {
                this._closeFDialog();
                var column = this.getColumnByField(this._$curFieldName);
                var index = $.inArray(column, this.model.columns), proxy = this, _addicon = false;
                $.each(this.model.filterSettings.filteredColumns, function (indx, col) {
                    if (col.field == proxy._$curFieldName) {
                        _addicon = true;
                        return false;
                    }
                    else if (col.isComplex == true) {
                        if (col.predicates[0].field == proxy._$curFieldName) {
                            _addicon = true;
                            return false;
                        }
                    }
                });
                var $fIcon = this.getHeaderTable().find("thead").find(".e-headercell").not(".e-detailheadercell,.e-stackedHeaderCell").eq(index).find(".e-filtericon");
                if (_addicon)
                    $fIcon.addClass("e-filteredicon e-filternone");
                else
                    $fIcon.removeClass("e-filteredicon e-filternone");
            }
        },
        _refreshFilterIcon: function () {
            if (!this.model.filterSettings.filteredColumns.length)
                return;
            var filteredCols = ej.distinct(this.model.filterSettings.filteredColumns, "field", true), _$headerCells = this.getHeaderTable().find("thead").find(".e-headercell").not(".e-detailheadercell"), index, col;
            if (this.model.showStackedHeader)
                _$headerCells = _$headerCells.not(".e-stackedHeaderCell");
            if (this.model.allowReordering)
                _$headerCells.find(".e-filtericon").removeClass("e-filteredicon e-filternone");
            for (var i = 0, flen = filteredCols.length; i < flen; i++) {
                col = filteredCols[i]
                index = this.getColumnIndexByField(col.isComplex === true ? col.predicates[0].field : col.field);
                _$headerCells.eq(index).find(".e-filtericon").addClass("e-filteredicon e-filternone");
            }
        },
        _setFilterFieldValues: function (id) {
            var $fVal = "", proxy = this, $fVal1 = "";
            var flchk = -1, optr;
            $.each(this.model.filterSettings.filteredColumns, function (indx, value) {
                if (value.field == proxy._$curFieldName)
                    flchk = indx;
            });
            if (flchk == -1 && this._$colType != "boolean") {
                if (this._$colType == "string") {
                    $(".e-predicate input.e-js[type='checkbox']").ejCheckBox({
                        checked: false
                    });
                }
                $(".e-predicate input[name =" + this._id + "_predicate" + this._$colType + "]:first").ejRadioButton({ checked: true });
                $("#" + this._id + this._$colType + "_ddinput").ejDropDownList({
                    selectedItemIndex: 0, change: function (args) {
                        this.element.closest(".e-dialog").find(".e-autocomplete").val($fVal);
                    }
                });
            }
            {
                var filteredFields = $(this.model.filterSettings.filteredColumns).map(function () {
                    return this.field;
                }).get();

                if (this._$curFieldName != this._$prevFieldName || $.inArray(this._$curFieldName, filteredFields) != -1) {
                    var flag = 0;
                    $.each(this.model.filterSettings.filteredColumns, function (indx, col) {
                        if (col.field == proxy._$curFieldName) {
                            var index;
                            var option = proxy._$colType == "number" || proxy._$colType == "date" || proxy._$colType == "datetime" ? "Number" : "String";
                            var $dlist = proxy.localizedLabels[option + "MenuOptions"];
                            var optr = ej.isNullOrUndefined(col.actualOperator) ? col.operator : col.actualOperator
                            for (index = 0; index < $dlist.length; index++) {
                                if ($dlist[index].value.toLowerCase() == optr)
                                    break;
                            }
                            if (proxy._$colType == "string")
                                $(".e-predicate input.e-js[type='checkbox']").ejCheckBox({ checked: col.matchcase });
                            $("input[value=" + col.predicate + "]").ejRadioButton({ checked: true });
                            $("#" + proxy._id + proxy._$colType + "_ddinput").ejDropDownList({ selectedItemIndex: index });
                            if ((proxy.model.isResponsive && proxy._mediaStatus) && (optr == "between")) {
                                $(".e-responsiveLabelDiv").css({ "margin-top": "0%" }), $(".e-operator").css({ "padding-top": "0px" });
                            }
                            if (optr == "between" && flag <= 1) {
                                if (!flag)
                                    $fVal = col.value;
                                else
                                    $fVal1 = col.value;
                                flag++;
                                return true;
                            }
                            else
                                $fVal = col.actualFilterValue != null ? col.actualFilterValue : col.value;
                        }
                    });
                }

                if (this._$colType == "boolean") {
                    if ($fVal && $fVal != "")
                        $(id).find(".e-value input:checkbox.e-js").ejCheckBox({ checked: true });
                    else
                        $(id).find(".e-value input:checkbox.e-js").ejCheckBox({ checked: false });
                }
                else if (this._$colType == "date" || this._$colType == "datetime") {
                    $(id).find(".e-value .e-datepicker")[this._$colType == "date" ? "ejDatePicker" : "ejDateTimePicker"]("model.value", $fVal);
                    $(id).find(".e-value1 .e-datepicker")[this._$colType == "date" ? "ejDatePicker" : "ejDateTimePicker"]("model.value", $fVal1);
                }
                else if (this._$colType == "number") {
                    $(id).find(".e-value .e-numerictextbox").ejNumericTextbox("model.value", $fVal);
                    $(id).find(".e-value1 .e-numerictextbox").ejNumericTextbox("model.value", $fVal1);
                } else
                    $(id).find(".e-value input").val($fVal);
                $(id).find(".e-value1 input1").val($fVal1);
            }
        },
        _fltrBtnHandler: function (e) {
            if (this.model.isResponsive && this._mediaStatus)
                this._responsiveFilterClose();
            var id = this._id + "_" + this._$colType + "Dlg";
            var $par = $("#" + id);
            var $input = $par.find(".e-value input.e-js"), $operator, result, predicateEle, $input1 = $par.find(".e-value1 input.e-js");
            var value = $input.val(), matchcase = undefined, filterValue, value1 = $input1.val();
            if (this._$colType == "number") {
                $input = $input.filter(".e-numerictextbox");
                value = parseFloat($input.ejNumericTextbox("getValue"));
                matchcase = true;
            }
            if (this._$colType == "string")
                matchcase = $par.find(".e-predicate input[type='checkbox']").is(":checked");
            if (this._$colType == "date" || this._$colType == "datetime") {
                value = ej.parseDate(value, this._$colFormat, this.model.locale);
                matchcase = true;
            }
            if (this._$colType == "boolean") {
                value = $input.ejCheckBox("model.checked") != null ? $input.ejCheckBox("model.checked") : false;
                $operator = "equal";
            } else
                $operator = $("#" + this._id + this._$colType + "_ddinput").ejDropDownList("getSelectedValue").toLowerCase();
            predicateEle = $par.find(".e-predicate input[type='radio']:checked");
            if (this._$colForeignKeyValue && this._$colDropdownData)
                this._fltrForeignKeyValue($operator, value, matchcase, this._$colDropdownData, this._$colForeignKeyField, this._$colForeignKeyValue, this._$colType, predicateEle);
            else {
                if (this._$colType != "boolean") {
                    if (($("#" + this._id + this._$colType + "_ddinput").ejDropDownList("getSelectedValue").toLowerCase() == "between")) {
                        if ((this._$colType == "datetime") || (this._$colType == "date")) {
                            value1 = ej.parseDate(value1, this._$colFormat, this.model.locale);
                        }
                        if (this._$colType == "number") {
                            value1 = parseFloat($input1.ejNumericTextbox("getValue"));
                        }
                        value = [value, value1];
                        $operator = ["greaterthanorequal", "lessthanorequal"];
                        var actualOperator = {};
                        actualOperator.operator = 'between';
                    }
                }
            }
			var predicate = [],pred = $par.find(".e-predicate input[type='radio']:checked").attr("value");
			if(!ej.isNullOrUndefined(actualOperator) && actualOperator.operator == "between")
				predicate.push(pred,"and");
			else
				predicate.push(pred);
			if (!(this._$colForeignKeyValue && this._$colDropdownData))
            this.filterColumn(this._$curFieldName, $operator, value, predicate, matchcase, actualOperator);
            if (this.model.isResponsive) {
                $par.css('display', 'none');
                this._setResponsiveFilterIcon();
                this.element.css('display', 'block');
                if (this.model.allowScrolling && (!this.model.enableResponsiveRow || !this.model.minWidth)) {
                    var args = {};
                    args.requestType = 'refresh';
                    this._refreshScroller(args);
                }
            }
        },
        _fltrClrHandler: function (e) {
            this.clearFiltering(this._$curFieldName);
        },

        _fltrForeignKeyValue: function (operator, value, matchcase, dataSource, fieldName, mapFieldName, colType, predicateEle) {
            if (ej.isNullOrUndefined(matchcase))
                matchcase = true;
            var operatorCol = [], predicateCol = [], query, filterValue, visible = predicateEle ? predicateEle.css("display") == "none" : true, condition = predicateEle ? predicateEle.attr("value") : "and", predicate;
            var data = dataSource, val;
            var filterCollection = { mapFieldName: mapFieldName, fieldName: fieldName, operator: operator, value: value, predicate: predicateEle, matchcase: matchcase };
            var args = { requestType: ej.Grid.Actions.Filtering, action: "fetchingForeignKeyField", currentFilteringColumn: fieldName, currentFilterObject: filterCollection };
            this._trigger("actionBegin", args);
            if (!(dataSource instanceof ej.DataManager))
                data = new ej.DataManager(dataSource);
            if (colType == "date") {
                var $prevDate = new Date(value.setDate(value.getDate() - 1));
                var $nextDate = new Date(value.setDate(value.getDate() + 2));
                if (operator == "equal" || operator == "notequal") {
                    if (operator == "equal")
                        query = new ej.Query().where(ej.Predicate(filterCollection.mapFieldName, ">", $prevDate, !filterCollection.matchcase).and(filterCollection.mapFieldName, "<", $nextDate, !filterCollection.matchcase)).select(filterCollection.fieldName);
                    else
                        query = new ej.Query().where(ej.Predicate(filterCollection.mapFieldName, "<=", $prevDate, !filterCollection.matchcase).or(filterCollection.mapFieldName, ">=", $nextDate, !filterCollection.matchcase)).select(filterCollection.fieldName);
                }
                else
                    query = new ej.Query().where(filterCollection.mapFieldName, filterCollection.operator, filterCollection.value, !filterCollection.matchcase).select(filterCollection.fieldName);
            }
            else
                query = new ej.Query().where(filterCollection.mapFieldName, filterCollection.operator, filterCollection.value, !filterCollection.matchcase).select(filterCollection.fieldName);
            filterValue = { actualFilterValue: filterCollection.value, actualOperator: filterCollection.operator, ejpredicate: undefined, predicate: condition };
            data.executeQuery(query).done(ej.proxy(function (e) {
                val = e.result;
                var requireProc = $.isPlainObject(val[0]), preds = [], merge = false, field = this._$curFieldName;
                val = requireProc ? ej.distinct(val, fieldName, false) : val,
                predicate = new ej.Predicate(field, "equal", val[0], matchcase);
                for (var i = 1, vlen = val.length; i < vlen; i++) {
                    preds.push(new ej.Predicate(field, "equal", val[i], matchcase));
                    merge = true;
                }
                if (merge) {
                    preds.unshift(predicate);
                    predicate = ej.Predicate.or(preds); /*ensure same level for multiple predicates*/
                }
                $.extend(filterValue, { ejpredicate: $.extend(predicate, { field: field }, filterValue) });
                this.filterColumn(filterCollection.fieldName, filterCollection.operator, filterCollection.value, predicateCol, filterCollection.matchcase, filterValue);
            }, this));
        },
        _setDateFilters: function (filterObject, forGrouping) {
            var $prevDate, $nextDate, pred, predicate;
            if (!forGrouping && !ej.isNullOrUndefined(this.getColumnByField(filterObject.field).format)) {
                var formatString = this.getColumnByField(filterObject.field).format;
                if (formatString.indexOf("s") != -1) {
                    $prevDate = new Date(filterObject.value.setSeconds(filterObject.value.getSeconds() - 1));
                    $nextDate = new Date(filterObject.value.setSeconds(filterObject.value.getSeconds() + 2));
                }
                else if (formatString.indexOf("m") != -1) {
                    $prevDate = new Date(filterObject.value.setMinutes(filterObject.value.getMinutes() - 1));
                    $nextDate = new Date(filterObject.value.setMinutes(filterObject.value.getMinutes() + 2));
                }
                else if (formatString.indexOf("h") != -1) {
                    $prevDate = new Date(filterObject.value.setHours(filterObject.value.getHours() - 1));
                    $nextDate = new Date(filterObject.value.setHours(filterObject.value.getHours() + 2));
                }
                else {
                    $prevDate = new Date(filterObject.value.setSeconds(filterObject.value.getSeconds() - 1));
                    $nextDate = new Date(filterObject.value.setDate(filterObject.value.getDate() + 1));
                }
            }
            else {
                $prevDate = new Date(filterObject.value.setSeconds(filterObject.value.getSeconds() - 1));
                $nextDate = new Date(filterObject.value.setSeconds(filterObject.value.getSeconds() + 2));
            }
            var $prevObj = $.extend({}, filterObject);
            var $nextObj = $.extend({}, filterObject);
            $prevObj.value = $prevDate;
            $nextObj.value = $nextDate;
            if (filterObject.operator == "equal") {
                $prevObj.operator = "greaterthan";
                $prevObj.predicate = "and";
                $nextObj.operator = "lessthan";
                $nextObj.predicate = "and";
            } else {
                $prevObj.operator = "lessthanorequal";
                $prevObj.predicate = "or";
                $nextObj.operator = "greaterthanorequal";
                $nextObj.predicate = "or";
            }
            pred = ej.Predicate($prevObj.field, $prevObj.operator, $prevObj.value, false);
            predicate = pred[$nextObj.predicate](ej.Predicate($nextObj.field, $nextObj.operator, $nextObj.value, false));
            filterObject.value = new Date(filterObject.value.setSeconds($nextObj.value.getSeconds() - 1));
            if (forGrouping)
                return predicate;
            else
                this.model.filterSettings.filteredColumns.push($.extend(predicate, { field: filterObject.field, operator: filterObject.operator, value: filterObject.value }));
        }
    };
})(jQuery, Syncfusion);