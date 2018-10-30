/**
* @fileOverview Plugin to create the Gantt
* @copyright Copyright Syncfusion Inc. 2001 - 2013. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {
    'use strict';
    ej.ganttFeatures = ej.ganttFeatures || {};
    ej.widget("ejGantt", "ej.Gantt", {

        // widget element will be automatically set in this
        _rootCSS: "e-gantt",

        element: null,

        validTags: ["div"],
        _requiresID: true,
        // user defined model will be automatically set in this
        model: null,
        _tags: [{
            tag: "holidays",
            attr: ["day", "background", "label"],
            content: "template"
        },
        {
            tag: "stripLines",
            attr: ["day", "label", "lineStyle", "lineColor", "lineWidth"],
            content: "template"
        },
         {
             tag: "editDialogFields",
             attr: ["field", "editType", "displayInGeneralTab"],
             content: "template"
         },
          {
              tag: "filterSettings.filteredColumns",
              attr: ["field", "value", "operator", "predicate"]
          },
         {
             tag: "addDialogFields",
             attr: ["field", "editType", "displayInGeneralTab"],
             content: "template"
         },
         {
             tag: "sortSettings.sortedColumns",
             attr: ["field","direction"]
         },
         {
             tag: "dayWorkingTime",
             attr: ["from", "to", "background"],
             singular: "dayWorkingTime"
         }
        ],
        _holidays: function (index, property, value, old) {
            this._$ganttchartHelper.ejGanttChart("refreshHolidays");
            this._trigger("refresh");
        },
        _stripLines: function (index, property, value, old) {
            this._$ganttchartHelper.ejGanttChart("refreshStripLines");
            this._trigger("refresh");
        },
        _editDialogFields: function (index, property, value, old) {
            this._trigger("refresh");
        },
        _addDialogFields: function (index, property, value, old) {
            this._trigger("refresh");
        },
        defaults: {
            viewType: "projectView",
            resourceCollectionMapping:"",
            taskCollectionMapping: "",
            groupIdMapping: "",
            groupCollection: [],
            groupNameMapping: "",
            expandStateMapping:"",
            allowSorting: false,
            allowColumnResize: false,
            allowSelection: true,
            allowMultipleExporting: false,
            allowDragAndDrop: false,
            dragTooltip: {
                showTooltip: false,
                tooltipItems: [],
                tooltipTemplate: "",
            },
            dataSource: null,
            showColumnChooser: false,
            showColumnOptions: false,
            query: null,
            splitterSettings: {
                position: "",
                index: -1
            },
            splitterPosition: "",
            taskIdMapping: "",
            parentTaskIdMapping: "",
            taskNameMapping: "",
            startDateMapping: "",
            endDateMapping: "",
            baselineStartDateMapping: "",
            baselineEndDateMapping: "",
            childMapping: "",
            durationMapping: "",
            milestoneMapping: "",
            progressMapping: "",
            predecessorMapping: "",
            resourceInfoMapping: "",
            taskSchedulingModeMapping: "",
            workMapping: "",
            notesMapping:"",
            resources: [],
            holidays: [],
            searchSettings: {
                fields: [],
                key: "",
                operator: "contains",
                ignoreCase: true
            },
            highlightWeekends: true,
            scheduleStartDate: null,
            scheduleEndDate: null,
            enableProgressBarResizing: true,
            rowHeight: 30,
            includeWeekend: true,
            taskSchedulingMode: "auto",
            validateManualTasksOnLinking: false,
            toolbarSettings: {
                showToolbar: false,
                toolbarItems: [],
                customToolbarItems: []
            },
            filterSettings: {
                filteredColumns: [],
            },
            stripLines: [],
            workingTimeScale: 'TimeScale8Hours',
            roundOffDayworkingTime: true,
            durationUnit: 'day',
            workUnit: 'hour',
            taskType: "fixedUnit",
            perMinuteWidth: null,
            perHourWidth: null,
            perDayWidth: null,
            perWeekWidth: null,
            perMonthWidth: null,
            minuteInterval: null,
            nonWorkingBackground: "",
            highlightNonWorkingTime: false,
            scheduleHeaderSettings:
            {
                weekHeaderFormat: "MMM dd , yyyy",
                dayHeaderFormat: "",
                yearHeaderFormat: "yyyy",
                monthHeaderFormat: "MMM",
                hourHeaderFormat: 'HH',
                scheduleHeaderType: 'week',
                minutesPerInterval: "auto",
                weekendBackground: '',
                timescaleStartDateMode: "auto",
                timescaleUnitSize:"100%",
                weekStartDay: 0,
                updateTimescaleView: true
            },
            taskbarBackground: "",
            progressbarBackground: "",
            connectorLineBackground: "",
            parentTaskbarBackground: "",
            parentProgressbarBackground: "",
            connectorlineWidth: 1,
            readOnly:false,
            showTaskNames: true,
            leftTaskLabelMapping: "",
            rightTaskLabelMapping: "",
            leftTaskLabelTemplate: "",
            rightTaskLabelTemplate: "",
            showGridCellTooltip: false,
            cellTooltipTemplate:null,
            showGridExpandCellTooltip: false,
            showProgressStatus: true,
            showResourceNames: true,
            enableTaskbarDragTooltip: true,
            enableTaskbarTooltip: true,
            enableWBS: false,
            enableWBSPredecessor:false,
            editSettings: {
                allowEditing: false,
                allowAdding: false,
                allowDeleting: false,
                allowIndent: false,               
                editMode: "normal",
                beginEditAction: "dblclick",
                rowPosition: "belowselectedrow",
                showDeleteConfirmDialog: false
            },
            flatRecords: [],
            parentRecords: [],
            currentViewData: [],
            updatedRecords: [],
            selectedItems:[],
            ids: [],
            allowKeyboardNavigation: true,
            cssClass: "",
            locale: "en-US",
            allowMultiSorting: false,
            sortSettings: {
                sortedColumns: []
            },
            enableAltRow: true,
            enableVirtualization: false,
            progressbarHeight: 100,
            taskbarTooltipTemplate: "",
            progressbarTooltipTemplate: "",
            taskbarTooltipTemplateId: "",
            dateFormat: "",
            resourceIdMapping: "",
            resourceNameMapping: "",
            resourceUnitMapping: "",
            progressbarTooltipTemplateId: "",
            taskbarEditingTooltipTemplateId: "",
            taskbarEditingTooltipTemplate: "",
            selectedRowIndex: -1,
            allowGanttChartEditing: true,
            sizeSettings: {
                height: "",
                width: "",
            },
            selectedItem: null,
            selectionType: "single",
            selectionMode: "row",
            selectedCellIndexes: [],
            weekendBackground: "",
            baselineColor: '#fba41c',
            treeColumnIndex: 0,
            editDialogFields: [],
            addDialogFields: [],
            columnDialogFields: [],
            renderBaseline: false,
            enableContextMenu: false,
            enableResize: true,
            isResponsive: true,
            enableCollapseAll: false,
            enablePredecessorValidation: true,
            taskbarTemplate: "",
            parentTaskbarTemplate: "",
            milestoneTemplate: "",
            durationUnitMapping: "",
            dayWorkingTime: [{ "from": "08:00 AM", "to": "12:00 PM" }, { "from": "01:00 PM", "to": "05:00 PM" }],//, { from: "4:00 PM", to: "5:00 PM" }
            exportToExcelAction: "",
            exportToPdfAction: "",
            workWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            /*Events*/
            rowSelecting: null,
            rowSelected: null,
            rowDragStart: null,
            rowDrag: null,
            rowDragStop: null,
            cellSelecting: null,
            cellSelected: null,
            queryCellInfo: null,
            queryTaskbarInfo: null,            
            beginEdit: null,
            endEdit: null,
            rowDataBound: null,
            expanding: null,
            expanded: null,
            collapsing: null,
            collapsed: null,
            actionBegin: null,
            actionComplete: null,
            taskbarEditing: null,
            taskbarEdited: null,
            load: null,
            create:null,
            splitterResized: null,
            contextMenuOpen: null,
            enableSerialNumber: false,
            taskbarClick: null,
            taskbarHeight: 20,
            criticalTask: "",
            toolbarClick: null,
            predecessorTooltipTemplate: "",
            allowUnscheduledTask: false
        },

        dataTypes: {
            viewType: "string",
            resourceCollectionMapping: "string",
            taskCollectionMapping: "string",
            groupIdMapping: "string",
            groupCollection: "array",
            groupNameMapping: "string",
            nonWorkingBackground: "string",
            highlightNonWorkingTime: "boolean",
            allowSorting: "boolean",
            allowColumnResize: "boolean",
            allowSelection: "boolean",
            searchSettings: {
                fields: "array"
            },
            dragTooltip: {
                tooltipItems: "array"
            },
            columnDialogFields: "array",
            dataSource: "data", //inline or remote data
            query: "data",
            taskIdMapping: "string",
            parentTaskIdMapping: "string",
            taskNameMapping: "string",
            startDateMapping: "string",
            endDateMapping: "string",
            baselineStartDateMapping: "string",
            baselineEndDateMapping: "string",
            childMapping: "string",
            durationMapping: "string",
            milestoneMapping: "string",
            progressMapping: "string",
            predecessorMapping: "string",
            resourceInfoMapping: "string",
            taskSchedulingModeMapping: "string",
            notesMapping: "string",
            workMapping: "string",
            resources: "array",
            holidays: "array",
            dayWorkingTime: "array",
            highlightWeekends: "boolean",
            scheduleStartDate: "data",
            scheduleEndDate: "data",
            enableProgressBarResizing: "boolean",
            rowHeight: "number",
            includeWeekend: "boolean",
            taskSchedulingMode: "string",
            validateManualTasksOnLinking: "boolean",
            toolbarSettings: {
                showToolbar: "boolean",
                toolbarItems: "array",
                customToolbarItems: "array"
            },
            stripLines: "array",
            scheduleHeaderSettings: "data",
            roundOffDayworkingTime: "boolean",
            taskbarBackground: "string",
            progressbarBackground: "string",
            connectorLineBackground: "string",
            parentTaskbarBackground: "string",
            parentProgressbarBackground: "string",
            connectorlineWidth: "number",
            readOnly:"boolean",
            showTaskNames: "boolean",
            leftTaskLabelMapping: "string",
            rightTaskLabelMapping: "string",
            leftTaskLabelTemplate: "string",
            rightTaskLabelTemplate: "string",
            showProgressStatus: "boolean",
            showResourceNames: "boolean",
            enableTaskbarDragTooltip: "boolean",
            enableTaskbarTooltip: "boolean",
            editSettings: "data",
            flatRecords: "array",
            parentRecords: "array",
            currentViewData: "array",
            ids: "array",
            updatedRecords: "array",
            allowKeyboardNavigation: "boolean",
            cssClass: "string",
            locale: "string",
            allowMultiSorting: "boolean",
            showGridExpandCellTooltip: "boolean",
            sortSettings: {
                sortedColumns: "array"
            },
            filterSettings: {
                filteredColumns: "array",
                filterType: "string",
            },
            enableAltRow: "boolean",
            enableVirtualization: "boolean",
            progressbarHeight: "number",
            taskbarTooltipTemplate: "string",
            progressbarTooltipTemplate: "string",
            taskbarTooltipTemplateId: "string",
            dateFormat: "string",
            resourceIdMapping: "string",
            resourceNameMapping: "string",
            resourceUnitMapping: "string",
            progressbarTooltipTemplateId: "string",
            taskbarEditingTooltipTemplateId: "string",
            taskbarEditingTooltipTemplate: "string",
            allowGanttChartEditing: "boolean",
            size: {
                height: "string",
                width: "string"
            },            
            weekendBackground: "string",
            baselineColor: "string",
            renderBaseline: "boolean",
            enableContextMenu: "boolean",
            showGridCellTooltip: "boolean",
            treeColumnIndex: "number",
            editDialogFields: "array",
            addDialogFields: "array",
            showColumnChooser: "boolean",
            enableResize: "boolean",
            isResponsive: "boolean",
            enableCollapseAll: "boolean",
            enablePredecessorValidation: "boolean",
            enableSerialNumber: "boolean",
            durationUnitMapping: "string",
            taskbarTemplate: "string",
            parentTaskbarTemplate: "string",
            milestoneTemplate: "string",
            taskbarHeight: "number",
            criticalTask: "string",
            workWeek:"array",
            predecessorTooltipTemplate: "string",
            allowUnscheduledTask: "boolean"
        },
        ignoreOnExport: [
            "isEdit", "toolbarClick", "query", "queryCellInfo", "selectionType", "currentViewData", "enableRTL", "rowDataBound",
              "editSettings", "localization", "cssClass", "dataSource", "allowKeyboardNavigation"
        ],
        observables: ["selectedItem", "selectedRowIndex", "selectedCellIndexes", "splitterPosition", "dataSource","splitterSettings.position"],
        selectedItem: ej.util.valueFunction("selectedItem"),
        selectedRowIndex: ej.util.valueFunction("selectedRowIndex"),
        selectedCellIndexes: ej.util.valueFunction("selectedCellIndexes"),
        splitterPosition: ej.util.valueFunction("splitterSettings.position"),
        dataSource: ej.util.valueFunction("dataSource"),
        _splitterPosition: ej.util.valueFunction("splitterPosition"),

        //Retruns column value
        getColumns: function () {
            return this._columns;
        },
        //set column value
        setColumns: function(value) {
            this._columns = value;
        },
        /*To Get columns which are editable in add/edit dialog in resource view*/
        getResourceViewEditColumns: function () {
            return this._resourceViewColumns;
        },
        // Initialize values to header Text and Gantt records for custom columns alone
        customColumnFields: function () {
            var proxy = this,
                totalColumns = proxy._columns, totalColumnsLength = totalColumns.length;

            for (var i = 0; i < totalColumnsLength; i++)
            {
                if (!proxy._columnHeaderTexts[totalColumns[i].field]) {
                    proxy._columnHeaderTexts[totalColumns[i].field] = totalColumns[i].headerText;
                }
            }
            if (this.model.viewType == "resourceView") {
                for (var i = 0; i < proxy._resourceViewColumns.length; i++) {
                    var rColumn = proxy._resourceViewColumns[i];
                    if (!proxy._columnHeaderTexts[rColumn.field]) {
                        proxy._columnHeaderTexts[rColumn.field] = rColumn.headerText;
                    }
                    if (!rColumn.editType)
                        rColumn.editType = "stringedit";
                }
            }
        },

        //Control Rendering is initiated
        _init: function () {
            var proxy = this,
                model = proxy.model, startDate, endDate,interval = model.scheduleHeaderSettings.minutesPerInterval,
                durationUnit = model.durationUnit;

            //Default data source for ASP designer
            if (model.isdesignMode) {
                model.taskIdMapping = "Id";
                model.taskNameMapping = "Name";
                model.startDateMapping = "StartDate";
                model.durationMapping = "Duration";
                model.progressMapping = "Progress";
                model.scheduleStartDate = "02/23/2014";
                model.scheduleEndDate = "03/10/2014";
                this.dataSource([{ Id: 1, Name: "Task 1", StartDate: "02/23/2014", Duration: 5, Progress: 40 },
                { Id: 2, Name: "Task 2", StartDate: "02/24/2014", Duration: 5, Progress: 40 },
                { Id: 3, Name: "Task 3", StartDate: "02/25/2014", Duration: 5, Progress: 40 }]);
                model.sizeSettings.height = "300px";
                model.sizeSettings.width = "800px";
            }

            if (!(model.scheduleStartDate || model.scheduleEndDate) && interval == "auto")
                model.scheduleHeaderSettings.minutesPerInterval = ej.Gantt.minutesPerInterval.FiveMinutes;
            if (model.workMapping != "")
                model.taskType = ej.Gantt.TaskType.FixedWork;
            proxy._initPrivateProperties();
            //Load event triggered
            proxy._trigger("load");
            proxy.element.addClass("e-gantt-core");
            //Set the workWeek when workWeek is empty
            if (model.workWeek.length == 0)
                model.workWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
            proxy._getNonWorkingDayIndex();
            this._updateProperties();
            if (this.isProjectViewData && model.viewType == ej.Gantt.ViewType.HistogramView) {
                model.viewType = ej.Gantt.ViewType.ProjectView;
                model.readOnly = true;
            }
            else if (this.isProjectViewData === false && model.viewType == ej.Gantt.ViewType.HistogramView) {
                model.viewType = ej.Gantt.ViewType.ResourceView;
                model.readOnly = true;
            }
            if (this.dataSource() !== null && model.viewType == ej.Gantt.ViewType.ProjectView) {
                this._checkDataBinding();
            }
            else if (this.dataSource() !== null && model.viewType == ej.Gantt.ViewType.ResourceView) {
                this._checkResourceDataBinding();
            }
            else {
                proxy._initialize();
            }
        },
        /*Disable unsupported features in resource view Gantt*/
        _updateProperties: function () {
            var model = this.model;
            if (model.viewType == "resourceView") {
                model.enableWBS = false;
                model.enableWBSPredecessor = false;
            }
        },
        /*set taskbar height at load time*/
        _setTaskbarHeight: function (height) {

            if (height < this.model.rowHeight)
                this.taskbarHeight = height;
            else
                this.taskbarHeight = this.model.rowHeight;
            /*MilesStone width as by rowHeight*/
            this._milesStoneWidth = (Math.floor(this.taskbarHeight / 2) * 2);
        },
        //clear selected item
        _deSelectRowItem: function () {
            var proxy = this, model = proxy.model;
            proxy._$ganttchartHelper.ejGanttChart("selectRows", -1);
            proxy._$treegridHelper.ejTreeGrid("selectRows", -1);
            this.selectedRowIndex(-1);
            model.selectedItem = null;
            model.selectedItems = [];
        },
        //data manupulation for data manager type data in resorce view
        _initResourceDataSource: function (dataSource) {

            var proxy = this, model = proxy.model;
            var query = this._columnToSelect();
            var queryPromise = this.dataSource().executeQuery(query);
            queryPromise.done(ej.proxy(function (e) {
                proxy._retrivedData = e.result;
                if (proxy._isFlatResourceData) {
                    proxy._reConstructResourceData(proxy._retrivedData);
                }
                else {
                    proxy.secondaryDatasource = proxy._retrivedData;
                }
                proxy._createResourceRecords(proxy.secondaryDatasource);
                proxy._initialize();
                var eventArgs = {
                    requestType: "create"
                };
                proxy._trigger("actionComplete", eventArgs);
            }));
        },
        //modify flat data as self reference data for resource view
        _reConstructResourceData: function (dataSource) {

            var model = this.model,
                clonedGroups,
                clonedResoures;

            if (model.groupIdMapping.length > 0 && this._groupCollection && this._groupCollection.length > 0 && model.resources.length > 0) {
                clonedGroups = $.extend(true, [], this._groupCollection);
                for (var gCount = 0; gCount < clonedGroups.length; gCount++)
                    this._groupIds.push(clonedGroups[gCount][model.groupIdMapping]);
                this.secondaryDatasource = clonedGroups;
            }

            if (model.resourceIdMapping.length > 0 && model.resources && model.resources.length > 0) {
                clonedResoures = $.extend(true, [], model.resources);
                var resourceColMapping, grpId = -1;
                !model.resourceCollectionMapping && (model.resourceCollectionMapping = "eResourceCollection");
                resourceColMapping = model.resourceCollectionMapping;
                for (var rCount = 0; rCount < clonedResoures.length; rCount++) {
                    this._resourceIds.push(clonedResoures[rCount][model.resourceIdMapping]);
                    if (model.groupIdMapping && this._groupIds.length > 0) {
                        grpId = this._groupIds.indexOf(clonedResoures[rCount][model.groupIdMapping]);
                        if (grpId != -1) {
                            if (clonedGroups[grpId][resourceColMapping])
                                clonedGroups[grpId][resourceColMapping].push(clonedResoures[rCount]);
                            else {
                                clonedGroups[grpId][resourceColMapping] = [];
                                clonedGroups[grpId][resourceColMapping].push(clonedResoures[rCount]);
                            }
                        }
                        else {
                            this.secondaryDatasource.push(clonedResoures[rCount]); //Ungroupped resource
                        }
                    }
                }
                if (this.secondaryDatasource.length == 0) {
                    this.secondaryDatasource = clonedResoures;
                }
            }

            for (var taskCount = 0; taskCount < dataSource.length; taskCount++) {
                var task = dataSource[taskCount],
                    resource = dataSource[taskCount][model.resourceInfoMapping],
                    taskColMapping;
                !model.taskCollectionMapping && (model.taskCollectionMapping = "eTaskCollections");
                taskColMapping = model.taskCollectionMapping;
                if (resource && resource.length > 0) {
                    for (var count = 0; count < resource.length; count++) {
                        var currentResource = resource[count],
                            resourceId, resourceIndex = -1;
                        if (typeof currentResource == "object")
                            resourceId = currentResource[model.resourceIdMapping];
                        else
                            resourceId = currentResource;
                        if (model.resourceIdMapping.length > 0 && model.resources && model.resources.length > 0) {
                            resourceIndex = this._resourceIds.indexOf(resourceId);
                            if (resourceIndex != -1 && clonedResoures.length > 0) {
                                if (clonedResoures[resourceIndex][taskColMapping])
                                    clonedResoures[resourceIndex][taskColMapping].push(task);
                                else {
                                    clonedResoures[resourceIndex][taskColMapping] = [];
                                    clonedResoures[resourceIndex][taskColMapping].push(task);
                                }
                            }
                            else {
                                //Code for unassigned tasks
                                this.secondaryDatasource.push(dataSource[taskCount]);
                            }
                        }
                    }
                }
                else {
                    this.secondaryDatasource.push(dataSource[taskCount]);
                }
            }
            return this.secondaryDatasource;
        },
        /*populate records for Histogram view Gantt*/
        _checkHistoGramDataBinding: function () {
            var proxy = this, model = proxy.model,
                flatRecords = model.flatRecords,
                recordCollection = $.extend(true, [], model.resources);
            model.ids = [];
            recordCollection.forEach(function (item, index) {
                item.eResourceChildTasks = [];
                item.level = 0;
                item.taskId = item[model.resourceIdMapping];
                item.index = index;
                item.isAltRow = index % 2 == 0 ? false : true;
                item.eResourceName = model.resources[index][model.resourceNameMapping];
                item.expanded = true;
                item.hasChildRecords = false;
                item.item = model.resources[index];
                model.ids.push(item.taskId.toString());
            });
            proxy._histoGramChildTasks = [];
            proxy._histoGramChildTaskIds = [];
            for (var j = 0; j < flatRecords.length; j++) {
                var flatRec = flatRecords[j];
                if (!this.isProjectViewData) {
                    if (ej.isNullOrUndefined(flatRec.item[model.resourceIdMapping]) || flatRec.item[model.resourceIdMapping].length == 0) {
                        continue;
                    }
                    var rootRecord = recordCollection[model.ids.indexOf(flatRec.item[model.resourceIdMapping].toString())];
                    rootRecord.eResourceChildTasks = [];
                    for (var rvCount = 0 ; rvCount < flatRec.eResourceChildTasks.length; rvCount++) {
                        var currentRec = flatRec.eResourceChildTasks[rvCount];
                        if (proxy._histoGramChildTasks.indexOf(currentRec) == -1 && proxy._histoGramChildTaskIds.indexOf(currentRec.taskId.toString()) == -1) {
                            proxy._histoGramChildTasks.push(currentRec);
                            proxy._histoGramChildTaskIds.push(currentRec.taskId.toString());
                        } else {
                            var exitRecIndex = proxy._histoGramChildTaskIds.indexOf(currentRec.taskId.toString()),
                                currentRec = proxy._histoGramChildTasks[exitRecIndex];
                        }
                        rootRecord.eResourceChildTasks.push(currentRec);
                    }
                }
                else {
                    var resourceInfo = flatRec.resourceInfo;
                    if (proxy._histoGramChildTasks.indexOf(flatRec) == -1 && proxy._histoGramChildTaskIds.indexOf(flatRec.taskId.toString()) == -1) {
                        proxy._histoGramChildTasks.push(flatRec);
                        proxy._histoGramChildTaskIds.push(flatRec.taskId.toString());
                    }
                    if (!resourceInfo || (resourceInfo && resourceInfo.length == 0))
                        continue;
                    for (var rCount = 0; rCount < resourceInfo.length; rCount++) {
                        var curResource = resourceInfo[rCount],
                            rootRecord = recordCollection[model.ids.indexOf(curResource[model.resourceIdMapping].toString())];
                        if (curResource[model.resourceIdMapping] == rootRecord.item[model.resourceIdMapping]) {
                            rootRecord.eResourceChildTasks.push(flatRec);
                        }
                    }
                }
            }
            model.flatRecords = recordCollection;
            model.allowSelection = false;
            model.updatedRecords = model.flatRecords.slice();
            model.currentViewData = model.flatRecords.slice();
            model.parentRecords = model.flatRecords.slice();
            this._updateHistoData();
        },
        _updateHistoData: function () {
            var model = this.model;
            var recValues = model.flatRecords,
                length = recValues.length,
                ranges = [];
            for (var rcount = 0; rcount < length; rcount++) {
                var cRec = recValues[rcount];
                this._updateHistoWorkValues(cRec);
            }
        },
        _validateRanges: function (target, source) {
            var existRange = this._getItemByFieldValue(target, "rangeId", source.rangeId);
            if (existRange) {
                this._pushUniqueValue(existRange.tasks, source.tasks);
            } else {
                target.push(source);
            }
        },
        _updateHistoWorkValues: function (rTask) {
            var tasks = this._setSortedChildTasks(rTask),
                length = tasks.length, firstTask, secondTask,
                ranges = [], rangeObj = {}, ranges = [], minStartDate, maxEndDate, nextDate;
            if (tasks && tasks.length == 0) {
                rTask.workTimelineRanges = ranges;
                return;
            }
            minStartDate = tasks[0].startDate, maxEndDate = ej.max(tasks, "endDate").endDate;
            while (minStartDate.getTime() < maxEndDate.getTime()) {
                nextDate = this._getMinDateForRange(tasks, minStartDate);
                rangeObj = {};
                rangeObj.startDate = new Date(minStartDate);
                rangeObj.endDate = new Date(nextDate);
                rangeObj.tasks = this._getTaskByRange(minStartDate, nextDate, tasks);
                minStartDate = new Date(nextDate);
                if (rangeObj.tasks.length > 0)
                    ranges.push(rangeObj);
            }
            ranges = this._splitRangeCollection(ranges, "startDate", "endDate", true);
            this._calculateWorkWithRanges(ranges, rTask);
            rTask.workTimelineRanges = ranges;
        },
        _calculateWorkWithRanges: function (ranges, resourceTask) {
            var model = this.model,
                dayHeight = model.rowHeight - 7; // calenderHeigth(rowHeight-6) - top border
            for (var count = 0; count < ranges.length; count++) {
                var curRange = ranges[count],
                    sDate = curRange.startDate,
                    eDate = curRange.endDate,
                    valStartDate = this._checkStartDate(sDate, resourceTask, false),
                    valEndDate = this._checkEndDate(eDate, resourceTask),
                    duration = valStartDate.getTime() < valEndDate.getTime() ? this._getDuration(valStartDate, valEndDate, "day", true) : 0,
                    left = this._getTaskLeft(valStartDate, false),
                    tasks = curRange.tasks,
                    width = this._getTaskWidth(valStartDate, valEndDate),
                    hoursPerDay = this._secondsPerDay / 3600,
                    totalWork = 0;
                for (var tCount = 0; tCount < tasks.length; tCount++) {
                    var curTask = tasks[tCount],
                        resources = curTask.resourceInfo,
                        curResource = resources.filter(function (val) {
                            return val[model.resourceIdMapping] == resourceTask[model.resourceIdMapping];
                        }),
                        resourceUnit = curResource[0][model.resourceUnitMapping],
                        work = hoursPerDay * (resourceUnit / 100);
                    totalWork += work;
                }
                curRange.left = left;
                curRange.width = width;
                curRange.duration = duration;
                curRange.workPerDay = totalWork;
                curRange.height = dayHeight * (totalWork / hoursPerDay);               
                curRange.totalWork = duration * totalWork;
                if ((curRange.totalWork) % 1 != 0) {
                    curRange.totalWork = parseFloat(curRange.totalWork.toFixed(2));
                }
                curRange.isOverAllocated = totalWork > hoursPerDay ? true : false;
            }
        },
        /*Method to refresh resource data with new updated tasks*/
        updateHistogramTask: function (task, action) {
            var model = this.model, prevResource,
                isGanttRecord, taskId, rIdIndex, existRec, newRec;
            switch (action) {
                case "update":
                    isGanttRecord = task instanceof ej.Gantt.GanttRecord;
                    taskId = isGanttRecord ? task.taskId : task[model.taskIdMapping];
                    if (ej.isNullOrUndefined(taskId))
                        break;
                    rIdIndex = this._histoGramChildTaskIds.indexOf(taskId.toString());
                    existRec = this._histoGramChildTasks[rIdIndex];
                    newRec = isGanttRecord ? task : this._createGanttRecord(task, existRec.level, existRec.parentItem, undefined);
                    var updateNeeded = ["startDate", "endDate", "duration", "resourceInfo", "item" , "taskName", "resourceNames"];
                    var customColumn = this._getGanttColumnDetails();
                    for (var colIndex = 0; colIndex < customColumn.customColDetails.length; colIndex++) {
                        updateNeeded.push(customColumn.customColDetails[colIndex].field);
                    }
                    prevResource = existRec.resourceInfo;
                    for (var index = 0; index < updateNeeded.length; index++) {
                        if (updateNeeded[index] == "item") {
                            var prevData = $.extend({}, newRec.item);
                            $.each(prevData, function (key, value) {
                                existRec.item[key] = value;
                            });
                        } else if (updateNeeded[index] == "resourceInfo" && newRec[updateNeeded[index]]) {
                            existRec[updateNeeded[index]] = $.extend(true, [], newRec[updateNeeded[index]]);
                        } else {
                            if (!ej.isNullOrUndefined(newRec[updateNeeded[index]]))
                                existRec[updateNeeded[index]] = newRec[updateNeeded[index]];
                        }
                    }
                    this._validateResourceInfoValues(existRec, prevResource);
                    break;
                case "add":
                    isGanttRecord = task instanceof ej.Gantt.GanttRecord;
                    taskId = isGanttRecord ? task.taskId : task.item[model.taskIdMapping];
                    if (ej.isNullOrUndefined(taskId))
                        break;
                    if (this._histoGramChildTaskIds.indexOf(taskId.toString()) != -1)
                        break;
                    var extendRecord = new ej.Gantt.GanttRecord();
                    newRec = isGanttRecord ? $.extend(extendRecord, task) : this._createGanttRecord(task, 0, null, undefined);
                    if (newRec.resourceInfo)
                        newRec.resourceInfo = $.extend(true, [], task.resourceInfo);
                    this._histoGramChildTaskIds.push(taskId.toString());
                    this._histoGramChildTasks.push(newRec);
                    this._validateResourceInfoValues(newRec);
                    break;
                case "delete":
                    isGanttRecord = task instanceof ej.Gantt.GanttRecord;
                    taskId = isGanttRecord ? task.taskId : task[model.taskIdMapping];
                    if (ej.isNullOrUndefined(taskId))
                        break;
                    rIdIndex = this._histoGramChildTaskIds.indexOf(taskId.toString());
                    existRec = this._histoGramChildTasks[rIdIndex];
                    prevResource = $.extend([], existRec.resourceInfo);
                    delete existRec.resourceInfo;
                    this._histoGramChildTaskIds.splice(rIdIndex, 1);
                    this._histoGramChildTasks.splice(rIdIndex, 1);
                    this._validateResourceInfoValues(existRec, prevResource);
                    if (task.hasChildRecords == true)
                    {
                        var childRec = task.childRecords;
                        for (var i = 0 ; i < childRec.length; i++) {
                            this.updateHistogramTask(childRec[i], action);
                        }
                    }
                    break;
            }
        },
        _getUpdatingResourceDetails: function (prevResource, currentResource) {
            var added = currentResource ? $.extend([], currentResource) : [],
                removed = [], isUpdated = false, model = this.model,
                returnObj = {};
            for (var pCount = 0; pCount < prevResource.length; pCount++) {
                var pValue = prevResource[pCount],
                    pId = pValue[model.resourceIdMapping],
                    pUnit = pValue[model.resourceUnitMapping],
                    cValue = currentResource.filter(function (val) {
                        return val[model.resourceIdMapping] == pId;
                    });
                if (cValue.length == 0) {
                    removed.push(pValue);
                } else {
                    added.splice(added.indexOf(cValue[0]), 1);
                }
            }
            if (added.length > 0 || removed.length > 0) {
                returnObj.added = added;
                returnObj.removed = removed;
                returnObj.isUpdated = true;
                return returnObj;
            } else {
                return false;
            }
        },

        _validateResourceInfoValues: function (task, prevResource) {
            var model = this.model,
                records = model.flatRecords,
                currentResources = task.resourceInfo ? task.resourceInfo : [],
                modifiedRecords = [],
                isUpdated = true,
                itrResource, itrRRecord,
                prevResource = prevResource ? prevResource : [],
                updatableResource = this._getUpdatingResourceDetails(prevResource, currentResources);
            if (updatableResource) {
                var added = updatableResource.added,
                    removed = updatableResource.removed;
                if (added.length > 0) {
                    for (var count = 0; count < added.length; count++) {
                        itrResource = added[count],
                        itrRRecord = this._getRecordByTaskId(itrResource[model.resourceIdMapping].toString());
                        itrRRecord.eResourceChildTasks.push(task);
                        if (modifiedRecords.indexOf(itrRRecord) == -1)
                            modifiedRecords.push(itrRRecord);
                    }
                }
                if (removed.length > 0) {
                    for (var count = 0; count < removed.length; count++) {
                        itrResource = removed[count],
                        itrRRecord = this._getRecordByTaskId(itrResource[model.resourceIdMapping].toString());
                        itrRRecord.eResourceChildTasks.splice(itrRRecord.eResourceChildTasks.indexOf(task), 1);
                        if (modifiedRecords.indexOf(itrRRecord) == -1)
                            modifiedRecords.push(itrRRecord);
                    }
                }
            }
            for (var count = 0; count < currentResources.length; count++) {
                itrResource = currentResources[count],
                itrRRecord = this._getRecordByTaskId(itrResource[model.resourceIdMapping].toString());
                if (modifiedRecords.indexOf(itrRRecord) == -1)
                    modifiedRecords.push(itrRRecord);
            }
            this._updateRefreshHistogramTask(modifiedRecords);
        },
        _updateRefreshHistogramTask: function (tasks) {
            for (var count = 0; count < tasks.length; count++) {
                this._updateHistoWorkValues(tasks[count]);
                this.refreshGanttRecord(tasks[count]);
            }
        },
        _getTaskByRange: function (start, end, tasks) {
            var finalTasks = [];
            for (var count = 0; count < tasks.length; count++) {
                var curTask = tasks[count],
                    sDate = curTask.startDate,
                    eDate = curTask.endDate;
                if ((sDate.getTime() == start.getTime() && end.getTime() <= eDate.getTime())
                   || (sDate.getTime() < start.getTime() && end.getTime() <= eDate.getTime())) {
                    finalTasks.push(curTask);
                }
            }
            return finalTasks;
        },
        _getMinDateForRange: function (tasks, compareDate) {
            var minDate;
            for (var count = 0; count < tasks.length; count++) {
                var val = tasks[count],
                    sDate = val.startDate,
                    eDate = val.endDate;
                if (compareDate.getTime() < sDate.getTime() || compareDate.getTime() < eDate.getTime()) {
                    if (!minDate) {
                        if (compareDate.getTime() < sDate.getTime()) {
                            minDate = new Date(sDate);
                        } else {
                            minDate = new Date(eDate);
                        }
                    }
                    if (compareDate.getTime() < sDate.getTime() && minDate.getTime() > sDate.getTime()) {
                        minDate = new Date(sDate);
                    }
                    if (compareDate.getTime() < eDate.getTime() && minDate.getTime() > eDate.getTime()) {
                        minDate = new Date(eDate);
                    }
                }
            }
            return minDate;
        },
        _pushUniqueValue: function (target, source) {
            for (var count = 0; count < source.length; count++) {
                var curItem = source[count];
                if (target.indexOf(curItem) == -1)
                    target.push(curItem);
            }
        },
        _getItemByFieldValue: function (collection, field, value) {
            var query = ej.Query().where(field, "equal", value),
                result = ej.DataManager(collection).executeLocal(query);
            if (result.length > 0) {
                return result[0];
            } else {
                return null;
            }
        },
        /*populate records for Resource view Gantt*/
        _checkResourceDataBinding: function () {
            var proxy = this, model = proxy.model,
                clonedDataSource = [],
                clonedGroups = [],
                dataSource,
                clonedResoures = [],
                secondaryDatasource;
            if (this.dataSource() == null) {
                this.dataSource([]);
            }
            if (this.dataSource() instanceof ej.DataManager) {
                this._initResourceDataSource();
            }
            else if (this.dataSource().length > 0 || (model.resources && model.resources.length > 0)) {

                //Self-reference for resource view Gantt
                if (this._isFlatResourceData) {
                    secondaryDatasource = this._reConstructResourceData(this.dataSource());
                    this._createResourceRecords(secondaryDatasource);
                } else {
                    this._createResourceRecords(this.dataSource());
                }
                this._initialize();
            } else {
                this._initialize();
            }
            if (proxy.model.allowSelection && proxy.model.selectionType == "multiple" && proxy.model.selectionMode == "row") {
                proxy._renderMultiSelectionPopup();
            }
        },
        //check day is fall between from and to date range
        _isInStartDateRange: function (day, from, to) {
            var isInRange = false;
            if (day.getTime() >= from.getTime() && day.getTime() < to.getTime()) {
                isInRange = true;
            }
            return isInRange;
        },

        //check day is fall between from and to date range
        _isInEndDateRange: function (day, from, to) {
            var isInRange = false;
            if (day.getTime() > from.getTime() && day.getTime() <= to.getTime()) {
                isInRange = true;
            }
            return isInRange;
        },


        /*Sort resource child records based on start date*/
        _setSortedChildTasks: function (resourceTask) {
            var sortedRecords = [],
                query = ej.Query().sortBy("startDate", ej.sortOrder.Ascending);
            sortedRecords = ej.DataManager(resourceTask.eResourceChildTasks).executeLocal(query);
            resourceTask.eResourceChildTasks = sortedRecords.slice();
            return resourceTask.eResourceChildTasks;
        },
        /*Method to merge given array of date range values*/
        _mergeRangeCollections: function (ranges, isSplit) {
            var sortedRanges,
                query = ej.Query().sortBy("from", ej.sortOrder.Ascending),
                finalRange = [],
                currentTopRange = {},
                cCompareRange = {},
                cStartDate, cEndDate, tStartDate, tEndDate;

            sortedRanges = ej.DataManager(ranges).executeLocal(query);
            for (var i = 0; i < sortedRanges.length; i++) {
                if (finalRange.length == 0 && i == 0) {
                    finalRange.push(sortedRanges[i]);
                    continue;
                }
                currentTopRange = finalRange[finalRange.length - 1];
                cStartDate = currentTopRange.from;
                cEndDate = currentTopRange.to;
                cCompareRange = sortedRanges[i];
                tStartDate = cCompareRange.from;
                tEndDate = cCompareRange.to;

                if ((cStartDate.getTime() == tStartDate.getTime() && cEndDate.getTime() >= tEndDate.getTime())
                    || (cStartDate.getTime() < tStartDate.getTime() && cEndDate.getTime() >= tEndDate.getTime())
                    )
                    continue;
                else if ((cStartDate.getTime() <= tStartDate.getTime() && cEndDate.getTime() >= tStartDate.getTime() && cEndDate.getTime() < tEndDate.getTime())
                    || (cEndDate.getTime() < tStartDate.getTime() && this._checkStartDate(cEndDate).getTime() == tStartDate.getTime()))
                {
                    currentTopRange.to = tEndDate;
                }
                else if (cEndDate.getTime() < tStartDate.getTime() && this._checkStartDate(cEndDate).getTime() != tStartDate.getTime()) {
                    finalRange.push(sortedRanges[i]);
                }
            }
            if (isSplit)
                finalRange = this._splitRangeCollection(finalRange);
            return finalRange;
        },

        /*Split range colection with weekend and holiday*/
        _getRangeWithWeekSplit: function (ranges, fromField, toField, checkWeekend) {
            var splitRange = [];
            for (var i = 0; i < ranges.length; i++) {
                splitRange.push.apply(splitRange, this._splitRangeForWeekMode(ranges[i], fromField, toField, checkWeekend));
            }
            return splitRange;
        },

        /*Method to split ranges with weekend and holidays as per schedule modes*/
        _splitRangeCollection: function (ranges, fromField, toField, isForHistogram) {
            var splitRange = [];
            var scheduleMode = this.model.scheduleHeaderSettings.scheduleHeaderType;
            switch (scheduleMode) {
                case ej.Gantt.ScheduleHeaderType.Month:
                    if (isForHistogram) {
                        splitRange = this._getRangeWithWeekSplit(ranges, fromField, toField);
                    } else {
                        return ranges;
                    }
                case ej.Gantt.ScheduleHeaderType.Year:
                    if (isForHistogram) {
                        splitRange = this._getRangeWithWeekSplit(ranges, fromField, toField, true);
                    } else {
                        return ranges;
                    }
                    break;
                case ej.Gantt.ScheduleHeaderType.Week: {// split ranges with weekend and holiday level
                    splitRange = this._getRangeWithWeekSplit(ranges, fromField, toField);
                    break;
                }
                case ej.Gantt.ScheduleHeaderType.Day: { // split ranges with start and end working time range value no need consider internal time ranges

                    if (this._workingTimeRanges[0].from == 0 && this._workingTimeRanges[0].to == 86400) {
                        splitRange = this._getRangeWithWeekSplit(ranges, fromField, toField);
                    } else {
                        for (var i = 0; i < ranges.length; i++) {
                            splitRange.push.apply(splitRange, this._splitRangeForDayMode(ranges[i], fromField, toField));
                        }
                    }
                    break;
                }
                case ej.Gantt.ScheduleHeaderType.Hour: { //Consider internal time range intervals to split the range
                    if (this._workingTimeRanges[0].from == 0 && this._workingTimeRanges[0].to == 86400) {
                        splitRange = this._getRangeWithWeekSplit(ranges, fromField, toField);
                    } else {
                        for (var i = 0; i < ranges.length; i++) {
                            splitRange.push.apply(splitRange, this._splitRangeForHourMode(ranges[i], fromField, toField));
                        }
                    }
                    break;
                }
            }
         
            return splitRange;
        },

        /*Check given date is on holidays*/
        _isOnHolidayOrWeekEnd: function (date, checkWeekEnd) {
            checkWeekEnd = !ej.isNullOrUndefined(checkWeekEnd) ? checkWeekEnd : this.model.includeWeekend;
            if (!checkWeekEnd && this._nonWorkingDayIndex.indexOf(date.getDay()) != -1)
                return true;

            var holidays = this.model.holidays;
            for (var count = 0; count < holidays.length; count++) {
                var holidayFrom = this._getDateFromFormat(holidays[count].day),
                    holidayTo = new Date(holidayFrom);
                holidayFrom.setHours(0, 0, 0, 0);
                holidayTo.setHours(23, 59, 59, 59);
                if (date.getTime() >= holidayFrom.getTime() && date.getTime() < holidayTo.getTime()) {
                    return true;
                }
            }
        },
        //split range for week day schedule mode
        _splitRangeForWeekMode: function (range, fromField, toField, checkWeekend) {
            var from = fromField ? fromField : "from",
                to = toField ? toField : "to",
                start = new Date(range[from]),
                tempStart = new Date(range[from]),
                end = new Date(range[to]),
                day,
                isInSplit = false,
                ranges = [],
                rangeObj = {};
            tempStart.setDate(tempStart.getDate() + 1);

            if (tempStart.getTime() < end.getTime()) {
                do {
                    if (this._isOnHolidayOrWeekEnd(tempStart, checkWeekend)) {
                        var tEnd = new Date(tempStart);
                        tEnd.setDate(tempStart.getDate() - 1);
                        this._setTime(this._defaultEndTime, tEnd);
                        rangeObj = {};
                        rangeObj[from] = start;
                        rangeObj.isSplit = true;
                        rangeObj[to] = tEnd;
                        if (range.tasks)
                            rangeObj["tasks"] = $.extend([], range.tasks);
                        if (start.getTime() != tEnd.getTime())
                            ranges.push(rangeObj);
                        start = this._checkStartDate(tEnd);
                        tempStart = new Date(start);
                        isInSplit = true;
                    } else {
                        tempStart.setDate(tempStart.getDate() + 1);
                    }
                } while (tempStart.getTime() < end.getTime());

                if (isInSplit) {
                    if (start.getTime() != end.getTime()) {
                        rangeObj = {};
                        if (range.tasks)
                            rangeObj["tasks"] = $.extend([], range.tasks);
                        rangeObj[from] = start;
                        rangeObj[to] = end;
                        rangeObj.isSplit = true;
                        ranges.push(rangeObj);
                    }
                }
                else
                    ranges.push(range);
            } else {
                ranges.push(range);
            }
          
            return ranges;
        },

        /*In Day mode we will split overlapping ranges with limit of day an working time ranges*/
        _splitRangeForDayMode: function (range, fromField, toField) {
            var from = fromField ? fromField : "from",
                to = toField ? toField : "to",
                start = new Date(range[from]),
               tempStart = new Date(range[from]),
               end = new Date(range[to]),
               day,
               isInSplit = false,
               ranges = [],
               rangeObject = {};
            if (tempStart.getTime() < end.getTime()) {
                do {
                    var nStart = new Date(tempStart),
                        nEndDate = new Date(tempStart);
                    this._setTime(this._defaultEndTime, nEndDate);
                    if (nEndDate.getTime() < end.getTime()) {
                        rangeObject = {};
                        if (range.tasks)
                            rangeObject["tasks"] = $.extend([], range.tasks);
                        rangeObject[from] = nStart;
                        rangeObject[to] = nEndDate;
                        rangeObject.isSplit = true;
                        ranges.push(rangeObject);
                    }
                    else {
                        rangeObject = {};
                        if (range.tasks)
                            rangeObject["tasks"] = $.extend([], range.tasks);
                        rangeObject[from] = nStart;
                        rangeObject[to] = end;
                        rangeObject.isSplit = true;
                        ranges.push(rangeObject);
                    }
                    tempStart = this._checkStartDate(nEndDate);
                } while (tempStart.getTime() < end.getTime());
            } else {
                ranges.push(range);
            }
            return ranges;
        },

        /*In Day mode we will split overlapping ranges with limit of day an working time ranges*/
        _splitRangeForHourMode: function (range, fromField, toField) {
            var from = fromField ? fromField : "from",
                to = toField ? toField : "to",
                start = new Date(range[from]),
               tempStart = new Date(range[from]),
               end = new Date(range[to]),
               day,
               isInSplit = false,
               ranges = [],
               rangeObject;
            if (tempStart.getTime() < end.getTime()) {
                do {
                    var nStart = new Date(tempStart),
                        nEndDate = new Date(tempStart),
                        sHour, startRangeIndex = -1,
                        nextAvailDuration = 0;

                    sHour = this._getSecondsInDecimal(tempStart);
                    for (var i = 0; i < this._workingTimeRanges.length; i++) {
                        var val = this._workingTimeRanges[i];
                        if (sHour >= val.from && sHour <= val.to) {
                            startRangeIndex = i;
                            break;
                        }
                    }
                    if (startRangeIndex != -1) {
                        nextAvailDuration = Math.round(this._workingTimeRanges[startRangeIndex].to - sHour);
                        nEndDate.setSeconds(nEndDate.getSeconds() + nextAvailDuration);
                    }
                    if (nEndDate.getTime() < end.getTime()) {
                        rangeObject = {};
                        if (range.tasks)
                            rangeObject["tasks"] = $.extend([], range.tasks);
                        rangeObject[from] = nStart;
                        rangeObject[to] = nEndDate;
                        rangeObject.isSplit = true;
                        ranges.push(rangeObject);
                    }
                    else {
                        rangeObject = {};
                        if (range.tasks)
                            rangeObject["tasks"] = $.extend([], range.tasks);
                        rangeObject[from] = nStart;
                        rangeObject[to] = end;
                        rangeObject.isSplit = true;
                        ranges.push(rangeObject);
                    }
                    tempStart = this._checkStartDate(nEndDate);
                } while (tempStart.getTime() < end.getTime());
            } else {
                ranges.push(range);
            }
            return ranges;
        },

        /*Method to calculate the left and width value of oarlapping ranges*/
        _calculateRangeLeftWidth: function (ranges) {
            for (var count = 0; count < ranges.length; count++) {
                ranges[count].left = this._getTaskLeft(ranges[count].from);
                ranges[count].width = this._getTaskWidth(ranges[count].from, ranges[count].to);
            }
        },

        /*Update overlapping index of Gantt records in resource tasks*/
        _updateOverlappingIndex: function (tasks) {
            var overlapRangesForIndex = [],
                range = {}, 
                maxOverlapIndex = 1;
            for (var i = 0; i < tasks.length; i++) {
                var cTasks = tasks[i],
                    cStartDate = new Date(cTasks.startDate),
                    cEndDate = new Date(cTasks.endDate); //Task 2
                cTasks.eOverlapIndex = 1;
                if(overlapRangesForIndex.length==0)
                {
                    overlapRangesForIndex.push({ from: cStartDate, to: cEndDate });
                    continue;
                } else {
                    var rangeLength =  overlapRangesForIndex.length;
                    for (var j = 0; j < rangeLength; j++) {
                        var rStartDate = overlapRangesForIndex[j].from, //Task 1
                            rEndDate = overlapRangesForIndex[j].to;
                        if (this._isInStartDateRange(cStartDate, rStartDate, rEndDate) || this._isInEndDateRange(cEndDate, rStartDate, rEndDate)) {
                            cTasks.eOverlapIndex = j + 2;
                            if (maxOverlapIndex < cTasks.eOverlapIndex) {
                                maxOverlapIndex = cTasks.eOverlapIndex;
                                overlapRangesForIndex.push({ from: cStartDate, to: cEndDate });
                            }
                        } else {
                            cTasks.eOverlapIndex = j + 1;
                            var tempRanges = [], 
                                mergedRange = [];
                            tempRanges.push(overlapRangesForIndex[j]);
                            tempRanges.push({ from: cStartDate, to: cEndDate });
                            mergedRange = this._mergeRangeCollections(tempRanges);
                            if (mergedRange.length > 1)
                                overlapRangesForIndex[j] = mergedRange[1];
                            else if (mergedRange.length == 1)
                                overlapRangesForIndex[j] = mergedRange[0];

                            if (maxOverlapIndex < cTasks.eOverlapIndex) {
                                maxOverlapIndex = cTasks.eOverlapIndex;
                            }
                            break;
                        }
                    }
                }
            }
        },
        /*Method to find overlapped index and overlap with which task task*/
        _updateOverlappingValues: function (resourceTask, isCheckOverlapChange) {
            var tasks = resourceTask.eResourceChildTasks,
                currentTask, maxOverlapIndex = 1,
                ranges = [], 
                prevOverlapIndex = resourceTask.eOverlapIndex;
            if (tasks.length <= 1) {
                if (tasks.length == 1) {
                    tasks[0].eOverlapIndex = 1;
                    tasks[0].eOverlapped = false;
                }
                resourceTask.eRangeValues = [];
                resourceTask.eOverlapIndex = 1;
                resourceTask.eOverlapped = false;
                return;
            }
            tasks = this._setSortedChildTasks(resourceTask);
            this._updateOverlappingIndex(tasks);
            for (var count = 1; count < tasks.length; count++) {
                currentTask = tasks[count];
                var cStartDate = new Date(currentTask.startDate),
                    cEndDate = new Date(currentTask.endDate),//task 2
                    isOverlapped = false,
                    range = [],
                    rangeObj = {};
                for (var index = 0; index < count; index++) {
                    var tStartDate = tasks[index].startDate,
                        tEndDate = tasks[index].endDate;// task 1
                    rangeObj = {};
                    if (this._isInStartDateRange(cStartDate, tStartDate, tEndDate) || this._isInEndDateRange(cEndDate, tStartDate, tEndDate)) {
                        if ((tStartDate.getTime() > cStartDate.getTime() && tStartDate.getTime() < cEndDate.getTime()
                            && tEndDate.getTime() > cStartDate.getTime() && tEndDate.getTime() > cEndDate.getTime())
                            || (cStartDate.getTime() == tStartDate.getTime() && cEndDate.getTime() <= tEndDate.getTime()))// cond 1 and 3and 8
                        {
                            rangeObj.from = tStartDate;
                            rangeObj.to = cEndDate;
                        }
                        else if (cStartDate.getTime() == tStartDate.getTime() && cEndDate.getTime() > tEndDate.getTime()) { //condi 4
                            rangeObj.from = tStartDate;
                            rangeObj.to = tEndDate;
                        }
                        else if (cStartDate.getTime() > tStartDate.getTime() && cEndDate.getTime() >= tEndDate.getTime()) {// cond 5 and 6
                            rangeObj.from = cStartDate;
                            rangeObj.to = tEndDate;
                        }
                        else if (cStartDate.getTime() > tStartDate.getTime() && cEndDate.getTime() < tEndDate.getTime()) {// cond 7
                            rangeObj.from = cStartDate;
                            rangeObj.to = cEndDate;
                        }
                        rangeObj.task1 = tasks[index];
                        rangeObj.task2 = currentTask;
                        range.push(rangeObj);
                        isOverlapped = true;
                       // currentTask.eOverlapIndex = tasks[index].eOverlapIndex + 1;
                        currentTask.eOverlapWithIndex = index;
                        currentTask.eOverlapped = tasks[index].eOverlapped = true;
                        if (maxOverlapIndex < currentTask.eOverlapIndex) {
                            maxOverlapIndex = currentTask.eOverlapIndex;
                        }
                    }
                }
                ranges.push.apply(ranges, this._mergeRangeCollections(range));
            }
            resourceTask.eRangeValues = this._mergeRangeCollections(ranges, true);
            this._calculateRangeLeftWidth(resourceTask.eRangeValues);
            resourceTask.eOverlapIndex = maxOverlapIndex;
            resourceTask.eOverlapped = maxOverlapIndex > 1 ? true : false;
            if (isCheckOverlapChange && !this._isOverlapIndexChanged && (maxOverlapIndex != prevOverlapIndex))
                this._isOverlapIndexChanged = true;
        },
        /*Remove resource from tasks and updated resource related fields*/
        _removeResources: function (args) {
            var allChildTasks = [],
                data = args.data,
                unAssignedTasks = [],
                unAssignedIds = [],
                unAssignedTasksItems = [];
            this._resourceUpdatedTasksIds = [];
            /*Remove empty group from Gantt*/
            if (data.eResourceTaskType == "resourceTask" && data.parentItem && data.parentItem.childRecords.length == 1) {
                data = data.parentItem;
            }

            if (data.eResourceTaskType == "groupTask") {
                allChildTasks = data.childRecords;
                this._removeFromResourceCollection(data, "group");
            } else if (data.eResourceTaskType == "resourceTask") {
                allChildTasks.push(data);
            }
            else if (data.eResourceTaskType == "unassignedTask") {
                if (this._isFlatResourceData)
                    this._removeDataFromDataSource(data.item);
                /*Remove task from collection*/
                var index = this._resourceUniqTaskIds.indexOf(data.taskId.toString());
                if (index != -1) {
                    this._resourceUniqTaskIds.splice(index, 1);
                    this._resourceUniqTasks.splice(index, 1);
                }
            }

            if (allChildTasks && allChildTasks.length > 0) {
                for (var count = 0; count < allChildTasks.length; count++) {
                    this._deleteResources(allChildTasks[count], unAssignedTasks);
                    this._removeFromResourceCollection(allChildTasks[count], "resource");
                }
            }
            for (var count = 0; count < unAssignedTasks.length; count++) {
                var currentTask = unAssignedTasks[count];
                currentTask.parentItem = null;
                currentTask.level = 0;
                currentTask.index = currentTask.taskId;
                currentTask.eOverlapIndex = 1;
                currentTask.eResourceTaskType = "unassignedTask";
                currentTask.eResourceName = this._unassignedText;
                unAssignedIds.push(currentTask.taskId.toString());
                unAssignedTasksItems.push(currentTask.item);
                this._removeResourceChildTask(currentTask);
            }
            args.returnObj = { tasks: unAssignedTasks, ids: unAssignedIds, unAssignedTasksItems: unAssignedTasksItems };
            if (!this._isFlatResourceData)
                this._updateResourceData(data, args);
            args.returnObj.dataSource = this.dataSource();
            args.returnObj.jsondata = this._jsonData;
            this._triggerResourceUpdate();
            this._resourceUpdatedTasksIds = [];
        },
        //Method to trigger resource child task on resource or group delete action
        _triggerResourceUpdate: function (ids) {
            var idValues = ids ? ids : this._resourceUpdatedTasksIds, 
                records = [],
                task,
                eventArgs = {};
            if (idValues && idValues.length > 0) {
                eventArgs.requestType = "recordUpdate";
                for (var count = 0; count < idValues.length; count++) {
                    task = this._getRecordByTaskId(idValues[count]);
                    if (count == 0)
                        eventArgs.data = task;
                    else {
                        !eventArgs.updatedRecords && (eventArgs.updatedRecords = []);
                        eventArgs.updatedRecords.push(task);
                    }
                }
                this._trigger("actionComplete", eventArgs);
            }
        },
        /*Remove resource, group from it's collections*/
        _removeFromResourceCollection: function (data, type) {
            var record,
                model = this.model,
                collection = type == "resource" ? this._resourceCollection : this._groupCollection,
                mappingName = type == "resource" ? model.resourceIdMapping : model.groupIdMapping;
            for (var count = 0; count < collection.length; count++) {
                if (collection[count][mappingName] == data.taskId) {
                    collection.splice(count, 1);
                    break;
                }
            }
        },
        /*Update datasource on resource or group delete actions*/
        _updateResourceData: function (data, args) {
            var dataSource = this.dataSource(),
                model = this.model,
                index = -1;
            if (data.eResourceTaskType == "groupTask" || (data.eResourceTaskType == "resourceTask" && ej.isNullOrUndefined(data.parentItem)) || data.eResourceTaskType == "unassignedTask") {
                if (dataSource instanceof ej.DataManager) {
                    if (dataSource.dataSource.offline && dataSource.dataSource.json) {
                        var index = dataSource.dataSource.json.indexOf(data.item);
                        if (index !== -1)
                            dataSource.dataSource.json.splice(index, 1);
                    }
                    else if (this._isDataManagerUpdate) {
                        if (proxy._jsonData.indexOf(deletedRow.item) != -1);
                        proxy._jsonData.splice(proxy._jsonData.indexOf(deletedRow.item), 1);
                    }
                } else {
                    if (dataSource.indexOf(data.item) != -1)
                        dataSource.splice(dataSource.indexOf(data.item), 1);
                }
            } else if (data.eResourceTaskType == "resourceTask" && data.parentItem) {
                data.parentItem.item[model.resourceCollectionMapping].splice(data.parentItem.childRecords.indexOf(data), 1);
            }
            /*Push deleated resource task in datasource*/
            if (args.returnObj.unAssignedTasksItems.length > 0) {
                if (dataSource instanceof ej.DataManager) {
                    if (dataSource.dataSource.offline && dataSource.dataSource.json) {
                        dataSource.dataSource.json.push.apply(dataSource.dataSource.json, args.returnObj.unAssignedTasksItems);
                    }
                    else if (this._isDataManagerUpdate) {
                        proxy._jsonData.push.apply(proxy._jsonData, args.returnObj.unAssignedTasksItems);;
                    }
                } else {
                    dataSource.push.apply(dataSource, args.returnObj.unAssignedTasksItems);
                }
            }
        },
        /*Remove recsource child task with uniq task collections*/
        _removeResourceChildTask: function (task) {
            if (this._resourceChildTasks.indexOf(task) != -1) {
                var remRec = this._resourceChildTasks.splice(this._resourceChildTasks.indexOf(task), 1),
                    uniqIndex = this._resourceUniqTasks.indexOf(remRec[0]);
                if (uniqIndex != -1) {
                    for (var i = 0; i < this._resourceChildTasks.length; i++) {
                        if (this._resourceChildTasks[i].taskId == remRec[0].taskId) {
                            this._resourceUniqTasks[uniqIndex] = this._resourceChildTasks[i];
                            break;
                        }
                    }
                }
            }
        },
        /*Remove resource from all it's tasks*/
        _deleteResources: function (resourceTask, unAssignedTasks, rId) {
            var resourceId = !ej.isNullOrUndefined(rId) ? rId : resourceTask.taskId,
                childTasks = resourceTask.eResourceChildTasks,
                model = this.model;
            for (var count = 0; count < childTasks.length; count++) {
                //Remove resource task from resource child task collection
                if (ej.isNullOrUndefined(rId)) {
                    this._removeResourceChildTask(childTasks[count]);
                }
                var resourceInfo = childTasks[count].resourceInfo;
                if (resourceInfo.length > 0) {
                    for (var rCount = 0; rCount < resourceInfo.length; rCount++) {
                        var currentId = resourceInfo[rCount][model.resourceIdMapping];
                        if (currentId == resourceId) {
                            resourceInfo.splice(rCount, 1);
                            rCount--;
                            this._resourceUpdatedTasksIds.indexOf(childTasks[count].taskId.toString()) == -1 && this._resourceUpdatedTasksIds.push(childTasks[count].taskId.toString());
                        } else if (ej.isNullOrUndefined(rId)) {
                            var rTask = model.flatRecords[model.ids.indexOf("R_" + resourceInfo[rCount][model.resourceIdMapping])];
                            this._deleteResources(rTask, unAssignedTasks, resourceId)
                        }
                    }
                    if (resourceInfo.length == 0)
                        unAssignedTasks.push(childTasks[count]);
                }
                this._updateResourceName(childTasks[count]);
                this._updateResourceRelatedFields(childTasks[count]);
            }
        },

        /*Method to delete resource child task in resource Gantt*/
        deleteResourceChildTask: function (record) {
            var model = this.model,
                sharedTasks, currentRecord,
                index, parentRecord, prevOverlapIndex;

            if (!record)
                return;

            var obj = {};
            obj.data = record;
            obj.modifiedRecord = record;
            obj.isCompleteRemove = record.resourceInfo.length <= 1;
            obj.requestType = obj.isCompleteRemove ? "delete" : "save";

            obj.item = record.item;
            if (this._trigger("actionBegin", obj))
                return;
            this._isOverlapIndexChanged = false;
            parentRecord = record.parentItem;
            prevOverlapIndex = parentRecord.eOverlapIndex;

            /*Remove resource from shared task*/
            if (record.resourceInfo.length > 0) {
                sharedTasks = this._getExistingTaskWithID(record, true);
                for (var count = 0; count < sharedTasks.length; count++) {
                    currentRecord = sharedTasks[count];
                    var resourceInfo = currentRecord.resourceInfo,
                        resourceId = parentRecord.taskId;
                    if (resourceInfo.length > 0) {
                        for (var rCount = 0; rCount < resourceInfo.length; rCount++) {
                            var currentId = resourceInfo[rCount][model.resourceIdMapping];
                            if (currentId == resourceId) {
                                resourceInfo.splice(rCount, 1);
                                rCount--;
                            }
                        }
                    }
                    this._updateResourceName(sharedTasks[count]);
                    this._updateResourceRelatedFields(sharedTasks[count]);
                }
            }

            if (record.resourceInfo.length == 0) {
                /*Update predecessor related calculation*/
                var uniqIndex = this._resourceUniqTaskIds.indexOf(record.taskId.toString());
                if (uniqIndex != -1) {
                    this._resourceUniqTasks.splice(uniqIndex, 1);
                    this._resourceUniqTaskIds.splice(uniqIndex, 1);
                    if (model.predecessorMapping && record.predecessor)
                        this._removePredecessor(record.predecessor, record);
                }
            }

            /*Remove from resource task collection*/
            parentRecord.eResourceChildTasks.splice(parentRecord.eResourceChildTasks.indexOf(record), 1);
            this._removeResourceChildTask(record);

            /*Datasource update*/
            if (this._isFlatResourceData && record.resourceInfo.length < 1) {
                this._removeDataFromDataSource(record.item);
            } else if (!this._isFlatResourceData) {
                index = parentRecord.item[model.taskCollectionMapping].indexOf(record.item);
                if (index != -1)
                    parentRecord.item[model.taskCollectionMapping].splice(index, 1);
            }
            
            this._updateOverlappingValues(parentRecord);
            this._updateResourceParentItem(parentRecord);
            this.refreshGanttRecord(parentRecord);
            if (prevOverlapIndex != parentRecord.eOverlapIndex)
                this._refreshGanttHeightWithRecords();
            obj = {};
            obj.data = record;
            obj.item = record.item;
            obj.modifiedRecord = record;
            obj.isCompleteRemove = record.resourceInfo.length == 0;
            obj.requestType = obj.isCompleteRemove ? "delete" : "save";
            this._trigger("actionComplete", obj);
        },
        /*Method to populate records in resource view*/
        _createResourceRecords: function (dataSource) {
            var proxy = this,
             model = proxy.model,
             ganttRecords = model.flatRecords,
             length = dataSource.length,
             count = 0,
             parentGanttRecord,
             parentRecords = model.parentRecords,
             ids = proxy.model.ids;

            for (count; count < length; count++) {
                var dsLength = dataSource.length;
                parentGanttRecord = proxy._createResourceRecord(dataSource[count], 0, null, undefined, "Load");
                if (parentGanttRecord == null) {
                    if (dsLength != dataSource.length) {
                        count--;
                        length--;
                    }
                    continue;
                }
                proxy._storedIndex++;
                ids[proxy._storedIndex] = this._getFormattedTaskId(parentGanttRecord);
                parentGanttRecord.isAltRow = proxy._storedIndex % 2 == 0 ? false : true;
                parentGanttRecord.index = proxy._storedIndex;
                ganttRecords.push(parentGanttRecord);
                parentRecords.push(parentGanttRecord);
                parentGanttRecord.childRecords && proxy._addNestedGanttRecords(parentGanttRecord.childRecords, true);
            }

            if (!this._isFlatResourceData)
                this._updateResourceInfo();
            model.predecessorMapping && proxy._ensurePredecessorCollection();
            if (model.enableWBS && model.enableWBSPredecessor)
                proxy.createWBSPredecessor();

        },
        _getItemValueByUsingId: function (id, ids, dataCollection) {
            return dataCollection[ids.indexOf(id)];
        },
        /*Method to create resource records with group name*/
        _createResourceRecord: function (data, level, parentItem) {
            var model = this.model,
                groupName = data[model.groupNameMapping],
                resourceName = data[model.resourceNameMapping],
                resourceCollection = [], ganttRecord = new ej.Gantt.GanttRecord();

            if (groupName) {
                resourceCollection = data[model.resourceCollectionMapping];
                if (!resourceCollection)
                    resourceCollection = [];
                if (resourceCollection.length == 0) {
                    /*Remove item from data source collection*/
                    this._removeDataFromDataSource(data);
                    return null;
                }
                ganttRecord.taskName = ganttRecord.eResourceName = groupName;
                ganttRecord.level = level;
                ganttRecord.taskId = model.groupIdMapping ? data[model.groupIdMapping] : null;
                ganttRecord.eResourceTaskType = "groupTask";
                ganttRecord.durationUnit = (model.durationUnitMapping && data[model.durationUnitMapping]) ? this._validateDurationUnitMapping(data[model.durationUnitMapping]) : model.durationUnit,
                ganttRecord.item = this._isFlatResourceData ? this._getItemValueByUsingId(data[model.groupIdMapping], this._groupIds, this._groupCollection) : data;
                this._updateCustomField(ganttRecord.item, ganttRecord);

                if (!this._isFlatResourceData) {
                    //add resource into default resource collection
                    var groupObj = {};
                    groupObj[model.groupIdMapping] = ej.isNullOrUndefined(ganttRecord.taskId) ? this._groupCollection.length + 1 : ganttRecord.taskId;
                    groupObj[model.groupNameMapping] = ganttRecord.taskName;
                    this._groupCollection.push(groupObj);
                    ganttRecord.taskId = groupObj[model.groupIdMapping];
                }

                if (resourceCollection.length > 0) {
                    ganttRecord.hasChildRecords = true;
                    ganttRecord.expanded = true;
                    var currentRecord;
                    for (var rCount = 0; rCount < resourceCollection.length; rCount++) {
                        currentRecord = this._createResourceRecord(resourceCollection[rCount], level + 1, ganttRecord);
                        if (!ganttRecord.childRecords)
                            ganttRecord.childRecords = [];
                        currentRecord && ganttRecord.childRecords.push(currentRecord);
                    }
                }
                this._updateExpandStateMappingValue(ganttRecord.item, ganttRecord);
            }
            else if (resourceName) {
                var taskCollection = data[model.taskCollectionMapping],
                    currentRecord;
                !taskCollection && (taskCollection = []);
                ganttRecord.eResourceName = ganttRecord.taskName = resourceName;
                ganttRecord.item = this._isFlatResourceData ? this._getItemValueByUsingId(data[model.resourceIdMapping], this._resourceIds, this._resourceCollection) : data;;
                ganttRecord.level = level;
                ganttRecord.parentItem = parentItem;
                ganttRecord.taskId = model.resourceIdMapping ? data[model.resourceIdMapping] : null;
                ganttRecord.eResourceTaskType = "resourceTask";
                this._updateCustomField(ganttRecord.item, ganttRecord);
                if (!this._isFlatResourceData) {
                    //add resource into default resource collection
                    var resourceobj = {};
                    resourceobj[model.resourceIdMapping] = ej.isNullOrUndefined(ganttRecord.taskId) ? this._resourceCollection.length + 1 : ganttRecord.taskId;
                    resourceobj[model.resourceNameMapping] = ganttRecord.eResourceName;
                    resourceobj[model.groupIdMapping] = ganttRecord.parentItem ? ganttRecord.parentItem.taskId : null;
                    this._resourceCollection.push(resourceobj);
                    ganttRecord.taskId = resourceobj[model.resourceIdMapping];
                }
                for (var tCount = 0; tCount < taskCollection.length; tCount++) {
                    var existingTasks = this._getExistingTaskWithID(taskCollection[tCount]),
                        resourceTasks = [];

                    if (existingTasks) {
                        currentRecord = this._createGanttRecord(existingTasks[0].item, level, ganttRecord, undefined, "Load");
                        taskCollection[tCount] = existingTasks[0].item;
                        if (this._predecessorsCollection.indexOf(currentRecord) != -1)
                            this._predecessorsCollection.splice(this._predecessorsCollection.indexOf(currentRecord), 1);
                    }
                    else {
                        currentRecord = this._createGanttRecord(taskCollection[tCount], level, ganttRecord, undefined, "Load");
                        if (currentRecord.duration == 0)
                            continue;
                        this._resourceUniqTaskIds.push(currentRecord.taskId.toString());
                        this._resourceUniqTasks.push(currentRecord);
                        this._updateLastInsertedId(currentRecord["taskId"], false)
                    }
                    this._resourceChildTasks.push(currentRecord);
                    currentRecord.eResourceTaskType = "resourceChildTask";
                    ganttRecord.eResourceChildTasks.push(currentRecord);
                }
            }
            else if (!resourceName && !groupName) {
                //_unassingedTasksParent
                var existingTasks = this._getExistingTaskWithID(data);
                if (!existingTasks) {
                    ganttRecord = this._createGanttRecord(data, 0, null, undefined, "Load");
                    if (ganttRecord.duration != 0) {
                        ganttRecord.eResourceName = this._unassignedText;
                        ganttRecord.eResourceTaskType = "unassignedTask";
                        this._resourceUniqTaskIds.push(ganttRecord.taskId.toString());
                        this._resourceUniqTasks.push(ganttRecord);
                        this._updateLastInsertedId(ganttRecord["taskId"], false);
                    }
                    else {
                        ganttRecord = null;
                    }
                } else {
                    ganttRecord = null;
                    /*Remove item from data source collection*/
                    this._removeDataFromDataSource(data);
                }
            }
            return ganttRecord;
        },
        /*Used to remove unwanted group and repeated unassigneed task */
        _removeDataFromDataSource: function (data) {
            var dataSource = this.dataSource();
            if (dataSource instanceof ej.DataManager) {
                if (dataSource.dataSource.offline && dataSource.dataSource.json && dataSource.dataSource.json.indexOf(data) != -1) {
                    dataSource.dataSource.json.splice(dataSource.dataSource.json.indexOf(data), 1);
                }
                else if (this._isDataManagerUpdate && this._jsonData.indexOf(data) != -1) {
                    this._jsonData.splice(this._jsonData.indexOf(data), 1);
                }
            } else if (dataSource.indexOf(data) != -1) {
                dataSource.splice(dataSource.indexOf(data), 1);
            }
        },

        /*Used to remove unwanted group and repeated unassigneed task */
        _insertDataInDataSource: function (data) {
            var dataSource = this.dataSource();
            if (dataSource instanceof ej.DataManager) {
                if (dataSource.dataSource.offline && dataSource.dataSource.json) {
                    dataSource.dataSource.json.push(data);
                }
                else if (this._isDataManagerUpdate) {
                    this._jsonData.push(data);
                }
            } else if (dataSource) {
                dataSource.push(data);
            }
        },

        _getCombinedResource: function (records) {
            var resources = [],
                resourceObj,
                model = this.model;
            for (var i = 0; i < records.length; i++) {
                resourceObj = {};
                resourceObj[model.resourceIdMapping] = records[i].parentItem.taskId;
                resourceObj[model.resourceNameMapping] = records[i].parentItem.eResourceName;
                resources.push(resourceObj);
            }
            return resources;
        },
        /*Update resource info of the project*/
        _updateResourceInfo: function () {
            var resourceObj = {},
                model = this.model;

            var pagedData = ej.DataManager(this._resourceChildTasks).executeLocal(ej.Query().group("taskId"));
            for (var count = 0 ; count < pagedData.length; count++) {
                if (pagedData[count].count > 0) {
                    var resources = this._getCombinedResource(pagedData[count].items),
                        records = pagedData[count].items;
                    for (var i = 0; i < records.length; i++) {
                        records[i].resourceInfo = $.extend(true, [], resources);
                        this._updateResourceName(records[i]);
                        if (!model.workMapping)
                            records[i]._updateWorkWithDuration(this);
                    }
                }
            }
        },
        /*get record with same task id shared with multiple resource on task creation action*/
        _getExistingTaskWithID: function (data, isCheckOnRecord) {
            var model = this.model,
                filteredRecord = [];

            if (model.taskIdMapping && data[model.taskIdMapping] || !ej.isNullOrUndefined(data)) {
                filteredRecord = this._resourceChildTasks.filter(function (value) {
                    if ((!isCheckOnRecord && data[model.taskIdMapping] == value.taskId) || (isCheckOnRecord && data.taskId == value.taskId))
                        return true
                    else
                        return false
                });
            }
            if (filteredRecord.length > 0)
                return filteredRecord;
            else
                return null;
        },
        //populate gantt records from data source
        _checkDataBinding: function () {
            var proxy = this, model = proxy.model;
           
            if (this.dataSource() == null) {
                this.dataSource([]);
            }
            if (this.dataSource() instanceof ej.DataManager) {
                this._initDataSource();
            }
            else if (this.dataSource().length > 0) {
                if ((model.taskIdMapping.length > 0) && (model.parentTaskIdMapping.length > 0)) {
                    var dataArray = proxy._retrivedData = proxy.dataSource(), data = [];
                    proxy._taskIds = [];
                    for (var i = 0; i < dataArray.length; i++) {
                        var tempData = dataArray[i];
                        data.push($.extend(true, {}, tempData));
                        if (!ej.isNullOrUndefined(tempData[model.taskIdMapping])) proxy._taskIds.push(tempData[model.taskIdMapping]);
                    }
                  
                    if (!model.childMapping) model.childMapping = "Children";                                        
                    proxy._reconstructDatasource(data);
                    proxy._createGanttRecords(proxy.secondaryDatasource);
                }
                else {
                    proxy._createGanttRecords(this.dataSource());
                }
                proxy._initialize();
            }
            else {
                proxy._initialize();
            }
            if (proxy.model.allowSelection && proxy.model.selectionType == "multiple" && proxy.model.selectionMode == "row") {
                proxy._renderMultiSelectionPopup();
            }
        },

        //Create gantt records and render gantt if data source is remote data
        _initDataSource: function () {
            var proxy = this, model = proxy.model;     
            var query = this._columnToSelect();
            var queryPromise = this.dataSource().executeQuery(query);
            queryPromise.done(ej.proxy(function (e) {
                proxy._retrivedData = e.result;
                if ((model.taskIdMapping.length > 0) && (model.parentTaskIdMapping.length > 0)) {
                    //cloning the datasource
                    var dataArray = e.result, data = [];
                    proxy._taskIds = [];
                    for (var i = 0; i < dataArray.length; i++) {
                        var tempData = dataArray[i];
                        data.push($.extend(true, {}, tempData));
                        if (tempData[model.taskIdMapping]) proxy._taskIds.push(tempData[model.taskIdMapping]);
                    }
                    if (!model.childMapping) {
                        model.childMapping = "Children";
                    }
                    proxy._reconstructDatasource(data);
                }
                else {
                    proxy.secondaryDatasource = proxy._retrivedData;
                }
                proxy._createGanttRecords(proxy.secondaryDatasource);
                proxy._initialize();
                var eventArgs = {
                    requestType: "create"
                };
                proxy._trigger("actionComplete", eventArgs);
            }));
        },

        //create ejQuery when remote data is initiated
        _columnToSelect: function () {
            var proxy = this,
                model = proxy.model,
                column = [], queryManager = ej.Query();

            queryManager = model.query ? model.query : queryManager;
            return queryManager;
        },

        _intersectionObjects: function (flatCollection, rootCollection) {
            var result = [];
            while (flatCollection.length > 0 && rootCollection.length > 0) {
                var index = rootCollection.indexOf(flatCollection[0]);
                if (index == -1) {
                    flatCollection.shift();
                }
                else {
                    result.push(flatCollection.shift());
                    rootCollection.splice(index, 1);
                }
            }

            return result;
        },

        //If parentIdMapping is given data source is changed in hierarchical order
        _reconstructDatasource: function (datasource) {
            var proxy = this, model = proxy.model,
                data, filter;

            filter = ej.Predicate(model.parentTaskIdMapping, ej.FilterOperators.notEqual, "null");
            data = ej.DataManager(datasource).executeLocal(ej.Query().where(filter).group(model.parentTaskIdMapping));
            var tempParent = [];
            for (var i = 0; i < data.length; i++) {
                if (!ej.isNullOrUndefined(data[i].key)) {

                    var index = proxy._taskIds.indexOf(data[i].key);
                    if (index > -1) {
                        datasource[index][model.childMapping] = data[i].items;
                        continue;
                    }
                }
                tempParent.push.apply(tempParent, data[i].items);
            }
            proxy.secondaryDatasource = proxy._intersectionObjects(datasource, tempParent);
        },       

        //refresh the chart with updated schedule dates
        updateScheduleDates: function (startDate, endDate) {
            
            var proxy = this, model = this.model,
                scheduleHeaderType = model.scheduleHeaderSettings.scheduleHeaderType;
            model.scheduleStartDate = startDate;
            model.scheduleEndDate = endDate;
            proxy._scheduleDays = [];
            proxy._scheduleMonths = [];
            proxy._scheduleWeeks = [];
            proxy._scheduleYears = [];
            proxy._scheduleHours = [];
            proxy._scheduleMinutes = [];
            proxy._calculateHeaderDates();
            var chartObject = proxy._$ganttchartHelper.ejGanttChart("instance");
            var chartModel = chartObject.model;
            /* No need to re render parent item , because all the records are rerendered*/
            proxy._isTreeGridRendered = false;
            proxy._isGanttChartRendered = false;
            proxy._isChartRendering = true;
            proxy._updateGanttRecords();
            chartModel.projectStartDate = proxy._getDateFromFormat(proxy._projectStartDate);
            chartModel.projectEndDate = proxy._getDateFromFormat(proxy._projectEndDate);
            chartModel.scheduleDays = proxy._scheduleDays;
            chartModel.scheduleMonths = proxy._scheduleMonths;
            chartModel.scheduleWeeks = proxy._scheduleWeeks;
            chartModel.scheduleYears = proxy._scheduleYears;
            chartModel.scheduleHours = proxy._scheduleHours;
            chartModel.scheduleMinutes = proxy._scheduleMinutes;
            chartModel.renderBaseline = model.renderBaseline;
            chartModel.scheduleHeaderSettings.scheduleHeaderType = scheduleHeaderType;
            chartModel.dateFormat = model.dateFormat;
            chartModel.perDayWidth = proxy._perDayWidth;
            chartModel.durationUnit = model.durationUnit;
            chartModel.scheduleHeaderSettings.weekHeaderFormat = model.scheduleHeaderSettings.weekHeaderFormat;
            chartModel.scheduleHeaderSettings.dayHeaderFormat = model.scheduleHeaderSettings.dayHeaderFormat;
            chartModel.scheduleHeaderSettings.hourHeaderFormat = model.scheduleHeaderSettings.hourHeaderFormat;
            chartModel.scheduleHeaderSettings.minutesPerInterval = model.scheduleHeaderSettings.minutesPerInterval;
            chartModel.scheduleHeaderSettings.monthHeaderFormat = model.scheduleHeaderSettings.monthHeaderFormat;
            chartModel.scheduleHeaderSettings.yearHeaderFormat = model.scheduleHeaderSettings.yearHeaderFormat;
            if (scheduleHeaderType == "day") {
                chartModel.perHourWidth = proxy._perHourWidth;
            }
            else if (scheduleHeaderType == "hour") {
                chartModel.workingTimeScale = model.workingTimeScale;
                chartModel.minuteInterval = proxy._minuteInterval;
                chartModel.perMinuteWidth = proxy._perMinuteWidth;
            }
            else if (scheduleHeaderType == "month") {
                chartModel.perWeekWidth = proxy._perWeekWidth;
            }
            else if (scheduleHeaderType == "year") {
                chartModel._perMonthWidth = proxy._perMonthWidth;
            }
            proxy._$ganttchartHelper.ejGanttChart("refreshChartHeader", proxy._getDateFromFormat(startDate), proxy._getDateFromFormat(endDate));
            proxy._$ganttchartHelper.ejGanttChart("refreshContainersWidth");
            proxy._$ganttchartHelper.ejGanttChart("refreshHelper", proxy.model.currentViewData, proxy.model.updatedRecords, proxy._totalCollapseRecordCount);
            if (model.predecessorMapping) {
                proxy._refreshConnectorLines(false, true, true);
            }
            chartObject._$bodyContainer.ejScroller("refresh");
            proxy._updateScrollerBorder();
            proxy._isTreeGridRendered = true;
            proxy._isGanttChartRendered = true;
            proxy._isChartRendering = false;
        },
        //used to change the schedule mode dynamically
        
        reRenderChart: function (scheduleMode) {
            var proxy = this, model = proxy.model,
                startDate = proxy._getDateFromFormat(model.scheduleStartDate),
                endDate = proxy._getDateFromFormat(model.scheduleEndDate);
            model.flatRecords = [];
            model.parentRecords = [];
            $("#ejGanttChart" + proxy._id).empty();

            switch (scheduleMode) {
                case ej.Gantt.ScheduleHeaderType.Week:
                    model.scheduleHeaderSettings.scheduleHeaderType = ej.Gantt.ScheduleHeaderType.Week;
                    proxy._perDayWidth = model.perDayWidth;
                    proxy._calculateWeekSplit(startDate, endDate);
                    break;

                case ej.Gantt.ScheduleHeaderType.Day:
                    model.scheduleHeaderSettings.scheduleHeaderType = ej.Gantt.ScheduleHeaderType.Day;
                    proxy._perHourWidth = model.perHourWidth;
                    proxy._perDayWidth = (proxy._perHourWidth * 24);//24 hours
                    proxy._calculateDaySplit(startDate, endDate);
                    break;

                case ej.Gantt.ScheduleHeaderType.Month:
                    model.scheduleHeaderSettings.scheduleHeaderType = ej.Gantt.ScheduleHeaderType.Month;
                    proxy._perDayWidth = model.perDayWidth;
                    proxy._perWeekWidth = model.perWeekWidth;
                    proxy._calculateMonthSplit(startDate, endDate);
                    break;

                case ej.Gantt.ScheduleHeaderType.Year:
                    model.scheduleHeaderSettings.scheduleHeaderType = ej.Gantt.ScheduleHeaderType.Year;
                    proxy._perDayWidth = model.perDayWidth;
                    proxy._perMonthWidth = model.perMonthWidth;
                    proxy._calculateYearSplit(startDate, endDate);
                    break;
                case ej.Gantt.ScheduleHeaderType.Hour:
                    model.scheduleHeaderSettings.scheduleHeaderType = ej.Gantt.ScheduleHeaderType.Hour;
                    var minutesPerInterval = model.scheduleHeaderSettings.minutesPerInterval,
                        intervalValue = ej.Gantt.minutesPerInterval;
                    proxy._perMinuteWidth = model.perMinuteWidth;
                    if (minutesPerInterval) {
                        if (minutesPerInterval == intervalValue.Auto) {
                            var twoDaysTimeSpan = 2 * 86400000,// Time in milliseconds
                                sevenDaysTimeSpan = 7 * 86400000,//Time in milliseconds
                                tenDaysTimeSpan = 10 * 86400000,
                                diff = endDate - startDate;

                            if (diff > tenDaysTimeSpan) {
                                proxy._minuteInterval = 30;
                                proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 2);//24 hours
                            }
                            else if (diff > sevenDaysTimeSpan) {
                                proxy._minuteInterval = 15;
                                proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 4);//24 hours
                            }
                            else if (diff > twoDaysTimeSpan) {
                                proxy._minuteInterval = 5;
                                proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 12);//24 hours
                            }
                            else {
                                proxy._minuteInterval = 1;
                                proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 60);//24 hours
                            }
                        }
                        else if (minutesPerInterval == intervalValue.OneMinute) {
                            proxy._minuteInterval = 1;
                            proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 60);
                        }
                        else if (minutesPerInterval == intervalValue.FiveMinutes) {
                            proxy._minuteInterval = 5;
                            proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 12);//24 hours
                        }
                        else if (minutesPerInterval == intervalValue.FifteenMinutes) {
                            proxy._minuteInterval = 15;
                            proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 4);//24 hours
                        }
                        else if (minutesPerInterval == intervalValue.ThirtyMinutes) {
                            proxy._minuteInterval = 30;
                            proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 2);//24 hours
                        }
                    }
                    proxy._calculateHourSplit(startDate, endDate);
                    break;
            }
            proxy.element.ejGantt("destroy").ejGantt(model);
            proxy._isTreeGridRendered = false;
            proxy._isGanttChartRendered = false;

        },

        changeTaskMode:function(record, taskMode){
            var proxy = this, model = proxy.model, args = {};
            args.data = record;

            proxy._isValidationEnabled = true;
            if (taskMode == ej.Gantt.TaskSchedulingMode.Manual) {
                record.isAutoSchedule = false;
                record.item[model.taskSchedulingModeMapping] = true;                
            }
            else if (taskMode == ej.Gantt.TaskSchedulingMode.Auto) {
                record.isAutoSchedule = true;
                record.item[model.taskSchedulingModeMapping] = false;                
            }
            args.columnName = "taskMode";
            proxy._updateEditedGanttRecords(args,true);
            proxy._isValidationEnabled = false;
        },
        autoSchedule: function (taskId) {
            var proxy = this, model = proxy.model, targetRecord,
                updatedRecords = model.updatedRecords;
            targetRecord = updatedRecords.filter(function (record) {
                return record.taskId === taskId;
            });
            proxy.changeTaskMode(targetRecord[0], ej.Gantt.TaskSchedulingMode.Auto);
        },
        manualSchedule: function (taskId) {
            var proxy = this, model = proxy.model, targetRecord,
                updatedRecords = model.updatedRecords;
            targetRecord = updatedRecords.filter(function (record) {
                return record.taskId === taskId;
            });
            proxy.changeTaskMode(targetRecord[0], ej.Gantt.TaskSchedulingMode.Manual);
        },
        //update the all gantt records width,progresswidth and left value
        _updateGanttRecords: function () {

            var proxy = this, model = proxy.model,
                flatRecords = model.flatRecords,
                length = flatRecords.length,
                currentRecord, parentItem, childRecords,
                taskCollections;

            for (var i = 0; i < length; i++) {
                currentRecord = flatRecords[i];
                taskCollections = [];
                if (currentRecord.eResourceChildTasks.length > 0) {
                    taskCollections = currentRecord.eResourceChildTasks;
                    this._updateOverlappingValues(currentRecord);
                }
                else
                    taskCollections.push(currentRecord);
                for (var count = 0; count < taskCollections.length; count++) {
                    var currentTask = taskCollections[count];
                    if (currentTask.hasChildRecords === false) {
                        currentTask.left = currentTask._calculateLeft(this);
                        currentTask.width = currentTask._calculateWidth(this);
                        //if (model.viewType == "resourceView") {
                        //    currentTask.top = currentTask._calculateTop(this);
                        //}
                        currentTask.width = currentTask.isMilestone == true ? proxy._milesStoneWidth : currentTask.width;
                        currentTask.progressWidth = currentTask._getProgressWidth(currentTask.width, currentTask.status);
                    }
                    if (currentTask.baselineStartDate && currentTask.baselineEndDate) {
                        currentTask.baselineLeft = currentTask._calculateBaselineLeft(this);
                        currentTask.baselineRight = currentTask._calculateBaselineRight(this);
                        currentTask.baselineWidth = currentTask._calculateBaseLineWidth(this);
                    } else {
                        currentTask.baselineLeft = 0;
                        currentTask.baselineRight = 0;
                        currentTask.baselineWidth = 0;
                    }
                }

                parentItem = currentRecord.parentItem;
                childRecords = parentItem && parentItem.childRecords;

                if (parentItem && childRecords.indexOf(currentRecord) == childRecords.length - 1 && currentRecord.hasChildRecords === false) {
                    if (model.viewType == "resourceView")
                        proxy._updateResourceParentItem(currentRecord);
                    else if (parentItem.isAutoSchedule)
                        proxy._updateParentItem(currentRecord);
                    else
                        proxy._updateManualParentItem(currentRecord);
                }
            }

        },
        
        //Method for initialize private peoperties
        _initPrivateProperties: function () {

            var proxy = this,
                model = proxy.model,
            scheduleMode = model.scheduleHeaderSettings.scheduleHeaderType;
            proxy._unassingedTasksParent = null;
            proxy._isFromGantt = true;
            proxy._disabledToolItems = [],
            proxy._id = proxy.element.attr('id'),
            proxy._scheduleWeeks = [],
            proxy._taskIds = [],
            proxy._currentFilterColumn = [],
            proxy._duplicate = false,          
            proxy._wrongenddate=false,
            proxy._addPosition = null,
            proxy._datePickerChangeEvent = false,
            proxy._scheduleYears = [],//new property for year schedule modes
            proxy._enableMonthStart=true,
            proxy._scheduleMonths = [], //new property for month
            proxy._splitterOnResize = false,
            proxy._scheduleYears = [],//property for schedule years
            proxy._scheduleDays = [],//property for schedule days
            proxy._scheduleHours = [],
            proxy._projectStartDate, //property instead of scheduleWeeks[0] and scheduleYears[0]
            proxy._projectEndDate,

            //Resource view related private properties
            proxy._groupIds = [];
            proxy._resourceIds = [];
            proxy._resourceCollection = [];
            proxy._groupCollection = [];
            if (model.viewType == "resourceView" && (model.resourceIdMapping.length > 0 && model.resources && model.resources.length > 0)
                || (model.groupIdMapping && model.groupIdMapping.length > 0 && model.groupCollection && model.groupCollection.length > 0)) {
                proxy._isFlatResourceData = true;
                proxy._groupCollection = model.groupCollection;
                proxy._resourceCollection = model.resources;
            }
            else if (model.viewType == "resourceView") {
                proxy._isFlatResourceData = false;
            } else {
                proxy._resourceCollection = model.resources;
            }

            if (model.viewType == "resourceView") {
                if (!model.resourceIdMapping)
                    model.resourceIdMapping = "eResourceId";
                if (!model.groupIdMapping)
                    model.groupIdMapping = "eGroupId";
                if (!model.resourceInfoMapping)
                    model.resourceInfoMapping = "eResourceInfo";
            }

            this._resourceChildTasks = [];
            /*To perform predecessor validation on resource view*/
            this._resourceUniqTasks = [];
            this._resourceUniqTaskIds = [];

            proxy._columns = [],
            proxy._storedIndex = -1,
            proxy._perDayWidth,
            proxy._prevDayWidth = 0,
            proxy._rowIndexOfLastSelectedCell = -1,
            proxy._perMonthWidth,//new property for month
            proxy._perWeekWidth,//new property for month-week schedule

            proxy._$treegridPane = null,
            proxy._$ganttchartPane = null,
            proxy._$treegridHelper = null,
            proxy._$ganttchartHelper = null,
            proxy._$ejGantt = null,
            proxy._tdsOffsetWidth = [];
            proxy._subPosx = [];
            proxy._predecessorsCollection = [];
            proxy._connectorLinesCollection = [];            
            proxy._updatedConnectorLineCollection = [];
            proxy._connectorlineIds = [];
            proxy._gridRows = null;

            //variables used for ExpandCollapse action in non Virtualization 
            proxy._collapsedRecordCount = 0;
            proxy._expandedRecordsCount = 0;
            proxy._totalCollapseRecordCount = 0;
            proxy._isInExpandCollapse = false;

            proxy._hiddenRecordCount = 0;
            proxy._validationRuleOptions = null;
            proxy._validationDialogTitle = null;
            proxy._validationRuleText = null;
            proxy.prevPredecessorTO = null;
            proxy.prevPredecessorFrom = null;
            proxy.prevPredecessorcount = 0;
            proxy._isValidationEnabled = true;
            proxy._isTreeGridRendered = false;//indicate treegrid part is rendered or not for refresh row
            proxy._isGanttChartRendered = false;//indicate gantChart part is rendered or not
            proxy._isChartRendering = false;//To check chart is re-rendering for timescale unit size
            proxy._holidaysList = proxy._getHoliday();
            proxy._stringHolidays = proxy._getStringHolidays();
            proxy._isinBeginEdit = false;
            proxy._isMileStoneEdited = false;
            proxy._cellEditColumn = null;
            proxy._isinAddnewRecord = false;
           
            //variables for context menu items
            proxy._contextMenuItems = null; //proxy._getContextMenuItems();
            proxy._totalBorderWidth = 2;//Left and Right border width

            if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 9) {
                proxy._totalBorderHeight = model.toolbarSettings.showToolbar ? 3 : 2;//top,bottom,toolbar div
            } else {
                proxy._totalBorderHeight = model.toolbarSettings.showToolbar ? 1 : 0;//top box-sizing:border-box includes it's border
            }
            //private variable decalartion for localization
            proxy._columnHeaderTexts = null;
            proxy._predecessorEditingTexts = null;
            proxy._editDialogTexts = null;
            proxy._toolboxTooltipTexts = null;
            proxy._durationUnitTexts = null;
            proxy._durationUnitEditText = null;
            proxy._workUnitTexts = null;
            proxy._taskTypeTexts = null;
            proxy._effortDrivenTexts = null;
            proxy._contextMenuTexts = null;
            proxy._columnMenuTexts = null;
            proxy._editTypeText = null;
            proxy._clipModeText = null;
            proxy._textAlignTypeText = null;
            proxy._columnDialogTitle = null;
            proxy._deleteColumnText = null;
            proxy._okButtonText = null;
            proxy._cancelButtonText = null;
            proxy._confirmDeleteText = null;
            proxy._columnDialogTexts = null;
            proxy._newTaskTexts = null;
            proxy._months = null;  
            proxy._days = null;
            proxy._dialogTabTitleTexts = null;
            proxy._isLoad = true;
            proxy._updatedColumn = "";
            proxy._isExistingUnitIsUpdated = false;
            proxy._isDurationUpdated = false;
            proxy._isResourceAddedOrRemoved = false;
            proxy._newRecordResourceCollection = [];//maintan newly added row resources and its units.
            proxy._ganttTouchTrigger = false;
            /*alert text localization*/
            proxy._alertTexts = null;

            proxy._commonColumnWidth = 150;
            proxy._searchString = "",
            proxy._emptyDataColumns = [],
            proxy.secondaryDatasource = [];
            proxy._datasourceChildItems = [];
            proxy._$predecessorTable = null;
            proxy._mappingItems = [];
            proxy._editedDialogRecord = null;
            proxy._calculateDimensions();
            proxy._retrivedData = this.dataSource();
            proxy._isInExpandCollapseAll = false;
            proxy._preTableCollection = [];
            proxy._defaultStartTime = null;
            proxy._defaultEndTime = null;
            proxy._workingTimeRanges = [];
            proxy._nonWorkingTimeRanges = [];
            proxy._nonWorkingHours = [];
            this._validateTimeRange();
            //deprecate working timescaale API with dayWorkingTime API
            if (JSON.stringify(model.dayWorkingTime) == '[{\"from\":\"08:00 AM\",\"to\":\"12:00 PM\"},{\"from\":\"01:00 PM\",\"to\":\"05:00 PM\"}]') {
                if (model.workingTimeScale != ej.Gantt.workingTimeScale.TimeScale8Hours)
                    model.dayWorkingTime = [{ from: "12:00 AM", to: "12:00 AM" }];
                else
                    model.dayWorkingTime = [{ from: "08:00 AM", to: "12:00 PM" }, { from: "01:00 PM", to: "05:00 PM" }];
            }
            proxy._secondsPerDay = proxy._getSecondsPerDay();
            proxy._timelineWidthCalculation();
            proxy._localizedLabels = proxy._getLocalizedLabels();
            //culture info assigned for private variables
            proxy._setCultureInfo();
            proxy._resourceViewColumns = [];
            //Column collection populated
            proxy.setColumns(model.columns && model.columns.length ? model.columns : proxy.createTreeGridColumns());

            //update columns dropdown data while changing localization dynamically.
            if (model.isRerender)
                proxy._updateColumnDropDownData();

            proxy._updateColumnLocaleText();
            /* flag for refreshing newly added record */
            proxy._isRefreshAddedRecord = false;
            /* Used as flag for refresh chart and grid rows on adding when parent item is in collpased state*/
            proxy._isInAdd = false;
            //context menu sctive item's ID
            proxy._activeMenuItemId = null;
            proxy._isAddEditDialogSave = false;
            proxy._setTaskbarHeight(model.taskbarHeight);            
            proxy.isCriticalPathEnable = false;
            proxy.criticalPathCollection = [];
            proxy.detailPredecessorCollection = [];
            proxy.collectionTaskId = [];
            proxy._isValidPredecessorString = true;
            proxy._enableDisableCriticalIcon = false;
            proxy._generalTabColumnFields = [];
            proxy._addDialogGeneralColumns = [];
            proxy._addDialogcustomColumns = [];
            proxy._editDialogGeneralColumns = [];
            proxy._editDialogCustomColumns = [];
            //update resource unit mapping value
            if (model.resourceUnitMapping == "")
                model.resourceUnitMapping = "unit";
            proxy._dialogTab = ["General", "Predecessors", "Resources", "Custom Fields", "Notes"];
            proxy._cssClass = model.cssClass;
            proxy._actionCompleteData = []; //collection of actionCompelte data
            proxy._isLastRefresh = false; // used for check the refreshGanttRecord method is called last time.
            proxy._nonWorkingDayIndex = [];
            proxy._serialCount = 0;
            proxy._lastInsertedId = -1;
            proxy._isTriggerActionComplete = true;
            proxy._expandCollapseSettings = { state: model.expandStateMapping ? "" : model.enableCollapseAll ? "collapseAll" : "expandAll", level: 0 };
            proxy._contextMenuHandler = false;
            proxy._ganttTouchEvent = false;
            proxy._histoGramChildTasks = [];
            proxy._histoGramChildTaskIds = [];
            model.allowSearching = true;
            proxy._unscheduledTaskWidth = 7;
            proxy._isPredecessorEdited = false;
        },
        //Update all the private variables widths to model
        _updateModelsWidth: function () {
            var proxy = this, model = proxy.model;
            model.perDayWidth = proxy._perDayWidth ? proxy._perDayWidth : null;
            model.perMonthWidth = proxy._perMonthWidth ? proxy._perMonthWidth : null;
            model.perWeekWidth = proxy._perWeekWidth ? proxy._perWeekWidth : null;
            model.perHourWidth = proxy._perHourWidth ? proxy._perHourWidth : null;
            model.perMinuteWidth = proxy._perMinuteWidth ? proxy._perMinuteWidth : null;
            model.minuteInterval = proxy._minuteInterval ? proxy._minuteInterval : null;
        },
        //Gantt chart timeline width calculation
        _timelineWidthCalculation: function (scaleSize) {
            var proxy = this, model = proxy.model,
                fitTimescaleSize = true,
                scheduleMode = model.scheduleHeaderSettings.scheduleHeaderType,
                timescaleUnitSize = model.scheduleHeaderSettings.timescaleUnitSize,
                timescaleUnitSizeStr = timescaleUnitSize.toString(),
                timescaleSizeValue;
            //On Initial loading - timescaleSizeValue
            if (scaleSize == undefined && timescaleUnitSize != "100%") {
                fitTimescaleSize = false;
                var negativeVal = timescaleUnitSizeStr.indexOf("-");
                if (negativeVal != -1)
                    timescaleSizeValue = 100;//default value
                else
                    timescaleSizeValue = +(timescaleUnitSizeStr.match(/\d+/)[0]);
                if (timescaleSizeValue < 50)
                    timescaleSizeValue = 50;
                else if (timescaleSizeValue > 500)
                    timescaleSizeValue = 500;
                model.scheduleHeaderSettings.timescaleUnitSize = timescaleSizeValue + "%";//To receive updated value
            }
            //Dynamic update - timescaleSizeValue
            if (scaleSize != undefined) {
                fitTimescaleSize = false;
                var negativeVal = timescaleUnitSizeStr.indexOf("-");
                if (negativeVal != -1)
                    timescaleSizeValue = timescaleUnitSize;//Existing scale value
                else
                    timescaleSizeValue = +(timescaleUnitSizeStr.match(/\d+/)[0]);
                if (timescaleSizeValue < 50)
                    timescaleSizeValue = 50;
                else if (timescaleSizeValue > 500)
                    timescaleSizeValue = 500;
                model.scheduleHeaderSettings.timescaleUnitSize = timescaleSizeValue + "%";//To receive updated value
            }
            if (scheduleMode == "week") {
                proxy._perDayWidth = !fitTimescaleSize ? Math.round(timescaleSizeValue * 0.3) : 30;
                proxy._perMinuteWidth = proxy._perDayWidth / (24 * 60);
            }
            else if (scheduleMode == "year") {
                proxy._perDayWidth = !fitTimescaleSize ? Math.round(timescaleSizeValue * 0.03) : 3;
                proxy._perMonthWidth = proxy._perDayWidth * 30;
                proxy._perMinuteWidth = proxy._perDayWidth / (24 * 60);
            }
            else if (scheduleMode == "month") {
                proxy._perDayWidth = !fitTimescaleSize ? Math.round(timescaleSizeValue * 0.1) : 10;
                proxy._perWeekWidth = proxy._perDayWidth * 7;
                proxy._perHourWidth = proxy._perDayWidth / 24;
                proxy._perMinuteWidth = proxy._perDayWidth / (24 * 60);
            }
            else if (scheduleMode == "day") {
                proxy._perHourWidth = !fitTimescaleSize ? Math.round(timescaleSizeValue * 0.2) : 20;
                proxy._perMinuteWidth = proxy._perHourWidth / 60;
                proxy._perDayWidth = (proxy._perHourWidth * 24);//24 hours
            }
            else if (scheduleMode == "hour") {
                var minutesPerInterval = model.scheduleHeaderSettings.minutesPerInterval,
                    intervalValue = ej.Gantt.minutesPerInterval;
                proxy._perMinuteWidth = !fitTimescaleSize ? Math.round(timescaleSizeValue * 0.2) : 20;
                if (minutesPerInterval) {
                    if (minutesPerInterval == intervalValue.Auto) {
                        var scheduleStartDate = proxy._getDateFromFormat(model.scheduleStartDate),
                            scheduleEndDate = proxy._getDateFromFormat(model.scheduleEndDate),
                            twoDaysTimeSpan = 2 * 86400000,// Time in milliseconds
                            sevenDaysTimeSpan = 7 * 86400000,//Time in milliseconds
                            tenDaysTimeSpan = 10 * 86400000,
                            diff = scheduleEndDate - scheduleStartDate;

                        if (diff > tenDaysTimeSpan) {
                            proxy._minuteInterval = 30;
                            proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 2);//24 hours
                        }
                        else if (diff > sevenDaysTimeSpan) {
                            proxy._minuteInterval = 15;
                            proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 4);//24 hours
                        }
                        else if (diff > twoDaysTimeSpan) {
                            proxy._minuteInterval = 5;
                            proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 12);//24 hours
                        }
                        else {
                            proxy._minuteInterval = 1;
                            proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 60);//24 hours
                        }
                    }
                    else if (minutesPerInterval == intervalValue.OneMinute) {
                        proxy._minuteInterval = 1;
                        proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 60);
                    }
                    else if (minutesPerInterval == intervalValue.FiveMinutes) {
                        proxy._minuteInterval = 5;
                        proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 12);//24 hours
                    }
                    else if (minutesPerInterval == intervalValue.FifteenMinutes) {
                        proxy._minuteInterval = 15;
                        proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 4);//24 hours
                    }
                    else if (minutesPerInterval == intervalValue.ThirtyMinutes) {
                        proxy._minuteInterval = 30;
                        proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 2);//24 hours
                    }
                }                
            }
            proxy._updateModelsWidth();
        },
        //Private method for changing timescaleSize
        _updateTimescaleUnitSize: function (sizeValue) {
            var proxy = this, model = proxy.model,
                scheduleHeaderSettings = model.scheduleHeaderSettings,
                previousTimescaleUnitSize = scheduleHeaderSettings.timescaleUnitSize;
            scheduleHeaderSettings.timescaleUnitSize = sizeValue;
            //Calculate timeline width for timescaleUnitSize value
            proxy._timelineWidthCalculation(sizeValue);
            //Re render the gantt chart side alone
            proxy.updateScheduleDates(model.scheduleStartDate, model.scheduleEndDate);
            // Update the scrollbar to focus the selected taskbar while zooming
            var selectedItemIndex = proxy.selectedRowIndex();
            if (selectedItemIndex >= 0) {
                proxy.focusOnTask(selectedItemIndex);
            }
        },

        /*validate dayWorkingTime API if it is not valid assign default value to this API*/
        _validateTimeRange: function () {
            var tempDay = "01/01/2016", tempEndDay = "01/02/2016", proxy = this, model = this.model,
               length = model.dayWorkingTime.length, isValid = true, prevTimeline = null;//MM/dd/yyyy
            for (var count = 0; count < length; count++) {
                var currentRange = model.dayWorkingTime[count];
                if (currentRange.from && currentRange.to) {
                    var startHour = ej.parseDate(tempDay + " " + currentRange.from, "MM/dd/yyyy h:mm tt", "en-US"),
                        endHour = currentRange.to != "12:00 AM" ? ej.parseDate(tempDay + " " + currentRange.to, "MM/dd/yyyy h:mm tt", "en-US") : ej.parseDate(tempEndDay + " " + currentRange.to, "MM/dd/yyyy h:mm tt", "en-US"),
                        timeDiff = endHour.getTime() - startHour.getTime(),
                        sdHour = this._getSecondsInDecimal(startHour),
                        edHour = this._getSecondsInDecimal(endHour);
                    if (edHour == 0)
                        edHour = 86400; // second in a day
                    if (sdHour >= edHour) {
                        isValid = false;
                    }
                    else {
                        if (prevTimeline == null)
                            prevTimeline = edHour;
                        else if (prevTimeline > sdHour || prevTimeline >= edHour)
                            isValid = false;
                    }
                }
                else {
                    isValid = false;
                }
            }
            if (!isValid) {
                model.dayWorkingTime = [{ from: "08:00 AM", to: "12:00 PM" }, { from: "01:00 PM", to: "05:00 PM" }];
            }
        },
        /*Get date from string*/
        _getParsedDate: function (value, format, locale) {
            return ej.parseDate(value, format, locale);
        },
        _setTime: function (seconds, date) {
            var hour = parseInt(seconds / (3600)),
                min = parseInt((seconds - (hour * 3600)) / 60),
                sec = seconds - (hour * 3600) - (min * 60);
            date.setHours(hour, min, sec, 0);
        },
        // Update date next recent working hours
        _checkStartDate: function (date, record, validateAsMilestone) {

            if (ej.isNullOrUndefined(date))
                return null;

            var cloneDate = new Date(date), model = this.model, hour = this._getSecondsInDecimal(cloneDate), startRangeIndex = -1,
                isMilestone = ej.isNullOrUndefined(validateAsMilestone) ? !ej.isNullOrUndefined(record) ? record.isMilestone : false : validateAsMilestone;
            if (hour < this._defaultStartTime) {
                this._setTime(this._defaultStartTime, cloneDate);
            } else if (hour == this._defaultEndTime && (!record || !isMilestone)) {//milestone can fall at end of the day
                cloneDate.setDate(cloneDate.getDate() + 1);
                this._setTime(this._defaultStartTime, cloneDate);
            }
            else if (hour > this._defaultEndTime) {
                cloneDate.setDate(cloneDate.getDate() + 1);
                this._setTime(this._defaultStartTime, cloneDate);
            } else if (hour > this._defaultStartTime && hour < this._defaultEndTime) {
                for (var i = 0; i < this._workingTimeRanges.length; i++) {
                    var val = this._workingTimeRanges[i];
                    if (hour >= val.to && (this._workingTimeRanges[i + 1] && hour < this._workingTimeRanges[i + 1].from)) {
                        //milestone can fall at end of any interval time
                        if (hour == val.to && (!record || !isMilestone))
                            this._setTime(this._workingTimeRanges[i + 1].from, cloneDate);
                        else if (hour != val.to)
                            this._setTime(this._workingTimeRanges[i + 1].from, cloneDate);
                        break;
                    }
                }
            }
            var tempStartDate;
            do{
                tempStartDate = new Date(cloneDate);
                //check holidays and weekends
                if ((!ej.isNullOrUndefined(record) && record.isAutoSchedule && (!model.includeWeekend || model.holidays.length > 0)) || (ej.isNullOrUndefined(record) && (!model.includeWeekend || model.holidays.length > 0))) {
                    if (!model.includeWeekend) {
                        var tempDate = new Date(cloneDate);
                        cloneDate = this._getNextWorkingDay(cloneDate);
                        if (tempDate.getTime() != cloneDate.getTime())
                            this._setTime(this._defaultStartTime, cloneDate);
                    }
                    for (var count = 0; count < model.holidays.length; count++) {
                        var holidayFrom = this._getDateFromFormat(model.holidays[count].day),
                            holidayTo = new Date(holidayFrom);
                        holidayFrom.setHours(0, 0, 0, 0);
                        holidayTo.setHours(23, 59, 59, 59);
                        if (cloneDate.getTime() >= holidayFrom.getTime() && cloneDate.getTime() < holidayTo.getTime()) {
                            cloneDate.setDate(cloneDate.getDate() + 1);
                            this._setTime(this._defaultStartTime, cloneDate);
                            //cloneDate.setHours(this._defaultStartTime, 0, 0, 0);
                        }
                    }
                }
            } while (tempStartDate.getTime() != cloneDate.getTime());
            return new Date(cloneDate);
            //Holiday Update
        },
        //Update the date to previous working time
        _checkEndDate: function (date, record) {
            if (ej.isNullOrUndefined(date))
                return null;
            var cloneDate = new Date(date), model = this.model, hour = this._getSecondsInDecimal(cloneDate), endRangeIndex = -1;
            if (hour > this._defaultEndTime) {
                this._setTime(this._defaultEndTime, cloneDate);
            //    cloneDate.setHours(this._defaultEndTime, 0, 0, 0);
            } else if (hour <= this._defaultStartTime) {
                cloneDate.setDate(cloneDate.getDate() - 1);
                this._setTime(this._defaultEndTime, cloneDate);
              //  cloneDate.setHours(this._defaultEndTime, 0, 0, 0);
            } else if (hour > this._defaultStartTime && hour < this._defaultEndTime) {
                for (var i = 0; i < this._workingTimeRanges.length; i++) {
                    var val = this._workingTimeRanges[i];
                    if (hour > val.to && (this._workingTimeRanges[i + 1] && hour <= this._workingTimeRanges[i + 1].from)) {
                        this._setTime(this._workingTimeRanges[i].to, cloneDate);
                        //cloneDate.setHours(this._workingTimeRanges[i].to, 0, 0, 0);
                        break;
                    }
                }
            }
            var tempCheckDate;
            do {
                tempCheckDate = new Date(cloneDate);
                if ((!ej.isNullOrUndefined(record) && record.isAutoSchedule && (!model.includeWeekend || model.holidays.length > 0)) || (ej.isNullOrUndefined(record) && (!model.includeWeekend || model.holidays.length > 0))) {

                    //Update Weekend and holidays
                    if (!model.includeWeekend) {
                        var tempDate = new Date(cloneDate);
                        cloneDate = this._getPrevWorkingDay(cloneDate);
                        if (tempDate.getTime() != cloneDate.getTime())
                            this._setTime(this._defaultEndTime, cloneDate);
                    }
                    for (var count = 0; count < model.holidays.length; count++) {
                        var holidayFrom = this._getDateFromFormat(model.holidays[count].day),
                            holidayTo = new Date(holidayFrom),
                            tempHoliDay = new Date(cloneDate);
                        tempHoliDay.setMinutes(cloneDate.getMinutes() - 2);
                        holidayFrom.setHours(0, 0, 0, 0);
                        holidayTo.setHours(23, 59, 59, 59);
                        if (cloneDate.getTime() >= holidayFrom.getTime() && cloneDate.getTime() < holidayTo.getTime() || (tempHoliDay.getTime() >= holidayFrom.getTime() && tempHoliDay.getTime() < holidayTo.getTime())) {
                            cloneDate.setDate(cloneDate.getDate() - 1);
                            if (!(cloneDate.getTime() == holidayFrom.getTime() && this._defaultEndTime == 86400 && this._getSecondsInDecimal(cloneDate) == 0))
                                this._setTime(this._defaultEndTime, cloneDate);
                                //cloneDate.setHours(this._defaultEndTime, 0, 0, 0);
                        }
                    }
                }
            } while (tempCheckDate.getTime() != cloneDate.getTime());
            return new Date(cloneDate);
        },

        _checkBaseLineStartDate: function (date) {
            var cloneDate = new Date(date), model = this.model, hour = this._getSecondsInDecimal(cloneDate), startRangeIndex = -1;
            if (ej.isNullOrUndefined(date)) {
                return "";
            }
            else {
                if (hour < this._defaultStartTime) {
                    this._setTime(this._defaultStartTime, cloneDate);
                } else if (hour >= this._defaultEndTime) {
                    cloneDate.setDate(cloneDate.getDate() + 1);
                    this._setTime(this._defaultStartTime, cloneDate);
                } else if (hour > this._defaultStartTime && hour < this._defaultEndTime) {
                    for (var i = 0; i < this._workingTimeRanges.length; i++) {
                        var val = this._workingTimeRanges[i];
                        if (hour >= val.to && (this._workingTimeRanges[i + 1] && hour < this._workingTimeRanges[i + 1].from)) {
                            this._setTime(this._workingTimeRanges[i + 1].from, cloneDate);
                            break;
                        }
                    }
                }
                return cloneDate;
            }
        },

        _checkBaseLineEndDate: function (date) {
            var cloneDate = new Date(date), model = this.model, hour = this._getSecondsInDecimal(cloneDate), endRangeIndex = -1;
            if (ej.isNullOrUndefined(date)) {
                return "";
            }
            else {
                if (hour > this._defaultEndTime) {
                    this._setTime(this._defaultEndTime, cloneDate);
                    //    cloneDate.setHours(this._defaultEndTime, 0, 0, 0);
                } else if (hour <= this._defaultStartTime) {
                    cloneDate.setDate(cloneDate.getDate() - 1);
                    this._setTime(this._defaultEndTime, cloneDate);
                    //  cloneDate.setHours(this._defaultEndTime, 0, 0, 0);
                } else if (hour > this._defaultStartTime && hour < this._defaultEndTime) {
                    for (var i = 0; i < this._workingTimeRanges.length; i++) {
                        var val = this._workingTimeRanges[i];
                        if (hour > val.to && (this._workingTimeRanges[i + 1] && hour <= this._workingTimeRanges[i + 1].from)) {
                            this._setTime(this._workingTimeRanges[i].to, cloneDate);
                            //cloneDate.setHours(this._workingTimeRanges[i].to, 0, 0, 0);
                            break;
                        }
                    }
                }
                return cloneDate;
            }
        },

        ///* get left value of task */
        //_getTaskTop: function (overlapIndex, record) {
        //    var model = this.model, _marginTop, id, taskIndex, top;
        //    _marginTop = (model.rowHeight - model.taskbarHeight) / 2;
        //    id = record.eResourceTaskType == "resourceChildTask" ? this._getFormattedTaskId(record.parentItem) :
        //        this._getFormattedTaskId(record);
        //    taskIndex = model.ids.indexOf(id);
        //    top = ((taskIndex + 1) * model.rowHeight) + ((overlapIndex - 1) * model.rowHeight) + _marginTop;
        //    return top;
        //},

        /*get left value of task with schedule start*/
        _getTaskLeft: function (currentDate, isMilestone) {
            var date = new Date(currentDate), model = this.model,
                headerType = model.scheduleHeaderSettings.scheduleHeaderType;
            if (headerType == ej.Gantt.ScheduleHeaderType.Week || headerType == ej.Gantt.ScheduleHeaderType.Month
                || headerType == ej.Gantt.ScheduleHeaderType.Year) {
                if (this._getSecondsInDecimal(date) == this._defaultStartTime) {
                    date.setHours(0, 0, 0, 0);
                }
                else if (isMilestone && this._getSecondsInDecimal(date) == this._defaultEndTime) {
                    date.setHours(24);
                }
            }
            if (this._projectStartDate)
                return (((date.getTime() - this._projectStartDate.getTime()) / (1000 * 60 * 60 * 24)) * this._perDayWidth);//this._perMinuteWidth
            else
                return 0;
        },
        /*get width value of task*/
        _getTaskWidth: function (startDate, endDate) {
            var sDate = new Date(startDate), eDate = new Date(endDate), model = this.model,
               headerType = model.scheduleHeaderSettings.scheduleHeaderType;

            if (headerType == ej.Gantt.ScheduleHeaderType.Week || headerType == ej.Gantt.ScheduleHeaderType.Month
                || headerType == ej.Gantt.ScheduleHeaderType.Year) {
                if (this._getSecondsInDecimal(sDate) == this._defaultStartTime) {
                    sDate.setHours(0, 0, 0, 0);
                }
                if (this._getSecondsInDecimal(eDate) == this._defaultEndTime) {
                    eDate.setHours(24);
                }
            }
            var timeDiff = eDate.getTime() - sDate.getTime();

            return ((timeDiff / (1000 * 60 * 60 * 24)) * this._perDayWidth);//per day width
        },
        /*Get holidays betwwen two dates range*/
        _getHolidaysCount: function (startDate, endDate) {
            var proxy = this,
                model = proxy.model,
                holidays = this.model.holidays,
                holidaysCount = 0;
            for (var i = 0; i < holidays.length; i++) {
                var currentHoliday = this._getDateFromFormat(holidays[i].day);
                if (startDate.getTime() < currentHoliday.getTime() && endDate.getTime() >= currentHoliday.getTime())
                    if (!model.includeWeekend && proxy._nonWorkingDayIndex.indexOf(currentHoliday.getDay())==-1)
                        holidaysCount += 1;
                    else if (model.includeWeekend) {
                        holidaysCount += 1;
                    }
            }
            return holidaysCount;
        },

        //get weekend days between two dates without including args dates
        _getWeekendCount: function (startDate, endDate) {
            var sDay = new Date(startDate), eDay = new Date(endDate), weekEndCount = 0,
                proxy = this;
            sDay.setHours(0, 0, 0, 0);
            sDay.setDate(sDay.getDate() + 1);
            eDay.setHours(0, 0, 0, 0);
            while (sDay.getTime() < eDay.getTime()) {
                if (proxy._nonWorkingDayIndex.indexOf(sDay.getDay()) != -1)
                    weekEndCount += 1;
                sDay.setDate(sDay.getDate() + 1);
            }
            return weekEndCount;
        },
        /*get days between two dates*/
        _getDayDiff: function (startDate, endDate) {
            return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        },
        //Get seconds between two Dates
        _getNumberOfSeconds: function (startDate, endDate, isCheckTimeZone) {
            var sDay = new Date(startDate), eDay = new Date(endDate), weekEndCount = 0, timeDiff = 0;
            sDay.setDate(sDay.getDate() + 1);
            sDay.setHours(0, 0, 0, 0);
            eDay.setHours(0, 0, 0, 0);
            if (sDay.getTime() < eDay.getTime())
                timeDiff = (this._getTimeDiff(sDay, eDay, isCheckTimeZone)) / 1000;
            if (timeDiff % 86400 !== 0)
                timeDiff = timeDiff - (timeDiff % 86400) + 86400;
            return timeDiff;
        },
        //Calculate end date with startDate,duration ,duration Unit
        _getEndDate: function (startDate, duration, durationUnit, record, validateAsMilestone) {
            var secondDuration = 0, sHour = -1, nextAvailDuration = 0, endDate = new Date(startDate), startRangeIndex = -1;
            if (!durationUnit || durationUnit == ej.Gantt.DurationUnit.Day)
                secondDuration = this._secondsPerDay * duration;
            else if (durationUnit == ej.Gantt.DurationUnit.Hour)
                secondDuration = duration * 3600;
            else
                secondDuration = duration * 60;

            while (secondDuration > 0) {
                sHour = this._getSecondsInDecimal(endDate);
                for (var i = 0; i < this._workingTimeRanges.length; i++) {
                    var val = this._workingTimeRanges[i];
                    if (sHour >= val.from && sHour <= val.to) {
                        startRangeIndex = i;
                        break;
                    }
                }
                nextAvailDuration = Math.round(this._workingTimeRanges[startRangeIndex].to - sHour);
                if (nextAvailDuration == 0 && startRangeIndex < this._workingTimeRanges.length - 1) {
                    nextAvailDuration = Math.round(this._workingTimeRanges[startRangeIndex+1].to - sHour);
                }
                if (nextAvailDuration <= secondDuration) {
                    endDate.setSeconds(endDate.getSeconds() + nextAvailDuration);
                    secondDuration -= nextAvailDuration;
                } else {
                    endDate.setSeconds(endDate.getSeconds() + secondDuration);
                    break;
                }
                if (secondDuration > 0)
                    endDate = this._checkStartDate(endDate, record, validateAsMilestone);
            }
            return endDate;
        },
        //Calculate start date with endDate,duration ,duration Unit
        _getStartDate: function (endDate, duration, durationUnit, record) {
            var minuteDuraion = 0, sHour = -1, nextAvailDuration = 0, startDate = new Date(endDate), startRangeIndex = -1;
            if (!durationUnit || durationUnit == ej.Gantt.DurationUnit.Day)
                minuteDuraion = this._secondsPerDay * duration;
            else if (durationUnit == ej.Gantt.DurationUnit.Hour)
                minuteDuraion = duration * 3600;
            else
                minuteDuraion = duration * 60;

            while (minuteDuraion > 0) {
                sHour = this._getSecondsInDecimal(startDate);
                if (this._workingTimeRanges.length > 0 && this._workingTimeRanges[this._workingTimeRanges.length - 1].to == 86400 && sHour == 0) {
                    sHour = 86400;
                }
                for (var i = 0; i < this._workingTimeRanges.length; i++) {
                    var val = this._workingTimeRanges[i];
                    if (sHour >= val.from && sHour <= val.to) {
                        startRangeIndex = i;
                        break;
                    }
                }
                nextAvailDuration = Math.round(sHour - this._workingTimeRanges[startRangeIndex].from);//In Minutes
                if (nextAvailDuration <= minuteDuraion) {
                    startDate.setSeconds(startDate.getSeconds() - nextAvailDuration);
                    minuteDuraion -= nextAvailDuration;
                } else {
                    startDate.setSeconds(startDate.getSeconds() - minuteDuraion);
                    break;
                }
                if (minuteDuraion > 0)
                    startDate = this._checkEndDate(startDate, record);
            }
            return startDate;
        },

        /*Adjust date values with day light saving time changes*/
        _updateDateWithTimeZone: function (sDate, eDate) {
            var sTZ = sDate.getTimezoneOffset(),
                eTZ = eDate.getTimezoneOffset(),
                uDate, uTZ;
            if (sTZ != eTZ) {
                var standaredTZ = new Date(new Date().getFullYear(), 0, 1).getTimezoneOffset();
                if (standaredTZ != sTZ) {
                    uDate = sDate;
                    uTZ = sTZ;
                }
                else if (standaredTZ != eTZ) {
                    uDate = eDate;
                    uTZ = eTZ;
                }
                if (standaredTZ < 0) {
                    var tzDiff = standaredTZ - uTZ;
                    uDate.setTime(uDate.getTime() + (tzDiff * 60 * 1000));
                } else if (standaredTZ > 0) {
                    var tzDiff = uTZ - standaredTZ;
                    uDate.setTime(uDate.getTime() - (tzDiff * 60 * 1000));
                }
            }
        },

        _getTimeDiff: function (sDate, eDate, isCheckTimeZone) {
            var sDate = new Date(sDate), eDate = new Date(eDate);
            isCheckTimeZone && this._updateDateWithTimeZone(sDate, eDate);
            return eDate.getTime() - sDate.getTime();
        },

        /*get duration between two dates according to duration unit value*/
        _getDuration: function (sDate, eDate, durationUnit, isAutoSchedule, isCheckTimeZone) {
            if (ej.isNullOrUndefined(sDate) || ej.isNullOrUndefined(eDate))
                return null;
            isCheckTimeZone = ej.isNullOrUndefined(isCheckTimeZone) ? true : isCheckTimeZone;
            var timeDiff = this._getTimeDiff(sDate, eDate, isCheckTimeZone), durationValue,
               weekendCount = !this.model.includeWeekend && isAutoSchedule ? this._getWeekendCount(sDate, eDate) : 0,
               nonWrkHours = 0, durationHrs = 0, totalHours = this._getNumberOfSeconds(sDate, eDate, isCheckTimeZone),
               holidaysCount = isAutoSchedule ? this._getHolidaysCount(sDate, eDate) : 0;
            timeDiff = timeDiff / 1000;
            totalHours = (totalHours - (weekendCount * 86400) - (holidaysCount * 86400)) / 86400; // days between two dates
            nonWrkHours = this._getNonWorkingSecondsOnDate(sDate, eDate);
            durationHrs = timeDiff - (totalHours * (86400 - this._secondsPerDay)) - (weekendCount * 86400) - (holidaysCount * 86400) - nonWrkHours;
            if (!durationUnit || durationUnit == ej.Gantt.DurationUnit.Day) {
                durationValue = durationHrs / this._secondsPerDay;
            } else if (durationUnit == ej.Gantt.DurationUnit.Minute) {
                durationValue = durationHrs / 60;
            } else {
                durationValue = durationHrs / 3600;
            }
            return parseFloat(durationValue);
        },
        /*Get four infomration in date*/
        _getSecondsInDecimal: function (date) {
            return (date.getHours() * 60 * 60) + (date.getMinutes() * 60) + date.getSeconds() + (date.getMilliseconds() / 1000);
        },
        /*get non working hours betwwen two dates*/
        _getNonWorkingSecondsOnDate: function (startDate, endDate) {

            var proxy = this, sHour = this._getSecondsInDecimal(startDate), eHour = this._getSecondsInDecimal(endDate), startRangeIndex = -1, endRangeIndex = -1, totNonWrkSecs = 0;
            for (var i = 0; i < this._workingTimeRanges.length; i++) {
                var val = this._workingTimeRanges[i];
                if (sHour >= val.from && sHour <= val.to)
                    startRangeIndex = i;
                if (eHour >= val.from && eHour <= val.to)
                    endRangeIndex = i;
            }
            if (startDate.getDate() != endDate.getDate() || startDate.getMonth() != endDate.getMonth() || startDate.getFullYear() != endDate.getFullYear()) {
                totNonWrkSecs = proxy._nonWorkingHours[proxy._nonWorkingHours.length - 1 - startRangeIndex] + 86400 - proxy._defaultEndTime;
                totNonWrkSecs += endRangeIndex == -1 ? 0 : (proxy._nonWorkingHours[endRangeIndex] + proxy._defaultStartTime);
            }
            else {
                if (startRangeIndex != endRangeIndex) {
                    totNonWrkSecs = endRangeIndex == -1 ? 0 : (proxy._nonWorkingHours[endRangeIndex] - proxy._nonWorkingHours[startRangeIndex]);
                }
            }
            return totNonWrkSecs;
        },
        /*Get working hours between work time range value*/
        _getSecondsPerDay: function () {
            var tempDay = "01/01/2016", tempEndDay = "01/02/2016", proxy = this, model = this.model,
                length = model.dayWorkingTime.length, totalSeconds = 0;//MM/dd/yyyy
            for (var count = 0; count < length; count++) {
                var currentRange = model.dayWorkingTime[count];
                if (currentRange.from && currentRange.to) {

                    var startHour = ej.parseDate(tempDay + " " + currentRange.from, "MM/dd/yyyy h:mm tt", "en-US"),
                        endHour = currentRange.to != "12:00 AM" ? ej.parseDate(tempDay + " " + currentRange.to, "MM/dd/yyyy h:mm tt", "en-US") : ej.parseDate(tempEndDay + " " + currentRange.to, "MM/dd/yyyy h:mm tt", "en-US"),
                        timeDiff = endHour.getTime() - startHour.getTime(),
                        sdHour = this._getSecondsInDecimal(startHour),
                        edHour = this._getSecondsInDecimal(endHour);
                    if (edHour == 0)
                        edHour = 86400; // second in a day
                    totalSeconds += timeDiff / 1000;
                    if (count == 0)
                        proxy._defaultStartTime = sdHour;
                    if (count == length - 1)
                        proxy._defaultEndTime = edHour;
                    if (count > 0){
                        proxy._nonWorkingHours.push(proxy._nonWorkingHours[proxy._nonWorkingHours.length - 1] + sdHour - proxy._workingTimeRanges[count - 1].to);
                        if (proxy._workingTimeRanges[count - 1].to < sdHour)
                            proxy._nonWorkingTimeRanges.push({ from: proxy._workingTimeRanges[count - 1].to / 3600, to: sdHour / 3600, isWorking: false });
                    }
                    else{
                        proxy._nonWorkingHours.push(0); 
                        proxy._nonWorkingTimeRanges.push({ from: 0, to: sdHour / 3600 , isWorking:false });
                    }
                    proxy._workingTimeRanges.push({ from: sdHour, to: edHour });
                    proxy._nonWorkingTimeRanges.push({ from: sdHour/3600, to: edHour / 3600, isWorking: true ,color: currentRange.background  });
                }
            }
            if (proxy._defaultEndTime / 3600 != 24)
                proxy._nonWorkingTimeRanges.push({ from: proxy._defaultEndTime / 3600, to: 24, isWorking: false });
            return totalSeconds;
        },

        _updateColumnLocaleText: function () {
            var model = this.model,
                columns = model.columns;
            if (columns && columns.length > 0) {
                for (var count = 0; count < columns.length; count++) {
                    if (columns[count].field && this._columnHeaderTexts[columns[count].field]) {
                        columns[count].headerText = this._columnHeaderTexts[columns[count].field];
                    }
                }
            }
        },
        //calculate height and width for gantt at load time
        _calculateDimensions: function ()
        {
            var proxy = this,
                sizeSettings = this.model.sizeSettings,
                sizeSettingHeight = sizeSettings.height,
                sizeSettingsWidth = sizeSettings.width,
                element = proxy.element,
                elementStyleHeight = element[0].style.height,
                elementStyleWidth = element[0].style.width,
                parentHeight = element.parent().height(),
                parentWidth = element.parent().width();

            if (sizeSettingsWidth)
                element.css("width", sizeSettingsWidth);

            if (sizeSettingHeight)
                element.css("height", sizeSettingHeight);

            /* check given value and assign default value for width and height */
            if (!sizeSettingHeight && !elementStyleHeight) {
                elementStyleHeight = "450px";
                element.css("height", "450px");
            }

            if (!sizeSettingsWidth && !elementStyleWidth) {
                elementStyleWidth = "100%";
                proxy.element.css("width", "100%");
            }
            proxy._ganttHeight = element.height();
            proxy._ganttWidth = element.width();

            if (proxy._ganttHeight === 0) {
                proxy._ganttHeight = 450;
                element.css("450px");
            }
        },
        _setCultureInfo:function() {
            var proxy = this,
               model = proxy.model,
               culture = model.locale,
               localization = $.extend({}, proxy._localizedLabels, 
                ej.isNullOrUndefined(ej.cultures[culture]) ? ej.cultures["default"] : ej.cultures[culture]),
               defaultLocalization = $.extend({}, ej.cultures["default"], ej.Gantt.Locale["default"]);
            model.dateFormat = !model.dateFormat ? ((localization && localization["calendars"] &&
                    localization["calendars"]["standard"]["patterns"]) ?
                (localization["calendars"]["standard"]["patterns"]["d"]) :
                ej.preferredCulture(culture) ? ej.preferredCulture(culture)["calendars"]["standard"]["patterns"]["d"] :
                    defaultLocalization["calendars"]["standard"]["patterns"]["d"]) : model.dateFormat;

            
            //EmptyRecord text to be displayed with dataSource is null
            proxy._emptyRecordText = (localization && localization["emptyRecord"]) ?
                localization["emptyRecord"] : defaultLocalization["emptyRecord"];
            
            proxy._unassignedText = (localization && localization["unassignedTask"]) ?
                localization["unassignedTask"] : defaultLocalization["unassignedTask"];

            //ColumnHeaderText to be displayed in treegrid
            proxy._columnHeaderTexts = ( localization && localization["columnHeaderTexts"] ) ?
                localization["columnHeaderTexts"] : defaultLocalization["columnHeaderTexts"];
            
            proxy._columnHeaderTexts = $.extend({}, defaultLocalization["columnHeaderTexts"], proxy._columnHeaderTexts);
            proxy._columnHeaderTexts["eResourceName"] = proxy._columnHeaderTexts["resourceName"];

            //taskModeDropDownValue to be displayed in treegrid
            proxy._taskModeTexts = (localization && localization["taskModeTexts"]) ?
                localization["taskModeTexts"] : defaultLocalization["taskModeTexts"];

            proxy._taskModeTexts = $.extend({}, defaultLocalization["taskModeTexts"], proxy._taskModeTexts);

            //EditDialog Text to be displayed in popup window
            proxy._editDialogTexts = (localization && localization["editDialogTexts"]) ?
                localization["editDialogTexts"] : defaultLocalization["editDialogTexts"];

            proxy._editDialogTexts = $.extend({}, defaultLocalization["editDialogTexts"], proxy._editDialogTexts);

            //Add Column Dialog Text to be displayed in popup window
            proxy._columnDialogTexts = (localization && localization["columnDialogTexts"]) ?
                localization["columnDialogTexts"] : defaultLocalization["columnDialogTexts"];

            //Tooltip Text to be displayed in the Toolbar
            proxy._toolboxTooltipTexts = (localization && localization["toolboxTooltipTexts"]) ?
                localization["toolboxTooltipTexts"] :
                defaultLocalization["toolboxTooltipTexts"];

            proxy._toolboxTooltipTexts = $.extend({}, defaultLocalization["toolboxTooltipTexts"], proxy._toolboxTooltipTexts);
            //Tooltip Text to be displayed on the Taskbar for duration units
            proxy._durationUnitTexts = (localization && localization["durationUnitTexts"]) ?
                localization["durationUnitTexts"] : defaultLocalization["durationUnitTexts"];

            proxy._durationUnitTexts = $.extend({}, defaultLocalization["durationUnitTexts"], proxy._durationUnitTexts);

            //Tooltip Text to be displayed on the Taskbar for duration units
            proxy._durationUnitEditText = (localization && localization["durationUnitEditText"]) ?
                localization["durationUnitEditText"] : defaultLocalization["durationUnitEditText"];

            proxy._durationUnitEditText = $.extend({}, defaultLocalization["durationUnitEditText"], proxy._durationUnitEditText);


            //Unit text to display in Work field.
            proxy._workUnitTexts = (localization && localization["workUnitTexts"]) ?
                localization["workUnitTexts"] : defaultLocalization["workUnitTexts"];
            
            proxy._workUnitTexts = $.extend({}, defaultLocalization["workUnitTexts"], proxy._workUnitTexts);
            
            //Text to be displayed in type drop down.
            proxy._taskTypeTexts = (localization && localization["taskTypeTexts"]) ?
                localization["taskTypeTexts"] : defaultLocalization["taskTypeTexts"];
            
            proxy._taskTypeTexts = $.extend({}, defaultLocalization["taskTypeTexts"], proxy._taskTypeTexts);
            
            //Text to be displayed in default type drop down.
            proxy._effortDrivenTexts = (localization && localization["effortDrivenTexts"]) ?
                localization["effortDrivenTexts"] : defaultLocalization["effortDrivenTexts"];
            
            proxy._effortDrivenTexts = $.extend({}, defaultLocalization["effortDrivenTexts"], proxy._effortDrivenTexts);

            //Context Menu Text
            proxy._contextMenuTexts = (localization && localization["contextMenuTexts"]) ?
                localization["contextMenuTexts"] : defaultLocalization["contextMenuTexts"];

            proxy._contextMenuTexts = $.extend({}, defaultLocalization["contextMenuTexts"], proxy._contextMenuTexts);
            //Name for New Task while adding
            proxy._newTaskTexts = (localization && localization["newTaskTexts"]) ?
                localization["newTaskTexts"] : defaultLocalization["newTaskTexts"];
            
            //Month names to be displayed in schedule
            proxy._months = (localization && localization["calendars"]) ?
                localization["calendars"]["standard"]["months"]["namesAbbr"] :
                ej.preferredCulture(culture) ? ej.preferredCulture(culture)["calendars"]["standard"]["months"]["namesAbbr"] :
                defaultLocalization["calendars"]["standard"]["months"]["namesAbbr"];
            
            //Day names to displayed in schedule
            proxy._days = (localization && localization["calendars"]) ?
                localization["calendars"]["standard"]["months"]["namesAbbr"] :
                ej.preferredCulture(culture) ? ej.preferredCulture(culture)["calendars"]["standard"]["days"]["namesAbbr"] :
                defaultLocalization["calendars"]["standard"]["days"]["namesAbbr"];

            //Column Menu Text
            proxy._columnMenuTexts = (localization && localization["columnMenuTexts"]) ?
                localization["columnMenuTexts"] : defaultLocalization["columnMenuTexts"];

            proxy._columnMenuTexts = $.extend({}, defaultLocalization["contextMenuTexts"], proxy._columnMenuTexts);

            //Column dialog title Text 
            proxy._columnDialogTitle = (localization && localization["columnDialogTitle"]) ?
                localization["columnDialogTitle"] : defaultLocalization["columnDialogTitle"];


            //Deleting the column texts 
            proxy._deleteColumnText = (localization && localization["deleteColumnText"]) ?
                localization["deleteColumnText"] : defaultLocalization["deleteColumnText"];

            proxy._okButtonText = (localization && localization["okButtonText"]) ?
                localization["okButtonText"] : defaultLocalization["okButtonText"];

            proxy._cancelButtonText = (localization && localization["cancelButtonText"]) ?
                localization["cancelButtonText"] : defaultLocalization["cancelButtonText"];

            proxy._confirmDeleteText = (localization && localization["confirmDeleteText"]) ?
                    localization["confirmDeleteText"] : defaultLocalization["confirmDeleteText"];

            //Predecssor Editing Text
            proxy._predecessorEditingTexts = localization && localization["predecessorEditingTexts"] ?
                localization["predecessorEditingTexts"] : defaultLocalization["predecessorEditingTexts"];

            proxy._predecessorEditingTexts = $.extend({}, defaultLocalization["contextMenuTexts"], proxy._predecessorEditingTexts);


            proxy._alertTexts = localization && localization["alertTexts"] ?
                localization["alertTexts"] : defaultLocalization["alertTexts"];

            proxy._alertTexts = $.extend({}, defaultLocalization["alertTexts"], proxy._alertTexts);
            
            //TabDialogText to be displayed in Gantt add and edit dialog
            proxy._dialogTabTitleTexts = (localization && localization["dialogTabTitleTexts"]) ?
                localization["dialogTabTitleTexts"] : defaultLocalization["dialogTabTitleTexts"];

            proxy._dialogTabTitleTexts = $.extend({}, defaultLocalization["dialogTabTitleTexts"], proxy._dialogTabTitleTexts);

            proxy._predecessorCollectionText = localization && localization["predecessorCollectionText"] ?
                localization["predecessorCollectionText"] : defaultLocalization["predecessorCollectionText"];

            //Edit type text
            proxy._editTypeText = (localization && localization["editTypeTexts"]) ?
                localization["editTypeTexts"] : defaultLocalization["editTypeTexts"];

            //Edit types text
            proxy._textAlignTypeText = (localization && localization["textAlignTypes"]) ?
                localization["textAlignTypes"] : defaultLocalization["textAlignTypes"];

            //Clip mode types text
            proxy._clipModeText = (localization && localization["clipModeTexts"]) ?
                localization["clipModeTexts"] : defaultLocalization["clipModeTexts"];

            //Validation rule dialog texts
            proxy._validationRuleText = (localization && localization["linkValidationRuleText"]) ?
                localization["linkValidationRuleText"] : defaultLocalization["linkValidationRuleText"];
            proxy._validationDialogTitle = (localization && localization["linkValidationDialogTitle"]) ?
                localization["linkValidationDialogTitle"] : defaultLocalization["linkValidationDialogTitle"];
            //Column dialog title Text 
            proxy._validationRuleOptions = (localization && localization["linkValidationRuleOptions"]) ?
                localization["linkValidationRuleOptions"] : defaultLocalization["linkValidationRuleOptions"];
            // Connector Line tooltip text
            proxy._connectorLineDialogText = (localization && localization["connectorLineDialogText"]) ?
                localization["connectorLineDialogText"] : defaultLocalization["connectorLineDialogText"];
            // Null value text
            proxy._nullText = (localization && localization["nullText"]) ? localization["nullText"] : defaultLocalization["nullText"];
        },

        //Populate available fields
        _getMappingItems: function () {
            var proxy = this,
                model = proxy.model,
                mappingItems = [],
                columns = (model.viewType == ej.Gantt.ViewType.ProjectView) ? proxy._columns : proxy._resourceViewColumns,
                length = columns.length;

            for (var i = 0; i < length; i++) {
                mappingItems.push(columns[i].mappingName);
            }
            return mappingItems;
        },

        //populate the context menu with items
        _getContextMenuItems: function () {
            var contextMenuItems = [],
                proxy = this,
                contextMenuLabel = this._contextMenuTexts;

            contextMenuItems = [{
                headerText: contextMenuLabel["taskDetailsText"],
                eventHandler: null,
                isDefault: true,
                menuId: "Task",

            }, {
                headerText: contextMenuLabel["addNewTaskText"],
                eventHandler: null,
                isDefault: true,
                menuId: "Add"
            },
             {
                headerText: contextMenuLabel["indentText"],
                eventHandler: null,
                isDefault: true,
                menuId: "Indent"
            }, {
                headerText: contextMenuLabel["outdentText"],
                eventHandler: null,
                isDefault: true,
                menuId: "Outdent"
            }, {
                headerText: contextMenuLabel["deleteText"],
                eventHandler: null,
                isDefault: true,
                menuId: "Delete"
            },
            {
                iconPath: null,
                headerText: contextMenuLabel["aboveText"],
                eventHandler: null,
                menuId: "Above",
                parentMenuId: "Add"
            }, {
                iconPath: null,
                headerText: contextMenuLabel["belowText"],
                eventHandler: null,
                menuId: "Below",
                parentMenuId: "Add"
            }
           ];
            return contextMenuItems;
        },

        //rendering is initiated here
        _initialize: function () {

            if (this._isFromSetModel)
                return;
            else {
                var proxy = this, model = proxy.model;
                model.cssClass && (proxy.element.addClass(model.cssClass));
                proxy._$treegridPane = ej.buildTag('div.e-treegridPane');
                proxy._$ganttchartPane = ej.buildTag('div.e-ganttchartPane');
                proxy._$ejGantt = ej.buildTag('div.e-gantt-Spliter#e-ejSpliter' + proxy._id, "", {}, { 'data-unselectable': "on" });
                model.predecessorMapping && proxy._updatePredecessors();
                proxy._render();
                model.updatedRecords = model.flatRecords.slice();
                model.currentViewData = model.flatRecords.slice();
                model.predecessorMapping && model.enablePredecessorValidation && proxy._updatedRecordsDateByPredecessor();
                proxy._calculateScheduleDates();
                proxy._calculateHeaderDates();
                proxy._updateGanttRecords();
                proxy._checkDataManagerUpdate();
                if (model.filterSettings && model.filterSettings.filteredColumns.length > 0) {
                    var filterColumns=model.filterSettings.filteredColumns;
                    for (var i = 0; i < filterColumns.length; i++) {
                        var mappingName = filterColumns[i].field,
                            column = ej.TreeGrid.getColumnByMappingName(proxy._columns, mappingName); //this.getColumnByField(mappingName);
                        if (column != null) {
                            if (mappingName == model.resourceInfoMapping)
                                mappingName = "resourceNames";
                            else if (mappingName == model.predecessorMapping)
                                mappingName = "predecessorsName";
                            else
                                mappingName = column.field;
                        }
                        filterColumns[i].field = mappingName;
                    }
                }
                if (!ej.isNullOrUndefined(this.isProjectViewData)) {
                    model.viewType = ej.Gantt.ViewType.HistogramView;
                    this._checkHistoGramDataBinding();
                }
                proxy._renderTreeGrid();
                model.updatedRecords = proxy.getUpdatedRecords();
                model.currentViewData = proxy.getCurrentViewData();
                proxy._renderGanttChart();
                proxy._enableCreateCollection = true;
                proxy._isValidationEnabled = false;          //no validation require here
                proxy._isLoad = false;
                if(model.viewType == "projectView" && model.predecessorMapping)
                    proxy._createConnectorLinesCollection();//connectorline oboject creates here
                proxy._isValidationEnabled = true;//reassign this value
                proxy._$treegridPane.css({ 'overflow': 'hidden' });
                //Dialog templates Rendering initiated
                proxy._initiateDialogTemplates();
                if (model.predecessorMapping && model.enablePredecessorValidation) 
                    proxy._validationDialogTemplate(); // To render predecessor link validation dialog 
                proxy._isTreeGridRendered = true;
                proxy._isGanttChartRendered = true;
                proxy._gridRows = proxy.getRows();
                proxy._ganttChartRows = proxy.getGanttChartRows();
                proxy._createContextMenuTemplate();
                proxy._wireEvents();
                proxy._updateScrollerBorder();
                proxy._initialEndRendering();
                proxy._getLocalizedLabels();
                if (model.viewType == ej.Gantt.ViewType.HistogramView)
                    proxy._$ganttchartHelper.ejGanttChart("instance")._isCalendarExist = null;
            }
        },

        _getLocalizedLabels:function(){
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        },

        //apply row Selection and enable collapse all while loading
        _initialEndRendering:function()
        {
            var proxy = this,
                model = this.model;

            //Call collapse All
            if (model.enableCollapseAll) {
                if (this.selectedRowIndex() != -1) {
                    proxy._deSelectRowItem();
                }
                proxy._collapseAll();
            }           
            else if (model.expandStateMapping) {
                proxy._collapseRecordOnLoad();
            }

            //Select item by selected row index
            if (proxy.selectedRowIndex() >= 0 && proxy.selectedRowIndex() < proxy.model.updatedRecords.length && model.selectionMode == "row") {
                var rowSelectingArgs = {};
                rowSelectingArgs.recordIndex = proxy.selectedRowIndex();
                rowSelectingArgs.previousIndex = model.selectedItem ? model.updatedRecords.indexOf(model.selectedItem) : -1;
                if (proxy.rowSelecting(rowSelectingArgs)) {
                    proxy.selectRows(proxy.selectedRowIndex());
                    proxy._$treegridHelper.ejTreeGrid('setFocusOnTreeGridElement');
                }
            }
            //Update datamanger value to TreeGrid model
            var treeGridObj = proxy._$treegridHelper.ejTreeGrid("instance");
            treeGridObj._jsonData = treeGridObj.model.dataManagerUpdate.jsonData = proxy._jsonData;
        },

        //Check if data manager is updatable
        _checkDataManagerUpdate: function ()
        {
            var proxy = this,
                dataSource =this.dataSource();
            proxy._isDataManagerUpdate = false;
            proxy._jsonData = null;

            if (dataSource instanceof ej.DataManager) {
                if (dataSource.dataSource.offline && dataSource.dataSource.json) {
                    proxy._isDataManagerUpdate = true;
                    proxy._jsonData = dataSource.dataSource.json;
                }
                else if (!dataSource.dataSource.offline) {
                    proxy._isDataManagerUpdate = true;
                    proxy._jsonData = proxy._retrivedData;
                }
            }
        },
        //Render add,edit dialog templates
        _initiateDialogTemplates:function()
        {
            var proxy = this, model = this.model;

            proxy.customColumnFields();
            if (model.editSettings.allowEditing || model.editSettings.editMode == "normal" || model.editSettings.editMode == "dialogTemplate") {
                proxy.editDialogTemplate();
                if ($("#" + this._id + "_dialogEdit").length === 0)
                    proxy.element.append(proxy._renderDialog());
            }
            if (model.editSettings.allowAdding) {
                proxy.addDialogTemplate();
                if ($("#" + this._id + "_dialogAdd").length === 0) {
                    var $dialog = ej.buildTag("div.e-dialog e-dialog-content e-shadow e-widget-content", "", { display: "none", "overflow-x": "hidden" }, { id: this._id + "_dialogAdd" });
                    proxy.element.append($dialog);
                }
            }
        },

        //Toolbar,Gantt and treegrid parts are rendered and templates for add and edit dialog are created
        _render: function () {
            var proxy = this, element = proxy.element, model = proxy.model;
            if (proxy.model.toolbarSettings.showToolbar) {
                element.append(proxy._renderToolBar());
            }
            proxy._ganttHeight = parseInt(proxy._ganttHeight) - proxy._getToolBarHeight() - proxy._totalBorderHeight;
            proxy._$treegridHelper = ej.buildTag("div.ejTreeGrid#ejTreeGrid" + proxy._id, "", { "height": proxy._ganttHeight }, {});
            proxy._$ganttchartHelper = ej.buildTag("div.ejGanttChart#ejGanttChart" + proxy._id, "", { "height": proxy._ganttHeight }, {});
            proxy._$ganttchartPane.append(proxy._$ganttchartHelper);
            proxy._$treegridPane.append(proxy._$treegridHelper);
            proxy._$ejGantt.append(proxy._$treegridPane);
            proxy._$ejGantt.append(proxy._$ganttchartPane);    
            
            element.append(proxy._$ejGantt);
            proxy._renderGantt();
        },

        //Return dialog tag
        _renderDialog: function () {
            var $dialog = ej.buildTag("div.e-dialog e-dialog-content e-shadow e-widget-content", "", { display: "none", "overflow-x":"hidden" }, { id: this._id + "_dialogEdit" });
            return $dialog;
        },
        //Create Template for edit dialog
        editDialogTemplate: function () {

            var proxy = this,
                model = proxy.model,
                columns = (model.viewType == ej.Gantt.ViewType.ProjectView) ? $.extend([], proxy._columns) : $.extend([], proxy._resourceViewColumns),
                ganttColumns = (model.viewType == ej.Gantt.ViewType.ProjectView) ?  proxy._columns :  proxy._resourceViewColumns,
                length = columns.length,
                emptyDataColumns = [], column, predecessorColoumnIndex = -1, resourceColumnIndex = -1,
                treeGridObj = proxy._$treegridHelper.data("ejTreeGrid"),
                columnIndex,
                dialogTab = proxy._dialogTab,
                tabLength = dialogTab.length;
            proxy._editDialogGeneralColumns = [];
            proxy._editDialogCustomColumns = [];
            proxy._generalTabColumnFields = ["taskId", "taskMode", "taskName", "startDate", "endDate", "duration", "resourceInfo", "status", "work", "taskType", "effortDriven", "baselineStartDate", "baselineEndDate", "predecessor", "WBS", "notesText", "serialNumber", "serialNumberPredecessor"];
            proxy._mappingItems = proxy._getMappingItems();

            if (length == 0)
                return;

            if (model.editDialogFields.length > 0) {
                var filteredColumns = [];
                var count = 0, resultColumn;
                for (; count < model.editDialogFields.length; count++) {
                    resultColumn = $.grep(ganttColumns, function (val) {
                        return val.mappingName === model.editDialogFields[count].field;
                    });
                    if (resultColumn.length > 0) {
                        filteredColumns.push(resultColumn[0]);
                        if (proxy._generalTabColumnFields.indexOf(resultColumn[0].mappingName) == -1 && model.editDialogFields[count].displayInGeneralTab)
                            proxy._generalTabColumnFields.push(resultColumn[0].mappingName);
                    }
                }
                columns = filteredColumns;                
            }
            else {
                //To hide the WBS predecessor field
                if (model.enableWBS) {
                    var finalColumns;
                    if (model.enableWBSPredecessor) {
                        finalColumns = columns.filter(function (col) {
                            return col.mappingName != "WBSPredecessor";
                        });
                    }
                    if (finalColumns && finalColumns.length)
                        columns = finalColumns;
                }
            }
            var index = $.map(columns, function (column, index) {
                if (column.mappingName == model.taskNameMapping) {
                    return index;
                }
            });
            if ((index[0] + 1) % 3 == 0) {
                columns.splice(index[0] - 1, 0, columns.splice(index[0], 1)[0]);
            }
            length = columns.length;
            for (var i = 0; i < length; i++) {
                if ($.inArray(columns[i].mappingName, proxy._mappingItems) != -1) {
                    if (!model.resourceInfoMapping && (columns[i].field == "work" || columns[i].field == "taskType" || columns[i].field == "effortDriven"))
                        continue;
                    if (columns[i].mappingName !== model.predecessorMapping && columns[i].mappingName != model.resourceInfoMapping && columns[i].mappingName != model.notesMapping && columns[i].mappingName != "serialNumberPredecessor") {
                        if (model.enableSerialNumber && columns[i].field == "taskId")
                            continue;                        
                        var index = $.map(proxy._generalTabColumnFields, function (field, index) {
                            if (field == columns[i].field) {
                                return index;
                            }
                        });
                        if (index.length > 0) {
                            proxy._editDialogGeneralColumns.push(columns[i]);
                        }
                        else {
                            proxy._editDialogCustomColumns.push(columns[i]);
                        }
                    }
                    else {
                        if (columns[i].mappingName !== model.baselineStartDateMapping && columns[i].mappingName !== model.baselineEndDateMapping) {
                            if (columns[i].mappingName == model.resourceInfoMapping)
                                resourceColumnIndex = i;
                            else if (columns[i].mappingName == model.predecessorMapping || columns[i].mappingName == "serialNumberPredecessor")
                                predecessorColoumnIndex = i;
                        }
                    }
                }
            }
            var $tbody = ej.buildTag('div', "", {}, {}),
                $tab = ej.buildTag('div', "", {}, { id: proxy._id + "EditTab" }),
                $ul = ej.buildTag('ul', "", {}, {}),
                $inTr, $inTd, $inTr2, $inTd2, $preDiv;
            $tab.append($ul);
            $tbody.append($tab);
            for (var tabIndex = 0; tabIndex < tabLength; tabIndex++) {
                switch (dialogTab[tabIndex]) {
                    //General Tab
                    case "General":
                        if (proxy._editDialogGeneralColumns.length > 0) {
                            $ul.append("<li><a href='#" + proxy._id + "EditGeneral'>" + proxy._dialogTabTitleTexts["generalTabText"] + "</a></li>");
                            var $general = ej.buildTag('div.e-gantt-editor-container', "", {}, { id: proxy._id + "EditGeneral" }),
                                $genearlForm = ej.buildTag('form', "", { 'height': 'auto', 'width': 'auto', 'font-size': '14px' }, { id: proxy._id + "GeneralEditForm" });
                            $general.append($genearlForm);
                            $tab.append($general);
                            // var $form = ej.buildTag('form', "", { 'height': 'auto', 'width': 'auto', 'font-size': '14px' }, { id: proxy._id + "EditForm" });
                            var $genearlTable = ej.buildTag('table.e-general-edit-div', "", { "border-spacing": "2px", "border-collapse": "separate", "margin-top": "0px" }, {}),
                            $tr = ej.buildTag('tr'), $td;
                            var columnCount = 0,
                                generalColumns = proxy._editDialogGeneralColumns,
                                length = generalColumns.length;
                            for (var i = 0; i < length; i++) {
                                if (columnCount < 3) {
                                    if (generalColumns[i].mappingName !== model.taskNameMapping) {
                                        columnCount++;
                                        $td = ej.buildTag('td.e-property-container', "", {}, {});
                                    }
                                    else {
                                        columnCount += 2;
                                        $td = ej.buildTag('td.e-property-container', "", {}, { "colspan": "2" });
                                    }
                                    var $innerTable = ej.buildTag('table', "", { "outline": "none", "border-spacing": "2px", "border-collapse": "separate", "margin-top": "0px" }, {});
                                    $inTr = ej.buildTag('tr', "", { "line-height": "1.4" }, {});
                                    $inTd = ej.buildTag('td.e-editLabel', "", {}, {});
                                    $inTd.append("<label>" + proxy._columnHeaderTexts[generalColumns[i].field] + "</label>");
                                    $inTr.append($inTd);
                                    $innerTable.append($inTr);
                                    $inTr2 = ej.buildTag('tr');
                                    $inTd2 = ej.buildTag('td.e-editValue', "", {}, {});
                                    columnIndex = ganttColumns.indexOf(generalColumns[i]);
                                    ej.TreeGrid._initCellEditType(treeGridObj, $inTd2, proxy._id, columnIndex, "Edit", (model.viewType == ej.Gantt.ViewType.ProjectView) ? false : true, ganttColumns);
                                    $inTr2.append($inTd2);
                                    $innerTable.append($inTr2);
                                    $td.append($innerTable);
                                    $tr.append($td);
                                }
                                else {
                                    $genearlTable.append($tr);
                                    $tr = ej.buildTag('tr');
                                    i--;
                                    columnCount = 0;
                                }
                            }
                            $genearlTable.append($tr);
                            $genearlForm.append($genearlTable);
                        }
                        break;
                    case "Predecessors":
                        //Predecessor Tab
                        if (model.predecessorMapping && predecessorColoumnIndex != -1) {
                            $ul.append("<li><a href='#" + proxy._id + "EditPredecessors'>" + proxy._dialogTabTitleTexts["predecessorsTabText"] + "</a></li>");
                            var $predecessor = ej.buildTag('div.e-gantt-predecessor-container', "", {}, { id: proxy._id + "EditPredecessors" }),
                                $predecessorForm = ej.buildTag('form', "", { 'height': 'auto', 'width': '592px', 'font-size': '14px' }, { id: proxy._id + "PredecessorEditForm" });
                            $predecessor.append($predecessorForm);
                            $tab.append($predecessor);
                            var $predecessorTable = ej.buildTag('table#' + proxy._id + 'predecessoreditTable', "", { "width": "100%", "outline": "none", "border-collapse": "collapse", "margin-top": "0px", "position": "relative", "left": "-2px", "top": "2px" }, {});
                            $inTr = ej.buildTag('tr', "", { "border-collapse": "collapse", "height": "40px" }, "");
                            $inTd = ej.buildTag('td.e-editLabel', "", { "outline": "none", "border-collapse": "collapse", "padding": "1px" }, {});
                            $inTd.append("<span id='" + proxy._id + "EditDialog_PredecesorAdd' class='e-addpre e-icon e-enable e-edit-dialog' style='cursor:pointer; width: auto;position:relative;left:10px;'>&nbsp;&nbsp;" + proxy._editDialogTexts["addPredecessor"] + "</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id='" + proxy._id + "EditDialog_PredecesorDelete' class='e-deletepre e-icon e-disable e-edit-dialog' style='cursor:pointer; width: auto;position:relative;left:10px;'>&nbsp;&nbsp;" + proxy._editDialogTexts["removePredecessor"] + "</span>");
                            $inTr.append($inTd);
                            $predecessorTable.append($inTr);
                            $inTr2 = ej.buildTag('tr', "", { "border-collapse": "collapse" }, {});
                            $inTd2 = ej.buildTag('td.e-editValue', "", { "border-collapse": "collapse", "padding": "1px" }, {});
                            $preDiv = ej.buildTag("div#treegrid" + proxy._id + "predecessorEdit", "", { "width": "100%", "height": "150px" }, {});
                            $inTd2.append($preDiv);
                            $inTr2.append($inTd2);
                            $predecessorTable.append($inTr2);
                            $predecessorForm.append($predecessorTable);
                        }
                        break;
                    case "Resources":
                        // Resource tab
                        if (model.resourceInfoMapping && resourceColumnIndex != -1) {
                            $ul.append("<li><a href='#" + proxy._id + "EditResources'>" + proxy._dialogTabTitleTexts["resourcesTabText"] + "</a></li>");
                            var $resource = ej.buildTag('div.e-gantt-resource-container', "", {}, { id: proxy._id + "EditResources" }),
                                $resourceForm = ej.buildTag('form', "", { 'height': 'auto', 'width': '592px', 'font-size': '14px' }, { id: proxy._id + "ResourceEditForm" });
                            $resource.append($resourceForm);
                            $tab.append($resource);
                            var $resourceTable = ej.buildTag('table#' + proxy._id + 'resourceeditTable', "", { "width": "100%", "outline": "none", "border-collapse": "collapse", "margin-top": "0px", "position": "relative", "left": "-2px", "top": "2px" }, {});
                            $inTr = ej.buildTag('tr', "", { "border-collapse": "collapse", "height": "40px" }, {});
                            $inTd = ej.buildTag('td.e-editLabel', "", { "outline": "none", "border-collapse": "collapse", "padding": "1px" }, {});
                            $inTd.append("<span id='" + proxy._id + "EditDialog_ResourceAdd' class='e-addpre e-icon e-enable e-edit-dialog' style='cursor:pointer; width: auto;position:relative;left:10px;'>&nbsp;&nbsp;" + proxy._editDialogTexts["addPredecessor"] + "</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id='" + proxy._id + "EditDialog_ResourceDelete' class='e-deletepre e-icon e-disable e-edit-dialog' style='cursor:pointer; width: auto;position:relative;left:10px;'>&nbsp;&nbsp;" + proxy._editDialogTexts["removePredecessor"] + "</span>");
                            $inTr.append($inTd);
                            $resourceTable.append($inTr);
                            $inTr2 = ej.buildTag('tr', "", { "border-collapse": "collapse" }, {});
                            $inTd2 = ej.buildTag('td.e-editValue', "", { "border-collapse": "collapse", "padding": "1px" }, {});
                            $preDiv = ej.buildTag("div#treegrid" + proxy._id + "resourceEdit", "", { "width": "100%", "height": "150px" }, {});
                            $inTd2.append($preDiv);
                            $inTr2.append($inTd2);
                            $resourceTable.append($inTr2);
                            $resourceForm.append($resourceTable);
                        }
                        break;
                    case "Custom Fields":
                        // Custom Field Tab
                        if (proxy._editDialogCustomColumns.length > 0) {
                            $ul.append("<li><a href='#" + proxy._id + "EditCustomFields'>" + proxy._dialogTabTitleTexts["customFieldsTabText"] + "</a></li>");
                            var $customField = ej.buildTag('div.e-gantt-csfield-container', "", {}, { id: proxy._id + "EditCustomFields" }),
                                $customFieldForm = ej.buildTag('form', "", { 'height': 'auto', 'width': '592px', 'font-size': '14px' }, { id: proxy._id + "CustomFieldsEditForm" });
                            $customField.append($customFieldForm);
                            $tab.append($customField);
                            var $customFieldTable = ej.buildTag('table#' + proxy._id + 'customFieldeditTable', "", { "width": "100%", "outline": "none", "position": "relative", "left": "-2px", "top": "4px", "border-collapse": "collapse", "margin-top": "0px" }, {});
                            $inTr = ej.buildTag('tr', "", { "border-collapse": "collapse" }, "");
                            $inTd = ej.buildTag('td.e-editValue', "", { "border-collapse": "collapse", "padding": "1px" }, {});
                            $preDiv = ej.buildTag("div#treegrid" + proxy._id + "customFieldEdit", "", {}, {});
                            $inTd.append($preDiv);
                            $inTr.append($inTd);
                            $customFieldTable.append($inTr);
                            $customFieldForm.append($customFieldTable);
                        }
                        break;
                    case "Notes":
                        //Notes Tab
                        var editDialogFields = model.editDialogFields,
                            length = editDialogFields.length,
                            index = $.map(editDialogFields, function (dialogField, index) {
                                if (dialogField.field == model.notesMapping) {
                                    return index;
                                }
                            });
                        if ((model.notesMapping && length == 0) || (length > 0 && index.length > 0)) {
                            $ul.append("<li><a href='#" + proxy._id + "EditNotes'>" + proxy._dialogTabTitleTexts["notesTabText"] + "</a></li>");
                            var $notes = ej.buildTag('div.e-gantt-notes-container', "", {}, { id: proxy._id + "EditNotes" }),
                                $notesDiv = ej.buildTag('div', "", { "padding": "0px", "position": "relative", "top": "5px", "left": "-1px" }, {}),
                                $noteTextArea = ej.buildTag('textarea', "", {}, { id: proxy._id + "EditAreaNotes" });
                            $notesDiv.append($noteTextArea);
                            $notes.append($notesDiv);
                            $tab.append($notes);
                        }
                        break;
                }
            }
            $tbody = proxy.renderDiaglogButton("edit", $tbody);
            $.templates(proxy._id + "_JSONDialogEditingTemplate", $tbody.html());
        },
        //create template for add dialog
        addDialogTemplate: function () {

            var proxy = this,
                model = proxy.model,
                columns = (model.viewType == ej.Gantt.ViewType.ProjectView) ? $.extend([], proxy._columns) : $.extend([], proxy._resourceViewColumns),
                ganttColumns = (model.viewType == ej.Gantt.ViewType.ProjectView) ? proxy._columns : proxy._resourceViewColumns,
                length = columns.length,
                emptyDataColumns = [], column, predecessorColoumnIndex = -1, resourceColumnIndex = -1,
                treeGridObj = proxy._$treegridHelper.data("ejTreeGrid"),
                columnIndex,
                dialogTab = proxy._dialogTab,
                tabLength = dialogTab.length;
            proxy._addDialogGeneralColumns = [];
            proxy._addDialogCustomColumns = [];            
            proxy._generalTabColumnFields = ["taskId", "taskMode", "taskName", "startDate", "endDate", "duration", "resourceInfo", "status", "work", "taskType", "effortDriven", "baselineStartDate", "baselineEndDate", "predecessor", "WBS", "notesText", "serialNumber", "serialNumberPredecessor"];
            proxy._mappingItems = proxy._getMappingItems();

            if (length == 0)
                return;

            if (model.addDialogFields.length > 0) {
                var filteredColumns = [];
                var count = 0, resultColumn;
                for (; count < model.addDialogFields.length; count++) {
                    resultColumn = $.grep(ganttColumns, function (val) {
                        return val.mappingName === model.addDialogFields[count].field;
                    });
                    if(resultColumn.length > 0)
                    {
                        filteredColumns.push(resultColumn[0]);
                        if (proxy._generalTabColumnFields.indexOf(resultColumn[0].mappingName) == -1 && model.addDialogFields[count].displayInGeneralTab)
                            proxy._generalTabColumnFields.push(resultColumn[0].mappingName);
                    }
                }
                columns = filteredColumns;
            }
            else {
                //To hide the WBS predecessor field
                if (model.enableWBS) {
                    var finalColumns;
                    if (model.enableWBSPredecessor) {
                        finalColumns = columns.filter(function (col) {
                            return col.mappingName != "WBSPredecessor";
                        });
                    }
                    if (finalColumns && finalColumns.length)
                        columns = finalColumns;
                }
            }
            var index = $.map(columns, function (column, index) {
                if (column.mappingName == model.taskNameMapping) {
                    return index;
                }
            });
            if ((index[0] + 1) % 3 == 0) {
                columns.splice(index[0] - 1, 0, columns.splice(index[0], 1)[0]);
            }
            var $tbody = ej.buildTag('div', "", {}, {}),
                $tab = ej.buildTag('div', "", {}, { id: proxy._id + "AddTab" }),
                $ul = ej.buildTag('ul', "", {}, {}),
                $inTr, $inTd, $inTr2, $inTd2, $preDiv;
            $tab.append($ul);
            $tbody.append($tab);
            length = columns.length;
            for (var i = 0; i < length; i++) {
                if ($.inArray(columns[i].mappingName, proxy._mappingItems) != -1) {
                    if ((!columns[i].mappingName && columns[i].field == "work") || columns[i].field == "taskType" || columns[i].field == "effortDriven")
                        continue;
                    if (columns[i].mappingName !== model.predecessorMapping && columns[i].mappingName != model.resourceInfoMapping && columns[i].mappingName != model.notesMapping && columns[i].mappingName != "serialNumberPredecessor") {                        
                        var index = $.map(proxy._generalTabColumnFields, function (field, index) {
                            if (field == columns[i].field) {
                                return index;
                            }
                        });
                        if (index.length > 0) {
                            proxy._addDialogGeneralColumns.push(columns[i]);
                        }
                        else {
                            proxy._addDialogCustomColumns.push(columns[i]);
                        }
                    }
                    else {
                        if (columns[i].mappingName === model.predecessorMapping || columns[i].mappingName === "serialNumberPredecessor")
                            predecessorColoumnIndex = i;
                        else if (columns[i].mappingName === model.resourceInfoMapping)
                            resourceColumnIndex = i;
                    }
                }
            }
            for (var tabIndex = 0; tabIndex < tabLength; tabIndex++) {
                switch (dialogTab[tabIndex]) {
                    // General Tab
                    case "General":
                        if (proxy._addDialogGeneralColumns.length > 0) {
                            $ul.append("<li><a href='#" + proxy._id + "AddGeneral'>" + proxy._dialogTabTitleTexts["generalTabText"] + "</a></li>");
                            var $general = ej.buildTag('div.e-gantt-editor-container', "", {}, { id: proxy._id + "AddGeneral" }),
                                $genearlForm = ej.buildTag('form', "", { 'height': 'auto', 'width': 'auto', 'font-size': '14px' }, { id: proxy._id + "GeneralAddForm" });
                            $general.append($genearlForm);
                            $tab.append($general);
                            //$form = ej.buildTag('form', "", { 'height': 'auto', 'width': 'auto', 'font-size': '14px' }, { id: proxy._id + "AddForm" });
                            var $genearlTable = ej.buildTag('table.e-general-edit-div', "", { "border-spacing": "2px", "border-collapse": "separate", "margin-top": "0px" }, {}),
                            $tr = ej.buildTag('tr'), $td;
                            var columnCount = 0,
                                generalColumns = proxy._addDialogGeneralColumns,
                                length = generalColumns.length;
                            for (var i = 0; i < length; i++) {
                                if (columnCount < 3) {
                                    if (generalColumns[i].mappingName !== model.taskNameMapping) {
                                        columnCount++;
                                        $td = ej.buildTag('td.e-property-container', "", {}, {});
                                    }
                                    else {
                                        columnCount += 2;
                                        $td = ej.buildTag('td.e-property-container', "", {}, { "colspan": "2" });
                                    }
                                    var $innerTable = ej.buildTag('table', "", { "outline": "none", "border-spacing": "2px", "border-collapse": "separate", "margin-top": "0px" }, {});
                                    $inTr = ej.buildTag('tr', "", { "line-height": "1.4" }, {});
                                    $inTd = ej.buildTag('td.e-editLabel', "", {}, {});
                                    $inTd.append("<label>" + proxy._columnHeaderTexts[generalColumns[i].field] + "</label>");
                                    $inTr.append($inTd);
                                    $innerTable.append($inTr);
                                    $inTr2 = ej.buildTag('tr');
                                    $inTd2 = ej.buildTag('td.e-editValue', "", {}, {});
                                    columnIndex = ganttColumns.indexOf(generalColumns[i]);
                                    ej.TreeGrid._initCellEditType(treeGridObj, $inTd2, proxy._id, columnIndex, "Add", (model.viewType == ej.Gantt.ViewType.ProjectView) ? false : true, ganttColumns);
                                    $inTr2.append($inTd2);
                                    $innerTable.append($inTr2);
                                    $td.append($innerTable);
                                    $tr.append($td);
                                }
                                else {
                                    $genearlTable.append($tr);
                                    $tr = ej.buildTag('tr');
                                    i--;
                                    columnCount = 0;
                                }
                            }
                            $genearlTable.append($tr);
                            $genearlForm.append($genearlTable);
                        }
                        break;
                    case "Predecessors":
                        //Predecessor Tab
                        if (model.predecessorMapping && predecessorColoumnIndex != -1) {
                            $ul.append("<li><a href='#" + proxy._id + "AddPredecessors'>" + proxy._dialogTabTitleTexts["predecessorsTabText"] + "</a></li>");
                            var $predecessor = ej.buildTag('div.e-gantt-predecessor-container', "", {}, { id: proxy._id + "AddPredecessors" }),
                                $predecessorForm = ej.buildTag('form', "", { 'height': 'auto', 'width': '592px', 'font-size': '14px' }, { id: proxy._id + "PredecessorAddForm" });
                            $predecessor.append($predecessorForm);
                            $tab.append($predecessor);
                            var $predecessorTable = ej.buildTag('table#' + proxy._id + 'predecessoraddTable', "", { "width": "100%", "outline": "none", "border-collapse": "collapse", "position": "relative", "left": "-2px", "top": "2px", "margin-top": "0px" }, {});
                            $inTr = ej.buildTag('tr', "", { "border-collapse": "collapse", "height": "40px" }, {});
                            $inTd = ej.buildTag('td.e-editLabel', "", { "outline": "none", "border-collapse": "collapse", "padding": "1px" }, {});
                            $inTd.append("<span id='" + proxy._id + "AddDialog_PredecesorAdd' class='e-addpre e-icon e-enable e-add-dialog' style='cursor:pointer; width: auto;position:relative;left:10px;'>&nbsp;&nbsp;" + proxy._editDialogTexts["addPredecessor"] + "</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id='" + proxy._id + "AddDialog_PredecesorDelete' class='e-deletepre e-icon e-disable e-add-dialog' style='cursor:pointer; width: auto;position:relative;left:10px;'>&nbsp;&nbsp;" + proxy._editDialogTexts["removePredecessor"] + "</span>");
                            $inTr.append($inTd);
                            $predecessorTable.append($inTr);
                            $inTr2 = ej.buildTag('tr', "", { "border-collapse": "collapse" }, {});
                            $inTd2 = ej.buildTag('td.e-editValue', "", { "border-collapse": "collapse", "padding": "1px" }, {});
                            $preDiv = ej.buildTag("div#treegrid" + proxy._id + "predecessorAdd", "", { "width": "100%", "height": "150px" }, {});
                            $inTd2.append($preDiv);
                            $inTr2.append($inTd2);
                            $predecessorTable.append($inTr2);
                            $predecessorForm.append($predecessorTable);
                        }
                        break;
                    case "Resources":
                        // Resource tab
                        if (model.resourceInfoMapping && resourceColumnIndex != -1) {
                            $ul.append("<li><a href='#" + proxy._id + "AddResources'>" + proxy._dialogTabTitleTexts["resourcesTabText"] + "</a></li>");
                            var $resource = ej.buildTag('div.e-gantt-resource-container', "", {}, { id: proxy._id + "AddResources" }),
                                $resourceForm = ej.buildTag('form', "", { 'height': 'auto', 'width': '592px', 'font-size': '14px' }, { id: proxy._id + "ResourceAddForm" });
                            $resource.append($resourceForm);
                            $tab.append($resource);
                            var $resourceTable = ej.buildTag('table#' + proxy._id + 'resourceaddTable', "", { "width": "100%", "outline": "none", "border-collapse": "collapse", "position": "relative", "left": "-2px", "top": "2px", "margin-top": "0px" }, {});
                            $inTr = ej.buildTag('tr', "", { "border-collapse": "collapse", "height": "40px" }, {});
                            $inTd = ej.buildTag('td.e-editLabel', "", { "outline": "none", "border-collapse": "collapse", "padding": "1px" }, {});
                            $inTd.append("<span id='" + proxy._id + "AddDialog_ResourceAdd' class='e-addpre e-icon e-enable e-add-dialog' style='cursor:pointer; width: auto;position:relative;left:10px;'>&nbsp;&nbsp;" + proxy._editDialogTexts["addPredecessor"] + "</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id='" + proxy._id + "AddDialog_ResourceDelete' class='e-deletepre e-icon e-disable e-add-dialog' style='cursor:pointer; width: auto;position:relative;left:10px;'>&nbsp;&nbsp;" + proxy._editDialogTexts["removePredecessor"] + "</span>");
                            $inTr.append($inTd);
                            $resourceTable.append($inTr);
                            $inTr2 = ej.buildTag('tr', "", { "border-collapse": "collapse" }, {});
                            $inTd2 = ej.buildTag('td.e-editValue', "", { "border-collapse": "collapse", "padding": "1px" }, {});
                            $preDiv = ej.buildTag("div#treegrid" + proxy._id + "resourceAdd", "", { "width": "100%", "height": "150px" }, {});
                            $inTd2.append($preDiv);
                            $inTr2.append($inTd2);
                            $resourceTable.append($inTr2);
                            $resourceForm.append($resourceTable);
                        }
                        break;
                    case "Custom Fields":
                        // Custom Field Tab
                        if (proxy._addDialogCustomColumns.length > 0) {
                            $ul.append("<li><a href='#" + proxy._id + "AddCustomFields'>" + proxy._dialogTabTitleTexts["customFieldsTabText"] + "</a></li>");
                            var $customField = ej.buildTag('div.e-gantt-csfield-container', "", {}, { id: proxy._id + "AddCustomFields" }),
                                $customFieldForm = ej.buildTag('form', "", { 'height': 'auto', 'width': '592px', 'font-size': '14px' }, { id: proxy._id + "CustomfFieldsAddForm" });
                            $customField.append($customFieldForm);
                            $tab.append($customField);
                            var $customFieldTable = ej.buildTag('table#' + proxy._id + 'customfieldaddTable', "", { "width": "100%", "outline": "none", "border-collapse": "collapse", "position": "relative", "left": "-2px", "top": "4px" }, {});
                            $inTr = ej.buildTag('tr', "", { "border-collapse": "collapse" }, {});
                            $inTd = ej.buildTag('td.e-editValue', "", { "border-collapse": "collapse", "padding": "1px" }, {});
                            $preDiv = ej.buildTag("div#treegrid" + proxy._id + "customFieldAdd", "", {}, {});
                            $inTd.append($preDiv);
                            $inTr.append($inTd);
                            $customFieldTable.append($inTr);
                            $customFieldForm.append($customFieldTable);
                        }
                        break;
                    case "Notes":
                        //Notes Tab
                        var addDialogFields = model.addDialogFields,
                            length = addDialogFields.length,
                            index = $.map(addDialogFields, function (dialogField, index) {
                                if (dialogField.field == model.notesMapping) {
                                    return index;
                                }
                            });
                        if (model.notesMapping && (length == 0) || (length > 0 && index.length > 0)) {
                            $ul.append("<li><a href='#" + proxy._id + "AddNotes'>" + proxy._dialogTabTitleTexts["notesTabText"] + "</a></li>");
                            var $notes = ej.buildTag('div.e-gantt-notes-container', "", {}, { id: proxy._id + "AddNotes" }),
                                $notesDiv = ej.buildTag('div', "", { "padding": "0px", "position": "relative", "top": "5px", "left": "-1px" }, {}),
                                $noteTextArea = ej.buildTag('textarea', "", {}, { id: proxy._id + "AddAreaNotes" });
                            $notesDiv.append($noteTextArea);
                            $notes.append($notesDiv);
                            $tab.append($notes);
                        }
                        break;
                }
            }

            $tbody = proxy.renderDiaglogButton("add", $tbody);
            $.templates(proxy._id + "_JSONDialogAddingTemplate", $tbody.html());
        },
        //remove contextmenu from DOM
        _clearContextMenu: function () {
            //variables for context menu items
         
            $('.e-tgcontextmenu').remove();
            $('.e-tginnerContextmenu').remove();
        },

        //JSRender Template for ContextMenu
        _createContextMenuTemplate: function () {
            var proxy = this;
            var helpers = {};
            helpers["_" + proxy._id + "getHeaderName"] = $.proxy(proxy._getHeaderName, proxy);

            $.views.helpers(helpers);
            var menuItemList = "<li style='list-style-type:none;margin:0px;'>";
            var listChild = "<div class='e-menuitem{{if disable}} e-disable{{/if}}{{if ~_" + proxy._id + "getHeaderName(#data)}} e-parent-menuitem{{/if}}' id={{:menuId}}  style='display:table;cursor:pointer;min-width:100px;'>" +
                            "{{if iconPath}}" +
                            "<div class='e-icon e-tgcontextmenu-image'" +
                            " style='background-image:{{:iconPath}};background-repeat:no-repeat;'/>" +
                             "{{else}}" +
                            "<div class='e-icon {{:iconClass}} e-tgcontextmenu-icon'/>" +
                            "{{/if}}" +
                            "<div class='e-tgcontextmenu-label'>" +
                            "<span>{{:headerText}}</span></div>" +
                            "{{if ~_" + proxy._id + "getHeaderName(#data)}}<div class='e-icon e-expander e-tgcontextmenu-icon'/> {{/if}}";

            menuItemList += listChild;
            menuItemList += "</div></li>";
            var templates = {};
            templates[proxy._id + "contextMenuTemplate"] = menuItemList;
            $.templates(templates);
        },

        //helper methods for context menu template
        _getHeaderName: function (data) {
            var childMenuItems = this._contextMenuItems.filter(function (value) {
                if (data.menuId != null && data.menuId == value.parentMenuId)
                    return true;
            });
            if (childMenuItems.length > 0) {
                return true;
            }
            return false;
        },

        //create templates for all columns edit types
        initCellEditType: function (column, element,editTarget) {

            var proxy = this,
                model = proxy.model,
                id,    
                helpers = {};
            id = editTarget ? editTarget : "";
            if (ej.isNullOrUndefined(column["editType"]))
                column["editType"] = "stringedit";

            switch (column["editType"]) {
                case "stringedit":
                    if (column.mappingName === model.predecessorMapping) {
                        helpers["_" + proxy._id + "predecessor"] = proxy._getPredecessorsValue;
                        $.views.helpers(helpers);
                        element.html(ej.buildTag('input.e-field e-ejinputtext', "", {}, { value: "{{:~_" + proxy._id + "predecessor('" + proxy._id + "Object','" + model.predecessorMapping + "','" + column.field + "')}}", id: proxy._id + column.field, name: column.field }));
                    } else {
                        element.html(ej.buildTag('input.e-field e-ejinputtext', "", {}, { value: "{{:#data['" + column.field + "']}}", id: proxy._id + column.field + id, name: column.field, "data-dialog": editTarget }));
                    }
                    break;
                case "booleanedit":
                    element.html('{{if ' + column.field + '}} <input class="e-field e-checkbox" type ="checkbox" id=' + proxy._id + column.field + ' name=' + column.field + ' checked="checked"></input>{{else}} <input class="e-field e-checkbox" type ="checkbox" id=' + proxy._id + column.field + ' name=' + column.field + ' > {{/if}}');
                    break;
                case "numericedit":
                    var $numericText = ej.buildTag('input.e-numerictextbox e-field', "", {}, { type: "text", value: "{{:#data['" + column.field + "']}}", id: proxy._id + column.field + id, name: column.field, "data-dialog": editTarget });
                    element.append($numericText);
                    break;
                case "datepicker":
                case "datetimepicker":
                    var $datePicker = ej.buildTag('input.e-' + column["editType"] + ' e-field', "", {}, { type: "text", value: "{{:#data['" + column.field + "']}}", id: proxy._id + column.field + id, name: column.field, "data-dialog": editTarget });
                    element.append($datePicker);
                    break;
                case "dropdownedit":
                    var $dropDownList = ej.buildTag('input.e-field e-dropdownlist' + ' e-field', "", {}, { type: "text", value: "{{:#data['" + column.field + "']}}", id: proxy._id + column.field + id, name: column.field, "data-dialog": editTarget });
                    element.append($dropDownList);                    
                    break;
                case "maskedit":
                    var $maskEdit = ej.buildTag('input .e-field e-maskedit', "", {},
                                        {
                                            value: "{{:#data['" + column.field + "']}}",
                                            id: proxy._id + column.field + id,
                                            name: column.field,
                                            "data-dialog": editTarget
                                        });
                    element.append($maskEdit);
                    break;
            }
        },

        //returns predecessor value
        _getPredecessorsValue: function (gridObject, mappingName) {
            return this.data.item ? this.data.item[mappingName] : "";
        },

        /*get duration and duration unit value from given string*/
        _getDurationValues: function (val, isFromDialog) {
            var duration = "",
                model = this.model,
                durationUnit = null, unitIndex;

            if (typeof val == "string") {
                var values = val.match(/(\d*\.*\d+|[A-z]+)/g);
                if (values && values.length <= 2) {
                    duration = parseFloat(values[0]);
                    var unit = values[1] ? values[1].toLowerCase() : null;
                    var multiple = (duration != 1) ? true : false;
                    if (this._durationUnitEditText.minute.indexOf(unit) != -1)
                        durationUnit = ej.Gantt.DurationUnit.Minute;
                    else if (this._durationUnitEditText.hour.indexOf(unit) != -1)
                        durationUnit = ej.Gantt.DurationUnit.Hour;
                    else if (this._durationUnitEditText.day.indexOf(unit) != -1)
                        durationUnit = ej.Gantt.DurationUnit.Day;
                }
            } else {
                duration = val;
                durationUnit = null;
            }

            if (isNaN(duration)) {
                duration = isFromDialog ? this._editedDialogRecord.duration : null;
                durationUnit = isFromDialog ? this._editedDialogRecord.durationUnit : null;
            }
            var output = {};
            output.duration = duration;
            output.durationUnit = durationUnit;
            return output;
        },

        //calculate end date and duration on date change in edit dialog
        _editStartDateChange: function (element, args) {
            var proxy = this,
                id = proxy._id,
                model = proxy.model,
                targetId = element.attr("id"),
                holidays = this.model.holidays,
                dialog = element.attr("data-dialog"),
                selectedItem = model.selectionMode == "row" ? this.selectedItem() : model.updatedRecords[proxy._rowIndexOfLastSelectedCell],
                editedObj = this._editedDialogRecord,
                effortDriven = editedObj.effortDriven == "true" ? true : false,
                effortDrivenId, typeId, workId,
                startDateId, endDateId, durationId, baselineStartDateId, baselineEndDateId, durationVal, durationUnit;

            if (this._editedDialogRecord.isUpdatedFromDialog)
                return;
            this._editedDialogRecord.isUpdatedFromDialog = true;

            if (dialog === "Add") {
                startDateId = "#" + id + "startDateAdd";
                endDateId = "#" + id + "endDateAdd";
                durationId = "#" + id + "durationAdd";
                effortDrivenId = "#" + id + "effortDrivenAdd";
                typeId = "#" + id + "taskTypeAdd";
                workId = "#" + id + "workAdd";
                baselineStartDateId = "#" + id + "baselineStartDateAdd";
                baselineEndDateId = "#" + id + "baselineEndDateAdd";
            }
            else {
                startDateId = "#" + id + "startDateEdit";
                endDateId = "#" + id + "endDateEdit";
                durationId = "#" + id + "durationEdit";
                effortDrivenId = "#" + id + "effortDrivenEdit";
                typeId = "#" + id + "taskTypeEdit";
                workId = "#" + id + "workEdit";
            }
            var startDate = $(startDateId).val(),
                endDate = $(endDateId).val(),
                duration = $(durationId).val(),
                work = $(workId).val();

            if (!startDate || startDate == "") startDate = !model.allowUnscheduledTask ? editedObj.startDate : null;
            if (!duration || duration == "") duration = !model.allowUnscheduledTask ? editedObj.duration : null;
            if (!endDate || endDate == "") endDate = !model.allowUnscheduledTask ? editedObj.endDate : null;

            if ((targetId === id + "startDateEdit") || (targetId === id + "startDateAdd")) {
                startDate = proxy._getDateFromFormat(startDate);
                startDate = proxy._checkStartDate(startDate, editedObj);
                if (ej.isNullOrUndefined(startDate)) {
                    editedObj.startDate = null;
                    editedObj.duration = null;
                    editedObj.isMilestone = false;
                    duration = proxy._getDurationStringValue(editedObj);
                    $(durationId).val(duration);
                    if (!ej.isNullOrUndefined(editedObj.endDate)) {
                        if (editedObj.endDate.getHours() == 0 && this._defaultEndTime != 86400)
                            this._setTime(this._defaultEndTime, editedObj.endDate);
                        editedObj.endDate = this._checkEndDate(editedObj.endDate, editedObj);
                    }
                }
                else if (!ej.isNullOrUndefined(duration)) {
                    editedObj.endDate = proxy._getEndDate(startDate, editedObj.duration, editedObj.durationUnit, editedObj);
                    editedObj.startDate = startDate;
                    if (model.dateFormat.toLowerCase().indexOf("hh") != -1)
                        $(endDateId).ejDateTimePicker("option", "value", editedObj.endDate);
                    else
                        $(endDateId).ejDatePicker("option", "value", editedObj.endDate);
                }
                else if (!ej.isNullOrUndefined(endDate)) {
                    if (proxy._getDateFromFormat(startDate) < editedObj.endDate) {
                        editedObj.startDate = startDate;
                        editedObj.duration = this._getDuration(editedObj.startDate, editedObj.endDate, editedObj.durationUnit, editedObj.isAutoSchedule);
                        editedObj.isMilestone = (editedObj.duration == 0) ? true : false;
                        proxy._updateResourceRelatedFields(editedObj);
                        if (!effortDriven)
                            $(workId).ejNumericTextbox("option", "value", editedObj.work);
                        $(durationId).val(proxy._getDurationStringValue(editedObj));
                        if (editedObj.taskType == "fixedWork")
                            proxy._updateResourceDataSource(editedObj);
                    }
                    else if (!ej.isNullOrUndefined(startDate)) {
                        editedObj.startDate = startDate;
                    }
                }
                else if (!ej.isNullOrUndefined(startDate)) {
                    editedObj.startDate = startDate;
                }
                if (proxy.getFormatedDate(startDate) != args.value) {
                    if (model.dateFormat.toLowerCase().indexOf("hh") != -1)
                        $(startDateId).ejDateTimePicker("option", "value", startDate);
                    else
                        $(startDateId).ejDatePicker("option", "value", startDate);
                }
            }

            else if ((targetId === id + "endDateEdit") || (targetId === id + "endDateAdd")) {
                endDate = proxy._getDateFromFormat(endDate);
                if (!ej.isNullOrUndefined(endDate) && endDate.getHours() == 0 && this._defaultEndTime != 86400)
                    this._setTime(this._defaultEndTime, endDate);
                endDate = this._checkEndDate(endDate, editedObj);

                if (ej.isNullOrUndefined(endDate)) {
                    editedObj.endDate = null;
                    editedObj.duration = null;
                    editedObj.isMilestone = false;
                    duration = proxy._getDurationStringValue(editedObj);
                    $(durationId).val(duration);
                }
                else if (!ej.isNullOrUndefined(startDate)) {
                    if (editedObj.startDate < endDate) {
                        editedObj.endDate = endDate;
                        editedObj.duration = this._getDuration(editedObj.startDate, endDate, editedObj.durationUnit, editedObj.isAutoSchedule);
                        editedObj.isMilestone = (editedObj.duration == 0) ? true : false;
                        proxy._updateResourceRelatedFields(editedObj);
                        if (!effortDriven)
                            $(workId).ejNumericTextbox("option", "value", editedObj.work);
                        $(durationId).val(proxy._getDurationStringValue(editedObj));
                        if (editedObj.taskType == "fixedWork")
                            proxy._updateResourceDataSource(editedObj);
                    }
                    else
                        endDate = editedObj.endDate;
                }
                else if (!ej.isNullOrUndefined(duration)) {
                    editedObj.endDate = endDate;
                    editedObj.startDate = proxy._getStartDate(editedObj.endDate, editedObj.duration, editedObj.durationUnit, editedObj);
                    if (editedObj.isMilestone)
                        editedObj.startDate = this._checkStartDate(editedObj.startDate, editedObj);

                    if (proxy.getFormatedDate(editedObj.startDate) != startDate) {
                        if (model.dateFormat.toLowerCase().indexOf("hh") != -1)
                            $(startDateId).ejDateTimePicker("option", "value", editedObj.startDate);
                        else
                            $(startDateId).ejDatePicker("option", "value", editedObj.startDate);
                    }
                }
                else if (!ej.isNullOrUndefined(endDate))
                    editedObj.endDate = endDate;

                if (proxy.getFormatedDate(endDate) != args.value) {
                    if (model.dateFormat.toLowerCase().indexOf("hh") != -1)
                        $(endDateId).ejDateTimePicker("option", "value", endDate);
                    else
                        $(endDateId).ejDatePicker("option", "value", endDate);
                }
            }

            else if ((targetId === id + "durationEdit") || (targetId === id + "durationAdd")) {
                var values = proxy._getDurationValues(duration, true);
                durationVal = values.duration;
                durationUnit = ej.isNullOrUndefined(values.durationUnit) ? editedObj.durationUnit : values.durationUnit;

                if (editedObj.duration != durationVal || editedObj.durationUnit != durationUnit) {
                    if (durationVal === "" || durationVal === null) {
                        editedObj.endDate = null;
                        editedObj.duration = null;
                        editedObj.isMilestone = false;
                        editedObj.durationUnit = durationUnit;
                        if (model.dateFormat.toLowerCase().indexOf("hh") != -1)
                            $(endDateId).ejDateTimePicker("option", "value", editedObj.endDate);
                        else
                            $(endDateId).ejDatePicker("option", "value", editedObj.endDate);
                    }
                    else if (!ej.isNullOrUndefined(startDate)) {
                        editedObj.duration = durationVal;
                        editedObj.durationUnit = durationUnit;
                        editedObj.isMilestone = (editedObj.duration == 0) ? true : false;
                        editedObj.endDate = proxy._getEndDate(editedObj.startDate, editedObj.duration, editedObj.durationUnit, editedObj);
                        if (model.dateFormat.toLowerCase().indexOf("hh") != -1)
                            $(endDateId).ejDateTimePicker("option", "value", editedObj.endDate);
                        else
                            $(endDateId).ejDatePicker("option", "value", editedObj.endDate);
                    }
                    else if (!ej.isNullOrUndefined(endDate)) {
                        editedObj.duration = durationVal;
                        editedObj.durationUnit = durationUnit;
                        editedObj.startDate = proxy._getStartDate(editedObj.endDate, editedObj.duration, editedObj.durationUnit, editedObj);
                        if (editedObj.isMilestone)
                            editedObj.startDate = this._checkStartDate(editedObj.startDate, editedObj);

                        if (proxy.getFormatedDate(editedObj.startDate) != startDate) {
                            if (model.dateFormat.toLowerCase().indexOf("hh") != -1)
                                $(startDateId).ejDateTimePicker("option", "value", editedObj.startDate);
                            else
                                $(startDateId).ejDatePicker("option", "value", editedObj.startDate);
                        }
                    }
                    else if (!ej.isNullOrUndefined(durationVal)) {
                        editedObj.duration = durationVal;
                        editedObj.durationUnit = durationUnit;
                    }
                }
                proxy._updateResourceRelatedFields(editedObj);
                if (!effortDriven)
                    $(workId).ejNumericTextbox("option", "value", editedObj.work);
                $(durationId).val(proxy._getDurationStringValue(editedObj));
                if (editedObj.taskType == "fixedWork")
                    proxy._updateResourceDataSource(editedObj);
            }
            else if ((targetId === id + "workEdit") || (targetId === id + "workAdd")) {
                editedObj.work = parseInt(work);
                proxy._updateResourceRelatedFields(editedObj);
                if (editedObj.taskType != "fixedDuration" && editedObj.isAutoSchedule) {
                    $(durationId).val(proxy._getDurationStringValue(editedObj));
                    if (editedObj.isMilestone) {
                        if (editedObj.duration > 0)
                            editedObj.isMilestone = false;
                        editedObj.startDate = this._checkStartDate(editedObj.startDate, editedObj);
                        if (proxy.getFormatedDate(editedObj.startDate) != startDate) {
                            if (model.dateFormat.toLowerCase().indexOf("hh") != -1)
                                $(startDateId).ejDateTimePicker("option", "value", editedObj.startDate);
                            else
                                $(startDateId).ejDatePicker("option", "value", editedObj.startDate);
                        }
                    }
                    if (model.viewType == "resourceView") {
                        editedObj.duration = editedObj.duration == 0 ? 1 : editedObj.duration;
                    }
                    endDate = this._getEndDate(editedObj.startDate, editedObj.duration, durationUnit, editedObj);
                    editedObj.endDate = endDate;
                    if (model.dateFormat.toLowerCase().indexOf("hh") != -1)
                        $(endDateId).ejDateTimePicker("option", "value", endDate);
                    else
                        $(endDateId).ejDatePicker("option", "value", endDate);
                }
                else
                    proxy._updateResourceDataSource(editedObj);
            }
            else if (targetId === id + "baselineStartDateAdd") {
                if ($(baselineEndDateId).length > 0) {
                    var baselineStartDate = proxy._getDateFromFormat($(baselineStartDateId).val());
                    var baselineEndDate = proxy._getDateFromFormat($(baselineEndDateId).val());
                    if (baselineStartDate && baselineEndDate && baselineStartDate.getTime() > baselineEndDate.getTime()) {
                        if (model.dateFormat.toLowerCase().indexOf("hh") != -1)
                            $(baselineStartDateId).ejDateTimePicker("option", "value", args.prevDate);
                        else
                            $(baselineStartDateId).ejDatePicker("option", "value", args.prevDate);
                    }
                }

            } else if (targetId === id + "baselineEndDateAdd") {
                if ($(baselineStartDateId).length > 0) {
                    var baselineStartDate = proxy._getDateFromFormat($(baselineStartDateId).val());
                    var baselineEndDate = proxy._getDateFromFormat($(baselineEndDateId).val());
                    if (baselineStartDate && baselineEndDate && baselineStartDate.getTime() > baselineEndDate.getTime()) {
                        if (model.dateFormat.toLowerCase().indexOf("hh") != -1)
                            $(baselineEndDateId).ejDateTimePicker("option", "value", args.prevDate);
                        else
                            $(baselineEndDateId).ejDatePicker("option", "value", args.prevDate);
                    }
                }
            }
            this._editedDialogRecord.isUpdatedFromDialog = false;
        },

        //Create task name collection from records for edit dialog
        _taskNameCollection:function()
        {
            var proxy = this,
                model = this.model,
                records = model.viewType == "resourceView" ? this._resourceUniqTasks : proxy.model.flatRecords;
            proxy._preTableCollection = [];
            proxy._preTaskIds = [];

            for (var i = 0; i < records.length; i++) {
                if (records[i].hasChildRecords) continue;
                var temp;
                if (proxy.model.enableSerialNumber)
                    temp = { id: records[i].taskId.toString(), text: (records[i].serialNumber.toString() + "-" + records[i].taskName), value: records[i].serialNumber.toString() };
                else
                    temp = { id: records[i].taskId.toString(), text: (records[i].taskId.toString() + "-" + records[i].taskName), value: records[i].taskId.toString() };
                proxy._preTaskIds.push(temp.value);
                proxy._preTableCollection.push(temp);
            }
        },

        _getPredecessorDropdownData: function (treeDatasource, ganttData) {
            var proxy = this, model = proxy.model,
                idCollection = proxy._preTableCollection,
                taskIds = proxy._preTaskIds, index = -1,
                id = model.enableSerialNumber ? ganttData.serialNumber : ganttData.taskId;

            index = taskIds.indexOf(id.toString());
            idCollection.splice(index, 1);
            taskIds.splice(index, 1);            
            proxy._getVaildSuccessorTasks(ganttData, taskIds, idCollection);            
        },

        //get ID array from predecessor string
        _idFromPredecessor:function(pre)
        {
            var str = "123FS+2";
            var preArray = $.map(pre.split(','), $.trim);
            var preIdArray = [];
           

            for (var j = 0; j < preArray.length; j++)
            {
                var strArray = [];
                for (var i = 0; i < preArray[j].length; i++) {
                    if (!isNaN(preArray[j].charAt(i))) {
                        strArray.push(preArray[j].charAt(i));
                    }
                    else {
                        break;
                    }
                }
                preIdArray.push((strArray.join('')));
            }
            return preIdArray;
        },
        //get ID array from serial predecessor string
        _idFromSerialPredecessor:function(pre)
        {            
            var preArray = $.map(pre.split(','), $.trim),
                preIdArray = [], flatRecords = this.model.flatRecords;                    

            for (var j = 0; j < preArray.length; j++)
            {
                var serialNo = preArray[j].match(/(\d+|[A-z]+)/g), idValue;
                if (serialNo && serialNo[0]) {
                    $.map(flatRecords, function (item) {
                        if (item.serialNumber == serialNo[0]) {
                            idValue = item.taskId;
                            return false;
                        }
                    });                    
                    idValue && preIdArray.push(idValue);
                }
            }
            return preIdArray;
        },

        _preEditDialogChangeEvent: function(dialogId, dialogtype, fieldName, args){
            var treeGridObj = $(dialogId).data("ejTreeGrid"),
                $tr = ej.TreeGrid.getRowByIndex(treeGridObj, treeGridObj.selectedRowIndex()),
                $td;

            if (fieldName == "name") {
                $td = $($tr).find('td:eq(0)');
                $($td).html(args.value);
            }
            else {
                $td = $($tr).find('td:eq(1)');
                var item = args.model.dataSource[args.itemId];
                $($td).html(item.text);
            }            
        },

        _preBeginEdit: function (addDialogId, dialogArgs, args) {
            var proxy = this,
                gridModel = args.model,
                columns = gridModel.columns,
                idCollection = $.extend(true, [], proxy._preTableCollection),
                ids = $.extend(true, [], proxy._preTaskIds),
                dataSource = gridModel.dataSource,
                length = dataSource.length,
                value = args.data.item.id;
                       
                for (var i = 0; i < length; i++) {
                    var record = dataSource[i];
                    if (record.id != value) {
                        var index = ids.indexOf(record.id);
                        ids.splice(index, 1);
                        idCollection.splice(index, 1);
                    }
                }
                columns[0].dropdownData = columns[1].dropdownData = idCollection;                             
            
            if (idCollection.length <= 1)
                proxy._enbleDisablePredecessorAddButton('disable', dialogArgs.requestType);
        },

        //handle end edit event in dialog box predecessor editing
        _preEndEdit:function(editDialogId,dialogType,args)
        {
            var proxy = this,
                dataSource = args.model.dataSource,
                selectedItem = args.model.selectedItem,
                currentIndex, ids = args.model.preIds;

            if (args.value !== null && (args.columnName === "name" || args.columnName === "id")) {
                if (args.value.length > 0) {
                    selectedItem.id = selectedItem.name = args.value;
                    currentIndex = dataSource.indexOf(selectedItem.item);
                    if (currentIndex === -1) {
                        dataSource.push(selectedItem.item);
                        currentIndex = dataSource.indexOf(selectedItem.item);
                    }
                    dataSource[currentIndex].id = dataSource[currentIndex].name = args.value;
                }
                if (!selectedItem.type && !ej.isNullOrUndefined(currentIndex)) {
                    selectedItem.type = "Finish-Start";
                    dataSource[currentIndex].type = "Finish-Start";
                }
                $(editDialogId).ejTreeGrid("refreshRow", args.model.selectedRowIndex);              
            }
        },
        //udapte the status of predecessor delete button in dialog
        _enableDisablePredecessorDelete: function (dialogType, args)
        {
            var proxy = this,
                predecessorDelete;
            if (dialogType == "add")
                predecessorDelete = $("#" + proxy._id + "AddDialog_PredecesorDelete");
            else
                predecessorDelete = $("#" + proxy._id + "EditDialog_PredecesorDelete");
            $(predecessorDelete).unbind("click", $.proxy(proxy._deletepredecessor, proxy)).bind("click", $.proxy(proxy._deletepredecessor, proxy));
            $(predecessorDelete).removeClass("e-disable").addClass("e-enable");
        },

        //udapte the status of resource delete button in dialog
        _enableDisableResouceDelete: function (dialogType,args) {
            var proxy = this, resourceDelete;
            if (dialogType == "add")
                resourceDelete = $("#" + proxy._id + "AddDialog_ResourceDelete");
            else
                resourceDelete = $("#" + proxy._id + "EditDialog_ResourceDelete");
            $(resourceDelete).unbind("click", $.proxy(proxy._deleteResource, proxy)).bind("click", $.proxy(proxy._deleteResource, proxy));
            $(resourceDelete).removeClass("e-disable").addClass("e-enable");
        },

        //prepare data source for dropdown in predecessor edit in dialog box
        _predecessorEditCollection: function (currentRecord) {
        
            var proxy = this,
               model = proxy.model,
               collection,
               gridId,
               types,
               data = [],
               selectedItem;
            gridId = "#" + proxy._id + "predecessor";            
            types = proxy._predecessorCollectionText;
            data = [];
            selectedItem = currentRecord ? currentRecord : model.selectedItem;
            
            collection = proxy._preTableCollection;
            if (!ej.isNullOrUndefined(selectedItem) && !ej.isNullOrUndefined(selectedItem.predecessor) && !ej.isNullOrUndefined(selectedItem.item[model.predecessorMapping]))
            {
                var predecessor = selectedItem.predecessor,
                    predecessorLength = predecessor.length,
                    typeLength = types.length,
                    collectionLength = collection.length;
                for (var i = 0; i < predecessorLength; i++) {                    
                    var num = model.enableSerialNumber ? proxy._snoFromTaskId(predecessor[i].from) : predecessor[i].from;
                    num = num.toString();
                    if (selectedItem.taskId.toString() !== (predecessor[i].from).toString())
                    {
                        var taskName, type, lags = 0;
                        for (var j = 0; j < collectionLength; j++) {
                            if (collection[j].value === num) {
                                taskName = collection[j].value;
                                break;
                            }
                        }
                        for (var k = 0; k < typeLength; k++) {
                            if (types[k].id == predecessor[i].predecessorsType) {
                                type = types[k].text;
                            }
                        }

                        var multiple = Math.abs(predecessor[i].offset) != 1, val = "";
                        if (predecessor[i].offsetDurationUnit == "day")
                            val += multiple ? this._durationUnitTexts.days : this._durationUnitTexts.day;
                        else if (predecessor[i].offsetDurationUnit == "hour")
                            val += multiple ? this._durationUnitTexts.hours : this._durationUnitTexts.hour;
                        else
                            val += multiple ? this._durationUnitTexts.minutes : this._durationUnitTexts.minute;

                        lags = (predecessor[i].offset + " " + val);
                        var obj = { id: num, name: taskName, type: type, offset: lags };
                        data.push(obj);
                    }
                }
            }
            return data;
        },
        _getResourceInfoIndex: function (resourceIdcollection, resourcecollection) {

            var count = 0,
            resources = [];
            if (resourceIdcollection && resourcecollection) {
                for (count; count < resourceIdcollection.length; count++) {
                    if (resourcecollection[resourceIdcollection[count]])
                        resources.push(resourceIdcollection[count]);
                }
            }
            return resources;
        },
        //To get new serial number for new task
        _getNewSerialNumber: function () {
            var proxy = this, model = proxy.model,
                flatDatas = model.flatRecords, data, targetIndex,
                rowPositionStyle = model.editSettings.rowPosition.toLowerCase();
            data = model.selectionMode == "row" ? model.selectedItem : model.updatedRecords[proxy._rowIndexOfLastSelectedCell]; //selected row item before adding the new row
            if (data)
                targetIndex = model.updatedRecords.indexOf(data) + 1;
            else if (rowPositionStyle == "bottom")
                targetIndex = flatDatas.length + 1 //New row at bottom
            else
                targetIndex = 1;// New row at top, so serial number will be 1

            //Creating new serial number based on row position
            if (data) {
                switch (rowPositionStyle) {
                    case ej.Gantt.RowPosition.BelowSelectedRow:                        
                        if (data.hasChildRecords) {
                            var dataChildCount = proxy._$treegridHelper.ejTreeGrid("getChildCount", data, 0);
                            targetIndex = targetIndex + dataChildCount + 1;
                        }
                        else targetIndex = targetIndex + 1;
                        break;
                    case ej.Gantt.RowPosition.Top:
                        targetIndex = 1;
                        break;
                    case ej.Gantt.RowPosition.Bottom:
                        targetIndex = flatDatas.length + 1;
                        break;
                    case ej.Gantt.RowPosition.Child:
                        targetIndex = targetIndex + 1;
                        break;
                }
            }
            return targetIndex;
        },
        //To get serial number from task id
        _snoFromTaskId: function (tId) {
            var proxy = this, model = proxy.model,
                flatDatas = model.flatRecords, sno;
            $.map(flatDatas, function (record) {
                if (record.taskId == tId) {
                    sno = record.serialNumber;
                    return false;
                }
            });
            return sno;
        },
        //render control in diaog box as per template created
        _refreshEditForm: function (args) {
            var proxy = this,
                elementFocused = false,
                $formElement,
                percent = 86,
                i = 0, form, length,
                $element,
                inputWidth = "165px",
                model = proxy.model,
                width,
                params = {},
                value,
                column,
                customParams,
                toformat, newIdInstant, newSerialNo,
                formatVal, editTreeGridId,
                selectedItem = (model.viewType == "resourceView") ? args.data : model.selectionMode == "row" ? model.selectedItem : model.updatedRecords[proxy._rowIndexOfLastSelectedCell],
                columns = (model.viewType == "resourceView") ? proxy._resourceViewColumns : proxy._columns;

            if (args.requestType == "add") {
                var tab = document.getElementById(proxy._id + "AddTab"),
                    dialog = $("#" + proxy._id + "_dialogAdd_wrapper"),
                form = document.getElementById(proxy._id + "GeneralAddForm"),
                editTreeGridId = "#treegrid" + proxy._id + "predecessorAdd",
                noteRteId = "#" + proxy._id + "AddAreaNotes",
                resourceTreeGridId = "#treegrid" + proxy._id + "resourceAdd",
                customFieldTreeGridId = "#treegrid" + proxy._id + "customFieldAdd";
                if (!ej.isNullOrUndefined(this.dataSource()) && this.dataSource().length == 0 && model.predecessorMapping && $(editTreeGridId).length > 0) {
                    var index = [];
                    index[0] = proxy._dialogTab.indexOf("Predecessors");
                    $("#" + proxy._id + "AddTab").ejTab("option", "disabledItemIndex", index);
                }
                else {
                    var index = [];
                    index[0] = proxy._dialogTab.indexOf("Predecessors");
                    $("#" + proxy._id + "AddTab").ejTab("option", "enabledItemIndex", index);
                    //$("#" + proxy._id + "AddTab").find("div.e-content").css("overflow", "visible");
                }                
                newIdInstant = proxy._getNewTaskId();
                if (proxy.model.enableWBS) {
                    var rowPos = model.editSettings.rowPosition.toLowerCase(),
                        newWBSval = proxy._getNewWBSid(rowPos);
                }
                newSerialNo = model.enableSerialNumber && proxy._getNewSerialNumber();
            }
            else {
                var tab = document.getElementById(proxy._id + "EditTab"),
                    dialog = $("#" + proxy._id + "_dialogEdit_wrapper"),
                    form = document.getElementById(proxy._id + "GeneralEditForm"),
                    editTreeGridId = "#treegrid" + proxy._id + "predecessorEdit",
                    noteRteId = "#" + proxy._id + "EditAreaNotes",
                    resourceTreeGridId = "#treegrid" + proxy._id + "resourceEdit",
                    customFieldTreeGridId = "#treegrid" + proxy._id + "customFieldEdit";
                if (model.flatRecords.length <= 2 && model.parentRecords.length == 1
                    && model.predecessorMapping && $(editTreeGridId).length > 0)
                    $("#" + proxy._id + "EditTab").ejTab("removeItem", 1);

            }
            $formElement = $(form).find("input,select");
            length = $formElement.length;
            for (i; i < length; i++) {
                $element = $formElement.eq(i);
                params = {};
                inputWidth = 180;
                column = ej.TreeGrid.getColumnByField(columns, $element.prop("name"));

                if (column)
                    value = args.data[column.field];
                else
                    continue;

                if ($element.hasClass("e-numerictextbox")) {

                    width = inputWidth;
                    params.width = width;
                    params.showSpinButton = true;
                    params.cssClass = model.cssClass;
                    //for parent editing 
                    var tempId = $element[0].id;
                    tempId = tempId.replace(proxy._id, '');
                    if (!ej.isNullOrUndefined(selectedItem) && selectedItem.hasChildRecords && (tempId == "statusEdit" ||tempId == "workEdit")) {
                        params.readOnly = true;
                        $element.closest("td").css("opacity", 0.5);
                    }
                    if (tempId == "statusEdit" || tempId == "statusAdd") {
                            params.maxValue = 100;
                            params.minValue = 0;
                        }
                        if (tempId == "workEdit") {
                            params.change = function (args) {
                                proxy._updatedColumn = "work";
                                proxy._editStartDateChange($(this.element[0]));
                            }
                        }
                    if (value && value.toString().length)
                            params.value = parseFloat(value);
                        else
                        params.value = 0;

                    if (!ej.isNullOrUndefined(column["editParams"]))
                        $.extend(params, column["editParams"]);
                    $element.ejNumericTextbox(params);
                    $element.prop("name", $element.prop("name").replace(proxy._id, ""));
                }
                else if ($element.hasClass("e-datepicker")) {

                    params.width = inputWidth;
                    params.cssClass = model.cssClass;
                    params.dateFormat = model.dateFormat;
                    params.locale = model.locale;
                    params.startDay = model.scheduleHeaderSettings.weekStartDay;
                    params.change = function (args) {
                        this.option("value", args.value);
                        proxy._updatedColumn = this.element[0].name;
                        proxy._editStartDateChange(this.element, args);
                        var tempId = this.element[0].id;
                        tempId = tempId.replace(proxy._id, '');
                        if (tempId == "startDateEdit" || tempId == "endDateEdit")
                            proxy._datePickerChangeEvent = true;
                    };
                    var tempId = $element[0].id;
                    tempId = tempId.replace(proxy._id, '');
                    if (!ej.isNullOrUndefined(selectedItem) && selectedItem.hasChildRecords && selectedItem.isAutoSchedule && (tempId == "startDateEdit" || tempId == "endDateEdit") && args.requestType !== "add") {
                        params.readOnly = true;
                        $element.closest("td").css("opacity", 0.5);
                    }

                    if ((value && value.toString().length) || (model.allowUnscheduledTask && args.requestType == "beginedit"))
                        params.value = proxy._getDateFromFormat(value);                    
                    else {
                        var date = proxy._getDateFromFormat(model.scheduleStartDate);
                        if (column.field == "endDate" && model.viewType == ej.Gantt.ViewType.ResourceView)
                            date.setDate(date.getDate() + 1);
                        params.value = date;
                    }

                    if (column["format"] !== undefined && column.format.length > 0) {
                        toformat = new RegExp("\\{0(:([^\\}]+))?\\}", "gm");
                        formatVal = toformat.exec(column.format);
                        params.dateFormat = formatVal[2];
                        params.value =  ej.isNullOrUndefined(params.value) ? null : ej.format(new Date(params.value), params.dateFormat, params.locale);
                        $element.val(params.value);
                    }
                    if (!ej.isNullOrUndefined(column["editParams"]))
                        $.extend(params, column["editParams"]);

                    $element.ejDatePicker(params);
                }
                else if ($element.hasClass("e-datetimepicker")) {

                    params = {
                        width: inputWidth,
                        rtl: model.rtl,
                        locale: model.locale,
                            cssClass: model.css,
                            dateTimeFormat: model.dateFormat,
                            startDay : model.scheduleHeaderSettings.weekStartDay
                        };
                        params.change = function (args) {
                            proxy._updatedColumn = this.element[0].name;
                            if (this._prevDateTimeVal)
                                proxy._editStartDateChange(this.element, args);
                            var tempId = this.element[0].id;
                            tempId = tempId.replace(proxy._id, '');
                            if (tempId == "startDateEdit" || tempId == "endDateEdit")
                                proxy._datePickerChangeEvent = true;
                        };
                        var tempId = $element[0].id;
                        tempId = tempId.replace(proxy._id, '');
                        if (!ej.isNullOrUndefined(selectedItem) && selectedItem.hasChildRecords && selectedItem.isAutoSchedule && selectedItem.isAutoSchedule && (tempId == "startDate" || tempId == "endDate") && args.requestType !== "add") {
                            params.readOnly = true;
                            $element.closest("td").css("opacity", 0.5);
                        }
                        if (model.viewType == ej.Gantt.ViewType.ResourceView && value.toString().length == 0) {
                            var date = proxy._getDateFromFormat(model.scheduleStartDate);
                            if (column.field == "endDate")
                                date.setDate(date.getDate() + 1);
                            params.value = date;
                        }
                        else
                            params.value = proxy._getDateFromFormat(value);
                        if (!ej.isNullOrUndefined(column["editParams"]))
                            $.extend(params, column["editParams"]);

                        $element.ejDateTimePicker(params);
                    }
                else if ($element.hasClass("e-dropdownlist")) {

                    var dataSource = column.dropdownData;
                    if (column.field === "resourceInfo") {
                        $element.ejDropDownList({
                            cssClass: model.cssClass,
                            width: inputWidth,
                            showCheckbox: true,
                            dataSource: dataSource,
                            fields: { id: model.resourceIdMapping, text: model.resourceNameMapping, value: model.resourceNameMapping },
                            selectedItems: args.requestType == "add" ? proxy._getResourceInfoIndex(args.data.resourceInfo, this._resourceCollection) : proxy.getIndexofresourceInfo(dataSource, args.data)
                            });
                        }                       
                        else {
                            var controlArgs = {};
                            controlArgs.cssClass = model.cssClass;
                            controlArgs.width = inputWidth;
                            controlArgs.dataSource = dataSource;
                            controlArgs.value = value;
                            controlArgs.change = function (args) {
                                proxy._updateEditDialogFields(this);
                            };
                            if (!ej.isNullOrUndefined(column["editParams"]))
                                $.extend(controlArgs, column["editParams"]);
                            if ($element.val.length) {
                                if (column.field == "taskMode") {                                   
                                    var value = args.requestType == "beginedit" ? !args.data.isAutoSchedule : model.taskSchedulingMode == "manual" ? true : false;
                                    controlArgs.value = value.toString();
                                }
                                else if (column.field == "taskType") {
                                    controlArgs.value = args.requestType == "beginedit" ? args.data.taskType : proxy.model.taskType;                                    
                                }
                                else if (column.field == "effortDriven") {
                                    controlArgs.value = args.requestType == "beginedit" ? args.data.effortDriven : model.taskType == "fixedWork" ? true : false;                                   
                                }
                            }
                            if (args.requestType == "beginedit" && !args.data.isAutoSchedule && (column.field == "taskType" || column.field == "effortDriven"))
                                controlArgs.enabled = false;
                            if (args.data.taskType == "fixedWork" && column.field == "effortDriven")
                                controlArgs.enabled = false;
                            if (args.requestType == "add" && column.field == "effortDriven" && model.taskType == "fixedWork")
                                controlArgs.enabled = false;
                            if ((column.field == "taskType" || column.field == "effortDriven") && args.data.hasChildRecords)
                                controlArgs.enabled = false;
                            if (column.field == "taskMode" && model.taskSchedulingMode != ej.Gantt.TaskSchedulingMode.Custom)
                                controlArgs.enabled = false;
                            $element.val(controlArgs.value);
                            $element.ejDropDownList(controlArgs);

                            var obj = $element.ejDropDownList("instance");
                            obj._setValue($element.val());

                        }
                    }
                else if ($element.hasClass("e-maskedit")) {
                    var controlArgs = {};
                    controlArgs.locale = model.locale;
                    controlArgs.cssClass = model.cssClass;
                    controlArgs.width = inputWidth;
                    if (!ej.isNullOrUndefined(column["editParams"]))
                        $.extend(controlArgs, column["editParams"]);

                    $element.ejMaskEdit(controlArgs);
                }   
                else {
                    switch ($element.prop('tagName')) {
                        case "INPUT":

                            if ($element.attr("type") != "checkbox") {
                                //For ID field id is read only

                                if ($element.attr("name") === "taskId") {
                                    if (args.requestType !== "add") {
                                        $element.attr("readonly", "readonly");
                                        $element.css("opacity", 0.5);
                                        $element.val(args.data.taskId);
                                    }
                                    else if (args.requestType === "add") {
                                        if (args.data.taskId == "" || ej.isNullOrUndefined(args.data.taskId))
                                            $element.val(newIdInstant);
                                        else
                                            $element.val(args.data.taskId);
                                    }
                                }
                                else if ($element.attr("name") === "taskName") {
                                    if (args.requestType === "add") {
                                        if (args.data.taskName == "" || ej.isNullOrUndefined(args.data.taskName))
                                            $element.val(proxy._newTaskTexts["newTaskName"] + " " + newIdInstant);
                                        else
                                            $element.val(args.data.taskName);
                                    }
                                    else
                                        $element.val(args.data.taskName);
                                }
                                else if ($element.attr("name") === "duration") {
                                    args.data && $element.val(proxy._getDurationStringValue(args.data));
                                    var durationVal = proxy._getDurationValues(args.data.duration),
                                        durationUnit = ej.isNullOrUndefined(durationVal.durationUnit) ? ej.isNullOrUndefined(args.data.durationUnit)? model.durationUnit : args.data.durationUnit : durationVal.durationUnit;
                                    if (args.requestType !== "add" && args.data.hasChildRecords && args.data.isAutoSchedule) {
                                        $element.attr("readonly", "readonly");
                                        $element.css("opacity", 0.5);
                                    } else if ((args.requestType == "add") && args.data.duration == "") {
                                        $element.val( (model.viewType == ej.Gantt.ViewType.ResourceView ? "1 " : "0 ") + proxy._durationUnitTexts[durationUnit]);
                                    }
                                    else
                                    {
                                        var duration = args.data.duration;
                                        if (typeof duration == "string")
                                            duration = parseFloat(duration);
                                        duration = !isNaN(duration) ? duration : null;
                                        if (ej.isNullOrUndefined(duration))
                                            $element.val("");
                                        else
                                            $element.val(parseFloat(duration.toFixed(2)) + " " + proxy._durationUnitTexts[durationUnit]);
                                    }
                                       

                                        $element.change(function () {
                                            proxy._updatedColumn = "duration";
                                            proxy._editStartDateChange($(this));                                            
                                        });
                                        $element.keyup(function (e) {
                                            if (e.keyCode == 13)
                                            proxy._editStartDateChange($(this));
                                    });
                                }
                                else if ($element.attr("name") === "WBS") {
                                    if (args.requestType !== "add") {
                                        $element.attr("readonly", "readonly").css("opacity", 0.5);
                                        $element.val(args.data.WBS);
                                    }
                                    else if (args.requestType === "add") {
                                        $element.val(newWBSval);
                                        $element.attr("readonly", "readonly").css("opacity", 0.5);
                                    }
                                }
                                else if ($element.attr("name") === "WBSPredecessor")
                                    $element.attr("readonly", "readonly").css("opacity", 0.5);
                                else if ($element.attr("name") === "serialNumber") {
                                    if (args.requestType !== "add") {
                                        $element.attr("readonly", "readonly").css("opacity", 0.5);
                                        $element.val(args.data.serialNumber);
                                    }
                                    else if (args.requestType === "add") {
                                        $element.val(newSerialNo);
                                        $element.attr("readonly", "readonly").css("opacity", 0.5);
                                    }
                                }
                                if ($element.attr("name") === "taskName")
                                    inputWidth = 380;
                                var tempId = $element[0].id;
                                tempId = tempId.replace(proxy._id, '');

                                $element.css("text-align", $element.attr("name") != null && ej.TreeGrid.getColumnByField(columns, $element.prop("name")) != null ?
                                    ej.TreeGrid.getColumnByField(columns, $element.attr("name")).textAlign : "center");
                                $element.outerWidth(inputWidth);
                            } else {
                                var controlArgs = {};
                                controlArgs.cssClass = model.cssClass;
                                controlArgs.size = "medium";
                                if (!ej.isNullOrUndefined(column["editParams"]))
                                    $.extend(params, column["editParams"]);
                                $element.ejCheckBox(controlArgs);
                            }
                            break;

                        case "SELECT":
                            $element.width(inputWidth).height(23);
                            break;
                    }
                }
                if (!$element.is(":disabled") && !elementFocused && (!$element.is(":hidden") || typeof $element.data("ejDropDownList") == "object")) {
                    if (!proxy._isEnterKeyPressed) {
                        proxy._focusElements($element.closest('td'));
                        elementFocused = true;
                    }
                }
            }
            //render prdecessor table in edit dialog
            if (model.predecessorMapping && $(editTreeGridId).length) {
                var ds = [];
                proxy._taskNameCollection();
                if (args.requestType !== "add") {
                    ds = proxy._predecessorEditCollection(selectedItem);
                    proxy._getPredecessorDropdownData(ds, args.data);
                }
                var types = proxy._predecessorCollectionText,
                    idTitle = model.enableSerialNumber ? proxy._columnHeaderTexts["serialNumber"] : proxy._columnHeaderTexts["taskId"];

                $(editTreeGridId).ejTreeGrid({
                    dataSource: ds,
                    allowSorting: false,
                    columns: [{
                        headerText: idTitle, field: "id", editType: ej.TreeGrid.EditingType.Dropdown, dropdownData: proxy._preTableCollection, width: "89px",
                        editParams: { fields: { text: "value", value: "value"}, change: $.proxy(proxy._preEditDialogChangeEvent, proxy, editTreeGridId, args.requestType, "id")  }
                    },
                    {
                        headerText: proxy._columnHeaderTexts["taskName"], field: "name", editType: ej.TreeGrid.EditingType.Dropdown, dropdownData: proxy._preTableCollection, width: "300px",
                        editParams: {
                            fields: { text: "text", value: "value" }, change: $.proxy(proxy._preEditDialogChangeEvent, proxy, editTreeGridId, args.requestType, "name"),
                            create: function (args) {
                                var treegridObj = $(editTreeGridId).data("ejTreeGrid"),
                                    data = treegridObj.model.selectedItem;
                                if (data.id == "") {
                                    var fields = this.model.fields,
                                        value = this.model.dataSource[0];
                                    if (value)
                                        $(this.element).attr("data-cellvalue", value[fields.value]);
                                }
                            }
                        }
                    },
                              { headerText: proxy._columnHeaderTexts["type"], field: "type", editType: ej.TreeGrid.EditingType.Dropdown, dropdownData: types, width: "141px" },
                              { headerText: proxy._columnHeaderTexts["offset"], field: "offset", editType: ej.TreeGrid.EditingType.String, width: "88px" }],
                    enableAltRow: false,
                    allowColumnResize: true,
                    editSettings: {
                        allowAdding: true,
                        allowDeleting: true,
                        allowEditing: true,
                        editMode: "cellEditing",
                        rowPosition: "bottom",
                        beginEditAction: ej.TreeGrid.BeginEditAction.Click
                    },
                    locale: model.locale,
                    endEdit: $.proxy(proxy._preEndEdit, proxy, editTreeGridId, args.requestType),
                    beginEdit: $.proxy(proxy._preBeginEdit, proxy, editTreeGridId, args),
                    rowSelected: $.proxy(proxy._enableDisablePredecessorDelete, proxy, args.requestType),
                    actionBegin: function (args) {
                        if (args.requestType == "delete" || args.requestType == "sorting") {
                            this.model.columns[0].dropdownData = proxy._preTableCollection;
                            this.model.columns[1].dropdownData = proxy._preTableCollection;
                        }
                    },
                    actionComplete: function (eventArgs) {
                        if (eventArgs.requestType == "delete") {
                            proxy._enbleDisablePredecessorAddButton('enable', args.requestType);
                            if (eventArgs.model.updatedRecords.length > 0)
                                proxy._enbleDisablePredecessorDeleteButton('enable', args.requestType);
                            else
                                proxy._enbleDisablePredecessorDeleteButton('disable', args.requestType);
                        }
                    },
                    treeColumnIndex: 5,
                    predecessorTable: proxy._isFromGantt,
                    sizeSettings: { width: "620px", height: "198px" },
                    isResponsive: false,
                    cssClass: model.cssClass
                });

                if (model.selectedItem && model.selectedItem.hasChildRecords && args.requestType !== "add") {
                    proxy._enbleDisablePredecessorDeleteButton('disable', args.requestType);
                    proxy._enbleDisablePredecessorAddButton('disable', args.requestType);
                }
                else if (args.requestType !== "add" && proxy._preTableCollection.length == ds.length) {
                    proxy._enbleDisablePredecessorAddButton('disable', args.requestType);
                }                
                else {
                    proxy._enbleDisablePredecessorDeleteButton('disable', args.requestType);
                    proxy._enbleDisablePredecessorAddButton('enable', args.requestType);
                }
            }

            //Render resource table in add and edit dialog
            if (model.resourceInfoMapping && $(resourceTreeGridId).length) {
                var resourceData = [],
                    resources = this._resourceCollection,
                    resoruce = $.extend(true, [], resources);
                if (args.requestType != "add") {
                    var resource = args.data.resourceInfo,
                        length = resource ? resource.length : 0;
                    for (var i = 0; i < length; i++) {
                        resourceData.push({ "name": resource[i][model.resourceIdMapping], "unit": resource[i][model.resourceUnitMapping] });
                    }
                }
                else if (args.data.resourceInfo.length != 0) {
                    var ganttRecord = new ej.Gantt.GanttRecord();
                    ganttRecord.item = args.data;
                    var resourceCollection = resources, resourceInfo = args.data.resourceInfo;
                    ganttRecord.resourceInfo = resourceInfo && ganttRecord._setResourceInfo(resourceInfo, model.resourceIdMapping, model.resourceNameMapping, model.resourceUnitMapping, resourceCollection);
                    var resource = ganttRecord.resourceInfo,
                        length = resource ? resource.length : 0;
                    for (var i = 0; i < length; i++) {
                        resourceData.push({ "name": resource[i][model.resourceIdMapping], "unit": resource[i][model.resourceUnitMapping] });
                    }
                }
                var resoruce = $.extend(true, [], resources);
                $(resourceTreeGridId).ejTreeGrid({
                    dataSource: resourceData,
                    columns: [{
                        headerText: proxy._columnHeaderTexts["resourceInfo"], field: "name", width: "309px",
                        editType: ej.TreeGrid.EditingType.Dropdown, dropdownData: resoruce, editParams: {
                            fields: { text: model.resourceNameMapping, value: model.resourceIdMapping },
                            create: function (args) {
                                var treegridObj = $(resourceTreeGridId).data("ejTreeGrid"),
                                    data = treegridObj.model.selectedItem;
                                if (data.name == "") {
                                    var fields = this.model.fields,
                                        value = this.model.dataSource[0];
                                    if (value)
                                        $(this.element).attr("data-cellvalue", value[fields.value]);
                                }
                            }
                        }
                    },
                              {
                                  headerText: proxy._columnHeaderTexts["unit"], field: "unit", width: "309px",
                                  editType: ej.TreeGrid.EditingType.Numeric, visible: (model.viewType == ej.Gantt.ViewType.ResourceView) ? false : true, headerTextAlign: "center"
                              }
                    ],
                    enableAltRow: false,
                    allowColumnResize: true,
                    editSettings: {
                        allowAdding: true,
                        allowDeleting: true,
                        allowEditing: true,
                        editMode: "cellEditing",
                        beginEditAction: ej.TreeGrid.BeginEditAction.Click
                    },
                    locale: model.locale,
                    beginEdit: $.proxy(proxy._resourceBeginEdit, proxy, resourceTreeGridId, args.requestType),
                    rowSelected: $.proxy(proxy._enableDisableResouceDelete, proxy, args.requestType),
                    actionBegin: function (args) {
                        if (args.requestType == "delete" || args.requestType == "sorting")
                            this.model.columns[0].dropdownData = $.extend(true, [], resources);
                    },
                    actionComplete: function (eventArgs) {
                        if (eventArgs.requestType == "delete") {
                            proxy.enbleDisableAddResourceButton('enable', args.requestType);
                            if (eventArgs.model.updatedRecords.length > 0)
                                proxy.enbleDisableDeleteResourceButton('enable', args.requestType);
                            else
                                proxy.enbleDisableDeleteResourceButton('disable', args.requestType);
                        }
                    },
                    treeColumnIndex: 3,
                    resourceTable: proxy._isFromGantt,
                    sizeSettings: { width: "620px", height: "198px" },
                    isResponsive: false,
                    cssClass: model.cssClass
                });
                if (args.requestType !== "add" && resourceData.length == resources.length) {
                    proxy.enbleDisableDeleteResourceButton('enable', args.requestType);
                    proxy.enbleDisableAddResourceButton('disable', args.requestType);
                }
                else {
                    proxy.enbleDisableDeleteResourceButton('disable', args.requestType);
                    proxy.enbleDisableAddResourceButton('enable', args.requestType);
                }
            }
            //Render custom field tab in add and edit dialog
            if ($(customFieldTreeGridId).length) {
                if (args.requestType == "add") {
                    var customColumns = proxy._addDialogCustomColumns,
                        gridData = [],
                        id = 0,
                        length = customColumns.length;
                    for (var i = 0; i < length; i++) {
                        id++;
                        var data = {};
                        data.id = id;
                        data.field = customColumns[i].field;
                        data.headerText = customColumns[i].headerText;
                        data.value = args.data[customColumns[i].field];
                        data.text = args.data[customColumns[i].field];
                        data.editType = customColumns[i].editType ? customColumns[i].editType.toLowerCase() : "stringedit";
                        gridData.push(data);
                    }
                }
                else {
                    var customColumns = proxy._editDialogCustomColumns,
                        gridData = [],
                        id = 0,
                        length = customColumns.length;
                    for (var i = 0; i < length; i++) {
                        id++;
                        var data = {};
                        data.id = id;
                        data.field = customColumns[i].field;
                        data.headerText = customColumns[i].headerText;
                        data.value = args.data[customColumns[i].field];

                        data.editType = customColumns[i].editType ? customColumns[i].editType.toLowerCase() : "stringedit";
                        if (customColumns[i].editType.toLowerCase() == "dropdownedit") {
                            data.text = ej.isNullOrUndefined(args.data[customColumns[i].field]) ? "" : proxy._getDropDownText(customColumns[i], args.data[customColumns[i].field]);
                        }
                        else
                            data.text = args.data[customColumns[i].field];
                        gridData.push(data);
                    }
                }
                $(customFieldTreeGridId).ejTreeGrid({
                    dataSource: gridData,
                    allowSorting: false,
                    locale: model.locale,
                    enableAltRow: false,
                    rowHeight:30,
                    columns: [{ headerText: proxy._columnHeaderTexts["dialogCustomFieldName"], field: "headerText", allowEditing: false },
                              { headerText: "Original Value", field: "value", visible: false },
                              { headerText: "Field", field: "field", visible: false },
                              {
                                  headerText: proxy._columnHeaderTexts["dialogCustomFieldValue"], field: "text",
                                  editTemplate: {
                                      create: function () {
                                          return "<input style='width:100%;'>";
                                      },
                                      read: $.proxy(proxy._customColumnRead, proxy, customFieldTreeGridId),
                                      write: $.proxy(proxy._customColumnWrite, proxy, customColumns, customFieldTreeGridId),
                                  }
                              }
                    ],
                    allowColumnResize: true,
                    editSettings: {
                        allowAdding: true,
                        allowDeleting: true,
                        allowEditing: true,
                        editMode: "cellEditing",
                        beginEditAction: ej.TreeGrid.BeginEditAction.Click
                    },
                    sizeSettings: { width: "620px", height: "234px" },
                    isResponsive: false,
                    cssClass: model.cssClass
                });
            }
            //Render the RTE control for notes tab.
            if (model.notesMapping && $(noteRteId).length) {
                var value;
                if (args.requestType == "add")
                    value = args.data.notes;
                else {
                    var htmlText = args.data.item[model.notesMapping];
                    value = htmlText;
                }
                $(noteRteId).ejRTE({
                    width: "620px", isResponsive: false, height: "281px", value: value,
                    locale: model.locale,
                    cssClass: model.cssClass,
                    tools: {
                        font: ["fontName", "fontSize", "fontColor", "backgroundColor"],
                        style: ["bold", "italic", "underline", "strikethrough"],
                        alignment: ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull"],
                        doAction: ["undo", "redo"],
                        indenting: [],
                        clear: [],
                        links: ["createLink", "removeLink"],
                        images: [],
                        media: [],
                        tables: [],
                        lists: ["unorderedList"],
                        clipboard: [],
                        edit: [],
                        formatStyle: [],
                        view: []
                    }
                });
                $(noteRteId + "_wrapper").find(".e-toolbar.e-toolbarspan").css("border-bottom", "none"); // Remove the border bottom of rich text editor toolbar.
                $(noteRteId + "_editor").height("208");
                $(noteRteId + "_Iframe")[0].style.height = "203px";
                $(dialog).removeClass("e-rte");
            }
        },
        //updated the status of predecessor delelte button in dialog box
        _enbleDisablePredecessorDeleteButton: function (args, dialogType) {
            var proxy = this,
                 predecessorDelete;
            if (dialogType == "add")
                predecessorDelete = $("#" + proxy._id + "AddDialog_PredecesorDelete");
            else
                predecessorDelete = $("#" + proxy._id + "EditDialog_PredecesorDelete");
            if (args === "enable") {
                $(predecessorDelete).unbind("click", $.proxy(proxy._deletepredecessor, proxy)).bind("click", $.proxy(proxy._deletepredecessor, proxy));
                $(predecessorDelete).addClass('e-enable').removeClass('e-disable');
            }
            else {
                $(predecessorDelete).unbind("click", $.proxy(proxy._deletepredecessor, proxy));
                $(predecessorDelete).addClass('e-disable').removeClass('e-enable');
            }
        },

        //updated the status of predecessor button in dialog box
        _enbleDisablePredecessorAddButton: function (args, dialogType) {
            var proxy = this,
                predecessorAdd = "";
            if (dialogType == "add")
                predecessorAdd = $("#" + proxy._id + "AddDialog_PredecesorAdd");
            else
                predecessorAdd = $("#" + proxy._id + "EditDialog_PredecesorAdd");

            if (args === "enable") {
                $(predecessorAdd).unbind("click", $.proxy(proxy._addpredecessor, proxy)).bind("click", $.proxy(proxy._addpredecessor, proxy));
                $(predecessorAdd).addClass('e-enable').removeClass('e-disable');
            }
            else {
                $(predecessorAdd).unbind("click", $.proxy(proxy._addpredecessor, proxy));
                $(predecessorAdd).addClass('e-disable').removeClass('e-enable');
            }
        },

        //updated the status of predecessor button in dialog box
        _disablePredecessorAddButton: function (treeGridId, dialogType) {
            var proxy = this;
            var table = $(treeGridId + "e-table");
            var flag = false;
            var len = table[0].rows.length;
            proxy._enbleDisablePredecessorAddButton('disable', dialogType);
            for (var j = 0; j < len; j++) {
                var currentRow = table[0].rows[j];
                if (currentRow.cells.length === 4)
                    if (currentRow.cells[1].innerText === "") {
                        flag = true;
                    }
            }
            if (!flag) {
                proxy._enbleDisablePredecessorAddButton('enable', dialogType);
            }
        },

        //Dynamically update input elements fields in add/edit dialog box according with another fields change.
        _updateEditDialogFields: function (editObj) {
            var proxy = this,
                typeObj, effortDrivenObj,
                reuestType = $(editObj.element).attr("data-dialog");
            if (reuestType == "Add") {
                effortDrivenObj = $("#" + proxy._id + "effortDrivenAdd").data("ejDropDownList");
                typeObj = $("#" + proxy._id + "taskTypeAdd").data("ejDropDownList");
            }
            else {
                effortDrivenObj = $("#" + proxy._id + "effortDrivenEdit").data("ejDropDownList");
                typeObj = $("#" + proxy._id + "taskTypeEdit").data("ejDropDownList");
            }
            if (!ej.isNullOrUndefined(effortDrivenObj) && editObj._name == "taskType") {
                if (editObj.model.value == "fixedWork") {
                    effortDrivenObj.selectItemByValue("true");
                    effortDrivenObj.disable();
                }
                else
                    effortDrivenObj.enable();

                proxy._editedDialogRecord[editObj._name] = editObj.model.value;
            }
            if (editObj._name == "taskMode") {
                if (editObj.model.text == "Auto") {
                    if (!ej.isNullOrUndefined(effortDrivenObj) && !ej.isNullOrUndefined(typeObj) && typeObj.model.value != "fixedWork")
                        effortDrivenObj.enable();
                    if (!ej.isNullOrUndefined(typeObj))
                        typeObj.enable();
                    proxy._editedDialogRecord["isAutoSchedule"] = true;
                }
                if (editObj.model.text == "Manual") {
                    if (!ej.isNullOrUndefined(effortDrivenObj))
                        effortDrivenObj.disable();
                    if (!ej.isNullOrUndefined(typeObj))
                        typeObj.disable();
                    proxy._editedDialogRecord["isAutoSchedule"] = false;
                }
            }

        },

        _customColumnWrite: function (customColumns, gridId, args) {
            var proxy = this,
                value = args.rowdata !== undefined ? args.rowdata["text"] : "",
                gridModel = $(gridId).ejTreeGrid("instance").model,
                column = customColumns[gridModel.selectedRowIndex],
                editParams = {};
            if (column.editParams)
                editParams = $.extend(true, {}, column.editParams);
            editParams.value = value;
            editParams.locale = proxy.model.locale;
            switch (args.rowdata.editType.toLowerCase()) {

                case "numericedit":
                    editParams.height = "25px";
                    args.element.ejNumericTextbox(editParams);
                    break;
                case "stringedit":
                    $(args.element).val(value).css({ "padding": "0px", "border": "0px", "height": "25px" }).addClass("e-ejinputtext");
                    break;
                case "datepicker":
                    editParams.width = "100%";
                    editParams.height = "25px";
                    editParams.startDay = proxy.model.scheduleHeaderSettings.weekStartDay;
                    args.element.ejDatePicker(editParams);
                    break;
                case "datetimepicker":
                    editParams.width = "100%";
                    editParams.height = "25px";
                    editParams.startDay = proxy.model.scheduleHeaderSettings.weekStartDay;
                    args.element.ejDateTimePicker(editParams);
                    break;
                case "maskedit":
                    editParams.width = "100%";
                    editParams.height = "25px";
                    args.element.ejMaskEdit(editParams);
                    break;
                case "dropdownedit":
                    editParams.width = "100%";
                    editParams.height = "25px";
                    editParams.dataSource = column.dropdownData;
                    editParams.value = gridModel.currentViewData[gridModel.selectedRowIndex].value;
                    args.element.ejDropDownList(editParams);
                    break;
                case "booleanedit":
                    editParams.cssClass = proxy.model.cssClass;
                    editParams.size = "small";
                    editParams.checked = value;
                    args.element.ejCheckBox(editParams);
                    var parentElement = args.element.parent(".e-chkbox-wrap"),
                                formElement = parentElement.parent("form");

                    if (formElement.length > 0)
                        formElement.css("margin-left", "45%");
                    else
                        parentElement.css("margin-left", "45%");
                    break;
            }
        },

        _customColumnRead: function (gridId, args) {
            var value, text,
                treeGrid = $(gridId).ejTreeGrid("instance"),
                selectedRowIndex = treeGrid.model.selectedRowIndex,
                updatedRecords = treeGrid.model.updatedRecords;
            $(args).blur();
            $(args).focusout();
            if ($(args[0]).hasClass("e-numerictextbox"))
                value = text = $(args).ejNumericTextbox("getValue");
            else if ($(args[0]).hasClass("e-datepicker"))
                value = text = $(args).ejDatePicker("getValue");
            else if ($(args[0]).hasClass("e-datepicker"))
                value = text = $(args).ejDatePicker("getValue");
            else if ($(args[0]).hasClass("e-dattimeepicker"))
                value = text = $(args).ejDateTimePicker("getValue");
            else if ($(args[0]).hasClass("e-maskedit"))
                value = text = $(args[0]).ejMaskEdit("model.value");
            else if ($(args[0]).hasClass("e-dropdownlist")) {
                text = $(args[0]).ejDropDownList("model.text");
                value = ($(args[0]).ejDropDownList("model.showCheckbox") == false && $(args[0]).ejDropDownList("model.multiSelectMode") == ej.MultiSelectMode.None) ? $(args[0]).ejDropDownList("model.itemValue") : $(args[0]).ejDropDownList("getSelectedValue");
            }
            else if ($(args[0]).hasClass("e-checkbox")) {
                value = text = $(args[0]).ejCheckBox('isChecked');
            }
            else
                value = text = $(args).val();
            updatedRecords[selectedRowIndex].value = updatedRecords[selectedRowIndex].item.value = value;
            updatedRecords[selectedRowIndex].text = updatedRecords[selectedRowIndex].item.text = text;
            treeGrid.refreshRow(selectedRowIndex);
            return text;
        },

        //updated the status of add button in dialog box
        _enableDisableResourceAddButton: function (args,enableResourceAdd,dialogType) {
            var proxy = this,
                dataSource = args.model.dataSource,
                flag = false;
            proxy.enbleDisableAddResourceButton('disable', dialogType);
            if (enableResourceAdd) {
                var index = $.map(dataSource, function (data, index) {
                    if (data.name == "" || data.name == null) {
                        return index;
                    }
                });
                if (index.length > 0 && dataSource.length > 0)
                    flag = true;
                if (!flag) {
                    proxy.enbleDisableAddResourceButton('enable', dialogType);
                }
            }
        },
        //add empty row in predecessor grid in dialog box
        _addpredecessor: function (e) {
            var proxy = this,
                args = {}, treeGridId, treeObject, treegridModel,
                item = { id: "", name: "", type: "Finish-Start", offset: "0" };

            if ($(e.target).hasClass("e-edit-dialog"))
                treeGridId = "#treegrid" + proxy._id + "predecessorEdit";
            else
                treeGridId = "#treegrid" + proxy._id + "predecessorAdd";

            treeObject = $(treeGridId).ejTreeGrid("instance");
            treegridModel = treeObject.model;
            treeObject.saveCell();
            treeObject.clearSelection(treegridModel.selectedRowIndex);
            treeObject.addRow(item, "bottom");
            treeObject.cellEdit(treegridModel.selectedRowIndex, treegridModel.columns[1].field);
        },
        
        //delete predecessor in dialog box 
        _deletepredecessor: function (e) {
            var proxy = this, treeGridId, treegridModel,
                args = {};

            if ($(e.target).hasClass("e-edit-dialog"))
                treeGridId = "#treegrid" + proxy._id + "predecessorEdit";
            else
                treeGridId = "#treegrid" + proxy._id + "predecessorAdd";

            var treeObject = $(treeGridId).data("ejTreeGrid"),
                treegridModel = treeObject.model,
                selectedRowIndex = treeObject.selectedRowIndex();

            args["requestType"] = ej.TreeGrid.Actions.Delete;
            if (selectedRowIndex !== -1) {
                treeObject.deleteRow();
                var length = treegridModel.updatedRecords.length,
                    index = length > selectedRowIndex ? selectedRowIndex : length - 1;
                if (index > -1)
                    treeObject.selectRows(index);
            }
        },

         //updated the status of Resource button in dialog box
        enbleDisableDeleteResourceButton:function(args,dialogType)
        {
            var proxy = this, predecessorDelete;
            if (dialogType == "add")
                predecessorDelete = $("#" + proxy._id + "AddDialog_ResourceDelete");
            else
                predecessorDelete = $("#" + proxy._id + "EditDialog_ResourceDelete");
            if(args==="enable")
            {
                $(predecessorDelete).unbind("click", $.proxy(proxy._deleteResource, proxy)).bind("click", $.proxy(proxy._deleteResource, proxy));
                $(predecessorDelete).addClass('e-enable').removeClass('e-disable');
            }
            else {
                $(predecessorDelete).unbind("click", $.proxy(proxy._deleteResource, proxy));
                $(predecessorDelete).addClass('e-disable').removeClass('e-enable');
            }
        },
        //updated the status of Resource button in dialog box
        enbleDisableAddResourceButton: function (args,dialogType)
        {
            var proxy = this, resourceAdd;
            if (dialogType == "add")
                resourceAdd = $("#" + proxy._id + "AddDialog_ResourceAdd");
            else
                resourceAdd = $("#" + proxy._id + "EditDialog_ResourceAdd");
            if (args === "enable") {
                $(resourceAdd).unbind("click", $.proxy(proxy._addResource, proxy)).bind("click", $.proxy(proxy._addResource, proxy));
                $(resourceAdd).addClass('e-enable').removeClass('e-disable');
            }
            else {
                $(resourceAdd).unbind("click", $.proxy(proxy._addResource, proxy));
                $(resourceAdd).addClass('e-disable').removeClass('e-enable');
            }
        },

        //add empty row in predecessor grid in dialog box
        _addResource: function (e) {
            var proxy = this,
                args = {}, treeGridId, treegridObject, treegridModel,
                item = { name: "", unit: 100 }, dialogType;
            if ($(e.target).hasClass("e-edit-dialog"))                
                treeGridId = "#treegrid" + proxy._id + "resourceEdit";           
            else                
                treeGridId = "#treegrid" + proxy._id + "resourceAdd";            
            
            treegridObject = $(treeGridId).ejTreeGrid("instance");
            treegridModel = treegridObject.model;
            treegridObject.saveCell();
            treegridObject.clearSelection(treegridModel.selectedRowIndex);
            treegridObject.addRow(item, "bottom");
            treegridObject.cellEdit(treegridModel.selectedRowIndex, treegridModel.columns[0].field);                        
        },
        //delete predecessor in dialog box 
        _deleteResource: function (e) {
            var proxy = this, treeGridId;

            if ($(e.target).hasClass("e-edit-dialog"))
                treeGridId = "#treegrid" + proxy._id + "resourceEdit";
            else
                treeGridId = "#treegrid" + proxy._id + "resourceAdd";

            var treeObject = $(treeGridId).data("ejTreeGrid"),
                model = treeObject.model,
                selectedRowIndex = treeObject.selectedRowIndex();
            var args = {};
            args["requestType"] = ej.TreeGrid.Actions.Delete;
            if (selectedRowIndex !== -1) {
                treeObject.deleteRow();
                var length = model.updatedRecords.length,
                    index = length > selectedRowIndex ? selectedRowIndex : length - 1;
                if (index > -1)
                    treeObject.selectRows(index);
            }
        },

        _resourceBeginEdit: function (gridId, dialogType, args) {
            var proxy = this,
                idMapping = proxy.model.resourceIdMapping,
                gridModel = args.model,
                 columns = gridModel.columns,
                 resources = this._resourceCollection,
                 dropDownData = columns[0].dropdownData = $.extend(true, [], resources),
                 dataSource = gridModel.dataSource,
                 length = dataSource.length,
                 value = args.data.item.name;

            for (var i = 0; i < length; i++) {
                if (value != dataSource[i].name) {
                    var index = $.map(dropDownData, function (data, index) {
                        if (data[idMapping].toString() == dataSource[i].name) {
                            return index;
                        }
                    });
                    dropDownData.splice(index[0], 1);
                }
            }
            if (dropDownData.length <= 1)
                proxy.enbleDisableAddResourceButton('disable', dialogType);                
        },
        //returns column value by field name
        getColumnIndexByField: function (field) {

            var proxy = this,
                columns = proxy.model.columns,
                length = columns.length,
                column = 0;

            for (column; column < length; column++) {

                if (columns[column]["field"] == field) break;

            }

            return column;
        },

        //returns selected resource index from rource value
        getIndexofresourceInfo: function (dataSource,data) {
            var resourceInfo = data.resourceInfo,
                count = 0, length = resourceInfo ? resourceInfo.length : 0, resourceIndex = [];
            
            for (count; count < length; count++) {
                if (dataSource.indexOf(resourceInfo[count]) != -1)
                    resourceIndex.push(dataSource.indexOf(resourceInfo[count]));
            }

            return resourceIndex;

        },
        //focus elements on editing
        _focusElements: function ($currentCell) {
            if ($currentCell.length) {
                $currentCell.focus();
                var $childElem = $currentCell.children();
                if ($childElem[0].tagName.toLowerCase() == "select" || $childElem[0].tagName.toLowerCase() == "input") {
                    $childElem.focus().select();
                    $childElem[0].focus();
                }
                else if ($childElem.find(".e-field.e-dropdownlist").length)
                    $childElem.find(".e-ddl").focus();
                else
                    $childElem.find('input,select').select().focus();
            }
        },
        //add button templates for add and edit dialog
        renderDiaglogButton: function (type, tbody) {

            var btnId,
                proxy = this,
                model = proxy.model;
            if (type == "edit")
                btnId = "EditDialog_";
            else
                btnId = "AddDialog_";

            var savebtn = ej.buildTag('input', "",
                 {
                     'border-radius': '3px',
                     "min-width": "70px"
                 },
                 { type: "button", id: btnId + proxy._id + "_Save" }),
             saveText = type == "edit" ? proxy._editDialogTexts["saveButton"] : proxy._editDialogTexts["addButton"];
            
            savebtn.ejButton(
                {
                    cssClass: model.cssClass,
                    text: saveText,
                    width: "auto"
                });

            var cancelText = proxy._editDialogTexts["cancelButton"],
             cancelbtn = ej.buildTag('input', "",
                 {
                     'margin-left': '18px',
                     'border-radius': '3px',
                     "min-width": "70px"
                 },
                 {
                     type: "button",
                     id: btnId + proxy._id + "_Cancel"
                 });
            
            cancelbtn.ejButton(
                {
                    cssClass: model.cssClass,
                    text: cancelText,
                    width: "auto"
                });

            //Sample delete button
            var deleteText = proxy._editDialogTexts["deleteButton"],
                delbtn = ej.buildTag('input', "",
                {
                    'border-radius': '3px',
                    "min-width": "90px"
                },
                {
                    type: "button",
                    id: "EditDialog_" + proxy._id + "_Delete"
                });

            delbtn.ejButton(
                {
                    cssClass: model.cssClass,
                    text: deleteText,
                    width: "auto"
                });



            var btnDiv = ej.buildTag('div', "", { 'float': 'right',"z-index":"10" }, { 'class': "e-editform-btn e-editfrom-btn-right" });
            var deleteBtnDiv = ej.buildTag('div', "", { 'float': 'left', "z-index": "10" }, { 'class': "e-editform-btn e-editfrom-btn-left" });

            btnDiv.append(savebtn);
            if (type == "edit" && model.editSettings.allowDeleting)
                deleteBtnDiv.append(delbtn);
            btnDiv.append(cancelbtn);
            btnDiv.appendTo(tbody);
            deleteBtnDiv.appendTo(tbody);
            return tbody;
        },
        //Tool bar rendering initiated
        _renderToolBar: function() {
            var proxy = this,
                model = proxy.model,
                $div = ej.buildTag("div.e-gantttoolbar#e-gantttoolbar" + proxy._id, "", { 'height': '50px' }, { id: proxy._id + "_toolbarItems" });                
            if (!ej.isNullOrUndefined(model.toolbarSettings.toolbarItems) && model.toolbarSettings.toolbarItems.length) {
                var $ul = ej.buildTag("ul", "", {}, {});
                proxy._renderLi($ul);
                $div.append($ul);
            }
            if (!ej.isNullOrUndefined(model.toolbarSettings.customToolbarItems) && model.toolbarSettings.customToolbarItems.length) {
                var $customUl = ej.buildTag("ul", "", {}, {});
                proxy._renderCustomLi($customUl);
                $div.append($customUl);
            }
            if (model.toolbarSettings.toolbarItems.indexOf(ej.Gantt.ToolbarItems.Search) != -1) {
                    var $searchUl = ej.buildTag("ul.e-gantt-search-container", "", {'float':'right'}, {}),
                    $li = ej.buildTag("li", "", {}, {
                        id: proxy._id + "_" + ej.Gantt.ToolbarItems.Search,
                        "tabindex": "0"
                    });
                    proxy._renderLiContent($li, ej.Gantt.ToolbarItems.Search);
                    $searchUl.append($li);
                    $div.append($searchUl);
                }            
            var helper = {};
            helper.click = proxy._toolBarClick;
            helper.cssClass = model.cssClass;
            helper.rtl = false;
            helper.itemSeparator = false;
            helper.width = proxy._ganttWidth;
            helper.fields = {
                id: "",
                tooltipText: "",
                imageUrl: "",
                text: "",
                imageAttributes: "",
                spriteCSS: "",
                htmlAttributes: "",
            };
            $div.ejToolbar(helper);
            $div.ejToolbar("disableItem", proxy._disabledToolItems);
            proxy._disabledToolItems = $();
            return $div;
        },
        //to renderCustom Li
        _renderCustomLi: function ($ul) {
            var proxy = this,
            model = proxy.model,
            $li, $item,
            customToolbarItems = model.toolbarSettings.customToolbarItems;
            for (var i = 0; i < customToolbarItems.length; i++) {
                if (customToolbarItems[i]["text"] || customToolbarItems[i]["templateID"]) {
                    if (customToolbarItems[i]["text"])
                    {
                       var customToolbar = customToolbarItems[i]["tooltipText"] ? customToolbarItems[i]["tooltipText"] : customToolbarItems[i]["text"];
                       $li = ej.buildTag("li", "", {}, { id: proxy._id + "_" + customToolbarItems[i]["text"], title: customToolbar });
                       $item = ej.buildTag("a.e-toolbaricons e-icon e-ganttcustomtoolbaritem", "", {}).addClass(customToolbarItems[i]["text"]);
                       $li.addClass("e-gantttoolbaritem");
                    }
                    else {
                        var customToolbar = customToolbarItems[i]["tooltipText"] ? customToolbarItems[i]["tooltipText"] : customToolbarItems[i]["templateID"].replace("#", "");
                        $li = ej.buildTag("li", "", {}, { id: proxy._id + "_" + customToolbarItems[i]["templateID"].replace("#", ""), title: customToolbar });
                        $item = $(customToolbarItems[i]["templateID"]).hide().html();
                    }                    
                    $li.html($item);
                    $ul.append($li);
                }              
            }
        },
        /*Remove unsupported item from toolbar */
        _updateToolbarItems: function () {
            var items = this.model.toolbarSettings.toolbarItems;
            items.indexOf("edit") != -1 && items.splice(items.indexOf("edit"), 1);
            items.indexOf("indent") != -1 && items.splice(items.indexOf("indent"), 1);
            items.indexOf("outdent") != -1 && items.splice(items.indexOf("outdent"), 1);
            items.indexOf("excelExport") != -1 && items.splice(items.indexOf("excelExport"), 1);
            items.indexOf("pdfExport") != -1 && items.splice(items.indexOf("pdfExport"), 1);
            items.indexOf("criticalPath") != -1 && items.splice(items.indexOf("criticalPath"), 1);
        },
        //create LI elements for tool bar
        _renderLi: function ($ul) {
            var proxy = this,
                toolBarItems = proxy.model.toolbarSettings.toolbarItems,
                length,
                i = 0,
                $li;
            this.model.viewType == "resourceView" && proxy._updateToolbarItems();
            length = toolBarItems.length;
            for (i; i < length; i++) {

                $li = ej.buildTag("li", "", {}, {
                    id: proxy._id + "_" + toolBarItems[i],                    
                    "tabindex": "0"
                });

                if (toolBarItems[i] !== "search") {
                    $li.addClass("e-gantttoolbaritem");                   
                    proxy._renderLiContent($li, toolBarItems[i]);
                    $ul.append($li);
                }
            }
        },

        //add attributes for tool bar li elements
        _renderLiContent: function ($li, item) {
            var $a, $input, selectionMode = this.model.selectionMode;
            var selectedRowIndex = this.selectedRowIndex();
            var editSetting = this.model.editSettings;
            switch (item) {

                case "add":
                    $a = ej.buildTag("a.e-addnewitem e-toolbaricons e-icon e-gantt-add", "", {});
                    //title: toolBarItems[i],
                    var addTitle = this._toolboxTooltipTexts["addTool"];
                    $li.attr("title", addTitle);
                        if (this.model.readOnly==true||!this.model.editSettings.allowAdding)
                        this._disabledToolItems.push($li.get(0));
                    break;

                case "edit":
                    $a = ej.buildTag("a.e-edititem e-toolbaricons e-icon e-gantt-edit", "", {});
                    var editTitle = this._toolboxTooltipTexts["editTool"];
                    $li.attr("title", editTitle);
                    if (this.model.readOnly == true || !this.model.allowSelection || (!this.model.editSettings.allowEditing || (selectedRowIndex == -1 || (selectedRowIndex != -1 && selectionMode == "cell")) || this.model.editSettings.beginEditAction == "click")) {
                        this._disabledToolItems.push($li.get(0));
                    }
                    
                    break;

                case "delete":
                    var deleteTitle = this._toolboxTooltipTexts["deleteTool"];
                    $li.attr("title", deleteTitle);
                    $a = ej.buildTag("a.e-deleteitem e-toolbaricons e-icon e-gantt-delete", "", {});
                    
                    if (this.model.readOnly == true || !this.model.allowSelection || (!this.model.editSettings.allowDeleting || (selectedRowIndex == -1 || (selectedRowIndex != -1 && selectionMode == "cell")))) {
                        this._disabledToolItems.push($li.get(0));
                    }
                    
                    break;

                case "update":
                    var saveTitle = this._toolboxTooltipTexts["saveTool"];
                    $li.attr("title", saveTitle);
                    $a = ej.buildTag("a.e-saveitem e-toolbaricons e-icon e-gantt-save e-disabletool", "", {});
                    this._disabledToolItems.push($li.get(0));
                    break;

                case "cancel":
                    var cancelTitle = this._toolboxTooltipTexts["cancelTool"];
                    $li.attr("title", cancelTitle);
                    $a = ej.buildTag("a.e-cancel e-toolbaricons e-icon e-gantt-cancel e-disabletool", "", {});
                    this._disabledToolItems.push($li.get(0));
                    break;

                case "indent":
                    var indentTitle = this._toolboxTooltipTexts["indentTool"];
                    $li.attr("title", indentTitle);
                    $input = ej.buildTag("a.e-indent e-toolbaricons e-icon e-disabletool e-gantt-indent", "", {}, {});
                    $li.append($input);
                    if (this.model.readOnly == true || !this.model.allowSelection || (!this.model.editSettings.allowIndent || (selectedRowIndex == -1 || (selectedRowIndex != -1 && selectionMode == "cell")))) {
                        this._disabledToolItems.push($li.get(0));
                    }

                    break;

                case "outdent":
                    var outdentTitle = this._toolboxTooltipTexts["outdentTool"];
                    $li.attr("title", outdentTitle);
                    $input = ej.buildTag("a.e-outdent e-toolbaricons e-icon e-disabletool e-gantt-outdent", "", {}, {});
                    $li.append($input);
                    if (this.model.readOnly == true || !this.model.allowSelection || (!this.model.editSettings.allowIndent || (selectedRowIndex == -1 || (selectedRowIndex != -1 && selectionMode == "cell")))) {
                        this._disabledToolItems.push($li.get(0));
                    }
                    break;

                case "expandAll":
                    var expandTitle = this._toolboxTooltipTexts["expandAllTool"];
                    $li.attr("title", expandTitle);
                    $input = ej.buildTag("a.e-expandall e-toolbaricons e-icon e-gantt-expandall", "", {}, {});
                    $li.append($input);
                    break;

                case "collapseAll":
                    var collapseTitle = this._toolboxTooltipTexts["collapseAllTool"];
                    $li.attr("title", collapseTitle);
                    $input = ej.buildTag("a.e-collapseall e-toolbaricons e-icon e-gantt-collapseall", "", {}, {});
                    $li.append($input); 
                    break;
                case "prevTimeSpan":
                    var prevTitle = this._toolboxTooltipTexts["prevTimeSpanTool"];
                    $li.attr("title", prevTitle);
                    $input = ej.buildTag("a.e-prevtimespan e-toolbaricons e-icon e-gantt-prevtimespan", "", {}, {});
                    $li.append($input);
                    break;
                case "nextTimeSpan":
                    var nextTitle = this._toolboxTooltipTexts["nextTimeSpanTool"];
                    $li.attr("title", nextTitle);
                    $input = ej.buildTag("a.e-nexttimespan e-toolbaricons e-icon e-gantt-nexttimespan", "", {}, {});
                    $li.append($input);
                    break;
                case "criticalPath":
                    var criticalTitle = this._toolboxTooltipTexts["criticalPathTool"];
                    $li.attr("title", criticalTitle);
                    $input = ej.buildTag("a.e-criticaltask e-toolbaricons e-icon e-gantt-criticaltask", "", {}, {});
                    $li.append($input);
                    break;
                case "search":
                    var searchTitle = this._toolboxTooltipTexts["searchTool"];
                    $input = ej.buildTag("input.e-ejinputtext", "", { 'margin': '4px', 'text-indent': '4px', 'width': 'auto', 'padding': '1px 4px 1px 0px' }, { type: "text", placeholder: searchTitle }, { 'color': "#E8E9E9" });
                    $li.css({ 'float': 'right', 'padding': '2px' });
                    $li.attr("title", searchTitle);
                    $li.addClass('e-search');
                    $li.append($input);
                    $input.keydown($.proxy(this._keyDown, this));

                    break;
                case "excelExport":
                    var excelExportTitle = this._toolboxTooltipTexts["excelExportTool"];
                    $li.attr("title", excelExportTitle);
                    $input = ej.buildTag("a.e-excelIcon e-toolbaricons e-icon e-gantt-excelexport", "", {}, {});
                    $li.append($input);
                    break;
                case "pdfExport":
                    var pdfExportTitle = this._toolboxTooltipTexts["pdfExportTool"];
                    $li.attr("title", pdfExportTitle);
                    $input = ej.buildTag("a.e-pdfIcon e-toolbaricons e-icon", "", {}, {});
                    $li.append($input);
                    break;
            }
            $li.append($a);
        },

        //handle key down for searching in gantt
        _keyDown: function (e) {

            if (e.which ===13) { //13 is key code for Enter Key 
                this._toolbarOperation(this._id + "_search", e.currentTarget.value);
				e.preventDefault();
				return false;//prevent post back
            }          
        },

        //update the status of tool bar elements 
        _updateToolbarOptions:function(){

            var proxy = this,
                model = proxy.model,
                editSettings = model.editSettings,
                toolbar = $("#" + proxy._id + "_toolbarItems"),
                $addElement = $(toolbar).find(".e-addnewitem").parent()[0],
                $editElement = $(toolbar).find(".e-edititem").parent()[0],
                $deleteElement = $(toolbar).find(".e-deleteitem").parent()[0],
                $indentElement = $(toolbar).find(".e-indent").parent()[0],
                $outdentElement = $(toolbar).find(".e-outdent").parent()[0],                
                $updateElement = $(toolbar).find(".e-saveitem").parent()[0],
                $cancelElement = $(toolbar).find(".e-cancel").parent()[0],
                disabledItems = [], enabledItems = [];
            if (model.readOnly == true) {
                $addElement && disabledItems.push($($addElement));
                $editElement && disabledItems.push($($editElement));
                $deleteElement && disabledItems.push($($deleteElement));
                $indentElement && disabledItems.push($($indentElement));
                $outdentElement && disabledItems.push($($outdentElement));
                $updateElement && disabledItems.push($($updateElement));
                $cancelElement && disabledItems.push($($cancelElement));
                $(toolbar).ejToolbar('disableItem', disabledItems);
            }
            else {
                if (editSettings.allowAdding)
                    $addElement && enabledItems.push($addElement);
                else
                    $addElement && disabledItems.push($($addElement));

            if (!model.selectedItem) {

                if (editSettings.allowEditing) {
                    $editElement && disabledItems.push($($editElement));
                }

                if (editSettings.allowDeleting) {
                    $deleteElement && disabledItems.push($($deleteElement));
                    }

                if ($updateElement)
                    $updateElement && disabledItems.push($($updateElement));

                if ($cancelElement)
                    $cancelElement && disabledItems.push($($cancelElement));

                    if ($indentElement)
                        $indentElement && disabledItems.push($($indentElement));

                    if ($outdentElement)
                        $outdentElement && disabledItems.push($($outdentElement));
                }
                else {

                if (editSettings.allowEditing && model.editSettings.beginEditAction != "click")
                        $editElement && enabledItems.push($editElement);
                    else
                        $editElement && disabledItems.push($($editElement));

                    if (editSettings.allowDeleting)
                        $deleteElement && enabledItems.push($deleteElement);
                    else
                        $deleteElement && disabledItems.push($($deleteElement));

                    proxy.updateIndentOutdentOption(model.selectedItem);
                }

                $(toolbar).ejToolbar('disableItem', disabledItems);
                $(toolbar).ejToolbar('enableItem', enabledItems);
            }
        },

        //Splitter control is initiated
        _renderGantt: function () {

            var proxy = this,
                model = proxy.model,
                leftPaneSize,
                rightPaneSize,
                ganttWidth = parseInt(proxy._ganttWidth),
                splitterPosition = proxy.splitterPosition(),
                isPercentage = false, columnWidth,
                splitterColumnIndex = model.splitterSettings.index;
            if (!splitterPosition)
            {
                splitterPosition = proxy._splitterPosition();
                proxy.splitterPosition(splitterPosition);
            }
            //calculate treegrid pane size
            if (splitterPosition || splitterColumnIndex > -1) {
                if (splitterPosition) {
                    if (typeof splitterPosition == "string" && splitterPosition.indexOf("%") != -1) {
                        leftPaneSize = parseInt(splitterPosition);
                        isPercentage = true;
                    }
                    else {
                        leftPaneSize = parseInt(splitterPosition) / ganttWidth * 100;
                        isPercentage = false;
                    }
                }
                else {
                    var columns = proxy.getColumns(),
                        columnWidth = 0,
                        columnIndex = splitterColumnIndex,
                        visibleColumns = columns.filter(function (visibleColumn) {
                             return visibleColumn.visible != false;
                        });
                    if (columnIndex >= visibleColumns.length)
                        columnIndex = visibleColumns.length - 1;
                    for (var index = 0; index <= columnIndex; index++) {
                        columnWidth += visibleColumns[index].width;
                    }
                    if (columnWidth <= ganttWidth) {
                        leftPaneSize = parseInt(columnWidth) / ganttWidth * 100;
                        splitterColumnIndex = index - 1;
                    }
                    else {
                        columnWidth = 0;
                        for (var index = 0; index <= columnIndex; index++) {
                            if ((columnWidth + visibleColumns[index].width) <= ganttWidth) {
                                columnWidth += visibleColumns[index].width;
                                splitterColumnIndex = index;
                            }
                            else {
                                leftPaneSize = parseInt(columnWidth) / ganttWidth * 100;
                                break;
                            }
                        }
                    }
                    model.splitterSettings.index = splitterColumnIndex;
                }
                // set grid width value is zero when grid width is less than zero or NAN.
                if (isNaN(leftPaneSize) || leftPaneSize < 0)
                    leftPaneSize = 0;
                // check the left pane size is greather than 100% of gantt width
                if (leftPaneSize > 100) {
                    leftPaneSize = (2 * proxy._commonColumnWidth + 3) / ganttWidth * 100;
                    leftPaneSize = leftPaneSize < 30 ? leftPaneSize : 30;
                    isPercentage = true;
                }
            }
            else {
                leftPaneSize = (2 * proxy._commonColumnWidth + 3) / ganttWidth * 100;
                leftPaneSize = leftPaneSize < 30 ? leftPaneSize : 30;
                isPercentage = true;
            }
            //Here 9 is the splitter span width
            rightPaneSize = 100 - leftPaneSize - (9 / ganttWidth * 100);
            // Check the right pane size is less than or euqal to 0.
            if (rightPaneSize <= 0) {
                if (isPercentage)
                    proxy.splitterPosition("100%");
                else
                    proxy.splitterPosition(ganttWidth.toString());
                leftPaneSize = 100 - (9 / ganttWidth * 100);
                rightPaneSize = 0;
            }
            else if (rightPaneSize > 0) {
                if (isPercentage)
                    proxy.splitterPosition(Math.round(leftPaneSize) + "%");
                else
                    proxy.splitterPosition(Math.round((leftPaneSize * ganttWidth / 100)).toString());
            }
            // assign the splitter position value to deprecated splitterPosition property
            proxy._splitterPosition(proxy.splitterPosition());
            $("#e-ejSpliter" + proxy._id).ejSplitter({
                //border width and height excluded
                height: proxy._ganttHeight,
                width: ganttWidth,
                orientation: ej.Orientation.Horizontal,
                properties: [{ paneSize: leftPaneSize + "%", collapsible: false }, { paneSize: rightPaneSize + "%", collapsible: false }],
                enableAutoResize: false,
                resize: $.proxy(proxy._onResize, proxy),
                cssClass: model.cssClass
            });
        },

        //Tree Grid part is initiated
        _renderTreeGrid: function() {
            var proxy = this, model = proxy.model;
            proxy._$treegridHelper.ejTreeGrid({
                enableAltRow: model.enableAltRow,
                allowColumnResize: model.allowColumnResize,
                enableVirtualization: model.enableVirtualization,
                allowSorting: model.allowSorting,
                showColumnChooser: model.showColumnChooser,
                showColumnOptions: model.showColumnOptions,
                allowMultiSorting: model.allowMultiSorting,
                sortSettings: model.sortSettings,
                filterSettings:model.filterSettings,
                allowSelection: model.allowSelection,
                selectionType: model.selectionType,
                selectionMode: model.selectionMode,
                selectedRowIndex: this.selectedRowIndex(),
                allowDragAndDrop: model.viewType == "projectView" ? model.allowDragAndDrop : false,
                dragTooltip: model.dragTooltip,
                allowSearching: model.allowSearching,
                parentIdMapping: model.parentTaskIdMapping,
                baselineStartDateMapping: model.baselineStartDateMapping,
                baselineEndDateMapping: model.baselineEndDateMapping,
                allowKeyboardNavigation: model.allowKeyboardNavigation,
                cssClass: model.cssClass,
                locale: model.locale,
                columns: proxy.getColumns(),
                editSettings: model.editSettings,
                toolbarSettings:model.toolbarSettings,
                rowTemplate: model.rowTemplate,
                rowDataBound: model.rowDataBound,
                queryCellInfo: model.queryCellInfo,
                cellSelecting: model.cellSelecting,
                cellSelected: model.cellSelected,
                selectedCellIndexes: this.selectedCellIndexes(),
                dataSource:this.dataSource(),
                flatRecords: model.flatRecords,
                parentRecords: model.parentRecords,
                ids: proxy.model.ids,                
                dateFormat: model.dateFormat,
                resourceInfoMapping: model.resourceInfoMapping,
                resourceNameMapping: model.resourceNameMapping,
                resourceIdMapping:model.resourceIdMapping,
                resourceUnitMapping: model.resourceUnitMapping,
                idMapping: model.taskIdMapping,
                readOnly:model.readOnly,
                notesMapping: model.notesMapping,
                showGridCellTooltip: model.showGridCellTooltip,
                cellTooltipTemplate:model.cellTooltipTemplate,
                showGridExpandCellTooltip: model.showGridExpandCellTooltip,
                taskNameMapping: model.taskNameMapping,
                taskSchedulingModeMapping: model.taskSchedulingModeMapping,
                startDateMapping: model.startDateMapping,
                endDateMapping: model.endDateMapping,
                childMapping: model.childMapping,
                durationMapping: model.durationMapping,
                durationUnitMapping: model.durationUnitMapping,
                durationUnit: model.durationUnit,
                progressMapping: model.progressMapping,
                predecessorMapping: model.predecessorMapping,
                rowHeight: model.rowHeight,
                emptyRecordText: proxy._emptyRecordText,
                isFromGantt: proxy._isFromGantt,
                treeColumnIndex: model.treeColumnIndex,
                workingTimeScale:model.workingTimeScale,
                enableWBS: model.enableWBS,
                enableWBSPredecessor: model.enableWBSPredecessor,
                columnMenuTexts: proxy._columnMenuTexts,
                editTypeText: proxy._editTypeText,
                clipModeText: proxy._clipModeText,
                textAlignTypeText: proxy._textAlignTypeText,
                columnDialogTitle: proxy._columnDialogTitle,
                deleteColumnText: proxy._deleteColumnText,
                okButtonText: proxy._okButtonText,
                cancelButtonText: proxy._cancelButtonText,
                confirmDeleteText: proxy._confirmDeleteText,
                columnDialogFields: model.columnDialogFields,
                columnDialogTexts: proxy._columnDialogTexts,
                enableSerialNumber: model.enableSerialNumber,
                workMapping: model.workMapping,
                workUnit: proxy._workUnitTexts[model.workUnit],
                taskTypeTexts: proxy._taskTypeTexts,
                effortDrivenTexts: proxy._effortDrivenTexts,
                dataManagerUpdate: { isDataManagerUpdate: proxy._isDataManagerUpdate, jsonData: proxy._jsonData },
                durationUnitEditText: this._durationUnitEditText,
                durationUnitTexts: proxy._durationUnitTexts,
                enableCollapseAll: model.enableCollapseAll,
                weekStartDay: model.scheduleHeaderSettings.weekStartDay,
                indentLevelWidth: this.indentLevelWidth,
                ganttElement: this.element,
                groupNameMapping: model.groupNameMapping,
                viewType: model.viewType,
                nullText: proxy._nullText,
                allowUnscheduledTask: model.allowUnscheduledTask
            });
        },
        //Chart part is initiated
        _renderGanttChart: function() {
            var proxy = this,
                model = this.model;
                proxy._$ganttchartHelper.ejGanttChart(
                {
                    dataSource: this.dataSource(),
                    scheduleStartDate: model.scheduleStartDate,
                    scheduleEndDate: model.scheduleEndDate,
                    startDateMapping: model.startDateMapping,
                    endDateMapping: model.endDateMapping,
                    taskNameMapping: model.taskNameMapping,
                    taskIdMapping: model.taskIdMapping,
                    progressMapping: model.progressMapping,
                    durationMapping: model.durationMapping,
                    childPropertyName: model.childMapping,
                    predecessorMapping: model.predecessorMapping,
                    enableVirtualization: model.enableVirtualization,
                    highlightWeekends: model.highlightWeekends,
                    allowDragAndDrop: model.allowDragAndDrop,
                    milestoneMapping: model.milestoneMapping,
                    perDayWidth: proxy._perDayWidth,
                    workingTimeScale: model.workingTimeScale,
                    roundOffDayworkingTime: model.roundOffDayworkingTime,
                    durationUnit: model.durationUnit,
                    isCriticalPathEnable: this.isCriticalPathEnable,
                    criticalPathCollection: this.criticalPathCollection,
                    perMonthWidth: proxy._perMonthWidth,//new property for year - month schedule
                    perWeekWidth: proxy._perWeekWidth,//new property for week - month schedule
                    perHourWidth: proxy._perHourWidth,
                    perMinuteWidth: proxy._perMinuteWidth,
                    perTopHourWidth: proxy._perTopHourWidth,
                    minuteInterval:proxy._minuteInterval,
                    includeWeekend: model.includeWeekend,
                    connectorlineWidth: model.connectorlineWidth,
                    workingTimeRanges: proxy._workingTimeRanges,
                    secondsPerDay: proxy._secondsPerDay,
                    scheduleHeaderSettings: model.scheduleHeaderSettings,
                    taskbarBackground: model.taskbarBackground,
                    progressbarBackground: model.progressbarBackground,
                    connectorLineBackground: model.connectorLineBackground,
                    parentTaskbarBackground: model.parentTaskbarBackground,
                    parentProgressbarBackground: model.parentProgressbarBackground,
                    holidays: model.holidays,
                    dateFormat: model.dateFormat,
                    locale: model.locale,
                    _durationUnitEditText : this._durationUnitEditText,
                    enableTaskbarTooltip: model.enableTaskbarTooltip,
                    enableTaskbarDragTooltip:model.enableTaskbarDragTooltip,
                    flatRecords: model.flatRecords,
                    parentRecords: model.parentRecords,
                    scheduleWeeks: proxy._scheduleWeeks,

                    projectStartDate: proxy._projectStartDate, //new property instead of scheduleWeeks[0] and scheduleYears[0]
                    projectEndDate: proxy._projectEndDate,

                    scheduleYears: proxy._scheduleYears, //new property for year
                    scheduleMonths: proxy._scheduleMonths, //new property for month
                    scheduleDays:proxy._scheduleDays,
                    scheduleHours:proxy._scheduleHours,
                    progressbarHeight: model.progressbarHeight,
                    tooltipTemplate: model.taskbarTooltipTemplate,
                    tooltipTemplateId: model.taskbarTooltipTemplateId,
                    progressbarTooltipTemplate: model.progressbarTooltipTemplate,
                    progressbarTooltipTemplateId: model.progressbarTooltipTemplateId,
                    queryTaskbarInfo: model.queryTaskbarInfo,
                    readOnly:model.readOnly,
                    showTaskNames: model.showTaskNames,
                    leftTaskLabelMapping: model.leftTaskLabelMapping,
                    rightTaskLabelMapping: model.rightTaskLabelMapping,
                    leftTaskLabelTemplate: model.leftTaskLabelTemplate,
                    rightTaskLabelTemplate: model.rightTaskLabelTemplate,
                    showProgressStatus: model.showProgressStatus,
                    showResourceNames: model.showResourceNames,
                    resourceInfoMapping: model.resourceInfoMapping,
                    resourceNameMapping: model.resourceNameMapping,
                    resourceUnitMapping: model.resourceUnitMapping,
                    enableProgressBarResizing: model.enableProgressBarResizing,
                    allowGanttChartEditing: model.allowGanttChartEditing,
                    taskbarEditingTooltipTemplateId: model.taskbarEditingTooltipTemplateId,
                    taskbarEditingTooltipTemplate:model.taskbarEditingTooltipTemplate,
                    ids: proxy.model.ids,
                    stripLines: model.stripLines,
                    _predecessorCollection: proxy._predecessorsCollection,
                    _columns:proxy._columns,
                    _nonWorkingTimeRange: proxy._nonWorkingTimeRanges,
                    nonWorkingBackground: model.nonWorkingBackground,
                    highlightNonWorkingTime: model.highlightNonWorkingTime,
                    weekendBackground: model.weekendBackground,
                    allowKeyboardNavigation: model.allowKeyboardNavigation,
                    updatedRecords: proxy.model.updatedRecords,
                    renderBaseline: model.renderBaseline,
                    baselineColor:model.baselineColor,
                    editSettings: model.editSettings,
                    columnHeaderTexts: proxy._columnHeaderTexts,
                    durationUnitTexts:proxy._durationUnitTexts,
                    predecessorEditingTexts: proxy._predecessorEditingTexts,
                    localizedDays: proxy._days,
                    localizedMonths:proxy._months,
                    rowHeight: model.rowHeight,
                    allowSelection: model.allowSelection,
                    selectionMode: model.selectionMode,
                    selectionType: model.selectionType,
                    taskbarTemplate: model.taskbarTemplate,
                    parentTaskbarTemplate: model.parentTaskbarTemplate,
                    milestoneTemplate: model.milestoneTemplate,
                    durationUnitEditText: this._durationUnitEditText,
                    taskbarClick: model.taskbarClick,
                    predecessorText: proxy._getPredecessorText(),
                    taskbarHeight: proxy.taskbarHeight,
                    cssClass: model.cssClass,
                    workWeek: model.workWeek,
                    viewType: model.viewType,
                    //taskbarDragStart: model.taskbarDragStart,
                    resourceIdMapping: model.resourceIdMapping,
                    ganttInstance: proxy,
                    enableSerialNumber: model.enableSerialNumber,
                    predecessorCollectionText: proxy._predecessorCollectionText,
                    predecessorTooltipTemplate: model.predecessorTooltipTemplate,
                    connectorLineDialogText: proxy._connectorLineDialogText,
                    allowUnscheduledTask: model.allowUnscheduledTask
                });
        },

        _getPredecessorText: function(){
            var temp = this._predecessorCollectionText[1], predecessorText = {};
            temp = temp.value.split("-");
            predecessorText["Start"] = temp[0],
            predecessorText["Finish"] = temp[1];
            return predecessorText;
        },

        //Dynamically update dropDown datasources while changing localization of a project.
        _updateColumnDropDownData:function(){
            var proxy = this, model = proxy.model, columns = model.columns,
                length = columns.length;
            for (var i = 0; i < length; i++) {
                if (columns[i].field == "taskMode") {
                    columns[i].dropdownData = [{ id: 1, "text": proxy._taskModeTexts["manual"], "value": "true" },
                                   { id: 2, "text": proxy._taskModeTexts["auto"], "value": "false" }];
                }
                if (columns[i].field == "taskType") {
                    columns[i].dropdownData = [{ id: 1, "text": proxy._taskTypeTexts["fixedWork"], "value": "fixedWork" },
                              { id: 2, "text": proxy._taskTypeTexts["fixedUnit"], "value": "fixedUnit" },
                              { id: 3, "text": proxy._taskTypeTexts["fixedDuration"], "value": "fixedDuration" }];
                }
                if (columns[i].field == "effortDriven") {
                    columns[i].dropdownData = [{ id: 1, "text": proxy._effortDrivenTexts["yes"], "value": "true" },
                              { id: 2, "text": proxy._effortDrivenTexts["no"], "value": "false" }];
                }
            }
        },

        //Populate columns for treegrid from mapping names
        createTreeGridColumns: function () {

            var proxy = this, model = proxy.model, column, columns = [], columnSNO,
                isResourceView = false;
            if (model.viewType == ej.Gantt.ViewType.ResourceView || model.viewType == ej.Gantt.ViewType.HistogramView) {
                isResourceView = true;
                var mappingName = model.groupNameMapping || model.resourceNameMapping;
                if (mappingName.length > 0) {
                    column = {
                        field: "eResourceName",
                        headerText: proxy._columnHeaderTexts["eResourceName"],
                        editType: ej.Gantt.EditingType.String,
                        mappingName: mappingName,
                        allowEditing: model.viewType == ej.Gantt.ViewType.HistogramView ? false : true,
                        allowCellSelection: true
                    };
                    columns.push(column);
                }
               // return columns;
            }

            var mapping = (model.taskIdMapping);//?model.taskIdMapping:"Task Id";

            if (mapping.length) {
                if (model.enableSerialNumber) {
                    // To insert SerialNumber column
                    columnSNO = {
                        field: "serialNumber",
                        headerText: proxy._columnHeaderTexts["serialNumber"],
                        width: 40,
                        allowEditing: false,
                        allowSorting: false,
                        mappingName: "serialNumber",
                        showInColumnChooser: false
                    }                    
                    columns.push(columnSNO);
                }
                //To insert TaskId column
                if (model.showColumnChooser) {
                    column = {
                        field: "taskId",
                        headerText: proxy._columnHeaderTexts["taskId"],
                        width: 40,
                        editType: ej.Gantt.EditingType.String,
                        mappingName: mapping,
                        allowEditing: false,
                        allowCellSelection: true 
                    };
                }
                else {
                    column = {
                        field: "taskId",
                        headerText: proxy._columnHeaderTexts["taskId"],
                        width: 30,
                        editType: ej.Gantt.EditingType.String,
                        mappingName: mapping,
                        allowEditing: false,
                        allowCellSelection: true
                    };
                }
                if (model.enableSerialNumber)
                    column.visible = false; //Hiding TaskId column
                isResourceView ? proxy._resourceViewColumns.push(column) : columns.push(column);
            }

            mapping = model.taskNameMapping;// "Task Name";

            if (mapping.length) {
                column = {
                    field: "taskName",
                    headerText: proxy._columnHeaderTexts["taskName"],
                    width: 150,
                    editType: ej.Gantt.EditingType.String,
                    mappingName: mapping,
                    allowCellSelection: true
                };

                isResourceView ? proxy._resourceViewColumns.push(column) : columns.push(column);
                //proxy._emptyDataColumns.push(column.field);
            }

            mapping = model.startDateMapping;// "Start Date";

            if (mapping.length) {
                column = {
                    field: "startDate",
                    headerText:proxy._columnHeaderTexts["startDate"],
                    width: 150,
                    editType: (model.dateFormat.toLowerCase().indexOf("hh") == -1) ?
                              ej.Gantt.EditingType.DatePicker : ej.Gantt.EditingType.DateTimePicker,
                    mappingName: mapping,
                    allowCellSelection: true,
                    format: "{0:" + model.dateFormat + "}",
                    showNullText: true
                };

                isResourceView ? proxy._resourceViewColumns.push(column) : columns.push(column);
                //proxy._emptyDataColumns.push(column.field);
            }


            mapping = model.endDateMapping;// "End Date";

            if (mapping.length) {
                column = {
                    field: "endDate",
                    headerText: proxy._columnHeaderTexts["endDate"],
                    width: 150,
                    editType: (model.dateFormat.toLowerCase().indexOf("hh") == -1) ?
                             ej.Gantt.EditingType.DatePicker : ej.Gantt.EditingType.DateTimePicker,
                    mappingName: mapping,
                    allowCellSelection: true ,
                    format: "{0:" + model.dateFormat + "}",
                    showNullText: true,
                };

                isResourceView ? proxy._resourceViewColumns.push(column) : columns.push(column);
                //proxy._emptyDataColumns.push(column.field);
            }

            mapping = model.resourceInfoMapping;//"Resources";

            if (mapping.length) {
                column = {
                    field: "resourceInfo",
                    headerText:proxy._columnHeaderTexts["resourceInfo"],
                    width: 150,
                    editType: ej.Gantt.EditingType.Dropdown,
                    mappingName: mapping,
                    allowCellSelection: true ,
                    dropdownData: this._resourceCollection //model.resources is null
                };
                isResourceView ? proxy._resourceViewColumns.push(column) : columns.push(column);
                //proxy._emptyDataColumns.push(column.field);
            }

            mapping = model.durationMapping;// "Duration";

            if (mapping.length) {
                column = {
                    field: "duration",
                    headerText: proxy._columnHeaderTexts["duration"],
                    width: 150,
                    editType: ej.Gantt.EditingType.String,
                    allowCellSelection: true ,
                    mappingName: mapping,
                    showNullText: true,
                };

                isResourceView ? proxy._resourceViewColumns.push(column) : columns.push(column);
                //proxy._emptyDataColumns.push(column.field);
            }           

            mapping = model.progressMapping;// "Progress";

            if (mapping.length) {
                column = {
                    field: "status",
                    headerText: proxy._columnHeaderTexts["status"],
                    width: 150,
                    editType: ej.Gantt.EditingType.Numeric,
                    mappingName: mapping,
                    allowCellSelection: true
                };
                isResourceView ? proxy._resourceViewColumns.push(column) : columns.push(column);
                //proxy._emptyDataColumns.push(column.field);
            }
            mapping = model.predecessorMapping;//)?model.predecessorMapping: "Predecessor";

            if (mapping.length) {                
                if (model.enableSerialNumber) {
                    column = {
                        field: "serialNumberPredecessor",
                        headerText: proxy._columnHeaderTexts["predecessor"],
                        width: 150,
                        editType: ej.Gantt.EditingType.String,
                        mappingName: "serialNumberPredecessor",
                        allowCellSelection: true
                    }
                }
                else {
                    column = {
                        field: "predecessor",
                        headerText: proxy._columnHeaderTexts["predecessor"],
                        width: 150,
                        editType: ej.Gantt.EditingType.String,
                        mappingName: mapping,
                        allowCellSelection: true
                    };
                }
                isResourceView ? proxy._resourceViewColumns.push(column) : columns.push(column);
                //proxy._emptyDataColumns.push(column.field);
            }
            /*If renderBaseline enabled baseline columns  are added*/
            if (model.renderBaseline && model.baselineStartDateMapping && model.baselineEndDateMapping) {

                mapping = model.baselineStartDateMapping;
                if (mapping.length) {
                    column = {
                        field: "baselineStartDate",
                        headerText: proxy._columnHeaderTexts["baselineStartDate"],
                        width: 150,
                        editType: (model.dateFormat.toLowerCase().indexOf("hh") == -1) ?
                             ej.Gantt.EditingType.DatePicker : ej.Gantt.EditingType.DateTimePicker,
                        mappingName: mapping,
                        format: "{0:" + model.dateFormat + "}",
                        allowEditing: true,
                        allowCellSelection: true
                    };
                    !isResourceView && columns.push(column);
                }
                mapping = model.baselineEndDateMapping;

                if (mapping.length) {
                    column = {
                        field: "baselineEndDate",
                        headerText: proxy._columnHeaderTexts["baselineEndDate"],
                        width: 150,
                        editType: (model.dateFormat.toLowerCase().indexOf("hh") == -1) ?
                             ej.Gantt.EditingType.DatePicker : ej.Gantt.EditingType.DateTimePicker,
                        mappingName: mapping,
                        format: "{0:" + model.dateFormat + "}",
                        allowEditing: true,
                        allowCellSelection: true
                    };
                    !isResourceView && columns.push(column);
                }
            }
            /*To insert WBS column*/
            if (model.enableWBS) {
                mapping = "WBS";

                if (mapping.length) {
                    column = {
                        field: "WBS",
                        headerText: proxy._columnHeaderTexts["WBS"],
                        width: 150,
                        editType: ej.Gantt.EditingType.String,
                        allowEditing: false,
                        mappingName: mapping
                    };
                    !isResourceView && columns.push(column);
                }
            }
            /*To insert WBS Predecessor column*/
            if (model.enableWBS && model.enableWBSPredecessor) {
                mapping = "WBSPredecessor";

                if (mapping.length) {
                    column = {
                        field: "WBSPredecessor",
                        headerText: proxy._columnHeaderTexts["WBSPredecessor"],
                        width: 150,
                        editType: ej.Gantt.EditingType.String,
                        allowEditing: false,
                        mappingName: mapping
                    };
                    !isResourceView && columns.push(column);
                }
            }
            mapping = model.notesMapping;

            if (mapping.length) {
                column = {
                    field: "notesText",
                    headerText: proxy._columnHeaderTexts["notes"],
                    width: 150,
                    editType: "stringedit",
                    mappingName: mapping,
                    allowEditing: true,
                    allowCellSelection: true
                };
                isResourceView ? proxy._resourceViewColumns.push(column) : columns.push(column);
            }
            mapping = model.taskSchedulingModeMapping;// "Task Mode";
            if (mapping.length) {
                var enableColumn = false;
                if (model.taskSchedulingMode == ej.Gantt.TaskSchedulingMode.Custom)
                    enableColumn = true;
                column = {
                    field: "taskMode",
                    headerText: proxy._columnHeaderTexts["taskMode"],
                    width: 100,
                    editType: ej.Gantt.EditingType.Dropdown,
                    allowCellSelection: enableColumn,
                    allowEditing: enableColumn,
                    mappingName: mapping,
                    dropdownData: [{ id: 1, "text": proxy._taskModeTexts["manual"], "value": "true" },
                                   { id: 2, "text": proxy._taskModeTexts["auto"], "value": "false" }],
                    editParams: { field: { text: "text", value: "value" } }
                };
                isResourceView ? proxy._resourceViewColumns.push(column) : columns.push(column);
            }
            mapping = model.workMapping;// work ;
            column = {
                field: "work",
                headerText: proxy._columnHeaderTexts["work"],
                width: 150,
                editType: ej.Gantt.EditingType.Numeric,
                allowEditing: true,
                allowCellSelection: true,
                visible: mapping ? true : false
            };
            if (mapping.length)
                column.mappingName = mapping;
            !isResourceView && columns.push(column);
            column = {
                field: "taskType",
                headerText: proxy._columnHeaderTexts["taskType"],
                width: 150,
                editType: ej.Gantt.EditingType.Dropdown,
                dropdownData: [{ id: 1, "text": proxy._taskTypeTexts["fixedWork"], "value": "fixedWork" },
                               { id: 2, "text": proxy._taskTypeTexts["fixedUnit"], "value": "fixedUnit" },
                               { id: 3, "text": proxy._taskTypeTexts["fixedDuration"], "value": "fixedDuration" }],
                editParams: { field: { text: "text", value: "value" } },
                allowEditing: true,
                allowCellSelection: true,
                visible: false
            };
            !isResourceView && columns.push(column);

            column = {
                field: "effortDriven",
                headerText: proxy._columnHeaderTexts["effortDriven"],
                width: 150,
                editType: ej.Gantt.EditingType.Dropdown,
                dropdownData: [{ id: 1, "text": proxy._effortDrivenTexts["yes"], "value": "true" },
                               { id: 2, "text": proxy._effortDrivenTexts["no"], "value": "false" }],
                editParams: { field: { text: "text", value: "value" } },
                allowEditing: true,
                allowCellSelection: true,
                visible: false
            };
            !isResourceView && columns.push(column);

            return columns;
        },
        
        //Create gannt record from given data source
        _createGanttRecords: function(data) {
            var proxy = this,
                model = proxy.model,
                ganttRecords = model.flatRecords,
                length = data.length,
                count = 0,
                parentGanttRecord,
                parentRecords = model.parentRecords,
                enableSorting = model.allowSorting,
                enableAltRow = model.enableAltRow,
                ids = proxy.model.ids;


            for (count; count < length; count++) {
                if (model.enableWBS) {
                    data[count]["WBS"] = (count + 1).toString();
                }
                parentGanttRecord = proxy._createGanttRecord(data[count], 0, null,undefined,"Load");
                proxy._storedIndex++;
                //if (enableAltRow)
                parentGanttRecord.isAltRow = proxy._storedIndex % 2 == 0 ? false : true;
                parentGanttRecord.index = proxy._storedIndex;
                
                ids[proxy._storedIndex] = parentGanttRecord["taskId"].toString();
                proxy._updateLastInsertedId(parentGanttRecord["taskId"], true);
                ganttRecords.push(parentGanttRecord);
                //if (enableSorting)
                parentRecords.push(parentGanttRecord);
                parentGanttRecord.childRecords && proxy._addNestedGanttRecords(parentGanttRecord.childRecords);
            }
            model.predecessorMapping && proxy._ensurePredecessorCollection();
            if (model.enableWBS && model.enableWBSPredecessor)
                proxy.createWBSPredecessor();
            if (model.enableSerialNumber)
                proxy.calculateSerialNumberPredecessor();
        },
        
        //Calculate schedule dates from GanttRecord Collections
        _calculateScheduleDates:function(editArgs)
        {
            var proxy = this,
                minStartDate,
                maxEndDate,
                tempStartDate,
                tempEndDate,
                baseLineStartDate,
                baseLineEndDate,
                model = this.model,
                records = model.flatRecords,
                updatedDates;
            if (((!model.scheduleEndDate || !model.scheduleStartDate) && records.length > 0)  || editArgs) {

                $.each(records, function (index, task) {

                    var tasks = [];
                    if (task.eResourceChildTasks.length > 0)
                        tasks = task.eResourceChildTasks;
                    else if (task.eResourceTaskType != "groupTask" && task.eResourceTaskType != "resourceTask")
                        tasks.push(task);

                    for (var count = 0; count < tasks.length; count++) {
                        var value = tasks[count];
                        tempStartDate = proxy._getValidStartDate(value);
                        tempEndDate = proxy._getValidEndDate(value);
                        baseLineStartDate = value.baselineStartDate ? new Date(value.baselineStartDate) : null;
                        baseLineEndDate = value.baselineEndDate ? new Date(value.baselineEndDate) : null;
                        //minimum startDate
                        if (minStartDate) {
                            if (tempStartDate && proxy._compareDates(minStartDate, tempStartDate) == 1) {
                                minStartDate = tempStartDate;
                            }
                            if (baseLineStartDate && model.renderBaseline && proxy._compareDates(minStartDate, baseLineStartDate) == 1) {
                                minStartDate = baseLineStartDate;
                            }
                            else if (baseLineEndDate && model.renderBaseline && proxy._compareDates(minStartDate, baseLineEndDate) == 1) {
                                minStartDate = baseLineEndDate;
                            }
                        } else {
                            if (baseLineStartDate && model.renderBaseline && proxy._compareDates(tempStartDate, baseLineStartDate) == 1)
                                minStartDate = baseLineStartDate;
                            else if (baseLineEndDate && model.renderBaseline && proxy._compareDates(tempStartDate, baseLineEndDate) == 1)
                                minStartDate = baseLineEndDate;
                            else
                                minStartDate = tempStartDate;
                        }
                        //Maximum endDate
                        if (maxEndDate) {
                            if (tempEndDate && proxy._compareDates(maxEndDate, tempEndDate) == -1) {
                                maxEndDate = tempEndDate;
                            }
                            if (baseLineEndDate && model.renderBaseline && proxy._compareDates(maxEndDate, baseLineEndDate) == -1) {
                                maxEndDate = baseLineEndDate;
                            }
                            else if (baseLineStartDate && model.renderBaseline && proxy._compareDates(maxEndDate, baseLineStartDate) == -1) {
                                maxEndDate = baseLineStartDate;
                            }
                        } else {
                            if (baseLineEndDate && model.renderBaseline && proxy._compareDates(tempEndDate, baseLineEndDate) == -1)
                                maxEndDate = baseLineEndDate;
                            if (baseLineStartDate && model.renderBaseline && proxy._compareDates(tempEndDate, baseLineStartDate) == -1)
                                maxEndDate = baseLineStartDate;
                            else
                                maxEndDate = tempEndDate;
                        }
                    }
                });

                if (!minStartDate || !maxEndDate) {
                    minStartDate = proxy._getDateFromFormat(new Date());
                    maxEndDate = proxy._getDateFromFormat(new Date(minStartDate));
                    maxEndDate.setDate(maxEndDate.getDate() + 20);
                }
                updatedDates = proxy._updateScheduleDatesByTaskLables(minStartDate, maxEndDate);
                minStartDate = updatedDates.minStartDate;
                maxEndDate = updatedDates.maxEndDate;
            }
            else if ((!model.scheduleEndDate || !model.scheduleStartDate) && records.length === 0) {
                minStartDate = proxy._getDateFromFormat(new Date());
                maxEndDate = proxy._getDateFromFormat(new Date(minStartDate));
                maxEndDate.setDate(maxEndDate.getDate() + 20);
            }
            if (!editArgs) {
                model.scheduleStartDate = minStartDate ? proxy.getFormatedDate(minStartDate) : model.scheduleStartDate;
                model.scheduleEndDate = maxEndDate ? proxy.getFormatedDate(maxEndDate) : model.scheduleEndDate;
            }
            else {
                editArgs.minStartDate = minStartDate;
                editArgs.maxEndDate = maxEndDate;
            }

        },

        //update schedule dates as per showTaskName and showResourceName values  and 
        //holidays collection and strip line collections at loadtime and edit time
        _updateScheduleDatesByTaskLables: function (startDate, endDate)
        {
            var proxy = this,
                model = this.model,
                scheduleHeaderType = model.scheduleHeaderSettings.scheduleHeaderType,
                scheduleHeaderValue = ej.Gantt.ScheduleHeaderType,
                resourceStringWidth = proxy._getResourceStringWidth(),
                numOfDays, returnValues = {},
                scheduleEndDate = model.scheduleEndDate && this._getDateFromFormat(model.scheduleEndDate);
              
            if (scheduleHeaderType == scheduleHeaderValue.Week) {
                //if (model.showTaskNames) {
                //    startDate.setDate(startDate.getDate() - 7);//one week before
                //}
                if (!model.scheduleEndDate || (scheduleEndDate.getTime() !== endDate.getTime()))
                {
                    numOfDays = resourceStringWidth > 0 ? (resourceStringWidth / proxy._perDayWidth)+7 : 7;//one week after
                    endDate.setDate(endDate.getDate() + numOfDays);
                }
            }
            if (scheduleHeaderType == scheduleHeaderValue.Year) {
                //if (model.showTaskNames) {
                //    startDate.setMonth(startDate.getMonth() - 2);//2 month before
                //}
                if (!model.scheduleEndDate || (scheduleEndDate.getTime() !== endDate.getTime())) {
                    numOfDays = resourceStringWidth > 0 ? (resourceStringWidth / proxy._perMonthWidth) + 1 : 1;//1 month after
                    endDate.setMonth(endDate.getMonth() + numOfDays);
                }
            }
             

            if (scheduleHeaderType == scheduleHeaderValue.Month) {
                //if (model.showTaskNames) {
                //    startDate.setDate(startDate.getDate() - 14);//two week before
                //}
                if (!model.scheduleEndDate || (scheduleEndDate.getTime() !== endDate.getTime())) {
                    numOfDays = resourceStringWidth > 0 ? (resourceStringWidth / proxy._perDayWidth) + 7 : 7;//one week after
                    endDate.setDate(endDate.getDate() + numOfDays);
                }
            }


            if (scheduleHeaderType == scheduleHeaderValue.Day) {
                //if (model.showTaskNames) {
                //    startDate.setHours(startDate.getHours() - 8);//8hrs before
                //}
                if (!model.scheduleEndDate || (scheduleEndDate.getTime() !== endDate.getTime())) {
                    numOfDays = resourceStringWidth > 0 ? (resourceStringWidth / proxy._perHourWidth) + 7 : 7;//7hrs after
                    endDate.setHours(endDate.getHours() + numOfDays);
                }
            }
            if (scheduleHeaderType == scheduleHeaderValue.Hour) {
                if (!model.scheduleEndDate || (scheduleEndDate.getTime() !== endDate.getTime())) {
                    var numOfHours = resourceStringWidth > 0 ? (resourceStringWidth / proxy._perMinuteWidth) + 5 : 5;//5hrs after
                    endDate.setHours(endDate.getHours() + numOfHours);
                    startDate.setHours(startDate.getHours() - 1);//Add 1 hour before.
                }
            }

            /* Update schedule dates as per holiday and strip line collection */
            returnValues = proxy._updateScheduleDatesByStripLines(startDate, endDate);

            startDate = returnValues.startDate;
            endDate = returnValues.endDate;


            returnValues = proxy._updateScheduleDatesByHolidays(startDate, endDate);

            startDate = returnValues.startDate;
            endDate = returnValues.endDate;

            returnValues.minStartDate = startDate;
            returnValues.maxEndDate = endDate;
           
            return returnValues;

        },

         //update Schedule dates by holidays collection */
        _updateScheduleDatesByHolidays: function (startDate, endDate)
        {
            var proxy = this, model = this.model, returnValues = {};

            //Check holidays are in range of schedule dates
            if (proxy._holidaysList.length > 0) {
                $.each(proxy._holidaysList, function (idx, value) {
                    if (!(value.getTime() > startDate.getTime()) || !(value.getTime() < endDate.getTime())) {
                        if (value.getTime() < startDate.getTime())
                            startDate = new Date(value);
                        else
                            endDate = new Date(value);
                    }
                });
            }

            returnValues.startDate = startDate;
            returnValues.endDate = endDate;

            return returnValues;


        },

        //update Schedule dates by stripLines collection */
        _updateScheduleDatesByStripLines: function (startDate, endDate) {
            var proxy = this, model = this.model, returnValues = {};

            //Check striplines are in range of schedule dates
            if (model.stripLines.length > 0) {
                $.each(model.stripLines, function (idx, value) {
                    var currentValue = proxy._getDateFromFormat(value.day)
                    if (!(currentValue.getTime() > startDate.getTime()) || !(currentValue.getTime() < endDate.getTime())) {
                        if (currentValue.getTime() <= startDate.getTime())
                            startDate = new Date(currentValue);
                        else
                            endDate = new Date(currentValue);
                    }
                });
            }
            returnValues.startDate = startDate;
            returnValues.endDate = endDate;

            return returnValues;
        },

        //Get reosurce collections width
        _getResourceStringWidth:function(){
            var proxy = this,
                model = this.model,
                resource = this._resourceCollection,
                totalString = "",width;
            if (resource.length > 0 && model.showResourceNames) {
                for (var count = 0; count < resource.length; count++) {
                    totalString += resource[count][model.resourceNameMapping] + " ,";
                }
                var $span = ej.buildTag("span", "", { "font-family": "Segoe UI", "font-size": "12px" }, {});
                $span.text(totalString);
                $(document.body).append($span);
                width = $span.width();
                $span.remove();
                return width;
            } else {
                return 0;
            }
        },

        //calculate project dates by schedule mode types
        _calculateHeaderDates: function () {

            var proxy = this,
                model=this.model,
                startDate = proxy._getDateFromFormat(model.scheduleStartDate),
                endDate = proxy._getDateFromFormat(model.scheduleEndDate),
                headerType = model.scheduleHeaderSettings.scheduleHeaderType,
                headerValue = ej.Gantt.ScheduleHeaderType;

            if (headerType == headerValue.Week)
                proxy._calculateWeekSplit(startDate, endDate);

            if (headerType == headerValue.Year) {
                proxy._calculateYearSplit(startDate, endDate);//method for year split
            }

            if (headerType == headerValue.Month)
                proxy._calculateMonthSplit(startDate, endDate);//method for Month split

            if (headerType == headerValue.Day)
                proxy._calculateDaySplit(startDate, endDate);

            if (headerType == headerValue.Hour)
                proxy._calculateHourSplit(startDate, endDate);
        },
        /*To diffrentiate group and resource task we need to save ids in diffrent foramt, because group and resource can have same id*/
        _getFormattedTaskId: function (record) {
            var id = "";
            if (record.eResourceTaskType == "groupTask")
                id = "G_";
            else if (record.eResourceTaskType == "resourceTask")
                id = "R_";
            id = id + (!ej.isNullOrUndefined(record["taskId"]) ? record["taskId"].toString() : record["taskId"]);
            return id;
        },
        //AddNested Gantt Records
        _addNestedGanttRecords: function (data,isResourceAdd) {
            var proxy = this,
                ids = proxy.model.ids,
                model = proxy.model,
                ganttRecords = model.flatRecords,
                count = 0,
                length = data.length,
                records = [],
                record,
                viewType = model.viewType,
                enableAltRow = model.enableAltRow;
            
            for (count; count < length; count++) {
                record = data[count];
                proxy._storedIndex++;
                //if (enableAltRow)
                record.isAltRow = proxy._storedIndex % 2 == 0 ? false : true;
                record.index = proxy._storedIndex;
                ids[proxy._storedIndex] = this._getFormattedTaskId(record);
                !isResourceAdd && proxy._updateLastInsertedId(record["taskId"], true);
                ganttRecords.push(record);
                records = record.childRecords;
                if (records) {
                    var j = 0, recordlength = records.length, childGanttRecord = null;
                    for (j; j < recordlength; j++) {
                        childGanttRecord = records[j];
                        proxy._storedIndex++;
                        //if (enableAltRow)
                        childGanttRecord.isAltRow = proxy._storedIndex % 2 == 0 ? false : true;
                        childGanttRecord.index = proxy._storedIndex;
                        ids[proxy._storedIndex] = this._getFormattedTaskId(childGanttRecord);
                        proxy._updateLastInsertedId(childGanttRecord["taskId"], true);
                        ganttRecords.push(childGanttRecord);
                        childGanttRecord.childRecords && proxy._addNestedGanttRecords(childGanttRecord.childRecords);
                    }
                }

            }
            
        },
        //returns gantt record from data
        _createGanttRecord: function (data, level, parentItem, expanded, creatAt) {
            var proxy = this, ganttRecord, model = proxy.model,
                columnRecords = proxy._columns, columnRecordsLength = columnRecords.length,
                child = data[model.childMapping],
                status = data[model.progressMapping] ? (!isNaN(parseFloat(data[model.progressMapping])) ? parseFloat(data[model.progressMapping]) : 0) : 0,
                resourceInfo = data[model.resourceInfoMapping],
                predecessors = data[model.predecessorMapping],
                notes = data[model.notesMapping],
                baselineStartDateType = proxy._getDateFromFormat(data[model.baselineStartDateMapping]),
                baselineEndDateType = proxy._getDateFromFormat(data[model.baselineEndDateMapping]),
                WBS_Val = data["WBS"] ? data["WBS"] : null,
                autoSchedule_val = (model.taskSchedulingMode == ej.Gantt.TaskSchedulingMode.Auto) ? true :
                                    (model.taskSchedulingMode == ej.Gantt.TaskSchedulingMode.Manual) ? false :
                                    (model.taskSchedulingMode == ej.Gantt.TaskSchedulingMode.Custom) ? data[model.taskSchedulingModeMapping] == true ? false : true :
                                    model.taskSchedulingMode,
                resourceName = [], predecessorscol = [];
               

            ganttRecord = new ej.Gantt.GanttRecord();
            ganttRecord.taskId = data[model.taskIdMapping];
            ganttRecord.taskName = data[model.taskNameMapping];
            proxy._addItemValue(ganttRecord, data, creatAt);
            ganttRecord.isAutoSchedule = autoSchedule_val;            
            var resourceCollection = proxy._isinAddnewRecord ? proxy._newRecordResourceCollection : this._resourceCollection;
            ganttRecord.resourceInfo = resourceInfo && ganttRecord._setResourceInfo(data[(model.resourceInfoMapping)], model.resourceIdMapping, model.resourceNameMapping, model.resourceUnitMapping, resourceCollection);
            proxy._updateResourceName(ganttRecord);
            // Calculate StartDate, EndDate, duration for schedule or unschedule tasks
            proxy._calculateScheduledValues(ganttRecord, data);
            if (!creatAt && model.viewType == "resourceView") {
                if (ganttRecord.duration == 0) {
                    ganttRecord.duration = 1;
                    ganttRecord._calculateEndDate(this);
                }
            }
            ganttRecord.baselineStartDate = this._checkBaseLineStartDate(baselineStartDateType);
            //If No hour information on endate default end time is set
            if (baselineEndDateType && baselineEndDateType.getHours() == 0 && this._defaultEndTime != 86400)
                this._setTime(this._defaultEndTime, baselineEndDateType);
            ganttRecord.baselineEndDate = this._checkBaseLineEndDate(baselineEndDateType);
            ganttRecord.WBS = WBS_Val;
            ganttRecord.notes = notes;
            ganttRecord["notesText"] = notes ? proxy._getPlainText(notes) : "";
            proxy._updateCustomField(data, ganttRecord);
            ganttRecord.status = status;
            ganttRecord.predecessorsName = predecessors;
            if (!creatAt) {
                ganttRecord.predecessor = predecessors && ganttRecord._calculatePredecessor(predecessors, this._durationUnitEditText, model.durationUnit, proxy);
                if (!proxy._isValidPredecessorString) {
                    var ptxt = proxy._getPredecessorStringValue(ganttRecord);
                    ganttRecord.predecessorsName = ptxt;
                    ganttRecord.item.predecessor = ptxt;
                    proxy._isValidPredecessorString = true;
                }
                if (model.enableSerialNumber && data.serialNumberPredecessor) 
                    ganttRecord["serialNumberPredecessor"] = data.serialNumberPredecessor;
            }
            if (creatAt) {
                //To update serial number value
                proxy._serialCount++;
                ganttRecord.serialNumber = proxy._serialCount;
            }
            ganttRecord.parentItem = parentItem;
            ganttRecord.level = level;

            if (!creatAt) {
                ganttRecord.width = ganttRecord._calculateWidth(this);
                ganttRecord.left = ganttRecord._calculateLeft(this);
                //if (this.model.viewType == "resourceView")
                //    ganttRecord.top = ganttRecord._calculateTop(this);

                ganttRecord.progressWidth = ganttRecord._getProgressWidth(ganttRecord.width, status);

                if (ganttRecord.baselineStartDate && ganttRecord.baselineEndDate) {
                    ganttRecord.baselineLeft = ganttRecord._calculateBaselineLeft(this);
                    ganttRecord.baselineRight = ganttRecord._calculateBaselineRight(this);
                    ganttRecord.baselineWidth = ganttRecord._calculateBaseLineWidth(this);
                }
            }
            proxy._updateItemValueInRecord(ganttRecord);
            ganttRecord.childRecords = (child && child.length > 0) && proxy._createChildRecords(child, level + 1, ganttRecord),
            ganttRecord.hasChildRecords = (child && child.length > 0) ? true : false,
            ganttRecord.isMilestone = ganttRecord.hasChildRecords ? false : ganttRecord.isMilestone;
            proxy._updateExpandStateMappingValue(data, ganttRecord);
            ganttRecord.expanded = expanded !== undefined ? expanded : child ? child.length > 0 : false;
            if (model.enableVirtualization === false) {
                ganttRecord.isExpanded = true;
            }
            if (ganttRecord.hasChildRecords) {                               
                ganttRecord.manualStartDate = ganttRecord.startDate;
                ganttRecord.manualEndDate = ganttRecord.endDate;                
                ganttRecord.manualDuration = ganttRecord.duration;                
            }            
            ganttRecord.taskType = data.taskType ? data.taskType : model.taskType;
            ganttRecord.effortDriven = data.effortDriven ? data.effortDriven : ganttRecord.taskType != "fixedWork" ? "false" : "true";           
            //Calculate total works for this record.
            if (!model.workMapping)
                ganttRecord._updateWorkWithDuration(proxy);
            if (predecessors)
                proxy._predecessorsCollection.push(ganttRecord);
            return ganttRecord;
        },

        _calculateScheduledValues: function (ganttRecord, data) {
            var proxy = this, model = proxy.model,
                duration = !ej.isNullOrUndefined(data[model.durationMapping]) ? data[model.durationMapping] : null,
                startDateType = proxy._getDateFromFormat(data[model.startDateMapping]),
                endDateType = proxy._getDateFromFormat(data[model.endDateMapping]),
                work = !ej.isNullOrUndefined(data[model.workMapping]) ? data[model.workMapping] : 0,
                isMilesStone = model.milestoneMapping && data[model.milestoneMapping];

            ganttRecord.durationUnit = proxy._validateDurationUnitMapping(data[model.durationUnitMapping]);

            if (!endDateType && !startDateType && ej.isNullOrUndefined(duration)) {
                if (model.allowUnscheduledTask)
                    return;
                else {
                    ganttRecord.duration = 1;
                    if (!ej.isNullOrUndefined(model.scheduleStartDate)) {
                        ganttRecord.startDate = proxy._getScheduledStartDate(ganttRecord);
                        ganttRecord._calculateEndDate(this);
                    }
                }
            }
            else if (startDateType) {
                ganttRecord.startDate = this._checkStartDate(startDateType, ganttRecord);
                if (!endDateType && ej.isNullOrUndefined(duration)) {
                    if (model.allowUnscheduledTask) {
                        ganttRecord.endDate = null;
                        ganttRecord.duration = null;
                    }
                    else {
                        ganttRecord.duration = 1;
                        ganttRecord._calculateEndDate(this);
                    }
                }
                else if (!ej.isNullOrUndefined(duration) && !endDateType) {
                    var tempDuration = proxy._getDurationValues(duration);
                    ganttRecord.duration = tempDuration.duration;
                    ganttRecord.durationUnit = ej.isNullOrUndefined(tempDuration.durationUnit) ? ganttRecord.durationUnit : tempDuration.durationUnit;
                    ganttRecord._calculateEndDate(this);
                }
                else if (endDateType && ej.isNullOrUndefined(duration)) {
                    if (endDateType.getHours() == 0 && this._defaultEndTime != 86400)
                        this._setTime(this._defaultEndTime, endDateType);
                    ganttRecord.endDate = this._checkEndDate(endDateType, ganttRecord);
                    if (proxy._compareDatesFromRecord(ganttRecord) == 1) {
                        ganttRecord.endDate = new Date(ganttRecord.startDate);
                        ganttRecord.isMilestone = true;
                        ganttRecord.duration = 0;
                    } else
                        ganttRecord._calculateDuration(this);
                }
                else {
                    var tempDuration = proxy._getDurationValues(duration);
                    ganttRecord.duration = tempDuration.duration;
                    ganttRecord.durationUnit = ej.isNullOrUndefined(tempDuration.durationUnit) ? ganttRecord.durationUnit : tempDuration.durationUnit;
                    ganttRecord._calculateEndDate(this);
                }

            }
            else if (endDateType) {
                if (endDateType.getHours() == 0 && this._defaultEndTime != 86400)
                    this._setTime(this._defaultEndTime, endDateType);
                ganttRecord.endDate = this._checkEndDate(endDateType, ganttRecord);

                if (ej.isNullOrUndefined(duration)) {
                    if (model.allowUnscheduledTask) {
                        ganttRecord.startDate = null;
                        ganttRecord.duration = null;
                    }
                    else {
                        ganttRecord.duration = 1;
                        ganttRecord.startDate = proxy._getStartDate(ganttRecord.endDate, ganttRecord.duration, ganttRecord.durationUnit, ganttRecord);
                    }
                }
                else if (!ej.isNullOrUndefined(duration)) {
                    var tempDuration = proxy._getDurationValues(duration);
                    ganttRecord.duration = tempDuration.duration;
                    ganttRecord.durationUnit = ej.isNullOrUndefined(tempDuration.durationUnit) ? ganttRecord.durationUnit : tempDuration.durationUnit;
                    ganttRecord.startDate = this._getStartDate(ganttRecord.endDate, duration, ganttRecord.durationUnit, ganttRecord);
                }
            }
            else if (!ej.isNullOrUndefined(duration)) {
                var tempDuration = proxy._getDurationValues(duration);
                ganttRecord.duration = tempDuration.duration;
                ganttRecord.durationUnit = ej.isNullOrUndefined(tempDuration.durationUnit) ? ganttRecord.durationUnit : tempDuration.durationUnit;
                if (model.allowUnscheduledTask) {
                    ganttRecord.startDate = null;
                    ganttRecord.endDate = null;
                }
                else {
                    if (!ej.isNullOrUndefined(model.scheduleStartDate)) {
                        ganttRecord.startDate = proxy._getScheduledStartDate(ganttRecord);
                        ganttRecord._calculateEndDate(this);
                    }
                }
            }

            if (ganttRecord.duration == 0) {
                ganttRecord.isMilestone = true;
                ganttRecord.endDate = proxy._getDateFromFormat(ganttRecord.startDate);
            }

            //Update duration and endDate by miles stone mapping
            if (!ej.isNullOrUndefined(isMilesStone) && isMilesStone) {
                ganttRecord.duration = 0;
                ganttRecord.isMilestone = true;
                ganttRecord.endDate = proxy._getDateFromFormat(ganttRecord.startDate);
            }
            else if (model.workMapping) {
                ganttRecord.durationUnit = model.durationUnit;
                if (isNaN(work) || ej.isNullOrUndefined(work)) {
                    ganttRecord.work = 0;
                    ganttRecord.duration = 0;
                    ganttRecord.isMilestone = true;
                    ganttRecord.endDate = proxy._getDateFromFormat(ganttRecord.startDate);
                }
                else {
                    ganttRecord.work = work;
                    ganttRecord._updateDurationWithWork(proxy);
                    if (ganttRecord.duration == 0) {
                        ganttRecord.isMilestone = true;
                        ganttRecord.endDate = proxy._getDateFromFormat(ganttRecord.startDate);
                    } else if (!ej.isNullOrUndefined(ganttRecord.startDate) && !ej.isNullOrUndefined(ganttRecord.duration))
                        ganttRecord.endDate = this._getEndDate(ganttRecord.startDate, ganttRecord.duration, ganttRecord.durationUnit, ganttRecord);
                }
                if (!ej.isNullOrUndefined(data[model.durationMapping]))
                    data[model.durationMapping] = ganttRecord.duration;
                if (!ej.isNullOrUndefined(data[model.durationMapping]))
                    data[model.endDateMapping] = ganttRecord.endDate;
            }
        },
        _getScheduledStartDate: function (ganttRecord) {

            var proxy = this, model = proxy.model,
                sDate;
            if (!ej.isNullOrUndefined(model.scheduleStartDate)) {
                var scheduleStartDate = proxy._getDateFromFormat(model.scheduleStartDate);
                sDate = proxy._checkStartDate(scheduleStartDate, ganttRecord);
            }
            else if (proxy._isLoad) {
                if (!ej.isNullOrUndefined(proxy._minStartDate))
                    sDate = proxy._checkStartDate(proxy._minStartDate, ganttRecord);
                else {
                    var length = model.flatRecords.length,
                        minStartDate = model.flatRecords[0].startDate;
                    for (var i = 0; i < length; i++) {
                        var startDate = model.flatRecords[i].startDate;
                        if (!ej.isNullOrUndefined(startDate) && proxy._compareDates(startDate, minStartDate) == -1)
                            minStartDate = startDate;
                    }
                    proxy._minStartDate = minStartDate;
                    sDate = proxy._checkStartDate(proxy._minStartDate, ganttRecord);
                }
                if (!model.allowUnscheduledTask) {
                    ganttRecord.startDate = sDate;
                    ganttRecord.item[model.startDateMapping] = ganttRecord.startDate;
                    ganttRecord._calculateEndDate(this);
                }
            }
            else
                return null;
            return new Date(sDate);
        },
        /*Method to update the custom field value in GanttRecord */
        _updateCustomField: function (data, ganttRecord) {
            var columns = (this.model.viewType == "resourceView" && ganttRecord.eResourceTaskType != "groupTask" &&
                            ganttRecord.eResourceTaskType != "resourceTask") ? this.getResourceViewEditColumns() : this.getColumns(),
                length = columns.length;
            if (length) {
                for (var i = 0; i < length; i++) {
                    if (ganttRecord[columns[i].field] == undefined)
                        ganttRecord[columns[i].field] = data[columns[i].mappingName];
                }
            }
        },
        /*Calculate expand status mapping value on record creation*/
        _updateExpandStateMappingValue: function (data, ganttRecord) {
            var model = this.model;
            if (model.expandStateMapping && ganttRecord.hasChildRecords) {
                if (!ej.isNullOrUndefined(data[model.expandStateMapping])) {
                    ganttRecord[model.expandStateMapping] = ganttRecord.item[model.expandStateMapping] = data[model.expandStateMapping];
                } else if (ej.isNullOrUndefined(data[model.expandStateMapping]) && !model.enableCollapseAll) {
                    ganttRecord[model.expandStateMapping] = ganttRecord.item[model.expandStateMapping] = data[model.expandStateMapping] = true;
                } else if (ej.isNullOrUndefined(data[model.expandStateMapping]) && model.enableCollapseAll) {
                    ganttRecord[model.expandStateMapping] = ganttRecord.item[model.expandStateMapping] = data[model.expandStateMapping] = false;
                }
            }
        },
        /*Validate duration unit value from data source*/
        _validateDurationUnitMapping: function (value) {
            var durationUnit = value;
            if (this._durationUnitEditText.minute.indexOf(durationUnit) != -1)
                durationUnit = ej.Gantt.DurationUnit.Minute;
            else if (this._durationUnitEditText.hour.indexOf(durationUnit) != -1)
                durationUnit = ej.Gantt.DurationUnit.Hour;
            else if (this._durationUnitEditText.day.indexOf(durationUnit) != -1)
                durationUnit = ej.Gantt.DurationUnit.Day;
          
            if (durationUnit == ej.Gantt.DurationUnit.Day || durationUnit == ej.Gantt.DurationUnit.Hour || durationUnit == ej.Gantt.DurationUnit.Minute)
                return durationUnit;
            else
                return this.model.durationUnit;
        },
        //Start date,end date and duration are validated update this value in data source
        _updateItemValueInRecord: function (ganttRecord) {
            var model = this.model;
            if (ganttRecord.item) {
                var data = ganttRecord.item;
                if (model.startDateMapping)
                    data[model.startDateMapping] = ganttRecord.startDate;
                if (model.endDateMapping)
                    data[model.endDateMapping] = ganttRecord.endDate;
                if (model.durationMapping)
                    data[model.durationMapping] = ganttRecord.duration;
                if (model.durationUnitMapping)
                    data[model.durationUnitMapping] = ganttRecord.durationUnit;
                if (model.workMapping)
                    data[model.workMapping] = ganttRecord.work;
                if (model.taskSchedulingModeMapping)
                    data[model.taskSchedulingModeMapping] = !ganttRecord.isAutoSchedule;
                if (model.baselineStartDateMapping)
                    data[model.baselineStartDateMapping] = ganttRecord.baselineStartDate;
                if (model.baselineEndDateMapping)
                    data[model.baselineEndDateMapping] = ganttRecord.baselineEndDate;
                data["serialNumber"] = ganttRecord.serialNumber;
            }
        },
        _addItemValue: function (ganttRecord, data, creatAt) {
            var proxy = this, model = this.model;
            //add item value in Gantt record

            if (model.parentTaskIdMapping && creatAt) {
                var id = data[model.taskIdMapping],
                   index = proxy._taskIds.indexOf(id);
                ganttRecord.item = (index > -1) ? proxy._retrivedData[index] : [];
            }
            else {
                if (this.dataSource() instanceof ej.DataManager && this.dataSource().dataSource.json && this.dataSource().dataSource.offline && creatAt) {

                    if (model.parentTaskIdMapping) {
                        var id = data[model.taskIdMapping],
                            index = proxy._taskIds.indexOf(id);
                        ganttRecord.item = (index > -1) ? proxy._retrivedData[index] : [];
                    } else {
                        ganttRecord.item = data;
                    }
                }
                else {
                    ganttRecord.item = data;
                }
            }
        },

        //Get the plain text from html string
        _getPlainText: function (htmlString) {
            var div = document.createElement("DIV");
            div.innerHTML = htmlString;
            return div.textContent || div.innerText || "";
        },

        /* udpate resourceNames attribute of record*/
        _updateResourceName: function (ganttRecord) {
            var proxy = this, resourceInfo = ganttRecord.resourceInfo,
                model = this.model,
                resourceName = [], length;

            if (resourceInfo) {
                length = resourceInfo.length;
                ganttRecord.item ? ganttRecord.item[model.resourceInfoMapping] = [] : null;
                 for (var i = 0; i < length; i++){
                     resourceName.push(resourceInfo[i][model.resourceNameMapping]);
                     if (ganttRecord.item) {
                         if (model.resourceUnitMapping && !ej.isNullOrUndefined(resourceInfo[i][model.resourceUnitMapping]) && resourceInfo[i][model.resourceUnitMapping] != 100)
                         {
                             var resourceObj = {};
                             resourceObj[model.resourceIdMapping] = resourceInfo[i][this.model.resourceIdMapping];
                             resourceObj[model.resourceUnitMapping] = resourceInfo[i][this.model.resourceUnitMapping];
                             ganttRecord.item[this.model.resourceInfoMapping].push(resourceObj);
                         } else
                             ganttRecord.item[this.model.resourceInfoMapping].push(resourceInfo[i][this.model.resourceIdMapping]);
                     }
                 }
                 ganttRecord.resourceNames = resourceName.join(',');
             }
        },
        //Update duration, work or unit of a resource according with the changes.
        _updateResourceRelatedFields: function (ganttRecord) {
            var proxy = this, model = proxy.model, updatedWorks,
                calculationType = ganttRecord.taskType,
                isAutoSchedule = ganttRecord.isAutoSchedule,
                isEffortDriven = (ganttRecord.effortDriven === "true"); //Convert String true/false to boolean.

            if (!ej.isNullOrUndefined(ganttRecord.resourceInfo)) {
                if (ganttRecord.work > 0 || proxy._updatedColumn == "work") {
                    switch (calculationType) {
                        case "fixedUnit":
                            if (isAutoSchedule && ganttRecord.resourceInfo.length &&
                                (proxy._updatedColumn == "work" ||
                                (isEffortDriven && proxy._updatedColumn == "resourceInfo")))
                                ganttRecord._updateDurationWithWork(proxy);

                            else if (!isAutoSchedule && proxy._updatedColumn == "work")
                                ganttRecord._updateUnitWithWork(proxy);

                            else
                                ganttRecord._updateWorkWithDuration(proxy);
                            break;
                        case "fixedWork":
                            if (ganttRecord.resourceInfo.length == 0)
                                return;
                            else if (isAutoSchedule) {
                                if (proxy._updatedColumn == "duration" || proxy._updatedColumn == "endDate") {
                                    ganttRecord._updateUnitWithWork(proxy);
                                    if (ganttRecord.duration == 0) {
                                        ganttRecord.work = 0;
                                        if (model.workMapping)
                                            ganttRecord.item[model.workMapping] = 0;
                                    }
                                }
                                else
                                    ganttRecord._updateDurationWithWork(proxy);
                            }
                            else {
                                if (proxy._updatedColumn == "work")
                                    ganttRecord._updateUnitWithWork(proxy);
                                else
                                    ganttRecord._updateWorkWithDuration(proxy);
                            }
                            break;
                        case "fixedDuration":                                                       
                            if (ganttRecord.resourceInfo.length && (proxy._updatedColumn == "work" ||
                                (isAutoSchedule && isEffortDriven && proxy._updatedColumn == "resourceInfo")))
                                ganttRecord._updateUnitWithWork(proxy);
                            else
                                ganttRecord._updateWorkWithDuration(proxy);
                            break;
                    }
                }
                else 
                    ganttRecord._updateWorkWithDuration(proxy);
            }
        },

        //Dynamically update resource treegrid datasource in resource tab of edit dialog box, according with changes in other resource related fields.
        _updateResourceDataSource: function (editedObj) {
            var proxy = this, resourceData = [],
                length = editedObj.resourceInfo ? editedObj.resourceInfo.length : 0;
            for (var i = 0; i < length; i++) {
                resourceData.push({ "name": editedObj.resourceInfo[i][proxy.model.resourceIdMapping], "unit": editedObj.resourceInfo[i][proxy.model.resourceUnitMapping] });
            }
            var resourceTreeGridId = "#treegrid" + proxy._id + "resourceEdit",
                resourceTreeGridDataSource = $(resourceTreeGridId).data("ejTreeGrid").model.dataSource;

            for (var index = 0; index < resourceTreeGridDataSource.length; index++) {
                var resource = resourceData.filter(function (data) { return data.name === parseInt(resourceTreeGridDataSource[index].name); });
                if (resource && resource.length == 0)
                    resourceData.push(resourceTreeGridDataSource[index]);
            }

            $(resourceTreeGridId).ejTreeGrid("option", "dataSource", resourceData);
        },
        _getHolidayByDay: function (day, calId) {
            var holidays = this._holidaysList,
                returnVal = false;
            if (holidays) {
                for (var count = 0; count < holidays.length; count++) {
                    var dateVal = holidays[count],
                        isInDay = this._isInThisDay(day, dateVal);
                    if (isInDay) {
                        returnVal = true;
                        break;
                    }
                }
            }
            return returnVal;
        },


        _isInThisDay: function (day, checkWithDate) {
            var fromDate = new Date(checkWithDate),
                toDate = new Date(checkWithDate);
            fromDate.setHours(0, 0, 0, 0);
            toDate.setHours(23, 59, 59, 59);
            if (day.getTime() >= fromDate.getTime() && day.getTime() < toDate.getTime()) {
                return true;
            } else {
                return false;
            }
        },

        _getHoliday: function () {
            if (this.model.holidays != null) {
                var holidayList = this.model.holidays,
                    holidays = [],
                    holidayLength = holidayList.length;
                if (holidayLength > 0) {
                    for (var i = 0; i < holidayLength; i++) {
                        holidays[i] = this._getDateFromFormat(holidayList[i].day);
                    }
                    return holidays;
                }
            }
            return false;
        },

        _getStringHolidays: function() {
            if (this._holidaysList != null && this._holidaysList.length > 0) {
                var holidayList = this._holidaysList,
                    holidays = [],
                    holidayLength = holidayList.length;
                if (holidayLength > 0) {
                    for (var i = 0; i < holidayLength; i++) {
                        holidays[i] = ej.format(holidayList[i], this.model.dateFormat, this.model.locale);
                    }
                    return holidays;
                }
            }
            return [];
        },
        
        //create childRecords for particular GanttRecord
        _createChildRecords: function (data, level, parentItem) {
            var ganttRecords = [],
                proxy = this, model = proxy.model,
                i = 0,
                length = data.length;

            for (i = 0; i < length; i++) {
                if (model.enableWBS) {
                    var parentWBS = parentItem.WBS;
                    data[i]["WBS"] = parentWBS + "." + (i + 1);
                }
                if (data[i]) {
                    var parentRecord = proxy._createGanttRecord(data[i], level, parentItem,undefined,"Load");
                    ganttRecords.push(parentRecord);
                }
            }
            return ganttRecords;
        },

        _createResourceInfoCollection: function (data) {
            var proxy = this,
                count = 0,
                length = data.length;
            for (count; count < length; count++) {
                proxy._resourceInfoCollection.push(proxy._createResourceInfo(data[count]));
            }
        },

        _createResourceInfo: function (data) {
            var model = this.model, resourceInfo = {};
            resourceInfo.resourceId = data[model.resourceIdMapping];
            resourceInfo.resourceName = data[model.resourceNameMapping];
            return resourceInfo;
        },

        _calculateWeekSplit: function (startdate, enddate) {
            var proxy = this,model=proxy.model,
                weekStartDay = model.scheduleHeaderSettings.weekStartDay;
            if (model.scheduleHeaderSettings.timescaleStartDateMode == "month") 
                var dt = new Date(startdate.getFullYear(), startdate.getMonth(), 1);
            else if (model.scheduleHeaderSettings.timescaleStartDateMode == "year") 
                var dt = new Date(startdate.getFullYear(), 0, 1);
            else
                var dt = startdate;
            startdate = dt;
            var dayIndex = (weekStartDay >= 0 && weekStartDay < 7) ? weekStartDay : 0,
                roundOffStartDate = startdate.getDay() <= dayIndex ? (startdate.getDate()) - (7 - dayIndex + startdate.getDay()) :
              (startdate.getDate()) - startdate.getDay() + dayIndex;
            startdate.setDate(roundOffStartDate);
            startdate.setHours(0, 0, 0, 0);
            do {
                proxy._scheduleWeeks.push(new Date(startdate));
                startdate.setDate(startdate.getDate() + 7);
            } while (!(startdate > enddate));

            proxy._projectStartDate= new Date(proxy._scheduleWeeks[0]);
            proxy._projectEndDate = new Date(proxy._scheduleWeeks[proxy._scheduleWeeks.length - 1]);
        },

        //method for calculatting years (year-month schedule mode)
        _calculateYearSplit: function (startdate, enddate) {
            var proxy = this, model=proxy.model;
            if (model.scheduleHeaderSettings.timescaleStartDateMode == "month") {
                var dt = new Date(startdate.getFullYear(), startdate.getMonth(), 1);
                startdate = dt;
                do {
                    proxy._scheduleYears.push(new Date(startdate));
                    startdate = new Date(startdate.getFullYear() + 1, 0, 1);
                } while (!(startdate >= enddate));
                var projectStartDate, projectEndDate;
                proxy._projectStartDate = new Date(proxy._scheduleYears[0].getFullYear(), proxy._scheduleYears[0].getMonth(), 1);
                proxy._projectEndDate = new Date(proxy._scheduleYears[proxy._scheduleYears.length - 1].getFullYear(), 11, 31);
            }
            else if (model.scheduleHeaderSettings.timescaleStartDateMode == "week") {
                var roundOffStartDate = startdate.getDay() == 0 ? (startdate.getDate()) - 7 :
                  (startdate.getDate()) - startdate.getDay();
                startdate.setDate(roundOffStartDate);
                do {
                    proxy._scheduleYears.push(new Date(startdate));
                    if (startdate.getDate() == 29 && startdate.getMonth() == 0 && startdate.getFullYear() % 4 != 0)
                        startdate = new Date(startdate.getFullYear()+1, startdate.getMonth(), startdate.getDate() - 1);
                    else
                        startdate = new Date(startdate.getFullYear()+1, startdate.getMonth(), startdate.getDate());
                } while (!(startdate >= enddate));
                var projectStartDate, projectEndDate;
                proxy._projectStartDate = new Date(proxy._scheduleYears[0]);
                proxy._projectEndDate = new Date(proxy._scheduleYears[proxy._scheduleYears.length - 1].getFullYear(), 11, 31);
            }
            else {
                startdate.setMonth(0);
                startdate.setDate(1);
                startdate.setHours(0, 0, 0, 0);
                do {
                    proxy._scheduleYears.push(new Date(startdate));
                    startdate.setMonth(startdate.getMonth() + 12);
                } while (!(startdate >= enddate));
                var projectStartDate, projectEndDate;
                proxy._projectStartDate = new Date(proxy._scheduleYears[0].getFullYear(), proxy._scheduleYears[0].getMonth(), 1);
                proxy._projectEndDate = new Date(proxy._scheduleYears[proxy._scheduleYears.length - 1].getFullYear(), 11, 31);
            }        

           
        },

        //Method for calculating days (day-hour schedule mode)
        _calculateDaySplit: function (startdate, enddate) {
            var proxy = this, model=proxy.model;
            if (model.scheduleHeaderSettings.timescaleStartDateMode == "week") {
                var roundOffStartDate = startdate.getDay() == 0 ? (startdate.getDate()) - 7 :
                    (startdate.getDate()) - startdate.getDay();
                startdate.setDate(roundOffStartDate);
            }
            else if (model.scheduleHeaderSettings.timescaleStartDateMode == "month") {
                var dt = new Date(startdate.getFullYear(), startdate.getMonth(), 1);
                startdate = dt;
            }
            else if (model.scheduleHeaderSettings.timescaleStartDateMode == "year") {
                var dt = new Date(startdate.getFullYear(), 0, 1);
                startdate = dt;
            }
            else {
                startdate.setHours(0, 0, 0, 0);
            }
            do {
                proxy._scheduleDays.push(new Date(startdate));
                startdate.setDate(startdate.getDate() + 1);
                startdate.setHours(0, 0, 0, 0);
            } while ((startdate <= enddate));
            proxy._projectStartDate = new Date(proxy._scheduleDays[0]);
            proxy._projectEndDate = new Date(proxy._scheduleDays[proxy._scheduleDays.length - 1]);
        },

        //Method for calculating hours (Hour-Minute schedule mode)
        _calculateHourSplit: function (startdate, enddate) {
            var proxy = this, model=proxy.model;
            if (model.scheduleHeaderSettings.timescaleStartDateMode == "week") {
                var roundOffStartDate = startdate.getDay() == 0 ? (startdate.getDate()) - 7 :
                    (startdate.getDate()) - startdate.getDay();
                startdate.setDate(roundOffStartDate);
            }
            else if (model.scheduleHeaderSettings.timescaleStartDateMode == "month") {
                var dt = new Date(startdate.getFullYear(), startdate.getMonth(), 1);
                startdate = dt;               
            }
            else if (model.scheduleHeaderSettings.timescaleStartDateMode == "year") {
                var dt = new Date(startdate.getFullYear(), 0, 1);
                startdate = dt;
            }
            else {
                startdate.setMinutes(0);              
            }
            do {
                proxy._scheduleHours.push(new Date(startdate));
                startdate.setTime(startdate.getTime() + (1 * 60 * 60 * 1000));
            } while (startdate <= enddate);
            proxy._projectStartDate = new Date(proxy._scheduleHours[0]);          
            proxy._projectEndDate = new Date(proxy._scheduleHours[proxy._scheduleHours.length - 1]);
        },
        //new method for calculatting months
        _calculateMonthSplit: function (startdate, enddate) {
            var proxy = this, model = proxy.model,
                weekStartDay = model.scheduleHeaderSettings.weekStartDay,
                dayIndex = (weekStartDay >= 0 && weekStartDay < 7) ? weekStartDay : 0;
            if (model.scheduleHeaderSettings.timescaleStartDateMode == "week") {            
              var roundOffStartDate = startdate.getDay() <= dayIndex ? (startdate.getDate()) - (7 - dayIndex + startdate.getDay()) :
             (startdate.getDate()) - startdate.getDay() + dayIndex;
                startdate.setDate(roundOffStartDate);
                startdate.setHours(0, 0, 0, 0);                
                do {
                    proxy._scheduleMonths.push(new Date(startdate));
                    if (startdate.getDate() == 29 && startdate.getMonth() == 0 && startdate.getFullYear() % 4 != 0)
                        startdate = new Date(startdate.getFullYear(), startdate.getMonth() + 1, startdate.getDate() - 1);
                    else
                        startdate = new Date(startdate.getFullYear(), startdate.getMonth() + 1, startdate.getDate());
                } while (!(startdate >= enddate));
            }
            else if (model.scheduleHeaderSettings.timescaleStartDateMode == "year") {
                var dt = new Date(startdate.getFullYear(), 0, 1);
                startdate = dt;
                if (!this._enableMonthStart) {
                    var roundOffStartDate = startdate.getDay() <= dayIndex ? (startdate.getDate()) - (7 - dayIndex + startdate.getDay()) :
                 (startdate.getDate()) - startdate.getDay() + dayIndex;
                    startdate.setDate(roundOffStartDate);
                    startdate.setHours(0, 0, 0, 0);
                }
                do {
                    proxy._scheduleMonths.push(new Date(startdate));
                  
                    if (startdate.getMonth() == 0 || startdate.getMonth() == 2 || startdate.getMonth() == 4 || startdate.getMonth() == 6 || startdate.getMonth() == 7 || startdate.getMonth() == 9 || startdate.getMonth() == 11) {
                        if (startdate.getDate() == 1) {
                            startdate.setDate(startdate.getDate() + 31);
                        }
                        else {
                            //to get the date difference to increment the next month start date
                            //total no of days in month- date + 1[to increment the 1 day of next month]
                            //for year mode it always starts with dec/Jan so no need to check for other months
                            var dateDiff = 31 - startdate.getDate() + 1;
                            startdate.setDate(startdate.getDate() + dateDiff);
                        }
                    }
                    else if (startdate.getMonth() == 3 || startdate.getMonth() == 5 || startdate.getMonth() == 8 || startdate.getMonth() == 10)
                        startdate.setDate(startdate.getDate() + 30);
                    else if (startdate.getMonth() == 1) {
                        if (startdate.getFullYear() % 4 == 0)
                            startdate.setDate(startdate.getDate() + 29);
                        else
                            startdate.setDate(startdate.getDate() + 28);
                    }
                } while (!(startdate >= enddate));
            }
            else {
                var dt = new Date(startdate.getFullYear(), startdate.getMonth(), 1);
                startdate = dt;
                if (!this._enableMonthStart) {
                    var roundOffStartDate = startdate.getDay() <= dayIndex ? (startdate.getDate()) - (7 - dayIndex + startdate.getDay()) :
                (startdate.getDate()) - startdate.getDay() + dayIndex;
                    startdate.setDate(roundOffStartDate);
                    startdate.setHours(0, 0, 0, 0);
                }
                do {
                    proxy._scheduleMonths.push(new Date(startdate));
                    if (startdate.getMonth() == 0 || startdate.getMonth() == 2 || startdate.getMonth() == 4 || startdate.getMonth() == 6 || startdate.getMonth() == 7 || startdate.getMonth() == 9 || startdate.getMonth() == 11) {
                        if (startdate.getDate() == 1) {
                            startdate.setDate(startdate.getDate() + 31);
                        }
                        else {
                            //to get the date difference to increment the next month start date
                            //total no of days in month- date + 1[to increment the 1 day of next month]
                            var dateDiff = 31 - startdate.getDate() + 1;
                            startdate.setDate(startdate.getDate()+ dateDiff);
                        }
                    }
                    else if (startdate.getMonth() == 3 || startdate.getMonth() == 5 || startdate.getMonth() == 8 || startdate.getMonth() == 10) {
                        if (startdate.getDate() == 1) 
                            startdate.setDate(startdate.getDate() + 30);
                        else {
                            var dateDiff = 30 - startdate.getDate() + 1;
                            startdate.setDate(startdate.getDate() + dateDiff);
                        }
                    }
                    else if (startdate.getMonth() == 1) {
                        if (startdate.getFullYear() % 4 == 0) {
                            if (startdate.getDate() == 1)
                                startdate.setDate(startdate.getDate() + 29);
                            else {
                                var dateDiff = 29 - startdate.getDate() + 1;
                                startdate.setDate(startdate.getDate() + dateDiff);
                            }
                        }
                        else {
                            if (startdate.getDate() == 1)
                                startdate.setDate(startdate.getDate() + 28);
                            else {
                                var dateDiff = 28 - startdate.getDate() + 1;
                                startdate.setDate(startdate.getDate() + dateDiff);
                            }
                        }
                    }
                } while (!(startdate >= enddate));
            }

            var projectStartDate, projectEndDate;
            projectStartDate = new Date(proxy._scheduleMonths[0]);
            projectEndDate = new Date(proxy._scheduleMonths[proxy._scheduleMonths.length - 1]);
            projectEndDate = new Date(projectEndDate.getFullYear(), projectEndDate.getMonth() + 1, 0);
            proxy._projectStartDate = projectStartDate;
            proxy._projectEndDate = projectEndDate;
        },

        getDateType: function (date) {
            if (date != null) {
                if (typeof (date) == "object") {
                    return date;
                }
                else {
                    var hyphenRegex = new RegExp("\\-", "g"),
                    dotRegex = new RegExp("\\.", "g");
                    date = date.replace(hyphenRegex, "/");
                    date = date.replace(dotRegex, "/");
                    return new Date(date);
                }
            }
            return null;
        },

        getFormatedDate: function(date) {
            return ej.format(date, this.model.dateFormat, this.model.locale);
        },

        _getProgressWidth: function (parentwidth, percent) {
            return (parentwidth * percent) / 100;
        },

        
        _wireEvents: function () {
            var proxy = this,
                model=proxy.model,
                treeGrid = $("#ejTreeGrid" + proxy._id),
                ganttChart = $("#ejGanttChart" + proxy._id),
                gantt = proxy._$ejGantt;

            proxy._on(proxy.element, "click", proxy.clickHandler);
            proxy._on(proxy.element, "touchstart", ".e-gridcontent,.e-ganttviewerbodyContianerparent", proxy._updateTouchCtrlFlag);
            proxy._on(proxy.element, "click", ".e-ejinputtext", proxy._searchTextFocusIn);
            proxy._on(proxy.element, "focusout", ".e-ejinputtext", proxy._searchTextFocusOut);
            if (model.enableContextMenu) {
                proxy._on(proxy.element, "contextmenu taphold", proxy._contextMenuEventBinding);
                proxy._on(proxy.element, "touchend", proxy._mouseupHandler);
                proxy._on(proxy.element, "keyup", this._preventContextMenu);
            }

            if (model.enableResize && model.isResponsive) {
                proxy._on($(window), "resize", proxy.windowResize);
            }

            treeGrid.ejTreeGrid({ rowSelecting: $.proxy(proxy.rowSelecting, proxy) });
            treeGrid.ejTreeGrid({ rowSelected: $.proxy(proxy.rowSelected, proxy) });
            treeGrid.ejTreeGrid({ cellSelecting: $.proxy(proxy.cellSelecting, proxy) });
            treeGrid.ejTreeGrid({ cellSelected: $.proxy(proxy.cellSelected, proxy) });
            treeGrid.ejTreeGrid({ rowDrag: $.proxy(proxy.rowDrag, proxy) });
            treeGrid.ejTreeGrid({ rowDragStart: $.proxy(proxy.rowDragStart, proxy) });
            treeGrid.ejTreeGrid({ rowDragStop: $.proxy(proxy.rowDragStop, proxy) });
            treeGrid.ejTreeGrid({ actionBegin: $.proxy(proxy.actionBegin, proxy) });
            treeGrid.ejTreeGrid({ actionComplete: $.proxy(proxy.actionComplete, proxy) });
            treeGrid.ejTreeGrid({ expandAllCollapseAllRequest: $.proxy(proxy.expandAllCollapseAllRequest, proxy) });
            treeGrid.ejTreeGrid({ contextMenuAction: $.proxy(proxy.contextMenuAction, proxy) });
            treeGrid.ejTreeGrid({ subContextMenuAction: $.proxy(proxy.subContextMenuAction, proxy) });
            treeGrid.ejTreeGrid({ setInitialData: $.proxy(proxy.setInitialData, proxy) });
            treeGrid.ejTreeGrid({ refreshScrollCss: $.proxy(proxy._updateScrollerBorder, proxy) });
            treeGrid.ejTreeGrid({ getCtrlRequestValue: $.proxy(proxy._getCtrlRequestValue, proxy) });
            

            if (model.queryCellInfo) {
                treeGrid.ejTreeGrid({ queryCellInfo: $.proxy(proxy._queryCellInfo, proxy) });
            }
            
            if (model.rowDataBound) {
                treeGrid.ejTreeGrid({ rowDataBound: $.proxy(proxy._rowDataBound, proxy) });
            }
            
            treeGrid.ejTreeGrid({ beginEdit: $.proxy(proxy._beginEdit, proxy) });
            treeGrid.ejTreeGrid({ endEdit: $.proxy(proxy._endEdit, proxy) });            
            
            treeGrid.ejTreeGrid({ expanding: $.proxy(proxy.expanding, proxy) });
            treeGrid.ejTreeGrid({ collapsing: $.proxy(proxy.collapsing, proxy) });
            treeGrid.ejTreeGrid({ expanded: $.proxy(proxy.expanded, proxy) });
            treeGrid.ejTreeGrid({ collapsed: $.proxy(proxy.collapsed, proxy) });
            treeGrid.ejTreeGrid({ refreshRow: $.proxy(proxy.refreshRow, proxy) });
            treeGrid.ejTreeGrid({ cancelEditCell: $.proxy(proxy.cancelEditCell, proxy) });
            if (model.viewType == "resourceView")
                treeGrid.ejTreeGrid({ updateResource: $.proxy(proxy._removeResources, proxy) });
            
            ganttChart.ejGanttChart({ rowSelecting: $.proxy(proxy.rowSelecting, proxy) });
            ganttChart.ejGanttChart({ rowSelected: $.proxy(proxy.rowSelected, proxy) });
            ganttChart.ejGanttChart({ rowHover: $.proxy(proxy._ganttChartRowHover, proxy) });
            ganttChart.ejGanttChart({ actionBegin: $.proxy(proxy.actionBegin, proxy) });
            ganttChart.ejGanttChart({ actionComplete: $.proxy(proxy.chartactionComplete, proxy) });
            ganttChart.ejGanttChart({ refreshRow: $.proxy(proxy.refreshRowData, proxy) }); 
            ganttChart.ejGanttChart({ zooming: $.proxy(proxy.zoomingChart, proxy) });
            ganttChart.ejGanttChart({ queryTaskbarInfo: $.proxy(proxy.queryTaskbarInfo, proxy) });
            ganttChart.ejGanttChart({ expanding: $.proxy(proxy.expanding, proxy) });
            ganttChart.ejGanttChart({ collapsing: $.proxy(proxy.collapsing, proxy) });
            ganttChart.ejGanttChart({ expanded: $.proxy(proxy.expanded, proxy) });
            ganttChart.ejGanttChart({ collapsed: $.proxy(proxy.collapsed, proxy) });
            ganttChart.ejGanttChart({ expandAllCollapseAllRequest: $.proxy(proxy.expandAllCollapseAllRequest, proxy) });
            ganttChart.ejGanttChart({ taskbarEditing: $.proxy(proxy.taskbarEditing, proxy) });
            ganttChart.ejGanttChart({ taskbarEdited: $.proxy(proxy.taskbarEdited, proxy) });
            ganttChart.ejGanttChart({ calculateEndDate: $.proxy(proxy.calculateEndDate, proxy) });
            ganttChart.ejGanttChart({ calculateDuration: $.proxy(proxy.calculateDuration, proxy) });
            ganttChart.ejGanttChart({ clearColumnMenu: $.proxy(proxy.clearColumnMenu, proxy) });
            ganttChart.ejGanttChart({ deleteRow: $.proxy(proxy.deleteRow, proxy) });
            ganttChart.ejGanttChart({ cancelEditCell: $.proxy(proxy.cancelEditCell, proxy) });
            ganttChart.ejGanttChart({ getCtrlRequestValue: $.proxy(proxy._getCtrlRequestValue, proxy) });
            ganttChart.ejGanttChart({ taskbarEditedCancel: $.proxy(proxy._taskbarEditedCancel, proxy) });
            gantt.ejSplitter({ allowResizing: $.proxy(proxy._onResize, proxy) });
            proxy._on(proxy.element, "mousedown", proxy._mousedownhandler);
            proxy._enableEditingEvents();
        },
 
        /* prevent context menu action by menu option key*/
        _preventContextMenu: function (e) {
            if (e.keyCode == 93) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        },
        _onResize: function (args) {
            var proxy = this,
                isPercentage = false, eventArgs = {},
                splitterPosition = proxy.splitterPosition();
            proxy._splitterOnResize = true;
            /* cancel edited cell in treegrid while resize the splitter*/
            if (proxy._isinBeginEdit) {
                if ($("#ejTreeGrid" + proxy._id + "EditForm").length > 0) {
                    proxy._$treegridHelper.ejTreeGrid("cancelEditCell");
                    proxy._isinBeginEdit = false;
                }
            }
            if (splitterPosition.indexOf("%") != -1) 
                isPercentage = true;
            else 
                isPercentage = false;
            if (isPercentage)
                proxy.splitterPosition(Math.round(args.prevPane.size / proxy._ganttWidth * 100)+ "%");
            else
                proxy.splitterPosition(Math.round(args.prevPane.size).toString());
            proxy._splitterPosition(proxy.splitterPosition());
            proxy._$treegridHelper.ejTreeGrid("refreshScroller", args.prevPane.size);
            proxy._$ganttchartHelper.ejGanttChart("refreshScroller", args.nextPane.size - 1);// chart content parent div added with 1px right border
            proxy._updateScrollerBorder();
            eventArgs = {
                prevSplitterPosition: splitterPosition,
                customSplitterPosition: null,
                isSplitterIndex: false,
                isOnResize: true,
                currentSplitterPosition: proxy.splitterPosition()
            }
            if (proxy._trigger("splitterResized", eventArgs)) {
                proxy.setSplitterPosition(eventArgs.prevSplitterPosition);
            }
            else if (!ej.isNullOrUndefined(eventArgs.customSplitterPosition)) {
                if (eventArgs.isSplitterIndex)
                    proxy.setSplitterIndex(eventArgs.customSplitterPosition);
                else
                    proxy.setSplitterPosition(eventArgs.customSplitterPosition);
            }
            proxy._splitterOnResize = false;
        },
        _searchTextFocusOut: function (e) {
            var focus = 0;
            var proxy = this,searchTitle = this._toolboxTooltipTexts["searchTool"];
            var $target = $(e.target);
            if ($($target).closest('li') && $($target).closest('li').attr('id') == proxy._id + "_search") {
                $($target).attr("placeholder", searchTitle);
            }
        },
        _searchTextFocusIn: function (e) {
            var proxy = this;
            var $target = $(e.target);
            var attr = $($target).attr('placeholder');
            if ($target.hasClass("e-ejinputtext") && attr)
                $target.removeAttr('placeholder');
        },
        clickHandler: function (e) {
            var proxy = this,model =proxy.model,                
                $target = $(e.target);

            //if ($target.closest(".e-popup").length == 0 &&
            //  $target.closest(".e-rowcell").find("#" + proxy._id + "EditForm").length == 0) {
                
            //}
            if (model.allowSelection && model.selectionType == "multiple"&& model.selectionMode == "row") {
                if ($target.hasClass("e-rowselect")) {
                    if (!$target.hasClass("e-spanclicked")) {
                        $target.addClass("e-spanclicked");
                    } else {
                        proxy._clearMultiSelectPopup();
                    }
                } else {
                    if (!$("#" + proxy._id + "_selectionpopup").find(".e-rowselect").hasClass("e-spanclicked")) {
                        this._multiSelectPopup.hide();
                    }
                }
                if ($target.hasClass("e-rowcell") || $target.parent().hasClass("e-rowcell") || ($target.closest("td").hasClass("e-rowcell")) || ($target.closest("td").hasClass("e-rowcell")) && $target.hasClass("e-cell") || $target.hasClass("e-rowcell") || (($target.parent().hasClass("e-chartcell") || ($target.closest("td").hasClass("e-chartcell")) || ($target.closest("td").hasClass("e-chartcell"))))) {
                    if (proxy._ganttTouchTrigger == true && this._multiSelectPopup != null && !this._multiSelectPopup.find(".e-rowselect").hasClass("e-spanclicked")) {
                        this._multiSelectPopup.removeAttr("style");
                        if ($target.closest(".e-rowcell").length != 0) {
                            var offset = $target.closest(".e-rowcell").offset();
                            this._multiSelectPopup.offset({ top: 0, left: 0 }).offset({ left: (offset.left + (($target.closest(".e-rowcell").outerWidth() / 2) - (this._multiSelectPopup.width() / 2))), top: (offset.top - this._multiSelectPopup.outerHeight() - 10) }).show();
                        }
                        else {
                            var offset = $target.closest(".e-chartcell").offset();
                            this._multiSelectPopup.offset({ top: 0, left: 0 }).offset({ left: (e.pageX + this._multiSelectPopup.width() / 2), top: (offset.top - this._multiSelectPopup.outerHeight() - 10) }).show();
                        }
                    }
                    proxy._ganttTouchTrigger = false;
                }
            }
            proxy._clearContextMenu();

            //Skip the scroll bar click in Gantt.
            if ($target.hasClass("e-vhandle") || $target.hasClass("e-vscrollbar") || $target.hasClass("e-vup") || $target.hasClass("e-vhandlespace") || $target.hasClass("e-vdown"))
                return;
            if ($target.hasClass("e-hhandle") || $target.hasClass("e-hscrollbar") || $target.hasClass("e-hup") || $target.hasClass("e-hdown") || $target.hasClass("e-hhandlespace"))
                return;            
            if (proxy._isinBeginEdit && document.getElementById(proxy._id).contains($target[0])) {

                if (!$target.closest('td').hasClass("e-editedcell") && !$target.hasClass('e-date') && !$target.hasClass('e-arrow') && !$target.hasClass('e-down-arrow') && $target.closest("form#ejTreeGrid" + proxy._id + "EditForm").length == 0
                    && $("#ejTreeGrid" + proxy._id + "EditForm").length > 0) {
                    proxy._$treegridHelper.ejTreeGrid("saveCell");
                    proxy._isinBeginEdit = false;
                }
            }
            proxy.clearColumnMenu();
        },

        windowResize: function (e) {

            if (!this.element.is(":visible")) {
                return;
            }

            var proxy = this,
                ejGanttSplit = ("#e-ejSpliter" + this._id),
                toolbar = ("#" + this._id + "_toolbarItems"),
                ganttchart = ("#ejGanttChart" + this._id),
                treegrid = ("#ejTreeGrid" + this._id),
                ganttbody = $("#" + this._id).find(".e-ganttviewerbodyContianer"),
                gantthead = $("#" + this._id).find(".e-ganttviewerheaderContainer"),
                treegridhelp = ("#ejTreeGrid" + this._id),
                treegridcontent = ("#ejTreeGrid" + this._id + "e-gridcontent"),
                sizeSettingsWidth = proxy.model.sizeSettings.width,
                sizeSettingsHeight = proxy.model.sizeSettings.height,
                elementStyleHeight = proxy.element[0].style.height,
                elementStyleWidth = proxy.element[0].style.width,
                width, height, maxScrollWidth;
            //Width calculation
            if ((sizeSettingsWidth && (typeof(sizeSettingsWidth) != "number" && sizeSettingsWidth.indexOf("%") != -1)) || elementStyleWidth.indexOf("%") != -1) {

                var ganttWidth = sizeSettingsWidth ? sizeSettingsWidth : elementStyleWidth;
                var containerWidth = $(proxy.element).parent().width() ? $(proxy.element).parent().width() : $(proxy.element).width();
                width = (containerWidth / 100) * parseInt(ganttWidth);
                
            }
            else
                width = $(proxy.element).width();
            if (proxy.splitterPosition().indexOf("%") == -1){
                var splitterPosition = parseInt(proxy.splitterPosition()) + 7 + 2; // here 7 is splitter width, 2 is border width
                proxy._ganttWidth = width = Math.max(width, splitterPosition);
            }
            else
                proxy._ganttWidth = width;
            //height calculation
            if ((sizeSettingsHeight && (typeof(sizeSettingsWidth) != "number" && sizeSettingsHeight.indexOf("%") != -1 )) || elementStyleHeight.indexOf("%") != -1) {
                var ganttHeight = sizeSettingsHeight ? sizeSettingsHeight : elementStyleHeight;
                var containerHeight = $(proxy.element).parent().height() ? $(proxy.element).parent().height() : $(proxy.element).height();
                var tempHeight;
                if ($(proxy.element).parent().height())
                    tempHeight = (containerHeight / 100) * parseInt(ganttHeight);
                else
                    tempHeight = $(proxy.element).height();
                height = tempHeight;
            }
            else
                height = $(proxy.element).height();

            //Exclude bordor from width and height
            height = height - proxy._totalBorderHeight;
            width = Math.round(width);

            var ganttWidth, treeGridWidth, top,left,
                toolbarHeight = $(toolbar).length ? $(toolbar).height() : 0;
            $(ejGanttSplit).css("width", width);
            $(ejGanttSplit).css("height", (height - toolbarHeight));
            $(ejGanttSplit).ejSplitter("refresh");
            if ($(toolbar).length) {
                $(toolbar).css("width", width);              
            }

            ganttWidth = $(ganttchart).width();
            treeGridWidth = $(treegrid).width();
            $(ganttchart).height(height - toolbarHeight);

            top = ganttbody.ejScroller("option", "scrollTop");
            left = ganttbody.ejScroller("option", "scrollLeft");
            //set height for scroller div
            ganttbody.ejScroller({
                width: ganttWidth,
                height: (height - toolbarHeight - gantthead.height() - parseInt(gantthead.css("border-bottom-width"))),
            });
            ganttbody.ejScroller("refresh");
            maxScrollWidth = proxy._$ganttchartHelper.ejGanttChart("getMaxScrollWidth");
            if (left > maxScrollWidth)
                left = maxScrollWidth > 0 ? maxScrollWidth : 0;

            ganttbody.ejScroller("option", "scrollTop", top);
            ganttbody.ejScroller("option", "scrollLeft", left);

            $(treegridhelp).height(height - toolbarHeight);
            $(treegridcontent).height((height - toolbarHeight - gantthead.height() - proxy._totalBorderHeight));
            left = $(treegridcontent).ejScroller("option", "scrollLeft");
            //$(treegridcontent).ejScroller("destroy";
            $(treegridcontent).width(treeGridWidth);
            //$(treegridcontent).ejScroller({
            //    width: treeGridWidth,
            //    scrollTop: top,
            //    height: 0
            //});
            $(treegridcontent).ejScroller("refresh");
            maxScrollWidth = proxy._$treegridHelper.ejTreeGrid("getMaxScrollWidth");
            if (left > maxScrollWidth)
                left = maxScrollWidth > 0 ? maxScrollWidth : 0;

            $(treegridcontent).ejScroller("option", "scrollLeft", left);

            proxy._$treegridHelper.ejTreeGrid("updateViewPortHeight");
            proxy._$ganttchartHelper.ejGanttChart("updateViewPortHeight");
            if(proxy.model.enableVirtualization)
            {
                if (proxy._$treegridHelper.ejTreeGrid("instance")._searchString.length > 0 && proxy.model.selectionType == "multiple" && proxy.model.selectionMode == "row") {
                    //to select multiple rows after window resize in virtualiztion mode
                    var itemIndex = [],
                        selectedIndex = proxy.model.selectedItems.filter(function (record) {
                            itemIndex.push(proxy.model.updatedRecords.indexOf(record));
                        });
                }
                proxy._$treegridHelper.ejTreeGrid("cancelRowEditCell");                
                var tempArgs = {};
                tempArgs.requestType = ej.TreeGrid.Actions.Refresh;
                proxy._$treegridHelper.ejTreeGrid("processBindings", tempArgs);
                proxy._$treegridHelper.ejTreeGrid("sendDataRenderingRequest", tempArgs);
                proxy._$ganttchartHelper.ejGanttChart("refreshHelper", proxy.model.currentViewData, proxy.model.updatedRecords);
                proxy._$ganttchartHelper.ejGanttChart("onScrollHelper", top);
                if (proxy.model.selectionMode == "row") {
                    if (proxy.model.selectionType == "multiple")
                        proxy.selectMultipleRows(itemIndex);
                    else
                        proxy.selectRows(this.selectedRowIndex());
                }
                else { 
                    var multiCellSelect = proxy.model.selectionType == "multiple" ? true : false;
                    proxy.selectCells(proxy.model.selectedCellIndexes, multiCellSelect);
                }
            }
            if (proxy.model.viewType != "resourceView") {
                proxy._$ganttchartHelper.ejGanttChart("clearConnectorLines");
                proxy._updateRowHeightInConnectorLine(proxy._connectorLinesCollection);
                proxy._$ganttchartHelper.ejGanttChart("renderConnectorLines", proxy._connectorLinesCollection);
            }
            proxy.setSplitterPosition(proxy.splitterPosition());
            if (proxy.model.allowSelection && proxy.model.selectionType == "multiple" && proxy._multiSelectPopup && proxy._multiSelectPopup.is(":visible")) {
                proxy._alignMultiSelectPopup();
            }
            if (proxy.isCriticalPathEnable == true && proxy.model.predecessorMapping) {
                proxy._$ganttchartHelper.ejGanttChart("criticalConnectorLine", proxy.criticalPathCollection, proxy.detailPredecessorCollection, true, proxy.collectionTaskId);
            }
        },
        _updateRowHeightInConnectorLine: function (collection) {
            if (collection && collection.length) {
                var chartObject = $("#ejGanttChart" + this._id).ejGanttChart("instance");
                var rowHeight1 = $("#" + chartObject._$ganttViewTablebody[0].id).find("tr:first")[0].getBoundingClientRect().height;
                if (rowHeight1 && !isNaN(rowHeight1)) {
                    for (var count = 0; count < collection.length; count++) {
                        collection[count].RowHeight = rowHeight1;
                    }
                }
            }
        },
        /* Public method for scroll to the corresponding offset value */
        setScrollTop: function (top) {
            var proxy = this,
                max = proxy._$treegridHelper.ejTreeGrid("getMaxScrollHeight");
            if (proxy._isinBeginEdit)
                proxy._$treegridHelper.ejTreeGrid("saveCell");

            if ((typeof top == "number" || typeof parseInt(top) == "number")) {
                top = parseInt(top);
                if (top >= 0) {
                    if (max >= top)
                        proxy._$ganttchartHelper.ejGanttChart("onScrollHelper", top);
                    else
                        proxy._$ganttchartHelper.ejGanttChart("onScrollHelper", max);
                }
            }
        },

        // Get XY coordinates for touch and non-touch device
        _getCoordinate: function (evt) {
            var coor = evt;
            if (!ej.isNullOrUndefined(evt.originalEvent.changedTouches) && (evt.type == "touchmove" || evt.type == "touchstart" || evt.type == "touchend" || evt.type == "taphold" || evt.type == "tap"))
                coor = evt.originalEvent.changedTouches[0];
            return coor;
        },

        _mouseupHandler: function (e) {
            var proxy = this, model = proxy.model,
            coord = proxy._getCoordinate(e), diffX, diffY;

            // Gantt Contextmenu touch support
            if (model.enableContextMenu && proxy._contextMenuHandler) {
                diffX = Math.abs(proxy._posX1 - coord.pageX);
                diffY = Math.abs(proxy._posY1 - coord.pageY);
                if (diffX <= 10 || diffY <= 10)
                    proxy._rightClick(e);
            }
            proxy._contextMenuHandler = false;
            proxy._ganttTouchEvent = false;
        },

        _contextMenuEventBinding: function (e) {
            var proxy = this,
                coord = proxy._getCoordinate(e);
            proxy._posX1 = coord.pageX;
            proxy._posY1 = coord.pageY;
            if (e.which == 3 && !proxy._ganttTouchEvent) {
                proxy._rightClick(e);
            }
            else if (proxy._ganttTouchEvent) {
                proxy._contextMenuHandler = true;
                return true;
            }
        },
        
        // handler for mouse right click
        _rightClick: function (e) {
            e.preventDefault();
            var proxy = this,
                model = proxy.model,
                $target = $(e.target),
                div = $target.closest('tr'),
                $ganttGridRows,
                row,
                recordIndexr,
                item,selectIndex, selectCellIndex,
                args = {},
                resourceTaskItem;
            proxy._$treegridHelper.ejTreeGrid("disableTooltip");
            proxy.clearColumnMenu();
            if ($(div).hasClass("e-chartcell") || $(div).hasClass("e-ganttrowcell")) {
                $ganttGridRows = proxy._$ganttchartHelper.ejGanttChart("getGanttChartRows");
                resourceTaskItem = model.viewType == "resourceView" ? proxy._$ganttchartHelper.ejGanttChart("getRecordByTarget", e) : null;
                args.target = "ejTreeGrid";
            } else {
                $ganttGridRows = $(proxy._$treegridHelper.ejTreeGrid("getRows"));
                args.target = "ejGanttChart";
            }
            row = $target.closest('tr');
            recordIndexr = $ganttGridRows.index(row);
            proxy.model.currentViewData = proxy.getCurrentViewData();
            item = proxy.model.currentViewData[recordIndexr];
            recordIndexr = proxy.model.updatedRecords.indexOf(item);
            args.data = resourceTaskItem ? resourceTaskItem : item;
            args.recordIndex = recordIndexr;

            if (args.data && proxy.model.enableContextMenu) {
                proxy._contextMenuItems = [];
                proxy._contextMenuItems = proxy._getContextMenuItems();
                proxy._updateIndentOutdentContextmenuOption(args.data);
                proxy._clearContextMenu();
                if (model.selectionMode == "cell") {
                    proxy._rowIndexOfLastSelectedCell = recordIndexr;
                    selectCellIndex = proxy._$treegridHelper.ejTreeGrid("getCellIndex", e);
                    if (!$($target.closest('td')).hasClass("e-chartcell"))
                        proxy.selectCells([{ rowIndex: recordIndexr, cellIndex: selectCellIndex }], null, false);
                }
                if (proxy._contextMenuItems.length > 0) {
                    if (proxy.model.readOnly == true || !proxy.model.editSettings.allowAdding) {
                          proxy._removeContextMenuItem("Below");
                          proxy._removeContextMenuItem("Above");
                    }
                    proxy._renderContextMenu(e, recordIndexr, args.data);
                }
                if (model.viewType == "resourceView" && (args.data.eResourceTaskType == "resourceChildTask" || args.data.eResourceTaskType == "unassignedTask"))
                    proxy._$ganttchartHelper.ejGanttChart("selectTaskbar", args.data);
                if (model.selectionMode == "row") {
                if (recordIndexr != proxy.model.selectedRowIndex)
                    proxy.rowSelected(args);
                    if (model.selectionType == ej.Gantt.SelectionType.Multiple) {
                        proxy._$treegridHelper.ejTreeGrid("instance")._multiSelectCtrlRequest = proxy._$ganttchartHelper.ejGanttChart("instance")._multiSelectCtrlRequest = false;
                        proxy._clearMultiSelectPopup();
                    }
                    proxy._$treegridHelper.ejTreeGrid("selectRows", recordIndexr);
                    proxy._$ganttchartHelper.ejGanttChart("selectRows", recordIndexr);
                    var treeObj = proxy._$treegridHelper.ejTreeGrid("instance");
                    model.selectedItems = treeObj.model.selectedItems;
                    model.selectedItem = treeObj.model.selectedItem;
                    proxy.selectedRowIndex(model.updatedRecords.indexOf(model.selectedItem));
                    proxy.updateIndentOutdentOption(model.selectedItem);
                }
                //To save edited data when beginEditAction as "click"
                if (model.editSettings.beginEditAction == "click" && $("#ejTreeGrid" + proxy._id + "EditForm").length > 0) {
                    proxy._$treegridHelper.ejTreeGrid("saveCell");
                    proxy._isinBeginEdit = false;
                }
            }
            else if (proxy.model.flatRecords.length === 0 && proxy.model.enableContextMenu) {
                proxy._contextMenuItems = [];
                proxy._contextMenuItems = proxy._getContextMenuItems();
                //remove subContextMenu Items
                proxy._contextMenuItems.splice(5, 2);
                proxy._updateIndentOutdentContextmenuOption(args.data);
                proxy._clearContextMenu();
                if (proxy._contextMenuItems.length > 0)
                    proxy._renderContextMenu(e, recordIndexr, args.data);
            }
        },
		 // Mouse down handler for gantt
        _mousedownhandler:function(e)
        {
            var $target = $(e.target),
            proxy = this;
            proxy._clearContextMenu();
            if(proxy.model.predecessorMapping)
                proxy._$ganttchartHelper.ejGanttChart("closePredecessorDialog");
            if ($target.hasClass("e-vhandle") || $target.hasClass("e-vscrollbar") || $target.hasClass("e-vup") || $target.hasClass("e-vdown") || $target.hasClass("e-vhandlespace") || $target.hasClass("e-hhandle") || $target.hasClass("e-hscrollbar") || $target.hasClass("e-hdown") || $target.hasClass("e-hhandlespace") || $target.hasClass("e-splitbar")) {
                proxy._clearMultiSelectPopup();
                proxy.clearColumnMenu();
            }
        },
        
        //remove corresponding menu item in contextmenu collection by it menuId
        _removeContextMenuItem: function (id) {
            var proxy = this,
                index, contextMenuItems = proxy._contextMenuItems,
                filteredMenuItem;

            filteredMenuItem = contextMenuItems.filter(function (value) {
                if (value.menuId === id)
                    return true;
            });

            if (filteredMenuItem.length > 0) {
                index = contextMenuItems.indexOf(filteredMenuItem[0]);
                contextMenuItems.splice(index, 1);
            }
        },

        //Update contextmenu item according to selected item and editSettings API values
        _updateIndentOutdentContextmenuOption: function (ganttRecord) {
            var proxy = this,
                model = proxy.model,
                flatRecords = this.model.flatRecords,
                recordIndex = flatRecords.indexOf(ganttRecord);
            if (proxy.model.readOnly == true) {
                proxy._removeContextMenuItem("Add");              
                proxy._removeContextMenuItem("Task");
                proxy._removeContextMenuItem("Delete");
                proxy._removeContextMenuItem("Indent");
                proxy._removeContextMenuItem("Outdent");
            }
            else {
                if (recordIndex === 0) {
                    proxy._removeContextMenuItem("Indent");
                    proxy._removeContextMenuItem("Outdent");
                }
                else if (recordIndex > 0) {
                    if (ganttRecord.level === 0) {
                        proxy._removeContextMenuItem("Outdent");
                    }
                    else {
                        var previousGanttRecord = flatRecords[recordIndex - 1];
                        if (ganttRecord.level - previousGanttRecord.level === 1) {
                            proxy._removeContextMenuItem("Indent");
                        }
                    }
                }
                else if (recordIndex < 0 && !ganttRecord) {
                    proxy._removeContextMenuItem("Task");
                    proxy._removeContextMenuItem("Delete");
                    proxy._removeContextMenuItem("Indent");
                    proxy._removeContextMenuItem("Outdent");
                }

                if (!model.editSettings.allowAdding) {
                    proxy._removeContextMenuItem("Add");
                }

                if (!model.editSettings.allowDeleting) {
                    proxy._removeContextMenuItem("Delete");
                }

                if (!model.editSettings.allowEditing) {
                    proxy._removeContextMenuItem("Task");
                }
                if (!model.editSettings.allowIndent) {
                    proxy._removeContextMenuItem("Indent");
                    proxy._removeContextMenuItem("Outdent");
                }

                if (model.viewType == "resourceView") {
                    proxy._removeContextMenuItem("Indent");
                    proxy._removeContextMenuItem("Outdent");
                    proxy._removeContextMenuItem("Above");
                    proxy._removeContextMenuItem("Below");
                    if (ganttRecord && (ganttRecord.eResourceTaskType == "groupTask" || ganttRecord.eResourceTaskType == "resourceTask")) {
                        proxy._removeContextMenuItem("Task");
                    }
                }
            }
        },
      
        queryTaskbarInfo: function (args) {        
            this._trigger("queryTaskbarInfo", args);
        },
        

        zoomingChart: function (args) {
            var proxy = this;
            proxy.reRenderChart(args.delta);
        },

        refreshRowData: function (args) {
            var proxy = this,
                treegridObject = proxy._$treegridHelper.ejTreeGrid("instance");
            ej.TreeGrid.refreshRow(treegridObject, args.index);
        },

        expanding: function (args) {
            var proxy = this;           
            if (!proxy._trigger("expanding", args)) {
                proxy._expandCollapseSettings.state = "";
                if (proxy.model.enableVirtualization) {
                   ej.TreeGrid.sendExpandCollapseRequest(proxy, args);
                } else {
                    proxy._isInExpandCollapse = true;
                    //If need refresh chart if record is added after searching or sorting
                    if (proxy._isRefreshAddedRecord) {
                        args.data.expanded = true;
                        proxy._$treegridHelper.ejTreeGrid("updateExpandStatus", args.data, true);
                        proxy._refreshChartAndGridRows();
                        proxy._isRefreshAddedRecord = false;
                        return;
                    }
                    ej.TreeGrid.sendExpandCollapseRequest(proxy, args);
                    proxy._isInExpandCollapse = false;

                }
                proxy.updateSelectedItemIndex();
            }
        },

        collapsing: function (args) {
            var proxy = this, model= this.model,
                toolbar = $("#" + proxy._id + "_toolbarItems");
            if (!proxy._trigger("collapsing", args)) {
                proxy._expandCollapseSettings.state = "";
                if (proxy.model.enableVirtualization) {
                    ej.TreeGrid.sendExpandCollapseRequest(proxy, args);
                } else {
                    proxy._isInExpandCollapse = true;
                    //If need refresh chart if record is added after searching or sorting
                    if (proxy._isRefreshAddedRecord) {
                        args.data.expanded = false;
                        proxy._$treegridHelper.ejTreeGrid("updateExpandStatus", args.data, false);
                        proxy._refreshChartAndGridRows();
                        proxy._isRefreshAddedRecord = false;
                        return;
                    }
                    proxy._gridRows = proxy.getRows();
                    ej.TreeGrid.sendExpandCollapseRequest(proxy, args);
                    proxy._isInExpandCollapse = false;
                }
                var selectItem = proxy.selectedItem(), index;
                if (selectItem) {
                    var expanded = proxy.getExpandStatus(selectItem);
                    if (!expanded && !args.expanded && args.model.selectedItems.length == 1) {
                        proxy._deSelectRowItem();
                        if (model.toolbarSettings.showToolbar) {
                            if (proxy.model.toolbarSettings.toolbarItems.indexOf("delete") !== -1) {
                                $(toolbar).ejToolbar('disableItem', $(toolbar).find(".e-deleteitem").parent()[0]);
                                if (proxy.model.toolbarSettings.toolbarItems.indexOf("indent") !== -1)
                                    $(toolbar).ejToolbar('disableItem', $(toolbar).find(".e-indent").parent()[0]);
                                if (proxy.model.toolbarSettings.toolbarItems.indexOf("outdent") !== -1)
                                    $(toolbar).ejToolbar('disableItem', $(toolbar).find(".e-outdent").parent()[0]);
                                if (proxy.model.toolbarSettings.toolbarItems.indexOf("edit") !== -1)
                                    $(toolbar).ejToolbar('disableItem', $(toolbar).find(".e-edititem").parent()[0]);
                            }
                        }
                    }
                    else {
                        proxy.updateSelectedItemIndex();
                    }
                }
            }
        },

        refreshRow: function (args) {
            var proxy = this;
            proxy._$ganttchartHelper.ejGanttChart("refreshRow", args.recordIndex);
        },

        _enableEditingEvents: function () {
            var proxy = this,
                model = proxy.model;
            //To off the  event while changing the editSettings dynamically in setModel
            proxy._off($("#" + proxy._id + "_dialogEdit"),
                    "click keypress", "#EditDialog_" + proxy._id + "_Save ,#EditDialog_" + proxy._id + "_Cancel,#EditDialog_" + proxy._id + "_Delete", proxy._buttonClick);

            proxy._off($("#" + proxy._id + "_dialogAdd"),
               "click keypress", "#AddDialog_" + proxy._id + "_Save ,#AddDialog_" + proxy._id + "_Cancel", proxy._buttonClick);

            if (model.editSettings.allowEditing|| model.editSettings.editMode == "dialogTemplate" ||
                (model.toolbarSettings.showToolbar && ((model.editSettings.allowAdding && model.toolbarSettings.toolbarItems.indexOf("add") !== -1) ||
                    (model.editSettings.allowEditing && model.toolbarSettings.toolbarItems.indexOf("index") !== -1)))) {
                
                proxy._on($("#" + proxy._id + "_dialogEdit"),
                    "click keypress", "#EditDialog_" + proxy._id + "_Save ,#EditDialog_" + proxy._id + "_Cancel,#EditDialog_" + proxy._id + "_Delete", proxy._buttonClick);

                proxy._on($("#" + proxy._id + "_dialogAdd"),
                   "click keypress", "#AddDialog_" + proxy._id + "_Save ,#AddDialog_" + proxy._id + "_Cancel", proxy._buttonClick);
                // $(proxy.element).on("click", ".e-icon", $.proxy(proxy._buttonClick, proxy));
            }
        },
        
        cancelEditCell: function () {

            var proxy = this;
            if ($("#ejTreeGrid" + proxy._id + "EditForm").length > 0)
                proxy._$treegridHelper.ejTreeGrid("cancelEditCell");
        },

        _taskbarEditedCancel: function (currentTask)
        {
            this._updateOverlappingValues(currentTask.parentItem);
            this._updateResourceParentItem(currentTask);
            this.refreshGanttRecord(currentTask.parentItem);
            this._updateSharedResourceTask(currentTask);
            if (!currentTask.predecessor || (currentTask.predecessor && currentTask.predecessor.length == 0))
                this._refreshGanttHeightWithRecords();
        },
        _keyPressed: function (action, target, e) {
        },

        _buttonClick: function (e) {                                    
            var proxy = this,   
                model = proxy.model,
                args = {};

            if ((e.type != "click" && e.keyCode !== undefined && e.keyCode != 13))
                return true;
            $(e.target).css("pointer-events", "none");

            if (model.editSettings.allowEditing || model.editSettings.editMode == "dialogTemplate" ||
                (model.toolbarSettings.showToolbar && ((model.editSettings.allowAdding && model.toolbarSettings.toolbarItems.indexOf("add") !== -1) ||
                    (model.editSettings.allowEditing && model.toolbarSettings.toolbarItems.indexOf("edit") !== -1)))) {

                if (e.target.id == "EditDialog_" + proxy._id + "_Save") {
                    if (proxy.model.predecessorMapping) { 
                    var newArgs = {},
                        validateMode = {
                            respectLink: false,
                            removeLink: false,
                            preserveLinkWithEditing: true,
                        };
                    newArgs.editMode = "dialogEdit";
                    newArgs.data = this._editedDialogRecord;
                    newArgs.requestType = "validateLinkedTask";
                    newArgs.validateMode = validateMode;
                    if (!proxy._trigger("actionBegin", newArgs)) {
                        if (proxy._datePickerChangeEvent && (this._editedDialogRecord.isAutoSchedule || model.validateManualTasksOnLinking)) {
                            proxy._datePickerChangeEvent = false;
                            if (!model.enablePredecessorValidation || (model.enablePredecessorValidation && proxy._validateTypes(newArgs))) {
                                if (!proxy._sendSaveRequest("Edit")) {
                                    proxy._isAddEditDialogSave = true; // used for skip the actionBegin client side event while closing the dialog box
                                    $("#" + proxy._id + "_dialogEdit").ejDialog("close");
                                }
                                else { $(e.target).css("pointer-events", "auto"); }
                            }
                            else
                                $("#" + proxy._id + "_dialogEdit").ejDialog("close");
                        }
                        else {
                            if (!proxy._sendSaveRequest("Edit")) {
                                proxy._isAddEditDialogSave = true; // used for skip the actionBegin client side event while closing the dialog box
                                $("#" + proxy._id + "_dialogEdit").ejDialog("close");
                            }
                            else { $(e.target).css("pointer-events", "auto"); }
                        }
                    }
                    } else {
                        if (!proxy._sendSaveRequest("Edit")) {
                            proxy._isAddEditDialogSave = true; // used for skip the actionBegin client side event while closing the dialog box
                            $("#" + proxy._id + "_dialogEdit").ejDialog("close");
                        }
                        else { $(e.target).css("pointer-events", "auto"); }
                    }
                } else if (e.target.id == "EditDialog_" + proxy._id + "_Cancel") {
                    $("#" + proxy._id + "_dialogEdit").ejDialog("close");
                }
                    //For delete option in editing dialog window
                else if (e.target.id == "EditDialog_" + proxy._id + "_Delete") {
                    var result;
                    if (this.model.viewType == "resourceView" && proxy._resourceEditedRecord && proxy._resourceEditedRecord.eResourceTaskType == "resourceChildTask") {
                        result = this.deleteResourceChildTask(proxy._resourceEditedRecord);
                        proxy._resourceEditedRecord = null;
                    }
                    else if (model.allowSelection == false && !ej.isNullOrUndefined(proxy._contextMenuSelectedIndex)) {
                        result = proxy._$treegridHelper.ejTreeGrid("deleteRow", null, true, proxy._contextMenuSelectedIndex);
                    }
                    else {
                        result = proxy._$treegridHelper.ejTreeGrid("deleteRow");
                    }
                    if (!(result == true)) {
                        proxy._isAddEditDialogSave = true;
                        $("#" + proxy._id + "_dialogEdit").ejDialog("close");
                    }
                    else { $(e.target).css("pointer-events", "auto"); }
                }
                else if (e.target.id == "AddDialog_" + proxy._id + "_Save") {
                    if (!proxy._sendSaveRequest("Add")){
                        if (!this._duplicate && !this._wrongenddate) {
                            proxy._isAddEditDialogSave = true; // used for skip the actionBegin client side event while closing the dialog box
                            $("#" + proxy._id + "_dialogAdd").ejDialog("close");
                        }
                        else { $(e.target).css("pointer-events", "auto"); }
                    }
                    else { $(e.target).css("pointer-events", "auto"); }
                }
                else if (e.target.id == "AddDialog_" + proxy._id + "_Cancel") {
                  //  proxy._ids.splice(proxy._ids.length - 1, 1);
                    $("#" + proxy._id + "_dialogAdd").ejDialog("close");
                }
            }
            else {
                proxy._sendCancelRequest();
            }

            return false;
        },
        rowDrag: function (args) {
            var proxy = this;
            proxy.model.selectedCellIndexes = [];
            proxy._trigger("rowDrag", args);
        },
        rowDragStart: function (args) {
            var proxy = this;
            proxy._trigger("rowDragStart", args);
        },
        rowDragStop: function (args) {
            var proxy = this;
            proxy._trigger("rowDragStop", args);
        },
        cellSelecting: function (args) {
            var proxy = this, model = proxy.model;
            proxy._trigger("cellSelecting", args);           
        },
        cellSelected: function (args) {
            var proxy = this, model = proxy.model;
            proxy._trigger("cellSelected", args);
            model.selectedCellIndexes = proxy._$treegridHelper.ejTreeGrid("instance").model.selectedCellIndexes;
            proxy._rowIndexOfLastSelectedCell = model.selectedCellIndexes[0].rowIndex;
        },
        //trigger row selecting client side event
        rowSelecting: function (args) {
            var proxy = this, eventArgs = {}, model = this.model;
            if (proxy.model.rowSelecting && model.selectionMode == "row") {
                eventArgs.recordIndex = args.recordIndex;
                eventArgs.previousIndex = args.previousIndex;
                eventArgs.previousData = model.updatedRecords[args.previousIndex];
                eventArgs.data = model.updatedRecords[args.recordIndex];
                eventArgs.previousChartRow = proxy._$ganttchartHelper.ejGanttChart("getRowByIndex", args.previousIndex);
                eventArgs.previousGridRow = ej.TreeGrid.getRowByIndex(this, args.previousIndex);
                eventArgs.targetChartRow = proxy._$ganttchartHelper.ejGanttChart("getRowByIndex", args.recordIndex);
                eventArgs.targetGridRow = ej.TreeGrid.getRowByIndex(this, args.recordIndex);
                if (model.selectedItems.length > 1) {
                    eventArgs.selectedItems = model.selectedItems;
                }
                if (proxy._trigger("rowSelecting", eventArgs))
                    return false;
            }
            return true;
        },
        _getCtrlRequestValue: function (args) {
            var proxy = this, model = proxy.model,
                id = proxy._id,
                treeGridObj = proxy._$treegridHelper.ejTreeGrid("instance"),
                chartObj = proxy._$ganttchartHelper.ejGanttChart("instance");
            if ($("#" + id + "_selectionpopup").is(":visible")) {
                if ($("#" + id + "_selectionpopup").find(".e-rowselect").hasClass("e-spanclicked")) {
                    if (model.selectionMode == "row")
                        args.ctrlKey = treeGridObj._multiSelectCtrlRequest = chartObj._multiSelectCtrlRequest = true;
                }               
            }
            if (args.requestType == "expandCollapse") {
                proxy._ganttTouchTrigger = false;
            }
        },
        //to handle multitouch actions
        _updateTouchCtrlFlag: function (e) {
            var proxy = this, model = proxy.model;               
            if(e.type=="touchstart"){
                proxy._ganttTouchTrigger = true;
                proxy._ganttTouchEvent = true;
            }          
        },

        //Render Multi selection indicator
        _renderMultiSelectionPopup: function () {
            this._multiSelectPopup = ej.buildTag("div.e-ganttpopup#" + this._id + "_selectionpopup", "", { display: "none" });
            var $content = ej.buildTag("div.e-popupcontent"), $downTail = ej.buildTag("div.e-downtail e-tail");
            var $selElement = ej.buildTag("span.e-rowselect e-icon");
            $content.append($selElement);
            this._multiSelectPopup.append($content);
            this._multiSelectPopup.append($downTail);
            this.element.append(this._multiSelectPopup);
        },
        //to clear multiselect popup
        _clearMultiSelectPopup: function () {
            var proxy = this, model = proxy.model,
                treeGridObj = proxy._$treegridHelper.ejTreeGrid("instance"),
                chartObj = proxy._$ganttchartHelper.ejGanttChart("instance");
            if (model.allowSelection) {
                if (proxy._multiSelectPopup && proxy._multiSelectPopup.is(":visible")) {
                    $("#" + proxy._id + "_selectionpopup").find(".e-rowselect").removeClass("e-spanclicked");
                    proxy._multiSelectPopup.hide();
                    treeGridObj._multiSelectCtrlRequest = chartObj._multiSelectCtrlRequest = false;
                    proxy._ganttTouchTrigger = treeGridObj._ganttTouchTrigger = chartObj._ganttTouchTrigger = false;
                }
            }
        },
        //to align multiselect popup on window resizing
        _alignMultiSelectPopup: function () {
            var proxy = this,
                contentHeightLimit = $(proxy.element).offset().top + $(proxy.element).outerHeight(),
                contentWidthLimit = $(proxy.element).offset().left + $(proxy.element).outerWidth();
            if ((proxy._multiSelectPopup.offset().top + proxy._multiSelectPopup.outerHeight() + 10) > contentHeightLimit  || (proxy._multiSelectPopup.offset().left + proxy._multiSelectPopup.outerWidth()) > contentWidthLimit) {
                var top = $(proxy.element).offset().top + ($(proxy.element).outerHeight() / 2),
               left = $(proxy.element).offset().left + ($(proxy.element).outerWidth() / 2);
                if ($(proxy.element).find(".e-hscrollbar").length > 0)
                    top = top - $(proxy.element).find(".e-hscrollbar").outerHeight();
                if ($(proxy.element).find(".e-vscrollbar").length > 0)
                    left = left - $(proxy.element).find(".e-vscrollbar").outerWidth();
                proxy._multiSelectPopup.offset({ top: (top - (this._multiSelectPopup.height() / 2) - 5), left: (left - (this._multiSelectPopup.width() / 2)) });
            }
        },
        rowSelected: function (args) {
                var proxy = this, model = this.model,
                toolbar = $("#" + proxy._id + "_toolbarItems"),
                treeGridObj = proxy._$treegridHelper.ejTreeGrid("instance"),
                chartObj = proxy._$ganttchartHelper.ejGanttChart("instance");
            if (model.allowSelection) {
                if (args.target == "ejTreeGrid") {                    
                    chartObj._multiSelectCtrlRequest = treeGridObj._multiSelectCtrlRequest;
                    proxy._$ganttchartHelper.ejGanttChart("selectRows", args.recordIndex, args.toIndex);                  
                }
                if (args.target == "ejGanttChart") {                    
                    treeGridObj._multiSelectCtrlRequest = chartObj._multiSelectCtrlRequest;
                    proxy._$treegridHelper.ejTreeGrid("selectRows", args.recordIndex,args.toIndex);
                }                
                chartObj._multiSelectCtrlRequest = treeGridObj._multiSelectCtrlRequest = false;
            }
            var idx = args.recordIndex;
            model.selectedItems = treeGridObj.model.selectedItems;
            model.selectedItem = treeGridObj.model.selectedItem;
            this.selectedRowIndex(model.updatedRecords.indexOf(model.selectedItem));
            if (proxy.model.toolbarSettings.showToolbar && args.requestType != "rowDragAndDrop") {
                if (proxy.model.readOnly == true) {
                    var disableItems = [];
                    if ($(toolbar).find(".e-deleteitem").parent()[0])
                        disableItems.push($(toolbar).find(".e-deleteitem").parent()[0]);
                    if ($(toolbar).find(".e-addnewitem").parent()[0])
                        disableItems.push($(toolbar).find(".e-addnewitem").parent()[0]);
                    if ($(toolbar).find(".e-edititem").parent()[0])
                        disableItems.push($(toolbar).find(".e-edititem").parent()[0]);
                    $(toolbar).ejToolbar('disableItem', disableItems);

                }

                else {

                    if ((proxy.model.toolbarSettings.toolbarItems.indexOf("indent") !== -1 || proxy.model.toolbarSettings.toolbarItems.indexOf("outdent") !== -1) && proxy.model.allowSelection) {

                        if (model.selectedItems.length > 1) {                              
                              proxy._multipleIndentOutdentOption(model.selectedItems);
                        }
                        else
                            proxy.updateIndentOutdentOption(model.selectedItem);
                    }

                    var enableItems = [];

                    if (proxy.model.editSettings.allowDeleting && proxy.model.allowSelection) {
                        if (proxy.model.toolbarSettings.toolbarItems.indexOf("delete") !== -1 && model.selectedItems.length > 0)
                            enableItems.push($(toolbar).find(".e-deleteitem").parent()[0]);
                    }
                    if (proxy.model.editSettings.allowAdding) {
                        if (proxy.model.toolbarSettings.toolbarItems.indexOf("add") !== -1)
                            enableItems.push($(toolbar).find(".e-addnewitem").parent()[0]);
                    }
                    if (proxy.model.editSettings.allowEditing && proxy.model.allowSelection && model.editSettings.beginEditAction != "click") {
                        if (proxy.model.toolbarSettings.toolbarItems.indexOf("edit") !== -1 && model.selectedItems.length == 1)
                            enableItems.push($(toolbar).find(".e-edititem").parent()[0]);
                    }

                    $(toolbar).ejToolbar('enableItem', enableItems);
                }
            }

            var eventArgs = {};
            eventArgs.recordIndex = args.recordIndex;
            var data = $.extend({}, model.updatedRecords[args.recordIndex]);
            /* Delete the childRecords and parentItem from data because of avoid circular reference
               while performing postback in ASP.NET */
            delete data.childRecords; 
            delete data.parentItem;
            eventArgs.data = data;
            eventArgs.targetChartRow = proxy._$ganttchartHelper.ejGanttChart("getRowByIndex", args.recordIndex);
            eventArgs.targetGridRow = ej.TreeGrid.getRowByIndex(this, args.recordIndex);
            if (model.selectedItems.length > 1) {
                eventArgs.selectedItems = model.selectedItems;
            }
            if (model.allowSelection && model.selectionMode == "row")
                proxy._trigger("rowSelected", eventArgs);
        },
        //to enable the indent/outdent toolbar icon for any of the possible record in multiselection
        _multipleIndentOutdentOption: function (record) {
            var proxy = this, isIndent = false, isOutdent = false,
                toolbar = $("#" + proxy._id + "_toolbarItems"),
                indentIconElement = $(toolbar).find(".e-indent").parent()[0],
                outentIconElement = $(toolbar).find(".e-outdent").parent()[0];
            for (var i = 0; i < record.length; i++) {
                proxy.updateIndentOutdentOption(record[i]);
                if (!$($(toolbar).find(".e-indent").parent()[0]).hasClass("e-disable")) isIndent = true;
                if (!$($(toolbar).find(".e-outdent").parent()[0]).hasClass("e-disable")) isOutdent = true;
                if (isIndent) $(toolbar).ejToolbar('enableItem', indentIconElement);
                if (isOutdent) $(toolbar).ejToolbar('enableItem', outentIconElement)
                if (isOutdent && isIndent)
                    break;
            }
        },

        updateIndentOutdentOption: function (ganttRecord) {
            var proxy = this,
                flatRecords = proxy.model.flatRecords;

            var recordIndex = flatRecords.indexOf(ganttRecord),
                previousGanttRecord;

            var toolbar = $("#" + proxy._id + "_toolbarItems"),
                indentIconElement = $(toolbar).find(".e-indent").parent()[0],
                outentIconElement = $(toolbar).find(".e-outdent").parent()[0];
            if (recordIndex === 0 || proxy.model.editSettings.allowIndent == false || proxy.model.readOnly == true || !proxy.model.allowSelection || ej.isNullOrUndefined(ganttRecord) || recordIndex == -1) {
                if (indentIconElement)
                    $(toolbar).ejToolbar('disableItem', indentIconElement);

                if (outentIconElement)
                    $(toolbar).ejToolbar('disableItem', outentIconElement);
            }
            else {
                if (ganttRecord.level === 0 && proxy.model.editSettings.allowIndent == true) {
                    if (indentIconElement)
                        $(toolbar).ejToolbar('enableItem', indentIconElement);
                    if (outentIconElement)
                        $(toolbar).ejToolbar('disableItem', outentIconElement);
                }
                else {
                    previousGanttRecord = flatRecords[recordIndex - 1];
                    if ((ganttRecord.level - previousGanttRecord.level === 1) && proxy.model.editSettings.allowIndent == true && proxy.selectedRowIndex() !=-1) {
                        if (outentIconElement)
                            $(toolbar).ejToolbar('enableItem', outentIconElement);
                        if (indentIconElement)
                            $(toolbar).ejToolbar('disableItem', indentIconElement);
                    }

                    else if (proxy.model.editSettings.allowIndent == true && proxy.selectedRowIndex() != -1) {
                        if (indentIconElement)
                            $(toolbar).ejToolbar('enableItem', indentIconElement);
                        if (outentIconElement)
                            $(toolbar).ejToolbar('enableItem', outentIconElement);
                    }
                }
            }
        },

        _ganttChartRowHover: function (args) {
            var proxy = this;
            if (args.reason == "mouseenter")
                proxy._$treegridHelper.ejTreeGrid("addRowHover", args.index);
            else if (args.reason == "mouseleave")
                proxy._$treegridHelper.ejTreeGrid("removeRowHover");
        },
     
        getExpandedRecordCount: function (record, count)
        {
            var currentRecord, proxy = this;
            if (!record.hasChildRecords)
                return 0;
            for (var i = 0; i < record.childRecords.length; i++) {
                currentRecord = record.childRecords[i];
                if (proxy.getExpandStatus(currentRecord))
                    count++;
                
                if (currentRecord.hasChildRecords) {
                    count = proxy.getExpandedRecordCount(currentRecord, count);
                }
            }
            return count;
        },

        _updateExpandStatus:function()
        {
            var proxy = this,
                records = this.model.flatRecords,
            length = records.length, oldValue;
            for (var i = 0; i < length; i++) {
                oldValue = records[i].isExpanded;
                if (proxy.getExpandStatus(records[i]) !== records[i].isExpanded) {
                    records[i].isExpanded = proxy.getExpandStatus(records[i]);
                    if (records[i].isExpanded) {
                        proxy._totalCollapseRecordCount--;
                    }
                    else {
                        proxy._totalCollapseRecordCount++;
                    }
                }
            }
        },
        actionComplete: function (args) {
            var proxy = this,model = proxy.model,
                addedIndex = null;
            proxy.model.updatedRecords = proxy.getUpdatedRecords();
            proxy.model.currentViewData = proxy.getCurrentViewData();
            proxy._gridRows = proxy.getRows();
            proxy._ganttChartRows = proxy.getGanttChartRows();
            proxy._totalCollapseRecordCount = proxy._$treegridHelper.ejTreeGrid("getCollapsedRecordCount");

            if (args.requestType === "searching" || args.requestType === "sorting" || args.requestType == "filtering") {
                proxy._isRefreshAddedRecord = false;
                proxy._$ganttchartHelper.ejGanttChart("clearConnectorLines");
                proxy._$ganttchartHelper.ejGanttChart("refreshHelper", proxy.model.currentViewData, proxy.model.updatedRecords, proxy._totalCollapseRecordCount);
                this._refreshConnectorLines(false, true, true);
            }
            if (args.requestType == "sorting") {
                proxy._deSelectRowItem();
            }

            if (args.requestType === "delete") {
                proxy._isRefreshAddedRecord = false;
                this.dataSource(proxy._$treegridHelper.ejTreeGrid("getDataSource"));
                if (proxy._isDataManagerUpdate)
                    this._jsonData = proxy._$treegridHelper.ejTreeGrid("getUpdatedDataManagerData");
                proxy.model.flatRecords = proxy._$treegridHelper.ejTreeGrid("getFlatRecords");
                proxy.model.ids = proxy._$treegridHelper.ejTreeGrid("getUpdatedIds");
                proxy.model.updatedRecords = proxy.getUpdatedRecords();
                model.selectedItem = null;
                this.selectedRowIndex(-1);
                proxy.model.selectedItems = [];
                proxy._$ganttchartHelper.ejGanttChart("instance")._prevSelectedItem = null;
                proxy._clearMultiSelectPopup();
                var childCount = 0,
                    expandedRecordCount=0;
                for (var i = 0; i < args.deletedItems.length; i++) {
                    args.data = args.deletedItems[i];
                    if (ej.isNullOrUndefined(args.data.parentItem) || (args.data.parentItem && model.flatRecords.indexOf(args.data.parentItem) != -1)) {
                        //Delete from parent collection if item is in parentsCollection
                        if (model.parentRecords.indexOf(args.data) !== -1) {
                            model.parentRecords.splice(model.parentRecords.indexOf(args.data), 1);
                        }
                        //Delete predecessor from child records
                        if (args.data.hasChildRecords) {
                            proxy._removeChildRecordsPredecessor(args.data)
                        }
                        //Delete Predecessor from record
                        if (!args.isDragAndDropDelete && proxy._isTriggerActionComplete)
                            args.data.predecessor && proxy._removePredecessor(args.data.predecessor, args.data);
                        //Update parent item if item has parent
                        if (args.data.parentItem) {
                            var parentRecord = args.data.parentItem;
                            if (args.data.parentItem.childRecords &&
                                args.data.parentItem.childRecords.length > 0) {
                                if (args.data.eResourceTaskType == "resourceTask")
                                    proxy._updateResourceParentItem(args.data);
                                else if (args.data.parentItem.isAutoSchedule)
                                    proxy._updateParentItem(args.data);
                                else if (!args.data.parentItem.isAutoSchedule)
                                    proxy._updateManualParentItem(args.data);
                            } else {
                                parentRecord.expanded = false;
                                parentRecord.hasChildRecords = false;
                                proxy.refreshGanttRecord(parentRecord);
                            }
                        }
                    }
                }
                /*Update parentRecords collection delete action*/
                if (model.viewType == "resourceView") {
                    model.parentRecords = args.model.parentRecords.slice();
                }
                // To avoid refresh of gantt chart twice.
                if (args.isDragAndDropDelete)
                    return;
                if (proxy.model.predecessorMapping) {
                    proxy._refreshConnectorLines(false, true, false);
                }
                if (this.isCriticalPathEnable == true) {
                    this.showCriticalPath(true, true);
                }
                //Scroller is not correctly updated before connector line cleared.
                proxy._$ganttchartHelper.ejGanttChart("refreshHelper", proxy.getCurrentViewData(), proxy.getUpdatedRecords(), proxy._totalCollapseRecordCount);

                proxy._updateToolbarOptions(); // for uypdating toolbar items after delete operation
                proxy.updateAltRow(proxy.getUpdatedRecords(), 0, 1);//for set e-alt-row style after deletion of element  
                if (this.isCriticalPathEnable == true) {
                    proxy._$ganttchartHelper.ejGanttChart("criticalConnectorLine", this.criticalPathCollection, this.detailPredecessorCollection, true, this.collectionTaskId);
                }
            }

            if (args.requestType === "selection") {
                proxy._$ganttchartHelper.ejGanttChart("selectRows", args.recordIndex);
            }

            if (args.requestType === "rowHover") {
                proxy._$ganttchartHelper.ejGanttChart("addRowHover", args.index);
            }
            
            if (args.requestType === "scroll") {
                
                proxy._$ganttchartHelper.ejGanttChart("onScrollHelper", args.delta);
            }
            if (args.requestType == "dragAndDrop") {
                model.parentRecords = proxy._$treegridHelper.ejTreeGrid("instance").model.parentRecords;
                proxy._isRefreshAddedRecord = false;
                this.dataSource(proxy._$treegridHelper.ejTreeGrid("getDataSource"));
                if (proxy._isDataManagerUpdate)
                    this._jsonData = proxy._$treegridHelper.ejTreeGrid("getUpdatedDataManagerData");
                model.flatRecords = proxy._$treegridHelper.ejTreeGrid("getFlatRecords");
                model.ids = proxy._$treegridHelper.ejTreeGrid("getUpdatedIds");
                model.updatedRecords = proxy.getUpdatedRecords();               
                var parentData = args.draggedRow.parentItem;
                if (args.droppedPosition == "insertAsChild" && parentData) {
                    parentData.taskType = ej.Gantt.TaskType.FixedDuration;
                    parentData.effortDriven = "false";
                }
                if (model.predecessorMapping) {
                    if (args.isFromRevertDragging) {
                        proxy._addRemovedPredecessor(args.clonedTarget);
                    }
                    //Remove predecessor information from parent of dropped record.
                    if (args.droppedPosition == "insertAsChild") {                       
                        parentData.predecessor && proxy._removePredecessor(parentData.predecessor, parentData);
                        parentData.item[model.predecessorMapping] = undefined;
                        parentData.predecessorsName = undefined;
                        parentData.predecessor = undefined;
                        model.enableSerialNumber && proxy._$treegridHelper.ejTreeGrid("predecessorToSerialPredecessor", parentData);
                    }                    
                    proxy._refreshConnectorLines(false, true, false);
                }
                if (args.draggedRow.parentItem && args.draggedRow.parentItem.isAutoSchedule)
                    proxy._updateParentItem(args.draggedRow);
                else if (args.draggedRow.parentItem && !args.draggedRow.parentItem.isAutoSchedule)
                    proxy._updateManualParentItem(args.draggedRow);
                var previousParentItem = args.previousParentItem ? this._getRecordByTaskId(args.previousParentItem.taskId.toString()) : null;;
                if (previousParentItem && previousParentItem.childRecords && previousParentItem.childRecords.length > 0) {
                    if (previousParentItem.isAutoSchedule)
                        proxy._updateParentItem(previousParentItem.childRecords[0]);
                    else if (!previousParentItem.isAutoSchedule)
                        proxy._updateManualParentItem(previousParentItem.childRecords[0]);
                }
                if (this.isCriticalPathEnable == true) {
                    this.showCriticalPath(true, true);
                }
                if (args.draggedRow)
                    proxy._$ganttchartHelper.ejGanttChart("refreshHelper", proxy.getCurrentViewData(), proxy.getUpdatedRecords(), proxy._totalCollapseRecordCount);
                if (this.isCriticalPathEnable == true) {
                    proxy._$ganttchartHelper.ejGanttChart("criticalConnectorLine", this.criticalPathCollection, this.detailPredecessorCollection, true, this.collectionTaskId);
                }
            }
            if (args.requestType === "save") {
                if (args._cAddedRecord) {
                    var verticalIndex = -1;
                    if (model.viewType == "resourceView" && args._cAddedRecord.eResourceTaskType == "resourceChildTask") {
                        verticalIndex = model.updatedRecords.indexOf(args._cAddedRecord.parentItem);
                    } else {
                        verticalIndex = model.updatedRecords.indexOf(args._cAddedRecord);
                    }
                    //Update WBS value while adding through ADD DIALOG
                    if (model.enableWBS && model.enableWBSPredecessor && model.predecessorMapping && model.viewType == "projectView") {
                        proxy._$treegridHelper.ejTreeGrid("updateWBSPredecessor", args._cAddedRecord);
                    }
                    proxy._renderAddedRow(args.index, args._cAddedRecord);
                   

                    if (args._cAddedRecord.parentItem && args._cAddedRecord.parentItem.isAutoSchedule && args._cAddedRecord.parentItem.eResourceTaskType != "resourceTask")
                        proxy._updateParentItem(args._cAddedRecord);
                    else if (args._cAddedRecord.parentItem && !args._cAddedRecord.parentItem.isAutoSchedule && args._cAddedRecord.parentItem.eResourceTaskType != "resourceTask")
                        proxy._updateManualParentItem(args._cAddedRecord);
                    if (model.enableAltRow)
                        ej.TreeGrid.updateAltRow(proxy, model.currentViewData[0], 0, 0);

                    //proxy.updateAltRow(model.updatedRecords[0], 0, 0);

                    /* select newly added item */
                    if(model.selectionType==ej.Gantt.SelectionType.Multiple)
                    {
                        //to clear ctrlselection
                        proxy._$treegridHelper.ejTreeGrid("instance")._multiSelectCtrlRequest = proxy._$ganttchartHelper.ejGanttChart("instance")._multiSelectCtrlRequest = false;
                    }
                    proxy.selectRows(verticalIndex);
                    addedIndex = args._cAddedRecord;

                    /*trigger row events and taskbar event for new record*/
                    if (!model.enableVirtualization) {
                        var refreshArgs = {};
                        refreshArgs.index = refreshArgs.recordIndex = model.currentViewData.indexOf(args._cAddedRecord);
                        proxy.refreshRowData(refreshArgs);
                        proxy.refreshRow(refreshArgs);
                    }
                } else if (args._cModifiedData) {                    
                    var prevOverlapIndex;
                    if (args._cModifiedData.hasChildRecords && args._cModifiedData.isAutoSchedule) {
                        
                        args._cModifiedData.startDate = proxy._checkStartDate(args._cModifiedData.manualStartDate, args._cModifiedData);                        
                        args._cModifiedData.left = args._cModifiedData._calculateManualLeft(this);
                        args._cModifiedData.width = args._cModifiedData._calculateManualWidth(this);
                        args._cModifiedData.progressWidth = args._cModifiedData._getProgressWidth(args._cModifiedData.width, args._cModifiedData.status);
                        args._cModifiedData.endDate = args._cModifiedData.manualEndDate;
                        args._cModifiedData._calculateDuration(this);                                                
                    }
                    else if (args._cModifiedData.hasChildRecords && !args._cModifiedData.isAutoSchedule) {
                        args._cModifiedData.left = args._cModifiedData._calculateLeft(this);
                        args._cModifiedData.width = args._cModifiedData._calculateWidth(this);
                        args._cModifiedData._calculateDuration(this);
                        args._cModifiedData.manualStartDate = args._cModifiedData.startDate;
                        args._cModifiedData.manualEndDate = args._cModifiedData.endDate;
                        proxy._updateManualParentItem(args._cModifiedData, null, true);
                    }
                    else {
                        args._cModifiedData.startDate = proxy._checkStartDate(args._cModifiedData.startDate, args._cModifiedData);
                        if(!ej.isNullOrUndefined(args._cModifiedData.startDate) && !ej.isNullOrUndefined(args._cModifiedData.duration))
                            args._cModifiedData.endDate = proxy._getEndDate(args._cModifiedData.startDate, args._cModifiedData.duration, args._cModifiedData.durationUnit, args._cModifiedData);
                        args._cModifiedData.left = args._cModifiedData._calculateLeft(this);
                        args._cModifiedData.width = args._cModifiedData._calculateWidth(this);
                        args._cModifiedData.progressWidth = args._cModifiedData._getProgressWidth(args._cModifiedData.width, args._cModifiedData.status);
                    }
                    //Update WBS value while editing through EDIT DIALOG
                    if (model.enableWBS && model.enableWBSPredecessor && model.predecessorMapping) {
                        proxy._$treegridHelper.ejTreeGrid("updateWBSPredecessor", args._cModifiedData);
                    }

                    if (model.viewType == ej.Gantt.ViewType.ProjectView)
                        proxy.refreshGanttRecord(args._cModifiedData);

                    if (args._cModifiedData.parentItem && args._cModifiedData.parentItem.isAutoSchedule && args._cModifiedData.parentItem.eResourceTaskType != "resourceTask")
                        proxy._updateParentItem(args._cModifiedData);
                    else if (args._cModifiedData.parentItem && !args._cModifiedData.parentItem.isAutoSchedule && args._cModifiedData.parentItem.eResourceTaskType != "resourceTask")
                        proxy._updateManualParentItem(args._cModifiedData);
                    else if (args._cModifiedData.parentItem && args._cModifiedData.parentItem.eResourceTaskType == "resourceTask") {
                        prevOverlapIndex = args._cModifiedData.parentItem.eOverlapIndex;
                        /*Method to update the overallping values of edited resource tasks*/
                        this._updateOverlappingValues(args._cModifiedData.parentItem);
                        this._updateResourceParentItem(args._cModifiedData);
                    }
                    if (model.viewType == ej.Gantt.ViewType.ResourceView) {
                        if (args._cModifiedData.eResourceTaskType == "resourceChildTask")
                            proxy.refreshGanttRecord(args._cModifiedData.parentItem);
                        else if (args._cModifiedData.eResourceTaskType == "unassignedTask" && (ej.isNullOrUndefined(args._cModifiedData.resourceInfo) || (args._cModifiedData.resourceInfo && args._cModifiedData.resourceInfo.length == 0)))
                            proxy.refreshGanttRecord(args._cModifiedData);
                    }
                    if (args._cModifiedData.eResourceTaskType == "resourceChildTask") {
                        this._updateSharedResourceTask(args._cModifiedData);
                        if (proxy._previousResource && proxy._previousResource.length > 0) {
                            this._updateSharedResourceTask(args._cModifiedData, null, proxy._previousResource);
                        }
                    }
                    if (model.viewType == ej.Gantt.ViewType.ResourceView)
                        proxy._updateResource(proxy._previousResource, args._cModifiedData.resourceInfo, args._cModifiedData);

                    if (args._cModifiedData.eResourceTaskType == "resourceChildTask" && (prevOverlapIndex != args._cModifiedData.parentItem.eOverlapIndex || this._isOverlapIndexChanged)) {
                        //need to update record height when overlap index value updated on taskbar edit action
                        this._refreshGanttHeightWithRecords();
                        this._isOverlapIndexChanged = false;
                    }
                    if (args._cModifiedData.predecessor) {
                        if (args.previousValue) {
                            proxy._removeConnectorLine(args.previousValue, args._cModifiedData);
                        }
                    }
                }
                
                if (proxy.model.predecessorMapping) {

                    if ((args._cModifiedData && args._cModifiedData.predecessor)) {
                        proxy._isValidationEnabled = true;
                    }
                    else
                        proxy._isValidationEnabled = false;
                    if (args._cAddedRecord) {
                        if (args._cAddedRecord.predecessor) {
                            proxy._isPredecessorEdited = true;
                            proxy._validatePredecessorDates(args._cAddedRecord);
                            proxy._addConnectorLine(args._cAddedRecord);
                            proxy._isPredecessorEdited = false;
                        }
                        proxy._refreshConnectorLines(false, true, false);
                    } else {
                        if (args._cModifiedData) {
                            if (args.previousValue) {
                                proxy._removeConnectorLine(args.previousValue, args._cModifiedData);
                            }
                            proxy._addConnectorLine(args._cModifiedData);
                            if (args._cModifiedData.predecessor) {
                                if(proxy._isUpdateOffset)
                                    proxy._editedTaskBarItem = args._cModifiedData;
                                proxy._isMileStoneEdited = args._cModifiedData.isMilestone;
                                proxy._updatedConnectorLineCollection = [];
                                proxy._connectorlineIds = [];
                                proxy._validatePredecessor(args._cModifiedData,args.previousValue);
                                if (proxy._isUpdateOffset)
                                   proxy._editedTaskBarItem = null;
                                if (proxy._updatedConnectorLineCollection.length > 0 && model.viewType == "projectView") {
                                    proxy._$ganttchartHelper.ejGanttChart("appendConnectorLine", proxy._updatedConnectorLineCollection);
                                    this._updateConnectorLineCollection(proxy._updatedConnectorLineCollection);
                                }
                            }
                            if (args._cModifiedData.parentItem && args._cModifiedData.parentItem.isAutoSchedule && args._cModifiedData.parentItem.eResourceTaskType != "resourceTask")
                                proxy._updateParentItem(args._cModifiedData);
                            else if (args._cModifiedData.parentItem && !args._cModifiedData.parentItem.isAutoSchedule && args._cModifiedData.parentItem.eResourceTaskType != "resourceTask")
                                proxy._updateManualParentItem(args._cModifiedData);
                        }
                    }
                }

                /*To update auto scheduled task on updating manual parent task's start date*/
                if (args._cModifiedData && args._cModifiedData.hasChildRecords && !args._cModifiedData.isAutoSchedule && args.previousStartDate
                    && proxy._compareDates(args.previousStartDate, args._cModifiedData.startDate) != 0) {
                    var updateArgs = {};
                    updateArgs.previousData = $.extend({}, args._cModifiedData);
                    updateArgs.previousData.startDate = args.previousStartDate;
                    updateArgs.data = args._cModifiedData;
                    proxy._validateAutoChildRecords(updateArgs);
                }

                if (this.isCriticalPathEnable == true) {
                    proxy._$ganttchartHelper.ejGanttChart("criticalConnectorLine", this.criticalPathCollection, this.detailPredecessorCollection, false, this.collectionTaskId);
                    this.showCriticalPath(true);
                }
            }

            if (args.requestType === "validatePredecessor" || args.requestType === "validateSerialPredecessor") {
                var result;
                if (args.requestType === "validateSerialPredecessor")
                    result = proxy._editedPredecessorValidation(args, true);
                else
                    result = proxy._editedPredecessorValidation(args);
                args.result = result;
                return;
            }
            if (proxy._isTriggerActionComplete) {
                if (model.viewType == "resourceView" && args.requestType == "delete") {
                    if (args.data && args.data.eResourceTaskType == "groupTask")
                        args.requestType = "groupDelete";
                    else if (args.data && args.data.eResourceTaskType == "resourceTask")
                        args.requestType = "resourceDelete";
                }
                proxy._ganttActionCompleteTrigger(args);
            }
            // Update the scrollbar for focus the newly added record
            if (addedIndex) {
                proxy.focusOnTask(addedIndex);
            }
        },


        _addRemovedPredecessor: function (record) {
            var proxy = this, predecessor = record.predecessor, length = predecessor.length, count = -1, model = proxy.model, childGanttRecord;
            for (count; count < length; count++) {
                // Remove Connector line from UI
                if (count == -1) {
                    childGanttRecord = this._getRecordByTaskId(record.taskId.toString());
                } else {
                    if (predecessor[count].from !== record.taskId.toString()) {
                        childGanttRecord = this._getRecordByTaskId(predecessor[count].from);
                    }
                    else if (predecessor[count].to !== record.taskId.toString()) {
                        childGanttRecord = this._getRecordByTaskId(predecessor[count].to);
                    }
                }

                if (childGanttRecord) {
                    if (count == -1)
                        childGanttRecord.predecessor = predecessor;
                    else
                        childGanttRecord.predecessor.push(predecessor[count]);

                    if (childGanttRecord) {
                        childGanttRecord.item[model.predecessorMapping] = proxy._predecessorToString(childGanttRecord.predecessor, childGanttRecord);
                        childGanttRecord.predecessorsName = childGanttRecord.item[model.predecessorMapping];
                        this._updateResourcePredecessor(childGanttRecord);
                        if (model.enableWBS && model.enableWBSPredecessor)
                            proxy._$treegridHelper.ejTreeGrid("updateWBSPredecessor", childGanttRecord);
                        model.enableSerialNumber && proxy._$treegridHelper.ejTreeGrid("predecessorToSerialPredecessor", childGanttRecord);
                        proxy.refreshGanttRecord(childGanttRecord);
                    }
                }
            }
        },


        //Add and remove the task in resource
        _updateResource: function (prevResource, currentResource, updateRecord, args)
        {
            var proxy = this,
                model = proxy.model,
                ids = model.ids,
                flatRecords = model.flatRecords,
                currentLength = currentResource ? currentResource.length : 0,
                previousLength = prevResource ? prevResource.length : 0,
                dataSource = proxy.dataSource(),
                currentPredecessor = updateRecord.predecessor,
                predecessorsName = updateRecord.predecessorsName,
                _cAddedRecord = null,
                addedRecord;
            if (currentLength == 0 && previousLength == 0)
                return;
            for (var index = 0; index < currentLength; index++) {
                var resourceID = currentResource[index][model.resourceIdMapping];
                var recordIndex = $.map(prevResource, function (data, index) {
                    if (data[model.resourceIdMapping] == resourceID) {
                        return index;
                    }
                });
                if (recordIndex.length == 0) {
                    var record = flatRecords[ids.indexOf("R_" + resourceID)];
                    if (!_cAddedRecord)
                        _cAddedRecord = proxy._createGanttRecord(updateRecord.item, record.level + 1);
                    if (record) {
                        addedRecord = new ej.Gantt.GanttRecord();
                        addedRecord = $.extend(true, addedRecord, _cAddedRecord);
                        addedRecord.eResourceTaskType = "resourceChildTask";
                        addedRecord.parentItem = record;
                        addedRecord.predecessor = $.extend([], currentPredecessor);
                        addedRecord.predecessorsName = predecessorsName;
                        record.eResourceChildTasks.push(addedRecord);
                        this._updateResourceUniqIndex(addedRecord);
                        if (!proxy._isFlatResourceData) {
                            if (!record.item[model.taskCollectionMapping])
                                record.item[model.taskCollectionMapping] = [];
                            record.item[model.taskCollectionMapping].push(addedRecord.item);
                        }
                        this._resourceChildTasks.push(addedRecord);
                        this._updateOverlappingValues(addedRecord.parentItem);
                        this._updateResourceParentItem(addedRecord);
                        proxy.refreshGanttRecord(addedRecord.parentItem);
                        this._updateSharedResourceTask(addedRecord);
                        //this._updateResourceResourceDetails(addedRecord);
                        this._refreshGanttHeightWithRecords();
                        if (args)
                            args.data = addedRecord;
                    }
                }
                else {
                    prevResource.splice(recordIndex[0], 1);
                    var updatableValues = {};
                    updatableValues.resourceInfo = updateRecord.resourceInfo;
                    updatableValues.resourceNames = updateRecord.resourceNames;
                    this._updateSharedResourceTask(updateRecord, updatableValues);
                }
            }
            var prevLength = prevResource ? prevResource.length : 0; 
            for (var index = 0; index < prevLength; index++) {
                var taskID = updateRecord.taskId,
                    resourceID = prevResource[index][model.resourceIdMapping],
                    record = flatRecords[ids.indexOf("R_" + resourceID)];
                var recordIndex = $.map(record.eResourceChildTasks, function (data, index) {
                    if (data.taskId == taskID) {
                        return index;
                    }
                });
                if (recordIndex.length) {
                    var removeRecord = record.eResourceChildTasks[recordIndex[0]];
                    this._removeResourceChildTask(removeRecord);
                    //taskIndex = this._resourceUniqTaskIds.indexOf(removeRecord.taskId);
                    //taskIndex > -1 && this._resourceUniqTaskIds.splice(taskIndex, 1);
                    //taskIndex = this._resourceUniqTasks.indexOf(removeRecord);
                    //taskIndex > -1 && this._resourceUniqTasks.splice(taskIndex, 1);
                    record.eResourceChildTasks.splice(recordIndex[0], 1);
                    this._updateOverlappingValues(record);
                    this._updateResourceParentItem(removeRecord);
                    proxy.refreshGanttRecord(record);
                    this._updateSharedResourceTask(removeRecord);
                    this._refreshGanttHeightWithRecords();
                }
            }
            //Assign resource to unassigned task
            if (updateRecord.eResourceTaskType == "unassignedTask" && currentLength > 0)
            {
                proxy._isTriggerActionComplete = false;
                proxy._$treegridHelper.ejTreeGrid("deleteRow", null, true, model.updatedRecords.indexOf(updateRecord));
                if (addedRecord) {
                    this._resourceUniqTaskIds.push(addedRecord.taskId.toString());
                    this._resourceUniqTasks.push(addedRecord);
                    this._insertDataInDataSource(addedRecord.item);
                }
                proxy._isTriggerActionComplete = true;
            }
            //Remove all the resource from task.
            if (updateRecord.eResourceTaskType == "resourceChildTask" && currentLength == 0) {
                proxy._isTriggerActionComplete = false;
                proxy._isOnResourceUpdate = true; // To prevent new id generation for below add action
                proxy.addRecord(updateRecord.item, "bottom");
                proxy._isOnResourceUpdate = false;
                var newRecord = model.updatedRecords[model.updatedRecords.length - 1];
                if (args)
                    args.data = newRecord;
                if (newRecord) {
                    newRecord.predecessor = $.extend([], currentPredecessor);
                    newRecord.predecessorsName = predecessorsName;
                    this._updateResourceUniqIndex(newRecord);
                }
                proxy._isTriggerActionComplete = true;
            }
        },
        /*Method remove resource from resource info collection and update reosurce related fields*/
        _removeResourceInfo: function (record, resourceId) {
            var model = this.model;
            if (record.resourceInfo && record.resourceInfo.length > 1) {
                var sameIdTasks = this._getExistingTaskWithID(record, true),
                    currentTask;
                if (sameIdTasks == null)
                    return;
                for (var i = 0; i < sameIdTasks.length; i++) {
                    currentTask = sameIdTasks[i];
                    var resources = currentTask.resourceInfo;
                    for (var count = 0; count < resources.length; count++) {
                        if (resources[count][this.model.resourceIdMapping] == resourceId) {
                            resources.splice(count, 1);
                            this._updateResourceName(currentTask);
                            this._updateResourceRelatedFields(currentTask);
                            break;
                        }
                    }
                }
            }
        },
        /*Update resource unique task references*/
        _updateResourceUniqIndex: function (newRecord) {
            var uniqIndex = this._resourceUniqTaskIds.indexOf(newRecord.taskId.toString());
            if (uniqIndex != -1)
                this._resourceUniqTasks[uniqIndex] = newRecord;
            else {
                this._resourceUniqTaskIds.push(newRecord.taskId.toString());
                this._resourceUniqTasks.push(newRecord);
            }
        },
        /*Update the scrollbar to focus the selected task item by it's index*/
        focusOnTask: function (index) {
            var proxy = this, model = proxy.model,
                ganttbody = proxy.element.find(".e-ganttviewerbodyContianer"),
                scroller = ganttbody.ejScroller("instance"),
                taskbarLeft = (index && index.left) ? index.left : model.updatedRecords[index] ?  model.updatedRecords[index].left : 0,
                width = scroller.model.width,
                scrollLeft = scroller.model.scrollLeft,
                hScrollbar = scroller._hScrollbar;
            if (hScrollbar) {
                if (hScrollbar.model.maximum < scrollLeft)
                    scrollLeft = hScrollbar.model.maximum;
                if (scrollLeft > taskbarLeft || (scrollLeft + width) < taskbarLeft) {
                    var left = taskbarLeft - (width / 2);
                    left = left < 0 ? 0 : left;
                    ganttbody.ejScroller("scrollX", left, true);
                }
            }
            proxy._$ganttchartHelper.ejGanttChart("updateScrollBar");
        },
        calculateEndDate: function (args) {
            var proxy = this;
            var endDate = this._getEndDate(proxy._checkStartDate(args.startDate, args.record),
                args.duration, args.durationUnit, args.record);
            proxy._$ganttchartHelper.ejGanttChart("updateEditedRecordEndDate", proxy._checkEndDate(endDate, args.record));
        },

        calculateDuration: function (args) {
            var proxy = this;
            var duration = this._getDuration(proxy._checkStartDate(args.startDate, args.record),
                           proxy._checkEndDate(args.endDate, args.record), args.durationUnit, args.record.isAutoSchedule);
            proxy._$ganttchartHelper.ejGanttChart("updateEditedRecordDuration", duration);
        },
        expandAllCollapseAllRequest:function(args)
        {
            var proxy = this,
                $gridEle = $(proxy.element),//.closest(".e-gantt"),
                gridInstance = $gridEle.ejGantt("instance"),
                gridId = $gridEle.attr('id');
                gridInstance._toolbarOperation(gridId + "_" + args.requestType);
        },
        /*Method to set scroll left on chart side*/
        setChartScrollLeft: function (left) {
            if(!ej.isNullOrUndefined(left))
                this._$ganttchartHelper.ejGanttChart("setScrollLeft", left);
        },
        chartactionComplete: function (args) {
            var proxy = this, model = this.model;

            proxy.model.updatedRecords = proxy.getUpdatedRecords();
            proxy.model.currentViewData = proxy.getCurrentViewData();

            if (args.requestType === "updateConnectors") {
                if (proxy.model.predecessorMapping) {
                    var ganttRecord = args.ganttRecord;
                    proxy._isMileStoneEdited = ganttRecord.isMilestone;
                    proxy._updatedConnectorLineCollection = [];
                    proxy._connectorlineIds = [];
                    proxy._editedTaskBarItem = ganttRecord;
                    proxy._validatePredecessor(ganttRecord);
                    if (proxy._updatedConnectorLineCollection.length > 0) {
                        proxy._$ganttchartHelper.ejGanttChart("appendConnectorLine", proxy._updatedConnectorLineCollection);
                        this._updateConnectorLineCollection(proxy._updatedConnectorLineCollection);
                    }
                    proxy._editedTaskBarItem = null;
                }
                if (model.viewType == "resourceView" && args.ganttRecord.eResourceTaskType == "resourceChildTask")
                    this._refreshGanttHeightWithRecords();
            }

            if (args.requestType === "rowHover") {
                proxy._$treegridHelper.ejTreeGrid('addRowHover', args.index);
            }
            
            if (args.requestType === "scroll" && args.scrollDirection == "vertical") {
                proxy._isTreeGridRendered = false;
                proxy._isGanttChartRendered = false;
                if (args.vscrollExsist && args.delta !== undefined)
                    proxy._$treegridHelper.ejTreeGrid('onScrollHelper', args.delta);

                proxy.model.updatedRecords = proxy.getUpdatedRecords();
                proxy.model.currentViewData = proxy.getCurrentViewData();

                if (proxy.model.enableVirtualization) {

                    if (proxy.model.predecessorMapping) {
                        proxy._refreshConnectorLines(false, true, false);
                    }
                }
                proxy._isTreeGridRendered = true;
                proxy._isGanttChartRendered = true;
            }
            
            if (args.requestType === "selection") {
                proxy._$treegridHelper.ejTreeGrid("selectRows", args.recordIndex);
            }
            //for validate the predecessor on mouse hover and mouse up of second drag point
            if (args.requestType === "validatePredecessor") {
                var flag= proxy._editedPredecessorValidation(args);
                args.predecessorValidation = flag;
            }

            //on mouse up if validation is true then draw connector line
            if (args.requestType === "drawConnectorLine") {

                var currentPredecessor = args.toItem._calculatePredecessor(args.predecessor, this._durationUnitEditText, this.model.durationUnit, proxy);
                args.toItem.item[proxy.model.predecessorMapping] = args.predecessorString[0];
                args.toItem.predecessorsName = args.toItem.item[proxy.model.predecessorMapping];
                //Update WBS value while drawing the predecessor links
                if (model.enableWBS && model.enableWBSPredecessor) {
                    proxy._$treegridHelper.ejTreeGrid("updateWBSPredecessor", args.toItem);
                }
                //Update Serial predecessor value while drawing the predecessor links
                model.enableSerialNumber && proxy._$treegridHelper.ejTreeGrid("predecessorToSerialPredecessor", args.toItem);
                if (!args.fromItem.predecessor) {// for parent item
                    args.fromItem['predecessor'] = currentPredecessor;
                }
                else {
                    args.fromItem.predecessor.push(currentPredecessor[0]);
                }
                if (args.toItem.predecessor)
                {
                    args.toItem.predecessor.push(currentPredecessor[0]);
                }
                else
                {
                    args.toItem.predecessor=[];
                    args.toItem.predecessor.push(currentPredecessor[0]);
                }

                proxy._isMileStoneEdited = args.toItem.isMilestone;
                proxy._updatedConnectorLineCollection = [];
                proxy._connectorlineIds = [];
                if (proxy.model.enablePredecessorValidation && (args.toItem.isAutoSchedule || proxy.model.validateManualTasksOnLinking))
                    proxy._isValidationEnabled = true;
                else
                    proxy._isValidationEnabled = false;
                proxy._isPredecessorEdited = true;
                proxy._validatePredecessor(args.toItem);
                proxy._isPredecessorEdited = false;
                if (proxy._updatedConnectorLineCollection.length > 0) {
                    proxy._$ganttchartHelper.ejGanttChart("appendConnectorLine", proxy._updatedConnectorLineCollection);
                    this._updateConnectorLineCollection(proxy._updatedConnectorLineCollection);
                }
                //Update predecessor cell value in treegrid while drawing a new connector line to/from manual task.
                if (!args.toItem.isAutoSchedule && !proxy.model.validateManualTasksOnLinking) {
                    var treegridObject = proxy._$treegridHelper.ejTreeGrid("instance");
                    ej.TreeGrid.refreshRow(treegridObject, proxy.model.currentViewData.indexOf(args.toItem));
                }
                /*update schedule dates on predecessor editing */
                var checkArgs = {};
                checkArgs.data = args.toItem;
                proxy._updateScheduleDatesOnEditing(checkArgs);
                if (this.isCriticalPathEnable == true) {
                    proxy._$ganttchartHelper.ejGanttChart("criticalConnectorLine", this.criticalPathCollection, this.detailPredecessorCollection, false, this.collectionTaskId);
                    this.showCriticalPath(true);
                }
        }
            proxy._ganttActionCompleteTrigger(args);
        },

        //Public method for hidding column using header text
        // argument headerText is header text of the column

        
        hideColumn:function(headerText)
        {
            var proxy = this;
            proxy._$treegridHelper.ejTreeGrid("hideColumn",headerText);
        },

		//Public method for showing column using header text
        // argument headerText is header text of the column

        
        showColumn: function (headerText) {
            var proxy = this;
            proxy._$treegridHelper.ejTreeGrid("showColumn", headerText);
        },
		 // public method for accessing tree grid clearColumnMenu method
        clearColumnMenu:function()
        {
            var proxy = this;
            proxy._$treegridHelper.ejTreeGrid("clearColumnMenu");
        },
        // public method for deleting row
        deleteRow: function () {
            var proxy = this;
            proxy._$treegridHelper.ejTreeGrid("deleteRow");
        },
        taskbarEditing: function (args) {
            
            this._trigger("taskbarEditing", args);
        },
        // public method for accessing _setInitialData Private method.
        setInitialData: function () {
            this._setInitialData();
        },

        sortColumn: function (columnName, columnSortDirection) {
            var proxy = this;
            proxy._$treegridHelper.ejTreeGrid("sortColumn", columnName, columnSortDirection);
        },

        clearSorting: function()
        {
            var proxy = this,
                model = proxy.model;
            proxy._$treegridHelper.ejTreeGrid("clearSorting");
        },

        "export": function (action, serverEvent, multipleExport) {
            var proxy = this, model = proxy.model;

            proxy._$treegridHelper.ejTreeGrid("contextMenuOperations", "Cancel");
            
            var attr = { action: action, method: 'post', "data-ajax": "false" };
            $('form#' + proxy._id + 'export').remove();
            var form = ej.buildTag('form#' + proxy._id + 'export', "", null, attr);

            if (ej.raiseWebFormsServerEvents) {
                var modelClone = proxy._getExportModel(model);
                var locale = { "durationText": proxy._durationUnitTexts, "durationEditText": proxy._durationUnitEditText, "taskTypeTexts": proxy._taskTypeTexts, "effortDrivenTexts": proxy._effortDrivenTexts, "taskModeTexts": proxy._taskModeTexts, "nullText": proxy._nullText };
                var args = { model: modelClone, originalEventType: serverEvent };
                var clientArgs = { model: JSON.stringify(modelClone), locale: JSON.stringify(locale) };
                ej.raiseWebFormsServerEvents(serverEvent, args, clientArgs);
            }
            else {
                var ganttObjectArray = {};
                if (multipleExport) {
                    $('body').find('.e-gantt').each(function (index, object) {
                        var ganttObject = $(object).data('ejGantt');
                        if (!ej.isNullOrUndefined(ganttObject)) {
                            var gridModel = ganttObject.model,
                                cloneModel = proxy._getExportModel(gridModel);
                            ganttObjectArray[index] = JSON.stringify(cloneModel);
                            var inputAttr = { name: 'GanttModel', type: 'hidden', value: JSON.stringify(cloneModel) };
                            var input = ej.buildTag('input', "", null, inputAttr);
                            form.append(input);
                        }
                    });
                }
                else {
                    var modelClone = proxy._getExportModel(model);
                    var inputAttr = { name: 'GanttModel', type: 'hidden', value: JSON.stringify(modelClone) };
                    var input = ej.buildTag('input', "", null, inputAttr);
                    form.append(input);
                    form.append(this);
                }
                var locale = { "durationText": proxy._durationUnitTexts, "durationEditText": proxy._durationUnitEditText, "taskTypeTexts": proxy._taskTypeTexts, "effortDrivenTexts": proxy._effortDrivenTexts, "taskModeTexts": proxy._taskModeTexts, "nullText": proxy._nullText };
                var localeAttr = { name: 'locale', type: 'hidden', value: JSON.stringify(locale) };
                var localeInput = ej.buildTag('input', "", null, localeAttr);
                form.append(localeInput);
                $('body').append(form);
                form.submit();
            }
            return true;
        },

        _getExportModel: function (ganttModel) {
            var proxy = this, model = ganttModel,
                updatedRecords = model.updatedRecords,
                currentViewData = model.currentViewData,
                flatRecords = model.flatRecords,
                parentRecords = model.parentRecords,
                selectedItem = model.selectedItem,
                selectedItems = model.selectedItems,
                workUnit = model.workUnit;

            model.criticalTask = proxy.criticalPathCollection.join();

            // Delete the below internal items in model for avoid the circular reference while extend the model
            delete model.updatedRecords;
            delete model.currentViewData;
            delete model.flatRecords;
            delete model.parentRecords;
            delete model.selectedItem;
            delete model.selectedItems;
            delete model.workUnit;

            var modelClone = JSON.parse(JSON.stringify(model));
            model.updatedRecords = updatedRecords;
            model.currentViewData = currentViewData;
            model.flatRecords = flatRecords;
            model.parentRecords = parentRecords;
            model.selectedItem = selectedItem;
            model.selectedItems = selectedItems;
            model.workUnit = workUnit;
            var columns = modelClone.columns,
                columnLength = columns.length;
            for (var i = 0; i < columnLength; i++) {
                if (modelClone.columns[i].editType != undefined) {
                    switch (columns[i].editType) {
                        case "stringedit":
                            columns[i].editType = "string";
                            break;
                        case "numericedit":
                            columns[i].editType = "numeric";
                            break;
                        case "dropdownedit":
                            columns[i].editType = "dropdown";
                            break;
                        case "booleanedit":
                            columns[i].editType = "boolean";
                            break;
                        default:
                            break;
                    }
                }
            }

            var filteredcolumns = modelClone.filterSettings.filteredColumns,
                 fcolumnLength = filteredcolumns.length;
            if (fcolumnLength > 0) {
                for (var i = 0; i < fcolumnLength; i++) {
                    var mappingName = filteredcolumns[i].field,
                        column = ej.TreeGrid.getColumnByField(proxy._columns, mappingName); //this.getColumnByField(mappingName);
                    if (column != null) {
                        if (mappingName != "resourceNames" && mappingName != "predecessorsName")
                            mappingName = column.mappingName;
                        else
                            mappingName = mappingName;
                    }
                    model.filterSettings.filteredColumns[i].field = mappingName;
                }
            }
            var ignoreOnExport = proxy.ignoreOnExport,
                igonreLength = ignoreOnExport.length;

            if (this.ignoreOnExport) {
                for (var i = 0; i < igonreLength; i++) {
                    delete modelClone[ignoreOnExport[i]];
                }
            }
            return modelClone;
        },

        _refreshParent: function (item) {
            this.refreshGanttRecord(item);
            if (item.parentItem) {
                this._refreshParent(item.parentItem);
            }
        },
        //Get standard time zone of current locale
        _getDefaultTZOffset: function () {
            var janMonth = new Date(new Date().getFullYear(), 0, 1);
            var julMonth = new Date(new Date().getFullYear(), 6, 1);//Because there is no reagions DST inbetwwen this range
            return Math.max(janMonth.getTimezoneOffset(), julMonth.getTimezoneOffset());
        },
        _isInDst: function (date) {
            return date.getTimezoneOffset() < this._getDefaultTZOffset();
        },
        /*Get date value using schedule start date and left value*/
        _getDateByLeft: function (left) {
            var proxy = this, inMinutes, pStartDate = new Date(this._projectStartDate),
                milliSecondsPerPixel = (24 * 60 * 60 * 1000) / this._perDayWidth;
            pStartDate.setTime(pStartDate.getTime() + (left * milliSecondsPerPixel));
            if (this.model.scheduleHeaderSettings.scheduleHeaderType == ej.Gantt.ScheduleHeaderType.Week
                || this.model.scheduleHeaderSettings.scheduleHeaderType == ej.Gantt.ScheduleHeaderType.Month
                || this.model.scheduleHeaderSettings.scheduleHeaderType == ej.Gantt.ScheduleHeaderType.Year) {
                if (this._isInDst(this._projectStartDate) && !this._isInDst(pStartDate))
                    pStartDate.setTime(pStartDate.getTime() + (60 * 60 * 1000));
                else if (!this._isInDst(this._projectStartDate) && this._isInDst(pStartDate))
                    pStartDate.setTime(pStartDate.getTime() - (60 * 60 * 1000));
            }
            return pStartDate;
        },

        _getRoundOffStartLeft: function (ganttRecord, isRoundOff) {
            var proxy = this, model = proxy.model, left = ganttRecord.left,
               headerType = model.scheduleHeaderSettings.scheduleHeaderType,
               headerValue = ej.Gantt.ScheduleHeaderType,
               remainDays = ganttRecord.left % proxy._perDayWidth,
               remainDaysInDecimal = remainDays / proxy._perDayWidth;
            if (isRoundOff == undefined)
                isRoundOff = false;

            /*Rounding the decimal value for week-month-year schedule mode*/
            if (!isRoundOff) {
                if ((headerType == headerValue.Week || headerType == headerValue.Month || headerType == headerValue.Year)) {
                    if (remainDaysInDecimal <= 0.5) {
                        left = ganttRecord.left - remainDays;
                    }
                    else if (remainDaysInDecimal > 0.5) {
                        left = (ganttRecord.left - remainDays) + proxy._perDayWidth / 2;
                    }
                }
            }
            else if (isRoundOff) {
                if (headerType == headerValue.Week || headerType == headerValue.Month || headerType == headerValue.Year) {
                    left = ganttRecord.left - remainDays;
                }
                else if (headerType == headerValue.Day) {
                    remainDays = ganttRecord.left % (proxy._perHourWidth);
                    remainDaysInDecimal = remainDays / (proxy._perHourWidth);
                    left = ganttRecord.left - remainDays;

                }
                else if (headerType == headerValue.Hour) {
                    remainDays = ganttRecord.left % (proxy._perMinuteWidth);
                    remainDaysInDecimal = remainDays / (proxy._perMinuteWidth);
                    left = ganttRecord.left - remainDays;

                }
            }
            return left;
        },
        _getRoundOffEndLeft: function (ganttRecord, isRoundOff) {
            var proxy = this, model = proxy.model,
                headerType = model.scheduleHeaderSettings.scheduleHeaderType,
                headerValue = ej.Gantt.ScheduleHeaderType,
                totalLeft = ganttRecord.width + ganttRecord.left,
                remainingLeft = totalLeft % model.perDayWidth,
                positionValue = remainingLeft / model.perDayWidth;

            if (isRoundOff == undefined)
                isRoundOff = false;

            /*Rounding the decimal value for week-month-year schedule mode*/
            if (!isRoundOff) {
                if ((headerType == headerValue.Week || headerType == headerValue.Month || headerType == headerValue.Year)) {
                    if (positionValue == 0) {
                        totalLeft = totalLeft;
                    }
                    else if (positionValue > 0.5) {
                        totalLeft = totalLeft - remainingLeft + model.perDayWidth;
                    }
                    else if (positionValue < 0.5) {
                        totalLeft = (totalLeft - remainingLeft) + (model.perDayWidth / 2);
                    }
                }
            }
            else if (isRoundOff) {
                if (headerType == headerValue.Week || headerType == headerValue.Month || headerType == headerValue.Year) {
                    if (remainingLeft != 0)
                        totalLeft = (totalLeft - remainingLeft) + model.perDayWidth;
                }
                if (headerType == headerValue.Day) {
                    remainingLeft = totalLeft % (model.perHourWidth),
                    positionValue = remainingLeft / (model.perHourWidth);
                    if (remainingLeft != 0)
                        totalLeft = (totalLeft - remainingLeft) + (model.perHourWidth);

                }
                if (headerType == headerValue.Hour) {
                    remainingLeft = totalLeft % (model.perMinuteWidth),
                    positionValue = remainingLeft / (model.perMinuteWidth);
                    if (remainingLeft != 0)
                        totalLeft = (totalLeft - remainingLeft) + (model.perMinuteWidth);

                }
            }
            return totalLeft;
        },

        taskbarEdited: function (args) {
            var proxy = this,
                ganttRecord = args.data, model = proxy.model,
                projectStartDate = new Date(proxy._projectStartDate),
                remainDays, remainDaysInDecimal,
                day, perDayHourUnit, left,
                headerType = model.scheduleHeaderSettings.scheduleHeaderType,
                headerValue = ej.Gantt.ScheduleHeaderType,
                durationUnitValue = ej.Gantt.DurationUnit,
                prevOverlapIndex,
                offset = 0,
                previousResource,
                sharedTask = false,
                isPrevParentOverlapChanged = false,
                dataSource = proxy.dataSource();
            
            proxy._isValidationEnabled = false;
            
            if (args.dragging) {
                var editMode = "dragging";
                if (args.previousData.left !== ganttRecord.left) {
                    left = proxy._getRoundOffStartLeft(ganttRecord, args.roundOffDuration);
                    projectStartDate = proxy._getDateByLeft(left);

                    if (!ej.isNullOrUndefined(ganttRecord.endDate) && ej.isNullOrUndefined(ganttRecord.startDate)) {
                        var endDate = proxy._checkStartDate(projectStartDate, ganttRecord, null);
                        ganttRecord.endDate = proxy._checkEndDate(endDate, ganttRecord);
                        if (model.endDateMapping)
                            ganttRecord.item[model.endDateMapping] = ganttRecord.endDate;
                    }
                    else {
                        ganttRecord.startDate = proxy._checkStartDate(projectStartDate, ganttRecord);
                        if (!ej.isNullOrUndefined(ganttRecord.duration)) {
                            ganttRecord._calculateEndDate(proxy);
                        }
                        if (model.startDateMapping)
                            ganttRecord.item[model.startDateMapping] = ganttRecord.startDate;
                    }
                    ganttRecord.left = ganttRecord._calculateLeft(this);
                    ganttRecord.width = ganttRecord._calculateWidth(this);
                    if (!ganttRecord.hasChildRecords)
                        ganttRecord.progressWidth = ganttRecord._getProgressWidth(ganttRecord.width, ganttRecord.status);
                    proxy._isValidationEnabled = true;
                }

                if (proxy.model.viewType == "resourceView" && this.model.allowDragAndDrop) {// &&
                  //(Math.abs(args.previousData.top - ganttRecord.top) >= this.model.rowHeight)) {
                    //To check the resource of the dropped row
                    var rowOffsetTop,
                        flatRecordCol, tIndex,
                        resHeight,
                        prevParent, childTasks,
                        deleteIndex = -1, previousTaskType;
                        previousResource = $.extend(true,[], ganttRecord.resourceInfo);


                    rowOffsetTop = ganttRecord.top;
                    flatRecordCol = this.model.currentViewData;
                    tIndex = flatRecordCol.indexOf(ganttRecord);
                    previousTaskType = ganttRecord.eResourceTaskType;
                    deleteIndex = this.model.updatedRecords.indexOf(ganttRecord);

                    for (var i = 0; i < flatRecordCol.length; i++) {
                        resHeight = (flatRecordCol[i].eOverlapIndex * this.model.rowHeight);

                        // To ignore the records which are in collapsed state
                        if (!proxy.getExpandStatus(flatRecordCol[i]))
                            continue;

                        if (rowOffsetTop > resHeight)
                            rowOffsetTop -= resHeight;
                        else {
                            sharedTask = proxy._checkSharedTasks(ganttRecord, flatRecordCol[i]);
                            /*We need to delete the record before update into current resource collection*/
                            if (flatRecordCol[i].eResourceTaskType != "groupTask" && flatRecordCol[i].eResourceTaskType != "unassignedTask"
                          && ganttRecord.eResourceTaskType == "unassignedTask" && i != flatRecordCol.indexOf(ganttRecord)) {
                                if (deleteIndex != -1) {
                                    proxy._isTriggerActionComplete = false;
                                    proxy._$treegridHelper.ejTreeGrid("deleteRow", null, true, deleteIndex);
                                }
                            }
                            if (flatRecordCol[i].eResourceTaskType == "resourceTask") {
                                args.assignedResource = flatRecordCol[i].item;
                                if (ganttRecord.eResourceTaskType == "unassignedTask" || (ganttRecord.parentItem && ganttRecord.parentItem.taskId != flatRecordCol[i].taskId)) {
                                    if (ganttRecord.parentItem) {
                                        prevParent = ganttRecord.parentItem;
                                        var prevParentIndex = flatRecordCol.indexOf(prevParent);
                                        childTasks = flatRecordCol[prevParentIndex].eResourceChildTasks;

                                        var childIndex = childTasks.indexOf(ganttRecord);
                                        childTasks.splice(childIndex, 1);
                                        var prevResourceId = prevParent.taskId;
                                        if (!proxy._isFlatResourceData)
                                            flatRecordCol[prevParentIndex].item[model.taskCollectionMapping] && flatRecordCol[prevParentIndex].item[model.taskCollectionMapping].splice(flatRecordCol[prevParentIndex].item[model.taskCollectionMapping].indexOf(ganttRecord.item), 1);
                                    }

                                    if (!sharedTask) {
                                        flatRecordCol[i].eResourceChildTasks.push(ganttRecord);
                                        ganttRecord.parentItem = flatRecordCol[i];
                                        /*Need to add removed unsassinged in all collections*/
                                        if (ganttRecord.eResourceTaskType == "unassignedTask") {
                                            this._resourceChildTasks.push(ganttRecord);
                                            this._resourceUniqTaskIds.push(ganttRecord.taskId.toString());
                                            this._resourceUniqTasks.push(ganttRecord);
                                            this._insertDataInDataSource(ganttRecord.item);
                                        }
                                        ganttRecord.eResourceTaskType = "resourceChildTask";
                                        proxy._updateResourceParentItem(ganttRecord);
                                        proxy._updateResourceResourceDetails(ganttRecord, prevResourceId);
                                        if (!proxy._isFlatResourceData){
                                            if (!flatRecordCol[i].item[model.taskCollectionMapping])
                                                flatRecordCol[i].item[model.taskCollectionMapping] = [];
                                            flatRecordCol[i].item[model.taskCollectionMapping].push(ganttRecord.item);
                                        }
                                    } else {
                                        this._removeResourceInfo(sharedTask, prevResourceId);
                                    }
                                }
                            }

                            if (!ej.isNullOrUndefined(prevParent)) {
                                if (prevParent.isAutoSchedule && prevParent.eResourceTaskType != "resourceTask")
                                    proxy._updateParentItem(ganttRecord);

                                else if (!prevParent.isAutoSchedule && prevParent.eResourceTaskType != "resourceTask")
                                    proxy._updateManualParentItem(ganttRecord);

                                else if (prevParent.eResourceTaskType == "resourceTask") {
                                    var prevParentOverlapIndex = prevParent.eOverlapIndex;
                                    /*Method to update the overallping values of edited resource tasks*/
                                    this._updateOverlappingValues(prevParent);
                                    this.refreshGanttRecord(prevParent);
                                    if (!ej.isNullOrUndefined(prevParent.parentItem)) {

                                        proxy._updateResourceParentItem(prevParent.parentItem);
                                    }
                                    isPrevParentOverlapChanged = prevParentOverlapIndex != prevParent.eOverlapIndex;
                                }
                            }
                            this._updateResourceName(ganttRecord);
                            this._updateResourceRelatedFields(ganttRecord);
                            break;
                        }

                    }

                }
                if (args.previousData.left !== ganttRecord.left) {
                    if (model.viewType == "resourceView" && ganttRecord.eResourceTaskType == "resourceChildTask") {
                        this._updateSharedResourceTask(ganttRecord);
                    }
                }
            } else if (args.rightResizing) {
                var editMode = "Resizing";
                if (args.previousData.width !== ganttRecord.width) {
                    left = proxy._getRoundOffEndLeft(ganttRecord, args.roundOffDuration);

                    /*Calculating the remaining day decimal values in to hours and then minutes*/
                    var tempEndDate = proxy._getDateByLeft(left);
                    ganttRecord.endDate = proxy._checkEndDate(tempEndDate, ganttRecord);

                    if (model.endDateMapping)
                        ganttRecord.item[model.endDateMapping] = ganttRecord.endDate;
                    ganttRecord._calculateDuration(this);
                    ganttRecord.width = ganttRecord._calculateWidth(this);

                    if (!ganttRecord.hasChildRecords)
                        ganttRecord.progressWidth = ganttRecord._getProgressWidth(ganttRecord.width, ganttRecord.status);
                    proxy._updatedColumn = "duration";
                    proxy._updateResourceRelatedFields(ganttRecord);
                    if (model.viewType == "resourceView" && ganttRecord.eResourceTaskType == "resourceChildTask") {
                        this._updateSharedResourceTask(ganttRecord);
                    }
                }

            } else if (args.leftResizing) {
                var editMode = "Resizing";
                if (args.previousData.left !== ganttRecord.left) {
                    left = proxy._getRoundOffStartLeft(ganttRecord, args.roundOffDuration);
                    projectStartDate = proxy._getDateByLeft(left);
                    ganttRecord.startDate = proxy._checkStartDate(projectStartDate, ganttRecord);
                    if (model.startDateMapping)
                        ganttRecord.item[model.startDateMapping] = ganttRecord.startDate;
                    ganttRecord.endDate = proxy._checkEndDate(ganttRecord.endDate, ganttRecord);
                    if (ganttRecord.isAutoSchedule && model.includeWeekend == false && (headerType == headerValue.Hour || headerType == headerValue.Day))
                        ganttRecord._calculateEndDate(this);
                    ganttRecord._calculateDuration(this);
                    ganttRecord.left = ganttRecord._calculateLeft(this);
                    ganttRecord.width = ganttRecord._calculateWidth(this);
                    if (!ganttRecord.hasChildRecords)
                        ganttRecord.progressWidth = ganttRecord._getProgressWidth(ganttRecord.width, ganttRecord.status);
                    proxy._updatedColumn = "duration";
                    proxy._updateResourceRelatedFields(ganttRecord);
                    if (model.viewType == "resourceView" && ganttRecord.eResourceTaskType == "resourceChildTask") {
                        this._updateSharedResourceTask(ganttRecord);
                    }
                }
            }

            if (args.progressResizing) {
                if (args.previousData.status != args.data.status) {
                    ganttRecord.status = ganttRecord._getProgressPercent(ganttRecord.width, ganttRecord.progressWidth);
                    if (ganttRecord.parentItem) {
                        ganttRecord._updateParentProgress(ganttRecord.parentItem, model.progressMapping);
                    }
                    proxy._refreshParent(ganttRecord);
                }                
            }
            else {
                proxy._isValidationEnabled = true;
                proxy._isOverlapIndexChanged = false;
                proxy._updateEditedGanttRecord(ganttRecord);
                if (ganttRecord.predecessor) {
                    proxy._isMileStoneEdited = ganttRecord.isMilestone;
                    proxy._updatedConnectorLineCollection = [];
                    proxy._connectorlineIds = [];
                    proxy._editedTaskBarItem = ganttRecord;
                    if (model.enablePredecessorValidation)
                        proxy._validatePredecessor(ganttRecord);
                    else
                        proxy._validatePredecessorOnEditing(ganttRecord);

                    if (model.viewType != "resourceView" && proxy._updatedConnectorLineCollection.length > 0) {
                        proxy._$ganttchartHelper.ejGanttChart("appendConnectorLine", proxy._updatedConnectorLineCollection);
                        this._updateConnectorLineCollection(proxy._updatedConnectorLineCollection);
                    }
                }
                proxy._editedTaskBarItem = null;

                if (!ganttRecord.isAutoSchedule) {
                    if (ganttRecord.hasChildRecords && !args.isChildren && !args.rightResizing) {
                        proxy._validateAutoChildRecords(args);
                    }
                }
                if (ganttRecord.parentItem && ganttRecord.parentItem.isAutoSchedule &&
                    ganttRecord.parentItem.eResourceTaskType != "resourceTask")
                    proxy._updateParentItem(ganttRecord, editMode);
                else if (ganttRecord.parentItem && !ganttRecord.parentItem.isAutoSchedule &&
                    ganttRecord.parentItem.eResourceTaskType != "resourceTask")
                    proxy._updateManualParentItem(ganttRecord, editMode);
                else if (ganttRecord.parentItem && ganttRecord.parentItem.eResourceTaskType == "resourceTask") {
                    prevOverlapIndex = ganttRecord.parentItem.eOverlapIndex;
                    /*Method to update the overallping values of edited resource tasks*/
                    this._updateOverlappingValues(ganttRecord.parentItem);
                    this._updateResourceParentItem(ganttRecord);
                }
            }

            if(args.isFromAutoChildUpdate)
                proxy._isLastRefresh = false;
            else
                proxy._isLastRefresh = true;

            if (ganttRecord.eResourceTaskType == "resourceChildTask")
                proxy.refreshGanttRecord(ganttRecord.parentItem, ganttRecord);
            else
                proxy.refreshGanttRecord(ganttRecord);

            /*Prevent this event on updating auto tasks on manual parent dragging*/
            if (!args.isFromAutoChildUpdate)
                proxy._trigger("taskbarEdited", args);

            if (model.viewType == "resourceView" && args.dragging && args.cancel && (!args.previousResource || args.assignedResource && args.assignedResource[model.resourceIdMapping] != args.previousResource[model.resourceIdMapping])) {
                var prevResource = [], currentResource = [];
               args.previousResource && prevResource.push(args.previousResource);                      
               !sharedTask && currentResource.push(args.assignedResource);
                proxy._updateResource(currentResource, prevResource, ganttRecord, args);
            }
            /*If event not canceld for resource task edit action need to check same task will be shared with other resources*/
            if (!args.cancel && ganttRecord.eResourceTaskType == "resourceChildTask") {
                this._updateSharedResourceTask(ganttRecord);
            }

            if (!args.cancel && (args.leftResizing || args.rightResizing || args.dragging) && proxy._isValidationEnabled) {
                proxy._updateScheduleDatesOnEditing(args);
            }
            if (this.isCriticalPathEnable == true) {
                proxy._$ganttchartHelper.ejGanttChart("criticalConnectorLine", this.criticalPathCollection, this.detailPredecessorCollection, false, this.collectionTaskId);
                this.showCriticalPath(true);
            }
            if (!args.cancel && (this._isOverlapIndexChanged || isPrevParentOverlapChanged || (ganttRecord.eResourceTaskType == "resourceChildTask" && prevOverlapIndex != ganttRecord.parentItem.eOverlapIndex))) {
                //need to update record height when overlap index value updated on taskbar edit action
                this._refreshGanttHeightWithRecords();
            }
            this._isOverlapIndexChanged = false;
        },

        /*update the record for the same task which are shared with other tasks*/
        _updateSharedResourceTask: function (record, values, prevResourceInfo) {
            var model = this.model,
                resourceInfo = prevResourceInfo ? prevResourceInfo : record.resourceInfo;
            if (resourceInfo && resourceInfo.length > 0) {
                var sameIdTasks = this._getExistingTaskWithID(record, true), 
                    currentTask, prevIndex,
                    customColumns = this._getGanttColumnDetails().customColDetails, customColumnsLength = customColumns.length;
                if (sameIdTasks == null)
                    return;
                for (var i = 0; i < sameIdTasks.length; i++) {
                    currentTask = sameIdTasks[i];
                    if (currentTask.parentItem.taskId != record.parentItem.taskId && ej.isNullOrUndefined(values)) {
                        currentTask.startDate = new Date(record.startDate);
                        currentTask.endDate = new Date(record.endDate);
                        currentTask.duration = record.duration;
                        currentTask.left = record.left;
                        currentTask.width = record.width;
                        currentTask.status = record.status;
                        currentTask.work = record.work;
                        currentTask.effortDriven = record.effortDriven;
                        currentTask.taskType = record.taskType;
                        currentTask.progressWidth = record.progressWidth;
                        currentTask.taskName = record.taskName;
                        currentTask.eResourceName = record.eResourceName;
                        currentTask.baselineLeft = record.baselineLeft;
                        currentTask.baselineRight = record.baselineRight;
                        currentTask.baselineWidth = record.baselineWidth;
                        currentTask.predecessor = record.predecessor;
                        if (customColumnsLength) {
                            for (var count = 0; count < customColumnsLength; count++)
                                currentTask[customColumns[count].field] = record[customColumns[count].field];
                        }
                        prevIndex = currentTask.parentItem.eOverlapIndex;
                        this._updateOverlappingValues(currentTask.parentItem);
                        if (prevIndex != currentTask.parentItem.eOverlapIndex && !this._isOverlapIndexChanged)
                            this._isOverlapIndexChanged = true;
                        this._updateResourceParentItem(currentTask);
                        this.refreshGanttRecord(currentTask.parentItem);
                    } else if (currentTask.parentItem.taskId != record.parentItem.taskId && !ej.isNullOrUndefined(values)) {
                        var extObj = {};
                        $.extend(true, extObj, values);
                        for (var key in extObj)
                            currentTask[key] = values[key];
                        
                    }
                }
            }
        },

        /*Refresh Gantt record container's height*/
        _refreshGanttHeightWithRecords: function () {
            var height = this._$treegridHelper.ejTreeGrid("getRecordsHeight");
            this._$treegridHelper.ejTreeGrid("updateHeight");
            this._$ganttchartHelper.ejGanttChart("updateHeight", height);
        },

        /*Get child records which are updated on manual taskbar editing*/
        _getUpdatableChildRecords: function (parentRecord, childLists) {
            var childRecords = parentRecord.childRecords;
            for (var i = 0; i < childRecords.length; i++) {
                if (childRecords[i].isAutoSchedule && !childRecords[i].predecessorsName) {
                    if (!childRecords[i].hasChildRecords)
                        childLists.push(childRecords[i]);
                    else
                        this._getUpdatableChildRecords(childRecords[i], childLists);
                }
            }
        },

        /*Validate auto child records on dragging the manual taskbars*/
        _validateAutoChildRecords: function (args) {
            var proxy = this,
                item = args.data,
                childItem = [],
                prevStartDate = new Date(args.previousData.startDate),
                currentStartDate = new Date(item.startDate),
                arg = {},
                isRightMove = true,
                validStartDate, validEndDate, calcEndDate,
                durationDiff = 0;
            this._getUpdatableChildRecords(item, childItem);
            if (childItem.length == 0)
                return;
            if (prevStartDate.getTime() > currentStartDate.getTime()) {
                validStartDate = this._checkStartDate(currentStartDate);
                validEndDate = this._checkEndDate(prevStartDate);
                isRightMove = false;
            }
            else {
                validStartDate = this._checkStartDate(prevStartDate);
                validEndDate = this._checkEndDate(currentStartDate);
                isRightMove = true;
            }
            //Get Duration
            if (validStartDate.getTime() >= validEndDate.getTime())
                durationDiff = 0;
            else
                durationDiff = this._getDuration(validStartDate, validEndDate, "minute", true);

            for (var i = 0; i < childItem.length; i++) {
                if (childItem[i].isAutoSchedule && !childItem[i].hasChildRecords && durationDiff > 0) {
                    arg.previousData = $.extend({}, childItem[i]);
                    if (isRightMove) {
                        calcEndDate = this._getEndDate(new Date(childItem[i].startDate), durationDiff, "minute");
                        childItem[i].left = this._getTaskLeft(this._checkStartDate(new Date(calcEndDate)));
                    } else {
                        calcEndDate = this._getStartDate(this._checkEndDate(new Date(childItem[i].startDate)), durationDiff, "minute");
                        childItem[i].left = this._getTaskLeft(calcEndDate);
                    }
                    arg.data = childItem[i];
                    arg.dragging = true;
                    arg.isChildren = true;
                    arg.isFromAutoChildUpdate = true;
                    proxy.taskbarEdited(arg);
                }
            }
        },

        actionBegin: function (args) {

            var proxy = this,
                model = this.model;
            if (model.viewType == "resourceView" && args.requestType == "delete") {
                var extendedArgs = $.extend({}, args);
                if (args.data && args.data.eResourceTaskType == "groupTask")
                    extendedArgs.requestType = "groupDelete";
                else if (args.data && args.data.eResourceTaskType == "resourceTask")
                    extendedArgs.requestType = "resourceDelete";
                proxy._trigger("actionBegin", extendedArgs);
                args.cancel = extendedArgs.cancel;
            } else {
                proxy._trigger("actionBegin", args);
            }

            if (!args.cancel) {

                if (args.requestType === "beginedit") {
                    proxy._sendEditRequest(null,args);
                }   
                if (args.requestType == "validateLinkedTask") {
                    if (proxy.model.enablePredecessorValidation && (args.data.isAutoSchedule || proxy.model.validateManualTasksOnLinking) && proxy.model.predecessorMapping)
                        return args.cancel = proxy._validateTypes(args);
                    else
                        return args.cancel=true;
                }
            }

        },

        _ganttActionCompleteTrigger: function (args) {
            var proxy = this,
                model = proxy.model;
            if (args.requestType === "save" || args.requestType === "drawConnectorLine" || args.requestType === "delete" || args.requestType === "dragAndDrop")
            {
                if (args.requestType === "dragAndDrop") {
                    var index = $.map(proxy._actionCompleteData, function (data, index) {
                        if (data.taskId == args.draggedRow["taskId"]) {
                            return index;
                        }
                    });
                    index.length && proxy._actionCompleteData.splice(index[0], 1);
                    index = null;
                    index = $.map(proxy._actionCompleteData, function (data, index) {
                        if (data.taskId == args.targetRow["taskId"]) {
                            return index;
                        }
                    });
                    index.length && proxy._actionCompleteData.splice(index[0], 1);
                }
                else if (args.requestType == "save") {
                    var saveRecord;
                    if (args.addedRecord)
                        saveRecord = args.addedRecord;
                    else
                        saveRecord = args.modifiedRecord;
                    var index = $.map(proxy._actionCompleteData, function (data, index) {
                        if (data.taskId == saveRecord.item[model.taskIdMapping]) {
                            return index;
                        }
                    });
                    index.length && proxy._actionCompleteData.splice(index[0], 1);
                }
                else if (!args.requestType === "drawConnectorLine") {
                    var index = $.map(proxy._actionCompleteData, function (data, index) {
                        if (data.taskId == args.data[model.taskIdMapping]) {
                            return index;
                        }
                    });
                    index.length && proxy._actionCompleteData.splice(index[0], 1);
                }
                else if (args.requestType === "drawConnectorLine") {
                    var index = $.map(proxy._actionCompleteData, function (data, index) {
                        if (data.taskId == args.fromItem.taskId) {
                            return index;
                        }
                    });
                    index.length && proxy._actionCompleteData.splice(index[0], 1);
                    index = $.map(proxy._actionCompleteData, function (data, index) {
                        if (data.taskId == args.toItem.taskId) {
                            return index;
                        }
                    });
                    index.length && proxy._actionCompleteData.splice(index[0], 1);
                }
                if(proxy._actionCompleteData.length){
                    args.updatedRecords = proxy._actionCompleteData;
                    proxy._actionCompleteData = [];
                }
            }            
            proxy._trigger("actionComplete", args);
            if (!args.cancel && args.requestType === 'save') {
                if (args._cModifiedData) {
                    args.data = args._cModifiedData;
                    proxy._updateLastInsertedId(args.data.taskId);
                }
                if (args._cAddedRecord) {
                    args.data = args._cAddedRecord;
                    proxy._updateLastInsertedId(args.data.taskId, true);
                }                
                proxy._updateScheduleDatesOnEditing(args);
            }
        },

        _queryCellInfo: function (args) {
            this._trigger("queryCellInfo", args);
        },

        _beginEdit: function (args) {
            var proxy = this,
                toolbar = $("#" + proxy._id + "_toolbarItems");
            if (!proxy._trigger("beginEdit", args)) {
                proxy._isinBeginEdit = true;
                if (proxy.model.toolbarSettings.showToolbar) {

                    var toolBarEnabledItems = [];

                    var cancelElement = $(toolbar).find(".e-cancel").parent()[0];
                    var saeveElement = $(toolbar).find(".e-saveitem").parent()[0];

                    if (cancelElement) {
                        toolBarEnabledItems.push(cancelElement);
                    }

                    if (saeveElement) {
                        toolBarEnabledItems.push(saeveElement);
                    }

                    $(toolbar).ejToolbar('enableItem', toolBarEnabledItems);
                    var disableToolItems = [];
                    if (proxy.model.editSettings.allowAdding && proxy.model.toolbarSettings.toolbarItems.indexOf("add") !== -1)
                        disableToolItems.push($(toolbar).find(".e-addnewitem").parent()[0]);
                    if (proxy.model.editSettings.allowEditing && proxy.model.toolbarSettings.toolbarItems.indexOf("edit") !== -1)
                        disableToolItems.push($(toolbar).find(".e-edititem").parent()[0]);
                    if (proxy.model.editSettings.allowDeleting && proxy.model.toolbarSettings.toolbarItems.indexOf("delete") !== -1)
                        disableToolItems.push($(toolbar).find(".e-deleteitem").parent()[0]);
                    $(toolbar).ejToolbar('disableItem', disableToolItems);
                }
            }
        },
        _triggerEndEdit: function (args) {
            var proxy = this, model = this.model;
            var toolbar = $("#" + proxy._id + "_toolbarItems");

            if (proxy._trigger("endEdit", args)) {
                var predecessorString = "";
                args.data[args.columnName] = args.previousValue;
                if (args.columnName === "predecessor") {
                    predecessorString = proxy._predecessorToString(args.data.predecessor, args.data);
                    args.data.item[args.columnObject.mappingName] = predecessorString;
                    args.data.predecessorsName = predecessorString;
                } else {
                    args.data.item[args.columnObject.mappingName] = args.previousValue;
                    if (args.columnName === "resourceInfo") {
                        proxy._updateResourceName(args.data);
                        proxy._updateResourceRelatedFields(args.data);
                    }
                }
            }
            else {
                proxy._updatedColumn = args.columnName;
                //Effort driven is always true for fixedWork type of calculation.
                if (args.columnName == "taskType" && args.value == "fixedWork")
                    args.data.effortDriven = "true";
                if (args.columnName === "duration" || args.columnName == "work")
                    proxy._updateResourceRelatedFields(args.data);

                if (args.columnName === "resourceInfo") {
                    proxy._updateResourceName(args.data);
                    proxy._updateResourceRelatedFields(args.data);
                    //update parent item while child works got updated, if duration is updated the
                    //corresponding parent will update automatically.
                    if (proxy._isDurationUpdated == false) {
                        var data = args.data,
                            isParent = args.data.hasChildRecords ? true : false;
                        if (isParent && data.isAutoSchedule)
                            proxy._updateParentItem(data, null, true);
                        else if (isParent && !data.isAutoSchedule)
                            proxy._updateManualParentItem(data, null, true);

                        if (data.parentItem && data.parentItem.isAutoSchedule)
                            proxy._updateParentItem(data, null, false);
                        else if(data.parentItem && !data.parentItem.isAutoSchedule)
                            proxy._updateManualParentItem(data, null, false);
                    }
                }
                // Remove predecessor from treegrid part and skip the rendering if it connects to parent item
                if (args.columnName == "predecessor" && model.predecessorMapping) {
                    var val = args.value.replace(/[a-z]/gi, '').split(','); 
                    for (var i = 0; i < val.length; i++) {
                        var record = model.flatRecords.filter(function (item) {
                            return item && item.taskId == val[i];
                        });
                        if (record[0] && record[0].hasChildRecords) {
                            var predecessorCollection = args.data.predecessor.filter(function (item) {
                                if (item && (item.from == val[i] || item.to == val[i]))
                                    return item;
                            });
                            var predecessorIndex = args.data.predecessor.indexOf(predecessorCollection[0]);
                            args.data.predecessor.splice(predecessorIndex, 1);
                            var treegridObject = proxy._$treegridHelper.ejTreeGrid("instance");
                            ej.TreeGrid.refreshRow(treegridObject, model.flatRecords.indexOf(args.data));
                        }
                    }
                }
                if (args.isModified || proxy._isDurationUpdated) {
                    proxy.model.currentViewData = proxy._$treegridHelper.ejTreeGrid("getCurrentViewData");
                    if (args.data.isAutoSchedule || model.validateManualTasksOnLinking)
                        proxy._isValidationEnabled = true;
                    else
                        proxy._isValidationEnabled = false;
                    proxy._updateEditedGanttRecords(args,false);
                }
            }

            proxy._isDurationUpdated = false;
            proxy._isinBeginEdit = false;
            proxy._isLastRefresh = true;
            proxy.refreshGanttRecord(args.data);
            
            delete args.isModified;
            if (proxy.model.toolbarSettings.showToolbar) {
                var toolBarDisableItems = [];

                if (proxy.model.toolbarSettings.toolbarItems.indexOf("cancel") !== -1) {
                    toolBarDisableItems.push($(toolbar).find(".e-cancel").parent()[0]);
                }

                if (proxy.model.toolbarSettings.toolbarItems.indexOf("update") !== -1) {
                    toolBarDisableItems.push($(toolbar).find(".e-saveitem").parent()[0]);
                }
                
                $(toolbar).ejToolbar('disableItem', toolBarDisableItems);
            }

            if (!args.cancel && (args.columnName === "startDate" || args.columnName === "endDate" || args.columnName === "duration" || args.columnName === "baselineStartDate" || args.columnName === "baselineEndDate")) {
                proxy._updateScheduleDatesOnEditing(args);
            }
            if (!args.cancel && (args.columnName === "taskMode" || args.columnName === "startDate" || args.columnName === "endDate" || args.columnName === "duration" || args.columnName === "status" || args.columnName === "predecessor")) {
                if (this.isCriticalPathEnable == true) {
                    proxy._$ganttchartHelper.ejGanttChart("criticalConnectorLine", this.criticalPathCollection, this.detailPredecessorCollection, false, this.collectionTaskId);
                    this.showCriticalPath(true);
                }
            }
            // proxy._trigger("endEdit", args);
        },
       
        filterColumn: function (fieldName, filterOperator, filterValue, predicate, matchcase) {

            var proxy = this,
                model = proxy.model, filteredColumns = proxy.model.filterSettings.filteredColumns;
            var args = {};
            args.requestType = "filtering";
            args.currentFilterObject = [];
            if (!Array.isArray(filterOperator))
                filterOperator = $.makeArray(filterOperator);
            if (!Array.isArray(filterValue))
                filterValue = $.makeArray(filterValue);
            var firstLoop = false;
            var filterCol = this._filterCollection;
            if (this._currentFilterColumn.length<=0 || ej.util.isNullOrUndefined(this._currentFilterColumn))
                this._currentFilterColumn = ej.TreeGrid.getColumnByMappingName(proxy._columns, fieldName); //this.getColumnByField(fieldName);
            if (fieldName == model.resourceInfoMapping)
                fieldName = "resourceNames";
            else if (fieldName == model.predecessorMapping)
                fieldName = "predecessorsName";
            else
                fieldName = this._currentFilterColumn.field;
            for (var index = 0; index < filterOperator.length; index++) {
                var filterObject = {
                    field: fieldName, 
                    operator: filterOperator[index],
                    value: filterValue[index],
                    matchcase: matchcase,
                    predicate: predicate
                };
                this._$colType = "string";
                if (filteredColumns.length == 0 && filterObject.value !== "") {
                    if (this._$colType == "date" && (filterOperator == "equal" || filterOperator == "notequal") && typeof (filterObject.value) !== "string")
                        this._setDateFilters(filterObject);
                    else
                        filteredColumns.push(filterObject);
                } 
                firstLoop = true;
                args.currentFilterObject.push(filterObject);
            }
            args.filterCollection = filteredColumns;
            args.currentFilteringColumn = fieldName;
            args.fieldName = fieldName;
            proxy._refreshFilteredRecords(args);           
        },
        clearFilter: function () {
            var proxy = this, args = {};
            args.requestType = "filtering";
            proxy.model.filterSettings.filteredColumns = [];
            proxy._refreshFilteredRecords(args);
        },
        _refreshFilteredRecords: function (args) {
            var proxy=this, model=proxy.model, treeGrid = $("#ejTreeGrid" + proxy._id).data("ejTreeGrid");
            treeGrid.model.filterSettings.filteredColumns = model.filterSettings.filteredColumns;
            proxy._$treegridHelper.ejTreeGrid("processBindings", args);
        },

        filterContent: function (filterObject) {
            var proxy = this,
                model = proxy.model,
                filteredColumns = model.filterSettings.filteredColumns;
            if (!(filterObject instanceof ej.Predicate))
                return false;
            var predicateArray = [];
            predicateArray.push(filterObject.toJSON());
            proxy._addPredicateObject(predicateArray, filteredColumns);

            var args = { requestType: "filtering" };
            proxy._refreshFilteredRecords(args);
        },

        _addPredicateObject: function (filterObject, filteredColumns, condition) {
            var model = this.model,
                length = filterObject.length;

            for (var i = 0; i < length; i++) {
                var predicate = filterObject[i];
                if (predicate.isComplex) {
                    if (!ej.isNullOrUndefined(predicate.predicates))
                        this._addPredicateObject(predicate.predicates, filteredColumns, predicate.condition);
                }
                else {
                    var arg = {};
                    if (predicate.field == model.resourceInfoMapping)
                        arg.field = "resourceNames";
                    else if (predicate.field == model.predecessorMapping)
                        arg.field = "predecessorsName";
                    else
                        arg.field = predicate.field;
                    arg.operator = predicate.operator;
                    arg.value = predicate.value;
                    arg.matchcase = !predicate.ignoreCase;
                    arg.predicate = condition;

                    filteredColumns.push(arg);
                }
            }
        },
        
        _endEdit: function (args) {
            var proxy = this,
                model = this.model;
            if (proxy.model.predecessorMapping) {
                var newArgs = {},
                         validateMode = {
                             respectLink: false,
                             removeLink: false,
                             preserveLinkWithEditing: true,
                         };
                newArgs.editMode = "cellEdit";
                newArgs.data = args.data;
                newArgs.requestType = "validateLinkedTask";
                newArgs.validateMode = validateMode;
                proxy._endEditArgs = args;
                if (!proxy._trigger("actionBegin", newArgs)) {
                    if (model.enablePredecessorValidation && (args.columnName == "startDate" || args.columnName == "endDate") && proxy.getFormatedDate(args.value) != proxy.getFormatedDate(args.previousValue)
                        && proxy.model.predecessorMapping && (args.data.isAutoSchedule || model.validateManualTasksOnLinking) && !proxy._validateTypes(newArgs)) {
                        return;
                    }
                    else
                        proxy._triggerEndEdit(args);
                }
            } else {
                proxy._endEditArgs = args;
                proxy._triggerEndEdit(args);
            }
        },

        //updated the schedule dates while cellediting ,taskBarediting and dialogEditing and dialogAdding
        _updateScheduleDatesOnEditing: function (args) {
            var proxy = this,
                model = this.model,
                startDate = proxy._getValidStartDate(args.data),
                endDate = proxy._getValidEndDate(args.data),
                scheduleStartDate = proxy._projectStartDate,    //_getDateFromFormat(model.scheduleStartDate),
                scheduleEndDate = proxy._getDateFromFormat(model.scheduleEndDate),
                minStartDate, maxEndDate, minBaselineStartDate, maxBaseLineEndDate,
                isDateChanged = false,
                tempStartDate = model.scheduleStartDate,
                updatedDates,
                tempEndDate = model.scheduleEndDate;
            if (ej.isNullOrUndefined(args.data._isScheduledTask(args.data)))
                return;
            if (model.scheduleHeaderSettings.updateTimescaleView) {
                if (args.data.hasChildRecords && !args.data.isAutoSchedule) {
                    startDate = proxy._getDateFromFormat(args.data.manualStartDate),
                    endDate = proxy._getDateFromFormat(args.data.manualEndDate);
                }
                proxy._calculateDatesForScheduleCheck(startDate);
                if (!model.predecessorMapping) {
                    if (proxy._compareDates(startDate, scheduleStartDate) == -1) {
                        minStartDate = startDate;
                        scheduleStartDate = startDate;
                    }
                    else if (proxy._compareDates(startDate, scheduleEndDate) == 1) {
                        maxEndDate = startDate;
                        scheduleEndDate = startDate;
                    }

                    if (proxy._compareDates(endDate, scheduleStartDate) == -1)
                        minStartDate = endDate;
                    else if (proxy._compareDates(endDate, scheduleEndDate) == 1)
                        maxEndDate = endDate;

                    if (maxEndDate) {
                        isDateChanged = true;
                        tempEndDate = args.data._getFormatedDate(maxEndDate, model.dateFormat, model.locale);
                    }
                    if (minStartDate) {
                        isDateChanged = true;
                        tempStartDate = args.data._getFormatedDate(minStartDate, model.dateFormat, model.locale);
                    }
                    if (model.renderBaseline && args.data["baselineStartDate"] && args.data["baselineEndDate"]) {
                        var baselineStartDate = proxy._getDateFromFormat(args.data["baselineStartDate"]),
                            baselineEndDate = proxy._getDateFromFormat(args.data["baselineEndDate"]),
                            tempStartDate = proxy._getDateFromFormat(tempStartDate),
                            tempEndDate = proxy._getDateFromFormat(tempEndDate);
                        if (!(baselineStartDate.getTime() >= tempStartDate.getTime()) || !(baselineStartDate.getTime() <= tempEndDate.getTime())) {
                            if (baselineStartDate.getTime() < tempStartDate.getTime()) {
                                minBaselineStartDate = baselineStartDate;
                                scheduleStartDate = baselineStartDate;
                            }
                            else {
                                maxBaseLineEndDate = baselineStartDate;
                                scheduleEndDate = baselineStartDate;
                            }
                        }

                        if (!(baselineEndDate.getTime() >= tempStartDate.getTime()) || !(baselineEndDate.getTime() <= tempEndDate.getTime())) {
                            if (baselineEndDate.getTime() < tempStartDate.getTime())
                                minBaselineStartDate = baselineEndDate;
                            else
                                maxBaseLineEndDate = baselineEndDate;
                        }
                    }
                    if (maxBaseLineEndDate) {
                        isDateChanged = true;
                        tempEndDate = args.data._getFormatedDate(maxBaseLineEndDate, model.dateFormat, model.locale);
                    }
                    if (minBaselineStartDate) {
                        isDateChanged = true;
                        tempStartDate = args.data._getFormatedDate(minBaselineStartDate, model.dateFormat, model.locale);
                    }
                    if (isDateChanged) {
                        updatedDates = proxy._updateScheduleDatesByTaskLables(proxy._getDateFromFormat(tempStartDate), proxy._getDateFromFormat(tempEndDate));
                        proxy.updateScheduleDates(args.data._getFormatedDate(updatedDates.minStartDate, model.dateFormat, model.locale), args.data._getFormatedDate(updatedDates.maxEndDate, model.dateFormat, model.locale));
                    }
                }
                else {
                    var editArgs = {};
                    editArgs.onEditing = true;
                    proxy._calculateScheduleDates(editArgs);
                    proxy._calculateDatesForScheduleCheck(editArgs.minStartDate);
                    if (proxy._compareDates(editArgs.minStartDate, scheduleStartDate) == -1) {
                        tempStartDate = args.data._getFormatedDate(editArgs.minStartDate, model.dateFormat, model.locale);
                        isDateChanged = true;
                    }
                    if (proxy._compareDates(editArgs.maxEndDate, scheduleEndDate) == 1) {
                        tempEndDate = args.data._getFormatedDate(editArgs.maxEndDate, model.dateFormat, model.locale);
                        isDateChanged = true;
                    }
                    if (isDateChanged) {
                        proxy.updateScheduleDates(tempStartDate, tempEndDate);
                    }
                }
            }
        },
        //add dates before edited dates for scheduleupdate 
        _calculateDatesForScheduleCheck:function(startdate)
        {
            var proxy = this, model = this.model,
                scheduleHeaderType = model.scheduleHeaderSettings.scheduleHeaderType,
                scheduleHeaderValue = ej.Gantt.ScheduleHeaderType;
            if (ej.isNullOrUndefined(startdate))
                return;
               
            if (scheduleHeaderType == scheduleHeaderValue.Week) {

                startdate.setDate(startdate.getDate() - 3);
            }

            if (scheduleHeaderType == scheduleHeaderValue.Year) {
                startdate.setDate(startdate.getDate() - 5);
            }
            if (scheduleHeaderType == scheduleHeaderValue.Month) {
                startdate.setDate(startdate.getDate() - 3);
            }

            if (scheduleHeaderType == scheduleHeaderValue.Day) {
                startdate.setHours(startdate.getHours() - 2);
            }
            if (scheduleHeaderType == scheduleHeaderValue.Hour) {
                startdate.setMinutes(startdate.getMinutes() - 5);
            }
        },
        //update schedule dates by tool bar operation
        _updateScheduleDatesByToolBar:function(args)
        {
            var proxy = this, model = this.model,
                 startDate = args === "prevTimeSpan" ? proxy._projectStartDate : proxy._getDateFromFormat(proxy.model.scheduleStartDate),
                 endDate = proxy._getDateFromFormat(proxy.model.scheduleEndDate),
                 chartObject = $("#ejGanttChart" + proxy._id).ejGanttChart("instance"),
                 scheduleHeaderType = model.scheduleHeaderSettings.scheduleHeaderType,
                 scheduleHeaderValue = ej.Gantt.ScheduleHeaderType,
                 maxScrollWidth = 0;
            chartObject._isCalendarExist = null;
            if (scheduleHeaderType == scheduleHeaderValue.Week) {
                if (args === "prevTimeSpan") {
                    startDate.setDate(startDate.getDate() - 6);
                }
                else {
                    endDate.setDate(endDate.getDate() + 7);
                }
            }

            if (scheduleHeaderType == scheduleHeaderValue.Year) {
                if (args === "prevTimeSpan")
                    startDate.setDate(startDate.getDate() - 360);
                else
                    endDate.setDate(endDate.getDate() + 365);
            }
            if (scheduleHeaderType == scheduleHeaderValue.Month) {
                if (args === "prevTimeSpan")
                    startDate.setMonth(startDate.getMonth() - 1);
                else
                    endDate.setDate(endDate.getDate() + 30);
            }
            if (scheduleHeaderType == scheduleHeaderValue.Day) {
                if (args === "prevTimeSpan")
                    startDate.setDate(startDate.getDate() - 1);
                else
                    endDate.setDate(endDate.getDate() + 1);
            }
            if (scheduleHeaderType == scheduleHeaderValue.Hour) {
                if (args === "prevTimeSpan")
                    startDate.setHours(startDate.getHours() - 1);
                else
                    endDate.setHours(endDate.getHours() + 1);
            }                                    
            if (args === "prevTimeSpan") {
                proxy.updateScheduleDates(proxy._getFormatedDate(startDate, model.dateFormat, model.locale), proxy._getFormatedDate(endDate, model.dateFormat, model.locale));
                chartObject._$bodyContainer.ejScroller("scrollX", 0, true);
                if (proxy.isCriticalPathEnable == true && model.predecessorMapping) {
                    proxy._$ganttchartHelper.ejGanttChart("criticalConnectorLine", proxy.criticalPathCollection, proxy.detailPredecessorCollection, true, proxy.collectionTaskId);
                }
            }
            else if (args === "nextTimeSpan") {
                proxy.updateScheduleDates(proxy._getFormatedDate(startDate, model.dateFormat, model.locale), proxy._getFormatedDate(endDate, model.dateFormat, model.locale));
                maxScrollWidth = chartObject.getMaxScrollWidth();
                chartObject._$bodyContainer.ejScroller("scrollX", maxScrollWidth, true);
                if (proxy.isCriticalPathEnable == true && model.predecessorMapping) {
                    proxy._$ganttchartHelper.ejGanttChart("criticalConnectorLine", proxy.criticalPathCollection, proxy.detailPredecessorCollection, true, proxy.collectionTaskId);
                }
            }
        },
        _rowDataBound: function (args) {
            this._trigger("rowDataBound", args);
        },
        _refreshToolBar: function () {
            var $toolbar = $("#" + this._id + "_toolbarItems");
            $toolbar.find("li").removeClass("e-hover");
        },

        _toolBarClick: function (sender) {
            var proxy = this,
                model=proxy.model,
                $ganttEle = $(this.itemsContainer).closest(".e-gantt"),
                ganttInstance = $ganttEle.ejGantt("instance"),
               ganttId = $ganttEle.attr('id'),
                toolbarObj = $("#" + ganttInstance._id + "_toolbarItems");

            ganttInstance._clearContextMenu();
            if (sender.event == undefined && sender.target.tagName == "INPUT" && sender.currentTarget.id == ganttId + "_search")
                return false;

            if (ganttInstance.model.dateFormat.toLowerCase().indexOf("hh") != -1)
                $.isFunction($.fn.ejDateTimePicker) && $("#" + ganttId + "EditForm").find(".e-datetimepicker").ejDateTimePicker("hide");
            else
                $.isFunction($.fn.ejDatePicker) && $("#" + ganttId + "EditForm").find(".e-datepicker").ejDatePicker("hide");
            var currentTarget = sender.currentTarget; var target = sender.target;
            var args = {
                itemName: sender.text,
                currentTarget: currentTarget,
                model: ganttInstance.model,
            };

            if ($ganttEle.ejGantt("instance")._trigger("toolbarClick", args))
                return false;
            $(toolbarObj).ejToolbar('deselectItem', sender.currentTarget);
            switch (sender.currentTarget.id) {
                case ganttId + "_excelExport":
                    ganttInstance._toolbarOperation(ganttId + "_excelExport");
                    break;
                case ganttId + "_pdfExport":
                    ganttInstance._toolbarOperation(ganttId + "_pdfExport");
                    break;
                case ganttId + "_add":
                    ganttInstance._toolbarOperation(ganttId + "_add");
                    break;

                case ganttId + "_edit":
                    ganttInstance._toolbarOperation(ganttId + "_edit");
                    break;

                case ganttId + "_delete":
                    ganttInstance._toolbarOperation(ganttId + "_delete");
                    break;

                case ganttId + "_update":
                    ganttInstance._toolbarOperation(ganttId + "_update");
                    break;

                case ganttId + "_cancel":
                    ganttInstance._toolbarOperation(ganttId + "_cancel");
                    break;

                case ganttId + "_search":
                    ganttInstance._toolbarOperation(ganttId + "_search", $(sender.currentTarget).find("input").val());
                    break;

                case ganttId + "_indent":
                    ganttInstance._toolbarOperation(ganttId + "_indent");
                    break;

                case ganttId + "_outdent":
                    ganttInstance._toolbarOperation(ganttId + "_outdent");
                    break;
                    
                case ganttId + "_expandAll":
                    ganttInstance._toolbarOperation(ganttId + "_expandAll");
                    break;

                case ganttId + "_criticalPath":
                    if (!ganttInstance._enableDisableCriticalIcon) {
                        ganttInstance._toolbarOperation(ganttId + "_criticalEnable");
                    }
                    else if (ganttInstance._enableDisableCriticalIcon) {
                        ganttInstance._toolbarOperation(ganttId + "_criticalDisable");
                    }
                    break;

                case ganttId + "_collapseAll":
                    ganttInstance._toolbarOperation(ganttId + "_collapseAll");
                    break;
                case ganttId + "_prevTimeSpan":
                    ganttInstance._toolbarOperation(ganttId + "_prevTimeSpan");
                    break;
                case ganttId + "_nextTimeSpan":
                    ganttInstance._toolbarOperation(ganttId + "_nextTimeSpan");
                    break;
                }
            return false;
        },

        _toolbarOperation: function (operation, searchEle) {
            var $ganttEle = this.element,
                ganttObject = $ganttEle.ejGantt("instance"),
                //gridObject = $gridEle.ejTreeGrid("instance"),
                ganttId = $ganttEle.attr('id'),
                proxy = this,
                rowindex = proxy.selectedRowIndex();
            ganttObject._exportTo = ganttObject["export"];
            var toolbar = $("#" + proxy._id + "_toolbarItems");
            switch (operation) {

                case ganttId + "_add":
                    proxy._sendAddRequest();
                    break;

                case ganttId + "_edit":
                    proxy._sendEditRequest();
                    break;

                case ganttId + "_delete":
                    proxy._$treegridHelper.ejTreeGrid("deleteRow");
                    proxy._isRefreshAddedRecord = false;

                    break;

                case ganttId + "_update":
                    proxy._$treegridHelper.ejTreeGrid("endEdit");
                    //gridObject.sendSaveRequest();

                    if (proxy.model.toolbarSettings.toolbarItems.indexOf("cancel") !== -1) {
                        proxy._disabledToolItems.push($(toolbar).find(".e-cancel").parent()[0]);
                    }

                    if (proxy.model.toolbarSettings.toolbarItems.indexOf("update") !== -1) {
                        proxy._disabledToolItems.push($(toolbar).find(".e-saveitem").parent()[0]);
                    }
                    $(toolbar).ejToolbar('disableItem', proxy._disabledToolItems);
                    
                    proxy._disabledToolItems = [];
                    
                    break;

                case ganttId + "_cancel":
                    proxy._$treegridHelper.ejTreeGrid("cancelEditCell");                                                            
                    proxy._$treegridHelper.ejTreeGrid('setFocusOnTreeGridElement');
                    break;

                case ganttId + "_criticalEnable":
                    proxy.showCriticalPath(true);
                    proxy._$treegridHelper.ejTreeGrid('setFocusOnTreeGridElement');
                    break;

                case ganttId + "_criticalDisable":
                    proxy.showCriticalPath(false);
                    proxy._$treegridHelper.ejTreeGrid('setFocusOnTreeGridElement');
                    break;

                case ganttId + "_search":
                    proxy.cancelEditCell();
                    if (proxy._searchString != searchEle) {
                        proxy._$treegridHelper.ejTreeGrid("search", searchEle);
                        proxy.clearSelection();
                        proxy._clearMultiSelectPopup();
                        proxy._searchString = searchEle;
                        proxy.updateSelectedItemIndex();
                        proxy._updateToolbarOptions();
                        proxy._isRefreshAddedRecord = false;
                    }
                    break;

                case ganttId + "_indent":
                    proxy._sendIndentRequest();
                    proxy._$treegridHelper.ejTreeGrid('setFocusOnTreeGridElement');
                    proxy._isRefreshAddedRecord = false;
                    break;

                case ganttId + "_outdent":
                    proxy._sendOutdentRequest();
                    proxy._$treegridHelper.ejTreeGrid('setFocusOnTreeGridElement');
                    proxy._isRefreshAddedRecord = false;
                    break;

                case ganttId + "_expandAll":
                    proxy._expandAll();
                    proxy.updateSelectedItemIndex();
                    proxy._$treegridHelper.ejTreeGrid('setFocusOnTreeGridElement');
                    break;

                case ganttId + "_collapseAll":
                    proxy._collapseAll();
                    proxy.updateSelectedItemIndex();
                    proxy._$treegridHelper.ejTreeGrid('setFocusOnTreeGridElement');
                    break;
                case ganttId + "_prevTimeSpan":
                    proxy._updateScheduleDatesByToolBar("prevTimeSpan");
                    proxy._$treegridHelper.ejTreeGrid('setFocusOnTreeGridElement');
                    break;
                case ganttId + "_nextTimeSpan":
                    proxy._updateScheduleDatesByToolBar("nextTimeSpan");
                    proxy._$treegridHelper.ejTreeGrid('setFocusOnTreeGridElement');
                    break;

                case ganttId + "_excelExport":
                    proxy._exportTo(ganttObject.model.exportToExcelAction, 'excelExporting', ganttObject.model.allowMultipleExporting);
                    break;
                case ganttId + "_pdfExport":
                    proxy._exportTo(ganttObject.model.exportToPdfAction, 'pdfExporting', ganttObject.model.allowMultipleExporting);
                    break;
            }
            proxy._refreshToolBar();
            return false;
        },

        /* update selected ietm index when selected item row position changed */
        updateSelectedItemIndex: function () {
            var proxy = this, model = this.model, updatedRecords = model.updatedRecords,
                index;
            if (model.selectedItems.length > 1)
                return;
            if(model.allowSelection && !ej.isNullOrUndefined(this.selectedItem()))
            {
                if (proxy.getExpandStatus(this.selectedItem())) {
                    index = updatedRecords.indexOf(this.selectedItem());
                    proxy.selectRows(index);
                }
                else
                {
                    proxy.selectRows(-1);
                }
            } else if (!model.allowSelection && !ej.isNullOrUndefined(this.selectedItem())) {
                proxy.selectRows(-1);
            }
        },

        clearSelection:function(index){
            var proxy = this, model = proxy.model;
            model.selectedCellIndexes = [];
            proxy._$treegridHelper.ejTreeGrid("clearSelection", index);
            proxy._$ganttchartHelper.ejGanttChart("clearSelection", index);
            //to update selectedItems collection
            var treeGridObj = proxy._$treegridHelper.ejTreeGrid("instance");
            model.selectedItems = treeGridObj.model.selectedItems;
            proxy.selectedItem(treeGridObj.model.selectedItem);
            proxy.selectedRowIndex(treeGridObj.model.selectedRowIndex);
            proxy._clearMultiSelectPopup();
        },

        selectCells: function (indexes, preservePreviousSelectedCells) {
            var proxy = this,
                model = proxy.model;
            if (model.selectionMode == "cell" && model.allowSelection) {
                proxy._$treegridHelper.ejTreeGrid("selectCells", indexes, preservePreviousSelectedCells);
            }
        },

        //select rows index of this item
        selectRows: function (index)
        {
            var proxy = this, model = this.model;

            if (model.selectionMode == "cell")
                return;

            if (index !== -1 && !ej.isNullOrUndefined(index) && index < model.updatedRecords.length) {
                var args = {};
                args.recordIndex = index;
                args.data = model.updatedRecords[args.recordIndex];
                args.target = "ejTreeGrid";
                if (proxy.rowSelecting(args)) {
                    proxy._$treegridHelper.ejTreeGrid("selectRows", args.recordIndex);                   
                    proxy.rowSelected(args);
                }                
            }
            else if (index === -1) {
                proxy._deSelectRowItem();
                proxy._updateToolbarOptions();
            }
        },

        _setModel: function (options) {
            
            var proxy = this, option,
                model = proxy.model;
            
            for (option in options) {
                switch (option) {
                    case "sortSettings":
                        proxy._sendSortingRequest(options[option]);
                        break;
                    case "allowSorting":
                        proxy._sortingRequest(options[option]);
                        if (model.showColumnChooser && model.showColumnOptions)
                            proxy._$treegridHelper.ejTreeGrid("columnAddDialogTemplate");
                        break;
                    case "allowMultiSorting":
                        model.allowMultiSorting = options[option];
                        proxy._$treegridHelper.ejTreeGrid("model.allowMultiSorting", model.allowMultiSorting);
                        break;
                    case "destroy":
                        proxy.destroy();
                        break;
                    case "treeColumnIndex":
                        proxy._columnIndex(options[option]);
                        break;
                    case "allowGanttChartEditing":
                        proxy._ganttChartEditing(options[option]);
                        break;
                    case "enableProgressBarResizing":
                        proxy._resizeProgressbar(options[option]);
                        break;
                    case "enableTaskbarTooltip":
                        proxy._showTooltip(options[option]);
                        break;
                    case "enableTaskbarDragTooltip":
                        proxy._showEditingTooltip(options[option]);
                        break;                  
                    case "validateManualTasksOnLinking":
                        model.validateManualTasksOnLinking = options[option];
                        break;
                    case "enableAltRow":
                        proxy._updateAltRow(options[option]);
                        break;
                    case "locale":
                        model.flatRecords = [];
                        model.parentRecords = [];
                        proxy._clearContextMenu();
                        model.locale = options[option];
                        model.isRerender = true;
                        proxy.element.ejGantt("destroy").ejGantt(model);                        
                        break;
                    case "allowSelection":
                        model.allowSelection = options[option];
                        if (model.allowSelection) {
                            proxy._$treegridHelper.ejTreeGrid("instance").model.allowSelection = true;
                            proxy._$ganttchartHelper.ejGanttChart("instance").model.allowSelection = true;
                        }
                        else {
                            proxy._deSelectRowItem();
                            proxy._$treegridHelper.ejTreeGrid("instance").model.allowSelection = false;
                            proxy._$ganttchartHelper.ejGanttChart("instance").model.allowSelection = false;
                        }
                        proxy._updateToolbarOptions();
                        break;
                    case "editSettings":
                        $.extend(model.editSettings, options[option]);
                        proxy._updateEditSettings(options[option]);
                        proxy._initiateDialogTemplates();
                        proxy._enableEditingEvents();
                        this.cancelEditCell(); 
                        proxy._$treegridHelper.ejTreeGrid("setModel",{"editSettings":{"showDeleteConfirmDialog" :model.editSettings.showDeleteConfirmDialog}});
                        break;                  
                    case "taskbarBackground":
                        proxy._updateTaskbarBackground(options[option]);
                        break;
                    case "progressbarBackground":
                        proxy._updateProgressbarBackground(options[option]);
                        break;
                    case "parentTaskbarBackground":
                        proxy._updateParentTaskbarBackground(options[option]);
                        break;
                    case "parentProgressbarBackground":
                        proxy._updateParentProgressbarBackground(options[option]);
                        break;
                    case "showTaskNames":
                        proxy._updateRenderTaskNames(options[option]);
                        break;
                    case "leftTaskLabelMapping":
                        proxy._refreshLeftTaskLabelMapping(options[option]);
                        break;

                    case "rightTaskLabelMapping":
                        proxy._refreshRightTaskLabelMapping(options[option]);
                        break;

                    case "leftTaskLabelTemplate":
                        proxy._refreshLeftTaskLabelTemplate(options[option]);
                        break;

                    case "rightTaskLabelTemplate":
                        proxy._refreshRightTaskLabelTemplate(options[option]);
                        break;
                    case "showProgressStatus":
                        proxy._updateRendeProgressStatus(options[option]);
                        break;
                    case "showResourceNames":
                        proxy._updateRenderResourceNames(options[option]);
                        break;
                    case "progressbarHeight":
                        proxy._updateProgressbarHeight(options[option]);
                        break;
                    case "baselineColor":
                        proxy._updateBaselineColor(options[option]);
                        break;
                    case "renderBaseline":
                        proxy._updateRenderBaseline(options[option]);
                        break;
                    case "allowColumnResize":
                        proxy._updateAllowColumnResize(options[option]);
                        break;
                    case "allowKeyboardNavigation":
                        proxy._updateAllowKeyboardNavigation(options[option]);
                        break;
                    case "selectedItem":
                        proxy._updateSelectedItem(options[option]);
                        break;
                    case "dataSource":
                        if (model.viewType != ej.Gantt.ViewType.HistogramView) {
                            proxy._deSelectRowItem();
                            proxy._updateToolbarOptions();
                        }
                        if (this.isProjectViewData && model.viewType == ej.Gantt.ViewType.HistogramView)
                            model.viewType = ej.Gantt.ViewType.ProjectView;
                        else if (this.isProjectViewData === false && model.viewType == ej.Gantt.ViewType.HistogramView)
                            model.viewType = ej.Gantt.ViewType.ResourceView;
                        this._refreshDataSource(options[option]);
                        if (proxy._enableDisableCriticalIcon) {
                            proxy.showCriticalPath(true);
                        }
                        proxy._updateScrollerBorder();
                        break;
                    case "readOnly":
                        proxy._updateReadOnly(options[option]);
                        break;
                    case "showGridCellTooltip":
                        proxy._updateShowGridCellTooltip(options[option]);
                        break;
                    case "showGridExpandCellTooltip":
                        proxy._updateShowGridExpandCellTooltip(options[option]);
                        break;
                    case "highlightWeekends":
                        proxy._updateHighlightWeekends(options[option]);
                        break;
                    case "highlightNonWorkingTime":
                        proxy._updateHighlightNonWorkingTime(options[option]);
                        break;
                    case "nonWorkingBackground":
                        proxy._updateNonWorkingBackground(options[option]);
                        break;
                    case "connectorLineBackground":
                        proxy._updateConnectorLineBackground(options[option]);
                        if (proxy._enableDisableCriticalIcon) {
                            proxy._$ganttchartHelper.ejGanttChart("criticalConnectorLine", this.criticalPathCollection, this.detailPredecessorCollection, true, this.collectionTaskId);
                        }
                        break;
                    case "connectorlineWidth":
                        proxy._updateConnectorlineWidth(options[option]);
                        if (proxy._enableDisableCriticalIcon) {
                            proxy._$ganttchartHelper.ejGanttChart("criticalConnectorLine", this.criticalPathCollection, this.detailPredecessorCollection, true, this.collectionTaskId);
                        }
                        break;
                    case "weekendBackground":
                        proxy._updateWeekendBackground(options[option]);
                        break;
                    case "scheduleHeaderSettings":
                        var settings = options[option];
                        for (var setting in settings) {
                            switch (setting) {
                                case "timescaleUnitSize":
                                    proxy._updateTimescaleUnitSize(settings[setting]);
                                    proxy._updateScrollerBorder();
                                    break;
                                case "scheduleHeaderType":
                                    proxy._changeChartSchedule(settings[setting]);
                                    proxy._updateScrollerBorder();
                                    break;
                            }
                        }
                        break;
                    case "enableContextMenu":
                        model.enableContextMenu = options[option];
                        proxy._clearContextMenu();
                        proxy._off(proxy.element, "contextmenu", proxy._rightClick);
                        if (model.enableContextMenu) {
                            proxy._on(proxy.element, "contextmenu", proxy._rightClick);
                        }
                        break;
                    case "enableResize":
                        if (model.enableResize) {
                            proxy.model.enableResize = options[option];
                            proxy._on($(window), "resize", proxy.windowResize);
                        }
                        else {
                            proxy._off($(window), "resize", proxy.windowResize);
                        }
                        break;
                    case "isResponsive":
                        if (model.isResponsive) {
                            proxy.model.isResponsive = options[option];
                            proxy._on($(window), "resize", proxy.windowResize);
                        }
                        else {
                            proxy._off($(window), "resize", proxy.windowResize);
                        }
                        break;
                    case "selectedRowIndex":
                        if (this.selectedRowIndex() === -1 || this.selectedRowIndex() === "") {
                            proxy._deSelectRowItem();
                            proxy._updateToolbarOptions();
                        }
                        else if (this.selectedRowIndex() !== -1 && !ej.isNullOrUndefined(this.selectedRowIndex()) && this.selectedRowIndex() < proxy.model.updatedRecords.length) {
                            var rowSelectingArgs = {};
                            rowSelectingArgs.recordIndex = proxy.selectedRowIndex();
                            rowSelectingArgs.previousIndex = model.selectedItem ? model.updatedRecords.indexOf(model.selectedItem) : -1;
                            if (proxy.rowSelecting(rowSelectingArgs)) {
                                var args = {};
                                args.recordIndex = this.selectedRowIndex();
                                args.data = proxy.model.updatedRecords[args.recordIndex];
                                args.target = "ejTreeGrid";
                                proxy._$treegridHelper.ejTreeGrid("selectRows", args.recordIndex);
                                proxy.rowSelected(args);
                            }
                        }
                        break;
                    case "selectedCellIndexes":
                        if (model.allowSelection && model.selectionMode == "cell") {
                            proxy.selectCells(options[option]);
                        }
                        break;
                    case "selectionMode":
                        if (model.allowSelection) {
                            proxy.clearSelection();
                            proxy._$treegridHelper.ejTreeGrid("selectRows", -1);
                            proxy._$ganttchartHelper.ejGanttChart("selectRows", -1);
                            model.selectedItem = null;
                            model.selectionMode = options[option];
                            proxy._$treegridHelper.ejTreeGrid("option", "selectionMode", options[option]);
                            proxy._$ganttchartHelper.ejGanttChart("option", "selectionMode", options[option]);
                            proxy._updateToolbarOptions();
                            if (proxy.model.selectionType == "multiple" && proxy.model.selectionMode == "row") {
                                $("#" + this._id + "_selectionpopup").remove();
                                proxy._renderMultiSelectionPopup();
                            }
                        }
                        break;
                    case "selectionType":
                        if (model.allowSelection) {
                            proxy.clearSelection();
                            model.selectionType = options[option];
                            proxy._$treegridHelper.ejTreeGrid("option", "selectionType", options[option]);
                            proxy._$ganttchartHelper.ejGanttChart("option", "selectionType", options[option]);
                            if (proxy.model.selectionType == "multiple" && proxy.model.selectionMode == "row") {
                                $("#" + this._id + "_selectionpopup").remove();
                                proxy._renderMultiSelectionPopup();
                            }
                        }
                        break;
                    case "showColumnChooser":
                        model.showColumnChooser = options[option];
                        proxy._$treegridHelper.ejTreeGrid("setModel", {"showColumnChooser":model.showColumnChooser});
                        break;
                    case "showColumnOptions":
                        model.showColumnOptions = options[option];
                        proxy._$treegridHelper.ejTreeGrid("setModel", { "showColumnOptions": model.showColumnOptions });
                        break;
                    case "splitterPosition":
                        proxy.setSplitterPosition(proxy._splitterPosition());
                        break;
                    case "addDialogFields":
                        if (model.editSettings.allowAdding) {
                            model.addDialogFields = options[option];
                            proxy.addDialogTemplate();
                        }
                        break;
                    case "dragTooltip":
                        proxy._$treegridHelper.ejTreeGrid("setModel", { "dragTooltip": options[option] });
                        break;

                    case "allowDragAndDrop":
                        model.allowDragAndDrop = options[option];
                        proxy._$ganttchartHelper.ejGanttChart("updateDragAndDrop", model.allowDragAndDrop);
                        proxy._$treegridHelper.ejTreeGrid("setModel", { "allowDragAndDrop": model.allowDragAndDrop });
                        break;
                    case "editDialogFields":
                        if (model.editSettings.allowEditing) {
                            model.editDialogFields = options[option];
                            proxy.editDialogTemplate();
                        }
                        break;
                    case "toolbarSettings":
                        $.extend(proxy.model.toolbarSettings, options[option]);
                        proxy._updateToolbar();
                        break;
                    case "holidays":
                        model.holidays = options[option];
                        proxy._refreshHolidays();
                        proxy._updateScrollerBorder();
                        break;
                    case "stripLines":
                        model.stripLines = options[option];
                        proxy._updateStripLines();
                        proxy._updateScrollerBorder();
                        break;
                    case "splitterSettings":
                        $.extend(model.splitterSettings, options[option]);
                         if (!ej.isNullOrUndefined(options[option].index) && ej.isNullOrUndefined(options[option].position))
                            proxy.setSplitterIndex(model.splitterSettings.index);
                        else
                            proxy.setSplitterPosition(proxy.splitterPosition());
                        break;
                    case "enablePredecessorValidation":
                        model.enablePredecessorValidation = options[option];
                        break;
                    case "enableSerialNumber":
                        model.enableSerialNumber = options[option];
                        proxy._updateSerialColumns();
                        proxy._$treegridHelper.ejTreeGrid("model.enableSerialNumber", options[option]);
                        proxy._$treegridHelper.ejTreeGrid("updateColumns", proxy._columns);
                        break;
                    case "sizeSettings":
                        this._calculateDimensions();
                        this.windowResize();
                        break;
                    case "milestoneTemplate":
                        proxy._milestoneTemplate(options[option]);
                        break;
                    case "taskbarTemplate":
                        proxy._taskbarTemplate(options[option]);
                        break;
                    case "parentTaskbarTemplate":
                        proxy._parentTaskbarTemplate(options[option]);
                        break;
                    case "dayWorkingTime":
                        model.dayWorkingTime = options[option].slice();
                        model.flatRecords = [];
                        model.parentRecords = [];
                        model.updatedRecords = [];
                        model.ids = [];
                        model.scheduleStartDate = model.scheduleStartDate;
                        model.scheduleEndDate = model.scheduleEndDate;
                        proxy._storedIndex = -1;
                        proxy._lastInsertedId = -1;

                        proxy.selectedRowIndex(-1);
                        proxy._predecessorsCollection = [];
                        proxy.element.ejGantt("destroy").ejGantt(model);
                        break;
                    case "workUnit":
                        model.workUnit = options[option];
                        this._updateWorkUnit();
                        break;
                    case "resources":                        
                        proxy._updateResourcesData(options[option]);
                        break;
                    case "cssClass":
                        this.element.removeClass(proxy._cssClass).addClass(options[option]);
                        model.toolbarSettings.showToolbar && $("#" + proxy._id + "_toolbarItems").ejToolbar("model.cssClass", options[option]);
                        $("#e-ejSpliter" + proxy._id).data("ejSplitter") && $("#e-ejSpliter" + proxy._id).ejSplitter("model.cssClass", options[option]);
                        proxy._$treegridHelper.ejTreeGrid("model.cssClass", options[option]);
                        proxy._$ganttchartHelper.removeClass(proxy._cssClass).addClass(options[option]);
                        proxy._$ganttchartHelper.ejGanttChart("model.cssClass", options[option]);
                        proxy.addDialogTemplate();
                        proxy.editDialogTemplate();
                        this._cssClass = options[option];
                        break;
                    case "workWeek":
                        model.workWeek = options[option].slice();
                        //Set the default workWeek when workWeek is empty
                        if (model.workWeek.length == 0)
                            model.workWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
                        proxy._getNonWorkingDayIndex();
                        proxy._$ganttchartHelper.ejGanttChart("updateWorkWeek", model.workWeek);
                        proxy._refreshDataSource(model.dataSource);
                        break;
                    case "enableVirtualization":
                        model.enableVirtualization = options[option];
                        proxy._$treegridHelper.ejTreeGrid("setModel", { "enableVirtualization": model.enableVirtualization });
                        proxy._updateExpandStatus();
                        proxy._totalCollapseRecordCount = proxy._$treegridHelper.ejTreeGrid("getCollapsedRecordCount");
                        model.selectedItem && this.selectedRowIndex(model.updatedRecords.indexOf(model.selectedItem));
                        proxy._$ganttchartHelper.ejGanttChart("updateVirtualization", model.enableVirtualization, this._totalCollapseRecordCount);
                        proxy._refreshConnectorLines(false, true, true);
                        break;
                }
            }
        },

        _updateResourcesData: function (updatedResources) {
            var proxy = this, model = proxy.model, ganttObj, columnIndex = -1,
                columns = proxy.getColumns(),
                flatRecords;
            model.resources = $.extend(true, [], updatedResources);
            this._resourceCollection = model.resources;
            $.each(columns, function (index, column) {
                if (column.mappingName == model.resourceInfoMapping) {
                    columnIndex = index;
                    return;
                }
            });
            if (columnIndex > -1) columns[columnIndex]["dropdownData"] = model.resources;
            flatRecords = model.flatRecords.slice();
            flatRecords.reverse();
            ganttObj = ej.Gantt.GanttRecord.prototype;
            $.each(flatRecords, function (index, record) {
                if (record.resourceInfo && record.resourceInfo.length > 0) {                    
                    record.resourceInfo = ganttObj._setResourceInfo(record.item[model.resourceInfoMapping], model.resourceIdMapping, model.resourceNameMapping, model.resourceUnitMapping, model.resources);
                    proxy._updateResourceName(record);
                    proxy._updateResourceRelatedFields(record);
                    if (record.hasChildRecords) {
                        if (record.isAutoSchedule)
                            proxy._updateParentItem(record, null, true);
                        else if (!record.isAutoSchedule)
                            proxy._updateManualParentItem(record, null, true);
                    }
                    else
                        proxy.refreshGanttRecord(record);                   
                }                
            });            
        },
        /*To include or exclude serial number columns*/
        _updateSerialColumns: function () {
            var proxy = this, model = proxy.model,
                columns = model.columns, flatDatas = model.flatRecords;
            if (model.enableSerialNumber) {
                var columnSNO, predecessorColumn, sNoPredCol, tlength = flatDatas.length;
                for (var t = 0; t < tlength; t++) {
                    var flatData = flatDatas[t];
                    flatData.predecessorsName && proxy._$treegridHelper.ejTreeGrid("predecessorToSerialPredecessor", flatData);
                }
                //Hide the taskId columns
                $.map(columns, function (col) {
                    if (col.field == "taskId") {
                        col.visible = false;
                        return false;
                    }                   
                });
                // To insert SerialNumber column
                columnSNO = {
                    field: "serialNumber",
                    headerText: proxy._columnHeaderTexts["serialNumber"],
                    width: 40,
                    allowEditing: false,
                    allowSorting: false,
                    mappingName: "serialNumber",
                    showInColumnChooser: false
                }
                columns.splice(0, 0, columnSNO);
                //Remove default predecessor column and insert serial predecessor column
                predecessorColumn = columns.filter(function (col) {
                    return col && col.field == "predecessor";
                });
                sNoPredCol = {
                    field: "serialNumberPredecessor",
                    headerText: proxy._columnHeaderTexts["predecessor"],
                    width: 150,
                    editType: ej.Gantt.EditingType.String,
                    mappingName: "serialNumberPredecessor",
                    allowCellSelection: true
                }                
                columns.splice(columns.indexOf(predecessorColumn[0]), 1, sNoPredCol);
            }
            else {
                var sNoCol, predColumn, sNoPredCol;
                //Show the taskId columns
                $.map(columns, function (col) {
                    if (col.field == "taskId") {
                        col.visible = true;
                        return false;
                    }                    
                });
                //Remove the serial number column
                sNoCol = columns.filter(function (col) {
                    return col && col.field == "serialNumber";
                });
                columns.splice(columns.indexOf(sNoCol[0]), 1);
                //Remove serial predecessor column and insert default predecessor column
                sNoPredCol = columns.filter(function (col) {
                    return col && col.field == "serialNumberPredecessor";
                });                
                predColumn = {
                    field: "predecessor",
                    headerText: proxy._columnHeaderTexts["predecessor"],
                    width: 150,
                    editType: ej.Gantt.EditingType.String,
                    mappingName: model.predecessorMapping,
                    allowCellSelection: true
                }
                columns.splice(columns.indexOf(sNoPredCol[0]), 1, predColumn);
            }
        },
        //To change schedule mode of gantt on chart side
        _changeChartSchedule: function (headerType) {
            var proxy = this, model = proxy.model,
                startDate = proxy._getDateFromFormat(model.scheduleStartDate),
                endDate = proxy._getDateFromFormat(model.scheduleEndDate);
            switch (headerType) {
                case ej.Gantt.ScheduleHeaderType.Week:
                    model.scheduleHeaderSettings.scheduleHeaderType = ej.Gantt.ScheduleHeaderType.Week;
                    proxy._perDayWidth = 30;
                    break;
                case ej.Gantt.ScheduleHeaderType.Day:
                    model.scheduleHeaderSettings.scheduleHeaderType = ej.Gantt.ScheduleHeaderType.Day;
                    proxy._perHourWidth = 20;
                    if (model.workingTimeScale == ej.Gantt.workingTimeScale.TimeScale24Hours)
                        proxy._perDayWidth = (proxy._perHourWidth * 24);//24 hours
                    else if (model.workingTimeScale == ej.Gantt.workingTimeScale.TimeScale8Hours)
                        proxy._perDayWidth = (proxy._perHourWidth * 24);//9 hours
                    break;
                case ej.Gantt.ScheduleHeaderType.Month:
                    model.scheduleHeaderSettings.scheduleHeaderType = ej.Gantt.ScheduleHeaderType.Month;
                    proxy._perDayWidth = 10;
                    proxy._perWeekWidth = 70;
                    break;
                case ej.Gantt.ScheduleHeaderType.Year:
                    model.scheduleHeaderSettings.scheduleHeaderType = ej.Gantt.ScheduleHeaderType.Year;
                    proxy._perDayWidth = 3;
                    proxy._perMonthWidth = 90;
                    break;
                case ej.Gantt.ScheduleHeaderType.Hour:
                    model.scheduleHeaderSettings.scheduleHeaderType = ej.Gantt.ScheduleHeaderType.Hour;
                    var minutesPerInterval = model.scheduleHeaderSettings.minutesPerInterval,
                        intervalValue = ej.Gantt.minutesPerInterval;
                    proxy._perMinuteWidth = 20;
                    if (minutesPerInterval) {
                        if (minutesPerInterval == intervalValue.Auto) {
                            var twoDaysTimeSpan = 2 * 86400000,// Time in milliseconds
                                sevenDaysTimeSpan = 7 * 86400000,//Time in milliseconds
                                tenDaysTimeSpan = 10 * 86400000,
                                diff = endDate - startDate;
                            if (diff > tenDaysTimeSpan) {
                                proxy._minuteInterval = 30;
                                proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 2);//24 hours
                            }
                            else if (diff > sevenDaysTimeSpan) {
                                proxy._minuteInterval = 15;
                                proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 4);//24 hours
                            }
                            else if (diff > twoDaysTimeSpan) {
                                proxy._minuteInterval = 5;
                                proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 12);//24 hours
                            }
                            else {
                                proxy._minuteInterval = 1;
                                proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 60);//24 hours
                            }
                        }
                        else if (minutesPerInterval == intervalValue.OneMinute) {
                            proxy._minuteInterval = 1;
                            proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 60);
                        }
                        else if (minutesPerInterval == intervalValue.FiveMinutes) {
                            proxy._minuteInterval = 5;
                            proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 12);//24 hours
                        }
                        else if (minutesPerInterval == intervalValue.FifteenMinutes) {
                            proxy._minuteInterval = 15;
                            proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 4);//24 hours
                        }
                        else if (minutesPerInterval == intervalValue.ThirtyMinutes) {
                            proxy._minuteInterval = 30;
                            proxy._perDayWidth = (proxy._perMinuteWidth * 24 * 2);//24 hours
                        }
                    }
                    break;
            }                        
            proxy._updateModelsWidth();
            //Re render the gantt chart side alone
            proxy.updateScheduleDates(model.scheduleStartDate, model.scheduleEndDate);
        },        
        //Change work unit for whole project using set model.
        _updateWorkUnit: function () {
            var proxy = this, model = proxy.model,
                flatRecords = model.flatRecords,              
                currentViewData = proxy.getCurrentViewData(),
                treegridObject = proxy._$treegridHelper.ejTreeGrid("instance");
            treegridObject.model.workUnit = proxy._workUnitTexts[model.workUnit];
            for (var index = 0; index < flatRecords.length; index++) {
                var record = flatRecords[index],
                    currentRecordIndex = currentViewData.indexOf(record);
                record._updateWorkWithDuration(proxy);
                if (record.parentItem)
                    proxy._updateParentItem(record);
                if (currentRecordIndex != -1)
                    ej.TreeGrid.refreshRow(treegridObject, currentRecordIndex);
            }
        },
        /*Method to update the data source for resource view Gantt*/
        _resourceDataBindingForSetModel: function () {
            var proxy = this, model = proxy.model;

            if ((model.resourceIdMapping.length > 0 && model.resources && model.resources.length > 0) ||
                (model.groupIdMapping && model.groupIdMapping.length > 0 && model.groupCollection && model.groupCollection.length > 0)) {
                proxy._isFlatResourceData = true;
                proxy._groupCollection = model.groupCollection;
                proxy._resourceCollection = model.resources;
            }
            else {
                proxy._isFlatResourceData = false;
            }

            if (!model.resourceIdMapping)
                model.resourceIdMapping = "eResourceId";
            if (!model.groupIdMapping)
                model.groupIdMapping = "eGroupId";
            if (!model.resourceInfoMapping)
                model.resourceInfoMapping = "eResourceInfo";

            if (proxy.dataSource() == null) {
                proxy.dataSource([]);
            }
            if (proxy.dataSource() instanceof ej.DataManager) {
                var query = proxy._columnToSelect();
                var queryPromise = proxy.dataSource().executeQuery(query);
                queryPromise.done(ej.proxy(function (e) {
                    proxy._retrivedData = e.result;
                    if (proxy._isFlatResourceData) {
                        proxy._reConstructResourceData(proxy._retrivedData);
                    }
                    else {
                        proxy.secondaryDatasource = proxy._retrivedData;
                    }
                    proxy._createResourceRecords(proxy.secondaryDatasource);
                    proxy._refreshGanttWithNewRecords();
                }));
            }
            else if (proxy.dataSource().length > 0 || (model.resources && model.resources.length > 0)) {

                //Self-reference for resource view Gantt
                if (proxy._isFlatResourceData) {
                    var secondaryDatasource = proxy._reConstructResourceData(proxy.dataSource());
                    proxy._createResourceRecords(secondaryDatasource);
                } else {
                    proxy._createResourceRecords(proxy.dataSource());
                }
                proxy._refreshGanttWithNewRecords();
            } else {
                proxy._refreshGanttWithNewRecords();
            }
        },

        /*Data binding method for dynamic update of dataSource*/
        _dataBindingForSetModel: function () {
            var proxy = this, model = proxy.model;
            if (this.dataSource() == null) {
                this.dataSource([]);
            }
            if (this.dataSource() instanceof ej.DataManager) {
                var query = this._columnToSelect();
                var queryPromise = this.dataSource().executeQuery(query);
                queryPromise.done(ej.proxy(function (e) {
                    proxy._retrivedData = e.result;
                    if ((model.taskIdMapping.length > 0) && (model.parentTaskIdMapping.length > 0)) {
                        var dataArray = proxy._retrivedData, data = [];
                        proxy._taskIds = [];
                        for (var i = 0; i < dataArray.length; i++) {
                            var tempData = dataArray[i];
                            data.push($.extend(true, {}, tempData));
                            if (tempData[model.taskIdMapping]) proxy._taskIds.push(tempData[model.taskIdMapping]);
                        }

                        if (!model.childMapping) model.childMapping = "Children";
                        proxy._reconstructDatasource(data);                     
                    }
                    else {
                        proxy.secondaryDatasource = proxy._retrivedData;
                    }
                    proxy._createGanttRecords(proxy.secondaryDatasource);
                    proxy._refreshGanttWithNewRecords();
                }));
            }
            else if (this.dataSource().length > 0) {
                if ((model.taskIdMapping.length > 0) && (model.parentTaskIdMapping.length > 0)) {
                    var dataArray = proxy.dataSource(), data = [];
                    proxy._taskIds = [];
                    for (var i = 0; i < dataArray.length; i++) {
                        var tempData = dataArray[i];
                        data.push($.extend(true, {}, tempData));
                        if (tempData[model.taskIdMapping]) proxy._taskIds.push(tempData[model.taskIdMapping]);
                    }

                    if (!model.childMapping) model.childMapping = "Children";
                    proxy._reconstructDatasource(data);
                    proxy._createGanttRecords(proxy.secondaryDatasource);
                }
                else {
                    proxy._createGanttRecords(this.dataSource());
                }
                this._refreshGanttWithNewRecords();
            } else {
                this._refreshGanttWithNewRecords();
            }
            if (model.expandStateMapping)
                proxy._collapseRecordOnLoad();
        },
        /*Refresh all Gantt rows on new data source update*/
        _refreshGanttWithNewRecords: function () {
            var proxy = this,
                model = this.model,
                args = {};
            this._updatePredecessors();
            model.predecessorMapping && model.enablePredecessorValidation && proxy._updatedRecordsDateByPredecessor();
            if (!ej.isNullOrUndefined(this.isProjectViewData)) {
                this._calculateScheduleDates();
                this.updateScheduleDates(model.scheduleStartDate, this.model.scheduleEndDate);
                this._checkDataManagerUpdate();
                var treeGridObj = proxy._$treegridHelper.ejTreeGrid("instance");
                treeGridObj._isDataManagerUpdate = treeGridObj.model.dataManagerUpdate.isDataManagerUpdate = proxy._isDataManagerUpdate;
                treeGridObj._jsonData = treeGridObj.model.dataManagerUpdate.jsonData = proxy._jsonData;
                model.viewType = ej.Gantt.ViewType.HistogramView;
                this._checkHistoGramDataBinding();
            }
            this._$treegridHelper.ejTreeGrid("setUpdatedRecords", model.flatRecords, model.updatedRecords, model.ids, model.parentRecords, this.dataSource());
            this._$treegridHelper.ejTreeGrid("processBindings");
            proxy.model.updatedRecords = proxy.getUpdatedRecords();
            proxy.model.currentViewData = proxy.getCurrentViewData();
            proxy._gridRows = proxy.getRows();
            proxy._totalCollapseRecordCount = proxy._$treegridHelper.ejTreeGrid("getCollapsedRecordCount");
            this._$ganttchartHelper.ejGanttChart("setUpdatedRecords", model.currentViewData, model.updatedRecords, model.flatRecords, model.ids);
            if (model.viewType != ej.Gantt.ViewType.HistogramView) {
                this._calculateScheduleDates();
                this.updateScheduleDates(model.scheduleStartDate, this.model.scheduleEndDate);
            }
            else {
                proxy._$ganttchartHelper.ejGanttChart("refreshContainersWidth");
                proxy._$ganttchartHelper.ejGanttChart("refreshHelper", proxy.model.currentViewData, proxy.model.updatedRecords, proxy._totalCollapseRecordCount);
                proxy._$ganttchartHelper.ejGanttChart("instance")._$bodyContainer.ejScroller("refresh");
            }
            args.requestType = ej.TreeGrid.Actions.Refresh;
            proxy._$treegridHelper.ejTreeGrid("sendDataRenderingRequest", args);
            if (proxy.model.viewType == ej.Gantt.ViewType.ResourceView) {
                proxy._$treegridHelper.ejTreeGrid("updateHeight");
                this._updateResourceColumn(); //update resource column with new resource info mapping values
            }
            if (model.viewType != ej.Gantt.ViewType.HistogramView) {
                this._checkDataManagerUpdate();
                var treeGridObj = proxy._$treegridHelper.ejTreeGrid("instance");
                treeGridObj._isDataManagerUpdate = treeGridObj.model.dataManagerUpdate.isDataManagerUpdate = proxy._isDataManagerUpdate;
                treeGridObj._jsonData = treeGridObj.model.dataManagerUpdate.jsonData = proxy._jsonData;
            }
            this._isFromSetModel = false;
        },
        /*Method to update the data source dynamically*/
        _refreshDataSource: function (dataSource) {
            var proxy = this;
            this.resetModelCollections();
            this.dataSource(dataSource);
            this._isFromSetModel = true;
            proxy.secondaryDatasource = [];
            proxy._retrivedData = this.dataSource();
            if (proxy.model.viewType == ej.Gantt.ViewType.ResourceView) {
                proxy._resourceChildTasks = [];
                proxy._groupIds = [];
                proxy._resourceIds = [];
                proxy._resourceCollection = [];
                proxy._groupCollection = [];
                this._resourceUniqTasks = [];
                this._resourceUniqTaskIds = [];
                this._resourceDataBindingForSetModel();
            } else {
                this._dataBindingForSetModel();
            }
        },

        /*Method to update resource info mapping column on data source switching in resource view*/
        _updateResourceColumn: function () {
            for (var i = 0; i < this._resourceViewColumns.length; i++) {
                if (this._resourceViewColumns[i].field == "resourceInfo") {
                    this._resourceViewColumns[i]["mappingName"] = this.model.resourceInfoMapping;
                    this._resourceViewColumns[i]["dropdownData"] = this._resourceCollection;
                    break;
                }
            }
        },

        resetModelCollections: function () {
            var proxy = this,
                model = proxy.model;
            model.dataSource = [];
            model.flatRecords = [];
            model.parentRecords = [];
            model.updatedRecords = [];
            model.ids = [];
            model.scheduleStartDate = model.scheduleStartDate;
            model.scheduleEndDate = model.scheduleEndDate;
            proxy._storedIndex = -1;
            proxy._lastInsertedId = -1;
            proxy.selectedRowIndex(-1);
            proxy._predecessorsCollection = [];
            proxy._serialCount = 0;
        },
        /* refresh holidays collections */
        _refreshHolidays: function () {
            var proxy = this,
                model = this.model, updatedDates;
            proxy._holidaysList = proxy._getHoliday();
            proxy._stringHolidays = proxy._getStringHolidays();

            updatedDates = proxy._updateScheduleDatesByHolidays(new Date(proxy._projectStartDate), new Date(proxy._projectEndDate));
            if (updatedDates.startDate.getTime() !== proxy._projectStartDate.getTime() || updatedDates.endDate.getTime() !== proxy._projectEndDate.getTime()) {
                var ganttObject = proxy._$ganttchartHelper.data("ejGanttChart");
                ganttObject.model.holidays = model.holidays;
                proxy.updateScheduleDates(updatedDates.startDate, updatedDates.endDate);
            }
            else {
                /* prevent refresh parent Item on update the child records */
                proxy._isTreeGridRendered = false;
                proxy._isGanttChartRendered = false;

                /* Update Left and Width Value of all records with new holidays*/
                proxy._updateGanttRecords();

                proxy._$ganttchartHelper.ejGanttChart("refreshHelper", proxy.model.currentViewData, proxy.model.updatedRecords, proxy._totalCollapseRecordCount);
                /* refresh the connector line collection */
                if (model.predecessorMapping) {
                    proxy._refreshConnectorLines(false, true, true);
                }
                /*refresh the holiday container */
                this._$ganttchartHelper.ejGanttChart("refreshHolidays", model.holidays);
                proxy._isTreeGridRendered = true;
                proxy._isGanttChartRendered = true;
            }

            /* refresh chart and Treegrid part */
            proxy._$treegridHelper.ejTreeGrid("renderRecords");
        },

        /* refreh the strip lines collection */
        _updateStripLines : function()
        {
            var proxy = this, model = this.model, updatedDates;

            updatedDates = proxy._updateScheduleDatesByStripLines(new Date(proxy._projectStartDate), new Date(proxy._projectEndDate));

            if (updatedDates.startDate.getTime() !== proxy._projectStartDate.getTime() || updatedDates.endDate.getTime() !== proxy._projectEndDate.getTime()) {
                var ganttObject = proxy._$ganttchartHelper.data("ejGanttChart");
                ganttObject.model.stripLines = model.stripLines;
                proxy.updateScheduleDates(updatedDates.startDate, updatedDates.endDate);
            }
            else {
                this._$ganttchartHelper.ejGanttChart("refreshStripLines", this.model.stripLines);
            }
        },
        _updateWeekendBackground: function (bgcolor) {
            var proxy = this;
            this.model.weekendBackground = bgcolor;
            proxy._$ganttchartHelper.ejGanttChart("updateWeekendBackground", bgcolor);

        },
        _updateNonWorkingBackground: function (color) {
            var proxy = this;
            proxy.model.nonWorkingBackground = color;
            proxy._$ganttchartHelper.ejGanttChart("updateNonWorkingBackground", color);
        },
        _updateHighlightNonWorkingTime: function (bool) {
            var proxy = this;
            proxy.model.highlightNonWorkingTime = bool;
            proxy._$ganttchartHelper.ejGanttChart("updateHighlightNonWorkingTime", bool);
        },

        _updateHighlightWeekends: function (bool) {
            var proxy = this;
            this.model.highlightWeekends = bool;
            proxy._$ganttchartHelper.ejGanttChart("updateHighlightWeekends", bool);
        },

        _updateReadOnly:function(bool){
            var proxy = this;
            proxy._$treegridHelper.ejTreeGrid("updateReadOnly", bool);
            proxy._$ganttchartHelper.ejGanttChart("updateReadOnly", bool);
            proxy._updateToolbarOptions();
        },
        _updateShowGridCellTooltip: function (bool) {
            var proxy = this;
            proxy._$treegridHelper.ejTreeGrid("updateShowGridCellTooltip", bool);
        },

        _updateShowGridExpandCellTooltip: function (bool) {
            var proxy = this;
            proxy._$treegridHelper.ejTreeGrid("updateShowGridExpandCellTooltip", bool);
        },

        _updateSelectedItem: function (item) {
            var proxy = this,
                args = {};
            if (item[proxy.model.taskIdMapping] != null) {


                args.recordIndex =proxy.model.ids.indexOf((item[proxy.model.taskIdMapping]).toString());
                args.item = proxy.model.flatRecords[args.recordIndex];
                args.target = "ejTreeGrid";
                proxy.rowSelected(args);
                proxy._$treegridHelper.ejTreeGrid("selectRows", args.recordIndex);
                proxy._$ganttchartHelper.ejGanttChart("selectRows", args.recordIndex);
                proxy._$ganttchartHelper.ejGanttChart("updateSelectedItem", args.recordIndex);
            }
        },

        /* udpate allowKeyboardNavigation API value in treegrid and chart side */
        _updateAllowKeyboardNavigation: function (bool) {
            var proxy = this;
            proxy._$treegridHelper.ejTreeGrid("updateAllowKeyboardNavigation", bool);
            proxy._$ganttchartHelper.ejGanttChart("updateAllowKeyboardNavigation", bool);
        },
        
        _updateAllowColumnResize: function (bool) {
            var proxy = this;
            proxy._$treegridHelper.ejTreeGrid("updateAllowColumnResize", bool);
        },
        
        _updateProgressbarHeight: function (height) {
            var proxy = this;
            this.model.progressbarHeight = height;
            proxy._$ganttchartHelper.ejGanttChart("updateProgressbarHeight", height);
        },
        
        _updateBaselineColor: function (color) {
            var proxy = this;
            this.model.baselineColor = color;
            proxy._$ganttchartHelper.ejGanttChart("updateBaselineColor", color);
        },
        
        _showBaselineColumns: function () {
            var proxy = this, model = proxy.model, column, mapping;
            /*If renderBaseline enabled baseline columns  are added*/
            if (model.renderBaseline && model.baselineStartDateMapping && model.baselineEndDateMapping) {

                mapping = model.baselineStartDateMapping;
                if (mapping.length) {
                    column = {
                        field: "baselineStartDate",
                        headerText: proxy._columnHeaderTexts["baselineStartDate"],
                        width: 150,
                        editType: (model.dateFormat.toLowerCase().indexOf("hh") == -1) ?
                             ej.Gantt.EditingType.DatePicker : ej.Gantt.EditingType.DateTimePicker,
                        mappingName: mapping,
                        format: "{0:" + model.dateFormat + "}",
                        allowEditing: true,
                        allowCellSelection: true
                    };
                    proxy._columns.push(column);
                }
                mapping = model.baselineEndDateMapping;

                if (mapping.length) {
                    column = {
                        field: "baselineEndDate",
                        headerText: proxy._columnHeaderTexts["baselineEndDate"],
                        width: 150,
                        editType: (model.dateFormat.toLowerCase().indexOf("hh") == -1) ?
                             ej.Gantt.EditingType.DatePicker : ej.Gantt.EditingType.DateTimePicker,
                        mappingName: mapping,
                        format: "{0:" + model.dateFormat + "}",
                        allowEditing: true,
                        allowCellSelection: true
                    };
                    proxy._columns.push(column);
                }
            }
        },
        _updateRenderBaseline: function (bool) {
            var proxy = this, model=proxy.model;
            this.model.renderBaseline = bool;
            proxy._$ganttchartHelper.ejGanttChart("updateRenderBaseline", bool);
            //Show Baseline columns in TreeGrid Side.
            if (model.renderBaseline) {
                proxy._showBaselineColumns();
                proxy._trigger("load");
            }
            //Delete Baseline Columns From TreeGrid.
            if (!model.renderBaseline) {
                var baselineStartDateColumIndex = proxy._getbaselineColumnIndex(proxy._columns).indexOf("baselineStartDate");
                proxy._columns.splice(baselineStartDateColumIndex, 1);
                var baselineEndDateColumIndex = proxy._getbaselineColumnIndex(proxy._columns).indexOf("baselineEndDate");
                proxy._columns.splice(baselineEndDateColumIndex, 1);
            }
            //Update Column Collection of Gantt in TreeGrid side.
            proxy._$treegridHelper.ejTreeGrid("updateColumns", proxy._columns);            
        },
        // to get the column fields as an array collection to find particular column index
        _getbaselineColumnIndex: function (columns) {
            var proxy = this, columnIndexArray = [];
            for (var i = 0; i < columns.length; i++) {
                columnIndexArray[i] = columns[i].field;
            }
            return columnIndexArray;
        },
        _updateRenderTaskNames: function (bool) {
            var proxy = this;
            this.model.showTaskNames = bool;
            proxy._$ganttchartHelper.ejGanttChart("updateRenderTaskNames", bool);
        },
        _refreshLeftTaskLabelMapping: function (leftLabel) {
            var proxy = this;
            this.model.leftTaskLabelMapping = leftLabel;
            proxy._$ganttchartHelper.ejGanttChart("refreshLeftTaskLabelMapping", leftLabel);
        },
        _refreshRightTaskLabelMapping: function (rightLabel) {
            var proxy = this;
            this.model.rightTaskLabelMapping = rightLabel;
            proxy._$ganttchartHelper.ejGanttChart("refreshRightTaskLabelMapping", rightLabel);
        },
        _refreshLeftTaskLabelTemplate: function (leftLabelTemplate) {
            var proxy = this;
            this.model.leftTaskLabelTemplate = leftLabelTemplate;
            proxy._$ganttchartHelper.ejGanttChart("refreshLeftTaskLabelTemplate", leftLabelTemplate);
        },
        _refreshRightTaskLabelTemplate: function (rightLabelTemplate) {
            var proxy = this;
            this.model.rightTaskLabelTemplate = rightLabelTemplate;
            proxy._$ganttchartHelper.ejGanttChart("refreshRightTaskLabelTemplate", rightLabelTemplate);
        },
        
        _updateRendeProgressStatus: function (bool) {
            var proxy = this;
            this.model.showProgressStatus = bool;
            proxy._$ganttchartHelper.ejGanttChart("updateRendeProgressStatus", bool);
        },
        
        _updateRenderResourceNames: function (bool) {
            var proxy = this;
            this.model.showResourceNames = bool;
            proxy._$ganttchartHelper.ejGanttChart("updateRenderResourceNames", bool);
        },
        
        _updateTaskbarBackground: function (bgcolor) {
            var proxy = this;
            this.model.taskbarBackground = bgcolor;
            proxy._$ganttchartHelper.ejGanttChart("updateTaskbarBackground", bgcolor);
        },

        _updateProgressbarBackground: function (bgcolor) {
            var proxy = this;
            this.model.progressbarBackground = bgcolor;
            proxy._$ganttchartHelper.ejGanttChart("updateProgressbarBackground", bgcolor);
        },

        _updateParentTaskbarBackground: function (bgcolor) {
            var proxy = this;
            this.model.parentTaskbarBackground = bgcolor;
            proxy._$ganttchartHelper.ejGanttChart("updateParentTaskbarBackground", bgcolor);
        },

        _updateParentProgressbarBackground: function (bgcolor) {
            var proxy = this;
            this.model.parentProgressbarBackground = bgcolor;
            proxy._$ganttchartHelper.ejGanttChart("updateParentProgressbarBackground", bgcolor);
        },
        
        _updateEditSettings: function (edit) {
            var proxy = this;
            proxy._$ganttchartHelper.ejGanttChart("updateEditSettings", edit);
            proxy._$treegridHelper.ejTreeGrid("updateEditSettings", edit);
            proxy._updateToolbarOptions();
            
        },
        
        _updateRowSelection: function (bool) {
            var proxy = this;
            proxy._$treegridHelper.ejTreeGrid("updateRowSelection", bool);
        },

        _updateAltRow: function (bool) {
            var proxy = this;
            proxy._$treegridHelper.ejTreeGrid("option", "enableAltRow", bool);
        },

        //Insert templated row in DOM for newly added record
        _renderAddedRow: function (index, data)
        {
            var proxy = this, model = this.model;
            model.currentViewData = proxy._$treegridHelper.ejTreeGrid("getUpdatedCurrentViewData");
            proxy._$ganttchartHelper.ejGanttChart("setUpdatedRecords", model.currentViewData, model.updatedRecords, model.flatRecords, model.ids);

            if (data.eResourceTaskType != "resourceChildTask") {
                if (model.enableVirtualization) {
                    var tempArgs = {};
                    tempArgs.requestType = ej.TreeGrid.Actions.Refresh;
                    proxy._$treegridHelper.ejTreeGrid("sendDataRenderingRequest", tempArgs);
                    proxy._$ganttchartHelper.ejGanttChart("refreshHelper", model.currentViewData, model.updatedRecords, proxy._totalCollapseRecordCount);
                }
                else {
                    proxy._$treegridHelper.ejTreeGrid("renderNewAddedRow", index, data);
                    proxy._$ganttchartHelper.ejGanttChart("renderNewAddedRow", index, data);
                }
            }
            proxy._$treegridHelper.ejTreeGrid("updateHeight");
            proxy._gridRows = proxy.getRows();
            proxy._ganttChartRows = proxy.getGanttChartRows();
        },
        
        /* get visible child record count in udpated records */
        _getVisibleChildRecordCount:function(data,count,collection)
        {
            var proxy = this, model = this.model, childRecords, length;

            if (data.hasChildRecords) {
                childRecords = data.childRecords;
                length = childRecords.length;
                for (var i = 0; i < length; i++) {
                    if (collection.indexOf(childRecords[i]) !== -1)
                        count++;
                    if (childRecords[i].hasChildRecords) {
                        count = proxy._getVisibleChildRecordCount(childRecords[i], count, collection);
                    }
                }
            }
            else {
                if (collection.indexOf(data) !== -1) {
                    count++;
                }
            }
            return count;
        },

        openAddDialog: function () {
            this.cancelEditCell();
            this._sendAddRequest();
        },

        
        openEditDialog: function () {
            this.cancelEditCell();
            this._sendEditRequest();
        },
        
        
        searchItem: function (searchString) {
            var proxy = this;
            proxy.cancelEditCell();
            if (proxy._searchString != searchString) {
                proxy._$treegridHelper.ejTreeGrid("search", searchString);
                proxy._searchString = searchString;
                $("#gantt_search input").val(searchString);
            }
        },
        //public method to select multiple rows
        selectMultipleRows: function (rowIndex) {
            var proxy = this, model = proxy.model, updatedRecords,
                treeObj = proxy._$treegridHelper.ejTreeGrid("instance"),
                chartObj = proxy._$ganttchartHelper.ejGanttChart("instance");
            if (model.selectionMode == "cell" || model.selectionType == ej.Gantt.SelectionType.Single || ej.isNullOrUndefined(rowIndex))
                return;
            if (rowIndex.length != 0)
                proxy.clearSelection();
            updatedRecords = proxy.getUpdatedRecords();
            for (var i = 0; i < rowIndex.length; i++) {
                if (!ej.isNullOrUndefined(updatedRecords[rowIndex[i]]) && (!model.enableVirtualization && proxy.getExpandStatus(updatedRecords[rowIndex[i]]) || model.enableVirtualization)){
                    if (!treeObj._rowSelectingEventTrigger(this.selectedRowIndex(), rowIndex[i])) {
                        chartObj._multiSelectCtrlRequest = treeObj._multiSelectCtrlRequest = true;
                        proxy._$treegridHelper.ejTreeGrid("selectRows", rowIndex[i]);
                        treeObj._rowSelectedEventTrigger(rowIndex[i]);
                    }
                }
            }
            chartObj._multiSelectCtrlRequest = treeObj._multiSelectCtrlRequest = false;
        },
        
        
        addRecord: function (data, rowPosition) {
            var proxy = this, model = this.model,
                selectedRowIndex = model.selectionMode == "row" ? this.selectedRowIndex() : proxy._rowIndexOfLastSelectedCell,
                selectedItem = model.updatedRecords[selectedRowIndex], _cAddedRecord,
                taskIdMapping = model.taskIdMapping,
                updatedRecords = model.updatedRecords,
                flatRecords = model.flatRecords,
                parentRecords = model.parentRecords,
                ids = model.ids,
                dataSource = this.dataSource(), dataChildCount,
                level = 0, insertIndex, validateArgs = {},
                parentItem, nextBelowItemInflatRecords, nextBelowItemInUpdatedRecords;
            proxy.clearSelection();
            /* clear if treegrid is in edit state*/
            proxy.cancelEditCell();
            if ($.type(dataSource) !== "array" && !(dataSource instanceof ej.DataManager))
            {
                this.dataSource([]);
                dataSource = this.dataSource();
            }
            if (Object.prototype.toString.call(data) !== "[object Object]") {
                data = {};
            }

            if (selectedRowIndex === -1 && (rowPosition === ej.Gantt.RowPosition.AboveSelectedRow
                 || rowPosition === ej.Gantt.RowPosition.BelowSelectedRow
                 || rowPosition === ej.Gantt.RowPosition.Child) || !rowPosition) {
                rowPosition = ej.Gantt.RowPosition.Top;
            }
            if (model.viewType == ej.Gantt.ViewType.ResourceView && (rowPosition !== ej.Gantt.RowPosition.Top && rowPosition !== ej.Gantt.RowPosition.Bottom))
                rowPosition = ej.Gantt.RowPosition.Top;
            /*Validate Task Id of data*/
            if (data[taskIdMapping]) {
                var idValues = model.viewType == "projectView" ? model.ids : this._resourceUniqTaskIds;
                if (idValues.indexOf(data[taskIdMapping].toString()) != -1 && !this._isOnResourceUpdate) {
                    data[taskIdMapping] = null;
                } else {
                    data[taskIdMapping] = isNaN(parseInt(data[taskIdMapping])) ? null : parseInt(data[taskIdMapping]);
                }
            }

            //Add default value for missing fields
            proxy._updateAddData(data, rowPosition);
            //get updated json data of data manager from TreeGrid 
            if (proxy._isDataManagerUpdate)
                proxy._jsonData = proxy._$treegridHelper.ejTreeGrid("getUpdatedDataManagerData");
            if (model.viewType == ej.Gantt.ViewType.ResourceView && data[model.resourceInfoMapping] && data[model.resourceInfoMapping].length > 0) {
                _cAddedRecord = proxy._createGanttRecord(data, 1);
                var resource = data[model.resourceInfoMapping],
                    length = resource.length;
                for(var i=0;i< length;i++)
                {
                    var record = flatRecords[ids.indexOf("R_" + resource[i])];
                    if(record)
                    {
                        var addedRecord = new ej.Gantt.GanttRecord();
                        addedRecord = $.extend(true, addedRecord, _cAddedRecord)
                        addedRecord.item = _cAddedRecord.item; //item value was same for all resource shared tasks
                        if (i == 0) {
                            this._updateResourceUniqIndex(addedRecord);
                        }
                        addedRecord.eResourceTaskType = "resourceChildTask";
                        addedRecord.level = record.level;
                        addedRecord.parentItem = record;
                        record.eResourceChildTasks.push(addedRecord);
                        this._resourceChildTasks.push(addedRecord);
                        this._updateOverlappingValues(addedRecord.parentItem);
                        this._updateResourceParentItem(addedRecord);
                        proxy.refreshGanttRecord(addedRecord.parentItem);
                        this._updateSharedResourceTask(addedRecord);
                        if (i == length - 1) {
                            if (proxy._isDataManagerUpdate && this._isFlatResourceData) {
                                this._jsonData.push(addedRecord.item);
                            }
                            else {
                                proxy._isFlatResourceData ? dataSource.push(addedRecord.item) : record.item[model.taskCollectionMapping].push(addedRecord.item);
                            }
                            this._refreshGanttHeightWithRecords();
                        }
                    }
                }
                _cAddedRecord = addedRecord ? addedRecord : _cAddedRecord;
            }
            else {
                switch (rowPosition) {
                    case ej.Gantt.RowPosition.Top:
                        level = 0;
                        parentItem = null;
                        _cAddedRecord = proxy._createGanttRecord(data, level)
                        if(model.viewType == ej.Gantt.ViewType.ResourceView){
                            _cAddedRecord.eResourceName = this._unassignedText;
                            _cAddedRecord.eResourceTaskType = "unassignedTask";
                            this._updateResourceUniqIndex(_cAddedRecord);
                        }
                        _cAddedRecord.index = _cAddedRecord.taskId;

                        //validate predecessor of new record
                        validateArgs.data = data;
                        validateArgs.currentRecord = _cAddedRecord;
                        if (!proxy._validateAddRecordPrecessorValue(validateArgs) && proxy._isinAddnewRecord) {
                            return false;
                        }

                        /*record update*/
                        flatRecords.splice(0, 0, _cAddedRecord);
                        updatedRecords.splice(0, 0, _cAddedRecord);
                        ids.splice(0, 0, _cAddedRecord.taskId.toString());
                        parentRecords.splice(0, 0, _cAddedRecord);
                        /*data source update*/
                        if (proxy._isDataManagerUpdate) {
                            proxy._jsonData.splice(0, 0, _cAddedRecord.item);
                        } else {
                            dataSource.splice(0, 0, _cAddedRecord.item);
                        }
                        insertIndex = 0;
                        break;

                    case ej.Gantt.RowPosition.Bottom:
                        level = 0;
                        parentItem = null;
                        _cAddedRecord = proxy._createGanttRecord(data, level);
                        if (model.viewType == ej.Gantt.ViewType.ResourceView) {
                            _cAddedRecord.eResourceName = this._unassignedText;
                            _cAddedRecord.eResourceTaskType = "unassignedTask";
                            this._updateResourceUniqIndex(_cAddedRecord);
                        }
                        _cAddedRecord.index = _cAddedRecord.taskId;

                        //validate predecessor of new record
                        validateArgs.data = data;
                        validateArgs.currentRecord = _cAddedRecord;
                        if (!proxy._validateAddRecordPrecessorValue(validateArgs) && proxy._isinAddnewRecord) {
                            return false;
                        }

                        /*record update*/
                        flatRecords.push(_cAddedRecord);
                        updatedRecords.push(_cAddedRecord);
                        ids.push(_cAddedRecord.taskId.toString());
                        parentRecords.push(_cAddedRecord);
                        /*data source update*/
                        if (proxy._isDataManagerUpdate) {
                            proxy._jsonData.push(_cAddedRecord.item);
                        } else {
                            dataSource.push(_cAddedRecord.item);
                        }
                        insertIndex = updatedRecords.indexOf(_cAddedRecord);
                        break;

                    case ej.Gantt.RowPosition.AboveSelectedRow:
                        level = selectedItem.level;
                        parentItem = selectedItem.parentItem;
                        _cAddedRecord = proxy._createGanttRecord(data, level, parentItem);
                        _cAddedRecord.index = _cAddedRecord.taskId;

                        //validate predecessor of new record
                        validateArgs.data = data;
                        validateArgs.currentRecord = _cAddedRecord;
                        if (!proxy._validateAddRecordPrecessorValue(validateArgs) && proxy._isinAddnewRecord) {
                            return false;
                        }
                        var childIndex, recordIndex, updatedCollectionIndex;
                        /*Record Updates*/
                        recordIndex = flatRecords.indexOf(selectedItem);
                        updatedCollectionIndex = updatedRecords.indexOf(selectedItem);
                        flatRecords.splice(recordIndex, 0, _cAddedRecord);
                        updatedRecords.splice(updatedCollectionIndex, 0, _cAddedRecord);
                        ids.splice(recordIndex, 0, _cAddedRecord.taskId.toString());

                        if (!ej.isNullOrUndefined(parentItem)) {
                            childIndex = parentItem.childRecords.indexOf(selectedItem);
                            /*Child collection update*/
                            parentItem.childRecords.splice(childIndex, 0, _cAddedRecord);
                            if (!model.parentTaskIdMapping) {
                                parentItem.item[model.childMapping].splice(childIndex, 0, _cAddedRecord.item);
                            }
                            else {
                                _cAddedRecord.item[model.parentTaskIdMapping] = _cAddedRecord.parentItem.taskId;
                                if (proxy._isDataManagerUpdate) {
                                    proxy._jsonData.push(_cAddedRecord.item);

                                } else {
                                    dataSource.push(_cAddedRecord.item);
                                }
                            }
                        } else {
                            /* Parent records collection and data source update*/
                            parentRecords.splice(parentRecords.indexOf(selectedItem), 0, _cAddedRecord);
                            if (proxy._isDataManagerUpdate) {
                                proxy._jsonData.splice(proxy._jsonData.indexOf(selectedItem.item), 0, _cAddedRecord.item);
                            }
                            else {
                                dataSource.splice(dataSource.indexOf(selectedItem.item), 0, _cAddedRecord.item);
                            }
                        }
                        insertIndex = updatedCollectionIndex;
                        break;
                    case ej.Gantt.RowPosition.BelowSelectedRow:
                        level = selectedItem.level;
                        parentItem = selectedItem.parentItem;
                        _cAddedRecord = proxy._createGanttRecord(data, level, parentItem);
                        _cAddedRecord.index = _cAddedRecord.taskId;

                        //validate predecessor of new record
                        validateArgs.data = data;
                        validateArgs.currentRecord = _cAddedRecord;
                        if (!proxy._validateAddRecordPrecessorValue(validateArgs) && proxy._isinAddnewRecord) {
                            return false;
                        }

                        //find next item position
                        var currentItemIndex = flatRecords.indexOf(selectedItem)

                        if (selectedItem.hasChildRecords) {
                            dataChildCount = proxy._$treegridHelper.ejTreeGrid("getChildCount", selectedItem, 0);
                            recordIndex = currentItemIndex + dataChildCount + 1;
                            updatedCollectionIndex = updatedRecords.indexOf(selectedItem) + proxy._getVisibleChildRecordCount(selectedItem, 0, updatedRecords) + 1;

                        } else {
                            recordIndex = currentItemIndex + 1;
                            updatedCollectionIndex = updatedRecords.indexOf(selectedItem) + 1;
                        }

                        /* Record collection update */
                        flatRecords.splice(recordIndex, 0, _cAddedRecord);
                        updatedRecords.splice(updatedCollectionIndex, 0, _cAddedRecord);
                        ids.splice(recordIndex, 0, _cAddedRecord.taskId.toString());

                        /* data Source update */
                        if (!ej.isNullOrUndefined(parentItem)) {
                            childIndex = parentItem.childRecords.indexOf(selectedItem);
                            /*Child collection update*/
                            parentItem.childRecords.splice(childIndex + 1, 0, _cAddedRecord);
                            if (!model.parentTaskIdMapping) {
                                parentItem.item[model.childMapping].splice(childIndex + 1, 0, _cAddedRecord.item);
                            }
                            else {
                                _cAddedRecord.item[model.parentTaskIdMapping] = _cAddedRecord.parentItem.taskId;
                                if (proxy._isDataManagerUpdate) {
                                    proxy._jsonData.push(_cAddedRecord.item);

                                } else {
                                    dataSource.push(_cAddedRecord.item);
                                }
                            }
                        } else {
                            /* Parent records collection and data source update*/
                            parentRecords.splice(parentRecords.indexOf(selectedItem) + 1, 0, _cAddedRecord);
                            if (proxy._isDataManagerUpdate) {
                                proxy._jsonData.splice(proxy._jsonData.indexOf(selectedItem.item) + 1, 0, _cAddedRecord.item);
                            }
                            else {
                                dataSource.splice(dataSource.indexOf(selectedItem.item) + 1, 0, _cAddedRecord.item);
                            }
                        }
                        insertIndex = updatedCollectionIndex;
                        break;
                    case ej.Gantt.RowPosition.Child:
                        level = selectedItem.level + 1;
                        parentItem = selectedItem;
                        _cAddedRecord = proxy._createGanttRecord(data, level, parentItem);
                        _cAddedRecord.index = _cAddedRecord.taskId;

                        //validate predecessor of new record
                        validateArgs.data = data;
                        validateArgs.currentRecord = _cAddedRecord;
                        if (!proxy._validateAddRecordPrecessorValue(validateArgs) && proxy._isinAddnewRecord) {
                            return false;
                        }

                        //find next item position
                        var currentItemIndex = flatRecords.indexOf(selectedItem)

                        if (selectedItem.hasChildRecords) {
                            dataChildCount = proxy._$treegridHelper.ejTreeGrid("getChildCount", selectedItem, 0);
                            recordIndex = currentItemIndex + dataChildCount + 1;
                            //Expand Add record's parent item 
                            if (!selectedItem.expanded) {
                                var expanargs = {};
                                expanargs.expanded = true;
                                expanargs.data = selectedItem;
                                proxy._isInAdd = true;
                                proxy.expanding(expanargs);
                                proxy._isInAdd = false;
                                updatedRecords = proxy.getUpdatedRecords();
                            }
                            updatedCollectionIndex = updatedRecords.indexOf(selectedItem) + proxy._getVisibleChildRecordCount(selectedItem, 0, updatedRecords) + 1;

                        } else {
                            selectedItem.hasChildRecords = true;
                            selectedItem.childRecords = [];
                            selectedItem.expanded = true;
                            if (!model.parentTaskIdMapping) {
                                selectedItem.item[model.childMapping] = [];
                            }
                            selectedItem.isMilestone = false;
                            recordIndex = currentItemIndex + 1;
                            updatedCollectionIndex = updatedRecords.indexOf(selectedItem) + 1;
                            selectedItem.predecessor && proxy._updatePredecessorOnIndentOutdent(selectedItem);
                        }

                        /* Record collection update */
                        flatRecords.splice(recordIndex, 0, _cAddedRecord);
                        updatedRecords.splice(updatedCollectionIndex, 0, _cAddedRecord);
                        ids.splice(recordIndex, 0, _cAddedRecord.taskId.toString());

                        /* data Source update */
                        if (!ej.isNullOrUndefined(parentItem)) {
                            childIndex = parentItem.childRecords.indexOf(selectedItem);
                            /*Child collection update*/
                            parentItem.childRecords.splice(childIndex + 1, 0, _cAddedRecord);
                            if (!model.parentTaskIdMapping) {
                                parentItem.item[model.childMapping].splice(childIndex + 1, 0, _cAddedRecord.item);
                            }
                            else {
                                _cAddedRecord.item[model.parentTaskIdMapping] = _cAddedRecord.parentItem.taskId;
                                if (proxy._isDataManagerUpdate) {
                                    proxy._jsonData.push(_cAddedRecord.item);

                                } else {
                                    dataSource.push(_cAddedRecord.item);
                                }
                            }
                        }
                        insertIndex = updatedCollectionIndex;
                        break;
                }
            }

            //Clear previously selected Item
            proxy._deSelectRowItem()

            /*Updated record collections in treegrid side*/
            proxy._$treegridHelper.ejTreeGrid("setUpdatedRecords", model.flatRecords, model.updatedRecords, model.ids, model.parentRecords, this.dataSource());

            if (model.enableWBS && model.viewType == "projectView") {
                proxy.updateWBSdetails(_cAddedRecord);
            }
            //Serial Number Update
            if (model.viewType == "projectView") {
                proxy._$treegridHelper.ejTreeGrid("updateSerialNumber", insertIndex);
                model.enableSerialNumber && proxy._$treegridHelper.ejTreeGrid("updateSerialNumberPredecessors", insertIndex);
            }
            /* Trigger action complete event for further updated*/
            var eventArgs = {};
            eventArgs.requestType = "save";
            eventArgs._cAddedRecord = eventArgs.addedRecord = _cAddedRecord;
            eventArgs.index = insertIndex;
            proxy.actionComplete(eventArgs);
            /*Set flag for refresh newly added record in non virtalization mode*/
            var treeGridObject = proxy._$treegridHelper.ejTreeGrid("instance");
            if (model.enableVirtualization === false &&
                (treeGridObject.model.sortSettings.sortedColumns.length > 0 || treeGridObject._searchString.length > 0)) {
                proxy._isRefreshAddedRecord = true;
            }
            //Maintain index of newly added row to update scrollbar while selection mode is cell.
            if (model.selectionMode == "cell") {
                var selectedRowIndex = model.updatedRecords.indexOf(_cAddedRecord);
                proxy._$treegridHelper.ejTreeGrid("updateScrollBar", selectedRowIndex);
            }
            else
                /* scroll to new added record */
                proxy._$treegridHelper.ejTreeGrid("updateScrollBar");
            //For dialog add reference
            return true;
        },
        
        /*Update the WBS value of all the records that are below the newly added row*/
        updateWBSdetails: function (targetedRow, isOutdentMinus, isReRenderWBSPred) {
            var proxy = this,
                model = proxy.model,
                dataW = targetedRow ? targetedRow : model.selectionMode == "row" ? model.selectedItem : model.updatedRecords[proxy._rowIndexOfLastSelectedCell],
                      //^^ during indent-outdent    ^^ Newly added row
                newWBS = dataW["WBS"];
           
            //Updating the WBS value of other records that are below the newly added row
            var childItems, markedIndex, markedRecords, dataS, dataLength;
            if (dataW.parentItem) {
                childItems = dataW.parentItem.childRecords;
                markedIndex = childItems.indexOf(dataW);
                dataS = childItems;
                dataLength = dataS.length;
            } else if (model.flatRecords.length) {
                var flatData = model.flatRecords,
                    Level0 = flatData.filter(function (item) {
                        return item && item.level == 0;
                    });
                dataS = Level0;
                markedIndex = dataS.indexOf(dataW);
                dataLength = dataS.length;
            }
            if (isOutdentMinus)
                markedRecords = dataS.slice(markedIndex, dataLength);
            else
                markedRecords = dataS.slice(markedIndex + 1, dataLength);
            if (markedRecords.length) {
                var lastVal = newWBS.lastIndexOf('.') != -1 ? parseInt(newWBS.substr(newWBS.lastIndexOf('.') + 1)) : parseInt(newWBS),
                    parentVal = dataW.parentItem ? dataW.parentItem.WBS : null;
                if (isOutdentMinus && !isReRenderWBSPred)
                    lastVal--;
                else if (isOutdentMinus && isReRenderWBSPred)
                    lastVal = lastVal; // Here we no need to change the last digit of WBS value to update WBS, because it is in updated state
                else
                    lastVal++;
                proxy.reCalculateWBS(markedRecords, lastVal, parentVal);
            }
        },
        
        deleteItem: function () {
            var proxy = this;
            proxy.cancelEditCell();
            proxy._$treegridHelper.ejTreeGrid("deleteRow");
        },

        expandAllItems: function () {
            this.cancelEditCell();
            this._expandAll();
            this.updateSelectedItemIndex();
            this._$treegridHelper.focus();
        },

        collapseAllItems:function() {
            this._collapseAll();
            this.updateSelectedItemIndex();
            this._$treegridHelper.focus();
        },
        
          
        indentItem: function () {
            var proxy = this, model = this.model,
                flatRecords = proxy.model.flatRecords,
                ganttRecord = model.selectedItem, indentFlag = true;
            if (model.editSettings.allowIndent == false || (model.selectionMode == "cell" && model.selectionType != "single")) {
                return true;
            }

            if (ganttRecord && model.selectedItems == 1) {
                var recordIndex = flatRecords.indexOf(ganttRecord),
                previousGanttRecord;
                if (recordIndex === 0) {
                    indentFlag = false;
                }
                else {
                    if (ganttRecord.level === 0) {
                        indentFlag = true;
                    }
                    else {
                        previousGanttRecord = flatRecords[recordIndex - 1];
                        if (ganttRecord.level - previousGanttRecord.level === 1) {
                            indentFlag = false;
                        }
                        else {
                            indentFlag = true;
                        }
                    }
                }
            }
            if (indentFlag) {
                this._sendIndentRequest();
            } else {
                return false;
            }
        },

        
        outdentItem:function() {
            if (this.model.selectionMode == "cell" && this.model.selectionType != "single")
                return true;
            this._sendOutdentRequest();
        },
        
        //Updating the Gantt Columns from TreeGrid Columns.
        updateGanttColumns: function (tColumns) {
            var proxy = this,
                model = proxy.model;                
            model.columns = tColumns;
            proxy._columns = tColumns;
        },
        
        cancelEdit:function() {
            this.sendCancelRequest();
        },
        

        
        expandCollapseRecord: function (taskId) {
            var proxy = this, args = {},
                record, model = this.model, expandStatus,
                currentViewIndex, $gridRow, $chartRow;

            record = model.flatRecords[model.ids.indexOf(taskId.toString())];

            if (!ej.isNullOrUndefined(record) && record.hasChildRecords) {
                var args = {};
                args.expanded = record.expanded == true ? false : true;
                expandStatus = proxy.getExpandStatus(record);

                /*If the record is within expanded parent item*/
                if (expandStatus) {
                    args.data = record;
                    if (args.expanded) {
                        proxy.expanding(args);
                    } else {
                        proxy.collapsing(args);
                    }
                }
                /*If the record is within collapsed parent item*/
                else {
                    record.expanded = args.expanded;
                    currentViewIndex = model.currentViewData.indexOf(record);
                    if (currentViewIndex != -1 && !model.enableVirtualization) {
                        $gridRow = $(proxy.getRows()[currentViewIndex]);
                        if (record.expanded) {
                            $gridRow.find(".e-treegridcollapse").removeClass('e-treegridcollapse').addClass('e-treegridexpand');
                            $gridRow.removeClass('e-treegridrowcollapse').addClass('e-treegridrowexpand');
                        } else {
                            $gridRow.find(".e-treegridexpand").removeClass('e-treegridexpand').addClass('e-treegridcollapse');
                            $gridRow.removeClass('e-treegridrowexpand').addClass('e-treegridrowcollapse');
                        }
                    }
                }
            }
        },

        
        saveEdit: function () {
            var proxy = this;
            proxy._$treegridHelper.ejTreeGrid("endEdit");
        },

       // Set the splitter position based on column index.
        setSplitterIndex: function(index)
        {
            var proxy = this,
                model = proxy.model,
                columns = proxy.getColumns(),
                columnWidth = 0,
                treegridContent = $("#ejTreeGrid" + proxy._id + "e-gridcontent"),
                columnIndex = parseInt(index),
                visibleColumns = columns.filter(function (visibleColumn) {
                         return visibleColumn.visible != false;
                });
            if (columnIndex > -1 && columnIndex < visibleColumns.length)
            {
                for (var i = 0; i <= columnIndex; i++)
                    columnWidth += visibleColumns[i].width;
                if (columnWidth > proxy._ganttWidth) {
                    columnWidth = 0;
                    for (var i = 0; i <= columnIndex; i++) {
                        if ((columnWidth + visibleColumns[i].width) <= proxy._ganttWidth) {
                            columnWidth += visibleColumns[i].width;
                            index = i;
                        }
                        else {
                            model.splitterSettings.index = index;
                            break;
                        }
                    }
                }
                else
                    model.splitterSettings.index = columnIndex;
                //Check tree grid side have horizontal scrollbar or not.
                if (treegridContent.ejScroller("isHScroll"))
                    treegridContent.ejScroller("scrollLeft", 0);
                proxy.setSplitterPosition(columnWidth.toString());
            }
        },

        setSplitterPosition: function(width)
        {
            var proxy = this,
                model = proxy.model,
                leftPaneSize = 0,
                rightPaneSize = 0,
                splitter,
                ganttWidth = parseInt(proxy._ganttWidth) - proxy._totalBorderWidth,
                isPercentage = false,
                splitterPosition = proxy.splitterPosition();
            if (!ej.isNullOrUndefined(width)) {
                if (width.indexOf("%") != -1){
                    leftPaneSize = parseInt(width);
                    isPercentage = true;
                }
                else
                {
                    leftPaneSize = parseInt(width) / proxy._ganttWidth * 100;
                    isPercentage = false;
                }
                leftPaneSize = isNaN(leftPaneSize) ? 0 : leftPaneSize;
                
                //Check the grid width is less than or equal to 100% of gantt width.
                if (leftPaneSize <= 100)
                {
                    leftPaneSize = leftPaneSize < 0 ? 0 : leftPaneSize;
                    //Here 9 is the splitter span width
                    rightPaneSize = 100 - leftPaneSize - (9 / ganttWidth * 100);
                    // Check the right pane size is less than or equal to 0.
                    // if it is less than 0 mean adjust rightpane size is 0 and left pane size is 100
                    if (rightPaneSize <= 0)
                    {
                        if (isPercentage)
                            proxy.splitterPosition("100%");
                        else
                            proxy.splitterPosition(ganttWidth.toString());
                        leftPaneSize = 100 - (9 / ganttWidth * 100);
                        rightPaneSize = 0;
                    }
                    else if (rightPaneSize > 0) {
                        if (isPercentage)
                            proxy.splitterPosition(Math.round(leftPaneSize) + "%");
                        else
                            proxy.splitterPosition(Math.round((leftPaneSize * proxy._ganttWidth / 100)).toString());
                    }
                    splitter = $("#e-ejSpliter" + proxy._id).ejSplitter("instance");
                    // Set left and right pane size to ejSplitter
                    splitter.model.properties[0].paneSize = leftPaneSize+"%";
                    splitter.model.properties[1].paneSize = rightPaneSize + "%";
                    splitter.refresh();
                    proxy._$treegridHelper.ejTreeGrid("refreshScroller", Math.round((leftPaneSize * ganttWidth) / 100));
                    var secondSplitterSize = parseFloat(splitter.model.properties[1].paneSize) > 0 ? splitter.model.properties[1].paneSize - 1 : 0;
                    proxy._$ganttchartHelper.ejGanttChart("refreshScroller", secondSplitterSize);
                    proxy._clearContextMenu();
                    proxy._updateScrollerBorder();
                }
                else
                {
                    splitter = $("#e-ejSpliter" + proxy._id).ejSplitter("instance");
                    leftPaneSize = splitter.model.properties[0].paneSize;
                    rightPaneSize = splitter.model.properties[1].paneSize;
                    if (parseInt(rightPaneSize) == 0)
                    {
                        if (isPercentage)
                            proxy.splitterPosition("100%");
                        else
                            proxy.splitterPosition(ganttWidth.toString());
                    }
                    else
                    {
                        if (isPercentage)
                            proxy.splitterPosition(Math.round((parseInt(leftPaneSize) / ganttWidth * 100)) + "%");
                        else
                            proxy.splitterPosition((leftPaneSize).toString());
                    }

                }
                proxy._splitterPosition(proxy.splitterPosition());
                if (proxy._splitterOnResize == false) {
                    var eventArgs = {
                        prevSplitterPosition: splitterPosition,
                        isOnResize: false,
                        currentSplitterPosition: proxy.splitterPosition()
                    }
                    proxy._trigger("splitterResized", eventArgs);
                }
            }
        },
        /*update e-borderbox class on scrollers in Gantt*/
        _updateScrollerBorder: function () {
            var gridScrollObj = $("#ejTreeGrid" + this._id + "e-gridcontent").data("ejScroller"),
                chartScrollObj = $("#ganttviewerbodyContianerejGanttChart" + this._id).data("ejScroller"),
                isGridHScroll = false, isChartHScroll = false,
                gridElement = $("#ejTreeGrid" + this._id + "e-gridcontent"),
                chartElement = $("#ganttviewerbodyContianerejGanttChart" + this._id).find("div.e-content");
            if (gridScrollObj && gridScrollObj.isHScroll())
                isGridHScroll = true;
            if (chartScrollObj && chartScrollObj.isHScroll())
                isChartHScroll = true;
            gridElement.removeClass("e-borderbox");
            chartElement.removeClass("e-borderbox");
            if (isGridHScroll && !isChartHScroll) {
                gridElement.removeClass("e-borderbox");
                chartElement.addClass("e-borderbox");
            }
            else if (!isGridHScroll && isChartHScroll) {
                gridElement.addClass("e-borderbox");
                chartElement.removeClass("e-borderbox");
            }
        },
        _showTooltip: function (boolValue) {
            var proxy = this;
            this.model.enableTaskbarTooltip = boolValue;
            proxy._$ganttchartHelper.ejGanttChart("showTooltip", boolValue);
        },

        _showEditingTooltip: function (boolValue) {
            var proxy = this;
            this.model.enableTaskbarDragTooltip = boolValue;
            proxy._$ganttchartHelper.ejGanttChart("showEditingTooltip", boolValue);
        },
        
        _ganttChartEditing:function(boolValue) {
            var proxy = this;
            proxy.model.allowGanttChartEditing = boolValue;
            proxy._$ganttchartHelper.ejGanttChart("ganttChartEditing", boolValue);
            //Dynamically updated the cursor styles.
            if (!boolValue) {                
                $(".e-gantt-childtaskbar, .e-tasklabel, .progressbar, .taskbarresizer-right, .taskbarresizer-left").css({ cursor: "auto" });
            }
            else {
                $(".e-gantt-childtaskbar, .e-tasklabel, .progressbar").css({ cursor: "move" });
                $(".taskbarresizer-right").css({ cursor: "w-resize" });
                $(".taskbarresizer-left").css({ cursor: "e-resize" });
            }
        },
        
        _resizeProgressbar: function (boolValue) {
            var proxy = this;
            proxy.model.enableProgressBarResizing = boolValue;
            proxy._$ganttchartHelper.ejGanttChart("resizeProgressbar", boolValue);

        },

        _milestoneTemplate: function (value) {
            var proxy = this;
            proxy.model.milestoneTemplate = value;
            proxy._$ganttchartHelper.ejGanttChart("changeMilestoneTemplate", proxy.model.milestoneTemplate);
        },

        _taskbarTemplate: function (value) {
            var proxy = this;
            proxy.model.taskbarTemplate = value;
            proxy._$ganttchartHelper.ejGanttChart("changeTaskbarTemplate", proxy.model.taskbarTemplate);
        },

        _parentTaskbarTemplate: function (value) {
            var proxy = this;
            proxy.model.parentTaskbarTemplate = value;
            proxy._$ganttchartHelper.ejGanttChart("changeParentTaskbarTemplate", proxy.model.parentTaskbarTemplate);
        },
        _sendSortingRequest: function(sortSettings) {
            var proxy = this;
            proxy.model.sortSettings = sortSettings;
            proxy._$treegridHelper.ejTreeGrid("option", "sortSettings", sortSettings);
        },
        
        _sortingRequest: function (boolValue) {
            var proxy = this, model = proxy.model, sorting;
            model.allowSorting = boolValue;
            if (!model.allowSorting)
                model.sortSettings.sortedColumns = [];
            proxy._$treegridHelper.ejTreeGrid("sortSetting", boolValue);
        },
        _columnIndex: function (value) {
            var proxy = this;
            proxy._$treegridHelper.ejTreeGrid("columnIndex", value);
        },
        sendCancelRequest: function () {
            var proxy = this,
                toolbar = $("#" + proxy._id + "_toolbarItems");
            proxy._$treegridHelper.ejTreeGrid("cancelEditCell");

            if (proxy.model.toolbarSettings.toolbarItems.indexOf("cancel") !== -1) {
                proxy._disabledToolItems.push($(toolbar).find(".e-cancel").parent()[0]);
            }

            if (proxy.model.toolbarSettings.toolbarItems.indexOf("save") !== -1) {
                proxy._disabledToolItems.push($(toolbar).find(".e-saveitem").parent()[0]);
            }

            $(toolbar).ejToolbar('disableItem', proxy._disabledToolItems);
            proxy._disabledToolItems = [];
        },
        
        _sendAddRequest: function () {
            
            var proxy = this,                
                columns = (proxy.model.viewType == ej.Gantt.ViewType.ProjectView) ? proxy._columns : proxy._resourceViewColumns,
                length = columns.length,
                columnCount = 0,
                cloneData = {},
                fieldData = {},
                args = {};
            proxy._clearMultiSelectPopup();
            for (columnCount; columnCount < length; columnCount++)
                columns[columnCount].mappingName && (cloneData[columns[columnCount].mappingName] = "");

            args.data = cloneData;
            args.requestType = "add";
            proxy.renderedEditDialog(args);
        },

        _sendEditRequest: function ($tr,arg) {
            var proxy = this,
                model = proxy.model,
                args={},
                data;
            proxy._clearMultiSelectPopup();
            if (arg && arg.isResourceView) {
                args.data = arg.data;
            }
            else {
                if (ej.isNullOrUndefined($tr)) {
                    proxy._currentTrIndex = model.selectionMode == "row" ? this.selectedRowIndex() : proxy._rowIndexOfLastSelectedCell;
                    proxy._$currentTr = $(proxy._$treegridHelper.ejTreeGrid("getRows")).eq(this.selectedRowIndex());
                } else {
                    proxy._currentTrIndex = $tr.index();
                    proxy._$currentTr = $tr;
                }
                data = proxy.getUpdatedRecords()[proxy._currentTrIndex];

                args.data = data;
            }
            if ((model.selectionMode == "row" && model.selectedItems.length != 1) || (model.selectionMode == "cell" && model.selectedCellIndexes.length != 1))
                return
            args.requestType = "beginedit";
            if (args.data)
                proxy.renderedEditDialog(args);
        },
        _updateAddData: function (obj, rowPosition)
        {
            var proxy = this, model = this.model, id, startDate;
           
            if (!obj[model.taskIdMapping])
            {                
                id = proxy._getNewTaskId();
                obj[model.taskIdMapping] = id;
            }

            if (model.taskNameMapping && !obj[model.taskNameMapping]) {
                obj[model.taskNameMapping] = proxy._newTaskTexts["newTaskName"] + " " + obj[model.taskIdMapping];
            }

            if (!model.allowUnscheduledTask && !obj[model.startDateMapping]) {
                obj[model.startDateMapping] = model.scheduleStartDate;
            }

            if (!model.allowUnscheduledTask && model.durationMapping && ej.isNullOrUndefined(obj[model.durationMapping])) {
                if (!obj[model.endDateMapping])
                    obj[model.durationMapping] = "5";
            }

            if (model.progressMapping) {
                obj[model.progressMapping] = obj[model.progressMapping] ? (obj[model.progressMapping] > 100 ? 100 : obj[model.progressMapping]) : 0;
            }

            if (!model.allowUnscheduledTask && !obj[model.endDateMapping] && model.endDateMapping) {

                if (!obj[model.durationMapping]) {
                    var startDate = proxy._getDateFromFormat(model.scheduleStartDate);
                    startDate.setDate(startDate.getDate() + 4);
                    obj[model.endDateMapping] = ej.format(startDate, this.model.dateFormat, this.model.locale);
                }
            }
            
            if (model.enableWBS && !obj["WBS"]) {
                obj["WBS"] = proxy._getNewWBSid(rowPosition);
            }
             if(model.enableWBS && !obj["WBS"])
            {
                obj["WBS"] = proxy._getNewWBSid(rowPosition);
             }
             if (!ej.isNullOrUndefined(model.selectedItem)) {
                 obj["taskType"] = model.workMapping ? ej.Gantt.TaskType.FixedWork : model.selectedItem.taskType;
                 obj["effortDriven"] = model.workMapping ? "true" : model.selectedItem.effortDriven;
             }
        },
        _sendSaveRequest: function (saveType) {
            var obj = {},
                doc = document,
                proxy = this,
                model = proxy.model,
                index = 0,
                formelement,
                length,
                editedRowWrap,
                columnName,
                $element,
                prevStartDate,
                column,
                value, dialogId, treeGridId, resourceGridId, customGridId, noteRteId,
                args = {},
                generalColumns, generalColumnsLength, customColumns, customColumnsLength,
                resources = this._resourceCollection;
            this._duplicate = false;
            this._wrongenddate = false;
            if (saveType === "Add")
            {
                formelement = doc.querySelectorAll("#" + proxy._id + "GeneralAddForm", "#" + proxy._id + "PredecessorAddForm", "#" + proxy._id + "ReosurceAddForm", "#" + proxy._id + "CustomFieldsAddForm");
                length = formelement && formelement.length;
                dialogId = "Add";
                treeGridId = "#treegrid" + proxy._id + "predecessorAdd";
                resourceGridId = "#treegrid" + proxy._id + "resourceAdd";
                customGridId = "#treegrid" + proxy._id + "customFieldAdd";
                noteRteId = "#" + proxy._id + "AddAreaNotes";
                $element = $("#" + proxy._id + "taskId" + dialogId);             
                column = ej.TreeGrid.getColumnByField(proxy._columns, "taskId");
                proxy._cellEditColumn = column;
                generalColumns = proxy._addDialogGeneralColumns;
                generalColumnsLength = generalColumns.length;
                customColumns = proxy._addDialogCustomColumns;
                customColumnsLength = customColumns.length;
                if (column && $element.length>0)
                    value = proxy.getCurrentEditCellData($element, column.dropdownData);

                if (proxy.model.ids.indexOf(value) != -1 && value)
                    this._duplicate = true;
                else if (value) {
                    this._duplicate = false;
                }

                if (!this.addFormValidate())
                    return true;
            }
            else
            {
                formelement = doc.getElementById(proxy._id + "GeneralEditForm");
                length = formelement && formelement.length;
                treeGridId = "#treegrid" + proxy._id + "predecessorEdit";
                resourceGridId = "#treegrid" + proxy._id + "resourceEdit";
                customGridId = "#treegrid" + proxy._id + "customFieldEdit";
                noteRteId = "#" + proxy._id + "EditAreaNotes";
                dialogId = "Edit";
                generalColumns = proxy._editDialogGeneralColumns;
                generalColumnsLength = generalColumns.length;
                customColumns = proxy._editDialogCustomColumns;
                customColumnsLength = customColumns.length;

                if (!this.editFormValidate())
                    return true;
            }
            editedRowWrap = $(formelement).closest('div');                    
                      
            if (!this._duplicate) {


                for (var count = 0; count < generalColumnsLength; count++) {
                    $element = $(formelement).find("#" + proxy._id + generalColumns[count].field + dialogId);
                    if ($element.length > 0) {
                        proxy._cellEditColumn = generalColumns[count];
                        if (proxy._cellEditColumn.field == "duration" || proxy._cellEditColumn.field == "startDate" || proxy._cellEditColumn.field == "endDate") {
                            obj[generalColumns[count].mappingName] = this._editedDialogRecord[proxy._cellEditColumn.field];
                            if (proxy._cellEditColumn.field == "duration" && model.durationUnitMapping) {
                                obj[model.durationUnitMapping] = this._editedDialogRecord.durationUnit;
                            }
                            continue;
                        }
                        value = proxy.getCurrentEditCellData($element, generalColumns[count].dropdownData); // formelement[index].value;
                        if (proxy._isinAddnewRecord === false && generalColumns[count].mappingName === proxy.model.predecessorMapping) {
                            args.previousValue = proxy._updatePredecessorValue(null, value);
                        }
                        /*Validate progress value is null or undefined*/
                        if (generalColumns[count].mappingName === proxy.model.progressMapping && ej.isNullOrUndefined(value))
                            value = 0;
                        if ((!model.workMapping && proxy._cellEditColumn.field == "work") || proxy._cellEditColumn.field == "taskType" || proxy._cellEditColumn.field == "effortDriven")
                            obj[generalColumns[count].field] = value;
                        else
                            obj[generalColumns[count].mappingName] = value;
                    }
                }

                // Get the custom column values from custom column table.
                if ($(customGridId).length) {
                    /* save tree grid if it is in edit mode */
                    if ($(customGridId).ejTreeGrid("model.isEdit")) {
                        $(customGridId).ejTreeGrid("saveCell");
                    }
                    var data = $(customGridId).ejTreeGrid("model.updatedRecords");
                    for (var count = 0; count < customColumnsLength; count++) {
                        if (customColumns[count].editType == "dropdownedit")
                            obj[customColumns[count].mappingName] = data[count].value;
                        else
                            obj[customColumns[count].mappingName] = data[count].text;
                    }
                }
                // Adding notes value to newly added task.
                var noteRte = $(noteRteId);
                if (noteRte.length) {
                    var noteobj=$(noteRteId).data("ejRTE");
                    if (ej.isNullOrUndefined(noteobj))
                        $(noteRteId).ejRTE({});
                    obj[model.notesMapping] = noteRte.ejRTE("getHtml");
                }

                var date1 = proxy._getDateFromFormat(obj[model.startDateMapping]),
                date2 = proxy._getDateFromFormat(obj[model.endDateMapping]);
                var diffdays=0;
                if (date1 && date2)
                    diffdays = date2.getTime() - date1.getTime();
                if (diffdays < 0)
                    this._wrongenddate = true;
                else
                    this._wrongenddate = false;
                if (!this._wrongenddate) {
                    // when adding new task resource value changes.
                    var resourceGrid = $(resourceGridId), resourceFlag = true;
                    if (resourceGrid.length > 0) {
                        /* save tree grid if it is in edit mode */
                        if ($(resourceGrid).ejTreeGrid("model.isEdit")) {
                            $(resourceGrid).ejTreeGrid("saveCell");
                        }
                        var resource = [];
                        var data = $(resourceGridId).ejTreeGrid("option", "dataSource"),
                            selectedRowIndex = $(resourceGridId).ejTreeGrid("option", "selectedRowIndex"),
                            newResource,
                            ganttRecord = proxy._editedDialogRecord,
                            resourceInfo = [],
                            resourceIdMapping = model.resourceIdMapping;
                        if (saveType != "Add") {
                            if (ej.isNullOrUndefined(proxy._editedDialogRecord.resourceInfo))
                                proxy._editedDialogRecord.resourceInfo = [];
                            $.extend(true, resourceInfo, proxy._editedDialogRecord.resourceInfo);
                        }
                        $.each(data, function (indx, value) {
                            if (value.name !== null && value.name !== "") {

                                for (var rCount = 0; rCount < resources.length; rCount++) {
                                    if (resources[rCount][model.resourceIdMapping].toString() == value.name) {
                                        newResource = $.extend({}, resources[rCount]);
                                        break;
                                    }
                                } 
                                if (saveType === "Add") {
                                    resource.push(newResource[model.resourceIdMapping]);
                                    newResource[model.resourceUnitMapping] = value.unit;
                                    proxy._newRecordResourceCollection.push(newResource);
                                }
                                    //update duration, work, resource units of a task, while add/remove/changes in existing resource unit.
                                else {

                                    if (ej.isNullOrUndefined(resourceInfo) || resourceInfo.length != data.length)
                                        proxy._isResourceAddedOrRemoved = true;

                                    if (resourceInfo.length > 0) {
                                        for (var index = 0; index < resourceInfo.length; index++) {
                                            if (resourceInfo[index][resourceIdMapping] === newResource[resourceIdMapping]) {
                                                var resourceIndex = index;
                                                break;
                                            }
                                            else
                                                var resourceIndex = -1;
                                        }
                                    }
                                    if ((ej.isNullOrUndefined(resourceIndex) || resourceIndex == -1) &&  resourceInfo.length != data.length) {
                                        var ganttRecordResource = $.extend({}, newResource);
                                        ganttRecord._updateResourceUnit(newResource, ganttRecordResource, model.resourceUnitMapping);
                                        //Unit for newly selected resource should be 100, even there is a defined unit for the selected resource.
                                        ganttRecordResource[model.resourceUnitMapping] = 100;
                                        resourceInfo.push(ganttRecordResource);                                        
                                    }
                                    if (resourceInfo[indx] && resourceInfo[indx][model.resourceUnitMapping] != data[indx].unit && model.viewType == "projectView")
                                        proxy._isExistingUnitIsUpdated = true;
                                    var editedResource = resources.filter(function (item) {
                                        if (typeof item[model.resourceIdMapping] == "number")
                                            return item && item[model.resourceIdMapping] == parseInt(data[indx].name);
                                        else
                                            return item && item[model.resourceIdMapping] == data[indx].name;
                                    });
                                    resourceInfo[indx] = $.extend({},editedResource[0]);                                    
                                    resourceInfo[indx][model.resourceUnitMapping] = data[indx].unit;
                                    resource.push(resourceInfo[indx]);

                                    //update duration as per changes in existing resources unit before adding new resources.
                                    if (proxy._isExistingUnitIsUpdated) {
                                        if (!ganttRecord.isAutoSchedule || ganttRecord.taskType == "fixedDuration")
                                            ganttRecord._updateWorkWithDuration(proxy, resourceInfo);
                                        else
                                            ganttRecord._updateDurationWithWork(proxy, resourceInfo);
                                        obj.Duration = ganttRecord.duration;
                                        if (model.workMapping)
                                            obj[model.workMapping] = ganttRecord.work;
                                        else
                                            obj.work = ganttRecord.work;
                                        proxy._editedDialogRecord.duration = ganttRecord.duration;
                                        proxy._editedDialogRecord.work = ganttRecord.work;
                                        proxy._isExistingUnitIsUpdated = false;
                                    }
                                }
                            }
                            else {
                                resourceFlag = false;
                                return false;
                            }
                        });
                        if (resourceFlag)
                            obj[model.resourceInfoMapping] = resource;
                        else {
                            alert(proxy._alertTexts["dialogResourceAlert"]);
                            return true;
                        }
                }

                if (!obj[model.taskIdMapping] && saveType === "Edit")
                    obj[model.taskIdMapping] = proxy._editedDialogRecord.taskId;

                args.data = obj;
                args.currentRecord = model.viewType == "resourceView" ? proxy._resourceEditedRecord : (model.selectionMode == "row" ? this.selectedItem() : model.updatedRecords[proxy._rowIndexOfLastSelectedCell]);
                //getting predecessor from edit dialog table    
                var prdecessor_validation_flag = false;
                var results = [], resultFlag = false;
                if (model.predecessorMapping)
                {
                    if (saveType === "Edit") {
                        resultFlag = model.editDialogFields.length === 0 ? true : false;
                        results = $.grep(model.editDialogFields, function (val, idx) {
                            return (val.field === model.predecessorMapping);
                        });
                    } else if (saveType === "Add")
                    {
                        resultFlag = model.addDialogFields.length === 0 ? true : false;
                        results = $.grep(model.addDialogFields, function (val, idx) {
                            return (val.field === model.predecessorMapping);
                        });
                    }
                }
                if (results.length > 0 || resultFlag)
                {
                    var pre = [];
                    var taskNameFlag = true;

                    /* save tree grid if it is in edit mode */
                    if ($(treeGridId).ejTreeGrid("model.isEdit")) {
                        $(treeGridId).ejTreeGrid("saveCell");
                    }

                    pre = $(treeGridId).ejTreeGrid("option", "dataSource");
                    $.each(pre, function (idx, value) {
                        if (ej.isNullOrUndefined(value.id) || ej.isNullOrUndefined(value.name) || ej.isNullOrUndefined(value.type) || !(value.id.length > 0 && value.name.length && value.type.length))
                        {
                            taskNameFlag = false;
                        }
                    });
                    if (taskNameFlag) {
                        var predecessorColl = [], predecessorString = [],//from,to,offset,predecessorType,isdrawn                        
                        types = proxy._predecessorCollectionText, serialPredecessor = [];
                        var tempType;
                        for (var i = 0; i < pre.length; i++) {
                            var predecessor = {};
                            predecessor["from"] = obj.taskID;
                            predecessor["to"] = model.enableSerialNumber ? proxy._recordIdFromSerialnumber(pre[i].id) : pre[i].id;
                            predecessor["isdrawn"] = false;
                            predecessor["offset"] = pre[i].offset;
                            for (var j = 0; j < types.length; j++) {
                                if (pre[i].type == types[j].text) {
                                    predecessor["predecessorType"] = types[j].id;
                                    tempType = types[j].id;
                                    break;
                                }
                            }
                            var tem = predecessor["to"] + tempType//+data[i].lags.toString();
                            pre[i].offset = parseFloat(pre[i].offset);
                            if (pre[i].offset !== 0) {
                                if (pre[i].offset < 0)
                                    tem += predecessor["offset"].toString();
                                else
                                    tem += "+" + predecessor["offset"].toString();
                            }
                            predecessorString.push(tem);
                            predecessorColl.push(predecessor);
                            if (model.enableSerialNumber) {
                                var offsetVal = "", serialPredecessor, validSnoPredId = +pre[i].id;
                                if (tem.indexOf('+') != -1) 
                                    offsetVal = '+' + tem.split('+')[1];
                                else if (tem.indexOf('-') != -1)
                                    offsetVal = '-' + tem.split('-')[1];
                                if (+args.data.serialNumber <= validSnoPredId && saveType === "Add")
                                    validSnoPredId += 1; //Update serial predecessor id for new row
                                serialPredecessor.push(validSnoPredId + tempType + offsetVal);
                            }
                        }
                        args.predecessorString = predecessorString;
                    } else {
                        //Break here and give notification to users
                        alert(proxy._alertTexts["predecessorAddingValidationAlert"]);
                        return true;
                    }
                    //Validate predecessoe for editing
                    if (proxy._isinAddnewRecord === false) {
                        if(proxy._editedPredecessorValidation(args))
                        {
                            var oldPredecessorString = ej.isNullOrUndefined(args.currentRecord.predecessorsName) ? "" : args.currentRecord.predecessorsName,
                                newPredecessorString = predecessorString.join(',');
                            if (oldPredecessorString != newPredecessorString)
                                proxy._isPredecessorEdited = true;
                            args.previousValue = proxy._updatePredecessorValue(args.currentRecord, newPredecessorString);
                        }
                        else {
                            alert(proxy._alertTexts["predecessorEditingValidationAlert"]);
                            return true;
                        }
                    }
                    obj[model.predecessorMapping] = predecessorString.join(',');
                    if (model.enableSerialNumber)
                        obj["serialNumberPredecessor"] = serialPredecessor.join(',');
                }

                args.requestType = ej.TreeGrid.Actions.Save;
                args.recordIndex = (this.selectedRowIndex() !== -1) ? this.selectedRowIndex() : -1;
                if (proxy._trigger("actionBegin", args))
                    return true;
                if (saveType === "Edit") {
                    if(model.viewType == "resourceView")
                        proxy._previousResource = $.extend(true, [], proxy._resourceEditedRecord.resourceInfo);
                    else
                        prevStartDate = args.currentRecord ? new Date(args.currentRecord.startDate) : null;
                    args._cModifiedData = proxy._updateRecord(obj, proxy._resourceEditedRecord);
                    if (proxy._editedDialogRecord) {
                        args._cModifiedData.startDate = proxy._getDateFromFormat(proxy._editedDialogRecord.startDate);
                        args._cModifiedData.endDate = proxy._getDateFromFormat(proxy._editedDialogRecord.endDate);
                        args._cModifiedData.duration = proxy._editedDialogRecord.duration;                        
                        args._cModifiedData.durationUnit = proxy._editedDialogRecord.durationUnit;
                        args._cModifiedData.work = proxy._editedDialogRecord.work;
                        if (model.workMapping)
                            args._cModifiedData.item[model.workMapping] = proxy._editedDialogRecord.work;
                        if (proxy._isResourceAddedOrRemoved)
                            proxy._updateResourceRelatedFields(args._cModifiedData);
                        model.durationUnitMapping && (args._cModifiedData.item[model.durationUnitMapping] = proxy._editedDialogRecord.durationUnit);
                        proxy._editedDialogRecord = null;
                    }
                    if (args.data[model.endDateMapping] && (ej.isNullOrUndefined(args.data[model.durationMapping]) || args.data[model.durationMapping] === "") && proxy._isDurationUpdated == false) {
                        args._cModifiedData.startDate = proxy._checkStartDate(args._cModifiedData.startDate, args._cModifiedData);
                        args._cModifiedData.endDate = proxy._checkEndDate(args._cModifiedData.endDate, args._cModifiedData);
                        args._cModifiedData._calculateDuration(this);
                    }
                        /*Milestone status update if start date,end date , duration fields not given in edit dialog fields*/
                        if (args._cModifiedData.duration == 0 && proxy._compareDatesFromRecord(args._cModifiedData) == 0)
                        args._cModifiedData.isMilestone = true;
                    else
                        args._cModifiedData.isMilestone = false;
                    if (args.data[model.baselineStartDateMapping] && args.data[model.baselineEndDateMapping])
                    {
                        var baseLineStartDate = proxy._getDateFromFormat(args.data[model.baselineStartDateMapping]),
                            baseLineEndDate = proxy._getDateFromFormat(args.data[model.baselineEndDateMapping]);
                        if (baseLineEndDate && baseLineEndDate.getHours() == 0 && this._defaultEndTime != 86400)
                            this._setTime(this._defaultEndTime, baseLineEndDate);
                        args._cModifiedData.baselineStartDate = this._checkBaseLineStartDate(baseLineStartDate);
                        args._cModifiedData.baselineEndDate = this._checkBaseLineEndDate(baseLineEndDate);
                        args._cModifiedData.baselineLeft = args._cModifiedData._calculateBaselineLeft(this);
                        args._cModifiedData.baselineRight = args._cModifiedData._calculateBaselineRight(this);
                        args._cModifiedData.baselineWidth = args._cModifiedData._calculateBaseLineWidth(this);
                    }
                    args.modifiedRecord = args._cModifiedData;
                    args.previousStartDate = prevStartDate;
                    proxy.actionComplete(args);
                    proxy._isPredecessorEdited = false;
                }
                else if (saveType === "Add") {
                    var rowPosition = proxy._addPosition != null ? proxy._addPosition : model.editSettings.rowPosition;
                    if (!proxy.addRecord(obj, rowPosition)) {
                        alert(proxy._alertTexts["predecessorEditingValidationAlert"]);
                        return true;
                    }                 
                }  
                proxy._cModifiedData = null;
                proxy._cAddedRecord = null;
                proxy._primaryKeyValues = [];
                proxy._isinAddnewRecord = false;
                proxy._isResourceAddedOrRemoved = false;
                return false;
                }
                else {
                    alert(proxy._alertTexts["dateValidationAlert"]);
                    return true;
                }
            }
            else {
                alert(proxy._alertTexts["idValidationAlert"]);
                return true;
            }   
        },

        _recordReturnerByID:function(id)
        {
            var proxy = this,
                records = proxy.model.flatRecords;
            for (var i = 0; i < records.length; i++) {
                if (records[i].taskId.toString() === id.toString()) {
                    return records[i]
                }
            }
            return null;

        },
   
        _sendCancelRequest: function () {
            var proxy = this,
                model=proxy.model,
                args = {};

            if (model.dateFormat.toLowerCase().indexOf("hh") != -1)
                $("#" + proxy._id + "EditForm").find(".e-datepicker").ejDateTimePicker("destroy");
            else
                $("#" + proxy._id + "EditForm").find(".e-datepicker").ejDatePicker("destroy");

            args.requestType = ej.TreeGrid.Actions.Cancel;
            proxy._$treegridHelper.ejTreeGrid("processBindings", args);
            proxy._primaryKeyValues = [];
            proxy.model.currentData = null;
        },
       
        getCurrentEditCellData: function ($element, dropdownData) {
            var proxy = this, model = proxy.model, date;
            if ($("#" + proxy._id + "EditForm").length || $("#" + proxy._id + "GeneralAddForm").length || $("#" + proxy._id + "GeneralEditForm").length) {
                var cellValue="";// $element = $("#" + proxy._id + proxy._columnFieldName), 
                switch (proxy._cellEditColumn.editType) {
                    case ej.TreeGrid.EditingType.String:
                        cellValue = $element.val();
                        break;
                    case ej.TreeGrid.EditingType.Numeric:
                        cellValue = $element.ejNumericTextbox("getValue");
                        break;
                    case ej.TreeGrid.EditingType.Dropdown:
                        if ($element.attr("id").indexOf("resourceInfo") > 0) {
                            cellValue = proxy._getSelectedItem($element.ejDropDownList("model.selectedItems"), dropdownData);
                        }
                        else if ($element.attr("id").indexOf("taskMode") > 0) {
                            cellValue = $element.ejDropDownList("model.value") == "true" ? true : false;
                        }
                        else
                            cellValue = $element.ejDropDownList("model.value");
                        break;
                    case ej.TreeGrid.EditingType.Boolean:
                        cellValue = $element.is(':checked');
                        break;

                    case ej.TreeGrid.EditingType.DatePicker:
                        date = $element.ejDatePicker("model.value");

                        if (proxy._cellEditColumn && !proxy._cellEditColumn.format) {
                            cellValue = proxy.getFormatedDate(date);
                        } else {
                            cellValue = date;
                        }
                        break;
                    case ej.TreeGrid.EditingType.DateTimePicker:
                        date = $element.ejDateTimePicker("model.value");
                        if (proxy._cellEditColumn && !proxy._cellEditColumn.format) {
                            cellValue = cellValue = proxy.getFormatedDate(date);
                        } else {
                            cellValue = date;
                        }
                        break;
                    case ej.TreeGrid.EditingType.Maskedit:
                        cellValue = $element.ejMaskEdit("model.value");
                        break;
                }
                return cellValue;
            }
            return null;
        },


        _getSelectedItem: function (indexArray, dropDownData) {
            var count = 0,
                length = indexArray.length,
                    selectedItems = [];
            if (dropDownData) {
                for (count = 0; count < length; count++) {
                    $.each(dropDownData, function (index, resourceInfo) {
                        if (indexArray[count] === index) {
                            selectedItems.push(resourceInfo);
                        }
                    });
                }
            }

            return selectedItems;
        },

        _getDropDownText: function (column,indexArray) {
            var count = 0,
                length, editParams = column.editParams, value, text,
                dropDownData = column.dropdownData, selectedText,
                delimiter = (editParams && !ej.isNullOrUndefined(editParams.delimiterChar)) ? editParams.delimiterChar : "," ,
                selectedDropDownText = [];
            if (typeof (indexArray) == 'string' && indexArray.indexOf(delimiter) > -1) {
                indexArray = indexArray.split(delimiter);
                length = indexArray.length;
            }            
            if (editParams && editParams.fields) {
                text = editParams.fields.text ? editParams.fields.text : "text";
                value = editParams.fields.value ? editParams.fields.value : "value";
            }
            else {
                value = "value";
                text = "text";
            }
            if (length) {
                for (var i = 0; i < length; i++) {
                    $.each(dropDownData, function (index, data) {
                        if (!ej.isNullOrUndefined(data[value])) {
                            if (indexArray[i] === data[value].toString()) {
                                selectedDropDownText.push(data[text]);
                                return false;
                            }
                        }
                        else {
                            if (indexArray[i] === data[text].toString()) {
                                selectedDropDownText.push(data[text].toString());
                                return false;
                            }
                        }
                    });
                }
                return selectedDropDownText.join(delimiter);
            }
            else {
                $.each(dropDownData, function (index, data) {
                    if ((!ej.isNullOrUndefined(data[value]) && indexArray.toString() === data[value].toString()) || indexArray === data[text]) {
                        selectedText = data[text];
                        return false;
                    }
                });
                return selectedText;
            }
        },
        _updateRecord: function (data,record) {
            var proxy = this, model = this.model,
                columns = (model.viewType == ej.Gantt.ViewType.ProjectView) ? proxy._columns : proxy._resourceViewColumns,
               length,
                index = 0,
                targetIndex = model.selectionMode == "row" ? this.selectedRowIndex() : proxy._rowIndexOfLastSelectedCell,
                ganttRecord = record ? record : proxy.getUpdatedRecords()[targetIndex];
            proxy._isUpdateOffset = false;

            if (model.editDialogFields.length > 0) {
                var filteredColumns = [];
                var count = 0, resultColumn;
                for (; count < model.editDialogFields.length; count++) {
                    resultColumn = $.grep(columns, function (val) {
                        return val.mappingName === model.editDialogFields[count].field;
                    });
                    resultColumn.length && filteredColumns.push(resultColumn[0]);
                }
                columns = filteredColumns;
            }
            length = columns.length;

            for (index = 0; index < length; index++) {

                if (columns[index].field.toString() === "predecessor")
                    continue;
                //for predecessor from edit dialog window 
                if (!ej.isNullOrUndefined(data[columns[index].mappingName])) {
                    if ((columns[index].field == "startDate")) {
                        if (proxy._compareDates(ganttRecord[columns[index].field], data[columns[index].mappingName]) != 0)
                            proxy._isUpdateOffset = true;
                    }
                    if (columns[index].field == "endDate") {
                        if (proxy._compareDates(ganttRecord[columns[index].field], data[columns[index].mappingName]) != 0)
                            proxy._isUpdateOffset = true;
                    }
                    if (columns[index].field == "duration") {
                        if (ganttRecord[columns[index].field] != data[columns[index].mappingName])
                            proxy._isUpdateOffset = true;
                    }

                    if (columns[index].field != "work" && columns[index].field != "taskType") {
                        ganttRecord[columns[index].field] = data[columns[index].mappingName];
                        ganttRecord.item[columns[index].mappingName] = data[columns[index].mappingName];//field
                    }
                    if (columns[index].field == "work") {
                        if (model.workMapping) {
                            ganttRecord[columns[index].field] = data[columns[index].mappingName];
                            ganttRecord.item[columns[index].mappingName] = data[columns[index].mappingName];
                        }
                        else
                            ganttRecord[columns[index].field] = data[columns[index].field];
                    }
                    if (model.enableSerialNumber && columns[index].field == "serialNumberPredecessor")
                        ganttRecord[columns[index].field] = data[columns[index].field];
                }
                if (columns[index].field == "taskMode") {
                    ganttRecord["isAutoSchedule"] = !data[model.taskSchedulingModeMapping];                    
                }
                if (columns[index].field == "taskType" || columns[index].field == "effortDriven")
                    ganttRecord[columns[index].field] = data[columns[index].field];
                if (columns[index].field.toString() === "resourceInfo")
                    proxy._updateResourceName(ganttRecord);
                if (columns[index].field.toString() === "notesText") {
                    ganttRecord["notes"] = data[model.notesMapping];
                    ganttRecord["notesText"] = proxy._getPlainText(data[model.notesMapping]);
                    ganttRecord.item[model.notesMapping] = data[model.notesMapping];
                }
            }
            return ganttRecord;
            
        },
        /*Method to update task field values by using it's id*/
        updateRecordByTaskId: function (data) {
            var proxy = this, model = proxy.model,
                flatIndex, updatedIndex, taskId = data[model.taskIdMapping],
                id = typeof (taskId) == 'number' ? taskId.toString() : typeof (taskId) == 'string' ? taskId : null;
            if (model.viewType == "resourceView") {
                proxy._updateResourceTask(data);
            }
            else if (!ej.isNullOrUndefined(id)) {
                flatIndex = model.ids.indexOf(id);
                if (flatIndex > -1) {
                    var flatRecord = model.flatRecords[flatIndex],
                        updatedIndex = model.updatedRecords.indexOf(flatRecord);
                    proxy.updateRecordByIndex(updatedIndex, data);
                }
            }
        },

        updateRecordByIndex: function (index, data) {
            var proxy = this,
                model = proxy.model,
                updatedRecords = model.updatedRecords, args = {},
                recordIndex = index, ganttRecord, dateValueChanged = false,
                record = recordIndex > -1 ? updatedRecords.length > 0 ? updatedRecords[recordIndex] : null : null;
            proxy.cancelEditCell();
            if (!ej.isNullOrUndefined(record)) {
                var prevData = $.extend({}, record.item);
                args.previousItem = $.extend(true, {}, record.item);
                $.each(data, function (key, value) {                    
                    if ((model.startDateMapping == key || model.endDateMapping == key || model.durationMapping == key) && prevData[key] != value)
                        dateValueChanged = true;
                    prevData[key] = value;
                });
                data = prevData;
                var ganttRecord, columns = proxy.getColumns();
                data[model.taskIdMapping] = record.item[model.taskIdMapping];
                ganttRecord = proxy._createGanttRecord(data, record.level, record.parentItem, undefined);
                record.isAutoSchedule = ganttRecord.isAutoSchedule;
                record.isMilestone = ganttRecord.isMilestone;
                var updateNeeded = ["WBS", "baselineEndDate", "effortDriven", "endDate", "baselineStartDate", "baselineStartDate", "duration", "manualEndDate", "durationUnit", "manualStartDate",
                "notes", "notesText", "predecessorsName", "resourceInfo", "resourceNames", "startDate", "isAutoSchedule", "manualDuration", "taskType", "taskName", "work", "status", "item", "predecessor"];
                var customColumn = proxy._getGanttColumnDetails();
                for (var colIndex = 0; colIndex < customColumn.customColDetails.length; colIndex++) {
                    updateNeeded.push(customColumn.customColDetails[colIndex].field);
                }
                for (var index = 0; index < updateNeeded.length; index++) {
                    if (updateNeeded[index] != "taskId") {
                        if (!(record.hasChildRecords && record.isAutoSchedule && (updateNeeded[index] == "startDate" ||
                            updateNeeded[index] == "endDate" || updateNeeded[index] == "duration" || updateNeeded[index] == "status" || updateNeeded[index] == "predecessor"))) {
                            if (updateNeeded[index] == "predecessor") {
                                var predecessorName = ej.isNullOrUndefined(ganttRecord.item[model.predecessorMapping]) ? "" :
                                                        ganttRecord.item[model.predecessorMapping];
                                args.previousValue = proxy._updatePredecessorValue(record, predecessorName);
                            } else if (updateNeeded[index] == "item") {
                                var prevData = $.extend({}, ganttRecord.item);
                                $.each(prevData, function (key, value) {
                                    record.item[key] = value;
                                });
                            }
                            else {
                                if (!ej.isNullOrUndefined(ganttRecord[updateNeeded[index]]) || (model.allowUnscheduledTask && (updateNeeded[index] == "startDate" ||
                            updateNeeded[index] == "endDate" || updateNeeded[index] == "duration")))
                                    record[updateNeeded[index]] = ganttRecord[updateNeeded[index]];
                            }
                        }
                    }
                }
                args.requestType = ej.TreeGrid.Actions.Save;
                args.recordIndex = recordIndex;
                args.modifiedRecord = record;
                args._cModifiedData = args.modifiedRecord;
                proxy._isUpdateOffset = true;
                if (dateValueChanged && (record.isAutoSchedule || model.validateManualTasksOnLinking)) {
                    var newArgs = proxy._getLinkedTaskArgs(record, "recordUpdate");
                    if (!proxy._trigger("actionBegin", newArgs)) {
                        newArgs.actionCompleteArgs = args;
                        if (!model.enablePredecessorValidation || (model.enablePredecessorValidation && proxy._validateTypes(newArgs)))
                            proxy.actionComplete(args);
                    }
                }
                else
                    proxy.actionComplete(args);
            }
        },

        /*Method to update task properties in resource view by uisng task id value*/
        _updateResourceTask: function (data) {
            var proxy = this, model = proxy.model, args = {},
                taskId = data[model.taskIdMapping],
                record, isVisible = false;
            taskId = typeof (taskId) == 'number' ? taskId.toString() : typeof (taskId) == 'string' ? taskId : null;

            /*Perform validation*/
            if (ej.isNullOrUndefined(taskId))
                return false;
            record = this._getRecordByTaskId(taskId);
            if (ej.isNullOrUndefined(record))
                return false;
            if (record.eResourceTaskType == "unassignedTask" && model.updatedRecords.indexOf(record) == -1)
                return false;

            /*Task value update work*/
            this.cancelEditCell();

            var cloneData = $.extend({}, record.item),
                ganttRecord, columns, dateValueChanged = false;
            args.previousItem = $.extend(true, {}, record.item);

            $.each(data, function (key, value) {
                if ((model.startDateMapping == key || model.endDateMapping == key || model.durationMapping == key) && cloneData[key] != value)
                    dateValueChanged = true;
                cloneData[key] = value;
            });
            columns = this.getResourceViewEditColumns();
            cloneData[model.taskIdMapping] = record.item[model.taskIdMapping];
            ganttRecord = this._createGanttRecord(cloneData, record.level, record.parentItem, undefined);
            if (this.model.viewType == "resourceView" && ganttRecord.duration == 0) {
                ganttRecord.duration = 1;
                ganttRecord._calculateEndDate(this);
            }
            record.isAutoSchedule = ganttRecord.isAutoSchedule;
            record.isMilestone = ganttRecord.isMilestone;
            var updatableFields = ["WBS", "baselineEndDate", "effortDriven", "endDate", "baselineStartDate", "baselineStartDate", "duration", "manualEndDate", "durationUnit", "manualStartDate",
            "notes", "notesText", "predecessorsName", "resourceInfo", "resourceNames", "startDate", "isAutoSchedule", "manualDuration", "taskType", "taskName", "work", "status", "item", "predecessor"];
            var customColumn = this._getGanttColumnDetails();
            for (var colIndex = 0; colIndex < customColumn.customColDetails.length; colIndex++) {
                updatableFields.push(customColumn.customColDetails[colIndex].field);
            }
            for (var index = 0; index < updatableFields.length; index++) {
                if (updatableFields[index] != "taskId") {
                    if (!(record.hasChildRecords && record.isAutoSchedule && (updatableFields[index] == "startDate" ||
                        updatableFields[index] == "endDate" || updatableFields[index] == "duration" || updatableFields[index] == "status" || updatableFields[index] == "predecessor"))) {
                        if (updatableFields[index] == "predecessor") {
                            var predecessorName = ej.isNullOrUndefined(ganttRecord.item[model.predecessorMapping]) ? "" :
                                                    ganttRecord.item[model.predecessorMapping];
                            args.previousValue = this._updatePredecessorValue(record, predecessorName);
                        } else if (updatableFields[index] == "item") {
                            var prevData = $.extend({}, ganttRecord.item);
                            $.each(prevData, function (key, value) {
                                record.item[key] = value;
                            });
                        }
                        else if (updatableFields[index] == "resourceInfo") {
                            this._previousResource = $.extend(true, [], record[updatableFields[index]]);
                            record[updatableFields[index]] = ganttRecord[updatableFields[index]];
                        }
                        else {
                            if (!ej.isNullOrUndefined(ganttRecord[updatableFields[index]]))
                                record[updatableFields[index]] = ganttRecord[updatableFields[index]];
                        }
                    }
                }
            }
            args.requestType = ej.TreeGrid.Actions.Save;
            //args.recordIndex = recordIndex;
            args.modifiedRecord = record;
            args._cModifiedData = args.modifiedRecord;
            this._isUpdateOffset = true;
            if (dateValueChanged && (record.isAutoSchedule || model.validateManualTasksOnLinking)) {
                var newArgs = proxy._getLinkedTaskArgs(record, "recordUpdate");
                if (!proxy._trigger("actionBegin", newArgs)) {
                    newArgs.actionCompleteArgs = args;
                    if (!model.enablePredecessorValidation || (model.enablePredecessorValidation && proxy._validateTypes(newArgs)))
                        proxy.actionComplete(args);
                }
            }
            else
                this.actionComplete(args);
        },

        _getLinkedTaskArgs: function (record, editMode) {
            var newArgs = {},
                validateMode = {
                    respectLink: false,
                    removeLink: false,
                    preserveLinkWithEditing: true,
                };
            newArgs.editMode = editMode;
            newArgs.data = record;
            newArgs.requestType = "validateLinkedTask";
            newArgs.validateMode = validateMode;
            return newArgs;
        },

        //Get Columns Details
        _getGanttColumnDetails: function () {
            var columnsDetails = {}, length,
                columns, model = this.model,
                index = -1, generalColumnFields = ["taskId", "taskMode", "taskName", "startDate", "endDate", "duration", "resourceInfo", "status", "work", "taskType", "effortDriven", "baselineStartDate", "baselineEndDate", "predecessor", "WBS", "notesText"];
            columns = model.viewType == "projectView" ? this.getColumns() : this.getResourceViewEditColumns(),
            columnsDetails.customColDetails = [];
            columnsDetails.generalColDetails = [];
            length = columns.length;
            for (var i = 0; i < length; i++) {
                var index = generalColumnFields.indexOf(columns[i].field);
                if (index != -1) {
                    columnsDetails.generalColDetails.push(columns[i]);
                } else {
                    columnsDetails.customColDetails.push(columns[i]);
                }
            }
            return columnsDetails;
        },

        _splitAndReplace: function(stringValue, find, replace, splitBy){
            var i = 0;
            if (!ej.isNullOrUndefined(splitBy) && splitBy.length > 0) {
                var splitString = splitBy.shift(),
                    stringArray = stringValue.split(splitString);
                for (var index = 0; index < stringArray.length; index++) {
                    if (splitBy.length > 0) {
                        stringArray[index] = this._splitAndReplace(stringArray[index], find, replace, splitBy);
                    }
                    else if (stringArray[index] == find) {
                        stringArray[index] = replace;
                    }
                }
                return stringArray.join(splitString);
            }
        },

        _updateDetailPredecessorCollection: function (currentId, newId) {
            var detailPredecessorCollection = this.detailPredecessorCollection;
            for (var i = 0; i < detailPredecessorCollection.length; i++) {
                var pCollection = this.detailPredecessorCollection[i];
                if (pCollection.taskid == parseInt(currentId))
                    pCollection.taskid = parseInt(newId);
                var splitBy = [",", ":"];
                if (!ej.isNullOrUndefined(pCollection.from)) {                    
                    pCollection.from = this._splitAndReplace(pCollection.from, currentId, newId, splitBy);
                }
                else {
                    if (!ej.isNullOrUndefined(pCollection.to)) {
                        pCollection.to = this._splitAndReplace(pCollection.to, currentId, newId, splitBy);
                    }
                }
            }
        },    
        
        //Update connectorLineId for new taskId
        _updateConnectorLineId: function (parentGanttRecord, childGanttRecord, predecessor) {
            var proxy = this, connectorLineObject = proxy._createConnectorLineObject(parentGanttRecord, childGanttRecord, predecessor);
            if (connectorLineObject) {
                if (proxy._connectorlineIds.length > 0 && proxy._connectorlineIds.indexOf(connectorLineObject.ConnectorLineId) == -1) {

                    proxy._updatedConnectorLineCollection.push(connectorLineObject);
                    proxy._connectorlineIds.push(connectorLineObject.ConnectorLineId);
                }
                else if (proxy._connectorlineIds.length == 0) {
                    proxy._updatedConnectorLineCollection.push(connectorLineObject);
                    proxy._connectorlineIds.push(connectorLineObject.ConnectorLineId);
                }                
                proxy._$ganttchartHelper.ejGanttChart("appendConnectorLine", proxy._updatedConnectorLineCollection);
                this._updateConnectorLineCollection(proxy._updatedConnectorLineCollection);
            }
        },
        // Dynamically update new taskId by this method.
        updateTaskId: function(currentId, newId){
            var proxy = this, model = this.model, ids = model.ids,
                flatRecords = model.flatRecords, currentViewData = model.currentViewData,
                cId = typeof currentId == 'number' ? currentId.toString() : currentId,
                nId = typeof newId == 'number' ? newId.toString() : newId;
            if (!ej.isNullOrUndefined(cId) && !ej.isNullOrUndefined(nId)) {
                var cIndex = ids.indexOf(cId),
                    nIndex = ids.indexOf(nId),
                    record;
                //Return false for invalid TaskId
                if (cIndex == -1 || nIndex > -1)
                    return false;
                record = flatRecords[cIndex];                
                record['taskId'] = record.item[model.taskIdMapping] = newId;
                ids[cIndex] = nId;

                if (this.criticalPathCollection.length > 0 || this.collectionTaskId.length > 0) {
                    var pathIndex = this.criticalPathCollection.indexOf(parseInt(cId)),
                        collectionIndex = this.collectionTaskId.indexOf(parseInt(cId));
                    this.criticalPathCollection[pathIndex] = parseInt(nId);
                    this.collectionTaskId[collectionIndex] = parseInt(nId);
                }
                if (this.detailPredecessorCollection.length > 0) {
                    proxy._updateDetailPredecessorCollection(cId, nId);
                }

                // ParentTaskIdMapping updation
                if (record.hasChildRecords && model.parentTaskIdMapping) {
                    var childRecords = record.childRecords,
                        childLength = childRecords.length;
                    for (var i = 0; i < childLength; i++) {
                        var childRecord = childRecords[i];
                        childRecord.item[model.parentTaskIdMapping] = newId;
                        proxy.refreshGanttRecord(childRecord);
                    }
                }               
                
                // Predecessor & connectorLines updation
                if (model.predecessorMapping && !ej.isNullOrUndefined(record.predecessor)) {
                    var predecessors = record.predecessor,
                        length = predecessors.length;
                    
                    for (var count = 0; count < length; count++) {
                        var predecessor = predecessors[count], childGanttRecord, parentGanttRecord;
                        if (predecessor.to == cId) {
                            parentGanttRecord = flatRecords[ids.indexOf(predecessor.from)];
                            childGanttRecord = flatRecords[cIndex];                            
                            proxy._connectorlineIds = [];
                            proxy._updatedConnectorLineCollection = [];
                            //Condition to check connector line existing in DOM before remove it
                            if (currentViewData.indexOf(parentGanttRecord) > -1 && currentViewData.indexOf(childGanttRecord) > -1) {
                                var connectorLineId = "parent" + predecessor.from + "child" + predecessor.to;
                                proxy._$ganttchartHelper.ejGanttChart("removeConnectorline", connectorLineId);
                               
                                proxy._updateConnectorLineCollection(connectorLineId);
                                predecessor.to = nId;
                                proxy._updateConnectorLineId(parentGanttRecord, childGanttRecord, predecessor);                                                                
                            }
                            else { predecessor.to = nId; }
                        }

                        else if (predecessor.from == cId) {
                            parentGanttRecord = flatRecords[cIndex];
                            childGanttRecord = flatRecords[ids.indexOf(predecessor.to)];                            
                            proxy._connectorlineIds = [];
                            proxy._updatedConnectorLineCollection = [];
                            //Condition to check connector line existing in DOM before remove it
                            if (currentViewData.indexOf(parentGanttRecord) > -1 && currentViewData.indexOf(childGanttRecord) > -1) {
                                var connectorLineId = "parent" + predecessor.from + "child" + predecessor.to;
                                proxy._$ganttchartHelper.ejGanttChart("removeConnectorline", connectorLineId);
                               
                                proxy._updateConnectorLineCollection(connectorLineId);
                                predecessor.from = nId;
                                proxy._updateConnectorLineId(parentGanttRecord, childGanttRecord, predecessor);                                
                            }
                            else { predecessor.from = nId; }

                            if (!ej.isNullOrUndefined(childGanttRecord)) {
                                var predecessorName = proxy._predecessorToString(childGanttRecord.predecessor, childGanttRecord);
                                childGanttRecord.predecessorsName = predecessorName;
                                childGanttRecord.item[model.predecessorMapping] = predecessorName;                               
                                proxy.refreshGanttRecord(childGanttRecord);
                            }
                        }
                    }                    
                }
                proxy._isLastRefresh = true;
                proxy._$treegridHelper.ejTreeGrid("setUpdatedRecords", model.flatRecords, model.updatedRecords, model.ids, model.parentRecords, this.dataSource());
                proxy._$ganttchartHelper.ejGanttChart("setUpdatedRecords", model.currentViewData, model.updatedRecords, model.flatRecords, model.ids);                
                proxy.refreshGanttRecord(record);
                proxy._updateLastInsertedId(record.taskId);
                if (proxy.isCriticalPathEnable == true) {
                    proxy._$ganttchartHelper.ejGanttChart("criticalDataMapping", proxy.criticalPathCollection, true, proxy.detailPredecessorCollection, proxy.collectionTaskId);
                    proxy._$ganttchartHelper.ejGanttChart("criticalConnectorLine", proxy.criticalPathCollection, proxy.detailPredecessorCollection, true, proxy.collectionTaskId);
                }
                return true;
            }                 
        },
        //to get the selected child records alone from a parent record
        _selectedChildRecord: function (childRecords, selectedRecords) {
            var proxy = this;
            for (var i = 0; i < childRecords.length; i++) {
                if (childRecords[i].isSelected) {
                    selectedRecords.push(childRecords[i]);
                }
                if (childRecords[i].hasChildRecords) {
                    proxy._selectedChildRecord(childRecords[i].childRecords, selectedRecords)
                }
            }
        },
        //to skip child records for indenting if its parent record is also selected
        _checkIndentOutdent: function (data, index) {
            var proxy = this;
            if (data.hasChildRecords) {
                var selectedRecords = [];
                proxy._selectedChildRecord(data.childRecords, selectedRecords)
                index = index + selectedRecords.length;
            }
            return index;
        },
        _sendIndentRequest: function () {

            var proxy = this,
                model = proxy.model,
                records = proxy.getCurrentData(),
                args = {},
                eveargs = {},
                previousGanttRecord,
                isRefresh = false,
                treeGridObject = proxy._$treegridHelper.ejTreeGrid("instance");
            proxy.cancelEditCell();
            if (ej.isNullOrUndefined(records) || records.length == 0) {
                alert(proxy._alertTexts["indentAlert"]);
            }
            else {
                args.data = records;
                args.requestType = "indent";
                if (proxy._trigger("actionBegin", args))
                    return
                else {
                    for (var i = 0; i < records.length; i++) {
                        var data = records[i];
                        args.data = data;
                        previousGanttRecord = model.flatRecords[model.flatRecords.indexOf(data) - 1];
                        //to skip indenting for 0 index selected item and its child items
                        if (ej.isNullOrUndefined(previousGanttRecord)) {
                            i = proxy._checkIndentOutdent(data, i);
                            continue;
                        }
                        //to disable indenting for immediate child record
                        var selectedRowIndex = $.inArray(data, previousGanttRecord.childRecords);
                        if (selectedRowIndex != -1) {
                            i = proxy._checkIndentOutdent(data, i);
                            continue;
                        }
                        if (data.parentItem) {
                            var childIndex = data.parentItem.childRecords.indexOf(data);
                            data.parentItem.childRecords.splice(childIndex, 1);
                            if (!model.parentTaskIdMapping)
                                data.parentItem.item[model.childMapping].splice(childIndex, 1);
                        } else {
                            if (this.dataSource() instanceof ej.DataManager) {
                                if (this.dataSource().dataSource.offline && this.dataSource().dataSource.json) {
                                    var dataSourceIndex = this.dataSource().dataSource.json.indexOf(data.item);
                                    if (!model.parentTaskIdMapping)
                                        this.dataSource().dataSource.json.splice(dataSourceIndex, 1);
                                }
                                else if (proxy._isDataManagerUpdate) {
                                    var dataSourceIndex = proxy._jsonData.indexOf(data.item);
                                    if (!model.parentTaskIdMapping) {
                                        proxy._jsonData = proxy._$treegridHelper.ejTreeGrid("getUpdatedDatamanagerData");
                                        proxy._jsonData.splice(dataSourceIndex, 1);
                                    }
                                }
                            }
                            else {
                                var dataSourceIndex = this.dataSource().indexOf(data.item);
                                if (!model.parentTaskIdMapping)
                                    this.dataSource().splice(dataSourceIndex, 1);
                            }
                        }
                        if (data.level === previousGanttRecord.level) {
                            if (previousGanttRecord.childRecords) {
                                if (!previousGanttRecord.expanded) {
                                    previousGanttRecord.childRecords.splice(previousGanttRecord.childRecords.length, 0, data);
                                    data.parentItem = previousGanttRecord;
                                    if (!model.parentTaskIdMapping)
                                        previousGanttRecord.item[model.childMapping].splice(previousGanttRecord.childRecords.length, 0, data.item);
                                    else
                                        data.item[model.parentTaskIdMapping] = previousGanttRecord.taskId;
                                }
                            } else {
                                previousGanttRecord.childRecords = [];
                                previousGanttRecord.childRecords.push(data);
                                previousGanttRecord.expanded = true;
                                previousGanttRecord.taskType = ej.Gantt.TaskType.FixedDuration;
                                previousGanttRecord.effortDriven = "false";
                                data.parentItem = previousGanttRecord;
                                previousGanttRecord.item[model.childMapping] = [];
                                if (!model.parentTaskIdMapping)
                                    previousGanttRecord.item[model.childMapping].push(data.item);
                                else
                                    data.item[model.parentTaskIdMapping] = previousGanttRecord.taskId;
                            }
                        } else if (previousGanttRecord.level - data.level === 1) {
                            previousGanttRecord.parentItem.childRecords.splice(previousGanttRecord.parentItem.childRecords.length, 0, data);
                            if (!model.parentTaskIdMapping)
                                previousGanttRecord.parentItem.item[model.childMapping].splice(previousGanttRecord.parentItem.childRecords.length, 0, data.item);
                            else
                                data.item[model.parentTaskIdMapping] = previousGanttRecord.parentItem.taskId;
                            data.parentItem = previousGanttRecord.parentItem;
                        } else if (previousGanttRecord.level - data.level > 1) {

                            var parentItem = proxy.getParentItem(previousGanttRecord, data.level);
                            parentItem.childRecords.splice(parentItem.childRecords.length, 0, data);
                            if (!model.parentTaskIdMapping)
                                parentItem.item[model.childMapping].splice(parentItem.childRecords.length, 0, data.item);
                            else
                                data.item[model.parentTaskIdMapping] = parentItem.taskId;
                            data.parentItem = parentItem;

                        }

                        if (data.parentItem.isMilestone) {
                            data.parentItem.isMilestone = false;
                        }
                        previousGanttRecord.hasChildRecords = previousGanttRecord.childRecords ? previousGanttRecord.childRecords.length > 0 : false;
                        data.level += 1;

                        if (treeGridObject._searchString.length > 0 || treeGridObject.model.sortSettings.sortedColumns.length > 0) {
                            isRefresh = true;
                        }
                        proxy.updateLevel(data, +1, isRefresh);

                        if (!isRefresh)
                            proxy.refreshGanttRecord(data);

                        //update parent recordsCollections
                        if (previousGanttRecord.level === 0) {
                            if (model.parentRecords.indexOf(previousGanttRecord) === -1) {
                                model.parentRecords.push(previousGanttRecord);
                            }
                        }
                        if (data.level > 0) {
                            if (model.parentRecords.indexOf(data) !== -1) {
                                var idx = model.parentRecords.indexOf(data);
                                model.parentRecords.splice(idx, 1);
                            }
                        }
                        //Update parentitem
                        if (data.parentItem && data.parentItem.isAutoSchedule) {
                            proxy._updateParentItem(data);
                        }
                        else if (data.parentItem && !data.parentItem.isAutoSchedule)
                            proxy._updateManualParentItem(data);
                        //Remove child predecessor from Parent item
                        if (data.parentItem && data.parentItem.predecessor && model.predecessorMapping) {
                            proxy._updatePredecessorOnIndentOutdent(data.parentItem);
                        }
                        if (!isRefresh)
                            proxy.refreshGanttRecord(previousGanttRecord);



                        if (!proxy.getExpandStatus(data)) {
                            var expanargs = {};
                            expanargs.expanded = true;
                            expanargs.data = data.parentItem;
                            proxy.expanding(expanargs);
                        }
                        if (model.enableWBS) {
                            var parentVal = data.parentItem.WBS,
                                inRowIndex = data.parentItem.childRecords.length,
                                target = [data];
                            //Updating WBS for the indent record
                            proxy.reCalculateWBS(target, inRowIndex, parentVal);
                            //Updating WBS for corresponding below records
                            proxy.updateWBSdetails(data.parentItem);
                        }
                        i = proxy._checkIndentOutdent(data, i);
                    }                    
                    proxy._$treegridHelper.ejTreeGrid("setUpdatedRecords", model.flatRecords, model.updatedRecords, model.ids, model.parentRecords, this.dataSource());
                    if (isRefresh) {
                        args.requestType = "indent";
                        //update oudented reocords as per searching and sorting
                        proxy._$treegridHelper.ejTreeGrid("processBindings", args);
                        var tempArgs = {};
                        tempArgs.requestType = ej.TreeGrid.Actions.Refresh;
                        proxy._$treegridHelper.ejTreeGrid("sendDataRenderingRequest", tempArgs);
                        proxy.model.updatedRecords = proxy.getUpdatedRecords();
                        proxy.model.currentViewData = proxy.getCurrentViewData();
                        proxy._$ganttchartHelper.ejGanttChart("setUpdatedRecords", model.currentViewData, model.updatedRecords, model.flatRecords, model.ids);
                        proxy._$ganttchartHelper.ejGanttChart("refreshHelper", model.currentViewData, model.updatedRecords, proxy._totalCollapseRecordCount);
                        proxy.updateAltRow(model.updatedRecords, 0, 1);
                    }
                    if (model.predecessorMapping) {
                        proxy._refreshConnectorLines(false, true, false);
                    }
                    var data = records[records.length - 1];
                    //row selection    
                    //for single row selection with ctrlKey
                    if (records.length == 1 && !proxy._$treegridHelper.ejTreeGrid("instance")._multiSelectCtrlRequest && model.selectionMode != "cell") {
                        var rowToindex = model.updatedRecords.indexOf(data);
                        var $ganttChartRows = proxy.getGanttChartRows();
                        args = {
                            rowElement: $ganttChartRows.eq(rowToindex),
                            data: proxy.model.selectedItem,
                            recordIndex: rowToindex
                        };

                        proxy._$ganttchartHelper.ejGanttChart("selectRows", args.recordIndex);
                        proxy._$treegridHelper.ejTreeGrid("selectRows", args.recordIndex);
                        this.selectedItem(args.data);
                        this.selectedRowIndex(args.recordIndex);
                        if (model.allowSelection)
                            proxy.updateIndentOutdentOption(data);
                    }
                    if (records.length > 1) {
                        if (treeGridObject._searchString.length > 0) {
                            //to select multiple rows while indenting after search
                            var itemIndex = [],
                                selectedIndex = records.filter(function (record) {
                                    itemIndex.push(model.updatedRecords.indexOf(record));
                                });
                            proxy.selectMultipleRows(itemIndex);
                        }
                        proxy._multipleIndentOutdentOption(model.selectedItems);
                    }
                    eveargs.data = data;
                    eveargs.requestType = "indent";
                    var index = $.map(proxy._actionCompleteData, function (data, index) {
                        if (data.taskId == args.data.taskId) {
                            return index;
                        }
                    });
                    index.length && proxy._actionCompleteData.splice(index[0], 1);
                    if (proxy._actionCompleteData.length) {
                        eveargs.updatedRecords = proxy._actionCompleteData;
                        proxy._actionCompleteData = [];
                    }
                    this._trigger("actionComplete", eveargs);
                    if (this.isCriticalPathEnable == true) {
                        proxy._$ganttchartHelper.ejGanttChart("criticalConnectorLine", this.criticalPathCollection, this.detailPredecessorCollection, false, this.collectionTaskId);
                        this.showCriticalPath(true);
                    }                    
                }
            }
        },
        
        
        
        

        
        //get the parentItem of selected ganttRecord to perform the indent operation
        getParentItem:function(ganttRecord,level) {

            var proxy = this;

            if (ganttRecord.parentItem.level === level)
                return ganttRecord.parentItem;

            return proxy.getParentItem(ganttRecord.parentItem, level);
        },

        //Change the position or index for the outdent element 
        getSubChangeIndex: function (itemLevel, itemIndex, item) {
            var proxy = this, changetoIndex;
            for (var items = 0; items < proxy.model.updatedRecords.length; items++) {
                if (proxy.model.updatedRecords[items].level == itemLevel && proxy.model.updatedRecords[items].index > itemIndex) {
                    if (item.parentItem && proxy.model.updatedRecords[items].parentItem.taskId == item.parentItem.taskId)
                        changetoIndex = proxy.model.updatedRecords[items].index;
                    break;
                }
            }
            return changetoIndex;
        },

        //get the next sample level item from 
        _nextSameLevelItem:function(data,totRecords)
        {
            var proxy = this,
                level = data.parentItem.level, dataIndex = totRecords.indexOf(data), nextItem;
            for (var i = dataIndex; i < totRecords.length; i++)
            {
                if (level === totRecords[i].level || level > totRecords[i].level) {
                    nextItem = totRecords[i];
                    break;
                }
            }
            return nextItem;
        },

        //to get records in outdent order 
        _getOutdentItem: function () {
            var proxy = this,
              model = proxy.model,
            selectedRecords = [], orderedRecords = [], currentRowIndex,
            updatedRecords = proxy.getUpdatedRecords();
            if (proxy.model.selectionMode == "row") {
                selectedRecords = model.flatRecords.filter(function (record) {
                    return record.isSelected;
                });
                for (var i = selectedRecords.length - 1; i >= 0; i--) {
                    orderedRecords.push(selectedRecords[i]);
                }
                return orderedRecords;
            }
            else {
                 currentRowIndex = proxy._rowIndexOfLastSelectedCell;
                if (currentRowIndex != -1)
                    return updatedRecords && [updatedRecords[currentRowIndex]];
            }           
        },
        //to get parent selection status to skip outdent
        _getParentSelectionStatus: function (record) {
            var parentRecord = !ej.isNullOrUndefined(record)? record.parentItem : null;
            if (parentRecord != null) {
                if (parentRecord.isSelected === true) {
                   return true
                }
                else
                    return this._getParentSelectionStatus(parentRecord.parentItem);
            }            
        },
        //Indent operation for gantt records
        _sendOutdentRequest: function () {
            var proxy = this,
                model = proxy.model,
                records = proxy._getOutdentItem(),
                args = {},
                eveargs = {},
                updateNextItem,
                rowNextItem,
                updateInsertIndex,
                rowInsertIndex,
                dataUpdatedRecordIndex,
                dataRowIndex,
                outParent,
                childDataIndex,
                insertParentItem,
                rowNextItemChildIndex,
                dataChildCount, splicedRows, splicedIds;
            proxy.cancelEditCell();
            if (ej.isNullOrUndefined(records) || records.length == 0) {
                alert(proxy._alertTexts["outdentAlert"]);
            }
            else{
            args.data = records;
            args.requestType = "outdent";
            if (proxy._trigger("actionBegin", args) || model.editSettings.allowIndent == false) return
            for (var count = 0; count < records.length; count++) {
                var data = records[count];
                args.data = data;
                //to skip outdent for level 0 record/ to skip indenting of child record with 0 level selected parent
                if (proxy._getParentSelectionStatus(data) || data.level == 0) {
                    continue;
                }
                else {
                        //find where to insert data
                        rowNextItem = proxy._nextSameLevelItem(data, model.flatRecords);
                        dataRowIndex = model.flatRecords.indexOf(data);

                        outParent = data.parentItem;
                        childDataIndex = data.parentItem.childRecords.indexOf(data);
                        insertParentItem = data.parentItem.parentItem;
                        rowNextItemChildIndex = insertParentItem && data.parentItem.parentItem.childRecords.indexOf(rowNextItem);

                        //remove data from current parent item
                        data.parentItem.childRecords.splice(childDataIndex, 1);

                        if(!model.parentTaskIdMapping)
                            data.parentItem.item[model.childMapping].splice(childDataIndex, 1);

                        if (data.parentItem.childRecords.length == 0) {

                            data.parentItem.childRecords = null;
                            data.parentItem.expanded = false;
                            data.parentItem.hasChildRecords = false;
                        }
                        else
                        {
                            if (data.parentItem && data.parentItem.isAutoSchedule)
                                proxy._updateParentItem(data.parentItem.childRecords[0]);
                            else if (data.parentItem && !data.parentItem.isAutoSchedule)
                                proxy._updateManualParentItem(data.parentItem.childRecords[0]);
                        }

                        //add to next parent item
                        if (insertParentItem) {
                            if (rowNextItemChildIndex != -1)
                            insertParentItem.childRecords.splice(rowNextItemChildIndex, 0, data);
                            else
                                insertParentItem.childRecords.push(data);
                            if (!model.parentTaskIdMapping) {
                                if (rowNextItemChildIndex != -1)
                                insertParentItem.item[model.childMapping].splice(rowNextItemChildIndex, 0, data.item);
                            else
                                    insertParentItem.item[model.childMapping].push(data.item);
                            }
                            else
                                data.item[model.parentTaskIdMapping] = insertParentItem.taskId;

                            data.parentItem = insertParentItem;
                        } else {

                            if (this.dataSource() instanceof ej.DataManager) {
                                if (this.dataSource().dataSource.offline && this.dataSource().dataSource.json) {
                                    if (!model.parentTaskIdMapping)
                                        this.dataSource().dataSource.json.push(data.item);
                                }
                                else if (proxy._isDataManagerUpdate) {
                                    if (!model.parentTaskIdMapping) {
                                        proxy._jsonData = proxy._$treegridHelper.ejTreeGrid("getUpdatedDatamanagerData");
                                        proxy._jsonData.push(data.item);
                                    }
                                }
                            } else {
                                if (!model.parentTaskIdMapping)
                                    if (rowNextItem) {
                                        var index = this.dataSource().indexOf(rowNextItem.item);
                                        this.dataSource().splice(index, 0, data.item);
                                    }
                                    else
                                        this.dataSource().push(data.item);
                            }
                            data.parentItem = null;
                            if (model.parentTaskIdMapping)
                                data.item[model.parentTaskIdMapping] = null;

                        }

                        //Records updates _rows collections
                        dataChildCount = proxy._$treegridHelper.ejTreeGrid("getChildCount", data, 0);
                        splicedRows = model.flatRecords.splice(dataRowIndex, dataChildCount + 1);
                        splicedIds = model.ids.splice(dataRowIndex, dataChildCount + 1);

                        if (rowNextItem) {
                            rowInsertIndex = model.flatRecords.indexOf(rowNextItem);
                        }
                        else {
                            rowInsertIndex = model.flatRecords.length;
                        }

                        if (data.hasChildRecords && data.childRecords.length > 0) {

                            for (var i = 0; i < splicedRows.length; i++) {
                                model.flatRecords.splice(rowInsertIndex, 0, splicedRows[i]);
                                model.ids.splice(rowInsertIndex, 0, splicedIds[i]);
                                splicedRows[i].level -= 1;
                                rowInsertIndex++;
                                var index = $.map(proxy._actionCompleteData, function (data, index) {
                                    if (data.taskId == splicedRows[i].taskId) {
                                        return index;
                                    }
                                });
                                if (index.length)
                                    proxy._actionCompleteData[index[0]] = splicedRows[i];
                                else
                                    proxy._actionCompleteData.push(splicedRows[i]);
                            }
                        }
                        else {
                            model.flatRecords.splice(rowInsertIndex, 0, splicedRows[0]);
                            model.ids.splice(rowInsertIndex, 0, splicedIds[0]);
                            splicedRows[0].level -= 1;
                        }
                        //update parentitem of selected item after changing of its child 
                        if (data.parentItem) {
                            //change the structure of milestone after outdent
                            if (data.parentItem.isMilestone) {
                                data.parentItem.isMilestone = false;
                            }
                            if (data.parentItem && data.parentItem.isAutoSchedule)
                                proxy._updateParentItem(data);
                            else if (data.parentItem && !data.parentItem.isAutoSchedule)
                                proxy._updateManualParentItem(data);
                        }

                        if (data.hasChildRecords) {
                            if (data.isAutoSchedule)
                                proxy._updateParentItem(data, null, true);
                            else
                                proxy._updateManualParentItem(data, null, true);
                        }

                        //update parent recordsCollections
                        if (data.level === 0) {
                            if (model.parentRecords.indexOf(data) === -1) {
                                model.parentRecords.push(data);
                            }
                        }

                        //update predecessor
                        if (data.predecessor && data.predecessor.length > 0 && model.predecessorMapping && data.hasChildRecords) {
                            proxy._updatePredecessorOnIndentOutdent(data);
                        }

                        if (model.enableVirtualization) {
                            model.updatedRecords = proxy._$treegridHelper.ejTreeGrid("getExpandedRecords", model.flatRecords);
                        }
                        else {
                            model.updatedRecords = model.flatRecords.slice();
                        }
                        var oldNxtSibling = outParent.childRecords && outParent.childRecords[childDataIndex];
                        if (model.enableWBS) {                           
                            //Updating WBS for the old siblings                            
                            if (oldNxtSibling)
                                proxy.updateWBSdetails(oldNxtSibling, true);
                            //Updating WBS for other records that are below the outdented item
                            proxy.updateWBSdetails(outParent);
                            //Again update the WBS for the updated WBSPredecessor value
                            if (oldNxtSibling)
                                proxy.updateWBSdetails(oldNxtSibling, true, true);
                        }
                        //Refreshing the Gantt and TreeGrid data
                        proxy._$treegridHelper.ejTreeGrid("setUpdatedRecords", model.flatRecords, model.updatedRecords, model.ids, model.parentRecords, this.dataSource());
                        if (oldNxtSibling) {
                            proxy._$treegridHelper.ejTreeGrid("updateSerialNumber", dataRowIndex);
                            model.enableSerialNumber && proxy._$treegridHelper.ejTreeGrid("updateSerialNumberPredecessors", dataRowIndex);
                        }
                    }
                }
                args.requestType = "outdent";
                //update oudented reocords as per searching and sorting
                proxy._$treegridHelper.ejTreeGrid("processBindings", args);
                var tempArgs = {};
                tempArgs.requestType = ej.TreeGrid.Actions.Refresh;
                proxy._$treegridHelper.ejTreeGrid("sendDataRenderingRequest", tempArgs);

                proxy.model.updatedRecords = proxy.getUpdatedRecords();
                proxy.model.currentViewData = proxy.getCurrentViewData();
                proxy._$ganttchartHelper.ejGanttChart("setUpdatedRecords", model.currentViewData, model.updatedRecords, model.flatRecords, model.ids);
                if (proxy.model.predecessorMapping) {
                    proxy._refreshConnectorLines(false, true, false);
                }
                proxy._$ganttchartHelper.ejGanttChart("refreshHelper", model.currentViewData, model.updatedRecords, proxy._totalCollapseRecordCount);
                proxy.updateAltRow(model.updatedRecords, 0, 1);
                var data = records[records.length - 1];
                //   Making the outdented row as selected row                        
                if (records.length == 1 && model.selectionMode != "cell") {
                    var rowToindex = model.updatedRecords.indexOf(data);
                    var $ganttChartRows = proxy.getGanttChartRows();
                    args = {
                        data: proxy.model.selectedItem,
                        recordIndex: rowToindex
                    };
                    proxy._$ganttchartHelper.ejGanttChart("selectRows", args.recordIndex);
                    proxy._$treegridHelper.ejTreeGrid("selectRows", args.recordIndex);
                    this.selectedItem(args.data);
                    this.selectedRowIndex(args.recordIndex);
                    if (model.allowSelection)
                        proxy.updateIndentOutdentOption(data);
                }
                if (model.selectionMode == "cell" && model.selectionType == "single") {
                    proxy._rowIndexOfLastSelectedCell = model.updatedRecords.indexOf(data);
                    proxy.selectCells([{ rowIndex: model.updatedRecords.indexOf(data) , cellIndex: model.selectedCellIndexes[0].cellIndex}]);
                }
                if (records.length > 1) {
                    if (proxy._$treegridHelper.ejTreeGrid("instance")._searchString.length > 0) {
                        //to select multiple rows while indenting after search
                        var itemIndex = [],
                            selectedIndex = records.filter(function (record) {
                                itemIndex.push(model.updatedRecords.indexOf(record));
                            });
                        proxy.selectMultipleRows(itemIndex);
                    }
                    proxy._multipleIndentOutdentOption(model.selectedItems);
                }
                eveargs.data = data;
                eveargs.requestType = "outdent";
                var index = $.map(proxy._actionCompleteData, function (task, index) {
                    if (task.taskId == data.taskId) {
                        return index;
                    }
                });
                index.length && proxy._actionCompleteData.splice(index[0], 1);
                if (proxy._actionCompleteData.length) {
                    eveargs.updatedRecords = proxy._actionCompleteData;
                    proxy._actionCompleteData = [];
                }
                this._trigger("actionComplete", eveargs);
                if (this.isCriticalPathEnable == true) {
                    this.showCriticalPath(true, true);
                    proxy._$ganttchartHelper.ejGanttChart("criticalConnectorLine", this.criticalPathCollection, this.detailPredecessorCollection, true, this.collectionTaskId);
                }
            }            
        },
        
        _refreshChildLevel: function (ganttRecord) {

            var proxy = this,
                count = 0,
                childRecords = ganttRecord.childRecords,
                length = childRecords.length,
                record;

            for (count = 0; count < length; count++) {
                record = childRecords[count];                
                proxy.refreshGanttRecord(record);
                if (record.hasChildRecords) {
                    proxy._refreshChildLevel(record);
                }
            }
        },

        _updateChildLevel:function(ganttRecord) {

            var proxy = this,
                count = 0,
                childRecords = ganttRecord.childRecords,
                length = childRecords.length,
                record;
            
            for (count = 0; count < length; count++) {
                record = childRecords[count];                
                record.level = record.level - 1;
                // proxy.refreshGanttRecord(record);
                if (record.hasChildRecords) {
                    proxy._updateChildLevel(record);
                }
            }
        },

        _removeChildRecords:function(ganttRecord,index){

            if (ganttRecord.parentItem) {
                var proxy = this,
                    model = proxy.model,
                    childIndex = 0,
                    record,
                    addedChildGanttRecordCount = 0,
                    length = 0,
                    parentChildRecords = ganttRecord.parentItem.childRecords,
                    parentChildRecordsLength = parentChildRecords && parentChildRecords.length;

                for (childIndex = index; childIndex < parentChildRecordsLength; childIndex++) {

                    record = parentChildRecords[childIndex];


                    if (record) {

                        if (ganttRecord.childRecords) {

                            length = ganttRecord.childRecords.length;
                            ganttRecord.childRecords.splice(length, 0, record);
                            if (!model.parentTaskIdMapping)
                                ganttRecord.item[model.childMapping].splice(length, 0, record.item);
                            else
                                record.item[model.parentTaskIdMapping] = ganttRecord.taskId;
                        } else {
                            ganttRecord.childRecords = [];
                            ganttRecord.item[model.childMapping] = [];
                            ganttRecord.childRecords.push(record);
                            if (!model.parentTaskIdMapping)
                                ganttRecord.item[model.childMapping].push(record.item);
                            else
                                record.item[model.parentTaskIdMapping] = ganttRecord.taskId;
                        }
                        record.parentItem = ganttRecord;                                             
                        addedChildGanttRecordCount++;
                    }
                }

                if (ganttRecord.parentItem.childRecords) {

                    ganttRecord.parentItem.childRecords.splice(index, addedChildGanttRecordCount);
                    if(!model.parentTaskIdMapping)
                        ganttRecord.parentItem.item[model.childMapping].splice(index, addedChildGanttRecordCount);
                    if (ganttRecord.parentItem.childRecords.length == 0) {
                        ganttRecord.parentItem.childRecords = null;
                        ganttRecord.parentItem.expanded = false;
                        ganttRecord.parentItem.hasChildRecords = false;
                        proxy.refreshGanttRecord(ganttRecord.parentItem);
                    }
                }
            }
        },

        updateChildGanttRecordLevel: function (data,index) {
            var childIndex = 0, proxy = this, model = proxy.model,
                parentChildRecords = data.parentItem&& data.parentItem.parentItem&& data.parentItem.parentItem.childRecords,
                parentChildRecordsLength =parentChildRecords&&parentChildRecords.length,
                addedChildGanttRecordCount = 0;
            for (childIndex = index; childIndex < parentChildRecordsLength; childIndex++) {
                var childGanttRecord = parentChildRecords[childIndex];
                if (childGanttRecord.childRecords) {
                    childGanttRecord.childRecords.splice(childGanttRecord.childRecords.length, 0, childGanttRecord);
                    childGanttRecord.item[model.childMapping].splice(childGanttRecord.childRecords.length, 0, childGanttRecord.item);
                }
                else {
                    childGanttRecord.childRecords = [];
                    childGanttRecord.item[model.childMapping] = [];
                    if (childGanttRecord) {
                        childGanttRecord.childRecords.push(childGanttRecord);
                        childGanttRecord.item[model.childMapping].push(childGanttRecord.item);
                    }
                }
                proxy.refreshGanttRecord(data.parentItem);
                data.parentItem = childGanttRecord;
                ++addedChildGanttRecordCount;
            }
            data.parentItem.childRecords.splice(index, addedChildGanttRecordCount);
            if (data.parentItem.childRecords.length == 0) {
                data.parentItem.childRecords = null;
                data.parentItem.expanded = false;
                data.parentItem.hasChildRecords = false;
            }

            proxy.refreshGanttRecord(data.parentItem);

        },

        updateLevel: function (childGanttRecord, offset, isRefresh) {
            var proxy = this,
                count = 0,
                childRecords = childGanttRecord.childRecords,
                length =childRecords&& childRecords.length,
                ganttRecord;
            for (count; count < length; count++) {
                ganttRecord = childRecords[count];
                ganttRecord.level += offset;
                if (!isRefresh)
                    proxy.refreshGanttRecord(ganttRecord);
                if (ganttRecord.childRecords) 
                    proxy.updateLevel(ganttRecord, offset, isRefresh);
            }
        },

        getExpandStatus: function (record) {

            var parentRecord = record.parentItem;

            if (parentRecord != null) {

                if (parentRecord.expanded === false) {
                    return false;
                } else if (parentRecord.parentItem) {

                    if (parentRecord.parentItem.expanded === false) {
                        return false;
                    } else {
                        return this.getExpandStatus(parentRecord.parentItem);
                    }

                } else return true;
            } else return true;
        },
        subContextMenuAction: function (args) {
            var proxy = this,
                model = proxy.model,
            data = $.extend(true, {}, proxy._contextMenuSelectedItem.item), rowPosition;
            if (!model.durationUnitMapping && model.durationMapping)
                data[model.durationMapping] = this._getDurationStringValue(this._contextMenuSelectedItem);
            delete data[model.childMapping];
            delete data[model.predecessorMapping];
            delete data["WBSPredecessor"];
            delete data[model.taskNameMapping];
            
            if (args.position === "Below") {
                rowPosition = ej.Gantt.RowPosition.BelowSelectedRow;
            } else {
                rowPosition = ej.Gantt.RowPosition.AboveSelectedRow;
            }
            /*Assign or update WBS value*/
            if (model.enableWBS)
                data["WBS"] = proxy._getNewWBSid(rowPosition);
            proxy.addRecord(data, rowPosition);
        },

        /* To recalculate the WBS value */
        reCalculateWBS: function (selectedRecords, lastDigit, parentWBS) {
            var proxy = this, model = proxy.model, final;

            if (parentWBS) {
                for (var i = 0; i < selectedRecords.length; i++) {
                    final = lastDigit + i;
                    selectedRecords[i]["WBS"] = parentWBS + "." + final;
                    selectedRecords[i]["item"]["WBS"] = parentWBS + "." + final;
                    if (model.enableWBSPredecessor && model.predecessorMapping)
                        proxy._getPredecessorIds(selectedRecords[i]);
                    proxy.refreshGanttRecord(selectedRecords[i]);
                    if (selectedRecords[i].hasChildRecords)
                        proxy._updateChildWBS(selectedRecords[i]);
                }
            }
            else {
                for (var i = 0; i < selectedRecords.length; i++) {
                    final = (lastDigit + i).toString();
                    selectedRecords[i]["WBS"] = final;
                    selectedRecords[i]["item"]["WBS"] = final;
                    if (model.enableWBSPredecessor && model.predecessorMapping)
                        proxy._getPredecessorIds(selectedRecords[i]);
                    proxy.refreshGanttRecord(selectedRecords[i]);
                    if (selectedRecords[i].hasChildRecords)
                        proxy._updateChildWBS(selectedRecords[i]);
                }
            }
        },

        _updateChildWBS: function (parentRecord) {
            var proxy = this, model = proxy.model,
                childRecs = parentRecord.childRecords,
                pWBS = parentRecord["WBS"];
            for (var c = 0; c < childRecs.length; c++) {
                childRecs[c]["WBS"] = pWBS + "." + (c + 1);
                childRecs[c]["item"]["WBS"] = pWBS + "." + (c + 1);
                if (model.enableWBSPredecessor && model.predecessorMapping)
                    proxy._getPredecessorIds(childRecs[c]);
                proxy.refreshGanttRecord(childRecs[c]);
                if (childRecs[c].hasChildRecords) {
                    proxy._updateChildWBS(childRecs[c]);
                }
            }
        },

        /*Get all the predecessor rows that are matching the taskId*/
        _getPredecessorIds: function (pData) {
            var proxy = this,
                model = proxy.model,
                dataTID = pData.taskId,
                flatDatas = model.flatRecords,
                targetRecords = flatDatas.filter(function (item) {
                    if (item["predecessorsName"]) {
                        var prdcList = item["predecessorsName"].split(',');
                        for (var p = 0; p < prdcList.length; p++) {
                            var ref = prdcList[p].match(/(\d+|[A-z]+)/g),
                                refId = +ref[0];
                            if (refId == dataTID)
                                return item;
                        }
                    }
                });
            if (targetRecords.length) {
                for (var t = 0; t < targetRecords.length; t++) {
                    proxy._$treegridHelper.ejTreeGrid("updateWBSPredecessor", targetRecords[t]);
                    proxy.refreshGanttRecord(targetRecords[t]);
                }
            }
        },

        /*Get new WBS id for newly adding row*/
        _getNewWBSid: function (rowPosition) {
            var proxy = this,
                model = proxy.model,
                data = model.selectionMode == "row" ? model.selectedItem : model.updatedRecords[proxy._rowIndexOfLastSelectedCell], //selected row item before adding the new row
                newWBS;
            if (data)
                newWBS = data["WBS"];//Same WBS value to new row if it is AboveSelectedRow
            else
                newWBS = 1;// While adding new row without selecting the row (i.e. Adding to the TOP)

            //Creating new WBS value to new row if the RowPosition is BelowSelectedRow
            if (data) {
                switch (rowPosition) {
                    case ej.Gantt.RowPosition.BelowSelectedRow:
                        var lastVal = newWBS.lastIndexOf('.') != -1 ? parseInt(newWBS.substr(newWBS.lastIndexOf('.') + 1)) : parseInt(newWBS),
                            newLastVal = lastVal + 1;
                        if (data.parentItem) {
                            var parentVal = data.parentItem ? data.parentItem.WBS : null;
                            newWBS = parentVal + '.' + newLastVal;
                        }
                        else {
                            newWBS = newLastVal;
                        }
                        break;
                    case ej.Gantt.RowPosition.Top:
                        newWBS = 1;
                        break;
                    case ej.Gantt.RowPosition.Bottom:
                        newWBS = (model.parentRecords ? model.parentRecords.length : 0) + 1;
                        break;
                    case ej.Gantt.RowPosition.Child:
                        var childRecordLength = data.childRecords ? data.childRecords.length : 0;
                        newWBS = newWBS + "." + (childRecordLength + 1);
                        break;
                }
            }
            return newWBS.toString();
        },

        _getNewTaskId: function (nextId) {
            var proxy = this,
                ids = proxy.model.viewType == ej.Gantt.ViewType.ResourceView ? proxy._resourceUniqTaskIds : proxy.model.ids,
                newTaskId = ej.isNullOrUndefined(nextId) ? proxy._lastInsertedId > 0 ? proxy._lastInsertedId + 1 : 
                            1 : nextId;
            if (ids.indexOf(newTaskId.toString()) > -1)
               return proxy._getNewTaskId(newTaskId + 1);
            else {                
                return (newTaskId);
            }
        },
        _updateLastInsertedId: function (Id, isNewRow) {
            var proxy = this, newId = isNaN(parseInt(Id)) ? proxy._lastInsertedId < 1 ? 1 : proxy._lastInsertedId : parseInt(Id);
            if (isNewRow)
                proxy._lastInsertedId = proxy._lastInsertedId < newId ? newId : proxy._lastInsertedId + 1;
            else
                proxy._lastInsertedId = proxy._lastInsertedId < newId ? newId : proxy._lastInsertedId;
        },

        contextMenuAction: function (args) {
            var proxy = this;
            if (args.requestType == "contextMenuAdd")
                proxy._sendAddRequest();
            if (args.requestType == "contextMenuIndent")
                proxy._sendIndentRequest();
            if (args.requestType == "contextMenuOutdent")
                proxy._sendOutdentRequest();
            if (args.requestType == "contextMenuDelete") {
                if (this.model.viewType == "resourceView" && args.data.eResourceTaskType == "resourceChildTask")
                    this.deleteResourceChildTask(args.data);
                else
                    proxy._$treegridHelper.ejTreeGrid("deleteRow", null, true, proxy._contextMenuSelectedIndex);
            }
            if (args.requestType == "contextMenuTaskDetails") {
                var editArgs = {};
                editArgs.isResourceView = this.model.viewType == "resourceView";
                editArgs.data = args.data;
                proxy._sendEditRequest(null, editArgs);

            }
        },

        _renderContextMenu: function (e, index, item) {

            var proxy = this,
                eventArgs = {},
                args = {},
                posx,   
				posy, addItemPositionY,addItemIndex,
                contextMenu,
                contextMenuUList,
                coord = proxy._getCoordinate(e),
                length, columnIndex;
            proxy._contextMenuSelectedIndex = index;
            proxy._contextMenuSelectedItem = item;
            proxy._contextMenuEvent = e;
            columnIndex = proxy._$treegridHelper.ejTreeGrid("getCellIndex", e);
            if (!e) e = window.event;

            if (coord.pageX || coord.pageY) {
                posx = coord.pageX;
                posy = coord.pageY;
            } else if (e.clientX || e.clientY) {
                posx = e.clientX + document.body.scrollLeft
                    + document.documentElement.scrollLeft;
                posy = e.clientY + document.body.scrollTop
                    + document.documentElement.scrollTop;
            }

            var ganttOffset = this._$treegridHelper.ejTreeGrid("getOffsetRect", proxy.element[0]);
            ganttOffset.bottom = ganttOffset.top + this.element[0].offsetHeight;
            ganttOffset.right = ganttOffset.left + $(this.element).width();            
            args.requestType = "ContextMenuOpen";
            args.contextMenuItems = proxy._contextMenuItems;
            args.columnIndex = columnIndex;
            args.item = proxy._contextMenuSelectedItem;
            args.targetElement = e;
            args.index = index;
            if (proxy._trigger("contextMenuOpen", args))
                return;

            proxy._activeMenuItemId = null;
            proxy._contextMenuItems = args.contextMenuItems;
            if (proxy._contextMenuItems.length == 0)
                return;
            contextMenu = ej.buildTag("div.e-tgcontextmenu e-js", "", {
                'position': 'absolute',
                'z-index': proxy._$treegridHelper.ejTreeGrid("getMaxZIndex") + 1,
            }, { "id": proxy._id + "_ContextMenu" });
            proxy.model.cssClass && (contextMenu.addClass(proxy.model.cssClass));
            //Get zero th level menu items
            var parentMenuItems = args.contextMenuItems.filter(function (value) {
                if (value.parentMenuId == null || value.parentMenuId == undefined)
                    return true;
            });

            contextMenuUList = ej.buildTag("ul.e-gantt-contextmenu", $.render[proxy._id + "contextMenuTemplate"](parentMenuItems), {
                'margin': '0px',
                'padding-left': '0px',
                'list-style-type':'none'
            }, {
                'data-icon': false,
                'data-role': 'list-divider'
            });
            contextMenu.append(contextMenuUList);
            $(document.body).append(contextMenu);

            var contextMenuHeight = $(contextMenu).outerHeight(),
                contextMenuWidth = $(contextMenu).outerWidth(),
                contextMenuItems = contextMenu.find(".e-menuitem");
            contextMenuItems.width(contextMenuWidth + 2);
            contextMenuWidth = $(contextMenu).outerWidth();
            if (ganttOffset.left > posx || (ganttOffset.right < (posx + contextMenuWidth))) {

                if (ganttOffset.right < (posx + contextMenuWidth)) {
                    posx = posx - contextMenuWidth;
                }
                if (posx < 0) {
                    posx = ganttOffset.left + 10;
                }
            }

            if (ganttOffset.bottom < (posy + contextMenuHeight)) {
                var tempPosY = posy - contextMenuHeight,
                    exceededHeight = (posy + contextMenuHeight) - ganttOffset.bottom,
                    scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                if (tempPosY > ganttOffset.top) {
                    posy = tempPosY;
                } else if ((posy + contextMenuHeight) > (scrollTop + window.innerHeight)) {
                    var extraHeight = (posy + contextMenuHeight) - (scrollTop + window.innerHeight),
                        cTop = posy - extraHeight;
                    if (cTop > 0)
                        posy = parseInt(cTop);
                }
            }

            else if (($(window).height() + $(window).scrollTop()) < posy + contextMenuHeight)
                posy = posy - contextMenuHeight;

            contextMenu.css({ 'left': posx + 'px', 'top': posy + 'px', });
            proxy._$treegridHelper.ejTreeGrid('setFocusOnTreeGridElement');
            $(contextMenu).css({ 'height': 'auto' });
            proxy._on(contextMenu, "contextmenu", function (argsE) {
                argsE.preventDefault();
            });

            //click event handlers for contextmenu items and subcontextmenu items
            $(contextMenuItems).click(function () {
                proxy._contextMenuClickHandler(this);
            });

            //Mouseenter and mouse leave handler for contextmenu items and Subcontextmenuitems
            $(contextMenuItems).mouseenter(function () {
                if (!$(this).hasClass("e-disable")) {
                    contextMenu.find(".e-tgcontextmenu-mouseover").removeClass("e-tgcontextmenu-mouseover");
                    $(this).addClass("e-tgcontextmenu-mouseover");
                    proxy._activeMenuItemId = $(this).attr("id");
                    proxy._showSubContextMenu(this, args.contextMenuItems);
                }
            });

            e.preventDefault();
        },
        //Show SubContext menu for selected Menu items
        _showSubContextMenu: function (element, menuItems) {
            var model = this.model,
                proxy = this,
                currentMenuItem = [],
                menuId = $(element).attr("id"),
                subContextMenu, subContextMenuUList, subMenuItems = [], subContextMenuItems;

            subMenuItems = menuItems.filter(function (value) {
                if (value.menuId == menuId)
                    currentMenuItem = value;
                if (value.parentMenuId == menuId)
                    return true;
            });

            if (!currentMenuItem.parentMenuId)
                $(".e-tginnerContextmenu").remove();

            if (currentMenuItem.parentMenuId) {
                this._removeContextMenu(currentMenuItem, menuItems);
            }

            if (subMenuItems.length > 0) {
                subContextMenu = ej.buildTag("div.e-tginnerContextmenu e-js", "", {
                    'position': 'absolute',
                    'z-index': proxy._$treegridHelper.ejTreeGrid("getMaxZIndex") + 1,
                }, { "id": this._id + "_SubContextMenu" + menuId });
                model.cssClass && (subContextMenu.addClass(model.cssClass));
                subContextMenuUList = ej.buildTag("ul.e-gantt-innercontextmenu", $.render[proxy._id + "contextMenuTemplate"](subMenuItems), {
                    'margin': '0px',
                    'padding-left': '0px'
                }, {
                    'data-icon': false,
                    'type': 'none',
                    'data-role': 'list-divider'
                });
                subContextMenu.append(subContextMenuUList);
                $(document.body).append(subContextMenu);
                subContextMenuItems = subContextMenu.find(".e-menuitem");
                var menuWidth = $(subContextMenu).outerWidth();
                subContextMenuItems.width(menuWidth > 100 ? menuWidth : 100);
                var subMenuOffset = proxy._getSubContextMenuPosition(element, subContextMenu);
                $(subContextMenu).css({ "top": subMenuOffset.top, "left": subMenuOffset.left });
                $(subContextMenuItems).mouseenter(function () {
                    if (!$(this).hasClass("e-disable")) {
                        proxy._showSubContextMenu(this, menuItems);
                        $(this).closest(".e-tginnerContextmenu").find(".e-tgcontextmenu-mouseover").removeClass("e-tgcontextmenu-mouseover");
                        $(this).addClass("e-tgcontextmenu-mouseover");
                        proxy._activeMenuItemId = $(this).attr("id");
                    }
                });
                proxy._on(subContextMenu, "contextmenu", function (argsE) {
                    argsE.preventDefault();
                });
                $(subContextMenuItems).click(function () {
                    proxy._contextMenuClickHandler(this);
                });
            }
        },
        _removeContextMenu: function (menuItem, menuItems) {

            var currentMeuItemContainer = $("#" + this._id + "_SubContextMenu" + menuItem.parentMenuId),
                expandedMenu = $(currentMeuItemContainer).find(".e-tgcontextmenu-mouseover");
            if ($(expandedMenu).length > 0) {
                var innerMenu = menuItems.filter(function (value) {
                    if (value.menuId == $(expandedMenu).attr("id"))
                        return true;
                });
                if (innerMenu.length > 0) {
                    var nextLevelItem = menuItems.filter(function (value) {
                        if (value.parentMenuId == innerMenu[0].menuId)
                            return true;
                    });
                    if (nextLevelItem.length > 0)
                        this._removeContextMenu(nextLevelItem[0], menuItems);
                }
                $("#" + this._id + "_SubContextMenu" + $(expandedMenu).attr("id")).remove();
            }
        },
        _getSubContextMenuPosition: function (element, subMenu) {
            var model = this.model,
                subContextMenuWidth = $(subMenu).outerWidth(),
                 subContextMenuHeight = $(subMenu).outerHeight(),
                elementOffset = this._$treegridHelper.ejTreeGrid("getOffsetRect", element), subMenuOffset = { top: "", left: "" },
                parentElement = $(element).closest(".e-tgcontextmenu"),
                posx, posy,
                contextMenuWidth;
            if (parentElement.length == 0)
                parentElement = $(element).closest(".e-tginnerContextmenu");
            contextMenuWidth = $(parentElement).outerWidth();
            subMenuOffset.top = elementOffset.top - 1;
            subMenuOffset.left = elementOffset.left + $(parentElement).width() + 1;
            subMenuOffset.bottom = subMenuOffset.top + $(element).outerHeight();
            posx = subMenuOffset.left;

            //Edge detection for context menu
            var ganttOffet = this._$treegridHelper.ejTreeGrid("getOffsetRect", this.element[0]);
            ganttOffet.bottom = ganttOffet.top + this.element[0].offsetHeight;
            ganttOffet.right = ganttOffet.left +$(this.element).width();
            if (ganttOffet.left > posx || (ganttOffet.right < (posx + subContextMenuWidth))) {
                if (ganttOffet.right < (posx + subContextMenuWidth)) {
                    posx = posx - contextMenuWidth - subContextMenuWidth;
                }
                if (posx > 0) {
                    subMenuOffset.left = posx;
                }
            }
            if (ganttOffet.bottom < (subMenuOffset.top + subContextMenuHeight)) {
                var tempPosY = subMenuOffset.bottom - subContextMenuHeight,
                    exceededHeight = (subMenuOffset.top + subContextMenuHeight) - ganttOffet.bottom,
                    scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;;
                if (tempPosY > ganttOffet.top) {
                    subMenuOffset.top = tempPosY + 2;
                } else if ((subMenuOffset.top + subContextMenuHeight) > (scrollTop + window.innerHeight)) {
                    var extraHeight = (subMenuOffset.top + subContextMenuHeight) - (scrollTop + window.innerHeight),
                        cTop = subMenuOffset.top - extraHeight;
                    if (cTop > 0)
                        subMenuOffset.top = parseInt(cTop);
                }
            }

            return subMenuOffset;
        },
        //Click event handler for context menu items
        _contextMenuClickHandler: function (target) {
            var choice = $(target).attr('id'),
                proxy = this,
                model = this.model,
                eventArgs = {};
            if (!$(target).hasClass("e-disable") && $(target).find(".e-expander").length == 0) {
                switch (choice) {
                    case "Task":
                        eventArgs.requestType = "contextMenuTaskDetails";
                        eventArgs.data = proxy._contextMenuSelectedItem;
                        proxy.contextMenuAction(eventArgs);
                        proxy._clearContextMenu();
                        break;
                    case "Indent": eventArgs.requestType = "contextMenuIndent";
                        proxy.contextMenuAction(eventArgs);
                        proxy._clearContextMenu();
                        proxy._$treegridHelper.ejTreeGrid('setFocusOnTreeGridElement');
                        break;
                    case "Outdent": eventArgs.requestType = "contextMenuOutdent";
                        proxy.contextMenuAction(eventArgs);
                        proxy._clearContextMenu();
                        proxy._$treegridHelper.ejTreeGrid('setFocusOnTreeGridElement');
                        break;
                    case "Delete": eventArgs.requestType = "contextMenuDelete";
                        eventArgs.data = proxy._contextMenuSelectedItem;
                        proxy.contextMenuAction(eventArgs);
                        proxy._clearContextMenu();
                        proxy._$treegridHelper.ejTreeGrid('setFocusOnTreeGridElement');
                        break;
                    case "Above": eventArgs.requestType = "save";
                        eventArgs.position = "Above";
                        proxy.subContextMenuAction(eventArgs);
                        proxy._clearContextMenu();
                        proxy._$treegridHelper.ejTreeGrid('setFocusOnTreeGridElement');
                        break;
                    case "Below": eventArgs.requestType = "save";
                        eventArgs.position = "Below";
                        proxy.subContextMenuAction(eventArgs);
                        proxy._clearContextMenu();
                        proxy._$treegridHelper.ejTreeGrid('setFocusOnTreeGridElement');
                        break;
                    case "Open":
                        eventArgs.requestType = "contextMenuAdd";
                        proxy.contextMenuAction(eventArgs);
                        proxy._clearContextMenu();
                        proxy._$treegridHelper.ejTreeGrid('setFocusOnTreeGridElement');
                        break;
                    case "Add":
                        if (model.viewType == "resourceView")
                            this.openAddDialog();
                        else
                            proxy._setInitialData();
                        break;
                    default:
                        eventArgs.data = proxy._contextMenuSelectedItem;
                        proxy._triggerMenuEventHandler(choice, eventArgs);
                        proxy._clearContextMenu();
                        break;
                }
            }
        },
        //Call custom context menu event handlers
        _triggerMenuEventHandler:function(menuId,eventArgs){
            var proxy = this,
                contextMenuItems = proxy._contextMenuItems,
                currentMenuItemCollection, menuItem;

            if (!ej.isNullOrUndefined(contextMenuItems)) {
                currentMenuItemCollection = contextMenuItems.filter(function (value) {
                    //convert menu id to string since id accepts only string values
                    if (value.menuId.toString() === menuId)
                        return true;
                });

                if (currentMenuItemCollection.length > 0) {
                    menuItem = currentMenuItemCollection[0];
                    eventArgs.menuId = menuId;
                    var fn = menuItem.eventHandler;
                    if (fn) {
                        if (typeof fn === "string") {
                            fn = ej.util.getObject(fn, window);
                        }
                        if ($.isFunction(fn)) {
                            var args = ej.event("customContextMenuHandler", this.model, eventArgs);
                            fn.call(this, args);
                        }
                    }

                }
            }
        },
        _setInitialData: function () {
            var eventArgs = {}, proxy = this,
                model = proxy.model;
            if (model.flatRecords.length == 0) {
                proxy.addRecord();
                proxy._clearContextMenu();
            }
        },

        updateAltRow: function (ganttRecord, recordIndex, offset) {
            var proxy = this;
            if (proxy.model.enableAltRow) {
                var count = 0,
                currentViewData = proxy.model.currentViewData,
                length = currentViewData.length,
                isAltRow = ganttRecord.isAltRow,
                record,
                $gridRows = $(proxy._gridRows);
            for (count = recordIndex + offset; count < length; count++) {
                if ($($gridRows[count]).css('display') === "none")
                    continue;
                record = currentViewData[count];
                record.isAltRow = !isAltRow;
                isAltRow = record.isAltRow;
                if (isAltRow)
                    $($gridRows[count]).addClass('e-alt-row');
                else
                    $($gridRows[count]).removeClass('e-alt-row');
            }
        }
        },
        renderedEditDialog: function (args) {
            var proxy = this,
                model = this.model,
                columns = (model.viewType == ej.Gantt.ViewType.ProjectView) ? model.columns : proxy._resourceViewColumns,
                length = columns.length,
                fieldData = {};
            switch (args.requestType) {
                case ej.TreeGrid.Actions.Add:
                    var temp = document.createElement('div'),
                        dialog = $("#" + proxy._id + "_dialogAdd");
                    $(temp).addClass("e-addedrow");
                    temp.innerHTML = $.render[proxy._id + "_JSONDialogAddingTemplate"](args.data);
                    $(dialog).html($(temp));
                    var evntArgs = {};
                    evntArgs.cssClass = model.cssClass;
                    evntArgs.enableModal = true;
                    evntArgs.width = "650px";
                    evntArgs.height = "auto";
                    evntArgs.enableResize = false;
                    evntArgs.isResponsive = false;
                    evntArgs.contentSelector = "#" + proxy._id;
                    evntArgs.rtl = model.rtl;
                    evntArgs.showOnInit = false;
                    evntArgs.allowKeyboardNavigation = false;
                    evntArgs.close = function () {
                        $("#" + proxy._id + "AddAreaNotes").data("ejRTE") && $("#" + proxy._id + "AddAreaNotes").ejRTE("destroy");
                    };
                    evntArgs.beforeClose = function (args) {
                        if (proxy._closeAddEditDialog(args, "Add")) {
                            args.cancel = true; // Cancel the add dialog box close.
                            $("#AddDialog_" + proxy._id + "_Cancel").css("pointer-events", "auto");
                        }
                        else
                            proxy._$treegridHelper.ejTreeGrid('setFocusOnTreeGridElement');
                    },
                    title = proxy._editDialogTexts["addFormTitle"];
                    evntArgs.title = title;
                    proxy._editedDialogRecord = {};
                    var tab = $("#" + proxy._id + "AddTab");
                    $(tab).ejTab({
                        headerSize: "25px",
                        height: "310px",
                        heightAdjustMode: ej.Tab.HeightAdjustMode.None,
                        locale: model.locale,
                        cssClass: model.cssClass,
                        allowKeyboardNavigation: model.allowKeyboardNavigation,
                        enableAnimation: false,
                        itemActive: function (args) {
                            var activeHeader = $(args.activeHeader).find("a").attr("href");
                            if (activeHeader == "#" + proxy._id + "AddNotes") {
                                $("#" + proxy._id + "AddAreaNotes_Iframe").height("202");
                            }
                            else if (activeHeader == "#" + proxy._id + "AddCustomFields") {
                                var treeGrid = $("#treegrid" + proxy._id + "customFieldAdd").ejTreeGrid("instance");
                                treeGrid.setModel({ sizeSettings: { width: "620", height: "280px" } });
                            } else if (activeHeader == "#" + proxy._id + "AddPredecessors") {
                                var treeGrid = $("#treegrid" + proxy._id + "predecessorAdd").ejTreeGrid("instance");
                                treeGrid.setModel({ sizeSettings: { width: "620", height: "240px" } });
                            } else if (activeHeader == "#" + proxy._id + "AddResources") {
                                var treeGrid = $("#treegrid" + proxy._id + "resourceAdd").ejTreeGrid("instance");
                                treeGrid.setModel({ sizeSettings: { width: "620", height: "240px" } });
                            }
                        }
                    });
                    
                    $(tab).find("div.e-hidebottom.e-addborderbottom.e-content").css("min-height", "283px");
                    $(tab).find("div.e-content").css("overflow", "visible");
                    var liElement = $(tab).find(".e-addborderbottom .e-bottom-line .e-link"),
						updatedMargin = ($(tab).find(".e-addborderbottom.e-header").outerHeight() / 2 ) - (parseFloat(liElement.css("padding-top")) +  parseFloat(liElement.css("padding-bottom")));
					liElement.css("margin-top", updatedMargin + "px");
                    $(dialog).ejDialog(evntArgs);
                    $(dialog).ejDialog("instance").contentDiv.ejScroller("setModel",{"scrollerSize": 0});
                    var dialogArgs = {};
                    dialogArgs.data = args.data;
                    dialogArgs.rowPosition = model.editSettings.rowPosition;
                    dialogArgs.requestType = "beforeOpenAddDialog";
                    dialogArgs.element = $("#" + proxy._id + "_dialogAdd");
                    if (!proxy._trigger("actionBegin", dialogArgs)) {
                        proxy._isinAddnewRecord = true;
                        for (var columnCount = 0; columnCount < length; columnCount++)
                            fieldData[columns[columnCount].field] = dialogArgs.data[columns[columnCount].mappingName];
                        args.data = fieldData;
                        proxy._refreshEditForm(args);
                        dialogArgs.data = args.data;
                        dialogArgs.requestType = "OpenAddDialog";
                        dialogArgs.element = $("#" + proxy._id + "_dialogAdd");
                        if (!proxy._trigger("actionBegin", dialogArgs)) {
                            var dialogWrapper = $("#" + proxy._id + "_dialogAdd_wrapper");
                            $(dialog).find(".e-addedrow").css("overflow", "visible");
                            dialogWrapper.addClass("e-ganttdialog");
                            $(dialog).ejDialog("refresh");
                            $(dialog).addClass("e-content");//To reolve height update issue when predecessor alone given
                            $(dialog).ejDialog("open");
                        }
                    }
                    $(tab).find("div#"+proxy._id+"AddGeneral.e-content").css({"overflow-y": "auto","overflow-x":"hidden"});
                    proxy._addPosition = dialogArgs.rowPosition;
                    var tempDate = this._getDateFromFormat(model.scheduleStartDate);
                    if (this._getSecondsInDecimal(tempDate) != this._defaultStartTime) {
                        this._setTime(this._defaultStartTime, tempDate);
                    }
                    this._editedDialogRecord.isUpdatedFromDialog = false;
                    var autoSchedule_val = (model.taskSchedulingMode == ej.Gantt.TaskSchedulingMode.Auto) ? true :
                                   (model.taskSchedulingMode == ej.Gantt.TaskSchedulingMode.Manual) ? false :
                                   (model.taskSchedulingMode == ej.Gantt.TaskSchedulingMode.Custom) ? args.data.taskMode == true ? false : true :
                                   model.taskSchedulingMode;
                    proxy._editedDialogRecord.isAutoSchedule = autoSchedule_val;
                    proxy._editedDialogRecord.startDate = args.data.startDate ? this._checkStartDate(new Date(args.data.startDate)) : this._checkStartDate(new Date(tempDate));
                    proxy._editedDialogRecord.endDate = args.data.endDate ? proxy._editedDialogRecord.startDate.getTime() > new Date(args.data.endDate).getTime() ? new Date(proxy._editedDialogRecord.startDate) : new Date(args.data.endDate) : new Date(proxy._editedDialogRecord.startDate);
                    proxy._editedDialogRecord.duration = args.data.duration != "" ? args.data.duration : (model.viewType == ej.Gantt.ViewType.ResourceView) ? 1 : 0;
                    proxy._editedDialogRecord.durationUnit = model.durationUnit;

                    break;
                case ej.TreeGrid.Actions.BeginEdit:
                    var temp = document.createElement('div'),
                        dialog = $("#" + proxy._id + "_dialogEdit");
                    $(temp).addClass("e-editedrow");
                    temp.innerHTML = $.render[proxy._id + "_JSONDialogEditingTemplate"](args.data);
                    $(dialog).html($(temp));
                    var evntArgs = {};
                    evntArgs.cssClass = proxy.model.cssClass;
                    evntArgs.rtl = model.rtl;
                    evntArgs.width = "650px";
                    evntArgs.height = "auto";
                    evntArgs.enableResize = false;
                    evntArgs.isResponsive = false;
                    evntArgs.contentSelector = "#" + proxy._id;
                    evntArgs.enableModal = true;
                    evntArgs.showOnInit = false;
                    evntArgs.allowKeyboardNavigation = false;
                    evntArgs.close = function () {
                        $("#" + proxy._id + "EditAreaNotes").data("ejRTE") && $("#" + proxy._id + "EditAreaNotes").ejRTE("destroy");
                    };
                    evntArgs.beforeClose = function (args) {
                        if (proxy._closeAddEditDialog(args, "Edit")) {
                            args.cancel = true; // Cancel the add dialog box close.
                            $("#EditDialog_" + proxy._id + "_Cancel").css("pointer-events", "auto");
                        }
                        else
                            proxy._$treegridHelper.ejTreeGrid('setFocusOnTreeGridElement');
                    };
                    if (model.viewType == ej.Gantt.ViewType.ResourceView) {
                        var selectedItem = args.data;
                        proxy._resourceEditedRecord = args.data;
                    }
                    else {
                        if (model.selectionMode == "row")
                            var selectedItem = proxy.selectedItem()
                        else
                            var selectedItem = proxy.model.updatedRecords[proxy._rowIndexOfLastSelectedCell];
                    }
                    var title = proxy._editDialogTexts["editFormTitle"];
                    evntArgs.open = function () {
                        var dialog = this, id = this._id;
                        var titleElement = $("#" + id + "_title").children(".e-title");
                        titleElement.width("450px");
                        titleElement.css({ "word-wrap": "normal", "text-overflow": "ellipsis", "white-space": "nowrap", "display": "inline-block", "overflow-x": "hidden", "float": "left" });
                        titleElement.attr("title", title);
                    };
                    evntArgs.title = title;
                    var tab = $("#" + proxy._id + "EditTab");
                    $(tab).ejTab({
                        headerSize: "25px",
                        height: "310px",
                        heightAdjustMode: ej.Tab.HeightAdjustMode.None,
                        locale: model.locale,
                        allowKeyboardNavigation: model.allowKeyboardNavigation,
                        cssClass: model.cssClass,
                        enableAnimation: false,
                        itemActive: function (args) {
                            var activeHeader = $(args.activeHeader).find("a").attr("href");
                            if (activeHeader == "#" + proxy._id + "EditNotes") {
                                $("#" + proxy._id + "EditAreaNotes_Iframe").height("202");
                            }
                            else if (activeHeader == "#" + proxy._id + "EditCustomFields") {
                                var treeGrid = $("#treegrid" + proxy._id + "customFieldEdit").ejTreeGrid("instance");
                                treeGrid.setModel({ sizeSettings: { width: "620", height: "279px" } });
                            } else if (activeHeader == "#" + proxy._id + "EditPredecessors") {
                                var treeGrid = $("#treegrid" + proxy._id + "predecessorEdit").ejTreeGrid("instance");
                                treeGrid.setModel({ sizeSettings: { width: "620", height: "240px" } });
                            } else if (activeHeader == "#" + proxy._id + "EditResources") {
                                var treeGrid = $("#treegrid" + proxy._id + "resourceEdit").ejTreeGrid("instance");
                                treeGrid.setModel({ sizeSettings: { width: "620", height: "240px" } });
                            } 
                        }
                    });
                    $(tab).find("div.e-content").css("overflow", "visible");
                    $(tab).find("div#" + proxy._id + "EditGeneral.e-content").css({ "overflow-y": "auto", "overflow-x": "hidden" });
                    $(tab).find("div.e-hidebottom.e-addborderbottom.e-content").css("min-height", "283px");
					var liElement = $(tab).find(".e-addborderbottom .e-bottom-line .e-link"),
						updatedMargin = ($(tab).find(".e-addborderbottom.e-header").outerHeight() / 2 ) - (parseFloat(liElement.css("padding-top")) +  parseFloat(liElement.css("padding-bottom")));
					liElement.css("margin-top", updatedMargin + "px");
                    $(dialog).ejDialog(evntArgs);
                    $(dialog).ejDialog("instance").contentDiv.ejScroller("setModel", { "scrollerSize": 0 });
                    var dialogArgs = {};
                    dialogArgs.data = args.data;
                    dialogArgs.requestType = "beforeOpenEditDialog";
                    dialogArgs.element = $("#" + proxy._id + "_dialogEdit");
                    if (!proxy._trigger("actionBegin", dialogArgs)) {
                        proxy._editedDialogRecord = jQuery.extend({}, selectedItem);
                        proxy._editedDialogRecord.resourceInfo && (proxy._editedDialogRecord.resourceInfo = jQuery.extend(true, [], selectedItem.resourceInfo));
                        this._editedDialogRecord.isUpdatedFromDialog = false;
                        proxy._refreshEditForm(args);
                        dialogArgs.data = args.data;
                        dialogArgs.requestType = "openEditDialog";
                        dialogArgs.element = $("#" + proxy._id + "_dialogEdit");
                        if (!proxy._trigger("actionBegin", dialogArgs)) {
                            var dialogWrapper = $("#" + proxy._id + "_dialogEdit_wrapper");
                            $(dialog).find(".e-editedrow").css("overflow", "visible");
                            dialogWrapper.addClass("e-ganttdialog");
                            $(dialog).ejDialog("refresh");
                            $(dialog).addClass("e-content");//To reolve height update issue when predecessor alone given
                            $(dialog).ejDialog("open");
                        }
                    }
                    this._editedDialogRecord && (this._editedDialogRecord.isUpdatedFromDialog = false);
                    break;                    
            }
        },

        _closeAddEditDialog: function (args, type) {
            var proxy = this;
            if (proxy._isAddEditDialogSave)
                proxy._isAddEditDialogSave = false;
            else {
                var eventArgs = {};
                if (type === "Add")
                    eventArgs.requestType = "closeAddDialog";
                else
                    eventArgs.requestType = "closeEditDialog";
                return proxy._trigger("actionBegin", eventArgs);
            }
        },
        editFormValidate: function () {
            if ($.isFunction($.validator) && $("#" + this._id + "GeneralEditForm").length > 0)
                return $("#" + this._id + "GeneralEditForm").validate().form();
            return true;
        },

        addFormValidate: function () {
            if ($.isFunction($.validator) && $("#" + this._id + "GeneralAddForm").length > 0)
                return $("#" + this._id + "GeneralAddForm").validate().form();
            return true;
        },
        getCurrentData: function () {
            var proxy = this, currentRowIndex,
                updatedRecords = proxy.getUpdatedRecords();
            //to get selectedRecords
            if (proxy.model.selectionMode == "row") {              
                return proxy.model.selectedItems;
            }
            else {
                currentRowIndex = proxy._rowIndexOfLastSelectedCell;
                if (currentRowIndex != -1)
                    return updatedRecords && [updatedRecords[currentRowIndex]];
            }
        },       
        getCurrentViewData: function () {
            return this._$treegridHelper.ejTreeGrid("getCurrentViewData");
        },

        getUpdatedCurrentViewData: function () {
            return this._$treegridHelper.ejTreeGrid("getUpdatedCurrentViewData");
        },

        getRows: function () {
            return this._$treegridHelper.ejTreeGrid("getRows");
        },
        
        getSelectedCells: function () {
            return this._$treegridHelper.ejTreeGrid("getSelectedCells");
        },

        getGanttChartRows: function() {
            return this._$ganttchartHelper.ejGanttChart("getGanttChartRows");
        },

        getUpdatedRecords: function () {
            return this._$treegridHelper.ejTreeGrid("getUpdatedRecords");
        },

        _getToolBarHeight: function () {
            var toolbarH = 0;
            if (this.model.toolbarSettings.showToolbar) {
                toolbarH = this.element.find(".e-gantttoolbar").height();
            }
            return toolbarH;
        },

        _initValidator: function () {
            var gridObject = this;
            $("#" + this._id + "EditForm").validate({
                errorClass: 'e-field-validation-error',
                errorElement: 'div',
                wrapper: "div",
                errorPlacement: function (error, element) {
                    var $td = element.closest("td"), $container = $(error).addClass("e-error")
                    , $tail = ej.buildTag("div.e-errortail e-toparrow");
                    $td.find(".e-error").remove();
                    element.hasClass("e-numerictextbox") ? $container.insertAfter(element.closest(".e-numeric")) : $container.insertAfter(element);
                    $container.prepend($tail);
                    gridObject.model.editSettings.editMode != "normal" && $container.offset({ left: element.offset().left });
                    $container.fadeIn("slow");
                },

            });
        },

        setValidation: function () {
            this._initValidator();
            for (var i = 0; i < this._columns.length; i++) {
                if (!ej.isNullOrUndefined(this._columns[i]["validationRules"])) {
                    this.setValidationToField(this._columns[i].field, this._columns[i].validationRules);
                }
            }
        },

        setValidationToField: function (name, rules) {
            var ele = $("#" + this._id + name).length > 0 ? $("#" + this._id + name) : $("#" + name);
            ele.rules("add", rules);
            var validator = $("#" + this._id + "EditForm").validate();
            if (!ej.isNullOrUndefined(rules["required"])) {
                validator.settings.messages["Name"] = {};
                validator.settings.messages["Name"]["required"] = ej.TreeGrid.getColumnByField(this._columns, name).headerText + " is required";
            }
        },
        
        _updateEditedGanttRecords: function (args,isTrigger) {
            var proxy = this, model = proxy.model,
                ganttRecord = args.data,
                startDate = proxy._getDateFromFormat(ganttRecord.startDate),
                isAutoSchedule = ganttRecord.isAutoSchedule,
                isPredecessorsModified = false, prevPredecessorValue;

            if (args.columnName === "startDate") {
                var previousData = $.extend({}, args.data);
                startDate = proxy._checkStartDate(startDate, ganttRecord);
                ganttRecord.startDate = proxy._getDateFromFormat(startDate);
                if ( ej.isNullOrUndefined(ganttRecord.startDate)) {
                    ganttRecord.duration = null;
                    ganttRecord.item[model.durationMapping] = null;
                    ganttRecord.isMilestone = false;
                }
                else if (ganttRecord.endDate || !ej.isNullOrUndefined(ganttRecord.duration))
                    ganttRecord._calculateEndDate(this);
                if (model.startDateMapping)
                    ganttRecord.item[model.startDateMapping] = ganttRecord.startDate;
                ganttRecord.isMilestone = ganttRecord.duration == 0 ? true : false;
                ganttRecord.left = ganttRecord._calculateLeft(this);
                ganttRecord.width = ganttRecord._calculateWidth(this);// model.holidays
                if (!ganttRecord.hasChildRecords)
                    ganttRecord.progressWidth = ganttRecord._getProgressWidth(ganttRecord.width, ganttRecord.status);
                else if (!ganttRecord.isAutoSchedule && ganttRecord.hasChildRecords && args.previousValue.getTime() != ganttRecord.startDate.getTime()) {
                    var arg = {};
                    arg.previousData = previousData;
                    arg.previousData.startDate = args.previousValue;
                    arg.data = ganttRecord;
                    proxy._validateAutoChildRecords(arg);
                }
                if (ganttRecord.parentItem && ganttRecord.parentItem.isAutoSchedule)
                    proxy._updateParentItem(ganttRecord);
                else if (ganttRecord.parentItem && !ganttRecord.parentItem.isAutoSchedule)
                    proxy._updateManualParentItem(ganttRecord);
            }

            else if (args.columnName === "endDate") {
                //validate start date
                var endDate = proxy._getDateFromFormat(ganttRecord.endDate),
                    duration = ganttRecord.duration;

                if (ej.isNullOrUndefined(endDate)) {
                    ganttRecord.endDate = endDate;
                    ganttRecord.duration = null;
                    ganttRecord.item[model.durationMapping] = null;
                    ganttRecord.isMilestone = false;
                }
                else {
                    if ((endDate.getHours() == 0 && this._defaultEndTime != 86400))
                        this._setTime(this._defaultEndTime, endDate);
                    ganttRecord.endDate = this._checkEndDate(endDate, ganttRecord);
                    if (!ej.isNullOrUndefined(startDate) && ej.isNullOrUndefined(duration)) {
                        if (proxy._compareDates(ganttRecord.endDate, startDate) == -1) {
                            ganttRecord.endDate = new Date(startDate);
                            this._setTime(this._defaultEndTime, ganttRecord.endDate);
                        }
                    }
                    else if (!ej.isNullOrUndefined(duration) && ej.isNullOrUndefined(startDate)) {
                        ganttRecord.startDate = this._getStartDate(ganttRecord.endDate, duration, ganttRecord.durationUnit, ganttRecord);
                    }
                }

                if (proxy._compareDatesFromRecord(ganttRecord) == -1) {
                    ganttRecord._calculateDuration(this);
                }
                else if(!ej.isNullOrUndefined(ganttRecord.endDate)) {
                    ganttRecord.endDate = args.previousValue;
                    ganttRecord.item[model.endDateMapping] = args.previousValue;
                }
                ganttRecord.isMilestone = ganttRecord.duration == 0 ? true : false;
                ganttRecord.width = ganttRecord._calculateWidth(this);
                ganttRecord.left = ganttRecord._calculateLeft(this);
                if (!ganttRecord.hasChildRecords)
                    ganttRecord.progressWidth = ganttRecord._getProgressWidth(ganttRecord.width, ganttRecord.status);                

                proxy._updateResourceRelatedFields(ganttRecord);

                if (model.endDateMapping)
                    ganttRecord.item[model.endDateMapping] = ganttRecord.endDate;
                if (ganttRecord.isMilestone) {
                    ganttRecord.startDate = this._checkStartDate(ganttRecord.startDate, ganttRecord);
                    model.startDateMapping && (ganttRecord.item[model.startDateMapping] = ganttRecord.startDate);
                }
                if (ganttRecord.parentItem && ganttRecord.parentItem.isAutoSchedule)
                    proxy._updateParentItem(ganttRecord);
                else if (ganttRecord.parentItem && !ganttRecord.parentItem.isAutoSchedule)
                    proxy._updateManualParentItem(ganttRecord);
            }

            else if (args.columnName == "duration" || proxy._isDurationUpdated) {
                var currentDuration = ganttRecord.duration,
                    endDate = ganttRecord.endDate;

                if (ej.isNullOrUndefined(currentDuration)) {
                    ganttRecord.isMilestone = false;
                    ganttRecord.endDate = null;
                    if (model.endDateMapping)
                        ganttRecord.item[model.endDateMapping] = null;
                }
                else {
                    if (ej.isNullOrUndefined(startDate) && !ej.isNullOrUndefined(endDate)) {
                        ganttRecord.startDate = proxy._getStartDate(endDate, currentDuration, ganttRecord.durationUnit, ganttRecord);
                        if (model.startDateMapping)
                            ganttRecord.item[model.startDateMapping] = ganttRecord.startDate;
                    }
                    if (currentDuration != 0 && ganttRecord.isMilestone) {
                        ganttRecord.isMilestone = false;
                        ganttRecord.startDate = this._checkStartDate(ganttRecord.startDate, ganttRecord);
                        model.startDateMapping && (ganttRecord.item[model.startDateMapping] = ganttRecord.startDate);
                    }
                    ganttRecord.isMilestone = ganttRecord.duration == 0 ? true : false;
                    ganttRecord._calculateEndDate(this);
                }
                ganttRecord.width = ganttRecord._calculateWidth(this);
                ganttRecord.left = ganttRecord._calculateLeft(this);
                if (!ganttRecord.hasChildRecords)
                    ganttRecord.progressWidth = ganttRecord._getProgressWidth(ganttRecord.width, ganttRecord.status);

                if (ganttRecord.parentItem && ganttRecord.parentItem.isAutoSchedule)
                    proxy._updateParentItem(ganttRecord);
                else if (ganttRecord.parentItem && !ganttRecord.parentItem.isAutoSchedule)
                    proxy._updateManualParentItem(ganttRecord);
            }

            else if (args.columnName == "predecessor" || args.columnName == "serialNumberPredecessor") {
                prevPredecessorValue = args.columnName == "serialNumberPredecessor" ? args.prevDefaultPredecessors : args.previousValue;
                if (prevPredecessorValue) {
                    proxy._removeConnectorLine(prevPredecessorValue, ganttRecord);
                }
                proxy._addConnectorLine(ganttRecord);
            }

            else if (args.columnName == "status") {
                ganttRecord.status = ganttRecord.status > 100 ? 100 : ganttRecord.status;
                if (!ganttRecord.hasChildRecords)
                    ganttRecord.progressWidth = proxy._getProgressWidth(ganttRecord.width, ganttRecord.status);
                if (ganttRecord.parentItem && ganttRecord.parentItem.isAutoSchedule) {                    
                    proxy._updateParentItem(ganttRecord);
                }
                else if (ganttRecord.parentItem && !ganttRecord.parentItem.isAutoSchedule) {                    
                    proxy._updateManualParentItem(ganttRecord);
                }
            }
            else if (args.columnName == "taskMode") {
                proxy._updateGanttRecord(ganttRecord);
            }
            else if (args.columnName == "baselineStartDate" || args.columnName == "baselineEndDate")
            {
                var baseLineStartDate = proxy._getDateFromFormat(ganttRecord.baselineStartDate),
                    baseLineEndDate = proxy._getDateFromFormat(ganttRecord.baselineEndDate);
                if (baseLineEndDate && baseLineEndDate.getHours() == 0 && this._defaultEndTime != 86400)
                    this._setTime(this._defaultEndTime, baseLineEndDate);
                ganttRecord.baselineStartDate = this._checkBaseLineStartDate(baseLineStartDate);
                ganttRecord.baselineEndDate = this._checkBaseLineEndDate(baseLineEndDate);
                if (ganttRecord.baselineStartDate && ganttRecord.baselineEndDate) {
                    ganttRecord.baselineLeft = ganttRecord._calculateBaselineLeft(this);
                    ganttRecord.baselineRight = ganttRecord._calculateBaselineRight(this);
                    ganttRecord.baselineWidth = ganttRecord._calculateBaseLineWidth(this);
                }
            }
            //proxy._updateEditedGanttRecord(ganttRecord);
            if (ganttRecord.predecessor) {
                
                proxy._isMileStoneEdited = ganttRecord.isMilestone;
                proxy._updatedConnectorLineCollection = [];
                proxy._connectorlineIds = [];

                if (args.columnName === "predecessor" || args.columnName === "serialNumberPredecessor") {
                    proxy._isPredecessorEdited = true;
                    if (model.enablePredecessorValidation)
                        proxy._validatePredecessor(ganttRecord, prevPredecessorValue);
                    else{
                        var manualOffsetEditing=true;
                        proxy._validatePredecessorOnEditing(ganttRecord, manualOffsetEditing);
                    }
                    proxy._isPredecessorEdited = false;
                }
                else
                    proxy._validatePredecessor(ganttRecord, undefined, "successor");
                if (proxy._updatedConnectorLineCollection.length > 0 && model.viewType == "projectView") {
                    proxy._$ganttchartHelper.ejGanttChart("appendConnectorLine", proxy._updatedConnectorLineCollection);
                    this._updateConnectorLineCollection(proxy._updatedConnectorLineCollection);
                }
            }
            proxy._isValidationEnabled = false;
            if(isTrigger)
                proxy.refreshGanttRecord(ganttRecord);
        },

        _updateEditedGanttRecord: function (ganttRecord) {
            var proxy = this;
            if (ganttRecord.predecessor && this.model.viewType == "projectView") {
                var predecessorsCollection = ganttRecord.predecessor,
                    count = 0,
                    length = predecessorsCollection.length,
                    predecessor,
                    parentGanttRecord,
                    record,
                    connectorLineId,
                    connectorLineObject,
                    model = proxy.model,
                    flatRecords = model.flatRecords,
                    ids = model.ids;

                for (count = 0; count < length; count++) {
                    proxy._updatedConnectorLineCollection = [];
                    proxy._connectorlineIds = [];
                    predecessor = predecessorsCollection[count];
                    if (predecessor.to === ganttRecord['taskId'].toString()) {

                        parentGanttRecord = flatRecords[ids.indexOf(predecessor.from)];
                        record = flatRecords[ids.indexOf(predecessor.to)];
                        
                        if (parentGanttRecord && record) {
                            connectorLineId = "parent" + parentGanttRecord['taskId'] + "child" + record['taskId'];
                            proxy._$ganttchartHelper.ejGanttChart("removeConnectorline", connectorLineId);
                            this._updateConnectorLineCollection(connectorLineId);                            
                            proxy._updateConnectorLineId(parentGanttRecord, record, predecessor)
                        }                        
                    }
                }
            }
        },
        

        _updateTargetGanttRecord: function (ganttRecord) {
            var proxy = this,
                model = proxy.model;
            ganttRecord.startDate = proxy._checkStartDate(ganttRecord.startDate, ganttRecord);
            ganttRecord.endDate = this._getEndDate(ganttRecord.startDate, ganttRecord.duration, ganttRecord.durationUnit, ganttRecord);
            ganttRecord.left = ganttRecord._calculateLeft(this);
            ganttRecord.width = ganttRecord._calculateWidth(this);
            ganttRecord.progressWidth = ganttRecord._getProgressWidth(ganttRecord.width, ganttRecord.status);
            if (ganttRecord.parentItem) {
                if (ganttRecord.parentItem.isAutoSchedule == true) {
                    proxy._updateParentItem(ganttRecord);
                }
                else {
                    proxy._updateManualParentItem(ganttRecord);
                }
            }
            proxy.refreshGanttRecord(ganttRecord);
        },

        _updateGanttRecord: function (ganttRecord) {
            var proxy = this,
                model = proxy.model;

            if (ganttRecord.hasChildRecords && ganttRecord.isAutoSchedule) {
                ganttRecord.startDate = proxy._checkStartDate(ganttRecord.manualStartDate, ganttRecord);                
                ganttRecord.left = ganttRecord._calculateManualLeft(this);
                ganttRecord.width = ganttRecord._calculateManualWidth(this);
                ganttRecord.progressWidth = ganttRecord._getProgressWidth(ganttRecord.width, ganttRecord.status);                
                ganttRecord.endDate = ganttRecord.manualEndDate;
                ganttRecord._calculateDuration(this);
            }
            else if (ganttRecord.hasChildRecords && !ganttRecord.isAutoSchedule) {                
                ganttRecord.left = ganttRecord._calculateLeft(this);
                ganttRecord.width = ganttRecord._calculateWidth(this);
                ganttRecord._calculateDuration(this);
                ganttRecord.manualStartDate = ganttRecord.startDate;
                ganttRecord.manualEndDate = ganttRecord.endDate;                
                proxy._updateManualParentItem(ganttRecord, null, true);
            }
            else {
                ganttRecord.startDate = proxy._checkStartDate(ganttRecord.startDate, ganttRecord);
                ganttRecord._calculateEndDate(this);
                ganttRecord.left = ganttRecord._calculateLeft(this);
                ganttRecord.width = ganttRecord._calculateWidth(this);
                ganttRecord.progressWidth = ganttRecord._getProgressWidth(ganttRecord.width, ganttRecord.status);
            }
            if (ganttRecord.parentItem && ganttRecord.parentItem.isAutoSchedule)
                proxy._updateParentItem(ganttRecord);
            if (ganttRecord.parentItem && !ganttRecord.parentItem.isAutoSchedule)
                proxy._updateManualParentItem(ganttRecord);

            proxy.refreshGanttRecord(ganttRecord);
        },

        refreshGanttRecord: function (ganttRecord, updateRecord,isSerialUpdate) {
            var proxy = this;
            if (proxy._isTreeGridRendered) {
                proxy.model.currentViewData = proxy.getCurrentViewData();
                var index = proxy.model.currentViewData.indexOf(ganttRecord);
                var treegridObject = proxy._$treegridHelper.ejTreeGrid("instance");
                treegridObject.model.allowSelection = proxy.model.allowSelection;
                ej.TreeGrid.refreshRow(treegridObject, index);
                if (proxy._isGanttChartRendered) {
                    proxy._$ganttchartHelper.ejGanttChart("refreshRow", index);
                }
                updateRecord = updateRecord ? updateRecord : ganttRecord;
                if (!proxy._isLastRefresh && (updateRecord.eResourceTaskType != "groupTask" && updateRecord.eResourceTaskType != "resourceTask")) {
                    var index = $.map(proxy._actionCompleteData, function (data, index) {
                        if (data == updateRecord) {
                            return index;
                        }
                    });
                    if (index.length)
                        proxy._actionCompleteData[index[0]] = updateRecord;
                    else if (ej.isNullOrUndefined(isSerialUpdate) ||  (isSerialUpdate && proxy.model.enableSerialNumber))
                        proxy._actionCompleteData.push(updateRecord);
                }
                else if (updateRecord.eResourceTaskType != "groupTask" && updateRecord.eResourceTaskType != "resourceTask")
                {
                    //Client side event is triggerd for upadte the server side database
                    var eventArgs = {};
                    eventArgs.data = updateRecord;
                    eventArgs.item = updateRecord.item;
                    eventArgs.requestType = "recordUpdate";
                    var index = $.map(proxy._actionCompleteData, function (data, index) {   
                        if (data == updateRecord) {
                            return index;
                        }
                    });
                    index.length && proxy._actionCompleteData.splice(index[0], 1);
                    if (proxy._actionCompleteData.length) {
                        eventArgs.updatedRecords = proxy._actionCompleteData;
                        proxy._actionCompleteData = [];
                    }
                    proxy._isLastRefresh = false;
                    proxy._trigger("actionComplete",eventArgs);
                }
            }
        },

        _updateManualParentItem: function (ganttRecord, editmode, isParent) {

            var proxy = this,
                parentGanttRecord = isParent ? ganttRecord : ganttRecord.parentItem,
                model = proxy.model,
                prevManualStartDate = parentGanttRecord.manualStartDate,
                prevManualEndDate = parentGanttRecord.manualEndDate,
                childRecords = parentGanttRecord.childRecords,
                length = childRecords && childRecords.length,
                minStartDate = null, maxEndDate = null,
                milestoneCount = 0, totalProgress = 0, childCompletedWorks = 0;

            for (var count = 0; count < length; count++) {

                var childGanttRecord = childRecords[count],
                    childStartDate = proxy._getValidStartDate(childGanttRecord),
                    childEndDate = proxy._getValidEndDate(childGanttRecord);

                if (!childGanttRecord.isAutoSchedule && childGanttRecord.hasChildRecords) {

                    var childManualStartDate = childGanttRecord.manualStartDate,
                        childManualEndDate = childGanttRecord.manualEndDate,
                        childNormalStartDate = childStartDate,
                        childNormalEndDate = childEndDate,
                        childStartDate = proxy._compareDates(childManualStartDate, childNormalStartDate) == -1 ? childGanttRecord.manualStartDate : childGanttRecord.startDate,
                        childEndDate = proxy._compareDates(childManualEndDate, childNormalEndDate) == 1 ? childGanttRecord.manualEndDate : childGanttRecord.endDate;
                }

                if (minStartDate === null) {
                    minStartDate = proxy._getDateFromFormat(childStartDate);
                }
                if (maxEndDate === null) {
                    maxEndDate = proxy._getDateFromFormat(childEndDate);
                }
                if (!ej.isNullOrUndefined(childEndDate) && proxy._compareDates(childEndDate, maxEndDate) == 1) {
                    maxEndDate = proxy._getDateFromFormat(childEndDate);
                }
                if (!ej.isNullOrUndefined(childStartDate) && proxy._compareDates(childStartDate, minStartDate) == -1) {
                    minStartDate = proxy._getDateFromFormat(childStartDate);
                }

                childCompletedWorks += parseInt(childGanttRecord.work);

                if (!childGanttRecord.isMilestone && childGanttRecord._isScheduledTask())
                    totalProgress += parseInt(childGanttRecord.status);
                else
                    milestoneCount++;
            }

            if (proxy._compareDates(prevManualStartDate, minStartDate) != 0) {
                parentGanttRecord.manualStartDate = proxy._getDateFromFormat(minStartDate);
            }

            if (proxy._compareDates(prevManualEndDate, maxEndDate) != 0) {
                parentGanttRecord.manualEndDate = proxy._getDateFromFormat(maxEndDate);
            }

            if (proxy._isLoad || proxy._isChartRendering) {
                parentGanttRecord._calculateDuration(this);
                parentGanttRecord.width = parentGanttRecord._calculateWidth(this);
            }

            parentGanttRecord.left = parentGanttRecord._calculateLeft(this);
            parentGanttRecord.manualLeft = parentGanttRecord._calculateManualLeft(this);
            parentGanttRecord._calculateManualDuration(this);
            parentGanttRecord.manualWidth = parentGanttRecord._calculateManualWidth(this);

            //update parent works 
            parentGanttRecord._updateWorkWithDuration(proxy);
            //Add child works to parent
            parentGanttRecord.work += childCompletedWorks;

            if (model.workMapping)
                parentGanttRecord.item[model.workMapping] = parentGanttRecord.work;

            //Calculate progressWidth after left and width calulation            
            var taskCount = length - milestoneCount,
            parentProgress = taskCount > 0 ? (totalProgress / taskCount) : 0;
            parentGanttRecord.progressWidth = proxy._getProgressWidth(parentGanttRecord.manualWidth, parentProgress);
            parentGanttRecord.status = Math.floor(parentProgress);

            if (model.progressMapping)
                parentGanttRecord.item[model.progressMapping] = parentGanttRecord.status;

            if (proxy._isTreeGridRendered || proxy._isGanttChartRendered)
                proxy.refreshGanttRecord(parentGanttRecord);

            if (parentGanttRecord.parentItem && parentGanttRecord.parentItem.isAutoSchedule && !isParent) {
                proxy._updateParentItem(parentGanttRecord);
            }
            else if (parentGanttRecord.parentItem && !parentGanttRecord.parentItem.isAutoSchedule && !isParent)
                proxy._updateManualParentItem(parentGanttRecord, editmode);
        },
        /*Get minium startdate and max end date and average progress from given record collection*/
        _getMaxValues: function (records) {
            var count = 0,
               childRecords = records,
               length = childRecords && childRecords.length,
               childGanttRecord,
               index = null,
               minStartDate = null,
               maxEndDate = null,
               parentProgress = 0,
               milestoneCount = 0,
               totalProgress = 0,
               childCompletedWorks = 0,
               returnObj = {};

            for (count = 0; count < length; count++) {

                childGanttRecord = childRecords[count];
                var startDate = childGanttRecord.startDate,
                    endDate = childGanttRecord.endDate;

                if (childGanttRecord.hasChildRecords && !childGanttRecord.isAutoSchedule) {
                    startDate = childGanttRecord.startDate.getTime() > childGanttRecord.manualStartDate.getTime() ?
                                    childGanttRecord.manualStartDate : childGanttRecord.startDate;
                }

                if (childGanttRecord.hasChildRecords && !childGanttRecord.isAutoSchedule) {
                    endDate = childGanttRecord.endDate.getTime() < childGanttRecord.manualEndDate.getTime() ?
                                    childGanttRecord.manualEndDate : childGanttRecord.endDate;
                }

                if (minStartDate === null) {
                    minStartDate = new Date(startDate);
                }
                if (maxEndDate === null) {
                    maxEndDate = new Date(endDate);
                }
                if (endDate.getTime() > maxEndDate.getTime()) {
                    maxEndDate = new Date(endDate);
                }
                if (startDate.getTime() < minStartDate.getTime()) {
                    minStartDate = new Date(startDate);
                }

                childCompletedWorks += parseInt(childGanttRecord.work);

                if (!childGanttRecord.isMilestone) {
                    totalProgress += parseInt(childGanttRecord.status);
                }
                else
                    milestoneCount++;
            }

            var taskCount = length - milestoneCount;
            parentProgress = taskCount > 0 ? (totalProgress / taskCount) : 0;  

            returnObj.startDate = minStartDate;
            returnObj.endDate = maxEndDate;
            returnObj.status = parentProgress;
            returnObj.work = childCompletedWorks;
            returnObj.milestoneCount = milestoneCount;
            return returnObj;
        },
        
        //Check whether the parent item has the shared tasks
        _checkSharedTasks: function (childTask,parentItem) {
            var model = this.model, childTasks, childLength;
            childTasks = parentItem.eResourceChildTasks;
            childLength = childTasks.length;

            if (parentItem.eResourceTaskType == "resourceChildTask" ||
                parentItem.eResourceTaskType == "resourceTask") {
                for (var i = 0; i < childLength; i++) {
                    if (childTask.taskId == childTasks[i].taskId) {
                        return childTasks[i];
                    }
                }
               
            }
        },

        _updateResourceResourceDetails: function (childRecord, previousResourceId) {
            var model = this.model,
              rootRecord = childRecord,
              resourceCol,
              resourceobj = {}, resourceLength;

            childRecord.resourceInfo = ej.isNullOrUndefined(childRecord.resourceInfo) ? [] : childRecord.resourceInfo;
            resourceCol=childRecord.resourceInfo;

            if (childRecord.eResourceTaskType == "resourceChildTask") {
                rootRecord = childRecord.parentItem;
                resourceobj[model.resourceIdMapping] = rootRecord.taskId;
                resourceobj[model.resourceNameMapping] = rootRecord.eResourceName;
                resourceobj[model.resourceUnitMapping] = 100;
                
               
                if (resourceCol.length > 0 && !ej.isNullOrUndefined(previousResourceId)) {
                    resourceLength = resourceCol.length;

                    for (var i = 0; i < resourceLength; i++) {
                        if (resourceCol[i][model.resourceIdMapping] == previousResourceId) {
                            resourceCol.splice(i, 1);
                            break;
                        }
                    }
                }
            
                childRecord.resourceInfo.push(resourceobj);


            } else if (childRecord.eResourceTaskType == "resourceTask") {
                rootRecord = childRecord.parentItem;
            }
            else if (childRecord.eResourceTaskType == "groupTask") {
                rootRecord = childRecord;
            }

        },

        _updateResourceParentItem: function (childRecord) {
            var model = this.model,
                rootRecord = childRecord,
                childCollection = [];

            if (childRecord.eResourceTaskType == "resourceChildTask")
            {
                rootRecord = childRecord.parentItem.parentItem;

            } else if (childRecord.eResourceTaskType == "resourceTask")
            {
                rootRecord = childRecord.parentItem;
            }
            else if (childRecord.eResourceTaskType == "groupTask") {
                rootRecord = childRecord;
            }
            if (rootRecord && rootRecord.hasChildRecords && rootRecord.childRecords.length > 0) {
                for(var count=0;count<rootRecord.childRecords.length;count++)
                {
                    childCollection.push.apply(childCollection, rootRecord.childRecords[count].eResourceChildTasks);
                }
                var obj = this._getMaxValues(childCollection);

                rootRecord.startDate = new Date(obj.startDate);
                    //if (model.startDateMapping)
                    //    parentGanttRecord.item[model.startDateMapping] = parentGanttRecord.startDate;

               
                rootRecord.endDate = new Date(obj.endDate);
                    //if (model.endDateMapping)
                    //    parentGanttRecord.item[model.endDateMapping] = parentGanttRecord.endDate

                rootRecord._calculateDuration(this);
                rootRecord.left = rootRecord._calculateLeft(this);
                rootRecord.width = rootRecord._calculateWidth(this);
                if (obj.milestoneCount == rootRecord.childRecords.length) {
                    if (rootRecord.startDate.getTime() == rootRecord.endDate.getTime())
                        rootRecord.width = Math.floor((model.rowHeight - 6) / 2) * 2; //milestone width
                    else
                        rootRecord.width += Math.floor((model.rowHeight - 6) / 2) * 2;
                }

                rootRecord.progressWidth = this._getProgressWidth(rootRecord.width, obj.status);
                rootRecord.status = Math.floor(obj.status);

                //update parent works 
                //parentGanttRecord._updateWorkWithDuration(proxy);
                //Add child works to parent
                rootRecord.work += obj.work;

                //if (model.workMapping)
                //    parentGanttRecord.item[model.workMapping] = parentGanttRecord.work;

                ////Default Values of Parent tasks.
                //parentGanttRecord.taskType = ej.Gantt.TaskType.FixedDuration;
                //parentGanttRecord.effortDriven = "false";

                //parentGanttRecord.manualStartDate = parentGanttRecord.startDate;
                //parentGanttRecord.manualEndDate = parentGanttRecord.endDate;

                //if (model.progressMapping)
                //    parentGanttRecord.item[model.progressMapping] = parentGanttRecord.status;

                if (this._isTreeGridRendered || this._isGanttChartRendered)
                    this.refreshGanttRecord(rootRecord);

            }
        },

        _updateParentItem: function (ganttRecord, editmode, isParent) {

            var proxy = this,
                parentGanttRecord = isParent ? ganttRecord : ganttRecord.parentItem,
                model = proxy.model,
                prevStartDate = parentGanttRecord.startDate,
                prevEndDate = parentGanttRecord.endDate,
                childRecords = parentGanttRecord.childRecords,
                length = childRecords && childRecords.length,
                minStartDate = null, maxEndDate = null,
                milestoneCount = 0, totalProgress = 0, childCompletedWorks = 0;

            for (var count = 0; count < length; count++) {

                var childGanttRecord = childRecords[count],
                    startDate = proxy._getValidStartDate(childGanttRecord),
                    endDate = proxy._getValidEndDate(childGanttRecord);

                if (childGanttRecord.hasChildRecords && !childGanttRecord.isAutoSchedule) {
                    startDate = proxy._compareDates(childGanttRecord.startDate, childGanttRecord.manualStartDate) == 1 ?
                                    childGanttRecord.manualStartDate : childGanttRecord.startDate;
                }

                if (childGanttRecord.hasChildRecords && !childGanttRecord.isAutoSchedule) {
                    endDate = proxy._compareDates(childGanttRecord.endDate, childGanttRecord.manualEndDate) == -1 ?
                                    childGanttRecord.manualEndDate : childGanttRecord.endDate;
                }

                if (minStartDate === null) {
                    minStartDate = proxy._getDateFromFormat(startDate);
                }
                if (maxEndDate === null) {
                    maxEndDate = proxy._getDateFromFormat(endDate);
                }
                if (!ej.isNullOrUndefined(endDate) && proxy._compareDates(endDate, maxEndDate) == 1) {
                    maxEndDate = proxy._getDateFromFormat(endDate);
                }
                if (!ej.isNullOrUndefined(startDate) && proxy._compareDates(startDate, minStartDate) == -1) {
                    minStartDate = proxy._getDateFromFormat(startDate);
                }

                childCompletedWorks += parseInt(childGanttRecord.work);

                if (!childGanttRecord.isMilestone && childGanttRecord._isScheduledTask()) {
                    totalProgress += parseInt(childGanttRecord.status);
                }
                else
                    milestoneCount++;
            }

            if (proxy._compareDates(prevStartDate, minStartDate) != 0) {
                parentGanttRecord.startDate = proxy._getDateFromFormat(minStartDate);
                if (model.startDateMapping)
                    parentGanttRecord.item[model.startDateMapping] = parentGanttRecord.startDate;
            }

            if (proxy._compareDates(prevEndDate, maxEndDate) != 0) {
                parentGanttRecord.endDate = proxy._getDateFromFormat(maxEndDate);
                if (model.endDateMapping)
                    parentGanttRecord.item[model.endDateMapping] = parentGanttRecord.endDate;

            }

            parentGanttRecord._calculateDuration(this);
            parentGanttRecord.left = parentGanttRecord._calculateLeft(this);
            parentGanttRecord.width = parentGanttRecord._calculateWidth(this);
            if (milestoneCount == parentGanttRecord.childRecords.length || parentGanttRecord.duration == 0) {
                if (proxy._compareDatesFromRecord(parentGanttRecord) == 0)
                    parentGanttRecord.width = Math.floor((model.rowHeight - 6) / 2) * 2; //milestone width
            }

            //Calculate progressWidth after Left and width calculation
            var taskCount = length - milestoneCount,
                parentProgress = taskCount > 0 ? (totalProgress / taskCount) : 0;
            parentGanttRecord.progressWidth = proxy._getProgressWidth(parentGanttRecord.width, parentProgress);
            parentGanttRecord.status = Math.floor(parentProgress);

            //update parent works 
            parentGanttRecord._updateWorkWithDuration(proxy);
            //Add child works to parent
            parentGanttRecord.work += childCompletedWorks;

            if (model.workMapping)
                parentGanttRecord.item[model.workMapping] = parentGanttRecord.work;

            //Default Values of Parent tasks.
            parentGanttRecord.taskType = ej.Gantt.TaskType.FixedDuration;
            parentGanttRecord.effortDriven = "false";

            parentGanttRecord.manualStartDate = parentGanttRecord.startDate;
            parentGanttRecord.manualEndDate = parentGanttRecord.endDate;

            if (model.progressMapping)
                parentGanttRecord.item[model.progressMapping] = parentGanttRecord.status;

            if (proxy._isTreeGridRendered || proxy._isGanttChartRendered)
                proxy.refreshGanttRecord(parentGanttRecord);

            if (parentGanttRecord.parentItem && parentGanttRecord.parentItem.isAutoSchedule && !isParent) {
                proxy._updateParentItem(parentGanttRecord);
            }
            else if (parentGanttRecord.parentItem && !parentGanttRecord.parentItem.isAutoSchedule && !isParent)
                proxy._updateManualParentItem(parentGanttRecord);
        },

        _daydiff: function (first, second) {
            return ((new Date(second) - new Date(first)) / (1000 * 60 * 60 * 24));
        },

        //refresh treegrid and gantt rows
        _refreshChartAndGridRows: function ()
        {
            var proxy = this, model = this.model, collapsedRecordCount, height;
            proxy._$treegridHelper.ejTreeGrid("processBindings");
            var tempArgs = {};
            tempArgs.requestType = ej.TreeGrid.Actions.Refresh;
            proxy._$treegridHelper.ejTreeGrid("sendDataRenderingRequest", tempArgs);
            proxy.model.updatedRecords = proxy.getUpdatedRecords();
            proxy.model.currentViewData = proxy.getCurrentViewData();
            collapsedRecordCount = proxy._$treegridHelper.ejTreeGrid("getCollapsedRecordCount");
            proxy._totalCollapseRecordCount = collapsedRecordCount;
            height = proxy._$treegridHelper.ejTreeGrid("getRecordsHeight");
            proxy._$ganttchartHelper.ejGanttChart("setUpdatedRecords", model.currentViewData, model.updatedRecords, model.flatRecords, model.ids);
            proxy._$ganttchartHelper.ejGanttChart("refreshHelper", model.currentViewData, model.updatedRecords, proxy._totalCollapseRecordCount);
            if (!proxy._isInAdd) {
                proxy._$treegridHelper.ejTreeGrid("updateHeight");
                proxy._$ganttchartHelper.ejGanttChart("updateHeight", height);
                proxy._$ganttchartHelper.ejGanttChart("setCollapsedRecordCount", collapsedRecordCount);
                proxy._$ganttchartHelper.ejGanttChart("refreshGridLinesTable", proxy.model.updatedRecords.length - collapsedRecordCount);
                if (model.enableAltRow && model.currentViewData.length > 0)
                    ej.TreeGrid.updateAltRow(proxy, model.currentViewData[0], 0, 0);

                if (model.predecessorMapping) {
                    proxy._refreshConnectorLines(false, true, false);
                }
            }
        },
        //Refresh gantt after expnadAll or collapseAll operation
        _refreshGanttOnExpandCollapseAll:function()
        {
            var proxy = this,
                args = {},
                model = this.model,
                collapsedRecordCount = 0,
                height = 0;

            if (model.enableVirtualization) {
                args.requestType = ej.TreeGrid.Actions.ExpandCollapse;
                proxy._$treegridHelper.ejTreeGrid("updateAltRowOnCollapseAll");
                proxy._$treegridHelper.ejTreeGrid("updateAltRowOnRendering");
                proxy._$treegridHelper.ejTreeGrid("sendDataRenderingRequest", args);
                model.updatedRecords = proxy.getUpdatedRecords();
                model.currentViewData = proxy.getCurrentViewData();
                proxy._$ganttchartHelper.ejGanttChart("clearConnectorLines");
                proxy._$ganttchartHelper.ejGanttChart("refreshHelper", proxy.model.currentViewData, proxy.model.updatedRecords);
                proxy._$treegridHelper.ejTreeGrid("updateHeight");
            } else {
                //If need refresh chart if record is added after searching or sorting
                if (proxy._isRefreshAddedRecord) {
                    proxy._refreshChartAndGridRows();
                    proxy._isRefreshAddedRecord = false;
                    return;
                }
                collapsedRecordCount = proxy._$treegridHelper.ejTreeGrid("getCollapsedRecordCount");
                proxy._totalCollapseRecordCount = collapsedRecordCount;
                height = proxy._$treegridHelper.ejTreeGrid("getRecordsHeight");
                proxy._$ganttchartHelper.ejGanttChart("clearConnectorLines");
                proxy._$treegridHelper.ejTreeGrid("updateHeight");
                proxy._$ganttchartHelper.ejGanttChart("setCollapsedRecordCount", collapsedRecordCount);
                proxy._$ganttchartHelper.ejGanttChart("updateHeight", height);
                proxy._$ganttchartHelper.ejGanttChart("refreshGridLinesTable", proxy.model.updatedRecords.length - collapsedRecordCount);
                if (model.enableAltRow && model.currentViewData.length > 0)
                    ej.TreeGrid.updateAltRow(proxy, model.currentViewData[0], 0, 0);
            }
            if (model.predecessorMapping) {
                proxy._refreshConnectorLines(false, false, true);
            }
        },
        //get all the visible records in Gantt
        _collapsedRecords: function () {
            var proxy = this,
                model = proxy.model;
            var records = model.updatedRecords.filter(function (record) {
                if (record.parentItem == null)
                    return record;
                else if (record.parentItem[model.expandStateMapping] || ej.isNullOrUndefined(record.parentItem[model.expandStateMapping]))
                    return record;
            });
            return records;            
        },
        //collapse the defined records from data source on load time.
        _collapseRecordOnLoad: function () {
            var proxy = this,
               model = proxy.model,
               count = 0,
               ganttRecord,
               args = {},
               records,
               enableVirtualization = model.enableVirtualization,
               $gridRows = proxy.getRows(),
               $rowElement = null;

            proxy._gridRows = $gridRows;
            proxy._isInExpandCollapseAll = true;
            records = proxy._collapsedRecords();
            //loop excecute for iterate the GanttRecords preseent in the Gantt Control            
            for (count = 0; count < records.length; count++) {
                ganttRecord = records[count];
                if (!ganttRecord[model.expandStateMapping]) {
                    if (ganttRecord[model.expandStateMapping] || ej.isNullOrUndefined(ganttRecord[model.expandStateMapping])) continue;
                    args.data = ganttRecord;
                    args.recordIndex = count;                    
                    args.expanded = false;
                    if (ganttRecord.hasChildRecords) {
                        !ganttRecord[model.expandStateMapping] && ej.TreeGrid.sendExpandCollapseRequest(proxy, args);
                    }
                }
            }
            if (model.flatRecords.length > 0)
                proxy._refreshGanttOnExpandCollapseAll();
            proxy._isInExpandCollapseAll = false;
        },
        //Collapse all parent and inner level parent records
        _collapseAll: function () {
            var proxy = this,
                model = proxy.model,
                count = 0, parentRecords, length,
                ganttRecord,
                args = {},
                $gridRows = proxy.getRows(),
                $rowElement = null;
            parentRecords = proxy._getAllParentRecord(model.parentRecords);
            length = parentRecords.length;
            proxy._expandCollapseSettings.state = "collapseAll";
            proxy._expandCollapseSettings.level = 0;
            proxy._$treegridHelper.ejTreeGrid("cancelEditCell"); // Cancel the edit cell, if it is in edit mode.
            proxy._gridRows = $gridRows;
            proxy._isInExpandCollapse = true;
            proxy._isInExpandCollapseAll = true;
            args.isFromExpandCollapse = true;
            proxy._clearMultiSelectPopup();
            //loop excecute for iterate the GanttRecords preseent in the Gantt Control            
            for (count = 0; count < length; count++) {
                if ((count + 1) == length) 
                    args.isLastRefresh = true;
                ganttRecord = parentRecords[count];
                args.data = ganttRecord;
                args.recordIndex = count;
                args.expanded = false;
                if (ganttRecord.hasChildRecords) {
                    proxy._expandCollapseInnerLevelRecord(ganttRecord, args.expanded, args.isLastRefresh);
                    (ganttRecord.expanded || args.isLastRefresh) && ej.TreeGrid.sendExpandCollapseRequest(proxy, args);
                }
            }
            if (model.flatRecords.length > 0)
                proxy._refreshGanttOnExpandCollapseAll();

            proxy._isInExpandCollapse = false;
            proxy._isInExpandCollapseAll = false;
        },
        //expand or collapse all inner level parent records
        _expandCollapseInnerLevelRecord: function (record, expanded, isLastRefresh)
        {
            var proxy = this,
                length = record.childRecords.length,
                tempArgs = {};
            if (isLastRefresh)
                tempArgs.isLastRefresh = isLastRefresh;
            tempArgs.isFromExpandCollapse = true;
            for (var count = 0; count < length; count++) {
                if (record.childRecords[count].hasChildRecords) {
                    proxy._expandCollapseInnerLevelRecord(record.childRecords[count], expanded, tempArgs.isLastRefresh);
                    tempArgs.data = record.childRecords[count];
                    tempArgs.expanded = expanded;
                    if (record.childRecords[count].expanded !== expanded)
                        ej.TreeGrid.sendExpandCollapseRequest(proxy, tempArgs);

                }
            }
        },

        //Method for expand all the GanttRecords
        _expandAll: function () {
            
            var proxy = this,
                model = proxy.model,
                count = 0,
                ganttRecord,
                args = {},
                parentRecords = proxy._getAllParentRecord(model.parentRecords),
            length = parentRecords.length;
            proxy._expandCollapseSettings.state = "expandAll";
            proxy._expandCollapseSettings.level = 0;
            proxy._isInExpandCollapse = true;
            proxy._isInExpandCollapseAll = true;
            args.isFromExpandCollapse = true;
            proxy._clearMultiSelectPopup();
            //loop excecute for iterate the GanttRecords present in the Gantt Control                      
            for (count = 0; count < length; count++) {
                if ((count + 1) == length)
                    args.isLastRefresh = true;
                ganttRecord = parentRecords[count];
                args.data = ganttRecord;
                args.recordIndex = count;
                args.expanded = true;
                if (ganttRecord.hasChildRecords ) {
                    proxy._expandCollapseInnerLevelRecord(ganttRecord, args.expanded, args.isLastRefresh);
                    if (!ganttRecord.expanded || args.isLastRefresh)
                       ej.TreeGrid.sendExpandCollapseRequest(proxy, args);
                }
            }
            if (model.flatRecords.length > 0)
                proxy._refreshGanttOnExpandCollapseAll();

            proxy._isInExpandCollapse = false;
            proxy._isInExpandCollapseAll = false;
        },

        //get all parent items 
        _getAllParentRecord: function (records) {
            var resultRecord = records.filter(function (record) {
                if (record.hasChildRecords)
                    return record;
            });
            return resultRecord;
        },
        //To expand the specific level records
        _expandLevelData: function () {
            var proxy = this, args = {},
                model = proxy.model, parentRecords, countLength,treegridRecord,
                level = proxy._expandCollapseSettings.level;
            parentRecords = model.enableVirtualization ? proxy._getAllParentRecord(model.flatRecords) : proxy._getAllParentRecord(model.updatedRecords);
            countLength = parentRecords.length;
            args.isFromExpandCollapse = true;
            for (var count = 0; count < countLength; count++) {
                if ((count + 1) == countLength && model.enableVirtualization)
                    args.isLastRefresh = true;
                treegridRecord = parentRecords[count];
                if (treegridRecord.level == level||args.isLastRefresh) {
                    args.data = treegridRecord;
                    args.expanded = treegridRecord.level == level ? true : treegridRecord.expanded;
                    ej.TreeGrid.sendExpandCollapseRequest(proxy, args);

                    // expand its parent record,if it is collapsed.
                    if (treegridRecord.level == level) {
                        if (treegridRecord.parentItem)
                            proxy._expandParentLevelRecord(treegridRecord.parentItem, args.expanded, args.isLastRefresh);

                        if (treegridRecord.hasChildRecords)
                            proxy._expandCollapseInnerLevelRecord(treegridRecord, false);
                    }
                }
            }
        },
      
        //expand the gantt data at level
        expandAtLevel: function (index) {
            var proxy = this,
                model = proxy.model,
                args = {};
            if (proxy._expandCollapseSettings.state == "expandAll")
                return true;
            proxy._expandCollapseSettings.state = "expandAtLevel";
            proxy._expandCollapseSettings.level = index;
            proxy._isInExpandCollapseAll = true;
            proxy._expandLevelData();
            args.requestType = ej.TreeGrid.Actions.ExpandCollapse;
            if (model.flatRecords.length > 0)
                proxy._refreshGanttOnExpandCollapseAll();
            proxy._isInExpandCollapseAll = false;
        },

        // expand its parent record,if it is collapsed.
        _expandParentLevelRecord: function (record, expanded, isLastRefresh) {
            var proxy = this,
                tempArgs = {},
                parentExpandState = proxy.getExpandStatus(record);
            tempArgs.isLastRefresh = isLastRefresh;
            if (!record.expanded || !parentExpandState) {
                tempArgs.data = record;
                tempArgs.expanded = expanded;
                tempArgs.isFromExpandCollapse = true;
                ej.TreeGrid.sendExpandCollapseRequest(proxy, tempArgs);
                if (tempArgs.data.parentItem ) {
                    proxy._expandParentLevelRecord(tempArgs.data.parentItem, expanded, tempArgs.isLastRefresh);
                }
            }
        },

        //To collapse the specific level records
        _collapseLevelData: function () {
            var proxy = this, args = {},
                model = proxy.model,
                level = proxy._expandCollapseSettings.level, parentRecords, countLength, parentExpandState, treegridRecord;
            parentRecords = model.enableVirtualization ? proxy._getAllParentRecord(model.flatRecords) : proxy._getAllParentRecord(model.updatedRecords);
            countLength = parentRecords.length;
            args.isFromExpandCollapse = true;
            for (var count = 0; count < countLength; count++) {
                if ((count + 1) == countLength && model.enableVirtualization)
                    args.isLastRefresh = true;
                treegridRecord = parentRecords[count];
                parentExpandState = proxy.getExpandStatus(treegridRecord);
                if (treegridRecord && treegridRecord.level == level || args.isLastRefresh) {
                    args.data = treegridRecord;
                    args.expanded = treegridRecord.level == level ? false : treegridRecord.expanded;
                    ej.TreeGrid.sendExpandCollapseRequest(proxy, args);
                    if (!parentExpandState && treegridRecord.level == level)
                        proxy._expandParentLevelRecord(treegridRecord.parentItem, true, args.isLastRefresh);
                }
            }
        },

        //collapse the gantt data at level
        collapseAtLevel: function (index) {
            var proxy = this,
                model = proxy.model,
                args = {};
            if (proxy._expandCollapseSettings.state == "collapseAll")
                return true;
            proxy._expandCollapseSettings.state = "collapseAtLevel";
            proxy._expandCollapseSettings.level = index;
            proxy._isInExpandCollapseAll = true;
            proxy._collapseLevelData();
            args.requestType = ej.TreeGrid.Actions.ExpandCollapse;
            if (model.flatRecords.length > 0)
                proxy._refreshGanttOnExpandCollapseAll();
            proxy._isInExpandCollapseAll = false;
        },

        _getDateFromFormat: function (date) {
            
            if (date == null || date == "")
                return null;

            if (typeof date === "object") {
                return new Date(date);
            }
            if (date) {
                return ej.parseDate(date, this.model.dateFormat, this.model.locale) == null ?
                    new Date(date) : ej.parseDate(date, this.model.dateFormat, this.model.locale);
            }
        },
        _getFormatedDate: function (dateObject, dateformat, locale) {
            return ej.format(dateObject, dateformat, locale);
        },

        _getNonWorkingDayIndex: function () {
            var proxy = this,
                model = proxy.model,
                weekDay = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
                weekDayLength = weekDay.length,
                workWeek = model.workWeek.slice(),
                length = workWeek.length;
            for (var i = 0; i < length; i++)
                workWeek[i] = workWeek[i].toLowerCase();
            proxy._nonWorkingDayIndex = [];
            for (var i = 0; i < weekDayLength; i++) {
                if (workWeek.indexOf(weekDay[i]) == -1)
                    proxy._nonWorkingDayIndex.push(i);
            }
        },

        _getNextWorkingDay: function (date) {
            var proxy = this,
                model = proxy.model,
                dayIndex = date.getDay();
            if (proxy._nonWorkingDayIndex.indexOf(dayIndex) != -1) {
                date.setDate(date.getDate() + 1);
                date = proxy._getNextWorkingDay(date);
                return date;;
            }
            else
                return date;
        },

        _getPrevWorkingDay: function (date) {
            var proxy = this,
                model = proxy.model,
                dayIndex = date.getDay(),
                prevIndex = (dayIndex == 0) ? 6 : dayIndex - 1;
            if (proxy._nonWorkingDayIndex.indexOf(dayIndex) != -1 || (proxy._nonWorkingDayIndex.indexOf(prevIndex) != -1 && this._defaultEndTime == 86400 && this._getSecondsInDecimal(date) == 0)) {
                date.setDate(date.getDate() - 1);
                if (proxy._nonWorkingDayIndex.indexOf(date.getDay()) != -1)
                    date = proxy._getPrevWorkingDay(date);
                return date;
            }
            else
                return date;
        },

        _destroy: function () {
            var proxy = this;
            //Unbind all events binded to Document and window and chart side and TreeGrid side
            this.element.off();
            proxy._off($(window), "resize", proxy.windowResize);
            $("#" + this._id + "_dialogEdit_wrapper").clearQueue();
            $("#" + this._id + "_dialogEdit_wrapper").stop();
            $("#" + this._id + "_dialogAdd_wrapper").clearQueue();
            $("#" + this._id + "_dialogAdd_wrapper").stop();
            $("#" + proxy._id + "_dialogAdd").find('.e-treegrid').ejTreeGrid("destroy");
            $("#" + proxy._id + "_dialogEdit").find('.e-treegrid').ejTreeGrid("destroy");
            $("#" + proxy._id + "_dialogEdit").data("ejDialog") && $("#" + proxy._id + "_dialogEdit").data("ejDialog").destroy();
            $("#" + proxy._id + "_dialogAdd").data("ejDialog") && $("#" + proxy._id + "_dialogAdd").data("ejDialog").destroy();
            $("#" + proxy._id + "_dialogAdd").remove();
            $("#" + proxy._id + "_dialogEdit").remove();
            $("#" + this._id + "_toolbarItems_Main").remove();
            $("#" + this._id + "_dialogEdit_wrapper").remove();
            $("#" + this._id + "startDateEdit_popup").remove();
            $("#" + this._id + "endDateEdit_popup").remove();
            $("#" + this._id + "startDateAdd_popup").remove();
            $("#" + this._id + "endDateAdd_popup").remove();
            $("#" + this._id + "taskTypeEdit_popup_wrapper").remove();
            $("#" + this._id + "_dialogAdd_wrapper").remove();
            $("#" + this._id + "effortDrivenEdit_popup_wrapper").remove();
            $("#" + this._id + "_dialogValidationRule_wrapper").remove();
            //Chart side
            var ganttChartObj = proxy._$ganttchartHelper.ejGanttChart("instance");
            ganttChartObj.destroy();
            //TreeGrid side
            var treeGridObj = proxy._$treegridHelper.ejTreeGrid("instance");
            treeGridObj.destroy();
            proxy.element.empty().removeClass("e-gantt-core e-gantt " + proxy.model.cssClass);
        },
        /*Refresh Gantt toolbar elements*/
        _updateToolbar: function () {
            var proxy = this,
                model = proxy.model,
                ganttHeight;
            $("#" + proxy._id + "_toolbarItems").remove();
            $("#" + proxy._id + "_toolbarItems_Main").remove();
            if (model.toolbarSettings.showToolbar) {
                proxy._renderToolBar().insertBefore($("#e-ejSpliter" + proxy._id));
                proxy._updateToolbarOptions("");
            }
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 9) {
                proxy._totalBorderHeight = model.toolbarSettings.showToolbar ? 3 : 2;//top,bottom,toolbar div
            } else {
                proxy._totalBorderHeight = model.toolbarSettings.showToolbar ? 1 : 0;//top box-sizing:border-box includes it's border
            }
            proxy._$treegridHelper.ejTreeGrid("cancelEditCell");
            //Calculate the viewport height based on toolbar height
            //Change the tree grid and gantt chart container height based on view port height
            var toolbar = $("#" + proxy._id + "_toolbarItems"),
                ganttbody = proxy.element.find(".e-ganttviewerbodyContianer"),
                gantthead = proxy.element.find(".e-ganttviewerheaderContainer"),
                treegridcontent = ("#ejTreeGrid" + proxy._id + "e-gridcontent"),
                splitter = $("#e-ejSpliter" + proxy._id),
                height = $(proxy.element).height() - proxy._totalBorderHeight,
                viewPortHeight = height - gantthead.height() - 2 - toolbar.height(), // 2 is border width
                top = ganttbody.ejScroller("option", "scrollTop"),
                left = ganttbody.ejScroller("option", "scrollLeft");
            ganttbody.ejScroller({
                height: viewPortHeight
            });
            ganttHeight = height - toolbar.height();
            splitter.height(ganttHeight);
            $("#ejTreeGrid" + proxy._id).height(ganttHeight);
            $("#ejGanttChart" + proxy._id).height(ganttHeight);
            $(treegridcontent).height(viewPortHeight);
            ganttbody.height(viewPortHeight);
            $(treegridcontent).ejScroller("refresh");
            ganttbody.ejScroller("option", "scrollTop", top);
            ganttbody.ejScroller("option", "scrollLeft", left);
            proxy._$treegridHelper.ejTreeGrid("updateViewPortHeight");
            proxy._$ganttchartHelper.ejGanttChart("updateViewPortHeight");
            if (proxy.model.enableVirtualization) {
                proxy._$treegridHelper.ejTreeGrid("processBindings");
                var tempArgs = {};
                tempArgs.requestType = ej.TreeGrid.Actions.Refresh;
                proxy._$treegridHelper.ejTreeGrid("sendDataRenderingRequest", tempArgs);
                proxy._$ganttchartHelper.ejGanttChart("refreshHelper", proxy.model.currentViewData, proxy.model.updatedRecords);
                proxy._$ganttchartHelper.ejGanttChart("onScrollHelper", top);
            }
            proxy._clearContextMenu();
        },
        /*Get string value from record*/
        _getDurationStringValue: function (data) {
            var val = "";
            if (data.duration != null && data.duration != undefined && data.duration !== "") {
                if (typeof data.duration == "string") {
                    var duration = parseFloat(data.duration);
                    val += !isNaN(duration) ? parseFloat(duration.toFixed(2)) + " " : "";
                }
                else
                    val += parseFloat(data.duration.toFixed(2)) + " ";
                if (data.durationUnit != null && data.durationUnit != undefined) {
                    var multiple = data.duration != 1;
                    if (data.durationUnit == "day" || data.durationUnit == "days")
                        val += multiple ? this._durationUnitTexts.days : this._durationUnitTexts.day;
                    else if (data.durationUnit == "hour" || data.durationUnit == "hours")
                        val += multiple ? this._durationUnitTexts.hours : this._durationUnitTexts.hour;
                    else if (data.durationUnit == "minute" || data.durationUnit == "minutes")
                        val += multiple ? this._durationUnitTexts.minutes : this._durationUnitTexts.minute;
                    else
                        val += this.model.selectedItem.durationUnit;
                }
            }
            return val;
        },

        //Get predecessor value as string with offset values
        _getPredecessorStringValue:function(data)
        {
            var proxy = this,
                predecessors = data.predecessor,
                returnVal = "";
            if (predecessors) {
                var length = predecessors.length,
                    resultString = "";
                for (var i = 0; i < length; i++) {
                    var cPredecessor = predecessors[i],
                        temp = "";
                    if (cPredecessor.from != data.taskId) {
                        temp = cPredecessor.from + cPredecessor.predecessorsType;
                        if (cPredecessor.offset != 0) {
                            temp += cPredecessor.offset > 0 ? ("+" + cPredecessor.offset + " ") : (cPredecessor.offset + " ");
                            var multiple = Math.abs(cPredecessor.offset) != 1;
                            if (cPredecessor.offsetDurationUnit == "day")
                                temp += multiple ? proxy._durationUnitTexts.days : proxy._durationUnitTexts.day;
                            else if (cPredecessor.offsetDurationUnit == "hour")
                                temp += multiple ? proxy._durationUnitTexts.hours : proxy._durationUnitTexts.hour;
                            else
                                temp += multiple ? proxy._durationUnitTexts.minutes : proxy._durationUnitTexts.minute;
                        }
                        if (resultString.length > 0)
                            resultString = resultString + "," + temp;
                        else
                            resultString = temp;
                    }
                }
            }
            return resultString;
        },
        _getValidStartDate: function (ganttRecord) {
            var proxy = this;

            if (ej.isNullOrUndefined(ganttRecord.startDate)) {
                if (!ej.isNullOrUndefined(ganttRecord.endDate)) {
                    var sDate = new Date(ganttRecord.endDate);
                    proxy._setTime(proxy._defaultStartTime, sDate);
                    return sDate;
                }
                else if (!ej.isNullOrUndefined(ganttRecord.duration)) {
                    var sDate = proxy._getScheduledStartDate(ganttRecord);
                    if (sDate) {
                        return sDate;
                    }
                    else
                        return null;
                }
                else
                    return null;
            }
            else
                return new Date(ganttRecord.startDate);
        },
        _getValidEndDate: function (ganttRecord) {
            var proxy = this, eDate, sDate;

            if (ej.isNullOrUndefined(ganttRecord.endDate)) {
                if (!ej.isNullOrUndefined(ganttRecord.startDate)) {
                    if (ganttRecord.isMilesStone)
                        eDate = proxy._checkStartDate(ganttRecord.startDate, ganttRecord);
                    else {
                        eDate = new Date(ganttRecord.startDate);
                        proxy._setTime(proxy._defaultEndTime, eDate);
                    }
                    return new Date(eDate);
                }
                else if (!ej.isNullOrUndefined(ganttRecord.duration)) {
                    sDate = proxy._getValidStartDate(ganttRecord);
                    if (sDate) {
                        eDate = proxy._getEndDate(sDate, ganttRecord.duration, ganttRecord.durationUnit, ganttRecord);
                        return new Date(eDate);
                    }
                    else
                        return null;
                }
                else
                    return null;
            }
            else
                return new Date(ganttRecord.endDate);
        },
        _compareDates: function (date1, date2) {
            if (!ej.isNullOrUndefined(date1) && !ej.isNullOrUndefined(date2))
                return (date1.getTime() > date2.getTime()) ? 1 : (date1.getTime() < date2.getTime()) ? -1 : 0;
            else if (!ej.isNullOrUndefined(date1) && ej.isNullOrUndefined(date2))
                return 1;
            else if (ej.isNullOrUndefined(date1) && !ej.isNullOrUndefined(date2))
                return -1
            else
                return false;
        },
        _compareDatesFromRecord: function (ganttRecord) {
            var sDate = this._getValidStartDate(ganttRecord),
                eDate = this._getValidEndDate(ganttRecord);
            return this._compareDates(sDate, eDate);
        },

        _updateToScheduledValue: function (ganttRecord, isRefresh) {
            var proxy = this;
            if (ganttRecord._isScheduledTask() || !proxy._isPredecessorEdited || (!ganttRecord.isAutoSchedule && !this.model.validateManualTasksOnLinking))
                return ganttRecord;
            if (ganttRecord.startDate) {
                ganttRecord.duration = 1;
                ganttRecord._calculateEndDate(this);
            }
            else if (ganttRecord.endDate) {
                ganttRecord.duration = 1;
                ganttRecord.startDate = proxy._getStartDate(ganttRecord.endDate, ganttRecord.duration, ganttRecord.durationUnit, ganttRecord);
            }
            else {
                ganttRecord.duration = ej.isNullOrUndefined(ganttRecord.duration) ? 1 : ganttRecord.duration;
                ganttRecord.startDate = proxy._getValidStartDate(ganttRecord);
                ganttRecord._calculateEndDate(this);
            }
            ganttRecord.left =  ganttRecord._calculateLeft(this);
            ganttRecord.width = ganttRecord._calculateWidth(this);
            ganttRecord.progressWidth = proxy._getProgressWidth(ganttRecord.width, ganttRecord.status);
            proxy._updateItemValueInRecord(ganttRecord);
            proxy._validatePredecessorOnEditing(ganttRecord);
            proxy.refreshGanttRecord(ganttRecord);
            if (isRefresh) {
                if (ganttRecord.parentItem && ganttRecord.isAutoSchedule)
                    proxy._updateParentItem(ganttRecord);
                else
                    proxy._updateManualParentItem(ganttRecord);
            }
            return ganttRecord;
        }
    });
    
    if (ej.ganttFeatures.predecessor)
        $.extend(ej.Gantt.prototype, ej.ganttFeatures.predecessor);

    ej.Gantt.ViewType = {
        ProjectView: "projectView",
        ResourceView: "resourceView",
        HistogramView: "histogramView"
    }

    ej.Gantt.EditingType = {
        String: "stringedit",
        Boolean: "booleanedit",
        Numeric: "numericedit",
        Dropdown: "dropdownedit",
        DatePicker: "datepicker",
        DateTimePicker: "datetimepicker",
        Maskedit: "maskedEdit"
    };

    ej.Gantt.ToolbarItems = {
        Add: "add",
        Edit: "edit",
        Delete: "delete",
        Update: "update",
        Cancel: "cancel",
        Search: "search",
        Indent: "indent",
        Outdent: "outdent",
        ExpandAll: "expandAll",
        CollapseAll: "collapseAll",
        PrevTimeSpan: "prevTimeSpan",
        NextTimeSpan: "nextTimeSpan",        
        CriticalPath: "criticalPath",
        ExcelExport: "excelExport",
        PdfExport: "pdfExport"
    };

    ej.Gantt.ScheduleHeaderType = {
        Year: "year",
        Month: "month",
        Week: "week",
        Day: "day",
        Hour:"hour"
    };

    ej.Gantt.minutesPerInterval = {
        Auto:"auto",
        OneMinute: "oneMinute",
        FiveMinutes: "fiveMinutes",
        FifteenMinutes: "fifteenMinutes",
        ThirtyMinutes:"thirtyMinutes"
    };

    ej.Gantt.DurationUnit = {
        Day: "day",
        Hour: "hour",
        Minute:"minute"
    };
    ej.Gantt.WorkUnit = {
        Day: "day",
        Hour: "hour",
        Minute: "minute"
    };
    ej.Gantt.TaskType = {
        FixedUnit: "fixedUnit",
        FixedWork: "fixedWork",
        FixedDuration: "fixedDuration"
    }
    ej.Gantt.workingTimeScale = {
        TimeScale8Hours: "TimeScale8Hours",
        TimeScale24Hours: "TimeScale24Hours",
    };

    ej.Gantt.RowPosition = {
        Top: "top",
        Bottom: "bottom",
        AboveSelectedRow: "aboveselectedrow",
        BelowSelectedRow: "belowselectedrow",
        Child:"child"
    };

    //Enum for Edit Action of TreeGrid.
    ej.Gantt.BeginEditAction = {
        DblClick: "dblClick",
        Click: "click"
    };

    //Enum Value of selectionType.
    ej.Gantt.SelectionType = {
        Single: "single",
        Multiple:"multiple"
    };

    //Enum Value of selectionType.
    ej.Gantt.TimescaleRoundMode = {
        Auto:"auto",
        Year: "year",
        Month: "month",
        Week:"week"
    };


    //Enum Value of selectionMode.
    ej.Gantt.SelectionMode = {
        Row: "row",
        Cell: "cell"
    };

    ej.Gantt.TaskSchedulingMode = {
        Auto: "auto",
        Manual: "manual",
        Custom: "custom"
    };

    ej.Gantt.Locale = ej.Gantt.Locale || {};

    ej.Gantt.Locale["default"] = ej.Gantt.Locale["en-US"] = {

        //string to display with dataSource contains 0 objects
        emptyRecord: "No records to display",
        unassignedTask: "Unassigned Task",
        alertTexts: {
            indentAlert: "There is no Gantt record is selected to perform the indent",
            outdentAlert: "There is no Gantt record is selected to perform the outdent",
            predecessorEditingValidationAlert: "Cyclic dependency occurred, please check the predecessor",
            predecessorAddingValidationAlert: "Fill all the columns in predecessor table",
            idValidationAlert: "Duplicate ID",
            dateValidationAlert: "Invalid end date",
            dialogResourceAlert: "Fill all the columns in resource table"
        },

        //headerText to be displayed in treegrid
        columnHeaderTexts: {
            serialNumber: "S.No",
            taskId: "ID",
            taskName: "Task Name",
            startDate: "Start Date",
            endDate: "End Date",
            resourceInfo: "Resources",
            duration: "Duration",
            status: "Progress",
            taskMode: "Task Mode",
            subTasksStartDate: "SubTasks Start Date",
            subTasksEndDate: "SubTasks End Date",
            scheduleStartDate: "Schedule Start Date",
            scheduleEndDate: "Schedule End Date",
            predecessor: "Predecessors",
            type: "Type",
            offset: "Offset",
            baselineStartDate: "Baseline Start Date",
            baselineEndDate: "Baseline End Date",
            WBS: "WBS",
            WBSPredecessor: "WBS Predecessor",
            dialogCustomFieldName: "Column Name",
            dialogCustomFieldValue: "Value",
            notes: "Notes",
            taskType: "Task Type",
            work: "Work",
            unit:"Unit",
            effortDriven: "Effort Driven",
            resourceName: "Resource Name"
        },

        //string to display in dialog 
        editDialogTexts: {
            addFormTitle: "New Task",
            editFormTitle: "Task Information",
            saveButton: "Save",
            deleteButton: "Delete Task",
            cancelButton: "Cancel",
            addPredecessor: "Add New",
            removePredecessor: "Remove",
            addButton: "Add"
        },

        //string to display in column add dialog 
        columnDialogTexts: {
            field: "Field",
            headerText: "Header Text",
            editType: "Edit Type",
            filterEditType: "Filter Edit Type",
            allowFiltering: "Allow Filtering",
            allowFilteringBlankContent: "Allow Filtering Blank Content",
            allowSorting: "Allow Sorting",
            visible: "Visible",
            width: "Width",
            textAlign: "Text Alignment",
            headerTextAlign: "Header Text Alignment",
            columnsDropdownData: "Column Dropdown Data",
            dropdownTableText: "Text",
            dropdownTableValue: "Value",
            addData: "Add",
            deleteData: "Remove",
            allowCellSelection: "Allow Cell Selection",
            displayAsCheckbox: "Display As Checkbox",
            clipMode: "Clip Mode",
            tooltip: "Tooltip",
            showInColumnChooser: "Show In Column Chooser",
            headerTooltip: "Header Tooltip"
        },

        //string to be displayed in Toolbox's tooltip 
        toolboxTooltipTexts: {
            addTool: "Add",
            editTool: "Edit",
            saveTool: "Update",
            deleteTool: "Delete",
            cancelTool: "Cancel",
            searchTool: "Search",
            indentTool: "Indent",
            outdentTool: "Outdent",
            expandAllTool: "Expand All",
            collapseAllTool: "Collapse All",
            nextTimeSpanTool: "Next Timespan",
            prevTimeSpanTool: "Previous Timespan",            
            criticalPathTool: "Critical Path",
            excelExportTool: "Excel Export",
            pdfExportTool:"PDF Export"
        },

        //string to be displayed in taskbar tooltip for duration unit 
        durationUnitTexts: {           
            days: "days",
            hours: "hours",
            minutes: "minutes",
            day: "day",
            hour: "hour",
            minute: "minute",
        },
        durationUnitEditText: { minute: ["m", "min", "minute", "minutes"], hour: ["h", "hr", "hour", "hours"], day: ["d", "dy", "day", "days"] },

        //string to be displayed in taskbar tooltip for duration unit 
        workUnitTexts: {
            day: "days",
            hour: "hours",
            minute: "minutes"           
        },

        //String to be displayed in default type drop down.
        taskTypeTexts: {
            fixedWork: "Fixed Work",
            fixedUnit: "Fixed Units",
            fixedDuration: "Fixed Duration"
        },

        //String to be displayed in effort drven drop down box.
        effortDrivenTexts: {
            yes: "Yes",
            no: "No"
        },

        //string to be displayed in context menu 
        contextMenuTexts: {
            taskDetailsText: "Task Details...",
            addNewTaskText: "Add New Task",
            indentText: "Indent",
            outdentText: "Outdent",
            deleteText: "Delete",
            aboveText: "Above",
            belowText: "Below"
        },

        //Name to be displayed for New Task while adding  
        newTaskTexts: {           
            newTaskName: "New Task"
        },

        //string to be displayed in column menu 
        columnMenuTexts: {
            sortAscendingText: "Sort Ascending",
            sortDescendingText: "Sort Descending",
            columnsText: "Columns",
            insertColumnLeft: "Insert Column Left",
            insertColumnRight: "Insert Column Right",
            deleteColumn: "Delete Column",
            renameColumn: "Rename Column"
        },

        taskModeTexts: {
            manual: "Manual",
            auto: "Auto"
        },

        //String to be display for edittype and filter edit type.
        editTypeTexts: {
            string: "String",
            numeric: "Numeric",
            datePicker: "Date Picker",
            dateTimePicker: "Date Time Picker",
            dropdown: "Dropdown",
            boolean: "Boolean"

        },

        // String to be display for text align type.
        textAlignTypes: {
            right: "Right",
            left: "Left",
            center: "Center"
        },

        // String to be display for clip mode type.
        clipModeTexts: {
            clip: "Clip",
            ellipsis: "Ellipsis"
        },

        //string to be displayed in column add dialog title 
        columnDialogTitle: {
            insertColumn: "Insert Column",
            deleteColumn: "Delete Column",
            renameColumn: "Rename Column"
        },

        //Locale Text for delete confirm dialog
        deleteColumnText: "Are you sure you want to delete this column?",
        okButtonText: "OK",
        cancelButtonText: "Cancel",
        confirmDeleteText: "Confirm Delete",

        predecessorEditingTexts: {
            fromText: "From",
            toText : "To"
        },

        dialogTabTitleTexts: {
            generalTabText: "General",
            predecessorsTabText: "Predecessors",
            resourcesTabText: "Resources",
            customFieldsTabText: "Custom Fields",
            notesTabText:"Notes"
        },
        predecessorCollectionText: [
                { id: "SS", text: "Start-Start", value: "Start-Start" },
                { id: "SF", text: "Start-Finish", value: "Start-Finish" },
                { id: "FS", text: "Finish-Start", value: "Finish-Start" },
                { id: "FF", text: "Finish-Finish", value: "Finish-Finish" }
        ],

        //Validation dialog text
        linkValidationRuleText: {
            taskBeforePredecessor: "You moved '{0}' to start before '{1}' finishes and the two tasks are linked. As the result, the links cannot be honored. Select one action below to perform",
            taskAfterPredecessor: "You moved '{0}' away from '{1}' and the two tasks are linked. As the result, the links cannot be honored. Select one action below to perform",
        },

        linkValidationDialogTitle: "Validate Editing",

        //string to be displayed in column add dialog title 
        linkValidationRuleOptions: {
            cancel: "Cancel, keep the existing link",
            removeLink: "Remove the link and move '{0}' to start on '{1}'.", //previous data task name and startdate
            preserveLink: "Move the '{0}' to start on '{1}' and keep the link." // current data task name and startdate
        },
        connectorLineDialogText: {
            from: "From",
            to: "To",
            taskLink: "Task Link",
            type: "Type",
            lag: "Lag",
            okButtonText: "Ok",
            cancelButtonText: "Cancel",
            deleteButtonText: "Delete",
            title: "Task Dependency"
        },
        nullText: "Null"
    };

    /*-----Initialize the GanttRecord object--------------*/

    ej.Gantt.GanttRecord = function () {
        var proxy = this;
        proxy.eResourceName = "";
        proxy.eResourceChildTasks = [];
        proxy.eResourceTaskType = "";
        proxy.eOverlapIndex = 1;
        proxy.eOverlapWithIndex = -1;
        proxy.eOverlapped = false;
        proxy.taskId = null;
        proxy.taskName = null;
        proxy.startDate = null;
        proxy.endDate = null;
        proxy.duration = null;
        proxy.isMilestone = false;
        proxy.status = null;
        proxy.predecessor = null;
        proxy.resourceInfo = null;
        proxy.parentItem = null;
        proxy.isSelected = false;
        proxy.childRecords = null;
        proxy.hasChildRecords = false;
        proxy.expanded = false;
        proxy.level = 0;
        proxy.left = 0;
        proxy.width = 0;
        proxy.progressWidth = 0;
        proxy.item = null;
        proxy.baselineLeft = 0;
        proxy.baselineWidth = 0;
        proxy.baselineStartDate = null;
        proxy.baselineEndDate = null;
        proxy.isCritical = false,
        proxy.slack = null,
        proxy.isReadOnly = false;
        proxy.hasFilteredChildRecords = true;
        proxy.taskbarBackground = null;
        proxy.progressbarBackground = null;
        proxy.parentProgressbarBackground = null;
        proxy.cellBackgroundColor = null;
        proxy.rowBackgroundColor = null;
        proxy.treeMappingName = [];
        proxy.dragState = true;
        proxy.isSelected = false;
        proxy.durationUnit = "";
        proxy.isAutoSchedule = true;
        proxy.manualStartDate = null;
        proxy.manualEndDate = null;
        proxy.manualLeft = 0;
        proxy.manualDuration = 0;
        proxy.manualWidth = 0;
        proxy.serialNumber = null;
        proxy.serialNumberPredecessor = null;
    }

    ej.Gantt.GanttRecord.prototype = {

        //calculate the left position of the taskbar with starte date and schedule start date
        _calculateLeft: function (ganttObj) {
            var sDate, eDateWidth = 0, left = -300,
                mileStone = this.isMilestone; // to hide taskbar of invalid date tasks            
            if (this.startDate)
                sDate = new Date(this.startDate);
            else if (this.endDate) {  //Calculate left for end Date only task using endDate
                sDate = new Date(this.endDate);
                eDateWidth = ganttObj._unscheduledTaskWidth;
                mileStone = true;
            }
            else
                sDate = ganttObj._getValidStartDate(this);
            if (!ej.isNullOrUndefined(sDate))
                left = ganttObj._getTaskLeft(sDate, mileStone) - eDateWidth;
            return left
        },
        //calculate the left position of the taskbar with manual starte date and schedule start date
        _calculateManualLeft: function (ganttObj) {
            return ganttObj._getTaskLeft(this.manualStartDate);
        },

        //calculate the left position of the taskbar with starte date and schedule start date
        //_calculateTop: function (ganttObj) {
        //    return ganttObj._getTaskTop(this.eOverlapIndex, this);
        //},

        //calculate the left margin of the baseLine element.
        _calculateBaselineLeft: function (ganttObj) {
            var beginDate = new Date(this.baselineStartDate),
                endDate = new Date(this.baselineEndDate);
            if (beginDate && endDate) {
                return ganttObj._getTaskLeft(beginDate, this.isMilestone);
            } else {
                return 0;
            }
        },

        //calculate the right margin of the baseLine element.
        _calculateBaselineRight: function (ganttObj) {
            var beginDate = new Date(this.baselineStartDate),
                endDate = new Date(this.baselineEndDate);
            if (beginDate && endDate) {
                return ganttObj._getTaskLeft(endDate);
            } else {
                return 0;
            }
        },

        //calculate the with between start date and end date
        _calculateWidth: function (ganttObj) {
            var sDate, eDate;
            if (ej.isNullOrUndefined(this.startDate) && ej.isNullOrUndefined(this.endDate)) {
                sDate = ganttObj._getValidStartDate(this);
                eDate = ganttObj._getValidEndDate(this);
            }
            else {
                sDate = this.startDate;
                eDate = this.endDate;
            }

            if (ej.isNullOrUndefined(sDate) || ej.isNullOrUndefined(eDate))
                return ganttObj._unscheduledTaskWidth;
            else
                return ganttObj._getTaskWidth(sDate, eDate);
        },

        //calculate the with between manual start date and manual end date
        _calculateManualWidth: function (ganttObj) {
            var proxy = this,
                manualStartDate = new Date(proxy.manualStartDate),
                manualEndDate = new Date(proxy.manualEndDate);
            return ganttObj._getTaskWidth(manualStartDate, manualEndDate);
        },

        //calculate the with between baseline start date and baseline end date
        _calculateBaseLineWidth: function (ganttObj) {
            var proxy = this,
               startdate = new Date(this.baselineStartDate),
                   enddate = new Date(this.baselineEndDate);
            return ganttObj._getTaskWidth(startdate, enddate);
        },
        /*Get string format of date object */
        _getFormatedDate: function (dateObject, dateformat, locale) {
            return ej.format(dateObject, dateformat, locale);
        },
        /*Get date object from string value*/
        _getDateFromFormat: function (dateString, dateformat, locale) {
            if (dateString) {
                return ej.parseDate(dateString, dateformat, locale) == null ?
                    new Date(dateString) : ej.parseDate(dateString, dateformat, locale);
            }
        },

        /*Assing resource collection to record from data source value*/
        _setResourceInfo: function (resourceIdcollection, resourceIdMapping, resourceNameMapping, resourceUnitMapping, resourcecollection) {

            var proxy=this, count = 0,
            resources = [];

            for (count; count < resourceIdcollection.length; count++) {

                var resource = resourcecollection.filter(function (resourceInfo) {
                    if (typeof resourceIdcollection[count] == "object" && resourceIdcollection[count][resourceIdMapping] === resourceInfo[resourceIdMapping])
                        return true;
                    else 
                        return resourceIdcollection[count] === resourceInfo[resourceIdMapping];
                });

                var ganttRecordResource = $.extend({}, resource[0]);
                if (resource.length) {
                    resources.push(ganttRecordResource);
                    if (resourceUnitMapping != "" && !ej.isNullOrUndefined(resourceIdcollection[count][resourceUnitMapping])) {
                        ganttRecordResource[resourceUnitMapping] = resourceIdcollection[count][resourceUnitMapping];
                    } else {
                        proxy._updateResourceUnit(resource[0], ganttRecordResource, resourceUnitMapping);
                    }
                }
                else {
                    resourceIdcollection.splice(count, 1);
                    count--;
                }
            }
            return resources;
        },
        /*Update resource unit with value or default value*/
        _updateResourceUnit: function (resource, ganttRecordResource, resourceUnitMapping) {
            if (resourceUnitMapping != "") {
                if (ej.isNullOrUndefined(resource[resourceUnitMapping]))
                    ganttRecordResource[resourceUnitMapping] = 100;
            }
            else                
                ganttRecordResource.unit = 100;            
        },

        /*Update progress of parent record with child records progress value*/
        _updateParentProgress: function (parent, progressMapping) {
            var parentProgress = 0,
                childRecords = parent.childRecords,
                childCount = childRecords ? childRecords.length : 0,
                totalProgress = 0,
                milesStoneCount = 0,
                taskCount = 0;

            if (childRecords) {
                for (var i = 0; i < childCount; i++) {
                    if (!childRecords[i].isMilestone)
                        totalProgress += parseInt(childRecords[i].status);
                    else
                        milesStoneCount += 1;
                }
                taskCount = childCount - milesStoneCount;
                parentProgress = taskCount > 0 ? (totalProgress / taskCount) : 0;
                if (isNaN(parentProgress))
                    parentProgress = 0;
                var width = parent.isAutoSchedule ? parent.width : parent.manualWidth;
                parent.progressWidth = this._getProgressWidth(width, parentProgress);
                parent.status = Math.floor(parentProgress);
                if (progressMapping)
                    parent.item[progressMapping] = parent.status;
            }
            if (parent.parentItem) {
                this._updateParentProgress(parent.parentItem, progressMapping);
            }
        },
        /*Get with of progress value*/
        _getProgressWidth: function (parentwidth, percent) {
            return (parentwidth * percent) / 100;
        },
        /*Get predecessor collection object from predecessor string value*/
        _calculatePredecessor: function (string, durationUnitLabels, defaultDurationUnit, gantt) {
            var collection = [],
                match,
                obj = {},
                values,
                to = this.taskId.toString(),
                offsetvalue,
                ganttRecord = this, ids,
                proxyGantt = gantt, predecessorText;
            ids = proxyGantt.model.viewType == "resourceView" ? proxyGantt._resourceUniqTaskIds : proxyGantt.model.ids;
            if (typeof string === 'string')
            {
                string.split(',').forEach(function (el) {
                    values = el.split('+');
                    offsetvalue = '+';
                    if (el.indexOf('-') >= 0) {
                        values = el.split('-');
                        offsetvalue = '-';
                    }
                    match = values[0].match(/(\d+|[A-z]+)/g);
                    //Validate for appropriate predecessor 
                    if (match[0] && ids.indexOf(match[0]) != -1) {
                        if (match.length > 1) {
                            var type = match[1].toUpperCase();
                            if (type == 'FS' || type == 'FF' || type == 'SF' || type == 'SS')
                                predecessorText = type;
                            else {
                                if (proxyGantt._isValidPredecessorString)
                                    proxyGantt._isValidPredecessorString = false; // Flag for updating proper predecessor string
                                predecessorText = 'FS';
                            }
                        }
                        else {
                            if (proxyGantt._isValidPredecessorString)
                                proxyGantt._isValidPredecessorString = false; // Flag for updating proper predecessor string
                            predecessorText = 'FS';                            
                        }
                    }
                    else {
                        if (proxyGantt._isValidPredecessorString)
                            proxyGantt._isValidPredecessorString = false; // Flag for updating proper predecessor string
                        return;//Exit current loop for invalid id (match[0])
                    }
                    obj = {
                        from: match[0],
                        predecessorsType: predecessorText,
                        offset: values.length > 1 ? offsetvalue + "" + values[1] : "0",
                        isdrawn: false,
                        to: to
                    };
                    var offsetUnits = ganttRecord._getOffsetDurationUnit(obj.offset, durationUnitLabels, defaultDurationUnit);
                    obj.offset = offsetUnits.duration;
                    obj.offsetDurationUnit = offsetUnits.durationUnit;
                    collection.push(obj);
                });
           }
            return collection;
        },
        /*Get duration and duration unit value from tasks*/
        _getOffsetDurationUnit: function (val, durationUnitLabels, defaultDurationUnit) {
            var duration = 0,
                  durationUnit = defaultDurationUnit;

            if (typeof val == "string") {
                var values = val.match(/[^0-9]+|[0-9]+/g);
                for (var x = 0; x < values.length; x++) {
                    values[x] = $.trim(values[x]);
                }
                if (values[0] == "-" && values[1]){
                    values[1] = values[0] + values[1];
                    values.shift();
                }
                else if (values[0] == "+") {
                    values.shift();
                }
                
                if (values[1] == "." && !isNaN(parseInt(values[2]))) {
                    values[0] += values[1] + values[2];
                    values.splice(1, 2);
                }                
                if (values && values.length <= 2) {
                    duration = parseFloat(values[0]);
                    durationUnit = values[1] ? $.trim(values[1].toLowerCase()) : "";
                    if (durationUnitLabels.minute.indexOf(durationUnit) != -1)
                        durationUnit = ej.Gantt.DurationUnit.Minute;
                    else if (durationUnitLabels.hour.indexOf(durationUnit) != -1)
                        durationUnit = ej.Gantt.DurationUnit.Hour;
                    else if (durationUnitLabels.day.indexOf(durationUnit) != -1)
                        durationUnit = ej.Gantt.DurationUnit.Day;
                    else
                        durationUnit = defaultDurationUnit;
                }
            } else {
                duration = val;
                durationUnit = defaultDurationUnit;
            }
            if (isNaN(duration)) {
                duration = 0;
                durationUnit = ej.Gantt.DurationUnit.Day;
            }
            var output = {};
            output.duration = duration;
            output.durationUnit = durationUnit;
            return output;
        },

        /*Get end date of Gantt record with start date and duration*/
        _calculateEndDate: function (ganttObj) {
            var model = ganttObj.model, tempEndDate = null;           

            if (!ej.isNullOrUndefined(this.startDate)) {
                
                if (!ej.isNullOrUndefined(this.endDate) && ej.isNullOrUndefined(this.duration)) {
                    //Validate start date is greater than end date if duration is null
                    if (ganttObj._compareDates(this.startDate, this.endDate) == 1) {
                        this.startDate = new Date(this.endDate)
                        ganttObj._setTime(ganttObj._defaultStartTime, this.startDate);
                    }
                    this._calculateDuration(ganttObj);
                }
                if (!ej.isNullOrUndefined(this.duration))
                    tempEndDate = ganttObj._getEndDate(this.startDate, this.duration, this.durationUnit, this);
                this.endDate = tempEndDate;
            }                            
            if (model.endDateMapping)
                this.item[model.endDateMapping] = this.endDate;
        },
        /*Get duration of Gantt record with start date and end date*/
        _calculateDuration: function (ganttObj) {
            var model = ganttObj.model, tempDuration = ganttObj._getDuration(this.startDate, this.endDate, this.durationUnit, this.isAutoSchedule);
            this.duration = tempDuration;
            if (model.durationMapping && this.item) {
                this.item[model.durationMapping] = tempDuration;
                model.durationUnitMapping && (this.item[model.durationUnitMapping] = this.durationUnit);
            }
        },
        /*Get duration of Gantt record with manual start date and manual end date*/
        _calculateManualDuration: function (ganttObj) {
            var tempDuration = ganttObj._getDuration(this.manualStartDate, this.manualEndDate, this.durationUnit, this.isAutoSchedule);
            this.manualDuration = tempDuration;
        },

        //Update duration with respect to work and units of resources of a task.
        _updateDurationWithWork: function (proxy, resourceCollection) {
            var model = proxy.model, totalHours,
                resourceInfo = resourceCollection ? resourceCollection : this.resourceInfo,
                resourceLength = resourceInfo ? resourceInfo.length : 0,
                totalResourceOneDayWork = 0,
                updatedDuration = 0,
                ActualOneDayWork = proxy._secondsPerDay / (60 * 60); //in hours

            for (var length = 0; length < resourceLength; length++) {
                var resourceUnit = resourceInfo[length][model.resourceUnitMapping], //in percentage 
                    resourceOneDayWork = resourceUnit > 0 ? (ActualOneDayWork * resourceUnit) / 100 : ActualOneDayWork;//in hours

                totalResourceOneDayWork += resourceOneDayWork;
            }

            totalHours = this._getTotalWorksInHours(model,ActualOneDayWork);

            if (resourceLength != 0)
                updatedDuration += (totalHours / totalResourceOneDayWork);

            //Update work as per defined unit.
            if (this.durationUnit == "minute")
                updatedDuration = updatedDuration * ActualOneDayWork * 60;
            if (this.durationUnit == "hour")
                updatedDuration = updatedDuration * ActualOneDayWork;

            //To check the decimal places.
            if (updatedDuration % 1 != 0)
                updatedDuration = parseFloat(updatedDuration.toFixed(2));
            if (!ej.isNullOrUndefined(this.duration)) {
                proxy._isDurationUpdated = true;
                this.duration = updatedDuration;
                if (model.durationMapping)
                    this.item[model.durationMapping] = this.duration;
            }
        },
        //Update work with respect to duration and units of resources of a task.
        _updateWorkWithDuration: function (proxy, resourceCollection) {
            var model = proxy.model,
                resourceInfo = resourceCollection ? resourceCollection : this.resourceInfo,
                resourceLength = resourceInfo ? resourceInfo.length : 0,
                updatedWorks = 0,
                ActualOneDayWork = proxy._secondsPerDay / (60 * 60), //in hours
                durationInDay = this._getDurationInDays(ActualOneDayWork);

            for (var length = 0; length < resourceLength; length++) {
                var resourceUnit = resourceInfo[length][model.resourceUnitMapping], //in percentage 
                    resourceOneDayWork = resourceUnit > 0 ? (ActualOneDayWork * resourceUnit) / 100 : ActualOneDayWork;//in hours
                updatedWorks += (resourceOneDayWork * durationInDay);
            }

            //Update work as per defined unit.
            if (model.workUnit == "minute")
                updatedWorks = updatedWorks * 60;
            if (model.workUnit == "day")
                updatedWorks = updatedWorks / ActualOneDayWork;

            //To check the decimal places.
            if (updatedWorks % 1 != 0)
                updatedWorks = updatedWorks.toFixed(2);

            this.work = parseFloat(updatedWorks);
            if (model.workMapping)
                this.item[model.workMapping] = this.work;
        },
        //Update units of resources with respect to duration and work of a task.
        _updateUnitWithWork: function (proxy) {
            var model = proxy.model,
                resourceInfo = this.resourceInfo,
                resourceLength = resourceInfo ? resourceInfo.length : 0,
                ActualOneDayWork = proxy._secondsPerDay / (60 * 60); //in hours
            if (resourceLength == 0)
                return;
            var durationInDay = this._getDurationInDays(ActualOneDayWork),
                totalWorksInHour = this._getTotalWorksInHours(model, ActualOneDayWork),
                totalUnitInPercentage = durationInDay > 0 ? (totalWorksInHour / (durationInDay * ActualOneDayWork)) * 100 : 0,
                individualUnit = totalUnitInPercentage > 0 ? totalUnitInPercentage / resourceLength : 100;

            //To check the decimal places.
            if (individualUnit % 1 != 0)
                individualUnit =parseFloat(individualUnit.toFixed(2));           

            for (var length = 0; length < resourceLength; length++) {
                resourceInfo[length][model.resourceUnitMapping] = individualUnit;
            }
            //To update the unit value in data source
            proxy._updateResourceName(this);
        },
        _getTotalWorksInHours: function (model, oneDayWork) {
            var proxy = this, worksInHour;
            if (model.workUnit == "day")
                worksInHour = proxy.work * oneDayWork;
            else if (model.workUnit == "minute")
                worksInHour = proxy.work / 60;
            else
                worksInHour = proxy.work;

            return worksInHour;
        },
        _getDurationInDays:function(oneDayWork){
            var proxy = this, durationInDay,
                duration = ej.isNullOrUndefined(proxy.duration) ? 0 : proxy.duration;
            if (this.durationUnit == "hour")
                durationInDay = duration / oneDayWork;
            else if (this.durationUnit == "minute")
                durationInDay = duration / (oneDayWork * 60);
            else
                durationInDay = duration;

            return durationInDay;
        },
        //Get progress value from taskbar width and progrssbar width
        _getProgressPercent: function (parentwidth, progresswidth) {
            return Math.ceil(((progresswidth / parentwidth) * 100).toFixed(2));
        },
        /*update given miliseconds value in given date obect*/
        _setTime: function (seconds, date) {
            var hour = parseInt(seconds / (3600)),
               min = parseInt((seconds - (hour * 3600)) / 60),
               sec = seconds - (hour * 3600) - (min * 60);
            date.setHours(hour, min, sec, 0);
        },
        /*Returns updated end date with working time range and schedule mode type*/
        _endDateUpdate: function (date, days, minutes, workingTimeRanges, headerType) {
            if (!minutes)
                minutes = 0;
            var newDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + days,
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            );
            if (headerType == "day" || headerType == "hour") {
                //Rounding off to next day
                newDate.setHours(24);
                //Then assigning the dayDecimal duration values in Minutes for exact time
                newDate.setMinutes(minutes);
            }
            else {
                if (workingTimeRanges.length) {
                    if (minutes > 0) {
                        //Rounding off to next day
                        newDate.setHours(24);
                        //Updating to start time of the next day
                        this._setTime(workingTimeRanges[0].from, newDate);
                        //Then assigning the dayDecimal duration values in Minutes for exact time
                        newDate.setMinutes(minutes);
                    }
                    else
                        this._setTime(workingTimeRanges[workingTimeRanges.length - 1].to, newDate);
                }
            }
            return newDate;
        },
        /*Returns updated start date with working time range and schedule mode type*/
        _startDateUpdate: function (date, days, minutes, workingTimeRanges, headerType) {
            if (!minutes)
                minutes = 0;
            var newDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + days,
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            );
            if (headerType == "day" || headerType == "hour") {
                newDate.setMinutes(minutes);
            }
            else {
                if (workingTimeRanges.length) {
                    if (minutes > 0) {
                        //Updating to start time of the day
                        this._setTime(workingTimeRanges[0].from, newDate);
                        //Then add the balance dayDecimal duration values in Minutes for exact time
                        newDate.setMinutes(minutes);
                    }
                    else
                        this._setTime(workingTimeRanges[0].from, newDate);
                }
            }
            return newDate;
        },        
        _isScheduledTask: function () {
            if (ej.isNullOrUndefined(this.startDate) && ej.isNullOrUndefined(this.endDate) && ej.isNullOrUndefined(this.duration))
                return null;
            else if (ej.isNullOrUndefined(this.startDate) || ej.isNullOrUndefined(this.endDate) || ej.isNullOrUndefined(this.duration))
                return false;
            else
                return true;
        },
        
    };
    
    /*Get duration value as string with duration unit value*/
    ej.Gantt._getDurationStringValue = function (data) {
        var val = "";
        if (data.duration != null && data.duration != undefined && data.duration !== "") {
            if (typeof data.duration == "string") {
                var duration = parseFloat(data.duration);
                val += !isNaN(duration) ? parseFloat(duration.toFixed(2)) + " " : "";
            }
            else
                val += parseFloat(data.duration.toFixed(2)) + " ";
            if (data.durationUnit != null && data.durationUnit != undefined) {
                var multiple = data.duration != 1;
                if (data.durationUnit == "day")
                    val += multiple ? this.model.durationUnitTexts.days : this.model.durationUnitTexts.day;
                else if (data.durationUnit == "hour")
                    val += multiple ? this.model.durationUnitTexts.hours : this.model.durationUnitTexts.hour;
                else
                    val += multiple ? this.model.durationUnitTexts.minutes : this.model.durationUnitTexts.minute;
            }
        }
        return val;
    };
    //Returns cell value
    ej.Gantt._getCellValue = function (columnName) {

        var cellValue = this.data[columnName];

        if (cellValue) {
            return cellValue;
        } else {
            return this.data.item && this.data.item[columnName];
        }


    };

})(jQuery, Syncfusion);