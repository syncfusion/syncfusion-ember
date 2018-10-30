(function ($, ej, undefined) {
    ej.gridFeatures = ej.gridFeatures || {};
    ej.widget("ejGrid", "ej.Grid",  {
        
        _rootCSS: "e-grid",
        // widget element will be automatically set in this
        element: null,
        validTags: ["div"],
        // user defined model will be automatically set in this
        model: null,
        _requiresID: true,
        keyConfigs: /** @lends ejGrid# */{
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
            rowUpSelection: "ctrl+shift+38", //"CtrlPlusShiftplusUpArrow",
            rowDownSelection: "ctrl+shift+40", //"CtrlPlusShiftplusDownArrow",
            randomSelection: "ctrl+shift+83", // "CtrlPlusShiftplusSkey",
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
            multiSelectionByDownArrow:"shift+40",//"shiftPlusDownArrow"
            multiSelectionByRightArrow: "shift+39",//"shiftPlusRigthArrow"
            multiSelectionByLeftArrow: "shift+37",//"shiftPlusLeftArrow"
        },
        _ignoreOnPersist: [
            "actionBegin", "actionComplete", "actionFailure", "batchAdd", "batchDelete", "beforeBatchSave", "beforeBatchAdd", "beforeBatchDelete", "beginEdit",
            "cellEdit", "cellSave", "cellSelecting", "cellSelected", "cellDeselecting", "cellDeselected", "columnDrag", "columnDragStart", "columnDrop", "columnSelecting",
            "columnSelected", "columnDeselecting", "columnDeselected", "create", "dataBound", "destroy", "detailsCollapse", "detailsExpand", "endAdd", "endDelete",
            "endEdit", "recordClick", "recordDoubleClick", "load", "resized", "resizeEnd", "resizeStart", "rightClick", "rowSelected", "rowSelecting", "rowDeselected",
            "rowDeselecting", "rowDrag", "rowDragStart", "rowDrop", "templateRefresh", "beforePrint", "beforeRowDrop", "query", "isEdit", "toolbarClick", "queryCellInfo",
            "mergeCellInfo", "mergeHeaderCellInfo","currentViewData", "enableAltRow", "enableRTL", "contextClick", "contextOpen", "rowDataBound", "rowTemplate", "detailsDataBound",
            "detailsTemplate", "childGrid", "summaryRows", "toolbarSettings", "editSettings", "allowMultiSorting", "enableAutoSaveOnSelectionChange", "locale",
            "allowCellMerging", "allowTextWrap", "textWrapSettings", "cssClass", "dataSource", "groupSettings.enableDropAreaAutoSizing", "enableRowHover", "showSummary",
            "allowGrouping", "enableHeaderHover", "allowKeyboardNavigation", "scrollSettings.frozenRows", "scrollSettings.frozenColumns", "enableTouch",
            "contextMenuSettings.enableContextMenu", "exportToExcelAction", "exportToWordAction", "exportToPdfAction"
        ],
        ignoreOnExport: [
            "isEdit", "toolbarClick", "query", "queryCellInfo", "selectionType", "currentViewData", "rowDataBound", "rowTemplate",
            "detailsDataBound", "editSettings", "pageSettings", "enableAutoSaveOnSelectionChange", "localization", "allowScrolling",
            "cssClass", "dataSource", "groupSettings.enableDropAreaAnimation", "enableRowHover", "allowSummary",
            "enableHeaderHover", "allowKeyboardNavigation"
        ],
        ignoreOnToolbarServerClick: [],
        observables: ["dataSource", "selectedRowIndex", "pageSettings.currentPage", "selectedRowIndices"],
        _tags: [{
            tag: "columns",
            attr: ["allowEditing", "allowFiltering","allowTextWrap", "filterType", "allowGrouping","allowResizing","allowSorting", "cssClass", "customAttributes", "dataSource", "defaultValue",
			"disableHtmlEncode", "editTemplate", "editType", "foreignKeyField", "foreignKeyValue", "headerTemplateID", "headerText", "isFrozen",
			"isIdentity", "isPrimaryKey","filterBarTemplate","filterOperator", "textAlign", "templateID", "textAlign", "headerTextAlign", "tooltip", "clipMode",
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
        _dataSource: ej.util.valueFunction("dataSource"),
        _selectedRow: ej.util.valueFunction("selectedRowIndex"),
        _selectedMultipleRows: ej.util.valueFunction("selectedRowIndices"),
        _currentPage: ej.util.valueFunction("pageSettings.currentPage"),
        // default model
        defaults: /** @lends ejGrid# */ {            
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
            selectedRowIndices: [],
            allowSearching: false,
            enableToolbarItems:false,            
            enableHeaderHover: false,            
            allowReordering: false,            
            allowKeyboardNavigation: true,
            allowRowDragAndDrop: false,
            enableTouch: true,
			enableLoadOnDemand: false,
            columnLayout:'auto',            
            selectionType: "single",            
            dataSource: null,            
            cssClass: "",            
            allowScrolling: false,            
            locale: "en-US",            
            enableAutoSaveOnSelectionChange: true,            
            allowMultiSorting: false,
            exportToExcelAction: "ExportToExcel",
            exportToWordAction: "ExportToWord",
            exportToPdfAction: "ExportToPdf",
            _groupingCollapsed: [],
            _isHeightResponsive: false,
            _checkSelectedRowsIndexes: [],
            editSettings:  {                
                allowEditing: false,                
                showAddNewRow: false,                
                allowAdding: false,                
                showAddNewRow: false,                
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
            selectionSettings:  {                
                selectionMode: ["row"],                
                enableToggle: false,                
                allowDragSelection:false,  
                cellSelectionMode: "flow"
            },
            resizeSettings: {
                resizeMode: 'normal'
            },
            pageSettings:  {               
                pageSize: 12,                
                pageCount: 8,                
                currentPage: 1,                
                totalPages: null,                
                enableTemplates: false,                
                showDefaults: false,                
                template: null,      
			     pageSizeList:[],				
                totalRecordsCount: null,                
                enableQueryString: false,
                printMode: "allpages"
            },            
            groupSettings:  {               
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
            filterSettings:  {                
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
            searchSettings:  {                
                fields: [],                
                key: "",                
                operator: "contains",                
                ignoreCase: true
            },            
            sortSettings:  {                                             
                sortedColumns: []
            },            
            toolbarSettings:  {                
                showToolbar: false,                
                toolbarItems: [],                
                customToolbarItems: []
            },            
            minWidth: 0,
            currentIndex: 0,
            rowDropSettings: {
                dragBehavior:"move",
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
            currentViewData: [],            
            detailsTemplate: null,            
            childGrid: null,            
            keySettings: null,            
            rowTemplate: null,            
            detailsDataBound: null,            
            rowDataBound: null,            
            queryCellInfo: null,                      
            mergeCellInfo: null,
            mergeHeaderCellInfo:null,
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
            beforePrint: null,
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
            rowHover: null,
            rowDeselecting:null,
            rowDeselected:null,	            
            cellSelecting: null,            
            cellSelected: null, 
            cellDeselecting:null,
      	    cellDeselected:null,				
            columnSelecting: null,            
            columnSelected: null, 
            columnDeselecting: null,            
            columnDeselected: null,		         
            columnDragStart: null,            
            columnDrag: null,            
            columnDrop: null,
            rowDrag: null,
            rowDragStart: null,
            rowDrop: null,
            beforeRowDrop: null,
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
        },
        dataTypes: {
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
                cellSelectionMode: "enum",
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
			pageSettings:{
				pageSizeList: "array"
			},
            editSettings: {
                editMode: "enum",
                formPosition: "enum",
                rowPosition: "enum",
            },
            rowDropSettings: {
                dragBehavior: "enum"
            },
            searchSettings: {
                fields: "array"
            },
            textWrapSettings: {
                wrapMode: "enum"
            }
        },

        _columns: function (index, property, value, old) {
            var $header = this.element.find(".e-gridheader");
            $header.find("div").first().empty().append(this._renderGridHeader().find("table"));
            this._headerCellgDragDrop();
            this.refreshContent(true);
            this._trigger("refresh");
        },
        _summaryRows: function (index, property, value, old) {
            if (property == "showTotalSummary" || property == "showCaptionSummary") {
                var indx = index.summaryRows;
                var val = value.toLowerCase() == "true" || value.toLowerCase() == "false" ? ej.parseJSON(value) : false;
                this.option("summaryRows")[indx][property] = val;
            }
            this.element.find(".e-gridfooter").remove();
            var footer = this._renderGridFooter();
            if (!ej.isNullOrUndefined(footer)) footer.insertAfter(this.getContent());
            if (property == "showCaptionSummary" || property == "title") {
                this._isCaptionSummary = this.option("summaryRows")[indx]["showCaptionSummary"];
                this.model.showSummary = this._isCaptionSummary;
                if (this.model.groupSettings.groupedColumns.length != 0)
                    this._refreshCaptionSummary();
            }
        },
        _summaryRows_summaryColumns: function (index, property, value, old) {
            if (property == "displayColumn" || property == "dataMember") {
                if (ej.isNullOrUndefined(this.getColumnByField(value)))
                    return;
            }
            this._createSummaryRows(this.getFooterTable());
            if (this.element.find(".e-groupcaptionsummary").length != 0)
                this._refreshCaptionSummary();
        },
        _stackedHeaderRows_stackedHeaderColumns: function (index, property, value, old) {
            this._refreshStackedHeader();
        },
        _sortSettings_sortedColumns: function (index, property, value, old) {
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
        },
        _filterSettings_filteredColumns: function (index, property, value, old) {
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
        },
        _map: function (object, value) {
            var data = $.map(object, function (obj) {
                if (obj === value)
                    return obj;
            });
            return data.length != 0 ? data[0] : null;
        },
        _refreshCaptionSummary: function () {
            var temp = document.createElement('div');
            temp.innerHTML = ['<table>', $.render[this._id + "_GroupingTemplate"](this.model.currentViewData, { groupedColumns: this.model.groupSettings.groupedColumns }), '</table>'].join("");
            this.getContentTable().get(0).replaceChild(temp.firstChild.firstChild, this.getContentTable().get(0).lastChild);
            this.refreshContent();
        },
        
        getContentTable: function () {
            return this._gridContentTable;
        },

        setGridContentTable: function (value) {
            this._gridContentTable = value;
        },
        
        getContent: function () {
            return this._gridContent;
        },

        setGridContent: function (value) {
            this._gridContent = value;
        },
        
        getHeaderContent: function () {
            return this._gridHeaderContent;
        },

        setGridHeaderContent: function (value) {
            this._gridHeaderContent = value;
        },
        
        getHeaderTable: function () {
            return this._gridHeaderTable;
        },

        setGridHeaderTable: function (value) {
            this._gridHeaderTable = value;
        },
        
        getRows: function () {
            return this._gridRows;
        },
        
        getFilteredRecords: function () {
            return this._filteredRecords;
        },
        
        getRowByIndex: function (from, to) {
            try {
                var gridRows = this.getRows(), $gridRows = this._excludeDetailRows(), $row = $();
                if ($.isArray(from)) {
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
        },
        
        getColumnIndexByField: function (field) {
            for (var i = 0, col = this.model.columns, len = col.length ; i < len ; i++) {
                if (col[i]["field"] === field)
                    return i;
            }
            return -1;
        },
        
        getColumnIndexByHeaderText: function (headerText, field) {
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
        },
        
        getIndexByRow: function ($tr) {
            var gridRows = this.getRows(), $gridRows = this._excludeDetailRows(), rowIndex;
            if (this.model.scrollSettings.frozenColumns > 0) {
                rowIndex = $(gridRows[0]).index($tr);
                if (rowIndex == -1)
                    rowIndex = $(gridRows[1]).index($tr);
                return rowIndex;
            } else
                return $gridRows.not(".e-virtualrow").index($tr);
        },
        
        getPrimaryKeyFieldNames: function () {
            if (this._primaryKeys.length != 0)
                return this._primaryKeys;
            for (var key = 0, col = this.model.columns, cLen = col.length; key < cLen; key++) {
                if (col[key]["isPrimaryKey"])
                    this._primaryKeys.push(col[key]["field"]);
            }
            return this._primaryKeys;
        },
        
        getVisibleColumnNames: function (headerText) {
            return this._visibleColumns;
        },
        
        getHiddenColumnNames: function (headerText) {
            return this._hiddenColumns;
        },
        
        getColumnByField: function (field) {
            for (var column = 0; column < this.model.columns.length; column++) {
                if (this.model.columns[column]["field"] == field)
                    break;
            }
            return column == this.model.columns.length ? null : this.model.columns[column];
        },
        
        getsortColumnByField: function (field) {
            for (var column = 0; column < this.model.sortSettings.sortedColumns.length; column++) {
                if (this.model.sortSettings.sortedColumns[column]["field"] == field)
                    break;
            }
            return column == this.model.sortSettings.sortedColumns.length ? null : this.model.sortSettings.sortedColumns[column];
        },
        
        getColumnByHeaderText: function (headerText, field) {
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
        },
        
        getCurrentViewData: function () {
            return this._currentJsonData;
        },
        
        getColumnFieldNames: function () {
            var columnNames = [];
            for (var column = 0; column < this.model.columns.length; column++) {
                if (this.model.columns[column]["field"])
                    columnNames.push(this.model.columns[column]["field"]);
            }
            return columnNames;
        },
        
        getBrowserDetails: function () {
            var b = navigator.userAgent.match(/(firefox|chrome|opera|msie|safari)\s?\/?(\d+(.\d+)*)/i);
            if (!!navigator.userAgent.match(/Trident\/7\./) || !!navigator.userAgent.match(/Edge/))
                return { browser: "msie", version: $.uaMatch(navigator.userAgent).version };
            return { browser: b[1].toLowerCase(), version: b[2] };
        },
        _initPrivateProperties: function () {
            this._groupContextIndex = -1;
            this._dynamicSelectedRowIndex = null;
            this._summaryContextIndex = -1;
            this._showInColumnchooserCol = [];
            this._currentVirtualRowIndex = 0;
			this._isCheckboxChecked=false;
			this._isCheckboxUnchecked=false;
            this._click = 0;
            this._gridPhoneMode = 320;
            this._columntemplaterefresh = false;
			this._tabKey = false;
            this._gridHeaderTable = null;
            this._gridWidth = this.element.width();
            this._id = this.element.attr("id");
            this._gridRows = [];
            this._fltrBarcell = false;
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
			this._$curFilterValue = null;
            this._$prevFieldName = null;
            this._editedData = {};
            this._isEditChangesApplied = false;
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
			this._fkParentTblData =[];
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
            this._LastColumnUnGroup = false;
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
			this._virtaulSel = [];
            this._singleView = false;
			this._dragIndex = null;
			this._dragUpInterval = null;
			this._dragDownInterval = null;
			this._queryCellView = [];
			this._currentPageViews = [];
            this._virtualLoadedPages = [];                                  
            this._currentLoadedIndexes = [];
            this._prevLoadedIndexes = [];
			this._prevVirtualSort = [];
			this._prevVirtualFilter = [];
            this._prevVirtualIndex = 0;
            this._currentVirtualIndex = 1;
            this._virtualRowCount = 0;
            this._virtualSelectedRecords = {};
            this._virtualCheckSelectedRecords = {};
            this._selectionByGrid = false;
            this._enableCheckSelect = false;
            this.checkSelectedRowsIndexes = [];
            this._isMapSelection = false;
            this._selectionMapColumn = null;
            this._selectAllCheck = false;
            this.selectedRowsIndexes = [];
            this.OldfilterValue = null;
            this._isReorder = false;
            this._searchString = "";
            this._searchCount = null;
            this.columnsWidthCollection = [];
            this._Indicator = null;
            this._lastSelectedCellIndex = [];
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
            this._copyBulkEditCellDetails = {
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
			this.commonQuery = this.model.query.clone();
            if (ej.gridFeatures.group) {
                this._rowCol = this._captionSummary();
                this._isCaptionSummary = (this._rowCol != null && this._rowCol.length) > 0 ? true : false;
            }
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
			this._showHideColumns = false;
			this._vCurrentTrIndex = null;
			this._lastVirtualPage = null;
			this._currentVIndex = null;
			if (!this.model.enablePersistence || ej.isNullOrUndefined(this._isHeightResponsive))
	           this._isHeightResponsive = false;
			this._resize = false;
			this._initHeight = 0;
			this._initDataProcessed = false;
			this._menuColTypes = [];
			this._excelColTypes = [];
            this._previousTr = null;
			this._isResized = false;
        },
        _init: function () {
            this._trigger("load");
            if (ej.isNullOrUndefined(this.model.query) || !(this.model.query instanceof ej.Query))
                this.model.query = ej.Query();
            if (!ej.isNullOrUndefined(this.model.parentDetails)) {
                var temp = this.model.queryString, ftemp = this.model.foreignKeyField;
                this.model.query = this.model.query.clone();
                var val = (this.model.parentDetails.parentKeyFieldValue === undefined) ? "undefined" : this.model.parentDetails.parentKeyFieldValue;
                this.model.query.where(ej.isNullOrUndefined(ftemp) ? temp : ftemp, "equal", val, true);
            }
			this._initPrivateProperties();
            if (ej.gridFeatures.common)
                this._initScrolling();            
            if (this.model.enableResponsiveRow)
                this.element.addClass("e-responsive");
            this._checkForeignKeyBinding();
            this._checkDataBinding();
        },
        _initComplexColumn: function (obj, field, cxField) {
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
        },
        _initColumns: function (object) {
            if(this.model.groupSettings.groupedColumns.length){		
			    while (object.items != undefined && object.items[0] instanceof Object)					
					object = object.items[0];
            }		
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
                    else if (this.model.columns[index]["type"] == "date" && this.model.columns[index].format == undefined && this._isReorder != true && this.initialRender && !this._showHideColumns)
                        $.extend(this.model.columns[index], { format: "{0:" + ej.preferredCulture(this.model.locale).calendars.standard.patterns.d + "}" });
                    else if (this.model.columns[index]["type"] == "datetime" && this.model.columns[index].format == undefined && this._isReorder != true && this.initialRender && !this._showHideColumns)
                        $.extend(this.model.columns[index], { format: "{0:" + ej.preferredCulture(this.model.locale).calendars.standard.patterns.d + " " + ej.preferredCulture(this.model.locale).calendars.standard.patterns.t + "}" });
                  }
            }
        },
        _initSelection: function () {
            var mode = this.model.selectionSettings.selectionMode,i;
            for (i = 0; i < mode.length; i++) {
                this["_allow" + mode[i] + "Selection"] = true;
            }
        },
        _checkDataBinding: function () {
            if (!this.model.columns.length && (((this._dataSource() == null || !this._dataSource().length) && !(this._dataSource() instanceof ej.DataManager)) || ((this._dataSource() instanceof ej.DataManager) && this._dataManager.dataSource.url == undefined && !this._dataSource().dataSource.json.length))) {
                this._renderAlertDialog();
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
            if (this.model.toolbarSettings.showToolbar || ((this.model.allowSorting || this.model.allowFiltering) && this.model.enableResponsiveRow)) {
                this.element.append(this._renderToolBar());
                if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 10 && $.inArray("search", this.model.toolbarSettings.toolbarItems) != -1) {
                    var searching = this.element.find('.e-toolbar.e-toolbarspan .e-gridsearchbar');
                    ej.ieClearRemover(searching[0]);
                }
            }
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
            if (this.model.allowPaging){
			 	if(this.model.isResponsive)
                    this.model.pageSettings.isResponsive = true;
                this.element.append(this._renderGridPager());
				if(this.model.pageSettings.isResponsive)
					$(this.element.find(".e-pager")).ejPager('instance')._reSizeHandler();
				if(this.model.filterSettings.filterType == "filterbar" && this.model.filterSettings.filteredColumns.length) {
					var filteredColumns = this.model.filterSettings.filteredColumns;
					for (var i = 0; i < filteredColumns.length; i++) {
						var index = $.inArray(this.getColumnByField(filteredColumns[i].field), this.filterColumnCollection);
						if (filteredColumns[i].field !== "" && index == -1)
							this.filterColumnCollection.push(this.getColumnByField(filteredColumns[i].field));
					}
					this.filterStatusMsg = "";
					this._showFilterMsg();
				}
			}
            if (this.model.contextMenuSettings.enableContextMenu)
                this.element.append(this._renderContext());
            if ($.isFunction($.fn.ejWaitingPopup)) {
                this.element.ejWaitingPopup({ showOnInit: false });
                $("#" + this._id + "_WaitingPopup").addClass("e-gridwaitingpopup");
            }
            if (this.model.scrollSettings.allowVirtualScrolling) {
                this._loadedJsonData = [];
                this._prevPage = 1;
            }
            if (this._dataSource() instanceof ej.DataManager) {
                this.element.ejWaitingPopup("show");
                if (this._dataSource().ready != undefined) {
                    var proxy = this;
                    this._dataSource().ready.done(function (args) {
                        proxy._initDataSource();
                        proxy.model.dataSource = ej.DataManager(args.result);
                    });
                } else {
                    this.element.ejWaitingPopup("show");
                    this._initDataSource();
                }
            } else {
                this._ensureDataSource();
                this._trigger("actionBegin");
                this._setForeignKeyData();
                this._relationalColumns.length == 0 && this._initGridRender();
            }
        },
        _renderColumnChooser: function () {
            var $columnButton = ej.buildTag("button .e-ccButton", this.localizedLabels.Columns, { 'float': (this.model.enableRTL ? 'left' : 'right') }).attr("type", "button");
            this.element.prepend($columnButton);
            $columnButton.ejButton({
                prefixIcon: "e-icon e-down-arrow",
                imagePosition: "imageright",
                contentType: "textandimage",
                type: 'button',
                click: $.proxy(this._ccClickHandler, this),
                width: 90
            });
            var buttHeight = $columnButton.outerHeight();
            $columnButton.css('margin-top', 0 - (buttHeight));
            var elementTop = parseInt(this.element.css('margin-top'),10);
            this.element.css('margin-top', elementTop + buttHeight);
            var $mainDiv = ej.buildTag("div");
            var $outerDiv = ej.buildTag("div .e-grid e-columnChooser", '', {}, { id: this._id + "ccDiv" });
            if ($("#" + this._id + "ccDiv").data("ejDialog") != undefined) {
                $("#" + this._id + "ccDiv").ejDialog("destroy");
                $("#" + this._id + "ccDiv").remove();
            }
            var $searchBox = ej.buildTag("div.e-searchbox e-fields").append(ej.buildTag("input#" + this._id + "_ccSearchBox.e-ejinputtext e-filtertext", {}, {}, { "type": "text" }))
            var $sapnDiv = ej.buildTag('span .e-searchfind e-icon')
            $searchBox.append($sapnDiv);
            var $listOuterDiv = ej.buildTag('div', '', { 'height': '228px' }, { id: this._id + "liScrollerDiv" })
            this._renderColumnChooserData(false);
            $listOuterDiv.append(this._columnChooserList);
            $outerDiv.append($searchBox);
            $outerDiv.append($listOuterDiv);

            var $splitterDiv = ej.buildTag('div .e-columnChooserSplitter', '', { 'border-bottom': '0px' }), $buttonDiv;
            $outerDiv.append($splitterDiv);
            if (this.model.enableRTL) {
                $buttonDiv = ej.buildTag('div .e-ccBtndiv', '', { 'float': 'left', 'margin-top': '7px', 'margin-right': '-13px' });
                var $cancelButton = ej.buildTag("button .e-ccformbtn e-btncan e-flat", this.localizedLabels.Cancel, { 'margin-right': '7px', 'margin-left': '9px' });
                $($sapnDiv).addClass("e-rtl");
            }
            else {
                $buttonDiv = ej.buildTag('div .e-ccBtndiv', '', { 'float': 'right', 'margin-top': '7px' });
                var $cancelButton = ej.buildTag("button .e-ccformbtn e-btncan e-flat", this.localizedLabels.Cancel, { 'margin-right': '7px', 'margin-left': '6px' });
            }
            var $addButton = ej.buildTag("button .e-ccformbtn e-btnsub e-flat", this.localizedLabels.Done);
            $buttonDiv.append($addButton);
            $buttonDiv.append($cancelButton);
            $outerDiv.append($buttonDiv);
            $addButton.ejButton({
                click: $.proxy(this._addButtonCC, this),
                showRoundedCorner: true,
                width: 66
            });
            $cancelButton.ejButton({
                click: $.proxy(this._cancelButtonHandler, this),
                showRoundedCorner: true,
                width: 66
            });
            $outerDiv.insertBefore(this.element)
            $outerDiv.ejDialog({ width: 'auto', beforeClose: $.proxy(this._columnChooserBeforeClose, this), showOnInit: false, allowKeyboardNavigation: false, enableResize: false, "enableRTL": this.model.enableRTL, "cssClass": this.model.cssClass, showHeader: false, width: 260 });
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 10) {
                var searchBox = $(".e-columnChooser").find("input#" + this._id + "_ccSearchBox")[0];
                ej.ieClearRemover(searchBox);
            }
        },
        _renderColumnChooserData: function (refresh) {
            var selectAllCheck = this.model.columns.length == this.getVisibleColumnNames().length;            
            this._ccCheckBoxList = [];
            var $listBox = ej.buildTag("div", '', { 'margin-left': '0px', 'width': '250px' }), count = 0;
            for (var index = -1; index < this.model.columns.length; index++) {
                var isSelectAll = index == -1;
                if (isSelectAll || this.model.columns[index].showInColumnChooser) {
                    var column = this.model.columns[index];
                    var colValue = isSelectAll ? this.localizedLabels["SelectAll"] : ej.isNullOrUndefined(column.headerText) || column.headerText == "" ? column.field == "" ? null : column.field : column.headerText,
                        labelValue = column && column.disableHtmlEncode ? this._htmlEscape(colValue) : colValue;
                    if (!ej.isNullOrUndefined(colValue) || isSelectAll) {
                        var $innerDiv = ej.buildTag('div', '', {}, { 'class': 'e-columnChooserListDiv' });
                        var styleAttr = {};
                        var id = isSelectAll ? this._id + 'selectAll' : this._id + colValue.replace(/\s|\.|[^a-zA-Z0-9]|&nbsp/g, "_");
                        var inDom = $listBox.find("#" + id).length; inDom && count++;
                        var $input = ej.buildTag('input', '', styleAttr, { 'id': (!inDom ? id : id + count + ""), 'value': colValue, 'type': 'checkbox', "ej-field": isSelectAll ? '' : column.field, "ej-headertext": isSelectAll ? '' : column.headerText, 'class': isSelectAll ? 'e-selectall' : '' });
                        var label = ej.buildTag('label', labelValue, { 'font-size': '13px' }, { 'for': (!inDom ? id : id + count + "") });
                        $innerDiv.append($input);
                        $innerDiv.append(label);
                        $listBox.append($innerDiv);
                        var checked = !isSelectAll && !ej.isNullOrUndefined(column.visible) ? column.visible : true;
                        $input.ejCheckBox({
                            checked: isSelectAll ? selectAllCheck : checked,
                            change: $.proxy(this._columnChooserCheckChange, this)
                        });
                        if (!isSelectAll && !ej.isNullOrUndefined(column.visible))
                            $input[column.visible ? "attr" : "removeAttr"]("checked", true);
                    }
                }
               else if(!ej.isNullOrUndefined(this.model.columns[index].showInColumnChooser)){
					var field = ej.dataUtil.distinct(this._showInColumnchooserCol,"field");  
					var fieldIndex = field.indexOf(this.model.columns[index].field);
					if(fieldIndex == -1)			
						this._showInColumnchooserCol.push(this.model.columns[index]);
					else
						this._showInColumnchooserCol[fieldIndex] = this.model.columns[index];
				}
            }
            if (!refresh)
                this._columnChooserList = $listBox;
            else {
                this._columnChooserList.empty().append($listBox.children());
                $("#" + this._id + "liScrollerDiv").is(":visible") && $("#" + this._id + "liScrollerDiv").ejScroller('refresh');
            }
            this._ccCheckBoxList = this._columnChooserList.find("input:checkbox.e-js").not(".e-selectall");
        },
        _checkFinder: function () {
            var $this = $(this), $parent = $this.closest(".e-columnChooserListDiv");
            if ($this.hasClass("e-checkbox") && !$parent.hasClass("e-hide") && $this.prop("checked"))
                return true;
        },
        _displayFinder: function () {            
            return !$(this).closest(".e-columnChooserListDiv").hasClass("e-hide");
        },
        _columnChooserCheckChange: function (args) {
            if (!args.isInteraction) {
                if (args.isChecked)
                    $("#" + this._id + "ccDiv").find("button.e-ccformbtn.e-btnsub").removeClass("e-disable");
             return;
            }
            var checked = args.isChecked, displayedCheckBoxes = this._ccCheckBoxList.filter(this._displayFinder), checkedBoxes = this._ccCheckBoxList.filter(this._checkFinder),
                totalChecks = displayedCheckBoxes.length, checkedLen = checkedBoxes.length;
            if (args.model.id == this._id + 'selectAll') {
                if (!checked)
                    checkedBoxes.ejCheckBox({ checked: checked });                
                else           
                    displayedCheckBoxes.not(":checked").ejCheckBox({ checked: checked });                
            }
            else {
                this._columnChooserList.find('input.e-selectall').ejCheckBox('model.checked', totalChecks == checkedLen);
                checked = checkedLen != 0;
                this.element[checked ? "attr" : "removeAttr"]("checked", true);
            }
            var operation = !(checked || this._showInColumnchooserCol.length) ? "addClass" : "removeClass";
            $("#" + this._id + "ccDiv").find("button.e-ccformbtn.e-btnsub")[operation]("e-disable");
        },
        _columnChooserBeforeClose: function () {
            $(".e-columnChoosertail").remove();
            $(".e-columnChoosertailAlt").remove();
            $("#" + this._id + "ccDiv").find("button.e-ccformbtn.e-btnsub").removeClass("e-disable");
            $("#" + this._id + "_ccSearchBox").val('');
            var args = {};
            args.target = {}; args.target.value = '';
            this._columnChooserSearch(args);
        },
        _columnChooserSearch: function (e) {
            if (e.type == 'click') {
                e.target.value = '';
                $("#" + this._id + "_ccSearchBox").val('');
            }
            var val = e.target.value;
            var span = $("#" + this._id + "_ccSearchBox").next('span');
            if (val != '') {
                span.removeClass("e-searchfind");
                span.addClass("e-cancel");
            }
            else {
                span.removeClass("e-cancel");
                span.addClass("e-searchfind");
            }
            $(".e-cancel").on('click', $.proxy(this._columnChooserSearch, this));
            var currentCheckedItemsData = this.model.columns;
            var columnCollection = [], gridColumns = [], tempCollection = [], proxy = this, 
                isHiddenByGroup = function (field) {
                    var model = proxy.model.groupSettings;
                    return !model.showGroupedColumn && $.inArray(field, model.groupedColumns) > -1;
                };
            if (val != '') {
                currentCheckedItemsData = ej.DataManager(this.model.columns).executeLocal(ej.Query().where("headerText", ej.FilterOperators.startsWith, val, true));
                tempCollection = ej.DataManager(this.model.columns).executeLocal(ej.Query().where("field", ej.FilterOperators.startsWith, val, true));
                tempCollection.forEach(function (obj) {
                    if (obj.headerText == "" && $.inArray(obj, currentCheckedItemsData) == -1)
                        currentCheckedItemsData.push(obj);
                })
            }
             currentCheckedItemsData.forEach(function (obj) {
                 if (obj.showInColumnChooser && !isHiddenByGroup(obj.field)) {
                    var headerText = ej.isNullOrUndefined(obj.headerText) || obj.headerText == "" ? obj.field == "" ? null : obj.field : obj.headerText;
                    columnCollection.push(headerText);
                }
            });
            if (!ej.isNullOrUndefined($("#nomatches")[0]))
                $("#nomatches").remove();
       
            var divs = this._columnChooserList.find(".e-columnChooserListDiv");

            for (var i = 0; i < this.model.columns.length; i++) {
                if (this.model.columns[i].showInColumnChooser && !ej.isNullOrUndefined(this.model.columns[i].headerText)) {
                    if (this.model.columns[i].headerText != "")
                        gridColumns.push(this.model.columns[i].headerText)
                    else if (this.model.columns[i].field != "")
                        gridColumns.push(this.model.columns[i].field)
                }
            }

            for (var index = 0; index < gridColumns.length; index++) {
                var colValue = gridColumns[index];
                var indx = columnCollection.indexOf(colValue)
                if (!ej.isNullOrUndefined(colValue))
                    divs.eq(index + 1)[indx == -1 ? "addClass" : "removeClass"]("e-hide");
            }

            if (columnCollection.length == 0) {
               this._emptyColumnChooserData();
            }
            var checkDisplay = this._ccCheckBoxList.filter(this._displayFinder).length, checkChecked = this._ccCheckBoxList.filter(this._checkFinder).length, isChk = checkChecked == checkDisplay;
            if (columnCollection.length)
                divs.eq(0).find("input.e-js").ejCheckBox({ checked: isChk });
            divs.eq(0)[columnCollection.length == 0 ? "addClass" : "removeClass"]("e-hide");
            $("#" + this._id + "ccDiv").find("button.e-ccformbtn.e-btnsub")[!checkChecked ? "addClass" : "removeClass"]("e-disable");
            $("#" + this._id + "liScrollerDiv").ejScroller('refresh');
        },
        _addButtonCC: function () {
            this._visibleColumns = [];
            this._hiddenColumns = [];
            this._visibleColumnsField = [];
            this._hiddenColumnsField = [];
            this._columnChooserClick = true;
            var args = {}; args.requestType = "columnchooser";
			this._columnChooser = true;
            var chbxs = this._columnChooserList.find("input:checkbox.e-js").not('.e-selectall');
            for (var i = 0, len = chbxs.length; i < len; i++) {
                var ele = $(chbxs[i]), hTxt = ele.attr("ej-headertext"), field = ele.attr("ej-field");
                if(this._id+"selectAll"!=ele.attr("id")){
                    this[chbxs[i].checked ? "_visibleColumns" : "_hiddenColumns"].push(hTxt);
                    this[chbxs[i].checked ? "_visibleColumnsField" : "_hiddenColumnsField"].push(field != "" ? field : hTxt);
                }
            }
            for (var i = 0, len = this._showInColumnchooserCol.length; i < len; i++) {
                var column = this._showInColumnchooserCol[i], htext = column.headerText, field = column.field;
                this[column["visible"] ? "_visibleColumns" : "_hiddenColumns"].push(htext);
                this[column["visible"] ? "_visibleColumnsField" : "_hiddenColumnsField"].push(field != "" ? field : htext);
            }
            var array1 = this._visibleColumns;
            var array2 = this._hiddenColumns;
            var arr = [], obj, duparr;
            obj = $.merge($.merge([], array1), array2);
            duparr = this._isDuplicate(obj);
            this._trigger("actionBegin", args);
            if (duparr) {
                this.showColumns(this._visibleColumnsField);
                this.hideColumns(this._hiddenColumnsField);
            }
            else {
                this.showColumns(this._visibleColumns);
                this.hideColumns(this._hiddenColumns);
            }
            $("#" + this._id + "ccDiv").ejDialog('close');
            $(".e-columnChoosertail").remove();
            this.refreshScrollerEvent();
            args = { requestType: "columnchooser", removedcolumns: [], addedcolumns: [], visiblecolumns: this.getVisibleColumnNames(), hiddencolumns: this.getHiddenColumnNames() };
            this._ccColumnUpdate(args.addedcolumns, this.getVisibleColumnNames(), this._ccVisibleColumns);
            this._ccColumnUpdate(args.removedcolumns, this.getHiddenColumnNames(), this._ccHiddenColumns);
            this._trigger("actionComplete", args);
            this._columnChooser = false;
        },
        _ccColumnUpdate: function (args, getColumns, ccColumns) {
            for (var i = 0; i < getColumns.length; i++) {
                if ($.inArray(getColumns[i], ccColumns) == -1)
                    args.push(getColumns[i]);
            }
        },
        _isDuplicate: function (arr) {
            var temp, count = {}, duplicate = [];
            for (var i = 0; i < arr.length; i++) {
                temp = arr[i];
                if (count[temp] >= 1)
                    count[temp] = count[temp] + 1;
                else
                    count[temp] = 1;
            }
            for (temp in count) {
                if (count[temp] > 1)
                    return true;
            }
            return false;
        },
        _cancelButtonHandler: function () {
            $("#" + this._id + "ccDiv").ejDialog('close');
            $(".e-columnChoosertailAlt").remove();
            $(".e-columnChoosertail").remove();
        },
        _ccClickHandler: function (e) {
            var dlgWidth = 230, xPos;
            var chooserButton = this.element.find(".e-ccButton");
            xPos = chooserButton.offset().left + chooserButton.width();
            var dialogObj = $("#" + this._id + "ccDiv").data('ejDialog')
            if (dialogObj && dialogObj.isOpened()) {
                dialogObj.close();
                $(".e-columnChoosertail").remove();
                $(".e-columnChoosertailAlt").remove();
            }
            else {
                $("#" + this._id + "ccDiv").ejDialog({ width: '230px', height: '310px', position: { X: (this.model.enableRTL ? (xPos - dlgWidth + 143) : (xPos - dlgWidth)), Y: chooserButton.offset().top + 35 } })
                   .ejDialog("open");
                var maxZindex = parseInt($("#" + this._id + "ccDiv_wrapper").css('z-index'));
                var $tailDiv = ej.buildTag("div #" + this._id + "_ccTail .e-columnChoosertail", '', { 'display': 'block', 'position': 'absolute', 'left': (this.model.enableRTL ? (xPos - 78) : (xPos - 29)), 'top': chooserButton.offset().top + 15 });
                var $tailDiv2 = ej.buildTag("div #" + this._id + "_ccTailAlt .e-columnChoosertailAlt", '', { 'display': 'block', 'z-index': maxZindex + 2, 'position': 'absolute', 'left': (this.model.enableRTL ? (xPos - 78) : (xPos - 29)), 'top': chooserButton.offset().top + 16 });
                $tailDiv.insertBefore($("#" + this._id + "ccDiv_wrapper"));
                $tailDiv2.insertBefore($("#" + this._id + "ccDiv_wrapper"));
            }
            this._refreshColumnChooserList();
            this._ccVisibleColumns = this.getVisibleColumnNames();
            this._ccHiddenColumns = this.getHiddenColumnNames();
            $("#" + this._id + "liScrollerDiv").ejScroller({ height: '228', width: '228', buttonSize: 0 });
            $("#" + this._id + "liScrollerDiv").ejScroller('refresh');
            if (!ej.isIOSWebView() && this.getBrowserDetails().browser == 'chrome')
                $('.e-columnChooser .e-hscrollbar').attr('style', 'height: 10px !important;');
            $(".e-ejinputtext").on('keyup', $.proxy(this._columnChooserSearch, this))
        },
        _refreshColumnChooserList: function (collection) {
            var chbxs = this._columnChooserList.find("input:checkbox.e-js").not('.e-selectall');
			var duparr = this._isDuplicate($.merge($.merge([], this._visibleColumns), this._hiddenColumns));
            for (var i = 0, len = chbxs.length; i < len; i++) {
                var ele = $(chbxs[i]), hTxt = ele.attr("ej-headertext"), field = ele.attr("ej-field"), flag = undefined, isDup = chbxs.filter('[ej-headertext="' + hTxt + '"]').length;
                if (this.model.allowGrouping && !this.model.groupSettings.showGroupedColumn && $.inArray($(chbxs[i]).attr("ej-field"), this.model.groupSettings.groupedColumns) != -1) {
                    $(chbxs[i]).parents(".e-columnChooserListDiv").addClass("e-hide");
                    chbxs[i].checked = false;
				if(this._columnChooserList.find(".e-columnChooserListDiv").eq(0).hasClass("e-hide") && this.model.columns.length > this.model.groupSettings.groupedColumns.length)
					this._columnChooserList.find(".e-columnChooserListDiv").eq(0).removeClass("e-hide")
             
                }
                else {
                    $(chbxs[i]).parents(".e-columnChooserListDiv").removeClass("e-hide");
                    chbxs[i].checked = true;
                }
                var colValue = duparr ? (field == "" ? hTxt : field) : hTxt;
				flag = this[duparr ? "_hiddenColumnsField" : "_hiddenColumns"].indexOf(colValue) != -1;
                ele["prop"]("checked", !flag);
                ele.ejCheckBox("model.checked", !flag);
            }
            var chkSelectAll = chbxs.filter(this._displayFinder).length == chbxs.filter(this._checkFinder).length && chbxs.filter(this._displayFinder).length ? true : false;
            this._columnChooserList.find("input:checkbox.e-selectall").ejCheckBox({ checked: chkSelectAll });
            if (!this.model.groupSettings.showGroupedColumn) {
				if (!ej.isNullOrUndefined($("#nomatches")[0]))
					$("#nomatches").remove();
			if(this.model.columns.length == this.model.groupSettings.groupedColumns.length){
					this._columnChooserList.find(".e-columnChooserListDiv").eq(0).addClass("e-hide")
					this._emptyColumnChooserData();
				}
                var enable = chbxs.filter(this._displayFinder).length > 0 ? true : false;
                $("#" + this._id + "ccDiv").find("button.e-ccformbtn.e-btnsub").ejButton({ enabled: enable })
            }
        },
		_emptyColumnChooserData:function(){
            var $labeldiv = ej.buildTag('div#nomatches', '', { 'padding-left': '13px' });
			var div = $("#" + this._id + "ccDiv").find("#" + this._id + "liScrollerDiv")
            var $label = ej.buildTag('span', this.localizedLabels.NoResult);
            $labeldiv.append($label);
            $(div).append($labeldiv);
		},
        _initDataSource: function () {
            this._isLocalData = (!(this._dataSource() instanceof ej.DataManager) || (this._dataSource().dataSource.offline || this._isRemoteSaveAdaptor || this._dataSource().adaptor instanceof ej.ForeignKeyAdaptor));
            if (this._dataSource().adaptor instanceof ej.SqlDataSourceAdaptor) this._isLocalData = false;
            this._ensureDataSource();
            this._trigger("actionBegin");
            var queryPromise = this._dataSource().executeQuery(this.model.query), subPromises, proxy = this;
            if (this._dataManager.dataSource.table != null)
                this._dataManager.dataSource.table.css("display", "none");
            if (!this.element.is(":visible"))
                this.element.ejWaitingPopup("hide");
            queryPromise.done(ej.proxy(function (e) {
                if (!this._initDataProcessed) {
                    this._initDataProcess(e);
                    this._initDataProcessed = true;
                }
            }, this));
            var proxy = this;
            queryPromise.fail(function (e) {
                if (ej.isNullOrUndefined(proxy.element))
                    return;
                proxy.element.ejWaitingPopup("hide");
                proxy.model.currentViewData = [];
                proxy._gridRecordsCount = 0;
                proxy._renderGridContent().insertAfter(proxy.element.children(".e-gridheader"));
                var args = { error: e.error };
                proxy._trigger("actionFailure", args)
            })
        },
        _initDataProcess: function(e, args){
            if (ej.isNullOrUndefined(this.element))
                return;
            this._relationalColumns.length == 0 && this.element.ejWaitingPopup("hide");
            if (!this.model.columns.length && !e.count) {
                var lastPage = (e.count % this.model.pageSettings.pageSize == 0) ? (e.count / this.model.pageSettings.pageSize) : (parseInt(e.count / this.model.pageSettings.pageSize, 10) + 1);
                if (this._currentPage() > lastPage)
                    this._currentPage(lastPage);
                this._renderAlertDialog();
                this._alertDialog.find(".e-content").text(this.localizedLabels.EmptyDataSource);
                this._alertDialog.ejDialog("open");
                this.element.ejWaitingPopup("hide");
                return;
            }
            if (!ej.isNullOrUndefined(e.aggregates))
                this._remoteSummaryData = e.aggregates;
            if (!this.model.scrollSettings.enableVirtualization)
                this.model.currentViewData = e.result;
            if (this._$fkColumn && this.model.filterSettings.filteredColumns.length > 0 && this.model.filterSettings.filterType == "excel")
                this._fkParentTblData = e.result;
            if (!this.model.enablePersistence && this.model.pageSettings.totalRecordsCount != null && this.model.filterSettings.filteredColumns.length == 0)
                this._gridRecordsCount = this.model.pageSettings.totalRecordsCount;
            else if (e.count == 0 && e.result.length)
                this._gridRecordsCount = e.result.length;
            else
                this._gridRecordsCount = e.count;
            if (this.model.filterSettings.filteredColumns.length > 0)
                this._filteredRecordsCount = e.count;
            if (this.getPager() != null)
                this.model.pageSettings.totalRecordsCount = this._gridRecordsCount;
            if (this.model.allowScrolling && this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization) {
                this._refreshVirtualViewDetails();
                if (this._isInitNextPage || this._remoteRefresh) {
                    this._setInitialCurrentIndexRecords(e.result, this._currentPage());
                    this._isInitNextPage = this._remoteRefresh = false;
                }
                else
                    this._setVirtualLoadedRecords(e.result, this._currentPage());
                if (this._isThumbScroll && !this._checkCurrentVirtualView(this._virtualLoadedRecords, this._currentVirtualIndex))
                    this._checkPrevNextViews(this._currentPage());
                if (this.initialRender) {
                    this.model.currentViewData = [];
                    for (var i = 0; i < this._currentLoadedIndexes.length; i++) {
                        var currentView = this._currentLoadedIndexes[i];
                        $.merge(this.model.currentViewData, this._virtualLoadedRecords[currentView] || []);
                    }
                }
                else
                    this.model.currentViewData = e.result;
            }
			this.model.groupSettings.groupedColumns.length && this._setAggregates();
            this._setForeignKeyData(args);
            this._relationalColumns.length == 0 && this._initGridRender();
        },
        _initialRenderings: function () {
            if (this.model.groupSettings.groupedColumns.length) {
                var sortedColumns = new Array();
                for (var i = 0; i < this.model.sortSettings.sortedColumns.length; i++) {
                    if (ej.isNullOrUndefined(this.model.sortSettings.sortedColumns[i].direction))
                        this.model.sortSettings.sortedColumns[i].direction = ej.sortOrder.Ascending;
                    sortedColumns.push(this.model.sortSettings.sortedColumns[i].field);
                }
                if(this.model.allowGrouping){
					for (var i = 0; i < this.model.groupSettings.groupedColumns.length; i++) {
						if ($.inArray(this.model.groupSettings.groupedColumns[i], sortedColumns) == -1)
							this.model.sortSettings.sortedColumns.push({ field: this.model.groupSettings.groupedColumns[i], direction: ej.sortOrder.Ascending });
					}
                }
            }
        },
        _getExpands: function (field, arr) {
            var splits = field.split('.'), tmp = "";
            splits.splice(splits.length - 1, 1);
            for (var i = 0; i < splits.length; i++, tmp = "") {
                for (var j = 0; j < i; j++)
                    tmp += splits[j] + "/";
                tmp = tmp + splits[i];
                if (arr.indexOf(tmp) === -1)
                    arr.push(tmp);
            }
        },
        _renderAfterColumnInitialize: function () {
            this.element.append(this._renderGridHeader());
            if (this.model.allowFiltering && this.model.filterSettings.filterType == "filterbar") {
                this._renderFiltering();
                this._renderFilterBarTemplate();
            }
			if(this.model.gridLines != "both")
				this._showHeaderGridLines();
            if (this.model.allowPaging)
                this.element.append(this.element.find(".e-pager").first());
        },
        _ensureDataSource: function (args) {
            if (this._dataSource() == null && !(this._dataSource() instanceof ej.DataManager)) {
                if (!ej.isNullOrUndefined(args) && args.requestType == "add")
                    this.dataSource([]);
                else
                    return;
            }
            this.model.query.requiresCount();
            var queryManagar = this.model.query;
            var cloneQuery = queryManagar.clone();           
            if (this._isLocalData && (this.model.editSettings.allowEditing || this.model.editSettings.allowAdding) && (!ej.isNullOrUndefined(this._cModifiedData) || !ej.isNullOrUndefined(this._cAddedRecord))) {
                if (ej.isNullOrUndefined(this._cAddedRecord)) {
                    for (var index = 0; index < this._primaryKeys.length; index++)
                        queryManagar = queryManagar.where(this._primaryKeys[index], ej.FilterOperators.equal, this._primaryKeyValues[index]);
                    var currentData = this._dataManager.executeLocal(queryManagar);
                    if (!(this._dataSource() instanceof ej.DataManager))
                        ej.copyObject(this._dataSource()[$.inArray(currentData.result[0], this._dataSource())], this._cModifiedData);
                    else
                        ej.copyObject(this._dataSource().dataSource.json[$.inArray(currentData.result[0], this._dataSource().dataSource.json)], this._cModifiedData);
                    this._cModifiedData = null;
                } else {
                    var tmpRcrd = this._cAddedRecord;
                    this._cAddedRecord = null;
                    (this._dataSource() instanceof ej.DataManager) ? this._dataSource().dataSource.json.unshift(tmpRcrd) : this._dataSource(undefined, true).splice(0, 0, tmpRcrd);
                }
                queryManagar.queries = cloneQuery.queries;
                if (!(this.model.editSettings.showAddNewRow && this.model.editSettings.editMode == "normal"))
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
            if (this.model.scrollSettings.allowVirtualScrolling && args && (args.requestType == "save" || args.requestType == "cancel" || args.requestType == "delete")) {
                this._virtualDataRefresh = true;
                this._refreshVirtualViewData();
            }
            if (this.model.sortSettings.sortedColumns.length) {
                 var sortedGrp = [], sortedColumns = this.model.sortSettings.sortedColumns;
                for (var i = sortedColumns.length - 1; i >= 0; i--){
                    if(this.model.groupSettings.groupedColumns.indexOf(sortedColumns[i].field) == -1){
                        queryManagar.sortBy(sortedColumns[i].field, sortedColumns[i].direction);
						if(this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization && $.inArray(sortedColumns[i], this._prevVirtualSort) == -1){
							for(var j = 0; j < this._prevVirtualSort.length; j++){
								if(sortedColumns[i].field == this._prevVirtualSort[j].field)
									this._prevVirtualSort.splice(j, 1);
							}
							this._needVPaging = this._currentVirtualIndex * this._virtualRowCount % this.model.pageSettings.pageSize <= this._virtualRowCount;
							this._prevVirtualSort.push(sortedColumns[i]);	
							this._virtualDataRefresh = true;
							this._refreshVirtualViewData();							
						}
					}
                    else
                        sortedGrp.push({field: sortedColumns[i].field, direction: sortedColumns[i].direction })
                }
                if (this.model.scrollSettings.virtualScrollMode == "continuous" && !ej.isNullOrUndefined(args) && args.requestType == "sorting") {
                    this._currentPage(1);
                }
                for (var j = 0; j < sortedGrp.length ; j++){
                    queryManagar.sortBy(sortedGrp[j].field, sortedGrp[j].direction);
                }
            }

            if (this.model.allowSearching && this.model.searchSettings.key.length) {
                var searchDetails = this.model.searchSettings;
                searchDetails.fields = searchDetails.fields.length != 0 ? searchDetails.fields : this.getColumnFieldNames();
                queryManagar.search(searchDetails.key, searchDetails.fields, searchDetails.operator || "contains", searchDetails.ignoreCase);
                if (!this.initialRender && args.requestType == "searching")
                    this._currentPage(1);
            }
            if (this._isLocalData && this.model.allowSearching)
                this._filteredRecords = this.model.searchSettings.key.length != 0 ? this._dataManager.executeLocal(queryManagar).result : [];
            if (this.model.allowFiltering && this.model.filterSettings.filteredColumns.length) {
                var predicate, firstFilterCondition = this.model.filterSettings.filteredColumns[0];
                var filteredColumns = this.model.filterSettings.filteredColumns;
                for (var i = 0; i < filteredColumns.length; i++) {
                    var index = $.inArray(this.getColumnByField(filteredColumns[i].field), this.filterColumnCollection);
                    if (filteredColumns[i].field !== "" && index == -1)
                        this.filterColumnCollection.push(this.getColumnByField(filteredColumns[i].field));
                }
				if ((this._isExcelFilter || this._excelFilterRendered) && !(firstFilterCondition instanceof ej.Predicate)) {
                    this._excelFilter.getPredicate(filteredColumns, null, true);
                    var predicates = this._excelFilter._predicates[0];
                    for (var prop in predicates) {
                        var obj = predicates[prop], isTake = obj["from"] != undefined;
                        if (isTake)
                            queryManagar.skip(obj["from"] == "top" ? 0 : this._gridRecordsCount - obj["take"]).take(obj["take"]);
                        else
                            predicate = predicate != undefined ? predicate["and"](obj) : obj;
                    }
                }
                else {
                    if (!(firstFilterCondition instanceof ej.Predicate))
                        predicate = ej.Predicate(firstFilterCondition.field, firstFilterCondition.operator, firstFilterCondition.value, !firstFilterCondition.matchcase);
                    else {
                        predicate = firstFilterCondition;
                        if (this._excelFilterRendered) {
                            var dis = ej.distinct(filteredColumns, "field", false);
                            this._excelFilter._predicates[0] = this._excelFilter._predicates[0] || {};
                            this._excelFilter._predicates[0][dis[0]] = predicate;
                        }
                    }
                    for (var i = 1; i < filteredColumns.length; i++) {
                        if (!(filteredColumns[i] instanceof ej.Predicate)) {
                            if (!this._isLocalData && filteredColumns.length > 2 && i > 1 && filteredColumns[i].predicate == "or")
                                predicate.predicates.push(ej.Predicate(filteredColumns[i].field, filteredColumns[i].operator, filteredColumns[i].value, filteredColumns[i].ignoreCase || !filteredColumns[i].matchcase));
                            else
                                predicate = predicate[filteredColumns[i].predicate || "and"](filteredColumns[i].field, filteredColumns[i].operator, filteredColumns[i].value, !filteredColumns[i].matchcase);
                        }
                        else
                            predicate = predicate[filteredColumns[i].predicate || "and"](filteredColumns[i]);
                    }
                }
                predicate && queryManagar.where(predicate);
                if (this._isLocalData) {
                    var fresults = this._dataManager.executeLocal(queryManagar);
                    this._filteredRecordsCount = isTake ? fresults.result.length : fresults.count;
                    var lastPage = (this._filteredRecordsCount % this.model.pageSettings.pageSize == 0) ? (this._filteredRecordsCount / this.model.pageSettings.pageSize) : (parseInt(this._filteredRecordsCount / this.model.pageSettings.pageSize, 10) + 1);
                    if (this._currentPage() > lastPage)
                        this._currentPage(lastPage);
                    this._filteredRecords = this._dataManager.executeLocal(queryManagar).result;
                    if (this._$fkColumn && this.model.filterSettings.filteredColumns.length > 0 && this.model.filterSettings.filterType == "excel")
                        this._fkParentTblData  = this._filteredRecords;
                } else if (!ej.isNullOrUndefined(args) && args.requestType == ej.Grid.Actions.Filtering)
                    this._currentPage(1);
				if(this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization){
					for(var i = 0; i < filteredColumns.length; i++){
						for(var j = 0; j < this._prevVirtualFilter.length; j++){
							if(filteredColumns[i] == this._prevVirtualFilter[j] && args.requestType == ej.Grid.Actions.Filtering)
								this._prevVirtualFilter.splice(j, 1);
						}
						if($.inArray(filteredColumns[i], this._prevVirtualFilter) == -1){
							this._prevVirtualFilter.push(filteredColumns[i]);	
							this._gridRecordsCount = this._filteredRecordsCount;
							this._refreshViewPageDetails();							
							this._refreshVirtualViewData();
							this._refreshVirtualViewDetails();							 
						}
					}
				}
            }
			if (this._isLocalData && this.model.allowFiltering && this.model.filterSettings.filteredColumns.length==0){
				if(!ej.isNullOrUndefined(this._filteredRecordsCount) || this._filteredRecordsCount > 0){
					if(this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization){
						this._refreshViewPageDetails();
						this._refreshVirtualViewDetails(true);						
					}
					this._filteredRecordsCount = null;
					this._filteredRecords = [];
				}
			}

            if (this.model.summaryRows.length) {
                this._setSummaryAggregate(queryManagar);
            }

            if (this.model.allowPaging || (this.model.scrollSettings.allowVirtualScrolling && this.model.allowScrolling && !this.model.scrollSettings.enableVirtualization)) {
                if (this._isLocalData) {
                    var fresults = this._dataManager.executeLocal(queryManagar);
                    this._recordsCount = fresults.count;
                    var lastPage = (this._recordsCount % this.model.pageSettings.pageSize == 0) ? (this._recordsCount / this.model.pageSettings.pageSize) : (parseInt(this._recordsCount / this.model.pageSettings.pageSize, 10) + 1);
                    if (this._currentPage() > lastPage)
                        this._currentPage(lastPage);
                }
                if (this._currentPage() == 0) {
                    if (this._prevPageNo == 0 || this._prevPageNo == null)
                        this._currentPage(1);
                    else
                        this._currentPage(this._prevPageNo);
                }
                if (!this._isLocalData && !this.initialRender && !ej.isNullOrUndefined(args) && args.requestType == "refresh") {
                    if (cloneQuery.queries.length) {
                        for (i = 0; i < cloneQuery.queries.length; i++) {
                            if (cloneQuery.queries[i].fn == "onWhere")
                                this._currentPage(1);
                        }
                    }
                }
                queryManagar.page(this._currentPage(), this.model.pageSettings.pageSize);
            }
			
			 if (this.model.allowScrolling && this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization) {                              
                this._needPaging = true; 				
                if (this.initialRender && this.model.currentIndex > 1 && (this.model.currentIndex <= this._getVirtualTotalRecord() || !this._isLocalData)) { 					
					if(this.model.scrollSettings.virtualScrollMode == "continuous")
						this.model.currentIndex = 1;
                    this._currentVirtualIndex = Math.ceil(this.model.currentIndex / this._virtualRowCount);
                    this._isThumbScroll = true;
                    this._currentPage(Math.ceil(this.model.currentIndex / this.model.pageSettings.pageSize));
					this._virtualLoadedPages.push(this._currentPage());
                }
				if(this._virtualDataRefresh){					
                    this._isThumbScroll = true;
					this._refreshVirtualViewData(true);
					this._gridRecordsCount = this._dataSource() !== null ? (this.model.pageSettings.totalRecordsCount == null ? this._dataSource().length : this.model.pageSettings.totalRecordsCount) : 0;
                    this._currentPage(Math.ceil(this._currentVirtualIndex * this._virtualRowCount / this.model.pageSettings.pageSize));
					this._virtualLoadedPages.push(this._currentPage());					
				}
                if(this.model.virtualLoading != null)
                    this._gridRecordsCount = this.model.pageSettings.totalRecordsCount;
				if(this.model.filterSettings.filteredColumns == 0 && this._prevVirtualFilter.length){
					this._refreshVirtualViewData();
					this._prevVirtualFilter = [];
				}									
				if(this._isLocalData && this.initialRender)
				    this._refreshVirtualViewDetails();
				if((this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization && this.model.allowSearching && !ej.isNullOrUndefined(args) && args.requestType == "searching")){	
					this._refreshVirtualViewData();
					this._refreshVirtualViewDetails();	
				}
				this._getVirtualLoadedRecords(queryManagar);
            }	

            if (this.model.allowGrouping) {
                var cloned = queryManagar.clone();
                if (this.model.allowPaging && this.model.groupSettings.groupedColumns.length) {
                    cloned.queries = cloned.queries.slice(0, cloned.queries.length - 1);
                }
                for (var i = 0; i < this.model.groupSettings.groupedColumns.length; i++) {
                    var colName = this.model.groupSettings.groupedColumns[i], col = this.getColumnByField(colName);
                    if (!ej.isNullOrUndefined(col) && !ej.isNullOrUndefined(col.enableGroupByFormat) && col.enableGroupByFormat) {
                        queryManagar.group(colName, ej.proxy(this._formatGroupColumn, this));
                        cloned.group(colName, ej.proxy(this._formatGroupColumn, this));
                    }
                    else {
                        queryManagar.group(colName);
                        cloned.group(colName);
                    }
                }
                if (this.model.groupSettings.groupedColumns.length)
                    this._setAggreatedCollection(cloned);
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
                if (this._isLocalData) {
                var dataMgrJson = this._dataManager.dataSource.json;
                var dataSource = this._dataSource().dataSource;
                if (!ej.isNullOrUndefined(dataSource) && this._dataSource() instanceof ej.DataManager)
                    this._dataManager.dataSource.json = dataMgrJson != dataSource.json ? dataSource.json : dataMgrJson;
                var result = this._dataManager.executeLocal(queryManagar);
				if(!this.model.scrollSettings.enableVirtualization || this._virtualDataRefresh){
					if (!(!ej.isNullOrUndefined(args) && args.requestType == "beginedit")) {
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
							this.model.currentViewData = this._lastVirtualPage = lastPageResult.result;
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
					}
					else
						this.model.currentViewData = result.result;
				}
                this._gridRecordsCount = result.count;
                this._remoteSummaryData = result.aggregates;
                this._searchCount = this._searchString.length ? result.count : null;
                this.model.groupSettings.groupedColumns.length && (!(this._dataSource() instanceof ej.DataManager) || !this.initialRender) && this._setAggregates();
            }
        },
        _formatGroupColumn: function (value,field) {
            var col = this.getColumnByField(field), format;
            format = col.format;
            var toformat = new RegExp("\\{0(:([^\\}]+))?\\}", "gm");
            format = toformat.exec(format)[2];
            return ej.format(value, format, this.model.locale);
        },
		_refreshViewPageDetails: function(){
			this._currentPage(1);
			this.model.currentIndex = 0;
			this._currentVirtualIndex = 1;
			this.getContent().ejScroller("model.scrollTop", 0);
		},
		_refreshVirtualViewDetails: function (dataRefreshed) {
		    var dataSrc = this._dataSource();
			if(dataRefreshed)
			    this._gridRecordsCount = dataSrc !== null ? dataSrc instanceof ej.DataManager ? dataSrc.dataSource.json.length : dataSrc.length : this.model.pageSettings.totalRecordsCount;
			this._totalVirtualViews = Math.ceil(this._getVirtualTotalRecord() / this._virtualRowCount);
			this._maxViews = Math.ceil(this.model.pageSettings.pageSize / this._virtualRowCount);			
			this.model.pageSettings.totalPages = Math.ceil(this._gridRecordsCount / this.model.pageSettings.pageSize);
			this.model.pageSettings.totalRecordsCount = this._gridRecordsCount;			
			this._lastViewData = this._virtualRowCount - ((this._totalVirtualViews * this._virtualRowCount) - this._getVirtualTotalRecord());		
		},
		_getVirtualLoadedRecords: function (queryManagar) {                                        
            var currentPage = this._currentPage(), needTwoPage;
			if (this._needPaging){
				this._isLastVirtualpage = needTwoPage = this._isThumbScroll && currentPage == this.model.pageSettings.totalPages && !this._virtualPageRecords[currentPage];				
				if(this.initialRender || this._virtualDataRefresh) needTwoPage = true;
				if (this.model.virtualLoading && this._isLocalData && (this.model.currentIndex != 0 || currentPage != 1) && this.model.currentIndex < this.model.pageSettings.totalRecordsCount)
					this._getVirtualOnLoadingData(currentPage, !needTwoPage);
				else
					this._setVirtualPaging(queryManagar, currentPage, !needTwoPage);
				if(!this.initialRender && this._isThumbScroll && this._virtualPageRecords[currentPage] && !this._virtualDataRefresh)
					this._checkPrevNextViews(currentPage, queryManagar);
			}		                            
			this._needPaging = false;			
            this._setVirtualLoadedIndexes(this._currentVirtualIndex);
            if(this.initialRender && this._isLocalData){
                this.model.currentViewData = [];
                for (var i = 0; i < this._currentLoadedIndexes.length; i++) {
                    var currentView = this._currentLoadedIndexes[i];
					if(this._virtualLoadedRecords[currentView])
						$.merge(this.model.currentViewData, this._virtualLoadedRecords[currentView]);
                }
            }
        },
        _setVirtualPaging: function(queryManagar, currentPage, isCurrentIndex){     
            var pageQuery = ej.pvt.filterQueries(queryManagar.queries, "onPage");
			if(pageQuery.length)
				queryManagar.queries.splice($.inArray(pageQuery[0], queryManagar.queries), 1);
			if((!isCurrentIndex || this._needVPaging) && this.model.currentIndex > this._virtualRowCount)
				this._initCurrentIndex(queryManagar, currentPage);	
			else
				queryManagar.page(currentPage, this.model.pageSettings.pageSize);
            this._needVPaging = false;
            if(this._isLocalData && !this._virtualPageRecords[currentPage]) {								 
				var result = this._dataManager.executeLocal(queryManagar);   
				if(!this.initialRender) this.model.currentViewData = result.result;
				if(this.model.searchSettings.key.length > 0){
					this._gridRecordsCount = result.result.length;
					this.model.pageSettings.totalPages = Math.ceil(this._gridRecordsCount / this.model.pageSettings.pageSize);
				}
				if(result.result.length){
					this._setVirtualLoadedRecords(result.result, currentPage);					
					if($.inArray(currentPage, this._virtualLoadedPages) == -1)
						this._virtualLoadedPages.push(currentPage);
				}
				else if (!this.initialRender)
					this.getContent().find(".e-virtualtop, .e-virtualbottom").remove();					
			}                   						
        },
		_checkPrevNextViews: function(currentPage){
			var currentVirtualIndex = this._currentVirtualIndex;
			var prevView = this._virtualLoadedRecords[currentVirtualIndex - 1], nextView = this._virtualLoadedRecords[currentVirtualIndex + 1];			
				var adjust = this._maxViews == 3 ? 1 : 2, sTop;																	
				if(currentVirtualIndex != 1 && currentVirtualIndex != this._totalVirtualViews){				
					if(!prevView || prevView.length != this._virtualRowCount){
						var currentIndex = currentVirtualIndex + adjust;
						this._currentVirtualIndex = this._virtualLoadedRecords[currentVirtualIndex] ? currentIndex : currentIndex + 1;
						sTop = this._scrollValue + (adjust * this._virtualRowCount * this._vRowHeight);
					}
					else if((!nextView || nextView.length != this._virtualRowCount) && this._totalVirtualViews != currentVirtualIndex - 1){
						var currentIndex = currentVirtualIndex - adjust;
						this._currentVirtualIndex = this._virtualLoadedRecords[currentVirtualIndex] ? currentIndex : currentIndex - 1;
						sTop = this._scrollValue - (adjust * this._virtualRowCount * this._vRowHeight);
					}			
					if(sTop){					
						this._scrollValue = sTop;
						this._setVirtualLoadedIndexes(this._currentVirtualIndex);
						this.model.currentIndex = sTop == 0 ? sTop : Math.floor(sTop / this._vRowHeight);
					}
				}			
		},
		_initCurrentIndex: function(queryManagar, currentPage){			
			var pageResultCount = currentPage * this.model.pageSettings.pageSize;
			var nextDataCount = (this._currentVirtualIndex * this._virtualRowCount) + this._virtualRowCount;
			var prevDataCount = (this._currentVirtualIndex *  this._virtualRowCount) - (this._virtualRowCount * 2);	
			var needTwoPage = nextDataCount > pageResultCount || prevDataCount < pageResultCount - this.model.pageSettings.pageSize;
			if(needTwoPage || this._isLastVirtualpage){
				if(nextDataCount > pageResultCount){
					var skipValue = (currentPage - 1) * this.model.pageSettings.pageSize, takeValue = this.model.pageSettings.pageSize * 2;	
					this._isInitNextPage = true;					
				}
				else if(prevDataCount < pageResultCount - this.model.pageSettings.pageSize  || this._isLastVirtualpage){
					var skipValue = (currentPage - 2) * this.model.pageSettings.pageSize, takeValue = this.model.pageSettings.pageSize * 2;
					this._isInitNextPage = false; this._remoteRefresh = true;					
				}
				if(this.model.virtualLoading && this._isLocalData){
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
				    var skipQuery = ej.pvt.filterQueries(queryManagar.queries, "onSkip");
				    if (skipQuery.length)
				        queryManagar.queries.splice($.inArray(skipQuery[0], queryManagar.queries), 1);
					queryManagar.skip(skipValue).take(takeValue);					
					if(this._isLocalData){
						var result = this._dataManager.executeLocal(queryManagar);                                    
						var currentData = this.model.currentViewData = result.result;
						this._isLastVirtualpage = false;
						this._setInitialCurrentIndexRecords(currentData, currentPage);						
					}
				}
			}			
			else{
				this._needVPaging = false;
				if(this.model.virtualLoading && this._isLocalData && (this.model.currentIndex != 0 || currentPage != 1))
					this._getVirtualOnLoadingData(currentPage, true);
				else
					this._setVirtualPaging(queryManagar, currentPage, true);						
			}
		},
		_setInitialCurrentIndexRecords: function(currentData, currentPage){
			for(i = 0; i < 2; i++){
				var start = i * this.model.pageSettings.pageSize, end = start + this.model.pageSettings.pageSize;
				var data = currentData.slice(start, end), page;
				if (this._isInitNextPage || (currentPage == 1 && this.model.pageSettings.totalPages == 1))
					page = i == 0 ? currentPage : currentPage + 1;
				else
					page = i == 0 ? currentPage - 1 : currentPage;
				this._setVirtualLoadedRecords(data, page);
			}
		},
        _getVirtualOnLoadingData: function(currentPage, isCurrentIndex){
            if(currentPage > 0){
				if(this.model.currentIndex > this._virtualRowCount && (!isCurrentIndex || this._needVPaging) && this.model.currentIndex < this.model.pageSettings.totalRecordsCount)
					this._initCurrentIndex(undefined, currentPage);
				else{
					var args = {};
					args.endIndex = (currentPage * this.model.pageSettings.pageSize) > this._gridRecordsCount ? this._gridRecordsCount : currentPage * this.model.pageSettings.pageSize;
					args.startIndex = (currentPage * this.model.pageSettings.pageSize) - this.model.pageSettings.pageSize;
					args.currentPage = this._currentPage();	args.result = null;			
					this._trigger("virtualLoading", args);
					var currentData = args.result;
					this._setVirtualLoadedRecords(currentData, currentPage);
				}
            }
        },
        _setVirtualLoadedRecords: function(currentData, currentPage){
            var virtualRowCount = this._virtualRowCount, pageSize = this.model.pageSettings.pageSize; 
            var pageIndex = pageSize / virtualRowCount, prevIndex;  
			var maxIndex = Math.ceil(currentPage * pageSize / virtualRowCount);
			var lastPage = currentPage == this.model.pageSettings.totalPages;
			if(!this._virtualPageRecords[currentPage])
				this._virtualPageRecords[currentPage] = currentData;
			if(lastPage){									
			    var lastPageData = this._getVirtualTotalRecord() % pageSize;
				if((!this._virtualLoadedRecords[this._totalVirtualViews] || this._virtualLoadedRecords[this._totalVirtualViews].length != this._lastViewData) && lastPageData < this._lastViewData && lastPageData != 0)
					maxIndex = this._totalVirtualViews + 1;
				else
					maxIndex = this._totalVirtualViews;	
				if(this._getVirtualTotalRecord() < virtualRowCount)
					this._singleView = true;
			}						
            for (var i = 0; i < pageIndex; i++) {
                var startIndex, endIndex;                                                      
                var viewIndex = Math.ceil((currentPage - 1) * pageIndex + (i + 1));				
                if((viewIndex <= this._totalVirtualViews || lastPage) && viewIndex <= maxIndex){					
                    if(this._virtualLoadedRecords[viewIndex - 1] && this._virtualLoadedRecords[viewIndex - 1].length != virtualRowCount) {
                        var start = this._virtualLoadedRecords[viewIndex - 1].length + (i * virtualRowCount);
                        startIndex = virtualRowCount - start + (i * virtualRowCount);
                        $.merge(this._virtualLoadedRecords[viewIndex - 1], currentData.slice(0, startIndex));
                        prevIndex = endIndex = startIndex + virtualRowCount;
						if(viewIndex <= this._totalVirtualViews)
							this._virtualLoadedRecords[viewIndex] = currentData.slice(startIndex, prevIndex);						
                    }									
                    else {
                        if (viewIndex != 1 && !this._virtualLoadedRecords[viewIndex - 1]) {                                        
                            var prevEnd = endIndex = (viewIndex - 1) * virtualRowCount % pageSize;
                            if(prevEnd != 0)
                                this._virtualLoadedRecords[viewIndex - 1] = currentData.slice(0, prevEnd);
                            startIndex = prevEnd, endIndex = prevIndex = prevEnd + virtualRowCount;
                        }
                        else {
                            startIndex = prevIndex ? prevIndex : i * virtualRowCount % pageSize;       
                            prevIndex = endIndex = startIndex + virtualRowCount;
                        }                                   
                    }                    
					if(!this._singleView && this._virtualLoadedRecords[viewIndex] && this._virtualLoadedRecords[viewIndex].length != virtualRowCount){
						var	data = currentData.slice(startIndex, endIndex);						
						if(data.length + this._virtualLoadedRecords[viewIndex].length <= virtualRowCount){
							var viewData = $.merge(data, this._virtualLoadedRecords[viewIndex]); 
							this._virtualLoadedRecords[viewIndex] = viewData;
						}
					}
					else if(!this._virtualLoadedRecords[viewIndex] && viewIndex <= this._totalVirtualViews)
						this._virtualLoadedRecords[viewIndex] = currentData.slice(startIndex, endIndex);					
                }
            }
			if($.inArray(currentPage, this._virtualLoadedPages) == -1)
				this._virtualLoadedPages.push(currentPage);
        },
        _setVirtualLoadedIndexes: function (currentIndex) {
            this._prevLoadedIndexes = this._currentLoadedIndexes;
			this._currentLoadedIndexes = [];            
            var virtualCount = currentIndex == this._totalVirtualViews ? currentIndex : currentIndex + 1;			
            if(currentIndex != 1)                               
                currentIndex = currentIndex - 1;            
            for (var i = currentIndex; i <= virtualCount; i++) {
                this._currentLoadedIndexes.push(i);                    
            }  
        },
        _getVirtualTotalRecord: function(){
            var recordCount = this.model.filterSettings.filteredColumns.length == 0 ? this._searchCount == null ? this._gridRecordsCount : this._searchCount : this._filteredRecordsCount;    
            return recordCount;
        },
        _initGridRender: function () {
            this.addInitTemplate();
            if (this.model.scrollSettings.frozenColumns > 0)
                this.addFrozenTemplate();
            this.model.allowGrouping && this.addGroupingTemplate();
            this.model.showSummary && this.addSummaryTemplate();
            if (this.model.allowResizing || this.model.allowResizeToFit)
                this._resizer = new ej.gridFeatures.gridResize(this);
            if (this.model.keySettings)
                $.extend(this.model.keyConfigs, this.model.keySettings);
            
            this._initHeight = this.model.scrollSettings.height;
            if (this.model.scrollSettings.height == "100%")
                this._isHeightResponsive = this.model._isHeightResponsive = true;            
            this.render();
            this._setTextWrap();
            if (this.model.columnLayout == "fixed") {
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
            if (this.model.allowGrouping &&  this.model.groupSettings.showDropArea && ej.gridFeatures.dragAndDrop)
                this._headerCellgDragDrop();
            if (this.model.allowReordering && ej.gridFeatures.dragAndDrop) {
                this._headerCellreorderDragDrop();
                this._initIndicators();
            }
            this._wireEvents();
            if (this.model.allowGrouping && !ej.isNullOrUndefined(this.model.serverProperties)) {
                this.model._groupingCollapsed = this.model.serverProperties._groupingCollapsed;
                for (var i = 0; i < this.model._groupingCollapsed.length; i++) {
                    var content = this.getContent().find(".e-recordplusexpand");
                    var tr = content.filter("td[data-ej-mappingname='" + this.model._groupingCollapsed[i].key + "'    ][data-ej-mappingvalue='" + this.model._groupingCollapsed[i].value + "']");
                    if (tr.length > 1 && !ej.isNullOrUndefined(this.model._groupingCollapsed[i].parent)) {
                        var parent = this.model._groupingCollapsed[i].parent;
                        tr = tr.filter(function (e) { return $(this).parents(".e-tabletd").parent("tr").prev("tr").find(".e-recordplusexpand[data-ej-mappingvalue=" + parent + "]").length })
                    }

                    this.expandCollapse(tr);
                }
            }
            this.initialRender = false;
            if (this.model.width && !this.model.allowScrolling)
                this.element.width(this.model.width);
            if (this.model.editSettings.allowEditing || this.model.editSettings.allowAdding)
                this._processEditing();
            if (this.model.mergeHeaderCellInfo != null) {               
                var args = { columnHeaders: this.getHeaderContent().find(".e-columnheader"), model: this.model }, proxy = this;
                this._headerCellMerge(args);
                this._trigger("mergeHeaderCellInfo", args);
            }
            this._trigger("dataBound", {});
			this._trigger("refresh");
            if (this.model.parentDetails) {  //refreshes parent scroller on child expand
                var id = this.model.parentDetails.parentID, parentObj = $("#" + id).data("ejGrid");
                parentObj.model.allowScrolling && parentObj._refreshScroller({ requestType: "refresh" });
            }
            if (this.element.closest('tr').hasClass('e-detailrow') && !this.model.parentDetails) {
                var parentObj = this.element.closest('tr.e-detailrow').closest('.e-grid').data("ejGrid");
                parentObj.model.allowScrolling && parentObj.getScrollObject().refresh();
            }
            if (this.model.allowFiltering && this.model.filterSettings.filterType == "menu") {
                this._renderFilterDialogs();
            }
            if (this.model.enableResponsiveRow && (this.model.allowSorting || this.model.allowFiltering)) {
                this._renderResponsiveFilter();
            }
            if (this.model.allowScrolling)
                this._vRowHeight = Math.floor(this.getRowHeight()); 
            if (this.model.allowGrouping && this.model.showSummary && this.model.currentViewData) {
                this._refreshGroupSummary();
                if (!ej.isNullOrUndefined(this.model.currentViewData) && this.model.currentViewData.length)
                    this._refreshGridFooterColGroup();
            }   
            if (this._isMapSelection)
                this._mappingSelection();
			if (this.model.showColumnChooser)
			    this._renderColumnChooser();
			if (this._enableCheckSelect) {
			    			    if (this.model.currentViewData != null && this.model.currentViewData.length == 0)
                			        this.getHeaderTable().find(".e-headercelldiv .e-checkselectall").hide();
			    			    else
                			        this.getHeaderTable().find(".e-headercelldiv .e-checkselectall").show();
			    			}
        },
        calculatePageSizeByParentHeight: function (containerHeight) {
            if (this.model.allowPaging) {
                if ((this.model.allowTextWrap && this.model.textWrapSettings.wrapMode == "header") || (!this.model.allowTextWrap)) {
                    var pagesize;
                    if (typeof (containerHeight) == "string" && containerHeight.indexOf("%") != -1) {
                        containerHeight = parseInt(containerHeight) / 100 * this.element.height();
                    }
                    var nonContentHeight = this._getNoncontentHeight() + this.getRowHeight();
                    if (parseInt(containerHeight) > nonContentHeight) {
                        var contentHeight = (parseInt(containerHeight) - this._getNoncontentHeight());
                        pagesize = parseInt(contentHeight / this.getRowHeight());
                    }
                    if (ej.isNullOrUndefined(pagesize)) throw "The parent height of grid must be more than 150";
                    else
                        return pagesize;
                }
            }
        },
        _setTextWrap: function () {
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
                if(this.model.scrollSettings.frozenColumns > 0 && this.model.textWrapSettings.wrapMode != "content"){
                    var $frozenTh = this.getHeaderContent().find(".e-frozenheaderdiv").find(".e-columnheader").last().find("th"), $movableTh = this.getHeaderContent().find(".e-movableheader").find(".e-columnheader").last().find("th");
                    $frozenTh.height()> $movableTh.height() ? $movableTh.height($frozenTh.height()) : $frozenTh.height($movableTh.height());
                }
            }
            else {
                this.getContent().removeClass("e-wrap").find(".e-rowcell").removeClass("e-nwrap");
                this.element.find(".e-columnheader").removeClass("e-wrap").find(".e-headercelldiv").removeClass("e-nwrap");
                this.element.removeClass("e-wrap");
            }
        },
        _getMetaColGroup: function () {
            var $colgroup = ej.buildTag("colgroup");
            for (var i = 0; i < this.model.columns.length; i++) {
                var $col = $(document.createElement("col"));
                this.model.columns[i]["visible"] === false && $col.css("display", "none");
				if(this.model.rowTemplate!=null && !ej.isNullOrUndefined(this.model.columns[i]["cssClass"]))
					$col.addClass(this.model.columns[i]["cssClass"]);
                if ( this.model.allowGrouping && !this.model.groupSettings.showGroupedColumn && $.inArray(this.model.columns[i]["field"], this.model.groupSettings.groupedColumns) != -1)
                    $col.css("display", "none");
                $colgroup.append($col);
            }
            return $colgroup;
        },
        _alternateRow: function () {
            return this.getIndex() % 2 == 0 ? "e-row" : "e-alt_row";
        },
        addInitTemplate: function () {
            var headerCellDiv = !ej.isNullOrUndefined(this.getHeaderTable()) && this.getHeaderTable().find(".e-headercelldiv:not(.e-emptyCell)"), templates = {}, firstVisible = true;
            var tbody = document.createElement('tbody'), $tbody = $(tbody),divElement, rowTemplateID = null;
            if (this.model.rowTemplate == null) {
                var tr = document.createElement('tr'),
                    $tr = $(tr),
                    columns = this.model.columns,
                    i;
                if (this._gridRecordsCount && !this._virtualDataRefresh) {
                    var currentData = this.model.editSettings.showAddNewRow && !this.initialRender ? this.model.currentViewData[1] : this.model.currentViewData[0];
                    if (!ej.isNullOrUndefined(currentData))
                        this._initColumns(currentData);
                }
                else if (this._isLocalData && (this._dataSource() != null && this._dataSource().length || (this._dataManager && this._dataManager.dataSource.json.length)))
                    this._initColumns(this._dataSource()[0] != undefined ? this._dataSource()[0] : this._dataManager.dataSource.json[0]);
                var helpers = { _gridFormatting: this.formatting, getComplexData: ej.getObject };
                $.views.helpers(helpers);

                var viewHelper = {};
                viewHelper["_foreignKey"] = this._foreignKeyBinding; 
                $.views.helpers(viewHelper);

                if (this.model.childGrid || this.model.detailsTemplate ) {
                    var $tdDetailCell = ej.buildTag("td.e-detailrowcollapse", "<div class='e-icon e-gnextforward'></div>");
                    $tr.append($tdDetailCell);
                }
                for (var i = 0; i < this.model.columns.length; i++) {
                    var $tdCell = ej.buildTag("td.e-rowcell");
                    if (!ej.isNullOrUndefined(columns[i]["tooltip"]) || columns[i]["clipMode"] == ej.Grid.ClipMode.EllipsisWithTooltip)
                        $tdCell.addClass("e-gridtooltip")
                    if (columns[i]["clipMode"] == ej.Grid.ClipMode.Ellipsis || columns[i]["clipMode"] == ej.Grid.ClipMode.EllipsisWithTooltip)
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
                    !$tdCell.hasClass("e-hide") && !this.model.groupSettings.showGroupedColumn && $tdCell.addClass("{{for ~groupedColumns}}" +
                        " {{if #data == '" + this.model.columns[i]["field"] + "'}}e-hide{{/if}}" +
                        "{{/for}}");
                    if (!ej.isNullOrUndefined(columns[i]["templateID"] || columns[i]["template"])) {
                        var viewHelper = {}, index, htxt = columns[i].headerText;
                        viewHelper["_" + this._id + "ColumnTemplating"] = ej.proxy(this._gridTemplate, null, this, index);
                        $.views.helpers(viewHelper);
                        if(!ej.isNullOrUndefined(htxt) && !ej.isNullOrUndefined(htxt.match(/[^0-9\s\w]/g)))
                            htxt = htxt.replace(/[^0-9\s\w]/g,"_");
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
                            case "boolean":
                            case "booleanedit":
                                if (ej.isNullOrUndefined(columns[i].displayAsCheckbox)) columns[i].displayAsCheckbox = true;
                                if (!columns[i]["displayAsCheckbox"])
                                    $tdCell.html("{{if ~getComplexData('"+this.model.columns[i].field+"', #data)}}" + this.localizedLabels.True + '{{else}}' + this.localizedLabels.False + '{{/if}}');
                                else {
                                    var disabled = "";
                                    this.model.editSettings.editMode == "batch" && (ej.isNullOrUndefined(columns[i].allowEditing) || columns[i].allowEditing) ? disabled = disabled : disabled = "disabled='disabled'";
                                    var str = "{{if ~getComplexData('" + this.model.columns[i].field + "', #data)}} <input type ='checkbox' " + disabled + " checked='checked'></input>{{else}} <input type ='checkbox' " + disabled + "></input> {{/if}}";
                                    $tdCell.addClass("e-boolrowcell").html(str);
                                }
                                break;
                            case "checkbox":
                                this._enableCheckSelect = true;
                                this.model.selectionType = "multiple";
                                if(this.model.editSettings.allowDeleting) this.multiDeleteMode = true;
                                this.model.selectionSettings.enableToggle = true;
                                this._isMapSelection = (!ej.isNullOrUndefined(columns[i].field) && (columns[i].field != ""));
                                this._selectionMapColumn = columns[i].field;
                                columns[i]["textAlign"] = "center";
                                if (!this._isMapSelection)
                                    this.model.columns[i]["allowGrouping"] = this.model.columns[i]["allowFiltering"] = this.model.columns[i]["allowSorting"] = false;
                                $tdCell.addClass("e-checkcell").html("<div class = 'e-checkcelldiv'>{{if #data['" + splits.join("']['") + "']}} <input type ='checkbox' checked='checked'></input>{{else}} <input type ='checkbox'></input> {{/if}}</div>");
                                this.model.columns[i].editType = ej.Grid.EditingType.Boolean;
                                this.model.scrollSettings.frozenColumns > 0 && $tdCell.addClass("e-frozenunbound");
                                this.model.enableAutoSaveOnSelectionChange = false;
                                break;
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
                            viewHelper["_" + this._id + "UnboundTemplate"] = this._unboundTemplateRendering;
                            $.views.helpers(viewHelper);
                            if ((ej.isNullOrUndefined(columns[i]["field"])) || (columns[i].field == ""))
                                this.model.columns[i]["allowGrouping"] = this.model.columns[i]["allowFiltering"] = this.model.columns[i]["allowSorting"] = false;
                            if (!ej.isNullOrUndefined(columns[i].headerText))
                            $("#" + this._id + columns[i].headerText.replace(/[^a-z0-9|s_]/gi, '')+ i + "_UnboundTemplate").remove();
                            divElement = this._createUnboundElement(columns[i],i);
                            if (!ej.isNullOrUndefined(columns[i].headerText))
                            $tdCell.addClass("e-unboundcell").addClass("e-" + columns[i]["headerText"].replace(/[^a-z0-9|s_]/gi, '')+i).html("{{:~_" + this._id + "UnboundTemplate('" + divElement.id + "')}}");
                            this.model.scrollSettings.frozenColumns > 0 && $tdCell.addClass("e-frozenunbound");
                            this._isUnboundColumn = true;
                        }

                    }
                    if (columns[i]["textAlign"] == undefined)
                        columns[i]["textAlign"] = "left";
                    if (columns[i]["isPrimaryKey"] === true) {
                        this._primaryKeys.push($.trim(columns[i].field));
                        this._primaryKeys = ej.isNullOrUndefined($.uniqueSort) ? $.unique(this._primaryKeys.sort()) : $.uniqueSort(this._primaryKeys.sort());
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
                    if (this.model.allowTextWrap && this.model.textWrapSettings.wrapMode != "header") {
                         if (columns[i]["allowTextWrap"] == false)
                            $tdCell.addClass("e-nwrap");
                    }
                    if (!ej.isNullOrUndefined(columns[i]["priority"]))
                        $tdCell.addClass("e-table-priority-" + columns[i]["priority"]);
                    if (!ej.isNullOrUndefined(columns[i]["customAttributes"]))
                        $tdCell.attr(columns[i]["customAttributes"]);
                    $tdCell.attr("data-role", "gridcell");
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
			else {
				var viewHelper = {};
				var scriptRElement = this._createRowTemplateElement(this.model.rowTemplate);
                viewHelper["_" + this._id + "rowTemplating"] = ej.proxy(this._gridRowTemplate,null,this);
                var ngType = !ej.isNullOrUndefined(this.model.ngTemplateId) && (this.model.rowTemplate.startsWith("#") || this.model.rowTemplate.startsWith(".") || typeof this.model.rowTemplate === "object") ? this.model.ngTemplateId + "gridrowtemplate" : null;                                              
				rowTemplateID = "{{:~_" + this._id + "rowTemplating('" + scriptRElement.id + "','" + ngType +"')}}";
				$.views.helpers(viewHelper);
			}
            templates[this._id + "_JSONTemplate"] = this.model.rowTemplate != null ? rowTemplateID : $tbody.html();
            $.templates(templates);
        },
        
        _gridRowTemplate: function(self,id,type){
			return self._renderEjTemplate("#" + id, this.data,this.index,null,type);
		},
		_createRowTemplateElement: function(templ){
			var tmpl = templ, quickReg = /^#([\w-]*)/,
                match = quickReg.exec(tmpl), scriptReg = /^<script/i, appendTo = appendTo || $("body"), scripEle;

            var options = {
                name: "SCRIPT",
                type: "text/x-template",
                text: tmpl,
               id: (this._id + "RowTemplate").replace(/(\\|[^0-9A-z-_])/g, "")
            };

            if ( match && match[1] )
                scripEle = document.getElementById(match[1]);
            else {
                if (scriptReg.test(tmpl)) // branch here to handle tmpl string with SCRIPT. 
                    scripEle = $(tmpl).get(0);
                else
                    scripEle = ej.buildTag(options.name).get(0);
            }

            scripEle.id = scripEle.id || options.id; 
            scripEle.type = scripEle.type || options.type;
			if(ej.isNullOrUndefined(match))
				$(scripEle).text(options.text);
            appendTo.append(scripEle); 
            return scripEle;
		},        
        render: function () {
            this.model.showSummary = this.model.summaryRows.length > 0 || this.model.showSummary;
            this._renderGridContent().insertAfter(this.element.children(".e-gridheader"));
            this.model.allowResizeToFit && this.setWidthToColumns();
            if (this.model.allowGrouping && ej.gridFeatures.dragAndDrop)
                this._groupHeaderCelldrag();
            if (this.model.showSummary && this._currentJsonData.length) {
                var footer = this._renderGridFooter();
                if (!ej.isNullOrUndefined(footer)) footer.insertAfter(this.getContent());
                this._hideCaptionSummaryColumn();
            }
            this._initialEndRendering();

        },
        _createStackedRow: function (stackedHeaderRow, frozenHeader) {
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
                        var _column = $.isArray(sColumn[col].column) ? sColumn[col].column : $.map(sColumn[col].column.split(","), $.trim),
                            className = "e-row" + $.inArray(stackedHeaderRow, this.model.stackedHeaderRows) + "-column" + col;
                        if ($.inArray(column.field, _column) != -1)
                        {
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
				if(this.model.allowResizing || this.model.allowReordering || this.model.allowResizeToFit)
                    $th.addClass("e-resizer");
            }
            return $tr;
        },
        _renderGridHeaderInternalDesign: function (columns, frozenHeader) {
            var $table = ej.buildTag('table.e-table', "", {}, { "data-role": "grid" });
            var $thead = ej.buildTag('thead');
            var $tbody = ej.buildTag('tbody.e-hide');
            var $columnHeader = ej.buildTag('tr.e-columnheader');
            var $colGroup = $(document.createElement('colgroup'));
            var $rowBody = $(document.createElement('tr'));
            if (this.model.childGrid || this.model.detailsTemplate ) {
                $columnHeader.append(ej.buildTag('th.e-headercell e-detailheadercell', '<div></div>'));
                $rowBody.append(document.createElement('td'));
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
                var $headerCellDiv = ej.buildTag('div.e-headercelldiv', (columns[columnCount]["headerText"] === undefined && columns[columnCount]["type"] != "checkbox") ? columns[columnCount]["headerText"] = columns[columnCount]["field"] : columns[columnCount]["headerText"], {}, { "data-ej-mappingname": columns[columnCount]["field"] });
                if (columns[columnCount].disableHtmlEncode)
                    $headerCellDiv.text(columns[columnCount]["headerText"]);
                if (!ej.isNullOrUndefined(columns[columnCount]["headerTooltip"]))
                    $headerCellDiv.addClass("e-gridheadertooltip");
                if (!ej.isNullOrUndefined(columns[columnCount]["tooltip"]))
                    $headerCellDiv.addClass("e-gridtooltip");
                if (columns[columnCount]["clipMode"] == ej.Grid.ClipMode.Ellipsis || columns[columnCount]["clipMode"] == ej.Grid.ClipMode.EllipsisWithTooltip)
                    $headerCellDiv.addClass("e-gridellipsis");
                if(this.model.allowResizing || this.model.allowReordering || this.model.allowResizeToFit)
                        $headerCell.addClass("e-resizer");               
			   $headerCell.append($headerCellDiv);
                if (this.model.allowFiltering && (this.model.filterSettings.filterType == "menu" || this.model.filterSettings.filterType == "excel") &&
                                (columns[columnCount]["allowFiltering"] == undefined || columns[columnCount]["allowFiltering"] === true) && (!ej.isNullOrUndefined(columns[columnCount].field) || columns[columnCount].field == "") && (columns[columnCount]["type"] != "checkbox")) {
                        var filtericon = 'e-filterset';
                    if (!this.initialRender && this.model.filterSettings.filteredColumns) {
                        for (var i = 0; i < this.model.filterSettings.filteredColumns.length; i++) {
                            if (this.model.filterSettings.filteredColumns[i].field == columns[columnCount].field) {
                                filtericon = 'e-filterset e-filteredicon e-filternone';
                            }
                        }
                    }
                    $headerCell.append(ej.buildTag('div.e-filtericon e-icon ' + filtericon));
                    if (this.model.allowGrouping && this.model.groupSettings.showToggleButton && $.inArray(columns[columnCount].field, this._disabledGroupableColumns) == -1 && !ej.isNullOrUndefined(columns[columnCount].field) && columns[columnCount].field != "") {
                        $headerCell.addClass("e-headercellgroupfilter");
                        $headerCell.find(".e-filtericon").addClass("e-groupfiltericon");
                    }
                    else
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
					var isdup = columns.filter(function(e){return e.headerText==columns[columnCount].headerText}).length > 1;
                    $headerCell.addClass("e-hide") && $(col).css("display", "none")
                    if (($.inArray(columns[columnCount].headerText, this._hiddenColumns) == -1 || isdup) && $.inArray(columns[columnCount].field, this._hiddenColumnsField) == -1)
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
					$headerCellDiv.css("text-align",columns[columnCount]["textAlign"] = "right");
                columns[columnCount]["allowResizing"] === false && this._disabledResizingColumns.push(columns[columnCount].field);
                columns[columnCount]["allowSorting"] === false && this._disabledSortableColumns.push(columns[columnCount].field);
                columns[columnCount]["allowGrouping"] === false && this._disabledGroupableColumns.push(columns[columnCount].field);
                columns[columnCount]["allowEditing"] === false && this._disabledEditableColumns.push(columns[columnCount].field);
                if (!ej.isNullOrUndefined(columns[columnCount]["cssClass"])) {
                    $headerCell.addClass(columns[columnCount]["cssClass"]);
                    $(col).addClass(columns[columnCount]["cssClass"]);
                }
                if ( this.model.allowTextWrap && this.model.textWrapSettings.wrapMode != "content") {
                     if (columns[columnCount]["allowTextWrap"] == false)
                        $headerCellDiv.addClass("e-nwrap");
                }
                if (!ej.isNullOrUndefined(columns[columnCount]["headerTemplateID"])) {
                    $headerCellDiv.html($(columns[columnCount]["headerTemplateID"]).hide().html()).parent().addClass("e-headertemplate");
                    var index = $.inArray(columns[columnCount].field, this._disabledGroupableColumns);
                    index == -1 && ej.isNullOrUndefined(columns[columnCount].field) && this._disabledGroupableColumns.push(columns[columnCount].field);
                }
                if (ej.getObject("type", columns[columnCount]) == "checkbox" && ej.isNullOrUndefined(columns[columnCount]["headerText"])) {
                    $headerCellDiv.addClass("e-headercheckcelldiv");
                    $headerCellDiv.html("<input type = 'checkbox' class = 'e-checkselectall'></input>");
                    if (!ej.isNullOrUndefined(columns[columnCount].field))
                        $headerCellDiv.attr("data-ej-mappingname", columns[columnCount].field);
                }
                if (this.model.allowGrouping && this.model.groupSettings.showToggleButton && $.inArray(columns[columnCount].field, this._disabledGroupableColumns) == -1 && !ej.isNullOrUndefined(columns[columnCount].field) && columns[columnCount].field != "") {
                    if ($.inArray(columns[columnCount].field, this.model.groupSettings.groupedColumns) != -1)
                        $headerCell.append(this._getToggleButton().addClass("e-toggleungroup"));
                    else
                        $headerCell.append(this._getToggleButton().addClass("e-togglegroup"));
                    if(!filtericon) 
                        $headerCell.addClass("e-headercellgroup");
                    if(this.model.enableRTL) {
                        if(filtericon)
                            $headerCellDiv.addClass("e-headercelldivgroup");
                        else
                            $headerCell.find(".e-gridgroupbutton").addClass("e-rtltoggle");
                    }
                }
                    $headerCell.attr("title", this._decode(columns[columnCount].headerText));
                if (columns[columnCount]["priority"]) {
                    $headerCell.attr("data-priority", columns[columnCount]["priority"]).addClass("e-table-priority-" + columns[columnCount]["priority"]);
                    $(col).addClass("e-table-priority-" + columns[columnCount]["priority"]);
                }
                if (this.initialRender) {
                    var cCount = columnCount, frozenCols = this.model.scrollSettings.frozenColumns;
                    cCount = !frozenHeader ? frozenCols > 0 ? cCount + frozenCols : cCount : cCount;
                    this._columnsPixelConvert(columns[columnCount], cCount);
                }
                if (columns[columnCount]["width"] == undefined && this.model.commonWidth !== undefined)
                    this.columnsWidthCollection[columnCount + this.model.scrollSettings.frozenColumns] = this.model.commonWidth;
                this._fieldColumnNames[columns[columnCount].headerText] = columns[columnCount].field;
                this._headerColumnNames[columns[columnCount].field] = columns[columnCount].headerText;                
            }
            $thead.append($columnHeader);
            $tbody.append($rowBody);
            $table.append($colGroup).append($thead).append($tbody);
            return $table;
        },
        _columnsPixelConvert: function (column, columnIndex) {
            var colIndex;
            var elementWidth = this.model.scrollSettings.width > 0 ? this.model.scrollSettings.width : this.element.width();
            var cols = ej.isNullOrUndefined(column) ? this.model.columns : $.makeArray(column);
            for (var columnCount = 0; columnCount < cols.length; columnCount++) {
                colIndex = columnIndex || columnCount;
                if (typeof (cols[columnCount].width) == "string" && cols[columnCount].width.indexOf("%") != -1 && (this.model.allowScrolling || (this.model.allowGrouping && this.model.groupSettings.groupedColumns.length))){
					var btnSize = (!ej.isNullOrUndefined(this.getContent()) && !ej.isNullOrUndefined(this.getContent().data("ejScroller")) && this.getScrollObject().isVScroll()) ? this.model.scrollSettings.buttonSize : 0;
                    this.columnsWidthCollection[colIndex] = (parseInt(cols[columnCount]["width"]) / 100 * (elementWidth - btnSize));
				}
                else
                    this.columnsWidthCollection[colIndex] = (cols[columnCount]["width"]);
            }
        },
        _renderGridHeader: function () {
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
            this._resetDisabledCollections();
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
        },
        _renderGridContent: function () {
            var $div = ej.buildTag('div.e-gridcontent');
            var $innderDiv = ej.buildTag('div');
            var $table = ej.buildTag('table.e-table', "");
            var $tbody = $(document.createElement('tbody'));
            $table.append(this.getHeaderTable().find('colgroup').clone()).append($tbody);
            $innderDiv.html($table);
            $div.html($innderDiv);
            this.setGridContentTable($table);
            this.setGridContent($div);
            $table.attr("data-role", "grid");
            var args = {};
            if (this.model.allowGrouping && this.model.groupSettings.groupedColumns.length) {
                if (this.initialRender) {
                    args.columnName = this.model.groupSettings.groupedColumns[this.model.groupSettings.groupedColumns.length - 1];
                    if (!this.model.groupSettings.showGroupedColumn) {
                        for (var i = 0; i < this.model.groupSettings.groupedColumns.length; i++) {
                            var col = this.model.groupSettings.groupedColumns[i];
                            if ($.inArray(col, this._hiddenColumnsField) == -1) {//updated for
                                this._hiddenColumnsField.push(col);//updated for
                                this._hiddenColumns.push(this.getColumnByField(col).headerText);
                                this._visibleColumns.splice(this._visibleColumns.indexOf(this.getColumnByField(col).headerText), 1);
                                this._visibleColumnsField.splice(this._visibleColumnsField.indexOf(col), 1);
                                this.getColumnByField(col).visible = false;
                            }
                        }
                    }
                }
                args.requestType = ej.Grid.Actions.Grouping;
            } else
                args.requestType = ej.Grid.Actions.Refresh;
            if (this._dataSource() == null || this._dataSource().length == 0 || this.model.currentViewData.length == 0) {
                var $emptyTd = ej.buildTag('td.emptyrecord', this.localizedLabels.EmptyRecord, {}, { colSpan: (this.model.columns.length - this._hiddenColumns.length)});
                $tbody.append($(document.createElement("tr")).append($emptyTd));
                this.setWidthToColumns();
                if (this.initialRender || this.model.groupSettings.groupedColumns.length)
                    this.sendDataRenderingRequest(args)
            } else
                this.sendDataRenderingRequest(args);
            if (this._isCaptionSummary && args.requestType == "grouping" && this.model.groupSettings.groupedColumns.length > 1) {
                var colgroup = this.getContentTable().find(".e-table").not(".e-recordtable").children("colgroup");
                var $cols1 = $(this.getContentTable().find(".e-recordtable")[0]).children("colgroup").find("col");
                for (var i = 0; i < colgroup.length; i++) {
                    var colCount = $(colgroup[i]).find("col").length;
                    $(colgroup[i]).find("col:gt(" + (colCount - $cols1.length - 1) + ")").remove();
                    $(colgroup[i]).append($cols1.clone());
                }
            }
            return $div;
        },
        
        print: function () {
            var args = {}; args.requestType = "print";
            this._printselectrows = this.getContentTable().find('tr[aria-selected="true"]');            
            this._trigger("actionBegin", args);

            var printWin = window.open('', 'print', "height=452,width=1024,tabbar=no"), $printDiv = ej.buildTag("div#" + this._id), cloneGridModel = $.extend(true, {}, this.model);            
            cloneGridModel.toolbarSettings.showToolbar = cloneGridModel.allowPaging = cloneGridModel.allowScrolling = cloneGridModel.showColumnChooser = cloneGridModel.enablePersistence = false;
            cloneGridModel.editSettings = {};
            cloneGridModel.query.queries = [];
            cloneGridModel._isPrinting = true;
            if (this.model.allowPaging && this.model.pageSettings.printMode == "currentpage") {
                cloneGridModel.query.queries = [{ fn: "onPage", e:{ pageIndex: this._currentPage(), pageSize: this.model.pageSettings.pageSize }}];
                cloneGridModel.dataBound = function () {
                    this._printProcess(printWin);
                }
            }
            else {                
                cloneGridModel.dataBound = function () {
                    this._printProcess(printWin);
                }
            }
            $printDiv.ejGrid(cloneGridModel);

        },
        _printProcess: function (printWin) {
            var elementClone = this.element, args = { requestType: "print", element: elementClone, selectedRows: this._printselectrows };
            if (this.model.allowFiltering && this.model.filterSettings.filterType == "filterbar")
                elementClone.find(".e-filterbar").remove();
            elementClone.show();           
            this._trigger("beforePrint", args);
            ej.print(elementClone, printWin);           
            this._trigger("actionComplete", args);
        },
        
         "export": function (action, serverEvent, multipleExport,gridIds) {
           var modelClone = $.extend(true, {}, this.model);
            var proxy = this;
            var attr = { action: action, method: 'post', "data-ajax": "false" };
            var form = ej.buildTag('form', "", null, attr);
            var locale = [];
            if (multipleExport && !ej.isOnWebForms) {
                var gridCol=$('div.e-grid');
                if (gridIds && gridIds.length > 0) {
                    gridCol = $.map(gridIds, function (i) { return document.getElementById(i) })
                }
                $.each(gridCol,function (index, object) {
                        var gridobjectArray = {};
                        var gridObject = $(object).data('ejGrid');
                        locale.push({ id: gridObject._id, locale: gridObject.model.locale });
                        if (!ej.isNullOrUndefined(gridObject)) {
                            var modelClone = $.extend(true, {}, gridObject.model);
                            modelClone = proxy._getExportModel(modelClone);
                            if (gridObject.ignoreOnExport) {
                                var inputAttr = { name: 'GridModel', type: 'hidden', value: gridObject.stringify(modelClone) }
                                var input = ej.buildTag('input', "", null, inputAttr);
                                form.append(input);
                            }
                        }
                    });
                    $('body').append(form);
                    form.submit();
            }
            else {
                this._locale = this.model.locale;
                modelClone = this._getExportModel(modelClone);
                var gridob = this;
                if (ej.raiseWebFormsServerEvents) {
                    var args = { model: modelClone, originalEventType: serverEvent };
                    var clientArgs = { model: this.stringify(modelClone) };
                    ej.raiseWebFormsServerEvents(serverEvent, args, clientArgs);
                    setTimeout(function () {
                        ej.isOnWebForms = true;
                    }, 1000);
                }
                else {
                        var inputAttr = { name: 'GridModel', type: 'hidden', value: this.stringify(modelClone) }
                        var input = ej.buildTag('input', "", null, inputAttr);
                        form.append(input);
                        form.append(this);
                        $('body').append(form);
                        form.submit();
                }
            }
            setTimeout(function () {
                if (locale.length) {
                    for (var i = 0; i < locale.length; i++) {
                        var gridObject = $("#" + locale[i].id).data('ejGrid');
                        gridObject.model.locale = locale[i].locale;
                    }
                }
                if (!ej.isNullOrUndefined(proxy._locale))
                    proxy.model.locale = proxy._locale;
            }, 0);
            form.remove();
            return true;
        },
         _getExportModel: function (modelClone) {
            var tempObj = {}
            $.extend(tempObj, ej.Grid.Locale["en-US"], ej.Grid.Locale[modelClone.locale]);
            var temp = tempObj.GroupCaptionFormat;
            var split1 = temp.indexOf("{{if");
            var split2 = temp.indexOf(" {{else}}");
            var grpText = temp.slice(split1, split2).replace("{{if count == 1 }}", "");
			if(split1 >= 0)
				temp = temp.slice(0,split1);
            var localeProp = { EmptyRecord: tempObj.EmptyRecord, GroupCaptionFormat: temp, GroupText: grpText,True:tempObj.True,False:tempObj.False };
              if (!ej.isNullOrUndefined(this.model))
                this.model.locale = modelClone.locale.concat(JSON.stringify(localeProp));
            modelClone.locale = modelClone.locale.concat(JSON.stringify(localeProp));            
            for (var i = 0; i < modelClone.columns.length; i++) {
                if (!ej.isNullOrUndefined(modelClone.columns[i].template)) {
                    if (modelClone.columns[i].template.indexOf("#") != -1) {
                        var string = $.templates(modelClone.columns[i].template).markup;
                        modelClone.columns[i].template = escape($.trim(string));
                    }
                    else
                       modelClone.columns[i].template = escape(modelClone.columns[i].template);
                }
            }
            if (!ej.isNullOrUndefined(modelClone.detailsTemplate))
                modelClone.detailsTemplate = escape($.trim($.templates(modelClone.detailsTemplate).markup));
            for (var i = 0; i < modelClone.filterSettings.filteredColumns.length; i++) {
                if (modelClone.filterSettings.filteredColumns[i].operator == "equal")
                    modelClone.filterSettings.filteredColumns[i].operator = "equals";
                else if (modelClone.filterSettings.filteredColumns[i].operator == "notequal")
                    modelClone.filterSettings.filteredColumns[i].operator = "notequals";
            }
            if (modelClone.showStackedHeader) {
                modelClone.stackedHeaderRow = modelClone.stackedHeaderRows;
                for (var i = 0; i < modelClone.stackedHeaderRow.length; i++) {
                    modelClone.stackedHeaderRow[i].stackedHeaderColumn = modelClone.stackedHeaderRow[i].stackedHeaderColumns;
                    var a = modelClone.stackedHeaderRow[i].stackedHeaderColumn;
                    for (var j = 0; j < a.length; j++) {
                        modelClone.stackedHeaderRow[i].stackedHeaderColumn[j].column = $.isArray(a[j].column) ? a[j].column : a[j].column.split(',');
                    }
                }
            }
            if (this.ignoreOnExport) {
                for (var i = 0; i < this.ignoreOnExport.length; i++) {
                    delete modelClone[this.ignoreOnExport[i]];
                }
            }
            return modelClone
        },
        sendDataRenderingRequest: function (args) {
            if (this._templateRefresh) {
                this.refreshTemplate();
                this._templateRefresh = false;
            }
            this.setFormat();
            if(!this.model.scrollSettings.enableVirtualization){
				this._previousColumnIndex = null;
				this._previousRowCellIndex = null;
				this._previousIndex = null;
			}
            if (args.requestType == "add" || args.requestType == "grouping" || (this.model.currentViewData != null && this.model.currentViewData.length)) {
                switch (args.requestType) {
                    case ej.Grid.Actions.Refresh:
                    case ej.Grid.Actions.Paging:
                    case ej.Grid.Actions.Sorting:
                    case ej.Grid.Actions.Filtering:
                    case ej.Grid.Actions.Save:
                    case ej.Grid.Actions.Cancel:
                    case ej.Grid.Actions.Delete:
                    case ej.Grid.Actions.Search:
                    case ej.Grid.Actions.Reorder:
                    case ej.Grid.Actions.BatchSave:
                        var cloneGroupedColumns = this.model.groupSettings.groupedColumns
                        if(this.model.allowGrouping && args.requestType == ej.Grid.Actions.Refresh && cloneGroupedColumns.length == 0 && this.element.find(".e-grouptopleftcell").length > 0) {
                            var $header = this.element.children(".e-gridheader");
                            $header.find("div").first().empty().append(this._renderGridHeader().find("table"));
                        }
						if (this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate")
                            $("#" + this._id + "_externalEdit").css("display", "none");
						if (this.model.allowPaging) {
						    if (this.model.filterSettings.filteredColumns.length)
						        this.getPager().ejPager({ totalRecordsCount: this._searchCount == null ? this._filteredRecordsCount : this._searchCount, currentPage: this._currentPage() });
						    else
						        this.getPager().ejPager({ totalRecordsCount: this._searchCount == null ? this._gridRecordsCount : this._searchCount, currentPage: this._currentPage() });
						    this._refreshGridPager();
						}
                        if(!this.model.allowGrouping)
                            cloneGroupedColumns = [];
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
                                    temp1.innerHTML = ['<table><tbody>', $.render[this._id + "_JSONTemplate"](args.data), '</tbody></table>'].join("");
                                    if (this._dataSource() instanceof ej.DataManager && args.requestType == ej.Grid.Actions.Save) {
                                        insertIndex = this._getDataIndex(this.model.currentViewData, args.data);
                                        isRemoteAdaptor = this._dataSource().adaptor instanceof ej.remoteSaveAdaptor;
                                    }
                                }
                                var currentData = null;
                                if (this.model.scrollSettings.allowVirtualScrolling && !this.model.scrollSettings.enableVirtualization && !ej.isNullOrUndefined(this._currentVIndex) && (args.requestType == "save" || args.requestType == "cancel" || args.requestType == "delete"))
                                    currentData = ej.isNullOrUndefined(this._lastVirtualPage) ? (ej.isNullOrUndefined(this._virtualLoadedRecords[this._currentVIndex]) ? this._virtualLoadedRecords[this._currentVIndex + 1] : this._virtualLoadedRecords[this._currentVIndex]) : this._lastVirtualPage;
                                else
                                    currentData = this.model.currentViewData
                                if (this.model.rowTemplate != null) {
                                    if (args.action == "hideColumn" || args.action == "showColumn")
                                        temp = this.getContent().find("div:first")[0];
                                    else {
                                        temp.innerHTML = ['<table><tbody>', $.render[this._id + "_JSONTemplate"](currentData), '</tbody></table>'].join("");
                                    }
                                } 
                                else
                                    temp.innerHTML = ['<table><tbody>', $.render[this._id + "_JSONTemplate"](currentData), '</tbody></table>'].join("");
                                var tableEle = this.getContentTable().get(0);
                                var tbodyEle = tableEle.lastChild;
                                var rindex = this.getContentTable().first().find('tbody').first(), rowIndex;
                                if ((args.requestType == "save" || args.requestType == "cancel") && this.model.editSettings.editMode != "batch" && !this.model.scrollSettings.allowVirtualScrolling) {
                                    if (this.model.editSettings.editMode.indexOf("inlineform") != -1)
                                        rowIndex = !ej.isNullOrUndefined(args.selectedRow) ? args.selectedRow : this._selectedRow();
                                    else
                                        rowIndex = this.getContentTable().find('.e-' + args.action + 'edrow').index();
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
                                    var $oldChild, $editedTr, $newChild;
                                    if (this.model.editSettings.editMode == "normal" || this.model.editSettings.editMode == "inlineform" || this.model.editSettings.editMode == "inlineformtemplate") {
                                        if (args.action == "add" && !this.getContentTable().find(".e-addedrow").length) break;
                                        $oldChild = this.getContentTable().find('.e-addedrow').get(0);
                                        $editedTr = this.getContentTable().find('.e-editedrow');
                                        $newChild = ($editedTr.length || args.requestType == "cancel") ? temp.firstChild.firstChild.firstChild : temp1.firstChild.firstChild.lastChild;                       
                                        if ($editedTr.length || (args.requestType == "save" && this._isMapSelection && !ej.isNullOrUndefined(args.checkboxTarget) && this.model.sortSettings.sortedColumns.length > 0)) {
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
                                                if (ej.isNullOrUndefined(this.model.currentViewData[rowIndex]) || (this._primaryKeys.length && ej.getObject(this._primaryKeys[0], this.model.currentViewData[rowIndex]) != ej.getObject(this._primaryKeys[0], args.data)))
                                                    $(tbodyEle).replaceWith($(temp).find('tbody'))
                                                else
                                                    tbodyEle.replaceChild($newChild, $oldChild);
                                            }
											if (this.model.editSettings.showAddNewRow)
												this.model.editSettings.rowPosition == "top" ? $(tbodyEle.firstChild).remove(): $(tbodyEle.lastChild).remove();
                                        } else {
                                            var $newChildObj = $($newChild), $oldChildObj = $($oldChild);
                                            if (args.action == "add" && args.requestType == "save" && this.model.editSettings.showAddNewRow && this.model.allowPaging && this.model.pageSettings.pageSize <= this._currentJsonData.length)
                                                this.model.editSettings.rowPosition == "bottom" ? $(tbodyEle.lastChild).previousSibling.remove() : $(tbodyEle.lastChild).remove();
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
                                                if (args.requestType == "cancel" && this._selectedRow() != -1 && !this._enableCheckSelect)
                                                    this.clearSelection();

                                            } else if (this.model.currentViewData.length == 1) {
                                                $(tbodyEle).empty();
                                                tbodyEle.appendChild($newChild);
                                            } else if (this.model.sortSettings.sortedColumns.length && args.requestType == "save" && this._currentJsonData.length > 0 || !ej.isNullOrUndefined(this._searchCount) && this.element.find('.gridform').length > 0) {
                                                this.getContentTable().get(0).replaceChild(this.model.rowTemplate != null ? temp.firstChild.lastChild : temp.firstChild.firstChild, this.getContentTable().get(0).lastChild);
                                            } else if (this.model.editSettings.rowPosition == "bottom" && this.element.find('.gridform').length > 0) {
                                                rindex.prepend($oldChild);
                                                tbodyEle.replaceChild($newChild, $oldChild);
                                            } else
                                                if (!ej.isNullOrUndefined($oldChild))
                                                    tbodyEle.replaceChild($newChild, $oldChild);
                                        }
                                    } else if (this.model.editSettings.editMode == "dialog" || this.model.editSettings.editMode == "dialogtemplate" || this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate") {
                                        $editedTr = this.element.find('.e-editedrow');
                                        if (args.requestType == "cancel" || (!$editedTr.length && !ej.isNullOrUndefined(this._filteredRecordsCount) && this._filteredRecordsCount == this._previousFilterCount)) {
                                            $newChild = temp.firstChild.firstChild.childNodes[rowIndex];
                                            $oldChild = this._excludeDetailRows(tbodyEle.childNodes)[rowIndex];
                                            var $newChildObj = $($newChild), $oldChildObj = $($oldChild);
                                            if ((this.model.detailsTemplate != null || this.model.childGrid != null) && $oldChildObj.next('.e-detailrow:visible').length) {
                                                var $target = $newChildObj.find('.e-detailrowcollapse');
                                                $target.removeClass("e-detailrowcollapse").addClass("e-detailrowexpand").find("div").removeClass("e-gnextforward").addClass("e-gdiagonalnext");
                                            }
                                            $oldChildObj.replaceWith($newChildObj);
                                            if ((args.requestType != "cancel" || this._isAddNew) && !this._enableCheckSelect)
                                                this.clearSelection();
                                            this.model.allowPaging && this._refreshGridPager();

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
                                            else {
                                                if (ej.isNullOrUndefined(this.model.currentViewData[rowIndex]) || (this._primaryKeys.length && ej.getObject(this._primaryKeys[0], this.model.currentViewData[rowIndex]) != ej.getObject(this._primaryKeys[0], args.data)))
                                                    $(tbodyEle).replaceWith($(temp).find('tbody'))
                                                else
                                                    tbodyEle.replaceChild($newChild, $oldChild);
                                            }
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
                                                var currentDataLength = this._isAddNew && insertIndex ? this.model.currentViewData.length - 1 : this.model.currentViewData.length + 1;
                                                if (this.model.allowPaging && (this.model.pageSettings.pageSize < currentDataLength || insertIndex == this.model.pageSettings.pageSize))
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
                                } else if (args.requestType == "delete" && !this.model.scrollSettings.allowVirtualScrolling) {
                                    if (this._isUnboundColumn) {
                                        var $editedrow = this.element.find('.e-editedrow');
                                        $oldChild = this.getContentTable().find('.e-editedrow').get(0);
                                        $newChild = ($editedrow.length) ? temp.firstChild.firstChild.firstChild : temp1.firstChild.firstChild.lastChild;

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
                            if ((args.requestType == "sorting" || args.requestType == "filtering" || args.requestType == "save" || args.requestType == "cancel" || args.requestType == "delete") && this.model.scrollSettings.allowVirtualScrolling) {
                                if (args.requestType == "filtering") {
                                    this.getContent().first().ejScroller("refresh").ejScroller("isVScroll") ? this.element.find(".gridheader").addClass("e-scrollcss") : this.element.find(".gridheader").removeClass("e-scrollcss");
                                    var model = this._refreshVirtualPagerInfo();
                                }
                                if(this.model.scrollSettings.enableVirtualization)
									this._refreshVirtualView(this._currentVirtualIndex);
								else
									this._refreshVirtualContent(currentPage);
                                args.requestType == "filtering" && this.getContent().first().ejScroller("refresh");
                            }
                            if (args.requestType == "refresh" && (this._singleView || this._getVirtualTotalRecord() < this._virtualRowCount))
                                this._addLastRow();
							if(!this.model.scrollSettings.enableVirtualization)
								this._eventBindings();
                            break;
                        }
                    case ej.Grid.Actions.Grouping:
                        this._group(args);
                        this._refreshStackedHeader();
                        break;
                    case ej.Grid.Actions.BeginEdit:
                        this._edit(args);
                        break;
                    case ej.Grid.Actions.Add:
                        this._add(args);
                        break;
                    case ej.Grid.Actions.Ungrouping:
                        this._ungroup(args);
                        break;
                    case ej.Grid.Actions.VirtualScroll:
						if(!this._isVirtualRecordsLoaded){
							if(!this.model.scrollSettings.enableVirtualization)
								this._replacingContent();
							else
								this._replacingVirtualContent();
						}                        
                        break;
                }
            }
            else if (args.requestType == "reorder" && this.model.groupSettings.groupedColumns.length > 0)
                    this._group(args);
            else {
                if ((ej.isNullOrUndefined(this.model.currentViewData) || this.model.currentViewData.length == 0) && !this.phoneMode) {
                    if (args.requestType == "refresh" && this.model.scrollSettings.frozenColumns == 0) {
                        this.getContentTable().find("colgroup").first().replaceWith(this._getMetaColGroup());
                        (this.model.childGrid != null || this.model.detailsTemplate != null) && this.getContentTable().find("colgroup").first().prepend(this._getIndentCol());
                    }
                    if((args.requestType == "filtering" ||args.requestType == "cancel" || args.requestType == "refresh") && this.model.scrollSettings.frozenColumns > 0)
                        this._removeFrozenTemplate();
                }
				this._newungroup(args);  
            }
            if (ej.isNullOrUndefined(this.model.currentViewData) || this.model.currentViewData.length == 0)
                this._currentJsonData = [];
            this._showGridLines();
            this._completeAction(args);
        },
        _removeFrozenTemplate: function(){
            this.getContent().find('div').eq(0).empty();
            var $table = ej.buildTag('table.e-table');
            var $tbody = $(document.createElement('tbody'));
            $table.append(this.getHeaderTable().find('colgroup').clone()).append($tbody);
            this.getContent().find('div').eq(0).html($table);
            this.setGridContentTable($table);
        },
        _showGridLines: function () {
            var $lines = this.model.gridLines;
            if ($lines != "both") {
				this.getContent().addClass($lines != "none" ? "e-" + $lines + "lines" : "e-hidelines");
            }
        },
		_showHeaderGridLines: function(){
			var $lines = this.model.gridLines;
			if ($lines != "both") 
				this.getHeaderContent().addClass($lines != "none" ? "e-"+$lines+"lines" : "e-hidelines");
		},
        _newungroup: function (args) {
            if (args.requestType == "ungrouping")
                this._ungroup(args);
            else
                this.getContentTable().find('tbody').empty().first().append(this._getEmptyTbody());
        },
        setFormat: function () {
            var column = [];
            for (var i = 0 ; i < this.model.columns.length ; i++) {
                if (this.model.columns[i].type == "date") {
                    column.push(this.model.columns[i]);
                }
            }
            if (column.length > 0 && !ej.isNullOrUndefined(this.model.currentViewData)) {
                for (var i = 0, len = this.model.currentViewData.length; i < len ; i++) {
                    for (var j = 0 ; j < column.length ; j++) {
                        var data = ej.getObject(column[j].field, this.model.currentViewData[i]);
                        if (/^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))?$/.test(data))
                            ej.createObject(column[j].field, new Date(data), this.model.currentViewData[i]);
                    }
                }
            }
        },
        _completeAction: function (args) {
            if (this.model.editSettings.editMode.indexOf("dialog") != -1 && (args.requestType == "save" || args.requestType == "cancel") && $("#" + this._id + "_dialogEdit").data("ejDialog"))
                $("#" + this._id + "_dialogEdit").ejDialog("close");
            if (!(this.model.editSettings.showAddNewRow && this.model.editSettings.editMode == "normal"))
                this.model.isEdit = false;
            this._confirmedValue = false;
            if (ej.Grid.Actions.Grouping == args.requestType && ej.isNullOrUndefined(args.columnName) || args.requestType == "refresh" && this._LastColumnUnGroup) {
                this._LastColumnUnGroup = false;
                return;
            }
            if ((args.columnSortDirection == "ascending" || args.columnSortDirection == "descending") && !ej.isNullOrUndefined(args.columnName)) {
                var scolumn = this.getColumnByField(args.columnName);
                if (this.model.allowSorting && this.model.allowMultiSorting)
                    this._scolumns.push(scolumn.field);
                else
                    this._gridSort = scolumn.field;
            }
            if (args.requestType != 'beginedit' && args.requestType != 'add' && ((!this.model.allowScrolling  || !this.initialRender || this.model.scrollSettings.frozenRows > 0 || this.model.scrollSettings.frozenColumns > 0) && (!this.model.allowResizeToFit || !this.initialRender)))
                this.setWidthToColumns();
            if (args.requestType == "save" || args.requestType == "cancel" ||  args.requestType == "delete") {
                this._isAddNew = false;
                if (this.model.isResponsive && this.model.minWidth)
                {
                    this._refreshScroller(args);
                    this.windowonresize();
                }
            }
            if (ej.Grid.Actions.Add == args.requestType || args.requestType == "beginedit") {
                for (var count = 0 ; count < this.model.columns.length; count++) {
                    var editorEle = this.element.find('.gridform').first().find(".e-field[name='"+this.model.columns[count].field +"']");
                    if (this.model.columns[count].allowEditing && editorEle.hasClass('e-disable')) {
                        if (this._disabledEditableColumns.indexOf(this.model.columns[count].field) != -1)
                            this._disabledEditableColumns.splice(this._disabledEditableColumns.indexOf(this.model.columns[count].field), 1);
                        editorEle.prop("disabled", false).removeClass("e-disable")
                    }
                    else {
                        if (this.model.columns[count].allowEditing === false && !editorEle.hasClass('e-disable') && $.inArray(this.model.columns[count].field, this._primaryKeys) == -1 && $.inArray(this.model.columns[count].field, this._disabledEditableColumns) == -1) {
                            this._disabledEditableColumns.push(this.model.columns[count].field);
                            editorEle.addClass("e-disable").prop("disabled", true);
                        }
                    }
                }
            }
            if (!this.initialRender && (ej.Grid.Actions.UnGrouping == args.requestType || this.model.groupSettings.groupedColumns.length > 0) && !(args.requestType == "beginedit" || args.requestType == "add"))
                this._recalculateIndentWidth();
            if (ej.Grid.Actions.Paging == args.requestType || ej.Grid.Actions.BatchSave == args.requestType)
                this._refreshGridPager();
            else if ((ej.Grid.Actions.Sorting == args.requestType && this.model.allowSorting) || ej.Grid.Actions.Refresh == args.requestType  || ej.Grid.Actions.Cancel == args.requestType) {
                if (ej.gridFeatures.sort && this.getHeaderTable() !== null)
                    this._sortCompleteAction(args);
                if (this.model.allowPaging) {
                    var pageModel = $.extend({},this.getPager().ejPager("option"));
                    this._currentPage(pageModel.currentPage);
                    delete pageModel.currentPage;
					var template = this.model.pageSettings.template;
                    $.extend(this.model.pageSettings, pageModel);
					this.model.pageSettings.template = template;
                    delete this.model.pageSettings.masterObject;
                    this._refreshGridPager();
                }
				if (!this.initialRender && (this.model.scrollSettings.frozenRows > 0 || this.model.scrollSettings.frozenColumns > 0))
                    this._refreshScroller(args);
                
            } else if (ej.Grid.Actions.Delete == args.requestType || ej.Grid.Actions.Save == args.requestType || ej.Grid.Actions.Search == args.requestType) {
                this._editEventTrigger(args);
				if (!this.initialRender && (this.model.scrollSettings.frozenRows > 0 || this.model.scrollSettings.frozenColumns > 0))
					this._refreshScroller(args);
                if (this.model.allowPaging)
                    this._refreshPagerTotalRecordsCount();
            } else if (ej.Grid.Actions.Filtering == args.requestType)
                this._filterCompleteAction();
            else if (ej.Grid.Actions.BeginEdit == args.requestType || ej.Grid.Actions.Add == args.requestType)
                this._editCompleteAction(args);
            else if (ej.Grid.Actions.Grouping == args.requestType || ej.Grid.Actions.Ungrouping == args.requestType)
                this["_" + args.requestType + "CompleteAction"](args);
            if (this.model.toolbarSettings.showToolbar || (this._mediaStatus && (this.model.allowSorting || this.model.allowFiltering) && this.model.enableResponsiveRow))
                this.refreshToolbar();
            if (!this.initialRender && this.model.showSummary && this.model.summaryRows.length > 0) {
                if (this.model.currentViewData.length) {
                    if (!this.element.children(".e-gridfooter").length) {
                        var footer = this._renderGridFooter();
                        if (!ej.isNullOrUndefined(footer)) footer.insertAfter(this.getContent());
                    }
                    if (!(args.requestType == "beginedit" || args.requestType == "add")) {
                        this._createSummaryRows(this.getFooterTable());
                        this._refreshGridFooterColGroup();
                    }
                }
                else
                    this.element.children(".e-gridfooter").remove();
            }
            if (!this.initialRender && ej.gridFeatures.selection) {
                if (!this.getContent().find("td.e-selectionbackground").length)
                    this._setCurrentRow(args.requestType);
                if (args.requestType == "cancel" && this.model.selectedRowIndex != -1)
                     $(this.getRowByIndex(this.model.selectedRowIndex)).attr("aria-selected", "true").find('.e-rowcell, .e-detailrowcollapse, .e-detailrowexpand').addClass("e-selectionbackground e-active");
                if (args.requestType != "virtualscroll" && this.clearColumnSelection())
                    $(this.getHeaderTable().find("th.e-headercell")).removeClass("e-columnselection");
            }
            this.refreshBatchEditMode();
            if(this.model.scrollSettings.enableVirtualization && this.model.showColumnChooser && (!this.initialRender && args.requestType == "refresh"))
                this._virtualLoadedRows = {};
            if (!this.initialRender && (this.model.allowScrolling || this.model.isResponsive) && (this._checkScrollActions(args.requestType) || ((this.model.editSettings.editMode.indexOf("inline") != -1 || this.model.editSettings.editMode.indexOf("normal") != -1) && args.requestType == "beginedit")) ||
                (this.model.scrollSettings.virtualScrollMode == "continuous" && args.requestType == "virtualscroll")){
                if(this.model.isResponsive && this.model.minWidth)
                {
                    this._refreshScroller(args);
                    this.windowonresize()
                }
                else
                    this._refreshScroller(args);
            }
            else if (!this.model.scrollSettings.frozenColumns && this.model.allowScrolling && this.element.width() != 0)
                this.refreshScrollerEvent();
             if (!this.initialRender && this.model.parentDetails && !this.model.allowScrolling) {
                var id = this.model.parentDetails.parentID, parentObj = $("#" + id).data("ejGrid");
                parentObj.model.allowScrolling && parentObj._refreshScroller("refresh")
            }
            if (this.model.scrollSettings.virtualScrollMode == "normal" && args.requestType == "virtualscroll")
                this.getContent().find("div:first").scrollLeft(this.getScrollObject().scrollLeft());
            if (this._customPop != null && args.requestType != "sorting") {
                this._customPop.hide();
            }
            !this.initialRender && !this.model.scrollSettings.enableVirtualization && this._addLastRow();
            if (this.model.allowGrouping && this.model.showSummary)
                this._refreshGroupSummary();
            if (ej.Grid.Actions.Refresh == args.requestType && !this.initialRender && this.model.allowGrouping && this.model.groupSettings.groupedColumns.length > 0)
                this._groupingCompleteAction(args);
            if (ej.Grid.Actions.Refresh == args.requestType && !this.initialRender && this.model.allowGrouping && this.model.groupSettings.groupedColumns.length < 1)
                this._ungroupingCompleteAction(args);
			 if(this.model.allowGrouping){
                var $groupDrop = this.element.children(".e-groupdroparea");
                $groupDrop.length > 0 && $groupDrop.removeClass("e-default").removeClass("e-active");
                if(this.model.groupSettings.groupedColumns.length > 0)
                    $groupDrop.addClass("e-active");
                else
                    $groupDrop.addClass("e-default");
            }
            if (this.model.textWrapSettings)
                this._setTextWrap();
            if (args.requestType == ej.Grid.Actions.Reorder && this.model.showColumnChooser) {
                var dlgObj = $("#" + this._id + "ccDiv").data("ejDialog");
                if (dlgObj.isOpened())
                    $("#" + this._id + "_ccTail").first().remove();
                var ccBtnHeight = 0;
                if (!ej.isNullOrUndefined(this.element.find(".e-ccButton").outerHeight()))
                    ccBtnHeight += this.element.find(".e-ccButton").outerHeight();
                this.element.find(".e-ccButton").first().remove();
                $("#" + this._id + 'ccDiv_wrapper').remove();
                this.element.css('margin-top', (parseInt(this.element.css('margin-top'), 10) - ccBtnHeight));
                this._renderColumnChooser();
            }
            if(!ej.isNullOrUndefined(this._dynamicSelectedRowIndex)){
                this.selectRows(this._dynamicSelectedRowIndex);
             	this._dynamicSelectedRowIndex = null;
            }
            if (this.initialRender && args.requestType == "grouping")
                args = { requestType: "refresh" };
            if(!((this._isUngrouping || this._columnChooser  ) && ( args.requestType == "refresh") ) ){
				this._trigger("actionComplete", args);
				this._isUngrouping = false;
				this._columnChooser = false;
			}
            if ((!this._isUngrouping && !this.initialRender) || this._showHideColumns || this._columntemplaterefresh)
            this._trigger("refresh");
            if ((this.model.editSettings.showAddNewRow && this.model.editSettings.editMode == "normal")) {
                
                if (!this.initialRender && this.getContentTable().find("tr.e-addedrow").length == 0 && this.element.find(".e-gridcontent").find("tr").length != 0)
                    this._startAdd();
                 if (args.requestType == "searching")
                    this.element.find(".e-gridtoolbar").find("li#" + this._id + "_search input").focus();
            }
            
            if ((ej.Grid.Actions.BeginEdit == args.requestType || ej.Grid.Actions.Add == args.requestType) && $.isFunction($.validator))
                this.setValidation();
            if (!this.initialRender)
                this.model._groupingCollapsed = [];
            if (this._updateDataSource && this._gridRecordsCount) {
                var currentData = this.model.editSettings.showAddNewRow ? this.model.currentViewData[1] : this.model.currentViewData[0];
                if (!ej.isNullOrUndefined(currentData)) {
                    this._initColumns(currentData);
                    this.model.allowFiltering && this._renderFilterDialogs();
                    this._updateDataSource = false;
                }
            }
		    if (this.model.columnLayout == "fixed" && !this.model.isEdit)
		        this.setWidthToColumns();
		    if (this.model.allowRowDragAndDrop)
		        this._rowsDragAndDrop();
		    if (!this.initialRender && this._enableCheckSelect) {
		        var indexes = this.checkSelectedRowsIndexes[this._currentPage() - 1];
		        var headerCheckCell = this.getHeaderTable().find(".e-headercheckcelldiv .e-checkselectall");
		        if (!this._selectAllCheck && !(this.model.allowScrolling && this.model.scrollSettings.allowVirtualScrolling && [].concat.apply([], this.checkSelectedRowsIndexes).length >= this._gridRecordsCount))
					headerCheckCell.prop("checked", false);
		        if (!this._isMapSelection && indexes && indexes.length > this._gridRows.length && !this.model.scrollSettings.enableVirtualization)
		            indexes.splice(this._gridRows.length, indexes.length - this._gridRows.length);
		        if (this._isMapSelection)
		            this._mappingSelection();
		        else if (args.requestType != "paging" && args.requestType != "save" && args.requestType != "cancel" && args.requestType != "virtualscroll")
		            this.checkSelectedRowsIndexes = [];
		        else if (indexes && indexes.length && !this.model.scrollSettings.enableVirtualization && !this.model.scrollSettings.allowVirtualScrolling)
		            this.selectRows(indexes);
		        if (this.model.currentViewData != null && this.model.currentViewData.length == 0)
		            this.getHeaderTable().find(".e-headercelldiv .e-checkselectall").hide();
		        else
                    this.getHeaderTable().find(".e-headercelldiv .e-checkselectall").show();
		        if (this._selectAllCheck) { // For Selection using header after filtering
		            var selectAll = headerCheckCell.prop("checked") ^ this.selectedRowsIndexes.length == this.model.currentViewData.length;
		            headerCheckCell[0].checked = !selectAll ? !headerCheckCell[0].checked : headerCheckCell[0].checked;
		        }
		    }
        },        
        _getDataIndex: function (data, item) {
            var flag = 0, _plen;
            for (var d = 0, len = data.length; d < len; d++) {
                for (var key = 0, _plen = this._primaryKeys.length; key < _plen; key++) {
                    if (!this._checkPrimaryValue(data[d][this._primaryKeys[key]], item[this._primaryKeys[key]], this._primaryKeys[key])) {
                        if (key == _plen - 1)
                            flag = 1;
                        continue;
                    }
                    else
                        break;
                }
                if (flag) return d;
            }
            return -1;
        },
        _checkPrimaryValue: function (keyData, keyItem, field) {
            var col = this.getColumnByField(field),
            type = ej.isNullOrUndefined(col.foreignKeyField) ? col.type : col.originalType;
            if (type == "string")
                keyData = keyData.trim();
            if (keyData != keyItem)
                return true;
            else
                return false;
        },
        _eventBindings: function () {
            var rowLength = this.model.scrollSettings.frozenColumns > 0 ? this._gridRows[0].length : this._gridRows.length;
            var trIndex = 0;
            var prev;
            var pageSize = this.model.pageSettings.pageSize;
            if (ej.gridFeatures.common)
                this._refreshUnboundTemplate(this.getContentTable());
            if (this._gridRecordsCount != 0) {
                if (this.model.queryCellInfo != null || this.model.rowDataBound != null || this.model.mergeCellInfo != null || this.model.templateRefresh != null) {
                    for (var row = 0; row < rowLength; row++) {
                        var rowIndex = null, trIndex = row, viewIndex, viewData;
                        if (this.model.scrollSettings.allowVirtualScrolling && row < pageSize) {
							if(!this.model.scrollSettings.enableVirtualization){
								for (var i = 0; i < this._cloneQuery.queries.length; i++)
									prev = this._cloneQuery.queries[i].fn == "onPage" &&  this._cloneQuery.queries[i].e.pageIndex - 1;
								var value = pageSize * prev; 
								if (value != 0) {
									rowIndex = this.getContentTable().find("tr[name=" + value + "]").eq(row);
									trIndex = rowIndex.index();
								}
							}
							else{
								rowIndex = $(this._gridRows).eq(row);
								viewIndex = parseInt($(rowIndex).attr("name"), 32);	
								if($.inArray(viewIndex, this._queryCellView) != -1)		
									continue;
								if(this._virtualLoadedRecords[viewIndex])
									viewData = this._virtualLoadedRecords[viewIndex][row % this._virtualRowCount];
								trIndex = viewIndex * this._virtualRowCount + (row % this._virtualRowCount);								
							}
                        }
						else if(this.model.scrollSettings.enableVirtualization)
							rowIndex = $(this._gridRows).eq(row);
                        rowIndex = rowIndex || this.getRowByIndex(trIndex);
                        if (rowIndex.hasClass("e-virtualrow") || ej.isNullOrUndefined(this._currentJsonData[row] || viewData))
                            break;
						var rowData = this.model.scrollSettings.enableVirtualization ? viewData : this._currentJsonData[row];
                        this._rowEventTrigger(rowIndex, rowData);                       
                    }
                }
            }
        },
        _rowEventTrigger: function (row, data) {
            var args = { row: row, data: data, rowData: data };
            this._trigger("rowDataBound", args);
            var tdCells = row.cells;
            var $tdRowcells = $(row).find(".e-rowcell");
            if (this.model.queryCellInfo != null || this.model.mergeCellInfo != null || this.model.templateRefresh != null) {
                for (var cellIndex = 0; cellIndex < $tdRowcells.length; cellIndex++) {
                    var args = { cell: $tdRowcells[cellIndex], data: data, rowData: data, text: $tdRowcells[cellIndex].innerHTML };
                    var foreignKeyData = this._getForeignKeyData(args.data);
                    if ($($tdRowcells[cellIndex]).hasClass("e-rowcell"))
                        args.column = this.model.columns[cellIndex];
                    if (!ej.isNullOrUndefined(foreignKeyData))
                        args.foreignKeyData = foreignKeyData;
                    if (this.model.allowCellMerging == true) {
                        this._cellMerging(args);
                        this._trigger("mergeCellInfo", args);
                    }
                    this._trigger("queryCellInfo", args);
                    if ($($tdRowcells[cellIndex]).hasClass("e-templatecell")) {
                        var args = { cell: $tdRowcells[cellIndex], column: this.model.columns[cellIndex], data: data, rowData: data, rowIndex: $(row).index() };
                        this._trigger("templateRefresh", args);
                    }
                }
            }

        },

        setWidthToColumns: function () {
            var $cols1 = this.getContentTable().children("colgroup").find("col");
            var $cols2 = this.getHeaderTable().children("colgroup").find("col");
            var extendWidth = 0, colsIndex = [], columnsWidth;
            var undefinedColsCollection = [], hCellIndex;
            var width = this.element.width(), frozenWidth = 0, columnsTotalWidth = 0, finalWidth = 0, browserDetails = !ej.isIOSWebView() && this.getBrowserDetails();
            if (this.model.groupSettings.groupedColumns.length && !this.model.allowScrolling && this.model.groupSettings.showGroupedColumn) {
                if (browserDetails && browserDetails.browser == "msie" && parseInt(browserDetails.version, 10) > 8)
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
            if (this.model.allowResizeToFit) {
                var visibleColumnsWidth = 0; var undefinedWidthColumnsCount = 0;
                for (j = 0; j < this.model.columns.length; j++) {
                    if (this.model.columns[j].visible) {
                        if (this.model.columns[j]["width"] != undefined)
                            visibleColumnsWidth = visibleColumnsWidth + parseInt(this.model.columns[j]["width"]);
                        else
                            undefinedWidthColumnsCount = undefinedWidthColumnsCount + 1;
                    }
                }
            }
            for (var i = 0; i < $cols2.length; i++) {
                if (this.model.allowResizeToFit && this.model.columns[i]["width"] === undefined) {
                    hCellIndex = this.model.groupSettings.groupedColumns.length ? (i + this.model.groupSettings.groupedColumns.length) : i;
                    var contentWidth = this._resizer._getContentWidth(i);
                    var cellDiv = this.getHeaderTable().find('.e-headercelldiv').eq(hCellIndex);
                    var headerWidth = this._resizer._getHeaderContentWidth(cellDiv);
                    if (this.model.editSettings.editMode == "normal" && (this.model.isEdit || this._isAddNew))
                        finalWidth = browserDetails.browser == "firefox" ? parseInt($cols1[i].style.width, 10) : $cols1.eq(i).width();
                    else if (undefinedWidthColumnsCount > 0) {
                        columnsWidth = finalWidth = this.model.columns[i].visible ? parseInt(this.element.width() - visibleColumnsWidth) / undefinedWidthColumnsCount : 0;
                    }
                    if ((finalWidth < contentWidth && finalWidth < headerWidth) && undefinedWidthColumnsCount > 0) {
                        finalWidth = contentWidth > headerWidth ? contentWidth : headerWidth;
                        finalWidth += parseInt(cellDiv.css("padding-left"), 10) + parseInt(cellDiv.css("padding-right"), 10);
                        visibleColumnsWidth += finalWidth;                       
                        undefinedWidthColumnsCount -= 1;
                        this.columnsWidthCollection[i] = finalWidth;
                        columnsTotalWidth += this.model.columns[i].visible ? finalWidth : 0;
                        extendWidth += finalWidth - columnsWidth;
                    }
                    else if (undefinedWidthColumnsCount > 0 && (contentWidth > 0 || (this._dataSource() == null || this._dataSource().length == 0 || this.model.currentViewData.length == 0))) {
                        var cWidth = contentWidth > headerWidth ? contentWidth : headerWidth;
                        if (this._dataSource() == null || this._dataSource().length == 0 || this.model.currentViewData.length == 0) {
                            if (cWidth > finalWidth) {
                                finalWidth = cWidth;
                                finalWidth += parseInt(cellDiv.css("padding-left"), 10) + parseInt(cellDiv.css("padding-right"), 10);
                            }
                        }
                        else {
                            if (cWidth > finalWidth || (this.element.width() / undefinedWidthColumnsCount < visibleColumnsWidth-finalWidth && !this.model.allowTextWrap)) {
                                finalWidth = cWidth;
                                finalWidth += parseInt(cellDiv.css("padding-left"), 10) + parseInt(cellDiv.css("padding-right"), 10);
                            }
                        }
                        if (this.model.columns[i].visible) {
                            visibleColumnsWidth += finalWidth;
                            undefinedWidthColumnsCount -= 1;
                        }
                        if(columnsWidth < contentWidth || columnsWidth < headerWidth) {
                            extendWidth += finalWidth - columnsWidth;
                        }
                        else
                            colsIndex.push({ index : i, contentWidth : contentWidth, headerWidth : headerWidth });
                        this.columnsWidthCollection[i] = finalWidth;
                        columnsTotalWidth += this.model.columns[i].visible ? finalWidth : 0;
                    }
                } else {
                    if (typeof (this.model.columns[i].width) == "string" && this.model.columns[i].width.indexOf("%") != -1) {
                        this._columnsPixelConvert(this.model.columns[i],i);
                    }
                    else
                        var columnWidth = parseInt(this.model.columns[i]["width"], 10);
                    columnsTotalWidth += this.model.columns[i].visible ? columnWidth : 0;
                }
                if (this.model.columns[i]["priority"])
                    $cols2.eq(i).addClass("e-table-priority-" + this.model.columns[i]["priority"]);
                if (!ej.isNullOrUndefined(this.columnsWidthCollection[i])) {
                    $cols1.eq(i).width(this.columnsWidthCollection[i]);
                    $cols2.eq(i).width(this.columnsWidthCollection[i]);
                } else if (this.model.allowScrolling) {
                    undefinedColsCollection.push(this.model.columns[i]);
                }
            }
            var colsIndexLength = colsIndex.length;
             for (var i = 0; i < colsIndexLength; i++) { 
				var cellDiv = this.getHeaderTable().find('.e-headercelldiv').eq(colsIndex[i].index);
				var paddingWidth = parseInt(cellDiv.css("padding-left"), 10) + parseInt(cellDiv.css("padding-right"), 10);
                extendWidth = extendWidth / colsIndexLength;
                if(this.columnsWidthCollection[colsIndex[i]["index"]] > extendWidth) {      
                  if(this.columnsWidthCollection[colsIndex[i]["index"]] - extendWidth > colsIndex[i]["headerWidth"] && this.columnsWidthCollection[colsIndex[i]["index"]] - extendWidth > colsIndex[i]["contentWidth"] ) {        
                    $cols1.eq(colsIndex[i]["index"]).width(this.columnsWidthCollection[colsIndex[i]["index"]] - extendWidth);
                    $cols2.eq(colsIndex[i]["index"]).width(this.columnsWidthCollection[colsIndex[i]["index"]]- extendWidth);
                  }
                  else {
                      if(colsIndex[i]["headerWidth"] > colsIndex[i]["contentWidth"]) {
                        $cols1.eq(colsIndex[i]["index"]).width(colsIndex[i]["headerWidth"] + paddingWidth);
                        $cols2.eq(colsIndex[i]["index"]).width(colsIndex[i]["headerWidth"] + paddingWidth);
                    }
                    else {
                        $cols1.eq(colsIndex[i]["index"]).width(colsIndex[i]["contentWidth"] + paddingWidth);
                        $cols2.eq(colsIndex[i]["index"]).width(colsIndex[i]["contentWidth"] + paddingWidth);
                    }
                  }                  
                }
                else {
                     if(colsIndex[i]["headerWidth"] > colsIndex[i]["contentWidth"]) {
                        $cols1.eq(colsIndex[i]["index"]).width(colsIndex[i]["headerWidth"] + paddingWidth);
                        $cols2.eq(colsIndex[i]["index"]).width(colsIndex[i]["headerWidth"] + paddingWidth);
                    }
                    else {
                        $cols1.eq(colsIndex[i]["index"]).width(colsIndex[i]["contentWidth"] + paddingWidth);
                        $cols2.eq(colsIndex[i]["index"]).width(colsIndex[i]["contentWidth"] + paddingWidth);
                    }
                }
				if(this.columnsWidthCollection[colsIndex[i]["index"]] > extendWidth)
                this.columnsWidthCollection[colsIndex[i]["index"]] = this.columnsWidthCollection[colsIndex[i]["index"]] - extendWidth;
            }
            var hiddenColLength = undefinedColsCollection.filter(function (e) { return !e.visible }).length;
            var headercell = this.getHeaderTable().find("thead").find(".e-headercell").not(".e-detailheadercell,.e-stackedHeaderCell");
            var totalColWidth = ej.sum(this.columnsWidthCollection);
            for (var i = 0; i < undefinedColsCollection.length; i++) {
                if (!undefinedColsCollection[i].visible)
                    continue;
                var colIndex = !ej.isNullOrUndefined(undefinedColsCollection[i].field) && undefinedColsCollection[i].field != "" ? this.getColumnIndexByField(undefinedColsCollection[i].field) : this.getColumnIndexByHeaderText(undefinedColsCollection[i].headerText);
                var cell = headercell.eq(colIndex)[0];
                var colWidth;
                if (!ej.isNullOrUndefined(this.model.commonWidth))
                    colWidth = this.model.commonWidth;
                else {
                    var gridWidth = typeof (this.model.scrollSettings.width) == "string" ? this.element.width() : this.model.scrollSettings.width || this.model.width;
                    var cellWidth = (gridWidth - totalColWidth) / (undefinedColsCollection.length - hiddenColLength);
                    colWidth = !this.model.scrollSettings.frozenColumns ? cell.getBoundingClientRect().width : cellWidth;
                }
                if (ej.isNullOrUndefined(colWidth))
                    colWidth = cell.offsetWidth;
                if (parseInt(colWidth) < 15) {
                    colWidth = (width / this.model.columns.length).toFixed(2);
                    var bSize = (width / (this.model.scrollSettings.buttonSize || 18) / 100).toFixed(2);
                    colWidth = colWidth - bSize;
                }
                $cols1.eq(colIndex).css("width", colWidth + "px");
                $cols2.eq(colIndex).css("width", colWidth + "px");
                this.model.columns[colIndex].width = colWidth;
                this.columnsWidthCollection[colIndex] = parseFloat(colWidth);
            }
            if (!hiddenColLength)
                this._undefinedColsCollection = null;
            if (this.model.columnLayout == "fixed") {
                if (this.model.scrollSettings && this.model.scrollSettings.frozenColumns == 0) {
                    this.getHeaderTable().width(columnsTotalWidth);
                    this.getContentTable().width(columnsTotalWidth);
                    if(!ej.isNullOrUndefined(this.getFooterTable()))
                        this.getFooterTable().width(columnsTotalWidth);
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
            if (!this.model.allowScrolling && this.model.allowResizeToFit && ej.isNullOrUndefined(this.model._isPrinting) && !this.model.isResponsive && columnsTotalWidth > width) {
                this.model.allowScrolling = true;
                this.model.scrollSettings.width = width;
                this.getHeaderTable().parent().addClass("e-headercontent");
                this._renderScroller();
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
                for (var i = 0; i < this.model.columns.length; i++) {
                    totalWidth += this.model.columns[i].visible ? parseFloat(this.columnsWidthCollection[i], 10) : 0;
                    if (this.model.scrollSettings.frozenColumns - 1 == i)
                        frozenWidth = Math.ceil(totalWidth);
                }
                this.element.width(this.model.scrollSettings.width || this.model.width);
                var gridContentWidth = this.element.find(".e-gridcontent").children().first().width();
                if (gridContentWidth > totalWidth)
					totalWidth = gridContentWidth + ((this.getContentTable().height() < this.model.scrollSettings.height && (!ej.isNullOrUndefined(this.getContent().data("ejScroller")) ? this.getScrollObject()._vScroll : false)) ? this.model.scrollSettings.buttonSize : 0);
                else
                    totalWidth += ((this.getContentTable().height() > this.model.scrollSettings.height) ? this.model.scrollSettings.buttonSize : 0);
                if (totalWidth < this.element.width()) {
                    totalWidth = "100%";
                }
                var finalcolWidth = typeof (totalWidth) == "string" && totalWidth.indexOf("%") != -1 ? totalWidth : totalWidth - frozenWidth;
                this.getContent().find(".e-frozencontentdiv").outerWidth(frozenWidth)
                    .end().find(".e-movablecontentdiv").outerWidth(finalcolWidth);
                this.getHeaderContent().find(".e-frozenheaderdiv").outerWidth(frozenWidth)
                    .end().find(".e-movableheaderdiv").outerWidth(finalcolWidth);
                if (this.getFooterContent())
                    this.getFooterContent().find(".e-frozenfooterdiv").outerWidth(frozenWidth)
                        .end().find(".e-movablefooterdiv").outerWidth(finalcolWidth);
            }
            if(!this.initialRender && this.model.allowResizeToFit && this.model.allowScrolling && this.model.scrollSettings.enableVirtualization ){			
               var width = this.getHeaderTable().width() > this.getContentTable().width() ? this.getHeaderTable().width() : this.getContentTable().width();
                if(!ej.isNullOrUndefined(this.getFooterTable()))
                    this.getFooterTable().width(width);
			}
        },
        _initialEndRendering: function () {
            // use this method to add behaviour after grid render.
            if (this.model.allowRowDragAndDrop)
                this._rowsDragAndDrop();
            if (this.model.editSettings.allowEditing || this.model.editSettings.allowAdding) {
                if (this.model.editSettings.editMode == "dialog" || this.model.editSettings.editMode == "dialogtemplate")
                    this.element.append(this._renderDialog());
                else if (this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate")
                    this.element.append(this._renderExternalForm());
            }
            
            (this.model.editSettings.editMode == "batch" || this.model.editSettings.showDeleteConfirmDialog) && this._renderConfirmDialog();
            (this.model.scrollSettings.frozenColumns > 0 || this.model.scrollSettings.frozenRows > 0) && $("#" + this._id + 'AlertDialog').length == 0 && this._renderAlertDialog();
            if (this.model.allowMultiSorting || this.model.selectionType == "multiple")
                this._renderMultiTouchDialog();
            if (this.model.scrollSettings.frozenColumns > 0 && !this.model.allowScrolling) {
                this.getContent().remove();
                this.getHeaderTable().eq(1).remove();
                this._alertDialog.find(".e-content").text(this.localizedLabels.FrozenColumnsScrollAlert);
                this._alertDialog.ejDialog("open");
                return;
            }
            this.model.scrollSettings.allowVirtualScrolling && !this.model.scrollSettings.enableVirtualization && this._createPagerStatusBar();
            this._getRowHeights();
            if (this.element.width() != 0 && this.element.is(":visible") && this.model.allowScrolling) {
                this._renderScroller();
                if (!(this.model.scrollSettings.frozenRows > 0 || this.model.scrollSettings.frozenColumns > 0)) {
                    this.setWidthToColumns();
                    var scrollObj = !ej.isNullOrUndefined(this.getContent().data("ejScroller")) ? this.getScrollObject() : null;
                    scrollObj != null && scrollObj.refresh();
					this._isHscrollcss();
                    this.refreshScrollerEvent();
                    this._scrollFooterColgroup(true);
                }
            }
            else if ((this.model.allowScrolling || (this.model.allowGrouping && this.model.groupSettings.groupedColumns.length)) && (this.element.width() <= 0 || !this.element.is(":visible"))) {
                var proxy = this, myVar = setInterval(function () {
                    if (!ej.isNullOrUndefined(proxy.element) && proxy.element.width() > 0 && !ej.isNullOrUndefined(proxy.element.width()) && proxy.element.is(":visible")) {
                        if (proxy.model.allowScrolling) {
                            proxy._renderScroller();
                            if (!(proxy.model.scrollSettings.frozenRows > 0 || proxy.model.scrollSettings.frozenColumns > 0)) {
                                proxy.setWidthToColumns();
                                var scrollObj = !ej.isNullOrUndefined(proxy.getContent().data("ejScroller")) ? proxy.getScrollObject() : null;
                                scrollObj != null && scrollObj.refresh();
                                proxy._isHscrollcss();
								proxy._addLastRow();
                                proxy.refreshScrollerEvent();
                            }
                        }
                        if (proxy.model.allowGrouping && proxy.model.groupSettings.groupedColumns.length && proxy.getHeaderTable().find(".e-grouptopleftcell").width() <= 0)
                            proxy.getHeaderTable().find(".e-grouptopleftcell").css('width', proxy.getHeaderTable().find('colgroup col').eq(0).width());
                        proxy._endRendering();
                        clearInterval(myVar);
                    }
                }, 100);
                return;
            }
           this._endRendering();
        },

        _scrollFooterColgroup: function (initialfooter) {
            if(ej.isNullOrUndefined(initialfooter))
            {
				if (this.model.scrollSettings.frozenColumns > 0 && !this.getFooterTable().find("colgroup").length) 
                {
                    this.getFooterTable().eq(0).append(this.getHeaderTable().eq(0).find("colgroup").clone());
                    this.getFooterTable().eq(1).append(this.getHeaderTable().eq(1).find("colgroup").clone());
                }
                if(!this.getFooterTable().find("colgroup").length)
                    this.getFooterTable().append(this.getHeaderTable().find("colgroup").clone());
                else
                    this.getFooterTable().find("colgroup").first().replaceWith(this.getHeaderTable().find("colgroup").clone());                
            }
            var scrollObj = !ej.isNullOrUndefined(this.getContent().data("ejScroller")) ? this.getScrollObject() : null;
            if(scrollObj && scrollObj.isVScroll() && !ej.isNullOrUndefined(this.getFooterContent()))
            {
                this.getFooterContent().find("colgroup").append("<col style='width : " + this.model.scrollSettings.scrollerSize + "px'></col>");
                if(!this.getFooterContent().find("tr.e-gridSummaryRows td.e-scrollindent").length)
                this.getFooterContent().find("tr.e-gridSummaryRows").append("<td class='e-scrollindent'></td>");
            }
        },

        _endRendering: function () {
            if (!ej.isNullOrUndefined(this.model.serverProperties)) {
                var chkIndexes = this.model.serverProperties._checkSelectedRowsIndexes;
                this.checkSelectedRowsIndexes = chkIndexes && chkIndexes.length ? chkIndexes : this.checkSelectedRowsIndexes;
            }
            if (!ej.isNullOrUndefined(this.getContent().data("ejScroller")) && this.model.allowScrolling)
                var scroller = this.getScrollObject();
            var css = this.model.enableRTL ? "e-summaryscroll e-rtl" : "e-summaryscroll";
            if (this.model.allowScrolling && this.model.showSummary) {
                if(scroller._vScroll)
                    this.element.find(".e-summaryrow.e-scroller").addClass(css);
                this.getFooterTable() && this._scrollFooterColgroup();
            }
            this._addMedia();
            if(this.model.allowScrolling && this.model.allowTextWrap && !this.model.scrollSettings.allowVirtualScrolling) this.getContent().first().ejScroller("refresh");
            if (this.model.scrollSettings.allowVirtualScrolling) {
                this._currentPage(1);
                if (this._currentPage() == 1 && !this.model.scrollSettings.enableVirtualization)
                    this._virtualLoadedRecords[this._currentPage()] = this._currentJsonData;
                if(this.model.scrollSettings.enableVirtualization)
                    this._refreshVirtualView();				
                else
                    this._refreshVirtualContent(this._currentPage());
                this.getContent().first().ejScroller("refresh");
                if (this.getContent().ejScroller("isVScroll")) {
                    this.element.find(".e-gridheader").addClass("e-scrollcss");
                }
                else
                    this.element.find(".e-gridheader").removeClass("e-scrollcss");
				this._isHscrollcss();
            }
            if (this.model.allowSelection == true && this.model.selectionType == "multiple" && this._selectedMultipleRows().length > 0)
                this._selectingMultipleRows(this._selectedMultipleRows());
            if (this._selectedRow() != -1 || this._selectedMultipleRows().length == 1) {
                var row = this._selectedMultipleRows();
                var indexes = row.length ? row : this._selectedRow();
                this.selectRows(indexes);
            }
            if (this.model.allowFiltering && this.model.filterSettings.filterType == "filterbar" && !this.model.allowPaging && !this.model.scrollSettings.allowVirtualScrolling)
                this._createPagerStatusBar();
            if (ej.gridFeatures.common)
                this.rowHeightRefresh()
            if (ej.gridFeatures.filter && ["menu", "excel"].indexOf(this.model.filterSettings.filterType) != -1)
                this._refreshFilterIcon();
            if (this.model.allowGrouping && this.model.groupSettings.groupedColumns.length != 0)
                this._recalculateIndentWidth();
            if (this.initialRender && (!this.model.scrollSettings.enableVirtualization || this._gridRows.length < this._virtualRowCount))
                this._addLastRow();
        },

        _addLastRow: function () {
            var lastRowtd = this.getContentTable().find("tr:last").find("td"), rowHeight = 0;

            if (this.model.allowScrolling && !this.model.scrollSettings.allowVirtualScrolling && !ej.isNullOrUndefined(this.model.dataSource) && !ej.isNullOrUndefined(this.getRows())) {
                for (var i = 0; i < this.getRows().length; i++)
                    rowHeight += $(this.getRows()[i]).height();

                if (rowHeight < this.getContent().height() - 1)
                    lastRowtd.addClass("e-lastrowcell");
            }
            if(this.model.scrollSettings.allowVirtualScrolling && this.getContentTable().height() < this.getContent().height())
                lastRowtd.addClass("e-lastrowcell");
        },
        _addMedia: function () {
            if (!this.model.enablePersistence && typeof (this.model.scrollSettings.width) != "string" && this.model.scrollSettings.width > 0) {
                this._responsiveScrollWidth = this._originalScrollWidth = this.model.scrollSettings.width;
            }
            else
                this._originalScrollWidth = this.element.width();
            if (typeof (this.model.scrollSettings.height) != "string" && this.model.scrollSettings.height > 0)
                this._responsiveScrollHiehgt = this.model.scrollSettings.height;
            if (this.model.minWidth && this.model.isResponsive) {
                this._$onresize = $.proxy(this.windowonresize, this);
                $(window).on("resize", this._$onresize);
                if ($.isFunction(window.matchMedia)) {
                    var mediaFilterObj = window.matchMedia("(max-width: 768px)");
                    this._mediaStatus = mediaFilterObj.matches;
                }
                this.windowonresize();
            }
        },
        _getNoncontentHeight: function () {   
            var height = 0;
            if (!ej.isNullOrUndefined(this.getHeaderContent().outerHeight()))
                height += this.getHeaderContent().outerHeight();
            if (this.model.toolbarSettings.showToolbar && !ej.isNullOrUndefined(this.element.find('.e-gridtoolbar').outerHeight()))
                height += this.element.find('.e-gridtoolbar').outerHeight();
            if (this.model.allowPaging && !ej.isNullOrUndefined(this.element.find('.e-pager').outerHeight()))
                height += this.element.find('.e-pager').outerHeight();
            if (this.model.showColumnChooser && !ej.isNullOrUndefined(this.element.find(".e-ccButton").outerHeight()))
                height += this.element.find(".e-ccButton").outerHeight();
            if (this.model.allowGrouping && this.model.groupSettings.showDropArea && !ej.isNullOrUndefined(this.element.find('.e-groupdroparea').outerHeight()))
                height += this.element.find('.e-groupdroparea').outerHeight();
            if (this.model.showSummary && !ej.isNullOrUndefined(this.element.find('.e-gridsummary').outerHeight()))
                height += this.element.find('.e-gridsummary').outerHeight();
            return height;
        },
        
        setDimension: function (height, width) {
            var originalHeight = height - this._getNoncontentHeight();
            this.model.scrollSettings.height = originalHeight;
            this.model.scrollSettings.width = width;
            this._renderScroller();
        },
		_getVisibleColumnsWidth: function(){
			var i,gridColsWidth=0;
			for(i=0; i<this.columnsWidthCollection.length; i++){
				if(this.model.columns[i].visible)
					gridColsWidth += this.columnsWidthCollection[i];
			}
			return gridColsWidth;
		},
		setPhoneModeMaxWidth: function (value) {
		    this._gridPhoneMode = value;
		},
        _mediaQueryUpdate: function (isScroller, elemHeight, width, winHeight) {
            if (window.innerWidth <= this._gridPhoneMode && this.model.enableResponsiveRow) {
                var contentStyle=this.getContentTable()[0].style;
               if(contentStyle.removeAttribute)
                   contentStyle.removeAttribute('min-width');
               else        
                   contentStyle.removeProperty('min-width');
                var scrollObj = this.getContent().data('ejScroller');
                if (scrollObj)
                    this.getContent().ejScroller('destroy');
                return;
            }
            var scrollObj = !ej.isNullOrUndefined(this.getContent().data("ejScroller")) ? this.getScrollObject() : null;
            if (isScroller) {
                this.model.scrollSettings.width = ej.isNullOrUndefined(this._responsiveScrollWidth) ? width : Math.min(this._responsiveScrollWidth, width);
                var height = Math.min(winHeight, elemHeight) - this._getNoncontentHeight();
                height = ej.isNullOrUndefined(this._responsiveScrollHiehgt) ? height : Math.min(this._responsiveScrollHiehgt, height);
                if(((this.element.parent().is("body") && $(document).height() > height) ||(height > this.element.parent().height())) && this.model.scrollSettings.height != "auto")
					height -= parseInt(this.element.parent().css('margin-bottom')+1);
				height = this.model.scrollSettings.height != "auto" ? height : this.model.scrollSettings.height;
				if ((this.model.minWidth > width || this.getContentTable().width() > width) && elemHeight > winHeight)
                    height = height != "auto" ? height + this.model.scrollSettings.buttonSize : height ;
                if (ej.isNullOrUndefined(this.getRows()))
                    height = '100%';
                this.model.scrollSettings.height = this._isHeightResponsive ? height : this._initHeight ? this._initHeight : this.getContentTable()[0].scrollHeight;
                this.element.find(".e-gridheader").first().find("div").first().addClass("e-headercontent");
            }
            else {
                this.model.scrollSettings.width = '100%';
                if (!ej.isNullOrUndefined(this._responsiveScrollWidth))
                    this.model.scrollSettings.width = Math.min(this._responsiveScrollWidth, width);
                var modifyHeight = Math.min(winHeight, elemHeight);
                var height = modifyHeight - this._getNoncontentHeight();
                if (!ej.isNullOrUndefined(this._responsiveScrollHiehgt))
                    height = Math.min(this._responsiveScrollHiehgt, height);
                if(((this.element.parent().is("body") && $(document).height() > height) ||(height > this.element.parent().height())) && this.model.scrollSettings.height != "auto")
					height -= parseInt(this.element.parent().css('margin-bottom'));
				height = this.model.scrollSettings.height != "auto" ? height : this.model.scrollSettings.height;
				if (!ej.isNullOrUndefined(this._responsiveScrollWidth) && this.model.scrollSettings.width == this._responsiveScrollWidth && (this.model.minWidth > this._responsiveScrollWidth || this._getVisibleColumnsWidth() > this._responsiveScrollWidth) || (ej.isNullOrUndefined(this._responsiveScrollWidth) && (this.getRowHeight() == height || this._isHeightResponsive) && this.getContentTable().width() > width))
                   height = height != "auto" ? height + this.model.scrollSettings.buttonSize : height;
                if (ej.isNullOrUndefined(this.getRows()))
                    height = '100%';
                if (this.getContent().height() >= height && !this._resize && !this.initialRender && typeof(this.model.scrollSettings.width) == "string")
                    this.model.scrollSettings.width = width;
                this.model.scrollSettings.height = this._isHeightResponsive ? height : this._initHeight ? this._initHeight : this.getContentTable()[0].scrollHeight;
                this.element.find(".e-gridheader").first().find("div").first().addClass("e-headercontent");
            }
            if (scrollObj != null)
                scrollObj.refresh(scrollObj.isHScroll() && scrollObj.isVScroll());
            this._renderScroller();
            this._resize = false;
        },
        windowonresize: function (e) {
            if (!this.element.is(":visible")) {
                var proxy = this;
                proxy._isVisible = true;
                var testVar = setInterval(function () {
                    if (!ej.isNullOrUndefined(proxy.element) && proxy.element.is(":visible") && proxy._isVisible) {
                        proxy.windowonresize();
                        proxy._isVisible = false;
                        clearInterval(testVar);
                    }
                    else if (!ej.isNullOrUndefined(proxy.element))
                        clearInterval(testVar);
                }, 100);
                return;
            }
            if (e && e.type == "resize")
                this._resize = true;
            this.model.scrollSettings.width = this._responsiveScrollWidth;
            var width, height;
            this.element.css("width", '100%');
            this.getContentTable().width('100%');
            this.getHeaderTable().width('100%');
            if(!ej.isNullOrUndefined(this.getFooterTable()))
                this.getFooterTable().width('100%');
            this.getContentTable().css('minWidth', this.model.minWidth);
            if (this._isHeightResponsive) {
                this.getContent().height("100%");
                this.getContent().find(".e-content").height('100%');
            }          
            this.getHeaderTable().css("min-width", this.model.minWidth);
            width = this.element.width();
            var winHeight = $(window).height() - this.element.offset()['top'];
            if (winHeight < this.element.offset()['top'])
                winHeight = $(document).height() - this.element.offset()['top'];
            var rowCount = !ej.isNullOrUndefined(this.getRows()) ? this.getRows().length : 1;
            var isBody = this.element.parent().is($('body')) || this.element.parent().height() == $('body').height() || (["", "auto"].indexOf(this.element.parent()[0].style.height) != -1);
            var originalElemHeight=this.getContentTable()[0].scrollHeight + this._getNoncontentHeight();
            var elemHeight = isBody ? winHeight : this.element.parent().height();
            originalElemHeight += parseInt(this.element.parent().css('margin-top'));
            var isScroller = this.model.minWidth > width || elemHeight <= originalElemHeight;
            this._mediaQueryUpdate(isScroller, elemHeight, width, originalElemHeight)
        },
        _removeMedia: function () {
            $(window).off("resize", this._$onresize);
            this.getContentTable().css("min-width", "");
            this.getHeaderTable().css("min-width", "");
            this.getContentTable().css("width", "");
            this.model.scrollSettings.width = "auto";
            if (this.getContent().data("ejScroller"))
                this.getContent().ejScroller("destroy");
        },
        _getRowHeights: function () {
            var trs = this.getRows(), frotrs = [], movtrs = [];
            if (trs !== null) {
                this._rowHeightCollection = [];
                if (trs[1] !== undefined && trs[1].length && ((this.model.scrollSettings.frozenColumns > 0 && trs[0] !== undefined) || (trs[0] !== undefined && typeof trs[0].item !== "undefined" && typeof trs[0].length == "number" && typeof trs[1].item !== "undefined" && typeof trs[1].length == "number"))) {
                    frotrs = trs[0];
                    movtrs = trs[1];
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
        },
        _getEmptyTbody: function () {
            var $emptyTd = ej.buildTag('td.emptyrecord', this.localizedLabels.EmptyRecord, {}, { colSpan: (this.model.columns.length- this._hiddenColumns.length)});
            return $(document.createElement("tr")).append($emptyTd);
        },
        _getIndentCol: function () {
            return ej.buildTag("col", "", { width: "30px" });
        },
        _createSortElement: function () {
            return ej.buildTag('span.e-icon', "&nbsp;");
        },
        _createSortNumber: function (number, header) {
            if (header.css("text-align") == "right")
            return ej.buildTag('span.e-number', number, { "color": "white", "font-size": "9px", "text-align": "center", "float": "left" });
            else
            return ej.buildTag('span.e-number', number, { "color": "white", "font-size": "9px", "text-align": "center", "float": "right" });
        },
        _onFocusIn: function (e) {
           var proxy=this;
		   setTimeout(function(){proxy.element.removeClass('e-activefocusout')},0);
        },
        _onFocusOut: function (e) {
            var proxy=this;
            setTimeout(function(){
				proxy.element.addClass('e-activefocusout');
            },0)
        },
        _wireEvents: function () {
            this._on(this.element, ($.isFunction($.fn.tap) && this.model.enableTouch) ? "tap" : "click", this._clickHandler);
            this._on(this.element, ($.isFunction($.fn.tap) && this.model.enableTouch) ? "tap" : "click", ".e-gridheader", this._mouseClickHandler);
            if (this.model.enableFocusout) {
                this._on(this.element, "focusout", this._onFocusOut);
                this._on(this.element, "focusin", this._onFocusIn);
            }
            if (ej.gridFeatures.common) {
				this._on(this.element, ($.isFunction($.fn.doubletap) && this.model.enableTouch) ? "doubletap" : "dblclick", ".e-gridcontent > div:first", this._recorddblClickHandler);
                if (this.model.rightClick)
                    this._on(this.element, "contextmenu", this._rightClickHandler);
                this._on(this.element, "click", ".e-gridcontent", this._recordClick);
                this._enableRowHover();
                if (this.model.enableTouch)
                    this._on(this.element, "swipeleft swiperight", ".e-gridcontent div > .e-table", $.proxy(this._touchGrid, this));
                else
                    this.element.addClass("e-touch");
                this._on(this.element, "mousedown", ".e-gridheader", this._headerMouseDown);
                if ((this.model.allowRowDragAndDrop || this.model.selectionSettings.allowDragSelection) && this.model.selectionType == "multiple")
                    this._on(this.element, "touchstart mousedown", ".e-gridcontent", this._contentMouseDown);
                this._on(this.element, "mouseover mouseleave", ".e-gridheader:first", this._headerHover);
                this._on(this.element, ej.eventType.mouseMove, ".e-gridheader:first", this._headerHover);
                this.model.allowResizeToFit && this._on(this.element, "dblclick", ".e-gridheader", this._headerdblClickHandler);
                if (this.model.allowResizing) {
                    this._on(this.element, ej.eventType.mouseMove,".e-gridheader:first", this._mouseMove);
                    this._on(this.element, "mouseup", this._mouseUp);
                }
                if (this.model.allowKeyboardNavigation) {
                    this.element[0].tabIndex = this.element[0].tabIndex == -1 ? 0 : this.element[0].tabIndex;
                    this.element[0].accessKey = (!ej.isNullOrUndefined(this.element[0].accessKey) && this.element[0].accessKey != "") ? this.element[0].accessKey : "e";
                    this._on(this.element, "keyup", this._keyDownHandler);
                }
            }
            if (ej.gridFeatures.edit) {
                this._enableEditingEvents();
            }
            if (this.model.allowGrouping) {
                this._enableGroupingEvents();
                this._on(this.element, "mouseenter mouseleave", ".e-groupdroparea,.e-groupheadercell", this._dropAreaHover);

            }
            this._enableFilterEvents();
        },
        _enableFilterEvents: function () {
            if (this.model.allowMultiSorting || this.model.selectionType == "multiple" || this.model.allowFiltering)
                this._on($(document), "mousedown", this._docClickHandler);
            if (this.model.allowFiltering) {
                var proxy = this, $target;
                this._off(this.element, "keyup", ".e-filterbar input")._on(this.element, "keyup", ".e-filterbar input", this._filterBarHandler);
                this._on(this.element, "focus click", ".e-filterbar", this._filterBarClose);
            }
        },
        _docClickHandler: function (e) {
            var details = !ej.isIOSWebView() && this.getBrowserDetails(), $target = $(e.target);
            if (this._customPop != null && this.element.find(e.target).length == 0)
                this._customPop.hide();
            if (this.model.allowFiltering) {
                if (this.model.filterSettings.filterType == "menu" || this.model.filterSettings.filterType == "excel") {
                    if (this._$colType && ($(e.target).find(".e-grid.e-dlgcontainer").length > 1 || $(e.target).find(".e-excelfilter").length > 1))
                        if (details && details.browser == "msie")
                            e.target.tagName != "BODY" && (!this.isExcelFilter ? this._closeFilterDlg() : this._excelFilter.closeXFDialog(e));
                        else
                            !this._isExcelFilter ? this._closeFilterDlg() : this._excelFilter.closeXFDialog(e);
                } else if (!$target.hasClass("e-filtertext") && !$target.hasClass("e-cancel"))
                    this.getFilterBar().find(".e-cancel").addClass("e-hide");
            }

        },
        _mouseClickHandler: function (e) {
            var $temp = $(e.target), $target, $cloneCommonQuery = this.commonQuery.clone(), currentColumn;
            if ($temp.closest(".e-grid").length != 0 && $temp.closest(".e-grid").attr("id") !== this._id) return;
            if (this.getHeaderTable().find('.e-columnheader').not('.e-stackedHeaderRow').css('cursor') == "col-resize")
                return;
            if ($(e.target).is(".e-ascending, .e-descending"))
                $target = $(e.target.parentNode);
            else if ($temp.hasClass('e-groupheadercell'))
                $target = $temp.children("div");
            else
                $target = $(e.target);
            if (this._$fDlgIsOpen && this.model.allowFiltering && (this.model.filterSettings.filterType == "menu" || this._isExcelFilter)) {
                $.fx.off = true;
                this._closeFDialog();
                $.fx.off = false;
            }
            this.getHeaderTable().find(".e-columnheader").find(".e-headercellactive").removeClass("e-headercellactive").removeClass("e-active");
            if ($target.hasClass("e-headercelldiv") || $target.hasClass("e-headercell") && $.inArray('column', this.model.selectionSettings.selectionMode) == -1 || (!$target.hasClass("e-togglegroupbutton") && $target.closest(".e-headercelldiv").length && $.inArray($target[0].tagName, ["SELECT", "INPUT", "TEXTAREA"]) == -1)
                || ($target.closest(".e-groupheadercell").length && $(e.target).is(".e-ascending, .e-descending"))) {
                if (!this.model.allowSorting || ej.gridFeatures.sort === undefined)
                    return;
                $targetnew = ($target.hasClass("e-headercelldiv") || $target.closest(".e-groupheadercell").length) ? $target : $target.hasClass("e-headercell") ? $target.find(".e-headercelldiv") : $target.closest(".e-headercelldiv");
                var columnName = $targetnew.attr("data-ej-mappingname");
                var columnSortDirection = ej.sortOrder.Ascending;
                this._$prevSElementTarget = this._$curSElementTarget;
                this._$curSElementTarget = $target;
                if ($target.parent().find('span').hasClass("e-ascending"))
                    var columnSortDirection = ej.sortOrder.Descending;
                else
                    var columnSortDirection = ej.sortOrder.Ascending;
                if (e["pointerType"] == "touch" && this._customPop != null && !this._customPop.is(":visible") && this._customPop.find(".e-sortdirect").hasClass("e-spanclicked"))
                    this._customPop.show();
                if (e["pointerType"] == "touch" && this._customPop != null && (this._customPop.find(".e-rowselect").is(":visible") || !this._customPop.find(".e-sortdirect").hasClass("e-spanclicked")) && this.model.allowMultiSorting) {
                    var $offset = $target.offset();
                    this._customPop.removeAttr("style");
                    this._customPop.offset({ left: $offset.left, top: $offset.top - this.getHeaderTable().find(".e-columnheader").height()}).find(".e-sortdirect").show().end()
                        .find(".e-rowselect").hide().end().show();
                }
                if (this.model.allowMultiSorting && (e.ctrlKey || this._enableSortMultiTouch))
                    this.multiSortRequest = true;
                if (e.shiftKey && $.inArray(columnName, this.model.groupSettings.groupedColumns) == -1) {
                    this._removeSortedColumnFromCollection(columnName);
                    this.multiSortRequest = true;
                    columnName = null;
                    this.sortColumn(columnName, columnSortDirection);
                }
                if (!ej.isNullOrUndefined(columnName))
                    this.sortColumn(columnName, columnSortDirection);
            } else if ($target.hasClass("e-togglegroupbutton") && this.model.allowGrouping) {
                var field = $target.parent().children(".e-headercelldiv").attr("data-ej-mappingname");
                $target.hasClass("e-togglegroup") && this.groupColumn(field);
                $target.hasClass("e-toggleungroup") && this.ungroupColumn(field);
            } else if ($target.hasClass("e-filtericon") || $target.hasClass("e-filteredicon") || $target.hasClass('e-responsivefilterColDiv') || $target.parent().hasClass('e-responsivefilterColDiv')) {
                var columnName = $target.parent().find(".e-headercelldiv").attr("data-ej-mappingname") || $target.attr("data-ej-mappingname") || $($target.parent()).attr("data-ej-mappingname");
                this._$prevFieldName = this._$curFieldName, currentColumn = this.getColumnByField(columnName);
                var localXFLabel = { True: this.localizedLabels.True, False: this.localizedLabels.False };
                if (this.model.allowFiltering) {
                    var proxy = this;
                    if (this.model.filterSettings.filterType == "excel" && currentColumn.filterType == "menu" && $.inArray(currentColumn.type, this._menuColTypes) == -1) {
                        this._renderFilters(currentColumn);
                        this._menuColTypes.push(currentColumn.type);
                    }
                    else if (((this.model.filterSettings.filterType == "menu" && currentColumn.filterType == "excel") || (this.model.filterSettings.filterType == "excel" && currentColumn.filterType != "menu")) && $.inArray(currentColumn.type, this._excelColTypes) == -1) {
                        this._renderFilters(currentColumn);
                        this._excelColTypes.push(currentColumn.type);
                    }
                    $.each(this.model.columns, function (indx, col) {
                        if (col.field == columnName) {
                            proxy._$colType = col.type;
                            proxy._$curFieldName = col.field;
                            proxy._$colFormat = col.format;
                            proxy._$filterType = col.filterType;
                            proxy._$colForeignKeyField = col.foreignKeyField ? col.foreignKeyField : col.field;
                            proxy._$colForeignKeyValue = col.foreignKeyValue;
                            proxy._$colDropdownData = col.dataSource;
                        }
                    });
                    if ((this.model.filterSettings.filterType == "menu" && this._$filterType != "excel") || (this.model.filterSettings.filterType == "excel" && this._$filterType == "menu")) {
                        var $id = "#" + this._id + "_" + this._$colType + "Dlg";
                        this._$menuDlgIsOpen = true;
                        if (this._$colType == "string") {
                            if (this._$colForeignKeyValue && this._$colDropdownData)
                                $("#" + this._id + "_acString").ejAutocomplete({ fields: { text: proxy._$colForeignKeyValue, key: proxy._$colForeignKeyField }, dataSource: proxy._$colDropdownData });
                            else
                                $("#" + this._id + "_acString").ejAutocomplete({ fields: { text: proxy._$curFieldName, key: this._getIdField() }, dataSource: this._dataSource() });
                        } else if (this._$colType == "date") {
                            if (this._$colFormat != undefined) {
                                this._$colFormat = this._$colFormat.replace("{0:", "").replace("}", "");
                                $($id).find(".e-datewidget .e-datepicker").ejDatePicker({ dateFormat: this._$colFormat.replace("{0:", "").replace("}", "") });
                            }
                            else
                                $($id).find(".e-datewidget .e-datepicker").ejDatePicker({ dateFormat: ej.preferredCulture(this.model.locale).calendars.standard.patterns.d });
                        }
                        else if (this._$colType == "datetime") {
                            if (this._$colFormat != undefined) {
                                this._$colFormat = this._$colFormat.replace("{0:", "").replace("}", "");
                                $($id).find(".e-datetimewidget input").ejDateTimePicker({ dateFormat: this._$colFormat.replace("{0:", "").replace("}", "") });
                            }
                            this._setFilterFieldValues($id);
                        }
                    }
                    this._mediaStatus = document.documentElement.clientWidth <= 768;
                    if (this.model.isResponsive && this._mediaStatus) {
                        var gridObj = this;
                        var $headerDiv = ej.buildTag('div.e-resFilterDialogHeaderDiv');
                        var $titleSapn = ej.buildTag('div.e-labelRes', '<span>Filter</span>');
                        if ($("#"+this._id+"_"+this._$colType+"Dlg").find(".e-filterMenuBtn").length > 0){
                            $("#"+this._id+"_"+this._$colType+"Dlg").find(".e-filterMenuBtn").remove();
                        }
                        var $dlgBtn = ej.buildTag('div.e-filterMenuBtn');
                        var $inputOk = ej.buildTag('input.e-resposnsiveFilterBtnLeft e-flat e-btnsub');
                        var $inputCancel = ej.buildTag('input.e-resposnsiveFilterBtnRight e-flat e-btncan');

                        $headerDiv.append($titleSapn);
                        $headerDiv.css('width', '100%');
                        var $dlgClone = $($id).css('padding-left', '0px');
                        if ($target.parent().hasClass('e-responsivefilterColDiv') && $target.hasClass('e-filternone')) {
                            proxy._fltrClrHandler();
                            $target.remove();
                            $("#"+this._id+"responsiveFilter").css('display', 'block');
                            // this.element.css('display', 'block');
                        }
                        else {
                            this.element.css('display', 'none');
                            setTimeout(function () { 
							$("#"+this._id+"responsiveFilter").css('display', 'none'), 0 });
                            if (!this._isExcelFilter && this._$filterType != "excel") {
                                var btnText = this.model.enableResponsiveRow ? 'OK' : 'Filter', clearText = this.model.enableResponsiveRow ? 'Cancel' : 'Clear';
                                $inputOk.ejButton({ text: btnText, type: 'button', click: $.proxy(this._fltrBtnHandler, this) });
                                $inputCancel.ejButton({
                                    text: clearText, type: 'button', click: function () {
                                        if (clearText == 'Clear') {
                                            proxy.element.css('display', 'block');
                                            proxy._fltrClrHandler();
                                        }
                                        $($id).css('display', 'none');
                                        if ($inputCancel.hasClass("e-resposnsiveFilterBtnRight"))
                                            proxy.element.css('display', 'block');
                                    }
                                });
                                if ($target.parent().hasClass('e-responsivefilterColDiv') && $target.hasClass('e-filternone')) {
                                    proxy._fltrClrHandler();
                                    $target.remove();
                                }
                                else {
                                    $dlgClone.addClass('e-resMenuFltr');
                                    $dlgClone.css('height', $(window).height() - 1).css('width', $(window).width() - 2);
                                    $dlgClone.find('.e-operator').addClass('e-resFilterOperator');
                                    $dlgClone.find('.e-value').addClass('e-resFilterOperator');
                                    $dlgClone.find('.e-value1').addClass('e-resFilterOperator');
                                    var $btnContainer = $dlgClone.find('.e-dlgBtns').remove().addClass('e-filterMenuBtn');
                                   $dlgClone.append($dlgBtn);
                                   $dlgBtn.append($inputOk).append($inputCancel);
                                    if (ej.isNullOrUndefined($("#"+this._id+"_"+this._$colType+"Dlg").find('.e-resFilterDialogHeaderDiv')[0])) {
                                        $dlgClone.insertAfter(this.element);
                                        var $backIcon = ej.buildTag('div.e-resFilterleftIcon', '', {}, { closeDialogue: $id.slice(1), openDialogue: 'responsiveFilter' });
                                        var $spanIcon = ej.buildTag('span.e-icon e-resIcon e-responisveBack', '', {}, { closeDialogue: $id.slice(1), openDialogue: 'responsiveFilter' })
                                        $backIcon.click(function (e) {
                                            $dlgClone.css('display', 'none');
                                            if (gridObj.model.enableResponsiveRow){
                                                $("#"+ gridObj._id +"responsiveFilter").css('display', 'block');
                                            }else
                                                gridObj.element.css('display', 'block');
                                        })
                                        $headerDiv.append($backIcon.append($spanIcon));
                                        var $closeIcon = ej.buildTag('div.e-resFIlterRigthIcon', '', {}, { closeDialogue: $id.slice(1), gridEle: true });
                                        var $closeSpan = ej.buildTag('span.e-icon e-resIcon e-responisveClose', '', {}, { closeDialogue: $id.slice(1), gridEle: true })
                                        $closeIcon.click(function (e) {
                                            $dlgClone.css('display', 'none');
                                            gridObj.element.css('display', 'block');
                                        });
                                        var $ejWid = $($dlgClone.find('.e-value').find('input:last'));
                                        if (proxy._$colType == 'string') {
                                            var model = $($dlgClone.find('.e-value').find('input:last')).ejAutocomplete('model');
                                            $ejWid.ejAutocomplete('destroy').ejAutocomplete({
                                                enableDistinct: true, dataSource: model.dataSource, fields: model.fields, width: model.width, focusIn: function (args) {
                                                    var $dropdown = this.element.closest(".e-filterDialog").find(".e-dropdownlist");
                                                    this.model.filterType = $dropdown.val();
                                                }
                                            });
                                        }
                                        $headerDiv.append($closeIcon.append($closeSpan));
                                        $dlgClone.prepend($headerDiv);
                                    }
                                    $dlgClone.find('.e-responsiveLabelDiv').remove();
                                    var $label = ej.buildTag('div.e-responsiveLabelDiv', '', { 'margin-left': '5%', 'font-size': '17px', 'margin-top': '5%' }).append(ej.buildTag('span', this.getHeaderTextByFieldName(columnName), { 'font-weight': 'bold' }));
                                    $label.insertAfter($dlgClone.find('.e-resFilterDialogHeaderDiv'));
									if(this.model.enableResponsiveRow){
                                    $("#"+this._id+"_"+this._$colType+"Dlg").css({'width': '100%','position':'relative'});
                                    $("#"+this._id+"responsiveFilter").css('display', 'none');
									}
                                    $dlgClone.fadeIn(100, function () {
                                    });
                                }
                            }
                            else {
                                this._excelDlg = $id = "#" + this._id + this._$colType + "_excelDlg";
                                if (ej.isNullOrUndefined($dlgClone.find('.e-resFilterDialogHeaderDiv')[0])) {
                                    $inputOk.ejButton({
                                        text: 'OK', type: 'button', click: function (sender) {
                                            gridObj._responsiveFilterClose();
                                            gridObj._excelFilter._openedFltr = $(gridObj._excelDlg);
                                            gridObj._excelFilter._fltrBtnHandler();
                                            gridObj._setResponsiveFilterIcon();
                                        }
                                    });
                                    $inputCancel.ejButton({ text: 'Cancel', type: 'button', click: function () { $($id).css('display', 'none'); proxy.element.css('display', 'block') } });
                                    $($id).children().not('.e-searchcontainer').remove();
                                    var excelObj = this._excelFilter;
                                    var $backIcon = ej.buildTag('div.e-resFilterleftIcon', '', {}, { closeDialogue: $id.slice(1), openDialogue: 'responsiveFilter' });
                                    var $spanIcon = ej.buildTag('span.e-icon e-resIcon e-responisveBack', '', {}, { closeDialogue: $id.slice(1), openDialogue: 'responsiveFilter' })
                                    $backIcon.click(function (e) {
                                        $.proxy(gridObj._closeDivIcon(e), this);
                                    })
                                    $headerDiv.append($backIcon.append($spanIcon));
                                    var $closeIcon = ej.buildTag('div.e-resFIlterRigthIcon', '', {}, { closeDialogue: $id.slice(1), gridEle: true });
                                    var $closeSpan = ej.buildTag('span.e-icon e-resIcon e-responisveCustomFilter', '', {}, { closeDialogue: $id.slice(1), gridEle: true })
                                    $closeIcon.click(function (e) {
                                        $.proxy(gridObj._closeDivIcon(e), this);
                                    })
                                    if (proxy._$colType != 'boolean')
                                        $headerDiv.append($closeIcon.append($closeSpan));
                                    $($id).css('padding', '0px');
                                    var $searchContainer = $($id).css('height', $(window).height() - 2);
                                    $searchContainer.css('width', $(window).width() - 2);
                                    var $searchBox = $searchContainer.find('.e-searchcontainer .e-searchbox').css('margin-top', '10px');
                                    $searchBox.children().css('margin-top', '10px');
                                    var $checkBoxDiv = $searchContainer.find('.e-checkboxlist');
                                    var scrolWidth = $(window).width() * (97 / 100), scrollHeight = $(window).height() * (65 / 100);
                                    $($searchContainer.find('.e-searchcontainer')).addClass('e-resSearch');
                                    var $btn = $searchContainer.find('.e-resSearch .e-btncontainer').remove();
                                    $btn.find('input:first').css('width', '45.6%');
                                    $btn.find('input:first').addClass('e-resposnsiveFilterBtnLeft');
                                    $btn.find('input:last').addClass('e-resposnsiveFilterBtnRight');
                                    $searchContainer.find('.e-excelLabel').remove();
                                    var $labelDiv = ej.buildTag('div.e-excelLabel', 'Order Id', { 'font-weight': 'bold', 'margin-top': '10px' });
                                    var $searchBox = $searchContainer.find('.e-searchcontainer');
                                    $labelDiv.insertAfter($searchContainer.find('.e-searchcontainer .e-searchbox'));
                                    $searchContainer.prepend($headerDiv);
                                    $($id).append($dlgBtn.append($inputOk).append($inputCancel))
                                    $checkBoxDiv.ejScroller({ height: scrollHeight, width: scrolWidth }).ejScroller('refresh');
                                }
                                this._excelFilter.openXFDialog({ field: columnName, enableResponsiveRow: true, displayName: currentColumn.headerText, dataSource: this._dataSource(), query: $cloneCommonQuery, position: { X: xPos, Y: yPos }, dimension: { height: $(window).height(), width: $(window).width() }, cssClass: "resFilter", type: this._$colType, format: this._$colFormat, localizedStrings: localXFLabel });
                                $($id).insertAfter(this.element);
                                !ej.isNullOrUndefined($($id).parents('.e-grid')[0]) && $($id).remove();
                                $closeIcon.click(function (e) {
                                    $(gridObj._excelDlg).css('display', 'none');
                                    var height = $(window).height() - 5, width = $(window).width();
                                    excelObj._openCustomFilter('equal');
                                    var $dlgClone = $id = $("#" + gridObj._id + gridObj._$colType + "_CustomFDlg").addClass('e-responsviesExcelFilter');
                                    if (ej.isNullOrUndefined($dlgClone.find('.e-resFilterDialogHeaderDiv')[0])) {
                                        var $headerDivCustom = ej.buildTag('div.e-resFilterDialogHeaderDiv');
                                        var $titleSapn = ej.buildTag('div.e-labelRes', '<span>Custom Filter</span>');
                                        $headerDivCustom.append($titleSapn);
                                        var $backIcon = ej.buildTag('div.e-resFilterleftIcon', '', {}, { closeDialogue: gridObj._id + gridObj._$colType + "_CustomFDlg", openDialogue: gridObj._excelDlg.slice(1) });
                                        var $spanIcon = ej.buildTag('span.e-icon e-resIcon e-responisveBack', '', {}, { closeDialogue: gridObj._id + gridObj._$colType + "_CustomFDlg", openDialogue: gridObj._excelDlg.slice(1) })
                                        $backIcon.click(function (e) {
                                            $dlgClone.css('display', 'none');
                                            if (gridObj.model.enableResponsiveRow)
                                                $("#"+this._id+"responsiveFilter").css('display', 'block');
                                            else
                                                gridObj.element.css('display', 'block');
                                        });
                                        $headerDivCustom.append($backIcon.append($spanIcon));
                                        var $closeIconCust = ej.buildTag('div.e-resFIlterRigthIcon', '', {}, { closeDialogue: gridObj._id + gridObj._$colType + "_CustomFDlg", gridEle: true });
                                        var $closeSpan = ej.buildTag('span.e-icon e-resIcon e-responisveClose', '', {}, { closeDialogue: gridObj._id + gridObj._$colType + "_CustomFDlg", gridEle: true })
                                        $headerDivCustom.append($closeIconCust.append($closeSpan));
                                        $closeIconCust.click(function (e) {
                                            $dlgClone.css('display', 'none');
                                            gridObj.element.css('display', 'block');
                                        })
                                        $dlgClone.prepend($headerDivCustom);
                                        $dlgClone.insertAfter(gridObj.element);
                                        $dlgClone.find('.e-dlgfields').css('width', '100%');
                                        var $firstDiv = $dlgClone.find('.e-dlgfields:first').css('width', '92%').css('margin-left', '6%');
                                        $firstDiv.css('margin-top', '4%');
                                        var colName = $dlgClone.find('.e-dlgfields').find('.e-fieldset legend').text();
                                        var $labelDiv = ej.buildTag('div.e-responsiveLabelDiv', colName, { 'margin-left': '6%' });
                                        $labelDiv.insertAfter($firstDiv);
                                        var $fieldSet = $dlgClone.find('.e-dlgfields').find('.e-fieldset').find('table').css('width', '61%');
                                        $dlgClone.find('.e-dlgfields').find('.e-fieldset').replaceWith($fieldSet);
                                        var $fieldDiv = $fieldSet.parent('div').addClass('e-responsiveExcelFilterFieldDiv');
                                        var $ddl = $fieldSet.find('.e-dropdownlist')
                                        $fieldSet.find('.e-dropdownlist').each(function (index, object) {
                                            var ds = $(object).ejDropDownList('model.dataSource');
                                            var wid = $(window).width() * (40 / 100);
                                            $(object).ejDropDownList('destroy').ejDropDownList({ width: wid, popupWidth: wid + "px", dataSource: ds });
                                        });
                                        $fieldSet.find('.e-autocomplete').each(function (index, object) {
                                            var model = $(object).ejAutocomplete('model.dataSource');
                                            var wid = $(window).width() * (40 / 100);
                                            $(object).ejAutocomplete('destroy').ejAutocomplete({ width: wid, dataSource: model.dataSource, fields: model.fields });
                                        });
                                        $fieldSet.find('.e-datepicker').each(function (index, object) {
                                            var ds = $(object).ejDatePicker('model.dataSource');
                                            var wid = $(window).width() * (40 / 100);
                                            $(object).ejDatePicker('destroy');
                                            $("#" + $(object).attr("id")).ejDatePicker({ width: wid });
                                        });
                                        var $okClone = $inputOk.clone(), $cancelClone = $inputCancel.clone();
                                        $okClone.ejButton({
                                            text: 'OK', type: 'button', click: function (sender) {
                                                gridObj._excelFilter._openedFltr = $dlgClone;
                                                gridObj._excelFilter._fltrBtnHandler();
                                                if ($dlgClone.hasClass('e-dlgcustom'))
                                                    $dlgClone.css("display", "none");
                                                gridObj._setResponsiveFilterIcon();
                                                gridObj.element.css('display', 'block');
                                            }
                                        });
                                        $cancelClone.ejButton({ text: 'Cancel', type: 'button', click: function () { $dlgClone.ejDialog('close'); proxy.element.css('display', 'block') } });
                                        $dlgClone.append($dlgBtn.clone().append($okClone).append($cancelClone))
                                        var $btnContainer = $dlgClone.find('.e-dlgfields .e-btncontainer').remove();
                                        $btnContainer.find('input:first').addClass('e-resposnsiveFilterBtnLeft');
                                        $btnContainer.find('input:first').css('width', '45.6%')
                                        $btnContainer.find('input:last').addClass('e-resposnsiveFilterBtnRight');
                                    }
                                    gridObj.element.css('display', 'none');
                                    $dlgClone.ejDialog({ enableModal: false, height: height, width: width, position: { X: 0, Y: 0 }, enableResize: false, showHeader: false }).ejDialog('open');
                                })
                                var $searchdiv = ej.buildTag('div');
                            }
                        }
                    }
                    else {
                        if ($($id).hasClass("e-resMenuFltr")) {
                            $($id).remove();
                            this._renderFilterDialogs();
                            $id = "#" + this._id + "_" + this._$colType + "Dlg";
                        }
                        $($id).ejDialog({ position: { X: "", Y: "" } });
                        var docWidth = $(document).width(), dlgWidth = document.documentElement.clientWidth < 800 ? 200 : 250, gridwidth = $("#" + this._id).width();
						var offset = $target.offset();
						var offsetParent = $target.offsetParent();  
						var parentOffset = offsetParent.offset();
						var parentOffset = {
				            top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
				            left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
			             };
                        var xPos = offset.left - parentOffset.left - jQuery.css( $target[0], "marginLeft", true ) + (this.model.enableRTL ? -6 : 18);					   
					    var yPos = offset.top - parentOffset.top - jQuery.css( $target[0], "marginTop", true ) + 2;                         
						if ($target.closest(".e-headercell").css("position") == "relative")
                            xPos = $target.offset().left + 15, yPos = $target.offset().top + 20;
                        var filterDlgLargeCss = "e-filterdialoglarge";
                        dlgWidth = this._isExcelFilter && currentColumn.filterType != "menu" && !ej.isNullOrUndefined(this._excelFilter._dialogContainer) ? this._excelFilter._dialogContainer.width() : dlgWidth;
                        var rightPosWidth = (this.element.offset().left + this.element.width()) - $target.offset().left, rightWidth = dlgWidth - rightPosWidth;
                        var leftPosWidth = $target.offset().left - this.element.offset().left, leftWidth = dlgWidth - leftPosWidth;
                        if ($target.offset().left + 18 + dlgWidth > gridwidth && rightWidth > leftWidth)
                            xPos = xPos - dlgWidth - (this.model.enableRTL ? 14 : 10);
                        if (dlgWidth == 200)
                            filterDlgLargeCss = "";
                        if (!ej.isNullOrUndefined(this._$colType)) {
                            if ((this.model.filterSettings.filterType == "menu" && this._$filterType != "excel") || (this.model.filterSettings.filterType == "excel" && this._$filterType == "menu")) {
                                xPos = xPos - $("#" + this._id).offset().left, yPos = yPos - $("#" + this._id).offset().top;
                                $($id).ejDialog({ position: { X: xPos, Y: yPos }, width: dlgWidth, cssClass: filterDlgLargeCss })
                                .ejDialog("open");
                            }
                            else
                                this._excelFilter.openXFDialog({ field: columnName, displayName: currentColumn.headerText, dataSource: this._dataSource(), query: $cloneCommonQuery, position: { X: xPos, Y: yPos }, type: this._$colType, format: currentColumn.format, foreignKey: currentColumn.foreignKeyField, foreignKeyType: currentColumn.originalType, foreignKeyValue: currentColumn.foreignKeyValue, foreignDataSource: currentColumn.dataSource, localizedStrings: localXFLabel });
                        }
                    }
                    this._setFilterFieldValues($id);
                    if (this._$colType == "number" && currentColumn["serverType"] != undefined)
                        $($id).find(".e-numerictextbox").ejNumericTextbox({ width: "100%",decimalPlaces: 0 });
                    else if(this._$colType == "number")
                        $($id).find(".e-numerictextbox").ejNumericTextbox({ width: "100%", groupSeparator: "" });
                    this._$prevColType = this._$colType;
                    this._$fDlgIsOpen = true;
                }
            }
        },
        _responsiveFilterClose: function () {
            this.element.css('display', 'block');
            $("#"+this._id+"responsiveFilter").css('display', 'block');

        },
        _clickHandler: function (e) {
            var $target = $(e.target),tempChooser = $("[id$='ccDiv'].e-grid.e-columnChooser"),fieldName, $form = $("#" + this._id + "EditForm"), index, columnIndex, rowIndex;
			if($(e.target).hasClass('e-checkselectall')  && !this.model.enableTouch){
			    if(e.target.checked)
					this._isCheckboxChecked = true;
				else
					this._isCheckboxUnchecked = true;
			}
			if(tempChooser.length) {
                var  flag = true;
                for(var i = 0; i < tempChooser.length; i++){
                    if($target.parents(".e-ccButton").length|| $target.hasClass('e-ccButton')) flag = $(e.target).closest(".e-grid").attr("id")+"ccDiv" != tempChooser[i].id;
                    var obj = $("#"+tempChooser[i].id).ejDialog("instance");
                    if(obj.isOpened() && flag) {
                        obj.close();
                        $(".e-columnChoosertail").remove();
                        $(".e-columnChoosertailAlt").remove();
                    }
                }
            }
            if ($target.hasClass("e-button") && ($target.hasClass("e-disable") || $target.prop("disabled"))) return;
            if ($target.closest(".e-grid").attr("id") !== this._id) return;
            if ($target.closest("#" + this._id + "EditForm").length){
				if($target.closest(".e-unboundcelldiv").length) this._unboundClickHandler(e);
				return;
			}
            if ($target.hasClass("e-rowcell") || $target.closest("td").is(".e-rowcell") || ($target.hasClass("e-headercell") && ((e.clientY - $target.offset().top) < ($target.height() / 4))) || $target.parents(".e-headercheckcelldiv").length) {
                if (this._bulkEditCellDetails.cancelSave) {
                    this._bulkEditCellDetails.cancelSave = false;
                    return;
                }
                if (this.model.editSettings.editMode == "batch" && ($.isFunction($.validator) && $form.length && $form.validate().errorList.length > 0))
                    return;
                index = $target.closest("tr").hasClass("e-insertedrow") ? this.model.groupSettings.groupedColumns.length : 0;
                var tempIndex = $target.closest(".e-rowcell").index() != -1 ? $target.closest(".e-rowcell").index() : $target.closest(".e-headercell").index() - this.model.groupSettings.groupedColumns.length;
                columnIndex = $target.hasClass("e-rowcell") ? $target.index() - index : tempIndex - index;
                columnIndex = (this.model.detailsTemplate != null || this.model.childGrid != null) ? columnIndex - 1 : columnIndex;
                if (this.model.scrollSettings.frozenColumns && ($target.closest(".e-movableheaderdiv").length || $target.closest(".e-movablecontentdiv").length))
                    columnIndex = columnIndex + this.model.scrollSettings.frozenColumns;
                rowIndex = this.getIndexByRow($target.closest("tr"));
                this._bulkEditCellDetails.columnIndex = columnIndex;
                this._bulkEditCellDetails.rowIndex = rowIndex;
                if (this.model.allowSelection && ej.gridFeatures.selection) {
                    var checkBoxSelection = this._enableCheckSelect && $target.parent(".e-checkcelldiv").length ? true : false;
                    if ($target.hasClass("e-checkselectall")) {
                        this._selectAllCheck = true;
						var rows = this.model.scrollSettings.frozenColumns > 0  ? this._gridRows[0].length : this._gridRows.length;
						var toCheckIndex = this.model.allowScrolling && this.model.scrollSettings.allowVirtualScrolling ? this._gridRecordsCount : this.model.allowPaging ? (this.model.groupSettings.groupedColumns.length > 0 ? this._currentJsonData.length : this.model.currentViewData.length) : rows;
                        this.selectRows(0, toCheckIndex - 1, $target);
                    }
                    if (this.model.selectionType == "multiple") {
                        if (e.ctrlKey || this._enableSelectMultiTouch) {
                            this.multiSelectCtrlRequest = true;
                        }
                        if (e.shiftKey) {
                            this.multiSelectShiftRequest = true;
                            if (this._allowcellSelection && rowIndex > -1)
                                this.selectCells([[rowIndex, [columnIndex]]]);
                            if (this._allowrowSelection && rowIndex > -1 && (!this._enableCheckSelect || checkBoxSelection))
                                this.selectRows(this._previousIndex, this.getIndexByRow($target.closest('tr')), $target);
                                this._selectedRow(this.getIndexByRow($target.closest('tr')));
                            if (this._allowcolumnSelection && $target.hasClass("e-headercell") && !$target.hasClass("e-stackedHeaderCell") && ((e.clientY - $target.offset().top) < ($target.height() / 4)))
                                this.selectColumns(this._previousColumnIndex, columnIndex);
                        }
                        if (e["pointerType"] == "touch" && this._customPop != null && !this._customPop.is(":visible") && this._customPop.find(".e-rowselect").hasClass("e-spanclicked") && this.model.selectionSettings.selectionMode == "row")
                            this._customPop.show();
                        if (e["pointerType"] == "touch" && this._customPop != null && (this._customPop.find(".e-sortdirect").is(":visible") || !this._customPop.find(".e-rowselect").hasClass("e-spanclicked")) && this.model.selectionType == "multiple" &&(this.model.selectionSettings.selectionMode.indexOf("cell")!= -1 || this.model.selectionSettings.selectionMode.indexOf("row") !=-1 )) {
                            this._customPop.removeAttr("style");
                            var offset = $target.offset();
                            this._customPop.offset({ top: 0, left: 0 }).offset({ left: offset.left, top: offset.top - this.getRowHeight() - $target.height() }).find(".e-sortdirect").hide().end()
                                .find(".e-rowselect").show().end().show();
                        }
                    }
                    if (!this.multiSelectShiftRequest) {
                        if (this._allowcellSelection && rowIndex > -1) {
                            var cellProto = this._checkCellSelectionByRow(rowIndex, columnIndex);
                            if ((this.model.selectionSettings.enableToggle && this.selectedRowCellIndexes.length == 1 && this.selectedRowCellIndexes[0].cellIndex.length==1 || (e.ctrlKey && this.model.selectionType == 'multiple')) && (cellProto != -1 && this.selectedRowCellIndexes.length > 0 && this.selectedRowCellIndexes[0].cellIndex.length > 0))
                                this.clearCellSelection(cellProto.rowIndex, columnIndex);
                            else
                                this.selectCells([[rowIndex, [columnIndex]]]);
                        }
                        if (this._allowrowSelection && rowIndex > -1) {
                            var selectedIndex = this.getIndexByRow($target.closest('tr'));
                            if (this._enableCheckSelect)
                                this.multiSelectCtrlRequest = true;
							if(this.model.scrollSettings.enableVirtualization){
								var remain = rowIndex % this._virtualRowCount, viewIndex;							
								viewIndex = parseInt($($target).closest("tr").attr("name"), 32);																												
								selectedIndex = (viewIndex * this._virtualRowCount) - (this._virtualRowCount - remain);	
							}
							var inx;
							if ((this.model.editSettings.editMode == "inlineform" || this.model.editSettings.editMode == "inlineformtemplate") && (!this._enableCheckSelect && !checkBoxSelection) && this.getIndexByRow($target.closest("tr")) > $(".e-editedrow").index()) {
							    var $editTrLen = $("#" + this._id).find(".e-editedrow").length;
							    inx = this.getIndexByRow($target.closest("tr")) - $editTrLen;
							}
							else
							    inx = this.getIndexByRow($target.closest('tr'));
                            if (!this._enableCheckSelect || checkBoxSelection) {
							    if (this.model.selectionSettings.enableToggle && !this._enableCheckSelect && this.getSelectedRecords().length == 1 && $.inArray(this.getIndexByRow($target.closest('tr')), this.selectedRowsIndexes) != -1)
							        this.clearSelection(selectedIndex);
							    else
							        this.selectRows(inx, null, $target);
							}
                            if(this._enableCheckSelect && !(e.ctrlKey || this._enableSelectMultiTouch))
                                this.multiSelectCtrlRequest = false;
                        }
                        if (this._allowcolumnSelection && $target.hasClass("e-headercell") && !$target.hasClass("e-stackedHeaderCell") && ((e.clientY - $target.offset().top) < ($target.height() / 4))) {
                            if (this.model.selectionSettings.enableToggle && this.selectedColumnIndexes.length == 1 && $.inArray(columnIndex, this.selectedColumnIndexes) != -1)
                                this.clearColumnSelection(columnIndex);
                            else
                                this.selectColumns(columnIndex);
                        }
                        this.multiSelectCtrlRequest = false;
                    }
                    this.multiSelectShiftRequest = false;
                }

                fieldName = this._bulkEditCellDetails.columnIndex >= 0 ? this.model.columns[this._bulkEditCellDetails.columnIndex]["field"] : null;
                if ($target.closest(".e-rowcell").length && !ej.isNullOrUndefined(fieldName)) {
                    this._tabKey = false;
                    this.model.editSettings.allowEditing && this.model.editSettings.editMode == ej.Grid.EditMode.Batch && this.editCell($.inArray($target.closest("tr").get(0), this._excludeDetailRows()), fieldName);
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
            this._selectAllCheck = false;
            if (ej.gridFeatures.common) {
                this.expandCollapse($target);
            }
            if ($target.is(".e-filtericon") && $target.closest(".e-detailrow").length != 0)
                e.preventDefault();
            if (this._$fDlgIsOpen && this.model.allowFiltering && (this.model.filterSettings.filterType == "menu" || this._isExcelFilter) && !$target.is(".e-filtericon") && $target.closest(".e-dlgcontainer").length != 1)
                this._closeFDialog();
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
			if($target.closest(".e-unboundcelldiv").length) this._unboundClickHandler(e);
        },
        _checkCellSelectionByRow: function (rowIndex, columnIndex) {
            for (var i = 0; i < this.selectedRowCellIndexes.length; i++) {
                if (this.selectedRowCellIndexes[i].rowIndex == rowIndex)
                    break;
            }
            if (i != this.selectedRowCellIndexes.length && $.inArray(columnIndex, this.selectedRowCellIndexes[i].cellIndex) != -1)
                return this.selectedRowCellIndexes[i];
            return -1;
        },
        _persistState: function (customModel) {
           if (this.model.enablePersistence && this._isHeightResponsive)
                customModel._isHeightResponsive = this._isHeightResponsive;
         },
        _restoreState: function (customModel) {
           if (this.model.enablePersistence && customModel._isHeightResponsive)
                this._isHeightResponsive = customModel._isHeightResponsive;
         },  
        _destroy: function () {
            /// <summary>This function is  used to destroy the Grid Object</summary>
            this.element.off();
            this.element.find(".e-gridheader").find(".e-headercontent,.e-movableheader")
                .add(this.element.find(".e-gridcontent").find(".e-content,.e-movablecontent")).off('scroll');
            var editForm = $("#" + this._id + "EditForm");
            if (editForm.length) {
                var $formEle = editForm.find('.e-field'), $element;
                for (var i = 0; i < $formEle.length; i++) {
                    $element = $($formEle[i]);
                    if ($element.hasClass('e-datetimepicker'))
                        $element.ejDateTimePicker("destroy");
                    else if ($element.hasClass('e-datepicker'))
                        $element.ejDatePicker("destroy");
                    else if ($element.hasClass('e-dropdownlist'))
                        $element.ejDropDownList("destroy");
                }
                editForm.remove();
            }
            if (this._confirmDialog)
                this._confirmDialog.ejDialog("destroy");
            this.element.find('.e-dropdownlist').ejDropDownList('model.dataSource', []);
            if (this.model.showColumnChooser) {
                $("#" + this._id + "ccDiv").ejDialog("destroy");
                $("#" + this._id + "ccDiv").remove();
                $("#" + this._id + "_ccTail").remove();
                $("#" + this._id + "_ccTailAlt").remove();
            }
            if (this.model.allowFiltering && this.model.filterSettings.filterType == "excel")
                this._excelFilter.resetExcelFilter()
            if (this.model.allowReordering)
                $(".e-columndropindicator").remove();
            if (this.model.allowFiltering && this.model.filterSettings.filterType == "menu") {
                var proxy = this, $colType;
                $.each(this.model.columns, function (indx, col) {
                    $colType = col.type;
                    $("#" + proxy._id + $colType + "_ddinput_popup_wrapper").remove();
                    if ($colType == "string")
                        $("#" + proxy._id + "_stringDlg").find('.e-autocomplete').ejAutocomplete("destroy");
                    else if ($colType == "date")
                        $("#" + proxy._id + "_dateDlg").find('.e-datepicker').ejDatePicker("destroy");
                    else if ($colType == "datetime")
                        $("#" + proxy._id + "_datetimeDlg").find('.e-datetimepicker').ejDateTimePicker("destroy");
                    else if ($colType == "number")
                        $("#" + proxy._id + "_numberDlg").find('.e-numerictextbox').ejNumericTextbox("destroy");
                });
            }
            if (this.element.find(".e-gridcontent .e-scrollbar").length > 0)
                this.element.find(".e-gridcontent").ejScroller("destroy");
            if (this._$onresize)
                $(window).off("resize", this._$onresize);
            this.element.empty().removeClass("e-grid " + this.model.cssClass);
            this.element.ejWaitingPopup("destroy");
            if (this.model.contextMenuSettings.enableContextMenu) {
                $("#" + this._id + "_Context").ejMenu('destroy');
                $("#" + this._id + "_Context").remove();
            }
        },
        _getDeprecatedLocalizedLabel: function (key) {
            if (["OkButton", "OKButton"].indexOf(key) != -1)
                return this.localizedLabels.OkButton || this.localizedLabels.OKButton;
        },
        _getLocalizedLabels: function (property) {
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        },
    });
    if (ej.gridFeatures.common)
        $.extend(ej.Grid.prototype, ej.gridFeatures.common);
    if (ej.gridFeatures.edit)
        $.extend(ej.Grid.prototype, ej.gridFeatures.edit);
    if (ej.gridFeatures.filter)
        $.extend(ej.Grid.prototype, ej.gridFeatures.filter);
    if (ej.gridFeatures.group)
        $.extend(ej.Grid.prototype, ej.gridFeatures.group);
    if (ej.gridFeatures.selection)
        $.extend(ej.Grid.prototype, ej.gridFeatures.selection);
    if (ej.gridFeatures.sort)
        $.extend(ej.Grid.prototype, ej.gridFeatures.sort);
    if (ej.gridFeatures.dragAndDrop)
        $.extend(ej.Grid.prototype, ej.gridFeatures.dragAndDrop);

    ej.Grid.Locale = ej.Grid.Locale || {};

    ej.Grid.Locale["default"] = ej.Grid.Locale["en-US"] = {
        EmptyRecord: "No records to display",
        GroupDropArea: "Drag a column header here to group its column",
        DeleteOperationAlert: "No records selected for delete operation",
        EditOperationAlert: "No records selected for edit operation",
        SaveButton: "Save",
        OKButton: "OK",
        CancelButton: "Cancel",
        EditFormTitle: "Details of ",
        AddFormTitle: "Add New Record",
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
        NumberMenuOptions: [{ text: "LessThan", value: "LessThan" }, { text: "GreaterThan", value: "GreaterThan" }, { text: "LessThanOrEqual", value: "LessThanOrEqual" }, { text: "GreaterThanOrEqual", value: "GreaterThanOrEqual" }, { text: "Equal", value: "Equal" }, { text: "NotEqual", value: "NotEqual" }, { text: "Between", value: "Between" }],
        PredicateAnd: "AND",
        PredicateOr: "OR",
        Filter: "Filter",
        FilterMenuFromCaption:"From",        
        FilterMenuToCaption:"To",
        FilterMenuCaption: "Filter Value",
        FilterbarTitle: "'s filter bar cell",
        MatchCase: "Match Case",
        Clear: "Clear",
        ResponsiveFilter: "Filter",
        ResponsiveSorting: "Sort",
        Search: "Search",
        DatePickerWaterMark: "Select date",
        NumericTextBoxWaterMark: "Enter value",
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
        EmptyRowValidationMessage:"Atleast one field must be updated",
		NoResult: "No Matches Found"
    };
    ej.Grid.Actions = {
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

    ej.Grid.SummaryType = {
        /**  Creates grid with summary type as Average */
        Average: "average",
        /**  Creates grid with summary type as Minimum */
        Minimum: "minimum",
        /**  Creates grid with summary type as Maximum */
        Maximum: "maximum",
        /**  Creates grid with summary type as Count */
        Count: "count",
        /**  Creates grid with summary type as Sum */
        Sum: "sum",
        /**  Creates grid with summary type as TrueCount */
        TrueCount: "truecount",
        /**  Creates grid with summary type as FalseCount */
        FalseCount: "falsecount",
        /**  Creates grid with summary type as Custom */
        Custom: "custom"
    };

    ej.Grid.EditMode = {
        /**  Creates grid with editMode as Normal */
        Normal: "normal",
        /**  Creates grid with editMode as Dialog */
        Dialog: "dialog",
        /**  Creates grid with editMode as DialogTemplate */
        DialogTemplate: "dialogtemplate",
        /**  Creates grid with editMode as Batch */
        Batch: "batch",
        /**  Creates grid with editMode as ExternalForm */
        ExternalForm: "externalform",
        /**  Creates grid with editMode as ExternalFormTemplate */
        ExternalFormTemplate: "externalformtemplate",
        /**  Creates grid with editMode as InlineForm */
        InlineForm: "inlineform",
        /**  Creates grid with editMode as InlineTemplateForm */
        InlineTemplateForm: "inlineformtemplate"
    };

    ej.Grid.PrintMode = {
        /**  print all pages in grid */
        AllPages: "allpages",
        /**   print current pages in grid */
        CurrentPage: "currentpage",
    };
    ej.Grid.ResizeMode = {
        NextColumn: 'nextcolumn',
        Control: 'control',
        Normal: 'normal'
    };
    ej.Grid.Rowposition = {
        /** Add new row in the top of the grid */
        Top: "top",
        /** Add new row in the bottom of the grid */
        Bottom: "bottom",
    };

    ej.Grid.FormPosition = {
        /**  Creates grid with formPosition as BottomLeft */
        BottomLeft: "bottomleft",
        /**  Creates grid with formPosition as TopRight */
        TopRight: "topright"
    };

    ej.Grid.ClipMode = {
        /** Render an ellipsis ("...") to represent clipped text **/
        Ellipsis: "ellipsis",
        /** Clips the text **/
        Clip: "clip",
        /** Render an ellipsis ("...") to represent clipped text and tooltip would be shown **/
        EllipsisWithTooltip: "ellipsiswithtooltip"
    };

    ej.Grid.DragBehavior = {
        /**  Allows to move a record from one grid to another or within the grid*/
        Move: "move", 
        /**  Allows to copy a record from one grid to another or within the grid*/
        Copy: "copy"
    }; 

    ej.Grid.CellSelectionMode = {
        /**  Allows to select cells continuously from the start cell to end cell*/
        Flow: "flow", 
        /**  Allows to select range of cells as a block from start cell to the end cell*/
        Box: "box"
    }

    ej.Grid.EditingType = {
        /**  Allows to set edit type as string edit type */
        String: "stringedit",
        /**  Allows to set edit type as boolean edit type */
        Boolean: "booleanedit",
        /**  Allows to set edit type as numeric edit type */
        Numeric: "numericedit",
        /**  Allows to set edit type as drop down edit type */
        Dropdown: "dropdownedit",
        /**  Allows to set edit type as date picker edit type */
        DatePicker: "datepicker",
        /**  Allows to set edit type as date time picker edit type */
        DateTimePicker: "datetimepicker",
        /**  Allows to set edit type as edittemplate edit type */
        EditTemplate: "edittemplate"
    };

    ej.Grid.UnboundType = {
        /** Used to specify unbound type as Edit   */
        Edit: "edit",
        /** Used to specify unbound type as Save   */
        Save: "save",
        /** Used to specify unbound type as Delete   */
        Delete: "delete",
        /** Used to specify unbound type as Cancel   */
        Cancel: "cancel"
    };

    ej.Grid.ToolBarItems = {
        /** Used to add toolbar item for adding records    */
        Add: "add",
        /** Used to add toolbar item for editing records    */
        Edit: "edit",
        /** Used to add toolbar item for deleting records    */
        Delete: "delete",
        /** Used to add toolbar item for updating records    */
        Update: "update",
        /** Used to add toolbar item for cancelling records    */
        Cancel: "cancel",
        /** Used to add toolbar item for searching records    */
        Search: "search",
        /** Used to add toolbar item for printing grid    */
        PrintGrid: "printGrid",
        /** Used to add toolbar item for exproting grid to excel    */
        ExcelExport: "excelExport",
        /** Used to add toolbar item for exporting grid to word    */
        WordExport: "wordExport",
        /** Used to add toolbar item for exporting grid to pdf    */
        PdfExport: "pdfExport"
    };

    ej.Grid.FilterType = {
        /**  Creates grid with filtering type as Menu */
        Menu: "menu",
        /**  Creates grid with filtering type as FilterBar */
        FilterBar: "filterbar",
        /** Creates grid with filtering type as Excel */
        Excel: "excel"
    };

    ej.Grid.FilterBarMode = {
        /** Used to set filter bar mode as Immediate mode */
        Immediate: "immediate",
        /** Used to set filter bar mode as OnEnter mode */
        OnEnter: "onenter"
    };

    ej.Grid.SelectionType = {
        /**  Support for Single selection only in grid */
        Single: "single",
        /**  Support for multiple selections in grid */
        Multiple: "multiple"
    };
    ej.Grid.ColumnLayout = {
         /**  Support for auto width in grid */
        Auto: "auto",
        /**  Support for fixed column width in grid */
        Fixed: "fixed"
    };
    ej.Grid.GridLines = {
        /**  Support for Show both the vertical and horizontal line in grid  */
        Both: "both",
        /**  Support for Hide both the vertical and horizontal line in grid  */
        None: "none",
        /**  Support for Shows the horizontal line only in grid */
        Horizontal: "horizontal",
        /**  Support for Shows the vertical line only in grid  */
        Vertical: "vertical",
    };

    ej.Grid.VirtualScrollMode = {
        /** Used to set the Normal mode virtual paging*/
        Normal: "normal",
        /** Used to set the Continuous mode virtual paging*/
        Continuous: "continuous"
    };

    ej.Grid.SelectionMode = {
        /**  Support for Row selection in grid */
        Row: "row",
        /**  Support for Cell selection in grid */
        Cell: "cell",
        /**  Support for Column selection in grid */
        Column: "column"
    };

    ej.Grid.WrapMode = {
        /**  Support for text wrap with both header and content in grid */
        Both: "both",
        /**  Support for text wrap with content alone in grid */
        Content: "content",
        /**  Support for text wrap with header alone in grid */
        Header: "header"
    };

    ej.Grid.exportAll = function (exportAction, gridIds) {
        ej.Grid.prototype["export"](exportAction, null, true, gridIds);
    };

    ej.SqlDataSourceAdaptor = new ej.UrlAdaptor().extend({
        init: function (id) {
            this.initialRender = true;
        },
        processQuery: function (dm, query, hierarchyFilters) {
            var obj = ej.UrlAdaptor.prototype.processQuery(dm, query, hierarchyFilters);
            var data = ej.parseJSON(obj.data), result = {};
            // Param
            if (data.param) {
                for (var i = 0; i < data.param.length; i++) {
                    var param = data.param[i], key = Object.keys(param)[0];
                    result[key] = param[key];
                }
            }
            result["value"] = data;
            var modelStr = JSON.stringify({ type: "SqlData", args: data });
            if (this.initialRender == false) {
                setTimeout(function () { __doPostBack("", modelStr) }, 0);
            }
            this.initialRender = false;
            return {
                data: JSON.stringify(result),
                result: dm.dataSource.json,
                ejPvtData: obj.ejPvtData,
                count: dm.dataSource.json.length,
            }
        },
        processResponse: function (data, ds, query, xhr, changes) {
            var pvt = data.ejPvtData || {};
            var groupDs = data.groupDs;
            if (xhr && xhr.getResponseHeader("Content-Type") && xhr.getResponseHeader("Content-Type").indexOf("xml") != -1 && data.nodeType == 9)
                return query._requiresCount ? { result: [], count: 0 } : [];
            var d = JSON.parse(data.data);
            if (d && d.action === "batch" && data.added) {
                changes.added = data.added;
                return changes;
            }
            if (pvt && pvt.aggregates && pvt.aggregates.length) {
                var agg = pvt.aggregates, args = {}, fn, res = {};
                if ('count' in data) args.count = data.count;
                if (data["result"]) args.result = data.result;
                if (data["aggregate"]) data = data.aggregate;
                for (var i = 0; i < agg.length; i++) {
                    fn = ej.aggregates[agg[i].type];
                    if (fn)
                        res[agg[i].field + " - " + agg[i].type] = fn(data, agg[i].field);
                }
                args["aggregates"] = res;
                data = args;
            }
            if (pvt && pvt.groups && pvt.groups.length) {
                var groups = pvt.groups, args = {};
                if ('count' in data) args.count = data.count;
                if (data["aggregates"]) args.aggregates = data.aggregates;
                if (data["result"]) data = data.result;
                for (var i = 0; i < groups.length; i++) {
                    var level = null;
                    if (!ej.isNullOrUndefined(groupDs))
                        groupDs = ej.group(groupDs, groups[i]);
                    data = ej.group(data, groups[i], pvt.aggregates, level, groupDs);
                }
                if (args.count != undefined)
                    args.result = data;
                else
                    args = data;
                return args;
            }
            return data;
        },
    });
})(jQuery, Syncfusion);