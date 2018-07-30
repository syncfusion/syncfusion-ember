/**
* @fileOverview PivotGrid control to visualize the data
* @copyright Copyright Syncfusion Inc. 2001 - 2013. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {

    ej.olap = ej.olap || {};

    ej.widget("ejPivotGrid", "ej.PivotGrid", {

        _rootCSS: "e-pivotgrid",
        element: null,
        model: null,
        _requiresID: true,
        validTags: ["div", "span"],
        defaults: {
            url: "",
            cssClass: "",
            jsonRecords: "",
            currentReport: "",
            layout: "normal",
            analysisMode: "olap",
            operationalMode: "clientmode",
            filterType:"filterType",
            enablePivotFieldList: true,
            enableGroupingBar: false,
            enableDeferUpdate: false,
            enableJSONRendering: false,
            enableVirtualScrolling: false,
            enablePaging: false,
            enableColumnResizing: false,
            resizeColumnsToFit: true,
            enableContextMenu: false,
            enableCellContext: false,
            enableRTL: false,
            enableDefaultValue:false,
            enableToolTip: true,
            enableToolTipAnimation: true,
            enableCellSelection: false,
            enableConditionalFormatting: false,
			enableCellEditing : false,
            enableColumnGrandTotal: true,
            enableRowGrandTotal: true,
            enableGrandTotal: true,
            enableCollapseByDefault: false,
            enableCellDoubleClick: false,
            enableCellClick: false,
			enableDrillThrough: false,
			isResponsive: false,
			enableAdvancedFilter: false,
			showUniqueNameOnPivotButton: false,
			enableMemberEditorPaging:false,
			enableXHRCredentials: false,
            enableCompleteDataExport : false,
			editCellsInfo: {},  
            hyperlinkSettings: {
                enableValueCellHyperlink: false,
                enableRowHeaderHyperlink: false,
                enableColumnHeaderHyperlink: false,
                enableSummaryCellHyperlink: false
            },
            headerSettings: {
                showRowItems: false,
                showColumnItems: false
            },
            frozenHeaderSettings: {
                enableFrozenRowHeaders: false,
                enableFrozenColumnHeaders: false,
                enableFrozenHeaders: false,
                scrollerSize: 18
            },
            valueSortSettings:{
                headerText:"",
                headerDelimiters:"##",
                sortOrder:ej.PivotAnalysis.SortOrder.None
            },
            conditionalFormatSettings: [],
            serviceMethodSettings: {
                initialize: "InitializeGrid",
                drillDown: "DrillGrid",
                exportPivotGrid: "Export",
                paging: "Paging",
                fetchMembers: "FetchMembers",
                nodeStateModified: "NodeStateModified",
                nodeDropped: "NodeDropped",
                filtering: "Filtering",
                sorting: "Sorting",
                valueSorting:"ValueSorting",
                deferUpdate: "DeferUpdate",
                memberExpand: "MemberExpanded",
                writeBack: "WriteBack",
                cellEditing : "CellEditing",
                saveReport: "SaveReport",
                loadReport: "LoadReportFromDB",
                calculatedField: "CalculatedField",
                drillThroughHierarchies: "DrillThroughHierarchies",
                drillThroughDataTable: "DrillThroughDataTable",
                removeButton:"RemoveButton"
            },
            customObject: {},
            locale: "en-US",
            dataSource: {
                data: null,
                sourceInfo: "",
                providerName:"ssas",
                enableAdvancedFilter: false,
                isFormattedValues: false,
                reportName: "Default",
                columns: [],
                cube: "",
                catalog:"",
                rows: [],
                values: [],
                filters: [],
                pagerOptions: {
                    categoricalPageSize: 0,
                    seriesPageSize: 0,
                    categoricalCurrentPage: 0,
                    seriesCurrentPage: 0
                }
            },
            pivotTableFieldListID:"",
            collapsedMembers: null,
            cellSelection: null,
            valueCellHyperlinkClick: null,
            rowHeaderHyperlinkClick: null,
            columnHeaderHyperlinkClick: null,
            summaryCellHyperlinkClick: null,
            beforeServiceInvoke: null,
            afterServiceInvoke: null,
            drillThrough: null,
            drillSuccess: null,
            cellContext: null,
            load: null,
            renderComplete: null,
            renderFailure: null,
            renderSuccess: null,
            cellDoubleClick: null,
            cellClick: null,
            applyFieldCaption: null,
            beforeExport:null,
			beforePivotEnginePopulate: null,
            saveReport: null,
            loadReport: null,
            cellEdit: null,
            memberEditorPageSize: 100,
            maxNodeLimitInMemberEditor: 1000
        },

        dataTypes: {
            dataSource: {
                data: "data",
                columns: "array",
                rows: "array",
                values: "array",
                filters: "array"
            },
            serviceMethodSettings: {
                initialize: "enum",
                drillDown: "enum",
                exportPivotGrid: "enum",
                paging: "enum",
                fetchMembers: "enum",
                nodeStateModified: "enum",
                nodeDropped: "enum",
                filtering: "enum",
                sorting: "enum",
                deferUpdate: "enum",
                memberExpand: "enum",
                writeBack: "enum",
                cellEditing: "enum",
                saveReport: "enum",
                loadReport: "enum",
                calculatedField: "enum",
                drillThroughHierarchies: "enum",
                drillThroughDataTable: "enum",
                removeButton: "enum"
            },
            customObject: "data",
        },

        observables: ["layout", "enableCellContext", "hyperlinkSettings.enableValueCellHyperlink", "hyperlinkSettings.enableRowHeaderHyperlink", "hyperlinkSettings.enableColumnHeaderHyperlink", "hyperlinkSettings.enableSummaryCellHyperlink"],
        layout: ej.util.valueFunction("layout"),
        enableCellContext: ej.util.valueFunction("enableCellContext"),
        enableValueCellHyperlink: ej.util.valueFunction("hyperlinkSettings.enableValueCellHyperlink"),
        enableRowHeaderHyperlink: ej.util.valueFunction("hyperlinkSettings.enableRowHeaderHyperlink"),
        enableColumnHeaderHyperlink: ej.util.valueFunction("hyperlinkSettings.enableColumnHeaderHyperlink"),
        enableSummaryCellHyperlink: ej.util.valueFunction("hyperlinkSettings.enableSummaryCellHyperlink"),
        locale: ej.util.valueFunction("locale"),

        getOlapReport: function () {
            return this._olapReport;
        },

        setOlapReport: function (value) {
            this._olapReport = value;
        },

        getJSONRecords: function () {
            return this._JSONRecords;
        },

        setJSONRecords: function (value) {
            this._JSONRecords = $.parseJSON(value);
        },

        _init: function () {
            this._initPrivateProperties();
            this._load();
        },

        _destroy: function () {
            if ($(this.element).next().length > 0 && $(this.element).next()[0].className == "e-pGridTooltip")
                $(this.element).next().remove();
            this.element.empty().removeClass("e-pivotgrid" + this.model.cssClass).removeAttr("tabindex");
            if (this._waitingPopup != undefined) this._waitingPopup.destroy();
            if (this.element.attr("class") == "") this.element.removeAttr("class");
        },

        _getExportModel: function (modelClone) {
            var exportOption = "excel", fileName = "ExportControl";
            var colorDetails = {
                rowCellColor: !ej.isNullOrUndefined(this.element.find(".rowheader")) ? ej.isNullOrUndefined(this.element.find(".rowheader").css("color")) ? "rgb(51, 51, 51)" : this.element.find(".rowheader").css("color") : "",
                rowCellBGColor: !ej.isNullOrUndefined(this.element.find(".rowheader")) ? ej.isNullOrUndefined(this.element.find(".rowheader").css("background-color")) ? "rgb(255, 255, 255)" : this.element.find(".rowheader").css("background-color") : "",
                columnCellColor: !ej.isNullOrUndefined(this.element.find(".colheader")) ? ej.isNullOrUndefined(this.element.find(".colheader").css("color")) ? "rgb(51, 51, 51)" : this.element.find(".colheader").css("color") : "",
                columnCellBGColor: !ej.isNullOrUndefined(this.element.find(".colheader")) ? ej.isNullOrUndefined(this.element.find(".colheader").css("background-color")) ? "rgb(255, 255, 255)" : this.element.find(".colheader").css("background-color") : "",
                valueCellColor: !ej.isNullOrUndefined(this.element.find(".value")) ? ej.isNullOrUndefined(this.element.find(".value").css("color")) ? "rgb(51, 51, 51)" : this._cFormat.length <= 0 ? this.element.find(".value").css("color") : "rgb(51, 51, 51)" : "",
                valueCellBGColor: !ej.isNullOrUndefined(this.element.find(".value")) ? ej.isNullOrUndefined(this.element.find(".value").css("background-color")) ? "rgb(255, 255, 255)" : this._cFormat.length <= 0 ? this.element.find(".value").css("background-color") : "rgb(255, 255, 255)" : "",
                summaryCellColor: !ej.isNullOrUndefined(this.element.find(".summary")) ? ej.isNullOrUndefined(this.element.find(".summary").css("color")) ? "rgb(51, 51, 51)" : this.element.find(".summary").css("color") : "",
                summaryCellBGColor: !ej.isNullOrUndefined(this.element.find(".summary")) ? ej.isNullOrUndefined(this.element.find(".summary").css("background-color")) ? "rgb(255, 255, 255)" : this.element.find(".summary").css("background-color") : ""
            };
            var modelClone = $.extend(true, {}, this.model);
             var   exportSetting = { url: "", fileName: "PivotGrid", exportMode: ej.PivotGrid.ExportMode.JSON, fileFormat: this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? ".xls" : ".xlsx", title: "", description: "", exportType: exportOption, controlName: this, exportWithStyle: true, exportValueAsNumber: false };
             var exportingInfo = ({ args: ({ "pGridData": (this.exportRecords != null && this.exportRecords != "") ? this.exportRecords : null, "rowCount": this._excelLikeJSONRecords != null ? this._excelRowCount : this._rowCount, "columnCount": this._excelLikeJSONRecords != null ? Math.floor(this._excelLikeJSONRecords.length / this._excelRowCount) : this.getJSONRecords() != null ? Math.floor(this.getJSONRecords().length / this._rowCount) : 0, "fileFormat": (exportSetting.fileFormat + ((exportSetting.fileFormat == ".xls" || exportSetting.fileFormat == ".xlsx") ? ("~" + exportSetting.exportValueAsNumber) : "")), "fileName": ej.isNullOrUndefined(fileName) ? (ej.isNullOrUndefined(exportSetting.fileName) ? "PivotGrid" : exportSetting.fileName) : fileName, "colorSettings": colorDetails, "Formatting": this._cFormat, title: exportSetting.title, description: exportSetting.description, "language": this.model.locale,"multiControlExport":true, exportWithStyle: exportSetting.exportWithStyle, customObject: JSON.stringify(this.model.customObject) }) });
             return exportingInfo;
        },
        _initPrivateProperties: function () {
            this._id = this.element.attr("id");
            this._olapReport = "";
            this._JSONRecords = null;
            this._excelLikeJSONRecords = null;
            this._drillCaption = "";
            this._drillAction = "";
            this._startDrilldown = false;
            this._pagerObj = null;
            this._seriesPageCount = null;
            this._categPageCount = null;
            this._seriesCurrentPage = 1;
            this._categCurrentPage = 1;
            this._drillHeaders = { row: new Array(), column: new Array() };
            this._collapsedRowHeaders = new Array();
            this._isDragging = false;
            this._droppedClass = "";
            this._dataModel = "";
            this._ascdes = "";
            this._filterUpdate = new Array();
            this._pivotRow = new Array();
            this._pivotColumn = new Array();
            this._pivotCalculation = new Array();
            this._pivotFilter = new Array();
            this._pivotTableFields = new Array();
            this._schemaData = null;
            this._waitingPopup = null;
            this._oriX = null;
            this._oriY = null;
            this._startPosCell = null;
            this._maxViewLoading = null;
            this._list = new Array();
            this._formatEdit = false;
            this._formatName = new Array();
            this._formatName.push(this._getLocalizedLabels("AddNew"));
            this._rowCount = 0;
            this._excelRowCount = 0;
            this._dialogTitle = "";
            this._selectedField = "";
            this._selectedAxis = "";
            this._isUpdateRequired = false;
            this._isMembersFiltered = false;
            this._selectedCell = null;
            this._onholdKey = "";
            this._primaryCellPos = "";
            this._prevDrillElements = [];
            this._currentReportItems = [];
            this._savedReportItems = [];
			this._rowHeader = [];
			this._colHeader = [];
			this._cellInfo = [];
            this._editorFlag = true;
            this._isSubTotalHide = false;
            this._isSubTotalhidden = false;
			this._dimension;
			this._calculatedField = [];
			this._isFormatApply = false;
			this._cFormat = [];
			this._curFocus = { cell: null, tab: null, tree: null, cformat: null, grp: null, selection: null, filter: null, field: null, formula: null };
			this._index = { index: 0, grp: 1, cell: 1, dialog: 1, paging: 1, cformat: 1, filter: 0, field: 0, formula: 0 };
			var i, j, k, l;
			this._dataSet = [];
			this._currentCell = -1;
			this._target = null;
		    this._orgX = null;
			this._orgY = null;
			this._expand = false;
			this._excelFilterInfo = [];
			this._pagingSavedObjects = {
			    drillEngine: [],
			    savedHdrEngine: [],
			    curDrilledItem: {}
			};
			this._isSchemaInitialize = true;
			this._fieldMembers = {};
			this._fieldSelectedMembers = {};
			this._allMember = "";
			this._selectedMeasure = "";
			this._selectedFormat = "";
			this._dialogName = "";
			this._pivotClientObj = null;
			this._memberPageSettings = {
			    currentMemeberPage: 1,
			    startPage: 0,
			    endPage: 0
			};
			this._memberSearchPageSettings = {
			    currentMemberSearchPage: 1,
			    startSearchPage: 0,
			    endSearchPage: 0
			};
			this._memberDrillPageSettings = {
			    currentMemberDrillPage: 1,
			    startDrillPage: 0,
			    endDrillPage: 0
			};
			this._isAllMemberChecked = true;
			this._editorTreeData = [];
			this._editorSearchTreeData = [];
			this._editorDrillTreeData = {};
			this._editorDrillTreePageSettings = {};
			this._lastSavedTree = [];
			this._onDemandNodeExpand = true;
			this._isSearchApplied = false;
			this._isEditorDrillPaging = false;
			this._isEditorCollapseDrillPaging = false;
			this._isSchemaClick = false;
			this._memberPagingAvdData = [];
			this._table = "";
			this._drillParams = { currRow: "", currCol: "", currPos: "" };
			this._croppedJson = [];
			this._compJson = [];
			this._isNavigation = false;
			this._isOptionSearch = false;
			this._isSelectSearchFilter = true;
			this._currentFilterList = {};
			this._rawData = [];
			this._colKeysCalcValues = [];
			this._rowKeysCalcValues = [];
			this._tableKeysCalcValues = [];
			this._isExporting = false;
			this._fullExportedData = {};
			this._pivotEngine = null;
			this._isXMLImport = false;
			this._isFilterBtnClick = false;
			this._parentNodeCollection = {};
			this._parentSearchNodeCollection = {};
        },

        _load: function () {
            var eventArgs = { element: this.element, customObject: this.model.customObject };
            if (this.model.enableAdvancedFilter || this.model.dataSource.enableAdvancedFilter)
                this.model.dataSource.enableAdvancedFilter = this.model.enableAdvancedFilter=true;
            if (this.model.enableCellEditing && this.model.enableCellSelection)
                this.model.enableCellSelection = false;
            this._trigger("load", eventArgs);
            this.element.addClass(this.model.cssClass);
            if ($(this.element).parents(".e-pivotclient").length > 0) {
                this._pivotClientObj = $(this.element).parents(".e-pivotclient").data("ejPivotClient");
                if ($("#" + this._pivotClientObj._id + "_maxView")[0])
                    $("#" + this._pivotClientObj._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                if (ej.isNullOrUndefined(this._waitingPopup) && !ej.isNullOrUndefined(this._pivotClientObj._waitingPopup))
                    this._waitingPopup = this._pivotClientObj._waitingPopup;
                this._waitingPopup.show();
            }
            else {
                if (ej.isNullOrUndefined(this._waitingPopup)) {
                    this.element.ejWaitingPopup({ showOnInit: true });
                    this._waitingPopup = this.element.data("ejWaitingPopup");
                }
            }
            this._waitingPopup.show();
            if (this.model.enableJSONRendering) {
                this.setJSONRecords(this.model.jsonRecords)
                if (this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout)
                    this.excelLikeLayout(this.getJSONRecords());
                else
                    this.renderControlFromJSON();
            }
            else if (ej.isNullOrUndefined(this.model.dataSource.data) && this.model.url == "" && !ej.isNullOrUndefined(this._pivotClientObj)) {
                this.renderControlFromJSON();
                this._waitingPopup.hide();
            }
            else {
                if ((this.model.dataSource.data == null && this.model.url != "") || (this.model.dataSource.data != null && this.model.url != "" && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)) {
                    this.model.operationalMode = ej.Pivot.OperationalMode.ServerMode;
                    if (!ej.isNullOrUndefined(this.model.beforeServiceInvoke))
                        this._trigger("beforeServiceInvoke", { action: "initialize", element: this.element, customObject: this.model.customObject });
                    var serializedCustomObject = JSON.stringify(this.model.customObject);
                    if (this.model.enableVirtualScrolling) this.model.layout = ej.PivotGrid.Layout.NoSummaries;
                    if (this.element[0] != null && this.element.parents().find(".e-controlPanel").length > 0 && this.layout() != "" && this.layout() != ej.PivotGrid.Layout.Normal)
                        this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.initialize, JSON.stringify({ "action": "initializeGrid", "currentReport": this.model.currentReport, "gridLayout": this.layout(), "customObject": serializedCustomObject }), this._renderControlSuccess);
                    else if (this.element[0] != null && this.element.parents().find(".e-controlPanel").length > 0)
                        this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.initialize, JSON.stringify({ "action": (this.model.enableCellDoubleClick || this.model.enableCellClick || this.model.enableDrillThrough) ? "initializeGrid:getDataSet" : "initializeGrid", "currentReport": this.model.currentReport, "customObject": serializedCustomObject }), this._renderControlSuccess);
                    else
                        this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.initialize, JSON.stringify({ "action": (this.model.enableCellDoubleClick || this.model.enableCellClick || this.model.enableDrillThrough) ? ((this.model.enableCollapseByDefault && (this.model.enablePaging || this.model.enableVirtualScrolling)) ? "initializeGrid:getDataSet:collapseByDefault" : "initializeGrid:getDataSet") : ((this.model.enableCollapseByDefault && (this.model.enablePaging || this.model.enableVirtualScrolling)) ? "initializeGrid:collapseByDefault" : "initializeGrid"), "gridLayout": this.layout(), "enablePivotFieldList": this.model.enablePivotFieldList, "valueSorting": JSON.stringify(this.model.valueSortSettings), "customObject": serializedCustomObject }), this._renderControlSuccess);
                }
                else {
                    this.model.operationalMode = ej.Pivot.OperationalMode.ClientMode;
                    if (this.model.dataSource.cube != "") {
                        this.model.analysisMode = ej.Pivot.AnalysisMode.Olap;
                        this._trigger("beforePivotEnginePopulate", { pivotGridObj: this });
                        ej.olap.base.getJSONData({ action: "initialLoad" }, this.model.dataSource, this);
                    }
                    else if (this.model.dataSource.data != null) {
                        var add = false;
                        for (var i = 0; i < this.model.dataSource.rows.length; i++) {
                            add = this._applyGrouping("rows", i);
                            if (add) i--;
                        }
                        for (var i = 0; i < this.model.dataSource.columns.length; i++) {
                            add = this._applyGrouping("columns", i)
                            if (add) i--;
                        }
                        for (var i = 0; i < this.model.dataSource.values.length; i++) {
                            add = this._applyGrouping("values", i);
                            if (add) i--;
                        }
                        for (var i = 0; i < this.model.dataSource.filters.length; i++) {
                            add = this._applyGrouping("filters", i);
                            if (add) i--;
                        }
                        this.model.analysisMode = ej.Pivot.AnalysisMode.Pivot;
                        ej.PivotAnalysis.setFieldCaptions(this.model.dataSource);
                        this._populatePivotGrid();
                    }
                }
            }
        },
		
        _formatChange: function (date, formatString, delimiter) {
            var format = formatString.split(delimiter);
            if ((format[0].indexOf("M") > -1 && format[1].indexOf("d") > -1) || (format[1].indexOf("M") > -1 && format[2].indexOf("d") > -1)) {
                return date;
            }
            else if (format[1].indexOf("M") > -1 && format[0].indexOf("d") > -1) {
                var dd = date.split(delimiter);
                return (dd[1] + delimiter + dd[0] + delimiter + dd[2]);
            }
            else if (format[2].indexOf("M") > -1 && format[0].indexOf("d") > -1) {
                var dd = date.split(delimiter);
                return (dd[2] + delimiter + dd[0] + delimiter + dd[1]);
            }
            else if (format[2].indexOf("M") > -1 && format[1].indexOf("d") > -1) {
                var dd = date.split(delimiter);
                return (dd[2] + delimiter + dd[1] + delimiter + dd[0]);
            }
            else if (format[0].indexOf("M") > -1 && format[2].indexOf("d") > -1) {
                var dd = date.split(delimiter);
                return (dd[0] + delimiter + dd[2] + delimiter + dd[1]);
            }
        },

        _applyGrouping: function (items, i) {
            this._rawData = this.model.dataSource.data;
            var data = this.model.dataSource.data, index = -1, add = false;
            index = -1;
            for (var k = 0; this.model.dataSource[items][i].format == "date" && this.model.dataSource[items][i].formatString != undefined && this.model.dataSource[items][i].delimiter != undefined && this.model.dataSource[items][i].groupByDate != undefined && k < this.model.dataSource[items][i].groupByDate.interval.length; k++) {
                var fName = (this.model.dataSource[items][i].groupByDate.interval[k].indexOf("MM") > -1 && this.model.dataSource[items][i].groupByDate.interval[k].indexOf("dd") == -1) ? this._getLocalizedLabels("Months") : (this.model.dataSource[items][i].groupByDate.interval[k].indexOf("dd") > -1) ? this._getLocalizedLabels("Days") : (this.model.dataSource[items][i].groupByDate.interval[k].indexOf("qq") > -1) ? this._getLocalizedLabels("Quarters") : this._getLocalizedLabels("Years");
                var formatString = this.model.dataSource[items][i].formatString, delimiter = this.model.dataSource[items][i].delimiter;
                var val = { fieldName: fName + " (" + this.model.dataSource[items][i].fieldName + ")", fieldCaption: fName + " (" + this.model.dataSource[items][i].fieldName + ")" };
                this.model.dataSource[items].push(val);
                for (var j = 0; j < data.length; j++) {
                    if (this.model.dataSource[items][i].groupByDate.interval[k].indexOf("MM") > -1 && this.model.dataSource[items][i].groupByDate.interval[k].indexOf("DD") == -1)
                        data[j][val.fieldName] = ej.PivotAnalysis._setFormat(this._formatChange(data[j][this.model.dataSource[items][i].fieldName], formatString, delimiter), this.model.dataSource[items][i].format, this.model.dataSource[items][i].groupByDate.interval[k]);
                    else if (this.model.dataSource[items][i].groupByDate.interval[k].indexOf("dd") > -1)
                        data[j][val.fieldName] = ej.PivotAnalysis._setFormat(this._formatChange(data[j][this.model.dataSource[items][i].fieldName], formatString, delimiter), this.model.dataSource[items][i].format, this.model.dataSource[items][i].groupByDate.interval[k]);
                    else if (this.model.dataSource[items][i].groupByDate.interval[k].indexOf("qq") > -1)
                        data[j][val.fieldName] = ((this.model.dataSource[items][i].groupByDate.interval[k] == "qq" ? (this._getLocalizedLabels("Qtr") + " " + delimiter) : (this._getLocalizedLabels("Quarter") + " " + delimiter)) + this._getQuarter(this._formatChange(data[j][this.model.dataSource[items][i].fieldName], formatString, delimiter)));
                    else
                        data[j][val.fieldName] = ej.PivotAnalysis._setFormat(this._formatChange(data[j][this.model.dataSource[items][i].fieldName], formatString, delimiter), this.model.dataSource[items][i].format, this.model.dataSource[items][i].groupByDate.interval[k]);
                }
                index = i;
            }
            if (index != -1) {
                this.model.dataSource[items].splice(i, 1);
                add = true;
            }
            return add;
        },

        _getQuarter: function (val) {
            if (jQuery.isNumeric(val)) {
                day = new Date(((Number(val) - 2) * (1000 * 3600 * 24)) + new Date("01/01/1900").getTime());
            }
            else if (new Date(val) != "Invalid Date"){
                var day = new Date(val);
            }
            else {
                day = new Date(((Number(0) - 2) * (1000 * 3600 * 24)) + new Date("01/01/1900").getTime());
            }
            return Math.floor((day.getMonth() + 3) / 3);
        },
		
        refreshControl: function () {
            ej.Pivot.openPreventPanel(this);
            this._trigger("beforePivotEnginePopulate", { pivotObject: this });
            if (this.model.enableGroupingBar)
                this._createGroupingBar(this.model.dataSource);
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                ej.PivotAnalysis._controlObj = this;
                this._pivotEngine = ej.PivotAnalysis.pivotEnginePopulate(this.model);
                this.setJSONRecords(JSON.stringify(this._pivotEngine.json));
                if (this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout)
                    this.excelLikeLayout(this._pivotEngine.json);
                else
                    this.renderControlFromJSON(this._pivotEngine.json);
                this._trigger("renderSuccess", this);
            }
            else
                ej.olap.base.getJSONData({ action: "initialLoad" }, this.model.dataSource, this);
        },

        _setCaptions: function () {
            $.each(this.model.dataSource.rows, function (index, value) { if (ej.isNullOrUndefined(value.fieldCaption)) value.fieldCaption = value.fieldName; });
            $.each(this.model.dataSource.columns, function (index, value) { if (ej.isNullOrUndefined(value.fieldCaption)) value.fieldCaption = value.fieldName; });
            $.each(this.model.dataSource.filters, function (index, value) { if (ej.isNullOrUndefined(value.fieldCaption)) value.fieldCaption = value.fieldName; });
            $.each(this.model.dataSource.values, function (index, value) { if (ej.isNullOrUndefined(value.fieldCaption)) value.fieldCaption = value.fieldName; });
        },

        refreshFieldCaption: function (name, caption, className) {
            if (className.indexOf("row") >= 0) {
                for (var i = 0; i < this.model.dataSource.rows.length; i++) {
                    if (name == this.model.dataSource.rows[i].fieldName)
                        this.model.dataSource.rows[i].fieldCaption = caption;
                }
            }
            else if (className.indexOf("calc") >= 0) {
                for (var i = 0; i < this.model.dataSource.values.length; i++) {
                    if (name == this.model.dataSource.values[i].fieldName)
                        this.model.dataSource.values[i].fieldCaption = caption;
                }
            }
            else if (className.indexOf("col") >= 0) {
                for (var i = 0; i < this.model.dataSource.columns.length; i++) {
                    if (name == this.model.dataSource.columns[i].fieldName)
                        this.model.dataSource.columns[i].fieldCaption = caption;
                }
            }
            else {
                for (var i = 0; i < this.model.dataSource.filters.length; i++) {
                    if (name == this.model.dataSource.filters[i].fieldName)
                        this.model.dataSource.filters[i].fieldCaption = caption;
                }
            }
            for (var i = 0; i < this._pivotTableFields.length; i++) {
                if (name == this._pivotTableFields[i].name)
                    this._pivotTableFields[i]["caption"] = caption;
            }
        },

        refreshPivotGrid: function () {
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    if (this.getOlapReport()) {
                        if (this.model.dataSource.rows)
                            this.model.dataSource.rows = this.getOlapReport().rows;
                        if (this.model.dataSource.columns)
                            this.model.dataSource.columns = this.getOlapReport().columns;
                        if (this.model.dataSource.filters)
                            this.model.dataSource.filters = this.getOlapReport().filters;
                        if (this.model.dataSource.values)
                            this.model.dataSource.values = this.getOlapReport().values;
                    }
                    this.model.editCellsInfo = {};
                    this._populatePivotGrid();
                }
                else {
                    this._trigger("beforePivotEnginePopulate", { olapObject: this });
                    ej.olap.base.getJSONData({ action: "initialLoad" }, this.model.dataSource, this);
                }
            }
            else
                this._load();
        },

		_populatePivotGrid: function () {         
		    this._trigger("beforePivotEnginePopulate", { pivotObject: this });
		    var pivotClientObj = ($(this.element).parents(".e-pivotclient").length > 0) ? $(this.element).parents(".e-pivotclient").data("ejPivotClient") : null;
		    var calculatedField = $.grep(this.model.dataSource.values, function (value) { return value.isCalculatedField == true; });
		    this.model.dataSource.values = $.grep(this.model.dataSource.values, function (value) { return ej.isNullOrUndefined(value.isCalculatedField) || value.isCalculatedField == false; });
		    for (var i = 0; i < calculatedField.length; i++) {
		        var formula = calculatedField[i].formula;
		        if ($.grep(this._calculatedField, function (value) { return value.name == calculatedField[i].fieldName; }).length == 0) {
		            formula = formula.replace(/\s+|\s+$/gm, '');
		            formula = this._parenthesisAsterisk(formula);
		            formula = formula.replace(/[-+/^%*]/g, function (text) { return " " + text + " "; });
		            this._calculatedField.push({ name: calculatedField[i].fieldName, formula: formula, format: calculatedField[i].format, formatString: calculatedField[i].formatString });
		        }
		        calculatedField[i].formula = formula;
		        this.model.dataSource.values.push(calculatedField[i]);
		    }
		    ej.PivotAnalysis._controlObj = this;
		    var pivotEngine = ej.PivotAnalysis.pivotEnginePopulate(this.model);
		    this.setJSONRecords(JSON.stringify(pivotEngine.json));
		    this.setOlapReport(this.model.dataSource);
            this._createGroupingBar(this.model.dataSource);
		    if (this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout)
		        this.excelLikeLayout(pivotEngine.json);
		    else
		    this.renderControlFromJSON();
		    if (!ej.isNullOrUndefined(pivotClientObj)) pivotClientObj._isTimeOut = false;
		    this._waitingPopup.hide();
		    this._trigger("renderSuccess", this);
		    if (!ej.isNullOrUndefined(this._pivotClientObj) && typeof (this._pivotClientObj._pivotSchemaDesigner) != "undefined")
		        this._schemaData = this._pivotClientObj._pivotSchemaDesigner;
		    if (this._schemaData != null) {
		        if (!ej.isNullOrUndefined(this._schemaData._waitingPopup))
		            this._schemaData._waitingPopup.hide();
		        else
		            this._waitingPopup.hide();
				if (this._calculatedField.length > 0)
				    this._schemaCalculatedField();
		    }
		},

        _setFirst: false,

        _setModel: function (options) {
            for (var key in options) {
                switch (key) {
                    case "OlapReport": this.setOlapReport(options[key]); break;
                    case "JsonData": this.setOlapReport(options[key]); break;
                    case "RefreshOlapGrid": this.element.renderControlFromJSON(options[key]); break;
                    case "layout": { this.layout(ej.util.getVal(options[key])); this._load(); break };
                    case "customObject": this.model.customObject = options[key]; break;
                    case "enableCellContext": { this.enableCellContext(ej.util.getVal(options[key])); this._load(); break; }
                    case "enableDefaultValue": { this.model.enableDefaultValue = options[key]; break; }
                    case "hyperlinkSettings":
                        {
                            if ((!ej.isNullOrUndefined(ej.util.getVal(options[key]).enableValueCellHyperlink)) && $.isFunction((ej.util.getVal(options[key]).enableValueCellHyperlink)))
                                this.enableValueCellHyperlink((options[key]).enableValueCellHyperlink());
                            else if (!ej.isNullOrUndefined(options[key].enableValueCellHyperlink))
                                this.enableValueCellHyperlink(options[key].enableValueCellHyperlink);

                            if ((!ej.isNullOrUndefined(ej.util.getVal(options[key]).enableRowHeaderHyperlink)) && $.isFunction((ej.util.getVal(options[key]).enableRowHeaderHyperlink)))
                                this.enableRowHeaderHyperlink((options[key]).enableRowHeaderHyperlink());
                            else if (!ej.isNullOrUndefined(options[key].enableRowHeaderHyperlink))
                                this.enableRowHeaderHyperlink(options[key].enableRowHeaderHyperlink);

                            if ((!ej.isNullOrUndefined(ej.util.getVal(options[key]).enableColumnHeaderHyperlink)) && $.isFunction((ej.util.getVal(options[key]).enableColumnHeaderHyperlink)))
                                this.enableColumnHeaderHyperlink((options[key]).enableColumnHeaderHyperlink());
                            else if (!ej.isNullOrUndefined(options[key].enableColumnHeaderHyperlink))
                                this.enableColumnHeaderHyperlink(options[key].enableColumnHeaderHyperlink);

                            if ((!ej.isNullOrUndefined(ej.util.getVal(options[key]).enableSummaryCellHyperlink)) && $.isFunction((ej.util.getVal(options[key]).enableSummaryCellHyperlink)))
                                this.enableSummaryCellHyperlink((options[key]).enableSummaryCellHyperlink());
                            else if (!ej.isNullOrUndefined(options[key].enableSummaryCellHyperlink))
                                this.enableSummaryCellHyperlink(options[key].enableSummaryCellHyperlink);
                            this._load(); break;
                        }
                    case "operationalMode": this.model.operationalMode = options[key]; break;
                    case "analysisMode": this.model.analysisMode = options[key]; break;
                    case "locale": { this.locale(ej.util.getVal(options[key])); this._load(); break;}
                    case "dataSource": {
                            this.model.dataSource=($.extend({}, this.model.dataSource, options[key]));
                        this.refreshControl();
                        if (this._schemaData)
                            this._schemaData._load();
                        break;
                    }
                    case "enableGroupingBar": {
                        this.model.enableGroupingBar = options[key];
                        this._load(); break;
                    }
                    case "enableDeferUpdate": {
                        this.model.enableGroupingBar = options[key];
                        this._load(); break;
                    }
                    case "enableJSONRendering": {
                        this.model.enableJSONRendering = options[key];
                        this._load(); break;
                    }
                    case "enableVirtualScrolling": {
                        this.model.enableVirtualScrolling = options[key];
                        this._load(); break;
                    }
                    case "enablePaging": {
                        this.model.enablePaging = options[key];
                        this._load(); break;
                    }
                    case "enableColumnResizing": {
                        this.model.enableColumnResizing = options[key];
                        this._load(); break;
                    }
                    case "resizeColumnsToFit": {
                        this.model.resizeColumnsToFit = options[key];
                        this.renderControlFromJSON();; break;
                    }
                    case "enableContextMenu": {
                        this.model.enableContextMenu = options[key];
                        this._load(); break;
                    }
                    case "enableRTL": {
                        this.model.enableRTL = options[key];
                        this._load(); break;
                    }
                    case "enableToolTip": { this.model.enableToolTip = options[key]; break; }
                    case "enableToolTipAnimation": { this.model.enableToolTipAnimation = options[key]; break; }
                    case "enableCellSelection": {
                        this.model.enableCellSelection = options[key];
                        this._load();
                        break;
                    }
                    case "enableConditionalFormatting": { this.model.enableConditionalFormatting = options[key]; this._load(); break; }
                    case "enableCellEditing": { this.model.enableCellEditing = options[key]; this._load(); break;}
                    case "enableColumnGrandTotal": { this.model.enableColumnGrandTotal = options[key]; this._load(); break; }
                    case "enableRowGrandTotal": { this.model.enableRowGrandTotal = options[key]; this._load(); break;}
                    case "enableGrandTotal": { this.model.enableGrandTotal = options[key]; this._load(); break;}
                    case "enableCollapseByDefault": { this.model.enableCollapseByDefault = options[key]; this._load(); break;}
                    case "enableCellDoubleClick": {
                        this.model.enableCellDoubleClick = options[key];
                        this._load(); break;
                    }
                    case "enableDrillThrough": {
                        this.model.enableDrillThrough = options[key];
                        this._load(); break;
                    }
                    case "isResponsive": {
                        this.model.isResponsive = options[key];
                        this._load();
                        break;
                    }
                    case "enableAdvancedFilter": {
                        this.model.enableAdvancedFilter = options[key];
                        this._load();
                        break;
                    }
                    case "showUniqueNameOnPivotButton": {
                        this.model.showUniqueNameOnPivotButton = options[key];
                        this._load();
                        break;
                    }
                    case "enableMemberEditorPaging": {
                        this.model.enableMemberEditorPaging = options[key];
                        this._load();
                        break;
                    }
                    case "frozenHeaderSettings": {
                        this.model.frozenHeaderSettings = ($.extend({}, this.model.frozenHeaderSettings, options[key]));
                        this.refreshControl();
                        break;
                    }
                    case "valueSortSettings": {
                        this.model.valueSortSettings = ($.extend({}, this.model.valueSortSettings, options[key]));
                        this.refreshControl();
                        break;
                    }
                }
            }
        },

        _wireEvents: function () {
            if (this.model.enableCellDoubleClick)
                this._on(this.element, "dblclick", ".value, .summary", this._cellRangeInfo);
            if (this.model.enableCellClick)
                this._on(this.element, "click", ".value, .summary", this._cellRangeInfo);
            this._on(this.element, "mouseover", ".value,.rowheader,.colheader,.summary", ej.proxy(function (evt) {
                if (!$(evt.target).hasClass("cellValue") && !$(evt.target).children().hasClass("cellValue")) {
                    var val = $(evt.target).contents().filter(function () { return this.nodeType == 3; });
                    if (val.text() != 0) {
                        var isSort = $(evt.target).find(".valueSorting").length > 0 ? true : false;
                        var sorting = isSort ? $(evt.target).find(".valueSorting") : "";
                        $(evt.target).find(".valueSorting").remove();
                        $(evt.target).contents().filter(function () { return this.nodeType == 3; }).remove();
                        $(evt.target).append("<span class='cellValue'>" + val.text() + "</span>");
                        isSort && ($(evt.target).hasClass("colheader") || $(evt.target).hasClass("summary")) && $(evt.target).hasClass("calc") && (!$(evt.target).hasClass("rowheader")) ? $(evt.target).append(sorting) : "";
                    }
                }
            }));
            this._on(this.element, "contextmenu", ".value,.rowheader,.colheader,.summary", ej.proxy(function (evt) {

                if (this.model.enableContextMenu && ej.isNullOrUndefined(this._pivotClientObj) && !this.model.enableCellContext) {
                    evt.preventDefault();
                    var advancedfilter = "", numberformatting = "", paging = "", pagingOptions = "", collapseByDefault = "", layouts = "";

                    layouts = this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? "<li><a>" + this._getLocalizedLabels("Layouts") + "</a><ul><li id='normalLayout'><a>" + this._getLocalizedLabels("NormalLayout") + "</a><li><li id='excelLikeLayout'><a>" + this._getLocalizedLabels("ExcelLikeLayout") + "</a><li></ul></li>" : (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? "<li><a>" + this._getLocalizedLabels("Layouts") + "</a><ul><li id='normalLayout'><a>" + this._getLocalizedLabels("NormalLayout") + "</a><li><li id='excelLikeLayout'><a>" + this._getLocalizedLabels("ExcelLikeLayout") + "</a><li><li id='noSummariesLayout'><a>" + this._getLocalizedLabels("NoSummaries") + "</a><li></ul></li>" : "<li><a>" + this._getLocalizedLabels("Layouts") + "</a><ul><li id='normalLayout'><a>" + this._getLocalizedLabels("NormalLayout") + "</a><li><li id='excelLikeLayout'><a>" + this._getLocalizedLabels("ExcelLikeLayout") + "</a><li><li id='noSummariesLayout'><a>" + this._getLocalizedLabels("NoSummaries") + "</a><li><li id='normalTopSummaryLayout'><a>" + this._getLocalizedLabels("NormalTopSummary") + "</a><li></ul></li>");
                    advancedfilter = !((this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot || this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)?ej.buildTag("li.e-advancedFiltering", ej.buildTag("a", this._getLocalizedLabels("AdvancedFiltering"))[0].outerHTML)[0].outerHTML:"";
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                        collapseByDefault = ej.buildTag("li.e-collapseByDefault", ej.buildTag("a", this._getLocalizedLabels("CollapseByDefault"))[0].outerHTML)[0].outerHTML;
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode)
                        numberformatting = ej.buildTag("li.e-numberFormatting", ej.buildTag("a", this._getLocalizedLabels("NumberFormatting"))[0].outerHTML)[0].outerHTML;
                    var hyperlink = "<li><a>" + this._getLocalizedLabels("HyperLink") + "</a><ul><li id='rowHeader'><a>" + this._getLocalizedLabels("EnableRowHeaderHyperlink") + "</a></li><li id='columnHeader'><a>" + this._getLocalizedLabels("EnableColumnHeaderHyperlink") + "</a></li><li id='valueCell'><a>" + this._getLocalizedLabels("EnableValueCellHyperlink") + "</a></li><li id='summaryCell'><a>" + this._getLocalizedLabels("EnableSummaryCellHyperlink") + "</a></li></ul></li>";
                    var exporting = "<li><a>" + this._getLocalizedLabels("Exporting") + "</a><ul><li id='excel'><a>" + this._getLocalizedLabels("Excel") + "</a></li><li id='word'><a>" + this._getLocalizedLabels("Word") + "</a></li><li id='pdf'><a>" + this._getLocalizedLabels("PDF") + "</a></li><li id='csv'><a>" + this._getLocalizedLabels("CSV") + "</a></li></ul></li>";
                    var frozen = "<li class='e-separator'><a>" + this._getLocalizedLabels("FrozenHeader") + "</a><ul><li id='row'><a>" + this._getLocalizedLabels("Row") + "</a></li><li id='column'><a>" + this._getLocalizedLabels("Column") + "</a></li></ul></li>";
                    var listContext = ej.buildTag("ul#"+this._id+"contextMenu.e-pivotGridContextMenu",
                    ej.buildTag("li.e-cellSelect", ej.buildTag("a", this._getLocalizedLabels("CellSelection"))[0].outerHTML)[0].outerHTML +
                    ej.buildTag("li.e-columnResize", ej.buildTag("a", this._getLocalizedLabels("ColumnResize"))[0].outerHTML)[0].outerHTML +
                    ej.buildTag("li.e-toolTip", ej.buildTag("a", this._getLocalizedLabels("ToolTip"))[0].outerHTML)[0].outerHTML + collapseByDefault + advancedfilter +
                    ej.buildTag("li.groupingBar", ej.buildTag("a", this._getLocalizedLabels("GroupingBar"))[0].outerHTML)[0].outerHTML +
                    (this.model.analysisMode == "pivot" ? ej.buildTag("li.e-cellEditing", ej.buildTag("a", this._getLocalizedLabels("CellEditing"))[0].outerHTML)[0].outerHTML : "") +
                    ej.buildTag("li.e-drillThrough", ej.buildTag("a", this._getLocalizedLabels("DrillThrough"))[0].outerHTML)[0].outerHTML +
                    ej.buildTag("li.rtl", ej.buildTag("a", this._getLocalizedLabels("RTL"))[0].outerHTML)[0].outerHTML + layouts + hyperlink + exporting +frozen+
                    ej.buildTag("li.e-summaryCustomize", ej.buildTag("a", this._getLocalizedLabels("SummaryCustomization"))[0].outerHTML)[0].outerHTML +
                    ej.buildTag("li.e-conditionalFormat", ej.buildTag("a", this._getLocalizedLabels("ConditionalFormatting"), {})[0].outerHTML)[0].outerHTML +
                    (this.model.analysisMode == "pivot" ? (ej.buildTag("li.e-calculatedField", ej.buildTag("a", this._getLocalizedLabels("CalculatedField"))[0].outerHTML)[0].outerHTML  + numberformatting + (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? ej.buildTag("li.e-summaryTypes", ej.buildTag("a", this._getLocalizedLabels("SummaryTypes"), {})[0].outerHTML)[0].outerHTML : "")) : ""))[0].outerHTML;

                    $("#" + this._id).append(listContext);
                    $("li.rtl").addClass("e-separator");
                    var ele = this.element.find(".e-pivotGridTable");

                    this.element.find("#"+this._id+"contextMenu").ejMenu({
                        width: "200px",
                        menuType: ej.MenuType.ContextMenu,
                        contextMenuTarget: ele,
                        enableRTL: this.model.enableRTL,
                        click: ej.proxy(this._contextMenuClick, this)
                    });
                    this._stateMaintenance();
                }
            }));
            this._on($(document), 'keydown', this._keyDownPress);
            this._on($(document), 'keyup', this._keyUpPress);
            this._on(this.element.find("a.e-linkPanel"), "click", ej.Pivot._editorLinkPanelClick);
			if (this.model.enableCellSelection) {
                this._on(this.element, "mousedown touchstart", ".value", this._initCellSelection);
                this._on(this.element, "click", ".colheader,.rowheader", this._headerClickCellSelection);
            }
            if (this.enableCellContext() == true) {
                if (document.addEventListener) {
                    document.removeEventListener('contextmenu', this._cellContext, false);
                    document.addEventListener('contextmenu', this._cellContext, false);
                }
                else {
                    document.detachEvent('oncontextmenu', this._cellContext);
                    document.attachEvent('oncontextmenu', this._cellContext);
                }
            }

            this._on(this.element, "mouseover", ".e-pivotButton", ej.proxy(function (evt) {
                if (this._isDragging) {
                    this.element.append(ej.buildTag("span.e-dropIndicator e-dropIndicatorActive")[0].outerHTML);
                    if (evt.target.className.indexOf("e-pivotButton") >= 0)
                        this.element.find(".e-dropIndicator").css("top", $(evt.target).position().top - 20).css("left", $(evt.target).position().left - 3);
                    else
                        this.element.find(".e-dropIndicator").css("top", $(evt.target).parents(".e-pivotButton").position().top - 20).css("left", $(evt.target).parents(".e-pivotButton").position().left - 3);
                }
            }, this));

            this._on(this.element, "mouseleave", ".e-pivotButton", ej.proxy(function (evt) {
                if (this._isDragging)
                    this.element.find(".e-dropIndicator").removeClass("e-dropIndicatorActive");
            }, this));

            this._on(this.element, "click", "#preventDiv", ej.proxy(function (evt) {
                if (this.element.find(".e-dialog.e-advancedFilterDlg:visible").length > 0) {
                    this.element.find(".e-dialog.e-advancedFilterDlg").hide();
                    this.element.find("#preventDiv").remove();
                }
            }, this));

            if (this.model.enableCellEditing) {
                this._on(this.element, "mousedown", ".value", this._initCellEditing)
            }
            this.drillDownHandler = $.proxy(this._drillDown, this);
            this.addHyperlinkHandler = $.proxy(this._addHyperlink, this);
            this.removeHyperlinkHandler = $.proxy(this._removeHyperlink, this);
            if (this.model.enableCellSelection) {
                $(document).on("click", this._clearSelection);
                $(document).on("keyup", this._endCellSelection);
                $(document).on("keydown", this._startCellSelection);
            }
            this._on(this.element, "mouseover", this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ".value .cellValue, .rowheader .cellValue, .colheader .cellValue" : ".value .cellValue, .rowheader .cellValue, .colheader .cellValue, .summary .cellValue", this.addHyperlinkHandler);
            this._on(this.element, "mouseleave", this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ".value, .rowheader, .colheader" : ".value .cellValue, .rowheader .cellValue, .colheader .cellValue, .summary .cellValue", this.removeHyperlinkHandler);
            this._on(this.element, "click", this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ".value .cellValue, .rowheader .cellValue, .colheader .cellValue" : ".value .cellValue, .rowheader .cellValue, .colheader .cellValue, .summary .cellValue", function (e) {
                if (e.target.className.indexOf("hyperlink") != -1) {
                    var cellPos = this._excelLikeJSONRecords != null && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? $(e.target.parentElement).attr('data-i') : $(e.target.parentElement).attr("data-p");
                    var rawdata = this._excelLikeJSONRecords != null && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? this._excelLikeJSONRecords[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + parseInt(cellPos.split(",")[1]))].Info : this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._excelRowCount) + parseInt(cellPos.split(",")[1]))].Info;
                    var cellInfo = {
                        cellValue: e.target.innerHTML,
                        cellPosition: cellPos,
                        cellType: e.target.parentElement.className.split(' ')[0],
                        uniqueName: rawdata.split('::')[0],
                        args: e,
                        rawdata: rawdata
                    };
                    if ((this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && e.target.parentElement.className.indexOf("summary") >= 0) || e.target.parentElement.className.indexOf("summary value") >= 0) {
                        if (!ej.isNullOrUndefined(this._pivotClientObj))
                            this._pivotClientObj._trigger("summaryCellHyperlinkClick", { element: this.element, customObject: this.model.customObject, args: cellInfo });
                        else
                            this._trigger("summaryCellHyperlinkClick", { element: this.element, customObject: this.model.customObject, args: cellInfo });
                    }
                    else if (e.target.parentElement.className.indexOf("value") >= 0) {
                        if (!ej.isNullOrUndefined(this._pivotClientObj))
                            this._pivotClientObj._trigger("valueCellHyperlinkClick", { element: this.element, customObject: this.model.customObject, args: cellInfo });
                        else
                            this._trigger("valueCellHyperlinkClick", { element: this.element, customObject: this.model.customObject, args: cellInfo });
                    }
                    else if (e.target.parentElement.className.indexOf("rowheader") >= 0) {
                        if (!ej.isNullOrUndefined(this._pivotClientObj))
                            this._pivotClientObj._trigger("rowHeaderHyperlinkClick", { element: this.element, customObject: this.model.customObject, args: cellInfo });
                        else
                            this._trigger("rowHeaderHyperlinkClick", { element: this.element, customObject: this.model.customObject, args: cellInfo });
                    }
                    else if (e.target.parentElement.className.indexOf("colheader") >= 0) {
                        if (!ej.isNullOrUndefined(this._pivotClientObj))
                            this._pivotClientObj._trigger("columnHeaderHyperlinkClick", { element: this.element, customObject: this.model.customObject, args: cellInfo });
                        else
                            this._trigger("columnHeaderHyperlinkClick", { element: this.element, customObject: this.model.customObject, args: cellInfo });
                    }
                    if (e.target.parentElement.className.indexOf("value") >= 0 && this.model.enableDrillThrough) {
                        this._rowHeader = []; this._colHeader = [];
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                            ej.Pivot._drillThroughCellClick(e, this);
                        else
                            this._cellRangeInfo(e);
                }
                }
            });
            this._on(this.element, "click", this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? ".rowheader, .colheader, .summary" : ".rowheader, .colheader", function (e) {
                if (this.model.enableCellSelection) {
                    if (!($(e.target).hasClass("cellValue") && $(e.target).hasClass("hyperlinkHeaderCell"))) {
                        var targetCell = $(e.target).hasClass("cellValue") ? e.target.parentElement : e.target;
                        if (e.shiftKey) {
                            window.getSelection().removeAllRanges();
                            $(this.element).find(".e-selected").removeClass("e-selected");
                            var selectedCellPos = $(this._selectedCell).attr('data-p'), targetCellPos = $(targetCell).attr('data-p');
                            if (($(targetCell).hasClass("rowheader") || $(targetCell).attr('role') == "rowheader") && ($(this._selectedCell).hasClass("rowheader") || $(this._selectedCell).attr('role') == "rowheader")) //|| 
                                for (var i = Math.min(selectedCellPos.split(',')[1], targetCellPos.split(',')[1]) ; i <= Math.max(selectedCellPos.split(',')[1], targetCellPos.split(',')[1]) ; i++)
                                    this.element.find("[data-p='" + selectedCellPos.split(',')[0] + "," + i + "']").addClass("e-selected");
                            if (($(targetCell).hasClass("colheader") || $(targetCell).attr('role') == "columnheader") && ($(this._selectedCell).hasClass("colheader") || $(this._selectedCell).attr('role') == "columnheader"))
                                for (var i = Math.min(selectedCellPos.split(',')[0], targetCellPos.split(',')[0]) ; i <= Math.max(selectedCellPos.split(',')[0], targetCellPos.split(',')[0]) ; i++)
                                    this.element.find("[data-p='" + i + "," + selectedCellPos.split(',')[1] + "']").addClass("e-selected");
                            var selectedCells = $(this.element).find(".e-selected");
                            if (selectedCells.length > 0) {
                                var selectedCellsInfo = new Array();
                                for (var i = 0; i < selectedCells.length; i++) {
                                    var cellPos = $(selectedCells[i]).attr('data-p');
                                    var cellInfo = this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + parseInt(cellPos.split(",")[1]))];
                                    cellInfo.Value = $.trim($(selectedCells[i]).text());
                                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) cellInfo["Field"] = this._getFieldName(selectedCells[i]);
                                    selectedCellsInfo.push(cellInfo);
                                }
                                if (!ej.isNullOrUndefined(this._pivotClientObj))
                                    this._pivotClientObj._trigger("cellSelection", selectedCellsInfo);
                                else
                                    this._trigger("cellSelection", { JSONRecords: selectedCellsInfo });
                            }
                        }
                        else {
                            if (!e.ctrlKey) $(this.element).find(".e-selected").removeClass("e-selected");
                            if ($(targetCell).hasClass("colheader") || $(targetCell).hasClass("rowheader") || $(targetCell).attr("role") == "rowheader" || $(targetCell).attr("role") == "columnheader") {
                                e.ctrlKey ? $(targetCell).toggleClass("e-selected") : $(targetCell).addClass("e-selected");
                                this._selectedCell = targetCell;
                                this._primaryCellPos = $(targetCell).attr('data-p');
                                var cellInfo = this.getJSONRecords()[parseInt((parseInt(this._primaryCellPos.split(",")[0]) * this._rowCount) + parseInt(this._primaryCellPos.split(",")[1]))];
                                cellInfo.Value = $.trim($(targetCell).text());
                                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) cellInfo["Field"] = this._getFieldName(targetCell);
                                if (!e.ctrlKey)
                                    if (!ej.isNullOrUndefined(this._pivotClientObj))
                                        this._pivotClientObj._trigger("cellSelection", { JSONRecords: [cellInfo] });
                                    else
                                        this._trigger("cellSelection", { JSONRecords: [cellInfo] });
                            }
                        }
                    }
                }
            });
            if (!ej.isNullOrUndefined(this._pivotClientObj)) {
                if (!this._pivotClientObj.model.enableDeferUpdate)
                    this._on(this.element, "click", "table .e-expand,table .e-collapse", ej.proxy(this._drillDown, this));
            }
            else
                this._on(this.element, "click", "table .e-expand,table .e-collapse", ej.proxy(this._drillDown, this));
            this._on(this.element, "mouseover", ".colheader, .rowheader, .e-expand, .e-collapse", function (evt) {
                if (evt.target.className.indexOf("e-expand") > -1 && !$(evt.target).hasClass("header-hover-expand"))
                    $(evt.target).addClass("header-hover-expand");
                else if (evt.target.className.indexOf("e-collapse") > -1 && !$(evt.target).hasClass("header-hover-collapse"))
                    $(evt.target).addClass("header-hover-collapse");
                else if ((evt.target.className.indexOf("e-expand") < 0 || evt.target.className.indexOf("e-collapse") < 0) && $(evt.target).children("span").length > 0) {
                    var child = $(evt.target).children("span")[0];
                    if (!$(child).hasClass("header-hover-expand") && child.className.indexOf("e-expand") > -1)
                        $(child).addClass("header-hover-expand");
                    else if (!$(child).hasClass("header-hover-collapse") && child.className.indexOf("e-collapse") > -1)
                        $(child).addClass("header-hover-collapse");
                }
            });
            this._on(this.element, "mouseleave", ".colheader, .rowheader, .e-expand, .e-collapse", function (evt) {
                this.element.find(".e-expand, .e-collapse").removeClass("header-hover-expand header-hover-collapse");
            });
            if (this.model.enableToolTip) {
                this._on(this.element, "mouseover", ".value", this._applyToolTip);
                this._on(this.element, "mouseleave", ".value", function (e) {
                    if(this.model.enableToolTipAnimation)
                        $("#" + this._id + "_gridTooltip").hide("slow");
                    else
                        $("#" + this._id + "_gridTooltip").hide();
                });
            }
			if (this.model.enableDrillThrough) {
                $.proxy(this._addHyperlink, this);
            }
            this._on(this.element, "click", ".filter", ej.proxy(this._filterBtnClick, this));
            this._on(this.element, "click", ".e-sorting", ej.proxy(this._sortBtnClick, this));
            this._on(this.element, "click", ".e-removeBtn", ej.proxy(this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? this._removePvtBtn : this._clientRemovePvtBtn, this));
            this._on(this.element, "click", ".e-ascOrder, .e-descOrder", ej.proxy(this._sortField, this));
            this._on(this.element, "mouseover", ".e-pvtBtn", function (evt) {
                $(evt.target.parentElement).addClass("e-btn e-select");
            });
            this._on(this.element, "mouseleave", ".e-pvtBtn", function (evt) {
                $(evt.target.parentElement).removeClass("e-btn e-select");
                $(evt.target).removeClass("e-hoverBtn");
            });
            this._on(this.element, "mouseover", ".e-pivotButton", function (evt) {
                evt.target.title = evt.target.textContent;
                $(evt.target).find("button").addClass("e-hoverBtn");
            });
            this._on(this.element, "mouseleave", ".e-pivotButton", function (evt) {
                $(evt.target).find("button").removeClass("e-hoverBtn");
            });
            this._on(this.element, "mouseover", ".filter,.e-sorting,.e-removeBtn", function (evt) {
                $(evt.target.parentElement).find("button").addClass("e-hoverBtn");
            });
            this._on(this.element, "mouseleave", ".filter,.e-sorting,.e-removeBtn", function (evt) {
                $(evt.target.parentElement).find("button").removeClass("e-hoverBtn");
            });
            this._on(this.element, "mouseleave", ".value,.rowheader,.colheader,.summary", ej.proxy(function (evt) {
                var val = $(evt.target).find(".cellValue").contents().filter(function () { return this.nodeType == 3; });
                if (val.text() != 0) {
                    var isSort = $(evt.target).find(".valueSorting").length > 0 ? true : false;
                    var sorting = isSort ? $(evt.target).find(".valueSorting") : "";
                    $(evt.target).find(".valueSorting").remove()
                    $(evt.target).find(".cellValue").remove();
                    $(evt.target).append(val.text());
                    isSort && ($(evt.target).hasClass("colheader") || $(evt.target).hasClass("summary")) && $(evt.target).hasClass("calc") && (!$(evt.target).hasClass("rowheader")) ? $(evt.target).append(sorting) : "";
                }
            }));

            this._on(this.element, "click", ".e-close", ej.proxy(function (evt) {
                this.element.find("#preventDiv").remove();
            }));

            this._on(this.element, "click", ".e-dialogOkBtn", ej.proxy(this._dialogOKBtnClick, this));

            if (this.model.enableContextMenu || ($(this.element).parents(".e-pivotclient").length > 0 && this._pivotClientObj.model.enableToolBar&& !this._pivotClientObj.model.displaySettings.enableFullScreen)) {

                this._on(this.element, "click", ".e-cellSelect", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-columnResize", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-excelLikeLayout", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-advancedFiltering", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-toolTip", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-collapseByDefault", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".rtl", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-calculatedField", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-cellEditing", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-conditionalFormat", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-summaryCustomize", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-summaryTypes", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-numberFormatting", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-rowHeaderHyperLink", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-colHeaderHyperLink", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-valueCellHyperLink", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-summaryCellHyperLink", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-rowFreeze", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-colFreeze", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-excel", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-word", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-pdf", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".csv", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-normalLayout", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-normalTopSummaryLayout", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-noSummariesLayout", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-drillThrough", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".groupingBar", ej.proxy(this._contextMenuClick, this));
                this._on(this.element, "click", ".e-frozenHeaders", ej.proxy(this._createMenuIcons, this));
                this._on(this.element, "click", ".e-exporting", ej.proxy(this._createMenuIcons, this));
                this._on(this.element, "click", ".e-hyperlinkOptions", ej.proxy(this._createMenuIcons, this));
                this._on(this.element, "click", ".e-layouts", ej.proxy(this._createMenuIcons, this));
                $(document).click(function (e) {
                    if (e.target.className.indexOf('e-hyperlinkOptions') == -1)
                        $(".e-hyperLinkDialog").remove();
                    if (e.target.className.indexOf('e-exporting') == -1)
                        $(".e-exportDialog").remove();
                    if (e.target.className.indexOf('e-frozenHeaders') == -1)
                        $(".e-frozenDialog").remove();
                    if (e.target.className.indexOf('e-layouts') == -1)
                        $(".e-layoutsDialog").remove();
                });
            }
            this._on(this.element, "click", ".e-dialogCancelBtn", ej.proxy(function (evt) {
                this.element.find(".e-dialog, .e-clientDialog").hide();
                $("#preventDiv").remove();
            }));
            if (this.model.enableColumnResizing) {
                this._on(this.element, "mousemove", ej.proxy(function (evt) {
                    this._colResizing(evt);
                }));
                this._on(this.element, "mousedown", "thead,.pivotGridFrozenTable,.pivotGridColValueTable", ej.proxy(function (evt) {
                    this._startColResizing(evt);
                }));
                this._on(this.element, "mouseup", ".e-reSizeColbg",ej.proxy(function (evt) {
                    this._endColResizing(evt);
                }));
            }
            this._on(this.element, "click", ".e-nextPage, .e-prevPage, .e-firstPage, .e-lastPage", ej.proxy(this._navigateTreeData, this));
            this._on(this.element, "click", ".e-searchEditorTree", ej.proxy(function (evt) {
                ej.Pivot._searchEditorTreeNodes(evt, this);
            }, this));
            this._on(this.element, "click", ".colheader,.cstot,.cgtot,.calc,.stot,.gtot", ej.proxy(function (evt) {
                if ($(evt.target).hasClass("e-collapse") || ($(evt.target).hasClass("e-expand")))
                    return false;
                if (!ej.isNullOrUndefined(this.model.valueSortSettings) && !ej.isNullOrUndefined(this.model.valueSortSettings.sortOrder) && this.model.valueSortSettings.sortOrder != "none" && (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && ((this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && this.model.dataSource.values.length > 0) || (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && JSON.parse(this.getOlapReport()).PivotCalculations.length > 0)))) {
                    var sort = this.model.valueSortSettings.sortOrder;
                    var ele = $(evt.target).hasClass("cellValue") || $(evt.target).hasClass("valueSorting") || $(evt.target).hasClass("e-expand") || $(evt.target).hasClass("e-collapse") ? $(evt.target).parent() : $(evt.target);
                    if (!ele.hasClass("calc")) {
                        ele = $(this.element).find("[data-p='" + (Number(ele.attr("data-p").split(',')[0]) + Number(ele.attr("colspan")) - 1) + "," + (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? this.model.dataSource.columns.length : JSON.parse(this.getOlapReport()).PivotColumns.length) + "']")[0];
                    }
                    sort = $(ele).find(".valueSorting").length > 0 ? $(ele).find(".valueSorting").hasClass("descending") ? "ascending" : "descending" : sort;
                    this.element.find(".valueSorting").remove();
                    if ($(ele).find(".valueSorting").length == 0 && !$(ele).hasClass("rowheader")) {
                        var sorting = ej.buildTag("span.valueSorting e-icon " + sort).css("margin-left", "5px").attr("role", "button").attr("aria-label", "sort")[0].outerHTML;
                        $(ele).append(sorting);
                    }
                    else {
                        $(ele).find(".valueSorting").removeClass("ascending").removeClass("descending").addClass(sort);
                    }
                    var serializedCustomObject = JSON.stringify(this.model.customObject);
                    ej.PivotAnalysis._valueSorting = Number($(ele).attr("data-p").split(',')[0]);
                    ej.PivotAnalysis._sort = sort;
                    this._waitingPopup = !ej.isNullOrUndefined(this._pivotClientObj) ? this._pivotClientObj.element.data("ejWaitingPopup") : this.element.data("ejWaitingPopup");
                    if (!ej.isNullOrUndefined(this._waitingPopup))
                        this._waitingPopup.show();
                    if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                        this.refreshControl();
                        if (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj.displayMode() != "gridOnly") {
                            this._pivotClientObj._pivotChart._labelCurrentTags.expandedMembers = null;
                            this._pivotClientObj._pivotChart.setPivotEngine(this._pivotEngine.pivotEngine);
                            this._pivotClientObj._pivotChart._generateData(this._pivotEngine.pivotEngine);
                            this._pivotEngine = null;
                        }
                    }
                    else {
                        var hText = "";
                        for (var i = 0; i < this.getJSONRecords().length ; i++) {
                            if (Number(this.getJSONRecords()[i].Index.split(",")[0]) == ej.PivotAnalysis._valueSorting && Number(this.getJSONRecords()[i].Index.split(",")[1]) < (JSON.parse(this.getOlapReport()).PivotColumns.length + 1)) {
                                hText = hText == "" ? (this.getJSONRecords()[i].Value.indexOf(".") == -1 ? this.getJSONRecords()[i].Value : this.getJSONRecords()[i].Value.split(".")[1]) : hText + this.model.valueSortSettings.headerDelimiters + (this.getJSONRecords()[i].Value.indexOf(".") == -1 ? this.getJSONRecords()[i].Value : this.getJSONRecords()[i].Value.split(".")[1]);
                            }
                        }
                        this.model.valueSortSettings.index = ej.PivotAnalysis._valueSorting;
                        this.model.valueSortSettings.headerText = hText;
                        this.model.valueSortSettings.sortOrder = sort;
                        if (!ej.isNullOrUndefined(this._pivotClientObj))
                            this._pivotClientObj.doAjaxPost("POST", this._pivotClientObj.model.url + "/" + this._pivotClientObj.model.serviceMethodSettings.valueSorting, JSON.stringify({ "action": "valueSorting", "valueSorting": JSON.stringify(this.model.valueSortSettings), "currentReport": JSON.parse(this._pivotClientObj.getOlapReport()).Report, "customObject": serializedCustomObject }), this._pivotClientObj._renderControlSuccess);
                        else
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.valueSorting, JSON.stringify({ "action": "valueSorting", "valueSorting": JSON.stringify(this.model.valueSortSettings), "currentReport": JSON.parse(this.getOlapReport()).Report, "customObject": serializedCustomObject }), this._renderControlSuccess);
                        delete this.model.valueSortSettings["index"];
                    }
                    if (!ej.isNullOrUndefined(this._pivotClientObj))
                        this._pivotClientObj.model.valueSortSettings = this.model.valueSortSettings;
                }
            }));
        },
        _navigateTreeData: function (args) {
            ej.Pivot.editorTreeNavigatee(args, this);
        },
        _stateMaintenance: function () {
            var enabledState = ej.buildTag("span.e-enabledState").addClass("e-icon").attr("aria-label", this._getLocalizedLabels("EnabledState"))[0].outerHTML;
            if (this.model.dataSource.enableAdvancedFilter) {
                if (this.element.parents(".e-pivotclient").length > 0)
                    $(".e-advancedFiltering").addClass("e-enabled");
                    else
                    $(".e-advancedFiltering a:eq(0)").append(enabledState);
            }
            if (this.model.enableDrillThrough) {
                $(".e-drillThrough a:eq(0)").append(enabledState);
                $("#" + this._id + "contextMenu").ejMenu("disableItem", this._getLocalizedLabels("CellEditing"));
            }
            if (this.element.parents(".e-pivotclient").length > 0 && this._pivotClientObj.model.enableDrillThrough) {
                this.element.find(".e-drillThrough").addClass("e-enabled");
               this.element.find(".toolBar").ejToolbar("disableItemByID", "cellEditing");
            }
            if (this.model.enableToolTip && !this.model.frozenHeaderSettings.enableFrozenRowHeaders && !this.model.frozenHeaderSettings.enableFrozenColumnHeaders) {
                if (this.element.parents(".e-pivotclient").length > 0)
                    $(".e-toolTip").addClass("e-enabled");
                else
                    $(".e-toolTip a:eq(0)").append(enabledState);
            }
            if (this.model.enableCellSelection) {
                $(".e-cellSelect a:eq(0)").append(enabledState);
                $("#"+this._id+"contextMenu").ejMenu("disableItem", this._getLocalizedLabels("CellEditing"));
            }
            if (this.model.enableColumnResizing) {
                if (this.element.parents(".e-pivotclient").length > 0)
                {
                    $(".e-columnResize").addClass("e-enabled");
                    $(".toolBar").ejToolbar("disableItemByID", "collapseByDefault");
                }
                else {
                    $(".e-columnResize a:eq(0)").append(enabledState);
                    $("#" + this._id + "contextMenu").ejMenu("disableItem", this._getLocalizedLabels("CollapseByDefault"));
                }
            }
            if (this.model.enableGroupingBar)
                $(".groupingBar a:eq(0)").append(enabledState);
            if (this.model.enableRTL) {
                if (this.element.parents(".e-pivotclient").length > 0)
                    $(".rtl").addClass("e-enabled");
                else
                    $(".rtl a:eq(0)").append(enabledState);
            }
            if (this.model.enableCollapseByDefault) {
                if (this.element.parents(".e-pivotclient").length > 0) {
                        $(".toolBar").ejToolbar("disableItemByID", "columnResize");
                        $(".e-collapseByDefault").addClass("e-enabled");
                }
                else {
                    $("#"+this._id+"contextMenu").ejMenu("disableItem", this._getLocalizedLabels("ColumnResize"));
                    $("#"+this._id+"contextMenu").ejMenu("disableItem", this._getLocalizedLabels("FrozenHeader"));
                       $(".e-collapseByDefault a:eq(0)").append(enabledState);
                }
             }
            if (this.model.enableCellEditing) {
                if (this.element.parents(".e-pivotclient").length > 0)
                {
                    this.element.find(".e-cellEditing").addClass("e-enabled");
                    this.element.find(".toolBar").ejToolbar("disableItemByID", "drillThrough");
                }
                else
                    $(".e-cellEditing a:eq(0)").append(enabledState);
                $("#" + this._id + "contextMenu").ejMenu("disableItem", this._getLocalizedLabels("DrillThrough"));
                $("#"+this._id+"contextMenu").ejMenu("disableItem", this._getLocalizedLabels("CellSelection"));
            }
            if (this.model.frozenHeaderSettings.enableFrozenRowHeaders)
                $("li#row a:eq(0)").append(enabledState);
            if (this.model.frozenHeaderSettings.enableFrozenColumnHeaders)
                $("li#column a:eq(0)").append(enabledState);
            if (this.model.hyperlinkSettings.enableRowHeaderHyperlink)
                $("li#rowHeader a:eq(0)").append(enabledState);
            if (this.model.hyperlinkSettings.enableColumnHeaderHyperlink)
               $("li#columnHeader a:eq(0)").append(enabledState);
            if (this.model.hyperlinkSettings.enableValueCellHyperlink)
               $("li#valueCell a:eq(0)").append(enabledState);
            if (this.model.hyperlinkSettings.enableSummaryCellHyperlink)
                $("li#summaryCell a:eq(0)").append(enabledState);
            if (this.model.layout==ej.PivotGrid.Layout.Normal)
                $("li#normalLayout a:eq(0)").append(enabledState);
            if (this.model.layout == ej.PivotGrid.Layout.NoSummaries)
                $("li#noSummariesLayout a:eq(0)").append(enabledState);
            if (this.model.layout == ej.PivotGrid.Layout.ExcelLikeLayout)
                $("li#excelLikeLayout a:eq(0)").append(enabledState);
            if (this.model.layout == ej.PivotGrid.Layout.NormalTopSummary)
                $("li#normalTopSummaryLayout a:eq(0)").append(enabledState);
            if (this.model.layout == ej.PivotGrid.Layout.NormalTopSummary || this.model.layout == ej.PivotGrid.Layout.ExcelLikeLayout || this.model.layout == ej.PivotGrid.Layout.NoSummaries || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders)
            {
                if (this.element.parents(".e-pivotclient").length > 0)
                    $(".toolBar").ejToolbar("disableItemByID", "summaryCustomize");
                else
                    $("#"+this._id+"contextMenu").ejMenu("disableItem", this._getLocalizedLabels("SummaryCustomization"));
            }
        },
        _contextMenuClick: function (evt) {
            var enabledState = ej.buildTag("span.e-enabledState").addClass("e-icon").attr("aria-label", "")[0].outerHTML;
            var selectedMenuItem = this.element.parents(".e-pivotclient").length > 0 ? $(evt.target) : $(evt.element);
            if ($(evt.element).hasClass("e-numberFormatting") || $(evt.target).hasClass("e-numberFormatting"))
                this._createMenuDialog(evt);
            if ($(evt.element).hasClass("e-cellSelect") || $(evt.target).hasClass("e-cellSelect")) {
                this.model.enableCellSelection = !this.model.enableCellSelection;
                this.model.enableCellEditing = false;
                this.renderControlFromJSON();
            }
            if (($(evt.element).hasClass("e-columnResize") || $(evt.target).hasClass("e-columnResize"))&& (!this.model.enableCollapseByDefault)) {
                this.model.enableColumnResizing = !this.model.enableColumnResizing;
                this.renderControlFromJSON();
            }
            if ($(evt.element).hasClass("e-toolTip") || $(evt.target).hasClass("e-toolTip")) {
                this.model.enableToolTip = !this.model.enableToolTip;
                this.renderControlFromJSON();
            }
            if (($(evt.element).hasClass("e-collapseByDefault") || $(evt.target).hasClass("e-collapseByDefault")) && !this.model.enableColumnResizing && !this.model.enableFrozenColumnHeaders && !this.model.enableFrozenRowHeaders) {
                if (this.model.enableCollapseByDefault) {
                    this.model.enableCollapseByDefault = false;
                }
                else {
                    this.model.enableCollapseByDefault = true;
                    this.model.collapsedMembers = null;
                }
                this.renderControlFromJSON();
            }
            if ($(evt.element).hasClass("rtl") || $(evt.target).hasClass("rtl")) {
                this.model.enableRTL = !this.model.enableRTL;
                this.renderControlFromJSON();
            }
            if ($(evt.element).hasClass("e-calculatedField") || $(evt.target).hasClass("e-calculatedField")) {
                this._createCalculatedField();
            }
            if ($(evt.element).hasClass("e-cellEditing") || $(evt.target).hasClass("e-cellEditing")) {
                this.model.enableCellEditing = !this.model.enableCellEditing;
                this.model.enableDrillThrough = false;
                this.model.enableCellSelection = false;
                this.renderControlFromJSON();
            }
            if ($(evt.element).hasClass("e-drillThrough") || $(evt.target).hasClass("e-drillThrough")) {
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    dialogTitle = "Cube Configuration";
                    dialogContent = "<p>" + "Please configure cube" + "!</p>";
                    var ejDialog = ej.buildTag("div#clientDialog.e-clientDialog", { "opacity": "1" }).attr("title", dialogTitle)[0].outerHTML;
                    $(ejDialog).appendTo("#" + this._id);
                    $(dialogContent).appendTo(this.element.find(".e-clientDialog"));
                    this.element.find(".e-clientDialog").ejDialog({ enableRTL: this.model.enableRTL, width: 200, target: "#" + this._id, enableResize: false, close: ej.proxy(ej.Pivot.closePreventPanel, this) });
                  }
                else {
                    if (this.element.parents(".e-pivotclient").length > 0) {
                        this._pivotClientObj.model.enableDrillThrough = !this._pivotClientObj.model.enableDrillThrough;
                        this.model.enableDrillThrough = this._pivotClientObj.model.enableDrillThrough;
                        this.model.enableCellEditing = false;
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode)
                            this.renderControlFromJSON();
                        else
                            this._pivotClientObj._load();
                    }
                    else {
                        this.model.enableDrillThrough = !this.model.enableDrillThrough;
                        this.model.enableCellEditing = false;
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode)
                            this.renderControlFromJSON();
                        else
                            this._load();
                    }
                }
                
            }
            if ($(evt.element).hasClass("e-summaryCustomize") || $(evt.target).hasClass("e-summaryCustomize")) {
                this._createMenuDialog(evt);
            }
            if ($(evt.element).hasClass("e-conditionalFormat") || $(evt.target).hasClass("e-conditionalFormat")) {
                if (this.element.parents(".e-pivotclient").length > 0) {
                    if (this._pivotClientObj.model.operationalMode == "clientmode")
                        this.setOlapReport(this._pivotClientObj.model.dataSource);
             }
                this.model.enableConditionalFormatting = true;
                this.openConditionalFormattingDialog();
				ej.Pivot.closePreventPanel(this);
            }
            if ($(evt.element).hasClass("e-summaryTypes") || $(evt.target).hasClass("e-summaryTypes")) {
                this._createMenuDialog(evt);
            }
            if ($(evt.element).hasClass("e-advancedFiltering") || $(evt.target).hasClass("e-advancedFiltering")) {
                this.model.dataSource.enableAdvancedFilter = !this.model.dataSource.enableAdvancedFilter;
                this.renderControlFromJSON();
            }
            if ($(evt.element).hasClass("groupingBar")) {
                this.model.enableGroupingBar = !this.model.enableGroupingBar;
                this.renderControlFromJSON();
            }
            if ((evt.element != "undefined" && evt.parentText == this._getLocalizedLabels("Layouts")) || $(evt.target).parents().hasClass("e-layoutsDialog")) {
                if (evt.ID == "normalLayout" || $(evt.target).hasClass("e-normalLayout"))
                {
                    this.model.layout=ej.PivotGrid.Layout.Normal;
                    if(this.element.parents(".e-pivotclient").length > 0) this._pivotClientObj.model.gridLayout = "normal";
                 }
                if (evt.ID == "excelLikeLayout" || $(evt.target).hasClass("e-excelLikeLayout")) {
                    this.model.layout = ej.PivotGrid.Layout.ExcelLikeLayout;
                    if (this.element.parents(".e-pivotclient").length > 0)
                        this._pivotClientObj.model.gridLayout = "excellikelayout";
                }
                if (evt.ID == "noSummariesLayout" || $(evt.target).hasClass("e-noSummariesLayout")) {
                    this.model.layout = ej.PivotGrid.Layout.NoSummaries;
                    if (this.element.parents(".e-pivotclient").length > 0)
                        this._pivotClientObj.model.gridLayout = "nosummaries";
                }
                if (evt.ID == "normalTopSummaryLayout" || $(evt.target).hasClass("e-normalTopSummaryLayout")) {
                    this.model.layout = ej.PivotGrid.Layout.NormalTopSummary;
                    if (this.element.parents(".e-pivotclient").length > 0)
                        this._pivotClientObj.model.gridLayout = "normaltopsummary";
                }
                if(evt.ID == "excelLikeLayout" || $(evt.target).hasClass("e-excelLikeLayout"))
                    this.excelLikeLayout(this.getJSONRecords());
                else
                {
                    this._excelLikeJSONRecords = null;
                    this.refreshPivotGrid();
                }

            }
            if ((evt.element != "undefined" && evt.parentText == this._getLocalizedLabels("HyperLink")) || $(evt.target).parents().hasClass("e-hyperLinkDialog")) {
                if (evt.ID == "rowHeader" || $(evt.target).hasClass("e-rowHeaderHyperLink"))
                    this.model.hyperlinkSettings.enableRowHeaderHyperlink = !this.model.hyperlinkSettings.enableRowHeaderHyperlink;
               if (evt.ID == "columnHeader" || $(evt.target).hasClass("e-colHeaderHyperLink"))
                   this.model.hyperlinkSettings.enableColumnHeaderHyperlink = !this.model.hyperlinkSettings.enableColumnHeaderHyperlink;
               if (evt.ID == "valueCell" || $(evt.target).hasClass("e-valueCellHyperLink")) 
                    this.model.hyperlinkSettings.enableValueCellHyperlink = !this.model.hyperlinkSettings.enableValueCellHyperlink;
               if (evt.ID == "summaryCell" || $(evt.target).hasClass("e-summaryCellHyperLink"))
                    this.model.hyperlinkSettings.enableSummaryCellHyperlink = !this.model.hyperlinkSettings.enableSummaryCellHyperlink;
              
               this.renderControlFromJSON();
            }

            if ((evt.element != undefined && evt.parentText == this._getLocalizedLabels("Exporting")) || $(evt.target).parents().hasClass("e-exportDialog")) {
                var selectedValue = this.element.parents(".e-pivotclient").length > 0 ? $(evt.target).attr("class").split(" ")[0] : evt.ID;
                if (this.element.parents(".e-pivotclient").length > 0 && !ej.isNullOrUndefined(this._pivotClientObj))
                    this.model.beforeExport = this._pivotClientObj.model.beforeExport;
               this.exportPivotGrid(selectedValue, "Sample");
            }
            if (((evt.element != undefined && evt.parentText == this._getLocalizedLabels("FrozenHeader")) || $(evt.target).parents().hasClass("e-frozenDialog"))) {
                if (evt.ID == "row" || $(evt.target).hasClass("e-rowFreeze")) {
                    if (this.model.frozenHeaderSettings.enableFrozenRowHeaders)
                        this.model.frozenHeaderSettings.enableFrozenRowHeaders = false;
                    else
                        this.model.frozenHeaderSettings.enableFrozenRowHeaders = true;
                }
                if (evt.ID == "column" || $(evt.target).hasClass("e-colFreeze")) {
                    if (this.model.frozenHeaderSettings.enableFrozenColumnHeaders)
                        this.model.frozenHeaderSettings.enableFrozenColumnHeaders = false
                    else
                        this.model.frozenHeaderSettings.enableFrozenColumnHeaders = true;
                }
                this.renderControlFromJSON();
            }
            this._unWireEvents();
            this._wireEvents();
        },
        
        _createMenuIcons: function (evt) {
            if ($(evt.target).hasClass("e-exporting")) {
                var exportDlg = ej.buildTag("div.e-exportDialog#exportDialog", ej.buildTag("table", ej.buildTag("tbody", ej.buildTag("tr",
                       ej.buildTag("td", ej.buildTag("div.e-excel e-exportingIcons").attr({ "aria-label": this._getLocalizedLabels("Excel"), "title": this._getLocalizedLabels("Excel"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                       ej.buildTag("td", ej.buildTag("div.e-word e-exportingIcons").attr({ "aria-label": this._getLocalizedLabels("Word"), "title": this._getLocalizedLabels("Word"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                       ej.buildTag("td", ej.buildTag("div.e-pdf e-exportingIcons").attr({ "aria-label": this._getLocalizedLabels("PDF"), "title": this._getLocalizedLabels("PDF"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                       ej.buildTag("td", ej.buildTag("div.csv e-exportingIcons").attr({ "aria-label": this._getLocalizedLabels("CSV"), "title": this._getLocalizedLabels("CSV"), tabindex: 0 })[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML;
                if (this.element.find("div .e-exportDialog").length == 0) {
                    $(exportDlg).appendTo(this.element);
                    $(".e-exportDialog").css("left", evt.target.offsetLeft + 20 + "px").css("top", (evt.target.offsetTop + 15) + "px");
                }
            }
            if ($(evt.target).hasClass("e-hyperlinkOptions")) {
                var hyperLinkDlg = ej.buildTag("div.e-hyperLinkDialog#hyperLinkTypesDialog", ej.buildTag("table", ej.buildTag("tbody", ej.buildTag("tr",
                       ej.buildTag("td", ej.buildTag("div.e-rowHeaderHyperLink e-hyperLinkIcons").attr({ "aria-label": this._getLocalizedLabels("EnableRowHeaderHyperlink"), "title": this._getLocalizedLabels("EnableRowHeaderHyperlink"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                       ej.buildTag("td", ej.buildTag("div.e-colHeaderHyperLink e-hyperLinkIcons").attr({ "aria-label": this._getLocalizedLabels("EnableColumnHeaderHyperlink"), "title": this._getLocalizedLabels("EnableColumnHeaderHyperlink"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                       ej.buildTag("td", ej.buildTag("div.e-valueCellHyperLink e-hyperLinkIcons").attr({ "aria-label": this._getLocalizedLabels("EnableValueCellHyperlink"), "title": this._getLocalizedLabels("EnableValueCellHyperlink"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                       ej.buildTag("td", ej.buildTag("div.e-summaryCellHyperLink e-hyperLinkIcons").attr({ "aria-label": this._getLocalizedLabels("EnableSummaryCellHyperlink"), "title": this._getLocalizedLabels("EnableSummaryCellHyperlink"), tabindex: 0 })[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML);
                if (this.element.find('div.e-hyperLinkDialog').length == 0) {
                    $(hyperLinkDlg).appendTo(this.element);
                    $(hyperLinkDlg).css("left", evt.target.offsetLeft + 20 + "px").css("top", (evt.target.offsetTop +15) + "px");
                    if (this.model.hyperlinkSettings.enableRowHeaderHyperlink)
                        this.element.find(".e-rowHeaderHyperLink").addClass("e-enabled");
                    if (this.model.hyperlinkSettings.enableColumnHeaderHyperlink)
                        this.element.find(".e-colHeaderHyperLink").addClass("e-enabled");
                    if (this.model.hyperlinkSettings.enableValueCellHyperlink)
                        this.element.find(".e-valueCellHyperLink").addClass("e-enabled");
                    if (this.model.hyperlinkSettings.enableSummaryCellHyperlink)
                        this.element.find(".e-summaryCellHyperLink").addClass("e-enabled");
                }
            }
            if ($(evt.target).hasClass("e-frozenHeaders")) {
                var frozenDlg = ej.buildTag("div.e-frozenDialog#frozenDialog", ej.buildTag("table", ej.buildTag("tbody", ej.buildTag("tr",
                 ej.buildTag("td", ej.buildTag("div.e-rowFreeze e-frozenHeaderIcons").attr({ "aria-label": this._getLocalizedLabels("Row"), "title": this._getLocalizedLabels("Row"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                 ej.buildTag("td", ej.buildTag("div.e-colFreeze e-frozenHeaderIcons").attr({ "aria-label": this._getLocalizedLabels("Column"), "title": this._getLocalizedLabels("Column"), tabindex: 0 })[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML;
                   if (this.element.find("div.e-frozenDialog").length == 0) {
                    $(frozenDlg).appendTo(this.element);
                    $(".e-frozenDialog").css("left", evt.target.offsetLeft + 20 + "px").css("top", (evt.target.offsetTop +15) + "px");
                    if (this.model.frozenHeaderSettings.enableFrozenRowHeaders)
                        this.element.find(".e-rowFreeze").addClass("e-enabled");
                    if (this.model.frozenHeaderSettings.enableFrozenColumnHeaders)
                        this.element.find(".e-colFreeze").addClass("e-enabled");
                    if (this.model.frozenHeaderSettings.enableFrozenHeaders)
                        this.element.find(".bothFreeze").addClass("e-enabled");
                }
            }
            if ($(evt.target).hasClass("e-layouts")) {
                var layoutsDialog = ej.buildTag("div.e-layoutsDialog#layoutsDialog", ej.buildTag("table", ej.buildTag("tbody", ej.buildTag("tr",
                       ej.buildTag("td", ej.buildTag("div.e-normalLayout e-layoutIcons").attr({ "aria-label": this._getLocalizedLabels("NormalLayout"), "title": this._getLocalizedLabels("NormalLayout"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                       ej.buildTag("td", ej.buildTag("div.e-excelLikeLayout e-layoutIcons").attr({ "aria-label": this._getLocalizedLabels("ExcelLikeLayout"), "title": this._getLocalizedLabels("ExcelLikeLayout"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                       (this.model.analysisMode==ej.Pivot.AnalysisMode.Olap?ej.buildTag("td", ej.buildTag("div.e-noSummariesLayout e-layoutIcons").attr({ "aria-label": this._getLocalizedLabels("NoSummaries"), "title": this._getLocalizedLabels("NoSummaries"), tabindex: 0 })[0].outerHTML)[0].outerHTML:"") +
					   (this.model.analysisMode==ej.Pivot.AnalysisMode.Olap && this.model.operationalMode==ej.Pivot.OperationalMode.ServerMode?ej.buildTag("td", ej.buildTag("div.e-normalTopSummaryLayout e-layoutIcons").attr({ "aria-label": this._getLocalizedLabels("NormalTopSummary"), "title": this._getLocalizedLabels("NormalTopSummary"), tabindex: 0 })[0].outerHTML)[0].outerHTML:""))[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML;
                if (this.element.find("div .e-layoutsDialog").length == 0) {
                    $(layoutsDialog).appendTo(this.element);
                    $(".e-layoutsDialog").css("left", evt.target.offsetLeft + 20 + "px").css("top", (evt.target.offsetTop + 15) + "px");
                    if (this.model.layout==ej.PivotGrid.Layout.Normal)
                        this.element.find(".e-normalLayout").addClass("e-enabled");
                    if (this.model.layout == ej.PivotGrid.Layout.ExcelLikeLayout)
                        this.element.find(".e-excelLikeLayout").addClass("e-enabled");
                    if (this.model.layout == ej.PivotGrid.Layout.NoSummaries)
                        this.element.find(".e-noSummariesLayout").addClass("e-enabled");
                    if (this.model.layout == ej.PivotGrid.Layout.NormalTopSummary)
                        this.element.find(".e-normalTopSummaryLayout").addClass("e-enabled");
                }
            }
        },
        _createMenuDialog: function (evt) {
            this._dialogName = !ej.isNullOrUndefined(evt.target) ? $(evt.target).attr("class").split(" ")[0] : $(evt.element).attr("class").split(" ")[0];
            ej.Pivot.openPreventPanel(this);
            this.element.find(".e-dialog").remove();
            var ejDialog = ej.buildTag("div#clientDialog.e-clientDialog", { "opacity": "1" })[0].outerHTML;
            var dialogTitle = currentTag = dialogContent = "";
            if ($(evt.target).hasClass("e-numberFormatting") || $(evt.element).hasClass("e-numberFormatting")) {
                dialogTitle = this._getLocalizedLabels("NumberFormatting");
                currentTag = "Number Formatting";
                var measure = ej.buildTag("label", this._getLocalizedLabels("Measures"))[0].outerHTML;
                var measureList = "<select id='measureOption'>";
                for (var i = 0; i < this.model.dataSource.values.length; i++) {
                    measureList += "<option>" + this.model.dataSource.values[i].fieldName + "</option>";
                }
                measureList += "</select>";
                var format = ej.buildTag("label", this._getLocalizedLabels("NumberFormats"))[0].outerHTML;
                var numberformatting = "<div class='summarTypes'><select id='numberFormatOption'><option value='Decimal'>Decimal</option><option value='Currency'>Currency</option><option value='Percentage'>Percentage</option><option value='Number'>Number</option><option value='Date'>Date</option><option value='Time'>Time</option><option value='Scientific'>Scientific</option><option value='Fraction'>Fraction</option></select></div>";
                dialogContent = ej.buildTag("div#reportDlg.e-reportDlg", "<table><tr><td>" + measure + "</td><td>" + measureList + "</td></tr><tr><td>" + format + "</td><td>" + numberformatting + "</td></tr></table>")[0].outerHTML;
            }
            if ($(evt.target).hasClass("e-summaryCustomize") || $(evt.element).hasClass("e-summaryCustomize")) {
                dialogTitle = this._getLocalizedLabels("SummaryCustomization");
                var label1 = ej.buildTag("label", this._getLocalizedLabels("HideGrandTotal"))[0].outerHTML;
                var label2 = ej.buildTag("label", this._getLocalizedLabels("HideSubTotal"))[0].outerHTML;
                var measureList = "<div class='measures'><select id='hideSubTotal'>";
                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                    for (var i = 0; i < this.model.dataSource.columns.length; i++) {
                        measureList += "<option>" + this.model.dataSource.columns[i].fieldCaption + "</option>";
                    }
                    for (var i = 0; i < this.model.dataSource.rows.length; i++) {
                        measureList += "<option>" + this.model.dataSource.rows[i].fieldCaption + "</option>";
                    }
                }
                else if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    var olapReport = $(this.element).parents(".e-pivotclient").length > 0 ? this._pivotClientObj.getOlapReport() : this.getOlapReport();
                    for (var i = 0; i < (JSON.parse(olapReport).PivotRows).length; i++) {
                        measureList += "<option>" + (JSON.parse(olapReport).PivotRows[i].FieldName) + "</option>";
                    }
                    for (var i = 0; i < (JSON.parse(olapReport).PivotColumns).length; i++) {
                        measureList += "<option>" + (JSON.parse(olapReport).PivotColumns[i].FieldName) + "</option>";
                    }
                }
                measureList += "</div>";
                var rowGrndRadio = ej.buildTag("input#rowSumCheckBox.rowSumCheckBox", "", {}, { name: 'row', type: 'checkbox', tabindex: 0 })[0].outerHTML + " " + ej.buildTag("label.rowGrndlabel", this._getLocalizedLabels("Row"))[0].outerHTML + "<br/>";
                var colGrndRadio = ej.buildTag("input#colSumCheckBox.colSumCheckBox", "", {}, { name: 'column', type: 'checkbox', tabindex: 0 })[0].outerHTML + " " + ej.buildTag("label.colGrndlabel", this._getLocalizedLabels("Column"))[0].outerHTML + "<br/>";
                var bothGrndRadio = ej.buildTag("input#bothSumCheckBox.bothSumCheckBox", "", {}, { name: 'both', type: 'checkbox', tabindex: 0 })[0].outerHTML + " " + ej.buildTag("label.bothGrndlabel", this._getLocalizedLabels("Both"))[0].outerHTML + "<br/>";
                if (this.model.analysisMode == "pivot")
                    dialogContent = ej.buildTag("div#customizeDlg.customizeDlg", "<table><tr><td style='vertical-align:top'>" + label1 + "</td><td>" + rowGrndRadio + colGrndRadio + bothGrndRadio + "</td></tr><tr><td>" + label2 + "</td><td>" + measureList + "</td></tr></table>")[0].outerHTML;
                else
                    dialogContent = ej.buildTag("div#customizeDlg.customizeDlg", "<table><tr><td>" + label1 + "</td><td>" + rowGrndRadio + colGrndRadio + bothGrndRadio + "</td></tr></table>")[0].outerHTML;
            }
            if ($(evt.target).hasClass("e-summaryTypes") || $(evt.element).hasClass("e-summaryTypes")) {
                dialogTitle = this._getLocalizedLabels("SummaryTypes");
                var label1 = ej.buildTag("label", this._getLocalizedLabels("Measures"))[0].outerHTML;
                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                    var measureList = "<div class='measures'><select id='drillMeasure'>";
                    for (var i = 0; i < this.model.dataSource.values.length; i++) {
                        measureList += "<option>" + this.model.dataSource.values[i].fieldCaption + "</option>";
                    }
                    measureList += "</div>";
                }
                var label2 = ej.buildTag("label", this._getLocalizedLabels("SummaryType"))[0].outerHTML;
                var drpdown2 = ej.buildTag("input#drillSum").attr("type", "text")[0].outerHTML;
                dialogContent = ej.buildTag("div#summaryDlg.#summaryDlg", "<table><tr><td>" + label1 + "</td><td>" + measureList + "</td></tr><tr><td>" + label2 + "</td><td>" + drpdown2 + "</td></tr></table>")[0].outerHTML;
            }
            var EditorDiv = ej.buildTag("div#EditorDiv.e-editorDiv", "", { "margin-left": "5px" })[0].outerHTML;
            dialogContent += EditorDiv;
            var okBtn = "<button id=OKBtn class='e-dialogOkBtn'>" + this._getLocalizedLabels("OK") + "</button>";
            var cancelBtn = "<button id=CancelBtn class='e-dialogCancelBtn'>" + this._getLocalizedLabels("Cancel") + "</button>";
            dialogFooter = ej.buildTag("div.e-dialogFooter", okBtn + cancelBtn, { "float":this.model.enableRTL?"left":"right", "margin":"20px 0px 6px" })[0].outerHTML;
            $(ejDialog).appendTo("#preventDiv");
            $(dialogContent + dialogFooter).appendTo(".e-clientDialog");
            $(".e-clientDialog").ejDialog({ enableRTL: this.model.enableRTL, width: 'auto', target: "#" + this._id, enableResize: false, close: ej.Pivot.closePreventPanel(this) });
            $(".e-titlebar").prepend(ej.buildTag("div", dialogTitle, { "display": "inline" })[0].outerHTML)[0];
            $(".e-dialogOkBtn, .e-dialogCancelBtn").ejButton({ width: "67px", enableRTL: this.model.enableRTL, type: ej.ButtonType.Button });
            $(".e-dialogOkBtn, .e-dialogCancelBtn").css({ "margin-left": "10px" });
            if (this._selectedFormat == "" && this._selectedMeasure == "") {
                $("#numberFormatOption").ejDropDownList({ enableRTL: this.model.enableRTL, selectedIndex: 0, create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) } });
                $("#measureOption").ejDropDownList({ enableRTL: this.model.enableRTL, selectedIndex: 0, showCheckbox: true, create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) } });
            }
            if (this._selectedMeasure != "" && this._selectedFormat != "") {
                $("#numberFormatOption").ejDropDownList({ enableRTL: this.model.enableRTL, text: this._selectedFormat, create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) } });
                $("#measureOption").ejDropDownList({ enableRTL: this.model.enableRTL, text: this._selectedMeasure, showCheckbox: true, create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) } });
            }
            $("#categoricalInput").ejMaskEdit({ name: "mask", inputMode: ej.InputMode.Text, watermarkText: "Column Page Size" });
            $("#seriesInput").ejMaskEdit({ name: "mask", inputMode: ej.InputMode.Text, watermarkText: "Row Page Size" });

            $("#rowSumCheckBox,#colSumCheckBox,#bothSumCheckBox").ejCheckBox({ size: "small", showRoundedCorner: true });
            this.rowCheckBox = $("#rowSumCheckBox").data("ejCheckBox"); this.colCheckBox = $("#colSumCheckBox").data("ejCheckBox"); this.bothCheckBox = $("#bothSumCheckBox").data("ejCheckBox");
            if ($(evt.target).hasClass("e-summaryCustomize") || $(evt.element).hasClass("e-summaryCustomize")) {
                if (this.rowGrand == false)
                    this.rowCheckBox.setModel({ checked: 'checked' });
                if (this.colGrand == false)
                    this.colCheckBox.setModel({ checked: 'checked' });
                if (this.bothGrand == false)
                    this.bothCheckBox.setModel({ checked: 'checked' });

                $("#hideSubTotal").ejDropDownList({
                    showCheckbox: true,
                    enableRTL: this.model.enableRTL,
                    create: function(){ $(this.wrapper.find('.e-input')).focus(function () { $(this).blur();})}
                });
                this.dropmeasure = $("#hideSubTotal").data("ejDropDownList");
                if (this.selval != undefined) {
                    this.dropmeasure.setModel({ value: this.selval });
                }
            }
            if ($(evt.target).hasClass("e-summaryTypes") || $(evt.element).hasClass("e-summaryTypes")) {
                $("#_summaryOK,#_summaryCancel").ejButton({ enableRTL: this.model.enableRTL });
                $("#drillMeasure").ejDropDownList({
                    selectedIndices: [0],
                    enableRTL: this.model.enableRTL,
                   create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }

                });
                $("#drillSum").ejDropDownList({
                    dataSource: [{ option: "Sum", value: this._getLocalizedLabels("Sum") },
                             { option: "Average", value: this._getLocalizedLabels("Average") },
                             { option: "Count", value: this._getLocalizedLabels("Count") },
                             { option: "Min", value: this._getLocalizedLabels("Min") },
                             { option: "Max", value: this._getLocalizedLabels("Max") }
                    ],
                    fields: { text: "value", value: "option" },
                    selectedIndices: [0],
                    enableRTL: this.model.enableRTL,
                    create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
                });
                drilmes = $("#drillMeasure").data("ejDropDownList");
                drilsum = $("#drillSum").data("ejDropDownList");
                if (this.drilsumval != undefined) {
                    drilmes.setModel({ value: this.drilsumval });
                }
                if (this.sumtyp != null) {
                    drilsum.setModel({ value: this.sumtyp });
                }
            }
        },
        _dialogOKBtnClick: function (e) {
            if (this._dialogName == "e-numberFormatting") {
                this._selectedFormat = $("#numberFormatOption").ejDropDownList("getSelectedValue");
                this._selectedMeasure = $("#measureOption").ejDropDownList("getSelectedValue");
                var measureList = this._selectedMeasure.split(',');
                this.element.find(".e-dialog").remove();
                ej.Pivot.closePreventPanel(this);
                for (var i = 0; i < this.model.dataSource.values.length; i++) {
                    for (var j = 0; j < measureList.length; j++) {
                        if (this.model.dataSource.values[i].fieldName == measureList[j])
                            this.model.dataSource.values[i]["format"] = this._selectedFormat.toLowerCase();
                    }
                }
                if (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj.model.analysisMode == "pivot" && this._pivotClientObj.model.operationalMode == "clientmode")
                    this.model.collapsedMembers = null;
                this._populatePivotGrid();
            }
            if (this._dialogName == "e-summaryCustomize") {
                pGridObj = this;
                if (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj.model.analysisMode == "pivot" && this._pivotClientObj.model.operationalMode == "clientmode")
                    pGridObj.model.collapsedMembers = null;
                if (pGridObj.rowCheckBox.model.checked) {
                    pGridObj.model.enableColumnGrandTotal = pGridObj.model.enableGrandTotal = true;
                    pGridObj.model.enableRowGrandTotal = pGridObj.rowGrand = false;
                }
                else
                    pGridObj.model.enableRowGrandTotal = pGridObj.rowGrand = true;
                if (pGridObj.colCheckBox.model.checked) {
                    pGridObj.model.enableRowGrandTotal = pGridObj.model.enableGrandTotal = true;
                    pGridObj.model.enableColumnGrandTotal = pGridObj.colGrand = false;
                }
                else
                    pGridObj.model.enableColumnGrandTotal = pGridObj.colGrand = true;
                if (pGridObj.bothCheckBox.model.checked || (pGridObj.colCheckBox.model.checked && pGridObj.rowCheckBox.model.checked)) {
                    pGridObj.model.enableRowGrandTotal = pGridObj.model.enableColumnGrandTotal = true;
                    pGridObj.model.enableGrandTotal = pGridObj.bothGrand = false;
                }
                else
                    pGridObj.model.enableGrandTotal = pGridObj.bothGrand = true;
                if ($("#hideSubTotal").ejDropDownList("getSelectedValue") != null && this.model.analysisMode == "pivot" && this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                    pGridObj.selval = $("#hideSubTotal").ejDropDownList("getSelectedValue");
                    var selectedValues = $("#hideSubTotal").ejDropDownList("getSelectedValue").split(',');
                    if (pGridObj.model.dataSource.rows.length > 0)
                        $.each(pGridObj.model.dataSource.rows, function (e, item) { if (item.fieldName.length > 0) item["showSubTotal"] = true; });
                    if (pGridObj.model.dataSource.columns.length > 0)
                        $.each(pGridObj.model.dataSource.columns, function (e, item) { if (item.fieldName.length > 0) item["showSubTotal"] = true; });
                    $.each(selectedValues, function (e, selectedValue) {
                        if (pGridObj.model.dataSource.rows.length > 0)
                            $.each(pGridObj.model.dataSource.rows, function (e, item) { if (item.fieldName.length > 0 && item.fieldName == selectedValue) item["showSubTotal"] = false; });
                        if (pGridObj.model.dataSource.columns.length > 0)
                            $.each(pGridObj.model.dataSource.columns, function (e, item) { if (item.fieldName.length > 0 && item.fieldName == selectedValue) item["showSubTotal"] = false; });
                    });
                    pGridObj._populatePivotGrid();
                }

                else if (this.model.analysisMode == "pivot" && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    pGridObj.selval = $("#hideSubTotal").ejDropDownList("getSelectedValue");
                    var selectedValues = $("#hideSubTotal").ejDropDownList("getSelectedValue").split(',');
                    var dataSource = ($(this.element).parents(".e-pivotclient").length > 0 && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) ? JSON.parse(this._pivotClientObj.getOlapReport()) : JSON.parse(pGridObj.getOlapReport());
                    if (dataSource.PivotRows.length > 0)
                        $.each(dataSource.PivotRows, function (e, item) { if (item.FieldName.length > 0) item["showSubTotal"] = true; });
                    if (dataSource.PivotColumns.length > 0)
                        $.each(dataSource.PivotColumns, function (e, item) { if (item.FieldName.length > 0) item["showSubTotal"] = true; });
                    $.each(selectedValues, function (e, selectedValue) {
                        if (dataSource.PivotRows.length > 0)
                            $.each(dataSource.PivotRows, function (e, item) {
                                if (item.FieldName.length > 0 && item.FieldName == selectedValue)
                                    item["showSubTotal"] = false;
                            });
                        if (dataSource.PivotColumns.length > 0)
                            $.each(dataSource.PivotColumns, function (e, item) {
                                if (item.FieldName.length > 0 && item.FieldName == selectedValue)
                                    item["showSubTotal"] = false;
                            });
                    });
                    var msg = { JsonRecords: JSON.stringify(pGridObj.getJSONRecords()), PivotReport: JSON.stringify(dataSource) }
                    pGridObj._renderControlSuccess(msg);
                }
                else
                    pGridObj._load();
                ej.Pivot.closePreventPanel(this);
            }
            if (this._dialogName == "e-summaryTypes") {
                if ($("#drillSum").val() != undefined) {
                    this.drilsumval = $("#drillMeasure").ejDropDownList("getSelectedValue");
                    var summarytyp = this.sumtyp = $("#drillSum").val();
                    if (summarytyp != null)
                        var s = summarytyp.toLowerCase();
                    if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                        var len = $("#drillMeasure").ejDropDownList("getSelectedValue").split(",").length;
                        for (var i = 0; i < len; i++) {
                            var selectedValue = $("#drillMeasure").ejDropDownList("getSelectedValue").split(",")[i];
                            $.grep(this.model.dataSource.values, function (item) { return item.fieldName == selectedValue; })[0]["summaryType"] = s;
                        }
                        if (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj.model.analysisMode == "pivot" && this._pivotClientObj.model.operationalMode == "clientmode")
                            this.model.collapsedMembers = null;
                        this._populatePivotGrid();
                    }
                }
                ej.Pivot.closePreventPanel(this);
            }
        },

        _keyUpPress:function(e){

            if (e.which === 16 && this.model.enableCellSelection) {
                this._completeCellSelection(e);
                $("#" + this._id).find(".value").removeClass("e-hoverCell");
                this._startPosCell = null;
                _startPosCell = null;
            }  
            if (e.which === 13 && this.model.enableCellEditing && !this.model.enableCellSelection && $("#" + this._id).find(".value.e-hoverCell").length) {
                $("#" + this._id).find(".value.e-hoverCell").trigger("mouseover");
                _startPosCell = $($("#" + this._id).find(".value.e-hoverCell")).attr("data-p");
                var selEle = { target: $("#" + this._id).find(".value.e-hoverCell > span")[0] };
                this._completeCellEditing(selEle);
                e.preventDefault();
                $("#" + this._id).find(".value.e-hoverCell .curInput").focus();
                $("#" + this._id).find(".value").removeClass("e-hoverCell");
            }
        },
        _keyDownPress: function (e) {
            if ($(".e-pivotpager[data-targetcontrolid='" + this._id + "']:visible").length > 0) {
                if (document.activeElement.id == "Pager_CategCurrentPage" || document.activeElement.id == "Pager_SeriesCurrentPage") {
                    if (e.which === 35) {
                        e.preventDefault();
                        if (document.activeElement.id == "Pager_CategCurrentPage") {
                            $(".e-pivotpager[data-targetcontrolid='" + this._id + "'] .e-moveLast").first().trigger("click");
                        }
                        else if (document.activeElement.id == "Pager_SeriesCurrentPage") {
                            $(".e-pivotpager[data-targetcontrolid='" + this._id + "'] .e-moveLast").last().trigger("click");
                        }
                    }
                    else if (e.which == 36) {
                        e.preventDefault();
                        if (document.activeElement.id == "Pager_CategCurrentPage") {
                            $(".e-pivotpager[data-targetcontrolid='" + this._id + "'] .moveFirst").first().trigger("click");
                        }
                        else if (document.activeElement.id == "Pager_SeriesCurrentPage") {
                            $(".e-pivotpager[data-targetcontrolid='" + this._id + "'] .moveFirst").last().trigger("click");
                        }
                    }
                    if (e.which === 39) {
                        if (document.activeElement.id == "Pager_CategCurrentPage") {
                            $(".e-pivotpager[data-targetcontrolid='" + this._id + "'] .e-moveNext").first().trigger("click");
                        }
                        else if (document.activeElement.id == "Pager_SeriesCurrentPage") {
                            $(".e-pivotpager[data-targetcontrolid='" + this._id + "'] .e-moveNext").last().trigger("click");
                        }
                    }
                    else if (e.which === 37) {
                        if (document.activeElement.id == "Pager_CategCurrentPage") {
                            $(".e-pivotpager[data-targetcontrolid='" + this._id + "'] .e-movePrevious").first().trigger("click");
                        }
                        else if (document.activeElement.id == "Pager_SeriesCurrentPage") {
                            $(".e-pivotpager[data-targetcontrolid='" + this._id + "'] .e-movePrevious").last().trigger("click");
                        }
                    }
                }
                e.stopImmediatePropagation();
            }
            if (e.which === 27 && (!ej.isNullOrUndefined(this._curFocus.grp) || (!ej.isNullOrUndefined(this._curFocus.tab) && this._curFocus.tab.hasClass("e-pivotButton")))) {
                var focEl;
                this._curFocus.tab.mouseleave().removeClass("e-hoverCell");
                if (!ej.isNullOrUndefined(this._curFocus.grp)) {
                    var tag = this._curFocus.grp.attr("data-tag");
                    focEl = this._curFocus.grp = $("#" + this._id).find("[data-tag='" + tag + "']");
                }
                else if (!ej.isNullOrUndefined(this._curFocus.tab) && this._curFocus.tab.hasClass("e-pivotButton")) {
                    var tag = this._curFocus.tab.attr("data-tag");
                    focEl = this._curFocus.tab = $("#" + this._id).find("[data-tag='" + tag + "']");
                }
                focEl.mouseover().addClass("e-hoverCell").focus();
                this._index.filter = 0;
                if (this.model.dataSource.enableAdvancedFilter) {
                    this._index.dialog = 0;
                }
                else {
                    this._index.dialog = 1;
                }
                this._index.field = 0;
            }
            else if (e.which === 27) {
                this._index.dialog = 0;
            }
            if (e.which === 70 && e.ctrlKey) {
                e.preventDefault();
                if (!ej.isNullOrUndefined(this._curFocus.grp)) {
                    this._curFocus.grp.find(".filter").click();
                }
                else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.find(".filter").click();
                }
            }
            if (e.which === 83 && e.ctrlKey) {
                e.preventDefault();
                var focEl;
                if (!ej.isNullOrUndefined(this._curFocus.grp)) {
                    this._curFocus.grp.find(".e-sorting").click();
                    var tag = this._curFocus.grp.attr("data-tag");
                    focEl = this._curFocus.grp = $("#" + this._id).find("[data-tag='" + tag + "']");
                }
                else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.find(".e-sorting").click();
                    var tag = this._curFocus.tab.attr("data-tag");
                    focEl = this._curFocus.tab = $("#" + this._id).find("[data-tag='" + tag + "']");
                }
                focEl.mouseover().addClass("e-hoverCell").focus();
            }
            if (e.which === 46 || (e.which === 82 && e.ctrlKey)) {
                if (e.which != 46)
                    e.preventDefault();
                if (!ej.isNullOrUndefined(this._curFocus.grp)) {
                    this._curFocus.grp.find(".e-removeBtn").click();
                }
                else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.find(".e-removeBtn").click();
                }
            }
            if (e.shiftKey) {
                if (ej.isNullOrUndefined(this._startPosCell)) {
                    _startPosCell = e.target.getAttribute("data-p");
                    this._startPosCell = e.target.getAttribute("data-p");
                }
            }
            if (e.which === 39 && $("#" + this._id).find(".e-dialog .e-hoverCell").length > 0) {
                $("#" + this._id).find(".e-dialog .e-hoverCell").parent().find(".e-plus").click();
            }
            else if (e.which === 37 && $("#" + this._id).find(".e-dialog .e-hoverCell").length > 0) {
                $("#" + this._id).find(".e-dialog .e-hoverCell").parent().find(".e-minus").click();
            }
            if ((e.which === 40 || e.which === 39 || e.which === 38 || e.which === 37) && e.shiftKey && this.model.enableCellSelection) {
                $("#" + this._id).find(".e-hoverCell").removeClass("e-hoverCell");
                if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.attr("tabindex", "0");
                }
                var selectedCell = $(e.target);
                if (e.which == "40") {  //Down arrow
                    var selectedCellPos = selectedCell.attr('data-p'), i = parseInt(selectedCellPos.split(',')[1]) + Number(selectedCell.attr("rowspan"));
                    var cell;
                    while (ej.isNullOrUndefined(cell) && i < this._rowCount) {
                        var currentCell = $($("#" + this._id)).find("[data-p='" + selectedCellPos.split(',')[0] + "," + i + "']")[0];
                        if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                        this._curFocus.selection = $(cell);
                        i++;
                    }
                }
                else if (e.which == "38") {  //Up arrow
                    var selectedCellPos = selectedCell.attr('data-p'), i = parseInt(selectedCellPos.split(',')[1]) - 1;
                    var cell;
                    while (ej.isNullOrUndefined(cell) && i >= 0) {
                        var currentCell = $($("#" + this._id)).find("[data-p='" + selectedCellPos.split(',')[0] + "," + i + "']")[0];
                        if (ej.isNullOrUndefined(currentCell)) {
                            currentCell = $($("#" + this._id)).find("[data-p='" + (parseInt(selectedCellPos.split(',')[0]) - 1) + "," + i + "']")[0];
                        }
                        if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                        this._curFocus.selection = $(cell);
                        i--;
                    }
                }
                else if (e.which == "39") {  //Right arrow
                    var selectedCellPos = selectedCell.attr('data-p'), i = parseInt(selectedCellPos.split(',')[0]) + Number(selectedCell.attr("colspan"));
                    var cell;
                    while (ej.isNullOrUndefined(cell) && i < Math.ceil(this.getJSONRecords().length / this._rowCount)) {
                        var currentCell = $($("#" + this._id)).find("[data-p='" + i + "," + selectedCellPos.split(',')[1] + "']")[0];
                        if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                        this._curFocus.selection = $(cell);
                        i++;
                    }
                }
                else if (e.which == "37") {  //Left Arrow
                    var selectedCellPos = selectedCell.attr('data-p'), i = parseInt(selectedCellPos.split(',')[0]) - 1;
                    var cell = $($("#" + this._id)).find("[data-p='" + (parseInt(selectedCellPos.split(',')[0]) - 1) + "," + selectedCellPos.split(',')[1] + "']")[0];
                    while (ej.isNullOrUndefined(cell) && i >= 0) {
                        var currentCell = $($("#" + this._id)).find("[data-p='" + i + "," + selectedCellPos.split(',')[1] + "']")[0];
                        if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                        i--;
                    }
                    this._curFocus.selection = $(cell);
                }
                this._curFocus.selection.attr("tabindex", "-1").focus().addClass("e-hoverCell");
                if (Number(_startPosCell.split(",")[0]) <= Number(this._curFocus.selection.attr("data-p").split(",")[0]) && Number(_startPosCell.split(",")[1]) <= Number(this._curFocus.selection.attr("data-p").split(",")[1])) {
                    for (i = Number(_startPosCell.split(",")[0]) ; i <= Number(this._curFocus.selection.attr("data-p").split(",")[0]) ; i++) {
                        for (j = Number(_startPosCell.split(",")[1]) ; j <= Number(this._curFocus.selection.attr("data-p").split(",")[1]) ; j++) {
                            if ($("#" + this._id).find("[data-p='" + i + "," + j + "']").hasClass("value")) {
                                $("#" + this._id).find("[data-p='" + i + "," + j + "']").addClass("e-hoverCell");
                            }
                        }
                    }
                }
                else if (Number(_startPosCell.split(",")[0]) >= Number(this._curFocus.selection.attr("data-p").split(",")[0]) && Number(_startPosCell.split(",")[1]) >= Number(this._curFocus.selection.attr("data-p").split(",")[1])) {
                    for (i = Number(_startPosCell.split(",")[0]) ; i >= Number(this._curFocus.selection.attr("data-p").split(",")[0]) ; i--) {
                        for (j = Number(_startPosCell.split(",")[1]) ; j >= Number(this._curFocus.selection.attr("data-p").split(",")[1]) ; j--) {
                            if ($("#" + this._id).find("[data-p='" + i + "," + j + "']").hasClass("value")) {
                                $("#" + this._id).find("[data-p='" + i + "," + j + "']").addClass("e-hoverCell");
                            }
                        }
                    }
                }
                else if (Number(_startPosCell.split(",")[0]) <= Number(this._curFocus.selection.attr("data-p").split(",")[0]) && Number(_startPosCell.split(",")[1]) >= Number(this._curFocus.selection.attr("data-p").split(",")[1])) {
                    for (i = Number(_startPosCell.split(",")[0]) ; i <= Number(this._curFocus.selection.attr("data-p").split(",")[0]) ; i++) {
                        for (j = Number(_startPosCell.split(",")[1]) ; j >= Number(this._curFocus.selection.attr("data-p").split(",")[1]) ; j--) {
                            if ($("#" + this._id).find("[data-p='" + i + "," + j + "']").hasClass("value")) {
                                $("#" + this._id).find("[data-p='" + i + "," + j + "']").addClass("e-hoverCell");
                            }
                        }
                    }
                }
                else if (Number(_startPosCell.split(",")[0]) >= Number(this._curFocus.selection.attr("data-p").split(",")[0]) && Number(_startPosCell.split(",")[1]) <= Number(this._curFocus.selection.attr("data-p").split(",")[1])) {
                    for (i = Number(_startPosCell.split(",")[0]) ; i >= Number(this._curFocus.selection.attr("data-p").split(",")[0]) ; i--) {
                        for (j = Number(_startPosCell.split(",")[1]) ; j <= Number(this._curFocus.selection.attr("data-p").split(",")[1]) ; j++) {
                            if ($("#" + this._id).find("[data-p='" + i + "," + j + "']").hasClass("value")) {
                                $("#" + this._id).find("[data-p='" + i + "," + j + "']").addClass("e-hoverCell");
                            }
                        }
                    }
                }
            }
            else if ((e.which === 40 || e.which === 38 || e.which === 37 || e.which === 39) && $("#" + this._id).find(".e-calcFormulaDiv:visible").length > 0) {
                e.preventDefault();
                var td = $("#" + this._id).find(".e-calcFormulaDiv td:visible");
                if (!ej.isNullOrUndefined(this._curFocus.formula)) {
                    this._curFocus.formula.removeClass("e-hoverCell").mouseleave();
                    if (e.which === 39) {
                        this._index.formula = this._index.formula + 1 > td.length - 1 ? 0 : this._index.formula + 1;
                    }
                    else if (e.which === 37) {
                        this._index.formula = this._index.formula - 1 < 0 ? td.length - 1 : this._index.formula - 1;
                    }
                    else if (e.which === 40) {
                        this._index.formula = this._index.formula + 4 > td.length - 1 ? (this._index.formula + 4) % 10 : this._index.formula + 4;
                    }
                    else if (e.which === 38) {
                        this._index.formula = this._index.formula - 4 < 0 ? (this._index.formula - 4) + 20 : this._index.formula - 4;
                    }
                    this._curFocus.formula = td.eq(this._index.formula).addClass("e-hoverCell").mouseover();
                }
                else {
                    this._index.formula = e.which == 39 ? 0 : e.which == 37 ? td.length - 1 : 0;
                    this._curFocus.formula = td.eq(this._index.formula).addClass("e-hoverCell").mouseover();
                }
            }
            else if ((e.keyCode === 40 || e.which === 38) && $("#" + this._id).find(".e-dialog:visible").length > 0 && !ej.isNullOrUndefined($("#" + this._id).find(".e-dialog .e-text")) && $(".e-dialog .e-text").hasClass("e-hoverCell")) {
                $("#" + this._id).find(".e-dialog .e-hoverCell").removeClass("e-hoverCell");
                e.preventDefault();
                var td = $("#" + this._id).find(".e-dialog .e-text:visible");
                if (!ej.isNullOrUndefined(this._curFocus.filter)) {
                    this._curFocus.filter.attr("tabindex", "0").removeClass("e-hoverCell");
                    if (e.which === 40) {
                        this._index.filter = this._index.filter + 1 > td.length - 1 ? 0 : this._index.filter + 1;
                    }
                    else if (e.which === 38) {
                        this._index.filter = this._index.filter - 1 < 0 ? td.length - 1 : this._index.filter - 1;
                    }
                    this._curFocus.filter = td.eq(this._index.filter).attr("tabindex", "-1");
                }
                else {
                    this._index.filter = e.which == 40 ? 1 : e.which == 38 ? td.length - 1 : 0;
                    this._curFocus.filter = td.eq(this._index.filter).attr("tabindex", "-1");
                }
                this._curFocus.filter.focus().addClass("e-hoverCell");
                $(".e-node-focus").removeClass("e-node-focus");
            }
            else if ((e.which === 40 || e.which === 38 || e.which === 37 || e.which === 39) && !ej.isNullOrUndefined(this._curFocus.tab) && this._curFocus.tab.hasClass("e-pivotButton") && !$(".pivotTree:visible,.pivotTreeContext:visible,.pivotTreeContextMenu:visible").length > 0 && !$("#" + this._id).find(".e-dialog:visible").length > 0) {
                e.preventDefault();
                if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.mouseleave().attr("tabindex", "0").removeClass("e-hoverCell");
                }
                var td = $("#" + this._id).find(".e-pivotButton");
                if (!ej.isNullOrUndefined(this._curFocus.grp)) {
                    this._curFocus.grp.attr("tabindex", "0").removeClass("e-hoverCell").mouseleave();
                    if (e.which === 40 || e.which === 39) {
                        this._index.grp = this._index.grp + 1 > td.length - 1 ? 0 : this._index.grp + 1;
                    }
                    else if (e.which === 38 || e.which === 37) {
                        this._index.grp = this._index.grp - 1 < 0 ? td.length - 1 : this._index.grp - 1;
                    }
                    this._curFocus.grp = td.eq(this._index.grp);
                }
                else {
                    if (e.which === 40 || e.which === 39) {
                        this._curFocus.grp = td.eq(1).attr("tabindex", "-1");
                    }
                    else if (e.which === 38 || e.which === 37) {
                        this._curFocus.grp = td.eq(td.length - 1).attr("tabindex", "-1");
                    }
                }
                this._curFocus.grp.addClass("e-hoverCell").mouseover().focus();
            }
            else if ((e.which === 40 || e.which === 38 || e.which === 37 || e.which === 39) && !$(".pivotTree:visible,.pivotTreeContext:visible,.pivotTreeContextMenu:visible").length > 0 && (document.activeElement.getAttribute("role") == "columnheader" || document.activeElement.getAttribute("role") == "rowheader" || document.activeElement.getAttribute("role") == "gridcell")) {
                if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.attr("tabindex", "0");
                }
                if (!ej.isNullOrUndefined(this._curFocus.cell)) {
                    this._curFocus.cell.attr("tabindex", "0").removeClass("e-hoverCell");
                    if (this.model.hyperlinkSettings.enableColumnHeaderHyperlink) {
                        this._curFocus.cell.find("span").mouseleave();
                    }
                }
                this._index.menu = 0;
                this._curFocus.cmenu = null;
                var selectedCell = $(e.target);
                if (e.which == "40") {  //Down arrow
                    var selectedCellPos = selectedCell.attr('data-p'), i = parseInt(selectedCellPos.split(',')[1]) + Number(selectedCell.attr("rowspan"));
                    var cell;
                    while (ej.isNullOrUndefined(cell) && i <= this._rowCount) {
                        var currentCell = $("#" + this._id).find("[data-p='" + selectedCellPos.split(',')[0] + "," + i + "']")[0];
                        if (ej.isNullOrUndefined(currentCell) /*&& i == 0*/) {
                            for (k = parseInt(selectedCellPos.split(',')[0]) - 1; k >= 0; k--) {
                                if (ej.isNullOrUndefined(currentCell)) {
                                    currentCell = $("#" + this._id).find("[data-p='" + k + "," + i + "']")[0];
                                }
                            }
                        }
                        if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                        if (!ej.isNullOrUndefined(cell)) {
                            this._curFocus.cell = $(cell);
                        }
                        i++;
                    }
                }
                else if (e.which == "38") {  //Up arrow
                    var selectedCellPos = selectedCell.attr('data-p'), i = parseInt(selectedCellPos.split(',')[1]) - 1;
                    var cell;
                    var j = parseInt(selectedCellPos.split(',')[0]);
                    while (ej.isNullOrUndefined(cell) && i >= 0) {
                        var currentCell = $("#" + this._id).find("[data-p='" + selectedCellPos.split(',')[0] + "," + i + "']")[0];
                        if (ej.isNullOrUndefined(currentCell) && ((selectedCell.attr("role") == "gridcell") || (selectedCell.hasClass("summary") && (selectedCell.hasClass("calc"))))) {
                            for (k = parseInt(selectedCellPos.split(',')[1]) - 1; k >= 0; k--) {
                                if (ej.isNullOrUndefined(currentCell)) {
                                    currentCell = $("#" + this._id).find("[data-p='" + j + "," + k + "']")[0];
                                }
                            }
                        }
                        if (ej.isNullOrUndefined(currentCell) /*&& i == 0*/) {
                            for (k = parseInt(selectedCellPos.split(',')[0]) - 1; k >= 0; k--) {
                                if (ej.isNullOrUndefined(currentCell)) {
                                    currentCell = $("#" + this._id).find("[data-p='" + k + "," + i + "']")[0];
                                }
                            }
                        }
                        if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                        if (!ej.isNullOrUndefined(cell) && !$(cell).hasClass("e-grpRow")) {
                            this._curFocus.cell = $(cell);
                        }
                        i--;
                        j--;
                    }
                }
                else if (e.which == "39") {  //Right arrow
                    var selectedCellPos = selectedCell.attr('data-p'), i = parseInt(selectedCellPos.split(',')[0]) + Number(selectedCell.attr("colspan"));
                    var cell;
                    while (ej.isNullOrUndefined(cell) && i <= Math.ceil((Number($("#" + this._id).find(".e-pivotGridTable td:last").attr("data-p").split(",")[0]) + 1) * (Number($("#" + this._id).find(".e-pivotGridTable td:last").attr("data-p").split(",")[1]) + 1) / this._rowCount)) {
                        var currentCell = $("#" + this._id).find("[data-p='" + i + "," + selectedCellPos.split(',')[1] + "']")[0];
                        if (ej.isNullOrUndefined(currentCell) /*&& i == 0*/) {
                            for (k = parseInt(selectedCellPos.split(',')[1]) - 1; k >= 0; k--) {
                                if (ej.isNullOrUndefined(currentCell)) {
                                    currentCell = $("#" + this._id).find("[data-p='" + i + "," + k + "']")[0];
                                }
                            }
                        }
                        if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                        if (!ej.isNullOrUndefined(cell)) {
                            this._curFocus.cell = $(cell);
                        }
                        i++;
                    }
                }
                else if (e.which == "37") {  //Left Arrow
                    var selectedCellPos = selectedCell.attr('data-p'), i = parseInt(selectedCellPos.split(',')[0]) - 1;
                    var cell = $("#" + this._id).find("[data-p='" + (parseInt(selectedCellPos.split(',')[0]) - 1) + "," + selectedCellPos.split(',')[1] + "']")[0];
                    var j = parseInt(selectedCellPos.split(',')[1]);
                    while (ej.isNullOrUndefined(cell) && i >= 0) {
                        var currentCell = $("#" + this._id).find("[data-p='" + i + "," + selectedCellPos.split(',')[1] + "']")[0];
                        if (ej.isNullOrUndefined(currentCell) && (selectedCell.attr("role") == "gridcell")) {
                            for (k = parseInt(selectedCellPos.split(',')[0]) - 1; k >= 0; k--) {
                                if (ej.isNullOrUndefined(currentCell)) {
                                    currentCell = $("#" + this._id).find("[data-p='" + k + "," + j + "']")[0];
                                }
                            }
                        }
                        if (ej.isNullOrUndefined(currentCell)) {
                            for (k = parseInt(selectedCellPos.split(',')[1]) - 1; k >= 0; k--) {
                                if (ej.isNullOrUndefined(currentCell)) {
                                    currentCell = $("#" + this._id).find("[data-p='" + i + "," + k + "']")[0];
                                }
                            }
                        }
                        if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                        i--;
                        j--;
                    }
                    if (!ej.isNullOrUndefined(cell) && !$(cell).hasClass("e-grpRow")) {
                        this._curFocus.cell = $(cell);
                    }
                }
                if (!ej.isNullOrUndefined(this._curFocus.cell)) {
                    $(".e-hoverCell").removeClass("e-hoverCell");
                    this._curFocus.cell.attr("tabindex", "-1").focus().addClass("e-hoverCell");
                    if (this.model.hyperlinkSettings.enableColumnHeaderHyperlink) {
                        this._curFocus.cell.mouseover();
                        this._curFocus.cell.find("span").mouseover();
                    }
                }
            }
            else if(e.which == 40 && $(".e-list").hasClass("e-hoverCell")){
                $("#" + this._id).find(".e-hoverCell").removeClass("e-hoverCell");
            }
            if (e.which === 9 && $("#" + this._id).find(".colheader.e-hoverCell")) {
                this._curFocus.cell = $("#" + this._id).find(".colheader.e-hoverCell");
            }
            if (((e.which === 9 && e.shiftKey) || e.which === 9) && $("#" + this._id).find("#" + this._id + "_clientDlg_wrapper :visible").length > 0) {
                e.preventDefault();
                if (!$("#" + this._id + "_editCon_hidden").hasClass("e-disable") && $("#" + this._id + "_conTo").attr("disabled") != "disabled") {
                    var td = $("#" + this._id).find("#" + this._id + "_conType_wrapper,#" + this._id + "_editCon_wrapper,#" + this._id + "_removeBtn,#" + this._id + "_conFrom,#" + this._id + "_conTo,#" + this._id + "_fontcolor_wrapper,#" + this._id + "_backcolor_wrapper,#" + this._id + "_borderrange_wrapper,#" + this._id + "_conFrom,#" + this._id + "_fontcolor_wrapper,#" + this._id + "_backcolor_wrapper,#" + this._id + "_bordercolor_wrapper,#" + this._id + "_borderstyle_wrapper,#" + this._id + "_fStyle_wrapper,#" + this._id + "_fSize_wrapper,#" + this._id + "_OKBtn,#" + this._id + "_CancelBtn,.e-dialog .e-close");
                }
                else if ($("#" + this._id + "_conTo").attr("disabled") != "disabled") {
                    var td = $("#" + this._id).find("#" + this._id + "_conType_wrapper,#" + this._id + "_conFrom,#" + this._id + "_conTo,#" + this._id + "_fontcolor_wrapper,#" + this._id + "_backcolor_wrapper,#" + this._id + "_borderrange_wrapper,#" + this._id + "_conFrom,#" + this._id + "_fontcolor_wrapper,#" + this._id + "_backcolor_wrapper,#" + this._id + "_bordercolor_wrapper,#" + this._id + "_borderstyle_wrapper,#" + this._id + "_fStyle_wrapper,#" + this._id + "_fSize_wrapper,#" + this._id + "_OKBtn,#" + this._id + "_CancelBtn,.e-dialog .e-close");
                }
                else if (!$("#" + this._id + "_editCon_hidden").hasClass("e-disable")) {
                    var td = $("#" + this._id).find("#" + this._id + "_conType_wrapper,#" + this._id + "_editCon_wrapper,#" + this._id + "_removeBtn,#" + this._id + "_conFrom,#" + this._id + "_fontcolor_wrapper,#" + this._id + "_backcolor_wrapper,#" + this._id + "_borderrange_wrapper,#" + this._id + "_conFrom,#" + this._id + "_fontcolor_wrapper,#" + this._id + "_backcolor_wrapper,#" + this._id + "_bordercolor_wrapper,#" + this._id + "_borderstyle_wrapper,#" + this._id + "_fStyle_wrapper,#" + this._id + "_fSize_wrapper,#" + this._id + "_OKBtn,#" + this._id + "_CancelBtn,.e-dialog .e-close");
                }
                else {
                    var td = $("#" + this._id).find("#" + this._id + "_conType_wrapper,#" + this._id + "_fontcolor_wrapper,#" + this._id + "_backcolor_wrapper,#" + this._id + "_borderrange_wrapper,#" + this._id + "_conFrom,#" + this._id + "_fontcolor_wrapper,#" + this._id + "_backcolor_wrapper,#" + this._id + "_bordercolor_wrapper,#" + this._id + "_borderstyle_wrapper,#" + this._id + "_fStyle_wrapper,#" + this._id + "_fSize_wrapper,#" + this._id + "_OKBtn,#" + this._id + "_CancelBtn,.e-dialog .e-close");
                }
                if (!ej.isNullOrUndefined(this._curFocus.cformat)) {
                    this._curFocus.cformat.attr("tabindex", "0").removeClass("e-hoverCell");
                    if (e.which === 9 && e.shiftKey) {
                        this._index.cformat = this._index.cformat - 1 < 0 ? td.length - 1 : this._index.cformat - 1;
                    }
                    else if (e.which === 9) {
                        this._index.cformat = this._index.cformat + 1 > td.length - 1 ? 0 : this._index.cformat + 1;
                    }
                    this._curFocus.cformat = td.eq(this._index.cformat).attr("tabindex", "-1");
                }
                else {
                    this._index.cformat = 1;
                    this._curFocus.cformat = td.eq(this._index.cformat).attr("tabindex", "-1");
                }
                this._curFocus.cformat.focus().addClass("e-hoverCell");
            }
            else if (((e.which === 9 && e.shiftKey) || e.which === 9) && $("#" + this._id).find(".e-dlgCalculatedField:visible").length > 0) {
                e.preventDefault();
                if ($("#" + this._id).find(".e-calcFormulaDiv:visible").length > 0) {
                    $("#" + this._id).find(".e-calcFormulaDiv").css("display", "none");
                }
                var focEle = [];
                focEle.push($("#" + this._id).find("#" + this._id + "_calculateFieldName:visible"));
                focEle.push($("#" + this._id).find("#" + this._id + "_calculateFieldList_dropdown:visible"));
                focEle.push($("#" + this._id).find(".calculatorFields:visible"));
                focEle.push($("#" + this._id).find(".editFormula:visible"));
                focEle.push($("#" + this._id).find("#" + this._id + "_fieldCollection_container:visible"));
                if ($("#" + this._id).find("#" + this._id + "_btnInsert:visible:not([aria-disabled='true'])").length > 0) {
                    focEle.push($("#" + this._id).find("#" + this._id + "_btnInsert:visible:not([aria-disabled='true'])"));
                }
                focEle.push($("#" + this._id).find("#" + this._id + "_btnAdd:visible"));
                focEle.push($("#" + this._id).find("#" + this._id + "_btnDelete:visible"));
                focEle.push($("#" + this._id).find("#" + this._id + "_btnOk:visible"));
                focEle.push($("#" + this._id).find("#" + this._id + "_btnCancel:visible"));
                if (!ej.isNullOrUndefined(this._curFocus.field)) {
                    this._curFocus.field.attr("tabindex", "0").removeClass("e-hoverCell").blur();
                    if (e.which === 9 && e.shiftKey) {
                        this._index.field = this._index.field - 1 < 0 ? focEle.length - 1 : this._index.field - 1;
                    }
                    else if (e.which === 9) {
                        this._index.field = this._index.field + 1 > focEle.length - 1 ? 0 : this._index.field + 1;
                    }
                    this._curFocus.field = focEle[this._index.field].attr("tabindex", "-1");
                }
                else {
                    this._index.field = focEle.length > 5 ? 6 : 0;
                    this._curFocus.field = focEle[this._index.field].attr("tabindex", "-1");
                }
                this._curFocus.field.focus().addClass("e-hoverCell");
            }
            else if (((e.which === 9 && e.shiftKey) || e.which === 9) && $("#" + this._id).find(".e-dialog:visible").length > 0) {
                e.preventDefault();
                $("#" + this._id).find(".e-dialog .e-hoverCell").removeClass("e-hoverCell");
                this._curFocus.filter = null;
                this._index.filter = 0;
                var focEle = $("#" + this._id).find(".e-dialogOKBtn:visible:not([aria-disabled='true']),.e-dialogCancelBtn:visible,.e-close:visible,#GroupLabelDrop_wrapper:visible,.filterElementTag:visible,.e-dialog .e-text:visible:first,.filterValues:visible,#filterMeasures_wrapper:visible,#filterOptions_wrapper:visible,#filterValue1:visible,#filterValue2:visible,.searchEditorTreeView");
                if (!ej.isNullOrUndefined(this._curFocus.tree)) {
                    this._curFocus.tree.attr("tabindex", "0").removeClass("e-hoverCell");
                    if (e.which === 9 && e.shiftKey) {
                        this._index.dialog = this._index.dialog - 1 < 0 ? focEle.length - 1 : this._index.dialog - 1;
                    }
                    else if (e.which === 9) {
                        this._index.dialog = this._index.dialog + 1 > focEle.length - 1 ? 0 : this._index.dialog + 1;
                    }
                    this._curFocus.tree = focEle.eq(this._index.dialog).attr("tabindex", "-1").focus();
                }
                else {
                    if (this.model.dataSource.enableAdvancedFilter) {
                        this._index.dialog = 1;
                    }
                    else {
                        this._index.dialog = 2;
                    }
                    this._curFocus.tree = focEle.eq(this._index.dialog).attr("tabindex", "-1").focus();
                }
                if (this._curFocus.tree.hasClass("filterElementTag")) {
                    this._curFocus.tree.find(".e-list:first:visible").addClass("e-hoverCell");
                }
                else {
                    this._curFocus.tree.addClass("e-hoverCell");
                }
            }
            else if (((e.which === 9 && e.shiftKey) || e.which === 9) && !$(".e-dialog:visible").length > 0 && ej.isNullOrUndefined(this._pivotClientObj)) {
                e.preventDefault();
                $("#" + this._id).find(".e-hoverCell").removeClass("e-hoverCell");
                if (!ej.isNullOrUndefined(this._schemaData)) {
                    $("#" + this._schemaData._id).find(".e-hoverCell").removeClass("e-hoverCell");
                }
                if (!ej.isNullOrUndefined(this._curFocus.grp)) {
                    this._curFocus.grp.mouseleave();
                }
                this._index.field = 0;
                this._index.grp = 1;
                this._index.cell = 1;
                this._index.filter = 0;
                if (this.model.dataSource.enableAdvancedFilter) {
                    this._index.dialog = 0;
                }
                else {
                    this._index.dialog = 1;
                }
                if (!ej.isNullOrUndefined(this._schemaData) && !ej.isNullOrUndefined(this._schemaData._curFocus)) {
                    this._schemaData._curFocus.tree = null;
                    this._schemaData._curFocus.node = null;
                    this._schemaData._curFocus.button = null;
                }
                this._curFocus.field = null;
                this._curFocus.cell = null;
                this._curFocus.grp = null;
                this._curFocus.tree = null;
                this._curFocus.cmenu = null;
                this._curFocus.cformat = null;
                this._curFocus.selection = null;
                var focEle = [];
                if (this.model.enableGroupingBar && $("#" + this._id).find(".e-pivotButton:visible").first().length > 0) {
                    focEle.push($("#" + this._id).find(".e-pivotButton:visible").first());
                }
                if ($(".e-pivotpager[data-targetcontrolid='" + this._id + "']:visible").length > 0 && $("[role='columnheader']:visible:not([p='0,0'])").first().length > 0) {
                    focEle.push($("[role='columnheader']:visible:not([p='0,0'])").first());
                }
                else if ($("#" + this._id).find("[role='columnheader']:visible").first().length > 0) {
                    focEle.push($("[role='columnheader']:not('.e-grpRow'):visible:first"));
                }
                if (!ej.isNullOrUndefined(this._schemaData) && $("#" + this._schemaData._id).find(".e-text:visible").first().length > 0) {
                    focEle.push($("#" + this._schemaData._id).find(".e-text:visible").first());
                }
                if (!ej.isNullOrUndefined(this._schemaData) && $("#" + this._schemaData._id).find(".e-pvtBtn:visible").first().length > 0) {
                    focEle.push($("#" + this._schemaData._id).find(".e-pvtBtn:visible").first());
                }
                if ($(".e-pivotpager[data-targetcontrolid='" + this._id + "']:visible").length > 0 && $("#Pager_CategCurrentPage:visible").length > 0) {
                    focEle.push($("#Pager_CategCurrentPage:visible"));
                }
                if ($(".e-pivotpager[data-targetcontrolid='" + this._id + "']:visible").length > 0 && $("#Pager_SeriesCurrentPage:visible").length > 0) {
                    focEle.push($("#Pager_SeriesCurrentPage:visible"));
                }
                if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.attr("tabindex", "0").removeClass("e-hoverCell");
                    if (this._curFocus.tab.hasClass("e-active")) {
                        this._curFocus.tab.removeClass("e-active");
                    }
                    if (!ej.isNullOrUndefined(this._schemaData)) {
                        $("#" + this._schemaData._id).find(".e-active").removeClass("e-active");
                        $("#" + this._schemaData._id).find(".e-node-hover").removeClass("e-node-hover");
                        $("#" + this._schemaData._id).find(".e-node-focus").removeClass("e-node-focus");
                    }
                    if (this._curFocus.tab.hasClass("e-node-hover")) {
                        this._curFocus.tab.removeClass("e-node-hover");
                    }
                    this._curFocus.tab.mouseleave();
                    if (e.which === 9 && e.shiftKey) {
                        this._index.index = this._index.index - 1 < 0 ? focEle.length - 1 : this._index.index - 1;
                    }
                    else if (e.which === 9) {
                        this._index.index = this._index.index + 1 > focEle.length - 1 ? 0 : this._index.index + 1;
                    }
                    this._curFocus.tab = focEle[this._index.index].attr("tabindex", "-1");
                }
                else {
                    this._curFocus.tab = focEle[0].attr("tabindex", "-1");
                }
                this._curFocus.tab.focus().addClass("e-hoverCell").mouseover();
                if (this.model.hyperlinkSettings.enableColumnHeaderHyperlink) {
                    this._curFocus.tab.mouseover();
                    this._curFocus.tab.find("span").mouseover();
                }
                $(".e-node-focus").removeClass("e-node-focus");
                e.stopImmediatePropagation();
            }
            if (e.which === 93 && !$(".pivotTree:visible,.pivotTreeContext:visible,.pivotTreeContextMenu:visible").length > 0 && this.model.enableGroupingBar && (!ej.isNullOrUndefined(this._curFocus.grp) || !ej.isNullOrUndefined(this._curFocus.tab))) {
                e.preventDefault();
                if (document.activeElement.className.startsWith("e-pivotButton")) {
                    if (!ej.isNullOrUndefined(this._curFocus.grp)) {
                        var position = { x: $(this._curFocus.grp).offset().left + $(this._curFocus.grp).outerWidth(), y: $(this._curFocus.grp).offset().top + $(this._curFocus.grp).outerHeight() };
                        this._curFocus.grp.find("button").trigger({ type: 'mouseup', which: 3, clientX: position.x, clientY: position.y, pageX: position.x, pageY: position.y });
                    }
                    else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                        var position = { x: $(this._curFocus.tab).offset().left + $(this._curFocus.tab).outerWidth(), y: $(this._curFocus.tab).offset().top + $(this._curFocus.tab).outerHeight() };
                        this._curFocus.tab.find("button").trigger({ type: 'mouseup', which: 3, clientX: position.x, clientY: position.y, pageX: position.x, pageY: position.y });
                    }
                }
            }
            if (e.which === 13 && this.model.hyperlinkSettings.enableColumnHeaderHyperlink) {
                if (!ej.isNullOrUndefined(this._curFocus.cell)) {
                    this._curFocus.cell.find(".cellValue").click();
                }
                else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.find(".cellValue").click();
                }
            }
            else if (e.which == 13 && !$(".pivotTree:visible,.pivotTreeContext:visible,.pivotTreeContextMenu:visible").length > 0 && !$(".e-waitpopup-pane:visible").length > 0) {
                if ($("#" + this._id).find(".e-dialog:visible").length > 0) {
                    if ($(e.target).hasClass("e-memberCurrentPage") || $(e.target).hasClass("e-memberCurrentSearchPage") || $(e.target).hasClass("e-memberCurrentDrillPage")) {
                        ej.Pivot.editorTreeNavigatee(e, this);
                        return;
                    }
                    if ($(e.target).hasClass("searchEditorTreeView")) {
                        ej.Pivot._searchEditorTreeNodes(e, this);
                        return;
                    }
                }
                if ($("#" + this._id).find(".e-dialog .e-hoverCell").length > 0 && $("#" + this._id).find(".e-dialog .e-hoverCell").hasClass("e-text")) {
                    $("#" + this._id).find(".e-dialog .e-hoverCell").parent().find(".e-chkbox-small").click();
                }
                else if (document.activeElement.className.startsWith("e-pivotGridTable") || document.activeElement.getAttribute("role") == "rowheader" || document.activeElement.getAttribute("role") == "columnheader") {
                    if (!ej.isNullOrUndefined(this._curFocus.cell)) {
                        if ((this._curFocus.cell).find(".e-expand,.e-collapse").length > 0) {
                            this._curFocus.cell.find(".e-expand,.e-collapse").click();
                            this._curFocus.cell.removeClass("e-hoverCell").attr("tabindex", "0");
                            this._curFocus.cell = $("#" + this._id).find("[role='" + this._curFocus.cell.attr("role") + "']:contains('" + this._curFocus.cell.text() + "'):visible").first();
                            this._curFocus.cell.attr("tabindex", "-1").focus().addClass("e-hoverCell");
                        }
                        else {
                            this._curFocus.cell.click();
                            this._curFocus.cell.removeClass("e-hoverCell").attr("tabindex", "0");
                            this._curFocus.cell = $("#" + this._id).find("[data-p='" + this._curFocus.cell.attr("data-p") + "']");
                            this._curFocus.cell.attr("tabindex", "-1").focus().addClass("e-hoverCell");
                        }
                        
                    }
                    else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                        if ((this._curFocus.tab).find(".e-expand").length > 0) {
                            this._curFocus.tab.find(".e-expand").click();
                        }
                        else if ((this._curFocus.tab).find(".e-collapse").length > 0) {
                            this._curFocus.tab.find(".e-collapse").click();
                        }
                        this._curFocus.tab = $("#" + this._id).find("[role='" + this._curFocus.tab.attr("role") + "']:contains('" + this._curFocus.tab.text() + "'):visible").first();
                        this._curFocus.tab.attr("tabindex", "-1").focus().addClass("e-hoverCell");
                    }
                }
                else if (!ej.isNullOrUndefined(this._curFocus.tree) || !ej.isNullOrUndefined(this._curFocus.formula) || (!ej.isNullOrUndefined(this._curFocus.field) && this._curFocus.field.hasClass("editFormula"))) {
                    if ($("#" + this._id).find(".e-dialog .e-hoverCell:visible").length > 0) {
                        $("#" + this._id).find(".e-dialog .e-hoverCell:visible").click();
                        this._index.tree = 1;
                    }
                }
                if ($(".e-pivotpager[data-targetcontrolid='" + this._id + "']:visible").length > 0 && (!ej.isNullOrUndefined(this._curFocus.tab))) {
                    this._curFocus.tab.attr("tabindex", "-1").focus();
                }
            }
            if (e.keyCode == 79 && $("#" + this._id).find(".e-dialog").length > 0) {
                if (e.ctrlKey) {
                    e.preventDefault();
                    $("#" + this._id).find(".e-dialogOKBtn:visible").click();
                    this._index.field = 0;
                    this._index.filter = 0;
                    if (this.model.dataSource.enableAdvancedFilter) {
                        this._index.dialog = 0;
                    }
                    else {
                        this._index.dialog = 1;
                    }
                    this._curFocus.tree = null;
                    var focEl;
                    if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                        this._curFocus.tab.mouseleave().removeClass("e-hoverCell");
                    }
                    if (!ej.isNullOrUndefined(this._curFocus.grp)) {
                        var tag = this._curFocus.grp.attr("data-tag");
                        focEl = this._curFocus.grp = $("#" + this._id).find("[data-tag='" + tag + "']");
                    }
                    else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                        var tag = this._curFocus.tab.attr("data-tag");
                        focEl = this._curFocus.tab = $("#" + this._id).find("[data-tag='" + tag + "']");
                    }
                    if (!ej.isNullOrUndefined(focEl)) {
                        focEl.mouseover().addClass("e-hoverCell").focus();
                    }
                }
            }
            if (e.keyCode == 67 && $("#" + this._id).find(".e-dialog:visible").length > 0) {
                if (e.ctrlKey) {
                    e.preventDefault();
                    $("#" + this._id).find(".e-dialogCancelBtn:visible").click();
                    this._index.field = 0;
                    this._index.filter = 0;
                    if (this.model.dataSource.enableAdvancedFilter) {
                        this._index.dialog = 0;
                    }
                    else {
                        this._index.dialog = 1;
                    }
                    this._curFocus.tree = null;
                    var focEl;
                    if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                        this._curFocus.tab.mouseleave().removeClass("e-hoverCell");
                    }
                    if (!ej.isNullOrUndefined(this._curFocus.grp)) {
                        var tag = this._curFocus.grp.attr("data-tag");
                        focEl = this._curFocus.grp = $("#" + this._id).find("[data-tag='" + tag + "']");
                    }
                    else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                        var tag = this._curFocus.tab.attr("data-tag");
                        focEl = this._curFocus.tab = $("#" + this._id).find("[data-tag='" + tag + "']");
                    }
                    if (!ej.isNullOrUndefined(focEl)) {
                        focEl.mouseover().addClass("e-hoverCell").focus();
                    }
                }
            }
        },

        _unWireEvents: function () {
            this._off(this.element, "mousedown", ".value", this._initCellEditing)
            this._off(this.element, "click", ".colheader,.cstot,.cgtot,.calc,.stot,.gtot");
            this._off($(document), 'keydown', this._keyDownPress);
            this._off($(document), 'keyup', this._keyUpPress);
            this._off(this.element.find("a.e-linkPanel"), "click", ej.Pivot._editorLinkPanelClick);
            this._off(this.element, "click", "#preventDiv");
            this._off(this.element, "click", "table .e-expand,table .e-collapse");
            this._off(this.element, "dblclick", ".value, .summary");
            this._off(this.element, "click", ".value, .summary");
            this._off(this.element, "mouseover", ".colheader, .rowheader, .e-expand, .e-collapse");
            this._off(this.element, "mouseleave", ".colheader, .rowheader, .e-expand, .e-collapse");
            this._off(this.element, "mouseover", this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ".value, .rowheader, .colheader" : ".value, .rowheader, .colheader, .summary", this.addHyperlinkHandler);
            this._off(this.element, "mouseleave", this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ".value, .rowheader, .colheader" : ".value, .rowheader, .colheader, .summary", this.removeHyperlinkHandler);
            this._off(this.element, "click", this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ".value, .rowheader, .colheader" : ".value, .rowheader, .colheader, .summary");
            this._off(this.element, "click", this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ".value .cellValue, .rowheader .cellValue, .colheader .cellValue" : ".value .cellValue, .rowheader .cellValue, .colheader .cellValue, .summary .cellValue");
            this._off(this.element, "mouseover", ".value");
            this._off(this.element, "mouseleave", ".value");
            this._off(this.element, "mousedown touchstart", ".value");
            this._off(this.element, "mouseup touchend", ".value");
            this._off(this.element, "click", ".filter");
            this._off(this.element, "click", ".e-sorting");
            this._off(this.element, "click", ".e-removeBtn");
            this._off(this.element, "mouseover", ".e-pvtBtn");
            this._off(this.element, "mouseleave", ".e-pvtBtn");
            $(document).off("keyup", this._endCellSelection);
            $(document).off("keydown", this._startCellSelection);
            $(document).off("click", this._clearSelection);
            this._off(this.element, "click", ".calculatedFieldPopup .menuItem ");
            this._off(this.element, "contextmenu", ".values .e-pivotButton");
            this._off(this.element, "click", ".filter", ej.proxy(this._filterBtnClick, this));
            this._off(this.element, "click", ".e-sorting", ej.proxy(this._sortBtnClick, this));
            this._off(this.element, "click", ".e-removeBtn", ej.proxy(this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode? this._removePvtBtn:this._clientRemovePvtBtn, this));
            this._off(this.element, "click", ".e-ascOrder, .e-descOrder");
            this._off(this.element, "click", ".clearAllFilters, .clearSorting");
            this._off(this.element, "contextmenu");
            this._off(this.element, "click", ".e-dialogOkBtn");
            this._off(this.element, "click", ".e-cellSelect");
            this._off(this.element, "click", ".e-columnResize");
            this._off(this.element, "click", ".e-excelLikeLayout");
            this._off(this.element, "click", ".e-advancedFiltering");
            this._off(this.element, "click", ".e-toolTip");
            this._off(this.element, "click", ".e-collapseByDefault");
            this._off(this.element, "click", ".rtl");
            this._off(this.element, "click", ".e-calculatedField");
            this._off(this.element, "click", ".e-cellEditing");
            this._off(this.element, "click", ".groupingBar");
            this._off(this.element, "click", ".e-conditionalFormat");
            this._off(this.element, "click", ".e-summaryCustomize");
            this._off(this.element, "click", ".e-summaryTypes");
            this._off(this.element, "click", ".e-numberFormatting");
            this._off(this.element, "click", ".e-rowHeaderHyperLink");
            this._off(this.element, "click", ".e-colHeaderHyperLink");
            this._off(this.element, "click", ".e-valueCellHyperLink");
            this._off(this.element, "click", ".e-summaryCellHyperLink");
            this._off(this.element, "click", ".e-rowFreeze");
            this._off(this.element, "click", ".e-colFreeze");
            this._off(this.element, "click", ".bothFreeze");
            this._off(this.element, "click", ".e-excel");
            this._off(this.element, "click", ".e-word");
            this._off(this.element, "click", ".e-pdf");
            this._off(this.element, "click", ".csv");
            this._off(this.element, "click", ".e-frozenHeaders");
            this._off(this.element, "click", ".e-exporting");
            this._off(this.element, "click", ".e-layouts");
            this._off(this.element, "click", ".e-hyperlinkOptions");
            this._off(this.element, "click", ".e-normalLayout");
            this._off(this.element, "click", ".e-normalTopSummaryLayout");
            this._off(this.element, "click", ".e-noSummariesLayout");
            this._off(this.element, "click", ".e-drillThrough");
            this._off(this.element, "mousedown touchstart", ".value", this._initCellSelection);
            this._off(this.element, "click", ".colheader,.rowheader", this._headerClickCellSelection);
            this._off(this.element, "click", ".e-nextPage, .e-prevPage, .e-firstPage, .e-lastPage");
            this._off(this.element, "click", ".e-searchEditorTree");
        },

        _getFieldName: function (cell) {
            if ($(cell).hasClass("colheader") || $(cell).attr("role") == "columnheader") {
                var columnPos = parseInt($(cell).attr('data-p').split(',')[1]);
                var items = (ej.isNullOrUndefined(this.model.dataSource.data) || this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) ? (($(this.element).parents(".e-pivotclient").length > 0 && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) ? JSON.parse(this._pivotClientObj.getOlapReport()).PivotColumns : JSON.parse(this.getOlapReport()).PivotColumns) : this.model.dataSource.columns;
                var textContent = cell.textContent.replace("expanded", "");
                return columnPos < items.length ? this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? items[columnPos].fieldName : items[columnPos].FieldName : textContent;
            }
            else if ($(cell).hasClass("rowheader") || $(cell).attr("role") == "rowheader") {
                var rowPos = parseInt($(cell).attr('data-p').split(',')[0]);
                //return ej.isNullOrUndefined(this.model.dataSource.rows[rowPos]) ? JSON.parse(this.getOlapReport()).PivotRows[rowPos].FieldName : this.model.dataSource.rows[rowPos].fieldName;
                return (ej.isNullOrUndefined(this.model.dataSource.data) || this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) ? ((this.element.parents(".e-pivotclient").length > 0 && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) ? JSON.parse(this._pivotClientObj.getOlapReport()).PivotRows[rowPos].FieldName : JSON.parse(this.getOlapReport()).PivotRows[rowPos].FieldName) : (!ej.isNullOrUndefined(this.model.dataSource.rows) ? this.model.dataSource.rows[rowPos].fieldName : "");
            }
        },
        _colResizing: function (e) {
            if (this.model.enableColumnResizing) {
                if (this._expand) {
                    var x = e.clientX;
                    var y = e.clientY;
                    var _hedBound = this.element.find('thead,.pivotGridFrozenTable,.pivotGridColValueTable').first()[0].getBoundingClientRect();
                    if ((_hedBound.left + document.documentElement.scrollLeft + _hedBound.width < x) || (x < _hedBound.left + document.documentElement.scrollLeft)) {
                        this.element.find(".e-reSizeColbg").remove();
                    }
                    else if (this._currentCell != -1) {
                        this.element.find(".e-reSizeColbg").css({ left: x, top: this._tableY });
                    }
                }
                else {
                    if (this.element.find(".e-reSizeColbg").is(":visible"))
                        return;
                    if ($(e.target).attr("role") == "columnheader") {
                        var resCell = this.resCell = e.target;
                        var celLoc = resCell.getBoundingClientRect();
                        var x = e.clientX;
                        var y = e.clientY;
                        if (this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders)
                            var tothedwidth = $('.pivotGridFrozenTable,.pivotGridColValueTable').width() + $('.pivotGridFrozenTable,.pivotGridColValueTable').find('tr').offset().left;
                        else
                            var tothedwidth = $(this.element).find('thead').width() + $(this.element).find('thead tr').offset().left;
                        if (((x >= (celLoc.left + document.documentElement.scrollLeft + resCell.offsetWidth - 5)) || (x <= (celLoc.left + 3))) && (x < tothedwidth) && (x >= celLoc.left) && (y <= (celLoc.top + document.documentElement.scrollTop + e.target.offsetHeight))) {
                            if (x > (celLoc.left + 3)) {
                                var tempTarget = $(e.target).find("span");
                                this._currentCell = e.target;
                            }
                            else {
                                var tempTarget = $(e.target).prevAll("th:visible:first").find("span");
                                this._currentCell = $(e.target).prev();
                            }
                            if (tempTarget.length)
                                $(e.target).parents('.e-pivotGridTable tr').css("cursor", "col-resize");
                        }
                        else {
                            $(e.target).parent('tr').css("cursor", "pointer");
                            this._currentCell = null;
                        }
                    }
                    else {
                        this.element.find("thead,.pivotGridFrozenTable,.pivotGridColValueTable tr").css("cursor", "pointer");
                        this._currentCell = null;
                    }
                }
            }

           },

        _startColResizing: function (e) {
            if ($(e.target).closest("tr").css("cursor") == 'col-resize') {
                var x = e.clientX; 
                var y = e.clientY;
                this._target = e.target;
                this._orgX = x;
                x += document.documentElement.scrollLeft;
               if (e.button != 2)
               {
                   var hedCel = $(this._target).parent("tr").find("[role='columnheader']");
                   if (this._currentCell != null)
                        var j = $(this._currentCell)[0].getBoundingClientRect();
                   var _top = this._tableY = (j == undefined ? 0 : j.top) + document.documentElement.scrollTop;
                   if ($(this._target).closest("tr").css("cursor") == 'col-resize') {
                       var vElement  = $(document.createElement('div'));
                       var _height = this.model.enableGroupingBar ? this.element.height() - this.element.find(".groupingBarPivot").height() : (this.model.enableVirtualScrolling ? this.element.height() - this.element.find(".e-hScrollPanel").parent().height() : this.element.height());
                       var hRow = this.element.find("thead,.pivotGridFrozenTable,.pivotGridColValueTable").find("tr[role='row']");
                       var curentIndex = ($(this._target).parent("tr")[0]) == undefined ? 0 : $(this._target).parent("tr")[0].rowIndex;
                       for (var i = 0; i < curentIndex; i++) {
                           _height = (_height - $(hRow[i]).height());
                       }
                       vElement.addClass("e-reSizeColbg").appendTo(this.element).attr("unselectable", "on").css("visibility", "hidden");
                       vElement.css({ visibility: "visible", height: _height + 'px', cursor: 'col-resize', left: x, top: _top, position: 'fixed' });
                       this._orgX = x;
                       this._orgY = y;
                       this._expand = true;
                   }
                   else {
                       this._currentCell = null;
                   }
               }
            }
        },
        _endColResizing: function (e) {
            if (this._expand) {
                var x = e.clientX;
                var y = e.clientY;
            }
           this.element.find(".e-reSizeColbg").remove();
           x += document.documentElement.scrollLeft;
           var _rowobj = $(this._target).parents('thead,.pivotGridFrozenTable,.pivotGridColValueTable');
           if (this._currentCell != null && this._expand) {
               var _colMinWid = 30;
               this._expand = false;
               var _outerCell = this._currentCell;
               var _oldWidth = $(_outerCell)[0].offsetWidth;
               var _extra = x - this._orgX;
               var isFrozenHeader=((this.model.frozenHeaderSettings.enableFrozenHeaders || (!this.model.frozenHeaderSettings.enableFrozenColumnHeaders && this.model.frozenHeaderSettings.enableFrozenRowHeaders) || (this.model.frozenHeaderSettings.enableFrozenColumnHeaders && this.model.frozenHeaderSettings.enableFrozenRowHeaders)) && this._JSONRecords[0].CSS == "none");
               if (parseInt(_extra) + parseInt(_oldWidth) > _colMinWid) {
                   if (_extra != 0){
                       _rowobj.css("cursor", 'default');
                       var pos;
                       for(var i=0;i<2;i++){
                           var cell=(i==0)?$(_outerCell):$(_outerCell).next();
                           var colspn = (i == 0) ? parseInt($(_outerCell).attr("colspan")) : parseInt($(_outerCell).next().attr("colspan"));
                           if (cell.length) {
                               
                               if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                                   if ((this.element.find(".e-pivotGridTable").find("[role='columnheader']").find(".e-expand").length > 1 || this.element.find(".e-pivotGridTable").find("[role='columnheader']").find(".e-collapse").length > 1)) {
                                       if (isFrozenHeader)
                                           pos = parseInt(this.element.find(".pivotGridFrozenTable tbody tr:last").find("[data-p^='" + cell.attr("data-p").split(",")[0] + "']").index());
                                       else
                                           pos = parseInt(this.element.find(".e-pivotGridTable thead tr:last").find("[data-p^='" + cell.attr("data-p").split(",")[0] + "']").index()) + (this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout? 1: this._JSONRecords[0].ColSpan);
                                   }
                                   else {
                                       if (isFrozenHeader)
                                           pos = parseInt(cell.attr("data-p").split(",")[0]) - this._JSONRecords[0].ColSpan;
                                       else
                                           pos = this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? (!ej.isNullOrUndefined(cell.attr('data-i')) ? (parseInt(cell.attr('data-i').split(",")[0])) : (parseInt(cell.attr('data-p').split(",")[0]))) : parseInt(cell.attr("data-p").split(",")[0]);
                                   }

                               }
                               else if (isFrozenHeader)
                                   pos = parseInt(cell.attr("data-p").split(",")[0]) - this._JSONRecords[0].ColSpan;
                               else if (this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout)
                                   pos = parseInt(cell.attr('data-i').split(",")[0]);
                               else
                                   pos = parseInt(cell.attr("data-p").split(",")[0]);

                               var _newExtra = Math.round(_extra / colspn);
                               var colWidth = (this.element.find("col:eq(" + pos + ")").width()) + ((i == 0) ? _newExtra : (-_newExtra));
                               this._setWidthColResize(pos, colspn, colWidth);
                           }
                       }
                       this.element.find("tr").css("cursor", "default");
                   }
               }
            }
               if (this.model.enableGroupingBar)
                   this._createFields(null, $("#" + this._id).find(".e-pivotGridTable").width(), $("#" + this._id).find(".e-pivotGridTable th").outerWidth());
               if (this.model.frozenHeaderSettings.enableFrozenRowHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenHeaders) {
                   var scroll = this.element.find(".e-scroller").data("ejScroller");
                   if (!ej.isNullOrUndefined(scroll)) scroll.refresh();
               }
               if(!this.model.frozenHeaderSettings.enableFrozenColumnHeaders && this.model.frozenHeaderSettings.enableFrozenRowHeaders)
                {
                    var scroll = this.element.find(".e-scroller").data("ejScroller");
                    scroll.model.enableTouchScroll = false;
                }
                if (this.model.frozenHeaderSettings.enableFrozenColumnHeaders && !this.model.frozenHeaderSettings.enableFrozenRowHeaders)
                {
                    if (this.element.find("#coltable").width() < this.element.find(".valScrollArea").width())
                        this.element.find("#coltable").width(this.element.find(".valScrollArea").width());
                }
            this._target = null;
            this.element.find(".e-reSizeColbg").remove();
            this._expand = false;
            this._currentCell = null;
        },
        _setWidthColResize: function (pos, colspn, colWidth) {
            var colMinWidth = 30;
            var newWidth = colWidth > colMinWidth ? colWidth : colMinWidth;
            for (var lim = pos; lim < (pos + colspn) ; lim++)
                this.element.find("colgroup").find("col:eq(" + lim + ")").outerWidth(newWidth);
        },
        _resizeColumnsWidth: function () {
            if ((!this.model.frozenHeaderSettings.enableFrozenHeaders && !this.model.frozenHeaderSettings.enableFrozenColumnHeaders && !this.model.frozenHeaderSettings.enableFrozenRowHeaders) && !ej.isNullOrUndefined(this._JSONRecords)) {
                this.element.find(".e-pivotGridTable").find("colgroup").remove();
                var colgroup = $("<colgroup></colgroup>");
              if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && !ej.isNullOrUndefined(this.model.dataSource.columns) && (this.model.dataSource.columns.length == 0 || this.model.dataSource.columns.length == 1) || this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && !ej.isNullOrUndefined(JSON.parse(this.getOlapReport()).PivotColumns) && (JSON.parse(this.getOlapReport()).PivotColumns.length == 0 || JSON.parse(this.getOlapReport()).PivotColumns.length==1)) {
                	for(var i=0;i<this.element.find(".e-pivotGridTable thead tr:first th").length;i++)
                	{
                	    for (var j = 0; j < Number(this.element.find(".e-pivotGridTable thead tr:first th:eq(" + i + ")").attr("colspan")) ; j++)
                		{
                	        var element = this.element.find(".e-pivotGridTable thead tr:first th:eq(" + i + ")");
                		    var col = "<col style='width:" + (!ej.isNullOrUndefined(element.offsetWidth) ? element.offsetWidth : element.outerWidth()) / Number(element.attr("colspan")) + "px'></col>";
                			colgroup.append(col);
                		}
                	}
                }
                else {
                    for (var i = 0; i < (this._JSONRecords.length / this._rowCount) ; i++) {
                        if (ej.isNullOrUndefined(this.element.find(".e-pivotGridTable tbody tr:first").children()[i]))
                            break;
                        var col = "<col style='width:" + this.element.find(".e-pivotGridTable tbody tr:first").children()[i].offsetWidth / Number($(this.element.find(".e-pivotGridTable tbody tr:first").children()[i]).attr("colspan")) + "px'></col>";
                        colgroup.append(col);
                    }
                }
                this.element.find(".e-pivotGridTable").prepend(colgroup);
                if (this.model.enableColumnResizing && this.model.resizeColumnsToFit)
                    this.element.find(".e-pivotGridTable").css("width", "100%");
                
                if (this.model.enableGroupingBar) {
                    var rowAreaWidth = (this.element.find(".groupingBarPivot .values").width() > this.element.find(".e-grpRow .e-rows").width()) ? this.element.find(".groupingBarPivot .values").width() : this.element.find(".e-grpRow .e-rows").width();
                    if (this._JSONRecords.length > 0 && this._JSONRecords[0].ColSpan >= 1 && !this.model.resizeColumnsToFit) {
                        for (var i = 0; i < this._JSONRecords[0].ColSpan; i++) {
                            this.element.find("colgroup col:eq(" + i + ")").css("width", rowAreaWidth / this._JSONRecords[0].ColSpan);
                        }
                    }
                    if ((this.element.find(".groupingBarPivot .values").width() < this.element.find(".e-grpRow .e-rows").width()))
                        this.element.find(".groupingBarPivot .values").css("width", this.element.find(".e-grpRow .e-rows").width());
                    if (this.element.find(".e-grpRow").length > 0 && this.element.find("colgroup col:eq(" + 0 + ")").width()<140)
                        this.element.find("colgroup col:eq("+0+")").css("min-width","140px");
                    this.element.find(".values").width(this.element.find(".e-grpRow").length > 0 ? this.model.enableDeferUpdate && this.element.find(".colheader").length == 0 ? this.element.find(".e-grpRow").width() : this.element.find(".e-grpRow").width() + 4 : 140);
                    this._createFields(null, this.element.find(".e-pivotGridTable").width(), $("#" + this._id).find(".e-pivotGridTable th").outerWidth());
                }
                
           }
        },
        _direction: function (value) {
            if (this.model.enableRTL && !ej.isNullOrUndefined(value) && value.toString().indexOf('-') > -1)
                return value.split('-').reverse().join('-');
            else
                return value;
        },

        _clearSelection: function (e) {
            if ($(e.target).parents(".e-pivotGridTable").length == 0)
                $(this.element).find(".e-selected").removeClass("e-selected");
        },

        _startCellSelection: function (e) {
            if (this._onholdKey == "Control" || ej.isNullOrUndefined(this._selectedCell)) return;
            e.preventDefault();
            if (this._onholdKey == "") this._onholdKey = e.which.toString() == "16" ? "Shift" : e.which.toString() == "17" ? "Control" : "";
            if (e.which == "40") {  //Down arrow
                var selectedCellPos = $(this._selectedCell).attr('data-p'), i = parseInt(selectedCellPos.split(',')[1]) + this._selectedCell.rowSpan, newCell;
                while (ej.isNullOrUndefined(newCell) && i < this._rowCount) {
                    var currentCell = $(this.element).find("[data-p='" + selectedCellPos.split(',')[0] + "," + i + "']")[0];
                    if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader")) newCell = currentCell;
                    i++;
                }
                if (!ej.isNullOrUndefined(newCell))
                    this._selectCells("Down", newCell);
            }
            else if (e.which == "38") {  //Up arrow
                var selectedCellPos = $(this._selectedCell).attr('data-p'), i = parseInt(selectedCellPos.split(',')[1]) - 1, newCell;
                while (ej.isNullOrUndefined(newCell) && i >= 0) {
                    var currentCell = $(this.element).find("[data-p='" + selectedCellPos.split(',')[0] + "," + i + "']")[0];
                    if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader")) newCell = currentCell;
                    i--;
                }
                if (ej.isNullOrUndefined(newCell) && this._onholdKey != "Shift" && ($(this._selectedCell).hasClass("colheader") || $(this._selectedCell).attr('role') == "columnheader")) {
                    for (column = parseInt(selectedCellPos.split(',')[0]) - 1; column > 0 && ej.isNullOrUndefined(newCell) ; column--) {
                        for (row = parseInt(selectedCellPos.split(',')[1] - 1) ; row >= 0 && ej.isNullOrUndefined(newCell) ; row--) {
                            var currentCell = $(this.element).find("[data-p='" + column + "," + row + "']")[0];
                            if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader")) newCell = currentCell;
                        }
                    }
                }
                if (!ej.isNullOrUndefined(newCell))
                    this._selectCells("Up", newCell);
            }
            else if (e.which == "39") {  //Right arrow
                var selectedCellPos = $(this._selectedCell).attr('data-p'), i = parseInt(selectedCellPos.split(',')[0]) + this._selectedCell.colSpan, newCell;
                while (ej.isNullOrUndefined(newCell) && i < Math.ceil(this.getJSONRecords().length / this._rowCount)) {
                    var currentCell = $(this.element).find("[data-p='" + i + "," + selectedCellPos.split(',')[1] + "']")[0];
                    if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader")) newCell = currentCell;
                    i++;
                }
                if (!ej.isNullOrUndefined(newCell))
                    this._selectCells("Right", newCell);
            }
            else if (e.which == "37") {  //Left Arrow
                var selectedCellPos = $(this._selectedCell).attr('data-p'), i = parseInt(selectedCellPos.split(',')[0]) - 1, newCell;
                var newCell = $(this.element).find("[data-p='" + (parseInt(selectedCellPos.split(',')[0]) - 1) + "," + selectedCellPos.split(',')[1] + "']")[0];
                while (ej.isNullOrUndefined(newCell) && i >= 0) {
                    var currentCell = $(this.element).find("[data-p='" + i + "," + selectedCellPos.split(',')[1] + "']")[0];
                    if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader")) newCell = currentCell;
                    i--;
                }
                if (ej.isNullOrUndefined(newCell) && this._onholdKey != "Shift" && ($(this._selectedCell).hasClass("rowheader") || $(this._selectedCell).attr('role') == "rowheader")) {
                    var j = parseInt(selectedCellPos.split(',')[1]) - 1;
                    while (ej.isNullOrUndefined(newCell) && j > 0) {
                        var currentCell = $(this.element).find("[data-p='" + parseInt(selectedCellPos.split(',')[0] - 1) + "," + j + "']")[0];
                        if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader")) newCell = currentCell;
                        j--;
                    }
                }
                if (!ej.isNullOrUndefined(newCell))
                    this._selectCells("Left", newCell);
            }
        },

        _endCellSelection: function (e) {
            if (ej.isNullOrUndefined(this._selectedCell)) return;
            e.preventDefault();
            if (e.which == 16 || e.which == 17) {
                this._onholdKey = "";
                var selectedCells = $(this.element).find(".e-selected");
                if (selectedCells.length > 0) {
                    var selectedCellsInfo = new Array();
                    for (var i = 0; i < selectedCells.length; i++) {
                        var cellPos = $(selectedCells[i]).attr('data-p');
                        var cellInfo = this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + parseInt(cellPos.split(",")[1]))];
                        cellInfo.Value = $.trim($(selectedCells[i]).text());
                            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) cellInfo["Field"] = this._getFieldName(selectedCells[i]);
                        selectedCellsInfo.push(cellInfo);
                    }
                    if (!ej.isNullOrUndefined(this._pivotClientObj))
                        this._pivotClientObj._trigger("cellSelection", { JSONRecords: selectedCellsInfo });
                    else
                        this._trigger("cellSelection", { JSONRecords: selectedCellsInfo });
                }
            }
        },

        _selectCells: function (key, newCell) {
            if (this._onholdKey == "Shift") {
                if ((key == "Up" || key == "Down") && ($(newCell).hasClass("rowheader") || $(newCell).attr("role") == "rowheader") || (key == "Right" || key == "Left") && ($(newCell).hasClass("colheader") || $(newCell).attr("role") == "columnheader")) {
                    var index = key == "Up" || key == "Down" ? 1 : 0;
                    if ((key == "Up" || key == "Left") && (parseInt($(newCell).attr('data-p').split(',')[index]) >= parseInt(this._primaryCellPos.split(',')[index])) || (key == "Right" || key == "Down") && (parseInt($(newCell).attr('data-p').split(',')[index]) <= parseInt(this._primaryCellPos.split(',')[index])))
                        $(this._selectedCell).removeClass("e-selected");
                    else
                        if ($(newCell).attr('data-p') != "0,0") $(newCell).addClass("selected");
                }
            }
            else if ($(newCell).attr('data-p') != "0,0") {
                this.element.find(".e-selected").removeClass("e-selected");
                $(newCell).addClass("e-selected");
                this._primaryCellPos = $(newCell).attr('data-p');
                var selectedCells = $(this.element).find(".e-selected");
                if (selectedCells.length > 0) {
                    var selectedCellsInfo = new Array();
                    for (var i = 0; i < selectedCells.length; i++) {
                        var cellPos = $(selectedCells[i]).attr('data-p');
                        var cellInfo = this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + parseInt(cellPos.split(",")[1]))];
                        cellInfo.Value = $.trim($(selectedCells[i]).text());
                            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) cellInfo["Field"] = this._getFieldName(selectedCells[i]);
                        selectedCellsInfo.push(cellInfo);
                    }
                    if (!ej.isNullOrUndefined(this._pivotClientObj))
                        this._pivotClientObj._trigger("cellSelection", { JSONRecords: selectedCellsInfo });
                    else
                        this._trigger("cellSelection", { JSONRecords: selectedCellsInfo });
                }
            }
            var isValidCell = key == "Up" || key == "Down" ? !$(this._selectedCell).hasClass("colheader") && $(this._selectedCell).attr('role') != "columnheader" : !$(this._selectedCell).hasClass("rowheader") && $(this._selectedCell).attr('role') != "rowheader";
            if ($(newCell).attr('data-p') != "0,0" && (this._onholdKey != "Shift" || isValidCell)) this._selectedCell = newCell;
        },

        _sortBtnClick: function (args) {
            ej.PivotAnalysis._valueSorting = null;
            if (!ej.isNullOrUndefined(this.model.valueSortSettings)) this.model.valueSortSettings.headerText = "";
            this._isUpdateRequired = true;
            if ($(args.delegateTarget).attr("id") == this._id) {
                $(args.target).toggleClass("descending");
                if (!ej.isNullOrUndefined(this._schemaData)) {
                    this._schemaData.element.find(".e-pivotButton[data-tag='" + $(args.target).parent().attr('data-tag') + "']").find(".e-sorting").toggleClass("descending");
                }
            }
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                var fieldName = $(args.target).siblings(".e-pvtBtn").attr("data-fieldName");
                var reportItem = ej.Pivot.getReportItemByFieldName(fieldName, this.model.dataSource).item;
                reportItem.sortOrder = args.target.className.indexOf("descending") >= 0 ? ej.PivotAnalysis.SortOrder.Descending : ej.PivotAnalysis.SortOrder.Ascending;
                this.refreshControl();
            }
            else {
                var sortValues = this._ascdes.split("##"), count = 0;
                for (var i = 0; i < sortValues.length; i++) {
                    if (sortValues[i] == $($(args.target).siblings(".e-pvtBtn")).attr("data-fieldName"))
                        count = 1;
                    else if ($(args.target).parents().hasClass("e-pivotschemadesigner") && sortValues[i] == $($(args.target).siblings(".e-pvtBtn")).text())
                        count = 1;
                }
                var classNames = args.target.className;
                var isDescending = new RegExp("descending");
                if (isDescending.test(classNames)) {
                    if (count == 0) {
                        if ($(args.target).parents().hasClass("e-pivotschemadesigner"))
                            this._ascdes += (($($(args.target).siblings(".e-pvtBtn")).text()) + "##");
                        else
                            this._ascdes += (($($(args.target).siblings(".e-pvtBtn")).attr("data-fieldName")) + "##");
                    }
                }
                else {
                    if (count == 1)
                        this._ascdes = (this._ascdes.replace($($(args.target).siblings(".e-pvtBtn")).attr("data-fieldName") + "##", ""));
                }
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                var report;
                try {
                    report = JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.getOlapReport();
                }
                if (this.model.beforeServiceInvoke != null)
                    this._trigger("beforeServiceInvoke", { action: "sorting", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                var eventArgs = JSON.stringify({ "action": "sorting", "sortedHeaders": this._ascdes, "currentReport": report, "valueSorting": JSON.stringify(this.model.valueSortSettings), "customObject": serializedCustomObject });
                this._waitingPopup = this.element.data("ejWaitingPopup");
                if (!ej.isNullOrUndefined(this._waitingPopup))
                    this._waitingPopup.show();
                if (!this.model.enableDeferUpdate)
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.sorting, eventArgs, this._sortingSuccess);
                else
                    this._waitingPopup.hide();
            }
        },

        calculateCellWidths: function () {
            var args = {
                rowHeight: 0,
                columnWidths: []
            }
            var columnCount;
            columnCount = this._excelLikeJSONRecords != null ? this._excelLikeJSONRecords.length / this._excelRowCount : this.getJSONRecords() != null ? this.getJSONRecords().length / this._rowCount : 0;
            var colSpan = 1, isInserted = false;
            if (columnCount > 0) {
                args.rowHeight = this.element.find('tbody tr:visible').length > 0 ? this.element.find('tbody tr:visible')[0].getBoundingClientRect().height : 0;
                for (var index = 0; index < columnCount && colSpan <= columnCount; index++) {
                    $((this._excelLikeJSONRecords != null ? this.element.find("th[data-i^=" + index + "]:visible") : this.element.find("th[data-p^=" + index + "]:visible"))).each(function () {
                        if ($(this).length > 0 && $(this).attr("colspan") == colSpan && ($(this).attr('data-i') != null ? $(this).attr('data-i').split(",")[0] == index : $(this).attr('data-p').split(",")[0] == index)) {
                            args.columnWidths.push(this.getBoundingClientRect().width);
                            index += colSpan - 1; colSpan = 1; isInserted = true;
                            return false;
                        }
                        else
                            isInserted = false;
                    });
                    if (!isInserted && colSpan != columnCount) {
                        index--;
                        colSpan++;
                    }
                    else
                        colSpan = 1;
                }
            }
            return args;
        },

        _deferUpdate: function () {
            if (!this._isUpdateRequired) return false;
            this._isUpdateRequired = false;
            var report;
            try {
                report = JSON.parse(this.getOlapReport()).Report;
            }
            catch (err) {
                report = this.getOlapReport();
            }
            var filterValues = "";
            for (var i = 0; i < this._filterUpdate.length; i++) {
                filterValues += this._filterUpdate[i] + "%%";
            }
            var serializedCustomObject = JSON.stringify(this.model.customObject);
            var eventArgs = JSON.stringify({ "action": "deferUpdate", "sortedHeaders": this._ascdes, "gridLayout": this.layout(), "filterParams": filterValues, "currentReport": report, "valueSorting": JSON.stringify(this.model.valueSortSettings), customObject: serializedCustomObject });
            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.deferUpdate, eventArgs, this._renderControlSuccess);
            this._filterUpdate = [];
            this._waitingPopup = this.element.data("ejWaitingPopup");
            if (!ej.isNullOrUndefined(this._waitingPopup))
                this._waitingPopup.show();
        },

        _dialogBtnClick: function (args) {
            this.element.find(".e-dialog, .e-clientDialog").hide();
            if (args.model.text.toLowerCase() == "cancel" || !this._isMembersFiltered) {
                ej.Pivot.closePreventPanel(this);
                if (!ej.isNullOrUndefined(this._schemaData))
                    this._schemaData.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
                return false;
            }
            else
                this._savedReportItems = $.extend(true, [], this._currentReportItems);
            if (this.element.find(".e-editorTreeView").find("li span.e-searchfilterselection").length > 0)
                this.element.find(".e-editorTreeView").ejTreeView("removeNode", this.element.find(".e-editorTreeView").find("li span.e-searchfilterselection").closest("li"));
            this._isUpdateRequired = true;
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                var selectedNodes = [], unSelectedNodes = [];
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    ej.PivotAnalysis._valueSorting = null;
                    if (this.model.enableMemberEditorPaging || this._editorTreeData.length > 0) {
                        jQuery.each(this._editorTreeData, function (index, item) { if (item.id != "All" && item.checkedStatus) selectedNodes.push(item.name); });
                        jQuery.each(this._editorTreeData, function (index, item) {
                            if (!item.checkedStatus)
                                unSelectedNodes.push(item.name = item.name == "(blank)" ? "" : item.name);
                        });
                    }
                    else {
                        jQuery.each(this._memberTreeObj.element.find(":input.nodecheckbox:checked"), function (index, item) { if (item.value != "All") selectedNodes.push(item.value); });
                        jQuery.each(this._memberTreeObj.element.find(":input.nodecheckbox:not(:checked)"), function (index, item) {
                            unSelectedNodes.push(item.value = item.value == "(blank)" ? "" : $(item).parents('li').find('a').text());
                        });
                    }
                    this._pivotFilterItems(selectedNodes, unSelectedNodes);
                    var reportItem = ej.Pivot.getReportItemByFieldName(this._selectedField, this.model.dataSource).item;
                    if (reportItem)
                        reportItem["advancedFilter"] = [];
                    this.model.editCellsInfo = {};
                    this._populatePivotGrid();
                }
                else {
                    var filterIndex, isMondrian = this.model.dataSource.providerName == ej.olap.Providers.Mondrian;
                    this._waitingPopup.show();
                    var currElement = this._selectedField.toLocaleLowerCase(),treeNodeState;
                    this._currentReportItems = $.grep(this._currentReportItems, function (value, i) { if (value["data-fieldName"] != undefined && value["data-fieldName"].toLocaleLowerCase() != currElement) return value; });
                    this._memberTreeObj = ej.Pivot.updateTreeView(this);
                    treeNodeState = ej.Pivot.getNodesState((this.model.enableMemberEditorPaging || this._editorTreeData.length > 0) ? this._editorTreeData : this._memberTreeObj);
                    if (this._schemaData != null)
                        this._schemaData._memberTreeObj = this._memberTreeObj;
                    if (this.model.enableMemberEditorPaging || this._editorTreeData.length > 0) {
                        filterIndex = $.extend(true, [], this._editorTreeData);
                    }
                    else
                        filterIndex = this._memberTreeObj.dataSource();
                    if (isMondrian) {
                        var maxLen = 2;
                        for (var itm = 0; itm < filterIndex.length; itm++) {
                            if (!ej.isNullOrUndefined(filterIndex[itm].level) && filterIndex[itm].level > maxLen)
                                maxLen = filterIndex[itm].level;
                        }
                        this.model.dataSource._maxLevel = maxLen;
                    }
                    this._currentReportItems.push({ filterItems: filterIndex, fieldName: this._selectedField, pageSettings: this._memberCount });
                    if (this.model.enableGroupingBar) {
                        var member = ej.Pivot._getEditorMember(currElement, this, false), selMem = "selectedNodes", ftype = "include";
                        this._fieldSelectedMembers[currElement] = $.map(this._fieldMembers[currElement], function (item) { if (!item.checked) return item }).length == 0 ? "All" : ((member != "All" && member != "multiple") ? member : this._getLocalizedLabels("MultipleItems"));
                    }
                    if (isMondrian) {
                        selMem = "unSelectedNodes";
                        ftype = "exclude";
                    }
                    selectedNodes = $.map(treeNodeState[selMem].split("::"), function (element, index) { { return { Id: element.split("||")[0], tag: element.split("||")[1], parentId: element.split("||")[2] } } });//$.map(this._getSelectedNodes().split("::"), function (element, index) { return { Id: element.split("||")[0], tag: element.split("||")[1],parentId:element.split("||")[2] } });
                    var reportItem = ej.Pivot.getReportItemByFieldName(currElement, this.model.dataSource).item;
                    if (!ej.isNullOrUndefined(reportItem)) {
                        if (treeNodeState.unSelectedNodes != "") {
                            this.model.dataSource = this.clearDrilledItems(this.model.dataSource, { action: "filtering" },this);
                            reportItem["advancedFilter"] = [];
                            reportItem.filterItems = { filterType: ftype, values: this._removeSelectedNodes(selectedNodes) };
                            this.element.find(".e-pivotButton:contains('" + this._selectedField + "') .filter").addClass("filtered")
                            if (this._schemaData != null && this._schemaData._tableTreeObj.element.find("li[data-tag='" + this._selectedField + "'] .filter").length == 0){
                                this._schemaData._tableTreeObj.element.find("li[data-tag='" + this._selectedField + "'] div:first .e-text").after(ej.buildTag("span.e-icon", { "display": "none" }).addClass("filter")[0].outerHTML);
                                this._schemaData.element.find(".e-pvtBtn[data-fieldName='"+this._selectedField+"']").parent().find(".filter").addClass("filtered");                            
                            }
                        }
                        else {
                            delete reportItem.filterItems;
                            if (this._schemaData != null){
                                this._schemaData._tableTreeObj.element.find("li[data-tag='" + this._selectedField + "'] .filter").remove();
                                this._schemaData.element.find(".e-pvtBtn[data-fieldName='" + this._selectedField + "']").parent().find(".filter").removeClass("filtered");
                            }
                        }
                    }
                    this.getJSONData({action:"filtering"}, this.model.dataSource, this);
                }
            }
            else {
                var unselectedNodes = "", editorNodes = "", enableFilterIndigator;
                editorNodes = this.element.find(".e-editorTreeView :input.nodecheckbox");
                var uncheckedNodes = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? unselectedNodes = this._getUnSelectedNodes() + "FILTERED" + this._getSelectedNodes(this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? this._curFilteredAxis == "Slicers" ? true : false : this._curFilteredAxis == "Filter" ? true : false) : (this.model.enableMemberEditorPaging || this._editorTreeData.length > 0) ? this._editorTreeData : this._memberTreeObj.element.find(":input:gt(0).nodecheckbox:not(:checked)"), isFiltered = false,
                filterParams = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ((this.model.enableMemberEditorPaging || this._editorTreeData.length > 0) ? ej.Pivot._getUnSelectedTreeState(this) + "FILTERED" + ej.Pivot._getSelectedTreeState((this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? this._curFilteredAxis == "Slicers" ? true : false : this._curFilteredAxis == "Filter" ? true : false), this) : uncheckedNodes) : this._curFilteredAxis + "::" + this._curFilteredText + "::FILTERED";
                var text = this._curFilteredText, textArr = new Array(), obj = {};
                enableFilterIndigator = (this.model.enableMemberEditorPaging || this._editorTreeData.length > 0) ? (ej.Pivot._getUnSelectedTreeState(this) != "" ? true : false) : (this._getUnSelectedNodes() != "" ? true : false);
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    if (this.model.enableGroupingBar && ej.isNullOrUndefined(this._fieldMembers[text]))
                        this._fieldMembers[text] = this._editorTreeData.length > 0 ? $.map(this._editorTreeData, function (itm) { if (itm.id != "(All)_0") return (itm.key || itm.name); }) : ej.Pivot._getEditorMember(editorNodes, this, false);
                    this._removeFilterTag(this._curFilteredText);
                    if (uncheckedNodes.length > 0 && uncheckedNodes[0].id == "(All)_0") uncheckedNodes.splice(0, 1);
                    for (var i = 0; i < uncheckedNodes.length; i++) {
                        if (!this.model.enableMemberEditorPaging && this._editorTreeData.length == 0)
                            textArr.push($(uncheckedNodes[i].parentElement).siblings("a").text());
                        else {
                            if (uncheckedNodes[i].checkedStatus == false)
                                textArr.push(uncheckedNodes[i].key || uncheckedNodes[i].name);
                        }
                    }
                    obj[text] = textArr;
                    if (ej.isNullOrUndefined(this._tempFilterData))
                        this._tempFilterData = new Array();
                    for (var i = 0; i < this._tempFilterData.length; i++) {
                        if (!ej.isNullOrUndefined(this._tempFilterData[i][text])) {
                            this._tempFilterData[i][text] = textArr;
                            isFiltered = true;
                        }
                    }
                    if (!isFiltered)
                        this._tempFilterData.push(obj);
                    if (this._schemaData != null) {
                        this._schemaData._tempFilterData = this._tempFilterData;
                    }
                    if (ej.isNullOrUndefined(this._curFilteredAxis) || this._curFilteredAxis != "") {
                        for (var i = 0; i < uncheckedNodes.length; i++) {
                            if (!this.model.enableMemberEditorPaging && this._editorTreeData.length == 0)
                                filterParams += "##" + $(uncheckedNodes[i].parentElement).siblings("a").text();
                            else {
                                if (uncheckedNodes[i].checkedStatus == false)
                                    filterParams += "##" + (uncheckedNodes[i].key || uncheckedNodes[i].name);
                            }
                        }
                    }
                }
                else {
                    if (this.model.enableGroupingBar) {
                        var member = ej.Pivot._getEditorMember(text.split(":")[1], this, false);
                        this._fieldSelectedMembers[text.split(":")[1]] = $.map(this._fieldMembers[text.split(":")[1]], function (item) { if (!item.checked) return item; }).length == 0 ? "All" : ((member != "All" && member != "multiple") ? member : this._getLocalizedLabels("MultipleItems"));
                    }
                    obj[(this._curFilteredText).split(":")[1]] = filterParams;
                    if (ej.isNullOrUndefined(this._tempFilterData))
                        this._tempFilterData = new Array();
                    for (var i = 0; i < this._tempFilterData.length; i++) {
                        if (!ej.isNullOrUndefined(this._tempFilterData[i][(this._curFilteredText).split(":")[1]])) {
                            this._tempFilterData[i] = obj;
                            isFiltered = true;
                        }
                    }
                    if (!isFiltered)
                        this._tempFilterData.push(obj);
                }
                var filteredBtn = this.model.layout == "excel" ? this.element.find(".e-schemaFieldTree li:contains('" + this._curFilteredText + "')") : this.element.find("." + this._curFilteredAxis + " .e-pivotButton:contains(" + this._curFilteredText + ") .filterBtn");
                var filterEle = this._curFilteredText;
                if (this.model.layout == ej.PivotGrid.Layout.Normal && this._schemaData != null) {
                    for (var i = 0; i < this._schemaData.element.find(".e-fieldTable").find("li").length; i++) {
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                            if (this._curFilteredText.split(":")[1] == $(this._schemaData.element.find(".e-fieldTable").find("li")[i]).attr("data-tag").replace(/\]/g, '').replace(/\[/g, '')) {
                                this._schemaData._selectedTreeNode = this._schemaData.element.find(".e-fieldTable").find("li")[i];
                                filterEle = this._curFilteredText.split(":")[1].split(".")[1];
                                }
                        }
                        else {
                            if (this._curFilteredText == this._schemaData.element.find(".e-fieldTable").find("li")[i].id) {
                                this._schemaData._selectedTreeNode = this._schemaData.element.find(".e-fieldTable").find("li")[i];
                                filterEle = this._curFilteredText;
                                }
                        }
                    }
                    if ($(this._schemaData._selectedTreeNode).parents("li:eq(0)").children().children("span").hasClass("e-hierarchyCDB")) {
                        this._schemaData._selectedTreeNode = $($(this._schemaData._selectedTreeNode).parents("li:eq(0)"));
                    }
                    if (enableFilterIndigator && $(this._schemaData._selectedTreeNode).find(".filter").length <= 0) {
                        var filterSpan = ej.buildTag("span.e-icon", { "display": "none" }).addClass("filter")[0].outerHTML;
                        $($(this._schemaData._selectedTreeNode).find(".e-text")[0]).after(filterSpan);
                        this._schemaData.element.find(".e-pvtBtn:contains('" + filterEle + "')").parent().find(".filter").addClass("filtered");
                    }
                    else if (!enableFilterIndigator) {
                        $(this._schemaData._selectedTreeNode).find(".filter").remove();
                        this._schemaData.element.find(".e-pvtBtn:contains('" + filterEle + "')").parent().find(".filter").removeClass("filtered");
                    }
                    if (this._curFilteredAxis == "")
                        return false;
                }
                var report;
                try {
                    report = JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.getOlapReport();
                }
                if (this.model.enableAdvancedFilter)
                {
                    if (this._selectedLevelUniqueName) {
                        if (this._selectedLevelUniqueName.split("].").length == 3) {
                            var filterInfo = this._getAdvancedFilterInfo(this._selectedLevelUniqueName.split("].").slice(0, 2).join(".").replace(/\[/g, ''));
                            if (filterInfo.length > 0)
                                this._removeFilterTag(filterInfo[0].levelUniqueName);
                        }
                    }
                }
				if (this._dialogHead == "KPI")
                   filterParams = uncheckedNodes;
                if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                    this._trigger("beforeServiceInvoke", { action: "filtering", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject), eventArgs = this.model.customObject != {} && filterParams != "" ? JSON.stringify({ "action": "filtering", "filterParams": filterParams, "sortedHeaders": this._ascdes, "currentReport": report, "valueSorting": JSON.stringify(this.model.valueSortSettings), "customObject": serializedCustomObject, "gridLayout": this.model.layout }) : this.model.customObject != {} ? JSON.stringify({ "action": "filtering", "currentReport": report, "customObject": serializedCustomObject, "gridLayout": this.model.layout }) : filterParams != "" ? JSON.stringify({ "action": "filtering", "filterParams": filterParams, "sortedHeaders": this._ascdes, "currentReport": report, "gridLayout": this.model.layout }) : JSON.stringify({ "action": "filtering" });
                this._waitingPopup = this.element.data("ejWaitingPopup");
                if (!ej.isNullOrUndefined(this._waitingPopup))
                    this._waitingPopup.show();
                if (!ej.isNullOrUndefined(this._schemaData))
                    this._schemaData.element.find(".schemaNoClick").addClass("freeze").width($(this._schemaData.element).width()).height($(this._schemaData.element).height()).css({ "top": $(this._schemaData.element).offset().top, "left": $(this._schemaData.element).offset().left });
                if (!this.model.enableDeferUpdate)
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.filtering, eventArgs, this._filterElementSuccess);
                else {
                    this._filterUpdate.push(filterParams);
                    $.each(this.element.find(".e-pivotButton .filter"), function (index, itm) {
                        $(itm).removeClass("filtered")
                    })
                    if (!ej.isNullOrUndefined(this._tempFilterData)) {
                        for (var j = 0; j < this._tempFilterData.length; j++) {
                            for (var key in this._tempFilterData[j]) {
                                if (this.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap) {
                                    if (key == text.split(':')[1] && this._tempFilterData[j][text.split(':')[1]].split("FILTERED::")[0].length > 0)
                                        this.element.find(".e-pivotButton[data-tag='" + text + "']").find("span.filter").addClass("filtered");
                                }
                                else {
                                    if (key == text && this._tempFilterData[j][text].length > 0)
                                        this.element.find("#pivotButton" + text).next().addClass("filtered");
                                }
                            }
                        }
                    }
                    ej.Pivot.closePreventPanel(this);
                    if (this.model.enableGroupingBar)
                        this._refreshGroupingBar(this);                    
                    if (!ej.isNullOrUndefined(this._schemaData))
                        this._schemaData.element.find(".schemaNoClick").removeClass("freeze").removeAttr("style");
                }
            }
            if (!ej.isNullOrUndefined(this._schemaData))
                this._schemaData._refreshPivotButtons();
        },
        _refreshGroupingBar: function () {
            this._createGroupingBar(JSON.parse(this.getOlapReport()));
            this._createFields(null, $("#" + this._id).find(".e-pivotGridTable").width(), $("#" + this._id).find(".e-pivotGridTable th").outerWidth());
        },
        _removeSelectedNodes: function (selectedNodes) {
            var selectedElements = $.extend([], selectedNodes);
            for (var i = 0; i < selectedNodes.length; i++) {
                for (var j = 0; j < selectedElements.length; j++) {
                    if (selectedElements[j].Id == selectedNodes[i].parentId) {
                        selectedElements.splice(j, 1);
                    }
                }
            }
            return $.map(selectedElements, function (element, index) { if (element.tag != "" && element.tag != undefined) return element.tag.replace(/\&/g, "&amp;") });
        },
        _pivotFilterItems: function (selectedNodes, unSelectedNodes) {
            var axisItems = this.model.dataSource[this._selectedAxis == "Slicers" ? "filters" : this._selectedAxis.toLowerCase()];
            var members = ej.PivotAnalysis.getMembers(this._selectedField);
            jQuery.each(members, function (itemIndex, itemValue) {
                if (itemValue == null || !itemValue.toString().replace(/^\s+|\s+$/gm, '')) {
                    jQuery.each(unSelectedNodes, function (nodeIndex, nodeValue) {
                        if (!nodeValue.toString().replace(/^\s+|\s+$/gm, ''))
                            unSelectedNodes[nodeIndex] = itemValue;
                    });
                }
            });
            var selectedField = this._selectedField, dialogTitle = this._dialogTitle;
            var items = $.grep(axisItems, function (item) { return item.fieldName == selectedField});
            for (var i = 0; i < items.length; i++)
                items[i].filterItems = selectedNodes.length == members.length ? null : { filterType: ej.PivotAnalysis.FilterType.Exclude, values: unSelectedNodes };
            if (this._schemaData != null) {
                if (unSelectedNodes.length > 0 && this._schemaData.element.find(".e-schemaFieldTree li[id='" + this._selectedField + "']").find(".filter").length <= 0) {
                    var filterSpan = ej.buildTag("span.e-icon", { "display": "none" }).addClass("filter")[0].outerHTML;
                    this._schemaData.element.find(".e-schemaFieldTree li[id='" + this._selectedField + "']").find(".e-text").after(filterSpan);
                    this._schemaData.element.find(".e-pvtBtn[data-fieldName='" + this._selectedField + "']").parent().find(".filter").addClass("filtered");
                }
                else if (unSelectedNodes.length == 0) {
                    this._schemaData.element.find(".e-schemaFieldTree li[id='" + this._selectedField + "']").find(".filter").remove();
                    this._schemaData.element.find(".e-pvtBtn[data-fieldName='" + this._selectedField + "']").parent().find(".filter").removeClass("filtered");
                }
            }
        },

        _getUnSelectedNodes: function () {
            var treeElement = this.element.find(".e-editorTreeView")[0];
            var unselectedNodes = "";
            var data = $(treeElement).find(":input.nodecheckbox:not(:checked)");
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                for (var i = 0; i < data.length; i++) {
                    if (!($(data[i].parentElement).find('span:nth-child(1)').attr('class').indexOf("e-chk-act") > -1) && $(data[i].parentElement).attr('aria-checked') != 'mixed') {
                        var parentNode = $(data[i]).parents('li:eq(0)');
                        unselectedNodes += "::" + parentNode[0].id + "||" + $(parentNode).attr('data-tag') + (this._dialogHead == "KPI" ? ("~&" + $($(data[i]).parents("ul:eq(1) li")[1]).attr("data-tag")) : "");
                    }
                }
            }


            return unselectedNodes;
        },
        _getSelectedNodes: function (isSlicer) {
            if (isSlicer) {
                var treeElement;
                if (this.element.find(".e-editorTreeView").length > 0)
                    treeElement = this.element.find(".e-editorTreeView")[0].childNodes[0];
                else if (!ej.isNullOrUndefined(this._schemaData)) {
                    treeElement = this._memberTreeObj.element[0].childNodes[0];
                }
                var selectedNodes = new Array();
                var data = $(treeElement).children();
                for (var i = 0; i < data.length; i++) {
                    var parentNode = data[i];
                    var nodeInfo = { caption: $(parentNode.firstChild).find("a").text(), parentId: parentNode.parentElement.parentElement.className.indexOf("e-editorTreeView") > -1 ? "None" : $(parentNode).parents()[1].id, id: parentNode.id, checked: $(parentNode).find(':input.nodecheckbox')[0].checked || ($(parentNode).find('span:nth-child(1)').attr('class').indexOf("e-chk-indeter") > -1), expanded: $(parentNode.firstChild).find(".e-minus").length > 0 ? true : false, childNodes: new Array(), tag: $(parentNode).attr('data-tag') };
                    if ($(parentNode).find("ul:first").children().length > 0) {
                        var liElements = $(parentNode).find("ul:first").children();
                        for (var j = 0; j < liElements.length; j++) {
                            nodeInfo.childNodes.push(this._getNodeInfo(liElements[j]));
                        }
                    }
                    selectedNodes.push(nodeInfo);
                }
                return JSON.stringify(selectedNodes);
            }
            else {
                var treeElement = this.element.find(".e-editorTreeView")[0];
                var selectedNodes = "";
                var data = $(treeElement).find(':input.nodecheckbox');
                for (var i = 0; i < data.length; i++) {
                    if (data[i].checked || $(data[i].parentElement).attr('aria-checked') == 'mixed') {
                        var parentNode = $(data[i]).parents('li:eq(0)');
                        selectedNodes += "::" + parentNode[0].id + "||" + $(parentNode).attr('data-tag') + (this._dialogHead == "KPI" ? ("~&" + $($(data[i]).parents("ul:eq(1) li")[1]).attr("data-tag")) : "");
                    }
                }
                return selectedNodes;
            }
        },
        _getNodeInfo: function (node) {
            var childNode = { caption: $(node.firstChild).find("a").text(), parentId: node.parentElement.parentElement.className.indexOf("e-editorTreeView") > -1 ? "None" : $(node).parents()[1].id, id: node.id, checked: ($(node).find(':input.nodecheckbox')[0].checked || $(node).find('span:nth-child(1)').attr('class').indexOf("e-chk-indeter") > -1), expanded: $(node.firstChild).find(".e-minus").length > 0 ? true : false, childNodes: new Array(), tag: $(node).attr('data-tag') };
            if ($(node).find("ul:first").children().length > 0) {
                var liElements = $(node).find("ul:first").children();
                for (var i = 0; i < liElements.length; i++) {
                    childNode.childNodes.push(this._getNodeInfo(liElements[i]));
                }
            }
            return childNode;
        },

        _getLevelInfo: function (customArgs, e) {
            var newData = $.map($(e).find("row"), function (obj, index) {
                if ((parseInt($(obj).children("LEVEL_TYPE").text()) != "1" && $(obj).children("HIERARCHY_UNIQUE_NAME").text().toLowerCase() != "[measures]") && ($(obj).find("HIERARCHY_UNIQUE_NAME").text() == customArgs.hierarchy))
                    return { value: $(obj).find("LEVEL_UNIQUE_NAME").text(), text: $(obj).find("LEVEL_CAPTION").text() };
            });
            this.olapCtrlObj._currentReportItems.push({ fieldName: customArgs.hierarchy, dropdownData: newData });
        },

     
        _sortField: function (args, me) {
            //if (!ej.isNullOrUndefined(me))
            //    me.element.find(".e-dialog, .e-clientDialog").remove();
            //else
                this.element.find(".e-dialog, .e-clientDialog").remove();
                ej.Pivot.closePreventPanel(this);
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                        var selectedField = this._selectedField;
                        this._ascdes = this._ascdes+selectedField + "##";
                        if ($(args.element).attr("id") != "descOrder")
                            this._ascdes = $.grep(this._ascdes.split("##"), function (i, value) { return i != selectedField }).join("##");
                        this._applySorting();
                        return false
                    }
                    else {
                        var reportItem = ej.Pivot.getReportItemByFieldName(this._selectedField, this.model.dataSource).item;
                        reportItem.sortOrder = $(args.element).attr("id") == "descOrder" ? ej.PivotAnalysis.SortOrder.Descending : ej.PivotAnalysis.SortOrder.Ascending;
                        this.refreshControl();
                    }
                }
                else {
                    if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                        if (this._waitingPopup)
                            this._waitingPopup.show();
                        var report;
                        try { report = JSON.parse(this.getOlapReport()).Report; }
                        catch (err) { report = this.getOlapReport(); }
                        var isElementFound = false;
                        if (this._excelFilterInfo.length > 0) {
                            this._selectedField = this._selectedLevelUniqueName.split("].").splice(0, 2).join("].") + "]";
                            var levelName = this._selectedLevelUniqueName, hierarchyName = this._selectedField;
                            this._excelFilterInfo = $.grep(this._excelFilterInfo, function (item, index) {
                                if ((item.hierarchyUniqueName == hierarchyName || ej.isNullOrUndefined(hierarchyName)||(ej.isNullOrUndefined(item.hierarchyUniqueName)) ) && item.levelUniqueName == levelName) {
                                    isElementFound = true;
                                    if ($(args.element).find(".e-clrSort").length == 0)
                                        item.sortOrder = $(args.element).attr("id");
                                    else
                                        delete item.sortOrder;
                                }
                                return item;
                            });
                        }
                        if(!isElementFound)
                            this._excelFilterInfo.push({ hierarchyUniqueName: this._selectedFieldName, levelUniqueName: this._selectedLevelUniqueName, sortOrder: $(args.element).attr("id") });
                        this._selectedField = this._selectedLevelUniqueName.split("].").splice(0, 2).join("].") + "]";
                        var filterParams = this._selectedField + "--" + $(args.element).attr("id");//this._curFilteredAxis + "::" + this._curFilteredText + "## Clear Filter";
                        var serializedCustomObject = JSON.stringify(this.model.customObject), eventArgs = JSON.stringify({ "action": "labelSorting", "filterParams": filterParams, "currentReport": report, "customObject": serializedCustomObject, "gridLayout": this.model.layout });
                        this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.filtering, eventArgs, this._filterElementSuccess);
                        return false;
                    }
                    else {
                        ej.olap.base._clearDrilledCellSet();
                        if ($(args.element).attr("id") == "descOrder" || $(args.element).attr("id") == "ascOrder") {
                            var reportItem = ej.Pivot.getReportItemByFieldName(this._selectedField, this.model.dataSource).item;
                            reportItem["sortOrder"] = $(args.element).attr("id") == "descOrder" ? ej.olap.SortOrder.Descending : ej.olap.SortOrder.Ascending;
                            this._waitingPopup.show();
                            ej.olap.base.getJSONData({ action: "sorting" }, this.model.dataSource, this)
                        }
                    }
                }
        },

        _applySorting: function () {
            var serializedCustomObject = JSON.stringify(this.model.customObject);
            var report;
            try {
                report = JSON.parse(this.getOlapReport()).Report;
            }
            catch (err) {
                report = this.getOlapReport();
            }
            if (this.model.beforeServiceInvoke != null)
                this._trigger("beforeServiceInvoke", { action: "sorting", element: this.element, customObject: this.model.customObject });
            var serializedCustomObject = JSON.stringify(this.model.customObject);
            var eventArgs = JSON.stringify({ "action": "sorting", "sortedHeaders": this._ascdes, "currentReport": report, "valueSorting": JSON.stringify(this.model.valueSortSettings), "customObject": serializedCustomObject });
            this._waitingPopup = this.element.data("ejWaitingPopup");
            if (!ej.isNullOrUndefined(this._waitingPopup))
                this._waitingPopup.show();
            if (!this.model.enableDeferUpdate)
                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.sorting, eventArgs, this._sortingSuccess);
            else {
                if (!ej.isNullOrUndefined(this._waitingPopup))
                    this._waitingPopup.hide();
            }
        },
        _createDialog: function (title, treeViewData) {
            var isAdvancedFilter = (this.model.enableAdvancedFilter || this.model.dataSource.enableAdvancedFilter),isPivotAdvanceFilter=false ,pos;

            if (isAdvancedFilter) {
                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                        this._selectedField = this._curFilteredText;
                        if(this._curFilteredAxis != "Slicers")
                        isPivotAdvanceFilter = this._getAdvancedFilterInfo(this._curFilteredText).length>0;
                        isAdvancedFilter = (!(this.element.find(".e-pivotButton button[data-fieldName='" + this._curFilteredText + "']").parents("div:eq(0)").hasClass("e-drag"))) ? true : false;
                    }
                    else
                        isAdvancedFilter = (isAdvancedFilter && !(this.element.find(".e-pivotButton[data-tag='" + this._curFilteredText + "']").parents("div:eq(0)").hasClass("e-drag"))) ? true : false;
                }
                else
                    isAdvancedFilter = (isAdvancedFilter && ej.Pivot.getReportItemByFieldName(this._selectedField, this.model.dataSource).axis != "filters") ? true : false;
            }
            this.element.find(".e-dialog, .e-clientDialog").remove();
            this._isOptionSearch = false; this._currentFilterList = {}; this._editorSearchTreeData = []; this._isEditorDrillPaging = false; this._lastSavedTree = []; this._isSearchApplied = false;
            var currentHierarchy = this._selectedField, levelInfo, groupDropDown = "", filterElementTag = "", memberSearchEditor = "", editorNavPanel, editorSearchNavPanel, editorDrillNavPanel, editorLinkPanel;
            var documentHeight = $(document).height();
            if (isAdvancedFilter) {
                var treeviewInfo = JSON.parse(treeViewData);
                treeviewInfo[0].name = "(Select All)"
                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && this.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap) {
                    levelInfo = this.model.enableMemberEditorPaging ? this._memberPagingAvdData : treeviewInfo.splice(treeviewInfo.length - 1, 1);
                    levelInfo = JSON.parse(levelInfo[0].levels);
                }
                else if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && this.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap) {
                    levelInfo = $.map(this._currentReportItems, function (obj, index) { if (obj["fieldName"] == currentHierarchy) { return obj["dropdownData"]; } });
                    if (levelInfo.length == 0) {
                        var conStr = this._getConnectionInfo(this.model.dataSource.data);
                        var soapInfo = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"><Header/><Body><Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><RequestType>MDSCHEMA_LEVELS</RequestType><Restrictions><RestrictionList><CATALOG_NAME>" + this.model.dataSource.catalog + "</CATALOG_NAME><CUBE_NAME>" + this.model.dataSource.cube + "</CUBE_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>" + this.model.dataSource.catalog + "</Catalog> <LocaleIdentifier>" + conStr.LCID + "</LocaleIdentifier> </PropertyList></Properties></Discover></Body></Envelope>";
                        this.doAjaxPost("POST", conStr.url, { XMLA: soapInfo }, this._getLevelInfo, null, { pvtGridObj: this, action: "loadFieldElements", hierarchy: this._selectedField });
                        levelInfo = $.map(this._currentReportItems, function (obj, index) { if (obj["fieldName"] == currentHierarchy) { return obj["dropdownData"]; } });
                    }
                }
                else 
                    levelInfo = [{ value: this._selectedField, text: this._selectedField }]
                
                treeViewData = JSON.stringify(treeviewInfo);
                groupDropDown = ej.buildTag("div.e-ddlGroupWrap", this._getLocalizedLabels("SelectField") + ej.buildTag("input#GroupLabelDrop.groupLabelDrop").attr("type", "text")[0].outerHTML, {})[0].outerHTML;
                filterElementTag = ej.buildTag("ul.e-filterElementTag")[0].outerHTML;
                var filterTag = ej.Pivot.createAdvanceFilterTag({ action: "filterTag" }, this)
            }
            memberSearchEditor = ej.buildTag("div.e-memberSearchEditorDiv", ej.buildTag("input#searchEditorTreeView.searchEditorTreeView").attr("type", "text")[0].outerHTML + (this.model.enableMemberEditorPaging && $.parseJSON(treeViewData).length >= this.model.memberEditorPageSize ? ej.buildTag("span.e-icon e-searchEditorTree", {})[0].outerHTML : ""), { "padding": isAdvancedFilter ? "5px 5px 0px 9px" : "0px" })[0].outerHTML;
            var dialogContent = ej.buildTag("div#EditorDiv.e-editorDiv", groupDropDown + ej.buildTag("div", filterElementTag + memberSearchEditor + ej.buildTag("div.e-memberEditorDiv", ej.buildTag("div#editorTreeView.e-editorTreeView")[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML + ((!ej.isNullOrUndefined(treeViewData) && this.model.enableMemberEditorPaging && ($.parseJSON(treeViewData).length >= this.model.memberEditorPageSize || this.model.memberEditorPageSize < this._memberPageSettings.endPage)) ? "" : "</br>"),
            dialogFooter = ej.buildTag("div", ej.buildTag("button#OKBtn.e-dialogOKBtn", this._getLocalizedLabels("OK")).attr({ "title": this._getLocalizedLabels("OK"), tabindex: 0 })[0].outerHTML + ej.buildTag("button#CancelBtn.e-dialogCancelBtn", this._getLocalizedLabels("Cancel")).attr({ "title": this._getLocalizedLabels("Cancel"), tabindex: 0 })[0].outerHTML, { "float": "right", "margin": (isAdvancedFilter ? "-9px 5px 11px " : "-13px 0px 7px ") + "  0px" })[0].outerHTML,
            editorNavPanel = ej.buildTag("div.e-memberPager", ej.buildTag("div#" + this._id + "_NextpageDiv.e-nextPageDiv", ej.buildTag("div.e-icon e-media-backward_01 e-firstPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-left e-prevPage", {})[0].outerHTML + ej.buildTag("input.e-memberCurrentPage#memberCurrentPage", {}, { "width": "20px", "height": "10px" })[0].outerHTML + ej.buildTag("span.e-memberPageCount#memberPageCount")[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-right e-nextPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-media-forward_01 e-lastPage", {})[0].outerHTML)[0].outerHTML)[0].outerHTML,
            editorSearchNavPanel = ej.buildTag("div.e-memberSearchPager", ej.buildTag("div#" + this._id + "_NextSearchpageDiv.e-nextPageDiv", ej.buildTag("div.e-icon e-media-backward_01 e-firstPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-left e-prevPage", {})[0].outerHTML + ej.buildTag("input.e-memberCurrentSearchPage#memberCurrentSearchPage", {}, { "width": "20px", "height": "10px" })[0].outerHTML + ej.buildTag("span.e-memberSearchPageCount#memberSearchPageCount")[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-right e-nextPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-media-forward_01 e-lastPage", {})[0].outerHTML)[0].outerHTML, {}).css("display", "none")[0].outerHTML,
            editorDrillNavPanel = ej.buildTag("div.e-memberDrillPager", ej.buildTag("div#" + this._id + "_NextDrillpageDiv.e-nextPageDiv", ej.buildTag("div.e-icon e-media-backward_01 e-firstPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-left e-prevPage", {})[0].outerHTML + ej.buildTag("input.e-memberCurrentDrillPage#memberCurrentDrillPage", {}, { "width": "20px", "height": "10px" })[0].outerHTML + ej.buildTag("span.e-memberDrillPageCount#memberDrillPageCount")[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-right e-nextPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-media-forward_01 e-lastPage", {})[0].outerHTML)[0].outerHTML, {}).css("display", "none")[0].outerHTML;            
            editorLinkPanel = ej.buildTag("div.e-linkOuterPanel", ej.buildTag("span.e-infoImg e-icon", "", {}).css({ "float": "left", "margin-top": "4px", "font-size": "16px" })[0].outerHTML + ej.buildTag("a.e-linkPanel", this._getLocalizedLabels('NotAllItemsShowing')).css({ "display": "inline-block", "margin-left": "3px", "margin-top": "2px" })[0].outerHTML, {}).css({ "display": "none", "margin-top": "-16px", "margin-left": isAdvancedFilter ? "8px" : "0px" })[0].outerHTML;
            ejDialog = ej.buildTag("div#clientDialog.e-clientDialog", dialogContent + ((!ej.isNullOrUndefined(treeViewData) && this.model.enableMemberEditorPaging) ? (($.parseJSON(treeViewData).length >= this.model.memberEditorPageSize || this.model.memberEditorPageSize < this._memberPageSettings.endPage) ? editorDrillNavPanel + editorSearchNavPanel + editorNavPanel : editorDrillNavPanel + editorSearchNavPanel) : editorLinkPanel) + dialogFooter, { "opacity": "1" }).attr("title", title)[0].outerHTML,
            treeViewData = JSON.parse(treeViewData);
            for (var i = 0; i < treeViewData.length; i++) {
                if (treeViewData[i].name == null || !treeViewData[i].name.toString().replace(/^\s+|\s+$/gm, '')) { treeViewData[i].name = "(blank)"; treeViewData[i].id = "(blank)"; }
                if (!ej.isNullOrUndefined(treeViewData[i].id) && typeof (treeViewData[i].id) == "string") { treeViewData[i].id = treeViewData[i].id.replace(/ /g, "_"); }
            }
            var selectedData;
            if (this.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? !ej.isNullOrUndefined(this._fieldMembers) : !ej.isNullOrUndefined(this._tempFilterData)) {
                if (this.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    for (var i = 0; i < Object.keys(this._fieldMembers).length; i++) {
                        if (!ej.isNullOrUndefined(this._fieldMembers[this._curFilteredText.split(':')[1]]))
                            selectedData = $.map(this._fieldMembers[this._curFilteredText.split(':')[1]], function (item) {if(!item.checked) return item.name });
                    }
                }
                else {
                    for (var i = 0; i < this._tempFilterData.length; i++) {
                        if (!ej.isNullOrUndefined(this._tempFilterData[i][title]))
                            selectedData = this._tempFilterData[i][title];
                    }
                }
                if (!ej.isNullOrUndefined(selectedData)) {
                    for (var i = 0; i < selectedData.length; i++) {
                        for (var j = 0; j < treeViewData.length; j++) {
                            if (selectedData[i] == treeViewData[j].name)
                                treeViewData[j].checkedStatus = false;
                        }
                    }
                }
            }
            $(ejDialog).appendTo("#" + this._id);
            if (this.model.enableMemberEditorPaging && (treeViewData.length >= this.model.memberEditorPageSize || this.model.memberEditorPageSize < this._memberPageSettings.endPage)) {
                this.element.find(".e-prevPage, .e-firstPage").addClass("e-pageDisabled");
                this.element.find(".e-nextPage, .e-lastPage").addClass("e-pageEnabled");
                var pageCount = (this._memberCount / this.model.memberEditorPageSize);
                if (pageCount != Math.round(pageCount))
                    pageCount = parseInt(pageCount) + 1;
                this.element.find(".e-memberPageCount").html("/ " + pageCount);
                this.element.find(".e-memberCurrentPage").val(this._memberPageSettings.currentMemeberPage);
                this._memberPageSettings.currentMemeberPage > 1 ? this.element.find(".e-prevPage, .e-firstPage").removeClass("e-pageDisabled").addClass("e-pageEnabled") : this.element.find(".e-prevPage, .e-firstPage").removeClass("e-pageEnabled").addClass("e-pageDisabled");
                this._memberPageSettings.currentMemeberPage == parseInt($.trim(this.element.find(".e-memberPageCount").text().split("/")[1])) ? this.element.find(".e-nextPage, .e-lastPage").removeClass("e-pageEnabled").addClass("e-pageDisabled") : this.element.find(".e-nextPage, .e-lastPage").removeClass("e-pageDisabled").addClass("e-pageEnabled");
                this.element.find(".e-nextPageDiv .e-pageDisabled").css("opacity", "0.5");
            }
            this.element.find("#searchEditorTreeView").ejMaskEdit({
                name: "inputbox",
                width: "100%",
                inputMode: ej.InputMode.Text,
                watermarkText: this._getLocalizedLabels("Search") + " " + title,
                maskFormat: "",
                textAlign: this.model.enableRTL ? "right" : "left",                
                change: ej.proxy(function (args) { ej.Pivot._searchEditorTreeNodes(args, this); }, this)
            });
            this.element.find(".e-editorTreeView").ejTreeView({
                showCheckbox: true,
                loadOnDemand: true,
                enableRTL: this.model.enableRTL,
                beforeDelete: function (args) {
                    if (!ej.isNullOrUndefined(args.event))
                        if (args.event.type == "keydown" && args.event.originalEvent.key.toLowerCase() == "delete") return false;
                },
                height: $(".e-memberEditorDiv").height(),
                fields: { id: "id", text: "name", parentId: "pid", expanded: "expanded", isChecked: "checkedStatus", hasChild: "hasChildren", dataSource: ej.Pivot._showEditorLinkPanel(treeViewData, this, this) },
            });
            if (isAdvancedFilter) {
                pos = this.element.find("[data-tag*='" + (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this._selectedField : this._curFilteredText) + "']").offset();
                this.element.find(".e-filterElementTag").ejMenu({
                    fields: { dataSource: filterTag, id: "id", parentId: "parentId", text: "text", spriteCssClass: "spriteCssClass" },
                    menuType: ej.MenuType.NormalMenu,
                    enableRTL: this.model.enableRTL,
                    width: "100%",
                    orientation: ej.Orientation.Vertical,
                    click: ej.proxy(this._filterElementClick, this)
                });
                this.element.find(".groupLabelDrop").ejDropDownList({
                    width: "99%",
                    enableRTL: this.model.enableRTL,
                    dataSource: levelInfo,
                    fields: { id: "id", text: "text", value: "value" },
                    change: ej.proxy(this._groupLabelChange, this),
                    create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
                });
                var levelDropTarget = this.element.find('.groupLabelDrop').data("ejDropDownList");
                levelDropTarget.selectItemByText(levelDropTarget.model.dataSource[0].text);
                this.element.find(".e-memberEditorDiv").addClass("advancedFilter");
            }
            if (isPivotAdvanceFilter) {
                this.element.find(".e-editorTreeView").data("ejTreeView").checkAll();
                this._editorTreeData = $.map(this._editorTreeData, function (itm) { itm.checkedStatus = true; return itm; });
                this._editorDrillTreeData = $.map(this._editorTreeData, function (itm) { itm.checkedStatus = true; return itm; });
                this._editorSearchTreeData = $.map(this._editorTreeData, function (itm) { itm.checkedStatus = true; return itm; });
            }
            var gridObj = this;
            if (this.model.enableMemberEditorPaging && jQuery.isEmptyObject(this._currentFilterList))
                this._currentFilterList = JSON.parse(JSON.stringify(this._editorTreeData));
            else if (!this.model.enableMemberEditorPaging && jQuery.isEmptyObject(this._currentFilterList))
                $(treeViewData).each(function (index, item) {
                    gridObj._currentFilterList[item.id] = item;
                });
            var isTreeNodeHasChild = $.grep(treeViewData, function (item, index) { if (item.hasChildren == true) return item; }).length > 0;
            if (!isTreeNodeHasChild)
                this.element.find(".e-memberEditorDiv").addClass("noChildNode");
            var treeViewElements = this.element.find(".e-editorTreeView").find("li");
            for (var i = 0; i < treeViewElements.length; i++) {
                treeViewElements[i].setAttribute("data-tag", treeViewData[i].tag);
            }
            this.element.find(".e-dialogOKBtn, .e-dialogCancelBtn").ejButton({ type: ej.ButtonType.Button, click: ej.proxy(this._dialogBtnClick, this) });
            this._dialogOKBtnObj = this.element.find(".e-dialogOKBtn").data("ejButton");
            this._memberTreeObj = this.element.find(".e-editorTreeView").data("ejTreeView");
            var treeViewLi = this.element.find(".e-editorTreeView li:gt(0)"), firstNode = $(this._memberTreeObj.element.find("li:first")).find("span.e-chk-image"),
            uncheckedNodes = $(treeViewLi).find(":input.nodecheckbox:not(:checked)");
            if (uncheckedNodes.length > 0) {
                $(firstNode).removeClass("e-checkmark").addClass("e-stop");
            }
            if (this.model.enableMemberEditorPaging) {
                //this.element.find(".memberPager").css("margin-top", "0px");
                if (!this._isAllMemberChecked) {
                    this._dialogOKBtnObj.disable();
                    this.element.find(".e-dialogOKBtn").attr('disabled', 'disabled');
                    $(firstNode).removeClass("e-checkmark").removeClass("e-stop").addClass("e-chk-inact");
                }
            }
            this.element.find(".e-clientDialog").ejDialog({ width: isAdvancedFilter? "auto" : 265, target: "#" + this._id, enableResize: false, enableRTL: this.model.enableRTL, close: ej.proxy(ej.Pivot.closePreventPanel, this) });

            this.element.find("#clientDialog_wrapper").css("top", this.element[0].offsetTop + 20);
            this.element.find(".e-clientDialog").next(".e-scrollbar").hide();
            if (isAdvancedFilter) {
                this.element.find("#clientDialog_wrapper").addClass("e-advancedFilterDlg");
                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && this.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap)
                    this.element.find("#clientDialog_wrapper").addClass("advancedFilterDlgOSM");
                var cntrlWidth = $(".cols-sample-area").position();
                if (cntrlWidth && cntrlWidth.left > 0) {
                    this.element.find("#clientDialog_wrapper").css({ "left": (pos.left + 50 - cntrlWidth.left), top: pos.top });
                }
                else if (!ej.isNullOrUndefined(pos))
                    this.element.find("#clientDialog_wrapper").css({ "left": pos.left+50, top: pos.top });
                this.element.find(".e-clientDialog").css({"padding":"0px" , "min-width":"265px"}).parents().find(".e-titlebar").remove();
            }
            this._memberTreeObj.model.nodeCheck = ej.proxy(this._nodeCheckChanges, this);
            this._memberTreeObj.model.nodeUncheck = ej.proxy(this._nodeCheckChanges, this);
            if (this.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap)
                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode)
                    this._memberTreeObj.model.beforeExpand = ej.proxy(this._beforeNodeExpand, this);
                else
                    this._memberTreeObj.model.nodeClick = ej.proxy(this._nodeExpand, this);
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode)
                this._memberTreeObj.model.beforeCollapse = ej.proxy(ej.Pivot._onNodeCollapse, this);
            if (this._memberTreeObj.element.find(".e-plus").length == 0) {
                this._memberTreeObj.element.find(".e-item").css("padding", "0px");
            }
            this._isMembersFiltered = false;
            this._unWireEvents();
            this._wireEvents();
            this.element.find(".e-dialog .e-close").attr("title", this._getLocalizedLabels("Close"));
            this.element.find(".e-dialog .e-close").click(function (args) {
                var pivotGrid = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                if (!ej.isNullOrUndefined(pivotGrid._schemaData))
                    pivotGrid._schemaData.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
            });
        },
        _clearSorting: function (args) {
            if ($(args.target).parent().attr("disabled") == "disabled")
                return false;
			ej.Pivot.closePreventPanel(this);
			if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
			    if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
			        this._sortField(args);
			    else {
			        var reportItem = ej.Pivot.getReportItemByFieldName(this._selectedField, this.model.dataSource).item;
			        reportItem.sortOrder = ej.PivotAnalysis.SortOrder.None;
			        this.refreshControl();
			    }
			}
			else {
			    if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
			        if (this._waitingPopup)
			            this._waitingPopup.show();
			        this._selectedField = this._selectedLevelUniqueName.split("].").splice(0, 2).join("].") + "]";

			        if (this._excelFilterInfo.length > 0) {
			            var levelName = this._selectedLevelUniqueName, hierarchyName = this._selectedField;
			            this._excelFilterInfo = $.grep(this._excelFilterInfo, function (item, index) {
			                if ((item.hierarchyUniqueName == hierarchyName || ej.isNullOrUndefined(hierarchyName)||(ej.isNullOrUndefined(item.hierarchyUniqueName)) ) && item.levelUniqueName == levelName) {
			                        delete item.sortOrder;
			                }
			                return item;
			            });
			        }

			        var report;
			        try { report = JSON.parse(this.getOlapReport()).Report; }
			        catch (err) { report = this.getOlapReport(); }
			        var filterParams = this._selectedField + "--" + $(args.element).attr("id");//this._curFilteredAxis + "::" + this._curFilteredText + "## Clear Filter";
			        var serializedCustomObject = JSON.stringify(this.model.customObject), eventArgs = JSON.stringify({ "action": "labelSorting", "filterParams": filterParams, "currentReport": report, "customObject": serializedCustomObject, "gridLayout": this.model.layout });
			        this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.filtering, eventArgs, this._filterElementSuccess);
			        return false;
			    }
			    else {
			        var dataSource = this.model.dataSource;
			        var currElement = this._selectedField.toLowerCase();
			        var reportItem = $.map(dataSource.columns, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() == currElement)) return obj; });
			        if (reportItem.length == 0)
			            reportItem = $.map(dataSource.rows, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() == currElement)) return obj; });
			        if (reportItem.length > 0)
			            delete reportItem[0]["sortOrder"];
			        this.model.dataSource = dataSource;
			        this.element.find(".e-dialog").remove();
			        this.element.find("#preventDiv").remove();
			        if (this._schemaData != null) {
			            this._schemaData.element.find(".e-dialog").remove();
			        }
			        this._waitingPopup.show();
			        this.getJSONData({ action: "clearSorting" }, this.model.dataSource, this);
			    }
			}
        },

        _clearAllFilters: function (args) {
            if ($(args.target).parent().attr("disabled") == "disabled")
                return false;
            ej.Pivot.closePreventPanel(this);
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                var dataSource = this.model.dataSource;
                var currElement = this._selectedField.toLowerCase();
                var reportItem = $.map(dataSource.columns, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() == currElement)) return obj; });
                if (reportItem.length == 0) {
                    reportItem = $.map(dataSource.rows, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() == currElement)) return obj; });
                }
                if (reportItem.length > 0) {
                    var selectedLevelInfo = this.element.find(".groupLabelDrop").length > 0 ? this.element.find(".groupLabelDrop").data("ejDropDownList") : (this._schemaData == null ? null : this._schemaData.element.find(".groupLabelDrop").data("ejDropDownList"));
                    if (selectedLevelInfo != null) {
                        if (reportItem[0]["advancedFilter"])
                            reportItem[0]["advancedFilter"] = $.map(reportItem[0]["advancedFilter"], function (obj, index) { if (obj.name != undefined && (obj.name.toLowerCase() != selectedLevelInfo.getSelectedValue().toLowerCase())) return obj; });
                        if (this._schemaData != null) {
                            if (reportItem[0]["advancedFilter"] && reportItem[0]["advancedFilter"].length == 0)
                                this._schemaData._tableTreeObj.element.find("li[data-tag ='" + reportItem[0].fileName + "'] div:eq(0) .filter").remove();
                            this._schemaData._tableTreeObj.element.find("li[data-tag='" + selectedLevelInfo.getSelectedValue() + "'] div:eq(0) .filter").remove();
                        }
                    }
                    else
                        delete reportItem[0].advancedFilter;
                    delete reportItem[0].filterItems;
                }
                this._currentReportItems = $.grep(this._currentReportItems, function (value, i) { if (value["data-fieldName"] != undefined && value["data-fieldName"].toLocaleLowerCase() != currElement) return value; });
                this.model.dataSource = dataSource;
                this.element.find(".e-dialog").remove();
                this.element.find("#preventDiv").remove();
            if (this._schemaData != null)
            {
                    this._schemaData._tableTreeObj.element.find("li[data-tag ='" + this._selectedField + "'] .filter").remove();
                    this._schemaData.element.find(".e-dialog").remove();
                }
                this._waitingPopup.show();
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    ej.PivotAnalysis._valueFilterArray = $.grep(ej.PivotAnalysis._valueFilterArray, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() != currElement)) return obj; });
                    this.refreshControl();
                }
                else
                    this.getJSONData({ action: "advancedfiltering" }, this.model.dataSource, this);
            }
            else {
                var report;
                try { report = JSON.parse(this.getOlapReport()).Report; }
                catch (err) { report = this.getOlapReport();}
                this._removeFilterTag(this._curFilteredText);
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    var filterParams = this._curFilteredAxis + "::" + this._curFilteredText + "## Clear Filter";
                    var selectedData = this._curFilteredText;
                    this._tempFilterData = $.map(this._tempFilterData, function (item, i) { if (!(item[selectedData])) return item; });
                    var serializedCustomObject = JSON.stringify(this.model.customObject), eventArgs = JSON.stringify({ "action": "labelfiltering", "filterParams": filterParams, "sortedHeaders": this._ascdes, "currentReport": report, "valueSorting": JSON.stringify(this.model.valueSortSettings), "customObject": serializedCustomObject, "gridLayout": this.model.layout });
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.filtering, eventArgs, this._filterElementSuccess);
                }
                else {
                    if (!ej.isNullOrUndefined(this._tempFilterData) ) {
                        for (var j = 0; j < this._tempFilterData.length; j++) {
                            for (var key in this._tempFilterData[j]) {
                                if (key == this._curFilteredText.split(":")[1] && this._tempFilterData[j][this._curFilteredText.split(":")[1]] != "") {
                                    this._tempFilterData.splice(j, 1);
                                    delete this._fieldMembers[this._curFilteredText.split(":")[1]]
                                }
                            }
                        }
                    }
                    var sortOrder = this._removeFilterTag(this._selectedLevelUniqueName);
                    this._excelFilterInfo.push({ hierarchyUniqueName: this._selectedFieldName, levelUniqueName: this._selectedLevelUniqueName, sortOrder: sortOrder });
                    var filterParams = this._selectedLevelUniqueName + "--Clear Filter"; //.split("].").splice(0, 2).join("].") + "]"
                    var selectedData = this._curFilteredText;
                    this._tempFilterData = $.map(this._tempFilterData, function (item, i) { if (!(item[selectedData])) return item; });
                    var serializedCustomObject = JSON.stringify(this.model.customObject), eventArgs = JSON.stringify({ "action": "labelfiltering", "filterParams": filterParams, "sortedHeaders": this._ascdes, "currentReport": report, "valueSorting": JSON.stringify(this.model.valueSortSettings), "customObject": serializedCustomObject, "gridLayout": this.model.layout });
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.filtering, eventArgs, this._filterElementSuccess);
                }
            }
        },

        _removeFilterTag: function (uniqueName) {
            var sortOrder = [];
            var isPivotServerMode = (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
            if (uniqueName && uniqueName.indexOf("].") >= 0 || isPivotServerMode) {
                var removeElement = (uniqueName.split("].").length > 2 || isPivotServerMode) ? "levelUniqueName" : "hierarchyUniqueName";
                if (this._excelFilterInfo.length > 0) {
                        levelName = this._selectedLevelUniqueName, hierarchyName = this._selectedFieldName;
                    this._excelFilterInfo = $.grep(this._excelFilterInfo, function (item, index) {
                        if (!(item[removeElement] == uniqueName))
                            return item;
                        else
                            sortOrder = item.sortOrder;
                    });
                }
            }
            return sortOrder;
        },
        _groupLabelChange: function (args) {

            var filterMenuObj = this.element.find(".e-filterElementTag").data("ejMenu");
            filterMenuObj.disableItemByID("labelClearFilter");
            filterMenuObj.disableItemByID("valueClearFilter");
            filterMenuObj.disableItemByID("clearAllFilters");
            filterMenuObj.disableItemByID("clearSorting");
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                var me = this.element.hasClass("e-pivotschemadesigner") ? this.model.pivotControl : this;
                var selectedLevelInfo = this.element.find(".groupLabelDrop").length > 0 ? this.element.find(".groupLabelDrop").data("ejDropDownList") : [];
                var filterData = me._getAdvancedFiltervalue(me._selectedField, selectedLevelInfo.getSelectedValue());               
                var isIncludeFilter = ej.Pivot.getReportItemByFieldName(me._selectedField, me.model.dataSource).item;
                var filterIndicator = ej.buildTag("span.e-filterState").addClass("e-icon").attr("aria-label", "filter state")[0].outerHTML;
                var activeFilter = ej.buildTag("span.e-activeFilter").addClass("e-icon")[0].outerHTML;
                var reportItem = ej.Pivot.getReportItemByFieldName(me._selectedField, me.model.dataSource).item, selectedOrder;
                if (reportItem) {
                    if (reportItem["sortOrder"] && reportItem["sortOrder"] != ej.Pivot.SortOrder.None) {
                        selectedOrder = (reportItem && reportItem["sortOrder"] == ej.Pivot.SortOrder.Descending) ? "desc" : "asc";
                        if (ej.isNullOrUndefined(selectedOrder) || selectedOrder == "asc")
                            this.element.find(".e-clientDialog .ascImage").addClass("e-selectedSort");
                        else
                            this.element.find(".e-clientDialog .e-descImage").addClass("e-selectedSort");
                        filterMenuObj.enableItemByID("clearSorting");
                    }
                }
                this.element.find(".e-filterState,.e-activeFilter").remove();
               var filterElem= this.element.find("#clearAllFilters a").children().clone();
               this.element.find("#clearAllFilters a").text(this._getLocalizedLabels("ClearFilter") + " from \"" + args.text + "\"").append(filterElem);
                if (filterData.length > 0) {
                    if (filterData[0]["advancedFilterType"] == ej.Pivot.AdvancedFilterType.LabelFilter) {
                        this.element.find("#labelFilterBtn a:eq(0)").append(filterIndicator);
                        this.element.find("#labelFilterBtn .clearFilter").css("opacity", "1").removeAttr("disabled");
                        var labelFilter=(filterData[0]["labelFilterOperator"] == "equals" || filterData[0]["labelFilterOperator"] == "notequals" || filterData[0]["labelFilterOperator"] == "lessthanorequalto" || filterData[0]["labelFilterOperator"] == "greaterthanorequalto" || filterData[0]["labelFilterOperator"] == "greaterthan" || filterData[0]["labelFilterOperator"] == "lessthan")? "_labelFilter":"";
                        this.element.find("#labelFilterBtn li#" + filterData[0]["labelFilterOperator"] + labelFilter + " a").append(activeFilter);
                        filterMenuObj.enableItemByID("labelClearFilter");
                    }
                    else {
                        this.element.find("#valueFilterBtn a:eq(0)").append(filterIndicator);
                        this.element.find("#valueFilterBtn .clearFilter").css("opacity", "1").removeAttr("disabled");
                        var valueFilter=(filterData[0]["valueFilterOperator"] == "equals" || filterData[0]["valueFilterOperator"] == "notequals" || filterData[0]["valueFilterOperator"] == "lessthanorequalto" || filterData[0]["valueFilterOperator"] == "greaterthanorequalto" || filterData[0]["valueFilterOperator"] == "greaterthan" || filterData[0]["valueFilterOperator"] == "lessthan")? "_valueFilter":"";
                        this.element.find("#valueFilterBtn li#" + filterData[0]["valueFilterOperator"] + valueFilter+" a").append(activeFilter);
                        filterMenuObj.enableItemByID("valueClearFilter");
                    }
                    filterMenuObj.enableItemByID("clearAllFilters");
                }
                else if (isIncludeFilter && isIncludeFilter["filterItems"]) {
                    this.element.find(".e-memberEditorDiv").before(filterIndicator);
                    this.element.find(".e-filterState").addClass("memberFilter").css("visibility", "hidden");
                    filterMenuObj.enableItemByID("clearAllFilters");
                }
            }
            else {
                var levelName = this._selectedLevelUniqueName = args.selectedValue;
                var filterIndicator = ej.buildTag("span.e-filterState").addClass("e-icon").attr("aria-label", "filter state")[0].outerHTML;
                var filterInfo = [], filterId;
                if (this._excelFilterInfo.length > 0) {
                    var levelName = this._selectedLevelUniqueName, hierarchyName = this._selectedFieldName;
                    filterInfo = $.map(this._excelFilterInfo, function (item, index) {
                        if ( item.hierarchyUniqueName == hierarchyName && item.levelUniqueName == levelName)
                            return { action: item.action, operator: item.operator, value1: item.value1,sortInfo:item.sortOrder };
                    });
                }
                var filterElem = this.element.find("#clearAllFilters a").children().clone();
                this.element.find("#clearAllFilters a").text(this._getLocalizedLabels("ClearFilter") + " from \"" + args.text + "\"").append(filterElem);
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    var sorting = $.grep(this._ascdes.split("##"), function (value, i) { if (value == levelName) return value; });
                    if (sorting.length > 0) {
                        this.element.find(".e-descImage").addClass("e-selectedSort");
                        filterMenuObj.enableItemByID("clearSorting");
                    }
                    else
                        this.element.find(".ascImage").addClass("e-selectedSort");
                }
                else {
                    if (!(filterInfo.length > 0 && (ej.isNullOrUndefined(filterInfo[0]["sortInfo"]) || (!ej.isNullOrUndefined(filterInfo[0]["sortInfo"]) && filterInfo[0]["sortInfo"].length == 0)) || filterInfo.length == 0)) {
                        if (filterInfo[0]["sortInfo"].length > 0) {
                            this.element.find("#" + filterInfo[0]["sortInfo"] + " span:eq(0)").addClass("e-selectedSort");
                            filterMenuObj.enableItemByID("clearSorting");
                        }
                    }
                }
                this.element.find(".e-filterElementTag .e-activeFilter,.e-filterIndicator").remove();
                if (filterInfo.length > 0 && !ej.isNullOrUndefined(filterInfo[0]["operator"])) {
                    filterMenuObj.enableItemByID("clearAllFilters");
                    var filterTag = "";
                    if ((filterInfo[0].action == "valuefiltering")) {
                        filterTag = "valueFilterBtn";
                        filterMenuObj.enableItemByID("valueClearFilter");
                        filterId = (filterInfo[0]["operator"] == "equals" || filterInfo[0]["operator"] == "not equals" || filterInfo[0]["operator"] == "less than or equal to" || filterInfo[0]["operator"] == "greater than or equal to" || filterInfo[0]["operator"] == "greater than" || filterInfo[0]["operator"] == "less than") ? "_valueFilter" : "";
                    }
                    else {
                        filterTag = "labelFilterBtn";
                        filterMenuObj.enableItemByID("labelClearFilter");
                        filterId = (filterInfo[0]["operator"] == "equals" || filterInfo[0]["operator"] == "not equals" || filterInfo[0]["operator"] == "less than or equal to" || filterInfo[0]["operator"] == "greater than or equal to" || filterInfo[0]["operator"] == "greater than" || filterInfo[0]["operator"] == "less than") ? "_labelFilter" : "";
                    }
                    this.element.find("#"+filterTag+" a:eq(0)").append(filterIndicator);
                    if (filterInfo[0]["operator"].replace(/ /g, '') == "BottomCount")
                        this.element.find("#" + filterTag + " li#" + filterInfo[0]["operator"].replace(/ /g, '').replace("Bottom", "top") + " a").append($(ej.buildTag("span.e-activeFilter e-icon")[0].outerHTML));
                    else
                        this.element.find("#" + filterTag + " li#" + filterInfo[0]["operator"].replace(/ /g, '') + filterId+" a").append($(ej.buildTag("span.e-activeFilter e-icon")[0].outerHTML));
                }
                else {
                    if (this._getUnSelectedNodes() != "") {
                        this.element.find(".e-memberEditorDiv").before("<div class='e-filterState e-icon' style='margin-top:5px;position:absolute;visibility:hidden' />");
                        filterMenuObj.enableItemByID("clearAllFilters");
                    }
                }
            }
        },

        _getAdvancedFiltervalue: function (hierarchyUqName, levelUqName) {
            var filterItem = ej.Pivot.getReportItemByFieldName(hierarchyUqName, this.model.dataSource).item, levelItem = [];
            if (filterItem && filterItem.advancedFilter)
                levelItem = $.map(filterItem.advancedFilter, function (obj, index) { if (obj.name != undefined && (obj.name.toLocaleLowerCase() == levelUqName.toLowerCase())) return obj; });
            return levelItem;

        },
        _filterElementClick: function (args, me) {
            if (args.ID == "labelFilterBtn" || args.ID == "valueFilterBtn")
                return false;
            var selectedLevelInfo = this.element.find(".groupLabelDrop").length > 0 ? this.element.find(".groupLabelDrop").data("ejDropDownList") : me.element.find(".groupLabelDrop").data("ejDropDownList");
            this._selectedLevelUniqueName = selectedLevelInfo.getSelectedValue();
            if (args.ID == "clearAllFilters" || (args.ID == "valueClearFilter" && this.model.analysisMode == "pivot" && this.model.operationalMode == "servermode"))
            {
                this._clearAllFilters(args);
                if (args.ID == "valueClearFilter" && this.model.analysisMode == "pivot" && this.model.operationalMode == "servermode")
                    return false;
            }
            else if (args.ID == "clearSorting")
                this._clearSorting(args);
            else if (args.ID == "ascOrder" || args.ID == "descOrder")
                this._sortField(args);
            this.element.find(".e-dialog, .e-filterDialog, #preventDiv").remove();
            if (this._schemaData != null) {
                this._schemaData.element.find(".e-dialog").remove();
            }
            if ($(args.element).parent().hasClass("e-filterElementTag") || args.ID == "ascOrder" || args.ID == "descOrder" || args.ID == "clearSorting" || args.ID == "clearAllFilters") return;
            var currentHierarchy = this._selectedField;
            if (!ej.isNullOrUndefined(args.element)) 
                this._filterAction = $(args.element).parents("#valueFilterBtn").length==0 ? "labelFiltering" : "valueFiltering";
            else if (!ej.isNullOrUndefined(args.parentId) || (!ej.isNullOrUndefined(args.menuId) && args.menuId != ""))
                this._filterAction = args.parentId == "valueFilterBtn" ? "valueFiltering" : args.menuId == "labelFilterBtn" ? "labelFiltering" : "";
            else
                this._filterAction = $(args.selectedItem).attr("id") == "valueFilterBtn" ? "valueFiltering" : $(args.selectedItem).attr("id") == "labelFilterBtn" ? "labelFiltering" : "";
            if ($.trim(args.text) == $.trim(this._getLocalizedLabels("ClearFilter"))) {
                if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                    this._removeFilterTag(this._selectedLevelUniqueName);
                    var report;
                    try {
                        report = JSON.parse(this.getOlapReport()).Report;
                    }
                    catch (err) {
                        report = this.getOlapReport();
                    }
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        var serializedCustomObject = JSON.stringify(this.model.customObject),
                        eventArgs = JSON.stringify({ "action": this._filterAction.toLowerCase(), "filterParams": this._selectedLevelUniqueName + "--Clear Filter", "currentReport": report, "customObject": serializedCustomObject, "gridLayout": this.model.layout });
                        this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.filtering, eventArgs, this._filterElementSuccess);
                    }
                    else {
                        var selectedData = this._curFilteredText;
                        this._tempFilterData = $.map(this._tempFilterData, function (item, i) { if (!(item[selectedData])) return item; });
                        var filterParams = this._curFilteredAxis + "::" + this._curFilteredText + "## Clear Filter";
                        var serializedCustomObject = JSON.stringify(this.model.customObject), eventArgs = JSON.stringify({ "action": this._filterAction.toLowerCase(), "filterParams": filterParams, "sortedHeaders": this._ascdes, "currentReport": report, "customObject": serializedCustomObject, "gridLayout": this.model.layout });
                        this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.filtering, eventArgs, this._filterElementSuccess);
                    }
                }
                else {
                    ej.Pivot.closePreventPanel(this);
                    var currentLevelInfo = this._selectedLevelUniqueName.toLowerCase(), filterInfo = [];
                    var reportItem = $.map(this.model.dataSource.columns, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() == currentHierarchy.toLowerCase())) return obj; });
                    if (reportItem.length == 0) {
                        reportItem = $.map(this.model.dataSource.rows, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() == currentHierarchy.toLowerCase())) return obj; });
                    }
                    ej.PivotAnalysis._valueFilterArray = $.grep(ej.PivotAnalysis._valueFilterArray, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() != currentHierarchy.toLowerCase())) return obj; });
                    if (reportItem.length > 0) {

                        if (reportItem[0]["advancedFilter"])
                            filterInfo = $.map(reportItem[0]["advancedFilter"], function (obj, index) { if (obj.name != undefined && (obj.name.toLowerCase() != currentLevelInfo)) return obj; });
                        reportItem[0]["advancedFilter"] = filterInfo;

                        if (this._schemaData) {
                            if (reportItem[0]["advancedFilter"].length == 0)
                                this._schemaData._tableTreeObj.element.find("li[data-tag ='" + currentHierarchy + "'] div:eq(0) .filter").remove();
                            this._schemaData._tableTreeObj.element.find("li[data-tag='" + this._selectedLevelUniqueName + "'] div:eq(0) .filter").remove();
                        }
                    }
                    this._waitingPopup.show();
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                        this.refreshControl();
                    else
                        this.getJSONData({ action: "advancedfiltering" }, this.model.dataSource, this);
                    return false;
                }
            }
            else {
                if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                    var filterVal = [], levelName = this._selectedLevelUniqueName;
                    if (this._excelFilterInfo.length > 0 && $(args.element).siblings("li:eq(0)").attr("disable") != "true") {
                        filterVal = $.map(this._excelFilterInfo, function (item, index) {
                            if (item.levelUniqueName == levelName && !ej.isNullOrUndefined(item.operator))
                                return { value1: item.value1, value2: item.value2, operator: item.operator, measure: item.measure };
                        });
                        if (filterVal.length > 0 && (args.ID.replace("_valueFilter", "").replace("_labelFilter", "") != (filterVal[0]["operator"].replace(/ /g, ''))))
                            filterVal = [];
                    }
                    ej.Pivot.createAdvanceFilterTag({ action: (this._filterAction == "labelFiltering" ? "labelFilterDlg" : "valueFilterDlg"), selectedArgs: args, filterInfo: filterVal }, this);
                }
                else {
                    var reportItem = $.map(this.model.dataSource.columns, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() == currentHierarchy.toLowerCase())) return obj; });
                    if (reportItem.length == 0) {
                        reportItem = $.map(this.model.dataSource.rows, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() == currentHierarchy.toLowerCase())) return obj; });
                    }
                    var filterVal = [];
                    if (reportItem[0]["advancedFilter"])
                        filterVal = $.map(reportItem[0]["advancedFilter"], function (obj, index) { if (obj.name != undefined && (obj.name.toLowerCase() != currentLevelInfo)) return obj; });
                    ej.Pivot.createAdvanceFilterTag({ action: (this._filterAction == "labelFiltering" ? "labelFilterDlg" : "valueFilterDlg"), selectedArgs: args, filterInfo: filterVal }, this);
                }
            }
        },

        _filterOptionChanged: function (args) {
            var filterValue = this._getAdvancedFiltervalue(this._selectedField, this._selectedLevelUniqueName);
            if (filterValue.length > 0) {
                if (filterValue[0].advancedFilterType == 'label' && args.value.replace(/ /g, '') == filterValue[0].labelFilterOperator)
                    filterValue = filterValue[0].values;
                else if (filterValue[0].advancedFilterType == 'value' && args.value.replace(/ /g, '') == filterValue[0].valueFilterOperator)
                    filterValue = filterValue[0].values;
                else
                    filterValue = [""];
            }
            else
                filterValue = [""];            
            var valuesTd = this.element.find(".filterValuesTd")[0];
            if (args.value.toLowerCase().indexOf("between") >= 0)
                $(valuesTd).html("<input type='text' id='filterValue1' class='e-filterValues' value='" + filterValue[0] + "' style='display:inline'/> <span>" + this._getLocalizedLabels("and") + "</span> <input type='text' id='filterValue2' value='" + (ej.isNullOrUndefined(filterValue[1]) ? "" : filterValue[1]) + "' class='e-filterValues' style='display:inline' /> </br>");
            if (args.value.toLowerCase().indexOf("between") < 0)
                $(valuesTd).html("<input type='text' id='filterValue1' class='e-filterValues' value='" + filterValue[0] + "' style='display:inline'/>");
        },

        _filterElementOkBtnClick: function (args) {
            ej.Pivot.closePreventPanel(this);
            var selectedOperator = this.element.find(".filterOptions")[0].value,
                enteredValue = [this.element.find("#filterValue1")[0].value],
                selectedMeasure, filterInfo = [], currentHierarchy = this._selectedField;

            if ( this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                var filterValue1 = enteredValue[0].value,
                     filterValue2 = (this.element.find("#filterValue2").length > 0 ? this.element.find("#filterValue2")[0].value : ""),
             selectedMeasure, params, levelFilterInfo = [], actionName = this._filterAction.toLowerCase();
                params = this._selectedLevelUniqueName + "--" + selectedOperator + "--" + enteredValue[0];
                if (this.element.find(".filterMeasures").length > 0) {
                    if (this.element.find("#filterValue2").length > 0)
                        params = params + "," + filterValue2;
                    selectedMeasure = this.element.find(".filterMeasures").data("ejDropDownList").model.value;
                    params = params + "--" + selectedMeasure;
                    actionName = "valuefiltering";
                    if (selectedMeasure == null)
                        return;
                }
                var report;
                try {
                    report = JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.getOlapReport();
                }

                var serializedCustomObject = JSON.stringify(this.model.customObject),
                    eventArgs = JSON.stringify({ "action": actionName, "filterParams": params, "currentReport": report, "customObject": serializedCustomObject, "gridLayout": this.model.layout });
                this._waitingPopup = this.element.data("ejWaitingPopup");
                if (!ej.isNullOrUndefined(this._waitingPopup))
                    this._waitingPopup.show();
                if (!ej.isNullOrUndefined(this._schemaData))
                    this._schemaData.element.find(".schemaNoClick").addClass("freeze").width($(this._schemaData.element).width()).height($(this._schemaData.element).height()).css({ "top": $(this._schemaData.element).offset().top, "left": $(this._schemaData.element).offset().left });

                var selectedField = this._curFilteredText.indexOf(":") > -1 ? this._curFilteredText.split(":")[1] : "";
                if (selectedField != "" && this._tempFilterData) {
                    this._tempFilterData = $.grep(this._tempFilterData, function (item) { if (ej.isNullOrUndefined(item[selectedField])) return item; });
                }
                var sortOrder = this._removeFilterTag(this._selectedLevelUniqueName);
                this._excelFilterInfo.push({ action: actionName, hierarchyUniqueName: this._selectedFieldName, levelUniqueName: this._selectedLevelUniqueName, operator: selectedOperator, measure: selectedMeasure, value1: enteredValue[0], value2: filterValue2, sortOrder: sortOrder });
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    if (!this.model.enableDeferUpdate)
                        this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.filtering, eventArgs, this._filterElementSuccess);
                }
                else if (this._filterAction == "labelFiltering") {
                    var selectedData = this._curFilteredText;
                    this._tempFilterData = $.map(this._tempFilterData, function (item, i) { if (!(item[selectedData])) return item; });
                    var filterParams = this._curFilteredAxis + "::" + this._curFilteredText + "##" + selectedOperator + "::" + enteredValue[0];
                    var serializedCustomObject = JSON.stringify(this.model.customObject), eventArgs = JSON.stringify({ "action": actionName, "filterParams": filterParams, "sortedHeaders": this._ascdes, "currentReport": report, "valueSorting": JSON.stringify(this.model.valueSortSettings), "customObject": serializedCustomObject, "gridLayout": this.model.layout });
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.filtering, eventArgs, this._filterElementSuccess);
                }
                else {
                    var selectedData = this._curFilteredText;
                    this._tempFilterData = $.map(this._tempFilterData, function (item, i) { if (!(item[selectedData])) return item; });
                    this._measureDDL = this.element.find(".filterMeasures").data("ejDropDownList");
                    selectedMeasure = this._measureDDL.getSelectedValue();
                    var filterParams = this._curFilteredText + "::" + selectedOperator + "::" + selectedMeasure + "::" + enteredValue[0] + "::" + (this.element.find("#filterValue2").length > 0 ? this.element.find("#filterValue2")[0].value : "");
                    var serializedCustomObject = JSON.stringify(this.model.customObject), eventArgs = JSON.stringify({ "action": actionName, "filterParams": filterParams, "sortedHeaders": this._ascdes, "currentReport": report, "valueSorting": JSON.stringify(this.model.valueSortSettings), "customObject": serializedCustomObject, "gridLayout": this.model.layout });
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.filtering, eventArgs, this._filterElementSuccess);

                }
                return false;
            }

            if (this._filterAction == "valueFiltering") {
                this._measureDDL = this.element.find(".filterMeasures").data("ejDropDownList");
                selectedMeasure = this._measureDDL.getSelectedValue();
                if (!(!isNaN(parseFloat(enteredValue[0])) && isFinite(enteredValue[0])) || selectedMeasure == "") { return; };
                this.element.find("#filterValue2")[0] != undefined ? "," + enteredValue.push(this.element.find("#filterValue2")[0].value) : enteredValue;
            }
            this.element.find(".e-dialog").remove();

            if (this._schemaData) {
                var filterIndicator = ej.buildTag("span.filter").addClass("e-icon")[0].outerHTML;
                var selectedLevel   = this._schemaData._tableTreeObj.element.find("li[data-tag='" + this._selectedLevelUniqueName + "'] div:eq(0)");
                var selectedHierarchy = this._schemaData._tableTreeObj.element.find("li[data-tag ='" + currentHierarchy + "'] div:eq(0)");
                if(selectedLevel.find(".filter").length==0)
                    selectedLevel.append(filterIndicator);
                if (selectedHierarchy.find(".filter").length === 0)
                    selectedHierarchy.append(filterIndicator);
            }
           
            var currentLevelInfo = this._selectedLevelUniqueName.toLowerCase();
            var reportItem = $.map(this.model.dataSource.columns, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLocaleLowerCase() == currentHierarchy.toLowerCase())) return obj; });
            if (reportItem.length == 0) {
                reportItem = $.map(this.model.dataSource.rows, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLocaleLowerCase() == currentHierarchy.toLowerCase())) return obj; });
            }

            if (reportItem.length > 0) {
                delete reportItem[0]["filterItems"];
                if (reportItem[0]["advancedFilter"])
                    filterInfo = $.map(reportItem[0]["advancedFilter"], function (obj, index) { if (obj.name != undefined && (obj.name.toLocaleLowerCase() != currentLevelInfo)) return obj; });
                if (this._filterAction.toLowerCase() == "labelfiltering")
                    filterInfo.push({ name: this._selectedLevelUniqueName, labelFilterOperator: selectedOperator.replace(/ /g, ""), advancedFilterType: ej.Pivot.AdvancedFilterType.LabelFilter, values: enteredValue });
                else
                    filterInfo.push({ name: this._selectedLevelUniqueName, valueFilterOperator: selectedOperator.replace(/ /g, ""), advancedFilterType: ej.Pivot.AdvancedFilterType.ValueFilter, values: enteredValue, measure: selectedMeasure });

                this._currentReportItems = $.grep(this._currentReportItems, function (value, i) { if (value["data-fieldName"] != currentHierarchy) return value; });
                reportItem[0]["advancedFilter"] = filterInfo;
               if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                   this.model.dataSource = this.clearDrilledItems(this.model.dataSource, { action: "filtering" }, this);
            }

            this._waitingPopup.show();

            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                ej.PivotAnalysis._valueSorting = null;
                ej.PivotAnalysis._valueFilterArray = $.grep(ej.PivotAnalysis._valueFilterArray, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() != currentHierarchy.toLowerCase())) return obj; });
                if (this._filterAction == "valueFiltering") {
                    ej.PivotAnalysis._valueFilterArray.push(reportItem[0]);
                }
                this.refreshControl();
            }
            else
                this.getJSONData({ action: "advancedfiltering" }, this.model.dataSource, this);
        },

        _nodeCheckChanges: function (args) {
            if (this._onDemandNodeExpand) {
                this._isMembersFiltered = true;
                var gridObj = this;
                var treeElement = this.element.find(".e-editorTreeView");
                var searchElement = null;
                if ((args.id.toLowerCase() == "(all)_0" || args.id.toLowerCase() == "all") && args.type == "nodeUncheck") {
                    this._memberTreeObj.model.nodeCheck = "";
                    this._memberTreeObj.model.nodeUncheck = "";
                    if (this._isOptionSearch) {
                        searchElement = $(treeElement).find("li[data-isItemSearch='true']");
                        if (searchElement.length > 0) {
                            $(searchElement).each(function (index, item) {
                                $(treeElement).ejTreeView("uncheckNode", $(item));
                            });
                        }
                    }
                    else if (this.model.enableMemberEditorPaging && $(treeElement).find("li span.e-searchfilterselection").length > 0) {
                        $(treeElement).ejTreeView("unCheckAll");
                        if (this._isSelectSearchFilter) $(treeElement).find("li span.e-searchfilterselection").closest("li").find("span.e-chk-image").removeClass("e-stop").addClass("e-checkmark");
                        else
                            $(treeElement).find("li span.e-searchfilterselection").closest("li").find("span.e-chk-image").removeClass("e-checkmark").removeClass("e-stop");
                    }
                    else
                        $(treeElement).ejTreeView("unCheckAll");
                    this._memberTreeObj.model.nodeCheck = ej.proxy(this._nodeCheckChanges, this);
                    this._memberTreeObj.model.nodeUncheck = ej.proxy(this._nodeCheckChanges, this);
                    if ($(treeElement).find("li").length > 0 && (!$(treeElement).find("li").find("span.e-checkmark").length > 0))
                        this._dialogOKBtnObj.disable();
                    else if ($(treeElement).find("li").length > 0 && ($(treeElement).find("li").find("span.e-checkmark").length == 1 && $(treeElement).find("li span.e-searchfilterselection").closest("li").find("span.e-checkmark").length > 0))
                        this._dialogOKBtnObj.disable();
                    if (this.model.enableMemberEditorPaging || this._editorTreeData.length > 0) {
                        this.element.find(".e-dialogOKBtn").attr('disabled', 'disabled');
                        this._isAllMemberChecked = false;
                        if (this._editorSearchTreeData.length > 0)
                            for (var i = 0; i < this._editorSearchTreeData.length; i++) {
                                $(this._editorTreeData).each(function (index, item) {
                                    if (gridObj._editorSearchTreeData[i].id == item.id) {
                                        gridObj._editorSearchTreeData[i].checkedStatus = false;
                                        item.checkedStatus = false;
                                        return false;
                                    }
                                });
                            }
                        else {
                            $(this._editorTreeData).each(function (index, item) { item.checkedStatus = false; });
                        }
                        $(this._editorTreeData).each(function (index, item) {
                            if (item.checkedStatus) {
                                gridObj._dialogOKBtnObj.enable();
                                gridObj.element.find(".e-dialogOKBtn").removeAttr("disabled");
                                return false;
                            }
                        });
                    }
                }
                else if ((args.id.toLowerCase() == "(all)_0" || args.id.toLowerCase() == "all") && args.type == "nodeCheck") {
                    this._memberTreeObj.model.nodeCheck = "";
                    this._memberTreeObj.model.nodeUncheck = "";
                    if (this._isOptionSearch) {
                        searchElement = $(treeElement).find("li[data-isItemSearch='true']");
                        if (searchElement.length > 0) {
                            $(searchElement).each(function (index, item) {
                                $(treeElement).ejTreeView("checkNode", $(item));
                            });
                        }
                    }
                    else if (this.model.enableMemberEditorPaging && $(treeElement).find("li span.e-searchfilterselection").length > 0) {
                        $(treeElement).ejTreeView("checkAll");
                        if (this._isSelectSearchFilter) $(treeElement).find("li span.e-searchfilterselection").closest("li").find("span.e-chk-image").removeClass("e-stop").addClass("e-checkmark");
                        else
                            $(treeElement).find("li span.e-searchfilterselection").closest("li").find("span.e-chk-image").removeClass("e-checkmark").removeClass("e-stop");
                    }
                    else
                        $(treeElement).ejTreeView("checkAll");
                    $(this._memberTreeObj.element.find("li:first")).find("span.e-chk-image").removeClass("e-stop");
                    this._memberTreeObj.model.nodeCheck = ej.proxy(this._nodeCheckChanges, this);
                    this._memberTreeObj.model.nodeUncheck = ej.proxy(this._nodeCheckChanges, this);
                    if ($(treeElement).find("li").length > 0 && $(treeElement).find("li").find("span.e-checkmark").length > 0)
                        this._dialogOKBtnObj.enable();
                    if (this.model.enableMemberEditorPaging || this._editorTreeData.length > 0) {
                        this.element.find(".e-dialogOKBtn").removeAttr("disabled");
                        this._isAllMemberChecked = true;
                        if (this._editorSearchTreeData.length > 0)
                            for (var i = 0; i < this._editorSearchTreeData.length; i++) {
                                $(this._editorTreeData).each(function (index, item) {
                                    if (gridObj._editorSearchTreeData[i].id == item.id) {
                                        gridObj._editorSearchTreeData[i].checkedStatus = true;
                                        item.checkedStatus = true;
                                        return false;
                                    }
                                });
                            }
                        else {
                            $(this._editorTreeData).each(function (index, item) { item.checkedStatus = true; });
                        }
                    }
                }
                else if (args.id.toLowerCase() == "searchfilterselection") {
                    ej.Pivot._updateSearchFilterSelection(args, treeElement, gridObj);
                }
                else if ((args.id.toLowerCase() == "(all)_0" || args.id.toLowerCase() != "all") && (this.model.enableMemberEditorPaging || this._editorTreeData)) {
                    if (args.type == "nodeUncheck") {
                        this._isMembersFiltered = true;
                        var temp = "";
                        ej.Pivot._memberPageNodeUncheck(args, this);
                        temp = ej.DataManager(this._editorTreeData).executeLocal(ej.Query().where("pid", "equal", null || undefined).where("checkedStatus", "equal", true));
                        if (!ej.isNullOrUndefined(temp) && temp.length > 0 && (temp[0].id == "All" || temp[0].id == "(All)_0"))
                            temp.splice(0, 1);
                        var firstNode = $(this._memberTreeObj.element.find("li:first")).find("span.e-chk-image");
                        if (!ej.isNullOrUndefined(temp) && temp.length == 0) {
                            this._dialogOKBtnObj.disable();
                            this.element.find(".e-dialogOKBtn").attr('disabled', 'disabled');
                            this._isAllMemberChecked = false;
                            firstNode.removeClass("e-stop").removeClass("e-checkmark").addClass("e-chk-inact");
                        }
                        else {
                            $(this._memberTreeObj.element.find("li:first")).find("span.e-chk-image").removeClass("e-stop").addClass("e-checkmark");
                            $(this._editorTreeData).each(function (index, item) {
                                if (item.checkedStatus) {
                                    this._isAllMemberChecked = false;
                                    $(gridObj._memberTreeObj.element.find("li:first")).find("span.e-chk-image").removeClass("e-checkmark").addClass("e-stop");
                                    return false;
                                }
                            });
                        }
                    }
                    else if (args.type == "nodeCheck") {
                        this._isMembersFiltered = true;
                        ej.Pivot._memberPageNodeCheck(args, this);
                        this.element.find(".e-dialogOKBtn").data("ejButton").enable();
                        this.element.find(".e-dialogOKBtn").removeAttr("disabled");
                        this._isAllMemberChecked = true;
                        $(this._memberTreeObj.element.find("li:first")).find("span.e-chk-image").removeClass("e-stop").addClass("e-checkmark");
                        $(this._editorTreeData).each(function (index, item) {
                            if (!item.checkedStatus) {
                                this._isAllMemberChecked = false;
                                $(gridObj._memberTreeObj.element.find("li:first")).find("span.e-chk-image").removeClass("e-checkmark").addClass("e-stop");
                                return false;
                            }
                        });
                    }
                }
                else if (args.id.toLowerCase() == "(all)_0" || args.id.toLowerCase() != "all") {
                    var uncheckedNodes = this._memberTreeObj.element.find(":input:gt(0).nodecheckbox:not(:checked)"),
                    firstNode = $(this._memberTreeObj.element.find("li:first")).find("span.e-chk-image");
                    if (this._dialogHead == "KPI") {
                        var isChecked = true, element = this.element.find(".e-editorTreeView ul:eq(0)");
                        for (var i = 0; i < element.children("li").length; i++) {
                            if (element.children("li:eq(" + i + ")").find(".e-check-small").attr("aria-checked") == "false") {
                                isChecked = false;
                                break;
                            }
                        }
                        if (isChecked) this._dialogOKBtnObj.enable();
                        else {
                            firstNode.removeClass("e-checkmark").removeClass("e-stop");
                            this._dialogOKBtnObj.disable();
                        }
                    }
                    else {
                        if (uncheckedNodes.length == 0 || (uncheckedNodes.length == 1 && uncheckedNodes[0].id[uncheckedNodes[0].id.length - 1] == 0)) {
                            $(firstNode).parent().removeClass("e-chk-inact").removeClass("e-chk-ind").addClass("e-chk-act");
                            firstNode.removeClass("e-stop").addClass("e-checkmark");
                        }
                        else if (args.type == "nodeCheck" && uncheckedNodes.length == 1 && uncheckedNodes[0].id[uncheckedNodes[0].id.length - 1] == 0)
                            firstNode.removeClass("e-stop").addClass("e-checkmark");
                        else if (uncheckedNodes.length > 0)
                            firstNode.removeClass("e-checkmark").addClass("e-stop");
                        this._dialogOKBtnObj.enable();
                        if (args.type == "nodeUncheck") {
                            if (uncheckedNodes.length + 1 == this._memberTreeObj.element.find("li").length) {
                                firstNode.removeClass("e-checkmark").removeClass("e-stop");
                                this._dialogOKBtnObj.disable();
                            }
                            else if (this._isOptionSearch && ($(treeElement).find("li span.e-searchfilterselection").closest("li").find("span.e-checkmark").length > 0) && this._memberTreeObj.element.find(":input:gt(0).nodecheckbox:checked").length == 1) {
                                firstNode.removeClass("e-checkmark").removeClass("e-stop");
                                this._dialogOKBtnObj.disable();
                            }
                        }
                    }
                }
            }
        },

        _fetchMemberSuccess: function (msg) {
            if (msg[0] != undefined && msg.length > 0) {
                this._currentMembers = msg[0].Value;
                if (msg[1] != null && msg[1] != undefined)
                    this.model.customObject = msg[1].Value;
            }
            else if (msg.d != undefined && msg.d.length > 0) {
                this._currentMembers = msg.d[0].Value;
                if (msg.d[1] != null && msg.d[1] != undefined)
                    this.model.customObject = msg.d[1].Value;
            }
            else if (msg != undefined && msg.length > 0) {
                this._currentMembers = msg.EditorTreeInfo;
                if (msg != null && msg != undefined)
                    this.model.customObject = msg.customObject;
            }
            else if (msg != undefined) {
                this._currentMembers = msg.EditorTreeInfo;
            }
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && !this.model.enableMemberEditorPaging && (this._editorTreeData.length == 0 || this._isFilterBtnClick)) {
                this._editorTreeData = JSON.parse(this._currentMembers);
                if (this.model.enableAdvancedFilter)
                    this._editorTreeData = $.map(this._editorTreeData, function (val) { if (ej.isNullOrUndefined(val.levels)) return val; });
            }
            this._savedReportItems = $.extend(true, [], this._currentReportItems);
            this._isFilterBtnClick = false;
            this._createDialog(this._dialogHead, this._currentMembers);
            if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "fetchMembers", element: this.element, customObject: this.model.customObject });
            if (this.model.dataSource.enableAdvancedFilter) {
                this.element.find(".e-dialog #GroupLabelDrop_wrapper:visible").first().attr("tabindex", "-1").focus().addClass("e-hoverCell");
            }
            else if (!ej.isNullOrUndefined(this.element.find(".e-dialog .e-text:visible").first())) {
                this.element.find(".e-dialog .e-text:visible").first().attr("tabindex", "-1").focus().addClass("e-hoverCell");
            }
            this._waitingPopup.hide();
        },

        _filterElementSuccess: function (report) {
            if (report[0] != undefined) {
                if (report[2] != null && report[2] != undefined)
                    this.model.customObject = report[2].Value;
            }
            else if (report.d != undefined) {
                if (report.d[2] != null && report.d[2] != undefined)
                    this.model.customObject = report.d[2].Value;
            }
            else {
                if (report.customObject != null && report.customObject != undefined)
                    this.model.customObject = report.customObject;
            }
            if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "filtering", element: this.element, customObject: this.model.customObject });
            this._renderControlSuccess(report);
        },

        _sortingSuccess: function (msg) {
            if (msg[0] != undefined) {
                if (msg[2] != undefined && msg.length > 0)
                    this.model.customObject = msg[2].Value;
            }
            else if (msg.d != undefined && msg.d.length > 0) {
                if (msg.d[2] != null && msg.d[2] != undefined)
                    this.model.customObject = msg.d[2].Value;
            }
            else if (msg != undefined && msg.length > 0) {
                if (msg.customObject != null && msg.customObject != undefined)
                    this.model.customObject = msg.customObject;
            }
            if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "sorting", element: this.element, customObject: this.model.customObject });
            this._renderControlSuccess(msg)
        },
        _nodeExpand: function (args) {
            var selectedItem = ej.isNullOrUndefined(args.event) ? args.targetElement : (args.event.originalEvent != undefined && args.event.originalEvent.target != undefined) ? args.event.originalEvent.target : args.event.target; var tagInfo, dimenName = "";
            this._isSchemaClick = args._isSchemaClick ? true : false;
            if (selectedItem != undefined && selectedItem.className != undefined && selectedItem.className != "" && selectedItem.className.indexOf("e-minus") > -1) {
                args.olapCtrlObj = args._isSchemaClick ? this._schemaData : this;
                ej.Pivot._onNodeCollapse(args);
                return;
            }
            jQuery.each(this._isSchemaClick ? this._schemaData._editorTreeData : this._editorTreeData, function (index, value) { if (value.id == args.id) { value.expanded = true; value.isChildMerged = true; return false; } });
            var childCount = $(selectedItem).parents("li").first().children().find("li").length;
            var treeDataSource = args._isSchemaClick ? this._schemaData._memberTreeObj.dataSource() : this._memberTreeObj.dataSource();
            if (this.model.enableMemberEditorPaging) {
                for (var i = 0; i < treeDataSource.length; i++) {
                    if (treeDataSource[i].parentId == args.id || treeDataSource[i].pid == args.id) {
                        args.isChildLoaded = true;
                        ej.Pivot.closePreventPanel(this);
                        return;
                    }
                }
            }
            if (!ej.isNullOrUndefined(this) && this.model.enableMemberEditorPaging && ej.DataManager(this._editorTreeData).executeLocal(ej.Query().where("pid", "equal", args.id)).length > 0 && selectedItem != undefined && selectedItem.className != undefined && selectedItem.className != "" && selectedItem.className.indexOf("e-plus") > -1 && childCount == 0) {
                args.isChildLoaded = true;
                ej.Pivot.closePreventPanel(this);
                this.pNode = selectedItem;
                this._fetchChildNodeSuccess({ ChildNodes: JSON.stringify(ej.DataManager(this._editorTreeData).executeLocal(ej.Query().where("pid", "equal", args.id))), customObject: this.model.customObject });
                return;
            }
            if (selectedItem != undefined && selectedItem.className != undefined && selectedItem.className != "" && selectedItem.className.indexOf("e-plus") > -1 && childCount == 0) {
                $(selectedItem).removeClass("e-plus").addClass("e-load");
                var checkedState = $(selectedItem).parent().find("input.e-checkbox").prop("checked"), report;
                var tagInfo = $(selectedItem).parents("li").first().attr("data-tag");
                this.pNode = selectedItem;
                try {
                    report = JSON.parse(this.model.pivotControl != undefined ? this.model.pivotControl.getOlapReport() : this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.model.pivotControl != undefined ? this.model.pivotControl.getOlapReport() : this.getOlapReport();
                }
                var pivotButtons = this.element.find(".e-pivotButton"), parentTag, tagName;
                for (var bt = 0; bt < pivotButtons.length > 0; bt++) {
                    if ($(pivotButtons[bt]).attr("data-tag").indexOf(!ej.isNullOrUndefined(this._curFilteredText) ? this._curFilteredText : !ej.isNullOrUndefined(this._schemaData) ? this._schemaData._curFilteredText : "") > -1 && $(pivotButtons[bt]).attr("data-tag").split(":")[1].length == (!ej.isNullOrUndefined(this._curFilteredText) ? this._curFilteredText.length : !ej.isNullOrUndefined(this._schemaData)? this._schemaData._curFilteredText.length : 0))
                        dimenName = $(pivotButtons[bt]).attr("data-tag");
                    else if ($(pivotButtons[bt]).attr("data-tag").indexOf(!ej.isNullOrUndefined(this._curFilteredText) ? this._curFilteredText : !ej.isNullOrUndefined(this._schemaData) ? this._schemaData._curFilteredText : "") > -1)
                        tagName = $(pivotButtons[bt]).attr("data-tag");
                }
                dimenName = dimenName == "" ? !ej.isNullOrUndefined(tagName) ? tagName.split(":")[1] : !ej.isNullOrUndefined(this._curFilteredText) ? this._curFilteredText : this._schemaData._curFilteredText : dimenName.split(":")[1];
                if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                    this._trigger("beforeServiceInvoke", { action: "memberExpanded", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.memberExpand, JSON.stringify({
                    "action": "memberExpanded", "checkedStatus": checkedState, "parentNode": $(selectedItem).parents("li")[0].id, "tag": tagInfo, "cubeName": JSON.parse(this._olapReport).CurrentCube + "##" + dimenName, "currentReport": report, "customObject": serializedCustomObject
                }), this._fetchChildNodeSuccess);
            }
        },

        _fetchChildNodeSuccess: function (data) {
            var newDataSource; var parentNode;
            if (data.length > 1 && data[0] != undefined) {
                newDataSource = JSON.parse(data[0].Value);
                if (data[1] != null && data[1] != undefined)
                    this.model.customObject = data[1].Value;
            }
            else if (data.d != undefined) {
                newDataSource = JSON.parse(data.d[0].Value);
                if (data.d[1] != null && data.d[1] != undefined)
                    this.model.customObject = data.d[1].Value;
            }
            else {
                newDataSource = JSON.parse(data.ChildNodes);
                if (data.customObject != null && data.customObject != undefined)
                    this.model.customObject = data.customObject;
            }
            var mapper = { id: "id", parentId: "pid", hasChild: "hasChildren", text: "name", isChecked: "checkedStatus" };
            if ($(this.pNode).parents("li").length > 1)
                parentNode = $(this.pNode).parents("li").first();
            else
                parentNode = $(this.pNode).parents("li");
            $($(parentNode).find('input.nodecheckbox')[0]).ejCheckBox({ checked: false })

            var controlObj = this._isSchemaClick ? this._schemaData : this;
            if (this.model.enableMemberEditorPaging) {
                var collObj = ej.Pivot._generateChildWithAncestors(controlObj, parentNode, this.model.enableMemberEditorPaging, this.model.memberEditorPageSize);
                if ((newDataSource.length >= this.model.memberEditorPageSize || collObj.lstChildren.length >= this.model.memberEditorPageSize)) {
                    controlObj.element.find(".searchEditorTreeView").data("ejMaskEdit").clear();
                    controlObj._lastSavedTree = [];
                    ej.Pivot._makeAncestorsExpandable(controlObj, parentNode[0].id);
                    controlObj._isEditorDrillPaging = true;
                    var parentNodeObj = collObj.allLvlLst.length > 1 && collObj.lstChildren.length >= this.model.memberEditorPageSize ? ej.Pivot._getParentsTreeList(controlObj, collObj.lstParents[0].id, controlObj._editorTreeData) : $.grep(controlObj._editorTreeData, function (value) { return value.id == parentNode["0"].id; return false; })[0];
                    var editorDrillParams = { childNodes: collObj.allLvlLst.length > 1 && collObj.lstChildren.length >= this.model.memberEditorPageSize ? collObj.lstChildren : newDataSource, parentNode: parentNodeObj };
                    ej.Pivot._drillEditorTreeNode(editorDrillParams, controlObj, this.model.memberEditorPageSize);
                }
                else {
                    if (!ej.isNullOrUndefined(this._memberTreeObj) && (this._editorFlag) && !this._isSchemaClick)
                        this._memberTreeObj.addNode(ej.Pivot._showEditorLinkPanel(newDataSource, this, this), parentNode);
                    else if (!ej.isNullOrUndefined(this._schemaData._memberTreeObj))
                        this._schemaData._memberTreeObj.addNode(ej.Pivot._showEditorLinkPanel(newDataSource, this._schemaData, this), parentNode);
                }
            }
            else {
                if (!ej.isNullOrUndefined(this._memberTreeObj) && (this._editorFlag) && !this._isSchemaClick)
                    this._memberTreeObj.addNode(ej.Pivot._showEditorLinkPanel(newDataSource, this, this), parentNode);
                else if (!ej.isNullOrUndefined(this._schemaData._memberTreeObj))
                    this._schemaData._memberTreeObj.addNode(ej.Pivot._showEditorLinkPanel(newDataSource, this._schemaData, this), parentNode);
                if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                    $.merge(controlObj._editorTreeData, $.extend(true, [], newDataSource));
            }
            if (newDataSource.length > 0 && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.enableMemberEditorPaging && !ej.DataManager(controlObj._editorTreeData).executeLocal(ej.Query().where("pid", "equal", newDataSource[0].pid)).length > 0)
                $.merge(controlObj._editorTreeData, $.extend(true, [], newDataSource));
            $.each($(parentNode).children().find("li"), function (index, value) {
                value.setAttribute("data-tag", newDataSource[index].tag);
            });
            if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "memberExpanded", element: this.element, customObject: this.model.customObject });
            // this._memberTreeObj._expandCollapseAction(this.pNode);
            if (!ej.isNullOrUndefined(this._schemaData))
                this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
        },

        _beforeNodeExpand: function (args) {
            ej.Pivot.getChildNodes(args, this._selectedField, this._currentReportItems, this.model.dataSource, this);
        },
        _generateAllMember: function(customArgs,args){
            this.olapCtrlObj._allMember = $($(args).find("Axis:eq(0) Tuple:eq(0)").children().children()[1]).text();
        },
        _generateMembers: function (customArgs,args) {
            var data = $(args).find("Axis:eq(0) Tuple"),    treeViewData = [],treeNodeInfo={};
            treeViewData.push({ id: "All", name: "All", checkedStatus: true,tag:"" });
            for(var i=0;i<data.length;i++){
                var memberUqName=$($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children().children()[0]).text(), 
                    memberName=$($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children().children()[1]).text();
                treeNodeInfo = { hasChildren: $(data[i]).find("CHILDREN_CARDINALITY").text() != "0", checkedStatus: true, id: memberUqName.replace(/\]*\]/g, '-').replace(/\[*\[/g, '-').replace(/ /g, "_"), name: memberName, tag: memberUqName, level: parseInt($(data[i]).find("LNum").text()) };
                treeViewData.push(treeNodeInfo);
            }
            if (!ej.isNullOrUndefined(this.olapCtrlObj)) {
                this.olapCtrlObj._waitingPopup.hide();
                this.olapCtrlObj._editorTreeData = treeViewData;
                this.olapCtrlObj._currentReportItems.push({ filterItems: treeViewData, fieldName: this.olapCtrlObj._selectedField, dataSrc: this.olapCtrlObj.model.dataSource, pageSettings: this.olapCtrlObj._memberCount });
                if (this.olapCtrlObj.model.enableMemberEditorPaging) {
                    this.olapCtrlObj._memberCount = ej.DataManager(this.olapCtrlObj._editorTreeData).executeLocal(ej.Query().where(ej.Predicate("pid", "equal", null).and("id", "notequal", "All"))).length;
                    var treeData = ej.DataManager(this.olapCtrlObj._editorTreeData).executeLocal(ej.Query().where("pid", "equal", null || undefined).page(this.olapCtrlObj._memberPageSettings.currentMemeberPage, this.olapCtrlObj.model.memberEditorPageSize + 1));
                    this.olapCtrlObj._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(treeData) });
                }
                else
                    this.olapCtrlObj._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(treeViewData) });
            }

        },
        _filterBtnClick: function (args) {
            this._editorFlag = true;
            ej.Pivot.openPreventPanel(this);
            this._isAllMemberChecked = true;
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                if (this.model.enableMemberEditorPaging) {
                    this._memberPageSettings.endPage = this.model.memberEditorPageSize;
                    this._memberPageSettings.startPage = 0;
                    this._memberPageSettings.currentMemeberPage = 1;
                }
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    var currentHierarchy = this._selectedField = $(args.currentTarget.parentNode).attr("data-tag").split(":")[1], filteredData = [], reportItem = {}, pageSettings;
                    this._dialogHead = $(args.target).siblings(".e-pvtBtn").attr("data-fieldCaption");
                    filteredData = $.map(this._currentReportItems, function (obj, index) {
                        if (obj["fieldName"] == currentHierarchy) {
                            pageSettings = obj.pageSettings;
                            return $.map(obj["filterItems"], function (itm) { if (itm.expanded) itm.expanded = false; return itm; });
                        }
                    });
                    if (this.model.enableMemberEditorPaging && pageSettings) {
                        if (pageSettings)
                            this._memberCount = pageSettings;
                    }
                    if (filteredData.length > 0) {
                        this._editorTreeData = filteredData;
                        if (this.model.enableMemberEditorPaging) {
                            this._memberCount = ej.DataManager(this._editorTreeData).executeLocal(ej.Query().where(ej.Predicate("pid", "equal", null).and("id", "notequal", "All"))).length;
                            filteredData = ej.DataManager(this._editorTreeData).executeLocal(ej.Query().where("pid", "equal", null || undefined).page(this._memberPageSettings.currentMemeberPage, this.model.memberEditorPageSize + 1));
                        }
                        this._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(filteredData) });
                    }
                    else {
                        this._waitingPopup.show();
                        ej.olap._mdxParser.getMembers(this.model.dataSource, currentHierarchy, this);
                    }
                }
                else {
                    this._selectedField = $(args.target).siblings(".e-pvtBtn").attr("data-fieldName");
                    this._dialogHead = $(args.target).siblings(".e-pvtBtn").attr("data-fieldCaption");
                    this._selectedAxis = $(args.target).siblings(".e-pvtBtn").attr("data-axis");                   
                    var treeViewData = this._getTreeViewData(this._selectedField, this._selectedAxis);
                    if (this.model.enableMemberEditorPaging) {
                        var filteredData = treeViewData;
                        this._editorTreeData = filteredData;
                        this._memberCount = ej.DataManager(this._editorTreeData).executeLocal(ej.Query().where("id", "notequal", "All")).length;
                        filteredData = ej.DataManager(this._editorTreeData).executeLocal(ej.Query().page(this._memberPageSettings.currentMemeberPage, this.model.memberEditorPageSize + 1));
                        this._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(filteredData) });
                    }
                    else
                        this._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(treeViewData) });
                }
            }
            else {
                this._isFilterBtnClick = true;
                this._curFilteredAxis = args.target.parentElement.getAttribute("data-tag").split(":")[0];
                this._curFilteredText = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? args.target.parentElement.getAttribute("data-tag") : $($(args.target).siblings()[1]).attr("data-fieldName");
                this._dialogTitle = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? args.target.parentElement.getAttribute("data-tag") : $($(args.target).siblings()[1]).attr("data-fieldName");
                this._dialogHead = $($(args.target).siblings("button")).attr("data-fieldCaption");
                var report;
                try {
                    report = JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.getOlapReport();
                }
                this._waitingPopup.show();
                if (!ej.isNullOrUndefined(this._schemaData))
                    this._schemaData.element.find(".schemaNoClick").addClass("freeze").width($(this._schemaData.element).width()).height($(this._schemaData.element).height()).css({ "top": $(this._schemaData.element).offset().top, "left": $(this._schemaData.element).offset().left });
                if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                    this._trigger("beforeServiceInvoke", { action: "fetchMembers", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                var eventArgs = JSON.stringify({ "action": "fetchMembers", "headerTag": (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.enableAdvancedFilter) ? this._dialogTitle + "##" + this.model.enableAdvancedFilter : (this._dialogTitle), "sortedHeaders": this._ascdes, "currentReport": report, "valueSorting": JSON.stringify(this.model.valueSortSettings), "customObject": serializedCustomObject });
                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.fetchMembers, eventArgs, this.model.enableMemberEditorPaging ? ej.Pivot._fetchMemberPageSuccess : this._fetchMemberSuccess);
            }
        },

        _getTreeViewData: function (fieldName) {
            var item = ej.Pivot.getReportItemByFieldName(fieldName, this.model.dataSource).item;
            var members = ej.PivotAnalysis.getMembers(fieldName);
            var treeViewData = [{ id: "All", name: "All", checkedStatus: true }];
            if (item.filterItems != null && item.filterItems != undefined)
                for (var i = 0; i < members.length; i++) treeViewData.push({ id: members[i], name: members[i], checkedStatus: item.filterItems.filterType == ej.PivotAnalysis.FilterType.Include ? $.inArray(members[i], item.filterItems.values) >= 0 : $.inArray(members[i], item.filterItems.values) < 0 });
            else
                for (var i = 0; i < members.length; i++) treeViewData.push({ id: members[i], name: members[i], checkedStatus: true });
            return treeViewData;
        },

        _applyToolTip: function (e) {
            if (this.model.enableToolTip) {
                var toolTipInfo; var rowValue; var cellPos; var columnValue = "", valueCell = "";
                var targetCell = $(e.target).hasClass("cellValue") ? e.target.parentElement : e.target;
                if ($(targetCell).find("input").length == 0 && !$(targetCell).hasClass("curInput") && !ej.isNullOrUndefined($(targetCell).attr("role"))) {
                    cellPos = this.element.find(".summary[role!='gridcell'][data-p$='," + $(targetCell).attr('data-p').split(',')[1] + "'] , .rowheader[role!='gridcell'][data-p$='," + $(targetCell).attr('data-p').split(',')[1] + "']").last().attr("data-p")
                    if (cellPos == null)
                        cellPos = $(targetCell).parent("tr").find(".summary,.rowheader").attr("data-p");
                    if (cellPos != null) {
                        if ((cellPos[0] == 0) && ((parseInt(cellPos.split(",")[0])) != null)) {
                            if (cellPos == this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + parseInt(cellPos.split(",")[1]))].Index) {
                                rowValue = this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + parseInt(cellPos.split(",")[1]))].Value;
                            }
                        }
                        else
                            while (cellPos[0] >= 0) {
                                if (cellPos == this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + parseInt(cellPos.split(",")[1]))].Index) {
                                    toolTipInfo = this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + parseInt(cellPos.split(",")[1]))].Value;
                                    cellPos = parseInt(cellPos.split(",")[0]) - 1 + "," + parseInt(cellPos.split(",")[1]);
                                }
                                if (rowValue)
                                    rowValue = toolTipInfo != "" ? toolTipInfo + "-" + rowValue : rowValue;
                                else
                                    rowValue = toolTipInfo;
                            }
                    }
                    var isFrozenEnabled = this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders                    
                    var columnHeaderCount = this.element.find(isFrozenEnabled ? ".pivotGridFrozenTable " : "" + 'tr:has("[role=columnheader]")').length - 1;
                    var currentCellPos = $(targetCell).attr("data-p");
                    if ((currentCellPos != undefined) && (currentCellPos == this.getJSONRecords()[parseInt((parseInt(currentCellPos.split(",")[0]) * this._rowCount) + parseInt(currentCellPos.split(",")[1]))].Index)) {
                        var colPos = parseInt(currentCellPos.split(",")[0]);
                    }
                    for (var i = 0; i <= columnHeaderCount; i++) {
                        var columnHeaderPos = colPos + "," + i;
                        if (colPos != null)
                            if (columnHeaderPos == this.getJSONRecords()[parseInt((parseInt(columnHeaderPos.split(",")[0]) * this._rowCount) + parseInt(columnHeaderPos.split(",")[1]))].Index) {
                                toolTipInfo = this.getJSONRecords()[parseInt((parseInt(columnHeaderPos.split(",")[0]) * this._rowCount) + parseInt(columnHeaderPos.split(",")[1]))];
                                if (toolTipInfo.CSS.indexOf("value") == -1) {
                                    if (columnValue == "")
                                        columnValue = toolTipInfo.Value;
                                    else if (toolTipInfo.Value != "")
                                        columnValue = columnValue + "-" + toolTipInfo.Value;
                                }
                            }
                    }
                    $("#" + this._id + "_gridTooltip").remove();
                    this.element.find("span#celval").remove();
                    var tdPos = $(targetCell).position();
                    if (this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders || this.model.frozenHeaderSettings.enableFrozenHeaders) {
                        var scrollElement = this.element.find(".e-scroller").data("ejScroller");
                        if ((this.model.frozenHeaderSettings.enableFrozenColumnHeaders && !this.model.frozenHeaderSettings.enableFrozenRowHeaders) || ((!this.model.frozenHeaderSettings.enableFrozenColumnHeaders && this.model.frozenHeaderSettings.enableFrozenRowHeaders))) {
                            tdPos.left = ((tdPos.left + this.element.find(".rowhead").width()) - scrollElement.model.scrollLeft);
                            tdPos.top = tdPos.top - scrollElement.model.scrollTop;
                        }
                    }
                    $("#" + this._id).append("<div id=\"" + this._id + "_gridTooltip\" class=\"e-pGridTooltip\" role='tooltip'></div>");
                    $(targetCell).find("span.cellValue").attr("aria-label", "row- " + rowValue + ": column- " + columnValue);
                    var tooltipval = $(targetCell).find("span.cellValue:not('#celval')").text();
                    if (this.model.enableRTL) {
                        $("#" + this._id + "_gridTooltip").append("<p id=\"value\" class=\"e-tooltipText\">" + (tooltipval ? tooltipval : this._getLocalizedLabels("NoValue")) + ":" + this._getLocalizedLabels("ToolTipValue") + "</p>");
                        $("#" + this._id + "_gridTooltip").append("<p id=\"row\" class=\"e-tooltipText\">" + ((rowValue == undefined || this._rowCount == 1) ? this._getLocalizedLabels("NoValue") : this._direction(rowValue)) + ":" + this._getLocalizedLabels("ToolTipRow") + "</p>");
                        $("#" + this._id + "_gridTooltip").append("<p id=\"column\" class=\"e-tooltipText\">" + ((columnValue == undefined || columnValue == "") ? this._getLocalizedLabels("NoValue") : this._direction(columnValue)) + ":" + this._getLocalizedLabels("ToolTipColumn") + "</p>");
                    }
                    else {
                        $("#" + this._id + "_gridTooltip").append("<p id=\"value\" class=\"e-tooltipText\">" + this._getLocalizedLabels("ToolTipValue") + ": " + (tooltipval ? tooltipval : this._getLocalizedLabels("NoValue")) + "</p>");
                        $("#" + this._id + "_gridTooltip").append("<p id=\"row\" class=\"e-tooltipText\">" + this._getLocalizedLabels("ToolTipRow") + ": " + ((rowValue == undefined || this._rowCount == 1) ? this._getLocalizedLabels("NoValue") : rowValue) + "</p>");
                        $("#" + this._id + "_gridTooltip").append("<p id=\"column\" class=\"e-tooltipText\">" + this._getLocalizedLabels("ToolTipColumn") + ": " + ((columnValue == undefined || columnValue == "") ? this._getLocalizedLabels("NoValue") : columnValue) + "</p>");
                    }
                    var containerEndPos = 0;
                    if (!ej.isNullOrUndefined(this._pivotClientObj))
                        containerEndPos = $("#" + this._id).parent().position().left + this._pivotClientObj.element.find(".e-gridContainer").width();
                    else
                        containerEndPos = $("#" + this._id).parent().position().left + $("#" + this._id).parent().width();
                    var tooltipEndPos = tdPos.left + $("#" + this._id + "_gridTooltip").width();
                    var leftPos = 0; topPos: 0;
                    if (!ej.isNullOrUndefined(this._pivotClientObj)) {
                        leftPos = ((tdPos.left > 0 ? tdPos.left : 0) + ((containerEndPos - tooltipEndPos) < 50 ? ((containerEndPos - tooltipEndPos) - 40) : 5) + this._pivotClientObj.element.find(".e-gridContainer").scrollLeft());
                        topPos = ((this._pivotClientObj.element.find(".e-gridContainer").height() - tdPos.top) < 150 ? (tdPos.top - $("#" + this._id + "_gridTooltip").outerHeight() - 2) : tdPos.top + 40) + this._pivotClientObj.element.find(".e-gridContainer").scrollTop();
                    }
                    else {
                        leftPos = (tdPos.left > 0 ? tdPos.left : 0) + ((containerEndPos - tooltipEndPos) < 0 ? ((containerEndPos - tooltipEndPos) - 20) : 5);
                        topPos = ($(this.element).height() - tdPos.top) < 100 ? (tdPos.top - $("#" + this._id + "_gridTooltip").outerHeight() - 2) : tdPos.top + 40;
                    }
                    $("#" + this._id + "_gridTooltip").css({ left: leftPos, top: topPos });                   
                    if (this.model.enableToolTipAnimation)
                        $("#" + this._id + "_gridTooltip").show("fast");
                    else
                        $("#" + this._id + "_gridTooltip").show();
                    if (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj.controlPlacement() == "tile")
                        $("#" + this._id + "_gridTooltip").css("position", "absolute");
                }
            }
        },

        _applyVScrolling: function () {           
            var _mouseWheel, isPivotClient = (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj.model.enableVirtualScrolling),
            oGridDiv = !isPivotClient ? $(this.element).find('.virtualScrollGrid') : this._pivotClientObj.element.find(".e-pivotgrid"),
            ctrlObj = !isPivotClient ? this : this._pivotClientObj,
            pGridObj = (isPivotClient && !ej.isNullOrUndefined(this._pivotClientObj._pivotGrid)) ? this._pivotClientObj._pivotGrid : this;
            var isClientWithResponsive = isPivotClient && this.model.isResponsive;

            if (pGridObj._seriesPageCount > 1) {
                var getMinVerticalPos = function () { return isClientWithResponsive ? (Math.round(ctrlObj.element.find(".e-vScrollPanel").offset().top) + 1) : (Math.round(ctrlObj.element.find(".e-vScrollPanel").position().top) + 1); };
                var vScrollBar = $(ctrlObj.element).find(".e-vScrollPanel");
                vScrollBar.height(!isPivotClient ? $(oGridDiv).height() : (this._pivotClientObj.model.isResponsive ? parseInt(this._pivotClientObj.element.find(".e-controlPanel").height()) : parseInt(this._pivotClientObj.element.find(".e-gridContainer").height())));
                vScrollBar.html(ej.buildTag("div.e-vScrollThumb")[0].outerHTML);
                var vScrollHandle = vScrollBar.find(".e-vScrollThumb");
                vScrollHandle.height(Math.max(Math.ceil((!isPivotClient ? $(oGridDiv).height() : (this._pivotClientObj.model.isResponsive ? parseInt(this._pivotClientObj.element.find(".e-controlPanel").height()) : parseInt(this._pivotClientObj.element.find(".e-gridContainer").height()))) / pGridObj._seriesPageCount), 15));
                var vDragRange = vScrollBar.height() - vScrollHandle.height() - 2;
                vScrollHandle.offset({ top: getMinVerticalPos() + (pGridObj._seriesCurrentPage - 1) * (vDragRange / (pGridObj._seriesPageCount - 1)) });

                $(".e-vScrollPanel").on('mousewheel DOMMouseScroll', function (e) {
                  
                    $('body').on('mousewheel DOMMouseScroll', function (e) { e.preventDefault(); e.stopPropagation(); return false; });
                    initThumbPos = (isClientWithResponsive ? vScrollHandle.offset().top : vScrollHandle.position().top) - getMinVerticalPos(), currentPage = pGridObj._seriesCurrentPage;
                    movedDistance = (e.originalEvent.wheelDelta < 0 || e.originalEvent.detail > 0) ? e.target.offsetParent.offsetTop + 10 : -e.target.offsetParent.offsetTop - 10;
                    ctrlObj.element.find(".e-seriesPageIndicator").removeClass("inActive").css({ top: vScrollHandle.position().top, left: vScrollHandle.position().left + 20 });
                    var currentPage = pGridObj._seriesCurrentPage;
                    window.navigator.userAgent.indexOf('MSIE ') > -1 ? $(document).on("selectstart", function (e) { e.preventDefault(); }) : window.getSelection().removeAllRanges();
                    var topPos;
                    ((movedDistance > 0 && initThumbPos + movedDistance <= vDragRange) || (movedDistance < 0 && initThumbPos + movedDistance >= 0)) ? topPos = initThumbPos + movedDistance + getMinVerticalPos() : (initThumbPos + movedDistance > vDragRange) ? topPos = getMinVerticalPos() + vDragRange : (initThumbPos + movedDistance < 0) ? topPos = getMinVerticalPos() : "";
                    vScrollHandle.offset({ top: topPos });
                    currentPage = Math.ceil(((isClientWithResponsive ? vScrollHandle.offset().top : vScrollHandle.position().top) - getMinVerticalPos()) / (vDragRange / pGridObj._seriesPageCount)) == 0 ? 1 : Math.ceil(((isClientWithResponsive ? vScrollHandle.offset().top : vScrollHandle.position().top) - getMinVerticalPos()) / (vDragRange / pGridObj._seriesPageCount));
                    if (currentPage > pGridObj._seriesPageCount) { currentPage = pGridObj._seriesPageCount }
                    if (movedDistance > 0 ? pGridObj._seriesCurrentPage > currentPage : pGridObj._seriesCurrentPage < currentPage)
                        currentPage = pGridObj._seriesCurrentPage;
                    ctrlObj.element.find(".e-seriesPageIndicator").css({ top: vScrollHandle.position().top });
                    ctrlObj.element.find(".series_CurrentPage").html(currentPage);
                    if (currentPage != pGridObj._seriesCurrentPage) {
                        pGridObj._seriesCurrentPage = currentPage;
                        clearTimeout(_mouseWheel);
                        _mouseWheel = setTimeout(function () {
                            isPivotClient ? pGridObj._pivotClientObj.refreshPagedPivotClient("series", pGridObj._seriesCurrentPage) :
                            pGridObj.refreshPagedPivotGrid("series", pGridObj._seriesCurrentPage);
                        }, 250);
                    }
                });

                $(vScrollHandle).on('mousedown touchstart', function (e) {                   
                    $(this).addClass("dragging");
                    var initCursorPos = e.pageY - getMinVerticalPos();
                    var initThumbPos = (isClientWithResponsive ? vScrollHandle.offset().top : vScrollHandle.position().top) - getMinVerticalPos();
                    ctrlObj.element.find(".e-seriesPageIndicator").removeClass("inActive").css({ top: vScrollHandle.position().top, left: vScrollHandle.position().left + 20 });
                    var prevDistance = (e.pageY - getMinVerticalPos()) - initCursorPos;
                    var currentPage = pGridObj._seriesCurrentPage;
                    $(document).on('mousemove touchmove', function (e) {
                        if (window.navigator.userAgent.indexOf('Trident') > -1)
                            $(document).on("selectstart", function (e) { e.preventDefault(); });
                        else
                            window.getSelection().removeAllRanges();
                        var movedDistance = (e.pageY - getMinVerticalPos()) - initCursorPos;
                        if (movedDistance != 0) {
                            if (movedDistance > 0 && initThumbPos + movedDistance <= vDragRange)
                                vScrollHandle.offset({ top: initThumbPos + movedDistance + getMinVerticalPos() });
                            else if (movedDistance < 0 && initThumbPos + movedDistance >= 0)
                                vScrollHandle.offset({ top: initThumbPos + movedDistance + getMinVerticalPos() });
                            else if (initThumbPos + movedDistance > vDragRange)
                                vScrollHandle.offset({ top: getMinVerticalPos() + vDragRange });
                            else if (initThumbPos + movedDistance < 0)
                            vScrollHandle.offset({ top: getMinVerticalPos() });
                            currentPage = Math.floor((Math.round((isClientWithResponsive ? vScrollHandle.offset().top : vScrollHandle.position().top)) - getMinVerticalPos()) / (vDragRange / pGridObj._seriesPageCount)) == 0 ? 1 : Math.floor((Math.round((isClientWithResponsive ? vScrollHandle.offset().top : vScrollHandle.position().top)) - getMinVerticalPos()) / (vDragRange / pGridObj._seriesPageCount));
                            if (prevDistance < movedDistance ? currentPage < pGridObj._seriesCurrentPage : currentPage > pGridObj._seriesCurrentPage)
                                currentPage = pGridObj._seriesCurrentPage;
                        }
                        ctrlObj.element.find(".e-seriesPageIndicator").css({ top: vScrollHandle.position().top });
                        ctrlObj.element.find(".series_CurrentPage").html(currentPage);
                        ctrlObj.element.find(".e-vScrollThumb").attr("title", ctrlObj.element.find(".e-seriesPageIndicator").text());
                    });
                    $(document).on('mouseup touchend', function () {
                        $(document).off("selectstart");
                        $(this).off('mousemove touchmove').off('mouseup touchend');
                        $(vScrollHandle).removeClass("dragging");
                        if (currentPage != pGridObj._seriesCurrentPage) {
                            pGridObj._seriesCurrentPage = currentPage;
                            isPivotClient ? pGridObj._pivotClientObj.refreshPagedPivotClient("series", pGridObj._seriesCurrentPage) : pGridObj.refreshPagedPivotGrid("series", pGridObj._seriesCurrentPage);
                        }
                        else
                            ctrlObj.element.find(".e-seriesPageIndicator").addClass("inActive");
                    });
                });
            }

            if (pGridObj._categPageCount > 1) {
                var getMinHorizontalPos = function () { return isClientWithResponsive ? (Math.round(ctrlObj.element.find(".e-hScrollPanel").offset().left) + 1) : (Math.round(ctrlObj.element.find(".e-hScrollPanel").position().left) + 1); };
                if (this.element.parents(".e-pivotclient").length > 0 && this._pivotClientObj.element.find(".childsplit").length > 0)
                    this._pivotClientObj.element.find(".childsplit").data("ejSplitter").refresh();
                var hScrollBar = $(ctrlObj.element).find(".e-hScrollPanel");
                hScrollBar.width(!isPivotClient ? $(oGridDiv).width() : (this._pivotClientObj.model.enableSplitter ? parseInt(this._pivotClientObj.element.find(".controlPanelTD").width()) : parseInt(this._pivotClientObj.element.find(".e-controlPanel").width())));
                hScrollBar.html(ej.buildTag("div.e-hScrollThumb")[0].outerHTML);
                var hScrollHandle = hScrollBar.find(".e-hScrollThumb");
                hScrollHandle.width(Math.max(Math.ceil((!isPivotClient ? $(oGridDiv).width() : (this._pivotClientObj.model.enableSplitter ? parseInt(this._pivotClientObj.element.find(".controlPanelTD").width()) : parseInt(this._pivotClientObj.element.find(".e-controlPanel").width()))) / pGridObj._categPageCount), 15));
                var hDragRange = hScrollBar.width() - hScrollHandle.width() - 2;
                if (this.model.enableRTL)
                    hScrollHandle.css({ right: ((pGridObj._categCurrentPage - 1) * (hDragRange / (pGridObj._categPageCount - 1))) });
                else
                    hScrollHandle.offset({ left: getMinHorizontalPos() + (pGridObj._categCurrentPage - 1) * (hDragRange / (pGridObj._categPageCount - 1)) });

                $(".e-hScrollPanel").on('mousewheel DOMMouseScroll', function (e) {
                    $('body').on('mousewheel DOMMouseScroll', function (e) { e.preventDefault(); e.stopPropagation(); return false; });
                    initThumbPos = ctrlObj.model.enableRTL ? ctrlObj.element.find(".e-hScrollPanel").width() - (((isClientWithResponsive ? hScrollHandle.offset().left : hScrollHandle.position().left) + 16) - getMinHorizontalPos()) : (isClientWithResponsive ? hScrollHandle.offset().left : hScrollHandle.position().left) - getMinHorizontalPos(), currentPage = pGridObj._categCurrentPage;
                    movedDistance = (e.originalEvent.wheelDelta < 0 || e.originalEvent.detail > 0) ? (isPivotClient ? e.target.offsetParent.children[1].offsetLeft + 10 : e.target.offsetParent.offsetLeft + 10) : (isPivotClient ? -e.target.offsetParent.children[1].offsetLeft - 10 : -e.target.offsetParent.offsetLeft - 10);
                    movedDistance = ctrlObj.model.enableRTL ? -movedDistance : movedDistance;
                    ctrlObj.element.find(".e-categPageIndicator").removeClass("inActive").css({ left: hScrollHandle.position().left, top: hScrollHandle.position().top + 20 });
                    window.navigator.userAgent.indexOf('MSIE ') > -1 ? $(document).on("selectstart", function (e) { e.preventDefault(); }) : window.getSelection().removeAllRanges();
                    var leftPos;
                    ctrlObj.model.enableRTL ? (((movedDistance > 0 && initThumbPos + movedDistance <= hDragRange) || (movedDistance < 0 && initThumbPos + movedDistance >= 0)) ? leftPos = initThumbPos + movedDistance : (initThumbPos + movedDistance > hDragRange) ? leftPos = hDragRange : (initThumbPos + movedDistance < 0) ? leftPos = 0 : "") : (((movedDistance > 0 && initThumbPos + movedDistance <= hDragRange) || (movedDistance < 0 && initThumbPos + movedDistance >= 0)) ? leftPos = initThumbPos + movedDistance + getMinHorizontalPos() : (initThumbPos + movedDistance > hDragRange) ? leftPos = getMinHorizontalPos() + hDragRange : (initThumbPos + movedDistance < 0) ? leftPos = getMinHorizontalPos() : "");
                    ctrlObj.model.enableRTL ? hScrollHandle.css("right", leftPos) : hScrollHandle.offset({ left: leftPos });
                    currentPage = ctrlObj.model.enableRTL ? (Math.floor((ctrlObj.element.find(".e-hScrollPanel").width() - (((isClientWithResponsive ? hScrollHandle.offset().left : hScrollHandle.position().left) + 16) - getMinHorizontalPos())) / (hDragRange / pGridObj._categPageCount)) == 0 ? 1 : Math.floor((ctrlObj.element.find(".e-hScrollPanel").width() - (((isClientWithResponsive ? hScrollHandle.offset().left : hScrollHandle.position().left) + 16) - getMinHorizontalPos())) / (hDragRange / pGridObj._categPageCount))) : (Math.floor((Math.round((isClientWithResponsive ? hScrollHandle.offset().left : hScrollHandle.position().left)) - getMinHorizontalPos()) / (hDragRange / pGridObj._categPageCount)) == 0 ? 1 : Math.floor((Math.round((isClientWithResponsive ? hScrollHandle.offset().left : hScrollHandle.position().left)) - getMinHorizontalPos()) / (hDragRange / pGridObj._categPageCount)));
                    currentPage = currentPage > pGridObj._categPageCount ? pGridObj._categPageCount : (currentPage < 1 ? 1 : currentPage);
                    if (movedDistance > 0 ? pGridObj._categCurrentPage > currentPage : pGridObj._categCurrentPage < currentPage)
                        currentPage = pGridObj._categCurrentPage;
                    ctrlObj.element.find(".e-categPageIndicator").css({ left: hScrollHandle.position().left });
                    ctrlObj.element.find(".categ_CurrentPage").html(currentPage);
                    if (currentPage != pGridObj._categCurrentPage) {
                        pGridObj._categCurrentPage = currentPage;
                        clearTimeout(_mouseWheel);
                        _mouseWheel = setTimeout(function () {
                            isPivotClient ? pGridObj._pivotClientObj.refreshPagedPivotClient("categ", pGridObj._categCurrentPage) :
                            pGridObj.refreshPagedPivotGrid("categ", pGridObj._categCurrentPage);
                        }, 250);
                    }
                });

                $(hScrollHandle).on('mousedown touchstart', function (e) {
                    $(this).addClass("dragging");
                    var initCursorPos = ctrlObj.model.enableRTL ? ctrlObj.element.find(".e-hScrollPanel").width() - (e.pageX - getMinHorizontalPos()) : e.pageX - getMinHorizontalPos();
                    var initThumbPos = ctrlObj.model.enableRTL ? ctrlObj.element.find(".e-hScrollPanel").width() - (((isClientWithResponsive ? hScrollHandle.offset().left : hScrollHandle.position().left) + 16) - getMinHorizontalPos()) : (isClientWithResponsive ? hScrollHandle.offset().left : hScrollHandle.position().left) - getMinHorizontalPos();
                    ctrlObj.element.find(".e-categPageIndicator").removeClass("inActive").css({ left: hScrollHandle.position().left, top: hScrollHandle.position().top + 20 });
                    var prevDistance = ctrlObj.model.enableRTL ? (ctrlObj.element.find(".e-hScrollPanel").width() - (e.pageX - getMinHorizontalPos())) - initCursorPos : (e.pageX - getMinHorizontalPos()) - initCursorPos;
                    var currentPage = pGridObj._categCurrentPage;
                    $(document).on('mousemove touchmove', function (e) {
                        if (window.navigator.userAgent.indexOf('Trident') > -1)
                            $(document).on("selectstart", function (e) { e.preventDefault(); });
                        else
                            window.getSelection().removeAllRanges();
                        var movedDistance = ctrlObj.model.enableRTL ? (ctrlObj.element.find(".e-hScrollPanel").width() - (e.pageX - getMinHorizontalPos())) - initCursorPos : (e.pageX - getMinHorizontalPos()) - initCursorPos;
                        if (movedDistance != 0) {
                            if (movedDistance > 0 && initThumbPos + movedDistance <= hDragRange)
                                ctrlObj.model.enableRTL ? hScrollHandle.css({ right: (initThumbPos + movedDistance) }) : hScrollHandle.offset({ left: initThumbPos + movedDistance + getMinHorizontalPos() });
                            else if (movedDistance < 0 && initThumbPos + movedDistance >= 0)
                                ctrlObj.model.enableRTL ? hScrollHandle.css({ right: (initThumbPos + movedDistance) }) : hScrollHandle.offset({ left: initThumbPos + movedDistance + getMinHorizontalPos() });
                            else if (initThumbPos + movedDistance > hDragRange)
                                ctrlObj.model.enableRTL ? hScrollHandle.css({ right: (hDragRange) }) : hScrollHandle.offset({ left: getMinHorizontalPos() + hDragRange });
                            else if (initThumbPos + movedDistance < 0)
                                ctrlObj.model.enableRTL ? hScrollHandle.css({ right: "0px" }) : hScrollHandle.offset({ left: getMinHorizontalPos() });
                            currentPage = ctrlObj.model.enableRTL ? (Math.floor((ctrlObj.element.find(".e-hScrollPanel").width() - (((isClientWithResponsive ? hScrollHandle.offset().left : hScrollHandle.position().left) + 16) - getMinHorizontalPos())) / (hDragRange / pGridObj._categPageCount)) == 0 ? 1 : Math.floor((ctrlObj.element.find(".e-hScrollPanel").width() - (((isClientWithResponsive ? hScrollHandle.offset().left : hScrollHandle.position().left) + 16) - getMinHorizontalPos())) / (hDragRange / pGridObj._categPageCount))) : (Math.floor((Math.round((isClientWithResponsive ? hScrollHandle.offset().left : hScrollHandle.position().left)) - getMinHorizontalPos()) / (hDragRange / pGridObj._categPageCount)) == 0 ? 1 : Math.floor((Math.round((isClientWithResponsive ? hScrollHandle.offset().left : hScrollHandle.position().left)) - getMinHorizontalPos()) / (hDragRange / pGridObj._categPageCount)));
                            currentPage = currentPage > pGridObj._categPageCount ? pGridObj._categPageCount : (currentPage < 1 ? 1 : currentPage);
                            if (prevDistance < movedDistance ? currentPage < pGridObj._categCurrentPage : currentPage > pGridObj._categCurrentPage)
                                currentPage = pGridObj._categCurrentPage;
                        }
                        ctrlObj.element.find(".e-categPageIndicator").css({ left: hScrollHandle.position().left });
                        ctrlObj.element.find(".categ_CurrentPage").html(currentPage);
                        ctrlObj.element.find(".e-hScrollThumb").attr("title", ctrlObj.element.find(".e-categPageIndicator").text());
                    });
                    $(document).on('mouseup touchend', function () {
                        $(document).off("selectstart");
                        $(this).off('mousemove touchmove').off('mouseup touchend');
                        $(hScrollHandle).removeClass("dragging");
                        if (currentPage != pGridObj._categCurrentPage) {
                            pGridObj._categCurrentPage = currentPage;
                            isPivotClient ? pGridObj._pivotClientObj.refreshPagedPivotClient("categ", pGridObj._categCurrentPage) :
                            pGridObj.refreshPagedPivotGrid("categ", pGridObj._categCurrentPage);
                        }
                        else
                            ctrlObj.element.find(".e-categPageIndicator").addClass("inActive");
                    });
                });
            }
            if (isPivotClient) {                
                if (pGridObj._categPageCount <= 1) {
                    var diff = this._pivotClientObj.element.find(".e-outerTable").height() - 58;                    
                    this._pivotClientObj.element.find(".e-gridContainer").height(diff);
                    this._pivotClientObj.element.find(".e-chartContainer").height(diff);
                }
                if (pGridObj._seriesPageCount <= 1) {
                    var diff = this._pivotClientObj.element.find("ul.clientTab").width() - 2;
                    this._pivotClientObj.element.find(".e-gridContainer").width(diff);
                    this._pivotClientObj.element.find(".e-chartContainer").width(diff);
                }
                if (this._pivotClientObj.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                    if (this._pivotClientObj.element.find(".e-hScrollThumb").length > 0) {
                        this._pivotClientObj.element.find(".e-gridContainer,.e-chartContainer").height(this._pivotClientObj.element.find(".e-controlPanel").height() - (this._pivotClientObj.element.find("ul.clientTab").height() + 23));
                    }
                    else
                        this._pivotClientObj.element.find(".e-gridContainer,.e-chartContainer").height(this._pivotClientObj.element.find(".e-controlPanel").height() - (this._pivotClientObj.element.find("ul.clientTab").height())-2);
                    this._pivotClientObj.element.find(".e-vScrollPanel").css("margin-left", "7px");
                }
            }
            $('body').off('mousewheel DOMMouseScroll');
        },

        _getLocalizedLabels: function (property) {
            return (ej.isNullOrUndefined( ej.PivotGrid.Locale[this.locale()]) || ej.PivotGrid.Locale[this.locale()][property] == undefined) ? ej.PivotGrid.Locale["en-US"][property] : ej.PivotGrid.Locale[this.locale()][property];
        },

        _drillDown: function (e) {
            this._drillCaption = $(e.target).parent().find(".cellValue").text();
            var targetClass = e.target.className;
            this._startDrilldown = true;
            var gridObj = this;
            var pivotClientObj = ($(this.element).parents(".e-pivotclient").length > 0) ? $(this.element).parents(".e-pivotclient").data("ejPivotClient") : null;
            targetClass = targetClass.split(" ");
            if ($(e.target).hasClass("e-expand"))
                this._drillAction = "drilldown";
            else if ($(e.target).hasClass("e-collapse"))
                this._drillAction = "drillup";
            var axis = $($(e.target).parent()).hasClass("rowheader") || $($(e.target).parent()).attr("role") == "rowheader" ? "rowheader" : "colheader";
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode== ej.Pivot.OperationalMode.ClientMode) {
                //this._waitingPopup = this.element.data("ejWaitingPopup");
                if (!ej.isNullOrUndefined(pivotClientObj)) {
                    pivotClientObj._isTimeOut = true;
                    setTimeout(function () {
                        if (pivotClientObj._isTimeOut)
                            gridObj._waitingPopup.show();
                    }, 800);
                }
                else
                    this._waitingPopup.show();
                var cPos = $(e.target).parent().attr("data-p");
                var memberInfo = this.getJSONRecords()[parseInt((parseInt(cPos.split(",")[0]) * this._rowCount) + parseInt(cPos.split(",")[1]))].Info, drilledMember;

                var uniqName = memberInfo.replace(/&/g, "&amp;");
                // drilledMember = this._getDrilledMemeber(uniqName, axis);                
                
                var colPos = parseInt(cPos.split(',')[0]), rowPos = parseInt(cPos.split(',')[1]);
                while (colPos > 0) {
                    colPos--;
                    var tempCellInfo = this.getJSONRecords()[(colPos * this._rowCount) + rowPos].Info, rPos = rowPos;
                    while (tempCellInfo == "" && rPos > 0) {
                        rPos--;
                        tempCellInfo = this.getJSONRecords()[(colPos * this._rowCount) + rPos].Info;
                    }
                    memberInfo = tempCellInfo + ">#>" + memberInfo;
                }

                var currentObj = this.element.parents(".e-pivotclient").length > 0 ? this.element.parents(".e-pivotclient").data("ejPivotClient") : ej.isNullOrUndefined(this._pivotClientObj) ? this : this._pivotClientObj;
                if (currentObj.pluginName == "ejPivotClient" && axis == "rowheader" && currentObj.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                    currentObj._drillInfo = memberInfo;
                    currentObj.setChartDrillParams(memberInfo, this._drillAction);
                }
                currentObj["_pivotRecords"] = { records: this.getJSONRecords(), rowCount: this._rowCount };
                if ($(e.target).hasClass("e-collapse")) {
                    this.updateDrilledReport({ uniqueName: uniqName, index: cPos, action: "collapse" }, axis, currentObj);
                }
                else {
                    this.updateDrilledReport({ uniqueName: uniqName, index: cPos }, axis, currentObj);
                }
                return false;
            }
            this.element.find(".e-dialog").remove();
            if (!this.model.enableDeferUpdate) {
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                    this._off(this.element, "click", ".e-expand, .e-collapse");
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                    this.element.find(".colheader, .rowheader, .value").removeClass("e-droppable");
                var targetClass = e.target.className;
                var targetEle = $(e.target).parent();
                this._startDrilldown = true;
                targetClass = targetClass.split(" ");
                if (targetClass[0] == "e-expand")
                    this._drillAction = "drilldown";
                else if (targetClass[0] == "e-collapse")
                    this._drillAction = "drillup";

                if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                    this._trigger("beforeServiceInvoke", { action: "drillDown", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                var cellPos = $(e.target).parent().attr("data-p");
                this._drillCaption = $(e.target).parent().find(".cellValue").text();

                if (!ej.isNullOrUndefined(gridObj._pivotClientObj) && !ej.isNullOrUndefined(gridObj._pivotClientObj._waitingPopup)) {
                    gridObj._pivotClientObj._isTimeOut = true;
                    setTimeout(function () {
                        if (gridObj._pivotClientObj._isTimeOut) {
                            if ($("#" + gridObj._pivotClientObj._id + "_maxView")[0]) {
                                $("#" + gridObj._pivotClientObj._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                                gridObj._maxViewLoading = $("#" + gridObj._pivotClientObj._id + "_maxView").data("ejWaitingPopup");
                            }
                            else
                                gridObj._pivotClientObj._waitingPopup.show();
                        }
                    }, 800);
                }
                else {
                    if (!ej.isNullOrUndefined(pivotClientObj)) {
                        pivotClientObj._isTimeOut = true;
                        setTimeout(function () {
                            if (pivotClientObj._isTimeOut)
                                gridObj._waitingPopup.show();
                        }, 800);
                    }
                    else
                        this._waitingPopup.show();
                }
                var headerInfo = this.model.analysisMode == "relational" ? this._drillHeaders.join("||") : this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + parseInt(cellPos.split(",")[1]))].Info;
                var report;
                try {
                    report = ($(this.element).parents(".e-pivotclient").length > 0 && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) ? (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? JSON.parse(this._pivotClientObj.getOlapReport()).Report : this._pivotClientObj.currentReport) : JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = ($(this.element).parents(".e-pivotclient").length > 0 && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) ? (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? this._pivotClientObj.getOlapReport() : this._pivotClientObj.currentReport) : this.getOlapReport();
                }

                if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode || this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    var sortEle = null;
                    if (!(ej.isNullOrUndefined(this.model.valueSortSettings)) && this.element.find(".valueSorting").length > 0 && !(ej.isNullOrUndefined(ej.PivotAnalysis._valueSorting))) {
                        sortEle = this.element.find(".valueSorting").parent();
                    }
                    var pGridTb = (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && (this.model.enableAdvancedFilter || ($(this.element).parents(".e-pivotclient").length > 0 && this._pivotClientObj.model.enableAdvancedFilter))) ? $(this.element).find(".e-pivotGridTable").detach() : this._table;
                    var field = this._getFieldName($(e.target).parent()[0]);
                    var drilledCellType = $($(e.target).parent()).hasClass("rowheader") || $($(e.target).parent()).attr("role") == "rowheader" ? "rowheader" : $($(e.target).parent()).hasClass("colheader") || $($(e.target).parent()).attr("role") == "columnheader" ? "columnheader" : "";
                    if (!this.model.enablePaging && !this.model.enableVirtualScrolling) {
                        if ($(e.target).hasClass("e-collapse")) {
                            if (ej.isNullOrUndefined(this.model.collapsedMembers)) this.model.collapsedMembers = {};
                            ej.isNullOrUndefined(this.model.collapsedMembers[field]) ? this.model.collapsedMembers[field] = [$($(e.target).parent()[0]).text().trim()] : this.model.collapsedMembers[field].push($($(e.target).parent()[0]).text().trim());
                        }
                        else if ($(e.target).hasClass("e-expand"))
                            this.model.collapsedMembers[field] = $.grep(this.model.collapsedMembers[field], function (item) { return item != $($(e.target).parent()[0]).text().trim() });
                        if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && (this.model.enableAdvancedFilter || ($(this.element).parents(".e-pivotclient").length > 0 && this._pivotClientObj.model.enableAdvancedFilter))) {
                            this._collapseMember(pGridTb, e.target);
                            if ($(this.element).parents(".e-pivotclient").length > 0 && this._pivotClientObj.model.enableToolBar && !this._pivotClientObj.model.displaySettings.enableFullScreen)
                                this.element.find("#" + this._id + "Toolbar").append(pGridTb);
                            else
                                this.element.append(pGridTb);
                        }
                        else {
                            this._collapseMember(pGridTb, pGridTb.find("[data-p='" + cellPos + "']").children('span')[0]);
                            this._cropHtml(pGridTb);
                            if (this.model.enableColumnResizing && this.model.resizeColumnsToFit && !this.model.isResponsive)
                                this.element.find(".e-pivotGridTable").removeAttr("style");
                            this._mergeHtml(drilledCellType, cellPos, pGridTb, this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders ? $(this.element).find(".e-pivotGridTable") : $(this.element).find("table"));
                            if ((!this.model.resizeColumnsToFit && this.model.enableColumnResizing) || (!this.model.enableColumnResizing && !this.model.resizeColumnsToFit))
                              this.element.find(".e-pivotGridTable").css("width","100%");
                        }
                        if (this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders)
                            this._applyFrozenHeaderWidth(this._JSONRecords, this._drillAction, targetEle);
                        else if ((this.model.enableColumnResizing && this.model.resizeColumnsToFit) || (this.model.enableColumnResizing && !this.model.resizeColumnsToFit))
                            this._resizeColumnsWidth();
                                                
                        this._hideGrandTotal(pGridTb);
                        if (this.model.enableGroupingBar) {
                            var tableWidth = $("#" + this._id).find(".e-pivotGridTable").width();
                            this.element.find(".groupingBarPivot .e-drag").width(tableWidth - 5);
                            var cellWidth = $("#" + this._id).find(".e-pivotGridTable").find("th").width();
                            this.element.find(".groupingBarPivot .values").width(cellWidth - 2);
                            this.element.find(".groupingBarPivot .columns").width(tableWidth - cellWidth);
                            this.element.find(".groupingBarPivot .valueColumn").width(tableWidth);
                        }
                        this.element.find(".colheader, .rowheader, .value").addClass("e-droppable");
                        if (!ej.isNullOrUndefined(pivotClientObj)) pivotClientObj._isTimeOut = false;
                        else if (!ej.isNullOrUndefined(gridObj._pivotClientObj)) gridObj._pivotClientObj._isTimeOut = false;
                        this._waitingPopup.hide();
                    }                                        
                    var eventArgs = e;
                    var colPos = parseInt(cellPos.split(',')[0]), rowPos = parseInt(cellPos.split(',')[1]);
                    if (this._drillCaption == "")
                        this._drillCaption = $.trim($(e.target).parent(':not(span)').text().replace("expanded", "").replace("collapsed", ""));
                    var memberInfo = this._drillCaption;
                    memberInfo = $.trim(this._getMemberInfo(memberInfo, rowPos, colPos, drilledCellType));
                    var isClientMode = this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? true : false;
                    if (drilledCellType == "rowheader") {
                        if (this.model.enablePaging || this.model.enableVirtualScrolling) {
                            if (this._drillAction == "drillup")
                                this.model.enableCollapseByDefault ? (this._drillHeaders.row = this._drillHeaders.row.filter(function (itm, idx) { if (itm != (isClientMode ? memberInfo : memberInfo.split(">#>").join("."))) return itm; })) : this._drillHeaders.row.push(isClientMode ? memberInfo : (memberInfo.split(">#>").join(".")));
                            else
                                this.model.enableCollapseByDefault ? this._drillHeaders.row.push(isClientMode ? memberInfo : memberInfo.split(">#>").join(".")) : (this._drillHeaders.row = this._drillHeaders.row.filter(function (itm, idx) { if (itm != (isClientMode ? memberInfo : memberInfo.split(">#>").join("."))) return itm; }));
                        }
                    }
                    else if (this.model.enablePaging || this.model.enableVirtualScrolling) {
                        if (memberInfo.startsWith(">#>"))
                            memberInfo = memberInfo.substring(3, memberInfo.length);
                        if (this._drillAction == "drillup")
                            this.model.enableCollapseByDefault ? (this._drillHeaders.column = this._drillHeaders.column.filter(function (itm, idx) { if (itm != (isClientMode ? memberInfo : memberInfo.split(">#>").join("."))) return itm; })) : this._drillHeaders.column.push(isClientMode ? memberInfo : memberInfo.split(">#>").join("."));
                        else
                            this.model.enableCollapseByDefault ? this._drillHeaders.column.push(isClientMode ? memberInfo : memberInfo.split(">#>").join(".")) : (this._drillHeaders.column = this._drillHeaders.column.filter(function (itm, idx) { if (itm != (isClientMode ? memberInfo : memberInfo.split(">#>").join("."))) return itm; }));
                        memberInfo = "";
                    }
                    if (this.model.enableVirtualScrolling || this.model.enablePaging) {
                        if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                            var report;
                            try {
                                report = JSON.parse(this.getOlapReport()).Report;
                            }
                            catch (err) {
                                report = this.getOlapReport();
                            }
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillDownGrid", "drillHeaders": JSON.stringify(this._drillHeaders), "currentReport": report, "valueSorting": JSON.stringify(this.model.valueSortSettings), "customObject": JSON.stringify(this.model.customObject) }), this._renderControlSuccess);
                        }
                        else 
                            this._refPaging();                        
                    }
                    if (this.model.valueSortSettings)
                        this._refreshValueSortIcons(sortEle);
                    if (!ej.isNullOrUndefined(this._pivotClientObj))
                        this._pivotClientObj._trigger("gridDrillSuccess", { gridObj: this, drillAction: this._drillAction, drilledMember: memberInfo, fieldName: field, axis: axis, cellPosition: cellPos });
                    this._trigger("drillSuccess", { gridObj: this, drillAction: this._drillAction, drilledMember: memberInfo, fieldName: field, axis: axis, cellPosition: cellPos });
                    if (this.model.enableGroupingBar)
                        this._createFields("drilldown", $("#" + this._id).find(".e-pivotGridTable").width(), $("#" + this._id).find(".e-pivotGridTable th").outerWidth());
                    this._unWireEvents();
                    this._wireEvents();
                    this._drillAction = "";
                }
                else {
                    if (this.layout() != "" || this.layout() != "normal") {
                        if (!ej.isNullOrUndefined(this._pivotClientObj))
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillDownGrid", "cellPosition": cellPos, "currentReport": report, "clientReports": this._pivotClientObj.reports, "headerInfo": headerInfo, "layout": this.layout(), "customObject": serializedCustomObject }), this._drillDownSuccess);
                        else
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillDownGrid", "cellPosition": cellPos, "currentReport": report, "headerInfo": headerInfo, "layout": this.layout(), "customObject": serializedCustomObject }), this._drillDownSuccess);
                    }
                    else {
                        if (!ej.isNullOrUndefined(this._pivotClientObj))
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillDownGrid", "cellPosition": cellPos, "currentReport": report, "clientReports": this._pivotClientObj.reports, "headerInfo": headerInfo, "customObject": serializedCustomObject }), this._drillDownSuccess);
                        else
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillDownGrid", "cellPosition": cellPos, "currentReport": report, "headerInfo": headerInfo, "customObject": serializedCustomObject }), this._drillDownSuccess);
                    }
                }
            }
        },

        _getMemberInfo: function (memberInfo, rowPos, colPos, drilledCellType) {
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && (this.model.paging || this.model.enableVirtualScrolling)) 
                memberInfo = this.getJSONRecords()[this._rowCount * colPos + rowPos].Info;
            else {
                while (drilledCellType == "rowheader" ? colPos > 0 : rowPos > 0) {
                    drilledCellType == "rowheader" ? colPos-- : rowPos--;
                    var tempCellInfo = this.getJSONRecords()[this._rowCount * colPos + rowPos].Value, rPos = rowPos;
                    while (tempCellInfo == "" && (drilledCellType == "rowheader" ? rPos > 0 : colPos > 0)) {
                        drilledCellType == "rowheader" ? rPos-- : colPos--;
                        tempCellInfo = this.getJSONRecords()[this._rowCount * colPos + rPos].Value;
                    }
                    memberInfo = tempCellInfo + ">#>" + memberInfo;
                }
            }
            return memberInfo;
        },

        _collapseMember: function (pGridTb, targetCell) {
            if (!this.model.enablePaging && !this.model.enableVirtualScrolling) {
                var clickedTh = $(targetCell).parent()[0];
                var positionTh = $(clickedTh).attr("data-p");
                var rowSpan = $(targetCell).attr("data-tag") != undefined ? (parseInt($(targetCell).attr("data-tag")) + clickedTh.rowSpan) : clickedTh.rowSpan;
                var colsSpan = (this.model.enableAdvancedFilter && !ej.isNullOrUndefined($(clickedTh).attr("vfcolspan"))) ? (parseInt($(clickedTh).attr("vfcolspan"))) : $(targetCell).attr("data-tag") != undefined ? (parseInt($(targetCell).attr("data-tag")) + clickedTh.colSpan) : clickedTh.colSpan;
                var row = $(targetCell).closest("tr")[0];
                var nextRow = null, prevRow = null, isTdFRow = "false", hiddenRCnt = 0;

                if (clickedTh.className.indexOf("rowheader") >= 0 || (clickedTh.className.indexOf("summary") >= 0 && $(clickedTh).attr("role") == "rowheader")) {
                    if (this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout) {
                        var indexRow = this.getJSONRecords()[1].Index == "0,0" ? 1 : 0;
                        var rowSpan = this.getJSONRecords()[(parseInt(positionTh.split(',')[0]) * this._rowCount + (parseInt(positionTh.split(',')[1]))) + indexRow].RowSpan;
                        var drillCell = row;
                        if ($(targetCell).attr("class").indexOf("e-expand") > -1)
                            $(row).removeAttr("data-tag");
                        for (var rCount = 0; rCount < rowSpan; rCount++) {
                            if ($(targetCell).attr("class") && $(targetCell).attr("class").indexOf("e-collapse") > -1) {
                                if ($($(row).next()).attr("data-tag") == undefined)
                                    $($(row).next()).attr("data-tag", positionTh);
                                $($(row).next()).css("display", "none");
                                if (this.model.frozenHeaderSettings.enableFrozenRowHeaders || this.model.frozenHeaderSettings.enableFrozenHeaders)
                                    $(pGridTb).find(".pivotGridValueTable  td[data-i$='," + $($(row).next()).find("td").attr('data-i').split(',')[1] + "']").css("display", "none");
                            }
                            if ($(targetCell).attr("class").indexOf("e-expand") > -1) {
                                if ($($(row).next()).attr("data-tag") == undefined || $($(row).next()).attr("data-tag") == positionTh) {
                                    $($(row).next()).css("display", "table-row");
                                    $($(row).next()).removeAttr("data-tag");
                                    if (this.model.frozenHeaderSettings.enableFrozenRowHeaders || this.model.frozenHeaderSettings.enableFrozenHeaders)
                                        $(row).parents().find(".pivotGridValueTable td[data-i$='," + $($(row).next()).find("td").attr('data-i').split(',')[1] + "']").css("display", "");
                                }
                            }
                            row = $(row).next();
                        }
                        var tableTag = (this.model.frozenHeaderSettings.enableFrozenRowHeaders || this.model.frozenHeaderSettings.enableFrozenHeaders) ? "td" : "th";
                        var marginPosition = this.model.enableRTL ? "margin-right" : "margin-left";
                        var level = $(drillCell).find(tableTag + " span:not(.cellValue)").css(marginPosition);
                        $(drillCell).find(tableTag + " span:not(.cellValue)").remove();
                        $(drillCell).find(tableTag).prepend($(targetCell).attr("class").indexOf("e-collapse") > -1 ? "<span style=\"" + marginPosition + ":" + level + "\" class=\"e-expand\ e-icon\" aria-label='collapsed' title=\"" + this._getLocalizedLabels("Expand") + "\">&nbsp;</span>" : "<span style=\"" + marginPosition + ":" + level + "\" class=\"e-collapse\ e-icon\" aria-label='expanded' title=\"" + this._getLocalizedLabels("Collapse") + "\">&nbsp;</span>");//<p id='collapsing' style='display:none'>expanded</p>
                        return;
                    }
                    var isTdSameRow = !$(clickedTh).index() > 0;
                    var isLeafHide, isTdSubSameRow;
                    var isHide = isLeafHide = false;
                    var subNode = true;
                    if ($(targetCell).attr("class") && $(targetCell).attr("class").indexOf("collapse") > -1) {
                        for (var rCount = 0; rCount < rowSpan; rCount++) {
                            nextRow = $(row).next();
                            if (isTdSameRow) {
                                if ($(row).find(".stot,.rstot").length >= 1)
                                    if (rCount == 1 && $($(row).find(".stot,.rstot")).find(".e-expand").length >= 1)
                                        isLeafHide = true;
                                if ($($(row).find(".stot,.rstot")).find(".e-expand").length >= 1 || $(row).css('display') == 'none')
                                    isHide = true;
                                $(row).css("display", "none");
                                $(row).attr("data-tag", $(row).attr("data-tag") != undefined ? parseInt($(row).attr("data-tag")) + 1 : 1);
                                if (this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders || this.model.frozenHeaderSettings.enableFrozenHeaders) {
                                    $(pGridTb).find(".pivotGridValueTable tr:eq(" + $(row).index() + ")").css("display", "none");
                                    $(pGridTb).find(".pivotGridValueTable tr:eq(" + $(row).index() + ")").attr("data-tag", $(row).attr("data-tag") != undefined ? parseInt($(row).attr("data-tag")) + 1 : 1);
                                }

                            }
                            else {
                                var nextTd = clickedTh;
                                if (this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders || this.model.frozenHeaderSettings.enableFrozenHeaders) {
                                    for (tdCnt = $(clickedTh).prevAll().length; tdCnt < $(pGridTb).find("[data-p$='," + $(clickedTh).attr("data-p").split(",")[1] + "'] ").length ; tdCnt++) {  //  $(clickedTh).nextAll().length
                                        $(nextTd).css("display", "none").attr("data-hc", $(nextTd).attr("data-hc") == undefined ? 1 : parseInt($(nextTd).attr("data-hc")) + 1);
                                        nextTd = $($(pGridTb).find("[data-p$='," + $(nextTd).attr("data-p").split(",")[1] + "'] ")[tdCnt + 1]);
                                    }
                                }
                                else {
                                    for (tdCnt = 0; tdCnt <= $(clickedTh).nextAll().length ; tdCnt++) {
                                        $(nextTd).css("display", "none").attr("data-hc", $(nextTd).attr("data-hc") == undefined ? 1 : parseInt($(nextTd).attr("data-hc")) + 1);
                                        nextTd = $(nextTd).next();
                                    }
                                }
                                isTdSubSameRow = false;
                                isTdFRow = "true";
                            }
                            row = nextRow;
                            isTdSameRow = true;
                        }
                        var subractRSpan = isTdFRow == "true" ? (clickedTh.rowSpan - 1) : clickedTh.rowSpan;
                        var rowSubSpan;
                        if ($(row).css('display') != 'none' && isLeafHide)
                            rowSubSpan = $(targetCell).attr("subTag") != undefined ? parseInt($(targetCell).attr("subTag")) == -1 ? clickedTh.rowSpan + 1 : (parseInt($(targetCell).attr("subTag")) + clickedTh.rowSpan) : clickedTh.rowSpan;
                        if ($(row).css('display') == 'none') {
                            $(row).css("display", "");
                            if (this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders)
                                $(pGridTb).find("td.value[data-p$=\"," + parseInt($(row).children().eq(0).attr("data-p").split(',')[1]) + "\"]").parent().css("display", "");
                            isHide = true;
                            subractRSpan = subractRSpan - 1;
                        }
                        if (isHide && ej.isNullOrUndefined(rowSubSpan))
                            rowSubSpan = $(targetCell).attr("subTag") != undefined ? parseInt($(targetCell).attr("subTag")) == -1 ? clickedTh.rowSpan : (parseInt($(targetCell).attr("subTag")) + clickedTh.rowSpan) : clickedTh.rowSpan;
                        if ((this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders) && $(pGridTb).find(".pivotGridValueTable").length > 0) {
                            $(row).find("td").text($(row).find("td").text().replace(" Total", ""));
                            $(row).find("td span:not(.cellValue)").remove();
                            $(row).find("td").prepend("<span class=\"e-expand\ e-icon\" title=\"" + this._getLocalizedLabels("Expand") + "\" data-tag=\"" + rowSpan + ":" + isTdFRow + "\">&nbsp;</span>");
                        }
                        else {
                            $(row).find("th").text($(row).find("th").text().replace(" Total", ""));
                            $(row).find("th span:not(.cellValue)").remove();
                            $(row).find("th").prepend("<span class=\"e-expand\ e-icon\" title=\"" + this._getLocalizedLabels("Expand") + "\" data-tag=\"" + rowSpan + ":" + isTdFRow + ((!ej.isNullOrUndefined(rowSubSpan)) ? ($(targetCell).attr("isChildSubNode") == "true") ? "\" subTag=\"" + rowSubSpan + ":" + isTdFRow + "\" isChildSubNode=\"" + subNode : "\" subTag=\"" + rowSubSpan + ":" + isTdFRow : "") + "\">&nbsp;</span>");
                        }
                        var prevThRowSpan = $(row).prevAll().find("th:has(span):not(.summary), td:has(span):not(.summary)");
                        for (var rCount = 0; rCount < prevThRowSpan.length; rCount++) {
                            if (parseInt($(prevThRowSpan[rCount]).attr("data-p").split(",")[0]) < parseInt(positionTh.split(",")[0]) && (parseInt($(prevThRowSpan[rCount]).attr("data-p").split(",")[1]) + prevThRowSpan[rCount].rowSpan + ($(prevThRowSpan[rCount]).find("span").attr("data-tag") != undefined ? parseInt($(prevThRowSpan[rCount]).find("span").attr("data-tag")) : 0)) >= (parseInt(positionTh.split(",")[1]) + rowSpan)) {
                                prevThRowSpan[rCount].rowSpan -= subractRSpan;
                                if ($(prevThRowSpan[rCount]).find("span").attr("data-tag") == undefined)
                                    $(prevThRowSpan[rCount]).find("span").attr("isChildSubNode", true);
                                $(prevThRowSpan[rCount]).find("span").attr("data-tag", $(prevThRowSpan[rCount]).find("span").attr("data-tag") != undefined ? (parseInt($(prevThRowSpan[rCount]).find("span").attr("data-tag")) + (subractRSpan)) : subractRSpan);
                                $(prevThRowSpan[rCount]).find("span").attr("subTag", $(prevThRowSpan[rCount]).find("span").attr("subTag") != undefined ? (parseInt($(prevThRowSpan[rCount]).find("span").attr("subTag")) + (subractRSpan)) : subractRSpan);
                            }
                        }
                    }
                    else if ($(targetCell).attr("class") && $(targetCell).attr("class").indexOf("e-expand") > -1) {
                        var isFrozenEnabled = this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders;
                        var removeSubSpan;
                        var removeSpan = removeSubSpan = this._isSubTotalhidden = false;
                        var loop = 0;
                        for (var rCount = parseInt($(targetCell).attr("data-tag").split(":")[0]) ; rCount >= 0 ; rCount--) {
                            prevRow = $(row).prev();
                            if ($(row).attr("data-tag") == undefined || parseInt($(row).attr("data-tag")) <= 1) {
                                this._hideSubTotal($(row), loop, $(targetCell))
                                if (this._isSubTotalHide) {
                                    removeSpan = true;
                                    this._isSubTotalHide = false;
                                    $(row).css("display", "none");
                                    if (isFrozenEnabled)
                                        $(pGridTb).find(".pivotGridValueTable tr:eq(" + $(row).index() + ")").css("display", "none");
                                }
                                else {
                                    $(row).css("display", "table-row");
                                    if (this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders || this.model.frozenHeaderSettings.enableFrozenHeaders) {
                                        if ($(row).find("td[data-hc]").length == 0)
                                            $(pGridTb).find(".pivotGridValueTable tr:eq(" + $(row).index() + ")").css("display", "table-row");
                                    }
                                }
                            }
                            else
                                hiddenRCnt++;
                            loop = loop == 0 ? 1 : loop;
                            if ($(row).attr("data-tag") != undefined) {
                                if ((parseInt($(row).attr("data-tag") - 1)) == 0)
                                    $(row).removeAttr("data-tag");
                                else
                                    $(row).attr("data-tag", parseInt($(row).attr("data-tag")) - 1);
                            }
                            row = prevRow;
                        }
                        if ($(targetCell).attr("data-tag").split(":")[1] == "true") {
                            var nextTd = $(pGridTb).find((isFrozenEnabled ? ".pivotGridRowTable " : "th") + "[data-p='" + parseInt($(clickedTh).attr("data-p").split(",")[0]) + "," + (parseInt($(clickedTh).attr("data-p").split(",")[1]) - parseInt($(targetCell).attr("data-tag").split(":")[0])) + "'], td[data-p='" + parseInt($(clickedTh).attr("data-p").split(",")[0]) + "," + (parseInt($(clickedTh).attr("data-p").split(",")[1]) - parseInt($(targetCell).attr("data-tag").split(":")[0])) + "']"), ttCnt = $(nextTd).nextAll().length;
                            if (isFrozenEnabled)
                                ttCnt = $.merge($(nextTd).nextAll(), $(pGridTb).find(".pivotGridValueTable tr:eq(" + $(nextTd).parent().index() + ") td")).length;
                            for (tdCnt = 0; tdCnt <= ttCnt; tdCnt++) {
                                if ($(nextTd).attr("data-hc") == undefined || parseInt($(nextTd).attr("data-hc")) <= 1) {
                                    $(nextTd).removeAttr("data-hc");
                                    if ($(nextTd).attr("data-hc") == undefined)
                                        $(nextTd).css("display", "");
                                }
                                else
                                    $(nextTd).attr("data-hc", (parseInt($(nextTd).attr("data-hc")) - 1));
                                if (isFrozenEnabled)
                                    nextTd = $.merge($(nextTd).nextAll(), $(pGridTb).find(".pivotGridValueTable tr:eq(" + $(nextTd).parent().index() + ") td"))[0];
                                else
                                    nextTd = $(nextTd).next();
                            }
                            if (isFrozenEnabled) {
                                var row = $(targetCell).closest("tr")[0];
                                for (var rCount = parseInt($(targetCell).attr("data-tag").split(":")[0]) ; rCount >= 0 ; rCount--) {
                                    if ($(row).find("td[data-hc]").length == 0)
                                        $(pGridTb).find(".pivotGridValueTable tr:eq(" + $(row).index() + ")").css("display", "table-row");
                                    row = $(row).prev();
                                }
                            }
                        }
                        var prevThRowSpan = $($(targetCell).closest("tr")[0]).prevAll().find("th:has(span):not(.summary), td:has(span):not(.summary)");
                        var rSpnCnt, pTarget;
                        if ($(targetCell).attr("subTag") != undefined && removeSpan)
                            rSpnCnt = ($(targetCell).attr("subTag").split(":")[1] == "true" ? (parseInt($(targetCell).attr("subTag").split(":")[0]) - 1) : parseInt($(targetCell).attr("subTag").split(":")[0]));
                        else
                            rSpnCnt = ($(targetCell).attr("data-tag").split(":")[1] == "true" ? (parseInt($(targetCell).attr("data-tag").split(":")[0]) - 1) : parseInt($(targetCell).attr("data-tag").split(":")[0])) - hiddenRCnt;
                        pTarget = $(pGridTb).find("th[data-p='" + parseInt($(clickedTh).attr("data-p").split(",")[0]) + "," + (parseInt($(clickedTh).attr("data-p").split(",")[1]) - parseInt($(targetCell).attr("data-tag").split(":")[0])) + "'], td[data-p='" + parseInt($(clickedTh).attr("data-p").split(",")[0]) + "," + (parseInt($(clickedTh).attr("data-p").split(",")[1]) - parseInt($(targetCell).attr("data-tag").split(":")[0])) + "']");

                        if (removeSpan) {
                            rSpnCnt = parseInt($(pTarget).attr("rowspan"));
                            if ($(targetCell).attr("subTag") != undefined) {
                                rSpnCnt = ($(targetCell).attr("subTag").split(':')[1] == "true" ? (rSpnCnt - 1) : rSpnCnt);
                            }
                            else
                                rSpnCnt = ($(targetCell).attr("data-tag").split(':')[1] == "true" ? (rSpnCnt - 1) : rSpnCnt);
                            rSpnCnt = $(targetCell).attr("subTag") != undefined ? parseInt($(targetCell).attr("subTag").split(":")[0]) == -1 ? rSpnCnt : (!this._isSubTotalhidden) ? rSpnCnt : rSpnCnt - 1 : rSpnCnt - 1;
                        }
                        for (var rCount = 0; rCount < prevThRowSpan.length; rCount++) {
                            if (parseInt($(prevThRowSpan[rCount]).attr("data-p").split(",")[0]) < parseInt(positionTh.split(",")[0]) && (parseInt($(prevThRowSpan[rCount]).attr("data-p").split(",")[1]) + prevThRowSpan[rCount].rowSpan + ($(prevThRowSpan[rCount]).find("span").attr("data-tag") != undefined ? parseInt($(prevThRowSpan[rCount]).find("span").attr("data-tag")) : 0)) >= (parseInt(positionTh.split(",")[1]))) {
                                if (removeSpan) {
                                    this._isSubTotalhidden = removeSpan = false;
                                    //rSpnCnt = $($(prevThRowSpan[rCount]).find("span")[0]).attr("subTag") != undefined ? parseInt($($(prevThRowSpan[rCount]).find("span")[0]).attr("subTag").split(":")[0]) <= rSpnCnt ? rSpnCnt : rSpnCnt + 1 : rSpnCnt;
                                    if ($(targetCell).attr("isChildSubNode") == "true") {
                                        //rSpnCnt = rSpnCnt - hiddenRCnt;
                                        $(targetCell).removeAttr("isChildSubNode");
                                    }
                                }
                                prevThRowSpan[rCount].rowSpan += rSpnCnt;
                                if ($(prevThRowSpan[rCount]).find("span").attr("data-tag") != undefined)
                                    $(prevThRowSpan[rCount]).find("span").attr("data-tag", (parseInt($(prevThRowSpan[rCount]).find("span").attr("data-tag")) - rSpnCnt));
                                if (parseInt($(prevThRowSpan[rCount]).find("span").attr("data-tag")) == 0)
                                    $(prevThRowSpan[rCount]).find("span").removeAttr("data-tag");
                                if ($(prevThRowSpan[rCount]).find("span").attr("subTag") != undefined)
                                    $(prevThRowSpan[rCount]).find("span").attr("subTag", (parseInt($(prevThRowSpan[rCount]).find("span").attr("subTag")) - rSpnCnt));
                                if (parseInt($(prevThRowSpan[rCount]).find("span").attr("subTag")) == 0)
                                    $(prevThRowSpan[rCount]).find("span").removeAttr("subTag");
                            }
                        }
                        if ($(clickedTh).find(".cellValue").length > 0)
                            $(clickedTh).find(".cellValue").text($.trim($(clickedTh).find(".cellValue").text()) + " Total");
                        else
                            $(clickedTh).text($.trim($(clickedTh).text()) + " Total");
                        $(clickedTh).find(".e-expand").remove();
                        $(clickedTh).prepend("<span style='margin-left:10px'></span>");
                    }
                }
                if (clickedTh.className.indexOf("colheader") >= 0 || (clickedTh.className.indexOf("summary") >= 0 && $(clickedTh).attr("role") == "columnheader")) {
                    var tdPosVal = parseInt(positionTh.split(",")[0]), tbRows = $(pGridTb).find("tr");
                    if ($(targetCell).attr("class") && $(targetCell).attr("class").indexOf("e-collapse") > -1) {
                        var span = clickedTh.colSpan;
                        if ($(clickedTh).next().css('display') == 'none') {
                            var positionSubTh = $(clickedTh).next().attr("data-p"), tdSubPosVal = parseInt(positionSubTh.split(",")[0]), tbSubRows = $(pGridTb).find("tr"), colsSpanSub = parseInt($(clickedTh).next().attr("colspan"));
                            if ($(clickedTh).next().attr("class").indexOf("stot", "cstot") > -1) {
                                for (var cCount = 0; cCount < colsSpanSub; cCount++) {
                                    var thList = $(row).nextAll().find("th[data-p^='" + (cCount + tdSubPosVal) + ",']");
                                    for (var thCnt = 0; thCnt < $(thList).length; thCnt++) {
                                        $(thList[thCnt]).css("display", "");;
                                    }
                                    if ($(thList[thCnt]).attr("data-hc") == undefined || parseInt($(thList[thCnt]).attr("data-hc")) < 1) {
                                        $(pGridTb).find("td[data-p^='" + (cCount + tdSubPosVal) + ",']").css("display", "");;
                                        for (var i = 0; i < $(pGridTb).find("td[data-p^='" + (cCount + tdSubPosVal) + ",']").length; i++) {
                                            if ($($(pGridTb).find("td[data-p^='" + (cCount + tdSubPosVal) + ",']")[i]).attr("data-hc") != undefined || $($(pGridTb).find("td[data-p^='" + (cCount + tdSubPosVal) + ",']")[i]).attr("data-hc") > -1)
                                                $($(pGridTb).find("td[data-p^='" + (cCount + tdSubPosVal) + ",']")[i]).css('display', 'none');
                                        }
                                    }
                                }
                            }
                            $(clickedTh).next().css("display", "");;
                            span = clickedTh.colSpan - colsSpanSub;
                        }
                        for (var cCount = 0; cCount < colsSpan; cCount++) {
                            var thList = this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders ? $(row).nextAll().find("td[data-p^='" + (cCount + tdPosVal) + ",']") : $(row).nextAll().find("th[data-p^='" + (cCount + tdPosVal) + ",']");
                            if (thList.length == 0)
                                continue;
                            for (var thCnt = 0; thCnt < $(thList).length; thCnt++) {
                                $(thList[thCnt]).attr("data-hc", $(thList[thCnt]).attr("data-hc") != undefined ? parseInt($(thList[thCnt]).attr("data-hc")) + 1 : 1).css("display", "none");
                            }
                            if ($(thList[thCnt]).attr("data-hc") == undefined || parseInt($(thList[thCnt]).attr("data-hc")) < 1) {
                                if (this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders) {
                                    $(pGridTb).find(".pivotGridValueTable td[data-p^='" + (cCount + tdPosVal) + ",']").css("display", "none");
                                    $(pGridTb).find(".pivotGridValueTable td[data-p^='0,']:not(.summary)").parent().find("td[data-p^='" + (cCount + tdPosVal) + ",']").attr("data-ch", 1)
                                }
                                else {
                                    $(pGridTb).find("td[data-p^='" + (cCount + tdPosVal) + ",']").css("display", "none");
                                    $(pGridTb).find("th[data-p^='0,']:not(.summary)").parent().find("td[data-p^='" + (cCount + tdPosVal) + ",']").attr("data-ch", 1);
                                }
                            }
                        }
                        $(clickedTh).attr("data-hc", 1).css("display", "none");
                        $(clickedTh).next().text($(clickedTh).next().text().replace(" Total", ""));
                        $(clickedTh).next().find("span:not(.cellValue)").remove();
                        $(clickedTh).next().prepend("<span class=\"e-expand\ e-icon\" title=\"" + this._getLocalizedLabels("Expand") + "\" data-tag=\"" + colsSpan + "\">&nbsp;</span>");
                        var prevThColSpan = $(row).prevAll().find("th:has(span):not(.summary), td:has(span):not(.summary)");
                        for (var cCount = 0; cCount < prevThColSpan.length; cCount++) {
                            var prevColSpan = (this.model.enableAdvancedFilter && !ej.isNullOrUndefined($(prevThColSpan[cCount]).attr("vfcolspan"))) ? parseInt($(prevThColSpan[cCount]).attr("vfcolspan")) : prevThColSpan[cCount].colSpan;
                            if ((parseInt($(prevThColSpan[cCount]).attr("data-p").split(",")[1]) < parseInt(positionTh.split(",")[1]) && parseInt($(prevThColSpan[cCount]).attr("data-p").split(",")[0]) <= parseInt(positionTh.split(",")[0])) && (parseInt($(prevThColSpan[cCount]).attr("data-p").split(",")[0]) + prevColSpan + ($(prevThColSpan[cCount]).find("span").attr("data-tag") != undefined ? parseInt($(prevThColSpan[cCount]).find("span").attr("data-tag")) : 0)) >= (parseInt(positionTh.split(",")[0]) + colsSpan)) {
                                prevThColSpan[cCount].colSpan -= span;
                                $(prevThColSpan[cCount]).find("span").attr("data-tag", $(prevThColSpan[cCount]).find("span").attr("data-tag") != undefined ? (parseInt($(prevThColSpan[cCount]).find("span").attr("data-tag")) + (span)) : span);
                            }
                        }
                    }
                    else if ($(targetCell).attr("class") && $(targetCell).attr("class").indexOf("e-expand") > -1) {
                        var hdnCCount = 0;
                        var removeCell;
                        var removeSpan = removeCell = this._isSubTotalhidden = false;
                        var loop = 0;
                        var colsSpanSub = parseInt($(clickedTh).attr("colspan"));
                        this._hideSubTotal($(row), loop, $(targetCell))
                        if (this._isSubTotalHide) {
                            removeCell = removeSpan = true;
                            this._isSubTotalHide = false;
                            var positionSubTh = $(clickedTh).attr("data-p"), tdSubPosVal = parseInt(positionSubTh.split(",")[0]), tbSubRows = $(pGridTb).find("tr");
                            if ($(clickedTh).attr("class").indexOf("stot", "cstot") > -1) {
                                for (var cCount = 0; cCount < colsSpanSub; cCount++) {
                                    var thSubList = $(row).nextAll().find("th[data-p^='" + (cCount + tdSubPosVal) + ",']");
                                    for (var thCnt = 0; thCnt < $(thSubList).length; thCnt++) {
                                        $(thSubList[thCnt]).css('display', 'none');
                                    }
                                    if ($(thSubList[thCnt]).attr("data-hc") == undefined || parseInt($(thSubList[thCnt]).attr("data-hc")) < 1) {
                                        $(pGridTb).find("td[data-p^='" + (cCount + tdSubPosVal) + ",']").css('display', 'none');
                                    }
                                }
                            }
                            $(clickedTh).css('display', 'none');
                        }
                        var span = colsSpan - (colsSpanSub - 1);
                        for (var cCount = 1; cCount < span; cCount++) {
                            var thList = this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders ? $(row).nextAll().find("td[data-p^='" + (tdPosVal - cCount) + ",']") : $(row).nextAll().find("th[data-p^='" + (tdPosVal - cCount) + ",']");
                            for (var thCnt = 0; thCnt < $(thList).length; thCnt++) {
                                removeCell = false;
                                for (var k = 0; k < $(thList[thCnt]).length; k++) {
                                    if (($($(thList[thCnt])[k]).hasClass("stot") || $($(thList[thCnt])[k]).hasClass("cstot")) && !$($(thList[thCnt])[k]).hasClass("calc"))
                                        this._hideSubTotal($($(thList[thCnt])[k]), loop, $(targetCell))
                                }
                                if (this._isSubTotalHide) {
                                    removeCell = true;
                                    this._isSubTotalHide = false;
                                    var positionSubTh = $(thList[thCnt]).attr("data-p"), tdSubPosVal = parseInt(positionSubTh.split(",")[0]), tbSubRows = $(pGridTb).find("tr"), colsSpanSub = parseInt($(thList[thCnt]).attr("colspan"));
                                    if ($(thList[thCnt]).attr("class").indexOf("stot", "cstot") > -1 && !($(thList[thCnt]).find(".e-expand").length > 0)) {
                                        for (var cSubCount = 0; cSubCount < colsSpanSub; cSubCount++) {
                                            var thSubList = (this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders) ? $(row).nextAll().find("td[data-p^='" + (cSubCount + tdSubPosVal) + ",']") : $(row).nextAll().find("th[data-p^='" + (cSubCount + tdSubPosVal) + ",']");
                                            for (var thCnt = 0; thCnt < $(thSubList).length; thCnt++) {
                                                $(thSubList[thCnt]).css('display', 'none');
                                            }
                                            if ($(thSubList[thCnt]).attr("data-hc") == undefined || parseInt($(thSubList[thCnt]).attr("data-hc")) < 1) {
                                                $(pGridTb).find("td[data-p^='" + (cSubCount + tdSubPosVal) + ",']").css('display', 'none');
                                            }
                                            else
                                                hdnCCount++;
                                        }
                                    }
                                    $(thList[thCnt]).css('display', 'none');
                                }
                                if ($(thList[thCnt]).attr("data-hc") == undefined || parseInt($(thList[thCnt]).attr("data-hc")) == 1) {
                                    $(thList[thCnt]).css("display", "");
                                    $(thList[thCnt]).removeAttr("data-hc");
                                }
                                else {
                                    if ((parseInt($(thList[thCnt]).attr("data-hc")) - 1) == 0)
                                        $(thList[thCnt]).removeAttr("data-hc");
                                    else
                                        $(thList[thCnt]).attr("data-hc", (parseInt($(thList[thCnt]).attr("data-hc")) - 1));
                                }
                            }
                            loop = loop == 0 ? 1 : loop;
                            if (!removeCell) {
                                if ($(thList).last().attr("data-hc") == undefined) {
                                    var isFrozenEnabled = this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders;
                                    isFrozenEnabled ? $(pGridTb).find("td[data-p^='" + (tdPosVal - cCount) + ",']").css("display", "") : $(pGridTb).find("td[data-p^='" + (tdPosVal - cCount) + ",']").css("display", "");
                                    var rHdnTds = [];
                                    if (!isFrozenEnabled)
                                        rHdnTds = $(pGridTb).find("[data-p^='0,']:not(.summary)").parent().find("td[data-p^='" + (tdPosVal - cCount) + ",']");
                                    else {
                                        var rowHdrs = $(pGridTb).find("[data-p^='0,']:not(.summary)").parent();
                                        var rwHeader = "";
                                        for (var i = 0; i < rowHdrs.length; i++)
                                            rwHeader = rwHeader + (i != 0 ? " , " : "") + "  .pivotGridValueTable td:eq(" + $(rowHdrs[i]).index() + ")";
                                        rHdnTds = $(pGridTb).find(rwHeader);
                                    }
                                    $(rHdnTds).removeAttr("data-ch");
                                    for (var tdCnt = 0; tdCnt <= $(rHdnTds).length; tdCnt++) {
                                        if ($(rHdnTds[tdCnt]).attr("data-hc") != undefined)
                                            $(rHdnTds[tdCnt]).css("display", "none");
                                    }
                                }
                                else
                                    hdnCCount++;
                            }
                        }
                        $(clickedTh).prev().removeAttr("data-hc").css("display", "");
                        var spanRemove = parseInt($(clickedTh).prev().attr("colspan"));
                        var cSpnCnt = parseInt($(targetCell).attr("data-tag")) - hdnCCount;
                        var prevThColSpan = $(row).prevAll().find("th:has(span):not(.summary), td:has(span):not(.summary)");
                        if (removeSpan) {
                            removeSpan = false;
                            var olapReport = ($(this.element).parents(".e-pivotclient").length > 0 && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) ? this._pivotClientObj.getOlapReport() : this.getOlapReport();
                            cSpnCnt = this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? parseInt($(clickedTh).prev().attr("colSpan")) - this.model.dataSource.values.length : parseInt($(clickedTh).prev().attr("colSpan")) - JSON.parse(olapReport).PivotCalculations.length;
                        }
                        for (var cCount = 0; cCount < prevThColSpan.length; cCount++) {
                            var prevColSpan = (this.model.enableAdvancedFilter && !ej.isNullOrUndefined($(prevThColSpan[cCount]).attr("vfcolspan"))) ? parseInt($(prevThColSpan[cCount]).attr("vfcolspan")) : prevThColSpan[cCount].colSpan;
                            if ((parseInt($(prevThColSpan[cCount]).attr("data-p").split(",")[1]) < parseInt(positionTh.split(",")[1]) && parseInt($(prevThColSpan[cCount]).attr("data-p").split(",")[0]) < parseInt(positionTh.split(",")[0])) && (parseInt($(prevThColSpan[cCount]).attr("data-p").split(",")[0]) +
                                //prevColSpan // 
                                prevThColSpan[cCount].colSpan
                                + ($(prevThColSpan[cCount]).find("span").attr("data-tag") != undefined ? parseInt($(prevThColSpan[cCount]).find("span").attr("data-tag")) : 0)) >= (parseInt(positionTh.split(",")[0]))) {
                                prevThColSpan[cCount].colSpan += cSpnCnt;
                                if ($(prevThColSpan[cCount]).find("span").attr("data-tag") != undefined)
                                    $(prevThColSpan[cCount]).find("span").attr("data-tag", (parseInt($(prevThColSpan[cCount]).find("span").attr("data-tag")) - cSpnCnt));
                                if (parseInt($(prevThColSpan[cCount]).find("span").attr("data-tag")) == 0)
                                    $(prevThColSpan[cCount]).find("span").removeAttr("data-tag");
                            }
                        }
                        if ($(clickedTh).find(".cellValue").length > 0)
                            $(clickedTh).find(".cellValue").text($.trim($(clickedTh).find(".cellValue").text()) + " Total");
                        else
                            $(clickedTh).text($.trim($(clickedTh).text()) + " Total");
                        $(clickedTh).find(".e-expand").remove();
                        $(clickedTh).prepend("<span style='margin-left:10px'></span>");
                    }
                }
            }
        },
		
        _generateTreeViewData: function (e) {
            var args = { catalog: this.model.dataSource.catalog, cube: this.model.dataSource.cube, url: this.model.dataSource.data, request: "MDSCHEMA_DIMENSIONS" }
            this._getTreeData(args, this._loadDimensionElements, { pvtGridObj: this, action: "loadFieldElements" });
        },
        _dimensionsDetails: function (customArgs, e) {
            customArgs.pvtGridObj._dimension = $(e).find("row");
        },
        _loadDimensionElements: function (customArgs, e) {
            customArgs.pvtGridObj._waitingPopup.show();
            var dimensionName, treeNodeElement = {}, measures = {}, conStr = customArgs.pvtGridObj._getConnectionInfo(customArgs.pvtGridObj.model.dataSource.data);
            customArgs.pvtGridObj["schemaTreeView"] = []; customArgs.pvtGridObj["reportItemNames"] = [];
            var data = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"><Header/><Body><Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><RequestType>MDSCHEMA_DIMENSIONS</RequestType><Restrictions><RestrictionList><CATALOG_NAME>" + customArgs.pvtGridObj.model.dataSource.catalog + "</CATALOG_NAME><CUBE_NAME>" + customArgs.pvtGridObj.model.dataSource.cube + "</CUBE_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>" + customArgs.pvtGridObj.model.dataSource.catalog + "</Catalog> <LocaleIdentifier>" + conStr.LCID + "</LocaleIdentifier></PropertyList></Properties></Discover></Body></Envelope>";
            customArgs.pvtGridObj.doAjaxPost("POST", conStr.url, { XMLA: data }, customArgs.pvtGridObj._dimensionsDetails, null, { pvtGridObj: customArgs.pvtGridObj, action: "loadFieldElements" });
            var dimension = customArgs.pvtGridObj._dimension;
            for (var i = 0; i < $(e).find("row").length; i++) {
                var element = $($(e).find("row")[i]);
                var dimensionUniqueName = element.find("DIMENSION_UNIQUE_NAME").text();
                if (customArgs.pvtGridObj.model.enableDrillThrough){
                    for (var j = 0; j < dimension.length; j++) {
                        if(dimensionUniqueName == $(dimension[j]).find("DIMENSION_UNIQUE_NAME").text())
                            dimensionName = $(dimension[j]).find("DIMENSION_CAPTION").text();
                    }
                }
                else 
                    dimensionName = element.find("DIMENSION_CAPTION").text();

                if (dimensionUniqueName.toLowerCase() == "[measures]")
                    measures = { hasChildren: true, isSelected: false, id: dimensionUniqueName, name: dimensionName, spriteCssClass: dimensionUniqueName.toLowerCase() == "[measures]" ? "e-folderCDB e-icon" : "e-dimensionCDB e-icon", tag: dimensionUniqueName }
                else if (!$($(e).find("row")[0]).find("HIERARCHY_CAPTION").length > 0) {
                    treeNodeElement = { hasChildren: true, isSelected: false, id: dimensionUniqueName, name: dimensionName, spriteCssClass: "e-dimensionCDB e-icon", tag: dimensionUniqueName };
                    customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
                }
            }
            customArgs.pvtGridObj.schemaTreeView.splice(0, 0, measures);
            var args = { catalog: customArgs.pvtGridObj.model.dataSource.catalog, cube: customArgs.pvtGridObj.model.dataSource.cube, url: customArgs.pvtGridObj.model.dataSource.data, request: "MDSCHEMA_DIMENSIONS" }
            if (!customArgs.pvtGridObj.model.enableDrillThrough || (customArgs.pvtGridObj._schemaData != undefined && customArgs.pvtGridObj._schemaData.model.olap.showNamedSets)) {
                args.request = "MDSCHEMA_SETS";
                customArgs.pvtGridObj._getTreeData(args, customArgs.pvtGridObj._loadNamedSetElements, customArgs);
            }
            else {
                args.request = "MDSCHEMA_HIERARCHIES";
                if (customArgs.pvtGridObj._fieldData.hierarchySuccess == undefined)
                    customArgs.pvtGridObj._getTreeData(args, customArgs.pvtGridObj._loadHierarchyElements, customArgs);
                else {
                    customArgs.pvtGridObj._loadHierarchyElements(customArgs, customArgs.pvtGridObj._fieldData.hierarchySuccess);
                }
            }
        },
        _loadNamedSetElements: function (customArgs, e) {
            customArgs.pvtGridObj._waitingPopup.show();
            var args = { catalog: customArgs.pvtGridObj.model.dataSource.catalog, cube: customArgs.pvtGridObj.model.dataSource.cube, url: customArgs.pvtGridObj.model.dataSource.data, request: "MDSCHEMA_DIMENSIONS" }
            var data = customArgs.pvtGridObj.model.dataSource;
            var reportElement = $.map(data.rows, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName });
            $.merge(reportElement, ($.map(data.columns, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName })));
            $.merge(reportElement, ($.map(data.filters, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName })));

            measureGroupItems = [];

            for (var i = 0; i < $(e).find("row").length; i++) {
                var element = $($(e).find("row")[i]);
                if ((!($.inArray(element.find("DIMENSIONS").text().split(".")[0], measureGroupItems) >= 0))) {
                    treeNodeElement = {
                        hasChildren: true, isSelected: false, pid: element.find("DIMENSIONS").text().split(".")[0], id: element.find("SET_DISPLAY_FOLDER").text() + "_" + element.find("DIMENSIONS").text().split(".")[0],
                        name: element.find("SET_DISPLAY_FOLDER").text(), spriteCssClass: "e-folderCDB e-icon namedSets"
                    }
                    customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
                    measureGroupItems.push(element.find("DIMENSIONS").text().split(".")[0]);
                }
                treeNodeElement = {
                    hasChildren: true, isSelected: ($.inArray("[" + $.trim(element.children("SET_NAME").text()) + "]", reportElement) >= 0),
                    pid: element.find("SET_DISPLAY_FOLDER").text() + "_" + element.find("DIMENSIONS").text().split(".")[0],
                    id: "[" + $.trim(element.children("SET_NAME").text()).replace(/\&/g, "&amp;") + "]",
                    name: element.children("SET_CAPTION").text(), spriteCssClass: "e-namedSetCDB e-icon", tag: element.find("EXPRESSION").text()
                }
                customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
            }
            args.request = "MDSCHEMA_HIERARCHIES";
            if (customArgs.pvtGridObj._fieldData.hierarchySuccess == undefined)
                customArgs.pvtGridObj._getTreeData(args, customArgs.pvtGridObj._loadHierarchyElements, customArgs);
            else {
                customArgs.pvtGridObj._loadHierarchyElements(customArgs, customArgs.pvtGridObj._fieldData.hierarchySuccess);
            }
        },
        _loadHierarchyElements: function (customArgs, e) {
            customArgs.pvtGridObj._waitingPopup.show();
            var args = { catalog: customArgs.pvtGridObj.model.dataSource.catalog, cube: customArgs.pvtGridObj.model.dataSource.cube, url: customArgs.pvtGridObj.model.dataSource.data, request: "MDSCHEMA_DIMENSIONS" }
            var data = customArgs.pvtGridObj.model.dataSource;
            var reportElement = $.map(data.rows, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName });
            $.merge(reportElement, ($.map(data.columns, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName })));
            $.merge(reportElement, ($.map(data.filters, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName })));
            var treeNodeElement = {}, displayFolder = "";
            for (var i = 0; i < $(e).find("row").length; i++) {
                var element = $($(e).find("row")[i]);
                var dimensionUniqueName = element.find("DIMENSION_UNIQUE_NAME").text();
                var hierarchyUniqueName = element.find("HIERARCHY_UNIQUE_NAME").text();
                var currElement = $(customArgs.pvtGridObj.schemaTreeView).filter(function (i,x) { return x.tag == dimensionUniqueName; }).map(function (i,x) { return x });
                if (currElement.length > 0 && dimensionUniqueName != hierarchyUniqueName) {
                    treeNodeElement = {
                        hasChildren: true, isSelected: ($.inArray(hierarchyUniqueName, reportElement) >= 0), pid: dimensionUniqueName, id: hierarchyUniqueName, name: element.find("HIERARCHY_CAPTION").text(),
                        spriteCssClass: ((element.find("HIERARCHY_ORIGIN").text() != "2") && element.find("HIERARCHY_ORIGIN").text() != "6") ? "e-hierarchyCDB e-icon" : "e-attributeCDB e-icon", tag: hierarchyUniqueName  //HIERARCHY_ORDINAL
                    },
                    customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
                }
            }
            args.request = "MDSCHEMA_LEVELS"
            customArgs.pvtGridObj._getTreeData(args, customArgs.pvtGridObj._loadLevelElements, customArgs);
        },
        _loadLevelElements: function (customArgs, args) {
            customArgs.pvtGridObj._waitingPopup.show();
            var newDataSource = $.map($(args).find("row"), function (obj, index) {
                if (parseInt($(obj).children("LEVEL_TYPE").text()) != "1" && $(obj).children("HIERARCHY_UNIQUE_NAME").text().toLowerCase() != "[measures]") {
                    treeNodeElement = {
                        hasChildren: false, isChecked: false, id: $(obj).find("LEVEL_UNIQUE_NAME").text(), pid: $(obj).find("HIERARCHY_UNIQUE_NAME").text(), name: $(obj).find("LEVEL_CAPTION").text(),
                        spriteCssClass: "level" + parseInt($(obj).children("LEVEL_NUMBER").text()) + " e-icon", tag: $(obj).find("LEVEL_UNIQUE_NAME").text()
                    };
                    return treeNodeElement;
                }
            });
            $.merge(customArgs.pvtGridObj.schemaTreeView, newDataSource);
            if (!customArgs.pvtGridObj.model.enableDrillThrough && customArgs.pvtGridObj._fieldData.measureSuccess) {
                if (!customArgs.pvtGridObj._fieldData.measureSuccess) {
                    var args = { catalog: customArgs.pvtGridObj.model.dataSource.catalog, cube: customArgs.pvtGridObj.model.dataSource.cube, url: customArgs.pvtGridObj.model.dataSource.data, request: "MDSCHEMA_MEASURES" }
                    customArgs.pvtGridObj._getTreeData(args, customArgs.pvtGridObj._loadMeasureElements, customArgs);
                }
                else {
                    customArgs.pvtGridObj._loadMeasureElements(customArgs, customArgs.pvtGridObj._fieldData.measureSuccess);
                }
            }
            else
                ej.Pivot._createDrillThroughDialog(customArgs.pvtGridObj, customArgs.pvtGridObj.schemaTreeView);
        },
        _loadMeasureGroups: function (customArgs, e) {
            customArgs.pvtGridObj._fieldData["measuresGroups"] = $(e).find("row");
        },
        _loadMeasureElements: function (customArgs, e) {
            var args = { catalog: customArgs.pvtGridObj.model.dataSource.catalog, cube: customArgs.pvtGridObj.model.dataSource.cube, url: customArgs.pvtGridObj.model.dataSource.data, request: "MDSCHEMA_DIMENSIONS" }
            var data = customArgs.pvtGridObj.model.dataSource;
            var elements = $.map(data.values, function (obj, index) { if (obj["measures"] != undefined) return obj["measures"] });
            this.reportItemNames = $.map(elements, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName });
            var measureGroupItems = [], measureGroup = "", caption;
            {
                if (customArgs.pvtGridObj.model.locale != "en-US") {
                    var args = { catalog: customArgs.pvtGridObj.model.dataSource.catalog, cube: customArgs.pvtGridObj.model.dataSource.cube, url: customArgs.pvtGridObj.model.dataSource.data, request: "MDSCHEMA_MEASUREGROUPS" }
                    customArgs.pvtGridObj._getTreeData(args, this._loadMeasureGroups, {pvtGridObj: this, action: "loadFieldElements" });
                }
                for (var i = 0; i < $(e).find("row").length; i++) {
                    var element = $($(e).find("row")[i]), measureGRPName = element.children("MEASUREGROUP_NAME").text(), measureUQName = element.find("MEASURE_UNIQUE_NAME").text();
                    if ((!($.inArray(measureGRPName, measureGroupItems) >= 0))) {
                        if (customArgs.pvtGridObj.model.locale != "en-US") {
                            var measureInfo = $.map(customArgs.pvtGridObj._fieldData["measuresGroups"], function (item) { if ($(item).children("MEASUREGROUP_NAME").text() == measureGRPName) return $(item).children("MEASUREGROUP_CAPTION").text() });
                            caption = measureInfo.length > 0 ? measureInfo[0] : measureGRPName
                        }
                        else
                            caption = measureGRPName;

                        treeNodeElement = { hasChildren: true, isChecked: false, pid: "[Measures]", id: measureGRPName, name: caption, spriteCssClass: "e-measureGroupCDB e-icon", tag: measureGRPName }
                        customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
                        measureGroupItems.push(measureGRPName);
                    }
                    treeNodeElement = { hasChildren: true, isSelected: ($.inArray(measureUQName, this.reportItemNames) >= 0), id: measureUQName, pid: measureGRPName, name: element.children("MEASURE_CAPTION").text(), spriteCssClass: "measure", tag: measureUQName }
                    customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
                    if (($.inArray(measureUQName, customArgs.pvtGridObj.reportItemNames) >= 0)) {
                        customArgs.pvtGridObj.reportItemNames.splice(customArgs.pvtGridObj.reportItemNames.indexOf(measureUQName), 1)
                    }
                }
            }
            if (customArgs.pvtGridObj._schemaData.model.olap.showKpi) {
                treeNodeElement = { hasChildren: true, isChecked: false, id: "folderStruct", name: "KPI", spriteCssClass: "KPICDB e-folderCDB e-icon", tag: "" }
                customArgs.pvtGridObj.schemaTreeView.splice(1, 0, treeNodeElement);
                args.request = "MDSCHEMA_KPIS";
                customArgs.pvtGridObj._getTreeData(args, customArgs.pvtGridObj._loadKPIElements, customArgs);
            }
            else
                customArgs.pvtGridObj._schemaData._createTreeView(this, customArgs.pvtGridObj.schemaTreeView);

        },
        _loadKPIElements: function (customArgs, e) {
            var data = customArgs.pvtGridObj.model.dataSource;
            var reportElement = this.reportItemNames;
            var measureGroupItems = [];
            var measureGroup = "";
            for (var i = 0; i < $(e).find("row").length; i++) {
                var element = $($(e).find("row")[i]),
                    kpiName = element.children("KPI_CAPTION").text(),
                    kpiGoal = element.children("KPI_goal").text(),
                    kpiStatus = element.children("KPI_STATUS").text(),
                    kpiTrend = element.children("KPI_TREND").text(),
                    kpiValue = element.find("KPI_VALUE").text();
                if ((!($.inArray(element.children("KPI_NAME").text(), measureGroupItems) >= 0))) {
                    treeNodeElement = { hasChildren: true, isChecked: false, pid: "folderStruct", id: kpiName, name: kpiName, spriteCssClass: "e-measureGroupCDB e-icon", tag: kpiName }
                    customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
                    measureGroupItems.push(kpiName);
                }

                treeNodeElement = { hasChildren: true, isSelected: ($.inArray(kpiGoal, reportElement) >= 0), id: kpiGoal, pid: kpiName, name: customArgs.pvtGridObj._getLocalizedLabels("Goal"), spriteCssClass: "kpiGoal e-icon", tag: kpiGoal };
                customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
                treeNodeElement = { hasChildren: true, isSelected: ($.inArray(kpiStatus, reportElement) >= 0), id: kpiStatus, pid: kpiName, name: customArgs.pvtGridObj._getLocalizedLabels("Status"), spriteCssClass: "kpiStatus e-icon", tag: kpiStatus };
                customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
                treeNodeElement = { hasChildren: true, isSelected: ($.inArray(kpiTrend, reportElement) >= 0), id: kpiTrend, pid: kpiName, name: customArgs.pvtGridObj._getLocalizedLabels("Trend"), spriteCssClass: "kpiTrend e-icon", tag: kpiTrend };
                customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
                treeNodeElement = { hasChildren: true, isSelected: ($.inArray(kpiValue, reportElement) >= 0), id: kpiValue, pid: kpiName, name: customArgs.pvtGridObj._getLocalizedLabels("Value"), spriteCssClass: "kpiValue e-icon", tag: kpiValue };
                customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
            }

            customArgs.pvtGridObj._schemaData._createTreeView(this, customArgs.pvtGridObj.schemaTreeView);
            delete customArgs.pvtGridObj.reportItemNames;
            delete customArgs.pvtGridObj.schemaTreeView;
        },
        _getTreeData: function (args, successMethod, customArgs) {
            var conStr = ej.olap.base._getConnectionInfo(args.url);
            var pData = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"><Header/><Body><Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><RequestType>" + args.request + "</RequestType><Restrictions><RestrictionList><CATALOG_NAME>" + args.catalog + "</CATALOG_NAME><CUBE_NAME>" + args.cube + "</CUBE_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>" + args.catalog + "</Catalog><LocaleIdentifier>" + conStr.LCID + "</LocaleIdentifier> </PropertyList></Properties></Discover></Body></Envelope>";
            this.doAjaxPost("POST", conStr.url, { XMLA: pData }, successMethod, null, customArgs);
        },

        _addHyperlink: function (e) {
            if ($(".hyperlinkValueCell")[0])
                $($(".hyperlinkValueCell")[0]).removeClass("hyperlinkValueCell");
            if ($(".hyperlinkHeaderCell")[0])
                $($(".hyperlinkHeaderCell")[0]).removeClass("hyperlinkHeaderCell");
            if ($(e.target).text() == "" || $(e.target).text() == null)
                return false;
            var fieldIndex;
            if (e.target.parentElement.className.replace(/^\s+/, "").split(" ")[0] == "value" && (this.enableValueCellHyperlink() || ((!ej.isNullOrUndefined(this._pivotClientObj)) ? this._pivotClientObj.model.enableDrillThrough : this.model.enableDrillThrough)))
                $(e.target).addClass("hyperlinkValueCell");
            else if ($(e.target.parentElement).hasClass("summary value") && this.enableSummaryCellHyperlink())
                $(e.target).addClass("hyperlinkValueCell");

            else if (e.target.parentElement.className.split(" ")[0] == "rowheader" || (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && $(e.target.parentElement).attr("role") == "rowheader")) {
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && !this.model.enableDeferUpdate && $(this.element).parents(".e-pivotclient").length == 0) {
                    if (!$(e.target.parentElement).hasClass("rgtot")) {
                        fieldIndex = $(e.target.parentElement).attr("data-p").split(",")[0];
                        if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && !ej.isNullOrUndefined(JSON.parse(this.getOlapReport()).PivotRows[fieldIndex]) && JSON.parse(this.getOlapReport()).PivotRows[fieldIndex].EnableHyperlink)
                            $(e.target).addClass("hyperlinkHeaderCell");
                        else if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && this.model.dataSource.rows.length > 0 && !ej.isNullOrUndefined(this.model.dataSource.rows[fieldIndex].enableHyperlink) && this.model.dataSource.rows[fieldIndex].enableHyperlink)
                            $(e.target).addClass("hyperlinkHeaderCell");
                        else if (this.enableRowHeaderHyperlink())
                            $(e.target).addClass("hyperlinkHeaderCell");
                    }
                }
                else if (this.enableRowHeaderHyperlink())
                    $(e.target).addClass("hyperlinkHeaderCell");
            }
            else if (e.target.parentElement.className.split(" ")[0] == "colheader" || (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && $(e.target.parentElement).attr("role") == "columnheader")) {
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && !this.model.enableDeferUpdate && $(this.element).parents(".e-pivotclient").length == 0) {
                    if (!$(e.target.parentElement).hasClass("calc") && !$(e.target.parentElement).hasClass("cgtot") && !$(e.target.parentElement).hasClass("gtot")) {
                        fieldIndex = $(e.target.parentElement).attr("data-p").split(",")[1];
                        if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && !ej.isNullOrUndefined(JSON.parse(this.getOlapReport()).PivotColumns[fieldIndex]) && JSON.parse(this.getOlapReport()).PivotColumns[fieldIndex].EnableHyperlink)
                            $(e.target).addClass("hyperlinkHeaderCell");
                        else if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && !ej.isNullOrUndefined(this.model.dataSource.columns[fieldIndex].enableHyperlink) && this.model.dataSource.columns[fieldIndex].enableHyperlink)
                            $(e.target).addClass("hyperlinkHeaderCell");
                        else if (this.enableColumnHeaderHyperlink())
                            $(e.target).addClass("hyperlinkHeaderCell");
                    }
                }
                else if (this.enableColumnHeaderHyperlink())
                    $(e.target).addClass("hyperlinkHeaderCell");
            }
        },

        _removeHyperlink: function (e) {
            $(e.target).removeClass("hyperlinkValueCell").removeClass("hyperlinkHeaderCell");
        },

        _cellContext: function (e) {
            var pGridObj = $(e.target).parents(".e-pivotgrid").data("ejPivotGrid");
            var currentCell = ($(e.target).hasClass("cellValue") ? $(e.target).parent()[0] : e.target) || ($(e.srcElement).hasClass("cellValue") ? $(e.srcElement).parent()[0] : e.srcElement);
            if (!ej.isNullOrUndefined(pGridObj) && pGridObj.enableCellContext() == true && $(currentCell).parents("#" + pGridObj._id)[0]) {
                var cellPos = $(currentCell).attr("data-p");
                if (cellPos) {
                    var cellPos = pGridObj._excelLikeJSONRecords != null && pGridObj.model.layout.toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? $(currentCell).attr('data-i') : $(currentCell).attr("data-p");
                    var rawdata = pGridObj._excelLikeJSONRecords != null && pGridObj.model.layout.toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? pGridObj._excelLikeJSONRecords[parseInt((parseInt(cellPos.split(",")[0]) * pGridObj._excelRowCount) + parseInt(cellPos.split(",")[1]))].Info : pGridObj.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * pGridObj._rowCount) + parseInt(cellPos.split(",")[1]))].Info;
                    var cellInfo = {
                        cellValue: currentCell.innerHTML,
                        cellPosition: cellPos,
                        cellType: currentCell.className.split(" ")[0] != "" ? currentCell.className.split(" ")[0] : currentCell.className.split(" ")[1],
                        role: $(currentCell).attr('role'),
                        uniqueName: rawdata.split('::')[0],
                        args: e,
                        rawdata: rawdata
                    };
                    if (cellInfo.cellType != "") {
                        if (!ej.isNullOrUndefined(pGridObj._pivotClientObj))
                            pGridObj._pivotClientObj._trigger("cellContext", { args: cellInfo });
                        else
                            pGridObj._trigger("cellContext", { args: cellInfo });
                    }
                    e.target ? e.preventDefault() : (window.event.returnValue = false);
                }
            }
        },

        _initCellSelection: function (e) {
            $("#" + this._id + " td,th").removeClass("e-highlighted");
            this._on(this.element, "mouseup touchend", ".value", this._completeCellSelection);
            var targetCell;
            _oriX = e.pageX, _oriY = e.pageY;
            targetCell = e.target || window.event.srcElement;
            if ($(targetCell).hasClass("cellValue")) targetCell = targetCell.parentElement;
            $(".value").addClass("selection");
            $("#" + this._id).append(ej.buildTag("div.e-cellSelection#" + this._id + "_cellSelection", "", {}));
            _startPosCell = $(targetCell)[0].attributes.getNamedItem("data-p").value;
            if (this._excelLikeJSONRecords != null && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout) {
                var startIndex = this._excelLikeJSONRecords[(0 * this._rowCount + (parseInt($(targetCell)[0].attributes.getNamedItem("data-i").value.split(',')[1])))].Index;
                _startPosCell = this.getJSONRecords()[((parseInt($(targetCell)[0].attributes.getNamedItem("data-p").value.split(',')[0])) * this._rowCount + parseInt(startIndex.split(',')[1]))].Index;
            }
            this._on(this.element, "mousemove touchmove", ".value, .e-cellSelection", this._cellSelection);
        },

        _headerClickCellSelection: function (e) {
            var target = ($(e.target).attr("class").indexOf("colheader") && $(e.target).attr("class").indexOf("rowheader") == -1) ? ($(e.target).attr("class").indexOf("cellValue") != -1 ? $(e.target).parent() : null) : $(e.target);
            if (target != null) {
                $("#" + this._id + " td,th").removeClass("e-highlighted");
                var _headerType, _span, _position, _cellInfo = [], _colHeader = [], _rowHeader = [], _measureCount = 0;
                _headerType = target.attr("role");
                _position = _headerType == "columnheader" ? target.attr("data-p").split(',')[0] : target.attr("data-p").split(',')[1];
                _span = _headerType == "columnheader" ? target.attr("colspan") : target.attr("rowspan");
                if (this._excelLikeJSONRecords != null && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout) {
                    var rowSpanIndex = (parseInt(target.attr("data-p").split(',')[0]) * this._rowCount + (parseInt(target.attr("data-p").split(',')[1])));
                    _span = _headerType == "columnheader" ? this._excelLikeJSONRecords[(parseInt(target.attr('data-i').split(',')[0]) * this._rowCount + (parseInt(target.attr('data-i').split(',')[1])))].ColSpan : this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.getJSONRecords()[rowSpanIndex + this._rowCount] != null && this.getJSONRecords()[rowSpanIndex + this._rowCount].CSS.indexOf("value") == -1 ? this.getJSONRecords()[rowSpanIndex].RowSpan + 1 : this.getJSONRecords()[rowSpanIndex].RowSpan;
                }
                for (var i = 0; i < _span; i++) {
                    if (_headerType == "columnheader") {
                        $("#" + this._id + " [data-p^='" + (parseInt(i) + parseInt(_position)) + ",']").addClass("e-highlighted");
                        $("#" + this._id + " [data-p^='" + (parseInt(i) + parseInt(_position)) + ",']" + "[role='columnheader']").each(function (index, el) {
                            if (parseInt(el.attributes['data-p'].value.split(',')[1]) <= parseInt(target.attr("data-p").split(',')[1]) || parseInt(el.attributes['colspan'].value) > parseInt(target.attr("colspan")))
                                $(el).removeClass("e-highlighted");
                        })
                    }
                    else {
                        $("#" + this._id + " [data-p$='," + (parseInt(i) + parseInt(_position)) + "']").addClass("e-highlighted");
                        $("#" + this._id + " [data-p$='," + (parseInt(i) + parseInt(_position)) + "']" + "[role='rowheader']").each(function (index, el) {
                            if (parseInt(el.attributes['data-p'].value.split(',')[0]) <= parseInt(target.attr("data-p").split(',')[0]) || parseInt(el.attributes['rowspan'].value) > parseInt(target.attr("rowspan")))
                                $(el).removeClass("e-highlighted");
                        })
                    }
                }
                _startPosCell = _headerType == "columnheader" ? $("#" + this._id + " [data-p^='" + (0 + parseInt(_position)) + ",']" + ".value").eq(0).attr("data-p") : $("#" + this._id + " [data-p$='," + (0 + parseInt(_position)) + "']" + ".value").eq(0).attr("data-p");
                if (this._excelLikeJSONRecords != null && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout && !(this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode))
                    _startPosCell = _headerType == "columnheader" ? $("#" + this._id + " [data-p^='" + (0 + parseInt(_position)) + ",']" + ".value:not(.summary)").eq(0).attr("data-p") : $("#" + this._id + " [data-p$='," + (0 + parseInt(_position)) + "']" + ".value:not(.summary)").eq(0).attr("data-p");
                var el = _headerType == "columnheader" ? $("#" + this._id + " [data-p^='" + ((parseInt(_span) - 1) + parseInt(_position)) + ",']").eq($("#" + this._id + " [data-p^='" + ((parseInt(_span) - 1) + parseInt(_position)) + ",']").length - 1) : $("#" + this._id + " [data-p$='," + ((parseInt(_span) - 1) + parseInt(_position)) + "']").eq($("#" + this._id + " [data-p$='," + ((parseInt(_span) - 1) + parseInt(_position)) + "']").length - 1);
                this._completeCellSelection(el);
            }
        },

        _cellSelection: function (e) {
            $("#" + this._id + "_gridTooltip").hide();
            var isPivotClient = ($(e.target).parents(".e-pivotclient").length > 0);
            var width = e.pageX - this.element.offset().left - (_oriX - this.element.offset().left);
            var height = e.pageY - this.element.offset().top - (_oriY - this.element.offset().top);
            var posX = _oriX - this.element.offset().left;
            var posY = _oriY - this.element.offset().top + 3;
            if (width < 0) {
                width = Math.abs(width);
                posX -= width - 5;
            }
            if (height < 0) {
                height = Math.abs(height);
                posY -= height - 12;
            }
            if (e.pageX < _oriX) {
                $("#" + this._id + "_cellSelection").css({ left: (isPivotClient) ? posX : (e.pageX + 2), width: (isPivotClient) ? width : (_oriX - e.pageX) });
            }
            else {
                $("#" + this._id + "_cellSelection").css({ left: (isPivotClient) ? posX : (_oriX - 6), width: (isPivotClient) ? width : (e.pageX - _oriX) });
            }
            if (e.pageY < _oriY) {
                $("#" + this._id + "_cellSelection").css({ top: (isPivotClient) ? posY : e.pageY, height: (isPivotClient) ? height : (_oriY - e.pageY - 7) });
            }
            else {
                $("#" + this._id + "_cellSelection").css({ top: (isPivotClient) ? posY : (_oriY + 7), height: (isPivotClient) ? height : (e.pageY - _oriY - 11) });
            }
            $(".e-pivotGridTable").mouseleave(function (e) {
                var pGridObj = $(e.target).parents(".e-pivotgrid").data("ejPivotGrid");
                if (!ej.isNullOrUndefined(e.toElement) && !ej.isNullOrUndefined(e.toElement.classList) && e.toElement.classList[0] == "e-pivotgrid") {
                    $("#" + pGridObj._id + "_cellSelection").remove();
                    $(".value").removeClass("selection");
                    pGridObj._off(pGridObj.element, "mouseup mouseend", ".value");
                }
            });
        },

        _completeCellSelection: function (e) {
            var targetCell, endPosCell, cellInfo = [], rowHeader = [], rowLThPos, colHeader = [], curCelPos;
            this._off(this.element, "mousemove touchmove", ".value");
            $(".value").removeClass("selection");
            targetCell = $(e).hasClass("value") ? e : e.target || window.event.srcElement;
            if ($(targetCell).hasClass("cellValue")) targetCell = targetCell.parentElement;
			if($(targetCell)[0].attributes.getNamedItem("data-p") == null)
				return false;
            endPosCell = $(targetCell)[0].attributes.getNamedItem("data-p").value;
            if (this._excelLikeJSONRecords != null && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout && !($(e).hasClass("value"))) {
                var endIndex = this._excelLikeJSONRecords[(0 * this._rowCount + (parseInt($(targetCell)[0].attributes.getNamedItem("i").value.split(',')[1])))].Index;
                endPosCell = this.getJSONRecords()[((parseInt($(targetCell)[0].attributes.getNamedItem("data-p").value.split(',')[0])) * this._rowCount + parseInt(endIndex.split(',')[1]))].Index;

            }
            var count = 0;
            for (var rowSelCnt = (parseInt(_startPosCell.split(",")[1]) < parseInt(endPosCell.split(",")[1]) ? parseInt(_startPosCell.split(",")[1]) : parseInt(endPosCell.split(",")[1])) ; rowSelCnt <= (parseInt(_startPosCell.split(",")[1]) > parseInt(endPosCell.split(",")[1]) ? parseInt(_startPosCell.split(",")[1]) : parseInt(endPosCell.split(",")[1])) ; rowSelCnt++) {
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap || $("#" + this._id).find("td[data-p*='," + rowSelCnt + "']").parent().is(":visible")) {
                    for (var colSelCnt = (parseInt(_startPosCell.split(",")[0]) < parseInt(endPosCell.split(",")[0]) ? parseInt(_startPosCell.split(",")[0]) : parseInt(endPosCell.split(",")[0])) ; colSelCnt <= (parseInt(_startPosCell.split(",")[0]) > parseInt(endPosCell.split(",")[0]) ? parseInt(_startPosCell.split(",")[0]) : parseInt(endPosCell.split(",")[0])) ; colSelCnt++) {
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap || $("#" + this._id).find("[data-p*='" + colSelCnt + ",']").last("th").is(":Visible")) {
                            cellInfo[count] = this.getJSONRecords()[((colSelCnt) * this._rowCount) + rowSelCnt];
                            var rowInfo, rowValue = "";
                            var tempThPos, measureColumn, measureRowCount = 0, measureColCount = 0;
                            rowLThPos = this.element.find(".summary[role!='gridcell'][data-p$='," + rowSelCnt + "'] , .rowheader[role!='gridcell'][data-p$='," + rowSelCnt + "']").last().attr("data-p");
                            if (rowLThPos == undefined) {
                                rowLThPos = $("#" + this._id).find("tbody").find('[data-p="' + colSelCnt + "," + rowSelCnt + '"]').parent("tr").find(".summary").first().attr('data-p');
                            }
                            tempThPos = rowLThPos;
                            if (rowLThPos != null) {
                                while (rowLThPos[0] >= 0) {
                                    if (rowLThPos == this.getJSONRecords()[parseInt((parseInt(rowLThPos.split(",")[0]) * this._rowCount) + parseInt(rowLThPos.split(",")[1]))].Index) {
                                        rowInfo = this.getJSONRecords()[parseInt((parseInt(rowLThPos.split(",")[0]) * this._rowCount) + parseInt(rowLThPos.split(",")[1]))].Value;
                                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                                            rowInfo = ($("#" + this._id).find("td[data-p*='" + colSelCnt + "," + rowSelCnt + "']")).prevAll("th").children(".e-expand").length > 0 ? rowInfo.replace(this._getLocalizedLabels("Total"), "") : rowInfo;
                                        }
                                        rowLThPos = parseInt(rowLThPos.split(",")[0]) - 1 + "," + parseInt(rowLThPos.split(",")[1]);
                                    }
                                    if ((rowValue) && (rowInfo != ""))
                                        rowValue = rowInfo + "##" + rowValue;
                                    else if (rowInfo != "")
                                        rowValue = rowInfo;
                                }
                                rowHeader[count] = rowValue;
                            }
                            var columnValue = "", headerInfo;
                            var colHeadRCnt = this.element.find('tr:has(".colheader")').length - 1;
                            measureColumn = colHeadRCnt;
                            curCelPos = cellInfo[count].Index;
                            if ((curCelPos != undefined) && (curCelPos == this.getJSONRecords()[parseInt((parseInt(curCelPos.split(",")[0]) * this._rowCount) + parseInt(curCelPos.split(",")[1]))].Index)) {
                                var colPos = parseInt(curCelPos.split(",")[0]);
                            }
                            for (var rCnt = 0; rCnt <= colHeadRCnt; rCnt++) {
                                if (colPos != null)
                                    if ((colPos + "," + rCnt) == (this.getJSONRecords()[parseInt((parseInt(colPos) * this._rowCount) + rCnt)].Index)) {
                                        headerInfo = this.getJSONRecords()[parseInt((parseInt(colPos) * this._rowCount) + rCnt)].Value;
                                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                                            for (var i = colPos; i >= 0; i--) {
                                                if ($("#" + this._id).find("th[data-p*='" + i + "," + rCnt + "']").length > 0) {
                                                    headerInfo = $("#" + this._id).find("th[data-p*='" + i + "," + rCnt + "']").find(".e-expand").length > 0 ? headerInfo.replace(this._getLocalizedLabels("Total"), "") : headerInfo;
                                                    break;
                                                }
                                            }
                                        }
                                        if (columnValue == "")
                                            columnValue = headerInfo;
                                        else if (headerInfo != "")
                                            columnValue = columnValue + "##" + headerInfo;
                                    }
                                colHeader[count] = columnValue;
                            }
                            count++;
                        }
                    }
                }
            }
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
            var measureValue = this.getJSONRecords()[parseInt((parseInt(tempThPos.split(",")[0]) * this._rowCount) + parseInt(tempThPos.split(",")[1]))].Info;
            while (measureValue[0] >= 0) {
                rowInfo = this.getJSONRecords()[parseInt((parseInt(measureValue.split(",")[0]) * this._rowCount) + parseInt(measureValue.split(",")[1]))].Info;
                if (rowInfo.split("::")[0].indexOf("Measures") > 0 || rowInfo.split("::")[0].indexOf("MEASURES") > 0) {
                    measureRowCount++;
                }
                rowLThPos = parseInt(rowLThPos.split(",")[0]) - 1 + "," + parseInt(rowLThPos.split(",")[1]);
            }
            var columnpos = parseInt(curCelPos.split(",")[0]);
            if (measureRowCount == 0)
                for (var colRCnt = 0; colRCnt <= measureColumn; colRCnt++) {
                    if (columnpos != null)
                        var headerValue = this.getJSONRecords()[parseInt((parseInt(columnpos) * this._rowCount) + colRCnt)].Info;
                    if (headerValue.split("::")[0].indexOf("Measures") > 0 || headerValue.split("::")[0].indexOf("MEASURES") > 0) {
                        measureColCount++;
                    }
                }
            }
            else
                measureCount = (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) ? (JSON.parse(this.getOlapReport()).PivotCalculations.length) : (this.model.dataSource.values.length);
            args = { JSONRecords: cellInfo, rowHeader: rowHeader, columnHeader: colHeader, measureCount: (measureRowCount > 0 ? ("Row:" + measureRowCount) : ("Column:" + measureColCount)) }
            if (!ej.isNullOrUndefined(this._pivotClientObj))
                this._pivotClientObj._trigger("cellSelection", args);
            else
                this._trigger("cellSelection", args);
            cellInfo = rowHeader = colHeader = [];
            $("#" + this._id + "_cellSelection").remove();
            this._on(this.element, "mousemove touchmove", ".value", this._applyToolTip);
            this._off(this.element, "mouseup touchend", ".value");
        },

        exportPivotGrid: function (exportOption, fileName) {
            this._isExporting = true;            
            var exportSetting ={};
            if (exportOption.toLowerCase() == "excel" || exportOption.toLowerCase() == "excelexport")
                exportSetting = { url: "", fileName: "PivotGrid", exportMode: ej.PivotGrid.ExportMode.JSON, fileFormat: this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? ".xls" : ".xlsx", title: "", description: "", exportType: exportOption, controlName: this, exportWithStyle: true, exportValueAsNumber: false };
            else
                exportSetting = { url: "", fileName: "PivotGrid", exportMode: ej.PivotGrid.ExportMode.JSON, fileFormat: exportOption.toLowerCase() == "word" ? ".docx" : ".pdf", title: "", description: "", exportType: exportOption, controlName: this, exportWithStyle: true };
            this._trigger("beforeExport", exportSetting);
            var colorDetails = {
                rowCellColor: !ej.isNullOrUndefined(this.element.find(".rowheader")) ? ej.isNullOrUndefined(this.element.find(".rowheader").css("color")) ? "rgb(51, 51, 51)" : this.element.find(".rowheader").css("color") : "",
                rowCellBGColor: !ej.isNullOrUndefined(this.element.find(".rowheader")) ? ej.isNullOrUndefined(this.element.find(".rowheader").css("background-color")) ? "rgb(255, 255, 255)" : this.element.find(".rowheader").css("background-color") : "",
                columnCellColor: !ej.isNullOrUndefined(this.element.find(".colheader")) ? ej.isNullOrUndefined(this.element.find(".colheader").css("color")) ? "rgb(51, 51, 51)" : this.element.find(".colheader").css("color") : "",
                columnCellBGColor: !ej.isNullOrUndefined(this.element.find(".colheader")) ? ej.isNullOrUndefined(this.element.find(".colheader").css("background-color")) ? "rgb(255, 255, 255)" : this.element.find(".colheader").css("background-color") : "",
                valueCellColor: !ej.isNullOrUndefined(this.element.find(".value")) ? ej.isNullOrUndefined(this.element.find(".value").css("color")) ? "rgb(51, 51, 51)" : this._cFormat.length <= 0 ? this.element.find(".value").css("color") : "rgb(51, 51, 51)" : "",
                valueCellBGColor: !ej.isNullOrUndefined(this.element.find(".value")) ? ej.isNullOrUndefined(this.element.find(".value").css("background-color")) ? "rgb(255, 255, 255)" : this._cFormat.length <= 0 ? this.element.find(".value").css("background-color") : "rgb(255, 255, 255)" : "",
                summaryCellColor: !ej.isNullOrUndefined(this.element.find(".summary")) ? ej.isNullOrUndefined(this.element.find(".summary").css("color")) ? "rgb(51, 51, 51)" : this.element.find(".summary").css("color") : "",
                summaryCellBGColor: !ej.isNullOrUndefined(this.element.find(".summary")) ? ej.isNullOrUndefined(this.element.find(".summary").css("background-color")) ? "rgb(255, 255, 255)" : (this.element.find(".summary").css("background-color") == "rgba(0, 0, 0, 0)" ? "rgb(255, 255, 255)" : this.element.find(".summary").css("background-color")) : ""
            };

            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode || exportSetting.exportMode == ej.PivotGrid.ExportMode.JSON) {
                var params = {};
                if (this.model.enableCompleteDataExport && (this.model.enablePaging || this.model.enableVirtualScrolling)) {
                    var sData = { paging: this.model.enablePaging, vScrolling: this.model.enableVirtualScrolling }, currRowCount = 0;
                    this.model.enablePaging = this.model.enableVirtualScrolling = false; this._isExporting = true;
                    if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                            this._fullExportedData.jsonObj = ej.PivotAnalysis.pivotEnginePopulate(this.model).json;
                            this._fullExportedData.rowCount = 0;
                            for (var index = 0; index < this._fullExportedData.jsonObj.length; index++) {
                                if (parseInt(this._fullExportedData.jsonObj[index].Index.split(',')[0]) == 0) this._fullExportedData.rowCount++; else break;
                            }
                        }
                        else
                            ej.olap.base.getJSONData({ action: "loadFieldElements" }, this.model.dataSource, this);
                    }
                    else {
                        var report;
                        try {
                            report = JSON.parse(this.getOlapReport()).Report;
                        }
                        catch (err) {
                            report = this.getOlapReport();
                        }
                        this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.initialize, JSON.stringify({ "action": "export", "currentReport": report, "gridLayout": this.layout(), "enablePivotFieldList": this.model.enablePivotFieldList, "valueSorting": JSON.stringify(this.model.valueSortSettings), "customObject": JSON.stringify(this.model.customObject) }), function (msg) {
                            this._fullExportedData.jsonObj = !ej.isNullOrUndefined(msg[0]) ? JSON.parse(msg[0]) : !ej.isNullOrUndefined(msg.d) ? JSON.parse(msg.d[0]) : JSON.parse(msg.JsonRecords);                            
                            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                                this._fullExportedData.rowCount = 0;
                                for (var index = 0; index < this._fullExportedData.jsonObj.length; index++) {
                                    if (parseInt(this._fullExportedData.jsonObj[index].Index.split(',')[0]) == 0) this._fullExportedData.rowCount++; else break;
                                }
                            }
                            else
                                this._fullExportedData.rowCount = !ej.isNullOrUndefined(msg[1]) ? JSON.parse(msg[1]) : !ej.isNullOrUndefined(msg.d) ? JSON.parse(msg.d[1]) : JSON.parse(msg.RowCount);
                        });
                    }
                    this.exportRecords = this._fullExportedData.jsonObj;
                    currRowCount = this._fullExportedData.rowCount;
                    params = { args: JSON.stringify({ "pGridData": (this.exportRecords != null && this.exportRecords != "") ? this.exportRecords : null, "rowCount": currRowCount, "columnCount": this.exportRecords != null ? Math.floor(this.exportRecords.length / currRowCount) : 0, "fileFormat": (exportSetting.fileFormat + ((exportSetting.fileFormat == ".xls" || exportSetting.fileFormat == ".xlsx") ? ("~" + exportSetting.exportValueAsNumber) : "")), "fileName": ej.isNullOrUndefined(fileName) ? (ej.isNullOrUndefined(exportSetting.fileName) ? "PivotGrid" : exportSetting.fileName) : fileName, "colorSettings": colorDetails, "Formatting": this._cFormat, title: exportSetting.title, description: exportSetting.description, "language": this.model.locale, exportWithStyle: exportSetting.exportWithStyle, customObject: JSON.stringify(this.model.customObject) }) };
                    this.model.enablePaging = sData.paging; this.model.enableVirtualScrolling = sData.vScrolling; this._isExporting = false;
                }
                else {
                    params = { args: JSON.stringify({ "pGridData": (this.exportRecords != null && this.exportRecords != "") ? this.exportRecords : null, "rowCount": this._excelLikeJSONRecords != null ? this._excelRowCount : this._rowCount, "columnCount": this._excelLikeJSONRecords != null ? Math.floor(this._excelLikeJSONRecords.length / this._excelRowCount) : this.getJSONRecords() != null ? Math.floor(this.getJSONRecords().length / this._rowCount) : 0, "fileFormat": (exportSetting.fileFormat + ((exportSetting.fileFormat == ".xls" || exportSetting.fileFormat == ".xlsx") ? ("~" + exportSetting.exportValueAsNumber) : "")), "fileName": ej.isNullOrUndefined(fileName) ? (ej.isNullOrUndefined(exportSetting.fileName) ? "PivotGrid" : exportSetting.fileName) : fileName, "colorSettings": colorDetails, "Formatting": this._cFormat, title: exportSetting.title, description: exportSetting.description, "language": this.model.locale, exportWithStyle: exportSetting.exportWithStyle, customObject: JSON.stringify(this.model.customObject) }) };
                }
                if (ej.raiseWebFormsServerEvents && ((exportOption == "excelExport" || exportOption == "wordExport" || exportOption == "pdfExport" || exportOption == "csvExport") && exportSetting.exportMode == ej.PivotGrid.ExportMode.JSON && $.trim(exportSetting.url) == "")) {
                    var serverArgs = { model: this.model, originalEventType: exportOption };
                    var clientArgs = params;
                    ej.raiseWebFormsServerEvents(exportOption, serverArgs, clientArgs);
                    setTimeout(function () {
                        ej.isOnWebForms = true;
                    }, 1000);
                }
                else
                    this.doPostBack($.trim(exportSetting.url) != "" ? exportSetting.url : exportOption, params);
            }
            else {
                var report;
                try {
                    report = JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.getOlapReport();
                }
                var params = {
                    args: JSON.stringify({
                        exportOption: exportOption,
                        fileFormat: exportSetting.fileFormat,
                        currentReport: report,
                        layout: this.layout(),
                        colorSettings: colorDetails != undefined ? JSON.stringify(colorDetails) : "",
                        customObject: JSON.stringify(this.model.customObject),
                        title: exportSetting.title,
                        description: exportSetting.description,
                        completeDataExport: this.model.enableCompleteDataExport,
                        exportWithStyle: exportSetting.exportWithStyle
                    })
                };
                this.doPostBack($.trim(exportSetting.url) != "" ? exportSetting.url : this.model.url + "/" + this.model.serviceMethodSettings.exportPivotGrid, params);
            }
            this._isExporting = false;
        },

        _createCalculatedField: function () {
            ej.Pivot.openPreventPanel(this);
            this.element.find(".calculatedFieldPopup", ".e-clientDialog", ".e-dialog").remove();
            dialogTitle = this._getLocalizedLabels("CalculatedField");
            var nameLabel = ej.buildTag("label#" + this._id + "_lblCalFieldName", this._getLocalizedLabels("Name"))[0].outerHTML;
            var calculateFieldList = ej.buildTag("span.fieldDropDown", ej.buildTag("input#" + this._id + "_calculateFieldList", "", {}, { type: 'text' })[0].outerHTML + ej.buildTag("input#" + this._id + "_calculateFieldName.calculateFieldName", "", { "margin-left": this.model.enableRTL ? "86px" : "2px", "outline": "none" }, { type: 'text' })[0].outerHTML, {})[0].outerHTML;
            var addBtn = ej.buildTag("button#" + this._id + "_btnAdd", this._getLocalizedLabels("Add"), {"margin-top":"-5px"}, { name: this._getLocalizedLabels("Add") })[0].outerHTML;
            var formulaLabel = ej.buildTag("label#" + this._id + "_lblCalFieldFormula", this._getLocalizedLabels("Formula"))[0].outerHTML;
            var formulaTextBox = ej.buildTag("input.calculatedFieldFormula#" + this._id + "_calculatedFieldFormula", "", { width: "192px", height: "27px" }, { type: 'text', disabled: "disabled" })[0].outerHTML;
            var deleteBtn = ej.buildTag("button#" + this._id + "_btnDelete", this._getLocalizedLabels("Delete"), { "margin-top": "-24px" }, { name: this._getLocalizedLabels("Delete") })[0].outerHTML;
            var fieldsLabel = ej.buildTag("label#" + this._id + "_pivotGridValueFields", this._getLocalizedLabels("Fields"))[0].outerHTML;
            var fieldCollection = ej.buildTag("ul#" + this._id + "_fieldCollection", "")[0].outerHTML;
            //  var calculatorFields = ej.buildTag("span.calculatorFields e-icon e-sigma", "", { "padding": "3px" }).attr("aria-label","calculated button")[0].outerHTML;
            var calculatorFields = ej.buildTag("button.calculatorFields", "", { "margin-left": this.model.enableRTL ? "0px" : "10px", "margin-right": this.model.enableRTL ? "10px" : "0px"})[0].outerHTML;
            var editFormula = ej.buildTag("span.editFormula e-icon e-cancel", "", { "padding": "3px", "margin-left": "-54px", "margin-right": this.model.enableRTL ?"-54px":"0px","position":"relative"}).attr("aria-label","cancel")[0].outerHTML;
            var insertButton = ej.buildTag("span", ej.buildTag("button#" + this._id + "_btnInsert", this._getLocalizedLabels("InsertField"), {}, { name: this._getLocalizedLabels("InsertField") })[0].outerHTML, { "margin-right": "150px", "margin-left": "150px" })[0].outerHTML;

            var okBtn = ej.buildTag("button#" + this._id + "_btnOk", this._getLocalizedLabels("OK"), { "margin-left": "10px", }, { name: this._getLocalizedLabels("OK") })[0].outerHTML;
            var cancelBtn = ej.buildTag("button#" + this._id + "_btnCancel", this._getLocalizedLabels("Cancel"), { "margin-left": this.model.enableRTL ? "0px" : "10px", }, { name: this._getLocalizedLabels("Cancel") })[0].outerHTML;
            dialogFooter = ej.buildTag("div", okBtn + cancelBtn, { "float": this.model.enableRTL ? "left" : "right", "margin-bottom": "15px", "margin-top": "4px" })[0].outerHTML;

            var calculatorDiv = ej.buildTag("div.e-calcFormulaDiv", ej.buildTag("table", ej.buildTag("tbody",
                               ej.buildTag("tr", ej.buildTag("td", "+")[0].outerHTML + ej.buildTag("td", "-")[0].outerHTML + ej.buildTag("td", "*")[0].outerHTML + ej.buildTag("td", "/")[0].outerHTML)[0].outerHTML +
                               ej.buildTag("tr", ej.buildTag("td", "7")[0].outerHTML + ej.buildTag("td", "8")[0].outerHTML + ej.buildTag("td", "9")[0].outerHTML + ej.buildTag("td", "%")[0].outerHTML)[0].outerHTML +
                               ej.buildTag("tr", ej.buildTag("td", "4")[0].outerHTML + ej.buildTag("td", "5")[0].outerHTML + ej.buildTag("td", "6")[0].outerHTML + ej.buildTag("td", "^")[0].outerHTML)[0].outerHTML +
                               ej.buildTag("tr", ej.buildTag("td", "1")[0].outerHTML + ej.buildTag("td", "2")[0].outerHTML + ej.buildTag("td", "3")[0].outerHTML + ej.buildTag("td", "(")[0].outerHTML)[0].outerHTML +
                               ej.buildTag("tr", ej.buildTag("td", ".")[0].outerHTML + ej.buildTag("td", "0")[0].outerHTML + ej.buildTag("td", "C")[0].outerHTML + ej.buildTag("td", ")")[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML, { "display": "none" })[0].outerHTML;

            var dialogContent = ej.buildTag("div#calculatedField.e-dlgCalculatedField", "<table class=\"outerTable\"><tr><td>" + nameLabel + "</td><td>" + calculateFieldList + "</td><td>" + addBtn + "</td></tr>" + "<tr><td>" + formulaLabel + "</td><td>" + formulaTextBox + calculatorFields + editFormula + "</td><td>" + deleteBtn + "</td></tr></table>" +"<p class=\"borderLine\"></p>"+ "<table class=\"e-fieldTable\"><tr><td>" + fieldsLabel + "</td></tr><tr><td>" + fieldCollection + "</td></tr><tr><td>" + insertButton + "</td></tr></table>")[0].outerHTML,
            ejDialog = ej.buildTag("div#clientDialog.e-clientDialog", dialogContent + dialogFooter + calculatorDiv, { "opacity": "1" }).attr("title", dialogTitle)[0].outerHTML;
            $(ejDialog).appendTo("#" + this._id);

            this.element.find(".e-clientDialog").ejDialog({ width: "auto", target: "#" + this._id, enableRTL: this.model.enableRTL, enableResize: false, close: ej.proxy(ej.Pivot.closePreventPanel, this) });
            $("#" + this._id + "_btnAdd" + "," + "#" + this._id + "_btnDelete" + "," + "#" + this._id + "_btnOk" + "," + "#" + this._id + "_btnCancel").ejButton({ type: ej.ButtonType.Button, width: "80", enableRTL: this.model.enableRTL });
            $("#" + this._id + "_btnInsert").ejButton({ type: ej.ButtonType.Button, enabled: false, width: "100", enableRTL: this.model.enableRTL });
            $(".calculatorFields").ejButton({ type: ej.ButtonType.Button,contentType: "imageonly", prefixIcon: "e-icon e-sigma", htmlAttributes: { title: "Click Me" }, enableRTL: this.model.enableRTL });
            $("#" + this._id + "_calculateFieldList").ejDropDownList({ width: "230px", enableRTL: this.model.enableRTL, dataSource: this._calculatedField, fields: { text: "name", value: "name" }, select: ej.proxy(this._calculatedFieldListChange, this), create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) } });

            var valueFields = [];
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                $(JSON.parse(this.getOlapReport()).PivotCalculations).each(function (e) { if (this.CalculationType != 8 && this.CalculationType != "Formula") valueFields.push({ fields: this.FieldName }); });
            }
            else {
                $($.grep(this.model.dataSource.values, function (item) { return ej.isNullOrUndefined(item.isCalculatedField) || item.isCalculatedField == false; })).each(function (e) { valueFields.push({ fields: this.fieldName }) });
            }

            var btnobject1 = $("#" + this._id + "_btnInsert").data("ejButton");
            if (this._calculatedField.length == 0) { $("#" + this._id + "_btnOk").ejButton("disable"); $("#" + this._id + "_btnOk").attr('disabled', 'disabled'); }
            $("#" + this._id + "_fieldCollection").ejListBox({ dataSource: valueFields, enableRTL: this.model.enableRTL, select: function () { btnobject1.enable(); }, height: "130", width: "400" });

            btnobject1.disable();
            this.element.find(".e-dialog .e-close").attr("title", this._getLocalizedLabels("Close"));

            $(".calculatorFields").click(function (evt) {
                $('div.e-calcFormulaDiv').removeAttr("style");
            });

            $(".editFormula").click(function (evt) {
                var pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                var index = $("#" + pGridObj._id + "_calculatedFieldFormula").val().lastIndexOf(" ");
                if ($("#" + pGridObj._id + "_calculatedFieldFormula").val() !== "" && index > 0) {
                    if (index + 1 == $("#" + pGridObj._id + "_calculatedFieldFormula").val().length)
                        $("#" + pGridObj._id + "_calculatedFieldFormula").val($("#" + pGridObj._id + "_calculatedFieldFormula").val().substring(0, index - 2));
                    else
                        $("#" + pGridObj._id + "_calculatedFieldFormula").val($("#" + pGridObj._id + "_calculatedFieldFormula").val().substring(0, index) + " ");
                }
                else
                    $("#" + pGridObj._id + "_calculatedFieldFormula").val("");
            });


            $(document).click(function (event) {
                if (($(event.target).hasClass("calculatorFields")) || $(event.target).hasClass("e-sigma") || ($(event.target).parents(".e-calcFormulaDiv").length > 0))
                    return;
                $('div.e-calcFormulaDiv').css("display", "none");
            });

            $("div.e-calcFormulaDiv").on("click", "td", function (evt) {
                var pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                var text = this.textContent == "C" ? $("#" + pGridObj._id + "_calculatedFieldFormula").val("") : $("#" + pGridObj._id + "_calculatedFieldFormula").val($("#" + pGridObj._id + "_calculatedFieldFormula").val() + ("+-/%^*".indexOf(this.textContent) > -1 ? " " + this.textContent + " " : this.textContent));
            });

            $("#" + this._id + "_btnInsert").click(function (evt) {
                var pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                var text = $("#" + pGridObj._id + "_fieldCollection").data("ejListBox");
                $("#" + pGridObj._id + "_calculatedFieldFormula").val($("#" + pGridObj._id + "_calculatedFieldFormula").val() + text.value());
            });

            $("#" + this._id + "_btnAdd").click(function (evt) {
                var pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                var text = $("#" + pGridObj._id + "_calculatedFieldFormula").val().split(" ");
                var index = -1;
                if ($("#" + pGridObj._id + "_calculateFieldName").val() == '' || $("#" + pGridObj._id + "_calculatedFieldFormula").val() == '') {
                    ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("EmptyField"), pGridObj._getLocalizedLabels("Warning"), pGridObj);
                    return;
                }

                for (var i = 0; i < text.length; i++) {
                    index = "+-/%^*".indexOf(text[i]) > -1 ? i : -1;
                    if (index > -1 && text.length > 0 && (text[0] == "" || text[0] == "." || text[text.length - 1] == "" || text[text.length - 1] == "." || text[index + 1] == "" || text[index + 1] == ".")) {
                        ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("NotValid"), pGridObj._getLocalizedLabels("Warning"), pGridObj);
                        return;
                    }
                    else if (text[i].indexOf("(") == (text[i].length - 1) || text[i].indexOf(")") == 0 || ($("#" + pGridObj._id + "_calculatedFieldFormula").val().replace(/[^\(_]/g, "")).length != ($("#" + pGridObj._id + "_calculatedFieldFormula").val().replace(/[^\)_]/g, "")).length) {
                        ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("NotValid"), pGridObj._getLocalizedLabels("Warning"), pGridObj);
                        return;
                    }
                }

                var valueFields = [];
                if (pGridObj.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    $(JSON.parse(pGridObj.getOlapReport()).PivotCalculations).each(function (e) { if (this.CalculationType != 8 && this.CalculationType != "Formula") valueFields.push({ fields: this.FieldName }); });
                }
                else
                    $(pGridObj.model.dataSource.values).each(function (fields) { valueFields.push({ fields: this.fieldName }) });

                text = $("#" + pGridObj._id + "_calculatedFieldFormula").val().replace(/\(|\)/g, ' ').split(" ");
                for (var i = 0; i < text.length; i++) {
                    var flag = false;;
                    for (var j = 0; j < valueFields.length; j++) {
                        if ((text[i].indexOf(valueFields[j].fields) > -1) && text[i] != valueFields[j].fields) 
                            flag = true;
                        else if (text[i] == valueFields[j].fields) {
                            flag = false;
                            break;
                        }

                    }
                    if (flag) {
                        ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("NotPresent"), pGridObj._getLocalizedLabels("Warning"), pGridObj);
                        return;
                    }
                }

                for (var i = 0; i < pGridObj._calculatedField.length; i++) {
                    if (pGridObj._calculatedField[i].name == $("#" + pGridObj._id + "_calculateFieldName").val()) {
                        if (confirm(pGridObj._getLocalizedLabels("Confirm"))) {
                            pGridObj._calculatedField[i].formula = $("#" + pGridObj._id + "_calculatedFieldFormula").val();
                            $("#" + pGridObj._id + "_calculatedFieldFormula").val("");
                            $("#" + pGridObj._id + "_calculateFieldName").val("");
                            $("#" + pGridObj._id + "_calculateFieldList").ejDropDownList({ dataSource: pGridObj._calculatedField, fields: { text: "name", value: "name" }, enableRTL: pGridObj.model.enableRTL, create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) } });
                            return;
                        } else
                            return;
                    }
                }

                pGridObj._calculatedField.push({ name: $("#" + pGridObj._id + "_calculateFieldName").val(), formula: $("#" + pGridObj._id + "_calculatedFieldFormula").val() });
                $("#" + pGridObj._id + "_calculatedFieldFormula").val("");
                $("#" + pGridObj._id + "_calculateFieldName").val("");
                $("#" + pGridObj._id + "_calculateFieldList").ejDropDownList({ dataSource: pGridObj._calculatedField, fields: { text: "name", value: "name" }, enableRTL: pGridObj.model.enableRTL, create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) } });
                if (pGridObj._calculatedField.length > 0) { $("#" + pGridObj._id + "_btnOk").ejButton("enable"); $("#" + pGridObj._id + "_btnOk").removeAttr("disabled"); }
            });

            $("#" + this._id + "_btnDelete").click(function (evt) {
                var pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                if (pGridObj._calculatedField.length == 0) { ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("CalculatedFieldNameNotFound"), pGridObj._getLocalizedLabels("Warning"), pGridObj); return; }
                var headerText = hederTag = $("#" + pGridObj._id + "_calculateFieldName").val();
                for (var i = 0; i < pGridObj._calculatedField.length; i++) {
                    if (pGridObj._calculatedField[i].name == $("#" + pGridObj._id + "_calculateFieldName").val()) {
                        if (pGridObj.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                            pGridObj.model.dataSource.values = $.grep(pGridObj.model.dataSource.values, function (value) { return value.fieldCaption != (pGridObj._calculatedField[i].name); });
                            pGridObj._calculatedField.splice(i, 1);
                            pGridObj._populatePivotGrid();
                        }

                        else {
                            pGridObj._calculatedField.splice(i, 1);
                            var report, eventArgs, filterTag;
                            for (var i = 0; i < pGridObj._pivotTableFields.length; i++) {
                                if (pGridObj._pivotTableFields[i].name == headerText) {
                                    pGridObj._pivotTableFields[i].isSelected = false;
                                    headerTag = pGridObj._pivotTableFields[i];
                                    pGridObj._pivotTableFields.splice(i, 1);
                                }
                            }
                            try {
                                report = JSON.parse(pGridObj.getOlapReport()).Report;
                            }
                            catch (err) {
                                report = pGridObj.getOlapReport();
                            }
                            filterTag = "schemaRow::" + headerTag.id + "::FILTERED";
                            if (pGridObj._schemaData == null) {
                                if (pGridObj.model.beforeServiceInvoke != null && pGridObj.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                                    pGridObj._trigger("beforeServiceInvoke", { action: "nodeStateModified", element: pGridObj.element, customObject: pGridObj.model.customObject });
                                var serializedCustomObject = JSON.stringify(pGridObj.model.customObject);
                                eventArgs = JSON.stringify({ "action": "nodeStateModified", "headerTag": JSON.stringify(headerTag), "dropAxis": "schemaValue::", "sortedHeaders": pGridObj._ascdes, "filterParams": filterTag, "currentReport": report, "valueSorting": JSON.stringify(pGridObj.model.valueSortSettings), "customObject": serializedCustomObject });
                                if (!pGridObj.model.enableDeferUpdate)
                                    pGridObj.doAjaxPost("POST", pGridObj.model.url + "/" + pGridObj.model.serviceMethodSettings.nodeStateModified, eventArgs, pGridObj._nodeStateModifiedSuccess);
                                else {
                                    pGridObj.doAjaxPost("POST", pGridObj.model.url + "/" + pGridObj.model.serviceMethodSettings.nodeStateModified, eventArgs.replace("nodeStateModified", "nodeStateModifiedDeferUpdate"), pGridObj._nodeStateModifiedSuccess);
                                }
                            }
                        }
                        if (pGridObj._schemaData != null) {
                            var schemaUncheck = pGridObj._schemaData._tableTreeObj.element.find("li[id='" + headerText + "']");
                            pGridObj._schemaData._tableTreeObj.uncheckNode(schemaUncheck);
                            pGridObj._schemaData._tableTreeObj.model.beforeDelete = null;
                            pGridObj._schemaData._tableTreeObj.removeNode(schemaUncheck);
                            pGridObj._schemaData._tableTreeObj.model.beforeDelete = function () { return false };
                        }
                    }
                    else if (i == pGridObj._calculatedField.length - 1) { ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("CalculatedFieldNameNotFound"), pGridObj._getLocalizedLabels("Warning"), pGridObj); return; }
                }
            });

            $("#" + this._id + "_btnOk").click(function (evt) {
                var pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                if (pGridObj.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode)
                    pGridObj.model.dataSource.values = $.grep(pGridObj.model.dataSource.values, function (value) { return ej.isNullOrUndefined(value.isCalculatedField) || value.isCalculatedField == false; });
                for (var i = 0; i < pGridObj._calculatedField.length; i++) {
                    var items = pGridObj._calculatedField[i].formula.replace(/\(|\)/g, " ").replace(/[-+*/^%]/g, " ").split(" ");
                    for (var k = 0; k < items.length; k++) {
                        if (!$.isNumeric(items[k]) && items[k].replace(/\s+|\s+$/gm, "") != "") {
                            var isPresent = pGridObj.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? $.grep(JSON.parse(pGridObj.getOlapReport()).PivotCalculations, function (value) { return value.FieldName == items[k] }).length : $.grep(pGridObj.model.dataSource.values, function (value) { return value.fieldName == items[k] }).length;
                            if (isPresent == 0) {
                                ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("NotPresent"), pGridObj._getLocalizedLabels("Warning"), pGridObj);
                                return;
                            }
                        }
                    }
                    var formula = pGridObj._calculatedField[i].formula.replace(/\s+|\s+$/gm, '');
                    formula = pGridObj._parenthesisAsterisk(formula);
                    if (pGridObj.model.operationalMode != ej.PivotGrid.OperationalMode.ServerMode) {
                        if ($.grep(pGridObj.model.dataSource.values, function (item) { if (item.fieldName == pGridObj._calculatedField[i].name) { item.formula = pGridObj._calculatedField[i].formula; } return item.fieldName == pGridObj._calculatedField[i].name }).length == 0) {
                            pGridObj.model.dataSource.values.push({ fieldName: pGridObj._calculatedField[i].name, fieldCaption: pGridObj._calculatedField[i].name, isCalculatedField: true, formula: formula, format: pGridObj._calculatedField[i].format, formatString: pGridObj._calculatedField[i].formatString});
                            if (pGridObj._schemaData != null && pGridObj._schemaData._tableTreeObj.element.find("li[id='" + pGridObj._calculatedField[i].name + "']").find(".e-chk-inact").length > 0)
                                pGridObj._schemaData._tableTreeObj.checkNode(pGridObj._calculatedField[i].name);
                        }
                    }
                }
                pGridObj.element.find(".e-dialog, .e-clientDialog").remove();
                ej.Pivot.closePreventPanel(pGridObj);
                if (pGridObj.model.operationalMode != ej.PivotGrid.OperationalMode.ServerMode)
                    pGridObj._populatePivotGrid();
                else
                {
                    if (!ej.isNullOrUndefined(pGridObj._waitingPopup))
                        pGridObj._waitingPopup.show();
                    try {
                        report = JSON.parse(pGridObj.getOlapReport()).Report;
                    }
                    catch (err) {
                        report = pGridObj.getOlapReport();
                    }
                    if (pGridObj.model.beforeServiceInvoke != null)
                        pGridObj._trigger("beforeServiceInvoke", { action: "calculatedField", element: pGridObj.element, customObject: pGridObj.model.customObject });
                    var serializedCustomObject = JSON.stringify(pGridObj.model.customObject);
                    eventArgs = JSON.stringify({ "action": "calculatedField", "headerTag": JSON.stringify(pGridObj._calculatedField), "currentReport": report, "valueSorting": JSON.stringify(pGridObj.model.valueSortSettings), "customObject": serializedCustomObject });
                    if (!pGridObj.model.enableDeferUpdate)
                        pGridObj.doAjaxPost("POST", pGridObj.model.url + "/" + pGridObj.model.serviceMethodSettings.calculatedField, eventArgs, pGridObj._schemaData == null ? pGridObj._renderControlSuccess : pGridObj._schemaCalculatedField);
                    else {
                        if (!ej.isNullOrUndefined(pGridObj._waitingPopup))
                            pGridObj._waitingPopup.hide();
                        pGridObj.doAjaxPost("POST", pGridObj.model.url + "/" + pGridObj.model.serviceMethodSettings.calculatedField, eventArgs.replace("calculatedField", "calculatedFieldDeferUpdate"), pGridObj._schemaData == null ? pGridObj._renderControlSuccess : pGridObj._schemaCalculatedField);
                    }
                }
            });

            $("#" + this._id + "_btnCancel").click(function () {
                var pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                pGridObj.element.find(".e-dialog, .e-clientDialog").remove();
                ej.Pivot.closePreventPanel(pGridObj);
            });
            this._curFocus.field = this.element.find(".e-dialog .calculateFieldName").attr("tabindex", "-1");
        },

        _schemaCalculatedField: function (msg) {
                this._schemaData._tableTreeObj.model.nodeCheck = null;
                this._schemaData._tableTreeObj.model.nodeUncheck = null;
                for (var i = 0; i < this._calculatedField.length; i++) {
                    var treeObj = this._schemaData.element.find(".e-schemaFieldTree").data("ejTreeView");
                    if (this._schemaData._tableTreeObj.element.find("li[id='" + this._calculatedField[i].name + "']").length == 0) {
                        var item;
                        if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode)
                            item = { id: this._calculatedField[i].name, name: this._calculatedField[i].name, caption: this._calculatedField[i].name, isSelected: true, spriteCssClass: "" }
                        else
                            item = { id: this._calculatedField[i].name, name: this._calculatedField[i].name, isSelected: true, calculationType: 8, formula: this._calculatedField[i].formula, summaryType: 6, format: null, allowRunTimeGroupByField: "false", pivotType: "PivotComputationInfo", spriteCssClass: "" };
                        this._pivotTableFields.push(item);
                        if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode)
                            this._pivotTableFields = ej.PivotAnalysis.getTreeViewData(this.model.dataSource);
                        this._schemaData._setTableFields(this._pivotTableFields);
                        treeObj.addNode(item);
                        this._schemaData._tableTreeObj.element.find(".e-item").css("padding", "0px");

                    }
                    else if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && this._schemaData != null && this._schemaData._tableTreeObj.element.find("li[id='" + this._calculatedField[i].name + "']").find(".e-chk-inact").length > 0)
                        this._schemaData._tableTreeObj.checkNode(this._calculatedField[i].name);
                    else
                        this._schemaData._tableTreeObj.element.find("li[id='" + this._calculatedField[i].name + "']").removeClass("filter").find(".treeDrop , .filter").remove();
                }
                this._schemaData.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
                
                this._schemaData._tableTreeObj.model.nodeCheck = this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? ej.proxy(this._schemaData._checkedStateModified, this._schemaData) : ej.proxy(this._schemaData._pivotCheckedStateModified, this._schemaData);
                this._schemaData._tableTreeObj.model.nodeUncheck = this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? ej.proxy(this._schemaData._checkedStateModified, this._schemaData) : ej.proxy(this._schemaData._pivotCheckedStateModified, this._schemaData);
                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    if (!this.model.enableDeferUpdate)
                        this._renderControlSuccess(msg);
                    else {
                        this._isUpdateRequired = true;
                        this._deferUpdateSuccess(msg);
                    }
                }
                $(this._schemaData.element.find(".e-schemaValue .e-pivotButton")).each(function () { $(this).remove(); });
                if (!ej.isNullOrUndefined(this._pivotClientObj) && typeof (this._pivotClientObj._pivotSchemaDesigner) != "undefined") {
                    this._schemaData._refreshPivotButtons();
                }
                else if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    report = JSON.parse(this.getOlapReport());
                    for (var i = 0; i < report.PivotCalculations.length; i++)
                        this._schemaData._createPivotButton({ fieldName: report.PivotCalculations[i].FieldName, fieldCaption: report.PivotCalculations[i].FieldHeader}, "value", "", "", "");
                }
                else {
                    for (var i = 0; i < this.model.dataSource.values.length; i++)
                        this._schemaData._createPivotButton({ fieldName: this.model.dataSource.values[i].fieldName, fieldCaption: this.model.dataSource.values[i].fieldCaption }, "value", "", "", "");
                }
                this._schemaData._setPivotBtnWidth();
        },

        _calculatedFieldListChange: function (e) {
            $("#" + this._id + "_calculateFieldName").val(e.selectedText);
            for (var i = 0; i < this._calculatedField.length; i++) {
                if (this._calculatedField[i].name == e.selectedText)
                    $("#" + this._id + "_calculatedFieldFormula").val(this._calculatedField[i].formula);
            }
        },

        _parenthesisAsterisk: function (formula) {
            for (var j = 1; j < formula.length - 1; j++) {
                if (formula[j] == "(" && "+-/%^*(".indexOf(formula[j - 1]) == -1) {
                    formula = formula.substring(0, j) + "*" + formula.substring(j);
                    j--;
                }
                if (formula[j] == ")" && "+-/%^*)".indexOf(formula[j + 1]) == -1) {
                    formula = formula.substring(0, j + 1) + "*" + formula.substring(j + 1);
                    j--;
                }
            }
            return formula;
        },

        _calcFieldNodeDrop:function(droppedItem){
                var schemaRemoveElement = $.grep(this.model.dataSource.values, function (value) {
                    return value.isCalculatedField == true && value.formula.indexOf(droppedItem.fieldName) > -1;
                });
                for (var i = 0; i < schemaRemoveElement.length; i++)
                    this._schemaData._tableTreeObj.uncheckNode(schemaRemoveElement[i].fieldName);
        },

        _schemaButtonCreate:function(){

            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                $(this._schemaData.element.find(".e-schemaValue .e-pivotButton")).each(function () { $(this).remove(); });
                report = JSON.parse(this.getOlapReport());
                for (var i = 0; i < report.PivotCalculations.length; i++)
                    this._schemaData._createPivotButton({ fieldName: report.PivotCalculations[i].FieldName, fieldCaption: report.PivotCalculations[i].FieldHeader }, "value", "", "", "");
            }
            this._schemaData._setPivotBtnWidth();
        },

        _calculatedFieldNodeRemove: function (headerTag) {
        
            var removeElement = $.grep(JSON.parse(this.getOlapReport()).PivotCalculations, function (value) { return value.CalculationType == 8 && value.Formula.indexOf(headerTag["id"]) > -1; })
            for (var i = 0; i < removeElement.length; i++) {
                this._schemaData._tableTreeObj.model.nodeUncheck = null;
                this._schemaData._tableTreeObj.uncheckNode(removeElement[i].FieldName);
                this._schemaData._tableTreeObj.element.find("li[id='" + removeElement[i].FieldName + "']").removeClass("filter").find(".treeDrop").remove()
                this._schemaData._tableTreeObj.model.nodeUncheck = ej.proxy(this._schemaData._checkedStateModified, this._schemaData);
            }
        },
		
		createConditionalDialog: function() {
			this.openConditionalFormattingDialog();
		},

        openConditionalFormattingDialog: function () {
            if (!this.model.enableConditionalFormatting)
                return false;
            ej.Pivot.openPreventPanel(this);
            this.element.find(".e-dialog").remove();
            var ejDialog = ej.buildTag("div#" + this._id + "_clientDlg.clientDialog", { "opacity": "1" })[0].outerHTML;
            var dialogContent; var dialogTitle; var currentTag;
            var ddlFontColor, ddlBackColor, ddlBorderColor, ddlBorderStyle, ddlBorderWidth, ddlFont, ddlFontSize, ddlEditCondition, ddlConditionTYpe, removeBtn, okBtn, cancelBtn;
            dialogTitle = this._getLocalizedLabels("ConditionalFormatting");
            var conditionLbl = ej.buildTag("label#" + this._id + "_conLbl.e-conditionLbl", this._getLocalizedLabels("Condition"))[0].outerHTML;
            var conditionDropDown = ej.buildTag("input#" + this._id + "_conType.conditionType", "", {}, { type: 'text', tabindex: 0, accesskey: 'f' })[0].outerHTML;
            var editcondition = ej.buildTag("label#" + this._id + "_editcond.e-editcondition", this._getLocalizedLabels("FormatName"))[0].outerHTML;
            var value1Lbl = ej.buildTag("label#" + this._id + "_value1.value1", this._getLocalizedLabels("Value1"))[0].outerHTML;
            var value2Lbl = ej.buildTag("label#" + this._id + "_value2.e-value2", this._getLocalizedLabels("Value2"))[0].outerHTML;            
            var backcolorLbl = ej.buildTag("label#" + this._id + "_backcolorLbl.backcolorLbl", this._getLocalizedLabels("Backcolor"))[0].outerHTML;
            var bordercolorLbl = ej.buildTag("label#" + this._id + "_bordercolorLbl.bordercolorLbl", this._getLocalizedLabels("Bordercolor"))[0].outerHTML;
            var borderrangeLbl = ej.buildTag("label#" + this._id + "_borderrangeLbl.e-borderrangeLbl", this._getLocalizedLabels("Borderrange"))[0].outerHTML;
            var borderstyleLbl = ej.buildTag("label#" + this._id + "_borderstyleLbl.e-borderstyleLbl", this._getLocalizedLabels("Borderstyle"))[0].outerHTML;
            var fStyleLbl = ej.buildTag("label#" + this._id + "_fStyleLbl.fStyleLbl", this._getLocalizedLabels("Fontstyle"))[0].outerHTML;
            var fSizeLbl = ej.buildTag("label#" + this._id + "_fSizeLbl.e-fSizeLbl", this._getLocalizedLabels("Fontsize"))[0].outerHTML;
            var fontcolorLbl = ej.buildTag("label#" + this._id + "_fontcolorLbl.fontcolorLbl", this._getLocalizedLabels("Fontcolor"))[0].outerHTML;
            var fValueLbl = ej.buildTag("label#" + this._id + "_fValueLbl.fValueLbl", this._getLocalizedLabels("Measures"))[0].outerHTML;
            var editconditionDropDown = ej.buildTag("input#" + this._id + "_editCon.editconditionDropDown", "", {}, { type: 'text', tabindex: 1, accesskey: 'e' })[0].outerHTML;
            var editconditionText = ej.buildTag("input#" + this._id + "_editConText.editconditionText", "", {}, { type: 'text', tabindex: 1, accesskey: 'e' })[0].outerHTML;
            var editBtn = ej.buildTag("button#" + this._id + "_editBtn", this._getLocalizedLabels("Edit"), {}, { name: this._getLocalizedLabels("Edit") }).attr("title", this._getLocalizedLabels("Edit")).attr("role", "button").attr("aria-label", "edit")[0].outerHTML;
            var removeBtn = ej.buildTag("button#" + this._id + "_removeBtn.e-dialogremoveBtn e-icon", "", {}, { name: this._getLocalizedLabels("Remove") }).attr("title",this._getLocalizedLabels("RemoveFormat")).attr("role", "button").attr("aria-label", "remove")[0].outerHTML;
            var value1 = ej.buildTag("input#" + this._id + "_conFrom.e-conditionFrom" + (ej.isMobile() ? " inputConditionMbl" : ""), "", {}, { name: 'inputVal', type: ej.isMobile() ? 'number' : 'text', inputmode: ej.isMobile() ? 'numeric' : '', pattern: ej.isMobile() ? '[0-9]*' : '', tabindex: 2 })[0].outerHTML;
            var value2 = ej.buildTag("input#" + this._id + "_conTo.e-conditionTo" + (ej.isMobile() ? " inputConditionMbl" : ""), "", {}, { name: 'inputVal', type: ej.isMobile() ? 'number' : 'text', inputmode: ej.isMobile() ? 'numeric' : '', pattern: ej.isMobile() ? '[0-9]*' : '', tabindex: 3 })[0].outerHTML;            
            var backcolor = ej.buildTag("input#" + this._id + "_backcolor.backcolor", "", {}, { type: 'text', tabindex: 4, accesskey: 'd' })[0].outerHTML;
            var bordercolor = ej.buildTag("input#" + this._id + "_bordercolor.bordercolor", "", {}, { type: 'text', tabindex: 5, accesskey: 'c' })[0].outerHTML;
            var borderrange = ej.buildTag("input#" + this._id + "_borderrange.borderrange", "", {}, { type: 'text', tabindex: 6, accesskey: 'r' })[0].outerHTML;
            var borderstyle = ej.buildTag("input#" + this._id + "_borderstyle.borderstyle", "", {}, { type: 'text', tabindex: 7, accesskey: 's' })[0].outerHTML;
            var fStyle = ej.buildTag("input#" + this._id + "_fStyle.fStyle", "", {}, { type: 'text', tabindex: 8, accesskey: 'o' })[0].outerHTML;
            var fSize = ej.buildTag("input#" + this._id + "_fSize.fSize", "", {}, { type: 'text', tabindex: 9, accesskey: 'l' })[0].outerHTML;
            var fontcolor = ej.buildTag("input#" + this._id + "_fontcolor.fontcolor", "", {}, { type: 'text', tabindex: 10, accesskey: 'b' })[0].outerHTML;
            var fValue = ej.buildTag("input#" + this._id + "_fValue.fValue", "", {}, { type: 'text', tabindex: 11, accesskey: 'v' })[0].outerHTML;            
            var conditionDiv = ej.buildTag("div#" + this._id + "_conditionDlg.e-conditionDlg", "<table class='conditionformatTbl'><tr><td>" + conditionLbl + "</td><td>" + conditionDropDown + "</td><td>" + editcondition + "</td><td>" + (this.model.conditionalFormatSettings.length > 0 ? editconditionDropDown : editconditionText) + "</td><td>" + editBtn + "</td><td>" + removeBtn + "</td></tr><tr><td>" + value1Lbl + "</td><td>" + value1 + "</td><td>" + value2Lbl + "</td><td>" + value2 + "</td></tr><tr><td>" + backcolorLbl + "</td><td>" + backcolor + "</td><td>" + borderrangeLbl + "</td><td>" + borderrange + "</td></tr><tr><td>" + bordercolorLbl + "</td><td>" + bordercolor + "</td><td>" + borderstyleLbl + "</td><td>" + borderstyle + "</td></tr><tr><td>" + fStyleLbl + "</td><td>" + fStyle + "</td><td>" + fSizeLbl + "</td><td>" + fSize + "</td></tr><tr><td>" + fontcolorLbl + "</td><td>" + fontcolor + "</td><td>" + fValueLbl + "</td><td>" + fValue + "</td></tr></table>")[0].outerHTML;
            dialogContent = conditionDiv;
            var OKBtn = ej.buildTag("button#" + this._id + "_OKBtn.e-dialogOKBtn", "", {}, { name: this._getLocalizedLabels("OK") }).attr("title", this._getLocalizedLabels("OK"))[0].outerHTML;
            var CancelBtn = ej.buildTag("button#" + this._id + "_CancelBtn.e-dialogCancelBtn", "", {}, { name: this._getLocalizedLabels("Cancel") }).attr("title", this._getLocalizedLabels("Cancel"))[0].outerHTML;
            var dialogFooter = ej.buildTag("div", OKBtn + CancelBtn, { "float": this.model.enableRTL ? "left" : "right", "margin": "20px 0px 6px" })[0].outerHTML;
            $("#" + this._id).after(ejDialog);

            $("#" + this._id + "_clientDlg").append(dialogContent + dialogFooter);

            $("#" + this._id + "_clientDlg").ejDialog({ width: "auto", target: "#" + this._id, enableResize: false, enableRTL: this.model.enableRTL, close: ej.proxy(ej.Pivot.closePreventPanel, this) });
            $(".e-titlebar").prepend(ej.buildTag("div", dialogTitle, { "display": "inline" })[0].outerHTML)[0];
            $("#" + this._id + "_OKBtn" + "," + "#" + this._id + "_CancelBtn" + "," + "#" + this._id + "_removeBtn" + "," + "#" + this._id + "_editBtn").ejButton({ type: ej.ButtonType.Button });
            $("#" + this._id + "_OKBtn" + "," + "#" + this._id + "_CancelBtn").css({ margin: "0 0 0 10px", width: "67px" });
            $("#" + this._id + "_removeBtn").css({ margin: (this.model.enableRTL ? "0px" : "0 0 0 10px"), width: "38px", height: "29px" });
            $("#" + this._id + "_editBtn").css({ margin: "0 0 0 10px", width: "70px", height: "29px" });
            $("#" + this._id + "_conFrom" + "," + "#" + this._id + "_conTo").css({ width: "196px", height: "26px" });
            $("#" + this._id + "_conditionDlg").css({ margin: "13px 0 0 0" });
            $("#" + this._id + "_editcond" + "," + "#" + this._id + "_value2" + "," + "#" + this._id + "_fValueLbl" + "," + "#" + this._id + "_borderrangeLbl" + "," + "#" + this._id + "_borderstyleLbl" + "," + "#" + this._id + "_fSizeLbl").css({ margin: "0 0 0 15px" });
            if ($("#" + this._id + "_editConText").length > 0)
                this._formatEdit = true;
            $("#" + this._id + "_editConText").ejMaskEdit({ inputMode: ej.InputMode.Text, width: "200px", height: "26px" });
            $("#" + this._id + "_conTo").attr("disabled", "disabled");
            this.removeBtn = $("#" + this._id + "_removeBtn").data("ejButton");
            okBtn = $("#" + this._id + "_OKBtn").data("ejButton");
            cancelBtn = $("#" + this._id + "_CancelBtn").data("ejButton");
            editBtn = $("#" + this._id + "_editBtn").data("ejButton");
            this.removeBtn.setModel({ "enabled": false });
            okBtn.setModel({ text: this._getLocalizedLabels("OK") });
            cancelBtn.setModel({ text: this._getLocalizedLabels("Cancel") });
            $("#" + this._id + "_conType").ejDropDownList({
                change: "_activeConditionChange",
                dataSource: [{ option: "Less Than", value: this._getLocalizedLabels("LessThan") },
                             { option: "Less Than Or Equal To", value: this._getLocalizedLabels("LessThanOrEqualTo") },
                             { option: "Greater Than", value: this._getLocalizedLabels("GreaterThan") },
                             { option: "Greater Than Or Equal To", value: this._getLocalizedLabels("GreaterThanOrEqualTo") },
                             { option: "Equals", value: this._getLocalizedLabels("Equals") },
                             { option: "Not Equals", value: this._getLocalizedLabels("NotEquals") },
                             { option: "Between", value: this._getLocalizedLabels("Between") },
                             { option: "Not Between", value: this._getLocalizedLabels("NotBetween") },
                            ],
                fields: { text: "value", value: "option" },
                selectedIndices: [0],
                enableRTL: this.model.enableRTL,
                width: "200px",
                height: "30px",
                create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
            });
            $("#" + this._id + "_editCon").ejDropDownList({
                change: "_editConditionChange",
                dataSource: this._formatName,
                selectedIndices: [0],
                enableRTL: this.model.enableRTL,
                width: "200px",
                height: "30px",
                create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
            });
            $("#" + this._id + "_fontcolor").ejDropDownList({
                dataSource: [{ option: "AliceBlue", value: this._getLocalizedLabels("AliceBlue") },
                             { option: "Black", value: this._getLocalizedLabels("Black") },
                             { option: "Blue", value: this._getLocalizedLabels("Blue") },
                             { option: "Brown", value: this._getLocalizedLabels("Brown") },
                             { option: "Gold", value: this._getLocalizedLabels("Gold") },
                             { option: "Green", value: this._getLocalizedLabels("Green") },
                             { option: "Lime", value: this._getLocalizedLabels("Lime") },
                             { option: "Maroon", value: this._getLocalizedLabels("Maroon") },
                             { option: "Orange", value: this._getLocalizedLabels("Orange") },
                             { option: "Pink", value: this._getLocalizedLabels("Pink") },
                             { option: "Red", value: this._getLocalizedLabels("Red") },
                             { option: "Violet", value: this._getLocalizedLabels("Violet") },
                             { option: "White", value: this._getLocalizedLabels("White") },
                             { option: "Yellow", value: this._getLocalizedLabels("Yellow") },
                ],
                fields: { text: "value", value: "option" },
                selectedIndices: [1],
                enableRTL: this.model.enableRTL,
                width: "200px",
                height: "30px",
                create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
            });
            $("#" + this._id + "_backcolor").ejDropDownList({
                dataSource: [{ option: "AliceBlue", value: this._getLocalizedLabels("AliceBlue") },
                             { option: "Black", value: this._getLocalizedLabels("Black") },
                             { option: "Blue", value: this._getLocalizedLabels("Blue") },
                             { option: "Brown", value: this._getLocalizedLabels("Brown") },
                             { option: "Gold", value: this._getLocalizedLabels("Gold") },
                             { option: "Green", value: this._getLocalizedLabels("Green") },
                             { option: "Lime", value: this._getLocalizedLabels("Lime") },
                             { option: "Maroon", value: this._getLocalizedLabels("Maroon") },
                             { option: "Orange", value: this._getLocalizedLabels("Orange") },
                             { option: "Pink", value: this._getLocalizedLabels("Pink") },
                             { option: "Red", value: this._getLocalizedLabels("Red") },
                             { option: "Violet", value: this._getLocalizedLabels("Violet") },
                             { option: "White", value: this._getLocalizedLabels("White") },
                             { option: "Yellow", value: this._getLocalizedLabels("Yellow") },
                           ],
                fields: { text: "value", value: "option" },
                selectedIndices: [0],
                enableRTL: this.model.enableRTL,
                width: "200px",
                height: "30px",
                create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
            });
            $("#" + this._id + "_bordercolor").ejDropDownList({
                dataSource: [{ option: "AliceBlue", value: this._getLocalizedLabels("AliceBlue") },
                             { option: "Black", value: this._getLocalizedLabels("Black") },
                             { option: "Blue", value: this._getLocalizedLabels("Blue") },
                             { option: "Brown", value: this._getLocalizedLabels("Brown") },
                             { option: "Gold", value: this._getLocalizedLabels("Gold") },
                             { option: "Green", value: this._getLocalizedLabels("Green") },
                             { option: "Lime", value: this._getLocalizedLabels("Lime") },
                             { option: "Maroon", value: this._getLocalizedLabels("Maroon") },
                             { option: "Orange", value: this._getLocalizedLabels("Orange") },
                             { option: "Pink", value: this._getLocalizedLabels("Pink") },
                             { option: "Red", value: this._getLocalizedLabels("Red") },
                             { option: "Violet", value: this._getLocalizedLabels("Violet") },
                             { option: "White", value: this._getLocalizedLabels("White") },
                             { option: "Yellow", value: this._getLocalizedLabels("Yellow") },
                            ],
                fields: { text: "value", value: "option" },
                selectedIndices: [0],
                enableRTL: this.model.enableRTL,
                width: "200px",
                height: "30px",
                create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
            });
            $("#" + this._id + "_borderrange").ejDropDownList({
                dataSource: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
                selectedIndices: [0],
                enableRTL: this.model.enableRTL,
                width: "200px",
                height: "30px",
                create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
            });
            $("#" + this._id + "_borderstyle").ejDropDownList({
                dataSource: [{ option: "Solid", value: this._getLocalizedLabels("Solid") },
                             { option: "Dashed", value: this._getLocalizedLabels("Dashed") },
                             { option: "Dotted", value: this._getLocalizedLabels("Dotted") },
                             { option: "Double", value: this._getLocalizedLabels("Double") },
                             { option: "Groove", value: this._getLocalizedLabels("Groove") },
                             { option: "Inset", value: this._getLocalizedLabels("Inset") },
                             { option: "Outset", value: this._getLocalizedLabels("Outset") },
                             { option: "Ridge", value: this._getLocalizedLabels("Ridge") },
                             { option: "None", value: this._getLocalizedLabels("None") },
                            ],
                fields: { text: "value", value: "option" },
                selectedIndices: [0],
                enableRTL: this.model.enableRTL,
                width: "200px",
                height: "30px",
                create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
            });
            $("#" + this._id + "_fStyle").ejDropDownList({
                dataSource: [{ option: "Algerian", value: this._getLocalizedLabels("Algerian") },
                             { option: "Arial", value: this._getLocalizedLabels("Arial") },
                             { option: "Bodoni MT", value: this._getLocalizedLabels("BodoniMT") },
                             { option: "Britannic Bold", value: this._getLocalizedLabels("BritannicBold") },
                             { option: "Cambria", value: this._getLocalizedLabels("Cambria") },
                             { option: "Calibri", value: this._getLocalizedLabels("Calibri") },
                             { option: "Courier New", value: this._getLocalizedLabels("CourierNew") },
                             { option: "DejaVu Sans", value: this._getLocalizedLabels("DejaVuSans") },
                             { option: "Forte", value: this._getLocalizedLabels("Forte") },
                             { option: "Gerogia", value: this._getLocalizedLabels("Gerogia") },
                             { option: "Impact", value: this._getLocalizedLabels("Impact") },
                             { option: "Segoe UI", value: this._getLocalizedLabels("SegoeUI") },
                             { option: "Tahoma", value: this._getLocalizedLabels("Tahoma") },
                             { option: "Times New Roman", value: this._getLocalizedLabels("TimesNewRoman") },
                             { option: "Verdana", value: this._getLocalizedLabels("Verdana") },
                             { option: "None", value: this._getLocalizedLabels("None") },
                            ],
                fields: { text: "value", value: "option" },
                selectedIndices: [0],
                enableRTL: this.model.enableRTL,
                width: "200px",
                height: "30px",
                create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
            });
            $("#" + this._id + "_fSize").ejDropDownList({
                dataSource: ["12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"],
                selectedIndices: [0],
                enableRTL: this.model.enableRTL,
                width: "200px",
                height: "30px",
                create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
            });
            var dataSource = [],value=[],fvalue,clientValue=[];
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                if ($(this.element).parents(".e-pivotclient").length > 0) {
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        for (var i = 0; i < this._JSONRecords.length; i++) {
                            if (this._JSONRecords[i].Info.indexOf("Measures") > -1 && $.inArray(this._JSONRecords[i].Value, value) == -1)
                                value.push(this._JSONRecords[i].Value);
                        }
                    }
                    else
                        value = JSON.parse(this._pivotClientObj.getOlapReport()).PivotCalculations;
                }
                else
                value = JSON.parse(this.getOlapReport()).PivotCalculations;
               fvalue = "FieldHeader";
            }
           else {
                fvalue = "fieldCaption";
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    value = this.model.dataSource.values;
                }
                else {
                    for (var i = 0; i < this.model.dataSource.values.length; i++) {
                        value = this.model.dataSource.values[i].measures;
                    }
                }
            }
            dataSource = value.length > 0 ? ["All"] : dataSource;
             for (var j = 0; j < value.length; j++) {
                 {
                     if ($(this.element).parents(".e-pivotclient").length > 0 && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                         dataSource.push(value[j]);
                     else
                        dataSource.push(value[j][fvalue]);
                    }
                }
            
            dataSource = dataSource.length > 0 ? dataSource : ["No Measure"];
            $("#" + this._id + "_fValue").ejDropDownList({
                dataSource: dataSource,
                selectedIndices: [0],
                enableRTL: this.model.enableRTL,
                width: "200px",
                height: "30px",
                create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
            });
            this.element.find("#" + this._id + "_conType").ejDropDownList("option", "change", ej.proxy(this._activeConditionChange, this));
            this.element.find("#" + this._id + "_editCon").ejDropDownList("option", "change", ej.proxy(this._editConditionChange, this));

            this.isNewFormat = true;
            this.ddlEditCondition = $("#" + this._id + "_editCon").data("ejDropDownList");
            this.ddlConditionType = $("#" + this._id + "_conType").data("ejDropDownList");
            this.ddlFont = $("#" + this._id + "_fStyle").data("ejDropDownList");
            this.ddlFontSize = $("#" + this._id + "_fSize").data("ejDropDownList");
            this.ddlFontColor = $("#" + this._id + "_fontcolor").data("ejDropDownList");
            this.ddlBackColor = $("#" + this._id + "_backcolor").data("ejDropDownList");
            this.ddlBorderColor = $("#" + this._id + "_bordercolor").data("ejDropDownList");
            this.ddlBorderStyle = $("#" + this._id + "_borderstyle").data("ejDropDownList");
            this.ddlBorderWidth = $("#" + this._id + "_borderrange").data("ejDropDownList");
            this.ddlFieldValue = $("#" + this._id + "_fValue").data("ejDropDownList");
            this.element.find("#" + this._id + "_conFrom" + "," + "#" + this._id + "_conTo").keypress(function (event) {
                if (event.which == 8 || event.which == 0) {
                    return true;
                }

                if (event.which < 45 || (event.which ==45 && (event.target.value != "" || (event.target.value.indexOf("-") > -1))) || event.which > 58) {
                    return false;
                }
                if ((event.which == 46 && $(this).val().indexOf('.') != -1) || event.which == 47) {
                    return false;
                }
            });
            $("#" + this._id + "_OKBtn").click(function () {
                var pGridObj = null, isEdit = false;
                if ($(this).parents(".e-pivotclient").length > 0) {
                    pGridObj = $(this).parents(".e-pivotclient").find(".e-pivotgrid").data("ejPivotGrid");
                }
                else
                    pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                if (!ej.isNullOrUndefined(pGridObj.ddlEditCondition)) {
                    for (var i = 0; (i < pGridObj.ddlEditCondition.model.dataSource.length) ; i++) {
                        if (pGridObj.ddlEditCondition.model.dataSource[i] == $("#" + pGridObj._id + '_editConText').val() && i != pGridObj.ddlEditCondition.selectedIndexValue)
                            isEdit = true;
                    }
                }
                this.ddlEditCondition = $("#" + pGridObj._id + "_editCon").data("ejDropDownList");
                if ($("#" + pGridObj._id + '_editConText').val() == '') {
                    ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("EnterFormatName"), pGridObj._getLocalizedLabels("Warning"), pGridObj);
                }
                else if ((pGridObj._formatEdit && $("#" + pGridObj._id + '_editConText').val() != undefined && $.inArray($("#" + pGridObj._id + '_editConText').val(), pGridObj._formatName) != -1) || (!ej.isNullOrUndefined($("#" + pGridObj._id + '_editConText').val()) && isEdit)) {
                    ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("DuplicateFormatName"), pGridObj._getLocalizedLabels("Warning"), pGridObj);
                }
                else if ($("#" + pGridObj._id + '_conFrom').val() == '') {
                    ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("EnterOperand1"), pGridObj._getLocalizedLabels("Warning"), pGridObj);
                }
                else if (!($("#" + pGridObj._id + "_conTo").attr("disabled")) && $("#" + pGridObj._id + '_conTo').val() == '') {
                    ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("EnterOperand2"), pGridObj._getLocalizedLabels("Warning"), pGridObj);
                }
                else if ($("#" + pGridObj._id + "_fValue").attr("disabled") && $("#" + pGridObj._id + '_fValue').val() == 'No Measure') {
                    ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("NoMeasure"), pGridObj._getLocalizedLabels("Warning"), pGridObj);
                }
                else {
                    pGridObj._applyFormatting();
                    ej.Pivot.closePreventPanel(pGridObj);
                }
            });

            if (this.ddlEditCondition != undefined) {
                if (this.ddlEditCondition.getListData().length > 1) {
                    $("#" + this._id + "_editCon").ejDropDownList("enable");
                }
                else {
                    $("#" + this._id + "_editCon").ejDropDownList("disable");
                    $("#" + this._id + "_editcond").css("color", "#cbcbcb");
                }
            }
            if (this.ddlFieldValue.getListData().length == 1 && this.ddlFieldValue._selectedValue == "No Measure") {
                $("#" + this._id + "_fValue").ejDropDownList("disable");
                $("#" + this._id + "_fValueLbl").css("color", "#cbcbcb");
            }
            else {
                $("#" + this._id + "_fValue").ejDropDownList("enable");
            }
            if (this.model.conditionalFormatSettings.length > 0) {
                this.ddlEditCondition.selectItemByValue(this.model.conditionalFormatSettings[this.model.conditionalFormatSettings.length - 1].name);
                this._editConditionChange();
            }
            $("#" + this._id + "_removeBtn").click(function () {
                var pGridObj = null;
                if ($(this).parents(".e-pivotclient").length > 0) {
                    pGridObj = $(this).parents(".e-pivotclient").find(".e-pivotgrid").data("ejPivotGrid");
                }
                else
                    pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                if (!pGridObj.removeBtn.option('enabled')) return;
                var condition = confirm(pGridObj._getLocalizedLabels("ConditionalFormattingConformMsg"));
                if (condition == true){
                    var Index = pGridObj.ddlEditCondition._selectedIndices[0];
                    pGridObj._removeCellFormatting(Index, condition);
                    pGridObj.element.find(".e-dialog, .clientDialog").remove();
                }
            });
            $("#" + this._id + "_CancelBtn").click(function () {
                var pGridObj = null;
                    if ($(this).parents(".e-pivotclient").length > 0) {
                        pGridObj = $(this).parents(".e-pivotclient").find(".e-pivotgrid").data("ejPivotGrid");
                    }
                    else
                        pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                pGridObj.element.find(".e-dialog, .e-clientDialog").remove();
                ej.Pivot.closePreventPanel(pGridObj);
            });
            $("#" + this._id + "_editBtn").click(function () {
                var pGridObj = null;
                if ($(this).parents(".e-pivotclient").length > 0) {
                    pGridObj = $(this).parents(".e-pivotclient").find(".e-pivotgrid").data("ejPivotGrid");
                }
                else
                    pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                pGridObj._editBtnAdd();
            });
            return false;
        },

        _editBtnAdd: function () {
            if ($("#" + this._id + "_editConText").length == 0) {
                this._formatEdit = true;
                var editconditionText = ej.buildTag("input#" + this._id + "_editConText.editconditionText", "", {}, { type: 'text', tabindex: 1, accesskey: 'e' })[0].outerHTML;
                $($(".editconditionDropDown").parents("td")[0]).before("<td>" + editconditionText + "</td>");
                $($(".editconditionDropDown").parents("td")[0]).css("display", "none")
                var fName = this.ddlEditCondition != undefined && this.ddlEditCondition.selectedTextValue != undefined && this.ddlEditCondition.selectedTextValue != this._getLocalizedLabels("AddNew") ? this.ddlEditCondition.selectedTextValue : "";
                if (this.ddlEditCondition != undefined && this.ddlEditCondition.selectedTextValue != undefined && this.ddlEditCondition.selectedTextValue == this._getLocalizedLabels("AddNew"))
                    this._formatEdit = true;
                else
                    this._formatEdit = false;
                $("#" + this._id + "_editConText").ejMaskEdit({ inputMode: ej.InputMode.Text, value: fName, width: "200px", height: "26px" });
            }
        },

        _activeConditionChange: function (args) {
            if (args.selectedValue == "Between" || args.selectedValue == "Not Between")
                $("#" + this._id + "_conTo").removeAttr("disabled");
            else {
                $("#" + this._id + "_conTo").attr("disabled", "disabled");
                $("#" + this._id + "_conTo").val("");
            }
        },

        _editConditionChange: function () {
            if (this.ddlEditCondition._selectedIndices[0] > 0) {
                var i = (this.ddlEditCondition._selectedIndices[0]) - 1;
                var array = this._cFormat[i].split(",");
                this.ddlConditionType.selectItemByValue(array[1]);
                $("#" + this._id + '_conFrom').val(array[9]);
                if (array[9] != "undefined" && array[10] != "undefined")
                    $("#" + this._id + '_conTo').val(array[10]);
                this.ddlFontColor.selectItemByValue(array[2]);
                this.ddlBackColor.selectItemByValue(array[3]);
                this.ddlBorderColor.selectItemByValue(array[4]);
                this.ddlBorderStyle.selectItemByValue(array[8]);
                this.ddlBorderWidth.selectItemByValue(array[5]);
                this.ddlFont.selectItemByValue(array[6]);
                this.ddlFontSize.selectItemByValue(array[7]);
                this.ddlFieldValue.selectItemByValue(array[11]);
                this.removeBtn.option('enabled', true);
                this._conditionTypeChange();
            }
            else {
                this._editBtnAdd();
                this.removeBtn.option('enabled', false);
                this._clearWindow();
            }
        },

        _clearWindow: function () {
            $("#" + this._id + "_clientDlg").find("#" + this._id + "_conFrom" + "," + "#" + this._id + "_conTo").val('');
            $("#" + this._id + "_conTo").disabled = true;
        },

        _conditionTypeChange: function () {
            $("#" + this._id + "_conTo").disabled = !(this.ddlConditionType._selectedIndices[0] == 4 || this.ddlConditionType._selectedIndices[0] == 5);
        },

        _removeCellFormatting: function (index, flag) {
            var Index = index;
            for (var j = 0; j < this._cFormat.length && index; j++) { 
                if (flag) {
                    j = index - 1;
                    index = 0;
                }
                for (var i = 0; i < this._JSONRecords.length; i++) {
                    this._JSONRecords[i].CSS = this._JSONRecords[i].CSS.replace(" " + this._cFormat[j].split(",")[0], "");
                }
            }
            if (flag) {
                this._cFormat.splice(Index - 1, 1);
                this._list.splice(Index - 1, 1);
                this.model.conditionalFormatSettings.splice(Index - 1, 1);
                this._formatName.splice(Index, 1);
            }
            else {
                this._cFormat = [];
                this._list = [];
                this.model.conditionalFormatSettings = [];
                this._formatName = [this._getLocalizedLabels("AddNew")];
            }
            this.renderControlFromJSON();
        },

        _applyStyle: function (axis, jsonValue, mValue, val, fv1, fv2, condition, i, format) {
            var css = jsonValue.CSS, isValue = false;
            var value = axis == "rows" ? jsonValue.Index.split(",")[1] : axis == "columns" ? jsonValue.Index.split(",")[0] : null;
            if (jsonValue.Value == mValue || mValue == "All") {
                $.inArray(Number(value), val) == -1 ? val.push(Number(value)) : val;
            }
            var num = $.isNumeric(jsonValue.Value) == true ? jsonValue.Value : $.isNumeric(ej.globalize.parseFloat(ej.globalize.format(jsonValue.Value, "c", this.model.locale), this.model.locale)) ? ej.globalize.parseFloat(ej.globalize.format(jsonValue.Value, "c", this.model.locale), this.model.locale) : jsonValue.Value.replace(/[^\d.\-]/g, '');
            $.inArray(Number(value), val) != -1 ? isValue = true : isValue = false;
            if (this._getResult(Number(fv1), Number(fv2), num, condition) && num != "" && $.isNumeric(num) && isValue && jsonValue.CSS.indexOf("value") != -1) {
                jsonValue.CSS = css + " " + format;
            }
        },

        _refreshCellFormatting: function (jsonObj) {
            var axis = this._getAxis();
            var isValue = false;
            for (var j = 0; j < this._cFormat.length; j++) {
                var val = [];
                var array = this._cFormat[j].split(",");
                for (var i = 0; i < jsonObj.length; i++) {
                    if (jsonObj[i].CSS.indexOf(array[0]) === -1) {
                        this._applyStyle(axis, jsonObj[i], array[11], val, array[9], array[10], array[1], i, this._cFormat[j].split(",")[0]);
                    }
                }
            }
            return jsonObj;
        },

        _createDynamicRule: function (fontcolor, bgcolor, borderstyle, borderwidth, bordercolor, fontsize, fontstyle, name) {
            var sheet = (function () {
                var style = document.createElement("style");
                style.appendChild(document.createTextNode(""));
                document.head.appendChild(style);
                return style.sheet;
            })();
            var str = "color: " + fontcolor + "!important;background-color: " + bgcolor + " !important;border:" + borderstyle + " " + borderwidth + "px " + bordercolor + " !important;font:" + fontsize + "px " + fontstyle + " !important;"
            sheet.insertRule("." + name +"{"+str+"}",0);
        },

        _getAxis: function () {
			if(this.getOlapReport())
			{
				var field = null,axis = "";
				if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {               
				    if (this.getOlapReport() != undefined && this.getOlapReport() != "" && JSON.parse(this.getOlapReport()).PivotCalculations.length > 0 )
				        field = JSON.parse(this.getOlapReport()).PivotCalculations[0].FieldHeader;
					for (var i = 0; i < this._JSONRecords.length; i++) {
						if (this._JSONRecords[i].Value == field) {
							axis = this._JSONRecords[i].CSS == "colheader" ? "columns" : this._JSONRecords[i].CSS == "rowheader" ? "rows" : "";
							break;
						}
					}
				}
				else {
					if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
						axis = "columns";
					}
					else {
						for (var i = 0; i < this.getOlapReport().values.length; i++) {
							axis = this.getOlapReport().values[i].axis;
						}	
					}
				}
			}
            return axis;
        },
        _applyCodeBehindFormatting: function (jsonObj) {
            var st;
            var isValue = false;
            this._isFormatApply = true;
            var axis = this._getAxis();
            if (!ej.isNullOrUndefined(this.model.conditionalFormatSettings)) {
                for (var l = 0; l < this.model.conditionalFormatSettings.length; l++) {
                    var array = [];
                    array = this.model.conditionalFormatSettings[l].measures.split(",");
                    if ($.inArray(this.model.conditionalFormatSettings[l].name, this._formatName) == -1) {
                        this.model.conditionalFormatSettings[l].className = this._id + "_" + this.model.conditionalFormatSettings[l].name.trim().toLowerCase();
                        for (var j = 0; j < array.length; j++) {
                            var val = [];
                            st = array[j];
                            for (var i = 0; i < jsonObj.length; i++) {
                                this._applyStyle(axis, jsonObj[i], st, val, ej.isNullOrUndefined(this.model.conditionalFormatSettings[l].value.split(",")[0]) ? "" : this.model.conditionalFormatSettings[l].value.split(",")[0], ej.isNullOrUndefined(this.model.conditionalFormatSettings[l].value.split(",")[1]) ? "" : this.model.conditionalFormatSettings[l].value.split(",")[1], this.model.conditionalFormatSettings[l].condition, i, this.model.conditionalFormatSettings[l].className);
                            }
                        }
                        var format = this.model.conditionalFormatSettings[l].className + "," + this.model.conditionalFormatSettings[l].condition + "," + this.model.conditionalFormatSettings[l].style.color + "," + this.model.conditionalFormatSettings[l].style.backgroundcolor + "," + this.model.conditionalFormatSettings[l].style.bordercolor + "," + this.model.conditionalFormatSettings[l].style.borderwidth + "," + this.model.conditionalFormatSettings[l].style.fontstyle + "," + this.model.conditionalFormatSettings[l].style.fontsize + "," + this.model.conditionalFormatSettings[l].style.borderstyle + "," + this.model.conditionalFormatSettings[l].value.split(",")[0] + "," + this.model.conditionalFormatSettings[l].value.split(",")[1] + "," + st;
                        this._cFormat.push(format);
                        this._list.push(this.model.conditionalFormatSettings[l].className);
                        this._formatName.push(this.model.conditionalFormatSettings[l].name);
                        this._createDynamicRule(this.model.conditionalFormatSettings[l].style.color, this.model.conditionalFormatSettings[l].style.backgroundcolor, this.model.conditionalFormatSettings[l].style.borderstyle, this.model.conditionalFormatSettings[l].style.borderwidth, this.model.conditionalFormatSettings[l].style.bordercolor, this.model.conditionalFormatSettings[l].style.fontsize, this.model.conditionalFormatSettings[l].style.fontstyle, this.model.conditionalFormatSettings[l].className);
                    }
                }
            }
            this._JSONRecords = jsonObj;
            return jsonObj;
        },

        _applyFormatting: function () {
			this._isFormatApply = true;
            var format, formatName, json, index, st, val = [], axis;
            var isValue = false;
            var fName = $("#" + this._id + '_editConText').val();
            if (!ej.isNullOrUndefined($("#" + this._id + '_conFrom').val())) {
                this._formatValue1 = $("#" + this._id + '_conFrom').val(), this._formatValue2 = $("#" + this._id + '_conTo').val(), cdnTxt = this.ddlConditionType._selectedValue, fontcolor = this.ddlFontColor._selectedValue, bgcolor = this.ddlBackColor._selectedValue, bordercolor = this.ddlBorderColor._selectedValue,
                    borderrange = this.ddlBorderWidth._selectedValue, fStyle = this.ddlFont._selectedValue, fSize = this.ddlFontSize._selectedValue, borderstyle = this.ddlBorderStyle._selectedValue;
            }
            st = this.ddlFieldValue._selectedValue != undefined ? this.ddlFieldValue._selectedValue : "";
            if ($(this.element).parents(".e-pivotclient").length > 0 && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    for (var i = 0; i < this._JSONRecords.length; i++) {
                        if (this._JSONRecords[i].Info.indexOf("Measures") > -1) {
                            axis = this._JSONRecords[i].CSS == "colheader" ? "columns" : this._JSONRecords[i].CSS == "rowheader" ? "rows" : "";
                        }
                        if (axis != "")
                            break;
                    }
                }
                
                else {
                    field = JSON.parse(this.getOlapReport()).PivotCalculations[0].FieldHeader;
                    for (var i = 0; i < this._JSONRecords.length; i++) {
                        if (this._JSONRecords[i].Value == field) {
                            axis = this._JSONRecords[i].CSS == "colheader calc" ? "columns" : this._JSONRecords[i].CSS == "rowheader" ? "rows" : "";
                            break;
                        }
                        
                     }
                    
                }
        }
        else
            axis = this._getAxis();
            if (this._formatEdit) {
                formatName = this._id + "_" + fName.trim().toLowerCase();
                format = formatName + "," + this.ddlConditionType._selectedValue + "," + fontcolor + "," + bgcolor + "," + bordercolor + "," + borderrange + "," + fStyle + "," + fSize + "," + borderstyle + "," + this._formatValue1 + "," + this._formatValue2 + "," + st;
                this._cFormat.push(format);
                this._list.push(formatName);
                this._formatName.push(fName);
                var formatObj = {
                    name: fName,
                    style: {
                        "fontcolor": fontcolor,
                        "backgroundcolor": bgcolor,
                        "bordercolor": bordercolor,
                        "borderstyle": borderstyle,
                        "borderwidth": borderrange,
                        "fontsize": fSize,
                        "fontstyle": fStyle
                    },
                    condition: this.ddlConditionType._selectedValue,
                    value: this._formatValue1 + "," + this._formatValue2,
                    measures: st,
                    className: formatName
                };
                this.model.conditionalFormatSettings.push(formatObj);
            }
            else {
                fName = (fName != "" && fName != undefined) ? fName : this.ddlEditCondition._selectedValue;
                index = this.ddlEditCondition._selectedIndices[0] - 1;
                this._formatName[index + 1] = fName;
                formatName = this.model.conditionalFormatSettings[index].className;
                this._cFormat[index] = formatName + "," + this.ddlConditionType._selectedValue + "," + fontcolor + "," + bgcolor + "," + bordercolor + "," + borderrange + "," + fStyle + "," + fSize + "," + borderstyle + "," + this._formatValue1 + "," + this._formatValue2 + "," + st;
                var formatObj = {
                    name: fName,
                    style: { "fontcolor": fontcolor, "backgroundcolor": bgcolor, "bordercolor": bordercolor, "borderstyle": borderstyle, "borderwidth": borderrange, "fontsize": fSize, "fontstyle": fStyle },
                    condition: this.ddlConditionType._selectedValue,
                    value: this._formatValue1 + "," + this._formatValue2,
                    measures: st,
                    className: formatName
                };
                this.model.conditionalFormatSettings[index] = formatObj;
                for (var i = 0; i < this._JSONRecords.length; i++) {
                    this._JSONRecords[i].CSS = this._JSONRecords[i].CSS.replace(" " + formatName, "");
                }
            }
            for (var i = 0; i < this._JSONRecords.length; i++) {
                this._applyStyle(axis, this._JSONRecords[i], st, val, this._formatValue1, this._formatValue2, this.ddlConditionType._selectedValue, i, formatName);
            }
            this._createDynamicRule(fontcolor, bgcolor, borderstyle, borderrange, bordercolor, fSize, fStyle, formatName);
            this.renderControlFromJSON();
            this.element.find(".e-dialog, .e-clientDialog").remove();
            this._formatEdit = false;
        },

        _getResult: function (conditionalValue1, conditionalValue2, cellValue, operator) {
            switch (operator) {
                case "Less Than":
                    return cellValue < conditionalValue1;
                    break;
                case "Less Than Or Equal To":
                    if (cellValue <= conditionalValue1)
                        return cellValue;
                    break;
                case "Greater Than":
                    return cellValue > conditionalValue1;
                    break;
                case "Greater Than Or Equal To":
                    if (cellValue >= conditionalValue1)
                        return cellValue;
                    break;
                case "Equals":
                    if (cellValue == conditionalValue1)
                        return cellValue;
                    break;
                case "Not Equals":
                    return cellValue != conditionalValue1;
                    break;
                case "Between":
                    return (conditionalValue1 < conditionalValue2 && cellValue > conditionalValue1 && cellValue < conditionalValue2) ||
                    (conditionalValue1 > conditionalValue2 && cellValue < conditionalValue1 && cellValue > conditionalValue2) ||
                    (cellValue == conditionalValue1 && cellValue == conditionalValue2);
                    break;
                case "Not Between":
                    return !((conditionalValue1 < conditionalValue2 && cellValue > conditionalValue1 && cellValue < conditionalValue2) ||
                    (conditionalValue1 > conditionalValue2 && cellValue < conditionalValue1 && cellValue > conditionalValue2) ||
                    (cellValue == conditionalValue1 && cellValue == conditionalValue2));
                    break;
            }
        },

        _appendCssClassName: function (jsonObj) {
            var isVCss,isCCss,index;
            var isRow = true, isRCss = isCCss = isVCss = false, isVal = false, pos = index = -1, val, css, rows, columns, values;
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                    val = "FieldHeader", css = "CssClass", rows = JSON.parse(this.getOlapReport()).PivotRows, columns = JSON.parse(this.getOlapReport()).PivotColumns, values = JSON.parse(this.getOlapReport()).PivotCalculations;
                }
                else {
                    val = "fieldCaption", css = "cssClass", rows = this.model.dataSource.rows, columns = this.model.dataSource.columns, values = this.model.dataSource.values;
                }
                for (var j = 0; j < rows.length && !isRCss; j++) {
                    if (!ej.isNullOrUndefined(rows[j]["cssClass"]))
                        isRCss = true;
                }
                for (var j = 0; j < columns.length && !isCCss; j++) {
                    if (!ej.isNullOrUndefined(columns[j]["cssClass"]))
                        isCCss = true;
                }
                for (var j = 0; j < values.length && !isVCss; j++) {
                    if (!ej.isNullOrUndefined(values[j]["cssClass"]))
                        isVCss = true;
                }
                for (var i = 0; i < jsonObj.length && (isRCss || isCCss || isVCss) ; i++) {
                    for (var j = 0; j < rows.length && isRow && isRCss; j++) {
                        if (!ej.isNullOrUndefined(rows[j][css]) && Number(jsonObj[i].Index.split(",")[0]) == j && jsonObj[i].CSS.indexOf("none") == -1 && jsonObj[i].CSS.indexOf(rows[j][css]) == -1) {
                            jsonObj[i].CSS = jsonObj[i].CSS + " " + rows[j][css];
                        }
                        if (isRow && jsonObj[i].CSS.indexOf("colheader") > -1)
                            isRow = false;
                    }
                    for (var j = 0; j < columns.length && isCCss; j++) {
                        if (!ej.isNullOrUndefined(columns[j][css]) && Number(jsonObj[i].Index.split(",")[1]) == j && jsonObj[i].CSS.indexOf("none") == -1 && jsonObj[i].CSS.indexOf(columns[j][css]) == -1) {
                            jsonObj[i].CSS = jsonObj[i].CSS + " " + columns[j][css];
                        }
                    }
                    for (var j = 0; j < values.length && isVCss; j++) {
                        if (isVal && (jsonObj[i].CSS.indexOf("colheader") > -1 || jsonObj[i].CSS.indexOf("cgtot") > -1 || jsonObj[i].CSS.indexOf("cstot") > -1 || jsonObj[i].CSS.indexOf("gtot") > -1 || jsonObj[i].CSS.indexOf("stot") > -1) && jsonObj[i].CSS.indexOf("calc") == -1)
                            isVal = false;
                        if (values[j][val] == jsonObj[i].Value) {
                            isVal = true;
                            pos = jsonObj[i].Index.split(",")[0];
                            index = j;
                        }
                        if (!ej.isNullOrUndefined(values[j][css]) && isVal && pos == jsonObj[i].Index.split(",")[0] && index == j && jsonObj[i].CSS.indexOf(values[j][css]) == -1) {
                            jsonObj[i].CSS = jsonObj[i].CSS + " " + values[j][css];
                        }
                    }
                }
            }
            return jsonObj;
        },

        _updateReportSettings: function (msg) {
            var JsonRecords = $.map(msg, function (obj, index) { if (obj.Key == "JsonRecords" || obj.Key == "PivotRecords") return obj; });
            var report = $.map(msg, function (obj, index) { if (obj.Key == "PivotReport" || obj.Key == "OlapReport") return obj; });
            var valueSorting = $.map(msg, function (obj, index) { if (obj.Key == "SortColIndex") return obj; });
            this.setJSONRecords(JsonRecords.length > 0 ? JsonRecords[0].Value : null); this.setOlapReport(report[0].Value);
            if (valueSorting.length>0) {
                ej.PivotAnalysis._valueSorting = JSON.parse(valueSorting[0].Value);
                ej.PivotAnalysis._sort = this.model.valueSortSettings.sortOrder;
            }
            else {
                ej.PivotAnalysis._valueSorting = null;
            }
        },
        _updatePageSettings: function (msg, pivotClientObj) {
            var pageSettings = $.map(msg, function (obj, index) { if (obj.Key == "PageSettings") return obj; });
            var headerSettings = $.map(msg, function (obj, index) { if (obj.Key == "HeaderCounts") return obj; });
            if (pageSettings.length > 0 && pivotClientObj._pagerObj != null) {
                pivotClientObj._pagerObj.element.css("opacity", "1");
                pivotClientObj._pagerObj.element.find(".e-pagerTextBox").removeAttr('disabled');
                pivotClientObj._pagerObj._unwireEvents();
                pivotClientObj._pagerObj._wireEvents();
                pivotClientObj._pagerObj.initPagerProperties(JSON.parse(headerSettings[0].Value), JSON.parse(pageSettings[0].Value));
            }
        },
        _removeCells: function (msg) {

            var FilteredColumnHeaders = [];
            var FilteredRowHeaders = [];
            var message = [];
            if (msg[0] != undefined && msg.length > 0) {
                var colHeaders = $.map(msg, function (value) { if (value.Key == "FilteredColumnHeaders") return value; });
                var rowHeaders = $.map(msg, function (value) { if (value.Key == "FilteredRowHeaders") return value; });
                if (colHeaders.length > 0)
                    FilteredColumnHeaders = JSON.parse(colHeaders[0].Value);
                if (rowHeaders.length > 0)
                    FilteredRowHeaders = JSON.parse(rowHeaders[0].Value);
            }
            else if (msg.d != undefined) {
                var colHeaders = $.map(msg.d, function (value) { if (value.Key == "FilteredColumnHeaders") return value; });
                var rowHeaders = $.map(msg.d, function (value) { if (value.Key == "FilteredRowHeaders") return value; });
                if (colHeaders.length > 0)
                    FilteredColumnHeaders = JSON.parse(colHeaders[0].Value);
                if (rowHeaders.length > 0)
                    FilteredRowHeaders = JSON.parse(rowHeaders[0].Value);
            }
            else {
                if (msg.FilteredColumnHeaders)
                    FilteredColumnHeaders = JSON.parse(msg.FilteredColumnHeaders);
                if (msg.FilteredRowHeaders)
                    FilteredRowHeaders = JSON.parse(msg.FilteredRowHeaders);
            }
            if (FilteredColumnHeaders.length > 0) {
                var hiddenCells = FilteredColumnHeaders;
                for (var i = 0; i < hiddenCells.length; i++) {
                    for (var j = hiddenCells[i].From; j <= hiddenCells[i].To; j++) {
                        for (var rc = hiddenCells[i].Level; rc < this._rowCount; rc++)
                            this.element.find(".e-pivotGridTable  [data-p='" + (j) + "," + rc + "']").remove();
                    }
                }
                var rowHeaders = this.element.find(".e-pivotGridTable thead").children();
                for (var rw = (rowHeaders.length - 2) ; rw >= 0 ; rw--) {
                    var vsHeaders = ($(rowHeaders[rw]).find("th.colheader:visible"));
                    for (var rH = 0 ; rH <= vsHeaders.length - 1; rH++) {
                        var thColSpan = $(vsHeaders[rH]).attr("colSpan");
                        for (var rc = 0; rc <= (parseInt($(vsHeaders[rH]).attr("colSpan")) - 1) ; rc++) {
                            var colNav = parseInt($(vsHeaders[rH]).attr("data-p").split(",")[0]) + rc;
                            var visibleCells = (this.element.find(".e-pivotGridTable  [data-p='" + colNav + "," + (rw + 1) + "']:visible"));
                            if (!($(visibleCells).length > 0))
                                thColSpan--;
                            else
                                thColSpan = parseInt(thColSpan) + ($(visibleCells).attr("colspan") ? parseInt($(visibleCells).attr("colspan")) - 1 : 0);
                        }
                        if (thColSpan == 0 && $(vsHeaders[rH]).nextAll(".summary.stot:eq(0)").length > 0) {
                            var rowHeadCells = $(vsHeaders[rH]).nextAll(".summary.stot:eq(0)").attr("data-p").split(",")[0];
                            var hiddenSpanCells = [], hiddenCells = [];
                            for (var rc = 0; rc < this._rowCount; rc++) {
                                var selector = "[data-p='" + parseInt(rowHeadCells) + "," + rc + "'] ";
                                hiddenCells.push(selector);

                                if (this._JSONRecords[parseInt(rowHeadCells) * this._rowCount + rc].ColSpan > 1) {
                                    if (this.element.find(".e-pivotGridTable [data-p='" + parseInt(rowHeadCells) + "," + rc + "']:visible").length > 0) {
                                        for (var st = 1; st <= (this._JSONRecords[parseInt(rowHeadCells) * this._rowCount + rc].ColSpan - 1) ; st++) {
                                            hiddenSpanCells.push(parseInt(rowHeadCells) + st);
                                        }
                                    }
                                }
                                for (hc = 0; hc < hiddenSpanCells.length; hc++)
                                    selector += ", [data-p='" + (hiddenSpanCells[hc]) + "," + rc + "'] ";
                                this.element.find(".e-pivotGridTable " + selector).remove();
                            }
                        }
                        if (ej.isNullOrUndefined($(vsHeaders[rH]).attr("vfColSpan")))
                            $(vsHeaders[rH]).attr("vfColSpan", $(vsHeaders[rH]).attr("colSpan"));
                        $(vsHeaders[rH]).attr("colSpan", thColSpan);
                    }
                }
                this.element.find(".colheader[colspan='0']:not(.gtot,.calc)").remove();
            }
            if (FilteredRowHeaders.length > 0) {
                {
                    var hiddenCells = FilteredRowHeaders, colInd = parseInt(this.element.find(".e-pivotGridTable td:eq(0)").attr("data-p").split(",")[0]) - 2;
                    for (var i = 0; i < hiddenCells.length; i++) {
                        for (var j = hiddenCells[i].From; j <= hiddenCells[i].To; j++) {
                            this.element.find(".e-pivotGridTable tr:eq(" + j + ") th:last").css("display", "none");
                            this.element.find(".e-pivotGridTable tr:eq(" + j + ") td").css("display", "none");
                        }
                    }
                    for (var k = colInd; k >= 0; k--) {
                        var rowHeaderVisibleCells = this.element.find(".e-pivotGridTable tbody").find((" .rowheader[data-p^='" + k + ",'] :visible")); //$(".e-pivotGridTable tbody").find((" [data-p^='" + colInd + ",'] :visible"));
                        var rowHeaderCells = this.element.find(".e-pivotGridTable th.rowheader").parent();
                        for (var ce = 0; ce <= rowHeaderVisibleCells.length; ce++) {
                            var th = $(rowHeaderVisibleCells[ce]).parent(), rowSpan = parseInt(th.attr("rowSpan")), pTag = th.attr("data-p");
                            if (pTag) {
                                var rowIndex = parseInt(pTag.split(",")[1]), colIndex = parseInt(pTag.split(",")[0]), spanInfo = 0;
                                for (var cc = rowIndex; cc <= (rowIndex + rowSpan) ; cc++) {
                                    var cellData = rowHeaderCells.children(" [data-p='" + (k + 1) + "," + cc + "']");
                                    if (cellData.length > 0 && !cellData.is(":visible"))
                                        spanInfo = spanInfo + parseInt(cellData.attr("rowSpan")) + ((cellData.next("th.rowheader").length > 0 || parseInt(cellData.attr("rowSpan")) > 1) ? 1 : 0);
                                }
                                if (spanInfo == rowSpan)
                                th.css("display", "none");
                            }
                        }
                    }
                    for (var k = 0; k < $(this.element.find(".summary.stot")).length; k++) {
                        if ($(this.element.find(".summary.stot")[k]).nextAll().text() == "") {
                            $(this.element.find(".summary.stot")[k]).css("display", "none");
                            $(this.element.find(".summary.stot")[k]).nextAll().css("display", "none");
                        }
                    }
                }
            }
            if (this.model.enableGroupingBar)
                this._createFields(null, $("#" + this._id).find(".e-pivotGridTable").width(), $("#" + this._id).find(".e-pivotGridTable th").outerWidth());
        },

        saveXMLReport: function (fileName, url) {
            var report = JSON.parse(this.getOlapReport()).Report;
            var params = {
                clientReports: report,
                fileName: fileName
            };
            this.doPostBack(url, params);
        },

        _reportModelUpdate: function (report) {
            if (!ej.isNullOrUndefined(report)) {
                this.model.enableGrandTotal = report.ShowGrandTotals;
                this.model.enableCollapseByDefault = report.enableCollapseByDefault;
                if (!report.ShowSubTotals) {
                    $.each(report.PivotRows, function (e, item) { item["showSubTotal"] = false; });
                    $.each(report.PivotColumns, function (e, item) { item["showSubTotal"] = false; });
                }
                this.setOlapReport(JSON.stringify(report));
                this.model.enableColumnResizing = report.AllowResizeColumns;
                this.model.resizeColumnsToFit = report.ResizePivotGridToFit;
                this.model.enableCellSelection = report.AllowSelection;
                this.model.enableDeferUpdate = report.DeferLayoutUpdate;
                this.model.frozenHeaderSettings.enableFrozenHeaders = report.FreezeHeaders;
                this.model.enableGroupingBar = report.ShowGroupingBar;
                this.model.enablePivotFieldList = report.ShowFieldList;
                this.model.collapsedMembers = {};
                this.model._isXMLImport = false;
            }
        },

        _renderControlSuccess: function (msg) {
            try {
                if (msg[0] != undefined && msg.length > 0) {
                    this._updateReportSettings(msg)
                    if (msg[2] != null && msg[2] != undefined && msg[2].Key == "PageSettings") {
                        if (this.model.enableVirtualScrolling || ((!ej.isNullOrUndefined(this._pivotClientObj)) && this._pivotClientObj.model.enableVirtualScrolling)) {
                            this._categPageCount = Math.ceil(JSON.parse(msg[3].Value).Column / JSON.parse(msg[2].Value).CategoricalPageSize);
                            this._seriesPageCount = Math.ceil(JSON.parse(msg[3].Value).Row / JSON.parse(msg[2].Value).SeriesPageSize);
                            this._categCurrentPage = JSON.parse(msg[2].Value).CategoricalCurrentPage;
                            this._seriesCurrentPage = JSON.parse(msg[2].Value).SeriesPageSize;
                        }
                        else if ($(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined && this._pagerObj!=null)
                            this._pagerObj.initPagerProperties(JSON.parse(msg[3].Value), JSON.parse(msg[2].Value));
                        if (!ej.isNullOrUndefined(msg[4])) {
                            if (msg[4].Key == "DataSet") {
                                this._dataSet = msg[4].Value;
                                if (!ej.isNullOrUndefined(msg[5]))
                                    this.model.customObject = msg[5].Value;
                            }
                            else
                                this.model.customObject = msg[4].Value;
                        }
                    }
                    if (!ej.isNullOrUndefined(msg[2]) && msg[2].Key != "PageSettings") {
                        if (msg[2].Key == "DataSet") {
                            this._dataSet = msg[2].Value;
                            if (!ej.isNullOrUndefined([3]))
                                this.model.customObject = msg[3].Value;
                        }
                        else
                            this.model.customObject = msg[2].Value;
                    }
                    if ((!ej.isNullOrUndefined(this._pivotClientObj)) && this._pivotClientObj._pagerObj != null) {
                        this._updatePageSettings(msg, this._pivotClientObj)
                    }
                }
                else if (msg.d != undefined && msg.d.length > 0) {
                        this._updateReportSettings(msg.d);
                    if (msg.d[2] != null && msg.d[2] != undefined && msg.d[2].Key == "PageSettings") {
                        if (this.model.enableVirtualScrolling || ((!ej.isNullOrUndefined(this._pivotClientObj)) && this._pivotClientObj.model.enableVirtualScrolling)) {
                            this._categPageCount = Math.ceil(JSON.parse(msg.d[3].Value).Column / JSON.parse(msg.d[2].Value).CategoricalPageSize);
                            this._seriesPageCount = Math.ceil(JSON.parse(msg.d[3].Value).Row / JSON.parse(msg.d[2].Value).SeriesPageSize);
                            this._categCurrentPage = JSON.parse(msg.d[2].Value).CategoricalCurrentPage;
                            this._seriesCurrentPage = JSON.parse(msg.d[2].Value).SeriesCurrentPage;
                        }
                        else if (this._pagerObj !=null && $(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined)
                            this._pagerObj.initPagerProperties(JSON.parse(msg.d[3].Value), JSON.parse(msg.d[2].Value));
                        if (!ej.isNullOrUndefined(msg.d[4])) {
                            if (msg.d[4].Key == "DataSet") {
                                this._dataSet = msg.d[4].Value;
                                if (!ej.isNullOrUndefined(msg.d[5]))
                                    this.model.customObject = msg.d[5].Value;
                            }
                            else
                                this.model.customObject = msg.d[4].Value;
                        }
                        if ((!ej.isNullOrUndefined(this._pivotClientObj)) && this._pivotClientObj._pagerObj != null) {
                            this._updatePageSettings(msg.d, this._pivotClientObj);
                        }
                    }
                    else if ((!ej.isNullOrUndefined(this._pivotClientObj)) && this._pivotClientObj._pagerObj != null && (msg.d.length == 2)) {
                        this._pivotClientObj._pagerObj.element.css("opacity", "0.5");
                        this._pivotClientObj._pagerObj.element.find(".e-pagerTextBox").attr('disabled', 'disabled');
                        this._pivotClientObj._pagerObj._unwireEvents();
                    }
                    if (!ej.isNullOrUndefined(msg[2]) && msg.d[2].Key != "PageSettings") {
                        if (msg.d[2].Key == "DataSet") {
                            this._dataSet = msg.d[2].Value;
                            if (!ej.isNullOrUndefined([3]))
                                this.model.customObject = msg.d[3].Value;
                        }
                        else
                            this.model.customObject = msg.d[2].Value;
                    }
                }
                else if (!ej.isNullOrUndefined(msg) && ej.isNullOrUndefined(msg.d)) {
                    if (msg.SortColIndex != undefined) {
                        ej.PivotAnalysis._valueSorting = JSON.parse(msg.SortColIndex)[0];
                        ej.PivotAnalysis._sort = this.model.valueSortSettings.sortOrder;
                    }
                    else {
                        ej.PivotAnalysis._valueSorting = null;
                    }
                    if (msg.PivotRecords != undefined) {
                        this.setJSONRecords(msg.PivotRecords); this.setOlapReport(msg.OlapReport);
                        if (msg.HeaderCounts != undefined && (this.model.enableVirtualScrolling || (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj.model.enableVirtualScrolling))) {
                            this._categPageCount = Math.ceil(JSON.parse(msg.HeaderCounts).Column / JSON.parse(msg.PageSettings).CategoricalPageSize);
                            this._seriesPageCount = Math.ceil(JSON.parse(msg.HeaderCounts).Row / JSON.parse(msg.PageSettings).SeriesPageSize);
                            this._categCurrentPage = JSON.parse(msg.PageSettings).CategoricalCurrentPage;
                            this._seriesCurrentPage = JSON.parse(msg.PageSettings).SeriesCurrentPage;
                        }
                        else if (msg.HeaderCounts != undefined && this._pagerObj != null && $(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined)
                            this._pagerObj.initPagerProperties(JSON.parse(msg.HeaderCounts), JSON.parse(msg.PageSettings));
                        else if (msg.HeaderCounts != undefined && (!ej.isNullOrUndefined(this._pivotClientObj)) && this._pivotClientObj._pagerObj != null)
                            this._pivotClientObj._pagerObj.initPagerProperties(JSON.parse(msg.HeaderCounts), JSON.parse(msg.PageSettings));
                    }
                    else if (msg.JsonRecords != undefined && this.model.enableJSONRendering == true) {
                        this.setJSONRecords(JSON.stringify(msg.JsonRecords)); this.setOlapReport(JSON.stringify(msg.PivotReport));
                        if (msg.DataSet != null) this._dataSet = msg.DataSet;
                    }
                    else if (msg.JsonRecords != undefined) {
                        this.setJSONRecords(msg.JsonRecords); this.setOlapReport(msg.PivotReport);
                        if (msg.DataSet != null) this._dataSet = msg.DataSet;
                    }
                    else if (msg.JsonRecords == undefined) {
                        this.setJSONRecords(null);
                        if (msg.PivotReport)
                            this.setOlapReport(msg.PivotReport);
                        if (msg.OlapReport)
                            this.setOlapReport(msg.OlapReport);
                    }
                    if (msg.isXMLLoad != undefined)
                        this.model._isXMLImport = msg.isXMLLoad;
                    if (msg.customObject != null && msg.customObject != undefined)
                        this.model.customObject = msg.customObject;
                }
                if (ej.isNullOrUndefined(this.getJSONRecords()) && !ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj.model.enablePaging) {
                    var pageSettings = { CategoricalCurrentPage: 1, CategoricalPageSize: 1, SeriesCurrentPage: 1, SeriesPageSize: 1 };
                    var headerCount = { Column: 1, Row: 1 };
                    this._pivotClientObj._pagerObj.initPagerProperties(headerCount, pageSettings);
                }
                if (this.model.enableVirtualScrolling || ($(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined))
                    this.layout("nosummaries");
                if (this.getOlapReport() != undefined && this.getOlapReport() != "" && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                    try {
                        if (!ej.isNullOrUndefined(JSON.parse(this.getOlapReport()).DataModel))
                            this.model.analysisMode = JSON.parse(this.getOlapReport()).DataModel == "Olap" ? ej.Pivot.AnalysisMode.Olap : ej.Pivot.AnalysisMode.Pivot;
                        if (!ej.isNullOrUndefined(JSON.parse(this.getOlapReport()).PagerOptions) && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && (this.model.enablePaging || this.model.enableVirtualScrolling)) {
                            this._categPageCount = this.model.enablePaging ? JSON.parse(this.getOlapReport()).PagerOptions.CategoricalPageCount : Math.ceil(JSON.parse(this.getOlapReport()).PagerOptions.CategoricalPageCount / JSON.parse(this.getOlapReport()).PagerOptions.CategoricalPageSize);
                            this._seriesPageCount = this.model.enablePaging ? JSON.parse(this.getOlapReport()).PagerOptions.SeriesPageCount : Math.ceil(JSON.parse(this.getOlapReport()).PagerOptions.SeriesPageCount / JSON.parse(this.getOlapReport()).PagerOptions.SeriesPageSize);
                            this.model.dataSource.pagerOptions.categoricalPageSize = JSON.parse(this.getOlapReport()).PagerOptions.CategoricalPageSize;
                            this.model.dataSource.pagerOptions.seriesPageSize = JSON.parse(this.getOlapReport()).PagerOptions.SeriesPageSize;
                            this.model.dataSource.pagerOptions.categoricalCurrentPage = JSON.parse(this.getOlapReport()).PagerOptions.CategoricalCurrentPage;
                            this.model.dataSource.pagerOptions.seriesCurrentPage = JSON.parse(this.getOlapReport()).PagerOptions.SeriesCurrentPage;
                        }
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this._pagerObj != null) {
                            var _this = this;
                            var timer = setInterval(function () {
                                clearInterval(timer);
                                var pageSettings = { CategoricalCurrentPage: _this.model.dataSource.pagerOptions.categoricalCurrentPage, CategoricalPageSize: _this.model.dataSource.pagerOptions.categoricalPageSize, SeriesCurrentPage: _this.model.dataSource.pagerOptions.seriesCurrentPage, SeriesPageSize: _this.model.dataSource.pagerOptions.seriesPageSize };
                                var headerCount = { Column: _this._categPageCount, Row: _this._seriesPageCount };
                                _this._pagerObj.element.css("opacity", "1");
                                _this._pagerObj.element.find(".e-pagerTextBox").removeAttr('disabled');
                                _this._pagerObj._unwireEvents();
                                _this._pagerObj._wireEvents();
                                _this._pagerObj.initPagerProperties(headerCount, pageSettings);
                            }, 10);
                        }
                    }
                    catch (err) {
                    }
                }
                if (msg.isXMLLoad != undefined && msg.isXMLLoad)
                    this._reportModelUpdate(ej.isNullOrUndefined(this.getOlapReport()) ? null : JSON.parse(this.getOlapReport()));
                if (this.model.enableGroupingBar == true) {
                    var report = JSON.parse(this.getOlapReport());
                    var itemProp = ej.isNullOrUndefined(report.ItemsProperties) ? [] : JSON.parse(report.ItemsProperties);
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                        var items = report.PivotRows.concat(report.PivotColumns, report.PivotCalculations, report.Filters);
                        var itemProps = $.grep(itemProp, function (value) { $.grep(items, function (field) { if (value.id == (field.FieldHeader || field.DimensionHeader)) value.id = (field.FieldName || field.DimensionName); }); return value; });
                        this._pivotTableFields = itemProps;
                    }
                    else
                        this._pivotTableFields = itemProp;
                    this._createGroupingBar(report);
                }
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    var report = JSON.parse(this.getOlapReport());
                    for (var i = 0; i < report.PivotCalculations.length; i++) {
                        if (report.PivotCalculations[i].CalculationType == 8 || report.PivotCalculations[i].CalculationType == "Formula") {
                            if ($.grep(this._calculatedField, function (field) { return field.name == report.PivotCalculations[i].FieldName; }).length == 0)
                                this._calculatedField.push({ name: report.PivotCalculations[i].FieldName, formula: report.PivotCalculations[i].Formula });
                        }
                    }
                }
                if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                    this._trigger("afterServiceInvoke", { action: "initialize", element: this.element, customObject: this.model.customObject });
                if (this.getJSONRecords() != null && this.getJSONRecords().length > 0) {
                    if (this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout && this.model.enableVirtualScrolling == false && $(".e-pivotpager")[0] == null)
                        this.excelLikeLayout(this.getJSONRecords());
                    else
                    this.renderControlFromJSON(this.getJSONRecords());
                }
                else
                    this.renderControlFromJSON("");
                var pivotClientObj = ($(this.element).parents(".e-pivotclient").length > 0) ? $(this.element).parents(".e-pivotclient").data("ejPivotClient") : null;
                if (!ej.isNullOrUndefined(pivotClientObj)) pivotClientObj._isTimeOut = false;
                if (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj._waitingPopup != null) {
                    if ($("#" + this._pivotClientObj._id + "_maxView")[0] && this._maxViewLoading) {
                        this._maxViewLoading.hide();
                    }
                    else
                        this._pivotClientObj._waitingPopup.hide();
                }
                else
                    this._waitingPopup.hide();
                if (!ej.isNullOrUndefined(this._schemaData))
                    this._schemaData.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
            }
            catch (err) {
            }
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this._calculatedField.length > 0 && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && this._schemaData != null)
                this._schemaButtonCreate();
            var eventArgs = { action: "initialize", customObject: this.model.customObject, element: this.element };
            this._trigger("renderSuccess", eventArgs);
            if (!ej.isNullOrUndefined(msg.Exception)) {
                ej.Pivot._createErrorDialog(msg, "Exception", this);
            }
            if (this.model.enableAdvancedFilter && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                this._removeCells(msg);
        },

        _hideGrandTotal: function (tableGrid) {
            var frozenHeaderColTable = tableGrid.find(".pivotGridFrozenTable");
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                if ((!this.model.enableRowGrandTotal || !this.model.enableGrandTotal)) {
                    if (this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders)
                        tableGrid.find(".valueCell tr:last,.rowhead tr:last").hide();
                    if (tableGrid.find("tbody").children().length > 0) {
                        if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                            tableGrid.find("tr:last .gtot").parent().hide();
                        else
                            tableGrid.find("tr:last .rgtot").parent().hide();
                    }
                }
                if ((tableGrid.find("tr:first th.summary").attr("data-p") != undefined || tableGrid.find(".pivotGridFrozenTable tr:first td.summary").attr("data-p") != undefined) && (!this.model.enableColumnGrandTotal || !this.model.enableGrandTotal) && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    var calcGTTh = [];
                    if (this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders) {
                        calcGTTh = (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? frozenHeaderColTable.find(".gtot[role^='columnheader']") : frozenHeaderColTable.find(".cgtot[role^='columnheader']"));
                    }
                    else
                        calcGTTh = (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? tableGrid.find("th.gtot[role^='columnheader']") : tableGrid.find("th.cgtot[role^='columnheader']"));
                    for (cLen = 0; cLen < calcGTTh.length; cLen++) {
                        tableGrid.find("[data-p^=\"" + (parseInt($(calcGTTh[cLen]).attr("data-p").split(",")[0])) + ",\"]").hide();
                        tableGrid.find("[data-p^=\"" + (parseInt($(calcGTTh[cLen]).attr("data-p").split(",")[0])) + ",\"]").hide();
                    }
                }
            }
            else {
                if (this.model.layout == "normal") {
                    var isCheckSum = true, count = 0, gTotCells;
                    if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode || this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        if (!this.model.enableColumnGrandTotal || !this.model.enableGrandTotal) {
                            rwLen = ($(tableGrid).find("thead tr").length || $(tableGrid).find(".pivotGridFrozenTable tr").length);
                            if (rwLen > 1 || (rwLen == 1 && $(tableGrid).find("th.summary[data-p$='," + count + "']").length > 0)) {
                                while (isCheckSum) {
                                    gTotCells = (this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders) ? $(tableGrid).find("td.summary[data-p$='," + count + "']") : $(tableGrid).find("th.summary[data-p$='," + count + "']");
                                    if (gTotCells.length)
                                        isCheckSum = false;
                                         count++;
                                }
                                for (var p = 0; p < gTotCells.length; p++) {
                                    var cnt = count, cols = 0, colcel;
                                    var selectedCell = gTotCells[p]; selectedCellPos = $(selectedCell).attr('data-p'), i = parseInt(selectedCellPos.split(',')[1]) - 1;
                                    var colspn = $(selectedCell).attr("colspan");
                                    var rowLen = $(tableGrid).find("thead tr").length + $(tableGrid).find("tbody tr").length;
                                    for (var cl = 0; cl < parseInt(colspn) ; cl++) {
                                        $(tableGrid).find(" [data-p^='" + (parseInt(selectedCellPos.split(',')[0]) + cl) + ",']").css("display", "none");
                                    }
                                    for (var s = 0; s < rwLen; s++) {
                                        if (this.model.frozenHeaderSettings.enableFrozenHeaders) {
                                            if ($(frozenHeaderColTable).find("tr:eq(" + s + ") td").length == 1) {
                                                var currentColspan = $(frozenHeaderColTable).find(" tr:eq(" + s + ") td").attr("colspan");
                                                $(frozenHeaderColTable).find(" tr:eq(" + s + ") td").attr("colspan", parseInt(currentColspan) - parseInt(colspn));
                                            }
                                        }
                                        else if ($(tableGrid).find("thead tr:eq(" + s + ") th").length == 1) {
                                            var currentColspan = $(tableGrid).find("thead tr:eq(" + s + ") th").attr("colspan");
                                            $(tableGrid).find("thead tr:eq(" + s + ") th").attr("colspan", parseInt(currentColspan) - parseInt(colspn))
                                        }
                                    }
                                    if (i >= 0) {
                                        var cell = $(tableGrid).find(" [data-p^='" + selectedCellPos.split(',')[0] + "," + i + "']")[0];
                                        while (cnt > 1) {
                                            if (ej.isNullOrUndefined(cell)) {
                                                for (i = parseInt(selectedCellPos.split(',')[1]) - 1; i >= 0; i--) {
                                                    var currentCell = $(tableGrid).find("[data-p='" + selectedCellPos.split(',')[0] + "," + i + "']")[0];
                                                    if (ej.isNullOrUndefined(currentCell)) {
                                                        for (k = parseInt(selectedCellPos.split(',')[0]) - 1; k >= 0; k--) {
                                                            if (ej.isNullOrUndefined(currentCell)) {
                                                                currentCell = $(tableGrid).find("[data-p='" + k + "," + i + "']")[0];
                                                            }
                                                        }
                                                    }
                                                    if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                                                    {
                                                        set_spn = parseInt($(currentCell).attr("colspan")) - parseInt(colspn);
                                                        $(currentCell).attr("colspan", set_spn)
                                                    }
                                                }
                                            }
                                            if (!ej.isNullOrUndefined(currentCell))
                                                cnt--;
                                        }
                                    }
                                }
                            }
                        }
                        isCheckSum = true, count = 0, gTotCells = "";
                        if (!this.model.enableRowGrandTotal || !this.model.enableGrandTotal) {
                            var isFrozenEnabled = this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders;
                            rwLen = $(tableGrid).find("tbody tr").length;
                            if (rwLen > 1 || (rwLen == 1 && $(tableGrid).find(isFrozenEnabled ? "" : "th" + "[data-p^='" + count + ",']") == "summary")) {
                                rwLen = $(tableGrid).find("tbody tr").length;
                                while (isCheckSum) {
                                    gTotCells = (isFrozenEnabled) ? $(tableGrid).find("td.summary[data-p^='" + count + ",']") : $(tableGrid).find("th.summary[data-p^='" + count + ",']");
                                    if (gTotCells.length)
                                        isCheckSum = false;
                                          count++;
                                 }
                            }
                            if (rwLen > 0) {
                                for (var p = 0; p < gTotCells.length; p++) {
                                    var cnt = count;
                                    var selectedCell = gTotCells[p]; selectedCellPos = $(selectedCell).attr('data-p'), i = parseInt(selectedCellPos.split(',')[0]) - 1;
                                    var rwspn = $(selectedCell).attr("rowspan");
                                    var row = $(selectedCell).parent();
                                    for (var rl = 0; rl < selectedCell.rowSpan; rl++) {
                                        $(row).css("display", "none");
                                        if (isFrozenEnabled)
                                            $(tableGrid).find(".pivotGridValueTable tr:eq(" + $(row).index() + ")").css("display", "none");
                                        row = $(row).next();
                                    }
                                    if (i >= 0) {
                                        var cell = $(tableGrid).find(" [data-p^='" + i + "," + selectedCellPos.split(',')[1] + "']")[0];
                                        while (cnt > 1) {
                                            if (ej.isNullOrUndefined(cell)) {
                                                for (i = parseInt(selectedCellPos.split(',')[0]) - 1; i >= 0; i--) {
                                                    var currentCell = $(tableGrid).find("[data-p='" + i + "," + selectedCellPos.split(',')[1] + "']")[0];
                                                    if (ej.isNullOrUndefined(currentCell)) {
                                                        for (k = parseInt(selectedCellPos.split(',')[1]) - 1; k >= 0; k--) {
                                                            if (ej.isNullOrUndefined(currentCell)) {
                                                                currentCell = $(tableGrid).find("[data-p='" + i + "," + k + "']")[0];
                                                            }
                                                        }
                                                    }
                                                    if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                                                    {
                                                        set_spn = parseInt($(currentCell).attr("rowspan")) - parseInt(rwspn);
                                                        $(currentCell).attr("rowspan", set_spn)
                                                    }
                                                }
                                            }
                                            if (!ej.isNullOrUndefined(currentCell))
                                                cnt--;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        _hideSubTotal: function (gridTable, targetLoop, target) {
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                var rowData = this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? this.model.dataSource.rows : (this.element.parents(".e-pivotclient").length > 0 ? JSON.parse(this._pivotClientObj.getOlapReport()).PivotRows : JSON.parse(this.getOlapReport()).PivotRows), subThs;
                var columnData = this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? this.model.dataSource.columns : (this.element.parents(".e-pivotclient").length > 0 ? JSON.parse(this._pivotClientObj.getOlapReport()).PivotColumns : JSON.parse(this.getOlapReport()).PivotColumns);
                if (!ej.isNullOrUndefined(rowData)) {
                    for (var i = 0; i < rowData.length; i++) {
                        if (rowData[i].showSubTotal == false) {
                            var rowIndex = i.toString();
                            if ($(gridTable).attr("role") == "row" && $(gridTable).parent().is("tbody")) {
                                if (($(gridTable).find(".stot,.rstot").length == 0 || (this._isSubTotalhidden && $(gridTable).find(".stot,.rstot").find(".e-expand").length >= 1)) || ($(gridTable).find(".stot,.rstot").attr("data-p").split(",")[0] == rowIndex && (targetLoop == 1 && ($(gridTable).find(".stot,.rstot").find(".e-expand").length >= 1))))
                                    break;
                                else if ($(gridTable).find(".stot,.rstot").attr("data-p").split(",")[0] == rowIndex) {
                                    if ($(target).parent().attr("data-p").split(",")[0] == rowIndex)
                                        this._isSubTotalhidden = true;
                                    this._isSubTotalHide = true;
                                    break;
                                }
                            }
                            else if ($(gridTable).find("tbody").length > 0) {
                                subThs = this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? gridTable.find(".summary.rstot[data-p^=\"" + i + ",\"]") : gridTable.find(".summary.stot[data-p^=\"" + i + ",\"]");
                                if (subThs.length > 0)
                                    for (var j = 0; j < subThs.length; j++) {
                                        var thHide = $(subThs[j]).closest("tr");
                                        var positionTh = $(thHide).find(".stot,.rstot").attr("data-p"), cnt = parseInt(positionTh.split(',')[0]) - 1;
                                        var rowSpan = parseInt($(thHide).find(".stot,.rstot").attr("rowspan"));
                                        $(thHide).css("display", "none");
                                        if (this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders)
                                            $(gridTable).find(".valueCell td[data-p$='," + positionTh.split(',')[1] + "']").closest("tr").css("display", "none");
                                        var lnt = parseInt(positionTh.split(',')[1]);
                                        while (cnt >= 0) {
                                            var currentCell = null;
                                            while (ej.isNullOrUndefined(currentCell) && lnt >= 0) {
                                                currentCell = $(gridTable).find("[data-p='" + cnt + "," + lnt + "']")[0];
                                                if (!ej.isNullOrUndefined(currentCell) && $($(currentCell).closest("tr")[0]).css("display") != "none" && $(currentCell).hasClass("rowheader") && $(currentCell).attr('role') == "rowheader") {
                                                    if (parseInt($(currentCell).attr("data-p").split(",")[0]) < parseInt(positionTh.split(",")[0]) && (parseInt($(currentCell).attr("data-p").split(",")[1]) + currentCell.rowSpan + ($(currentCell).find("span").attr("data-tag") != undefined ? parseInt($(currentCell).find("span").attr("data-tag")) : 0)) >= (parseInt(positionTh.split(",")[1]) + rowSpan)) {
                                                        currentCell.rowSpan -= 1;
                                                        $(currentCell).find("span").attr("data-tag", $(currentCell).find("span").attr("data-tag") != undefined ? (parseInt($(currentCell).find("span").attr("data-tag")) + (1)) : 1);
                                                        break;
                                                    }
                                                }
                                                lnt--;
                                            }
                                            cnt--;
                                        }
                                    }
                            }
                        }
                    }
                }
                if (!ej.isNullOrUndefined(columnData)) {
                    for (var i = 0; i < columnData.length; i++) {
                        if (columnData[i].showSubTotal == false) {
                            var columnIndex = i.toString()
                            if (($(gridTable).hasClass("stot") || $(gridTable).hasClass("cstot")) && $(gridTable).attr("role") == "columnheader") {
                                if ((this._isSubTotalhidden && $(gridTable).find(".stot,.cstot").find(".e-expand").length >= 1) || ($(gridTable).attr("data-p").split(",")[1] == columnIndex && (targetLoop == 1 && ($(gridTable).find(".e-expand").length >= 1))))
                                    break;
                                else if ($(gridTable).attr("data-p").split(",")[1] == columnIndex) {
                                    this._isSubTotalhidden = this._isSubTotalHide = true;
                                    break;
                                }
                            }
                            else if ($(gridTable).attr("role") == "row" && ((this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders) ? ($(gridTable).parent().is("tbody") || $(gridTable).parent().is("thead")) : $(gridTable).parent().is("thead"))) {
                                if (($(gridTable).find(".stot,.cstot").length == 0 || (this._isSubTotalhidden && $(gridTable).find(".stot,.cstot").find(".e-expand").length >= 1)) || ($(gridTable).find(".stot,.cstot").attr("data-p").split(",")[1] == columnIndex && (targetLoop == 1 && ($(gridTable).find(".stot,.cstot").find(".e-expand").length >= 1))))
                                    break;
                                else if ($(gridTable).find(".stot,.cstot").attr("data-p").split(",")[1] == columnIndex) {
                                    this._isSubTotalhidden = this._isSubTotalHide = true;
                                    break;
                                }
                            }
                            else if (($(gridTable).find("thead").length > 0 || $(gridTable).find(".colhead").length > 0)) {
                                subThs = this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? ((this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders) ? gridTable.find("td.summary.cstot[data-p$=\"," + i + "\"]") : gridTable.find("th.summary.cstot[data-p$=\"," + i + "\"]")) : ((this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders) ? gridTable.find("td.summary.stot[data-p$=\"," + i + "\"]") : gridTable.find("th.summary.stot[data-p$=\"," + i + "\"]"));
                                if (subThs.length > 0) {
                                    var colsTotal = subThs;
                                    for (var k = 0; k < colsTotal.length; k++) {
                                        var hideTh = $(colsTotal[k]), pGridTb = $(gridTable), positionTh = $(colsTotal[k]).attr("data-p"), row = $(colsTotal[k]).closest("tr")[0], tdPosVal = parseInt(positionTh.split(",")[0]), rowSpan = parseInt($(colsTotal[k]).attr("rowspan")), colsSpan = parseInt($(colsTotal[k]).attr("colspan")), lnt = parseInt(positionTh.split(',')[1]) - 1;;
                                        for (var cCount = 0; cCount < colsSpan; cCount++) {
                                            var thList = $(row).nextAll().find("[data-p^='" + (cCount + tdPosVal) + ",']");
                                            for (var thCnt = 0; thCnt < $(thList).length; thCnt++) {
                                                $(thList[thCnt]).css("display", "none");
                                            }
                                            if ($(thList[thCnt]).attr("data-hc") == undefined || parseInt($(thList[thCnt]).attr("data-hc")) < 1) {
                                                $(pGridTb).find("[data-p^='" + (cCount + tdPosVal) + ",']").css("display", "none");
                                                $(pGridTb).find("[data-p^='0,']:not(.summary)").parent().find("td[data-p^='" + (cCount + tdPosVal) + ",']").attr("data-ch", 1);
                                            }
                                        }
                                        $(hideTh).css("display", "none");
                                        var cnt = parseInt(positionTh.split(',')[0]);
                                        while (lnt >= 0) {
                                            var currentCell = null;
                                            while (ej.isNullOrUndefined(currentCell) && cnt >= 0) {
                                                currentCell = $(gridTable).find("[data-p='" + cnt + "," + lnt + "']")[0];
                                                if (!ej.isNullOrUndefined(currentCell) && $($(currentCell).closest("tr")[0]).css("display") != "none" && $(currentCell).hasClass("colheader") && $(currentCell).attr('role') == "columnheader") {
                                                    if ((parseInt($(currentCell).attr("data-p").split(",")[1]) < parseInt(positionTh.split(",")[1]) && parseInt($(currentCell).attr("data-p").split(",")[0]) <= parseInt(positionTh.split(",")[0])) && (parseInt($(currentCell).attr("data-p").split(",")[0]) + currentCell.colSpan + ($(currentCell).find("span").attr("data-tag") != undefined ? parseInt($(currentCell).find("span").attr("data-tag")) : 0)) >= (parseInt(positionTh.split(",")[0]) + colsSpan)) {
                                                        currentCell.colSpan -= colsSpan;
                                                        $(currentCell).find("span").attr("data-tag", $(currentCell).find("span").attr("data-tag") != undefined ? (parseInt($(currentCell).find("span").attr("data-tag")) + (colsSpan)) : colsSpan);
                                                        break;
                                                    }
                                                }
                                                cnt--;
                                            }
                                            lnt--;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
       },

        _filterReport: function (report) {
            for (var i = 0; i < report.Filters.length; i++) {
                if (report.PivotColumns.length >= 1) {
                    for (var j = 0; j < report.PivotColumns.length; j++) {
                        if (report.Filters.length != 0 && !ej.isNullOrUndefined(report.Filters[i]) && report.Filters[i].Tag == report.PivotColumns[j].FieldName) {
                            report.Filters.splice(i, 1);
                            i = -1;
                        }
                    }
                }
            }
            for (var i = 0; i < report.Filters.length; i++) {
                if (report.PivotRows.length >= 1) {
                    for (var j = 0; j < report.PivotRows.length; j++) {
                        if (report.Filters.length != 0 && !ej.isNullOrUndefined(report.Filters[i]) && report.Filters[i].Tag == report.PivotRows[j].FieldName) {
                            report.Filters.splice(i, 1);
                            i = -1;
                        }
                    }
                }
            }
            for (var i = 0; i < report.Filters.length; i++) {
                if (report.PivotCalculations.length >= 1) {
                    for (var j = 0; j < report.PivotCalculations.length; j++) {
                        if (report.Filters.length != 0 && !ej.isNullOrUndefined(report.Filters[i]) && report.Filters[i].Tag == report.PivotCalculations[j].FieldName) {
                            report.Filters.splice(i, 1);
                            i = -1;
                        }
                    }
                }
            }

            return report;
        },
        _createGroupingBar: function (report) {
            var filterTag;
            this._pivotFilter = this._getLocalizedLabels("DragFieldHere");
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                report = this._filterReport(report);
                filterTag = this._createPivotButtons(this._pivotFilter != null && report.Filters.length > 1 && report.Filters[0].Tag == report.Filters[1].Tag ? report.Filters.slice(1) : report.Filters, "filter");
            }
            else
                filterTag = this._createPivotButtons(this._pivotFilter != null && report.filters.length > 0 ? report.filters : "", "filter");
            this._pivotFilter = filterTag;
            this._pivotRow = this._createPivotButtons(this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? report.PivotRows : report.rows, "row");            
            this._pivotColumn = this._createPivotButtons(this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? report.PivotColumns : report.columns, "column");
            this._pivotCalculation = this._createPivotButtons(this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? report.PivotCalculations : report.values, "values");
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && (report.values.length > 0 && report.values[0]["measures"])) {
                if (report.values[0]["axis"] == "columns" && report.values[0]["measures"].length > 0)
                    this._pivotColumn = this._pivotColumn + this._createPivotButtons(this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? report.PivotColumns : [{ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }], "column");
                else if (report.values[0]["axis"] == "rows" && report.values[0]["measures"].length > 0)
                    this._pivotRow = this._pivotRow + this._createPivotButtons(this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? report.PivotColumns : [{ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }], "row");
            }
        },

        _contextOpen: function (args) {
            ej.Pivot._contextMenuOpen(args, this);
        },
        _pivotContextClick: function (args) {
            if (args.text != this._getLocalizedLabels("CalculatedField")) {
                if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                    var droppedClass = args.text == this._getLocalizedLabels("AddToColumn") ? "column" : args.text == this._getLocalizedLabels("AddToRow") ? "row" : args.text == this._getLocalizedLabels("AddToValues") ? "value" : args.text == this._getLocalizedLabels("AddToFilter") ? "filter" : ""; //test
                    var droppedField = $(this._selectedMember).attr("data-fieldName");
                    var droppedFieldCaption = $(this._selectedMember).text();
                    var dropArgs = { droppedFieldName: droppedField, droppedFieldCaption: droppedFieldCaption, droppedClass: droppedClass, droppedPosition: "", isMeasuresDropped: (droppedField.toLocaleLowerCase().indexOf("measures") == 0) };
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this._calculatedField.length > 0 && droppedClass != "values") {
                        this.model.dataSource.values = $.grep(this.model.dataSource.values, function (value) {
                            return (ej.isNullOrUndefined(value.isCalculatedField) || value.isCalculatedField == false) || (value.isCalculatedField == true && value.formula.indexOf(dropArgs.droppedFieldName) == -1);
                        });
                    }
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        this.model.dataSource = this.clearDrilledItems(this.model.dataSource, { action: "pvtBtnDropped" }, this);
                    }
                    ej.Pivot.addReportItem(this.model.dataSource, dropArgs);
                    this.refreshControl();
					if (!ej.isNullOrUndefined(this._schemaData))
						this._schemaData._refreshPivotButtons();
                }
                else {
                    var droppedPosition = args.text == this._getLocalizedLabels("AddToColumn") ? this.element.find(".columns") : args.text == this._getLocalizedLabels("AddToRow") ? (this.element.find(".e-grpRow").length == 0 ? this.element.find(".emptyRows").addClass("e-grpRow") : this.element.find(".e-grpRow")) : args.text == this._getLocalizedLabels("AddToValues") ? this.element.find(".values") : args.text == this._getLocalizedLabels("AddToFilter") ? this.element.find(".e-drag") : "";
                    var params = { element: this._selectedMember, target: droppedPosition, cancel: false };
                    this._pvtBtnDropped(params);
                }
            }
            else
                this._createCalculatedField();
        },

        _getAdvancedFilterInfo: function (levelUqName) {
            var filterItem=[];
            if(this._excelFilterInfo.length>0){
                var hierarchy=levelUqName;
                filterItem = $.grep(this._excelFilterInfo, function (value) {
                    try {
                        //.split('.').splice(0, 2).join(".")
                        if (value.levelUniqueName.replace(/]/g, "").replace(/\[/g, "").indexOf(levelUqName) > -1 && !ej.isNullOrUndefined(value.operator))
                            return value;
                    }
                    catch (e){}
                   
                });
            }
            return filterItem;
        },
        _createPivotButtons: function (axisItems, axis) {
            var clientMode = (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) ? true : false;
            if (!ej.isNullOrUndefined(axisItems)) {
                var rowBtns = "", tagAxis = axis == "column" ? "Columns" : axis == "row" ? "Rows" : axis == "filter" ? "Slicers" : "Values";
                var filterState = "";

                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                    var tagAxis = axis == "column" ? "Columns" : axis == "row" ? "Rows" : axis == "filter" ? "filters" : "values";
                    if (tagAxis == "values" && clientMode)
                        axisItems = $.map(axisItems, function (obj, index) { return obj["measures"]; });
                    for (var i = 0; i < axisItems.length; i++) {
                        filterState = axisItems[i].fieldCaption;
                        var members = clientMode ? "" : ej.PivotAnalysis.getMembers(axisItems[i].fieldName);
                        var fieldItem = (ej.Pivot.getReportItemByFieldName(axisItems[i].fieldName, this.model.dataSource));
                        var filtered = ((axisItems[i].filterItems != null && axisItems[i].filterItems.values.length > 0) || (!ej.isNullOrUndefined(axisItems[i]["advancedFilter"]) && axisItems[i]["advancedFilter"].length > 0 && fieldItem.item && fieldItem.axis != "filters")) ? "filtered" : "";
                        if (axis == "filter") {
                            if (filtered == "filtered") {
                                filterState = ej.Pivot._getFilterState(clientMode, members, axisItems[i], this);
                            }
                            else if (clientMode) {
                                ej.olap._mdxParser.getAllMember(this.model.dataSource, axisItems[i].fieldName, this);
                                filterState = this._allMember;
                            }
                            else
                                filterState = this._getLocalizedLabels("All");
                        }
                        var sort = clientMode ? "" : axisItems[i].sortOrder == ej.PivotAnalysis.SortOrder.Descending ? "descending" : "";
                        var buttonId=(axisItems[i].fieldName || axisItems[i]).replace(/[\(\)\[\]{}'"]/g,"").replace(/[\W]/g,"_");
                        rowBtns += ej.buildTag("span.e-pivotButton", ej.buildTag("button.e-pvtBtn#pivotButton_" + buttonId, (1 == 1 ? (this.model.showUniqueNameOnPivotButton ? (axis != "values" ? (axisItems[i].fieldName.replace(/\[/g, '').replace(/\]/g, '')) : (axisItems[i].fieldCaption == undefined ? axisItems[i].fieldName : axisItems[i].fieldCaption || axisItems[i])) : (axisItems[i].fieldCaption == undefined ? axisItems[i].fieldName : axisItems[i].fieldCaption || axisItems[i])) + (axis == "filter" ? " (" + filterState + ")" : "") : $.grep(this._pivotTableFields, function (item) { return item.name == axisItems[i].fieldName; })[0].caption || $.grep(this._pivotTableFields, function (item) { return item.name == axisItems[i]; })[0].caption), {}, { "data-fieldName": axisItems[i].fieldName, "data-fieldCaption": axisItems[i].fieldCaption, "data-axis": tagAxis })[0].outerHTML +
                                  (clientMode && (axisItems[i].fieldName.toLowerCase() == "measures" || (!ej.isNullOrUndefined(axisItems[i].isNamedSet) && !axisItems[i].isNamedSet)) ? "" : ej.buildTag("span.filter e-icon " + filtered).attr("role", "button").attr("aria-label", "filter")[0].outerHTML) + (clientMode ? " " : ej.buildTag("span.e-sorting e-icon " + sort).attr("role", "button").attr("aria-label", "sort").attr("aria-expanded", "false")[0].outerHTML) + ej.buildTag("span.e-removeBtn e-icon").attr("role", "button").attr("aria-label", "remove")[0].outerHTML).attr("data-tag", tagAxis + ":" + axisItems[i].fieldName || axisItems[i])[0].outerHTML;
                    }
                }
                else {
                    if (tagAxis == "Values" && axis == "values") {
                        var tempAxis = this.element.find(".e-pivotButton:contains('" + this._getLocalizedLabels("Measures") + "')").length > 0 ? this.element.find(".e-pivotButton:contains('" + this._getLocalizedLabels("Measures") + "')").parent()[0].className.split(" ")[0] : "e-schemaColumn";//test
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                            tagAxis = tempAxis == "e-schemaColumn" || tempAxis == "columns" ? "Columns" : "Rows";
                    }
                    for (var i = 0; i < axisItems.length; i++) {
                        var l = this._ascdes.split("##"), count = 0; sort = "", filtered = "";
                        for (var j = 0; j < l.length; j++) {
                            if ((this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && l[j] == axisItems[i].Tag) || (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && l[j] == axisItems[i])) {
                                count = 1;
                            }
                        }
                        if (count == 1) {
                            sort = "descending";
                        }
                        if (!ej.isNullOrUndefined(this._tempFilterData)) {
                            for (var j = 0; j < this._tempFilterData.length; j++) {
                                for (var key in this._tempFilterData[j]) {
                                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                                        if (key == ((axisItems[i].FieldName || axisItems[i].DimensionName)) && this._tempFilterData[j][(axisItems[i].FieldName || axisItems[i].DimensionName)] != "")
                                            filtered = "filtered";
                                    }
                                    else if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                                        if (key == (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? axisItems[i].Tag : axisItems[i]) && this._tempFilterData[j][axisItems[i].Tag].indexOf("FILTERED") != 0)
                                            filtered = "filtered";
                                    }
                                }
                            }
                        }
                        if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                            axisItems[i].FieldHeader = axisItems[i].FieldHeader == "Measures" ? this._getLocalizedLabels("Measures") : axisItems[i].FieldHeader;
                            filtered = (axis!="filter" && this.model.enableAdvancedFilter &&  this._getAdvancedFilterInfo(axisItems[i].Tag).length > 0) ? "filtered" : filtered;
                            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                                var excludeMem = !ej.isNullOrUndefined(this._tempFilterData) ? $.map(this._tempFilterData, function (item) { return item[axisItems[i].DimensionName] }) : [];
                                if (axis == "filter") {
                                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.enableAdvancedFilter && this._getAdvancedFilterInfo(axisItems[i].Tag).length > 0) {                                        
                                        filtered = "filtered";
                                    }
                                    if (excludeMem.length > 0 && filtered && this._fieldMembers[axisItems[i].DimensionName])
                                        filterState = this._fieldMembers[axisItems[i].DimensionName].length - excludeMem.length == 1 ? (this._fieldMembers[axisItems[i].DimensionName]).filter(function (item) { if (excludeMem.indexOf(item) == -1) return item }) : this._getLocalizedLabels("MultipleItems");
                                    else
                                        filterState = this._getLocalizedLabels("All");
                                }
                            }
                            else {
                                if (axis == "filter") {
                                    filterState = (this._fieldSelectedMembers[axisItems[i].Tag] == "All" ? axisItems[i].AllMember : this._fieldSelectedMembers[axisItems[i].Tag]) || axisItems[i].AllMember;
                                }
                            }
                            var filterIcon = axisItems[i].FieldHeader == "Measures" || axisItems[i].Tag == "Measures" || axisItems[i].Tag.indexOf("::NAMEDSET") > -1 ? "" : ej.buildTag("span.filter e-icon " + filtered).attr("role", "button").attr("aria-label", "filter")[0].outerHTML;
                            rowBtns += ej.buildTag("span.e-pivotButton", ej.buildTag("span.e-dropIndicator")[0].outerHTML + ej.buildTag("button.e-pvtBtn#pivotButton" + axisItems[i].FieldHeader || axisItems[i].FieldName || axisItems[i].Name || axisItems[i].DimensionHeader || axisItems[i].DimensionName, ((this.model.showUniqueNameOnPivotButton ? (axis != "values" ? axisItems[i].Tag : axisItems[i].FieldHeader || axisItems[i].FieldName || axisItems[i].Name || axisItems[i].DimensionHeader || axisItems[i].DimensionName) : axisItems[i].FieldHeader || axisItems[i].FieldName || axisItems[i].Name || axisItems[i].DimensionHeader || axisItems[i].DimensionName) + (axis == "filter" ? " (" + filterState + ")" : "")), {}, this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? { "data-fieldName": axisItems[i].FieldName || axisItems[i].DimensionName || axisItems[i].FieldHeader || axisItems[i].DimensionHeader, "data-fieldCaption": axisItems[i].FieldHeader || axisItems[i].DimensionHeader || axisItems[i].FieldName || axisItems[i].DimensionName } : { "data-fieldCaption": axisItems[i].FieldHeader })[0].outerHTML +
                              filterIcon + ej.buildTag("span.e-sorting e-icon " + sort).attr("role", "button").attr("aria-label", "sort")[0].outerHTML + ej.buildTag("span.e-removeBtn e-icon").attr("role", "button").attr("aria-label", "remove")[0].outerHTML).attr("data-tag", tagAxis + ":" + axisItems[i].Tag)[0].outerHTML;
                        }
                        else
                            rowBtns += ej.buildTag("span.e-pivotButton", ej.buildTag("span.e-dropIndicator")[0].outerHTML + ej.buildTag("button.e-pvtBtn#pivotButton" + axisItems[i], axisItems[i])[0].outerHTML + ej.buildTag("span.filter e-icon " + filtered).attr("role", "button").attr("aria-label", "filter")[0].outerHTML + ej.buildTag("span.e-sorting e-icon " + sort).attr("role", "button").attr("aria-label", "sort").attr("aria-expanded", "false")[0].outerHTML + ej.buildTag("span.e-removeBtn e-icon").attr("role", "button").attr("aria-label", "remove")[0].outerHTML).attr("data-tag", tagAxis + ":" + axisItems[i])[0].outerHTML;
                    }
                }
                return rowBtns;
            }
        },

        _createFields: function (tableOlapGrid, tableWidth, cellWidth) {
            this.element.find(".groupingBarPivot").remove();
            if (this.model.enableVirtualScrolling && this.element.find(".virtualScrollGrid").length > 0)
                this.element.find(".virtualScrollGrid").prepend(ej.buildTag("div#groupingBarPivot.groupingBarPivot")[0].outerHTML);
            else
                this.element.prepend(ej.buildTag("div#groupingBarPivot.groupingBarPivot")[0].outerHTML);
            this.element.find(".groupingBarPivot").prepend(ej.buildTag("div.valueColumn", ej.buildTag("span.values").attr("aria-label", "values")[0].outerHTML + ej.buildTag("span.columns").attr("aria-label", "column")[0].outerHTML, { "width": "100%" })); // Math.max(valueColumnWidth, 280) - 5
            this.element.find(".groupingBarPivot").prepend(ej.buildTag("div.e-drag", ej.buildTag("span", "", { "width": "5px", "display": "inline-block" })[0].outerHTML + this._getLocalizedLabels("DragFieldHere"), { "width": "100%" }).attr("aria-label", "filter")[0].outerHTML);// Math.max(filterWidth, 280)
            if (this._pivotFilter != "" && this._pivotFilter != null)
                this.element.find(".e-drag").text("").attr("aria-label","filter");
            this.element.find(".e-drag").append(this._pivotFilter);
            this.element.find(".values").append(this._pivotCalculation);
            this.element.find(".columns").append(this._pivotColumn);
            if (this.element.find(".values .e-pivotButton").length == 0) {
                this.element.find(".values").append(ej.buildTag("span", "", { "width": "5px", "display": "inline-block" })[0].outerHTML + this._getLocalizedLabels("ValueArea"));
            }
            if (this.element.find(".columns .e-pivotButton").length == 0) {
                this.element.find(".columns").append(ej.buildTag("span", "", { "width": "5px", "display": "inline-block" })[0].outerHTML + this._getLocalizedLabels("ColumnArea"));
            }
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.element.find(".e-rows").length == 0 && !ej.isNullOrUndefined(this.getJSONRecords()) && this.getJSONRecords().length > 0 && this.getJSONRecords()[0].CSS == "colheader") {
                this.element.find(".e-pivotGridTable thead tr:first").prepend(ej.buildTag('th.e-grpRow', ej.buildTag("div.e-rows", ej.buildTag("span", "", { "width": "5px", "display": "inline-block" })[0].outerHTML + this._getLocalizedLabels("RowArea"))[0].outerHTML, {}, { rowspan: this.element.find("thead tr").length })[0].outerHTML);
                this.element.find(".e-pivotGridTable tbody tr:first").prepend(ej.buildTag('td.rowheader', this._getLocalizedLabels("Total"))[0].outerHTML);
            }
            else if (this.element.find(".e-rows .e-pivotButton").length == 0) {
                this.element.find(".e-rows").text("").children("span").remove();
                this.element.find(".e-rows").append(ej.buildTag("span", "", { "width": "5px", "display": "inline-block" })[0].outerHTML + this._getLocalizedLabels("RowArea"));
            }
            if (this.element.find(".rowheader").length == 0 && this.element.find(".colheader").length == 0 && this.element.find(".values .e-pivotButton").length == 0 || this.element.find(".e-pivotGridTable th").length == 0) {
                var rowArea = ej.buildTag("div.emptyRows", ej.buildTag("span.e-rows", this._pivotRow != "" ? this._pivotRow : this._getLocalizedLabels("RowArea"), { "width": "5px" })[0].outerHTML, { "width": 140 })[0].outerHTML;
                this.element.find(".e-rows").length == 0 ? this.element.find(".groupingBarPivot").append(rowArea) : "";
                if (this.model.enableDeferUpdate && this._pivotRow != "") {
                    this.element.find(".e-rows").text("");
                    this.element.find(".e-rows").append(this._pivotRow);
                }
                if (this.getJSONRecords() == null || this.getJSONRecords().length == 0)
                    this.element.find(".groupingBarPivot").addClass("emptyPivotGrid");
                this.element.find(".emptyRows,.e-rows").ejDroppable({
                });
            }
            this.element.find(".values").find(".filter").remove();
            this.element.find(".values").find(".e-sorting").remove();
            this.element.find(".e-drag").find(".e-sorting").remove();
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                this.element.find(".e-pivotButton").find(".e-sorting").remove();
            if (this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders) {
                this.element.find(".e-rows").width(this.element.find(".pivotGridRowTable").width());
                this._setGroupingBarFrozenRowBtnWidth();
            }
            this.element.find(".e-pivotButton .e-pvtBtn").ejButton({ size: "normal", type: ej.ButtonType.Button }).ejDraggable({
                handle: 'button', clone: true,
                cursorAt: { left: -5, top: -5 },
                dragStart: ej.proxy(function (args) {
                    this._isDragging = true;
                }, this),
                dragStop: ej.proxy(this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this._clientPvtBtnDropped : this._pvtBtnDropped, this),
                helper: ej.proxy(function (event, ui) {
                    $(event.element).parent().addClass("dragHover");
                    $(event.element).addClass("dragHover");
                    if (event.sender.target.className.indexOf("e-btn") > -1)
                        return $(event.sender.target).clone().addClass("dragClone").appendTo(this.element);
                    else
                        return false;
                }, this)
            });

            this.element.find(".e-drag, .values, .columns, .e-grpRow, .e-rows").ejDroppable({
            });
            if (this.element.find(".e-pivotGridTable").find("thead th:eq(1), tbody td.value:eq(0)").length > 0) {
                this.element.find(".groupingBarPivot").width(this.element.find(".e-pivotGridTable").width());
            }
            else {
                if (this.element.find(".columns .e-pivotButton").length == 0 || (this.element.find(".values .e-pivotButton").length == 0 && this.element.find(".columns .e-pivotButton").length == 1))
                    this.element.find(".groupingBarPivot").width(300);
                else {
                    var MaxBtnWidth = 0;
                    for (var i = 0; i < $(this.element.find(".columns .e-pivotButton")).length; i++) {
                        MaxBtnWidth = Math.max($(this.element.find(".columns .e-pivotButton")[i]).width(), MaxBtnWidth);
                    }
                    MaxBtnWidth < 140 ? this.element.find(".columns").css("min-width", MaxBtnWidth + "px") : "";
                    var grpwidth = (MaxBtnWidth * $(this.element.find(".columns .e-pivotButton")).length) + this.element.find(".values").width() + 10;
                    this.element.find(".groupingBarPivot").width(grpwidth);
                }
            }
            if (this.element.find(".e-rows").width() > 140 || (this.model.enableDeferUpdate) && (this.element.find(".e-rows").width() < this.element.find(".e-grpRow").width()) && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                if (this.enableDeferUpdate)
                    this.element.find(".e-rows").width(this.element.find(".colheader").length == 0 ? this.element.find(".e-grpRow").width() - 140 : this.element.find(".e-grpRow").width());
                else if (!this.model.isResponsive)
                    this.element.find(".e-rows").width((this.model.enableDeferUpdate) ? (this.element.find(".e-grpRow").width()) - 8 : (this.element.find(".e-grpRow").width()));
            }
            if (this.element.find(".e-pivotGridTable thead").length > 0 || this.model.enableDeferUpdate && this.element.find(".e-pivotGridTable thead").length == 0 && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode || this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders) {
                if (this.model.isResponsive && this.element.find(".values .e-pivotButton").length == 0 && this.element.find(".columns .e-pivotButton").length == 0) {
                    this.element.find(".values").width(140);
                }
                else
                    this.element.find(".values").width(this.element.find(".e-grpRow").length > 0 ? this.model.enableDeferUpdate && this.element.find(".colheader").length == 0 ? this.element.find(".e-grpRow").width() : this.element.find(".e-grpRow").width() + 3 : 140);//this.element.find(".colheader").length==0?this.element.find(".grpRow").width()+140:
                if (this.model.enableDeferUpdate && this.element.find(".colheader").length == 0 && this.element.find(".e-pivotGridTable .rowheader").length != 0) {
                    var columnWidth = this.element.find(".groupingBarPivot").width() - this.element.find(".values").width();
                    if (columnWidth < 140)
                        this.element.find(".groupingBarPivot").width(this.element.find(".groupingBarPivot").width() + 140)
                }
                if (this.element.find(".e-pivotGridTable").find("thead th:eq(1), tbody td.value:eq(0)").length > 0 || this.model.enableDeferUpdate && this.element.find(".columns .e-pivotButton").length == 0 || this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders) {
                    var colWidth = this.element.find(".e-pivotGridTable").width() - this.element.find(".values").width() - 4;
                    if (this.element.find(".e-pivotGridTable").find("thead th:eq(2), tbody td:eq(1)").length == 0) {
                        this.element.find(".columns").css("min-width", colWidth >= 30 && this.element.find(".e-pivotGridTable .colheader").length == 0 && this.element.find(".columns .e-pivotButton").length == 0 ? 140 : colWidth).width(colWidth >= 30 && this.element.find(".e-pivotGridTable .colheader").length == 0 && this.element.find(".columns .e-pivotButton").length == 0 ? 82 : colWidth);
                        this.element.find(".values").height(colWidth >= 30 && this.element.find(".e-pivotGridTable .colheader").length == 0 && this.element.find(".columns .e-pivotButton").length == 0 ? this.element.find(".columns").height() : this.element.find(".values").height());
                        if (this.element.find(".columns .e-pivotButton").length == 0 || this.model.enableDeferUpdate && this.element.find(".e-pivotGridTable .colheader").length == 0) {
                            if (this.element.find(".columns .e-pivotButton").length == 0) {
                                var colWidth = this.element.find(".groupingBarPivot").width() - this.element.find(".values").width() - 5;
                                this.element.find(".columns").width(colWidth);
                                if (colWidth < 140 && ($(".groupingBarPivot .values .e-pivotButton").length == 1 || $(".groupingBarPivot .values .e-pivotButton").length == 0 && this.model.enableDeferUpdate))
                                    this.element.find(".columns").css("min-width", colWidth + "px");
                            }
                            this.element.find(".columns").addClass("e-widthSetter");
                        }
                    }
                    else {
                        if (colWidth < 140) {
                            if ($('.columns .e-pivotButton').length < 2)
                                this.element.find(".columns").css("min-width", colWidth).addClass("e-widthSetter");
                            else {
                                this.element.find(".columns").width(colWidth).css("min-width", colWidth);
                                this.element.find(".values").height(this.element.find(".columns").height());
                                
                            }
                        }
                        else
                            this.element.find(".columns").width(colWidth);
                    }
                }
                else if (this.element.find(".e-pivotGridTable").find("thead th:eq(1)").length == 0 && !this.model.enableDeferUpdate) {
                    if (this.element.find(".columns .e-pivotButton").length == 0)
                        this.element.find(".columns").addClass("e-widthSetter");
                    var colBtnCount = this.element.find(".columns .e-pivotButton").length < 1 ? 1 : this.element.find(".columns .e-pivotButton").length;                    
                    this.element.find(".columns").css("min-width", (this.element.find(".groupingBarPivot").width() - this.element.find(".values").width() - 7) / colBtnCount);
                }
            }
            if (this.model.dataSource.data != null && this.model.url == "") {
                var totalWidth = 0;
                $('.columns .e-pivotButton').each(function (index) { totalWidth += parseInt($(this).width() + 10); });
                if ($(".valueColumn").height() > 30 && this.element.find(".values button").length == 0 && this.element.find(".columns").width() < totalWidth) {
                    var btnCnt = (this.element.find(".columns .e-pivotButton").length);
                    var btnWidth = ((this.element.find(".valueColumn").width() - this.element.find(".values").width()) / (btnCnt == 0 ? 1 : btnCnt)) - 70;
                    this.element.find(".columns .e-pvtBtn").width(btnWidth).css({ "text-overflow": "ellipsis" });
                }
            }
            if (this.element.find(".columns").height() > 47) {
                if (!this.model.isResponsive)
                    var btnWidth = this.element.find(".columns").width() / 2 - 60;
                else
                    var btnWidth = this.element.find(".columns").width() / (this.element.find(".columns .e-pivotButton").length) - 5;
                this.element.find(".columns .e-pvtBtn").width(btnWidth).css({ "text-overflow": "ellipsis" });
            }
            else {
                if (this.element.find(".columns .e-pivotButton").width() > this.element.find(".columns").width()) {
                    var btnWidth = this.element.find(".columns").width() - ((this.element.find(".columns .e-pivotButton").width() - this.element.find(".columns .e-pivotButton .e-pvtBtn").width()) + 40);
                    this.element.find(".columns .e-pvtBtn").width(btnWidth).css({ "text-overflow": "ellipsis" });
                }
            }

            if (this.element.find(".e-drag").height() > 47) {
                var btnWidth = this.element.find(".groupingBarPivot").width() / 4 - 35;
                this.element.find(".e-drag .e-pvtBtn").width(btnWidth).css({ "text-overflow": "ellipsis" });
            }
            else if (this.element.find(".e-drag .e-pivotButton").width() > this.element.find(".e-drag").width()) {                
                var btnWidth = this.element.find(".e-drag").width() - ((this.element.find(".e-drag .e-pivotButton").width() - this.element.find(".e-drag .e-pivotButton .e-pvtBtn").width()) + 40);
                this.element.find(".e-drag .e-pvtBtn").width(btnWidth).css({ "text-overflow": "ellipsis" });
            }
            if (this.element.find(".values").height() > 47) {
                if (!this.model.isResponsive)
                    var btnWidth = this.element.find(".values").width() / 2 - 40;
                else
                    var btnWidth = this.element.find(".values").width() / (this.element.find(".values .e-pivotButton").length) - 5;
                this.element.find(".values .e-pvtBtn").width(btnWidth).css({ "text-overflow": "ellipsis" });
            }
            else {
                if (this.element.find(".values .e-pivotButton").width() > this.element.find(".values").width() || (this.element.find(".e-pivotGridTable").find("thead th:eq(1), tbody td.value:eq(0)").length == 0 && this.element.find(".values .e-pivotButton").length > 0)) {
                    var btnWidth = this.element.find(".values").width() - ((this.element.find(".values .e-pivotButton").width() - this.element.find(".values .e-pivotButton .e-pvtBtn").width()) + 20);
                    this.element.find(".values .e-pvtBtn").width(btnWidth).css({ "text-overflow": "ellipsis" });
                }
            }
            var addedbtnwidth = 0;
            for (var i = 0; i < this.element.find(".e-rows .e-pivotButton").length; i++) {
                addedbtnwidth = addedbtnwidth + this.element.find(".e-rows .e-pivotButton:eq(" + i + ")").width()
            }
            if ((addedbtnwidth - 20 > this.element.find(".e-rows").width()) || (this.element.find(".colfreeze").length - 20 > 0 && addedbtnwidth > this.element.find(".colfreeze").width()) || (this.element.find(".e-rows").parent(".emptyRows").length > 0 && this.element.find(".e-rows").parent(".emptyRows").width() < addedbtnwidth)) {
                var btnWidth = 0, divClass = this.element.find(".colfreeze").length > 0 ? ".colfreeze" : ".e-rows";
                var parDivHeight = this.element.find(divClass).parent().height();
                var btnHeight = this.element.find(divClass + " .e-pivotButton").eq(0).height();
                var btnCnt = this.element.find(divClass + " .e-pivotButton").length;
                if (parDivHeight / (btnHeight * btnCnt) >= 1)
                    btnWidth = "auto";                
                else
                    btnWidth = (this.element.find(divClass).width()) / 2 - 40;
                this.element.find(".e-rows .e-pvtBtn").width(btnWidth).css({ "text-overflow": "ellipsis" });
            }
            if (this.model.enableDeferUpdate && this.element.find(".columns .e-pivotButton").length != 0 && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                var pvtBtnWidth = 0, columnWidth = 0;
                for (var i = 0; this.element.find(".columns .e-pivotButton").length > i; i++) {
                    pvtBtnWidth = this.element.find(".columns .e-pivotButton:eq(" + i + ")").width() + pvtBtnWidth + 7;
                }
                this.element.find('.e-pivotGridTable .colheader,.e-pivotGridTable tr:eq(0) .summary').each(function () {
                    columnWidth = columnWidth + $(this).width();
                });
                if (pvtBtnWidth >= columnWidth) {
                    var isempty = this.element.find(".e-pivotGridTable .colheader").length > 0 ? 1 : 0;
                    var colWidth = isempty == 0 ? 140 : columnWidth;
                    var btnWidth = colWidth / (this.model.enableDeferUpdate ? this.element.find(".columns .e-pivotButton").length : 3) - 15;
                    this.model.enableDeferUpdate ? this.element.find(".columns .e-pvtBtn").width(30).css({ "text-overflow": "ellipsis" }) : this.element.find(".columns .e-pvtBtn").width(btnWidth).css({ "text-overflow": "ellipsis" });
                }
            }

            if (this.element.find(".values").height() > this.element.find(".columns").height() || this.element.find(".columns").height() > this.element.find(".values").height()) {
                if (this.element.find(".values").height() > this.element.find(".columns").height()) {
                    this.element.find(".columns").height(this.element.find(".values").height());
                }
                else
                    this.element.find(".values").height(this.element.find(".columns").height());
            }
            this.element.find(".colheader, .rowheader, .value").addClass("e-droppable");
            this.element.find(".summary").removeClass("e-droppable");
            if (this.model.enableGroupingBar) {
                var ele = this.element.find(".e-pvtBtn");
                var contextTag = ej.buildTag("ul.pivotTree#pivotTree", (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? ej.buildTag("li.e-calculatedFieldMenuItem", ej.buildTag("a.menuItem", this._getLocalizedLabels("CalculatedField"))[0].outerHTML)[0].outerHTML : " ") + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToFilter"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToRow"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToColumn"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToValues"))[0].outerHTML)[0].outerHTML)[0].outerHTML;
                $(this.element).append(contextTag);
                $("#pivotTree").ejMenu({
                    menuType: ej.MenuType.ContextMenu,
                    enableRTL: this.model.enableRTL,
                    openOnClick: false,
                    contextMenuTarget: ele,
                    click: ej.proxy(this._pivotContextClick, this),
                    beforeOpen: ej.proxy(this._contextOpen, this),
                    close: ej.proxy(ej.Pivot.closePreventPanel, this)
                });
            }
        },

        _clientPvtBtnDropped: function (args) {
            ej.PivotAnalysis._valueSorting = null;
            this._isDragging = false;
            ej.Pivot.openPreventPanel(this);
            args.element.removeClass("dragHover").css("background-color", "inherit");
            args.element.parent().removeClass("dragHover");
            this.element.find(".dragClone").remove();
            this.element.find(".e-dropIndicator").removeClass("e-dropIndicatorHover");
            this.element.find(".dragClone,.e-dropIndicator").remove();
            var droppedClass = $(args.target).hasClass("columns") || $(args.target).parents(".columns").length > 0 ? "column" : $(args.target).hasClass("e-grpRow") || $(args.target).parents(".e-grpRow").length > 0 || $(args.target).hasClass("e-rows") ? "row" : $(args.target).hasClass("values") || $(args.target).parents(".values").length > 0 ? "value" : $(args.target).hasClass("e-drag") || $(args.target).parents(".e-drag").length > 0 ? "filter" : "";
            var droppedFieldCaption = args.element.text();
            var droppedField = $(args.element).attr("data-fieldName");
            if (droppedClass != "" && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                if ((droppedField.toLowerCase().indexOf("[measures]") >= 0 && droppedClass != "value") || (droppedField == this._getLocalizedLabels("Measures") && droppedClass != "row" && droppedClass != "column") || (droppedField.toLowerCase().indexOf("[measures]") < 0 && droppedClass == "value")) {
                    ej.Pivot._createErrorDialog(this._getLocalizedLabels("GroupingBarAlertMsg"), this._getLocalizedLabels("Warning"), this);
                    return;
                }
            }
			if(droppedClass == "" && this._schemaData){
			    if(droppedFieldCaption.toLowerCase() == "measures" && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap){
					var i =0;
					while (this.model.dataSource.values[0]["measures"].length > 0) {
                            selectedTreeNode = this._schemaData._tableTreeObj.element.find("li[data-tag='" + this.model.dataSource.values[0]["measures"][i].fieldName + "']");
                            this._schemaData._tableTreeObj.uncheckNode(selectedTreeNode);
                        }
				}
				else if(this._schemaData)
				{
					var schemaUncheck = this._schemaData._tableTreeObj.element.find("li:contains('" + droppedFieldCaption + "')");
					this._schemaData._tableTreeObj.uncheckNode(schemaUncheck);
				}
			}
			if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && droppedClass!="" && droppedClass != "value" && $.grep(this._calculatedField, function (value) { return value.name == droppedField; }).length > 0) {
                ej.Pivot._createErrorDialog(this._getLocalizedLabels("CalcValue"), this._getLocalizedLabels("Warning"), this);
                this.element.find(".dragClone,.e-dropIndicator").remove();
                return;
            }
            var droppedPosition = droppedClass == "" ? "" : this._setSplitBtnTargetPos(args.event, droppedClass, "drop");
            var orginalPosition = droppedClass == "" ? "" : this._setSplitBtnTargetPos(args, droppedClass, "original");
            var droppedAxis = $(args.element).hasClass("columns") || $(args.element).parents(".columns").length > 0 ? "column" : $(args.element).hasClass("e-grpRow") || $(args.element).parents(".e-grpRow").length > 0 || $(args.element).hasClass("e-rows") ? "row" : $(args.element).hasClass("values") || $(args.element).parents(".values").length > 0 ? "value" : $(args.element).hasClass("e-drag") || $(args.element).parents(".e-drag").length > 0 ? "filter" : "";
            if (droppedClass != "" && droppedClass.toLowerCase() == droppedAxis.toLowerCase() && droppedPosition > orginalPosition) droppedPosition = droppedPosition - 1;
            var dropArgs = { droppedFieldName: droppedField, droppedFieldCaption: droppedFieldCaption, droppedClass: droppedClass, droppedPosition: droppedPosition, isMeasuresDropped: (droppedField.toLocaleLowerCase().indexOf("measures") == 0) };
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this._calculatedField.length > 0 && droppedClass != "value") {
                this.model.dataSource.values = $.grep(this.model.dataSource.values, function (value) {
                    return (ej.isNullOrUndefined(value.isCalculatedField) || value.isCalculatedField == false) || (value.isCalculatedField == true && value.formula.indexOf(dropArgs.droppedFieldName) == -1);
                });
            }
            else if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                this._fieldMembers = {};
                this._fieldSelectedMembers = {};
                this.model.dataSource = this.clearDrilledItems(this.model.dataSource, { action: "pvtBtnDropped" }, this);
            }
            if (!ej.isNullOrUndefined(this._waitingPopup))
                this._waitingPopup.show();
            ej.Pivot.addReportItem(this.model.dataSource, dropArgs);
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                var calculatedField = $.grep(this.model.dataSource.values, function (value) { return value.isCalculatedField == true; });
                this.model.dataSource.values = $.grep(this.model.dataSource.values, function (value) { return ej.isNullOrUndefined(value.isCalculatedField) || value.isCalculatedField == false; });
                $.merge(this.model.dataSource.values, calculatedField);
            }
            if ((this.model.enableAdvancedFilter || this.model.dataSource.enableAdvancedFilter) && droppedClass == "filter") {
                var fieldItem = ej.Pivot.getReportItemByFieldName(this._selectedField, this.model.dataSource).item;
                if(fieldItem && fieldItem.advancedFilter) 
                    fieldItem.advancedFilter = [];
            }
            this.refreshControl();
            if (!ej.isNullOrUndefined(this._schemaData)) {
                if (ej.Pivot.getReportItemByFieldName(droppedField, this.model.dataSource).item == null && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                    this._schemaData._tableTreeObj.element.find("li[data-tag='" + droppedField + "']").removeClass("filter").find(".treeDrop,.filter").remove();
                this._schemaData._refreshPivotButtons();
            }
        },

        _pvtBtnDropped: function (args) {
            ej.Pivot.openPreventPanel(this);
            $(args.element).parent().removeClass("dragHover");
            $(args.element).removeClass("dragHover");
            this._isUpdateRequired = true;
            var draggedClass = "";
            this._isDragging = false;
            var droppedClass;
            this.element.find(".e-dropIndicator").removeClass("e-dropIndicatorHover");
            var axis = null, axisName = "", headerTag = "", headerText, isFiltered = false, isSorted = false;
            if (!ej.isNullOrUndefined(args.target.className)) {
                droppedClass = args.target.className.indexOf("e-droppable") >= 0 ? args.target.className.split(" ")[0] : "";
            }
            else {
                droppedClass = $(args.target).hasClass("columns") ? "columns" : $(args.target).hasClass("e-grpRow") ? "e-rows" : $(args.target).hasClass("values") ? "values" : $(args.target).hasClass("e-drag") ? "e-drag" : "";
            }
            droppedClass = droppedClass == "e-grpRow" ? "e-rows" : droppedClass;
            isFiltered = $(args.element).parent().find(".filtered").length > 0 ? true : false;
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                if ($(args.target).hasClass("e-pvtBtn") && (this.model.operationalMode != ej.PivotGrid.OperationalMode.ServerMode))
				droppedClass = $(args.target).attr("data-axis").toLowerCase();
                headerText = !(ej.isNullOrUndefined(args.element.attr("data-fieldCaption"))) ? args.element.attr("data-fieldCaption") : args.element.text();
                        isSorted = $(args.element).parent().find(".descending").length > 0 ? true : false;
                
                if (droppedClass == "" && (args.target.tagName == "BUTTON" || args.target.tagName == "SPAN")) {
                    droppedClass = args.target.parentNode.parentElement.className.split(" ")[0];
                }
                for (var i = 0; i < this._pivotTableFields.length; i++) {
                    if (this._pivotTableFields[i].name == headerText) {
                        this._pivotTableFields[i].isSelected = true;
                        headerTag = this._pivotTableFields[i];
                    }
                }
            }
            else
            {
                if (!ej.isNullOrUndefined(args.target.className)) {
                    axis = args.target.className.indexOf("e-pvtBtn") > -1 ? $(args.target).parents(".e-droppable")[0] : args.target.className.indexOf("e-droppable") ? args.target : args.target[0].tagName.toLowerCase() == "td" ? args.target.children(":last")[0] : args.target;
                    axisName = axis.className.split(" ")[0] == "columns" ? "Categorical" : axis.className.split(" ")[0] == "e-rows" || axis.className.split(" ")[0] == "e-grpRow" ? "Series" : axis.className.split(" ")[0] == "filters" ? "Slicer" : "";
                    droppedClass = axis.className.split(" ")[0];
                }
                else {
                    axis = $(args.target);
                    axisName = $(args.target).hasClass("columns") ? "Categorical" : $(args.target).hasClass("e-grpRow") ? "Series" : $(args.target).hasClass("e-drag") ? "Slicer" : "";
                    droppedClass = $(args.target).hasClass("columns") ? "columns" : $(args.target).hasClass("e-grpRow") ? "e-rows" : $(args.target).hasClass("values") ? "values" : $(args.target).hasClass("e-drag") ? "e-drag" : "";
                }
                if (axisName == "" && (args.element.parent().attr("data-tag").indexOf("[Measures]") > -1 || args.element.parent().attr("data-tag").indexOf("KPI") > -1))
                    axisName = this.element.find(".e-schemaRow .e-pivotButton:contains('" + this._getLocalizedLabels("Measures") + "')").length > 0 ? "Series" : "Categorical";
                if (!ej.isNullOrUndefined(args.element.parent()))
                    draggedClass = args.element.parents(".values").length > 0 ? "values" : args.element.parents(".e-drag").length > 0 ? "e-drag" : args.element.parents(".e-grpRow").length > 0 ? "e-rows" : args.element.parents(".columns").length > 0 ? "columns" : "";
                headerTag = $(args.element.parent()[0]).attr("data-tag");
                droppedClass = droppedClass == "e-grpRow" ? "e-rows" : droppedClass;
                axisName = axisName == "e-grpRow" ? "Series" : axisName;
                headerText = args.element.text();
            }
            this.element.find(".dragClone").remove();
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                if (((headerTag.split(":")[1].toLocaleUpperCase() == "MEASURES" || headerTag.split(":")[1].toLocaleUpperCase() == "KPI") && (droppedClass != "columns" || droppedClass != "e-rows") && (droppedClass == "e-drag" || droppedClass == "values")) || ((headerTag.toUpperCase().indexOf("[MEASURES]") > -1) && droppedClass != "values" && (droppedClass == "e-rows" || droppedClass == "columns" || droppedClass == "e-drag"))) {
                    ej.Pivot._createErrorDialog(this._getLocalizedLabels("GroupingBarAlertMsg"), this._getLocalizedLabels("Error"), this);
                    this.element.find(".dragClone,.e-dropIndicator").remove();
                    args.element.parent().removeAttr("style");
                    args.element.css("background-color", "inherit");
                    return false;
                }
                else if ((headerTag.toUpperCase().indexOf("[MEASURES]") == -1 || headerTag.toUpperCase().indexOf("KPI") == -1) && droppedClass == "values" && droppedClass != draggedClass) {
                    ej.Pivot._createErrorDialog(this._getLocalizedLabels("GroupingBarAlertMsg"), this._getLocalizedLabels("Error"), this);
                    this.element.find(".dragClone,.e-dropIndicator").remove();
                    args.element.parent().removeAttr("style");
                    args.element.css("background-color", "inherit");
                    return false;
                }
            }
            if (droppedClass == "e-rows" || droppedClass == "columns" || droppedClass == "values" || droppedClass == "e-drag") {
                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && droppedClass != "values" && ($.grep(this._calculatedField, function (value) { return value.name == headerText; }).length > 0 || $.grep(JSON.parse(this.getOlapReport()).PivotCalculations, function (value) { return value.FieldHeader == headerText && value.CalculationType == 8; }).length > 0)) {
                    ej.Pivot._createErrorDialog(this._getLocalizedLabels("CalcValue"), this._getLocalizedLabels("Warning"),this);
                    args.element.parent().removeAttr("style");
                    args.element.css("background-color", "inherit");
                    return;
                }
                var droppedPosition = this._setSplitBtnTargetPos(args, droppedClass, "drop");
                var orignalPosition = this._setSplitBtnTargetPos(args, droppedClass, "original");
                var report,params,eventArgs;
                if (droppedClass == "e-drag") {
                    this.element.find(".e-drag").text("").attr("aria-label","filter");
                }
                try {
                    report = JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.getOlapReport();
                }
                $(args.element.parent()).remove();
                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    var droppedAxis = args.element.parents(".e-pivotButton").attr("data-tag").split(":")[0];
                    this._waitingPopup = this.element.data("ejWaitingPopup");
                    if (!ej.isNullOrUndefined(this._waitingPopup))
                        this._waitingPopup.show();

                    if ($.isNumeric(droppedPosition)) {
                        if (droppedClass == droppedAxis.toLowerCase() && droppedPosition > orignalPosition)
                            droppedPosition = droppedPosition - 1;
                    }
                    droppedClass = droppedClass == "e-rows" ? "schemaRow" : droppedClass == "columns" ? "schemaColumn" : droppedClass == "e-drag" ? "schemaFilter" : droppedClass == "values" ? "schemaValue" : "";
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        if (this.model.enableAdvancedFilter && droppedClass == "schemaFilter") {
                            if (!ej.isNullOrUndefined(this._curFilteredText) && this._curFilteredText.indexOf(":") > -1) {
                                var filterInfo = this._getAdvancedFilterInfo(this._curFilteredText.split(":")[1]);
                                if (filterInfo.length > 0)
                                    this._removeFilterTag(filterInfo[0].levelUniqueName);
                            }
                        }
                        axisName = droppedClass == "schemaFilter" ? "Slicer" : axisName;
                        params = JSON.parse(this._olapReport).CurrentCube + "--" + headerTag + "--" + axisName + "--" + droppedPosition;
                        if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                            this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.customObject });
                        var serializedCustomObject = JSON.stringify(this.model.customObject);
                        eventArgs = JSON.stringify({ "action": "nodeDropped", "dropType": "SplitButton", "nodeInfo": params, "currentReport": report, "gridLayout": this.model.layout, "customObject": serializedCustomObject });
                        if (!this.model.enableDeferUpdate)
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.nodeDropped, eventArgs, this._pvtBtnDroppedSuccess);
                        else {
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.nodeDropped, eventArgs.replace("nodeDropped", "nodeDroppedDeferUpdate"), this._pvtBtnDroppedSuccess);
                        }
                    }
                    else {
                        if (this._calculatedField.length > 0 && droppedClass != "schemaValue" && this._schemaData != null)
                            this._calculatedFieldNodeRemove(headerTag);
                        if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                            this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.customObject });
                        var serializedCustomObject = JSON.stringify(this.model.customObject);
                        var filterParams = ej.Pivot._getFilterParams(droppedClass, this._tempFilterData, headerText);
                        eventArgs = JSON.stringify({ "action": "nodeDropped", "dropAxis": droppedClass + "::" + droppedPosition, "headerTag": JSON.stringify(headerTag), "sortedHeaders": this._ascdes, "filterParams": filterParams, "currentReport": report, "valueSorting": JSON.stringify(this.model.valueSortSettings), "customObject": serializedCustomObject });
                            var successMethod = this._renderControlSuccess;
                            if (!this.model.enableDeferUpdate)
                                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.nodeDropped, eventArgs, this._pvtBtnDroppedSuccess);
                            else {
                                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.nodeDropped, eventArgs.replace("nodeDropped", "nodeDroppedDeferUpdate"), this._pvtBtnDroppedSuccess);
                            }
                    }
                }
                else {
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && droppedClass != "values" && $.grep(this._calculatedField, function (value) { return value.name == headerText; }).length > 0) {
                        ej.Pivot._createErrorDialog(this._getLocalizedLabels("CalcValue"), this._getLocalizedLabels("Warning"), this);
                        this.model.editCellsInfo = {};
                        this._populatePivotGrid();
                        return;
                    }
                    var droppedItem = this._getDroppedItem(headerText);
                    var buttonFields = { fieldName: droppedItem[0].fieldName, fieldCaption: droppedItem[0].fieldCaption };
                    var droppedAxis = args.element.parents(".e-pivotButton").attr("data-tag").split(":")[0];
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && droppedItem.length > 0 && (droppedClass == "e-drag"))
                        droppedItem[0]["advancedFilter"] = [];
                    if ($.isNumeric(droppedPosition)) {
                        if (droppedClass == droppedAxis.toLowerCase() && droppedPosition > orignalPosition)
                            droppedClass == "e-rows" ? this.model.dataSource.rows.splice(droppedPosition - 1, 0, droppedItem[0]) : droppedClass == "columns" ? this.model.dataSource.columns.splice(droppedPosition - 1, 0, droppedItem[0]) : droppedClass == "values" ? (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? this.model.dataSource.values[0]["measures"].splice(droppedPosition - 1, 0, droppedItem[0]) : this.model.dataSource.values.splice(droppedPosition, 0, droppedItem[0])) : this.model.dataSource.filters.splice(droppedPosition, 0, droppedItem[0]);
                        else
                            droppedClass == "e-rows" ? this.model.dataSource.rows.splice(droppedPosition, 0, droppedItem[0]) : droppedClass == "columns" ? this.model.dataSource.columns.splice(droppedPosition, 0, droppedItem[0]) : droppedClass == "values" ? (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? this.model.dataSource.values[0]["measures"].splice(droppedPosition, 0, droppedItem[0]) : this.model.dataSource.values.splice(droppedPosition, 0, droppedItem[0])) : this.model.dataSource.filters.splice(droppedPosition, 0, droppedItem[0]);
                    }
                    else
                        droppedClass == "e-rows" ? this.model.dataSource.rows.push(droppedItem[0]) : droppedClass == "columns" ? this.model.dataSource.columns.push(droppedItem[0]) : droppedClass == "values" ? this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? this.model.dataSource.values[0]["measures"].push(droppedItem[0]) : this.model.dataSource.values.push(droppedItem[0]) : this.model.dataSource.filters.push(droppedItem[0]);

                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this._calculatedField.length > 0 && droppedClass != "values") {
                        if (this._schemaData != null)
                            this._calcFieldNodeDrop(droppedItem[0]);
                        this.model.dataSource.values = $.grep(this.model.dataSource.values, function (value) {
                            return (ej.isNullOrUndefined(value.isCalculatedField) || value.isCalculatedField == false) || (value.isCalculatedField == true && value.formula.indexOf(droppedItem[0].fieldName) == -1);
                        });
                    }

                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        this.model.dataSource = this.clearDrilledItems(this.model.dataSource, { action: "pvtBtnDropped" },this);
                    }
                    if (this._schemaData != null) {
                        if (droppedClass == droppedAxis && droppedPosition > orignalPosition)
                            droppedPosition = droppedPosition - 1;
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                            this._schemaData.element.find("button[data-fieldName='" + headerText + "']").remove();
                        else
                            this._schemaData.element.find("#pivotButton" + headerText).parent().remove();
                        this._schemaData._createPivotButton(buttonFields, droppedClass == "e-rows" ? "row" : droppedClass == "columns" ? "column" : droppedClass == "e-drag" ? "filter" : droppedClass == "values" ? "value" : "", isFiltered, isSorted, droppedPosition);
                    }
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        if (!ej.isNullOrUndefined(this._waitingPopup))
                            this._waitingPopup.show();
                        this.getJSONData({ action: "pvtBtnDropped" }, this.model.dataSource, this);
                    }
                    else {
                        this.model.editCellsInfo = {};
                        this._populatePivotGrid();
                    }
                }
            }
            else
                this._removePvtBtn(args);
            if (!ej.isNullOrUndefined(this._schemaData))
            this._schemaData._setPivotBtnWidth();
        },

        _getDroppedItem1: function (headerText) {
            var isOlapMode = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? true : false;
            var droppedItem = $.grep(this.model.dataSource.columns, function (value) { return value.fieldName == headerText; });
            if (droppedItem.length > 0) this.model.dataSource.columns = $.grep(this.model.dataSource.columns, function (value) { return value.fieldName != headerText; });
            else {
                droppedItem = $.grep(this.model.dataSource.rows, function (value) { return value.fieldName == headerText; });
                if (droppedItem.length > 0) this.model.dataSource.rows = $.grep(this.model.dataSource.rows, function (value) { return value.fieldName != headerText; });
                else {
                    var valuesItems = this.model.dataSource.values;
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                    {
                        valuesItems = this.model.dataSource.values[0]["measures"];
                    }
                    droppedItem = $.grep(valuesItems, function (value) { return value.fieldName == headerText; });
                    if (droppedItem.length > 0)
                    {
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                            this.model.dataSource.values[0]["measures"] = $.grep(valuesItems, function (value) { return value.fieldName != headerText; });
                        else
                            this.model.dataSource.values = $.grep(valuesItems, function (value) { return value.fieldName != headerText; });
                    }
                    else {
                        droppedItem = $.grep(this.model.dataSource.filters, function (value) { return value.fieldName == headerText; });
                        if (droppedItem.length > 0) this.model.dataSource.filters = $.grep(this.model.dataSource.filters, function (value) { return value.fieldName != headerText; });
                    }
                }
            }
            return droppedItem;
        },
       
        _clearCollapsedItems: function (dragAxis, headerText, dataSource) {
            if (dragAxis == "rowheader") {
                dataSource.rows = $.map(dataSource.rows, function (value) { 
                    if ((value.drilledItems != undefined) && value.drilledItems.length){
                        value.drilledItems = $.map(value.drilledItems, function (values) { if (values.join("").indexOf(headerText.repItms.replace(/&/g, "&amp;")) < 0) return [values]; });
                    }
                    return value;
                });
            }
            else if (dragAxis == "colheader") {
                dataSource.columns = $.map(dataSource.columns, function (value) {
                    if ((value.drilledItems != undefined) && value.drilledItems.length) {
                        value.drilledItems = $.map(value.drilledItems, function (values) {
                            if (values.join("").indexOf(headerText.repItms.replace(/&/g, "&amp;")) < 0)
                                return [values];
                        });
                    }
                    return value;
                });
            }
            return dataSource;
        },

        _setSplitBtnTargetPos: function (args, droppedClass, element) {
            var targetPosition = ""; var AEBdiv; var targetSplitBtn; var className;
            if (element == "drop")
                targetSplitBtn = $(args.target).parents(".e-pivotButton");
            else
                targetSplitBtn = $(args.element).parents(".e-pivotButton");
            droppedClass = droppedClass == "column" ? "columns" : droppedClass == "row" ? "e-rows" : droppedClass == "filter" ? "e-drag" : droppedClass == "value" ? "values" : droppedClass;
            AEBdiv = this.element.find("." + droppedClass).children(".e-pivotButton");
            for (var i = 0; i < AEBdiv.length; i++) {
                if ($(AEBdiv[i]).attr("data-tag") == $(targetSplitBtn).attr("data-tag"))
                    targetPosition = i;
            }
            return targetPosition;
        },

        _pvtBtnDroppedSuccess: function (args) {
            var report = null;
            if (!ej.isNullOrUndefined(args[0]) && args.length > 0) {
                if (args[2] != null && args[2] != undefined)
                    this.model.customObject = args[2].Value;
            }
            else if (!ej.isNullOrUndefined(args.d) && args.d.length > 0) {
                if (args.d[2] != null && args.d[2] != undefined)
                    this.model.customObject = args.d[2].Value;
            }
            else if (!ej.isNullOrUndefined(args) && !ej.isNullOrUndefined(args.OlapReport)) {
                if (args != null && args.customObject != undefined)
                    this.model.customObject = args.customObject;
            }
            if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.customObject });
            if (!this.model.enableDeferUpdate)
                this._renderControlSuccess(args);
            else
                this._deferUpdateSuccess(args);
            if (this._schemaData != null)
                this._schemaData._refreshPivotButtons();
        },

        _deferUpdateSuccess: function (msg) {
            if (!ej.isNullOrUndefined(msg.PivotReport) || !ej.isNullOrUndefined(msg.OlapReport)) {
                ej.isNullOrUndefined(msg.PivotReport) ? this.setOlapReport(msg.OlapReport) : this.setOlapReport(msg.PivotReport);
                if (msg.HeaderCounts != undefined && $(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined)
                    this.model.pivotControl._pagerObj.initPagerProperties(JSON.parse(msg.HeaderCounts), JSON.parse(msg.PageSettings));
            }
            else {
                this.setOlapReport(msg.d[0].Value);
                if ($(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined)
                    this.model.pivotControl._pagerObj.initPagerProperties(JSON.parse(msg.d[2].Value), JSON.parse(msg.d[1].Value));
            }
            if (this.model.enableGroupingBar) {
                report = JSON.parse(this.getOlapReport());
                this._pivotTableFields = JSON.parse(report.ItemsProperties);
                this._createGroupingBar(report);
                this.element.find(".e-grpRow .e-rows").text("");
                this.element.find(".e-grpRow .e-rows").children().remove();
                this.element.find(".e-grpRow .e-rows").append(this._pivotRow);
                this._createFields(null, $("#" + this._id).find(".e-pivotGridTable").width(), $("#" + this._id).find(".e-pivotGridTable th").outerWidth());
            }
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this._calculatedField.length > 0 && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && this._schemaData != null)
                this._schemaButtonCreate();
            ej.Pivot.closePreventPanel(this);
        },

        _clientRemovePvtBtn: function (args) {
            ej.PivotAnalysis._valueSorting = null;
            if (!ej.isNullOrUndefined(this._waitingPopup))
                this._waitingPopup.show();
            var headerText = $($(args.target).siblings()[0]).attr("data-fieldName");
            delete this._fieldMembers[headerText.toLowerCase()];
            delete this._fieldSelectedMembers[headerText.toLowerCase()];
            if (this._calculatedField.length > 0 && $.grep(this.model.dataSource.values, function (value) { return value.fieldName == headerText; }).length > 0)
                this.model.dataSource.values = $.grep(this.model.dataSource.values, function (value) { return ((value.isCalculatedField == null || value.isCalculatedField == false) || value.formula.indexOf(headerText) == -1) && value.fieldName != headerText; });
            else
                ej.Pivot.removeReportItem(this.model.dataSource, headerText, headerText.toLocaleLowerCase().indexOf("measures") == 0);
            this.refreshControl();
            if (!ej.isNullOrUndefined(this._schemaData)) {
                    this._schemaData._tableTreeObj.element.find("li[data-tag='" + headerText + "']").removeClass("filter").find(".treeDrop,.filter").remove();
                    this._schemaData.refreshControl();
            }
        },

        _removePvtBtn: function (args) {
            this._isUpdateRequired = true;
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                var caption;
                if (args.type == "click") {
                    var headerText = $($(args.target).siblings()[0]).attr("data-fieldName"), selectedElement = "", uniqueName = "";
                    caption = $($(args.target).siblings()[0]).text();
                }
                else {
                    var headerText = args.element.attr("data-fieldName"), selectedElement = "", uniqueName = "";
                    caption = args.element.text();
                }
                for (var i = 0; i < this.element.find(".e-pivotButton").length; i++) {
                    uniqueName = $(this.element.find(".e-pivotButton")[i]).find("button").attr("data-fieldName");
                    if (uniqueName == headerText)
                        selectedElement = $(this.element.find(".e-pivotButton")[i]);
                }
                $(selectedElement).remove();
                if (this._schemaData != null) {
                    var schemaUncheck = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? this._schemaData._tableTreeObj.element.find("li [data-tag='" + headerText + "']") : this._schemaData._tableTreeObj.element.find("li[id='" + headerText + "']");
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && schemaUncheck.length == 0 && headerText.toLowerCase() == "measures") {
                        this._schemaData.element.find("div[data-tag='" + selectedElement.attr("data-tag") + "']").remove();
                        for (var i = 0; i < this.model.dataSource.values[0]["measures"].length; i++) {
                            this._schemaData._nodeCheck = true;
                            selectedTreeNode = this._schemaData._tableTreeObj.element.find("li[data-tag='" + this.model.dataSource.values[0]["measures"][i].fieldName + "']");
                            this._schemaData._tableTreeObj.uncheckNode(selectedTreeNode);
                            this.element.find("div[data-tag='values:" + this.model.dataSource.values[0]["measures"][i].fieldName + "']").remove();
                            this._schemaData.element.find("div[data-tag='values:" + this.model.dataSource.values[0]["measures"][i].fieldName + "']").remove();
                        }
                        this.model.dataSource.values[0]["measures"] = [];
                        if (!ej.isNullOrUndefined(this._waitingPopup))
                            this._waitingPopup.show();
                        this.getJSONData({ action: "removeBtn" }, this.model.dataSource, this);
                    }
                    this._schemaData._tableTreeObj.uncheckNode(schemaUncheck);
                }
                else {
                    this.model.dataSource.columns = $.grep(this.model.dataSource.columns, function (value) {
                        return value.fieldName != headerText;
                    });
                    this.model.dataSource.rows = $.grep(this.model.dataSource.rows, function (value) {
                      
                        return value.fieldName != headerText;
                    });
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        if ((selectedElement.attr("data-tag").split(":")[1].toLowerCase() == "measures")) {
                            this.model.dataSource.values[0]["measures"] = []
                        }
                        else if ((this._getItemPosition(this.model.dataSource.values[0]["measures"], selectedElement.attr("data-tag").split(":")[1])).length > 0)
                            this.model.dataSource.values[0]["measures"].splice(this._getItemPosition(this.model.dataSource.values[0]["measures"], selectedElement.attr("data-tag").split(":")[1])[0], 1);
                    }
                    else {
                        if (this._calculatedField.length > 0)
                            this.model.dataSource.values = $.grep(this.model.dataSource.values, function (value) { return ((value.isCalculatedField == null || value.isCalculatedField == false)|| value.formula.indexOf(headerText) == -1) && value.fieldName != headerText; });
                        else
                            this.model.dataSource.values = $.grep(this.model.dataSource.values, function (value) { return value.fieldName != headerText; });
                    }
                    this.model.dataSource.filters = $.grep(this.model.dataSource.filters, function (value) {
                        return value.fieldName != headerText;
                    });
                    if (this.model.analysisMode != ej.Pivot.AnalysisMode.Olap && this.model.operationalMode != ej.Pivot.OperationalMode.ClientMode) {
                        this.model.editCellsInfo = {};
                        this._populatePivotGrid();
                    }
                    else {
                        if (!ej.isNullOrUndefined(this._waitingPopup))
                            this._waitingPopup.show();
                        this.model.dataSource = this.clearDrilledItems(this.model.dataSource, { action: "removeButton" },this);
                        this.getJSONData({ action: "removeButton" }, this.model.dataSource, this);
                    }

                }
            }
            else {
                var headerText;
                if (args.type == "click") {
                    headerText = $($(args.target).siblings('button')).attr("data-fieldCaption");
                    var headerTag = $($(args.target).siblings('button')).parent().attr('data-tag');
                    var report, eventArgs;
                }
                else {
                    headerText = args.element.attr("data-fieldCaption");
                    var headerTag = args.element.parent().attr("data-tag"), eventArgs;
                }
                if (!ej.isNullOrUndefined(this._tempFilterData) && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    for (var j = 0; j < this._tempFilterData.length; j++) {
                        for (var key in this._tempFilterData[j]) {
                            if (key == headerTag.split(":")[1] && this._tempFilterData[j][headerTag.split(":")[1]] != "") {
                                this._tempFilterData.splice(j, 1);
                            }
                        }
                    }
                }
                delete this._fieldMembers[headerTag.split(':')[headerTag.split(':').length - 1]];
                delete this._fieldSelectedMembers[headerTag.split(':')[headerTag.split(':').length - 1]];
                filterTag = "", filterItems = "", selectedElement = "", headerTag = "", uniqueName = "", report = "";
                selectedElement = this.element.find(".e-pivotButton:contains(" + headerText + ")");
                for (var i = 0; i < this._pivotTableFields.length; i++) {
                    if (this._pivotTableFields[i].name == headerText) {
                        this._pivotTableFields[i].isSelected = false;
                        headerTag = this._pivotTableFields[i];
                    }
                }
                try {
                    report = JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.getOlapReport();
                }
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    headerTag = $(selectedElement).attr("data-tag");
                    var isKpi = ($(selectedElement).parents().hasClass("values") && headerTag.indexOf("[Measures]") == -1);
                    var uniqueName = (((headerTag.indexOf("[Measures]") > -1) || (headerTag.indexOf("KPI") > -1 || isKpi)) || (headerTag.indexOf("[") > -1)) ? headerTag.split(":")[1] : this._getNodeUniqueName(headerTag);
                    if (uniqueName == "[Measures]" || (uniqueName == "KPI" || isKpi)) {
                        headerTag = (isKpi) ? headerTag + ":KPI" : headerTag;
                        selectedElement.remove();
                        if (!ej.isNullOrUndefined(this._schemaData)) {
                            this._schemaData.element.find(".e-pivotButton:contains(" + headerText + ")").remove();
                            for (var i = 0; i < this._schemaData.model.pivotCalculations.length && (headerTag.indexOf("Measures") > -1 || (headerTag.indexOf("KPI") > -1 || ($(selectedElement).parents().hasClass("values") && headerTag.indexOf("[Measures]") == -1))) ; i++) {
                                uniqueName = this._schemaData.model.pivotCalculations[i].Tag;
                                this._schemaData._isMeasureBtnRemove = true;
                                selectedTreeNode = this._getNodeByUniqueName(uniqueName);
                                this._schemaData._tableTreeObj.uncheckNode(selectedTreeNode);
                            }
                        }
                        this._waitingPopup.show();                            
                        if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                            this._trigger("beforeServiceInvoke", { action: "removeButton", element: this.element, customObject: this.model.customObject });
                        var serializedCustomObject = JSON.stringify(this.model.customObject);
                        eventArgs = JSON.stringify({ "action": "removeButton", "headerInfo": headerTag, "currentReport": report, "gridLayout": this.model.layout, "customObject": serializedCustomObject });
                        if ((!ej.isNullOrUndefined(this._schemaData)) && (headerTag.indexOf("[Measures]") < 0 || headerTag.indexOf("KPI") < 0) && (headerTag.indexOf("Measures") >= 0 || headerTag.indexOf("KPI") >= 0)) {
                            this._schemaData.element.find(".e-schemaValue .e-pivotButton").remove()
                        }
                        if (this.model.enableDeferUpdate && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                            this._removeButtonDeferUpdate = true;
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.removeButton, eventArgs.replace("removeButton", "removeButtonDeferUpdate"), this._pvtBtnDroppedSuccess)
                            this.element.find(".schemaNoClick").removeClass("freeze");
							this._waitingPopup.hide(); 
                        }
                        else {
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.removeButton, eventArgs, this._pvtBtnDroppedSuccess);
                        }
                    }
                    else {
                        if (!ej.isNullOrUndefined(this._waitingPopup))
                            this._waitingPopup.show();
                        if (!ej.isNullOrUndefined(this._schemaData)) {
                            selectedTreeNode = this._getNodeByUniqueName(uniqueName);
                            this._schemaData._tableTreeObj.uncheckNode(selectedTreeNode);
                        }
                        else {
                            var serializedCustomObject = JSON.stringify(this.model.customObject);
                            eventArgs = JSON.stringify({ "action": "removeButton", "headerInfo": headerTag, "currentReport": report, "gridLayout": this.model.layout, "customObject": serializedCustomObject });
                            if (ej.isNullOrUndefined(headerTag))
                                return false;
                            if (!this.model.enableDeferUpdate)
                                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.removeButton, eventArgs, this._pvtBtnDroppedSuccess)
                            else {
                                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.removeButton, eventArgs.replace("removeButton", "removeButtonDeferUpdate"), this._pvtBtnDroppedSuccess)
                            }
                        }
                    }
                }
                else {
                    filterTag = "schemaRow::" + headerTag.id + "::FILTERED" + filterItems;
                    var dropAxis = this._droppedClass != "" ? this._droppedClass : headerTag.pivotType == "PivotItem" ? "e-schemaRow" : "e-schemaValue", eventArgs, axisName, params;
                    this._droppedClass = "";
                    $(selectedElement).remove();
                    this._waitingPopup = this.element.data("ejWaitingPopup");
                    if (!ej.isNullOrUndefined(this._waitingPopup))
                        this._waitingPopup.show();
                    if (this._schemaData != null) {
                            var schemaUncheck = this._schemaData._tableTreeObj.element.find("li:contains('" + headerText + "')");
                            this._schemaData._tableTreeObj.uncheckNode(schemaUncheck);
                    }
                    else {
                        if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this._trigger("beforeServiceInvoke", { action: "nodeStateModified", element: this.element, customObject: this.model.customObject });
                        var serializedCustomObject = JSON.stringify(this.model.customObject);
                        eventArgs = JSON.stringify({ "action": "nodeStateModified", "headerTag": JSON.stringify(headerTag), "dropAxis": dropAxis + "::", "sortedHeaders": this._ascdes, "filterParams": filterTag, "currentReport": report, "valueSorting": JSON.stringify(this.model.valueSortSettings), "customObject": serializedCustomObject });
                        if (!this.model.enableDeferUpdate)
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.nodeStateModified, eventArgs, this._nodeStateModifiedSuccess);
                        else {
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.nodeStateModified, eventArgs.replace("nodeStateModified", "nodeStateModifiedDeferUpdate"), this._nodeStateModifiedSuccess);
                        }
                    }
                }
            }
        },

        _getNodeUniqueName: function (headerTag) {
            var uniqueName = "", selectedTreeNode = null;
            for (var i = 0; i < (headerTag.split(':')[1]).split('.').length; i++) {
                if (uniqueName != "")
                    uniqueName += ".";
                uniqueName += "[" + ((headerTag.split(':')[1]).split('.')[i]) + "]";
            }
            return uniqueName;
        },

        _getNodeByUniqueName: function (nodeUniqueName) {
            var selectedTreeNode = null;
            for (var i = 0; i < $(this._schemaData._tableTreeObj.element.find("li")).length; i++) {
                if ($(this._schemaData._tableTreeObj.element.find("li")[i]).attr("data-tag").toLowerCase() == nodeUniqueName.toLowerCase())
                    selectedTreeNode = $((this._schemaData._tableTreeObj.element.find("li"))[i]);
            }

            return selectedTreeNode;
        },

        _nodeStateModifiedSuccess: function (report) {
            if (report[0] != undefined) {
                if (report[2] != null && report[2] != undefined)
                    this.model.customObject = report[2].Value;
            }
            else if (report.d != undefined) {
                if (report.d[2] != null && report.d[2] != undefined)
                    this.model.customObject = report.d[2].Value;
            }
            else {
                if (report.customObject != null && report.customObject != undefined)
                    this.model.customObject = report.customObject;
            }
            if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "nodeStateModified", element: this.element, customObject: this.model.customObject });
            if (!this.model.enableDeferUpdate)
                this._renderControlSuccess(report);
            else
                this._deferUpdateSuccess(report);
        },

        _drillDownSuccess: function (msg) {
            if (msg[0] != undefined) {
                this.setJSONRecords(msg[0].Value);
                this.setOlapReport(msg[1].Value);
                if (!ej.isNullOrUndefined(this._pivotClientObj)) {
                    this._pivotClientObj.currentReport = JSON.parse(msg[1].Value).Report;
                    if (msg[2].Value != undefined && msg[2].Value != "undefined")
                        this._pivotClientObj.reports = msg[2].Value;
                }
                if (msg[3] != null && msg[3] != undefined && msg[3].Key == "PageSettings") {
                    if (this.model.enableVirtualScrolling) {
                        this._categPageCount = Math.ceil(JSON.parse(msg[4].Value).Column / JSON.parse(msg[3].Value).CategoricalPageSize);
                        this._seriesPageCount = Math.ceil(JSON.parse(msg[4].Value).Row / JSON.parse(msg[3].Value).SeriesPageSize);
                        this._categCurrentPage = JSON.parse(msg[3].Value).CategoricalCurrentPage;
                        this._seriesCurrentPage = JSON.parse(msg[3].Value).SeriesPageSize;
                    }
                    else if (this._pagerObj !=null && $(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined)
                        this._pagerObj.initPagerProperties(JSON.parse(msg[4].Value), JSON.parse(msg[3].Value));
                    else if (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj._pagerObj != null) {
                        this._pivotClientObj._pagerObj.initPagerProperties(JSON.parse(msg[4].Value), JSON.parse(msg[3].Value));
                    }
                    if (msg[5] != null && msg[5] != undefined)
                        this.model.customObject = msg[5].Value;
                }
                if (msg[3] != null && msg[3] != undefined && msg[3].Key != "PageSettings")
                    this.model.customObject = msg[3].Value;
            }
            else if (msg.d != undefined) {
                this.setJSONRecords(msg.d[0].Value);
                this.setOlapReport(msg.d[1].Value);
                if (!ej.isNullOrUndefined(this._pivotClientObj)) {
                    this._pivotClientObj.currentReport = JSON.parse(msg.d[1].Value).Report;
                    if (msg.d[2].Value != undefined && msg.d[2].Value != "undefined")
                        this._pivotClientObj.reports = msg.d[2].Value;
                    this._updatePageSettings(msg.d, this._pivotClientObj);
                }
                if (msg.d[3] != null && msg.d[3] != undefined && msg.d[3].Key == "PageSettings") {
                    if (this.model.enableVirtualScrolling || ((!ej.isNullOrUndefined(this._pivotClientObj)) && this._pivotClientObj.model.enableVirtualScrolling)) {
                        this._categPageCount = Math.ceil(JSON.parse(msg.d[4].Value).Column / JSON.parse(msg.d[3].Value).CategoricalPageSize);
                        this._seriesPageCount = Math.ceil(JSON.parse(msg.d[4].Value).Row / JSON.parse(msg.d[3].Value).SeriesPageSize);
                        this._categCurrentPage = JSON.parse(msg.d[3].Value).CategoricalCurrentPage;
                        this._seriesCurrentPage = JSON.parse(msg.d[3].Value).SeriesCurrentPage;
                    }
                    else if (this._pagerObj != null && $(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined)
                        this._pagerObj.initPagerProperties(JSON.parse(msg.d[4].Value), JSON.parse(msg.d[3].Value));
                    else if (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj._pagerObj != null) {
                        this._pivotClientObj._pagerObj.initPagerProperties(JSON.parse(msg.d[4].Value), JSON.parse(msg.d[3].Value));
                    }
                    if (msg.d[5] != null && msg.d[5] != undefined)
                        this.model.customObject = msg.d[5].Value;
                }
                if (msg.d[3] != null && msg.d[3] != undefined && msg.d[3].Key != "PageSettings")
                    this.model.customObject = msg.d[3].Value;
            }
            else {
                if (ej.isNullOrUndefined(msg.PivotRecords)) {
                    if (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj._waitingPopup != null) {
                        this._pivotClientObj._isTimeOut = false;
                            this._pivotClientObj._waitingPopup.hide();
                    }
                    else if (!ej.isNullOrUndefined(this._pivotClientObj)) {
                        this._pivotClientObj._isTimeOut = false;
                        this._pivotClientObj._waitingPopup.hide();
                    }
                    else if (ej.isNullOrUndefined(this._pivotClientObj)) {
                        this._waitingPopup = this.element.data("ejWaitingPopup");
                        this._waitingPopup.hide();
                    }
                    return false;
                }
                this.setJSONRecords(msg.PivotRecords);
                this.setOlapReport(msg.OlapReport);
                if (!ej.isNullOrUndefined(this._pivotClientObj)) {
                    this._pivotClientObj.currentReport = JSON.parse(msg.OlapReport).Report;
                    if (msg.ClientReports != undefined && msg.ClientReports != "undefined")
                        this._pivotClientObj.reports = msg.ClientReports;
                    if ((msg.PageSettings != undefined && msg.PageSettings != null) && this._pivotClientObj._pagerObj != null) {
                        this._pivotClientObj._pagerObj.initPagerProperties(JSON.parse(msg.HeaderCounts), JSON.parse(msg.PageSettings));
                    }
                }
                if (msg.PageSettings != undefined && msg.PageSettings != null) {
                    if (this.model.enableVirtualScrolling || ((!ej.isNullOrUndefined(this._pivotClientObj)) && this._pivotClientObj.model.enableVirtualScrolling)) {
                        this._categPageCount = Math.ceil(JSON.parse(msg.HeaderCounts).Column / JSON.parse(msg.PageSettings).CategoricalPageSize);
                        this._seriesPageCount = Math.ceil(JSON.parse(msg.HeaderCounts).Row / JSON.parse(msg.PageSettings).SeriesPageSize);
                        this._categCurrentPage = JSON.parse(msg.PageSettings).CategoricalCurrentPage;
                        this._seriesCurrentPage = JSON.parse(msg.PageSettings).SeriesCurrentPage;
                    }
                    else if (this._pagerObj && $(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined)
                        this._pagerObj.initPagerProperties(JSON.parse(msg.HeaderCounts), JSON.parse(msg.PageSettings));
                }
                if (msg.customObject != null && msg.customObject != undefined)
                    this.model.customObject = msg.customObject;
            }
            if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "drillDown", element: this.element, customObject: this.model.customObject });
            if (this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout && this.model.enableVirtualScrolling == false && $(".e-pivotpager")[0] == null)
                this.excelLikeLayout(this.getJSONRecords());
            else
            this.renderControlFromJSON(this.getJSONRecords());
            try {
                this.model.currentReport = JSON.parse(this.getOlapReport()).Report;
            }
            catch (err) {
                this.model.currentReport = this.getOlapReport();
            }
            if (!ej.isNullOrUndefined(this._pivotClientObj))
                this._pivotClientObj._trigger("gridDrillSuccess", this.element);
            this._trigger("drillSuccess", this.element);
            if (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj._waitingPopup != null) {
                if ($("#" + this._pivotClientObj._id + "_maxView")[0] && this._maxViewLoading) {
                    this._maxViewLoading.hide();
                    this._pivotClientObj._waitingPopup.hide();
                }
                else if (this._pivotClientObj.model.displaySettings.mode == "gridOnly")
                    this._pivotClientObj._waitingPopup.hide();
            }
            else if (!ej.isNullOrUndefined(this._pivotClientObj)) {
                if (this._pivotClientObj && !this._pivotClientObj._pivotGrid._startDrilldown && !this._pivotClientObj._pivotChart._startDrilldown || this._pivotClientObj.model.displaySettings.mode == "gridOnly")
                    this._pivotClientObj._isTimeOut = false;
                    this._pivotClientObj._waitingPopup.hide();
            }
            else if (ej.isNullOrUndefined(this._pivotClientObj)) {
                this._waitingPopup = this.element.data("ejWaitingPopup");
                this._waitingPopup.hide();
            }
            if (!ej.isNullOrUndefined(this._pivotClientObj)) {
                this._pivotClientObj._isTimeOut = false;
                this._pivotClientObj._pivotGrid._startDrilldown = false;
            }
            else
                this._waitingPopup.hide();
            var eventArgs = { action: this._drillAction, customObject: this.model.customObject, element: this.element };
            this._trigger("renderSuccess", eventArgs);
        },
		
        saveReport: function (name, storage, url) {
            var mode;
            if (storage.toLowerCase() == "local")
                this._trigger("saveReport", ({ report: this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? this.model.dataSource : this.getOlapReport() }));
            else {
                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                    report = JSON.stringify(this.model.dataSource);
                    mode = "clientMode";
                }
                else if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    report = JSON.parse(this.getOlapReport()).Report;
                    mode = "serverMode";
                }
                if (this.model.beforeServiceInvoke != null)
                    this._trigger("beforeServiceInvoke", { action: "saveReport", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                this.doAjaxPost("POST", url + "/" + this.model.serviceMethodSettings.saveReport, JSON.stringify({
                    "reportName": name, "clientReports": report, "operationalMode": mode, "customObject": serializedCustomObject
                }));
            }
        },

        loadReport: function (name, storage, url) {
            var args, mode;
            this._waitingPopup.show();
            if (storage.toLowerCase() == "local") {
                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                    this._trigger("loadReport", { targetControl: this, dataModel: this.model.analysisMode });
                    this.refreshPivotGrid();
                }
                else {
                    this._trigger("loadReport", { targetControl: this, dataModel: this.model.analysisMode });
                    var clientReports;
                    try {
                        clientReports = JSON.parse(this.getOlapReport()).Report;
                    }
                    catch (err) {
                        clientReports = this.getOlapReport();
                    }
                    if (this.model.beforeServiceInvoke != null)
                        this._trigger("beforeServiceInvoke", { action: "loadReport", element: this.element, customObject: this.model.customObject });
                    var serializedCustomObject = JSON.stringify(this.model.customObject);
                    args = JSON.stringify({ "action": "loadReport", "gridLayout": this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? this.model.layout : this.layout(), "enablePivotFieldList": this.model.enablePivotFieldList, "reportName": name, "operationalMode": "serverMode", "clientReports": clientReports, "customObject": serializedCustomObject });
                    this.doAjaxPost("POST", url + "/" + this.model.serviceMethodSettings.loadReport, args, this._loadReportSuccess);
                }
            }
            else {
                if (this.model.beforeServiceInvoke != null)
                    this._trigger("beforeServiceInvoke", { action: "loadReport", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                    mode = "clientMode";
                    this.doAjaxPost("POST", url + "/" + this.model.serviceMethodSettings.loadReport, JSON.stringify({ "action": "loadReport", "gridLayout": this.layout(), "enablePivotFieldList": this.model.enablePivotFieldList, "reportName": name, "operationalMode": mode, "customObject": serializedCustomObject }), this._loadReportSuccess);
                }
                else if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    mode = "serverMode";
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        args = JSON.stringify({ "action": "loadReport", "reportName": name, "gridLayout": this.model.layout, "enablePivotFieldList": this.model.enablePivotFieldList, "operationalMode": mode, "customObject": serializedCustomObject });
                    }
                    else
                        args = JSON.stringify({ "action": "loadReport", "gridLayout": this.layout(), "enablePivotFieldList": this.model.enablePivotFieldList, "reportName": name, "operationalMode": mode, "customObject": serializedCustomObject });
                    this.doAjaxPost("POST", url + "/" + this.model.serviceMethodSettings.loadReport, args, this._loadReportSuccess);
                }
            }
        },

        _loadReportSuccess: function (input) {
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
			(input.d != undefined && input.d.length > 0) ? this.setOlapReport(JSON.parse(input.d[0].Value)) : this.setOlapReport(JSON.parse(input.report));
            this.model.dataSource = this.getOlapReport();
            this.refreshPivotGrid();
            this._unWireEvents();
            this._wireEvents();
            }
            else {
                this._renderControlSuccess(input);
            }
            if (!ej.isNullOrUndefined(this._schemaData) && this.model.enablePivotFieldList) {
                this._schemaData._load();
            }
        },
		
        doAjaxPost: function (type, url, data, onSuccess, onComplete, customArgs) {
            if (ej.isNullOrUndefined(data["XMLA"]) && JSON.parse(data)["action"] != "cellEditing") 
                this.model.editCellsInfo = {};
            var contentType, dataType, successEvt, isAsync = true, withCred = (this.model.enableXHRCredentials || (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj.model.enableXHRCredentials));
            if ((data["XMLA"] == undefined))
                contentType = 'application/json; charset=utf-8', dataType = 'json', successEvt = $.proxy(onSuccess, this), isAsync = (((ej.browserInfo().name == "msie" && ej.browserInfo().version <= 9) || JSON.parse(data).action == "export") ? false : true);
            else
                contentType = 'text/xml', dataType = 'xml', data = data["XMLA"], successEvt = $.proxy(onSuccess, ej.olap.base, customArgs), isAsync = ((ej.browserInfo().name == "msie" && ej.browserInfo().version <= 9) ? false : (!ej.isNullOrUndefined(customArgs) && customArgs["action"] != "loadFieldElements") ? true : false);
            var post = {
                type: type,
                url: url,
                contentType: contentType,
                async: isAsync,
                dataType: dataType,
                data: data,
                success: successEvt,
                xhrFields: {
                    withCredentials: withCred
                },
                complete: ej.proxy(function (onComplete) {
                    $.proxy(onComplete, this);
                    var eventArgs = { "action": !ej.isNullOrUndefined(customArgs) && !ej.isNullOrUndefined(customArgs.action) ? customArgs.action : JSON.parse(data)["action"], "customObject": this.model.customObject, element: this.element };
                    this._trigger("renderComplete", eventArgs);
                }, this),
                error: ej.proxy(function (msg, textStatus, errorThrown) {
                    if (typeof this._waitingPopup != 'undefined' && this._waitingPopup != null)
                        this._waitingPopup.hide();
                    if (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj._waitingPopup != null)
                        this._pivotClientObj._waitingPopup.hide();
                    var eventArgs = { "action": this._drillAction != "" ? this._drillAction : "initialize", "customObject": this.model.customObject, "element": this.element, "Message": msg };
                    this._trigger("renderFailure", eventArgs);
                    this.renderControlFromJSON("");
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                        ej.Pivot._createErrorDialog(msg.statusText, this._getLocalizedLabels("Error"), this); msg.statusText
                }, this)
            };
            if (!withCred)
                delete post['xhrFields'];
            $.ajax(post);
        },

        doPostBack: function (url, params) {
            var form = $('<form>').attr({ 'action': url, 'method': 'POST', 'name': 'export' });
            var addParam = function (paramName, paramValue) {
                var input = $('<input type="hidden" title="params">').attr({
                    'id': paramName,
                    'name': paramName,
                    'value': paramValue
                }).appendTo(form);
            };
            for (var item in params)
                addParam(item, params[item]);
            form.appendTo(document.body).submit().remove();
        },

        _import: function (options) {
            if (window.FormData && this._isObject(options)) {
                var i, prop, formData = new FormData();
                for (prop in options) {
                    if (prop != "async")
                        formData.append(prop, options[prop]);
                }
                return formData;
            }
            else
                return options;
        },

        _isObject: function (obj) {
            if (typeof obj !== "object")
                return false;
            return Object.prototype.toString.call(obj) === "[object Object]";
        },

        refreshPagedPivotGrid: function (axis, pageNo) {
            this._isUpdateRequired = true;
            if (ej.isNullOrUndefined(this._pivotClientObj)) {
                this._waitingPopup = this.element.data("ejWaitingPopup");
                this._waitingPopup.show();
            }
            axis = axis.indexOf('categ') != -1 ? "categorical" : "series";
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                this._isNavigation = true;
                if (axis == "categorical")
                    this.model.dataSource.pagerOptions.categoricalCurrentPage = parseInt(pageNo);
                else
                    this.model.dataSource.pagerOptions.seriesCurrentPage = parseInt(pageNo);

                if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                    var report;
                    try {
                        report = JSON.parse(this.getOlapReport()).Report;
                    }
                    catch (err) {
                        report = this.getOlapReport();
                    }
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.paging, JSON.stringify({ "action": "paging", "axis": axis, "pageNo": pageNo, "drillHeaders": JSON.stringify(this._drillHeaders), "currentReport": report, "valueSorting": JSON.stringify(this.model.valueSortSettings), "customObject": JSON.stringify(this.model.customObject) }), this._renderControlSuccess);
                }
                else
                    this._refPaging();
                return false;
            }
            else if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                if (axis == "categorical")
                    this._categCurrentPage = parseInt(pageNo);
                else
                    this._seriesCurrentPage = parseInt(pageNo);
                ej.olap.base.getJSONData({ action: "navPaging" }, this.model.dataSource, this);
            }
            else {
                var report;
                try {
                    report = JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.getOlapReport();
                }
                if (!this.model.enableDeferUpdate)
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.paging, JSON.stringify({ "action": "paging", "pagingInfo": axis + ":" + pageNo, "currentReport": report, "layout": this.layout(), "customObject": JSON.stringify(this.model.customObject) }), this._renderControlSuccess);
                else {
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.paging, JSON.stringify({ "action": "pagingDeferUpdate", "pagingInfo": axis + ":" + pageNo, "currentReport": report, "layout": this.layout(), "customObject": JSON.stringify(this.model.customObject) }), this._deferUpdateSuccess);
                }
            }
        },

        _refPaging: function () {
            ej.PivotAnalysis._controlObj = this;
            ej.PivotAnalysis._colKeysCalcValues = $.extend(true, [], this._colKeysCalcValues);
            ej.PivotAnalysis._rowKeysCalcValues = $.extend(true, [], this._rowKeysCalcValues);
            ej.PivotAnalysis._tableKeysCalcValues = $.extend(true, [], this._tableKeysCalcValues);
            var pivotEngine = ej.PivotAnalysis._fillEngine(this.model);
            this.setJSONRecords(JSON.stringify(pivotEngine.json));
            if (this.model.enableGroupingBar)
                this._createGroupingBar(this.model.dataSource);
            this.renderControlFromJSON(pivotEngine.json);
        },

        excelLikeLayout: function (jsonObj) {
            this._excelRowCount = 0;
            for (var index = 0; index < jsonObj.length; index++) {
                if (parseInt(jsonObj[index].Index.split(',')[0]) == 0)
                    this._excelRowCount++;
                else
                    break;
            }
            this._rowCount = this._excelRowCount;
            var copiedObject = jQuery.extend(true, [], jsonObj), excelLikeJSONRecords = [], tempRecord = [], measurePosition = null, tempColSpan = 0;
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                var olapReport = ($(this.element).parents(".e-pivotclient").length > 0 && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) ? this._pivotClientObj.getOlapReport() : this.getOlapReport();
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && ((this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && this.model.dataSource.rows.length == 0 && this.model.dataSource.data != null) || (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && olapReport !== "" && JSON.parse(olapReport).PivotRows.length == 0))) {
                this._excelLikeJSONRecords = null;
                if (!this._isExporting)
                    this.renderControlFromJSON();
                this._excelRowCount = 0;
                return;
            }
            else if (this.model.analysisMode != ej.Pivot.AnalysisMode.Pivot && copiedObject != null && copiedObject != "") {
                var colMeasurePos = null, colHeaderLen;
                //for (var pos = (copiedObject[0].CSS != "colheader" ? (copiedObject[0].ColSpan) * this._rowCount : 0) ; pos < (copiedObject[0].CSS != "colheader" ? (copiedObject[0].ColSpan * this._rowCount + copiedObject[0].RowSpan - 1) : copiedObject.length) && copiedObject[data-pos].CSS.indexOf("value") == -1 && this._dataModel != "Pivot"; pos++) {
                for (var pos = (copiedObject[0].CSS != "colheader" ? (copiedObject[0].ColSpan) * this._excelRowCount : 0) ; pos < copiedObject.length; pos++) {
                    if (copiedObject[pos].Info.toLowerCase().indexOf("[measure") > -1)
                        colMeasurePos = parseInt(copiedObject[pos].Index.split(',')[1]);
                    if (copiedObject[pos].CSS.indexOf("value") > -1)
                        break;
                    colHeaderLen = parseInt(copiedObject[pos].Index.split(',')[1]);
                }
                if (colMeasurePos != null && colMeasurePos != colHeaderLen && colMeasurePos != 0)
                    this._columnExcelLikeLayout(copiedObject, colMeasurePos, colHeaderLen);  // measure in middle,moved totals at last of the current item
                var columnCount = copiedObject.length / this._excelRowCount;
                for (var columnC = 0; columnC < columnCount && columnC < copiedObject.length; columnC++) {  //Moved total cell to top.
                    for (var rowC = 0; rowC <= colHeaderLen && rowC < copiedObject.length; rowC++) {
                        var index = columnC * this._excelRowCount + rowC;
                        if (copiedObject[index].CSS == "colheader" && copiedObject[index].Span != "Block" && (copiedObject[index].Info.toLowerCase().indexOf("[measure") == -1 ||(copiedObject[index].Info.toLowerCase().indexOf("[measure") > -1 &&  colMeasurePos != null && colMeasurePos == 0)) && copiedObject[index].ColSpan > 1) {
                            for (var i = index; i < index + copiedObject[index].RowSpan; i++) {
                                for (var j = i + this._excelRowCount; j < i + (copiedObject[index].ColSpan * this._excelRowCount) ; j = j + this._excelRowCount)
                                    copiedObject[j].Span = "Block";
                                if (i != index)
                                    copiedObject[i].Span = "Block";
                            }
                            var totalCell = index + (copiedObject[index].RowSpan - 1) + ((copiedObject[index].ColSpan - 1) * this._excelRowCount) + 1, parentIndex = null;
                            if (copiedObject[totalCell].CSS.indexOf("summary") > -1 && copiedObject[totalCell].Value == this._getLocalizedLabels("Total") && copiedObject[totalCell - this._excelRowCount].CSS.indexOf("summary") == -1)
                                parentIndex = totalCell;             //index + (copiedObject[index].RowSpan - 1) + ((copiedObject[index].ColSpan - 1) * this._rowCount) + 1;
                            else if (copiedObject[totalCell].CSS.indexOf("summary") > -1 && copiedObject[totalCell - this._excelRowCount].CSS.indexOf("e-summary") > -1) {
                                for (var i = totalCell - this._excelRowCount; i >= 0 && i < copiedObject.length; i = i - this._excelRowCount) {
                                    if (copiedObject[i].ColSpan > 1 || (copiedObject[i - this._excelRowCount].CSS.indexOf("e-summary") == -1 && this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode)) {
                                        parentIndex = i;  //Select total cell parent including unwanted total and multiple measure total.
                                        break;
                                    }
                                }
                            }
                            if (parentIndex != null) {
                                copiedObject[parentIndex].ColSpan = (this.model.operationalMode != ej.PivotGrid.OperationalMode.ClientMode ? copiedObject[parentIndex].ColSpan : (parseInt(copiedObject[totalCell].Index.split(",")[0]) - parseInt(copiedObject[parentIndex].Index.split(",")[0])) + 1);
                                copiedObject[index].ColSpan = copiedObject[index].ColSpan - copiedObject[parentIndex].ColSpan;
                                copiedObject[index + ((copiedObject[index].ColSpan) * this._excelRowCount)] = $.extend(true, {}, copiedObject[parentIndex]);
                                copiedObject[index + ((copiedObject[index].ColSpan) * this._excelRowCount)].RowSpan = copiedObject[parentIndex].RowSpan + copiedObject[index].RowSpan;
                                copiedObject[index + ((copiedObject[index].ColSpan) * this._excelRowCount)].Value = copiedObject[index].Value + " Total";
                            }
                        }
                    }
                }
            }
            if (copiedObject != null && copiedObject != "" && copiedObject[0].CSS != "colheader" && !(this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)) {
                if (copiedObject[0].Index == "0,0" && copiedObject[0].CSS != "colheader") {
                    tempColSpan = copiedObject[0].ColSpan;
                    if (copiedObject[0].RowSpan == 0)
                        copiedObject[0].RowSpan = 1;
                    for (var i = 0; i < copiedObject[0].RowSpan && i < copiedObject.length; i++) {
                        excelLikeJSONRecords.push(copiedObject[i]);
                        copiedObject[i].Level = 1;
                        copiedObject[i].Span = "Block";
                        //copiedObject[i].itemIndex = copiedObject[i].Index;
                    }
                }
                for (var pos = copiedObject[0].RowSpan; pos < copiedObject.length && this.model.analysisMode != ej.Pivot.AnalysisMode.Pivot && this.model.dataSource.rows.length > 0; pos = pos + this._excelRowCount) {
                    if (copiedObject[pos].Info.toLowerCase().indexOf("[measure") > -1) {
                        measurePosition = parseInt(copiedObject[pos].Index.split(',')[0]);
                        break;
                    }
                }
                for (var index = 0; index < copiedObject.length && index < this._excelRowCount; index++) {
                    if (copiedObject[index].CSS == "rowheader" && parseInt(copiedObject[index].Index.split(',')[0]) == 0 && copiedObject[index].Span != "Block") {
                        copiedObject[index].Level = 1;
                        if (copiedObject[index + this._excelRowCount] != null && copiedObject[index + this._excelRowCount].CSS.indexOf("value") == -1)
                            copiedObject[index].itemIndex = copiedObject[index + copiedObject[index].RowSpan - (this.model.analysisMode != ej.Pivot.AnalysisMode.Pivot ? 1 : 0)].Index;
                        excelLikeJSONRecords.push(copiedObject[index]);
                        if (measurePosition != null && measurePosition == 0 && copiedObject[index].Info.toLowerCase().indexOf("[measure") > -1)
                            tempRecord.push(copiedObject[index]);
                        for (var i = index + 1; i < index + copiedObject[index].RowSpan; i++) {
                            if (copiedObject[i].Info.toLowerCase().indexOf("[measure") == -1 || measurePosition != null && measurePosition != tempColSpan - 1)
                                copiedObject[i].Span = "Block";
                        }
                        this._rowExcelLikeLayout(index, copiedObject, excelLikeJSONRecords, 2, measurePosition, tempRecord, tempColSpan);
                    }
                    else if ((copiedObject[index].CSS == "summary rgtot" || copiedObject[index].CSS == "summary gtot" || copiedObject[index].CSS == "summary calc gtot" || (copiedObject[index].CSS == "colheader" && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) || (((copiedObject[index].CSS == "summary" && copiedObject[index].Value.indexOf(this._getLocalizedLabels("Total")) > -1) || copiedObject[index].CSS == "summary row") && this.model.analysisMode != ej.Pivot.AnalysisMode.Pivot)) && parseInt(copiedObject[index].Index.split(',')[0]) == 0) {
                        if (measurePosition != null && measurePosition == tempColSpan - 1)
                            copiedObject[index].Value += " " + copiedObject[index + (this._excelRowCount * parseInt(copiedObject[index].ColSpan))].Value;
                        copiedObject[index].Value = copiedObject[index].Value == this._getLocalizedLabels("Total") ? this._getLocalizedLabels("GrandTotal") : copiedObject[index].Value;
                        excelLikeJSONRecords.push(copiedObject[index]);
                        copiedObject[index].Level = 1;
                    }
                }
                if (measurePosition != null && measurePosition == 0) {
                    for (var index = 0; index < tempRecord.length; index++) {
                        excelLikeJSONRecords.push($.extend(true, {}, tempRecord[index]));
                        excelLikeJSONRecords[excelLikeJSONRecords.length - 1].CSS = "summary";
                        excelLikeJSONRecords[excelLikeJSONRecords.length - 1].Value = this._getLocalizedLabels("Total")+" " + excelLikeJSONRecords[excelLikeJSONRecords.length - 1].Value;
                    }
                    tempRecord.splice(0, tempRecord.length);
                }
                var len = excelLikeJSONRecords.length, currentIndex = 0, valueIndex, nextIndex;
                var isInsertable = false;
                for (var index = 0; index < len; index++) {
                    currentIndex = currentIndex + index;
                    valueIndex = excelLikeJSONRecords[index].itemIndex != null ? excelLikeJSONRecords[index].itemIndex : excelLikeJSONRecords[index].Index;
                    nextIndex = (parseInt(valueIndex.split(',')[0]) * this._excelRowCount + (parseInt(valueIndex.split(',')[1])));
                    for (var nextItem = nextIndex ; nextItem < copiedObject.length; nextItem = nextItem + this._excelRowCount) {
                        if (((copiedObject[nextItem].CSS.indexOf("value") > -1 || copiedObject[nextItem].CSS.indexOf("colheader") > -1 || copiedObject[nextItem].CSS.indexOf("calc") > -1 || copiedObject[nextItem].CSS.indexOf("cstot") > -1 || copiedObject[nextItem].CSS.indexOf("cgtot") > -1) || copiedObject[nextItem].CSS.indexOf("none") > -1) && parseInt(copiedObject[nextItem].Index.split(',')[0]) >= tempColSpan)
                            isInsertable = true;
                        if (isInsertable) {
                            currentIndex = currentIndex + (this.model.analysisMode != ej.Pivot.AnalysisMode.Pivot ? parseInt(len) : this._excelRowCount);
                            excelLikeJSONRecords[currentIndex] = $.extend(true, {}, copiedObject[nextItem]);
                        }
                    }
                    currentIndex = 0;
                    isInsertable = false;
                }
                for (var index = 0; index < len; index++) {
                    if (excelLikeJSONRecords[index] != null) {
                        excelLikeJSONRecords[index].Span = "none";
                        if (isNaN(excelLikeJSONRecords[index].Level))
                            excelLikeJSONRecords[index].Level = 1;
                        // excelLikeJSONRecords[index].Index = '0,' + index + '';
                        if (!(excelLikeJSONRecords[index].Index == "0,0" && excelLikeJSONRecords[index].CSS != "colheader" && index == 0))
                            excelLikeJSONRecords[index].RowSpan = 1;
                        if (measurePosition != null && measurePosition == tempColSpan - 1 && excelLikeJSONRecords[index].CSS == "rowheader" && excelLikeJSONRecords[index].Info.toLowerCase().indexOf("[measure") == -1)
                            excelLikeJSONRecords[index].ColSpan = excelLikeJSONRecords.length / len;
                        else if (measurePosition != null && measurePosition == 0 && (excelLikeJSONRecords[index].Info.toLowerCase().indexOf("[measure") > -1 && (excelLikeJSONRecords[index].CSS == "rowheader")))
                            excelLikeJSONRecords[index].ColSpan = excelLikeJSONRecords.length / len;
                        else if (measurePosition != null && measurePosition != tempColSpan - 1 && measurePosition != 0 && (excelLikeJSONRecords[index].Info.toLowerCase().indexOf("[measure") > -1 || (excelLikeJSONRecords[index].CSS == "rowheader" && parseInt(excelLikeJSONRecords[index].Index.split(",")[0]) < measurePosition)))
                            excelLikeJSONRecords[index].ColSpan = excelLikeJSONRecords.length / len;
                        else
                            excelLikeJSONRecords[index].ColSpan = 1;
                    }
                }
                this._excelRowCount = len;
            }
            if (copiedObject != null && excelLikeJSONRecords.length == 0)
                excelLikeJSONRecords = copiedObject;
            for (var i = 0; i < excelLikeJSONRecords.length / this._excelRowCount ; i++) {
                for (var j = 0; j < this._excelRowCount ; j++) {
                    excelLikeJSONRecords[i * this._excelRowCount + j].i = "" + i + "," + j + "";
                    excelLikeJSONRecords[i * this._excelRowCount + j].Span = "none";
                }
            }
            this._excelLikeJSONRecords = excelLikeJSONRecords;
            if (!this._isExporting)
                this.renderControlFromJSON();

        },
        _rowExcelLikeLayout: function (index, copiedObject, excelLikeJSONRecords, level, measurePosition, tempRecord,tempColSpan) {
            var isMeasure = false;
            for (var rowCellIndex = index + (this.model.analysisMode != ej.Pivot.AnalysisMode.Pivot ? copiedObject[index].ColSpan * this._excelRowCount : this._excelRowCount), span = 0; span < copiedObject[index].RowSpan && rowCellIndex < copiedObject.length && (copiedObject[rowCellIndex].CSS.indexOf("value")==-1) ; rowCellIndex++, span++) {
                if ((measurePosition != null && measurePosition != tempColSpan - 1 && measurePosition != 0) && copiedObject[rowCellIndex].Info.toLowerCase().indexOf("[measure")>-1 && copiedObject[rowCellIndex].Span != "Block")
                    isMeasure = true;
                var isMeasureLast = (measurePosition != null && measurePosition == tempColSpan - 1) ? (copiedObject[rowCellIndex].CSS == "summary row" && (copiedObject[rowCellIndex + this._excelRowCount].CSS == "summary row" || copiedObject[rowCellIndex + this._excelRowCount].CSS == "none" || copiedObject[rowCellIndex + this._excelRowCount].Info.toLowerCase().indexOf("[measure") > -1)) : (measurePosition != null && measurePosition != tempColSpan - 1 && measurePosition != 0) ? (copiedObject[rowCellIndex].CSS == "summary" && (copiedObject[rowCellIndex + this._excelRowCount].CSS == "summary" || copiedObject[rowCellIndex + this._excelRowCount].CSS == "none" || copiedObject[rowCellIndex + this._excelRowCount].Info.toLowerCase().indexOf("[measure") > -1 || parseInt(copiedObject[rowCellIndex].Index.split(",")[0]) - 1 <= measurePosition)) : false;
                if (((copiedObject[rowCellIndex].CSS == "rowheader" || copiedObject[rowCellIndex].CSS == "none") || isMeasureLast) && copiedObject[rowCellIndex].Span != "Block") {
                    for (var i = rowCellIndex + 1; i < rowCellIndex + copiedObject[rowCellIndex].RowSpan; i++) {
                        if (copiedObject[i].Info.toLowerCase().indexOf("[measure") == -1 || measurePosition != null && measurePosition != tempColSpan - 1)
                            copiedObject[i].Span = "Block";
                    }
                    copiedObject[rowCellIndex].Level = level;
                    if (copiedObject[rowCellIndex].CSS != "none") {
                        if (copiedObject[rowCellIndex + this._excelRowCount] != null && copiedObject[rowCellIndex + this._excelRowCount].CSS.indexOf("value") == -1)
                            copiedObject[rowCellIndex].itemIndex = copiedObject[rowCellIndex + copiedObject[rowCellIndex].RowSpan - (this.model.analysisMode != ej.Pivot.AnalysisMode.Pivot ? 1 : 0)].Index;
                        if (isMeasureLast) {
                            for (var rowIndex = rowCellIndex - copiedObject[index].ColSpan * this._excelRowCount; rowIndex >= 0 && rowIndex < copiedObject.length; rowIndex--) {
                                if (copiedObject[rowIndex].Value != "") {
                                    copiedObject[rowCellIndex].Value = copiedObject[rowIndex].Value;
                                    copiedObject[rowCellIndex].Level = copiedObject[index].Level; //== 1 ? 1 : (copiedObject[index].Level - 2) <= 1 ? ;
                                    break;
                                }
                            }
                            if ((measurePosition != null && measurePosition != tempColSpan - 1 && measurePosition != 0) && parseInt(copiedObject[rowCellIndex].Index.split(",")[0]) - 1 == measurePosition)
                                tempRecord.push(copiedObject[rowCellIndex]);
                            else {
                                copiedObject[rowCellIndex].Value += " " + copiedObject[rowCellIndex + (this._excelRowCount * parseInt(copiedObject[rowCellIndex].ColSpan))].Value;
                                excelLikeJSONRecords.push(copiedObject[rowCellIndex]);
                            }
                        }
                        else
                            excelLikeJSONRecords.push(copiedObject[rowCellIndex]);
                    }
                    copiedObject[rowCellIndex].Span = "Block";
                    if (copiedObject[rowCellIndex].CSS != "summary row" && copiedObject[rowCellIndex].CSS != "summary")
                        this._rowExcelLikeLayout(rowCellIndex, copiedObject, excelLikeJSONRecords, level + 1, measurePosition, tempRecord, tempColSpan);
                }
                if (isMeasure && span + 1 == copiedObject[index].RowSpan) {
                    isMeasure = false;
                    for (var i = 0; i < tempRecord.length; i++) {
                        // tempRecord[i].Value = tempRecord[i].Value.split(" ")[0];
                        tempRecord[i].Value = copiedObject[index].Value + " " + tempRecord[i].Value;
                        excelLikeJSONRecords.push(tempRecord[i]);
                    }
                    tempRecord.splice(0, tempRecord.length);
                }
            }
        },
        _columnExcelLikeLayout: function (copiedObject, colMeasurePos, colHeaderLen) {    //Moves total to last of current item, when measure is above 1
            var columnCount = copiedObject.length / this._excelRowCount;
            for (var columnC = 0; columnC < columnCount && columnC < copiedObject.length; columnC++) {
                for (var rowC = 0; rowC <= colHeaderLen && rowC < copiedObject.length; rowC++) {
                    var index = columnC * this._excelRowCount + rowC;
                    if (copiedObject[index].CSS == "colheader" && copiedObject[index].Span != "Block" && copiedObject[index].Info.toLowerCase().indexOf("[measure") == -1 && copiedObject[index].ColSpan > 1) {
                        for (var i = index; i < index + copiedObject[index].RowSpan; i++) {
                            for (var j = i + this._excelRowCount; j < i + (copiedObject[index].ColSpan * this._excelRowCount) ; j = j + this._excelRowCount)
                                copiedObject[j].Span = "Block";
                            if (i != index)
                                copiedObject[i].Span = "Block";
                        }
                        var measureCell = index + (copiedObject[index].RowSpan - 1) + ((copiedObject[index].ColSpan - 1) * this._excelRowCount) + 1;
                        if (copiedObject[measureCell].Info.toLowerCase().indexOf("[measure") > -1 && JSON.parse(this.getOlapReport()).PivotCalculations.length > 1 && colMeasurePos != null && colMeasurePos != colHeaderLen && colMeasurePos != 0) {
                            //var start = parseInt(copiedObject[index].Index.split(",")[0]), end = parseInt(copiedObject[measureCell - 1].Index.split(",")[0]);
                            var removeIndex = [];
                            for (var i = index + (copiedObject[index].RowSpan) ; i <= measureCell; i = i + (copiedObject[i].ColSpan + 1) * this._excelRowCount) { //loop from start to end of the current item for slecting measure totals
                                var totalCell = i + (copiedObject[i].RowSpan - 1) + ((copiedObject[i].ColSpan - 1) * this._excelRowCount) + 1;
                                if (copiedObject[totalCell].CSS.indexOf("summary") > -1) {       //&& copiedObject[totalCell].Value == "Total" && copiedObject[totalCell - this._rowCount].CSS.indexOf("summary") == -1) {                                     copiedObject[totalCell].Value = "";
                                    copiedObject[totalCell - 1].RowSpan = copiedObject[totalCell - 1].RowSpan + copiedObject[totalCell].RowSpan;
                                    var colToDel = (parseInt(copiedObject[totalCell].Index.split(',')[0]) * this._excelRowCount);
                                    for (var j = 0; j < this._excelRowCount; j++)
                                        copiedObject.splice((parseInt(copiedObject[measureCell].Index.split(',')[0]) * this._excelRowCount + this._excelRowCount) + j + removeIndex.length * this._excelRowCount, 0, $.extend(true, {}, copiedObject[colToDel + j]));  //Insert total cell column at last of current item and store that index
                                    removeIndex.push(colToDel);
                                    copiedObject[i].ColSpan = copiedObject[i].ColSpan - 1;
                                }
                            }
                            for (var colIndex = removeIndex.length - 1; colIndex >= 0; colIndex--)
                                copiedObject.splice((parseInt(copiedObject[removeIndex[colIndex]].Index.split(',')[0]) * this._excelRowCount), this._excelRowCount); // after inserting all totals for current item at last , remove the column at initial posiiton
                            if (removeIndex.length > 0) {
                                copiedObject[index].ColSpan = copiedObject[index].ColSpan - removeIndex.length;
                                var newTotal = index + ((copiedObject[index].ColSpan) * this._excelRowCount);
                                copiedObject[newTotal].ColSpan = removeIndex.length;
                                copiedObject[newTotal].RowSpan = copiedObject[index].RowSpan;
                                copiedObject[newTotal].Value = copiedObject[index].Value + " Total";
                                copiedObject[newTotal].CSS = "summary";
                                copiedObject[newTotal].Span = "none";
                                copiedObject[newTotal].State = 0;
                            }
                        }
                        else if (copiedObject[measureCell].Info.toLowerCase().indexOf("[measure") > -1 && copiedObject[measureCell + 1].CSS.indexOf("summary") > -1 && JSON.parse(this.getOlapReport()).PivotCalculations.length == 1 && colMeasurePos != null && colMeasurePos != colHeaderLen && colMeasurePos != 0) {
                            copiedObject[index].ColSpan = copiedObject[index].ColSpan - 1;
                            copiedObject[index + ((copiedObject[index].ColSpan) * this._excelRowCount)] = $.extend(true, {}, copiedObject[measureCell + 1]);
                            copiedObject[measureCell + 1].Value = "";
                            copiedObject[index + ((copiedObject[index].ColSpan) * this._excelRowCount)].Value = copiedObject[index].Value + " Total";
                            copiedObject[index + ((copiedObject[index].ColSpan) * this._excelRowCount)].RowSpan = copiedObject[index].RowSpan;
                        }
                    }
                }
            }
        },
        _getColumnIndices: function (axis, jsonValue, mValue,val) {
            var value = axis == "rows" ? jsonValue.Index.split(",")[1] : axis == "columns" ? jsonValue.Index.split(",")[0] : null;
            if (jsonValue.Value == mValue) {
                $.inArray(Number(value), val) == -1 ? val.push(Number(value)) : val;
            }
            return val;
        },
        
        _getParentPosition: function (axis, cellPos, range) {
            var lockValue = "", cellValue = "", parentIndex = "", cellPos = this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout && !$.isNumeric(cellPos) ? (parseInt(cellPos.split(',')[0]) * this._rowCount + parseInt(cellPos.split(',')[1])) : cellPos;
            while (cellValue == lockValue && !ej.isNullOrUndefined(this.getJSONRecords()[cellPos])) {
                cellValue = this.getJSONRecords()[cellPos].Value;
                if ((lockValue == "" && cellValue != "") || (lockValue == cellValue + " Total") || (lockValue + " Total" == cellValue))
                    lockValue = cellValue;
                if (axis == "columnheader" && range == "start")
                    cellPos = cellPos - this._rowCount;
                else if (axis == "rowheader" && range == "end")
                    cellPos++;
                parentIndex = cellValue == lockValue ? this.getJSONRecords()[cellPos].Index : parentIndex;
                if (axis == "columnheader" && range == "end")
                    cellPos = cellPos + this._rowCount;
                else if (axis == "rowheader" && range=="start")
                    cellPos--;
                cellValue = cellValue == "" ? lockValue : cellValue;
            }
            return parentIndex;
        },

        _updateRowCells: function (row, newTable, oldTable, cellPos, startParIndex, isFrozenHeader) {
            if (isFrozenHeader && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout)
                newTable.find("tbody:eq(2) tr:empty").remove();
            do {
                if (this.model.enableRTL)
                    $($(row).find('.summary,.rowheader,.colheader')).css("text-align", "right");
                var pos = $(row).next().children().first().attr("data-p"), pd = this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? "data-i" : "data-p";
                if (!ej.isNullOrUndefined(pos)) {
                    if (isFrozenHeader || this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout) {
                        if ($(row).children().length > 0)
                            oldTable.find("[" + pd + "$='," + parseInt($(row).children().first().attr(pd).split(',')[1]) + "']").parent().remove();
                    }
                    else
                        oldTable.find("[data-p='" + $(row).children().first().attr("data-p") + "']:not('.e-grpRow')").parent().remove();
                    if (cellPos != "" && oldTable.find("[data-p='" + cellPos + "']").parent().length > 0) {
                        if (!isFrozenHeader)
                            $(row).clone().insertBefore(oldTable.find("[data-p='" + cellPos + "']").parent());
                        if (isFrozenHeader) {
                            if ($(row).children().length > 0) {
                                var cnt = 0;
                                do {
                                    var oT = oldTable.find("[" + pd + "$='," + parseInt(cellPos.split(',')[1]) + "']").parent().eq(cnt);
                                    var nT = newTable.find("[" + pd + "$='," + parseInt($(row).children().first().attr(pd).split(',')[1]) + "']").parent().eq(cnt).clone();
                                    if ($(oT).length > 0)
                                        $(nT).insertBefore($(oT));
                                    else
                                        $(nT).insertAfter(oldTable.find("[" + pd + "$='," + parseInt(newTable.find("[" + pd + "$='," + parseInt($(row).children().first().attr(pd).split(',')[1]) + "']").parent().eq(cnt).prev().children().first().attr(pd).split(",")[1]) + "']").parent().eq(cnt));
                                    cnt++;
                                } while (cnt < 2);
                                if (this.layout().toLowerCase() != ej.PivotGrid.Layout.ExcelLikeLayout)
                                    oldTable.find("[" + pd + "$='," + parseInt(cellPos.split(',')[1]) + "']").parent().remove();
                            }
                        }
                        else if (this.layout().toLowerCase() != ej.PivotGrid.Layout.ExcelLikeLayout)
                            oldTable.find("[data-p='" + cellPos + "']").parent().remove();
                    }
                    else if (isFrozenHeader) {
                        if (oldTable.find("[" + pd + "$='," + parseInt(pos.split(',')[1]) + "']").parent().length == 0) {
                            var tmpRow = $(row).next();
                            do {
                                pos = $(tmpRow).next().children().length > 0 ? $(tmpRow).next().children().first().attr(pd) : pos;
                                tmpRow = $(tmpRow).next();
                            } while (oldTable.find("[" + pd + "$='," + parseInt(pos.split(',')[1]) + "']").parent().length == 0 && $(tmpRow).children().length > 0)
                        }
                        if ($(row).children().length > 0) {
                            var oT = oldTable.find("[" + pd + "$='," + parseInt(pos.split(',')[1]) + "']").parent();
                            var nT = newTable.find("[" + pd + "$='," + parseInt($(row).children().first().attr(pd).split(',')[1]) + "']").parent();
                            if ($(oT).length > 0) {
                                $(nT).eq(0).clone().insertBefore($(oT).eq(0));
                                $(nT).eq(1).clone().insertBefore($(oT).eq(1));
                            }
                            else {
                                $(nT).eq(1).clone().insertAfter(oldTable.find("tr:last"));
                                $(nT).eq(0).clone().insertAfter(oldTable.find(".rowhead tr:last"));
                            }
                        }
                    }
                    else if (this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout) {
                        $(row).clone().insertAfter(oldTable.find("tr:last"));
                    }
                    else {
                        if (oldTable.find("[data-p='" + pos + "']").parent().length == 0) {
                            var tmpRow = $(row).next();
                            do {
                                pos = $(tmpRow).next().children().first().attr("data-p");
                                tmpRow = $(tmpRow).next();
                            } while (oldTable.find("[data-p='" + pos + "']").parent().length == 0 && $(tmpRow).children().length > 0)
                        }
                        if (oldTable.find("[data-p='" + pos + "']").parent().length > 0)
                            $(row).clone().insertBefore(oldTable.find("[data-p='" + pos + "']").parent());
                        else
                            $(row).clone().insertAfter(oldTable.find("tr:last"));
                    }
                }
                else {
                    pos = $(row).children().first().attr("data-p");
                    if (oldTable.find("[data-p='" + pos + "']").length > 0 && this.layout().toLowerCase() != ej.PivotGrid.Layout.ExcelLikeLayout) {
                        if (cellPos != "" && oldTable.find("[data-p='" + cellPos + "']").parent().length > 0) {
                            $(row).clone().insertBefore(oldTable.find("[data-p='" + cellPos + "']").parent());
                            oldTable.find("[data-p='" + cellPos + "']").parent().remove();
                        }
                        else
                            $(row).clone().insertAfter(oldTable.find("[data-p='" + pos + "']").parent());
                    }
                    else {
                        if (isFrozenHeader) {
                            var nT = newTable.find("[" + pd + "$='," + parseInt($(row).children().first().attr(pd).split(',')[1]) + "']").parent();
                            $(nT).eq(1).clone().insertAfter(oldTable.find("tr:last"));
                            $(nT).eq(0).clone().insertAfter(oldTable.find(".rowhead tr:last"));
                        }
                        else
                            $(row).clone().insertAfter(oldTable.find("tr:last"));
                    }
                    oldTable.find("[data-p='" + $(row).children().first().attr("data-p") + "']").parent().last().prev().find("[data-p='" + $(row).children().first().attr("data-p") + "']").parent().remove();
                }
                if (this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout)
                    row = $(row).next();
                else
                    row = $(row).prev();
            }
            while (this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? ($(row).length > 0 && $(row).children("[data-p='" + cellPos + "']").length == 0) : (($(row).next().children("[data-p='" + startParIndex + "']").length == 0 && $(row).length > 0) && $(row).next().children().length > 0 && parseInt($(row).next().children().first().attr('data-p').split(',')[1]) > parseInt(startParIndex.split(',')[1])));
        },

        _getAdjacentRowPos: function (newTable, colPos, rowPos) {
            var row = [], index, tmpPos = rowPos;
            do {
                index = colPos + "," + rowPos;
                row = $(newTable.find("[data-p='" + index + "']"));
                rowPos--;
                if (rowPos < 0) {
                    colPos = colPos - 1;
                    rowPos = tmpPos + 1;
                    tmpPos = rowPos;
                }
            } while (row.length == 0 && colPos > -1);
            return index;
        },

        _mergeHtml: function (axis, cellPos, newTable, oldTable) {
            var isFrozenHeader = this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders;
            var targetCell = newTable.find("[data-p='" + cellPos + "']").children('span')[0];
            if (axis == "rowheader") {
                var colPos = parseInt(cellPos.split(',')[1]), startParIndex = "", endParIndex = "", tmpEndIndex = "";
                startParIndex = this._getParentPosition(axis, this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? cellPos : colPos, "start");
                endParIndex = tmpEndIndex = this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? this._getParentPosition(axis, cellPos, "end") : endParIndex;
                endParIndex = this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout && oldTable.find("[data-p='" + endParIndex + "']").parent().length == 0 ? (this._drillAction == "drilldown" ? oldTable.find("[data-p='" + cellPos + "']").parent().next().children().first().attr("data-p") : newTable.find("[data-p='" + cellPos + "']").parent().next().children().first().attr("data-p")) : endParIndex;
                if (this._drillAction == "drilldown") {
                    if (ej.isNullOrUndefined(targetCell)) {
                        var jPos=((parseInt(cellPos.split(',')[0]) + 1) * this._rowCount + parseInt(cellPos.split(',')[1])) - 1;
                        endParIndex = cellPos;
                        while (!ej.isNullOrUndefined(this._JSONRecords[jPos]) && this._JSONRecords[jPos].CSS.indexOf("summary") > -1 && $(newTable.find("[data-p='" + this._JSONRecords[jPos].Index + "']")).length == 0) {
                            jPos = jPos + this._rowCount - 1;
                        }
                        cellPos = this._JSONRecords[jPos].Index;
                        cellPos = $(newTable.find("[data-p='" + cellPos + "']")).length > 0 ? cellPos : this._getAdjacentRowPos(newTable, parseInt(cellPos.split(',')[0]), parseInt(cellPos.split(',')[1]));
                    }
                    var row = $(newTable.find("[data-p='" + cellPos + "']").children('span')[0]).closest("tr")[0];
                    this._updateRowCells(row, newTable, oldTable, endParIndex, startParIndex, isFrozenHeader);
                }
                else {
                    var row = $(oldTable.find("[data-p='" + cellPos + "']").closest("tr")[0]), rowSpan = parseInt(oldTable.find("[data-p='" + cellPos + "']").attr("rowSpan")), rCount = 0, pd = this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? "data-i" : "data-p";
                    do {
                        var pos = this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? $(row).children().first().attr("data-i") : $(row).children().first().attr("data-p");
                        row = $(row).next();
                        if (isFrozenHeader || this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout)
                            oldTable.find("[" + pd + "$='," + parseInt(pos.split(',')[1]) + "']").parent().remove();
                        else
                            oldTable.find("[data-p='" + pos + "']:not('.e-grpRow')").parent().remove();
                        rCount++;
                    } while (this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? ($(row).children().first().attr("data-p") != endParIndex) : rCount < rowSpan);
                    row = this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? newTable.find("[data-p='" + cellPos + "']").parent() : (newTable.find("[data-p='" + $(row).children().first().attr("data-p") + "']").parent().length > 0 ? newTable.find("[data-p='" + $(row).children().first().attr("data-p") + "']").parent() : (isFrozenHeader ? $(newTable).find(".rowhead tr:last") : $(newTable).find("tr:last")));
                    this._updateRowCells(row, newTable, oldTable, endParIndex, startParIndex, isFrozenHeader);
                }
            }
            else {
                var rowPos = parseInt(cellPos.split(',')[0]) * this._rowCount, startParIndex = "", endParIndex = "";
                startParIndex = this._getParentPosition(axis, rowPos, "start");
                var isSubTotalHide = false;
                if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                    if (JSON.parse(this.getOlapReport()).PivotColumns.length > 0)
                        $.each(JSON.parse(this.getOlapReport()).PivotColumns, function (e, item) { if (item["showSubTotal"] == false) { isSubTotalHide = true; return false; } });
                }
                else {
                    if (this.model.dataSource.columns.length > 0)
                        $.each(this.model.dataSource.columns, function (e, item) { if (item["showSubTotal"] == false) { isSubTotalHide = true; return false; } });
                }
                if (this._drillAction == "drillup" || isSubTotalHide) {
                    endParIndex = this._getParentPosition(axis, rowPos, "end");
                    cellPos = endParIndex;
                }
                var nrowColl = isFrozenHeader ? $(newTable).find(".pivotGridFrozenTable,.pivotGridValueTable").find("tr:not(.hdrTr)") : $(newTable).find("tr:not(.hdrTr)"), orowColl = isFrozenHeader ? $(oldTable).find(".pivotGridFrozenTable,.pivotGridValueTable").find("tr:not(.hdrTr)") : $(oldTable).find("tr:not(.hdrTr)"), query = "";
                if (this.model.enableRTL)
                    $(nrowColl).find(".summary,.rowheader,.colheader").css("text-align", "right");
                for (var rCnt = 0; rCnt < nrowColl.length; rCnt++) {
                    var nFilter = $(nrowColl[rCnt]).children().filter(function () {
                        return ($(this).attr("data-p").split(',')[0] > parseInt(startParIndex.split(',')[0])) && ($(this).attr("data-p").split(',')[0] <= parseInt(cellPos.split(',')[0]));
                    });
                    var oFilter = $(orowColl[rCnt]).children().filter(function () {
                        return ($(this).attr("data-p").split(',')[0] > parseInt(startParIndex.split(',')[0])) && ($(this).attr("data-p").split(',')[0] <= parseInt(cellPos.split(',')[0]));
                    });
                    if ($(orowColl[rCnt]).children().length == 0) {
                        $(orowColl[rCnt]).append(nFilter);
                    }
                    else if ($(orowColl[rCnt]).find(query).eq(0).prev().length > 0) {
                        var beforeCell = oFilter.eq(0).prev();
                        oFilter.remove();
                        nFilter.insertAfter(beforeCell);
                    }
                    else {
                        oFilter.remove();
                        $(orowColl[rCnt]).children(".colheader,.rowheader,.summary,.value").eq(0).length > 0 ? (nFilter.eq(0).prev().length > 0 ? nFilter.insertAfter($(orowColl[rCnt]).find('[data-p="' + nFilter.eq(0).prev().attr('data-p') + '"]')) : nFilter.insertBefore($(orowColl[rCnt]).children(".colheader,.rowheader,.summary,.value").eq(0))) : $(orowColl[rCnt]).append(nFilter);
                    }
                }
            }
        },

        _cropHtml: function (tableOlapGrid) {
            this._table = $(tableOlapGrid).clone();
            $($(tableOlapGrid)).find('[style*="display: none"]').remove();
            return tableOlapGrid;
        },

        renderControlFromJSON: function () {
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && (this.model.enablePaging || this.model.enableVirtualScrolling) && this._isNavigation == false) {
                var _this = this;
                var timer = setInterval(function () {
                    if (_this._pagerObj != null) {
                        clearInterval(timer);
                        var pageSettings = { CategoricalCurrentPage: _this.model.dataSource.pagerOptions.categoricalCurrentPage, CategoricalPageSize: _this.model.dataSource.pagerOptions.categoricalPageSize, SeriesCurrentPage: _this.model.dataSource.pagerOptions.seriesCurrentPage, SeriesPageSize: _this.model.dataSource.pagerOptions.seriesPageSize };
                        var headerCount = { Column: _this._categPageCount, Row: _this._seriesPageCount };
                        _this._pagerObj.element.css("opacity", "1");
                        _this._pagerObj.element.find(".e-pagerTextBox").removeAttr('disabled');
                        _this._pagerObj._unwireEvents();
                        _this._pagerObj._wireEvents();
                        _this._pagerObj.initPagerProperties(headerCount, pageSettings);
                    }
                }, 10);
            }
            this._isNavigation = false;
            var sortEle = null;
            if (!(ej.isNullOrUndefined(this.model.valueSortSettings)) && this.element.find(".valueSorting").length > 0 && !(ej.isNullOrUndefined(ej.PivotAnalysis._valueSorting))) {
                sortEle = this.element.find(".valueSorting").parent();
            }
            var jsonObj = this._excelLikeJSONRecords != null && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? this._excelLikeJSONRecords : this.getJSONRecords();            
            if (!this.model.enableDefaultValue && ((!ej.isNullOrUndefined(jsonObj) && jsonObj.length > 0 && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) && (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? (JSON.parse(this.getOlapReport()).PivotCalculations.length == 0 && ej.isNullOrUndefined(JSON.parse(this.getOlapReport()).CalculatedMeasure)) : (this.model.dataSource.values.length == 0 || this.model.dataSource.values[0].measures.length == 0)))) {
                jsonObj = $.map(jsonObj, function (itm) { if (itm.CSS.indexOf("value") > -1) itm.Value = ""; return itm; });
                this.setJSONRecords(JSON.stringify(jsonObj));
            }
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && this.model.dataSource.values.length == 0 && this.model.dataSource.rows.length == 0) {                                
                jsonObj = jsonObj.filter(function (item) { item.Index = (Number(item.Index.split(',')[0]) - 1) + ',' + item.Index.split(',')[1]; if (item.Index.split(',')[0] != -1) return item });
            }
            if (!(ej.isNullOrUndefined(jsonObj))) jsonObj = this._appendCssClassName(jsonObj);
            if (this.model.enableConditionalFormatting && this._isFormatApply && !(ej.isNullOrUndefined(jsonObj)) && jsonObj.length > 0)
                jsonObj = this._refreshCellFormatting(jsonObj);
            if (this.model.enableConditionalFormatting && !this._isFormatApply && !(ej.isNullOrUndefined(jsonObj)) && jsonObj.length > 0)
                jsonObj = this._applyCodeBehindFormatting(jsonObj);
            if ($(this.element).parents(".e-pivotclient").length > 0 && this._pivotClientObj.model.enableToolBar && !this._pivotClientObj.model.displaySettings.enableFullScreen)
                var toolBar = $("<div id=" + this._id + "Toolbar style='width:" + this._pivotClientObj._gridWidth + ";height:" + this._pivotClientObj._gridHeight + ";overflow:auto;margin-top:5px;margin-left:5px'></div>");
            if (jsonObj != null && jsonObj != "") {
                for (var l = 0; l < jsonObj.length; l++) {
                    if (jsonObj[l].Value == "Total")
                        jsonObj[l].Value = this._getLocalizedLabels("Total");
                    if (jsonObj[l].Value == "Grand Total")
                        jsonObj[l].Value = this._getLocalizedLabels("GrandTotal");
                }
            }
            if (this.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap && this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                this._applyLocale(jsonObj);
            }

            var tableOlapGrid = $("<table class=\"e-pivotGridTable\" role='grid'  aria-readonly='true'></table>");
            if (this.model.isResponsive)
                tableOlapGrid.addClass("e-table");
            if (this.model.enableColumnResizing && this.model.resizeColumnsToFit)
                tableOlapGrid.addClass("e-column-resizeToContent");
            if ((this.model.enableColumnResizing && !this.model.resizeColumnsToFit) || (!this.model.enableColumnResizing && !this.model.resizeColumnsToFit))
                tableOlapGrid.addClass("e-column-resizeToSize");
            if (((jsonObj == null || jsonObj == "") && !this.model.enableGroupingBar)) {
                var theademptyGrid = ej.buildTag("tr", ej.buildTag("th", "", { "width": "70px" })[0].outerHTML + ej.buildTag("th", "", { "width": "70px" })[0].outerHTML + ej.buildTag("th", "", { "width": "70px" })[0].outerHTML);
                var tbodyemptyGrid = ej.buildTag("tr", ej.buildTag("td", "", { "width": "70px" })[0].outerHTML + ej.buildTag("td", "", { "width": "70px" })[0].outerHTML + ej.buildTag("td", "", { "width": "70px" })[0].outerHTML)[0].outerHTML +
                                     ej.buildTag("tr", ej.buildTag("td", "", { "width": "70px" })[0].outerHTML + ej.buildTag("td", "", { "width": "70px" })[0].outerHTML + ej.buildTag("td", "", { "width": "70px" })[0].outerHTML)[0].outerHTML +
                                     ej.buildTag("tr", ej.buildTag("td", "", { "width": "70px" })[0].outerHTML + ej.buildTag("td", "", { "width": "70px" })[0].outerHTML + ej.buildTag("td", "", { "width": "70px" })[0].outerHTML)[0].outerHTML;

                $(tableOlapGrid).append(theademptyGrid);
                $(tableOlapGrid).append(tbodyemptyGrid);
                this._rowCount = 0;
            }
            else if (jsonObj != null && jsonObj != "") {
                var rowCount = this._rowCount;
                this._rowCount = 0;
                var pGridObj = this;
                //***************Finding row count with first column***********

                for (var index = 0; index < jsonObj.length; index++) {
                    if (parseInt(jsonObj[index].Index.split(',')[0]) == 0)
                        this._rowCount++;
                    else
                        break;
                }

                //***************Finding row count by last json record***********
                //this._rowCount = parseInt(jsonObj[jsonObj.length - 1].Index.split(',')[1]) + 1;
                this._rowCount = this._excelLikeJSONRecords != null && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? this._excelRowCount : this._rowCount;
                var theadOlapGrid = $("<thead></thead>");
                var tbodyOlapGrid = $("<tbody></tbody>");
                var istheadOlapGrid = true; var columnHeaderHeight = 0;
                if (jsonObj[0].CSS == "none") {
                    if ($(this.element).parents(".e-pivotclient").length > 0 && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && JSON.parse(this._pivotClientObj.getOlapReport()).PivotCalculations.length == 0 && JSON.parse(this._pivotClientObj.getOlapReport()).PivotRows.length == 0)
                        columnHeaderHeight = JSON.parse(this._pivotClientObj.getOlapReport()).PivotColumns.length - 1;
                    else
                        columnHeaderHeight = jsonObj[0].RowSpan - 1;
                }
                else {
                    jQuery.each(jsonObj, function (index, value) {
                        // if (jsonObj[index].CSS == "colheader")
                        columnHeaderHeight += jsonObj[index].RowSpan;
                        return (jsonObj[index].CSS == "colheader");
                    });
                    columnHeaderHeight = columnHeaderHeight - 2;
                }
                var isFrozenHeader = this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders;
                var isNoRow = false;
                for (var index = 0; index < jsonObj.length; index++) {
                    if (index < this._rowCount) {
                        if (istheadOlapGrid) {
                            istheadOlapGrid = (index >= columnHeaderHeight) ? false : true;
                            var tRow = "<tr role='row'>";
                            if (this.model.enableGroupingBar) {
                                if (jsonObj[index].Index == "0,0" && jsonObj[index].CSS.indexOf("colheader") > -1) {
                                    tRow = tRow + "<" + (isFrozenHeader ? "td" : "th") + " class='e-grpRow'" + " data-p='-1,-1' colspan= 1 rowspan=" + (this._rowCount - 1) + "> <div class=e-rows>" + this._getLocalizedLabels("DragFieldHere") + "</div></th>";
                                    isNoRow = true;
                                }

                            }
                            for (var column = index; column < jsonObj.length; column = column + this._rowCount) {
                                if (jsonObj[column].Span != "Block") {

                                    if (jsonObj[column].Index == "0,0" && jsonObj[column].CSS.indexOf("colheader") == -1 && this.model.enableGroupingBar) {
                                        tRow = tRow + "<" + (isFrozenHeader ? "td" : "th") + " class=" + "e-grpRow" + " data-p=" + jsonObj[column].Index + " colspan=" + jsonObj[column].ColSpan + " rowspan=" + jsonObj[column].RowSpan + " role='columnheader' aria-label='row'" + ((jsonObj[column].i == null) ? "" : "data-i=" + jsonObj[column].i) + ">" + (jsonObj[column].State == 0 ? "<span style=\"margin-left: 0px\"></span>" : jsonObj[column].State == 2 ? "<span class=\"e-expand\ e-icon\" aria-label='collapsed' title=\"" + this._getLocalizedLabels("Expand") + "\">&nbsp;</span>" : (jsonObj[column].State == 1 ? "<span class=\"e-collapse\ e-icon\" aria-label='expanded' title=\"" + this._getLocalizedLabels("Collapse") + "\">&nbsp;</span>" : "")) + jsonObj[column].Value + ej.buildTag("div.e-rows", this._pivotRow, {})[0].outerHTML + "</th>";
                                    }
                                    else
                                        tRow = tRow + "<" + (isFrozenHeader ? "td" : "th") + (jsonObj[column].CSS == "none" ? "" : " class=\"" + jsonObj[column].CSS) + (jsonObj[column].CSS == "none" ? " data-p=" + jsonObj[column].Index : "\" data-p=" + jsonObj[column].Index) + " colspan=" + jsonObj[column].ColSpan + " rowspan=" + jsonObj[column].RowSpan + " role='columnheader'" + ((jsonObj[column].i == null) ? "" : "data-i=" + jsonObj[column].i) + ">" + (jsonObj[column].State == 0 ? "<span style=\"margin-left: 10px\"></span>" : (jsonObj[column].State == 2) ? "<span class=\"e-expand\ e-icon\" aria-label='collapsed' title=\"" + this._getLocalizedLabels("Expand") + "\">&nbsp;</span>" : (jsonObj[column].State == 1 ? "<span class=\"e-collapse\ e-icon\" aria-label='expanded' title=\" " + this._getLocalizedLabels("Collapse") + "\">&nbsp;</span>" : "")) + jsonObj[column].Value + "</th>";
                                    if (jsonObj[column].RowSpan > 1 && jsonObj[column].ColSpan <= 1) {
                                        for (var i = column + 1; i < column + jsonObj[column].RowSpan; i++)
                                            if (!ej.isNullOrUndefined(jsonObj[i])) jsonObj[i].Span = "Block";
                                    }
                                    else if (jsonObj[column].ColSpan > 1 && jsonObj[column].RowSpan <= 1) {
                                        for (var i = column + this._rowCount; i < column + (jsonObj[column].ColSpan * this._rowCount) ; i = i + this._rowCount)
                                            if (!ej.isNullOrUndefined(jsonObj[i])) jsonObj[i].Span = "Block";
                                    }
                                    else if (jsonObj[column].ColSpan > 1 && jsonObj[column].RowSpan > 1) {
                                        for (var i = column; i < column + jsonObj[column].RowSpan; i++) {
                                            for (var j = i + this._rowCount; j < i + (jsonObj[column].ColSpan * this._rowCount) ; j = j + this._rowCount)
                                                if (!ej.isNullOrUndefined(jsonObj[j])) jsonObj[j].Span = "Block";
                                            if (i != column)
                                                if (!ej.isNullOrUndefined(jsonObj[i])) jsonObj[i].Span = "Block";
                                        }
                                    }
                                }
                            }
                            tRow += "</tr>";
                            if ($(tRow).text() != "")
                                $(theadOlapGrid).append(tRow);
                        }
                        else {
                            var tRow = "<tr role='row'>";
                            if (parseInt(jsonObj[index].Index.split(',')[0]) == 0 && parseInt(jsonObj[index].Index.split(',')[1]) == (this._rowCount - 1) && isNoRow) {
                                tRow = tRow + "<td class='rowheader'" + " data-p='-1,-2' colspan=1 rowspan=1>" + ((this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot || this.model.layout == ej.PivotGrid.Layout.ExcelLikeLayout) ? this._getLocalizedLabels("GrandTotal") : this._getLocalizedLabels("Total")) + "</td>";
                            }
                            for (var column = index; column < jsonObj.length; column = column + this._rowCount) {
                                if (jsonObj[column].Span != "Block") {
                                    if (jsonObj[column].CSS.indexOf("rowheader") > -1 || jsonObj[column].CSS == "summary" || jsonObj[column].CSS.indexOf("summary rstot") > -1 || jsonObj[column].CSS.indexOf("summary stot") > -1 || jsonObj[column].CSS == "summary row" || jsonObj[column].CSS.indexOf("summary rgtot") > -1) {
                                        if (this.layout().toLowerCase() == "excellikelayout") {
                                            tRow = tRow + "<" + (isFrozenHeader ? "td" : "th") + (jsonObj[column].CSS == "none" ? "" : " class=\"" + jsonObj[column].CSS) + "\" data-p=" + jsonObj[column].Index + " colspan=" + jsonObj[column].ColSpan + " rowspan=" + jsonObj[column].RowSpan + " role='rowheader'" + ((jsonObj[column].i == null) ? "" : "data-i=" + jsonObj[column].i) + ">" + (jsonObj[column].State == 2 ? "<span style=\"margin-" + (this.model.enableRTL ? "right:" : "left:") + (jsonObj[column].Level * 10) + "px\" class=\"e-expand\ e-icon\" aria-label='collapsed' title=\"" + this._getLocalizedLabels("Expand") + "\">&nbsp;</span>" : (jsonObj[column].State == 1 ? "<span style=\"margin-" + (this.model.enableRTL ? "right:" : "left:") + (jsonObj[column].Level * 10) + "px\" class=\"e-collapse\ e-icon\" aria-label='expanded' title=\"" + this._getLocalizedLabels("Collapse") + "\">&nbsp;</span>" : "<span style=\"margin-" + (this.model.enableRTL ? "right:" : "left:") + ((this._excelLikeJSONRecords != null && jsonObj[column].CSS == "summary row") ? jsonObj[column].Level * 10 : ((jsonObj[column].Level == 1 ? 1 : jsonObj[column].Level + 2) * 10)) + "px\">&nbsp;</span>")) + jsonObj[column].Value + "</th>";
                                        }
                                        else {
                                            tRow = tRow + "<" + (isFrozenHeader ? "td" : "th") + (jsonObj[column].CSS == "none" ? "" : " class=\"" + jsonObj[column].CSS) + "\" data-p=" + jsonObj[column].Index + " colspan=" + jsonObj[column].ColSpan + " rowspan=" + jsonObj[column].RowSpan + " role='rowheader'>" + (jsonObj[column].State == 0 ? "<span style=\"margin-left: 10px\"></span>" : (jsonObj[column].State == 2) ? "<span class=\"e-expand\ e-icon\" aria-label='collapsed' title=\"" + this._getLocalizedLabels("Expand") + "\">&nbsp;</span>" : (jsonObj[column].State == 1 ? "<span class=\"e-collapse\ e-icon\" aria-label='expanded' title=\"" + this._getLocalizedLabels("Collapse") + "\">&nbsp;</span>" : "")) + jsonObj[column].Value + "</th>";
                                        }
                                    }
                                    else
                                        tRow = tRow + "<td" + (jsonObj[column].CSS == "none" ? "" : " class=\"" + jsonObj[column].CSS) + "\" data-p=" + jsonObj[column].Index + " colspan=" + jsonObj[column].ColSpan + " rowspan=" + jsonObj[column].RowSpan + " role='gridcell'" + ((jsonObj[column].i == null) ? "" : "data-i=" + jsonObj[column].i) + ">" + (jsonObj[column].State == 2 ? "<span class=\"e-expand\ e-icon\" title=\"" + this._getLocalizedLabels("Expand") + "\">&nbsp;</span>" : (jsonObj[column].State == 1 ? "<span class=\"e-collapse\ e-icon\" title=\"" + this._getLocalizedLabels("Collapse") + "\">&nbsp;</span>" : "")) + jsonObj[column].Value + "</td>";
                                    if (jsonObj[column].RowSpan > 1 && jsonObj[column].ColSpan <= 1) {
                                        for (var i = column + 1; i < column + jsonObj[column].RowSpan; i++)
                                            if (!ej.isNullOrUndefined(jsonObj[i])) jsonObj[i].Span = "Block";
                                    }
                                    else if (jsonObj[column].ColSpan > 1 && jsonObj[column].RowSpan <= 1) {
                                        for (var i = column + this._rowCount; i < column + (jsonObj[column].ColSpan * this._rowCount) ; i = i + this._rowCount)
                                            if (!ej.isNullOrUndefined(jsonObj[i])) jsonObj[i].Span = "Block";
                                    }
                                    else if (jsonObj[column].ColSpan > 1 && jsonObj[column].RowSpan > 1) {
                                        for (var i = column; i < column + jsonObj[column].RowSpan; i++) {
                                            for (var j = i + this._rowCount; j < i + (jsonObj[column].ColSpan * this._rowCount) ; j = j + this._rowCount)
                                                if (!ej.isNullOrUndefined(jsonObj[j])) jsonObj[j].Span = "Block";
                                            if (i != column)
                                                if (!ej.isNullOrUndefined(jsonObj[i])) jsonObj[i].Span = "Block";
                                        }
                                    }
                                }
                            }
                            tRow += "</tr>";
                            if ($(tRow).text() != "")
                                $(tbodyOlapGrid).append(tRow);
                        }
                    }
                }

                if (isFrozenHeader) {
                    this._renderFrozenGridTable(tableOlapGrid, theadOlapGrid, tbodyOlapGrid);
                }
                else {
                    $(tableOlapGrid).append(theadOlapGrid);
                    $(tableOlapGrid).append(tbodyOlapGrid);
                }

            }
            this._unWireEvents();
            this._wireEvents();
            if ((!this.model.enableVirtualScrolling) && $(tableOlapGrid).find("tr:last > td").length > 0 && ($(tableOlapGrid).find("tr:last").find("td").text() == "" && (!(this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot))) && (this._pagerObj == null))
                $(tableOlapGrid).find("tr:last").hide();
            if (!this.model.enablePaging && !this.model.enableVirtualScrolling) {
                this._hideGrandTotal(tableOlapGrid);
                this._hideSubTotal(tableOlapGrid);
            }
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && (this.model.enableCollapseByDefault || !ej.isNullOrUndefined(this.model.collapsedMembers)) && !ej.isNullOrUndefined(jsonObj)) {
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.enableCollapseByDefault) {
                    var isFrozenHeader = this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders;
                    var _rowCount = (!ej.isNullOrUndefined(this.model.dataSource.data) && !ej.isNullOrUndefined(this.model.dataSource.rows)) ? this.model.dataSource.rows.length : ($(this.element).parents(".e-pivotclient").length > 0 && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) ? JSON.parse(this._pivotClientObj.getOlapReport()).PivotRows.length : JSON.parse(this.getOlapReport()).PivotRows.length;
                    var columnCount = (!ej.isNullOrUndefined(this.model.dataSource.data) && !ej.isNullOrUndefined(this.model.dataSource.columns)) ? this.model.dataSource.columns.length : ($(this.element).parents(".e-pivotclient").length > 0 && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) ? JSON.parse(this._pivotClientObj.getOlapReport()).PivotColumns.length : JSON.parse(this.getOlapReport()).PivotColumns.length;
                    this.model.collapsedMembers = {};
                    var thRList,thCList;
                    for (var rh = _rowCount; rh >= 0; rh--) {
                        if (isFrozenHeader)
                            thRList = $(tableOlapGrid).find(".pivotGridRowTable [data-p^='" + rh + ",']:has('span.e-collapse')[class^='rowheader']");
                        else
                            thRList = $(tableOlapGrid).find("th[data-p^='" + rh + ",']:has('span.e-collapse')[class^='rowheader']");
                        var field = this._getFieldName(thRList[0]);
                        this.model.collapsedMembers[field] = new Array();
                        for (var thcnt = 0; thcnt < thRList.length; thcnt++) {
                            this.model.collapsedMembers[field].push($(thRList[thcnt]).clone().children().remove().end().text());
                            this._collapseMember(tableOlapGrid, $(thRList[thcnt]).find('.e-collapse'));
                        }
                    }
                    for (var ch = columnCount; ch >= 0; ch--) {
                        thCList = $(tableOlapGrid).find((isFrozenHeader ? ".pivotGridFrozenTable " : "th") + "[data-p$='," + ch + "']:has('span.e-collapse')[class$='colheader']");
                        var field = this._getFieldName(thCList[0]);
                        this.model.collapsedMembers[field] = new Array();
                        for (var thcnt = 0; thcnt < thCList.length; thcnt++) {
                            this.model.collapsedMembers[field].push($(thRList[thcnt]).clone().children().remove().end().text());
                            this._collapseMember(tableOlapGrid, $(thCList[thcnt]).find('.e-collapse'));
                        }
                    }
                }
                else if (!ej.isNullOrUndefined(this.model.collapsedMembers)) {
                    var pivotGrid = this;
                    $.each(this.model.collapsedMembers, function (index, item) {
                        var item = item;
                        var fieldIndex, axis;
                        if (pivotGrid.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                            for (var i = 0; i < pivotGrid.model.dataSource.rows.length; i++)
                                if (pivotGrid.model.dataSource.rows[i].fieldName == index) { fieldIndex = i; axis = "row"; }
                            for (var i = 0; i < pivotGrid.model.dataSource.columns.length; i++)
                                if (pivotGrid.model.dataSource.columns[i].fieldName == index) { fieldIndex = i; axis = "column"; }
                            if (!ej.isNullOrUndefined(fieldIndex)) {
                                if (axis == "row") {
                                    for (var i = pivotGrid.model.dataSource.columns.length + 1, currentCell; i < pivotGrid._rowCount; i += ej.isNullOrUndefined(currentCell) ? 1 : currentCell.rowSpan) {
                                        currentCell = $(tableOlapGrid).find("tBody th[data-p='" + fieldIndex + "," + i + "']")[0];
                                        var isMatched = false;
                                        for (var j = 0; j < item.length; j++) {
                                            if ($.trim($(currentCell).text().replace("expanded", "")) == $.trim(item[j].toString())) {
                                                isMatched = true;
                                                break;
                                            }
                                        }
                                        if (!ej.isNullOrUndefined(currentCell) && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader") && isMatched && $(currentCell).find('.e-collapse').length > 0)
                                            pivotGrid._collapseMember(tableOlapGrid, $(currentCell).find('.e-collapse'));
                                    }
                                }
                                else if (axis == "column") {
                                    for (var i = pivotGrid.model.dataSource.rows.length, currentCell; i < Math.ceil(pivotGrid.getJSONRecords().length / pivotGrid._rowCount) ; i += ej.isNullOrUndefined(currentCell) ? 1 : currentCell.colSpan) {
                                        currentCell = $(tableOlapGrid).find("thead th[data-p='" + i + "," + fieldIndex + "']")[0];
                                        var isMatched = false;
                                        for (var j = 0; j < item.length; j++) {
                                            if ($.trim($(currentCell).text().replace("expanded", "")) == $.trim(item[j].toString())) {
                                                isMatched = true;
                                                break;
                                            }
                                        }
                                        if (!ej.isNullOrUndefined(currentCell) && ($(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader") && isMatched && $(currentCell).find('.e-collapse').length > 0)
                                            pivotGrid._collapseMember(tableOlapGrid, $(currentCell).find('.e-collapse'));
                                    }
                                }
                            }
                        }
                        else {
                            var pivotRows = JSON.parse(pivotGrid.getOlapReport()).PivotRows, pivotColumns = JSON.parse(pivotGrid.getOlapReport()).PivotColumns;
                            for (var i = 0; i < pivotRows.length; i++)
                                if (pivotRows[i].FieldName == index) { fieldIndex = i; axis = "row"; }
                            for (var i = 0; i < pivotColumns.length; i++)
                                if (pivotColumns[i].FieldName == index) { fieldIndex = i; axis = "column"; }
                            if (!ej.isNullOrUndefined(fieldIndex)) {
                                if (axis == "row") {
                                    for (var i = pivotColumns.length + 1, currentCell; i < pivotGrid._rowCount; i += ej.isNullOrUndefined(currentCell) ? 1 : currentCell.rowSpan) {
                                        currentCell = $(tableOlapGrid).find("tBody th[data-p='" + fieldIndex + "," + i + "']")[0];
                                        var isMatched = false;
                                        for (var j = 0; j < item.length; j++) {
                                            if ($.trim($(currentCell).text().replace("expanded", "")) == $.trim(item[j].toString())) {
                                                isMatched = true;
                                                break;
                                            }
                                        }
                                        if (!ej.isNullOrUndefined(currentCell) && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader") && isMatched && $(currentCell).find('.e-collapse').length > 0)
                                            pivotGrid._collapseMember(tableOlapGrid, $(currentCell).find('.e-collapse'));
                                    }
                                }
                                else if (axis == "column") {
                                    for (var i = pivotRows.length, currentCell; i < Math.ceil(pivotGrid.getJSONRecords().length / pivotGrid._rowCount) ; i += ej.isNullOrUndefined(currentCell) ? 1 : currentCell.colSpan) {
                                        currentCell = $(tableOlapGrid).find("thead th[data-p='" + i + "," + fieldIndex + "']")[0];
                                        var isMatched = false;
                                        for (var j = 0; j < item.length; j++) {
                                            if ($.trim($(currentCell).text().replace("expanded", "")) == $.trim(item[j].toString())) {
                                                isMatched = true;
                                                break;
                                            }
                                        }
                                        if (!ej.isNullOrUndefined(currentCell) && ($(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader") && isMatched && $(currentCell).find('.e-collapse').length > 0)
                                            pivotGrid._collapseMember(tableOlapGrid, $(currentCell).find('.e-collapse'));
                                    }
                                }
                            }
                        }
                    });
                }
            }
            this.element.html("");
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && !(this.model.enablePaging || this.model.enableVirtualScrolling || ((this.model.enableAdvancedFilter || ($(this.element).parents(".e-pivotclient").length > 0 && this._pivotClientObj.model.enableAdvancedFilter)) && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)))
                tableOlapGrid = this._cropHtml(tableOlapGrid);
            if (this.model.enableGroupingBar) {
                this.element.append(tableOlapGrid);
                if (this._JSONRecords == null || this._JSONRecords.length == 0)
                    this.element.append(ej.buildTag("span", this._getLocalizedLabels("NoRecordsToDisplay"), { "display": "inline-block", "padding": "10px 0px 0px 0px", "font-family": "Segoe UI" })[0].outerHTML);
                if (this.model.enableRTL)
                    this.element.addClass("e-rtl");
                this._createFields(tableOlapGrid, $("#" + this._id).find(".e-pivotGridTable").width(), $("#" + this._id).find(".e-pivotGridTable th").outerWidth());
            }
            else {
                if ($(this.element).parents(".e-pivotclient").length > 0 && this._pivotClientObj.model.enableToolBar && !this._pivotClientObj.model.displaySettings.enableFullScreen) {
                    $(toolBar).append(tableOlapGrid);
                    this.element.append($(toolBar));
                }
                else
                    this.element.append(tableOlapGrid);
            }
            if ((this.model.enableColumnResizing && this.model.resizeColumnsToFit) || (this.model.enableColumnResizing && !this.model.resizeColumnsToFit))
                this._resizeColumnsWidth();
            if (this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders) {
                this._applyFrozenHeaderWidth(jsonObj);
                this.element.find(".e-pivotGridTable").width("auto");
            }
            if (this.model.enableVirtualScrolling) {
                this._createVirtualPivotGrid(tableOlapGrid);
                if (this.model.enableGroupingBar)
                    this._createFields(null, $("#" + this._id).find(".e-pivotGridTable").width(), $("#" + this._id).find(".e-pivotGridTable th").outerWidth());
                if (this.model.enableRTL)
                    this.element.addClass("e-rtl");
                this._applyVScrolling();
            }
            if (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj.model.enableVirtualScrolling && !this._pivotClientObj.model.enablePaging) {
                this._pivotClientObj.element.find(".e-categPageIndicator, .e-seriesPageIndicator , .e-vScrollThumb, .e-hScrollThumb").remove();
                var seriesPageIndicator = ej.buildTag("div.e-seriesPageIndicator inActive", ej.buildTag("span.axislabel", this._getLocalizedLabels("SeriesPage") + " : ")[0].outerHTML + ej.buildTag("span.series_CurrentPage", this._seriesCurrentPage)[0].outerHTML + " / " + ej.buildTag("span.series_pageCount", this._seriesPageCount)[0].outerHTML)[0].outerHTML;
                if (this._seriesPageCount > 1) {
                    if (this._pivotClientObj.element.find(".e-vScrollPanel").width() != 12) {
                        this._pivotClientObj.element.width(this._pivotClientObj.element.width() + 12);
                    }
                    this._pivotClientObj.element.find(".e-vScrollPanel").width(12);
                    this._pivotClientObj.element.find(".virtualScrolling").append(seriesPageIndicator);
                    if (this._pivotClientObj.controlPlacement() == ej.PivotClient.ControlPlacement.Tab && this._pivotClientObj.model.displaySettings.mode == ej.PivotClient.DisplayMode.ChartAndGrid) {
                       this._pivotClientObj.element.find(".virtualScrolling").css("padding-top", "10px");
                    }
                    else
                        this._pivotClientObj.element.find(".virtualScrolling").css("padding-left", "2px");
                }
                else {
                    if (this._pivotClientObj.element.find(".e-vScrollPanel").width() == 12) {
                        this._pivotClientObj.element.width(this._pivotClientObj.element.width() - 12);
                        this._pivotClientObj.element.find(".e-vScrollPanel").width(0);
                    }
                }
                var categPageIndicator = ej.buildTag("div.e-categPageIndicator inActive", ej.buildTag("span.axislabel", this._getLocalizedLabels("CategoricalPage") + " : ")[0].outerHTML + ej.buildTag("span.categ_CurrentPage", this._categCurrentPage)[0].outerHTML + " / " + ej.buildTag("span.categ_pageCount", this._categPageCount)[0].outerHTML)[0].outerHTML;
                if (this._categPageCount > 1) {
                    if (this._pivotClientObj.element.find(".e-hScrollPanel").height() != 12) {
                        this._pivotClientObj.element.find(".e-hScrollPanel").height(12);
                    }
                    if (this._pivotClientObj.controlPlacement() == ej.PivotClient.ControlPlacement.title)
                        this._pivotClientObj.element.find(".hsVirtualScrolling").css("margin-top", "3px");
                    this._pivotClientObj.element.find(".hsVirtualScrolling").append(categPageIndicator);
                }
                else {
                    if (this._pivotClientObj.element.find(".e-hScrollPanel").height() == 12) {
                        if (!this._pivotClientObj.model.isResponsive) {
                            this._pivotClientObj.element.find(".e-categoricalAxis, .e-rowAxis,.e-slicerAxis").height(150);
                        } else
                            this._pivotClientObj.element.find(".e-categoricalAxis, .e-rowAxis,.e-slicerAxis").height(this._pivotClientObj.element.find(".e-categoricalAxis, .e-rowAxis,.e-slicerAxis").height() - 6);
                        if (!this._pivotClientObj.model.enableSplitter)
                        this._pivotClientObj.element.find(".e-cubeBrowser").height(this._pivotClientObj.element.find(".e-cubeBrowser").height() - 20);
                        this._pivotClientObj.element.find(".e-hScrollPanel").height(0);
                    }
                }
                this._applyVScrolling();
                if (this._pivotClientObj.element.find(".e-chartContainer").length > 0) {
                    this._pivotClientObj.element.find(".e-gridContainer").height(this._pivotClientObj.element.find(".e-chartContainer").height() + 5);
                }
                if (this._pivotClientObj.model.enableSplitter) {
                    if (!ej.isNullOrUndefined(this._pivotClientObj.element.find(".e-childsplit").data("ejSplitter")))
                        this._pivotClientObj.element.find(".e-childsplit").data("ejSplitter").refresh();
                    if (!ej.isNullOrUndefined(this._pivotClientObj.element.find(".e-serverchildsplit").data("ejSplitter")))
                        this._pivotClientObj.element.find(".e-serverchildsplit").data("ejSplitter").refresh();
                }
            }
            if(this.model.enableColumnResizing)
                this.element.addClass("e-column-resize");
            else
                this.element.removeClass("e-column-resize");
            if (this.model.enableRTL) {
                this.element.addClass("e-rtl");
                this.element.find(".groupingBarPivot").addClass("e-rtl");
                this.element.find('table .rowheader,.colheader,.summary, .groupingBarPivot, .e-grpRow').css("text-align", "right");
            }
            else {
                this.element.removeClass("e-rtl");
                this.element.find(".groupingBarPivot").removeClass("e-rtl");
                this.element.find('table .rowheader,.colheader,.summary, .e-grpRow, .groupingBarPivot ').css("text-align", "left");
            }
            if ($(this.element).parents(".e-pivotclient").length > 0 && this._pivotClientObj.model.enableToolBar && !this._pivotClientObj.model.displaySettings.enableFullScreen) {
                $("#" + this._id).prepend("<div class='toolBar' style='height:40px,width:" + this.element.find("#PivotGridToolbar").width() + "px'></div>");
                var numberformatting = "", collapseByDefault = "", frozenHeader = ej.buildTag("li#frozenHeaders.e-frozenHeaders e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("FrozenHeader")).attr({ "title": this._getLocalizedLabels("FrozenHeader"), tabindex: 0 })[0].outerHTML;
                var cellSelect = ej.buildTag("li.e-cellSelect e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("CellSelection")).attr({ "title": this._getLocalizedLabels("CellSelection"), tabindex: 0 })[0].outerHTML;
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                    collapseByDefault = ej.buildTag("li#collapseByDefault.e-collapseByDefault e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("CollapseByDefault")).attr({ "title": this._getLocalizedLabels("CollapseByDefault"), tabindex: 0 })[0].outerHTML;
                numberformatting = ej.buildTag("li.e-numberFormatting e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("NumberFormatting")).attr({ "title": this._getLocalizedLabels("NumberFormatting"), tabindex: 0 })[0].outerHTML;
                var calculatedField = ej.buildTag("li.e-calculatedField e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("CalculatedField")).attr({ "title": this._getLocalizedLabels("CalculatedField"), tabindex: 0 })[0].outerHTML;
                var icons = ej.buildTag("ul",
                (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? ej.buildTag("li#cellEditing.e-cellEditing e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("CellEditing")).attr({ "title": this._getLocalizedLabels("CellEditing"), tabindex: 0 })[0].outerHTML : " ") +
                ej.buildTag("li#drillThrough.e-drillThrough e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("DrillThrough")).attr({ "title": this._getLocalizedLabels("DrillThrough"), tabindex: 0 })[0].outerHTML+
                (!((this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot || this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) ? ej.buildTag("li.e-advancedFiltering e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("AdvancedFiltering")).attr({ "title": this._getLocalizedLabels("AdvancedFiltering"), tabindex: 0 })[0].outerHTML : "") +
                ej.buildTag("li#columnResize.e-columnResize e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("ColumnResize")).attr({ "title": this._getLocalizedLabels("ColumnResize"), tabindex: 0 })[0].outerHTML +
                ej.buildTag("li.e-toolTip e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("ToolTip")).attr({ "title": this._getLocalizedLabels("ToolTip"), tabindex: 0 })[0].outerHTML + (this._pivotClientObj.displayMode() == ej.PivotClient.DisplayMode.GridOnly ? collapseByDefault : "") +
                ej.buildTag("li.rtl e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("RTL")).attr({ "title": this._getLocalizedLabels("RTL"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                ej.buildTag("ul", ej.buildTag("li.e-hyperlinkOptions e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("HyperLink")).attr({ "title": this._getLocalizedLabels("HyperLink"), tabindex: 0 })[0].outerHTML +
                ej.buildTag("li.e-layouts e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("Layouts")).attr({ "title": this._getLocalizedLabels("Layouts"), tabindex: 0 })[0].outerHTML + frozenHeader +
                ej.buildTag("li.e-exporting e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("Exporting")).attr({ "title": this._getLocalizedLabels("Exporting"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                ej.buildTag("ul", ej.buildTag("li#summaryCustomize.e-summaryCustomize e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("SummaryCustomization")).attr({ "title": this._getLocalizedLabels("SummaryCustomization"), tabindex: 0 })[0].outerHTML +
                ej.buildTag("li.e-conditionalFormat e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("ConditionalFormatting")).attr({ "title": this._getLocalizedLabels("ConditionalFormatting"), tabindex: 0 })[0].outerHTML +
                (this._pivotClientObj.model.analysisMode == "pivot" && this._pivotClientObj.model.operationalMode == "clientmode" ? (ej.buildTag("li.e-summaryTypes e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("SummaryTypes")).attr({ "title": this._getLocalizedLabels("SummaryTypes"), tabindex: 0 })[0].outerHTML + numberformatting) : ""))[0].outerHTML;
                $(".toolBar").append(icons);
                $(".toolBar").ejToolbar({ enableRTL: this.model.enableRTL, height: "35px", enableSeparator: true });
            }
            this._stateMaintenance();
            if ($.trim(this.model.pivotTableFieldListID) != "" && this._isSchemaInitialize && this.model.enablePivotFieldList)
                this._renderPivotSchemaDesigner();
            if (this.model._isXMLImport && $.trim(this.model.pivotTableFieldListID) != "") {
                if (this.model.enablePivotFieldList) {
                    $("#" + this.model.pivotTableFieldListID).css("display", "");
                    this._renderPivotSchemaDesigner();
                }
                else {
                    $("#" + this.model.pivotTableFieldListID).css("display", "none");
                }
                this.model._isXMLImport = false;
            }
            if (this._schemaData != null)
                this.element.find(".colheader, .rowheader, .value").addClass("e-droppable");
            this.exportRecords = jsonObj;
            ej.Pivot.closePreventPanel(this);
            if (this._schemaData)
                ej.Pivot.closePreventPanel(this._schemaData);
            if (this._excelLikeJSONRecords != null && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout)
                this._rowCount = rowCount;
            if (this.model.valueSortSettings)
                this._refreshValueSortIcons(sortEle);
            if (this.model.enableGroupingBar && this.element.find(".e-pivotGridTable").width() > 0) {
                if (!(this.element.find(".values .e-pvtBtn, .columns .e-pvtBtn").length == 0 && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) && (this.element.find("tbody .value").length > 0 && this.element.find("thead tr").length > 0))
                    this.element.find(".groupingBarPivot").width(this.element.find(".e-pivotGridTable").width());
            }
            if (this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders)
                this._applyFrozenHeaderWidth(this._JSONRecords);
            this._applyHeaders();
        },
        _refreshValueSortIcons: function (sortEle) {
            if (!ej.isNullOrUndefined(this.model.valueSortSettings.headerText) && this.model.valueSortSettings.headerText != "" && !ej.isNullOrUndefined(ej.PivotAnalysis._valueSorting)) {
                var ele = this.element.find("[data-p='" + Number(ej.PivotAnalysis._valueSorting) + "," + (Number(this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? JSON.parse(this.getOlapReport()).PivotColumns.length : this.model.dataSource.columns.length) + "']"));
                if ($(ele).find(".valueSorting").length == 0 && !$(ele).hasClass("rowheader")) {
                    var sorting = ej.buildTag("span.valueSorting e-icon " + ej.PivotAnalysis._sort).css("margin-left", "5px").attr("role", "button").attr("aria-label", "sort")[0].outerHTML;
                    $(ele).append(sorting);
                }
            }
            else if (!ej.isNullOrUndefined(sortEle) && $(sortEle).find(".rowheader").length == 0) {
                this.element.find("[data-p='" + Number($(sortEle).attr("data-p").split(',')[0]) + "," + Number($(sortEle).attr("data-p").split(',')[1]) + "']").html(sortEle.html());
            }
        },
        _applyHeaders: function () {
            if (this._JSONRecords != null) {
                var row = [],
                    col = [],
                    headerInfo = {},
                    width = [],
                    colIndex, mode = this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? true : false;
                if (this.model.analysisMode != ej.PivotGrid.AnalysisMode.Olap && (this.model.headerSettings.showColumnItems || this.model.headerSettings.showRowItems) && !this.model.enableGroupingBar) {
                    if ((mode && (JSON.parse(this.getOlapReport()).PivotRows.length > 0 || JSON.parse(this.getOlapReport()).PivotColumns.length > 0) && JSON.parse(this.getOlapReport()).PivotCalculations.length > 0) || (!mode && ((this.model.dataSource.rows.length > 0 || this.model.dataSource.columns.length > 0) && this.model.dataSource.values.length > 0))) {
                        for (var i = 0; i < (mode ? JSON.parse(this.getOlapReport()).PivotRows.length : this.model.dataSource.rows.length) ; i++) {
                            row.push(mode ? JSON.parse(this.getOlapReport()).PivotRows[i].FieldHeader : this.model.dataSource.rows[i].fieldCaption);

                        }
                        for (var i = 0; i < (mode ? JSON.parse(this.getOlapReport()).PivotColumns.length : this.model.dataSource.columns.length) ; i++)
                            col.push(mode ? JSON.parse(this.getOlapReport()).PivotColumns[i].FieldHeader : this.model.dataSource.columns[i].fieldCaption);
                        headerInfo = {
                            rows: row,
                            columns: col
                        };
                    }
                } else if (this.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap && (this.model.headerSettings.showColumnItems || this.model.headerSettings.showRowItems) && this.model.layout != "excellikelayout" && !this.model.enableGroupingBar && ((mode && JSON.parse(this.getOlapReport()).PivotCalculations.length) || (!mode && this.model.dataSource.values[0].measures.length)) && this._getAxis() == "columns") {
                    var index = 0,
                        measurePosition = -1;
                    for (var i = 0; i < (Number(this.element.find(".value:first").attr("data-p").split(",")[1]) - 1) ; i++)
                        col[i] = "";
                    for (var i = 0; i < this._JSONRecords.length; i++) {
                        if (this._JSONRecords[i].Info != "" && this._JSONRecords[i].Info.split("::")[1].indexOf("Measures") > -1 && this._JSONRecords[i].CSS == "colheader") {
                            measurePosition = Number(this._JSONRecords[i].Index.split(",")[1]);
                            break;
                        }
                    }
                    for (var i = 0; i < this._JSONRecords.length; i++) {
                        if (this._JSONRecords[i].CSS != "value" && this._JSONRecords[i].CSS != " value") {
                            if (this._JSONRecords[i].CSS == "rowheader" && this._JSONRecords[i].Info != "" && $.inArray($(".e-cubeTreeView").find("li[data-tag='" + this._JSONRecords[i].Info.split("::")[1] + "'] a:eq(0)").text(), row) == -1 && $.inArray(this._JSONRecords[i].Info.split("::")[1].replace(/[\[\]]+/g, ''), row) == -1) {
                                if ($(this.element).parents(".e-pivotclient").length > 0)
                                    row.push($(".e-cubeTreeView").find("li[data-tag='" + this._JSONRecords[i].Info.split("::")[1] + "'] a:eq(0)").text());
                                else
                                    row.push(this._JSONRecords[i].Info.split("::")[1].replace(/[\[\]]+/g, ''));
                                if (this.element.find("[data-p*='" + this._JSONRecords[i].Index.split(",")[0] + ",'] .collapse").parent().not(".colheader").length > 0)
                                    width.push($(this.element.find("[data-p*='" + this._JSONRecords[i].Index.split(",")[0] + ",'] .collapse").parent().not(".colheader")[0]).width());
                                else
                                    width.push(this.element.find("[data-p=" + "'" + this._JSONRecords[i].Index.split(",")[0] + "," + this._JSONRecords[i].Index.split(",")[1] + "'" + "]").width());
                                i = i + (this._rowCount - (i % this._rowCount));
                            }
                            if (this._JSONRecords[i].CSS == "colheader" && this._JSONRecords[i].Info != "" && ($.inArray($(".e-cubeTreeView").find("li[data-tag='" + this._JSONRecords[i].Info.split("::")[1] + "'] a:eq(0)").text(), col) == -1 || $.inArray(this._JSONRecords[i].Info.split("::")[1].replace(/[\[\]]+/g, ''), col) == -1) && this._JSONRecords[i].Info.indexOf('Measure') === -1) {
                                if (measurePosition != -1) {
                                    index = measurePosition > Number(this._JSONRecords[i].Index.split(",")[1]) ? 0 : 1;
                                } else
                                    index = 0;
                                if ($(this.element).parents(".e-pivotclient").length > 0)
                                    col[Number(this._JSONRecords[i].Index.split(",")[1]) - index] = $(".e-cubeTreeView").find("li[data-tag='" + this._JSONRecords[i].Info.split("::")[1] + "'] a:eq(0)").text();
                                else
                                    col[Number(this._JSONRecords[i].Index.split(",")[1]) - index] = this._JSONRecords[i].Info.split("::")[1].replace(/[\[\]]+/g, '');
                            }
                        }
                    }
                    headerInfo = {
                        rows: row,
                        columns: col
                    };
                }
                if (!$.isEmptyObject(headerInfo) && ((this.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap && headerInfo.rows.length > 0) || this.model.analysisMode == "pivot")) {
                    if (this.element.find(".e-pivotGridTable")) {
                        var rowHeader = this.element.find(".e-pivotGridTable").find("tbody>tr:eq(0)");
                        if (!ej.isNullOrUndefined(rowHeader))
                            jQuery.each($(rowHeader).find("th"), function (index, item) { if ($(item).hasClass("rowheader")) width.push($(item).width()); });
                    }
                    var mytable = $('<table></table>').css({
                        "width": this.element.find(".colfreeze").length > 0 ? (this.element.find(".colfreeze").width() + 10) : (this.element.find("[p='0,0']").width() + 10),
                        "height": this.element.find(".colfreeze").length > 0 ? (this.element.find(".colfreeze").height() + 10) : (this.element.find("[p='0,0']").height() + 10)
                    }).attr({
                        id: "hdrSec"
                    });
                    for (var i = 0; i < (headerInfo.columns.length + 1) ; i++) {
                        var row = $('<tr></tr>').attr({"class": "hdrTr"}).appendTo(mytable);
                        if (headerInfo.rows.length > 0) {
                            for (var j = 0; j < headerInfo.rows.length; j++) {
                                $('<td class="e-headerItem"></td>').css("width", (j == (headerInfo.rows.length - 1) && i < headerInfo.columns.length) ? (width[headerInfo.rows.length - 1]) : (width[j])).text((j == (headerInfo.rows.length - 1) && i < headerInfo.columns.length && this.model.headerSettings.showColumnItems) ? ((this.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap) ? (headerInfo.columns[i].split(".")[headerInfo.columns[i].split(".").length - 1]) : (headerInfo.columns[i])) : (i == headerInfo.columns.length && this.model.headerSettings.showRowItems) ? ((this.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap) ? (headerInfo.rows[j].split(".")[headerInfo.rows[j].split(".").length - 1]) : (headerInfo.rows[j])) : "").attr("title", (j == (headerInfo.rows.length - 1) && i < headerInfo.columns.length && this.model.headerSettings.showColumnItems) ? (headerInfo.columns[i]) : (i == headerInfo.columns.length && this.model.headerSettings.showRowItems) ? headerInfo.rows[j] : "").appendTo(row);
                            }
                        }
                        else if(this.model.headerSettings.showColumnItems)
                        {
                            $('<td class="e-headerItem"></td>').css("width", (width[0])).text((this.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap) ? (headerInfo.columns[i].split(".")[headerInfo.columns[i].split(".").length - 1]) : (headerInfo.columns[i])).attr("title", headerInfo.columns[i]).appendTo(row);
                        }
                    }
                    if (this.element.find(".colfreeze").length > 0) {
                        this.element.find(".colfreeze").css("visibility", "visible").html("");
                        mytable.appendTo(this.element.find(".colfreeze"));
                    } else {
                        this.element.find("[data-p='0,0']").css({
                            "padding": "0px"
                        }).html("");
                        mytable.appendTo(this.element.find("[data-p='0,0']"));
                    }
                }
            }
        },
        _applyLocale: function (jsonObj) {
            if (this.model.dataSource.values.length == 0) return;
			var isFromatApplied = false, axis;
			for (var i = 0; i < this.model.dataSource.values[0].measures.length; i++) {
			    if (this.model.dataSource.values[0].measures[i].format) {
			        isFromatApplied = true;
			        break;
			    }
			}
			if(isFromatApplied)
			{
				axis = this._getAxis();
				for (var i = 0; i < this.model.dataSource.values[0].measures.length; i++) {
                    var val = [], columnIndices = [], format = this.model.dataSource.values[0].measures[i].format,celValue;
                    for(var j=0;j<jsonObj.length;j++)
                        {
                         columnIndices=  this._getColumnIndices(axis, jsonObj[j], this.model.dataSource.values[0].measures[i].fieldCaption,val);
                        }
                    for(var k=0;k<columnIndices.length;k++)
                    {
                        for(var l=0;l<jsonObj.length;l++)
                        {
                            var value = axis == "rows" ? jsonObj[l].Index.split(",")[1] : axis == "columns" ? jsonObj[l].Index.split(",")[0] : null;
                            if(value==columnIndices[k]&&jsonObj[l].Value!="")
                            {
                                celValue = jsonObj[l].Value.replace(/[\s,%]/g, '');
                                celValue = celValue.replace(ej.preferredCulture(this.model.locale).numberFormat.currency.symbol, '');
                                if ($.isNumeric(celValue) && format != undefined) {
                                    var formattedValue = ej.olap.base._getFormatedValue(celValue, format);
                                    jsonObj[l].Value = formattedValue;
                                }
                            }
                        }
                    }
                }
			}
		},
        _renderPivotSchemaDesigner :function()
        {
            if ($("#" + this.model.pivotTableFieldListID).length > 0) {
                var pivotSchemaDesigner = $("#" + this.model.pivotTableFieldListID).data('ejPivotSchemaDesigner');
                if (pivotSchemaDesigner != null) {
                    pivotSchemaDesigner.model.pivotControl = this;
                    pivotSchemaDesigner.model.enableWrapper = true;
                    pivotSchemaDesigner._load();
                    if(this._waitingPopup)
                    this._waitingPopup.hide()
                    this._isSchemaInitialize = false;
                }
                else {
                    var _this = this;
                    var timer = setInterval(function () {
                        var pivotSchemaDesigner = $("#" + _this.model.pivotTableFieldListID).data('ejPivotSchemaDesigner');
                        if (pivotSchemaDesigner != null) {
                            clearInterval(timer);
                            pivotSchemaDesigner.model.pivotControl = _this;
                            pivotSchemaDesigner.model.enableWrapper = true;
                            pivotSchemaDesigner._load();
                            if (_this._waitingPopup)
                                _this._waitingPopup.hide()
                            _this._isSchemaInitialize = false;
                            if (!ej.isNullOrUndefined(pivotSchemaDesigner.model.pivotControl))
                                pivotSchemaDesigner.model.pivotControl.element.find(".colheader, .rowheader, .value").addClass("e-droppable");
                        }
                    }, 10);
                }
            }
       },

        _renderFrozenGridTable: function (tableOlapGrid, colHeader, tableBody) {
            var frozenColTable = $("<table class=\"pivotGridFrozenTable\" style='height:47px' ></table>"),
                frozenRowTable = $("<table class=\"pivotGridRowTable\" ></table>");
                frozenValTable = $("<table class=\"pivotGridValueTable\" ></table>");
                tbodyFrozenCol = $("<thead></thead>"),
                tbodyFrozenRow = $("<tbody></tbody>"),
                tbodyFrozenVal = $("<tbody></tbody>");
            var tRow = tRow1 = "<tr role='row'>";
            var rowdiv = $("<div class='rowhead' style='position: relative; float: left;display: inline-block'>");

            $(tbodyFrozenCol).append($(colHeader).children());
            var tbodyvalue = tableBody.children().clone();
            var tbodyData = tableBody.children().clone();
            $(tbodyData).find(".value").remove();
            $(tbodyFrozenRow).append($(tbodyData));
            $(frozenRowTable).append(tbodyFrozenRow);
            $(rowdiv).append(frozenRowTable);
            $(tbodyvalue).find(".rowheader, .summary:not(.summary.value)").remove();
            $(tbodyFrozenVal).append($(tbodyvalue));


            var coldiv = $(ej.buildTag("div.colhead").css({ 'position': 'relative', 'overflow': 'hidden' })[0].outerHTML);
            var colmovdiv = $(ej.buildTag("div.colmovable")[0].outerHTML);
            var colfrediv = $(ej.buildTag("div.colfreeze").css({ 'float': 'left', 'height': '100%', 'visibility': (this.model.enableGroupingBar ? "visible" : "hidden") })[0].outerHTML);
            $(coldiv).append($(frozenColTable).append(tbodyFrozenCol));
            if ($(tRow).children().length == 0)
                tRow = $("<tr role='row'></tr>");
            if ($(tRow).length > 0) {
                $(colmovdiv).append(coldiv);
                $(colfrediv).append($("<table id='colfretable' style='height:100%'></table>").append(tRow));
            }

            var valScrollArea = $(ej.buildTag("div#rowvaluecontent.valScrollArea")[0].outerHTML);
            var valdiv = $(ej.buildTag("div.valueCell").css({ 'position': 'relative' })[0].outerHTML);
            var rowHeaderArea = $(ej.buildTag("div.rowHeaderArea")[0].outerHTML);
            $(valdiv).append($(frozenValTable).append(tbodyFrozenVal));
            if (!this.model.frozenHeaderSettings.enableFrozenRowHeaders && this.model.frozenHeaderSettings.enableFrozenColumnHeaders) {
                $(tableOlapGrid).append("<tr><td style='padding:0px'></td></tr><tr><td style='padding:0px'></td></tr>"); //<td style='padding:0px'></td>
                $(tableOlapGrid).find("tr:first td:eq(0)").append($("<div id='headerContent' class='headerContent'></div>"))
                $($(tableOlapGrid).find("tr:last td:eq(0)")).append($(valScrollArea));
                $(tableOlapGrid).find(".headerContent").append(colmovdiv);
                $(tableOlapGrid).find(".headerContent .colhead").prepend(colfrediv);
                $(tableOlapGrid).find(".headerContent .colhead").append("<div class='headerTable'/>");
                $(tableOlapGrid).find(".pivotGridFrozenTable").appendTo($(tableOlapGrid).find(".headerTable"));
                $(tableOlapGrid).find(".valScrollArea").append($(rowHeaderArea));
                $(tableOlapGrid).find(".rowHeaderArea").append(rowdiv, valdiv);               
            }
            else if (this.model.frozenHeaderSettings.enableFrozenRowHeaders && !this.model.frozenHeaderSettings.enableFrozenColumnHeaders) {
                $(tableOlapGrid).append("<tr ><td style='padding:0px;border-right:0px' ></td><td style='padding:0px;'></td></tr>"); //<td style='padding:0px'></td>
                $(tableOlapGrid).find("tr:first td:eq(0)").append($("<div id='headerContent' class='headerContent' style='position:relative'></div>"));
                $(tableOlapGrid).find(".headerContent").append(colfrediv ,rowdiv);
                $(tableOlapGrid).find("tr td:last").append($(valScrollArea));
                $(tableOlapGrid).find(".valScrollArea").append($(rowHeaderArea));
                $(tableOlapGrid).find(".rowHeaderArea").append(colmovdiv,valdiv);
            }
            else {
                $(tableOlapGrid).append("<tr><td style='padding:0px'></td><td style='padding:0px;'></td></tr><tr><td style='padding:0px'></td><td style='padding:0px' class='valueArea'></td></tr>");
                $(tableOlapGrid).find("tr:first td:eq(0)").append(colfrediv);
                $(tableOlapGrid).find("tr:first").children("td:eq(1)").append(colmovdiv);
                $(tableOlapGrid).find("tr:last td:eq(0)").append($(rowHeaderArea));
                $(tableOlapGrid).find(".rowHeaderArea").append(rowdiv);
                $(tableOlapGrid).find(".valueArea").append($(valScrollArea));
                $(tableOlapGrid).find(".valScrollArea").append(valdiv);
            }
            if (this.model.enableGroupingBar) {
                if ($(tableOlapGrid).find(".e-grpRow").length > 0){
                    $(tableOlapGrid).find(".e-grpRow").appendTo($(tableOlapGrid).find(".colfreeze table tr:eq(0)"));
                    $(tableOlapGrid).find(".e-grpRow").removeAttr("colspan").removeAttr("rowspan");
                }
            }
            else if ($(tableOlapGrid).find("[data-p='0,0']").length > 0 || $(tableOlapGrid).find("[data-p='-1,-1']").length > 0) {
                if ((this.model.enablePaging || this.model.enableVirtualScrolling) ? ($(tableOlapGrid).find(".rowheader").length > 0 || $(tableOlapGrid).find(".rstot").length > 0 || $(tableOlapGrid).find(".rgtot").length > 0) : $(tableOlapGrid).find(".rowheader").length > 0) {
                    var index = $(tableOlapGrid).find("[data-p='-1,-1']").length > 0 ? "-1,-1" : "0,0";
                    $(tableOlapGrid).find("[data-p='" + index + "']").appendTo($(tableOlapGrid).find(".colfreeze table tr:eq(0)"));
                    $(tableOlapGrid).find("[data-p='" + index + "']").removeAttr("colspan").removeAttr("rowspan");
                }
            }
        },


        _applyFrozenHeaderWidth: function (jsonObj, drillAction, targetEle) {
            var isFrozenHeader = this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders;
            if (isFrozenHeader) {
                if (!ej.isNullOrUndefined(jsonObj) && jsonObj.length > 0) {
                    var scrollerObj = this.element.find(".e-scroller").data("ejScroller");
                    if (scrollerObj) {
                        scrollerObj.destroy();
                        $(this.element).css("overflow", "");
                        this.element.find(".pivotGridRowTable, .pivotGridValueTable , .pivotGridFrozenTable").removeAttr("style");
                    }
                    if (this.model.frozenHeaderSettings.enableFrozenRowHeaders && !this.model.frozenHeaderSettings.enableFrozenColumnHeaders) {
                        this.element.find(".pivotGridValueTable,.pivotGridFrozenTable").addClass("rowFrozenTable");
                    } else
                        this.element.find(".pivotGridValueTable,.pivotGridFrozenTable").removeClass("rowFrozenTable");
                    //#region colgroup
                    this.element.find(".pivotGridFrozenTable colgroup, .pivotGridValueTable colgroup").remove();
                    var colgroup = $("<colgroup></colgroup>"), colgrp = [];
                    var colHeaderElement = this.element.find(".pivotGridFrozenTable");
                    var visibleRowIndex = this.element.find(".pivotGridRowTable tr:visible").index();
                    var valueCellTable = this.element.find(".pivotGridValueTable tr:eq(" + visibleRowIndex + ") td");

                    for (var i = 0; i < valueCellTable.length; i++) {
                        var colIndex = $(valueCellTable[i]).attr("data-p").split(",")[0];
                        var headerCells = colHeaderElement.find("[data-p^='" + colIndex + ",']");
                        if (!ej.isNullOrUndefined(headerCells.last().attr("colSpan")) && headerCells.last().attr("colSpan") != '1')
                            headerCells = headerCells[headerCells.length - 2];
                        else
                            headerCells = $(headerCells).last();

                        if ($(valueCellTable[i]).is(":visible"))
                            colgroup.append("<col style='width:" + Math.max($(headerCells).outerWidth(), $(valueCellTable[i]).outerWidth()) + "px'>");
                    } 
                    this.element.find(".pivotGridFrozenTable, .pivotGridValueTable").prepend(colgroup);
                    if (!this.model.enableColumnGrandTotal && this.element.find(".pivotGridValueTable tr:visible:eq(0) td:visible").length != $(colgroup).children().length) {
                        var removeSpan = parseInt(this.element.find(".pivotGridFrozenTable tr:first td:last").attr("colspan"));
                        this.element.find(".pivotGridFrozenTable colgroup col").slice(-removeSpan).remove();
                        this.element.find(".pivotGridValueTable colgroup col").slice(-removeSpan).remove();
                    }
                    //#end region colgroup
                    this._refreshScroller();
                }
            }
        },

        _refreshScroller: function () {
            var scrollerSize = ej.isNullOrUndefined(this.model.frozenHeaderSettings.scrollerSize) ? 18 : this.model.frozenHeaderSettings.scrollerSize;
            var isPivotClient =  !ej.isNullOrUndefined(this._pivotClientObj) && $("#" + this._pivotClientObj._id + "_PivotGridToolbar").length > 0;
            var gridElement = isPivotClient ? $("#" + this._pivotClientObj._id + "_PivotGridToolbar") : [];
            if (this.element.find(".values").width() > this.element.find(".pivotGridRowTable").width())
                this.element.find(".pivotGridRowTable").width(this.element.find(".values").width());
            if (this.element.find(".pivotGridValueTable .value:visible").length > 0) {
                this.element.find(".pivotGridFrozenTable").height(this.element.find(".colfreeze").height());
                if (!this.model.frozenHeaderSettings.enableFrozenRowHeaders && this.model.frozenHeaderSettings.enableFrozenColumnHeaders) {
                    this._removeFrozenBorders();
                    this.element.find(".headerContent").width(this.element.width());
                    this.element.find(".colfreeze").css({ height: this.element.find(".pivotGridFrozenTable").height(), "width": (this.element.find(".pivotGridRowTable").width()), float: (this.model.enableRTL ? "right" : "left") });
                    this.element.find(".valueCell").css({ "display": "inline-block", width: (this.element.width() - this.element.find(".pivotGridRowTable").width()) });
                    this.element.find(".pivotGridValueTable, .pivotGridFrozenTable").css({ width: "100%", "table-layout": "fixed" });
                    this.element.find(".headerContent").css({ "position": "relative", "overflow": "hidden" });
                    this.element.find(".colmovable").css({ "display": "inline", "position": "relative", "overflow": "hidden" });
                    this.element.find(".headerContent").height(this.element.find(".headerTable").height());

                    var scrollHeight = 0, scrollWidth = 0;
                    if (this.element.find(".pivotGridValueTable").height() > 0) {
                        var groupingBarHeight = (this.model.enableGroupingBar ? this.element.find(".groupingBarPivot").height() : 0);
                        var colHeaderHeight = this.element.find(".headerContent").height();
                        var valCellTblHeight = this.element.find(".valueCell").height();
                        var calcHeight = colHeaderHeight + valCellTblHeight + groupingBarHeight;
                        var valTableHeight = this.element.height();
                        var valTableWidth = this.element.find(".e-pivotGridTable").width();
                        var calcWidth = this.element.find(".pivotGridValueTable").width() + this.element.find(".pivotGridRowTable").width();
                        if (isPivotClient) {
                            $(gridElement).css("overflow", "hidden");
                            valTableHeight = $(gridElement).height();
                            var calcWidth = this.element.find(".pivotGridValueTable").width() + this.element.find(".pivotGridRowTable").width();
                            valTableWidth = $(gridElement).width();
                        }
                        scrollHeight = ((valTableHeight > calcHeight) ? calcHeight : (valTableHeight)) - colHeaderHeight - groupingBarHeight;
                        scrollWidth = (valTableWidth > calcWidth) ? calcWidth : (valTableWidth);
                        if (isPivotClient) {
                            this.element.find(".valueCell").width(($(gridElement).width() - this.element.find(".pivotGridRowTable").width() - 5));
                            scrollWidth = this.element.find(gridElement).width() - 3;
                            //$(gridElement).css("overflow", "hidden");
                            //if ((gridElement.width()) < (this.element.find(".pivotGridRowTable").width()))
                            //    $(gridElement).css("overflow", "auto");
                            if (scrollWidth < 0)
                                scrollWidth = 200;
                        }
                    }
                    this.element.find("#rowvaluecontent").ejScroller({
                        scroll: this._applyScroll,
                        scrollerSize: scrollerSize,
                        width: scrollWidth, height: scrollHeight, targetControl: this,
                        enableRTL: this.model.enableRTL
                    });

                    if (this.model.enableRTL)
                        this.element.find(".rowhead").css({ "float": (this.model.enableRTL ? "right" : "left") });
                    if (this.element.find(".e-vscrollbar").length > 0) {
                        this.element.find(".valueCell").width((this.element.find(".valueCell").width() - scrollerSize));
                        this.element.find(".headerContent").width((this.element.find(".headerContent").width() -(isPivotClient ? 28.5 : 18)));                        //this.element.find(".headerContent").width(this.element.find(".pivotGridValueTable").width());
                    }
                    this.element.find(".headerTable").css({ "display": "inline-block", "width": this.element.find(".valueCell").width() });
                    if (this.model.enableGroupingBar) {
                        this.element.find(" .groupingBarPivot").width("100%");
                        var colTableWidth = this.element.find(".pivotGridRowTable").width();
                        this.element.find(".e-grpRow ,.values").width(colTableWidth);
                        this.element.find(".columns").css({ "height": "auto", width: "calc(100% -  " + this.element.find(".values").width() + ")" });
                    }
                }
                else if (this.model.frozenHeaderSettings.enableFrozenRowHeaders && !this.model.frozenHeaderSettings.enableFrozenColumnHeaders) {
                    this._removeFrozenBorders(isPivotClient);
                    var groupingBarHeight = (this.model.enableGroupingBar ? this.element.find(".groupingBarPivot").height() : 0);
                    this.element.find(".pivotGridValueTable, .pivotGridFrozenTable").css({ width: "100%", "table-layout": "fixed" });
                    this.element.find(".colfreeze").height(this.element.find(".pivotGridFrozenTable").height());
                    this.element.find(".colhead").css("overflow", "visible");
                    var scrollHeight = 0, scrollWidth = 0;
                    if (this.element.find(".pivotGridValueTable").height() > 0) {
                        var calcHeight = this.element.height();
                        if (isPivotClient)
                            calcHeight = $(gridElement).height() - 5;
                        var valTableHeight = this.element.find(".rowHeaderArea").height();
                        var calcWidth = this.element.width() - this.element.find(".headerContent").width();
                        var valTableWidth = this.element.find(".pivotGridValueTable").width();
                        scrollWidth = valTableWidth > calcWidth ? calcWidth : valTableWidth;
                        scrollHeight = (valTableHeight > (calcHeight) ? calcHeight : valTableHeight) - groupingBarHeight;// + ((valTableWidth > calcWidth) ? this.model.frozenHeaderSettings.scrollerSize : 0);
                        if (isPivotClient && scrollWidth < 0) {
                            scrollWidth = 200;
                        }
                    }
                    this.element.find(".pivotGridRowTable").css({ width: "100%", "table-layout": "fixed" });
                    this.element.find("#rowvaluecontent").ejScroller({
                        scrollerSize: scrollerSize,
                        scroll: this._applyScroll,
                        width: scrollWidth, height: scrollHeight, targetControl: this, enableRTL: this.model.enableRTL
                    });
                    this.element.find(".headerContent").css({ "height": this.element.find("#rowvaluecontent").height(), "overflow": "hidden", "border-right": "0px" });
                    this.element.find(".rowhead").css("padding-bottom", (this.element.find("#rowvaluecontent .e-hscrollbar").length > 0) ? scrollerSize : "0px");
                    if (this.model.enableGroupingBar) {
                        this.element.find(" .groupingBarPivot,.colfreeze").width("100%");
                        var colTableWidth = this.element.find(".pivotGridRowTable").width();
                        this.element.find(".e-grpRow ,.values").width(colTableWidth);
                        this.element.find(".columns").width((this.element.find(".valueColumn").width() - this.element.find(".values").width()) - 5);
                        this.element.find(".columns").css("height", "auto");
                    }
                }
                else {
                    this._removeFrozenBorders();
                    this.element.find(".rowhead").css({ "overflow": "hidden", width: (this.element.find(".pivotGridRowTable").width()) });
                    var calcHeight = this.element.height() - (this.element.find(".colhead").outerHeight() + (this.model.enableGroupingBar ? this.element.find(".groupingBarPivot").height() : 0));
                    if (isPivotClient)
                        var calcHeight = $(gridElement).outerHeight() - (this.element.find(".colhead").outerHeight() + (this.model.enableGroupingBar ? this.element.find(".groupingBarPivot").height() : 0));
                    var valTableHeight = this.element.find(".pivotGridValueTable").height();

                    this.element.find(".rowhead").height(valTableHeight > (calcHeight) ? calcHeight : valTableHeight);
                    this.element.find(".colfreeze").width(this.element.find(".pivotGridRowTable").width());
                    this.element.find(".pivotGridFrozenTable, .pivotGridValueTable").css({ width: "100%", "table-layout": "fixed" });
                    var calcWidth = this.element.width() - this.element.find(".pivotGridRowTable").width() - 3;
                    var valTableWidth = this.element.find(".pivotGridValueTable").width(); //
                    var scrollWidth = (((valTableWidth) > (calcWidth) ? (calcWidth) : valTableWidth));// +(valTableHeight > (calcHeight)?10:0);
                    var scrollHeight = (this.element.find(".rowhead").height() + (valTableWidth > calcWidth ? scrollerSize : 0));;

                    if (isPivotClient) {
                        this.element.find(".rowhead").height(this.element.find(".rowhead").height() - 10);
                        this.element.find(".rowhead, .colfreeze").width(this.element.find(".pivotGridRowTable").width() - 5);
                        var scrollHeight = (this.element.find(".rowhead").height());// + (valTableWidth > calcWidth ? this.model.frozenHeaderSettings.scrollerSize : 0));;
                        if (scrollWidth < 0)
                            scrollWidth = 200;
                    }
                    this.element.find("#rowvaluecontent").ejScroller({
                        scroll: this._applyScroll,
                        width: scrollWidth,
                        height: (scrollHeight),
                        targetControl: this,
                        scrollerSize: scrollerSize,
                        enableRTL: this.model.enableRTL
                    });

                    if (isPivotClient)
                        this.element.find(".rowhead, .pivotGridRowTable").width("100%"); //
                    this.element.find(".colmovable").width(this.element.find(".valueCell").width());
                    if(this.element.find("#rowvaluecontent .e-hscrollbar").length > 0){
                        this.element.find(".rowhead").css("margin-bottom", scrollerSize);
                        this.element.find(".rowhead").addClass("frozenBorderBtmClr");                        
                    }
                    else{
                        this.element.find(".rowhead").css("margin-bottom", "0px");
                        this.element.find(".rowhead").removeClass("frozenBorderBtmClr");
                    }
                    this.element.find(".colhead , .colfreeze").height(this.element.find(".pivotGridFrozenTable").height());
                    if (this.element.find(".e-rows").height() > this.element.find(".colfreeze").height())
                        this.element.find(".colmovable .colhead .pivotGridFrozenTable thead tr,.colfreeze").height(this.element.find(".e-rows").height() + 15);
                    this.element.find(".pivotGridFrozenTable").height("100%");
                    this.element.find(".rowhead").height(this.element.find(".valueCell").height());
                    if (this.element.find(".e-scroller .e-hscroll").length == 0 && !this.model.enableVirtualScrolling) {
                        this.element.find(".e-scroller").height("auto");
                    }
                    if (this.model.enableGroupingBar) {
                        var colTableWidth = this.element.find(".pivotGridRowTable").width();
                        this.element.find(".e-grpRow ,.values").width(colTableWidth);
                        this._refreshGroupingBarLayout();
                    }
                }
                this.element.find(".rowhead").scrollTop(0);
                this.element.find(".groupingBarPivot ").width(this.element.find(".e-pivotGridTable").width());
            }
            else {
                $(this.element).css("overflow", "auto");
                this.element.find(".headerTable").css("display", "inline-block");
                this.element.find(".valScrollArea").css("height", "100%");
            }
        },

        _removeFrozenBorders: function (isPivotClient) {
            var isRTL = this.model.enableRTL;
            var pvtGrid = this.element;
            if (isPivotClient) {
                var gridElement = isPivotClient ? $("#" + this._pivotClientObj._id + "_PivotGridToolbar") : [];

                $(gridElement).css("overflow", "hidden");
                if ((gridElement.width()) < (this.element.find(".pivotGridRowTable").width()))
                    $(gridElement).css("overflow", "auto");
                if ((gridElement.height()) < (this.element.find(".e-pivotGridTable").height()))
                    $(gridElement).css("overflow", "auto");
            }
            if ((this.model.frozenHeaderSettings.enableFrozenHeaders && (!this.model.frozenHeaderSettings.enableFrozenColumnHeaders && !this.model.frozenHeaderSettings.enableFrozenRowHeaders)) || (this.model.frozenHeaderSettings.enableFrozenColumnHeaders && this.model.frozenHeaderSettings.enableFrozenRowHeaders)) {
                pvtGrid.find(".colhead").css({ "border-right": "1px solid rgb(200, 200, 200)" });
                pvtGrid.find(".pivotGridRowTable, .pivotGridRowTable tr td:first-child").css({ "border-collapse": "collapse", "border-spacing": "0" });
                pvtGrid.find(".pivotGridRowTable tr td:last-child").css({ "border-collapse": "collapse", "border-spacing": "0" });
                pvtGrid.find(".pivotGridValueTable, .pivotGridValueTable tr td:first-child").css({ "border-collapse": "collapse", "border-spacing": "0" });
                pvtGrid.find(".pivotGridFrozenTable,  .pivotGridFrozenTable tr:nth-child(1) td").css({ "border-collapse": "collapse", " border-spacing": "0", "border-top": "0px" });
                pvtGrid.find(".colfretable .e-grpRow").css({ "border-top": "0px" });
                pvtGrid.find(".pivotGridValueTable tr:visible:eq(0) td, .pivotGridRowTable tr:visible:eq(0) td").css("border-top", "0px");
                if (!isRTL) {
                    pvtGrid.find(".pivotGridRowTable, .pivotGridRowTable tr td:first-child").css({ "border-left": "0px" });
                    pvtGrid.find(".pivotGridRowTable tr td:last-child").css({ "border-right": "0px" });
                    pvtGrid.find(".pivotGridValueTable, .pivotGridValueTable tr td:first-child").css({ "border-left": "0px" });
                    pvtGrid.find(".colfretable .e-grpRow").css({ "border-left": "0px", "border-right": "0px" });
                }
                else {
                    pvtGrid.find(".pivotGridRowTable, .pivotGridRowTable tr td:first-child").css({ "border-right": "0px" });
                    pvtGrid.find(".pivotGridRowTable tr td:last-child").css({ "border-left": "0px" });
                    pvtGrid.find(".pivotGridValueTable, .pivotGridValueTable tr td:first-child").css({ "border-right": "0px" });
                    pvtGrid.find(".colfretable .e-grpRow").css({ "border-right": "0px", "border-left": "0px" });
                }
                var tblRow = pvtGrid.find(".pivotGridValueTable tr").length;
                for (i = 0; i < tblRow; i++) {
                    if (!isRTL) {
                        pvtGrid.find(".pivotGridValueTable tr:eq(" + i + ") td:visible:eq(0)").css("border-left", "0px");
                        pvtGrid.find(".pivotGridValueTable tr:eq(" + i + ") td:visible:last").css("border-right", "0px");
                    }
                    else {
                        pvtGrid.find(".pivotGridValueTable tr:eq(" + i + ") td:visible:eq(0)").css("border-right", "0px");
                        pvtGrid.find(".pivotGridValueTable tr:eq(" + i + ") td:visible:last").css("border-left", "0px");
                    }
                }
                // pvtGrid.find(".colfretable .e-grpRow").css({ "border-left": "0px", "border-top": "0px" });
                pvtGrid.find(".pivotGridFrozenTable td").css("border-bottom", "0px");

                var headerLength = this.element.find(".pivotGridFrozenTable tr").length;
                for (i = 0; i < headerLength; i++) {
                    if (!isRTL) {
                        pvtGrid.find(".pivotGridFrozenTable tr:eq(" + i + ") td:visible:eq(0)").css("border-left", "0px");
                        pvtGrid.find(".pivotGridFrozenTable tr:eq(" + i + ") td:visible:last").css("border-right", "0px");
                    }
                    else {
                        pvtGrid.find(".pivotGridFrozenTable tr:eq(" + i + ") td:visible:eq(0)").css("border-right", "0px");
                        pvtGrid.find(".pivotGridFrozenTable tr:eq(" + i + ") td:visible:last").css("border-left", "0px");
                    }
                }
                pvtGrid.find(".pivotGridRowTable tr:visible:last td").css("border-bottom", "0");
                pvtGrid.find(".pivotGridValueTable tr:visible:last td").css("border-bottom", "0");
            }
            else {
                this.element.find(".pivotGridFrozenTable tr:first td").css("border-top", "0px");
                this.element.find(".pivotGridRowTable tr td:first-child").css((this.model.enableRTL ? "border-right" : "border-left"), "0px");
                this.element.find(".pivotGridRowTable tr td:last-child").css((!this.model.enableRTL ? "border-right" : "border-left"), "0px");
                this.element.find(".pivotGridFrozenTable tr:last td").css("border-bottom", "0px");

                if (!this.model.frozenHeaderSettings.enableFrozenColumnHeaders && this.model.frozenHeaderSettings.enableFrozenRowHeaders) {
                    this.element.find(".pivotGridFrozenTable tr td:first-child").css((this.model.enableRTL ? "border-right" : "border-left"), "0px")
                    this.element.find(".pivotGridValueTable tr:last td").css("border-bottom", "0px");
                    if (this.element.find(".pivotGridValueTable tr td:visible:eq(0)").attr("p"))
                        this.element.find(".pivotGridValueTable tr td[p^='" + this.element.find(".pivotGridValueTable tr td:visible:eq(0)").attr("p").split(",")[0] + ",']").css((this.model.enableRTL ? "border-right" : "border-left"), "0");
                }
                else if (this.model.frozenHeaderSettings.enableFrozenColumnHeaders && !this.model.frozenHeaderSettings.enableFrozenRowHeaders) {
                    this.element.find(".pivotGridRowTable  tr:eq(0) td").css("border-top", "0px");
                    this.element.find(".pivotGridValueTable tr:eq(0) td").css("border-top", "0px");
                }
            }
        },

        _applyScroll: function () {
            if ((this.model.targetControl.model.frozenHeaderSettings.enableFrozenRowHeaders && this.model.targetControl.model.frozenHeaderSettings.enableFrozenColumnHeaders) || this.model.targetControl.model.frozenHeaderSettings.enableFrozenHeaders && (!this.model.targetControl.model.frozenHeaderSettings.enableFrozenRowHeaders && !this.model.targetControl.model.frozenHeaderSettings.enableFrozenColumnHeaders)) {
                if (this.isVScroll())
                    this.model.targetControl.element.find(".rowhead").scrollTop(this.model.scrollTop);
                if (this.isHScroll())
                    this.model.targetControl.element.find(".colhead").scrollLeft(this.model.scrollLeft);
            }
            else if (!(this.model.targetControl.model.frozenHeaderSettings.enableFrozenRowHeaders) && this.model.targetControl.model.frozenHeaderSettings.enableFrozenColumnHeaders) {
                if (this.isHScroll())
                    this.model.targetControl.element.find(".colhead").scrollLeft(this.model.scrollLeft);
            }
            else {
                if (this.isVScroll())
                    this.model.targetControl.element.find(".headerContent").scrollTop(this.model.scrollTop);
            }
        },

        _setGroupingBarFrozenRowBtnWidth: function () {
            if ((this.model.frozenHeaderSettings.enableFrozenRowHeaders && this.model.frozenHeaderSettings.enableFrozenColumnHeaders || (this.model.frozenHeaderSettings.enableFrozenHeaders && !(this.model.frozenHeaderSettings.enableFrozenRowHeaders && this.model.frozenHeaderSettings.enableFrozenColumnHeaders))) && this.element.find(".pivotGridRowTable").outerWidth()>= this.element.find(".e-grpRow").outerWidth())
                this.element.find(".pivotGridRowTable").css("min-width", this.element.find(".e-grpRow").outerWidth());
            this.element.find(".e-grpRow .e-removeBtn, .e-grpRow .filter, .e-grpRow .e-sorting ").css("position", "inherit");
            this.element.find(".colfreeze .e-pivotButton").width("auto");
            var areaWidth = this.element.find(".pivotGridRowTable").width();
            var pivotButtons = this.element.find(".colfreeze .e-pivotButton");
            var pvtBtn = areaWidth / (pivotButtons.length);
            if (areaWidth < pvtBtn)
                pvtBtn = areaWidth - (40);
            if (this.element.find(".e-rows").width() > areaWidth) {
                var pvtBtnsWidth = pvtBtn * (pivotButtons.length);
                var btnOuterWidth = 0, btnWidth = 0;
                $.each(this.element.find(".e-rows .e-pivotButton"), function (i, v) { btnOuterWidth += $(v).width() });
                $.each(this.element.find(".e-rows .e-pivotButton .e-pvtBtn"), function (i, v) { btnWidth += $(v).width() });
                var btnSpanWidth = (btnOuterWidth - btnWidth) / pivotButtons.length;
                if (pvtBtn - btnSpanWidth < 40) {
                    pvtBtn = btnSpanWidth + 40;
                    pvtBtnsWidth = pvtBtn * (pivotButtons.length);
                }
                this.element.find(".e-rows .e-pivotButton").width((pvtBtn - 20));
                this.element.find(".e-rows .e-pvtBtn").css({ width: (pvtBtn - 10 - btnSpanWidth), "text-overflow": "ellipsis" })
                this.element.find(".e-rows").css({ "white-space": "nowrap" });
                var buttonWidth = this.element.find(".colfreeze .e-pivotButton:eq(0)").outerWidth();
                var pivotArea = (buttonWidth * pivotButtons.length) + 30;
                this.element.find(".pivotGridRowTable,.rowhead,.colfreeze table,.valueColumn span.values").width(pivotArea);
            }
        },

        _refreshGroupingBarLayout: function () {
            if (this.element.find(".e-pivotGridTable .value").length > 0 || this.element.find(".e-pivotGridTable .colheader").length > 0) {
                this.element.find(".groupingBarPivot ").width(this.element.find(".e-pivotGridTable").width());
            }
            else if (this.element.find(".pivotGridRowTable").length > 0) {
                this.element.find(".groupingBarPivot ").width(this.element.find(".pivotGridRowTable").width() + 140);
            } else
                this.element.find(".groupingBarPivot ").width(330);
            var colTableWidth = this.element.find(".pivotGridRowTable").width();
            this.element.find(".e-grpRow ,.values").width(colTableWidth);
            this.element.find(".columns").css({ "height": "auto", width: (this.element.find(".valueColumn").width() - this.element.find(".values").width() - 1) });
            this._setGroupingBarFrozenRowBtnWidth();
        },
        _cellRangeInfo: function (e) {
            var pGridObj = $(e.target).parents(".e-pivotgrid").data("ejPivotGrid");
            if ($(this.element).parents(".e-pivotclient").length > 0 && this._pivotClientObj.model.enableDrillThrough && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                this._dataSet = this._pivotClientObj.dataSet;
            if ($(e.target).hasClass("cellValue")) e.target = e.target.parentElement;
            var colHaederLength = $("thead tr").length, selectedCellsDetails = [], selectedCells = [], j = 0, l = 0, pivotReport = {};
            var colheaders = $.grep(this.getJSONRecords(), function (item) { return (item.CSS.indexOf("colheader") > -1 || item.CSS.indexOf("summary cstot") > -1 || item.CSS.indexOf(" calc") > -1) && item.CSS.indexOf("colheader calc") == -1 && item.Index.split(',')[0] == $(e.target).attr("data-p").split(",")[0] });
            var rowheaders = $.grep(this.getJSONRecords(), function (item) { return (item.CSS.indexOf("rowheader") > -1 || item.CSS.indexOf("summary rstot") > -1) && item.Index.split(',')[1] == $(e.target).attr("data-p").split(",")[1] });
            if (rowheaders.length == 1 && colheaders.length == 1 && (rowheaders[0].Value.toString().indexOf(this._getLocalizedLabels("GrandTotal")) >= 0 || colheaders[0].Value.toString().indexOf(this._getLocalizedLabels("GrandTotal")) >= 0 || colheaders[0].CSS.indexOf(" calc") > -1)) {
                var obj = [];

                if ((colheaders[0].Value.toString().indexOf(this._getLocalizedLabels("GrandTotal")) >= 0 || colheaders[0].CSS.indexOf(" calc") > -1) && rowheaders[0].Value.toString().indexOf("Grand") >= 0) {
                    for (var i = 0; i < this.model.dataSource.data.length; i++) {
                        selectedCellsDetails[i] = this.model.dataSource.data[i];
                    }
                }
                else {
                    if (rowheaders[0].Value.toString().indexOf(this._getLocalizedLabels("GrandTotal")) >= 0)
                        var text = colheaders[0].Value.toString().indexOf(this._getLocalizedLabels("Total")) >= 0 ? colheaders[0].Value.replace(" " + this._getLocalizedLabels("Total"), "") : colheaders[0].Value
                    else if (colheaders[0].Value.toString().indexOf(this._getLocalizedLabels("Total")) >= 0 || colheaders[0].CSS.indexOf(" calc") > -1)
                        var text = rowheaders[0].Value.toString().indexOf(this._getLocalizedLabels("Total")) >= 0 ? rowheaders[0].Value.replace(" " + this._getLocalizedLabels("Total"), "") : rowheaders[0].Value

                    for (var i = 0; i < pGridObj.model.dataSource.data.length; i++) {
                        $.each(pGridObj.model.dataSource.data[i], function (key, value) {
                            if (value == text) {
                                selectedCellsDetails[j] = pGridObj.model.dataSource.data[i];
                                j++;
                            }
                        })
                    }
                }
            }

            else if (rowheaders.length >= 1 && colheaders.length >= 1 && (rowheaders[0].Value.toString().indexOf(this._getLocalizedLabels("Total")) >= 0 || colheaders[0].Value.toString().indexOf(this._getLocalizedLabels("Total")) >= 0)) {
                if (rowheaders[0].Value.toString().indexOf(this._getLocalizedLabels("Total")) >= 0)
                    var text = colheaders, text1 = rowheaders;
                else if (colheaders[0].Value.toString().indexOf(this._getLocalizedLabels("Total")) >= 0)
                    var text = rowheaders, text1 = colheaders;
                var selectedCellTempArray = (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) ? this.model.dataSource.data : (this._dataSet.length > 0 ? JSON.parse(this._dataSet) : []);

                for (var k = text.length - 1; k >= 0; k--) {
                    var selectedCellArray = new Array();
                    for (var i = 0; i < selectedCellTempArray.length; i++) {
                        $.each(selectedCellTempArray[i], function (key, value) {
                            if (value == text[k].Value) {
                                selectedCellArray.push(selectedCellTempArray[i]);
                            }

                        });
                    }
                    selectedCellTempArray = selectedCellArray;
                }
                selectedCellsDetails = selectedCellArray;
                if (text1[0].Value.toString().indexOf("Grand") <= 0) {
                    var selectedCellArray = new Array();
                    for (var i = 0; i < selectedCellTempArray.length; i++) {
                        $.each(selectedCellTempArray[i], function (key, value) {
                            if (value == text1[0].Value.replace(" Total", "")) {
                                selectedCellsDetails = [];
                                selectedCellArray.push(selectedCellTempArray[i]);
                            }
                        });
                    }
                }
                selectedCellsDetails = selectedCellsDetails.length == 0 ? selectedCellArray : selectedCellsDetails;
            }
            else {
                var rowText = rowheaders, colText = colheaders;
                var selectedCellTempArray = (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) ? this.model.dataSource.data : (this._dataSet.length > 0 ? JSON.parse(this._dataSet) : []);

                for (var k = rowText.length - 1; k >= 0; k--) {
                    var selectedCellArray = new Array();
                    for (var i = 0; i < selectedCellTempArray.length; i++) {
                        $.each(selectedCellTempArray[i], function (key, value) {
                            if (value == rowText[k].Key || value == rowText[k].Value) {
                                selectedCellArray.push(selectedCellTempArray[i]);
                            }
                        });
                    }
                    selectedCellTempArray = selectedCellArray;
                }
                for (var k = colText.length - 1; k >= 0; k--) {
                    if (colText[k].CSS.indexOf("calc") == -1) {
                        var selectedCellArray = new Array();
                        for (var i = 0; i < selectedCellTempArray.length; i++) {
                            $.each(selectedCellTempArray[i], function (key, value) {
                                if (value == colText[k].Key || value == colText[k].Value) {
                                    selectedCellArray.push(selectedCellTempArray[i]);
                                }

                            });
                        }
                        selectedCellTempArray = selectedCellArray;
                    }
                }
                selectedCellsDetails = selectedCellsDetails.length == 0 ? selectedCellArray : selectedCellsDetails;
            }
            var eventArgs = { selectedData: selectedCellsDetails, element: this.element, customObject: this.model.customObject };
            if (this.model.enableCellDoubleClick && this.model.enableCellDoubleClick != null && e.type == "dblclick") {
                if (!ej.isNullOrUndefined(this._pivotClientObj))
                    this._pivotClientObj._trigger("cellDoubleClick", eventArgs);
                else
                    this._trigger("cellDoubleClick", eventArgs);
            }
            if (this.model.enableCellClick && this.model.enableCellClick != null && e.type == "click") {
                if (!ej.isNullOrUndefined(this._pivotClientObj))
                    this._pivotClientObj._trigger("cellClick", eventArgs);
                else
                    this._trigger("cellClick", eventArgs);
            }
            if ((this.model.enableDrillThrough || ($(this.element).parents(".e-pivotclient").length > 0) && this._pivotClientObj.model.enableDrillThrough) && selectedCellsDetails.length > 0) {
                var control = $(this.element).parents(".e-pivotclient").length > 0 && this._pivotClientObj.model.enableDrillThrough ? this._pivotClientObj : this;
                 control._trigger("drillThrough", eventArgs);
    }
},

        _initCellEditing: function (e) {
            if (e.target.tagName != "INPUT" && !$(e.target).hasClass("summary") && !$(e.target).parent().hasClass("summary")) {
                this._on(this.element, "mouseup", ".value", this._completeCellEditing);
                var targetCell;
                _oriX = e.pageX, _oriY = e.pageY;
                targetCell = e.target || window.event.srcElement;
                if ($(targetCell).hasClass("cellValue")) targetCell = $(targetCell).parent()[0];
                $(".value").addClass("selection");
                $("#" + this._id).append(ej.buildTag("div.e-cellSelection#" + this._id + "_cellSelection", "", {}));
                _startPosCell = $(targetCell)[0].attributes.getNamedItem("data-p").value;
                this._on(this.element, "mousemove", ".value, .e-cellSelection", this._cellSelection);
            }
            else
                this._off(this.element, "mouseup", ".value", this._completeCellEditing);
        },

        _completeCellEditing: function (e) {
            var targetCell, endPosCell, cellInfo = [], rowLThPos, curCelPos;
            if (e.target.tagName != "INPUT") {
                this._off(this.element, "mousemove", ".value");
                $(".value").removeClass("selection");
                targetCell = e.target || window.event.srcElement;
                if ($(targetCell).hasClass("cellValue")) targetCell = $(targetCell).parent()[0];
                endPosCell = $(targetCell)[0].attributes.getNamedItem("data-p").value;
                var count = 0;
                var inputBoxes = this.element.find(".curInput");
                if (inputBoxes.length > 0) {
                    if ($(targetCell).find(".curInput").length == 0)
                        this._updateTableCell();
                    $("#" + this._id + "_cellSelection").remove();
                    if (this.model.enableToolTip) {
                        this._on(this.element, "mousemove", ".value", this._applyToolTip);
                    }
                    this._off(this.element, "mouseup", ".value");
                    return false;
                }
                for (var rowSelCnt = (parseInt(_startPosCell.split(",")[1]) < parseInt(endPosCell.split(",")[1]) ? parseInt(_startPosCell.split(",")[1]) : parseInt(endPosCell.split(",")[1])) ; rowSelCnt <= (parseInt(_startPosCell.split(",")[1]) > parseInt(endPosCell.split(",")[1]) ? parseInt(_startPosCell.split(",")[1]) : parseInt(endPosCell.split(",")[1])) ; rowSelCnt++) {
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap || $("#" + this._id).find("td[data-p*='," + rowSelCnt + "']").parent().is(":visible")) {
                        for (var colSelCnt = (parseInt(_startPosCell.split(",")[0]) < parseInt(endPosCell.split(",")[0]) ? parseInt(_startPosCell.split(",")[0]) : parseInt(endPosCell.split(",")[0])) ; colSelCnt <= (parseInt(_startPosCell.split(",")[0]) > parseInt(endPosCell.split(",")[0]) ? parseInt(_startPosCell.split(",")[0]) : parseInt(endPosCell.split(",")[0])) ; colSelCnt++) {
                            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap || $("#" + this._id).find("[data-p*='" + colSelCnt + ",']").last("th").is(":Visible") || (!this.model.enableGrandTotal || !this.model.enableRowGrandTotal)) {
                                cellInfo[count] = this.getJSONRecords()[((colSelCnt) * this._rowCount) + rowSelCnt];
                                if (!$("[data-p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "]").hasClass("summary")) {
                                    if ($("[data-p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "] span.cellValue").length > 0) {
                                        var value = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ($("[data-p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "] span.cellValue").text() != "" ? $("[data-p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "] span.cellValue").text() : $(".curInput").val()) : $("[data-p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "] span.cellValue").text();
                                        $("[data-p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "] span.cellValue").html("<input type='text' class='curInput' value='" + value + "' />");
                                    }
                                    else if ($("[data-p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "]").children().length > 0) {
                                        $("[data-p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "]").append("<input type='text' class='curInput' value='' />");
                                    }
                                    else {
                                        var value = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ($("[data-p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "]").text() != "" ? $("[data-p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "]").text() : $(".curInput").val()) : $("[data-p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "]").text();
                                        $("[data-p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "]").html("<input type='text' class='curInput' value='" + value + "' />");
                                    }
                                }
                                var rowInfo, rowValue = "";
                                var tempThPos, measureColumn, measureRowCount = 0, measureColCount = 0;
                                if (this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders)
                                    rowLThPos = this.element.find(".summary[role!='gridcell'][data-p$='," + $(targetCell).attr('data-p').split(',')[1] + "'] , .rowheader[role!='gridcell'][data-p$='," + $(targetCell).attr('data-p').split(',')[1] + "']").last().attr("data-p");
                                else
                                    rowLThPos = this.element.find(".summary[role!='gridcell'][data-p$='," + rowSelCnt + "'] , .rowheader[role!='gridcell'][data-p$='," + rowSelCnt + "']").last().attr("data-p");
                                if (rowLThPos == undefined) {
                                    rowLThPos = $("#" + this._id).find("tbody").find('[data-p="' + colSelCnt + "," + rowSelCnt + '"]').parent("tr").find(".summary").first().attr('data-p');
                                }
                                tempThPos = rowLThPos;
                                if (rowLThPos != null) {
                                    while (rowLThPos[0] >= 0) {
                                        if (rowLThPos == this.getJSONRecords()[parseInt((parseInt(rowLThPos.split(",")[0]) * this._rowCount) + parseInt(rowLThPos.split(",")[1]))].Index) {
                                            rowInfo = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? this.getJSONRecords()[parseInt((parseInt(rowLThPos.split(",")[0]) * this._rowCount) + parseInt(rowLThPos.split(",")[1]))].Info.split("::")[0] : this.getJSONRecords()[parseInt((parseInt(rowLThPos.split(",")[0]) * this._rowCount) + parseInt(rowLThPos.split(",")[1]))].Value;
                                            rowLThPos = parseInt(rowLThPos.split(",")[0]) - 1 + "," + parseInt(rowLThPos.split(",")[1]);
                                        }
                                        if ((rowValue) && (rowInfo != ""))
                                            rowValue = rowInfo + "#" + rowValue;
                                        else if (rowInfo != "")
                                            rowValue = rowInfo;
                                    }
                                    this._rowHeader[count] = rowValue;
                                    var header = this._rowHeader[count].toString().split('#');
                                    if (header.length > 1) {
                                        for (var i = 0; i < header.length - 1; i++) {
                                            for (var j = 0; j < header[i].split('.').length; j++) {
                                                if (header[i].split('.')[j] == header[i + 1].split('.')[j] && header[i].split('.')[j + 1] == header[i + 1].split('.')[j + 1]) {
                                                    header.splice(i, 1);
                                                    break;
                                                }
                                            }
                                        }
                                        this._rowHeader[count] = "";
                                        for (var i = 0; i < header.length; i++) {
                                            this._rowHeader[count] += this._rowHeader[count] == "" ? header[i] : "#" + header[i];
                                        }
                                    }
                                }
                                var columnValue = "", headerInfo;
                                var isFrozenHeader = this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders;
                                var colHeadRCnt = this.element.find((isFrozenHeader ? ".pivotGridFrozenTable " : "") + 'tr:has(".colheader")').length - 1;
                                measureColumn = colHeadRCnt;
                                curCelPos = cellInfo[count].Index;
                                if ((curCelPos != undefined) && (curCelPos == this.getJSONRecords()[parseInt((parseInt(curCelPos.split(",")[0]) * this._rowCount) + parseInt(curCelPos.split(",")[1]))].Index)) {
                                    var colPos = parseInt(curCelPos.split(",")[0]);
                                }
                                for (var rCnt = 0; rCnt <= colHeadRCnt; rCnt++) {
                                    if (colPos != null)
                                        if ((colPos + "," + rCnt) == (this.getJSONRecords()[parseInt((parseInt(colPos) * this._rowCount) + rCnt)].Index)) {
                                            headerInfo = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? this.getJSONRecords()[parseInt((parseInt(colPos) * this._rowCount) + rCnt)].Info.split("::")[0] : this.getJSONRecords()[parseInt((parseInt(colPos) * this._rowCount) + rCnt)].Value;
                                            if (columnValue == "")
                                                columnValue = headerInfo;
                                            else if (headerInfo != "")
                                                columnValue = columnValue + "#" + headerInfo;
                                        }
                                    this._colHeader[count] = columnValue;

                                }
                                var header = this._colHeader[count].split('#');
                                if (header.length > 1) {
                                    for (var i = 0; i < header.length - 1; i++) {
                                        for (var j = 0; j < header[i].split('.').length; j++) {
                                            if (header[i].split('.')[j] == header[i + 1].split('.')[j] && header[i].split('.')[j + 1] == header[i + 1].split('.')[j + 1]) {
                                                header.splice(i, 1);
                                                break;
                                            }
                                        }
                                    }
                                    this._colHeader[count] = "";
                                    for (var i = 0; i < header.length; i++) {
                                        this._colHeader[count] += this._colHeader[count] == "" ? header[i] : "#" + header[i];
                                    }
                                }
                                count++;
                            }
                        }
                    }
                }
                this._originalValue = "";
                this._cellInfo = cellInfo;
                for (var index = 0; index < this.element.find(".curInput").length; index++) {
                    var cell = this.element.find(".curInput")[index];
                    this._originalValue += this._originalValue == "" ? cell.value : "#" + cell.value;
                }
                args = { JSONRecords: cellInfo, rowHeader: this._rowHeader, columnHeader: this._colHeader, measureCount: (measureRowCount > 0 ? ("Row:" + measureRowCount) : ("Column:" + measureColCount)) }
                if (!ej.isNullOrUndefined(this._pivotClientObj))
                    this._pivotClientObj._trigger("cellSelection", args);
                else
                    this._trigger("cellSelection", args);
                cellInfo = rowHeader = colHeader = [];
                $("#" + this._id + "_cellSelection").remove();
                if (this.model.enableToolTip) {
                    this._on(this.element, "mousemove", ".value", this._applyToolTip);
                }
                this._off(this.element, "mouseup", ".value");
            }
            $(".curInput").keypress(function (event) {
                if (event.which == 13) {
                    var pGridObj = $(event.target).parents(".e-pivotgrid").data("ejPivotGrid");
                    pGridObj._updateTableCell();
                }
            })
        },

        _updateTableCell: function () {
            var updateValue = "", tempVal = "";
            var editValue = $(".curInput");
            $.each(editValue, function (index, cell) {
                updateValue += index == 0 ? cell.value : "#" + cell.value;
            })
            var originalValueCmp = [];
            var rowHeaderName = this._rowHeader;
            var columnHeaderName = this._colHeader;
            tempVal = updateValue.split("#");
            for (var i = tempVal.length - 1; i >= 0; i--) {
                if (tempVal[i] == this._originalValue.split("#")[i]) {
                    rowHeaderName.splice(i, 1);
                    columnHeaderName.splice(i, 1);
                    tempVal.splice(i, 1);
                    this._cellInfo.splice(i, 1);
                }
                else {
                    originalValueCmp.push(this._originalValue.split("#")[i]);
                    this._cellInfo[i].Value = tempVal[i] = tempVal[i] == "" ? "0" : tempVal[i];
                }
            }
            originalValueCmp = originalValueCmp.reverse();
            updateValue = "";
            for (var j = 0; j < tempVal.length; j++) {
                updateValue += updateValue == "" ? tempVal[j] : "#" + tempVal[j];
            }
            if (updateValue.length == 0) {
                for (var j = editValue.length - 1; j >= 0; j--) {
                    $(editValue[j]).closest("td").text($(".curInput")[j].value)
                }
                return false;
            }
            this._waitingPopup.show();

            var report;
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                try {
                    report = JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.getOlapReport();
                }
            }

            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {

                if (ej.isNullOrUndefined(this.model.editCellsInfo.JSONRecords) || this.model.editCellsInfo.JSONRecords.length == 0)
                    this.model.editCellsInfo = { JSONRecords: [], rowHeader: [], columnHeader: [] };

                var rowHeaders = this.model.editCellsInfo.rowHeader, colHeaders = this.model.editCellsInfo.columnHeader, values = this.model.editCellsInfo.JSONRecords, updateValueArray = this._cellInfo;
                for (uV = 0; uV < updateValueArray.length; uV++) {
                    var existCount = 0;
                    for (var vC = 0; vC < values.length; vC++) {
                        if (rowHeaders[vC] == rowHeaderName[uV] && colHeaders[vC] == columnHeaderName[uV]) {
                            values[vC].Value = updateValueArray[uV].Value;
                            existCount++;
                            break;
                        }
                    }
                    if (existCount == 0) {
                        rowHeaders.push(rowHeaderName[uV]);
                        colHeaders.push(columnHeaderName[uV]);
                        values.push(updateValueArray[uV]);
                    }
                }
                if (!ej.isNullOrUndefined(this._pivotClientObj))
                    this._pivotClientObj._trigger("cellEdit", { editCellsInfo: this.model.editCellsInfo });
                else
                    this._trigger("cellEdit", { editCellsInfo: this.model.editCellsInfo });

                if (!ej.isNullOrUndefined(this.model.editCellsInfo.JSONRecords) && this.model.editCellsInfo.JSONRecords.length > 0) {
                    if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                        var updateValue = "", cellPos = "", measure = "";
                        $.each(this.model.editCellsInfo.JSONRecords, function (index, val) {
                            updateValue = updateValue == "" ? val.Value : updateValue + ":" + val.Value;
                            cellPos = cellPos == "" ? val.Index : cellPos + ":" + val.Index;
                            measure = measure == "" ? colHeaders[index].toString().split('#')[colHeaders[index].toString().split('#').length - 1] : measure + ":" + colHeaders[index].toString().split('#')[colHeaders[index].toString().split('#').length - 1];
                        })
                        var eventArgs = JSON.stringify({ action: "cellEditing", "index": cellPos, "valueHeaders": measure, "summaryValues": updateValue, "currentReport": report, "valueSorting": JSON.stringify(this.model.valueSortSettings), "customObject": JSON.stringify(this.model.customObject) });
                        this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.cellEditing, eventArgs, this._renderControlSuccess);
                        for (var j = editValue.length - 1; j >= 0; j--) {
                            $(editValue[j]).closest("td").text($(editValue[j]).val());
                        }
                    }
                    else
                        this._populatePivotGrid();
                }
                else {
                    for (var j = editValue.length - 1; j >= 0; j--) {
                        $(editValue[j]).closest("td").text(ej.isNullOrUndefined(this._originalValue.split('#')[j]) ? "" : this._originalValue.split('#')[j]);
                    }
                    this._waitingPopup.hide();
                }
            }
            else if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                    this._trigger("beforeServiceInvoke", { action: "writeBack", element: this.element });

                this.model.editCellsInfo.JSONRecords = this._cellInfo;
                this.model.editCellsInfo.rowHeader = rowHeaderName;
                this.model.editCellsInfo.columnHeader = columnHeaderName;

                if (!ej.isNullOrUndefined(this._pivotClientObj))
                    this._pivotClientObj._trigger("cellEdit", { editCellsInfo: this.model.editCellsInfo });
                else
                    this._trigger("cellEdit", { editCellsInfo: this.model.editCellsInfo });
                var updateValue = "";
                if (!ej.isNullOrUndefined(this.model.editCellsInfo.JSONRecords) && this.model.editCellsInfo.JSONRecords.length > 0) {
                    $.each(this.model.editCellsInfo.JSONRecords, function (index, val) {
                        updateValue = updateValue == "" ? val.Value : updateValue + ":" + val.Value;
                    })
                }

                eventArgs = JSON.stringify({ action: "writeBack", "value": updateValue, "rowUniqueName": JSON.stringify(this.model.editCellsInfo.rowHeader), "columnUniqueName": JSON.stringify(this.model.editCellsInfo.columnHeader), "currentReport": report, "customObject": JSON.stringify(this.model.customObject) });
                if (!ej.isNullOrUndefined(this.model.editCellsInfo.JSONRecords) && this.model.editCellsInfo.JSONRecords.length > 0)
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.writeBack, eventArgs, this._renderControlSuccess);
                else {
                    for (var j = editValue.length - 1; j >= 0; j--) {
                        $(editValue[j]).closest("td").text(ej.isNullOrUndefined(this._originalValue.split('#')[j]) ? "" : this._originalValue.split('#')[j]);
                    }
                    this._waitingPopup.hide();
                }
            }
            this._rowHeader = [];
            this._colHeader = [];
        },

        _createVirtualPivotGrid: function (tableOlapGrid) {
            var verticalScroll = this._seriesPageCount > 1 ? ej.buildTag("div.e-vScrollPanel")[0].outerHTML : "";
            var horizontalScroll = this._categPageCount > 1 ? ej.buildTag("div.e-hScrollPanel")[0].outerHTML : "";            
            var oGridDiv = ej.buildTag("td.virtualScrollGrid", tableOlapGrid[0].outerHTML)[0];
            var vertiScrollTd = ej.buildTag("td.virtualScrollElement", verticalScroll);
            var horiScrollTd = ej.buildTag("td.virtualScrollElement", horizontalScroll);
            var trow = ej.buildTag("tr.virtualScrollElement", oGridDiv.outerHTML + vertiScrollTd[0].outerHTML);
            var trow2 = ej.buildTag("tr.virtualScrollElement", horiScrollTd[0].outerHTML + ej.buildTag("td.virtualScrollElement")[0].outerHTML);
            var virtualOlapGrid = ej.buildTag("tbody.oGridOuterDiv.virtualScrollElement", trow[0].outerHTML + trow2[0].outerHTML);
            this.element.html(ej.buildTag("table.virtualScrollElement", virtualOlapGrid[0].outerHTML));
            var seriesPageIndicator = ej.buildTag("div.e-seriesPageIndicator inActive", ej.buildTag("span.axislabel", this._getLocalizedLabels("SeriesPage"))[0].outerHTML + ej.buildTag("span.series_CurrentPage", this._seriesCurrentPage)[0].outerHTML + " / " + ej.buildTag("span.series_pageCount", this._seriesPageCount)[0].outerHTML)[0].outerHTML;
            if (this._seriesPageCount > 1) this.element.append(seriesPageIndicator);
            var categPageIndicator = ej.buildTag("div.e-categPageIndicator inActive", ej.buildTag("span.axislabel", this._getLocalizedLabels("CategoricalPage"))[0].outerHTML + ej.buildTag("span.categ_CurrentPage", this._categCurrentPage)[0].outerHTML + " / " + ej.buildTag("span.categ_pageCount", this._categPageCount)[0].outerHTML)[0].outerHTML;
            if (this._categPageCount > 1) this.element.append(categPageIndicator);
        }

    });

    ej.PivotGrid.Layout = {
        Normal: "normal",
        NormalTopSummary: "normaltopsummary",
        NoSummaries: "nosummaries",
        ExcelLikeLayout: "excellikelayout"
    };

    ej.PivotGrid.Locale = ej.PivotGrid.Locale || {};

    ej.PivotGrid.Locale["en-US"] = {
        Sort: "Sort",
        Search: "Search",
        SelectField: "Select field",
        LabelFilterLabel:"Show the items for which the label",
        ValueFilterLabel: "Show the items for which",
        ClearSorting: "Clear Sorting",
        ClearFilterFrom: "Clear Filter From",
        SortAtoZ: "Sort A to Z",
        SortZtoA: "Sort Z to A",
        and: "and",

        LabelFilters: "Label Filters  ",
        BeginsWith: "Begins With",
        DoesNotBeginsWith: "Does Not Begins With",
        EndsWith: "Ends With",
        NotEndsWith: "Not Ends With",
        DoesNotEndsWith: "Does Not End With",
        Contains: "Contains",
        DoesNotContains: "Does Not Contain",

        ValueFilters: "Value Filters",
        ClearFilter: "Clear Filter",
        Equals: "Equals",
        DoesNotEquals:"Does Not Equal",
        NotEquals: "Not Equals",
        GreaterThan: "Greater Than",
        IsGreaterThan: "Is Greater Than",
        IsGreaterThanOrEqualTo: "Is Greater Than Or Equal To",
        IsLessThan: "Is Less Than",
        IsLessThanOrEqualTo: "Is Less Than Or Equal To",

        GreaterThanOrEqualTo: "Greater Than Or Equal To",
        LessThan: "Less Than",
        LessThanOrEqualTo: "Less Than Or Equal To",
        Between: "Between",
        NotBetween: "Not Between",
        Top10: "Top Count",

        AddToFilter: "Add to Filter",
        AddToRow: "Add to Row",
        AddToColumn: "Add to Column",
        AddToValues: "Add to Values",
        Warning: "Warning",
        Error: "Error",
        GroupingBarAlertMsg: "The field you are moving cannot be placed in that area of the report",
        Measures: "Measures",
        Expand: "Expand",
        Collapse:"Collapse",
        ToolTipRow: "Row",
        ToolTipColumn: "Column",
        ToolTipValue: "Value",
        NoValue: "No value",
        SeriesPage: "Series Page",
        CategoricalPage: "Categorical Page",
        DragFieldHere: "Drag field here",
        ColumnArea: "Drop column here",
        RowArea: "Drop row here",
        ValueArea: "Drop values here",
        Close:"Close",
        OK: "OK",
        Cancel: "Cancel",
        Remove: "Remove",
        Goal: "Goal",
        Status: "Status",
        Trend: "Trend",
        Value: "value",
        ConditionalFormattingErrorMsg: "The given value is not matched",
        ConditionalFormattingConformMsg: "Are you sure you want to remove the selected format?",
        EnterOperand1: "Enter Operand1",
        EnterOperand2: "Enter Operand2",
        ConditionalFormatting: "Conditional Formatting",
        Condition: "Conditional Type",
        Value1: "Value1",
        Value2: "Value2",
        Editcondtion: "Edit Condition",
        AddNew: "Add New",
        Format: "Format",
        Fontcolor: "Font Color",
        Backcolor: "Back Color",
        Borderrange: "Border Range",
        Borderstyle: "Border Style",
        Fontsize: "Font Size",
        Fontstyle: "Font Style",
        Bordercolor: "Border Color",
        NoMeasure: "Please add any measure",
        AliceBlue: "AliceBlue",
        Black: "Black",
        Blue: "Blue",
        Brown: "Brown",
        Gold: "Gold",
        Green: "Green",
        Lime: "Lime",
        Maroon: "Maroon",
        Orange: "Orange",
        Pink: "Pink",
        Red: "Red",
        Violet: "Violet",
        White: "White",
        Yellow: "Yellow",
        Solid: "Solid",
        Dashed: "Dashed",
        Dotted: "Dotted",
        Double: "Double",
        Groove: "Groove",
        Inset: "Inset",
        Outset: "Outset",
        Ridge: "Ridge",
        None: "None",
        Algerian: "Algerian",
        Arial: "Arial",
        BodoniMT: "Bodoni MT",
        BritannicBold: "Britannic Bold",
        Cambria: "Cambria",
        Calibri: "Calibri",
        CourierNew: "Courier New",
        DejaVuSans: "DejaVu Sans",
        Forte: "Forte",
        Gerogia: "Gerogia",
        Impact: "Impact",
        SegoeUI: "Segoe UI",
        Tahoma: "Tahoma",
        TimesNewRoman: "Times New Roman",
        Verdana: "Verdana",
        CubeDimensionBrowser: "Cube Dimension Browser",
        SelectHierarchy: "Select Hierarchy",
        CalculatedField: "Calculated Field",
        Name: "Name:",
        Add: "Add",
        Formula: "Formula:",
        Delete: "Delete",
        Fields: "Fields:",
        MultipleItems: "Multiple items",
        All:"All",
        CalculatedFieldNameNotFound: "Given CalculatedField name is not found",
        InsertField: "Insert Field",
        EmptyField: "Please enter Calculated field name or formula",
        NotValid: "Given formula is not valid",
        NotPresent: "Value field used in any of the Calculated Field formula is not present in the PivotGrid",
        Confirm: "Calculated field with the same name already exists. Due to want to Replace ?",
        CalcValue: "Calculated field can be inserted only in value area field",
        NoRecordsToDisplay: "No records to display.",
         NumberFormatting: "Number Formatting",
        FrozenHeaders: "Frozen Headers",
        CellSelection: "Cell Selection",
        CellContext: "Cell Context",
        ColumnResize: "Column Resize",
        Layouts:"Layouts",
        ExcelLikeLayout: "Excel Like Layout",
        NormalLayout: "Normal Layout",
        NormalTopSummary: "NormalTopSummary Layout",
        NoSummaries:"NoSummaries Layout",
        FrozenHeader: "Frozen Header",
        AdvancedFiltering: "Advanced Filtering",
        Amount: "Amount",
        Quantity: "Quantity",
        Measures: "Measures",
        NumberFormats: "Number Formats",
        Exporting: "Exporting",
        FileName: "File Name",
        ToolTip: "Tool Tip",
        RTL: "RTL",
        CollapseByDefault: "Collapse By Default",
        EnableDisablePaging: "Enalbe / Disable Paging",
        PagingOptions: "Paging Options",
        CategoricalPageSize: "Categorical Page Size",
        SeriesPageSize: "Series Page Size",

        HyperLink: "HyperLink",
        CellEditing: "Cell Editing",
        GroupingBar:"Grouping Bar",
        SummaryCustomization: "Summary Customization",
        SummaryTypes: "Summary Types",
        SummaryType: "Summary Type",
        EnableRowHeaderHyperlink: "Enable RowHeaderHyperLink",
        EnableColumnHeaderHyperlink: "Enable ColumnHeaderHyperLink",
        EnableValueCellHyperlink: "Enable ValueCellHyperLink",
        EnableSummaryCellHyperlink: "Enable SummaryCellHyperLink",
        HideGrandTotal: "Hide GrandTotal",
        HideSubTotal: "Hide SubTotal",
        Row: "Row",
        Column: "Column",
        Both:"Both",
        Sum: "Sum",
        Average: "Average",
        Count: "Count",
        Min: "Min",

        Max: "Max",
        Excel: "Excel",
        Word: "Word",
        PDF: "PDF",
        CSV: "CSV",
        Total: "Total",
        GrandTotal: "Grand Total",
        DrillThrough: "Drill Through",
        EnabledState: "Enabled State",
        Months: "Months",
        Days: "Days",
        Quarters: "Quarters",
        Years: "Years",
        Qtr: "Qtr",
        Quarter: "Quarter",
        AddCurrentSelectionToFilter: "Add current selection to filter",
        FormatName: "Format Name",
        RemoveFormat: "Remove Format",
        Edit: "Edit",
        DuplicateFormatName: "Duplicate Format Name",
        EnterFormatName: "Enter Format Name",
        NotAllItemsShowing: "Not all child nodes are shown",
        EditorLinkPanelAlert: "The members has more than 1000 items under one or more parent. Only the first 1000 items are displayed under each parent."
       };

    ej.PivotGrid.ExportOptions = {
        Excel: 'excel',
        Word: 'word',
        PDF: 'pdf',
        CSV: 'csv'
    };

    ej.PivotGrid.ConditionalOptions = {
        Equals: "Equals",
        NotEquals: "Not Equals",
        GreaterThan: "Greater Than",
        GreaterThanOrEqualTo: "Greater Than Or Equal To",
        LessThan: "Less Than",
        LessThanOrEqualTo: "Less Than Or Equal To",
        Between: "Between",
        NotBetween: "Not Between"
    };

    ej.PivotGrid.AnalysisMode = {
        Olap: "olap",
        Relational: "relational"
    };
    ej.PivotGrid.ExportMode = {
        JSON: "json",
        PivotEngine: "pivotengine"
    };
    ej.PivotGrid.OperationalMode = {
        ClientMode: "clientmode",
        ServerMode: "servermode"
    };

    if (ej.olap.base)
        $.extend(ej.PivotGrid.prototype, ej.olap.base);
    if (ej.olap._mdxParser)
        $.extend(ej.PivotGrid.prototype, ej.olap._mdxParser);

})(jQuery, Syncfusion);