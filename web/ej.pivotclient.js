/**
* @fileOverview Plugin to experience Html OLAP Client component elements
* @copyright Copyright Syncfusion Inc. 2001 - 2013. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {

    ej.widget("ejPivotClient", "ej.PivotClient", {

        _rootCSS: "e-pivotclient",
        element: null,
        model: null,
        validTags: ["div", "span"],
        defaults: {
            url: "",
            cssClass: "",
            title: "",
            gridLayout: "normal",
            chartType: "column",
            clientExportMode: "chartandgrid",
            enableDeferUpdate: false,
            enablePivotTreeMap: false,
            enableRTL: false,
            enableDefaultValue: false,
            enableAdvancedFilter: false,
            enablePaging: false,
            enableSplitter: false,
            enableToolBar: false,
            enableCellSelection: false,
            enableLocalStorage: false,
            enableVirtualScrolling: false,
            enableMemberEditorPaging: false,
            showUniqueNameOnPivotButton: false,
            isResponsive: false,
            collapseCubeBrowserByDefault: false,
            enableKPI: false,
            showReportCollection: false,
            enableValueCellHyperlink: false,
            enableRowHeaderHyperlink: false,
            enableColumnHeaderHyperlink: false,
            enableSummaryCellHyperlink: false,
            enableCellContext: false,
            enableDrillThrough: false,
            enableCellEditing: false,
            enableCellDoubleClick: false,
            enableCellClick: false,
            enableXHRCredentials: false,
            enableCompleteDataExport: false,
            enableMemberEditorSorting:false,
            dataSource: {
                data: null,
                sourceInfo: "",
                providerName: "ssas",
                enableAdvancedFilter: false,
                isFormattedValues: false,
                reportName: "Default",
                columns: [],
                cube: "",
                catalog: "",
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
            displaySettings: {
                mode: "chartandgrid",
                defaultView: "grid",
                controlPlacement: "tab",
                enableTogglePanel: false,

                enableFullScreen: false
            },
            serviceMethodSettings: {
                initialize: "InitializeClient",
                removeSplitButton: "RemoveSplitButton",
                filterElement: "FilterElement",
                nodeDropped: "NodeDropped",
                toggleAxis: "ToggleAxis",
                fetchMemberTreeNodes: "FetchMemberTreeNodes",
                cubeChanged: "CubeChanged",
                measureGroupChanged: "MeasureGroupChanged",
                toolbarServices: "ToolbarOperations",
                memberExpand: "MemberExpanded",
                saveReport: "SaveReportToDB",
                fetchReportList: "FetchReportListFromDB",
                loadReport: "LoadReportFromDB",
                updateReport: "UpdateReport",
                exportPivotClient: "Export",
                mdxQuery: "GetMDXQuery",
                drillThroughHierarchies: "DrillThroughHierarchies",
                drillThroughDataTable: "DrillThroughDataTable",
                paging: "Paging",
                removeDBReport: "RemoveReportFromDB",
                renameDBReport: "RenameReportInDB",
                calculatedMember: "CalculatedMember",
                valueSorting: "ValueSorting"
            },
            size: {
                height: "685px",
                width: "1000px"
            },
            toolbarIconSettings: {
                enableAddReport: true,
                enableNewReport: true,
                enableRenameReport: true,
                enableDBManipulation: true,
                enableWordExport: true,
                enableExcelExport: true,
                enablePdfExport: true,
                enableMDXQuery: true,
                enableDeferUpdate: false,
                enableFullScreen: false,
                enableSortOrFilterColumn: true,
                enableSortOrFilterRow: true,
                enableToggleAxis: true,
                enableChartTypes: true,
                enableRemoveReport: true,
                enableCalculatedMember: false
            },
            valueSortSettings: {
                headerText: "",
                headerDelimiters: "##",
                sortOrder: "none"
            },
            customObject: {},
            calculatedMembers: [],
            enableMeasureGroups: false,
            locale: "en-US",
            analysisMode: "olap",
            operationalMode: "clientmode",
            renderSuccess: null,
            renderFailure: null,
            renderComplete: null,
            load: null,
            chartLoad: null,
            treeMapLoad: null,
            drillThrough: null,
            beforeExport: null,
            beforeServiceInvoke: null,
            afterServiceInvoke: null,
            saveReport: null,
            loadReport: null,
            fetchReport: null,
            cellSelection: null,
            gridDrillSuccess: null,
            chartDrillSuccess: null,
            treeMapDrillSuccess: null,
            axesLabelRendering: null,
            pointRegionClick: null,
            valueCellHyperlinkClick: null,
            rowHeaderHyperlinkClick: null,
            columnHeaderHyperlinkClick: null,
            summaryCellHyperlinkClick: null,
            cellContext: null,
            cellEdit: null,
            cellDoubleClick: null,
            cellClick: null,
            drillThrough: null,
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
                removeSplitButton: "enum",
                filterElement: "enum",
                nodeDropped: "enum",
                toggleAxis: "enum",
                fetchMemberTreeNodes: "enum",
                cubeChanged: "enum",
                measureGroupChanged: "enum",
                toolbarServices: "enum",
                memberExpand: "enum",
                saveReport: "enum",
                fetchReportList: "enum",
                loadReport: "enum",
                updateReport: "enum",
                exportPivotClient: "enum",
                mdxQuery: "enum",
                drillThroughHierarchies: "enum",
                drillThroughDataTable: "enum",
                paging: "enum",
                removeDBReport: "enum",
                renameDBReport: "enum",
                calculatedMember: "enum",
                valueSorting: "enum"
            },
            displaySettings: "data",
            customObject: "data"
        },

        observables: ["title", "gridLayout", "displaySettings.mode", "displaySettings.defaultView", "displaySettings.controlPlacement", "displaySettings.enableTogglePanel", "locale"],
        title: ej.util.valueFunction("title"),
        gridLayout: ej.util.valueFunction("gridLayout"),
        displayMode: ej.util.valueFunction("displaySettings.mode"),
        defaultView: ej.util.valueFunction("displaySettings.defaultView"),
        controlPlacement: ej.util.valueFunction("displaySettings.controlPlacement"),
        enableTogglePanel: ej.util.valueFunction("displaySettings.enableTogglePanel"),
        locale: ej.util.valueFunction("locale"),

        _init: function () {
            this._initPrivateProperties();
            this._load();
        },

        _initPrivateProperties: function () {
            this._isCollapseCB = false;
            this._id = this.element.attr("id");
            this.oclientProxy = this;
            this.currentReport = "";
            this.currentCubeName = "";
            //reports = "";
            this.reportsCount = 0;
            this._pivotGrid = null;
            this._pivotChart = null;
            this._pivotSchemaDesigner = null;
            //otreemapObj = null;
            //chartObj = null;
            this._deferReport = "";
            this._keypress = false;
            this._memberTreeObj = null;
            this._chartHeight = 0;
            this._chartWidth = 0;
            this._gridHeight = 0;
            this._gridWidth = 0;
            this._maxInitialChartHeight = 0;
            this._maxInitialChartWidth = 0;
            this._maxInitialGridWidth = 0;
            this._initStyles = new Array();
            this._toggleStyles = new Array();
            this._initToggle = true;
            this._toggleExpand = false;
            this._treemapRender = false;
            this._dimensionName = "";
            this._dllSortMeasure = null;
            this._selectedFieldName = "";
            this._axis = "";
            this._isSorted = false;
            this._isFiltered = false;
            this._sortOrFilterTab = '';
            this._currentAxis = "";
            this._parentElwidth = 0;
            this.pNode = "";
            this.progressPos = null;
            this._selectedReport = "";
            this._isMembersFiltered = false;
            this._pagerObj = null;
            this._dialogTitle = "";
            this._dataModel = " ";
            this._clientReportCollection = [];
            this._prevDrillElements = [];
            this._drillParams = [];
            this._drillInfo = [];
            this.draggedSplitBtn = null;
            this.isDragging = false;
            this.isDropped = false;
            this.measureGroupInfo = "";
            this._currentTab = this.defaultView();
            this._currentItem = null;
            this._currentReportItems = [];
            this._savedReportItems = [];
            this._treeViewData = {};
            this._slicerBtnTextInfo = {};
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
            this._isNodeOrButtonDropped = false;
            this._ischartTypesChanged = false;
            this._isrenderTreeMap = false;
            this._isRemoved = false;
            this._waitingPopup = null;
            this._isGridDrillAction = false;
            this._isChartDrillAction = false;
            this._olapReport = "";
            this._jsonRecords = null;
            this._excelFilterInfo = [];
            this._index = { tab: 0, icon: 1, chartimg: 0, button: 1, dialog: 0, editor: 0, tree: 0 };
            this._curFocus = { tab: null, icon: null, chartimg: null, button: null, dialog: null, editor: null, tree: null };
            this._seriesCurrentPage = 1;
            this._categCurrentPage = 1;
            this._isReportListAction = true;
            this._currentRecordName = "";
            this._pagingSavedObjects = {
                drillEngine: [],
                savedHdrEngine: [],
                curDrilledItem: {}
            };
            this._fieldMembers = {};
            this._fieldSelectedMembers = {};
            this._allMember = "";
            this._editorTreeData = [];
            this._editorSearchTreeData = [];
            this._editorDrillTreeData = {};
            this._editorDrillTreePageSettings = {};
            this._lastSavedTree = [];
            this._isSearchApplied = false;
            this._isTimeOut = false;
            this._isOptionSearch = false;
            this._isEditorDrillPaging = false;
            this._isEditorCollapseDrillPaging = false;
            this._isSelectSearchFilter = true;
            this._calcMemberTreeObj = null;
            this._cubeTreeView = null;
            this._calcMemberDialog = null;
            this._calcMembers = [];
            this._selectedCalcMember = null;
            this._args_className = null;
            this._args_innerHTML = null;
            this._hierarchyCaption = null;
            this._currentCollection = "";
            this._currentFilterList = {};
            this._repCol = [];
            this._reportIndex = 0;
            this._isExporting = false;
            this._fullExportedData = {};
            this._parentNodeCollection = {};
            this._parentSearchNodeCollection = {};
        },

        getOlapReport: function () {
            return JSON.parse(this._olapReport);
        },

        setOlapReport: function (olapReport) {
            this._olapReport = JSON.stringify(olapReport);
        },

        getJSONRecords: function () {
            return JSON.parse(this._jsonRecords);
        },

        setJSONRecords: function (records) {
            this._jsonRecords = JSON.stringify(records);
        },

        getActiveTab: function () {
            return this._currentTab;
        },

        _destroy: function () {
            this.element.empty().removeClass("e-pivotclient" + this.model.cssClass).removeAttr("tabindex");
            if (this._waitingPopup != undefined) this._waitingPopup.destroy();
            if (this.element.attr("class") == "") this.element.removeAttr("class");
            delete this.oclientProxy;
        },

        _load: function () {
            var eventArgs = { element: this.element, customObject: this.model.customObject };
            if (this.model.enableAdvancedFilter || this.model.dataSource.enableAdvancedFilter)
                this.model.dataSource.enableAdvancedFilter = this.model.enableAdvancedFilter = true;
            this.model.toolbarIconSettings.enableFullScreen = this.model.displaySettings.enableFullScreen = (this.model.toolbarIconSettings.enableFullScreen || this.model.displaySettings.enableFullScreen) ? true : false;
            this.model.toolbarIconSettings.enableDeferUpdate = this.model.enableDeferUpdate = (this.model.enableDeferUpdate) ? true : false;
            this._trigger("load", eventArgs);
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.dataSource.cube != "") {
                var measures = this.model.dataSource.values.length > 0 ? this.model.dataSource.values[0].measures : [];
                var rows = this.model.dataSource.rows; var columns = this.model.dataSource.columns;
                var isExist = false; var calcMems = [];
                this.model.dataSource.rows = this._reArrangeCalcFields(rows).reportItem;
                calcMems = this._reArrangeCalcFields(rows).calcMems;
                this.model.dataSource.columns = this._reArrangeCalcFields(columns).reportItem;
                calcMems = $.merge(calcMems, this._reArrangeCalcFields(columns).calcMems);
                measures = $.grep(measures, function (value, index) {
                    if (value.expression != undefined) {
                        calcMems.push({
                            caption: value.fieldName, "expression": value.expression, hierarchyUniqueName: value.hierarchyUniqueName,
                            formatString: (value.formatString ? value.formatString : null),
                            format: (value.format ? value.format : null),
                            memberType: ej.PivotClient.MemberType.Measure
                        });
                        value.caption = ej.isNullOrUndefined(value.fieldCaption) ? value.fieldName : value.fieldCaption;
                        value.fieldName = (value.fieldName.toLowerCase().indexOf("measure") > -1) ? value.fieldName : "[Measures].[" + $.trim(value.fieldName) + "]";
                    }
                    return value;
                });
                if (this.model.calculatedMembers.length > 0) {
                    $.grep(this.model.calculatedMembers, function (value, index) {
                        var value = value; calcMems = $.grep(calcMems, function (Calcvalue, index) {
                            if (value.caption != Calcvalue.caption) {
                                if (!(Calcvalue.caption.toLowerCase().indexOf("measure") > -1 && "[Measures].[" + value.caption + "]" != Calcvalue.caption))
                                    return value;
                            }
                        });
                    });
                    this.model.calculatedMembers = $.merge(calcMems, this.model.calculatedMembers);
                }
                else {
                    this.model.calculatedMembers = [];
                    this.model.calculatedMembers = $.merge(calcMems, this.model.calculatedMembers);
                }
            }
            this.element.addClass(this.model.cssClass);
            this.element.ejWaitingPopup({ showOnInit: true });
            this._waitingPopup = this.element.data("ejWaitingPopup");
            if ((this.model.dataSource.data == null && this.model.url != "") || (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)) {
                this.model.operationalMode = ej.Pivot.OperationalMode.ServerMode;
                if (!ej.isNullOrUndefined(this.model.beforeServiceInvoke))
                    this._trigger("beforeServiceInvoke", { action: "initializeClient", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.initialize, JSON.stringify({
                    "action": (this.model.enableDrillThrough && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) ? "initializeClient:getDataSet" : "initializeClient", "customObject": serializedCustomObject, "clientParams": this.model.enableMeasureGroups + "-" + this.model.chartType + "-" + this.model.enableKPI + "-##-" + JSON.stringify(this.model.valueSortSettings)
                }), this._renderControlSuccess);
            }
            else {
                this.model.operationalMode = ej.Pivot.OperationalMode.ClientMode;
                this.model.analysisMode = this.model.dataSource.cube != "" ? ej.Pivot.AnalysisMode.Olap : ej.Pivot.AnalysisMode.Pivot;
                var clientObj = this;
                setTimeout(function () {
                    clientObj._renderLayout();
                    clientObj._createControl();
                    if (clientObj.model.enableSplitter)
                        clientObj._createSplitter();
                }, 0);
                //this._waitingPopup.hide();
            }
        },

        _reArrangeCalcFields: function (items) {
            var calcMembers = [], calcMems = [];
            var items = $.grep(items, function (item, index) {
                if (item.expression != undefined) {
                    calcMems.push({
                        caption: item.fieldName, "expression": item.expression,
                        hierarchyUniqueName: item.hierarchyUniqueName,
                        format: (item.format ? item.format : null),
                        formatString: (item.formatString ? item.formatString : null),
                        memberType: ej.PivotClient.MemberType.Dimension
                    });
                    calcMembers.push(item)
                }
                else
                    return item;
            });
            return { reportItem: $.merge(calcMembers, items), calcMems: calcMems };
        },

        _renderClientControls: function (msg) {
            this._renderLayout();
            this.setOlapReport(msg.PivotReport);
            var report = $.parseJSON(msg.PivotReport);
            this.currentReport = this.getOlapReport() != "" ? JSON.parse(this.getOlapReport()).Report : "";
            this.setJSONRecords({ GridJSON: msg.GridJSON, ChartJSON: msg.ChartJSON });
            this._createControl();
            if (this.model.enableSplitter)
                this._createSplitter();
            if (this.model.enableAdvancedFilter) {
                if (this._pivotGrid)
                    this._pivotGrid._removeCells(msg);
            }
        },

        _createControl: function () {
            var cubes = "";
            this.element.find("#" + this._id + "_PivotSchemaDesigner").ejPivotSchemaDesigner({ pivotControl: this, _waitingPopup: this._waitingPopup, enableRTL: this.model.enableRTL, enableMemberEditorSorting:this.model.enableMemberEditorSorting, layout: ej.PivotSchemaDesigner.Layouts.OneByOne, olap: { showKPI: false, showNamedSets: false }, serviceMethods: { nodeDropped: this.model.serviceMethodSettings.nodeDropped, memberExpand: this.model.serviceMethodSettings.memberExpand }, locale: this.model.locale, width: this.model.enableSplitter ? "100%" : this.element.width() / 3, height: this.element.find(".e-controlPanel").height() });
            if (this.model.enablePaging) {
                this.element.find("#" + this._id + "_Pager").ejPivotPager({ locale: this.model.locale, mode: ej.PivotPager.Mode.Both, targetControlID: this._id });
                this.element.find(".e-controlPanel").height(this.element.find(".e-controlPanel").height() - (this.element.find("#" + this._id + "_Pager").height() + 5));
                this.element.find(".e-gridContainer").height(this.element.find(".e-gridContainer").height() - (this.element.find("#" + this._id + "_Pager").height() + 5));
                this.element.find(".e-chartContainer").height(this.element.find(".e-chartContainer").height() - (this.element.find("#" + this._id + "_Pager").height() + 10));
            }
            var searchEditor = ej.buildTag("div.searchDiv", ej.buildTag("input#" + this._id + "_SearchTreeView.searchTreeView").attr("type", "text")[0].outerHTML, { "margin": "5px 5px 0px 5px" })[0].outerHTML;
            this.element.find(".parentSchemaFieldTree").prepend(searchEditor);
            this.element.find("#" + this._id + "_SearchTreeView").ejMaskEdit({
                name: "inputbox",
                width: "100%",
                height: "25px",
                inputMode: ej.InputMode.Text,
                watermarkText: this._getLocalizedLabels("Search"),
                maskFormat: "",
                textAlign: this.model.enableRTL ? "right" : "left",
                change: ej.proxy(ej.Pivot._searchTreeNodes, this),
            });
            if (this.model.enableMeasureGroups)
                this._createMeasureGroup();
            var reportList = this._clientReportCollection.length > 0 ? $.map(this._clientReportCollection, function (item, index) {
                if (item.reportName != undefined)
                { return { name: item.reportName } }
                else if (item.name != undefined)
                { return { name: item.name } }
            }) : [{ name: this.model.dataSource.reportName }];
            this.element.find(".reportlist").ejDropDownList({
                dataSource: reportList,
                enableRTL: this.model.enableRTL,
                fields: { text: "name", value: "name" },
                height: "26px",
                create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
            });
            this.element.find(".reportlist").attr("tabindex", 0);
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode)
                this._clientReportCollection = [this.model.dataSource];
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode != ej.Pivot.OperationalMode.ClientMode) {
                var tempddlwidth = this.element.find(".e-csHeader").width() - this.element.find(".cubeText").width() - this.element.find(".e-toggleExpandButton").width() - (this.model.enableSplitter ? 50 : 20);
                var cubeddlWidth = this.enableTogglePanel() ? tempddlwidth - 25 : tempddlwidth;
                var cubeCollection = (cubes == "" ? "" : $.parseJSON(cubes));
                this.element.find(".cubeSelector").ejDropDownList({
                    dataSource: cubeCollection,
                    enableRTL: this.model.enableRTL,
                    fields: { text: "name", value: "name" },
                    width: this.model.enableSplitter && !this.model.isResponsive ? "100%" : "" + cubeddlWidth + "px",
                    create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
                });
                this.ddlTarget = this.element.find('.cubeSelector').data("ejDropDownList");
                this.ddlTarget.selectItemByText(this.currentCubeName);
            }
            this.reportDropTarget = this.element.find('#reportList').data("ejDropDownList");
            this._isReportListAction = false;
            if (this.reportDropTarget.model.dataSource.length)
                this.reportDropTarget.selectItemByText(this.reportDropTarget.model.dataSource[0].name);
            this._isReportListAction = true;
            this._selectedReport = this.reportDropTarget._currentText;
            this.element.find(".cubeSelector").ejDropDownList("option", "change", ej.proxy(this._cubeChanged, this));
            this.element.find(".cubeSelector").attr("tabindex", 0);
            this.element.find(".reportlist").ejDropDownList("option", "change", ej.proxy(this._reportChanged, this));
            if (this.model.enableMeasureGroups)
                this.element.find(".measureGroupSelector").ejDropDownList("option", "change", ej.proxy(this._measureGroupChanged, this));
            this.element.find("#clientTab").ejTab({ enableRTL: this.model.enableRTL, itemActive: ej.proxy(this._onTabClick, this) });
            if (!this.model.enableSplitter)
                this.element.find(".e-controlPanel").width(this.element.width() - this.element.find("#" + this._id + "_PivotSchemaDesigner").width() - (this.model.displaySettings.enableTogglePanel ? 30 : 10));

            var charContrHeight = 0;
            if (this.controlPlacement() == "tile" && this.displayMode() == "chartandgrid")
                charContrHeight = this.element.find("#" + this._id + "_PivotChart").parent().height();
            if (this.displayMode() != "chartonly") {
				var contrHeight=this.element.find("#" + this._id + "_PivotGrid").parent().height(); 
                this.element.find("#" + this._id + "_PivotGrid").ejPivotGrid({ locale: this.model.locale, customObject: this.model.customObject, enableRTL: this.model.enableRTL, enableDefaultValue: this.model.enableDefaultValue, enableCellSelection: this.model.enableCellSelection, cellSelection: this.model.cellSelection, hyperlinkSettings: { enableValueCellHyperlink: this.model.enableValueCellHyperlink, enableRowHeaderHyperlink: this.model.enableRowHeaderHyperlink, enableColumnHeaderHyperlink: this.model.enableColumnHeaderHyperlink, enableSummaryCellHyperlink: this.model.enableSummaryCellHyperlink }, enableCellContext: this.model.enableCellContext, enableDrillThrough: this.model.enableDrillThrough, enableCellEditing: this.model.enableCellEditing, enableCellDoubleClick: this.model.enableCellDoubleClick, enableCellClick: this.model.enableCellClick, valueCellHyperlinkClick: this.model.valueCellHyperlinkClick, rowHeaderHyperlinkClick: this.model.rowHeaderHyperlinkClick, columnHeaderHyperlinkClick: this.model.columnHeaderHyperlinkClick, summaryCellHyperlinkClick: this.model.summaryCellHyperlinkClick, cellContext: this.model.cellContext, cellEdit: this.model.cellEdit, cellDoubleClick: this.model.cellDoubleClick, enableCellClick: this.model.enableCellClick, drillThrough: this.model.drillThrough, isResponsive: this.model.isResponsive, drillSuccess: ej.proxy(this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? this._gridDrillSuccess : this._clientGridDrillSuccess, this), enableCollapseByDefault: true });
                this._pivotGrid = this.element.find("#" + this._id + "_PivotGrid").data("ejPivotGrid");
                this._pivotGrid.model.operationalMode = this.model.operationalMode;
                this._pivotGrid.model.analysisMode = this.model.analysisMode;
                this._pivotGrid._waitingPopup = this._waitingPopup;
                this._pivotGrid.model.url = this.model.url;
                this._pivotGrid.model.dataSource = this.model.dataSource;
                this._pivotGrid.model.valueSortSettings = this.model.valueSortSettings;
                if(this.model.enableVirtualScrolling  && this.displayMode() == "chartandgrid")
                    this.element.find("#" + this._id + "_PivotGrid").parent().height(contrHeight);
            }
            if (this.displayMode() != "gridonly") {
                this.element.find("#" + this._id + "_PivotChart").ejPivotChart({ locale: this.model.locale, customObject: this.model.customObject, enableRTL: this.model.enableRTL, enableDefaultValue: this.model.enableDefaultValue, axesLabelRendering: this.model.axesLabelRendering, pointRegionClick: this.model.pointRegionClick, canResize: this.model.isResponsive, drillSuccess: ej.proxy(this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? this._chartDrillSuccess : this._clientChartDrillSuccess, this), size: { height: this._chartHeight, width: this._chartWidth }, commonSeriesOptions: { type: this.model.chartType, tooltip: { visible: true } } });
                this._pivotChart = this.element.find("#" + this._id + "_PivotChart").data("ejPivotChart");
                this._pivotChart.model.operationalMode = this.model.operationalMode;
                this._pivotChart.model.analysisMode = this.model.analysisMode;
                this._pivotChart._waitingPopup = this._waitingPopup;
                this._pivotChart.model.url = this.model.url;
                this._pivotChart.model.dataSource = this.model.dataSource;
                if (this.model.enableVirtualScrolling && charContrHeight > 0)
                    this.element.find("#" + this._id + "_PivotChart").parent().height(charContrHeight);
            }
            this._pivotSchemaDesigner = this.element.find("#" + this._id + "_PivotSchemaDesigner").data("ejPivotSchemaDesigner");
            var items = {};
            if (this._pivotChart != null) {
                this.element.find('#' + this._id + '_PivotChart').width(this._pivotChart.model.size.width);
                items["chartModelWidth"] = this._pivotChart.model.size.width;
            }
            items["controlPanelWidth"] = this.element.find(".e-controlPanel").width();
            items["chartOuterWidth"] = this._chartWidth;
            items["gridOuterWidth"] = this._gridWidth;
            this._initStyles.push(items);

            if (this.model.isResponsive) {
                this._enableResponsive();
                this._parentElwidth = $("#" + this._id).parent().width();
                if (this._parentElwidth < 850)
                    this._rwdToggleCollapse();
                else if (this._parentElwidth > 850)
                    this._rwdToggleExpand();
                this._pivotSchemaDesigner.element.width(((this._pivotSchemaDesigner.element.width() - 30) / this._pivotSchemaDesigner.element.width() * 100) + "%");
                if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == "chartandgrid" && this._currentTab == "chart")
                    this.element.find(".e-chartContainer").css({ "width": "99.6%" });
            }
            if (this.enableTogglePanel() && this.element.find(".pivotFieldList").length > 0) {
                this.element.find(".e-togglePanel").height(this.element.find("#" + this._id + "_PivotSchemaDesigner").height()).width(14);
                this.element.find(".e-toggleExpandButton,.e-toggleCollapseButton").css("margin-top", (this.element.find("#" + this._id + "_PivotSchemaDesigner").parents("td:eq(0)").height() - 9) / 2);
                this.element.find(".e-togglePanel").children().addClass("e-toggleButtons");
            }
            this._trigger("renderSuccess", this);
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                ej.olap.base.getJSONData({ action: "initialLoad" }, this.model.dataSource, this);
                this.element.find(".e-fieldTable").css("border", "none");
                this.element.find(".parentSchemaFieldTree").addClass("e-olapFieldList");
            }
            else {
                if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                    if (this.displayMode() != ej.PivotClient.DisplayMode.ChartOnly) {
                        this._pivotGrid.setJSONRecords(this.getJSONRecords().GridJSON);
                        this._pivotGrid.setOlapReport(this.getOlapReport());
                        if (this.model.gridLayout == "excellikelayout")
                            this._pivotGrid.excelLikeLayout(this._pivotGrid.getJSONRecords());
                        else
                            this._pivotGrid.renderControlFromJSON();
                    }
                    if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                        //this._pivotChart.setPivotEngine(this.getJSONRecords().ChartJSON);
                        if (this._pivotChart.model.enableMultiLevelLabels)
                            this._pivotChart._generateData({ JsonRecords: this.getJSONRecords(), PivotReport: this.getOlapReport() });
                        else
                            this._pivotChart.renderControlSuccess({ JsonRecords: this.getJSONRecords().ChartJSON, OlapReport: this.getOlapReport() });
                    }
                    this.currentReport = this.getOlapReport() != "" ? JSON.parse(this.getOlapReport()).Report : "";
                }
                else {
                    var data = ej.PivotAnalysis.pivotEnginePopulate(this.model);
                    if (this.displayMode() != ej.PivotClient.DisplayMode.ChartOnly) {
                        this._pivotGrid.setJSONRecords(JSON.stringify(data.json));
                        if (this.model.gridLayout == "excellikelayout")
                            this._pivotGrid.excelLikeLayout(data.json);
                        else
                            this._pivotGrid.renderControlFromJSON();
                    }
                    if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                        this._pivotChart.setPivotEngine(data.pivotEngine);
                        this._pivotChart._generateData(data.pivotEngine);
                    }
                }
            }
            this._unWireEvents();
            this._wireEvents();
            if (!this.model.enableSplitter && this.model.collapseCubeBrowserByDefault) {
                this._collapseCubeBrowser();
                this._isCollapseCB = true;
            }
        },

        _createMeasureGroup: function () {
            this.element.find(".measureGroupselector").remove();
            var measureGroupDropdown = "<div class ='measureGroupselector' style='margin:5px 5px 0px 5px'><input type='text' id='measureGroupSelector' class='measureGroupSelector' /></div>";
            $(this.element).find(".e-cubeBrowser").prepend(measureGroupDropdown);
            this.element.find(".measureGroupSelector").ejDropDownList({
                dataSource: this.measureGroupInfo,
                enableRTL: this.model.enableRTL,
                fields: { text: "name", value: "name" },
                height: "25px",
                width: "100%",
                create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
            });
            this.element.find(".measureGroupSelector").attr("tabindex", 0);
            var measureDropTarget = this.element.find('.measureGroupSelector').data("ejDropDownList");
            measureDropTarget.selectItemByText(measureDropTarget.model.dataSource[0].name);
            this.element.find(".measureGroupSelector").ejDropDownList("option", "change", ej.proxy(this._measureGroupChanged, this));
        },

        refreshControl: function (report) {
            if (!ej.isNullOrUndefined(this._pivotSchemaDesigner))
                this._pivotSchemaDesigner._refreshPivotButtons();
            if (this.element.find(".e-chartTypesDialog").length > 0)
                this.element.find(".e-chartTypesDialog").remove();
            if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly)
                this._pivotChart._labelCurrentTags = {};
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                var reportVal = null, gridJN = null, chartJN = null;
                if (report[0] != undefined) {
                    reportVal = report[0].Value;
                    gridJN = report[1].Value;
                    chartJN = report[2].Value;
                }
                else if (!ej.isNullOrUndefined(report.d)) {
                    reportVal = report.d[0].Value;
                    gridJN = report.d[1].Value;
                    chartJN = report.d[2].Value;
                }
                else {
                    reportVal = report.PivotReport;
                    gridJN = report.GridJSON;
                    chartJN = report.ChartJSON;
                }
                var pivotClient = this;
                this._clientReportCollection = $.map(this._clientReportCollection, function (reportCol, index) {
                    reportCol.report = reportCol.name == pivotClient._currentReportName ? JSON.parse(reportVal).Report : reportCol.report;
                    return reportCol;
                })
                this.setJSONRecords({ "GridJSON": gridJN, "ChartJSON": chartJN });
                this.setOlapReport(reportVal);
                if (!ej.isNullOrUndefined(this._pivotGrid)) {
                    this._pivotGrid.setJSONRecords(gridJN);
                    this._pivotGrid.renderControlFromJSON();
                    this._pivotGrid._removeCells(report);
                }
                if (!ej.isNullOrUndefined(this._pivotChart)) {
                    if (this._pivotChart._drillAction)
                        this._pivotChart._drillAction = "";
                    if (this._pivotChart.model.enableMultiLevelLabels && this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                        this._pivotChart._drillParams = this._drillParams = [];
                        this._pivotChart._generateData({ JsonRecords: report, PivotReport: reportVal });
                    }
                    else
                        this._pivotChart.renderControlSuccess({ OlapReport: reportVal, JsonRecords: chartJN });
                }
            }
            else {
                if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                    var data = ej.PivotAnalysis.pivotEnginePopulate(this.model);
                    this.generateJSON({ tranposeEngine: data.pivotEngine, jsonObj: data.json })
                }
                else
                    ej.olap.base.getJSONData({ action: "initialLoad" }, this.model.dataSource, this);
            }
            if (this.model.isResponsive) {
                this.chartObj = this.element.find("#" + this._pivotChart._id + "Container").data("ejChart");
                if (!ej.isNullOrUndefined(this.chartObj))
                    this.element.find("#" + this.chartObj._id).ejChart("option", { "model": { size: { height: this._chartHeight } } });
            }
            if (this.model.enableSplitter && !ej.isNullOrUndefined(this.element.find(".e-childsplit").data("ejSplitter")))
                this.element.find(".e-childsplit").data("ejSplitter").refresh();
            this._unWireEvents();
            this._wireEvents();
            this._isTimeOut = false;
        },

        _setFirst: false,

        _setModel: function (options) {
            for (var key in options) {
                switch (key) {
                    case "title": {
                        this.title(ej.util.getVal(options[key]));
                        this.element.find(".e-titleText").text(this.title()); break;
                    }
                    case "currentCubeName": this.currentCubeName = options[key]; break;
                    case "gridLayout": {
                        this.gridLayout(ej.util.getVal(options[key]));
                        this._renderPivotGrid(); break;
                    }
                    case "olapReport": this.currentReport = options[key]; break;
                    case "clientReports": this.reports = options[key]; break;
                    case "customObject": this.model.customObject = options[key]; break;
                    case "locale": { this.locale(ej.util.getVal(options[key])); if (this._pivotGrid || this._pivotChart) this._load(); break; }
                    case "displaySettings": {
                        this._setDisplaySettings(options[key]);
                        if (this._pivotGrid || this._pivotChart)
                            this._load(); break;
                    }
                    case "operationalMode": this.model.operationalMode = options[key]; break;
                    case "analysisMode": this.model.analysisMode = options[key]; break;
                    case "enableRTL": {
                        this.model.enableRTL = options[key];
                        this._load(); break;
                    }
                    case "enableAdvancedFilter": {
                        this.model.enableAdvancedFilter = options[key];
                        break;
                    }
                    case "enableDefaultValue": { this.model.enableDefaultValue = options[key]; break; }
                    case "enablePaging":
                        {
                            this.model.enablePaging = options[key];
                            this._load(); break;
                        }
                    case "enableSplitter":
                        {
                            this.model.enableSplitter = options[key];
                            this._load(); break;
                        }
                    case "enableToolBar": {
                        this.model.enableToolBar = options[key];
                        this._load(); break;
                    }

                    case "enableLocalStorage": { this.model.enableLocalStorage = options[key]; break; }
                    case "enableVirtualScrolling": {
                        this.model.enableVirtualScrolling = options[key];
                        this._load(); break;
                    }
                    case "enableMemberEditorPaging": {
                        this.model.enableMemberEditorPaging = options[key];
                        break;
                    }
                    case "enableDrillThrough": {
                        this.model.enableDrillThrough = options[key];
                        this._load(); break;
                    }
                    case "showUniqueNameOnPivotButton": {
                        this.model.showUniqueNameOnPivotButton = options[key];
                        this._load(); break;
                    }
                    case "isResponsive": {
                        this.model.isResponsive = options[key];
                        this._load(); break;
                    }
                    case "collapseCubeBrowserByDefault": {
                        this.model.collapseCubeBrowserByDefault = options[key];
                        this._load(); break;
                    }
                    case "dataSource":
                        {
                            this.model.dataSource = ($.extend({}, this.model.dataSource, options[key]));
                            this._load(); break;
                        }
                    case "enableMeasureGroups": {
                        this.model.enableMeasureGroups = options[key];
                        this._load(); break;
                    }
                    case "size":
                        {
                            this.model.size = ($.extend({}, this.model.size, options[key]));
                            this._load(); break;
                        }
                    case "toolbarIconSettings":
                        {
                            this.model.toolbarIconSettings = ($.extend({}, this.model.toolbarIconSettings, options[key]));
                            this._load(); break;
                        }
                }
            }
        },

        _setDisplaySettings: function (displaySetting) {
            if ((!ej.isNullOrUndefined(ej.util.getVal(displaySetting).displayMode)) && $.isFunction((ej.util.getVal(displaySetting).displayMode)))
                this.displayMode((displaySetting).displayMode());
            else if (!ej.isNullOrUndefined(displaySetting.displayMode))
                this.displayMode(displaySetting.displayMode);

            if ((!ej.isNullOrUndefined(ej.util.getVal(displaySetting).defaultView)) && $.isFunction((ej.util.getVal(displaySetting).defaultView)))
                this.defaultView((displaySetting).defaultView());
            else if (!ej.isNullOrUndefined(displaySetting.defaultView))
                this.defaultView(displaySetting.defaultView);

            if ((!ej.isNullOrUndefined(ej.util.getVal(displaySetting).controlPlacement)) && $.isFunction((ej.util.getVal(displaySetting).controlPlacement)))
                this.controlPlacement((displaySetting).controlPlacement());
            else if (!ej.isNullOrUndefined(displaySetting.controlPlacement))
                this.controlPlacement(displaySetting.controlPlacement);

            if ((!ej.isNullOrUndefined(ej.util.getVal(displaySetting).enableTogglePanel)) && $.isFunction((ej.util.getVal(displaySetting).enableTogglePanel)))
                this.enableTogglePanel((displaySetting).enableTogglePanel());
            else if (!ej.isNullOrUndefined(displaySetting.enableTogglePanel))
                this.enableTogglePanel(displaySetting.enableTogglePanel);
        },
        _getMeasuresList: function () {
            var measureName = "";
            this.element.find(".e-memberEditorDiv").find("div").each(function () { measureName += $(this)[0].id + ","; });
            return measureName;
        },

        _getUnSelectedNodes: function () {
            var unselectedNodes = "";
            if ((this._currentItem.indexOf("Measures") < 0)) {
                for (var i = 0; i < this._memberTreeObj.dataSource().length; i++) {
                    if (this._memberTreeObj.dataSource()[i].checkedStatus == false)
                        unselectedNodes += "::" + this._memberTreeObj.dataSource()[i].id + "||" + this._memberTreeObj.dataSource()[i].tag + ((this._currentItem.indexOf(this._getLocalizedLabels("KPIs")) == 0) ? (((!ej.isNullOrUndefined(this._memberTreeObj.dataSource()[i].pid) || !ej.isNullOrUndefined(this._memberTreeObj.dataSource()[i].parentId)) ? ("~&" + (this._memberTreeObj.dataSource()[i].pid || this._memberTreeObj.dataSource()[i].parentId)) : "~&")) : "");
                }
            }
            return unselectedNodes;
        },

        _getSelectedNodes: function (isSlicer) {
            if (isSlicer) {
                var treeElement = this.element.find(".e-editorTreeView")[0].childNodes[0];
                var selectedNodes = new Array();
                var data = $(treeElement).children();
                for (var i = 0; i < data.length; i++) {
                    var parentNode = data[i];
                    var nodeInfo = { caption: $(parentNode.firstChild).find("a").text(), parentId: parentNode.parentElement.parentElement.className.indexOf("e-editorTreeView") > -1 ? "None" : $(parentNode).parents()[1].id, id: parentNode.id, checked: ($(parentNode).find(':input.nodecheckbox')[0].checked || $(parentNode).find('span:nth-child(1)').attr('class').indexOf("e-chk-indeter") > -1), expanded: $(parentNode.firstChild).find(".e-minus").length > 0 ? true : false, childNodes: new Array(), tag: $(parentNode).attr('data-tag') };
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
                var selectedNodes = "";
                if ((this._currentItem.indexOf(this._getLocalizedLabels("Measures")) < 0)) {
                    for (var i = 0; i < this._memberTreeObj.dataSource().length; i++) {
                        if (this._memberTreeObj.dataSource()[i].checkedStatus == true)
                            selectedNodes += "::" + this._memberTreeObj.dataSource()[i].id + "||" + this._memberTreeObj.dataSource()[i].tag + ((this._currentItem.indexOf(this._getLocalizedLabels("KPIs")) == 0) ? (((!ej.isNullOrUndefined(this._memberTreeObj.dataSource()[i].pid) || !ej.isNullOrUndefined(this._memberTreeObj.dataSource()[i].parentId)) ? ("~&" + (this._memberTreeObj.dataSource()[i].pid || this._memberTreeObj.dataSource()[i].parentId)) : "")) : "");
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

        _removeSplitBtn: function () {
            var dragBtn = $(document).find(".dragClone"); var btnTag;
            var clientObj = this;
            var clientBtns = this.element.find(".e-splitBtn");
            jQuery.each(clientBtns, function (index, value) {
                if ($($(value).children()[0]).attr("title") == $(dragBtn).attr("title")) {
                    btnTag = $(value).attr("data-tag");
                    $(value).remove();
                }
            });
            if (this._currentReportItems.length != 0) {
                if (this._treeViewData.hasOwnProperty($(dragBtn).attr("title"))) {
                    delete this._treeViewData[$(dragBtn).attr("title")];
                    this._currentReportItems.splice($.inArray($(dragBtn).attr("title"), this._currentReportItems), 1);
                }
            }
            if (this.model.enableAdvancedFilter && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                var btnUniqueName = btnTag.split(":")[1].split(".");
                if (!ej.isNullOrUndefined(btnUniqueName) && btnUniqueName.length == 2) {
                    this._setUniqueNameFrmBtnTag(btnUniqueName);
                    this._removeFilterTag(this._selectedFieldName);
                }
            }
            $(".dragClone").remove();
            this._isTimeOut = true;
            setTimeout(function () {
                if (clientObj._isTimeOut)
                    clientObj._waitingPopup.show();
            }, 800);
            if (this.model.beforeServiceInvoke != null)
                this._trigger("beforeServiceInvoke", { action: "removeSplitButton", element: this.element, customObject: this.model.customObject });
            var serializedCustomObject = JSON.stringify(this.model.customObject);
            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.removeSplitButton, JSON.stringify({ "action": "removeSplitButton", "clientParams": btnTag, "olapReport": this.currentReport, "clientReports": this.reports, "customObject": serializedCustomObject }), this._removeSplitButtonSuccess)
            this._isNodeOrButtonDropped = true;
        },

        _removeDialog: function (e) {
            if (e.target.className.indexOf('e-chartTypesImg') == -1)
                $(".e-chartTypesDialog").remove();
            if (e.target.className.indexOf('e-reportDBImg') == -1)
                $(".e-reportDBDialog").remove();
            if (e.target.className.indexOf('e-exportImg') == -1)
                $(".e-exportTypesDialog").remove();
            if (e.target.className.indexOf('e-chart3DImg') == -1)
                $(".e-chart3DTypesDialog").remove();
            if (e.target.className.indexOf('smartLabels') == -1)
                $(".e-smartLabelsDialog").remove();
            if (e.target.className.indexOf('e-interaction') == -1)
                $(".e-interactionsDialog").remove();
        },

        _wireEvents: function () {
            this._wireDialogEvent();
            this._wireEditorRemoveEvent();
            this._wireMeasureRemoveEvent();
            this._on($(document), 'click', this._removeDialog);
            this._on($(document), 'keydown', this._keyPressDown);
            this._on($(document), 'keyup', this._keyPressUp);
            this._on(this.element.find("a.e-linkPanel"), "click", ej.Pivot._editorLinkPanelClick);
            this.element.find("#sep1").hover(function () {
                $(this).removeClass("e-mhover");
            });
            this.element.find(".e-categoricalAxis, .e-rowAxis, .e-slicerAxis").find("button").ejDraggable({
                clientObj: this,
                handle: 'button',
                clone: true,
                cursorAt: { top: -10, left: -10 },
                dragStart: function (event, ui) {
                    event.event.preventDefault();
                    $(this.element.find(".e-txt")).off('touchstart');
                    $(this.element.find(".e-txt")).off(ej.eventType.click);
                    this.model.clientObj.isDragging = true;
                    this.element.find(".e-dialog").hide();
                    this.model.clientObj.draggedSplitBtn = event.event.target;
                },
                dragStop: function (event, ui) {
                    this.element.find(".targetAxis").removeClass("targetAxis");
                    this.model.clientObj.isDragging = false;
                    var cssName = null; var droppedPosition;
                    var pivotClientObj = $(this.element).parents(".e-pivotclient").data("ejPivotClient");
                    if (event.event.type == "touchend")
                        droppedPosition = pivotClientObj._setSplitBtnTargetPos(event);
                    else
                        droppedPosition = pivotClientObj._setSplitBtnTargetPos(event.event);
                    if (pivotClientObj._dropAxisClassName != undefined && pivotClientObj._dropAxisClassName != "") {
                        if (pivotClientObj._dropAxisClassName == "outOfAxis")
                            pivotClientObj._removeSplitBtn();
                        else
                            cssName = pivotClientObj._dropAxisClassName;
                        pivotClientObj._dropAxisClassName = "";
                    }
                    else if (event.target != undefined) {
                        if ($(event.target).hasClass("e-btn") || $(event.target).hasClass("e-removeSplitBtn"))
                            cssName = $(event.target).parents("div:eq(1)").attr("class");
                        else if (jQuery.type(event.target.className) != "string")
                            pivotClientObj._removeSplitBtn();
                        else {
                            if (event.target.className.indexOf("e-splitBtn") > -1)
                                cssName = $(event.target).parents("div:eq(0)").attr("class");
                            else
                                cssName = event.target.className;
                        }
                    }
                    else {
                        if ($(event.event.originalEvent.srcElement).hasClass("e-btn") || $(event.event.originalEvent.srcElement).hasClass("e-removeSplitBtn"))
                            cssName = $(event.event.originalEvent.srcElement).parents("div:eq(1)").attr("class");
                        else if (event.event.originalEvent.srcElement.className.indexOf("e-splitBtn") > -1)
                            cssName = $(event.event.originalEvent.srcElement).parents("div:eq(0)").attr("class");
                        else
                            cssName = event.event.originalEvent.srcElement.className;
                    }
                    if (cssName != undefined && cssName != null) {
                        var axisName = (cssName.indexOf("e-categoricalAxis") > cssName.indexOf("e-rowAxis")) ? ((cssName.indexOf("e-categoricalAxis") > cssName.indexOf("e-slicerAxis")) ? "Categorical" : "Slicer") : ((cssName.indexOf("e-rowAxis") > cssName.indexOf("e-slicerAxis")) ? "Series" : (cssName.indexOf("e-slicerAxis") >= 0) ? "Slicer" : null);
                        if (axisName != null)
                            pivotClientObj._splitButtonDropped(axisName, droppedPosition);
                        else
                            pivotClientObj._removeSplitBtn();
                        pivotClientObj._setSplitBtnTitle();
                    }
                },
                helper: function (event, ui) {
                    var pivotClientObj = $(event.sender.target).parents(".e-pivotclient").data("ejPivotClient");
                    if (event.sender.target.className.indexOf("e-btn") > -1)
                        return $(event.sender.target).clone().addClass("dragClone").appendTo(pivotClientObj.element);
                    else
                        return false;
                }
            });

            this.element.find(".e-nextPage, .e-prevPage, .e-firstPage, .e-lastPage").click(function (args) {
                var pivotClientObj = $(this).parents(".e-pivotclient").data("ejPivotClient");
                ej.Pivot.editorTreeNavigatee(args, pivotClientObj);
            });
            this.element.find(".e-categoricalAxis, .e-rowAxis, .e-slicerAxis").mouseover(function () {
                var pivotClientObj = $(this).parents(".e-pivotclient").data("ejPivotClient");
                if (pivotClientObj.isDragging)
                    $(this).addClass("targetAxis");
            });

            this.element.find(".e-categoricalAxis, .e-rowAxis, .e-slicerAxis").mouseleave(function () {
                $(this).removeClass("targetAxis");
            });

            this.element.find(".e-btn").mouseover(function (evt) {
                $(evt.target.parentNode).find("span").css("display", "inline");
            });
            if (this.model.enableDrillThrough) {
                this._pivotGrid.model.enableDrillThrough = true;
                $.proxy(this._pivotGrid._addHyperlink, this);
            }
            this.element.find(".e-splitBtn").mouseover(function (evt) {
                var pivotClientObj = $(this).parents(".e-pivotclient").data("ejPivotClient");
                if (pivotClientObj.isDragging)
                    $(this).addClass("e-dropIndicator");
            });

            this.element.find(".e-splitBtn").mouseleave(function (evt) {
                $(this).removeClass("e-dropIndicator");
            });
            this._on(this.element, "click", "#preventDiv", ej.proxy(function (evt) {
                if (this.element.find(".e-dialog.e-advancedFilterDlg:visible").length > 0) {
                    this.element.find(".e-dialog.e-advancedFilterDlg").hide();
                    this.element.find("#preventDiv").remove();
                }
            }, this));
            if (!(this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)) {
                this._on(this.element, "mouseover", ".e-pvtBtn", ej.proxy(function (evt) {
                    var pivotClientObj = $(evt.currentTarget).parents(".e-pivotclient").data("ejPivotClient");
                    if (pivotClientObj.isDragging || pivotClientObj._pivotSchemaDesigner._isDragging)
                        $(evt.target).siblings(".e-dropIndicator").addClass("e-dropIndicatorActive");
                }, this));
            }
            this._on(this.element, "mouseleave", ".e-pvtBtn", ej.proxy(function (evt) {
                $(evt.target).siblings(".e-dropIndicator").removeClass("e-dropIndicatorActive");
            }, this));


            this.element.find(".e-sortDisable, .e-sortEnable, .e-filterDisable, .e-filterEnable ").on(ej.eventType.click, function (evt) {
                var pivotClientObj = $(this).parents(".e-pivotclient").data("ejPivotClient");
                if (evt.target.className == "e-sortDisable") {
                    $('.measuresList_wrapper,.e-radioBtnAsc, .e-radioBtnDesc, .e-preserveHrchy').attr("disabled", "disabled");
                    $('.e-measureListLbl, .e-orderLbl, .e-radioBtnAscLbl, .e-radioBtnDescLbl, .e-preserveHrchyLbl').addClass('e-sortFilterDisable');
                    pivotClientObj._dllSortMeasure.disable();
                }
                else if (evt.target.className == "e-sortEnable") {
                    $('.measuresList_wrapper,.e-radioBtnAsc, .e-radioBtnDesc, .e-preserveHrchy').removeAttr("disabled");
                    $('.e-measureListLbl, .e-orderLbl, .e-radioBtnAscLbl, .e-radioBtnDescLbl, .e-preserveHrchyLbl').removeClass('e-sortFilterDisable');
                    pivotClientObj._dllSortMeasure.enable();
                }
                else if (evt.target.className == "e-filterDisable") {
                    $('.filterFrom, .filterTo').attr("disabled", "disabled");
                    $('.filterMeasureListLbl, .e-conditionLbl, .e-filterValueLbl, .e-filterBtw').addClass('e-sortFilterDisable');
                    pivotClientObj._dllFilterCondition.disable();
                    pivotClientObj._dllfMeasuresList.disable();
                }
                else if (evt.target.className == "e-filterEnable") {
                    $('.filterFrom, .filterTo').removeAttr("disabled");
                    $('.filterMeasureListLbl, .e-conditionLbl, .e-filterValueLbl, .e-filterBtw').removeClass('e-sortFilterDisable');
                    pivotClientObj._dllFilterCondition.enable();
                    pivotClientObj._dllfMeasuresList.enable();
                }
            });

            this.element.find(".filterFrom , .filterTo").keypress(function (event) {
                if (event.which == 8 || event.which == 0) {
                    return true;
                }

                if (event.which < 46 || event.which > 58) {
                    return false;
                }
                if ((event.which == 46 && $(this).val().indexOf('.') != -1) || event.which == 47) {
                    return false;
                }
            });

            this.element.find(".e-toggleExpandButton").click(function (evt) {
                var pivotClientObj = $(this).parents(".e-pivotclient").data("ejPivotClient");
                pivotClientObj._isCollapseCB = true;
                pivotClientObj._collapseCubeBrowser();
            });

            this.element.find(".e-toggleCollapseButton").click(function (evt) {
                var pivotClientObj = $(this).parents(".e-pivotclient").data("ejPivotClient");
                pivotClientObj._isCollapseCB = false;
                if (pivotClientObj.model.isResponsive) {
                    pivotClientObj._rwdToggleExpand();
                    if (pivotClientObj.model.enableSplitter)
                        if (pivotClientObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap && pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                            pivotClientObj.element.find(".e-serversplitresponsive").data("ejSplitter").refresh();
                        else
                            pivotClientObj.element.find(".e-splitresponsive").data("ejSplitter").refresh();
                }
                else {
                    pivotClientObj._toggleExpand = false;
                    pivotClientObj._performToggleAction(pivotClientObj._initStyles);
                    pivotClientObj.element.find(".e-csHeader, .e-cubeTable,.e-toggleExpandButton, .pivotFieldList").show();
                    pivotClientObj.element.find(".e-toggleCollapseButton").hide();
                    pivotClientObj.element.find(".e-toggleText").hide();
                    if (pivotClientObj.displayMode() == ej.PivotClient.DisplayMode.GridOnly)
                        pivotClientObj.element.find(".e-gridContainer").width(pivotClientObj.element.find(".e-controlPanel").width() - 5);
                    else if (pivotClientObj.displayMode() == ej.PivotClient.DisplayMode.ChartOnly)
                        pivotClientObj.element.find(".e-chartContainer").width(pivotClientObj.element.find(".e-controlPanel").width() - 5);
                    else if (pivotClientObj.controlPlacement() == ej.PivotClient.ControlPlacement.Tile) {
                        if (pivotClientObj.defaultView() == ej.PivotClient.DefaultView.Grid) {
                            pivotClientObj.element.find(".e-gridContainer").width(pivotClientObj.element.find(".e-controlPanel").width() - 5);
                            pivotClientObj.element.find(".e-chartContainer").width(pivotClientObj.element.find(".e-controlPanel").width() - 10);
                        }
                        else {
                            pivotClientObj.element.find(".e-gridContainer").width(pivotClientObj.element.find(".e-controlPanel").width() - 5);
                            pivotClientObj.element.find(".e-chartContainer").width(pivotClientObj.element.find(".e-controlPanel").width() - 10);
                        }
                    }
                    else if (pivotClientObj.controlPlacement() == ej.PivotClient.ControlPlacement.Tab) {
                        if (pivotClientObj.defaultView() == ej.PivotClient.DefaultView.Grid) {
                            pivotClientObj.element.find(".e-gridContainer").width(pivotClientObj.element.find(".e-controlPanel").width() - 5);
                            pivotClientObj.element.find(".e-chartContainer").width(pivotClientObj.element.find(".e-controlPanel").width() - 5);
                        }
                        else {
                            pivotClientObj.element.find(".e-gridContainer").width(pivotClientObj.element.find(".e-controlPanel").width() - 5);
                            pivotClientObj.element.find(".e-chartContainer").width(pivotClientObj.element.find(".e-controlPanel").width() - 5);
                        }
                    }
                    if (pivotClientObj.model.enableToolBar) {
                        pivotClientObj.element.find("#" + this._id + "_PivotCharttoolBar").width(pivotClientObj.element.find(".e-chartContainer").width());
                        pivotClientObj.element.find("#" + this._id + "_PivotGridToolbar").width(pivotClientObj.element.find(".e-gridContainer").width() - 10);
                        pivotClientObj.element.find(".e-chartToolBar").width(pivotClientObj.element.find(".e-chartContainer").width());
                        pivotClientObj.element.find(".e-toolBar").width(pivotClientObj.element.find(".e-gridContainer").width());
                    }
                    if (pivotClientObj.model.enablePivotTreeMap) {
                        if (pivotClientObj.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                            pivotClientObj.chartObj = null;
                            pivotClientObj.chartObj = pivotClientObj.element.find("#" + pivotClientObj._pivotChart._id + "Container").data("ejChart");
                            if (ej.isNullOrUndefined(pivotClientObj.chartObj) && !ej.isNullOrUndefined(pivotClientObj.otreemapObj))
                                pivotClientObj.chartObj = pivotClientObj.element.find("#" + pivotClientObj.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                            if (!ej.isNullOrUndefined(pivotClientObj.chartObj)) {
                                if ((pivotClientObj.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                                    pivotClientObj.otreemapObj._treeMap.refresh();
                                }
                                else {
                                    pivotClientObj.chartObj.redraw();
                                }
                            }
                        }
                    }
                }
            });
            this._on(this.element, "click", ".e-memberAscendingIcon, .e-memberDescendingIcon", ej.proxy(ej.Pivot._memberSortBtnClick, this));
            this.element.find(".maximizedView").click(function (evt) {
                var pivotClientObj = $(this).parents(".e-pivotclient").data("ejPivotClient");
                pivotClientObj._maxViewBtnClick();
            });

            $(document).on('click', '.e-winCloseBtn', function (evt) {
                var pivotClientObj = $("#" + $(evt.target).attr("clientID")).data("ejPivotClient");
                pivotClientObj._maxViewClsBtnClick();
            });

            if (this.model.isResponsive)
                $(window).on('resize', $.proxy(this._reSizeHandler, this));
            if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                if (this.model.enableSplitter) {
                    var pivotClientObj = this;
                    if (!(this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)) {
                        if (!(pivotClientObj.element.find(".e-shadowbar").parent(".e-childsplit").length > 0)) {
                            pivotClientObj.element.find(".e-parentsplit").mouseup(function (evt) {
                                pivotClientObj._splitterChartResizing(pivotClientObj);
                            });
                        }
                    }
                    else {
                        if (!(pivotClientObj.element.find(".e-shadowbar").parent(".e-serverchildsplit").length > 0)) {
                            pivotClientObj.element.find(".e-serverparentsplit").mouseup(function (evt) {
                                pivotClientObj._splitterChartResizing(pivotClientObj);
                            });
                        }
                    }
                }
            }
        },

        _collapseCubeBrowser: function () {
            if (this.model.isResponsive)
                this._rwdToggleCollapse();
            else {
                var isOlapServer = this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap;
                this._toggleExpand = true;
                if (this._initToggle) {
                    this._initToggle = false; var items = {}; var tolerance = (isOlapServer || this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile) ? 0 : 23;
                    var tempWidth = (this.element.find(".e-cubeTable").width() || this.element.find(".pivotFieldList").width()) + this.element.find(".e-controlPanel").width() - 17;
                    items["controlPanelWidth"] = (tempWidth - ((this.model.collapseCubeBrowserByDefault && isOlapServer && this.controlPlacement() == ej.PivotClient.ControlPlacement.Tab) ? 0 : 3)) + tolerance;
                    items["chartOuterWidth"] = items["chartModelWidth"] = items["gridOuterWidth"] = tempWidth - (this.defaultView() == ej.PivotClient.DefaultView.Grid ? (-11) : 7);
                    this._toggleStyles.push(items);
                }
                if (this.displayMode() == ej.PivotClient.DisplayMode.GridOnly)
                    this.element.find(".e-gridContainer").width(this.element.width() - 40);
                else if (this.displayMode() == ej.PivotClient.DisplayMode.ChartOnly)
                    this.element.find(".e-chartContainer").width(this.element.width() - 45);
                else if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile) {
                    if (this.defaultView() == ej.PivotClient.DefaultView.Grid) {
                        var oServerDiff = isOlapServer ? 10 : 0;
                        this.element.find(".e-gridContainer").width(this.element.width() - (25 + oServerDiff));
                        this.element.find(".e-chartContainer").width(this.element.width() - (30 + oServerDiff));
                    }
                    else {
                        this.element.find(".e-gridContainer").width(this.element.width() - 40);
                        this.element.find(".e-chartContainer").width(this.element.width() - 45);
                    }
                }
                else if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tab) {
                    if (isOlapServer) {
                        this.element.find(".e-gridContainer").width(this.element.width() - 40);
                        this.element.find(".e-chartContainer").width(this.element.width() - 45);
                    }
                    else {
                        this.element.find(".e-gridContainer").width(this.element.width() - 30);
                        this.element.find(".e-chartContainer").width(this.element.width() - 35);
                    }
                }
                this._performToggleAction(this._toggleStyles);
                this.element.find(".e-csHeader, .e-cubeTable,.e-toggleExpandButton, .pivotFieldList").hide();
                this.element.find(".e-toggleCollapseButton").show();
                this.element.find(".e-toggleText").show();
                if (this.model.enablePivotTreeMap) {
                    if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                        this.chartObj = null;
                        this.chartObj = this.element.find("#" + this._pivotChart._id + "Container").data("ejChart");
                        if (ej.isNullOrUndefined(this.chartObj) && !ej.isNullOrUndefined(this.otreemapObj))
                            this.chartObj = this.element.find("#" + this.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                        if (!ej.isNullOrUndefined(this.chartObj)) {
                            if ((this.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                                this.otreemapObj._treeMap.refresh();
                            }
                            else {
                                this.chartObj.redraw();
                            }
                        }
                    }
                }
            }
        },

        _keyPressUp: function (e) {
            if (e.keyCode === 93 && !this.element.find(".e-dialog:visible").length > 0 && this.element.find(".e-hoverCell:visible").length > 0) {
                e.preventDefault();
                if (!ej.isNullOrUndefined(this._curFocus.tab) && this._curFocus.tab.hasClass("e-text")) {
                    var position = { x: this.element.find(".e-hoverCell").offset().left + this.element.find(".e-hoverCell").outerWidth(), y: this.element.find(".e-hoverCell").offset().top + this.element.find(".e-hoverCell").outerHeight() };
                    this.element.find(".e-hoverCell").trigger({ type: 'mouseup', which: 3, clientX: position.x, clientY: position.y, pageX: position.x, pageY: position.y });
                }
            }
        },
        _splitterChartResizing: function (pivotClientObj) {
            if (pivotClientObj.element.find(".e-shadowbar").length > 0) {
                var containerWidth = pivotClientObj.element.find(".e-controlPanel").width();
                if (!pivotClientObj.element.find(".e-shadowbar").parents(".e-parentsplit"))
                    var s = containerWidth;
                else if ((pivotClientObj.element.find(".e-shadowbar").parent(".e-parentsplit").length > 0 || pivotClientObj.element.find(".e-shadowbar").parent(".e-serverparentsplit").length > 0)) {
                    if (!pivotClientObj.model.enableRTL)
                        var s = containerWidth + (pivotClientObj.element.find(".e-controlPanel").offset().left - pivotClientObj.element.find(".e-shadowbar").offset().left);
                    else
                        var s = containerWidth + (pivotClientObj.element.find(".e-shadowbar").offset().left - pivotClientObj.element.find(".e-split-divider").offset().left);
                }
                $("#" + pivotClientObj._pivotChart._id + "Container").width(s - 15);
                pivotClientObj.chartObj = null;
                pivotClientObj.chartObj = pivotClientObj.element.find("#" + pivotClientObj._pivotChart._id + "Container").data("ejChart");
                pivotClientObj.chartObj.redraw();
            }

        },
        _createSplitter: function () {
            if (!this.model.isResponsive) {
                if (!(this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.enableVirtualScrolling)) {
                    this.element.find(".e-parentsplit, .e-serverparentsplit").ejSplitter({
                        cssClass: "customCSS",
                        isResponsive: true,
                        enableRTL: this.model.enableRTL,
                        height: this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? this.element.height() - ((this.element.find("div.e-titleText").length > 0 ? 50 : 0) + this.element.find("#reportToolbar").height() + 5) : this.element.find(".e-outerTable").height(),
                        properties: [{ expandable: false, collapsible: false, paneSize: "50%", maxSize: this.model.enablePaging ? "400%" : "" }, { enableAutoResize: true, collapsible: false, paneSize: "50%", minSize: this.model.enableRTL ? 225 : "" }],
                        resize: function (args) {
                            var obj = this.element.find(".e-childsplit, .e-serverchildsplit").data("ejSplitter");
                            pivotClientObj = $(this.element).parents(".e-pivotclient").data("ejPivotClient");
                            obj.option("properties", [{ expandable: false, collapsible: false, enableAutoResize: true, paneSize: "50%", enableRTL: this.model.enableRTL }, { paneSize: "50%", collapsible: false }]);
                            if (pivotClientObj.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                                pivotClientObj.element.find(".e-fieldTable").css("height", pivotClientObj.element.find(".outerTable").height() - 13 + "px");
                            if (pivotClientObj.model.enableRTL) {
                                pivotClientObj.element.find(".e-childsplit.e-rtl > span.e-splitbar.e-h-bar").css("left", "-5.5px");
                                pivotClientObj.element.find(".e-serverchildsplit.e-rtl > span.e-splitbar.e-h-bar").css("left", "-2.5px");
                            }
                            else {
                                pivotClientObj.element.find(".e-childsplit > span.e-splitbar.e-h-bar").css("left", "5.5px");
                                pivotClientObj.element.find(".e-splitresponsive > span.e-splitbar.e-h-bar").css("left", "5.5px");
                            }

                        },
                    });
                }
                this.element.find(".e-childsplit, .e-serverchildsplit").ejSplitter({
                    cssClass: "customCSS",
                    height: this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? (this.element.height() - ((this.element.find("div.e-titleText").length > 0 ? 50 : 0) + this.element.find("#reportToolbar").height() + this.element.find(".e-csHeader").height() + (this.model.enableVirtualScrolling ? 25 : 15))) : "",
                    isResponsive: true,
                    enableRTL: this.model.enableRTL,
                    properties: [{ expandable: false, collapsible: false, enableAutoResize: true, paneSize: "50%", enableRTL: this.model.enableRTL }, { paneSize: "50%", collapsible: false }]
                });
                if (this.model.enableRTL) {
                    this.element.find(".e-serverparentsplit.e-rtl > span.e-splitbar.e-h-bar").css("left", "-3.5px");
                    this.element.find(".e-serverchildsplit.e-rtl > span.e-splitbar.e-h-bar").css("left", "-3.5px");
                }
            }
            else if (this.model.isResponsive) {
                this.element.find(".e-splitresponsive, .e-serversplitresponsive").ejSplitter({
                    cssClass: "customCSS",
                    isResponsive: true,
                    height: this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? (this.element.height() - ((this.element.find("div.e-titleText").length > 0 ? 50 : 0) + this.element.find("#reportToolbar").height() + this.element.find(".e-csHeader").height() + 25)) : "",
                    properties: [{ expandable: false, collapsible: false, paneSize: "48%" }, { enableAutoResize: true, collapsible: false }]
                });
            }
            if (ej.browserInfo().name == "msie" && (ej.browserInfo().version == "8.0" || ej.browserInfo().version == "9.0")) {
                this.element.find('.e-splitbar.e-h-bar').css("height", "inherit");
            }
            if (this.model.enableRTL) {
                this.element.find(".e-childsplit.e-rtl > span.e-splitbar.e-h-bar").css("left", "-5.5px");
            }
            else {
                this.element.find(".e-childsplit>span.e-splitbar.e-h-bar").css("left", "5.5px");
                this.element.find(".e-splitresponsive>span.e-splitbar.e-h-bar").css("left", "5.5px");
            }

        },
        _keyPressDown: function (e) {
            var btnTab;
            if (!ej.isNullOrUndefined(this._curFocus.button)) {
                btnTab = this._curFocus.button;
            }
            else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                btnTab = this._curFocus.tab;
            }
            if (e.keyCode === 93 && !ej.isNullOrUndefined(btnTab) && !this.element.find(".e-dialog:visible").length > 0 && this.element.find(".e-hoverCell:visible").length > 0) {
                e.preventDefault();
                var position = { x: $(btnTab).offset().left + $(btnTab).outerWidth(), y: $(btnTab).offset().top + $(btnTab).outerHeight() };
                btnTab.trigger({ type: 'mouseup', which: 3, clientX: position.x, clientY: position.y, pageX: position.x, pageY: position.y });
            }
            if (((e.which === 46) || (e.which === 82 && e.ctrlKey)) && !this.element.find(".e-dialog:visible").length > 0 && !ej.isNullOrUndefined(btnTab)) {
                e.preventDefault();
                btnTab.parent().find(".e-removeSplitBtn:visible").click();
            }
            else if ((e.which === 46) || (e.which === 82 && e.ctrlKey) && ((!ej.isNullOrUndefined(this._curFocus.dialog) && this._curFocus.dialog.hasClass("e-measureEditor")) || (!ej.isNullOrUndefined(this._curFocus.editor) && this._curFocus.editor.hasClass("e-measureEditor")))) {
                if (!ej.isNullOrUndefined(this._curFocus.editor)) {
                    this._curFocus.editor.find(".e-removeMeasure:visible").click();
                }
                else if (!ej.isNullOrUndefined(this._curFocus.dialog)) {
                    this._curFocus.dialog.find(".e-removeMeasure:visible").click();
                }
            }
            if (e.keyCode == 79 && this.element.find(".e-dialog:visible").length > 0) {
                if (e.ctrlKey) {
                    e.preventDefault();
                    if (!ej.isNullOrUndefined(this._curFocus.icon) && this._curFocus.icon.hasClass("e-mdxImg")) {
                        this.element.find(".e-dialogCancelBtn:visible").click();
                    }
                    else {
                        this.element.find(".e-dialogOKBtn:visible").click();
                    }
                    this._curFocus.dialog = null;
                }
            }
            if (e.which === 70 && e.ctrlKey && !ej.isNullOrUndefined(btnTab)) {
                btnTab.click();
            }
            if (e.keyCode == 67 && this.element.find(".e-dialog:visible").length > 0 && this.element.find(".e-dialog .e-titlebar").attr("data-tag") != "MDX Query") {
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.element.find(".e-dialogCancelBtn:visible").click();
                    this._curFocus.dialog = null;
                }
            }
            if (this.element.find(".e-dialog:visible").length > 0 && e.keyCode == 27) {
                if (!ej.isNullOrUndefined(this._curFocus.icon)) {
                    this._curFocus.icon.attr("tabindex", "-1").addClass("e-hoverCell").focus().mouseover();
                }
                else if (!ej.isNullOrUndefined(this._curFocus.editor)) {
                    this._curFocus.editor.attr("tabindex", "-1").addClass("e-hoverCell").focus().mouseover();
                }
                else if (!ej.isNullOrUndefined(this._curFocus.dialog)) {
                    this._curFocus.dialog.attr("tabindex", "-1").addClass("e-hoverCell").focus().mouseover();
                }
                this._curFocus.dialog = null;
                this._index.editor = 0;
            }
            else if (this.element.find(".e-dialog:visible").length == 0 && e.keyCode == 27 && $(".e-fullScreenView").length != 0) {
                this._maxViewClsBtnClick();
                if (!ej.isNullOrUndefined(this._pivotGrid._curFocus.cell)) {
                    this._pivotGrid._curFocus.cell.focus().mouseover();
                }
                else if (!this._curFocus.tab.hasClass("e-icon")) {
                    this._curFocus.tab.focus().mouseover();
                }
            }
            else if (this.element.find(".e-chartTypesDialog:visible").length > 0 && e.which === 27) {
                this.element.find(".e-chartTypesDialog").remove();
                this._curFocus.chartimg = null;
            }
            else if ($(".pivotTree:visible,.pivotTreeContext:visible").length > 0 && e.which === 27) {
                if (!ej.isNullOrUndefined(this._curFocus.tree)) {
                    this._curFocus.tree.attr("tabindex", "-1").focus().addClass("e-hoverCell");
                }
                else if (!ej.isNullOrUndefined(btnTab)) {
                    btnTab.attr("tabindex", "-1").focus().addClass("e-hoverCell");
                }
            }
            if (((e.which === 9 && e.shiftKey) || e.which === 9) && this.element.find(".e-dialog:visible").length > 0) {
                e.preventDefault();
                this._curFocus.editor = null;
                this.element.find(".e-dialog .e-hoverCell:visible").removeClass("e-hoverCell");
                var focEle;
                if ((!ej.isNullOrUndefined(this._dllSortMeasure) && this._dllSortMeasure.model.enabled && this.element.find("#measuresList_container:visible").length > 0) || (!ej.isNullOrUndefined(this._dllfMeasuresList) && this._dllfMeasuresList.model.enabled && this.element.find("#fMeasuresList_container:visible").length > 0)) {
                    focEle = this.element.find(".e-dialog .e-filterEnable:visible,#measuresList_container:visible,#fMeasuresList_container:visible,#filterCondition_container:visible,.e-dialog .filterFrom:visible:not([disabled='disabled']),.e-dialog .filterTo:visible:not([disabled='disabled']),.e-dialog .e-radioBtnAsc:visible:not([disabled='disabled']),.e-dialog .e-preserveHrchy:visible:not([disabled='disabled']),.e-dialog .e-dialogOKBtn:visible:not([aria-disabled='true']),.e-dialog .e-dialogCancelBtn:visible,.e-dialog .e-close:visible,.e-dialog .e-checkAll:visible,.e-dialog .e-unCheckAll:visible,.e-dialog .e-sortfiltTab .e-active:visible,.e-dialog .e-measureEditor:visible:first,.e-dialog .e-text:visible:first,.e-dialog .e-sortEnable:visible,.e-dialog .reportName:visible,#reportNameList_container:visible");
                }
                else {
                    focEle = this.element.find(".e-dialog .e-filterEnable:visible,.e-dialog .filterFrom:visible:not([disabled='disabled']),.e-dialog .filterTo:visible:not([disabled='disabled']),.e-dialog .e-radioBtnAsc:visible:not([disabled='disabled']),.e-dialog .e-preserveHrchy:visible:not([disabled='disabled']),.e-dialog .e-dialogOKBtn:visible:not([aria-disabled='true']),.e-dialog .e-dialogCancelBtn:visible,.e-dialog .e-close:visible,.e-dialog .e-checkAll:visible,.e-dialog .e-unCheckAll:visible,.e-dialog .e-sortfiltTab .e-active:visible,.e-dialog .e-measureEditor:visible:first,.e-dialog .e-text:visible:first,.e-dialog .e-sortEnable:visible,.e-dialog .reportName:visible,#reportNameList_container:visible");
                }
                if (!ej.isNullOrUndefined(this._curFocus.dialog)) {
                    this._curFocus.dialog.attr("tabindex", "0").removeClass("e-hoverCell").mouseleave();
                    if (e.which === 9 && e.shiftKey) {
                        this._index.dialog = this._index.dialog - 1 < 0 ? focEle.length - 1 : this._index.dialog - 1;
                    }
                    else if (e.which === 9) {
                        this._index.dialog = this._index.dialog + 1 > focEle.length - 1 ? 0 : this._index.dialog + 1;
                    }
                    this._curFocus.dialog = focEle.eq(this._index.dialog);
                }
                else {
                    this._index.dialog = focEle.length > 4 ? 4 : 2;
                    this._curFocus.dialog = focEle.eq(this._index.dialog);
                }
                if (this._curFocus.dialog.hasClass("e-input") || this._curFocus.dialog.attr("type") == "radio") {
                    this._curFocus.dialog.attr("tabindex", "-1").focus();
                }
                else {
                    this._curFocus.dialog.attr("tabindex", "-1").focus().addClass("e-hoverCell").mouseover;
                }
            }
            else if (((e.which === 9 && e.shiftKey) || e.which === 9) && !$(".pivotTree:visible,.pivotTreeContext:visible").length > 0) {
                e.preventDefault();
                this.element.find(".e-hoverCell").removeClass("e-hoverCell").mouseleave();
                this.element.find(".e-node-focus").removeClass("e-node-focus");
                this._index.button = 1; this._index.icon = 1; this._index.chartimg = 0; this._index.tree = 0; this._index.dialog = 0;
                this._curFocus.button = null; this._curFocus.icon = null; this._curFocus.chartimg = null; this._curFocus.tree = null; this._curFocus.editor = null; this._curFocus.dialog = null;
                var focEle;
                if ($(".e-fullScreenView").length != 0) {
                    if ($("[role='columnheader']:visible:not([p='0,0'])").first().length > 0) {
                        focEle = $("[role='columnheader']:visible:not([p='0,0']):first");
                    }
                }
                else {
                    focEle = this.element.find("[role='columnheader']:visible:not([p='0,0']):first,.e-schemaFieldTree .e-text:visible:first,.e-reportToolbar li:visible:first,#reportList_wrapper:visible,#cubeList_wrapper:visible,#cubeSelector_wrapper:visible, .e-cubeTreeView .e-text:visible:first,.e-categoricalAxis button:visible:first,.e-rowAxis button:visible:first,.e-slicerAxis button:visible:first,.e-schemaColumn button:visible:first,.schemaRow button:visible:first,.schemaFilter button:visible:first,.e-schemaValue button:visible:first,.e-toggleExpandButton:visible:first,.e-toggleCollapseButton:visible:first,#clientTab .e-active:visible");
                }
                if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.attr("tabindex", "0").removeClass("e-hoverCell").mouseleave();
                    if (e.which === 9 && e.shiftKey) {

                        this._index.tab = this._index.tab - 1 < 0 ? focEle.length - 1 : this._index.tab - 1;
                    }
                    else if (e.which === 9) {
                        this._index.tab = this._index.tab + 1 > focEle.length - 1 ? 0 : this._index.tab + 1;
                    }
                    this._curFocus.tab = focEle.eq(this._index.tab).attr("tabindex", "-1").focus().addClass("e-hoverCell").mouseover();
                    if (this._curFocus.tab.hasClass("e-button")) {
                        this._curFocus.tab.parent().find(".e-removeSplitBtn:visible").addClass("e-hoverCell");
                    }
                }
                else {
                    this._index.tab = 0;
                    this._curFocus.tab = focEle.eq(this._index.tab).attr("tabindex", "-1").focus().addClass("e-hoverCell").mouseover();
                    if (this._curFocus.tab.hasClass("e-button")) {
                        this._curFocus.tab.parent().find(".e-removeSplitBtn:visible").addClass("e-hoverCell");
                    }
                }
            }
            if (this.element.find(".e-dialog:visible").length > 0 && e.keyCode == 13) {
                if ($(e.target).parents(".e-pivotschemadesigner").length == 0 && ($(e.target).hasClass("e-memberCurrentPage") || $(e.target).hasClass("e-memberCurrentSearchPage") || $(e.target).hasClass("e-memberCurrentDrillPage"))) {
                    ej.Pivot.editorTreeNavigatee(e, this);
                    return;
                }
                if ($(e.target).hasClass("searchEditorTreeView") && $(e.target).parents(".e-pivotschemadesigner").length == 0) {
                    ej.Pivot._searchEditorTreeNodes(e, this);
                    return;
                }
                e.preventDefault();
                if (!ej.isNullOrUndefined(this._curFocus.editor)) {
                    if (this._curFocus.editor.hasClass("e-text")) {
                        this.element.find(".e-dialog .e-hoverCell").parent().find(".e-chkbox-small").click();
                    }
                }
                else if (!ej.isNullOrUndefined(this._curFocus.dialog)) {
                    if (this._curFocus.dialog.hasClass("e-text")) {
                        this.element.find(".e-dialog .e-hoverCell").parent().find(".e-chkbox-small").click();
                    }
                    else {
                        this._curFocus.dialog.click();
                        if (this._curFocus.dialog.hasClass("e-dialogOKBtn") || this._curFocus.dialog.hasClass("e-dialogCancelBtn") || this._curFocus.dialog.hasClass("e-close")) {
                            this._curFocus.dialog = null;
                        }
                        this._index.editor = 0;
                    }
                }
                else if (!ej.isNullOrUndefined(this._curFocus.icon)) {
                    this._curFocus.icon.attr("tabindex", "-1").focus().mouseover();
                }
                else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.attr("tabindex", "-1").focus().mouseover();
                }
            }
            else if (e.keyCode == 13 && !ej.isNullOrUndefined(this._curFocus.tab) && this._curFocus.tab.attr("role") != "columnheader") {
                e.preventDefault();
                if (!ej.isNullOrUndefined(this._curFocus.icon) || (!ej.isNullOrUndefined(this._curFocus.tab) && !$(".pivotTree:visible,.pivotTreeContext:visible").length > 0 && this.element.find(".e-hoverCell:visible").length > 0)) {
                    this.element.find(".e-hoverCell:visible")[0].click();
                }
                if (!ej.isNullOrUndefined(this.element.find(".e-chartTypesDialog")) && (!ej.isNullOrUndefined(this._curFocus.chartimg))) {
                    this._curFocus.chartimg.click();
                    if (!ej.isNullOrUndefined(this._curFocus.icon)) {
                        this._curFocus.icon.attr("tabindex", "-1").focus().mouseover();
                    }
                    this._index.chartimg = 0;
                    this._curFocus.chartimg = null;
                }
            }
            if ((e.which === 39 || e.which === 37) && this.element.find(".e-dialog:visible").length > 0 && this.element.find(".e-dialog .e-text:visible").hasClass("e-hoverCell")) {
                this.element.find(".e-dialog .e-hoverCell").parent().find(".e-plus,.e-minus").click();
            }
            else if ((e.which === 39 || e.which === 37) && (this.element.find(".e-cubeTreeView .e-text:visible").hasClass("e-hoverCell")) && !this.element.find(".e-editorTreeView:visible").length > 0) {
                this.element.find(".e-cubeTreeView .e-hoverCell").parent().find(".e-plus,.e-minus").click();
            }
            else if ((e.which === 37 || e.which === 39 || e.which === 38 || e.which === 40) && (this.element.find(".e-chartTypesDialog").length > 0 || this.element.find(".e-reportDBDialog").length > 0)) {
                e.preventDefault();
                var dia = this.element.find(".e-chartTypesDialog").length > 0 ? this.element.find(".e-chartTypesDialog") : this.element.find(".e-reportDBDialog");
                dia.tabindex = -1;
                dia.focus();
                var td = dia.find(".e-chartTypesIcon").length > 0 ? dia.find(".e-chartTypesIcon") : this.element.find(".e-reportDBIcon");
                if (!ej.isNullOrUndefined(this._curFocus.chartimg)) {
                    this._curFocus.chartimg.removeClass("e-hoverCell").mouseleave();
                    if (e.which === 39) {
                        this._index.chartimg = this._index.chartimg + 1 > td.length - 1 ? 0 : this._index.chartimg + 1;
                    }
                    else if (e.which === 37) {
                        this._index.chartimg = this._index.chartimg - 1 < 0 ? td.length - 1 : this._index.chartimg - 1;
                    }
                    else if (e.which === 40 && dia.find(".e-chartTypesIcon").length > 0) {
                        this._index.chartimg = this._index.chartimg + 5 > td.length - 1 ? (this._index.chartimg + 5) % 10 : this._index.chartimg + 5;
                    }
                    else if (e.which === 38 && dia.find(".e-chartTypesIcon").length > 0) {
                        this._index.chartimg = this._index.chartimg - 5 < 0 ? td.length - 1 : this._index.chartimg - 5;
                    }
                    this._curFocus.chartimg = td.eq(this._index.chartimg).addClass("e-hoverCell").mouseover();
                }
                else {
                    this._index.chartimg = e.which == 39 ? 0 : e.which == 37 ? td.length - 1 : 0;
                    this._curFocus.chartimg = td.eq(this._index.chartimg).addClass("e-hoverCell").mouseover();
                }
            }
            else if ((e.which === 37 || e.which === 39) && !ej.isNullOrUndefined(this._curFocus.tab) && this._curFocus.tab.hasClass("e-icon") && !this._curFocus.tab.hasClass("e-toggleCollapseButton") && !this._curFocus.tab.hasClass("e-toggleExpandButton") && !this.element.find(".e-dialog:visible").length > 0) {
                e.preventDefault();
                this._curFocus.tab.removeClass("e-hoverCell").mouseleave();
                var td = this.element.find(".e-reportToolbar .e-icon:visible:not(.e-reportCol)");
                if (!ej.isNullOrUndefined(this._curFocus.icon)) {
                    this._curFocus.icon.removeClass("e-hoverCell").mouseleave();
                    if (e.which === 39) {
                        this._index.icon = this._index.icon + 1 > td.length - 2 ? 0 : this._index.icon + 1;
                    }
                    else if (e.which === 37) {
                        this._index.icon = this._index.icon - 1 < 0 ? td.length - 2 : this._index.icon - 1;
                    }
                    this._curFocus.icon = td.eq(this._index.icon).addClass("e-hoverCell").mouseover();
                }
                else {
                    this._index.icon = e.which == 39 ? 1 : e.which == 37 ? td.length - 2 : 0;
                    this._curFocus.icon = td.eq(this._index.icon).addClass("e-hoverCell").mouseover();
                }
            }
            if ((e.which === 40 || e.which === 38) && this.element.find(".e-dialog:visible").length > 0 && !$(".pivotTree:visible,.pivotTreeContext:visible").length > 0 && (this.element.find(".e-dialog .e-text").hasClass("e-hoverCell") || this.element.find(".e-dialog .e-measureEditor").hasClass("e-hoverCell"))) {
                e.preventDefault();
                this.element.find(".e-dialog .e-hoverCell").removeClass("e-hoverCell");
                this.element.find(".e-dialog .e-node-focus").removeClass("e-node-focus");
                if (!ej.isNullOrUndefined(this._curFocus.dialog)) {
                    this._curFocus.dialog.mouseleave();
                }
                var td = this.element.find(".e-dialog .e-measureEditor:visible,.e-dialog .e-text:visible");
                if (!ej.isNullOrUndefined(this._curFocus.editor)) {
                    this._curFocus.editor.attr("tabindex", "0").removeClass("e-hoverCell");
                    if (e.which === 40) {
                        this._index.editor = this._index.editor + 1 > td.length - 1 ? 0 : this._index.editor + 1;
                    }
                    else if (e.which === 38) {
                        this._index.editor = this._index.editor - 1 < 0 ? td.length - 1 : this._index.editor - 1;
                    }
                    this._curFocus.editor = td.eq(this._index.editor).attr("tabindex", "0").focus().addClass("e-hoverCell");
                }
                else {
                    if (td.length > 1) {
                        this._index.editor = e.which == 40 ? 1 : e.which == 38 ? td.length - 1 : 0;
                    }
                    else {
                        this._index.editor = 0;
                    }
                    this._curFocus.editor = td.eq(this._index.editor).attr("tabindex", "0").focus().addClass("e-hoverCell");
                }
            }
            else if ((e.which === 40 || e.which === 38) && !this.element.find(".e-dialog:visible").length > 0 && !ej.isNullOrUndefined(this._curFocus.tab) && this._curFocus.tab.hasClass("e-text") && !$(".pivotTree:visible,.pivotTreeContext:visible").length > 0 && ej.isNullOrUndefined(this._schemaData)) {
                this.element.find(".e-hoverCell").removeClass("e-hoverCell");
                this._curFocus.tab.mouseleave();
                e.preventDefault();
                var td = this.element.find(".e-cubeTreeView .e-text:visible");
                if (!ej.isNullOrUndefined(this._curFocus.tree)) {
                    this._curFocus.tree.attr("tabindex", "0").removeClass("e-hoverCell").mouseleave();
                    if (e.which === 40) {
                        this._index.tree = this._index.tree + 1 > td.length - 1 ? 0 : this._index.tree + 1;
                    }
                    else if (e.which === 38) {
                        this._index.tree = this._index.tree - 1 < 0 ? td.length - 1 : this._index.tree - 1;
                    }
                    this._curFocus.tree = td.eq(this._index.tree).attr("tabindex", "-1").focus().addClass("e-hoverCell").mouseover();
                    this.element.find(".e-node-focus").removeClass("e-node-focus");
                }
                else {
                    this._index.tree = e.which == 40 ? 1 : e.which == 38 ? td.length - 1 : 0;
                    this._curFocus.tree = td.eq(this._index.tree).attr("tabindex", "-1").focus().addClass("e-hoverCell").mouseover();
                    this.element.find(".e-node-focus").removeClass("e-node-focus");
                }
            }
            else if ((e.which === 40 || e.which === 38) && !ej.isNullOrUndefined(this._curFocus.tab) && this._curFocus.tab.hasClass("e-button") && !$(".pivotTree:visible,.pivotTreeContext:visible").length > 0 && !this.element.find(".e-dialog:visible").length > 0 && ej.isNullOrUndefined(this._schemaData)) {
                e.preventDefault();
                var td = null;
                if (this._curFocus.tab.parent().parent().hasClass("e-categoricalAxis") || this._curFocus.tab.parent().parent().hasClass("e-rowAxis") || this._curFocus.tab.parent().parent().hasClass("e-slicerAxis")) {
                    if (this._curFocus.tab.parent().parent().hasClass("e-categoricalAxis")) {
                        td = this.element.find(".e-categoricalAxis button");
                    }
                    else if (this._curFocus.tab.parent().parent().hasClass("e-rowAxis")) {
                        td = this.element.find(".e-rowAxis button");
                    }
                    else if (this._curFocus.tab.parent().parent().hasClass("e-slicerAxis")) {
                        td = this.element.find(".e-slicerAxis button");
                    }
                    if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                        this._curFocus.tab.removeClass("e-hoverCell").attr("tabindex", "0").mouseleave();
                        this._curFocus.tab.parent().find(".e-removeSplitBtn:visible").focus().removeClass("e-hoverCell");
                    }
                    if (!ej.isNullOrUndefined(this._curFocus.button)) {
                        this._curFocus.button.attr("tabindex", "0").removeClass("e-hoverCell");
                        this._curFocus.button.parent().find(".e-removeSplitBtn:visible").removeClass("e-hoverCell");
                        if (e.which === 40) {
                            this._index.button = this._index.button + 1 > td.length - 1 ? 0 : this._index.button + 1;
                        }
                        else if (e.which === 38) {
                            this._index.button = this._index.button - 1 < 0 ? td.length - 1 : this._index.button - 1;
                        }
                        this._curFocus.button = td.eq(this._index.button).attr("tabindex", "0").focus().addClass("e-hoverCell");
                        this._curFocus.button.parent().find(".e-removeSplitBtn:visible").addClass("e-hoverCell");
                    }
                    else {
                        this._index.button = e.which == 40 ? td.length > 1 ? 1 : 0 : e.which == 38 ? td.length - 1 : 0;
                        this._curFocus.button = td.eq(this._index.button).attr("tabindex", "0").focus().addClass("e-hoverCell");
                        this._curFocus.button.parent().find(".e-removeSplitBtn:visible").addClass("e-hoverCell");
                    }
                }
            }
        },

        _wireMeasureRemoveEvent: function () {

            this.element.find(".e-removeMeasure").click(function (evt) {
                var pivotClientObj = $(this).parents(".e-pivotclient").data("ejPivotClient");
                pivotClientObj._isMembersFiltered = true;
                $($(evt.target).parent()).remove();
            });
        },

        _wireEditorRemoveEvent: function () {

            this.element.find(".e-removeSplitBtn").click(function (evt) {
                var pivotClientObj = $(evt.target).parents(".e-pivotclient").data("ejPivotClient");
                this._isTimeOut = true;
                setTimeout(function () {
                    if (pivotClientObj._isTimeOut)
                        pivotClientObj._waitingPopup.show();
                }, 800);

                $($(evt.target).parent()).remove();
                if (pivotClientObj._currentReportItems.length != 0) {
                    if (pivotClientObj._treeViewData.hasOwnProperty($(evt.target).parent().find("button").attr("title"))) {
                        delete pivotClientObj._treeViewData[$(evt.target).parent().find("button").attr("title")];
                        pivotClientObj._currentReportItems.splice($.inArray($(evt.target).parent().find("button").attr("title"), pivotClientObj._currentReportItems), 1);
                    }
                }
                pivotClientObj._off(this.element, "click", ".e-removeSplitBtn");
                if (pivotClientObj.model.enableAdvancedFilter && pivotClientObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap && pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                    var btnUniqueName = $($(evt.target)).parent("div:eq(0)").attr("data-tag").split(":")[1].split(".");
                    if (!ej.isNullOrUndefined(btnUniqueName) && btnUniqueName.length == 2) {
                        pivotClientObj._setUniqueNameFrmBtnTag(btnUniqueName);
                        pivotClientObj._removeFilterTag(pivotClientObj._selectedFieldName);
                    }
                }
                if (pivotClientObj.model.beforeServiceInvoke != null)
                    pivotClientObj._trigger("beforeServiceInvoke", { action: "removeSplitButton", element: this.element, customObject: pivotClientObj.model.customObject });
                var serializedCustomObject = JSON.stringify(pivotClientObj.model.customObject);
                delete pivotClientObj._fieldSelectedMembers[$(evt.target).parent().find("button").attr("title")];
                pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.removeSplitButton, JSON.stringify({ "action": "removeSplitButton", "clientParams": $(evt.target).parent().attr("data-tag"), "olapReport": pivotClientObj.currentReport, "clientReports": pivotClientObj.reports, "customObject": serializedCustomObject }), pivotClientObj._removeSplitButtonSuccess);
                pivotClientObj._isNodeOrButtonDropped = true;
            });
        },
        _setUniqueNameFrmBtnTag: function (btnUniqueName) {
            if (btnUniqueName.length > 0) {
                var liElement = this.element.find(".e-cubeTreeView li[data-tag^='[" + btnUniqueName[0] + "'][data-tag$='" + btnUniqueName[1] + "]']");
                if (liElement.length > 0) {
                    for (var i = 0; i < liElement.length; i++) {
                        if ($(liElement[i]).attr("data-tag").split("].").length == 2) {
                            this._selectedFieldName = $(liElement[i]).attr("data-tag");
                            break;
                        }
                    }
                }
                else
                    this._selectedFieldName = liElement.attr("data-tag");
            }
        },
        _getExportModel: function (modelClone) {
            var pivotClientObj = this, params, exportOption = "clientMode";
            var rowCnt = !ej.isNullOrUndefined(pivotClientObj._pivotGrid) ? (pivotClientObj._pivotGrid._excelLikeJSONRecords != null ? pivotClientObj._pivotGrid._excelRowCount : pivotClientObj._pivotGrid._rowCount) : 0, colCnt = !ej.isNullOrUndefined(pivotClientObj._pivotGrid) ? (pivotClientObj._pivotGrid._excelLikeJSONRecords != null ? Math.floor(pivotClientObj._pivotGrid._excelLikeJSONRecords.length / pivotClientObj._pivotGrid._excelRowCount) : pivotClientObj._pivotGrid.getJSONRecords() != null ? Math.floor(pivotClientObj._pivotGrid.getJSONRecords().length / pivotClientObj._pivotGrid._rowCount) : 0) : 0;
            var reportName = pivotClientObj.element.find(".reportlist").data("ejDropDownList").getSelectedValue(), exportSetting = {}, chartExpObj = {};
            var exportSetting = { url: "", fileName: "PivotClient", exportMode: ej.PivotClient.ExportMode.JSON, title: "", description: "", exportChartAsImage: true, fileFormat: "xls", exportWithStyle: true, exportValueAsNumber: false };
            if (pivotClientObj.model.displaySettings.mode != ej.PivotClient.DisplayMode.GridOnly && pivotClientObj.model.clientExportMode != ej.PivotClient.ClientExportMode.GridOnly) {
                pivotClientObj.chartObj = null; var chartSeries = [], isOlapFullExport = false && pivotClientObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap; //&& exportSetting.exportMode != ej.PivotClient.ExportMode.JSON;
                pivotClientObj.chartObj = pivotClientObj.element.find("#" + pivotClientObj._pivotChart._id + "Container").data("ejChart");
                if (ej.isNullOrUndefined(pivotClientObj.chartObj) && !ej.isNullOrUndefined(pivotClientObj.otreemapObj))
                    pivotClientObj.chartObj = pivotClientObj.element.find("#" + pivotClientObj.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                if ((pivotClientObj.chartObj.sfType.split(".")).pop().toLowerCase() != "treemap") {
                    var zoomFactor = pivotClientObj.chartObj.model.primaryXAxis.zoomFactor;
                    pivotClientObj.chartObj.model.primaryXAxis.zoomFactor = 1;
                    pivotClientObj.chartObj.model.enableCanvasRendering = true;
                    var savedSeries = $.extend(true, [], pivotClientObj.chartObj.model.series);
                    if (isOlapFullExport)
                        pivotClientObj.chartObj.model.series = chartSeries;
                    pivotClientObj.chartObj.redraw();
                    var canvasElement = pivotClientObj.chartObj["export"]();
                    chartString = canvasElement.toDataURL("image/png");
                    pivotClientObj.chartObj.model.primaryXAxis.zoomFactor = zoomFactor;
                    pivotClientObj.chartObj.model.enableCanvasRendering = false;
                    if (isOlapFullExport)
                        pivotClientObj.chartObj.model.series = savedSeries;
                    pivotClientObj.chartObj.redraw();
                }
            }
            pivotClientObj._isExporting = false;
            if (pivotClientObj.model.displaySettings.mode != ej.PivotClient.DisplayMode.ChartOnly && pivotClientObj.model.clientExportMode != ej.PivotClient.ClientExportMode.ChartOnly) {
                var colorDetails = { valueCellColor: pivotClientObj._pivotGrid.element.find(".value").css("color"), valueCellBGColor: pivotClientObj._pivotGrid.element.find(".value").css("background-color"), summaryCellColor: pivotClientObj._pivotGrid.element.find(".summary").css("color"), summaryCellBGColor: pivotClientObj._pivotGrid.element.find(".summary").css("background-color") };
            }
            if (pivotClientObj.model.displaySettings.mode == ej.PivotClient.DisplayMode.GridOnly || pivotClientObj.model.clientExportMode == ej.PivotClient.ClientExportMode.GridOnly) {
                mode = ej.PivotClient.ClientExportMode.GridOnly;
                if (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ClientMode || (pivotClientObj._pivotGrid != null && pivotClientObj._pivotGrid._excelLikeJSONRecords != null && exportSetting.exportMode == ej.PivotClient.ExportMode.JSON) || (exportSetting.exportMode == ej.PivotClient.ExportMode.JSON)) {
                    params = {
                        args: JSON.stringify(
                            {
                                exportMode: mode, exportOption: exportOption, fileFormat: (exportSetting.fileFormat + (exportSetting.exportMode == ej.PivotClient.ExportMode.JSON && (exportSetting.fileFormat == ".xls" || exportSetting.fileFormat == ".xlsx") ? ("~" + exportSetting.exportValueAsNumber) : "")),
                                pGridData: (pivotClientObj._pivotGrid.exportRecords != null && pivotClientObj._pivotGrid.exportRecords != "") ? pivotClientObj._pivotGrid.exportRecords : null, rowCount: rowCnt, columnCount: colCnt, fileName: exportSetting.fileName, customObject: JSON.stringify(pivotClientObj._pivotGrid.model.customObject),
                                title: exportSetting.title, description: exportSetting.description, completeDataExport: pivotClientObj.model.enableCompleteDataExport, exportWithStyle: exportSetting.exportWithStyle, multiControlExport: true
                            })
                    };
                }
            }
            else if (pivotClientObj.model.displaySettings.mode == ej.PivotClient.DisplayMode.ChartOnly || pivotClientObj.model.clientExportMode == ej.PivotClient.ClientExportMode.ChartOnly) {
                mode = ej.PivotClient.ClientExportMode.ChartOnly;
                if (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ClientMode || (pivotClientObj._pivotGrid != null && pivotClientObj._pivotGrid._excelLikeJSONRecords != null && exportSetting.exportMode == ej.PivotClient.ExportMode.JSON) || (exportSetting.exportMode == ej.PivotClient.ExportMode.JSON)) {
                    var chartInfo = {
                        exportMode: mode, exportOption: exportOption, fileFormat: exportSetting.fileFormat, fileName: exportSetting.fileName,
                        chartdata: chartString.split(',')[1], bgColor: $(pivotClientObj._pivotChart.element).css('background-color'), title: exportSetting.title,
                        description: exportSetting.description
                    };
                    if (!ej.isNullOrUndefined(exportSetting.exportChartAsImage) && !exportSetting.exportChartAsImage)
                        chartInfo.chartModel = chartExpObj;
                    params = { args: JSON.stringify(chartInfo) };
                }
            }
            else {
                mode = ej.PivotClient.ClientExportMode.ChartAndGrid;
                if (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ClientMode || (pivotClientObj._pivotGrid._excelLikeJSONRecords != null && exportSetting.exportMode == ej.PivotClient.ExportMode.JSON) || (exportSetting.exportMode == ej.PivotClient.ExportMode.JSON)) {
                    var chartInfo = {
                        exportMode: mode, exportOption: exportOption, fileFormat: (exportSetting.fileFormat + (exportSetting.exportMode == ej.PivotClient.ExportMode.JSON && (exportSetting.fileFormat == ".xls" || exportSetting.fileFormat == ".xlsx") ? ("~" + exportSetting.exportValueAsNumber) : "")),
                        pGridData: (pivotClientObj._pivotGrid.exportRecords != null && pivotClientObj._pivotGrid.exportRecords != "") ? pivotClientObj._pivotGrid.exportRecords : null, rowCount: rowCnt, columnCount: colCnt, fileName: exportSetting.fileName, customObject: JSON.stringify(pivotClientObj._pivotGrid.model.customObject),
                        chartdata: chartString.split(',')[1], bgColor: $(pivotClientObj._pivotChart.element).css('background-color'), title: exportSetting.title,
                        description: exportSetting.description, completeDataExport: pivotClientObj.model.enableCompleteDataExport,
                        exportWithStyle: exportSetting.exportWithStyle, multiControlExport: true
                    }
                    if (!ej.isNullOrUndefined(exportSetting.exportChartAsImage) && !exportSetting.exportChartAsImage)
                        chartInfo.chartModel = chartExpObj;
                    params = { args: JSON.stringify(chartInfo) };
                }
                return params;
            }
        },
        _wireDialogEvent: function () {
            this.element.find(".e-newReportImg, .e-addReportImg, .e-removeReportImg, .e-renameReportImg, .e-pvtBtn, .e-mdxImg,.e-colSortFilterImg, .e-rowSortFilterImg, .e-autoExecuteImg").on(ej.eventType.click, function (evt) {
                var pivotClientObj = $(this).parents(".e-pivotclient").data("ejPivotClient");
                if (evt.currentTarget.parentElement.className.indexOf("e-splitBtn") > -1) {
                    if ($($(evt.currentTarget).parents(".e-splitBtn")[0]).attr('data-tag').indexOf("NAMEDSET") > -1) return false;
                    pivotClientObj._currentAxis = $($(evt.currentTarget).parents(".e-splitBtn")[0]).attr('data-tag').split(':')[0];
                }
                evt.preventDefault();
                if (evt.target.innerHTML != pivotClientObj._getLocalizedLabels("Cancel") && evt.target.innerHTML != pivotClientObj._getLocalizedLabels("OK") && evt.target.parentElement.innerHTML != pivotClientObj._getLocalizedLabels("Cancel") && evt.target.parentElement.innerHTML != pivotClientObj._getLocalizedLabels("OK")) {
                    pivotClientObj._off(pivotClientObj.element, "click", ".e-newReportImg, .e-addReportImg, .e-removeReportImg, .e-renameReportImg, .e-mdxImg, .e-txt,.e-colSortFilterImg, .e-rowSortFilterImg, .e-chartTypesImg, .e-autoExecuteImg");
                    if (evt.target.className.indexOf("e-colSortFilterImg") >= 0 || evt.target.className.indexOf("e-rowSortFilterImg") >= 0) {
                        if (evt.target.className.indexOf("SortImg") >= 0)
                            pivotClientObj._sortOrFilterTab = "sort";
                        else
                            pivotClientObj._sortOrFilterTab = "filter";//
                        if (!(evt.target.className.indexOf("e-colSortFilterImg") >= 0 || evt.target.className.indexOf("e-rowSortFilterImg") >= 0) && (pivotClientObj.element.find(".e-rowAxis").html() == "" && pivotClientObj.element.find(".e-categoricalAxis").html() == "")) {
                            pivotClientObj._isTimeOut = true;
                            setTimeout(function () {
                                if (pivotClientObj._isTimeOut)
                                    pivotClientObj._waitingPopup.show();
                            }, 800);
                        }
                        pivotClientObj._isSorted = false;
                        pivotClientObj._isFiltered = false;
                        pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.toolbarServices, JSON.stringify({ "action": "FetchSortState", "toolbarOperation": null, "clientInfo": (pivotClientObj._axis = (evt.target.className.indexOf("e-colSortFilterImg") >= 0) ? "Column" : "Row"), "olapReport": pivotClientObj.currentReport, "clientReports": "", "customObject": JSON.stringify(pivotClientObj.model.customObject) }), pivotClientObj._fetchSortState);
                    }
                    else if (evt.target.className.indexOf("mdx") >= 0) {
                        if (pivotClientObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap && pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                            pivotClientObj._mdxQuery(ej.olap.base._getParsedMDX(pivotClientObj.model.dataSource, pivotClientObj.model.dataSource.cube));
                        }
                        else
                            pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.mdxQuery, JSON.stringify({ "olapReport": pivotClientObj.currentReport, "customObject": JSON.stringify(pivotClientObj.model.customObject) }), pivotClientObj._mdxQuery);
                    }
                    else if (evt.target.className.indexOf("autoExecute") >= 0) {
                        pivotClientObj.model.enableDeferUpdate = false;
                        pivotClientObj._renderControls();
                        pivotClientObj._deferReport = pivotClientObj.currentReport;
                        pivotClientObj.model.enableDeferUpdate = true;
                    }
                    else if ((pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && pivotClientObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap) || (!$(evt.currentTarget).hasClass("e-pvtBtn")))
                        pivotClientObj._createDialogRequest(evt);
                    pivotClientObj._dimensionName = $(evt.currentTarget).parent().attr("data-tag");
                }
                pivotClientObj.isDropped = false;
            });
            this.element.find(".e-excelExportImg, .e-wordExportImg, .e-pdfExportImg").click(function (e) {
                var pivotClientObj = $(this).parents(".e-pivotclient").data("ejPivotClient");
                if (pivotClientObj.model.displaySettings.mode != pivotClientObj.model.clientExportMode && pivotClientObj.model.displaySettings.mode != ej.PivotClient.DisplayMode.ChartAndGrid && pivotClientObj.model.clientExportMode != ej.PivotClient.ClientExportMode.ChartAndGrid) return;
                if (ej.browserInfo().name == "msie" && ej.browserInfo().version <= 8)
                    pivotClientObj.model.clientExportMode = ej.PivotClient.ClientExportMode.GridOnly;
                var exportOption = e.target.className.indexOf("e-excel") >= 0 ? "Excel" : e.target.className.indexOf("e-word") >= 0 ? "Word" : "Pdf";
                var fileFormat = (exportOption == "Excel" ? pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? ".xls" : ".xlsx" : exportOption == "Word" ? ".docx" : ".pdf");
                var rowCnt = !ej.isNullOrUndefined(pivotClientObj._pivotGrid) ? (pivotClientObj._pivotGrid._excelLikeJSONRecords != null ? pivotClientObj._pivotGrid._excelRowCount : pivotClientObj._pivotGrid._rowCount) : 0, colCnt = !ej.isNullOrUndefined(pivotClientObj._pivotGrid) ? (pivotClientObj._pivotGrid._excelLikeJSONRecords != null ? Math.floor(pivotClientObj._pivotGrid._excelLikeJSONRecords.length / pivotClientObj._pivotGrid._excelRowCount) : pivotClientObj._pivotGrid.getJSONRecords() != null ? Math.floor(pivotClientObj._pivotGrid.getJSONRecords().length / pivotClientObj._pivotGrid._rowCount) : 0) : 0;
                var reportName = pivotClientObj.element.find(".reportlist").data("ejDropDownList").getSelectedValue(), exportSetting = {}, chartExpObj = {};
                if (exportOption == "Excel")
                    exportSetting = { url: "", fileName: "PivotClient", exportMode: ej.PivotClient.ExportMode.JSON, title: reportName != null && reportName != "" ? reportName : "", description: "", exportChartAsImage: true, fileFormat: fileFormat, exportWithStyle: true, exportValueAsNumber: false };
                else
                    exportSetting = { url: "", fileName: "PivotClient", exportMode: ej.PivotClient.ExportMode.JSON, title: reportName != null && reportName != "" ? reportName : "", description: "", fileFormat: fileFormat, exportWithStyle: true };
                pivotClientObj._trigger("beforeExport", exportSetting);
                var completeDataExport = pivotClientObj.model.enableCompleteDataExport && (pivotClientObj.model.enablePaging || pivotClientObj.model.enableVirtualScrolling);
                pivotClientObj._isExporting = true;
                if (completeDataExport && pivotClientObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap && pivotClientObj.model.displaySettings.mode != ej.PivotClient.DisplayMode.ChartOnly && pivotClientObj.model.clientExportMode != ej.PivotClient.ClientExportMode.ChartOnly && exportSetting.exportMode == ej.PivotClient.ExportMode.JSON) {
                    if (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                        var pagingType = { paging: pivotClientObj.model.enablePaging, virualScrolling: pivotClientObj.model.enableVirtualScrolling };
                        pivotClientObj.model.enablePaging = pivotClientObj.model.enableVirtualScrolling = false;
                        ej.olap.base.getJSONData({ action: "loadFieldElements" }, pivotClientObj.model.dataSource, pivotClientObj);
                        pivotClientObj.model.enablePaging = pagingType.paging; pivotClientObj.model.enableVirtualScrolling = pagingType.virualScrolling;
                    }
                    else {
                        pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj._pivotGrid.model.serviceMethodSettings.initialize, JSON.stringify({ "action": "export", "currentReport": pivotClientObj._pivotGrid.model.currentReport }), function (msg) {
                            pivotClientObj._fullExportedData.jsonObj = !ej.isNullOrUndefined(msg[0]) ? JSON.parse(msg[0]) : !ej.isNullOrUndefined(msg.d) ? JSON.parse(msg.d[0]) : JSON.parse(msg.JsonRecords);
                            pivotClientObj._fullExportedData.rowCount = !ej.isNullOrUndefined(msg[1]) ? JSON.parse(msg[1]) : !ej.isNullOrUndefined(msg.d) ? JSON.parse(msg.d[1]) : JSON.parse(msg.RowCount);
                        });
                    }
                    pivotClientObj._pivotGrid.exportRecords = pivotClientObj._fullExportedData.jsonObj;
                    rowCnt = pivotClientObj._fullExportedData.rowCount;
                    colCnt = Math.floor(pivotClientObj._fullExportedData.jsonObj.length / rowCnt);
                }
                var params, chartString, legendString, mode;
                if (pivotClientObj.model.displaySettings.mode != ej.PivotClient.DisplayMode.GridOnly && pivotClientObj.model.clientExportMode != ej.PivotClient.ClientExportMode.GridOnly) {
                    pivotClientObj.chartObj = null; var chartSeries = [], isOlapFullExport = completeDataExport && pivotClientObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap; //&& exportSetting.exportMode != ej.PivotClient.ExportMode.JSON;
                    pivotClientObj.chartObj = pivotClientObj.element.find("#" + pivotClientObj._pivotChart._id + "Container").data("ejChart");
                    if (ej.isNullOrUndefined(pivotClientObj.chartObj) && !ej.isNullOrUndefined(pivotClientObj.otreemapObj))
                        pivotClientObj.chartObj = pivotClientObj.element.find("#" + pivotClientObj.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                    if ((pivotClientObj.chartObj.sfType.split(".")).pop().toLowerCase() != "treemap") {
                        if (isOlapFullExport) {
                            if (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                                pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.chartObj.model.serviceMethodSettings.initialize, JSON.stringify({ "action": "export", "currentReport": pivotClientObj._pivotChart.model.currentReport }), function (msg) {
                                    chartSeries = pivotClientObj._pivotChart._getChartSeries(!ej.isNullOrUndefined(msg[0]) ? JSON.parse(msg[0]) : !ej.isNullOrUndefined(msg.d) ? JSON.parse(msg.d) : JSON.parse(msg.JsonRecords));
                                });
                            }
                            else
                                chartSeries = pivotClientObj._pivotChart._generateData(pivotClientObj._fullExportedData.tranposeEngine);
                        }
                        var zoomFactor = pivotClientObj.chartObj.model.primaryXAxis.zoomFactor;
                        pivotClientObj.chartObj.model.primaryXAxis.zoomFactor = 1;
                        pivotClientObj.chartObj.model.enableCanvasRendering = true;
                        var savedSeries = $.extend(true, [], pivotClientObj.chartObj.model.series);
                        if (isOlapFullExport)
                            pivotClientObj.chartObj.model.series = chartSeries;
                        pivotClientObj.chartObj.redraw();
                        var canvasElement = pivotClientObj.chartObj["export"]();
                        chartString = canvasElement.toDataURL("image/png");
                        pivotClientObj.chartObj.model.primaryXAxis.zoomFactor = zoomFactor;
                        pivotClientObj.chartObj.model.enableCanvasRendering = false;
                        if (isOlapFullExport)
                            pivotClientObj.chartObj.model.series = savedSeries;
                        pivotClientObj.chartObj.redraw();
                        //if (chartsvgElement != undefined && chartsvgElement != null) {
                        //    var chartsvg = ej.buildTag("div").append(chartsvgElement).html();
                        //    canvg(canvasElement, chartsvg);
                        //    chartString = canvasElement.toDataURL("image/png");
                        //    var legendsvgElement = $("#legend_" + pivotClientObj._pivotChart._id + "Container_svg").clone()[0];
                        //    var legendsvg = ej.buildTag("div").append(legendsvgElement).html();
                        //    canvg(canvasElement, legendsvg);
                        //    legendString = canvasElement.toDataURL("image/png");
                        //}
                        //else {
                        //    if (pivotClientObj.model.displaySettings.mode == ej.PivotClient.DisplayMode.ChartOnly || pivotClientObj.model.clientExportMode == ej.PivotClient.ClientExportMode.ChartOnly) return;
                        //    pivotClientObj.model.clientExportMode = ej.PivotClient.ClientExportMode.GridOnly;
                        //}
                    }
                }
                if (exportOption == "Excel" && !exportSetting.exportChartAsImage && (pivotClientObj.model.displaySettings.mode != ej.PivotClient.DisplayMode.GridOnly && pivotClientObj.model.clientExportMode != ej.PivotClient.ClientExportMode.GridOnly)) {
                    chartExpObj = pivotClientObj._pivotChart._excelExport(pivotClientObj.chartObj);
                    chartExpObj = chartExpObj.replace(new RegExp('<br/>', 'g'), '');
                }
                pivotClientObj._isExporting = false;
                if (pivotClientObj.model.displaySettings.mode != ej.PivotClient.DisplayMode.ChartOnly && pivotClientObj.model.clientExportMode != ej.PivotClient.ClientExportMode.ChartOnly) {
                    var colorDetails = {
                        valueCellColor: pivotClientObj._pivotGrid.element.find(".value").css("color"),
                        valueCellBGColor: pivotClientObj._pivotGrid.element.find(".value").css("background-color"),
                        summaryCellColor: pivotClientObj._pivotGrid.element.find(".summary").css("color"),
                        summaryCellBGColor: pivotClientObj._pivotGrid.element.find(".summary").css("background-color")
                    }
                }
                if (pivotClientObj.model.displaySettings.mode == ej.PivotClient.DisplayMode.GridOnly || pivotClientObj.model.clientExportMode == ej.PivotClient.ClientExportMode.GridOnly) {
                    mode = ej.PivotClient.ClientExportMode.GridOnly;
                    if (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ClientMode || (pivotClientObj._pivotGrid != null && pivotClientObj._pivotGrid._excelLikeJSONRecords != null && exportSetting.exportMode == ej.PivotClient.ExportMode.JSON) || ($.trim(exportSetting.url) != "" && exportSetting.exportMode == ej.PivotClient.ExportMode.JSON)) {
                        params = {
                            args: JSON.stringify({
                                exportMode: mode,
                                exportOption: exportOption,
                                fileFormat: (exportSetting.fileFormat + (exportSetting.exportMode == ej.PivotClient.ExportMode.JSON && (exportSetting.fileFormat == ".xls" || exportSetting.fileFormat == ".xlsx") ? ("~" + exportSetting.exportValueAsNumber) : "")),
                                pGridData: (pivotClientObj._pivotGrid.exportRecords != null && pivotClientObj._pivotGrid.exportRecords != "") ? pivotClientObj._pivotGrid.exportRecords : null, rowCount: rowCnt, columnCount: colCnt, fileName: exportSetting.fileName, customObject: JSON.stringify(pivotClientObj._pivotGrid.model.customObject),
                                title: exportSetting.title,
                                description: exportSetting.description,
                                completeDataExport: pivotClientObj.model.enableCompleteDataExport,
                                exportWithStyle: exportSetting.exportWithStyle,
                                formatting: !ej.isNullOrUndefined(pivotClientObj._pivotGrid) && pivotClientObj._pivotGrid.model.enableConditionalFormatting ? pivotClientObj._pivotGrid._cFormat : []
                            })
                        };
                    }
                    else {
                        params = {
                            args: JSON.stringify({
                                exportMode: mode,
                                exportOption: exportOption,
                                fileFormat: exportSetting.fileFormat,
                                currentReport: pivotClientObj.model.enableDeferUpdate ? pivotClientObj._deferReport : pivotClientObj.currentReport,
                                layout: pivotClientObj.gridLayout(),
                                colorSettings: JSON.stringify(colorDetails),
                                title: exportSetting.title,
                                description: exportSetting.description,
                                completeDataExport: this.model.enableCompleteDataExport,
                                exportWithStyle: exportSetting.exportWithStyle,
                                formatting: !ej.isNullOrUndefined(pivotClientObj._pivotGrid) && pivotClientObj._pivotGrid.model.enableConditionalFormatting ? pivotClientObj._pivotGrid._cFormat : []
                            })
                        };
                    }
                }
                else if (pivotClientObj.model.displaySettings.mode == ej.PivotClient.DisplayMode.ChartOnly || pivotClientObj.model.clientExportMode == ej.PivotClient.ClientExportMode.ChartOnly) {
                    mode = ej.PivotClient.ClientExportMode.ChartOnly;
                    if (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ClientMode || (pivotClientObj._pivotGrid != null && pivotClientObj._pivotGrid._excelLikeJSONRecords != null && exportSetting.exportMode == ej.PivotClient.ExportMode.JSON) || ($.trim(exportSetting.url) != "" && exportSetting.exportMode == ej.PivotClient.ExportMode.JSON)) {
                        var chartInfo = {
                            exportMode: mode,
                            exportOption: exportOption,
                            fileFormat: exportSetting.fileFormat,
                            fileName: exportSetting.fileName,
                            chartdata: chartString.split(',')[1],
                            bgColor: $(pivotClientObj._pivotChart.element).css('background-color'),
                            title: exportSetting.title,
                            description: exportSetting.description
                        };
                        if (!ej.isNullOrUndefined(exportSetting.exportChartAsImage) && !exportSetting.exportChartAsImage)
                            chartInfo.chartModel = chartExpObj;
                        params = { args: JSON.stringify(chartInfo) };
                    }
                    else {
                        var chartInfo = {
                            exportMode: mode,
                            exportOption: exportOption,
                            fileFormat: exportSetting.fileFormat,
                            currentReport: pivotClientObj.model.enableDeferUpdate ? pivotClientObj._deferReport : pivotClientObj.currentReport,
                            chartdata: chartString.split(',')[1],
                            legenddata: "",//legendString.split(',')[1],
                            bgColor: $(pivotClientObj._pivotChart.element).css('background-color'),
                            title: exportSetting.title,
                            description: exportSetting.description,
                        }
                        if (!ej.isNullOrUndefined(exportSetting.exportChartAsImage) && !exportSetting.exportChartAsImage)
                            chartInfo.chartModel = chartExpObj;
                        params = { args: JSON.stringify(chartInfo) };
                    }
                }
                else {
                    mode = ej.PivotClient.ClientExportMode.ChartAndGrid;
                    if (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ClientMode || (pivotClientObj._pivotGrid._excelLikeJSONRecords != null && exportSetting.exportMode == ej.PivotClient.ExportMode.JSON) || ($.trim(exportSetting.url) != "" && exportSetting.exportMode == ej.PivotClient.ExportMode.JSON)) {
                        var chartInfo = {
                            exportMode: mode,
                            exportOption: exportOption,
                            fileFormat: (exportSetting.fileFormat + (exportSetting.exportMode == ej.PivotClient.ExportMode.JSON && (exportSetting.fileFormat == ".xls" || exportSetting.fileFormat == ".xlsx") ? ("~" + exportSetting.exportValueAsNumber) : "")),
                            pGridData: (pivotClientObj._pivotGrid.exportRecords != null && pivotClientObj._pivotGrid.exportRecords != "") ? pivotClientObj._pivotGrid.exportRecords : null, rowCount: rowCnt, columnCount: colCnt, fileName: exportSetting.fileName, customObject: JSON.stringify(pivotClientObj._pivotGrid.model.customObject),
                            chartdata: chartString.split(',')[1],
                            bgColor: $(pivotClientObj._pivotChart.element).css('background-color'),
                            title: exportSetting.title,
                            description: exportSetting.description,
                            completeDataExport: pivotClientObj.model.enableCompleteDataExport,
                            exportWithStyle: exportSetting.exportWithStyle,
                            formatting: !ej.isNullOrUndefined(pivotClientObj._pivotGrid) && pivotClientObj._pivotGrid.model.enableConditionalFormatting ? pivotClientObj._pivotGrid._cFormat : []
                        }
                        if (!ej.isNullOrUndefined(exportSetting.exportChartAsImage) && !exportSetting.exportChartAsImage)
                            chartInfo.chartModel = chartExpObj;
                        params = { args: JSON.stringify(chartInfo) };
                    }
                    else {
                        var chartInfo = {
                            exportMode: mode,
                            exportOption: exportOption,
                            fileFormat: exportSetting.fileFormat,
                            currentReport: pivotClientObj.model.enableDeferUpdate ? pivotClientObj._deferReport : pivotClientObj.currentReport,
                            layout: pivotClientObj.gridLayout(),
                            colorSettings: JSON.stringify(colorDetails),
                            chartdata: chartString.split(',')[1],
                            legenddata: "",//legendString.split(',')[1],
                            bgColor: $(pivotClientObj._pivotChart.element).css('background-color'),
                            title: exportSetting.title,
                            description: exportSetting.description,
                            completeDataExport: pivotClientObj.model.enableCompleteDataExport,
                            exportWithStyle: exportSetting.exportWithStyle,
                            formatting: !ej.isNullOrUndefined(pivotClientObj._pivotGrid) && pivotClientObj._pivotGrid.model.enableConditionalFormatting ? pivotClientObj._pivotGrid._cFormat : []
                        }
                        if (!ej.isNullOrUndefined(exportSetting.exportChartAsImage) && !exportSetting.exportChartAsImage)
                            chartInfo.chartModel = chartExpObj;
                        params = { args: JSON.stringify(chartInfo) };
                    }
                }
                if (ej.raiseWebFormsServerEvents && ($.trim(exportSetting.url) != "" && exportSetting.url == "pivotClientExport" && exportSetting.exportMode == ej.PivotClient.ExportMode.JSON)) {
                    var serverArgs = { model: pivotClientObj.model, originalEventType: exportSetting.url };
                    var clientArgs = params;
                    ej.raiseWebFormsServerEvents(exportSetting.url, serverArgs, clientArgs);
                    setTimeout(function () {
                        ej.isOnWebForms = true;
                    }, 1000);
                }
                else
                    pivotClientObj.doPostBack($.trim(exportSetting.url) != "" ? exportSetting.url : (pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.exportPivotClient), params);
            });
            this.element.find(".e-toggleaxisImg").click(function (evt) {
                var pivotClientObj = $(this).parents(".e-pivotclient").data("ejPivotClient");
                pivotClientObj._isTimeOut = true;

                
                if (pivotClientObj.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                    pivotClientObj.chartObj = null;
                    pivotClientObj.chartObj = pivotClientObj.element.find("#" + pivotClientObj._pivotChart._id + "Container").data("ejChart");
                    if (ej.isNullOrUndefined(pivotClientObj.chartObj) && !ej.isNullOrUndefined(pivotClientObj.otreemapObj))
                        pivotClientObj.chartObj = pivotClientObj.element.find("#" + pivotClientObj.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                }
                if (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                    setTimeout(function () { if (pivotClientObj._isTimeOut) pivotClientObj._waitingPopup.show(); }, 800);
                    var dataSrcInfo = pivotClientObj.model.dataSource.rows;
                    pivotClientObj.model.dataSource.rows = pivotClientObj.model.dataSource.columns;
                    pivotClientObj.model.dataSource.columns = dataSrcInfo;
                    if (pivotClientObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap && pivotClientObj.model.dataSource.values.length > 0)
                        pivotClientObj.model.dataSource.values[0]["axis"] = pivotClientObj.model.dataSource.values[0]["axis"] == "rows" ? "columns" : (pivotClientObj.model.dataSource.values[0]["axis"] == "columns" ? "rows" : "columns");
                    if (pivotClientObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                        ej.olap.base.clearDrilledItems(pivotClientObj.model.dataSource, { action: "nodeDropped" }, pivotClientObj);
                    pivotClientObj.refreshControl();
                }
                else if (pivotClientObj.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    if (pivotClientObj._waitingPopup)
                    pivotClientObj._waitingPopup.show();
                    pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.toolbarServices, JSON.stringify({ "action": "toggleAxis", "args": JSON.stringify({ "currentReport": JSON.parse(pivotClientObj.getOlapReport()).Report, "sortedHeaders": (!ej.isNullOrUndefined(pivotClientObj._ascdes) ? pivotClientObj._ascdes : "") }), "customObject": JSON.stringify(pivotClientObj.model.customObject) }), pivotClientObj._toggleAxisSuccess);
                }
                else if ((pivotClientObj.element.find(".e-rowAxis").html() != "") || (pivotClientObj.element.find(".e-categoricalAxis").html() != "")) {
                    if (pivotClientObj._waitingPopup)
                    pivotClientObj._waitingPopup.show()
                    pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.toggleAxis, JSON.stringify({ "action": "toggleAxis", "currentReport": pivotClientObj.currentReport, "clientReports": pivotClientObj.reports, "customObject": JSON.stringify(pivotClientObj.model.customObject) }), pivotClientObj._toggleAxisSuccess);
                }
                !ej.isNullOrUndefined(pivotClientObj.chartObj)
                    pivotClientObj.chartObj.redraw();
            });

            this.element.find(".e-reportDBImg").click(function (evt) {
                var pivotClientObj = $(this).parents(".e-pivotclient").data("ejPivotClient");
                var reportDBDlg = ej.buildTag("div.e-reportDBDialog#reportDBDialog", ej.buildTag("table", ej.buildTag("tbody", ej.buildTag("tr",
                     ej.buildTag("td", ej.buildTag("div.e-saveReportImg e-reportDBIcon").attr({ "title": pivotClientObj._getLocalizedLabels("Save"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                     ej.buildTag("td", ej.buildTag("div.e-saveAsReportImg e-reportDBIcon").attr({ "title": pivotClientObj._getLocalizedLabels("SaveAs"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                     (pivotClientObj.model.showReportCollection ? "" : ej.buildTag("td", ej.buildTag("div.e-loadReportImg e-reportDBIcon").attr({ "title": pivotClientObj._getLocalizedLabels("Load"), tabindex: 0 })[0].outerHTML)[0].outerHTML) +
                     ej.buildTag("td", ej.buildTag("div.e-removeDBReportImg e-reportDBIcon").attr({ "title": pivotClientObj._getLocalizedLabels("Remove"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                     ej.buildTag("td", ej.buildTag("div.e-renameDBReportImg e-reportDBIcon").attr({ "title": pivotClientObj._getLocalizedLabels("Rename"), tabindex: 0 })[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML);

                var ele = pivotClientObj.element.find('div.e-reportDBDialog');
                if (ele.length == 0) {
                    $(reportDBDlg).appendTo(pivotClientObj.element);
                    $(reportDBDlg).css("left", this.offsetLeft + 20 + "px").css("top", this.offsetTop + 20 + "px");
                }
                pivotClientObj.element.find(".e-reportDBIcon").click(function (evt) {
                    $(reportDBDlg).remove();
                    pivotClientObj = pivotClientObj;
                    pivotClientObj._off(pivotClientObj.element, "click", ".e-reportDBIcon");
                    if (evt.target.className.indexOf("e-loadReportImg") >= 0 || evt.target.className.indexOf("e-removeDBReportImg") >= 0 || evt.target.className.indexOf("e-renameDBReportImg") >= 0) {
                        var action = evt.target.className.indexOf("e-loadReportImg") >= 0 ? "LoadReport" : (evt.target.className.indexOf("e-removeDBReportImg") >= 0 ? "RemoveDBReport" : "RenameDBReport");
                        pivotClientObj._isTimeOut = true;
                        setTimeout(function () {
                            if (pivotClientObj._isTimeOut)
                                pivotClientObj._waitingPopup.show();
                        }, 800);
                        if (pivotClientObj.model.operationalMode == "servermode") {
                            if (pivotClientObj.model.beforeServiceInvoke != null)
                                pivotClientObj._trigger("beforeServiceInvoke", { action: "FetchingReportList", element: pivotClientObj.element, customObject: pivotClientObj.model.customObject });
                            var serializedCustomObject = JSON.stringify(pivotClientObj.model.customObject);
                            pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.fetchReportList, JSON.stringify({ "customObject": serializedCustomObject, "action": action, operationalMode: pivotClientObj.model.operationalMode, analysisMode: pivotClientObj.model.analysisMode }), pivotClientObj._fetchReportListSuccess);
                        }
                        else {
                            var fetchReportSetting = { url: "", reportCollection: pivotClientObj._clientReportCollection, reportList: "", mode: pivotClientObj.model.analysisMode }
                            pivotClientObj._trigger("fetchReport", { targetControl: pivotClientObj, fetchReportSetting: fetchReportSetting });
                            if (pivotClientObj.model.enableLocalStorage) {
                                pivotClientObj._fetchReportListSuccess({ d: [{ Key: "ReportNameList", Value: fetchReportSetting.reportList }, { Key: "Action", Value: action }] });
                            } else {
                                var serializedCustomObject = JSON.stringify(pivotClientObj.model.customObject);
                                pivotClientObj.doAjaxPost("POST", fetchReportSetting.url + "/" + pivotClientObj.model.serviceMethodSettings.fetchReportList, JSON.stringify({ "customObject": serializedCustomObject, "action": action, operationalMode: pivotClientObj.model.operationalMode, analysisMode: pivotClientObj.model.analysisMode, }), pivotClientObj._fetchReportListSuccess);
                            }
                        }
                    }
                    else if (evt.target.className.indexOf("e-saveReportImg") >= 0) {
                        if (pivotClientObj._currentRecordName == "") {
                            pivotClientObj._createDialogRequest(evt);
                            return false;
                        }
                        else {
                            pivotClientObj._isTimeOut = true;
                            setTimeout(function () {
                                if (pivotClientObj._isTimeOut)
                                    pivotClientObj._waitingPopup.show();
                            }, 800);
                        }
                        var repCollection;
                        if (pivotClientObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                            repCollection = pivotClientObj._updateReportCollection(true);
                        if (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                            if (pivotClientObj.model.beforeServiceInvoke != null)
                                pivotClientObj._trigger("beforeServiceInvoke", { action: "saveReport", element: this.element, customObject: pivotClientObj.model.customObject });
                            var serializedCustomObject = JSON.stringify(pivotClientObj.model.customObject);
                            pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.saveReport, JSON.stringify({
                                "reportName": pivotClientObj._currentRecordName, operationalMode: pivotClientObj.model.operationalMode, analysisMode: pivotClientObj.model.analysisMode, "olapReport": pivotClientObj.currentReport, "clientReports": (pivotClientObj.model.analysisMode == "pivot" ? JSON.stringify(pivotClientObj._clientReportCollection) : (!ej.isNullOrUndefined(repCollection) ? repCollection : pivotClientObj.reports)), "customObject": serializedCustomObject
                            }), pivotClientObj._toolbarOperationSuccess);
                        }
                        else {
                            var saveReportSetting = { url: "", reportName: pivotClientObj._currentRecordName, reportCollection: pivotClientObj._clientReportCollection, mode: pivotClientObj.model.analysisMode, filterCollection: pivotClientObj._currentReportItems }
                            pivotClientObj._trigger("saveReport", { targetControl: pivotClientObj, saveReportSetting: saveReportSetting });
                            if (!pivotClientObj.model.enableLocalStorage) {
                                var serializedCustomObject = JSON.stringify(pivotClientObj.model.customObject);
                                pivotClientObj.doAjaxPost("POST", saveReportSetting.url + "/" + pivotClientObj.model.serviceMethodSettings.saveReport, JSON.stringify({
                                    "reportName": saveReportSetting.reportName, operationalMode: pivotClientObj.model.operationalMode, analysisMode: pivotClientObj.model.analysisMode, "olapReport": JSON.stringify(pivotClientObj.model.dataSource), "clientReports": (!ej.isNullOrUndefined(repCollection) ? repCollection : JSON.stringify(pivotClientObj._clientReportCollection)) + ":>>:" + JSON.stringify(pivotClientObj._currentReportItems), "customObject": serializedCustomObject
                                }), pivotClientObj._toolbarOperationSuccess);
                            }
                        }
                    }
                    else if ((pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && pivotClientObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap) || (!$(evt.currentTarget).hasClass("e-pvtBtn")))
                        pivotClientObj._createDialogRequest(evt);
                });
            }),

            this.element.find(".e-chartTypesImg").click(function (evt) {
                var pivotClientObj = $(this).parents(".e-pivotclient").data("ejPivotClient");
                var chartTypesDlg = ej.buildTag("div.e-chartTypesDialog#chartTypesDialog", ej.buildTag("table", ej.buildTag("tbody", ej.buildTag("tr",
                    ej.buildTag("td", ej.buildTag("div.e-line e-chartTypesIcon").attr({ "title": pivotClientObj._getLocalizedLabels("Line"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.e-spline e-chartTypesIcon").attr({ "title": pivotClientObj._getLocalizedLabels("Spline"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.e-column e-chartTypesIcon").attr({ "title": pivotClientObj._getLocalizedLabels("Column"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.e-area e-chartTypesIcon").attr({ "title": pivotClientObj._getLocalizedLabels("Area"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.e-splinearea e-chartTypesIcon").attr({ "title": pivotClientObj._getLocalizedLabels("SplineArea"), tabindex: 0 })[0].outerHTML)[0].outerHTML)[0].outerHTML +
                    ej.buildTag("tr", ej.buildTag("td", ej.buildTag("div.e-stepline e-chartTypesIcon").attr({ "title": pivotClientObj._getLocalizedLabels("StepLine"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.e-steparea e-chartTypesIcon").attr({ "title": pivotClientObj._getLocalizedLabels("StepArea"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.e-pie e-chartTypesIcon").attr({ "title": pivotClientObj._getLocalizedLabels("Pie"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.e-bar e-chartTypesIcon").attr({ "title": pivotClientObj._getLocalizedLabels("Bar"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.e-stackingarea e-chartTypesIcon").attr({ "title": pivotClientObj._getLocalizedLabels("StackingArea"), tabindex: 0 })[0].outerHTML)[0].outerHTML)[0].outerHTML +
                    ej.buildTag("tr", ej.buildTag("td", ej.buildTag("div.e-stackingcolumn e-chartTypesIcon").attr({ "title": pivotClientObj._getLocalizedLabels("StackingColumn"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.e-stackingbar e-chartTypesIcon").attr({ "title": pivotClientObj._getLocalizedLabels("StackingBar"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.e-funnel e-chartTypesIcon").attr({ "title": pivotClientObj._getLocalizedLabels("Funnel"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.e-pyramid e-chartTypesIcon").attr({ "title": pivotClientObj._getLocalizedLabels("Pyramid"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.e-doughnut e-chartTypesIcon").attr({ "title": pivotClientObj._getLocalizedLabels("Doughnut"), tabindex: 0 })[0].outerHTML)[0].outerHTML)[0].outerHTML +
                    ej.buildTag("tr", ej.buildTag("td", ej.buildTag("div.e-scatter e-chartTypesIcon").attr({ "title": pivotClientObj._getLocalizedLabels("Scatter"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.e-bubble e-chartTypesIcon").attr({ "title": pivotClientObj._getLocalizedLabels("Bubble"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
					ej.buildTag("td", ej.buildTag("div.waterfall e-chartTypesIcon").attr({ "title": pivotClientObj._getLocalizedLabels("WaterFall"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    (pivotClientObj.model.enablePivotTreeMap ? (ej.buildTag("td", ej.buildTag("div.treemap e-chartTypesIcon").attr({ "title": pivotClientObj._getLocalizedLabels("TreeMap"), tabindex: 0 })[0].outerHTML)[0].outerHTML) : ""))[0].outerHTML)[0].outerHTML)[0].outerHTML);

                var ele = pivotClientObj.element.find('div.e-chartTypesDialog');
                if (ele.length == 0) {
                    $(chartTypesDlg).appendTo(pivotClientObj.element);
                    if (pivotClientObj.model.enableToolBar)
                        $(chartTypesDlg).css("left", $(evt.target).offset().left + 10 + "px").css("top", $(evt.target).offset().top + 15 + "px");
                    else
                        $(chartTypesDlg).css("left", this.offsetLeft + 20 + "px").css("top", this.offsetTop + 20 + "px");
                    if (!pivotClientObj._pivotChart.model.enable3D)
                        pivotClientObj.element.find(".e-" + pivotClientObj._pivotChart.seriesType()).addClass("e-activeChartType");
                }
                $(".e-chartTypesIcon").click(function (e) {
                    var pivotClientObj = $(this).parents(".e-pivotclient").data("ejPivotClient");
                    pivotClientObj.element.find(".e-chartTypesIcon").removeClass("e-activeChartType");
                    $(chartTypesDlg).remove();
                    var selectedtype = e.target.className.split(" ")[0].replace("e-", "");
                    pivotClientObj.model.chartType = selectedtype;
                    pivotClientObj._pivotChart.model.enable3D = false;
                    pivotClientObj._pivotChart.model.type = selectedtype;
                    pivotClientObj._pivotChart.model.commonSeriesOptions.type = selectedtype;
                    if (selectedtype == "funnel" || selectedtype == "pyramid") {
                        pivotClientObj._pivotChart.model.commonSeriesOptions.marker = {
                            dataLabel: {
                                visible: true,
                                shape: 'none',
                                font: { color: pivotClientObj.element.css("color"), size: '12px', fontWeight: 'lighter' }
                            }
                        }
                    }
                    else {
                        pivotClientObj._pivotChart.model.commonSeriesOptions.marker = {
                            dataLabel: {
                                visible: false
                            }
                        }
                    }
                    if (jQuery.inArray(selectedtype, ["line", "spline", "area", "splinearea", "stepline", "steparea", "stackingarea", "scatter"]) > -1 && !pivotClientObj._pivotChart.model.commonSeriesOptions.marker.visible) {
                        pivotClientObj._pivotChart.model.commonSeriesOptions.marker = {
                            shape: ej.PivotChart.SymbolShapes.Circle,
                            size: { height: 12, width: 12 },
                            visible: true,
                            connectorLine: { height: 30, type: "line" },
                            dataLabel: { visible: false },
                            border: { width: 3, color: 'white' }
                        };
                    }
                    if (pivotClientObj._pivotChart.getJSONRecords() != null) {
                        if (pivotClientObj.model.operationalMode != ej.Pivot.OperationalMode.ClientMode) {
                            pivotClientObj.chartObj = null;
                            pivotClientObj.chartObj = pivotClientObj.element.find("#" + pivotClientObj._pivotChart._id + "Container").data("ejChart");
                            if (ej.isNullOrUndefined(pivotClientObj.chartObj) && !ej.isNullOrUndefined(pivotClientObj.otreemapObj))
                                pivotClientObj.chartObj = pivotClientObj.element.find("#" + pivotClientObj.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                            if (!ej.isNullOrUndefined(pivotClientObj.chartObj)) {
                                if (!pivotClientObj.model.enableDeferUpdate) {
                                    if (pivotClientObj.model.enablePivotTreeMap && this.title.toLocaleLowerCase() == "treemap") {
                                        pivotClientObj._isrenderTreeMap = true;
                                        if (pivotClientObj.model.enablePivotTreeMap) {
                                            pivotClientObj.element.find("#" + pivotClientObj._id + "_PivotChartContainer").remove();
                                            pivotClientObj.element.find("#" + pivotClientObj._id + "_PivotChart").removeClass("e-pivotchart")
                                            if (pivotClientObj.element.find("#" + pivotClientObj._id + "_PivotChart").hasClass("e-pivottreemap"))
                                                pivotClientObj.otreemapObj.renderControlSuccess({ "JsonRecords": JSON.stringify(pivotClientObj._pivotChart.getJSONRecords()), "OlapReport": pivotClientObj._pivotChart.getOlapReport() });
                                            else {
                                                pivotClientObj.element.find("#" + pivotClientObj._id + "_PivotChart").ejPivotTreeMap({ url: pivotClientObj.model.url, customObject: pivotClientObj.model.customObject, canResize: pivotClientObj.model.isResponsive, currentReport: pivotClientObj.currentReport, locale: pivotClientObj.locale(), size: { height: pivotClientObj._chartHeight, width: pivotClientObj._chartWidth }, drillSuccess: ej.proxy(pivotClientObj._treemapDrillSuccess, pivotClientObj), beforeServiceInvoke: pivotClientObj.model.treeMapLoad });
                                                pivotClientObj.otreemapObj = pivotClientObj.element.find('#' + pivotClientObj._id + '_PivotChart').data("ejPivotTreeMap");
                                                pivotClientObj.chartObj = null;
                                            }
                                        }
                                    }
                                    else {
                                        pivotClientObj.element.find("#" + pivotClientObj._id + "_PivotChartTreeMapContainer").remove();
                                        pivotClientObj.element.find("#" + pivotClientObj._id + "_PivotChart").removeClass("e-pivottreemap")
                                        if (pivotClientObj.element.find("#" + pivotClientObj._id + "_PivotChart").hasClass("e-pivotchart")) {
                                            pivotClientObj._pivotChart.renderControlSuccess({ "JsonRecords": JSON.stringify(pivotClientObj._pivotChart.getJSONRecords()), "OlapReport": pivotClientObj._pivotChart.getOlapReport() });
                                        }
                                        else {
                                            pivotClientObj.element.find("#" + pivotClientObj._id + "_PivotChart").ejPivotChart({ url: pivotClientObj.model.url, customObject: pivotClientObj.model.customObject, enableRTL: pivotClientObj.model.enableRTL, enableDefaultValue: this.model.enableDefaultValue, axesLabelRendering: pivotClientObj.model.axesLabelRendering, pointRegionClick: pivotClientObj.model.pointRegionClick, canResize: pivotClientObj.model.isResponsive, currentReport: pivotClientObj.currentReport, customObject: pivotClientObj.model.customObject, locale: pivotClientObj.locale(), showTooltip: true, size: { height: pivotClientObj._chartHeight, width: pivotClientObj._chartWidth }, commonSeriesOptions: { type: pivotClientObj.model.chartType, tooltip: { visible: true } }, beforeServiceInvoke: pivotClientObj.model.chartLoad, drillSuccess: ej.proxy(pivotClientObj._chartDrillSuccess, pivotClientObj) });
                                            pivotClientObj._pivotChart = pivotClientObj.element.find('#' + pivotClientObj._id + '_PivotChart').data("ejPivotChart");
                                            pivotClientObj.chartObj = null;
                                        }
                                    }
                                }
                                else {
                                    pivotClientObj._ischartTypesChanged = true;
                                    if (pivotClientObj.model.enablePivotTreeMap && this.title.toLocaleLowerCase() == "treemap") {
                                        if (pivotClientObj.model.enablePivotTreeMap) {
                                            pivotClientObj.element.find("#" + pivotClientObj._id + "_PivotChartContainer").remove();
                                            pivotClientObj.element.find("#" + pivotClientObj._id + "_PivotChart").removeClass("e-pivotchart")
                                            if (pivotClientObj.element.find("#" + pivotClientObj._id + "_PivotChart").hasClass("e-pivottreemap"))
                                                pivotClientObj.otreemapObj.renderTreeMapFromJSON(pivotClientObj._pivotChart.getJSONRecords());
                                            else {
                                                pivotClientObj.element.find("#" + pivotClientObj._id + "_PivotChart").ejPivotTreeMap({ url: pivotClientObj.model.url, customObject: this.model.customObject, canResize: pivotClientObj.model.isResponsive, currentReport: pivotClientObj.currentReport, locale: pivotClientObj.locale(), size: { height: pivotClientObj._chartHeight, width: pivotClientObj._chartWidth }, drillSuccess: ej.proxy(pivotClientObj._treemapDrillSuccess, pivotClientObj), beforeServiceInvoke: pivotClientObj.model.treeMapLoad });
                                                pivotClientObj.otreemapObj = pivotClientObj.element.find('#' + pivotClientObj._id + '_PivotChart').data("ejPivotTreeMap");
                                                pivotClientObj._isrenderTreeMap = true;
                                                pivotClientObj.chartObj = null;
                                            }
                                        }
                                    }
                                    else {
                                        pivotClientObj.element.find("#" + pivotClientObj._id + "_PivotChartTreeMapContainer").remove();
                                        pivotClientObj.element.find("#" + pivotClientObj._id + "_PivotChart").removeClass("e-pivottreemap")
                                        if (pivotClientObj.element.find("#" + pivotClientObj._id + "_PivotChart").hasClass("e-pivotchart"))
                                            pivotClientObj._pivotChart.renderControlSuccess({ "JsonRecords": JSON.stringify(pivotClientObj._pivotChart.getJSONRecords()), "OlapReport": pivotClientObj._pivotChart.getOlapReport() });
                                        else {
                                            pivotClientObj.element.find("#" + pivotClientObj._id + "_PivotChart").ejPivotChart({ url: pivotClientObj.model.url, customObject: this.model.customObject, enableRTL: pivotClientObj.model.enableRTL, enableDefaultValue: this.model.enableDefaultValue, axesLabelRendering: pivotClientObj.model.axesLabelRendering, pointRegionClick: pivotClientObj.model.pointRegionClick, canResize: pivotClientObj.model.isResponsive, currentReport: pivotClientObj.currentReport, customObject: pivotClientObj.model.customObject, locale: pivotClientObj.locale(), showTooltip: true, size: { height: pivotClientObj._chartHeight, width: pivotClientObj._chartWidth }, commonSeriesOptions: { type: pivotClientObj.model.chartType, tooltip: { visible: true } }, beforeServiceInvoke: pivotClientObj.model.chartLoad, drillSuccess: ej.proxy(pivotClientObj._chartDrillSuccess, pivotClientObj) });
                                            pivotClientObj._pivotChart = pivotClientObj.element.find('#' + pivotClientObj._id + '_PivotChart').data("ejPivotChart");
                                            pivotClientObj.chartObj = null;
                                        }
                                    }
                                }
                                if (pivotClientObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                                    var serializedCustomObject = JSON.stringify(pivotClientObj.model.customObject);
                                    pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.updateReport, JSON.stringify({
                                        "action": "chartTypeChanged", "clientParams": selectedtype, "olapReport": pivotClientObj.currentReport, "clientReports": pivotClientObj.reports, "customObject": serializedCustomObject
                                    }), pivotClientObj._chartTypeChangedSuccess);
                                }
                            }
                        }
                        else
                            pivotClientObj._pivotChart.renderControlSuccess({ "JsonRecords": JSON.stringify(pivotClientObj._pivotChart.getJSONRecords()), "OlapReport": pivotClientObj._pivotChart.getOlapReport() });
                        if (pivotClientObj.model.isResponsive) {
                            pivotClientObj.chartObj = pivotClientObj.element.find("#" + pivotClientObj._pivotChart._id + "Container").data("ejChart");
                            if (!ej.isNullOrUndefined(pivotClientObj.chartObj))
                                pivotClientObj.element.find("#" + pivotClientObj.chartObj._id).ejChart("option", { "model": { size: { height: pivotClientObj._chartHeight } } });
                        }
                    }
                    else {
                        pivotClientObj._isTimeOut = false;
                        pivotClientObj._waitingPopup.hide();
                    }
                });
            });

            this.element.find(".e-dialogCancelBtn").on(ej.eventType.click, function (e) {
                var pivotClientObj = $(this).parents(".e-pivotclient").data("ejPivotClient");
                e.preventDefault();
                pivotClientObj.element.find(".e-dialog").hide();
                pivotClientObj.element.find(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog), .e-clientDialog").remove();
                ej.Pivot.closePreventPanel(pivotClientObj);
            });

            this.element.find(".e-dialogOKBtn").on(ej.eventType.click, function (e) {
                var pivotClientObj = $(this).parents(".e-pivotclient").data("ejPivotClient");
                e.preventDefault();
                if (pivotClientObj.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                    pivotClientObj.chartObj = pivotClientObj.element.find("#" + pivotClientObj._pivotChart._id + "Container").data("ejChart");
                    if (ej.isNullOrUndefined(pivotClientObj.chartObj) && pivotClientObj.model.enablePivotTreeMap && !ej.isNullOrUndefined(pivotClientObj.otreemapObj))
                        pivotClientObj.chartObj = pivotClientObj.element.find("#" + pivotClientObj.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                }
                var loadDlgTitle = (ej.browserInfo().name == "msie" && ej.browserInfo().version <= 8) ? pivotClientObj._dialogTitle : pivotClientObj.element.find(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog) .e-titlebar")[0].textContent == undefined ? pivotClientObj.element.find(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog) .e-titlebar")[0].innerText : pivotClientObj.element.find(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog) .e-titlebar")[0].textContent;
                if (loadDlgTitle == pivotClientObj._getLocalizedLabels("Load")) {
                    pivotClientObj._currentRecordName = pivotClientObj.element.find(".reportNameList")[0].value;
                    var selectedReport = pivotClientObj.element.find(".reportNameList")[0].value;
                    if (selectedReport != "") {
                        pivotClientObj._isTimeOut = true;
                        if (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                            pivotClientObj._waitingPopup.show();
                        else
                            setTimeout(function () {
                                if (pivotClientObj._isTimeOut)
                                    pivotClientObj._waitingPopup.show();
                            }, 800);
                        pivotClientObj._fieldMembers = {};
                        pivotClientObj._fieldSelectedMembers = {};
                        if (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                            if (pivotClientObj.model.beforeServiceInvoke != null)
                                pivotClientObj._trigger("beforeServiceInvoke", { action: "loadReport", element: this.element, customObject: pivotClientObj.model.customObject });
                            var serializedCustomObject = JSON.stringify(pivotClientObj.model.customObject);
                            pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.loadReport, JSON.stringify({
                                "reportName": selectedReport, operationalMode: pivotClientObj.model.operationalMode, analysisMode: pivotClientObj.model.analysisMode, "olapReport": pivotClientObj.currentReport, "clientReports": pivotClientObj.reports, "customObject": serializedCustomObject, "clientParams": JSON.stringify(pivotClientObj.model.enableMeasureGroups)
                            }), (pivotClientObj.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? pivotClientObj._renderControlSuccess : pivotClientObj._toolbarOperationSuccess));
                        }
                        else {
                            var loadReportSetting = { url: "", reportCollection: pivotClientObj._clientReportCollection, selectedReport: selectedReport, mode: pivotClientObj.model.analysisMode }
                            pivotClientObj._trigger("loadReport", { targetControl: pivotClientObj, loadReportSetting: loadReportSetting });
                            if (pivotClientObj.model.enableLocalStorage) {
                                pivotClientObj.model.dataSource = loadReportSetting.reportCollection[0];
                                pivotClientObj._clientReportCollection = loadReportSetting.reportCollection;
                                pivotClientObj.refreshControl();
                                pivotClientObj._refreshReportList();
                                if (pivotClientObj._pivotSchemaDesigner)
                                    pivotClientObj._pivotSchemaDesigner._refreshPivotButtons();
                            } else {
                                var serializedCustomObject = JSON.stringify(pivotClientObj.model.customObject);
                                pivotClientObj.doAjaxPost("POST", loadReportSetting.url + "/" + pivotClientObj.model.serviceMethodSettings.loadReport, JSON.stringify({
                                    "reportName": selectedReport, operationalMode: pivotClientObj.model.operationalMode, analysisMode: pivotClientObj.model.analysisMode, "olapReport": pivotClientObj.currentReport, "clientReports": pivotClientObj.reports, "customObject": serializedCustomObject, "clientParams": JSON.stringify(pivotClientObj.model.enableMeasureGroups)
                                }), (pivotClientObj._clientToolbarOperationSuccess));
                            }
                        }
                    }
                    else {
                        ej.Pivot._createErrorDialog(pivotClientObj._getLocalizedLabels("SelectRecordAlertMsg"), pivotClientObj._getLocalizedLabels("Warning"), pivotClientObj);
                        return false;
                    }
                }
                else if (loadDlgTitle == pivotClientObj._getLocalizedLabels("Remove")) {
                    var selectedReport = pivotClientObj.element.find(".reportNameList")[0].value;
                    if (selectedReport != "" && !ej.isNullOrUndefined(selectedReport)) {
                        pivotClientObj._currentRecordName = selectedReport == pivotClientObj._currentRecordName ? "" : pivotClientObj._currentRecordName;
                        pivotClientObj._isTimeOut = true;
                        setTimeout(function () {
                            if (pivotClientObj._isTimeOut)
                                pivotClientObj._waitingPopup.show();
                        }, 800);
                        var fetchReportSetting;
                        if (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                            fetchReportSetting = { url: "", selectedReport: selectedReport, mode: pivotClientObj.model.analysisMode }
                            pivotClientObj._trigger("loadReport", { targetControl: pivotClientObj, fetchReportSetting: fetchReportSetting });
                        }
                        if (pivotClientObj.model.beforeServiceInvoke != null)
                            pivotClientObj._trigger("beforeServiceInvoke", { action: "removeDBReport", element: this.element, customObject: pivotClientObj.model.customObject, currentReportName: selectedReport });
                        var serializedCustomObject = JSON.stringify(pivotClientObj.model.customObject);
                        pivotClientObj._fieldMembers = {};
                        pivotClientObj._fieldSelectedMembers = {};
                        if (!pivotClientObj.model.enableLocalStorage) {
                            pivotClientObj.doAjaxPost("POST", (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? fetchReportSetting.url : pivotClientObj.model.url) + "/" + pivotClientObj.model.serviceMethodSettings.removeDBReport, JSON.stringify({
                                "reportName": selectedReport, operationalMode: pivotClientObj.model.operationalMode, analysisMode: pivotClientObj.model.analysisMode, "customObject": serializedCustomObject,
                            }), pivotClientObj._toolbarOperationSuccess);
                        }
                    }
                    else {
                        ej.Pivot._createErrorDialog(pivotClientObj._getLocalizedLabels("SelectRecordAlertMsg"), pivotClientObj._getLocalizedLabels("Warning"), pivotClientObj);
                        return false;
                    }
                }
                else if (loadDlgTitle == pivotClientObj._getLocalizedLabels("Rename")) {
                    var renameReport = pivotClientObj.element.find(".renameReport").val();
                    var selectedReport = pivotClientObj.element.find(".reportNameList")[0].value;
                    if (selectedReport != "" && !ej.isNullOrUndefined(selectedReport) && renameReport != "" && !ej.isNullOrUndefined(renameReport)) {
                        pivotClientObj._isTimeOut = true;
                        setTimeout(function () {
                            if (pivotClientObj._isTimeOut)
                                pivotClientObj._waitingPopup.show();
                        }, 800);
                        var fetchReportSetting;
                        if (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                            fetchReportSetting = { url: "", selectedReport: selectedReport, mode: pivotClientObj.model.analysisMode }
                            pivotClientObj._trigger("loadReport", { targetControl: pivotClientObj, fetchReportSetting: fetchReportSetting });
                        }
                        if (pivotClientObj.model.beforeServiceInvoke != null)
                            pivotClientObj._trigger("beforeServiceInvoke", { action: "renameDBReport", element: this.element, customObject: pivotClientObj.model.customObject, currentReportName: selectedReport, renameReportName: renameReport });
                        var serializedCustomObject = JSON.stringify(pivotClientObj.model.customObject);
                        if (!pivotClientObj.model.enableLocalStorage) {
                            pivotClientObj.doAjaxPost("POST", (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? fetchReportSetting.url : pivotClientObj.model.url) + "/" + pivotClientObj.model.serviceMethodSettings.renameDBReport, JSON.stringify({
                                "selectedReport": selectedReport, "renameReport": renameReport, operationalMode: pivotClientObj.model.operationalMode, analysisMode: pivotClientObj.model.analysisMode, "customObject": serializedCustomObject,
                            }), pivotClientObj._toolbarOperationSuccess);
                        }
                    }
                    else {
                        if (selectedReport == "" || ej.isNullOrUndefined(selectedReport))
                            ej.Pivot._createErrorDialog(pivotClientObj._getLocalizedLabels("SelectRecordAlertMsg"), pivotClientObj._getLocalizedLabels("Warning"), pivotClientObj);
                        else if (renameReport == "" || ej.isNullOrUndefined(renameReport))
                            ej.Pivot._createErrorDialog(pivotClientObj._getLocalizedLabels("SetReportNameAlertMsg"), pivotClientObj._getLocalizedLabels("Warning"), pivotClientObj);
                        return false;
                    }
                }
                else if (pivotClientObj.element.find(".e-sortingDlg").length > 0) {
                    if (pivotClientObj.element.find(".e-sortEnable")[0].checked == true && pivotClientObj.element.find(".e-measuresList")[0].value == "") {
                        ej.Pivot._createErrorDialog(pivotClientObj._getLocalizedLabels("FilterMeasureSelectionAlertMsg"), pivotClientObj._getLocalizedLabels("Warning"), pivotClientObj);
                        return false;
                    }
                    else if (pivotClientObj.element.find(".e-filterEnable")[0].checked == true) {
                        if (pivotClientObj.element.find(".fMeasuresList")[0].value == "") {
                            ej.Pivot._createErrorDialog(pivotClientObj._getLocalizedLabels("FilterMeasureSelectionAlertMsg"), pivotClientObj._getLocalizedLabels("Warning"), pivotClientObj); return false;
                        }
                        else if (pivotClientObj.element.find(".e-filterCondition")[0].value == "") {
                            ej.Pivot._createErrorDialog(pivotClientObj._getLocalizedLabels("FilterConditionAlertMsg"), pivotClientObj._getLocalizedLabels("Warning"), pivotClientObj); return false;
                        }
                        else if (pivotClientObj.element.find(".filterFrom")[0].value == "") {
                            ej.Pivot._createErrorDialog(pivotClientObj._getLocalizedLabels("FilterStartValueAlertMsg"), pivotClientObj._getLocalizedLabels("Warning"), pivotClientObj); return false;
                        }
                        else if ((pivotClientObj.element.find(".e-filterCondition")[0].value == "Between" || pivotClientObj.element.find(".e-filterCondition")[0].value == "NotBetween") && pivotClientObj.element.find(".filterTo")[0].value == "") {
                            ej.Pivot._createErrorDialog(pivotClientObj._getLocalizedLabels("FilterEndValueAlertMsg"), pivotClientObj._getLocalizedLabels("Warning"), pivotClientObj); return false;
                        }

                        pivotClientObj._excelFilterInfo = [];
                    }
                    var sortingDetails = null, filteringDetails = null;
                    if ((pivotClientObj._isSorted == false || pivotClientObj._isSorted == true) && pivotClientObj.element.find(".e-sortEnable")[0].checked == true) {
                        var measureElement = pivotClientObj.element.find("li[data-tag*='" + pivotClientObj.element.find(".e-measuresList")[0].value + "']");
                        if (measureElement.length > 1)
                            measureElement = (pivotClientObj.element.find("li[data-tag^='[Measures].[" + pivotClientObj.element.find(".e-measuresList")[0].value + "']li[data-tag*='" + pivotClientObj.element.find(".e-measuresList")[0].value + "']") || pivotClientObj.element.find("li[data-tag^='[MEASURES].[" + pivotClientObj.element.find(".e-measuresList")[0].value + "']li[data-tag*='" + pivotClientObj.element.find(".e-measuresList")[0].value + "']"));
                        sortingDetails = $(measureElement).attr("data-tag") + "::" + ((pivotClientObj.element.find(".e-radioBtnAsc")[0].checked == true) ? "ASC" : "DESC") + "::" + pivotClientObj._axis + "::" + ((pivotClientObj.element.find(".e-preserveHrchy")[0].checked == true) ? "PHT" : "PHF");
                    }
                    else if (pivotClientObj._isSorted == true && pivotClientObj.element.find(".e-sortDisable")[0].checked == true)
                        sortingDetails = "Disable Sorting" + "::" + " " + "::" + pivotClientObj._axis + "::" + " ";
                    else
                        sortingDetails = " " + "::" + " " + "::" + pivotClientObj._axis + "::" + " ";
                    if ((pivotClientObj._isFiltered == false || pivotClientObj._isFiltered == true) && pivotClientObj.element.find(".e-filterEnable")[0].checked == true) {
                        var measureElement = pivotClientObj.element.find("li[data-tag*='" + pivotClientObj.element.find(".fMeasuresList")[0].value + "']");
                        if (measureElement.length > 1)
                            measureElement = (pivotClientObj.element.find("li[data-tag^='[Measures].[" + pivotClientObj.element.find(".fMeasuresList")[0].value + "']li[data-tag*='" + pivotClientObj.element.find(".fMeasuresList")[0].value + "']") || pivotClientObj.element.find("li[data-tag^='[MEASURES].[" + pivotClientObj.element.find(".fMeasuresList")[0].value + "']li[data-tag*='" + pivotClientObj.element.find(".fMeasuresList")[0].value + "']"));
                        filteringDetails = $(measureElement).attr("data-tag") + "::" + pivotClientObj.element.find(".e-filterCondition")[0].value + "::" + pivotClientObj.element.find(".filterFrom")[0].value + "::" + pivotClientObj.element.find(".filterTo")[0].value;
                    }
                    else if (pivotClientObj._isFiltered == true && pivotClientObj.element.find(".e-filterDisable")[0].checked == true)
                        filteringDetails = "Disable Filtering";
                    else
                        filteringDetails = "";
                    pivotClientObj._SortFilterDetails = sortingDetails + "||" + filteringDetails;

                    pivotClientObj._isTimeOut = true;
                    setTimeout(function () {
                        if (pivotClientObj._isTimeOut)
                            pivotClientObj._waitingPopup.show();
                    }, 800);
                    if (pivotClientObj.element.find(".e-sortEnable")[0].checked == true || pivotClientObj.element.find(".e-filterEnable")[0].checked == true) {
                        pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.toolbarServices, JSON.stringify({ "action": "toolbarOperation", "toolbarOperation": "SortOrFilter", "clientInfo": pivotClientObj._SortFilterDetails, "olapReport": pivotClientObj.currentReport, "clientReports": pivotClientObj.reports, "customObject": JSON.stringify(pivotClientObj.model.customObject) }), pivotClientObj._toolbarOperationSuccess);
                    }
                    else if (pivotClientObj.element.find(".e-sortDisable")[0].checked == true || pivotClientObj.element.find(".e-filterDisable")[0].checked == true) {
                        if (pivotClientObj._isSorted == true || pivotClientObj._isFiltered == true) {
                            pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.toolbarServices, JSON.stringify({ "action": "toolbarOperation", "toolbarOperation": "SortOrFilter", "clientInfo": pivotClientObj._SortFilterDetails, "olapReport": pivotClientObj.currentReport, "clientReports": pivotClientObj.reports, "customObject": JSON.stringify(pivotClientObj.model.customObject) }), pivotClientObj._toolbarOperationSuccess);
                            pivotClientObj._isSorted = false;
                        }
                        else {
                            ej.Pivot._createErrorDialog(pivotClientObj._getLocalizedLabels("FilterInvalidAlertMsg"), pivotClientObj._getLocalizedLabels("Warning"), pivotClientObj);
                            pivotClientObj._isTimeOut = false;
                            pivotClientObj._waitingPopup.hide();
                            return false;
                        }
                    }
                }
                else {
                    if ($(".e-memberEditorDiv").length > 0 && e.target.id == "OKBtn") {
                        if (pivotClientObj.element.find(".e-editorTreeView").find("li span.e-searchfilterselection").length > 0)
                            pivotClientObj.element.find(".e-editorTreeView").ejTreeView("removeNode", pivotClientObj.element.find(".e-editorTreeView").find("li span.e-searchfilterselection").closest("li"));
                        if (pivotClientObj.model.enableAdvancedFilter && pivotClientObj._excelFilterInfo.length > 0) {
                            pivotClientObj._removeFilterTag(pivotClientObj._selectedFieldName);
                            if (pivotClientObj._selectedLevelUniqueName)
                                pivotClientObj._removeFilterTag(pivotClientObj._selectedLevelUniqueName);
                        }
                        if ((pivotClientObj._currentItem.indexOf(pivotClientObj._getLocalizedLabels("Measures")) < 0))
                            ej.Pivot.updateTreeView(pivotClientObj);
                        if (!pivotClientObj.model.enableMemberEditorPaging && ej.Pivot._getSelectedTreeState(pivotClientObj._currentAxis == "Slicers" ? true : false, pivotClientObj) == "" && pivotClientObj._args_innerHTML != pivotClientObj._getLocalizedLabels("Measures") && pivotClientObj._args_innerHTML != "ToolbarButtons")
                            return false;
                        if ((pivotClientObj._currentItem.indexOf(pivotClientObj._getLocalizedLabels("Measures")) < 0)) {
                            if (pivotClientObj._currentReportItems.length != 0) {
                                var nodeContain = false;
                                for (var i = 0; i < pivotClientObj._currentReportItems.length; i++) {
                                    if (pivotClientObj._currentReportItems[i] == pivotClientObj._currentItem) {
                                        nodeContain = true;
                                        break;
                                    }
                                }
                            }
                            if (!nodeContain || pivotClientObj._currentReportItems.length == 0)
                                pivotClientObj._currentReportItems.push(pivotClientObj._currentItem);
                            pivotClientObj._treeViewData[pivotClientObj._currentItem] = pivotClientObj._memberTreeObj.dataSource();
                        }
                    }
                    var unselectedNodes = null;
                    if (pivotClientObj._args_innerHTML != "ToolbarButtons") {
                        if (!pivotClientObj._isMembersFiltered && !pivotClientObj.model.enableMemberEditorPaging) {
                            pivotClientObj.element.find(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog), .e-clientDialog").remove();
                            ej.Pivot.closePreventPanel(pivotClientObj);
                            return;
                        }
                        else if (pivotClientObj._args_innerHTML == pivotClientObj._getLocalizedLabels("Measures"))
                            unselectedNodes = "Measures:" + pivotClientObj._getMeasuresList();
                        else if (pivotClientObj._args_innerHTML != "ToolbarButtons" && pivotClientObj._args_innerHTML != undefined) {
                            ej.Pivot.updateTreeView(pivotClientObj);
                            //unselectedNodes = pivotClientObj._getUnSelectedNodes() + "CHECKED" + pivotClientObj._getSelectedNodes(pivotClientObj._currentAxis == "Slicers" ? true : false);
                            unselectedNodes = ((pivotClientObj._args_innerHTML == "KPIs") ? pivotClientObj._getUnSelectedNodes() : ej.Pivot._getUnSelectedTreeState(pivotClientObj)) + "CHECKED" + ((pivotClientObj._args_innerHTML == "KPIs") ? pivotClientObj._getSelectedNodes(pivotClientObj._currentAxis == "Slicers" ? true : false) : ej.Pivot._getSelectedTreeState(pivotClientObj._currentAxis == "Slicers" ? true : false, pivotClientObj));
                        }
                        pivotClientObj._isTimeOut = true;
                        setTimeout(function () {
                            if (pivotClientObj._isTimeOut)
                                pivotClientObj._waitingPopup.show();
                        }, 800);
                        if (pivotClientObj._args_innerHTML == pivotClientObj._getLocalizedLabels("Measures") && unselectedNodes != null && unselectedNodes.split(":")[1] == "") {
                            $(pivotClientObj.element).find(".e-splitBtn").each(function (index, value) {
                                if (value.firstChild.innerHTML == pivotClientObj._getLocalizedLabels("Measures"))
                                    $(value).remove();
                            });
                        }
                        $(pivotClientObj).find(".e-dialog").hide();
                        if (pivotClientObj.model.enableMemberEditorPaging && pivotClientObj._args_innerHTML != pivotClientObj._getLocalizedLabels("Measures") && pivotClientObj._args_innerHTML != pivotClientObj._getLocalizedLabels("KPIs") && pivotClientObj.element.find(".e-nextPageDiv").length > 0)
                            unselectedNodes = ej.Pivot._getUnSelectedTreeState(pivotClientObj) + "CHECKED" + ej.Pivot._getSelectedTreeState(pivotClientObj._currentAxis == "Slicers" ? true : false, pivotClientObj);
                        if (pivotClientObj.model.beforeServiceInvoke != null)
                            pivotClientObj._trigger("beforeServiceInvoke", { "action": "filtering", element: this.element, customObject: pivotClientObj.model.customObject });
                        var member = ej.Pivot._getEditorMember(pivotClientObj._dimensionName.split(":").length > 1 ? pivotClientObj._dimensionName.split(":")[1] : pivotClientObj._dialogTitle, pivotClientObj, false);
                        pivotClientObj._fieldSelectedMembers[pivotClientObj._dimensionName.split(":").length > 1 ? pivotClientObj._dimensionName.split(":")[1] : pivotClientObj._dialogTitle] = $.map(pivotClientObj._fieldMembers[pivotClientObj._dimensionName.split(":").length > 1 ? pivotClientObj._dimensionName.split(":")[1] : pivotClientObj._dialogTitle], function (item) { if (!item.checked) return item; }).length == 0 ? "All" : ((member != "All" && member != "multiple") ? member : pivotClientObj._getLocalizedLabels("MultipleItems"));
                        if ((pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && pivotClientObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap)) {
                            var reportDropTarget = pivotClientObj.element.find('#reportList').data("ejDropDownList");
                            pivotClientObj._slicerBtnTextInfo[reportDropTarget.selectedIndexValue] = pivotClientObj._fieldSelectedMembers;
                        }
                        pivotClientObj._setSplitBtnTitle();
                        var serializedCustomObject = JSON.stringify(pivotClientObj.model.customObject);
                        pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.filterElement, JSON.stringify({ "action": "filtering", "clientParams": unselectedNodes, "olapReport": pivotClientObj.currentReport, "clientReports": pivotClientObj.reports, "customObject": serializedCustomObject }), pivotClientObj._filterElementSuccess);
                    }
                    else {
                        if (pivotClientObj.element.find(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog) .e-titlebar").first().text() == pivotClientObj._getLocalizedLabels("RemoveReport") && pivotClientObj.reportsCount < 2)
                            pivotClientObj.element.find(".e-dialog").hide();
                        else if ($.trim(pivotClientObj.element.find(".reportName").val()) === "" && pivotClientObj.element.find(".reportName").val() != undefined) {
                            if (pivotClientObj.element.find(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog) .e-titlebar").first().text() == pivotClientObj._getLocalizedLabels("NewReport") || pivotClientObj.element.find(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog) .e-titlebar").first().text() == pivotClientObj._getLocalizedLabels("AddReport") || pivotClientObj.element.find(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog) .e-titlebar").first().text() == pivotClientObj._getLocalizedLabels("RenameReport"))
                                ej.Pivot._createErrorDialog(pivotClientObj._getLocalizedLabels("SetReportNameAlertMsg"), pivotClientObj._getLocalizedLabels("Warning"), pivotClientObj);
                            else
                                ej.Pivot._createErrorDialog(pivotClientObj._getLocalizedLabels("SetReportNameAlertMsg"), pivotClientObj._getLocalizedLabels("Warning"), pivotClientObj);
                            return false;
                        }
                        else {
                            this.reportDropTarget = pivotClientObj.element.find('#reportList').data("ejDropDownList");
                            var reportName = $.trim(pivotClientObj.element.find(".reportName").val()) || this.reportDropTarget.selectedTextValue;
                            var operation = pivotClientObj.element.find(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog) .e-titlebar").first().attr("data-tag");
                            var olapReport = (operation == "New Report" ? "" : pivotClientObj.currentReport);
                            var clientReports = (operation == "New Report" ? "" : pivotClientObj.reports);
                            pivotClientObj._currentRecordName = (operation == "New Report" ? "" : pivotClientObj._currentRecordName);
                            pivotClientObj.element.find(".e-dialog").hide();
                            pivotClientObj._isTimeOut = true;
                            if (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                                pivotClientObj._waitingPopup.show();
                            }
                            else
                                setTimeout(function () { if (pivotClientObj._isTimeOut) pivotClientObj._waitingPopup.show(); }, 800);
                            var repCollection;
                            if (operation == "SaveAs Report" && pivotClientObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                                repCollection = pivotClientObj._updateReportCollection(true);
                            if ((operation == "Add Report" || operation == "New Report" || operation == "Remove Report") && pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                                if (operation == "New Report") {
                                    pivotClientObj._repCol = $.grep(pivotClientObj._repCol, function (value, index) { if (value.CubeName == pivotClientObj.currentCubeName) { value.slicerBtnTextInfo = {}; } });
                                }
                                else if (operation == "Add Report") {
                                    pivotClientObj._slicerBtnTextInfo[this.reportDropTarget.selectedIndexValue] = pivotClientObj._fieldSelectedMembers;
                                    repCollection = pivotClientObj._updateReportCollection(false);
                                }
                                if ((operation == "Remove Report")) {
                                    delete pivotClientObj._slicerBtnTextInfo[this.reportDropTarget.selectedIndexValue];
                                    pivotClientObj._fieldSelectedMembers = pivotClientObj._slicerBtnTextInfo[this.reportDropTarget.selectedIndexValue - 1];
                                }
                                else
                                    pivotClientObj._fieldSelectedMembers = {};
                            }
                            if (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                                var newDataSource = { data: pivotClientObj.model.dataSource.data, reportName: reportName, enableAdvancedFilter: pivotClientObj.model.dataSource.enableAdvancedFilter, columns: [], cube: pivotClientObj.model.dataSource.cube, catalog: pivotClientObj.model.dataSource.catalog, reportName: reportName, rows: [], values: [], filters: [], pagerOptions: pivotClientObj.model.dataSource.pagerOptions };
                                var reportListData = pivotClientObj.element.find(".reportlist").data("ejDropDownList");
                                pivotClientObj.element.find(".reportlist").ejDropDownList("option", "change", ej.proxy(pivotClientObj._reportChanged, pivotClientObj));
                                if ((operation == "New Report" || operation == "Add Report") && pivotClientObj.model.enableVirtualScrolling) {
                                    pivotClientObj._pivotGrid._categPageCount = null;
                                    pivotClientObj._pivotGrid._seriesPageCount = null;
                                }
                                if (operation == "New Report") {
                                    pivotClientObj.model.dataSource = newDataSource;
                                    pivotClientObj._clientReportCollection = [newDataSource];
                                    pivotClientObj.element.find(".reportlist").ejDropDownList("option", "dataSource", [{ name: reportName }]);
                                    reportListData.selectItemByText(reportName);
                                    pivotClientObj._fieldMembers = {};
                                    pivotClientObj._fieldSelectedMembers = {};
                                }
                                else if (operation == "Add Report") {
                                    pivotClientObj.model.dataSource = newDataSource;
                                    pivotClientObj.model.dataSource.reportName = reportName;
                                    var isExistingRpt = $.map(pivotClientObj._clientReportCollection, function (obj, index) { if (obj.reportName == pivotClientObj.model.dataSource.reportName) { return obj; } });
                                    pivotClientObj._clientReportCollection = $.map(pivotClientObj._clientReportCollection, function (obj, index) { if (obj.reportName != pivotClientObj.model.dataSource.reportName) return obj; });
                                    pivotClientObj._clientReportCollection.push(pivotClientObj.model.dataSource);
                                    pivotClientObj._fieldMembers = {};
                                    pivotClientObj._fieldSelectedMembers = {};
                                    if (isExistingRpt.length == 0) {
                                        var reportListData = pivotClientObj.element.find(".reportlist").data("ejDropDownList");
                                        reportListData.model.dataSource.push({ name: reportName });
                                        var rpList = JSON.stringify(reportListData.model.dataSource);
                                        pivotClientObj.element.find(".reportlist").ejDropDownList("option", "dataSource", JSON.parse(rpList));
                                        reportListData.selectItemByText(reportName);
                                    }
                                    else if (pivotClientObj._clientReportCollection.length > 0)
                                        pivotClientObj._reportChanged();

                                }
                                else if (operation == "Rename Report") {
                                    pivotClientObj._clientReportCollection = $.map(pivotClientObj._clientReportCollection, function (obj, index) { if (obj.reportName == pivotClientObj.model.dataSource.reportName) obj.reportName = reportName; return obj; });
                                    var rpList = JSON.stringify(($.map(reportListData.model.dataSource, function (obj, index) { return (obj.name != reportListData.getValue()) ? obj : { name: reportName }; })));
                                    pivotClientObj.model.dataSource.reportName = reportName;
                                    pivotClientObj.element.find(".reportlist").ejDropDownList("option", "dataSource", JSON.parse(rpList));
                                    reportListData.selectItemByText(reportName);
                                    pivotClientObj._currentItem = "";
                                }
                                else if (operation == "Remove Report") {
                                    pivotClientObj._clientReportCollection = $.map(pivotClientObj._clientReportCollection, function (obj, index) { if (obj.reportName != reportName) return obj; });
                                    var currReportIndex = $(reportListData.getSelectedItem()).index() >= pivotClientObj._clientReportCollection.length ? pivotClientObj._clientReportCollection.length - 1 : $(reportListData.getSelectedItem()).index();
                                    pivotClientObj.model.dataSource = pivotClientObj._clientReportCollection[currReportIndex];
                                    var rpList = JSON.stringify($.map(reportListData.model.dataSource, function (obj, index) { if (obj.name != reportListData.getValue()) return obj; }));
                                    pivotClientObj.element.find(".reportlist").ejDropDownList("option", "dataSource", JSON.parse(rpList));
                                    pivotClientObj._fieldMembers = {};
                                    pivotClientObj._fieldSelectedMembers = {};
                                    if (reportListData.model.dataSource.length > 0)
                                        reportListData.selectItemByText(pivotClientObj.model.dataSource.reportName);
                                }
                                else if (operation == "SaveAs Report") {
                                    pivotClientObj._currentRecordName = reportName;
                                    var saveReportSetting = { url: "", reportName: reportName, reportCollection: pivotClientObj._clientReportCollection, mode: pivotClientObj.model.analysisMode, filterCollection: pivotClientObj._currentReportItems }
                                    pivotClientObj._trigger("saveReport", { targetControl: pivotClientObj, saveReportSetting: saveReportSetting });
                                    if (!pivotClientObj.model.enableLocalStorage) {
                                        var serializedCustomObject = JSON.stringify(pivotClientObj.model.customObject);
                                        pivotClientObj.doAjaxPost("POST", saveReportSetting.url + "/" + pivotClientObj.model.serviceMethodSettings.saveReport, JSON.stringify({
                                            "reportName": saveReportSetting.reportName, operationalMode: pivotClientObj.model.operationalMode, analysisMode: pivotClientObj.model.analysisMode, "olapReport": JSON.stringify(pivotClientObj.model.dataSource), "clientReports": (!ej.isNullOrUndefined(repCollection) ? repCollection : JSON.stringify(pivotClientObj._clientReportCollection)) + ":>>:" + JSON.stringify(pivotClientObj._currentReportItems), "customObject": serializedCustomObject
                                        }), pivotClientObj._toolbarOperationSuccess);
                                    }
                                }
                                else if (operation != "Rename Report") {
                                    pivotClientObj.refreshControl();
                                    if (pivotClientObj._pivotSchemaDesigner)
                                        pivotClientObj._pivotSchemaDesigner._refreshPivotButtons();
                                }
                                pivotClientObj._isTimeOut = false;
                                pivotClientObj._waitingPopup.hide();
                            }
                            else {
                                var reportListData = pivotClientObj.element.find(".reportlist").data("ejDropDownList");
                                pivotClientObj._clientReportCollection = $.map(pivotClientObj._clientReportCollection, function (obj, index) {
                                    if (obj.name == reportListData.getValue())
                                        obj.report = olapReport;
                                    return obj;
                                });

                                if (operation == "SaveAs Report") {
                                    pivotClientObj._currentRecordName = reportName;
                                    if (pivotClientObj.model.beforeServiceInvoke != null)
                                        pivotClientObj._trigger("beforeServiceInvoke", { action: "saveReport", element: this.element, customObject: pivotClientObj.model.customObject });
                                    var serializedCustomObject = JSON.stringify(pivotClientObj.model.customObject);
                                    pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.saveReport, JSON.stringify({
                                        "reportName": reportName, operationalMode: pivotClientObj.model.operationalMode, analysisMode: pivotClientObj.model.analysisMode, "olapReport": olapReport, "clientReports": (pivotClientObj.model.analysisMode == "pivot" ? JSON.stringify(pivotClientObj._clientReportCollection) : (!ej.isNullOrUndefined(repCollection) ? repCollection : JSON.stringify(pivotClientObj._clientReportCollection))), "customObject": serializedCustomObject
                                    }), pivotClientObj._toolbarOperationSuccess);
                                }
                                else {
                                    if (pivotClientObj.model.beforeServiceInvoke != null)
                                        pivotClientObj._trigger("beforeServiceInvoke", { action: "toolbarOperation", element: this.element, customObject: pivotClientObj.model.customObject });
                                    var serializedCustomObject = JSON.stringify(pivotClientObj.model.customObject);
                                    if (pivotClientObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                                        pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.toolbarServices, JSON.stringify({
                                            "action": "toolbarOperation", "toolbarOperation": operation, "clientInfo": reportName, "olapReport": olapReport, "clientReports": clientReports, "customObject": serializedCustomObject
                                        }), pivotClientObj._toolbarOperationSuccess);
                                    }
                                    else {
                                        if (operation == pivotClientObj._getLocalizedLabels("NewReport")) {
                                            pivotClientObj._currentReportName = reportName;
                                            pivotClientObj._fieldMembers = {};
                                            pivotClientObj._fieldSelectedMembers = {};
                                        }
                                        else if (operation == pivotClientObj._getLocalizedLabels("AddReport")) {
                                            pivotClientObj._fieldMembers = {};
                                            pivotClientObj._fieldSelectedMembers = {};



                                            reportListData.model.dataSource.push({ name: reportName });
                                            reportListData.selectItemByText(reportName);
                                            pivotClientObj._currentReportName = reportName;
                                        }
                                        else if (operation == pivotClientObj._getLocalizedLabels("RemoveReport")) {
                                            for (var i = 0; i < pivotClientObj._clientReportCollection.length; i++) {
                                                if (pivotClientObj._clientReportCollection[i].name == pivotClientObj._currentReportName)
                                                    pivotClientObj._clientReportCollection.splice(i, 1);
                                            }
                                            var reportListData = pivotClientObj.element.find(".reportlist").data("ejDropDownList");
                                            for (var i = 0; i < reportListData.model.dataSource.length; i++) {
                                                if (reportListData.model.dataSource[i].name == pivotClientObj._currentReportName)
                                                    reportListData.model.dataSource.splice(i, 1);
                                            }
                                            reportListData.selectItemByText(reportListData.model.dataSource[0].name);
                                            olapReport = pivotClientObj._clientReportCollection[0].report;
                                            reportName = pivotClientObj._clientReportCollection[0].name;
                                            pivotClientObj._currentReport = "";
                                            pivotClientObj._currentReportName = reportName;
                                            pivotClientObj._fieldMembers = {};
                                            pivotClientObj._fieldSelectedMembers = {};
                                        }
                                        else if (operation == pivotClientObj._getLocalizedLabels("RenameReport")) {
                                            var report = "";
                                            try { report = JSON.parse(pivotClientObj.getOlapReport()).Report; }
                                            catch (err) { report = pivotClientObj.getOlapReport(); }
                                            pivotClientObj._clientReportCollection = $.map(pivotClientObj._clientReportCollection, function (obj, index) { if (obj.name == pivotClientObj._currentReportName) obj.name = reportName; return obj; });
                                            var reportListData = pivotClientObj.element.find(".reportlist").data("ejDropDownList");
                                            var rpList = JSON.stringify(($.map(reportListData.model.dataSource, function (obj, index) { return (obj.name != reportListData.getValue()) ? obj : { name: reportName, report: report }; })));
                                            pivotClientObj.element.find(".reportlist").ejDropDownList("option", "dataSource", JSON.parse(rpList));
                                            pivotClientObj._isReportListAction = false;
                                            reportListData.selectItemByText(reportName);
                                            pivotClientObj._isReportListAction = true;
                                            pivotClientObj._currentReportName = reportName;
                                            pivotClientObj._isTimeOut = false;
                                            pivotClientObj._waitingPopup.hide();
                                            ej.Pivot.closePreventPanel(pivotClientObj);
                                            return;
                                        }
                                        pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.toolbarServices, JSON.stringify({
                                            action: operation,
                                            args: JSON.stringify({
                                                "clientInfo": reportName, "currentReport": olapReport
                                            }), "customObject": serializedCustomObject
                                        }), pivotClientObj._toolbarOperationSuccess);
                                    }
                                }
                            }
                        }
                    }
                }
                if (pivotClientObj._isTimeOut) pivotClientObj._isTimeOut = false;
                if (pivotClientObj.model.showReportCollection && loadDlgTitle != pivotClientObj._getLocalizedLabels("NewReport") && loadDlgTitle != pivotClientObj._getLocalizedLabels("AddReport") && loadDlgTitle != pivotClientObj._getLocalizedLabels("RenameReport") && loadDlgTitle != pivotClientObj._getLocalizedLabels("RemoveReport") && loadDlgTitle != pivotClientObj._getLocalizedLabels("MemberEditor") && loadDlgTitle != pivotClientObj._getLocalizedLabels("MeasureEditor")) {
                    var data = pivotClientObj.element.find(".e-collectionlist").data("ejDropDownList").model.dataSource.slice();
                    var curName = !ej.isNullOrUndefined(pivotClientObj.element.find(".e-collectionlist").data("ejDropDownList").selectedTextValue) ? pivotClientObj.element.find(".e-collectionlist").data("ejDropDownList").selectedTextValue : "";
                    if (loadDlgTitle == pivotClientObj._getLocalizedLabels("Rename")) {
                        var index = data.indexOf(pivotClientObj.element.find(".reportNameList")[0].value);
                        data[index] = pivotClientObj.element.find(".renameReport").val();
                        curName = pivotClientObj.element.find(".reportNameList")[0].value == curName ? pivotClientObj.element.find(".renameReport").val() : curName;
                    }
                    else if (loadDlgTitle == pivotClientObj._getLocalizedLabels("Remove")) {
                        var index = data.indexOf(pivotClientObj.element.find(".reportNameList")[0].value);
                        data.splice(index, 1);
                    }
                    else {
                        curName = pivotClientObj.element.find(".reportName")[0].value;
                        data.push(pivotClientObj.element.find(".reportName")[0].value);
                    }
                    pivotClientObj.element.find(".e-collectionlist").data("ejDropDownList").option("dataSource", data);
                    curName = ($.inArray(curName, data) == -1) ? "" : curName;
                    if (data.length > 0 && curName != "") {
                        pivotClientObj.element.find(".e-collectionlist").data("ejDropDownList").option("change", "");
                        pivotClientObj.element.find(".e-collectionlist").data("ejDropDownList").selectItemByText(curName);
                        pivotClientObj.element.find(".e-collectionlist").ejDropDownList("option", "change", ej.proxy(pivotClientObj._collectionChange, pivotClientObj));
                    }
                }
                if (pivotClientObj.model.showReportCollection && loadDlgTitle == pivotClientObj._getLocalizedLabels("NewReport") && pivotClientObj.element.find(".e-collectionlist").length > 0)
                    pivotClientObj.element.find(".e-collectionlist").data("ejDropDownList").selectItemByText();
                pivotClientObj.element.find(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog), .e-clientDialog").remove();
                pivotClientObj.element.find("#preventDiv").remove();
            });
            this.element.find(".e-searchEditorTree").click(function (evt) {
                var pivotClientObj = $(this).parents(".e-pivotclient").data("ejPivotClient");
                ej.Pivot._searchEditorTreeNodes(evt, pivotClientObj);
            });

            this.element.find(".e-calcMemberImg").click(function (evt) {
                var pivotClientObj = $(this).parents(".e-pivotclient").data("ejPivotClient");
                if (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ClientMode)
                    pivotClientObj.element.find(".e-calcMemberDialog").remove();
                if (pivotClientObj.element.find(".e-calcMemberDialog").length > 0) {
                    pivotClientObj._calcMemberTreeObj.collapseAll();
                    ej.Pivot.openPreventPanel(pivotClientObj);
                    pivotClientObj._calcMemberDialog.open();
                    pivotClientObj.element.find("#" + pivotClientObj._id + "_captionFieldCM").val("");
                    pivotClientObj.element.find("#" + pivotClientObj._id + "_expressionFieldCM").val("");
                    pivotClientObj.element.find("#" + pivotClientObj._id + "_memberTypeFieldCM").data("ejDropDownList").selectItemsByIndices(0);
                    pivotClientObj.element.find("#" + pivotClientObj._id + "_dimensionFieldCM").data("ejDropDownList").selectItemsByIndices(0);
                    pivotClientObj.element.find("#" + pivotClientObj._id + "_formatFieldCM").data("ejDropDownList").selectItemsByIndices(0);
                    pivotClientObj.element.find("#" + pivotClientObj._id + "_customFormatFieldCM").val("");
                }
                else {
                    pivotClientObj._waitingPopup.show();
                    if (pivotClientObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                        if (pivotClientObj.model.beforeServiceInvoke != null)
                            pivotClientObj._trigger("beforeServiceInvoke", { action: "fetchCalcMemberTreeView", element: pivotClientObj.element, customObject: pivotClientObj.model.customObject });
                        var serializedCustomObject = JSON.stringify(pivotClientObj.model.customObject);
                        pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.fetchMemberTreeNodes, JSON.stringify({ "action": "fetchCalcMemberTreeView", "dimensionName": "calcMember", "olapReport": pivotClientObj.currentReport, "customObject": serializedCustomObject }), ej.proxy(ej.Pivot._createCalcMemberDialog, pivotClientObj));
                    }
                    else {
                        var BlankNode = [];
                        var treeData = pivotClientObj.element.find(".e-schemaFieldTree").data("ejTreeView").model.fields.dataSource;
                        treeData = $.grep(treeData, function (item, index) {
                            if (item.id)
                                item.id = item.id.replace(/\]/g, '_').replace(/\[/g, '_').replace(/\./g, '_').replace(/ /g, '_');
                            if (item.pid)
                                item.pid = item.pid.replace(/\]/g, '_').replace(/\[/g, '_').replace(/\./g, '_').replace(/ /g, '_');
                            if (item.spriteCssClass.indexOf("e-level") > -1) {
                                BlankNode.push({ id: item.id + "_1", pid: item.id, name: "(Blank)", hasChildren: false, spriteCssClass: "" });
                            }
                            return item;
                        });
                        treeData = $.merge(BlankNode, treeData);
                        pivotClientObj._selectedCalcMember = null;
                        var calcTreeview = { CubeTreeInfo: JSON.stringify(treeData) };
                        ej.Pivot._createCalcMemberDialog(calcTreeview, pivotClientObj);
                    }
                }
            });
            //this._on(this.element, "click", ".e-calcMemberImg", ej.proxy(ej.Pivot._createCalcMemberDialog, this)); 
            this.element.find(".e-unCheckAll,.e-checkAll").click(function (evt) {
                var pivotClientObj = $(this).parents(".e-pivotclient").data("ejPivotClient");
                var treeElement = pivotClientObj.element.find(".e-editorTreeView");
                var searchElement = null;
                if (evt.target.className.indexOf("e-checkAll") > -1) {
                    if (pivotClientObj._isOptionSearch) {
                        searchElement = $(treeElement).find("li[data-isItemSearch='true']");
                        if (searchElement.length > 0) {
                            $(searchElement).each(function (index, item) {
                                $(treeElement).ejTreeView("checkNode", $(item));
                            });
                        }
                    }
                    else
                        $(treeElement).ejTreeView("checkAll");
                    if ($(treeElement).find("li").length > 0 && $(treeElement).find("li").find("span.e-checkmark").length > 0) {
                        pivotClientObj.element.find(".e-dialogOKBtn").data("ejButton").enable();
                        pivotClientObj.element.find(".e-dialogOKBtn").removeAttr("disabled");
                        pivotClientObj._isMembersFiltered = true;
                    }
                    if (pivotClientObj.model.enableMemberEditorPaging || pivotClientObj._editorTreeData.length > 0) {
                        setTimeout(function () {
                            pivotClientObj._waitingPopup.show();
                            if (pivotClientObj._editorSearchTreeData.length > 0)
                                for (var i = 0; i < pivotClientObj._editorSearchTreeData.length; i++) {
                                    $(pivotClientObj._editorTreeData).each(function (index, item) {
                                        if (pivotClientObj._editorSearchTreeData[i].id == item.id) {
                                            pivotClientObj._editorSearchTreeData[i].checkedStatus = true;
                                            item.checkedStatus = true;
                                            return false;
                                        }
                                    });
                                }
                            else
                                $(pivotClientObj._editorTreeData).each(function (index, item) { item.checkedStatus = true; });
                            pivotClientObj._waitingPopup.hide();
                        }, 0);
                    }
                }
                else {
                    if (pivotClientObj._isOptionSearch) {
                        searchElement = $(treeElement).find("li[data-isItemSearch='true']");
                        if (searchElement.length > 0) {
                            $(searchElement).each(function (index, item) {
                                $(treeElement).ejTreeView("uncheckNode", $(item));
                            });
                        }
                    }
                    else if (pivotClientObj.model.enableMemberEditorPaging && $(treeElement).find("li span.e-searchfilterselection").length > 0) {
                        $(treeElement).ejTreeView("unCheckAll");
                        if (pivotClientObj._isSelectSearchFilter) $(treeElement).find("li span.e-searchfilterselection").closest("li").find("span.e-chk-image").removeClass("e-stop").addClass("e-checkmark");
                        else
                            $(treeElement).find("li span.e-searchfilterselection").closest("li").find("span.e-chk-image").removeClass("e-checkmark").removeClass("e-stop");
                    }
                    else
                        $(treeElement).ejTreeView("unCheckAll");
                    if (($(treeElement).find("li").length > 0 && (!$(treeElement).find("li").find("span.e-checkmark").length > 0)) || ($(treeElement).find("li").length > 0 && ($(treeElement).find("li").find("span.e-checkmark").length == 1 && $(treeElement).find("li span.e-searchfilterselection").closest("li").find("span.e-checkmark").length > 0))) {
                        pivotClientObj.element.find(".e-dialogOKBtn").data("ejButton").disable();
                        pivotClientObj.element.find(".e-dialogOKBtn").attr('disabled', 'disabled');
                    }
                    if (pivotClientObj.model.enableMemberEditorPaging || pivotClientObj._editorTreeData.length > 0) {
                        setTimeout(function () {
                            pivotClientObj._waitingPopup.show();
                            if (pivotClientObj._editorSearchTreeData.length > 0)
                                for (var i = 0; i < pivotClientObj._editorSearchTreeData.length; i++) {
                                    $(pivotClientObj._editorTreeData).each(function (index, item) {
                                        if (pivotClientObj._editorSearchTreeData[i].id == item.id) {
                                            pivotClientObj._editorSearchTreeData[i].checkedStatus = false;
                                            item.checkedStatus = false;
                                            return false;
                                        }
                                    });
                                }
                            else
                                $(pivotClientObj._editorTreeData).each(function (index, item) { item.checkedStatus = false; });
                            $(pivotClientObj._editorTreeData).each(function (index, item) {
                                if (item.checkedStatus) {
                                    pivotClientObj.element.find(".e-dialogOKBtn").data("ejButton").enable();
                                    pivotClientObj.element.find(".e-dialogOKBtn").removeAttr("disabled");
                                    pivotClientObj._isMembersFiltered = true;
                                    return false;
                                }
                            });
                            pivotClientObj._waitingPopup.hide();
                        }, 0);
                    }
                }
            });
        },
        _generateCalculatedMember: function (ths, args) {
            var data = $(args).find("Axis:eq(0) Tuple"), treeViewData = [], treeNodeInfo = {};
            for (var i = 0; i < data.length; i++) {
                var memberUqName = $($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children().children()[0]).text(),
                    memberName = $($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children().children()[1]).text() == "" ? "(Blank)" : $($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children().children()[1]).text();

                treeNodeInfo = {
                    hasChildren: $(data[i]).find("CHILDREN_CARDINALITY").text() != "0",
                    checkedStatus: true,
                    id: memberUqName.replace(/\]*\]/g, '-').replace(/\[*\[/g, '-').replace(/ /g, "_").replace(/&/g, "_"),
                    name: memberName,
                    tag: memberUqName,
                    level: parseInt($(data[i]).find("LNum").text())
                };
                treeViewData.push(treeNodeInfo);
            }
            var treeObj = this.element.find(".e-cubeTreeViewCalcMember").data("ejTreeView");
            var obj = treeViewData;
            treeObj.addNodes(obj, this._calcExpanded.id);
            for (var i = 0; i < obj.length; i++) {
                if (i == 0)
                    treeObj.element.find("#" + this._calcExpanded.id).find("li:eq(0)").remove();
                var tag = obj[i].tag;
                treeObj.element.find("#" + this._calcExpanded.id).find("li:eq(" + i + ")").attr("data-tag", tag);
            }
            this._waitingPopup.hide();
        },
        _updateReportCollection: function (isSaveRpt) {
            var ind = -1, reportList, cubeList, curRep, cubeIndex, currentReport, reports, cubeName, repCollection;
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                cubeName = this.model.dataSource.cube;
                currentReport = jQuery.extend(true, {}, this.model.dataSource);
                reports = JSON.parse(JSON.stringify(this._clientReportCollection));
            }
            else {
                cubeName = this.currentCubeName;
                currentReport = this.currentReport;
                reports = this.reports;
            }
            reportList = this.element.find('#reportList').data("ejDropDownList");
            if (!ej.isNullOrUndefined(this._pivotSchemaDesigner) && this._pivotSchemaDesigner.element.find(".cubeList").length > 0) {
                cubeList = this._pivotSchemaDesigner.element.find(".cubeList").data("ejDropDownList");
                this._repCol = this._pivotSchemaDesigner._repCollection;
            }
            else {
                cubeList = this.element.find('#cubeSelector').data("ejDropDownList");
            }
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                this._slicerBtnTextInfo[reportList.selectedIndexValue] = this._fieldSelectedMembers;
            curRep = { "CubeName": cubeName, "CurrentReport": currentReport, "Reports": reports, "ReportIndex": reportList.selectedIndexValue, "ReportList": JSON.parse(JSON.stringify(reportList.model.dataSource)), _fieldSelectedMembers: this._fieldSelectedMembers, slicerBtnTextInfo: this._slicerBtnTextInfo, calculatedMembers: this.model.calculatedMembers };
            $.map(this._repCol, function (value, index) {
                if (value.CubeName == cubeName)
                    ind = index;
            });
            if (ind != -1) {
                this._repCol[ind] = curRep;
                cubeIndex = ind;
            }
            else {
                cubeIndex = this._repCol.length;
                this._repCol.push(curRep);
            }
            if (isSaveRpt)
                this._repCol.push({ "cubeIndex": cubeIndex });
            repCollection = JSON.stringify(this._repCol);
            return repCollection;
        },

        _getLocalizedLabels: function (property) {
            return (ej.isNullOrUndefined(ej.PivotClient.Locale[this.locale()]) || ej.PivotClient.Locale[this.locale()][property] == undefined) ? ej.PivotClient.Locale["en-US"][property] : ej.PivotClient.Locale[this.locale()][property];
        },

        _unWireEvents: function () {
            $(this.element.find(".e-dialogCancelBtn, .e-dialogOKBtn, .e-newReportImg, .e-addReportImg, .e-removeReportImg, .e-renameReportImg, .e-pvtBtn, .e-removeSplitBtn, .e-unCheckAll, .e-checkAll, .e-removeMeasure, .e-toggleCollapseButton, .e-toggleExpandButton, .e-reportDBImg, .e-saveAsReportImg, .e-saveReportImg, .e-loadReportImg, .e-removeDBReportImg, .e-renameDBReportImg, .e-mdxImg,.maximizedView,.e-colSortFilterImg, .e-rowSortFilterImg, .e-chartTypesImg, .e-toggleaxisImg, .e-autoExecuteImg, .e-nextPage, .e-prevPage, .e-firstPage, .e-lastPage, .e-searchEditorTree, .e-calcMemberImg, .e-excelExportImg, .e-wordExportImg, .e-pdfExportImg")).off(ej.eventType.click);
            $(this.element.find(".e-dialogCancelBtn, .e-dialogOKBtn, .e-newReportImg, .e-addReportImg, .e-removeReportImg, .e-renameReportImg, .e-pvtBtn, .e-removeSplitBtn, .e-unCheckAll, .e-checkAll, .e-removeMeasure, .e-toggleCollapseButton, .e-toggleExpandButton, .e-reportDBImg, .e-saveAsReportImg, .e-saveReportImg, .e-loadReportImg, .e-removeDBReportImg, .e-renameDBReportImg, .e-mdxImg,.maximizedView,.e-colSortFilterImg, .e-rowSortFilterImg, .e-chartTypesImg, .e-toggleaxisImg,.e-autoExecuteImg, .e-nextPage, .e-prevPage, .e-firstPage, .e-lastPage, .e-searchEditorTree,.e-calcMemberImg,  .e-excelExportImg, .e-wordExportImg, .e-pdfExportImg")).off('click');
            $(document).find(".e-winCloseBtn").off(ej.eventType.click);
            $(this._off(this.element, "mouseup", ".e-parentsplit"));
            this._off(this.element, "click", "#preventDiv");
            $(document).find(".e-winCloseBtn").off('click');
            this._off($(document), 'click', this._removeDialog);
            this._off($(document), 'keydown', this._keyPressDown);
            this._off($(document), 'keyup', this._keyPressUp);
            this._off(this.element.find("a.e-linkPanel"), "click", ej.Pivot._editorLinkPanelClick);
            this._off(this.element, "click", ".e-memberAscendingIcon, .e-memberDescendingIcon", ej.proxy(ej.Pivot._memberSortBtnClick, this));
            if (this.model.isResponsive)
                $(window).off('resize', $.proxy(this._reSizeHandler, this));
        },
        _calculateHeight: function () {
            $(this.element).height($(this.element).height() < 450 ? 450 : $(this.element).height());
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                var ctrlPanelHeight = this.element.height() - ((this.element.find("div.e-titleText").length > 0 ? 50 : 0) + this.element.find("#reportToolbar").height() + 5);
                this.element.find(".oClientTbl").css("height", ctrlPanelHeight + "px");
                this.element.find(".e-outerTable").css("height", ctrlPanelHeight + "px");
                if (this.model.enableVirtualScrolling) {
                    this.element.find(".e-controlPanel").css("height", (ctrlPanelHeight - 25) + "px");
                    this._pivotGrid._applyVScrolling();
                }
                else if (this.model.enablePaging) {
                    if (this.model.displaySettings.controlPlacement == ej.PivotClient.ControlPlacement.Tab) {
                        this.element.find(".e-controlPanel").height(ctrlPanelHeight - this.element.find("#" + this._id + "_Pager").height());
                        if (this.model.isResponsive) this.element.find("#" + this._id + "_Pager").css({ "margin-top": "-1px" });
                    }
                    else
                        this.element.find(".e-controlPanel").height(ctrlPanelHeight - this.element.find("#" + this._id + "_Pager").height() - 5);
                }
                else
                    this.element.find(".e-controlPanel").css("height", ctrlPanelHeight + "px");
                this.element.find(".e-cubeTable").css("height", ((this.element.height() - ((this.element.find("div.e-titleText").length > 0 ? 50 : 0) + this.element.find("#reportToolbar").height() + this.element.find(".e-csHeader").height() + 38)) + "px"));
                cdbHeight = this.element.height() - ((this.element.find("div.e-titleText").length > 0 ? 50 : 0) + this.element.find("#reportToolbar").height() + this.element.find(".e-csHeader").height() + 38);
                this.element.find(".e-cubeBrowser").css("height", (cdbHeight + 7) - this.element.find(".e-cdbHeader").height());
                this.element.find(".e-cubeTreeView").height((this.element.find(".e-cubeBrowser").height() - this.element.find(".e-cubeName").height()) - (7 + (this.model.enableMeasureGroups ? (this.element.find(".measureGroupselector").height() + 13) : 0)));
                aebHeight = cdbHeight - ((this.element.find(".e-axisHeader").height() * 3) + (this.model.enableSplitter ? 8 : 4));
                this.element.find(".e-categoricalAxis, .e-rowAxis, .e-slicerAxis").css("height", ((aebHeight / 3) + "px"));
                if (this.model.enableSplitter)
                    this.element.find(".e-serversplitresponsive").height(this.element.height() - ((this.element.find("div.e-titleText").length > 0 ? 50 : 0) + this.element.find("#reportToolbar").height() + this.element.find(".e-csHeader").height() + 30));
            }
            else {
                var ctrlPanelHeight = this.element.height() - ((this.element.find("div.e-titleText").length > 0 ? 50 : 0) + this.element.find("#reportToolbar").height() + 5);
                this.element.find(".e-outerTable, .controlPanelTD").css("height", ctrlPanelHeight + "px");
                if (this.model.enableVirtualScrolling) {
                    this.element.find(".e-controlPanel").height(ctrlPanelHeight - 15);
                    if (this.model.displaySettings.mode != ej.PivotClient.DisplayMode.ChartOnly)
                        this._pivotGrid._applyVScrolling();
                }
                else if (this.model.enablePaging) {
                    if (this.model.displaySettings.controlPlacement == ej.PivotClient.ControlPlacement.Tab)//||this.model.displaySettings.mode==ej.pivotClient.DisplayMode.GridOnly
                        this.element.find(".e-controlPanel").height(ctrlPanelHeight - this.element.find("#" + this._id + "_Pager").height());
                    else
                        this.element.find(".e-controlPanel").height(ctrlPanelHeight - this.element.find("#" + this._id + "_Pager").height() - 5);
                }
                else
                    this.element.find(".e-controlPanel").height(ctrlPanelHeight);
                this.element.find("#" + this._id + "_PivotSchemaDesigner").height(ctrlPanelHeight);
                this._pivotSchemaDesigner._reSizeHandler();
                if (this.enableTogglePanel() && this.element.find(".pivotFieldList").length > 0) {
                    this.element.find("div.e-togglePanel").remove();
                    if (this.model.enableRTL)
                        this.element.find(".e-pivotschemadesigner").css({ "margin-left": "0px", "margin-right": "0px" });
                    this.element.find(".e-controlPanel").width(this.element.width() - ((this.element.width() / 3) + (this.model.enableVirtualScrolling ? 39 : 20)));//this.element.find("#" + this._id + "_PivotSchemaDesigner").parents("td:eq(0)").height() - 30
                    $(ej.buildTag("div.e-togglePanel", ej.buildTag("div.e-toggleExpandButton e-icon", "", {}).attr("aria-label", "toggle expanded")[0].outerHTML + ej.buildTag("div.e-toggleCollapseButton e-icon", {}, { "display": "none" }).attr("aria-label", "toggle collapsed")[0].outerHTML)[0].outerHTML).appendTo(this.element.find(".pivotFieldList").parent());
                    this.element.find(".e-togglePanel").height((this.element.height() - ((this.element.find("div.e-titleText").length > 0 ? 50 : 0) + this.element.find("#reportToolbar").height() + 5)) + "px").width(14);
                    this.element.find(".e-toggleExpandButton,.e-toggleCollapseButton").css("margin-top", (this.element.find("#" + this._id + "_PivotSchemaDesigner").parents("td:eq(0)").height() - 9) / 2);
                    this.element.find(".e-togglePanel").children().addClass("e-toggleButtons");
                    if (this.model.enableRTL)
                        this.element.find(".e-pivotschemadesigner").css({ "margin-left": "2px", "margin-right": "4px" });
                    this._unWireEvents();
                    this._wireEvents();
                }
            }
            if (this.displayMode() != ej.PivotClient.DisplayMode.ChartOnly) {
                if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == ej.PivotClient.DisplayMode.ChartAndGrid) {
                    if (this.model.enableVirtualScrolling)
                        this.element.find(".e-controlPanel").height(this.element.find(".e-controlPanel").height() - 5);
                    if (this.defaultView() == ej.PivotClient.DefaultView.Grid)
                        this.element.find(".e-gridContainer").height((this.element.find(".e-controlPanel").height() / 2) - 10);
                    else
                        this.element.find(".e-gridContainer").height((this.element.find(".e-controlPanel").height() / 2) - 10);
                }
                else {
                    if (this.displayMode() == ej.PivotClient.DisplayMode.GridOnly) {
                        if (this.model.enablePaging)
                            this.element.find(".e-gridContainer").height(this.element.find(".e-controlPanel").height() - 10);
                        else
                            this.element.find(".e-gridContainer").height(this.element.find(".e-controlPanel").height() - 20);
                    }
                    else {
                        if (this.model.enableVirtualScrolling)
                            this.element.find(".e-gridContainer").height(this.element.find(".e-controlPanel").height() - (this.element.find("ul.clientTab").height() + 30));
                        else {
                            if(this.model.isResponsive)
                                this.element.find(".e-gridContainer").height(this.element.find(".e-controlPanel").height() - (this.element.find("ul.clientTab").height() + 19));
                            else
                                this.element.find(".e-gridContainer").height(this.element.find(".e-controlPanel").height() - (this.element.find("ul.clientTab").height() + 15));
                        }
                    }
                }
            }
            if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == ej.PivotClient.DisplayMode.ChartAndGrid) {
                    if (this.defaultView() == ej.PivotClient.DefaultView.Grid) {
                        if (this.model.isResponsive) {
                            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                                this.element.find(".e-chartContainer").height((this.element.find(".e-controlPanel").height() / 2) - 10);
                            else
                                this.element.find(".e-chartContainer").height((this.element.find(".e-controlPanel").height() / 2) - 15);
                        }
                        else
                            this.element.find(".e-chartContainer").height((this.element.find(".e-controlPanel").height() / 2) - 10);
                    }
                    else
                        this.element.find(".e-chartContainer").height((this.element.find(".e-controlPanel").height() / 2) - 15);
                }
                else {
                    if (this.displayMode() == ej.PivotClient.DisplayMode.ChartOnly)
                     {
                     if (this.model.isResponsive)
                     this.element.find(".e-chartContainer").height(this.element.find(".e-controlPanel").height() - 25);
                     else
                     this.element.find(".e-chartContainer").height(this.element.find(".e-controlPanel").height() - 17);
                   }
                    else {
                        var diffHeight = this.element.find(".e-controlPanel").height() - (this.element.find("ul.clientTab").height() + 20);
                        if (this.model.enableVirtualScrolling)
                            this.element.find(".e-chartContainer").height(diffHeight - 5);
                        else {
                            if (this.model.isResponsive)
                                this.element.find(".e-chartContainer").height(diffHeight - 4);
                            else
                            this.element.find(".e-chartContainer").height(diffHeight - 2);
                        }
                    }
                }
            }
            var containerHeight = this.element.find(".e-chartContainer").height();
            this._chartHeight = this.model.enableToolBar ? containerHeight - 68 + "px" : ((this.model.isResponsive && this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == ej.PivotClient.DisplayMode.ChartAndGrid) ? (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? ((containerHeight + 10) + "px") : ((containerHeight - 5) + "px")) : (containerHeight - 3) + "px");
            this._gridHeight = this.model.enableToolBar ? this.element.find(".e-gridContainer").height() - 46 + "px" : this.element.find(".e-gridContainer").height() - 10 + "px"//+ "px";
            if (this.model.enableToolBar) {
                this.element.find("#" + this._id + "_PivotGridToolbar").height(this._gridHeight);
                this.element.find("#" + this._id + "_PivotCharttoolBar").height(this._chartHeight);
            }
        },
        _performToggleAction: function (styles) {
            this.element.find(".e-controlPanel").width(styles[0].controlPanelWidth);
            if ((this.controlPlacement() != "horizontal") || (this.controlPlacement() == "horizontal" && this.displayMode() == "chartOnly") ||
                this.controlPlacement() == "horizontal" && this.displayMode() == "gridOnly") {
                this.element.find(".e-pivotchart").width(styles[0].chartOuterWidth);
                this.element.find(".e-pivotgrid").width(styles[0].gridOuterWidth);
                this.element.find("#" + this._id + "_PivotChart").css({ "width": styles[0].chartOuterWidth, "overflow": "" });
                this.element.find("#" + this._id + "_PivotGrid").css({ "width": styles[0].gridOuterWidth });
                if (this.model.enableVirtualScrolling) {
                    this._pivotGrid._applyVScrolling();
                }
                if (!ej.isNullOrUndefined(this._pivotChart) || !ej.isNullOrUndefined(this.otreemapObj)) {
                    if (this.element.find("#" + this._pivotChart._id).hasClass("e-pivotchart")) {
                        this.element.find("#" + this._pivotChart._id).ejPivotChart("option", "width", styles[0].chartOuterWidth + "px");
                        this.chartObj = this.element.find("#" + this._pivotChart._id + "Container").data("ejChart");
                        if (!ej.isNullOrUndefined(this.chartObj)) {
                            this.element.find("#" + this.chartObj._id).ejChart("option", { "model": { size: { width: styles[0].chartOuterWidth + "px" } } });
                            this.element.find("#" + this.chartObj._id + "_svg").width(styles[0].chartOuterWidth);
                            this.chartObj.redraw();
                        }
                    }
                    else if (this.element.find("#" + this._pivotChart._id).hasClass("e-pivottreemap") && this.model.enablePivotTreeMap && !ej.isNullOrUndefined(this.otreemapObj))
                        this.otreemapObj._treeMap.refresh();
                }
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && this._toggleExpand && !ej.isNullOrUndefined(this.chartObj)) {
                    this.element.find("#" + this._id + "_PivotChartContainer").css("width", this.chartObj.model.size.width);
                    this.chartObj.redraw();
                }
                if (this.model.enableToolBar) {
                    this.element.find("#" + this._id + "_PivotCharttoolBar").width(this.element.find(".e-chartContainer").width());
                    this.element.find("#" + this._id + "_PivotGridToolbar").width(this.element.find(".e-gridContainer").width() - 10);
                    this.element.find(".e-chartToolBar").width(this.element.find(".e-chartContainer").width());
                    this.element.find(".e-toolBar").width(this.element.find(".e-gridContainer").width());
                }
            }
        },

        _rwdToggleExpand: function () {
            this.element.find(".e-csHeader, .e-cubeTable,.e-pivotschemadesigner,.e-toggleExpandButton").show();
            this.element.find(".e-toggleCollapseButton").hide();
            this.element.find(".e-toggleText").hide();
            this._calculateHeight();
            if(this.model.displaySettings.enableFullScreen)
            this.element.find("#" + this._id + "_PivotGrid").css("width", "");
            if (this._parentElwidth < 850) {
                this.element.find(".e-outerTable").css({ "position": "absolute", "float": (this.model.enableRTL ? "right" : "left"), "tableLayout": "auto", "z-index": "10000" });
                this.element.find(".pivotFieldList").width("91%");
                this.element.find("table.e-cubeTable").css({ "width": "71%" });
                this.element.find(".e-csHeader").css({ "width": "100%" });
                this.element.find("#cubeSelector_wrapper").css({ "width": "100%" });
                this.element.find(".controlPanelTD").css({ "width": (this.element.find(".oClientTbl").width() - this.element.find("table.e-cubeTable").width()), "float": (this.model.enableRTL ? "left" : "right"), "left": (this.model.enableRTL ? "0px" : "15px"), "right": (this.model.enableRTL ? "15px" : "0px"), "position": "relative" });
                this.element.find(".e-controlPanel").css({ "width": this.element.find(".controlPanelTD").width() - 20 });

            }

            if (this._parentElwidth > 850) {
                this.element.find(".controlPanelTD").css({ "width": "56%", "left": "inherit", "float": "left", "margin-left": "5px" });
                this.element.find("table.e-cubeTable").css({ "width": "98%" });
                this.element.find(".e-outerTable,.controlPanelTD").css({ "position": "inherit" });
                if (this._currentTab == "grid" || this._currentTab == "chart")
                    $(".e-controlPanel").width(($("#" + this._id).width() * 55 / 100) + "px");
                else
                    $(".e-controlPanel").width("100%");

                if (window.navigator.userAgent.indexOf('Trident') > 0) {
                    this.element.find(".e-outerTable").width($("#" + this._id).width() * 43 / 100);// + "px";
                    this.element.find(".e-csHeader").width(($("#" + this._id).width() * 41 / 100) + "px");
                    this.element.find("#cubeSelector_wrapper").width(($("#" + this._id).width() * 29 / 100 - 60) + "px");
                    if (!this.model.enableSplitter)
                    this.element.find(".cubeTableTD, .e-cubeBrowser, .e-cdbHeader").css({ "width": (($(".e-cubeTable").width() / 2) - 4) + "px" });
                    if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == "chartandgrid")
                        this.element.find(".e-gridPanel").width(($("#" + this._id).width() * 56 / 100) + "px");
                }
                else {
                    this.element.find(".e-outerTable").css({ "width": ($("#" + this._id).width() * (this.model.enableVirtualScrolling ? 41 : 42) / 100) + "px", "tableLayout": "auto" });
                    this.element.find(".e-csHeader").css({ "width": ($("#" + this._id).width() * 42 / 100) + "px" });
                    this.element.find("#cubeSelector_wrapper").css({ "width": ($("#" + this._id).width() * 32 / 100 - 60) + "px" });
                    if(!this.model.enableSplitter)
                    this.element.find(".cubeTableTD, .e-cubeBrowser, .e-cdbHeader").css({ "width": (($(".e-cubeTable").width() / 2)-4) + "px" });
                    if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == "chartandgrid")
                        this.element.find(".e-gridPanel").css({ "width": ($("#" + this._id).width() * 55 / 100) + "px" });
                }

            }
            if (this.model.enableVirtualScrolling)
                this._pivotGrid._applyVScrolling();
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.enableVirtualScrolling && this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == "chartandgrid") {
                this.element.find(".e-gridContainer").height((this.element.find(".e-controlPanel").height() / 2) - 5);
                this.element.find(".e-chartContainer").height((this.element.find(".e-controlPanel").height() / 2) - 10).css("overflow", "");
            }
            if (this.displayMode() != "gridonly") {
                if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == "chartandgrid") {
                    this.element.find(".e-gridPanel").width($(".e-controlPanel").width() + 8)
                    if (!this.model.enableToolBar)
                        $("#" + this._pivotChart._id).width($(".e-controlPanel").width() - 7);
                    else
                        $("#" + this._pivotChart._id).width($(".e-controlPanel").width() - 30);
                    if (this.model.isResponsive && this._currentTab == "chart")
                        this.element.find(".e-chartContainer").css({ "width": "98.8%" });
                }
                else {
                    $("#" + this._pivotChart._id).width($(".e-controlPanel").width() - 12);
                }
                this.chartObj = null;
                this.chartObj = this.element.find("#" + this._pivotChart._id + "Container").data("ejChart");
                if (!ej.isNullOrUndefined(this.chartObj) && this.model.displaySettings.enableFullScreen)
                {
                this.chartObj.model.size.width = this.element.find(".e-chartContainer").width()-7;
                this.chartObj.model.size.height = this.element.find(".e-chartContainer").height();
                this.element.find("#" + this._pivotChart._id + "Container").width(this.chartObj.model.size.width);
                }
                if (ej.isNullOrUndefined(this.chartObj) && this.model.enablePivotTreeMap && !ej.isNullOrUndefined(this.otreemapObj))
                    this.chartObj = this.element.find("#" + this.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                if (!ej.isNullOrUndefined(this.chartObj)) {
                    if ((this.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                        this.otreemapObj._treeMap.refresh();
                    }
                    else {
                        this.chartObj.redraw();
                    }
                }
            }
            this._overflow();
            if (this.displayMode() != ej.PivotClient.DisplayMode.ChartOnly) {
                if (this._pivotGrid.element.length > 0)
                    this._pivotGrid._applyFrozenHeaderWidth(this._pivotGrid._JSONRecords);
            }
        },

        _overflow: function () {
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                this.element.find(".e-ellipse").remove();
                if (this.element.find(".e-cdbHeader")[0].scrollHeight > this.element.find(".e-cdbHeader")[0].offsetHeight) {
                    this.element.find(".e-cdbHeader").attr('title', this.element.find(".e-cdbHeader").text())
                    this.element.find(".e-cdbHeader").after("<span class='e-ellipse' style='margin-top:-" + this.element.find(".e-cdbHeader").height() * 78 / 100 + "px'>....</span>");
                }
                else
                    this.element.find(".e-cdbHeader").removeAttr('title')
            }
        },

        _rwdToggleCollapse: function () {
            if (this._parentElwidth < 850) {
                this.element.find(".e-outerTable").css({ "position": "absolute" });
                this.element.find(".controlPanelTD").css({ "left": (this.model.enableRTL ? "0px" : "35px"), "right": (this.model.enableRTL ? "35px" : "0px"), "position": "relative" });
            }
            if (this._currentTab == "grid") {
                $(".e-controlPanel").css({ "width": $("#" + this._id).width() * 91 / 100 + "px" });
            }
            else if(this.displayMode() == ej.PivotClient.DisplayMode.ChartOnly)
               this.element.find(".e-controlPanel").css({ "width": $("#" + this._id).width() * 91 / 100 + "px" });
            else
               this.element.find(".e-controlPanel").css({ "width": "100%" });
            if (this.model.displaySettings.enableFullScreen)
                this.element.find("#" + this._id + "_PivotGrid").css("width", "");
            if (this.displayMode() == "chartandgrid") {
                if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile)
                    this.element.find(".e-gridPanel").css({ "width": $("#" + this._id).width() * 92.65 / 100 + "px" });			
                $(".e-controlPanel").css({ "width": $("#" + this._id).width() * 91 / 100 + "px" });
            }
            //this.element.find(".e-chartPanel").css({ "width": "99%" });
            this.element.find(".e-csHeader, .e-cubeTable, .e-pivotschemadesigner,.e-toggleExpandButton").hide();
            //this.element.find(".controlPanelTD").css({ "left": (this.model.enableRTL ? "0" : "4%"), "right": (this.model.enableRTL ? "4%" : "0px"),"position": "relative", "width": "95%", "tableLayout": "fixed", "float": "" });
            this.element.find(".controlPanelTD").css({ "left": (this.model.enableRTL ? "0" : "4%"), "right": (this.model.enableRTL ? "4%" : "0px"), "position": "relative", "width": "95%", "tableLayout": "auto", "float": "" });
            if (this.element.find(".e-gridContainer").length > 0)
                this.element.find(".e-gridContainer").css({ "width": this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this._currentTab == "chart" ? "99.3%" : "99.8%" });
            $("#" + this._id).width("98%");
            this.element.find(".e-outerTable").css({ "position": "absolute", "width": "0px", "tableLayout": "fixed" });
            this.element.find(".e-toggleCollapseButton").show();
            this.element.find(".e-toggleText").show();
            if (this.model.enableVirtualScrolling)
                this._pivotGrid._applyVScrolling();
            if (this.displayMode() != "gridonly") {
                if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == "chartandgrid") {
                    if (this.model.enableToolBar)
                        $("#" + this._pivotChart._id).width($(".e-controlPanel").width() - 45);
                    else {
                        var chartWidth = this.element.find(".e-controlPanel").width() - (this._currentTab == "grid" ? 0 : 17);
                        $("#" + this._pivotChart._id).width(chartWidth);
                        $("#" + this._id + "_PivotChartContainer").width("99.6%");
                    }
                    this.element.find(".e-chartContainer").css({ "width": this._currentTab == "grid" ? "99.2%" : "100%" });
                }
                else {
                    // if (!this.model.enableToolBar)
                    $("#" + this._pivotChart._id).width($(".e-controlPanel").width() - 25);
                    if (this.displayMode() == ej.PivotClient.DisplayMode.ChartOnly){
                    this.element.find(".e-chartContainer").css({ "width":"100%"});
                   }
                }
                if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                    this.chartObj = null;
                    this.chartObj = this.element.find("#" + this._pivotChart._id + "Container").data("ejChart");
                     if (!ej.isNullOrUndefined(this.chartObj) && this.model.displaySettings.enableFullScreen)
                       { this.chartObj.model.size.width = this.element.find(".e-chartContainer").width()+"px";
                       this.chartObj.model.size.height = this.element.find(".e-chartContainer").height();
                       if(this.displayMode() == ej.PivotClient.DisplayMode.ChartOnly)
                       this.element.find("#" + this._pivotChart._id + "Container").width(this.element.find(".e-chartContainer").width());
                        }
                    if (ej.isNullOrUndefined(this.chartObj) && this.model.enablePivotTreeMap && !ej.isNullOrUndefined(this.otreemapObj))
                        this.chartObj = this.element.find("#" + this.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                }
                if (!ej.isNullOrUndefined(this.chartObj)) {
                    if ((this.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                        this.otreemapObj._treeMap.refresh();
                    }
                    else {
                        this.chartObj.redraw();
                    }
                }
            }
            if (this.displayMode() != ej.PivotClient.DisplayMode.ChartOnly) {
                if (this._pivotGrid.element.length > 0)
                    this._pivotGrid._applyFrozenHeaderWidth(this._pivotGrid._JSONRecords);
            }
        },
        _removeFilterTag: function (uniqueName) {
            var sortOrder = [];
            if (uniqueName && uniqueName.indexOf("].") >= 0) {
                var removeElement = uniqueName.split("].").length > 2 ? "levelUniqueName" : "hierarchyUniqueName";
                if (this._excelFilterInfo.length > 0) {
                    var cubeName = this.element.find('.cubeSelector').data("ejDropDownList").model.value,
                        reportName = this.element.find('#reportList').data("ejDropDownList").model.value,
                        levelName = this._selectedLevelUniqueName, hierarchyName = this._selectedFieldName;
                    this._excelFilterInfo = $.grep(this._excelFilterInfo, function (item, index) {
                        if (item.cubeName == cubeName && item.report == reportName && !(item[removeElement] == uniqueName))
                            return item;
                        else
                            sortOrder = item.sortOrder;
                    });
                }
                return sortOrder;
            }
            else if (uniqueName && this._excelFilterInfo.length > 0 && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                var reportName = this.element.find('#reportList').data("ejDropDownList").model.value;
                this._excelFilterInfo = $.grep(this._excelFilterInfo, function (item, index) {
                    if (item.report == reportName && !(item["levelUniqueName"] == uniqueName))
                        return item;
                });
            }
        },
        _groupLabelChange: function (args) {
            this._selectedLevelUniqueName = args.selectedValue;
            var filterInfo = [];
            var sortInfo = [];
            if (this._excelFilterInfo.length > 0) {
                var cubeName = this.element.find('.cubeSelector').data("ejDropDownList").model.value, reportName = this.element.find('#reportList').data("ejDropDownList").model.value, levelName = this._selectedLevelUniqueName, hierarchyName = this._selectedFieldName;
                filterInfo = $.map(this._excelFilterInfo, function (item, index) {
                    if (item.cubeName == cubeName && item.report == reportName && item.hierarchyUniqueName == hierarchyName && item.levelUniqueName == levelName)
                        return { action: item.action, operator: item.operator, value1: item.value1, sortInfo: item.sortOrder };
                });
            }
            var filterElem = this.element.find("#clearAllFilters a").children().clone();
            this.element.find("#clearAllFilters a").text(this._getLocalizedLabels("ClearFilter") + " from \"" + this.element.find(".groupLabelDrop").data("ejDropDownList").model.text + "\"").append(filterElem);
            this.element.find(".e-filterElementTag .e-activeFilter,.e-filterIndicator").remove();
            if ((filterInfo.length > 0 && (ej.isNullOrUndefined(filterInfo[0]["sortInfo"]) || (!ej.isNullOrUndefined(filterInfo[0]["sortInfo"]) && filterInfo[0]["sortInfo"].length == 0)) || filterInfo.length == 0))
                this.element.find(".e-clrSort").parents("li:eq(0)").css("opacity", "0.5").attr("disable", true);
            else {
                if (filterInfo[0]["sortInfo"].length > 0)
                    this.element.find("#" + filterInfo[0]["sortInfo"] + " span:eq(0)").addClass("e-selectedSort");
            }
            this.element.find(".e-clrFilter").parents("li:eq(0)").css("opacity", "0.5").attr("disable", true);
            this.element.find("#labelClearFilter").css("opacity", "0.5").attr("disable", true);
            this.element.find("#valueClearFilter").css("opacity", "0.5").attr("disable", true);

            if (filterInfo.length > 0 && !ej.isNullOrUndefined(filterInfo[0]["operator"])) {
                var filterTag = "", filterId = "";
                if (filterInfo[0].action == "valuefiltering") {
                    filterTag = "valueFilterBtn";
                    filterId = filterId = (filterInfo[0]["operator"] == "equals" || filterInfo[0]["operator"] == "not equals" || filterInfo[0]["operator"] == "less than or equal to" || filterInfo[0]["operator"] == "greater than or equal to" || filterInfo[0]["operator"] == "greater than" || filterInfo[0]["operator"] == "less than") ? "_valueFilter" : "";
                }
                else {
                    filterTag = "labelFilterBtn";
                    filterId = (filterInfo[0]["operator"] == "equals" || filterInfo[0]["operator"] == "not equals" || filterInfo[0]["operator"] == "less than or equal to" || filterInfo[0]["operator"] == "greater than or equal to" || filterInfo[0]["operator"] == "greater than" || filterInfo[0]["operator"] == "less than") ? "_labelFilter" : "";
                }
                //this.element.find(".clientDialog").prepend("<div class='e-filterIndicator e-icon' style='top:" + (filterTag == "labelFilterBtn" ? "169px" : "199px") + ";margin-left:12px;' />");
                this.element.find("#" + filterTag + " a:eq(0)").append("<span class='e-filterState e-icon'/>");
                this.element.find(".e-clrFilter").parents("li:eq(0)").removeAttr("style disable");
                this.element.find("#" + filterTag + " #labelClearFilter").removeAttr("style disable");
                this.element.find("#" + filterTag + " #valueClearFilter").removeAttr("style disable");
                if (filterInfo[0]["operator"].replace(/ /g, '') == "BottomCount") {
                    this.element.find("#" + filterTag + " li#" + filterInfo[0]["operator"].replace(/ /g, '').replace("Bottom", "top") + " a").append($(ej.buildTag("span.e-activeFilter e-icon")[0].outerHTML));
                }
                else
                    this.element.find("#" + filterTag + " li#" + filterInfo[0]["operator"].replace(/ /g, '') + filterId + " a").append($(ej.buildTag("span.e-activeFilter e-icon")[0].outerHTML));
            }
            else {
                if (this._getUnSelectedNodes() != "")
                    this.element.find(".e-clientDialog").prepend("<div class='e-filterIndicator e-icon' style='margin-top:120px' />");
            }
        },
        _filterElementClick: function (args) {
            if ($(args.element).hasClass("clearFilter") && $(args.element).css("opacity") == "0.5") //|| $(args.element).parent(".filterElementTag").length > 0
                return args.Cancel;

            this._selectedLevelUniqueName = (this.element.find(".groupLabelDrop").data("ejDropDownList").model.value || this.element.find(".groupLabelDrop").data("ejDropDownList").model.dataSource[0].value);
            var cubeName = this.element.find('.cubeSelector').length > 0 ? (this.element.find('.cubeSelector').data("ejDropDownList").model.value) : "", reportName = this.element.find('#reportList').data("ejDropDownList").model.value, levelName = this._selectedLevelUniqueName, hierarchyName = this._selectedFieldName;

            if (!($(args.element).attr("id") == "labelClearFilter" || ($(args.element).attr("id") == "valueClearFilter")) && !$(args.element).parent(".e-filterElementTag").length > 0) {
                var currentAction = $(args.element).parents("li:eq(0)#valueFilterBtn").length > 0 ? "valueFilterDlg" : "labelFilterDlg";
                var filterVal = [];
                if (this._excelFilterInfo.length > 0 && $(args.element).siblings("li:eq(0)").attr("disable") != "true") {
                    filterVal = $.map(this._excelFilterInfo, function (item, index) { if (item.cubeName == cubeName && item.report == reportName && item.hierarchyUniqueName == hierarchyName && item.levelUniqueName == levelName) return { value1: item.value1, value2: item.value2, operator: item.operator, measure: item.measure }; });
                    if ($(args.element).attr("id").replace("_labelFilter", "").replace("_valueFilter", "") != filterVal[0]["operator"].replace(/ /g, '') && filterVal.length > 0)
                        filterVal = [];
                }
                if (this._schemaData) {
                    this._schemaData._selectedLevelUniqueName = this._selectedLevelUniqueName;
                    this._schemaData.selectedFieldName = this._selectedFieldName;
                }
                ej.Pivot.createAdvanceFilterTag({ action: currentAction, selectedArgs: args, filterInfo: filterVal }, this);
            }
            else if ($(args.element).attr("id") == "descOrder" || $(args.element).attr("id") == "ascOrder" || $(args.element).find(".e-clrSort").length > 0) {
                var isSorted = false;
                if (this._excelFilterInfo.length > 0) {
                    var cubeName = this.element.find('.cubeSelector').data("ejDropDownList").model.value, reportName = this.element.find('#reportList').data("ejDropDownList").model.value, levelName = this._selectedLevelUniqueName, hierarchyName = this._selectedFieldName;
                    this._excelFilterInfo = $.grep(this._excelFilterInfo, function (item, index) {
                        if (item.cubeName == cubeName && item.report == reportName && item.hierarchyUniqueName == hierarchyName && item.levelUniqueName == levelName) {
                            isSorted = true;
                            if ($(args.element).find(".e-clrSort").length == 0)
                                item.sortOrder = $(args.element).attr("id");
                            else
                                delete item.sortOrder;
                        }
                        return item;
                    });
                }
                if (!isSorted)
                    this._excelFilterInfo.push({ cubeName: this.element.find('.cubeSelector').length > 0 ? (this.element.find('.cubeSelector').data("ejDropDownList").model.value) : "", report: this.element.find('#reportList').data("ejDropDownList").model.value, hierarchyUniqueName: this._selectedFieldName, levelUniqueName: this._selectedLevelUniqueName, sortOrder: $(args.element).attr("id") });

                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.filterElement, JSON.stringify({ "action": "labelSorting", "clientParams": this._selectedFieldName + "--" + $(args.element).attr("id"), "olapReport": this.currentReport, "clientReports": this.reports, "customObject": JSON.stringify(this.model.customObject) }), this._filterElementSuccess);
            }
            else {
                var sortOrder = this._removeFilterTag(this._selectedLevelUniqueName);
                this._excelFilterInfo.push({ cubeName: this.element.find('.cubeSelector').length > 0 ? (this.element.find('.cubeSelector').data("ejDropDownList").model.value) : "", report: this.element.find('#reportList').data("ejDropDownList").model.value, hierarchyUniqueName: this._selectedFieldName, levelUniqueName: this._selectedLevelUniqueName, sortOrder: sortOrder });
                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.filterElement, JSON.stringify({ "action": "labelfiltering", "clientParams": this._selectedLevelUniqueName + "--Clear Filter", "olapReport": this.currentReport, "clientReports": this.reports, "customObject": JSON.stringify(this.model.customObject) }), this._filterElementSuccess);
            }
        },
        _filterOptionChanged: function (args) {
            var currentAction = this.element.find("#filterDialog_wrapper .e-titlebar").text().indexOf("Value") >= 0 ? "valueFilterDlg" : "labelFilterDlg";
            if (currentAction == "valueFilterDlg") {
                ej.Pivot.createAdvanceFilterTag({ action: currentAction, selectedArgs: args, filterInfo: [] }, this);
            }
        },
        _filterElementOkBtnClick: function (args) {
            var pivotClientObj = this;
            if (!ej.isNullOrUndefined(this._waitingPopup)) {
                pivotClientObj._isTimeOut = true;
                setTimeout(function () {
                    if (pivotClientObj._isTimeOut)
                        pivotClientObj._waitingPopup.show();
                }, 800);
            }
            var selectedOperator = (this.element.find("#filterOptions").data("ejDropDownList").model.value || this.element.find("#filterOptions")[0].value),
                filterValue1 = this.element.find("#filterValue1")[0].value,
                filterValue2 = (this.element.find("#filterValue2").length > 0 ? this.element.find("#filterValue2")[0].value : ""),
                selectedMeasure, params, levelFilterInfo = [], actionName = "labelfiltering";

            params = this._selectedLevelUniqueName + "--" + selectedOperator + "--" + filterValue1;
            if (this.element.find(".filterMeasures").length > 0) {
                if (this.element.find("#filterValue2").length > 0)
                    params = params + "," + filterValue2;
                selectedMeasure = this.element.find(".filterMeasures").data("ejDropDownList").model.value;
                params = params + "--" + selectedMeasure;
                actionName = "valuefiltering";
            }
            var sortOrder = this._removeFilterTag(this._selectedLevelUniqueName);
            this._excelFilterInfo.push({ cubeName: this.element.find('.cubeSelector').length > 0 ? (this.element.find('.cubeSelector').data("ejDropDownList").model.value) : "", report: this.element.find('#reportList').data("ejDropDownList").model.value, action: actionName, hierarchyUniqueName: this._selectedFieldName, levelUniqueName: this._selectedLevelUniqueName, operator: selectedOperator, measure: selectedMeasure, value1: filterValue1, value2: filterValue2, sortOrder: sortOrder });
            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.filterElement, JSON.stringify({ "action": actionName, "clientParams": params, "olapReport": this.currentReport, "clientReports": this.reports, "customObject": JSON.stringify(this.model.customObject) }), this._filterElementSuccess);
        },
        _splitButtonDropped: function (axis, droppedPosition) {
            this.isDropped = true;
            var clientObj = this;
            var cssname = axis == "Series" ? "row" : axis.toLowerCase();
            var cloneElement = this.element.find("button.dragClone").attr("title");
            if (($.trim(droppedPosition) == "" && this.element.find(".e-" + cssname + "Axis").find("button:last").attr("title") == cloneElement) || ($.trim(droppedPosition) != "" && this.element.find($(".e-" + cssname + "Axis").find(".e-splitBtn")[droppedPosition]).attr("data-tag").split(":")[1].replace(".", " - ") == cloneElement) || (cssname == "slicer" && $.trim(droppedPosition) != "" && this.element.find(".e-" + cssname + "Axis").find("button[title=" + JSON.stringify(cloneElement).replace(/"/g, "'") + "]").length > 0)) {
                this.element.find("button.dragClone").remove()
                return false
            }
            if (cssname == "slicer" && this.draggedSplitBtn != null && ($(this.draggedSplitBtn).parent("div:eq(0)").attr("data-tag").indexOf("Measure") > -1 || $(this.draggedSplitBtn).parent("div:eq(0)").attr("data-tag").indexOf("KPIs") > -1) && (this.element.find(".e-splitBtn[tag*=Measures]").length > 1 || this.element.find(".e-splitBtn[data-tag*=KPIs]").length >= 1)) {
                var alertmsg = ($(this.draggedSplitBtn).parent("div:eq(0)").attr("data-tag").indexOf("KPIs") > -1 || $(this.draggedSplitBtn).parent("div:eq(0)").attr("data-tag").indexOf("Measure") > -1) && this.element.find(".e-splitBtn[data-tag*=KPIs]").length >= 1 ? this._getLocalizedLabels("KpiAlertMsg") : this._getLocalizedLabels("MultipleMeasure");
                this.element.find("button.dragClone").remove();
                ej.Pivot._createErrorDialog(alertmsg, this._getLocalizedLabels("Warning"), this);
                return false;
            }
            if (($.trim(droppedPosition) == "") || (this.draggedSplitBtn != null && this.element.find($(".e-" + cssname + "Axis").find(".e-splitBtn")[droppedPosition]).attr("data-tag").split(":")[1].replace(".", " - ") != cloneElement)) {
                var params = this.element.find(".e-cubeName").html() + "--" + $(this.draggedSplitBtn).parent("div:eq(0)").attr("data-tag") + "--" + axis + "--" + droppedPosition;
                if (this.model.enableAdvancedFilter && axis == "Slicer") {
                    var btnUniqueName = $(this.draggedSplitBtn).parent("div:eq(0)").attr("data-tag").split(":")[1].split(".");
                    this._setUniqueNameFrmBtnTag(btnUniqueName);
                    this._removeFilterTag(this._selectedFieldName);
                }
                this.element.find("button.dragClone").remove();
                this.draggedSplitBtn = null;
                this._isTimeOut = true;
                setTimeout(function () {
                    if (clientObj._isTimeOut)
                        clientObj._waitingPopup.show();
                }, 800);
                if (this.model.beforeServiceInvoke != null)
                    this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.nodeDropped, JSON.stringify({ "action": "nodeDropped", "dropType": "SplitButton", "nodeInfo": params, "olapReport": this.currentReport, "clientReports": this.reports, "customObject": serializedCustomObject }), this._nodeDroppedSuccess);
            }
            this._isNodeOrButtonDropped = true;
        },

        _filterElementSuccess: function (report) {
            this._isSearchApplied = false;
            ej.Pivot.closePreventPanel(this);
            if (report[0] != undefined) {
                this.currentReport = report[0].Value; this.reports = report[1].Value;
                if (report[2] != null && report[2] != undefined)
                    this.model.customObject = report[2].Value;
            }
            else if (report.d != undefined) {
                this.currentReport = report.d[0].Value; this.reports = report.d[1].Value;
                if (report.d[2] != null && report.d[2] != undefined)
                    this.model.customObject = report.d[2].Value;
            }
            else {
                this.currentReport = report.UpdatedReport; this.reports = report.ClientReports;
                if (report.customObject != null && report.customObject != undefined)
                    this.model.customObject = report.customObject;
            }
            if (this.model.afterServiceInvoke != null)
                this._trigger("afterServiceInvoke", { action: "filtering", element: this.element, customObject: this.model.customObject });
            this._renderControls();
            this._unWireEvents();
            this._wireEvents();
            this._successAction = "Filter";
            this._trigger("renderSuccess", this);
        },

        _maxViewBtnClick: function () {
            var winWidth = $(window).width() - 150;
            var winHeight = $(window).height() - 100;
            this._maxInitialChartHeight = this.element.find("#" + this._pivotChart._id + "Container").height();
            this._maxInitialChartWidth = this.element.find("#" + this._pivotChart._id + "Container").width();
            this._maxInitialGridWidth = this.element.find("#" + this._id + "_PivotGrid").width();
            var docDivTag = ej.buildTag("div.e-fullScreenView", "", { width: $(document).width(), height: $(document).height() });
            var winDivTag = ej.buildTag("div#" + this._id + "_maxView.e-maximumView", "", { width: winWidth, height: winHeight });
            var maxViewCls = ej.buildTag("div#Winclose.e-winCloseBtn e-icon", "").attr("role", "button").attr("aria-label", "close").attr("clientID", this._id);
            if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                this.chartObj = null;
                this.chartObj = this.element.find("#" + this._pivotChart._id + "Container").data("ejChart");
                if (ej.isNullOrUndefined(this.chartObj) && this.model.enablePivotTreeMap && !ej.isNullOrUndefined(this.otreemapObj))
                    this.chartObj = this.element.find("#" + this.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
            }
            if (this.displayMode() == ej.PivotClient.DisplayMode.ChartOnly && ($("#" + this._pivotChart._id + "Container_svg")[0] || $("#" + this.otreemapObj._id + "TreeMapContainer").children().length > 0)) {
                this._fullScreenView(100, 160);
                if (!ej.isNullOrUndefined(this.chartObj)) {
                    if ((this.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                        $("#" + this.otreemapObj._id).css({ width: "99%" });
                        $("#" + this.otreemapObj._id + "TreeMapContainer").css({ width: "100%" });
                    }
                }
                winDivTag.append(this.element.find("#" + this._id + "_PivotChart"));
            }
            if (this.displayMode() == ej.PivotClient.DisplayMode.GridOnly)
                winDivTag.append(this.element.find("#" + this._id + "_PivotGrid").css({ "max-height": winHeight, "width": winWidth, "overflow": "auto" }));
            if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tab && this.displayMode() == "chartandgrid") {
                if (this._currentTab == "grid")
                    winDivTag.append(this.element.find("#" + this._id + "_PivotGrid").css({ "max-height": winHeight, "width": winWidth }));
                else if (this._currentTab == "chart" && ($("#" + this._pivotChart._id + "Container_svg")[0] || $("#" + this.otreemapObj._id + "TreeMapContainer").children().length > 0)) {
                    this._fullScreenView(100, 160);
                    if (!ej.isNullOrUndefined(this.chartObj)) {
                        if ((this.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                            $("#" + this.otreemapObj._id).css({ width: "99%" });
                            $("#" + this.otreemapObj._id + "TreeMapContainer").css({ width: "100%" });
                        }
                    }
                    winDivTag.append(this.element.find("#" + this._id + "_PivotChart"));
                }
            }
            else if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == "chartandgrid") {
                var hght = ($(window).height() / 2) - 50;
                this.element.find("#" + this._id + "_PivotGrid").css({ "max-height": hght, "margin-left": "0px", "overflow": "auto" });
                if (!ej.isNullOrUndefined(this.chartObj)) {
                    if ((this.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                        $("#" + this.otreemapObj._id).css({ width: "99%" });
                        $("#" + this.otreemapObj._id + "TreeMapContainer").css({ width: "100%" });
                    }
                }
                this._fullScreenView(50, 160);
                if (($("#" + this._pivotChart._id + "Container_svg")[0] || $("#" + this.otreemapObj._id + "TreeMapContainer").children().length > 0))
                    if (this.defaultView() == "chart")
                        winDivTag.append(this.element.find("#" + this._id + "_PivotChart")).append(this.element.find("#" + this._id + "_PivotGrid").width(($(window).width() - 160)));
                    else
                        winDivTag.append(this.element.find("#" + this._id + "_PivotGrid").width($(window).width() - 160)).append(this.element.find("#" + this._id + "_PivotChart"));
                winDivTag.append(this.element.find("#" + this._id + "_PivotGrid").width($(window).width() - 160));
            }
            winDivTag.append(maxViewCls);
            docDivTag.append(winDivTag);
            $("body").append(docDivTag);
            if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                if (!ej.isNullOrUndefined(this.chartObj)) {
                    if (this.model.enablePivotTreeMap && (this.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                        this.otreemapObj._treeMap.refresh();
                    }
                    else {
                        this.chartObj.redraw();
                    }
                }
            }
        },

        _maxViewClsBtnClick: function () {
            var fullScreen = $(".e-fullScreenView");
            var tolerance = (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) ? 0 : 80;
            fullScreen.find("#" + this._id + "_PivotGrid").css("margin-left", "7px");
            fullScreen.find("#" + this._id + "_PivotChart").appendTo(this.element.find(".e-chartContainer"));
            if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                this.chartObj = null;
                this.chartObj = this.element.find("#" + this._pivotChart._id + "Container").data("ejChart");
                if (ej.isNullOrUndefined(this.chartObj) && this.model.enablePivotTreeMap && !ej.isNullOrUndefined(this.otreemapObj))
                    this.chartObj = this.element.find("#" + this.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
            }
            if (this.displayMode() == ej.PivotClient.DisplayMode.ChartOnly && ($("#" + this._pivotChart._id + "Container_svg")[0]))
                this._fullScreenViewCls(this._maxInitialChartHeight, this._maxInitialChartWidth-7);
            if (this.displayMode() == ej.PivotClient.DisplayMode.GridOnly)
                fullScreen.find("#" + this._id + "_PivotGrid").css({ "width": "inherit", "max-height": '', "overflow": "hidden" });
            if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tab && this.displayMode() == "chartandgrid") {
                if (this._currentTab == "chart" && $("#" + this._pivotChart._id + "Container_svg")[0])
                    this._fullScreenViewCls(this._maxInitialChartHeight, this._maxInitialChartWidth-7);
                else
                    fullScreen.find("#" + this._id + "_PivotGrid").css({ "max-height": "", "width": (this._maxInitialGridWidth + "px") });
            }
            if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == "chartandgrid")
                if ($("#" + this._pivotChart._id + "Container_svg")[0]) {
                    this._fullScreenViewCls(this._maxInitialChartHeight, this._maxInitialChartWidth-7);
                    fullScreen.find("#" + this._id + "_PivotGrid").css({ "width": (this._maxInitialGridWidth + "px"),"max-height": '', "overflow": "auto" });
                } else
                    fullScreen.find("#" + this._id + "_PivotGrid").css({ "max-height": "", "width": (this._maxInitialGridWidth + "px") });
            if (this.enableTogglePanel() && ((this.element.find(".e-cubeTable").is(':visible')) == false || (this.element.find(".e-outerTable").is(':visible')) == false))
                fullScreen.find("#" + this._id + "_PivotGrid").css("width", this._maxInitialGridWidth + "px");
            fullScreen.find("#" + this._id + "_PivotGrid").appendTo(this.element.find(".e-gridContainer"));
            $(".e-maximumView").remove();
            $(".e-fullScreenView").remove();
            if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                if (!ej.isNullOrUndefined(this.chartObj)) {
                    if (this.model.enablePivotTreeMap && (this.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap")
                        this.otreemapObj._treeMap.refresh();
                    else {
                        this.chartObj.redraw();
                    }
                }
            }
        },

        _enableResponsive: function () {

            this.element.find(".outerPanel").css({ "width": "100%" });
            $(".e-pivotclient").css({ "width": "100%" });
            this.element.find(".e-outerTable").css({ "float": this.model.enableRTL ? "right" : "left" });
            if(this.model.enableSplitter)
            this.element.find(".e-cdbHeader, .e-cubeBrowser").css("width", "99%");
            this.element.find(".e-rowAxis, .e-slicerAxis, .e-categoricalAxis").width("99%");
            this.element.find(".controlPanelTD").width("56%");
            if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == "chartandgrid")
                this.element.find(".controlPanelTD").css("display", "inline-block");
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode)
                {this.element.find(".e-cubeTable").width("100%");
                if(this.displayMode() == ej.PivotClient.DisplayMode.ChartOnly)
                this.element.find(".e-pivotschemadesigner").width("95%");
                else
                this.element.find(".e-pivotschemadesigner").width("100%");
                }
            else
                this.element.find(".e-cubeTable").width("98%");
            if (window.navigator.userAgent.indexOf('Trident') > 0) {
                if (this._currentTab == "grid")
                    $(".e-controlPanel").css({ "width": $("#" + this._id).width() * 55 / 100 + "px" });
                else
                    $(".e-controlPanel").css({ "width": "99%" });
                this.element.find(".e-outerTable").width($("#" + this._id).width() * 39 / 100);
                this.element.find(".e-csHeader").width($("#" + this._id).width() * 38 / 100);
                if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == "chartandgrid")
                    this.element.find(".e-gridPanel").width($("#" + this._id).width() * 55 / 100);
            }
            else {
                this.element.find(".e-outerTable").width($("#" + this._id).width() * 38 / 100);
                this.element.find(".e-csHeader").width($("#" + this._id).width() * 38 / 100);
            }
        },

        _fullScreenView: function (height, width) {
            if (this._pivotChart != null && this._pivotChart != undefined && ($("#" + this._pivotChart._id + "Container_svg")[0])) {
                this.chartObj = this.element.find("#" + this._pivotChart._id + "Container").data("ejChart");
                var chartWidth = this.chartObj.model.size.width = this._pivotChart.model.size.width = $(window).width() - width + "px";
                if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == "chartandgrid")
                    var chartHeight = this._pivotChart.model.size.height = this.chartObj.model.size.height = ($(window).height() / 2) - height + "px";
                else
                    var chartHeight = this._pivotChart.model.size.height = this.chartObj.model.size.height = $(window).height() - height + "px";
                this.element.find("#" + this._id + "_PivotChart").css({ "min-height": chartHeight, "width": chartWidth });
                this.element.find("#" + this._id + "_PivotChartContainer").css({ "width": chartWidth, "height": chartHeight });
                this.chartObj.redraw();
            }
        },

        _fullScreenViewCls: function (height, width) {
            if (this._pivotChart != null && this._pivotChart != undefined) {
                this.chartObj = this.element.find("#" + this._pivotChart._id + "Container").data("ejChart");
                var chartHeight = this.chartObj.model.size.height = this._pivotChart.model.size.height = height + "px";
                if (this.enableTogglePanel() && (this.element.find(".e-cubeTable").is(':visible')) == false && ((this.element.find(".e-outerTable").is(':visible')) == false))
                    var chartWidth = this.chartObj.model.size.width = this._pivotChart.model.size.width = "950px";
                else
                    var chartWidth = this.chartObj.model.size.width = this._pivotChart.model.size.width = width + "px";
                this.element.find("#" + this._id + "_PivotChart").css({ "min-height": chartHeight, "width": chartWidth });
                this.element.find("#" + this._pivotChart._id + "Container").width(chartWidth);
                if(this.displayMode() == ej.PivotClient.DisplayMode.ChartOnly)
                this.element.find("#" + this._pivotChart._id + "Container").height(chartHeight);
                this.chartObj.redraw();
            }
        },
        _calcMemberDroppedSuccess: function (data) {
            if (data[0] != undefined) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].Key == "calcMemberTreeData") {
                        this._calcMembers = JSON.parse(data[i].Value);
                        data.splice(i, 1);
                        break;
                    }
                }
            }
            else if (data.d != undefined) {
                for (var i = 0; i < data.d.length; i++) {
                    if (data.d[i].Key == "calcMemberTreeData") {
                        this._calcMembers = JSON.parse(data.d[i].Value);
                        data.d.splice(i, 1);
                        break;
                    }
                }
            }
            else {
                this._calcMembers = JSON.parse(data.calcMemberTreeData);
                delete data.calcMemberTreeData;
            }
            this._calcMemberTreeViewUpdate();
            this._nodeDroppedSuccess(data);
        },

        _nodeDroppedSuccess: function (data) {
            var columnElements, rowElements, slicerElements;
            if (data[0] != undefined) {
                columnElements = data[0].Value; rowElements = data[1].Value; slicerElements = data[2].Value;
                this.currentReport = data[3].Value; this.reports = data[4].Value;
                if (data[5] != null && data[5] != undefined)
                    this.model.customObject = data[5].Value;
            }
            else if (data.d != undefined) {
                columnElements = data.d[0].Value; rowElements = data.d[1].Value; slicerElements = data.d[2].Value;
                this.currentReport = data.d[3].Value; this.reports = data.d[4].Value;
                if (data.d[5] != null && data.d[5] != undefined)
                    this.model.customObject = data.d[5].Value;
            }
            else {
                columnElements = data.Columns; rowElements = data.Rows; slicerElements = data.Slicers;
                this.currentReport = data.UpdatedReport; this.reports = data.ClientReports;
                if (data.customObject != null && data.customObject != undefined)
                    this.model.customObject = data.customObject;
            }
            if (this._isRemoved) {
                this._isRemoved = false;
                var tempArray = [];

                if (columnElements.length > 0)
                    tempArray.push(columnElements);
                if (rowElements.length > 0)
                    tempArray.push(rowElements);
                if (slicerElements.length > 0)
                    tempArray.push(slicerElements);

                if (tempArray.length > 0) {
                    for (var j = 0; j < tempArray.length; j++) {
                        var filterName;
                        var target = tempArray[j]
                        if (!ej.isNullOrUndefined(target)) {
                            for (var i = 0; i < target.split("#").length; i++) {
                                if (target.split("#")[i] == "" || target.split("#")[i] == "Measures")
                                    filterName = null;
                                else
                                    filterName = target.split("#")[i].split(".").length > 0 ? target.split("#")[i].replace(".", " - ") : target.split("#")[i];
                                if (!ej.isNullOrUndefined(filterName)) {
                                    if (this._currentReportItems.length != 0) {
                                        if (this._treeViewData.hasOwnProperty(filterName)) {
                                            delete this._treeViewData[filterName];
                                            this._currentReportItems.splice($.inArray(filterName, this._currentReportItems), 1);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (this.model.afterServiceInvoke != null)
                this._trigger("afterServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.customObject });
            this.element.find(".e-categoricalAxis, .e-rowAxis, .e-slicerAxis").find(".e-splitBtn, .e-btn").remove();
            $(this._createSplitButtons(columnElements, "Columns")).appendTo(".e-categoricalAxis");
            $(this._createSplitButtons(rowElements, "Rows")).appendTo(".e-rowAxis");
            $(this._createSplitButtons(slicerElements, "Slicers")).appendTo(".e-slicerAxis");
            this.element.find(".e-categoricalAxis, .e-rowAxis, .e-slicerAxis").find("button").ejButton({ height: "20px", type: ej.ButtonType.Button });
            this._setSplitBtnTitle();
            if (this.model.showUniqueNameOnPivotButton) {
                $(".e-pvtBtn").addClass("e-splitBtnUnique");
                this._addSplitButtonHeight();
            }
            this._renderControls();
            this._unWireEvents();
            this._wireEvents();
            this._successAction = "NodeDrop";
            this._trigger("renderSuccess", this);
            this._buttonContextMenu();
        },
        _buttonContextMenu: function () {
            var context = ej.buildTag("ul.pivotTree#pivotTree", ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToColumn"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToRow"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToSlicer"))[0].outerHTML)[0].outerHTML)[0].outerHTML;
            this.element.append(context);
            $("#pivotTree").ejMenu({
                menuType: ej.MenuType.ContextMenu,
                openOnClick: false,
                contextMenuTarget: this.element.find(".e-button"),
                click: ej.proxy(this._contextClick, this),
                beforeOpen: ej.proxy(this._contextOpen, this),
                close: ej.proxy(ej.Pivot.closePreventPanel, this)
            });
        },
        _editorTreeInfoSuccess: function (editorTree) {

            if (editorTree[0] != undefined) {
                if (editorTree[2] != null && editorTree[2] != undefined)
                    this.model.customObject = editorTree[2].Value;
            }
            else if (editorTree.d != undefined) {
                if (editorTree.d[2] != null && editorTree.d[2] != undefined)
                    this.model.customObject = editorTree.d[2].Value;
            }
            else {
                if (editorTree.customObject != null && editorTree.customObject != undefined)
                    this.model.customObject = editorTree.customObject;
            }
            if (this.model.afterServiceInvoke != null)
                this._trigger("afterServiceInvoke", { action: "fetchMemberTreeNodes", element: this.element, customObject: this.model.customObject });
            this._createDialog(this._args_className, this._args_innerHTML, editorTree);
            this._isTimeOut = false;
            this._waitingPopup.hide();
            this._successAction = "EditorTreeInfo";
            this._trigger("renderSuccess", this);
            if (this.element.find(".e-dialog .e-text:visible").first().length > 0) {
                this._curFocus.editor = this.element.find(".e-dialog .e-text:visible").first().attr("tabindex", "-1").focus().addClass("e-hoverCell");
            }
            else if (this.element.find(".e-dialog .e-measureEditor:visible").first().length > 0) {
                this._curFocus.editor = this.element.find(".e-dialog .e-measureEditor:visible").first().attr("tabindex", "-1").focus().addClass("e-hoverCell");
            }
        },

        _generateAllMember: function (customArgs, args) {
            this.olapCtrlObj._allMember = $($(args).find("Axis:eq(0) Tuple:eq(0)").children().children()[1]).text();
        },

        generateJSON: function (data) {
            if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                this._pivotChart.model.analysisMode = this.model.analysisMode;
                this._pivotChart.model.operationalMode = this.model.operationalMode;
                this._pivotChart.model.dataSource = this.model.dataSource;
                this._pivotChart.setPivotEngine(data.tranposeEngine);
                this._pivotChart._drillAction = "";
                if (this.displayMode() != ej.PivotClient.DisplayMode.ChartOnly && this._pivotGrid._drillAction != "") {
                    this._setChartDrillMembers(data.tranposeEngine, this._pivotGrid._drillAction);
                    this._drillInfo = [];
                }
                else
                    this._pivotChart.generateJSON(this, data.tranposeEngine);
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    this._pivotChart._drilledCellSet = (this._drilledCellSet.length > 0) ? this._drilledCellSet : [];
                    this._pivotChart.XMLACellSet = (this.XMLACellSet.length > 0) ? this.XMLACellSet : [];
                }
                this._pivotChart._drillAction = "";
            }
            if (this.displayMode() != ej.PivotClient.DisplayMode.ChartOnly) {
                this._pivotGrid.model.analysisMode = this.model.analysisMode;
                this._pivotGrid.model.operationalMode = this.model.operationalMode;
                this._pivotGrid.model.dataSource = this.model.dataSource;
                this._pivotGrid.setJSONRecords(JSON.stringify(data.jsonObj));
                this._pivotGrid.model.collapsedMembers = null;
                if (this.model.gridLayout == "excellikelayout")
                    this._pivotGrid.excelLikeLayout(data.jsonObj);
                else
                    this._pivotGrid.renderControlFromJSON();
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    this._pivotGrid._drilledCellSet = (this._drilledCellSet.length > 0) ? this._drilledCellSet : [];
                    this._pivotGrid.XMLACellSet = (this.XMLACellSet.length > 0) ? this.XMLACellSet : [];
                }
                this._pivotGrid._drillAction = "";
            }
            if (this._pivotSchemaDesigner)
                this._pivotSchemaDesigner._refreshPivotButtons();
            if (this.model.showUniqueNameOnPivotButton) {
                $(".e-pivotButton").addClass("e-pvtBtnUnique");
                $(".e-pvtBtn").addClass("e-schemaBtnUnique");
                $(".e-removeClientPivotBtn").addClass("e-schemaRemoveBtnUnqiue");
            }
            if (this.model.isResponsive && this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                this.chartObj = this.element.find("#" + this._pivotChart._id + "Container").data("ejChart");
                if (!ej.isNullOrUndefined(this.chartObj))
                    this.element.find("#" + this.chartObj._id).ejChart("option", { "model": { size: { height: this._chartHeight } } });
            }
        },

        _renderLayout: function () {
            if (this.model.isResponsive || this.model.collapseCubeBrowserByDefault) this.model.displaySettings.enableTogglePanel = true;
            var reportToolBar = ej.buildTag("div.e-reportToolbar#reportToolbar", this._reportToolbar(), { width: "410px", height: "29px" })[0].outerHTML;
            var browserPanel, htmlTag;
            if (this.model.enableSplitter) {
                if (!this.model.isResponsive) {
                    if (this.model.enableRTL && !this.model.enableVirtualScrolling) {
                        browserPanel = ej.buildTag("div#" + this._id + "_PivotSchemaDesigner.pivotFieldList", "", {}).attr("class", "e-childsplit")[0].outerHTML;
                        htmlTag = ej.buildTag("div.outerPanel", "", {}).append("<div class=\"e-titleText\"><span style='padding-left:10px'>" + this.model.title + "</span></div>" + reportToolBar + "<table class=\"e-outerTable\" style='width:100%'><tr class='e-parentsplit' style='width:100%'><td class=\"controlPanelTD\" style='width:50%'>" + this._controlPanel() + "</td><td style='width:50%'>" + browserPanel + "</td></tr></table>");
                    }
                    else if (this.model.enableVirtualScrolling || (this.model.enableRTL && this.model.enableVirtualScrolling)) {
                        browserPanel = ej.buildTag("div#" + this._id + "_PivotSchemaDesigner.pivotFieldList", "", {}).attr("class", "e-childsplit")[0].outerHTML;
                        htmlTag = ej.buildTag("div.outerPanel", "", {}).append("<div class=\"e-titleText\"><span style='padding-left:10px'>" + this.model.title + "</span></div>" + reportToolBar + "<table class=\"e-outerTable\" style='width:100%'><tr style='width:98%'><td style='width:49%'>" + browserPanel + "</td><td class=\"controlPanelTD\" style='width:49%'>" + this._controlPanel() + "</td>" + (this.model.enableVirtualScrolling ? ej.buildTag("td.virtualScrolling", ej.buildTag("div.e-vScrollPanel")[0].outerHTML)[0].outerHTML : "") + "</tr></table>");
                    }
                    else {
                        browserPanel = ej.buildTag("div#" + this._id + "_PivotSchemaDesigner.pivotFieldList", "", {}).attr("class", "e-childsplit")[0].outerHTML;
                        htmlTag = ej.buildTag("div.outerPanel", "", {}).append("<div class=\"e-titleText\"><span style='padding-left:10px'>" + this.model.title + "</span></div>" + reportToolBar + "<table class=\"e-outerTable\" style='width:100%'><tr class='e-parentsplit' style='width:100%'><td style='width:50%'>" + browserPanel + "</td><td class=\"controlPanelTD\" style='width:50%'>" + this._controlPanel() + "</td></tr></table>");
                    }
                }
                else if (this.model.isResponsive) {
                    browserPanel = ej.buildTag("div#" + this._id + "_PivotSchemaDesigner.pivotFieldList", "", {}).addClass("e-splitresponsive")[0].outerHTML;
                    htmlTag = ej.buildTag("div.outerPanel", "").append(ej.buildTag("div.e-titleText", ej.buildTag("span", this.title(), { "padding-left": "10px" })[0].outerHTML)[0].outerHTML + reportToolBar + ej.buildTag("table.oClientTbl", ej.buildTag("tr", ej.buildTag("td", ej.buildTag("table.e-outerTable", ej.buildTag("tr", ej.buildTag("td", browserPanel).attr("width", "100%")[0].outerHTML).attr("width", "100%")[0].outerHTML)[0].outerHTML + ej.buildTag("table.controlPanelTD", ej.buildTag("tr", ej.buildTag("td", this._controlPanel())[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML, { width: "100%" })[0].outerHTML);
                }
            }
            else {
                if (!this.model.isResponsive) {
                    browserPanel = ej.buildTag("div#" + this._id + "_PivotSchemaDesigner.pivotFieldList", "", {})[0].outerHTML;
                    htmlTag = ej.buildTag("div.outerPanel", "", {}).append(($.trim(this.model.title) != "" ? ("<div class=\"e-titleText\"><span style='padding-left:10px'>" + this.model.title + "</span></div>") : "") + reportToolBar + "<table class=\"e-outerTable\" style='display:block'><tr><td>" + browserPanel + "</td><td class=\"controlPanelTD\"style='display:block'>" + this._controlPanel() + "</td>" + (this.model.enableVirtualScrolling ? ej.buildTag("td.virtualScrolling", ej.buildTag("div.e-vScrollPanel")[0].outerHTML)[0].outerHTML : "") + "</tr></table>");
                }
                else if (this.model.isResponsive) {
                    browserPanel = ej.buildTag("div#" + this._id + "_PivotSchemaDesigner.pivotFieldList", "", {})[0].outerHTML //: this._createCubeSelector() + ej.buildTag("table.e-cubeTable", ej.buildTag("tbody", ej.buildTag("tr", ej.buildTag("td.cubeTableTD", this._createCubeBrowser(cubeTreeInfo)).attr({ valign: "bottom", width: "50%" })[0].outerHTML + ej.buildTag("td.cubeTableTD", this._createAxisElementBuilder(columnElements, rowElements, slicerElements)).attr({ valign: "bottom", width: "50%" })[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML);
                    htmlTag = ej.buildTag("div.outerPanel", "").append(($.trim(this.model.title) != "" ? (ej.buildTag("div.e-titleText", ej.buildTag("span", this.title(), { "padding-left": "10px" })[0].outerHTML)[0].outerHTML) : "") + reportToolBar + ej.buildTag("table.oClientTbl", ej.buildTag("tr", ej.buildTag("td", ej.buildTag("table.e-outerTable", ej.buildTag("tr", ej.buildTag("td", browserPanel)[0].outerHTML)[0].outerHTML)[0].outerHTML + ej.buildTag("table.controlPanelTD", ej.buildTag("tr", ej.buildTag("td", this._controlPanel())[0].outerHTML + (this.model.enableVirtualScrolling ? ej.buildTag("td.virtualScrolling", ej.buildTag("div.e-vScrollPanel")[0].outerHTML)[0].outerHTML : ""))[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML, { width: "100%" })[0].outerHTML);
                }
            }
            this.element.html(htmlTag);
            this.element.find(".e-reportToolbar").ejToolbar({ enableRTL: this.model.enableRTL, height: "35px" });
            this._calculateSize();
            if (this.model.enableRTL)
                this.element.addClass("e-rtl");
            if ((this.enableTogglePanel() && !this.model.enableSplitter) || this.model.isResponsive) {
                this.element.find(".e-controlPanel").width(this.element.width() - ((this.element.width() / 3) + (this.model.enableVirtualScrolling ? 39 : 20)));
                $(ej.buildTag("div.e-togglePanel", ej.buildTag("div.e-toggleExpandButton e-icon", "", {}).attr("aria-label", "toggle expanded")[0].outerHTML + ej.buildTag("div.e-toggleCollapseButton e-icon", {}, { "display": "none" }).attr("aria-label", "toggle collapsed")[0].outerHTML)[0].outerHTML).appendTo(this.element.find(".pivotFieldList").parent());
            }
            if ((this.controlPlacement() == ej.PivotClient.ControlPlacement.Tab && this.defaultView() == ej.PivotClient.DefaultView.Grid) || (this.displayMode() == ej.PivotClient.DisplayMode.GridOnly))
                this.element.find(".e-chartTypesImg").addClass("e-chartTypesOnGridView");
            if (this.model.enableSplitter && this.model.enableRTL) {
                if (this.displayMode() == ej.PivotClient.DisplayMode.ChartOnly)
                    this.element.find(".e-controlPanel").css("right", -3);
                else
                    this.element.find(".e-controlPanel").css("right", 7);
            }
            else
                this.element.find(".e-controlPanel").css("right", 3);
            var reportDropDown = "<div class ='reportList' ><input type='text' id='reportList' class='reportlist' title='" + this._getLocalizedLabels("ReportList") + "'/></div>";
            $(this.element).find(".e-reportCol").append(reportDropDown);
            if (this.model.showReportCollection)
                this._fetchCollectionList();
        },
        _calculateSize: function () {
            $(this.element).height(this.model.size.height).width(this.model.size.width);
            if (!this.model.isResponsive)
            $(this.element).height($(this.element).height() < 500 ? 500 : $(this.element).height());
            $(this.element).width($(this.element).width() < 600 ? 600 : $(this.element).width());
            var ctrlPanelHeight = this.element.height() - ((this.element.find("div.e-titleText").length > 0 ? 50 : 0) + this.element.find("#reportToolbar").height() + 5);
            if (!(this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)) {
                if (!this.model.isResponsive && !this.model.enableSplitter) {
                    this.element.find(".e-outerTable").width(this.element.width());
                    this.element.find(".e-controlPanel").width(this.element.width() * (2 / 3));
                    if (this.enableTogglePanel() && this.element.find(".pivotFieldList").length > 0)
                        this.element.find(".e-controlPanel").width(this.element.width() - ((this.element.width() / 3) + (this.model.enableVirtualScrolling ? 39 : 20)));
                }
                this.element.find(".controlPanelTD, .e-outerTable").height(ctrlPanelHeight);
                if (this.model.enableVirtualScrolling)
                    this.element.find(".e-controlPanel").height(ctrlPanelHeight - 20);
                else
                    this.element.find(".e-controlPanel").height(ctrlPanelHeight);
            }
            else {
                var aebHeight, axisHeaderHeight;
                if (!this.model.isResponsive && !this.model.enableSplitter) {
                    var cdbWidth = this.element.width() / 2.5;
                    this.element.find(".e-csHeader").width(cdbWidth + 15);
                    this.element.find(".axisBuilderTD").width(cdbWidth / 2);
                    this.element.find(".e-cdbHeader, .e-cubeBrowser").width(cdbWidth / 2);
                    this.element.find(".e-controlPanel").width(this.element.width() - (cdbWidth + 25));
                }
                // this.element.find(".outerTable").height(ctrlPanelHeight-15);
                if (this.model.enableVirtualScrolling)
                    this.element.find(".e-controlPanel").height(ctrlPanelHeight - 15);
                else if (this.model.enablePaging)
                    this.element.find(".e-controlPanel").height(ctrlPanelHeight - 5);
                else
                    this.element.find(".e-controlPanel").height(ctrlPanelHeight);
                this.element.find(".e-cubeTable").height((this.element.height() - ((this.element.find("div.e-titleText").length > 0 ? 50 : 0) + this.element.find("#reportToolbar").height() + this.element.find(".e-csHeader").height() + 38)));
                if (this.model.isResponsive) {
                    this.element.find(".e-cubeBrowser").height(this.element.find(".e-cubeTable").height() - (this.element.find(".e-cdbHeader").height()));
                    this.element.find(".e-cubeTreeView").height(this.element.find(".e-cubeBrowser").height() - (56 + (this.model.enableMeasureGroups ? 35 : 0)));
                    aebHeight = this.element.find(".e-cubeTable").height() - ((this.element.find(".e-axisHeader").height() * 3) + 4);
                }
                else {
                    this.element.find(".cdbTD, .cubeTableTD").height(this.element.find(".e-cubeTable").height());
                    this.element.find(".e-cubeBrowser").height((this.element.find(".cdbTD, .cubeTableTD").height() + 9) - this.element.find(".e-cdbHeader").height());
                    this.element.find(".e-cubeTreeView").height(this.element.find(".e-cubeBrowser").height() - (61 + (this.model.enableMeasureGroups ? 30 : 0)));
                    aebHeight = this.element.find(".e-cubeTable").height() - ((this.element.find(".e-axisHeader").height() * 3) + (this.model.enableSplitter ? 14 : 3));
                }
                this.element.find(".e-categoricalAxis, .e-rowAxis, .e-slicerAxis").height((aebHeight / 3));
            }
            if (this.displayMode() != ej.PivotClient.DisplayMode.ChartOnly) {
                if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == ej.PivotClient.DisplayMode.ChartAndGrid) {
                    if (this.model.enableVirtualScrolling) {
                        this.element.find(".e-controlPanel").width(this.element.find(".e-controlPanel").width() - 5);
                    }

                    if (this.defaultView() == ej.PivotClient.DefaultView.Grid) {
                        if (this.model.enablePaging)
                            this.element.find(".e-gridContainer").height((this.element.find(".e-controlPanel").height() / 2) + 5);
                        else
                            this.element.find(".e-gridContainer").height((this.element.find(".e-controlPanel").height() / 2) - 10);
                        if (!this.model.isResponsive && !this.model.enableSplitter)
                            this.element.find(".e-gridContainer").width(this.element.find(".e-controlPanel").width() - 15);

                    }
                    else {
                        this.element.find(".e-gridContainer").height((this.element.find(".e-controlPanel").height() / 2) - 10);
                        if (!this.model.isResponsive && !this.model.enableSplitter)
                            this.element.find(".e-gridContainer").width(this.element.find(".e-controlPanel").width() - ((this.enableTogglePanel() && this._currentTab == "chart") ? 15 : 20));
                    }
                }
                else {
                    if (this.displayMode() == ej.PivotClient.DisplayMode.GridOnly) {
                        this.element.find(".e-gridContainer").height(this.element.find(".e-controlPanel").height() - (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? 12 : 20));
                        if (!this.model.isResponsive && !this.model.enableSplitter)
                            this.element.find(".e-gridContainer").width(this.element.find(".e-controlPanel").width() - 15)
                    }
                    else {
                        if (this.model.enableVirtualScrolling)
                            this.element.find(".e-gridContainer").height(this.element.find(".e-controlPanel").height() - (this.element.find("ul.clientTab").height() + 30));
                        else
                            this.element.find(".e-gridContainer").height(this.element.find(".e-controlPanel").height() - (this.element.find("ul.clientTab").height() + 17));
                    }
                }

            }
            if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == ej.PivotClient.DisplayMode.ChartAndGrid) {
                    if (this.defaultView() == ej.PivotClient.DefaultView.Grid) {
                        if (this.model.enablePaging)
                            this.element.find(".e-chartContainer").height((this.element.find(".e-controlPanel").height() / 2) + 15);
                        else
                            this.element.find(".e-chartContainer").height((this.element.find(".e-controlPanel").height() / 2) - 10);
                        if (!this.model.isResponsive && !this.model.enableSplitter)
                            this.element.find(".e-chartContainer").width(this.element.find(".e-controlPanel").width() - 21);
                    }
                    else {
                        this.element.find(".e-chartContainer").height((this.element.find(".e-controlPanel").height() / 2) - 15);
                        if (!this.model.isResponsive && !this.model.enableSplitter)
                            this.element.find(".e-chartContainer").width(this.element.find(".e-controlPanel").width() - 20)
                    }
                }
                else {
                    if (this.displayMode() == ej.PivotClient.DisplayMode.ChartOnly) {
                        this.element.find(".e-chartContainer").height(this.element.find(".e-controlPanel").height() - 17);
                        if (!this.model.isResponsive && !this.model.enableSplitter)
                            this.element.find(".e-chartContainer").width(this.element.find(".e-controlPanel").width() - 20);
                    }
                    else {
                        var diffHeight = this.element.find(".e-controlPanel").height() - (this.element.find("ul.clientTab").height() + 20);
                        if (this.model.enableVirtualScrolling)
                            this.element.find(".e-chartContainer").height(diffHeight - 5);
                        else if (this.model.enablePaging)
                            this.element.find(".e-chartContainer").height(diffHeight);
                        else
                            this.element.find(".e-chartContainer").height(diffHeight - 2);
                    }
                }

            }

            this._chartHeight = this.model.enableToolBar ? (this.model.enablePaging ? (this.element.find(".e-chartContainer").height() - (105)) : this.element.find(".e-chartContainer").height() - 68) + "px" : (this.model.enablePaging ? this.element.find(".e-chartContainer").height() - 40 : this.element.find(".e-chartContainer").height() - 3) + "px";
            this._chartWidth = (this.model.isResponsive || this.model.enableSplitter) ? "99%" : (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? this.element.find(".e-chartContainer").width() - 7 + "px" : (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == ej.PivotClient.DisplayMode.ChartAndGrid ? this.element.find(".e-chartContainer").width() - 8 + "px" : this.element.find(".e-chartContainer").width() - 15 + "px"));
            this._gridHeight = this.model.enableToolBar ? (this.model.enablePaging ? this.element.find(".e-gridContainer").height() - 78 + "px" : this.element.find(".e-gridContainer").height() - 46 + "px") : this.element.find(".e-gridContainer").height() - 10 + "px";
            this._gridWidth = (this.model.isResponsive || this.model.enableSplitter) ? "98%" : (this.model.enableToolBar && !(this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) ? this.element.find(".e-gridContainer").width() - 16 + "px" : this.element.find(".e-gridContainer").width() - 6 + "px");
        },
        _reportToolbar: function () {
            return ej.buildTag("ul", (this.model.toolbarIconSettings.enableNewReport ? ej.buildTag("li.e-newReportImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("NewReport")).attr({ "title": this._getLocalizedLabels("NewReport"), tabindex: 0 })[0].outerHTML : "") +
			(this.model.toolbarIconSettings.enableAddReport ? ej.buildTag("li.e-addReportImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("AddReport")).attr({ "title": this._getLocalizedLabels("AddReport"), tabindex: 0 })[0].outerHTML : "") +
			(this.model.toolbarIconSettings.enableRemoveReport ? ej.buildTag("li.e-removeReportImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("RemoveReport")).attr({ "title": this._getLocalizedLabels("RemoveReport"), tabindex: 0 })[0].outerHTML : "") +
			(this.model.toolbarIconSettings.enableRenameReport ? ej.buildTag("li.e-renameReportImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("RenameReport")).attr({ "title": this._getLocalizedLabels("RenameReport"), tabindex: 0 })[0].outerHTML : "") +
			(this.model.toolbarIconSettings.enableDBManipulation ? ej.buildTag("li.e-reportDBImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("DBReport")).attr({ "title": this._getLocalizedLabels("DBReport"), tabindex: 0 })[0].outerHTML : "") +
			(this.model.toolbarIconSettings.enableMDXQuery && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ej.buildTag("li.e-mdxImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("MDXQuery")).attr({ "title": this._getLocalizedLabels("MDXQuery"), tabindex: 0 })[0].outerHTML : "") +
			((this.model.toolbarIconSettings.enableDeferUpdate && this.model.enableDeferUpdate && (this.model.analysisMode != ej.Pivot.AnalysisMode.Pivot) && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) ? (ej.buildTag("li.e-autoExecuteImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("DeferUpdate")).attr({ "title": this._getLocalizedLabels("DeferUpdate"), tabindex: 0 })[0].outerHTML) : "") +
  			(this.model.toolbarIconSettings.enableCalculatedMember ? ej.buildTag("li.e-calcMemberImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("CalculatedMember")).attr({ "title": this._getLocalizedLabels("CalculatedMember"), tabindex: 0 })[0].outerHTML : "") +
			(this.model.toolbarIconSettings.enableExcelExport ? ej.buildTag("li.e-excelExportImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("ExportToExcel")).attr({ "title": this._getLocalizedLabels("ExportToExcel"), tabindex: 0 })[0].outerHTML : "") +
			(this.model.toolbarIconSettings.enableWordExport ? ej.buildTag("li.e-wordExportImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("ExportToWord")).attr({ "title": this._getLocalizedLabels("ExportToWord"), tabindex: 0 })[0].outerHTML : "") +
			(this.model.toolbarIconSettings.enablePdfExport ? ej.buildTag("li.e-pdfExportImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("ExportToPdf")).attr({ "title": this._getLocalizedLabels("ExportToPdf"), tabindex: 0 })[0].outerHTML : "") +
			(this.model.toolbarIconSettings.enableFullScreen && this.model.displaySettings.enableFullScreen ? (ej.buildTag("li.maximizedView e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("FullScreen")).attr({ "title": this._getLocalizedLabels("FullScreen"), tabindex: 0 })[0].outerHTML) : "") +

			((this.model.operationalMode != ej.Pivot.OperationalMode.ClientMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) ?
			((this.model.toolbarIconSettings.enableSortOrFilterColumn ? ej.buildTag("li.e-colSortFilterImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("SortOrFilterColumn")).attr({ "title": this._getLocalizedLabels("SortOrFilterColumn"), tabindex: 0 })[0].outerHTML : "") +
			(this.model.toolbarIconSettings.enableSortOrFilterRow ? ej.buildTag("li.e-rowSortFilterImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("SortOrFilterRow")).attr({ "title": this._getLocalizedLabels("SortOrFilterRow"), tabindex: 0 })[0].outerHTML : "")) : "") +

			(this.model.toolbarIconSettings.enableToggleAxis ? ej.buildTag("li.e-toggleaxisImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("ToggleAxis")).attr({ "title": this._getLocalizedLabels("ToggleAxis"), tabindex: 0 })[0].outerHTML : "") +
            (this.model.toolbarIconSettings.enableChartTypes ? ej.buildTag("li.e-chartTypesImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("ChartTypes")).attr({ "title": this._getLocalizedLabels("ChartTypes"), tabindex: 0 })[0].outerHTML : "") +
            (this.model.showReportCollection ? ej.buildTag("li.e-collectionli", ej.buildTag("label.e-collectionLbl", this._getLocalizedLabels("Collection") + ": ", {})[0].outerHTML + ej.buildTag("div.e-collectiondiv", ej.buildTag("input.e-collectionlist", "", {})[0].outerHTML)[0].outerHTML, {}).attr("aria-label", this._getLocalizedLabels("Collection")).attr({ "title": this._getLocalizedLabels("Collection"), tabindex: 0 })[0].outerHTML + ej.buildTag("li.e-reportli", (this.model.showReportCollection ? ej.buildTag("label.e-reportLbl", this._getLocalizedLabels("Report") + ": ", {})[0].outerHTML : "") + ej.buildTag("li.e-reportCol e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("Report")).attr({ "title": this._getLocalizedLabels("ReportList"), tabindex: 0 })[0].outerHTML)[0].outerHTML : ej.buildTag("li.e-reportCol e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("Report")).attr({ "title": this._getLocalizedLabels("ReportList"), tabindex: 0 })[0].outerHTML))[0].outerHTML;
        },

        _clientGridDrillSuccess: function (args) {
            if (this._isChartDrillAction)
                this._isChartDrillAction = false;
            else {
                if (args.axis == "rowheader" && this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                    if (args.drillAction == "drilldown")
                        this._drillParams.push(args.drilledMember);
                    else
                        this._drillParams = $.grep(this._drillParams, function (item) { return item.indexOf(args.drilledMember) < 0; });
                    this._pivotChart._drillParams = this._drillParams;
                    var drillInfo = args.drilledMember.split(">#>");
                    this._pivotChart._labelCurrentTags.expandedMembers = drillInfo;
                    if (args.drillAction == "drillup") {
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                            this._pivotChart._labelCurrentTags.expandedMembers = [];
                            if (this._drillParams.length > 0)
                                this._getDrilledMember(args.drillAction);
                        }
                        else {
                            if (this._pivotChart._labelCurrentTags.expandedMembers.length == 0 && this._drillParams.length > 0)
                                this._getDrilledMember(args.drillAction);
                        }
                    }
                    this._pivotChart._drillAction = args.drillAction;
                    this._pivotChart.refreshControl();
                }
            }
        },

        _getDrilledMember: function (drillAction) {
            var member = this._drillParams[this._drillParams.length - 1];
            var drilledMembers = $.grep(this._drillParams, function (item) { return item.indexOf(member) >= 0 });
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                for (var i = 0; i < drilledMembers.length; i++)
                    if (drilledMembers[i].split(">#>").length > this._pivotChart._labelCurrentTags.expandedMembers.length)
                        this._pivotChart._labelCurrentTags.expandedMembers = drilledMembers[i].split(">#>");
            }
            else {
                var maxLength = drilledMembers[0].split(">#>").length, index = 0;
                for (var i = 1; i < drilledMembers.length; i++) {
                    if (drilledMembers[i].split(">#>").length > maxLength) {
                        index = i;
                        break;
                    }
                }
                this._drillInfo = drilledMembers[index].split(">#>");
                var dimensionIndex = 0;
                this._pivotChart._labelCurrentTags.expandedMembers = new Array();
                for (var i = 0; i < this._drillInfo.length; i++) {
                    if (ej.isNullOrUndefined(this._pivotChart._labelCurrentTags.expandedMembers[dimensionIndex])) this._pivotChart._labelCurrentTags.expandedMembers[dimensionIndex] = new Array();
                    if (i + 1 < this._drillInfo.length) {
                        if (!ej.isNullOrUndefined(ej.olap._mdxParser._splitCellInfo(this._drillInfo[i])) && !ej.isNullOrUndefined(ej.olap._mdxParser._splitCellInfo(this._drillInfo[i + 1])) &&
                            ej.olap._mdxParser._splitCellInfo(this._drillInfo[i]).hierarchyUniqueName == ej.olap._mdxParser._splitCellInfo(this._drillInfo[i + 1]).hierarchyUniqueName)
                            this._pivotChart._labelCurrentTags.expandedMembers[dimensionIndex].push(this._drillInfo[i]);
                        else
                            dimensionIndex++;
                    }
                    else {
                        this._pivotChart._labelCurrentTags.expandedMembers[dimensionIndex].push(this._drillInfo[i]);
                        this._isChartDrillAction = true;
                    }
                }
            }
        },
        _clearSorting: function (args) {
            if ($(args.target).parent().attr("disabled") == "disabled")
                return false;
            ej.Pivot.closePreventPanel(this);
            var pivotClientObj = this;
            var dataSource = this.model.dataSource;
            var currElement = this._schemaData._selectedFieldName.toLowerCase();
            var reportItem = $.map(dataSource.columns, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() == currElement)) return obj; });
            if (reportItem.length == 0) {
                reportItem = $.map(dataSource.rows, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() == currElement)) return obj; });
            }
            if (reportItem.length > 0) {
                delete reportItem[0]["sortOrder"];
            }
            this.model.dataSource = dataSource;
            this.element.find(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog)").remove();
            if (this._schemaData != null) {
                this._schemaData.element.find(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog)").remove();
            }
            pivotClientObj._isTimeOut = true;
            setTimeout(function () {
                if (pivotClientObj._isTimeOut)
                    pivotClientObj._waitingPopup.show();
            }, 800);
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                this.refreshControl();
            else
                ej.olap.base.getJSONData({ action: "clearSorting" }, this.model.dataSource, this);
        },

        _clientChartDrillSuccess: function (args) {
            var drillInfo = new Array();
            if (args.drilledMember != "") {
                drillInfo = args.drilledMember.split(">#>");
                this._isChartDrillAction = true;
            };
            if (args.drillAction == "drilldown" && !ej.isNullOrUndefined(this._pivotChart._labelCurrentTags.expandedMembers) && this._drillParams.indexOf(this._pivotChart._labelCurrentTags.expandedMembers.join(">#>")) == -1)
                this._drillParams.push(this._pivotChart._labelCurrentTags.expandedMembers.join(">#>"));
            var minRowIndex = 0, maxRowIndex = this._pivotGrid._rowCount;
            for (var i = 0; i < drillInfo.length; i++) {
                var rowheaders = (i == drillInfo.length - 1 && args.drillAction == "drilldown") ? this._pivotGrid.element.find(".e-pivotGridTable th.summary[data-p^='" + i + "']") : this._pivotGrid.element.find(".e-pivotGridTable th.rowheader[data-p^='" + i + "']");
                var targetCell = $.grep(rowheaders, function (headerCell) { return $(headerCell).clone().children().remove().end().text() == drillInfo[i]; });
                targetCell = $.grep(targetCell, function (headerCell) { return parseInt($(headerCell).attr('data-p').split(',')[1]) >= minRowIndex && parseInt($(headerCell).attr('data-p').split(',')[1]) <= maxRowIndex });
                if (i == drillInfo.length - 1)
                    $(targetCell).find("." + (args.drillAction == "drilldown" ? "e-expand" : "e-collapse")).trigger("click");
                else {
                    minRowIndex = parseInt($(targetCell).attr('data-p').split(',')[1]);
                    maxRowIndex = minRowIndex + parseInt($(targetCell).find("span").attr("data-tag")) + targetCell[0].rowSpan;
                }
            }
        },

        setChartDrillParams: function (drillMemberInfo, drillAction) {
            if (drillAction == "drilldown")
                this._drillParams.push(drillMemberInfo);
            else
                this._drillParams = $.grep(this._drillParams, function (item) { return item.indexOf(drillMemberInfo) < 0; });
            this._drillInfo = drillMemberInfo.split(">#>");
            var dimensionIndex = 0;
            this._pivotChart._labelCurrentTags.expandedMembers = new Array();
            var currIndex = this._drillInfo.length - 1;
            var hasSameParent = drillAction == "drillup" && this._drillParams.length > 0 && this._drillParams[this._drillParams.length - 1] != this._drillInfo.join(">#>") && this._drillParams[this._drillParams.length - 1].split(">#>").filter(function (index, item) { return index < currIndex }).join(">#>") == this._drillInfo.filter(function (index, item) { return index < currIndex }).join(">#>");
            var drillInfo = hasSameParent ? this._drillParams[this._drillParams.length - 1].split(">#>") : this._drillInfo;

            for (var i = 0; i < drillInfo.length; i++) {
                if (ej.isNullOrUndefined(this._pivotChart._labelCurrentTags.expandedMembers[dimensionIndex])) this._pivotChart._labelCurrentTags.expandedMembers[dimensionIndex] = new Array();
                if (i + 1 < drillInfo.length || hasSameParent) {
                    if (!ej.isNullOrUndefined(ej.olap._mdxParser._splitCellInfo(drillInfo[i])) && !ej.isNullOrUndefined(ej.olap._mdxParser._splitCellInfo(drillInfo[i + 1])) ?
                            ej.olap._mdxParser._splitCellInfo(drillInfo[i]).hierarchyUniqueName == ej.olap._mdxParser._splitCellInfo(drillInfo[i + 1]).hierarchyUniqueName : (i == drillInfo.length - 1 ? true : false))
                        this._pivotChart._labelCurrentTags.expandedMembers[dimensionIndex].push(drillInfo[i]);
                    else
                        dimensionIndex++;
                }
                else if (drillAction == "drilldown") {
                    this._pivotChart._labelCurrentTags.expandedMembers[dimensionIndex].push(drillInfo[i]);
                    this._isChartDrillAction = true;
                }
            }
            var drilledDimension = $.grep(this._pivotChart._labelCurrentTags.expandedMembers, function (expandedMembers) { return expandedMembers.length > 0 });
            if (drilledDimension.length == 0 && this._drillParams.length > 0) {
                this._getDrilledMember(drillAction);
                this._pivotGrid._drillAction = "drilldown";
            }
        },

        _setChartDrillMembers: function (pivotEngine) {
            if (this._drillInfo.length > 0 && !this._pivotChart.model.enableMultiLevelLabels) {
                var levelUniqueNames = new Array();
                var drillInfo = new Array();
                var rowItemIndex = 0;
                var exceedIndex = 0;
                var clonedEngine = this._pivotChart._cloneEngine(pivotEngine);

                var isDrilled = false;
                for (var i = 0; i < this._pivotChart._labelCurrentTags.expandedMembers.length; i++)
                    for (var j = 0; j < this._pivotChart._labelCurrentTags.expandedMembers[i].length; j++)
                        isDrilled = true;
                if (isDrilled) {
                    var drilledDimensionIndex;
                    var drilledMember = this._drillInfo[this._drillInfo.length - 1];
                    for (var i = 0; i < this.model.dataSource.rows.length; i++) {
                        var drilledHierarchy = ej.olap._mdxParser._splitCellInfo(drilledMember).hierarchyUniqueName;
                        if (this.model.dataSource.rows[i].fieldName == drilledHierarchy)
                            drilledDimensionIndex = i;
                    }
                    var measureInRows = this.model.dataSource.values[0].axis == "rows" ? 1 : 0, currIndex = this._drillInfo.length - 1;
                    var hasSameParent = this._pivotGrid._drillAction == "drillup" && this._drillParams.length > 0 && this._drillParams[this._drillParams.length - 1].split(">#>").filter(function (index, item) { return index < currIndex }).join(">#>") == this._drillInfo.filter(function (index, item) { return index < currIndex }).join(">#>");
                    if (!hasSameParent) {
                        if (clonedEngine[0 + exceedIndex][0].ColSpan > (this._drillInfo.length + this._pivotGrid._drillAction == "drilldown" ? 1 : 0))
                            for (var i = (this._drillInfo.length + (this._pivotGrid._drillAction == "drilldown" ? 1 : 0) + (this.model.dataSource.rows.length - (drilledDimensionIndex + 1))) ; (i + measureInRows) < clonedEngine[0 + exceedIndex][0].ColSpan; i++) {
                                clonedEngine.splice(i, 1);
                                clonedEngine[0][0].ColSpan--;
                            }

                        for (var i = 0; i < this._drillInfo.length - (this._pivotGrid._drillAction == "drillup" ? 1 : 0) ; i++) {
                            if (!ej.isNullOrUndefined(ej.olap._mdxParser._splitCellInfo(this._drillInfo[i])) && ej.olap._mdxParser._splitCellInfo(this._drillInfo[i]).hierarchyUniqueName != "") {
                                var drillCaption = ej.olap._mdxParser._splitCellInfo(this._drillInfo[i]).leveName;
                                this._pivotChart._cropData(clonedEngine, drillCaption, i + exceedIndex, false);
                            }
                        }
                    }
                    else {
                        for (var i = 0; i < this._drillParams[this._drillParams.length - 1].split(">#>").length ; i++) {
                            if (!ej.isNullOrUndefined(ej.olap._mdxParser._splitCellInfo(this._drillParams[this._drillParams.length - 1].split(">#>")[i])) && ej.olap._mdxParser._splitCellInfo(this._drillParams[this._drillParams.length - 1].split(">#>")[i]).hierarchyUniqueName != "") {
                                var drillCaption = ej.olap._mdxParser._splitCellInfo(this._drillParams[this._drillParams.length - 1].split(">#>")[i]).leveName;
                                this._pivotChart._cropData(clonedEngine, drillCaption, i + exceedIndex, false);
                            }
                        }
                    }
                    var columnIndex = 0;
                    if (!ej.isNullOrUndefined(this._pivotChart._labelCurrentTags.expandedMembers)) {
                        for (var i = 0; i < this._pivotChart._labelCurrentTags.expandedMembers.length; i++) {
                            if (!ej.isNullOrUndefined(this._pivotChart._labelCurrentTags.expandedMembers[i])) {
                                if (i > drilledDimensionIndex) {
                                    for (var j = 0; j < this._pivotChart._labelCurrentTags.expandedMembers[i].length; j++) {
                                        var selectedMember = this._pivotChart._labelCurrentTags.expandedMembers[i][j].split("::")[2];
                                        this._pivotChart._cropData(clonedEngine, selectedMember, i + exceedIndex, true);
                                        exceedIndex++;
                                    }
                                }
                                else {
                                    for (var j = 0; j < this._pivotChart._labelCurrentTags.expandedMembers[i].length; j++) {
                                        exceedIndex++;
                                    }
                                }
                            }
                        }
                    }
                }
                this._drillInfo = [];
                this._pivotChart._generateData(clonedEngine);
            }
            else
                this._pivotChart.generateJSON(this, pivotEngine);
        },
        refreshPagedPivotClient: function (axis, pageNo) {
            var report;
            var pivotClientObj = this;
            if (!ej.isNullOrUndefined(this._waitingPopup)) {
                pivotClientObj._isTimeOut = true;
                setTimeout(function () {
                    if (pivotClientObj._isTimeOut)
                        pivotClientObj._waitingPopup.show();
                }, 800);
            }
            axis = axis.indexOf('categ') != -1 ? "categorical" : "series";
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                if (axis == "categorical")
                    this._categCurrentPage = parseInt(pageNo);
                else
                    this._seriesCurrentPage = parseInt(pageNo);
                ej.olap.base.getJSONData({ action: "navPaging" }, this.model.dataSource, this);
            }
            else if (this.currentReport != "") {
                try { report = JSON.parse(this.currentReport); }
                catch (err) { report = this.currentReport; }
                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.paging, JSON.stringify({ "action": "paging", "pagingInfo": axis + ":" + pageNo, "currentReport": report, "layout": ej.PivotGrid.Layout.NoSummaries, "customObject": null }), this.refreshPagedPivotClientSuccess);
            }
        },
        refreshPagedPivotClientSuccess: function (msg) {
            var chartData = [];
            if (msg.d != undefined) {
                chartData = $.map(msg.d, function (ele, indx) { if (ele.Key == "JsonRecords") return ele; });
                $.merge(chartData, $.map(msg.d, function (ele, indx) { if (ele.Key == "OlapReport") return ele; }));
                this.reports = $.map(msg.d, function (ele, indx) { if (ele.Key == "ClientReports") return ele.Value; }).toString();
            }
            else {
                this.reports = msg.ClientReports;
                delete msg.ClientReports;
                chartData = msg;
            }
            if (this.model.displaySettings.mode == ej.PivotClient.DisplayMode.GridOnly) {
                this._pivotGrid._renderControlSuccess(msg);
            } else if (this.model.displaySettings.mode == ej.PivotClient.DisplayMode.ChartOnly)
                this._pivotChart.renderControlSuccess(chartData);
            else if (this.model.displaySettings.mode = ej.PivotClient.DisplayMode.ChartAndGrid) {
                this._pivotGrid._renderControlSuccess(msg);
                this._pivotChart.renderControlSuccess(chartData);
            }
        },

        _hiddenCellInfo: function (report) {
            var colHiddenCells = ($.map(report, function (item) { if (item.Key == "FilteredColumnHeaders") return item.Value; }));
            var rowHiddenCells = ($.map(report, function (item) { if (item.Key == "FilteredRowHeaders") return item.Value; }));
            return { columnArea: (colHiddenCells.length > 0) ? colHiddenCells[0] : colHiddenCells, rowArea: (rowHiddenCells.length > 0) ? rowHiddenCells[0] : [] }
        },

        _loadCollectionList: function (args) {
            var reportNameList = "";
            if (args[0] != undefined) {
                reportNameList = !ej.isNullOrUndefined(args[0].Value) ? args[0].Value : "";
            }
            else if (args.d != undefined) {
                reportNameList = !ej.isNullOrUndefined(args.d[0].Value) ? args.d[0].Value : "";
            }
            else {
                reportNameList = args.ReportNameList;
            }
            reportNameList = reportNameList != "" ? reportNameList.split("__") : [];
            this.element.find(".e-collectionlist").ejDropDownList({
                dataSource: reportNameList,
                enableRTL: this.model.enableRTL,
                fields: { text: "name", value: "name" },
                height: "26px",
                change: ej.proxy(this._collectionChange, this),
                create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
            });
            if (this._currentCollection != "" && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                this.element.find(".e-collectionlist").data("ejDropDownList").option("change", "");
                this.element.find(".e-collectionlist").data("ejDropDownList").selectItemByText(this._currentCollection);
                this.element.find(".e-collectionlist").ejDropDownList("option", "change", ej.proxy(this._collectionChange, this));
            }
        },

        _fetchCollectionList: function () {
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.fetchReportList, JSON.stringify({ "customObject": serializedCustomObject, "action": "LoadReport", operationalMode: this.model.operationalMode, analysisMode: this.model.analysisMode }), function (args) {
                    this._loadCollectionList(args);
                });
            }
            else {
                var fetchReportSetting = { url: "", reportCollection: this._clientReportCollection, reportList: "", mode: this.model.analysisMode }
                this._trigger("fetchReport", { targetControl: this, fetchReportSetting: fetchReportSetting });
                if (this.model.enableLocalStorage) {
                    this._loadCollectionList({ d: [{ Key: "ReportNameList", Value: fetchReportSetting.reportList }] });
                } else {
                    var serializedCustomObject = JSON.stringify(this.model.customObject);
                    this.doAjaxPost("POST", fetchReportSetting.url + "/" + this.model.serviceMethodSettings.fetchReportList, JSON.stringify({ "customObject": serializedCustomObject, "action": "LoadReport", operationalMode: this.model.operationalMode, analysisMode: this.model.analysisMode, }), function (args) {
                        this._loadCollectionList(args);
                    });
                }
            }
        },

        _renderControlSuccess: function (msg) {
			if(ej.isNullOrUndefined(this.model))
				return false;
            ej.Pivot._updateValueSortingIndex(msg, this);
            if (this.model.isResponsive || this.model.collapseCubeBrowserByDefault)
                this.model.displaySettings.enableTogglePanel = true;
            var eventArgs = { element: this.element, customObject: this.model.customObject };
            this._trigger("load", eventArgs);
            var cubes = "", columnElements = "", rowElements = "", slicerElements = "", cubeTreeInfo = "";
            if (msg[0] != undefined) {
                //msg.DataModel
                cubes = msg[0].Value; columnElements = msg[1].Value; rowElements = msg[2].Value;
                slicerElements = msg[3].Value; cubeTreeInfo = msg[4].Value; this.currentReport = this._deferReport = msg[5].Value;
                this.reports = msg[6].Value; this.reportsCount = msg[7].Value; reportList = $.parseJSON(msg[8].Value);
                if (this.model.enableMeasureGroups) this.measureGroupInfo = $.parseJSON(msg[9].Value);
                this.currentCubeName = msg[10].Value;
                if (msg[11] != null && msg[11] != undefined)
                    this.model.customObject = msg[11].Value;
            }
            else if (msg.d != undefined) {
                //this.model.analysisMode = msg.DataModel == "Olap" ? ej.Pivot.AnalysisMode.Olap : ej.Pivot.AnalysisMode.Pivot;
                if (ej.isNullOrUndefined(msg.d[3]) || msg.d[3].Value == "Pivot") {
                    this.model.analysisMode = ej.Pivot.AnalysisMode.Pivot;
                    this._currentReportName = "Default";
                    var hiddenCellCol = this._hiddenCellInfo(msg.d);
                    if (msg.d.length > 4 && msg.d[4].Value == "LoadReport") {
                        this._clientReportCollection = JSON.parse(msg.d[5].Value);

                        this._renderClientControls({
                            PivotReport: msg.d[0].Value, GridJSON: msg.d[1].Value, ChartJSON: msg.d[2].Value,
                            FilteredColumnHeaders: hiddenCellCol.columnArea.length > 0 ? (hiddenCellCol.columnArea) : "[]",
                            FilteredRowHeaders: (hiddenCellCol.rowArea.length > 0) ? (hiddenCellCol.rowArea) : "[]"
                        });
                        var reportList = $.map(this._clientReportCollection, function (item, index) { if (item.name != undefined) { return { name: item.name } } });
                        var reportLists = this.element.find(".reportlist").data("ejDropDownList");
                        this.element.find(".reportlist").ejDropDownList("option", "dataSource", (reportList));
                        reportLists.selectItemByText(reportList[0].name);
                        this._unWireEvents();
                        this._wireEvents();
                    }
                    else {
                        if (this.model.enableDrillThrough && !ej.isNullOrUndefined(msg.d[4].Value))
                            this.dataSet = msg.d[4].Value;
                        this._clientReportCollection = [{ name: "Default", report: $.parseJSON(msg.d[0].Value).Report }];
                        this._renderClientControls(
                            {
                                PivotReport: msg.d[0].Value, GridJSON: msg.d[1].Value, ChartJSON: msg.d[2].Value,
                                FilteredColumnHeaders: hiddenCellCol.columnArea.length > 0 ? (hiddenCellCol.columnArea[0]) : "[]",
                                FilteredRowHeaders: (hiddenCellCol.rowArea.length > 0) ? (hiddenCellCol.rowArea[0]) : "[]"
                            });
                    }
                    return;
                }
                else {
                    cubes = msg.d[0].Value; columnElements = msg.d[1].Value; rowElements = msg.d[2].Value;
                    slicerElements = msg.d[3].Value; cubeTreeInfo = msg.d[4].Value; this.currentReport = this._deferReport = msg.d[5].Value;
                    this.reports = msg.d[6].Value; this.reportsCount = msg.d[7].Value; reportList = $.parseJSON(msg.d[8].Value);
                    if (this.model.enableMeasureGroups) this.measureGroupInfo = $.parseJSON(msg.d[9].Value);
                    this.currentCubeName = msg.d[10].Value;
                    if (msg.d[11] != null && msg.d[11] != undefined)
                        this.model.customObject = msg.d[11].Value;
                }
            }
            else {
                if (msg != "") {
                    if (!ej.isNullOrUndefined(msg.DataModel) && msg.DataModel != "Olap") {
                        this.model.analysisMode = ej.Pivot.AnalysisMode.Pivot;
                        this._currentReportName = ej.isNullOrUndefined(msg.ReportCollection) ? "Default" : JSON.parse(msg.ReportCollection)[0].name;
                        this._clientReportCollection = ej.isNullOrUndefined(msg.ReportCollection) ? [{ name: "Default", report: $.parseJSON(msg.PivotReport).Report }] : JSON.parse(msg.ReportCollection);
                        if (!ej.isNullOrUndefined(msg.DataSet))
                            this.dataSet = msg.DataSet;
                        this._renderClientControls(msg);
                        return;
                    }
                    else {
                        this.model.analysisMode = ej.Pivot.AnalysisMode.Olap;
                        cubes = msg.Cubes; columnElements = msg.Columns; rowElements = msg.Rows;
                        slicerElements = msg.Slicers; cubeTreeInfo = msg.CubeTreeInfo; this.currentReport = msg.CurrentReport;
                        this.reports = msg.ClientReports; reportList = $.parseJSON(msg.ReportList); this.reportsCount = msg.ReportsCount;
                        if (this.model.enableMeasureGroups) this.measureGroupInfo = $.parseJSON(msg.MeasureGroups);
                        this.currentCubeName = msg.CurrentCubeName;
                        if (msg.customObject != null && msg.customObject != undefined)
                            this.model.customObject = msg.customObject;
                    }
                }
            }
            if (this.model.afterServiceInvoke != null)
                this._trigger("afterServiceInvoke", { action: "initialize", element: this.element, customObject: this.model.customObject });
            var treeViewData = null;
            if (msg != "")
                treeViewData = $.parseJSON(cubeTreeInfo);
            var reportBar = ej.buildTag("div.e-reportToolbar#reportToolbar", this._reportToolbar(), { width: "410px", height: "29px" })[0].outerHTML;
            var browserPanel, htmlTag;
            if (this.model.enableSplitter) {
                if (!this.model.isResponsive) {
                    if (this.model.enableRTL) {
                        if (this.model.enableVirtualScrolling) {
                            browserPanel = this._createCubeSelector() + "<table class=e-cubeTable style='width:100%'><tr class='e-serverchildsplit' style='width:98%'><td class=axisBuilderTD valign=\"bottom\" style='width:47%'>" + this._createAxisElementBuilder(columnElements, rowElements, slicerElements) + "</td><td class=cdbTD valign=\"bottom\" style='width:47%;'>" + this._createCubeBrowser(cubeTreeInfo) + "</td></tr></table>";//+ (this.model.enableRTL ? "padding-right:5px;" : "padding-left:" + this.model.enableSplitter ? "0px" : "5px") 
                            htmlTag = ej.buildTag("div.outerPanel", "", {}).append("<div class=\"e-titleText\"><span>" + this.title() + "</span></div>" + reportBar + "<table class=\"e-outerTable\" style='width:100%'><tr class='e-serverparentsplit' style='width:100%'><td style='width:49%'>" + browserPanel + "</td><td class=\"controlPanelTD\" style='width:49%;'>" + this._controlPanel() + "</td>" + (this.model.enableVirtualScrolling ? ej.buildTag("td.virtualScrolling", ej.buildTag("div.e-vScrollPanel")[0].outerHTML)[0].outerHTML : "") + "</tr></table>");
                        }
                        else {
                            browserPanel = this._createCubeSelector() + "<table class=e-cubeTable style='width:98%'><tr class='e-serverchildsplit'><td class=axisBuilderTD valign=\"bottom\" style='" + (this.model.enableRTL ? "padding-right:0px;" : "padding-left:" + this.model.enableSplitter ? "0px" : "5px") + "'>" + this._createAxisElementBuilder(columnElements, rowElements, slicerElements) + "</td><td class=cdbTD valign=\"bottom\"'>" + this._createCubeBrowser(cubeTreeInfo) + "</td></tr></table>";
                            htmlTag = ej.buildTag("div.outerPanel", "", {}).append("<div class=\"e-titleText\"><span>" + this.title() + "</span></div>" + reportBar + "<table class=\"e-outerTable\" style='width:100%'><tr class='e-serverparentsplit'><td class=\"controlPanelTD\">" + this._controlPanel() + "</td><td>" + browserPanel + "</td>" + (this.model.enableVirtualScrolling ? ej.buildTag("td.virtualScrolling", ej.buildTag("div.e-vScrollPanel")[0].outerHTML)[0].outerHTML : "") + "</tr></table>");
                        }
                    }
                    else {
                        browserPanel = this._createCubeSelector() + "<table class=e-cubeTable style='width:100%'><tr class='e-serverchildsplit' style='width:100%'><td class=cdbTD valign=\"bottom\" style='width:47%;'>" + this._createCubeBrowser(cubeTreeInfo) + "</td><td class=axisBuilderTD valign=\"bottom\" style='" + (this.model.enableRTL ? "padding-right:5px;" : "padding-left:" + this.model.enableSplitter ? "0px" : "5px") + "width:47%'>" + this._createAxisElementBuilder(columnElements, rowElements, slicerElements) + "</td></tr></table>";
                        htmlTag = ej.buildTag("div.outerPanel", "", {}).append("<div class=\"e-titleText\"><span>" + this.title() + "</span></div>" + reportBar + "<table class=\"e-outerTable\" style='width:100%'><tr class='e-serverparentsplit' style='width:100%'><td style='width:49%'>" + browserPanel + "</td><td class=\"controlPanelTD\" style='width:49%'>" + this._controlPanel() + "</td>" + (this.model.enableVirtualScrolling ? ej.buildTag("td.virtualScrolling", ej.buildTag("div.e-vScrollPanel")[0].outerHTML)[0].outerHTML : "") + "</tr></table>");
                    }
                }

                else {
                    browserPanel = this._createCubeSelector() + ej.buildTag("table.e-cubeTable", ej.buildTag("tbody", ej.buildTag("tr.e-serversplitresponsive", ej.buildTag("td.cubeTableTD", this._createCubeBrowser(cubeTreeInfo)).attr({ valign: "bottom" }).css("width", "50%")[0].outerHTML + ej.buildTag("td.cubeTableTD", this._createAxisElementBuilder(columnElements, rowElements, slicerElements)).attr({ valign: "bottom" }).css("width", "50%")[0].outerHTML).css("width", "100%")[0].outerHTML)[0].outerHTML)[0].outerHTML;
                    htmlTag = ej.buildTag("div.outerPanel", "").append(($.trim(this.model.title) != "" ? (ej.buildTag("div.e-titleText", ej.buildTag("span", this.title(), { "padding-left": "10px" })[0].outerHTML)[0].outerHTML) : "") + reportBar + ej.buildTag("table.oClientTbl", ej.buildTag("tr", ej.buildTag("td", ej.buildTag("table.e-outerTable", ej.buildTag("tr", ej.buildTag("td", browserPanel)[0].outerHTML)[0].outerHTML)[0].outerHTML + ej.buildTag("table.controlPanelTD", ej.buildTag("tr", ej.buildTag("td", this._controlPanel())[0].outerHTML + (this.model.enableVirtualScrolling ? ej.buildTag("td.virtualScrolling", ej.buildTag("div.e-vScrollPanel")[0].outerHTML)[0].outerHTML : ""))[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML, { width: "100%" })[0].outerHTML);
                }
            }
            else {
                if (!this.model.isResponsive) {
                    browserPanel = this._createCubeSelector() + "<table class=e-cubeTable><tr><td class=cdbTD valign=\"bottom\" style='display:block'>" + this._createCubeBrowser(cubeTreeInfo) + "</td><td class=axisBuilderTD valign=\"bottom\" style='" + (this.model.enableRTL ? "padding-right:5px;" : "padding-left:5px;") + "'>" + this._createAxisElementBuilder(columnElements, rowElements, slicerElements) + "</td></tr></table>";
                    htmlTag = ej.buildTag("div.outerPanel", "", {}).append("<div class=\"e-titleText\"><span>" + this.title() + "</span></div>" + reportBar + "<table class=\"e-outerTable\"><tr><td>" + browserPanel + "</td><td class=\"controlPanelTD\" style='display:block'>" + this._controlPanel() + "</td>" + (this.model.enableVirtualScrolling ? ej.buildTag("td.virtualScrolling", ej.buildTag("div.e-vScrollPanel")[0].outerHTML)[0].outerHTML : "") + "</tr></table>");
                }
                else if (this.model.isResponsive) {
                    browserPanel = this._createCubeSelector() + ej.buildTag("table.e-cubeTable", ej.buildTag("tbody", ej.buildTag("tr", ej.buildTag("td.cubeTableTD", this._createCubeBrowser(cubeTreeInfo)).attr({ valign: "bottom", width: "50%", height: "100%" }).css({ "table-layout": "fixed", "display": "initial" })[0].outerHTML + ej.buildTag("td.cubeTableTD", this._createAxisElementBuilder(columnElements, rowElements, slicerElements)).attr({ valign: "bottom", width: "50%", height: "100%" })[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML;
                    htmlTag = ej.buildTag("div.outerPanel", "").append(($.trim(this.model.title) != "" ? (ej.buildTag("div.e-titleText", ej.buildTag("span", this.title(), { "padding-left": "10px" })[0].outerHTML)[0].outerHTML) : "") + reportBar + ej.buildTag("table.oClientTbl", ej.buildTag("tr", ej.buildTag("td", ej.buildTag("table.e-outerTable", ej.buildTag("tr", ej.buildTag("td", browserPanel)[0].outerHTML)[0].outerHTML)[0].outerHTML + ej.buildTag("table.controlPanelTD", ej.buildTag("tr", ej.buildTag("td", this._controlPanel())[0].outerHTML + (this.model.enableVirtualScrolling ? ej.buildTag("td.virtualScrolling", ej.buildTag("div.e-vScrollPanel")[0].outerHTML)[0].outerHTML : ""))[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML, { width: "100%", "table-layout": "fixed" })[0].outerHTML);
                }
            }
            this.element.html(htmlTag);
            this.element.find(".e-reportToolbar").ejToolbar({ enableRTL: this.model.enableRTL, height: "35px" });
            this._calculateSize();
            if (this.model.enableRTL) {
                this.element.addClass("e-rtl");
            }
            if ((this.controlPlacement() == ej.PivotClient.ControlPlacement.Tab && this.defaultView() == ej.PivotClient.DefaultView.Grid) || (this.displayMode() == ej.PivotClient.DisplayMode.GridOnly))
                this.element.find(".e-chartTypesImg").addClass("e-chartTypesOnGridView");
            var reportDropDown = "<div class ='reportList' ><input type='text' id='reportList' class='reportlist' title='" + this._getLocalizedLabels("ReportList") + "'/></div>";
            if (this.model.enableMeasureGroups) {
                this._createMeasureGroup();
            }
            $(this.element).find(".e-reportCol").append(reportDropDown);
            this.element.find(".reportlist").ejDropDownList({
                dataSource: reportList,
                enableRTL: this.model.enableRTL,
                fields: { text: "name", value: "name" },
                height: "26px",
                create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
            });
            if (this.model.showReportCollection)
                this._fetchCollectionList();
            this.element.find(".reportlist").attr("tabindex", 0);
            var tempddlwidth = this.element.find(".e-csHeader").width() - this.element.find(".cubeText").width() - (this.element.find(".e-toggleExpandButton").length > 0 ? this.element.find(".e-toggleExpandButton").width() : 0) - (((this.model.analysisMode == "olap" && this.model.operationalMode == "servermode") || this.model.enableSplitter) ? 20 : 50);
            var cubeddlWidth = this.enableTogglePanel() ? tempddlwidth - 25 : tempddlwidth;
            var cubeCollection = (cubes == "" ? "" : $.parseJSON(cubes));
            this.element.find(".cubeSelector").ejDropDownList({
                dataSource: cubeCollection,
                enableRTL: this.model.enableRTL,
                fields: { text: "name", value: "name" },
                width: this.model.enableSplitter && !this.model.isResponsive ? "100%" : "" + cubeddlWidth + "px"
            });

            this.ddlTarget = this.element.find('.cubeSelector').data("ejDropDownList");
            this.reportDropTarget = this.element.find('#reportList').data("ejDropDownList");
            if (msg != "" && !ej.isNullOrUndefined(this.ddlTarget)) {
                this.ddlTarget.selectItemByText(this.currentCubeName);
                if (this.reportDropTarget.model.dataSource.length)
                    this.reportDropTarget.selectItemByText(this.reportDropTarget.model.dataSource[0].name);
                this._selectedReport = this.reportDropTarget.currentValue;
            }
            this.element.find(".cubeSelector").ejDropDownList("option", "change", ej.proxy(this._cubeChanged, this));
            this.element.find(".cubeSelector").attr("tabindex", 0);
            this.element.find(".reportlist").ejDropDownList("option", "change", ej.proxy(this.reportChanged, this));
            if (this.model.enableMeasureGroups)
                this.element.find(".measureGroupSelector").ejDropDownList("option", "change", ej.proxy(this._measureGroupChanged, this));
            this.element.find(".e-cubeTreeView").ejTreeView({
                clientObj: this,
                fields: { id: "id", parentId: "pid", text: "name", spriteCssClass: "spriteCssClass", dataSource: treeViewData, parentUniqueName: "parentUniqueName" },
                allowDragAndDrop: true,
                enableRTL: this.model.enableRTL,
                allowDropChild: false,
                allowDropSibling: false,
                dragAndDropAcrossControl: true,
                nodeDragStart: function () {
                    this.model.clientObj.isDragging = true;
                },
                beforeDelete: function () {
                    return false;
                },
                cssClass: 'pivotTreeViewDragedNode',
                nodeDropped: ej.proxy(this._nodeDropped, this),
            });
            this.element.find(".e-cubeTreeView").attr("tabindex", 0);
            var treeViewElements = this.element.find(".e-cubeTreeView").find("li");
            for (var i = 0; i < treeViewElements.length; i++) {
                if (!ej.isNullOrUndefined(treeViewElements[i].id) && treeViewElements[i].id.indexOf("'").length > -1)
                    treeViewElements[i].setAttribute("id", treeViewElements[i].id.replace(/'/g, ""));
                treeViewElements[i].setAttribute("data-tag", treeViewData[i].tag);
                if (!ej.isNullOrUndefined(treeViewData[i].parentUniqueName) && treeViewData[i].parentUniqueName != "")
                    treeViewElements[i].setAttribute("data-parentUniqueName", !ej.isNullOrUndefined(treeViewData[i].parentUniqueName) ? treeViewData[i].parentUniqueName.split(">>||>>")[1] : "");
            }
            var folders = this.element.find(".e-cubeTreeView .e-folderCDB");
            for (var i = 0; i < folders.length; i++) {
                $(folders[i].parentElement).removeClass("e-draggable");
            }
            if (this.element.find(".e-cubeTreeView .e-kpiRootCDB").length > 0)
                this.element.find(".e-cubeTreeView .e-kpiRootCDB").parent().removeClass("e-draggable");
            if (this.element.find(".e-cubeTreeView .e-calcMemberGroupCDB").length > 0) {
                this.element.find(".e-cubeTreeView .e-calcMemberGroupCDB").parent().removeClass("e-draggable");
                var calcItem = this.element.find(".e-cubeTreeView .e-calcMemberCDB").parents("li").find("li");
                if (calcItem.length > 0) {
                    for (var i = 0; i < calcItem.length; i++) {
                        this._calcMembers.push(treeViewData[i + 1]);
                        calcItem[i].setAttribute("expression", treeViewData[i + 1].expression);
                        calcItem[i].setAttribute("formatString", treeViewData[i + 1].formatString);
                        calcItem[i].setAttribute("nodeType", treeViewData[i + 1].nodeType);
                    }
                }
            }

            this._cubeTreeView = this.element.find('.e-cubeTreeView').data("ejTreeView");
            var searchEditor = ej.buildTag("div.searchDiv", ej.buildTag("input#" + this._id + "_SearchTreeView.searchTreeView").attr("type", "text")[0].outerHTML, { "margin": "5px 5px 0px 0px" })[0].outerHTML;
            var cubeName = ej.buildTag("div.e-cubeName", this.currentCubeName + searchEditor);
            $(this.element).find(".e-cubeBrowser").prepend(cubeName);
            this.element.find("#" + this._id + "_SearchTreeView").ejMaskEdit({
                name: "inputbox",
                width: "100%",
                inputMode: ej.InputMode.Text,
                watermarkText: this._getLocalizedLabels("Search"),
                maskFormat: "",
                textAlign: this.model.enableRTL ? "right" : "left",
                change: ej.proxy(ej.Pivot._searchTreeNodes, this),
            });
            this.element.find(".e-categoricalAxis, .e-rowAxis, .e-slicerAxis").ejDroppable({ drop: ej.proxy(this._onDropped, this) });
            this.element.find(".e-categoricalAxis, .e-rowAxis, .e-slicerAxis").find("button").ejButton({ height: "20px", type: ej.ButtonType.Button });
            if (this.enableTogglePanel()) {
                $(ej.buildTag("div.e-toggleExpandButton e-icon", "", {}).attr("aria-label", "toggle expanded")[0].outerHTML).appendTo(this.element.find(".e-csHeader"));
                $(this.element.find(".e-outerTable").find("td")[0]).append(ej.buildTag("div.e-toggleCollapseButton e-icon", "", {}).attr("aria-label", "toggle collapsed")[0].outerHTML);
                $((ej.buildTag("div.e-toggleText")[0].outerHTML)).insertAfter(this.element.find(".e-toggleCollapseButton"));
                this.element.find(".e-toggleCollapseButton").hide();
                this.element.find(".e-toggleText").hide();
            }
            this._overflow();
            this._setSplitBtnTitle();
            this.element.find("#clientTab").ejTab({ enableRTL: this.model.enableRTL, itemActive: ej.proxy(this._onTabClick, this) });

            if (this.model.operationalMode != ej.Pivot.OperationalMode.ClientMode) {
                if (this.defaultView() == ej.PivotClient.DefaultView.Chart) {
                    this.element.find("#" + this._id + "_PivotChart").ejPivotChart({ url: this.model.url, customObject: this.model.customObject, enableRTL: this.model.enableRTL, enableDefaultValue: this.model.enableDefaultValue, axesLabelRendering: this.model.axesLabelRendering, pointRegionClick: this.model.pointRegionClick, canResize: this.model.isResponsive, currentReport: this.currentReport, locale: this.locale(), showTooltip: true, size: { height: this._chartHeight, width: this._chartWidth }, commonSeriesOptions: { type: this.model.chartType, tooltip: { visible: true } }, beforeServiceInvoke: this.model.chartLoad, drillSuccess: ej.proxy(this._chartDrillSuccess, this) });
                    if (this.gridLayout() != ej.PivotGrid.Layout.Normal)
                        this.element.find("#" + this._id + "_PivotGrid").ejPivotGrid({ url: this.model.url, customObject: this.model.customObject, isResponsive: this.model.isResponsive, enableRTL: this.model.enableRTL, enableDefaultValue: this.model.enableDefaultValue, enableCellSelection: this.model.enableCellSelection, cellSelection: this.model.cellSelection, hyperlinkSettings: { enableValueCellHyperlink: this.model.enableValueCellHyperlink, enableRowHeaderHyperlink: this.model.enableRowHeaderHyperlink, enableColumnHeaderHyperlink: this.model.enableColumnHeaderHyperlink, enableSummaryCellHyperlink: this.model.enableSummaryCellHyperlink }, enableCellContext: this.model.enableCellContext, enableDrillThrough: this.model.enableDrillThrough, enableCellEditing: this.model.enableCellEditing, enableCellDoubleClick: this.model.enableCellDoubleClick, enableCellClick: this.model.enableCellClick, valueCellHyperlinkClick: this.model.valueCellHyperlinkClick, rowHeaderHyperlinkClick: this.model.rowHeaderHyperlinkClick, columnHeaderHyperlinkClick: this.model.columnHeaderHyperlinkClick, summaryCellHyperlinkClick: this.model.summaryCellHyperlinkClick, cellContext: this.model.cellContext, cellEdit: this.model.cellEdit, cellDoubleClick: this.model.cellDoubleClick, enableCellClick: this.model.enableCellClick, drillThrough: this.model.drillThrough, currentReport: this.currentReport, layout: this.gridLayout(), locale: this.locale(), drillSuccess: ej.proxy(this._gridDrillSuccess, this) });
                    else
                        this.element.find("#" + this._id + "_PivotGrid").ejPivotGrid({ url: this.model.url, customObject: this.model.customObject, isResponsive: this.model.isResponsive, enableRTL: this.model.enableRTL, enableDefaultValue: this.model.enableDefaultValue, enableCellSelection: this.model.enableCellSelection, cellSelection: this.model.cellSelection, hyperlinkSettings: { enableValueCellHyperlink: this.model.enableValueCellHyperlink, enableRowHeaderHyperlink: this.model.enableRowHeaderHyperlink, enableColumnHeaderHyperlink: this.model.enableColumnHeaderHyperlink, enableSummaryCellHyperlink: this.model.enableSummaryCellHyperlink }, enableCellContext: this.model.enableCellContext, enableDrillThrough: this.model.enableDrillThrough, enableCellEditing: this.model.enableCellEditing, enableCellDoubleClick: this.model.enableCellDoubleClick, enableCellClick: this.model.enableCellClick, valueCellHyperlinkClick: this.model.valueCellHyperlinkClick, rowHeaderHyperlinkClick: this.model.rowHeaderHyperlinkClick, columnHeaderHyperlinkClick: this.model.columnHeaderHyperlinkClick, summaryCellHyperlinkClick: this.model.summaryCellHyperlinkClick, cellContext: this.model.cellContext, cellEdit: this.model.cellEdit, cellDoubleClick: this.model.cellDoubleClick, enableCellClick: this.model.enableCellClick, drillThrough: this.model.drillThrough, currentReport: this.currentReport, locale: this.locale(), drillSuccess: ej.proxy(this._gridDrillSuccess, this) });
                }
                else {
                    if (this.gridLayout() != ej.PivotGrid.Layout.Normal)
                        this.element.find("#" + this._id + "_PivotGrid").ejPivotGrid({ url: this.model.url, customObject: this.model.customObject, isResponsive: this.model.isResponsive, enableRTL: this.model.enableRTL, enableDefaultValue: this.model.enableDefaultValue, enableCellSelection: this.model.enableCellSelection, cellSelection: this.model.cellSelection, hyperlinkSettings: { enableValueCellHyperlink: this.model.enableValueCellHyperlink, enableRowHeaderHyperlink: this.model.enableRowHeaderHyperlink, enableColumnHeaderHyperlink: this.model.enableColumnHeaderHyperlink, enableSummaryCellHyperlink: this.model.enableSummaryCellHyperlink }, enableCellContext: this.model.enableCellContext, enableDrillThrough: this.model.enableDrillThrough, enableCellEditing: this.model.enableCellEditing, enableCellDoubleClick: this.model.enableCellDoubleClick, enableCellClick: this.model.enableCellClick, valueCellHyperlinkClick: this.model.valueCellHyperlinkClick, rowHeaderHyperlinkClick: this.model.rowHeaderHyperlinkClick, columnHeaderHyperlinkClick: this.model.columnHeaderHyperlinkClick, summaryCellHyperlinkClick: this.model.summaryCellHyperlinkClick, cellContext: this.model.cellContext, cellEdit: this.model.cellEdit, cellDoubleClick: this.model.cellDoubleClick, enableCellClick: this.model.enableCellClick, drillThrough: this.model.drillThrough, currentReport: this.currentReport, locale: this.locale(), layout: this.gridLayout(), drillSuccess: ej.proxy(this._gridDrillSuccess, this) });
                    else
                        this.element.find("#" + this._id + "_PivotGrid").ejPivotGrid({ url: this.model.url, customObject: this.model.customObject, isResponsive: this.model.isResponsive, enableRTL: this.model.enableRTL, enableDefaultValue: this.model.enableDefaultValue, enableCellSelection: this.model.enableCellSelection, cellSelection: this.model.cellSelection, hyperlinkSettings: { enableValueCellHyperlink: this.model.enableValueCellHyperlink, enableRowHeaderHyperlink: this.model.enableRowHeaderHyperlink, enableColumnHeaderHyperlink: this.model.enableColumnHeaderHyperlink, enableSummaryCellHyperlink: this.model.enableSummaryCellHyperlink }, enableCellContext: this.model.enableCellContext, enableDrillThrough: this.model.enableDrillThrough, enableCellEditing: this.model.enableCellEditing, enableCellDoubleClick: this.model.enableCellDoubleClick, enableCellClick: this.model.enableCellClick, valueCellHyperlinkClick: this.model.valueCellHyperlinkClick, rowHeaderHyperlinkClick: this.model.rowHeaderHyperlinkClick, columnHeaderHyperlinkClick: this.model.columnHeaderHyperlinkClick, summaryCellHyperlinkClick: this.model.summaryCellHyperlinkClick, cellContext: this.model.cellContext, cellEdit: this.model.cellEdit, cellDoubleClick: this.model.cellDoubleClick, enableCellClick: this.model.enableCellClick, drillThrough: this.model.drillThrough, currentReport: this.currentReport, locale: this.locale(), drillSuccess: ej.proxy(this._gridDrillSuccess, this) });
                    this.element.find("#" + this._id + "_PivotChart").ejPivotChart({ url: this.model.url, customObject: this.model.customObject, enableRTL: this.model.enableRTL, enableDefaultValue: this.model.enableDefaultValue, axesLabelRendering: this.model.axesLabelRendering, pointRegionClick: this.model.pointRegionClick, canResize: this.model.isResponsive, currentReport: this.currentReport, locale: this.locale(), showTooltip: true, size: { height: this._chartHeight, width: this._chartWidth }, commonSeriesOptions: { type: this.model.chartType, tooltip: { visible: true } }, drillSuccess: ej.proxy(this._chartDrillSuccess, this), beforeServiceInvoke: this.model.chartLoad });
                }
                if (this.model.enablePaging) {
                    this.element.find("#" + this._id + "_Pager").ejPivotPager({ mode: ej.PivotPager.Mode.Both, targetControlID: this._id });
                    this.element.find("#" + this._id + "_Pager").css("margin-top", "5px");
                    this.element.find(".e-controlPanel").height(this.element.find(".e-controlPanel").height() - (this.element.find("#" + this._id + "_Pager").height() + 5));
                    this.element.find(".e-gridContainer").height(this.element.find(".e-gridContainer").height() - (this.element.find("#" + this._id + "_Pager").height() + 5));
                    this.element.find(".e-chartContainer").height(this.element.find(".e-chartContainer").height() - (this.element.find("#" + this._id + "_Pager").height() + 10));

                }
                if (this.displayMode() != "chartonly")
                    this._pivotGrid = this.element.find("#" + this._id + "_PivotGrid").data("ejPivotGrid");
                if (this.displayMode() != "gridOnly")
                    this._pivotChart = this.element.find('#' + this._id + '_PivotChart').data("ejPivotChart");
                var items = {};
                if (this._pivotChart != null) {
                    this.element.find('#' + this._id + '_PivotChart').width(this._pivotChart.model.size.width);
                    this.element.find('#' + this._id + '_PivotChartContainer').width(this._pivotChart.model.size.width);
                    items["chartModelWidth"] = this._pivotChart.model.size.width;
                }
                items["controlPanelWidth"] = this.element.find(".e-controlPanel").width();
                items["chartOuterWidth"] = this._chartWidth;
                items["gridOuterWidth"] = this._gridWidth;
                this._initStyles.push(items);
                this._wireEvents();
                if (this.model.isResponsive) {
                    this._enableResponsive();
                    this._parentElwidth = $("#" + this._id).parent().width();
                    if (this._parentElwidth < 850) {
                        this._rwdToggleCollapse();
                    }
                    else if (this._parentElwidth > 850) {
                        this._rwdToggleExpand();
                    }
                    if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == "chartandgrid" && this._currentTab == "chart")
                        this.element.find(".e-chartContainer").css({ "width": "99.6%" });
                }
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode != ej.Pivot.OperationalMode.ClientMode) {
                    var tempddlwidth = this.element.find(".e-csHeader").width() - this.element.find(".cubeText").width() - this.element.find(".e-toggleExpandButton").width() - (this.model.enableSplitter ? 50 : 20);
                    var cubeddlWidth = this.enableTogglePanel() ? tempddlwidth - 25 : tempddlwidth;
                    var cubeCollection = (cubes == "" ? "" : $.parseJSON(cubes));
                    this.element.find(".cubeSelector").ejDropDownList({
                        width: this.model.enableSplitter && !this.model.isResponsive ? "100%" : "" + cubeddlWidth + "px",
                    });
                }
                this._trigger("renderSuccess", this);
                this._successAction = "ClientRender";
                this.progressPos = $("#" + this._id).position();
                this._treeContextMenu();
                this._buttonContextMenu();
                if (this.model.analysisMode == "olap" && this.model.operationalMode == "servermode" && this.model.enableSplitter)
                    this._createSplitter();
                if (!ej.isNullOrUndefined(msg.Exception)) {
                    ej.Pivot._createErrorDialog(msg, "Exception", this);
                }
                if (this.model.showUniqueNameOnPivotButton) {
                    $(".e-pvtBtn").addClass("e-splitBtnUnique");
                    this._addSplitButtonHeight();
                }
            }
            if (this.model.collapseCubeBrowserByDefault) {
                this._collapseCubeBrowser();
                this._isCollapseCB = true;
            }
        },

        _collectionChange: function (args) {
            this._currentCollection = args.selectedText;
            this._waitingPopup.show();
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                this.chartObj = this.element.find("#" + this._pivotChart._id + "Container").data("ejChart");
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.loadReport, JSON.stringify({
                    "reportName": args.selectedText, operationalMode: this.model.operationalMode, analysisMode: this.model.analysisMode, "olapReport": this.currentReport, "clientReports": this.reports, "customObject": serializedCustomObject, "clientParams": JSON.stringify(this.model.enableMeasureGroups)
                }), (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? this._renderControlSuccess : this._toolbarOperationSuccess));
            }
            else {
                var loadReportSetting = { url: "", reportCollection: this._clientReportCollection, selectedReport: args.selectedText, mode: this.model.analysisMode }
                this._trigger("loadReport", { targetControl: this, loadReportSetting: loadReportSetting });
                if (this.model.enableLocalStorage) {
                    this.model.dataSource = loadReportSetting.reportCollection[0];
                    this._clientReportCollection = loadReportSetting.reportCollection;
                    this.refreshControl();
                    this._refreshReportList();
                    if (this._pivotSchemaDesigner)
                        this._pivotSchemaDesigner._refreshPivotButtons();
                } else {
                    var serializedCustomObject = JSON.stringify(this.model.customObject);
                    this.doAjaxPost("POST", loadReportSetting.url + "/" + this.model.serviceMethodSettings.loadReport, JSON.stringify({
                        "reportName": args.selectedText, operationalMode: this.model.operationalMode, analysisMode: this.model.analysisMode, "olapReport": this.currentReport, "clientReports": this.reports, "customObject": serializedCustomObject, "clientParams": JSON.stringify(this.model.enableMeasureGroups)
                    }), (this._clientToolbarOperationSuccess));
                }
            }
        },

        _contextOpen: function (args) {
            if (this.element.find(".dragClone").length > 0)
                return 0;
            ej.Pivot.openPreventPanel(this);
            var menuObj = $("#pivotTree").data('ejMenu');
            this._selectedMember = $(args.target);
            menuObj.enableItem(this._getLocalizedLabels("AddToColumn"));
            menuObj.enableItem(this._getLocalizedLabels("AddToRow"));
            menuObj.enableItem(this._getLocalizedLabels("AddToSlicer"));
        },

        _contextClick: function (args) {
            ej.Pivot.closePreventPanel(this);
            var axisName = args.events.text;
            var droppedPosition = "";
            var pivotClientObj = this;
            axisName = axisName == this._getLocalizedLabels("AddToSlicer") ? "Slicer" : axisName == this._getLocalizedLabels("AddToColumn") ? "Categorical" : axisName == this._getLocalizedLabels("AddToRow") ? "Series" : "";
            if (axisName == "Slicer" && this._selectedMember != null && this._selectedMember.parent().attr("data-tag").indexOf("Measure") > -1 && this.element.find(".e-splitBtn[data-tag*=Measures]").length > 1) {
                ej.Pivot._createErrorDialog(this._getLocalizedLabels("MultipleMeasure"), this._getLocalizedLabels("Warning"), this);
                return false;
            }
            pivotClientObj._isTimeOut = true;
            setTimeout(function () {
                if (pivotClientObj._isTimeOut)
                    pivotClientObj._waitingPopup.show();
            }, 800);
            if (this.model.beforeServiceInvoke != null)
                this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.customObject });
            var serializedCustomObject = JSON.stringify(this.model.customObject);
            var params = this.currentCubeName + "--" + this._selectedMember.parent().attr("data-tag") + "--" + axisName + "--" + droppedPosition;
            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.nodeDropped, JSON.stringify({ "action": "nodeDropped", "dropType": "SplitButton", "nodeInfo": params, "olapReport": this.currentReport, "clientReports": this.reports, "customObject": serializedCustomObject }), this._nodeDroppedSuccess);

        },

        _onContextOpen: function (args) {
            if ($(args.target).find(".e-folderCDB").length > 0 || $(args.target).find(".e-calcMemberGroupCDB").length > 0)
                return false;
            ej.Pivot.openPreventPanel(this);
            var menuObj = $("#pivotTreeContext").data('ejMenu');
            this._selectedMember = $(args.target);
            menuObj.enableItem(this._getLocalizedLabels("AddToColumn"));
            menuObj.enableItem(this._getLocalizedLabels("AddToRow"));
            if ($(args.target).find(".e-calcMemberCDB").length > 0)
                menuObj.showItems(["#Remove"]);
            else
                menuObj.hideItems(["#Remove"]);
            $(args.target.parentElement).find(".e-namedSetCDB").length > 0 ? menuObj.disableItem(this._getLocalizedLabels("AddToSlicer")) : menuObj.enableItem(this._getLocalizedLabels("AddToSlicer"));
        },

        _onTreeContextClick: function (args) {
            if (!ej.isNullOrUndefined(this._curFocus.tree)) {
                this._curFocus.tree.attr("tabindex", "-1").focus().addClass("e-hoverCell");
            }
            else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                this._curFocus.tab.attr("tabindex", "-1").focus().addClass("e-hoverCell");
            }
            delete this._fieldMembers[this._dimensionName.split(":").length > 1 ? this._dimensionName.split(":")[1] : this._dialogTitle];
            delete this._fieldSelectedMembers[this._dimensionName.split(":").length > 1 ? this._dimensionName.split(":")[1] : this._dialogTitle];
            ej.Pivot.closePreventPanel(this);
            var axisName = args.events.text;
            var droppedPosition = "";
            var pivotClientObj = this;
            pivotClientObj._isTimeOut = true;
            if (axisName == this._getLocalizedLabels("Remove")) {
                setTimeout(function () {
                    if (pivotClientObj._isTimeOut)
                        pivotClientObj._waitingPopup.show();
                }, 800);
                var clientBtns = this.element.find(".e-splitBtn");
                jQuery.each(clientBtns, function (index, value) {
                    if ($(clientBtns[index]).attr("data-tag").split(":")[1] == pivotClientObj._selectedMember.parent().parent().attr("data-tag").replace(/\[/g, "").replace(/\]/g, "")) {
                        $(value).remove();
                    }
                });
                pivotClientObj._cubeTreeView.model.beforeDelete = null;
                pivotClientObj._cubeTreeView.removeNode(pivotClientObj._selectedMember.parent().parent().attr("id").replace(/'/g, ""));
                pivotClientObj._cubeTreeView.model.beforeDelete = function () { return false };
                // pivotClientObj._selectedMember.parent().parent().remove();
                if (!ej.isNullOrUndefined(pivotClientObj._calcMemberTreeObj))
                    pivotClientObj._calcMemberTreeObj.removeNode(pivotClientObj._selectedMember.parent().parent().attr("id"));
                if (pivotClientObj.element.find(".e-cubeTreeView .e-calcMemberCDB").length == 0 && pivotClientObj.element.find(".e-cubeTreeView .e-calcMemberGroupCDB").parents("li").length > 0) {
                    pivotClientObj._cubeTreeView.model.beforeDelete = null;
                    pivotClientObj._cubeTreeView.removeNode(pivotClientObj.element.find(".e-cubeTreeView .e-calcMemberGroupCDB").parents("li").attr("id").replace(/'/g, ""));
                    pivotClientObj._cubeTreeView.model.beforeDelete = function () { return false };
                }
                if (pivotClientObj.element.find(".e-cubeTreeViewCalcMember .e-calcMemberCDB").length == 0 && pivotClientObj.element.find(".e-cubeTreeViewCalcMember .e-calcMemberGroupCDB").parents("li").length > 0) {
                    pivotClientObj._calcMemberTreeObj.removeNode(pivotClientObj.element.find(".e-cubeTreeViewCalcMember .e-calcMemberGroupCDB").parents("li").attr("id"));
                }
                if (this.model.beforeServiceInvoke != null)
                    this._trigger("beforeServiceInvoke", { action: "removeCalculatedMember", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                var params = this._selectedMember.parent().parent().attr("data-tag");
                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.removeSplitButton, JSON.stringify({ "action": "removeCalculatedMember", "clientParams": params, "olapReport": pivotClientObj.currentReport, "clientReports": pivotClientObj.reports, "customObject": serializedCustomObject }), pivotClientObj._removeSplitButtonSuccess)
            }
            else {
                axisName = axisName == pivotClientObj._getLocalizedLabels("AddToSlicer") ? "Slicer" : axisName == pivotClientObj._getLocalizedLabels("AddToColumn") ? "Categorical" : axisName == pivotClientObj._getLocalizedLabels("AddToRow") ? "Series" : "";
                if ((axisName == "Slicer" && this._selectedMember.parent().parent().attr("data-tag") != null && this._selectedMember.parent().parent().attr("data-tag").indexOf("Measure") > -1 && this.element.find(".e-splitBtn[data-tag*=Measures]").length > 1) || (axisName == "Slicer" && this._selectedMember.parent().parent().attr("data-tag").indexOf("Measure") > -1 && this._selectedMember.parent().parent().find(".e-calcMemberCDB").length > 0 && this.element.find(".e-splitBtn[data-tag*=CalculatedMember][data-tag*=Measure]").length == 1 && this._selectedMember.parent().parent().attr("data-tag").replace(/\[/g, "").replace(/\]/g, "") != this.element.find(".e-splitBtn[data-tag*=CalculatedMember][data-tag*=Measure]").attr("data-tag").split(":")[1].split("::")[0]) || (axisName == "Slicer" && this._selectedMember.parent().parent().attr("data-tag").indexOf("Measure") > -1 && this._selectedMember.parent().parent().find(".e-calcMemberCDB").length == 0 && this.element.find(".e-splitBtn[data-tag*=CalculatedMember][data-tag*=Measure]").length == 1) || (axisName == "Slicer" && this._selectedMember.parent().parent().attr("data-tag").indexOf("Measure") > -1 && this._selectedMember.parent().parent().find(".e-calcMemberCDB").length == 1 && this.element.find(".e-splitBtn[data-tag*=CalculatedMember][data-tag*=Measure]").length == 0 && this.element.find(".e-splitBtn[data-tag*=Measure]").length == 1)) {
                    ej.Pivot._createErrorDialog(this._getLocalizedLabels("MultipleMeasure"), this._getLocalizedLabels("Warning"), this);
                    return false;
                }
                setTimeout(function () {
                    if (pivotClientObj._isTimeOut)
                        pivotClientObj._waitingPopup.show();
                }, 800);
                if (this.model.beforeServiceInvoke != null)
                    this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                var params = pivotClientObj.currentCubeName + "--" + this._selectedMember.parent().parent().attr("data-tag") + "--" + axisName + "--" + droppedPosition;
                pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.nodeDropped, JSON.stringify({ "action": "nodeDropped", "dropType": "TreeNode", "nodeInfo": params, "olapReport": pivotClientObj.currentReport, "clientReports": pivotClientObj.reports, "customObject": serializedCustomObject }), pivotClientObj._nodeDroppedSuccess);
            }
        },

        _toggleAxisSuccess: function (msg) {
            ej.Pivot._updateValueSortingIndex(msg, this);
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                if (ej.isNullOrUndefined(msg.d))
                    this.setOlapReport(msg.PivotReport);
                else
                    this.setOlapReport($.grep(msg.d, function (item) { return item.Key == "PivotReport" })[0].Value);
                this.refreshControl(msg);
            }
            else {
                var columnElements, rowElements, slicerElements;
                if (msg[0] != undefined) {
                    columnElements = msg[0].Value; rowElements = msg[1].Value;
                    slicerElements = msg[2].Value; this.currentReport = msg[3].Value; this.reports = msg[4].Value;
                }
                else if (msg.d != undefined) {
                    columnElements = msg.d[0].Value; rowElements = msg.d[1].Value;
                    slicerElements = msg.d[2].Value; this.currentReport = msg.d[3].Value; this.reports = msg.d[4].Value
                }
                else {
                    columnElements = msg.Columns; rowElements = msg.Rows;
                    slicerElements = msg.Slicers; this.currentReport = msg.CurrentReport;
                    this.reports = msg.ClientReports;
                }
                if (this.model.OperationalMode == ej.Pivot.AnalysisMode.ServerMode) {
                    var axisHeaderHeight, aebHeight;
                    this.element.find(".e-cubeTable").find(".e-categoricalAxis").parent().html("").html(this._createAxisElementBuilder(columnElements, rowElements, slicerElements));
                    if (this.model.enableSplitter && !ej.isNullOrUndefined(this.element.find(".e-serverchildsplit").data("ejSplitter")))
                        this.element.find(".e-serverchildsplit > .e-splitbar").css("height", this.element.find(".e-cubeTable").height());
                    this.element.find(".e-cubeTable").height((this.element.height() - ((this.element.find("div.e-titleText").length > 0 ? this.element.find("div.e-titleText").height() : 0) + this.element.find("#reportToolbar").height() + this.element.find(".e-csHeader").height() + 38)));
                    this.element.find(".cdbTD, .cubeTableTD").height(this.element.find(".e-cubeTable").height());
                    aebHeight = this.element.find(".cdbTD, .cubeTableTD").height() - ((this.element.find(".e-axisHeader").height() * 3) + (this.model.enableSplitter ? (this.model.isResponsive ? 18 : 24) : (this.model.isResponsive ? 14 : 3)));
                    this.element.find(".e-categoricalAxis, .e-rowAxis, .e-slicerAxis").height((aebHeight / 3));
                }
                this.element.find(".e-categoricalAxis, .e-rowAxis, .e-slicerAxis").find("button").ejButton({ height: "20px", type: ej.ButtonType.Button });
                this.element.find(".e-categoricalAxis, .e-rowAxis, .e-slicerAxis").addClass("e-droppable");
                this._renderControls();
                this._setSplitBtnTitle();
                if (this.model.showUniqueNameOnPivotButton) {
                    $(".e-pvtBtn").addClass("e-splitBtnUnique");
                    this._addSplitButtonHeight()
                }
                this._unWireEvents();
                this._wireEvents();
                this._trigger("renderSuccess", this);
                this._buttonContextMenu();
            }
        },

        _measureGroupChangedSuccess: function (cubeTree) {
            var cubeTreeInfo;
            if (cubeTree[0] != undefined) {
                cubeTreeInfo = cubeTree[0].Value;
            }
            if (cubeTree.d != undefined) {
                cubeTreeInfo = cubeTree.d[0].Value;
            }
            else
                cubeTreeInfo = cubeTree.CubeTreeInfo;
            this.element.find(".e-treeview, .e-cubeTreeView").remove();
            var cubeTree = ej.buildTag("div#cubeTreeView.e-cubeTreeView")[0].outerHTML;
            this.element.find(".e-cubeBrowser").append(cubeTree);
            var treeViewData = $.parseJSON(cubeTreeInfo);
            this.element.find(".e-cubeTreeView").ejTreeView({
                clientObj: this,
                fields: { id: "id", parentId: "pid", text: "name", spriteCssClass: "spriteCssClass", dataSource: treeViewData, parentUniqueName: "parentUniqueName" },
                allowDragAndDrop: true,
                allowDropChild: false,
                allowDropSibling: false,
                enableRTL: this.model.enableRTL,
                dragAndDropAcrossControl: true,
                nodeDragStart: function () {
                    this.model.clientObj.isDragging = true;
                },
                nodeDropped: ej.proxy(this._nodeDropped, this),
                beforeDelete: function () {
                    return false;
                },
                cssClass: 'pivotTreeViewDragedNode',
                height: "464px"
            });
            var treeViewElements = this.element.find(".e-cubeTreeView").find("li");
            for (var i = 0; i < treeViewElements.length; i++) {
                if (!ej.isNullOrUndefined(treeViewElements[i].id) && treeViewElements[i].id.indexOf("'").length > -1)
                    treeViewElements[i].setAttribute("id", treeViewElements[i].id.replace(/'/g, ""));
                treeViewElements[i].setAttribute("data-tag", treeViewData[i].tag);
                if (!ej.isNullOrUndefined(treeViewData[i].parentUniqueName) && treeViewData[i].parentUniqueName != "")
                    treeViewElements[i].setAttribute("data-parentUniqueName", !ej.isNullOrUndefined(treeViewData[i].parentUniqueName) ? treeViewData[i].parentUniqueName.split(">>||>>")[1] : "");
            }
            this.element.find(".e-cubeTreeView").height((this.element.find(".e-cubeBrowser").height() - this.element.find(".e-cubeName").height()) - (7 + (this.model.enableMeasureGroups ? (this.element.find(".measureGroupselector").height() + 13) : 0)));
            this._cubeTreeView = this.element.find('.e-cubeTreeView').data("ejTreeView");
            this._unWireEvents();
            this._wireEvents();
            this._isTimeOut = false;
            this._waitingPopup.hide();
            this._successAction = "MeasureGroupChange";
        },

        _cubeChangedSuccess: function (report) {
            var cubeTreeInfo, chartSettings, reportList;
            if (report[0] != undefined) {
                this.currentReport = report[0].Value; cubeTreeInfo = report[1].Value; this.reports = report[2].Value;
                this.reportsCount = report[3].Value; reportList = $.parseJSON(report[4].Value);
                if (this.model.enableMeasureGroups) this.measureGroupInfo = $.parseJSON(report[5].Value);
                chartSettings = $.parseJSON(report[6].Value);
                if (report[7] != null && report[7] != undefined)
                    this.model.customObject = report[7].Value;
            }
            else if (report.d != undefined) {
                this.currentReport = report.d[0].Value; cubeTreeInfo = report.d[1].Value; this.reports = report.d[2].Value;
                this.reportsCount = report.d[3].Value; reportList = $.parseJSON(report.d[4].Value);
                if (this.model.enableMeasureGroups) this.measureGroupInfo = $.parseJSON(report.d[5].Value);
                chartSettings = $.parseJSON(report.d[6].Value);
                if (report.d[7] != null && report.d[7] != undefined && report.d[7].Key != "Columns")
                    this.model.customObject = report.d[7].Value;
                if (report.d[7] != null && report.d[7] != undefined && report.d[7].Key == "Columns")
                    report.Columns = report.d[7].Value;
                if (report.d[8] != null && report.d[8] != undefined && report.d[8].Key == "Rows")
                    report.Rows = report.d[8].Value;
                if (report.d[9] != null && report.d[9] != undefined && report.d[9].Key == "Slicers")
                    report.Slicers = report.d[9].Value;
            }
            else {

                this.currentReport = report.NewReport; cubeTreeInfo = report.CubeTreeInfo; this.reports = report.ClientReports;
                this.reportsCount = report.ReportsCount; reportList = $.parseJSON(report.ReportList);
                if (this.model.enableMeasureGroups) this.measureGroupInfo = $.parseJSON(report.MeasureGroups);
                chartSettings = $.parseJSON(report.ControlSettings);
                if (report.customObject != null && report.customObject != undefined)
                    this.model.customObject = report.customObject;
            }
            var currentCubeName = this.currentCubeName;
            var filterText = $.map(this._repCol, function (value, index) { if (value.CubeName == currentCubeName) { return value.slicerBtnTextInfo; } });
            this.slicerBtnTextInfo = filterText.length > 0 ? filterText[0] : {};
            this.model.chartType = chartSettings.ChartType.toLowerCase();
            if (this.model.afterServiceInvoke != null)
                this._trigger("afterServiceInvoke", { action: "cubeChanged", element: this.element, customObject: this.model.customObject });
            if (!this.model.enableDeferUpdate)
                this.element.find(".e-splitBtn, .e-pivotgrid, .e-pivotchart, .e-treeview, .e-cubeTreeView, .e-cubeName, .searchDiv").remove();
            else
                this.element.find(".e-splitBtn, .e-treeview, .e-cubeTreeView, .e-cubeName, .searchDiv").remove();
            var cubeTree = ej.buildTag("div#cubeTreeView.e-cubeTreeView")[0].outerHTML;
            var searchEditor = ej.buildTag("div.searchDiv", ej.buildTag("input#" + this._id + "_SearchTreeView.searchTreeView").attr("type", "text")[0].outerHTML, { "margin": "5px 5px 0px 5px" })[0].outerHTML;
            var cubeName = ej.buildTag("div.e-cubeName", this.currentCubeName + searchEditor)[0].outerHTML;
            if (this.model.enableMeasureGroups) {
                this._createMeasureGroup();
            }
            var treeViewData = $.parseJSON(cubeTreeInfo);
            $(cubeTree).appendTo(".e-cubeBrowser");
            this.element.find(".e-cubeTreeView").ejTreeView({
                clientObj: this,
                fields: { id: "id", parentId: "pid", text: "name", spriteCssClass: "spriteCssClass", dataSource: treeViewData, parentUniqueName: "parentUniqueName" },
                allowDragAndDrop: true,
                allowDropChild: false,
                allowDropSibling: false,
                enableRTL: this.model.enableRTL,
                dragAndDropAcrossControl: true,
                nodeDragStart: function () {
                    this.model.clientObj.isDragging = true;
                },
                nodeDropped: ej.proxy(this._nodeDropped, this),
                beforeDelete: function () {
                    return false;
                },
                cssClass: 'pivotTreeViewDragedNode',
                height: this.model.enableMeasureGroups ? "464px" : ""
            });
            var treeViewElements = this.element.find(".e-cubeTreeView").find("li");
            for (var i = 0; i < treeViewElements.length; i++) {
                if (!ej.isNullOrUndefined(treeViewElements[i].id) && treeViewElements[i].id.indexOf("'").length > -1)
                    treeViewElements[i].setAttribute("id", treeViewElements[i].id.replace(/'/g, ""));
                treeViewElements[i].setAttribute("data-tag", treeViewData[i].tag);
                if (!ej.isNullOrUndefined(treeViewData[i].parentUniqueName) && treeViewData[i].parentUniqueName != "")
                    treeViewElements[i].setAttribute("data-parentUniqueName", !ej.isNullOrUndefined(treeViewData[i].parentUniqueName) ? treeViewData[i].parentUniqueName.split(">>||>>")[1] : "");
            }
            this._cubeTreeView = this.element.find('.e-cubeTreeView').data("ejTreeView");
            this.element.find(".reportlist").ejDropDownList("option", "change", ej.proxy(this._reportChanged, this));
            this.element.find(".reportlist").ejDropDownList("option", "dataSource", reportList);
            this.element.find(".reportlist").ejDropDownList("option", "value", reportList[this._reportIndex].name);
            $(this.element).find(".e-cubeBrowser").prepend(cubeName);
            this.element.find("#" + this._id + "_SearchTreeView").ejMaskEdit({
                name: "inputbox",
                width: "100%",
                inputMode: ej.InputMode.Text,
                watermarkText: this._getLocalizedLabels("Search"),
                maskFormat: "",
                textAlign: this.model.enableRTL ? "right" : "left",
                change: ej.proxy(ej.Pivot._searchTreeNodes, this),
            });
            if (this.model.enableSplitter && !ej.isNullOrUndefined(this.element.find(".e-serverchildsplit").data("ejSplitter"))) {
                this.element.find(".e-serverchildsplit > .e-splitbar").css("height", this.element.find(".e-cubeTable").height());
                this.element.find(".e-serverchildsplit").data("ejSplitter").refresh();
            }
            this.element.find(".e-cubeTable").height((this.element.height() - (this.element.find("div.e-titleText").height() + this.element.find("#reportToolbar").height() + this.element.find(".e-csHeader").height() + 38)));
            this.element.find(".cdbTD, .cubeTableTD").height((this.element.height() - (this.element.find("div.e-titleText").height() + this.element.find("#reportToolbar").height() + this.element.find(".e-csHeader").height() + 38)));
            this.element.find(".e-cubeBrowser").height((this.element.find(".cdbTD, .cubeTableTD").height() - (this.element.find(".e-cdbHeader").height() + 5)) + (this.model.isResponsive ? 0 : 14));
            $(this._createSplitButtons(report.Columns, "Columns")).appendTo(".e-categoricalAxis");
            $(this._createSplitButtons(report.Rows, "Rows")).appendTo(".e-rowAxis");
            $(this._createSplitButtons(report.Slicers, "Slicers")).appendTo(".e-slicerAxis");
            this.element.find(".e-categoricalAxis, .e-rowAxis, .e-slicerAxis").find("button").ejButton({ height: "20px", type: ej.ButtonType.Button });
            this._setSplitBtnTitle();
            this._renderControls();
            this._unWireEvents();
            this._wireEvents();
            this._isTimeOut = false;
            this._waitingPopup.hide();
            this._successAction = "CubeChange";
            this._trigger("renderSuccess", this);
            this._treeContextMenu();
            this._buttonContextMenu();
            if (this.model.showUniqueNameOnPivotButton) {
                this.element.find(".e-pvtBtn").addClass("e-splitBtnUnique");
                this._addSplitButtonHeight();
            }
            this.element.find(".e-cubeTreeView").height((this.element.find(".e-cubeBrowser").height() - this.element.find(".e-cubeName").height()) - (7 + (this.model.enableMeasureGroups ? (this.element.find(".measureGroupselector").height() + 13) : 0)));
        },

        _treeContextMenu: function () {
            var contextTag = ej.buildTag("ul.pivotTreeContext#pivotTreeContext", ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToColumn"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToRow"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToSlicer"))[0].outerHTML)[0].outerHTML + ej.buildTag("li#Remove", ej.buildTag("a", this._getLocalizedLabels("Remove"))[0].outerHTML)[0].outerHTML)[0].outerHTML;
            $(this.element).append(contextTag);
            $("#pivotTreeContext").ejMenu({
                menuType: ej.MenuType.ContextMenu,
                openOnClick: false,
                contextMenuTarget: this.element.find(".e-cubeTreeView")[0],
                click: ej.proxy(this._onTreeContextClick, this),
                beforeOpen: ej.proxy(this._onContextOpen, this),
                close: ej.proxy(ej.Pivot.closePreventPanel, this)
            });
        },
        _removeSplitButtonSuccess: function (report) {
            if (report[0] != undefined) {
                this.currentReport = report[0].Value; this.reports = report[1].Value;
                if (report[2] != null && report[2] != undefined)
                    this.model.customObject = report[2].Value;
            }
            else if (report.d != undefined) {
                this.currentReport = report.d[0].Value; this.reports = report.d[1].Value;
                if (report.d[2] != null && report.d[2] != undefined)
                    this.model.customObject = report.d[2].Value;
            }
            else {
                this.currentReport = report.UpdatedReport; this.reports = report.ClientReports;
                if (report.customObject != null && report.customObject != undefined)
                    this.model.customObject = report.customObject;
            }
            if (this.model.afterServiceInvoke != null)
                this._trigger("afterServiceInvoke", { action: "removeSplitButton", element: this.element, customObject: this.model.customObject });
            this._renderControls();
            this._unWireEvents();
            this._wireEvents();
            this._successAction = "ButtonRemove";
            this._trigger("renderSuccess", this);
        },

        _chartTypeChangedSuccess: function (report) {
            if (report[0] != undefined) {
                this.currentReport = report[0].Value;
                this.reports = report[1].Value;
            }
            else if (report.d != undefined) {
                this.currentReport = report.d[0].Value;
                this.reports = report.d[1].Value;
            }
            else {
                this.currentReport = report.CurrentReport;
                this.reports = report.ClientReports;
            }

        },

        _mdxQuery: function (mdxquery) {
            this.element.find(".e-dialog").hide();
            this.element.find(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog), .e-clientDialog").remove();
            if (mdxquery.d != undefined)
                this._createDialog("mdx", mdxquery.d, "");
            else
                this._createDialog("mdx", mdxquery, "");
        },

        _refreshReportList: function () {
            var reportList = $.map(this._clientReportCollection, function (item, index) { if (item.reportName != undefined) { return { name: item.reportName } } });
            var reportLists = this.element.find(".reportlist").data("ejDropDownList");
            this.element.find(".reportlist").ejDropDownList("option", "dataSource", (reportList));
            reportLists.selectItemByText(this.model.dataSource.reportName);
            this._unWireEvents();
            this._wireEvents();
        },
        _clientToolbarOperationSuccess: function (msg) {
            var reportCol = "";
            if (msg != null) {
                var reportCollection = "";
                if (msg && msg.d)
                    reportCol = msg.d[0].Value;
                else if (msg && msg["report"])
                    reportCol = msg["report"];
                if (reportCol.indexOf(":>>:") > -1) {
                    this._currentReportItems = JSON.parse(reportCol.split(":>>:")[1]);
                }
                reportCol = reportCollection = this._pivotSchemaDesigner._repCollection = JSON.parse(reportCol.split(":>>:")[0]);
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && reportCol[reportCol.length - 1]["cubeIndex"] != undefined) {
                    reportCollection = reportCol[reportCol[reportCol.length - 1]["cubeIndex"]]["Reports"];
                    this.model.calculatedMembers = reportCol[reportCol[reportCol.length - 1]["cubeIndex"]].calculatedMembers
                    this.reportDropTarget.selectItemByIndex(reportCol[reportCol[reportCol.length - 1]["cubeIndex"]]["ReportIndex"]);
                }
                else
                    this.reportDropTarget.selectItemByIndex(0);
                if (reportCollection.length > 0)
                    this.model.dataSource = reportCollection[0];
                this._clientReportCollection = reportCollection;
                if (this.model.dataSource) {
                    if (!ej.isNullOrUndefined(this._pivotSchemaDesigner) && this._pivotSchemaDesigner.element.find(".cubeList").length > 0 && !ej.isNullOrUndefined(reportCollection[reportCol[reportCol[reportCol.length - 1]["cubeIndex"]]["ReportIndex"]]) && !ej.isNullOrUndefined(reportCollection[reportCol[reportCol[reportCol.length - 1]["cubeIndex"]]["ReportIndex"]]["cube"])) {
                        this._pivotSchemaDesigner.element.find(".cubeList").data("ejDropDownList").selectItemByText(reportCollection[reportCol[reportCol[reportCol.length - 1]["cubeIndex"]]["ReportIndex"]]["cube"]);
                        this._pivotSchemaDesigner._repCollection.splice(reportCol.length - 1, 1);
                    }
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                        this.refreshControl(this.model.dataSource);
                    this._refreshReportList();
                }
                else if (this._waitingPopup) {
                    this._isTimeOut = false;
                    this._waitingPopup.hide();
                }
            }
        },

        _successDialog: function (action) {
            var msg = action == "Save" ? this._getLocalizedLabels("SaveMsg") : action == "Rename" ? this._getLocalizedLabels("RenameMsg") : action == "Remove" ? this._getLocalizedLabels("RemoveMsg") : "";
            msg != "" ? ej.Pivot._createErrorDialog(msg, this._getLocalizedLabels("Success"), this) : "";
            this._isTimeOut = false;
        },

        _toolbarOperationSuccess: function (report) {
            if (report != null) {
                if (report.CurrentAction != undefined && report.CurrentAction != "Load Report" && report.CurrentAction != "Add Report" && report.CurrentAction != "Remove Report" && report.CurrentAction != "New Report" && report.CurrentAction != "Rename Report" && report.CurrentAction != "Report Change")
                    this._successDialog(report.CurrentAction);
                else if (report.d != undefined && report.d[0] != undefined && report.d[0].Key == "CurrentAction" && report.d[0].Value != undefined && report.d[0].Value != "Load Report" && report.d[0].Value != "Add Report" && report.d[0].Value != "Remove Report" && report.d[0].Value != "New Report" && report.d[0].Value != "Rename Report" && report.d[0].Value != "Report Change") {
                    this._successDialog(report.d[0].Value);
                    report.d = null;
                }
                if ((report.d != undefined && report.d || report[0] != undefined && report[0]) || report.CurrentReport || report.PivotReport) {
                    var columnElements, rowElements, slicerElements, action, renamedReport, chartSettings, cubeTreeInfo;
                    if (report.length > 1 && report[0] != undefined) {
                        this.currentReport = report[0].Value; this.reports = report[1].Value; this.reportsCount = report[2].Value; columnElements = report[3].Value;
                        rowElements = report[4].Value; slicerElements = report[5].Value; action = report[6].Value; reportList = $.parseJSON(report[7].Value);
                        renamedReport = report[8].Value; chartSettings = $.parseJSON(report[9].Value); cubeTreeInfo = report[10].Value; var cubeSelector = report[11].Value;
                        if (this.model.enableMeasureGroups && report[12] != null && report[12] != undefined)
                            this.measureGroupInfo = report[12].Value;
                        if (report[13] != null && report[13] != undefined && report[13].Key != "Collection")
                            this.model.customObject = report[13].Value;
                        else if (report[13] != null && report[13] != undefined && report[13].Key == "Collection") {
                            this._repCol = JSON.parse(report[13].Value);
                            if (!ej.isNullOrUndefined(this._repCol[this._repCol.length - 1].cubeIndex)) {
                                var _slicerBtnTextInfo = this._repCol[this._repCol[this._repCol.length - 1].cubeIndex].slicerBtnTextInfo;
                                var _fieldSelectedMembers = this._repCol[this._repCol[this._repCol.length - 1].cubeIndex]._fieldSelectedMembers;
                                this._slicerBtnTextInfo = !ej.isNullOrUndefined(_slicerBtnTextInfo) ? _slicerBtnTextInfo : {};
                                this._fieldSelectedMembers = !ej.isNullOrUndefined(_fieldSelectedMembers) ? _fieldSelectedMembers : {};
                            }
                        }
                    }
                    else if (report.d != undefined) {
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                            action = $.grep(report.d, function (item) { return item.Key == "CurrentAction" })[0].Value;
                            this.setOlapReport($.grep(report.d, function (item) { return item.Key == "PivotReport" })[0].Value);
                            this.currentReport = $.parseJSON(this.getOlapReport()).Report;
                            columnElements = $.parseJSON(this.getOlapReport()).PivotColumns;
                            rowElements = $.parseJSON(this.getOlapReport()).PivotRows;
                            slicerElements = $.parseJSON(this.getOlapReport()).Filters;
                            if (action == "NewReport") {
                                this._clientReportCollection = [{ name: this._currentReportName, report: this.currentReport }];
                                this.refreshControl({ GridJSON: JSON.stringify(""), ChartJSON: JSON.stringify(""), PivotReport: $.grep(report.d, function (item) { return item.Key == "PivotReport" })[0].Value });
                            }
                            else if (action == "AddReport") {
                                this._clientReportCollection.push({ name: this._currentReportName, report: this.currentReport });
                                this.refreshControl({ GridJSON: JSON.stringify(""), ChartJSON: JSON.stringify(""), PivotReport: $.grep(report.d, function (item) { return item.Key == "PivotReport" })[0].Value });
                            }
                            else if (action == "RemoveReport" || action == "ChangeReport") {
                                var valFilterHiddenCells = this._hiddenCellInfo(report.d);
                                this.refreshControl({
                                    GridJSON: $.grep(report.d, function (item) { return item.Key == "GridJSON" })[0].Value,
                                    ChartJSON: $.grep(report.d, function (item) { return item.Key == "ChartJSON" })[0].Value,
                                    PivotReport: $.grep(report.d, function (item) { return item.Key == "PivotReport" })[0].Value,
                                    FilteredColumnHeaders: valFilterHiddenCells.columnArea.length > 0 ? (valFilterHiddenCells.columnArea) : "[]",
                                    FilteredRowHeaders: (valFilterHiddenCells.rowArea.length > 0) ? (valFilterHiddenCells.rowArea) : "[]"
                                });
                            }
                            var reportList = $.map(this._clientReportCollection, function (report) { return { "name": report.name }; });
                            this.element.find(".reportlist").ejDropDownList("option", "dataSource", reportList);
                            var ddList = this.element.find(".reportlist").data("ejDropDownList");
                            this._isReportListAction = false;
                            ddList.selectItemByText(this._currentReportName);
                            this._isReportListAction = true;
                            return;
                        }
                        this.currentReport = report.d[0].Value; this.reports = report.d[1].Value; this.reportsCount = report.d[2].Value; columnElements = report.d[3].Value;
                        rowElements = report.d[4].Value; slicerElements = report.d[5].Value; action = report.d[6].Value; reportList = $.parseJSON(report.d[7].Value);
                        renamedReport = report.d[8].Value; chartSettings = $.parseJSON(report.d[9].Value); cubeTreeInfo = report.d[10].Value; cubeSelector = report.d[11].Value;
                        if (this.model.enableMeasureGroups && report.d[12] != null && report.d[12] != undefined)
                            this.measureGroupInfo = report.d[12].Value;
                        if (report.d[13] != null && report.d[13] != undefined && report.d[13].Key != "Collection")
                            this.model.customObject = report.d[13].Value;
                        else if (report.d[13] != null && report.d[13] != undefined && report.d[13].Key == "Collection") {
                            this._repCol = JSON.parse(report.d[13].Value);
                            if (!ej.isNullOrUndefined(this._repCol[this._repCol.length - 1].cubeIndex)) {
                                var _slicerBtnTextInfo = this._repCol[this._repCol[this._repCol.length - 1].cubeIndex].slicerBtnTextInfo;
                                this._slicerBtnTextInfo = !ej.isNullOrUndefined(_slicerBtnTextInfo) ? _slicerBtnTextInfo : {};
                                var _fieldSelectedMembers = this._repCol[this._repCol[this._repCol.length - 1].cubeIndex]._fieldSelectedMembers;
                                this._fieldSelectedMembers = !ej.isNullOrUndefined(_fieldSelectedMembers) ? _fieldSelectedMembers : {};
                            }
                        }
                    }
                    else {
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                            action = report.CurrentAction;
                            this.setOlapReport(report.PivotReport);
                            this.currentReport = $.parseJSON(this.getOlapReport()).Report;
                            columnElements = $.parseJSON(this.getOlapReport()).PivotColumns;
                            rowElements = $.parseJSON(this.getOlapReport()).PivotRows;
                            slicerElements = $.parseJSON(this.getOlapReport()).Filters;
                            if (action == "NewReport") {
                                this._clientReportCollection = [{ name: this._currentReportName, report: this.currentReport }];
                                this.refreshControl({ GridJSON: JSON.stringify(""), ChartJSON: JSON.stringify(""), PivotReport: report.PivotReport });
                            }
                            else if (action == "AddReport") {
                                this._clientReportCollection.push({ name: this._currentReportName, report: this.currentReport });
                                this.refreshControl({ GridJSON: JSON.stringify(""), ChartJSON: JSON.stringify(""), PivotReport: report.PivotReport });
                            }
                            else if (action == "RemoveReport" || action == "ChangeReport") {
                                this.refreshControl({
                                    GridJSON: report.GridJSON, ChartJSON: report.ChartJSON, PivotReport: report.PivotReport,
                                    FilteredColumnHeaders: (!ej.isNullOrUndefined(report.FilteredColumnHeaders)) ? report.FilteredColumnHeaders : "[]",
                                    FilteredRowHeaders: (!ej.isNullOrUndefined(report.FilteredRowHeaders)) ? report.FilteredRowHeaders : "[]"
                                });
                            }
                            var reportList = $.map(this._clientReportCollection, function (report) { return { "name": report.name }; });
                            this.element.find(".reportlist").ejDropDownList("option", "dataSource", reportList);
                            var ddList = this.element.find(".reportlist").data("ejDropDownList");
                            this._isReportListAction = false;
                            ddList.selectItemByText(this._currentReportName);
                            this._isReportListAction = true;
                            return;
                        }
                        else {
                            this._repCol = ej.isNullOrUndefined(report.Collection) ? this._repCol : JSON.parse(report.Collection); this.currentReport = report.CurrentReport; this.reports = report.Reports; this.reportsCount = report.ReportsCount; columnElements = report.Columns;
                            rowElements = report.Rows; slicerElements = report.Slicers; action = report.CurrentAction; reportList = $.parseJSON(report.ReportList);
                            renamedReport = report.RenamedReport; chartSettings = $.parseJSON(report.ControlSettings); cubeTreeInfo = report.CubeTreeInfo; cubeSelector = report.CubeSelector; if (this.model.enableMeasureGroups) this.measureGroupInfo = $.parseJSON(report.MeasureGroups);
                            if (report.customObject != null && report.customObject != undefined)
                                this.model.customObject = report.customObject;
                            if (this._repCol != undefined && this._repCol.length > 0 && !ej.isNullOrUndefined(this._repCol[this._repCol.length - 1].cubeIndex)) {
                                var _slicerBtnTextInfo = this._repCol[this._repCol[this._repCol.length - 1].cubeIndex].slicerBtnTextInfo;
                                this._slicerBtnTextInfo = !ej.isNullOrUndefined(_slicerBtnTextInfo) ? _slicerBtnTextInfo : {};
                                var _fieldSelectedMembers = this._repCol[this._repCol[this._repCol.length - 1].cubeIndex]._fieldSelectedMembers;
                                this._fieldSelectedMembers = !ej.isNullOrUndefined(_fieldSelectedMembers) ? _fieldSelectedMembers : {};
                            }
                        }
                    }
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                        this.model.chartType = chartSettings.ChartType.toLowerCase();

                    if (this.model.afterServiceInvoke != null)
                        this._trigger("afterServiceInvoke", { action: "toolbarOperation", element: this.element, customObject: this.model.customObject });
                    if (action != "Report Change") {
                        this.element.find(".reportlist").ejDropDownList("option", "change", "");
                        this.element.find(".reportlist").ejDropDownList("option", "dataSource", reportList);
                        if (action == "Load Report") {
                            this.ddlTarget._initValue = true;
                            this.ddlTarget.selectItemByText(cubeSelector);
                            this.currentCubeName = cubeSelector;
                            this.ddlTarget._initValue = false;
                            if (!ej.isNullOrUndefined(report.Collection) || (report.d != undefined && report.d[13] != undefined && report.d[13].Key == "Collection"))
                                this.reportDropTarget.selectItemByIndex(this._repCol[this._repCol[this._repCol.length - 1]["cubeIndex"]]["ReportIndex"]);
                            else
                                this.reportDropTarget.selectItemByText(this.reportDropTarget.model.dataSource[0].name);
                            this._repCol.splice(this._repCol.length - 1, 1)
                            this._selectedReport = this.reportDropTarget.currentValue;
                            this.element.find(".searchDiv").remove();
                            if (this.model.enableMeasureGroups) {
                                this._createMeasureGroup();
                            }
                            var searchEditor = ej.buildTag("div.searchDiv", ej.buildTag("input#" + this._id + "_SearchTreeView.searchTreeView").attr("type", "text")[0].outerHTML, { "margin": "5px 5px 0px 0px" })[0].outerHTML;
                            var cubeName = $(this.element).find(".e-cubeName").html(cubeSelector + searchEditor);
                            $(this.element).find(".e-cubeBrowser").prepend(cubeName);
                            this.element.find("#" + this._id + "_SearchTreeView").ejMaskEdit({
                                name: "inputbox",
                                width: "100%",
                                inputMode: ej.InputMode.Text,
                                watermarkText: this._getLocalizedLabels("Search"),
                                maskFormat: "",
                                textAlign: this.model.enableRTL ? "right" : "left",
                                change: ej.proxy(ej.Pivot._searchTreeNodes, this),
                            });
                            var treeViewData = $.parseJSON(cubeTreeInfo);
                            this.element.find(".e-cubeTreeView").ejTreeView({
                                clientObj: this,
                                fields: { id: "id", parentId: "pid", text: "name", spriteCssClass: "spriteCssClass", dataSource: treeViewData, parentUniqueName: "parentUniqueName" },
                                allowDragAndDrop: true,
                                allowDropChild: false,
                                allowDropSibling: false,
                                enableRTL: this.model.enableRTL,
                                dragAndDropAcrossControl: true,
                                nodeDragStart: function () {
                                    this.model.clientObj.isDragging = true;
                                },
                                nodeDropped: ej.proxy(this._nodeDropped, this),
                                beforeDelete: function () {
                                    return false;
                                },
                                cssClass: 'pivotTreeViewDragedNode',
                                height: this.model.enableMeasureGroups ? "464px" : "495px"
                            });
                            var treeViewElements = this.element.find(".e-cubeTreeView").find("li");
                            for (var i = 0; i < treeViewElements.length; i++) {
                                if (!ej.isNullOrUndefined(treeViewElements[i].id) && treeViewElements[i].id.indexOf("'").length > -1)
                                    treeViewElements[i].setAttribute("id", treeViewElements[i].id.replace(/'/g, ""));
                                treeViewElements[i].setAttribute("data-tag", treeViewData[i].tag);
                                if (!ej.isNullOrUndefined(treeViewData[i].parentUniqueName) && treeViewData[i].parentUniqueName != "")
                                    treeViewElements[i].setAttribute("data-parentUniqueName", !ej.isNullOrUndefined(treeViewData[i].parentUniqueName) ? treeViewData[i].parentUniqueName.split(">>||>>")[1] : "");
                            }
                            var folders = this.element.find(".e-cubeTreeView .e-folderCDB");
                            for (var i = 0; i < folders.length; i++) {
                                $(folders[i].parentElement).removeClass("e-draggable");
                            }
                            folders = this.element.find(".e-cubeTreeViewCalcMember .e-folderCDB");
                            for (var i = 0; i < folders.length; i++) {
                                $(folders[i].parentElement).removeClass("e-draggable");
                            }
                            this._cubeTreeView = this.element.find('.e-cubeTreeView').data("ejTreeView");
                            if (this.model.isResponsive)
                                this.element.find(".e-cubeTreeView").height(this.element.find(".e-cubeBrowser").height() - (56 + (this.model.enableMeasureGroups ? 35 : 0)));
                            else
                                this.element.find(".e-cubeTreeView").height(this.element.find(".e-cubeBrowser").height() - (61 + (this.model.enableMeasureGroups ? 30 : 0)));
                        }
                        else if (action != "Rename Report") {
                            this._isReportListAction = false;
                            this.reportDropTarget.selectItemByText(this.reportDropTarget.model.dataSource[reportList.length - 1].name);
                            this._isReportListAction = true;
                            this._selectedReport = this.reportDropTarget.currentValue;
                        }
                        else {
                            if (this._excelFilterInfo.length > 0) {
                                var cubeName = this.element.find('.cubeSelector').data("ejDropDownList").model.value, reportName = this.element.find('#reportList').data("ejDropDownList").model.value;
                                this._excelFilterInfo = $.grep(this._excelFilterInfo, function (item, index) {
                                    if (item.cubeName == cubeName && item.report == this.reportDropTarget.model.itemValue) { item.report = renamedReport; }
                                    return item;
                                });
                            }
                            this._isReportListAction = false;
                            this.reportDropTarget.selectItemByText(renamedReport);
                            this._isReportListAction = true;
                            this._selectedReport = this.reportDropTarget.currentValue;
                        }
                        this.element.find(".reportlist").ejDropDownList("option", "change", ej.proxy(this._reportChanged, this));
                    }
                    if (action != "Rename Report")
                        if (this.model.enableDeferUpdate)
                            this.element.find(".e-splitBtn").remove();
                        else
                            this.element.find(".e-splitBtn, .e-pivotgrid, .e-pivotchart").remove();
                    if (action == "Add Report" || action == "New Report" || action == "Remove Report" || action == "Report Change" || action == "Load Report" || action == "SortOrFilter" || action == "Save Report") {
                        var treeViewData = $.parseJSON(cubeTreeInfo);
                        var calcMemGroup = ej.DataManager(treeViewData).executeLocal(ej.Query().where("spriteCssClass", "contains", "e-calcMemberGroupCDB"));
                        this._cubeTreeView.model.beforeDelete = null;
                        this._cubeTreeView.removeNode(this.element.find(".e-cubeTreeView .e-calcMemberGroupCDB").parents("li"));
                        this._cubeTreeView.model.beforeDelete = function () { return false };
                        if (!ej.isNullOrUndefined(this._calcMemberTreeObj))
                            this._calcMemberTreeObj.removeNode(this.element.find(".e-cubeTreeViewCalcMember .e-calcMemberGroupCDB").parents("li"));
                        if (calcMemGroup.length > 0 && !ej.isNullOrUndefined(this._cubeTreeView)) {
                            this._calcMembers = [];
                            this._calcMembers.push(calcMemGroup);
                            $.merge(this._calcMembers, ej.DataManager(treeViewData).executeLocal(ej.Query().where("spriteCssClass", "contains", "e-calcMemberCDB")));
                            this._calcMemberTreeViewUpdate();
                        }
                    }
                    if (action == "Remove Report" || action == "Report Change" || action == "Load Report" || action == "SortOrFilter" || action == "Save Report") {
                        $(this._createSplitButtons(columnElements, "Columns")).appendTo(".e-categoricalAxis");
                        $(this._createSplitButtons(rowElements, "Rows")).appendTo(".e-rowAxis");
                        $(this._createSplitButtons(slicerElements, "Slicers")).appendTo(".e-slicerAxis");
                        this.element.find(".e-categoricalAxis, .e-rowAxis, .e-slicerAxis").find("button").ejButton({ height: "20px", type: ej.ButtonType.Button });
                        this._renderControls();
                    }
                    if (action == "Add Report" || action == "New Report") {
                        this._renderControls();
                    }
                }
            }
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                this._treeContextMenu();
                this._buttonContextMenu();
            }
            
            this._setSplitBtnTitle();
            if (this.model.showUniqueNameOnPivotButton) {
                $(".e-pvtBtn").addClass("e-splitBtnUnique");
                this._addSplitButtonHeight();
            }
            this._unWireEvents();
            this._wireEvents();
            this._isTimeOut = false;
            this._waitingPopup.hide();
            this._successAction = "ToolbarOperation";
            this._trigger("renderSuccess", this);
        },
        _calcMemberTreeViewUpdate: function () {
            this._cubeTreeView.model.beforeDelete = null;
            this._cubeTreeView.removeNode(this.element.find(".e-cubeTreeView .e-calcMemberGroupCDB").parents("li"));
            this._cubeTreeView.model.beforeDelete = function () { return false };
            if (!ej.isNullOrUndefined(this._calcMemberTreeObj))
                this._calcMemberTreeObj.removeNode(this.element.find(".e-cubeTreeViewCalcMember .e-calcMemberGroupCDB").parents("li"));

            if (this.element.find(".e-cubeTreeView").find("li").first().length > 0) {
                this._cubeTreeView.insertBefore(this._calcMembers[0], this.element.find(".e-cubeTreeView").find("li").first());
                for (var i = 0; i < this._calcMembers.length; i++) {
                    if (!ej.isNullOrUndefined(this._calcMembers[i].id) && this._calcMembers[i].id.indexOf("'") > -1)
                        this._calcMembers[i].id = this._calcMembers[i].id.replace(/'/g, "");
                }
                this._cubeTreeView.addNodes(ej.DataManager(this._calcMembers).executeLocal(ej.Query().skip(1)), this._calcMembers[0].id);
                this.element.find(".e-cubeTreeView").find("#" + this._calcMembers[0].id).find('> div > div:first').removeClass("e-process");
                this._cubeTreeView.collapseNode(this._calcMembers[0].id);
            }
            else if (this._calcMembers.length > 0) {
                this._cubeTreeView.addNodes(this._calcMembers[0]);
                this.element.find(".e-cubeTreeView").find("#" + this._calcMembers[0].id).find('> div > div:first').removeClass("e-process");
                this._cubeTreeView.addNodes(ej.DataManager(this._calcMembers).executeLocal(ej.Query().skip(1)), this._calcMembers[0].id);
            }
            if (!ej.isNullOrUndefined(this._calcMemberTreeObj) && this.element.find(".e-cubeTreeViewCalcMember").find("li").first().length > 0) {
                this._calcMemberTreeObj.insertBefore(this._calcMembers[0], this.element.find(".e-cubeTreeViewCalcMember").find("li").first());
                for (var i = 0; i < this._calcMembers.length; i++) {
                    if (!ej.isNullOrUndefined(this._calcMembers[i].id) && this._calcMembers[i].id.indexOf("'") > -1)
                        this._calcMembers[i].id = this._calcMembers[i].id.replace(/'/g, "");
                }
                this._calcMemberTreeObj.addNodes(ej.DataManager(this._calcMembers).executeLocal(ej.Query().skip(1)), this._calcMembers[0].id);
                this.element.find(".e-cubeTreeViewCalcMember").find("#" + this._calcMembers[0].id).find('> div > div:first').removeClass("e-process");
                this._calcMemberTreeObj.collapseNode(this._calcMembers[0].id);
            }
            else if (!ej.isNullOrUndefined(this._calcMemberTreeObj) && this._calcMembers.length > 0) {
                this._calcMemberTreeObj.addNodes(this._calcMembers[0]);
                this.element.find(".e-cubeTreeViewCalcMember").find("#" + this._calcMembers[0].id).find('> div > div:first').removeClass("e-process");
                this._calcMemberTreeObj.addNodes(ej.DataManager(this._calcMembers).executeLocal(ej.Query().skip(1)), this._calcMembers[0].id);
            }

            if (this.element.find(".e-cubeTreeView .e-calcMemberGroupCDB").length > 0) {
                this.element.find(".e-cubeTreeView .e-calcMemberGroupCDB").parent().removeClass("e-draggable");
                this.element.find(".e-cubeTreeViewCalcMember .e-calcMemberGroupCDB").parent().removeClass("e-draggable");
                var calcItem = this.element.find(".e-cubeTreeView .e-calcMemberCDB").parents("li").find("li");
                var calcItemDialog = this.element.find(".e-cubeTreeViewCalcMember .e-calcMemberCDB").parents("li").find("li");
                if (calcItem.length > 0) {
                    for (var i = 0; i < calcItem.length; i++) {
                        calcItem[i].setAttribute("data-tag", this._calcMembers[i + 1].tag);
                        calcItem[i].setAttribute("expression", this._calcMembers[i + 1].expression);
                        calcItem[i].setAttribute("formatString", this._calcMembers[i + 1].formatString);
                        calcItem[i].setAttribute("nodeType", this._calcMembers[i + 1].nodeType);
                        if (calcItemDialog.length > 0) {
                            calcItemDialog[i].setAttribute("data-tag", this._calcMembers[i + 1].tag);
                            calcItemDialog[i].setAttribute("expression", this._calcMembers[i + 1].expression);
                            calcItemDialog[i].setAttribute("formatString", this._calcMembers[i + 1].formatString);
                            calcItemDialog[i].setAttribute("nodeType", this._calcMembers[i + 1].nodeType);
                        }
                    }
                }
            }
        },
        _fetchChildNodeSuccess: function (data) {

            var newDataSource; var parentNode;
            if (data.length > 1 && data[0] != undefined)
                newDataSource = JSON.parse(data[0].Value);
            else if (data.d != undefined)
                newDataSource = JSON.parse(data.d[0].Value);
            else
                newDataSource = JSON.parse(data.ChildNodes);
            if (data[0] != undefined) {
                if (data[2] != null && data[2] != undefined)
                    this.model.customObject = data[2].Value;
            }
            else if (data.d != undefined) {
                if (data.d[2] != null && data.d[2] != undefined)
                    this.model.customObject = data.d[2].Value;
            }
            else {
                if (data.customObject != null && data.customObject != undefined)
                    this.model.customObject = data.customObject;
            }
            if (this.model.afterServiceInvoke != null)
                this._trigger("afterServiceInvoke", { action: "memberExpanded", element: this.element, customObject: this.model.customObject });
            var mapper = { id: "id", parentId: "pid", hasChild: "hasChildren", text: "name", isChecked: "checkedStatus" };
            if ($(this.pNode).parents("li").length > 1)
                parentNode = $(this.pNode).parents("li").first();
            else
                parentNode = $(this.pNode).parents("li");
            $($(parentNode).find('input.nodecheckbox')[0]).ejCheckBox({ checked: false })

            if (this.model.enableMemberEditorSorting)
                newDataSource = ej.DataManager(newDataSource).executeLocal(ej.Query().sortBy("name", this._sortType));
            if (!ej.DataManager(this._editorTreeData).executeLocal(ej.Query().where("pid", "equal", newDataSource[0].pid)).length > 0)
                $.merge(this._editorTreeData, $.extend(true, [], newDataSource));
            this.element.find(".nodeExpand").remove();
            if (this.model.enableMemberEditorPaging) {
                var collObj = ej.Pivot._generateChildWithAncestors(this, parentNode, this.model.enableMemberEditorPaging, this.model.memberEditorPageSize);
                if ((newDataSource.length >= this.model.memberEditorPageSize || collObj.lstChildren.length >= this.model.memberEditorPageSize)) {
                    this.element.find(".searchEditorTreeView").data("ejMaskEdit").clear();
                    this._lastSavedTree = [];
                    ej.Pivot._makeAncestorsExpandable(this, parentNode[0].id);
                    this._isEditorDrillPaging = true;
                    var parentNodeObj = collObj.allLvlLst.length > 1 && collObj.lstChildren.length >= this.model.memberEditorPageSize ? ej.Pivot._getParentsTreeList(this, collObj.lstParents[0].id, this._editorTreeData) : $.grep(this._editorTreeData, function (value) { return value.id == parentNode["0"].id; return false; })[0];
                    var editorDrillParams = { childNodes: collObj.allLvlLst.length > 1 && collObj.lstChildren.length >= this.model.memberEditorPageSize ? collObj.lstChildren : newDataSource, parentNode: parentNodeObj };
                    ej.Pivot._drillEditorTreeNode(editorDrillParams, this, this.model.memberEditorPageSize);
                }
                else
                    this._memberTreeObj.addNode(ej.Pivot._showEditorLinkPanel(newDataSource, this, this), parentNode);
            }
            else
                this._memberTreeObj.addNode(ej.Pivot._showEditorLinkPanel(newDataSource, this, this), parentNode);
            $.each($(parentNode).children().find("li"), function (index, value) {
                if (!ej.isNullOrUndefined(newDataSource[index]))
                    value.setAttribute("data-tag", newDataSource[index].tag);
            });
            //this._memberTreeObj._expandCollapseAction(this.pNode);
            this._successAction = "FetchChildNode";
            this._trigger("renderSuccess", this);
            this.element.find(".e-dialog #preventDiv").remove();
        },

        _createCubeSelector: function () {
            return ej.buildTag("div.e-csHeader", ej.buildTag("span.cubeText", this._getLocalizedLabels("CubeSelector"), { "padding-left": "6px", "float": "left", "margin-bottom": "10px", "width": this.model.enableSplitter && !this.model.isResponsive ? "25%" : "", "text-overflow": "ellipsis" })[0].outerHTML + ej.buildTag("div.cubeSelect", "<input type='text' id='cubeSelector' class ='cubeSelector' />", { display: "inline", "float": "left", "padding-left": this.model.enableSplitter ? "1%" : "8px", "position": "relative", "top": "-3px", "width": this.model.enableSplitter && !this.model.isResponsive ? "70.5%" : "" })[0].outerHTML, { width: (this.model.isResponsive || this.model.enableSplitter) ? "100%" : "", height: "20px" })[0].outerHTML;
        },

        _createCubeBrowser: function (cubeTreeInfo) {
            return ej.buildTag("div.e-cdbHeader", ej.buildTag("span", this._getLocalizedLabels("CubeDimensionBrowser"))[0].outerHTML, { width: (this.model.enableSplitter ? "100%" : ""), height: "30px" })[0].outerHTML + ej.buildTag("div.e-cubeBrowser", ej.buildTag("div.e-cubeTreeView.visibleHide")[0].outerHTML, { width: (this.model.enableSplitter ? "100%" : "") })[0].outerHTML;
        },

        _createAxisElementBuilder: function (columnDimensions, rowDimensions, slicerDimensions) {
            if (!this.model.enableSplitter) {
                var AEBPanel = ej.buildTag("div.e-axisHeader", ej.buildTag("span", this._getLocalizedLabels("Column"))[0].outerHTML, { height: "30px" })[0].outerHTML + ej.buildTag("div.e-categoricalAxis", this._createSplitButtons(columnDimensions, "Columns"), { width: this.model.isResponsive ? "99%" : "" }).attr("aria-label", "column")[0].outerHTML +
                ej.buildTag("div.e-axisHeader", ej.buildTag("span", this._getLocalizedLabels("Row"))[0].outerHTML, { height: "30px" })[0].outerHTML + ej.buildTag("div.e-rowAxis", this._createSplitButtons(rowDimensions, "Rows"), { width: this.model.isResponsive ? "99%" : "" }).attr("aria-label", "row")[0].outerHTML +
                ej.buildTag("div.e-axisHeader", ej.buildTag("span", this._getLocalizedLabels("Slicer"))[0].outerHTML, { height: "30px" })[0].outerHTML + ej.buildTag("div.e-slicerAxis", this._createSplitButtons(slicerDimensions, "Slicers"), { width: this.model.isResponsive ? "99%" : "" }).attr("aria-label", "slicer")[0].outerHTML;
            }
            else {
                var AEBPanel = ej.buildTag("div.e-axisHeader", ej.buildTag("span", this._getLocalizedLabels("Column"))[0].outerHTML, { height: "30px", width: "99%" })[0].outerHTML + ej.buildTag("div.e-categoricalAxis", this._createSplitButtons(columnDimensions, "Columns"), { width: this.model.isResponsive || this.model.enableSplitter ? "99%" : "" }).attr("aria-label", "column")[0].outerHTML +
                ej.buildTag("div.e-axisHeader", ej.buildTag("span", this._getLocalizedLabels("Row"))[0].outerHTML, { height: "30px", width: "99%" })[0].outerHTML + ej.buildTag("div.e-rowAxis", this._createSplitButtons(rowDimensions, "Rows"), { width: this.model.isResponsive || this.model.enableSplitter ? "99%" : "" }).attr("aria-label", "row")[0].outerHTML +
                ej.buildTag("div.e-axisHeader", ej.buildTag("span", this._getLocalizedLabels("Slicer"))[0].outerHTML, { height: "30px", width: "99%" })[0].outerHTML + ej.buildTag("div.e-slicerAxis", this._createSplitButtons(slicerDimensions, "Slicers"), { width: this.model.isResponsive || this.model.enableSplitter ? "99%" : "" }).attr("aria-label", "slicer")[0].outerHTML;
            }
            return AEBPanel;
        },

        _createSplitButtons: function (dimensionElements, axis) {
            var splitButtons = '';
            var captionName = '';
            if (dimensionElements.indexOf("~") > -1)
                for (var i = 0; i < dimensionElements.split('~')[0].split('#').length - 1; i++) {
                    captionName = dimensionElements.split('~')[0].split('#')[i + 1].split('.')[0];
                    if (captionName == "Measures") {
                        captionName = this._getLocalizedLabels("Measures");
                    }
                    else if (captionName == "KPIs") {
                        captionName = this._getLocalizedLabels("KPIs");
                    }
                    else if (!(dimensionElements.startsWith("#Measure")))
                        captionName = dimensionElements.split('~')[i + 2];
                    else if ((dimensionElements.indexOf("#Measure")) > -1)
                        captionName = dimensionElements.split('~')[i + 1];
                    if (captionName == undefined)
                        captionName = dimensionElements.split('~')[i + 1];
                    splitButtons += ej.buildTag("div.e-splitBtn", ej.buildTag("button.e-pvtBtn", captionName).attr({ "title": dimensionElements.split('~')[0].split('#')[i + 1].replace('.', ' - ').split("$")[0], fieldCaption: captionName, allMember: dimensionElements.split('~')[0].split('#')[i + 1].replace('.', ' - ').split('$')[1] })[0].outerHTML + ej.buildTag("span.e-removeSplitBtn e-icon").attr("role", "button").attr("aria-label", "remove")[0].outerHTML, "", { "data-tag": axis + ':' + dimensionElements.split('~')[0].split('#')[i + 1].split("$")[0] })[0].outerHTML;
                }
            else
                for (var i = 0; i < dimensionElements.split('#').length - 1; i++) {
                    var caption, splitBtnTitle, parent, tag = dimensionElements.split('#')[i + 1].split("$")[0];
                    if (dimensionElements.split('#')[i + 1].split("::")[1] == "CalculatedMember") {
                        splitBtnTitle = dimensionElements.split('#')[i + 1].split("::")[0];
                        caption = splitBtnTitle.split(".")[splitBtnTitle.split(".").length - 1];
                        splitBtnTitle = splitBtnTitle.replace('.', ' - ');
                    }
                    else {
                        caption = dimensionElements.split('#')[i + 1].split('.')[0] == "Measures" ? this._getLocalizedLabels("Measures") : dimensionElements.split('#')[i + 1].split('.')[0];
                        if (caption.split("::")[1] != undefined && caption.split("::")[1] != null && caption.split("::")[1].split(">>")[0] == "NAMEDSET") {
                            parent = dimensionElements.split('#')[i + 1].split("::")[1].split(">>")[1];
                            caption = caption.split("::")[0];
                            tag = dimensionElements.split('#')[i + 1].split("$")[0].split(">>")[0];
                        }
                        splitBtnTitle = dimensionElements.split('#')[i + 1].replace('.', ' - ').split("$")[0] == "Measures" ? this._getLocalizedLabels("Measures") : dimensionElements.split('#')[i + 1].replace('.', ' - ').split("$")[0];
                    }
                    if (this.model.enableRTL && splitBtnTitle.indexOf("-") > 0) {
                        splitBtnTitle = splitBtnTitle.split("-").reverse().join(" - ");
                    }
                    splitButtons += ej.buildTag("div.e-splitBtn", ej.buildTag("button.e-pvtBtn", this.model.showUniqueNameOnPivotButton ? splitBtnTitle : caption).attr({ "title": splitBtnTitle, fieldCaption: caption, allMember: dimensionElements.split('#')[i + 1].split("$")[1] })[0].outerHTML + ej.buildTag("span.e-removeSplitBtn e-icon").attr("role", "button").attr("aria-label", "remove")[0].outerHTML, "", { "data-parenthierarchy": parent, "data-tag": axis + ':' + tag })[0].outerHTML;
                }
            return splitButtons;
        },

        _setSplitBtnTitle: function () {
            var pivotButtons = this.element.find(".e-splitBtn");
            for (var i = 0; i < pivotButtons.length; i++) {
                var tagValue = $(pivotButtons[i]).attr("data-tag").split(":")[1].split("."),
                uniqueName = "", orgName = "";
                for (var j = 0; j < tagValue.length; j++) {
                    if (tagValue[0].toUpperCase() != "[Measures]")
                        uniqueName += "[" + tagValue[j] + "]" + (j % 2 == 0 ? "." : "");
                    else
                        uniqueName += tagValue[j] + (j % 2 == 0 ? "." : "");
                }
                if (this.element.find(".e-cubeTreeView").length > 0 && !(uniqueName.indexOf("Measures") >= 0)) {
                    uniqueName = uniqueName.indexOf("<>") > 0 ? uniqueName.replace("<>", ".") : uniqueName;
                    if (uniqueName.indexOf("'") > 0)
                        uniqueName = uniqueName.replace(/'/g, "~@");
                    var splBtnTitle = "", allMember = $(pivotButtons[i]).find("button").attr("allMember");
                    allMember = allMember != "All" ? allMember : this._getLocalizedLabels("All");
                    var liElementText = this.element.find(".e-cubeTreeView").find("li[data-tag='" + uniqueName + "'] a:eq(0)").text();
                    if (liElementText == "")
                        liElementText = this.element.find(".e-cubeTreeView").find("li[data-tag='" + "[" + tagValue[1] + "]" + "'] a:eq(0)").text();
                    if (liElementText.indexOf(".") > 0)
                        $(pivotButtons[i]).find("button").attr("title", (this.model.enableRTL ? liElementText.split(".").reverse().join(" - ") : liElementText.replace('.', ' - ')));
                    else {
                        var hName = this.element.find(".e-cubeTreeView").find("li[data-tag='" + uniqueName + "'] a:eq(0)").text() || this.element.find(".e-cubeTreeView").find("li[data-tag='" + uniqueName.toUpperCase() + "'] a:eq(0)").text() || liElementText;
                        splBtnTitle = $(pivotButtons[i]).find("button").attr("fieldCaption") == this._getLocalizedLabels("KPIs") ? this._getLocalizedLabels("KPIs") : $(pivotButtons[i]).find("button").attr("fieldCaption") + (hName != "" ? (" - " + hName) : "");
                        splBtnTitle = (this.model.enableRTL && splBtnTitle.indexOf("-") > 0 ? splBtnTitle.split("-").reverse().join(" - ") : splBtnTitle);
                        $(pivotButtons[i]).find("button").attr("title", splBtnTitle);
                    }
                    if ($(pivotButtons[i]).attr("data-tag").split(":")[0] == "Slicers" && $(pivotButtons[i]).attr("data-tag").indexOf("::CalculatedMember") < 0) {
                        splBtnTitle = $(pivotButtons[i]).attr("data-tag").split(":")[1];
                        var filterState = (this._fieldSelectedMembers[splBtnTitle] == "All" ? allMember : this._fieldSelectedMembers[splBtnTitle]) || allMember;
                        $(pivotButtons[i]).find("button").text((this.model.showUniqueNameOnPivotButton ? $(pivotButtons[i]).find("button").parent().attr("data-tag").split(":")[1].replace(".", " - ") : $(pivotButtons[i]).find("button").attr("fieldCaption")) + " (" + filterState + ")");
                        $(pivotButtons[i]).find("button").attr("title", $(pivotButtons[i]).find("button").attr("title") + " (" + filterState + ")");
                    }
                }
            }
        },

        _addSplitButtonHeight: function(){
            var pivotButtons = this.element.find(".e-splitBtn");
            for (var i = 0; i < pivotButtons.length; i++) {
                $(pivotButtons[i]).find(".e-removeSplitBtn").height($(pivotButtons[i]).height() - 9);
                $(pivotButtons[i]).find(".e-removeSplitBtn").css("line-height",$(pivotButtons[i]).find(".e-removeSplitBtn").height()+"px");
            }
    },

        _controlPanel: function () {
            var controlTable; var gridDiv;
            if (this.displayMode() != ej.PivotClient.DisplayMode.ChartOnly) {
                if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == ej.PivotClient.DisplayMode.ChartAndGrid) {
                    if (this.defaultView() == ej.PivotClient.DefaultView.Grid)
                        gridDiv = ej.buildTag("div#gridPanel.e-gridPanel", ej.buildTag("div.e-gridContainer", ej.buildTag("div#" + this._id + "_PivotGrid", "", { "margin": this.model.enableToolBar ? "5px 0px 7px" : "5px 7px 7px", "padding": "1px" })[0].outerHTML, { "position": "relative", "overflow": this.model.enableToolBar ? "" : "auto", "left": "5px", "top": "5px", "width": (this.model.isResponsive) ? "100%" : (this.model.enableSplitter ? "inherit" : "") })[0].outerHTML, { width: this.model.enableSplitter ? "99%" : "auto", height: "auto" })[0].outerHTML;
                    else
                        gridDiv = ej.buildTag("div#gridPanel.e-gridPanel", ej.buildTag("div.e-gridContainer", ej.buildTag("div#" + this._id + "_PivotGrid", "", { "margin": this.model.enableToolBar ? "10px 0px 7px" : "10px 7px 7px", "padding": "1px", "width": (this.model.isResponsive && !this.model.enableSplitter) ? "auto" : (this.model.enableSplitter ? "inherit" : "") })[0].outerHTML, { "position": "relative", "left": "7px", "border-top": "none", "margin-top": "-7px", "overflow": this.model.enableToolBar ? "" : "auto", "height": this.model.enablePaging ? "277px" : "", "width": this.model.isResponsive ? "100%" : "" })[0].outerHTML, { width: "auto", height: "auto" })[0].outerHTML;
                }
                else {
                    if (this.displayMode() == ej.PivotClient.DisplayMode.GridOnly)
                        gridDiv = ej.buildTag("div#gridPanel.e-gridPanel", ej.buildTag("div.e-gridContainer", ej.buildTag("div#" + this._id + "_PivotGrid", "", { "margin": this.model.enableToolBar ? "5px 0px 7px" : "5px 7px 7px", "padding": "1px" })[0].outerHTML, { "overflow": this.model.enableToolBar ? "" : "auto", "position": "absolute", "left": this.model.enableSplitter ? (this.model.enableRTL ? "13px" : "5px") : "7px", "padding-top": "2px", "width": (this.model.isResponsive) ? "100%" : (this.model.enableSplitter ? "98%" : ""), "top": "3px" })[0].outerHTML, { width: "auto", height: "auto" })[0].outerHTML;
                    else
                        gridDiv = ej.buildTag("div#gridPanel.e-gridPanel", ej.buildTag("div.e-gridContainer", ej.buildTag("div#" + this._id + "_PivotGrid", "", { "margin": this.model.enableToolBar ? "5px 0px 7px" : "5px 7px 7px", "padding": "1px" })[0].outerHTML, { "overflow": this.model.enableToolBar ? "" : "auto", "position": "relative", "width": (this.model.isResponsive) ? "100%" : "", "left": window.navigator.userAgent.indexOf('Trident') > 0 ? (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? (!this.model.enableRTL ? (this.model.enableSplitter ? "5px" : "0px") : "15px") : (this.model.enableRTL ? "5px" : (this.model.enableSplitter ? "4px" : "7px"))) : (this.model.enableRTL ? "5px" : (this.model.enableSplitter ? (this.model.enableVirtualScrolling ? "8px" : "5px") : "7px")), "padding-top": "5px", "border-top": "none" })[0].outerHTML, { width: "100%", height: "auto" })[0].outerHTML;
                }
            }
            if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                var chartDiv;
                if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == ej.PivotClient.DisplayMode.ChartAndGrid) {
                    if (this.defaultView() == ej.PivotClient.DefaultView.Grid)
                        chartDiv = ej.buildTag("div#chartPanel.e-chartPanel", ej.buildTag("div.e-chartContainer", ej.buildTag("div#" + this._id + "_PivotChart", "", { "overflow": this.model.enableToolBar || this.model.isResponsive ? "" : "auto", "border": this.model.enableToolBar ? "none" : "" })[0].outerHTML, { "position": "relative", "overflow": this.model.enableToolBar || this.model.enableSplitter ? "" : "auto", "left": "-2px", "padding": this.model.enableToolBar ? "5px 0px 5px 0px" : this.model.enableSplitter ? "5px 3px 5px 5px" : "5px 0px 5px 5px", "width": (this.model.isResponsive) ? "99.2%" : (this.model.enableSplitter ? "inherit" : ""), "border-top": "none", "margin-right": "-11px" })[0].outerHTML, { width: "100%", height: "auto" })[0].outerHTML;
                    else
                        chartDiv = ej.buildTag("div#chartPanel.e-chartPanel", ej.buildTag("div.e-chartContainer", ej.buildTag("div#" + this._id + "_PivotChart", "", { "min-height": this.model.enablePaging ? "255px" : "", "border": this.model.enableToolBar ? "none" : "" })[0].outerHTML, { "position": "relative", "overflow": this.model.enableToolBar || this.model.enableSplitter || this.model.isResponsive ? "" : "auto", "padding": this.model.enableToolBar ? "5px 0px 5px 0px" : "5px 0px 5px 5px", "width": (this.model.isResponsive) ? "99.6%" : (this.model.enableSplitter ? "inherit" : "") })[0].outerHTML, { width: "98%", height: "auto" })[0].outerHTML;
                }
                else {
                    if (this.displayMode() == ej.PivotClient.DisplayMode.ChartOnly)
                        chartDiv = ej.buildTag("div#chartPanel.e-chartPanel", ej.buildTag("div.e-chartContainer", ej.buildTag("div#" + this._id + "_PivotChart", "", { "border": this.model.enableToolBar ? "none" : "" })[0].outerHTML, { "position": "relative", "overflow": this.model.enableToolBar || this.model.enableSplitter || this.model.isResponsive ? "" : "auto", "padding": this.model.enableRTL ? (this.model.enableSplitter && !this.model.isResponsive ? "5px 4px 2px 6px" : "5px 25px 2px 6px") : (this.model.enableToolBar ? "5px 0px 5px 0px" : "5px 0px 5px 5px"), "margin-right": this.model.enableRTL ? "1px" : "-11px" })[0].outerHTML, { width: this.model.enableSplitter ? "96%" : (this.model.isResponsive? "99%" : "98%"), margin: this.model.enableSplitter ? (this.model.enableRTL ? (!(this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) ? "5px 2px 7px" : "5px -5px 7px") : "5px 5px 7px") : "5px 7px 7px", height: "auto" })[0].outerHTML;
                    else
                        chartDiv = ej.buildTag("div#chartPanel.e-chartPanel", ej.buildTag("div.e-chartContainer", ej.buildTag("div#" + this._id + "_PivotChart", "", { "border": this.model.enableToolBar ? "none" : "" })[0].outerHTML, { "position": "relative", "overflow": this.model.enableToolBar || this.model.enableSplitter || this.model.isResponsive ? "" : "auto", "top": "-5px", "left": window.navigator.userAgent.indexOf('Trident') > 0 ? (this.model.enableSplitter ? "-1px" : "-7px") : (this.model.enableRTL ? "12px" : "0px"), "padding": this.model.enableRTL ? "5px 5px 0px 5px" : (this.model.enableToolBar ? "5px 0px 5px 0px" : "5px 0px 5px 5px"), "border-top": "none", "margin-right": this.model.enableRTL ? "0px" : (this.model.enableSplitter ? "-9px" : "-11px"), "margin-left": this.model.enableRTL ? "-11px" : "0px" })[0].outerHTML, { margin: this.model.enableSplitter ? (this.model.enableRTL ? "5px -3px 7px" : "5px 5px 7px") : (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? "5px 5px 7px" : "5px 7px 7px"), width: this.model.isResponsive ? (this.model.enableSplitter ? (this.model.enableRTL ? "96%" : "99%") : "98.5%") : "98.5%", left: this.model.enableSplitter ? "7px" : "", height: "auto" })[0].outerHTML;
                }
            }
            if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tab && this.displayMode() == ej.PivotClient.DisplayMode.ChartAndGrid) {
                var tabUl; var tabDiv;
                var gridAnchor = "<a style='font: bold 12px Segoe UI' href='#gridPanel' tabindex='0'>" + this._getLocalizedLabels("Grid") + "</a>";
                var chartAnchor = "<a style='font: bold 12px Segoe UI' href='#chartPanel' tabindex='0'>" + this._getLocalizedLabels("Chart") + "</a>";
                var marginLeft = window.navigator.userAgent.indexOf('Trident') > 0 ? (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? (!this.model.enableRTL ? (this.model.enableSplitter ? "5px" : "0px") : "15px") : (this.model.enableRTL ? "5px" : (this.model.enableSplitter ? "4px" : "7px"))) : (this.model.enableRTL ? "5px" : (this.model.enableSplitter ? (this.model.enableVirtualScrolling ? "8px" : "5px") : "7px")), marginRight = 0;
                if (this.model.enableRTL) {
                    marginRight = "-" + marginLeft;
                    marginLeft = 0;
                }
                if (this.defaultView() == ej.PivotClient.DefaultView.Chart) {
                    tabUl = ej.buildTag("ul.clientTab", ej.buildTag("li", chartAnchor)[0].outerHTML + ej.buildTag("li", gridAnchor)[0].outerHTML, { "margin-left": marginLeft, "margin-right": marginRight })[0].outerHTML;
                    tabDiv = ej.buildTag("div#clientTab", tabUl + chartDiv + gridDiv)[0].outerHTML;
                }
                else {
                    tabUl = ej.buildTag("ul.clientTab", ej.buildTag("li", gridAnchor)[0].outerHTML + ej.buildTag("li", chartAnchor)[0].outerHTML, { "margin-left": marginLeft, "margin-right": marginRight })[0].outerHTML;
                    tabDiv = ej.buildTag("div#clientTab", tabUl + gridDiv + chartDiv, { "height": "100%" })[0].outerHTML;
                }
                controlTable = tabDiv;
            }
            else {
                controlTable = this._createControlContainer(this.controlPlacement(), chartDiv, gridDiv);
            }

            return ej.buildTag("div.e-controlPanel", controlTable, { width: this.model.isResponsive ? "100%" : this.model.displaySettings.controlPlacement == "tab" ? ((this.model.analysisMode == "olap" && this.model.operationalMode == "servermode") || !this.model.enableSplitter) ? "" : "99%" : "auto", "top": this.model.displaySettings.mode == ej.PivotClient.DisplayMode.GridOnly ? "3px" : "none", "margin-bottom": ((this.model.displaySettings.controlPlacement == ej.PivotClient.ControlPlacement.Tile && (this.model.enablePaging || this.model.enableVirtualScrolling)) ? "5px" : "0") })[0].outerHTML + (this.model.enablePaging ? ej.buildTag("div#" + this._id + "_Pager")[0].outerHTML : this.model.enableVirtualScrolling ? ej.buildTag("div#hsVirtualScrolling.hsVirtualScrolling", ej.buildTag("div.e-hScrollPanel")[0].outerHTML, { width: "10px" })[0].outerHTML : "");
        },

        _createControlContainer: function (controlPlacement, chartDiv, gridDiv) {
            var controlTable;
            if (this.displayMode() == ej.PivotClient.DisplayMode.ChartOnly)
                controlTable = "<table style='width:100%'><tr><td>" + chartDiv + "</td></tr></table>";
            else if (this.displayMode() == ej.PivotClient.DisplayMode.GridOnly)
                controlTable = "<table style='width:100%'><tr><td>" + gridDiv + "</td></tr></table>";
            else {
                if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile) {
                    if (this.defaultView() == ej.PivotClient.DefaultView.Chart)
                        controlTable = "<table style='width:100%'><tr><td>" + chartDiv + "</td></tr><tr><td>" + gridDiv + "</td></tr></table>";
                    else
                        controlTable = "<table style='width:100%'><tr><td>" + gridDiv + "</td></tr><tr><td>" + chartDiv + "</td></tr></table>";
                }
                else {
                    if (this.defaultView() == ej.PivotClient.DefaultView.Chart)
                        controlTable = "<table style='width:100%'><tr><td valign='top'>" + chartDiv + "</td><td valign='top'>" + gridDiv + "</td></tr></table>";
                    else
                        controlTable = "<table style='width:100%'><tr><td valign='top'>" + gridDiv + "</td><td valign='top'>" + chartDiv + "</td></tr></table>";
                }
            }
            return controlTable;
        },

        _renderPivotGrid: function (tagInfo) {
            tagInfo = ej.isNullOrUndefined(tagInfo) ? "" : tagInfo;
            this.element.find(".e-dialog").hide();
            if (this.displayMode() != ej.PivotClient.DisplayMode.ChartOnly) {
                var gridDiv;
                if (this._pivotChart != undefined && this._pivotChart._startDrilldown) {
                    var report;
                    try {
                        report = JSON.parse(this._pivotGrid.getOlapReport()).Report;
                    }
                    catch (err) {
                        report = this._pivotGrid.getOlapReport();
                    }
                    this._pivotGrid.doAjaxPost("POST", this.model.url + "/" + this._pivotGrid.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillDownGrid", "cellPosition": "", "currentReport": report, "clientReports": this.reports, "headerInfo": tagInfo, layout: this.gridLayout(), enableRTL: this.model.enableRTL }), this._pivotGrid._drillDownSuccess);
                }
                else {
                    if (!this.model.enableDeferUpdate) {
                        var conditionalFormating = this._pivotGrid.model.enableConditionalFormatting ? this._pivotGrid.model.conditionalFormatSettings : [];
                        this.element.find(".e-pivotgrid, #" + this._id + "_PivotGrid").remove();
                        if (this.controlPlacement() == ej.PivotClient.ControlPlacement.Tile && this.displayMode() == ej.PivotClient.DisplayMode.ChartAndGrid)
                            gridDiv = ej.buildTag("div#" + this._id + "_PivotGrid", "", { "margin": this.model.enableToolBar ? "5px 0px 7px" : "5px 7px 7px", "width": this.model.isResponsive ? "auto" : " ", "padding": "1px" })[0].outerHTML;
                        else
                            gridDiv = ej.buildTag("div#" + this._id + "_PivotGrid", "", { "margin": this.model.enableToolBar ? "5px 0px 7px" : "5px 7px 7px", "padding": "1px" })[0].outerHTML;
                        $(gridDiv).appendTo(this.element.find(".e-gridContainer"));
                        if (this.gridLayout() != ej.PivotGrid.Layout.Normal)
                            this.element.find("#" + this._id + "_PivotGrid").ejPivotGrid({ url: this.model.url, customObject: this.model.customObject, enableRTL: this.model.enableRTL, enableDefaultValue: this.model.enableDefaultValue, enableCellSelection: this.model.enableCellSelection, cellSelection: this.model.cellSelection, hyperlinkSettings: { enableValueCellHyperlink: this.model.enableValueCellHyperlink, enableRowHeaderHyperlink: this.model.enableRowHeaderHyperlink, enableColumnHeaderHyperlink: this.model.enableColumnHeaderHyperlink, enableSummaryCellHyperlink: this.model.enableSummaryCellHyperlink }, enableCellContext: this.model.enableCellContext, enableDrillThrough: this.model.enableDrillThrough, enableCellEditing: this.model.enableCellEditing, enableCellDoubleClick: this.model.enableCellDoubleClick, enableCellClick: this.model.enableCellClick, valueCellHyperlinkClick: this.model.valueCellHyperlinkClick, rowHeaderHyperlinkClick: this.model.rowHeaderHyperlinkClick, columnHeaderHyperlinkClick: this.model.columnHeaderHyperlinkClick, summaryCellHyperlinkClick: this.model.summaryCellHyperlinkClick, cellContext: this.model.cellContext, cellEdit: this.model.cellEdit, cellDoubleClick: this.model.cellDoubleClick, enableCellClick: this.model.enableCellClick, drillThrough: this.model.drillThrough, isResponsive: this.model.isResponsive, currentReport: this.currentReport, locale: this.locale(), layout: this.gridLayout(), drillSuccess: ej.proxy(this._gridDrillSuccess, this), conditionalFormatSettings: conditionalFormating, enableConditionalFormatting: this._pivotGrid.model.enableConditionalFormatting });
                        else
                            this.element.find("#" + this._id + "_PivotGrid").ejPivotGrid({ url: this.model.url, customObject: this.model.customObject, enableRTL: this.model.enableRTL, enableDefaultValue: this.model.enableDefaultValue, enableCellSelection: this.model.enableCellSelection, cellSelection: this.model.cellSelection, hyperlinkSettings: { enableValueCellHyperlink: this.model.enableValueCellHyperlink, enableRowHeaderHyperlink: this.model.enableRowHeaderHyperlink, enableColumnHeaderHyperlink: this.model.enableColumnHeaderHyperlink, enableSummaryCellHyperlink: this.model.enableSummaryCellHyperlink }, enableCellContext: this.model.enableCellContext, enableDrillThrough: this.model.enableDrillThrough, enableCellEditing: this.model.enableCellEditing, enableCellDoubleClick: this.model.enableCellDoubleClick, enableCellClick: this.model.enableCellClick, valueCellHyperlinkClick: this.model.valueCellHyperlinkClick, rowHeaderHyperlinkClick: this.model.rowHeaderHyperlinkClick, columnHeaderHyperlinkClick: this.model.columnHeaderHyperlinkClick, summaryCellHyperlinkClick: this.model.summaryCellHyperlinkClick, cellContext: this.model.cellContext, cellEdit: this.model.cellEdit, cellDoubleClick: this.model.cellDoubleClick, enableCellClick: this.model.enableCellClick, drillThrough: this.model.drillThrough, isResponsive: this.model.isResponsive, currentReport: this.currentReport, locale: this.locale(), drillSuccess: ej.proxy(this._gridDrillSuccess, this), conditionalFormatSettings: conditionalFormating, enableConditionalFormatting: this._pivotGrid.model.enableConditionalFormatting });
                        this._pivotGrid = this.element.find("#" + this._id + "_PivotGrid").data("ejPivotGrid");
                    }
                    else {
                        this._isTimeOut = false;
                        this._waitingPopup.hide();
                    }
                }
            }
        },

        _renderPivotChart: function (drillTag, drillAction) {

            this.element.find(".e-dialog").hide();
            if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                if (this._pivotGrid != undefined && this._pivotGrid._startDrilldown) {
                    var report;
                    try {
                        report = JSON.parse(this._pivotChart.getOlapReport()).Report;
                    }
                    catch (err) {
                        report = this._pivotChart.getOlapReport();
                    }
                    this._pivotChart.doAjaxPost("POST", this.model.url + "/" + this._pivotChart.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": this._pivotChart.model.enableMultiLevelLabels ? (drillAction + "#fullchart") : drillAction, "drilledSeries": drillTag, "olapReport": report, "clientReports": this.reports }), this._pivotChart.renderControlSuccess);
                }
                else {
                    if (!this.model.enableDeferUpdate) {
                        var successEvt = null;
                        if (this.element.find(".e-pivotchart").length > 0) {
                            var pvtChartObj = this.element.find(".e-pivotchart").data("ejPivotChart");
                            successEvt = pvtChartObj.model.renderSuccess;
                        }
                        this.element.find(".e-pivotchart").remove();
                        var chartDiv = ej.buildTag("div#" + this._id + "_PivotChart", "", { "height": "auto" })[0].outerHTML;
                        if (this.element.find(".e-chartContainer").children().length == 0)
                            $(chartDiv).appendTo(this.element.find(".e-chartContainer"));
                        this.element.find("#" + this._id + "_PivotChart").ejPivotChart({ url: this.model.url, customObject: this.model.customObject, enableRTL: this.model.enableRTL, enableDefaultValue: this.model.enableDefaultValue, axesLabelRendering: this.model.axesLabelRendering, pointRegionClick: this.model.pointRegionClick, canResize: this.model.isResponsive, currentReport: this.currentReport, customObject: this.model.customObject, locale: this.locale(), showTooltip: true, size: { height: this._chartHeight, width: this._chartWidth }, commonSeriesOptions: { type: this.model.chartType, tooltip: { visible: true } }, beforeServiceInvoke: this.model.chartLoad, drillSuccess: ej.proxy(this._chartDrillSuccess, this), renderSuccess: successEvt });
                        this._pivotChart = this.element.find('#' + this._id + '_PivotChart').data("ejPivotChart");
                        this.element.find('#' + this._id + '_PivotChart').width(this._pivotChart.model.size.width);
                        if (this.model.enableToolBar)
                            this.element.find('#' + this._id + '_PivotChart').css("border", "none");
                    }
                    else {
                        this._isTimeOut = false;
                        this._waitingPopup.hide();
                    }
                }
            }
            if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly)
                if (this._toggleExpand && !this.model.isResponsive && (this.chartObj.sfType.split(".")).pop().toLowerCase() != "treemap") {
                    this.element.find(".e-toggleExpandButton").click();
                }
        },

        _renderPivotTreeMap: function (drillTag, currentAction) {
            this.element.find(".e-dialog").hide();
            if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                if (this._pivotGrid != undefined && this._pivotGrid._startDrilldown) {
                    var report = this.otreemapObj.getOlapReport();
                    this.otreemapObj.doAjaxPost("POST", this.model.url + "/" + this.otreemapObj.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": currentAction, "drillInfo": drillTag, "olapReport": report, "clientReports": this.reports }), this.otreemapObj.renderControlSuccess);
                    if (!ej.isNullOrUndefined(this.chartObj)) {
                        if (this.model.displaySettings.enableFullScreen || this.enableTogglePanel() && (this.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                            $("#" + this.otreemapObj._id + "TreeMapContainer").css({ width: "100%" });
                            this.otreemapObj._treeMap.refresh();
                        }
                    }
                }
                else {
                    if (!this.model.enableDeferUpdate) {
                        this.element.find(".e-pivottreemap").remove();
                        var chartDiv = ej.buildTag("div#" + this._id + "_PivotChart", "", { "height": "auto" })[0].outerHTML;
                        if (this.element.find(".e-chartContainer").children().length == 0)
                            $(chartDiv).appendTo(this.element.find(".e-chartContainer"));
                        this.element.find("#" + this._id + "_PivotChart").ejPivotTreeMap({ url: this.model.url, customObject: this.model.customObject, canResize: this.model.isResponsive, currentReport: this.currentReport, customObject: this.model.customObject, locale: this.locale(), size: { height: this._chartHeight, width: this._chartWidth }, beforeServiceInvoke: this.model.treeMapLoad, drillSuccess: ej.proxy(this._treemapDrillSuccess, this) });
                        this.otreemapObj = this.element.find('#' + this._id + '_PivotChart').data("ejPivotTreeMap");
                        this.element.find('#' + this._id + '_PivotChart').width(this.otreemapObj.model.size.width);
                    }
                    else {
                        this._isTimeOut = false;
                        this._waitingPopup.hide();
                    }
                }
            }
            if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly)
                if (this._toggleExpand && !this.model.isResponsive && (this.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                    this.element.find(".e-toggleExpandButton").click();
                }
        },
        _renderControls: function () {
            if ((this._isNodeOrButtonDropped && ej.isNullOrUndefined(this.chartObj) || this._isrenderTreeMap) && this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                this._isNodeOrButtonDropped = false;
                this._isrenderTreeMap = false;
                this.chartObj = null;
                this.chartObj = this.element.find("#" + this._pivotChart._id + "Container").data("ejChart");
                if (ej.isNullOrUndefined(this.chartObj) && !ej.isNullOrUndefined(this.otreemapObj))
                    this.chartObj = this.element.find("#" + this.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
            }
            if (this.displayMode() == ej.PivotClient.DisplayMode.GridOnly) {
                if (this.defaultView() == ej.PivotClient.DefaultView.Chart) {
                    this._renderPivotChart();
                    this._renderPivotGrid();
                }
                else {
                    this._renderPivotGrid();
                    this._renderPivotChart();
                }
            }
            else {
                if (this.defaultView() == ej.PivotClient.DefaultView.Chart) {
                    if (!ej.isNullOrUndefined(this.chartObj)) {
                        if ((this.chartObj.sfType.split(".")).pop().toLowerCase() != "treemap")
                            this._renderPivotChart();
                        else
                            if (this.model.enablePivotTreeMap)
                                this._renderPivotTreeMap()
                    }
                    else {
                        if (this.element.find("#" + this._pivotChart._id + "Container").length > 0)
                            this._renderPivotChart();
                        else
                            if (this.model.enablePivotTreeMap)
                                this._renderPivotTreeMap()
                    }
                    this._renderPivotGrid();
                }
                else {
                    this._renderPivotGrid();
                    if (!ej.isNullOrUndefined(this.chartObj)) {
                        if ((this.chartObj.sfType.split(".")).pop().toLowerCase() != "treemap")
                            this._renderPivotChart();
                        else
                            if (this.model.enablePivotTreeMap)
                                this._renderPivotTreeMap();
                    }
                    else {
                        if (this.element.find("#" + this._pivotChart._id + "Container").length > 0)
                            this._renderPivotChart();
                        else
                            if (this.model.enablePivotTreeMap)
                                this._renderPivotTreeMap();
                    }
                }
            }
        },

        _createDialogRequest: function (evt) {
            if (evt.target.className.indexOf("e-dialogOKBtn") >= 0)
                return;
            if ((evt.target.type == "button" && $(evt.target).parent().attr("data-tag").indexOf("::CalculatedMember") > -1)) {
                this._selectedCalcMember = $(evt.target).parent().text();
                if (this.element.find(".calcMemberDialog").length > 0) {
                    this._calcMemberTreeObj.collapseAll();
                    ej.Pivot.closePreventPanel(this);
                    this._calcMemberDialog.open();
                    var calcMember = ej.DataManager(this._calcMembers).executeLocal(ej.Query().where("name", "equal", this._selectedCalcMember));
                    if (calcMember.length > 0) {
                        this.element.find("#" + this._id + "_captionFieldCM").val(calcMember[0].name);
                        this.element.find("#" + this._id + "_expressionFieldCM").val(calcMember[0].expression);
                        this.element.find("#" + this._id + "_memberTypeFieldCM").data("ejDropDownList").selectItemsByIndices(calcMember[0].nodeType);
                        if (calcMember[0].nodeType == 1) {
                            var dimensionName = calcMember[0].tag.split(".")[0].replace(/\[/g, "").replace(/\]/g, "");
                            var dimensionFieldLen = this.element.find("#" + this._id + "_dimensionFieldCM").data("ejDropDownList").model.dataSource;
                            for (var i = 0; i < dimensionFieldLen.length; i++) {
                                if (dimensionFieldLen[i].value == dimensionName)
                                    this.element.find("#" + this._id + "_dimensionFieldCM").data("ejDropDownList").selectItemsByIndices(i);
                            }
                        }
                        if (!ej.isNullOrUndefined(calcMember[0].formatString)) {
                            if (calcMember[0].formatString == "Currency")
                                this.element.find("#" + this._id + "_formatFieldCM").data("ejDropDownList").selectItemsByIndices(1);
                            else if (calcMember[0].formatString == "Percent")
                                this.element.find("#" + this._id + "_formatFieldCM").data("ejDropDownList").selectItemsByIndices(2);
                            else {
                                this.element.find("#" + this._id + "_formatFieldCM").data("ejDropDownList").selectItemsByIndices(2);
                                this.element.find("#" + this._id + "_customFormatFieldCM").val(calcMember[0].formatString)
                            }
                        }
                    }
                }
                else {
                    this._waitingPopup.show();
                    if (this.model.beforeServiceInvoke != null)
                        this._trigger("beforeServiceInvoke", { action: "fetchCalcMemberTreeView", element: this.element, customObject: this.model.customObject });
                    var serializedCustomObject = JSON.stringify(this.model.customObject);
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.fetchMemberTreeNodes, JSON.stringify({ "action": "fetchCalcMemberTreeView", "dimensionName": "calcMember", "olapReport": this.currentReport, "customObject": serializedCustomObject }), ej.proxy(ej.Pivot._createCalcMemberDialog, this));
                }
                return;
            }
            if (this.model.enableMemberEditorPaging) {
                this._memberPageSettings.startPage = 0;
                this._memberPageSettings.currentMemeberPage = 1;
                this._selectedFieldName = $(evt.target).parent().attr("data-tag");
                this._memberPageSettings.filterReportCollection = {};
            }
            var pivotClientObj = this;
            this._args_className = evt.target.className;
            this._args_innerHTML = (evt.target.innerHTML == "" ? "ToolbarButtons" : evt.target.innerHTML);
            this._dialogTitle = this._hierarchyCaption = (ej.browserInfo().name == "msie" && ej.browserInfo().version <= 8) ? $(evt.currentTarget)[0].title : (evt.currentTarget.attributes == "" ? "" : ($(evt.currentTarget).attr("title")) || $(evt.currentTarget).attr("aria-label"));
            this._currentItem = this._hierarchyCaption;
            this.element.find(".e-dialog:not(.calcMemberDialog, .calcMemberDialog .e-dialog), .e-clientDialog").remove();
            if (this._args_innerHTML != "ToolbarButtons" && this._args_innerHTML != undefined && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                if ($(evt.target).parent().attr("data-tag").indexOf(":") >= 0 && $(evt.target).parent().attr("data-tag").split(":")[1].indexOf(".") >= 0) {
                    var btnUniqueName = $(evt.target).parent().attr("data-tag").split(":")[1].split(".");
                    var liElement = this.element.find(".e-cubeTreeView li[data-tag^='[" + btnUniqueName[0] + "'][data-tag$='" + btnUniqueName[1] + "]']");
                    if (liElement.length > 0) {
                        for (var i = 0; i < liElement.length; i++) {
                            if ($(liElement[i]).attr("data-tag").split("].").length == 2) {
                                this._selectedFieldName = $(liElement[i]).attr("data-tag");
                                break;
                            }
                        }
                    }
                    else
                        this._selectedFieldName = liElement.attr("data-tag");
                }
                else
                    this._selectedFieldName = "";
                pivotClientObj._isTimeOut = true;
                setTimeout(function () {
                    if (pivotClientObj._isTimeOut)
                        pivotClientObj._waitingPopup.show();
                }, 800);
                if (this.model.beforeServiceInvoke != null)
                    this._trigger("beforeServiceInvoke", { action: "fetchMemberTreeNodes", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.fetchMemberTreeNodes, JSON.stringify({ "action": "fetchMemberTreeNodes", "dimensionName": $(evt.target).parent().attr("data-tag"), "olapReport": this.currentReport, "customObject": serializedCustomObject }), this._editorTreeInfoSuccess);
            }
            else {
                this._createDialog(this._args_className, this._args_innerHTML, "");
            }
        },

        _fetchReportListSuccess: function (reportNameList) {

            var action = "";
            if (reportNameList[0] != undefined) {
                if (reportNameList[2] != null && reportNameList[2] != undefined)
                    this.model.customObject = reportNameList[2].Value;
            }
            else if (reportNameList.d != undefined) {
                if (reportNameList.d[2] != null && reportNameList.d[2] != undefined)
                    this.model.customObject = reportNameList.d[2].Value;
            }
            else {
                if (reportNameList.customObject != null && reportNameList.customObject != undefined)
                    this.model.customObject = reportNameList.customObject;
            }
            if (this.model.afterServiceInvoke != null)
                this._trigger("afterServiceInvoke", { action: "fetchReportList", element: this.element, customObject: this.model.customObject, reports: reportNameList });
            this.element.find(".e-dialog:not(.calcMemberDialog, .calcMemberDialog .e-dialog), .e-clientDialog").remove();
            if (reportNameList[0] != undefined) {
                action = !ej.isNullOrUndefined(reportNameList[1].Value) ? reportNameList[1].Value : "";
                reportNameList = !ej.isNullOrUndefined(reportNameList[0].Value) ? reportNameList[0].Value : "";
            }
            else if (reportNameList.d != undefined) {
                action = !ej.isNullOrUndefined(reportNameList.d[1].Value) ? reportNameList.d[1].Value : "";
                reportNameList = !ej.isNullOrUndefined(reportNameList.d[0].Value) ? reportNameList.d[0].Value : "";
            }
            else {
                action = reportNameList.action;
                reportNameList = reportNameList.ReportNameList;
            }
            if (reportNameList == "") {
                ej.Pivot._createErrorDialog(this._getLocalizedLabels("NoReports"), this._getLocalizedLabels("Warning"), this);
                this._isTimeOut = false;
            }
            else
                this._createDialog(action, reportNameList, "");
        },

        _fetchSortState: function (value) {
            this._isTimeOut = false;
            this._waitingPopup.hide();
            if (value[0] != undefined) {
                this._createDialog("e-SortFilterDlg", value[0].Value, "");
            }
            else if (value.d != undefined) {
                this._createDialog("e-SortFilterDlg", value.d[0].Value, "");
            }
            else {
                this._createDialog("e-SortFilterDlg", value.FetchSortState, "");
            }
        },

        _createDialog: function (args_className, args_innerHTML, editorTree) {
            var isSlicerAxis = false;
            ej.Pivot.openPreventPanel(this);
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && (args_className == "e-SortFilterDlg" || args_className == "mdx")) {
                var pivotButtons, measureCnt, dimCntRw, dimCntCol;
                pivotButtons = this.element.find(".e-splitBtn");
                measureCnt = jQuery.grep(pivotButtons, function (button) { return ($(button).attr("data-tag").split(":")[1] == "Measures"); }).length;
                dimCntRw = jQuery.grep(pivotButtons, function (button) { return (($(button).attr("data-tag").split(":")[1] != "Measures") && ($(button).attr("data-tag").split(":")[0] == "Rows")); }).length;
                dimCntCol = jQuery.grep(pivotButtons, function (button) { return (($(button).attr("data-tag").split(":")[1] != "Measures") && ($(button).attr("data-tag").split(":")[0] == "Columns")); }).length;
                if (args_className == "mdx" && measureCnt == 0 && dimCntCol == 0) {
                    ej.Pivot._createErrorDialog(this._getLocalizedLabels("MDXAlertMsg"), this._getLocalizedLabels("Warning"), this);
                    return false;
                }

                if (measureCnt > 0 && this.element.find(".e-categoricalAxis ")[0].childElementCount != 0) {
                    if ((!dimCntRw) && (document.activeElement.className.indexOf("e-rowSortFilterImg") > -1)) {
                        ej.Pivot._createErrorDialog(this._getLocalizedLabels("FilterSortRowAlertMsg"), this._getLocalizedLabels("Warning"), this);
                        return false;
                    }
                    else if ((!dimCntCol) && (document.activeElement.className.indexOf("e-colSortFilterImg") > -1)) {
                        ej.Pivot._createErrorDialog(this._getLocalizedLabels("FilterSortColumnAlertMsg"), this._getLocalizedLabels("Warning"), this);
                        return false;
                    }
                }
                else if (args_className != "mdx") {
                    if (!measureCnt && this._axis == "Column")
                        ej.Pivot._createErrorDialog(this._getLocalizedLabels("FilterSortcolMeasureAlertMsg"), this._getLocalizedLabels("Warning"), this);
                    else if (!measureCnt && this._axis == "Row")
                        ej.Pivot._createErrorDialog(this._getLocalizedLabels("FilterSortrowMeasureAlertMsg"), this._getLocalizedLabels("Warning"), this);
                    else if (!($(".e-categoricalAxis ")[0].childElementCount))
                        ej.Pivot._createErrorDialog(this._getLocalizedLabels("FilterSortElementAlertMsg"), this._getLocalizedLabels("Warning"), this);
                    return false;
                }
            }
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && !ej.isNullOrUndefined(this._selectedFieldName))
                isSlicerAxis = this.element.find(".e-pvtBtn").parent("[data-tag='Slicers:" + this._selectedFieldName.replace(/\[/g, "").replace(/\]/g, "") + "']").length > 0;
            var sortDlgField = "", sortState = "", filterState = "", levelInfo = [], editorTreeInfo;
            if (editorTree[0] != undefined)
                editorTreeInfo = editorTree[0].Value;
            else if (editorTree.d != undefined)
                editorTreeInfo = editorTree.d[0].Value;
            else
                editorTreeInfo = editorTree.EditorTreeInfo;
            var ejDialog = ej.buildTag("div#" + (this.model.enableAdvancedFilter ? "clientDialog" : (this._id + "_ClientDialog")) + ".e-clientDialog", { "opacity": "1" })[0].outerHTML;
            var dialogContent; var dialogTitle; var currentTag; var searchText; var editorNavPanel; var editorSearchNavPanel; var editorDrillNavPanel; var editorLinkPanel = '';

            if (args_className.split(" ")[0] == "e-newReportImg") {
                dialogTitle = this._getLocalizedLabels("NewReport");
                currentTag = "New Report";
                var newReportLabel = "<p class='e-dialogPara'>" + this._getLocalizedLabels("ReportName") + "</p>";
                var newReport = "<input type=text id=reportName class='reportName'/></br>";
                dialogContent = ej.buildTag("div#" + this._id + "_ReportDlg.e-reportDlg", "<table><tr><td>" + newReportLabel + "</td><td>" + newReport + "</td></tr></table>")[0].outerHTML;
            }
            else if (args_className.split(" ")[0] == "e-addReportImg") {
                dialogTitle = this._getLocalizedLabels("AddReport");
                currentTag = "Add Report";
                var addReportLabel = "<p class='e-dialogPara'>" + this._getLocalizedLabels("ReportName") + "</p>";
                var addReport = "<input type=text id=reportName class='reportName'/></br>";
                dialogContent = ej.buildTag("div#" + this._id + "_ReportDlg.e-reportDlg", "<table><tr><td>" + addReportLabel + "</td><td>" + addReport + "</td></tr></table>")[0].outerHTML;
            }
            else if (args_className.split(" ")[0] == "e-removeReportImg") {
                dialogTitle = this._getLocalizedLabels("RemoveReport");
                currentTag = "Remove Report";
                if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode || this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                    this.reportsCount = this._clientReportCollection.length;
                if (this.reportsCount > 1)
                    dialogContent = "<p>" + this._getLocalizedLabels("AreYouSureToDeleteTheReport") + "?</p>";
                else
                    dialogContent = "<p>" + this._getLocalizedLabels("CannotRemoveSingleReport") + "!</p>";
            }
            else if (args_className.split(" ")[0] == "e-SortFilterDlg") {

                sortDlgField = args_innerHTML.split("||");
                if (sortDlgField[1] != "")
                    sortState = sortDlgField[1].split("<<");
                if (sortDlgField[2] != "")
                    filterState = sortDlgField[2].split("<<");
                this.element.find(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog), .e-clientDialog").remove();
                dialogTitle = this._getLocalizedLabels("SortingAndFiltering");

                var sortingLbl = ej.buildTag("label#sortingLbl.e-sortingLbl", this._getLocalizedLabels("Sorting"))[0].outerHTML;
                var measureListLbl = ej.buildTag("label#measureListLbl.e-measureListLbl", this._getLocalizedLabels("Measure"))[0].outerHTML;
                var orderLbl = ej.buildTag("label#orderLbl.e-orderLbl", this._getLocalizedLabels("Order"))[0].outerHTML;
                var measureListDropDown = ej.buildTag("input#measuresList.e-measuresList", "", {}, { type: 'text', accesskey: 'M' })[0].outerHTML;

                var sortDisableRadio = ej.buildTag("input#sortDisable.e-sortDisable", "", {}, { name: "sort", type: "radio", checked: 'checked', tabindex: 0, accesskey: 'i' })[0].outerHTML + ej.buildTag("label.e-sortDisableLbl", this._getLocalizedLabels("Disable"))[0].outerHTML;
                var sortEnableRadio = ej.buildTag("input#sortEnable.e-sortEnable", "", {}, { name: 'sort', type: 'radio', tabindex: 1, accesskey: 'n' })[0].outerHTML + ej.buildTag("label.e-sortEnableLbl", this._getLocalizedLabels("Enable"))[0].outerHTML + "<br/>";
                var newascRadio = ej.buildTag("input#radioBtnAsc.e-radioBtnAsc", "", {}, { name: 'order', type: 'radio', checked: 'checked', tabindex: 0, accesskey: 'A' })[0].outerHTML + ej.buildTag("label.e-radioBtnAscLbl", this._getLocalizedLabels("Ascending"))[0].outerHTML + "<br/>";
                var newdescRadio = ej.buildTag("input#radioBtnDesc.e-radioBtnDesc", "", {}, { name: 'order', type: 'radio', tabindex: 2, accesskey: 'e' })[0].outerHTML + ej.buildTag("label.e-radioBtnDescLbl", this._getLocalizedLabels("Descending"))[0].outerHTML;
                var preservHierarchy = ej.buildTag("input#preserveHrchy.e-preserveHrchy", "", {}, { type: 'checkbox', checked: 'checked', tabindex: 0, accesskey: 'r' })[0].outerHTML + ej.buildTag("label.e-preserveHrchyLbl", this._getLocalizedLabels("PreserveHierarchy"))[0].outerHTML;

                var filter = ej.buildTag("label#filterLbl.e-filterLbl", this._getLocalizedLabels("Filtering"))[0].outerHTML;
                var filterDisableRadio = ej.buildTag("input#filterDisable.e-filterDisable", "", {}, { name: 'filter', type: 'radio', checked: 'checked', tabindex: 0, accesskey: 'i' })[0].outerHTML + ej.buildTag("label.e-filterDisableLbl", this._getLocalizedLabels("Disable"))[0].outerHTML;
                var filterEnableRadio = ej.buildTag("input#filterEnable.e-filterEnable", "", {}, { name: 'filter', type: 'radio', tabindex: 0, accesskey: 'n' })[0].outerHTML + ej.buildTag("label.e-filterDisableLbl", this._getLocalizedLabels("Enable"))[0].outerHTML + "<br/>";
                var conditionLbl = ej.buildTag("label#conditionLbl.e-conditionLbl", this._getLocalizedLabels("Condition"))[0].outerHTML;
                var conditionDropDown = ej.buildTag("input#filterCondition.e-filterCondition", "", {}, { type: 'text', tabindex: 0, accesskey: 'o' })[0].outerHTML;

                var filterFrom = ej.buildTag("div#filterfrom.e-filterFrmDiv", ej.buildTag("input#filterFrom.filterFrom" + (ej.isMobile() ? " inputConditionMbl" : ""), "", {}, { name: 'inputVal', type: ej.isMobile() ? 'number' : 'text', inputmode: ej.isMobile() ? 'numeric' : '', pattern: ej.isMobile() ? '[0-9]*' : '', tabindex: 0 })[0].outerHTML)[0].outerHTML;
                var filterbtw = ej.buildTag("div#filterbtw.e-filterBtw", "<p>" + this._getLocalizedLabels("and") + "</p>")[0].outerHTML;
                var filterTo = ej.buildTag("div#filterto.e-filterToDiv", ej.buildTag("input#filterTo.filterTo" + (ej.isMobile() ? " inputConditionMbl" : ""), "", {}, { name: 'inputVal', type: ej.isMobile() ? 'number' : 'text', inputmode: ej.isMobile() ? 'numeric' : '', pattern: ej.isMobile() ? '[0-9]*' : '', tabindex: 0, accesskey: 'd' })[0].outerHTML)[0].outerHTML;
                var fMeasureListLbl = ej.buildTag("label#filterMeasureListLbl.filterMeasureListLbl", this._getLocalizedLabels("Measure"))[0].outerHTML;
                var fMeasureList = ej.buildTag("input#fMeasuresList.fMeasuresList", "", {}, { type: 'text', tabindex: 0, accesskey: 'M' })[0].outerHTML;
                var fValueLbl = ej.buildTag("label#filterValueLbl.e-filterValueLbl", this._getLocalizedLabels("Value"), {}, { tabindex: 0, accesskey: 'a' })[0].outerHTML;

                var sortDiv = ej.buildTag("div#sortingDlg.e-sortingDlg", "<table class='e-sortReportTbl'><tr><td style='vertical-align:top;'>" + sortingLbl + "</td><td>" + sortEnableRadio + sortDisableRadio + "</td></tr><tr><td>" + measureListLbl + "</td><td>" + measureListDropDown + "</td></tr> <tr><td>" + orderLbl + "</td><td>" + newascRadio + newdescRadio + "</td></tr><tr><td></td><td>" + preservHierarchy + "</td></tr></table>")[0].outerHTML;
                var filterDiv = ej.buildTag("div#filteringDlg.e-filteringDlg", "<table class='e-sortReportTbl'><tr><td>" + filter + "</td><td>" + filterEnableRadio + filterDisableRadio + "</td></tr><tr><td>" + fMeasureListLbl + "</td><td>" + fMeasureList + "</td></tr><tr><td>" + conditionLbl + "</td><td>" + conditionDropDown + "</td></tr><tr><td>" + fValueLbl + "</td><td>" + filterFrom + filterbtw + filterTo + "</td></tr></table>")[0].outerHTML;

                var sortTab = "<li><a style='font: bold 12px Segoe UI' href='#sortingDlg'>" + this._getLocalizedLabels("Sorting") + "</a></li>";
                var filterTab = "<li><a style='font: bold 12px Segoe UI' href='#filteringDlg'>" + this._getLocalizedLabels("Filtering") + "</a></li>";
                var sortfilterTab = ej.buildTag("div#sortfilterTab.sortfilterTab", "<ul class ='e-sortfiltTab'>" + (sortTab + filterTab + "</ul>" + sortDiv + filterDiv))[0].outerHTML;

                dialogContent = sortfilterTab;
            }
            else if (args_className.split(" ")[0] == "e-renameReportImg") {
                dialogTitle = this._getLocalizedLabels("RenameReport");
                currentTag = "Rename Report";
                var currentReportName = !ej.isNullOrUndefined(this._currentReportName) ? this._currentReportName : this.element.find(".reportlist").val();
                var renameReportLabel = "<p class='e-dialogPara'>" + this._getLocalizedLabels("ReportName") + "</p>";
                var renameReport = "<input type=text id=reportName class='reportName' value='" + currentReportName + "' /></br>";
                dialogContent = ej.buildTag("div#" + this._id + "_ReportDlg.e-reportDlg", "<table><tr><td>" + renameReportLabel + "</td><td>" + renameReport + "</td></tr></table>")[0].outerHTML;
            }
            else if (args_className.split(" ")[0] == "e-saveAsReportImg" || args_className.split(" ")[0] == "e-saveReportImg") {
                dialogTitle = args_className.split(" ")[0] == "e-saveAsReportImg" ? this._getLocalizedLabels("SaveAs") : this._getLocalizedLabels("Save");
                currentTag = "SaveAs Report";
                var recordNameLabel = "<p class='e-dialogPara'>" + this._getLocalizedLabels("ReportName") + "</p>";
                var recordName = "<input type=text id=reportName class='reportName'/></br>";
                dialogContent = ej.buildTag("div#" + this._id + "_ReportDlg.e-reportDlg", "<table><tr><td>" + recordNameLabel + "</td><td>" + recordName + "</td></tr></table>")[0].outerHTML;
            }
            else if (args_className.split(" ")[0] == "LoadReport") {
                dialogTitle = this._getLocalizedLabels("Load");
                currentTag = "Load Report";
                var recordNameLabel = "<table class='e-loadReportTbl'><tr><td class='e-loadReportTd'>" + this._getLocalizedLabels("ReportName") + "</td>";
                var recordNamesDropdown = "<td><input type='text' id='reportNameList' class='reportNameList'/></td></tr></table>";
                dialogContent = recordNameLabel + recordNamesDropdown;
            }
            else if (args_className.split(" ")[0] == "RemoveDBReport") {
                dialogTitle = this._getLocalizedLabels("Remove");
                currentTag = "RemoveDB Report";
                var recordNameLabel = "<table class='e-removeDBReportTbl'><tr><td class='e-removeDBReportTd'>" + this._getLocalizedLabels("ReportName") + "</td>";
                var recordNamesDropdown = "<td><input type='text' id='reportNameList' class='reportNameList'/></td></tr></table>";
                dialogContent = recordNameLabel + recordNamesDropdown;
            }
            else if (args_className.split(" ")[0] == "RenameDBReport") {
                dialogTitle = this._getLocalizedLabels("Rename");
                currentTag = "RenameDB Report";
                var recordNameLabel = "<table class='e-renameDBReportTbl'><tr><td class='e-renameDBReportTd'>" + this._getLocalizedLabels("SelectReport") + "</td>";
                var recordNamesDropdown = "<td><input type='text' id='reportNameList' class='reportNameList'/></td></tr>";
                var renameLabel = "<tr><td class='e-renameDBReportTd'>" + this._getLocalizedLabels("RenameReport") + "</td>";
                var renameRecordTxtBox = "<td><input type='text' id='renameReport' class='renameReport' style='width:146px'/></td></tr></table>";
                dialogContent = recordNameLabel + recordNamesDropdown + renameLabel + renameRecordTxtBox;
            }
            else if (args_className.split(" ")[0] == "mdx") {
                dialogTitle = this._getLocalizedLabels("MDXQuery");
                currentTag = "MDX Query";
                var textarea = "<textarea readonly='readonly' style='width:460px; height:180px; resize:none; margin:3px'>" + args_innerHTML + "</textarea>";
                dialogContent = textarea;
            }
            else if (args_className.split(" ")[0] == "e-chartTypesImg") {
                dialogTitle = this._getLocalizedLabels("ChartTypes");
                currentTag = "Chart Types";
                var reportNameLabel = "<p class='e-dialogPara'>" + this._getLocalizedLabels("ChartTypes") + "</p>";
                reportName = "<input type=text id=reportName class='reportName'/></br>";
                dialogContent = reportNameLabel + reportName;
            }
            else if (args_className.indexOf("e-txt") > -1) {

                if (args_innerHTML == this._getLocalizedLabels("Measures")) {
                    dialogTitle = this._getLocalizedLabels("MeasureEditor");
                    dialogContent = "<p class='e-editorPara'>" + this._getLocalizedLabels("Measures") + "</p>"
                }
                else {
                    this._isOptionSearch = false; this._isEditorDrillPaging = false; this._currentFilterList = {}; this._editorSearchTreeData = []; this._editorDrillTreeData = {}; this._editorDrillTreePageSettings = {}, this._lastSavedTree = [];
                    dialogTitle = this._getLocalizedLabels("MemberEditor");
                    dialogContent = (this._hierarchyCaption != this._getLocalizedLabels("KPIs") && this.model.enableAdvancedFilter && !isSlicerAxis ? "" : "<p class='e-editorPara'>" + this._hierarchyCaption + "</p>");
                }
                var memberSearchEditor = ""; var memberEditor; var checkOption = "";
                $(innerDiv).appendTo(EditorDiv);
                if (args_innerHTML != this._getLocalizedLabels("Measures")) {
                    var checkAll = ej.buildTag("div.e-checkAll e-icon").attr("role", "button").attr("aria-label", "checkall")[0].outerHTML;
                    var unCheckAll = ej.buildTag("div.e-unCheckAll e-icon").attr("role", "button").attr("aria-label", "uncheckall")[0].outerHTML;
                    checkOption = ej.buildTag("div.e-checkOptions", checkAll + unCheckAll, { "height": "19px", margin: "10px 0px 0px 31px" })[0].outerHTML;
                    memberSearchEditor = ej.buildTag("div.e-memberSearchEditorDiv", ej.buildTag("input#searchEditorTreeView.searchEditorTreeView").attr("type", "text")[0].outerHTML + (!ej.isNullOrUndefined(editorTreeInfo) && args_innerHTML != this._getLocalizedLabels("Measures") && this.model.enableMemberEditorPaging && $.parseJSON(editorTreeInfo).length >= this.model.memberEditorPageSize ? ej.buildTag("span.e-icon e-searchEditorTree", {})[0].outerHTML : ""), { "padding": (this.model.enableAdvancedFilter ? "5px 0px 0px 0px" : 0) })[0].outerHTML;
                }
                if (args_innerHTML == this._getLocalizedLabels("Measures")) {
                    this._isMembersFiltered = false;
                    memberEditor = this._createMeasureEditor(editorTree);
                }
                else
                    memberEditor = ej.buildTag("div#editorTreeView.e-editorTreeView")[0].outerHTML;
                var memberEditorDiv = ej.buildTag("div.e-memberEditorDiv", (this._selectedFieldName != "" || args_innerHTML == this._getLocalizedLabels("KPIs") ? checkOption : "") + memberEditor)[0].outerHTML;
                var labelFilterTag = "", levelList = "";

                if (this._selectedFieldName != "" && !isSlicerAxis && this.model.enableAdvancedFilter) {
                    levelList = ej.buildTag("div.e-ddlGroupWrap", this._getLocalizedLabels("SelectField") + ":" + ej.buildTag("input#GroupLabelDrop.groupLabelDrop").attr("type", "text")[0].outerHTML, {})[0].outerHTML;
                    labelFilterTag = ej.buildTag("div.e-filterElementTag")[0].outerHTML;
                    var filterTag = ej.Pivot.createAdvanceFilterTag({ action: "filterTag" }, this)
                    levelInfo = $.map(this.element.find(".e-treeview li[data-tag='" + this._selectedFieldName + "'] li"), function (item, index) { return { text: $(item).text(), value: $(item).attr("data-tag") }; });
                }
                else
                    delete this._selectedLevelUniqueName;
                var innerDiv = ej.buildTag("div", (labelFilterTag != "" && !isSlicerAxis && this.model.enableAdvancedFilter ? (levelList + ej.buildTag("div.e-seperator", {}, { "padding": "2px" }, cancelBtn)[0].outerHTML + labelFilterTag + ej.buildTag("div.e-seperator", {}, { "padding": "2px" })[0].outerHTML) : "") + memberSearchEditor + memberEditorDiv)[0].outerHTML;
                var EditorDiv = ej.buildTag("div#EditorDiv.e-editorDiv", innerDiv, { "margin-left": this.model.enableAdvancedFilter ? "5px" : "0px" })[0].outerHTML;
                dialogContent += EditorDiv;
                editorNavPanel = ej.buildTag("div.e-memberPager", ej.buildTag("div#NextpageDiv.e-nextPageDiv", ej.buildTag("div.e-icon e-media-backward_01 e-firstPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-left e-prevPage", {})[0].outerHTML + ej.buildTag("input.e-memberCurrentPage#memberCurrentPage", {}, { "width": "20px", "height": "10px" })[0].outerHTML + ej.buildTag("span.e-memberPageCount#memberPageCount")[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-right e-nextPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-media-forward_01 e-lastPage", {})[0].outerHTML)[0].outerHTML, {})[0].outerHTML;
                editorSearchNavPanel = ej.buildTag("div.e-memberSearchPager", ej.buildTag("div#NextSearchpageDiv.e-nextPageDiv", ej.buildTag("div.e-icon e-media-backward_01 e-firstPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-left e-prevPage", {})[0].outerHTML + ej.buildTag("input.e-memberCurrentSearchPage#memberCurrentSearchPage", {}, { "width": "20px", "height": "10px" })[0].outerHTML + ej.buildTag("span.e-memberSearchPageCount#memberSearchPageCount")[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-right e-nextPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-media-forward_01 e-lastPage", {})[0].outerHTML)[0].outerHTML, {}).css("display", "none")[0].outerHTML;
                editorDrillNavPanel = ej.buildTag("div.e-memberDrillPager", ej.buildTag("div#NextDrillpageDiv.e-nextPageDiv", ej.buildTag("div.e-icon e-media-backward_01 e-firstPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-left e-prevPage", {})[0].outerHTML + ej.buildTag("input.e-memberCurrentDrillPage#memberCurrentDrillPage", {}, { "width": "20px", "height": "10px" })[0].outerHTML + ej.buildTag("span.e-memberDrillPageCount#memberDrillPageCount")[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-right e-nextPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-media-forward_01 e-lastPage", {})[0].outerHTML)[0].outerHTML, {}).css("display", "none")[0].outerHTML;
                editorLinkPanel = ej.buildTag("div.e-linkOuterPanel", ej.buildTag("span.e-infoImg e-icon", "", {}).css({ "float": "left", "margin-top": "4px", "font-size": "16px" })[0].outerHTML + ej.buildTag("a.e-linkPanel", this._getLocalizedLabels('NotAllItemsShowing')).css({ "display": "inline-block", "margin-left": "3px", "margin-top": "4px" })[0].outerHTML, {}).css({ "display": "none", "margin-left": "3px", "margin-left": isAdvancedFilter ? "6px" : "0px" })[0].outerHTML;
            }
            var dialogFooter;
            if (args_className.split(" ")[0] == "mdx") {
                var cancelBtn = "<button id=CancelBtn class='e-dialogCancelBtn' title=" + this._getLocalizedLabels("OK").replace(/(<([^>]+)>)/ig, "") + " >" + this._getLocalizedLabels("OK") + "</button>";
                dialogFooter = ej.buildTag("div.e-dialogFooter", cancelBtn)[0].outerHTML;
                $(ejDialog).appendTo("#" + this._id);
                $(dialogContent + dialogFooter).appendTo(this.element.find(".e-clientDialog"));
                this.element.find(".e-clientDialog").ejDialog({ enableRTL: this.model.enableRTL, width: 500, target: "#" + this._id, enableResize: false, close: ej.proxy(ej.Pivot.closePreventPanel, this) });
            }
            else {
                var okBtn = "<button id=OKBtn class='e-dialogOKBtn' title=" + (args_className.split(" ")[0] == "RemoveDBReport" ? this._getLocalizedLabels("Remove") : this._getLocalizedLabels("OK").replace(/(<([^>]+)>)/ig, "")) + ">" + (args_className.split(" ")[0] == "RemoveDBReport" ? this._getLocalizedLabels("Remove") : this._getLocalizedLabels("OK")) + "</button>";
                var cancelBtn = "<button id=CancelBtn class='e-dialogCancelBtn' title=" + this._getLocalizedLabels("Cancel").replace(/(<([^>]+)>)/ig, "") + ">" + this._getLocalizedLabels("Cancel") + "</button>";
                dialogFooter = ej.buildTag("div.e-dialogFooter", okBtn + ((args_className.split(" ")[0] == "e-removeReportImg" && this.reportsCount == 1) ? "" : cancelBtn))[0].outerHTML;
                $(ejDialog).appendTo("#" + this._id);
                $(dialogContent + (!ej.isNullOrUndefined(editorTreeInfo) && args_innerHTML != this._getLocalizedLabels("Measures") && this.model.enableMemberEditorPaging ? ($.parseJSON(editorTreeInfo).length >= this.model.memberEditorPageSize ? editorDrillNavPanel + editorSearchNavPanel + editorNavPanel : editorDrillNavPanel + editorSearchNavPanel) : editorLinkPanel) + dialogFooter).appendTo(this.element.find(".e-clientDialog"));
                if (args_className.split(" ")[0] == "e-SortFilterDlg")
                    this.element.find(".e-clientDialog").ejDialog({ enableRTL: this.model.enableRTL, width: 'auto', target: "#" + this._id, cssClass: "e-SortFilterDlg", enableResize: false, close: ej.proxy(ej.Pivot.closePreventPanel, this) });
                else
                    this.element.find(".e-clientDialog").ejDialog({ enableRTL: this.model.enableRTL, width: 'auto', target: "#" + this._id, enableResize: false, close: ej.proxy(ej.Pivot.closePreventPanel, this) });
                if (args_className.split(" ")[0] == "e-removeReportImg") {
                    this.element.find(".e-clientDialog").css("min-height", "60px");
                    this.element.find("#" + this._id + "_ClientDialog_wrapper").css("min-height", "100px");
                }
            }

            this.element.find(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog) .e-titlebar").prepend(ej.buildTag("div", dialogTitle, { "display": "inline" })[0].outerHTML)[0].setAttribute("data-tag", currentTag);
            this.element.find(".reportName, .renameReport").ejMaskEdit({ width: "149px", textAlign: this.model.enableRTL ? "right" : "left" });
            this.element.find(".e-reportDlg .e-mask").css("padding-left", "6px");
            this.element.find(".e-memberSearchEditorDiv .e-mask").addClass("e-dialogInput");
            this.element.find(".e-prevPage, .e-firstPage").addClass("e-pageDisabled");
            this.element.find(".e-nextPage, .e-lastPage").addClass("e-pageEnabled");
            this.element.find(".e-dialogOKBtn, .e-dialogCancelBtn").ejButton({ type: ej.ButtonType.Button });
            $(".sortfilterTab").ejTab({ enableRTL: this.model.enableRTL });
            $(".reportNameList").ejDropDownList({
                dataSource: args_innerHTML.split("__"),
                enableRTL: this.model.enableRTL,
                width: "150px",
                height: "20px",
                create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
            });
            if (args_className.indexOf("e-txt") > -1) {
                this.element.find("#searchEditorTreeView").ejMaskEdit({
                    name: "inputbox",
                    width: "100%",
                    inputMode: ej.InputMode.Text,
                    watermarkText: this._getLocalizedLabels("Search") + " " + this._hierarchyCaption,
                    maskFormat: "",
                    textAlign: this.model.enableRTL ? "right" : "left",
                    change: ej.proxy(function (args) { ej.Pivot._searchEditorTreeNodes(args, this); }, this)
                });
            }
            this.element.find(".e-filterElementTag").ejMenu({
                fields: { dataSource: filterTag, id: "id", parentId: "parentId", text: "text", spriteCssClass: "spriteCssClass" },
                menuType: ej.MenuType.NormalMenu,
                width: "100%",
                height: "25px",
                enableRTL: this.model.enableRTL,
                orientation: ej.Orientation.Vertical,
                click: ej.proxy(this._filterElementClick, this)
            });
            this.element.find(".groupLabelDrop").ejDropDownList({
                width: "100%",
                height: "25px",
                enableRTL: this.model.enableRTL,
                dataSource: levelInfo,
                fields: { id: "id", text: "text", value: "value" },
                selectedIndices: [0],
                change: ej.proxy(this._groupLabelChange, this),
                create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
            });
            $(".filterFrom,.filterTo").ejMaskEdit({ width: "80px", height: "20px", textAlign: this.model.enableRTL ? "right" : "left" });
            $(".e-measuresList").ejDropDownList({
                dataSource: args_innerHTML.split("||")[0].split("__"),
                enableRTL: this.model.enableRTL,
                width: "80%",
                height: "20px",
                create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
            });
            $(".fMeasuresList").ejDropDownList({
                dataSource: args_innerHTML.split("||")[0].split("__"),
                width: "80%",
                enableRTL: this.model.enableRTL,
                height: "20px",
                create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
            });
            $(".e-filterCondition").ejDropDownList({
                change: "_onActiveConditionChange",
                enableRTL: this.model.enableRTL,
                dataSource: [{ option: "EqualTo", value: this._getLocalizedLabels("EqualTo") },
                             { option: "NotEquals", value: this._getLocalizedLabels("NotEquals") },
                             { option: "GreaterThan", value: this._getLocalizedLabels("GreaterThan") },
                             { option: "GreaterThanOrEqualTo", value: this._getLocalizedLabels("GreaterThanOrEqualTo") },
                             { option: "LessThan", value: this._getLocalizedLabels("LessThan") },
                             { option: "LessThanOrEqualTo", value: this._getLocalizedLabels("LessThanOrEqualTo") },
                             { option: "Between", value: this._getLocalizedLabels("Between") },
                             { option: "NotBetween", value: this._getLocalizedLabels("NotBetween") },
                ],
                fields: { text: "value", value: "option" },
                width: "80%",
                height: "20px",
                create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
            });
            this.element.find(".e-filterCondition").ejDropDownList("option", "change", ej.proxy(this._onActiveConditionChange, this));
            this._dllSortMeasure = $(".e-measuresList").data("ejDropDownList");
            this._dllFilterCondition = $(".e-filterCondition").data("ejDropDownList");
            this._dllfMeasuresList = $(".fMeasuresList").data("ejDropDownList");
            if (sortState != "") {
                this.element.find(".e-radioBtnAsc")[0].checked = sortState[0] == "ASC" ? true : false;
                this.element.find(".e-radioBtnDesc")[0].checked = sortState[0] == "DESC" ? true : false;
                this.element.find(".e-sortDisable")[0].checked = !(this.element.find(".e-sortEnable")[0].checked = true);
                this.element.find(".e-preserveHrchy")[0].checked = sortState[1] == "PH" ? true : false;
                this._isSorted = true;
                this._dllSortMeasure.setModel({ value: (sortState[2]) });
            }
            if (filterState != "") {
                this.element.find(".e-filterEnable")[0].checked = true;
                this._dllfMeasuresList.setModel({ value: (filterState[0]) });
                this._dllFilterCondition.setModel({ value: (filterState[1]) });
                this.element.find(".filterFrom").val(filterState[2]);
                if (filterState[3] != undefined && filterState[3] != "" && (filterState[1] == "Between" || filterState[1] == "NotBetween"))
                    this.element.find(".filterTo").val(filterState[3]);
                else
                    $(".filterTo").attr("disabled", "disabled");
                this._isFiltered = true;
            }
            if (this.element.find(".e-sortDisable")[0] != undefined && this.element.find(".e-sortDisable")[0].checked == true) {
                $('.measuresList_wrapper,.e-radioBtnAsc, .e-radioBtnDesc, .e-preserveHrchy').attr("disabled", "disabled");
                $('.e-measureListLbl, .e-orderLbl, .e-radioBtnAscLbl, .e-radioBtnDescLbl, .e-preserveHrchyLbl').addClass('e-sortFilterDisable');
                this._dllSortMeasure.disable();
            }
            if (this.element.find(".e-filterDisable")[0] != undefined && this.element.find(".e-filterDisable")[0].checked == true) {
                $('.filterFrom, .filterTo').attr("disabled", "disabled");
                $('.filterMeasureListLbl, .e-conditionLbl, .e-filterValueLbl, .e-filterBtw').addClass('e-sortFilterDisable');
                this._dllFilterCondition.disable();
                this._dllfMeasuresList.disable();
            }
            this.element.find(".e-widget-content").height("auto");
            var isAdvancedFilter = false;
            if (this._excelFilterInfo.length > 0) {
                var cubeName = this.element.find('.cubeSelector').length > 0 ? this.element.find('.cubeSelector').data("ejDropDownList").model.value : "", reportName = this.element.find('#reportList').data("ejDropDownList").model.value, levelName = this._selectedLevelUniqueName, hierarchyName = this._selectedFieldName;

                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    $.map(this._excelFilterInfo, function (item, index) {
                        if (item.cubeName == cubeName && item.report == reportName && (item.hierarchyUniqueName == hierarchyName || item.levelUniqueName == levelName))
                            isAdvancedFilter = true;
                    });
                }
                else {
                    $.map(this._excelFilterInfo, function (item, index) {
                        if (item.report == reportName && (item.hierarchyUniqueName == hierarchyName || item.levelUniqueName == levelName))
                            isAdvancedFilter = true;
                    });
                }
            }
            if (editorTree != "" && editorTree != undefined && args_innerHTML != this._getLocalizedLabels("Measures")) {
                var treeViewData = null;
                if (!isAdvancedFilter && this._currentReportItems.length != 0) {
                    for (var i = 0; i < this._currentReportItems.length; i++) {
                        if (this._currentReportItems[i] == this._currentItem) {
                            treeViewData = JSON.parse(JSON.stringify(this._treeViewData[this._currentItem]));
                            break;
                        }
                    }
                }
                if (treeViewData == null || !isAdvancedFilter)
                    treeViewData = $.parseJSON(editorTreeInfo);
                this._editorTreeData = $.parseJSON(editorTreeInfo);
                if (this.model.enableMemberEditorPaging && args_innerHTML != this._getLocalizedLabels("Measures") && this.element.find(".e-nextPageDiv").length > 0) {
                    var memberCount = this._editorTreeData.length;
                    var pageCount = (memberCount / this.model.memberEditorPageSize);
                    if (pageCount != Math.round(pageCount))
                        pageCount = parseInt(pageCount) + 1;
                    if (this._memberPageSettings.currentMemeberPage == pageCount)
                        this.element.find(".e-nextPage, .e-lastPage").addClass("disabled");
                    this.element.find(".e-memberPageCount").html("/ " + pageCount);
                    this.element.find(".e-memberCurrentPage").val(this._memberPageSettings.currentMemeberPage);
                    this._memberPageSettings.currentMemeberPage > 1 ? this.element.find(".e-prevPage, .e-firstPage").removeClass("e-pageDisabled").addClass("e-pageEnabled") : this.element.find(".e-prevPage, .e-firstPage").removeClass("e-pageEnabled").addClass("e-pageDisabled");
                    this._memberPageSettings.currentMemeberPage == parseInt($.trim(this.element.find(".e-memberPageCount").text().split("/")[1])) ? this.element.find(".e-nextPage, .e-lastPage").removeClass("e-pageEnabled").addClass("e-pageDisabled") : this.element.find(".e-nextPage, .e-lastPage").removeClass("e-pageDisabled").addClass("e-pageEnabled");
                }
                this._appendTreeViewData(this.model.enableMemberEditorPaging && this.element.find(".e-nextPageDiv").length > 0 ? ej.DataManager(this._editorTreeData).executeLocal(ej.Query().where("pid", "equal", null || undefined).page(this._memberPageSettings.currentMemeberPage, this.model.memberEditorPageSize)) : treeViewData, isSlicerAxis);
                if (!this.model.enableAdvancedFilter)
                    this.element.find(".e-memberEditorDiv").css({ "height": "286px" });
                if (this.model.enableAdvancedFilter) {
                    this.element.find("#clientDialog_wrapper").addClass("e-advancedFilterDlg");
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                        this.element.find("#clientDialog_wrapper").addClass("e-advanceFltrElement");
                }
            }
            if (this.model.enableMemberEditorSorting) {
                this._sortType = "";
                ej.Pivot._separateAllMember(this);
            }
            this.element.find("#" + this._id + "_ClientDialog_closebutton").attr("title", this._getLocalizedLabels("Close"))
            this._unWireEvents();
            this._wireEvents();
            this._isTimeOut = false;
            this._waitingPopup.hide();

        },

        _appendTreeViewData: function (treeViewData, isSlicerAxis) {
            if (!this._isSearchApplied && this._editorSearchTreeData.length == 0 && treeViewData.length > 0)
                this._lastSavedTree = treeViewData;
            this.element.find(".e-editorTreeView").ejTreeView({
                showCheckbox: true,
                loadOnDemand: true,
                enableRTL: this.model.enableRTL,
                height: this.model.enableMemberEditorSorting ? "235px": "initial", 
                nodeUncheck: function (e, args) {
                    if (!ej.isNullOrUndefined(e.event) && e.event != "") {
                        var pivotClientObj = $(this.element).parents(".e-pivotclient").data("ejPivotClient");
                        var treeElement = $(e.currentElement).parents(".e-treeview");
                        pivotClientObj._isMembersFiltered = true;
                        if ($(e.currentElement).attr("id") == "SearchFilterSelection") {
                            var searchElement = $(treeElement).find("li:not([data-isItemSearch='true'])");
                            pivotClientObj._isSelectSearchFilter = false;
                            if (pivotClientObj._isOptionSearch) {
                                if (searchElement.length > 0) {
                                    $(searchElement).each(function (index, item) {
                                        if ($(item).attr("id") != "SearchFilterSelection") $(treeElement).ejTreeView("uncheckNode", $(item));
                                    });
                                }
                            }
                            else if (searchElement.length > 0) {
                                $(pivotClientObj._editorTreeData).each(function (index, item) {
                                    for (var i = 0; i < searchElement.length; i++) {
                                        if (searchElement[i].id != item.id) {
                                            item.checkedStatus = false;
                                        }
                                        else {
                                            item.checkedStatus = $(searchElement[i]).find('.checked').length > 0 ? true : false;
                                            break;
                                        }
                                    }
                                });
                            }
                        }
                        if (($(treeElement).find(".e-checkbox:checked").length == 0 && !pivotClientObj.model.enableMemberEditorPaging))
                            pivotClientObj.element.find(".e-dialogOKBtn").data("ejButton").disable();
                        if (pivotClientObj.model.operationalMode != ej.Pivot.OperationalMode.ClientMode) {
                            ej.Pivot._memberPageNodeUncheck(e, pivotClientObj);
                            var isAllFiltered = true;
                            $(pivotClientObj._editorTreeData).each(function (index, item) {
                                if (item.checkedStatus) { isAllFiltered = false; return false; }
                            });
                            if (isAllFiltered && pivotClientObj._editorTreeData.length > 0) {
                                pivotClientObj.element.find(".e-dialogOKBtn").data("ejButton").disable();
                                pivotClientObj.element.find(".e-dialogOKBtn").removeAttr("disabled");
                            }
                            else {
                                pivotClientObj.element.find(".e-dialogOKBtn").data("ejButton").enable();
                                pivotClientObj.element.find(".e-dialogOKBtn").removeAttr("disabled");
                            }
                        }
                    }
                },
                nodeCheck: function (e) {
                    if (!ej.isNullOrUndefined(e.event) && e.event != "") {
                        var pivotClientObj = $(this.element).parents(".e-pivotclient").data("ejPivotClient");
                        var treeElement = $(e.currentElement).parents(".e-treeview");
                        pivotClientObj._isMembersFiltered = true;
                        if (pivotClientObj.element.find(".e-editorPara").text() == pivotClientObj._getLocalizedLabels("KPIs")) {
                            var isChecked = true, element = pivotClientObj.element.find(".e-editorTreeView ul:eq(0)");
                            for (var i = 0; i < element.children("li").length; i++) {
                                if (element.children("li:eq(" + i + ")").find(".e-check-small").attr("aria-checked") == "false") {
                                    isChecked = false;
                                    break;
                                }
                            }
                            if (isChecked) {
                                pivotClientObj.element.find(".e-dialogOKBtn").data("ejButton").enable();
                                pivotClientObj.element.find(".e-dialogOKBtn").removeAttr("disabled");
                            }
                            else {
                                pivotClientObj.element.find(".e-dialogOKBtn").data("ejButton").disable();
                                pivotClientObj.element.find(".e-dialogOKBtn").attr('disabled', 'disabled');
                            }
                        }
                        if ($(e.currentElement).attr("id") == "SearchFilterSelection") {
                            pivotClientObj._isSelectSearchFilter = true;
                            var searchElement = $(treeElement).find("li:not([data-isItemSearch='true'])");
                            if (pivotClientObj._isOptionSearch) {
                                if (searchElement.length > 0) {
                                    $(searchElement).each(function (index, item) {
                                        if ($(item).attr("id") != "SearchFilterSelection")
                                            if (!ej.isNullOrUndefined(pivotClientObj._currentFilterList[$(item).attr("id")]) && pivotClientObj._currentFilterList[$(item).attr("id")].checkedStatus)
                                                $(treeElement).ejTreeView("checkNode", $(item));
                                    });
                                }
                            }
                            else if (searchElement.length > 0) {
                                $(pivotClientObj._editorTreeData).each(function (index, item) {
                                    for (var i = 0; i < searchElement.length; i++) {
                                        if (searchElement[i].id != item.id) {
                                            if (!ej.isNullOrUndefined(pivotClientObj._currentFilterList)) item.checkedStatus = pivotClientObj._currentFilterList[$(item).attr("id")].checkedStatus;
                                        }
                                        else {
                                            item.checkedStatus = $(searchElement[i]).find('.checked').length > 0 ? true : false;
                                            break;
                                        }
                                    }
                                });
                            }
                        }
                        if (pivotClientObj.model.enableMemberEditorPaging && pivotClientObj._editorTreeData.length > 0)
                            $(pivotClientObj._editorTreeData).each(function (index, item) {
                                if (item.checkedStatus) {
                                    pivotClientObj.element.find(".e-dialogOKBtn").data("ejButton").enable();
                                    pivotClientObj.element.find(".e-dialogOKBtn").removeAttr("disabled");
                                    return false;
                                }
                            });
                        else {
                            pivotClientObj.element.find(".e-dialogOKBtn").data("ejButton").enable();
                            pivotClientObj.element.find(".e-dialogOKBtn").removeAttr("disabled");
                        }
                        if (pivotClientObj.model.operationalMode != ej.Pivot.OperationalMode.ClientMode) {
                            ej.Pivot._memberPageNodeCheck(e, pivotClientObj);
                            var isAllFiltered = true;
                            $(pivotClientObj._editorTreeData).each(function (index, item) {
                                if (item.checkedStatus) { isAllFiltered = false; return false; }
                            });
                            if (isAllFiltered && pivotClientObj._editorTreeData.length > 0) {
                                pivotClientObj.element.find(".e-dialogOKBtn").data("ejButton").disable();
                                pivotClientObj.element.find(".e-dialogOKBtn").removeAttr("disabled");
                            }
                            else {
                                pivotClientObj.element.find(".e-dialogOKBtn").data("ejButton").enable();
                                pivotClientObj.element.find(".e-dialogOKBtn").removeAttr("disabled");
                            }
                        }
                    }
                },
                beforeDelete: function (args) {
                    if (!ej.isNullOrUndefined(args.event))
                        if (args.event.type == "keydown" && args.event.originalEvent.key.toLowerCase() == "delete") return false;
                },
                cssClass: 'pivotTreeViewDragedNode',
                height: $(".e-memberEditorDiv").height(),
                fields: { id: "id", hasChild: "hasChildren", parentId: "pid", text: "name", isChecked: "checkedStatus", expanded: "expanded", dataSource: ej.Pivot._showEditorLinkPanel(treeViewData, this, this) },
                beforeExpand: ej.proxy(this._onNodeExpand, this),
                beforeCollapse: ej.proxy(ej.Pivot._onNodeCollapse, this)
            });
            var pivotClientObj = this;
            if (this.model.enableMemberEditorPaging && jQuery.isEmptyObject(this._currentFilterList))
                this._currentFilterList = JSON.parse(JSON.stringify(this._editorTreeData));
            else if (!this.model.enableMemberEditorPaging && jQuery.isEmptyObject(this._currentFilterList))
                $(treeViewData).each(function (index, item) {
                    pivotClientObj._currentFilterList[item.id] = item;
                });
            var treeViewElements = this.element.find(".e-editorTreeView").find("li");
            if (!this._isSearchApplied) {
                for (var i = 0; i < treeViewElements.length; i++) {
                    $(treeViewElements[i]).attr("data-tag", treeViewData[i].tag);
                }
            }
            else {
                for (var i = 0; i < treeViewElements.length; i++) {
                    if (!ej.isNullOrUndefined($(treeViewElements[i]).attr("id")))
                        $(treeViewElements[i]).attr("data-tag", ej.DataManager(treeViewData).executeLocal(ej.Query().where("id", "equal", $(treeViewElements[i]).attr("id")))[0].tag);
                }
            }
            this._memberTreeObj = this.element.find('.e-editorTreeView').data("ejTreeView");
            var isTreeNodeHasChild = $.grep(treeViewData, function (item, index) { if (item.hasChildren == true) return item; }).length > 0;
            if (!isTreeNodeHasChild)
                this.element.find(".e-memberEditorDiv").addClass("noChildNode");
            if (this.model.enableMemberEditorSorting)
                this.element.find(".e-editorTreeView").height(235);
            else
            this.element.find(".e-editorTreeView").height(256);
            if (this.element.find(".e-editorPara").text() != this._getLocalizedLabels("KPIs") && !isSlicerAxis && this.model.enableAdvancedFilter && !ej.isNullOrUndefined(this._memberTreeObj) && this.element.find(".groupLabelDrop").length > 0) {
                if (!ej.isNullOrUndefined(this.element.find(".e-treeview li[data-tag='" + this._selectedLevelUniqueName + "']").attr("labelFiltering")))
                    this._memberTreeObj.element.find("." + this.element.find(".e-treeview li[data-tag='" + this._selectedLevelUniqueName + "']").attr("labelFiltering").split("--")[1].replace(" ", "") + " a").append(ej.buildTag("div.e-activeFilter").addClass("e-icon")[0].outerHTML);
                this.element.find(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog) .e-titlebar").hide();
                this._groupLabelChange({ selectedValue: (this.element.find(".groupLabelDrop").data("ejDropDownList").model.value || this.element.find(".groupLabelDrop").data("ejDropDownList").model.dataSource[0].value) });
                this.element.find(".e-memberEditorDiv").height(286);
                if (this.model.enableMemberEditorSorting)
                    this.element.find(".e-editorTreeView").height(235);
                else
                this.element.find(".e-editorTreeView").height(256);
            }
            else
                this.element.find(".e-memberEditorDiv").height(286);
        },

        _createMeasureEditor: function (editorTree) {
            var editorTreeInfo;
            if (editorTree[0] != undefined)
                editorTreeInfo = $.parseJSON(editorTree[0].Value);
            else if (editorTree.d != undefined)
                editorTreeInfo = $.parseJSON(editorTree.d[0].Value);
            else
                editorTreeInfo = $.parseJSON(editorTree.EditorTreeInfo);
            var measureEditor = "";
            for (var i = 0; i < editorTreeInfo.length; i++) {
                measureEditor += "<div id=\"" + editorTreeInfo[i].uniqueName + "\"class=e-measureEditor>" + editorTreeInfo[i].name + "<span class='e-removeMeasure e-icon' role='button' aria-label='remove'></span></div>";
            }
            return measureEditor;
        },

        _onNodeExpand: function (args) {
            var selectedItem = args.targetElement; var tagInfo;
            if (!this.model.enableMemberEditorPaging) this._isSearchApplied = false;
            var onLoad = ej.buildTag("span.nodeExpand e-load e-icon")[0].outerHTML;
            var childCount = $(selectedItem).parents("li").first().children().find("li").length;
            jQuery.each(this._editorTreeData, function (index, value) { if (value.id == args.id) { value.expanded = true; value.isChildMerged = true; return false; } });
            for (var i = 0; i < this._memberTreeObj.dataSource().length; i++) {
                if (this._memberTreeObj.dataSource()[i].parentId == args.id || this._memberTreeObj.dataSource()[i].pid == args.id) {
                    args.isChildLoaded = true;
                    ej.Pivot.closePreventPanel(this);
                    return;
                }
            }
            if (!ej.isNullOrUndefined(this) && ej.DataManager(this._editorTreeData).executeLocal(ej.Query().where("pid", "equal", args.id)).length > 0) {
                args.isChildLoaded = true;
                ej.Pivot.closePreventPanel(this);
                this.pNode = selectedItem;
                this._fetchChildNodeSuccess({ ChildNodes: JSON.stringify(ej.DataManager(this._editorTreeData).executeLocal(ej.Query().where("pid", "equal", args.id))), customObject: this.model.customObject });
                return;
            }
            if (!args.isChildLoaded) {
                $(selectedItem).parents("li").first().prepend(onLoad);
                var checkedState = $(selectedItem).parent().find("input.e-checkbox").prop("checked");
                var tagInfo = $(selectedItem).parents("li").first().attr("data-tag");
                if (tagInfo == undefined) {
                    for (var i = 0; i < this._memberTreeObj.dataSource().length; i++) {
                        if (this._memberTreeObj.dataSource()[i].id == args.id) {
                            tagInfo = this._memberTreeObj.dataSource()[i].tag;
                            $(args.currentElement[0]).attr("data-tag", this._memberTreeObj.dataSource()[i].tag)
                            break;
                        }
                    }
                }
                this.pNode = selectedItem;
                if (this.model.beforeServiceInvoke != null)
                    this._trigger("beforeServiceInvoke", { action: "memberExpanded", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.memberExpand, JSON.stringify({
                    "action": "memberExpanded", "checkedStatus": checkedState, "parentNode": $(selectedItem).parents("li")[0].id, "tag": tagInfo, "dimensionName": this._dimensionName, "cubeName": this.currentCubeName, "olapReport": this.currentReport, "clientReports": this.reports, "customObject": serializedCustomObject
                }), this._fetchChildNodeSuccess);
            }
        },

        _onActiveConditionChange: function (args) {
            if (args.selectedValue == "Between" || args.selectedValue == "NotBetween") {
                $(".filterTo").removeAttr("disabled");
                $(".e-filterBtw").removeClass("e-sortFilterDisable");
            }
            else {
                $(".filterTo").attr("disabled", "disabled");
                this.element.find(".filterTo").val("");
                $(".e-filterBtw").addClass("e-sortFilterDisable");
            }
        },

        _reSizeHandler: function (args) {
            if (!ej.isNullOrUndefined(this)) {
                this._parentHeight = $("#" + this._id).parent().height();
                this.element.height(this._parentHeight);
                this._calculateHeight();
                if (this.model.isResponsive && this._parentHeight != $("#" + this._id).parent().height()) {
                    var heightDiff = $("#" + this._id).parent().height() - this._parentHeight;
                    this.element.height(this._parentHeight - heightDiff);
                    this._calculateHeight();
                }
                this._parentElwidth = $("#" + this._id).parent().width();
                if (this._parentElwidth < 850 || (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && this._parentElwidth < 910)) {
                    this._rwdToggleCollapse();
                }
                if (this._parentElwidth > 850 || (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && this._parentElwidth > 910))
                    this._rwdToggleExpand();
                if (this.model.isResponsive && this.model.enableSplitter) {
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                        this.element.find(".e-serversplitresponsive").data("ejSplitter").refresh();
                    else
                        this.element.find(".e-splitresponsive").data("ejSplitter").refresh();
                }
                this._overflow();
                if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                    this.chartObj = null;
                    this.chartObj = this.element.find("#" + this._pivotChart._id + "Container").data("ejChart");
                    $("#" + this._pivotChart._id + "Container").height(this._chartHeight);
                    if (!ej.isNullOrUndefined(this.chartObj))
                        this.chartObj.model.size.height = this._chartHeight;
                    if (ej.isNullOrUndefined(this.chartObj) && this.model.enablePivotTreeMap && !ej.isNullOrUndefined(this.otreemapObj))
                        this.chartObj = this.element.find("#" + this.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                    if (!ej.isNullOrUndefined(this.chartObj)) {
                        if ((this.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                            this.otreemapObj._treeMap.refresh();
                        }
                        else {
                            this.chartObj.redraw();
                        }
                    }

                }
                if (this._isCollapseCB)
                    this._collapseCubeBrowser();
                if (this.displayMode() != ej.PivotClient.DisplayMode.ChartOnly) {
                    if (this._pivotGrid.element.length > 0)
                        this._pivotGrid._applyFrozenHeaderWidth(this._pivotGrid._JSONRecords);
                }
            }
        },

        _chartDrillSuccess: function (sender) {
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                if (this._isGridDrillAction)
                    this._isGridDrillAction = false;
                else {
                    this._isGridDrillAction = false;
                    this._isChartDrillAction = true;
                    var drilledMember = this._pivotChart._selectedItem;
                    var drillAction = this._pivotChart._drillAction;
                    if (drillAction == "drilldown") {
                        if (!ej.isNullOrUndefined(this._pivotChart._labelCurrentTags.expandedMembers) && this._drillParams.indexOf(this._pivotChart._labelCurrentTags.expandedMembers.join(">#>")) == -1)
                            this._drillParams.push(this._pivotChart._labelCurrentTags.expandedMembers.join(">#>"));
                    }
                    else
                        this._drillParams = $.grep(this._drillParams, function (item) { return item.indexOf(drilledMember) < 0; });
                    var drillInfo = this._pivotChart.model.enableMultiLevelLabels ? sender.drilledMember.split(">#>") : (drillAction == "drilldown" ? this._pivotChart._labelCurrentTags.expandedMembers : this._pivotChart._currentDrillInfo);
                    var minRowIndex = 0, maxRowIndex = this._pivotGrid._rowCount;
                    for (var i = 0; i < drillInfo.length; i++) {
                        var rowheaders = (i == drillInfo.length - 1 && drillAction == "drilldown") ? this._pivotGrid.element.find(".e-pivotGridTable th.summary[data-p^='" + i + "']") : (this._pivotGrid.element.find("th.rowheader").length > 0 ? this._pivotGrid.element.find(".e-pivotGridTable th.rowheader[data-p^='" + i + "']") : $(this._pivotGrid._table).find("th.rowheader[data-p^='" + i + "']"));
                        var targetCell = $.grep(rowheaders, function (headerCell) { return $(headerCell).clone().children().remove().end().text() == drillInfo[i]; });
                        targetCell = $.grep(targetCell, function (headerCell) { return parseInt($(headerCell).attr('data-p').split(',')[1]) >= minRowIndex && parseInt($(headerCell).attr('data-p').split(',')[1]) <= maxRowIndex });
                        if (i == drillInfo.length - 1)
                            $(targetCell).find("." + (drillAction == "drilldown" ? "e-expand" : "e-collapse")).trigger("click");
                        else {
                            minRowIndex = parseInt($(targetCell).attr('data-p').split(',')[1]);
                            maxRowIndex = minRowIndex + (ej.isNullOrUndefined($(targetCell).find("span").attr("data-tag")) ? 0 : parseInt($(targetCell).find("span").attr("data-tag"))) + targetCell[0].rowSpan;
                        }
                    }
                    if (drillInfo.length == 0) {
                        var rowheaders = this._pivotGrid.element.find(".e-pivotGridTable th.rowheader[data-p^='" + 0 + "']");
                        var targetCell = $.grep(rowheaders, function (headerCell) { return $(headerCell).clone().children().remove().end().text() == drilledMember; });
                        $(targetCell).find(".e-collapse").trigger("click");
                    }
                }
            }
            else {
                //if (this.currentReport != undefined)
                // currentReport = this.currentReport;
                //if (this.reports != undefined)
                //  reports = this.reports;
                if (this._pivotChart._startDrilldown && this._pivotGrid != null && this._pivotGrid != undefined)
                    this._renderPivotGrid(this._pivotChart._selectedTagInfo);
                else if (this._pivotGrid != undefined && this._pivotGrid.element.find("table") == "block") {
                    this._isTimeOut = false;
                    this._waitingPopup.hide();
                }
            }
        },

        _treemapDrillSuccess: function (sender) {
            // if (this.currentReport != undefined)
            //  currentReport = this.currentReport;
            //if (this.reports != undefined)
            //reports = this.reports;
            if (this.otreemapObj._startDrilldown && this._pivotGrid != null && this._pivotGrid != undefined)
                this._renderPivotGrid(this.otreemapObj._selectedTagInfo);
            else if (this._pivotGrid != undefined && this._pivotGrid.element.find("table") == "block") {
                this._isTimeOut = false;
                this._waitingPopup.hide();
            }
            if (!ej.isNullOrUndefined(this.chartObj)) {
                if (this.model.displaySettings.enableFullScreen || this.enableTogglePanel() && (this.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                    $("#" + this.otreemapObj._id + "TreeMapContainer").css({ width: "100%" });
                    this.otreemapObj._treeMap.refresh();
                }
            }
        },

        _gridDrillSuccess: function (sender) {
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                if (this._isChartDrillAction)
                    this._isChartDrillAction = false;
                else {
                    this._isGridDrillAction = true;
                    this._isChartDrillAction = false;
                    if (sender.axis == "rowheader" && this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                        //if (this._pivotChart._drillAction == "") {
                        if (sender.drillAction == "drilldown")
                            this._drillParams.push(sender.drilledMember);
                        else
                            this._drillParams = $.grep(this._drillParams, function (item) { return item.indexOf(sender.drilledMember) < 0; });
                        var drillInfo = sender.drilledMember.split(">#>");
                        this._pivotChart._labelCurrentTags.expandedMembers = drillInfo;
                        if (sender.drillAction == "drillup") {
                            this._pivotChart._labelCurrentTags.expandedMembers = [];
                            if (this._drillParams.length > 0)
                                this._getDrilledMember(sender.drillAction);
                            drillInfo = this._pivotChart._labelCurrentTags.expandedMembers;
                        }
                        drillInfo = this._pivotChart.model.enableMultiLevelLabels ? (sender.drillAction == "drillup" ? sender.drilledMember.split(">#>").slice(0, -1) : sender.drilledMember.split(">#>")) : drillInfo;
                        this._pivotChart._drillAction = sender.drillAction;
                        this._pivotChart._drillParams = this._drillParams;
                        var report;
                        try {
                            report = JSON.parse(this.currentReport).Report;
                        }
                        catch (err) {
                            report = this.currentReport;
                        }
                        if (this._pivotChart.model.enableMultiLevelLabels) {
                            this._pivotChart._generateData({ JsonRecords: this.getJSONRecords(), PivotReport: this.getOlapReport() });
                        }
                        else {
                            var serializedCustomObject = JSON.stringify(this.model.customObject);
                            var params = { action: sender.drillAction, currentReport: report, drilledSeries: JSON.stringify(drillInfo) + "-##-" + JSON.stringify(this.model.valueSortSettings), clientReports: this.reports, "customObject": serializedCustomObject };
                            this._pivotChart.doAjaxPost("POST", this.model.url + "/" + this._pivotChart.model.serviceMethodSettings.drillDown, JSON.stringify(params), this._pivotChart.renderControlSuccess);
                        }
                        //}
                    }
                    else
                        this._isGridDrillAction = false;
                    return;
                }
            }
            // if (this.currentReport != undefined)
            //  currentReport = this.currentReport;
            //if (this.reports != undefined)
            //reports = this.reports;
            if (this._pivotGrid._startDrilldown && !ej.isNullOrUndefined(this._pivotChart)) {
                var masktag; var levelCaption; var levelTag;
                levelCaption = this._pivotGrid._drillCaption;
                if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                    this.chartObj = null;
                    if (this.model.displaySettings.enableFullScreen && $("#" + this._id + "_maxView").length > 0)
                        this.chartObj = $("#" + this._id + "_maxView").find("#" + this._pivotChart._id + "Container").data("ejChart");
                    else
                        this.chartObj = this.element.find("#" + this._pivotChart._id + "Container").data("ejChart");
                    if (ej.isNullOrUndefined(this.chartObj) && this.model.enablePivotTreeMap && !ej.isNullOrUndefined(this.otreemapObj))
                        this.chartObj = this.element.find("#" + this.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                }
                var pivotClientObj = this;
                if (!ej.isNullOrUndefined(this.chartObj)) {
                    if ((this.chartObj.sfType.split(".")).pop().toLowerCase() != "treemap") {
                        jQuery.each(this._pivotChart._labelCurrentTags, function (index, value) {
                            if (value != undefined && value.name == levelCaption) {
                                levelTag = value.tag;
                                masktag = value;
                            }
                        });
                        this._pivotChart._drillAction = this._pivotGrid._drillAction;
                        this._pivotChart._selectedItem = levelCaption;
                        if (this._pivotGrid._drillAction == "drilldown" && !ej.isNullOrUndefined(masktag))
                            this._pivotChart._tagCollection.push(masktag)
                        else if (!ej.isNullOrUndefined(masktag)) {
                            jQuery.each(this.element.find(".e-rowAxis").find("button"), function (index, value) {
                                if (value.innerHTML == masktag.tag.split("[")[1].split("]")[0])
                                    pivotClientObj._pivotChart._dimensionIndex = index;
                            });
                            jQuery.each(this._pivotChart._tagCollection, function (index, value) {
                                if (value != undefined && value.name == levelCaption) {
                                    pivotClientObj._pivotChart._selectedIndex = index + pivotClientObj._pivotChart._dimensionIndex;
                                    pivotClientObj._pivotChart._tagCollection.splice(index, pivotClientObj._pivotChart._tagCollection.length);
                                    return false;
                                }
                            });
                        }
                        if (levelTag != null && levelTag != undefined)
                            this._renderPivotChart(levelTag, this._pivotGrid._drillAction);
                        else {
                            this._isTimeOut = false;
                            this._waitingPopup.hide();
                        }
                    }
                    else {
                        for (var i = 0 ; i < this.otreemapObj.getJsonRecords().labelTags.length ; i++) {
                            if (this.otreemapObj.getJsonRecords().labelTags[i].split("::")[2] == levelCaption) {
                                levelTag = this.otreemapObj.getJsonRecords().labelTags[i];
                                break;
                            }
                        }
                        this.otreemapObj_currentAction = this._pivotGrid._drillAction;
                        this.otreemapObj._selectedItem = levelCaption;
                        if (this._pivotGrid._drillAction == "drilldown" && !ej.isNullOrUndefined(masktag))
                            this.otreemapObj._tagCollection.push(masktag)
                        else if (!ej.isNullOrUndefined(masktag)) {
                            jQuery.each(this.element.find(".e-rowAxis").find("button"), function (index, value) {
                                if (value.innerHTML == masktag.tag.split("[")[1].split("]")[0])
                                    pivotClientObj.otreemapObj._dimensionIndex = index;
                            });
                            jQuery.each(this.otreemapObj._tagCollection, function (index, value) {
                                if (value != undefined && value.name == levelCaption) {
                                    pivotClientObj.otreemapObj._selectedIndex = index + pivotClientObj.otreemapObj._dimensionIndex;
                                    pivotClientObj.otreemapObj._tagCollection.splice(index, pivotClientObj.otreemapObj._tagCollection.length);
                                    return false;
                                }
                            });
                        }
                        if (levelTag != null && levelTag != undefined)
                            this._renderPivotTreeMap(levelTag, this._pivotGrid._drillAction);
                        else {
                            this._isTimeOut = false;
                            this._waitingPopup.hide();
                        }
                    }
                }
            }
            else if ($("#" + this._waitingPopup._id + "_WaitingPopup")[0].style.display == "block") {
                this._isTimeOut = false;
                this._waitingPopup.hide();
            }
        },

        _nodeDropped: function (sender) {
            var dropTarget = ($(sender.dropTarget).hasClass("e-pvtBtn") && $(sender.dropTarget).parent("div.e-splitBtn").length > 0) ? $(sender.dropTarget).parent("div.e-splitBtn") : $(sender.dropTarget);
            var pivotClientObj = this;
            if (dropTarget.prevObject != undefined)
                dropTarget.prevObject.removeClass("targetAxis");
            else
                $(dropTarget).removeClass("targetAxis");
            pivotClientObj.isDragging = false;
            var droppedPosition = this._setSplitBtnTargetPos(sender.event);
            dropTarget.prevObject != undefined ? dropTarget.prevObject.parents().find(".e-dialog").hide() : $(dropTarget).parents().find(".e-dialog").hide();
            var cssName = null;
            if ($(dropTarget).hasClass("e-splitBtn"))
                cssName = $(dropTarget).parents("div:eq(0)").attr("class");
            else if (sender.event.type == "touchend")
                cssName = dropTarget[0].className;
            else if (sender.event.target != undefined) {
                if (sender.event.target.className == undefined || sender.event.target.className == null || $(sender.event.target).parents(".e-chartContainer").length > 0)
                    return false;
                if (sender.event.target.className.toLowerCase().indexOf("e-splitBtn") > -1 || $(sender.event.target).hasClass("e-button"))
                    cssName = $(dropTarget).attr("class");
                else
                    cssName = sender.event.target.className;
            }
            else {
                if (sender.event.originalEvent.srcElement.className.toLowerCase().indexOf("e-splitBtn") > -1)
                    cssName = dropTarget[0].className;
                else
                    cssName = sender.event.originalEvent.srcElement.className;
            }
            if (!ej.isNullOrUndefined(this._dimensionName)) {
                delete pivotClientObj._fieldMembers[this._dimensionName.split(":").length > 1 ? this._dimensionName.split(":")[1] : this._dialogTitle];
                delete pivotClientObj._fieldSelectedMembers[this._dimensionName.split(":").length > 1 ? this._dimensionName.split(":")[1] : this._dialogTitle];
            }
            var axisName = (cssName.indexOf("e-categoricalAxis") > cssName.indexOf("e-rowAxis")) ? ((cssName.indexOf("e-categoricalAxis") > cssName.indexOf("e-slicerAxis")) ? "Categorical" : "Slicer") : ((cssName.indexOf("e-rowAxis") > cssName.indexOf("e-slicerAxis")) ? "Series" : (cssName.indexOf("e-slicerAxis") >= 0) ? "Slicer" : null);
            var tagVal;
            if ($(sender.droppedElement).parents("[data-tag='KPI']").length > 0) {
                if (($(sender.droppedElement).text() == "Value" || $(sender.droppedElement).text() == "Goal" || $(sender.droppedElement).text() == "Status" || $(sender.droppedElement).text() == "Trend"))
                    tagVal = ($(sender.droppedElement).attr("data-tag") + ":" + $(sender.droppedElement).parent().closest("li").attr("data-tag") + ":" + this._getLocalizedLabels("KPIs"));
                else
                    tagVal = ($(sender.droppedElement).attr("data-tag") + ":" + this._getLocalizedLabels("KPIs"));

            }
            else
                tagVal = $(sender.droppedElement).attr("data-tag");
            if ((axisName == "Slicer" && tagVal != null && (tagVal.indexOf("Measure") > -1 || tagVal.indexOf("KPIs") > -1) && (this.element.find(".e-splitBtn[tag*=Measures]").length > 1 || this.element.find(".e-splitBtn[data-tag*='KPIs']").length >= 1)) || (axisName == "Slicer" && tagVal.indexOf("Measure") > -1 && $(sender.droppedElement).find(".e-calcMemberCDB").length > 0 && this.element.find(".e-splitBtn[tag*=CalculatedMember][tag*=Measure]").length == 1 && $(sender.droppedElement).attr("data-tag").replace(/\[/g, "").replace(/\]/g, "") != this.element.find(".e-splitBtn[data-tag*=CalculatedMember][data-tag*=Measure]").attr("data-tag").split(":")[1].split("::")[0]) || (axisName == "Slicer" && tagVal.indexOf("Measure") > -1 && $(sender.droppedElement).find(".e-calcMemberCDB").length == 0 && this.element.find(".e-splitBtn[data-tag*=CalculatedMember][data-tag*=Measure]").length == 1) || (axisName == "Slicer" && tagVal.indexOf("Measure") > -1 && $(sender.droppedElement).find(".e-calcMemberCDB").length == 1 && this.element.find(".e-splitBtn[data-tag*=CalculatedMember][data-tag*=Measure]").length == 0 && this.element.find(".e-splitBtn[data-tag*=Measure]").length == 1)) {
                var alertMsg = (tagVal.indexOf("KPIs") > -1 || tagVal.indexOf("Measure") > -1) && this.element.find(".e-splitBtn[data-tag*='KPIs']").length >= 1 ? this._getLocalizedLabels("KpiAlertMsg") : this._getLocalizedLabels("MultipleMeasure");
                ej.Pivot._createErrorDialog(alertMsg, this._getLocalizedLabels("Warning"), this);
                return false;
            }
            var pvtBtns = this.element.find(".e-splitBtn");
            for (var i = 0; i < pvtBtns.length; i++) {
                if (!ej.isNullOrUndefined($(sender.droppedElement).attr("data-parentuniquename")) && !ej.isNullOrUndefined($($(pvtBtns)[i]).attr("data-parenthierarchy")) && $($(pvtBtns)[i]).attr("data-parenthierarchy") == $(sender.droppedElement).attr("data-parentuniquename")) {
                    var dlgContent = this._getLocalizedLabels("NamedSetAlert").replace("<Set 1>", $($(pvtBtns)[i]).find(".e-btn").text()).replace("<Set 2>", $(sender.droppedElement).find(".e-text").text());
                    var dialogElem = ej.buildTag("div.data-namedSetDialog#NamedSetDialog", ej.buildTag("div.data-namedSetDialogContent", dlgContent)[0].outerHTML + ej.buildTag("div", ej.buildTag("button#OKBtn.e-okBtn", "OK", { "margin": "20px 0 10px 120px" }).attr("title", "OK")[0].outerHTML + ej.buildTag("button#CancelBtn.e-cancelBtn", "Cancel", { "margin": "20px 0 10px 10px" }).attr("title", "Cancel")[0].outerHTML)[0].outerHTML).attr("title", "Warning")[0].outerHTML;
                    pivotClientObj.element.append(dialogElem);
                    var axisName = (cssName.indexOf("e-categoricalAxis") > cssName.indexOf("e-rowAxis")) ? ((cssName.indexOf("e-categoricalAxis") > cssName.indexOf("e-slicerAxis")) ? "Categorical" : "Slicer") : ((cssName.indexOf("e-rowAxis") > cssName.indexOf("e-slicerAxis")) ? "Series" : (cssName.indexOf("e-slicerAxis") >= 0) ? "Slicer" : null);
                    var removeEle = $($(".e-splitBtn")[i]);
                    pivotClientObj.element.find(".data-namedSetDialog").ejDialog({ target: "#" + pivotClientObj._id, enableResize: false, enableRTL: false, width: "400px" });
                    var controlObj = this;
                    pivotClientObj.element.find(".e-okBtn,.e-cancelBtn").ejButton({ type: ej.ButtonType.Button, width: "70px" });
                    pivotClientObj.element.find(".e-cancelBtn").on(ej.eventType.click, function (e) {
                        controlObj.element.find(".e-dialog").remove();
                    });
                    pivotClientObj.element.find(".e-okBtn").on(ej.eventType.click, function (e) {
                        if (pivotClientObj.model.beforeServiceInvoke != null)
                            pivotClientObj._trigger("beforeServiceInvoke", { action: "nodeDropped", element: pivotClientObj.element, customObject: pivotClientObj.model.customObject });
                        var serializedCustomObject = JSON.stringify(pivotClientObj.model.customObject);
                        var params = pivotClientObj.currentCubeName + "--" + $(sender.droppedElement).attr("data-tag") + "--" + axisName + "--" + droppedPosition + "##" + $(removeEle).attr("data-tag");
                        pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.nodeDropped, JSON.stringify({ "action": "nodeDroppedNamedSet", "dropType": "TreeNode", "nodeInfo": params, "olapReport": pivotClientObj.currentReport, "clientReports": pivotClientObj.reports, "customObject": serializedCustomObject }), pivotClientObj._nodeDroppedSuccess);
                    });
                    return 0;
                }
            }
            if (axisName != null && tagVal != "Measures" && tagVal.lastIndexOf(".DF") != tagVal.length - ".DF".length) {
                if (!(axisName == "Slicer" && (tagVal.indexOf("Measures") >= 0 || $(sender.droppedElement[0].childNodes[0]).find(".e-namedSetCDB").length > 0))) {
                    this._isTimeOut = true;
                    setTimeout(function () {
                        if (pivotClientObj._isTimeOut)
                            pivotClientObj._waitingPopup.show();
                    }, 800);
                    if (this.model.beforeServiceInvoke != null)
                        this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.customObject });
                    var serializedCustomObject = JSON.stringify(this.model.customObject);
                    var params = pivotClientObj.currentCubeName + "--" + tagVal + "--" + axisName + "--" + droppedPosition;
                    pivotClientObj.doAjaxPost("POST", pivotClientObj.model.url + "/" + pivotClientObj.model.serviceMethodSettings.nodeDropped, JSON.stringify({ "action": "nodeDropped", "dropType": "TreeNode", "nodeInfo": params, "olapReport": pivotClientObj.currentReport, "clientReports": pivotClientObj.reports, "customObject": serializedCustomObject }), pivotClientObj._nodeDroppedSuccess);
                }
            }
            pivotClientObj._isRemoved = true;
            pivotClientObj._isNodeOrButtonDropped = true;
        },

        _setSplitBtnTargetPos: function (event) {
            var targetPosition = ""; var AEBdiv; var targetSplitBtn; var className;
            if (event.event != undefined && event.event.type == "touchend") {
                targetSplitBtn = event.event.originalEvent.target != null ? $(event.event.originalEvent.target).parents(".e-splitBtn") : $(event.event.originalEvent.srcElement).parents(".e-splitBtn");
                className = event.event.originalEvent.target != null ? event.event.originalEvent.target.className : event.event.originalEvent.srcElement.className;
            }
            else {
                targetSplitBtn = event.originalEvent.target != null ? $(event.originalEvent.target).parents(".e-splitBtn") : $(event.originalEvent.srcElement).parents(".e-splitBtn");
                className = event.originalEvent.target != null ? event.originalEvent.target.className : event.originalEvent.srcElement.className;
            }
            if (targetSplitBtn[0] || (className != undefined && className != null && jQuery.type(className) == "string" && className.indexOf("e-splitBtn") > -1)) {
                targetSplitBtn = targetSplitBtn[0] ? targetSplitBtn[0] : event.originalEvent.target != null ? event.originalEvent.target : event.originalEvent.srcElement;
                if (event.event != undefined && event.event.type == "touchend")
                    AEBdiv = event.target;
                else if (this._dropAxisClassName != null && this._dropAxisClassName != undefined && this._dropAxisClassName != "")
                    AEBdiv = this.element.find("." + this._dropAxisClassName)[0];
                else
                    AEBdiv = targetSplitBtn.parentNode;
                if (AEBdiv != undefined) {
                    for (var i = 0; i < $(AEBdiv).find(".e-splitBtn").length; i++) {
                        if ($(AEBdiv).find(".e-splitBtn")[i] == targetSplitBtn)
                            targetPosition = i;
                    }
                }
                else {
                    this._dropAxisClassName = "";
                }
            }
            return targetPosition;
        },

        _cubeChanged: function (sender) {
            var pivotClientObj = this, ind = -1;
            var reportList = this.element.find('#reportList').data("ejDropDownList");
            var cubeList = pivotClientObj.element.find('#cubeSelector').data("ejDropDownList");
            var currentCubeFilterTxt = $.extend(true, {}, this._slicerBtnTextInfo);
            currentCubeFilterTxt[reportList.selectedIndexValue] = this._fieldSelectedMembers;
            var curRep = { "CubeName": this.currentCubeName, "CurrentReport": this.currentReport, "Reports": this.reports, "ReportIndex": reportList.selectedIndexValue, slicerBtnTextInfo: currentCubeFilterTxt };

            $.map(this._repCol, function (value, index) {
                if (value.CubeName == pivotClientObj.currentCubeName)
                    ind = index;
            });

            if (ind != -1) {
                this._repCol[ind] = curRep;
            }
            else
                this._repCol.push(curRep);
            this._currentRecordName = "";
            this._fieldMembers = {};
            this._fieldSelectedMembers = {};
            if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                this.chartObj = null;
                this.chartObj = this.element.find("#" + this._pivotChart._id + "Container").data("ejChart");
                if (ej.isNullOrUndefined(this.chartObj) && this.model.enablePivotTreeMap && !ej.isNullOrUndefined(this.otreemapObj))
                    this.chartObj = this.element.find("#" + this.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
            }
            if (this.currentCubeName == sender.text)
                return false
            else
                this.currentCubeName = sender.text;
            var currentReport = "", reports = "";
            $.map(this._repCol, function (value, index) {
                if (value.CubeName == pivotClientObj.currentCubeName) {
                    currentReport = value.CurrentReport;
                    reports = value.Reports;
                    pivotClientObj._reportIndex = value.ReportIndex;
                }
            });
            pivotClientObj._isTimeOut = true;
            setTimeout(function () {
                if (pivotClientObj._isTimeOut)
                    pivotClientObj._waitingPopup.show();
            }, 800);
            if (this.model.beforeServiceInvoke != null)
                this._trigger("beforeServiceInvoke", { action: "cubeChanged", element: this.element, customObject: this.model.customObject });
            var serializedCustomObject = JSON.stringify(this.model.customObject);
            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.cubeChanged, JSON.stringify({ "action": "cubeChanged", "cubeName": this.currentCubeName, "olapReport": currentReport, "clientReports": reports, "customObject": serializedCustomObject, "clientParams": JSON.stringify(this.model.enableMeasureGroups) + "-" + this.model.enableKPI }), this._cubeChangedSuccess);
        },

        _measureGroupChanged: function (sender) {
            this._isTimeOut = true;
            var pivotClientObj = this;
            setTimeout(function () {
                if (pivotClientObj._isTimeOut)
                    pivotClientObj._waitingPopup.show();
            }, 800);
            if (this.model.beforeServiceInvoke != null)
                this._trigger("beforeServiceInvoke", { action: "cubeChanged", element: this.element, customObject: this.model.customObject });
            var serializedCustomObject = JSON.stringify(this.model.customObject);
            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.measureGroupChanged, JSON.stringify({ "action": "measureGroupChanged", "measureGroupName": sender.text, "olapReport": this.currentReport, "clientReports": this.reports, "customObject": serializedCustomObject }), this._measureGroupChangedSuccess);
        },
        _updateSlicerBtnText: function (cubeName) {
            var reportIdx = this.element.find('#reportList').data("ejDropDownList").selectedIndexValue;
            var filterText = $.map(this._repCol, function (value, index) {
                if (value.CubeName == cubeName) {
                    if (!ej.isNullOrUndefined(value.slicerBtnTextInfo[reportIdx]))
                        return value.slicerBtnTextInfo[reportIdx];
                }
            });
            this._fieldSelectedMembers = filterText.length > 0 ? filterText[0] : this._fieldSelectedMembers;
        },
        _reportChanged: function (sender) {
            this._fieldMembers = {};
            this._fieldSelectedMembers = {};
            var pivotClientObj = this;
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                pivotClientObj._updateSlicerBtnText(pivotClientObj.currentCubeName);
            this.reportDropTarget = this.element.find('#reportList').data("ejDropDownList");
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                var dataSourceInfo = $.map(this._clientReportCollection, function (obj, index) { if (obj.reportName == pivotClientObj.reportDropTarget.getValue()) return obj; });
                this.model.dataSource = dataSourceInfo[0];
                if (this._currentItem != "Rename Report") {
                    this.refreshControl();
                    this._pivotSchemaDesigner._refreshPivotButtons();
                }
                this._isTimeOut = false;
                this._waitingPopup.hide();
            }
            else {
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    if (!this._isReportListAction) return;
                    pivotClientObj._isTimeOut = true;
                    setTimeout(function () {
                        if (pivotClientObj._isTimeOut)
                            pivotClientObj._waitingPopup.show();
                    }, 800);
                    var dataSourceInfo = $.map(this._clientReportCollection, function (obj, index) { if (obj.name == pivotClientObj.reportDropTarget.getValue()) return obj; });
                    this._currentReportName = dataSourceInfo[0].name;
                    if (this.model.beforeServiceInvoke != null)
                        this._trigger("beforeServiceInvoke", { action: "toolbarOperation", element: this.element, customObject: this.model.customObject });
                    var serializedCustomObject = JSON.stringify(this.model.customObject);
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.toolbarServices, JSON.stringify({ "action": "Change Report", "args": JSON.stringify({ "currentReport": dataSourceInfo[0].report }), "customObject": serializedCustomObject }), this._toolbarOperationSuccess);
                }
                else if (sender.selectedText != this._selectedReport) {
                    pivotClientObj._isTimeOut = true;
                    setTimeout(function () {
                        if (pivotClientObj._isTimeOut)
                            pivotClientObj._waitingPopup.show();
                    }, 800);
                    if (this.model.beforeServiceInvoke != null)
                        this._trigger("beforeServiceInvoke", { action: "toolbarOperation", element: this.element, customObject: this.model.customObject });
                    var serializedCustomObject = JSON.stringify(this.model.customObject);
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.toolbarServices, JSON.stringify({ "action": "toolbarOperation", "toolbarOperation": "Report Change", "clientInfo": sender.text, "olapReport": null, "clientReports": this.reports, "customObject": serializedCustomObject }), this._toolbarOperationSuccess);
                }
            }
            this._selectedReport = this.reportDropTarget._currentText;
        },

        _onDropped: function (sender) {
            if (sender.target.className.indexOf("e-button") > -1) {
                var columnPosInfo = this._getAxisPosition(this.element.find(".e-categoricalAxis"));
                var rowPosInfo = this._getAxisPosition(this.element.find(".e-rowAxis"));
                var slicerPosInfo = this._getAxisPosition(this.element.find(".e-slicerAxis"));
                this._dropAxisClassName;
                if (sender.pageX != undefined && sender.pageY != undefined) {
                    if (sender.pageX > columnPosInfo.left && sender.pageX < columnPosInfo.right && sender.pageY > columnPosInfo.top && sender.pageY < columnPosInfo.bottom)
                        this._dropAxisClassName = "e-categoricalAxis";
                    else if (sender.pageX > rowPosInfo.left && sender.pageX < rowPosInfo.right && sender.pageY > rowPosInfo.top && sender.pageY < rowPosInfo.bottom)
                        this._dropAxisClassName = "e-rowAxis";
                    else if (sender.pageX > slicerPosInfo.left && sender.pageX < slicerPosInfo.right && sender.pageY > slicerPosInfo.top && sender.pageY < slicerPosInfo.bottom)
                        this._dropAxisClassName = "e-slicerAxis";
                    else
                        this._dropAxisClassName = "outOfAxis";
                }
            }
        },

        _getAxisPosition: function (targetElement) {
            var tempPos = targetElement.position();
            var item = {};
            item["top"] = tempPos.top;
            item["right"] = tempPos.left + $(targetElement).width();
            item["bottom"] = tempPos.top + $(targetElement).height();
            item["left"] = tempPos.left;
            return item;
        },

        _onTabClick: function (args) {
            if (this.model.enableSplitter && !ej.isNullOrUndefined(this.element.find(".e-childsplit").data("ejSplitter")))
                this.element.find(".e-childsplit").data("ejSplitter").refresh();
            if (this.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                this.chartObj = this.element.find("#" + this._pivotChart._id + "Container").data("ejChart");
                if (ej.isNullOrUndefined(this.chartObj) && this.model.enablePivotTreeMap && !ej.isNullOrUndefined(this.otreemapObj))
                    this.chartObj = this.element.find("#" + this.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
            }
            this._currentTab = "chart";
            if ($(args.activeHeader).find("a").text() == this._getLocalizedLabels("Grid")) {
                this._currentTab = "grid";
                this.element.find(".e-chartTypesImg").addClass("e-chartTypesOnGridView");
                this.element.find(".e-gridPanel").css("display", "inline");
            }
            else if (!ej.isNullOrUndefined(this.chartObj)) {
                this._currentTab = "chart";
                if (this.model.enableRTL && ej.browserInfo().name == "msie") {                    
                    if (!(this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap))
                        this.element.find(".e-chartPanel").addClass("e-clientChartTabRtl");
                    else
                        this.element.find(".e-chartPanel").addClass("e-serverChartTabRtl");
                }
                this.element.find(".e-chartTypesImg").removeClass("e-chartTypesOnGridView");
                if (!ej.isNullOrUndefined(this.chartObj))
                    (this.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap" ? this.otreemapObj._treeMap.refresh() : this.chartObj.redraw();
                if (this.model.enableSplitter)
                    this._splitterChartResizing(this);
                if (this.model.enableToolBar) {
                    this._unWireEvents();
                    this._wireEvents();
                }
            }
        },

        doAjaxPost: function (type, url, data, onSuccess, onComplete, customArgs) {
            var contentType, dataType, successEvt, isAsync = true, withCred = this.model.enableXHRCredentials;
            if ((data["XMLA"] == undefined))
                contentType = 'application/json; charset=utf-8', dataType = 'json', successEvt = $.proxy(onSuccess, this), isAsync = (((ej.browserInfo().name == "msie" && ej.browserInfo().version <= 9) || JSON.parse(data).action == "export") ? false : true);
            else
                contentType = 'text/xml', dataType = 'xml', data = data["XMLA"], successEvt = $.proxy(onSuccess, ej.olap.base, customArgs), isAsync = ((ej.browserInfo().name == "msie" && ej.browserInfo().version <= 9) ? false : (!ej.isNullOrUndefined(customArgs) && customArgs["action"] != "loadFieldElements") ? true : false);
            var post = {
                type: type,
                url: url,
                contentType: contentType,
                dataType: dataType,
                async: isAsync,
                data: data,
                success: successEvt,
                xhrFields: {
                    withCredentials: withCred
                },
                complete: ej.proxy(function () {
					if(ej.isNullOrUndefined(this.model))
				      return false;
                    var eventArgs = { "action": !ej.isNullOrUndefined(customArgs) && !ej.isNullOrUndefined(customArgs.action) ? customArgs.action : JSON.parse(data)["action"], "customObject": this.model.customObject, "element": this.element };
                    this._trigger("renderComplete", eventArgs);
                }, this),
                error: ej.proxy(function (msg, textStatus, errorThrown) {
                    this._waitingPopup = this.element.data("ejWaitingPopup");
                    this._isTimeOut = false;
                    this._waitingPopup.hide();
                    var eventArgs = { "customObject": this.model.customObject, "element": this.element, "Message": msg };
                    this._trigger("renderFailure", eventArgs);
                    this._renderControlSuccess("");
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
        }
    });

    ej.PivotClient.Locale = ej.PivotClient.Locale || {};

    ej.PivotClient.Locale["en-US"] = {
        NoReports: "No Reports Found in DB",
        Sort: "Sort",
        Search: "Search",
        SelectField: "Select field",
        LabelFilterLabel: "Show the items for which the label",
        ValueFilterLabel: "Show the items for which",
        ClearSorting: "Clear Sorting",
        ClearFilterFrom: "Clear Filter From",
        SortAtoZ: "Sort A to Z",
        SortZtoA: "Sort Z to A",

        LabelFilters: "Label Filters  ",
        BeginsWith: "Begins With",
        DoesNotBeginsWith: "Does Not Begin With",
        EndsWith: "Ends With",
        NotEndsWith: "Not Ends With",
        DoesNotEndsWith: "Does Not End With",
        Contains: "Contains",
        DoesNotContains: "Does Not Contain",

        ValueFilters: "Value Filters",
        ClearFilter: "Clear Filter",
        Equals: "Equals",
        DoesNotEquals: "Does Not Equal",
        NotEquals: "Not Equals",
        GreaterThan: "Greater Than",
        GreaterThanOrEqualTo: "Greater Than Or Equal To",
        LessThan: "Less Than",
        LessThanOrEqualTo: "Less Than Or Equal To",
        Between: "Between",
        NotBetween: "Not Between",
        Top10: "Top Count",

        GreaterThan: "Greater Than",
        IsGreaterThan: "Is Greater Than",
        IsGreaterThanOrEqualTo: "Is Greater Than Or Equal To",
        IsLessThan: "Is Less Than",
        IsLessThanOrEqualTo: "Is Less Than Or Equal To",
        DeferUpdate: "Defer Update",
        MDXQuery: "MDX Query",
        Column: "Column",
        Row: "Row",
        Slicer: "Slicer",
        CubeSelector: "Cube Selector",
        ReportName: "Report Name",
        NewReport: "New Report",
        CubeDimensionBrowser: "Cube Dimension Browser",
        AddReport: "Add Report",
        RemoveReport: "Remove Report",
        CannotRemoveSingleReport: "Cannot remove single report",
        AreYouSureToDeleteTheReport: "Are you sure to delete the Report",
        RenameReport: "Rename Report",
        ChartTypes: "Chart Types",
        ToggleAxis: "Toggle Axis",
        Load: "Load",
        ExportToExcel: "Export To Excel",
        ExportToWord: "Export To Word",
        ExportToPdf: "Export To Pdf",
        FullScreen: "Full Screen",
        Grid: "Grid",
        Chart: "Chart",
        OK: "<u>O</u>K",
        Cancel: "<u>C</u>ancel",
        Close: "Close",
        AddToColumn: "Add to Column",
        AddToRow: "Add to Row",
        AddToSlicer: "Add to Slicer",
        MeasureEditor: "Measure Editor",
        MemberEditor: "Member Editor",
        Measures: "Measures",
        SortOrFilterColumn: "Sort/Filter (Column)",
        SortOrFilterRow: "Sort/Filter (Row)",
        SortingAndFiltering: "Sorting And Filtering",
        Sorting: "Sorting",
        Measure: "<u>M</u>easure",
        Order: "Order",
        Filtering: "Filtering",
        Condition: "C<u>o</u>ndition",
        Value: "Val<u>u</u>e",
        PreserveHierarchy: "P<u>r</u>eserve  Hierarchy",
        Ascending: "<u>A</u>scending",
        Descending: "D<u>e</u>scending",
        Enable: "E<u>n</u>able",
        Disable: "D<u>i</u>sable",
        and: "<u>a</u>nd",
        EqualTo: "EqualTo",
        NotEquals: "NotEquals",
        GreaterThan: "GreaterThan",
        GreaterThanOrEqualTo: "GreaterThanOrEqualTo",
        LessThan: "LessThan",
        LessThanOrEqualTo: "LessThanOrEqualTo",
        Between: "Between",
        NotBetween: "NotBetween",
        ReportList: "Report List",
        Line: "Line",
        Spline: "Spline",
        Column: "Column",
        Area: "Area",
        SplineArea: "Spline Area",
        StepLine: "Step Line",
        StepArea: "Step Area",
        Pie: "Pie",
        Bar: "Bar",
        StackingArea: "Stacking Area",
        StackingColumn: "Stacking Column",
        StackingBar: "Stacking Bar",
        Pyramid: "Pyramid",
        Funnel: "Funnel",
        Doughnut: "Doughnut",
        Scatter: "Scatter",
        Bubble: "Bubble",
        WaterFall: "WaterFall",
        TreeMap: "TreeMap",
        Alert: "Alert",
        MDXAlertMsg: "Please add a measure, dimension, or hierarchy in an appropriate axis to view the MDX Query.",
        FilterSortRowAlertMsg: "Dimension is not found in the row axis. Please add Dimension element in the row axis for sorting/filtering.",
        FilterSortColumnAlertMsg: "Dimension is not found in the column axis. Please add Dimension element in the column axis for sorting/filtering.",
        FilterSortcolMeasureAlertMsg: "Please add measure to the column axis",
        FilterSortrowMeasureAlertMsg: "Please add measure to the row axis",
        FilterSortElementAlertMsg: "Element is not found in the column axis. Please add an element in column axis for sorting/filtering.",
        SelectRecordAlertMsg: "Please select a valid report.",
        FilterMeasureSelectionAlertMsg: "Please select a valid measure.",
        FilterConditionAlertMsg: "Please set a valid condition.",
        FilterStartValueAlertMsg: "Please set a start value.",
        FilterEndValueAlertMsg: "Please set a end value.",
        FilterInvalidAlertMsg: "Invalid operation !",
        Remove: "Remove",
        Save: "Save",
        SaveAs: "Save As",
        SelectReport: "Select Report",
        DBReport: "Report Manipulation in DB",
        Rename: "Rename",
        Remove: "Remove",
        SetReportNameAlertMsg: "Please set report name.",
        MultipleItems: "Multiple items",
        All: "All",
        CalculatedMember: "Calculated Member",
        Caption: "Caption:",
        Expression: "Expression:",
        MemberType: "MemberType:",
        FormatString: "Format String:",
        MultipleMeasure: "More than one measure cannot be sliced.",
        DuplicateCalcMeasure: "Calculated Member with same name already exists.",
        EmptyField: "Calculated Member name or Expression should not be empty.",
        EmptyFormat: "Format String for Calculated Member is empty.",
        Warning: "Warning",
        Confirm: "Calculated Member with the same name already exists. Do you want to replace?",
        KPIs: "KPIs",
        Collection: "Collection",
        Report: "Report",
        AddCurrentSelectionToFilter: "Add current selection to filter",
        SaveMsg: "Report saved successfully!!!",
        RenameMsg: "Report renamed successfully!!!",
        RemoveMsg: "Report removed successfully!!!",
        Success: "Success",
        KpiAlertMsg: "The field you are moving cannot be placed in that area of the report",
        NotAllItemsShowing: "Not all child nodes are shown",
        EditorLinkPanelAlert: "The members have more than 1000 items under one or more parent. Only the first 1000 items are displayed under each parent.",
        NamedSetAlert: "Named sets of same field cannot be added to the PivotTable report at the same time. Click OK to remove ' <Set 1> ' named set and add ' <Set 2> ' named set.",
        Exception: "Exception"
    };

    ej.PivotClient.ControlPlacement = {
        Tab: "tab",
        Tile: "tile"
    };

    ej.PivotClient.DisplayMode = {
        ChartOnly: "chartonly",
        GridOnly: "gridonly",
        ChartAndGrid: "chartandgrid"
    };

    ej.PivotClient.ClientExportMode = {
        ChartAndGrid: "chartandgrid",
        ChartOnly: "chartonly",
        GridOnly: "gridonly"
    };
    ej.PivotClient.ExportMode = {
        JSON: "json",
        PivotEngine: "pivotengine"
    };
    ej.PivotClient.DefaultView = {
        Chart: "chart",
        Grid: "grid"
    };
    ej.PivotClient.MemberType = {
        Dimension: "dimension",
        Measure: "measure"
    };

})(jQuery, Syncfusion);