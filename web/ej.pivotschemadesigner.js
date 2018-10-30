/**
* @fileOverview Pivot Schema Designer control to list out and analyze the data
* @copyright Copyright Syncfusion Inc. 2001 - 2013. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {

    ej.widget("ejPivotSchemaDesigner", "ej.PivotSchemaDesigner", {
        _rootCSS: "e-pivotschemadesigner",
        element: null,
        model: null,
        _requiresID: true,
        validTags: ["div", "span"],
        defaults: {
            url: "",
            cssClass: "",
            height: "630px",
            width: "415px",
            locale: "en-US",
            layout: "excel",
            enableRTL: false,
            enableXHRCredentials: false,
            pivotControl: null,
            pivotTableFields: [],
            pivotCalculations: [],
            pivotColumns: [],
            pivotRows: [],
            filters: [],
            olap: {
                showKpi: false,
                showNamedSets: false,
            },
            enableMemberEditorSorting:false,
            enableWrapper: false,
            enableDragDrop: true,
            serviceMethods: {
                fetchMembers: "FetchMembers", nodeStateModified: "NodeStateModified",
                nodeDropped: "NodeDropped", removeButton: "RemoveButton",
                memberExpand: "MemberExpanded", filtering: "filtering", sorting: "sorting"
            },
            customObject: {},
            beforeServiceInvoke: null,
            afterServiceInvoke: null,
            dragMove: null,
            applyFieldCaption: null
        },

        dataTypes: {
            serviceMethods: "data",
            customObject: "data",
            pivotControl: "data",
            pivotTableFieldList: "array",
            pivotCalculationList: "array",
            pivotColumnList: "array",
            pivotRowList: "array",
            filterList: "array"
        },

        locale: ej.util.valueFunction("locale"),

        _init: function () {
            this._initPrivateProperties();
            this._load();
        },

        _destroy: function () {
            this.element.empty().removeClass("e-pivotschemadesigner" + this.model.cssClass).removeAttr("tabindex");
            if (this._waitingPopup != undefined) this._waitingPopup.destroy();
            if (this.element.attr("class") == "") this.element.removeAttr("class");
        },

        _initPrivateProperties: function () {
            this._id = this.element.attr("id");
            this._dialogTitle = "";
            this._currentMembers = new Array();
            this._memberTreeObj = null;
            this._tableTreeObj = null;
            this._dialogOKBtnObj = null;
            this._curFilteredText = "";
            this._curFilteredAxis = "";
            this._tempFilterData = null;
            this._droppedClass = "";
            this._selectedTreeNode = null;
            this._selectedMember = "";
            this._selectedLevel = "";
            this._isDragging = false;
            this._dataModel = "";
            this._droppedPosition = "";
            this._currentCubeName = "";
            this._errorDialog = "";
            this._nodeDropedParams = "";
            this._contextMenuObj = null;
            this._removeButtonDeferUpdate = false;
            this._isMeasureBtnRemove = false;
            this._nodeCheck = false;
            this._isFiltered = false;
            this._curFocus = { tree: null, node: null, tab: null, button: null };
            this._index = { tree: 0, node: 0, tab: 0, button: 0 };
            this._selectedFieldName = "";
            this._selectedFieldCaption = "";
            this._selectedFieldAxis = "";
            this._isDropAction = false;
            this._ascdes = "";
            this._sortType = "";
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
            this._editorDrillTreeData = {};
            this._editorDrillTreePageSettings = {};
            this._lastSavedTree = [];
            this._isEditorDrillPaging = false;
            this._isEditorCollapseDrillPaging = false;
            this._isSearchApplied = false;
            this._isAllMemberChecked = true;
            this._editorTreeData = [];
            this._editorSearchTreeData = [];
            this._memberPagingAvdData = [];
            this._onDemandNodeExpand = true;
            this._isOptionSearch = false;
            this._isSelectSearchFilter = true;
            this._currentFilterList = {};
            this._repCollection = [];
            this._currentCheckedNode = null;
            this._isFilterBtnClick = false;
            this._parentNodeCollection = {};
            this._parentSearchNodeCollection = {};
        },

        _load: function () {
            var itemProps = "", report;
            if (this.model.pivotControl != null) {
                this.model.pivotControl._schemaData = this;
                if ($(this.element).parents(".e-pivotclient").length > 0)
                    this._pivotClientObj = $(this.element).parents(".e-pivotclient").data("ejPivotClient");
                if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    itemProps = JSON.parse(JSON.parse(this.model.pivotControl.getOlapReport()).ItemsProperties);
                    report = JSON.parse(this.model.pivotControl.getOlapReport());
                    if (this.model.pivotControl._dataModel == "Pivot") {
                        report = this.model.pivotControl._filterReport(report);
                        var items = report.PivotRows.concat(report.PivotColumns, report.PivotCalculations, report.Filters);
                        var treeViewData = $.grep(itemProps, function (value) { $.grep(items, function (field) { if (value.id == (field.FieldHeader || field.DimensionHeader)) value.id = (field.FieldName || field.DimensionName); }); return value; });
                        this._setTableFields(treeViewData);
                    }
                    else
                        this._setTableFields(itemProps);
                    this._setPivotRows(report.PivotRows);
                    this._setPivotColumns(report.PivotColumns);
                    this._setPivotCalculations(report.PivotCalculations);
                    this._setFilters(report.Filters);
                    this._dataModel = report.DataModel;
                    this._currentCubeName = report.CurrentCube;
                }
                else {
                    report = this.model.pivotControl.model.dataSource;
                    if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                        this.model.pivotTableFields = ej.PivotAnalysis.getTreeViewData(this.model.pivotControl.model.dataSource);
                }
                this._trigger("load", { element: this.element });
                if (this.model._waitingPopup) {
                    this._waitingPopup = this.model._waitingPopup;
                }
                else {
                    this.element.ejWaitingPopup({ showOnInit: true });
                    this._waitingPopup = this.element.data("ejWaitingPopup");
                }
                this.element.width(this.model.width).height(this.model.height);
                this._waitingPopup.show();
            }
            if (!this.model.enableWrapper) {
                var fieldTable =
                    (this.model.layout == "onebyone" ? "" : ej.buildTag("table.headerTable", ej.buildTag("tr", ej.buildTag("td", ej.buildTag("div.e-listHeader", ej.buildTag("span.headerText", this._getLocalizedLabels("PivotTableFieldList"), {})[0].outerHTML, {})[0].outerHTML + ej.buildTag("div.listSubhead", ej.buildTag("span.subheadText", this._getLocalizedLabels("ChooseFieldsToAddToReport"), {})[0].outerHTML, {})[0].outerHTML, {}).css("vertical-align", "top")[0].outerHTML, {})[0].outerHTML, { "width": "100%", "height": "10%" })[0].outerHTML) +

                    ej.buildTag("div.e-fieldTable",
                    ((this.model.pivotControl != null && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne) ? ej.buildTag("div.e-cubelists", ej.buildTag("input#cubeList.cubeList").attr("type", "text")[0].outerHTML)[0].outerHTML : "") +
                    ej.buildTag("div.parentSchemaFieldTree", ej.buildTag("div.e-schemaFieldTree#" + this._id + "_schemaFieldTree", {}, { "width": "100%" })[0].outerHTML)[0].outerHTML)[0].outerHTML;

                var filterAxis =
                ej.buildTag("div.e-axisTd1", ej.buildTag("div.e-pivotHeader", ej.buildTag("span.headerText", this._getLocalizedLabels("ReportFilter"), {})[0].outerHTML, {})[0].outerHTML +
                ej.buildTag("div.e-schemaFilter", this._createPivotButtons("filters", this.model.filters)).attr("aria-label", "report filter").attr("aria-dropeffect", "none").attr("aria-selected", "false")[0].outerHTML, {})[0].outerHTML;

                var columnAxis =
                ej.buildTag("div.e-axisTd2", ej.buildTag("div.e-rPivotHeader", ej.buildTag("span.headerText", this._getLocalizedLabels("ColumnLabel"), {})[0].outerHTML, {})[0].outerHTML +
                ej.buildTag("div.e-schemaColumn", this._createPivotButtons("columns", this.model.pivotColumns) +
            (this._dataModel != "XMLA" || this.model.pivotCalculations.length == 0 ? "" : (this.model.pivotCalculations[0]["measures"] != undefined && this.model.pivotCalculations[0]["measures"].length > 0 && this.model.pivotCalculations[0]["axis"] != undefined && this.model.pivotCalculations[0]["axis"] == "columns" ? this._createPivotButtons("columns", [{ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }]) : "")), {})[0].outerHTML, {}).attr("aria-label", "column label").attr("aria-dropeffect", "none").attr("aria-selected", "false")[0].outerHTML;

                var rowAxis =
                ej.buildTag("div.e-axisTd1#axisTd", ej.buildTag("div.e-pivotHeader", ej.buildTag("span.headerText", this._getLocalizedLabels("RowLabel"), {})[0].outerHTML, {})[0].outerHTML +
                ej.buildTag("div.e-schemaRow", this._createPivotButtons("rows", this.model.pivotRows) +
            (this._dataModel != "XMLA" || this.model.pivotCalculations.length == 0 ? "" : (this.model.pivotCalculations[0]["measures"] != undefined && this.model.pivotCalculations[0]["measures"].length > 0 && this.model.pivotCalculations[0]["axis"] != undefined && this.model.pivotCalculations[0]["axis"] == "rows" ? this._createPivotButtons("rows", [{ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }]) : "")), {})[0].outerHTML, {}).attr("aria-label", "row label").attr("aria-dropeffect", "none").attr("aria-selected", "false")[0].outerHTML;

                var values =
                ej.buildTag("div.e-axisTd2#axisTd3", ej.buildTag("div.e-rPivotHeader", ej.buildTag("span.headerText", this._getLocalizedLabels("Values"), {})[0].outerHTML, {})[0].outerHTML +
            ej.buildTag("div.e-schemaValue", this._createPivotButtons("values", this.model.pivotCalculations), {}).attr("aria-label", "values").attr("aria-dropeffect", "none").attr("aria-selected", "false")[0].outerHTML, {})[0].outerHTML;

                var axisTable = ej.buildTag("div.e-axisTable", (this.model.layout == "onebyone" ? (columnAxis + rowAxis + filterAxis + values) : (ej.buildTag("div", filterAxis + columnAxis, {})[0].outerHTML + ej.buildTag("div", rowAxis + values, {})[0].outerHTML)), (this.model.enableRTL && this.model.layout == "onebyone" ? { "position": "relative", "left": this._pivotClientObj.model.enableSplitter ? "" : "7px" } : {}))[0].outerHTML;

                var deferUpdate = ej.buildTag("div.deferUpdateLayout", ej.buildTag("input.chkDeferUpdate", "", {}).attr("type", "checkbox")[0].outerHTML + ej.buildTag("button.btnDeferUpdate", this._getLocalizedLabels("Update"), {}).attr("type", "button")[0].outerHTML)[0].outerHTML;
                var htmlTag;
                if (this.model.enableRTL && this.element.parents(".e-pivotclient").length > 0 && this._pivotClientObj.model.enableSplitter) {
                    htmlTag = axisTable + (this.model.layout == "onebyone" ? "" : ej.buildTag("div.centerDiv")[0].outerHTML + ej.buildTag("div.centerHead", this._getLocalizedLabels("DragFieldBetweenAreasBelow"))[0].outerHTML) +
                              fieldTable + ($(this.element).parents(".e-pivotclient").length > 0 ? "" : ej.buildTag("span.responsiveSchema", "")[0].outerHTML) + (this.model.pivotControl != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && $(this.element).parents(".e-pivotclient").length == 0 ? deferUpdate : "") + ($(this.element).parents(".e-pivotclient").length > 0 ? "" : ej.buildTag("div.schemaNoClick", "")[0].outerHTML);
                }
                else {
                    htmlTag = fieldTable + (this.model.layout == "onebyone" ? "" : ej.buildTag("div.centerDiv")[0].outerHTML + ej.buildTag("div.centerHead", this._getLocalizedLabels("DragFieldBetweenAreasBelow"))[0].outerHTML) +
                              axisTable + ($(this.element).parents(".e-pivotclient").length > 0 ? "" : ej.buildTag("span.responsiveSchema", "")[0].outerHTML) + (this.model.pivotControl != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && $(this.element).parents(".e-pivotclient").length == 0 ? deferUpdate : "") + ($(this.element).parents(".e-pivotclient").length > 0 ? "" : ej.buildTag("div.schemaNoClick", "")[0].outerHTML);
                }
                $(htmlTag).appendTo(this.element);
                if (this.element.parents(".e-pivotclient").length > 0 && !this._pivotClientObj.model.enableSplitter) {
                    if (this._pivotClientObj.model.isResponsive)
                        this.element.find(".e-fieldTable").addClass("addedFieldTable");
                    if (!this.model.enableRTL)
                        this.element.find(".e-fieldTable").addClass("e-fieldDisSplitTable");
                }
                if (this.element.parents(".e-pivotclient").length > 0 && this._pivotClientObj.model.enableSplitter) {
                    this.element.find(".e-fieldTable").addClass("e-fieldEnSplitTable");
                }
                if (this.model.enableRTL && this.element.parents(".e-pivotclient").length > 0) {
                    this.element.find(".e-fieldTable").addClass("e-clientFieldTable");
                    this.element.find(".e-fieldTable").addClass("rtlSplitTable");
                    if (this.element.parents(".e-pivotclient").length > 0 && this._pivotClientObj.model.enableSplitter) {
                        this.element.find(".e-axisTable").addClass("e-clientAxisSplitterTable");
                    }

                }
                if (this.model.pivotControl != null) {
                    if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode || this.model.pivotControl.element.hasClass("e-pivotclient"))
                        this._refreshPivotButtons();
                    this._reSizeHandler();
                }
                else
                    this.element.hide();
            }
            else {
                this.element.show();
                if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                    this._refreshPivotButtons();
                }
                else {
                    this._setFilters(report.Filters);
                    this._refreshPivotButtons();
                    if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        if (this.element.find(".deferUpdateLayout").length == 0)
                            this.element.append(ej.buildTag("div.deferUpdateLayout", ej.buildTag("input.chkDeferUpdate", "", {}).attr("type", "checkbox")[0].outerHTML + ej.buildTag("button.btnDeferUpdate", this._getLocalizedLabels("Update"), {}).attr("type", "button")[0].outerHTML)[0].outerHTML);
                    if (this.model.pivotControl != null) {
                        if (this.model.enableDragDrop) {
                            this.element.find(".e-pivotButton .e-pvtBtn").ejButton({ size: "normal", type: ej.ButtonType.Button, enableRTL: this.model.enableRTL }).ejDraggable({
                                handle: 'button', clone: true,
                                cursorAt: { left: -5, top: -5 },
                                dragStart: ej.proxy(function (args) {
                                    this._isDragging = true;
                                }, this),
                                dragStop: ej.proxy(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? this._pvtBtnDropped : this._clientOnPvtBtnDropped, this),
                                helper: ej.proxy(function (event, ui) {
                                    $(event.element).addClass("dragHover");
                                    if (event.sender.target.className.indexOf("e-btn") > -1) {
                                        var btnClone = $(event.sender.target).clone().attr("id", this._id + "_dragClone").appendTo('body');
                                        $("#" + this._id + "_dragClone").removeAttr("style").height($(event.sender.target).height());
                                        return btnClone;
                                    }
                                    else
                                        return false;
                                }, this)
                            });
                        }
                    }
                }
                this._reSizeHandler();
            }

            if (this.model.enableDragDrop && this.model.pivotControl) {
                this.element.find(".e-pivotButton .e-pvtBtn").ejButton({ size: "normal", type: ej.ButtonType.Button, enableRTL: this.model.enableRTL }).ejDraggable({
                    handle: 'button', clone: true,
                    cursorAt: { left: -5, top: -5 },
                    dragStart: ej.proxy(function (args) {
                        this._isDragging = true;
                    }, this),
                    dragStop: ej.proxy(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? this._pvtBtnDropped : this._clientOnPvtBtnDropped, this),
                    helper: ej.proxy(function (event, ui) {
                        $(event.element).addClass("dragHover");
                        if (event.sender.target.className.indexOf("e-btn") > -1) {
                            var btnClone = $(event.sender.target).clone().attr("id", this._id + "_dragClone").appendTo('body');
                            $("#" + this._id + "_dragClone").removeAttr("style").height($(event.sender.target).height());
                            return btnClone;
                        }
                        else
                            return false;
                    }, this)
                });
            }
            this.element.find(".e-pivotButton .filterBtn").ejButton({
                size: "normal",
                enableRTL: this.model.enableRTL,
                type: ej.ButtonType.Button,
                contentType: "imageonly",
                prefixIcon: "filter"
            });
            if (this.model.pivotControl && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne) {
                var parms = { url: this.model.pivotControl.model.dataSource.data, cube: this.model.pivotControl.model.dataSource.cube, catalog: this.model.pivotControl.model.dataSource.catalog, request: "MDSCHEMA_CUBES" };
                ej.Pivot._getTreeData(parms, ej.Pivot.getCubeList, { pvtCtrldObj: this, action: "loadcubelist", hierarchy: this._selectedField });
                this.element.find(".cubeList").ejDropDownList({
                    dataSource: this.model.cubeCollection,
                    enableRTL: this.model.enableRTL,
                    fields: { text: "name", value: "name" },
                    width: "100%",
                    height: "27px",
                    change: ej.proxy(this._cubeChanged, this),
                    create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
                });
                var ddlTarget = this.element.find('.cubeList').data("ejDropDownList");
                if (!ej.isNullOrUndefined(ddlTarget)) {
                    ddlTarget.selectItemByText(this.model.pivotControl.model.dataSource.cube);
                }
            }
            this.element.find(".e-pivotButton input").ejToggleButton({
                size: "normal",
                enableRTL: this.model.enableRTL,
                contentType: "imageonly",
                defaultPrefixIcon: "ascending",
                activePrefixIcon: "descending",
                click: ej.proxy(this._sortBtnClick, this)
            });

            if (this.model.pivotControl != null) {
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot || this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    if (this.model.pivotControl.operationalMode == ej.Pivot.OperationalMode.Olap && !this.model.olap.showKpi) {
                        var tmpFields = [], lock = false;
                        $.each(this.model.pivotTableFields, function (index, item) {
                            if (item.spriteCssClass.indexOf("kpiRootCDB") > -1)
                                lock = true;
                            else if (item.spriteCssClass.indexOf("dimensionCDB") > -1)
                                lock = false;
                            if (!lock)
                                tmpFields.push(item);
                        });
                        this.model.pivotTableFields = tmpFields;
                    }
                    this._createTreeView(this, this.model.pivotTableFields);
                }
                else {
                    ej.Pivot.generateTreeViewData(this);
                }
            }
            if (this.model.enableRTL)
                this.element.addClass("e-rtl");
            this._createContextMenu();
            if (this._waitingPopup) this._waitingPopup.hide();
            this._setPivotBtnWidth();
            if (this.element.parents(".e-pivotclient").length == 0 && this.model.pivotControl != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode)
                this._setFilterIcons();
        },

        _setFilterIcons: function () {
            var fieldSection = 1;
            do {
                var items = fieldSection == 1 ? this.model.pivotControl.model.dataSource.columns : (fieldSection == 2 ? this.model.pivotControl.model.dataSource.rows : this.model.pivotControl.model.dataSource.filters), isPivotData = this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? true : false;
                for (var i = 0; i < items.length; i++) {
                    var members = isPivotData ? ej.PivotAnalysis.getMembers(items[i].fieldName) : [];
                    if (!ej.isNullOrUndefined(items[i].filterItems) && (items[i].filterItems.filterType == "exclude" || (isPivotData ? items[i].filterItems.values.length < members.length : items[i].filterItems.values.length > 0)) && this.element.find(".e-schemaFieldTree li[" + isPivotData ? 'id' : 'data-tag' + "='" + items[i].fieldName + "']").find(".filter").length == 0) {
                        var filterSpan = ej.buildTag("span.e-icon", { "display": "none" }).addClass("filter")[0].outerHTML;
                        isPivotData ? this.element.find(".e-schemaFieldTree li[id='" + items[i].fieldName + "']").find(".e-text").after(filterSpan) : this.element.find(".e-schemaFieldTree li[data-tag='" + items[i].fieldName + "'] div:first .e-text").after(filterSpan);
                        this.element.find(".e-pvtBtn[data-fieldName='" + items[i].fieldName + "']").parent().find(".filter").addClass("filtered");
                    }
                }
                fieldSection++;
            } while (fieldSection < 4);
        },

        setCubeList: function (cubeCollection) {
            this.model.cubeCollection = cubeCollection;
        },

        refreshControl: function () {
            $(this._tableTreeObj.element).ejTreeView("unCheckAll");
            this._isDropAction = true;
            var dataSource = this.model.pivotControl.model.dataSource;
            for (var i = 0; i < dataSource.rows.length; i++)
                this._tableTreeObj.checkNode(this._tableTreeObj.element.find("li[data-tag='" + dataSource.rows[i].fieldName + "']"));
            for (var i = 0; i < dataSource.columns.length; i++)
                this._tableTreeObj.checkNode(this._tableTreeObj.element.find("li[data-tag='" + dataSource.columns[i].fieldName + "']"));
            for (var i = 0; i < dataSource.filters.length; i++)
                this._tableTreeObj.checkNode(this._tableTreeObj.element.find("li[data-tag='" + dataSource.filters[i].fieldName + "']"));
            for (var i = 0; i < dataSource.values.length; i++)
                this._tableTreeObj.checkNode(this._tableTreeObj.element.find("li[data-tag='" + dataSource.values[i].fieldName + "']"));
            this._isDropAction = false;
            this._refreshPivotButtons();
        },

        _cubeChanged: function (args) {
            if (this.model.pivotControl.model.dataSource.cube != args.selectedValue) {
                var obj = this, index = -1, dIndex = 0, data, dList = [];
                var reportList = this.model.pivotControl.element.find('#reportList').data("ejDropDownList");
                var curRep = { "CubeName": this.model.pivotControl.model.dataSource.cube, "CurrentReport": jQuery.extend(true, {}, this.model.pivotControl.model.dataSource), "Reports": JSON.parse(JSON.stringify(this.model.pivotControl._clientReportCollection)), "ReportIndex": reportList.selectedIndexValue, "ReportList": JSON.parse(JSON.stringify(reportList.model.dataSource)), "calculatedMembers": this.model.pivotControl.model.calculatedMembers };

                $.map(this._repCollection, function (value, index) {
                    if (value.CubeName == obj.model.pivotControl.model.dataSource.cube)
                        index = index;
                });
                if (index != -1)
                    this._repCollection[index] = curRep;
                else
                    this._repCollection.push(curRep);
                if (this._pivotClientObj._waitingPopup)
                    setTimeout(function () { var pivotClientObj = ($(args.target).parents(".e-pivotclient").length > 0) ? $(args.target).parents(".e-pivotclient").data("ejPivotClient") : $(this.element).parents(".e-pivotclient").data("ejPivotClient"); pivotClientObj._waitingPopup.show(); }, 0);
                this.model.pivotControl.model.dataSource.cube = args.selectedValue;
                this.model.pivotControl.model.dataSource.reportName = "Default";
                this.model.pivotControl.model.dataSource.rows = this.model.pivotControl.model.dataSource.columns = this.model.pivotControl.model.dataSource.values = this.model.pivotControl.model.dataSource.filters = [];
                this.model.pivotControl._clientReportCollection = [];
                obj.model.pivotControl.model.calculatedMembers = [];
                $.map(this._repCollection, function (value, index) {
                    if (value.CubeName == obj.model.pivotControl.model.dataSource.cube) {
                        obj.model.pivotControl.model.dataSource = value.CurrentReport;
                        obj.model.pivotControl.model.calculatedMembers = value.calculatedMembers;
                        dList = value.Reports;
                        dIndex = value.ReportIndex;
                        data = value.ReportList;
                    }
                });
                delete this.model.pivotControl._fieldData;
                this.element.find(".e-pivotButton").remove();
                this.element.find(".e-schemaFieldTree").empty();
                ej.Pivot.generateTreeViewData(this, this.model.pivotControl.model.dataSource);
                this._pivotClientObj.refreshControl();
                if (dList.length > 0)
                    this.model.pivotControl._clientReportCollection = dList;
                else {
                    data = [{ name: "Default" }];
                    this.model.pivotControl._clientReportCollection.push(this.model.pivotControl.model.dataSource);
                }
                this._pivotClientObj.element.find(".reportlist").ejDropDownList("option", "dataSource", data);
                reportList.selectItemByIndex(dIndex);
            }
        },

        _setPivotBtnWidth: function () {
            if (this.model.layout != "excel" && this.model.pivotControl) {
                var mode = this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? true : false;
                var model = mode ? this._dataModel : this.model.pivotControl._dataModel
                var wid = model == "Olap" || model == "XMLA" ? 15 : 20;
                $.each(this.element.find(".e-schemaRow .e-pvtBtn,.e-schemaColumn .e-pvtBtn"), function (index, value) {
                    if ($(value).attr("aria-describedby") == "Measures") {
                        $(value).width($(value).parent().width() - wid - 10);
                    }
                    else {
                        $(value).width($(value).parent().width() - (3 * wid));
                        if (this._dataModel != "Pivot" && mode && $(".e-pivotButton:contains('" + $(value).text() + "'):first").find(".filtered").length > 0) {
                            $(value).parent().find(".filter").addClass("filtered");
                        }
                    }
                });
                $.each(this.element.find(".e-schemaValue .e-pvtBtn"), function (index, value) {
                    $(value).width($(value).parent().width() - wid - 10);
                });
                $.each(this.element.find(".e-schemaFilter .e-pvtBtn"), function (index, value) {
                    $(value).width($(value).parent().width() - (2 * wid) - 10);
                    if (this._dataModel != "Pivot" && mode && $(".e-pivotButton:contains('" + $(value).text() + "'):first").find(".filtered").length > 0) {
                        $(value).parent().find(".filter").addClass("filtered");
                    }
                });
            }
            else {
                $.each(this.element.find(".e-pvtBtn"), function (index, value) {
                    $(value).width($(value).parent().width() - 15);
                });
            }
        },

        _onContextOpen: function (args) {
            if (!$(args.target).hasClass("e-removeClientPivotBtn"))
                ej.Pivot._contextMenuOpen(args, this);
        },

        _contextClick: function (args) {
            var schemaObj = this;
            var pivotClientObj = ($(this.element).parents(".e-pivotclient").length > 0) ? $(this.element).parents(".e-pivotclient").data("ejPivotClient") : null;
            if (!ej.isNullOrUndefined(pivotClientObj)) {
                pivotClientObj._isTimeOut = true;
                setTimeout(function () {
                    if (pivotClientObj._isTimeOut)
                        schemaObj.model.pivotControl._waitingPopup.show();
                }, 800);
            }
            else
                this.model.pivotControl._waitingPopup.show();
            var droppedPosition = args.text == this._getLocalizedLabels("AddToColumn") ? this.element.find(".e-schemaColumn") : args.text == this._getLocalizedLabels("AddToRow") ? this.element.find(".e-schemaRow") : args.text == this._getLocalizedLabels("AddToValues") ? this.element.find(".e-schemaValue") : args.text == this._getLocalizedLabels("AddToFilter") ? this.element.find(".e-schemaFilter") : "";
            if (droppedPosition != "") {
                var params = { element: this._selectedMember, target: droppedPosition[0], cancel: false };
                if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                    this._pvtBtnDropped(params);
                else
                    this._clientOnPvtBtnDropped(params);
            }
            else
                this.model.pivotControl._waitingPopup.hide();
        },

        _createTreeView: function (args, dataSourceInfo) {
            if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.pivotControl != null && this.model.pivotControl.element.hasClass("e-pivotclient") && this.model.pivotControl.model.toolbarIconSettings.enableCalculatedMember) {
                var calcTreeItems = [{ id: "_0", name: "Calculated Members", hasChildren: true, spriteCssClass: "e-calcMemberGroupCDB e-icon", tag: "" }];
                if (dataSourceInfo[0].id != "_0") {
                    dataSourceInfo.splice(0, 0, calcTreeItems[0]);
                }
                $.map(this.model.pivotControl.model.calculatedMembers, function (args) {
                    var tag = !ej.isNullOrUndefined(args.tag) ? args.tag : ((!ej.isNullOrUndefined(args.memberType) && args.memberType.toLowerCase().indexOf("measure") > -1) ? "[measures].[" + args.caption + "]" : args.caption);
                    dataSourceInfo.push({ "id": args.caption, "pid": "_0", "name": args.caption, "hasChildren": false, "spriteCssClass": "e-calcMemberCDB e-icon", "tag": tag, "expression": args.expression, "formatString": args.formatString, "nodeType": 0, "hierarchyUniqueName": args.memberType == "Measure" ? "" : !ej.isNullOrUndefined(args.hierarchyUniqueName) ? args.hierarchyUniqueName : "" });
                });
            }
            this.element.find(".e-schemaFieldTree").ejTreeView({
                showCheckbox: this.model.layout == "onebyone" ? false : true,
                fields: { id: "id", parentId: "pid", text: (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode || this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) ? "name" : "caption", isChecked: "isSelected", spriteCssClass: "spriteCssClass", dataSource: dataSourceInfo, parentUniqueName: "parentUniqueName" },
                enableRTL: this.model.enableRTL,
                allowDragAndDrop: this.model.enableDragDrop ? true : false,
                allowDropChild: false,
                allowDropSibling: false,
                dragAndDropAcrossControl: true,
                beforeDelete: function () {
                    return false;
                },
                cssClass: 'pivotTreeViewDragedNode',
                nodeDropped: ej.proxy(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? this._nodeDropped : this._clientOnNodeDropped, this),
                nodeDragStart: ej.proxy(this._nodeDrag, this),
                nodeDrag: ej.proxy(this._nodeDraged, this)
            });
            var treeViewElements = [], isMon = this.model.pivotControl.model.dataSource.providerName == ej.olap.Providers.Mondrian;
            this._tableTreeObj = this.element.find(".e-schemaFieldTree").data("ejTreeView");
            this._tableTreeObj.element.find(".e-ul").css({ "width": "100%", "height": "100%" });
            this._tableTreeObj.element.find(".e-measureGroupCDB").parent().siblings(".e-chkbox-wrap").remove();
            this._tableTreeObj.element.find(".e-kpiCDB, .e-kpiRootCDB, .e-kpiGoalCDB, .e-kpiStatusCDB, .e-kpiTrendCDB, .e-kpiValueCDB").parents().siblings(".e-chkbox-wrap").remove();
            this._tableTreeObj.element.find(".e-folderCDB").parent().siblings(".e-chkbox-wrap").remove();
            this._tableTreeObj.element.find(".e-dimensionCDB").parent().siblings(".e-chkbox-wrap").remove();
            if (this.model.layout != ej.PivotSchemaDesigner.Layouts.OneByOne) {
                if (this._tableTreeObj.element.find(".e-measureGroupCDB").parents("li").length == 0)
                    this._tableTreeObj.element.find("#\\[Measures\\]").append(ej.buildTag("span.e-elementSeparator")[0].outerHTML);
                else
                    this._tableTreeObj.element.find(".e-measureGroupCDB").parents("li").append(ej.buildTag("span.e-elementSeparator")[0].outerHTML);
                this._tableTreeObj.element.find(".e-kpiRootCDB, .e-dimensionCDB").parents("li").append(ej.buildTag("span.e-elementSeparator")[0].outerHTML);
            }
            if (this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne) {
                treeViewElements = this._tableTreeObj.element;
                $.map(dataSourceInfo, function (obj, index) { if (obj["defaultHierarchy"]) $(treeViewElements).find("li[id='" + obj.tag + "']").attr("data-defaultHierarchy", obj["defaultHierarchy"]); });
            }
            treeViewElements = this._tableTreeObj.element.find("li");
            for (var i = 0; i < treeViewElements.length; i++) {
                var tagValue = this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? (isMon ? $(treeViewElements[i]).attr("id").split("~#^")[0] : $(treeViewElements[i]).attr("id")) : this.model.pivotTableFields[i].tag;
                treeViewElements[i].setAttribute("data-tag", tagValue);
                if (!ej.isNullOrUndefined(dataSourceInfo[i].parentUniqueName) && dataSourceInfo[i].parentUniqueName != "")
                    treeViewElements[i].setAttribute("data-parentUniqueName", !ej.isNullOrUndefined(dataSourceInfo[i].parentUniqueName) ? dataSourceInfo[i].parentUniqueName.split(">>||>>")[1] : "");
                if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && !ej.isNullOrUndefined(treeViewElements[i].id))
                    treeViewElements[i].id = $(treeViewElements[i]).attr("id").replace(/ /g, "_");
                var checkedBoxNode = $(treeViewElements[i]).find(".e-chkbox-wrap");
                if (this.element.find(".e-pvtBtn[data-fieldName=KPI]").length > 0) {
                    if ($($(treeViewElements[i])).find(".e-folderCDB").length > 0 && $(treeViewElements[i]).attr("data-tag") == "KPI") {
                        var dropSpan = ej.buildTag("span.e-icon").css("display", "none").addClass("treeDrop")[0].outerHTML;
                        $($(treeViewElements[i]).find(".e-text")[0]).after(dropSpan);
                    }
                }
                if ($(checkedBoxNode[0]).attr("aria-checked") == "true" && $($(treeViewElements[i])).find(".e-folderCDB").length <= 0 && $(treeViewElements[i]).attr("data-tag").toLowerCase().indexOf("[measures]") == -1) {
                    if (this.model.pivotControl._dataModel == "XMLA") {
                        if ($(treeViewElements[i]).parents("li:eq(0)").length > 0 && $(treeViewElements[i]).parents("li:eq(0)").attr("data-tag").toLowerCase().indexOf("[measures]") == -1) {
                            var currentItem = (ej.Pivot.getReportItemByFieldName(($(treeViewElements[i]).attr("data-tag")), this.model.pivotControl.model.dataSource, this._dataModel)).item;
                            if (!ej.isNullOrUndefined(currentItem) > 0 && (currentItem["isNamedSets"] == undefined || !currentItem["isNamedSets"])) {
                                var dropSpan = ej.buildTag("span.e-icon").css("display", "inline-block").addClass("treeDrop").attr("role", "button").attr("aria-label", "filter button")[0].outerHTML;
                                $($(treeViewElements[i]).find(".e-text")[0]).after(dropSpan);
                            }
                        }
                    }
                    else {
                        var dropSpan = ej.buildTag("span.e-icon").css("display", "none").addClass("treeDrop")[0].outerHTML;
                        $($(treeViewElements[i]).find(".e-text")[0]).after(dropSpan);
                    }
                }
            }
            if (this.model.pivotControl != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                this._tableTreeObj.model.nodeCheck = ej.proxy(this._clientPivotCheckedStateModified, this);
                this._tableTreeObj.model.nodeUncheck = ej.proxy(this._clientPivotCheckedStateModified, this);
            }
            else {
                this._tableTreeObj.model.nodeCheck = ej.proxy(this._checkedStateModified, this);
                this._tableTreeObj.model.nodeUncheck = ej.proxy(this._checkedStateModified, this);
            }
            this._tableTreeObj.element.find(".e-attributeCDB").parent().siblings("ul").remove();
            this._tableTreeObj.element.find(".e-attributeCDB").closest('div').find('.e-plus').remove();
            this._tableTreeObj.element.find(".e-hierarchyCDB").parent().parent().siblings("ul").find(".e-chkbox-wrap").remove();
            if (this._tableTreeObj.element.find(".e-plus").length == 0) {
                this._tableTreeObj.element.find(".e-item").css("padding", "0px");
            }
            if (this.model.pivotControl != null && this.model.pivotControl.element.hasClass("e-pivotclient") && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                ej.Pivot._refreshFieldList(this);
            }
            this.element.find(".e-schemaFilter, .e-schemaColumn, .e-schemaRow, .e-schemaValue").ejDroppable({
            });
            if (this.model.pivotControl != null) {
                var contextTag = ej.buildTag("ul.pivotTreeContext#pivotTreeContext",
                    ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToFilter"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToRow"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToColumn"))[0].outerHTML)[0].outerHTML +
                    ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToValues"))[0].outerHTML)[0].outerHTML +
                    ej.buildTag("li#e-remove", ej.buildTag("a", this._getLocalizedLabels("Remove"))[0].outerHTML)[0].outerHTML
                    )[0].outerHTML;
                $(this.element).append(contextTag);
                $("#pivotTreeContext").ejMenu({
                    menuType: ej.MenuType.ContextMenu,
                    openOnClick: false,
                    enableRTL: this.model.enableRTL,
                    contextMenuTarget: this._tableTreeObj.element,
                    click: ej.proxy(this._treeContextClick, this),
                    beforeOpen: ej.proxy(this._contextOpen, this),
                    close: ej.proxy(ej.Pivot.closePreventPanel, this)
                });
            }

            if (this.model.pivotControl != null) {
                var deferCheck = false;
                if (this.model.pivotControl.model.enableDeferUpdate)
                    deferCheck = true;
                this.element.find(".btnDeferUpdate").ejButton({
                    size: "mini",
                    type: ej.ButtonType.Button,
                    enabled: deferCheck,
                    click: ej.proxy(this.model.pivotControl._deferUpdate, this.model.pivotControl)
                });
                this.element.find(".chkDeferUpdate").ejCheckBox({
                    text: this._getLocalizedLabels("DeferLayoutUpdate"),
                    change: this._checkedChange,
                    size: "normal",
                    checked: deferCheck
                });
            }
            this._waitingPopup.hide();
            this._unWireEvents();
            this._wireEvents();
        },
        _nodeDraged: function (args) {
            var controlObj = this.model.pivotControl;
            var minusIcon = (!(ej.isNullOrUndefined(controlObj)) && (controlObj.model.operationalMode == "clientmode" && (!(args.target.hasClass("e-schemaValue")) && !(args.target.parents().hasClass("e-schemaValue")))) || (controlObj.model.operationalMode == "servermode" && !(args.target.hasClass("e-schemaRow") || args.target.hasClass("e-schemaColumn")) && !(args.target.parents().hasClass("e-schemaRow") || args.target.parents().hasClass("e-schemaColumn")))) && ($(".pivotTreeViewDragedNode .e-dropedStatus").hasClass("e-plus")) && (args.draggedElementData.id.indexOf("Measures") >= 0);
            if (minusIcon) {
                document.body.style.cursor = 'not-allowed';
                $(".pivotTreeViewDragedNode .e-dropedStatus").removeClass().addClass("e-dropedStatus e-icon e-minus");
            }
            if (this._trigger("dragMove", args))
                return;
        },
        _setFirst: false,

        _setModel: function (options) {
            for (var key in options) {
                switch (key) {
                    case "OlapReport": this.setOlapReport(options[key]); break;
                    case "locale": {
                        this.model.locale = options[key];
                        this._load(); break;
                    }
                    case "locale": case "enableRTL": $(this.element).html(""); this._load(); break;
                    case "height": {
                        this.model.height = options[key];
                        this._load();
                        break;
                    }
                    case "width": {
                        this.model.width = options[key];
                        this._load();
                        break;
                    }
                    case "layout": {
                        this.model.layout = options[key];
                        this._load();
                        break;
                    }
                    case "olap": {
                        this.model.olap = ($.extend({}, this.model.olap, options[key]));
                        this._load();
                        break;
                    }
                    case "enableRTL": {
                        this.model.enableRTL = options[key];
                        this._load();
                        break;
                    }
                    case "enableWrapper": {
                        this.model.enableWrapper = options[key];
                        this._load();
                        break;
                    }
                    case "enableDragDrop": {
                        this.model.enableDragDrop = options[key];
                        this._load();
                        break;
                    }
                }
            }
        },

        _wireEvents: function () {
            this._on($(document), 'keydown', this._keyDownPress);
            this._on($(document), 'keyup', ej.proxy(function (e) {
                if (e.keyCode === 93)
                    e.preventDefault();
            }));
            this._on(this.element.find("a.e-linkPanel"), "click", ej.Pivot._editorLinkPanelClick);
            if (this.model.layout != "excel" && this.model.layout != ej.PivotSchemaDesigner.Layouts.OneByOne) {
                this._on(this.element, "mouseover", ".e-pivotButton .pvtBtnDiv", ej.proxy(function (evt) {
                    if (!this._isDragging)
                        $(evt.target).find("button").removeClass("e-hoverBtn").addClass("e-hoverBtn");
                }, this));
                this._on(this.element, "mouseleave", ".e-pivotButton .pvtBtnDiv", ej.proxy(function (evt) {
                    $(evt.target).find("button").length > 0 ? $(evt.target).find("button").removeClass("e-hoverBtn") : $(evt.target).removeClass("e-hoverBtn");
                }, this));
                this._on(this.element, "mouseover", ".filter,.sorting,.e-removeBtn", ej.proxy(function (evt) {
                    if (!this._isDragging)
                        $(evt.target.parentElement).find("button").removeClass("e-hoverBtn").addClass("e-hoverBtn");
                }, this));
                this._on(this.element, "mouseleave", ".filter,.sorting,.e-removeBtn", ej.proxy(function (evt) {
                    $(evt.target.parentElement).find("button").removeClass("e-hoverBtn");
                }, this));
            }
            this._on(this.element, "mouseover", ".pvtBtnDiv .e-pvtBtn", ej.proxy(function (evt) {
                if (this._isDragging) {
                    this.element.find(".e-dropIndicator").removeClass("e-dropIndicatorHover");
                    $(evt.target).parent().siblings(".e-dropIndicator").addClass("e-dropIndicatorHover");
                }
            }, this));
            this._on(this.element, "click", "#preventDiv", ej.proxy(function (evt) {
                if (this.element.find(".e-dialog.e-advancedFilterDlg:visible").length > 0) {
                    this.element.find(".e-dialog.e-advancedFilterDlg").hide();
                    this.element.find("#preventDiv").remove();
                }
            }, this));

            this._on(this.element, "mouseleave", ".e-pivotButton", ej.proxy(function (evt) { if (this._isDragging) $(evt.target).siblings(".e-dropIndicator").removeClass("e-dropIndicatorHover"); }, this));
            this._on(this.element, "mouseover", ".e-pivotButton", ej.proxy(function (evt) { $(evt.target).attr("title", evt.target.textContent); }, this));
            this._tableTreeObj.element.find("li").mouseover(ej.proxy(function (evt) {
                var margin;
                if ($(evt.target).siblings("span.e-icon.filter:eq(0)").length > 0 || $(evt.target).find("span.e-icon.filter:eq(0)").length > 0 || $(evt.target).parentsUntil("li").find("span.e-icon.filter:eq(0)").length > 0) {
                    margin = "-31px";
                    this.element.find("span.e-icon.filter").attr("role", "button").attr("aria-label", "filtered");
                }
                else {
                    margin = "-20px";
                    this.element.find("span.e-icon.treeDrop").attr("role", "button").attr("aria-label", "filter button");
                }
                var left = ($(evt.target).siblings("span.e-icon.filter:eq(0)").length > 0 || $(evt.target).find("span.e-icon.filter:eq(0)").length > 0 || $(evt.target).parentsUntil("li").find("span.e-icon.filter:eq(0)").length > 0) ? 10 : 5;
                if (this.model.enableRTL) {
                    if (this.model.pivotControl.model.analysisMode != ej.Pivot.AnalysisMode.Pivot)
                        $(evt.target).siblings("span.e-icon.treeDrop:eq(0)").length > 0 ? $(evt.target).siblings("span.e-icon.treeDrop:eq(0)").css({ display: "inline-block", "position": "absolute", "top": ($(evt.target).hasClass("filter") ? $(evt.target).position().top - 22 : $(evt.target).position().top + 2), "left": ($(evt.target).hasClass("filter") ? ($(evt.target).position().left + (6 - left)) : (($(evt.target).attr("role") == "" ? $(evt.target).position().left : -2) + (5 - left))) }) : $(evt.target).find("span.e-icon.treeDrop:eq(0)").length > 0 ? $(evt.target).find("span.e-icon.treeDrop:eq(0)").css({ "display": "inline-block", "position": "absolute" }) : $(evt.target).parentsUntil("li").find("span.e-icon.treeDrop:eq(0)").css({ "display": "inline-block", "position": "absolute" });
                    else
                        $(evt.target).siblings("span.e-icon.treeDrop:eq(0)").length > 0 ? $(evt.target).siblings("span.e-icon.treeDrop:eq(0)").css({ display: "inline-block", "position": "absolute", "top": ($(evt.target).hasClass("filter") ? $(evt.target).position().top - 22 : $(evt.target).position().top + 2), "left": ($(evt.target).hasClass("filter") ? $(evt.target).position().left + (7 - left) : $(evt.target).position().left + (10 - left)) }) : $(evt.target).find("span.e-icon.treeDrop:eq(0)").length > 0 ? $(evt.target).find("span.e-icon.treeDrop:eq(0)").css({ "display": "inline-block", "position": "absolute" }) : $(evt.target).parentsUntil("li").find("span.e-icon.treeDrop:eq(0)").css({ "display": "inline-block", "position": "absolute" });
                }
                else
                    $(evt.target).siblings("span.e-icon.treeDrop:eq(0)").length > 0 ? $(evt.target).siblings("span.e-icon.treeDrop:eq(0)").css({ display: "inline-block", "position": "static", "margin-left": margin }) : $(evt.target).find("span.e-icon.treeDrop:eq(0)").length > 0 ? $(evt.target).find("span.e-icon.treeDrop:eq(0)").css({ "display": "inline-block", "position": "static" }) : $(evt.target).parentsUntil("li").find("span.e-icon.treeDrop:eq(0)").css({ "display": "inline-block", "position": "static" });
                if ($(evt.target).parent().find(".e-measureGroupCDB, .e-folderCDB", (this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne ? "" : ".e-dimensionCDB")).length > 0)
                    $(evt.target).css("cursor", "default");
            }, this))
          .mouseout(ej.proxy(function (evt) {
              $(this._tableTreeObj.element).find("span.e-icon.treeDrop").css({ display: "none" });
          }, this));
            this._on(this.element, "click", ".filterBtn,.filter", ej.proxy(this._filterBtnClickCommon, this));
            this._on(this.element, "click", ".sorting", ej.proxy(this._sortBtnClick, this));
            this._on(this.element, "click", ".e-removeBtn", ej.proxy(this._removePvtBtn, this));
            this._on(this.element, "click", ".e-pvtBtn", ej.proxy(this._filterBtnClickCommon, this));

            this._on(this._tableTreeObj.element, "click", ".treeDrop", ej.proxy(this._filterBtnClickCommon, this));
            this._on(this.element, "click", ".e-memberAscendingIcon, .e-memberDescendingIcon", ej.proxy(ej.Pivot._memberSortBtnClick, this));
            this._on(this.element, "click", ".e-removeClientPivotBtn", ej.proxy(this._removeBtnClick, this));
            this._on(this.element, "click", ".e-removePivotBtn", ej.proxy(this._removeBtnClick, this));

            this._on(this.element, "click", ".e-ascOrder, .e-descOrder", ej.proxy(this._sortField, this));
            this._on(this.element, "click", ".collapseSchema", ej.proxy(this._hideSchemaDesigner, this));
            this._on(this.element, "click", ".expandSchema", ej.proxy(this._showSchemaDesigner, this));
            this._on(this.element, "click", ".e-nextPage, .e-prevPage, .e-firstPage, .e-lastPage", ej.proxy(this._navigateTreeData, this));
            this._on(this.element, "click", ".e-searchEditorTree", ej.proxy(function (evt) {
                ej.Pivot._searchEditorTreeNodes(evt, this);
            }, this));
            if (!(this.element.parents(".e-pivotclient").length > 0))
                $(window).on('resize', $.proxy(this._reSizeHandler, this));
        },

        _navigateTreeData: function (args) {
            ej.Pivot.editorTreeNavigatee(args, this);
        },
        _filterBtnClickCommon: function (args) {
            if (($(args.target).hasClass("e-pvtBtn") && (this.element.parents(".e-pivotclient").length > 0)) || $(args.target).hasClass("treeDrop") || $(args.target).hasClass("filter")) {
                if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode)
                    this._clientOnFilterBtnClick(args);
                else {
                    if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && !ej.isNullOrUndefined($(args.target.nextElementSibling)))
                        if ($(args.target.nextElementSibling).hasClass("treeDrop"))
                            return false;
                        else
                            this._filterBtnClick(args);
                    else
                        this._filterBtnClick(args);
                }
            }
        },

        _unWireEvents: function () {
            this._off(this.element, "click", ".filterBtn, .e-ascOrder, .e-descOrder");
            this._off($(document), 'keydown', this._keyDownPress);
            this._off($(document), 'keyup');
            this._off(this.element.find("a.e-linkPanel"), "click", ej.Pivot._editorLinkPanelClick);
            this._off(this.element, "click", "#preventDiv");
            this._off(this.element, "mouseover", ".e-pivotButton");
            this._off(this.element, "mouseover", ".e-pivotButton .e-pvtBtn");
            this._off(this.element, "mouseleave", ".e-pivotButton");
            this._off(this.element, "click", ".e-memberAscendingIcon, .e-memberDescendingIcon");
            this._off(this.element, "click", ".sorting");
            this._off(this.element, "click", ".filter");
            this._off(this.element, "click", ".e-removeBtn,.e-removeClientPivotBtn");
            this._off(this.element, "mouseover", ".e-schemaFieldTree li");
            this._off(this.element, "mouseout", ".e-schemaFieldTree li");
            this._off(this._tableTreeObj.element, "click", ".treeDrop");
            this._off(this.element, "click", ".e-ascOrder, .e-descOrder", ej.proxy(this._sortField, this));
            this._off(this.element, "click", ".filterBtn");
            this._off(this.element, "click", ".e-pvtBtn")
            this._off(this._tableTreeObj.element, "click", ".treeDrop");
            this._off(this._tableTreeObj.element, "click", "li");
            this._off(this.element, "click", ".e-removeClientPivotBtn, .e-removePivotBtn");
            $(window).off('resize', $.proxy(this._reSizeHandler, this));
            this._off(this.element, "click", ".e-nextPage, .e-prevPage, .e-firstPage, .e-lastPage");
            this._off(this.element, "click", ".e-searchEditorTree");
        },
        _keyDownPress: function (e) {
            if ((e.keyCode === 40 || e.which === 38) && ((!ej.isNullOrUndefined(this.model.pivotControl._curFocus.tab) && this.model.pivotControl._curFocus.tab.hasClass("e-text")) || $("#" + this._id).find(".e-schemaFieldList .e-text:visible").hasClass("e-hoverCell")) && !$(".e-editorTreeView:visible").length > 0 && !$(".pivotTree:visible,.pivotTreeContext:visible,.pivotTreeContextMenu:visible").length > 0) {
                $("#" + this._id).find(".e-hoverCell").removeClass("e-hoverCell");
                this.model.pivotControl._curFocus.tab.mouseleave();
                e.preventDefault();
                var td = $("#" + this._id).find(".e-schemaFieldTree .e-text:visible");
                if (!ej.isNullOrUndefined(this._curFocus.tree)) {
                    this._curFocus.tree.attr("tabindex", "0").removeClass("e-hoverCell").mouseleave();
                    if (e.which === 40) {
                        this._index.tree = this._index.tree + 1 > td.length - 1 ? 0 : this._index.tree + 1;
                    }
                    else if (e.which === 38) {
                        this._index.tree = this._index.tree - 1 < 0 ? td.length - 1 : this._index.tree - 1;
                    }
                    this._curFocus.tree = td.eq(this._index.tree).attr("tabindex", "-1");
                }
                else {
                    this._index.tree = e.which == 40 ? 1 : e.which == 38 ? td.length - 1 : 0;
                    this._curFocus.tree = td.eq(this._index.tree).attr("tabindex", "-1");
                }
                this._curFocus.tree.focus().addClass("e-hoverCell").mouseover();
                $(".e-node-focus").removeClass("e-node-focus");
            }
            else if ((e.which === 40 || e.which === 38 || e.which === 37 || e.which === 39) && !ej.isNullOrUndefined(this.model.pivotControl._curFocus.tab) && this.model.pivotControl._curFocus.tab.hasClass("e-pvtBtn") && !$(".pivotTree:visible,.pivotTreeContext:visible,.pivotTreeContextMenu:visible").length > 0 && document.activeElement.className.startsWith("e-pvtBtn")) {
                e.preventDefault();
                $("#" + this._id).find(".e-hoverCell").removeClass("e-hoverCell");
                if (!ej.isNullOrUndefined(this.model.pivotControl._curFocus.tab)) {
                    this.model.pivotControl._curFocus.tab.mouseleave().attr("tabindex", "0").removeClass("e-hoverCell");
                }
                var td = $("#" + this._id).find(".e-pvtBtn")
                if (!ej.isNullOrUndefined(this._curFocus.button)) {
                    this._curFocus.button.attr("tabindex", "0").removeClass("e-hoverCell").mouseleave();
                    if (e.which === 40 || e.which === 39) {
                        this._index.button = this._index.button + 1 > td.length - 1 ? 0 : this._index.button + 1;
                    }
                    else if (e.which === 38 || e.which === 37) {
                        this._index.button = this._index.button - 1 < 0 ? td.length - 1 : this._index.button - 1;
                    }
                    this._curFocus.button = td.eq(this._index.button);
                }
                else {
                    if (e.which === 40 || e.which === 39) {
                        this._curFocus.button = td.eq(1).attr("tabindex", "-1");
                    }
                    else if (e.which === 38 || e.which === 37) {
                        this._curFocus.button = td.eq(td.length - 1).attr("tabindex", "-1");
                    }
                }
                this._curFocus.button.addClass("e-hoverCell").mouseover().focus();
            }
            else if ((e.keyCode === 40 || e.which === 38) && $("#" + this._id).find(".e-editorTreeView:visible").length > 0 && !ej.isNullOrUndefined($("#" + this._id).find(".e-dialog .e-text")) && $(".e-dialog .e-text").hasClass("e-hoverCell")) {
                $("#" + this._id).find(".e-editorTreeView .e-hoverCell").removeClass("e-hoverCell");
                e.preventDefault();
                var td = $("#" + this._id).find(".e-dialog .e-text:visible");
                if (!ej.isNullOrUndefined(this._curFocus.node)) {
                    this._curFocus.node.attr("tabindex", "0").removeClass("e-hoverCell");
                    if (e.which === 40) {
                        this._index.node = this._index.node + 1 > td.length - 1 ? 0 : this._index.node + 1;
                    }
                    else if (e.which === 38) {
                        this._index.node = this._index.node - 1 < 0 ? td.length - 1 : this._index.node - 1;
                    }
                    this._curFocus.node = td.eq(this._index.node).attr("tabindex", "-1");
                }
                else {
                    this._index.node = e.which == 40 ? 1 : e.which == 38 ? td.length - 1 : 0;
                    this._curFocus.node = td.eq(this._index.node).attr("tabindex", "-1");
                }
                this._curFocus.node.focus().addClass("e-hoverCell");
                $(".e-node-focus").removeClass("e-node-focus");
            }
            if ((e.which === 39 || e.which === 37) && ($("#" + this._id).find(".e-schemaFieldTree .e-text:visible").hasClass("e-hoverCell")) && !$(".e-editorTreeView:visible").length > 0) {
                $("#" + this._id).find(".e-schemaFieldTree .e-hoverCell").parent().find(".e-plus,.e-minus").click();
            }
            else if ((e.which === 39 || e.which === 37) && ($("#" + this._id).find(".e-editorTreeView .e-text:visible").hasClass("e-hoverCell"))) {
                $("#" + this._id).find(".e-editorTreeView .e-hoverCell").parent().find(".e-plus,.e-minus").click();
            }
            else if (e.which === 9 && $("#" + this._id).find(".e-editorTreeView:visible").length > 0) {
                e.preventDefault();
                $("#" + this._id).find(".e-dialog .e-hoverCell").removeClass("e-hoverCell");
                this._curFocus.node = null;
                this._index.node = 0;
                var focEle = [];
                focEle.push($("#" + this._id).find(".e-dialog .e-text").first());
                if (!$("#" + this._id).find(".e-dialogOKBtn:visible").hasClass("e-disable")) {
                    focEle.push($("#" + this._id).find(".e-dialogOKBtn:visible"));
                }
                focEle.push($("#" + this._id).find(".e-dialogCancelBtn:visible"));
                focEle.push($("#" + this._id).find(".e-close:visible"));
                if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.attr("tabindex", "0").removeClass("e-hoverCell");
                    this._index.tab = this._index.tab + 1 > focEle.length - 1 ? 0 : this._index.tab + 1;
                    this._curFocus.tab = focEle[this._index.tab].attr("tabindex", "-1");
                }
                else {
                    this._index.tab = 1;
                    this._curFocus.tab = focEle[this._index.tab].attr("tabindex", "-1");
                }
                this._curFocus.tab.focus().addClass("e-hoverCell");
                e.stopImmediatePropagation();
            }
            if (e.which === 13 && $("#" + this._id).find(".e-hoverCell").length > 0 && !$(".pivotTree:visible,.pivotTreeContext:visible,.pivotTreeContextMenu:visible").length > 0) {
                if ($("#" + this._id).find(".e-dialog:visible").length > 0 || $("#" + this.model.pivotControl._id).find(".e-dialog:visible").length > 0) {
                    var _this = $("#" + this._id).find(".e-dialog:visible").length > 0 ? this : this.model.pivotControl;
                    if ($(e.target).hasClass("e-memberCurrentPage") || $(e.target).hasClass("e-memberCurrentSearchPage") || $(e.target).hasClass("e-memberCurrentDrillPage")) {
                        ej.Pivot.editorTreeNavigatee(e, _this);
                        return;
                    }
                    if ($(e.target).hasClass("searchEditorTreeView")) {
                        ej.Pivot._searchEditorTreeNodes(e, _this);
                        return;
                    }
                    if ($("#" + _this._id).find(".e-dialog .e-hoverCell").parent().find(".e-chkbox-small").length > 0) {
                        $("#" + _this._id).find(".e-dialog .e-hoverCell").parent().find(".e-chkbox-small").click();
                    }
                    else if ($("#" + this.model.pivotControl._id).find(".e-dialog:visible").length == 0) {
                        $("#" + this._id).find(".e-dialog .e-hoverCell").click();
                        this._index.tab = 0;
                        if (!ej.isNullOrUndefined(this._curFocus.tree)) {
                            this._curFocus.tree.attr("tabindex", "-1").focus().mouseover().addClass("e-hoverCell");
                        }
                        else if (!ej.isNullOrUndefined(this.model.pivotControl._curFocus.tab)) {
                            this.model.pivotControl._curFocus.tab.attr("tabindex", "-1").focus().mouseover().addClass("e-hoverCell");
                        }
                    }
                }
                else if ($("#" + this._id).find(".e-schemaFieldTree .e-hoverCell").length > 0) {
                    $("#" + this._id).find(".e-schemaFieldTree .e-hoverCell").parent().find(".e-chkbox-small").click();
                }
                else if ($(".pivotTree:visible,.pivotTreeContext:visible,.pivotTreeContextMenu:visible").length > 0) {
                    if (this._curFocus.button)
                        var tag = this._curFocus.button.parent().attr("data-tag");
                    this.model.pivotControl._curFocus.button = $("#" + this._id).find("[data-tag='" + tag + "'] button");
                    this.model.pivotControl._curFocus.button.attr("tabindex", "-1").focus().addClass("e-hoverCell");
                }
                if ((!($(e.target).hasClass("e-memberCurrentPage") || ($(e.target).hasClass("searchEditorTreeView") && $(e.target).parents(".e-dialog").find(".e-nextPageDiv").length > 0))) || (!($(e.target).hasClass("e-memberCurrentSearchPage") || ($(e.target).hasClass("searchEditorTreeView") && $(e.target).parents(".e-dialog").find(".e-nextPageDiv").length > 0))))
                    e.stopImmediatePropagation();
            }
            if (e.which === 70 && e.ctrlKey) {
                e.preventDefault();
                if ($("#" + this._id).find(".treeDrop").length > 0 && $("#" + this._id).find(".e-hoverCell").length > 0) {
                    $("#" + this._id).find(".e-hoverCell").parent().find(".treeDrop").click();
                }
            }
            if (e.keyCode === 93 && $("#" + this._id).find(".e-hoverCell").length > 0) {
                e.preventDefault();
                var position = { x: $(".e-hoverCell").offset().left + $(".e-hoverCell").outerWidth(), y: $(".e-hoverCell").offset().top + $(".e-hoverCell").outerHeight() };
                $(".e-hoverCell").trigger({ type: 'mouseup', which: 3, clientX: position.x, clientY: position.y, pageX: position.x, pageY: position.y });
            }
            if ((((e.which === 79 || e.which === 67) && e.ctrlKey) || e.which === 27) && $("#" + this._id).find(".e-hoverCell").length > 0) {
                if (e.keyCode == 79 && $("#" + this._id).find(".e-dialog").length > 0) {
                    if (e.ctrlKey) {
                        e.preventDefault();
                        $("#" + this._id).find(".e-dialogOKBtn:visible").click();
                    }
                }
                if (e.keyCode == 67 && $("#" + this._id).find(".e-dialog").length > 0) {
                    if (e.ctrlKey) {
                        e.preventDefault();
                        $("#" + this._id).find(".e-dialogCancelBtn:visible").click();
                    }
                }
                this._index.node = 0;
                $("#" + this._id).find(".e-hoverCell").removeClass("e-hoverCell");
                if (!ej.isNullOrUndefined(this._curFocus.tree)) {
                    this._curFocus.tree.attr("tabindex", "-1").focus().mouseover().addClass("e-hoverCell");
                }
                else if (!ej.isNullOrUndefined(this._curFocus.button)) {
                    this._curFocus.button.attr("tabindex", "-1").focus().mouseover().addClass("e-hoverCell");
                }
                else if (!ej.isNullOrUndefined(this.model.pivotControl._curFocus.tab)) {
                    this.model.pivotControl._curFocus.tab.attr("tabindex", "-1").focus().mouseover().addClass("e-hoverCell");
                }
            }
        },

        _getLocalizedLabels: function (property) {
            return (ej.isNullOrUndefined(ej.PivotSchemaDesigner.Locale[this.locale()]) || ej.PivotSchemaDesigner.Locale[this.locale()][property] == undefined) ? ej.PivotSchemaDesigner.Locale["en-US"][property] : ej.PivotSchemaDesigner.Locale[this.locale()][property];
        },

        _setTableFields: function (items) {
            if (!ej.isNullOrUndefined(items))
                this.model.pivotTableFields = items;
        },

        _setPivotRows: function (items) {
            if (!ej.isNullOrUndefined(items))
                this.model.pivotRows = items;
        },

        _setPivotColumns: function (items) {
            if (!ej.isNullOrUndefined(items))
                this.model.pivotColumns = items;
        },

        _setPivotCalculations: function (items) {
            if (!ej.isNullOrUndefined(items))
                this.model.pivotCalculations = items;
        },

        _setFilters: function (items) {
            if (!ej.isNullOrUndefined(items))
                this.model.filters = items;
        },

        _getSortedHeaders: function () {
            var labels = this.element.find(".descending").parents("label"), headers = "";
            for (var i = 0; i < labels.length; i++)
                headers += $(labels[i]).attr("for").replace("toggleBtn", "") + "##";
            return headers;
        },

        _contextOpen: function (args) {
            if ($(args.target.parentElement).find(".e-measureGroupCDB").length > 0 || $(args.target.parentElement).find(".e-folderCDB").length > 0 || (!(this.element.parents(".e-pivotclient").length > 0) && $(args.target.parentElement).find(".e-dimensionCDB").length > 0) || !$(args.target).hasClass("e-text"))
                return false;
            ej.Pivot.openPreventPanel(this);
            this._selectedMember = $(args.target);
            var menuObj = $("#pivotTreeContext").data('ejMenu');
            if (menuObj)
                menuObj.hideItems(["#e-remove"]);
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                if ($(args.target).find(".e-calcMemberCDB").length > 0)
                    menuObj.showItems(["#e-remove"]);
                if ($(args.target).parents("li:eq(0)").attr("data-tag").toLowerCase().indexOf("[measures]") >= 0) {
                    menuObj.disableItem(this._getLocalizedLabels("AddToFilter"));
                    menuObj.disableItem(this._getLocalizedLabels("AddToRow"));
                    menuObj.disableItem(this._getLocalizedLabels("AddToColumn"));
                    menuObj.enableItem(this._getLocalizedLabels("AddToValues"));
                }
                else {
                    menuObj.disableItem(this._getLocalizedLabels("AddToValues"));
                    $(args.target.parentElement).find(".e-namedSetCDB").length > 0 ? menuObj.disableItem(this._getLocalizedLabels("AddToFilter")) : menuObj.enableItem(this._getLocalizedLabels("AddToFilter"));
                    menuObj.enableItem(this._getLocalizedLabels("AddToRow"));
                    menuObj.enableItem(this._getLocalizedLabels("AddToColumn"));
                }
            }
            else if (this._dataModel == "Pivot") {
                var targetText = args.target.textContent;
                if ($(args.target).hasClass("e-text") && ($(this.element).parents(".e-pivotclient").length > 0 || $.grep(this.model.pivotControl._calculatedField, function (value) { return value.name == targetText; }).length == 0)) {
                    var menuObj = $("#pivotTreeContext").data('ejMenu');
                    menuObj.enable();
                }
                else {
                    var menuObj = $("#pivotTreeContext").data('ejMenu');
                    menuObj.disable();
                }
            }
        },

        _nodeDrag: function (args) {
            this._isDragging = true;
            if (($(args.dragTarget.parentElement).find(".e-measureGroupCDB").length > 0 || $(args.dragTarget.parentElement).find(".e-kpiRootCDB").length > 0 || $(args.dragTarget.parentElement).find(".e-folderCDB").length > 0 || $(args.dragTarget.parentElement).find(".e-dimensionCDB").length > 0) && !($(args.dragTarget.parentElement).find(".e-dimensionCDB").length > 0 && this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne))
                return false;
        },

        _treeContextClick: function (args) {
            var schemaObj = this;
            var pivotClientObj = ($(this.element).parents(".e-pivotclient").length > 0) ? $(this.element).parents(".e-pivotclient").data("ejPivotClient") : null;
            if (!ej.isNullOrUndefined(this._curFocus.tree))
                this._curFocus.tree.attr("tabindex", "-1").focus().addClass("e-hoverCell");
            else if (!ej.isNullOrUndefined(this.model.pivotControl._curFocus.tab))
                this.model.pivotControl._curFocus.tab.attr("tabindex", "-1").focus().addClass("e-hoverCell");
            var droppedPosition = args.text == this._getLocalizedLabels("AddToColumn") ? this.element.find(".e-schemaColumn") : args.text == this._getLocalizedLabels("AddToRow") ? this.element.find(".e-schemaRow") : args.text == this._getLocalizedLabels("AddToValues") ? this.element.find(".e-schemaValue") : args.text == this._getLocalizedLabels("AddToFilter") ? this.element.find(".e-schemaFilter") : "";
            var params = { dropTarget: droppedPosition, droppedElement: this._selectedMember.parent().parent(), target: droppedPosition };
            if (!ej.isNullOrUndefined(pivotClientObj)) {
                pivotClientObj._isTimeOut = true;
                setTimeout(function () {
                    if (pivotClientObj._isTimeOut)
                        schemaObj.model.pivotControl._waitingPopup.show();
                }, 800);
            }
            else
                this.model.pivotControl._waitingPopup.show();
            this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? this._nodeDropped(params) : this._clientOnNodeDropped(params);
        },

        _checkedChange: function (args) {
            var pSchemaObj = $(args.event.target).parents(".e-pivotschemadesigner").data("ejPivotSchemaDesigner");
            var deferButton = $(".btnDeferUpdate").data("ejButton");
            if (args.isChecked) {
                pSchemaObj.model.pivotControl.model.enableDeferUpdate = true;
                deferButton.enable();
            }
            else {
                pSchemaObj.model.pivotControl.model.enableDeferUpdate = false;
                if (pSchemaObj.model.pivotControl._isUpdateRequired)
                    pSchemaObj.model.pivotControl._deferUpdate();
                deferButton.disable();
            }
        },

        _sortBtnClick: function (args) {
            $(args.target).toggleClass("descending");
            if (this.model.pivotControl._dataModel != "Olap" && this.model.pivotControl._dataModel != "XMLA") {
                if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                    ej.PivotAnalysis._valueSorting = null;
                    var fieldName = $(args.target).parents(".e-pivotButton").attr("data-tag").split(":")[1];
                    var axisItems = this.model.pivotControl.model.dataSource[$(args.target).parents(".e-pivotButton").attr("data-tag").split(":")[0].toLowerCase()];
                    var items = $.grep(axisItems, function (item) { return item.fieldName == fieldName });
                    var sortOrder = args.target.className.indexOf("descending") >= 0 ? ej.PivotAnalysis.SortOrder.Descending : ej.PivotAnalysis.SortOrder.Ascending;
                    for (var i = 0; i < items.length; i++) items[i].sortOrder = sortOrder;
                    this.model.pivotControl._populatePivotGrid();
                }
                else if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    this.model.pivotControl._sortBtnClick(args);
                }
            }
        },

        _generateMembers: function (customArgs, args) {
            var data = $(args).find("Axis:eq(0) Tuple"), treeViewData = [], treeNodeInfo = {};
            treeViewData.push({ id: "All", name: "All", checkedStatus: true, tag: "" });
            var reportItem = ej.Pivot.getReportItemByFieldName(this._selectedFieldName, this.model.pivotControl.model.dataSource).item;
            var fitlerItems = (!ej.isNullOrUndefined(reportItem) && !ej.isNullOrUndefined(reportItem.filterItems))  ? reportItem.filterItems.values : [];
            for (var i = 0; i < data.length; i++) {
                var memberUqName = $($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children().children()[0]).text(),
                    memberName = $($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children().children()[1]).text() == "" ? "(Blank)" : $($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children().children()[1]).text(),
                    checkedStatus = (fitlerItems.length > 0) ? (($.inArray(memberUqName.replace('&', "&amp;"), fitlerItems) > -1) ? true : false): true;
                treeNodeInfo = {
                    hasChildren: $(data[i]).find("CHILDREN_CARDINALITY").text() != "0", checkedStatus: checkedStatus,
                    id: memberUqName.replace(/\]*\]/g, '-').replace(/\[*\[/g, '-').replace(/ /g, "_"), name: memberName, tag: memberUqName, level: parseInt($(data[i]).find("LNum").text()) };
                treeViewData.push(treeNodeInfo);
            }
            if (!ej.isNullOrUndefined(this._waitingPopup)) {
                var pivotClientObj = ($(this.element).parents(".e-pivotclient").length > 0) ? $(this.element).parents(".e-pivotclient").data("ejPivotClient") : null;
                if (!ej.isNullOrUndefined(pivotClientObj)) pivotClientObj._isTimeOut = false;
                this._waitingPopup.hide();
            }
            this._editorTreeData = treeViewData;
            this.model.pivotControl._currentReportItems.push({ filterItems: treeViewData, fieldName: this._selectedFieldName, dataSrc: this.model.pivotControl.model.dataSource, pageSettings: this._memberCount });
            if (!ej.isNullOrUndefined(this.model.pivotControl) && this.model.pivotControl.model.enableMemberEditorPaging) {
                this._memberCount = ej.DataManager(this._editorTreeData).executeLocal(ej.Query().where(ej.Predicate("pid", "equal", null).and("id", "notequal", "All"))).length;
                var treeData = ej.DataManager(this._editorTreeData).executeLocal(ej.Query().where("pid", "equal", null || undefined).page(this._memberPageSettings.currentMemeberPage, this.model.pivotControl.model.memberEditorPageSize + 1));
                this._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(treeData) });
            }
            else
                this._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(treeViewData) });

        },
        _generateChildMembers: function (customArgs, args) {
            var data = $(args).find("Axis:eq(0) Tuple"), treeViewData = [];
            var pNode = this.element.find("[data-tag='" + customArgs.currentNode.replace(/&amp;/g, "&") + "']");
            for (var i = 0; i < data.length; i++) {
                var memberUqName = $($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children().children()[0]).text();
                var memberName = $($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children()).find("Caption").text();
                var treeNodeInfo = { hasChildren: $(data[i]).find("CHILDREN_CARDINALITY").text() != "0", checkedStatus: false, id: memberUqName.replace(/\]*\]/g, '-').replace(/\[*\[/g, '-'), name: memberName, tag: memberUqName, level: $(data[i]).find("LNum").text() }
                treeViewData.push(treeNodeInfo);
            }
            if ($(pNode).parents("li").length > 1)
                parentNode = $(pNode).parents("li").first();
            else
                parentNode = $(pNode).parents("li");
            pNode.find(".e-load").removeClass("e-load");
            $($(parentNode).find('input.nodecheckbox')[0]).ejCheckBox({ checked: false })
            $.each(pNode.find("li"), function (index, value) { value.setAttribute("data-tag", treeViewData[index].tag); });
            this._memberTreeObj = $(".e-editorTreeView").data("ejTreeView");
            this._memberTreeObj.addNode(ej.Pivot._showEditorLinkPanel(treeViewData, this, this.model.pivotControl), $(pNode));
        },

        _sortField: function (args) {
            ej.Pivot.closePreventPanel(this);
            this.element.find(".e-dialog, .e-clientDialog").remove();

            if (($(args.element).attr("id") == "descOrder" || $(args.element).attr("id") == "ascOrder")) {
                var reportItem = ej.Pivot.getReportItemByFieldName(this._selectedFieldName, this.model.pivotControl.model.dataSource).item;
                if (!ej.isNullOrUndefined(reportItem))
                    ($(args.element).attr("id") == "descOrder") ? reportItem["sortOrder"] = ej.olap.SortOrder.Descending : reportItem["sortOrder"] = ej.olap.SortOrder.Ascending;

                if (this.model.pivotControl && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                    this.model.pivotControl.refreshControl();
                else {
                    ej.olap.base._clearDrilledCellSet();
                    ej.olap.base.getJSONData({ action: "sorting" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
                }
            }
        },

        _clientOnFilterBtnClick: function (args) {
            ej.Pivot.openPreventPanel(this);
            var schemaObj = this;
            this._isAllMemberChecked = true;
            var pivotClientObj = ($(this.element).parents(".e-pivotclient").length > 0) ? $(this.element).parents(".e-pivotclient").data("ejPivotClient") : null;

            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                if ($(args.target).parents().hasClass("e-pivotButton") && $(args.target).parents(".e-pivotButton").attr("data-tag").indexOf(":[") >= 0 && !($(args.target).parents(".e-pivotButton").attr("data-tag").toLowerCase().indexOf("[measures]") >= 0)) {
                    this._selectedFieldName = $(args.target).parents(".e-pivotButton").attr("data-tag").split(":")[1];
                }
                else if ($(args.target).parents().attr("data-tag") != null && ($(args.target).parents().attr("data-tag").split(":")[1] == "Measures" || $(args.target).parent().attr("data-tag").toLowerCase().indexOf("[measures]") >= 0)) {
                    ej.Pivot.closePreventPanel(this);

                    if (!ej.isNullOrUndefined(pivotClientObj)) {
                        pivotClientObj._isTimeOut = false;
                        var name = ($(args.target).parents().hasClass("e-pivotButton") && $(args.target).parents(".e-pivotButton").attr("data-tag")) ? $(args.target).parents(".e-pivotButton").attr("data-tag").split(":")[1] : "";
                        if (name) {
                            name = name.split("].[").length > 1 ? name.split("].[")[1].replace("]", "") : "";
                            var calcMember = $.map((this.model.pivotControl.model.calculatedMembers), function (item) {
                                if ((name.indexOf("[")>-1 && name.indexOf(item.caption) > -1)|| (item.caption == name))
                                    return item
                            });
                            if (calcMember.length > 0) {
                                pivotClientObj._selectedCalcMember = calcMember[0].caption;
                                var treeData = this.element.find(".e-schemaFieldTree").data("ejTreeView").model.fields.dataSource, blankNode = [];
                                treeData = $.grep(treeData, function (item, index) {
                                    if (item.id)
                                        item.id = item.id.replace(/\]/g, '_').replace(/\[/g, '_').replace(/\./g, '_').replace(/ /g, '_');
                                    if (item.pid)
                                        item.pid = item.pid.replace(/\]/g, '_').replace(/\[/g, '_').replace(/\./g, '_').replace(/ /g, '_');
                                    if (item.spriteCssClass.indexOf("e-level") > -1) {
                                        blankNode.push({ id: item.id + "_1", pid: item.id, name: "(Blank)", hasChildren: false, spriteCssClass: "" });
                                    }
                                    return item;
                                });
                                treeData = $.merge(blankNode, treeData);
                                this._selectedFieldName = $(args.currentTarget).attr("data-fieldname");
                                var calcTreeview = { CubeTreeInfo: JSON.stringify(treeData) };
                                ej.Pivot._createCalcMemberDialog(calcTreeview, this.model.pivotControl);
                            }
                        }
                        clearTimeout(null);
                        schemaObj._waitingPopup.hide();
                    }
                    return false;
                }
                else {
                    this._selectedLevel = $($(args.target).parents("li:eq(0)")).attr("data-tag");
                    this._selectedFieldName = ($(args.target).parents("li:eq(0)").children("div:eq(0)").find(".levels").length > 0) ? $($(args.target).parents("li:eq(1)")).attr("data-tag") : $($(args.target).parents("li:eq(0)")).attr("data-tag");
                }

                var isCalcMember = false;
                if (!ej.isNullOrUndefined(pivotClientObj)) {
                    var name = ($(args.target).parents().hasClass("e-pivotButton") && $(args.target).parents(".e-pivotButton").attr("data-tag")) ? $(args.target).parents(".e-pivotButton").attr("data-tag").split(":")[1] : "";
                    var calcMember = $.map((this.model.pivotControl.model.calculatedMembers), function (item) {
                        if ((name.indexOf("[")>-1 && name.indexOf(item.caption) > -1)||(item.caption == name))
                            return item
                    });
                    if (calcMember.length > 0) {
                        isCalcMember = true;
                        this._selectedFieldName = name;
                    }
                    if (!isCalcMember) {
                        pivotClientObj._isTimeOut = true;
                        setTimeout(function () {
                            if (pivotClientObj._isTimeOut)
                                schemaObj._waitingPopup.show();
                        }, 800);
                    }
                }
                else
                    this._waitingPopup.show();


                if (ej.isNullOrUndefined(this._selectedFieldName) || this._selectedFieldName.toLocaleLowerCase().indexOf("measures") >= 0)
                    return false;

                var hierarchyName = this._selectedFieldName, currentDataSrc = this.model.pivotControl.model.dataSource, pageSettings;
                var filteredData = $.map(this.model.pivotControl._currentReportItems, function (obj, index) {
                    if (obj["fieldName"] == hierarchyName && (ej.isNullOrUndefined(obj.dataSrc) || (obj.dataSrc.cube == currentDataSrc.cube && obj.dataSrc.reportName == currentDataSrc.reportName))) {
                        pageSettings = obj.pageSettings;
                        return $.map(obj.filterItems, function (itm) { if (itm.expanded) itm.expanded = false; return itm; });
                    }
                });

                if (this.model.pivotControl.model.enableMemberEditorPaging) {
                    if (pageSettings)
                        this._memberCount = pageSettings;
                    this._memberPageSettings.endPage = this.model.pivotControl.model.memberEditorPageSize;
                    this._memberPageSettings.startPage = 0;
                    this._memberPageSettings.currentMemeberPage = 1;
                }
                if (filteredData.length > 0 && !isCalcMember) {
                    this._editorTreeData = filteredData;
                    if (this.model.pivotControl.model.enableMemberEditorPaging) {
                        this._memberCount = ej.DataManager(this._editorTreeData).executeLocal(ej.Query().where(ej.Predicate("pid", "equal", null).and("id", "notequal", "All"))).length;
                        filteredData = ej.DataManager(this._editorTreeData).executeLocal(ej.Query().where("pid", "equal", null || undefined).page(this._memberPageSettings.currentMemeberPage, this.model.pivotControl.model.memberEditorPageSize + 1));
                    }
                    this._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(filteredData) });
                }
                else {
                    var fieldName = this._selectedFieldName;
                    if ($(this.element).parents(".e-pivotclient").length > 0 && this.model.pivotControl.model.calculatedMembers.length > 0) {
                        var calcMember = $.map((this.model.pivotControl.model.calculatedMembers), function (item) {
                            if ((fieldName.indexOf("[")>-1 && fieldName.indexOf(item.caption) > -1)|| (item.caption == fieldName))
                                return item
                        });
                        if (calcMember.length > 0) {
                            this._selectedFieldName = ($(args.target).parents().hasClass("e-pivotButton") && $(args.target).parents(".e-pivotButton").attr("data-tag")) ? $(args.target).parents(".e-pivotButton").attr("data-tag").split(":")[1] : "";
                            this.model.pivotControl._selectedCalcMember = calcMember[0].caption;
                            var treeData = this.element.find(".e-schemaFieldTree").data("ejTreeView").model.fields.dataSource, blankNode = [];
                            treeData = $.grep(treeData, function (item, index) {
                                if (item.id)
                                    item.id = item.id.replace(/\]/g, '_').replace(/\[/g, '_').replace(/\./g, '_').replace(/ /g, '_');
                                if (item.pid)
                                    item.pid = item.pid.replace(/\]/g, '_').replace(/\[/g, '_').replace(/\./g, '_').replace(/ /g, '_');
                                if (item.spriteCssClass.indexOf("e-level") > -1) {
                                    blankNode.push({ id: item.id + "_1", pid: item.id, name: "(Blank)", hasChildren: false, spriteCssClass: "" });
                                }
                                return item;
                            });
                            treeData = $.merge(blankNode, treeData);
                            this._selectedFieldName = $(args.currentTarget).attr("data-fieldname");
                            var calcTreeview = { CubeTreeInfo: JSON.stringify(treeData) };
                            ej.Pivot._createCalcMemberDialog(calcTreeview, this.model.pivotControl);
                            return false;
                        }
                        else
                            ej.olap._mdxParser.getMembers(this.model.pivotControl.model.dataSource, this._selectedFieldName, this);
                    }
                    else
                        ej.olap._mdxParser.getMembers(this.model.pivotControl.model.dataSource, this._selectedFieldName, this);
                }
            }
            else {
                if (($(args.target).parent().hasClass("e-pivotButton") || $(args.target).parent().hasClass("pvtBtnDiv")) && $(args.target).parent().attr("data-tag").indexOf(":") >= 0)
                    this._selectedFieldName = $.grep(this.model.pivotTableFields, function (item) { return item.name == $(args.target).parent().attr("data-tag").split(":")[1]; })[0].name;
                else
                    this._selectedFieldName = $.grep(this.model.pivotTableFields, function (item) { return item.id.replace(/ /g, '_') == $($(args.target).closest("li")).attr("id"); })[0].name;
            }
            var pivotBtn = $(this.element.find(".e-pivotButton button[data-fieldName='" + this._selectedFieldName + "']"));
            this._dialogHead = this._selectedFieldCaption = pivotBtn.attr("data-fieldCaption") || pivotBtn.attr("data-fieldName");;
            this._selectedFieldAxis = pivotBtn.parents().hasClass("e-schemaRow") ? "rows" : pivotBtn.parents().hasClass("e-schemaColumn") ? "columns" : pivotBtn.parents().hasClass("e-schemaValue") ? "values" : "filters";

            if ((this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)) {
                if (this.model.pivotControl.model.enableMemberEditorPaging) {
                    this._memberPageSettings.endPage = this.model.pivotControl.model.memberEditorPageSize;
                    this._memberPageSettings.startPage = 0;
                    this._memberPageSettings.currentMemeberPage = 1;
                    var filteredData = this._getTreeViewData();
                    this._editorTreeData = filteredData;
                    this._memberCount = ej.DataManager(this._editorTreeData).executeLocal(ej.Query().where("id", "notequal", "All")).length;
                    filteredData = ej.DataManager(this._editorTreeData).executeLocal(ej.Query().page(this._memberPageSettings.currentMemeberPage, this.model.pivotControl.model.memberEditorPageSize + 1));
                    this._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(filteredData) });
                }
                else
                    this._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(this._getTreeViewData()) });
            }
        },

        _getTreeViewData: function () {
            var axisItems = this.model.pivotControl.model.dataSource[this._selectedFieldAxis];
            var fieldName = this._selectedFieldName;
            var item = $.grep(axisItems, function (item) { return item.fieldName == fieldName; })[0];
            var members = ej.PivotAnalysis.getMembers(fieldName);
            var treeViewData = [{ id: "All", name: "All", checkedStatus: true }];
            if (item.filterItems != null && item.filterItems != undefined)
                for (var i = 0; i < members.length; i++) treeViewData.push({ id: members[i], name: members[i], checkedStatus: item.filterItems.filterType == ej.PivotAnalysis.FilterType.Include ? $.inArray(members[i], item.filterItems.values) >= 0 : $.inArray(members[i], item.filterItems.values) < 0 });
            else
                for (var i = 0; i < members.length; i++) treeViewData.push({ id: members[i], name: members[i], checkedStatus: true });
            return treeViewData;
        },
        _filterBtnClick: function (args) {
            this.model.pivotControl._editorFlag = false;
            this._isAllMemberChecked = true;
            ej.Pivot.openPreventPanel(this);
            var schemaObj = this;
            var pivotClientObj = ($(this.element).parents(".e-pivotclient").length > 0) ? $(this.element).parents(".e-pivotclient").data("ejPivotClient") : null;
            if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                var fieldName, fieldCaption;
                if (this.model.pivotControl._dataModel == "XMLA") {
                    if ($(args.target).parents("li:eq(0)").length > 0) {
                        this._selectedLevel = $($(args.target).parents("li:eq(0)")).attr("data-tag");
                        fieldName = ($(args.target).parents("li:eq(0)").children("div:eq(0)").find(".levels").length > 0) ? $($(args.target).parents("li:eq(1)")).attr("data-tag") : $($(args.target).parents("li:eq(0)")).attr("data-tag");
                    }
                    else {
                        this._selectedLevel = $(args.target).parent().attr("data-tag").split(":")[1];
                        fieldName = $(args.target).parent().attr("data-tag").split(":")[1];
                    }
                }
                else
                    fieldName = $.grep(this.model.pivotTableFields, function (item) { return item.caption == $($(args.target).parent()).text(); })[0].name;
                for (var i = 0; i < this.element.find(".e-pivotButton").length; i++) {
                    uniqueName = $(this.element.find(".e-pivotButton")[i]).find("button").attr("data-fieldName");
                    if (uniqueName == fieldName) {
                        fieldCaption = $(this.element.find(".e-pivotButton")[i]).find("button").text();
                        this._selectedAxis = $(this.element.find(".e-pivotButton")[i]).parent()[0].className.split(" ")[0];
                        break;
                    }

                }
                this._selectedAxis = this.model.pivotControl._selectedAxis = this._selectedAxis == "e-schemaRow" ? "rows" : this._selectedAxis == "e-schemaColumn" ? "columns" : this._selectedAxis == "e-schemaValue" ? "values" : "filters";
                this._dialogTitle = this.model.pivotControl._dialogTitle = fieldCaption;
                this._dialogHead = this.model.pivotControl._dialogHead = fieldCaption;
                this._selectedMember = this.model.pivotControl._selectedField = fieldName;

                if (this.model.pivotControl._dataModel == "XMLA") {
                    if ($(args.target).parents("li:eq(0)").length > 0) {
                        var currentHierarchy = $(args.currentTarget).parents("li:eq(0)").attr("data-tag");//this._selectedMember = $(args.currentTarget.parentNode).attr("data-tag").split(":")[1];
                    }
                    else {
                        var currentHierarchy = $(args.target).parent().attr("data-tag").split(":")[1];
                    }
                    var filteredData = $.map(this.model.pivotControl._currentReportItems, function (obj, index) { if (obj["fieldName"] == currentHierarchy) return $(obj["filterItems"], function (itm) { if (itm.expanded) itm.expanded = false; return itm; }); });
                    if (filteredData.length > 0) {
                        this._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(filteredData) });
                        this._editorTreeData = filterData;
                    }
                    else {
                        //if (!ej.isNullOrUndefined(this._waitingPopup))
                        //    this._waitingPopup.show();
                        this._selectedMember = fieldName;
                        //var reportItem = this.model.pivotControl.getReportItemByFieldName(fieldName), conStr;
                        //parsedMDX = "select {" + ((reportItem.item.length > 0 && reportItem["item"][0]["hasAllMember"]) ? fieldName + ".levels(0).members" : fieldName + ".children") + "} dimension properties CHILDREN_CARDINALITY on 0 from [" + $.trim(this.model.pivotControl.model.dataSource.cube) + "]";
                        //conStr = this.model.pivotControl._getConnectionInfo(this.model.pivotControl.model.dataSource.data);
                        //pData = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"> <Header></Header> <Body> <Execute xmlns=\"urn:schemas-microsoft-com:xml-analysis\"> <Command> <Statement> " + parsedMDX + " </Statement> </Command> <Properties> <PropertyList> <Catalog>" + this.model.pivotControl.model.dataSource.catalog + "</Catalog> <LocaleIdentifier>"+conStr.LCID+"</LocaleIdentifier></PropertyList> </Properties> </Execute> </Body> </Envelope>";
                        //this.doAjaxPost("POST", conStr.url, { XMLA: pData }, this._generateMembers, null, { action: "fetchMembers" });
                    }
                }
                else {
                    var treeViewData = this.model.pivotControl._getTreeViewData(fieldName, fieldCaption, this._selectedAxis);
                    this._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(treeViewData) });
                }
            }
            else {
                $(this._tableTreeObj.element).find("span.e-icon.treeDrop").css({ display: "none" });
                var hierarClass, selectedNd;
                if (this._dataModel == "Olap") {
                    if ($(args.target).attr("class").indexOf("filter") > -1) {
                        for (var i = 0; i < this.model.pivotTableFields.length; i++) {
                            if ((this.model.pivotTableFields[i].tag.replace(/\[/g, "").replace(/\]/g, "").indexOf("Measures") > -1 && this.model.pivotTableFields[i].isSelected == true) || (this.model.pivotTableFields[i].isSelected == true && $(args.target.parentElement).attr("data-tag").split(":")[1] == this.model.pivotTableFields[i].tag.replace(/\[/g, "").replace(/\]/g, "")))
                                hierarClass = this.model.pivotTableFields[i].spriteCssClass;
                        }
                        for (var f = 0; f < this._tableTreeObj.element.find("li").length; f++) {
                            if ($($(args.target).parent()).attr("data-tag").split(":")[1] == $(this._tableTreeObj.element.find("li")[f]).attr("data-tag").replace(/\]/g, '').replace(/\[/g, ''))
                                selectedNd = $(this._tableTreeObj.element.find("li")[f]);
                        }
                    }
                    else
                        hierarClass = $(args.target).parent().find("a>span").attr("class");
                    if (!($(args.target).attr("class").indexOf("filter") > -1)) {
                        if (hierarClass.indexOf("e-hierarchyCDB") > -1 || hierarClass.indexOf("e-attributeCDB") > -1) {
                            selectedNd = $(args.target).parents("li")[0];
                        }
                        else {
                            selectedNd = $(args.target).parents("li").attr("data-tag") == "KPI" ? $(args.target).parents("li") : $(args.target).parents("li")[1];
                        }
                    }
                }
                else
                    if (!($(args.target).attr("class").indexOf("filter") > -1))
                        selectedNd = $($(args.target).parent()).parent();
                    else
                        selectedNd = this._tableTreeObj.element.find("li:contains('" + $($(args.target).parent()).attr("data-tag").split(":")[1] + "')");
                this._selectedTreeNode = selectedNd;
                if (args.target.tagName.toLowerCase() == "span" || args.target.tagName.toLowerCase() == "button") {
                    this.model.layout != "excel" && $(args.target).attr("class").indexOf("filter") > -1 ? this._curFilteredText = $($(args.target).parents(".e-pivotButton")).attr("data-tag").split(":")[1].replace(/\]/g, '').replace(/\[/g, '') : this._curFilteredText = this._dataModel == "Olap" ? $(selectedNd).attr("data-tag").replace(/\]/g, '').replace(/\[/g, '') : $(selectedNd).attr("id");
                    if ($(this.element).parents(".e-pivotclient").length > 0) this._curFilteredText = $($(args.target).parents(".e-pivotButton")).attr("data-tag").split(":")[1].replace(/\]/g, '').replace(/\[/g, '');
                    if ($(args.target).parents("li:eq(1)").find("div:first>a>span").hasClass("e-hierarchyCDB")) {
                        this._curFilteredText = $(args.target).parents("li:eq(1)").find("div:first>a").text();
                    }
                    if (this._dataModel == "Pivot") {
                        // this._curFilteredAxis = !ej.isNullOrUndefined(this.element.find(".e-btn[fieldName='" + this._curFilteredText + "']").parents(".e-droppable")[0]) ? this.element.find(".e-btn[fieldName='" + this._curFilteredText + "']").parents(".e-droppable")[0].className.split(" ")[0] : "";
                        if ($(this.element).parents(".e-pivotclient").length > 0) {
                            this._curFilteredAxis = $(selectedNd)[0].className.split(" ")[0];
                            this.model.pivotControl._curFilteredText = this._curFilteredText;
                        }
                        else
                            this._curFilteredAxis = !ej.isNullOrUndefined(this.element.find(".e-btn:contains('" + ($(this.element).parents(".e-pivotclient").length > 0 ? $(selectedNd).text() : $(selectedNd).find("div:first").text()) + "')").parents(".e-droppable")[0]) ? this.element.find(".e-btn:contains('" + $(selectedNd).find("div:first").text() + "')").parents(".e-droppable")[0].className.split(" ")[0] : "";
                        this._dialogHead = $(args.target).attr("data-fieldCaption") || this._curFilteredText;
                    }
                    this._dialogTitle = this._dataModel == "Olap" ? $(this.element.find(".e-pivotButton:contains('" + $(selectedNd).find("div:first").text() + "')")[0]).attr("data-tag") : $(args.target).parents("li").length > 0 ? $(args.target).parents("li").attr("id") || args.target.id.replace("filterBtn", "") || $(args.target).parents(".filterBtn")[0].id.replace("filterBtn", "") : $(args.target).parent().attr("data-tag").split(":")[1] || args.target.id.replace("filterBtn", "") || $(args.target).parents(".filterBtn")[0].id.replace("filterBtn", "");
                    if ($(this.element).parents(".e-pivotclient").length > 0 && $(selectedNd)[0].className.split(" ")[0] == "e-schemaFilter" && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                        this._dialogTitle = this._curFilteredText;
                    if (this._dataModel == "Olap")
                        for (var btnCount = 0 ; btnCount < this.element.find(".e-btn").length; btnCount++) {
                            if (!ej.isNullOrUndefined($($($(this.element.find(".e-btn"))[btnCount]).parent()[0]).attr("data-tag")) && $($($(this.element.find(".e-btn"))[btnCount]).parent()[0]).attr("data-tag").split(":")[1] == $(this._selectedTreeNode).attr("data-tag").replace(/\]/g, '').replace(/\[/g, '') && $($($(this.element.find(".e-btn"))[btnCount]).parent()[0]).attr("data-tag").indexOf(this._curFilteredText) > -1) {
                                this._curFilteredAxis = !ej.isNullOrUndefined($($(this.element.find(".e-btn"))[0]).parents(".e-droppable")[0]) ? $($(this.element.find(".e-btn"))[btnCount]).parents(".e-droppable")[0].className.split(" ")[0] : "";
                                this._dialogTitle = $($($(this.element.find(".e-btn"))[btnCount]).parent()[0]).attr("data-tag");
                                this._dialogHead = $($($(this.element.find(".e-btn"))[btnCount])[0]).attr("data-fieldCaption") || $($($(this.element.find(".e-btn"))[btnCount])[0]).attr("title");
                                break;
                            }
                        }
                    var report;
                    try {
                        report = JSON.parse(this.model.pivotControl.getOlapReport()).Report;
                    }
                    catch (err) {
                        if (!ej.isNullOrUndefined(this.model.pivotControl.getOlapReport))
                            report = this.model.pivotControl.getOlapReport();
                    }
                    var sortedHeaders = this._getSortedHeaders();
                    this._isFilterBtnClick = true;
                    var controlObj = !ej.isNullOrUndefined(pivotClientObj) ? pivotClientObj : this;
                    if (controlObj.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        controlObj._trigger("beforeServiceInvoke", { action: "fetchMembers", element: controlObj.element, customObject: this.model.pivotControl.model.customObject });
                    var eventArgs = JSON.stringify({ "action": "fetchMembers", "headerTag": (this._dialogTitle + ((this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) && this.model.pivotControl.model.enableAdvancedFilter ? "##true" : "")) || "UniqueName##" + $(selectedNd).attr("data-tag"), "sortedHeaders": this.model.pivotControl._ascdes, "currentReport": report, "valueSorting": JSON.stringify(this.model.pivotControl.model.valueSortSettings), "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    if (!ej.isNullOrUndefined(pivotClientObj)) {
                        pivotClientObj._isTimeOut = true;
                        setTimeout(function () {
                            if (pivotClientObj._isTimeOut)
                                schemaObj.model.pivotControl._waitingPopup.show();
                        }, 800);
                    }
                    else
                        this.model.pivotControl._waitingPopup.show();
                    this.element.find(".schemaNoClick").addClass("freeze").width($(this.element).width()).height($(this.element).height()).css({ "top": $(this.element).offset().top, "left": $(this.element).offset().left });
                    this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.fetchMembers, eventArgs, this.model.pivotControl.model.enableMemberEditorPaging ? ej.Pivot._fetchMemberPageSuccess : this._fetchMemberSuccess);
                }
            }
        },

        _removeBtnClick: function (args) {
            var schemaObj = this;
            var pivotClientObj = ($(this.element).parents(".e-pivotclient").length > 0) ? $(this.element).parents(".e-pivotclient").data("ejPivotClient") : null;
            if (!ej.isNullOrUndefined(pivotClientObj)) {
                pivotClientObj._isTimeOut = true;
                setTimeout(function () {
                    if (pivotClientObj._isTimeOut)
                        schemaObj.model.pivotControl._waitingPopup.show();
                }, 800);
            }
            else
                this.model.pivotControl._waitingPopup.show();
            if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                ej.PivotAnalysis._valueSorting = null;
                var currentFieldName = $(args.target).parent().attr("data-tag").split(":")[1];
                ej.Pivot.removeReportItem(this.model.pivotControl.model.dataSource, currentFieldName, (currentFieldName.toLocaleLowerCase().indexOf("measures") == 0));
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    this.model.pivotControl._fieldMembers = {};
                    this.model.pivotControl._fieldSelectedMembers = {};
                    ej.olap.base.clearDrilledItems(this.model.pivotControl.model.dataSource, { action: "nodeDropped" }, this.model.pivotControl)
                }
                if (this.model.pivotControl.element.hasClass("e-pivotclient") && this.model.pivotControl._pivotChart)
                    this.model.pivotControl._pivotChart._labelCurrentTags = {};
                this._refreshPivotButtons();
                this.model.pivotControl.refreshControl();
                $(args.target).parent().remove();
            }
            else {
                var headerText = $(args.target.parentElement).find("button").attr("data-fieldName") || $(args.target.parentElement).text(), headerTag,
                selectedTreeNode = $($(this._tableTreeObj.element).find("div:contains(" + headerText + ")>span")[1]).find(".e-chk-act");

                $(selectedTreeNode).removeClass("e-chk-act").addClass("e-chk-inact");
                $(selectedTreeNode).children("e-checkmark").removeClass("e-checkmark");
                for (var i = 0; i < this.model.pivotTableFields.length; i++) {
                    if (this.model.pivotTableFields[i].id == headerText) {
                        this.model.pivotTableFields[i].IsSelected = false;
                        headerTag = this.model.pivotTableFields[i];
                    }
                }
                $(args.target.parentElement).remove();
                if ($(this.element).parents(".e-pivotclient").length > 0) {
                    var tagText = $(args.target).parent().attr("data-tag");
                    delete this.model.pivotControl._fieldMembers[tagText.split(':')[tagText.split(':').length - 1]];
                    delete this.model.pivotControl._fieldSelectedMembers[tagText.split(':')[tagText.split(':').length - 1]];
                }
                this._clearFilterData(headerText);
                var controlObj = !ej.isNullOrUndefined(pivotClientObj) ? pivotClientObj : this;
                if (controlObj.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                    controlObj._trigger("beforeServiceInvoke", { action: "nodeStateModified", element: controlObj.element, customObject: this.model.pivotControl.model.customObject });
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && $(this.element).parents(".e-pivotclient").length > 0) {
                    var report;
                    try { report = JSON.parse(this.model.pivotControl.getOlapReport()).Report; }
                    catch (err) {
                        if (!ej.isNullOrUndefined(this.model.pivotControl.getOlapReport))
                            report = this.model.pivotControl.getOlapReport();
                    }
                    var eventArgs = JSON.stringify({ "action": "removeButton", "args": JSON.stringify({ "headerTag": headerText, "currentReport": report, "sortedHeaders": (!ej.isNullOrUndefined(this.model.pivotControl._ascdes) ? this.model.pivotControl._ascdes : "") }) + "-##-" + JSON.stringify(this.model.pivotControl.model.valueSortSettings), "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs, this._droppedSuccess);
                }
                else {
                    var eventArgs = JSON.stringify({ "action": "nodeStateModified", "headerTag": JSON.stringify(headerTag), "sortedHeaders": this._getSortedHeaders(), "currentReport": this.model.pivotControl.getOlapReport(), "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeStateModified, eventArgs, this._nodeStateModifiedSuccess);
                }
            }
            if (!ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                if (!ej.isNullOrUndefined(pivotClientObj)) pivotClientObj._isTimeOut = false;
        },

        _nodeCheckChanges: function (args) {
            if (this._onDemandNodeExpand) {
                this._isFiltered = true;
                var schemaObj = this;
                var treeElement = this.element.find(".e-editorTreeView");
                var searchElement = null;
                var isUnChecked = (!ej.isNullOrUndefined(args.model.id) && args.model.id.toLowerCase() == "allelement" && !args.isChecked) || ((!ej.isNullOrUndefined(args.id) && (args.id.toLowerCase() == "(all)_0" || args.id.toLowerCase() == "all")) && (!ej.isNullOrUndefined(args.type) && (args.type == "nodeUncheck")));
                var isChecked = (!ej.isNullOrUndefined(args.model.id) && args.model.id.toLowerCase() == "allelement" && args.isChecked) || ((!ej.isNullOrUndefined(args.id) && (args.id.toLowerCase() == "(all)_0" || args.id.toLowerCase() == "all")) && (!ej.isNullOrUndefined(args.type) && (args.type == "nodeCheck")));
                
                if (isUnChecked) {
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
                    else if (!ej.isNullOrUndefined(this.model.pivotControl) && this.model.pivotControl.model.enableMemberEditorPaging && $(treeElement).find("li span.e-searchfilterselection").length > 0) {
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
                    if (this.model.pivotControl && this.model.pivotControl.model.enableMemberEditorPaging || this._editorTreeData.length > 0) {
                        this.element.find(".e-dialogOKBtn").attr('disabled', 'disabled');
                        this._isAllMemberChecked = false;
                        if (this._editorSearchTreeData.length > 0)
                            for (var i = 0; i < this._editorSearchTreeData.length; i++) {
                                $(this._editorTreeData).each(function (index, item) {
                                    if (schemaObj._editorSearchTreeData[i].id == item.id) {
                                        schemaObj._editorSearchTreeData[i].checkedStatus = false;
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
                                schemaObj._dialogOKBtnObj.enable();
                                schemaObj.element.find(".e-dialogOKBtn").removeAttr("disabled");
                                return false;
                            }
                        });
                    }

                }
                else if (isChecked) {
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
                    else if (!ej.isNullOrUndefined(this.model.pivotControl) && this.model.pivotControl.model.enableMemberEditorPaging && $(treeElement).find("li span.e-searchfilterselection").length > 0) {
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
                    if (this.model.pivotControl && this.model.pivotControl.model.enableMemberEditorPaging || this._editorTreeData.length > 0) {
                        this.element.find(".e-dialogOKBtn").removeAttr("disabled");
                        this._isAllMemberChecked = true;
                        if (this._editorSearchTreeData.length > 0)
                            for (var i = 0; i < this._editorSearchTreeData.length; i++) {
                                $(this._editorTreeData).each(function (index, item) {
                                    if (schemaObj._editorSearchTreeData[i].id == item.id) {
                                        schemaObj._editorSearchTreeData[i].checkedStatus = true;
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
                    ej.Pivot._updateSearchFilterSelection(args, treeElement, schemaObj);
                }
                else if (((!ej.isNullOrUndefined(args.model.id) && args.model.id.toLowerCase() == "allelement") || (!ej.isNullOrUndefined(args.id) && (args.id.toLowerCase() == "(all)_0" || args.id.toLowerCase() != "all"))) && !ej.isNullOrUndefined(this.model.pivotControl) && (this.model.pivotControl.model.enableMemberEditorPaging || this._editorTreeData.length > 0)) {
                    if (args.type == "nodeUncheck") {
                        this.model.pivotControl._isMembersFiltered = true;
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
                            this.element.find(".e-checkAllBox").find("span.e-chk-image").removeClass("e-stop").removeClass("e-checkmark").addClass("e-chk-inact");
                        }
                        else {
                            $(this._memberTreeObj.element.find("li:first")).find("span.e-chk-image").removeClass("e-stop").addClass("e-checkmark");
                            this.element.find(".e-checkAllBox").find("span.e-chk-image").removeClass("e-stop").addClass("e-checkmark");
                            $(this._editorTreeData).each(function (index, item) {
                                if (item.checkedStatus) {
                                    this._isAllMemberChecked = false;
                                    $(schemaObj._memberTreeObj.element.find("li:first")).find("span.e-chk-image").removeClass("e-checkmark").addClass("e-stop");
                                    return false;
                                }
                            });
                        }
                    }
                    else if (args.type == "nodeCheck") {
                        this.model.pivotControl._isMembersFiltered = true;
                        ej.Pivot._memberPageNodeCheck(args, this);
                        this.element.find(".e-dialogOKBtn").data("ejButton").enable();
                        this.element.find(".e-dialogOKBtn").removeAttr("disabled");
                        this._isAllMemberChecked = true;
                        $(this._memberTreeObj.element.find("li:first")).find("span.e-chk-image").removeClass("e-stop").addClass("e-checkmark");
                        this.element.find(".e-checkAllBox").find("span.e-chk-image").removeClass("e-stop").addClass("e-checkmark");
                        $(this._editorTreeData).each(function (index, item) {
                            if (!item.checkedStatus) {
                                this._isAllMemberChecked = false;
                                $(schemaObj._memberTreeObj.element.find("li:first")).find("span.e-chk-image").removeClass("e-checkmark").addClass("e-stop");
                                return false;
                            }
                        });
                    }
                }
                else if (((!ej.isNullOrUndefined(args.model.id) && args.model.id.toLowerCase() == "allElement") || (!ej.isNullOrUndefined(args.id) && (args.id.toLowerCase() == "(all)_0" || args.id.toLowerCase() != "all")))) {
                    var uncheckedNodes = this._memberTreeObj.element.find(":input:gt(0).nodecheckbox:not(:checked)"),
                    firstNode = $(this._memberTreeObj.element.find("li:first")).find("span.e-chk-image");
                    if (uncheckedNodes.length == 0 || (uncheckedNodes.length == 1 && uncheckedNodes[0].id[uncheckedNodes[0].id.length - 1] == 0)) {
                        $(firstNode).parent().removeClass("e-chk-inact").removeClass("e-chk-ind").addClass("e-chk-act");
                        firstNode.removeClass("e-stop").addClass("e-checkmark");
                        this.element.find(".e-checkAllBox").find("span.e-chk-image").removeClass("e-stop").addClass("e-checkmark");
                    }
                    else if (args.type == "nodeCheck" && uncheckedNodes.length == 1 && uncheckedNodes[0].id[uncheckedNodes[0].id.length - 1] == 0) {
                        firstNode.removeClass("e-stop").addClass("e-checkmark");
                        this.element.find(".e-checkAllBox").find("span.e-chk-image").removeClass("e-stop").addClass("e-checkmark");
                    }
                    else if (uncheckedNodes.length > 0) {
                        firstNode.removeClass("e-checkmark").addClass("e-stop");
                        this.element.find(".e-checkAllBox").find("span.e-chk-image").removeClass("e-checkmark").addClass("e-stop");
                    }
                    this._dialogOKBtnObj.enable();
                    if (args.type == "nodeUncheck") {
                        if (uncheckedNodes.length + 1 == this._memberTreeObj.element.find("li").length || (this._isOptionSearch && ($(treeElement).find("li span.e-searchfilterselection").closest("li").find("span.e-checkmark").length > 0) && this._memberTreeObj.element.find(":input:gt(0).nodecheckbox:checked").length == 1)) {
                            firstNode.removeClass("e-checkmark").removeClass("e-stop");
                            this.element.find(".e-checkAllBox").find("span.e-chk-image").removeClass("e-checkmark").removeClass("e-stop");
                            this._dialogOKBtnObj.disable();
                        }
                    }
                }
            }
        },
        _pivotCheckedStateModified: function (args) {
            if (this._nodeCheck == true) {
                this._nodeCheck = false;
                return false;
            }
            if (this._isDropAction)
                return false;
            ej.PivotAnalysis._valueSorting = null;
            var headerName = this.model.pivotControl._dataModel == "XMLA" ? $(args.currentElement).attr("data-tag") : this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? $.grep(this.model.pivotTableFields, function (item) { return item.caption == $(args.currentElement).find("a")[0].textContent; })[0].name : $(args.currentElement).find("a")[0].textContent,
			headerCaption = $(args.currentElement).find("a")[0].textContent, filterTag = "", filterItems = "", selectedElement = "", headerTag = "", uniqueName = "", report = "", isClientMode = this.model.pivotControl._dataModel == "XMLA" ? "XMLA" : "";
            var selectedElement = new Array();
            for (var i = 0; i < this.element.find(".e-pivotButton").length; i++) {
                uniqueName = $(this.element.find(".e-pivotButton")[i]).find("button").attr("data-fieldName");
                if (uniqueName == headerName) {
                    selectedElement.push(this.element.find(".e-pivotButton")[i]);
                    if (isClientMode == "XMLA")
                        break;
                }
            }
            for (var i = 0; i < this.model.pivotTableFields.length; i++) {
                if (this.model.pivotTableFields[i].name == headerName && args.type == "nodeCheck") {
                    this.model.pivotTableFields[i].isSelected = true;
                    headerTag = this.model.pivotTableFields[i];
                }
                else if (this.model.pivotTableFields[i].name == headerName && args.type == "nodeUncheck") {
                    this.model.pivotTableFields[i].isSelected = false;
                    headerTag = this.model.pivotTableFields[i];
                }
            }
            if (args.type == "nodeUncheck") {
                if (selectedElement.length > 1)
                    for (var i = 0; i < selectedElement.length; i++) {
                        if ($(selectedElement[i]).find('button').attr('fieldName') == headerName)
                            $(selectedElement[i]).remove();
                    }
                else
                    $(selectedElement).remove();
            }
            try {
                report = JSON.parse(this.model.pivotControl.getOlapReport()).Report;
            }
            catch (err) {
                if (!ej.isNullOrUndefined(this.model.pivotControl.getOlapReport))
                    report = this.model.pivotControl.getOlapReport();
            }
            if (isClientMode == "XMLA" && report == "") {
                report = this.model.pivotControl.model.dataSource;
                this._selectedMember = headerName;
                this._selectedTreeNode = $(args.currentElement);
                this.model.pivotControl.dataSource = this.model.pivotControl._clearDrilledItems(this.model.pivotControl.model.dataSource, { action: "nodeStateModefied" });
            }
            var dropAxis = this._droppedClass != "" ? this._droppedClass : headerTag.pivotType != undefined ? headerTag.pivotType == "PivotItem" ? "e-schemaRow" : "e-schemaValue" : "e-schemaRow", eventArgs, axisName, params;
            this._droppedClass = "";

            if (args.type == "nodeCheck") {
                if (isClientMode == "XMLA") {
                    headerCaption = $(args.currentElement).find(".kpi").length > 0 ? $(args.currentElement).parents("li:eq(0)").children("div").text() + " " + headerCaption : headerCaption;
                    var liElement = this.model.pivotControl.model.dataSource.enableAdvancedFilter ? $(args.currentElement.find(".e-text")) : $(args.currentElement.find(".e-text")[0]);
                    (($(args.currentElement).attr("data-tag").toLowerCase().indexOf("[measures]") < 0) && !($(args.currentElement).find(".e-namedSetCDB").length > 0)) ? liElement.after(ej.buildTag("span.e-icon").css("display", "none").addClass("treeDrop")[0].outerHTML) : "";
                    if ($(args.currentElement).attr("data-tag").toLocaleLowerCase().indexOf("[measures]") >= 0)
                        dropAxis = "e-schemaValue";
                    droppedItem = $(args.currentElement).find(".e-namedSetCDB").length > 0 ? { fieldName: $(args.currentElement).attr("data-tag"), fieldCaption: $(args.currentElement).text(), isNamedSets: true } : ej.olap.base._getCaption({ fieldName: headerName, fieldCaption: headerCaption }, this.model.pivotControl._fieldData.hierarchy);
                }
                else {
                    $(args.currentElement.find(".e-text")[0]).after(ej.buildTag("span.e-icon").css("display", "none").addClass("treeDrop")[0].outerHTML);
                    droppedItem = { fieldName: headerName, fieldCaption: headerCaption };
                }
                dropAxis = dropAxis == "" ? "row" : dropAxis == "e-schemaColumn" ? "column" : dropAxis == "e-schemaRow" ? "row" : dropAxis == "e-schemaValue" ? "value" : dropAxis == "e-schemaFilter" ? "filter" : "";

                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    var dropItem = $.grep(this.model.pivotControl._calculatedField, function (value) { return value.name == headerName; });
                    if (dropItem.length > 0) {
                        if (this._calculatedFieldItems(dropItem))
                            return;
                        dropAxis = "value";
                        droppedItem = { fieldName: headerName, fieldCaption: headerCaption, isCalculatedField: true, formula: dropItem[0].formula };
                    }
                }

                this._createPivotButton(droppedItem, dropAxis, "", "", "");

                if (isClientMode == "XMLA" && dropAxis == "value") {
                    if (this.model.pivotControl.model.dataSource.values.length == 0) {
                        this.model.pivotControl.model.dataSource.values.push(({ measures: [], axis: "columns" }))
                    }
                    measuresAxis = this.model.pivotControl.model.dataSource.values[0]["axis"] == "columns" ? "Columns:" : "Rows:";
                    if ((this.element.find("div[data-tag='" + measuresAxis + "Measures" + "']").length == 0))
                        this._createPivotButton({ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }, measuresAxis == "Columns:" ? "column" : "row", "", "", "");
                    this.model.pivotControl.model.dataSource.values[0]["measures"].push(droppedItem)
                }
                else {
                    if ($.grep(this.model.pivotControl.model.dataSource.values, function (value) { return value.fieldName == droppedItem.fieldName; }).length == 0)
                        dropAxis == "row" ? this.model.pivotControl.model.dataSource.rows.push(droppedItem) : dropAxis == "column" ? this.model.pivotControl.model.dataSource.columns.push(droppedItem) : dropAxis == "filter" ? this.model.pivotControl.model.dataSource.filters.push(droppedItem) : this.model.pivotControl.model.dataSource.values.push(droppedItem);
                }
                if (isClientMode == "XMLA") {
                    if (!ej.isNullOrUndefined(this.model.pivotControl._ogridWaitingPopup))
                        this.model.pivotControl._ogridWaitingPopup.show();
                    ej.olap.base.getJSONData({ action: "nodeCheck" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
                }
                else {
                    this._trigger("fieldItemDropped", { axis: dropAxis, fieldItem: args.currentElement });
                    this.model.pivotControl.model.editCellsInfo = {};
                    this.model.pivotControl._populatePivotGrid();
                }
            }
            else if (args.type == "nodeUncheck") {
                $(args.currentElement).removeClass("filter").find(".filter").remove();
                $(args.currentElement).removeClass("filter").find(".treeDrop").remove();
                this.model.pivotControl.model.dataSource.columns = $.grep(this.model.pivotControl.model.dataSource.columns, function (value) { return value.fieldName != headerName; });
                this.model.pivotControl.model.dataSource.rows = $.grep(this.model.pivotControl.model.dataSource.rows, function (value) { return value.fieldName != headerName; });
                var valueElements = this.model.pivotControl.model.dataSource.values;
                if (isClientMode == "XMLA") {
                    if ((ej.olap._mdxParser._getItemPosition(this.model.pivotControl.model.dataSource.values[0]["measures"], headerName)).length > 0)
                        this.model.pivotControl.model.dataSource.values[0]["measures"].splice(ej.olap._mdxParser._getItemPosition(this.model.pivotControl.model.dataSource.values[0]["measures"], headerName)[0], 1);
                    if (this.model.pivotControl.model.dataSource.values[0]["measures"].length == 0)
                        this.element.find("div[data-tag='" + (this.model.pivotControl.model.dataSource.values[0]["axis"] == "columns" ? "Columns" : "Rows") + ":Measures" + "']").remove();
                }
                else {
                    this.model.pivotControl.model.dataSource.values = $.grep(valueElements, function (value) { return value.fieldName != headerName; });
                    if (this.model.pivotControl._calculatedField.length > 0) {
                        var removeElement = $.grep(this.model.pivotControl.model.dataSource.values, function (value) { return value.isCalculatedField == true && value.formula.indexOf(headerName) > -1; });
                        for (var i = 0; i < removeElement.length; i++)
                            this._tableTreeObj.uncheckNode(removeElement[i].fieldName);
                    }
                }
                this.model.pivotControl.model.dataSource.filters = $.grep(this.model.pivotControl.model.dataSource.filters, function (value) { return value.fieldName != headerName; });

                if (isClientMode == "XMLA") {
                    if (!ej.isNullOrUndefined(this.model.pivotControl._ogridWaitingPopup))
                        this.model.pivotControl._ogridWaitingPopup.show();
                    ej.olap.base.getJSONData({ action: "nodeUncheck" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
                }
                else {
                    dropAxis = dropAxis == "" ? "row" : dropAxis == "e-schemaColumn" ? "column" : dropAxis == "e-schemaRow" ? "row" : dropAxis == "e-schemaValue" ? "value" : dropAxis == "e-schemaFilter" ? "filter" : "";
                    this._trigger("fieldItemDropped", { axis: dropAxis, fieldItem: args.currentElement });
                    this.model.pivotControl.model.editCellsInfo = {};
                    this.model.pivotControl._populatePivotGrid();
                }
            }
            this._setPivotBtnWidth();
        },

        _calculatedFieldItems: function (dropItem) {
            if (dropItem.length > 0) {
                var items = dropItem[0].formula.replace(/\(|\)/g, " ").replace(/[-+*/^%]/g, " ").split(" ");
                for (var k = 0; k < items.length; k++) {
                    if (!$.isNumeric(items[k]) && items[k].replace(/\s+|\s+$/gm, "") != "")
                        if ((this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && $.grep(this.model.pivotControl.model.dataSource.values, function (value) { return value.fieldName == items[k] }).length == 0) || (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && $.grep(JSON.parse(this.model.pivotControl.getOlapReport()).PivotCalculations, function (value) { return value.FieldName == items[k] }).length == 0)) {
                            alert(this.model.pivotControl._getLocalizedLabels("NotPresent"));
                            this._tableTreeObj.model.nodeCheck = null;
                            this._tableTreeObj.model.nodeUncheck = null;
                            this._tableTreeObj.uncheckNode(dropItem[0].name);
                            this._tableTreeObj.model.nodeCheck = this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? ej.proxy(this._checkedStateModified, this) : ej.proxy(this._pivotCheckedStateModified, this);
                            this._tableTreeObj.model.nodeUncheck = this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? ej.proxy(this._checkedStateModified, this) : ej.proxy(this._pivotCheckedStateModified, this);
                            return true;
                        }
                }
            }
            return false;
        },

        _checkedStateModified: function (args) {
            this.model.pivotControl._isUpdateRequired = true;
            if (this._isMeasureBtnRemove == true) {
                this._isMeasureBtnRemove = false;
                return false;
            }
            if (this._nodeCheck == true) {
                this._nodeCheck = false;
                return false;
            }
            var headerText = $(args.currentElement).find("a")[0].textContent, filterTag = "", filterItems = "", selectedElement = "", headerTag = "", uniqueName = "";
            if (this._dataModel == "Pivot" && args.type == "nodeCheck") {
                var dropItem = $.grep(this.model.pivotControl._calculatedField, function (value) { return value.name == $(args.currentElement).attr("id"); });
                if (this._calculatedFieldItems(dropItem))
                    return;
            }
            if (this._dataModel == "Olap") {
                var curElement;
                if (!args.currentElement[0].id.indexOf("[Measures]") > -1)
                    for (var i = 0; i < this.element.find(".e-pivotButton").length; i++) {
                        if (args.type == "nodeCheck" && !ej.isNullOrUndefined($(args.currentElement).attr("data-parentuniquename")) && !ej.isNullOrUndefined($(this.element.find(".e-pivotButton")[i]).find(".e-btn")) && !ej.isNullOrUndefined($(this.element.find(".e-pivotButton")[i]).find(".e-btn").attr("data-parentuniquename")) && $(this.element.find(".e-pivotButton")[i]).find(".e-btn").attr("data-parentuniquename") == $(args.currentElement).attr("data-parentuniquename")) {
                            var dlgContent = this._getLocalizedLabels("NamedSetAlert").replace("<Set 1>", $(this.element.find(".e-pivotButton")[i]).find(".e-btn").text()).replace("<Set 2>", $(args.currentElement).find(".e-text").text());
                            var dialogElem = ej.buildTag("div.data-namedSetDialog#NamedSetDialog", ej.buildTag("div.data-namedSetDialogContent", dlgContent)[0].outerHTML + ej.buildTag("div", ej.buildTag("button#OKBtn.e-okBtn", "OK", { "margin": "20px 0 10px 120px" }).attr("title", "OK")[0].outerHTML + ej.buildTag("button#CancelBtn.e-cancelBtn", "Cancel", { "margin": "20px 0 10px 10px" }).attr("title", "Cancel")[0].outerHTML)[0].outerHTML).attr("title", "Warning")[0].outerHTML;
                            this.model.pivotControl.element.append(dialogElem);
                            var removeEle = $(this.element.find(".e-pivotButton")[i]);
                            this.model.pivotControl.element.find(".data-namedSetDialog").ejDialog({
                                target: "#" + this.model.pivotControl._id, enableResize: false, enableRTL: false, width: "400px", close: function (arg) {
                                    controlObj._nodeCheck = true;
                                    controlObj._tableTreeObj.uncheckNode(args.currentElement);
                                }
                            });
                            var controlObj = this;
                            this.model.pivotControl.element.find(".e-okBtn,.e-cancelBtn").ejButton({ type: ej.ButtonType.Button, width: "70px" });
                            this.model.pivotControl.element.find(".e-cancelBtn").on(ej.eventType.click, function (e) {
                                controlObj._nodeCheck = true;
                                controlObj._tableTreeObj.uncheckNode(args.currentElement);
                                controlObj.model.pivotControl.element.find(".e-dialog").remove();
                            });
                            this.model.pivotControl.element.find(".e-okBtn").on(ej.eventType.click, function (e) {
                                controlObj._currentCheckedNode = headerTag = $(args.currentElement).attr("data-tag");
                                var dropAxis = controlObj._droppedClass != "" && controlObj._droppedClass != undefined ? controlObj._droppedClass : headerTag.pivotType != undefined ? headerTag.pivotType == "PivotItem" ? "e-schemaRow" : "e-schemaValue" : "e-schemaRow";
                                controlObj._nodeDropedParams = dropAxis == "e-schemaColumn" ? "Categorical" : dropAxis == "e-schemaRow" ? "Series" : dropAxis == "e-schemaFilter" ? "Slicer" : "";
                                axisName = controlObj._nodeDropedParams == "" ? ($(args.currentElement).attr("data-tag").indexOf("[Measures]") >= 0 ? "Categorical" : "Series") : controlObj._nodeDropedParams;
                                try {
                                    report = JSON.parse(controlObj.model.pivotControl.getOlapReport()).Report;
                                }
                                catch (err) {
                                    if (!ej.isNullOrUndefined(controlObj.model.pivotControl.getOlapReport))
                                        report = controlObj.model.pivotControl.getOlapReport();
                                }
                                var removeTag = $(removeEle).attr("data-tag"), uniqueName = controlObj.model.pivotControl._getNodeUniqueName(removeTag), selectedTreeNode = controlObj.model.pivotControl._getNodeByUniqueName(uniqueName);
                                this._nodeCheck = true;
                                controlObj._tableTreeObj.uncheckNode(selectedTreeNode);
                                params = controlObj._currentCubeName + "--" + headerTag + "--" + axisName + "--" + "##" + $(removeEle).attr("data-tag"), report;
                                if (controlObj.model.beforeServiceInvoke != null && controlObj.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                                    controlObj._trigger("beforeServiceInvoke", { action: "nodeDropped", element: controlObj.element, customObject: controlObj.model.pivotControl.model.customObject });
                                eventArgs = JSON.stringify({ "action": "nodeDroppedNamedSet", "dropType": "TreeNode", "nodeInfo": params, "currentReport": report, "gridLayout": controlObj.model.pivotControl.model.layout, "customObject": JSON.stringify(controlObj.model.pivotControl.model.customObject) });
                                if (!controlObj.model.pivotControl.model.enableDeferUpdate)
                                    controlObj.doAjaxPost("POST", controlObj.model.pivotControl.model.url + "/" + controlObj.model.serviceMethods.nodeDropped, eventArgs, controlObj._droppedSuccess);
                                else {
                                    controlObj.doAjaxPost("POST", controlObj.model.pivotControl.model.url + "/" + controlObj.model.serviceMethods.nodeDropped, eventArgs.replace("nodeDropped", "nodeDroppedDeferUpdate"), controlObj._droppedSuccess);
                                }
                            });
                            return 0;
                        }
                        headerTag = $(this.element.find(".e-pivotButton")[i]).attr("data-tag"); uniqueName = "";
                        uniqueName = ((headerTag.indexOf("[Measures]") > -1) || (headerTag.indexOf("[") > -1)) ? headerTag.split(":")[1] : this.model.pivotControl._getNodeUniqueName(headerTag);
                        uniqueName = uniqueName.replace("<>", ".");
                        curElement = ($(args.currentElement).attr("data-tag") == "Value" || $(args.currentElement).attr("data-tag") == "Goal" || $(args.currentElement).attr("data-tag") == "Status" || $(args.currentElement).attr("data-tag") == "Trend") ? ("[" + $(args.currentElement).parents("ul:eq(1) li:eq(0)").attr("data-tag") + "]") : $(args.currentElement).attr("data-tag");
                        if (curElement.toLowerCase() == uniqueName.toLowerCase()) {
                            selectedElement = $(this.element.find(".e-pivotButton")[i]);
                            break;
                        }
                    }
                else
                    selectedElement = this.element.find(".e-pivotButton:contains(" + headerText + ")"), headerTag, report;
            }
            else
                selectedElement = this.element.find(".e-pivotButton:contains(" + headerText + ")"), headerTag, report;
            var isFiltered = selectedElement.length > 0 && $(selectedElement).siblings(".e-filterIndicator").length > 0 ? true : false,
            isSorted = args.currentElement.find("~ span:eq(0) span.descending").length > 0 ? true : false;
            for (var i = 0; i < this.model.pivotTableFields.length; i++) {
                if (this.model.pivotTableFields[i].name == headerText && args.type == "nodeCheck") {
                    this.model.pivotTableFields[i].isSelected = true;
                    headerTag = this.model.pivotTableFields[i];
                }
                else if (this.model.pivotTableFields[i].name == headerText && args.type == "nodeUncheck") {
                    this.model.pivotTableFields[i].isSelected = false;
                    headerTag = this.model.pivotTableFields[i];
                }
            }
            if (ej.isNullOrUndefined(headerTag))
                headerTag = $(args.currentElement).attr("data-tag");

            if (args.type == "nodeUncheck") {
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    this._clearFilterData(headerText);
                }
                if (selectedElement.length > 1)
                    for (var i = 0; i < selectedElement.length; i++) {
                        if ($(selectedElement[i]).text() == headerText)
                            $(selectedElement[i]).remove();
                    }
                else
                    $(selectedElement).remove();
            }
            else {
                if (this._droppedClass != "")
                    this._createPivotButton({ fieldName: headerTag.id, fieldCaption: headerText }, this._droppedClass == "e-schemaColumn" ? "column" : this._droppedClass == "e-schemaRow" ? "row" : this._droppedClass == "e-schemaValue" ? "value" : this._droppedClass == "e-schemaFilter" ? "filter" : "", isFiltered, isSorted, "");
                else
                    this._createPivotButton({ fieldName: headerTag.id, fieldCaption: headerText }, ((this._dataModel == "Olap" && $(args.currentElement).attr("data-tag").indexOf("[Measures]") < 0) || (this._dataModel == "Pivot" && headerTag.pivotType == "PivotItem")) ? "row" : "value", isFiltered, isSorted, "");
            }
            if (!ej.isNullOrUndefined(this._tempFilterData)) {
                for (var i = 0; i < this._tempFilterData.length; i++) {
                    if (!ej.isNullOrUndefined(this._tempFilterData[i][headerTag.id])) {
                        for (var j = 0; j < this._tempFilterData[i][headerTag.id].length; j++)
                            filterItems += "##" + this._tempFilterData[i][headerTag.id][j];
                    }
                }
            }
            try {
                report = JSON.parse(this.model.pivotControl.getOlapReport()).Report;
            }
            catch (err) {
                if (!ej.isNullOrUndefined(this.model.pivotControl.getOlapReport))
                    report = this.model.pivotControl.getOlapReport();
            }
            filterTag = "e-schemaRow::" + headerText + "::FILTERED" + filterItems;
            var dropAxis = this._droppedClass != "" ? this._droppedClass : headerTag.pivotType == "PivotItem" ? "e-schemaRow" : "e-schemaValue", eventArgs, axisName, params;
            this._droppedClass = "";
            if (!ej.isNullOrUndefined(this.model.pivotControl) && !ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                this.model.pivotControl._waitingPopup.show();
            this.element.find(".schemaNoClick").addClass("freeze").width($(this.element).width()).height($(this.element).height()).css({ "top": $(this.element).offset().top, "left": $(this.element).offset().left });
            if (!(args.type == "nodeCheck") && !(args.type == "nodeUncheck") && dropAxis != "") {
                if (this._dataModel == "Pivot") {
                    if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this._trigger("beforeServiceInvoke", { action: "nodeStateModified", element: this.element, customObject: this.model.pivotControl.model.customObject });
                    eventArgs = JSON.stringify({ "action": "nodeStateModified", "headerTag": JSON.stringify(headerTag), "dropAxis": dropAxis + "::" + this._droppedPosition, "sortedHeaders": this.model.pivotControl._ascdes, "filterParams": filterTag, "currentReport": report, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    this._droppedPosition = "";
                    if (!this.model.pivotControl.model.enableDeferUpdate)
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeStateModified, eventArgs, this._nodeStateModifiedSuccess);
                    else {
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeStateModified, eventArgs.replace("nodeStateModified", "nodeStateModifiedDeferUpdate"), this._nodeStateModifiedSuccess);
                    }
                }
                else {
                    if ($(args.currentElement).attr("data-tag").toLowerCase().indexOf("[measures]") == -1) {
                        var dropSpan = ej.buildTag("span.e-icon").attr("role", "button").attr("aria-label", "filter button").addClass("treeDrop")[0].outerHTML;
                        $(args.currentElement.find(".e-text")[0]).after($(dropSpan).hide());
                    }
                    headerTag = $(args.currentElement).attr("data-tag");
                    axisName = this._nodeDropedParams == "" ? ($(args.currentElement).attr("data-tag").toLowerCase().indexOf("[Measures]") >= 0 ? "Categorical" : "Series") : this._nodeDropedParams;
                    params = this._currentCubeName + "--" + headerTag + "--" + axisName + "--", report;
                    if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.pivotControl.model.customObject });
                    eventArgs = JSON.stringify({ "action": "nodeDropped", "dropType": "TreeNode", "nodeInfo": params, "currentReport": report, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    if (!this.model.pivotControl.model.enableDeferUpdate)
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs, this._droppedSuccess);
                    else {
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs.replace("nodeDropped", "nodeDroppedDeferUpdate"), this._droppedSuccess);
                    }
                }
            }
            else if (args.type == "nodeCheck") {
                if (this._dataModel == "Olap") {
                    if ($(args.currentElement).attr("data-tag").indexOf("[Measures]") == -1 && $(args.currentElement).find(".e-namedSetCDB").length == 0) {
                        var dropSpan = ej.buildTag("span.e-icon").attr("role", "button").attr("aria-label", "filter button").addClass("treeDrop")[0].outerHTML;
                        $(args.currentElement.find(".e-text")[0]).after($(dropSpan).hide());
                    }
                    this._nodeDropedParams = dropAxis == "e-schemaColumn" ? "Categorical" : dropAxis == "e-schemaRow" ? "Series" : dropAxis == "e-schemaFilter" ? "Slicer" : "";
                    this._currentCheckedNode = headerTag = $(args.currentElement).attr("data-tag");
                    axisName = this._nodeDropedParams == "" ? ($(args.currentElement).attr("data-tag").indexOf("[Measures]") >= 0 ? "Categorical" : "Series") : this._nodeDropedParams;
                    if (headerTag.toLowerCase().indexOf("[measures]") > -1)
                        axisName = "Categorical";
                    params = this._currentCubeName + "--" + headerTag + "--" + axisName + "--", report;
                    if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.pivotControl.model.customObject });
                    eventArgs = JSON.stringify({ "action": "nodeDropped", "dropType": "TreeNode", "nodeInfo": params, "currentReport": report, "gridLayout": this.model.pivotControl.model.layout, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    if (!this.model.pivotControl.model.enableDeferUpdate)
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs, this._droppedSuccess);
                    else {
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs.replace("nodeDropped", "nodeDroppedDeferUpdate"), this._droppedSuccess);
                    }
                }
                else {
                    $(args.currentElement.find(".e-text")[0]).after($(ej.buildTag("span.e-icon").attr("role", "button").attr("aria-label", "filter button").addClass("treeDrop")[0].outerHTML).hide());
                    if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this._trigger("beforeServiceInvoke", { action: "nodeStateModified", element: this.element, customObject: this.model.pivotControl.model.customObject });
                    eventArgs = JSON.stringify({ "action": "nodeStateModified", "headerTag": JSON.stringify(headerTag), "dropAxis": dropAxis + "::", "sortedHeaders": this.model.pivotControl._ascdes, "filterParams": filterTag, "currentReport": report, "valueSorting": JSON.stringify(this.model.pivotControl.model.valueSortSettings), "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    if (!this.model.pivotControl.model.enableDeferUpdate)
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeStateModified, eventArgs, this._nodeStateModifiedSuccess);
                    else {
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeStateModified, eventArgs.replace("nodeStateModified", "nodeStateModifiedDeferUpdate"), this._nodeStateModifiedSuccess);
                        if (!ej.isNullOrUndefined(this.model.pivotControl._ogridWaitingPopup))
                            this.model.pivotControl._ogridWaitingPopup.hide();
                    }
                }
            }
            else if (args.type == "nodeUncheck") {
                if (this._dataModel == "Olap") {
                    $(args.currentElement.find(".treeDrop")).remove();
                    // $(args.currentElement.find(".e-icon:not(.e-chk-image, .e-plus,.e-minus)")).remove();
                    $(args.currentElement).find(".filter").removeClass("filter");
                    var headerTag = this._currentCheckedNode = $(selectedElement).attr("data-tag"), report, eventArgs;
                    delete this.model.pivotControl._fieldMembers[headerTag.split(':')[headerTag.split(':').length - 1]];
                    delete this.model.pivotControl._fieldSelectedMembers[headerTag.split(':')[headerTag.split(':').length - 1]];
                    if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this._trigger("beforeServiceInvoke", { action: "removeButton", element: this.element, customObject: this.model.pivotControl.model.customObject });
                    eventArgs = JSON.stringify({ "action": "removeButton", "headerInfo": headerTag, "currentReport": report, "gridLayout": this.model.pivotControl.model.layout, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    if (ej.isNullOrUndefined(headerTag))
                        return false;
                    if ((headerTag.indexOf("[Measures]") >= 0 || headerTag.toLowerCase().indexOf("[measures]"))) {
                        var tmp = headerTag.split(":"),
                        tempAxis = tmp[0] == "Rows" ? ".e-schemaRow" : tmp[0] == "Columns" ? ".e-schemaColumn" : "";
                        if (this.element.find(".e-schemaValue .e-pivotButton [data-tag*='Measures']").length <= 0)
                            this.element.find(tempAxis + " .e-pivotButton:contains('Measures')").remove();
                    }
                    else if (headerTag.indexOf("[Measures]") < 0 && headerTag.indexOf("Measures") >= 0)
                        this.element.find(".e-schemaValue .e-pivotButton").remove();
                    if (!this.model.pivotControl.model.enableDeferUpdate)
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.removeButton, eventArgs, this._pvtBtnDroppedSuccess)
                    else {
                        this._removeButtonDeferUpdate = true;
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.removeButton, eventArgs.replace("removeButton", "removeButtonDeferUpdate"), this._droppedSuccess)
                    }
                }
                else {
                    this._clearFilterData(headerTag.id);
                    if (this.model.pivotControl._calculatedField.length > 0) {
                        var removeElement = $.grep(JSON.parse(this.model.pivotControl.getOlapReport()).PivotCalculations, function (value) { return value.CalculationType == 8 && value.Formula.indexOf(headerTag["id"]) > -1; })
                        for (var i = 0; i < removeElement.length; i++) {
                            this._tableTreeObj.model.nodeUncheck = null;
                            this._tableTreeObj.uncheckNode(removeElement[i].FieldName);
                            this._tableTreeObj.element.find("li[id='" + removeElement[i].FieldName + "']").removeClass("filter").find(".treeDrop").remove()
                            this._tableTreeObj.model.nodeUncheck = ej.proxy(this._checkedStateModified, this);
                        }
                    }
                    delete this.model.pivotControl._fieldMembers[headerTag.name];
                    $(args.currentElement).removeClass("filter").find(".filter").remove();
                    $(args.currentElement).removeClass("filter").find(".treeDrop").remove();
                    this.model.pivotControl._ascdes = this.model.pivotControl._ascdes.replace(headerText + "##", "");
                    if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this._trigger("beforeServiceInvoke", { action: "nodeStateModified", element: this.element, customObject: this.model.pivotControl.model.customObject });
                    eventArgs = JSON.stringify({ "action": "nodeStateModified", "headerTag": JSON.stringify(headerTag), "dropAxis": dropAxis + "::", "sortedHeaders": this.model.pivotControl._ascdes, "filterParams": filterTag, "currentReport": report, "valueSorting": JSON.stringify(this.model.pivotControl.model.valueSortSettings), "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    if (!this.model.pivotControl.model.enableDeferUpdate)
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeStateModified, eventArgs, this._nodeStateModifiedSuccess);
                    else {
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeStateModified, eventArgs.replace("nodeStateModified", "nodeStateModifiedDeferUpdate"), this._nodeStateModifiedSuccess);
                        if (!ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                            this.model.pivotControl._waitingPopup.hide();
                    }
                }
            }
            else {
                ej.Pivot.closePreventPanel(this);
                this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
            }
            this._setPivotBtnWidth();
        },

        _clearFilterData: function (headerText) {
            if (!ej.isNullOrUndefined(this._tempFilterData)) {
                for (var j = 0; j < this._tempFilterData.length; j++) {
                    for (var key in this._tempFilterData[j]) {
                        if (key == headerText && this._tempFilterData[j][headerText] != "") {
                            this._tempFilterData.splice(j, 1);
                        }
                    }
                }
            }
            this.model.pivotControl._tempFilterData = this._tempFilterData;
        },

        _nodeDropped: function (args) {
            if ($(args.dropTarget).hasClass("e-pvtBtn"))
                args.dropTarget = $(args.dropTarget).parents('div.e-droppable').length > 0 && $(args.dropTarget).parents('.e-pivotschemadesigner').length > 0 ? $(args.dropTarget).parents('div.e-droppable') : args.dropTarget;
            if ($(this.element).parents(".e-pivotclient").length > 0 && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                var headerTag = "";
                var headerText = (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && this.model.pivotControl._dataModel != "XMLA") ? $.grep(this.model.pivotTableFields, function (item) { return item.caption == args.droppedElement.text() })[0].name : (this._dataModel == "XMLA") ? args.droppedElement.attr("data-tag") : args.droppedElement.text();
                var headerName = $(args.droppedElement).attr("id");
                var droppedAxis = args.dropTarget.hasClass("e-schemaColumn") ? "schemaColumn" : args.dropTarget.hasClass("e-schemaRow") ? "schemaRow" : args.dropTarget.hasClass("e-schemaFilter") ? "schemaFilter" : args.dropTarget.hasClass("e-schemaValue") ? "schemaValue" : "";
                if (droppedAxis == "")
                    return false;
                var droppedPosition = this._setSplitBtnTargetPos(!ej.isNullOrUndefined(args.event) ? args.event : args);
                try { report = JSON.parse(this.model.pivotControl.getOlapReport()).Report; }
                catch (err) { report = this.model.pivotControl.getOlapReport(); }
                if (!ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                    this.model.pivotControl._waitingPopup.show();
                for (var i = 0; i < this.model.pivotTableFields.length; i++) {
                    if (this.model.pivotTableFields[i].name == headerText) {
                        this.model.pivotTableFields[i].isSelected = true;
                        headerTag = this.model.pivotTableFields[i];
                        break;
                    }
                }
                if (($(this.element).parents(".e-pivotclient").length > 0)) {
                    if (this.model.pivotControl.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this.model.pivotControl._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.model.pivotControl.element, customObject: this.model.pivotControl.model.customObject });
                }
                var eventArgs = JSON.stringify({ "action": this.model.pivotControl.model.enableDeferUpdate ? "nodeDroppedDeferUpdate" : "nodeDropped", "args": JSON.stringify({ "droppedFieldCaption": headerText, "droppedFieldName": headerName, "headerTag": headerTag, "dropAxis": droppedAxis, "droppedPosition": droppedPosition, "currentReport": report }) + "-##-" + JSON.stringify(this.model.pivotControl.model.valueSortSettings), "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs, this._pvtNodeDroppedSuccess);
                this._isDragging = false;
                return;
            }
            this.model.pivotControl._isUpdateRequired = true;
            if (args.dropTarget[0] == undefined && args.dropTarget.className == undefined)
                return;
            var pivotDrop = false;
            if (this._dataModel == "Pivot") {
                var buttonDrag = $(args.dropTarget).parents();
                for (var i = 0; i < buttonDrag.length; i++) {
                    if ($(buttonDrag[i]).hasClass("e-pivotgrid"))
                        pivotDrop = true;
                }
            }
            if (args.dropTarget.hasClass("e-droppable") || (args.dropTarget[0] != undefined && args.dropTarget[0].className.indexOf("e-droppable") >= 0) || (args.dropTarget.className != undefined && args.dropTarget.className.indexOf("e-droppable") >= 0) || pivotDrop) {
                this._isDragging = false;
                this.element.find(".e-dropIndicator").removeClass("e-dropIndicatorHover");
                var headerTag = $(args.droppedElement).attr("data-tag"),
                    headerText = (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && this.model.pivotControl._dataModel != "XMLA") ? $.grep(this.model.pivotTableFields, function (item) { return item.caption == args.droppedElement.text() })[0].name : (this._dataModel == "XMLA") ? args.droppedElement.attr("data-tag") : args.droppedElement.text(),
                    filterTag, filterItems = "", report,
                    selectedPvtBtn = this.element.find(".e-pivotButton:contains(" + headerText + ")"),
                    selectedTreeNode = (this._dataModel == "XMLA") ? (this._tableTreeObj.element.find("li[data-tag='" + headerTag + "']").length > 1 ? args.droppedElement : this._tableTreeObj.element.find("li[data-tag='" + headerTag + "']")) : this._dataModel == "Pivot" && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? this._tableTreeObj.element.find("li[id=" + headerText + "]") : this._dataModel == "Pivot" ? this._tableTreeObj.element.find("li:contains('" + headerText + "'):last") : this._tableTreeObj.element.find("li[data-tag='" + headerTag + "']"),
                    isFiltered = $(selectedPvtBtn).find(".e-filterIndicator").length > 0 ? true : false,
                    isSorted = $(selectedPvtBtn).find("~ span:eq(0) span.descending").length > 0 ? true : false;
                if (args.dropTarget.parent().attr("role") == "presentation")
                    return false;
                if (this.model.pivotControl._dataModel == "XMLA") {
                    var _tag = $.map($(headerTag.split('].')), function (a) { var name = a.lastIndexOf("]") >= 0 ? a : a + "]"; return name; });
                    if (_tag.length >= 2) {
                        var tagName = _tag[0] + "." + _tag[1];
                        selectedTreeNode = this._tableTreeObj.element.find("li[data-tag='" + tagName + "']");
                        headerTag = selectedTreeNode.attr("data-tag");
                    }
                    var isPivotGrid = (($(args.dropTarget).hasClass("value") || $(args.dropTarget).hasClass("colheader") || $(args.dropTarget).hasClass("rowheader") || $(args.dropTarget).hasClass("summary")) || $(args.dropTarget).parents("table:eq(0)").hasClass("e-pivotGridTable") || $(args.dropTarget).parents(".groupingBarPivot").length > 0);
                    var isNamedSet = ((args.droppedElement.find(".e-namedSetCDB").length > 0) && $(args.dropTarget).hasClass("e-schemaFilter"));
                    if (isPivotGrid || isNamedSet || ($(args.droppedElement).attr("data-tag").toLowerCase().indexOf("measures") >= 0 && !$(args.dropTarget).hasClass("e-schemaValue")) || ($(args.droppedElement).attr("data-tag").indexOf("Measures") < 0 && $(args.dropTarget).hasClass("e-schemaValue"))) {
                        this._createErrorDialog();
                        this._waitingPopup.hide();
                        return false;
                    }
                    var fieldItem = ej.Pivot.getReportItemByFieldName(headerTag, this.model.pivotControl.model.dataSource, this._dataModel);
                    var fieldAxis = fieldItem.axis;
                    if (!(selectedTreeNode.length > 1) && fieldItem.item.length > 0 && (fieldAxis == "rows" && args.dropTarget.hasClass("e-schemaRow") || (fieldAxis == "columns" && args.dropTarget.hasClass("e-schemaColumn")) || (fieldAxis == "values" && $(args.dropTarget).hasClass("e-schemaValue")) || (fieldAxis == "filters" && $(args.dropTarget).hasClass("e-schemaFilter"))))
                        return false;

                    if (selectedTreeNode.length > 1 && args.droppedElement.find(".kpiValue").length > 0) {
                        selectedTreeNode = selectedTreeNode.find(".kpiValue").parents("li:eq(0)");
                    }
                    if (this._tableTreeObj.isNodeChecked(selectedTreeNode))
                        for (var i = 0; i < this.element.find(".e-pivotButton").length; i++)
                            this.element.find(".e-pivotButton:eq(" + i + ")").attr("data-tag").split(":")[1] == headerTag ? this.element.find(".e-pivotButton:eq(" + i + ")").remove() : "";
                }
                else if (this._dataModel == "Olap")
                    if ((($(args.droppedElement).attr("data-tag").indexOf("Measures") >= 0 || $(args.droppedElement).parents("[data-tag='KPI']").length > 0) && ($(args.dropTarget).hasClass("e-schemaFilter") || $(args.dropTarget).hasClass("e-drag"))) || (($(args.droppedElement).attr("data-tag").indexOf("Measures") < 0 || $(args.droppedElement).parents("[data-tag='KPI']").length < 0) && $(args.dropTarget).hasClass("e-schemaValue"))) {
                        this._createErrorDialog();
                        this._waitingPopup.hide();
                        return false;
                    }

                $(selectedTreeNode).find(".filter").remove();
                if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                    selectedPvtBtn = new Array();
                    for (var i = 0; i < this.element.find(".e-pivotButton").length; i++) {
                        uniqueName = $(this.element.find(".e-pivotButton")[i]).find("button").attr("data-fieldName");
                        if (uniqueName == headerText)
                            selectedPvtBtn.push(this.element.find(".e-pivotButton")[i]);
                    }
                }
                if (pivotDrop)
                    if (args.event.target.tagName == "TH" || args.event.target.tagName == "TD" || $(args.event.target).hasClass("cellValue") && ($(args.event.target).parent("th").length > 0 || $(args.event.target).parent("td").length > 0)) {
                        if ($(args.event.target).hasClass("cellValue")) {
                            if ($(args.event.target).parent("th").length > 0)
                                args.event.target = $(args.event.target).parent("th")[0];
                            else if ($(args.event.target).parent("td").length > 0)
                                args.event.target = $(args.event.target).parent("td")[0];
                        }
                        this._droppedClass = args.event.target.className.split(" ")[0] == "rowheader" || args.event.target.className.split(" ")[0] == "e-grpRow" ? "e-schemaRow" : args.event.target.className.split(" ")[0] == "colheader" ? "e-schemaColumn" : $(args.event.target).hasClass("value") ? "e-schemaValue" : "";
                        if (this._droppedClass == "") return;
                    }
                    else
                        this._droppedClass = (args.event.target.className.split(" ")[0] == "e-rows" || args.event.target.className.split(" ")[0] == "emptyRows") ? "e-schemaRow" : args.event.target.className.split(" ")[0] == "columns" ? "e-schemaColumn" : args.event.target.className.split(" ")[0] == "values" ? "e-schemaValue" : args.event.target.className.split(" ")[0] == "e-drag" ? "e-schemaFilter" : "";
                    //test
                else
                    if (!ej.isNullOrUndefined(args.event)) {
                        this._droppedClass = args.event.target.className.split(" ")[0];
                    }
                    else {
                        this._droppedClass = args.dropTarget.hasClass("e-schemaColumn") ? "e-schemaColumn" : args.dropTarget.hasClass("e-schemaRow") ? "e-schemaRow" : args.dropTarget.hasClass("e-schemaFilter") ? "e-schemaFilter" : args.dropTarget.hasClass("e-schemaValue") ? "e-schemaValue" : "";
                    }
                if (this._dataModel == "Olap") {
                    var isHierarchy = $(args.droppedElement).children("div:eq(0)").find(".e-checkbox").length;
                    if (isHierarchy == 0)
                        selectedTreeNode = args.droppedElement.parent("ul").parent("li:eq(0)");
                    else
                        selectedTreeNode = args.droppedElement;
                }
                if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && this._dataModel == "Pivot" && this._droppedClass != "e-schemaValue" && ($.grep(this.model.pivotControl._calculatedField, function (value) { return value.name == selectedTreeNode.attr("id"); }).length > 0 || $.grep(JSON.parse(this.model.pivotControl.getOlapReport()).PivotCalculations, function (value) { return value.FieldName == selectedTreeNode.attr("id") && value.CalculationType == 8; }).length > 0)) {
                    this.model.pivotControl._createErrorDialog(this.model.pivotControl._getLocalizedLabels("CalcValue"), this.model.pivotControl._getLocalizedLabels("Warning"));
                    return;
                }
                if (selectedTreeNode.find(".e-chk-inact").length > 0 && (this._droppedClass != "" && (this._droppedClass == "e-schemaRow" || this._droppedClass == "e-schemaColumn" || this._droppedClass == "e-schemaFilter" || this._droppedClass == "e-schemaValue"))) {
                    this._tableTreeObj.checkNode(selectedTreeNode);
                    return false;
                }
                else if (selectedTreeNode.find(".e-chk-inact").length > 0 && (this._droppedClass != "" && (this._droppedClass == "e-pvtBtn" || this._droppedClass == "rowheader" || this._droppedClass == "colheader" || ((this._droppedClass == "value" && $(args.droppedElement).attr("data-tag").indexOf("Measures") < 0))))) {
                    this._nodeCheck = true;
                    this._tableTreeObj.checkNode(selectedTreeNode);
                }
                if (ej.isNullOrUndefined(headerTag))
                    for (var i = 0; i < this.model.pivotTableFields.length; i++) {
                        if (this.model.pivotTableFields[i].name == headerText) {
                            this.model.pivotTableFields[i].isSelected = true;
                            headerTag = this.model.pivotTableFields[i];
                        }
                    }
                if (!ej.isNullOrUndefined(this._tempFilterData))
                    for (var i = 0; i < this._tempFilterData.length; i++) {
                        if (!ej.isNullOrUndefined(this._tempFilterData[i][headerText])) {
                            for (var j = 0; j < this._tempFilterData[i][headerText].length; j++)
                                filterItems += "##" + this._tempFilterData[i][headerText][j];
                        }
                    }
                if (args.droppedElement[0].tagName.toLowerCase() == "button") {
                    if (selectedPvtBtn.length > 1)
                        for (var i = 0; i < selectedPvtBtn.length; i++) {
                            if ($(selectedPvtBtn[i]).text() == headerText)
                                $(selectedPvtBtn[i]).remove();
                        }
                    else
                        $(selectedPvtBtn).remove();
                }
                try {
                    report = JSON.parse(this.model.pivotControl.getOlapReport()).Report;
                }
                catch (err) {
                    if (!ej.isNullOrUndefined(this.model.pivotControl.getOlapReport))
                        report = this.model.pivotControl.getOlapReport();
                }
                if (this.model.pivotControl._dataModel == "XMLA")
                    report = this.model.pivotControl.model.dataSource;

                if (this._dataModel == "Pivot" || this.model.pivotControl._dataModel == "XMLA") {
                    this.model.pivotControl._dataModel == "XMLA" ? headerText = headerTag : headerText = headerText;
                    var droppedPosition = "";
                    if (pivotDrop)
                        droppedPosition = this._droppedPosition = "";
                    else
                        if (!ej.isNullOrUndefined(args.event)) {
                            droppedPosition = this._droppedPosition = this._setSplitBtnTargetPos(args.event);
                        }
                        else {
                            droppedPosition = "";
                        }
                    for (var i = 0; i < this.model.pivotTableFields.length; i++) {
                        if (this.model.pivotTableFields[i].name == headerText) {
                            this.model.pivotTableFields[i].isSelected = true;
                            headerTag = this.model.pivotTableFields[i];
                            $(selectedPvtBtn).remove();
                            break;
                        }
                    }
                    if (selectedTreeNode.find(".e-chk-inact").length > 0 && (this._droppedClass != "" && (this._droppedClass == "e-schemaRow" || this._droppedClass == "e-schemaColumn" || this._droppedClass == "e-schemaFilter" || this._droppedClass == "e-schemaValue")))
                        this._tableTreeObj.checkNode(selectedTreeNode);
                    else {
                        if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                            var droppedItem = this.model.pivotControl._getDroppedItem(headerText);
                            if (droppedItem.length && droppedItem[0].filterItems && droppedItem[0].filterItems.values && droppedItem[0].filterItems.values.length)
                                $($(selectedTreeNode).find(".e-text")[0]).after(ej.buildTag("span.e-icon").attr("role", "button").attr("aria-label", "filtered").addClass("filter")[0].outerHTML);
                            if (!droppedItem.length)
                                droppedItem[0] = { fieldName: headerText, fieldCaption: ((this._dataModel == "XMLA" && selectedTreeNode.find(".e-hierarchyCDB ").length > 0) ? selectedTreeNode.find("div:eq(0)").text() : headerText) };
                            this.model.pivotControl.model.dataSource.columns = $.grep(this.model.pivotControl.model.dataSource.columns, function (value) {
                                return value.fieldName != headerText;
                            });
                            this.model.pivotControl.model.dataSource.rows = $.grep(this.model.pivotControl.model.dataSource.rows, function (value) { return value.fieldName != headerText; });

                            if (this._dataModel != "XMLA") {
                                this.model.pivotControl.model.dataSource.values = $.grep(this.model.pivotControl.model.dataSource.values, function (value) { return value.fieldName != headerText; });
                            }
                            else {
                                this.model.pivotControl.model.dataSource.values[0]["measures"] = $.grep(this.model.pivotControl.model.dataSource.values[0]["measures"], function (value) { return value.fieldName != headerText; });
                            }

                            this.model.pivotControl.model.dataSource.filters = $.grep(this.model.pivotControl.model.dataSource.filters, function (value) { return value.fieldName != headerText; });
                            var dropAxis = this._droppedClass == "e-schemaRow" ? "row" : this._droppedClass == "e-schemaColumn" ? "column" : this._droppedClass == "e-schemaFilter" ? "filter" : this._droppedClass == "e-schemaValue" ? "value" : "";
                            if (this.model.pivotControl._dataModel == "Pivot" && $.grep(this.model.pivotControl._calculatedField, function (value) { return value.name == droppedItem[0].fieldCaption; }).length > 0 && dropAxis != "value") {
                                alert(this.model.pivotControl._getLocalizedLabels("CalcValue"));
                                this._tableTreeObj.checkNode(droppedItem[0].fieldCaption);
                                return;
                            }
                            this._createPivotButton(droppedItem[0], dropAxis, isFiltered, isSorted, droppedPosition);
                            if ($.isNumeric(droppedPosition))
                                this._droppedClass == "e-schemaRow" ? this.model.pivotControl.model.dataSource.rows.splice(droppedPosition, 0, droppedItem[0]) : this._droppedClass == "e-schemaColumn" ? this.model.pivotControl.model.dataSource.columns.splice(droppedPosition, 0, droppedItem[0]) : this._droppedClass == "e-schemaValue" ? ((this.model.pivotControl._dataModel == "XMLA") ? this.model.pivotControl.model.dataSource.values[0]["measures"].splice(droppedPosition, 0, droppedItem[0]) : this.model.pivotControl.model.dataSource.values.splice(droppedPosition, 0, droppedItem[0])) : this.model.pivotControl.model.dataSource.filters.splice(droppedPosition, 0, droppedItem[0]);
                            else
                                this._droppedClass == "e-schemaRow" ? this.model.pivotControl.model.dataSource.rows.push(droppedItem[0]) : this._droppedClass == "e-schemaColumn" ? this.model.pivotControl.model.dataSource.columns.push(droppedItem[0]) : this._droppedClass == "e-schemaValue" ? ((this.model.pivotControl._dataModel == "XMLA") ? this.model.pivotControl.model.dataSource.values[0]["measures"].push(droppedItem[0]) : this.model.pivotControl.model.dataSource.values.push(droppedItem[0])) : this.model.pivotControl.model.dataSource.filters == null ? (this.model.pivotControl.model.dataSource.filters = [], this.model.pivotControl.model.dataSource.filters.push(droppedItem[0])) : this.model.pivotControl.model.dataSource.filters.push(droppedItem[0]);

                            if (this.model.pivotControl._dataModel == "Pivot" && this.model.pivotControl._calculatedField.length > 0 && dropAxis != "value") {
                                this.model.pivotControl._calcFieldNodeDrop(droppedItem[0]);
                                this.model.pivotControl.model.dataSource.values = $.grep(this.model.pivotControl.model.dataSource.values, function (value) {
                                    return (ej.isNullOrUndefined(value.isCalculatedField) || value.isCalculatedField == false) || (value.isCalculatedField == true && value.formula.indexOf(droppedItem[0].fieldName) == -1);
                                });
                            }

                            if (this.model.pivotControl._dataModel == "XMLA") {
                                if (this._droppedClass == "e-schemaFilter")
                                    this.model.pivotControl.model.dataSource.filters = $.map(this.model.pivotControl.model.dataSource.filters, function (obj, index) { obj["advancedFilter"] = []; return obj; });
                                ej.olap.base.getJSONData({ action: "nodeDropped" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
                            }
                            else {
                                this._trigger("fieldItemDropped", { axis: dropAxis, fieldItem: selectedTreeNode });
                                this.model.pivotControl.model.editCellsInfo = {};
                                this.model.pivotControl._populatePivotGrid();
                            }
                        }
                        else {
                            var isFiltered = false;
                            if (this._tempFilterData != null)
                                $.each(this._tempFilterData, function (index, object) { $.each(object, function (key, value) { if (key == $(selectedTreeNode).attr("id") && value.length > 0) isFiltered = true; }); });
                            if (isFiltered)
                                $($(selectedTreeNode).find(".e-text")[0]).after(ej.buildTag("span.e-icon").addClass("filter")[0].outerHTML);
                            if (this._dataModel == "Pivot" && this.model.pivotControl._calculatedField.length > 0 && this._droppedClass != "e-schemaValue")
                                this.model.pivotControl._calculatedFieldNodeRemove(headerTag);
                            this._createPivotButton({ fieldName: headerTag.id, fieldCaption: headerText }, this._droppedClass == "e-schemaRow" ? "row" : this._droppedClass == "e-schemaColumn" ? "column" : this._droppedClass == "e-schemaFilter" ? "filter" : this._droppedClass == "e-schemaValue" ? "value" : "", isFiltered, isSorted, droppedPosition);
                            var filterParams = "";
                            filterParams = ej.Pivot._getFilterParams(this._droppedClass, this._tempFilterData, headerText);
                            if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                                this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.pivotControl.model.customObject });
                            var eventArgs = JSON.stringify({ "action": "nodeDropped", "dropAxis": this._droppedClass + "::" + droppedPosition, "filterParams": filterParams, "headerTag": JSON.stringify(headerTag), "sortedHeaders": this.model.pivotControl._ascdes, "currentReport": report, "valueSorting": this.model.pivotControl.model.valueSortSettings, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                            if (!ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                                this.model.pivotControl._waitingPopup.show();
                            this.element.find(".schemaNoClick").addClass("freeze").width($(this.element).width()).height($(this.element).height()).css({ "top": $(this.element).offset().top, "left": $(this.element).offset().left });
                            if (!this.model.pivotControl.model.enableDeferUpdate)
                                this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs, this._pvtNodeDroppedSuccess);
                            else {
                                this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs.replace("nodeDropped", "nodeDroppedDeferUpdate"), this._pvtNodeDroppedSuccess);
                                if (!ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                                    this.model.pivotControl._waitingPopup.hide();
                            }
                        }
                    }
                }
                else {
                    var axis = (args.dropTarget[0] != undefined && args.dropTarget[0].className == "e-pivotButton") ? $(args.dropTarget).parents()[0] : (args.dropTarget[0] != undefined && args.dropTarget[0].tagName.toLowerCase() == "td" && !$(args.dropTarget.parents("table.e-pivotGridTable")[0]).length) ? args.dropTarget.children(":last")[0] : args.dropTarget;
                    this._droppedClass = axis[0].className.split(" ")[0];
                    var curAxis = "", axisName = "";
                    curAxis = axis[0].className.split(" ")[0];
                    if ($(args.dropTarget.parents("table.e-pivotGridTable")[0]).length) {
                        axisName = $(axis).hasClass("rowheader") ? "Series" : $(axis).hasClass("e-grpRow") ? "Series" : $(axis).hasClass("e-rows") ? "Series" : $(axis).hasClass("colheader") ? "Categorical" : $(axis).hasClass("columns") ? "Categorical" : $(axis).hasClass("value") ? "Slicer" : $(axis).hasClass("e-drag") ? "Slicer" : "";///
                        if ($(args.droppedElement).attr("data-tag").indexOf("Measures") > 0 && axisName == "Slicer") {
                            this._createErrorDialog();
                            return false;
                        }
                    }
                    else
                        axisName = curAxis == "columns" ? "Categorical" : curAxis == "e-schemaColumn" ? "Categorical" : curAxis == "e-rows" ? "Series" : curAxis == "e-schemaRow" ? "Series" : curAxis == "e-drag" ? "Slicer" : curAxis == "e-schemaFilter" ? "Slicer" : "";
                    if (axisName == "")
                        axisName = (this.element.find(".e-schemaRow .e-pivotButton:contains('Measures')").length > 0 || this.element.find(".e-schemaRow .e-pivotButton:contains('MEASURES')").length > 0) ? "Series" : "Categorical";
                    if (!ej.isNullOrUndefined(args.event)) {
                        var droppedPosition = this._setSplitBtnTargetPos(args.event);
                    }
                    else {
                        var droppedPosition = "";
                    }
                    var isFiltered = false;
                    if (this.model.pivotControl._tempFilterData != null)
                        $.each(this.model.pivotControl._tempFilterData, function (index, object) { $.each(object, function (key, value) { if (key == headerTag.replace(/[\[\]']/g, '') && value.length > 0) isFiltered = true; }); });
                    if (isFiltered)
                        $($(selectedTreeNode).find(".e-text")[0]).after(ej.buildTag("span.e-icon").addClass("filter")[0].outerHTML);
                    headerTag = (headerTag == "Value" || headerTag == "Goal" || headerTag == "Status" || headerTag == "Trend") ? (headerTag + ":" + $(args.droppedElement).parents("li:eq(0)").attr("data-tag") + ":KPI") : ($(selectedTreeNode).parents("[data-tag='KPI']").length > 0 ? (headerTag + ":KPI") : headerTag);
                    var params = this._currentCubeName + "--" + headerTag + "--" + axisName + "--" + droppedPosition, filterParams = "";
                    if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.pivotControl.model.customObject });
                    var eventArgs = JSON.stringify({ "action": "nodeDropped", "dropType": "TreeNode", "nodeInfo": params, "filterParams": filterParams, "currentReport": report, "gridLayout": this.model.pivotControl.model.layout, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    if (!this.model.pivotControl.model.enableDeferUpdate && !ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                        this.model.pivotControl._waitingPopup.show();
                    this.element.find(".schemaNoClick").addClass("freeze").width($(this.element).width()).height($(this.element).height()).css({ "top": $(this.element).offset().top, "left": $(this.element).offset().left });
                    if (!this.model.pivotControl.model.enableDeferUpdate)
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs, this._droppedSuccess);
                    else {
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs.replace("nodeDropped", "nodeDroppedDeferUpdate"), this._droppedSuccess);
                    }
                }
            }
            this._setPivotBtnWidth();
        },

        _addTreeDropIcon: function (treeviewItem) {
            if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                if ($(args.currentElement).attr("data-tag").toLowerCase().indexOf("[measures]") < 0 && !($(args.currentElement).find(".e-namedSetCDB").length > 0)) treeviewItem.after(ej.buildTag("span.e-icon").css("display", "none").addClass("treeDrop")[0].outerHTML);
                else
                    treeviewItem.after(ej.buildTag("span.e-icon").css("display", "none").addClass("treeDrop")[0].outerHTML);
        },

        _removeUndefinedFields: function (dropArgs) {
            for (var itm in dropArgs) { if ((itm == "droppedFieldFormat" || itm == "droppedFieldFormatString") && (ej.isNullOrUndefined(dropArgs[itm]) || dropArgs[itm] == "")) delete dropArgs[itm]; }
            return dropArgs;
        },

        _clientPivotCheckedStateModified: function (args) {
            ej.PivotAnalysis._valueSorting = null;
            if (this._isDropAction) return;
            var droppedFieldName = "", droppedFieldFormat = "", droppedFieldFormatString = "";
            if (!ej.isNullOrUndefined(this.model.pivotControl) && !ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                this.model.pivotControl._waitingPopup.show();
            if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    droppedFieldName = $.grep(this.model.pivotTableFields, function (item) { return item.name.replace(/ /g, "_") == $(args.currentElement).attr("id"); })[0].name;
                    droppedFieldFormat = $.grep(this.model.pivotTableFields, function (item) { return item.name.replace(/ /g, "_") == $(args.currentElement).attr("id"); })[0].format;
                    droppedFieldFormatString = $.grep(this.model.pivotTableFields, function (item) { return item.name.replace(/ /g, "_") == $(args.currentElement).attr("id"); })[0].formatString;
                }
                else
                    droppedFieldName = $(args.currentElement).attr("data-tag");
            }
            else
                droppedFieldName = $(args.currentElement).find("a")[0].textContent;

            if (args.type == "nodeUncheck") {
                delete this.model.pivotControl._fieldMembers[droppedFieldName.toLowerCase()];
                delete this.model.pivotControl._fieldSelectedMembers[droppedFieldName.toLowerCase()];
                ej.Pivot.removeReportItem(this.model.pivotControl.model.dataSource, droppedFieldName, false);
                $(args.currentElement).removeClass("filter").find(".treeDrop,.filter").remove();
            }
            else {
                var droppedClass = "row";
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && $(args.currentElement).attr("data-tag").toLocaleLowerCase().indexOf("[measures]") >= 0) droppedClass = "value";
                if (this.model.pivotControl.model.analysisMode != ej.Pivot.AnalysisMode.Olap || ($(args.currentElement).attr("data-tag").toLowerCase().indexOf("[measures]") < 0 && $(args.currentElement).find(".e-namedSetCDB").length == 0))
                    $(args.currentElement.find(".e-text")).after(ej.buildTag("span.e-icon").css("display", "none").addClass("treeDrop")[0].outerHTML);
                var droppedFieldCaption = (($(args.currentElement).parents("[data-tag='folderStruct']").length > 0 && ($(args.currentElement).find("a")[0].textContent == this._getLocalizedLabels("Status") || $(args.currentElement).find("a")[0].textContent == this._getLocalizedLabels("Trend") || $(args.currentElement).find("a")[0].textContent == this._getLocalizedLabels("Goal") || $(args.currentElement).find("a")[0].textContent == this._getLocalizedLabels("Value")))) ? $(args.currentElement).parents("li:eq(0)").find("a:eq(0)").text() + " " + $(args.currentElement).find("a")[0].textContent : $(args.currentElement).find("a")[0].textContent;
                var dropArgs = { droppedFieldName: droppedFieldName, droppedFieldCaption: droppedFieldCaption, droppedFieldFormat: droppedFieldFormat, droppedFieldFormatString: droppedFieldFormatString, droppedClass: droppedClass, droppedPosition: "", isMeasuresDropped: (droppedFieldName.toLocaleLowerCase().indexOf("measures") == 0) };
                this._removeUndefinedFields(dropArgs);
                ej.Pivot.addReportItem(this.model.pivotControl.model.dataSource, dropArgs);
            }
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                ej.olap.base.clearDrilledItems(this.model.pivotControl.model.dataSource, { action: "nodeDropped" }, this.model.pivotControl)
            this._refreshPivotButtons();
            this.model.pivotControl.refreshControl();
            this._setPivotBtnWidth();
        },

        _clientOnNodeDropped: function (args) {
            ej.PivotAnalysis._valueSorting = null;
            this._isDragging = false;
            var pivotDrop = false, isKpi = false;
            var schemaObj = this;
            var pivotClientObj = ($(this.element).parents(".e-pivotclient").length > 0) ? $(this.element).parents(".e-pivotclient").data("ejPivotClient") : null;
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                var buttonDrag = $(args.dropTarget).parents();
                for (var i = 0; i < buttonDrag.length; i++) {
                    if (buttonDrag[i].className.split(" ")[0] == "e-pivotgrid")
                        pivotDrop = true;
                }
            }
            var droppedFieldName = this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? $.grep(this.model.pivotTableFields, function (item) { return item.name.replace(/ /g, "_") == args.droppedElement.attr("id") })[0].name : (args.droppedElement.attr("data-defaultHierarchy") || ($(args.droppedElement).find("a:eq(0) span[class^='level'],div[class*='level']").length > 0 ? $(args.droppedElement).parents("li:eq(0)").attr("data-tag") : args.droppedElement.attr("data-tag")));
            var droppedFieldCaption = $(args.droppedElement).find("div:first").text();
            isKpi = (droppedFieldCaption == this._getLocalizedLabels("Goal") || droppedFieldCaption == this._getLocalizedLabels("Status") || droppedFieldCaption == this._getLocalizedLabels("Value") || droppedFieldCaption == this._getLocalizedLabels("Trend")) && $(args.droppedElement).parents("[data-tag='folderStruct']").length > 0;
            if(isKpi) droppedFieldCaption = ($(args.droppedElement).parents("li:eq(0)").attr("data-tag") + " " + $(args.droppedElement).find("div:first").text());
            if (droppedFieldName == "" && droppedFieldCaption != "")
                droppedFieldName = droppedFieldCaption;
            var droppedHierarchyUniqueName = null; var droppedExpression = null;
            if (($(this.element).parents(".e-pivotclient").length > 0) && $(args.droppedElement).length > 0 && $(args.droppedElement).find(".e-calcMemberCDB").length > 0) {
                var treeJSON = this.element.find(".e-schemaFieldTree").data("ejTreeView").getTreeData($(args.droppedElement).attr("id"));
                if (args.dropTarget == "" && $(args.droppedElement).is("li")) {

                    if ($(args.droppedElement).siblings().length == 0)
                        $(args.droppedElement).parents("li:eq(0)").children().find(".e-minus").hide();

                    var removeExp = "";
                    this.model.pivotControl.model.calculatedMembers = $.grep(this.model.pivotControl.model.calculatedMembers, function (item, index) {
                        if (treeJSON[0].name != item.caption)
                            return item;
                        else
                            removeExp = treeJSON[0].expression;
                    });
                    if (removeExp != "") {
                        this.model.pivotControl.model.dataSource.values[0].measures = this._reArrangeCalcFields(this.model.pivotControl.model.dataSource.values[0].measures, removeExp).reportItem;
                        this.model.pivotControl.model.dataSource.rows = this._reArrangeCalcFields(this.model.pivotControl.model.dataSource.rows, removeExp).reportItem;
                        this.model.pivotControl.model.dataSource.columns = this._reArrangeCalcFields(this.model.pivotControl.model.dataSource.columns, removeExp).reportItem;
                        this.model.pivotControl.refreshControl();
                        this.refreshControl();
                        var treeDataSrc = this.element.find(".e-schemaFieldTree").data("ejTreeView").model.fields.dataSource;
                        treeDataSrc = $.grep(treeDataSrc, function (value) {
                            if (value.id != $(args.droppedElement).attr("id")) return value;
                        });
                        this.element.find(".e-schemaFieldTree").data("ejTreeView").model.fields.dataSource = treeDataSrc;
                        $(args.droppedElement).remove();
                    }
                    return;
                } else {
                    droppedHierarchyUniqueName = (treeJSON)[0].hierarchyUniqueName;
                    droppedExpression = (treeJSON)[0].expression;
                }
            }

            var droppedClass = "";
            var droppedtItem = this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? $.grep(this.model.pivotTableFields, function (item) { return item.name.replace(/ /g, "_") == args.droppedElement.attr("id") })[0] : null;
            var droppedFieldFormat = !ej.isNullOrUndefined(droppedtItem) ? droppedtItem.format : "";
            var droppedFieldFormatString = !ej.isNullOrUndefined(droppedtItem) ? droppedtItem.formatString : "";
            var droppedFieldShowSubTotal = !ej.isNullOrUndefined(droppedtItem) ? droppedtItem.showSubTotal : true;
            if ($(args.dropTarget).hasClass("e-pvtBtn") || $(args.dropTarget).hasClass("e-pivotButton"))
                droppedClass = $(args.dropTarget).parents('div.e-droppable').hasClass("e-schemaColumn") ? "column" : $(args.dropTarget).parents('div.e-droppable').hasClass("e-schemaRow") ? "row" : $(args.dropTarget).parents('div.e-droppable').hasClass("e-schemaFilter") ? "filter" : $(args.dropTarget).parents('div.e-droppable').hasClass("e-schemaValue") ? "value" : "";
            else
                var droppedClass = args.dropTarget.hasClass("e-schemaColumn") ? "column" : args.dropTarget.hasClass("e-schemaRow") ? "row" : args.dropTarget.hasClass("e-schemaFilter") ? "filter" : args.dropTarget.hasClass("e-schemaValue") ? "value" : "";
            if (pivotDrop) {
                if ($(args.dropTarget).prop("tagName") == "TH" || $(args.dropTarget).prop("tagName") == "TD")
                    droppedClass = $(args.dropTarget).hasClass("rowheader") || $(args.dropTarget).hasClass("e-grpRow") ? "row" : $(args.dropTarget).hasClass("colheader") ? "column" : $(args.dropTarget).hasClass("value") ? "value" : "";
                else
                    droppedClass = ($(args.dropTarget).hasClass("e-rows") || $(args.dropTarget).hasClass("emptyRows")) ? "row" : $(args.dropTarget).hasClass("columns") ? "column" : $(args.dropTarget).hasClass("values") ? "value" : $(args.dropTarget).hasClass("e-drag") ? "filter" : "";
            }
            if (droppedClass == "")
                return false;
            var droppedPosition = ej.isNullOrUndefined(args.event) ? "" : this._setSplitBtnTargetPos(args.event);
            //validating drop action
            var isPivotGrid = (($(args.dropTarget).hasClass("value") || $(args.dropTarget).hasClass("colheader") || $(args.dropTarget).hasClass("rowheader") || $(args.dropTarget).hasClass("summary")) || $(args.dropTarget).parents("table:eq(0)").hasClass("e-pivotGridTable") || $(args.dropTarget).parents(".groupingBarPivot").length > 0);
            if ((droppedFieldName.toLowerCase().indexOf("[measures]") >= 0 && droppedClass != "value") || (droppedFieldName == this._getLocalizedLabels("Measures") && droppedClass != "row" && droppedClass != "column") || (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && droppedFieldName.toLowerCase().indexOf("[measures]") < 0 && droppedClass == "value") || (isPivotGrid && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap)) {
                this._createErrorDialog();
                return;
            }
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                this.model.pivotControl._fieldMembers = {};
                this.model.pivotControl._fieldSelectedMembers = {};
                if (droppedFieldName.toLowerCase().indexOf("[measures") >= 0) {
                    this.model.pivotControl.model.dataSource.values[0].axis = droppedClass == "column" ? "columns" : droppedClass == "row" ? "rows" : this.model.pivotControl.model.dataSource.values[0].axis;
                    droppedClass = "value";
                }
            }
            if (!ej.isNullOrUndefined(pivotClientObj)) {
                pivotClientObj._isTimeOut = true;
                setTimeout(function () {
                    if (pivotClientObj._isTimeOut)
                        schemaObj.model.pivotControl._waitingPopup.show();
                }, 800);
            }
            else
                this.model.pivotControl._waitingPopup.show();
            var dropArgs = { droppedFieldName: droppedFieldName, droppedFieldCaption: droppedFieldCaption, droppedFieldFormat: droppedFieldFormat, droppedFieldFormatString: droppedFieldFormatString, droppedFieldShowSubTotal: droppedFieldShowSubTotal, droppedClass: droppedClass, droppedPosition: droppedPosition, isMeasuresDropped: (droppedFieldName.toLocaleLowerCase().indexOf("measures") == 0), droppedExpression: droppedExpression, droppedHierarchyUniqueName: droppedHierarchyUniqueName };
            this._removeUndefinedFields(dropArgs);
            ej.Pivot.addReportItem(this.model.pivotControl.model.dataSource, dropArgs);
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                ej.olap.base.clearDrilledItems(this.model.pivotControl.model.dataSource, { action: "nodeDropped" }, this.model.pivotControl);
                this.model.pivotControl.model.dataSource.rows = this._reArrangeCalcFields(this.model.pivotControl.model.dataSource.rows).reportItem;
                this.model.pivotControl.model.dataSource.columns = this._reArrangeCalcFields(this.model.pivotControl.model.dataSource.columns).reportItem;
            }
            if (this.model.pivotControl.element.hasClass("e-pivotclient") && this.model.pivotControl._pivotChart)
                this.model.pivotControl._pivotChart._labelCurrentTags = {};

            var droppedElement = args.droppedElement;
            this._isDropAction = true;
            if (droppedClass == "")
                this._tableTreeObj.uncheckNode(args.droppedElement);
            else {
                if ($(args.droppedElement).find(".treeDrop").length == 0 && this.element.parents(".e-pivotclient").length == 0 && (this.model.pivotControl.model.analysisMode != ej.Pivot.AnalysisMode.Olap || ($(args.droppedElement).attr("data-tag").toLowerCase().indexOf("[measures]") < 0 && $(args.droppedElement).find(".e-namedSetCDB").length == 0)))
                    $(args.droppedElement.find(".e-text")).after(ej.buildTag("span.e-icon").css("display", "none").addClass("treeDrop")[0].outerHTML);
                this._tableTreeObj.checkNode(args.droppedElement);
            }
            this._isDropAction = false;

            this._refreshPivotButtons();
            this.model.pivotControl.refreshControl();
            this._setPivotBtnWidth();
            if (!ej.isNullOrUndefined(pivotClientObj))
                if (pivotClientObj._isTimeOut) pivotClientObj._isTimeOut = false;
        },

        _clientOnPvtBtnDropped: function (args) {
            ej.PivotAnalysis._valueSorting = null;
            var schemaObj = this;
            var pivotClientObj = ($(this.element).parents(".e-pivotclient").length > 0) ? $(this.element).parents(".e-pivotclient").data("ejPivotClient") : null;
            if (!ej.isNullOrUndefined(this.model.pivotControl) && !ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                if (!ej.isNullOrUndefined(pivotClientObj)) {
                    pivotClientObj._isTimeOut = true;
                    setTimeout(function () {
                        if (pivotClientObj._isTimeOut && pivotClientObj.element.find(".e-errorDialog:visible").length == 0)
                            schemaObj.model.pivotControl._waitingPopup.show();
                    }, 800);
                }
                else
                    this.model.pivotControl._waitingPopup.show();
            if ($(args.target).hasClass("e-removeClientPivotBtn"))
                args.target = $(args.target).parent();
            this._isDragging = false;
            $("#" + this._id + "_dragClone").remove();
            var isCalcMember = false;
            //Getting dropped item name
            var droppedField = "", droppedFieldFormat = "", droppedFieldFormatString = "";
            if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    droppedField = $.grep(this.model.pivotTableFields, function (item) { return item.name == $(args.element).attr("data-fieldName"); })[0].name;
                    droppedFieldFormat = $.grep(this.model.pivotTableFields, function (item) { return item.name == $(args.element).attr("data-fieldName"); })[0].format;
                    droppedFieldFormatString = $.grep(this.model.pivotTableFields, function (item) { return item.name == $(args.element).attr("data-fieldName"); })[0].formatString;
                }
                else {
                    droppedField = $(args.element).attr("data-fieldName");
                    if ($(this.element).parents(".e-pivotclient").length > 0) {
                        var calcMember = $.map((this.model.pivotControl.model.calculatedMembers), function (item) { if (item.caption == droppedField) return item });
                        if (calcMember.length > 0)
                            isCalcMember = true;
                    }
                }
            }
            else
                droppedField = args.element.text();
            var droppedFieldCaption = args.element.text();
            if (!ej.isNullOrUndefined(this.model.pivotControl._fieldMembers)) {
                delete this.model.pivotControl._fieldMembers[droppedField.toLowerCase()];
                delete this.model.pivotControl._fieldSelectedMembers[droppedField.toLowerCase()];
            }
            //Getting dropped axis
            var droppedClass = "";
            if ($(args.target).hasClass("e-pvtBtn") || (this.element.parents(".e-pivotclient").length > 0 && $(args.target).hasClass("e-pivotButton")))
                droppedClass = $(args.target).parents('div.e-droppable').hasClass("e-schemaColumn") ? "column" : $(args.target).parents('div.e-droppable').hasClass("e-schemaRow") ? "row" : $(args.target).parents('div.e-droppable').hasClass("e-schemaFilter") ? "filter" : $(args.target).parents('div.e-droppable').hasClass("e-schemaValue") ? "value" : "";
            else
                droppedClass = $(args.target).hasClass("e-schemaColumn") ? "column" : $(args.target).hasClass("e-schemaRow") ? "row" : $(args.target).hasClass("e-schemaFilter") ? "filter" : $(args.target).hasClass("e-schemaValue") ? "value" : "";

            //validating drop action
            if (isCalcMember && droppedClass == "filter" || ((droppedField.toLowerCase().indexOf("[measures]") >= 0 && droppedClass != "value" && (droppedClass == "row" || droppedClass == "column" || droppedClass == "filter")) || (droppedField == this._getLocalizedLabels("Measures") && droppedClass != "row" && droppedClass != "column" && (droppedClass == "value" || droppedClass == "filter")) || (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && droppedField.toLowerCase().indexOf("[measures]") < 0 && droppedClass == "value"))) {
                this._createErrorDialog();
                args.element.removeClass("dragHover").parent().removeClass("dragHover");
                return;
            }
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.pivotControl._calculatedField != null && droppedClass != "value" && $.grep(this.model.pivotControl._calculatedField, function (value) { return value.name == droppedField; }).length > 0) {
                ej.Pivot._createErrorDialog(this.model.pivotControl._getLocalizedLabels("CalcValue"), this.model.pivotControl._getLocalizedLabels("Warning"), this);
                args.element.removeClass("dragHover").parent().removeClass("dragHover");
                this.element.find(".e-dropIndicator").removeClass("e-dropIndicatorHover");
                this.model.pivotControl._waitingPopup.hide();
                return;
            }
            //Getting dropped position
            var droppedPosition = !ej.isNullOrUndefined(args.event) ? this._setSplitBtnTargetPos(args.event) : "";

            var dropArgs = { droppedFieldName: droppedField, droppedFieldCaption: droppedFieldCaption, droppedFieldFormat: droppedFieldFormat, droppedFieldFormatString: droppedFieldFormatString, droppedClass: droppedClass, droppedPosition: droppedPosition, isMeasuresDropped: (droppedField.toLocaleLowerCase().indexOf("measures") == 0) };
            this._removeUndefinedFields(dropArgs);
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && (droppedField == this._getLocalizedLabels("Measures") || droppedField == "[Measures]"))
                var measureItems = this.model.pivotControl.model.dataSource.values[0].measures;
            ej.Pivot.addReportItem(this.model.pivotControl.model.dataSource, dropArgs);
            this.model.pivotControl.model.dataSource.rows = this._reArrangeCalcFields(this.model.pivotControl.model.dataSource.rows).reportItem;
            this.model.pivotControl.model.dataSource.columns = this._reArrangeCalcFields(this.model.pivotControl.model.dataSource.columns).reportItem;
            if (this.model.pivotControl._calculatedField != null && this.model.pivotControl._calculatedField.length > 0 && droppedClass != "value") {
                var removeElement = $.grep(this.model.pivotControl.model.dataSource.values, function (value) { return value.isCalculatedField == true && value.formula.indexOf(droppedField) > -1; });
                for (var i = 0; i < removeElement.length; i++)
                    this._tableTreeObj.uncheckNode(removeElement[i].fieldName);
            }
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.pivotControl._calculatedField != null && this.model.pivotControl._calculatedField.length > 0) {
                var calculatedField = $.grep(this.model.pivotControl.model.dataSource.values, function (value) { return value.isCalculatedField == true; });
                this.model.pivotControl.model.dataSource.values = $.grep(this.model.pivotControl.model.dataSource.values, function (value) { return ej.isNullOrUndefined(value.isCalculatedField) || value.isCalculatedField == false; });
                $.merge(this.model.pivotControl.model.dataSource.values, calculatedField);
            }
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                this.model.pivotControl._fieldMembers = {};
                this.model.pivotControl._fieldSelectedMembers = {};
                ej.olap.base.clearDrilledItems(this.model.pivotControl.model.dataSource, { action: "nodeDropped" }, this.model.pivotControl)
            }
            if (this.model.pivotControl.element.hasClass("e-pivotclient") && this.model.pivotControl._pivotChart)
                this.model.pivotControl._pivotChart._labelCurrentTags = {};
            if (droppedClass == "") {
                this._isDropAction = true;
                this._tableTreeObj.element.find("li[data-tag='" + droppedField + "']").removeClass("filter").find(".treeDrop,.filter").remove();
                if (!ej.isNullOrUndefined(measureItems)) {
                    var schema = this;
                    $.grep(measureItems, function (measureItem) { schema._tableTreeObj.uncheckNode(schema._tableTreeObj.element.find("li[data-tag='" + measureItem.fieldName + "']")); });
                }
                else
                    this._tableTreeObj.uncheckNode(this._tableTreeObj.element.find("li[data-tag='" + droppedField + "']"));
                this._isDropAction = false;
            }
            this._refreshPivotButtons();
            this.model.pivotControl.refreshControl();
            this._setPivotBtnWidth();
        },

        _reArrangeCalcFields: function (items, removeExpression) {
            var calcMembers = [],  calcMems = [];
            var items = $.grep(items, function (item, index) {
                if (!ej.isNullOrUndefined(removeExpression)) {
                    if (item.expression != removeExpression)
                        return item;
                }
                else if (item.expression != undefined) {
                    calcMems.push({ caption: item.fieldName, "expression": item.expression, hierarchyUniqueName: item.hierarchyUniqueName, "formatString": (item.formatString ? item.formatString : item.format), memberType: "Dimension" });
                    calcMembers.push(item)
                }
                else
                    return item;
            });
            return { reportItem: $.merge(calcMembers, items), calcMems: calcMems };
        },
        _refreshPivotButtons: function () {
            this.element.find(".e-axisTable .e-schemaFilter").html(this.model.layout == "normal" ? this._createPivotButtons_1(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this.model.pivotControl.model.dataSource.filters : JSON.parse(this.model.pivotControl.getOlapReport()).Filters, "filter") : this._createPivotButtons("filters", this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this.model.pivotControl.model.dataSource.filters : JSON.parse(this.model.pivotControl.getOlapReport()).Filters));
            this.element.find(".e-axisTable .e-schemaRow").html(this.model.layout == "normal" ? this._createPivotButtons_1(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this.model.pivotControl.model.dataSource.rows : JSON.parse(this.model.pivotControl.getOlapReport()).PivotRows, "row") : this._createPivotButtons("rows", this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this.model.pivotControl.model.dataSource.rows : JSON.parse(this.model.pivotControl.getOlapReport()).PivotRows));
            this.element.find(".e-axisTable .e-schemaColumn").html(this.model.layout == "normal" ? this._createPivotButtons_1(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this.model.pivotControl.model.dataSource.columns : JSON.parse(this.model.pivotControl.getOlapReport()).PivotColumns, "column") : this._createPivotButtons("columns", this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this.model.pivotControl.model.dataSource.columns : JSON.parse(this.model.pivotControl.getOlapReport()).PivotColumns));
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.pivotControl.model.dataSource.values.length > 0 && (!ej.isNullOrUndefined(this.model.pivotControl.model.dataSource.values[0].measures)) && this.model.pivotControl.model.dataSource.values[0].measures.length > 0) {
                if (this.model.pivotControl.model.dataSource.values[0].axis == "columns")
                    this.element.find(".e-axisTable .e-schemaColumn").append(this.model.layout == "normal" ? this._createPivotButtons_1([{ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }], "column") : this._createPivotButtons("columns", [{ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }]));// this.model.pivotControl.model.dataSource.values[0].measures));
                else if (this.model.pivotControl.model.dataSource.values[0].axis == "rows")
                    this.element.find(".e-axisTable .e-schemaRow").append(this.model.layout == "normal" ? this._createPivotButtons_1([{ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }], "row") : this._createPivotButtons("rows", [{ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }]));// this.model.pivotControl.model.dataSource.values[0].measures));
            }
            this.element.find(".e-axisTable .e-schemaValue").html(this.model.layout == "normal" ? this._createPivotButtons_1(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this.model.pivotControl.model.dataSource.values : JSON.parse(this.model.pivotControl.getOlapReport()).PivotCalculations, "value") : this._createPivotButtons("values", this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this.model.pivotControl.model.dataSource.values : JSON.parse(this.model.pivotControl.getOlapReport()).PivotCalculations));

            if (this.model.enableDragDrop) {
                this.element.find(".e-pivotButton .e-pvtBtn").ejButton({ size: "normal", type: ej.ButtonType.Button, enableRTL: this.model.enableRTL }).ejDraggable({
                    handle: 'button', clone: true,
                    cursorAt: { left: -5, top: -5 },
                    dragStart: ej.proxy(function (args) {
                        this._isDragging = true;
                    }, this),
                    dragStop: ej.proxy(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? this._pvtBtnDropped : this._clientOnPvtBtnDropped, this),
                    helper: ej.proxy(function (event, ui) {
                        $(event.element).addClass("dragHover");
                        if (event.sender.target.className.indexOf("e-btn") > -1) {
                            var btnClone = $(event.sender.target).clone().attr("id", this._id + "_dragClone").appendTo('body');
                            $("#" + this._id + "_dragClone").removeAttr("style").height($(event.sender.target).height());
                            return btnClone;
                        }
                        else
                            return false;
                    }, this)
                });
            }
            if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && (this.model.olap.showKPI || this.model.olap.showKpi) && !ej.isNullOrUndefined(this._tableTreeObj))
                if (this.element.find(".e-pvtBtn[data-fieldName=KPI]").length > 0) {
                    var treeViewElements = this._tableTreeObj.element.find("li[data-tag=KPI]");
                    if ($(treeViewElements).length > 0) {
                        var dropSpan = ej.buildTag("span.e-icon").css("display", "none").addClass("treeDrop")[0].outerHTML;
                        $($(treeViewElements).find(".e-text")[0]).after(dropSpan);
                    }
                }
            if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && this.model.pivotControl.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne)
                this.element.find(".e-pvtBtn").css("max-width", this.element.find(".e-schemaColumn").width() - this.element.find(".e-removeClientPivotBtn").width() - 6);
            this._createContextMenu();
            if (this.model.pivotControl.model.isResponsive && this.model.pivotControl.model.enableSplitter && !ej.isNullOrUndefined(this.model.pivotControl.element.find(".splitresponsive").data("ejSplitter")))
                this.model.pivotControl.element.find(".splitresponsive").data("ejSplitter").refresh();
            if (this.model.pivotControl.model.showUniqueNameOnPivotButton)
                $(".pvtBtnDiv").addClass("e-schemaBtnUnique");
            if (!(this.element.parents(".e-pivotclient").length > 0))
                this._setPivotBtnWidth();
            else
                this._setSplitButtonTitle();
        },

        _setSplitButtonTitle: function () {
            if (this.element.find(".e-pvtBtn").length > 0 && this._tableTreeObj != null) {
                for (var i = 0; i < this.element.find(".e-pvtBtn").length; i++) {
                    var fieldName = this.element.find(".e-pvtBtn:eq(" + i + ")").attr("data-fieldname");
                    if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        var dimenstionCaption = this._tableTreeObj.element.find("li[data-tag='" + fieldName + "']").parents("li:eq(0)").find("a:eq(0)").text();
                        var hierarchyCaption = this.element.find(".e-pvtBtn:eq(" + i + ")").text();
                        if (fieldName.toLowerCase().indexOf("measures") >= 0)
                            this.element.find(".e-pvtBtn:eq(" + i + ")").attr("title", hierarchyCaption);
                        else
                            this.element.find(".e-pvtBtn:eq(" + i + ")").attr("title", dimenstionCaption + " - " + hierarchyCaption);
                    }
                    else
                        this.element.find(".e-pvtBtn:eq(" + i + ")").attr("title", $.grep(this.model.pivotTableFields, function (item) { return item.id == fieldName; })[0].caption);
                }
            }
        },

        _createPivotButtons: function (axis, items) {
            var rowBtns = "";
            var btnAxis = axis;
            if (!ej.isNullOrUndefined(this.model.pivotControl) && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                if (axis == "values" && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) items = $.map(items, function (obj, index) { return obj["measures"]; });
                for (var i = 0; i < items.length; i++) {
                    var buttonId = this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? "" : items[i].fieldName;
                    var fldName = $.grep(this.model.pivotTableFields, function (item) { return item.name == items[i].fieldName; }),
					fldCaption = $.grep(this.model.pivotTableFields, function (item) { return item.name == items[i]; });
                    if (fldName.length > 0)
                        fldName = fldName[0].caption;
                    if (fldCaption.length > 0)
                        fldCaption = fldCaption[0].caption;
                    var filterState = "";
                    var olapClientMode = (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) ? true : false;
                    var members = olapClientMode ? "" : ej.PivotAnalysis.getMembers(items[i].fieldName);
                    var filtered = (items[i].filterItems != null && items[i].filterItems.values.length > 0) ? "filtered" : "";
                    if (axis == "filters") {
                        if (filtered == "filtered") {
                            filterState = ej.Pivot._getFilterState(olapClientMode, members, items[i], this.model.pivotControl);
                        }
                        else if (olapClientMode) {
                            if (ej.isNullOrUndefined(ej.olap.base.olapCtrlObj)) ej.olap.base.olapCtrlObj = this.model.pivotControl;
                            ej.olap._mdxParser.getAllMember(this.model.pivotControl.model.dataSource, items[i].fieldName, this.model.pivotControl);
                            filterState = this.model.pivotControl._allMember;
                        }
                        else
                            filterState = this.model.pivotControl._getLocalizedLabels("All");
                    }
                    rowBtns += ej.buildTag("div.e-pivotButton",
                                    ej.buildTag("div.e-dropIndicator")[0].outerHTML +
                                    ($(this.element).parents(".e-pivotclient").length > 0 ? (ej.buildTag("button.e-pvtBtn#pivotButton" + buttonId, (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? (this.model.pivotControl.model.showUniqueNameOnPivotButton ? (axis != "values" ? (items[i].fieldName.replace(/\[/g, '').replace(/\]/g, '')) : (items[i].fieldCaption != undefined ? items[i].fieldCaption : items[i].fieldName) || items[i]) : (items[i].fieldCaption != undefined ? items[i].fieldCaption : items[i].fieldName) || items[i]) : fldName || fldCaption) + (axis == "filters" && filterState != "" ? " (" + filterState + ")" : ""), {}, { "data-fieldName": items[i].fieldName || items[i], "data-fieldCaption": items[i].fieldCaption || items[i].fieldName, "data-axis": axis })[0].outerHTML) : (ej.buildTag("div.pvtBtnDiv", ej.buildTag("button.e-pvtBtn#pivotButton" + buttonId, (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? (this.model.pivotControl.model.showUniqueNameOnPivotButton ? (axis != "values" ? (items[i].fieldName.replace(/\[/g, '').replace(/\]/g, '')) : (items[i].fieldCaption != undefined ? items[i].fieldCaption : items[i].fieldName) || items[i]) : (items[i].fieldCaption != undefined ? items[i].fieldCaption : items[i].fieldName) || items[i]) : fldName || fldCaption) + (axis == "filters" && filterState != "" ? " (" + filterState + ")" : ""), {}, { "data-fieldName": items[i].fieldName || items[i], "data-fieldCaption": items[i].fieldCaption || items[i].fieldName, "data-axis": axis })[0].outerHTML).attr("data-tag", axis + ":" + items[i].fieldName)[0].outerHTML)) +
                                    ej.buildTag("span." + (this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne ? "e-removeClientPivotBtn" : "e-removePivotBtn"), {}, { "display": (this.model.layout != ej.PivotSchemaDesigner.Layouts.OneByOne ? "none" : "inline-block") }).addClass("e-icon")[0].outerHTML).attr("data-tag", axis + ":" + items[i].fieldName || items[i])[0].outerHTML;
                }
            }
            else {
                //if (axis == "values" && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) items = $.map(items, function (obj, index) { return obj["measures"]; });
                if (axis == "values") {
                    var axis = this.element.find(".e-pivotButton:contains(" + this._getLocalizedLabels("Measures") + ")").length > 0 ? this.element.find(".e-pivotButton:contains('" + this._getLocalizedLabels("Measures") + "')").parent()[0].className.split(" ")[0] : "e-schemaColumn";
                    axis = axis == "e-schemaColumn" ? "columns" : "rows";
                }
                for (var i = 0; i < items.length; i++) {
                    var filterState = "";
                    items[i].FieldHeader = items[i].FieldHeader == "Measures" ? this._getLocalizedLabels("Measures") : items[i].FieldHeader;
                    if (!ej.isNullOrUndefined(this.model.pivotControl) && (axis == "filters" || axis == "slicers")) {
                        filterState = ej.Pivot._getFilterState("", [], items[i], this.model.pivotControl);
                        axis = this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? "slicers" : axis;
                    }

                    rowBtns += ej.buildTag("div.e-pivotButton",
                                ej.buildTag("div.e-dropIndicator")[0].outerHTML +
                                ($(this.element).parents(".e-pivotclient").length > 0 ? (ej.buildTag("button.e-pvtBtn#pivotButton" + (items[i].FieldHeader || items[i].FieldName || items[i].DimensionHeader || items[i].DimensionName || items[i].Name), ((this.model.pivotControl.model.showUniqueNameOnPivotButton ? (axis != "values" ? items[i].Tag : (items[i].FieldHeader || items[i].FieldName || items[i].DimensionHeader || items[i].DimensionName || items[i].Name)) : (items[i].FieldHeader || items[i].FieldName || items[i].DimensionHeader || items[i].DimensionName || items[i].Name)) + ((axis == "filters" || axis == "slicers") && filterState != "" ? " (" + filterState + ")" : "")), {}, { "data-fieldName": items[i].FieldName || items[i].DimensionName || items[i].FieldHeader || items[i].DimensionHeader || items[i].Name || items[i], "data-fieldCaption": items[i].FieldHeader || items[i].DimensionHeader || items[i].FieldName || items[i].DimensionName, "data-axis": axis, "data-parentuniquename": items[i].ParentHierarchy })[0].outerHTML) : (ej.buildTag("div.pvtBtnDiv", ej.buildTag("button.e-pvtBtn#pivotButton" + (items[i].FieldHeader || items[i].FieldName || items[i].DimensionHeader || items[i].DimensionName || items[i].Name), ((this.model.pivotControl.model.showUniqueNameOnPivotButton ? (btnAxis != "values" ? items[i].Tag : (items[i].FieldHeader || items[i].FieldName || items[i].DimensionHeader || items[i].DimensionName || items[i].Name)) : (items[i].FieldHeader || items[i].FieldName || items[i].DimensionHeader || items[i].DimensionName || items[i].Name)) + ((axis == "filters" || axis == "slicers") && filterState != "" ? " (" + filterState + ")" : "")), {}, { "data-fieldName": items[i].FieldName || items[i].DimensionName || items[i].FieldHeader || items[i].DimensionHeader || items[i].Name || items[i], "data-fieldCaption": items[i].FieldHeader || items[i].DimensionHeader || items[i].FieldName || items[i].DimensionName, "data-axis": axis, "data-parentuniquename": items[i].ParentHierarchy })[0].outerHTML).attr("data-tag", axis + ":" + items[i].Tag)[0].outerHTML)) +
                                ej.buildTag("span." + (this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne ? "e-removeClientPivotBtn" : "e-removePivotBtn"), {}, { "display": (this.model.layout != ej.PivotSchemaDesigner.Layouts.OneByOne ? "none" : "inline-block") }).addClass("e-icon")[0].outerHTML).attr("data-tag", axis + ":" + items[i].Tag)[0].outerHTML;
                }
            }
            return rowBtns;
        },

        _pvtBtnDropped: function (args) {
            this.element.find(".e-dropIndicator").removeClass("e-dropIndicatorHover");
            $(args.element).parent().removeClass("dragHover");
            $(args.element).removeClass("dragHover");
            $("#" + this._id + "_dragClone").remove();
            var headerTag = "";
            var draggedClass = "";
            this._isDragging = false;
            if ($(this.element).parents(".e-pivotclient").length > 0 && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                if ($(args.target).hasClass("e-pivotButton"))
                    args.target = args.target.childNodes[1];
                var droppedClass = !ej.isNullOrUndefined(args.target.className.indexOf) ? ($(args.target).attr("class") ? args.target.className.indexOf("e-droppable") >= 0 ? args.target.className.split(" ")[0] : (args.target.className.split(" ")[0] == "e-pvtBtn" ? $(args.target).parents('div.e-droppable').attr("class").split(" ")[0] : "") : "") : "";
                if (droppedClass.indexOf("e-") > -1) { droppedClass = droppedClass.replace("e-", "") };
                var headerText = args.element.attr("data-fieldCaption") || args.element.attr("data-fieldName"), report;
                var headerName = args.element.parent().attr("data-tag").split(":")[1];
                var droppedPosition = ej.isNullOrUndefined(args.event) ? "" : this._setSplitBtnTargetPos(args.event);
                for (var i = 0; i < this.model.pivotTableFields.length; i++) {
                    if (this.model.pivotTableFields[i].name == headerText) {
                        this.model.pivotTableFields[i].isSelected = true;
                        headerTag = this.model.pivotTableFields[i];
                        break;
                    }
                }
                try { report = JSON.parse(this.model.pivotControl.getOlapReport()).Report; }
                catch (err) { report = this.model.pivotControl.getOlapReport(); }
                if (!ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                    this.model.pivotControl._waitingPopup.show();
                if (droppedClass == "") {
                    delete this.model.pivotControl._fieldMembers[headerName];
                    delete this.model.pivotControl._fieldSelectedMembers[headerName];
                    this._clearFilterData(headerName);
                }
                if (($(this.element).parents(".e-pivotclient").length > 0)) {
                    if (this.model.pivotControl.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this.model.pivotControl._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.model.pivotControl.element, customObject: this.model.pivotControl.model.customObject });
                }
                var eventArgs = JSON.stringify({ "action": this.model.pivotControl.model.enableDeferUpdate ? "nodeDroppedDeferUpdate" : "nodeDropped", "args": JSON.stringify({ "droppedFieldCaption": headerText, "droppedFieldName": headerName, "headerTag": headerTag, "dropAxis": droppedClass, "droppedPosition": droppedPosition, "currentReport": report, "sortedHeaders": !ej.isNullOrUndefined(this.model.pivotControl._ascdes) ? this.model.pivotControl._ascdes : "" }) + "-##-" + JSON.stringify(this.model.pivotControl.model.valueSortSettings), "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs, this._pvtNodeDroppedSuccess);
                return;
            }
            this.model.pivotControl._isUpdateRequired = true;
            this._isDragging = false;
            var axis = null, axisName = "", headerText, droppedClass, isFiltered = isFiltered = args.element.find("~ .filtered").length > 0 ? true : false, isSorted = false;
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                if (!ej.isNullOrUndefined(args.target.className)) {
                    axis = args.target.className.indexOf("e-pvtBtn") > -1 ? $(args.target).parents(".e-droppable")[0] : args.target.className.indexOf("e-droppable") ? args.target : args.target[0].tagName.toLowerCase() == "td" ? args.target.children(":last")[0] : args.target;
                }
                else {
                    axis = args.target;
                }
                if (!ej.isNullOrUndefined(axis.className)) {
                    axisName = axis.className.split(" ")[0] == "e-schemaColumn" ? "Categorical" : axis.className.split(" ")[0] == "e-schemaRow" ? "Series" : axis.className.split(" ")[0] == "e-schemaFilter" ? "Slicer" : "";
                    droppedClass = axis.className.split(" ")[0];
                    if (droppedClass.indexOf("e-") > -1) {
                        droppedClass = droppedClass.replace("e-", "");
                    }
                }
                else {
                    axisName = axis.hasClass("e-schemaColumn") ? "Categorical" : axis.hasClass("e-schemaRow") ? "Series" : axis.hasClass("e-schemaFilter") ? "Slicer" : "";
                    this._droppedClass = droppedClass = axis.hasClass("e-schemaColumn") ? "e-schemaColumn" : axis.hasClass("e-schemaRow") ? "e-schemaRow" : axis.hasClass("e-schemaFilter") ? "e-schemaFilter" : axis.hasClass("e-schemaValue") ? "e-schemaValue" : "";
                }
                if (axisName == "" && args.element.parent().attr("data-tag").toLowerCase().indexOf("[measures]") > -1)
                    axisName = this.element.find(".e-schemaRow .e-pivotButton:contains('" + this._getLocalizedLabels("Measures") + "')").length > 0 ? "Series" : "Categorical";
                this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? (headerText = headerTag = $(args.element.parent()[0]).attr("data-tag").split(":")[1]) : headerTag = $(args.element.parent()[0]).attr("data-tag");
                if (!ej.isNullOrUndefined(args.element.parent()))
                    draggedClass = args.element.parents(".e-schemaValue").length > 0 ? "schemaValue" : args.element.parents(".e-schemaFilter").length > 0 ? "schemaFilter" : args.element.parents(".e-schemaRow").length > 0 ? "schemaRow" : args.element.parents(".e-schemaColumn").length > 0 ? "schemaColumn" : "";
            }
            else {
                if (!ej.isNullOrUndefined(args.target.className)) {
                    droppedClass = args.target.className.indexOf("e-droppable") >= 0 ? args.target.className.split(" ")[0] : (args.target.className.split(" ")[0] == "e-pvtBtn" ? $(args.target).parents('div.e-droppable').attr("class").split(" ")[0] : "");
                    if (droppedClass.indexOf("e-") > -1) {
                        droppedClass = droppedClass.replace("e-", "");
                    }
                }
                else {
                    droppedClass = $(args.target).hasClass("e-schemaColumn") ? "schemaColumn" : $(args.target).hasClass("e-schemaRow") ? "schemaRow" : $(args.target).hasClass("e-schemaFilter") ? "schemaFilter" : $(args.target).hasClass("e-schemaValue") ? "schemaValue" : "";
                }
                headerText = this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? $.grep(this.model.pivotTableFields, function (item) { return item.caption == args.element.text(); })[0].name : (args.element.attr("data-fieldCaption") || args.element.attr("title")), headerTag, isFiltered = args.element.find("~ .e-filterIndicator").length > 0 ? true : false,
                isSorted = args.element.find("~ span:eq(0) span.descending").length > 0 ? true : false;
                for (var i = 0; i < this.model.pivotTableFields.length; i++) {
                    if (this.model.pivotTableFields[i].name == headerText) {
                        this.model.pivotTableFields[i].isSelected = true;
                        headerTag = this.model.pivotTableFields[i];
                    }
                }
            }
            if (this._dataModel == "Olap") {
                if (((headerTag.split(":")[1].toLocaleUpperCase() == "MEASURES" || headerTag.split(":")[1].toLocaleUpperCase() == "KPI") && (droppedClass != "schemaColumn" || droppedClass != "schemaRow") && (droppedClass == "schemaFilter" || droppedClass == "schemaValue")) || (headerTag.toUpperCase().indexOf("[MEASURES]") > -1 && droppedClass != "schemaValue" && (droppedClass == "schemaRow" || droppedClass == "schemaColumn" || droppedClass == "schemaFilter"))) {
                    this._createErrorDialog();
                    return false;
                }
                else if ((headerTag.toUpperCase().indexOf("[MEASURES]") == -1 || headerTag.toUpperCase().indexOf("KPI") == -1) && droppedClass == "schemaValue" && draggedClass != droppedClass) {
                    this._createErrorDialog();
                    return false;
                }
            }
            if (droppedClass == "schemaValue" || droppedClass == "schemaRow" || droppedClass == "schemaColumn" || droppedClass == "schemaFilter") {
                if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && this._dataModel == "Pivot" && droppedClass != "schemaValue" && ($.grep(this.model.pivotControl._calculatedField, function (value) { return value.name == headerText; }).length > 0 || $.grep(JSON.parse(this.model.pivotControl.getOlapReport()).PivotCalculations, function (value) { return value.FieldHeader == headerText && value.CalculationType == 8; }).length > 0)) {
                    this.model.pivotControl._createErrorDialog(this.model.pivotControl._getLocalizedLabels("CalcValue"), this.model.pivotControl._getLocalizedLabels("Warning"));
                    return;
                }
                if (!ej.isNullOrUndefined(args.event)) {
                    var droppedPosition = this._setSplitBtnTargetPos(args.event), params, report, eventArgs;
                }
                else {
                    var droppedPosition = "", params, report, eventArgs;
                }
                try {
                    report = JSON.parse(this.model.pivotControl.getOlapReport()).Report;
                }
                catch (err) {
                    if (!ej.isNullOrUndefined(this.model.pivotControl.getOlapReport))
                        report = this.model.pivotControl.getOlapReport();
                }
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                    this.model.pivotControl.dataSource = this.model.pivotControl._clearDrilledItems(this.model.pivotControl.model.dataSource, { action: "nodeDropped" });
                    var isNamedSet = droppedClass == "schemaFilter" && (this.model.pivotControl._getNodeByUniqueName(headerText) != null && this.model.pivotControl._getNodeByUniqueName(headerText).find(".e-namedSetCDB").length > 0);
                    var isMeasures = ($(args.element.parent()).attr("data-tag").split(":")[0] == "Columns" && this._droppedClass == "schemaColumn" && headerTag.toLowerCase() == "measures") || ($(args.element.parent()).attr("data-tag").split(":")[0] == "Rows" && this._droppedClass == "schemaRow" && headerTag.toLowerCase() == "measures")
                    if (isMeasures || isNamedSet || headerText.toLowerCase().indexOf("[measures]") >= 0 && droppedClass != "schemaValue" || (droppedClass == "schemaValue" && !(headerText.toLowerCase().indexOf("[measures]") >= 0)) || (droppedClass == "schemaFilter" && headerText.toLowerCase().indexOf("measures") >= 0)) {
                        this._waitingPopup.hide();
                        if (!isMeasures)
                            this._createErrorDialog();
                        return args.Cancel;
                    }
                    else if (headerText.toLowerCase().indexOf(("measures")) >= 0 && (!(headerText.toLowerCase().indexOf("[measures]") >= 0))) {
                        $(args.element.parent().parent()).remove();
                        this.model.pivotControl.model.dataSource.values[0]["axis"] = droppedClass == "schemaRow" ? "rows" : droppedClass == "schemaColumn" ? "columns" : "columns";
                        this._createPivotButton({ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }, droppedClass == "schemaRow" ? "row" : droppedClass == "schemaColumn" ? "column" : "column", "", "", droppedPosition);
                        ej.olap.base.getJSONData({ action: "nodeDropped" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
                        this._waitingPopup.hide();
                        this._setPivotBtnWidth();
                        return false;
                    }
                }
                if (this.model.pivotControl._dataModel == "Pivot" && droppedClass != "schemaValue" && $.grep(this.model.pivotControl._calculatedField, function (value) { return value.name == headerText; }).length > 0) {
                    alert(this.model.pivotControl._getLocalizedLabels("CalcValue"));
                    return;
                }
                $(args.element.parent().parent()).remove();
                if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    if (!this.model.pivotControl.model.enableDeferUpdate && !ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                        this.model.pivotControl._waitingPopup.show();
                    this.element.find(".schemaNoClick").addClass("freeze").width($(this.element).width()).height($(this.element).height()).css({ "top": $(this.element).offset().top, "left": $(this.element).offset().left });
                    if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        params = this._currentCubeName + "--" + headerTag + "--" + axisName + "--" + droppedPosition;
                        if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                            this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.pivotControl.model.customObject });
                        eventArgs = JSON.stringify({ "action": "nodeDropped", "dropType": "SplitButton", "nodeInfo": params, "currentReport": report, "gridLayout": this.model.pivotControl.model.layout, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                        if (!this.model.pivotControl.model.enableDeferUpdate)
                            this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs, this._droppedSuccess);
                        else {
                            this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs.replace("nodeDropped", "nodeDroppedDeferUpdate"), this._droppedSuccess);
                        }
                    }
                    else {
                        this._createPivotButton({ fieldName: args.element.attr("data-fieldName") || args.element.attr("title"), fieldCaption: args.element.attr("data-fieldCaption") || args.element.attr("title") }, droppedClass == "schemaRow" ? "row" : droppedClass == "schemaColumn" ? "column" : droppedClass == "schemaFilter" ? "filter" : droppedClass == "schemaValue" ? "value" : "", isFiltered, isSorted, droppedPosition);
                        if (!ej.isNullOrUndefined(this.model.pivotControl._calculatedField) && this.model.pivotControl._calculatedField.length > 0 && droppedClass != "schemaValue")
                            this.model.pivotControl._calculatedFieldNodeRemove(headerTag);
                        if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                            this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.pivotControl.model.customObject });
                        var filterParams = "";
                        filterParams = ej.Pivot._getFilterParams(droppedClass, this._tempFilterData, headerText);
                        eventArgs = JSON.stringify({ "action": "nodeDropped", "dropAxis": droppedClass + "::" + droppedPosition, "filterParams": filterParams, "headerTag": JSON.stringify(headerTag), "sortedHeaders": this.model.pivotControl._ascdes, "currentReport": report, "valueSorting": JSON.stringify(this.model.pivotControl.model.valueSortSettings), "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                        var successMethod = this.model.pivotControl._renderControlSuccess;
                        if (!this.model.pivotControl.model.enableDeferUpdate)
                            this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs, this._pvtNodeDroppedSuccess);
                        else {
                            this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs.replace("nodeDropped", "nodeDroppedDeferUpdate"), this._pvtNodeDroppedSuccess);
                            if (!ej.isNullOrUndefined(this.model.pivotControl._ogridWaitingPopup))
                                this.model.pivotControl._ogridWaitingPopup.hide();
                        }
                    }
                }
                else {
                    var droppedItem = this.model.pivotControl._getDroppedItem(headerText), buttonFields = {};

                    if (droppedItem.length > 0) {
                        buttonFields = (droppedItem[0]["isNamedSets"] != undefined) ? { fieldName: droppedItem[0].fieldName, fieldCaption: droppedItem[0].fieldCaption, isNamedSets: droppedItem[0]["isNamedSets"] } : { fieldName: droppedItem[0].fieldName, fieldCaption: droppedItem[0].fieldCaption };
                    }
                    var dropAxis = droppedClass == "schemaRow" ? "row" : droppedClass == "schemaColumn" ? "column" : droppedClass == "schemaFilter" ? "filter" : droppedClass == "schemaValue" ? "value" : "";
                    this._createPivotButton(buttonFields, dropAxis, isFiltered, isSorted, droppedPosition);
                    if ($.isNumeric(droppedPosition))
                        droppedClass == "schemaRow" ? this.model.pivotControl.model.dataSource.rows.splice(droppedPosition, 0, droppedItem[0]) : droppedClass == "schemaColumn" ? this.model.pivotControl.model.dataSource.columns.splice(droppedPosition, 0, droppedItem[0]) : droppedClass == "schemaValue" ?
                            (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) ? this.model.pivotControl.model.dataSource.values[0]["measures"].splice(droppedPosition, 0, droppedItem[0]) : this.model.pivotControl.model.dataSource.values.splice(droppedPosition, 0, droppedItem[0]) : this.model.pivotControl.model.dataSource.filters.splice(droppedPosition, 0, droppedItem[0]);
                    else
                        droppedClass == "schemaRow" ? this.model.pivotControl.model.dataSource.rows.push(droppedItem[0]) : droppedClass == "schemaColumn" ? this.model.pivotControl.model.dataSource.columns.push(droppedItem[0]) : droppedClass == "schemaValue" ? (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) ? this.model.pivotControl.model.dataSource.values[0]["measures"].push(droppedItem[0]) : this.model.pivotControl.model.dataSource.values.push(droppedItem[0]) : this.model.pivotControl.model.dataSource.filters.push(droppedItem[0]);

                    if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.pivotControl._calculatedField.length > 0 && droppedClass != "schemaValue") {
                        var removeElement = $.grep(this.model.pivotControl.model.dataSource.values, function (value) { return (ej.isNullOrUndefined(value.isCalculatedField) || value.isCalculatedField == false) || (value.isCalculatedField == true && value.formula.indexOf(droppedItem[0].fieldName) == -1); });
                        var schemaRemoveElement = $.grep(this.model.pivotControl.model.dataSource.values, function (value) { return value.isCalculatedField == true && value.formula.indexOf(droppedItem[0].fieldName) > -1; });
                        for (var i = 0; i < schemaRemoveElement.length; i++)
                            this._tableTreeObj.uncheckNode(schemaRemoveElement[i].fieldName);
                        this.model.pivotControl.model.dataSource.values = removeElement;
                    }

                    if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        var measuresAxis = this.model.pivotControl.model.dataSource.values[0]["axis"] == "columns" ? "Columns:" : "Rows:";
                        var measureElement = (this.element.find("div[data-tag='" + measuresAxis + "Measures" + "']:first"));
                        measureElement.appendTo(measureElement.parent());
                        var dragAxis = args.element.attr("data-axis").toLowerCase();
                        this.model.pivotControl.model.dataSource = this.model.pivotControl._clearDrilledItems(this.model.pivotControl.model.dataSource, { action: "nodeDropped" });
                    }

                    if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        if (!ej.isNullOrUndefined(this.model.pivotControl._ogridWaitingPopup))
                            this.model.pivotControl._ogridWaitingPopup.show();
                        ej.olap.base.getJSONData({ action: "nodeDropped" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
                    }
                    else {
                        this._trigger("fieldItemDropped", { axis: dropAxis, fieldItem: droppedItem });
                        this.model.pivotControl.model.editCellsInfo = {};
                        this.model.pivotControl._populatePivotGrid();
                    }
                }
            }
            else
                this._removePvtBtn(args);
            this._setPivotBtnWidth();
        },

        _createErrorDialog: function () {
            ej.Pivot.openPreventPanel(this);
            if (this.element.find(".e-errorDialog").length == 0) {
                var dialogElem = ej.buildTag("div.e-errorDialog#ErrorDialog", ej.buildTag("div.warningImg")[0].outerHTML + ej.buildTag("div.warningContent", this._getLocalizedLabels("AlertMsg"))[0].outerHTML + ej.buildTag("div", ej.buildTag("button#ErrOKBtn.e-errOKBtn", "OK")[0].outerHTML)[0].outerHTML).attr("title", this._getLocalizedLabels("Warning"))[0].outerHTML;
                this.element.append(dialogElem);
                this.element.find(".e-errorDialog").ejDialog({ target: "#" + this._id, enableResize: false, enableRTL: this.model.enableRTL, width: "400px", close: ej.proxy(ej.Pivot.closePreventPanel, this) });
                this._errorDialog = this.element.find(".e-errorDialog").data("ejDialog");
                this.element.find(".e-errOKBtn").ejButton({ type: ej.ButtonType.Button, click: ej.proxy(this._errOKBtnClick, this) });
                this.element.find(".e-dialog .e-close").attr("title", this._getLocalizedLabels("Close"));
            }
            else {
                this._errorDialog.open();
            }
        },

        _errOKBtnClick: function (args) {
            ej.Pivot.closePreventPanel(this);
            this._errorDialog._ejDialog.find("div.e-dialog-icon").trigger("click");
        },

        _hideSchemaDesigner: function (args) {
            $("#" + this._id).animate({ left: "-" + $("#" + this._id).width() + "px" }, 500, function () {
            });
            this.element.find(".collapseSchema").addClass("expandSchema").removeClass("collapseSchema");
        },

        _showSchemaDesigner: function (args) {
            $("#" + this._id).animate({ left: "5px" });
            this.element.find(".expandSchema").addClass("collapseSchema").removeClass("expandSchema");
        },
        _reSizeHandler: function (args) {
            if (this.model.pivotControl) {
                var axisTblWidth = $("#" + this._id).width();
                if (this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne) {


                    this.element.find(".e-axisTd1, .e-axisTd2").css({ "width": "100%" });

                    if (!this._pivotClientObj.model.isResponsive || !this._pivotClientObj.model.enableSplitter) {
                        var schemaWidth = this._pivotClientObj.element.find("#" + this._id).width() / 2;
                        this._pivotClientObj.element.find("div.e-fieldTable").width(schemaWidth - 6);
                        this._pivotClientObj.element.find("div.e-axisTable").width(schemaWidth - 5);
                    }
                    if (this._pivotClientObj.model.isResponsive)
                        this._pivotClientObj.element.find("div.e-axisTable").css({ "width": "52%" });
                    if (this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne && this._pivotClientObj.model.enableSplitter) {
                        if (this._pivotClientObj.model.enableVirtualScrolling)
                            this._pivotClientObj.element.find("div.e-axisTable").css({ "padding-right": "12px" });
                        else {
                            if (this._pivotClientObj.model.isResponsive)
                                this._pivotClientObj.element.find("div.e-fieldTable").css({ "padding-right": "2px" });
                            else
                                this._pivotClientObj.element.find("div.e-fieldTable").css({ "padding-right": "1px" });
                        }
                    }
                }
                else {
                    this.element.find("div.e-axisTable").width(axisTblWidth);
                    var axisTdwidth = (axisTblWidth - 2) / 2;
                    this.element.find(".e-axisTd1").css({ "width": axisTdwidth - 6 });
                    this.element.find(".e-axisTd2").css({ "width": axisTdwidth });
                    this.element.find("div.parentSchemaFieldTree, .e-schemaFieldTree, div.e-fieldTable").css({ width: axisTblWidth - 23 });
                }
                var sFldHeight = (ej.PivotSchemaDesigner.Layouts.OneByOne == this.model.layout) ? (this._pivotClientObj.model.enableVirtualScrolling || this._pivotClientObj.model.enablePaging ? (this._pivotClientObj.element.height() - ((this._pivotClientObj.element.find("div.e-titleText").length > 0 ? 50 : 0) + this._pivotClientObj.element.find("#reportToolbar").height() + (this._pivotClientObj.model.enablePaging ? 22 : 30))) : this._pivotClientObj.element.find(".e-controlPanel").height() - 17) : (25 / 100) * $("#" + this._id).height();

                if (this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne)
                    sFldHeight = (this.element.find(".e-cubelists").length > 0) ? (sFldHeight - (this._pivotClientObj.model.enableVirtualScrolling || this._pivotClientObj.model.enablePaging ? 30 : 28)) : sFldHeight + 4;
                this.element.find("div.parentSchemaFieldTree, .e-schemaFieldTree, div.e-fieldTable").height(sFldHeight);

                if (this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne)
                    this.element.find("div.e-schemaFieldTree").height(sFldHeight - 35);

                if (!($(this.element).parents(".e-pivotclient").length > 0)) {
                    if ($("#" + this._id).height() < 450) {
                        $("#" + this._id).css("min-height", "450px");
                    }
                    if ($("#" + this._id).width() < 270) {
                        $("#" + this._id).css("min-width", "270px");
                    }
                }

                var axisTblHeight, axisTrHeight;
                var pivotSchemaHeight = $(this.element).parents(".e-pivotclient").length > 0 ? (this._pivotClientObj.model.enableVirtualScrolling || this._pivotClientObj.model.enablePaging ? (this._pivotClientObj.element.height() - ((this._pivotClientObj.element.find("div.e-titleText").length > 0 ? 50 : 0) + this._pivotClientObj.element.find("#reportToolbar").height() + (this._pivotClientObj.model.enablePaging ? 15 : 25))) : this._pivotClientObj.element.find(".e-controlPanel").height() - 10) : $("#" + this._id).height() + 20;
                var axisRemainingHeight = (ej.PivotSchemaDesigner.Layouts.OneByOne == this.model.layout) ? 0 : this.element.find("table.headerTable").height() + this.element.find("div.e-fieldTable").height() + this.element.find("div.centerDiv").height() + this.element.find("div.centerHead").height();
                if (this.model.pivotControl != null && (!this.model.pivotControl.element.hasClass("e-pivotclient")) && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    axisTblHeight = pivotSchemaHeight - (axisRemainingHeight + 90);
                    this.element.find("#axisTd, #axisTd3").css("margin-top", "5px");
                }
                else if (ej.PivotSchemaDesigner.Layouts.OneByOne == this.model.layout)
                    axisTblHeight = pivotSchemaHeight;
                else {
                    axisTblHeight = pivotSchemaHeight - (axisRemainingHeight + 55);

                }
                this.element.find("div.e-axisTable").height(axisTblHeight);
                axisTrHeight = (axisTblHeight / ((this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne) ? 4 : 2));
                this.element.find(".e-axisTd1,.e-axisTd2").css({ "height": axisTrHeight });
                if ($(this.element).parents(".e-pivotclient").length > 0) {
                    this._pivotClientObj.element.find(".e-schemaColumn, .e-schemaRow, .e-schemaFilter").height(axisTrHeight - 33.5);
                    this._pivotClientObj.element.find(".e-schemaValue").height(axisTrHeight - 31.5);
                }
                this._setPivotBtnWidth();
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    var treeList = $(".e-schemaFieldTree ul>li div").width();
                    $($(".e-pivotschemadesigner .e-schemaFieldTree.e-treeview .e-text")).each(function (e) {
                        var percent = ((treeList - (50)) / treeList) * 100;
                        $(this).width(percent.toString() + "%");
                    });
                }
            }
        },

        _clientDialogBtnClick: function (args) {
            var selectedNodes = [], unSelectedNodes = [], pivotObj = this.model.pivotControl, hierarchyUQName = this._selectedFieldName, getTreeNodeState = {}, reportItem, me = this;
            var pivotClientObj = ($(this.element).parents(".e-pivotclient").length > 0) ? $(this.element).parents(".e-pivotclient").data("ejPivotClient") : null;
            if (this.element.find(".e-editorTreeView").find("li span.e-searchfilterselection").length > 0)
                this.element.find(".e-editorTreeView").ejTreeView("removeNode", this.element.find(".e-editorTreeView").find("li span.e-searchfilterselection").closest("li"));
            this.element.find(".e-dialog, .e-clientDialog").hide();
            this.element.find("#preventDiv").remove();
            if ($(args.target).hasClass("e-dialogCancelBtn")) {
                pivotObj._currentReportItems = $.extend(true, [], pivotObj._savedReportItems);
                return;
            }
            else
                pivotObj._savedReportItems = $.extend(true, [], pivotObj._currentReportItems);
            if (!ej.isNullOrUndefined(pivotClientObj)) {
                pivotClientObj._isTimeOut = true;
                setTimeout(function () {
                    if (pivotClientObj._isTimeOut)
                        me.model.pivotControl._waitingPopup.show();
                }, 800);
            }
            else
                pivotObj._waitingPopup.show();
            if (pivotObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                if (pivotObj.element.hasClass("e-pivotclient") && !ej.isNullOrUndefined(pivotObj._pivotChart))
                    pivotObj._pivotChart._labelCurrentTags = {};
                ej.olap.base.clearDrilledItems(pivotObj.model.dataSource, { action: "filtering" }, pivotObj)

                this._memberTreeObj = ej.Pivot.updateTreeView(this);
                var hierarchyName = this._selectedFieldName, currentDataSrc = pivotObj.model.dataSource, filterIndex = {};
                getTreeNodeState = ej.Pivot.getNodesState(!ej.isNullOrUndefined(pivotObj) && (pivotObj.model.enableMemberEditorPaging || this._editorTreeData.length > 0) ? this._editorTreeData : this._memberTreeObj);
                var member = ej.Pivot._getEditorMember(hierarchyName.toLocaleLowerCase(), pivotObj, true), selMem = "selectedNodes", ftype = "include", isMondrian = pivotObj.model.dataSource.providerName == "mondrian";
                pivotObj._fieldSelectedMembers[hierarchyName.toLocaleLowerCase()] = $.map(pivotObj._fieldMembers[hierarchyName.toLocaleLowerCase()], function (item) { if (!item.checked) return item }).length == 0 ? "All" : ((member != "All" && member != "multiple") ? member : pivotObj._getLocalizedLabels("MultipleItems"));
                reportItem = ej.Pivot.getReportItemByFieldName(this._selectedFieldName, pivotObj.model.dataSource, this._dataModel)["item"];
                if (isMondrian) {
                    selMem = "unSelectedNodes";
                    ftype = "exclude";
                }
                selectedNodes = $.map(getTreeNodeState[selMem].split("::"), function (element, index) { { return { Id: element.split("||")[0], tag: element.split("||")[1], parentId: element.split("||")[2] } } });
                if (!ej.isNullOrUndefined(pivotObj._selectedNodes)) {
                    for (var i = 0; i < pivotObj._selectedNodes.length; i++) {
                        var selectedTreeNode = pivotObj._selectedNodes[i],
                        sameTreeEle = $.map(selectedNodes, function (item, index) { if (selectedTreeNode.tag == item.tag) return item });
                        if (sameTreeEle.length == 0)
                            selectedNodes.push(pivotObj._selectedNodes[i]);
                    }
                }
                if (!ej.isNullOrUndefined(reportItem)) {
                    reportItem["advancedFilter"] = [];
                    reportItem.filterItems = { filterType: ftype, values: ej.Pivot.removeParentSelectedNodes(selectedNodes) };
                    this._selectedTreeNode = this.element.find(".e-schemaFieldTree").find("li[data-tag='" + reportItem.fieldName + "']");
                    if ($(this._selectedTreeNode).parents("li:eq(0) span:eq(0)").hasClass("e-hierarchyCDB"))
                        this._selectedTreeNode = $(this._selectedTreeNode).parents("li:eq(0)");
                    if (getTreeNodeState["unSelectedNodes"] != "") {
                        if (!isMondrian)
                            pivotObj.model.dataSource = ej.olap.base.clearDrilledItems(pivotObj.model.dataSource, { action: "filtering" }, pivotObj);
                        if ($(this._selectedTreeNode).find(".filter").length <= 0) {
                            $($(this._selectedTreeNode).find(".e-text")[0]).after(ej.buildTag("span.e-icon").attr("role", "button").attr("aria-label", "filtered").addClass("filter")[0].outerHTML);
                            this.element.find(".e-pivotButton:contains('" + this._selectedFieldName + "') .filter").addClass("filtered");
                            this.element.find(".e-pvtBtn[data-fieldName='" + this._selectedFieldName + "']").parent().find(".filter").addClass("filtered");
                        }
                    }
                    else if (pivotObj._unSelectedNodes) {
                        if (!isMondrian)
                            pivotObj.model.dataSource = ej.olap.base.clearDrilledItems(pivotObj.model.dataSource, { action: "filtering" }, pivotObj);
                        if ($(this._selectedTreeNode).find(".filter").length <= 0) {
                            $($(this._selectedTreeNode).find(".e-text")[0]).after(ej.buildTag("span.e-icon").attr("role", "button").attr("aria-label", "filtered").addClass("filter")[0].outerHTML);
                            this.element.find(".e-pivotButton:contains('" + this._selectedFieldName + "') .filter").addClass("filtered");
                            this.element.find(".e-pvtBtn[data-fieldName='" + this._selectedFieldName + "']").parent().find(".filter").addClass("filtered");
                        }
                    }
                    else {
                        this.element.find(".e-pvtBtn[data-fieldName='" + this._selectedFieldName + "']").parent().find(".filter").removeClass("filtered");
                        this._selectedTreeNode.find(".filter").remove();
                        delete reportItem.filterItems;
                    }
                }
                if (pivotObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap && pivotObj.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                    var hierarchyName = this._selectedFieldName, currentDataSrc = pivotObj.model.dataSource;
                    pivotObj._currentReportItems = $.map(pivotObj._currentReportItems, function (obj, index) {
                        if ((obj["fieldName"] != hierarchyName) && (ej.isNullOrUndefined(obj.dataSrc) || (obj.dataSrc.cube == currentDataSrc.cube && obj.dataSrc.reportName == currentDataSrc.reportName))) {
                            return obj;
                        }
                    });
                    if (pivotObj.model.enableMemberEditorPaging || this._editorTreeData.length > 0) {
                        filterIndex = $.extend(true, [], this._editorTreeData);
                    }
                    else
                        filterIndex = $.extend([], this._memberTreeObj.dataSource());
                    // this.model.pivotControl._currentReportItems.push({ filterItems: filterIndex, fieldName: hierarchyName, dataSrc: this.model.pivotControl.model.dataSource, pageSettings: this._memberCount });
                    if (isMondrian) {
                        var maxLen = 2;
                        for (var itm = 0; itm < filterIndex.length; itm++) {
                            if (!ej.isNullOrUndefined(filterIndex[itm].level) && filterIndex[itm].level > maxLen)
                                maxLen = filterIndex[itm].level;
                        }
                        pivotObj.model.dataSource._maxLevel = maxLen;
                    }
                    pivotObj._currentReportItems.push({ filterItems: filterIndex, fieldName: hierarchyName, dataSrc: pivotObj.model.dataSource, pageSettings: this._memberCount });
                }

                ej.olap.base.getJSONData({ action: "filtering" }, pivotObj.model.dataSource, pivotObj);
            }
            else {
                ej.PivotAnalysis._valueSorting = null;
                if (this.model.pivotControl.model.enableMemberEditorPaging || this._editorTreeData.length > 0) {
                    jQuery.each(this._editorTreeData, function (index, item) { if (item.id != "All" && item.id != "(All)_0" && item.checkedStatus) selectedNodes.push(item.name); });
                    jQuery.each(this._editorTreeData, function (index, item) {
                        if (!item.checkedStatus)
                            unSelectedNodes.push(item.name = item.name == "(blank)" ? "" : item.name);
                    });
                }
                else {
                    jQuery.each(this._memberTreeObj.element.find(":input.nodecheckbox:checked"), function (index, item) { if (item.value != "All") selectedNodes.push(item.value); });
                    jQuery.each(this._memberTreeObj.element.find(":input.nodecheckbox:not(:checked)"), function (index, item) {
                        unSelectedNodes.push(item.value = item.value == "(blank)" ? "" : $(item).parents("li").find('a').text());
                    });
                }
                if (this._selectedFieldName) {
                    var reportItem = reportItem = ej.Pivot.getReportItemByFieldName(this._selectedFieldName, pivotObj.model.dataSource, this._dataModel)["item"];
                    if (reportItem)
                        reportItem["advancedFilter"] = [];
                }
                this._pivotFilterItems(selectedNodes, unSelectedNodes);
                this.model.pivotControl.refreshControl()
            }
            this._refreshPivotButtons();
            pivotObj._isMemberPageFilter = true;
            if (!ej.isNullOrUndefined(pivotClientObj))
                if (pivotClientObj._isTimeOut) pivotClientObj._isTimeOut = false;
        },

        _pivotFilterItems: function (selectedNodes, unSelectedNodes) {
            var axisItems = this.model.pivotControl.model.dataSource[this._selectedFieldAxis];
            var members = ej.PivotAnalysis.getMembers(this._selectedFieldName);
            jQuery.each(members, function (itemIndex, itemValue) {
                if (itemValue == null || !itemValue.toString().replace(/^\s+|\s+$/gm, '')) {
                    jQuery.each(unSelectedNodes, function (nodeIndex, nodeValue) {
                        if (!nodeValue.toString().replace(/^\s+|\s+$/gm, ''))
                            unSelectedNodes[nodeIndex] = itemValue;
                    });
                }
            });
            var selectedField = this._selectedFieldName;
            var items = $.grep(axisItems, function (item) { return item.fieldName == selectedField });
            for (var i = 0; i < items.length; i++)
                items[i].filterItems = selectedNodes.length == members.length ? null : { filterType: ej.PivotAnalysis.FilterType.Exclude, values: unSelectedNodes };
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode)
                this._selectedFieldName = this._selectedFieldName.replace(/ /g, '_');
            if (unSelectedNodes.length > 0 && this.element.find(".e-schemaFieldTree li[id='" + this._selectedFieldName + "']").find(".filter").length <= 0) {
                var filterSpan = ej.buildTag("span.e-icon", { "display": "none" }).addClass("filter")[0].outerHTML;
                this.element.find(".e-schemaFieldTree li[id='" + this._selectedFieldName + "']").find(".e-text").after(filterSpan);
                this.element.find(".e-pvtBtn[data-fieldName='" + this._selectedFieldName + "']").parent().find(".filter").addClass("filtered");
            }
            else if (unSelectedNodes.length == 0) {
                this.element.find(".e-pvtBtn[data-fieldName='" + this._selectedFieldName + "']").parent().find(".filter").removeClass("filtered");
                this.element.find(".e-schemaFieldTree li[id='" + this._selectedFieldName + "']").find(".filter").remove();
            }
        },
        _dialogBtnClick: function (args) {
            ej.Pivot.closePreventPanel(this);
            this.element.find(".e-dialog, .e-clientDialog").hide();
            var schemaObj = this;
            var pivotClientObj = ($(this.element).parents(".e-pivotclient").length > 0) ? $(this.element).parents(".e-pivotclient").data("ejPivotClient") : null;
            if (this.element.find(".e-editorTreeView").find("li span.e-searchfilterselection").length > 0)
                this.element.find(".e-editorTreeView").ejTreeView("removeNode", this.element.find(".e-editorTreeView").find("li span.e-searchfilterselection").closest("li"));
            if (!this._isFiltered) return false;
            this.model.pivotControl._isUpdateRequired = true;
            if (this.model.pivotControl != null)
                this.model.pivotControl._memberTreeObj = this._memberTreeObj;
            if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                if (args.model.text.toLowerCase() == "cancel") return;
                var selectedNodes = [], unSelectedNodes = [];
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    var hierarchyUQName = this._selectedMember;
                    this.model.pivotControl._currentReportItems = $.grep(this.model.pivotControl._currentReportItems, function (value, i) { if (value["fieldName"] != undefined && value["fieldName"].toLocaleLowerCase() != hierarchyUQName.toLocaleLowerCase()) return value; });
                    this._memberTreeObj = ej.Pivot.updateTreeView(this);
                    this.model.pivotControl._currentReportItems.push({ filterItems: $.extend([], this._memberTreeObj.dataSource()), fieldName: this._selectedMember });
                    selectedNodes = $.map(this.model.pivotControl._getSelectedNodes().split("::"), function (element, index) { { return { Id: element.split("||")[0], tag: element.split("||")[1], parentId: element.split("||")[2] } } });//$.map(this._getSelectedNodes().split("::"), function (element, index) { return { Id: element.split("||")[0], tag: element.split("||")[1],parentId:element.split("||")[2] } });

                    var currElement = (this._selectedMember != undefined) ? this._selectedMember.toLocaleLowerCase() : this._selectedMember.toLocaleLowerCase();
                    var reportItem = $.map(this.model.pivotControl.model.dataSource.columns, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLocaleLowerCase() == currElement)) return obj; });
                    if (reportItem.length == 0) { reportItem = $.map(this.model.pivotControl.model.dataSource.rows, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLocaleLowerCase() == currElement)) return obj; }); }
                    if (reportItem.length == 0) { reportItem = $.map(this.model.pivotControl.model.dataSource.filters, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLocaleLowerCase() == currElement)) return obj; }); }

                    if (reportItem.length > 0) {
                        if (this._getUnSelectedNodes() != "") {
                            this.model.pivotControl.model.dataSource = this.model.pivotControl._clearDrilledItems(this.model.pivotControl.model.dataSource, { action: "filtering" });
                        }
                        reportItem[0]["advancedFilter"] = [];
                        reportItem[0].filterItems = { filterType: "include", values: this.model.pivotControl._removeSelectedNodes(selectedNodes) };
                        this._selectedTreeNode = this.element.find(".e-schemaFieldTree").find("li[data-tag='" + reportItem[0].fieldName + "']");
                        if ($(this._selectedTreeNode).parents("li:eq(0)").children().children("span").hasClass("e-hierarchyCDB")) {
                            this._selectedTreeNode = $($(this._selectedTreeNode).parents("li:eq(0)"));
                        }
                        if (this._getUnSelectedNodes() == "") {
                            this._selectedTreeNode.find(".filter").remove();
                            this.element.find(".e-pvtBtn[data-fieldName='" + this._selectedMember + "']").parent().find(".filter").removeClass("filtered");
                            delete reportItem[0].filterItems;
                        }
                        else if ($($(this._selectedTreeNode)).find(".filter").length <= 0) {
                            $($(this._selectedTreeNode).find(".e-text")[0]).after(ej.buildTag("span.e-icon").attr("role", "button").attr("aria-label", "filtered").addClass("filter")[0].outerHTML);
                            this.element.find(".e-pvtBtn[data-fieldName='" + this._selectedMember + "']").parent().find(".filter").addClass("filtered");
                        }
                    }
                    if (!ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                        if (!ej.isNullOrUndefined(pivotClientObj)) {
                            pivotClientObj._isTimeOut = true;
                            setTimeout(function () {
                                if (pivotClientObj._isTimeOut)
                                    schemaObj.model.pivotControl._waitingPopup.show();
                            }, 800);
                        }
                        else
                            this.model.pivotControl._waitingPopup.show();
                    ej.olap.base.getJSONData({ action: "filtering" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
                }
                else {
                    ej.PivotAnalysis._valueSorting = null;
                    jQuery.each(this._memberTreeObj.element.find(":input.nodecheckbox:checked"), function (index, item) { if (item.value != "All") selectedNodes.push(item.value); });
                    jQuery.each(this._memberTreeObj.element.find(":input.nodecheckbox:not(:checked)"), function (index, item) {
                        unSelectedNodes.push(item.value = item.value == "(blank)" ? "" : item.value);
                    });
                    this.element.find(".e-dialog, .e-clientDialog").hide();
                    this.model.pivotControl._pivotFilterItems(selectedNodes, unSelectedNodes);
                    this.model.pivotControl.model.editCellsInfo = {};
                    this.model.pivotControl._populatePivotGrid();
                }
            }
            else {
                var unselectedNodes = "", enableFilterIndigator;
                var editorNodes = this.element.find(".e-editorTreeView :input.nodecheckbox");
                if (args.model.text.toLowerCase() != "cancel") {
                    var uncheckedNodes = this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? unselectedNodes = this._getUnSelectedNodes() + "FILTERED" + this._getSelectedNodes(this._curFilteredAxis == "e-schemaFilter" ? true : false) : (this.model.pivotControl.model.enableMemberEditorPaging || this._editorTreeData.length > 0) ? this._editorTreeData : this._memberTreeObj.element.find(":input:gt(0).nodecheckbox:not(:checked)"), isFiltered = false,
                    filterParams = this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ((this.model.pivotControl.model.enableMemberEditorPaging || this._editorTreeData.length > 0) ? ej.Pivot._getUnSelectedTreeState(this) + "FILTERED" + ej.Pivot._getSelectedTreeState(this._curFilteredAxis == "e-schemaFilter" ? true : false, this) : uncheckedNodes) : this._curFilteredAxis + "::" + this._curFilteredText + "::FILTERED";
                    var text = this._curFilteredText, textArr = new Array(), obj = {};
                    enableFilterIndigator = (this.model.pivotControl.model.enableMemberEditorPaging || this._editorTreeData.length > 0) ? (ej.Pivot._getUnSelectedTreeState(this) != "" ? true : false) : (this._getUnSelectedNodes() != "" ? true : false);
                    if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                        if (this.model.pivotControl && this.model.pivotControl.element.hasClass("e-pivotclient")) {
                            this.model.pivotControl._removeFilterTag(this._selectedField);
                        }
                        if (ej.isNullOrUndefined(this.model.pivotControl._fieldMembers[text]))
                            this.model.pivotControl._fieldMembers[text] = this._editorTreeData.length > 0 ? $.map(this._editorTreeData, function (itm) { if (itm.name != "(All)") return itm.name; }) : ej.Pivot._getEditorMember(editorNodes, this.model.pivotControl, true);
                        if (uncheckedNodes.length > 0 && uncheckedNodes[0].name == "(All)") uncheckedNodes.splice(0, 1);
                        for (var i = 0; i < uncheckedNodes.length; i++) {
                            if (!this.model.pivotControl.model.enableMemberEditorPaging && this._editorTreeData.length == 0)
                                textArr.push($(uncheckedNodes[i].parentElement).siblings("a").text());
                            else {
                                if (uncheckedNodes[i].checkedStatus == false)
                                    textArr.push(uncheckedNodes[i].key || uncheckedNodes[i].name);
                            }
                        }
                        obj[text] = textArr;
                        var tmpFilterData = this.element.parents(".e-pivotclient").length > 0 ? this.model.pivotControl._tempFilterData : this._tempFilterData;
                        if (ej.isNullOrUndefined(tmpFilterData))
                            tmpFilterData = new Array();
                        for (var i = 0; i < tmpFilterData.length; i++) {
                            if (!ej.isNullOrUndefined(tmpFilterData[i][text])) {
                                tmpFilterData[i][text] = textArr;
                                isFiltered = true;
                            }
                        }
                        if (!isFiltered)
                            tmpFilterData.push(obj);
                        this._tempFilterData = this.model.pivotControl._tempFilterData = tmpFilterData;
                        if ((ej.isNullOrUndefined(this._curFilteredAxis) || this._curFilteredAxis != "") && this._curFilteredAxis != "e-schemaValue") {
                            for (var i = 0; i < uncheckedNodes.length; i++) {
                                if (!this.model.pivotControl.model.enableMemberEditorPaging && this._editorTreeData.length == 0)
                                    filterParams += "##" + $(uncheckedNodes[i].parentElement).siblings("a").text();
                                else {
                                    if (uncheckedNodes[i].checkedStatus == false)
                                        filterParams += "##" + (uncheckedNodes[i].key || uncheckedNodes[i].name);
                                }
                            }
                        }
                    }
                    else {
                        var member = ej.Pivot._getEditorMember(text, this.model.pivotControl, true);
                        this.model.pivotControl._fieldSelectedMembers[text] = $.map(this.model.pivotControl._fieldMembers[text], function (item) { if (!item.checked) return item }).length == 0 ? "All" : ((member != "All" && member != "multiple") ? member : this.model.pivotControl._getLocalizedLabels("MultipleItems"));
                        obj[this._curFilteredText] = filterParams;
                        if (ej.isNullOrUndefined(this.model.pivotControl._tempFilterData))
                            this.model.pivotControl._tempFilterData = new Array();
                        for (var i = 0; i < this.model.pivotControl._tempFilterData.length; i++) {
                            if (!ej.isNullOrUndefined(this.model.pivotControl._tempFilterData[i][this._curFilteredText])) {
                                this.model.pivotControl._tempFilterData[i][this._curFilteredText] = filterParams;
                                isFiltered = true;
                            }
                        }
                        if (!isFiltered)
                            this.model.pivotControl._tempFilterData.push(obj);
                    }
                    var filterEle = this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? this._curFilteredText : this._curFilteredText.split(".")[1];;
                    var sortedHeaders = this._getSortedHeaders(),
                    filteredBtn = this.model.layout == "excel" ? this.element.find(".e-schemaFieldTree li:contains('" + this._curFilteredText + "')") : this.element.find("." + this._curFilteredAxis + " .e-pivotButton:contains(" + this._curFilteredText + ") .filterBtn");
                    if (this.model.layout == "excel" || this.model.layout == "normal") {
                        if ($(this._selectedTreeNode).parents("li:eq(0)").children().children("span").hasClass("e-hierarchyCDB")) {
                            this._selectedTreeNode = $($(this._selectedTreeNode).parents("li:eq(0)"));
                        }
                        if (enableFilterIndigator && $($(this._selectedTreeNode)).find(".filter").length <= 0) {
                            var filterSpan = ej.buildTag("span.e-icon", { "display": "none" }).addClass("filter")[0].outerHTML;
                            $($(this._selectedTreeNode).find(".e-text")[0]).after(filterSpan);
                            this.element.find(".e-pvtBtn:contains('" + filterEle + "')").parent().find(".filter").addClass("filtered");
                        }
                        else if (!enableFilterIndigator) {
                            $(this._selectedTreeNode).find(".filter").remove();
                            this.element.find(".e-pvtBtn:contains('" + filterEle + "')").parent().find(".filter").removeClass("filtered");
                        }
                        if (this._curFilteredAxis == "")
                            return false;
                    }
                    if (this.model.pivotControl.model.enableGroupingBar) {
                        $.each(this.model.pivotControl.element.find(".e-pivotButton .filter"), function (index, itm) {
                            $(itm).removeClass("filtered")
                        })
                        if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? uncheckedNodes.length > 0 : uncheckedNodes.split("FILTERED::")[0].length > 0)
                            this.model.pivotControl.element.find("#pivotButton" + this._curFilteredText.split('.')[0]).next().addClass("filtered");;
                    }
                    var report;
                    try {
                        report = JSON.parse(this.model.pivotControl.getOlapReport()).Report;
                    }
                    catch (err) {
                        if (!ej.isNullOrUndefined(this.model.pivotControl.getOlapReport))
                            report = this.model.pivotControl.getOlapReport();
                    }
                    if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this._trigger("beforeServiceInvoke", { action: "filtering", element: this.element, customObject: this.model.pivotControl.model.customObject });

                    var eventArgs = this.model.pivotControl.model.customObject != {} && filterParams != "" ? JSON.stringify({ "action": "filtering", "filterParams": filterParams + ((this.model.pivotControl && $(this.model.pivotControl.element).hasClass("e-pivotclient")) ? (((!ej.isNullOrUndefined(this.model.pivotControl._ascdes) && this.model.pivotControl.model.enableAdvancedFilter) ? ">>#>#>>" + this.model.pivotControl._ascdes : "") + "-##-" + JSON.stringify(this.model.pivotControl.model.valueSortSettings)) : ""), "sortedHeaders": this.model.pivotControl._ascdes, "currentReport": report, "valueSorting": this.model.pivotControl.model.valueSortSettings, "gridLayout": this.model.pivotControl.model.layout, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) }) :
                this.model.pivotControl.model.customObject != {} ? JSON.stringify({ "action": "filtering", "currentReport": report, "valueSorting": this.model.pivotControl.model.valueSortSettings, "customObject": serializedCustomObject }) :
                filterParams != "" ? JSON.stringify({ "action": "filtering", "filterParams": filterParams, "sortedHeaders": this.model.pivotControl._ascdes, "currentReport": report, "valueSorting": this.model.pivotControl.model.valueSortSettings }) : JSON.stringify({ "action": "filtering", "valueSorting": this.model.pivotControl.model.valueSortSettings });
                    if (!ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                        if (!ej.isNullOrUndefined(pivotClientObj)) {
                            pivotClientObj._isTimeOut = true;
                            setTimeout(function () {
                                if (pivotClientObj._isTimeOut)
                                    schemaObj.model.pivotControl._waitingPopup.show();
                            }, 800);
                        }
                        else
                            this.model.pivotControl._waitingPopup.show();
                    this.element.find(".schemaNoClick").addClass("freeze").width($(this.element).width()).height($(this.element).height()).css({ "top": $(this.element).offset().top, "left": $(this.element).offset().left });
                    if (!this.model.pivotControl.model.enableDeferUpdate)
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.filtering, eventArgs, this._filterElementSuccess);
                    else {
                        this.model.pivotControl._filterUpdate.push(filterParams);
                        if (!ej.isNullOrUndefined(this.model.pivotControl._waitingPopup)) {
                            if (!ej.isNullOrUndefined(pivotClientObj)) pivotClientObj._isTimeOut = false;
                            this.model.pivotControl._waitingPopup.hide();
                        }
                        this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
                        if (this.model.pivotControl.model.enableGroupingBar)
                            this.model.pivotControl._refreshGroupingBar(this.model.pivotControl);
                    }
                }
                this._selectedTreeNode = null;
                this._refreshPivotButtons();
            }
            if (!ej.isNullOrUndefined(pivotClientObj)) {
                this._refreshPivotButtons();
                if (pivotClientObj._isTimeOut) pivotClientObj._isTimeOut = false;
            }
        },

        _beforeNodeExpand: function (args) {
            ej.Pivot.getChildNodes(args, this._selectedFieldName, this.model.pivotControl._currentReportItems, this.model.pivotControl.model.dataSource, this);
        },

        _nodeExpand: function (args) {
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                args._isSchemaClick = true;
                this.model.pivotControl._nodeExpand(args);
            }
        },

        _nodeStateModifiedSuccess: function (report) {
            this.model.pivotControl._isUpdateRequired = true;
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
            if (this.model.afterServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "nodeStateModified", element: this.element, customObject: this.model.customObject });
            if (!this.model.pivotControl.model.enableDeferUpdate)
                this.model.pivotControl._renderControlSuccess(report);
            else
                this.model.pivotControl._deferUpdateSuccess(report);
            this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
        },

        _pvtNodeDroppedSuccess: function (report) {
            ej.Pivot._updateValueSortingIndex(report, this.model.pivotControl);
            if (report[0] != undefined) {
                if (report[2] != null && report[2] != undefined)
                    this.model.customObject = report[2].Value;
            }
            else if (report.d != undefined) {
                if (report.d[2] != null && report.d[2] != undefined)
                    this.model.customObject = report.d[2].Value;
                if (report.d[0].Key == "PivotReport")
                    this.model.pivotControl.setOlapReport(report.d[0].Value);
            }
            else {
                if (report.customObject != null && report.customObject != undefined)
                    this.model.customObject = report.customObject;
                this.model.pivotControl.setOlapReport(report.PivotReport);
            }
            var controlObj = ($(this.element).parents(".e-pivotclient").length > 0) ? this.model.pivotControl : this;
            if (controlObj.model.afterServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                controlObj._trigger("afterServiceInvoke", { action: "nodeDropped", element: controlObj.element, customObject: controlObj.model.customObject });

            if (!this.model.pivotControl.model.enableDeferUpdate) {
                if ($(this.element).parents(".e-pivotclient").length > 0 && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    this.model.pivotControl.refreshControl(report);
                    if (this.model.pivotControl && this.model.pivotControl._pivotGrid && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                        this.model.pivotControl._pivotGrid._removeCells(report);
                }
                else
                    this.model.pivotControl._renderControlSuccess(report);
            }
            else
                this.model.pivotControl._deferUpdateSuccess(report);
            this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
        },

        _pvtBtnDroppedSuccess: function (report) {
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
            if (this.model.afterServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "removeButton", element: this.element, customObject: this.model.customObject });
            this.model.pivotControl._renderControlSuccess(report);
            if (this.model.pivotControl && this.model.pivotControl._pivotGrid && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                this.model.pivotControl._pivotGrid._removeCells(report);
            this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
        },

        _filterElementSuccess: function (report) {
            this._isSearchApplied = false;
            ej.Pivot._updateValueSortingIndex(report, this.model.pivotControl);
            if ($(this.element).parents(".e-pivotclient").length > 0) {
                if (!ej.isNullOrUndefined(report.d)) {
                    var tempObj = {};
                    tempObj["PivotReport"] = report.d[0].Value;
                    tempObj["GridJSON"] = report.d[1].Value;
                    tempObj["ChartJSON"] = report.d[2].Value;
                    var colHiddenCells = ($.map(report.d, function (item) { if (item.Key == "FilteredColumnHeaders") return item.Value; }));
                    if (colHiddenCells.length > 0)
                        tempObj["FilteredColumnHeaders"] = colHiddenCells[0];
                    var rowHiddenCells = ($.map(report.d, function (item) { if (item.Key == "FilteredRowHeaders") return item.Value; }));
                    if (rowHiddenCells.length > 0)
                        tempObj["FilteredRowHeaders"] = rowHiddenCells[0];
                    report = tempObj;
                }
                this.model.pivotControl.refreshControl(report);
                if (this.model.pivotControl && this.model.pivotControl._pivotGrid && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                    this.model.pivotControl._pivotGrid._removeCells(report);
            }
            else {
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
                if (this.model.afterServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                    this._trigger("afterServiceInvoke", { action: "filtering", element: this.element, customObject: this.model.customObject });
                this.model.pivotControl._renderControlSuccess(report);
            }
            this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
            ej.Pivot.closePreventPanel(this);
            this.element.find(".e-dialog").remove();
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
            this._memberTreeObj._createSubNodesWhenLoadOnDemand(newDataSource, this.pNode, mapper);
            $.each($(parentNode).children().find("li"), function (index, value) {
                value.setAttribute("data-tag", newDataSource[index].tag);
            });
            if (this.model.afterServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "memberExpanded", element: this.element, customObject: this.model.customObject });
            // this._memberTreeObj._expandCollapseAction(this.pNode);
            this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
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
                if (msg != null && msg.customObject != undefined)
                    this.model.customObject = msg.customObject;
            }
            else if (msg != undefined) {
                this._currentMembers = msg.EditorTreeInfo;
                if (msg != null && msg.customObject != undefined)
                    this.model.customObject = msg.customObject;
            }
            var controlObj = ($(this.element).parents(".e-pivotclient").length > 0) ? this.model.pivotControl : this;
            if (controlObj.model.afterServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                controlObj._trigger("afterServiceInvoke", { action: "fetchMembers", element: controlObj.element, customObject: controlObj.model.customObject });
            if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && !this.model.pivotControl.model.enableMemberEditorPaging && (this._editorTreeData.length == 0 || this._isFilterBtnClick)) {
                this._editorTreeData = JSON.parse(this._currentMembers);
                if (this.model.pivotControl.model.enableAdvancedFilter)
                    this._editorTreeData = $.map(this._editorTreeData, function (val) { if (ej.isNullOrUndefined(val.levels)) return val; });
            }
            this.model.pivotControl._savedReportItems = $.extend(true, [], this.model.pivotControl._currentReportItems);
            this._isFilterBtnClick = false;
            this._createDialog(this._dialogHead, this._currentMembers);
            if (this.model.pivotControl._waitingPopup) {
                var pivotClientObj = ($(this.element).parents(".e-pivotclient").length > 0) ? $(this.element).parents(".e-pivotclient").data("ejPivotClient") : null;
                if (!ej.isNullOrUndefined(pivotClientObj)) pivotClientObj._isTimeOut = false;
                this.model.pivotControl._waitingPopup.hide();
            }
            this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
            if (!ej.isNullOrUndefined(this.element.find(".e-dialog .e-text:visible").first())) {
                this.element.find(".e-dialog .e-text:visible").first().attr("tabindex", "-1").focus().addClass("e-hoverCell");
            }
        },

        _droppedSuccess: function (args) {
            if (!ej.isNullOrUndefined(args.Exception)) {
                ej.Pivot._createErrorDialog(args, "Exception", this);
                this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
                this._nodeCheck = true;
                this._tableTreeObj.uncheckNode(this._tableTreeObj.element.find("li[data-tag='" + this._currentCheckedNode + "']"));
                return false;
            }
            ej.Pivot._updateValueSortingIndex(args, this.model.pivotControl);
            var report = null;
            if (this.model.pivotControl.model.enableDeferUpdate) {
                report = this._removeButtonDeferUpdate == false ? (!ej.isNullOrUndefined(args.OlapReport) ? JSON.parse(args.OlapReport) : JSON.parse(args.d[0].Value)) : (!ej.isNullOrUndefined(args.OlapReport) ? report = args.OlapReport : report = args.d[0].Value);
            }
            else {
                if (!ej.isNullOrUndefined(args[0]) && args.length > 0) {
                    report = JSON.parse(args[1].Value);
                    if (args[2] != null && args[2] != undefined)
                        this.model.customObject = (args[2].Value);
                }
                else if (!ej.isNullOrUndefined(args.d) && args.d.length > 0) {
                    if ($(this.element).parents(".e-pivotclient").length > 0 && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                        report = JSON.parse($.grep(args.d, function (item) { return item.Key == "PivotReport" })[0].Value);
                    else
                        report = JSON.parse(args.d[1].Value);
                    if (args.d[2] != null && args.d[2] != undefined)
                        this.model.customObject = (args.d[2].Value);
                }
                else if (!ej.isNullOrUndefined(args) && !ej.isNullOrUndefined(args.OlapReport))
                    report = JSON.parse(args.OlapReport);
                else if (!ej.isNullOrUndefined(args) && !ej.isNullOrUndefined(args.PivotReport))
                    report = JSON.parse(args.PivotReport);
                if (args.customObject != null && args.customObject != undefined)
                    this.model.customObject = (args.customObject);
            }
            if (this._removeButtonDeferUpdate == false) {
                this.element.find(".e-axisTable .e-pivotButton").remove();
                this._setPivotRows(report.PivotRows);
                this._setPivotColumns(report.PivotColumns);
                this._setPivotCalculations(report.PivotCalculations);
                this._setFilters(report.Filters);
                this.model.pivotControl.setOlapReport(JSON.stringify(report));
                this._refreshPivotButtons();
                if (this.model.enableDragDrop) {
                    this.element.find(".e-pivotButton .e-pvtBtn").ejButton({ size: "normal", type: ej.ButtonType.Button, enableRTL: this.model.enableRTL }).ejDraggable({
                        handle: 'button', clone: true,
                        cursorAt: { left: -5, top: -5 },
                        dragStart: ej.proxy(function (args) {
                            this._isDragging = true;
                        }, this),
                        dragStop: ej.proxy(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? this._pvtBtnDropped : this._clientOnPvtBtnDropped, this),
                        helper: ej.proxy(function (event, ui) {
                            $(event.element).addClass("dragHover");
                            if (event.sender.target.className.indexOf("e-btn") > -1) {
                                var btnClone = $(event.sender.target).clone().attr("id", this._id + "_dragClone").appendTo('body');
                                $("#" + this._id + "_dragClone").removeAttr("style").height($(event.sender.target).height());
                                return btnClone;
                            }
                            else
                                return false;
                        }, this)
                    });
                }
                this._unWireEvents();
                this._wireEvents();
            }
            if (!this.model.pivotControl.model.enableDeferUpdate) {
                if ($(this.element).parents(".e-pivotclient").length > 0 && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    this.model.pivotControl.refreshControl(args);
                    if (this.model.pivotControl && this.model.pivotControl._pivotGrid && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                        this.model.pivotControl._pivotGrid._removeCells(args);
                }
                else
                    this.model.pivotControl._renderControlSuccess(args);
            }
            else {
                if (!ej.isNullOrUndefined(this.model.pivotControl._ogridWaitingPopup))
                    this.model.pivotControl._ogridWaitingPopup.hide();
                if (!ej.isNullOrUndefined(args.OlapReport)) {
                    this.model.pivotControl.setOlapReport(args.OlapReport);
                    if (args.HeaderCounts != undefined && $(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined)
                        this.model.pivotControl._pagerObj.initPagerProperties(JSON.parse(args.HeaderCounts), JSON.parse(args.PageSettings));
                }
                else {
                    this.model.pivotControl.setOlapReport(args.d[0].Value);
                    if ($(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined)
                        this.model.pivotControl._pagerObj.initPagerProperties(JSON.parse(args.d[2].Value), JSON.parse(args.d[1].Value));
                }
                this._removeButtonDeferUpdate = false;
                this.model.pivotControl._deferUpdateSuccess(args);
            }
            var controlObj = ($(this.element).parents(".e-pivotclient").length > 0) ? this.model.pivotControl : this;
            if (controlObj.model.afterServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                controlObj._trigger("afterServiceInvoke", { action: "nodeDropped", element: controlObj.element, customObject: controlObj.model.customObject });
            this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
            this._createContextMenu();
            this._setPivotBtnWidth();
        },

        _removePvtBtn: function (args) {
            this.model.pivotControl._waitingPopup.show();
            var headerText, headerTag, report, eventArgs, selectedTreeNode;
            if ($(args.element).length > 0) {
                headerText = $(args.element).parent().attr("data-tag").split(":")[1], headerTag = $(args.element).parent().attr("data-tag");
            }
            else {
                headerText = $(args.target).parent().attr("data-tag").split(":")[1], headerTag = $(args.target).parent().attr("data-tag");
            }
            try {
                report = JSON.parse(this.model.pivotControl.getOlapReport()).Report;
            }
            catch (err) {
                if (!ej.isNullOrUndefined(this.model.pivotControl.getOlapReport))
                    report = this.model.pivotControl.getOlapReport();
            }
            if (report == "" && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                report = this.model.pivotControl.model.dataSource;
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                this._clearFilterData(headerText);
                var uniqueName = ((headerTag.indexOf("[Measures]") > -1 || (headerTag.indexOf("KPI") > -1 || ($(args.element).parents().hasClass("e-schemaValue") && headerTag.indexOf("[Measures]") == -1))) || (headerTag.indexOf("[") > -1)) ? headerTag.split(":")[1] : this.model.pivotControl._getNodeUniqueName(headerTag);
                uniqueName = uniqueName.indexOf("<>") ? uniqueName.replace("<>", ".") : uniqueName;
                if (uniqueName == "[Measures]" || (uniqueName == "KPI" || ($(args.element).parents().hasClass("e-schemaValue") && headerTag.indexOf("[Measures]") == -1))) {
                    if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                        ej.Pivot.removeReportItem(this.model.pivotControl.model.dataSource, headerText, headerText.toLocaleLowerCase().indexOf("measures") == 0);
                        this.model.pivotControl.refreshControl();
                        this.refreshControl();
                    }
                    else if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                        headerTag = ($(args.element).parents().hasClass("e-schemaValue") && headerTag.indexOf("[Measures]") == -1) ? headerTag + ":KPI" : headerTag;
                        $(args.element).length > 0 ? $(args.element).parent().parent().remove() : $(args.target).parent().parent().remove();
                        for (var i = 0; i < this.model.pivotCalculations.length && headerTag.indexOf(this._getLocalizedLabels("Measures")) > -1; i++) {
                            uniqueName = this.model.pivotCalculations[i].Tag;
                            this._isMeasureBtnRemove = true;
                            selectedTreeNode = this.model.pivotControl._getNodeByUniqueName(uniqueName);
                            this._tableTreeObj.uncheckNode(selectedTreeNode);
                        }
                        this.element.find(".schemaNoClick").addClass("freeze").width($(this.element).width()).height($(this.element).height()).css({ "top": $(this.element).offset().top, "left": $(this.element).offset().left });
                        if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                            this._trigger("beforeServiceInvoke", { action: "removeButton", element: this.element, customObject: this.model.pivotControl.model.customObject });
                        var eventArgs = JSON.stringify({ "action": "removeButton", "headerInfo": headerTag, "currentReport": report, "customObject": JSON.stringify(this.model.pivotControl.model.customObject), "gridLayout": this.model.pivotControl.model.layout });
                        if (headerTag.indexOf("[Measures]") < 0 && (headerTag.indexOf("Measures") >= 0 || (headerTag.indexOf("KPI") >= 0 && headerTag.split(":").length == 2))) {
                            var removeMeasureorKpi = (headerTag.indexOf("KPI") >= 0 && headerTag.split(":").length == 2) ? this.element.find(".e-schemaValue .e-pivotButton").not("[data-tag*='Measures']") : this.element.find(".e-schemaValue .e-pivotButton [data-tag*='Measures']");
                            removeMeasureorKpi.remove()
                        }
                        if (headerTag.indexOf("KPI") > 0 && this.element.find(".e-schemaValue .e-pivotButton").not("[data-tag*='Measures']").length == 0) {
                            var tmp = headerTag.split(":"),
                            tempAxis = tmp[0] == "Rows" ? ".e-schemaRow" : tmp[0] == "Columns" ? ".e-schemaColumn" : "";
                            if (this.element.find(".e-schemaValue .e-pivotButton [data-tag*='KPI']").length <= 0)
                                this.element.find(tempAxis + " .e-pivotButton:contains('KPI')").remove();
                            if (!ej.isNullOrUndefined(this._tableTreeObj) && (this.model.olap.showKPI || this.model.olap.showKpi)) {
                                var treeViewElements = this._tableTreeObj.element.find("li[data-tag=KPI]");
                                if ($(treeViewElements).length > 0) $(treeViewElements).find("span.treeDrop").remove();
                            }
                        }
                        if (this.model.pivotControl.model.enableDeferUpdate) {
                            this._removeButtonDeferUpdate = true;
                            this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.removeButton, eventArgs.replace("removeButton", "removeButtonDeferUpdate"), this._droppedSuccess)
                            this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
                        }
                        else {
                            this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.removeButton, eventArgs, this._pvtBtnDroppedSuccess);
                        }
                    }
                }
                else {
                    selectedTreeNode = this.model.pivotControl._getNodeByUniqueName(uniqueName);
                    this._tableTreeObj.uncheckNode(selectedTreeNode);
                }
            }
            else if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                ej.PivotAnalysis._valueSorting = null;
                headerText = $(args.element).length > 0 ? $(args.element).parent().find(".e-pvtBtn").attr("data-fieldName") : $(args.target).parent().find(".e-pvtBtn").attr("data-fieldName");
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    if (headerTag.split(":")[1].toLowerCase() == "measures") {
                        this.model.pivotControl._ogridWaitingPopup.show();
                        this.element.find("div[data-tag='" + headerTag + "']").remove();
                        for (var i = 0; i < this.model.pivotControl.model.dataSource.values[0]["measures"].length; i++) {
                            this._nodeCheck = true;
                            selectedTreeNode = this._tableTreeObj.element.find("li[data-tag='" + this.model.pivotControl.model.dataSource.values[0]["measures"][i].fieldName + "']");
                            this._tableTreeObj.uncheckNode(selectedTreeNode);
                            this.element.find("div[data-tag='values:" + this.model.pivotControl.model.dataSource.values[0]["measures"][i].fieldName + "']").remove();
                        }
                        this.model.pivotControl.model.dataSource.values[0]["measures"] = [];
                        ej.olap.base.getJSONData({ action: "removeButton" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
                    }
                    selectedTreeNode = this._tableTreeObj.element.find("li[data-tag='" + headerText + "']");
                    if (selectedTreeNode.length > 1) {
                        for (var i = 0; i < selectedTreeNode.length; i++) {
                            if (this._tableTreeObj.isNodeChecked(selectedTreeNode[i]))
                                selectedTreeNode = selectedTreeNode[i];
                        }
                    }
                }
                else
                    selectedTreeNode = this._tableTreeObj.element.find("li[id=" + headerText + "]");
                this._tableTreeObj.uncheckNode(selectedTreeNode);
            }
            else {
                selectedTreeNode = this._tableTreeObj.element.find("li:contains('" + headerText + "')");
                this._tableTreeObj.uncheckNode(selectedTreeNode);
            }
        },

        _createDialog: function (title, treeViewData) {
            this.element.find(".e-dialog, .e-clientDialog").remove();

            var currentHierarchy, levelInfo, sortState, seperator, groupDropDown = "", filterElementTag = "", memberSearchEditor = "", editorNavPanel = "", editorSearchNavPanel = "", editorDrillNavPanel = "", editorLinkPanel = "";
            var isAdvancedFilter = (
                this.model.pivotControl &&
                (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.pivotControl.model.enableAdvancedFilter && this._curFilteredAxis != "e-schemaFilter" && this._curFilteredAxis != "e-schemaValue") ||
                this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && this.model.pivotControl.model.dataSource.enableAdvancedFilter &&
                ej.Pivot.getReportItemByFieldName(this._selectedFieldName, this.model.pivotControl.model.dataSource, this._dataModel).axis != "filters" &&
                ej.Pivot.getReportItemByFieldName(this._selectedFieldName, this.model.pivotControl.model.dataSource, this._dataModel).axis != "values" &&
                (!ej.isNullOrUndefined(ej.Pivot.getReportItemByFieldName(this._selectedFieldName, this.model.pivotControl.model.dataSource, this._dataModel).item)) ? true : false);

            if (isAdvancedFilter) {
                var treeviewInfo = JSON.parse(treeViewData);
                treeviewInfo[0].name = "(Select All)"
                currentHierarchy = this._selectedFieldName;
                if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                    if (this.model.pivotControl.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap) {
                        levelInfo = $.map(this.model.pivotControl._currentReportItems, function (obj, index) { if (obj["fieldName"] == currentHierarchy) { return obj["dropdownData"]; } });
                        if (levelInfo.length == 0)
                            levelInfo = $.map(this._tableTreeObj.element.find("li[data-tag ='" + this._selectedFieldName + "'] li"), function (obj, index) { return { value: $(obj).attr("data-tag"), text: $(obj).find("a").text() }; });
                    }
                    else
                        levelInfo = [{ value: this._selectedFieldName, text: this._selectedFieldName }]
                }
                else if (this.model.pivotControl.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap) {
                    levelInfo = this.model.pivotControl.model.enableMemberEditorPaging ? this._memberPagingAvdData : treeviewInfo.splice(treeviewInfo.length - 1, 1);
                    levelInfo = JSON.parse(levelInfo[0].levels);
                }
                else
                    levelInfo = [{ value: this._curFilteredText, text: this._curFilteredText }];
                treeViewData = JSON.stringify(treeviewInfo);
                groupDropDown = ej.buildTag("div.e-ddlGroupWrap", this._getLocalizedLabels("SelectField") + ":" + ej.buildTag("input#" + this._id + "_GroupLabelDrop.groupLabelDrop").attr("type", "text")[0].outerHTML, {})[0].outerHTML;
                filterElementTag = ej.buildTag("ul.e-filterElementTag")[0].outerHTML;
                var filterTag = ej.Pivot.createAdvanceFilterTag({ action: "filterTag" }, this)
            }
            memberSearchEditor = ej.buildTag("div.e-memberSearchEditorDiv", ej.buildTag("input#" + this._id + "_SearchEditorTreeView.searchEditorTreeView").attr("type", "text")[0].outerHTML + (this.model.pivotControl.model.enableMemberEditorPaging && $.parseJSON(treeViewData).length >= this.model.pivotControl.model.memberEditorPageSize ? ej.buildTag("span.e-icon e-searchEditorTree", {})[0].outerHTML : ""), { "padding": (this.model.pivotControl.model.enableAdvancedFilter ? ((this._selectedFieldAxis == "values" || this._curFilteredAxis == "e-schemaValue") ? "5px 0px 0px 0px" : "5px 5px 0px 9px") : 0) })[0].outerHTML;
            var dialogContent = ej.buildTag("div#" + this._id + "_EditorDiv.e-editorDiv", groupDropDown + filterElementTag + ej.buildTag("div", memberSearchEditor + ej.buildTag("div.e-memberEditorDiv", ej.buildTag("div#editorTreeView.e-editorTreeView")[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML + ((!ej.isNullOrUndefined(treeViewData) && this.model.pivotControl.model.enableMemberEditorPaging && ($.parseJSON(treeViewData).length >= this.model.pivotControl.model.memberEditorPageSize || this.model.pivotControl.model.memberEditorPageSize < this._memberPageSettings.endPage)) ? "" : "</br>"),
            dialogFooter = ej.buildTag("div.e-footerArea", ej.buildTag("button#" + this._id + "_OKBtn.e-dialogOKBtn", this._getLocalizedLabels("OK")).attr({ "title": this._getLocalizedLabels("OK"), tabindex: 0 })[0].outerHTML + ej.buildTag("button#CancelBtn.e-dialogCancelBtn", this._getLocalizedLabels("Cancel")).attr({ "title": this._getLocalizedLabels("Cancel"), tabindex: 0 })[0].outerHTML, { "float": "right", "margin": (!ej.isNullOrUndefined(treeViewData) && $.parseJSON(treeViewData).length >= this.model.pivotControl.model.memberEditorPageSize && this.model.pivotControl.model.enableMemberEditorPaging ? "10px" : "-12px ") + " " + (isAdvancedFilter ? " 5px " : " 0px ") + " 6px 0px" })[0].outerHTML,
            editorNavPanel = ej.buildTag("div.e-memberPager", ej.buildTag("div#" + this._id + "_NextpageDiv.e-nextPageDiv", ej.buildTag("div.e-icon e-media-backward_01 e-firstPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-left e-prevPage", {})[0].outerHTML + ej.buildTag("input.e-memberCurrentPage#memberCurrentPage", {}, { "width": "20px", "height": "10px" })[0].outerHTML + ej.buildTag("span.e-memberPageCount#memberPageCount")[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-right e-nextPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-media-forward_01 e-lastPage", {})[0].outerHTML)[0].outerHTML)[0].outerHTML,
            editorSearchNavPanel = ej.buildTag("div.e-memberSearchPager", ej.buildTag("div#" + this._id + "_NextSearchpageDiv.e-nextPageDiv", ej.buildTag("div.e-icon e-media-backward_01 e-firstPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-left e-prevPage", {})[0].outerHTML + ej.buildTag("input.e-memberCurrentSearchPage#memberCurrentSearchPage", {}, { "width": "20px", "height": "10px" })[0].outerHTML + ej.buildTag("span.e-memberSearchPageCount#memberSearchPageCount")[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-right e-nextPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-media-forward_01 e-lastPage", {})[0].outerHTML)[0].outerHTML, {}).css("display", "none")[0].outerHTML;
            editorDrillNavPanel = ej.buildTag("div.e-memberDrillPager", ej.buildTag("div#" + this._id + "NextDrillpageDiv.e-nextPageDiv", ej.buildTag("div.e-icon e-media-backward_01 e-firstPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-left e-prevPage", {})[0].outerHTML + ej.buildTag("input.e-memberCurrentDrillPage#memberCurrentDrillPage", {}, { "width": "20px", "height": "10px" })[0].outerHTML + ej.buildTag("span.e-memberDrillPageCount#memberDrillPageCount")[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-right e-nextPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-media-forward_01 e-lastPage", {})[0].outerHTML)[0].outerHTML, {}).css("display", "none")[0].outerHTML;
            editorLinkPanel = ej.buildTag("div.e-linkOuterPanel", ej.buildTag("span.e-infoImg e-icon", "", {}).css({ "float": "left", "margin-top": "4px", "font-size": "16px" })[0].outerHTML + ej.buildTag("a.e-linkPanel", this._getLocalizedLabels('NotAllItemsShowing')).css({ "display": "inline-block", "margin-left": "3px", "margin-top": "2px" })[0].outerHTML, {}).css({ "display": "none", "margin-top": "-16px", "margin-left": isAdvancedFilter ? "8px" : "0px" })[0].outerHTML;
            var ejDialog = ej.buildTag("div#" + (isAdvancedFilter ? "clientDialog" : this._id + "_clientDialog") + ".e-clientDialog", dialogContent + ((!ej.isNullOrUndefined(this._editorTreeData) && this.model.pivotControl.model.enableMemberEditorPaging) ? ((ej.DataManager(this._editorTreeData).executeLocal(ej.Query().where("pid", "equal", null || undefined)).length >= this.model.pivotControl.model.memberEditorPageSize || this.model.pivotControl.model.memberEditorPageSize < this._memberPageSettings.endPage) ? (editorDrillNavPanel + editorSearchNavPanel + editorNavPanel) : (editorDrillNavPanel + editorSearchNavPanel)) : editorLinkPanel) + dialogFooter, { "opacity": "1" }).attr("title", title)[0].outerHTML,
            treeViewData = JSON.parse(treeViewData), selectedData;
            this._isOptionSearch = false; this._currentFilterList = {}; this._editorSearchTreeData = []; this._isEditorDrillPaging = false; this._lastSavedTree = []; this._isSearchApplied = false;
            for (var i = 0; i < treeViewData.length; i++) {
                if (treeViewData[i].name == null || !treeViewData[i].name.toString().replace(/^\s+|\s+$/gm, '')) { treeViewData[i].name = "(blank)"; treeViewData[i].id = "(blank)"; }
                if (!ej.isNullOrUndefined(treeViewData[i].id) && typeof (treeViewData[i].id) == "string") { treeViewData[i].id = treeViewData[i].id.replace(/ /g, "_"); }
            }
            var selectedData;
            if (this.model.pivotControl.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? !ej.isNullOrUndefined(this.model.pivotControl._fieldMembers) : !ej.isNullOrUndefined(this._tempFilterData)) {
                if (this.model.pivotControl.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    for (var i = 0; i < Object.keys(this.model.pivotControl._fieldMembers).length; i++) {
                        if (!ej.isNullOrUndefined(this.model.pivotControl._fieldMembers[this._curFilteredText]))
                            selectedData = $.map(this.model.pivotControl._fieldMembers[this._curFilteredText], function (item) { if (!item.checked) return item.name });
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
            if (this.model.pivotControl.model.enableMemberEditorPaging && (treeViewData.length >= this.model.pivotControl.model.memberEditorPageSize || this.model.pivotControl.model.memberEditorPageSize < this._memberPageSettings.endPage)) {
                this.element.find(".e-prevPage, .e-firstPage").addClass("e-pageDisabled");
                this.element.find(".e-nextPage, .e-lastPage").addClass("e-pageEnabled");
                var pageCount = (this._memberCount / this.model.pivotControl.model.memberEditorPageSize);
                if (pageCount != Math.round(pageCount))
                    pageCount = parseInt(pageCount) + 1;
                this.element.find(".e-memberPageCount").html("/ " + pageCount);
                this.element.find(".e-memberCurrentPage").val(this._memberPageSettings.currentMemeberPage);
                this._memberPageSettings.currentMemeberPage > 1 ? this.element.find(".e-prevPage, .e-firstPage").removeClass("e-pageDisabled").addClass("e-pageEnabled") : this.element.find(".e-prevPage, .e-firstPage").removeClass("e-pageEnabled").addClass("e-pageDisabled");
                this._memberPageSettings.currentMemeberPage == parseInt($.trim(this.element.find(".e-memberPageCount").text().split("/")[1])) ? this.element.find(".e-nextPage, .e-lastPage").removeClass("e-pageEnabled").addClass("e-pageDisabled") : this.element.find(".e-nextPage, .e-lastPage").removeClass("e-pageDisabled").addClass("e-pageEnabled");
                this.element.find(".e-nextPageDiv .e-pageDisabled").css("opacity", "0.5");
            }
            this.element.find("#" + this._id + "_SearchEditorTreeView").ejMaskEdit({
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
                height: this.model.enableMemberEditorSorting ? "200px" : (isAdvancedFilter ? "inherit" : "245px"),
                fields: { id: "id", text: "name", parentId: "pid", expanded: "expanded", isChecked: "checkedStatus", hasChild: "hasChildren", dataSource: ej.Pivot._showEditorLinkPanel(treeViewData, this, this.model.pivotControl) },

            });
            if (isAdvancedFilter) {
                this.element.find(".e-filterElementTag").ejMenu({
                    fields: { dataSource: filterTag, id: "id", parentId: "parentId", text: "text", spriteCssClass: "spriteCssClass" },
                    menuType: ej.MenuType.NormalMenu,
                    width: "100%",
                    enableRTL: this.model.enableRTL,
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
                var selectedlevel = ej.isNullOrUndefined(this._selectedLevel) ? "" : this._selectedLevel;
                selectedlevel = $.map(levelInfo, function (obj, index) { if (obj.value.toLowerCase() == selectedlevel.toLowerCase()) return obj.text; });

                var levelDropTarget = this.element.find('.groupLabelDrop').data("ejDropDownList");
                levelDropTarget.selectItemByText((selectedlevel.length > 0) ? selectedlevel[0] : levelDropTarget.model.dataSource[0].text);

                this.element.find(".e-memberEditorDiv").addClass("advancedFilter");

            }
            var schemaObj = this;
            if (!ej.isNullOrUndefined(this.model.pivotControl) && this.model.pivotControl.model.enableMemberEditorPaging && jQuery.isEmptyObject(this._currentFilterList))
                this._currentFilterList = JSON.parse(JSON.stringify(this._editorTreeData));
            else if (!ej.isNullOrUndefined(this.model.pivotControl) && !this.model.pivotControl.model.enableMemberEditorPaging && jQuery.isEmptyObject(this._currentFilterList))
                $(treeViewData).each(function (index, item) {
                    schemaObj._currentFilterList[item.id] = item;
                });
            var isTreeNodeHasChild = $.grep(treeViewData, function (item, index) { if (item.hasChildren == true) return item; }).length > 0;
            if (!isTreeNodeHasChild)
                this.element.find(".e-memberEditorDiv").addClass("noChildNode");

            var treeViewElements = this.element.find(".e-editorTreeView").find("li");
            for (var i = 0; i < treeViewElements.length; i++) {
                treeViewElements[i].setAttribute("data-tag", treeViewData[i].tag);
            }
            this.element.find(".e-dialogOKBtn, .e-dialogCancelBtn").ejButton({ type: ej.ButtonType.Button, click: ej.proxy(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this._clientDialogBtnClick : this._dialogBtnClick, this) });
            this._dialogOKBtnObj = this.element.find(".e-dialogOKBtn").data("ejButton");
            this._memberTreeObj = this.element.find(".e-editorTreeView").data("ejTreeView");
            var treeViewLi = this.element.find(".e-editorTreeView li:gt(0)"), firstNode = $(this._memberTreeObj.element.find("li:first")).find("span.e-chk-image"),
            uncheckedNodes = $(treeViewLi).find(":input.nodecheckbox:not(:checked)");
            if (uncheckedNodes.length > 0) {
                $(firstNode).removeClass("e-checkmark").addClass("e-stop");
            }
            if (!ej.isNullOrUndefined(this.model.pivotControl) && this.model.pivotControl.model.enableMemberEditorPaging) {
                //this.element.find(".memberPager").css("margin-top", "0px");
                if (!this._isAllMemberChecked) {
                    this._dialogOKBtnObj.disable();
                    this.element.find(".e-dialogOKBtn").attr('disabled', 'disabled');
                    $(firstNode).removeClass("e-checkmark").removeClass("e-stop").addClass("e-chk-inact");
                }
            }
            if (!ej.isNullOrUndefined(this.model.pivotControl._unSelectedNodes) && this.model.pivotControl._isMemberPageFilter) {
                var unSelectedNodes = this.model.pivotControl._unSelectedNodes;
                $.map(treeViewLi, function (ele, index) {
                    var member = ele;
                    $.map(unSelectedNodes, function (item, index) {
                        if ($(member).attr("data-tag") == item.tag) {
                            $($(member).find("span.e-chk-image")).removeClass("e-checkmark");
                            $(firstNode).removeClass("e-checkmark").addClass("e-stop");
                        }
                    })
                })
            }
            this.element.find(".e-clientDialog").ejDialog({ width: isAdvancedFilter ? "auto" : 265, target: "#" + this._id, enableResize: false, enableRTL: this.model.enableRTL, close: ej.proxy(ej.Pivot.closePreventPanel, this) });
            this.element.find(".e-clientDialog").next(".e-scrollbar").hide();
            this.element.find(".e-dialog .e-close").attr("title", this._getLocalizedLabels("Close"));
            if (isAdvancedFilter) {
                this.element.find("#clientDialog_wrapper").addClass("e-advancedFilterDlg");
                if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.pivotControl.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap)
                    this.element.find("#clientDialog_wrapper").addClass("advancedFilterDlgOSM");
                this.element.find("#clientDialog_wrapper").css("min-width", "265px");
                if (this._droppedClass != "e-schemaFilter") {
                    this.element.find(".e-clientDialog").css("padding", "0px").parents().parents().find(".e-titlebar").remove();
                    var reportItem = ej.Pivot.getReportItemByFieldName(currentHierarchy, this.model.pivotControl.model.dataSource).item, selectedOrder;
                    if (reportItem) {
                        if (reportItem["sortOrder"] && reportItem["sortOrder"] != ej.olap.SortOrder.None) {
                            selectedOrder = (reportItem["sortOrder"] == ej.olap.SortOrder.Descending) ? "desc" : "asc";
                            if (ej.isNullOrUndefined(selectedOrder) || selectedOrder == "asc")
                                this.element.find(".e-clientDialog .e-ascImage").addClass("e-selectedSort");
                            else
                                this.element.find(".e-clientDialog .e-descImage").addClass("e-selectedSort");
                        }
                    }
                }
            }
            if (this.model.enableMemberEditorSorting || (this.model.pivotControl && $(this.model.pivotControl.element).hasClass("e-pivotclient") && this.model.pivotControl.model.enableMemberEditorSorting)) {
                this._sortType = "";
                ej.Pivot._separateAllMember(this, isAdvancedFilter);
            }
            this._memberTreeObj.model.nodeCheck = ej.proxy(this._nodeCheckChanges, this);
            this._memberTreeObj.model.nodeUncheck = ej.proxy(this._nodeCheckChanges, this);
            (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) ? this._memberTreeObj.model.beforeExpand = ej.proxy(this._beforeNodeExpand, this) : this._memberTreeObj.model.nodeClick = ej.proxy(this._nodeExpand, this);
            if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) this._memberTreeObj.model.beforeCollapse = ej.proxy(ej.Pivot._onNodeCollapse, this);
            if (this._memberTreeObj.element.find(".e-plus").length == 0) {
                this._memberTreeObj.element.find(".e-item").css("padding", "0px");
            }
            this._isFiltered = false;
            this.model.pivotControl._isMemberPageFilter = false;
            if (!ej.isNullOrUndefined(this._waitingPopup))
                this._waitingPopup.hide();
            if (!ej.isNullOrUndefined(this._waitingPopup))
                this._waitingPopup.hide();
            this.element.find("#sep1").hover(function () {
                $(this).removeClass("e-mhover");
            });
            this._unWireEvents();
            this._wireEvents();
        },

        _applySorting: function () {
            var serializedCustomObject = JSON.stringify(this.model.pivotControl.model.customObject);
            var report;
            try {
                report = JSON.parse(this.model.pivotControl.getOlapReport()).Report;
            }
            catch (err) {
                report = this.model.pivotControl.getOlapReport();
            }
            if (this.model.pivotControl.model.beforeServiceInvoke != null)
                this._trigger("beforeServiceInvoke", { action: "sorting", element: this.element, customObject: this.model.customObject });

            var serializedCustomObject = JSON.stringify(this.model.pivotControl.model.customObject);
            var eventArgs = JSON.stringify({ "action": "sorting", "sortedHeaders": this.model.pivotControl._ascdes, "currentReport": report, "valueSorting": JSON.stringify(this.model.pivotControl.model.valueSortSettings), "customObject": serializedCustomObject });
            this._waitingPopup = this.element.data("ejWaitingPopup");
            if (!ej.isNullOrUndefined(this._waitingPopup))
                this._waitingPopup.show();
            if (!this.model.pivotControl.model.enableDeferUpdate)
                this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.sorting, eventArgs, this._filterElementSuccess);
            else {
                if (!ej.isNullOrUndefined(this._waitingPopup))
                    this._waitingPopup.hide();
            }
        },

        _filterElementClick: function (args) {
            var currentHierarchy = this._selectedFieldName;
            if (!ej.isNullOrUndefined(args.element))
                this._filterAction = $(args.element).parents("li:eq(0)#valueFilterBtn").length == 0 ? "labelFiltering" : "valueFiltering";
            else
                this._filterAction = args.menuId == "valueFilterBtn" ? "valueFiltering" : args.menuId == "labelFilterBtn" ? "labelFiltering" : "";
            var selectedLevelInfo = this.element.find(".groupLabelDrop").data("ejDropDownList");
            this._selectedLevelUniqueName = selectedLevelInfo.getSelectedValue();
            this.model.pivotControl._selectedField = this._selectedFieldName;
            if (this.model.pivotControl && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                this.model.pivotControl._selectedField = this.model.pivotControl._curFilteredText = this._curFilteredText;
                this.model.pivotControl._curFilteredAxis = this._curFilteredAxis;

                this._selectedField = this._curFilteredText
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    this.model.pivotControl._filterElementClick(args, this);
                }
                else {
                    var report;
                    try { report = JSON.parse(this.model.pivotControl.getOlapReport()).Report; }
                    catch (err) { report = this.model.pivotControl.getOlapReport(); }

                    var filterVal = [], levelName = this._selectedLevelUniqueName;
                    if ($(args.element).find(".e-descImage").length > 0 || $(args.element).find(".e-ascImage").length > 0 || $(args.element).find(".e-clrSort").length > 0) {
                        if (ej.isNullOrUndefined(this.model.pivotControl._ascdes))
                            this.model.pivotControl._ascdes = "";

                        if (this.model.pivotControl._ascdes.indexOf(this._selectedField) > -1)
                            this.model.pivotControl._ascdes = this.model.pivotControl._ascdes.replace(this._selectedField + "##", "");
                        else if ($(args.element).find(".e-clrSort").length == 0)
                            this.model.pivotControl._ascdes = this.model.pivotControl._ascdes + this._selectedField + "##";
                        this._applySorting(args);
                        return false;
                    }
                    else if ($(args.element).find(".e-clrFilter").length > 0) {
                        this.model.pivotControl._removeFilterTag(this._selectedLevelUniqueName);
                        var filterParams = this._selectedField + "::" + this._curFilteredText + "## Clear Filter" + ((this.model.pivotControl && $(this.model.pivotControl.element).hasClass("e-pivotclient") && !ej.isNullOrUndefined(this.model.pivotControl._ascdes) && this.model.pivotControl.model.enableAdvancedFilter) ? ">>#>#>>" + this.model.pivotControl._ascdes : "");
                        var serializedCustomObject = JSON.stringify(this.model.customObject), eventArgs = JSON.stringify({ "action": this._filterAction.toLowerCase(), "filterParams": filterParams, "sortedHeaders": this._ascdes, "currentReport": report, "customObject": serializedCustomObject, "gridLayout": this.model.pivotControl.model.layout });
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.filtering, eventArgs, this._filterElementSuccess);
                    }
                    else {
                        if ($(this.model.pivotControl.element).hasClass("e-pivotclient") && this.model.pivotControl._excelFilterInfo.length > 0 && $(args.element).siblings("li:eq(0)").attr("disable") != "true") {
                            var reportName = this.model.pivotControl._currentReportName, hierarchyName = this._selectedField;
                            filterVal = $.map(this.model.pivotControl._excelFilterInfo, function (item, index) { if (item.report == reportName && item.hierarchyUniqueName == hierarchyName || item.levelUniqueName == levelName) return { value1: item.value1, value2: item.value2, operator: item.operator, measure: item.measure }; });
                        }
                        ej.Pivot.createAdvanceFilterTag({ action: (this._filterAction == "labelFiltering" ? "labelFilterDlg" : "valueFilterDlg"), selectedArgs: args, filterInfo: filterVal }, this);
                    }
                }
                return false;
            }
            if ($(args.element).attr("id") == "clearAllFilters")
                this._clearAllFilter(args);
            else if ($(args.element).attr("id") == "clearSorting")
                this.model.pivotControl._clearSorting(args);

            else if ($(args.element).attr("id") == "ascOrder" || $(args.element).attr("id") == "descOrder")
                this._sortField(args);
            if ($(args.element).parent().hasClass("e-filterElementTag")) return;
            this.element.find(".e-dialog, .filterDialog, #preventDiv").remove();

            if ($.trim(args.text) == $.trim(this._getLocalizedLabels("ClearFilter"))) {
                this._clearFilter(currentHierarchy, this._selectedLevelUniqueName, this.model.pivotControl.model.dataSource);
                if (this.model.pivotControl && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    {
                        ej.PivotAnalysis._valueFilterArray = $.grep(ej.PivotAnalysis._valueFilterArray, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() != currentHierarchy.toLowerCase())) return obj; });
                        this.model.pivotControl.refreshControl();
                    }
                }
                else {
                    ej.olap.base.getJSONData({ action: "advancedfiltering" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
                }
                return false;
            }
            else {
                var dialogtitle, hierarchyLi, isHierarchyNode = false, currentLevelInfo = this._selectedLevelUniqueName;
                if (this.model.pivotControl) {
                    this.model.pivotControl._selectedLevelUniqueName = this._selectedLevelUniqueName;
                }
                var dialogContent, dropdownValues, filterValue = this._getAdvancedFiltervalue(currentHierarchy, this._selectedLevelUniqueName), topCountFilterParams = "";
                filterValue = ($(args.element).find(".e-activeFilter").length > 0 && filterValue.length > 0) ? filterValue[0].values : [""];

                var reportItem = ej.Pivot.getReportItemByFieldName(currentHierarchy, this.model.pivotControl.model.dataSource).item;
                var filterVal = [];
                if (reportItem && reportItem["advancedFilter"])
                    filterVal = $.map(reportItem["advancedFilter"], function (obj, index) { if (obj.name != undefined && (obj.name.toLowerCase() != currentLevelInfo)) return obj; });
                ej.Pivot.createAdvanceFilterTag({ action: (this._filterAction == "labelFiltering" ? "labelFilterDlg" : "valueFilterDlg"), selectedArgs: args, filterInfo: filterVal }, this);
            }
        },
        _getAdvancedFiltervalue: function (hierarchyUqName, levelUqName) {

            if (!(this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)) {
                var filterItem = ej.Pivot.getReportItemByFieldName(hierarchyUqName, this.model.pivotControl.model.dataSource, "XMLA").item, levelItem = [];
                if (filterItem.advancedFilter)
                    levelItem = $.map(filterItem.advancedFilter, function (obj, index) { if (obj.name != undefined && (obj.name.toLocaleLowerCase() == levelUqName.toLowerCase())) return obj; });
                return levelItem;
            }
            return [];

        },
        _filterOptionChanged: function (args) {
            var filterValue = this._getAdvancedFiltervalue(this._selectedFieldName, this._selectedLevelUniqueName);
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
        _removeFilterTag: function (uniqueName) {
            var isPivotServerMode = (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
            if (uniqueName.indexOf("].") >= 0 || isPivotServerMode) {
                var removeElement = (uniqueName.split("].").length > 2 || isPivotServerMode) ? "levelUniqueName" : "hierarchyUniqueName";
                if (this._excelFilterInfo.length > 0) {
                    levelName = this._selectedLevelUniqueName, hierarchyName = this._selectedFieldName;
                    this._excelFilterInfo = $.grep(this._excelFilterInfo, function (item, index) {
                        if (!(item[removeElement] == uniqueName))
                            return item;
                    });
                }
            }
        },
        _filterElementOkBtnClick: function (args) {
            var selectedOperator = this.element.find(".filterOptions")[0].value,
                enteredValue = [this.element.find("#filterValue1")[0].value],
                filter2TxtBx = (this.element.find("#filterValue2").length > 0 ? this.element.find("#filterValue2")[0].value : ""),
                filterInfo = [], currentHierarchy = this._selectedFieldName,
                currentLevelInfo = this._selectedLevelUniqueName.toLowerCase();

            if (this.model.pivotControl && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                var report, reportName = "", selectedMeasure = '';
                try { report = JSON.parse(this.model.pivotControl.getOlapReport()).Report; }
                catch (err) { report = this.model.pivotControl.getOlapReport(); }
                this.model.pivotControl._removeFilterTag(this._selectedLevelUniqueName);
                if (this.model.pivotControl.element.find('.reportlist'))
                    reportName = this.model.pivotControl.element.find('.reportlist').data("ejDropDownList").model.value;
                if (ej.isNullOrUndefined(this._excelFilterInfo))
                    this._excelFilterInfo = [];
                if (this._filterAction == "labelFiltering") {
                    this.model.pivotControl._excelFilterInfo.push({ report: reportName, action: this._filterAction, hierarchyUniqueName: this._selectedFieldName, levelUniqueName: this._selectedLevelUniqueName, operator: selectedOperator, measure: selectedMeasure, value1: enteredValue[0], value2: filter2TxtBx });
                    var selectedData = this._curFilteredText;
                    this._tempFilterData = $.map(this._tempFilterData, function (item, i) { if (!(item[selectedData])) return item; });
                    var filterParams = this._curFilteredAxis + "::" + this._curFilteredText + "##" + selectedOperator + "::" + enteredValue[0] + ((this.model.pivotControl && $(this.model.pivotControl.element).hasClass("e-pivotclient") && !ej.isNullOrUndefined(this.model.pivotControl._ascdes) && this.model.pivotControl.model.enableAdvancedFilter) ? ">>#>#>>" + this.model.pivotControl._ascdes : "");
                    var serializedCustomObject = JSON.stringify(this.model.customObject), eventArgs = JSON.stringify({ "action": this._filterAction, "filterParams": filterParams + "-##-" + JSON.stringify(this.model.pivotControl.model.valueSortSettings), "sortedHeaders": this._ascdes, "currentReport": report, "valueSorting": JSON.stringify(this.model.valueSortSettings), "customObject": serializedCustomObject, "gridLayout": this.model.pivotControl.model.layout });
                    this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.filtering, eventArgs, this._filterElementSuccess);
                }
                else {
                    var selectedData = this._curFilteredText;
                    this._measureDDL = this.element.find(".filterMeasures").data("ejDropDownList");
                    selectedMeasure = this._measureDDL.getSelectedValue();
                    this.model.pivotControl._excelFilterInfo.push({ report: reportName, action: this._filterAction, hierarchyUniqueName: this._selectedFieldName, levelUniqueName: this._selectedLevelUniqueName, operator: selectedOperator, measure: selectedMeasure, value1: enteredValue[0], value2: filter2TxtBx });
                    this._tempFilterData = $.map(this._tempFilterData, function (item, i) { if (!(item[selectedData])) return item; });

                    var filterParams = this._curFilteredText + "::" + selectedOperator + "::" + selectedMeasure + "::" + enteredValue[0] + "::" + filter2TxtBx + ((this.model.pivotControl && $(this.model.pivotControl.element).hasClass("e-pivotclient") && !ej.isNullOrUndefined(this.model.pivotControl._ascdes) && this.model.pivotControl.model.enableAdvancedFilter) ? ">>#>#>>" + this.model.pivotControl._ascdes : "");
                    var serializedCustomObject = JSON.stringify(this.model.customObject), eventArgs = JSON.stringify({ "action": this._filterAction, "filterParams": filterParams + "-##-" + JSON.stringify(this.model.pivotControl.model.valueSortSettings), "sortedHeaders": this._ascdes, "currentReport": report, "valueSorting": JSON.stringify(this.model.valueSortSettings), "customObject": serializedCustomObject, "gridLayout": this.model.layout });
                    this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.filtering, eventArgs, this._filterElementSuccess);

                }
                return false;
            }
            if (this._filterAction == "valueFiltering") {
                if (!(!isNaN(parseFloat(enteredValue[0])) && isFinite(enteredValue[0])) || this._measureDDL.getSelectedValue() == "") { return; };
                this.element.find("#filterValue2")[0] != undefined ? "," + enteredValue.push(this.element.find("#filterValue2")[0].value) : enteredValue;
            }
            this.element.find(".e-dialog").remove();
            var reportItem = ej.Pivot.getReportItemByFieldName(currentHierarchy, this.model.pivotControl.model.dataSource).item
            if (reportItem) {
                delete reportItem["filterItems"];
                if (reportItem["advancedFilter"])
                    filterInfo = $.map(reportItem["advancedFilter"], function (obj, index) { if (obj.name != undefined && (obj.name.toLocaleLowerCase() != currentLevelInfo.toLowerCase())) return obj; });
                if (this._filterAction.toLowerCase() == "labelfiltering")
                    filterInfo.push({ name: this._selectedLevelUniqueName, labelFilterOperator: selectedOperator.replace(/ /g, ""), advancedFilterType: ej.olap.AdvancedFilterType.LabelFilter, values: enteredValue });
                else
                    filterInfo.push({ name: this._selectedLevelUniqueName, valueFilterOperator: selectedOperator.replace(/ /g, ""), advancedFilterType: ej.olap.AdvancedFilterType.ValueFilter, values: enteredValue, measure: this._measureDDL.getSelectedValue() });

                this.model.pivotControl._currentReportItems = $.grep(this.model.pivotControl._currentReportItems, function (value, i) { if (value["fieldName"] != currentHierarchy) return value; });
                reportItem["advancedFilter"] = filterInfo;
            }
            if (this.model.pivotControl && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                ej.PivotAnalysis._valueFilterArray = $.grep(ej.PivotAnalysis._valueFilterArray, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() != currentHierarchy.toLowerCase())) return obj; });
                if (this._filterAction == "valueFiltering" && !ej.isNullOrUndefined(reportItem)) {
                    ej.PivotAnalysis._valueFilterArray.push(reportItem);
                }
                this.model.pivotControl.refreshControl();
            }
            else
                ej.olap.base.getJSONData({ action: "advancedfiltering" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
        },
        _groupLabelChange: function (args) {

            var filterMenuObj = this.element.find(".e-filterElementTag").data("ejMenu");
            filterMenuObj.disableItemByID("labelClearFilter");
            filterMenuObj.disableItemByID("valueClearFilter");
            filterMenuObj.disableItemByID("clearAllFilters");
            filterMenuObj.disableItemByID("clearSorting");
            if (this.model.pivotControl && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                this.model.pivotControl._selectedLevelUniqueName = args.selectedValue;
                var filterInfo = [], filterIndicator = ej.buildTag("span.e-filterState").addClass("e-icon").attr("aria-label", "filter state")[0].outerHTML;
                if (this.model.pivotControl._excelFilterInfo.length > 0) {
                    var levelName = this.model.pivotControl._selectedLevelUniqueName, hierarchyName = this.model.pivotControl._selectedFieldName;
                    filterInfo = $.map(this.model.pivotControl._excelFilterInfo, function (item, index) {
                        if (item.hierarchyUniqueName == hierarchyName && item.levelUniqueName == levelName)
                            return { action: item.action, operator: item.operator, value1: item.value1 };
                    });
                }
                this.element.find(".e-filterElementTag .e-activeFilter,.e-filterState").remove();
                this.element.find("#labelClearFilter ,#valueClearFilter").css("opacity", "0.5").attr("disable", true);

                if (filterInfo.length > 0 && !ej.isNullOrUndefined(filterInfo[0]["operator"])) {
                    var filterTag = "", filterId = "";
                    if (filterInfo[0].action.toLowerCase() == "valuefiltering") {
                        filterTag = "valueFilterBtn";
                        filterId = filterId = (filterInfo[0]["operator"] == "equals" || filterInfo[0]["operator"] == "not equals" || filterInfo[0]["operator"] == "less than or equal to" || filterInfo[0]["operator"] == "greater than or equal to" || filterInfo[0]["operator"] == "greater than" || filterInfo[0]["operator"] == "less than") ? "_valueFilter" : "";
                    }
                    else {
                        filterTag = "labelFilterBtn";
                        filterId = (filterInfo[0]["operator"] == "equals" || filterInfo[0]["operator"] == "not equals" || filterInfo[0]["operator"] == "less than or equal to" || filterInfo[0]["operator"] == "greater than or equal to" || filterInfo[0]["operator"] == "greater than" || filterInfo[0]["operator"] == "less than") ? "_labelFilter" : "";
                    }
                    if (filterTag == "labelFilterBtn")
                        filterMenuObj.enableItemByID("labelClearFilter");
                    else
                        filterMenuObj.enableItemByID("valueClearFilter");
                    filterMenuObj.enableItemByID("clearAllFilters");
                    this.element.find("#" + filterTag + " a:eq(0)").append(filterIndicator);
                    this.element.find("#" + filterTag + " #labelClearFilter").removeAttr("style disable");
                    this.element.find("#" + filterTag + " #valueClearFilter").removeAttr("style disable");

                    if (filterInfo[0]["operator"].replace(/ /g, '') == "BottomCount")
                        this.element.find("#" + filterTag + " li#" + filterInfo[0]["operator"].replace(/ /g, '').replace("Bottom", "top") + " a").append($(ej.buildTag("span.e-activeFilter e-icon")[0].outerHTML));
                    else
                        this.element.find("#" + filterTag + " li#" + filterInfo[0]["operator"].replace(/ /g, '') + filterId + " a").append($(ej.buildTag("span.e-activeFilter e-icon")[0].outerHTML));
                }
                else {
                    if (this._getUnSelectedNodes() != "")
                        this.element.find(".e-memberEditorDiv").before("<div class='e-filterState e-icon' style='top:126px;position:absolute;visibility:hidden'  />");
                }
                if (this.model.pivotControl && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    var filterElem = this.element.find("#clearAllFilters a").children().clone();
                    this.element.find("#clearAllFilters a").text(this._getLocalizedLabels("ClearFilter") + " from \"" + args.text + "\"").append(filterElem);
                    var levelName = this.model.pivotControl._curFilteredText;
                    var sorting = ej.isNullOrUndefined(this.model.pivotControl._ascdes) ? [] : $.grep(this.model.pivotControl._ascdes.split("##"), function (value, i) { if (value == levelName) return value; });
                    if (sorting.length > 0) {
                        this.element.find(".e-descImage").addClass("e-selectedSort");
                        filterMenuObj.enableItemByID("clearSorting");
                    }
                    else
                        this.element.find(".e-ascImage").addClass("e-selectedSort");
                    if (filterInfo.length > 0) {
                        this.element.find(".e-editorTreeView").data("ejTreeView").checkAll();
                        this._editorTreeData = $.map(this._editorTreeData, function (itm) { itm.checkedStatus = true; return itm; });
                        this._editorDrillTreeData = $.map(this._editorTreeData, function (itm) { itm.checkedStatus = true; return itm; });
                        this._editorSearchTreeData = $.map(this._editorTreeData, function (itm) { itm.checkedStatus = true; return itm; });
                    }
                }
                return false;
            }
            var me = this;//this.element.hasClass("e-pivotschemadesigner") ? this.model.pivotControl : 
            var selectedLevelInfo = this.element.find(".groupLabelDrop").length > 0 ? this.element.find(".groupLabelDrop").data("ejDropDownList") : [];
            var filterData = me._getAdvancedFiltervalue(me._selectedFieldName, selectedLevelInfo.getSelectedValue());
            var filterMenuObj = this.element.find(".e-filterElementTag").data("ejMenu");
            var isIncludeFilter = ej.Pivot.getReportItemByFieldName(me._selectedFieldName, me.model.pivotControl.model.dataSource).item;
            var filterIndicator = ej.buildTag("span.e-filterState").addClass("e-icon").attr("aria-label", "filter state")[0].outerHTML;
            var activeFilter = ej.buildTag("span.e-activeFilter").addClass("e-icon")[0].outerHTML;

            var reportItem = ej.Pivot.getReportItemByFieldName(me._selectedFieldName, me.model.pivotControl.model.dataSource).item, selectedOrder;
            if (reportItem) {
                if (reportItem["sortOrder"] && reportItem["sortOrder"] != ej.olap.SortOrder.None) {
                    selectedOrder = (reportItem["sortOrder"] == ej.olap.SortOrder.Descending) ? "desc" : "asc";
                    if (ej.isNullOrUndefined(selectedOrder) || selectedOrder == "asc")
                        this.element.find(".e-clientDialog .e-ascImage").addClass("e-selectedSort");
                    else {
                        this.element.find(".e-clientDialog .e-descImage").addClass("e-selectedSort");
                        filterMenuObj.enableItemByID("clearSorting");
                    }
                }
                else
                    this.element.find("#clearSorting").css("opacity", "0.5").attr("disabled", "disabled");
            }
            this.element.find("#clearAllFilters").css("opacity", "0.5").attr("disabled", "disabled");
            this.element.find(".e-filterState,.e-activeFilter").remove();
            var filterElem = this.element.find("#clearAllFilters a").children().clone();
            this.element.find("#clearAllFilters a").text(this._getLocalizedLabels("ClearFilter") + " from \"" + args.text + "\"").append(filterElem);

            if (filterData.length > 0) {
                if (filterData[0]["advancedFilterType"] == ej.olap.AdvancedFilterType.LabelFilter) {
                    this.element.find("#labelFilterBtn a:eq(0)").append(filterIndicator);
                    this.element.find("#labelFilterBtn .clearFilter").css("opacity", "1").removeAttr("disabled");
                    var labelFilter = (filterData[0]["labelFilterOperator"] == "equals" || filterData[0]["labelFilterOperator"] == "notequals" || filterData[0]["labelFilterOperator"] == "lessthanorequalto" || filterData[0]["labelFilterOperator"] == "greaterthanorequalto" || filterData[0]["labelFilterOperator"] == "greaterthan" || filterData[0]["labelFilterOperator"] == "lessthan") ? "_labelFilter" : "";
                    this.element.find("#labelFilterBtn li#" + filterData[0]["labelFilterOperator"] + labelFilter + " a").append(activeFilter);
                    filterMenuObj.enableItemByID("labelClearFilter");
                }
                else {
                    this.element.find("#valueFilterBtn a:eq(0)").append(filterIndicator);
                    this.element.find("#valueFilterBtn .clearFilter").css("opacity", "1").removeAttr("disabled");
                    var valueFilter = (filterData[0]["valueFilterOperator"] == "equals" || filterData[0]["valueFilterOperator"] == "notequals" || filterData[0]["valueFilterOperator"] == "lessthanorequalto" || filterData[0]["valueFilterOperator"] == "greaterthanorequalto" || filterData[0]["valueFilterOperator"] == "greaterthan" || filterData[0]["valueFilterOperator"] == "lessthan") ? "_valueFilter" : "";
                    this.element.find("#valueFilterBtn li#" + filterData[0]["valueFilterOperator"] + valueFilter + " a").append(activeFilter);
                    filterMenuObj.enableItemByID("valueClearFilter");
                }
                filterMenuObj.enableItemByID("clearAllFilters");
                this.element.find("#clearAllFilters").css("opacity", "1").removeAttr("disabled");
            }
            else if ((isIncludeFilter.length > 0 && isIncludeFilter[0]["filterItems"]) || (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && isIncludeFilter && isIncludeFilter.filterItems)) {
                this.element.find(".e-memberEditorDiv").before(filterIndicator);
                this.element.find(".e-filterState").addClass("memberFilter").css("visibility", "hidden");
                this.element.find("#clearAllFilters").css("opacity", "1").removeAttr("disabled");
            }
        },

        _clearAllFilter: function (args) {
            ej.Pivot.closePreventPanel(this);
            this.element.find(".e-dialog").remove();
            this._clearFilter(this._selectedFieldName, this._selectedLevelUniqueName, this.model.pivotControl.model.dataSource);
            var reportItem = ej.Pivot.getReportItemByFieldName(this._selectedFieldName, this.model.pivotControl.model.dataSource);
            if (reportItem && reportItem.item && reportItem.item.filterItems)
                reportItem.item.filterItems.values = [];
            if (this.model.pivotControl && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                var fieldName = this._selectedFieldName;
                ej.PivotAnalysis._valueFilterArray = $.grep(ej.PivotAnalysis._valueFilterArray, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() != fieldName.toLowerCase())) return obj; });
                this.model.pivotControl.refreshControl();
            }
            else
                ej.olap.base.getJSONData({ action: "advancedfiltering" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
        },

        _clearFilter: function (currentHierarchy, currentLevelInfo, dataSource) {
            var reportItem = ej.Pivot.getReportItemByFieldName(currentHierarchy, dataSource);
            if (reportItem.item && reportItem.item["advancedFilter"]) {
                currentLevelInfo = (this.model.pivotControl && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) ? currentHierarchy : currentLevelInfo;
                reportItem.item["advancedFilter"] = $.map(reportItem.item["advancedFilter"], function (obj, index) { if (obj.name != undefined && (obj.name.toLowerCase() != currentLevelInfo.toLowerCase())) return obj; });
            }
        },
        _createPivotButton: function (text, axis, isFiltered, isSorted, dropPostion) {
            var filtered = "", descending = "";
            if (isFiltered) { filtered = "filtered" };
            if (isSorted) { descending = "descending" };
            var pvtAxis = axis == "row" ? ".e-schemaRow" : axis == "column" ? ".e-schemaColumn" : axis == "value" ? ".e-schemaValue" : ".e-schemaFilter";
            if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                var tagAxis = axis == "column" ? "columns" : axis == "row" ? "rows" : axis == "filter" ? "filters" : "values";
                //test  var rowBtn = ej.buildTag("div.e-pivotButton", ej.buildTag("div.e-dropIndicator")[0].outerHTML + ej.buildTag("button.e-pvtBtn#e-pivotButton" + text.fieldName, ((text.fieldCaption != undefined) ? text.fieldName : text.fieldCaption), {}, { "fieldName": text.fieldName, "axis": tagAxis })[0].outerHTML +
                var sortBtn = (axis == "column" || axis == "row") && this.model.layout != "excel" && this._dataModel != "Olap" && this._dataModel != "XMLA" ? ej.buildTag("span.sorting e-icon " + descending).attr("role", "button").attr("aria-label", "sort").attr("aria-expanded", "false")[0].outerHTML : "",
                filterBtn = (axis == "column" || axis == "row" || axis == "filter") && this.model.layout != "excel" && text.fieldCaption != "Measures" ? ej.buildTag("span.filter e-icon " + filtered).attr("role", "button").attr("aria-label", "filter")[0].outerHTML : "",
                removeBtn = this.model.layout != "excel" ? ej.buildTag("span.e-removeBtn e-icon").attr("role", "button").attr("aria-label", "remove")[0].outerHTML : "",
                    rowBtn = ej.buildTag("div.e-pivotButton", ej.buildTag("div.e-dropIndicator")[0].outerHTML + ej.buildTag("div.pvtBtnDiv", ej.buildTag("button.e-pvtBtn#pivotButton" + text.fieldName, this.model.pivotControl._dataModel != "XMLA" ? $.grep(this.model.pivotTableFields, function (item) { return item.name == text.fieldName; })[0].caption : text.fieldCaption, {}, { "data-fieldName": text.fieldName, "data-fieldCaption": text.fieldCaption, "data-axis": tagAxis })[0].outerHTML +
                   filterBtn + sortBtn + removeBtn).attr("data-tag", tagAxis + ":" + text.fieldName)[0].outerHTML).attr("data-tag", tagAxis + ":" + text.fieldName)[0].outerHTML;
            }
            else {
                var filterState = "";
                var item = { DimensionName: text.fieldName, DimensionHeader: text.fieldCaption, Tag: text.fieldName };
                if (!ej.isNullOrUndefined(this.model.pivotControl) && axis == "filter") {
                    filterState = ej.Pivot._getFilterState("", [], item, this.model.pivotControl);
                }
                var tagAxis = axis == "column" ? "columns" : axis == "row" ? "rows" : axis == "filter" ? (this.model.pivotControl.model.analysisMode == ej.PivotGrid.AnalysisMode.Pivot ? "filters" : "slicers") : "values";
                var sortBtn = (axis == "column" || axis == "row") && this.model.layout != "excel" && this._dataModel != "Olap" && this._dataModel != "XMLA" ? ej.buildTag("span.sorting e-icon " + descending).attr("role", "button").attr("aria-label", "sort").attr("aria-expanded", "false")[0].outerHTML : "",
                filterBtn = (axis == "column" || axis == "row" || axis == "filter") && this.model.layout != "excel" && text.fieldCaption != "Measures" ? ej.buildTag("span.filter e-icon " + filtered).attr("role", "button").attr("aria-label", "filter")[0].outerHTML : "",
                removeBtn = this.model.layout != "excel" ? ej.buildTag("span.e-removeBtn e-icon").attr("role", "button").attr("aria-label", "remove")[0].outerHTML : "",
                rowBtn = ej.buildTag("div.e-pivotButton", ej.buildTag("div.e-dropIndicator")[0].outerHTML + ej.buildTag("div.pvtBtnDiv", ej.buildTag("button.e-pvtBtn#pivotButton" + text.fieldName, ((this._dataModel == "Pivot" ? (text.fieldCaption) : (text == "Measures" ? text : (!ej.isNullOrUndefined(text["fieldCaption"]) && text["fieldCaption"] != "" ? text["fieldCaption"] : text.fieldName.split(".")[1]))) + (filterState != "" ? (" (" + filterState + ")") : "")), {}, { "data-fieldName": text.fieldName, "data-fieldCaption": text.fieldCaption, "data-axis": tagAxis })[0].outerHTML +
                filterBtn + sortBtn + removeBtn).attr("data-tag", tagAxis + ":" + text.fieldName)[0].outerHTML).attr("data-tag", tagAxis + ":" + (!ej.isNullOrUndefined(text["fieldName"]) ? text["fieldName"] : text))[0].outerHTML;
            }
            if (typeof (dropPostion) == "number" && $(this.element.find(pvtAxis + " .e-pivotButton")[dropPostion]).length > 0)
                axis == "row" ? $(this.element.find(".e-schemaRow .e-pivotButton")[dropPostion]).before(rowBtn) : axis == "column" ? $(this.element.find(".e-schemaColumn .e-pivotButton")[dropPostion]).before(rowBtn) :
            axis == "value" ? $(this.element.find(".e-schemaValue .e-pivotButton")[dropPostion]).before(rowBtn) : axis == "filter" ? $(this.element.find(".e-schemaFilter .e-pivotButton")[dropPostion]).before(rowBtn) : "";
            else
                axis == "row" ? this.element.find(".e-schemaRow").append(rowBtn) : axis == "column" ? this.element.find(".e-schemaColumn").append(rowBtn) :
            axis == "value" ? this.element.find(".e-schemaValue").append(rowBtn) : axis == "filter" ? this.element.find(".e-schemaFilter").append(rowBtn) : "";
            var pvtExp = (typeof (dropPostion) != "number" && dropPostion == "") ? " .e-pivotButton .e-pvtBtn:last" : " .e-pivotButton .e-pvtBtn:eq(" + dropPostion + ")";
            if (this.model.enableDragDrop) {
                this.element.find(pvtAxis + pvtExp).ejButton({ size: "normal", type: ej.ButtonType.Button, enableRTL: this.model.enableRTL }).ejDraggable({
                    handle: 'button', clone: true,
                    cursorAt: { left: -5, top: -5 },
                    dragStart: ej.proxy(function (args) {
                        this._isDragging = true;
                    }, this),
                    dragStop: ej.proxy(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? this._pvtBtnDropped : this._clientOnPvtBtnDropped, this),
                    helper: ej.proxy(function (event, ui) {
                        $(event.element).addClass("dragHover");
                        if (event.sender.target.className.indexOf("e-btn") > -1) {
                            var btnClone = $(event.sender.target).clone().attr("id", this._id + "_dragClone").appendTo('body');
                            $("#" + this._id + "_dragClone").removeAttr("style").height($(event.sender.target).height());
                            return btnClone;
                        }
                        else
                            return false;
                    }, this)
                });
            }
            this.element.find(pvtAxis + " .e-pivotButton .filterBtn:last").ejButton({
                size: "normal",
                enableRTL: this.model.enableRTL,
                type: ej.ButtonType.Button,
                contentType: "imageonly",
                prefixIcon: "filter"
            });
            this.element.find(pvtAxis + " .e-pivotButton input:last").ejToggleButton({
                size: "normal",
                enableRTL: this.model.enableRTL,
                contentType: "imageonly",
                defaultPrefixIcon: "ascending",
                activePrefixIcon: "descending",
                click: ej.proxy(this._sortBtnClick, this)
            });
            if (isSorted) {
                this.element.find(pvtAxis + " .e-pivotButton:contains(" + text + ") span:eq(0) span").removeClass("ascending").addClass("descending");
                this.element.find(pvtAxis + " .e-pivotButton:contains(" + text + ") span:eq(0) button").addClass("e-active");
            }
            if (this.model.pivotControl._dataModel == "XMLA") {
                if (this.element.find(".e-pivotButton[data-tag*=':Measures']").length > 0) {
                    var cloneBtn = $(pvtAxis + " .e-pivotButton[data-tag*=':Measures']");
                    $(pvtAxis).append(cloneBtn);
                }
            }
            this.element.find(".e-dropIndicator").removeClass("e-dropIndicatorHover");
            this._createContextMenu();
        },

        _createContextMenu: function () {
            var ele = this.element.find(".e-pivotButton");
            if (this.model.pivotControl != null) {
                var contextTag = ej.buildTag("ul.pivotTreeContextMenu#" + this._id + "_pivotTreeContextMenu",
                    ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToFilter"))[0].outerHTML)[0].outerHTML +
                    ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToRow"))[0].outerHTML)[0].outerHTML +
                    ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToColumn"))[0].outerHTML)[0].outerHTML +
                    ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToValues"))[0].outerHTML)[0].outerHTML
                    )[0].outerHTML;
                $(this.element).append(contextTag);
                $("#"+this._id+"_pivotTreeContextMenu").ejMenu({
                    menuType: ej.MenuType.ContextMenu,
                    enableRTL: this.model.enableRTL,
                    openOnClick: false,
                    contextMenuTarget: ele,
                    click: ej.proxy(this._contextClick, this),
                    beforeOpen: ej.proxy(this._onContextOpen, this),
                    close: ej.proxy(ej.Pivot.closePreventPanel, this)
                });
            }
        },

        _createPivotButtons_1: function (rows, axis) {
            if (!ej.isNullOrUndefined(rows)) {
                var rowBtns = "", tagAxis = axis == "column" ? "Columns" : axis == "row" ? "Rows" : axis == "filter" ? "Slicers" : "";
                if (this.model.pivotControl != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                    var tagAxis = axis == "column" ? "Columns" : axis == "row" ? "Rows" : axis == "filter" ? "Slicers" : "values";
                    if (tagAxis == "values" && this.model.pivotControl._dataModel == "XMLA")
                        rows = $.map(rows, function (obj, index) { return obj["measures"]; });
                    for (var i = 0; i < rows.length; i++) {
                        var filter = (this.model.pivotControl._dataModel == "XMLA" || this.model.pivotControl._dataModel == "Olap") ? "" : !ej.isNullOrUndefined(rows[i].filterItems) ? "filtered" : "";
                        var sort = (this.model.pivotControl._dataModel == "XMLA" || this.model.pivotControl._dataModel == "Olap") ? "" : rows[i].sortOrder == ej.PivotAnalysis.SortOrder.Descending ? "descending" : "";
                        var buttonId = this.model.pivotControl._dataModel == "XMLA" ? "" : rows[i].fieldName;
                        var sortBtn = (axis == "column" || axis == "row") && this.model.layout != "excel" && this.model.pivotControl._dataModel != "Olap" && this.model.pivotControl._dataModel != "XMLA" ? ej.buildTag("span.sorting e-icon " + sort).attr("role", "button").attr("aria-label", "sort").attr("aria-expanded", "false")[0].outerHTML : "",
                        filterBtn = (axis == "column" || axis == "row" || axis == "filter") && this.model.layout != "excel" && rows[i].fieldCaption != "Measures" ? ej.buildTag("span.filter e-icon " + filter).attr("role", "button").attr("aria-label", "filter")[0].outerHTML : "",
                        removeBtn = this.model.layout != "excel" ? ej.buildTag("span.e-removeBtn e-icon").attr("role", "button").attr("aria-label", "remove")[0].outerHTML : "";
                        rowBtns += ej.buildTag("div.e-pivotButton",
                                    ej.buildTag("div.e-dropIndicator")[0].outerHTML + ej.buildTag("div.pvtBtnDiv",
                                    ej.buildTag("button.e-pvtBtn#pivotButton" + buttonId, this.model.pivotControl._dataModel == "XMLA" ? (rows[i].fieldCaption != undefined ? rows[i].fieldCaption : rows[i].fieldName) || rows[i] : $.grep(this.model.pivotTableFields, function (item) { return item.name == rows[i].fieldName; })[0].caption || $.grep(this.model.pivotTableFields, function (item) { return item.name == rows[i]; })[0].caption, {}, { "data-fieldName": rows[i].fieldName || rows[i], "data-axis": tagAxis })[0].outerHTML +   //+#pivotButton rows[i].fieldName || rows[i]
                                    filterBtn + sortBtn + removeBtn).attr("data-tag", tagAxis + ":" + rows[i].fieldName || rows[i])[0].outerHTML).attr("data-tag", tagAxis + ":" + rows[i].fieldName || rows[i])[0].outerHTML;
                    }
                }
                else {
                    if (tagAxis == "" && axis == "values") {
                        var tempAxis = this.element.find(".e-pivotButton:contains(" + this._getLocalizedLabels("Measures") + ")").length > 0 ? this.element.find(".e-pivotButton:contains('" + this._getLocalizedLabels("Measures") + "')").parent()[0].className.split(" ")[0] : "e-schemaColumn";
                        tagAxis = tempAxis == "e-schemaColumn" ? "Columns" : "Rows";
                    }
                    for (var i = 0; i < rows.length; i++) {
                        rows[i].FieldHeader = rows[i].FieldHeader == "Measures" ? this._getLocalizedLabels("Measures") : rows[i].FieldHeader;
                        var sortBtn = (axis == "column" || axis == "row") && this.model.layout != "excel" && this._dataModel != "Olap" && this._dataModel != "XMLA" ? ej.buildTag("span.sorting e-icon ").attr("role", "button").attr("aria-label", "sort").attr("aria-expanded", "false")[0].outerHTML : "",
                        filterBtn = (axis == "column" || axis == "row" || axis == "filter") && this.model.layout != "excel" && rows[i].FieldHeader != "Measures" ? ej.buildTag("span.filter e-icon").attr("role", "button").attr("aria-label", "filter")[0].outerHTML : "",
                        removeBtn = this.model.layout != "excel" ? ej.buildTag("span.e-removeBtn e-icon").attr("role", "button").attr("aria-label", "remove")[0].outerHTML : "";
                        rowBtns += ej.buildTag("div.e-pivotButton", ej.buildTag("div.e-dropIndicator")[0].outerHTML + ej.buildTag("div.pvtBtnDiv", ej.buildTag("button.e-pvtBtn#pivotButton" + rows[i].FieldHeader || rows[i].FieldName || rows[i].Name || rows[i].DimensionName, rows[i].FieldHeader || rows[i].FieldName || rows[i].Name || rows[i].DimensionName)[0].outerHTML +
                        filterBtn + sortBtn + removeBtn).attr("data-tag", tagAxis + ":" + rows[i].Tag)[0].outerHTML).attr("data-tag", tagAxis + ":" + rows[i].Tag)[0].outerHTML;
                    }
                }
                this._createContextMenu();
                return rowBtns;
            }
        },

        _setSplitBtnTargetPos: function (event) {
            var targetPosition = ""; var AEBdiv; var targetSplitBtn; var className;
            if (event.event != undefined && event.event.type == "touchend") {
                targetSplitBtn = event.event.originalEvent.target != null ? $(event.event.originalEvent.target).parents(".e-pivotButton") : $(event.event.originalEvent.srcElement).parents(".e-pivotButton");
                className = event.event.originalEvent.target != null ? event.event.originalEvent.target.className : event.event.originalEvent.srcElement.className;
            }
            else {
                targetSplitBtn = ej.isNullOrUndefined(event.originalEvent) ? $(event.target).parents(".e-pivotButton") : event.originalEvent.target != null ? $(event.originalEvent.target).parents(".e-pivotButton") : $(event.originalEvent.srcElement).parents(".e-pivotButton");
                className = ej.isNullOrUndefined(event.originalEvent) ? $(event.target).attr("class") ? $(event.target).attr("class") : "" : event.originalEvent.target != null && $(event.originalEvent.target).attr("class") ? $(event.originalEvent.target).attr("class") : $(event.originalEvent.srcElement).attr("class") ? $(event.originalEvent.srcElement).attr("class") : "";
            }
            this._droppedClass = targetSplitBtn.length > 0 ? $(targetSplitBtn[0]).parent()[0].className.split(" ")[0] : className.split(" ")[0];
            if (targetSplitBtn[0] || (className != undefined && className != null && jQuery.type(className) == "string" && className.indexOf("e-pivotButton") > -1)) {
                targetSplitBtn = targetSplitBtn[0] ? targetSplitBtn[0] : event.originalEvent.target != null ? event.originalEvent.target : event.originalEvent.srcElement;
                if (event.event != undefined && event.event.type == "touchend")
                    AEBdiv = event.target;
                else if (this._droppedClass != null && this._droppedClass != undefined && this._droppedClass != "")
                    AEBdiv = this.element.find("." + this._droppedClass)[0];
                else
                    AEBdiv = targetSplitBtn.parentNode;
                AEBdiv = $(AEBdiv).children(".e-pivotButton");
                for (var i = 0; i < AEBdiv.length; i++) {
                    if ($(AEBdiv[i]).attr("data-tag") == $(targetSplitBtn).attr("data-tag"))
                        targetPosition = i;
                }
            }
            return targetPosition;
        },

        _getUnSelectedNodes: function () {
            var treeElement = this.element.find(".e-editorTreeView")[0];
            var unselectedNodes = "";
            var data = $(treeElement).find(":input.nodecheckbox:not(:checked)");
            for (var i = 0; i < data.length; i++) {
                if (!($(data[i].parentElement).find('span:nth-child(1)').attr('class').indexOf("e-chk-act") > -1) && $(data[i].parentElement).attr('aria-checked') != 'mixed') {
                    var parentNode = $(data[i]).parents('li:eq(0)');
                    unselectedNodes += "::" + parentNode[0].id + "||" + $(parentNode).attr('data-tag') + (this._dialogHead == "KPI" ? ("~&" + $($(data[i]).parents("ul:eq(1) li")[1]).attr("data-tag")) : "");
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
                var treeElement = $(".e-editorTreeView");
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

        doAjaxPost: function (type, url, data, onSuccess, onComplete, customArgs) {
            this.model.pivotControl.model.editCellsInfo = {};
            var contentType, dataType, successEvt, isAsync = true, withCred = (this.model.enableXHRCredentials || this.model.pivotControl.model.enableXHRCredentials);
            if ((data["XMLA"] == undefined))
                contentType = 'application/json; charset=utf-8', dataType = 'json', successEvt = $.proxy(onSuccess, this);
            else
                contentType = 'text/xml', dataType = 'xml', data = data["XMLA"], successEvt = $.proxy(onSuccess, this, customArgs), isAsync = (!ej.isNullOrUndefined(customArgs) && customArgs["action"] != "loadFieldElements") ? true : false;
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
                complete: $.proxy(onComplete, this),
                error: function (msg, textStatus, errorThrown) {
                    this.model.pivotControl._ogridWaitingPopup.hide();
                }
            };
            if (!withCred)
                delete post['xhrFields'];
            $.ajax(post);
        },
    });

    ej.PivotSchemaDesigner.Locale = ej.PivotSchemaDesigner.Locale || {};

    ej.PivotSchemaDesigner.Locale["en-US"] = {
        Sort: "Sort",
        Search: "Search",
        SelectField: "Select field",
        LabelFilterLabel: "Show the items for which the label",
        ValueFilterLabel: "Show the items for which",
        ClearSorting: "Clear Sorting",
        ClearFilterFrom: "Clear Filter From",
        SortAtoZ: "Sort A to Z",
        SortZtoA: "Sort Z to A",
        and: "and",

        LabelFilters: "Label Filters  ",
        BeginsWith: "Begins With",
        DoesNotBeginsWith: "Not Begins With",
        EndsWith: "Ends With",
        DoesNotEndsWith: "Not Ends With",
        Contains: "Contains",
        DoesNotContains: "Not Contains",

        ValueFilters: "Value Filters",
        ClearFilter: "Clear Filter",
        Equals: "Equals",
        DoesNotEquals: "Not Equals",
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
        ClearFilter: "Clear Filter",
        SelectField: "Select field",
        Measures: "Measures",
        Warning: "Warning",
        AlertMsg: "The field you are moving cannot be placed in that area of the report",
        Goal: "Goal",
        Status: "Status",
        Trend: "Trend",
        Value: "Value",
        AddToFilter: "Add to Filter",
        AddToRow: "Add to Row",
        AddToColumn: "Add to Column",
        AddToValues: "Add to Value",
        PivotTableFieldList: "PivotTable Field List",
        ChooseFieldsToAddToReport: "Choose fields to add to the report:",
        DragFieldBetweenAreasBelow: "Drag fields between areas below:",
        ReportFilter: "Filters",
        ColumnLabel: "Columns",
        RowLabel: "Rows",
        Values: "Values",
        DeferLayoutUpdate: "Defer Layout Update",
        Update: "Update",
        OK: "OK",
        Remove: "Remove",
        Cancel: "Cancel",
        Close: "Close",
        AddCurrentSelectionToFilter: "Add current selection to filter",
        NotAllItemsShowing: "Not all child nodes are shown",
        EditorLinkPanelAlert: "The members have more than 1000 items under one or more parent. Only the first 1000 items are displayed under each parent.",
        NamedSetAlert: "Named sets cannot be added to the PivotTable report at the same time. Click OK to remove ' <Set 1> ' named set and add ' <Set 2> ' named set."
    };

    ej.PivotSchemaDesigner.Layouts = {
        Excel: "excel",
        Normal: "normal",
        OneByOne: "onebyone"
    };

})(jQuery, Syncfusion);