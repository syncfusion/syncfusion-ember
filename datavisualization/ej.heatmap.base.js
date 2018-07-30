(function ($, ej) {
    "use strict";
    var HeatMapGrid = (function () {
        function HeatMapGrid(name, heatmap) {
            this._heatmap = heatmap ? heatmap : null;
            if (heatmap) {
                heatmap._grid = this;
            }
            this._rootCSS = "e-grid",
            // widget element will be automatically set in this
	       this.element = null,
	       this.validTags = ["div"],
            // user defined model will be automatically set in this
	       this.model = null,
	      this._requiresID = true,
	       this.keyConfigs = /** @lends ejGrid# */{
	           focus: "e",
	           insertRecord: "45", //Insert
	           deleteRecord: "46", // delete
	           editRecord: "113", //F2
	           saveRequest: "13", // enter
	           cancelRequest: "27", //Esc
	           nextPage: "34", // PgDn
	           previousPage: "33", // PgUp
	           lastPage: "ctrl+alt+34", //"CtrlAltPgDn",
	           firstPage: "ctrl+alt+33", //"CtrlPlusAltPlusPgUp",
	           nextPager: "alt+34", //"AltPlusPgDown",
	           previousPager: "alt+33", //"AltPlusPgUp",
	           firstCellSelection: "36", //"Home",
	           lastCellSelection: "35", //"End",
	           firstRowSelection: "ctrl+36", //"CtrlPlusHome",
	           lastRowSelection: "ctrl+35", //"CtrlPlusEnd",
	           upArrow: "38", //Up arrow
	           downArrow: "40", //Down arrow
	           rightArrow: "39", //Right arrow
	           leftArrow: "37", //Left arrow
	           moveCellRight: "9", //tab
	           moveCellLeft: "shift+9", //shifttab
	           selectedGroupExpand: "alt+40", //"AltPlusDownArrow",
	           totalGroupExpand: "ctrl+40", //"CtrlPlusDownArrow",
	           selectedGroupCollapse: "alt+38", //"AltPlusUpArrow",
	           totalGroupCollapse: "ctrl+38", //"CtrlPlusUpArrow",
	           multiSelectionByUpArrow: "shift+38",//"shiftPlusUpArrow",
	           multiSelectionByDownArrow: "shift+40",//"shiftPlusDownArrow"
	       },
            this._ignoreOnPersist = [
                "query", "isEdit", "toolbarClick", "queryCellInfo", "mergeCellInfo", "currentViewData", "enableAltRow", "enableRTL", "contextClick", "contextOpen",
                "rowDataBound", "rowTemplate", "detailsDataBound", "detailsTemplate", "childGrid", "summaryRows", "toolbarSettings",
                "editSettings", "allowMultiSorting", "enableAutoSaveOnSelectionChange", "locale", "allowCellMerging",
                "allowTextWrap", "textWrapSettings", "cssClass", "dataSource", "groupSettings.enableDropAreaAnimation", "enableRowHover", "showSummary", "allowGrouping",
                "enableHeaderHover", "allowKeyboardNavigation", "scrollSettings.frozenRows", "scrollSettings.frozenColumns", "enableTouch", "contextMenuSettings.enableContextMenu",
                "exportToExcelAction", "exportToWordAction", "exportToPdfAction"
            ],
           this.ignoreOnExport = [
                "isEdit", "toolbarClick", "query", "queryCellInfo", "selectionType", "currentViewData", "rowDataBound", "rowTemplate",
                "detailsDataBound", "detailsTemplate", "editSettings", "pageSettings", "enableAutoSaveOnSelectionChange", "localization", "allowScrolling",
                "cssClass", "dataSource", "groupSettings.enableDropAreaAnimation", "enableRowHover", "allowSummary",
                "enableHeaderHover", "allowKeyboardNavigation"
           ],
            this.observables = ["dataSource", "selectedRowIndex", "pageSettings.currentPage"],
            this._tags = [{
                tag: "columns",
                attr: ["allowEditing", "allowFiltering", "allowGrouping", "allowResizing", "allowSorting", "cssClass", "customAttributes", "dataSource", "defaultValue",
                "disableHtmlEncode", "editTemplate", "editType", "foreignKeyField", "foreignKeyValue", "headerTemplateID", "headerText", "isFrozen",
                "isIdentity", "isPrimaryKey", "filterBarTemplate", "textAlign", "templateID", "textAlign", "headerTextAlign", "tooltip", "clipMode",
                "validationRules.minlength", "validationRules.maxlength", "validationRules.range", "validationRules.number", "validationRules.required",
                "editParams.decimalPlaces", [{ tag: "commands", attr: ["type", "buttonOptions"] }]
                ],
                content: "template"
            }, {
                tag: "summaryRows",
                attr: ["showCaptionSummary", "showTotalSummary", [{
                    tag: "summaryColumns", attr: ["customSummaryValue", "dataMember", "displayColumn", "summaryType", "template"]
                }]]
            }, {
                tag: "stackedHeaderRows",
                attr: [
                [{
                    tag: "stackedHeaderColumns", attr: ["headerText", "column"]
                }]]
            }, {
                tag: "filterSettings.filteredColumns", attr: []
            }, {
                tag: "sortSettings.sortedColumns", attr: []
            }],
            this._dataSource = ej.util.valueFunction("dataSource"),
            this._selectedRow = ej.util.valueFunction("selectedRowIndex"),
            this._currentPage = ej.util.valueFunction("pageSettings.currentPage"),
            this.dataTypes = {
                dataSource: "data",
                query: "data",
                columns: "array",
                childGrid: "parent",
                gridLines: "enum",
                summaryRows: "array",
                stackedHeaderRows: "array",
                toolbarSettings: {
                    toolbarItems: "array",
                    customToolbarItems: "array"
                },
                contextMenuSettings: {
                    contextMenuItems: "array",
                    customContextMenuItems: "array",
                    subContextMenu: "array"
                },
                selectionSettings: {
                    selectionMode: "array",
                    selectedRecords: "array"
                },
                sortSettings: {
                    sortedColumns: "array"
                },
                filterSettings: {
                    filteredColumns: "array",
                    filterType: "enum",
                    filterBarMode: "enum",
                },
                groupSettings: {
                    groupedColumns: "array"
                },
                editSettings: {
                    editMode: "enum",
                    formPosition: "enum",
                    rowPosition: "enum",
                },
                searchSettings: {
                    fields: "array"
                },
                textWrapSettings: {
                    wrapMode: "enum"
                }
            },
			this.model = {
			    allowPaging: false,
			    showColumnChooser: false,
			    gridLines: "both",
			    allowSorting: false,
			    showStackedHeader: false,
			    selectedRecords: [],
			    stackedHeaderRows: [],
			    allowFiltering: false,
			    allowMultipleExporting: false,
			    allowSelection: true,
			    allowGrouping: false,
			    showSummary: false,
			    allowResizing: false,
			    allowResizeToFit: false,
			    allowTextWrap: false,
			    allowCellMerging: false,
			    enableRowHover: true,
			    enablePersistence: false,
			    enableFocusout: false,
			    selectedRowIndex: -1,
			    allowSearching: false,
			    enableToolbarItems: false,
			    enableHeaderHover: false,
			    allowReordering: false,
			    allowKeyboardNavigation: true,
			    allowRowDragAndDrop: false,
			    enableTouch: true,
			    columnLayout: 'auto',
			    selectionType: "single",
			    dataSource: null,
			    cssClass: "",
			    allowScrolling: false,
			    locale: "en-US",
			    enableAutoSaveOnSelectionChange: true,
			    allowMultiSorting: false,
			    exportToExcelAction: "",
			    exportToWordAction: "",
			    exportToPdfAction: "",
			    _groupingCollapsed: [],
			    editSettings: {
			        allowEditing: false,
			        showAddNewRow: false,
			        allowAdding: false,
			        allowDeleting: false,
			        editMode: "normal",
			        rowPosition: "top",
			        dialogEditorTemplateID: null,
			        allowEditOnDblClick: true,
			        externalFormTemplateID: null,
			        inlineFormTemplateID: null,
			        formPosition: "bottomleft",
			        titleColumn: null,
			        showConfirmDialog: true,
			        showDeleteConfirmDialog: false
			    },
			    selectionSettings: {
			        selectionMode: ["row"],
			        enableToggle: false,
			        cellSelectionMode: "flow"
			    },
			    pageSettings: {
			        pageSize: 12,
			        pageCount: 8,
			        currentPage: 1,
			        totalPages: null,
			        enableTemplates: false,
			        showDefaults: false,
			        template: null,
			        totalRecordsCount: null,
			        enableQueryString: false,
			        printMode: "allpages"
			    },
			    groupSettings: {
			        showDropArea: true,
			        showToggleButton: false,
			        showGroupedColumn: true,
			        showUngroupButton: true,
			        enableDropAreaAutoSizing: true,
			        captionFormat: null,
			        groupedColumns: []
			    },
			    contextMenuSettings: {
			        enableContextMenu: false,
			        contextMenuItems: ["Add Record", "Edit Record", "Delete Record", "Sort In Ascending Order", "Sort In Descending Order", "Next Page", "Last Page", "Previous Page", "First Page", "Save", "Cancel", "Grouping", "Ungrouping"],
			        customContextMenuItems: [],
			        subContextMenu: [],
			        disableDefaultItems: false
			    },
			    filterSettings: {
			        filterType: "filterbar",
			        filterBarMode: "immediate",
			        showFilterBarStatus: true,
			        statusBarWidth: 450,
			        showPredicate: false,
			        filteredColumns: [],
			        enableInterDeterminateState: true,
			        maxFilterChoices: 1000,
			        enableCaseSensitivity: false,
			        immediateModeDelay: 1500,
			        enableComplexBlankFilter: true,
			        blankValue: ""
			    },
			    searchSettings: {
			        fields: [],
			        key: "",
			        operator: "contains",
			        ignoreCase: true
			    },
			    sortSettings: {
			        sortedColumns: []
			    },
			    toolbarSettings: {
			        showToolbar: false,
			        toolbarItems: [],
			        customToolbarItems: []
			    },
			    minWidth: 0,
			    currentIndex: 0,
			    rowDropSettings: {
			        dropMapper: null,
			        dragMapper: null,
			        dropTargetID: null,
			    },
			    scrollSettings:
                {
                    width: "auto",
                    height: 0,
                    enableTouchScroll: true,
                    allowVirtualScrolling: false,
                    virtualScrollMode: "normal",
                    frozenRows: 0,
                    frozenColumns: 0,
                    buttonSize: 18,
                    autoHide: false,
                    scrollerSize: 18,
                    scrollOneStepBy: 57,
                    enableVirtualization: false
                },
			    textWrapSettings: {
			        wrapMode: "both"
			    },
			    summaryRows: [],
			    enableRTL: false,
			    enableAltRow: true,
			    currentViewData: null,
			    detailsTemplate: null,
			    childGrid: null,
			    keySettings: null,
			    rowTemplate: null,
			    detailsDataBound: null,
			    rowDataBound: null,
			    queryCellInfo: null,
			    mergeCellInfo: null,
			    create: null,
			    actionBegin: null,
			    actionComplete: null,
			    actionFailure: null,
			    beginEdit: null,
			    endEdit: null,
			    endAdd: null,
			    endDelete: null,
			    beforeBatchAdd: null,
			    beforeBatchSave: null,
			    beforeBatchDelete: null,
			    batchAdd: null,
			    batchDelete: null,
			    cellSave: null,
			    cellEdit: null,
			    resizeStart: null,
			    resizeEnd: null,
			    resized: null,
			    load: null,
			    destroy: null,
			    rowSelecting: null,
			    rowSelected: null,
			    cellSelecting: null,
			    cellSelected: null,
			    columnSelecting: null,
			    columnSelected: null,
			    columnDragStart: null,
			    columnDrag: null,
			    columnDrop: null,
			    dataBound: null,
			    recordClick: null,
			    recordDoubleClick: null,
			    templateRefresh: null,
			    rightClick: null,
			    detailsCollapse: null,
			    detailsExpand: null,
			    toolbarClick: null,
			    contextOpen: null,
			    contextClick: null,
			    columns: [],
			    query: null,
			    isEdit: false,
			    isResponsive: false,
			    enableResponsiveRow: false,
			    virtualLoading: null
			}
        };
        HeatMapGrid.prototype._dataSource = ej.util.valueFunction("dataSource");
        HeatMapGrid.prototype._selectedRow = ej.util.valueFunction("selectedRowIndex");
        HeatMapGrid.prototype._currentPage = ej.util.valueFunction("pageSettings.currentPage");

        HeatMapGrid.prototype._mapValues = function (args) {

        };
        HeatMapGrid.prototype._createElement = function (element, options) {
            this.element = element.jquery ? element : $(element);
            this.sfType = "ej-grid";
            this.pluginName = "ej.Grid";
            this.model = ej.copyObject(true, {}, this.model, options);
            this.model.keyConfigs = ej.copyObject(this.keyConfigs);
            this.element.addClass("e-grid e-js").data("ej.Grid", this);


        };
        HeatMapGrid.prototype._init = function (element, options, heatmap) {
            this._createElement(element, options);
            if (ej.isNullOrUndefined(this.model.query) || !(this.model.query instanceof ej.Query))
                this.model.query = ej.Query();
            if (!ej.isNullOrUndefined(this.model.parentDetails)) {
                var temp = this.model.queryString, ftemp = this.model.foreignKeyField;
                this.model.query = this.model.query.clone();
                var val = (this.model.parentDetails.parentKeyFieldValue === undefined) ? "undefined" : this.model.parentDetails.parentKeyFieldValue;
                this.model.query.where(ej.isNullOrUndefined(ftemp) ? temp : ftemp, "equal", val, true);
            }
            this._initPrivateProperties();

            this._initScrolling();
            if (this.model.enableResponsiveRow)
                this.element.addClass("e-responsive");
            this._checkForeignKeyBinding();
            this._checkDataBinding(heatmap);
            this._refreshScroller({});
        };
        HeatMapGrid.prototype._checkDataBinding = function (heatmap) {
            //if (!this.model.columns.length && (((this._dataSource() == null || !this._dataSource().length) && !(this._dataSource() instanceof ej.DataManager)) || ((this._dataSource() instanceof ej.DataManager) && this._dataManager.dataSource.url == undefined && !this._dataSource().dataSource.json.length))) {

            //    return;
            //}

            //if (this.model.editSettings.allowDeleting && this.model.selectionType == "multiple")
            //    this.multiDeleteMode = true;
            //this.initialRender = true;
            //this.model.enableRTL && this.element.addClass("e-rtl");

            //if (this.model.cssClass != null)
            //    this.element.addClass(this.model.cssClass);
            //if (this.model.allowGrouping)
            //    this.element.append(this._renderGroupDropArea());

            //var columns = this.model.columns;
            //if (columns && columns.length) {
            //    var expands = this.model.query._expands;
            //    if (typeof columns[0] === "string")
            //        for (var i = 0; i < columns.length; i++)
            //            columns[i] = { field: columns[i] };
            //    for (var i = 0; i < columns.length; i++) {
            //        if (!columns[i].field || columns[i].field.indexOf('.') === -1) continue;
            //        this._getExpands(columns[i].field, expands);
            //    }
            //    this.model.query.expand(expands);
            //    this.commonQuery.expand(expands);
            //    this._renderAfterColumnInitialize();
            //}

            //if (this.model.scrollSettings.allowVirtualScrolling) {
            //    this._loadedJsonData = [];
            //    this._prevPage = 1;
            //}
            //this._ensureDataSource();
            ////this._trigger("actionBegin");
            //this._setForeignKeyData();

            //this._relationalColumns.length == 0 && this._initGridRender(heatmap);
            //this._vRowHeight = Math.floor(this.getRowHeight());


            if (!this.model.columns.length && (((this._dataSource() == null || !this._dataSource().length) && !(this._dataSource() instanceof ej.DataManager)) || ((this._dataSource() instanceof ej.DataManager) && this._dataManager.dataSource.url == undefined && !this._dataSource().dataSource.json.length))) {
                //this._renderAlertDialog();
                this._alertDialog.find(".e-content").text(this.localizedLabels.EmptyDataSource);
                this._alertDialog.ejDialog("open");
                return;
            }
            this._initialRenderings();
            if (this.model.editSettings.allowDeleting && this.model.selectionType == "multiple")
                this.multiDeleteMode = true;
            this.initialRender = true;
            this.model.enableRTL && this.element.addClass("e-rtl");
            if (this.model.allowFiltering && this._isExcelFilter)
                this._renderExcelFilter();
            if (this.model.cssClass != null)
                this.element.addClass(this.model.cssClass);
            if (this.model.allowGrouping)
                this.element.append(this._renderGroupDropArea());
            if (this.model.toolbarSettings.showToolbar || ((this.model.allowSorting || this.model.allowFiltering) && this.model.enableResponsiveRow))
                this.element.append(this._renderToolBar());
            var columns = this.model.columns;
            if (columns && columns.length) {
                var expands = this.model.query._expands;
                if (typeof columns[0] === "string")
                    for (var i = 0; i < columns.length; i++)
                        columns[i] = { field: columns[i] };
                for (var i = 0; i < columns.length; i++) {
                    if (!columns[i].field || columns[i].field.indexOf('.') === -1) continue;
                    this._getExpands(columns[i].field, expands);
                }
                this.model.query.expand(expands);
                this.commonQuery.expand(expands);
                this._renderAfterColumnInitialize();
            }
            if (this.model.allowPaging)
                this.element.append(this._renderGridPager());
            if (this.model.contextMenuSettings.enableContextMenu)
                this.element.append(this._renderContext());
            if (this.model.scrollSettings.allowVirtualScrolling) {
                this._loadedJsonData = [];
                this._prevPage = 1;
            }
            if (this._dataSource() instanceof ej.DataManager) {
                if (this._dataSource().ready != undefined) {
                    var proxy = this;
                    this._dataSource().ready.done(function (args) {
                        proxy._initDataSource();
                        proxy.model.dataSource = ej.DataManager(args.result);
                    });
                } else {
                    this._initDataSource();
                }
            } else {
                this._ensureDataSource();
                //this._trigger("actionBegin");
                this._setForeignKeyData();
                this._relationalColumns.length == 0 && this._initGridRender(heatmap);
                this._vRowHeight = Math.floor(this.getRowHeight());
            }
            if (this.model.showColumnChooser)
                this._renderColumnChooser();

        };
        HeatMapGrid.prototype._initialRenderings = function () {
            if (this.model.groupSettings.groupedColumns.length) {
                var sortedColumns = new Array();
                for (var i = 0; i < this.model.sortSettings.sortedColumns.length; i++) {
                    if (ej.isNullOrUndefined(this.model.sortSettings.sortedColumns[i].direction))
                        this.model.sortSettings.sortedColumns[i].direction = ej.sortOrder.Ascending;
                    sortedColumns.push(this.model.sortSettings.sortedColumns[i].field);
                }
                if (this.model.allowGrouping) {
                    for (var i = 0; i < this.model.groupSettings.groupedColumns.length; i++) {
                        if ($.inArray(this.model.groupSettings.groupedColumns[i], sortedColumns) == -1)
                            this.model.sortSettings.sortedColumns.push({ field: this.model.groupSettings.groupedColumns[i], direction: ej.sortOrder.Ascending });
                    }
                }
            }
        };
        HeatMapGrid.prototype._renderAfterColumnInitialize = function () {
            this.element.append(this._renderGridHeader());
        };
        HeatMapGrid.prototype.setGridHeaderContent = function (value) {
            this._gridHeaderContent = value;
        };
        HeatMapGrid.prototype._renderGridHeader = function () {
            var $div = ej.buildTag('div.e-gridheader'), temp, $frozenDiv, $movableDiv;
            var $innerDiv = ej.buildTag('div');
            if (this.model.allowScrolling)
                $innerDiv.addClass("e-headercontent");
            this.setGridHeaderContent($div);
            if (this.initialRender) {
                this.columnsWidthCollection = [];
                this._hiddenColumns = [];
                this._hiddenColumnsField = [];
            }
            this._visibleColumns = [];
            this._visibleColumnsField = [];
            this._disabledGroupableColumns = [];
            this._fieldColumnNames = {};
            this._headerColumnNames = {};
            if (this.model.scrollSettings.frozenColumns > 0) {
                $frozenDiv = ej.buildTag("div.e-frozenheaderdiv", this._renderGridHeaderInternalDesign(this.model.columns.slice(0, this.model.scrollSettings.frozenColumns), true));
                $movableDiv = ej.buildTag("div.e-movableheader", ej.buildTag("div.e-movableheaderdiv", this._renderGridHeaderInternalDesign(this.model.columns.slice(this.model.scrollSettings.frozenColumns), false)));
                $innerDiv.append($frozenDiv).append($movableDiv);
            } else
                $innerDiv.append(this._renderGridHeaderInternalDesign(this.model.columns));
            $div.html($innerDiv);
            if (this.model.isResponsive)
                $div.addClass("e-textover");
            this.setGridHeaderTable(this.getHeaderContent().find(".e-table"));
            return $div;
        };
        HeatMapGrid.prototype.setGridHeaderTable = function (value) {
            this._gridHeaderTable = value;
        };
        HeatMapGrid.prototype._renderGridHeaderInternalDesign = function (columns, frozenHeader) {
            var $table = ej.buildTag('table.e-table', "", {}, { "data-role": "heatmap" });
            var $thead = ej.buildTag('thead');
            var $tbody = ej.buildTag('tbody.e-hide');
            var $columnHeader = ej.buildTag('tr.e-columnheader');
            var $colGroup = $(document.createElement('colgroup'));
            var $rowBody = $(document.createElement('tr'));
            if (this.model.childGrid || this.model.detailsTemplate) {
                $columnHeader.append(ej.buildTag('th.e-headercell e-detailheadercell', '<div></div>'));
                $colGroup.append(this._getIndentCol());
            }
            if (this.model.showStackedHeader) {
                for (var index = 0; index < this.model.stackedHeaderRows.length; index++) {
                    var $tr = this._createStackedRow(this.model.stackedHeaderRows[index], frozenHeader);
                    $thead.append($tr);
                }
            }
            for (var columnCount = 0; columnCount < columns.length; columnCount++) {
                var $headerCell = ej.buildTag('th.e-headercell e-default', "", {}, { "data-role": "columnheader" });
                var bodyCell = document.createElement('td');
                var $headerCellDiv = ej.buildTag('div.e-headercelldiv', columns[columnCount]["headerText"] === undefined ? columns[columnCount]["headerText"] = columns[columnCount]["field"] : columns[columnCount]["headerText"], {}, { "data-ej-mappingname": columns[columnCount]["field"] });
                if (columns[columnCount].disableHtmlEncode)
                    $headerCellDiv.text(columns[columnCount]["headerText"]);
                if (!ej.isNullOrUndefined(columns[columnCount]["headerTooltip"]))
                    $headerCellDiv.addClass("e-headertooltip");
                if (!ej.isNullOrUndefined(columns[columnCount]["tooltip"]))
                    $headerCellDiv.addClass("e-gridtooltip");
                if (columns[columnCount]["clipMode"] == ej.HeatMapGrid.ClipMode.Ellipsis || columns[columnCount]["clipMode"] == ej.HeatMapGrid.ClipMode.EllipsisWithTooltip)
                    $headerCellDiv.addClass("e-gridellipsis");
                $headerCell.append($headerCellDiv);
                if (this.model.allowFiltering && (this.model.filterSettings.filterType == "menu" || this.model.filterSettings.filterType == "excel") &&
                                (columns[columnCount]["allowFiltering"] == undefined || columns[columnCount]["allowFiltering"] === true) && (!ej.isNullOrUndefined(columns[columnCount].field) || columns[columnCount].field == "")) {
                    var filtericon = 'e-filterset';
                    if (!this.initialRender && this.model.filterSettings.filteredColumns) {
                        for (var i = 0; i < this.model.filterSettings.filteredColumns.length; i++) {
                            if (this.model.filterSettings.filteredColumns[i].field == columns[columnCount].field) {
                                filtericon = 'e-filterset e-filteredicon e-filternone';
                            }
                        }
                    }
                    $headerCell.append(ej.buildTag('div.e-filtericon e-icon ' + filtericon));
                    $headerCell.addClass("e-headercellfilter");
                    if (ej.browserInfo().name == "msie" && ej.browserInfo().version == "8.0" && this.model.enableRTL)
                        $($headerCellDiv).css("padding", "0 0 0 2em");
                }
                var col = document.createElement('col');
                if (columns[columnCount]["priority"])
                    $(bodyCell).addClass("e-table-priority-" + columns[columnCount]["priority"]);
                $rowBody.append(bodyCell);
                $columnHeader.append($headerCell);
                $colGroup.append(col);
                if (columns[columnCount]["visible"] === false) {
                    $headerCell.addClass("e-hide") && $(col).css("display", "none")
                    if ($.inArray(columns[columnCount].headerText, this._hiddenColumns) == -1 && $.inArray(columns[columnCount].field, this._hiddenColumnsField) == -1)
                        this._hiddenColumns.push(columns[columnCount].headerText) && columns[columnCount].field != ("" || undefined) ? this._hiddenColumnsField.push(columns[columnCount].field) : this._hiddenColumnsField.push(columns[columnCount].headerText);
                    if ($.inArray(columns[columnCount].field, this._visibleColumnsField) != -1)
                        this._visibleColumnsField.splice($.inArray(columns[columnCount].field, this._visibleColumnsField), 1) && this._visibleColumns.splice($.inArray(columns[columnCount].headerText, this._visibleColumns), 1)
                }
                else {
                    this._visibleColumns.push(columns[columnCount].headerText) && columns[columnCount].field != ("" || undefined) ? this._visibleColumnsField.push(columns[columnCount].field) : this._visibleColumnsField.push(columns[columnCount].headerText);
                    columns[columnCount]["visible"] = true;
                    if ($.inArray(columns[columnCount].field == "" ? columns[columnCount].headerText : columns[columnCount].field, this._hiddenColumnsField) != -1)
                        this._hiddenColumnsField.splice($.inArray(columns[columnCount].field == "" ? columns[columnCount].headerText : columns[columnCount].field, this._hiddenColumnsField), 1) && this._hiddenColumns.splice($.inArray(columns[columnCount].headerText, this._hiddenColumns), 1)
                }
                if (this.model.showColumnChooser && columns[columnCount]["showInColumnChooser"] !== false)
                    columns[columnCount]["showInColumnChooser"] = true;
                if (this.model.allowResizing && columns[columnCount]["allowResizing"] !== false)
                    columns[columnCount]["allowResizing"] = true;
                if (!ej.isNullOrUndefined(columns[columnCount]["headerTextAlign"]))
                    $headerCellDiv.css("text-align", columns[columnCount]["headerTextAlign"]);
                else if (columns[columnCount]["textAlign"] != undefined)
                    $headerCellDiv.css("text-align", columns[columnCount]["textAlign"]);
                else if (this.model.enableRTL)
                    $headerCellDiv.css("text-align", columns[columnCount]["textAlign"] = "right");
                columns[columnCount]["allowResizing"] === false && this._disabledResizingColumns.push(columns[columnCount].field);
                columns[columnCount]["allowSorting"] === false && this._disabledSortableColumns.push(columns[columnCount].field);
                columns[columnCount]["allowGrouping"] === false && this._disabledGroupableColumns.push(columns[columnCount].field);
                columns[columnCount]["allowEditing"] === false && this._disabledEditableColumns.push(columns[columnCount].field);
                if (!ej.isNullOrUndefined(columns[columnCount]["cssClass"])) {
                    $headerCell.addClass(columns[columnCount]["cssClass"]);
                    $(col).addClass(columns[columnCount]["cssClass"]);
                }
                if (!ej.isNullOrUndefined(columns[columnCount]["headerTemplateID"])) {
                    $headerCellDiv.html($(columns[columnCount]["headerTemplateID"]).hide().html()).parent().addClass("e-headertemplate");
                    var index = $.inArray(columns[columnCount].field, this._disabledGroupableColumns);
                    index == -1 && ej.isNullOrUndefined(columns[columnCount].field) && this._disabledGroupableColumns.push(columns[columnCount].field);
                }

                if (this.model.isResponsive)
                    $headerCell.attr("title", this._decode(columns[columnCount].headerText));
                if (columns[columnCount]["priority"]) {
                    $headerCell.attr("data-priority", columns[columnCount]["priority"]).addClass("e-table-priority-" + columns[columnCount]["priority"]);
                    $(col).addClass("e-table-priority-" + columns[columnCount]["priority"]);
                }
                if (this.initialRender) {
                    if (typeof (columns[columnCount].width) == "string" && columns[columnCount].width.indexOf("%") != -1)
                        this.columnsWidthCollection.push(parseInt(columns[columnCount]["width"]) / 100 * this.element.width());
                    else
                        this.columnsWidthCollection.push(columns[columnCount]["width"]);
                }
                if (columns[columnCount]["width"] == undefined && this.model.commonWidth !== undefined)
                    this.columnsWidthCollection[columnCount] = this.model.commonWidth;
                this._fieldColumnNames[columns[columnCount].headerText] = columns[columnCount].field;
                this._headerColumnNames[columns[columnCount].field] = columns[columnCount].headerText;
            }
            $thead.append($columnHeader);
            $tbody.append($rowBody);
            $table.append($colGroup).append($thead).append($tbody);
            return $table;
        };
        HeatMapGrid.prototype._decode = function (value) {
            return $('<div/>').html(value).text();
        };
        HeatMapGrid.prototype._checkForeignKeyBinding = function () {
            if (!this.model.columns.length)
                return;
            var c, _cols, _len, _col;
            for (c = 0, _cols = this.model.columns, _len = _cols.length; c < _len; c++) {
                _col = _cols[c];
                if (_col.hasOwnProperty("foreignKeyField") && _col["dataSource"] instanceof ej.DataManager)
                    this._relationalColumns.push({ field: _col["field"], key: _col["foreignKeyField"], value: _col["foreignKeyValue"], dataSource: _col["dataSource"] });
            }
            this._$fkColumn = true;
        };
        HeatMapGrid.prototype._initScrolling = function () {
            var frozen = [], unfrozen = [], hideColumns = 0;
            for (var columnCount = 0; columnCount < this.model.columns.length; columnCount++) {
                if (this.model.columns[columnCount].visible === false && columnCount < this.model.scrollSettings.frozenColumns)
                    hideColumns++;
                if (this.model.columns[columnCount]["isFrozen"] === true)
                    frozen.push(this.model.columns[columnCount]);
                else
                    unfrozen.push(this.model.columns[columnCount]);
            }
            if (frozen.length > 0) {
                var freeze = this.model.scrollSettings.frozenColumns;
                this.model.columns = $.merge($.merge([], frozen), unfrozen);
                this.model.scrollSettings.frozenColumns = frozen.length;
                if (frozen.length != freeze && freeze != 0)
                    this.model.scrollSettings.frozenColumns = freeze;
            }
            if ((this.model.scrollSettings.frozenColumns > 0 || this.model.scrollSettings.frozenRows > 0) && (this.model.allowGrouping || this.model.rowTemplate != null || this.model.detailsTemplate != null || this.model.childGrid != null || this.model.scrollSettings.allowVirtualScrolling || this.model.editSettings.editMode == "batch")) {

                return;
            }
            if (this.model.scrollSettings.allowVirtualScrolling && this.model.allowScrolling) {
                if (!this.model.scrollSettings.enableVirtualization) {
                    this.model.pageSettings.pageSize = this.model.pageSettings.pageSize == 12 ? Math.round(this.model.scrollSettings.height / 32) + 1 : this.model.pageSettings.pageSize;
                    this.model.pageSettings.totalPages = Math.ceil(this._gridRecordsCount / this.model.pageSettings.pageSize);
                }
                else {
                    this._vRowHeight = Math.floor(this.getRowHeight() + 1);
                    this._virtualRowCount = Math.round(this.model.scrollSettings.height / this._vRowHeight) + 1;
                    if (this.model.pageSettings.pageSize < this._virtualRowCount * 5)
                        this.model.pageSettings.pageSize = this._virtualRowCount * 5;
                }
            }
            if (this.model.width || this.model.height) {
                this.model.allowScrolling = true;
                if (this.model.width) this.model.scrollSettings.width = this.model.width;
                if (this.model.height) this.model.scrollSettings.height = this.model.height;
            }
            this._originalScrollWidth = ej.isNullOrUndefined(this.model.scrollSettings.previousStateWidth) ? this.model.scrollSettings.width : this.model.scrollSettings.previousStateWidth;
        };
        HeatMapGrid.prototype._initPrivateProperties = function () {
            this._click = 0;
            this._tabKey = false;
            this._gridHeaderTable = null;
            this._gridWidth = this.element.width();
            this._id = this.element.attr("id");
            this._gridRows = null;
            this._unboundRow = null;
            this._gridContentTable = null;
            this._gridContent = null;
            this._remoteSummaryData = null;
            this._gridSort = null;
            this._gridHeaderContent = null;
            this._gridFooterContent = null;
            this._gridFooterTable = null;
            this._gridRecordsCount = this._dataSource() !== null ? (this.model.pageSettings.totalRecordsCount == null ? this._dataSource().length : this.model.pageSettings.totalRecordsCount) : 0;
            this._links = null;
            this._gridPager = null;
            this._cSortedColumn = null;
            this._cSortedDirection = null;
            this._$curSElementTarget = null;
            this._gridFilterBar = null;
            this._$curFieldName = null;
            this._$prevFieldName = null;
            this._mediaStatus = false;
            this._$fDlgIsOpen = false;
            this._$menuDlgIsOpen = false;
            this._$colType = null;
            this._$colFormat = null;
            this._$prevColType = null;
            this._$prevSElementTarget = null;
            this._currentFilterColumn = null;
            this._filteredRecordsCount = null;
            this._filteredRecords = [];
            this._validatedColumns = [];
            this.filterColumnCollection = [];
            this._previousFilterCount = null;
            this._excelFilter = null;
            this._isExcelFilter = this.model.filterSettings.filterType == "excel";
            this._$fkColumn = false;
            this._fkParentTblData = [];
            this._primaryKeys = [];
            this._identityKeys = [];
            this._primaryKeyValues = [];
            this._modifiedRecords = [];
            this._addedRecords = [];
            this._tdsOffsetWidth = [];
            this._deletedRecords = [];
            this._disabledToolItems = $();
            this._validationRules = {};
            this._groupedColumns = [];
            this._scolumns = [];
            this._currentJsonData = [];
            this._groupingColumnIndex = 0;
            this._dataManager = this._dataSource() instanceof ej.DataManager ? this._dataSource() : this._dataSource() != null ? ej.DataManager(this._dataSource()) : null;
            if (this._dataManager != null && this.model.allowScrolling && this.model.scrollSettings.allowVirtualScrolling && this.model.pageSettings.totalRecordsCount != null && this._dataManager.dataSource.json != null)
                this._dataManager.dataSource.json.splice(this.model.pageSettings.totalRecordsCount);
            this._isRemoteSaveAdaptor = (this._dataSource() instanceof ej.DataManager && this._dataSource().adaptor instanceof ej.remoteSaveAdaptor);
            this._isLocalData = true;
            this._disabledResizingColumns = [];
            this._disabledSortableColumns = [];
            this._disabledGroupableColumns = [];
            this._disabledFilterableColumns = [];
            this._disabledEditableColumns = [];
            this._hiddenColumns = [];
            this._visibleColumns = [];
            this._visibleColumnsField = [];
            this._hiddenColumnsField = [];
            this._ccVisibleColumns = [];
            this._ccHiddenColumns = [];
            this._sortedColumns = [];
            this.multiSortRequest = false;
            this.multiSelectCtrlRequest = false;
            this.multiSelectShiftRequest = false;
            this._enableSelectMultiTouch = false;
            this._enableSortMultiTouch = false;
            this._templateRefresh = false;
            this.initialRender = false;
            this._selectDrag = false;
            this._isAddNew = false;
            this._fieldColumnNames = {};
            this._headerColumnNames = {};
            this._virtualLoadedRecords = {};
            this._virtualLoadedRows = {};
            this._virtualPageRecords = {};
            this._queryCellView = [];
            this._currentPageViews = [];
            this._virtualLoadedPages = [];
            this._currentLoadedIndexes = [];
            this._prevVirtualSort = [];
            this._prevVirtualFilter = [];
            this._prevVirtualIndex = 0;
            this._currentVirtualIndex = 1;
            this._virtualRowCount = 0;
            this._virtualSelectedRecords = {};
            this.selectedRowsIndexes = [];
            this._isReorder = false;
            this._searchString = "";
            this._searchCount = null;
            this.columnsWidthCollection = [];
            this._Indicator = null;
            this._resizer = null;
            this._bulkEditCellDetails = {
                cellValue: null,
                rowIndex: -1,
                columnIndex: -1,
                fieldName: null,
                _data: null,
                cellEditType: "",
                cancelSave: false,
                defaultData: null,
                insertedTrCollection: [],
                rowData: null
            };
            this.batchChanges = {
                added: [],
                deleted: [],
                changed: []
            };
            this._bulkEditTemplate = $();
            this._confirmDialog = null;
            this._confirmedValue = false;
            this._lastRow = false;
            this._isVirtualRecordsLoaded = false;
            this._scrollValue = 0;
            this._currentTopFrozenRow = this.model.scrollSettings.frozenRows;
            this._rowHeightCollection = [];
            this._scrollObject = null;
            this._customPop = null;
            this.selectedRowCellIndexes = [];
            this._rowIndexesColl = [];
            this.selectedColumnIndexes = [];
            this._allowrowSelection = this._allowcellSelection = this._allowcolumnSelection = false;
            this.commonQuery = $.extend(true, {}, this.model.query);

            this.phoneMode = this.model.isResponsive && document.documentElement.clientWidth < 360 ? true : false;
            if (this.model.selectionSettings.selectionMode.length > 0 && this.model.allowSelection)
                this._initSelection();
            this._mediaQuery = false;
            this._columnChooserList = null;
            this._$headerCols = null;
            this._$contentCols = null;
            this._detailsOuterWidth = null;
            this._editForm = null;
            this._cloneQuery = null;
            this.localizedLabels = this._getLocalizedLabels();
            this._searchBar = null;
            this._relationalColumns = [];
            this._dropDownManager = {};
            this._isUngrouping = false;
            this._columnChooser = false;

        };
        HeatMapGrid.prototype._getLocalizedLabels = function (property) {
            return ej.getLocalizedConstants("ej.HeatMapGrid", this.model.locale);
        };
        HeatMapGrid.prototype._initSelection = function () {
            var mode = this.model.selectionSettings.selectionMode;
            for (var i = 0; i < mode.length; i++) {
                this["_allow" + mode[i] + "Selection"] = true;
            }
        };
        HeatMapGrid.prototype._getSelectedViewData = function (rowIndex, target, currentViewIndex) {
            var index = rowIndex % this._virtualRowCount, viewIndex, result = {};
            if (target)
                viewIndex = parseInt($(target).closest("tr").attr("name"), 32);
            else if (currentViewIndex)
                viewIndex = currentViewIndex;
            else
                viewIndex = rowIndex > 1 ? Math.ceil((rowIndex + 1) / this._virtualRowCount) : 1;
            result["viewIndex"] = viewIndex;
            if (this._virtualLoadedRecords[viewIndex])
                result["data"] = this._virtualLoadedRecords[viewIndex][index];
            var remain = rowIndex % this._virtualRowCount;
            result["rowIndex"] = (viewIndex * this._virtualRowCount) - (this._virtualRowCount - remain);
            return result;
        };
        HeatMapGrid.prototype._frozenCell = function (rowIndex, cellIndex) {
            var currentIndex = cellIndex, frozenDiv = 0, row = this.getRowByIndex(rowIndex), cell;
            if (cellIndex >= this.model.scrollSettings.frozenColumns) {
                frozenDiv = 1;
                currentIndex = currentIndex - this.model.scrollSettings.frozenColumns;
            }
            cell = $(row.eq(frozenDiv).find(".e-rowcell:eq(" + currentIndex + ")"));
            return cell;
        };
        HeatMapGrid.prototype.selectCells = function (rowCellIndexes) {
            if (!this._allowcellSelection)
                return false;
            var $cell = null, previousRowCell, prevRowCellIndex;
            var gridRows = this._excludeDetailRows();
            if (this.model.scrollSettings.frozenColumns)
                $cell = this._frozenCell(rowCellIndexes[0][0], rowCellIndexes[0][1][0]);
            else
                $cell = gridRows.eq(rowCellIndexes[0][0]).find(".e-rowcell:eq(" + rowCellIndexes[0][1] + ")");
            if (!ej.isNullOrUndefined(this._previousRowCellIndex) && this._previousRowCellIndex.length != 0) {
                if (this.model.scrollSettings.enableVirtualization) {
                    previousRowCell = this._prevRowCell;
                    prevRowCellIndex = this._preVirRowCellIndex;
                }
                else {
                    previousRowCell = $(this.getRowByIndex(this._previousRowCellIndex[0][0]).find(".e-rowcell:eq(" + this._previousRowCellIndex[0][1] + ")"));
                    prevRowCellIndex = this._previousRowCellIndex;
                }
            }
            var $data = this._currentJsonData[rowCellIndexes[0][0]], $rowIndex = rowCellIndexes[0][0], viewDetails;
            if (this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization) {
                viewDetails = this._getSelectedViewData(rowCellIndexes[0][0], $cell);
                $data = viewDetails.data;
                $rowIndex = viewDetails.rowIndex;
            }
            var args = { currentCell: $cell, cellIndex: rowCellIndexes[0][1], data: $data, previousRowCellIndex: prevRowCellIndex, previousRowCell: previousRowCell };
            if (this.model.selectionType == "multiple") {
                args["isCtrlPressed"] = this.multiSelectCtrlRequest;
                args["isShiftPressed"] = this.multiSelectShiftRequest;
            }
            //if (this._trigger("cellSelecting", args))
            //return;
            switch (this.model.selectionType) {
                case ej.HeatMapGrid.SelectionType.Single:
                    this.clearCellSelection();
                    this.clearColumnSelection();
                    this.selectedRowCellIndexes = [];
                    this._virtualRowCellSelIndex = [];
                    if ($.inArray($rowIndex, this._rowIndexesColl) == -1)
                        this._rowIndexesColl.push($rowIndex);
                    this.selectedRowCellIndexes.push({ rowIndex: $rowIndex, cellIndex: rowCellIndexes[0][1] });
                    if (this.model.scrollSettings.frozenColumns)
                        this._frozenCell(rowCellIndexes[0][0], rowCellIndexes[0][1][0]).addClass("e-cellselectionbackground e-activecell");
                    else
                        $(this.getRowByIndex(rowCellIndexes[0][0]).find(".e-rowcell:eq(" + rowCellIndexes[0][1] + ")")).addClass("e-cellselectionbackground e-activecell");
                    break;
            }
            var args = { currentCell: $cell, cellIndex: rowCellIndexes[0][1], data: $data, selectedRowCellIndex: this.selectedRowCellIndexes, previousRowCellIndex: prevRowCellIndex, previousRowCell: previousRowCell };
            if (!this.multiSelectShiftRequest || ej.isNullOrUndefined(this._previousRowCellIndex)) {
                this._previousRowCellIndex = rowCellIndexes;
                if (this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization) {
                    this._preVirRowCellIndex = $.extend(true, [], rowCellIndexes);
                    this._preVirRowCellIndex[0][0] = $rowIndex;
                }
                this._prevRowCell = $cell;
            }
            if (this._heatmap)
                this._heatmap._cellSelected(args);
            return;
        };
        HeatMapGrid.prototype.clearSelection = function (index) {
            var $gridRows, index;
            if (this._selectedRow() >= -1) {
                if (this.model.scrollSettings.frozenColumns)
                    $gridRows = this._excludeDetailRows();
                else
                    $gridRows = $(this.element.find("tr[aria-selected='true']"));
                if (!ej.isNullOrUndefined(index)) {
                    this.getRowByIndex(index).removeAttr("aria-selected").find(".e-selectionbackground").removeClass("e-selectionbackground").removeClass("e-active");
                    var row = this.getRowByIndex(index);
                    if (this.model.scrollSettings.enableVirtualization && this.multiSelectCtrlRequest && $.inArray(index, this.selectedRowsIndexes) == -1) {
                        var limit = parseInt(row.attr("name"), 32) * this._virtualRowCount;
                        var remain = this._virtualRowCount - row.index() % this._virtualRowCount;
                        index = limit - remain;
                    }
                    index = $.inArray(index, this.selectedRowsIndexes);
                    if (index != -1)
                        this.selectedRowsIndexes.splice(index, 1);
                } else {
                    if (this.model.scrollSettings.frozenColumns > 0)
                        $gridRows = $($gridRows[0]).add($gridRows[1]);
                    $gridRows.removeAttr("aria-selected").find(".e-rowcell, .e-detailrowcollapse, .e-detailrowexpand").removeClass("e-selectionbackground").removeClass("e-active");
                    if (!this._clearVirtualSelection) {
                        this.selectedRowsIndexes = [];
                        this.model.selectedRecords = [];
                    }
                }
                if (!this.selectedRowsIndexes.length)
                    this._selectedRow(-1);
            }
            return true;
        };
        HeatMapGrid.prototype._excludeDetailRows = function () {
            var $gridRows;
            if (!ej.isNullOrUndefined(this.model.detailsTemplate || this.model.childGrid || this.model.showSummary))
                $gridRows = $(this.getRows()).not(".e-detailrow,.e-gridSummaryRows");
            else
                $gridRows = $(this.getRows());
            return $gridRows;
        };
        HeatMapGrid.prototype.clearCellSelection = function (rowIndex, columnIndex) {
            var $gridRows, cellIndex;
            if (this._allowcellSelection) {
                if (this.model.scrollSettings.frozenColumns || !ej.isNullOrUndefined(rowIndex))
                    $gridRows = this._excludeDetailRows();
                else
                    $gridRows = $(this.element.find(".e-cellselectionbackground")).parent();
                if (ej.isNullOrUndefined(rowIndex)) {
                    if (this.model.scrollSettings.frozenColumns)
                        $gridRows = $($gridRows[0]).add($gridRows[1]);
                    $gridRows.find(".e-rowcell, .e-detailrowcollapse, .e-detailrowexpand").removeClass("e-cellselectionbackground").removeClass("e-activecell");
                    this.selectedRowCellIndexes = [];
                    this._rowIndexesColl = [];
                }
                else {
                    for (var i = 0; i < this.selectedRowCellIndexes.length ; i++) {
                        if (this.selectedRowCellIndexes[i].rowIndex == rowIndex) {
                            cellIndex = $.inArray(columnIndex, this.selectedRowCellIndexes[i].cellIndex);
                            if (this.model.scrollSettings.frozenColumns)
                                this._frozenCell(rowIndex, columnIndex).removeClass("e-cellselectionbackground").removeClass("e-activecell");
                            else
                                $gridRows.eq(rowIndex).find(".e-rowcell").eq(columnIndex).removeClass("e-cellselectionbackground").removeClass("e-activecell");
                            break;
                        }
                    }
                    if (i != this.selectedRowCellIndexes.length) {
                        this.selectedRowCellIndexes[i].cellIndex.splice(cellIndex, 1);
                        if (this.selectedRowCellIndexes[i].cellIndex.length == 0) {
                            this.selectedRowCellIndexes.splice(i, 1);
                            this._rowIndexesColl.splice($.inArray(rowIndex, this._rowIndexesColl), 1);
                        }
                    }
                }
            }
            return true;
        };
        HeatMapGrid.prototype.clearColumnSelection = function (index) {
            if (this._allowcolumnSelection) {
                var $gridRows = $(this._excludeDetailRows());
                if (!ej.isNullOrUndefined(index)) {
                    var indent = 0;
                    if (this.model.detailsTemplate != null || this.model.childGrid != null) {
                        ++index; indent = 1;
                    }
                    if (this.model.scrollSettings.frozenColumns) {
                        var frozenDiv = 0, currentIndex = index;
                        if (index >= this.model.scrollSettings.frozenColumns) {
                            frozenDiv = 1;
                            currentIndex = index - this.model.scrollSettings.frozenColumns;
                        }
                        for (var j = 0; j < $gridRows[frozenDiv].length; j++) {
                            $($gridRows[frozenDiv][j].cells[currentIndex]).removeClass("e-columnselection");
                        }
                    }
                    else
                        for (var i = 0; i < $gridRows.length; i++) {
                            $($gridRows[i].cells[index]).removeClass("e-columnselection");
                        }
                    $(this.getHeaderTable().find("th.e-headercell:not(.e-stackedHeaderCell)")[index]).removeClass("e-columnselection");
                    this.selectedColumnIndexes.splice(0, index - indent);

                } else {
                    if (this.model.scrollSettings.frozenColumns)
                        $gridRows = $($gridRows[0]).add($gridRows[1]);
                    $gridRows.find(".e-rowcell").removeClass("e-columnselection");
                    $(this.getHeaderTable().find("th.e-headercell:not(.e-stackedHeaderCell)")).removeClass("e-columnselection");
                    this.selectedColumnIndexes = [];
                }
            }
            return true;
        };
        HeatMapGrid.prototype.getSelectedRecords = function () {
            var records = [];
            if (this._virtualScrollingSelection)
                return this._virtualSelRecords;
            for (var i = 0; i < this.selectedRowsIndexes.length; i++) {
                if (this.selectedRowsIndexes[i] != -1) {
                    if (this.model.scrollSettings.allowVirtualScrolling)
                        records.push(this._virtualSelectedRecords[this.selectedRowsIndexes[i]]);
                    else
                        records.push(this._currentJsonData[this.selectedRowsIndexes[i]]);
                }
            }
            return records;
        };
        HeatMapGrid.prototype._setCurrentRow = function (requestType) {
            if (requestType == ej.HeatMapGrid.Actions.Refresh || requestType == ej.HeatMapGrid.Actions.Ungrouping || requestType == ej.HeatMapGrid.Actions.Grouping || requestType == ej.HeatMapGrid.Actions.Filtering || requestType == ej.HeatMapGrid.Actions.Sorting || requestType == ej.HeatMapGrid.Actions.Delete || requestType == ej.HeatMapGrid.Actions.Save || requestType == ej.HeatMapGrid.Actions.Cancel || requestType == ej.HeatMapGrid.Actions.Paging) {
                this._selectedRow(-1);
                if (!this._virtualDataRefresh)
                    this.selectedRowsIndexes = [];
            }
        };
        HeatMapGrid.prototype.refreshContent = function (refreshTemplate) {
            var args = {};
            args.requestType = ej.HeatMapGrid.Actions.Refresh;
            this._processBindings(args);
        };
        HeatMapGrid.prototype.rowHeightRefresh = function () {
            if (this.model.scrollSettings.frozenColumns > 0 && !ej.isNullOrUndefined(this.model.currentViewData) && this.model.currentViewData.length) {
                var frozenRows = this.getContentTable().get(0).rows;
                var movableRows = this.getContentTable().get(1).rows, height = 0;
                if (this.getContent().find(".e-frozencontentdiv").is(":visible"))
                    for (var i = 0; i < frozenRows.length; i++) {
                        if ($(frozenRows[i]).css("display") == "none")
                            continue;
                        height = ej.max([frozenRows[i].getClientRects()[0].height, movableRows[i].getClientRects()[0].height]);
                        $(frozenRows[i]).height(height); $(movableRows[i]).height(height);
                        if (i && (i == this.model.scrollSettings.frozenRows - 1 || i == frozenRows.length - 1))
                            height = height + 1;
                        if (!this.model.allowTextWrap) {
                            if (!i || i == this.model.scrollSettings.frozenRows - 1)
                                height = height - 1;
                        }
                        if (this.model.isEdit && $(frozenRows[i]).find("#" + this._id + "EditForm").length && i)
                            $(frozenRows[i]).find("#" + this._id + "EditForm td").css("height", height); $(movableRows[i]).find("#" + this._id + "EditForm td").css("height", height);
                    }
                this._getRowHeights()
                if (!ej.isNullOrUndefined(this.getContent().data("ejScroller")) && this.getScrollObject().isVScroll()) {
                    var scroller = this.getScrollObject()._vScrollbar;
                    if (scroller && scroller.value() != scroller.model.maximum)
                        this._scrollObject.refresh(this.model.scrollSettings.frozenColumns > 0);
                }

            }
        };
        HeatMapGrid.prototype._refreshDataSource = function (dataSource) {
            if (dataSource instanceof ej.DataManager)
                this._dataManager = dataSource;
            else
                this._dataManager = ej.DataManager(dataSource);
            this._isLocalData = (!(this._dataSource() instanceof ej.DataManager) || (this._dataManager.dataSource.offline || this._isRemoteSaveAdaptor));
            if (this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization) {
                this._refreshVirtualViewData();
                this._virtualDataRefresh = true;
            }
            this.refreshContent(true);
            this._refreshScroller({ requestType: "refresh" });
        };
        HeatMapGrid.prototype.dataSource = function (dataSource, templateRefresh) {
            if (templateRefresh)
                this._templateRefresh = true;
            this._dataSource(dataSource);
            if (!this.model.scrollSettings.enableVirtualization) {
                if (dataSource.length > 0)
                    this._currentPage(1);
                else
                    this._currentPage(0);
            }
            this._refreshDataSource(dataSource);
            var model = this._refreshVirtualPagerInfo();
            if (this.model.allowPaging || this.model.scrollSettings.allowVirtualScrolling)
                this._showPagerInformation(model)
            if (this.model.scrollSettings.allowVirtualScrolling) {
                if (this.model.scrollSettings.enableVirtualization && this._isLocalData)
                    this._refreshVirtualView();
                else
                    this._refreshVirtualContent();
                if (this.getContent().ejScroller("isHScroll"))
                    this.getContent().ejScroller("scrollX", 0, true);
                if (this.getContent().ejScroller("isVScroll")) {
                    if (!this.model.scrollSettings.enableVirtualization)
                        this.getContent().ejScroller("scrollY", 0, true);
                    this.element.find(".e-gridheader").addClass("e-scrollcss");
                }
                else
                    this.element.find(".e-gridheader").removeClass("e-scrollcss");
            }
            if (!this.model.scrollSettings.enableVirtualization || this._gridRows.length < this._virtualRowCount)
                this._addLastRow();
            this._trigger("dataBound", {});
        };
        HeatMapGrid.prototype._trigger = function (type, args) {

        };
        HeatMapGrid.prototype.getFooterContent = function () {
            return this._gridFooterContent;
        };
        HeatMapGrid.prototype.getScrollObject = function () {
            if (this._scrollObject == null || ej.isNullOrUndefined(this._scrollObject.model))
                this._scrollObject = this.getContent().ejScroller("instance");
            return this._scrollObject;
        };
        HeatMapGrid.prototype.getRowHeight = function () {
            var rowHeight = -1;
            if (this.getContentTable() != null) {
                var trColl = this.getContentTable().find('tr:not(.e-virtualrow)'), index = trColl.length > 2 ? 1 : 0;
                if (trColl.length)
                    var $trBound = trColl[index].getBoundingClientRect();
                if (trColl.length > 1) {
                    if ($trBound && $trBound.height) {
                        rowHeight = $trBound.height;
                    } else
                        rowHeight = trColl[index].offsetHeight;
                }
            }
            return rowHeight == -1 ? 32 : rowHeight;
        };
        HeatMapGrid.prototype.getCurrentIndex = function () {
            return ((this._currentPage() - 1) * (this.model.pageSettings.pageSize));
        };
        HeatMapGrid.prototype.getColumnByIndex = function (index) {
            if (index < this.model.columns.length)
                return this.model.columns[index];
            return null;
        };
        HeatMapGrid.prototype.set_currentPageIndex = function (val) {
            var pageSetting = this.model.pageSettings;
            var recordCount = this.model.filterSettings.filteredColumns.length == 0 ? this._searchCount == null ? this._gridRecordsCount : this._searchCount : this._filteredRecordsCount;
            if (pageSetting.totalPages == null)
                pageSetting.totalPages = Math.ceil(recordCount / pageSetting.pageSize);
            if (val > pageSetting.totalPages || val < 1 || val == this._currentPage())
                return false;
            if (ej.isNullOrUndefined(this._prevPageNo))
                this._prevPageNo = this._currentPage();
            this._currentPage(val);
            if (this._currentPage() != this._prevPageNo) {
                var args = {};
                args.requestType = "paging";
                this.gotoPage(this._currentPage(), args);
                return true;
            }
            else
                return false;
        };
        HeatMapGrid.prototype.set_currentVirtualIndex = function (currentViewIndex) {
            if (currentViewIndex < 1 || (currentViewIndex != 1 && currentViewIndex != this._totalVirtualViews && currentViewIndex == this._currentVirtualIndex && this._checkCurrentVirtualView(this._virtualLoadedRows, currentViewIndex)))
                return false;
            this._prevVirtualIndex = this._currentVirtualIndex;
            this._currentVirtualIndex = currentViewIndex;
            var currentPage = this._calculateCurrentViewPage();
            if (currentPage <= this.model.pageSettings.totalPages && !this._checkCurrentVirtualView(this._virtualLoadedRecords, this._currentVirtualIndex)) {
                if (this._prevVirtualIndex < currentViewIndex && currentViewIndex != 1) {
                    var setPage = this._isThumbScroll && currentPage != 1 ? currentPage : currentPage + 1;
                    if (!this._virtualPageRecords[setPage] && setPage <= this.model.pageSettings.totalPages)
                        this._setCurrentViewPage(setPage);
                    else
                        this._renderVirtulViewContent(currentPage);
                }
                else if (this._prevVirtualIndex > currentViewIndex) {
                    var setPage = this._isThumbScroll ? currentPage : currentPage - 1;
                    if (this._virtualPageRecords[setPage] && !this._virtualLoadedRecords[currentViewIndex - 1])
                        setPage = currentPage - 1;
                    if (!this._virtualPageRecords[setPage] && setPage >= 1)
                        this._setCurrentViewPage(setPage);
                }
                else
                    this._renderVirtulViewContent(currentPage);
            }
            else
                this._renderVirtulViewContent(currentPage);
            return true;
        };
        HeatMapGrid.prototype._setCurrentViewPage = function (currentPage) {
            this._needPaging = true;
            this._prevPageNo = this._currentPage();
            this.gotoPage(currentPage);
        };
        HeatMapGrid.prototype._renderVirtulViewContent = function (currentPage) {
            this._needPaging = false;
            this._refreshVirtualView(this._currentVirtualIndex);
        };
        HeatMapGrid.prototype._checkCurrentVirtualView = function (virtualContent, viewIndex) {
            var virtualRowCount = this._virtualRowCount;
            var prevView = viewIndex - 1, nextView = viewIndex + 1;
            if (virtualContent instanceof Array) {
                if (virtualContent.length) {
                    if (((prevView == 0 || nextView == this._totalVirtualViews + 1) && $.inArray(viewIndex, virtualContent) != -1) || ($.inArray(prevView, virtualContent) != -1 &&
					$.inArray(viewIndex, virtualContent) != -1 && $.inArray(nextView, virtualContent) != -1))
                        return true;
                }
            }
            else {
                var nextViewData = nextView == this._totalVirtualViews ? this._lastViewData : virtualRowCount;
                if ((!this.initialRender && (viewIndex == 1 && this._virtualLoadedRows[viewIndex]) || viewIndex == this._totalVirtualViews && virtualContent == this._virtualLoadedRows && virtualContent[viewIndex]) ||
					((prevView == 0 && virtualContent[viewIndex] && virtualContent[viewIndex].length == virtualRowCount) || (nextView == this._totalVirtualViews + 1 && virtualContent[viewIndex] && virtualContent[viewIndex].length == this._lastViewData)) ||
					(virtualContent[prevView] && virtualContent[prevView].length == virtualRowCount && virtualContent[viewIndex] && virtualContent[viewIndex].length == virtualRowCount && virtualContent[nextView] && virtualContent[nextView].length == nextViewData))
                    return true;
            }
            return false;
        };
        HeatMapGrid.prototype._refreshStackedHeader = function () {
            if (this.model.showStackedHeader) {
                var stackedRows = this.model.stackedHeaderRows;
                for (var i = 0; i < stackedRows.length; i++) {
                    if (this.model.scrollSettings.frozenColumns != 0) {
                        var frznHeader = $(this.getHeaderContent().find(".e-frozenheaderdiv"));
                        var movHeader = $(this.getHeaderContent().find(".e-movableheader"));
                        var newFrzn = this._createStackedRow(stackedRows[i], true);
                        var newMov = this._createStackedRow(stackedRows[i], false);
                        $(frznHeader.find("tr.e-stackedHeaderRow")[i]).replaceWith(newFrzn);
                        $(movHeader.find("tr.e-stackedHeaderRow")[i]).replaceWith(newMov);
                    }
                    else {
                        var stackedTR = this._createStackedRow(stackedRows[i], false);
                        if (this.getHeaderTable().find("tr.e-stackedHeaderRow")[i])
                            $(this.getHeaderTable().find("tr.e-stackedHeaderRow")[i]).replaceWith(stackedTR);
                        else
                            stackedTR.insertBefore(this.getHeaderTable().find("tr.e-columnheader:last"));
                    }
                }
                var args = {};
                args.requestType = "refresh";
                if (this.model.allowGrouping && this.model.groupSettings.groupedColumns.length > 0) {
                    for (var i = 0; i < this.model.groupSettings.groupedColumns.length; i++)
                        this.getHeaderTable().find(".e-stackedHeaderRow").prepend(this._getGroupTopLeftCell());
                }
                this.model.allowScrolling && this._refreshScroller(args);
            }

        };
        HeatMapGrid.prototype._getStackedColumnByTarget = function (target) {
            var cls = (target.get(0) || {}).className, match = /e-row([0-9])-column([0-9])/.exec(cls),
                rIndx = match[1], cIndx = match[2], key = [rIndx, "stackedHeaderColumns", cIndx].join(".");

            return ej.getObject(key, this.model.stackedHeaderRows);
        };
        HeatMapGrid.prototype._checkSkipAction = function (args) {
            switch (args.requestType) {
                case ej.HeatMapGrid.Actions.Save:
                case ej.HeatMapGrid.Actions.Delete:
                    return true;
            }
            return false;
        };
        HeatMapGrid.prototype._processBindings = function (args) {
            this._requestType = args.requestType;
            this.model.query = this.commonQuery.clone();
            //if (!this._checkSkipAction(args))
            //    return true;
            if (this.model.editSettings.editMode == "batch" && args.requestType != "batchsave" && args.requestType != "cancel" && !this._confirmedValue && this._bulkChangesAcquired()) {
                this._requestArgs = args;
                return false;
            }
            if (!ej.isNullOrUndefined(this.model.dataSource) && args.requestType == "refresh" && this.model.scrollSettings.allowVirtualScrolling) {
                this._currentPage(1);
                this._scrollValue = 0;
                this._loadedJsonData = [];
                this._prevPage = this._currentPage();
            }
            this._ensureDataSource(args);
            if (this.model.scrollSettings.allowVirtualScrolling) {
                if (args.requestType == "virtualscroll") {
                    this._loadedJsonData.push({ pageIndex: this._prevPage, data: this._currentJsonData });
                    this._prevPage = this._currentPage();
                }
                else if (!this.model.scrollSettings.enableVirtualization)
                    this._virtualLoadedRecords[this._currentPage()] = this.model.currentViewData;
                if (args.requestType == "filtering") {
                    this._loadedJsonData = [];
                    this._prevPage = this._currentPage();
                }
            }
            if (this.model.scrollSettings.allowVirtualScrolling && args.requestType == "filtering" && this.model.filterSettings.filteredColumns.length > 0)
                this.getScrollObject().scrollY(0);
            if (this.model.enableRTL) {
                !this.element.hasClass("e-rtl") && this.element.addClass("e-rtl");
            } else {
                this.element.hasClass("e-rtl") && this.element.removeClass("e-rtl")
            }
            if (args.requestType == ej.HeatMapGrid.Actions.Delete && this.model.groupSettings.groupedColumns.length == 0) {
                if (this.model.editSettings.showAddNewRow)
                    this.getContentTable().find(".e-addedrow").remove();
                args.tr.remove();
            }
            this._editForm = this.model.scrollSettings.frozenColumns > 0 || this.model.editSettings.showAddNewRow ? this.element.find(".gridform") : $("#" + this._id + "EditForm");
            if (!(this.model.editSettings.showAddNewRow && args.requestType == "beginedit") && this._editForm.length != 0) {
                if (this._editForm.length > 1 && (args.requestType == "save" && args.action == "edit" || args.requestType == "cancel"))
                    this._editForm = this.model.editSettings.rowPosition == "top" ? this._editForm[1] : this._editForm[0];
            }
            if (this._dataSource() instanceof ej.DataManager && !this._isRemoteSaveAdaptor && args.requestType != ej.HeatMapGrid.Actions.BeginEdit && args.requestType != ej.HeatMapGrid.Actions.Cancel && args.requestType != ej.HeatMapGrid.Actions.Add) {
                if (this.model.scrollSettings.allowVirtualScrolling && !this.model.scrollSettings.enableVirtualization && this.model.pageSettings.totalPages == this.model.pageSettings.currentPage) {
                    var pageQuery = ej.pvt.filterQueries(this.model.query.queries, "onPage");
                    this.model.query.queries.splice($.inArray(pageQuery[0], this.model.query.queries), 1);
                    this.model.query.page(this._currentPage() - 1, this.model.pageSettings.pageSize);
                    var lastQueryPromise = this._dataSource().executeQuery(this.model.query);
                    this.model.query.queries.splice($.inArray(pageQuery[0], this.model.query.queries), 1);
                    this.model.query.page(this._currentPage(), this.model.pageSettings.pageSize);
                }
                if (this._virtualSelectedRows && this._virtualSelectedRows.length > 0) {
                    this.model.query.addParams('virtualSelectRecords', this._virtualSelectedRows)
                }
                var queryPromise = this._queryPromise = this._dataSource().executeQuery(this.model.query);
                if (proxy._dataSource().ready) {
                    proxy._dataSource().ready.done(function () {
                        proxy._processDataRequest(proxy, args, queryPromise, lastQueryPromise)
                    });
                }
                else {
                    proxy._processDataRequest(proxy, args, queryPromise, lastQueryPromise)
                }
            } else {
                if (this._isRelationalRendering(args))
                    this._setForeignKeyData(args);
                else
                    this.sendDataRenderingRequest(args);
            }
        };
        HeatMapGrid.prototype._processDataRequest = function (proxy, args, queryPromise, lastQueryPromise) {
            queryPromise.done(ej.proxy(function (e) {
                proxy._relationalColumns.length == 0;
                if (lastQueryPromise && !proxy._previousPageRendered) {
                    if (proxy.model.previousViewData && proxy.model.previousViewData.length != 0) {
                        proxy.model.previousViewData.splice(0, e.result.length);
                        proxy._previousPageLength = e.result.length;
                        proxy._currentPageData = e.result;
                        ej.merge(proxy.model.previousViewData, e.result);
                        proxy.model.currentViewData = proxy.model.previousViewData;
                        proxy._remoteLastPageRendered = true;
                    }
                }
                else if (proxy._remoteLastPageRendered && proxy.model.pageSettings.currentPage == proxy.model.pageSettings.totalPages - 1 && !proxy.model.scrollSettings.enableVirtualization) {
                    var count = proxy.model.pageSettings.pageSize - proxy._previousPageLength;
                    for (var dupRow = 0; dupRow < count; dupRow++) {
                        var removeEle = proxy.getRows()[proxy.getRows().length - (proxy.model.pageSettings.pageSize - dupRow)];
                        removeEle.remove();
                    }
                    proxy._tempPageRendered = true;
                    proxy.model.currentViewData = e.result;
                }
                else {
                    if (proxy.model.pageSettings.currentPage == proxy.model.pageSettings.totalPages - 1 && !proxy._remoteLastPageRendered)
                        proxy._previousPageRendered = true;
                    proxy.model.currentViewData = e.result == null ? [] : e.result;
                    if (proxy._$fkColumn && proxy.model.filterSettings.filterType == "excel" && proxy.model.filterSettings.filteredColumns.length > 0)
                        proxy._fkParentTblData = e.result;
                }
                if (proxy.model.allowScrolling && proxy.model.scrollSettings.allowVirtualScrolling && proxy.model.scrollSettings.enableVirtualization) {
                    if (args.requestType == "filtering") {
                        proxy._gridRecordsCount = proxy._filteredRecordsCount = e.count;
                        proxy._refreshVirtualViewDetails();
                    }
                    if (e.result.length) {
                        if (proxy._isInitNextPage || proxy._isLastVirtualpage) {
                            proxy._setInitialCurrentIndexRecords(e.result, proxy._currentPage());
                            proxy._isInitNextPage = proxy._isLastVirtualpage = false;
                        }
                        else
                            proxy._setVirtualLoadedRecords(e.result, proxy._currentPage());
                        if (proxy._isThumbScroll && !proxy._checkCurrentVirtualView(proxy._virtualLoadedRecords, proxy._currentVirtualIndex))
                            proxy._checkPrevNextViews();
                        proxy._remoteRefresh = true;
                    }
                    else
                        proxy.getContent().find(".e-virtualtop, .e-virtualbottom").remove();
                }
                if (!ej.isNullOrUndefined(e.aggregates))
                    proxy._remoteSummaryData = e.aggregates;
                if (!ej.isNullOrUndefined(proxy._unboundRow) && args.selectedRow != proxy._unboundRow && args.requestType == "save") {
                    proxy._unboundRow.find(".e-editbutton").trigger("click");
                    proxy._unboundRow = null;
                }
            }));
            queryPromise.fail(ej.proxy(function (e) {
                args.error = e.error;
                e = [];
                proxy.model.currentViewData = [];
                proxy._trigger("actionFailure", args);
            }));
        };
        HeatMapGrid.prototype._createUnboundElement = function (column) {
            var divElement = document.createElement("div");
            column.headerText = ej.isNullOrUndefined(column.headerText) ? column.field : column.headerText;
            if (!ej.isNullOrUndefined(column.headerText))
                divElement.id = this._id + column.headerText.replace(/[^a-z0-9|s_]/gi, '') + "_UnboundTemplate";
            var $div = ej.buildTag("div.e-unboundcelldiv"), commands = column["commands"];
            for (var unbounType = 0; unbounType < commands.length; unbounType++) {
                var $button = ej.buildTag("button.e-" + commands[unbounType].type.replace(/\s+/g, "") + "button", "", {}, { type: "button" });
                $button.val(commands[unbounType].type);
                $div.append($button);
            }
            $("body").append($(divElement).html($div).hide());
            return divElement;
        };
        HeatMapGrid.prototype._gridTemplate = function (self, templateId, index) {
            var $column = self.model.columns[index];
            if (self._isGrouping)
                this.index = self._currentJsonData.indexOf(this.data);
            return self._renderEjTemplate("#" + templateId, this.data, this.index, $column);
        };
        HeatMapGrid.prototype._renderEjTemplate = function (selector, data, index, prop) {
            var type = null;
            if (typeof selector === "object" || selector.startsWith("#") || selector.startsWith("."))
                type = $(selector).attr("type");
            if (type) {
                type = type.toLowerCase();
                if (ej.template[type])
                    return ej.template[type](this, selector, data, index, prop);
            }
            return ej.template.render(this, selector, data, index, prop);
        };
        HeatMapGrid.prototype._createTemplateElement = function (column, appendTo /* container to append */, text) {
            var tmpl = column["templateID" in column ? "templateID" : "template"], quickReg = /^#([\w-]*)/,
                match = quickReg.exec(tmpl), scriptReg = /^<script/i, appendTo = appendTo || $("body"), scripEle,
                idText = text ? "Pager" : (column.headerText + $.inArray(column, this.model.columns) + "_") + "Template";

            var options = {
                name: "SCRIPT",
                type: "text/x-template",
                text: tmpl,
                id: (this._id + idText).replace(/[^0-9A-z-_]/g, "")
            };

            if (match && match[1])
                scripEle = document.getElementById(match[1]);
            else {
                if (scriptReg.test(tmpl)) // branch here to handle tmpl string with SCRIPT. 
                    scripEle = $(tmpl).get(0);
                else
                    scripEle = ej.buildTag(options.name, options.text).get(0);
            }

            scripEle.id = scripEle.id || options.id; // Update Id and type if not in scriptElement template string.
            scripEle.type = scripEle.type || options.type;

            appendTo.append(text ? scripEle.innerHTML : scripEle); //if `text` then append innerHTML instead of element.

            return scripEle;
        };
        HeatMapGrid.prototype._page = function (send) {
            if (send.events.text == this.localizedLabels.NextPage) {
                var b = this.model.pageSettings.currentPage;
                ++b;
                this.gotoPage(b);
            }
            else if (send.events.text == this.localizedLabels.PreviousPage) {
                var b = this.model.pageSettings.currentPage;
                if (b > 1) {
                    --b;
                    this.gotoPage(b);
                }
                else
                    this.gotoPage(b);
            }
            else if (send.events.text == this.localizedLabels.LastPage) {
                var b = this.model.pageSettings.totalPages
                this.gotoPage(b);
            }
            else
                this.gotoPage(1);


        };
        HeatMapGrid.prototype.gotoPage = function (pageIndex) {
            if (!this.model.allowPaging && (!this.model.allowScrolling && !this.model.scrollSettings.allowVirtualScrolling))
                return;
            var args = {}, returnValue;
            args.previousPage = this._currentPage();
            this._currentPage(pageIndex);
            args.endIndex = ((this._currentPage() * this.model.pageSettings.pageSize) > this._gridRecordsCount) ? (this._gridRecordsCount) : (this._currentPage() * this.model.pageSettings.pageSize);
            args.startIndex = (this._currentPage() * this.model.pageSettings.pageSize) - this.model.pageSettings.pageSize;
            args.currentPage = pageIndex;
            if (this.model.allowPaging) {
                args.requestType = ej.HeatMapGrid.Actions.Paging;
            }
            if (this.model.scrollSettings.allowVirtualScrolling && this.model.allowScrolling) {
                this._isVirtualRecordsLoaded = false;
                var model = this._refreshVirtualPagerInfo();
                this._showPagerInformation(model);
                args.requestType = ej.HeatMapGrid.Actions.VirtualScroll;
            }
            returnValue = this._processBindings(args);
            if (returnValue)
                this._currentPage(args.previousPage);
            this._primaryKeyValues = [];
        };
        HeatMapGrid.prototype._checkScrollActions = function (requestType) {
            if ((!this.model.scrollSettings.allowVirtualScrolling && (requestType == ej.HeatMapGrid.Actions.Sorting || requestType == ej.HeatMapGrid.Actions.Reorder)) || requestType == ej.HeatMapGrid.Actions.Grouping || requestType == ej.HeatMapGrid.Actions.Ungrouping || requestType == ej.HeatMapGrid.Actions.Add || requestType == ej.HeatMapGrid.Actions.Cancel
                || requestType == ej.HeatMapGrid.Actions.Save || requestType == ej.HeatMapGrid.Actions.BatchSave || requestType == ej.HeatMapGrid.Actions.Delete || requestType == ej.HeatMapGrid.Actions.Filtering || requestType == ej.HeatMapGrid.Actions.Paging || requestType == ej.HeatMapGrid.Actions.Refresh || requestType == ej.HeatMapGrid.Actions.Search)
                return true;
            return false;
        },
        HeatMapGrid.prototype._frozenAlign = function () {
            var gridContent = this.getContent().first(), browserDetails = this.getBrowserDetails(), direction;
            direction = this.model.enableRTL ? "margin-right" : "margin-left";
            gridContent.find(".e-movablecontent").css(direction, browserDetails.browser === "safari" ? "auto" : gridContent.find(".e-frozencontentdiv").width() + "px");
            this.getHeaderContent().find(".e-movableheader").removeAttr("style").css(direction, browserDetails.browser === "safari" ? "auto" : this.getHeaderContent().find(".e-frozenheaderdiv").width() + "px");
        },
        HeatMapGrid.prototype._refreshScroller = function (args) {
            var gridContent = this.getContent().first(), temp;
            if (ej.isNullOrUndefined(gridContent.data("ejScroller")))
                return;
            if (this.model.scrollSettings.frozenColumns > 0) {
                this._frozenAlign();
                this.refreshScrollerEvent();
                gridContent.find(".e-movablecontent").scrollLeft(this.getHeaderContent().find(".e-movableheader").scrollLeft());
                if (!ej.isNullOrUndefined(this.getScrollObject()._vScrollbar) && this.getScrollObject()._vScrollbar.value() > this.getScrollObject()._vScrollbar.model.maximum)
                    temp = this.getScrollObject()._vScrollbar.model.maximum;
            }
            if (this.model.scrollSettings.frozenRows > 0) {
                this._initFrozenRows();
                var temp = this.getScrollObject().model.scrollTop;
                if (!ej.isNullOrUndefined(this.getScrollObject()._vScrollbar) && temp > this.getScrollObject()._vScrollbar.model.maximum)
                    temp = this.getScrollObject()._vScrollbar.model.maximum;
                if ((args.requestType == "cancel" || args.requestType == "save") && temp > this._editFormHeight && this.model.editSettings.editMode.indexOf("inlineform") != -1)
                    temp = temp - this._editFormHeight;
                if (args.requestType == ej.Grid.Actions.Add)
                    this.getScrollObject().scrollY(0, true);
                if (!ej.isNullOrUndefined(this.getScrollObject()._vScrollbar) && !ej.isNullOrUndefined(this.getScrollObject()._vScrollbar._scrollData))
                    this.getScrollObject()._vScrollbar._scrollData.skipChange = true;
            }
            if (args.requestType == "beginedit") {
                var temp = this.getScrollObject().model.scrollTop;
                this.getScrollObject().scrollY(0, true);
            }
            if (!ej.isNullOrUndefined(this.model.dataSource) && (args.requestType == "refresh" || args.requestType == "searching") && this.model.scrollSettings.allowVirtualScrolling) {
                if (this.model.scrollSettings.enableVirtualization && this._isLocalData && this._gridRecordsCount > 0)
                    this._refreshVirtualView(this._currentVirtualIndex);
                else
                    this._refreshVirtualContent(1);
                if (this._currentVirtualIndex == 1)
                    this.getScrollObject().scrollY(0);
            }
            if (this.model.scrollSettings.frozenColumns > 0 && args.requestType != "filtering")
                this.rowHeightRefresh();
            else
                this.getScrollObject().refresh();
            gridContent.ejScroller("model.enableRTL", this.model.enableRTL);
            if (this.model.isResponsive && (args.requestType == 'searching' || args.requestType == "filtering")) {
                var scrollObj = this.getScrollObject();
                var height = scrollObj.isHScroll() ? this.getContentTable().height() + scrollObj.model.buttonSize : this.getContentTable().height();
                if (height > this.model.scrollSettings.height)
                    height = this.model.scrollSettings.height;
                var scrollWidth = typeof (this.model.scrollSettings.width) == "string" ? this.element.width() - scrollObj.model.buttonSize : this.model.scrollSettings.width;
                var width = scrollWidth;
                this.getContent().ejScroller({ height: height, width: width });
            }
            if (gridContent.ejScroller("isVScroll") && !this.getScrollObject().model.autoHide) {
                this.getHeaderContent().addClass("e-scrollcss");
                !this.getHeaderContent().find(".e-headercontent").hasClass("e-hscrollcss") && this.getHeaderContent().find(".e-headercontent").addClass("e-hscrollcss");
            }
            else
                this._showHideScroller();
            this._getRowHeights();
            if (temp && !ej.isNullOrUndefined(this.getScrollObject()._vScrollbar) && args.requestType != ej.Grid.Actions.Add) {
                this._currentTopFrozenRow = 0;
                if (temp > this.getScrollObject()._vScrollbar.model.maximum)
                    temp = this.getScrollObject()._vScrollbar.model.maximum;
                this.getScrollObject()._vScrollbar.scroll(temp);
            }
            if (args.requestType == "virtualscroll") {
                var top = this.getScrollObject().model.scrollTop + this.getScrollObject().model.height - (this.getScrollObject().model.height * .3);
                this.getScrollObject().scrollY(top, true);
            }
        },
        HeatMapGrid.prototype._isFrozenColumnVisible = function () {
            for (var i = 0; i < this.model.scrollSettings.frozenColumns; i++) {
                if (this.model.columns[i].visible)
                    return true;
            }
            return false;
        },
        HeatMapGrid.prototype._frozenPaneRefresh = function () {
            this.getContent().find(".e-frozencontentdiv").css("display", "none");
            this.getHeaderContent().find(".e-frozenheaderdiv").css("display", "none");
            this.getHeaderContent().find(".e-movableheader")[0].style["margin-left"] = "";
            this.getContent().find(".e-movablecontent")[0].style["margin-left"] = "";
            var scrollWidth = ej.isNullOrUndefined(this._scrollObject._vScrollbar) ? 0 : this._scrollObject._vScrollbar["e-vscroll"].width();
            var movableWidth = this.model.scrollSettings.width - scrollWidth - 1;
            if (this.model.scrollSettings.width > this.getContent().find(".e-movablecontentdiv").width()) {
                this.getContent().find(".e-movablecontentdiv").width(movableWidth);
                this.getHeaderContent().find(".e-movableheaderdiv").width(movableWidth);
            }
            this._scrollObject.option("scrollLeft", 0);
        },
        HeatMapGrid.prototype._renderScroller = function () {

            if (!this.model.scrollSettings)
                this.model.scrollSettings = {};
            if (this.model.enablePersistence && (ej.isNullOrUndefined(this.model.scrollSettings.previousStateWidth) || !this.model.scrollSettings.previousStateWidth) && this.model.isResponsive)
                this.model.scrollSettings.previousStateWidth = this.model.scrollSettings.width;
            if (typeof (this._originalScrollWidth) == "string" && !this.model.isResponsive) {
                this.element.css("width", "auto");
                var width = this.element.width();
                if (this.model.scrollSettings.width == "auto" || this._originalScrollWidth == "auto")
                    this._originalScrollWidth = "100%";
                this.model.scrollSettings.width = width * (parseFloat(this._originalScrollWidth) / 100)
            }

            if (typeof (this.model.scrollSettings.height) == "string" && !this.model.isResponsive) {
                var height = this.element.height();
                if (this.model.scrollSettings.height == "auto")
                    this.model.scrollSettings.height = "100%";
                this.model.scrollSettings.height = height * (parseFloat(this.model.scrollSettings.height) / 100)
            }

            if ((this.model.scrollSettings.width || this.model.width) && !this._mediaQuery)
                this.element.width(this.model.scrollSettings.width || this.model.width);

            var $content = this.getContent().attr("tabindex", "0"), staticWidth, direction, gridRows = this.getRows();

            if (this.model.scrollSettings.frozenColumns > 0) {
                var scrollWidth = this.getContent().find(".e-frozencontentdiv").width() + 20;
                if (scrollWidth > this.model.scrollSettings.width) {
                    this.getContent().remove();
                    this.getHeaderTable().eq(1).remove();
                    return;
                }
                staticWidth = this.getContent().find(".e-frozencontentdiv").width();
                direction = this.model.enableRTL ? "margin-right" : "margin-left";
                this.getContent().find(".e-movablecontent").css(direction, staticWidth + "px");
                this.getHeaderContent().find(".e-movableheader").css(direction, staticWidth + "px");
                this.model.scrollSettings["targetPane"] = ".e-movablecontent";
            }
            this._initFrozenRows();
            if (this.model.scrollSettings.autoHide)
                this.model.scrollSettings["show"] = $.proxy(this._showHideScroller, this);
            var proxy = this;
            if (!this.model.scrollSettings.frozenRows)
                this.model.scrollSettings["scroll"] = function (e) {
                    if (!ej.isNullOrUndefined(e.scrollData) && e.scrollData.handler == "e-hhandle") {
                        if (proxy.model.allowFiltering && (proxy.model.filterSettings.filterType == "menu" || proxy._isExcelFilter))
                            !proxy._isExcelFilter ? proxy._closeFilterDlg() : proxy._excelFilter.closeXFDialog();
                        proxy._checkScroller(e, this);
                    }
                    else {
                        proxy._scrollValue = e.scrollTop;
                        proxy.model.currentIndex = e.scrollTop == 0 ? e.scrollTop : Math.floor(e.scrollTop / proxy._vRowHeight);
                    }
                };
            if (!this.model.scrollSettings.allowVirtualScrolling && this.model.currentIndex > 0 && !this.model.scrollSettings.scrollTop) {
                var sTop = this.model.currentIndex * this.getRowHeight();
                this.model.scrollSettings["scrollTop"] = sTop;
            }
            if (this.model.scrollSettings && !this.model.scrollSettings.height)
                this.model.scrollSettings.height = 0;
            $content.ejScroller(this.model.scrollSettings);
            if (this.model.rowTemplate != null && (this.getBrowserDetails().browser == "msie" || this.getBrowserDetails().browser == "safari"))
                this.getScrollObject().refresh();
            if (this.model.scrollSettings.frozenColumns > 0 && this.model.scrollSettings.frozenRows == 0 && this.getScrollObject()._vScrollbar && this.getScrollObject()._hScrollbar)
                this.getScrollObject()._vScrollbar._scrollData.skipChange = this.getScrollObject()._hScrollbar._scrollData.skipChange = true;
            if (!this.model.scrollSettings.autoHide)
                this._showHideScroller();
            if (this.getBrowserDetails().browser == "safari" && this.model.scrollSettings.frozenColumns > 0)
                this.getHeaderContent().find(".e-movableheader").add(this.getContent().find(".e-movablecontent")).css(direction, "auto");
            this.refreshScrollerEvent();
            if (this.model.scrollSettings.frozenColumns > 0 && !this._isFrozenColumnVisible())
                this._frozenPaneRefresh();
            if (proxy.model.scrollSettings.allowVirtualScrolling) {
                var model = this._refreshVirtualPagerInfo();
                this._showPagerInformation(model);
                $content.ejScroller({
                    scroll: function (e) {
                        if (proxy.model.scrollSettings.enableVirtualization && e.scrollData != null && e.scrollData.handler != "e-hhandle") {
                            e["reachedEnd"] = e.scrollData.scrollable - e.scrollTop == 0;
                            if (e.source == "thumb") {
                                var keys = Object.keys(proxy._virtualLoadedRows);
                                var index = (proxy._currentVirtualIndex + 2).toString();
                                if (proxy.model.scrollSettings.virtualScrollMode == "continuous" && $.inArray(index, keys) == -1 && index < proxy._totalVirtualViews)
                                    proxy._isContinuous = true;
                                else {
                                    e.model.scrollTop = e.scrollTop;
                                    proxy._isContinuous = false;
                                    e.cancel = true;
                                }
                            }
                            if (e.source == "button" || e.source == "key" || e.source == "wheel") {
                                proxy._isThumbScroll = false;
                                proxy._virtualViewScroll(e);
                                if (proxy.model.scrollSettings.virtualScrollMode == "continuous" && e["reachedEnd"])
                                    this.refresh();
                            }
                            proxy.model.currentIndex = e.scrollTop == 0 ? e.scrollTop : Math.floor(e.scrollTop / proxy._vRowHeight);
                        }
                        else {
                            if (!ej.isNullOrUndefined(e.scrollData) && e.scrollData.handler == "e-hhandle" && proxy.model.allowFiltering && (proxy.model.filterSettings.filterType == "menu" || proxy._isExcelFilter))
                                !proxy._isExcelFilter ? proxy._closeFilterDlg() : proxy._excelFilter.closeXFDialog();
                            e["reachedEnd"] = this.content()[0].scrollHeight - e.scrollTop == this.content()[0].clientHeight;
                            if ((e.source == "button" || e.source == "key" || e.source == "wheel") && proxy.model != null)
                                proxy._virtualScroll(e);
                            if (e.source == "wheel" && e.scrollTop != proxy._scrollValue)
                                e.scrollTop = proxy._scrollValue;
                            proxy._checkScroller(e, this);
                        }
                    },
                    thumbEnd: function (e) {
                        if (proxy.model.scrollSettings.enableVirtualization && proxy.model.scrollSettings.virtualScrollMode == "continuous")
                            e["reachedEnd"] = e.scrollData.scrollable - e.model.scrollTop == 0;
                        else if (e.originalEvent && !$(e.originalEvent.target).hasClass("e-rowcell"))
                            e["reachedEnd"] = this.content()[0].scrollHeight - e.scrollData.sTop == this.content()[0].clientHeight;
                        if (e.scrollData.handler == "e-hhandle")
                            return;
                        if (proxy.model != null && e.originalEvent) {
                            if (proxy.model.scrollSettings.enableVirtualization) {
                                proxy._isThumbScroll = true;
                                proxy._virtualViewScroll(e);
                                if (proxy.model.scrollSettings.virtualScrollMode == "continuous" && e["reachedEnd"])
                                    this.refresh();
                            }
                            else
                                proxy._virtualScroll(e);
                        }
                    },
                    scrollEnd: function (e) {
                        if (e.scrollData.type == "mousewheel" || (e.scrollData.model != null && e.scrollData.model.orientation == "horizontal")) return;
                        if (proxy.model.scrollSettings.enableVirtualization && !proxy._isContinuous) {
                            var currentPage = proxy._calculateCurrentViewPage(e.model);
                            var isVirtualPage = $.inArray(currentPage, proxy._virtualLoadedPages) != -1;
                            if (isVirtualPage) {
                                proxy._isThumbScroll = true;
                                proxy._virtualViewScroll(e);
                                if (proxy._totalVirtualViews <= proxy._maxViews * 3)
                                    this._content[0].scrollTop = e.scrollData.scrollTop;
                            }
                            else {
                                e.cancel = true;
                            }
                        }
                    }
                });
            }
        },
        HeatMapGrid.prototype._checkScroller = function (e, scrollObj) {
            var scrollLeft = e.scrollLeft > 0 ? e.scrollLeft : Math.abs(e.scrollLeft);
            if (e.source == "thumb" && (scrollObj.content()[0].scrollWidth - scrollLeft == scrollObj.content()[0].clientWidth || scrollLeft == 0)) {
                if (this.model.enableRTL) {
                    var hLeft = scrollLeft == 0 ? e.scrollData.scrollable : 0;
                    e.scrollData.sTop = e.model.scrollLeft = hLeft;
                    scrollObj.content().scrollLeft(hLeft);
                }
                scrollObj.refresh();
            }
        },
        HeatMapGrid.prototype._showHideScroller = function () {
            if (this.getContent().ejScroller("isVScroll")) {
                this.getHeaderContent().find("div").first().addClass("e-headercontent");
                !this.model.scrollSettings.autoHide && this.getHeaderContent().addClass("e-scrollcss")
            } else
                this.element.find(".e-gridheader").removeClass("e-scrollcss");
            if (this.getBrowserDetails().browser != "msie" && this.model.scrollSettings.frozenColumns == 0 && !this._mediaQuery) {
                if (!this.element.find(".e-gridheader").hasClass("e-scrollcss") && (this.model.filterSettings.filteredColumns.length || this._hiddenColumns.length)) {
                    this.getHeaderTable().removeAttr('style');
                    this.getContentTable().removeAttr('style');
                }
                else {
                    this.getHeaderContent().find("div table").first().width(this.getContentTable().width());
                    this.getContent().find("div table").first().width(this.getContentTable().width());
                    this.getHeaderTable().width(this.getContentTable().width());
                }
            }
            if (this.getBrowserDetails().browser == "msie" && this.model.scrollSettings.frozenColumns == 0)
                !this.getContent().ejScroller("isVScroll") ? this.getContent().width(this.getHeaderContent().width()) : this.getContent().width(this.getHeaderContent().width() + 18);
            this._isHscrollcss();
        };
        HeatMapGrid.prototype._isHscrollcss = function () {
            var scroller = this.getContent().data("ejScroller"), css = scroller && (scroller.isHScroll() || scroller.isVScroll()) ? "addClass" : "removeClass";
            this.getHeaderContent().find(".e-headercontent")[css]("e-hscrollcss")
        };
        HeatMapGrid.prototype._initFrozenRows = function () {
            var gridRows = this.getRows();
            if (!this.model.currentViewData || this.model.currentViewData.length == 0)
                return;
            if (this.model.scrollSettings.frozenRows > 0 && gridRows != null) {
                this.model.scrollSettings["scroll"] = $.proxy(this._scroll, this);
                this.getContent().find(".e-frozeny").removeClass("e-frozeny")
                    .end().find(".e-frozenrow").removeClass("e-frozenrow");
                if (!ej.isNullOrUndefined(gridRows[0][this.model.scrollSettings.frozenRows - 1]) && !ej.isNullOrUndefined(gridRows[1][this.model.scrollSettings.frozenRows - 1]) && this.model.scrollSettings.frozenColumns > 0)
                    $(gridRows[0][this.model.scrollSettings.frozenRows - 1].cells).add(gridRows[1][this.model.scrollSettings.frozenRows - 1].cells).addClass("e-frozeny").parent().addClass("e-frozenrow");
                else if (!ej.isNullOrUndefined(this.getRowByIndex(this.model.scrollSettings.frozenRows - 1)[0]))
                    $(gridRows[this.model.scrollSettings.frozenRows - 1].cells).addClass("e-frozeny").parent().addClass("e-frozenrow");
                this.model.scrollSettings.height = this._rowHeightCollection[Math.floor(this.model.scrollSettings.height / this._rowHeightCollection[1])] + 18;
            }
            else
                delete this.model.scrollSettings["scroll"];
        };
        HeatMapGrid.prototype.refreshScrollerEvent = function () {
            var proxy = this;
            this.getContent().find(".e-content:first,.e-movablecontent").scroll(ej.proxy(function (e) {
                if (this.model.scrollSettings.targetPane)
                    this.getHeaderContent().find(".e-movableheader").scrollLeft($(e.currentTarget).scrollLeft());
                else
                    this.getHeaderContent().find("div").first().scrollLeft($(e.currentTarget).scrollLeft());
                if (this.model.scrollSettings.frozenRows > 0 && this.model.editSettings.editMode.indexOf("inlineform") != -1 && this.model.isEdit) {
                    var scrollTop = e.target.scrollTop;
                    this.getContent().find(".e-content").scrollTop(0);
                    this.getScrollObject().scrollY(this.getScrollObject().model.scrollTop + scrollTop, true);
                }
            }, this));
            this.element.find(".e-gridheader").find(".e-headercontent,.e-movableheader").scroll(ej.proxy(function (e) {
                var $currentTarget = $(e.currentTarget);
                if (this.model.scrollSettings.targetPane) {
                    this.getContent().find(".e-movablecontent").scrollLeft($currentTarget.scrollLeft());
                    this.model.showSummary && this.getFooterContent().find(".e-movablefooter").scrollLeft($currentTarget.scrollLeft());;
                }
                else {
                    this.model.showSummary && this.getFooterContent().scrollLeft($currentTarget.scrollLeft());
                    this.getContent().find(".e-content").first().scrollLeft($currentTarget.scrollLeft());
                }
            }, this));
        };
        HeatMapGrid.prototype._renderByFrozenDesign = function () {
            var $div = $(document.createElement('div')), col = this._getMetaColGroup().find("col"), colgroups = {};
            colgroups["colgroup1"] = $div.append(ej.buildTag("colgroup").append(col.splice(0, this.model.scrollSettings.frozenColumns))).html();
            colgroups["colgroup2"] = $div.html(ej.buildTag("colgroup").append(col)).html();
            this.getContent().find("div").first().get(0).innerHTML = $.render[this._id + "_FrozenTemplate"]({ datas: this.model.currentViewData }, colgroups);
            this.setGridContentTable(this.getContent().find(".e-table").attr("data-role", "heatmap"));
        };
        HeatMapGrid.prototype.addFrozenTemplate = function () {
            var template = "<div class='e-frozencontentdiv'>"
            + "<table class='e-table'>{{:~colgroup1}}<tbody>"
            + "{{for datas tmpl='" + this._id + "_JSONFrozenTemplate'/}}"
            + "</tbody></table></div>"
            + "<div class='e-movablecontent'><div class='e-movablecontentdiv'><table class='e-table'>{{:~colgroup2}}<tbody>"
            + "{{for datas tmpl='" + this._id + "_JSONTemplate'/}}"
            + "</tbody></table></div></div>", templates = {};
            templates[this._id + "_FrozenTemplate"] = template;
            $.templates(templates);
        };
        HeatMapGrid.prototype._getTopRow = function (offsetTop) {
            var currentTopRow = this.model.scrollSettings.frozenRows, i = 0;
            if (offsetTop > 10) {
                for (var i = 0; i < this._rowHeightCollection.length; i++) {
                    if (this._rowHeightCollection[i] > offsetTop) {
                        currentTopRow = this.model.scrollSettings.frozenRows + i - 1;
                        break;
                    }
                }
            }
            return { imaginaryIndex: currentTopRow, actualIndex: i };
        };
        HeatMapGrid.prototype._showHideRow = function (from, to, action, scrollPosition) {
            var rows = this.getRows();
            if (this.model.scrollSettings.frozenColumns > 0)
                $(rows[0]).slice(from, to).add($(rows[1]).slice(from, to).toArray())[action]();
            else
                $(rows).slice(from, to)[action]();
            this._currentTopFrozenRow = action == "show" ? from : to;
            this.getScrollObject()._changevHandlerPosition(scrollPosition);
        };
        HeatMapGrid.prototype._scroll = function (args) {
            if (args.scrollData != null && args.scrollData.dimension != "width") {
                args.cancel = true;
                var rows = this.getRows(), indexes = this._getTopRow(args.scrollTop), currentTopRow = indexes.imaginaryIndex, frozenRows;
                if (currentTopRow > this._currentTopFrozenRow)
                    this._showHideRow(this.model.scrollSettings.frozenRows, currentTopRow, "hide", args.scrollTop);
                else if (currentTopRow < this._currentTopFrozenRow)
                    this._showHideRow(currentTopRow, this._currentTopFrozenRow + 1, "show", args.scrollTop);
                var movableContent = this.getContentTable().last().find("tr");
                var border = (parseInt(movableContent.last().find("td:first").css("border-top-width")) * 2) + 1;
                if (args.scrollTop == this.getScrollObject()._vScrollbar.model.maximum && ((movableContent.last()[0].offsetTop + movableContent.last().height() - border) > this.element.find(".e-content").height())) {
                    var totalHeight = movableContent.last().prev()[0].offsetTop + movableContent.last().prev().height();
                    var count = 1;
                    for (var i = (movableContent.length - 2) ; totalHeight - border > this.element.find(".e-content").height() ; i++) {
                        totalHeight = movableContent[i].offsetTop + movableContent.eq(i).height();
                        count++;
                        break;
                    }
                    this._showHideRow(this.model.scrollSettings.frozenRows, currentTopRow + count, "hide", args.scrollTop);
                }
                args.model.scrollTop = args.scrollTop;
            }
            else {
                if (!ej.isNullOrUndefined(this.getScrollObject()._vScrollbar) && !ej.isNullOrUndefined(this.getScrollObject()._vScrollbar._scrollData))
                    this.getScrollObject()._vScrollbar._scrollData.skipChange = true;
            }
        };
        HeatMapGrid.prototype._virtualScroll = function (e) {
            if (e != null) {
                var flag = 0;
                var recordCount = this.model.filterSettings.filteredColumns.length == 0 ? this._searchCount == null ? this._gridRecordsCount : this._searchCount : this._filteredRecordsCount;
                var pageInfo = this.model.pageSettings;
                var tbody = this.getContentTable()[0].tBodies[0];
                var virtualRows = $(tbody).find('tr.e-virtualrow');
                pageInfo.totalPages = Math.ceil(recordCount / pageInfo.pageSize);
                if (e.scrollTop !== undefined)
                    e.model.scrollTop = e.scrollTop;
                if (e.reachedEnd != undefined) e.model.reachedEnd = e.reachedEnd;
                var currentPageNo = this._calculateCurrenPage(virtualRows, this.getContentTable(), e.model);
                if (currentPageNo > pageInfo.totalPages)
                    currentPageNo = pageInfo.totalPages;
                if (pageInfo.currentPage != currentPageNo && $.inArray((currentPageNo - 1) * pageInfo.pageSize, this.virtualLoadedPages) == -1) {
                    this._isVirtualRecordsLoaded = false;
                }
                if (!this._isVirtualRecordsLoaded) {
                    if ($.inArray((currentPageNo - 1) * pageInfo.pageSize, this.virtualLoadedPages) == -1) {
                        if (this.model.scrollSettings.virtualScrollMode == "continuous" && !e.reachedEnd)
                            return
                        if (currentPageNo == pageInfo.totalPages && $.inArray((currentPageNo - 2) * pageInfo.pageSize, this.virtualLoadedPages) == -1) {
                            flag++;
                            this.set_currentPageIndex(currentPageNo);
                        }
                        if (flag == 1) this._lastRow = true;
                        this.set_currentPageIndex(currentPageNo);
                    }
                    pageInfo.currentPage = currentPageNo;
                }
                else
                    pageInfo.currentPage = currentPageNo;
                var model = this._refreshVirtualPagerInfo();
                this._showPagerInformation(model);
            }
        };
        HeatMapGrid.prototype._virtualViewScroll = function (e) {
            if (e != null) {
                if (e.scrollTop !== undefined)
                    e.model.scrollTop = e.scrollTop;
                if (e.reachedEnd != undefined) e.model.reachedEnd = e.reachedEnd;
                var currentVirtualIndex = this._calculateCurrentVirtualIndex(e);
                if ($.inArray(currentVirtualIndex, this._currentLoadedIndexes) == -1)
                    this._isVirtualRecordsLoaded = false;
                if (!this._isVirtualRecordsLoaded)
                    this.set_currentVirtualIndex(currentVirtualIndex);
            }
        };

        HeatMapGrid.prototype._refreshVirtualContent = function (currentPage) {
            var rowHeight = this.getRowHeight();
            var recordsCount = this.model.filterSettings.filteredColumns.length == 0 ? this._searchCount == null ? this._gridRecordsCount : this._searchCount : this._filteredRecordsCount;
            if (currentPage != null) {
                this._currentPage(currentPage);
                var model = this._refreshVirtualPagerInfo();
                this._showPagerInformation(model);
            }
            var currentIndex = this.getCurrentIndex();
            var tbody = this.getContentTable()[0].tBodies[0];
            if (currentIndex > 0) {
                var virtualTRTop = document.createElement("tr");
                $(virtualTRTop).addClass("e-virtualrow").css("height", rowHeight * currentIndex).prependTo(tbody);
            } if (currentIndex + this.model.pageSettings.pageSize <= recordsCount && this.getContentTable().find("tr").last().hasClass("e-virtualrow") != true && this.model.scrollSettings.frozenColumns == 0) {
                var virtualTRBottom = document.createElement("tr");
                var virtualHeight = this.model.scrollSettings.virtualScrollMode == "normal" ? rowHeight * (recordsCount - (currentIndex + this.model.pageSettings.pageSize)) : 1;
                $(virtualTRBottom).addClass("e-virtualrow").css("height", virtualHeight).appendTo($(tbody));
            }
            this.virtualLoadedPages = new Array();
            this.orderedVirtualLoadedPage = [];
            this.virtualLoadedPages.push(currentIndex >= 0 ? currentIndex : 0);
            this.orderedVirtualLoadedPage.push(currentIndex >= 0 ? currentIndex : 0);
            var focusTR = $(tbody).find('tr:not(.e-virtualrow)').attr('name', currentIndex >= 0 ? currentIndex : 0)[0];
            if (focusTR && focusTR.previousSibling && ($(focusTR.previousSibling).hasClass("e-virtualrow") || focusTR.previousSibling.offsetTop > (currentIndex * this.getContent().height()))) {
                this.getContent().children("div").first().scrollTop(this.getContent().find(".content").scrollTop() - (this.getContent().find(".content").scrollTop() - focusTR.offsetTop));
                this._isVirtualRecordsLoaded = true;
            }
        };
        HeatMapGrid.prototype._refreshVirtualView = function (currentIndex) {
            if (!this._singleView) {
                var virtualRowCount = this._virtualRowCount;
                if (currentIndex) {
                    var scrollRefresh, currentPage;
                    if (currentIndex > this._totalVirtualViews) {
                        currentIndex = 1;
                        scrollRefresh = true;
                    }
                    this._currentVirtualIndex = currentIndex;
                    if (!this._virtualLoadedRecords[currentIndex]) {
                        if (!this._virtualDataRefresh && this._currentVirtualIndex != this._totalVirtualViews) scrollRefresh = true;
                        currentPage = Math.ceil(currentIndex * this._virtualRowCount / this.model.pageSettings.pageSize);
                    }
                    else
                        currentPage = Math.ceil(this.model.currentIndex / this.model.pageSettings.pageSize);
                    this._refreshVirtualViewScroller(scrollRefresh);
                    if (currentPage > this.model.pageSettings.totalPages) currentPage = this.model.pageSettings.totalPages;
                    if (currentPage <= 0) currentPage = 1;
                    if ($.inArray(currentPage, this._virtualLoadedPages) == -1)
                        this.gotoPage(currentPage);
                    else {
                        this._currentPage(currentPage);
                        if (!this._checkCurrentVirtualView(this._virtualLoadedRecords, currentIndex))
                            this._needPaging = true;
                        else
                            this._needPaging = false;
                        this._getVirtualLoadedRecords(this.model.query);
                        this._replacingVirtualContent();
                    }
                }
                else {
                    this._refreshVirtualViewDetails();
                    var rows = $(this.getContentTable()[0].rows);
                    this._setVirtualTopBottom();
                    if (this.initialRender) {
                        for (var i = 0; i < this._currentLoadedIndexes.length; i++) {
                            var currentLoadedIndex = this._currentLoadedIndexes[i]; var viewIndex = (i + 1) * virtualRowCount, viewCount = i * virtualRowCount;
                            $(rows[viewIndex - 1]).addClass("e-virtualview" + currentLoadedIndex);
                            var hex = currentLoadedIndex.toString(32);
                            var vRows = rows.slice(viewCount, viewCount + virtualRowCount).attr('name', hex).detach();
                            this._virtualLoadedRows[currentLoadedIndex] = vRows;
                            vRows.appendTo(this.getContentTable());
                        }
                        if (this._currentVirtualIndex > 1)
                            this._refreshVirtualViewScroller();
                    }
                    this._eventBindings();
                }
                if ($.inArray(this._currentPage(), this._virtualLoadedPages) == -1)
                    this._virtualLoadedPages.push(this._currentPage());
            }
            else {
                this._singleView = false;
                this._addLastRow();
                this.getContent().find(".e-virtualtop, .e-virtualbottom").remove();
                var hex = this._currentVirtualIndex.toString(32);
                $(this._gridRows).attr('name', hex);
                this._virtualLoadedRows[this._currentVirtualIndex] = this._gridRows;
                this._eventBindings();
            }
            if (!currentIndex && (this.model.queryCellInfo || this.model.rowDataBound)) {
                for (var i = 0; i < this._currentLoadedIndexes.length; i++) {
                    if ($.inArray(this._currentLoadedIndexes[i], this._queryCellView) == -1)
                        this._queryCellView.push(this._currentLoadedIndexes[i]);
                }
            }
            this._isThumbScroll = false;
            this._virtualDataRefresh = false;
        };
        HeatMapGrid.prototype._refreshVirtualViewData = function () {
            this._virtualLoadedRecords = {};
            this._virtualLoadedRows = {};
            this._virtualLoadedPages = [];
            this._virtualPageRecords = {};
            this._queryCellView = [];
            if (this.model.pageSettings.totalPages != null && this._currentPage() > this.model.pageSettings.totalPages) {
                this._currentPage(1);
                this._currentVirtualIndex = 1;
            }
        };
        HeatMapGrid.prototype.setCurrentPageData = function (currentData) {
            if (this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization) {
                this._refreshVirtualViewData();
                this._refreshVirtualViewDetails();
                this._setVirtualLoadedRecords(currentData, this._currentPage());
                this._refreshVirtualView(this._currentVirtualIndex);
            }
        };
        HeatMapGrid.prototype._refreshVirtualViewScroller = function (needRefresh) {
            var scrollValue;
            if ((this.initialRender && !this.model.scrollSettings.scrollTop) || needRefresh) {
                var rowHeight = this._vRowHeight;
                scrollValue = this.model.currentIndex * this._vRowHeight;
            }
            else
                scrollValue = this._scrollObject.model.scrollTop;
            this.getContent().ejScroller("model.scrollTop", scrollValue);
            this._scrollValue = scrollValue;
        };
        HeatMapGrid.prototype._calculateCurrentViewPage = function (args) {
            if (!args) args = this._scrollObject.model;
            var pageSize = this.model.pageSettings.pageSize;
            var currentPage = Math.ceil((args.scrollTop + this.model.scrollSettings.height) / this._vRowHeight / pageSize);
            // if(this.model.scrollSettings.virtualScrollMode == "continuous")
            // currentPage = Math.ceil(this._currentVirtualIndex * this._virtualRowCount / this.model.pageSettings.pageSize);
            if (this.model.pageSettings.totalPages == null)
                this.model.pageSettings.totalPages = Math.ceil(this._getVirtualTotalRecord() / pageSize);
            if (currentPage > this.model.pageSettings.totalPages)
                currentPage = this.model.pageSettings.totalPages;
            return currentPage;
        };
        HeatMapGrid.prototype._calculateCurrentVirtualIndex = function (e) {
            var args = e.model, recordCount = this._getVirtualTotalRecord();
            var currentIndex, trEle, isLast, viewTr = [], cur, oTop, len, sTop = args.scrollTop;
            var index = sTop + this.model.scrollSettings.height;
            currentIndex = index / this._vRowHeight / this._virtualRowCount;
            if (this._prevVirtualIndex > this._currentVirtualIndex && sTop <= this._scrollValue)
                currentIndex = Math.floor(currentIndex);
            else
                currentIndex = Math.ceil(currentIndex);
            if (sTop >= this._scrollValue && args.virtualScrollMode == "continuous" && args.reachedEnd)
                currentIndex = currentIndex + 1;
            if (currentIndex > this._totalVirtualViews) currentIndex = this._totalVirtualViews;
            if (currentIndex <= 0) currentIndex = 1;
            if ($.inArray(currentIndex, this._currentLoadedIndexes) !== -1 && this._virtualLoadedRows[currentIndex] && sTop != e.scrollData.scrollable) {
                var viewTrs = this.getContentTable()[0].rows; len = viewTrs.length;
                var virtualTopHeight = this.getContent().find(".e-virtualtop").height();
                isLast = sTop >= this._scrollValue;
                for (var i = 0; i < len; i++) {
                    cur = viewTrs[i];
                    oTop = cur.offsetHeight + cur.offsetTop + virtualTopHeight;
                    if (oTop > sTop + this.model.scrollSettings.height) {
                        if (viewTr.length === 0 && i !== 0)
                            viewTr = [viewTrs[cur.offsetTop <= sTop + this.model.scrollSettings.height ? i : i - 1]];
                        break;
                    }
                    if (oTop >= sTop && oTop <= sTop + this.model.scrollSettings.height) {
                        viewTr.push(cur);
                        if (isLast === false && viewTr.length > 1)
                            break;
                    }
                }
                trEle = $(sTop >= this._scrollValue ? viewTr[viewTr.length - 1] : viewTr[0]);
                if (trEle.length)
                    currentIndex = parseInt(trEle.attr("name"), 32);
            }
            this._scrollValue = sTop;
            return currentIndex;
        };
        HeatMapGrid.prototype._calculateCurrenPage = function (virtualRows, target, args) {
            var pageSize = this.model.pageSettings.pageSize;
            var currentPage, tempCPage, diff, proxy = this, trEle, isLast, viewTr = [], cur, oTop, len, currentRowValue, $currentRow;
            var rowHeight = this.getRowHeight();
            currentPage = (args.scrollTop + this.model.scrollSettings.height) / rowHeight / pageSize;
            currentRowValue = (this.model.pageSettings.pageSize * (this.model.pageSettings.currentPage - 1));
            $currentRow = this.getContentTable().find("tr[name=" + currentRowValue + "]").eq(0);
            if ($currentRow.length && $currentRow.offset().top > 0 && currentPage >= 1 && args.scrollTop < this._scrollValue && this.virtualLoadedPages.indexOf(Math.ceil(currentPage - 1) * pageSize) !== -1)
                currentPage = Math.floor(currentPage);
            else
                currentPage = Math.ceil(currentPage);

            if (args.scrollTop >= this._scrollValue && args.virtualScrollMode == "continuous" && args.reachedEnd) {
                currentPage = this.virtualLoadedPages[this.virtualLoadedPages.length - 1] / pageSize + 2;
            }

            if ($.inArray((currentPage - 1) * pageSize, this.virtualLoadedPages) !== -1) {
                var viewTrs = this.getContentTable().children("tbody").children("tr"); len = viewTrs.length;
                isLast = args.scrollTop >= this._scrollValue;
                for (var i = 0; i < len; i++) {
                    cur = viewTrs[i];
                    oTop = cur.offsetHeight + cur.offsetTop;
                    if (oTop > args.scrollTop + proxy.model.scrollSettings.height) {
                        if (viewTr.length === 0 && i !== 0)
                            viewTr = [viewTrs[cur.offsetTop <= args.scrollTop + proxy.model.scrollSettings.height ? i : i - 1]];
                        break;
                    }
                    if (oTop >= args.scrollTop && oTop <= args.scrollTop + proxy.model.scrollSettings.height) {
                        viewTr.push(cur);
                        if (isLast === false && viewTr.length > 1)
                            break;
                    }
                }
                trEle = $(args.scrollTop >= this._scrollValue ? viewTr[viewTr.length - 1] : viewTr[0]);
                if (trEle.hasClass('e-virtualrow')) {
                    if (viewTr.length === 1) {
                        currentPage++;
                    }
                }
                else
                    currentPage = parseInt(trEle.attr("name"), 10) / pageSize + 1;
            }
            this._scrollValue = args.scrollTop;
            for (var index = 0; index < virtualRows.length; index++) {
                var val = virtualRows[index];
                if (val.offsetTop + val.offsetHeight >= args.scrollTop) {
                    var prevVirtualPage = this._calculatePrevPage(virtualRows, target, args);
                    this._prevPageNo = prevVirtualPage;
                    if (currentPage == 0)
                        currentPage = 1;
                    currentPage = currentPage > this.model.pageSettings.totalPages ? this.model.pageSettings.totalPages : currentPage;
                    return currentPage;
                }
            }
            return currentPage;
        };
        HeatMapGrid.prototype._calculatePrevPage = function (virtualRows, target, args) {
            for (var i = 0; i < virtualRows.length; i++) {
                var val = virtualRows[i];
                if (val.offsetTop + val.offsetHeight >= args.scrollTop) {
                    var trElement = $(val).prevAll('tr[name]')[0];
                    if (trElement != null) {
                        return Math.ceil(parseInt($(trElement).attr('name'), 10) / this.model.pageSettings.pageSize) + 1;
                    }
                }
            }
            return -1;
        };
        HeatMapGrid.prototype._refreshVirtualPagerInfo = function () {
            var model = {};
            model.pageSize = this.model.pageSettings.pageSize;
            model.currentPage = this._currentPage();
            model.totalRecordsCount = this.model.filterSettings.filteredColumns.length == 0 ? this._searchCount == null ? this._gridRecordsCount : this._searchCount : this._filteredRecordsCount;
            model.totalPages = Math.ceil(model.totalRecordsCount / model.pageSize);

            return model;
        };
        HeatMapGrid.prototype._showPagerInformation = function (model) {
            var from = (model.currentPage - 1) * model.pageSize;
            $(this.$pagerStatusBarDiv).find("div:first").html(String.format("{0} of {1} pages ({2} items)", model.currentPage, model.totalPages, model.totalRecordsCount), from, from + model.pageSize);
            $(this.$pagerStatusBarDiv).css('display', 'block');
        };
        HeatMapGrid.prototype._replacingContent = function () {
            var temp = document.createElement('div');
            var currentIndex = this.getCurrentIndex();
            var contentTable = this.getContentTable()[0];
            var colGroup = $(contentTable).find("colgroup").first();
            var rowHeight = this.getRowHeight();
            colGroup.replaceWith(this._getMetaColGroup());
            (this.model.detailsTemplate != null || this.model.childGrid != null) && colGroup.prepend(this._getIndentCol());
            var tbody = contentTable.tBodies[0];
            var currentData = this.model.currentViewData;
            if (!ej.isNullOrUndefined(this._currentPageData)) {
                this._virtualLoadedRecords[this._currentPage()] = this._currentPageData;
                this._currentPageData = null;
            }
            else
                this._virtualLoadedRecords[this._currentPage()] = currentData;
            var elementTbody = $("<tbody></tbody>").append($.render[this._id + "_JSONTemplate"](currentData));
            var proxy = this;
            var $elementTbody = elementTbody.children("tr");
            if (this._allowcolumnSelection && this.selectedColumnIndexes.length > 0) {
                for (var index = 0; index < this.selectedColumnIndexes.length; index++) {
                    var ind = this.selectedColumnIndexes[index] + 1;
                    $elementTbody.find('td:nth-of-type(' + ind + ')').addClass("e-columnselection");
                }
            }
            this.virtualLoadedPages.push(currentIndex >= 0 ? currentIndex : 0);
            var orderedVirtualPages = ej.dataUtil.mergeSort(ej.distinct(this.virtualLoadedPages));
            $($elementTbody).attr('name', currentIndex);
            var minValue = ej.dataUtil.min(orderedVirtualPages);
            var maxValue = ej.dataUtil.max(orderedVirtualPages);
            $(tbody).children(".e-virtualrow").remove();
            for (var i = 0; i < orderedVirtualPages.length; i++) {
                var val = orderedVirtualPages[i];
                var pVal = orderedVirtualPages[i - 1];
                if (val != this.orderedVirtualLoadedPage[i] || this.orderedVirtualLoadedPage[i] == undefined) {
                    if (pVal != undefined)
                        $elementTbody.insertAfter($(tbody).children('[name=' + pVal + ']:last'));
                    else
                        $elementTbody.insertBefore($(tbody).children('[name=' + this.orderedVirtualLoadedPage[i] + ']:first'));
                    this.orderedVirtualLoadedPage = orderedVirtualPages;
                }
                if (val != 0) {
                    var prevValue = val == minValue ? minValue : pVal;
                    var middleRows = val - prevValue - proxy.model.pageSettings.pageSize;
                    if (middleRows > 0) {
                        var virtualTRMiddle = document.createElement("tr");
                        $(virtualTRMiddle).addClass("e-virtualrow").css("height", rowHeight * middleRows).insertBefore($(tbody).children('[name=' + val + ']:first'));
                    }
                }
                if (val == maxValue) {
                    var bottomRows = proxy._gridRecordsCount - maxValue - proxy.model.pageSettings.pageSize;
                    if (bottomRows > 0) {
                        var virtualTRBottom = document.createElement("tr");
                        $(virtualTRBottom).addClass("e-virtualrow").css("height", rowHeight * bottomRows).appendTo(tbody);
                    }
                }
            }
            if (minValue > 0) {
                var virtualTRTop = document.createElement("tr");
                $(virtualTRTop).addClass("e-virtualrow").css("height", rowHeight * minValue).prependTo(tbody);
            }
            var $content = this.getContent();
            var focusTR = $(tbody).children("tr[name=" + currentIndex + "]")[0];
            var focusPrev = focusTR.previousSibling;
            var con = $content.height();
            var focus = focusTR.offsetTop
            if (this._virtaulUnSel) {
                var virtualClone = $.extend(true, [], this._virtaulUnSel);
                for (var i = 0; i < virtualClone.length; i++) {
                    var row = virtualClone[i];
                    var page = this.model.pageSettings.currentPage;
                    var corresPage = row % this.model.pageSettings.pageSize == 0 ? parseInt(row / this.model.pageSettings.pageSize) : parseInt(row / this.model.pageSettings.pageSize) + 1;
                    if (corresPage == page) {
                        var index = row % this.model.pageSettings.pageSize;
                        var $row = $(tbody).find("tr[name=" + currentIndex + "]").eq(index);
                        $row.attr("aria-selected", "true").find('.e-rowcell, .e-detailrowcollapse, .e-detailrowexpand').addClass("e-selectionbackground e-active");
                        var removeIndex = this._virtaulUnSel.indexOf(row);
                        if (removeIndex != -1)
                            this._virtaulUnSel.splice(removeIndex, 1);
                    }
                }
            }
            if ((focusTR && focusPrev && ((this._virIndex || $(focusPrev).hasClass("e-virtualrow")) || focusPrev.offsetTop > (currentIndex * con))
            && (this._gridRecordsCount - currentIndex >= this.model.pageSettings.pageSize || focusTR.offsetParent.offsetHeight - focus < con)) || this._lastRow) {
                if (this._lastRow) this._lastRow = false;
                if (this._virIndex) this._virIndex = false;
                this._isVirtualRecordsLoaded = true;
                //this.getContent().children("div").first().scrollTop(this.getContent().find(".content").scrollTop() - (this.getContent().find(".content").scrollTop() - focusTR.offsetTop));
                $content.find(".e-content").scrollTop(focus);
                this._scrollValue = this.getContent()[0].firstChild.scrollTop;
            }
            var $contentTableTr = $(contentTable).get(0);
            var tFirst = temp.firstChild;
            this._currentJsonData = currentData;
            this._gridRows = $(contentTable).get(0).rows;
            var lastVirtualRow = $(contentTable).find(".e-virtualrow").last();
            var lastVirtualRowHeight = this.model.scrollSettings.virtualScrollMode == "normal" ? (lastVirtualRow.height() - ($(contentTable).height() - (this._gridRecordsCount * rowHeight))) : 1;
            lastVirtualRow.css("height", lastVirtualRowHeight);
            this._eventBindings();
        };
        HeatMapGrid.prototype._replacingVirtualContent = function () {
            var contentTable = this.getContentTable()[0];
            var currentLoadedIndexes = this._currentLoadedIndexes;
            var tempTbody = $("<tbody></tbody>");
            if (this._checkCurrentVirtualView(this._virtualLoadedRows, this._currentVirtualIndex)) {
                var currentRows = [];
                for (var i = 0; i < currentLoadedIndexes.length; i++) {
                    $.merge(currentRows, this._virtualLoadedRows[currentLoadedIndexes[i]]);
                }
                $(tempTbody).append(currentRows);
            }
            else {
                var elementTbody = $("<tbody></tbody>");
                for (var i = 0; i < currentLoadedIndexes.length; i++) {
                    var currentIndex = currentLoadedIndexes[i], virtualRow = this._virtualLoadedRows[currentIndex];
                    if (!virtualRow) {
                        var elementTbody = $("<tbody></tbody>").append($.render[this._id + "_JSONTemplate"](this._virtualLoadedRecords[currentIndex]));
                        var $elementTbody = elementTbody[0].rows, length = $elementTbody.length - 1;
                        $($elementTbody[length]).addClass("e-virtualview" + currentIndex);
                        var hex = currentIndex.toString(32);
                        var vRows = $($elementTbody).attr('name', hex);
                        if (vRows.length == this._virtualRowCount || currentIndex == this._totalVirtualViews) {
                            this._virtualLoadedRows[currentIndex] = vRows;
                            tempTbody.append($elementTbody);
                        }
                    }
                    else {
                        if (currentIndex < this._currentVirtualIndex) {
                            var vRow = tempTbody.find(".e-virtualview" + currentIndex);
                            if (vRow.length)
                                $(virtualRow).insertBefore(vRow);
                            else
                                tempTbody.prepend(virtualRow);
                        }
                        else
                            $(virtualRow).insertAfter(tempTbody.find(".e-virtualview" + (currentIndex - 1)));
                    }
                }
            }
            contentTable.replaceChild(tempTbody[0], contentTable.lastChild);
            $(contentTable.rows).removeClass("e-hover");
            this._setVirtualTopBottom();
            if (this._isThumbScroll || this._remoteRefresh) {
                //this._scrollObject.refresh();				
                this._scrollObject._content[0].scrollTop = this._scrollObject.scrollTop();
                this._isThumbScroll = this._remoteRefresh = false;
            }
            if (this.model.allowSelection)
                this._checkVirtualSelection();
            this._gridRows = contentTable.rows;
            if (!this._checkCurrentVirtualView(this._queryCellView, this._currentVirtualIndex))
                this._eventBindings();
            if (this.model.queryCellInfo || this.model.rowDataBound) {
                for (var i = 0; i < this._currentLoadedIndexes.length; i++) {
                    if ($.inArray(this._currentLoadedIndexes[i], this._queryCellView) == -1)
                        this._queryCellView.push(this._currentLoadedIndexes[i]);
                }
            }
        };
        HeatMapGrid.prototype._setVirtualTopBottom = function () {
            var contentTable = this.getContentTable()[0];
            var rowHeight = this._vRowHeight;
            var orderedVirtualNames = ej.dataUtil.mergeSort(ej.distinct(this._currentLoadedIndexes));
            var minValue = ej.dataUtil.min(orderedVirtualNames);
            var maxValue = ej.dataUtil.max(orderedVirtualNames);
            var recordsCount = this._getVirtualTotalRecord(), botHeight, maxViewValue;
            if (this.model.scrollSettings.virtualScrollMode == "continuous" && this._virtualLoadedRows[maxValue + 1]) {
                var keys = Object.keys(this._virtualLoadedRows);
                maxViewValue = parseInt(ej.dataUtil.max(keys), 10);
                maxValue = maxViewValue - maxValue;
            }
            botHeight = (maxValue * this._virtualRowCount * rowHeight);
            if ($.inArray(this._totalVirtualViews, this._currentLoadedIndexes) != -1 && this._currentVirtualIndex != this._totalVirtualViews)
                botHeight = (recordsCount - (this._virtualRowCount - this._lastViewData)) * rowHeight;
            var vBot = (recordsCount * rowHeight) - botHeight;
            if (this.model.scrollSettings.virtualScrollMode == "continuous" && !this._virtualLoadedRows[maxValue + 1]) {
                vBot = maxViewValue && maxViewValue <= maxValue + 1 ? vBot : 1;
            }
            this.getContent().find(".e-virtualtop, .e-virtualbottom").remove();
            var max = 1000000;
            if (vBot > 0 && this._getVirtualTotalRecord() > this._virtualRowCount * 2) {
                if (Math.round(vBot).toString().length < 7)
                    ej.buildTag("div.e-virtualbottom", "", { height: vBot }).insertAfter(contentTable);
                else {
                    ej.buildTag("div.e-virtualbottom").insertAfter(contentTable);
                    var length = Math.ceil(vBot / max);
                    for (var i = 0; i < length; i++) {
                        var divHeight = max;
                        if (i == length - 1) divHeight = vBot % max;
                        $(contentTable).next().append(ej.buildTag("div", "", { height: divHeight }));
                    }
                }
            }
            if (minValue > 1) {
                var vTop = (minValue - 1) * this._virtualRowCount * rowHeight;
                if (Math.round(vTop).toString().length < 7)
                    ej.buildTag("div.e-virtualtop", "", { height: vTop }).insertBefore(contentTable);
                else {
                    ej.buildTag("div.e-virtualtop").insertBefore(contentTable);
                    var length = Math.ceil(vTop / max);
                    for (var i = 0; i < length; i++) {
                        var divHeight = max;
                        if (i == length - 1) divHeight = vTop % max;
                        $(contentTable).prev().append(ej.buildTag("div", "", { height: divHeight }));
                    }
                }
            }
            if (this._scrollObject.model.scrollTop != this._scrollValue)
                this.getContent().ejScroller("model.scrollTop", this._scrollValue);
        };
        HeatMapGrid.prototype._checkVirtualSelection = function () {
            var contentTable = this.getContentTable()[0];
            for (var i = 0; i < this.selectedRowsIndexes.length; i++) {
                var selectedIndex = this.selectedRowsIndexes[i];
                var viewIndex = this._getSelectedViewData(selectedIndex).viewIndex;
                if ($.inArray(viewIndex, this._currentLoadedIndexes) != -1) {
                    var selIndex = selectedIndex % this._virtualRowCount + this._currentLoadedIndexes.indexOf(viewIndex) * this._virtualRowCount;
                    if (!$(contentTable.rows[selIndex].cells).hasClass("e-selectionbackground")) {
                        $($(contentTable.rows[selIndex]).attr("aria-selected", "true")[0].cells).addClass("e-selectionbackground e-active");
                        this.model.selectedRecords[i] = this._virtualLoadedRecords[viewIndex][selIndex % this._virtualRowCount];
                    }
                }
            }
            for (var i = 0; i < this._rowIndexesColl.length; i++) {
                var selectedIndex = this._rowIndexesColl[i];
                var viewIndex = this._getSelectedViewData(selectedIndex).viewIndex;
                if (($.inArray(viewIndex, this._currentLoadedIndexes) != -1 && $.inArray(selectedIndex, this._virtualRowCellSelIndex) == -1) || this._virtualDataRefresh) {
                    var curIndex = $.inArray(selectedIndex, this._rowIndexesColl);
                    var cellIndexes = this.selectedRowCellIndexes[curIndex].cellIndex;
                }
            }
            var selectedRows = $(contentTable.rows).find(".e-active, .e-cellselectionbackground").closest("tr");
            for (var i = 0; i < selectedRows.length; i++) {
                var limit = parseInt($(selectedRows[i]).attr("name"), 32) * this._virtualRowCount;
                var remain = this._virtualRowCount - $(selectedRows[i]).index() % this._virtualRowCount;
                var current = limit - remain;
                var rowIndex = $(selectedRows[i]).index();
                if (this.selectedRowsIndexes.length && $.inArray(current, this.selectedRowsIndexes) == -1) {
                    this._clearVirtualSelection = true;
                    this.clearSelection(rowIndex);
                }
                if (this._rowIndexesColl.length && $.inArray(current, this._rowIndexesColl) == -1)
                    $(this.getRowByIndex(rowIndex)[0].cells).removeClass("e-cellselectionbackground e-activecell");
            }
            $(contentTable.rows).find('.e-columnselection').removeClass('e-columnselection');
            for (var index = 0; index < this.selectedColumnIndexes.length; index++) {
                var ind = this.selectedColumnIndexes[index] + 1;
                $(contentTable.rows).find('td:nth-of-type(' + ind + ')').addClass("e-columnselection");
            }
            this._clearVirtualSelection = false;
        };
        HeatMapGrid.prototype._calculateWidth = function () {
            var j = this.getHeaderTable().find(".e-columnheader").last().find("th:visible"), width = 0;
            for (var i = 0; i < j.length; i++)
                width += j.eq(i).outerWidth();
            return width;

        };
        HeatMapGrid.prototype.columns = function (details, action) {
            if (ej.isNullOrUndefined(details)) return;
            var isString = false;
            if (typeof details === "string") {
                details = [details];
                isString = true;
            }
            else if (details instanceof Array && details.length && typeof details[0] === "string")
                isString = true;
            for (var i = 0; i < details.length; i++) {
                var index = $.inArray(this.getColumnByField(isString ? details[i] : details[i]["field"]), this.model.columns);
                if (action == "add" || ej.isNullOrUndefined(action)) {
                    if (index == -1)
                        this.model.columns.push(isString ? { field: details[i] } : details[i]);
                    else
                        this.model.columns[index] = isString ? { field: details[i] } : details[i];
                }
                else {
                    if (index != -1)
                        this.model.columns.splice(index, 1);
                }
            }
            this.columnsWidthCollection = [];
            var tooltip = false;
            for (var columnCount = 0; columnCount < this.model.columns.length; columnCount++) {
                this.columnsWidthCollection.push(this.model.columns[columnCount]["width"]);
                if (!ej.isNullOrUndefined(tooltip))
                    tooltip = true;
            }
            this._enableRowHover(tooltip);
            if (this.model.editSettings.allowEditing || this.model.editSettings.allowAdding)
                this._processEditing();
            this.refreshContent(true);
            if (this.model.allowScrolling) {
                this.refreshScrollerEvent();
                if (this.model.allowResizeToFit && this.getContent().ejScroller("isVScroll"))
                    this._showHideScroller();
            }
        };
        HeatMapGrid.prototype._enableRowHover = function (isTooltip, heatmap) {
            var tooltip = true;
            if (ej.isNullOrUndefined(isTooltip)) {
                for (var i = 0 ; i < this.model.columns.length; i++) {
                    if (!ej.isNullOrUndefined(this.model.columns[i]['tooltip'])) {
                        tooltip = true;
                        break;
                    }
                }
            }
            else
                tooltip = isTooltip;
            if (this.model.enableRowHover || tooltip)
                heatmap._on(this.element, "mouseenter mouseleave", ".e-gridcontent tr td", $.proxy(this._rowHover, this));
            else
                heatmap._off(this.element, "mouseenter mouseleave", ".e-gridcontent tr td");
        };
        HeatMapGrid.prototype._rowHover = function (e) {
            var $target = $(e.target);
            if (this.model.scrollSettings.frozenColumns)
                var $gridRows = $(this.getRows());
            else
                var $gridRows = this.element.find(".e-row.e-hover,.e-alt_row.e-hover");
            if (($target.closest("#" + this._id + "EditForm").length && $target.hasClass("e-rowcell")) || !$target.hasClass("e-rowcell"))
                return;
            if (e.type == "mouseenter" && $target.hasClass("e-gridtooltip"))
                this._showTooltip($target);
            if (this.model.enableRowHover) {
                if (e.type == "mouseenter" && !this._dragActive) {
                    if (this.model.scrollSettings.frozenColumns > 0 && !ej.isNullOrUndefined($gridRows[0]) && !ej.isNullOrUndefined($gridRows[1])) {
                        $gridRows = $($gridRows[0]).add($gridRows[1]);
                        $gridRows.removeClass("e-hover");
                        var index = this.getIndexByRow($target.parent());
                        index != -1 && this.getRowByIndex(index).addClass("e-hover");
                    }
                    else {
                        $gridRows.removeClass("e-hover");
                        if ($target.parent().hasClass('e-row') || $target.parent().hasClass('e-alt_row'))
                            $target.parent().addClass("e-hover");
                    }
                } else {
                    if (this.model.scrollSettings.frozenColumns > 0 && !ej.isNullOrUndefined($gridRows[0]) && !ej.isNullOrUndefined($gridRows[1]))
                        $gridRows = $($gridRows[0]).add($gridRows[1]);
                    $gridRows.removeClass("e-hover");
                }
            }
            return false;
        };
        HeatMapGrid.prototype._showTooltip = function ($target, isHeaderTooltip) {
            var index = $target.index(), isStack = $target.hasClass("e-stackedHeaderCell");
            if ($target.hasClass("e-headercelldiv"))
                index = $target.parent(".e-headercell").index() - this.model.groupSettings.groupedColumns.length;
            if (!isStack && (this.model.childGrid || this.model.detailsTemplate))
                index--;
            if (this.model.scrollSettings.frozenColumns > 0 && ($target.closest(".e-movableheaderdiv").length || $target.closest(".e-movablecontentdiv").length))
                index = index + this.model.scrollSettings.frozenColumns;
            var col = !isStack ? this.getColumnByIndex(index) : this._getStackedColumnByTarget($target);
            if (col["clipMode"] != ej.HeatMapGrid.ClipMode.Ellipsis) {
                if (col["clipMode"] == ej.HeatMapGrid.ClipMode.EllipsisWithTooltip) {
                    var td = $target;
                    if (!$target.find("span").hasClass("e-tooltip")) {
                        var $span = ej.buildTag('span.e-tooltip', {}, {})
                        $span.html($target.html());
                        td.html($span);
                    }
                    td.find('span.e-tooltip').css('display', 'inline-block')
                    var width = td.find('span:first')[0].getBoundingClientRect().width;
                    td.find('span.e-tooltip').css('display', 'inline');
                    if ($target.width() > (width)) {
                        $target.removeAttr('title');
                        return;
                    }
                }

                var scriptElement = document.createElement("script");
                if (ej.isNullOrUndefined(col["tooltip"]) && ej.isNullOrUndefined(col["headerTooltip"]))
                    return;
                else {
                    var t;
                    scriptElement.id = (this._id + col.headerText + $.inArray(col, this.model.columns) + "_TemplateToolTip").split(" ").join("");
                    scriptElement.type = "text/x-template";
                    var tooltipType = !isHeaderTooltip ? "tooltip" : "headerTooltip";
                    if (!ej.isNullOrUndefined(col[tooltipType]) && col[tooltipType].slice(0, 1) !== "#")
                        scriptElement.text = col[tooltipType];
                    else
                        t = $(col[tooltipType]);
                    if (t) {
                        scriptElement.text = t.html();
                        scriptElement.type = t.attr("type") || scriptElement.type;
                    }
                    $("body").append(scriptElement);
                }
                var str = $(scriptElement).render({ value: $target.text() });
                $target.attr('title', str);
            }
            else
                $target.removeAttr('title');

        };
        HeatMapGrid.prototype._colgroupRefresh = function () {
            if ((this.model.allowResizing || this.model.allowResizeToFit) && this.model.scrollSettings.frozenColumns > 0) {
                var gridheaderCol = $(this.getHeaderTable()).find('colgroup');
                var gridcontentCol = $(this.getContentTable()).find('colgroup');
            }
            else {
                var gridheaderCol = $(this.getHeaderTable()).find('colgroup')[0];
                var gridcontentCol = $(this.getContentTable()).find('colgroup')[0];
            }
            var headerColClone = $(gridheaderCol).clone();
            var contentColClone = $(gridcontentCol).clone();
            $(gridcontentCol).remove();
            $(gridheaderCol).remove();
            if ((this.model.allowResizing || this.model.allowResizeToFit) && this.model.scrollSettings.frozenColumns > 0) {
                $(headerColClone[0]).prependTo(this.getHeaderTable()[0]);
                $(headerColClone[1]).prependTo(this.getHeaderTable()[1]);
                $(contentColClone[0]).prependTo(this.getContentTable()[0]);
                $(contentColClone[1]).prependTo(this.getContentTable()[1]);
            }
            else {
                $(headerColClone).prependTo(this.getHeaderTable());
                $(contentColClone).prependTo(this.getContentTable());
            }
        };
        HeatMapGrid.prototype._detailColsRefresh = function () {
            this._$headerCols = this.getHeaderTable().children("colgroup").find("col");
            this._$contentCols = this.getContentTable().children("colgroup").find("col");
            var colCount = this.model.columns.length;
            if (this._$headerCols.length > colCount) this._$headerCols.splice(0, (this._$headerCols.length - colCount));
            if (this._$contentCols.length > colCount) this._$contentCols.splice(0, (this._$contentCols.length - colCount));
        };
        HeatMapGrid.prototype._htmlEscape = function (str) {
            var regx = /[&<>"']/g, charEntities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&#34;",
                "'": "&#39;"
            };
            return str.replace(regx, function (c) {
                return charEntities[c];
            });
        };
        HeatMapGrid.prototype._getForeignKeyData = function (data) {
            var proxy = this;
            var column = {};
            for (var i = 0; i < this.model.columns.length; i++) {
                if (this.model.columns[i].foreignKeyValue && this.model.columns[i].dataSource) {
                    var fieldName = ej.isNullOrUndefined(proxy.model.columns[i]["foreignKeyField"]) ? proxy.model.columns[i]["field"] : proxy.model.columns[i]["foreignKeyField"];
                    var dataSource = this.model.columns[i].dataSource instanceof ej.DataManager ? this.model.columns[i].foreignKeyData : this.model.columns[i].dataSource;
                    dataSource.filter(function (col) {
                        var value = data[proxy.model.columns[i]["field"]];
                        var fValue = !isNaN(parseFloat(value)) && isFinite(value) ? parseFloat(value) : value;
                        if (col[fieldName] == fValue) {
                            column[fieldName] = col;
                        }
                    });
                }
            }
            return column;
        };
        HeatMapGrid.prototype._foreignKeyBinding = function (curColumn, cellValue, gridId) {
            var cellData, val;
            var gridObj = $("#" + gridId).ejGrid('instance');
            curColumn = gridObj.model.columns[curColumn];
            var dataSource = curColumn.dataSource instanceof ej.DataManager ? curColumn.foreignKeyData : curColumn.dataSource;
            dataSource.filter(function (col) {
                if (ej.getObject(curColumn.foreignKeyField, col) == cellValue) {
                    val = ej.getObject(curColumn.foreignKeyValue, col);
                    return cellData = curColumn.type == "date" ? new Date(val) : val;
                }
            });
            if (curColumn.format) {
                cellData = gridObj.formatting(curColumn.format, cellData, gridObj.model.locale);
            }
            return cellData;
        };
        HeatMapGrid.prototype._setForeignKeyData = function (args) {
            if (!this._relationalColumns.length)
                return;
            var arr = this._relationalColumns, len = this._relationalColumns.length,
                promises = [], viewData = this.model.currentViewData, e = {};
            var obj, qry, pred, dist, qPromise, proxy = this;

            var failFn = ej.proxy(function (e) { /*Separate fail handler to get more control over request*/
                this._trigger("actionFailure", { requestType: "fetchingforeigndata", error: e.error });
            }, this);

            for (var i = 0; i < len; i++) {
                if (!(0 in viewData)) continue;
                obj = arr[i], e.field = obj["field"], e.keyField = obj["key"], e.valueField = obj["value"], e.dataSource = obj["dataSource"],
                            e.query = new ej.Query().select([e.valueField, e.keyField]).foreignKey(e.keyField),
                            dist = ej.distinct(viewData.level ? viewData.records : viewData, e.keyField, true);

                pred = ej.UrlAdaptor.prototype.getFiltersFrom(dist, e.query);
                e.query.where(pred);

                if (this._trigger("actionBegin", $.extend(e, { requestType: "fetchingforeigndata", column: this.getColumnByField(e.field) })))
                    return;
                qPromise = e.dataSource.ready === undefined ? e.dataSource.executeQuery(e.query, null, failFn) : e.dataSource.ready.fail(failFn);
                promises.push(qPromise);
            }
        };
        HeatMapGrid.prototype._isRelationalRendering = function (args) {
            return (0 in this._relationalColumns) && ["add", "beginedit", "cancel"].indexOf(args.requestType) == -1;
        };
        HeatMapGrid.prototype._columns = function (index, property, value, old) {
            var $header = this.element.find(".e-gridheader");
            $header.find("div").first().empty().append(this._renderGridHeader().find("table"));
            this._headerCellgDragDrop();
            this.refreshContent(true);
            this._trigger("refresh");
        };
        HeatMapGrid.prototype._summaryRows = function (index, property, value, old) {
            if (property == "showTotalSummary" || property == "showCaptionSummary") {
                var indx = index.summaryRows;
                var val = value.toLowerCase() == "true" || value.toLowerCase() == "false" ? ej.parseJSON(value) : false;
                this.option("summaryRows")[indx][property] = val;
            }
            this.element.find(".e-gridfooter").remove();

            if (property == "showCaptionSummary" || property == "title") {
                this._isCaptionSummary = this.option("summaryRows")[indx]["showCaptionSummary"];
                this.model.showSummary = this._isCaptionSummary;
                if (this.model.groupSettings.groupedColumns.length != 0)
                    this._refreshCaptionSummary();
            }
        };
        HeatMapGrid.prototype._summaryRows_summaryColumns = function (index, property, value, old) {
            if (property == "displayColumn" || property == "dataMember") {
                if (ej.isNullOrUndefined(this.getColumnByField(value)))
                    return;
            }

            if (this.element.find(".e-groupcaptionsummary").length != 0)
                this._refreshCaptionSummary();
        };
        HeatMapGrid.prototype._stackedHeaderRows_stackedHeaderColumns = function (index, property, value, old) {
            this._refreshStackedHeader();
        };
        HeatMapGrid.prototype._sortSettings_sortedColumns = function (index, property, value, old) {
            var colName, direction;
            var sortObj = this.model.sortSettings.sortedColumns[index["sortSettings.sortedColumns"]];
            if (property == "field") {
                colName = this.getColumnByField(value) != null ? value : null;
                direction = (sortObj.direction == "ascending" || sortObj.direction == "descending") ? sortObj.direction : null;
            }
            else if (property == "direction") {
                colName = this.getColumnByField(sortObj.field) != null ? sortObj.field : null;
                direction = (value == "ascending" || value == "descending") ? value : null;
            }
            if (colName != null && direction != null)
                this.sortColumn(colName, direction);
        };
        HeatMapGrid.prototype._filterSettings_filteredColumns = function (index, property, value, old) {
            var field, operator, matchcase, predicate, filtervalue;
            var filterObj = this.model.filterSettings.filteredColumns[index["filterSettings.filteredColumns"]];
            switch (property) {
                case "field":
                    field = this.getColumnByField(value) != null ? value : null;
                    operator = this._map(ej.FilterOperators, filterObj.operator);
                    filtervalue = filterObj.value;
                    predicate = (filterObj.predicate == "and" || filterObj.predicate == "or") ? filterObj.predicate : null;
                    matchcase = filterObj.matchcase;
                    break;
                case "matchcase":
                    field = this.getColumnByField(filterObj.field) != null ? filterObj.field : null;
                    operator = this._map(ej.FilterOperators, filterObj.operator);
                    filtervalue = filterObj.value;
                    predicate = (filterObj.predicate == "and" || filterObj.predicate == "or") ? filterObj.predicate : null;
                    matchcase = value.toLowerCase() == "true" || value.toLowerCase() == "false" ? ej.parseJSON(value) : false;
                    break;
                case "operator":
                    field = this.getColumnByField(filterObj.field) != null ? filterObj.field : null;
                    operator = this._map(ej.FilterOperators, value);
                    filtervalue = filterObj.value;
                    predicate = (filterObj.predicate == "and" || filterObj.predicate == "or") ? filterObj.predicate : null;
                    matchcase = filterObj.matchcase;
                    break;
                case "predicate":
                    field = this.getColumnByField(filterObj.field) != null ? filterObj.field : null;
                    operator = this._map(ej.FilterOperators, filterObj.operator);
                    filtervalue = filterObj.value;
                    predicate = (value == "and" || value == "or") ? value : null;
                    matchcase = filterObj.matchcase;
                    break;
                case "value":
                    field = this.getColumnByField(filterObj.field) != null ? filterObj.field : null;
                    operator = this._map(ej.FilterOperators, filterObj.operator);
                    filtervalue = value;
                    predicate = (filterObj.predicate == "and" || filterObj.predicate == "or") ? filterObj.predicate : null;
                    matchcase = filterObj.matchcase;
                    break;
            }
            if (field != null && operator != null && filtervalue != null && predicate != null && matchcase != null)
                this.filterColumn(field, operator, filtervalue, predicate, matchcase);
        };
        HeatMapGrid.prototype._map = function (object, value) {
            var data = $.map(object, function (obj) {
                if (obj === value)
                    return obj;
            });
            return data.length != 0 ? data[0] : null;
        };
        HeatMapGrid.prototype._refreshCaptionSummary = function () {
            var temp = document.createElement('div');
            temp.innerHTML = ['<table>', $.render[this._id + "_GroupingTemplate"](this.model.currentViewData, { groupedColumns: this.model.groupSettings.groupedColumns }), '</table>'].join("");
            this.getContentTable().get(0).replaceChild(temp.firstChild.firstChild, this.getContentTable().get(0).lastChild);
            this.refreshContent();
        };
        HeatMapGrid.prototype.getContentTable = function () {
            return this._gridContentTable;
        };
        HeatMapGrid.prototype.setGridContentTable = function (value) {
            this._gridContentTable = value;
        };
        HeatMapGrid.prototype.getContent = function () {
            return this._gridContent;
        };
        HeatMapGrid.prototype.setGridContent = function (value) {
            this._gridContent = value;
        };
        HeatMapGrid.prototype.getHeaderContent = function () {
            return this._gridHeaderContent;
        };
        HeatMapGrid.prototype.getHeaderTable = function () {
            return this._gridHeaderTable;
        };
        HeatMapGrid.prototype.getRows = function () {
            return this._gridRows;
        };
        HeatMapGrid.prototype.getFilteredRecords = function () {
            return this._filteredRecords;
        };
        HeatMapGrid.prototype.getRowByIndex = function (from, to) {
            try {
                var gridRows = this.getRows(), $gridRows = this._excludeDetailRows(), $row = $();
                if (Array.isArray(from)) {
                    for (var i = 0; i < from.length; i++) {
                        if (this.model.scrollSettings.frozenColumns > 0) {
                            $row.push(gridRows[0][from[i]]);
                            $row.push(gridRows[1][from[i]]);
                        }
                        else
                            $row.push(gridRows[from[i]]);
                    }
                    return $row;
                }
                else if (ej.isNullOrUndefined(to)) {
                    if (this.model.scrollSettings.frozenColumns > 0) {
                        $row.push(gridRows[0][from]);
                        $row.push(gridRows[1][from]);
                        return $row;
                    }
                    return $(($gridRows).not(".e-virtualrow")[from]);
                } else {
                    if (this.model.scrollSettings.frozenColumns > 0) {
                        $row.push($(gridRows[0]).slice(from, to));
                        $row.push($(gridRows[1]).slice(from, to));
                        return $row;
                    }
                    return $($gridRows.not(".e-virtualrow").slice(from, to));
                }
            } catch (e) {
                return $();
            }
        };
        HeatMapGrid.prototype.getColumnIndexByField = function (field) {
            for (var i = 0, col = this.model.columns, len = col.length ; i < len ; i++) {
                if (col[i]["field"] === field)
                    return i;
            }
            return -1;
        };
        HeatMapGrid.prototype.getColumnIndexByHeaderText = function (headerText, field) {
            for (var column = 0; column < this.model.columns.length; column++) {
                if (this.model.columns[column]["headerText"] == headerText) {
                    if (field) {
                        if (ej.isNullOrUndefined(this.model.columns[column]["field"]) || this.model.columns[column]["field"] == "")
                            break;
                    }
                    else
                        break;
                }
            }
            return column;
        };
        HeatMapGrid.prototype.getIndexByRow = function ($tr) {
            var gridRows = this.getRows(), $gridRows = this._excludeDetailRows(), rowIndex;
            if (this.model.scrollSettings.frozenColumns > 0) {
                rowIndex = $(gridRows[0]).index($tr);
                if (rowIndex == -1)
                    rowIndex = $(gridRows[1]).index($tr);
                return rowIndex;
            } else
                return $gridRows.not(".e-virtualrow").index($tr);
        };
        HeatMapGrid.prototype.getPrimaryKeyFieldNames = function () {
            if (this._primaryKeys.length != 0)
                return this._primaryKeys;
            for (var key = 0, col = this.model.columns, cLen = col.length; key < cLen; key++) {
                if (col[key]["isPrimaryKey"])
                    this._primaryKeys.push(col[key]["field"]);
            }
            return this._primaryKeys;
        };
        HeatMapGrid.prototype.getVisibleColumnNames = function (headerText) {
            return this._visibleColumns;
        };
        HeatMapGrid.prototype.getHiddenColumnNames = function (headerText) {
            return this._hiddenColumns;
        };
        HeatMapGrid.prototype.getColumnByField = function (field) {
            for (var column = 0; column < this.model.columns.length; column++) {
                if (this.model.columns[column]["field"] == field)
                    break;
            }
            return column == this.model.columns.length ? null : this.model.columns[column];
        };
        HeatMapGrid.prototype.getsortColumnByField = function (field) {
            for (var column = 0; column < this.model.sortSettings.sortedColumns.length; column++) {
                if (this.model.sortSettings.sortedColumns[column]["field"] == field)
                    break;
            }
            return column == this.model.sortSettings.sortedColumns.length ? null : this.model.sortSettings.sortedColumns[column];
        };
        HeatMapGrid.prototype.getColumnByHeaderText = function (headerText, field) {
            for (var column = 0; column < this.model.columns.length; column++) {
                if (this.model.columns[column]["headerText"] == headerText) {
                    if (field) {
                        if (ej.isNullOrUndefined(this.model.columns[column]["field"]) || this.model.columns[column]["field"] == "")
                            break;
                    }
                    else
                        break;
                }
            }
            return column == this.model.columns.length ? null : this.model.columns[column];
        };
        HeatMapGrid.prototype.getCurrentViewData = function () {
            return this._currentJsonData;
        };
        HeatMapGrid.prototype.getColumnFieldNames = function () {
            var columnNames = [];
            for (var column = 0; column < this.model.columns.length; column++) {
                if (this.model.columns[column]["field"])
                    columnNames.push(this.model.columns[column]["field"]);
            }
            return columnNames;
        };
        HeatMapGrid.prototype.getBrowserDetails = function () {
            var b = navigator.userAgent.match(/(firefox|mozilla|chrome|opera|msie|safari)\s?\/?(\d+(.\d+)*)/i);
            if (!!navigator.userAgent.match(/Trident\/7\./))
                return { browser: "msie", version: $.uaMatch(navigator.userAgent).version };
            return { browser: b[1].toLowerCase(), version: b[2] };
        };
        HeatMapGrid.prototype._initComplexColumn = function (obj, field, cxField) {
            var complexField = cxField || field;
            for (var field1 in obj) {

                if (typeof obj[field1] == "object" && !ej.isNullOrUndefined(obj[field1])) {
                    complexField = complexField.concat(".").concat(field1);
                    this._initComplexColumn(obj[field1], field1, complexField);
                }
                else {
                    var cxFieldName = (complexField).concat(".").concat(field1), value = obj[field1];;
                    this.model.columns.push({
                        field: cxFieldName,
                        type: value != null ? (value.getDay ? (value.getHours() > 0 || value.getMinutes() > 0 || value.getSeconds() > 0 || value.getMilliseconds() > 0 ? "datetime" : "date") : typeof (value)) : null
                    });
                }
            }
        };
        HeatMapGrid.prototype._initColumns = function (object) {
            while (object.items != undefined)
                object = object.items[0];
            if (this.model.columns.length == 0 && object) {
                for (var field in object) {
                    if (object.hasOwnProperty(field) && (typeof (object[field]) != "object" || object[field] instanceof Date || object[field] == null)) {
                        var value = object[field];
                        this.model.columns.push({
                            field: field,
                            type: value != null ? (value.getDay ? (value.getHours() > 0 || value.getMinutes() > 0 || value.getSeconds() > 0 || value.getMilliseconds() > 0 ? "datetime" : "date") : typeof (value)) : null
                        });
                    }
                    else if (typeof (object[field]) == "object") {
                        this._initComplexColumn(object[field], field);
                    }
                }
                this.model.columns.length && this._renderAfterColumnInitialize();
            } else {
                for (var index = 0; index < this.model.columns.length; index++) {
                    this.model.columns[index].field = ej.isNullOrUndefined(this.model.columns[index].field) ? "" : this.model.columns[index].field;
                    if (!ej.isNullOrUndefined(this.model.columns[index].validationRules))
                        this._validatedColumns.push(this.model.columns[index].field);
                    if (ej.isNullOrUndefined(this.model.columns[index].type)) {
                        var $field = !ej.isNullOrUndefined(this.model.columns[index].field) ? ej.getObject(this.model.columns[index].field, object) : null, coldata = this.model.columns[index].dataSource;
                        if (!!coldata && this.model.columns[index].foreignKeyValue) {
                            this.model.columns[index].originalType = $field != null ? ($field.getDay ? ($field.getHours() > 0 || $field.getMinutes() > 0 || $field.getSeconds() > 0 || $field.getMilliseconds() > 0 ? "datetime" : "date") : typeof ($field)) : null;
                            $field = !(coldata instanceof ej.DataManager) ? ej.getObject("0." + this.model.columns[index].foreignKeyValue, coldata) : ej.getObject("0." + this.model.columns[index].foreignKeyValue, this.model.columns[index].foreignKeyData);
                        }
                        this.model.columns[index].type = $field != null ? ($field.getDay ? ($field.getHours() > 0 || $field.getMinutes() > 0 || $field.getSeconds() > 0 || $field.getMilliseconds() > 0 ? "datetime" : "date") : typeof ($field)) : null;
                    }
                    else if (this.model.columns[index]["type"] == "date" && this.model.columns[index].format == undefined && this._isReorder != true && this.model.allowGrouping != true && !this._showHideColumns)
                        if (ej.isNullOrUndefined(ej.globalize))
                            $.extend(this.model.columns[index], { format: "{0:" + ej.preferredCulture().calendars.standard.patterns.d + "}" });
                        else
                            $.extend(this.model.columns[index], { format: "{0:M/d/yyyy}" });
                    else if (this.model.columns[index]["type"] == "datetime" && this.model.columns[index].format == undefined && this._isReorder != true && this.model.allowGrouping != true && !this._showHideColumns)
                        if (ej.isNullOrUndefined(ej.globalize))
                            $.extend(this.model.columns[index], { format: "{0:" + ej.preferredCulture().calendars.standard.patterns.d + " " + ej.preferredCulture().calendars.standard.patterns.t + "}" });
                        else
                            $.extend(this.model.columns[index], { format: "{0:M/d/yyyy h:mm tt}" });
                }
            }
        };
        HeatMapGrid.prototype._getExpands = function (field, arr) {
            var splits = field.split('.'), tmp = "";
            splits.splice(splits.length - 1, 1);
            for (var i = 0; i < splits.length; i++, tmp = "") {
                for (var j = 0; j < i; j++)
                    tmp += splits[j] + "/";
                tmp = tmp + splits[i];
                if (arr.indexOf(tmp) === -1)
                    arr.push(tmp);
            }
        };
        HeatMapGrid.prototype._ensureDataSource = function (args) {
            if (this._dataSource() == null && !(this._dataSource() instanceof ej.DataManager)) {
                if (!ej.isNullOrUndefined(args) && args.requestType == "add")
                    this.dataSource([]);
                else
                    return;
            }
            this.model.query.requiresCount();
            var queryManagar = this.model.query;
            var cloneQuery = queryManagar.clone();
            if (!(this._dataSource() instanceof ej.DataManager))
                this.model.currentViewData = this._dataSource();
            if (this._isLocalData && (this.model.editSettings.allowEditing || this.model.editSettings.allowAdding) && (!ej.isNullOrUndefined(this._cModifiedData) || !ej.isNullOrUndefined(this._cAddedRecord))) {
                if (ej.isNullOrUndefined(this._cAddedRecord)) {
                    for (var index = 0; index < this._primaryKeys.length; index++)
                        queryManagar = queryManagar.where(this._primaryKeys[index], ej.FilterOperators.equal, this._primaryKeyValues[index]);
                    var currentData = this._dataManager.executeLocal(queryManagar);
                    if (!(this._dataSource() instanceof ej.DataManager))
                        $.extend(this._dataSource()[$.inArray(currentData.result[0], this._dataSource())], this._cModifiedData);
                    else
                        $.extend(this._dataSource().dataSource.json[$.inArray(currentData.result[0], this._dataSource().dataSource.json)], this._cModifiedData);
                    this._cModifiedData = null;
                } else {
                    var tmpRcrd = this._cAddedRecord;
                    this._cAddedRecord = null;
                    (this._dataSource() instanceof ej.DataManager) ? this._dataSource().dataSource.json.unshift(tmpRcrd) : this._dataSource(undefined, true).splice(0, 0, tmpRcrd);
                }
                queryManagar.queries = cloneQuery.queries;
                if (!this.model.editSettings.showAddNewRow)
                    this.model.isEdit = false;
            }
            if (args && this.model.editSettings.allowDeleting && args.requestType == "delete" && (this._excludeDetailRows().length == 1 || (this.multiDeleteMode == "multiple" && this.selectedRowsIndexes.length == this._excludeDetailRows().length)) && this.model.pageSettings.currentPage != 1)
                this._currentPage(this.model.pageSettings.totalPages - 1)
            if (args && this.model.editSettings.allowDeleting && args.requestType == "delete" && !ej.isNullOrUndefined(this._cDeleteData) && this._isLocalData) {
                if (!(this._dataSource() instanceof ej.DataManager)) {
                    var index = $.inArray(this._cDeleteData[0], this._dataSource());
                    this._dataSource(undefined, true).splice(index, 1);
                }
                else {
                    var index = $.inArray(this._cDeleteData[0], this._dataSource().dataSource.json);
                    this._dataSource().dataSource.json.splice(index, 1);
                }
            }
            if (this.model.sortSettings.sortedColumns.length) {
                var sortedGrp = [], sortedColumns = this.model.sortSettings.sortedColumns;
                for (var i = sortedColumns.length - 1; i >= 0; i--) {
                    if (this.model.groupSettings.groupedColumns.indexOf(sortedColumns[i].field) == -1) {
                        queryManagar.sortBy(sortedColumns[i].field, sortedColumns[i].direction);
                        if (this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization && $.inArray(sortedColumns[i], this._prevVirtualSort) == -1) {
                            for (var j = 0; j < this._prevVirtualSort.length; j++) {
                                if (sortedColumns[i].field == this._prevVirtualSort[j].field)
                                    this._prevVirtualSort.splice(j, 1);
                            }
                            this._needVPaging = this._currentVirtualIndex * this._virtualRowCount % this.model.pageSettings.pageSize <= this._virtualRowCount;
                            this._prevVirtualSort.push(sortedColumns[i]);
                            this._virtualDataRefresh = true;
                            this._refreshVirtualViewData();
                        }
                    }
                    else
                        sortedGrp.push({ field: sortedColumns[i].field, direction: sortedColumns[i].direction })
                }
                for (var j = 0; j < sortedGrp.length ; j++) {
                    queryManagar.sortBy(sortedGrp[j].field, sortedGrp[j].direction);
                }
            }
            if (this.model.allowPaging || (this.model.scrollSettings.allowVirtualScrolling && this.model.allowScrolling && !this.model.scrollSettings.enableVirtualization)) {
                if (this._isLocalData) {
                    var fresults = this._dataManager.executeLocal(queryManagar);
                    this._recordsCount = fresults.count;
                    var lastPage = (this._recordsCount % this.model.pageSettings.pageSize == 0) ? (this._recordsCount / this.model.pageSettings.pageSize) : (parseInt(this._recordsCount / this.model.pageSettings.pageSize, 10) + 1);
                    if (this._currentPage() > lastPage)
                        this._currentPage(lastPage);
                } else if (ej.isNullOrUndefined(args)) {
                    this._currentPage(1);
                }
                if (this._currentPage() == 0) {
                    if (this._prevPageNo == 0 || this._prevPageNo == null)
                        this._currentPage(1);
                    else
                        this._currentPage(this._prevPageNo);
                }

                queryManagar.page(this._currentPage(), this.model.pageSettings.pageSize);
            }
            if (this.model.allowScrolling && this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization) {
                this._needPaging = true;
                if (this.initialRender && this.model.currentIndex > 1 && (this.model.currentIndex <= this._getVirtualTotalRecord() || !this._isLocalData)) {
                    if (this.model.scrollSettings.virtualScrollMode == "continuous")
                        this.model.currentIndex = 1;
                    this._currentVirtualIndex = Math.ceil(this.model.currentIndex / this._virtualRowCount);
                    this._isThumbScroll = true;
                    this._currentPage(Math.ceil(this.model.currentIndex / this.model.pageSettings.pageSize));
                    this._virtualLoadedPages.push(this._currentPage());
                }
                if (this._virtualDataRefresh) {
                    this._isThumbScroll = true;
                    this._refreshVirtualViewData(true);
                    this._gridRecordsCount = this._dataSource() !== null ? (this.model.pageSettings.totalRecordsCount == null ? this._dataSource().length : this.model.pageSettings.totalRecordsCount) : 0;
                    this._currentPage(Math.ceil(this._currentVirtualIndex * this._virtualRowCount / this.model.pageSettings.pageSize));
                    this._virtualLoadedPages.push(this._currentPage());
                }
                if (this.model.virtualLoading != null)
                    this._gridRecordsCount = this.model.pageSettings.totalRecordsCount;
                if (this.model.filterSettings.filteredColumns == 0 && this._prevVirtualFilter.length) {
                    this._refreshVirtualViewData();
                    this._prevVirtualFilter = [];
                }
                if (this._isLocalData && this.initialRender)
                    this._refreshVirtualViewDetails();
                this._getVirtualLoadedRecords(queryManagar);
            }
            if (args != undefined && args.requestType == "add" && this._isLocalData && this.model.groupSettings.groupedColumns.length == 0 && this.model.scrollSettings.frozenColumns == 0 && this.model.scrollSettings.frozenRows == 0)
                !(this._dataSource() instanceof ej.DataManager) ? this._dataSource().unshift(args.data) : this._dataSource().dataSource.json.unshift(args.data);
            if ((!ej.isNullOrUndefined(args) && args.action == "add") && !ej.isNullOrUndefined(this.model.parentDetails)) {
                var column = this.getColumnByField(this.model.parentDetails.parentKeyField);
                var ix = $.inArray(column, this.model.columns)
                if (ix == -1) {
                    var newdata = {};
                    newdata[this.model.parentDetails.parentKeyField] = this.model.parentDetails.parentKeyFieldValue;
                    $.extend(true, this.model.currentViewData[0], newdata);
                }
            }
            this._cloneQuery = queryManagar.clone();
            if (this._isLocalData && (!this.model.scrollSettings.enableVirtualization || this._virtualDataRefresh)) {
                var dataMgrJson = this._dataManager.dataSource.json;
                var dataSource = this._dataSource().dataSource;
                if (!ej.isNullOrUndefined(dataSource) && this._dataSource() instanceof ej.DataManager)
                    this._dataManager.dataSource.json = dataMgrJson != dataSource.json ? dataSource.json : dataMgrJson;
                var result = this._dataManager.executeLocal(queryManagar);
                if (this.model.scrollSettings.allowVirtualScrolling && this.model.pageSettings.currentPage == this.model.pageSettings.totalPages - 1)
                    this._prevPageRendered = true;
                if (this.model.scrollSettings.allowVirtualScrolling && !this._prevPageRendered && result.result.length != this.model.pageSettings.pageSize && this.model.pageSettings.totalPages == this.model.pageSettings.currentPage) {
                    var pageQuery = ej.pvt.filterQueries(queryManagar.queries, "onPage");
                    queryManagar.queries.splice($.inArray(pageQuery[0], queryManagar.queries), 1);
                    queryManagar.page(this._currentPage() - 1, this.model.pageSettings.pageSize);
                    var lastPageResult = this._dataManager.executeLocal(queryManagar);
                    lastPageResult.result.splice(0, result.result.length);
                    this._previousPageRecords = $.extend(true, [], lastPageResult.result);
                    this._previousPageLength = result.result.length;
                    this._currentPageData = result.result;
                    ej.merge(lastPageResult.result, result.result);
                    this.model.currentViewData = lastPageResult.result;
                    this._lastPageRendered = true;
                }
                else if (this._lastPageRendered && this.model.pageSettings.currentPage == this.model.pageSettings.totalPages - 1 && !this.model.scrollSettings.enableVirtualization) {
                    var count = this.model.pageSettings.pageSize - this._previousPageLength;
                    for (var dupRow = 0; dupRow < count; dupRow++) {
                        var removeEle = this.getRows()[this.getRows().length - (this.model.pageSettings.pageSize - dupRow)];
                        removeEle.remove();
                    }
                    this._tempPageRendered = true;
                    this.model.currentViewData = result.result;
                }
                else
                    this.model.currentViewData = result.result;
                this._gridRecordsCount = result.count;
                this._remoteSummaryData = result.aggregates;
                this._searchCount = this._searchString.length ? result.count : null;
                this.model.groupSettings.groupedColumns.length && this._setAggregates();
            }
        };
        HeatMapGrid.prototype._refreshViewPageDetails = function () {
            this._currentPage(1);
            this.model.currentIndex = 0;
            this._currentVirtualIndex = 1;
            this.getContent().ejScroller("model.scrollTop", 0);
        };
        HeatMapGrid.prototype._refreshVirtualViewDetails = function (dataRefreshed) {
            if (dataRefreshed)
                this._gridRecordsCount = this._dataSource() !== null ? this._dataSource().length : this.model.pageSettings.totalRecordsCount;
            this._totalVirtualViews = Math.ceil(this._getVirtualTotalRecord() / this._virtualRowCount);
            this._maxViews = Math.ceil(this.model.pageSettings.pageSize / this._virtualRowCount);
            this.model.pageSettings.totalPages = Math.ceil(this._gridRecordsCount / this.model.pageSettings.pageSize);
            this.model.pageSettings.totalRecordsCount = this._gridRecordsCount;
            this._lastViewData = this._virtualRowCount - ((this._totalVirtualViews * this._virtualRowCount) - this._getVirtualTotalRecord());
        };
        HeatMapGrid.prototype._getVirtualLoadedRecords = function (queryManagar) {
            var currentPage = this._currentPage();
            if (this._needPaging) {
                var needTwoPage;
                this._isLastVirtualpage = needTwoPage = this._isThumbScroll && currentPage == this.model.pageSettings.totalPages && !this._virtualPageRecords[currentPage];
                if (this.initialRender || this._virtualDataRefresh) needTwoPage = true;
                if (this.model.virtualLoading && this._isLocalData && (this.model.currentIndex != 0 || currentPage != 1) && this.model.currentIndex < this.model.pageSettings.totalRecordsCount)
                    this._getVirtualOnLoadingData(currentPage, !needTwoPage);
                else
                    this._setVirtualPaging(queryManagar, currentPage, !needTwoPage);
                if (!this.initialRender && this._isThumbScroll && this._virtualPageRecords[currentPage] && !this._virtualDataRefresh)
                    this._checkPrevNextViews(currentPage, queryManagar);
            }
            this._needPaging = false;
            this._setVirtualLoadedIndexes(this._currentVirtualIndex);
            if (this.initialRender && this._isLocalData) {
                this.model.currentViewData = [];
                for (var i = 0; i < this._currentLoadedIndexes.length; i++) {
                    var currentView = this._currentLoadedIndexes[i];
                    if (this._virtualLoadedRecords[currentView])
                        $.merge(this.model.currentViewData, this._virtualLoadedRecords[currentView]);
                }
            }
        };
        HeatMapGrid.prototype._setVirtualPaging = function (queryManagar, currentPage, isCurrentIndex) {
            var pageQuery = ej.pvt.filterQueries(queryManagar.queries, "onPage");
            if (pageQuery.length)
                queryManagar.queries.splice($.inArray(pageQuery[0], queryManagar.queries), 1);
            if ((!isCurrentIndex || this._needVPaging) && this.model.currentIndex > this._virtualRowCount) {
                this._initCurrentIndex(queryManagar, currentPage);
                this._needVPaging = false;
            }
            else
                queryManagar.page(currentPage, this.model.pageSettings.pageSize);
            if (this._isLocalData && !this._virtualPageRecords[currentPage]) {
                var result = this._dataManager.executeLocal(queryManagar);
                if (!this.initialRender) this.model.currentViewData = result.result;
                if (result.result.length) {
                    this._setVirtualLoadedRecords(result.result, currentPage);
                    if ($.inArray(currentPage, this._virtualLoadedPages) == -1)
                        this._virtualLoadedPages.push(currentPage);
                }
                else
                    this.getContent().find(".e-virtualtop, .e-virtualbottom").remove();
            }
        };
        HeatMapGrid.prototype._checkPrevNextViews = function (currentPage) {
            var currentVirtualIndex = this._currentVirtualIndex;
            var prevView = this._virtualLoadedRecords[currentVirtualIndex - 1], nextView = this._virtualLoadedRecords[currentVirtualIndex + 1];
            var adjust = this._maxViews == 3 ? 1 : 2, sTop;
            if (currentVirtualIndex != 1 && currentVirtualIndex != this._totalVirtualViews) {
                if (!prevView || prevView.length != this._virtualRowCount) {
                    var currentIndex = currentVirtualIndex + adjust;
                    this._currentVirtualIndex = this._virtualLoadedRecords[currentVirtualIndex] ? currentIndex : currentIndex + 1;
                    sTop = this._scrollValue + (adjust * this._virtualRowCount * this._vRowHeight);
                }
                else if ((!nextView || nextView.length != this._virtualRowCount) && this._totalVirtualViews != currentVirtualIndex - 1) {
                    var currentIndex = currentVirtualIndex - adjust;
                    this._currentVirtualIndex = this._virtualLoadedRecords[currentVirtualIndex] ? currentIndex : currentIndex - 1;
                    sTop = this._scrollValue - (adjust * this._virtualRowCount * this._vRowHeight);
                }
                if (sTop) {
                    this._scrollValue = sTop;
                    this._setVirtualLoadedIndexes(this._currentVirtualIndex);
                    this.model.currentIndex = sTop == 0 ? sTop : Math.floor(sTop / this._vRowHeight);
                }
            }
        };
        HeatMapGrid.prototype._initCurrentIndex = function (queryManagar, currentPage) {
            var pageResultCount = currentPage * this.model.pageSettings.pageSize;
            var nextDataCount = (this._currentVirtualIndex * this._virtualRowCount) + this._virtualRowCount;
            var prevDataCount = (this._currentVirtualIndex * this._virtualRowCount) - (this._virtualRowCount * 2);
            var needTwoPage = nextDataCount > pageResultCount || prevDataCount < pageResultCount - this.model.pageSettings.pageSize;
            if (needTwoPage || this._isLastVirtualpage) {
                if (nextDataCount > pageResultCount) {
                    var skipValue = (currentPage - 1) * this.model.pageSettings.pageSize, takeValue = this.model.pageSettings.pageSize * 2;
                    this._isInitNextPage = true;
                }
                else if (prevDataCount < pageResultCount - this.model.pageSettings.pageSize || this._isLastVirtualpage) {
                    var skipValue = (currentPage - 2) * this.model.pageSettings.pageSize, takeValue = this.model.pageSettings.pageSize * 2;
                    this._isInitNextPage = false; this._remoteRefresh = true;
                }
                if (this.model.virtualLoading && this._isLocalData) {
                    var args = {};
                    args.endIndex = skipValue + takeValue;
                    args.endIndex = args.endIndex > this._getVirtualTotalRecord() ? this._getVirtualTotalRecord() : args.endIndex;
                    args.startIndex = skipValue;
                    args.currentPage = this._currentPage();
                    args.result = null;
                    this._trigger("virtualLoading", args);
                    var currentData = args.result;
                    this._setInitialCurrentIndexRecords(currentData, currentPage);
                }
                else {
                    queryManagar.skip(skipValue).take(takeValue);
                    if (this._isLocalData) {
                        var result = this._dataManager.executeLocal(queryManagar);
                        var currentData = result.result;
                        this._isLastVirtualpage = false;
                        this._setInitialCurrentIndexRecords(currentData, currentPage);
                    }
                }
            }
            else {
                this._needVPaging = false;
                if (this.model.virtualLoading && this._isLocalData && (this.model.currentIndex != 0 || currentPage != 1))
                    this._getVirtualOnLoadingData(currentPage, true);
                else
                    this._setVirtualPaging(queryManagar, currentPage, true);
            }
        };
        HeatMapGrid.prototype._setInitialCurrentIndexRecords = function (currentData, currentPage) {
            for (var i = 0; i < 2; i++) {
                var start = i * this.model.pageSettings.pageSize, end = start + this.model.pageSettings.pageSize;
                var data = currentData.slice(start, end), page;
                if (this._isInitNextPage)
                    page = i == 0 ? currentPage : currentPage + 1;
                else
                    page = i == 0 ? currentPage - 1 : currentPage;
                this._setVirtualLoadedRecords(data, page);
            }
        };
        HeatMapGrid.prototype._getVirtualOnLoadingData = function (currentPage, isCurrentIndex) {
            if (currentPage > 0) {
                if (this.model.currentIndex > this._virtualRowCount && (!isCurrentIndex || this._needVPaging) && this.model.currentIndex < this.model.pageSettings.totalRecordsCount)
                    this._initCurrentIndex(undefined, currentPage);
                else {
                    var args = {};
                    args.endIndex = (currentPage * this.model.pageSettings.pageSize) > this._gridRecordsCount ? this._gridRecordsCount : currentPage * this.model.pageSettings.pageSize;
                    args.startIndex = (currentPage * this.model.pageSettings.pageSize) - this.model.pageSettings.pageSize;
                    args.currentPage = this._currentPage(); args.result = null;
                    this._trigger("virtualLoading", args);
                    var currentData = args.result;
                    this._setVirtualLoadedRecords(currentData, currentPage);
                }
            }
        };
        HeatMapGrid.prototype._setVirtualLoadedRecords = function (currentData, currentPage) {
            var virtualRowCount = this._virtualRowCount, pageSize = this.model.pageSettings.pageSize;
            var pageIndex = pageSize / virtualRowCount, prevIndex;
            var maxIndex = Math.ceil(currentPage * pageSize / virtualRowCount);
            var lastPage = currentPage == this.model.pageSettings.totalPages;
            if (!this._virtualPageRecords[currentPage])
                this._virtualPageRecords[currentPage] = currentData;
            if (lastPage) {
                var lastPageData = this._getVirtualTotalRecord() % pageSize;
                if ((!this._virtualLoadedRecords[this._totalVirtualViews] || this._virtualLoadedRecords[this._totalVirtualViews].length != this._lastViewData) && lastPageData < this._lastViewData && lastPageData != 0)
                    maxIndex = this._totalVirtualViews + 1;
                else
                    maxIndex = this._totalVirtualViews;
                if (this._getVirtualTotalRecord() < virtualRowCount)
                    this._singleView = true;
            }
            for (var i = 0; i < pageIndex; i++) {
                var startIndex, endIndex;
                var viewIndex = Math.ceil((currentPage - 1) * pageIndex + (i + 1));
                if ((viewIndex <= this._totalVirtualViews || lastPage) && viewIndex <= maxIndex) {
                    if (this._virtualLoadedRecords[viewIndex - 1] && this._virtualLoadedRecords[viewIndex - 1].length != virtualRowCount) {
                        var start = this._virtualLoadedRecords[viewIndex - 1].length + (i * virtualRowCount);
                        startIndex = virtualRowCount - start + (i * virtualRowCount);
                        $.merge(this._virtualLoadedRecords[viewIndex - 1], currentData.slice(0, startIndex));
                        prevIndex = endIndex = startIndex + virtualRowCount;
                        if (viewIndex <= this._totalVirtualViews)
                            this._virtualLoadedRecords[viewIndex] = currentData.slice(startIndex, prevIndex);
                    }
                    else {
                        if (viewIndex != 1 && !this._virtualLoadedRecords[viewIndex - 1]) {
                            var prevEnd = endIndex = (viewIndex - 1) * virtualRowCount % pageSize;
                            if (prevEnd != 0)
                                this._virtualLoadedRecords[viewIndex - 1] = currentData.slice(0, prevEnd);
                            startIndex = prevEnd, endIndex = prevIndex = prevEnd + virtualRowCount;
                        }
                        else {
                            startIndex = prevIndex ? prevIndex : i * virtualRowCount % pageSize;
                            prevIndex = endIndex = startIndex + virtualRowCount;
                        }
                    }
                    if (this._virtualLoadedRecords[viewIndex] && this._virtualLoadedRecords[viewIndex].length != virtualRowCount) {
                        var data = currentData.slice(startIndex, endIndex);
                        if (data.length + this._virtualLoadedRecords[viewIndex].length <= virtualRowCount) {
                            var viewData = $.merge(data, this._virtualLoadedRecords[viewIndex]);
                            this._virtualLoadedRecords[viewIndex] = viewData;
                        }
                    }
                    else if (!this._virtualLoadedRecords[viewIndex] && viewIndex <= this._totalVirtualViews)
                        this._virtualLoadedRecords[viewIndex] = currentData.slice(startIndex, endIndex);
                }
            }
            if ($.inArray(currentPage, this._virtualLoadedPages) == -1)
                this._virtualLoadedPages.push(currentPage);
        };
        HeatMapGrid.prototype._setVirtualLoadedIndexes = function (currentIndex) {
            this._currentLoadedIndexes = [];
            var virtualCount = currentIndex == this._totalVirtualViews ? currentIndex : currentIndex + 1;
            if (currentIndex != 1)
                currentIndex = currentIndex - 1;
            for (var i = currentIndex; i <= virtualCount; i++) {
                this._currentLoadedIndexes.push(i);
            }
        };
        HeatMapGrid.prototype._getVirtualTotalRecord = function () {
            var recordCount = this.model.filterSettings.filteredColumns.length == 0 ? this._searchCount == null ? this._gridRecordsCount : this._searchCount : this._filteredRecordsCount;
            return recordCount;
        };
        HeatMapGrid.prototype._initGridRender = function (heatmap) {

            this.addInitTemplate();
            if (this.model.scrollSettings.frozenColumns > 0)
                this.addFrozenTemplate();
            this.model.allowGrouping && this.addGroupingTemplate();
            this.model.showSummary && this.addSummaryTemplate();

            if (this.model.keySettings)
                $.extend(this.model.keyConfigs, this.model.keySettings);
            this.render();
            this._setTextWrap();
            this._wireEvents(heatmap);
            this.initialRender = false;
            if (this.model.width && !this.model.allowScrolling)
                this.element.width(this.model.width);
            if (this.model.editSettings.allowEditing || this.model.editSettings.allowAdding)
                this._processEditing();
            //this._trigger("dataBound", {});
            //this._trigger("refresh");
            if (this.model.parentDetails) {  //refreshes parent scroller on child expand
                var id = this.model.parentDetails.parentID, parentObj = $("#" + id).data("ejGrid");
                parentObj.model.allowScrolling && parentObj._refreshScroller({ requestType: "refresh" });
            }
            if (this.element.closest('tr').hasClass('e-detailrow') && !this.model.parentDetails) {
                var parentObj = this.element.closest('tr.e-detailrow').closest('.e-grid').data("ejGrid");
                parentObj.model.allowScrolling && parentObj.getScrollObject().refresh();
            }
        };
        HeatMapGrid.prototype._setTextWrap = function () {
            if (this.model.allowTextWrap == true) {
                switch (this.model.textWrapSettings.wrapMode) {
                    case "content":
                        this.element.find(".e-columnheader").removeClass("e-wrap");
                        this.element.removeClass("e-wrap");
                        this.getContent().addClass("e-wrap");
                        break;
                    case "header":
                        this.element.removeClass("e-wrap");
                        this.getContent().removeClass("e-wrap");
                        this.element.find(".e-columnheader").addClass("e-wrap");
                        break;
                    default:
                        this.getContent().removeClass("e-wrap");
                        this.element.find(".e-columnheader").removeClass("e-wrap");
                        this.element.addClass("e-wrap");
                        break;
                }
            }
            else {
                this.getContent().removeClass("e-wrap");
                this.element.find(".e-columnheader").removeClass("e-wrap");
                this.element.removeClass("e-wrap");
            }
        };
        HeatMapGrid.prototype._getMetaColGroup = function () {
            var $colgroup = ej.buildTag("colgroup");
            for (var i = 0; i < this.model.columns.length; i++) {
                var $col = $(document.createElement("col"));
                this.model.columns[i]["visible"] === false && $col.css("display", "none");
                if (this.model.rowTemplate != null && !ej.isNullOrUndefined(this.model.columns[i]["cssClass"]))
                    $col.addClass(this.model.columns[i]["cssClass"]);
                if (this.model.allowGrouping && !this.model.groupSettings.showGroupedColumn && $.inArray(this.model.columns[i]["field"], this.model.groupSettings.groupedColumns) != -1)
                    $col.css("display", "none");
                $colgroup.append($col);
            }
            return $colgroup;
        };
        HeatMapGrid.prototype._alternateRow = function () {
            return this.getIndex() % 2 == 0 ? "e-row" : "e-alt_row";
        };
        HeatMapGrid.prototype.formatting = function (formatstring, str, locale) {
            formatstring = formatstring.replace(/%280/g, "\"").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
            locale = ej.preferredCulture(locale) ? locale : "en-US";
            var s = formatstring;
            var frontHtmlidx, FrontHtml, RearHtml, lastidxval;
            frontHtmlidx = formatstring.split("{0:");
            lastidxval = formatstring.split("}");
            FrontHtml = frontHtmlidx[0];
            RearHtml = lastidxval[1];
            if (typeof (str) == "string" && $.isNumeric(str))
                str = Number(str);
            if (formatstring.indexOf("{0:") != -1) {
                var toformat = new RegExp("\\{0(:([^\\}]+))?\\}", "gm");
                var formatVal = toformat.exec(formatstring);
                if (formatVal != null && str != null) {
                    if (FrontHtml != null && RearHtml != null)
                        str = FrontHtml + ej.format(str, formatVal[2], locale) + RearHtml;
                    else
                        str = ej.format(str, formatVal[2], locale);
                } else if (str != null)
                    str = str;
                else
                    str = "";
                return str;
            } else if (s.startsWith("{") && !s.startsWith("{0:")) {
                var fVal = s.split(""), str = (str || "") + "", strSplt = str.split(""), formats = /[0aA\*CN<>\?]/gm;
                for (var f = 0, f, val = 0; f < fVal.length; f++)
                    fVal[f] = formats.test(fVal[f]) ? "{" + val++ + "}" : fVal[f];
                return String.format.apply(String, [fVal.join("")].concat(strSplt)).replace('{', '').replace('}', '');
            } else if (this.data != null && this.data.Value == null) {
                $.each(this.data, function (dataIndex, dataValue) {
                    s = s.replace(new RegExp('\\{' + dataIndex + '\\}', 'gm'), dataValue);
                });
                return s;
            } else {
                return this.data.Value;
            }
        };
        HeatMapGrid.prototype.addInitTemplate = function () {
            var headerCellDiv = this.element.find(".e-headercelldiv:not(.e-emptyCell)"), templates = {}, firstVisible = true;
            var tbody = document.createElement('tbody'), $tbody = $(tbody);
            if (this.model.rowTemplate == null) {
                var tr = document.createElement('tr'),
                    $tr = $(tr),
                    columns = this.model.columns,
                    i;
                if (this._gridRecordsCount && !this._virtualDataRefresh)
                    this._initColumns(this.model.currentViewData[0] != undefined ? this.model.currentViewData[0] : this.model.currentViewData.value);
                else if (this._isLocalData && (this._dataSource() != null && this._dataSource().length || (this._dataManager && this._dataManager.dataSource.json.length)))
                    this._initColumns(this._dataSource()[0] != undefined ? this._dataSource()[0] : this._dataManager.dataSource.json[0]);
                var helpers = { _gridFormatting: this.formatting };

                $.views.helpers(helpers);

                var viewHelper = {};
                viewHelper["_foreignKey"] = this._foreignKeyBinding;
                $.views.helpers(viewHelper);

                if (this.model.childGrid || this.model.detailsTemplate) {
                    var $tdDetailCell = ej.buildTag("td.e-detailrowcollapse", "<div class='e-icon e-gnextforward'></div>");
                    $tr.append($tdDetailCell);
                }
                for (i = 0; i < this.model.columns.length; i++) {
                    var $tdCell = ej.buildTag("td.e-rowcell");
                    if (!ej.isNullOrUndefined(columns[i]["tooltip"]) || columns[i]["clipMode"] == ej.HeatMapGrid.ClipMode.EllipsisWithTooltip)
                        $tdCell.addClass("e-gridtooltip")
                    if (columns[i]["clipMode"] == ej.HeatMapGrid.ClipMode.Ellipsis || columns[i]["clipMode"] == ej.HeatMapGrid.ClipMode.EllipsisWithTooltip)
                        $tdCell.addClass("e-gridellipsis");
                    if (this.model.isResponsive)
                        $tdCell.attr("data-cell", this._decode(this.model.columns[i]["headerText"]));
                    if (columns[i]["visible"] == false)
                        $tdCell.addClass("e-hide");
                    else {
                        if (firstVisible && (this.model.detailsTemplate != null || this.model.childGrid != null))
                            $tdCell.addClass('e-detailrowvisible');
                        firstVisible = false;
                    }
                    !this.model.groupSettings.showGroupedColumn && $tdCell.addClass("{{for ~groupedColumns}}" +
                        " {{if #data == '" + this.model.columns[i]["field"] + "'}}e-hide{{/if}}" +
                        "{{/for}}");
                    if (!ej.isNullOrUndefined(columns[i]["templateID"] || columns[i]["template"])) {
                        var viewHelper = {}, index, htxt = columns[i].headerText;
                        viewHelper["_" + this._id + "ColumnTemplating"] = ej.proxy(this._gridTemplate, null, this, index);
                        $.views.helpers(viewHelper);
                        if (!ej.isNullOrUndefined(htxt) && !ej.isNullOrUndefined(htxt.match(/[^0-9\s\w]/g)))
                            htxt = htxt.replace(/[^0-9\s\w]/g, "_");
                        $("#" + this._id + htxt + i + "_Template").remove();
                        var scriptElement = this._createTemplateElement(columns[i]);
                        if ((columns[i].field == "") || ej.isNullOrUndefined(columns[i].field))
                            this.model.columns[i]["allowGrouping"] = this.model.columns[i]["allowFiltering"] = this.model.columns[i]["allowSorting"] = false;
                        if (columns[i]["template"] != false)
                            $tdCell.addClass("e-templatecell").html("{{:~_" + this._id + "ColumnTemplating('" + scriptElement.id + "','" + i + "')}}");
                    } else {
                        var splits = (columns[i].field || "").split("."), sLen = splits.length - 1, braces = "";
                        while (sLen) {
                            braces += "(";
                            sLen--;
                        }
                        var columnType = columns[i].type || columns[i].editType
                        switch (columnType) {
                            default:
                                if (columns[i].disableHtmlEncode)
                                    $tdCell.html("{{html:" + braces + "#data['" + splits.join("'] || {})['") + "']}}");
                                else
                                    $tdCell.html("{{:" + braces + "#data['" + splits.join("'] || {})['") + "']}}");
                        }
                        if (columns[i]["format"] != undefined && (!columns[i]["foreignKeyValue"]))
                            $tdCell.html("{{:~_gridFormatting('" + columns[i]["format"] + "'," + braces + "#data['" + splits.join("'] || {})['") + "'],'" + this.model.locale + "')}}");
                        if (columns[i]["foreignKeyValue"] && columns[i]["dataSource"]) {
                            $tdCell.html("{{:~_foreignKey(" + i + "," + braces + "#data['" + splits.join("'] || {})['") + "'],'" + this._id + "')}}");
                        }
                        if (columns[i]["commands"]) {
                            var viewHelper = {};

                            $.views.helpers(viewHelper);
                            if ((ej.isNullOrUndefined(columns[i]["field"])) || (columns[i].field == ""))
                                this.model.columns[i]["allowGrouping"] = this.model.columns[i]["allowFiltering"] = this.model.columns[i]["allowSorting"] = false;
                            if (!ej.isNullOrUndefined(columns[i].headerText))
                                $("#" + this._id + columns[i].headerText.replace(/[^a-z0-9|s_]/gi, '') + "_UnboundTemplate").remove();
                            var divElement = this._createUnboundElement(columns[i]);
                            if (!ej.isNullOrUndefined(columns[i].headerText))
                                $tdCell.addClass("e-unboundcell").addClass("e-" + columns[i]["headerText"].replace(/[^a-z0-9|s_]/gi, '') + i).html("{{:~_" + this._id + "UnboundTemplate('" + divElement.id + "')}}");
                            this.model.scrollSettings.frozenColumns > 0 && $tdCell.addClass("e-frozenunbound");
                            this._isUnboundColumn = true;
                        }

                    }
                    if (columns[i]["textAlign"] == undefined)
                        columns[i]["textAlign"] = "left";
                    if (columns[i]["isPrimaryKey"] === true) {
                        this._primaryKeys.push($.trim(columns[i].field));
                        this._primaryKeys = $.unique(this._primaryKeys);
                    }
                    if (!(this.phoneMode && this.model.enableResponsiveRow) && columns[i]["textAlign"] != undefined) {
                        $tdCell.css("text-align", columns[i]["textAlign"]);
                        $(headerCellDiv[i]).css("text-align", columns[i]["textAlign"]);
                    }
                    if (!this.phoneMode && !ej.isNullOrUndefined(columns[i]["headerTextAlign"])) {
                        $(headerCellDiv[i]).css("text-align", columns[i]["headerTextAlign"]);
                    }
                    if (!ej.isNullOrUndefined(columns[i]["cssClass"])) {
                        $tdCell.addClass(columns[i]["cssClass"]);
                    }
                    if (!ej.isNullOrUndefined(columns[i]["priority"]))
                        $tdCell.addClass("e-table-priority-" + columns[i]["priority"]);
                    if (!ej.isNullOrUndefined(columns[i]["customAttributes"]))
                        $tdCell.attr(columns[i]["customAttributes"]);

                    $tdCell.addClass("sf-ht-heatmapcell");
                    $tdCell.attr("data-role", "heatmapcell");
                    $tr.append($tdCell);
                    if (this.model.enableAltRow) {
                        helpers["_" + this._id + "AlternateRow"] = this._alternateRow;
                        $.views.helpers(helpers);
                        $tr.addClass("{{:~_" + this._id + "AlternateRow()}}");
                    }
                    else
                        $tr.addClass("e-row");
                    $tr.attr("data-role", "row");
                    if (this.model.scrollSettings.frozenColumns > 0 && this.model.scrollSettings.frozenColumns == i + 1) {
                        tbody.appendChild(tr);
                        templates[this._id + "_JSONFrozenTemplate"] = $tbody.html();
                        $tr.empty();
                        $tbody.empty();
                    }
                }
                tbody.appendChild(tr);
            }
            templates[this._id + "_JSONTemplate"] = this.model.rowTemplate != null ? $(this.model.rowTemplate).html() : $tbody.html();
            $.templates(templates);
        };
        HeatMapGrid.prototype.render = function () {
            this.model.showSummary = this.model.summaryRows.length > 0 || this.model.showSummary;
            this._renderGridContent().insertAfter(this.element.children(".e-gridheader"));
            this.model.allowResizeToFit && this.setWidthToColumns();
            this._initialEndRendering();
        };
        HeatMapGrid.prototype._createStackedRow = function (stackedHeaderRow, frozenHeader) {
            var $tr = ej.buildTag('tr.e-columnheader e-stackedHeaderRow');
            var sHeader = [], sCss = [], tAl = [], tp = [];
            for (var c = 0; c < this.model.columns.length; c++) {
                var column = this.model.columns[c];
                if (column.visible != false) {
                    if (this.model.allowGrouping && !this.model.groupSettings.showGroupedColumn && this.model.groupSettings.groupedColumns.length > 0) {
                        if ($.inArray(column.field, this.model.groupSettings.groupedColumns) != -1)
                            continue;
                    }
                    var headerText = '', cssClass = '', txtAlign = '', ttp = "";
                    var sColumn = stackedHeaderRow.stackedHeaderColumns;
                    for (var col = 0; col < sColumn.length; col++) {
                        var _column = Array.isArray(sColumn[col].column) ? sColumn[col].column : $.map(sColumn[col].column.split(","), $.trim),
                            className = "e-row" + $.inArray(stackedHeaderRow, this.model.stackedHeaderRows) + "-column" + col;
                        if ($.inArray(column.field, _column) != -1) {
                            headerText = sColumn[col].headerText;
                            cssClass = sColumn[col]["cssClass"];
                            txtAlign = sColumn[col].textAlign;
                            ttp = sColumn[col]["tooltip"] ? " e-gridtooltip " + className : '';
                        }
                    }
                    sHeader.push(headerText);
                    sCss.push(cssClass);
                    tAl.push(txtAlign);
                    tp.push(ttp);
                }
            }
            var colsPanList = []
            for (var i = 0; i < sHeader.length; i++) {
                var colSpan = 1;
                for (var j = i + 1; j < sHeader.length; j++) {
                    if (sHeader[i] == sHeader[j]) {
                        colSpan++;
                    }
                    else
                        break;
                }
                colsPanList.push({ sapnCount: colSpan, headerText: sHeader[i], cssClass: sCss[i], txtAlign: tAl[i], tooltip: tp[i] });
                i += colSpan - 1;
            }
            var $tr = ej.buildTag('tr.e-columnheader e-stackedHeaderRow');
            var frzCol = this.model.scrollSettings.frozenColumns;
            if (this.model.allowScrolling && frzCol > 0) {
                var frozenColspanList = [];
                var forzenColumn = 0, index = 0, frzHideCol = 0;
                for (var i = 0; i < this.model.columns.length; i++) {
                    var col = this.model.columns[i];
                    if (i < frzCol && col.visible == false)
                        frzHideCol++;
                }
                forzenColumn = frzCol - frzHideCol;
                while (forzenColumn > 0) {
                    var spanC = colsPanList[index].sapnCount;
                    if (colsPanList[index].sapnCount < forzenColumn) {
                        frozenColspanList.push(colsPanList[index])
                        if (!frozenHeader)
                            colsPanList.splice(index, 1);
                        else
                            index++;
                    }
                    else if (colsPanList[index].sapnCount > forzenColumn) {
                        colsPanList[index].sapnCount = colsPanList[index].sapnCount - forzenColumn
                        if (frozenHeader)
                            frozenColspanList.push({ sapnCount: forzenColumn, headerText: colsPanList[index].headerText });
                    }
                    else {
                        frozenColspanList.push(colsPanList[index])
                        if (!frozenHeader)
                            colsPanList.splice(index, 1);
                    }
                    forzenColumn -= spanC;
                }
                if (frozenHeader)
                    colsPanList = frozenColspanList
            }
            if (this.model.detailsTemplate || this.model.childGrid)
                $tr.append(ej.buildTag('th.e-headercell e-detailheadercell', '<div></div>'));
            for (var c = 0; c < colsPanList.length; c++) {
                var $th = ej.buildTag('th.e-headercell e-stackedHeaderCell e-default' + colsPanList[c].tooltip, colsPanList[c].headerText, {}, { 'colspan': colsPanList[c].sapnCount });
                $th.css("textAlign", colsPanList[c].txtAlign);
                $tr.append($th);
                if (colsPanList[c]["cssClass"] != undefined)
                    $th.addClass(colsPanList[c]["cssClass"]);
            }
            return $tr;
        };
        HeatMapGrid.prototype._renderGridContent = function () {
            var $div = ej.buildTag('div.e-gridcontent');
            var $innderDiv = ej.buildTag('div');
            var $table = ej.buildTag('table.e-table', "");
            var $tbody = $(document.createElement('tbody'));
            $table.append(this.getHeaderTable().find('colgroup').clone()).append($tbody);
            $innderDiv.html($table);
            $div.html($innderDiv);
            this.setGridContentTable($table);
            this.setGridContent($div);
            $table.attr("data-role", "heatmap");
            var args = {};
            if (this.model.allowGrouping && this.model.groupSettings.groupedColumns.length) {
                if (this.initialRender) {
                    args.columnName = this.model.groupSettings.groupedColumns[this.model.groupSettings.groupedColumns.length - 1];
                    if (!this.model.groupSettings.showGroupedColumn) {
                        for (var i = 0; i < this.model.groupSettings.groupedColumns.length; i++) {
                            var col = this.model.groupSettings.groupedColumns[i];
                            if ($.inArray(col, this._hiddenColumnsField) == -1) {//updated for
                                this._hiddenColumnsField.push(col);//updated for
                                this.getColumnByField(col).visible = false;
                            }
                        }
                    }
                }
                args.requestType = ej.HeatMapGrid.Actions.Grouping;
            } else
                args.requestType = ej.HeatMapGrid.Actions.Refresh;
            if (this._dataSource() == null || this._dataSource().length == 0 || this.model.currentViewData.length == 0) {
                var $emptyTd = ej.buildTag('td.emptyrecord', this.localizedLabels.EmptyRecord, {}, { colSpan: this.model.columns.length });
                $tbody.append($(document.createElement("tr")).append($emptyTd));
                this.setWidthToColumns();
                if (this.initialRender)
                    this.sendDataRenderingRequest(args)
            } else
                this.sendDataRenderingRequest(args);
            if (this._isCaptionSummary && args.requestType == "grouping" && this.model.groupSettings.groupedColumns.length > 1) {
                var colgroup = this.getContentTable().find(".e-table").not(".e-recordtable").children("colgroup");
                var $cols1 = $(this.getContentTable().find(".e-recordtable")[0]).children("colgroup").find("col");
                for (i = 0; i < colgroup.length; i++) {
                    var colCount = $(colgroup[i]).find("col").length;
                    $(colgroup[i]).find("col:gt(" + (colCount - $cols1.length - 1) + ")").remove();
                    $(colgroup[i]).append($cols1.clone());
                }
            }
            return $div;
        };



        HeatMapGrid.prototype.sendDataRenderingRequest = function (args) {
            if (this._templateRefresh) {
                this.refreshTemplate();
                this._templateRefresh = false;
            }
            this.setFormat();
            if (!this.model.scrollSettings.enableVirtualization) {
                this._previousColumnIndex = null;
                this._previousRowCellIndex = null;
                this._previousIndex = null;
            }
            if (args.requestType == "add" || args.requestType == "grouping" || (this.model.currentViewData != null && this.model.currentViewData.length)) {
                switch (args.requestType) {
                    case ej.HeatMapGrid.Actions.Refresh:
                    case ej.HeatMapGrid.Actions.Paging:
                    case ej.HeatMapGrid.Actions.Sorting:
                    case ej.HeatMapGrid.Actions.Filtering:
                    case ej.HeatMapGrid.Actions.Save:
                    case ej.HeatMapGrid.Actions.Cancel:
                    case ej.HeatMapGrid.Actions.Delete:
                    case ej.HeatMapGrid.Actions.Search:
                    case ej.HeatMapGrid.Actions.Reorder:
                    case ej.HeatMapGrid.Actions.BatchSave:
                        var cloneGroupedColumns = this.model.groupSettings.groupedColumns
                        if (this.model.allowGrouping && args.requestType == ej.HeatMapGrid.Actions.Refresh && cloneGroupedColumns.length == 0 && this.element.find(".e-grouptopleftcell").length > 0) {
                            var $header = this.element.children(".e-gridheader");
                            $header.find("div").first().empty().append(this._renderGridHeader().find("table"));
                        }
                        if (!this.model.allowGrouping)
                            cloneGroupedColumns = [];
                        if (this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate")
                            $("#" + this._id + "_externalEdit").css("display", "none");
                        if (cloneGroupedColumns.length == 0) {
                            var temp = document.createElement('div'), temp1, insertIndex = -1, isRemoteAdaptor = false;
                            if (!this.phoneMode)
                                this.getContentTable().find("colgroup").first().replaceWith(this._getMetaColGroup());
                            (this.model.childGrid != null || this.model.detailsTemplate != null) && this.getContentTable().find("colgroup").first().prepend(this._getIndentCol());
                            var currentPage = this._currentPage();
                            if ((this.model.editSettings.editMode == "inlineform" || this.model.editSettings.editMode == "inlineformtemplate" || this.model.editSettings.editMode == "normal") && (args.requestType == "cancel" || args.requestType == "save"))
                                this._editFormHeight = this.element.find(".gridform").closest("tr").height();

                            if (this.model.scrollSettings.frozenColumns > 0)
                                temp.innerHTML = this._renderByFrozenDesign();
                            else {
                                if (args.data) {
                                    temp1 = document.createElement('div');
                                    temp1.innerHTML = ['<table>', $.render[this._id + "_JSONTemplate"](args.data), '</table>'].join("");
                                    if (this._dataSource() instanceof ej.DataManager && args.requestType == ej.HeatMapGrid.Actions.Save) {
                                        insertIndex = this._getDataIndex(this.model.currentViewData, args.data);
                                        isRemoteAdaptor = this._dataSource().adaptor instanceof ej.remoteSaveAdaptor;
                                    }
                                }
                                temp.innerHTML = ['<table>', $.render[this._id + "_JSONTemplate"](this.model.currentViewData), '</table>'].join("");
                                var tableEle = this.getContentTable().get(0);
                                var tbodyEle = tableEle.lastChild;
                                var rindex = this.getContentTable().first().find('tbody').first();
                                if ((args.requestType == "save" || args.requestType == "cancel") && this.model.editSettings.editMode != "batch") {
                                    if (this.model.editSettings.editMode.indexOf("inlineform") != -1)
                                        var rowIndex = !ej.isNullOrUndefined(args.selectedRow) ? args.selectedRow : this._selectedRow();
                                    else
                                        var rowIndex = this.getContentTable().find('.e-' + args.action + 'edrow').index();
                                    var a = this._currentTrIndex;
                                    if (rowIndex == -1)
                                        rowIndex = a;
                                    if (this.model.detailsTemplate != null || this.model.childGrid != null) {
                                        if (this.model.editSettings.editMode == "inlineform")
                                            var rowTr = $($(tbodyEle.childNodes).not('.e-detailrow')[rowIndex]);
                                        else
                                            var rowTr = $(tbodyEle.childNodes[rowIndex]);
                                        var rowEle = $(tbodyEle.childNodes).not('.e-detailrow');
                                        for (var i = 0; i < rowEle.length; i++) {
                                            if (rowTr.is(rowEle[i]))
                                                rowIndex = i;
                                        }
                                    }

                                    if (this.model.editSettings.editMode == "normal" || this.model.editSettings.editMode == "inlineform" || this.model.editSettings.editMode == "inlineformtemplate") {
                                        if (args.action == "add" && !this.getContentTable().find(".e-addedrow").length) break;
                                        var $oldChild = this.getContentTable().find('.e-addedrow').get(0);
                                        var $editedTr = this.getContentTable().find('.e-editedrow');
                                        var $newChild = ($editedTr.length || args.requestType == "cancel") ? temp.firstChild.firstChild.firstChild : temp1.firstChild.firstChild.lastChild;
                                        if ($editedTr.length) {
                                            if (this.model.editSettings.showAddNewRow && this.model.editSettings.rowPosition == "top")
                                                rowIndex = rowIndex - 1;
                                            $newChild = temp.firstChild.firstChild.childNodes[rowIndex];
                                            if (this.model.editSettings.editMode == "inlineform" || this.model.editSettings.editMode == "inlineformtemplate") {
                                                $oldChild = $editedTr.prev('tr').get(0);
                                                $editedTr.remove();
                                            } else
                                                $oldChild = $editedTr.get(0);
                                            var $newChildObj = $($newChild), $oldChildObj = $($oldChild);
                                            if ((this.model.detailsTemplate != null || this.model.childGrid != null) && $oldChildObj.next('tr.e-detailrow:visible').length) {
                                                var $target = $newChildObj.find('.e-detailrowcollapse');
                                                $target.removeClass("e-detailrowcollapse").addClass("e-detailrowexpand").find("div").removeClass("e-gnextforward").addClass("e-gdiagonalnext");
                                            }
                                            if (args.requestType == "cancel") {
                                                if (this.model.editSettings.showAddNewRow)
                                                    this.getContentTable().find('.e-addedrow').addClass("e-showaddrow");
                                                $oldChildObj.replaceWith($newChildObj);
                                            } else if (!ej.isNullOrUndefined(this._filteredRecordsCount) && this._filteredRecordsCount < this._previousFilterCount) {
                                                if (this.model.detailsTemplate != null && $oldChildObj.next('tr.e-detailrow').length)
                                                    tbodyEle.removeChild($oldChildObj.next('tr.e-detailrow').get(0));
                                                $oldChildObj.remove();
                                                if (this.model.allowPaging && this.model.pageSettings.pageSize <= this.model.currentViewData.length && cloneGroupedColumns.length == 0)
                                                    tbodyEle.appendChild(temp.firstChild.firstChild.lastChild);
                                            } else if (this.model.sortSettings.sortedColumns.length && args.requestType == "save" && this._currentJsonData.length > 0 || !ej.isNullOrUndefined(this._searchCount))
                                                this.getContentTable().get(0).replaceChild(this.model.rowTemplate != null ? temp.firstChild.lastChild : temp.firstChild.firstChild, this.getContentTable().get(0).lastChild);
                                            else {
                                                tbodyEle.replaceChild($newChild, $oldChild);
                                            }
                                        } else {
                                            var $newChildObj = $($newChild), $oldChildObj = $($oldChild);
                                            if (args.action == "add" && args.requestType == "save" && this.model.editSettings.showAddNewRow && this.model.allowPaging && this.model.pageSettings.pageSize <= this._currentJsonData.length)
                                                this.model.editSettings.rowPosition == "bottom" ? tbodyEle.lastChild.previousSibling.remove() : tbodyEle.lastChild.remove();
                                            if (args.requestType == "cancel" || this._dataSource() instanceof ej.DataManager || this._currentPage() != 1 || (args.requestType == "save" && !ej.isNullOrUndefined(this._filteredRecordsCount) && this._filteredRecordsCount == this._previousFilterCount)) {
                                                if (!ej.isNullOrUndefined($oldChild)) {
                                                    $oldChildObj.remove();
                                                    if (this._dataSource() instanceof ej.DataManager && insertIndex != -1) {
                                                        if (insertIndex == 0)
                                                            tbodyEle.insertBefore($newChild, tbodyEle.children[insertIndex]);
                                                        else
                                                            $newChildObj.insertAfter(tbodyEle.children[insertIndex - 1]);
                                                    }
                                                    else if ((!(this._dataSource() instanceof ej.DataManager) || isRemoteAdaptor) && this._currentPage() != 1 && args.requestType == "save")
                                                        $(tbodyEle).prepend($(temp.firstChild.firstChild.firstChild));
                                                    if (this.model.allowPaging && this.model.pageSettings.pageSize <= this.model.currentViewData.length && cloneGroupedColumns.length == 0 &&
                                                        ((this._dataSource() instanceof ej.DataManager && insertIndex == -1 && (!isRemoteAdaptor && args.requestType != "save")) ||
                                                        (args.requestType != "save" && !(this._dataSource() instanceof ej.DataManager))) && (args.requestType == "cancel" && !this.model.editSettings.showAddNewRow))
                                                        tableEle.lastChild.appendChild(temp.firstChild.firstChild.lastChild);
                                                }
                                                if (args.requestType == "cancel" && this._selectedRow() != -1)
                                                    this.clearSelection();

                                            } else if (this.model.currentViewData.length == 1) {
                                                $(tbodyEle).empty();
                                                tbodyEle.appendChild($newChild);
                                            } else if (this.model.sortSettings.sortedColumns.length && args.requestType == "save" && this._currentJsonData.length > 0 || !ej.isNullOrUndefined(this._searchCount)) {
                                                this.getContentTable().get(0).replaceChild(this.model.rowTemplate != null ? temp.firstChild.lastChild : temp.firstChild.firstChild, this.getContentTable().get(0).lastChild);
                                            } else if (this.model.editSettings.rowPosition == "bottom") {
                                                rindex.prepend($oldChild);
                                                tbodyEle.replaceChild($newChild, $oldChild);
                                            } else
                                                tbodyEle.replaceChild($newChild, $oldChild);
                                        }
                                    } else if (this.model.editSettings.editMode == "dialog" || this.model.editSettings.editMode == "dialogtemplate" || this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate") {
                                        if (args.action == "add" && !this.element.find(".e-addedrow").length) break;
                                        $editedTr = this.element.find('.e-editedrow');
                                        if (args.requestType == "cancel" || (!$editedTr.length && !ej.isNullOrUndefined(this._filteredRecordsCount) && this._filteredRecordsCount == this._previousFilterCount)) {
                                            $newChild = temp.firstChild.firstChild.childNodes[rowIndex];
                                            $oldChild = tbodyEle.childNodes[rowIndex];
                                            var $newChildObj = $($newChild), $oldChildObj = $($oldChild);
                                            if ((this.model.detailsTemplate != null || this.model.childGrid != null) && $oldChildObj.next('.e-detailrow:visible').length) {
                                                var $target = $newChildObj.find('.e-detailrowcollapse');
                                                $target.removeClass("e-detailrowcollapse").addClass("e-detailrowexpand").find("div").removeClass("e-gnextforward").addClass("e-gdiagonalnext");
                                            }
                                            $oldChildObj.replaceWith($newChildObj);
                                            this.clearSelection();


                                        } else if ($editedTr.length) {
                                            $newChild = temp.firstChild.firstChild.childNodes[rowIndex];
                                            $oldChild = this._excludeDetailRows(tbodyEle.childNodes)[rowIndex];
                                            if (this.model.allowCellMerging != null) {
                                                var $oldChildObj = $($oldChild);
                                                if ($($oldChild.childNodes).hasClass("e-merged")) {
                                                    var index = $oldChildObj.children('.e-merged').index();
                                                    var count = $oldChild.children[index].colSpan;
                                                    for (var i = 0 ; i < count; i++) {
                                                        $newChild.childNodes[index + i].className += " e-merged e-hide";
                                                        $newChild.childNodes[index].colSpan = i + 1;
                                                    }
                                                }
                                            }
                                            if (this.model.detailsTemplate != null)
                                                $oldChild = $(tbodyEle.childNodes).not('.e-detailrow').eq(rowIndex).get(0);
                                            if ((this.model.detailsTemplate != null || this.model.childGrid != null) && $oldChildObj.next('tr.e-detailrow:visible').length) {
                                                var $target = $($newChild).find(".e-detailrowcollapse");
                                                $target.removeClass("e-detailrowcollapse").addClass("e-detailrowexpand").find("div").removeClass("e-gnextforward").addClass("e-gdiagonalnext");
                                            }
                                            if (!ej.isNullOrUndefined(this._filteredRecordsCount) && this._filteredRecordsCount < this._previousFilterCount) {
                                                var $oldChildObj = $($oldChild);
                                                if (this.model.detailsTemplate != null && $oldChildObj.next('tr.e-detailrow').length)
                                                    tbodyEle.removeChild($oldChildObj.next('tr.e-detailrow').get(0));
                                                $oldChildObj.remove();
                                                if (this.model.allowPaging && this.model.pageSettings.pageSize <= this.model.currentViewData.length)
                                                    tbodyEle.appendChild(temp.firstChild.firstChild.lastChild);
                                            } else if (this.model.sortSettings.sortedColumns.length && args.requestType == "save" && this._currentJsonData.length > 0 || !ej.isNullOrUndefined(this._searchCount))
                                                this.getContentTable().get(0).replaceChild(this.model.rowTemplate != null ? temp.firstChild.lastChild : temp.firstChild.firstChild, this.getContentTable().get(0).lastChild);
                                            else
                                                tbodyEle.replaceChild($newChild, $oldChild);
                                        } else if (this.model.currentViewData.length == 1 && this.getContentTable().find('td.e-rowcell').length == 0) {
                                            $newChild = temp.firstChild.firstChild.firstChild;
                                            $(tbodyEle).empty();
                                            tbodyEle.appendChild($newChild);
                                        } else {
                                            var newChild = ($editedTr.length || args.requestType == "cancel") ? temp.firstChild.firstChild.firstChild : temp1.firstChild.firstChild.lastChild;
                                            if (!(this._dataSource() instanceof ej.DataManager)) {
                                                if (this.model.sortSettings.sortedColumns.length && args.requestType == "save" && this._currentJsonData.length > 0 || !ej.isNullOrUndefined(this._searchCount))
                                                    this.getContentTable().get(0).replaceChild(this.model.rowTemplate != null ? temp.firstChild.lastChild : temp.firstChild.firstChild, this.getContentTable().get(0).lastChild);
                                                else if (this._currentPage() == 1)
                                                    this.getContentTable().find('tbody').first().prepend($(newChild));
                                                else
                                                    this.getContentTable().find('tbody').first().prepend($(temp.firstChild.firstChild.firstChild));
                                                if (this.model.allowPaging && this.model.pageSettings.pageSize <= this.model.currentViewData.length)
                                                    tbodyEle.removeChild(tbodyEle.lastChild);
                                            }
                                            else if (insertIndex != -1) {
                                                if (insertIndex == 0)
                                                    tbodyEle.insertBefore(newChild, tbodyEle.children[insertIndex]);
                                                else
                                                    $(newChild).insertAfter(tbodyEle.children[insertIndex - 1]);
                                                if (this.model.allowPaging && (this.model.pageSettings.pageSize <= this.model.currentViewData.length || insertIndex == this.model.pageSettings.pageSize - 1))
                                                    tbodyEle.removeChild(tbodyEle.lastChild);
                                            }
                                            if (this.model.detailsTemplate != null && $(tableEle.lastChild.lastChild).children('.e-detailrowexpand').length)
                                                tbodyEle.removeChild(tbodyEle.lastChild);
                                        }
                                    }
                                    if (this.model.editSettings.showAddNewRow)
                                        this._gridRows = this.getContentTable().first().find(".e-rowcell").closest("tr.e-row, tr.e-alt_row").toArray();
                                    else
                                        this._gridRows = tableEle.rows;
                                    if (this.model.enableAltRow)
                                        this._refreshAltRow();
                                } else if (args.requestType == "delete") {
                                    if (this._isUnboundColumn) {
                                        var $editedrow = this.element.find('.e-editedrow');
                                        var $oldChild = this.getContentTable().find('.e-editedrow').get(0);
                                        var $newChild = ($editedrow.length) ? temp.firstChild.firstChild.firstChild : temp1.firstChild.firstChild.lastChild;

                                        if ($editedrow.length != 0 && (this.model.editSettings.editMode == "normal" || this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate")) {
                                            $($oldChild).replaceWith($($newChild));
                                        }
                                        else if (this.model.editSettings.editMode == "inlineform" || this.model.editSettings.editMode == "inlineformtemplate") {
                                            $oldChild = $editedrow.prev('tr').get(0);
                                            $editedrow.remove();
                                        }
                                        else
                                            $oldChild = $editedrow.get(0);
                                    }
                                    if (this.model.allowPaging && this.model.pageSettings.pageSize <= this.model.currentViewData.length && this.getContentTable()[0].rows.length != this.model.currentViewData.length) {
                                        if (this.getContentTable().find("tr").length && this._excludeDetailRows().length) {
                                            if (this.multiDeleteMode) {
                                                var rowLength = temp.firstChild.firstChild.rows.length;
                                                var rows = $(temp.firstChild.firstChild.rows).slice(rowLength - this.selectedRowsIndexes.length, rowLength);
                                                $(tbodyEle).append(rows);
                                            }
                                            else
                                                tbodyEle.appendChild(temp.firstChild.firstChild.lastChild);

                                        }
                                        else
                                            $(tbodyEle).prepend(temp.firstChild.firstChild.rows);
                                    }
                                    if (this.model.detailsTemplate != null || this.model.childGrid != null) {
                                        var visibleRow = this.getContentTable().find('.e-detailrow:visible');
                                        $.each(visibleRow, function (indx, item) {
                                            if (visibleRow.eq(indx).closest('tr').prev().children('.e-detailrowexpand').length == 0)
                                                visibleRow.eq(indx).remove();
                                        });
                                    }
                                    this._gridRows = tableEle.rows;
                                    if (this.model.enableAltRow)
                                        this._refreshAltRow();
                                } else
                                    this.getContentTable().get(0).replaceChild(this.model.rowTemplate != null ? temp.firstChild.lastChild : temp.firstChild.firstChild, this.getContentTable().get(0).lastChild);

                            }
                            this._currentJsonData = this.model.currentViewData;
                            if (this.model.editSettings.showAddNewRow)
                                this._gridRows = this.getContentTable().first().find(".e-rowcell").closest("tr.e-row, tr.e-alt_row").toArray();
                            else
                                this._gridRows = this.getContentTable().get(0).rows;
                            if (this.model.scrollSettings.frozenColumns > 0)
                                this._gridRows = [this._gridRows, this.getContentTable().get(1).rows];

                            var model = {};
                            if ((args.requestType == "sorting" || args.requestType == "filtering") && this.model.scrollSettings.allowVirtualScrolling) {
                                if (args.requestType == "filtering") {
                                    this.getContent().first().ejScroller("refresh").ejScroller("isVScroll") ? this.element.find(".gridheader").addClass("e-scrollcss") : this.element.find(".gridheader").removeClass("e-scrollcss");
                                    var model = this._refreshVirtualPagerInfo();
                                }
                                if (this.model.scrollSettings.enableVirtualization)
                                    this._refreshVirtualView(this._currentVirtualIndex);
                                else
                                    this._refreshVirtualContent(currentPage);
                                args.requestType == "filtering" && this.getContent().first().ejScroller("refresh");
                            }
                            if (!this.model.scrollSettings.enableVirtualization)
                                this._eventBindings();
                            break;
                        }
                    case ej.HeatMapGrid.Actions.Grouping:
                        this._group(args);
                        this._refreshStackedHeader();
                        break;
                    case ej.HeatMapGrid.Actions.BeginEdit:
                        this._edit(args);
                        break;
                    case ej.HeatMapGrid.Actions.Add:
                        this._add(args);
                        break;
                    case ej.HeatMapGrid.Actions.Ungrouping:
                        this._ungroup(args);
                        break;
                    case ej.HeatMapGrid.Actions.VirtualScroll:
                        if (!this._isVirtualRecordsLoaded) {
                            if (!this.model.scrollSettings.enableVirtualization)
                                this._replacingContent();
                            else
                                this._replacingVirtualContent();
                        }
                        break;
                }
            } else {
                if (args.requestType == "refresh" && this.model.currentViewData == 0 && !this.phoneMode)
                    this.getContentTable().find("colgroup").first().replaceWith(this._getMetaColGroup());
                this._newungroup(args);
            }
            this._showGridLines();
            this._completeAction(args);
        }
        HeatMapGrid.prototype._showGridLines = function () {
            var $lines = this.model.gridLines;
            if ($lines != "both") {
                this.getContent().addClass($lines != "none" ? "e-" + $lines + "lines" : "e-hidelines");
            }
        };
        HeatMapGrid.prototype._newungroup = function (args) {
            if (args.requestType == "ungrouping")
                this._ungroup(args);
            else
                this.getContentTable().find('tbody').empty().first().append(this._getEmptyTbody());
        };
        HeatMapGrid.prototype.setFormat = function () {
            var column = [];
            for (var i = 0 ; i < this.model.columns.length ; i++) {
                if (this.model.columns[i].type == "date") {
                    column.push(this.model.columns[i]);
                }
            }
            if (column.length > 0) {
                for (var i = 0 ; i < this.model.currentViewData.length ; i++) {
                    for (var j = 0 ; j < column.length ; j++) {
                        var data = this.model.currentViewData[i][column[j].field];
                        if (/^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))?$/.test(data))
                            this.model.currentViewData[i][column[j].field] = new Date(this.model.currentViewData[i][column[j].field]);
                    }
                }
            }
        };
        HeatMapGrid.prototype._completeAction = function (args) {

            if (!this.model.editSettings.showAddNewRow)
                this.model.isEdit = false;
            this._confirmedValue = false;
            if (ej.HeatMapGrid.Actions.Grouping == args.requestType && ej.isNullOrUndefined(args.columnName))
                return;
            if ((args.columnSortDirection == "ascending" || args.columnSortDirection == "descending") && !ej.isNullOrUndefined(args.columnName)) {
                var scolumn = this.getColumnByField(args.columnName);
                if (this.model.allowSorting && this.model.allowMultiSorting)
                    this._scolumns.push(scolumn.field);
                else
                    this._gridSort = scolumn.field;
            }
            if (args.requestType != 'beginedit' && args.requestType != 'add')
                this.setWidthToColumns();
            if (args.requestType == "save" || args.requestType == "cancel" || args.requestType == "delete") {
                this._isAddNew = false;
                if (this.model.isResponsive && this.model.minWidth)
                    this.windowonresize();
            }
            if (!this.initialRender && (ej.HeatMapGrid.Actions.UnGrouping == args.requestType || this.model.groupSettings.groupedColumns.length > 0) && !$("#" + this._id + "EditForm").length)
                this._recalculateIndentWidth();

            else if ((ej.HeatMapGrid.Actions.Sorting == args.requestType && this.model.allowSorting) || ej.HeatMapGrid.Actions.Refresh == args.requestType || ej.HeatMapGrid.Actions.Cancel == args.requestType) {
                //if (ej.gridFeatures && ej.gridFeatures.sort && this.getHeaderTable() !== null)
                //    this._sortCompleteAction(args);

                if (!this.initialRender && (this.model.scrollSettings.frozenRows > 0 || this.model.scrollSettings.frozenColumns > 0))
                    this._refreshScroller(args);

            } else if (ej.HeatMapGrid.Actions.Delete == args.requestType || ej.HeatMapGrid.Actions.Save == args.requestType || ej.HeatMapGrid.Actions.Search == args.requestType) {
                this._editEventTrigger(args);
                if (!this.initialRender && (this.model.scrollSettings.frozenRows > 0 || this.model.scrollSettings.frozenColumns > 0))
                    this._refreshScroller(args);
            } else if (ej.HeatMapGrid.Actions.Filtering == args.requestType)
                this._filterCompleteAction();
            else if (ej.HeatMapGrid.Actions.BeginEdit == args.requestType || ej.HeatMapGrid.Actions.Add == args.requestType)
                this._editCompleteAction(args);
            else if (ej.HeatMapGrid.Actions.Grouping == args.requestType || ej.HeatMapGrid.Actions.Ungrouping == args.requestType)
                this["_" + args.requestType + "CompleteAction"](args);

            if (!this.initialRender && this.model.showSummary && this.model.summaryRows.length > 0) {
                if (this.model.currentViewData.length) {
                    //if (!this.element.children(".e-gridfooter").length)
                    //    this._renderGridFooter().insertAfter(this.getContent());
                    //this.getFooterTable().find('colgroup').remove();
                    //this.getFooterTable().append(this.getHeaderTable().find("colgroup").clone());
                }
                else
                    this.element.children(".e-gridfooter").remove();
            }
            if (!this.initialRender) {
                if (!this.getContent().find("td.e-selectionbackground").length)
                    this._setCurrentRow(args.requestType);
                if (args.requestType != "virtualscroll" && this.clearColumnSelection())
                    $(this.getHeaderTable().find("th.e-headercell")).removeClass("e-columnselection");
            }
            this.model.editSettings.editMode == "batch" && this.refreshBatchEditMode();
            if (!this.initialRender && (this.model.allowScrolling || this.model.isResponsive) && (this._checkScrollActions(args.requestType) || (this.model.editSettings.editMode.indexOf("inline") != -1 && args.requestType == "beginedit")) ||
                (this.model.scrollSettings.virtualScrollMode == "continuous" && args.requestType == "virtualscroll")) {
                if (this.model.isResponsive && this.model.minWidth)
                    this.windowonresize()
                else
                    this._refreshScroller(args);
            }
            if (this.model.scrollSettings.virtualScrollMode == "normal" && args.requestType == "virtualscroll")
                this.getContent().find("div:first").scrollLeft(this.getScrollObject().scrollLeft());
            if (this._customPop != null && args.requestType != "sorting") {
                this._customPop.hide();
            }
            if (this.model.allowScrolling && !this.initialRender && !this.model.scrollSettings.enableVirtualization)
                this.getContentTable().find("tr:last").find("td").addClass("e-lastrowcell");


            if (ej.HeatMapGrid.Actions.Refresh == args.requestType && !this.initialRender && this.model.allowGrouping && this.model.groupSettings.groupedColumns.length > 0)
                this._groupingCompleteAction(args);
            if (ej.HeatMapGrid.Actions.Refresh == args.requestType && !this.initialRender && this.model.allowGrouping && this.model.groupSettings.groupedColumns.length < 1)
                this._ungroupingCompleteAction(args);
            if (this.model.textWrapSettings)
                this._setTextWrap();
            if (!((this._isUngrouping || this._columnChooser) && (args.requestType == "refresh"))) {
                //this._trigger("actionComplete", args);
                this._isUngrouping = false;
                this._columnChooser = false;
            }
            //if (args.requestType != "refresh")
            //this._trigger("refresh");
            if ((this.model.editSettings.showAddNewRow && this.model.editSettings.editMode == "normal")) {

                if (!this.initialRender && this.getContentTable().find("tr.e-addedrow").length == 0 && this.element.find(".e-gridcontent").find("tr").length != 0)
                    this._startAdd();
            }

            if ((ej.HeatMapGrid.Actions.BeginEdit == args.requestType || ej.HeatMapGrid.Actions.Add == args.requestType) && $.isFunction($.validator))
                this.setValidation();
            if (!this.initialRender)
                this.model._groupingCollapsed = [];
            if (!this.initialRender && args.requestType == "refresh") {
                for (var i = 0 ; i < this.model.filterSettings.filteredColumns.length; i++)
                    this.getHeaderTable().find('.e-headercelldiv').eq(this.getColumnIndexByField(this.model.filterSettings.filteredColumns[i].field)).parent().find('.e-filtericon').addClass("e-filteredicon e-filternone");
            };
            if (this.model.columnLayout == "fixed" && !this.model.isEdit)
                this.setWidthToColumns();

        };
        HeatMapGrid.prototype._getDataIndex = function (data, item) {
            var flag = 0, _plen;
            for (var d = 0, len = data.length; d < len; d++) {
                for (var key = 0, _plen = this._primaryKeys.length; key < _plen; key++) {
                    if (this._checkPrimaryValue(data[d][this._primaryKeys[key]], item[this._primaryKeys[key]], this._primaryKeys[key]))
                        continue;
                    else if (key == _plen - 1)
                        flag = 1;
                }
                if (flag) return d;
            }
            return -1;
        };
        HeatMapGrid.prototype._checkPrimaryValue = function (keyData, keyItem, field) {
            if (this.getColumnByField(field).type == "string")
                keyData = keyData.trim();
            if (keyData != keyItem)
                return true;
            else
                return false;
        };
        HeatMapGrid.prototype._eventBindings = function () {
            var rowLength = this.model.scrollSettings.frozenColumns > 0 ? this._gridRows[0].length : this._gridRows.length;
            var trIndex = 0;
            var prev;
            var pageSize = this.model.pageSettings.pageSize;

            if (this._gridRecordsCount != 0) {
                if (this.model.queryCellInfo != null || this.model.rowDataBound != null || this.model.mergeCellInfo != null || this.model.templateRefresh != null) {
                    for (var row = 0; row < rowLength; row++) {
                        var rowIndex = null, trIndex = row, viewIndex, viewData;
                        if (this.model.scrollSettings.allowVirtualScrolling && row < pageSize) {
                            if (!this.model.scrollSettings.enableVirtualization) {
                                for (var i = 0; i < this._cloneQuery.queries.length; i++)
                                    prev = this._cloneQuery.queries[i].fn == "onPage" && this._cloneQuery.queries[i].e.pageIndex - 1;
                                var value = pageSize * prev;
                                if (value != 0) {
                                    rowIndex = this.getContentTable().find("tr[name=" + value + "]").eq(row);
                                    trIndex = rowIndex.index();
                                }
                            }
                            else {
                                rowIndex = $(this._gridRows).eq(row);
                                viewIndex = parseInt($(rowIndex).attr("name"), 32);
                                if ($.inArray(viewIndex, this._queryCellView) != -1)
                                    continue;
                                if (this._virtualLoadedRecords[viewIndex])
                                    viewData = this._virtualLoadedRecords[viewIndex][row % this._virtualRowCount];
                                trIndex = viewIndex * this._virtualRowCount + (row % this._virtualRowCount);
                            }
                        }
                        else if (this.model.scrollSettings.enableVirtualization)
                            rowIndex = $(this._gridRows).eq(row);
                        rowIndex = rowIndex || this.getRowByIndex(trIndex);
                        if (rowIndex.hasClass("e-virtualrow") || ej.isNullOrUndefined(this._currentJsonData[row] || viewData))
                            break;
                        var rowData = this.model.scrollSettings.enableVirtualization ? viewData : this._currentJsonData[row];
                        this._rowEventTrigger(rowIndex, rowData);
                    }
                }
            }
        };
        HeatMapGrid.prototype._rowEventTrigger = function (row, data) {
            var args = { row: row, data: data };
            //this._trigger("rowDataBound", args);
            var tdCells = row.cells;
            var $tdRowcells = $(row).find(".e-rowcell");
            for (var cellIndex = 0; cellIndex < $tdRowcells.length; cellIndex++) {
                var args = { cell: $tdRowcells[cellIndex], data: data, text: $tdRowcells[cellIndex].innerHTML };
                var foreignKeyData = this._getForeignKeyData(args.data);
                if ($($tdRowcells[cellIndex]).hasClass("e-rowcell"))
                    args.column = this.model.columns[cellIndex];
                if (!ej.isNullOrUndefined(foreignKeyData))
                    args.foreignKeyData = foreignKeyData;


                //this._heatmap["queryCellInfo")( args);
                this._heatmap._setBinding(args);
                if ($($tdRowcells[cellIndex]).hasClass("e-templatecell")) {
                    var args = { cell: $tdRowcells[cellIndex], column: this.model.columns[cellIndex], data: data, rowIndex: $(row).index() };
                    //this._trigger("templateRefresh", args);
                }
            }

        };
        HeatMapGrid.prototype.setWidthToColumns = function () {
            var $cols1 = this.getContentTable().children("colgroup").find("col");
            var $cols2 = this.getHeaderTable().children("colgroup").find("col");
            var width = this.element.width(), frozenWidth = 0, columnsTotalWidth = 0, finalWidth = 0;
            if (this.model.groupSettings.groupedColumns.length && !this.model.allowScrolling && this.model.groupSettings.showGroupedColumn) {
                var browserDetails = this.getBrowserDetails();
                if (browserDetails.browser == "msie" && parseInt(browserDetails.version, 10) > 8)
                    $cols1.first().css("width", ((30 / width) * 100) + "%");
            }
            if (!ej.isNullOrUndefined(this.model.detailsTemplate)) {
                var headerIndx = this.model.groupSettings.groupedColumns.length;
                var contentIndx = this.model.groupSettings.groupedColumns.length != 0 ? 1 : 0;
                $cols1.eq(contentIndx).css("width", this._detailsOuterWidth);
                $cols2.eq(headerIndx).css("width", this._detailsOuterWidth);
            }
            this._detailColsRefresh();
            $cols1 = this._$headerCols;
            $cols2 = this._$contentCols;

            for (var i = 0; i < $cols2.length; i++) {
                if (this.model.allowResizeToFit && this.model.columns[i]["width"] === undefined && this.columnsWidthCollection[i] === undefined) {
                    var hCellIndex = this.model.groupSettings.groupedColumns.length ? (i + this.model.groupSettings.groupedColumns.length) : i;
                    var contentWidth = this._resizer._getContentWidth(i);
                    var cellDiv = this.getHeaderTable().find('.e-headercelldiv').eq(hCellIndex);
                    var headerWidth = this._resizer._getHeaderContentWidth(cellDiv);
                    if (this.model.editSettings.editMode == "normal" && (this.model.isEdit || this._isAddNew))
                        finalWidth = $cols1.eq(i).width();
                    else {
                        finalWidth = contentWidth > headerWidth ? contentWidth : headerWidth;
                        finalWidth += parseInt(cellDiv.css("padding-left"), 10)
                    }
                    this.columnsWidthCollection[i] = finalWidth;
                    columnsTotalWidth += this.model.columns[i].visible ? finalWidth : 0;
                } else
                    columnsTotalWidth += this.model.columns[i].visible ? parseInt(this.model.columns[i]["width"], 10) : 0;
                if (!ej.isNullOrUndefined(this.columnsWidthCollection[i])) {
                    $cols1.eq(i).width(this.columnsWidthCollection[i]);
                    $cols2.eq(i).width(this.columnsWidthCollection[i]);
                    if (this.model.columns[i]["priority"])
                        $cols2.eq(i).addClass("e-table-priority-" + this.model.columns[i]["priority"]);
                } else if (this.model.allowScrolling) {
                    var colWidth = (width / this.model.columns.length).toFixed(2), bSize = (width / (this.model.scrollSettings.buttonSize || 18) / 100).toFixed(2), cWidth = colWidth - bSize;
                    $cols1.eq(i).css("width", cWidth + "px");
                    $cols2.eq(i).css("width", cWidth + "px");
                    this.model.columns[i].width = cWidth;
                    this.columnsWidthCollection[i] = parseFloat(cWidth);
                }
            }
            if (this.model.columnLayout == "fixed") {
                if (this.model.scrollSettings && this.model.scrollSettings.frozenColumns == 0) {
                    this.getHeaderTable().width(columnsTotalWidth);
                    this.getContentTable().width(columnsTotalWidth);
                }
                var headerTableWidth = this.model.scrollSettings.frozenColumns > 0 ? this.getHeaderTable().eq(0).width() + this.getHeaderTable().eq(1).width() : this.getHeaderTable().width();
                var operation = this.getHeaderContent().width() > headerTableWidth ? 'addClass' : 'removeClass';
                var headerTable = this.getHeaderTable();
                var contentTable = this.getContentTable();
                if (this.model.scrollSettings.frozenColumns > 0) {
                    headerTable = this.getVisibleColumnNames().length <= this.model.scrollSettings.frozenColumns ? this.getHeaderTable().eq(1) : this.getHeaderTable().eq(0);
                    contentTable = this.getVisibleColumnNames().length <= this.model.scrollSettings.frozenColumns ? this.getContentTable().eq(1) : this.getContentTable().eq(0);
                }
                headerTable[operation]('e-tableLastCell');
                contentTable[operation]('e-tableLastCell');
            }
            if (!this.model.allowScrolling && this.model.allowResizeToFit && columnsTotalWidth > width) {
                this.model.allowScrolling = true;
                this.model.scrollSettings.width = width;
                this.getHeaderTable().parent().addClass("e-headercontent");
                if (!this.model.scrollSettings.frozenColumns > 0)
                    this.getHeaderTable().width(width);
            }
            if (this.model.isEdit) {
                var clonedCol = $cols1.clone();
                var editedTr;
                if (this.model.editSettings.showAddNewRow)
                    editedTr = this.getContentTable().find(".e-editedrow");
                var $colGroup = this.model.scrollSettings.frozenColumns > 0 ? this.getContent().find(".gridform").find("colgroup") : !ej.isNullOrUndefined(editedTr) && editedTr.length == 1 ? editedTr.find("colgroup") : $("#" + this._id + "EditForm").find("colgroup");
                this.model.scrollSettings.frozenColumns > 0 && $colGroup.first().empty().append(clonedCol.splice(0, this.model.scrollSettings.frozenColumns));
                $colGroup.last().empty().append(clonedCol);
                if (this.model.detailsTemplate != null || this.model.childGrid != null)
                    $colGroup.prepend(this._getIndentCol());
            }
            if (this.model.groupSettings.groupedColumns.length) {
                var $grouedColGroup = this.getContentTable().find(".e-recordtable").children("colgroup");
                for (var i = 0; i < $grouedColGroup.length; i++) {
                    var clonedCol = $cols1.clone();
                    var detailsWidth = this._detailsOuterWidth != null ? this._detailsOuterWidth : "30px";
                    if (this.model.detailsTemplate != null || this.model.childGrid != null) clonedCol.splice(0, 0, $(this._getIndentCol()).width(detailsWidth)[0]);
                    $grouedColGroup.eq(i).empty().append(clonedCol);
                }
            }
            if (this.model.scrollSettings.frozenColumns > 0) {
                var totalWidth = 0, frozenWidth;
                for (var i = 0; i < this.columnsWidthCollection.length; i++) {
                    totalWidth += parseInt(this.columnsWidthCollection[i], 10);
                    if (this.model.scrollSettings.frozenColumns - 1 == i)
                        frozenWidth = Math.ceil(totalWidth);
                }
                this.getContent().find(".e-frozencontentdiv").outerWidth(frozenWidth)
                    .end().find(".e-movablecontentdiv").outerWidth(totalWidth - frozenWidth);
                this.getHeaderContent().find(".e-frozenheaderdiv").outerWidth(frozenWidth)
                    .end().find(".e-movableheaderdiv").outerWidth(totalWidth - frozenWidth);
            }
        };
        HeatMapGrid.prototype._initialEndRendering = function () {
            // use this method to add behaviour after grid render.


            if (this.model.scrollSettings.frozenColumns > 0 && !this.model.allowScrolling) {
                this.getContent().remove();
                this.getHeaderTable().eq(1).remove();

                return;
            }
            this.model.scrollSettings.allowVirtualScrolling && !this.model.scrollSettings.enableVirtualization;
            this._getRowHeights();
            if (this.element.width() != 0)
                this.model.allowScrolling && this._renderScroller();
            else if (this.model.allowScrolling && this.element.width() == 0) {
                var proxy = this, myVar = setInterval(function () {
                    if (proxy.element.width() != 0 && !ej.isNullOrUndefined(proxy.element.width())) {
                        proxy._renderScroller();
                        proxy._endRendering();
                        clearInterval(myVar);
                    }
                }, 100);
                return;
            }
            this._endRendering();
        };
        HeatMapGrid.prototype._endRendering = function () {
            if (!ej.isNullOrUndefined(this.getContent().data("ejScroller")) && this.model.allowScrolling)
                var scroller = this.getScrollObject();
            var css = this.model.enableRTL ? "e-summaryscroll e-rtl" : "e-summaryscroll";
            if (this.model.allowScrolling && this.model.showSummary && scroller._vScroll)
                this.element.find(".e-summaryrow.e-scroller").addClass(css);
            this._addMedia();
            if (this.model.allowScrolling && this.model.allowTextWrap && !this.model.scrollSettings.allowVirtualScrolling) this.getContent().first().ejScroller("refresh");
            if (this.model.scrollSettings.allowVirtualScrolling) {
                if (this._currentPage() == 1 && !this.model.scrollSettings.enableVirtualization)
                    this._virtualLoadedRecords[this._currentPage()] = this._currentJsonData;
                if (this.model.scrollSettings.enableVirtualization)
                    this._refreshVirtualView();
                else
                    this._refreshVirtualContent();
                this.getContent().first().ejScroller("refresh");
                if (this.getContent().ejScroller("isVScroll")) {
                    this.element.find(".e-gridheader").addClass("e-scrollcss");
                    this.getHeaderTable().first().width(this.getContentTable().width());
                }
                else
                    this.element.find(".e-gridheader").removeClass("e-scrollcss");
            }
            if (this._selectedRow() != -1) {
                this.model.currentIndex = this._selectedRow();
            }
            this.rowHeightRefresh()
            if (this.initialRender && (!this.model.scrollSettings.enableVirtualization || this._gridRows.length < this._virtualRowCount))
                this._addLastRow();
        };
        HeatMapGrid.prototype._addLastRow = function () {
            var lastRowtd = this.getContentTable().find("tr:last").find("td"), rowHeight = 0;

            if (this.model.allowScrolling && !this.model.scrollSettings.allowVirtualScrolling && !ej.isNullOrUndefined(this.model.dataSource) && !ej.isNullOrUndefined(this.getRows())) {
                for (var i = 0; i < this.getRows().length; i++)
                    rowHeight += $(this.getRows()[i]).height();

                if (rowHeight < this.getContent().height() - 1)
                    lastRowtd.addClass("e-lastrowcell");
            }
            if (this.model.scrollSettings.allowVirtualScrolling && this.getContentTable().height() < this.getContent().height())
                lastRowtd.addClass("e-lastrowcell");
        };
        HeatMapGrid.prototype._addMedia = function () {
            if (typeof (this.model.scrollSettings.width) != "string" && this.model.scrollSettings.width > 0) {
                this._responsiveScrollWidth = this._originalScrollWidth = this.model.scrollSettings.width;
            }
            else
                this._originalScrollWidth = this.element.width();
            if (typeof (this.model.scrollSettings.height) != "string" && this.model.scrollSettings.height > 0)
                this._responsiveScrollHiehgt = this.model.scrollSettings.height;
            if (this.model.minWidth && this.model.isResponsive) {
                this._$onresize = $.proxy(this.windowonresize, this);
                $(window).bind("resize", this._$onresize);
                if ($.isFunction(window.matchMedia)) {
                    var mediaFilterObj = window.matchMedia("(max-width: 768px)");
                    this._mediaStatus = mediaFilterObj.matches;
                }
                this.windowonresize();
            }
        };
        HeatMapGrid.prototype._getNoncontentHeight = function () {
            var height = this.getHeaderContent().outerHeight();
            if (this.model.allowGrouping && this.model.groupSettings.showDropArea)
                height += this.element.find('.e-groupdroparea').outerHeight();
            return height;
        };
        HeatMapGrid.prototype._mediaQueryUpdate = function (isScroller, elemHeight, width, winHeight) {
            if (window.innerWidth <= 320 && this.model.enableResponsiveRow) {
                var contentStyle = this.getContentTable()[0].style;
                if (contentStyle.removeAttribute)
                    contentStyle.removeAttribute('min-width');
                else
                    contentStyle.removeProperty('min-width');
                var scrollObj = this.getContent().data('ejScroller');
                if (scrollObj)
                    this.getContent().ejScroller('destroy');
                return;
            }
            if (isScroller) {
                this.model.scrollSettings.width = ej.isNullOrUndefined(this._responsiveScrollWidth) ? width : Math.min(this._responsiveScrollWidth, width);
                var height = Math.min(winHeight, elemHeight) - this._getNoncontentHeight();
                height = ej.isNullOrUndefined(this._responsiveScrollHiehgt) ? height : Math.min(this._responsiveScrollHiehgt, height);
                height = this.model.scrollSettings.height != "auto" ? height - (parseInt(this.element.parent().css('margin-bottom')) + 1) : this.model.scrollSettings.height;
                if (this.model.minWidth > width && elemHeight > winHeight)
                    height = height != "auto" ? height + this.model.scrollSettings.buttonSize : height;
                if (ej.isNullOrUndefined(this.getRows()))
                    height = '100%';
                this.model.scrollSettings.height = height;
                this.element.find(".e-gridheader").first().find("div").first().addClass("e-headercontent");
                this._renderScroller();
            }
            else {
                this.model.scrollSettings.width = '100%';
                if (!ej.isNullOrUndefined(this._responsiveScrollWidth))
                    this.model.scrollSettings.width = Math.min(this._responsiveScrollWidth, width);
                var modifyHeight = Math.min(winHeight, elemHeight);
                var height = modifyHeight - this._getNoncontentHeight();
                if (!ej.isNullOrUndefined(this._responsiveScrollHiehgt))
                    height = Math.min(this._responsiveScrollHiehgt, winHeight);
                height = this.model.scrollSettings.height != "auto" ? height - parseInt(this.element.parent().css('margin-bottom')) : this.model.scrollSettings.height;
                if (ej.isNullOrUndefined(this.getRows()))
                    height = '100%';
                this.model.scrollSettings.height = height;
                this.element.find(".e-gridheader").first().find("div").first().addClass("e-headercontent");
                this._renderScroller();
            }
        };
        HeatMapGrid.prototype.windowonresize = function () {
            this.model.scrollSettings.width = this._responsiveScrollWidth;
            var width, height;
            this.element.width('100%');
            this.getContentTable().width('100%');
            this.getHeaderTable().width('100%');
            this.getContentTable().css('minWidth', this.model.minWidth);
            width = this.element.width();
            var winHeight = $(window).height() - this.element.offset()['top'];
            var rowCount = !ej.isNullOrUndefined(this.getRows()) ? this.getRows().length : 1;
            var isBody = this.element.parent().is($('body')) || this.element.parent().height() == $('body').height() || this.element.parent()[0].style.height == "";
            var originalElemHeight = this.getContentTable()[0].scrollHeight + this._getNoncontentHeight();
            var elemHeight = isBody ? winHeight : this.element.parent().height();
            originalElemHeight += parseInt(this.element.parent().css('margin-top'));
            var isScroller = this.model.minWidth > width || elemHeight <= originalElemHeight;
            this._mediaQueryUpdate(isScroller, elemHeight, width, originalElemHeight)
            this._refreshScroller({});
        };
        HeatMapGrid.prototype._getRowHeights = function () {
            var trs = this.getRows();
            if (trs !== null) {
                this._rowHeightCollection = [];
                if (trs[1] !== undefined && trs[1].length && ((this.model.scrollSettings.frozenColumns > 0 && trs[0] !== undefined) || (trs[0] !== undefined && typeof trs[0].item !== "undefined" && typeof trs[0].length == "number" && typeof trs[1].item !== "undefined" && typeof trs[1].length == "number"))) {
                    var frotrs = trs[0];
                    var movtrs = trs[1];
                    for (var i = 0 ; i < frotrs.length ; i++) {
                        this._rowHeightCollection[i] = frotrs[i].offsetTop >= movtrs[i].offsetTop ? frotrs[i].offsetTop : movtrs[i].offsetTop;
                    }
                }
                else {
                    for (var i = 0 ; i < trs.length ; i++) {
                        this._rowHeightCollection[i] = trs[i].offsetTop;
                    }
                }
            }
            return this._rowHeightCollection;
        };
        HeatMapGrid.prototype._getEmptyTbody = function () {
            var $emptyTd = ej.buildTag('td.emptyrecord', this.localizedLabels.EmptyRecord, {}, { colSpan: this.model.columns.length });
            return $(document.createElement("tr")).append($emptyTd);
        };
        HeatMapGrid.prototype._getIndentCol = function () {
            return ej.buildTag("col", "", { width: "30px" });
        };
        HeatMapGrid.prototype._wireEvents = function (heatmap) {
            heatmap._on(this.element, ($.isFunction($.fn.tap) && this.model.enableTouch) ? "tap" : "click", $.proxy(this._clickHandler, this));



            this._enableRowHover(undefined, heatmap);


            if (this.model.allowGrouping) {
                this._enableGroupingEvents();
                this._on(this.element, "mouseenter mouseleave", ".e-groupdroparea,.e-groupheadercell", $.proxy(this._dropAreaHover, this));
            }
        };
        HeatMapGrid.prototype._clickHandler = function (e) {
            var $target = $(e.target), tempChooser = $("[id$='ccDiv'].e-grid.e-columnChooser"), fieldName, $form = $("#" + this._id + "EditForm"), index, columnIndex, rowIndex;
            if (tempChooser.length) {
                var flag = true;
                for (var i = 0; i < tempChooser.length; i++) {
                    if ($target.parents(".e-ccButton").length || $target.hasClass('e-ccButton')) flag = $(e.target).closest(".e-grid").attr("id") + "ccDiv" != tempChooser[i].id;
                }
            }

            if ($target.closest(".e-grid").attr("id") !== this._id) return;
            if ($target.closest("#" + this._id + "EditForm").length)
                return;
            if ($target.hasClass("e-rowcell") || $target.closest("td").is(".e-rowcell") || ($target.hasClass("e-headercell") && ((e.clientY - $target.offset().top) < ($target.height() / 4)))) {
                if (this._bulkEditCellDetails.cancelSave) {
                    this._bulkEditCellDetails.cancelSave = false;
                    return;
                }
                if (this.model.editSettings.editMode == "batch" && ($.isFunction($.validator) && $form.length && $form.validate().errorList.length > 0))
                    return;
                this.model.editSettings.editMode == "batch" && this.element.focus();
                index = $target.closest("tr").hasClass("e-insertedrow") ? this.model.groupSettings.groupedColumns.length : 0;
                var tempIndex = $target.closest(".e-rowcell").index() != -1 ? $target.closest(".e-rowcell").index() : $target.closest(".e-headercell").index() - this.model.groupSettings.groupedColumns.length;
                columnIndex = $target.hasClass("e-rowcell") ? $target.index() - index : tempIndex - index;
                columnIndex = (this.model.detailsTemplate != null || this.model.childGrid != null) ? columnIndex - 1 : columnIndex;
                if (this.model.scrollSettings.frozenColumns && ($target.closest(".e-movableheaderdiv").length || $target.closest(".e-movablecontentdiv").length))
                    columnIndex = columnIndex + this.model.scrollSettings.frozenColumns;
                rowIndex = this.getIndexByRow($target.closest("tr"));
                this._bulkEditCellDetails.columnIndex = columnIndex;
                this._bulkEditCellDetails.rowIndex = rowIndex;
                if (this.model.allowSelection) {
                    if (this.model.selectionType == "multiple") {
                        if (e.ctrlKey || this._enableSelectMultiTouch) {
                            this.multiSelectCtrlRequest = true;
                        }
                        if (e.shiftKey) {
                            this.multiSelectShiftRequest = true;
                            if (this._allowcellSelection && rowIndex > -1)
                                this.selectCells([[rowIndex, [columnIndex]]]);
                            this._selectedRow(this.getIndexByRow($target.closest('tr')));

                        }
                        if (e["pointerType"] == "touch" && this._customPop != null && !this._customPop.is(":visible") && this._customPop.find(".e-rowselect").hasClass("e-spanclicked") && this.model.selectionSettings.selectionMode == "row")
                            this._customPop.show();
                        if (e["pointerType"] == "touch" && this._customPop != null && (this._customPop.find(".e-sortdirect").is(":visible") || !this._customPop.find(".e-rowselect").hasClass("e-spanclicked")) && this.model.selectionType == "multiple") {
                            this._customPop.removeAttr("style");
                            var offset = $target.offset();
                            this._customPop.offset({ top: 0, left: 0 }).offset({ left: offset.left, top: offset.top - this.getRowHeight() }).find(".e-sortdirect").hide().end()
                                .find(".e-rowselect").show().end().show();
                        }
                    }
                    if (!this.multiSelectShiftRequest) {
                        if (this._allowcellSelection && rowIndex > -1) {
                            var cellProto = this._checkCellSelectionByRow(rowIndex, columnIndex);
                            if ((this.model.selectionSettings.enableToggle && this.selectedRowCellIndexes.length == 1 && this.selectedRowCellIndexes[0].cellIndex.length == 1 || (e.ctrlKey && this.model.selectionType == 'multiple')) && (cellProto != -1 && this.selectedRowCellIndexes.length > 0 && this.selectedRowCellIndexes[0].cellIndex.length > 0))
                                this.clearCellSelection(cellProto.rowIndex, columnIndex);
                            else
                                this.selectCells([[rowIndex, [columnIndex]]]);
                        }
                        if (this._allowrowSelection && rowIndex > -1) {
                            var selectedIndex = this.getIndexByRow($target.closest('tr'));
                            if (this.model.scrollSettings.enableVirtualization) {
                                var remain = rowIndex % this._virtualRowCount, viewIndex;
                                viewIndex = parseInt($($target).closest("tr").attr("name"), 32);
                                selectedIndex = (viewIndex * this._virtualRowCount) - (this._virtualRowCount - remain);
                            }
                            if (this.model.selectionSettings.enableToggle && this.getSelectedRecords().length == 1 && $.inArray(this.getIndexByRow($target.closest('tr')), this.selectedRowsIndexes) != -1)
                                this.clearSelection(selectedIndex);
                        }
                        if (this._allowcolumnSelection && $target.hasClass("e-headercell") && !$target.hasClass("e-stackedHeaderCell") && ((e.clientY - $target.offset().top) < ($target.height() / 4))) {
                            if (this.model.selectionSettings.enableToggle && this.selectedColumnIndexes.length == 1 && $.inArray(columnIndex, this.selectedColumnIndexes) != -1)
                                this.clearColumnSelection(columnIndex);
                        }
                        this.multiSelectCtrlRequest = false;
                    }
                    this.multiSelectShiftRequest = false;
                }

                fieldName = this.model.columns[this._bulkEditCellDetails.columnIndex]["field"];
                if ($target.closest(".e-rowcell").length && fieldName) {
                    this._tabKey = false;
                    this.model.editSettings.allowEditing && this.model.editSettings.editMode == "batch" && this.editCell($.inArray($target.closest("tr").get(0), this.getRows()), fieldName);
                }
            }
            if ($target.hasClass("e-rowselect") || $target.hasClass("e-sortdirect")) {
                if (!$target.hasClass("e-spanclicked")) {
                    $target.addClass("e-spanclicked");
                    if ($target.hasClass("e-rowselect"))
                        this._enableSelectMultiTouch = true;
                    if ($target.hasClass("e-sortdirect"))
                        this._enableSortMultiTouch = true;
                } else {
                    $target.removeClass("e-spanclicked");
                    if ($target.hasClass("e-rowselect"))
                        this._enableSelectMultiTouch = false;
                    if ($target.hasClass("e-sortdirect"))
                        this._enableSortMultiTouch = false;
                    this._customPop.hide();
                }
            }

            if ($target.is(".e-filtericon") && $target.closest(".e-detailrow").length != 0)
                e.preventDefault();

            if (this.model.allowSearching && this._searchBar != null) {
                if ($target.is(this._searchBar.find(".e-cancel")))
                    this._searchBar.find("input").val("");
                else {
                    if (e.target.id == this._id + "_searchbar")
                        this._searchBar.find(".e-cancel").removeClass("e-hide");
                    else if (!this._searchBar.find(".e-cancel").hasClass("e-hide"))
                        this._searchBar.find(".e-cancel").addClass("e-hide");
                }
            }
        };
        HeatMapGrid.prototype._checkCellSelectionByRow = function (rowIndex, columnIndex) {
            for (var i = 0; i < this.selectedRowCellIndexes.length; i++) {
                if (this.selectedRowCellIndexes[i].rowIndex == rowIndex)
                    break;
            }
            if (i != this.selectedRowCellIndexes.length && $.inArray(columnIndex, this.selectedRowCellIndexes[i].cellIndex) != -1)
                return this.selectedRowCellIndexes[i];
            return -1;
        };
        HeatMapGrid.prototype._destroy = function () {
            /// <summary>This function is  used to destroy the Grid Object</summary>
            this.element.off();
            this.element.find(".e-gridheader").find(".e-headercontent,.e-movableheader")
                .add(this.getContent().find(".e-content,.e-movablecontent")).unbind('scroll');
            var editForm = $("#" + this._id + "EditForm");
            if (editForm.length) {
                var $formEle = editForm.find('.e-field'), $element;
                for (var i = 0; i < $formEle.length; i++) {
                    $element = $($formEle[i]);
                }
                editForm.remove();
            }

            if (this.model.showColumnChooser) {

                $("#" + this._id + "ccDiv").remove();
                $("#" + this._id + "_ccTail").remove();
                $("#" + this._id + "_ccTailAlt").remove();
            }
            if (this.model.allowFiltering && this.model.filterSettings.filterType == "excel")
                this._excelFilter.resetExcelFilter()
            if (this.model.allowReordering)
                $(".e-columndropindicator").remove();

            if (this._$onresize)
                $(window).unbind("resize", this._$onresize);
            this.element.empty().removeClass("e-grid " + this.model.cssClass);
        };
        return HeatMapGrid;
    })();

    ej.HeatMapGrid = function (args, heatmap) {
        return new HeatMapGrid(args, heatmap);
    };


    ej.HeatMapGrid.Locale = ej.HeatMapGrid.Locale || {};
    ej.HeatMapGrid.Actions = {
        /** Used to specify paging action in grid   */
        Paging: "paging",
        /** Used to specify sorting action in grid   */
        Sorting: "sorting",
        /** Used to specify filtering action in grid   */
        Filtering: "filtering",
        /** Used to specify begin edit action in grid   */
        BeginEdit: "beginedit",
        /** Used to specify saving action in grid   */
        Save: "save",
        /** Used to specify adding action in grid   */
        Add: "add",
        /** Used to specify deleting action in grid   */
        Delete: "delete",
        /** Used to specify cancelling action in grid   */
        Cancel: "cancel",
        /** Used to specify grouping action in grid   */
        Grouping: "grouping",
        /** Used to specify un-grouping action in grid   */
        Ungrouping: "ungrouping",
        /** Used to specify refresh action in grid   */
        Refresh: "refresh",
        /** Used to specify reordering action in grid   */
        Reorder: "reorder",
        /** Used to specify searching action in grid   */
        Search: "searching",
        /** Used to specify batch save action in grid   */
        BatchSave: "batchsave",
        /** Used to specify virtual scroll action in grid   */
        VirtualScroll: "virtualscroll"
    };
    ej.HeatMapGrid.ClipMode = {
        /** Render an ellipsis ("...") to represent clipped text **/
        Ellipsis: "ellipsis",
        /** Clips the text **/
        Clip: "clip",
        /** Render an ellipsis ("...") to represent clipped text and tooltip would be shown **/
        EllipsisWithTooltip: "ellipsiswithtooltip"
    };
    ej.HeatMapGrid.SelectionType = {
        /**  Support for Single selection only in grid */
        Single: "single",
        /**  Support for multiple selections in grid */
        Multiple: "multiple"
    };
    ej.HeatMapGrid.SelectionMode = {
        /**  Support for Row selection in grid */
        Row: "row",
        /**  Support for Cell selection in grid */
        Cell: "cell",
        /**  Support for Column selection in grid */
        Column: "column"
    };
    ej.HeatMapGrid.Locale["default"] = ej.HeatMapGrid.Locale["en-US"] = {
        EmptyRecord: "No records to display",
        GroupDropArea: "Drag a column header here to group its column",
        DeleteOperationAlert: "No records selected for delete operation",
        EditOperationAlert: "No records selected for edit operation",
        SaveButton: "Save",
        OkButton: "OK",
        CancelButton: "Cancel",
        EditFormTitle: "Details of ",
        AddFormTitle: "Add New Record",
        Notactionkeyalert: "This Key-Combination is not available",
        Keyconfigalerttext: "This Key-Combination has already been assigned to ",
        GroupCaptionFormat: "{{:headerText}}: {{:key}} - {{:count}} {{if count == 1 }} item {{else}} items {{/if}} ",
        BatchSaveConfirm: "Are you sure you want to save changes?",
        BatchSaveLostChanges: "Unsaved changes will be lost. Are you sure you want to continue?",
        ConfirmDelete: "Are you sure you want to Delete Record?",
        CancelEdit: "Are you sure you want to Cancel the changes?",
        PagerInfo: "{0} of {1} pages ({2} items)",
        FrozenColumnsViewAlert: "Frozen columns should be in grid view area",
        FrozenColumnsScrollAlert: "Enable allowScrolling while using frozen Columns",
        FrozenNotSupportedException: "Frozen Columns and Rows are not supported for Grouping, Row Template, Detail Template, Hierarchy Grid and Batch Editing",
        Add: "Add",
        Edit: "Edit",
        Delete: "Delete",
        Update: "Update",
        Cancel: "Cancel",
        Done: "Done",
        Columns: "Columns",
        SelectAll: "(Select All)",
        PrintGrid: "Print",
        ExcelExport: "Excel Export",
        WordExport: "Word Export",
        PdfExport: "PDF Export",
        StringMenuOptions: [{ text: "StartsWith", value: "StartsWith" }, { text: "EndsWith", value: "EndsWith" }, { text: "Contains", value: "Contains" }, { text: "Equal", value: "Equal" }, { text: "NotEqual", value: "NotEqual" }],
        NumberMenuOptions: [{ text: "LessThan", value: "LessThan" }, { text: "GreaterThan", value: "GreaterThan" }, { text: "LessThanOrEqual", value: "LessThanOrEqual" }, { text: "GreaterThanOrEqual", value: "GreaterThanOrEqual" }, { text: "Equal", value: "Equal" }, { text: "NotEqual", value: "NotEqual" }],
        PredicateAnd: "AND",
        PredicateOr: "OR",
        Filter: "Filter",
        FilterMenuCaption: "Filter Value",
        FilterbarTitle: "'s filter bar cell",
        MatchCase: "Match Case",
        Clear: "Clear",
        ResponsiveFilter: "Filter",
        ResponsiveSorting: "Sort",
        Search: "Search",
        DatePickerWaterMark: "Select date",
        EmptyDataSource: "DataSource must not be empty at initial load since columns are generated from dataSource in AutoGenerate Column Grid",
        ForeignKeyAlert: "The updated value should be a valid foreign key value",
        True: "true",
        False: "false",
        UnGroup: "Click here to ungroup",
        AddRecord: "Add Record",
        EditRecord: "Edit Record",
        DeleteRecord: "Delete Record",
        Save: "Save",
        Grouping: "Group",
        Ungrouping: "Ungroup",
        SortInAscendingOrder: "Sort In Ascending Order",
        SortInDescendingOrder: "Sort In Descending Order",
        NextPage: "Next Page",
        PreviousPage: "Previous Page",
        FirstPage: "First Page",
        LastPage: "Last Page",
        EmptyRowValidationMessage: "Atleast one field must be updated",
        NoResult: "No Matches Found"
    };
})(jQuery, Syncfusion);