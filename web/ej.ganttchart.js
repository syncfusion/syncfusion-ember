(function ($, ej, undefined) {
    // ejGanttChart is the plugin name 
    // "ej.GanttChart" is "namespace.className" will hold functions and properties
    'use strict';
    ej.ganttChartFeatures = ej.ganttChartFeatures || {};
    ej.widget("ejGanttChart", "ej.GanttChart", {
        // widget element will be automatically set in this
        element: null,

        // user defined model will be automatically set in this
        model: null,
        _rootCSS: "e-ganttchart",

        /* keyConfigurations for keyboard interaction in treegrid */
        keyConfigs: {
            focus: "e",

            //Insert
            insertRecord: "45",

            // delete
            deleteRecord: "46",

            //F2
            editRecord: "113",

            // Enter
            saveRequest: "13",

            //Esc   
            cancelRequest: "27",

            //Home,
            firstRowSelection: "36",

            //End,
            lastRowSelection: "35",

            //Left arrow
            leftArrow: "37",

            //Right arrow
            rightArrow: "39",

            //Up arrow
            upArrow: "38",

            //Down arrow
            downArrow: "40",

            //tab
            moveCellRight: "9",

            //shifttab
            moveCellLeft: "shift+9",

            //AltPlusDownArrow
            selectedRowExpand: "alt+40",

            //CtrlPlusDownArrow
            totalRowExpand: "ctrl+40",

            //AltPlusUpArrow
            selectedRowCollapse: "alt+38",

            //CtrlPlusUpArrow
            totalRowCollapse: "ctrl+38",

            //shift + DownArrow
            shiftDownArrow: "shift+40",
            //shift + UpArrow
            shiftUpArrow: "shift+38",
        },

        //default model
        defaults: {
            childPropertyName: "",
            taskIdMapping: "",
            taskNameMapping: "",
            startDateMapping: "",
            endDateMapping: "",
            childMapping: "",
            finishDateMapping: "",
            durationMapping: "",
            milestoneMapping: "",
            progressMapping: "",
            predecessorMapping: "",
            resourceInfoMapping: "",
            resourceNameMapping: "",
            resourceCollection: [], /*--------------Array containing the resource names */

            holidays: [
                {
                    day: null,
                    label: null,
                    background: null
                }
            ],

            stripLines: [
                {
                    day: null,
                    label: null,
                    lineStyle: "dotted",
                    lineColor: "#169dd7",
                    lineWidth: 2
                }
            ],

            enableTaskbarTooltip: true, /*------------showing tooltip on taskbar mouse over */
            enableTaskbarDragTooltip: true, /*--------showing taskbar while dragging taskbar */

            highlightWeekends: true, /*-------------Boolean value for highlighting weekends */

            scheduleStartDate: null, /*-------------start date of entire project */
            scheduleEndDate: null, /*---------------end date of entire project */

            enableProgressBarResizing: true, /*----------Boolean value for resizing progress bar */

            rowHeight: 30,
            progressbarHeight: 100,
            connectorlineWidth: 1,
            dateFormat: "MM/dd/yyyy",
            locale: "en-US",

            //background style
            taskbarBackground: "#DE8080", //"#5AC1E0",
            progressbarBackground: "#C44647", //"#169DD7",
            weekendBackground: '#F2F2F2',
            connectorLineBackground: "#383838",
            parentTaskbarBackground: "#383838",
            parentProgressbarBackground: "#1C1C1C",

            selectedItem: null,
            selectedRowIndex: -1,
            perDayWidth: null,

            perMonthWidth: null,//year-month schedule mode
            perWeekWidth: null,//month-week schedule mode
            perHourWidth:null,
            queryTaskbarInfo: null,

            taskbarTemplate: "",
            progressbarTemplate: null,
            parenttaskbarTemplate: "",
            parentprogressbarTemplate: null,
            milestoneTemplate:"",

            //internal collections
            flatRecords: [],
            updatedRecords: [],
            selectedItems:[],
            ids: [],
            currentViewData: [],

            scheduleWeeks: [],

            scheduleYears: [],
            scheduleMonths: [], //new property for month schedule
            scheduleDays:[],
            scheduleHours:[],
            projectStartDate: null, //new property instead of scheduleWeeks[0] and scheduleYears[0]
            projectEndDate: null,

           

            //tooltip templates
            tooltipTemplate: "",
            tooltipTemplateId:"",
            progressbarTooltipTemplateId: "",
            taskbarEditingTooltipTemplateId: "",

            taskbarEditingTooltipTemplate: "",
            progressbarTooltipTemplate: "",

            //boolean values
            showTaskNames: true,
            leftTaskLabelMapping: "",
            rightTaskLabelMapping: "",
            LeftTaskLabelTemplate: "",
            rightTaskLabelTemplate: "",
            showProgressStatus: true,
            showResourceNames: true,
            includeWeekend: false,
            allowZooming: false,
            readOnly:false,
            allowGanttChartEditing: true,
            allowKeyboardNavigation: true,
            allowDragAndDrop: false,
            //baselines
            renderBaseline: false,
            baselineColor: '#fba41c ',

            /* editing API's */
            editSettings: {
                allowEditing: false,
                allowAdding: false,
                allowDeleting: false,
                editMode: "normal",
                dialogEditorTemplateId: null
            },

            scheduleHeaderSettings:
            {
                weekHeaderFormat: "MMM dd , yyyy",//for week - Day schedule mode
                dayHeaderFormat: "",
                weekendBackground: '#F2F2F2',

                yearHeaderFormat: "yyyy",
                monthHeaderFormat: "MMM",

                hourHeaderFormat: "HH",
                minuteHeaderFormat:"mm",
                scheduleHeaderType: "week",
                weekStartDay: 0
            },
            workingTimeScale: "TimeScale8Hours",
            roundOffDayworkingTime: true,
            durationUnit: "day",

            localizedDays: null,
            localizedMonths: null,
            //localized string to be displayed in toolTip
            columnHeaderTexts: null,
            predecessorEditingTexts: null,
            enablePredecessorEditing: true,
            taskbarClick: null,
            predecessorTooltipTemplate:""
        },

        updateHighlightWeekends: function (boolValue) {
            var proxy = this;
            proxy.model.highlightWeekends = boolValue;

            if (proxy.model.highlightWeekends == true)
                proxy._renderWeekends();
            else
                proxy._$weekendsContainer.remove();
        },

        updateWeekendBackground: function (bgcolor) {
            var proxy = this;
            proxy.model.weekendBackground = bgcolor;
            proxy._$weekendsContainer.remove();
            proxy._renderWeekends();
        },

        showTooltip: function (boolValue) {
            var proxy = this;
            proxy.model.enableTaskbarTooltip = boolValue;
            proxy._createChartTaskbarTemplate();
            proxy._refresh();
        },

        showEditingTooltip: function (boolValue) {
            var proxy = this;
            proxy.model.enableTaskbarDragTooltip = boolValue;
            proxy._createChartTaskbarTemplate();
            proxy._refresh();
        },

        updateConnectorLineBackground: function (bgcolor) {
            var proxy = this;
            proxy.model.connectorLineBackground = bgcolor;
            proxy._createConnectorLineTemplate();
        },

        updateConnectorlineWidth: function (lineWidth) {
            var proxy = this;
            proxy.model.connectorlineWidth = parseInt(lineWidth);
            proxy._createConnectorLineTemplate();
        },
        updateEditedRecordEndDate: function (endDate) {
            var proxy = this;
            proxy._currentEditedRecord.endDate = endDate;
        },

        updateEditedRecordDuration: function (duration) {
            var proxy = this;
            proxy._currentEditedRecord.duration = duration;
        },

        updateTaskbarBackground: function (bgcolor) {
            var proxy = this;
            proxy.model.taskbarBackground = bgcolor;
            this._createChartTaskbarTemplate();
            this._refresh();
        },

        updateProgressbarBackground: function (bgcolor) {
            this.model.progressbarBackground = bgcolor;
            this._createChartTaskbarTemplate();
            this._refresh();
        },

        updateParentTaskbarBackground: function (bgcolor) {
            this.model.parentTaskbarBackground = bgcolor;
            this._createChartTaskbarTemplate();
            this._refresh();
        },

        updateParentProgressbarBackground: function (bgcolor) {
            this.model.parentProgressbarBackground = bgcolor;
            this._createChartTaskbarTemplate();
            this._refresh();
        },

        updateRenderTaskNames: function (bool) {
            var proxy = this;
            proxy.model.showTaskNames = bool;
            proxy._createChartTaskbarTemplate();
            proxy._refresh();
        },

        refreshLeftTaskLabelMapping: function (leftLabel) {
            var proxy = this;
            proxy.model.leftTaskLabelMapping = leftLabel;
            proxy._createChartTaskbarTemplate();
            proxy._refresh();
        },
        refreshRightTaskLabelMapping: function (rightLabel) {
            var proxy = this;
            proxy.model.rightTaskLabelMapping = rightLabel;
            proxy._createChartTaskbarTemplate();
            proxy._refresh();
        },
        refreshLeftTaskLabelTemplate: function (leftLabeltemplate) {
            var proxy = this;
            proxy.model.leftTaskLabelTemplate = leftLabeltemplate;
            proxy._createChartTaskbarTemplate();
            proxy._refresh();
        },
        refreshRightTaskLabelTemplate: function (rightLabeltemplate) {
            var proxy = this;
            proxy.model.rightTaskLabelTemplate = rightLabeltemplate;
            proxy._createChartTaskbarTemplate();
            proxy._refresh();
        },
        updateRendeProgressStatus: function (bool) {
            var proxy = this;
            proxy.model.showProgressStatus = bool;
            proxy._createChartTaskbarTemplate();
            proxy._refresh();
        },

        updateRenderResourceNames: function (bool) {
            var proxy = this;
            proxy.model.showResourceNames = bool;
            proxy._createChartTaskbarTemplate();
            proxy._refresh();
        },

        changeMilestoneTemplate : function(value)
        {
            var proxy = this;
            proxy.model.milestoneTemplate = value;
            proxy._createChartTaskbarTemplate();
            proxy._refresh();
        },

        changeTaskbarTemplate: function (value) {
            var proxy = this;
            proxy.model.taskbarTemplate = value;
            proxy._createChartTaskbarTemplate();
            proxy._refresh();
        },

        changeParentTaskbarTemplate: function (value) {
            var proxy = this;
            proxy.model.parentTaskbarTemplate = value;
            proxy._createChartTaskbarTemplate();
            proxy._refresh();
        },

        ganttChartEditing: function (boolValue) {
            var proxy = this;
            proxy.model.allowGanttChartEditing = boolValue;
        },
        updateReadOnly: function (boolValue) {
            var proxy = this;
            proxy.model.readOnly = boolValue;
        },
        resizeProgressbar: function (boolValue) {
            var proxy = this;
            proxy.model.enableProgressBarResizing = boolValue;

        },
        /* udpate value of allowKeyboardNavigation API from Gantt */
        updateAllowKeyboardNavigation: function (bool) {
            this.model.allowKeyboardNavigation = bool;
        },

        updateProgressbarHeight: function (height) {
            var proxy = this;
            this.model.progressbarHeight = height;
            proxy._createChartTaskbarTemplate();
            proxy._refresh();
        },

        updateBaselineColor: function (color) {
            var proxy = this;
            this.model.baselineColor = color;
            proxy._createChartTaskbarTemplate();
            proxy._refresh();
        },

        updateRenderBaseline: function (bool) {
            var proxy = this;
            this.model.renderBaseline = bool;
            proxy._createChartTaskbarTemplate();
            proxy._refresh();
            proxy._createConnectorLineTemplate();
        },

        focusGanttElement: function () {
            if (ej.browserInfo().name == "msie") {
                try { this.element[0].setActive(); } catch (e) { }
            }
            else {
                var scrollTop = $(window).scrollTop();
                this.element[0].focus();
                $(window).scrollTop(scrollTop);
            }
        },
        
        //returns the schedule year width
        _getYearWidth: function () {
            var proxy = this,count=0,width=0;
            for (count = 0; count < this.model.scheduleYears.length; count++) {
                width += this._getTemplateYearWidth(this.model.scheduleYears[count]);
            }
            return (width);
        },

        //returns the schedule month width
        _getMonthWidth: function () {
            var proxy = this,
                model = proxy.model,
                date, scheduleMonths = model.scheduleMonths,
                    monthWidth = 0;

            for (var i = 0; i < scheduleMonths.length; i++) {
                var startDate = scheduleMonths[i];

                if (typeof startDate === "object") {
                    date = new Date(startDate);
                }
                else {
                    date = ej.parseDate(startDate, this.model.dateFormat, this.model.locale);
                }
                var monthLastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

                var lastDate = monthLastDay.getDate();
                // condition to check if the first month having only few weeks.
                if (date.getTime() === proxy.model.scheduleMonths[0].getTime()) {
                    var datediff = monthLastDay.getDate() - date.getDate();
                    monthWidth += (this.model.perDayWidth * (datediff+1));
                }
                else if (lastDate == 31)
                    monthWidth += (this.model.perDayWidth * 31);
                else if (lastDate == 30)
                    monthWidth += (this.model.perDayWidth * 30);
                else if (lastDate == 28)
                    monthWidth += (this.model.perDayWidth * 28);
            }
            return monthWidth;
        },



        //returns the schedule week width
        _getWeekWidth: function () {
            return (this.model.perDayWidth * 7);
        },

        //returns the ganttchart container height
        _getHeight: function () {
            return this._containerHeight;
        },

        //sets the height of the ganttchart container
        _setHeight: function (value) {
            this._containerHeight = value;
        },

        //returns the rows in the ganttchart
        getGanttChartRows: function () {
            return this._ganttChartRows;
        },

        //returns the gantt record collection
        getUpdatedRecords: function () {
            return this.model.flatRecords;
        },

        //sets value for currentviewdata , ganttrecords and row collections
        setUpdatedRecords: function (currentViewData, updatedRecords, flatRecords,ids) {
            var proxy = this;
            proxy.model.currentViewData = currentViewData;
            proxy.model.updatedRecords = updatedRecords;
            proxy.model.flatRecords = flatRecords;
            proxy.model.ids = ids;
        },

        //returns the string date type 
        _getFormatedDate: function (date, format, locale) {
            return ej.format(date, format, locale);
        },

        //returns the viewport height
        _getViewportHeight: function () {
            var proxy = this,
                headerdiv = proxy._$headerContainer,
                height;

            height = proxy.element.height() - headerdiv.height() -
                    parseFloat(headerdiv.css("border-bottom-width"));
            return height;
        },

        updateViewPortHeight:function(){
            var proxy = this;
            proxy._viewportHeight=proxy._getViewportHeight();
        },

        //constructor function
        _init: function () {

            var proxy = this, model = proxy.model,
            scheduleMode = model.scheduleHeaderSettings.scheduleHeaderType;

            proxy.element.addClass("e-ganttchart-core");
            proxy.element.attr("tabindex", "0");
            model.cssClass && proxy.element.addClass(model.cssClass);
            proxy._initPrivateProperties();
            proxy._initialize();
            proxy._getNonWorkingDayIndex();
            proxy._renderGanttChart();
            proxy._$bodyContainerParent.append(proxy._$bodyContainer);
            proxy._$bodyContainer.append(proxy._$bodyContent);
            proxy._$ganttChartContainer.append(proxy._$bodyContainerParent);
            proxy._setHeight(this.getRecordsHeight());
            $(proxy._$bodyContainer).css({ "height": proxy._viewportHeight + "px" });
            if (this._containerHeight > 0)
                $(proxy._$bodyContent).css({ "height": this._containerHeight + "px" });
            else
                $(proxy._$bodyContent).css({ "height": "1px" });
            if (scheduleMode == "week") {
                $(proxy._$bodyContent).css({ "width": (model.scheduleWeeks.length * proxy._scheduleWeekWidth) + "px" });
            }
            else if (scheduleMode == "year") {
                $(proxy._$bodyContent).css({ "width": (proxy._scheduleYearWidth) + "px" });

            }
            else if (scheduleMode == "month") {
                $(proxy._$bodyContent).css({ "width": (proxy._scheduleMonthWidth) + "px" });
            }
            else if (scheduleMode == "day") {
                $(proxy._$bodyContent).css({ "width": (model.scheduleDays.length * (model.perHourWidth * 24)) + "px" });
            }
            else if (scheduleMode == "hour") {
                $(proxy._$bodyContent).css({ "width": (model.scheduleHours.length * (model.perMinuteWidth * proxy._totalInterval)) + "px" });
            }
            proxy.createGridLinesTable();
            proxy.renderGanttRecords();
          //  Inner div for scroller
            var scrollerDiv = ej.buildTag('div');
            scrollerDiv.append(proxy._$bodyContent);
            proxy._$bodyContainer.append(scrollerDiv);
            proxy._$bodyContainer.ejScroller({
                width: proxy.element.width() - 1,// additional parent div element added with 1px right border
                enableTouchScroll:false,
                height: proxy._getViewportHeight(), scroll: function (args) {

                    var arg = {},
                        scrollTop = args.scrollTop;

                    args.requestType = "scroll";
                    args.delta = scrollTop;
//                    proxy._completeAction(args);
                    if (scrollTop != undefined) {// && this.isVScroll()
                        if (proxy.onScrollHelper(scrollTop, true) === false) {
                           args.cancel = true;
                        }
                    } else {
                        proxy._handleScroll(args);
                    }
                    
                }
            });
            proxy._$bodyContainer.ejScroller("model.keyConfigs", { up: "", down: "", left: "", right: "" });
            proxy._$bodyContainer.ejScroller("refresh");
            proxy._wireEvents();
        },

        //rendering gantt chart again after zoomingvalue changed
        reRenderGanttChart: function (daywidth, flatRecords) {

            var proxy = this, model = proxy.model,
                   scheduleMode = model.scheduleHeaderSettings.scheduleHeaderType;

            proxy._wireEvents();
            model.perDayWidth = daywidth;

            // proxy.model.perMonthWidth = monthwidth;

            model.flatRecords = flatRecords;
            proxy._scheduleWeekWidth = proxy._getWeekWidth();
            proxy._scheduleYearWidth = proxy._getYearWidth();
            proxy._scheduleMonthWidth = proxy._getMonthWidth();

            $(proxy._$headerContainer).empty();
            $(proxy._$scheduleDiv).empty();
            proxy._renderGanttChart();
            proxy._$bodyContainerParent.append(proxy._$bodyContainer);
            proxy._$bodyContainer.append(proxy._$bodyContent);
            proxy._$ganttChartContainer.append(proxy._$bodyContainerParent);

            if (scheduleMode == "week") {
                $(proxy._$bodyContent).css({ "width": (model.scheduleWeeks.length * proxy._scheduleWeekWidth) + "px" });
            }
            else if (scheduleMode == "year") {
                $(proxy._$bodyContent).css({ "width": (proxy._scheduleYearWidth) + "px" });
            }
            else if (scheduleMode == "month") {
                $(proxy._$bodyContent).css({ "width": (proxy._scheduleMonthWidth) + "px" });
            } 
            else if (scheduleMode == "day") {
                $(proxy._$bodyContent).css({ "width": (model.scheduleDays.length * (model.perHourWidth * 24)) + "px" });
            }
            else if (scheduleMode == "hour") {
                $(proxy._$bodyContent).css({ "width": (model.scheduleHours.length * (model.perMinuteWidth * proxy._totalInterval)) + "px" });
            }
        },

        //declaring private properties
        _initPrivateProperties: function () {
            var proxy = this;
            proxy._viewportHeight = 0,
            proxy._prevScrollTop = 0,
            proxy._scrollTop = 0,
            proxy._vScrollDir = 1,
            proxy._scrollLeft = 0,
            proxy._maxZIndex = 0;
            proxy._taskbarEditedArgs = {},
            proxy._$ganttChartContainer = null,
            proxy._$headerContainer = null,
            proxy._$bodyContainer = null,
            proxy._$bodyContent = null,
            proxy._$dependencyViewContainer = null,
            proxy._$secondaryCanvas = null,
            proxy._$ganttViewTable = null,
            proxy._$ganttViewTablebody = null,
            proxy._weekdays = [],
            proxy._rowMargin = 0,
            proxy._renderedRange = null,
            proxy._visibleRange = null,
            proxy._vTop = null,
            proxy._vBottom = null,
            proxy._rTop = null,
            proxy._rBottom = null,
            proxy._vscrollDist = 0,
            proxy._containerHeight = 0,
            proxy._id = this.element.attr("id"),
            proxy._ganttChartRows = null,
            proxy._filteredRecords = [],
            proxy._sortedRecords = [],
            proxy._tempSortedRecords = [],
            proxy._scheduleHours = [],
            proxy._scheduleMinutes = [],
            proxy._updateScheduleWidth(),
            proxy._totalMonthWidth = 0,
            proxy._tempFilteredRecords = [],
            proxy._prevLeft = 0,
            proxy._allowDragging = false,
            proxy._leftResizing = false,
            proxy._rightResizing = false,
            proxy._progressResizing = false,
            proxy._editingContainer = null,
            proxy._allowExpandCollapse = true,
            proxy._leftResizer = null,
            proxy._taskbarItem = null,
            proxy._progressbarItem = null,
            proxy._progressResizer = null,
            proxy._rightResizer = null,
            proxy._manualRightResizer = null,
            proxy._tasknameContainer = null,
            proxy._prevSelectedItem = null;
            proxy._multiSelectCtrlRequest =false,
            proxy._ganttTouchTrigger = false,
            proxy._mousePosX = 0,
            proxy._currMousePosX = 0,
            proxy._currMousePosY = 0,
            proxy._resMousePosX =0,
            proxy._resMousePosY = 0,
            proxy._currentItemTop = 0,
            proxy._currentItemPrevTop=0,
            proxy._prevItem = {},
            proxy._parentCollectionPreviousValues = [],
            proxy._mouseTarget = null,
            proxy._mouseDown = false,
            proxy._$scheduleDiv = null,
            proxy._leftResizerGripper = null,
            proxy._rightResizerGripper = null,
            proxy._progressHandle = null,
            proxy._progressHandleChild = null,
            proxy._currentEditedRecord = {
                taskId: null,
                taskName: null,
                startDate: null,
                endDate: null,
                duration: null,
                isMilestone: false,
                status: null,
                predecessor: null,
                resourceInfo: null,
                parentItem: null,
                isSelected: false,
                childRecords: null,
                hasChildRecords: false,
                expanded: false,
                level: 0,
                left: 0,
                width: 0,
                progressWidth: 0,
                item: null,
                baselineLeft: 0,
                baselineWidth: 0,
                baselineStartDate: null,
                baselineEndDate: null,
                isReadOnly: false,
                hasFilteredChildRecords: true,
                serialNumber: null,
                taskbarBackground: null,
                progressbarBackground: null,
                parentProgressbarBackground: null,
                parentTaskbarBackground: null,
                cellBackgroundColor: null,
                rowBackgroundColor: null,
                treeMappingName: [],
                dragState: true,
                durationUnit: "",
            },
            proxy._mouseHoverTooltip = document.getElementById(this.model.tooltipTemplate),
            proxy._progressBarTooltipID = document.getElementById(this.model.progressbarTooltipTemplateId),
            proxy._taskbarEditingTooltipID = document.getElementById(this.model.taskbarEditingTooltipTemplateId),
            proxy._scrollBarHeight = 18,
            proxy._windowWidth = $(window).width(),
            proxy._windowHeight = $(window).height(),
            proxy._editingItem = null,
            proxy._editingTarget = null,
            proxy.tooltipState = null,
            proxy._visibleRecordsCount = 0,
            proxy._tooltipTimer,
            proxy._$gridLinesTablebody = null,

            //Properties for connector line mouse
            proxy._leftConnectorPoint = null,
            proxy._rightConnectorPoint = null,
            proxy._childLeftConnectorPoint = null,
            proxy._childRightConnectorPoint = null,
            proxy._editPredecessor = false,
            proxy._connectorPointX = null,
            proxy._connectorPointY = null,
            proxy._predecessorTooltip = null,
            proxy._totalCollapsedRecordCount = 0,
            proxy._milesStoneWidth = 0,
            proxy._connectorPointWidth = 0;
            proxy._newXYPos = true;
            proxy._posX1 = null,
            proxy._posY1 = null;
            proxy._posY = null;
            proxy._posX = null;
            proxy._nonWorkingDayIndex = [];
            proxy._mousePosY = 0;
            proxy.dragPosX = 0;
            proxy._timerDragVertical = null;
            proxy._timerDragHorizontal = null;
            this._shiftSelectedRecord = null;
            proxy._roundOffDuration = false;
            proxy._connectorDrawElement = null;
            proxy._isPredecessorEditOpen = false; // Identify whether predecessor edit dialog is open/close.
            proxy._hoverConnectorLineElement = null;
            proxy._predecessorInfo = null;
        },
        
        //Initialize ganttchart
        _initialize: function () {
            var proxy = this;
            proxy._$ganttChartContainer = ej.buildTag("div.e-ganttviewercontainer#ganttviewercontainer" + proxy._id, "", { width: "100%" }, {});
            proxy._$headerContainer = ej.buildTag("div.e-ganttviewerheaderContainer#ganttviewerheaderContainer" + proxy._id, "", {
                "border-right-style": "solid",
                "border-right-width": "1px"
            }, {});
            proxy._$bodyContainer = ej.buildTag("div.e-ganttviewerbodyContianer#ganttviewerbodyContianer" + proxy._id, "", {
                '-ms-touch-action': 'none',                
            }, {});

            proxy._$bodyContainerParent = ej.buildTag("div.e-ganttviewerbodyContianerparent#ganttviewerbodyContianerParent" + proxy._id, "", {
                '-ms-touch-action': 'none',                
                "border-right-style": "solid",
                "border-right-width": "1px",
                "box-sizing": "border-box",
                "width": "auto",
                "height": "auto"
            }, {});
            proxy._$bodyContent = ej.buildTag("div.e-ganttviewerbodyContent#ganttviewerbodyContent" + proxy._id, "", {
            }, {});

            proxy._$dependencyViewContainer = ej.buildTag("div.e-ganttviewerbodyContianer-dependencyViewContainer#dependencyViewContainer" + proxy._id,
                "", {
                    'z-index':'5',
                    'position': 'absolute'
                }, {});
            proxy._$secondaryCanvas = ej.buildTag("div.e-ganttviewerbodyContianer-secondaryCanvas", "", {
                'z-index': '3',
                'position': 'absolute'
            }, {});
            //Container for strip lines
            proxy._$stripLineContainer = ej.buildTag("div.e-ganttviewerbodyContianer-stripLines", "", {
                'z-index': '6',
                'position': 'absolute'
            }, {});

            proxy._$weekendsContainer = ej.buildTag("div.e-ganttviewerbodyContianer-weekendsContainer", "", {
                'z-index': '1',
                'position': 'absolute'
            }, {});

            proxy._$ganttViewTable = ej.buildTag("table.e-ganttviewerbodyContianer-ganttViewTable e-zerospacing#ganttViewTable" + proxy._id, "", {
                'z-index': '5',
                'position': 'absolute'
            });
            proxy._$scheduleDiv = ej.buildTag("div.e-gantt-schedule-container#gantt-schedule" + proxy._id + "", "", {}, {});
        },
        /*Create taskbar template as per view type*/
        _createChartTaskbarTemplate: function () {
            if (this.model.viewType == "resourceView")
                this._createResourceTaskbarTemplate();
            else
                this._createTaskbarTemplate();
        },
        //Rendering GanttChart
        _renderGanttChart: function () {
            var proxy = this, model = proxy.model,
                scheduleLength, $colsgroup, $column,
            scheduleMode = model.scheduleHeaderSettings.scheduleHeaderType;
            
            proxy._createSchedule(proxy._getDateType(model.scheduleStartDate),
            proxy._getDateType(model.scheduleEndDate));

            proxy._viewportHeight = proxy._getViewportHeight();
                       
            proxy._$ganttViewTable.css("width", proxy._getScheduleLength(scheduleMode) + 'px');
            
            $colsgroup = ej.buildTag("colgroup", "", {}, {});
            $column = $(document.createElement("col"));
            $column.css("width", proxy._getScheduleLength(scheduleMode) + 'px');
            
            $colsgroup.append($column);
            proxy._$ganttViewTable.append($colsgroup);

            proxy._createTooltipTemplate();
            proxy._createEditingTooltipTemplate();
            proxy._createProgressbarTooltipTemplate();
            this._createChartTaskbarTemplate();
            proxy._createConnectorLineTemplate();
            proxy._createPredecessorTooltipTemplate();

            proxy._updateCurrentViewData();

            //Display weekends
            if (proxy.model.highlightWeekends == true
                && model.scheduleHeaderSettings.scheduleHeaderType == ej.Gantt.ScheduleHeaderType.Week)
                proxy._renderWeekends();

            proxy._$stripLineContainer.empty();
            //Display striplines
            if (proxy.model.stripLines != null) {
                this._renderStripLines(proxy.model.stripLines);
            }

            proxy._$secondaryCanvas.empty();
            //Display Holidays
            if (proxy.model.holidays != null) {
                var holidayCount = proxy.model.holidays.length;
                for (var i = 0; i < holidayCount; i++) {
                    proxy._renderHoliday(proxy.model.holidays[i]);
                }
            }
        },

        //Rendering connectorlines from Gantt
        renderConnectorLines: function (connectorLinesCollection) {
            var proxy = this,
                connectorLineContainer = $.render[proxy._id + "ConnectorLineTemplate"](connectorLinesCollection);

            $(proxy._$dependencyViewContainer).empty();
            proxy._$dependencyViewContainer.append(connectorLineContainer);
            proxy._$bodyContent.append(proxy._$dependencyViewContainer);
        },

        //Empty the entire connectorline collection
        clearConnectorLines: function () {
            $(this._$dependencyViewContainer).empty();
        },

        clearSelection: function (index) {

            var proxy = this,
                model = proxy.model;
            if (model.selectedRowIndex != -1 && (index == -1 || ej.isNullOrUndefined(index))) {
                //To clear the row selection of previously selected row via set model (selectedRowIndex)
                var $ganttGridRows = proxy.getGanttChartRows();
                $ganttGridRows.removeClass("e-gantt-mouseclick");
                model.selectedRowIndex = -1;
                model.selectedItem = null;
                model.selectedItems = [];
            }
            else if (model.selectedRowIndex != -1 && index != -1) {               
                var $row = proxy.getRowByIndex(index),
                currentRecord = model.updatedRecords[index],
                selectedIndex = $.inArray(currentRecord, model.selectedItems);
                if (selectedIndex != -1) {
                    $row.removeClass("e-gantt-mouseclick");
                    model.selectedItems.splice(selectedIndex, 1);
                    currentRecord.isSelected = false;
                    model.selectedItem = model.selectedItems.length > 0 ? model.selectedItems[model.selectedItems.length - 1] : null;
                    model.selectedRowIndex = model.updatedRecords.indexOf(model.selectedItem);
                }             
                //selectedItem/index values are updated  in treegrid clearselection itself
            }
        },

        //append single connectorline
        appendConnectorLine: function (connectorLineCollection) {
            var proxy = this,
            connectorLineContainer = $.render[proxy._id + "ConnectorLineTemplate"](connectorLineCollection);
            proxy._$dependencyViewContainer.append(connectorLineContainer);
        },
        //set Collapsed record Count

        setCollapsedRecordCount:function(count)
        {
            this._totalCollapsedRecordCount = count;
        },
        //get collapsed record count
        getCollapsedRecordCount:function()
        {
            return this._totalCollapsedRecordCount;
        },
        //remove a particular connector line
        removeConnectorline: function (lineId) {
            this.element.find("#ConnectorLine" + lineId).remove();
        },

        //Events
        _wireEvents: function () {
            var proxy = this,
                matched = jQuery.uaMatch(navigator.userAgent);

            //$(proxy._$bodyContainer).bind("scroll", $.proxy(proxy._handleScroll, proxy));
            if (ej.isTouchDevice()) {                
                proxy._on(proxy.element, "touchstart", ".e-gantt-milestone-container,.e-childContainer", this._mouseHover);
                proxy._on(proxy.element, "touchstart", ".e-childContainer,.e-gantt-milestone-container,.e-parentContainer", proxy._mousedown);
                $(document.body).bind("touchmove", $.proxy(proxy.handleMouseMove, proxy));
                proxy._on(proxy.element, "touchleave", ".e-gantt-milestone-container,.e-childContainer, .e-parentContainer", this._mouseLeave);
                $(proxy._$bodyContainer).bind("touchend", $.proxy(proxy._handleMouseUp, proxy));
                proxy._on(proxy.element, "tap", proxy._cellClickHandler);
            }
            else {
                proxy._on(proxy.element, "mouseenter", ".e-gantt-milestone-container,.e-childContainer,.e-parentContainer,.e-connectorlineContainer", this._mouseHover);//.gantt-viewer-bodyContianer tr td
                proxy._on(proxy.element, "mouseleave", ".e-gantt-milestone-container,.e-childContainer,.e-parentContainer,.e-connectorlineContainer", this._mouseLeave);//.gantt-viewer-bodyContianer tr td
                proxy._on(proxy.element, "click", proxy._cellClickHandler);
                proxy._on(proxy.element, "mouseenter", ".e-taskbarresizer-left", proxy._resizerleftOver);
                proxy._on(proxy.element, "mouseenter", ".e-taskbarresizer-right", proxy._resizerrightOver);
                proxy._on(proxy.element, "mouseenter", ".e-progressbarresizer-right", proxy._progressresizerOver);
                proxy._on(proxy.element, "mouseenter", ".e-connectorpoint-left", proxy._dragLeftOver);
                proxy._on(proxy.element, "mouseenter", ".e-connectorpoint-right", proxy._dragRightOver);
          

                if (ej.browserInfo().name != "msie") {
                    proxy._on(proxy.element, "mousedown", ".e-parentContainer,.e-childContainer,.e-gantt-milestone-container", proxy._mousedown);
                }
                else {
                    proxy._on(proxy.element, "mousedown", ".e-parentContainer,.e-childContainer,.e-gantt-milestone-container", proxy._mousedown);
                }


                $(proxy._$bodyContainer).bind("mouseup", $.proxy(proxy._handleMouseUp, proxy));
                $(document).bind("mouseup", $.proxy(proxy._tooltipMouseup, proxy));
                proxy._on(proxy.element, "mouseenter", ".e-stripline", proxy._stripLineMouseOver);
                proxy._on(proxy.element, "mouseleave", ".e-stripline", proxy._stripLineMouseLeave);

                //if (matched.browser.toLowerCase() == "msie") {
                //    proxy._on(proxy.element, "MSPointerDown", ".e-tasklabel,.e-parentContainer,.e-childContainer,.e-gantt-milestone-container", proxy._mousedown);
                //    $(document.body).bind("MSPointerMove", function (event) {
                //        event.preventDefault();
                //    });
                //    $(document.body).bind("MSPointerMove", $.proxy(proxy.handleMouseMove, proxy));
                //    $(proxy._$bodyContainer).bind("MSPointerUp", $.proxy(proxy._handleMouseUp, proxy));
                //}


                if (matched.browser.toLowerCase() == "chrome") {
                    proxy._on(proxy.element, "touchstart", ".e-gantt-milestone-container,.e-childContainer, .e-parentContainer", this._mouseHover);
                    proxy._on(proxy.element, "touchstart", ".e-childContainer,.e-gantt-milestone-container", proxy._mousedown);
                    proxy._on(proxy.element, "touchleave", ".e-gantt-milestone-container,.e-childContainer, .e-parentContainer", this._mouseLeave);                    
                    $(document.body).bind("touchmove", $.proxy(proxy.handleMouseMove, proxy));
                    //proxy._on(proxy.element, "touchend", ".e-parentContainer,.e-childContainer,.e-gantt-milestone-container", proxy._handleMouseUp);
                    proxy._on(proxy.element, "touchleave", ".e-parentContainer,.e-childContainer,.e-gantt-milestone-container", proxy._handleMouseUp);
                    $(proxy._$bodyContainer).bind("touchend", $.proxy(proxy._handleMouseUp, proxy));
                    $(proxy._$bodyContainer).bind("touchleave", $.proxy(proxy._handleMouseUp, proxy));
                    $(proxy._$bodyContainer).bind("touchstart", $.proxy(proxy._updateTouchCtrlFlag, proxy));
                }
            }
                proxy._enableEditingEvents();
        },

        //Event append for editDialogOpen while perform double click action
        _enableEditingEvents: function () {

            var proxy = this,
                model = proxy.model;

            if (!model.readOnly && model.editSettings.allowEditing) {
                if (!ej.isTouchDevice())
                    proxy._on(this.element, "dblclick", ".e-ganttviewerbodyContent", proxy._editdblClickHandler);
                else
                    proxy._on(this.element, "doubletap", ".e-ganttviewerbodyContent", proxy._editdblClickHandler);
            } else {
                if (!ej.isTouchDevice())
                    proxy._off(this.element, "dblclick", ".e-ganttviewerbodyContent", proxy._editdblClickHandler);
                else
                    proxy._off(this.element, "doubletap", ".e-ganttviewerbodyContent", proxy._editdblClickHandler);
            }
        },


        //UPDATE Edit Settings
        updateEditSettings: function (edit) {

            var proxy = this;

            if (edit) {
                if (edit.editMode) 
                    proxy.model.editSettings.editMode = edit.editMode;
                if (!ej.isNullOrUndefined(edit.allowAdding))
                    proxy.model.editSettings.allowAdding = edit.allowAdding;
                if (!ej.isNullOrUndefined(edit.allowEditing))
                    proxy.model.editSettings.allowEditing = edit.allowEditing;
                if (!ej.isNullOrUndefined(edit.allowDeleting))
                    proxy.model.editSettings.allowDeleting = edit.allowDeleting;
                if (!ej.isNullOrUndefined(edit.beginEditAction))
                    proxy.model.editSettings.beginEditAction = edit.beginEditAction;
                proxy._enableEditingEvents();
            }
        },

        //Double click event handler for editing with editMode as normal
        _editdblClickHandler: function (e) {

            var proxy = this,
                model = this.model,
                args = {},
                $target = $(e.target);

            if (model.allowGanttChartEditing && $($target).is(".e-line, .e-connectorline-rightarrow, .e-connectorline-leftarrow")) {
                var $parentDiv = $target.parent();
                $($parentDiv).find(".e-line").addClass("e-connectorline-hover");
                if ($($parentDiv).find(".e-connectorline-rightarrow").length > 0)
                    $($parentDiv).find(".e-connectorline-rightarrow").addClass("e-connectorline-rightarrow-hover");
                else
                    $($parentDiv).find(".e-connectorline-leftarrow").addClass("e-connectorline-leftarrow-hover");
                proxy._hoverConnectorLineElement = $parentDiv;
                proxy._renderConnectorDialog(e);
                return;
            }
            else if (proxy.model.editSettings.editMode === "normal" && !model.readOnly && proxy.model.editSettings.allowEditing && !e.ctrlKey) {
                args.requestType = ej.TreeGrid.Actions.BeginEdit;
                if (model.viewType == "resourceView") {
                    var item = proxy.getRecordByTarget(e)
                    if (item.eResourceTaskType == "resourceChildTask" || item.eResourceTaskType == "unassignedTask")
                    {
                        args.data = item;
                        args.isResourceView = true;
                    }
                    else
                        return true;
                }
                proxy._trigger("actionBegin", args);
            }

        },

        //MouseLeave event for striplines to remove tooltip
        _stripLineMouseLeave: function () {
            window.clearTimeout(this._tooltipTimer);
            this._clearTooltip();
        },

        //mouseHover event for stripline to render tooltip
        _stripLineMouseOver: function (e) {

            e.target.style.cursor = "pointer";
            var proxy = this, model = proxy.model,
                $target = $(e.target),
                parentNode, match,
                tooltiptable,
                tooltipbody,
                posx = 0, posy = 0;
            proxy._clearTooltip();
            if ($target.hasClass("e-striplinespan")) {
                parentNode = $target[0].parentNode;
            } else
                parentNode = $target[0];

            match = parentNode.id.match(/(\d+|[A-z]+)/g);

            if (e.type == "mouseenter" || e.type == "mousemove") {
                if (!e) e = window.event;
                if (e.originalEvent.pageX || e.originalEvent.pageY) {
                    posx = e.originalEvent.pageX;
                    posy = e.originalEvent.pageY;
                }
                else if (e.originalEvent.clientX || e.originalEvent.clientY) {
                    posx = e.originalEvent.clientX + document.body.scrollLeft
                        + document.documentElement.scrollLeft;
                    posy = e.originalEvent.clientY + document.body.scrollTop
                        + document.documentElement.scrollTop;
                }

                tooltiptable = ej.buildTag("table.e-tooltiptable", "", { "width": "auto", "margin-top": "0px" },
                    { 'cellspacing': '2px', 'cellpadding': '2px' });
                tooltipbody = ej.buildTag("tbody",
                    "<tr><td>" + model.stripLines[match[1]].day + "</td></tr><tr><td>" +
                        model.stripLines[match[1]].label + "</td></tr>", {}, {});

                tooltiptable.append(tooltipbody);
                proxy._mouseHoverTooltip = ej.buildTag("div.e-tooltipgantt e-js#tooltipgantt" + proxy._id + "", tooltiptable,
                    { 'position': 'absolute', 'z-index': proxy._getMaxZIndex() + 1 }, {});
                model.cssClass && proxy._mouseHoverTooltip.addClass(model.cssClass);
                setTimeout(function () {
                    $(document.body).append(proxy._mouseHoverTooltip);
                    proxy._updateTooltipPosition(proxy._mouseHoverTooltip, posx, posy);
                }, 700);
            }
        },

        //Mouseup over tooltip 
        _tooltipMouseup: function () {
            var proxy = this,
                 $ganttGridRows = proxy.getGanttChartRows();
            if (proxy._mouseTarget != null && !ej.isTouchDevice()) {
                if (proxy.model.allowGanttChartEditing && proxy.model.readOnly == false &&
                    proxy._editingTarget && proxy._editingItem) {
                    var $target = proxy._editingTarget,
                        row = $target.closest('tr.e-ganttrowcell'),
                        recordIndex = $ganttGridRows.index(row),
                        item = proxy._editingItem;
                    if ($(row).hasClass("e-editmode")) {
                        $(row).removeClass("e-editmode");
                        proxy._mouseTarget = null;
                    }
                    //revert changes from taskbar editing
                    proxy._getPrevItem(item, recordIndex);
                }
                proxy._timerDragHorizontal && (proxy._timerDragHorizontal = window.clearInterval(proxy._timerDragHorizontal));
                proxy._timerDragVertical && (proxy._timerDragVertical = window.clearInterval(proxy._timerDragVertical));
                if (proxy._dummyElementRemoved) {
                    proxy._connectorDrawElement.remove();
                    proxy._dummyElementRemoved = false;
                    proxy._connectorDrawElement = null;
                }
                if ($(proxy._$dependencyViewContainer).css("z-index") == "4") {
                    $(proxy._$dependencyViewContainer).css("z-index", "5");
                }

                $("#ganttviewerbodyContianer" + proxy._id).unbind("mousemove");
                proxy._trigger("cancelEditCell");
                proxy._mouseDown = false;
                proxy._clearTooltip();
                proxy._newXYPos = false;
                proxy._$ganttChartContainer[0].style.cursor = "auto";
                proxy._allowDragging = false;
                proxy._falseLine && proxy._falseLine.remove();
                proxy._falseLine = null;
                proxy._trigger("clearColumnMenu");
                if (item && proxy.model.enableTaskbarTooltip) {

                    proxy._predecessorTooltip && proxy._predecessorTooltip.remove();
                    proxy._predecessorTooltip = null;
                }
            }
         },

        //removes all the tooltip in ganttchart
        _clearTooltip: function () {
            var proxy = this;
            proxy._mouseHoverTooltip && $(proxy._mouseHoverTooltip).remove();
            $('.e-editingtooltip').remove();
            $("#tooltipgantt").remove();
            $(".e-progressbartooltip").remove();
            proxy._mouseHoverTooltip = null;
            proxy._connectorLineTooltip && $(proxy._connectorLineTooltip).remove();
            proxy._connectorLineTooltip = null;

        },

        //mouseHover event on taskbar right helper element
        _resizerrightOver: function (e) {

            var proxy = this,
                $target = e.target,
                div = $target.parentNode;

            if (proxy.model.allowGanttChartEditing == true&& proxy.model.readOnly == false) {
                if (this._mouseDown == false)
                    e.target.style.cursor = "w-resize";
                proxy._setEditingElements(div);
            }
        },


        //mouseLeave event for taskbar right helper element
        _resizerrightLeave: function () {

            var proxy = this;
            if (proxy.model.allowGanttChartEditing == true && proxy.model.readOnly == false) {
                proxy._removeEditingElements();
            }
        },


        //mouseHover event on taskbar left helper element
        _resizerleftOver: function (e) {

            var proxy = this,
                $target = e.target,
                div = $target.parentNode;
            if (proxy.model.allowGanttChartEditing == true && proxy.model.readOnly == false) {
                if (this._mouseDown == false)
                    e.target.style.cursor = "e-resize";
                proxy._setEditingElements(div);
            }
        },


        //mouseLeave event for taskbar left helper element
        _resizerleftLeave: function () {
            var proxy = this;
            if (proxy.model.allowGanttChartEditing == true && proxy.model.readOnly == false) {
                proxy._removeEditingElements();
            }
        },


        //mouseHover event on taskbar progressbar helper element
        _progressresizerOver: function (e) {
            var proxy = this,
                $target = e.target,
                div = $target.parentNode;
            if (proxy.model.allowGanttChartEditing == true && proxy.model.readOnly == false) {
                if (proxy.model.enableProgressBarResizing){
                    if (proxy._mouseDown == false && $($target).prev(".e-gantt-childtaskbar").has(".e-gantt-childtaskbar-progress").length > 0)
                        $target.style.cursor = "col-resize";
                    proxy._setEditingElements(div);
                }
                else
                    $target.style.cursor = "move";
            }
        },


        //mouseLeave event for progressbar helper element
        _progressresizerLeave: function () {
            var proxy = this;
            if (proxy.model.allowGanttChartEditing == true && proxy.model.readOnly == false) {
                proxy._removeEditingElements();
            }
        },


        _secondMouseOverConnectorPoint: function (e, mouseUp)
        {
            var proxy = this, row, recordIndexr, item;

            if ((proxy._mouseDown && proxy._falseLine) || (mouseUp && proxy._falseLine)) {

                var $target = $(e.target),
                  $ganttGridRows = proxy.getGanttChartRows(),
                  row = $target.closest('tr.e-ganttrowcell'),
                  recordIndexr = $ganttGridRows.index(row),
                  item = proxy.model.currentViewData[recordIndexr];

                var fromItem = proxy._editingItem;
                var toItem = item, predecessor, fullPredecessor, currentTarget,
                    predecessorText = proxy.model.predecessorText;

                if (proxy._prevItem.predecessorTarget === 'Start') {
                    predecessor = fromItem.taskId + 'S';
                } else if (proxy._prevItem.predecessorTarget === 'Finish') {
                    predecessor = fromItem.taskId + 'F';
                }

                if ($target.hasClass('e-connectortouchpoint')) {
                    if ($target.parent().hasClass('e-connectorpoint-left')) {
                        predecessor += 'S';
                        currentTarget = predecessorText["Start"];
                    }
                    else if ($target.parent().hasClass('e-connectorpoint-right')) {
                        predecessor += 'F';
                        currentTarget = predecessorText["Finish"];
                    }
                } else {
                    if ($target.hasClass('e-connectorpoint-left')) {
                        predecessor += 'S';
                        currentTarget = predecessorText["Start"];
                    }
                    else if ($target.hasClass('e-connectorpoint-right')) {
                        predecessor += 'F';
                        currentTarget = predecessorText["Finish"];
                    }
                }
                var $table, $td;
                //Append second item in predecessor tooltip
                //update tooltip on over of second connector point
                if (ej.isNullOrUndefined(item))
                    return;
                if (proxy._predecessorTooltip) {
                    $table = proxy._predecessorTooltip.find("table");
                    $td = $table.find("tbody").find("tr:eq(1)").find("td:eq(2)").text(toItem.taskName);
                    $td = $table.find("tbody").find("tr:eq(1)").find("td:eq(3)").text(currentTarget);
                }

                var args = {};
                args.requestType = "validatePredecessor";
                args.fromItem = fromItem;
                args.toItem = toItem;
                if (args.toItem.item[proxy.model.predecessorMapping]) {
                    fullPredecessor = args.toItem.item[proxy.model.predecessorMapping] + "," + predecessor;
                }
                else {
                    fullPredecessor = predecessor;
                }
                args.predecessor = predecessor;
                args.currentRecord = toItem;
                args.predecessorString = [];
                args.predecessorString.push(fullPredecessor);
                var validation = proxy._completeAction(args);
                //update tooltip after validation
                if (proxy._predecessorTooltip) {
                    $td = $table.find("tbody").find("tr:eq(0)").find("td:eq(0)");
                    if (validation) {
                        // $td.text("True");
                        $td.removeClass();
                        $td.addClass("e-predecessor-true");
                    } else {
                        //  $td.text("False");
                        $td.removeClass();
                        $td.addClass("e-predecessor-false");
                    }
                }

                //Here also update on moueup//same code is required
                if (mouseUp) {
                    return args;
                }
                
            }
        },
        //mouse enter event for left-connectorpoint-point

        _dragLeftOver:function(e)
        {
            var proxy = this,
              $target = e.target,
              div = $target.parentNode;
            if (e.type == "touchmove" && $(e.target).hasClass('e-connectortouchpoint'))
                div = $target.parentNode.parentNode;
            if (proxy.model.predecessorMapping && proxy.model.allowGanttChartEditing && proxy.model.enablePredecessorEditing && proxy.model.readOnly == false) {
                if (this._mouseDown == false ) {
                    $target.style.cursor = "pointer";
                }
                proxy._setEditingElements(div);
            }
            if(!$(div).hasClass('e-parentContainer'))
                proxy._secondMouseOverConnectorPoint(e);

        },
        //mouse leave event for left-connectorpoint-point
        _dragLeftLeave: function (e) {

            var proxy = this;
            if (proxy.model.allowGanttChartEditing == true && proxy.model.enablePredecessorEditing && proxy.model.readOnly == false) {
                proxy._removeEditingElements();
            }
        },

        //mouse enter event for right-connectorpoint-point

        _dragRightOver: function (e) {
            var proxy = this,
             $target = e.target,
             div = $target.parentNode;
            if (e.type == "touchmove" && $(e.target).hasClass('e-connectortouchpoint'))
                div = $target.parentNode.parentNode;
            if (proxy.model.predecessorMapping && proxy.model.allowGanttChartEditing && proxy.model.enablePredecessorEditing && proxy.model.readOnly == false) {
                if (this._mouseDown == false) {
                    $target.style.cursor = "pointer";
                }
                proxy._setEditingElements(div);
            }
            if (!$(div).hasClass('e-parentContainer'))
                proxy._secondMouseOverConnectorPoint(e);
        },
        //mouse leave event for right-connectorpoint-point
        _dragRightLeave: function (e) {
            var proxy = this;
            if (proxy.model.allowGanttChartEditing == true && proxy.model.enablePredecessorEditing && proxy.model.readOnly == false) {
                proxy._removeEditingElements();
            }
        },




        //adding styles for taskbar helper elements
        _setEditingElements: function (div) {
            var proxy = this, progressHandler;

            if (proxy._editingTarget && !proxy._editPredecessor && $(div).find(proxy._editingTarget).length == 0)
                return true;

            if ($(div).hasClass("e-childContainer")) {
                proxy._leftResizerGripper = div.querySelector(".e-taskbarresizer-left"); 
                proxy._rightResizerGripper = div.querySelector(".e-taskbarresizer-right"); 
                progressHandler = div.querySelector(".e-progressbarresizer-right");
                proxy._progressHandle = progressHandler && progressHandler.firstChild;
                proxy._progressHandleChild = progressHandler && progressHandler.childNodes[1];

                $(proxy._leftResizerGripper).addClass("e-gripper");
                $(proxy._rightResizerGripper).addClass("e-gripper");

                if (proxy.model.progressMapping && proxy.model.enableProgressBarResizing) {
                    $(proxy._progressHandle).addClass("e-progresshandle");
                    $(proxy._progressHandleChild).addClass("e-progresshandleafter");
                }
            }


            if (proxy.model.enablePredecessorEditing) {
                if ($(div).hasClass("e-childContainer") && proxy.model.predecessorMapping && !proxy._falseLine) {

                    proxy._leftConnectorPoint = div.querySelector(".e-connectorpoint-left");
                    proxy._rightConnectorPoint = div.querySelector(".e-connectorpoint-right");
                    $(proxy._leftConnectorPoint).addClass("e-connectorpoint-hover");
                    $(proxy._rightConnectorPoint).addClass("e-connectorpoint-hover");
                }
                else if ($(div).hasClass("e-gantt-milestone-container") && proxy.model.predecessorMapping && !proxy._falseLine) {

                    proxy._leftConnectorPoint = div.querySelector(".e-connectorpoint-left");
                    proxy._rightConnectorPoint = div.querySelector(".e-connectorpoint-right");
                    $(proxy._leftConnectorPoint).addClass("e-connectorpoint-hover");
                    $(proxy._rightConnectorPoint).addClass("e-connectorpoint-hover");
                }
                else if ($(div).hasClass("e-childContainer") && proxy.model.predecessorMapping && proxy._falseLine) {
                    proxy._childLeftConnectorPoint = div.querySelector(".e-connectorpoint-left");
                    proxy._childRightConnectorPoint = div.querySelector(".e-connectorpoint-right");
                    $(proxy._childLeftConnectorPoint).addClass("e-connectorpoint-hover");
                    $(proxy._childRightConnectorPoint).addClass("e-connectorpoint-hover");
                }
                else if ($(div).hasClass("e-gantt-milestone-container") && proxy.model.predecessorMapping && proxy._falseLine) {
                    proxy._childLeftConnectorPoint = div.querySelector(".e-connectorpoint-left");
                    proxy._childRightConnectorPoint = div.querySelector(".e-connectorpoint-right");
                    $(proxy._childLeftConnectorPoint).addClass("e-connectorpoint-hover");
                    $(proxy._childRightConnectorPoint).addClass("e-connectorpoint-hover");
                }
                else if ($(div).hasClass("e-parentContainer") && proxy.model.predecessorMapping && !proxy._falseLine) {

                    proxy._leftConnectorPoint = div.querySelector(".e-connectorpoint-left");
                    proxy._rightConnectorPoint = div.querySelector(".e-connectorpoint-right");
                    $(proxy._leftConnectorPoint).addClass("e-connectorpoint-hover");
                    $(proxy._rightConnectorPoint).addClass("e-connectorpoint-hover");

                    if($(div).hasClass("e-manualparenttaskbar"))
                    {
                        $(proxy._leftConnectorPoint).addClass("e-gantt-manualparenttaskbar-connectorpoint-hover");
                        $(proxy._rightConnectorPoint).addClass("e-gantt-manualparenttaskbar-connectorpoint-hover");
                    }

                }
            }
        },


        //removing styles for taskbar helper elements
        _removeEditingElements: function () {
            var proxy = this;
            $(proxy._leftResizerGripper).removeClass("e-gripper");
            $(proxy._rightResizerGripper).removeClass("e-gripper");

            if (proxy.model.progressMapping) {
                $(proxy._progressHandle).removeClass("e-progresshandle");
                $(proxy._progressHandleChild).removeClass("e-progresshandleafter");
            }


            //Remove Connector points in chart
            if (proxy.model.enablePredecessorEditing) {
                if (proxy.model.predecessorMapping && proxy._mouseDown == false) {

                    $(proxy._leftConnectorPoint).removeClass('e-connectorpoint-hover').removeClass('e-gantt-manualparenttaskbar-connectorpoint-hover');
                    $(proxy._rightConnectorPoint).removeClass('e-connectorpoint-hover').removeClass('e-gantt-manualparenttaskbar-connectorpoint-hover');
                    proxy._leftConnectorPoint = null;
                    proxy._rightConnectorPoint = null;
                }

                if (proxy.model.predecessorMapping && proxy._leftConnectorPoint !== null && proxy._mouseDown == true || proxy._childLeftConnectorPoint) {
                    $(proxy._childLeftConnectorPoint).removeClass("e-connectorpoint-hover");
                    $(proxy._childRightConnectorPoint).removeClass("e-connectorpoint-hover");
                    //remove curret target predecessor in tooltip    
                    if (proxy._predecessorTooltip) {
                        var $table = proxy._predecessorTooltip.find("table");
                        $table.find("tbody").find("tr:eq(1)").find("td:eq(2)").text("");
                        $table.find("tbody").find("tr:eq(1)").find("td:eq(3)").text("");
                        var $td = $table.find("tbody").find("tr:eq(0)").find("td:eq(0)").removeClass();
                        //$td.text("False");
                        $td.addClass('e-predecessor-false');
                    }
                }
            }
        },


        refreshHeight:function(){

            var proxy = this;
            proxy._$bodyContainer.ejScroller("refresh");
        },

        //mousedown event for ganttchart
        _mousedown: function (e) {
            if (e.which == 2 || e.which == 3) //2 for mouseWheel, 3 for rightClick button
                return false;
            var proxy = this, mousePt,
                rowHeight,
                marginTop,
                args = {};
            proxy._clearTooltip();
            proxy._mouseDown = true;
            proxy._currentItemTop = 0;

            //proxy._clearContextMenu();
            var $target = $(e.target),
            row = $target.closest('tr.e-ganttrowcell'),
            item = this.getRecordByTarget(e),
            div = $target[0].parentNode,
            model = this.model;

            if (ej.isNullOrUndefined(item)) {
                return;
            }

            if (e.type == "touchstart") {
                e.preventDefault();
                $(".e-connectortouchpoint").addClass("e-enableconnectortouchpoint");
            }

            proxy._editingItem = item;
            proxy._editingTarget = $target;
            proxy._allowExpandCollapse = true;

            if ($(div).hasClass("e-progressbarresizer-right")) {
                div = div.parentNode;
            }
            else if ($(div).hasClass("e-gantt-childtaskbar-progress")) {
                div = $(div).closest("div.e-childContainer");
            }
            else if ($(div).hasClass("e-progressbarhandler")) {
                div = $target.closest(".e-childContainer")[0];
            }
            else {
                div = $(div).closest("div.e-childContainer,div.e-parentContainer,.e-gantt-milestone,div.e-gantt-milestone-container");
            }
            if ($(div).hasClass("e-childContainer") ||
                ($(div).hasClass("e-gantt-milestone")) || $(div).hasClass('e-parentContainer') || $(div).hasClass("e-gantt-milestone-container")) {

                $(row).addClass("e-editmode");
                proxy._mouseTarget = e;
            }

            if (proxy.model.allowGanttChartEditing && proxy.model.readOnly == false && ($(div).hasClass("e-childContainer")
                || ($(div).hasClass("e-gantt-milestone")) || $(div).hasClass("e-gantt-milestone-container") || $(div).hasClass('e-parentContainer'))) { //mouse down on drag points in child and milestone container and parent container also included 

                if ($(div).is(".e-childContainer,.e-parentContainer,.e-gantt-milestone,.e-gantt-milestone-container")) {
                    $(proxy._$dependencyViewContainer).css("z-index", "4");
                }

                if (e.target.style.cursor == "e-resize" && ($(div).hasClass("e-childContainer")
                    || ($(div).hasClass("e-gantt-milestone")))
                    || (e.type == "touchstart" && e.target.className == "e-taskbarresizer-left")) {
                    proxy._updateEditingType();
                    proxy._leftResizing = true;
                }

                if (e.target.style.cursor == "w-resize" && ($(div).hasClass("e-childContainer")
                    || ($(div).hasClass("e-gantt-milestone")) || $(div).hasClass("e-parentContainer"))
                    || (e.type == "touchstart" && e.target.className == "e-taskbarresizer-right")) {
                        proxy._updateEditingType();
                    proxy._rightResizing = true;

                }
                var prorgressResize = $(e.target).closest(".e-progressbarresizer-right");
                if ((e.target.style.cursor == "col-resize" || (prorgressResize.length && prorgressResize[0].style.cursor == "col-resize")) && ($(div).hasClass("e-childContainer")
                    || ($(div).hasClass("e-gantt-milestone")))
                    || (e.type == "touchstart" && e.target.className == "e-progressbarresizer-right")) {
                    proxy._updateEditingType();
                    proxy._progressResizing = true;
                }
                var childTaskbar = $(e.target).closest("[style*='cursor: move']");
                if ((e.target.style.cursor == "move" || (childTaskbar.length && childTaskbar[0].style.cursor == "move")) && ($(div).hasClass("e-childContainer")
                    || ($(div).hasClass("e-gantt-milestone")) || $(div).hasClass("e-gantt-milestone-container")) || $($target[0]).hasClass("e-gantt-manualparenttaskbar")) {
                    proxy._updateEditingType();
                    proxy._allowDragging = true;
                }
                if (e.target.style.cursor == "" && ((childTaskbar.length && childTaskbar[0].style.cursor == "") || childTaskbar.length==0) && ($(div).hasClass("e-childContainer")
                  || ($(div).hasClass("e-gantt-milestone")) || $(div).hasClass("e-gantt-milestone-container")) || (item.isAutoSchedule && $($target).hasClass("e-gantt-manualparenttaskbar"))) {
                    proxy._updateEditingType();
                    if (e.target.className == "e-taskbarresizer-left e-icon" || e.target.className == "e-taskbarresizer-left e-icon e-gripper")
                        proxy._leftResizing = true;
                    else if (e.target.className == "e-taskbarresizer-right e-icon" || e.target.className == "e-taskbarresizer-right e-icon e-gripper")
                        proxy._rightResizing = true;
                    else if ((e.target.className == "e-progressbarhandler e-progresshandle") || (e.target.className == "e-progresshandler-element")
                        || (e.target.className == "e-progresshandlerafter-element") || (e.target.className == "e-progressbarresizer-right"))
                        proxy._progressResizing = true;
                    else if ((e.target.className == "e-gantt-childtaskbar-progress  progressbar") || (e.target.className == "e-tasklabel") || (e.target.className == "e-gantt-childtaskbar") || (e.target.className == "e-gantt-milestone e-milestone-top") ||
                        (e.target.className == "e-gantt-milestone e-milestone-bottom") || $(e.target).hasClass("e-gantt-milestone") || $(e.target).closest(".e-gantt-milestone").length > 0 || $(e.target).closest(".e-gantt-childtaskbar").length > 0)
                        proxy._allowDragging = true;
                }

                // ON drag points initiate the false line and edit type for predecessor

                if (proxy.model.enablePredecessorEditing) {
                    if (e.target.style.cursor == "pointer" && ($(div).hasClass("e-childContainer")
                     || ($(div).hasClass("e-gantt-milestone")) || $(div).hasClass("e-gantt-milestone-container") || $(div).hasClass('e-parentContainer'))
                         || (e.type == "touchstart" && (e.target.className == "e-connectorpoint-right" || e.target.className == "e-connectorpoint-left"
                         || e.target.className == "e-connectorpoint-right e-connectorpoint-hover" || e.target.className == "e-connectorpoint-left e-connectorpoint-hover"))) {
                        proxy._updateEditingType();
                        var newArgs = {};
                        newArgs.currentRecord = item;
                        newArgs.requestType = "drawConnectorLine";
                        if (!proxy._trigger("actionBegin", newArgs)) {
                            proxy._editPredecessor = true;
                            proxy._connectorDrawElement = $target.closest("tr");
                        }
                        else
                            proxy._removeEditingElements();
                        if ($target.hasClass('e-connectorpoint-left') || $target.hasClass('e-connectorpoint-left e-connectorpoint-hover')) {
                            proxy._prevItem.predecessorTarget = 'Start';
                        }
                        else if ($target.hasClass('e-connectorpoint-right') || $target.hasClass('e-connectorpoint-right e-connectorpoint-hover')) {
                            proxy._prevItem.predecessorTarget = 'Finish';
                        }
                    }
                }




                if (!e) e = window.event;
                if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 9) {
                    e.originalEvent.pageX = e.originalEvent.clientX;
                    e.originalEvent.pageY = e.originalEvent.clientY;
                }

                if (e.originalEvent.pageX || e.originalEvent.pageY) {
                    proxy._posX1 = proxy._resMousePosX = proxy._currMousePosX = e.originalEvent.pageX;
                    proxy.dragPosX = e.originalEvent.pageX;

                    proxy._currMousePosY = proxy._resMousePosY  = e.originalEvent.pageY;
                    proxy._posY1 = proxy.dragPosY = e.originalEvent.pageY -
                        proxy._$bodyContainer.offset().top;
                }
                else if (e.originalEvent.clientX || e.originalEvent.clientY) {
                    proxy._posX1 = proxy._resMousePosX = proxy.dragPosX = e.originalEvent.clientX + document.body.scrollLeft
                        + document.documentElement.scrollLeft;

                    proxy._currMousePosY = proxy._resMousePosY  = e.originalEvent.clientY;
                    proxy._posY1 = proxy.dragPosY = (e.originalEvent.clientY + document.body.scrollTop
                            + document.documentElement.scrollTop) -
                        proxy._$bodyContainer.offset().top;
                }
                else if (e.originalEvent && e.originalEvent.changedTouches
                    && e.originalEvent.changedTouches.length > 0) {
                    proxy._posX1 = proxy._resMousePosX = proxy._currMousePosX = e.originalEvent.changedTouches[0].pageX;
                    proxy.dragPosX = e.originalEvent.changedTouches[0].pageX;

                    proxy._currMousePosY = proxy._resMousePosY = e.originalEvent.changedTouches[0].pageY;
                    proxy._posY1 = proxy.dragPosY = e.originalEvent.changedTouches[0].pageY -
                         proxy._$bodyContainer.offset().top;
                }

                proxy._prevItem.left = item.left;
                proxy._prevItem.status = item.status;
                proxy._prevItem.duration = item.duration;
                proxy._prevItem.startDate = item.startDate;
                proxy._prevItem.endDate = item.endDate;
                proxy._prevItem.width = item.width;

                if (this.model.viewType == "resourceView" && this.model.allowDragAndDrop) {
                    mousePt = (proxy._posY1 % this.model.rowHeight);
                    rowHeight = model.rowHeight;
                    marginTop = (rowHeight - model.taskbarHeight) / 2;
                    var scrollTop = proxy._$bodyContainer.offset().top - $("#ganttViewTablebody" + proxy._id + "").offset().top;
                    item.top = mousePt > 0 ? ((proxy._posY1 + scrollTop) - ((proxy._posY1 + scrollTop) % rowHeight)) + marginTop
                        : proxy._posY1;
                    proxy._prevItem.top = proxy._currentItemTop = item.top;
                    proxy._currentItemPrevTop = item.top;
                }

                if (item.eResourceTaskType == "resourceChildTask") {
                    proxy._prevItem.eOverlapIndex = item.eOverlapIndex;
                    proxy._prevItem.eOverlapped = item.eOverlapped;
                    proxy._prevOverlapOrders = proxy._getPrevOverlapValues(item)
                }
                    // if (item.eResourceTaskType == "resourceChildTask" || item.eResourceTaskType == "unassignedTask")
                    //      proxy._prevResource = item.parentItem ? item.parentItem.item : null;
                proxy._parentCollectionPreviousValues = proxy._getParentCollectionPreviousValues(item);
                    //For false line starting point
                if (proxy.model.enablePredecessorEditing) {
                    proxy._connectorPointX = proxy._currMousePosX - proxy._$bodyContent.offset().left;
                    proxy._connectorPointY = proxy._currMousePosY - proxy._$bodyContent.offset().top;
                }


                $(proxy._$bodyContainer).bind("mousemove", $.proxy(proxy.handleMouseMove, proxy));
            }
             
            proxy._appendTooltip($target, item);

            proxy._trigger("clearColumnMenu");
            //return false;
        },

        _getPrevOverlapValues: function (item) {
            var childArray = [],
                parentItem = item.parentItem,
                childRecords = [];

            if (parentItem && parentItem.eResourceChildTasks.length > 0) {
                childRecords = parentItem.eResourceChildTasks;
                for (var i = 0; i < childRecords.length; i++) {
                    var obj = {};
                    obj.data = childRecords[i];
                    obj.overlapIndex = childRecords[i].eOverlapIndex;
                    childArray.push(obj);
                }
            }
            return childArray;
        },
        //Get previous parent item values
        _getParentCollectionPreviousValues: function (item) {
            var record = item,
                parentPrevItem = {},
                allParentRecords = [];
            do {               
                var parentItem = record.parentItem;
                if (!ej.isNullOrUndefined(parentItem)) {
                    parentPrevItem.left = parentItem.left;
                    parentPrevItem.status = parentItem.status;
                    parentPrevItem.duration = parentItem.duration;
                    parentPrevItem.startDate = parentItem.startDate;
                    parentPrevItem.endDate = parentItem.endDate;
                    parentPrevItem.width = parentItem.width;
                    parentPrevItem.index = parentItem.index;
                    if(parentItem.eRangeValues)
                        parentPrevItem.eRangeValues = parentItem.eRangeValues.slice();
                    parentPrevItem.eOverlapIndex = parentItem.eOverlapIndex;

                    if (!parentPrevItem.isAutoSchedule) {
                        parentPrevItem.manualLeft = parentItem.manualLeft;
                        parentPrevItem.manualStartDate = parentItem.manualStartDate;
                        parentPrevItem.manualEndDate = parentItem.manualEndDate;
                        parentPrevItem.manualDuration = parentItem.manualDuration;
                    }
                    allParentRecords.push(parentPrevItem);
                    record = parentItem;
                    parentPrevItem = {};
                }
            } while (record.parentItem);
            return allParentRecords;
        },

        handleMouseMove: function (e) {
            this._updateOnmouseMove(e);

        },              

        // perserve the task edited event arguments 
        taskbarEditedArguments: function (args) {
            var proxy = this;
            return proxy._taskbarEditedArgs;
        },

        taskbarEditedCancel: function (arg) {
            var item = arg.data,
                recordIndexr = arg.recordIndex, proxy = this, model = proxy.model,
                args;

            var args = proxy._taskbarEditedArgs;

            if (item.eResourceTaskType == "resourceChildTask" && args.previousResource && args.assignedResource && args.assignedResource[model.resourceIdMapping] == args.previousResource[model.resourceIdMapping])                
                this._updateResourceChildTasks(item);
            proxy._getPrevItem(item, recordIndexr);
            if (item.eResourceTaskType == "resourceChildTask")
                proxy._trigger("taskbarEditedCancel", item);
            if (item.parentItem)
                proxy._getParentPreviousValue();
            if (proxy.model.predecessorMapping && (args.dragging || args.rightResizing || args.leftResizing)) {
                args.requestType = "updateConnectors";
                args.ganttRecord = item;
                proxy._trigger("actionComplete", args);
            }
        },
        _updateTouchCtrlFlag: function (e) {
            var proxy = this;
            if (e.type == "touchstart")
                proxy._ganttTouchTrigger = true;

        },
        // Get current target element by mouse position
        // window.pageXOffset && window.pageYOffset is used to find the accurate element position in IPad/IPhone
        _getElementByPosition: function (x, y) {
            return document.elementFromPoint((x - window.pageXOffset), (y - window.pageYOffset));
        },
        //Handler for MouseUp event in ganttchart
        _handleMouseUp: function (e) {

            var proxy = this,
                args = {},
                $ganttGridRows = proxy.getGanttChartRows(),
                $target, row, recordIndexr = 0, item,
                x1 = proxy._posX1,
                y1 = proxy._posY1,
                x2, y2, resMouseY,
                tooltipElement, tooltiptable, tooltipbody;
            proxy._timerDragHorizontal && (proxy._timerDragHorizontal = window.clearInterval(proxy._timerDragHorizontal));
            proxy._timerDragVertical && (proxy._timerDragVertical = window.clearInterval(proxy._timerDragVertical));
            if(proxy._dummyElementRemoved) {
                proxy._connectorDrawElement.remove();
                proxy._dummyElementRemoved = false;
                proxy._connectorDrawElement = null;
            }
            if (ej.isNullOrUndefined(e.pageX)) {
                x2 = e.originalEvent.changedTouches[0].pageX;
                y2 = e.originalEvent.changedTouches[0].pageY;
                resMouseY = e.originalEvent.changedTouches[0].pageY -
                        proxy._$bodyContainer.offset().top;
                if (!ej.isNullOrUndefined(proxy._predecessorTooltip))
                    e.target = this._getElementByPosition(x2, y2);
            }
            else {
                x2 = e.pageX;
                y2 = e.pageY;
                resMouseY = e.pageY - proxy._$bodyContainer.offset().top;
            }

            if ($(proxy._$dependencyViewContainer).css("z-index") == "4") {
                $(proxy._$dependencyViewContainer).css("z-index", "5");
            }
           
            //Calculate and validate predecessor and draw connectorline after second connector point connects
            if (($(e.target).hasClass('e-connectorpoint-left') || $(e.target).hasClass('e-connectorpoint-right') || $(e.target).hasClass('e-connectortouchpoint'))
                && proxy._falseLine && !$(e.target).parent().hasClass('e-parentContainer')) {
                proxy._trigger("cancelEditCell");
                if ($(e.target).hasClass('e-connectortouchpoint'))
                    e.target = $(e.target).parent();
                var newArgs = proxy._secondMouseOverConnectorPoint(e, true);
                if (!ej.isNullOrUndefined(newArgs)) {
                    args.data = newArgs.currentRecord;                    
                    args.currentRecord = newArgs.currentRecord;
                    args.fromItem = newArgs.fromItem;
                    args.toItem = newArgs.toItem;
                    args.predecessor = newArgs.predecessor;
                    args.predecessorString = newArgs.predecessorString;
                    args.requestType = "validatePredecessor";
                    if (!proxy._trigger("actionBegin", args)) {
                        if (newArgs.predecessorValidation) {
                            newArgs.requestType = "drawConnectorLine";
                            proxy._completeAction(newArgs);
                        }
                    }
                }
            }
            //Update previous item on predecessor link
            if (args.data) {
                var newItem = args.data;
                proxy._prevItem.left = newItem.left;
                proxy._prevItem.status = newItem.status;
                proxy._prevItem.duration = newItem.duration;
                proxy._prevItem.startDate = newItem.startDate;
                proxy._prevItem.endDate = newItem.endDate;
                proxy._prevItem.width = newItem.width;
            }
            if (proxy._editingTarget != null && proxy._editingItem != null) {
                $target = proxy._editingTarget,
                row = $target.closest('tr.e-ganttrowcell'),
                recordIndexr = $ganttGridRows.index(row),
                item = proxy._editingItem;

                if ($(row).hasClass("e-editmode")) {
                    $(row).removeClass("e-editmode");
                    proxy._mouseTarget = null;
                }
            }

            $("#ganttviewerbodyContianer" + proxy._id).unbind("mousemove");


            proxy._mouseDown = false;
            proxy._clearTooltip();
            if (x1 != x2 || (Math.abs(y1 - resMouseY) >= (this.model.rowHeight - this.model.taskbarHeight) / 2)) {

                //if (y1 != y2) {
                //    //$(proxy._currentEditTaskBar).remove();
                //}
                proxy._editingTarget = null;
                proxy._editingItem = null;
                proxy._$ganttChartContainer[0].style.cursor = "auto";

                if (item != null && (proxy._allowDragging || proxy._leftResizing || proxy._rightResizing || proxy._progressResizing)) {
                    args.editingFields = { startdate: item.startDate, enddate: item.endDate, progress: item.status, duration: item.duration, durationunit: item.durationUnit };
                    args.data = item;
                    args.recordIndex = recordIndexr;
                    args.previousData = proxy._prevItem;
                    args.dragging = proxy._allowDragging;
                    args.leftResizing = proxy._leftResizing;
                    args.rightResizing = proxy._rightResizing;
                    args.progressResizing = proxy._progressResizing;                    
                    args.roundOffDuration = proxy._roundOffDuration;
                    if (this.model.viewType == "resourceView") {
                        args.isVerticalDragging = Math.abs(y1 - resMouseY) >= proxy.model.rowHeight;
                        args.previousResource = item.parentItem ? item.parentItem.item : null;
                   //     proxy._prevOverlapOrders = proxy._getPrevOverlapValues(item)
                    }
                    if (proxy.model.predecessorMapping) {
                        var newArgs = {},
                             validateMode = {
                                 respectLink: false,
                                 removeLink: false,
                                 preserveLinkWithEditing: true,
                             };
                        newArgs.editMode = "dragging";
                        newArgs.data = item;
                        newArgs.recordIndex = recordIndexr;
                        newArgs.requestType = "validateLinkedTask";
                        newArgs.validateMode = validateMode;
                        proxy._taskbarEditedArgs = args;
                        proxy._trigger("actionBegin", newArgs)
                        if (newArgs.cancel)
                            proxy._taskbarEdited(args);
                    } else {
                        proxy._taskbarEditedArgs = args;
                        proxy._taskbarEdited(args);
                    }
                }

                if (args.cancel)
                    proxy.taskbarEditedCancel(args);
                proxy._updateEditingType();

                //Remove drag point and false lines on mouse up
                proxy._falseLine && proxy._falseLine.remove();
                proxy._falseLine = null;
                proxy._predecessorTooltip && proxy._predecessorTooltip.remove();
                proxy._predecessorTooltip = null;
                $(proxy._leftConnectorPoint).removeClass("e-connectorpoint-hover").removeClass("e-gantt-manualparenttaskbar-connectorpoint-hover");
                $(proxy._rightConnectorPoint).removeClass("e-connectorpoint-hover").removeClass("e-gantt-manualparenttaskbar-connectorpoint-hover");
                $(proxy._childRightConnectorPoint).removeClass("e-connectorpoint-hover");
                $(proxy._childLeftConnectorPoint).removeClass("e-connectorpoint-hover");
                proxy._leftConnectorPoint = null;
                proxy._rightConnectorPoint = null;
                proxy._childRightConnectorPoint = null;
                proxy._childLeftConnectorPoint = null;
                proxy._trigger("clearColumnMenu");
            }
            else {
                proxy._newXYPos = false;
                proxy._$ganttChartContainer[0].style.cursor = "auto";
                proxy._allowDragging = false;
                proxy._falseLine && proxy._falseLine.remove();
                proxy._falseLine = null;
                if (item && proxy.model.enableTaskbarTooltip) {

                    proxy._predecessorTooltip && proxy._predecessorTooltip.remove();
                    proxy._predecessorTooltip = null;

                    tooltipElement = {
                        ttipstartDate: this._getFormatedDate(item.startDate, this.model.dateFormat, this.model.locale),
                        ttipendDate: this._getFormatedDate(item.endDate, this.model.dateFormat, this.model.locale),
                        ttipduration: item.duration,
                        ttipprogress: item.status.toString(),
                        ttiptaskname: item.taskName,
                        ttipdurationunit: item.durationUnit
                    };


                    tooltiptable = ej.buildTag("table.e-tooltiptable", "", { "margin-top": "0px" }, { 'cellspacing': '5' });


                    if (!proxy.model.tooltipTemplate && !proxy.model.tooltipTemplateId) {
                        proxy.tooltipState = "";
                        tooltipbody = ej.buildTag("tbody", $.render[proxy._id + "tooltipTemplate"](tooltipElement), {}, {});
                        tooltiptable.append(tooltipbody);
                        proxy._mouseHoverTooltip = ej.buildTag("div.e-tooltipgantt e-js#tooltipgantt" + proxy._id + "", tooltiptable,
                           { 'position': 'absolute', 'z-index': proxy._getMaxZIndex() + 1, 'border-radius': '5px' }, {});
                        proxy.model.cssClass && proxy._mouseHoverTooltip.addClass(proxy.model.cssClass);
                        proxy._mouseHoverTooltip.innerHTML = "<table>" + tooltiptable[0].innerHTML + "</table>";

                        //Providing a time delay to render the tooltip to improve UI
                        proxy._tooltipTimer = setTimeout(function () {
                            $(document.body).append(proxy._mouseHoverTooltip)
                            proxy._updateTooltipPosition(proxy._mouseHoverTooltip, x2, y2 + 20);
                        }, 300);
                    }
                    else if (proxy.model.tooltipTemplate) {
                        proxy._mouseHoverTooltip = ej.buildTag("div.e-tooltipgantt e-js#tooltipgantt" + proxy._id + "", "",
                            { 'position': 'absolute', 'z-index': proxy._getMaxZIndex() + 1, 'border-radius': '5px' }, {});
                        proxy.model.cssClass && proxy._mouseHoverTooltip.addClass(proxy.model.cssClass);
                        proxy.tooltipState = "Template";
                        var tooltipbody = ej.buildTag("tbody", $.render[proxy._id + "tooltipTemplate"](item), {}, {});
                        proxy._mouseHoverTooltip[0].innerHTML = "<table>" + tooltipbody[0].innerHTML + "</table>";

                        //Providing a time delay to render the tooltip to improve UI
                        proxy._tooltipTimer = setTimeout(function () {
                            $(document.body).append(proxy._mouseHoverTooltip)
                            proxy._updateTooltipPosition(proxy._mouseHoverTooltip, x2, y2 + 20);
                        }, 300);
                    }
                    else if (proxy.model.tooltipTemplateId) {
                        proxy._mouseHoverTooltip = ej.buildTag("div.e-tooltipgantt e-js#tooltipgantt" + proxy._id + "", "",
                               { 'position': 'absolute', 'z-index': proxy._getMaxZIndex() + 1, 'border-radius': '5px' }, {});
                        proxy.model.cssClass && proxy._mouseHoverTooltip.addClass(proxy.model.cssClass);
                        proxy.tooltipState = "TemplateID";
                        var tooltipbody = ej.buildTag("tbody", $.render[proxy._id + "tooltipTemplate"](item), {}, {});
                        proxy._mouseHoverTooltip[0].innerHTML = "<table>" + tooltipbody[0].innerHTML + "</table>";

                        //Providing a time delay to render the tooltip to improve UI
                        proxy._tooltipTimer = setTimeout(function () {
                            $(document.body).append(proxy._mouseHoverTooltip);
                            proxy._updateTooltipPosition(proxy._mouseHoverTooltip, x2, y2 + 20);
                        }, 300);
                    }
                    $(proxy._mouseHoverTooltip).addClass("e-customTooltip");
                    proxy._trigger("clearColumnMenu");
                }
            }
            if (e.type == "touchend") {
                $(".e-connectortouchpoint").removeClass("e-enableconnectortouchpoint");
            }
        },

        getChildCount: function (record, count) {
            var currentRecord, proxy = this;
            if (!record.hasChildRecords)
                return 0;
            for (var i = 0; i < record.childRecords.length; i++) {
                currentRecord = record.childRecords[i];
                count++;
                if (currentRecord.hasChildRecords) {
                    count = proxy.getChildCount(currentRecord, count);
                }
            }
            return count;
        },

        // Mapping the critical path ID's, Index and Collections from gantt to ganttchart
        criticalDataMapping: function (criticalPathIds, condition, collection, collectionTaskId) {
            if (condition == true) {
                this.model.isCriticalPathEnable = true;
                if (!ej.isNullOrUndefined(criticalPathIds)) {
                    this.model.criticalPathCollection = criticalPathIds;
                    this.model.detailPredecessorCollection = collection;
                    this.collectionTaskId = collectionTaskId;
                }
            }
            if (condition == false) {
                this.model.isCriticalPathEnable = false;
            }
        },

        // Render color to the critical task.
        criticalPathColor: function (criticalPathIds, condition, collection, collectionTaskId) {
            if (condition == true) {
                if (!ej.isNullOrUndefined(criticalPathIds)) {
                    this._refresh();
                    if (!ej.isNullOrUndefined(collection))
                        this.criticalConnectorLine(criticalPathIds, collection, true, collectionTaskId);
                }
            }
            if (condition == false) {
                this.criticalConnectorLine(criticalPathIds, collection, false, collectionTaskId);
                this._refresh();
            }
        },

        // Render color to the critical connector lines.
        criticalConnectorLine: function (criticalPathIds, collection, condition, collectionTaskId) {
            if (condition == false) {
                this.element.find(".e-line").removeClass("e-criticalconnectorline");
                this.element.find(".e-connectorline-rightarrow").removeClass("e-criticalconnectorlinerightarrow");
                this.element.find(".e-connectorline-leftarrow").removeClass("e-criticalconnectorlineleftarrow");
            } else if (collection.length != 0) {
                var index = 0, currentdata, checking = [], checkint;
                for (var xx = 0; xx < this.model.criticalPathCollection.length; xx++) {
                    index = collectionTaskId.indexOf(this.model.criticalPathCollection[xx]);
                    currentdata = collection[index];
                    if (index != -1 && currentdata.to) {
                        checking = currentdata.to.split(",");
                        for (var m = 0; m < checking.length; m++) {
                            checkint = parseInt(checking[m]);
                            if (criticalPathIds.indexOf(checkint) != -1) {
                                this.element.find("#ConnectorLineparent" + currentdata.taskid + "child" + checkint).find(".e-line").addClass("e-criticalconnectorline");
                                this.element.find("#ConnectorLineparent" + currentdata.taskid + "child" + checkint).find(".e-connectorline-rightarrow").addClass("e-criticalconnectorlinerightarrow");
                                this.element.find("#ConnectorLineparent" + currentdata.taskid + "child" + checkint).find(".e-connectorline-leftarrow").addClass("e-criticalconnectorlineleftarrow");
                            }
                        }
                    }
                }
            }
        },

        //get the Expand status of GridRecord
        _getCollapsedParentItem: function (record) {
            var parentRecord = record.parentItem;
            if (parentRecord) {
                if (this._getExpandStatus(parentRecord) === true) {
                    return parentRecord;
                } else {
                    return this._getCollapsedParentItem(parentRecord);
                }
            }
            else
            {
                return null;
            }
        },
        /* scroll to selected record */
        updateScrollBar: function () {
            var proxy = this,
                model = proxy.model, horizontalScrollBarHeight,
                currentUpdatedRecords, recordIndex,
                isInViewPortAbove, isInViewPortBelow;

            currentUpdatedRecords = proxy.getExpandedRecords(model.updatedRecords);
            recordIndex = currentUpdatedRecords.indexOf(model.selectedItem);

            if (!model.selectedItem || recordIndex == -1)
                return;

            var recordPosition = this._getRecordTopPosition(currentUpdatedRecords, recordIndex),
                rowTop = recordPosition.top,
                rowBottom = recordPosition.bottom,
                scrollTop,
                containerWidth,
                scrollerExist = proxy._$bodyContainer.children(".e-content").length;

            if (scrollerExist)
                scrollTop = proxy._$bodyContainer.children(".e-content").scrollTop();
            else
                scrollTop = proxy._$bodyContainer.scrollTop();

            if (proxy._$bodyContainer.ejScroller("isHScroll") || proxy.element.find(".e-borderbox").length > 0) {
                horizontalScrollBarHeight = 18; /* default horizontal scrollbar height*/
            }

            isInViewPortAbove = (rowTop < scrollTop);
            isInViewPortBelow = (scrollTop + proxy._viewportHeight - horizontalScrollBarHeight) < rowBottom;

            if (isInViewPortAbove || isInViewPortBelow) {

                if ((rowTop + proxy._viewportHeight) > proxy._containerHeight) {
                    rowTop = proxy._containerHeight - proxy._viewportHeight;

                    if (isInViewPortBelow)
                        rowTop += horizontalScrollBarHeight;
                }
                proxy._$bodyContainer.ejScroller("scrollY", rowTop, true);

                if (model.enableVirtualization) {
                    proxy.focusGanttElement();
                }
            }
        },

        //In virtualization get expaned records from total record collection only
        getExpandedRecords: function (records) {
            var proxy = this;
            var resultRecord = records.filter(function (record) {
                return proxy._getExpandStatus(record) == true;
            });
            return resultRecord;
        },

        /*Select row on shift pluse down arrow key*/
        _selectedItemDown: function () {
            var proxy = this,
            model = this.model,
            fromIndex, toIndex, index,
            updatedRecords = model.updatedRecords,
            expandedRecords = proxy.getExpandedRecords(updatedRecords);

            if (proxy._prevSelectedItem && this._getExpandStatusRecord(proxy._prevSelectedItem))
                fromIndex = model.updatedRecords.indexOf(proxy._prevSelectedItem);
            else
                fromIndex = 0;
            if (proxy._shiftSelectedRecord && this._getExpandStatusRecord(proxy._shiftSelectedRecord)) {
                index = expandedRecords.indexOf(proxy._shiftSelectedRecord);
                toIndex = model.updatedRecords.indexOf(expandedRecords[index + 1]);
            }
            else {
                var index = expandedRecords.indexOf(model.updatedRecords[fromIndex]);
                toIndex = model.updatedRecords.indexOf(expandedRecords[index + 1]);
            }
            if (toIndex >= model.updatedRecords.length || toIndex == -1)
                toIndex = model.updatedRecords.length - 1;
            proxy.updateScrollBar(toIndex);
            proxy._multiSelectShiftRequest = true;
            proxy.selectRows(fromIndex, toIndex);
            proxy._rowSelectedEventTrigger(fromIndex, toIndex);
            proxy._multiSelectShiftRequest = false;
            proxy._shiftSelectedRecord = model.updatedRecords[toIndex];
        },
        /*Select row on shift pluse up arrow key*/
        _selectedItemUp: function () {
            var proxy = this,
            model = this.model, shiftUpIndex, nextRowIndex,
            fromIndex, toIndex, index,
            updatedRecords = model.updatedRecords,
            expandedRecords = proxy.getExpandedRecords(updatedRecords);

            if (proxy._prevSelectedItem && this._getExpandStatusRecord(proxy._prevSelectedItem))
                fromIndex = model.updatedRecords.indexOf(proxy._prevSelectedItem);
            else
                fromIndex = 0;
            if (proxy._shiftSelectedRecord && this._getExpandStatusRecord(proxy._shiftSelectedRecord)) {
                index = expandedRecords.indexOf(proxy._shiftSelectedRecord);
                toIndex = model.updatedRecords.indexOf(expandedRecords[index - 1]);
            }
            else {
                var index = expandedRecords.indexOf(model.updatedRecords[fromIndex]);
                toIndex = model.updatedRecords.indexOf(expandedRecords[index - 1]);
            }
            if (toIndex < 0)
                toIndex = 0;
            proxy.updateScrollBar(toIndex);
            proxy._multiSelectShiftRequest = true;
            proxy.selectRows(fromIndex, toIndex);
            proxy._rowSelectedEventTrigger(fromIndex, toIndex);
            proxy._multiSelectShiftRequest = false;
            proxy._shiftSelectedRecord = model.updatedRecords[toIndex];
        },
        //keyPressed event for perform the keynavigate selection in gantt
        _keyPressed: function (action, target, arg, e) {

            var proxy = this,
                model = this.model,
                selectingRowIndex,
                lastRowIndex,
                updatedRecords = model.updatedRecords,
                expandedRecords = proxy.getExpandedRecords(updatedRecords),
                currentSelectingRecord;

            e.stopImmediatePropagation();
            e.preventDefault();

            if (!model.allowKeyboardNavigation)
                return true;

            switch (action) {

                case "downArrow":
                    if (updatedRecords.length > 0 && model.selectedItem) {
                        //get the last row index of the ganttchart control
                        lastRowIndex = updatedRecords.length - 1;
                        if (model.selectedRowIndex != lastRowIndex) {

                            selectingRowIndex = expandedRecords.indexOf(model.selectedItem);
                            currentSelectingRecord = expandedRecords[selectingRowIndex + 1];
                            selectingRowIndex = updatedRecords.indexOf(currentSelectingRecord);

                            if (currentSelectingRecord && selectingRowIndex <= lastRowIndex && !proxy._rowSelectingEventTrigger(model.selectedRowIndex, selectingRowIndex)) {
                                proxy.selectRows(selectingRowIndex);
                                proxy.focusGanttElement();
                                proxy.updateScrollBar();
                                proxy._rowSelectedEventTrigger(model.selectedRowIndex);
                            }
                        }
                    }
                    break;

                    //select the previous row by press down arrow key
                case "upArrow":
                    if (model.selectedRowIndex !== 0 && updatedRecords.length > 0 && model.selectedItem) {

                        selectingRowIndex = expandedRecords.indexOf(model.selectedItem);
                        currentSelectingRecord = expandedRecords[selectingRowIndex - 1];
                        selectingRowIndex = updatedRecords.indexOf(currentSelectingRecord);

                        if (!proxy._rowSelectingEventTrigger(model.selectedRowIndex, selectingRowIndex)) {
                            proxy.selectRows(selectingRowIndex);
                            proxy.focusGanttElement();
                            proxy.updateScrollBar();
                            proxy._rowSelectedEventTrigger(model.selectedRowIndex);
                        }
                    }
                    break;

                    //select the first row while press the Home key
                case "firstRowSelection":
                    if (updatedRecords.length > 0) {
                        if (!proxy._rowSelectingEventTrigger(model.selectedRowIndex, 0)) {
                            proxy.selectRows(0);
                            proxy.focusGanttElement();
                            proxy.updateScrollBar();
                            proxy._rowSelectedEventTrigger(0);
                        }
                    }
                    break;

                case "lastRowSelection":

                    if (updatedRecords.length > 0) {

                        lastRowIndex = expandedRecords.length - 1;
                        currentSelectingRecord = expandedRecords[lastRowIndex];
                        selectingRowIndex = updatedRecords.indexOf(currentSelectingRecord);

                        if (!proxy._rowSelectingEventTrigger(model.selectedRowIndex, selectingRowIndex)) {
                            proxy.selectRows(selectingRowIndex);
                            proxy.focusGanttElement();
                            proxy.updateScrollBar();
                            proxy._rowSelectedEventTrigger(selectingRowIndex);
                        }
                    }
                    break;

                // expand the child task by press right arrow
                case "rightArrow":
                    var rowIndex = proxy.model.selectedRowIndex,
                    record = proxy.model.updatedRecords[rowIndex],
                    args = {},
                    isExpandCollapseEnabeled;
                    args.data = record;
                    args.recordIndex = rowIndex;
                    args.expanded = true;
                    if (record) {
                        if (!proxy._rowSelectingEventTrigger() && record.hasChildRecords && !record.expanded) {
                            if (rowIndex >= 0)
                                isExpandCollapseEnabeled = proxy._trigger("expanding", args);
                            if (model.enableVirtualization)
                                proxy.focusGanttElement();
                        }
                    }
                    break;
                //collapse the child task by press left arrow 
                case "leftArrow":
                    var rowIndex = proxy.model.selectedRowIndex,
                        record = proxy.model.updatedRecords[rowIndex],
                        args = {},
                        isExpandCollapseEnabeled;   
                        args.data = record;
                        args.recordIndex = rowIndex;
                        args.expanded = false;
                        if (record) {
                            if (!proxy._rowSelectingEventTrigger() && record.hasChildRecords && record.expanded) {
                                if (rowIndex >= 0)
                                    proxy._trigger("collapsing", args);
                                if (model.enableVirtualization)
                                    proxy.focusGanttElement();
                            }
                        }
                    break;
                case "deleteRecord":
                    if (model.editSettings.allowDeleting && model.selectedRowIndex >= 0) {
                        proxy._trigger("deleteRow");
                        proxy.focusGanttElement();
                    }
                    break;
                case "totalRowCollapse":
                    args = {};
                    args.requestType = "collapseAll";
                    proxy._trigger("expandAllCollapseAllRequest", args);
                    break;
                case "totalRowExpand":
                    args = {};
                    args.requestType = "expandAll";
                    proxy._trigger("expandAllCollapseAllRequest", args);
                    break;
                case "shiftDownArrow":
                    if (model.allowSelection && model.selectionMode == "row" && model.selectionType == "multiple") {
                        proxy._selectedItemDown();
                    }
                    break;
                case "shiftUpArrow":
                    if (model.allowSelection && model.selectionMode == "row" && model.selectionType == "multiple") {
                        proxy._selectedItemUp();
                    }
                    break;
            }

            return true;
        },

        _rowSelectingEventTrigger: function (previousIndex, recordIndex) {

            var proxy = this,
                model = proxy.model,
                args = {};
            if (model.selectionMode == "row") {
            args.previousIndex = previousIndex;
            args.recordIndex = recordIndex;
            return proxy._trigger('rowSelecting', args);
            }
        },

        _rowSelectedEventTrigger: function (index,toIndex) {
            var proxy = this,
                args;
            if (proxy.model.selectionMode == "row") {
            args = {
                data: proxy.model.updatedRecords[index],
                target: "ejGanttChart",
                recordIndex: index
            };
            if (!ej.isNullOrUndefined(toIndex)) args.toIndex = toIndex;
            args.selectedItems =proxy.model.selectedItems;
            proxy._trigger("rowSelected", args);
            }
        },

        _updateEditingType: function () {
            var proxy = this;
            proxy._leftResizing = false;
            proxy._allowDragging = false;
            proxy._rightResizing = false;
            proxy._progressResizing = false;
            proxy._editPredecessor = false;
        },

        /*Update resource tasks order and overlap index on taskbar edited action canceled*/
        _updateResourceChildTasks: function (item) {
            if (item.parentItem && this._prevOverlapOrders && this._prevOverlapOrders.length > 0) {
                item.parentItem.eResourceChildTasks = [];
                for (var count = 0 ; count < this._prevOverlapOrders.length; count++) {
                    this._prevOverlapOrders[count].data.eOverlapIndex = this._prevOverlapOrders[count].overlapIndex;
                    item.parentItem.eResourceChildTasks.push(this._prevOverlapOrders[count].data);
                }
            }
        },
        //Returns the previous item properties
        _getPrevItem: function (item, index) {
            var proxy = this;
            item.left = proxy._prevItem.left;
            item.width = proxy._prevItem.width;
            item.startDate = proxy._prevItem.startDate;
            item.endDate = proxy._prevItem.endDate;
            item.duration = proxy._prevItem.duration;
            item.status = proxy._prevItem.status;
            item.eOverlapIndex = proxy._prevItem.eOverlapIndex;
            item.eOverlapped = proxy._prevItem.eOverlapped;
            item.progressWidth = this._getProgressWidth(item.width, item.status);
            this.refreshRow(index);
            var tempArgs = {};
            tempArgs.index = index;
            this._refreshRow(tempArgs);
        },

        //Returns the previous parent item properties
        _getParentPreviousValue: function () {
            var proxy = this, prevParent, index,
                model = proxy.model,
                parentItem,
                length = proxy._parentCollectionPreviousValues.length;
            for (var i = 0; i < length; i++) {
                prevParent = proxy._parentCollectionPreviousValues[i];
                index = prevParent.index;
                parentItem = model.updatedRecords[index];
                parentItem.left = prevParent.left;
                parentItem.width = prevParent.width;
                parentItem.startDate = prevParent.startDate;
                parentItem.endDate = prevParent.endDate;
                parentItem.duration = prevParent.duration;
                parentItem.status = prevParent.status;
                parentItem.progressWidth = this._getProgressWidth(parentItem.width, parentItem.status);

                if (prevParent.eRangeValues)
                    parentItem.eRangeValues = prevParent.eRangeValues.slice();
                parentItem.eOverlapIndex = prevParent.eOverlapIndex;
                this.refreshRow(index);
                var tempArgs = {};
                tempArgs.index = index;
                this._refreshRow(tempArgs);
            }

        },

        //handler for left resizing taskbar item
        _enableLeftResizing: function (e, item) {

            var proxy = this, model = this.model,
                scheduleHeaderType = model.scheduleHeaderSettings.scheduleHeaderType,
                scheduleHeaderValue = ej.Gantt.ScheduleHeaderType;
            e.target.style.cursor = "e-resize";
            $(proxy._leftResizer).addClass("e-gripper");
            $(proxy._rightResizer).addClass("e-gripper");

            if (proxy.dragPosX > proxy._mousePosX) {
                proxy._mousePosX = proxy.dragPosX - proxy._mousePosX;
                if (item.left > 0) {
                        item.left -= proxy._mousePosX;
                        item.width += proxy._mousePosX;
                }
            }
            else {
                proxy._mousePosX -= proxy.dragPosX;
                if ((item.left + 30) < (item.left + item.width) && ((item.left + proxy._mousePosX) <= (this._prevItem.left + this._prevItem.width))) {
                    item.left += proxy._mousePosX;
                    item.width -= proxy._mousePosX;
                }
            }
            if (ej.isNullOrUndefined(e.originalEvent.pageX)) {
                this.dragPosX = e.originalEvent.targetTouches[0].pageX;
            }
            else {
                this.dragPosX = e.originalEvent.pageX;
            }
            if (scheduleHeaderType == scheduleHeaderValue.Day)
                item.width = item.width < proxy.model.perHourWidth ? proxy.model.perHourWidth : item.width;
            else if (scheduleHeaderType == scheduleHeaderValue.Hour)
                item.width = item.width < proxy.model.perMinuteWidth ? proxy.model.perMinuteWidth : item.width;
            else
                item.width = item.width < proxy.model.perDayWidth ? proxy.model.perDayWidth : item.width;
            item.progressWidth = proxy._getProgressWidth(item.width, item.status);
            /*Adjust left value according to width because of end of taskbar must be in same position while left resizing*/
            item.left = this._prevItem.left + this._prevItem.width - item.width;
            proxy._setItemPosition(item);
        },

        //handler for progressbar resizing
        _enableProgressResizing: function (e, item) {
            var proxy = this,
                diff,
                radius;
            e.target.style.cursor = "col-resize";
            $(proxy._leftResizer).addClass("e-gripper");
            $(proxy._rightResizer).addClass("e-gripper");

            if (proxy._progressResizer) {
                proxy._progressHandle = proxy._progressResizer && proxy._progressResizer.firstChild;
                proxy._progressHandleChild = proxy._progressResizer && proxy._progressResizer.childNodes[1];
            }

            if (proxy.dragPosX > proxy._mousePosX) {
                proxy._mousePosX = proxy.dragPosX - proxy._mousePosX;
                if (item.left > 0) {
                    item.progressWidth -= proxy._mousePosX;
                }
            }
            else {
                proxy._mousePosX -= proxy.dragPosX;
                item.progressWidth += proxy._mousePosX;
            }
            if (ej.isNullOrUndefined(e.originalEvent.pageX)) {
                this.dragPosX = e.originalEvent.targetTouches[0].pageX;
            }
            else {
                this.dragPosX = e.originalEvent.pageX;
            }
            item.progressWidth = item.progressWidth > item.width ? item.width : item.progressWidth;
            item.progressWidth = item.progressWidth < 0 ? 0 : item.progressWidth;

            diff = item.width - item.progressWidth;

            if (diff <= 4) {
                radius = 4 - diff;
            }
            else
                radius = 0;

            $(proxy._progressbarItem).css({
                "width": (item.progressWidth) + "px",
                "border-top-right-radius": radius + "px",
                 "border-bottom-right-radius": radius + "px"
            });
            $(proxy._progressResizer).css({ "left": (item.left + item.progressWidth - 10) + "px" });

            $(proxy._progressHandle).addClass("e-progresshandle");
            $(proxy._progressHandleChild).addClass("e-progresshandleafter");
        },


        //handler for right resizing taskbar
        _enableRightResizing: function (e, item) {

            var proxy = this, model = this.model;
            e.target.style.cursor = "w-resize";

            $(proxy._leftResizer).addClass("e-gripper");
            $(proxy._rightResizer).addClass("e-gripper");

            if (proxy.dragPosX > proxy._mousePosX) {
                proxy._mousePosX = proxy.dragPosX - proxy._mousePosX;
                if (item.width > 0) {
                    item.width -= proxy._mousePosX;
                }
            } else {
                proxy._mousePosX -= proxy.dragPosX;
                item.width += proxy._mousePosX;
            }
            if (ej.isNullOrUndefined(e.originalEvent.pageX)) {
                this.dragPosX = e.originalEvent.targetTouches[0].pageX;
            }
            else {
                this.dragPosX = e.originalEvent.pageX;
            }

            if (model.scheduleHeaderSettings.scheduleHeaderType == ej.Gantt.ScheduleHeaderType.Day)
                item.width = item.width < proxy.model.perHourWidth ? proxy.model.perHourWidth : item.width;
            else if (model.scheduleHeaderSettings.scheduleHeaderType == ej.Gantt.ScheduleHeaderType.Hour)
                item.width = item.width < proxy.model.perMinuteWidth ? proxy.model.perMinuteWidth : item.width;
            else
                item.width = item.width < proxy.model.perDayWidth ? proxy.model.perDayWidth : item.width;

            if (item.eResourceTaskType != "resourceChildTask") {
                if (!item.hasChildRecords) {
                    item.progressWidth = proxy._getProgressWidth(item.width, item.status);
                    $(proxy._tasknameContainer).css({ "left": (item.left) + "px", "width": (item.width) + "px" });
                }
                else
                    $(proxy._manualRightResizer).css({ "left": (item.width - (parseInt(proxy._manualRightResizer.style.borderRightWidth.replace("px", "")))) + "px" });

                $(proxy._taskbarItem).css({"width": (item.width) + "px" });
                $(proxy._progressbarItem).css({ "width": (item.progressWidth) + "px" });
                $(proxy._rightResizer).css({ "left": (item.left + item.width - proxy._resizerRightAdjust) + "px" });
                $(proxy._progressResizer).css({ "left": (item.left + item.progressWidth - 10) + "px" });

                $(proxy._leftConnectorPoint).css({ "left": (item.left - proxy._connectorPointWidth) + "px" });
                $(proxy._rightConnectorPoint).css({ "left": (item.left + item.width) + "px" });
            } else if (item.eResourceTaskType == "resourceChildTask") {
                item.progressWidth = proxy._getProgressWidth(item.width, item.status);
                $(proxy._currentEditTaskBar).css({ "left": (item.left) + "px", "width": (item.width) + "px" });
                $(proxy._taskbarItem).css({ "width": (item.width) + "px" });
                $(proxy._progressbarItem).css({ "width": (item.progressWidth) + "px" });
                $(proxy._rightResizer).css({ "left": (item.width - proxy._resizerRightAdjust) + "px" });
            }

        },


        //Handler for dragging taskbar
        _enableDragging: function (e, item) {
            var proxy = this, model = this.model,
                margin,
                offsetTop;
            e.target.style.cursor = "move";

            if ($(e.target.parentNode).hasClass("e-parentContainer")) {
                proxy._allowExpandCollapse = false;
            }

            if (this.dragPosX > proxy._mousePosX) {
                proxy._mousePosX = proxy.dragPosX - proxy._mousePosX;
                if (item.left > 0) {
                    item.left -= proxy._mousePosX;
                }
            } else {
                proxy._mousePosX -= proxy.dragPosX;
                item.left += proxy._mousePosX;
            }

            if (ej.isNullOrUndefined(e.originalEvent.pageX)) {
                this.dragPosX = e.originalEvent.targetTouches[0].pageX;
            }
            else {
                this.dragPosX = e.originalEvent.pageX;
            }

            //To set the item top position when dragging taskbars in resource view Gantt
            if (this.model.viewType == "resourceView" && this.model.allowDragAndDrop) {

                margin = (model.rowHeight - model.taskbarHeight) / 2;
                offsetTop = proxy._$bodyContainer.offset().top;
                $(proxy._currentEditTaskBar).css("margin-top", 0);

                if (this.dragPosY > proxy._mousePosY) {
                    proxy._mousePosY = proxy.dragPosY - proxy._mousePosY;
                    proxy._currentItemTop = proxy._currentItemTop - proxy._mousePosY;
                } else {
                    proxy._mousePosY -= proxy.dragPosY;
                    proxy._currentItemTop = proxy._currentItemTop + proxy._mousePosY;
                }

                this.dragPosY = (ej.isNullOrUndefined(e.originalEvent.pageY)) ?
                    e.originalEvent.targetTouches[0].pageY - offsetTop:
                    e.originalEvent.pageY - offsetTop;
                item.top = (proxy._currentItemTop % model.rowHeight <= (model.taskbarHeight / 2)) &&
                    (proxy._currentItemTop % model.rowHeight >= margin) ? proxy._currentItemTop : proxy._currentItemPrevTop;                
                proxy._currentItemPrevTop = (proxy._currentItemPrevTop == 0 ||
                    item.top == proxy._currentItemTop) ? item.top :
                    proxy._currentItemPrevTop;
                item.top = item.top < 0 ? 0 : item.top;
            }

            item.left = item.left < 0 ? 0 : item.left;
            this._setItemPosition(item);
        },


        //Append tooltip while editing taskbar
        _appendTooltip: function (target, index) {

            var proxy = this, tooltipElement, tooltiptable, tooltipbody,
                $target = $(target),
                model = this.model,
                item = index,
                columnHeaderTexts = proxy.model.columnHeaderTexts,
                predecessorEditingTexts = proxy.model.predecessorEditingTexts;
            if (item != null) {
               
                var div = $target[0];
                if ($($target[0]).hasClass("e-progressbarresizer-right")) {
                    div = $target.closest(".e-childContainer")[0];
                }

                if ($(div).hasClass("e-parentContainer") || $(div).hasClass("e-childContainer")) {
                    proxy._editingContainer = div;
                    proxy._leftResizer = (proxy._editingContainer).querySelector(".e-connectorpoint-left");
                    proxy._taskbarItem = (proxy._editingContainer).querySelector(".e-taskbarresizer-left");
                    proxy._progressbarItem = (proxy._editingContainer).querySelector(".e-gantt-childtaskbar");
                    proxy._progressResizer = (proxy._editingContainer).querySelector(".e-gantt-childtaskbar-progress");
                    proxy._rightResizer = (proxy._editingContainer).querySelector(".e-progressbarresizer-right");
                }

                //Don't need to display the drag tooltip in Parent Taskbar
                if (this.model.enableTaskbarDragTooltip && (!$target.hasClass('e-parentContainer'))) {

                    if (this._progressResizing == true) {

                        proxy._$ganttChartContainer[0].style.cursor = "col-resize";

                        tooltiptable = ej.buildTag("table.e-tooltiptable", "", { "margin-top": "0px" }, { 'cellspacing': '2px', 'cellpadding': '2px' });
                        tooltipbody = ej.buildTag("tbody", "", {}, {});
                        tooltipbody[0].innerHTML = "<tr><td>" + columnHeaderTexts["status"] + " : " + item.status + "%</td></tr>";
                        tooltiptable.append(tooltipbody);
                        if (proxy.model.progressbarTooltipTemplate) {
                            proxy._progressBarTooltipID = ej.buildTag("div.e-progressbartooltip#progressbartooltip" + proxy._id + "", "",
                              {
                                  'position': 'absolute',
                                  'z-index': proxy._getMaxZIndex() + 1
                              }, {});
                            proxy.model.cssClass && proxy._progressBarTooltipID.addClass(proxy.model.cssClass);
                            //proxy.tooltipState = "editingTemplateID";
                            var tooltipbody = ej.buildTag("tbody", $.render[proxy._id + "progressbarTooltipTemplate"](item), {}, {});
                            proxy._progressBarTooltipID[0].innerHTML = "<table>" + tooltipbody[0].innerHTML + "</table>";
                        }
                        else if (proxy.model.progressbarTooltipTemplateId) {
                            proxy._progressBarTooltipID = ej.buildTag("div.e-progressbartooltip#progressbartooltip" + proxy._id + "", "",
                                    {
                                        'position': 'absolute',
                                        'z-index': proxy._getMaxZIndex() + 1
                                    }, {});
                            proxy.model.cssClass && proxy._progressBarTooltipID.addClass(proxy.model.cssClass);
                            //proxy.tooltipState = "editingTemplate";
                            var tooltipbody = ej.buildTag("tbody", $.render[proxy._id + "progressbarTooltipTemplate"](item), {}, {});
                            proxy._progressBarTooltipID[0].innerHTML = "<table>" + tooltipbody[0].innerHTML + "</table>";
                        }
                        else {
                            proxy._progressBarTooltipID = ej.buildTag("div.e-progressbartooltip e-js#progressbartooltip" + proxy._id + "",
                                tooltiptable,
                                {
                                    'position': 'absolute',
                                    'z-index': proxy._getMaxZIndex() + 1
                                }, { 'onselectstart': 'return false' });
                            proxy.model.cssClass && proxy._progressBarTooltipID.addClass(proxy.model.cssClass);
                        }
                        if (proxy._progressBarTooltipID) {
                            $(document.body).append(proxy._progressBarTooltipID);
                            proxy._updateTooltipPosition(proxy._progressBarTooltipID, proxy._currMousePosX, proxy._currMousePosY, true);
                        }
                    }
                    // for apend tooltip for connector line
                    else if (this._editPredecessor === true && proxy.model.enablePredecessorEditing) {
                        var predecessorText = model.predecessorText;
                        if (proxy._predecessorTooltip === null) {
                            proxy._predecessorTooltip = ej.buildTag("div.e-tooltipganttpredecessor e-js#predecessortooltip" + proxy._id + "",
                                      "",
                                      {
                                          "top": (proxy._currMousePosY + 10) + "px",
                                          "left": (proxy._currMousePosX + 10) + "px",
                                          'position': 'absolute',
                                          'z-index': proxy._getMaxZIndex() + 1
                                      }, { 'onselectstart': 'return false' });
                            proxy.model.cssClass && proxy._predecessorTooltip.addClass(proxy.model.cssClass);
                            tooltiptable = ej.buildTag("table.e-tooltiptable", "", { "margin-top": "0px" }, { 'cellspacing': '2px', 'cellpadding': '2px' });
                            tooltipbody = ej.buildTag("tbody", "", {}, {});
                            var innerHtml = "<tr><td class='e-predecessor-false'></td><td >" + predecessorEditingTexts["fromText"] + ":</td><td class='e-tooltiptaskname'>" + item.taskName + "</td><td>" + predecessorText[proxy._prevItem.predecessorTarget] + "</td> </tr>" +
                                "<tr><td></td><td>" + predecessorEditingTexts["toText"] + ":</td><td class='e-tooltiptaskname'></td><td></td></tr>";
                            $(tooltipbody).html(innerHtml);
                            tooltiptable.append(tooltipbody);
                            proxy._predecessorTooltip.append(tooltiptable);
                            $(document.body).append(proxy._predecessorTooltip);
                            proxy._updateTooltipPosition(proxy._predecessorTooltip, proxy._currMousePosX, proxy._currMousePosY);
                            //   proxy._$bodyContent.append(proxy._predecessorTooltip);
                        }
                    }
                    else if (proxy._leftResizing == true || proxy._rightResizing == true || proxy._allowDragging == true)
                    {
                    if (proxy._leftResizing == true) {
                        proxy._$ganttChartContainer[0].style.cursor = "e-resize";

                        tooltipElement = {
                            ttipstartDate: this._getFormatedDate(item.startDate, model.dateFormat, model.locale),
                            ttipduration: item.duration,
                            ttipdurationunit: item.durationUnit
                        };
                    } else if (proxy._rightResizing == true) {

                        proxy._$ganttChartContainer[0].style.cursor = "w-resize";

                        tooltipElement = {
                            ttipendDate: this._getFormatedDate(item.endDate, model.dateFormat, model.locale),
                            ttipduration: item.duration,
                            ttipdurationunit: item.durationUnit
                        };
                    } else if (proxy._allowDragging == true) {
                        proxy._$ganttChartContainer[0].style.cursor = "move";

                        tooltipElement = {
                            ttipstartDate: this._getFormatedDate(item.startDate, model.dateFormat, model.locale),
                            ttipendDate: this._getFormatedDate(item.endDate, model.dateFormat, model.locale),
                        };
                    }


                    tooltiptable = ej.buildTag("table.e-tooltiptable", "", { "margin-top": "0px" }, { 'cellspacing': '2px', 'cellpadding': '2px' });

                    if (proxy.model.taskbarEditingTooltipTemplate) {
                        proxy._taskbarEditingTooltipID = ej.buildTag("div.e-editingtooltip e-js#editingtooltip" + proxy._id + "", "",
                           {
                               'position': 'absolute',
                               'z-index': proxy._getMaxZIndex() + 1
                           }, {});
                        proxy.model.cssClass && proxy._taskbarEditingTooltipID.addClass(proxy.model.cssClass);
                        proxy.tooltipState = "editingTemplateID";
                        var tooltipbody = ej.buildTag("tbody", $.render[proxy._id + "editingTooltipTemplate"](item), {}, {});
                        proxy._taskbarEditingTooltipID[0].innerHTML = "<table>" + tooltipbody[0].innerHTML + "</table>";
                    }
                    else if (proxy.model.taskbarEditingTooltipTemplateId) {
                        proxy._taskbarEditingTooltipID = ej.buildTag("div.e-editingtooltip e-js#editingtooltip" + proxy._id + "", "",
                                {
                                    'position': 'absolute',
                                    'z-index': proxy._getMaxZIndex() + 1
                                }, {});
                        proxy.model.cssClass && proxy._taskbarEditingTooltipID.addClass(proxy.model.cssClass);
                        proxy.tooltipState = "editingTemplate";
                        var tooltipbody = ej.buildTag("tbody", $.render[proxy._id + "editingTooltipTemplate"](item), {}, {});
                        proxy._taskbarEditingTooltipID[0].innerHTML = "<table>" + tooltipbody[0].innerHTML + "</table>";
                    }

                    else {
                        proxy.tooltipState = "";
                        if (tooltipElement) {
                            tooltipbody = ej.buildTag("tbody", $.render[proxy._id + "editingTooltipTemplate"](tooltipElement), {}, {});
                            tooltiptable.append(tooltipbody);
                        }

                        proxy._taskbarEditingTooltipID = ej.buildTag("div.e-editingtooltip e-js#editingtooltip" + proxy._id + "", tooltiptable,
                            {
                                'position': 'absolute',
                                'z-index': proxy._getMaxZIndex() + 1
                            }, {});
                        proxy.model.cssClass && proxy._taskbarEditingTooltipID.addClass(proxy.model.cssClass);
                    }
                    if (proxy._taskbarEditingTooltipID) {
                        $(document.body).append(proxy._taskbarEditingTooltipID);
                        if (this.model.viewType == "resourceView" & this.model.allowDragAndDrop) {
                            proxy._updateTooltipPosition(proxy._taskbarEditingTooltipID, proxy._resMousePosX, proxy._resMousePosY, true);
                        }
                        else {
                            proxy._updateTooltipPosition(proxy._taskbarEditingTooltipID, proxy._currMousePosX, proxy._currMousePosY, true);

                        }
                    }
                }
                }
            }
        },

        _setItemPosition: function (item) {
            var proxy = this;
            if (item.eResourceTaskType != "resourceChildTask" && item.eResourceTaskType != "unassignedTask") {
                $(proxy._leftResizer).css({ "left": (item.left + 2) + "px" });
                $(proxy._rightResizer).css({ "left": (item.left + item.width - proxy._resizerRightAdjust) + "px" });
                $(proxy._taskbarItem).css({ "left": (item.left) + "px", "width": (item.width) + "px" });
                $(proxy._progressbarItem).css({ "width": (item.progressWidth) + "px" });
                $(proxy._progressResizer).css({ "left": (item.left + item.progressWidth - 10) + "px" });
                $(proxy._tasknameContainer).css({ "left": (item.left) + "px", "width": (item.width) + "px" });
                $(proxy._leftConnectorPoint).css({ "left": (item.left - proxy._connectorPointWidth) + "px" });
                $(proxy._rightConnectorPoint).css({ "left": (item.left + item.width) + "px" });
            } else if ((item.eResourceTaskType == "resourceChildTask" || item.eResourceTaskType == "unassignedTask")) {
               
                if (proxy._allowDragging && this.model.allowDragAndDrop) {
                    $(proxy._leftResizer).css({ "left": "2px" });
                    $(proxy._rightResizer).css({ "left": (item.width - proxy._resizerRightAdjust) + "px" });

                    $(proxy._currentEditTaskBar).css({
                        "left": (item.left) + "px", "width": (item.width) + "px",
                        "top": (item.top) + "px"
                    });
                }

                else {
                    $(proxy._leftResizer).css({ "left": "2px" });
                    $(proxy._rightResizer).css({ "left": (item.width - proxy._resizerRightAdjust) + "px" });
                    $(proxy._progressbarItem).css({ "width": (item.progressWidth) + "px" });

                    $(proxy._currentEditTaskBar).css({
                        "left": (item.left) + "px", "width": (item.width) + "px"
                    });
                    $(proxy._taskbarItem).css({ "width": (item.width) + "px" });
                }
              }
        },

        //Handles the mousemove after mousedown event
        _updateOnmouseMove: function (e) {

            var proxy = this, args = {}, posy,
                $target = (proxy._editingTarget) ? proxy._editingTarget : null,
                row = ($target) ? $target.closest('tr.e-ganttrowcell') : null,
                item = proxy._editingItem,
                div = ($target) ? $target[0].parentNode : null;

            proxy._newXYPos = true;

            if ($(div).hasClass("e-progressbarresizer-right")) {
                div = div.parentNode;
            }
            else if ($(div).hasClass("e-gantt-childtaskbar-progress")) {
                div = $(div).closest("div.e-childContainer")[0];
            }
            else if ($(div).hasClass("e-progressbarhandler")) {
                div = $target.closest(".e-childContainer")[0];
            }
            else {
                div = $(div).closest("div.e-childContainer,div.e-parentContainer,.e-gantt-milestone,div.e-gantt-milestone-container")[0];
            }
            proxy._currentEditTaskBar = div;
            if (item != null) {
                proxy._trigger("cancelEditCell");
                $(proxy._currentEditTaskBar).css("z-index", 1);
                args.editingFields = {
                    startdate: item.startDate,
                    enddate: item.endDate,
                    progress: item.status,
                    duration: item.duration,
                    durationunit: item.durationUnit
                };
                args.rowData = item;
                args.roundOffDuration = false;
                args.dragging = proxy._allowDragging;
                args.leftResizing = proxy._leftResizing;
                args.rightResizing = proxy._rightResizing;
                args.progressResizing = proxy._progressResizing;
                if (this.model.viewType == "resourceView") {
                    var resMouseY;
                    if (ej.isNullOrUndefined(e.pageY))
                        resMouseY = e.originalEvent.changedTouches[0].pageY - $("#ganttViewTablebody" + proxy._id + "").offset().top;
                    else resMouseY = e.pageY - $("#ganttViewTablebody" + proxy._id + "").offset().top;
                    args.isVerticalDragging = Math.abs(proxy._posY1 - resMouseY) >= proxy.model.rowHeight;
                }

                proxy._taskbarEditing(args);
                proxy._roundOffDuration = args.roundOffDuration;
                if (!args.cancel) {

                    if (!e) e = window.event;

                    if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 9) {
                        e.originalEvent.pageX = e.originalEvent.clientX;
                        e.originalEvent.pageY = e.originalEvent.clientY;
                    }

                    if (e.originalEvent.pageX || e.originalEvent.pageY) {
                        proxy._resMousePosX = proxy._mousePosX = e.originalEvent.pageX;
                        proxy._resMousePosY = e.originalEvent.pageY;
                        proxy._posX = e.originalEvent.pageX;
                        proxy._posY = e.originalEvent.pageY;
                        proxy._mousePosY = e.originalEvent.pageY - proxy._$bodyContainer.offset().top;
                    }

                    else if (e.originalEvent.clientX || e.originalEvent.clientY) {
                        proxy._resMousePosX = proxy._mousePosX = e.originalEvent.clientX + document.body.scrollLeft
                            + document.documentElement.scrollLeft;
                        proxy._resMousePosY = e.originalEvent.clientY;
                        proxy._posX = e.originalEvent.clientX;
                        proxy._posY = e.originalEvent.clientY;
                        proxy._mousePosY = (e.originalEvent.clientY + document.body.scrollTop
                            + document.documentElement.scrollTop) - proxy._$bodyContainer.offset().top;
                    }
                    else if (e.originalEvent.touches[0].pageX || e.originalEvent.touches[0].pageY) {
                        proxy._resMousePosX = proxy._mousePosX = e.originalEvent.targetTouches[0].pageX;
                        proxy._posX = e.originalEvent.targetTouches[0].pageX;
                        proxy._posY = e.originalEvent.targetTouches[0].pageY;
                        proxy._resMousePosY = e.originalEvent.targetTouches[0].pageY;
                        proxy._mousePosY = e.originalEvent.targetTouches[0].pageY -
                            proxy._$bodyContainer.offset().top;
                    }

                    if ($target.hasClass("e-gantt-milestone") || $(div).hasClass("e-gantt-milestone")) {
                        if ($(row).hasClass("e-editmode")) {
                            this._editMilestone(e);
                        }
                    } else {

                        if ($(div).hasClass("e-childContainer")) {
                            proxy._editingContainer = div;
                            proxy._leftResizer = proxy._editingContainer.querySelector(".e-taskbarresizer-left");
                            proxy._taskbarItem = proxy._editingContainer.querySelector(".e-gantt-childtaskbar");
                            proxy._progressbarItem = proxy._editingContainer.querySelector(".e-gantt-childtaskbar-progress");
                            proxy._progressResizer = proxy._editingContainer.querySelector(".e-progressbarresizer-right");
                            proxy._rightResizer = proxy._editingContainer.querySelector(".e-taskbarresizer-right");
                            if (proxy.model.predecessorMapping && proxy.model.enablePredecessorEditing) {
                                proxy._leftConnectorPoint = div.querySelector(".e-connectorpoint-left"); 
                                proxy._rightConnectorPoint = div.querySelector(".e-connectorpoint-right");
                                if (proxy.model.allowGanttChartEditing) {
                                    $(proxy._leftConnectorPoint).addClass("e-connectorpoint-hover");
                                    $(proxy._rightConnectorPoint).addClass("e-connectorpoint-hover");
                                }
                            }

                        }
                        else if (($(div).hasClass("e-parentContainer")) && !item.isAutoSchedule) {
                            proxy._editingContainer = div;
                            proxy._taskbarItem = proxy._editingContainer.querySelector(".e-gantt-manualparenttaskbar");
                            proxy._rightResizer = proxy._editingContainer.querySelector(".e-taskbarresizer-right");
                            proxy._manualRightResizer = proxy._editingContainer.querySelector(".e-gantt-manualparenttaskbar-right");
                        }

                        if ($(row).hasClass("e-editmode") &&
                            (($($target[0]).closest("e-gantt-manualparenttaskbar")) || $(div).hasClass("e-gantt-milestone-container") || $(div).hasClass("e-childContainer"))) {

                            if (proxy._leftResizing == true) {
                                proxy._enableLeftResizing(e, item);
                                proxy._updateEditedItem(item, "leftResizing");

                            } else if (proxy._progressResizing == true
                                && proxy.model.enableProgressBarResizing
                                && proxy.model.progressMapping) {
                                //Remove the progress bar status while resizing the progress bar status
                                
                                if (proxy._editingTarget.hasClass("e-progresshandlerafter-element") || proxy._editingTarget.hasClass("e-progressbarhandler e-progresshandle")
                                    || proxy._editingTarget.hasClass("e-progresshandler-element") || proxy._editingTarget.hasClass("e-progressbarresizer-right")) {
                                    proxy._editingTarget.prev(".e-gantt-childtaskbar").find(".e-tasklabel").text("");
                                }
                                proxy._enableProgressResizing(e, item);
                                proxy._updateEditedItem(item, "progressResizing");

                            } else if (proxy._rightResizing == true) {
                                proxy._enableRightResizing(e, item);
                                proxy._updateEditedItem(item, "rightResizing");

                            } else if (proxy._allowDragging == true) {
                                proxy._enableDragging(e, item);
                                proxy._updateEditedItem(item, "dragging");
                            }

                            //for predecessor , draw false line move the tooltip
                            else if (proxy._editPredecessor == true) {
                                //if ($(e.target).hasClass('e-connectortouchpoint')) {
                                //    e.target = $target.parent();
                                //}
                                proxy._drawFalseLine(e, item);
                                var position = proxy._getOffsetRect($("#" + proxy._id)[0]),
                                    contentHeight = Math.round(proxy.element.height()),
                                    contentWidth = Math.round(proxy.element.width()),
                                    top = position.top,
                                    left = position.left,
                                    height = proxy._$headerContainer.height() + top,
                                    posy = proxy._posY,
                                    posx = proxy._posX, topvalue, leftvalue,
                                id = proxy._id.replace("ejGanttChart", ""),
                                ganttbody = proxy.element.find(".e-ganttviewerbodyContianer"),
                                vScrollbar = ganttbody.ejScroller("instance")._vScrollbar,
                                isVscroll = ganttbody.ejScroller("isVScroll"),
                                max = isVscroll ? ganttbody.find(".e-content").get(0).scrollHeight - 1 : 0,
                                bottomScrollPos = ganttbody.ejScroller("isHScroll") ? (contentHeight + top - (proxy.model.rowHeight / 2) - 18) :
                                                    (contentHeight + top - (proxy.model.rowHeight / 2)),
                                topScrollPos = height + (proxy.model.rowHeight / 2),

                                isHscroll = ganttbody.ejScroller("isHScroll"),
                                maxWidth = isHscroll ? ganttbody.find(".e-content").get(0).scrollWidth : 0,
                                rightScrollPos = ganttbody.ejScroller("isVScroll") ? (contentWidth + left - (18 + 20)) : (contentWidth + left - 20),
                                leftScrollPos = left + 20;//20 is used for auto scrolling when mouse points reaches near boundary

                                //condition to check whether mouse points reaches vertical boundary of chart section
                                if ((posy > bottomScrollPos) || (posy < topScrollPos && proxy._scrollTop != 0)) {
                                    if (!proxy._timerDragVertical) {
                                        if (proxy.model.enableVirtualization && proxy._connectorDrawElement) {
                                            proxy._dummyElementRemoved = true;
                                            var cloneElement = proxy._connectorDrawElement.clone();
                                            proxy._connectorDrawElement.before(cloneElement);
                                            proxy._connectorDrawElement.hide();
                                            $(proxy._$bodyContainer).append(proxy._connectorDrawElement);
                                        }
                                        proxy._timerDragVertical = window.setInterval(function () {
                                            if ((posy > bottomScrollPos) && (max > proxy._scrollTop)) {
                                                topvalue = proxy._scrollTop + 20;
                                                topvalue = topvalue > max ? max : topvalue;
                                                if (vScrollbar.model.maximum > proxy._scrollTop)
                                                    ganttbody.ejScroller("scrollY", topvalue, true);
                                                proxy._drawFalseLine(e);
                                            }
                                            else if (posy < topScrollPos && (proxy._scrollTop > 0)) {
                                                topvalue = proxy._scrollTop - 20;
                                                topvalue = topvalue < 0 ? 0 : topvalue;
                                                ganttbody.ejScroller("scrollY", topvalue, true);
                                                proxy._drawFalseLine(e);
                                            }
                                        }, 100);
                                    }
                                }
                                else {
                                    proxy._timerDragVertical && (proxy._timerDragVertical = window.clearInterval(proxy._timerDragVertical));
                                }

                                //condition to check whether mouse points reaches horizontal boundary of chart section
                                if ((posx > rightScrollPos) || (posx < leftScrollPos && proxy._scrollLeft != 0)) {
                                    if (!proxy._timerDragHorizontal) {
                                        proxy._timerDragHorizontal = window.setInterval(function () {
                                            if (proxy._timerDragVertical)
                                                return;
                                            if ((posx > rightScrollPos) && (maxWidth > (proxy._scrollLeft))) {
                                                if (proxy._timerDragHorizontal != undefined) {
                                                    leftvalue = proxy._scrollLeft + 20;
                                                    leftvalue = leftvalue > maxWidth ? maxWidth : leftvalue;
                                                    ganttbody.ejScroller("scrollX", leftvalue, true);
                                                    proxy._drawFalseLine(e);
                                                }
                                            }
                                            else if ((posx < leftScrollPos) && proxy._scrollLeft > 0) {
                                                if (proxy._timerDragHorizontal != undefined) {
                                                    leftvalue = proxy._scrollLeft - 20;
                                                    leftvalue = leftvalue < 0 ? 0 : leftvalue;
                                                    ganttbody.ejScroller("scrollX", leftvalue, true);
                                                    proxy._drawFalseLine(e);
                                                }
                                            }
                                        }, 100);
                                    }
                                }
                                else {
                                    proxy._timerDragHorizontal && (proxy._timerDragHorizontal = window.clearInterval(proxy._timerDragHorizontal));
                                }
                            }
                        }
                    }
                    proxy._clearTooltip();
                    proxy._appendTooltip($target, item);
                }
            }
            if (ej.isNullOrUndefined(e.pageX) && e.type == "touchmove" && proxy._predecessorTooltip) {
                var x2, y2;
                if (ej.isNullOrUndefined(e.pageX)) {
                    x2 = e.originalEvent.changedTouches[0].pageX;
                    y2 = e.originalEvent.changedTouches[0].pageY;
                    e.target = this._getElementByPosition(x2, y2);
                }
                else {
                    x2 = e.pageX;
                    y2 = e.pageY;
                }
                if ($(e.target).hasClass('e-connectorpoint-left') || $(e.target).hasClass('e-connectortouchpoint')) {
                    proxy._dragLeftOver(e);
                } else if ($(e.target).hasClass('e-connectorpoint-right')) {
                    proxy._dragRightOver(e);
                } else {
                    proxy._mouseLeave();
                    $(proxy._leftConnectorPoint).addClass("e-connectorpoint-hover");
                    $(proxy._rightConnectorPoint).addClass("e-connectorpoint-hover");
                }
            }
        },


        //Handler for milestone editing
        _editMilestone: function (e) {

            var proxy = this,
                $target = proxy._editingTarget,
                div = ($target.hasClass("e-milestone-top") || $target.hasClass("e-milestone-bottom")) ? $target[0].parentNode: $target.closest(".e-gantt-milestone"),
                $ganttGridRows = proxy.getGanttChartRows(),
                row = $target.closest('tr.e-ganttrowcell'),
              //  recordIndexr = $ganttGridRows.index(row),
                item = proxy._editingItem;

            if (item != null) {

                if (!e) e = window.event;
                if (e.originalEvent.pageX || e.originalEvent.pageY) {
                    proxy._mousePosX = e.originalEvent.pageX;
                } else if (e.originalEvent.clientX || e.originalEvent.clientY) {
                    proxy._mousePosX = e.originalEvent.clientX + document.body.scrollLeft
                        + document.documentElement.scrollLeft;
                }
                else if (e.originalEvent.touches[0].pageX || e.originalEvent.touches[0].pageY) {
                    proxy._mousePosX = e.originalEvent.targetTouches[0].pageX;
                }

                e.target.style.cursor = "move";
                if (proxy.dragPosX > proxy._mousePosX) {
                    proxy._mousePosX = proxy.dragPosX - proxy._mousePosX;
                    if (item.left > 0) {
                        item.left -= proxy._mousePosX;
                    }
                } else {
                    proxy._mousePosX -= proxy.dragPosX;
                    item.left += proxy._mousePosX;
                }
                if (ej.isNullOrUndefined(e.originalEvent.pageX)) {
                    this.dragPosX = e.originalEvent.targetTouches[0].pageX;
                }
                else {
                    this.dragPosX = e.originalEvent.pageX;
                }
                item.left = item.left < 0 ? 0 : item.left;

                $(div).css({ "left": (item.left) + "px" });

                $(proxy._leftConnectorPoint).css({ "left": (item.left - proxy._connectorPointWidth) + "px" });
                $(proxy._rightConnectorPoint).css({ "left": (item.left + proxy._milesStoneWidth) + "px" });

                proxy._updateEditedItem(item, "dragging");
                proxy._appendTooltip($target, item);
            }
        },


        //Updates the edited item's values
        _updateEditedItem: function (ganttRecord, reason) {

            var proxy = this,
                model = proxy.model,
                projectStartDate = ganttRecord._getFormatedDate(model.projectStartDate, model.dateFormat, model.locale),
                projectStartDate = ganttRecord._getDateFromFormat(projectStartDate, model.dateFormat, model.locale),
                startDate, endDate, left;

            switch (reason) {

                case 'dragging':

                    left = this.model.ganttInstance._getRoundOffStartLeft(ganttRecord, proxy._roundOffDuration);
                    projectStartDate = this.model.ganttInstance._getDateByLeft(left);
                    startDate = this.model.ganttInstance._checkStartDate(projectStartDate, ganttRecord, null, reason);
                    ganttRecord.startDate = new Date(startDate);
                    var editArgs = {};
                    editArgs.startDate = ganttRecord.startDate;
                    editArgs.duration = ganttRecord.duration;
                    editArgs.durationUnit = ganttRecord.durationUnit;
                    editArgs.record = ganttRecord;

                    proxy._calculateEndDate(editArgs);
                    ganttRecord.endDate = proxy._currentEditedRecord.endDate;
                    //update on dataSource
                    if (model.startDateMapping)
                        ganttRecord.item[model.startDateMapping] = ganttRecord.startDate;
                    if (model.endDateMapping)
                        ganttRecord.item[model.endDateMapping] = ganttRecord.endDate;

                    break;

                case 'leftResizing':
                    var editMode = "Resizing";
                    left = this.model.ganttInstance._getRoundOffStartLeft(ganttRecord, proxy._roundOffDuration);
                    projectStartDate = this.model.ganttInstance._getDateByLeft(left);
                    startDate = this.model.ganttInstance._checkStartDate(projectStartDate, ganttRecord, null, reason);
                    ganttRecord.startDate = new Date(startDate);
                    if (ganttRecord.startDate.getTime() == ganttRecord.endDate.getTime()
                        && ej.isNullOrUndefined(ganttRecord.isMilestone) && ganttRecord.isMilestone == false && ganttRecord.duration == 0) {
                        ganttRecord.duration = 1;
                    }
                    var editArgs = {};
                    editArgs.startDate = ganttRecord.startDate;
                    editArgs.endDate = ganttRecord.endDate;
                    editArgs.durationUnit = ganttRecord.durationUnit;
                    editArgs.record = ganttRecord;

                    proxy._calculateDuration(editArgs);
                    ganttRecord.duration = proxy._currentEditedRecord.duration;
                    //update on dataSource
                    if (model.startDateMapping)
                        ganttRecord.item[model.startDateMapping] = ganttRecord.startDate;
                    if (model.durationMapping)
                        ganttRecord.item[model.durationMapping] = ganttRecord.duration;
                    break;

                case 'rightResizing':
                    var editMode = "Resizing";
                    left = this.model.ganttInstance._getRoundOffEndLeft(ganttRecord, proxy._roundOffDuration);
                    var tempEndDate = this.model.ganttInstance._getDateByLeft(left);
                    endDate = this.model.ganttInstance._checkEndDate(tempEndDate, ganttRecord);
                    ganttRecord.endDate = new Date(endDate);
                    var editArgs = {};
                    editArgs.startDate = ganttRecord.startDate;
                        editArgs.endDate = endDate;
                        editArgs.durationUnit = ganttRecord.durationUnit;
                        editArgs.record = ganttRecord;
 
                        proxy._calculateDuration(editArgs);
                        ganttRecord.duration = proxy._currentEditedRecord.duration;

                    //update on datasource
                    if (model.endDateMapping)
                        ganttRecord.item[model.endDateMapping] = ganttRecord.endDate;
                    if (model.durationMapping)
                        ganttRecord.item[model.durationMapping] = ganttRecord.duration;
                    break;

                case 'progressResizing':
                    ganttRecord.status = proxy._getProgressPercent(ganttRecord.width, ganttRecord.progressWidth);
                    if (model.progressMapping)
                        ganttRecord.item[model.progressMapping] = ganttRecord.status;
                    break;
            }
        },

        _calculateEndDate: function (args) {
            var proxy = this;
            return proxy._trigger("calculateEndDate", args);
        },
        _calculateDuration: function (args) {
            var proxy = this;
            return proxy._trigger("calculateDuration", args);
        },

        //false line implementation 
        _drawFalseLine: function (e, item) {

            var proxy = this,
                pageX = e.pageX,
                pageY = e.pageY,
                posX = proxy._posX,
                posY = proxy._posY,
                x1 = proxy._connectorPointX,
                y1 = proxy._connectorPointY,
                x2, y2;

            if (ej.isNullOrUndefined(e.pageX)) {
                x2 = e.originalEvent.changedTouches[0].pageX - proxy._$bodyContent.offset().left,
                y2 = e.originalEvent.changedTouches[0].pageY - proxy._$bodyContent.offset().top;
                pageX = Math.round(e.originalEvent.changedTouches[0].pageX);
                pageY = Math.round(e.originalEvent.changedTouches[0].pageY);
            }
            else{
                x2 = e.pageX - proxy._$bodyContent.offset().left,
                y2 = e.pageY - proxy._$bodyContent.offset().top;

            }
            if (!ej.isNullOrUndefined(proxy._timerDragHorizontal || proxy._timerDragVertical)) {
                x2 = posX - proxy._$bodyContent.offset().left,
                y2 = posY - proxy._$bodyContent.offset().top;
            }
            //var sy=proxy._$bodyContainer.ejScroller("option", "scrollTop");
            //var sx = proxy._$bodyContainer.ejScroller("option", "scrollLeft");

            var length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
            var angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
            var transform = 'rotate(' + angle + 'deg)';

            proxy._falseLine && proxy._falseLine.remove();

                proxy._falseLine = ej.buildTag("div.e-gantt-falseLine#ganttfalseline" + proxy._id, "", {}, {});
                proxy._falseLine.css({
                    'transform-origin': '0% 100%',
                    'right':'auto',
                    'position': 'absolute',
                    'transform': transform,
                    '-ms-transform':transform, /* IE 9 */
                    '-moz-transform':transform, /* Firefox */
                    '-webkit-transform':transform, /* Safari and Chrome */
                    '-o-transform':transform, /* Opera */
                    'border-top-width': '2px',
                    'border-top-style': 'dashed',
                    'z-index': '5'
                }).width(length - 3).offset({ left: x1, top: y1 });

                if (!(ej.browserInfo().name == "msie" && ej.browserInfo().version < 9)) {
                    proxy._$bodyContent.append(proxy._falseLine);
                }

            //Change the position of predecesspr tooltip
                if (!ej.isNullOrUndefined(proxy._timerDragHorizontal || proxy._timerDragVertical)) {
                    proxy._updateTooltipPosition(proxy._predecessorTooltip, posX, posY);
                 }
                else
                    proxy._updateTooltipPosition(proxy._predecessorTooltip, pageX, pageY);
               
        },

        _mouseLeave: function () {

            var proxy = this;
            $(".e-progressbarresizer-right").css({ "background-image": "none" });
            window.clearTimeout(proxy._tooltipTimer);
            proxy._clearTooltip();
            

            if (this._mouseDown == false && proxy._newXYPos) {
                $(proxy._leftResizerGripper).removeClass("e-gripper");
                $(proxy._rightResizerGripper).removeClass("e-gripper");

                if (proxy.model.progressMapping) {
                    $(proxy._progressHandle).removeClass("e-progresshandle");
                    $(proxy._progressHandleChild).removeClass("e-progresshandleafter");
                }

                if (proxy.model.predecessorMapping && proxy.model.enablePredecessorEditing) {

                    $(proxy._leftConnectorPoint).removeClass('e-connectorpoint-hover').removeClass('e-gantt-manualparenttaskbar-connectorpoint-hover');
                    $(proxy._rightConnectorPoint).removeClass('e-connectorpoint-hover').removeClass('e-gantt-manualparenttaskbar-connectorpoint-hover');

                    
                    proxy._leftConnectorPoint = null;
                    proxy._rightConnectorPoint = null;
                }
            }
            else if (proxy._mouseDown && proxy._falseLine) {
                
                if (proxy.model.allowGanttChartEditing == true && proxy.model.enablePredecessorEditing && proxy.model.readOnly == false) {
                    proxy._removeEditingElements();
                }
            }

            if (proxy._mouseDown == false && $(proxy._$dependencyViewContainer).css("z-index") == "4") {
                $(proxy._$dependencyViewContainer).css("z-index", "5");
            }

            if (!ej.isNullOrUndefined(proxy._hoverConnectorLineElement) && !proxy._isPredecessorEditOpen) {
                proxy._clearConnectorLineSelection();
            }
        },

        _getMaxZIndex: function () {
            var divs = document.getElementsByTagName('div'),
                highest = 0,
                divLength = divs.length;
            if (this._maxZIndex == 0) {
                for (var i = 0; i < divLength; i++) {
                    var zindex = divs[i].style.zIndex,
                         checkIndex = parseInt(zindex);
                    if (checkIndex > highest && zindex != "auto" && !isNaN(checkIndex)) {
                        highest = checkIndex;
                    }
                }
                this._maxZIndex = highest;
            }
            return this._maxZIndex;
        },

        _getOffsetRect: function (elem) {
            var box = elem.getBoundingClientRect(),
                body = document.body,
                docElem = document.documentElement,
                scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
                scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
                clientTop = docElem.clientTop || body.clientTop || 0,
                clientLeft = docElem.clientLeft || body.clientLeft || 0,
                top = box.top + scrollTop - clientTop,
                left = box.left + scrollLeft - clientLeft;
            return { top: Math.round(top), left: Math.round(left) }
        },
        /* edge detection for tooltip in ganttchart*/
        _updateTooltipPosition: function (tooltip, posx, posy, isEditingTooltip) {
            if (tooltip && tooltip.length > 0) {
                var proxy = this,
                    containerBoundary = proxy._getOffsetRect(proxy._$bodyContainer[0]),
                    topEnd = containerBoundary.top + proxy._$bodyContainer.height(),
                    leftEnd = containerBoundary.left + proxy._$bodyContainer.width(),
                    rowHeight = proxy.model.rowHeight, pos = 0;
                //Left update
                if (((posx + tooltip.width() + 30) > leftEnd)) {
                    pos = posx - tooltip.width() - 30;//while tooltip rendered outdide of Gantt chart
                    tooltip.css('left', ((pos) + 'px'));
                }
                else {
                    if (!isEditingTooltip)
                        tooltip.css('left', (posx + 15) + 'px');
                    else
                        tooltip.css('left', (posx) + 'px');
                }
                //Top update
                if (isEditingTooltip || ((posy + tooltip.height() + 30) > topEnd)) {
                    if (!isEditingTooltip)
                        pos = posy - tooltip.height() - 30;//while tooltip rendered outdide of Gantt chart
                    else
                        pos = posy - tooltip.height() - rowHeight;

                    tooltip.css('top', ((pos) + 'px'));
                } else {
                    tooltip.css('top', (posy + 10) + 'px');
                }
            }
        },

        /*Common method to get the record that coressponding to taskber element in project and resource view Gantt*/
        getRecordByTarget: function (e, isSelectTaskbar) {
            var $target = $(e.target),
                rows = this.getGanttChartRows(),
                row = $target.closest('tr.e-ganttrowcell'),
                recordIndexr = rows.index(row),
                item = this.model.currentViewData[recordIndexr];
            if (item && item.eResourceTaskType == "resourceTask" && this.model.viewType == "resourceView" && $target.closest(".e-childContainer").length == 1) {
                var rIndex = row.find(".e-childContainer").index($target.closest(".e-childContainer"));
                item = item.eResourceChildTasks[rIndex];
                if (isSelectTaskbar) {
                    this.element.find(".e-gantt-taskbarSelection").removeClass("e-gantt-taskbarSelection");
                    $target.closest(".e-childContainer").addClass("e-gantt-taskbarSelection");
                }
            } 
            return item;
        },
        _mouseHover: function (e) {
            
            var $target = $(e.target), proxy = this,
                model = proxy.model,
                posx = 0,
                posy = 0,
                div = $target[0].parentNode,
                progressHandler,
                item = this.getRecordByTarget(e),
                tooltipElement, tooltiptable, tooltipbody, predecessorTooltipElement;
            if (e.target.className == "e-parentContainer" || e.target.className == "e-gantt-milestone-container" || e.target.className == "e-childContainer")
            {
                return true;
            }

            if ($(div).hasClass("e-gantt-childtaskbar-progress")) {
                div = $(div).closest("div.e-childContainer")[0];
            }
            else if ($target.hasClass("e-tasklabel"))
                div = $target.closest(".e-childContainer")[0];
            else if (div.className == "e-connectorlineContainer")
                div = div;
            else {
                div = $(div).closest("div.e-childContainer,div.e-parentContainer,.e-gantt-milestone,div.e-gantt-milestone-container")[0];
            }

            if ($(div).is(".e-childContainer,.e-parentContainer,.e-gantt-milestone,.e-gantt-milestone-container")) {
                $(proxy._$dependencyViewContainer).css("z-index", "4");
            }
          
            //clearing rendered tooltips in Gantt
            proxy._clearTooltip();
            
            if (!proxy._newXYPos) {
                proxy._newXYPos = true;
                proxy._mouseLeave();
            }
            if (proxy._rightResizing == false && proxy._leftResizing == false &&
                proxy._progressResizing == false && proxy._mouseDown == false) {

                if (proxy.model.allowGanttChartEditing && proxy.model.readOnly == false && ($target.is('.e-gantt-childtaskbar,.e-tasklabel, .e-gantt-manualparenttaskbar') || $target.closest(".e-gantt-childtaskbar").length)) {
                    e.target.style.cursor = "move";
                }


                if (e.type == "mouseenter" || e.type == "mousemove" || e.type == "touchstart") {

                    if (!e) e = window.event;
                    if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 9) {
                        e.originalEvent.pageX = e.originalEvent.clientX;
                        e.originalEvent.pageY = e.originalEvent.clientY;
                    }

                    if (e.originalEvent.pageX || e.originalEvent.pageY) {

                        posx = e.originalEvent.pageX;
                        posy = e.originalEvent.pageY;

                    }
                    else if (e.originalEvent.clientX || e.originalEvent.clientY) {
                        posx = e.originalEvent.clientX + document.body.scrollLeft
                            + document.documentElement.scrollLeft;
                        posy = e.originalEvent.clientY + document.body.scrollTop
                            + document.documentElement.scrollTop;

                    }
                    else if (e.originalEvent && e.originalEvent.changedTouches
                        && e.originalEvent.changedTouches.length > 0) {
                        posx = e.originalEvent.changedTouches[0].pageX;
                        posy = e.originalEvent.changedTouches[0].pageY;
                    }
                    proxy._posX1 = posx;
                    proxy._posY1 = posy;
                  
                    if ($(div).hasClass("e-childContainer") && proxy.model.allowGanttChartEditing && proxy.model.readOnly == false) {
                        proxy._leftResizerGripper = div.querySelector(".e-taskbarresizer-left"); // New div is added for drag points so other elemnts are changed 
                        proxy._rightResizerGripper = div.querySelector(".e-taskbarresizer-right");
                        progressHandler = div.querySelector(".e-progressbarresizer-right");
                        proxy._progressHandle = progressHandler && progressHandler.firstChild;
                        proxy._progressHandleChild = progressHandler && progressHandler.childNodes[1];

                        $(proxy._leftResizerGripper).addClass("e-gripper");
                        $(proxy._rightResizerGripper).addClass("e-gripper");

                        if (proxy.model.progressMapping && proxy.model.enableProgressBarResizing) {
                            $(proxy._progressHandle).addClass("e-progresshandle");
                            $(proxy._progressHandleChild).addClass("e-progresshandleafter");
                        }
                    }

                    //Before Mouse Down  , Apply style for drag points in child cotainer and miles stone container
                    if (($(div).hasClass("e-childContainer") || $(div).hasClass("e-parentContainer")) && proxy.model.predecessorMapping && proxy.model.allowGanttChartEditing && proxy.model.enablePredecessorEditing && proxy.model.readOnly == false) {

                        proxy._leftConnectorPoint = div.querySelector(".e-connectorpoint-left");
                        proxy._rightConnectorPoint = div.querySelector(".e-connectorpoint-right");
                        $(proxy._leftConnectorPoint).addClass("e-connectorpoint-hover");
                        $(proxy._rightConnectorPoint).addClass("e-connectorpoint-hover");
                        if ($(div).hasClass("e-parentContainer") && !item.isAutoSchedule) {                            
                            $(proxy._leftConnectorPoint).addClass("e-gantt-manualparenttaskbar-connectorpoint-hover");
                            $(proxy._rightConnectorPoint).addClass("e-gantt-manualparenttaskbar-connectorpoint-hover");
                        }
                    }
                    else if (($(div).hasClass("e-gantt-milestone") || $(div).hasClass("e-gantt-milestone-container")) && proxy.model.predecessorMapping && proxy.model.allowGanttChartEditing && proxy.model.enablePredecessorEditing && proxy.model.readOnly == false) {
                        var milesStoneContainer = div.parentNode;
                        proxy._leftConnectorPoint = milesStoneContainer.querySelector(".e-connectorpoint-left");
                        proxy._rightConnectorPoint = milesStoneContainer.querySelector(".e-connectorpoint-right");
                        $(proxy._leftConnectorPoint).addClass("e-connectorpoint-hover");
                        $(proxy._rightConnectorPoint).addClass("e-connectorpoint-hover");
            }
                    if (item && proxy.model.enableTaskbarTooltip && !ej.isTouchDevice() && !$($target).hasClass("e-connectorpoint-hover")) {
                        proxy._predecessorTooltip && proxy._predecessorTooltip.remove();
                        proxy._predecessorTooltip = null;

                        if (($($target).hasClass("e-gantt-parenttaskbar-innerdiv") || $($target[0].parentNode).hasClass("e-gantt-parenttaskbar-innerdiv")) && !item.isAutoSchedule) {
                            tooltipElement = {
                                ttipscheduleStartDate: this._getFormatedDate(item.manualStartDate, this.model.dateFormat, this.model.locale),
                                ttipscheduleEndDate: this._getFormatedDate(item.manualEndDate, this.model.dateFormat, this.model.locale),
                                ttipduration: item.manualDuration,
                                ttipprogress: item.status.toString(),
                                ttiptaskname: item.taskName,
                                ttipdurationunit: item.durationUnit
                            };
                        }
                        else if ($($target).hasClass("e-gantt-manualparenttaskbar") || $($target).hasClass("e-gantt-manualparenttaskbar-left") || $($target).hasClass("e-gantt-manualparenttaskbar-right") && !item.isAutoSchedule) {
                            tooltipElement = {
                                ttipstartDate: this._getFormatedDate(item.startDate, this.model.dateFormat, this.model.locale),
                                ttipsubtaskStartDate: this._getFormatedDate(item.manualStartDate, this.model.dateFormat, this.model.locale),
                                ttipendDate: this._getFormatedDate(item.endDate, this.model.dateFormat, this.model.locale),
                                ttipsubtaskEndDate: this._getFormatedDate(item.manualEndDate, this.model.dateFormat, this.model.locale),
                                ttipduration: item.duration,
                                ttiptaskname: item.taskName,
                                ttipdurationunit: item.durationUnit

                            };
                        }
                        else {
                            tooltipElement = {
                                ttipstartDate: this._getFormatedDate(item.startDate, this.model.dateFormat, this.model.locale),
                                ttipendDate: this._getFormatedDate(item.endDate, this.model.dateFormat, this.model.locale),
                                ttipduration: item.duration,
                                ttipprogress: item.status.toString(),
                                ttiptaskname: item.taskName,
                                ttipdurationunit: item.durationUnit
                            };
                        }
                    }
                    else if (model.allowGanttChartEditing && !ej.isNullOrUndefined(div) && div.className == "e-connectorlineContainer" && !proxy._isPredecessorEditOpen) {
                        var $parentDiv = div;                        
                        $($parentDiv).find(".e-line").addClass("e-connectorline-hover");
                        if ($($parentDiv).find(".e-connectorline-rightarrow").length > 0)
                            $($parentDiv).find(".e-connectorline-rightarrow").addClass("e-connectorline-rightarrow-hover");
                        else
                            $($parentDiv).find(".e-connectorline-leftarrow").addClass("e-connectorline-leftarrow-hover");

                        proxy._hoverConnectorLineElement = $parentDiv;
                        var connectLineId = $($parentDiv).parent()[0].id,
                            taskIds = connectLineId.match(/\d+/g),
                            fromTask = model.flatRecords[model.ids.indexOf(taskIds[0])],
                            toTask = model.flatRecords[model.ids.indexOf(taskIds[1])],
                            fromTaskPredecessors = fromTask.predecessor,
                            predecessorType, predecessor;
                        
                        predecessor = fromTaskPredecessors.filter(function (pdc) { return pdc.to == taskIds[1]; });                        
                        predecessorType = model.predecessorCollectionText.filter(function (pType) { return pType.id == predecessor[0].predecessorsType; });                       

                        predecessorTooltipElement = {
                            linkType: predecessor[0].predecessorsType,
                            linkText: predecessorType[0].text,
                            offset: predecessor[0].offset,
                            offsetUnit: predecessor[0].offsetDurationUnit,
                            fromId: predecessor[0].from,
                            toId: predecessor[0].to,
                            fromName: fromTask.taskName,
                            toName: toTask.taskName
                        };
                        if (model.enableSerialNumber) {
                            predecessorTooltipElement.fromSno = fromTask.serialNumber;
                            predecessorTooltipElement.toSno = toTask.serialNumber;
                        }
                        proxy._predecessorInfo = predecessorTooltipElement;
                    }


                    if (tooltipElement) {

                        tooltiptable = ej.buildTag("table.e-tooltiptable", "", { "margin-top": "0px" }, { 'cellspacing': '5' });
                      

                        if (!proxy.model.tooltipTemplate && !proxy.model.tooltipTemplateId) {
                            proxy.tooltipState = "";
                            tooltipbody = ej.buildTag("tbody", $.render[proxy._id + "tooltipTemplate"](tooltipElement), {}, {});
                            tooltiptable.append(tooltipbody);
                            proxy._mouseHoverTooltip = ej.buildTag("div.e-tooltipgantt e-js#tooltipgantt" + proxy._id + "", tooltiptable,
                                { 'position': 'absolute', 'z-index': proxy._getMaxZIndex() + 1, 'border-radius': '5px' }, {});
                            proxy.model.cssClass && proxy._mouseHoverTooltip.addClass(proxy.model.cssClass);
                            proxy._mouseHoverTooltip.innerHTML = "<table>" + tooltiptable[0].innerHTML + "</table>";

                            //Providing a time delay to render the tooltip to improve UI
                            proxy._tooltipTimer = setTimeout(function () {
                                $(document.body).append(proxy._mouseHoverTooltip);
                                proxy._updateTooltipPosition(proxy._mouseHoverTooltip, posx, posy);
                            }, 700);
                        }
                        else if (proxy.model.tooltipTemplate) {
                            proxy._mouseHoverTooltip = ej.buildTag("div.e-tooltipgantt e-js#tooltipgantt" + proxy._id + "","",
                                { 'position': 'absolute', 'z-index': proxy._getMaxZIndex() + 1, 'border-radius': '5px' }, {});
                            proxy.model.cssClass && proxy._mouseHoverTooltip.addClass(proxy.model.cssClass);
                            proxy.tooltipState = "Template";
                            var tooltipbody = ej.buildTag("tbody", $.render[proxy._id + "tooltipTemplate"](item), {}, {});
                            proxy._mouseHoverTooltip[0].innerHTML = "<table>" + tooltipbody[0].innerHTML + "</table>";

                            //Providing a time delay to render the tooltip to improve UI
                            proxy._tooltipTimer = setTimeout(function () {
                                $(document.body).append(proxy._mouseHoverTooltip);
                                proxy._updateTooltipPosition(proxy._mouseHoverTooltip, posx, posy);
                            }, 700);
                        }
                        else if (proxy.model.tooltipTemplateId) {
                            proxy._mouseHoverTooltip = ej.buildTag("div.e-tooltipgantt e-js#tooltipgantt" + proxy._id + "", "",
                                { 'position': 'absolute', 'z-index': proxy._getMaxZIndex() + 1, 'border-radius': '5px' }, {});
                            proxy.model.cssClass && proxy._mouseHoverTooltip.addClass(proxy.model.cssClass);
                            proxy.tooltipState = "TemplateID";
                            var tooltipbody = ej.buildTag("tbody", $.render[proxy._id + "tooltipTemplate"](item), {}, {});
                            proxy._mouseHoverTooltip[0].innerHTML = "<table>" + tooltipbody[0].innerHTML + "</table>";

                            //Providing a time delay to render the tooltip to improve UI
                            proxy._tooltipTimer = setTimeout(function () {
                                $(document.body).append(proxy._mouseHoverTooltip);
                                proxy._updateTooltipPosition(proxy._mouseHoverTooltip, posx, posy);
                            }, 700);
                        }
                        $(proxy._mouseHoverTooltip).addClass("e-customTooltip");
                    }
                    if (proxy.model.enableTaskbarTooltip && predecessorTooltipElement) {

                        tooltiptable = ej.buildTag("table.e-tooltiptable", "", { "margin-top": "0px" }, { 'cellspacing': '5' });

                        if (!proxy.model.predecessorTooltipTemplate) {
                            tooltipbody = ej.buildTag("tbody", $.render[proxy._id + "predecessorTooltipTemplate"](predecessorTooltipElement), {}, {});
                            tooltiptable.append(tooltipbody);
                            proxy._connectorLineTooltip = ej.buildTag("div.e-tooltipgantt e-js#" + proxy._id + "_predecessortooltip", tooltiptable,
                                { 'position': 'absolute', 'z-index': proxy._getMaxZIndex() + 1, 'border-radius': '5px' }, {});
                            proxy.model.cssClass && proxy._connectorLineTooltip.addClass(proxy.model.cssClass);
                            proxy._connectorLineTooltip.innerHTML = "<table>" + tooltiptable[0].innerHTML + "</table>";

                            //Providing a time delay to render the tooltip to improve UI
                            proxy._tooltipTimer = setTimeout(function () {
                                $(document.body).append(proxy._connectorLineTooltip);
                                proxy._updateTooltipPosition(proxy._connectorLineTooltip, posx, posy);
                            }, 700);
                        }
                        else {
                            proxy._connectorLineTooltip = ej.buildTag("div.e-tooltipgantt e-js#tooltipgantt" + proxy._id + "", "",
                                { 'position': 'absolute', 'z-index': proxy._getMaxZIndex() + 1, 'border-radius': '5px' }, {});
                            proxy.model.cssClass && proxy._connectorLineTooltip.addClass(proxy.model.cssClass);

                            var tooltipbody = ej.buildTag("tbody", $.render[proxy._id + "predecessorTooltipTemplate"](predecessorTooltipElement), {}, {});
                            proxy._connectorLineTooltip[0].innerHTML = "<table>" + tooltipbody[0].innerHTML + "</table>";

                            //Providing a time delay to render the tooltip to improve UI
                            proxy._tooltipTimer = setTimeout(function () {
                                $(document.body).append(proxy._connectorLineTooltip);
                                proxy._updateTooltipPosition(proxy._connectorLineTooltip, posx, posy);
                            }, 700);
                        }
                        $(proxy._connectorLineTooltip).addClass("e-customTooltip");
                    }
                }
            }
        },
        
        _createEditingTooltipTemplate: function () {

            var proxy = this,
                td,
                columnHeaderTexts = proxy.model.columnHeaderTexts,
                durationUnitTexts = proxy.model.durationUnitTexts,
                editingTemplateId = proxy.model.taskbarEditingTooltipTemplateId,
                editingTemplate = proxy.model.taskbarEditingTooltipTemplate,
                helpers = {};
            helpers["_" + proxy._id + "getStartDate"] = proxy._tooltipStartDate;
            helpers["_" + proxy._id + "getEndDate"] = proxy._tooltipEndDate;
            helpers["_" + proxy._id + "getTaskName"] = proxy._tooltipTaskName;
            helpers["_" + proxy._id + "getProgress"] = proxy._tooltipProgress;
            helpers["_" + proxy._id + "checkDuration"] = proxy._checkDuration;
            helpers["_" + proxy._id + "getDuration"] = $.proxy(proxy._tooltipDuration, proxy);

            $.views.helpers(helpers);

            
            if (editingTemplateId) {
                var parentTr = $("#" + editingTemplateId)[0].innerHTML;
            }
            else if (editingTemplate) {
                var parentTr = editingTemplate;
            }
            else {                
                parentTr = "{{if ~_" + proxy._id + "getTaskName()}}" +
                    "<tr><td class='e-tooltiptaskname' style='width:40px;text-align:left;' colspan='3';>{{:ttiptaskname}}</td></tr>{{/if}}" +                    

                    "{{if ~_" + proxy._id + "getStartDate()}}" +
                    "<tr><td class='e-tooltiptd-alignleft' style='width:30px;white-space:nowrap;'>" + columnHeaderTexts["startDate"] + "</td>" +
                    "<td class='e-tooltiptd-aligncenter' style='width:10px;font-weight:bold;'>:</td>" +
                    "<td class='e-tooltiptd-alignright' style='width:30px;white-space:nowrap;'>{{:ttipstartDate}}</td></tr>{{/if}}" +                    

                    "{{if ~_" + proxy._id + "getEndDate()}}" +
                    "<tr><td class='e-tooltiptd-alignleft' style='width:30px;white-space:nowrap;'>" + columnHeaderTexts["endDate"] + "</td>" +
                    "<td class='e-tooltiptd-aligncenter' style='width:10px;font-weight:bold;'>:</td>" +
                    "<td class='e-tooltiptd-alignright' style='width:30px;white-space:nowrap;'>{{:ttipendDate}}</td></tr>{{/if}}" +                    

                    "{{if ~_" + proxy._id + "checkDuration()}}" +
                    "<tr><td class='e-tooltiptd-alignleft' style='width:30px;white-space:nowrap;'>" + columnHeaderTexts["duration"] + "</td>" +
                    "<td class='e-tooltiptd-aligncenter' style='width:10px;font-weight:bold;'>:</td>" +
                    "<td class='e-tooltiptd-alignright' style='width:30px;white-space:nowrap;'>{{:~_" + proxy._id + "getDuration(#data)}}</td></tr>{{/if}}" +                    

                    "{{if ~_" + proxy._id + "getProgress()}}" +
                    "<tr><td class='e-tooltiptd-alignleft' style='width:30px;white-space:nowrap;'>" + columnHeaderTexts["status"] + "</td>" +
                    "<td class='e-tooltiptd-aligncenter' style='width:10px;font-weight:bold;'>:</td>" +
                    "<td class='e-tooltiptd-alignright' style='width:30px;white-space:nowrap;'>{{:ttipprogress}}%</td></tr>{{/if}}";                
            }

            var templates = {};
            templates[proxy._id + "editingTooltipTemplate"] = parentTr;
            $.templates(templates);
        },

        _createProgressbarTooltipTemplate: function () {
            var proxy = this,
                  templateId = proxy.model.progressbarTooltipTemplateId,
            template = proxy.model.progressbarTooltipTemplate;

            if (templateId) {
                var parentTr = $("#" + proxy.model.progressbarTooltipTemplateId)[0].innerHTML;
            }
            else if (proxy.model.progressbarTooltipTemplate) {
                var parentTr = proxy.model.progressbarTooltipTemplate;
            }
            var templates = {};
            templates[proxy._id + "progressbarTooltipTemplate"] = parentTr;
            $.templates(templates);
        },


        //Template to create tooltip
        _createTooltipTemplate: function () {

            var proxy = this,
                td,
                columnHeaderTexts = proxy.model.columnHeaderTexts,
                durationUnitTexts = proxy.model.durationUnitTexts,
                helpers = {},
                templateId = proxy.model.tooltipTemplateId,
                template = proxy.model.tooltipTemplate;
            helpers["_" + proxy._id + "getStartDate"] = proxy._tooltipStartDate;
            helpers["_" + proxy._id + "getSubtaskStartDate"] = proxy._tooltipSubtaskStartDate;
            helpers["_" + proxy._id + "getScheduleStartDate"] = proxy._tooltipScheduleStartDate;
            helpers["_" + proxy._id + "getEndDate"] = proxy._tooltipEndDate;
            helpers["_" + proxy._id + "getSubtaskEndDate"] = proxy._tooltipSubtaskEndDate;
            helpers["_" + proxy._id + "getScheduleEndDate"] = proxy._tooltipScheduleEndDate;
            helpers["_" + proxy._id + "getTaskName"] = proxy._tooltipTaskName;
            helpers["_" + proxy._id + "getProgress"] = proxy._tooltipProgress;
            helpers["_" + proxy._id + "checkDuration"] = proxy._checkDuration;
            helpers["_" + proxy._id + "getDuration"] = $.proxy(proxy._tooltipDuration, proxy);
            $.views.helpers(helpers);

            if (templateId ) {
                var parentTr = $("#" + proxy.model.tooltipTemplateId)[0].innerHTML;
            }
            else if (proxy.model.tooltipTemplate ) {
                var parentTr = proxy.model.tooltipTemplate;
            }
           
            else {
                var parentTr = "<tr class='e-tooltip_rowcell'>";

                td = "{{if ~_" + proxy._id + "getTaskName()}}" +
                    "<td class='e-tooltiptaskname' style='width:40px;text-align:left;' colspan='3';>{{:ttiptaskname}}</td>{{/if}}" +
                    "</tr>" +
                    "{{if ~_" + proxy._id + "getStartDate()}}<tr>" +
                    "<td class='e-tooltiptd-alignleft' style='width:30px;white-space:nowrap;'>" + columnHeaderTexts["startDate"] + "</td>" +
                    "<td class='e-tooltiptd-aligncenter' style='width:10px;font-weight:bold;'>:</td>" +
                    "<td class='e-tooltiptd-alignright' style='width:30px;white-space:nowrap;'>{{:ttipstartDate}}</td> {{/if}}" +
                    "</tr>" +
                    "{{if ~_" + proxy._id + "getSubtaskStartDate()}}<tr>" +
                    "<td class='e-tooltiptd-alignleft' style='width:30px;white-space:nowrap;'>" + columnHeaderTexts["subTasksStartDate"] + "</td>" +
                    "<td class='e-tooltiptd-aligncenter' style='width:10px;font-weight:bold;'>:</td>" +
                    "<td class='e-tooltiptd-alignright' style='width:30px;white-space:nowrap;'>{{:ttipsubtaskStartDate}}</td></tr>{{/if}}" +

                    "{{if ~_" + proxy._id + "getScheduleStartDate()}}<tr>" +
                    "<td class='e-tooltiptd-alignleft' style='width:30px;white-space:nowrap;'>" + columnHeaderTexts["scheduleStartDate"] + "</td>" +
                    "<td class='e-tooltiptd-aligncenter' style='width:10px;font-weight:bold;'>:</td>" +
                    "<td class='e-tooltiptd-alignright' style='width:30px;white-space:nowrap;'>{{:ttipscheduleStartDate}}</td></tr>{{/if}}" +

                    "{{if ~_" + proxy._id + "getEndDate()}}<tr>" +
                    "<td class='e-tooltiptd-alignleft' style='width:30px;white-space:nowrap;'>" + columnHeaderTexts["endDate"] + "</td>" +
                    "<td class='e-tooltiptd-aligncenter' style='width:10px;font-weight:bold;'>:</td>" +
                    "<td class='e-tooltiptd-alignright' style='width:30px;white-space:nowrap;'>{{:ttipendDate}}</td>{{/if}}" +
                    "</tr>" +
                    "{{if ~_" + proxy._id + "getSubtaskEndDate()}}<tr>" +
                    "<td class='e-tooltiptd-alignleft' style='width:30px;white-space:nowrap;'>" + columnHeaderTexts["subTasksEndDate"] + "</td>" +
                    "<td class='e-tooltiptd-aligncenter' style='width:10px;font-weight:bold;'>:</td>" +
                    "<td class='e-tooltiptd-alignright' style='width:30px;white-space:nowrap;'>{{:ttipsubtaskEndDate}}</td></tr>{{/if}}" +

                    "{{if ~_" + proxy._id + "getScheduleEndDate()}}<tr>" +
                    "<td class='e-tooltiptd-alignleft' style='width:30px;white-space:nowrap;'>" + columnHeaderTexts["scheduleEndDate"] + "</td>" +
                    "<td class='e-tooltiptd-aligncenter' style='width:10px;font-weight:bold;'>:</td>" +
                    "<td class='e-tooltiptd-alignright' style='width:30px;white-space:nowrap;'>{{:ttipscheduleEndDate}}</td></tr>{{/if}}" +

                    "{{if ~_" + proxy._id + "checkDuration()}}<tr>" +
                    "<td class='e-tooltiptd-alignleft' style='width:30px;white-space:nowrap;'>" + columnHeaderTexts["duration"] + "</td>" +
                    "<td class='e-tooltiptd-aligncenter' style='width:10px;font-weight:bold;'>:</td>" +
                    "<td class='e-tooltiptd-alignright' style='width:30px;white-space:nowrap;'>{{:~_" + proxy._id + "getDuration(#data)}}</td>{{/if}}" +
                    "</tr>" +
                    "{{if ~_" + proxy._id + "getProgress()}}<tr>" +
                    "<td class='e-tooltiptd-alignleft' style='width:30px;white-space:nowrap;'>" + columnHeaderTexts["status"] + "</td>" +
                    "<td class='e-tooltiptd-aligncenter' style='width:10px;font-weight:bold;'>:</td>" +
                    "<td class='e-tooltiptd-alignright' style='width:30px;white-space:nowrap;'>{{:ttipprogress}}%</td>{{/if}}";

                parentTr += td;
                parentTr += "</tr>";
            }

            var templates = {};
            templates[proxy._id + "tooltipTemplate"] = parentTr;
            $.templates(templates);
        },

        _createPredecessorTooltipTemplate: function () {

            var proxy = this,
                model = proxy.model, td,
                helpers = {},
                tooltipText = model.connectorLineDialogText,
                template = model.predecessorTooltipTemplate;

            helpers["_" + proxy._id + "getFromTask"] = proxy._tooltipFromTask;
            helpers["_" + proxy._id + "getToTask"] = proxy._tooltipToTask;
            helpers["_" + proxy._id + "getOffsetValue"] = $.proxy(proxy._getOffsetValue, proxy);
            $.views.helpers(helpers);

            if (template) {
                if (template.charAt(0) == "#")
                    template = $(template)[0].innerHTML;
            }
            else {

                td = "{{if ~_" + proxy._id + "getFromTask()}}<tr>" +
                    "<td class='e-tooltiptd-alignleft' style='width:30px;white-space:nowrap;'>" + tooltipText.from + "</td>" +
                    "<td class='e-tooltiptd-aligncenter' style='width:10px;font-weight:bold;'>:</td>" +
                    "<td class='e-tooltiptd-alignright' style='width:30px;white-space:nowrap;'>{{:~_" + proxy._id + "getFromTask()}}</td></tr>" +
                    "{{/if}}" +

                    "{{if ~_" + proxy._id + "getToTask()}}<tr>" +
                    "<td class='e-tooltiptd-alignleft' style='width:30px;white-space:nowrap;'>" + tooltipText.to + "</td>" +
                    "<td class='e-tooltiptd-aligncenter' style='width:10px;font-weight:bold;'>:</td>" +
                    "<td class='e-tooltiptd-alignright' style='width:30px;white-space:nowrap;'>{{:~_" + proxy._id + "getToTask()}}</td></tr>" +
                    "{{/if}}" +

                    "<tr>" +
                    "<td class='e-tooltiptd-alignleft' style='width:30px;white-space:nowrap;'>" + tooltipText.taskLink + "</td>" +
                    "<td class='e-tooltiptd-aligncenter' style='width:10px;font-weight:bold;'>:</td>" +
                    "<td class='e-tooltiptd-alignright' style='width:30px;white-space:nowrap;'>{{:linkText}}</td>" +
                    "</tr>" +

                    "<tr>" +
                    "<td class='e-tooltiptd-alignleft' style='width:30px;white-space:nowrap;'>" + tooltipText.lag + "</td>" +
                    "<td class='e-tooltiptd-aligncenter' style='width:10px;font-weight:bold;'>:</td>" +
                    "<td class='e-tooltiptd-alignright' style='width:30px;white-space:nowrap;'>{{:~_" + proxy._id + "getOffsetValue(#data)}}</td></tr>";

                template += td;
            }

            var templates = {};
            templates[proxy._id + "predecessorTooltipTemplate"] = template;
            $.templates(templates);
        },
        /*check duration is available in tooltip item*/
        _checkDuration: function () {
            return this.data.ttipduration;
        },
        _tooltipTaskName: function () {
            return this.data.ttiptaskname;
        },

        _tooltipProgress: function () {
            return this.data.ttipprogress;
        },

        _tooltipStartDate: function () {
            return this.data.ttipstartDate;
        },

        _tooltipSubtaskStartDate: function () {
            return this.data.ttipsubtaskStartDate;
        },
        _tooltipScheduleStartDate: function () {
            return this.data.ttipscheduleStartDate;
        },

        _tooltipEndDate: function () {
            return this.data.ttipendDate;
        },

        _tooltipSubtaskEndDate: function () {
            return this.data.ttipsubtaskEndDate;
        },

        _tooltipScheduleEndDate: function () {
            return this.data.ttipscheduleEndDate;
        },
        _tooltipFromTask: function () {
            var data = this.data,
                id = ej.isNullOrUndefined(data.fromSno) ? data.fromId : data.fromSno,
                temp = data.fromName + " (" + id + ")";
            return temp;
        },
        _tooltipToTask: function () {
            var data = this.data,
                id = ej.isNullOrUndefined(data.toSno) ? data.toId : data.toSno,
                temp = data.toName + " (" + id + ")";
            return temp;
        },
        _getOffsetValue: function (data) {
            var proxy = this,
                offsetValue = {};
            offsetValue.ttipduration = data.offset;
            offsetValue.ttipdurationunit = data.offsetUnit;
            return proxy._tooltipDuration(offsetValue);
        },

        /*get localized text of duration value*/
        _tooltipDuration: function (data) {
            var val = "";
            if (data.ttipduration != null && data.ttipduration != undefined)
                val += parseFloat(data.ttipduration.toFixed(2)) + " ";
            if (data.ttipdurationunit != null && data.ttipdurationunit != undefined) {
                var multiple = data.ttipduration != 1;
                if (data.ttipdurationunit == "day")
                    val += multiple ? this.model.durationUnitTexts.days : this.model.durationUnitTexts.day;
                else if (data.ttipdurationunit == "hour")
                    val += multiple ? this.model.durationUnitTexts.hours : this.model.durationUnitTexts.hour;
                else
                    val += multiple ? this.model.durationUnitTexts.minutes : this.model.durationUnitTexts.minute;
            }
            return val;
        },

        _getDurationUnits: function (data) {
            var proxy = this;
            if (proxy.model.durationUnit == ej.Gantt.DurationUnit.Hour)
                return "hours";
            else if (proxy.model.durationUnit == ej.Gantt.DurationUnit.Minute)
                return "minutes";
            else
                return "days";

        },

        _cellClickHandler: function (e) {
            var $target = $(e.target),
                $row = $target.closest('tr.e-ganttrowcell'),
                proxy = this,
                model = this.model,
                args = {},
                selectedItem,
                index,
                rowIndex,
                div = $target[0],
                $ganttGridRows = proxy.getGanttChartRows(),
                taskItem;

            rowIndex = index = $ganttGridRows.index($target.parent());
            proxy._multiSelectCtrlRequest = e.ctrlKey;
            proxy._multiSelectShiftRequest = e.shiftKey;
            if (index == -1) {
                rowIndex = index = $ganttGridRows.index($row);
            }
            if (model.allowSelection && proxy._ganttTouchTrigger && model.selectionMode == "row" && model.selectionType == "multiple") {
                var args = {
                    target: $target,
                    ctrlKey: e.ctrlKey
                }
                proxy._trigger("getCtrlRequestValue", args);
                e.ctrlKey = args.ctrlKey;
            }
            if (model.viewType == "resourceView")
                taskItem = this.getRecordByTarget(e);
            if (($(div).hasClass("e-parentTask") || $(div).closest(".e-parentTask").length > 0) && !$target.hasClass("e-connectorpoint-left") && !$target.hasClass("e-connectorpoint-right") && (!e.ctrlKey && !e.shiftKey)) { // here check drag point class

                var currentRecordIndex = $ganttGridRows.index($row),
                    selectedItem = model.currentViewData[currentRecordIndex],
                recordIndex = model.updatedRecords.indexOf(selectedItem);
                if (proxy._allowExpandCollapse && selectedItem && selectedItem.hasChildRecords) {
                    /*cancel edited cell in treegrid on mouse down event on parent task bar*/
                    proxy._trigger("cancelEditCell");
                    //to deselect multiple selection while selecting already selected parent without ctrl key to perform expand collapse
                    if ((model.selectedRowIndex !== recordIndex && model.allowSelection && recordIndex !== -1 )|| (!proxy._multiSelectCtrlRequest && model.selectedRowIndex == recordIndex && model.selectionType == "multiple" )) {

                        if (!proxy._rowSelectingEventTrigger(model.selectedRowIndex, recordIndex)) {
                            proxy.selectRows(recordIndex);
                            proxy._rowSelectedEventTrigger(recordIndex);
                        }
                    }
                    proxy._expandCollapse(currentRecordIndex);
                    var args = {
                        requestType: "expandCollapse"
                    }
                    proxy._trigger("getCtrlRequestValue", args);
                }
            }
            else if (index != -1 && model.allowSelection) {
                selectedItem = model.currentViewData[index];
                index = model.updatedRecords.indexOf(selectedItem);
                if (model.selectionMode == "row") {                    
                if (proxy._rowSelectingEventTrigger(model.selectedRowIndex, index))
                    return;
                    if (model.selectionType == ej.Gantt.SelectionType.Multiple) {                        
                        if (e.shiftKey && model.allowSelection == true) {                     
                            if (proxy._prevSelectedItem != null && proxy._getExpandStatus(proxy._prevSelectedItem)) {                               
                                proxy.selectRows(model.updatedRecords.indexOf(proxy._prevSelectedItem), index);
                            }
                            else if (proxy._prevSelectedItem == null) {
                                proxy.selectRows(0, index);
                            }
                            proxy._rowSelectedEventTrigger(index, !ej.isNullOrUndefined(proxy._prevSelectedItem) ? model.updatedRecords.indexOf(proxy._prevSelectedItem) : 0);
                        }                        
                    }
                    if (!e.shiftKey) {
                        proxy.selectRows(index);
                        proxy._rowSelectedEventTrigger(index);
                    }
                    proxy.focusGanttElement();
                }
                if (model.selectionMode == "cell")
                    proxy.model.selectedItem = selectedItem;
                if (model.viewType == ej.Gantt.ViewType.ResourceView && taskItem && (taskItem.eResourceTaskType == "unassignedTask" || taskItem.eResourceTaskType =="resourceChildTask")) {
                    //task bar selection for resource view gantt
                    this.selectTaskbar(taskItem);
                }
            }
            if (model.taskbarClick) {
                if (!$target.is(".e-childContainer,.e-gantt-milestone-container,.e-parentContainer")) {
                    var taskElement = $target.closest(".e-childContainer,.e-gantt-milestone-container,.e-parentContainer");
                    if (taskElement.length) {
                        var args = {}, data;
                        data = model.viewType == "resourceView" ? taskItem : model.currentViewData[rowIndex];
                        rowIndex = model.updatedRecords.indexOf(data);
                        args.data = data;
                        args.index = rowIndex;
                        args.taskbarElement = taskElement[0];
                        args.target = $target[0];
                        this._trigger("taskbarClick", args);
                    }
                }
            }
        },

        getRowByIndex: function (from, to) {
            try {
                var proxy = this;

                var gridRows = proxy.getGanttChartRows(),
                    $gridRows = $(gridRows),
                    $row = $();

                if (proxy.model.enableVirtualization) {
                    var recordstart = proxy.model.updatedRecords[from];
                    from = proxy.model.currentViewData.indexOf(recordstart);
                }

                if (ej.isNullOrUndefined(to)) {
                    if (proxy.model.enableVirtualization) {
                        var recordend = proxy.model.updatedRecords[to];
                        to = proxy.model.currentViewData.indexOf(recordend);
                    }
                    return $(gridRows[from]);
                } else {
                    return $($gridRows.slice(from, to));
                }
            } catch (e) {
                return $();
            }
        },

        /*Method to select resoyrce child task or unassigned task in resoure view*/
        selectTaskbar: function (item) {
            var model = this.model,
                resourceTask, rowIndex = -1,
                itemIndex = 0,
                row;
                if (model.viewType == "resourceView" && (item.eResourceTaskType == "resourceChildTask" || item.eResourceTaskType == "unassignedTask")) {
                if (item.eResourceTaskType == "resourceChildTask" && item.parentItem) {
                    resourceTask = item.parentItem;
                    rowIndex = model.updatedRecords.indexOf(resourceTask);
                    itemIndex = resourceTask.eResourceChildTasks.indexOf(item);
                }
                else {
                    rowIndex = model.updatedRecords.indexOf(item);
                }
                if (rowIndex != -1) {
                    row = this.getRowByIndex(rowIndex);
                    this.element.find(".e-gantt-taskbarSelection").removeClass("e-gantt-taskbarSelection");
                    $(row.find(".e-childContainer")[itemIndex]).addClass("e-gantt-taskbarSelection");
                }
            }
        },
        _applySelection: function (index) {
            if (index == -1)
                return;
            var proxy = this, model = proxy.model,
                $row = proxy.getRowByIndex(index),
            currentRecord = model.updatedRecords[index];
            currentRecord.isSelected = true;
            model.selectedItems.push(currentRecord);
            $row.addClass("e-gantt-mouseclick");
            model.selectedItem = model.updatedRecords[index];
            model.selectedRowIndex = index;
        },

        selectRows: function (index, toIndex) {
            var proxy = this,
                model = this.model,
                $ganttGridRows = proxy.getGanttChartRows(),
                selectedItem;
            if (!model.allowSelection || model.selectionMode == "cell")
                return;
            if (model.selectionType == ej.Gantt.SelectionType.Multiple && !ej.isNullOrUndefined(index) && !ej.isNullOrUndefined(toIndex)) {
                proxy.clearSelection(-1);               
                var records = index - toIndex < 0 ? model.updatedRecords.slice(index, toIndex + 1) : model.updatedRecords.slice(toIndex, index + 1);
                for (var count = 0; count < records.length; count++) {
                    if (proxy._getExpandStatus(records[count])) {                       
                        var updatedRowIndex = model.updatedRecords.indexOf(records[count]);
                        proxy._applySelection(updatedRowIndex);                       
                    }
                }
            }
            else {
                switch (model.selectionType) {
                    case ej.Gantt.SelectionType.Multiple:
                        if (proxy._multiSelectCtrlRequest && index != -1) {
                            proxy._prevSelectedItem = model.updatedRecords[index];
                            proxy._shiftSelectedRecord = null;
                            var selectedRowIndex = $.inArray(model.updatedRecords[index], model.selectedItems);                           
                            if (selectedRowIndex != -1) {
                                proxy.clearSelection(index);
                            }
                            if (selectedRowIndex == -1) {
                                proxy._applySelection(index);                                
                            }
                            break;
                        }
                    case ej.Gantt.SelectionType.Single:                        
                        if (proxy._prevSelectedItem) {
                            proxy._prevSelectedItem.isSelected = false;
                        }
                        proxy.clearSelection(-1);                      
                        proxy._applySelection(index);
                        proxy._prevSelectedItem = model.selectedItem;
                        proxy._shiftSelectedRecord = null;
                }
            }
            if (model.selectedItems.length == 0 && model.selectedRowIndex != -1)
                model.selectedRowIndex = -1
        },

        updateSelectedItem: function (recordIndex) {
            var proxy = this,
                $ganttGridRows = $(proxy.getGanttChartRows());

            $ganttGridRows.removeClass("e-gantt-mouseclick");
            proxy.model.updatedRecords[recordIndex].isSelected = true;
            proxy.model.selectedItem = proxy.model.updatedRecords[recordIndex];
            this._refresh();
            proxy._rowSelectedEventTrigger(recordIndex);

        },

        _getRecordTopPosition: function (records, index) {
            var position = {}, height = 0, model = this.model;
            if (this.model.viewType == "resourceView") {

                for (var i = 0; i <= index; i++) {
                    if (i == index)
                        position.bottom = height + this._getTemplateRowHeight(records[i]);
                    else
                        height += this._getTemplateRowHeight(records[i]);
                }
                position.top = height;
            } else {
                position.top = index * model.rowHeight;
                position.bottom = position.top + model.rowHeight;
            }
            return position;
        },
        /*Get Total height based on resource child records*/
        _getHeightforResourceView: function (records) {
            var height = 0;
            for (var i = 0; i < records.length; i++) {
                height += this._getTemplateRowHeight(records[i]);
            }
            return height;
        },
        //Get records height based on resource view and normal view
        getRecordsHeight: function () {
            var model = this.model,
                height = 0;
            if (model.viewType == "resourceView") {
                if (model.enableVirtualization)
                    height = this._getHeightforResourceView(model.updatedRecords);
                else
                    height = this._getHeightforResourceView(this.getExpandedRecords(model.updatedRecords));
            } else if (model.enableVirtualization) {
                height = model.updatedRecords.length * model.rowHeight;
            } else {
                height = model.rowHeight * (model.updatedRecords.length - this.getCollapsedRecordCount());
            }
            return height;
        },

        updateHeight: function (height) {
            var proxy = this,
                model = proxy.model;
            proxy._setScrollTop();
            proxy._containerHeight = height;
            $("#ganttviewerbodyContent" + proxy._id + "").css({
                 "height": proxy._containerHeight + "px"
            });

            if (model.stripLines) {
                $(proxy.element).find(".e-stripline,.e-stripLines").css({ height: height + "px" });
            }

            if (model.holidays) {
                $(proxy.element).find(".e-holidays,.e-holiday").css({ height: height + "px" });
            }
            $(".e-secondary_canvas").css({ height: height + "px" });
            $(proxy.element).find(".e-weekends").css({ height: height + "px" });

            var holidayLableSelector = ".e-holiday-label";
            /* for rotate holiday lable in ie8 */
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 9) {
                holidayLableSelector = ".e-holiday-label-ie8";
            }

            if (height < proxy._viewportHeight) {
                if (height <= model.rowHeight) {
                    $(proxy.element).find(holidayLableSelector).css({ top: -height - 30 });
                }
                else
                    $(proxy.element).find(holidayLableSelector).css({ top: height / 2 });
            }
            else
                $(proxy.element).find(holidayLableSelector).css({ top: proxy._viewportHeight / 2 });
            
            //To enable the Horizontal scroller when all the records were deleted
            if (height == 0) {
                proxy._$bodyContent.css({ "height": "1px" });
            }
            proxy._$bodyContainer.ejScroller("refresh");

            /*While refreshing scroller the gantt chart container height is increased by 16px.
             When horizontal scrollbar not avaiable in gantt chart side.
             So check the chart container height and view port height.
             If it is varies set the view port height to chart container height*/
            if(parseInt(proxy._$bodyContainer.css("height")) != proxy._viewportHeight)
                proxy._$bodyContainer.css("height", proxy._viewportHeight);
        },


        //method to trigger actioncomplete event
        _completeAction: function (args) {
            var proxy = this;
            args.vscrollExsist = proxy._$bodyContainer.ejScroller("isVScroll");
            proxy._trigger("actionComplete", args);
            if (args.requestType === "validatePredecessor") {
                return args.predecessorValidation;
            }
        },


        //method to trigger taskbarediting event
        //to apply changes during taskbar editing
        _taskbarEditing: function (args) {
            var proxy = this;
            proxy._trigger("taskbarEditing", args);
        },


        //method to trigger taskbaredited event
        //to apply changes after taskbar edited
        _taskbarEdited: function (args) {
            var proxy = this;
            proxy._trigger("taskbarEdited", args);
        },


        //method to trigger querytaskbarinfo 
        //to apply changes at load time
        _queryTaskbarinfo: function (args, taskbarContainer) {
            this._trigger("queryTaskbarInfo", args);
            this._updateTaskbarItems(args, taskbarContainer);
        },


        //method to trigger refresh row
        _refreshRow: function (args) {
            var proxy = this;
            proxy._trigger("refreshRow", args);
        },

        _updateManualTaskbarItem: function(args, taskElement){

            var parentTaskbar = taskElement.querySelector(".e-gantt-parenttaskbar-innerdiv"),
                        parentProgressbar = taskElement.querySelector(".e-gantt-parenttaskbar-progress"),
                        parentOuterTaskbar = taskElement.querySelector(".e-gantt-manualparenttaskbar"),
                        parentLeftOuterTaskbar = taskElement.querySelector(".e-gantt-manualparenttaskbar-left"),
                        parentRightOuterTaskbar = taskElement.querySelector(".e-gantt-manualparenttaskbar-right"),
                        parentRightResizer = taskElement.querySelector(".e-taskbarresizer-right"),
                        parentTaskbarStyle = parentTaskbar.style,
                        parentProgressbarStyle = parentProgressbar && parentProgressbar.style,
                        parentOuterTaskbarStyle = parentOuterTaskbar && parentOuterTaskbar.style,
                        parentLeftOuterTaskbarStyle = parentLeftOuterTaskbar && parentLeftOuterTaskbar.style,
                        parentRightOuterTaskbarStyle = parentRightOuterTaskbar && parentRightOuterTaskbar.style,
                        parentRightResizerStyle = parentRightResizer && parentRightResizer.style,
                        model = this.model;

            var taskbarHeight, tHeight;
            if (model.renderBaseline) {
                taskbarHeight = model.taskbarHeight - 9;
            } else {
                taskbarHeight = model.taskbarHeight - 10;
            }
            tHeight = taskbarHeight / 5;                                                          
            
            if (!ej.isNullOrUndefined(args.manualParentTaskbarBackground) && parentOuterTaskbarStyle.backgroundColor != args.manualParentTaskbarBackground) {
                parentOuterTaskbarStyle.backgroundColor = args.manualParentTaskbarBackground;
                parentLeftOuterTaskbarStyle.borderColor = args.manualParentTaskbarBackground;
                parentRightOuterTaskbarStyle.borderColor = args.manualParentTaskbarBackground;
            }
            parentOuterTaskbarStyle.width = args.data.width + "px";
            parentOuterTaskbarStyle.left = args.data.left + "px";
            parentRightOuterTaskbarStyle.left = (args.data.width - parseInt(tHeight)) + "px";
            parentRightResizerStyle.left = (args.data.width - parseInt(tHeight)) + "px";            
                      
            if (args.data.width == args.data.manualWidth && args.data.left == args.data.manualLeft) {
                parentProgressbarStyle.width = args.data.progressWidth - (tHeight * 2) + "px";
                parentTaskbarStyle.width = args.data.manualWidth - (tHeight * 2) + "px";
                parentTaskbarStyle.left = args.data.manualLeft + tHeight + "px";
            }
            else if (args.data.left == args.data.manualLeft) {
                parentTaskbarStyle.left = args.data.manualLeft + tHeight + "px";
                parentProgressbarStyle.width = args.data.progressWidth - (tHeight) + "px";
                parentTaskbarStyle.width = args.data.manualWidth - (tHeight) + "px";
            }
            else {
                parentProgressbarStyle.width = args.data.progressWidth + "px";
                parentTaskbarStyle.width = args.data.manualWidth + "px";
                parentTaskbarStyle.left = args.data.manualLeft + "px";
            }
        },
        //Updates taskbar items styles when chart loads
        _updateTaskbarItems: function (args, taskbarContainer) {

            var taskElement, mileStone, baseline,baselineMileStone;

            if (taskbarContainer) {
                             
                if ($(taskbarContainer).hasClass("e-gantt-milestone-container"))
                    mileStone = $(taskbarContainer).closest('div')[0];

                if ($(taskbarContainer).next().hasClass("e-baseline-gantt-milestone-container"))
                    baselineMileStone = $(taskbarContainer).next().find(".e-baseline-gantt-milestone").closest('div')[0];

                if ($(taskbarContainer).next().hasClass("e-baselinebar"))
                    baseline = $(taskbarContainer).next().closest('div')[0];

                if ($(taskbarContainer).hasClass("e-parentContainer")) {
                    var taskElement = $(taskbarContainer).closest('div')[0],
                        parentTaskbar = taskElement.querySelector(".e-gantt-parenttaskbar-innerdiv"),
                        parentProgressbar = taskElement.querySelector(".e-gantt-parenttaskbar-progress"),
                        parentTaskbarStyle = parentTaskbar.style,
                        parentProgressbarStyle = parentProgressbar && parentProgressbar.style;

                    if (parentTaskbarStyle.backgroundColor != args.parentTaskbarBackground) {
                        parentTaskbarStyle.backgroundColor = args.parentTaskbarBackground;
                    }
                    if (parentProgressbarStyle && parentProgressbarStyle.backgroundColor != args.parentProgressbarBackground) {
                        parentProgressbarStyle.backgroundColor = args.parentProgressbarBackground;
                    }
                    if (parentTaskbarStyle.borderColor != args.parentTaskbarBorder) {
                        parentTaskbarStyle.borderColor = args.parentTaskbarBorder;
                    }
                    if (parentProgressbarStyle && parentProgressbarStyle.borderColor != args.parentProgressbarBorder) {
                        parentProgressbarStyle.borderColor = args.parentProgressbarBorder;
                    }
                    if (!args.data.isAutoSchedule && args.data.hasChildRecords) {                                                                        
                        this._updateManualTaskbarItem(args, taskElement);                        
                    }
                    if (parentProgressbarStyle && parentProgressbarStyle.borderColor != args.parentProgressbarBorder) {
                        parentProgressbarStyle.borderColor = args.parentProgressbarBorder;
                    }

                } else if ($(taskbarContainer).hasClass("e-childContainer")) {
                    var taskElement = $(taskbarContainer).closest('div')[0],
                        taskbar = taskElement.querySelector(".e-gantt-childtaskbar"),
                        progressbar = taskElement.querySelector(".e-gantt-childtaskbar-progress"),
                        taskbarStyle = taskbar.style,
                        progressbarStyle = progressbar && progressbar.style,
                        taskbarLabel = progressbar && progressbar.querySelector(".e-tasklabel"),
                        taskbarText = taskbarLabel && taskbarLabel.style;

                    if (taskbarStyle.backgroundColor != args.taskbarBackground) {
                        taskbarStyle.backgroundColor = args.taskbarBackground;
                    }
                    if (progressbar && progressbarStyle.backgroundColor != args.progressbarBackground) {
                        progressbarStyle.backgroundColor = args.progressbarBackground;
                    }
                    if (taskbarStyle.borderColor != args.taskbarBorder) {
                        taskbarStyle.borderColor = args.taskbarBorder;
                    }
                    if (progressbar && progressbarStyle.borderColor != args.progressbarBorder) {
                        progressbarStyle.borderColor = args.progressbarBorder;
                    }
                    if (taskbarText && taskbarText.color != args.taskbarTextColor) {
                        taskbarText.color = args.taskbarTextColor;
                    }
                }

                if ($(mileStone).length > 0) {
                    var milestoneTop = mileStone.querySelector(".e-gantt-milestone.e-milestone-top"),
                        milestoneBottom = mileStone.querySelector(".e-gantt-milestone.e-milestone-bottom");
                    if (milestoneTop && milestoneBottom) {
                        var milestonetopStyle = milestoneTop.style,
                            milestonebottomStyle = milestoneBottom.style;
                        if (milestonebottomStyle.borderBottomColor != args.milestoneBackground && milestonetopStyle.borderTopColor != args.milestoneBackground) {
                            milestonebottomStyle.borderTopColor = args.milestoneBackground;
                            milestonetopStyle.borderBottomColor = args.milestoneBackground;
                        }
                    }
                    else if(this.model.milestoneTemplate)
                    {
                        var milestoneContainer = mileStone.querySelector(".e-gantt-milestone");
                        if (milestoneContainer.style.backgroundColor != args.milestoneBackground)
                            milestoneContainer.style.backgroundColor = args.milestoneBackground;
                    }
                }
                if ($(baseline).hasClass("e-baselinebar")) {
                    var baselineStyle = baseline.style;
                    if (baselineStyle.backgroundColor != args.baselineBackground) {
                        baselineStyle.backgroundColor = args.baselineBackground;
                    }
                    }
                if ($(baselineMileStone).hasClass("e-baseline-gantt-milestone")) {
                    var baselineTop = baselineMileStone.querySelector(".e-baseline-milestone-top"),
                   baselineBottom = baselineMileStone.querySelector(".e-baseline-milestone-bottom");
                    if (baselineTop && baselineBottom) {
                        var topStyle = baselineTop.style,
                            bottomStyle = baselineBottom.style;
                        if (bottomStyle.borderTopColor != args.baselineBackground && topStyle.borderBottomColor != args.baselineBackground) {
                            bottomStyle.borderTopColor = args.baselineBackground;
                            topStyle.borderBottomColor = args.baselineBackground;
                        }
                    }
                }
            }
        },

        //to perform expand collapse operation from ganttchart
        _expandCollapse: function (recordIndex) {

            var proxy = this,
                args = {},
                data = proxy.model.currentViewData[recordIndex];

            args.data = data;
            args.recordIndex = proxy.model.updatedRecords && proxy.model.updatedRecords.indexOf(data);
            args.source = "ganttChart";
            args.expanded = !data.expanded;
            if (data) {
                if (!args.expanded) {
                    proxy._trigger("collapsing", args);
                }
                else {
                    proxy._trigger("expanding", args);
                }
            }
        },


        //get the Expand status of GridRecord
        _getExpandStatus: function (record) {
            var parentRecord = record.parentItem;
            if (parentRecord != null) {
                if (parentRecord.expanded === false)
                    return false;
                else if (parentRecord.parentItem) {
                    if (parentRecord.parentItem.expanded === false)
                        return false;
                    else
                        return this._getExpandStatus(parentRecord.parentItem);
                }
                else
                    return true;
            } else
                return true;
        },



        //method to scroll ganttchart from gridtree scroll event       
        onScrollHelper: function (scrollTop, fromChartScroller) {

            var proxy = this;
			if (!proxy._$bodyContainer.ejScroller("isVScroll"))
			{
                return false;
            }
			proxy._mouseLeave();
			proxy.closePredecessorDialog();
			if (!fromChartScroller)
			    proxy._$bodyContainer.ejScroller("option", "scrollTop", scrollTop);
			var rowHeight = proxy.model.rowHeight;
			if ($("#" + this._$ganttViewTablebody[0].id).find("tr:first")[0])
			    rowHeight = $("#" + this._$ganttViewTablebody[0].id).find("tr:first")[0].getBoundingClientRect().height;
			var h = parseInt(this.getRecordsHeight()) - (proxy._viewportHeight - 18); //proxy.model.
            

            if (scrollTop > h) {
                scrollTop = h;
            }

            if (scrollTop < 0) {
                scrollTop = 0;
            }

            var args = { scrollTop: scrollTop };

            proxy._handleScroll(args);
            
            //var div = $("#ganttviewerbodyContianer" + this._id);
            //div.scrollTop(scrollTop);
            if (this.model.isCriticalPathEnable == true && this.model.enableVirtualization == true) {
                this.criticalConnectorLine(this.model.criticalPathCollection, this.model.detailPredecessorCollection, true, this.collectionTaskId);
            }
        },

        //Handler for scroll event from ganttchart
        _handleScroll: function (args) {

            var proxy = this,
                args =args|| {},
                headerdiv = proxy._$headerContainer;

            
            if (args.scrollTop !== undefined) {
                proxy._scrollTop = args.scrollTop;
            }

            if (args.scrollLeft !== undefined) {
                proxy._scrollLeft = args.scrollLeft;
            }
            var diff = (proxy._scrollLeft - proxy._prevLeft),
                vDiff = proxy._scrollTop - proxy._prevScrollTop;

            if (diff) {
                headerdiv.scrollLeft(proxy._scrollLeft);
            }
            else {
                headerdiv.scrollLeft(proxy._prevLeft);
            }

            if (proxy.model.enableVirtualization) {
                proxy._vscrollDist = Math.abs(proxy._scrollTop - proxy._prevScrollTop);
                if (proxy._vscrollDist) {
                    proxy._vScrollDir = proxy._prevScrollTop <= proxy._scrollTop ? 1 : -1;
                        proxy._updateCurrentViewData();

                    proxy.renderGanttRecords();
                    proxy._prevScrollTop = proxy._scrollTop;
                }
            }
            args.requestType = "scroll";
            args.delta = proxy._scrollTop;
            proxy._prevLeft = proxy._scrollLeft;
            proxy._prevScrollTop = proxy._scrollTop;
            if (diff === 0 && vDiff !== 0) {
                proxy._completeAction(args);
            }
        },


        //helper method to refresh the ganttchart content from gantt
        refreshHelper: function (currentviewdata, records,collapseRecordsCount) {

            var proxy = this;
            proxy.model.currentViewData = currentviewdata;
            proxy.model.updatedRecords = records;
            if (collapseRecordsCount != undefined)
                proxy._totalCollapsedRecordCount = collapseRecordsCount;
            else
                proxy._totalCollapsedRecordCount = 0;

            if (records) {
                proxy._refresh();
                proxy._setHeight(this.getRecordsHeight());
                proxy.updateHeight(proxy._containerHeight);
            }
        },
        _setScrollTop: function () {
            var proxy = this,
            model = this.model,
            top = proxy._scrollTop,
            recordsHeight;
            if (model.viewType == "resourceView")
                recordsHeight = this._getHeightforResourceView(model.currentViewData);
            else
                recordsHeight = model.currentViewData.length * model.rowHeight;

            if (model.enableVirtualization && top!==0) {
                if (recordsHeight < proxy._viewportHeight) {
                    var currentPosition = top - (proxy._viewportHeight - recordsHeight);
                    if (currentPosition < 0)
                        currentPosition = 0;
                    proxy._$bodyContainer.ejScroller("scrollY", currentPosition, true);
                }
            }
        },
  
        refreshGridLinesTable:function(length)
        {
            var proxy = this;
                proxy._$gridLinesTablebody.empty().append(proxy._createGridLinesTableRow(length));
                proxy._$bodyContainer.ejScroller("refresh");

                /*While refreshing scroller the gantt chart container height is increased by 16px.
                When horizontal scrollbar not avaiable in gantt chart side.
                So check the chart container height and view port height.
                If it is varies set the view port height to chart container height*/
                if (parseInt(proxy._$bodyContainer.css("height")) != proxy._viewportHeight)
                    proxy._$bodyContainer.css("height", proxy._viewportHeight);
        },
        //to refresh the content of the ganttchart
        _refresh: function () {

            var proxy = this, model = proxy.model,
                data = $.render[proxy._id + "_CustomTemplate2"](proxy.model.currentViewData);

            proxy._$ganttViewTablebody = $("#ganttViewTablebody" + proxy._id + "");

            proxy._$ganttViewTablebody.empty().append(data);

            //var $gridLinesTablebody = $("#gridLinesTablebody" + proxy._id + "");
            
            if (model.enableVirtualization) {
                proxy._$gridLinesTablebody.empty().append(proxy._createGridLinesTableRow(proxy.model.currentViewData.length));
            }
            else {
                proxy._$gridLinesTablebody.empty().append(proxy._createGridLinesTableRow(proxy.model.currentViewData.length - proxy._totalCollapsedRecordCount));
            }


            if (proxy._$ganttViewTablebody[0] != null) {
                this._ganttChartRows = $(proxy._$ganttViewTablebody[0].childNodes);
            }
            else {
                proxy._$ganttViewTablebody = ej.buildTag("tbody.e-gantt-viewer-ganttViewTablebody#ganttViewTablebody" + proxy._id + "",
                    data, {}, {});
                proxy._ganttChartRows = $(proxy._$ganttViewTablebody[0].childNodes);
            }
            if(model.queryTaskbarInfo)
                proxy._eventBindings();

        },


        //to rerender a particular ganttchart row
        refreshRow: function (index) {

            var proxy = this, model = this.model,
                $tr = $(proxy.getGanttChartRows()[index]),
                selectedItem = proxy.model.currentViewData[index],
                isResourceView = model.viewType == "resourceView" ? true : false,
                $gridLineTr, clIndex;
            if (isResourceView && selectedItem) {
                clIndex = model.enableVirtualization ? index : this.getExpandedRecords(this.model.updatedRecords).indexOf(selectedItem);
                $gridLineTr = $(this._$gridLinesTablebody[0].childNodes[clIndex])
            }
            
            if (!model.allowSelection && selectedItem)
                selectedItem.isSelected = false;
            if (index != -1 && selectedItem) {
                $tr.replaceWith($.render[proxy._id + "_CustomTemplate2"](selectedItem));
                proxy._setGanttChartRows($(proxy._$ganttViewTablebody[0].childNodes));
                if (isResourceView)
                    $gridLineTr.height(this._getTemplateRowHeight(selectedItem));
            }
            if (model.queryTaskbarInfo)
                proxy._refreshedRowEventBinding(index);

        },


        //Trigger queryTaskbarInfo while refresh the row
        _refreshedRowEventBinding: function (index)
        {
            var $ganttChartRows = $(this.getGanttChartRows()),
                taskbarContainer = $ganttChartRows[index],
                currentTask = this.model.currentViewData[index],
                allTaskElement, taskElement,
                args = {};

            args.taskbar = taskbarContainer;
            if ($(taskbarContainer).hasClass("e-ganttrowcell")) {
                allTaskElement = $(taskbarContainer).find("div.e-childContainer,div.e-parentContainer,div.e-gantt-milestone");
                if ($(allTaskElement).length > 0 && currentTask.eResourceTaskType == "resourceTask") {
                    for (var count = 0; count < $(allTaskElement).length; count++) {
                        taskElement = $(allTaskElement)[count];
                        args.data = currentTask.eResourceChildTasks[count];
                        this._prepareQueryTaskbar(taskElement, args)
                    }
                } else {
                    args.data = currentTask;
                    this._prepareQueryTaskbar(allTaskElement, args)
                }
            }
        },
        //REFRESH THE SCROLLER FOR TREEGRIDCONTENT
        refreshScroller: function (panSize) {

            var proxy = this,maxScrollWidth;
            //proxy._$gridContent.css({'width':panSize+"px"});
            proxy._$bodyContainer.find("div.e-content").removeClass("e-borderbox");
            var scrollTop = proxy._$bodyContainer.ejScroller("option", "scrollTop");
            var scrollLeft = proxy._$bodyContainer.ejScroller("option", "scrollLeft");
            proxy._$bodyContainer.ejScroller("option", { "width": panSize });
            proxy._$bodyContainer.ejScroller("refresh");
            maxScrollWidth=proxy.getMaxScrollWidth();
            
            if (scrollLeft > maxScrollWidth)
                scrollLeft = maxScrollWidth > 0 ? maxScrollWidth : 0;
            var isVerticalScroll = proxy._$bodyContainer.ejScroller("isVScroll");
            if (isVerticalScroll) {
                proxy._$bodyContainer.ejScroller("scrollY", scrollTop, true);
            }
            proxy._$bodyContainer.ejScroller("option", "scrollLeft", scrollLeft);
            proxy._$headerContainer.scrollLeft(scrollLeft);

        },
        getMaxScrollWidth:function()
        {
            var proxy = this;
            return proxy._$bodyContainer.children(".e-content").children().width() - proxy._$bodyContainer.children(".e-content").width();
        },

        /* refresh stripLines Collection*/
        refreshStripLines:function (stripLines)
        {
            var proxy = this;
            if (stripLines) {
                this.model.stripLines = stripLines;
            }
            proxy._$stripLineContainer.empty();
            this._renderStripLines(this.model.stripLines);

        },
        /* refresh holidays Collection*/
        refreshHolidays: function (holidays) {
            //Display Holidays
            var proxy = this;
            if (holidays) {
                proxy.model.holidays = holidays
            }
            proxy._$secondaryCanvas.empty();
            if (proxy.model.holidays != null) {
                var holidayCount = proxy.model.holidays.length;
                for (var i = 0; i < holidayCount; i++) {
                    proxy._renderHoliday(proxy.model.holidays[i]);
                }
            }
        },

        //insert new record in DOM 
        renderNewAddedRow:function(index, data)
        {
            var proxy = this, model = proxy.model,
            addedchartRow = $.render[this._id + "_CustomTemplate2"](data);
            if (proxy._ganttChartRows.length != 0) {
                if (proxy._ganttChartRows.length == index) {
                    proxy.getGanttChartRows().eq(index - 1).after(addedchartRow);
                } else {
                    proxy.getGanttChartRows().eq(index).before(addedchartRow);
                }
            } else {
                proxy._refresh();
            }
            proxy._setGanttChartRows($(proxy._$ganttViewTablebody[0].childNodes));
            proxy._$gridLinesTablebody.empty().append(proxy._createGridLinesTableRow(proxy.model.updatedRecords.length - proxy._totalCollapsedRecordCount));
            proxy._setHeight(this.getRecordsHeight());
            proxy.updateHeight(proxy._containerHeight);

        },

        _setGanttChartRows: function (value) {
            this._ganttChartRows = value;
        },

        //update all containers width
        refreshContainersWidth:function()
        {
            var proxy = this,
                width, model = this.model,
                scheduleMode = model.scheduleHeaderSettings.scheduleHeaderType;
            width = proxy._getScheduleLength(scheduleMode);
            var $gridLineContainerTable=$("#ganttgridLinesTable" + proxy._id);

            proxy._$bodyContent.width(width);//main body container
            proxy.refreshWeekEndContainer();//weekENd Container
            $gridLineContainerTable.width(width);
            $gridLineContainerTable.children("col").width(width);
            proxy._$ganttViewTable.width(width);
            proxy._$ganttViewTable.children("col").width(width);
            proxy._createChartTaskbarTemplate();
            proxy._updateCurrentViewData();
            proxy._$secondaryCanvas.empty();
            proxy._$stripLineContainer.empty();
            if (proxy.model.stripLines != null) {
                this._renderStripLines(proxy.model.stripLines);
            }
            if (proxy.model.holidays != null) {
                var holidayCount = proxy.model.holidays.length;
                for (var i = 0; i < holidayCount; i++) {
                    proxy._renderHoliday(proxy.model.holidays[i]);
                }
            }
        },
        //refresh week ends when schedule dates changes
        refreshWeekEndContainer:function()
        {
            var proxy = this,
                model = proxy.model,
                left = 0,
                width = (proxy.model.perDayWidth) + 1,
                height = ((proxy.model.updatedRecords.length) * this.model.rowHeight),
                count = proxy.model.scheduleWeeks.length, $day,
                weekStartDay = model.scheduleHeaderSettings.weekStartDay,
                dayIndex = (weekStartDay >= 0 && weekStartDay < 7) ? weekStartDay : 0,
                saturdayIndex = 6 - dayIndex,
                $weekendContainer = proxy._$weekendsContainer.children('.e-secondary_canvas'),
                nonWorkDayLength = proxy._nonWorkingDayIndex.length;
            $weekendContainer.empty();
            for (var i = 0; i < count; i++) {
                var weeDayIndex;
                for (var j = 0; j < nonWorkDayLength; j++) {
                    if (proxy._nonWorkingDayIndex[j] != 6) {
                        var index = (saturdayIndex + proxy._nonWorkingDayIndex[j] + 1);
                        weeDayIndex = (index >= 7 ? proxy._nonWorkingDayIndex[j] - dayIndex : index);
                    }
                    else
                        weeDayIndex = saturdayIndex;
                    $day = ej.buildTag("div.e-weekends", "", {
                        'left': (left + (proxy.model.perDayWidth * weeDayIndex)) + 'px',
                        'width': width + 'px',
                        'height': height + 'px',
                        'background-color': this.model.weekendBackground
                    }, {});
                    $weekendContainer.append($day);
                }
                left = left + this._scheduleWeekWidth;
            }
            proxy._$weekendsContainer.append($weekendContainer);
        },

        //delete gantt chart rows without rerendering of whole page
        deleteChartRows: function (startIndex, count) {
            var proxy = this;
            var $chartRows = proxy.getGanttChartRows();
            for (var i = startIndex; i < startIndex + count; i++) {
                $chartRows.splice(i, 1);
            }
        },

        _prepareQueryTaskbar: function (element, args) {

            var taskbarContainer  = $(element)[0],
                mileStone, baseline, baselineMileStone, parentTaskbar, parentProgressbar,
                manualParentTaskbar, progressbar, taskbarText, taskbar;

            if ($(taskbarContainer).hasClass("e-gantt-milestone-container"))
                mileStone = $(taskbarContainer).find('.e-gantt-milestone.e-milestone-top')[0];

            if ($(taskbarContainer).next().hasClass("e-baselinebar"))
                baseline = $(taskbarContainer).next().closest('div')[0];

            if ($(taskbarContainer).next().hasClass("e-baseline-gantt-milestone-container"))
                baselineMileStone = $(taskbarContainer).next().find(".e-baseline-gantt-milestone").closest('div')[0];

            if ($(taskbarContainer).hasClass("e-parentContainer")) {
                parentTaskbar = taskbarContainer.querySelector(".e-gantt-parenttaskbar-innerdiv");
                parentProgressbar = taskbarContainer.querySelector(".e-gantt-parenttaskbar-progress");
                manualParentTaskbar = taskbarContainer.querySelector(".e-gantt-manualparenttaskbar");
            } else if ($(taskbarContainer).hasClass("e-childContainer")) {
                taskbar = taskbarContainer.querySelector(".e-gantt-childtaskbar");
                progressbar = taskbarContainer.querySelector(".e-gantt-childtaskbar-progress");
                taskbarText = progressbar && progressbar.querySelector(".e-tasklabel");
            }

            args.taskbarBackground = taskbar != null ?
                taskbar.style.backgroundColor : null;

            args.progressbarBackground = progressbar != null ?
                progressbar.style.backgroundColor : null;

            args.parentTaskbarBackground = parentTaskbar != null ?
                parentTaskbar.style.backgroundColor : null;

            args.parentProgressbarBackground = parentProgressbar != null ?
                parentProgressbar.style.backgroundColor : null;

            args.parentProgressbarBorder = parentProgressbar != null ?
                parentProgressbar.style.border : null;

            args.progressbarBorder = progressbar != null ?
                progressbar.style.border : null;

            args.taskbarBorder = taskbar != null ?
                taskbar.style.border : null;

            args.parentTaskbarBorder = parentTaskbar != null ?
                parentTaskbar.style.border : null;

            args.taskbarTextColor = taskbarText != null ?
                taskbarText.style.color : null;

            if (args.data.isMilestone && !ej.isNullOrUndefined(baselineMileStone)) {
                var baselineTop = baselineMileStone.querySelector(".e-baseline-milestone-top"),
                baselineBottom = baselineMileStone.querySelector(".e-baseline-milestone-bottom");
                if (baselineTop && baselineBottom) {
                    args.baselineBackground = baselineTop.style.borderBottomColor;
                }
            }
            else {
                args.baselineBackground = baseline != null ?
                baseline.style.backgroundColor : null;
            }

            args.milestoneBackground = mileStone != null ?
                mileStone.style.borderBottomColor : null;

            if (args.data.hasChildRecords && !args.data.isAutoSchedule) {

                args.manualParentTaskbarBackground = manualParentTaskbar != null ?
                    manualParentTaskbar.style.backgroundColor : null;
            }

            this._queryTaskbarinfo(args, taskbarContainer);
        },

        //helper method to bind querytaskbarinfo events to ganttchart rows
        _eventBindings: function () {
            var $ganttChartRows = $(this.getGanttChartRows()),
                rowsLength = $ganttChartRows.length,
                taskbarContainer, currentTask,
                args = {}, progressbar, taskbar, allTaskElement,
                parentProgressbar, manualParentTaskbar, parentTaskbar, taskElement, mileStone, taskbarText, baseline, baselineMileStone;
            if (rowsLength != 0) {
                for (var row = 0; row < rowsLength; row++) {
                    taskbarContainer = $ganttChartRows[row];
                    currentTask= this.model.currentViewData[row];
                    args.taskbar = taskbarContainer;
                    if ($(taskbarContainer).hasClass("e-ganttrowcell")) {
                        allTaskElement = $(taskbarContainer).find("div.e-childContainer,div.e-parentContainer,div.e-gantt-milestone-container");
                        if ($(allTaskElement).length > 0 && currentTask.eResourceTaskType == "resourceTask") {
                            for (var count = 0; count < $(allTaskElement).length; count++) {
                                taskElement = $(allTaskElement)[count];
                                args.data = currentTask.eResourceChildTasks[count];
                                this._prepareQueryTaskbar(taskElement, args)
                            }
                        } else {
                            args.data = currentTask;
                            this._prepareQueryTaskbar(allTaskElement, args)
                        }
                    }
                }
            }
        },


        //to update the currentviewdata of ganttchart
        _updateCurrentViewData: function () {
            var proxy = this, margin = 0;
            if (!this.model.enableVirtualization) {
                this.model.currentViewData = this.model.updatedRecords;
            }
            else {
                this._getRenderedRowRange();

                //console.log("Gantt Chart Rendered Range Top: " + proxy._renderedRange.top + "Bottom :" + proxy._renderedRange.bottom);

                this.model.currentViewData = this.model.updatedRecords.slice(proxy._renderedRange.top,
                    proxy._renderedRange.bottom);
                if (proxy._vscrollDist !== 0) {
                    margin = proxy._scrollTop;
                    margin -= proxy._rowMargin;
                    $("#ganttViewTable" + proxy._id + "").css({ "top": margin + "px" });
                    $("#ganttgridLinesTable" + proxy._id + "").css({ "top": margin + "px" });
                }
                proxy._vTop = proxy._visibleRange.top;
                proxy._vBottom = proxy._visibleRange.bottom;
                proxy._rTop = proxy._renderedRange.top;
                proxy._rBottom = proxy._renderedRange.bottom;
            }

        },

       
        //to render ganttchart content
        renderGanttRecords: function () {

            var proxy = this;
            proxy._refresh();
            proxy._$ganttViewTable.append(proxy._$ganttViewTablebody);
            proxy._$bodyContent.append(proxy._$ganttViewTable);
        },

        _getRenderedRowRange: function () {

            var proxy = this;
            proxy._getVisibleRowRange();
            var topIndex = proxy._visibleRange.top;
            var bottomIndex = proxy._visibleRange.bottom;
            proxy._renderedRange = { top: topIndex, bottom: bottomIndex };
            return proxy._renderedRange;
        },

        _getVisibleRangeForResourceGantt: function (scrollTop) {
            var returnObj = {},
                model = this.model, height = 0,
                bottomPos = scrollTop + this._viewportHeight,
                rowHeight = 0, argsTop = scrollTop,
                topIndex, topOffset, bottomIndex,
                records = model.updatedRecords;
            for (var i = 0; i < records.length; i++) {
                rowHeight = this._getTemplateRowHeight(records[i]);
                if (argsTop == 0 && ej.isNullOrUndefined(topIndex)) {
                    topIndex = 0;
                    topOffset = 0;
                    scrollTop * -1;
                }
                else if (scrollTop < 0 && ej.isNullOrUndefined(topIndex)) {
                    topIndex = i - 1;
                    topOffset = this._getTemplateRowHeight(records[topIndex]) - (scrollTop * -1);
                }
                if (bottomPos <= 0 && ej.isNullOrUndefined(bottomIndex)) {
                    bottomIndex = i;
                }
                scrollTop -= rowHeight;
                bottomPos -= rowHeight;
                if (!ej.isNullOrUndefined(topIndex) && !ej.isNullOrUndefined(bottomIndex))
                    break;
            }
            returnObj.top = topIndex;
            returnObj.topOffset = topOffset;
            returnObj.bottom = ej.isNullOrUndefined(bottomIndex) ? records.length : bottomIndex;
            return returnObj;
        },
        _getVisibleRowRange: function () {
            var proxy = this,
                top,
                coeff,
                topIndex,
                bottomIndex, length;
            if (this.model.viewType == "resourceView") {
                var range = this._getVisibleRangeForResourceGantt(proxy._scrollTop);
                top = range.top;
                proxy._rowMargin =  range.topOffset;
                bottomIndex = range.bottom;
            } else
            {
                top = proxy._scrollTop / proxy.model.rowHeight;
                coeff = top - Math.floor(top);
                bottomIndex = proxy._getrowposition(proxy._scrollTop + proxy._viewportHeight);
                proxy._rowMargin = coeff * proxy.model.rowHeight;
            }

            topIndex = Math.floor(top);
            length = proxy.model.updatedRecords.length;
            topIndex = Math.max(0, topIndex);
            bottomIndex = Math.min(length, bottomIndex);
            proxy._visibleRange = { top: topIndex, bottom: bottomIndex };
        },

        _getrowposition: function (y) {
            return Math.ceil((y) / this.model.rowHeight);
        },


        //returns the date object
        _getDateType: function (date) {

            if (date instanceof Date) {
                return date;
            }
            else if (date != null) {
                return ej.parseDate(date, this.model.dateFormat, this.model.locale);
            }
            return null;
        },

        // Returns the date as per date format
        _getDateFromFormat: function (date) {

            if (typeof date === "object") {
                return new Date(date);
            }
            if (date) {
                return ej.parseDate(date, this.model.dateFormat, this.model.locale) == null ?
                    new Date(date) : ej.parseDate(date, this.model.dateFormat, this.model.locale);
            }
        },

        createGridLinesTable: function () {
            var proxy = this,
                model = proxy.model,
                $gridLinesTable,
                gridLineTable,
                scheduleMode = model.scheduleHeaderSettings.scheduleHeaderType,
                scheduleLength,
                tableRows;

            $gridLinesTable = ej.buildTag("table.e-ganttgridLinesTable e-zerospacing#ganttgridLinesTable" + proxy._id, "", {
                'z-index': '2',
                'position': 'absolute',
            });
            var $colsgroup = ej.buildTag("colgroup", "", {}, {});
            var $column = $(document.createElement("col"));

            switch (scheduleMode) {
                case "week":
                    scheduleLength = model.scheduleWeeks.length,
                    $gridLinesTable.css("width", (scheduleLength * proxy._scheduleWeekWidth) + 'px');
                    $column.css("width", (scheduleLength * this._scheduleWeekWidth) + 'px');
                    break;

                case "year":
                    scheduleLength = model.scheduleYears.length,
                    $gridLinesTable.css("width", (proxy._scheduleYearWidth) + 'px');
                    $column.css("width", (this._scheduleYearWidth) + 'px');

                    break;
                case "month":
                    scheduleLength = model.scheduleMonths.length,
                    $gridLinesTable.css("width", (proxy._scheduleMonthWidth) + 'px');
                    $column.css("width", (this._scheduleMonthWidth) + 'px');
                    break;
                case "day":
                    scheduleLength = model.scheduleDays.length,
                    $gridLinesTable.css("width", (scheduleLength * (proxy.model.perHourWidth * 24)) + 'px');
                    $column.css("width", (scheduleLength * (proxy.model.perHourWidth * 24)) + 'px');
                    break;
                case "hour":
                    scheduleLength = model.scheduleHours.length,
                    $gridLinesTable.css("width", (scheduleLength * (proxy.model.perMinuteWidth * proxy._totalInterval)) + 'px');
                    $column.css("width", (scheduleLength * (proxy.model.perMinuteWidth * proxy._totalInterval)) + 'px');
                    break;
                default:
                    break;

            }

            $colsgroup.append($column);
            $gridLinesTable.append($colsgroup);

            tableRows = proxy._createGridLinesTableRow(model.enableVirtualization ? model.currentViewData.length : model.updatedRecords.length);

            var $gridLinesTablebody = ej.buildTag("tbody.e-gantt-viewer-gridLinesTablebody#gridLinesTablebody" + proxy._id + "",
                tableRows, {}, {});
            proxy._$gridLinesTablebody = $gridLinesTablebody;
            $gridLinesTable.append(proxy._$gridLinesTablebody);
            proxy._$bodyContent.append($gridLinesTable);
        },

        _createGridLinesTableRow: function (length) {
            var proxy = this,
                model = this.model,
                tableRows="",
                updatedRecords = [];
            if (model.viewType == "resourceView" && model.enableVirtualization)
                updatedRecords = model.currentViewData;
            else if (model.viewType == "resourceView" && !model.enableVirtualization)
                updatedRecords = this.getExpandedRecords(this.model.updatedRecords);

            for (var i = 0; i < length; i++) {
                if(model.viewType == "resourceView")
                    tableRows += "<tr style='display:table-row;height:" + this._getTemplateRowHeight(updatedRecords[i]) + "px'><td class='e-ganttgridlines'></td></tr>";
                else
                    tableRows += "<tr style='display:table-row;height:" + model.rowHeight + "px'><td class='e-ganttgridlines'></td></tr>";
            }
            return tableRows;
        },

        _SelectState: function (args) {
            var proxy = this,
                model = this.model;
            if (model.allowSelection)
                return true;
            else
                return false;
        },

        _getFontSize: function () {
            var proxy = this,
                model = proxy.model,
                taskbarHeight = model.taskbarHeight, fontSize;
            fontSize = (70 * taskbarHeight) / 100;
            var decimalPoint = fontSize % 1;
            fontSize = decimalPoint == 0.5 ? fontSize : (decimalPoint < 0.5 ? Math.floor(fontSize) : Math.ceil(fontSize));
            return fontSize;
        },
        _getLeftTaskLabel: function () {
            var proxy = this,
                model = proxy.model,
                leftMappingItems = "",
                length = model._columns.length;
         
            if (this.model.leftTaskLabelMapping == this.model.resourceNameMapping)
                leftMappingItems = "{{:~_" + proxy._id + "resources(#data)}}";
            else if (this.model.leftTaskLabelMapping == this.model.predecessorMapping)
                leftMappingItems = "{{:predecessorsName}}";
            else {
                for (var i = 0; i < length; i++) {
                    if (this.model.leftTaskLabelMapping == model._columns[i].mappingName) {
                        leftMappingItems = "{{:" + model._columns[i].field + "}}";
                        break;
                    }
                }
            }
            if (leftMappingItems == "") {
                leftMappingItems = "{{:" + this.model.leftTaskLabelMapping + "}}";
            }
            return leftMappingItems;
        },
        _getRightTaskLabel: function () {
            var proxy = this,
                model = proxy.model,
                rightMappingItems = "",
                length = model._columns.length;
            if (this.model.rightTaskLabelMapping == this.model.resourceNameMapping)
                rightMappingItems = "{{:~_" + proxy._id + "resources(#data)}}";
            else if (this.model.rightTaskLabelMapping == this.model.predecessorMapping)
                rightMappingItems = "{{:predecessorsName}}";
            else {
                for (var i = 0; i < length; i++) {
                    if (this.model.rightTaskLabelMapping == model._columns[i].mappingName) {
                        rightMappingItems = "{{:" + model._columns[i].field + "}}";
                        break;
                    }
                }
            }
            if (rightMappingItems == "") {
                rightMappingItems = "{{:" + this.model.rightTaskLabelMapping + "}}";
            }
            return rightMappingItems;
        },

        _getMargin: function () {
            var proxy = this,
                taskbarHeight = this.model.taskbarHeight, margin;
            margin = (taskbarHeight - proxy._fontSize-3) / 2;                        
            return Math.floor(margin);
        },

        _getResizerLeftAdjust: function () {
            var proxy = this,
                taskbarHeight = this.model.taskbarHeight,
                fontSize = proxy._fontSize,
                margin = proxy._resizerMargin, leftResize;
            leftResize = (2 * taskbarHeight) / 100;
            var decimalPoint = leftResize % 1;
            leftResize = decimalPoint < 0.5 ? Math.floor(leftResize) : Math.ceil(leftResize);
            leftResize = leftResize < 0 ? 0 : leftResize;
            return leftResize;
        },

        /*Method to process child taskbar template*/
        _processTaskbarTemplate: function (template, taskbarHeight, templateType) {
            var proxy = this, model = this.model, parentDiv = ej.buildTag("div", "", {}, {}),
                taskbarTemplateString = "",
                isProgressbarTemplate = false,
                taskbarTemplate,
                leftText = "";
            if(templateType !== "resourceTemplate")
                leftText = "left:{{:left}}px;";
            if (template.charAt(0) == "#") {
                taskbarTemplate = $(template)[0].innerHTML;
            }
            else
                taskbarTemplate = template;
            taskbarTemplate = taskbarTemplate.replace(/src/gi, proxy._id + "src");
            $(parentDiv[0]).html(taskbarTemplate);
            $(parentDiv[0].childNodes).each(function () {
                if ($(this).hasClass("e-gantt-template-taskbar")) {
                    var classes = "e-gantt-childtaskbar " + $(this).attr("class");
                    $(this).css({ "height": (taskbarHeight) + "px" }).attr("class", classes);
                    var innerHtml = "";
                    $(this.childNodes).each(function () {
                        if ($(this).hasClass("e-gantt-template-progressbar")) {
                            isProgressbarTemplate = true;
                            var classes = "e-gantt-childtaskbar-progress " + " " + $(this).attr("class");
                            $(this).css({
                                "height": (model.progressbarHeight * ((taskbarHeight) / 100)) + "px",
                                "position": "absolute", "top": "-1px", "left": "-1px",
                            }).attr("class", classes);
                            var outerHtml = this.outerHTML,
                                index = outerHtml.indexOf("style");
                            outerHtml = outerHtml.substr(0, index + 7) + "border-style:{{if progressWidth}}solid{{else}}none{{/if}};width:{{:progressWidth}}px;" + outerHtml.substr(index + 7);
                            innerHtml += outerHtml;
                        }
                        else
                            innerHtml += (this.nodeName == "#comment" ? "" : (this.nodeName == "#text") ? (this.textContent ? this.textContent.replace(/(\r\n|\n|\r)/gm, "") : this.nodeValue.replace(/(\r\n|\n|\r)/gm, "")) : this.outerHTML);
                    });
                    var outerHtml = $(this).clone().empty()[0].outerHTML,
                        index = outerHtml.indexOf("style");
                    outerHtml = outerHtml.substr(0, index + 7) + leftText + "width:{{:width}}px;" + outerHtml.substr(index + 7);
                    var innerIndex = (ej.browserInfo().name == "msie" && ej.browserInfo().version < 9) ? outerHtml.indexOf("</" + this.tagName + ">") : outerHtml.indexOf("</" + this.tagName.toLowerCase() + ">");
                    outerHtml = outerHtml.substr(0, innerIndex) + innerHtml + outerHtml.substr(innerIndex);
                    taskbarTemplateString += outerHtml;
                }
                else {
                    taskbarTemplateString += (this.nodeName == "#comment" ? "" : (this.textContent ? this.textContent.replace(/(\r\n|\n|\r)/gm, "") : this.nodeValue.replace(/(\r\n|\n|\r)/gm, "")));
                }
            });
            taskbarTemplateString = taskbarTemplateString.replace(RegExp((proxy._id + "src").toLowerCase(), "g"), "src");

            var obj = {
                template: taskbarTemplateString,
                isProgressbarTemplate: isProgressbarTemplate
            }
            return obj;
        },

        /*Method to process parent taskbar template*/
        _processParentTaskbarTemplate: function (parentTemplate, taskbarHeight) {
            var proxy = this, model = this.model,
                parentDiv = ej.buildTag("div", "", {}, {}),
                parentTaskbarTemplateString = "",
                parentTaskbarTemplate;

            if (parentTemplate.charAt(0) == "#")
                parentTaskbarTemplate = $(parentTemplate)[0].innerHTML;
            else
                parentTaskbarTemplate = parentTemplate;

            parentTaskbarTemplate = parentTaskbarTemplate.replace(/src/gi, proxy._id + "src");
            $(parentDiv[0]).html(parentTaskbarTemplate);
            $(parentDiv[0].childNodes).each(function () {
                if ($(this).hasClass("e-gantt-template-taskbar")) {
                    $(this).addClass("e-parentTask");
                    var classes = "e-gantt-parenttaskbar-innerdiv e-parentTask" + $(this).attr("class");
                    $(this).css({ "height": (taskbarHeight) + "px" }).attr("class", classes);
                    var innerHtml = "";
                    $(this.childNodes).each(function () {
                        if ($(this).hasClass("e-gantt-template-progressbar")) {
                            var classes = "e-gantt-parenttaskbar-progress e-parentTask" + " " + $(this).attr("class");
                            $(this).css({
                                "height": (model.progressbarHeight * ((taskbarHeight) / 100)) + "px", "top": "-1px", "left": "-1px",
                                "position": "absolute", "z-index": "3",
                            }).attr("class", classes);
                            var outerHtml = this.outerHTML,
                                index = outerHtml.indexOf("style");
                            outerHtml = outerHtml.substr(0, index + 7) + "border-style:{{if progressWidth}}solid{{else}}none{{/if}};width:{{:progressWidth}}px;" + outerHtml.substr(index + 7);
                            innerHtml += outerHtml;
                        }
                        else {
                            innerHtml += (this.nodeName == "#comment" ? "" : (this.nodeName == "#text") ? (this.textContent ? this.textContent.replace(/(\r\n|\n|\r)/gm, "") : this.nodeValue.replace(/(\r\n|\n|\r)/gm, "")) : this.outerHTML);
                        }
                    });
                    var outerHtml = $(this).clone().empty()[0].outerHTML,
                        index = outerHtml.indexOf("style");
                    outerHtml = outerHtml.substr(0, index + 7) + "left:{{:left}}px;width:{{:width}}px;" + outerHtml.substr(index + 7);
                    var innerIndex = (ej.browserInfo().name == "msie" && ej.browserInfo().version < 9) ? outerHtml.indexOf("</" + this.tagName + ">") : outerHtml.indexOf("</" + this.tagName.toLowerCase() + ">");
                    outerHtml = outerHtml.substr(0, innerIndex) + innerHtml + outerHtml.substr(innerIndex);
                    parentTaskbarTemplateString += outerHtml;
                }
                else {
                    parentTaskbarTemplateString += (this.nodeName == "#comment" ? "" : (this.textContent ? this.textContent.replace(/(\r\n|\n|\r)/gm, "") : this.nodeValue.replace(/(\r\n|\n|\r)/gm, "")));
                }
            });
            parentTaskbarTemplateString = parentTaskbarTemplateString.replace(RegExp((proxy._id + "src").toLowerCase(), "g"), "src");
            return parentTaskbarTemplateString;
        },

        /*method to process milestone template*/
        _processMilestoneTemplate: function (milestoneTemplate, milesStoneRadius) {
            var proxy = this, model = this.model,
                parentDiv = ej.buildTag("div", "", {}, {}),
                template,
                milestoneTemplateString = "";

            if (milestoneTemplate.charAt(0) == "#") {
                template = $(milestoneTemplate)[0].innerHTML;
            }
            else
                template = milestoneTemplate;
            template = template.replace(/src/gi, proxy._id + "src");
            $(parentDiv[0]).html(template);
            $(parentDiv[0].childNodes).each(function () {
                if ($(this).hasClass("e-gantt-template-milestone")) {
                    var classes = "e-gantt-milestone " + $(this).attr("class");
                    $(this).css({
                        "width": (model.taskbarHeight - 3) + "px", //6 is margin-top and margin-bottom total
                        "position": "absolute", "z-index": "3"
                    }).attr("class", classes);
                    var outerHtml = this.outerHTML,
                        index = outerHtml.indexOf("style");
                    outerHtml = outerHtml.substr(0, index + 7) + "left:{{:left -" + milesStoneRadius + "}}px;" + outerHtml.substr(index + 7);
                    milestoneTemplateString += outerHtml;
                }
                else {
                    milestoneTemplateString += (this.nodeName == "#comment" ? "" : (this.textContent ? this.textContent.replace(/(\r\n|\n|\r)/gm, "") : this.nodeValue.replace(/(\r\n|\n|\r)/gm, "")));
                }
            });
            milestoneTemplateString = milestoneTemplateString.replace(RegExp((proxy._id + "src").toLowerCase(), "g"), "src");
            return milestoneTemplateString;
        },
        /*Method to get inner template text element*/
        _processTaskLabelTemplate: function (template) {
            var templateString = "";
            if (template.charAt(0) == "#") {
                if ($(template)[0]) {
                    templateString = $(template)[0].innerHTML;
                }
            } else if (document.getElementById(template))
                templateString = $("#" + template)[0].innerHTML;
            else
                templateString = template;
            return templateString;
        },
        //Template to render taskbar and milestone items
        _createTaskbarTemplate: function () {

            var proxy = this,
                model = proxy.model,
                tdWidth,
                scheduleMode = model.scheduleHeaderSettings.scheduleHeaderType,
                tr, baselineHeight = 4, taskbarHeight, baseLineTop,
                shrinkedTaskbarHeight = 0,
                labelHeight,
                milesStoneRadius = 0,
                connectorPointWidth = 0,
                connectorPointRadius = 0,
                connectorPointMargin = 0,
                tHeight = 0,
                leftLabelFlag = false,
                rightLabelFlag = false,
                leftField = "",
                touchLeftConnectorpoint = "",
                touchRightConnectorpoint = "",
                rightField = "", istouchLeftConnectorpoint = false,
                baselineColor = model.baselineColor,
                template = model.taskbarTemplate, taskbarTemplateString, isTaskbarTemplate = false, isProgressbarTemplate = false,
                parentTemplate = model.parentTaskbarTemplate, parentTaskbarTemplateString, isParentTaskbarTemplate = false,
                milestoneTemplate = model.milestoneTemplate, isMilestoneTemplate = false, milestoneTemplateString = "",
                leftTaskLabelTemplate = model.leftTaskLabelTemplate, isLeftTaskLabelTemplate = false, leftTaskLabelTemplateString = "",
                rightTaskLabelTemplate = model.rightTaskLabelTemplate, isRightTaskLabelTemplate = false, rightTaskLabelTemplateString = "",
                helpers = {};
                helpers["_" + proxy._id + "SelectState"] = $.proxy(proxy._SelectState, proxy);
                helpers["_" + proxy._id + "getType"] = proxy._getTypedata;
                helpers["_" + proxy._id + "expander"] = proxy._addRecordExpandCollapse;
                helpers["_" + proxy._id + "milestoneMapping"] = proxy._isMilestone;
				 helpers["_" + proxy._id + "taskNameWidth"] = proxy._taskNameContainerWidth;
                helpers["_" + proxy._id + "resources"] = $.proxy(proxy._getResourceInfo, proxy);
                helpers["_" + proxy._id + "rowClassName"] = ej.TreeGrid._getrowClassName;//proxy._getrowClassName,
                helpers["_" + proxy._id + "expandStatus"] = $.proxy(proxy._getExpandStatusRecord, proxy);
                helpers["_" + proxy._id + "borderRadius"] = proxy._getBorderRadius;

            proxy._fontSize = proxy._getFontSize();
            proxy._resizerRightAdjust = proxy._fontSize * 0.8;
            proxy._resizerMargin = proxy._getMargin();
            proxy._resizerLeftAdjust = proxy._getResizerLeftAdjust();

            if (scheduleMode == "week") {
                tdWidth = model.scheduleWeeks.length * proxy._scheduleWeekWidth;
            }
            else if (scheduleMode == "year") {
                tdWidth = proxy._scheduleYearWidth;
            }
            else if (scheduleMode == "month") {
                tdWidth = proxy._scheduleMonthWidth;
            }
            else if (scheduleMode == "day") {
                tdWidth = model.scheduleDays.length * (model.perHourWidth * 24);
            }
            else if (scheduleMode == "hour") {
                tdWidth = model.scheduleHours.length * (model.perMinuteWidth * proxy._totalInterval);
            }
            if (model.renderBaseline) {
                //taskbarHeight = model.rowHeight;
                var height;
                if ((model.taskbarHeight + baselineHeight) <= model.rowHeight) {
                    height = model.taskbarHeight;
                    baseLineTop = 0;
                }
                else {
                    height = model.taskbarHeight - baselineHeight;
                    baseLineTop = -4;
                }
                taskbarHeight = height;
                shrinkedTaskbarHeight = 0;
                labelHeight = model.rowHeight - baselineHeight - 5;
            } else {
                taskbarHeight = model.taskbarHeight;
                labelHeight = model.rowHeight - 10;
            }
            tHeight = taskbarHeight /5;
            milesStoneRadius = Math.floor((model.taskbarHeight) / 2);
            proxy._milesStoneWidth = (milesStoneRadius * 2);
            proxy._connectorPointWidth = connectorPointWidth = taskbarHeight / 2;
            connectorPointRadius = connectorPointWidth / 2;
            connectorPointMargin = connectorPointWidth - (connectorPointWidth / 2);
            $.views.helpers(helpers);

            if (!model.progressMapping) {


                this.model.showProgressStatus = false;
            }

            if (!model.resourceInfoMapping) {
                model.showResourceNames = false;
            }

            //Process child taskbar template
            if (template) {
                isTaskbarTemplate = true;
                var returnVal = this._processTaskbarTemplate(template, taskbarHeight);
                taskbarTemplateString = returnVal.template
                isProgressbarTemplate = returnVal.isProgressbarTemplate;
            }

            //Process parent taskbar template
            if (parentTemplate) {
                isParentTaskbarTemplate = true;
                parentTaskbarTemplateString = this._processParentTaskbarTemplate(parentTemplate, taskbarHeight);
            }

            // Process milestone template
            if (milestoneTemplate) {
                isMilestoneTemplate = true;
                milestoneTemplateString = this._processMilestoneTemplate(milestoneTemplate, milesStoneRadius);
            }

            //leftTaskLabelTemplate mapping
            if (leftTaskLabelTemplate)
            {
                leftTaskLabelTemplateString = this._processTaskLabelTemplate(leftTaskLabelTemplate);
                isLeftTaskLabelTemplate = true;
            }

            //rightTaskLabelTemplate mapping
            if (rightTaskLabelTemplate)
            {
                rightTaskLabelTemplateString = this._processTaskLabelTemplate(rightTaskLabelTemplate)
                isRightTaskLabelTemplate = true;
            }
            if (this.model.leftTaskLabelMapping  && isLeftTaskLabelTemplate == false) {
                leftLabelFlag = true;
                leftField = proxy._getLeftTaskLabel();
            }

            if (this.model.rightTaskLabelMapping && isRightTaskLabelTemplate == false) {
                rightLabelFlag = true;
                rightField = proxy._getRightTaskLabel();
            }
            if (this.model.taskbarHeight < 45) {
                touchLeftConnectorpoint = "<div class='e-connectortouchpoint' style='right:0px;width:20px;margin-top:" + ((connectorPointWidth - 20) / 2) + "px;height:20px;" +
                "border-radius:10px'></div>";
                touchRightConnectorpoint = "<div class='e-connectortouchpoint' style='left:0px;width:20px;margin-top:" + ((connectorPointWidth - 20) / 2) + "px;height:20px;"
                    +"border-radius:10px'></div>";
            } 

            var rightLabelRowHeight = Math.round(-((this.model.rowHeight - 1) / 2));

            var parentTr = "<tr class='{{:~_" + proxy._id + "rowClassName()}}  {{if isSelected && ~_" + proxy._id + "SelectState()}}e-ganttrowcell {{:~_" + proxy._id + "expander()}} e-gantt-mouseclick{{else}}e-ganttrowcell {{:~_" + proxy._id + "expander()}}{{/if}}'"
                + "style='display:{{:~_" + proxy._id + "expandStatus(#data)}};background-color:{{if rowBGColor }}{{:rowBGColor}}{{else}} none{{/if}};height:" + model.rowHeight + "px;'>";
            var radius = "{{:~_" + proxy._id + "borderRadius()}}";

            tr = "{{if ~_" + proxy._id + "getType()}}" +

                //Parent taskbar Item

                "<td class='e-chartcell'>" +
                "<div class='e-tasknameContainer' style='height:" + (this.model.rowHeight - 1) + "px;width:{{:~_" + proxy._id + "taskNameWidth()}};overflow:hidden;text-overflow: ellipsis;'>" +
                "<div class='e-taskbarname'  style='overflow: hidden;text-overflow: ellipsis;margin-top:5px;margin-right:30px;height:" + (labelHeight) + "px;font-weight:bold'>{{if " + isLeftTaskLabelTemplate + "}}" +
                leftTaskLabelTemplateString + "{{else " + this.model.showTaskNames + " && left > 0 && !" + leftLabelFlag + " }}<span style='line-height:" + (labelHeight) + "px;'>{{:taskName}}</span>" +
                "{{else " + leftLabelFlag + "}}<span style='line-height:" + (labelHeight) + "px;'>" + leftField + "</span>{{/if}}</div></div></td>" +

                "<td  class='e-chartcell' style='width:" + tdWidth + "px; vertical-align:middle;'>" +

               "<div class='e-parentContainer{{if !isAutoSchedule}} e-manualParenttaskbar{{/if}}' style='height:" + (this.model.taskbarHeight-1) + "px;z-index:3;'>" +

                
                //Manual Parent taskbar
                "{{if !isAutoSchedule}}<div class='e-gantt-manualparenttaskbar {{:~_" + proxy._id + "expander()}}' style='left: {{:left}}px;height:" + (tHeight) + "px; width: {{:width}}px;'>" +
                "<div class='e-gantt-manualparenttaskbar-left' style='height:" + (taskbarHeight) + "px;border-left-width:" + tHeight + "px;border-bottom:" + tHeight + "px solid transparent;'></div>" +
                "<div class='e-gantt-manualparenttaskbar-right' style='left:{{:width - " + parseInt(tHeight) + "}}px;height:" + (taskbarHeight) + "px;border-right-width:" + tHeight + "px;border-bottom:" + tHeight + "px solid transparent;'></div>" +
                "<div class='e-taskbarresizer-right' style='left:{{:width -" + (tHeight) + "}}px;width:" + (tHeight) + "px;" +
                "height:" + (taskbarHeight) + "px;font-size:" + proxy._fontSize + "px;position:absolute;z-index:10;'></div>" +
                "</div>{{/if}}" +

                "{{if " + isParentTaskbarTemplate + "}}" + parentTaskbarTemplateString + "{{else}}" +
                "<div class='e-gantt-parenttaskbar-innerdiv {{:~_" + proxy._id + "expander()}} e-parentTask' style='margin-top:{{if !isAutoSchedule}}" + (tHeight * 2) +
                "{{/if}}px;background-color:{{if parentTaskbarBackground }}{{:parentTaskbarBackground}}{{else}} " + this.model.parentTaskbarBackground +
                "{{/if}}; left:{{if isAutoSchedule}}{{:left}}{{else}}{{:manualLeft}}{{/if}}px;width:{{if isAutoSchedule}}{{:width}}{{else}}{{:manualWidth}}{{/if}}px;height:{{if isAutoSchedule}}" +(taskbarHeight)+ "{{else}}" + (tHeight * 3) + "{{/if}}px;'>" +

                "<div  class='e-gantt-parenttaskbar-progress {{:~_" + proxy._id + "expander()}} e-parentTask progressbar' " +
                "style='top:-1px;border-style:{{if progressWidth}}solid{{else}}none{{/if}}; left:-1px;width:{{:progressWidth}}px;position:absolute;background-color:{{if parentProgressbarBackground }}{{:parentProgressbarBackground}}{{else}} "
                + this.model.parentProgressbarBackground + "{{/if}};z-index:3;" +
                "border-top-right-radius:{{if isAutoSchedule}}" + radius + "{{else}}" + tHeight + "{{/if}}px;border-bottom-right-radius:{{if isAutoSchedule}}" + radius + "{{else}}"
                + tHeight + "{{/if}}px;height:{{if isAutoSchedule}}" + (taskbarHeight) + "{{else}}" + (tHeight * 3) + "{{/if}}px;'></div>" + "</div>" + "{{/if}}" +

                  

             "</div>" +

                "{{if " + this.model.renderBaseline + " && baselineStartDate && baselineEndDate }}" +
                "<div  class='e-baselinebar' style='margin-top:" + baseLineTop +"px;left:{{:baselineLeft}}px;" +
                "width:{{:baselineWidth}}px;height:" + baselineHeight + "px;background-color: " + baselineColor + ";" +
                "position:absolute;z-index:3;box-sizing:border-box;-moz-box-sizing:border-box;'></div>{{/if}}" +

                "</td>" +

               "<td class='e-chartcell' >" +
                "<div class='e-resourceinfo' style='left:{{if isAutoSchedule}}{{:left+width+30}}{{else}}{{if (left+width)>(manualLeft+manualWidth)}}{{:left+width+30}}{{else}}{{:manualLeft+manualWidth+30}}{{/if}}{{/if}}px;" +
                "margin:0;margin-left:5px;margin-top:" + rightLabelRowHeight + "px;position:absolute;background-color:transparent;font-weight:bold;height:" + (this.model.rowHeight - 1) + "px;'>" +
                "<div class='e-resourcename'  style='overflow-y:hidden;margin-top:5px;height:" + (labelHeight) + "px;margin-right:30px;outline:none;'>{{if " + isRightTaskLabelTemplate + "}}" + rightTaskLabelTemplateString +
                "{{else " + this.model.showResourceNames + " && left > 0 && !" + rightLabelFlag + " }}<span style='line-height:" + (labelHeight) + "px;'>{{:~_" + proxy._id + "resources(#data)}}</span>" +
                "{{else " + rightLabelFlag + "}}<span style='line-height:" + (labelHeight) + "px;'>" + rightField + "</span>{{/if}}</div></div></td>" +


               //Milestone Item

                "{{else ~_" + proxy._id + "milestoneMapping()}}" +
                    
                "<td class='e-chartcell'>" +
                "<div class='e-tasknameContainer' style='height:" + (this.model.rowHeight - 1) + "px;width:{{:~_" + proxy._id + "taskNameWidth()}};overflow:hidden;text-overflow:ellipsis;'>" +
                "<div class='e-taskbarname'  style='overflow: hidden;text-overflow: ellipsis;margin-top:5px;height:" + (labelHeight) + "px;margin-right:30px;'>{{if " + isLeftTaskLabelTemplate + "}}" + leftTaskLabelTemplateString +
                "{{else " + this.model.showTaskNames + " && left > 0 && !" + leftLabelFlag + " }}<span style='line-height:" + (labelHeight) + "px;'>{{:taskName}}</span>"
                + "{{else " + leftLabelFlag + "}}<span style='line-height:" + (labelHeight) + "px;'>" + leftField + "</span>{{/if}}</div></div></td>" +

               "<td class='e-chartcell' style='width:" + tdWidth + "px;'>" +
                "<div class='e-gantt-milestone-container' style=height:" + (this.model.taskbarHeight - 1) + "px;>" +
                "<div class='e-connectorpoint-left' style='left:{{:left-" + (connectorPointWidth + milesStoneRadius) + "}}px;width:" + connectorPointWidth + "px;margin-top:" + connectorPointMargin + "px;height:" + (taskbarHeight / 2) + "px;border-radius:" +
                connectorPointRadius + "px;'>" + touchLeftConnectorpoint + "</div>" +
                "{{if " + isMilestoneTemplate + "}}" + milestoneTemplateString + "{{else}}" +
                "<div class='e-gantt-milestone' style='position:absolute;left:{{:left-" + milesStoneRadius + "}}px;'>" +
                "<div class='e-gantt-milestone e-milestone-top'  style='border-right-width:" + milesStoneRadius + "px;border-left-width:" + milesStoneRadius + "px;border-bottom-width:" + milesStoneRadius + "px; border-right-color:transparent;border-left-color:transparent;border-style:none solid solid;border-top: none;'></div>" +
                "<div class='e-gantt-milestone e-milestone-bottom'  style='top:" + (milesStoneRadius) + "px;border-right-width:" + milesStoneRadius + "px; border-left-width:" + milesStoneRadius + "px; border-top-width:" + milesStoneRadius + "px; border-right-color:transparent;border-left-color:transparent;border-style:solid solid none; border-bottom: none;'></div>" +
                "</div>" + "{{/if}}" +
                 "<div class='e-connectorpoint-right' style='left:{{:(left+" + (milesStoneRadius) + ")}}px;width:" + connectorPointWidth + "px;margin-top:" + connectorPointMargin + "px;height:" + (taskbarHeight / 2) + "px;border-radius:"
                 + connectorPointRadius + "px;'>" + touchRightConnectorpoint + "</div>" +
                "</div>" +

                "{{if " + this.model.renderBaseline + " && baselineStartDate && baselineEndDate}}" +
                "<div class='e-baseline-gantt-milestone-container' >" +
                "<div class='e-baseline-gantt-milestone' style='position:absolute;left:{{:baselineLeft -" + (milesStoneRadius) + "}}px;z-index:2;'>" +
                "<div class='e-baseline-gantt-milestone e-baseline-milestone-top'  " +
                "style='z-index:2;top:" + (- this.model.taskbarHeight) + "px;border:" + milesStoneRadius + "px solid transparent;border-top: none;border-bottom-color: " + baselineColor + ";'></div>" +
                "<div class='e-baseline-gantt-milestone e-baseline-milestone-bottom'  " +
                "style='z-index:2;top:" + (milesStoneRadius - this.model.taskbarHeight) + "px;border:" + milesStoneRadius + "px solid transparent;border-bottom: none;border-top-color: " + baselineColor + ";'></div>" +
                "</div></div>" +
                "{{/if}}" +

                "</td>" +

               "<td class='e-chartcell' >" +
                "<div class='e-resourceinfo' style='margin-top:5px;left:{{:left+56}}px;margin:0;margin-left:5px;margin-top:" + rightLabelRowHeight + "px;height:" + (this.model.rowHeight - 1) + "px;" +
                "position:absolute;background-color:transparent;'><div class='e-resourcename'  style='overflow-y:hidden;margin-top:5px;height:" + (labelHeight) + "px;margin-right:30px;'>{{if " + isRightTaskLabelTemplate + "}}" +
                rightTaskLabelTemplateString + "{{else " + this.model.showResourceNames + " && left > 0 && !" + rightLabelFlag + " }}<span style='line-height:" + (labelHeight) + "px;'>{{:~_" + proxy._id + "resources(#data)}}</span>" +
                "{{else " + rightLabelFlag + "}}<span style='line-height:" + (labelHeight) + "px;'>" + rightField + "</span>{{/if}}</div></div></td>" +

                //Child Taskbar Item

                "{{else}}" +

                //left label
               "<td class='e-chartcell'>" +
                "<div class='e-tasknameContainer' style='height:" + (this.model.rowHeight - 1) + "px;width:{{:~_" + proxy._id + "taskNameWidth()}};overflow:hidden;text-overflow: ellipsis;'>" +
                "<div class='e-taskbarname'  style='overflow: hidden;text-overflow: ellipsis;margin-top:5px;height:" + (labelHeight) + "px;margin-right:30px;'>{{if " + isLeftTaskLabelTemplate + "}}" + leftTaskLabelTemplateString +
                "{{else " + this.model.showTaskNames + " && left > 0 && !" + leftLabelFlag + " }}<span style='line-height:" + (labelHeight) + "px;'>{{:taskName}}</span>"
                + "{{else " + leftLabelFlag + "}}<span style='line-height:" + (labelHeight) + "px;'>" + leftField + "</span>{{/if}}</div></div></td>" +

                //taskbar
               "<td class='e-chartcell' style='width:" + tdWidth + "px;'>" +

               

               "<div  class='e-childContainer' style='height:" + (this.model.taskbarHeight - 1) + "px;'>" +

               "<div class='e-connectorpoint-left' style='left:{{:left-" + connectorPointWidth + "}}px;width:" + connectorPointWidth + "px;margin-top:" + connectorPointMargin + "px;height:" + (taskbarHeight / 2) + "px;" +
               "border-radius:" + connectorPointRadius + "px'>" + touchLeftConnectorpoint + "</div>" +

               "<div class='e-taskbarresizer-left e-icon' style='left:{{:left+2-" + proxy._resizerLeftAdjust + "}}px;width:10px;margin-top:" + proxy._resizerMargin + "px;height:" + (taskbarHeight) + "px;font-size:" + proxy._fontSize + "px;'></div>" +
               "{{if " + isTaskbarTemplate + "}}" + taskbarTemplateString + "{{else}}" +
               "<div  class='e-gantt-childtaskbar {{if isCritical}} e-criticaltaskbar{{/if}} {{if !isAutoSchedule}} e-manualchildtaskbar{{/if}}' style='left:{{:left}}px;width:{{:width}}px;height:"
               + (taskbarHeight) + "px;background-color:{{if taskbarBackground }}{{:taskbarBackground}}{{else}} "
               + this.model.taskbarBackground + "{{/if}};'>" +

               "<div  class='e-gantt-childtaskbar-progress  {{if isAutoSchedule}} progressbar{{else}} e-manualprogressbar{{/if}} {{if isCritical}} e-criticalprogressbar{{/if}}' style='border-style:{{if progressWidth}}solid{{else}}none{{/if}};" +
                "width:{{:progressWidth}}px;text-align:right;line-height:" + (taskbarHeight - 1) + "px;" +
                //"margin-top:" + (((taskbarHeight) - (this.model.progressbarHeight * ((taskbarHeight) / 100))) / 2) + "px;" +
                "height:" + (this.model.progressbarHeight * (taskbarHeight / 100)) + "px; top:-1px;left:-1px;" +
                "position:absolute;background-color:{{if progressbarBackground }}{{:progressbarBackground}}{{else}} " + this.model.progressbarBackground + "{{/if}};" +
                "border-top-right-radius:" + radius + "px;border-bottom-right-radius:" + radius + "px;'>" +
                "{{if " + this.model.showProgressStatus + "}}<span class='e-tasklabel' style='line-height:" + (taskbarHeight - 1) + "px'>{{:status}}%</span>{{/if}}</div></div>" + "{{/if}}" +
                "{{if " + (!isTaskbarTemplate || isProgressbarTemplate) + "}}" +
               "<div class='e-progressbarresizer-right' style='left:{{:left+progressWidth-10}}px;width:20px;margin-top:" + (taskbarHeight-5) + "px;" +
               "height:15px;position:absolute;z-index:5;'>" +
               "<div class='e-progressbarhandler' style='top:" + (10) + "px;position:absolute;z-index:-1;'><div class='e-progresshandler-element'></div></div>" +//-" + (shrinkedTaskbarHeight/2) + "
               "<div class='e-progressbarhandler' style='top:" + (5) + "px;position:absolute;z-index:-1;'><div class='e-progresshandlerafter-element'></div></div></div>" + "{{/if}}" +

               "<div class='e-taskbarresizer-right e-icon' style='left:{{:left+width-" + proxy._resizerRightAdjust + "}}px;width:10px;" +
                "height:" + (taskbarHeight) + "px;font-size:" + proxy._fontSize + "px;position:absolute;z-index:2;margin-top:" + proxy._resizerMargin + "px;'></div>" +

                "<div class='e-connectorpoint-right' style='left:{{:left+width}}px;width:" + connectorPointWidth + "px;margin-top:" + connectorPointMargin + "px;height:" + (taskbarHeight / 2) + "px;"
                + "border-radius:" + connectorPointRadius + "px'>" + touchRightConnectorpoint + "</div>" +
                //"<div class='e-connectorpoint-right' style='left:{{:left-20}}px;width:20px;margin-top:10px;background-color:black;height:" + (taskbarHeight) + "px;'></div>"+
                 "</div>" +

                "{{if " + this.model.renderBaseline + " && baselineStartDate && baselineEndDate }}" +
                "<div  class='e-baselinebar' style='margin-top:"+ baseLineTop + "px;left:{{:baselineLeft}}px;" +
                "width:{{:baselineWidth}}px;height:" + baselineHeight + "px;background-color: " + baselineColor + ";" +
                "position:absolute;z-index:3;box-sizing:border-box;-moz-box-sizing:border-box;'></div>{{/if}}" +

                "</td>" +

                //right label
               "<td class='e-chartcell' >" +
                "<div class='e-resourceinfo' style='left:{{:left+width+30}}px;margin:0;margin-left:5px;margin-top:" + rightLabelRowHeight + "px;height:" + (this.model.rowHeight - 1) + "px;" +
                "position:absolute;text-align:left;background-color:transparent;'><div class='e-resourcename'  style='overflow-y:hidden;margin-top:5px;height:" + (labelHeight) + "px;margin-right:30px;'>{{if " + isRightTaskLabelTemplate + "}}"
                + rightTaskLabelTemplateString + "{{else " + this.model.showResourceNames + " && left > 0 && !" + rightLabelFlag + " }}<span style='line-height:" + (labelHeight) + "px;'>{{:~_" + proxy._id + "resources(#data)}}</span>" +
                "{{else " + rightLabelFlag + "}}<span style='line-height:" + (labelHeight) + "px;'>" + rightField + "</span>{{/if}}</div></div></td>{{/if}}";

            parentTr += tr;
            parentTr += "</tr>";

            var templates = {};
            templates[this._id + "_CustomTemplate2"] = parentTr;
            $.templates(templates);

        },

        _getResourceInfo: function (data) {
            var resource = null;
            if (data.resourceInfo != null) {
                var resourcelength = data.resourceInfo.length;
                if (resourcelength > 0) {
                    for (var i = 0; i < resourcelength; i++) {
                        var unit = data.resourceInfo[i][this.model.resourceUnitMapping];
                        if (resource == null) {                           
                            resource = data.resourceInfo[i][this.model.resourceNameMapping];
                            if (unit != 100)
                                resource += "[" + unit + "%]";
                        }
                        else {
                            resource += " , " + data.resourceInfo[i][this.model.resourceNameMapping];
                            if (unit != 100)
                                resource += "[" + unit + "%]";
                        }
                    }
                    return resource;
                } else
                    return String.empty;
            }
            return String.empty;
        },

        _getrowClassName: function () {
            var rowClass = "gridrowtaskId",
                proxy = this;
            if (proxy.data.parentItem)
                rowClass += proxy.data.parentItem.taskId.toString();
            rowClass += "level";
            rowClass += proxy.data.level.toString();
            return rowClass;
        },

        _getExpandStatusRecord: function (data) {
            var proxy = this;
            if (proxy._getExpandStatus(data)) {
                return 'table-row';
            }
            return 'none';
        },


        _isMilestone: function () {
            if (this.data.isMilestone)
                return true;
            else
                return false;
        },
        /*Get task left lable container width for all task item*/
        _taskNameContainerWidth: function () {
            var width;
            if (this.data.hasChildRecords && !this.data.isAutoSchedule) {
                if (this.data.left < this.data.manualLeft)
                    width = this.data.left - 10;
                else
                    width = this.data.manualLeft - 10;
            } else {
                width = this.data.left - 10;
            }
            if (width < 0)
                width = 0;
            return width + "px";
        },
        _addRecordExpandCollapse: function () {
            if (this.data.expanded)
                return 'e-chartexpand';
            else if (!this.data.expanded && this.data.hasChildRecords) {
                return 'e-chartcollapse';
            }
            return false;
        },

        _getTypedata: function () {
            return (this.data.hasChildRecords || this.data.eResourceTaskType == "groupTask");
        },


        _getBorderRadius: function () {

            var proxy = this,
                diff = proxy.data.width - proxy.data.progressWidth;

            if (diff <= 4) {
                return 4 - diff;
            }
            else
                return 0;

        },

        _getHeightValue: function () {
            return (this.data.ParentIndex * this.data.RowHeight) > (this.data.ChildIndex * this.data.RowHeight) ? ((this.data.ParentIndex * this.data.RowHeight) - (this.data.ChildIndex * this.data.RowHeight)) : ((this.data.ChildIndex * this.data.RowHeight) - (this.data.ParentIndex * this.data.RowHeight));
        
        },

        _createConnectorLineTemplate: function () {
            var proxy = this,
                lineStroke = (proxy.model.connectorlineWidth) > 4 ? 4 : proxy.model.connectorlineWidth,
                shrinkedTaskbarHeight = 0,
                deltaTop, taskbarMidpoint,
                lineColor = proxy.model.connectorLineBackground,
                helpers = {};
            helpers["_" + proxy._id + "getWidthVal"] = proxy._getWidth;
            helpers["_" + proxy._id + "getTop"] = proxy._getPredecessorTop;
            helpers["_" + proxy._id + "getPosition"] = proxy._getParentPosition;
            helpers["_" + proxy._id + "setContainerWidthSSType2"] = proxy._getContainerWidthSSType2;
            helpers["_" + proxy._id + "setInnerChildWidthSSType2"] = proxy._getInnerChildWidthSSType2;
            helpers["_" + proxy._id + "setInnerElementLeftSSType2"] = proxy._getInnerElementLeftSSType2;
            helpers["_" + proxy._id + "setInnerElementWidthSSType2"] = proxy._getInnerElementWidthSSType2;
            helpers["_" + proxy._id + "isMilestone"] = proxy._isTaskMilestone;
            helpers["_" + proxy._id + "isMilestoneParent"] = proxy._isMilestoneParent;
            helpers["_" + proxy._id + "getHeightValue"] = proxy._getHeightValue;

            if (proxy.model.renderBaseline) {
                deltaTop = shrinkedTaskbarHeight / 2;
                taskbarMidpoint = ((proxy.model.rowHeight) / 2) - deltaTop;
            } else {
                taskbarMidpoint = ((proxy.model.rowHeight) / 2);
            }

            $.views.helpers(helpers);
            var connectorContainer = "<div  id='ConnectorLine{{:ConnectorLineId}}' style='background-color=black'>";

            var div = "{{if ~_" + proxy._id + "getPosition()=='FSType1'}}"//FS
            + "<div class='e-connectorlineContainer' style='left:{{:ParentLeft+ParentWidth}}px;top:{{:(ParentIndex * RowHeight) +" + taskbarMidpoint + "}}px;" +
                "width:1px;height:{{:~_" + proxy._id + "getHeightValue()}}px;position:absolute' data-connectortype='FSType1'>"
            + "<div class='e-line' style='left:{{if milestoneParent}}-7px{{else}}0px{{/if}};width:{{if milestoneParent}}{{:(ChildLeft-(ParentLeft + ParentWidth + 10))+" + lineStroke + "-2}}px{{else}}{{:(ChildLeft-(ParentLeft + ParentWidth + 10))+" + lineStroke + "-10}}px{{/if}};" +
                "border-top:" + lineStroke + "px solid " + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='left:{{:(ChildLeft-(ParentLeft + ParentWidth + 10))+" + lineStroke + "-10}}px;" +
                "width:0px;border-right:" + lineStroke + "px solid " + lineColor + ";border-top:{{:~_" + proxy._id + "getHeightValue()-" + lineStroke + "}}px solid " + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='left:{{:(ChildLeft-(ParentLeft + ParentWidth + 10))+" + lineStroke + "-10}}px;width:10px;" +
                "border-top:" + lineStroke + "px solid " + lineColor + ";position:relative'></div>"
            + "<div class='e-connectorline-rightarrow' style='left:{{:(ChildLeft - (ParentLeft + ParentWidth + 10))}}px;" +
                "border-left: 10px solid " + lineColor + ";top:{{:-6-" + lineStroke + "}}px;" +
                "border-bottom-width:{{:5+" + lineStroke + "}}px;border-top-width:{{:5+" + lineStroke + "}}px;width:0;height:0;position:relative'></div>"
            + "</div>"

            + "{{else  ~_" + proxy._id + "getPosition()=='FSType2'}}"//FS
            + "<div class='e-connectorlineContainer' style='left:{{:ParentLeft}}px;top:{{:(ParentIndex * RowHeight) +" + taskbarMidpoint + "}}px;" +
                "width:1px;height:{{:~_" + proxy._id + "getHeightValue()}}px;position:absolute' data-connectortype='FSType2'>"
            + "<div class='e-line' style='left:{{if milestoneParent}}{{:ParentWidth-7}}px{{else}}{{:ParentWidth}}px{{/if}};width:{{if milestoneParent}}17px{{else}}10px{{/if}};border-top:" + lineStroke + "px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='left:{{:ParentWidth+10-" + lineStroke + "}}px;border-left:" + lineStroke + "px solid;width:0px;" +
                "border-top:{{:~_" + proxy._id + "getHeightValue()-14-" + lineStroke + "}}px solid;border-color:" + lineColor + ";" +
                "position:relative'></div><div class='e-line' style='left:{{:(ParentWidth - (((ParentLeft + ParentWidth) - ChildLeft) + 20))}}px;" +
                "width:{{:(((ParentLeft + ParentWidth) - ChildLeft) + 30 )}}px;border-top:" + lineStroke + "px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='left:{{:(ParentWidth - (((ParentLeft + ParentWidth) - ChildLeft) + 20))}}px;width:0px;" +
                "border-top:{{:14-" + lineStroke + "}}px solid;border-left:" + lineStroke + "px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='left:{{:(ParentWidth - (((ParentLeft + ParentWidth) - ChildLeft) + 20))}}px;width:10px;" +
                "border-top:" + lineStroke + "px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-connectorline-rightarrow' style='left:{{:(ParentWidth - (((ParentLeft + ParentWidth) - ChildLeft) + 10))}}px;" +
                "border-left: 10px solid " + lineColor + ";border-bottom-width:{{:5+" + lineStroke + "}}px;" +
                "border-top-width:{{:5+" + lineStroke + "}}px;top:{{:-6-" + lineStroke + "}}px;width:0;height:0;position:relative'></div>"
            + "</div>"

            + "{{else ~_" + proxy._id + "getPosition()=='FSType3'}}"
            + "<div class='e-connectorlineContainer' style='left:{{:ChildLeft-20}}px;top:{{:(ChildIndex * RowHeight) +" + taskbarMidpoint + "}}px;" +
                "width:1px;height:{{:~_" + proxy._id + "getHeightValue()}}px;position:absolute' data-connectortype='FSType3'>"
            + "<div class='e-connectorline-rightarrow' style='left:10px;border-left: 10px solid " + lineColor + ";" +
                "border-bottom-width:{{:5+" + lineStroke + "}}px;border-top-width:{{:5+" + lineStroke + "}}px;" +
                "top:{{:-5-" + lineStroke + "}}px;width:0;height:0;position:relative'></div>"
            + "<div class='e-line' style='width:10px;border-top:" + lineStroke + "px solid;border-color:" + lineColor + ";" +
                "position:relative;top:-" + (13 + ((lineStroke - 1) * 2)) + "px;'></div>"
            + "<div class='e-line' style='width:" + lineStroke + "px;border-top:{{:~_" + proxy._id + "getHeightValue()-14-" + lineStroke + "}}px solid;" +
                "border-color:" + lineColor + ";position:relative;top:-" + (13 + ((lineStroke - 1) * 2)) + "px'></div>"
            + "<div class='e-line' style='width:{{:(((ParentLeft + ParentWidth) - ChildLeft) + 30)}}px;border-top:" + lineStroke + "px solid;" +
                "border-color:" + lineColor + ";position:relative;top:-" + (13 + ((lineStroke - 1) * 2)) + "px;'></div>"
            + "<div class='e-line' style='left:{{:(((ParentLeft + ParentWidth) - ChildLeft) + 30)}}px;width:0px;border-left:" + lineStroke + "px solid;" +
                "height:{{:14-" + lineStroke + "}}px;border-color:" + lineColor + ";position:relative;" +
                "top:-" + (13 + ((lineStroke - 1) * 2)) + "px;'></div>"
            + "<div class='e-line' style='{{if ~_" + proxy._id + "isMilestoneParent()}}left:{{:(((ParentLeft + ParentWidth) - ChildLeft) + 14)}}px;width:16px;{{else}}left:{{:(((ParentLeft + ParentWidth) - ChildLeft) + 20)}}px;width:10px;{{/if}}border-top:" + lineStroke + "px solid;" +
                "border-color:" + lineColor + ";position:relative;top:-" + (13 + ((lineStroke - 1) * 2)) + "px;'></div>"
            + "</div>"

            + "{{else ~_" + proxy._id + "getPosition()=='FSType4'}}"
            + "<div class='e-connectorlineContainer' style='left:{{:ParentLeft+ParentWidth}}px;top:{{:(ChildIndex * RowHeight) +" + taskbarMidpoint + "}}px;" +
                "width:1px;height:{{:~_" + proxy._id + "getHeightValue()}}px;position:absolute' data-connectortype='FSType4'>"
            + "<div class='e-connectorline-rightarrow' style='left:{{:(ChildLeft - (ParentLeft + ParentWidth + 10))}}px;" +
                "border-left: 10px solid " + lineColor + ";top:{{:-5-" + lineStroke + "}}px;" +
                "border-bottom-width:{{:5+" + lineStroke + "}}px;border-top-width:{{:5+" + lineStroke + "}}px;width:0;height:0;position:relative'></div>"
            + "<div class='e-line' style='left:{{:(ChildLeft - (ParentLeft + ParentWidth) - 20)}}px;top:-" + (13 + ((lineStroke - 1) * 2)) + "px;width:10px;" +
                "border-top:" + lineStroke + "px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='top:-" + (13 + ((lineStroke - 1) * 2)) + "px;left:{{:(ChildLeft - (ParentLeft + ParentWidth) - 20)}}px;width:0px;border-left:" + lineStroke + "px solid;" +
                "border-top:{{:~_" + proxy._id + "getHeightValue()-" + lineStroke + "}}px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='{{if ~_" + proxy._id + "isMilestoneParent()}}left:-6px;{{/if}}top:-" + (13 + ((lineStroke - 1) * 2)) + "px;width:{{if ~_" + proxy._id + "isMilestoneParent()}}{{:(ChildLeft-(ParentLeft + ParentWidth+20 )+ 6)+" + lineStroke + "}}px;{{else}}{{:(ChildLeft-(ParentLeft + ParentWidth + 20))+" + lineStroke + "}}px;{{/if}}" +
                "border-top:" + lineStroke + "px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "</div>"

            + "{{else ~_" + proxy._id + "getPosition()=='SSType4'}}"
            + "<div class='e-connectorlineContainer'  style='left:{{:ParentLeft-10}}px;top:{{:(ChildIndex * RowHeight) +" + taskbarMidpoint + "}}px;" +
                "width:1px;height:{{:~_" + proxy._id + "getHeightValue()}}px;position:absolute' data-connectortype='SSType4'>"
            + "<div class='e-connectorline-rightarrow' style='left:{{:ChildLeft-ParentLeft}}px;border-left: 10px solid " + lineColor + ";" +
                "top:{{:-6-" + lineStroke + "}}px;border-bottom-width:{{:5+" + lineStroke + "}}px;" +
                "border-top-width:{{:5+" + lineStroke + "}}px;width:0;height:0;position:relative'></div>"
            + "<div class='e-line' style='top:-" +(13 + ((lineStroke -1 ) *2)) + "px;width:{{:ChildLeft-ParentLeft}}px;border-top:" + lineStroke + "px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='top:-" +(13 + ((lineStroke - 1) * 2)) + "px;width:0px;border-left:" + lineStroke + "px solid;border-top:{{:~_" + proxy._id + "getHeightValue()-" + lineStroke + "}}px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='top:-" +(13 + ((lineStroke - 1) * 2)) + "px;width:10px;border-top:" + lineStroke + "px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "</div>"

            + "{{else ~_" + proxy._id + "getPosition()=='SSType3'}}"
            + "<div class='e-connectorlineContainer' style='left:{{:ChildLeft-20}}px;top:{{:(ChildIndex * RowHeight) +" + taskbarMidpoint + "}}px;" +
                "width:1px;height:{{:~_" + proxy._id + "getHeightValue()}}px;position:absolute' data-connectortype='SSType3'>"
            + "<div class='e-connectorline-rightarrow' style='left:10px;border-left: 10px solid " + lineColor + ";" +
                "top:{{:-6-" + lineStroke + "}}px;border-bottom-width:{{:5+" + lineStroke + "}}px;" +
                "border-top-width:{{:5+" + lineStroke + "}}px;width:0;height:0;position:relative'></div>"
            + "<div class='e-line' style='top:-" +(13 + ((lineStroke - 1) * 2)) + "px;width:10px;border-top:" + lineStroke + "px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='top:-" +(13 + ((lineStroke - 1) * 2)) + "px;width:0px;border-left:" + lineStroke + "px solid;border-top:{{:~_" + proxy._id + "getHeightValue()-" + lineStroke + "}}px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='top:-" +(13 + ((lineStroke - 1) * 2)) + "px;width:{{:ParentLeft-ChildLeft+20}}px;border-top:" + lineStroke + "px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "</div>"

            + "{{else ~_" + proxy._id + "getPosition()=='SSType2'}}"
            + "<div class='e-connectorlineContainer' style='left:{{:~_" + proxy._id + "setInnerElementLeftSSType2()}}px;top:{{:(ParentIndex * RowHeight) +" + taskbarMidpoint + "}}px;" +
                "width:1px;height:{{:~_" + proxy._id + "getHeightValue()}}px;position:absolute' data-connectortype='SSType2'>"
            + "<div class='e-line' style='width:{{:~_" + proxy._id + "setInnerChildWidthSSType2()}}px;border-top:" + lineStroke + "px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='width:0px;border-left:" + lineStroke + "px solid;border-top:{{:~_" + proxy._id + "getHeightValue()-" + lineStroke + "}}px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='width:{{:~_" + proxy._id + "setInnerElementWidthSSType2()}}px;border-top:" + lineStroke + "px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-connectorline-rightarrow' style='left:{{:~_" + proxy._id + "setInnerElementWidthSSType2()}}px;" +
                "border-left: 10px solid " + lineColor + ";top:{{:-6-" + lineStroke + "}}px;" +
                "border-bottom-width:{{:5+" + lineStroke + "}}px;border-top-width:{{:5+" + lineStroke + "}}px;width:0;" +
                "height:0;position:relative'></div>"
            + "</div>"

            + "{{else ~_" + proxy._id + "getPosition()=='SSType1'}}"
            + "<div class='e-connectorlineContainer' style='left:{{:ChildLeft-20}}px;top:{{:(ParentIndex * RowHeight) +" + taskbarMidpoint + "}}px;" +
                "width:1px;height:{{:~_" + proxy._id + "getHeightValue()}}px;position:absolute' data-connectortype='SSType1'>"
            + "<div class='e-line' style='width:{{:ParentLeft-ChildLeft+20}}px;border-top:" + lineStroke + "px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='width:0px;border-left:" + lineStroke + "px solid;border-top:{{:~_" + proxy._id + "getHeightValue()-" + lineStroke + "}}px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='width:10px;border-top:" + lineStroke + "px solid;border-color:" + lineColor + ";" +
                "position:relative'></div>"
            + "<div class='e-connectorline-rightarrow' style='left:10px;border-left: 10px solid " + lineColor + ";" +
                "top:{{:-6-" + lineStroke + "}}px;border-bottom-width:{{:5+" + lineStroke + "}}px;" +
                "border-top-width:{{:5+" + lineStroke + "}}px;width:0;height:0;position:relative'></div>"
            + "</div>"

            + "{{else ~_" + proxy._id + "getPosition()=='FFType1'}}"
            + "<div class='e-connectorlineContainer' style='left:{{:ChildLeft+ChildWidth}}px;top:{{:(ParentIndex * RowHeight) +" + taskbarMidpoint + "}}px;" +
                "width:1px;height:{{:~_" + proxy._id + "getHeightValue()}}px;position:absolute' data-connectortype='FFType1'>"
            + "<div class='e-line' style='left:{{if ~_" + proxy._id + "isMilestoneParent()}}{{:((ParentLeft + ParentWidth) - (ChildLeft + ChildWidth))-10}}px;{{else}}{{:((ParentLeft + ParentWidth) - (ChildLeft + ChildWidth))}}px;{{/if}}" +
                "width:{{if ~_" + proxy._id + "isMilestoneParent()}}30px;{{else}}20px;{{/if}}" +
                "border-top:" + lineStroke + "px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='left:{{if ~_" + proxy._id + "isMilestoneParent()}}{{:((ParentLeft + ParentWidth) - (ChildLeft + ChildWidth))+20}}px;{{else}}{{:((ParentLeft + ParentWidth) - (ChildLeft + ChildWidth))+20}}px;{{/if}}width:0px;border-left:" + lineStroke + "px solid;" +
                "border-top:{{:~_" + proxy._id + "getHeightValue()-" + lineStroke + "}}px solid;border-color:" + lineColor + ";" +
                "position:relative'></div>"
            + "<div class='e-line' style='left:{{if ~_" + proxy._id + "isMilestone()}}4px;{{else}}10px;{{/if}}width:{{if ~_" + proxy._id + "isMilestone()}}{{:((ParentLeft + ParentWidth) - (ChildLeft + ChildWidth))+16}}px;{{else}}{{:((ParentLeft + ParentWidth) - (ChildLeft + ChildWidth))+10}}px;{{/if}}" +
                "border-top:" + lineStroke + "px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-connectorline-leftarrow' style='{{if ~_" + proxy._id + "isMilestone()}}left:-6px;{{/if}}border-right: 10px solid " + lineColor + ";" +
                "top:{{:-6-" + lineStroke + "}}px;border-bottom-width:{{:5+" + lineStroke + "}}px;" +
                "border-top-width:{{:5+" + lineStroke + "}}px;width:0;height:0;position:relative'></div>"
            + "</div>"

            + "{{else ~_" + proxy._id + "getPosition()=='FFType2'}}"
            + "<div class='e-connectorlineContainer' style='left:{{:ParentLeft+ParentWidth}}px;top:{{:(ParentIndex * RowHeight) +" + taskbarMidpoint + "}}px;" +
                "width:1px;height:{{:~_" + proxy._id + "getHeightValue()}}px;position:absolute' data-connectortype='FFType2'>"
            + "<div class='e-line' style='{{if ~_" + proxy._id + "isMilestoneParent()}}left:-6px;{{/if}}width:{{if ~_" + proxy._id + "isMilestoneParent()}}{{:((ChildLeft +ChildWidth)-(ParentLeft + ParentWidth))+26}}px;{{else}}{{:((ChildLeft +ChildWidth)-(ParentLeft + ParentWidth))+20}}px;{{/if}}border-top:" + lineStroke + "px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='left:{{:((ChildLeft +ChildWidth)-(ParentLeft + ParentWidth))+20}}px;width:0px;border-left:" + lineStroke + "px solid;" +
                "border-top:{{:~_" + proxy._id + "getHeightValue()-" + lineStroke + "}}px solid;border-color:" + lineColor + ";" +
                "position:relative'></div>"
            + "<div class='e-line' style='left:{{if ~_" + proxy._id + "isMilestone()}}{{:((ChildLeft +ChildWidth)-(ParentLeft + ParentWidth))+4}}px;{{else}}{{:((ChildLeft +ChildWidth)-(ParentLeft + ParentWidth))+10}}px;{{/if}}" +
                "width:{{if ~_" + proxy._id + "isMilestone()}}16px;{{else}}10px;{{/if}}" +
                "border-top:" + lineStroke + "px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-connectorline-leftarrow' style='left:{{if ~_" + proxy._id + "isMilestone()}}{{:((ChildLeft +ChildWidth)-(ParentLeft + ParentWidth))-6}}px;{{else}}{{:((ChildLeft +ChildWidth)-(ParentLeft + ParentWidth))}}px;{{/if}}" +
                "border-right: 10px solid " + lineColor + ";top:{{:-6-" + lineStroke + "}}px;" +
                "border-bottom-width:{{:5+" + lineStroke + "}}px;border-top-width:{{:5+" + lineStroke + "}}px;width:0;height:0;position:relative'></div>"
            + "</div>"

            + "{{else ~_" + proxy._id + "getPosition()=='FFType3'}}"
            + "<div class='e-connectorlineContainer' style='left:{{:ChildLeft+ChildWidth}}px;top:{{:(ChildIndex * RowHeight) +" + taskbarMidpoint + "}}px;" +
                "width:1px;height:{{:~_" + proxy._id + "getHeightValue()}}px;position:absolute' data-connectortype='FFType3'>"
            + "<div class='e-connectorline-leftarrow' style='{{if ~_" + proxy._id + "isMilestone()}}left:-6px;{{/if}}border-right: 10px solid " + lineColor + ";" +
                "top:{{:-5-" + lineStroke + "}}px;border-bottom-width:{{:5+" + lineStroke + "}}px;" +
                "border-top-width:{{:5+" + lineStroke + "}}px;width:0;height:0;position:relative'></div>"
            + "<div class='e-line' style='{{if ~_" + proxy._id + "isMilestone()}}left:4px;width:{{:((ParentLeft + ParentWidth) - (ChildLeft + ChildWidth))+16}}px;{{else}}left:10px;width:{{:((ParentLeft + ParentWidth) - (ChildLeft + ChildWidth))+10}}px;{{/if}}top:-" + (13 + ((lineStroke - 1) * 2)) + "px;" +
                "border-top:" + lineStroke + "px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='left:{{:((ParentLeft + ParentWidth) - (ChildLeft + ChildWidth))+20}}px;top:-" + (13 + ((lineStroke - 1) * 2)) + "px;" +
                "width:0px;border-left:" + lineStroke + "px solid;border-top:{{:~_" + proxy._id + "getHeightValue()-" + lineStroke + "}}px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='{{if ~_" + proxy._id + "isMilestoneParent()}}left:{{:((ParentLeft + ParentWidth) - (ChildLeft + ChildWidth))-6}}px;width:26px;{{else}}left:{{:((ParentLeft + ParentWidth) - (ChildLeft + ChildWidth))}}px;width:20px;{{/if}}top:-" + (13 + ((lineStroke - 1) * 2)) + "px;" +
                "border-top:" + lineStroke + "px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "</div>"

            + "{{else ~_" + proxy._id + "getPosition()=='FFType4'}}"
            + "<div class='e-connectorlineContainer' style='left:{{:ParentLeft+ParentWidth}}px;top:{{:(ChildIndex * RowHeight) +" + taskbarMidpoint + "}}px;" +
                "width:1px;height:{{:~_" + proxy._id + "getHeightValue()}}px;position:absolute' data-connectortype='FFType4'>"
            + "<div  class='e-connectorline-leftarrow' style='{{if ~_" + proxy._id + "isMilestone()}}left:{{:((ChildLeft +ChildWidth)-(ParentLeft + ParentWidth))-6}}px;{{else}}left:{{:((ChildLeft +ChildWidth)-(ParentLeft + ParentWidth))}}px;{{/if}}" +
                "border-right: 10px solid " + lineColor + ";top:{{:-5-" + lineStroke + "}}px;" +
                "border-bottom-width:{{:5+" + lineStroke + "}}px;border-top-width:{{:5+" + lineStroke + "}}px;width:0;height:0;" +
                "position:relative'></div>"
            + "<div class='e-line' style='{{if ~_" + proxy._id + "isMilestone()}}left:{{:((ChildLeft +ChildWidth)-(ParentLeft + ParentWidth))+4}}px;width:16px;{{else}}left:{{:((ChildLeft +ChildWidth)-(ParentLeft + ParentWidth))+10}}px;width:10px;{{/if}}top:-" + (13 + ((lineStroke - 1) * 2)) + "px;" +
                "border-top:" + lineStroke + "px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='left:{{:((ChildLeft +ChildWidth)-(ParentLeft + ParentWidth))+20}}px;top:-" + (13 + ((lineStroke - 1) * 2)) + "px;width:0px;border-left:" + lineStroke + "px solid;" +
                "border-top:{{:~_" + proxy._id + "getHeightValue()-" + lineStroke + "}}px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='{{if ~_" + proxy._id + "isMilestoneParent()}}left:-6px;width:{{:((ChildLeft +ChildWidth)-(ParentLeft + ParentWidth))+26}}px;{{else}}width:{{:((ChildLeft +ChildWidth)-(ParentLeft + ParentWidth))+20}}px;{{/if}}top:-" + (13 + ((lineStroke - 1) * 2)) + "px;border-top:" + lineStroke + "px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "</div>"

            + "{{else  ~_" + proxy._id + "getPosition()=='SFType4'}}"//SF
            + "<div class='e-connectorlineContainer' style='left:{{:ParentLeft-10}}px;top:{{:(ChildIndex * RowHeight) +" + taskbarMidpoint + "}}px;width:1px;" +
                "height:{{:~_" + proxy._id + "getHeightValue()}}px;position:absolute' data-connectortype='SFType4'>"
            + "<div class='e-connectorline-leftarrow' style='left:{{if ~_" + proxy._id + "isMilestone()}}{{:((ChildLeft + ChildWidth) - (ParentLeft ))+4}}px;{{else}}{{:((ChildLeft + ChildWidth) - (ParentLeft ))+10}}px;{{/if}}" +
                "border-right: 10px solid " + lineColor + ";top:{{:-5-" + lineStroke + "}}px;" +
                "border-bottom-width:{{:5+" + lineStroke + "}}px;border-top-width:{{:5+" + lineStroke + "}}px;width:0;height:0;" +
                "position:relative'></div>"
            + "<div class='e-line' style='left:{{if ~_" + proxy._id + "isMilestone()}}{{:((ChildLeft + ChildWidth) - (ParentLeft ))+14}}px;width:16px;{{else}}{{:((ChildLeft + ChildWidth) - (ParentLeft ))+20}}px;width:10px;{{/if}}top:-" + (13 + ((lineStroke - 1) * 2)) + "px;" +
                "border-top:" + lineStroke + "px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='left:{{:((ChildLeft + ChildWidth) - (ParentLeft ))+30}}px;top:-" + (13 + ((lineStroke - 1) * 2)) + "px;width:0px;border-left:" + lineStroke + "px solid;" +
                "border-top:{{:~_" + proxy._id + "getHeightValue()-15-" + lineStroke + "}}px solid;border-color:" + lineColor + ";" +
                "position:relative'></div>"
            + "<div class='e-line' style='top:-" + (13 + ((lineStroke - 1) * 2)) + "px;width:{{:((ChildLeft + ChildWidth) - (ParentLeft ))+30}}px;border-top:" + lineStroke + "px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='top:-" + (13 + ((lineStroke - 1) * 2)) + "px;width:0px;border-left:" + lineStroke + "px solid;border-top:{{:15-" + lineStroke + "}}px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='top:-" + (13 + ((lineStroke - 1) * 2)) + "px;width:10px;border-top:" + lineStroke + "px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "</div>"

            + "{{else ~_" + proxy._id + "getPosition()=='SFType3'}}"//SF
            + "<div class='e-connectorlineContainer' style='left:{{:ChildLeft+ChildWidth}}px;top:{{:(ChildIndex * RowHeight) +" + taskbarMidpoint + "}}px;" +
                "width:1px;height:{{:~_" + proxy._id + "getHeightValue()}}px;position:absolute' data-connectortype='SFType3'>"
            + "<div class='e-connectorline-leftarrow' style='{{if ~_" + proxy._id + "isMilestone()}}left:-6px;{{/if}}border-right: 10px solid " + lineColor + ";" +
                "top:{{:-5-" + lineStroke + "}}px;border-bottom-width:{{:5+" + lineStroke + "}}px;" +
                "border-top-width:{{:5+" + lineStroke + "}}px;width:0;height:0;position:relative'></div>"
            + "<div class='e-line' style='{{if ~_" + proxy._id + "isMilestone()}}left:4px;width:16px;{{else}}left:10px;width:10px;{{/if}}top:-" + (13 + ((lineStroke - 1) * 2)) + "px;border-top:" + lineStroke + "px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='left:20px;top:-" + (13 + ((lineStroke - 1) * 2)) + "px;width:0px;border-left:" + lineStroke + "px solid;border-top:{{:~_" + proxy._id + "getHeightValue()-" + lineStroke + "}}px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='left:20px;top:-" + (13 + ((lineStroke - 1) * 2)) + "px;width:{{:(ParentLeft-(ChildLeft + ChildWidth + 20))+" + lineStroke + "}}px;" +
                "border-top:" + lineStroke + "px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "</div>"

            + "{{else  ~_" + proxy._id + "getPosition()=='SFType1'}}"//SF
            + "<div class='e-connectorlineContainer' style='left:{{:ParentLeft-10}}px;top:{{:(ParentIndex * RowHeight) +" + taskbarMidpoint + "}}px;" +
                "width:1px;height:{{:~_" + proxy._id + "getHeightValue()}}px;position:absolute' data-connectortype='SFType1'>"
            + "<div class='e-line' style='width:10px;border-top:" + lineStroke + "px solid;border-color:" + lineColor + ";" +
                "position:relative'></div>"
            + "<div class='e-line' style='width:0px;border-left:" + lineStroke + "px solid;border-top:{{:~_" + proxy._id + "getHeightValue()-15-" + lineStroke + "}}px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='width:{{:((ChildLeft + ChildWidth) - (ParentLeft ))+30}}px;border-top:" + lineStroke + "px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='left:{{:((ChildLeft + ChildWidth) - (ParentLeft ))+30}}px;width:0px;border-left:" + lineStroke + "px solid;" +
                "border-top:{{:15-" + lineStroke + "}}px solid;border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='{{if ~_" + proxy._id + "isMilestone()}}left:{{:((ChildLeft + ChildWidth) - (ParentLeft ))+(15-" + lineStroke +")}}px;width:16px;{{else}}left:{{:((ChildLeft + ChildWidth) - (ParentLeft ))+20}}px;width:10px;{{/if}}border-top:" + lineStroke + "px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-connectorline-leftarrow' style='left:{{if ~_" + proxy._id + "isMilestone()}}{{:((ChildLeft + ChildWidth) - (ParentLeft ))+4}}px;{{else}}{{:((ChildLeft + ChildWidth) - (ParentLeft ))+10}}px;{{/if}}" +
                "border-right: 10px solid " + lineColor + ";top:{{:-6-" + lineStroke + "}}px;" +
                "border-bottom-width:{{:5+" + lineStroke + "}}px;border-top-width:{{:5+" + lineStroke + "}}px;" +
                "width:0;height:0;position:relative'></div>"
            + "</div>"

            + "{{else ~_" + proxy._id + "getPosition()=='SFType2'}}"//SF
            + "<div class='e-connectorlineContainer'  style='left:{{:ChildLeft+ChildWidth}}px;top:{{:(ParentIndex * RowHeight) +" + taskbarMidpoint + "}}px;" +
                "width:1px;height:{{:~_" + proxy._id + "getHeightValue()}}px;position:absolute' data-connectortype='SFType2'>"
            + "<div class='e-line' style='left:{{:((ParentLeft) - (ChildLeft + ChildWidth))-10}}px;width:10px;border-top:" + lineStroke + "px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-line' style='left:{{:((ParentLeft) - (ChildLeft + ChildWidth))-10}}px;width:0px;border-left:" + lineStroke + "px solid;" +
                "border-top:{{:~_" + proxy._id + "getHeightValue()-" + lineStroke + "}}px solid;border-color:" + lineColor + ";" +
                "position:relative'></div>"
            + "<div class='e-line' style='{{if ~_" + proxy._id + "isMilestone()}}left:0px;width:{{:((ParentLeft) - (ChildLeft + ChildWidth))-10}}px;{{else}}left:10px;width:{{:((ParentLeft) - (ChildLeft + ChildWidth))-20}}px;{{/if}}border-top:" + lineStroke + "px solid;" +
                "border-color:" + lineColor + ";position:relative'></div>"
            + "<div class='e-connectorline-leftarrow' style='left:{{if ~_" + proxy._id + "isMilestone()}}-6px;{{else}}0px;{{/if}}border-right: 10px solid " + lineColor + ";" +
                "top:{{:-6-" + lineStroke + "}}px;border-bottom-width:{{:5+" + lineStroke + "}}px;border-top-width:{{:5+" + lineStroke + "}}px;width:0;height:0;position:relative'></div>"
            + "</div>"

            + "{{/if}}";

            connectorContainer += div;
            connectorContainer += "</div>";

            var templates = {};
            templates[this._id + "ConnectorLineTemplate"] = connectorContainer;
            $.templates(templates);
        },

        _isTaskMilestone: function () {
            if (this.data.milestoneChild)
                return true;
            else
                return false;
            
        },

        _isMilestoneParent: function () {
            if (this.data.milestoneParent)
                return true;
            else
                return false;
        },

        _getInnerChildWidthSSType2: function () {
            if ((this.data.ParentLeft + this.data.ParentWidth) < this.data.ChildLeft) {
                return 10;
            }
            if (this.data.ParentLeft == this.data.ChildLeft) {
                return 20;
            }
            if ((this.data.ParentLeft + this.data.ParentWidth) >= this.data.ChildLeft) {
                return 10;
            }
            return (this.data.ChildLeft - this.data.ParentLeft);
        },

        _getInnerElementLeftSSType2: function () {
            if (this.data.ParentLeft == this.data.ChildLeft) {
                return (this.data.ParentLeft - 20);
            }
            return (this.data.ParentLeft - 10);
        },

        _getInnerElementWidthSSType2: function () {
            if (this.data.ParentLeft == this.data.ChildLeft) {
                return 10;
            }
            return (this.data.ChildLeft - this.data.ParentLeft);
        },


        _getContainerWidthSSType2: function () {
            if (this.data.ParentLeft == this.data.ChildLeft) {
                return 20;
            }
            return (this.data.ChildLeft - this.data.ParentLeft);
        },

        _getPredecessorTop: function () {
            if (this.data.ParentIndex > this.data.ChildIndex)
                return true;
            else
                return false;
        },

        _getParentPosition: function () {
            if (this.data.ParentIndex < this.data.ChildIndex) {

                if (this.data.Type == "FF") {
                    if ((this.data.ChildLeft + this.data.ChildWidth) >= (this.data.ParentLeft + this.data.ParentWidth)) {
                        return "FFType2";
                    }
                    else {
                        return "FFType1";
                    }
                }

                else if ((this.data.ParentLeft < this.data.ChildLeft) && (this.data.ChildLeft > (this.data.ParentLeft + this.data.ParentWidth + 25))) {
                    if (this.data.Type == "FS") return "FSType1";
                    if (this.data.Type == "SF") return "SFType1";
                    else if (this.data.Type == "SS") return "SSType2";
                    else if (this.data.Type == "FF") return "FFType2";
                }
                else if ((this.data.ParentLeft < this.data.ChildLeft && (this.data.ChildLeft < (this.data.ParentLeft + this.data.ParentWidth)))
                    || (this.data.ParentLeft == this.data.ChildLeft || this.data.ParentLeft > this.data.ChildLeft)) {

                    if (this.data.ParentLeft > (this.data.ChildLeft + this.data.ChildWidth + 25)) {
                        if (this.data.Type == "SF") return "SFType2";
                    }

                    if (this.data.ParentLeft > this.data.ChildLeft) {
                        if (this.data.Type == "SS") return "SSType1";
                        if (this.data.Type == "SF") return "SFType1";
                        if (this.data.Type == "FF") return "FFType1";
                    }
                    else if ((this.data.ChildLeft + this.data.ChildWidth) > (this.data.ParentLeft + this.data.ParentWidth)) {
                        if (this.data.Type == "FF") return "FFType2";
                    }
                    if (this.data.Type == "FS") return "FSType2";
                    else if (this.data.Type == "SS") return "SSType2";
                    else if (this.data.Type == "FF") return "FFType1";
                    else if (this.data.Type == "SF") return "SFType1";
                }
                else if ((this.data.ParentLeft) < this.data.ChildLeft) {

                    if (this.data.Type == "FS") return "FSType2";
                    else if (this.data.Type == "FF") return "FFType2";
                    else if (this.data.Type == "SS") return "SSType2";
                    else if (this.data.Type == "SF") return "SFType1";
                }

            }
            else if (this.data.ParentIndex > this.data.ChildIndex) {
                if ((this.data.ParentLeft < this.data.ChildLeft) && (this.data.ChildLeft > (this.data.ParentLeft + this.data.ParentWidth))) {
                    if (this.data.Type == "FS")
                        if (30 >= (this.data.ChildLeft - (this.data.milestoneParent ? (this.data.ParentLeft + this.data.ParentWidth + 4) : (this.data.ParentLeft + this.data.ParentWidth))))
                            return "FSType3";
                        else
                            return "FSType4";
                    if (this.data.ParentLeft < this.data.ChildLeft || ((this.data.ChildLeft + this.data.ChildWidth) > (this.data.ParentLeft + this.data.ParentWidth))) {
                        if (this.data.Type == "SS") return "SSType4";
                        if (this.data.Type == "FF") return "FFType4";
                        if (this.data.Type == "SF") return "SFType4";
                    }
                    else if ((this.data.ChildLeft + this.data.ChildWidth) > (this.data.ParentLeft + this.data.ParentWidth)) {
                        if (this.data.Type == "FF") return "FFType4";
                    }
                }
                else if ((this.data.ParentLeft < this.data.ChildLeft && (this.data.ChildLeft < (this.data.ParentLeft + this.data.ParentWidth)))
                    || (this.data.ParentLeft == this.data.ChildLeft || this.data.ParentLeft > this.data.ChildLeft)) {
                    if ((this.data.ChildLeft + this.data.ChildWidth) <= (this.data.ParentLeft + this.data.ParentWidth)) {
                        if (this.data.Type == "FF") return "FFType3";
                        if (this.data.Type == "SF") {
                            if ((this.data.ChildLeft + this.data.ChildWidth + 25) < (this.data.ParentLeft)) {
                                     return "SFType3";
                             } else {
                                return "SFType4";
                            }
                        }
                        if (this.data.Type == "SS") {
                            if (this.data.ChildLeft <= this.data.ParentLeft)
                                return "SSType3";
                            else
                                 return "SSType4";
                        }
                    }
                    else if ((this.data.ChildLeft + this.data.ChildWidth) > (this.data.ParentLeft + this.data.ParentWidth)) {
                        if (this.data.Type == "FF") return "FFType4";
                        if (this.data.Type == "SF") return "SFType4";
                        if (this.data.Type == "SS")
                            if (this.data.ChildLeft <= this.data.ParentLeft)
                                return "SSType3";
                            else
                                return "SSType4";
                    }
                    if (this.data.Type == "FS") return "FSType3";
                }
                else if (this.data.ParentLeft < this.data.ChildLeft) {

                    if (this.data.Type == "FS") return "FSType3";
                    if (this.data.Type == "SS") return "SSType4";
                    if (this.data.Type == "FF") return "FFType4";
                    if (this.data.Type == "SF") return "SFType4";
                }
            }
            return false;
        },

        _getWidth: function () {
            return ((this.data.ChildLeft + this.data.ChildWidth) < (this.data.ParentLeft + this.data.ParentWidth)) ?
                this.data.ParentWidth : (this.data.ChildWidth + this.data.ParentWidth);
        },


        //renders Weekends in chart
        _renderWeekends: function () {
            var proxy = this,
                model = proxy.model,
                left = 0,
                width = (proxy.model.perDayWidth) + 1,
                height = this.getRecordsHeight(),
                count = proxy.model.scheduleWeeks.length,
                $day, saturdayIndex,
                $weekendContainer = ej.buildTag("div.e-secondary_canvas", "", { 'height': height + 'px' }, {}),
                weekStartDay = model.scheduleHeaderSettings.weekStartDay,
                dayIndex = (weekStartDay >= 0 && weekStartDay < 7) ? weekStartDay : 0,
                saturdayIndex = 6 - dayIndex,
                nonWorkDayLength = proxy._nonWorkingDayIndex.length;
            for (var i = 0; i < count; i++) {
                var weeDayIndex;
                for (var j = 0; j < nonWorkDayLength; j++) {
                    if (proxy._nonWorkingDayIndex[j] != 6) {
                        var index = (saturdayIndex + proxy._nonWorkingDayIndex[j] + 1);
                        weeDayIndex = (index >= 7 ? proxy._nonWorkingDayIndex[j] - dayIndex : index);
                    }
                    else
                        weeDayIndex = saturdayIndex;
                    $day = ej.buildTag("div.e-weekends", "", {
                        'left': (left + (proxy.model.perDayWidth * weeDayIndex)) + 'px',
                        'width': width + 'px',
                        'height': height + 'px',
                        'background-color': this.model.weekendBackground
                    }, {});
                    $weekendContainer.append($day);
                }
                left = left + this._scheduleWeekWidth;
            }

            proxy._$weekendsContainer.html($weekendContainer);
            proxy._$bodyContent.append(proxy._$weekendsContainer);
        },



        //Renders StripLines for given striplines collection object
        _renderStripLines: function (stripLines) {

            var proxy = this,
                height = this.getRecordsHeight(),
                stripLineCount = stripLines.length, day, left,
                projectStartDate = proxy.model.projectStartDate,
                dayWidth = this.model.perDayWidth,
                stripLineContainer = ej.buildTag("div.e-stripLines", "", { 'height': height + 'px' }, {});

            for (var i = 0; i < stripLineCount; i++) {

                day = this._getDateFromFormat(stripLines[i].day);
                left = ((day - this._getDateFromFormat(projectStartDate)) / 86400000) * dayWidth;
                stripLines[i].lineWidth = stripLines[i].lineWidth > 30 ? 30 : stripLines[i].lineWidth;

                var stripline = ej.buildTag("div.e-stripline#stripline" + [i] + "", "", {
                    'left': left + 'px',
                    'width': '1px',
                    'height': height + 'px',
                    'border-left-width': stripLines[i].lineWidth + 'px',
                    'border-left-color': stripLines[i].lineColor,
                    'border-left-style': stripLines[i].lineStyle
                }, {});

                var innerspan = ej.buildTag("span.e-striplinespan", stripLines[i].label, {
                    'background-color': stripLines[i].lineColor,
                }, {});

                if (stripLines[i].day && stripLines[i].day.length > 0) {
                    if (stripLines[i].label && stripLines[i].label.length > 0) {
                        stripline.append(innerspan);
                    }
                    stripLineContainer.append(stripline);
                }
            }
            proxy._$stripLineContainer.append(stripLineContainer);
            proxy._$bodyContent.append(proxy._$stripLineContainer);
        },


        //returns progress width for the taskbar
        _getProgressWidth: function (parentwidth, percent) {
            return (parentwidth * percent) / 100;
        },


        //returns progress percentage of the taskbar
        _getProgressPercent: function (parentwidth, progresswidth) {
            return Math.ceil(((progresswidth / parentwidth) * 100).toFixed(2));
        },


        //renders holidays for holiday collection object
        _renderHoliday: function (holiday) {

            var proxy = this, scheduleHeaderType = proxy.model.scheduleHeaderSettings.scheduleHeaderType,
                date = this._getDateFromFormat(holiday.day),
                weekCount = proxy.model.scheduleWeeks.length,
                monthcount = proxy.model.scheduleMonths.length,
                yearcount = proxy.model.scheduleYears.length,
                daycount=proxy.model.scheduleDays.length,
                prevDate = 0,
                left = 0, textLength, text, $holidayContainer, $holidaySpan,
                ganttRecords = proxy.model.updatedRecords.length, height;

            left = ((date - this._getDateFromFormat(proxy.model.projectStartDate)) / 86400000) * this.model.perDayWidth;

            height = this.getRecordsHeight();
            textLength = holiday.label != null ? holiday.label.length : 0;
            if (holiday.background == null)
                holiday.background = "white";


            var holidayLableSelector = ".e-holiday-label";
            /* for rotate holiday lable in ie8 */
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 9) {
                holidayLableSelector = ".e-holiday-label-ie8";
            }
            if (proxy.model.scheduleHeaderSettings.scheduleHeaderType != "day") {
                text = ej.buildTag("div" + holidayLableSelector, holiday.label, {
                    'top': (proxy._getHolidayLabelHeight(textLength)) + 'px',
                }, {});
            }
            else
            {
                text = ej.buildTag("div" + holidayLableSelector, holiday.label, {
                    'bottom': (proxy._getHolidayLabelHeight(textLength)) + 'px',
                }, {});
            }
            $holidayContainer = ej.buildTag("div.e-secondary-canvas-holiday");
            $holidaySpan = ej.buildTag("div.e-holidays", "", {
                'left': left + 'px',
                'width': proxy.model.perDayWidth + 'px',
                'height': height + 'px',
                'background': holiday.background
            }, {});

            if (holiday.label != null)
                $holidaySpan.append(text);
            $holidayContainer.append($holidaySpan);

            proxy._$secondaryCanvas.append($holidayContainer);
            proxy._$bodyContent.append(proxy._$secondaryCanvas);
        },

        _getHolidayLabelHeight: function (textlength) {
            var proxy = this, model = proxy.model,
                containerHeight = proxy._getHeight(),
                totalHeight = model.updatedRecords.length * proxy.model.rowHeight;
            if (containerHeight > 0)
                return (containerHeight / 2);
            else if (proxy._viewportHeight < totalHeight)
                return (proxy._viewportHeight / 2);
            else
                return totalHeight / 2;

        },
        updateWorkWeek:function(workWeek)
        {
            var proxy = this,
                model = proxy.model;
            model.workWeek = workWeek
            proxy._getNonWorkingDayIndex();
        },

        updateDragAndDrop:function(allowDragAndDrop)
        {
            var proxy = this,
                model = proxy.model;
            model.allowDragAndDrop = allowDragAndDrop
        },

        updateVirtualization: function (value, collapseCount) {

            var proxy = this, model = this.model,
                gantt = this.model.ganttInstance;
            model.enableVirtualization = value;
            proxy.setUpdatedRecords(gantt.model.currentViewData, gantt.model.updatedRecords, gantt.model.flatRecords, gantt.model.ids);
            proxy._totalCollapsedRecordCount = collapseCount;

            // change the table top position is 0 and change the update records for non-virtulization mode.
            if (!model.enableVirtualization) {
                proxy._$ganttViewTable.css({ "top": 0 });
                $("#ganttgridLinesTable" + proxy._id).css({ "top": 0 });
            }
            else if (model.enableVirtualization && proxy._scrollTop != 0) {
                proxy._getVisibleRowRange();
                var margin = proxy._scrollTop;
                margin -= proxy._rowMargin;
                $("#ganttViewTable" + proxy._id + "").css({ "top": margin + "px" });
                $("#ganttgridLinesTable" + proxy._id + "").css({ "top": margin + "px" });
            }
            model.selectedRowIndex = gantt.selectedRowIndex();
            proxy.refreshHelper(model.currentViewData, model.updatedRecords, proxy._totalCollapsedRecordCount);
        },

         _getNonWorkingDayIndex:function()
        {
            var proxy = this,
                model = proxy.model,
                weekDay = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
                weekDayLength = weekDay.length,
                workWeek = model.workWeek.slice(),
                length = workWeek.length;
            for (var i = 0; i < length; i++)
                workWeek[i] = workWeek[i].toLowerCase();
            proxy._nonWorkingDayIndex = [];
            for(var i=0;i < weekDayLength;i++)
            {
                if (workWeek.indexOf(weekDay[i]) == -1)
                    proxy._nonWorkingDayIndex.push(i);
            }
        },
        // all events bound using this._on will be unbind automatically
        _destroy: function () {

            var proxy = this;
            proxy.element.off();
            $(document.body).unbind("touchmove", $.proxy(proxy.handleMouseMove, proxy));
            $(document).unbind("mouseup", $.proxy(proxy._tooltipMouseup, proxy));
            $(document.body).bind("touchmove", $.proxy(proxy.handleMouseMove, proxy));
            proxy.element.empty().removeClass("e-ganttchart-core e-ganttchart" + proxy.model.cssClass);

            $("#" + this._id + "_connectorLineEdit_wrapper").clearQueue();
            $("#" + this._id + "_connectorLineEdit_wrapper").stop();
            $("#" + proxy._id + "_connectorLineEdit").data("ejDialog") && $("#" + proxy._id + "_connectorLineEdit").data("ejDialog").destroy();
            $("#" + proxy._id + "_connectorLineEdit").remove();
            $("#" + this._id + "_connectorLineEdit_wrapper").remove();
            $("#" + this._id + "_connectorLineEdit_type_popup_wrapper").remove();

        },

        _renderConnectorDialog: function (e) {
            var proxy = this, model = proxy.model,
                args = {}, posX, posY, editDialogText = model.connectorLineDialogText;

            var predecessorEditDialog = ej.buildTag("div.e-connectordialog", "", { "width": "300px" }, { id: this._id + "_connectorLineEdit" });

            var $predecessorEditForm = ej.buildTag("div", "", {}, { id: this._id + "_connectorLineEditForm" }),
                $fromTable = ej.buildTag("table.e-zerospace", "", {}),
                $tbody = ej.buildTag("tbody", "", {});

            $fromTable.append($tbody);
            var $tr1 = ej.buildTag("tr", "", {});
            $tbody.append($tr1);
            $tr1.append("<td class='e-editlabel'><div>" + editDialogText.from + "</div></td>");
            $tr1.append("<td class='e-editlabel'>:</td>");
            $tr1.append("<td class='e-editvalue' ><div id='" + this._id + "_connectorLineEdit_from'></div></td>");

            var $tr2 = ej.buildTag("tr", "", {});
            $tbody.append($tr2);
            $tr2.append("<td class='e-editlabel'><div>" + editDialogText.to + "</div></td>");
            $tr2.append("<td class='e-editlabel'>:</td>");
            $tr2.append("<td class='e-editvalue'><div id='" + this._id + "_connectorLineEdit_to'></div></td>");

            var $tr3 = ej.buildTag("tr", "", {});
            $tbody.append($tr3);
            $tr3.append("<td class='e-editlabel'><div>" + editDialogText.type + "</div></td>");
            $tr3.append("<td class='e-editlabel'>:</td>");
            $tr3.append("<td class='e-editvalue'><input id='" + this._id + "_connectorLineEdit_type'/></td>");

            var $tr4 = ej.buildTag("tr", "", {});
            $tbody.append($tr4);
            $tr4.append("<td class='e-editlabel'><div>" + editDialogText.lag + "</div></td>");
            $tr4.append("<td class='e-editlabel'>:</td>");
            $tr4.append("<td class='e-editvalue'><input class='e-field e-ejinputtext' id='" + this._id + "_connectorLineEdit_lag'/></td>");
            $predecessorEditForm.append($fromTable);
            var okButton = ej.buildTag('input.e-editform-btn', "", {},
                { type: "button", value: editDialogText.okButtonText, id: this._id + "_connectorLineEdit_ok" }),
                cancelButton = ej.buildTag('input.e-editform-btn', "", { 'margin-left': '15px', },
                    { type: "button", value: editDialogText.cancelButtonText, id: this._id + "_connectorLineEdit_cancel" }),
                deleteButton = ej.buildTag('button', "", { 'border-radius': '3px', },
                    { title: editDialogText.deleteButtonText, id: this._id + "_connectorLineEdit_delete" });

            var $buttonTable = ej.buildTag("table", "", { 'width': '100%' }),
                $btnBody = ej.buildTag("tbody");
            $buttonTable.append($btnBody);
            var btnDiv = ej.buildTag('div', "", { 'float': 'right', "z-index": "10", "margin-top": "10px" });
            var deleteBtnDiv = ej.buildTag('div', "", { 'float': 'left', "z-index": "10", "margin-top": "10px" });

            btnDiv.append(okButton);
            deleteBtnDiv.append(deleteButton);
            btnDiv.append(cancelButton);
            btnDiv.appendTo($btnBody);
            deleteBtnDiv.appendTo($btnBody);
            $predecessorEditForm.append($buttonTable);
            predecessorEditDialog.append($predecessorEditForm);
            args.requestType = "beforeDependencyEditDialogOpen";
            args.data = proxy._predecessorInfo;
            if (proxy._trigger("actionBegin", args)) {
                proxy._clearConnectorLineSelection();
                return;
            }
            predecessorEditDialog.insertAfter(proxy.element);
            proxy._renderConnectorDialogElements(predecessorEditDialog, args.data);

            if (e.pageX && e.pageY) {
                posX = e.pageX;
                posY = e.pageY;
            }

            var title = editDialogText.title;
            var dialogArgs = {};
            dialogArgs.enableResize = false;
            dialogArgs.enableRTL = false;
            dialogArgs.maxWidth = 300;
            dialogArgs.width = 300;
            dialogArgs.title = title;
            dialogArgs.position = { X: posX, Y: posY };
            dialogArgs.enableAnimation = false;
            dialogArgs.cssClass = proxy.model.cssClass;
            dialogArgs.beforeOpen = function () {
                var dialogWrapper = $("#" + proxy._id + "_connectorLineEdit_wrapper"),
                    position = {};
                dialogWrapper.addClass("e-ganttdialog");
                position.x = posX; position.y = posY;
                proxy._calculateConnectorDialogPosition(this, dialogWrapper, position);                
            },
            dialogArgs.beforeClose = function () {
                proxy._clearConnectorLineSelection();                
            };
            predecessorEditDialog.ejDialog(dialogArgs);
            proxy._isPredecessorEditOpen = true;
            args.requestType = "afterDependencyEditDialogOpen";
            args.element = predecessorEditDialog;

            if (!proxy._trigger("actionBegin", args)) {

                $(predecessorEditDialog).ejDialog("refresh");
                predecessorEditDialog = args.element;
            }
        },

        _calculateConnectorDialogPosition: function (dialogObj, $dialog, position) {

            var proxy = this, model = proxy.model,
                ganttObj = model.ganttInstance, ganttOffset = {}, dialogOffset = {},
                dialogHeight, dialogWidth;

            ganttOffset = proxy._getOffsetRect(ganttObj.element[0]);
            ganttOffset.bottom = ganttOffset.top + ganttObj.element[0].offsetHeight;
            ganttOffset.right = ganttOffset.left + $(ganttObj.element).width();

            dialogHeight = $($dialog).outerHeight(),
            dialogWidth = $($dialog).outerWidth();
            dialogOffset = proxy._getOffsetRect($dialog[0]);

            var left = position.x, top = position.y,
                bottom = top + dialogHeight, right = left + dialogWidth;


            if (ganttOffset.right < right) {
                if ((left - dialogWidth) > ganttOffset.left) {
                    left -= dialogWidth;
                }
                else {
                    var diff = Math.abs(right - ganttOffset.right);
                    left -= diff;
                }
            }
            else if (($(window).width() + $(window).scrollLeft()) < right) {
                var diff = Math.abs(right - ($(window).width() + $(window).scrollLeft()));
                left -= diff;
            }

            if (ganttOffset.bottom < bottom) {
                if (top - dialogHeight > ganttOffset.top) {
                    top -= dialogHeight;
                }
                else {
                    var diff = Math.abs(bottom - ganttOffset.bottom);
                    top -= diff;
                }
            }

            else if (($(window).height() + $(window).scrollTop()) < bottom) {
                var diff = Math.abs(bottom - ($(window).height() + $(window).scrollTop()));
                top -= diff;
            }

            dialogObj.setModel({ "position": { X: left, Y: top } });
        },

        _renderConnectorDialogElements: function ($element, data) {
            var proxy = this,
                model = proxy.model,
                predecessorCollectionText = model.predecessorCollectionText;

            $($element).find("#" + this._id + "_connectorLineEdit_delete").ejButton({
                size: "normal",
                contentType: "imageonly",
                prefixIcon: "e-icon e-deleteline",
                cssClass: proxy.model.cssClass,
                click: function () {
                    data.requestType = "delete";
                    proxy._predecessorEdited(data);
                    proxy.closePredecessorDialog();
                }
            });
            $($element).find("#" + this._id + "_connectorLineEdit_ok").ejButton({
                size: "normal",
                cssClass: proxy.model.cssClass,
                click: function (args) {
                    var lag = $("#" + proxy._id + "_connectorLineEdit_lag").val();
                    data.offset = lag;
                    data.requestType = "updateDependencyValue";
                    proxy._predecessorEdited(data);
                    proxy.closePredecessorDialog();
                }
            });
            $($element).find("#" + this._id + "_connectorLineEdit_cancel").ejButton({
                size: "normal",
                cssClass: proxy.model.cssClass,
                click: function () {
                    proxy.closePredecessorDialog();
                }
            });
            $($element).find("#" + this._id + "_connectorLineEdit_type").ejDropDownList({
                dataSource: predecessorCollectionText,
                fields: { text: "text", value: "id" },
                value: data.linkType,
                cssClass: proxy.model.cssClass,
                change: function (args) {
                    data.linkType = args.value;
                    data.linkText = args.text;
                },
                width: "100%"
            });
            var lag = proxy._getOffsetValue(data),
                fromId = ej.isNullOrUndefined(data.fromSno) ? data.fromId : data.fromSno,
                toId = ej.isNullOrUndefined(data.toSno) ? data.toId : data.toSno,
                fromName = data.fromName,
                from = fromName.length > 25 ? fromName.substring(0, 20) + "..." : fromName,
                from = from + " (" + fromId + ")",
                toName = data.toName,
                to = toName.length > 25 ? toName.substring(0, 20) + "..." : toName,
                to = to + " (" + toId + ")";
            $($element).find("#" + this._id + "_connectorLineEdit_lag").css("width", "50%").val(lag);
            $($element).find("#" + this._id + "_connectorLineEdit_from").text(from);
            $($element).find("#" + this._id + "_connectorLineEdit_from").attr({ "title": fromName });
            $($element).find("#" + this._id + "_connectorLineEdit_to").text(to);
            $($element).find("#" + this._id + "_connectorLineEdit_to").attr({ "title": toName });
        },
        closePredecessorDialog: function () {
            var proxy = this;
            $("#" + proxy._id + "_connectorLineEdit").ejDialog("close");
            //proxy._predecessorInfo = null;
            proxy._isPredecessorEditOpen = false;
            proxy._clearConnectorLineSelection();
        },
        _predecessorEdited: function (args) {
            if (args.requestType == "delete") {
                this.model.ganttInstance.deleteDependency(args.fromId, args.toId);
            }
            else if (args.requestType == "updateDependencyValue") {
                this.model.ganttInstance.updateDependency(args.fromId, args.toId, args.linkType, args.offset);
            }
        },
        _clearConnectorLineSelection: function () {
            var proxy = this;
            $(proxy._hoverConnectorLineElement).find(".e-line").removeClass("e-connectorline-hover");
            if ($(proxy._hoverConnectorLineElement).find(".e-connectorline-rightarrow").length > 0)
                $(proxy._hoverConnectorLineElement).find(".e-connectorline-rightarrow").removeClass("e-connectorline-rightarrow-hover");
            else
                $(proxy._hoverConnectorLineElement).find(".e-connectorline-leftarrow").removeClass("e-connectorline-leftarrow-hover");
        }
    });

    if (ej.ganttChartFeatures.timescale)
        $.extend(ej.GanttChart.prototype, ej.ganttChartFeatures.timescale);
    if (ej.ganttChartFeatures.resourceViewGantt)
        $.extend(ej.GanttChart.prototype, ej.ganttChartFeatures.resourceViewGantt);
    jQuery.uaMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
            [];

        return {
            browser: match[1] || "",
            version: match[2] || "0"
        };
    };

})(jQuery, Syncfusion);