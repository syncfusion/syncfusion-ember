/**
* @fileOverview Plugin to style the Html Pivot Chart elements
* @copyright Copyright Syncfusion Inc. 2001 - 2013. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {

    ej.widget("ejPivotChart", "ej.PivotChart", {

        _rootCSS: "e-pivotchart",
        element: null,
        model: null,
        _requiresID: true,		
        validTags: ["div", "span"],
        defaults: $.extend(ej.datavisualization.Chart.prototype.defaults, {
            url: "",
            analysisMode: "pivot",
            operationalMode: "clientmode",
            cssClass: "",
            currentReport: "",
            customObject: {},
            enableRTL:false,
            enableDefaultValue:false,
            isResponsive: false,
            enable3D: false,
            enableContextMenu: false,
            enableMultiLevelLabels: false,
            enableXHRCredentials: false,
            rotation: 0,
            serviceMethodSettings: {
                initialize: "InitializeChart",
                drillDown: "DrillChart",
                exportPivotChart: "Export",
                paging: "paging"
            },
            dataSource: {
                data: null,
                sourceInfo: "",
                providerName: "ssas",
                isFormattedValues: false,
                columns: [],
                cube: "",
                catalog: "",
                rows: [],
                values: [],
                filters: []
            },
            locale: null,
            drillSuccess: null,
            load: null,
            beforeServiceInvoke: null,
            afterServiceInvoke: null,
            renderComplete: null,
            renderFailure: null,
            renderSuccess: null,
            beforeExport:null,
            beforeSeriesRender: null,
            beforePivotEnginePopulate: null
        }),

        dataTypes: {
            dataSource: {
                data: "data",
                columns: "array",
                rows: "array",
                values: "array",
                filters: "array"
            },
            marker: "data",
            crossHair: "data",
            size: "data",
            serviceMethodSettings: {
                initialize: "enum",
                drillDown: "enum",
                exportPivotChart: "enum",
                paging: "enum"
            },
            zooming: "data",
            customObject: "data"
        },

        observables: ["title.text", "commonSeriesOptions.type", "locale"],
        titleText: ej.util.valueFunction("title.text"),
        seriesType: ej.util.valueFunction("commonSeriesOptions.type"),
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

        getPivotEngine: function () {
            return this._pivotEngine;
        },

        setPivotEngine: function (value) {
            this._pivotEngine = value;
        },

        _init: function () {
            this._initPrivateProperties();
            this._load();
        },

        _destroy: function () {
            this._pivotEngine = null;
            this.element.empty().removeClass("e-pivotchart" + this.model.cssClass).removeAttr("tabindex");
            if (this._waitingPopup != undefined) this._waitingPopup.destroy();
            if (this.element.attr("class") == "") this.element.removeAttr("class");
        },

        _initPrivateProperties: function () {
            this._id = this.element.attr("id");
            this._olapReport = "";
            this._JSONRecords = null;
            this._currentAction = "initialize";
            this._selectedItem = "";
            this._selectedIndex = -1;
            this._selectedTagInfo = null;
            this._tagCollection = new Array();
            this._selectedTags = new Array();
            this._labelCurrentTags = new Array();
            this._startDrilldown = false;
            this._drillAction = "";
            this._initZooming = false;
            this._dimensionIndex = -1;
            this._selectedMenuItem = "";
            this._pivotEngine = null;
            this._curFocus = null;
            this._prevDrillElements = [];
            this._drillParams = [];
            this._currentDrillInfo = [];
            this._selectedSeriesInfo = new Array();
            this._waitingPopup = null;
            this._pivotClientObj = null;
            this._xTitle = null;
            this._yTitle = null;
            this._pagingSavedObjects = {
                drillEngine: [],
                savedHdrEngine: [],
                curDrilledItem: {}
            };
        },

        _load: function () {
            this.model.locale = ((!ej.isNullOrUndefined(ej.util.getVal(this.locale()))) && $.isFunction(this.locale)) ? this.locale() : "en-US";
            var eventArgs = { action: "initialize", element: this.element, customObject: this.model.customObject };
            this._trigger("load", eventArgs);
            this.element.addClass(this.model.cssClass);

            if ($(this.element).parents(".e-pivotclient").length > 0) {
                this._pivotClientObj = $(this.element).parents(".e-pivotclient").data("ejPivotClient");
                if ($("#" + this._pivotClientObj._id + "_maxView")[0])
                    $("#" + this._pivotClientObj._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                else if (!ej.isNullOrUndefined(this._waitingPopup))
                    this._waitingPopup.show();
            }
            else {
                this.element.ejWaitingPopup({ showOnInit: true });
                this._waitingPopup = this.element.data("ejWaitingPopup");
                this._waitingPopup.show();
            }
            if (this.model.zooming != "")
                this._initZooming = true;
            if ((this.model.dataSource.data == null && this.model.url != "") || (this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode)) {
                this.model.operationalMode = ej.PivotChart.OperationalMode.ServerMode;
                if (this.model.url == "") {
                    this.renderChartFromJSON("");
                    return;
                }
                if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode)
                    this._trigger("beforeServiceInvoke", { action: this._currentAction, element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                if (this.model.customObject != "" && this.model.customObject != null && this.model.customObject != undefined)
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.initialize, JSON.stringify({ "action": "initialize", "currentReport": this.model.currentReport, "customObject": serializedCustomObject }), (this.model.enableMultiLevelLabels && this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot ? this._generateData : this.renderControlSuccess));
                else
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.initialize, JSON.stringify({ "action": "initialize" }), (this.model.enableMultiLevelLabels && this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot ? this._generateData : this.renderControlSuccess));
            }
            else {
                this.model.operationalMode = ej.PivotChart.OperationalMode.ClientMode;
                this.model.analysisMode = this.model.dataSource.cube != "" ? ej.PivotChart.AnalysisMode.Olap : ej.PivotChart.AnalysisMode.Pivot;
                this.refreshControl();
            }
        },

        refreshControl: function () {
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                ej.PivotAnalysis.setFieldCaptions(this.model.dataSource);
                if (!ej.isNullOrUndefined(this._pivotClientObj))
                    this.model.valueSortSettings = this._pivotClientObj.model.valueSortSettings;
                var data = ej.PivotAnalysis.pivotEnginePopulate(this.model);
                var pivotClientObj = ($(this.element).parents(".e-pivotclient").length > 0) ? $(this.element).parents(".e-pivotclient").data("ejPivotClient") : null;
                this._pivotEngine = data.pivotEngine;
                if (data.pivotEngine.length > 0) {
                    if (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers) && !this.model.enableMultiLevelLabels) {
                        var clonedEngine = this._cloneEngine(this._pivotEngine);
                        for (var i = 0; i < this._labelCurrentTags.expandedMembers.length; i++)
                            this._cropData(clonedEngine, this._labelCurrentTags.expandedMembers[i], 0, true);
                        this._generateData(clonedEngine);
                    }
                    else
                        this._generateData(this._pivotEngine);
                }
                else if (!ej.isNullOrUndefined(this._waitingPopup)) {
                    if (!ej.isNullOrUndefined(pivotClientObj)) pivotClientObj._isTimeOut = false;
                    this._waitingPopup.hide();
                }
            }
            else
                ej.olap.base.getJSONData({ action: "initialLoad" }, this.model.dataSource, this);
        },

        _setFirst: false,

        _setModel: function (options) {
            var chartObj = this.element.find("#" + this._id + "Container").data("ejChart");
            for (var key in options) {
                switch (key) {
                    case "olapReport": { this.setOlapReport(options[key]); this._load(); break; }
                    case "jsonData": { this.setJSONRecords(options[key]); this.element.renderChartFromJSON(options[key]); break; }
                    case "refreshPivotChart": this.element.renderChartFromJSON(options[key]); break;
                    case "customObject": this.model.customObject = options[key]; break;
                    case "height": {
                        this.model.size.height = options[key];
                        if (chartObj) chartObj.redraw();
                        break;
                    }
                    case "width": {
                        this.model.size.width = options[key];
                        if (chartObj) chartObj.redraw();
                        break;
                    }
                    case "enableDefaultValue": { this.model.enableDefaultValue = options[key]; break; }
                    case "operationalMode": this.model.operationalMode = options[key]; break;
                    case "analysisMode": this.model.analysisMode = options[key]; break;
                    case "commonSeriesOptions":
                        {
                            if (chartObj) {
                                if ((!ej.isNullOrUndefined(ej.util.getVal(options[key]).type)) && $.isFunction((ej.util.getVal(options[key]).type)))
                                    this.seriesType((options[key]).type());
                                else if (!ej.isNullOrUndefined(options[key].type))
                                    this.seriesType(options[key].type);
                                chartObj.model.commonSeriesOptions = $.extend({},chartObj.model.commonSeriesOptions, options[key]);
                                chartObj.model.type = chartObj.model.commonSeriesOptions.type = this.seriesType();
                                for (var i = 0; i < chartObj.model.series.length; i++)
                                    chartObj.model.series[i].type = chartObj.model.type;
                                chartObj.redraw();
                            } break;
                        }
                    case "title":
                        {
                            if (chartObj) {
                                if ((!ej.isNullOrUndefined(ej.util.getVal(options[key]).text)) && $.isFunction((ej.util.getVal(options[key]).text)))
                                    this.titleText((options[key]).text());
                                else if (!ej.isNullOrUndefined(options[key].text))
                                    this.titleText(options[key].text);
                                chartObj.model.title.text = this.titleText();
                                chartObj.redraw();
                            }
                            break;
                        }
                    case "animation": this.model.animation = options[key]; break;
                    case "crossHair": this.model.crossHair = options[key]; break;
                    case "marker": this.model.marker = options[key]; break;
                    case "zooming": this.model.zooming = options[key]; break;
                    case "legend": this.model.legend = options[key]; break;
                    case "primaryXAxis": this.model.primaryXAxis = options[key]; break;
                    case "primaryYAxis": this.model.primaryYAxis = options[key]; break;
                    case "dataSource": {
                        this.model.dataSource = ($.extend({}, this.model.dataSource, options[key]));
                        this.refreshControl();
                        if (this._schemaData)
                            this._schemaData._load();
                        break;
                    }
                    case "locale":
                        {
                            this.locale(ej.util.getVal(options[key]));
                            this._load();
                            break;
                        }
                    case "enableRTL": {
                        this.model.enableRTL = options[key];
                        this._load();
                        break;
                    }
                    case "isResponsive": {
                        this.model.isResponsive = options[key];
                        if (chartObj) chartObj.redraw();
                        break;
                    }
                    case "enable3D": {
                        this.model.enable3D = options[key];
                        if (chartObj) chartObj.redraw();
                        break;
                    }
                    case "enableContextMenu": {
                        this.model.enableContextMenu = options[key];
                        if (chartObj) chartObj.redraw();
                        break;
                    }
                    case "enableMultiLevelLabels": {
                        this.model.enableMultiLevelLabels = options[key];
                        this._load();
                        break;
                    }
                    case "rotation": {
                        this.model.rotation = options[key];
                        if (chartObj) chartObj.redraw();
                        break;
                    }
                    default:
                        { $.extend(true, this.model, {}, options[key]); }
                }
            }
            if (chartObj)
                this.renderControlSuccess({ "JsonRecords": JSON.stringify(this.getJSONRecords()), "OlapReport": this.getOlapReport() });
        },

        _keyDownPress: function (e) {
            if (e.which === 13 && (!ej.isNullOrUndefined(this._curFocus))) {
                this._curFocus.click();
            }
            if ((e.which === 39 || e.which === 37 || e.which === 38 || e.which === 40) && this.element.find(".e-dialog").length > 0) {
                e.preventDefault();
                var menu = this.element.find(".e-dialog");
                menu.tabindex = -1;
                menu.focus();
                var focEle = menu.find("li");
                var next;
                if (e.which === 39 || e.which === 40) {
                    if (!ej.isNullOrUndefined(this._curFocus)) {
                        this._curFocus.removeClass("e-hoverCell");
                        next = this._curFocus.next();
                        if (next.length > 0) {
                            this._curFocus = next;
                        }
                        else {
                            this._curFocus = focEle.eq(0);
                        }
                    }
                    else {
                        this._curFocus = focEle.eq(0);
                    }
                    this._curFocus.addClass("e-hoverCell");
                }
                else if (e.which === 37 || e.which === 38) {
                    if (!ej.isNullOrUndefined(this._curFocus)) {
                        this._curFocus.removeClass("e-hoverCell");
                        next = this._curFocus.prev();
                        if (next.length > 0) {
                            this._curFocus = next;
                        }
                        else {
                            this._curFocus = focEle.last();
                        }
                    }
                    else {
                        this._curFocus = focEle.last();
                    }
                    this._curFocus.addClass("e-hoverCell");
                }
            }
        },

        _wireEvents: function () {
            this._on($(document), 'keydown', this._keyDownPress);
            if (this.model.enableContextMenu && !(this.element.parents(".e-pivotclient").length > 0)) {
                this._on(this.element, "contextmenu", "#" + this._id + "Container", ej.proxy(function (evt) {
                    var chartTypes = "<li class='chartTypes'><a>" + this._getLocalizedLabels("ChartTypes") + "</a><ul><li class='e-line'><a>" + this._getLocalizedLabels("Line") + "</a></li><li class='e-spline'><a>" + this._getLocalizedLabels("Spline") + "</a></li>" +
                        "<li class='e-column'><a>" + this._getLocalizedLabels("Column") + "</a></li><li class='e-area'><a>" + this._getLocalizedLabels("Area") + "</a></li><li class='e-splinearea'><a>" + this._getLocalizedLabels("SplineArea") + "</a></li><li class='e-stepline'><a>" + this._getLocalizedLabels("StepLine") + "</a></li>" +
                        "<li class='e-steparea'><a>Step Area</a></li><li class='e-pie'><a>Pie</a></li><li class='e-bar'><a>Bar</a></li><li class='e-stackingarea'><a>Stacking Area</a></li>" +
                        "<li class='e-stackingcolumn'><a>" + this._getLocalizedLabels("StackingColumn") + "</a></li><li class='e-stackingbar'><a>" + this._getLocalizedLabels("StackingBar") + "</a></li><li class='e-funnel'><a>" + this._getLocalizedLabels("Funnel") + "</a></li>" +
                        "<li class='e-pyramid'><a>" + this._getLocalizedLabels("Pyramid") + "</a></li><li class='e-doughnut'><a>" + this._getLocalizedLabels("Doughnut") + "</a></li><li class='e-scatter'><a>" + this._getLocalizedLabels("Scatter") + "</a></li><li class='e-bubble'><a>" + this._getLocalizedLabels("Bubble") + "</a></li></ul></li>";
                    var chart3DTypes = "<li class='chart3DTypes'><a>" + this._getLocalizedLabels("TDCharts") + "</a><ul><li class='e-column'><a>" + this._getLocalizedLabels("ColumnTD") + "</a></li><li class='e-pie'><a>" + this._getLocalizedLabels("PieTD") + "</a></li><li class='e-bar'><a>" + this._getLocalizedLabels("BarTD") + "</a></li><li class='e-stackingbar'><a>"+this._getLocalizedLabels("StackingBarTD")+"</a></li>" +
                        "<li class='e-stackingcolumn'><a>" + this._getLocalizedLabels("StackingColumnTD") + "</a></li><li class='e-disable3D'><a>" + this._getLocalizedLabels("DisableTD") + "</a></li></ul></li>";
                    var exportTypes = "<li class='exportTypes'><a>" + this._getLocalizedLabels("Exporting") + "</a><ul><li class='e-excel'><a>" + this._getLocalizedLabels("Excel") + "</a></li><li class='e-word'><a>" + this._getLocalizedLabels("Word") + "</a></li><li class='e-pdf'><a>" + this._getLocalizedLabels("Pdf") + "</a></li><li class='e-png'><a>" + this._getLocalizedLabels("PNG") + "</a></li>" +
                        "<li class='e-emf'><a>" + this._getLocalizedLabels("EMF") + "</a></li><li class='e-gif'><a>" + this._getLocalizedLabels("GIF") + "</a></li><li class='e-jpg'><a>" + this._getLocalizedLabels("JPG") + "</a></li><li class='e-bmp'><a>" + this._getLocalizedLabels("BMP") + "</a></li></ul></li>";
                    var smartLabels = "<li class='e-smartLabels'><a>" + this._getLocalizedLabels("SmartLabels") + "</a><ul><li class='e-rotate45'><a>" + this._getLocalizedLabels("Rotate45") + "</a></li><li class='e-rotate90'><a>" + this._getLocalizedLabels("Rotate90") + "</a></li><li class='e-trim'><a>" + this._getLocalizedLabels("Trim") + "</a></li><li class='e-multipleRows'><a>" + this._getLocalizedLabels("MultipleRows") + "</a></li>" +
                        "<li class='e-wrap'><a>" + this._getLocalizedLabels("Wrap") + "</a></li><li class='e-hiding'><a>" + this._getLocalizedLabels("Hide") + "</a></li><li class='e-wrapByWord'><a>" + this._getLocalizedLabels("WrapByWord") + "</a></li></ul></li>";
                    var interaction = "<li class='e-interaction'><a>" + this._getLocalizedLabels("Interactions") + "</a><ul><li class='e-crossHair'><a>" + this._getLocalizedLabels("CrossHair") + "</a></li><li class='e-trackBall'><a>" + this._getLocalizedLabels("TrackBall") + "</a></li><li class='none'><a>" + this._getLocalizedLabels("None") + "</a></li></ul></li>";
                    var listContext = ej.buildTag("ul#" + this._id + "_ContextMenu",
                        ej.buildTag("li.e-toolTip", ej.buildTag("a", this._getLocalizedLabels("Tooltip"))[0].outerHTML)[0].outerHTML +
                        ej.buildTag("li.e-legend", ej.buildTag("a", this._getLocalizedLabels("Legend"))[0].outerHTML)[0].outerHTML +
                        (!this.model.enable3D?ej.buildTag("li.e-zooming", ej.buildTag("a", this._getLocalizedLabels("Zooming"))[0].outerHTML)[0].outerHTML:"") +
                        chartTypes + chart3DTypes + exportTypes + (!this.model.enable3D?(interaction + smartLabels):""))[0].outerHTML;

                    $("#" + this._id).append(listContext);
                    var ele = this.element.find("#" + this._id + "Container");

                    this.element.find("#" + this._id + "_ContextMenu").ejMenu({
                        width: "150px",
                        menuType: ej.MenuType.ContextMenu,
                        contextMenuTarget: ele,
                        enableRTL: this.model.enableRTL,
                        click: ej.proxy(this._contextMenuClick, this)
                    });
                    var enabledState = ej.buildTag("span.e-enabledState").addClass("e-icon").attr("aria-label", this._getLocalizedLabels("EnabledState"))[0].outerHTML;
                    if (this.model.enable3D)
                        $("#" + this._id + "_ContextMenu").find(".chart3DTypes ." + this.model.commonSeriesOptions.type + " a:eq(0)").append(enabledState);
                    else
                        $("#" + this._id + "_ContextMenu").find(".chartTypes ." + this.model.commonSeriesOptions.type + " a:eq(0)").append(enabledState);
                    if (this.model.commonSeriesOptions.tooltip.visible)
                        $("#" + this._id + "_ContextMenu").find(".e-toolTip a:eq(0)").append(enabledState);
                    if (this.model.zooming.enable)
                        $("#" + this._id + "_ContextMenu").find(".e-zooming a:eq(0)").append(enabledState);
                    if (this.model.legend.visible)
                        $("#" + this._id + "_ContextMenu").find(".e-legend a:eq(0)").append(enabledState);
                    if (this.model.primaryXAxis.labelIntersectAction != "none") {
                        $("#" + this._id + "_ContextMenu").find(".e-smartLabels a:eq(0)").append(enabledState);
                        $("#" + this._id + "_ContextMenu").find(".e-smartLabels ." + this.model.primaryXAxis.labelIntersectAction + " a:eq(0)").append(enabledState);
                        if (this.model.primaryXAxis.labelIntersectAction=="hide")
                            $("#" + this._id + "_ContextMenu").find(".e-smartLabels .e-hiding a:eq(0)").append(enabledState);
                    }
                    if (this.model.crosshair.type == "crosshair" && this.model.crosshair.visible) {
                        $("#" + this._id + "_ContextMenu").find(".e-interaction a:eq(0)").append(enabledState);
                        $("#" + this._id + "_ContextMenu").find(".e-interaction .e-crossHair a:eq(0)").append(enabledState);
                        if(!this.mode.enable3D)
                            $("#" + this._id + "_ContextMenu").ejMenu("disableItem", this._getLocalizedLabels("Tooltip"));
                    }
                    if (this.model.crosshair.type == "trackBall" && this.model.crosshair.visible) {
                        $("#" + this._id + "_ContextMenu").find(".e-interaction a:eq(0)").append(enabledState);
                        $("#" + this._id + "_ContextMenu").find(".e-interaction .e-trackBall a:eq(0)").append(enabledState);
                        if (!this.mode.enable3D)
                            $("#" + this._id + "_ContextMenu").ejMenu("disableItem", this._getLocalizedLabels("Tooltip"));
                    }
                    if (!this.model.crosshair.visible) {
                        $("#" + this._id + "_ContextMenu").find(".e-interaction .none a:eq(0)").append(enabledState);
                    }
                }));
            }
            this._on(this.element, "click", ".e-menuList.exp, .e-menuList.clp, .e-menuList.exit", this._seriesContextClick);
            if (ej.isNullOrUndefined(this._pivotClientObj))
                $(window).on('resize', $.proxy(this._reSizeHandler, this));
            
            
                this._on(this.element, "click", ".e-chart3DImg", function (evt) {
                    var pivotchrt = this;
                    pivotchrt._createDialog(evt);
                    $(".e-chart3DTypesIcon").click(function (e) {
                        pivotchrt._contextMenuClick(e);
                        if (!ej.isNullOrUndefined(this._pivotClientObj)) {
                            pivotchrt._pivotClientObj._unWireEvents();
                            pivotchrt._pivotClientObj._wireEvents();
                        }
                    });
                });

                if (this.element.parents(".e-pivotclient").length > 0 && this._pivotClientObj.model.enableToolBar && !this._pivotClientObj.model.displaySettings.enableFullScreen) {
                    this._on(this.element, "click", ".e-toolTipImg", function (evt) {
                        var pivotchart = this;
                        this.model.commonSeriesOptions.tooltip.visible = !this.model.commonSeriesOptions.tooltip.visible;
                        this.renderControlSuccess({ "JsonRecords": JSON.stringify(this.getJSONRecords()), "OlapReport": this.getOlapReport() });
                        if (this.model.commonSeriesOptions.tooltip.visible)
                            this.element.find(".e-toolTipImg").addClass("e-enabled");
                        else
                            this.element.find(".e-toolTipImg").removeClass("e-enabled");
                     });
                this._on(this.element, "click", ".e-exportImg", function (evt) {
                    var pivotChart = this;
                    pivotChart._createDialog(evt);
                 $(".e-exportTypesIcon").click(function (e) {
                        pivotChart._contextMenuClick(e);
                    });
                });
                this._on(this.element, "click", ".e-smartLabels", function (evt) {
                    var pivotChart = this;
                    pivotChart._createDialog(evt);
                    $(".e-smartLabelsIcon").click(function (e) {
                        pivotChart._contextMenuClick(e);
                    });
                });
                this._on(this.element, "click", ".e-interaction", function (evt) {
                    var pivotChart = this;
                    pivotChart._createDialog(evt);
                    $(".e-interactionsIcon").click(function (e) {
                        pivotChart._contextMenuClick(e);
                    });
                });
                this._on(this.element, "click", ".e-icon-xAxis-title", function (evt) {
                    if (this.element.find(".e-icon-xAxis-title").hasClass("e-enabled")) {
                        this.element.find(".e-icon-xAxis-title").removeClass("e-enabled");
                        this.model.primaryXAxis.title.enable = false;
                    }
                    else {
                        this.element.find(".e-icon-xAxis-title").addClass("e-enabled");
                        this.model.primaryXAxis.title.enable = true;
                    }
                    this.renderControlSuccess({ "JsonRecords": JSON.stringify(this.getJSONRecords()), "OlapReport": this.getOlapReport() });
                });
                this._on(this.element, "click", ".e-icon-yAxis-title", function (evt) {
                    if (this.element.find(".e-icon-yAxis-title").hasClass("e-enabled")) {
                        this.element.find(".e-icon-yAxis-title").removeClass("e-enabled");
                        this.model.primaryYAxis.title.enable = false;
                    }
                    else {
                        this.element.find(".e-icon-yAxis-title").addClass("e-enabled");
                        this.model.primaryYAxis.title.enable = true;
                    }
                    this.renderControlSuccess({ "JsonRecords": JSON.stringify(this.getJSONRecords()), "OlapReport": this.getOlapReport() });
                });
                this._on(this.element, "click", ".e-legend", function (evt) {
                    var pivotChart = this;
                    pivotChart._contextMenuClick(evt);
                });
                this._on(this.element, "click", ".e-zooming", function (evt) {
                    var pivotChart = this;
                    pivotChart._contextMenuClick(evt);
                });
            }
        },

        _unWireEvents: function () {
            this._off($(document), 'keydown', this._keyDownPress);
            $(document.body).off("click");
            this._off(this.element, "click", ".e-menuList.exp, .e-menuList.clp, .e-menuList.exit", this._seriesContextClick);
            $(window).off('resize', $.proxy(this._reSizeHandler, this));
            this._off(this.element, "contextmenu");
            this._off(this.element, "click", ".e-chartTypesImg");
            this._off(this.element, "click", ".e-toolTipImg");
            this._off(this.element, "click", ".e-chart3DImg");
            this._off(this.element, "click", ".e-exportImg");
            this._off(this.element, "click", ".e-legend");
            this._off(this.element, "click", ".e-zooming");
            this._off(this.element, "click", ".e-smartLabels");
            this._off(this.element, "click", ".e-interaction");
            this._off(this.element, "click", ".e-icon-xAxis-title");
            this._off(this.element, "click", ".e-icon-yAxis-title");
        },
        _seriesContextClick: function (evt) {
            this._curFocus = null;
            if (evt.target.innerHTML.indexOf(this._getLocalizedLabels("Expand")) == -1 && evt.target.innerHTML.indexOf(this._getLocalizedLabels("Collapse")) == -1 && evt.target.innerHTML.indexOf(this._getLocalizedLabels("Exit")) == -1)
                return false;
            if (evt.target.innerHTML == this._getLocalizedLabels("Exit")) {
                this.element.find("#" + this._id + "ExpandMenu, .e-expandMenu, .e-dialog").remove();
            }
            else if (evt.target.innerHTML.indexOf(this._getLocalizedLabels("Expand")) > -1) {
                this._drillAction = "drilldown";
                if ($(this.element).parents(".e-pivotclient").length > 0) {
                    var pivotClientObj = $(this.element).parents(".e-pivotclient").data("ejPivotClient");
                    if ($("#" + pivotClientObj._id + "_maxView")[0])
                        $("#" + pivotClientObj._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                    else if (!ej.isNullOrUndefined(this._waitingPopup))
                        this._waitingPopup.show();
                }
                else if (!ej.isNullOrUndefined(this._waitingPopup))
                    this._waitingPopup.show();
                if (this.model.operationalMode == ej.PivotChart.OperationalMode.ClientMode) {
                    var selectedMember = this.model.enableRTL ? evt.target.innerHTML.split(" - ")[0] : evt.target.innerHTML.split(" - ")[1];
                    if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                        this._getChartDrillDown("", selectedMember, evt);
                    }
                    else {
                        this._labelCurrentTags.collapsedMembers = $.grep(this._labelCurrentTags.collapsedMembers, function (item) { return item != selectedMember; });
                        var memberInfo = $(this.getJSONRecords().seriesTags).filter(function (index, item) { return item.split('::')[2] == selectedMember })[0];
                        var drilledMember = ej.olap._mdxParser._splitCellInfo(memberInfo);
                        this._getChartDrillDown(memberInfo, drilledMember, evt);
                    }
                }
                else {
                    var serializedCustomObject = JSON.stringify(this.model.customObject);
                    if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                        var selectedMember = this.model.enableRTL ? evt.target.innerHTML.split(" - ")[0] : evt.target.innerHTML.split(" - ")[1];
                        this._selectedItem = selectedMember;
                        if (ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers)) this._labelCurrentTags["expandedMembers"] = new Array();
                        this._labelCurrentTags.expandedMembers.push(selectedMember);
                        if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode)
                            this._trigger("beforeServiceInvoke", { action: this._drillAction, element: this.element, customObject: this.model.customObject });
                        if (this.model.customObject != "" && this.model.customObject != null && this.model.customObject != undefined)
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drilledSeries": JSON.stringify(this._labelCurrentTags.expandedMembers) + (!ej.isNullOrUndefined(this._pivotClientObj) ? ("-##-" + JSON.stringify(this._pivotClientObj.model.valueSortSettings)) : ""), "customObject": serializedCustomObject, "currentReport": JSON.parse(this.getOlapReport())["Report"] }), this.renderControlSuccess);
                        else
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drilledSeries": JSON.stringify(this._labelCurrentTags.expandedMembers), "currentReport": JSON.parse(this.getOlapReport())["Report"] }), this.renderControlSuccess);
                    }
                    else {
                        var pivotChartObj = this;
                        if (!this._isDrilled) {
                            this._isDrilled = true;
                            jQuery.each(evt.target.parentElement.children, function (index, value) {
                                if (value.innerHTML == evt.target.innerHTML)
                                    pivotChartObj._dimensionIndex = index;
                            });
                        }
                        var report;
                        try {
                            report = JSON.parse(this.getOlapReport()).Report;
                        }
                        catch (err) {
                            report = this.getOlapReport();
                        }
                        this._drillAction = "drilldown";
                        if (this.model.enableRTL)
                            this._selectedItem = $.trim(evt.target.innerHTML.replace(" - " + this._getLocalizedLabels("Expand"), ""));
                        else
                            this._selectedItem = $.trim(evt.target.innerHTML.replace(this._getLocalizedLabels("Expand") + " - ", ""));
                        jQuery.each(this._labelCurrentTags, function (index, value) {
                            if (value.name == pivotChartObj._selectedItem) {
                                pivotChartObj._tagCollection = [];
                                pivotChartObj._tagCollection = pivotChartObj._selectedTags.slice();
                                pivotChartObj._selectedTagInfo = value.tag;
                                pivotChartObj._selectedMenuItem = value.name;
                                return false;
                            }
                        });
                        this._startDrilldown = true;
                        if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode)
                            this._trigger("beforeServiceInvoke", { action: this._drillAction, element: this.element, customObject: this.model.customObject });
                        if (this.model.customObject != "" && this.model.customObject != null && this.model.customObject != undefined) {
                            if (!ej.isNullOrUndefined(this._pivotClientObj))
                                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": this.model.enableMultiLevelLabels ? "drilldown#fullchart" : "drilldown", "drilledSeries": this._selectedTagInfo, "olapReport": report, "clientReports": this._pivotClientObj.reports, "customObject": serializedCustomObject }), this.renderControlSuccess);
                            else
                                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": this.model.enableMultiLevelLabels ? "drilldown#fullchart" : "drilldown", "drilledSeries": this._selectedTagInfo, "olapReport": report, "customObject": serializedCustomObject }), this.renderControlSuccess);
                        }
                        else {
                            if (ej.isNullOrUndefined(this._pivotClientObj))
                                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": this.model.enableMultiLevelLabels ? "drilldown#fullchart" : "drilldown", "drilledSeries": this._selectedTagInfo, "olapReport": report }), this.renderControlSuccess);
                            else
                                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": this.model.enableMultiLevelLabels ? "drilldown#fullchart" : "drilldown", "drilledSeries": this._selectedTagInfo, "olapReport": report, "clientReports": this._pivotClientObj.reports }), this.renderControlSuccess);
                        }
                    }
                }
            }
            else {
                this._drillAction = "drillup";
                if ($(this.element).parents(".e-pivotclient").length > 0) {
                    var pivotClientObj = $(this.element).parents(".e-pivotclient").data("ejPivotClient");
                    if ($("#" + pivotClientObj._id + "_maxView")[0])
                        $("#" + pivotClientObj._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                    else if (!ej.isNullOrUndefined(this._waitingPopup))
                        this._waitingPopup.show();
                }
                else if (!ej.isNullOrUndefined(this._waitingPopup))
                    this._waitingPopup.show();
                if (this.model.operationalMode == ej.PivotChart.OperationalMode.ClientMode) {
                    var selectedMember = this.model.enableRTL ? evt.target.innerHTML.split(" - ")[0] : evt.target.innerHTML.split(" - ")[1];
                    this._getChartDrillDown("", selectedMember, evt);
                }
                else {
                    var serializedCustomObject = JSON.stringify(this.model.customObject);
                    if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                        var selectedMember = this.model.enableRTL ? evt.target.innerHTML.split(" - ")[0] : evt.target.innerHTML.split(" - ")[1];
                        var flag = false, tempArray = new Array();
                        jQuery.map(this._labelCurrentTags.expandedMembers, function (member) {
                            if (member == selectedMember) flag = true;
                            if (!flag) tempArray.push(member);
                        });
                        this._selectedItem = selectedMember;
                        this._labelCurrentTags.expandedMembers = tempArray;
                        this._currentDrillInfo = $.extend([], this._labelCurrentTags.expandedMembers, true).concat([selectedMember]);
                        if ($(this.element).parents(".e-pivotclient").length > 0) {
                            this._labelCurrentTags.expandedMembers = [];
                            var pivotClientObj = $(this.element).parents(".e-pivotclient").data("ejPivotClient");
                            if (pivotClientObj._drillParams.length > 0) {
                                pivotClientObj._drillParams = $.grep(pivotClientObj._drillParams, function (item) { return item.indexOf(selectedMember) < 0; });
                                pivotClientObj._getDrilledMember();
                            }
                        }
                        if (this.model.customObject != "" && this.model.customObject != null && this.model.customObject != undefined)
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drilledSeries": JSON.stringify(this._labelCurrentTags.expandedMembers) + (!ej.isNullOrUndefined(this._pivotClientObj) ? ("-##-" + JSON.stringify(this._pivotClientObj.model.valueSortSettings)) : ""), "customObject": serializedCustomObject, "currentReport": JSON.parse(this.getOlapReport())["Report"] }), this.renderControlSuccess);
                        else
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drilledSeries": JSON.stringify(this._labelCurrentTags.expandedMembers), "currentReport": JSON.parse(this.getOlapReport())["Report"] }), this.renderControlSuccess);
                    }
                    else {
                        var report;
                        try {
                            report = JSON.parse(this.getOlapReport()).Report;
                        }
                        catch (err) {
                            report = this.getOlapReport();
                        }
                        this._drillAction = "drillup";
                        if (this.model.enableRTL)
                            this._selectedItem = $.trim(evt.target.innerHTML.replace(" - " + this._getLocalizedLabels("Collapse"), ""));
                        else
                            this._selectedItem = $.trim(evt.target.innerHTML.replace(this._getLocalizedLabels("Collapse") + " - ", ""));
                        this._tagCollection = [];
                        this._tagCollection = this._selectedTags.slice();
                        var pivotChartObj = this;
                        jQuery.each(this._tagCollection, function (index, value) {
                            if (value.name == pivotChartObj._selectedItem) {
                                pivotChartObj._selectedIndex = index;
                                pivotChartObj._selectedTagInfo = value.tag;
                                pivotChartObj._tagCollection.splice(index, pivotChartObj._tagCollection.length);
                                return false;
                            }
                        });
                        if (this._tagCollection.length == 0)
                            this._isDrilled = false;
                        this._startDrilldown = true;
                        if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode)
                            this._trigger("beforeServiceInvoke", { action: this._drillAction, element: this.element, customObject: this.model.customObject });
                        if (this.model.customObject != "" && this.model.customObject != null && this.model.customObject != undefined) {
                            if (!ej.isNullOrUndefined(this._pivotClientObj))
                                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": this.model.enableMultiLevelLabels ? "drillup#fullchart" : "drillup", "drilledSeries": this._selectedTagInfo, "olapReport": report, "clientReports": this._pivotClientObj.reports, "customObject": serializedCustomObject }), this.renderControlSuccess);
                            else
                                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": this.model.enableMultiLevelLabels ? "drillup#fullchart" : "drillup", "drilledSeries": this._selectedTagInfo, "olapReport": report, "customObject": serializedCustomObject }), this.renderControlSuccess);
                        }
                        else {
                            if (ej.isNullOrUndefined(this._pivotClientObj))
                                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": this.model.enableMultiLevelLabels ? "drillup#fullchart" : "drillup", "drilledSeries": this._selectedTagInfo, "olapReport": report }), this.renderControlSuccess);
                            else
                                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": this.model.enableMultiLevelLabels ? "drillup#fullchart" : "drillup", "drilledSeries": this._selectedTagInfo, "olapReport": report, "clientReports": reports }), this.renderControlSuccess);
                        }
                    }
                }
            }
        },
        _createDialog: function (evt) {
            var pivotchrt = this;
            if ($(evt.target).hasClass("e-exportImg")) {
                var exportTypesDlg = ej.buildTag("div.e-exportTypesDialog", ej.buildTag("table", ej.buildTag("tbody", ej.buildTag("tr",
                    ej.buildTag("td", ej.buildTag("div.e-excel e-exportTypesIcon").attr({ "title": this._getLocalizedLabels("Excel"), "aria-label": this._getLocalizedLabels("Excel"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.e-word e-exportTypesIcon").attr({ "title": this._getLocalizedLabels("Word"), "aria-label": this._getLocalizedLabels("Word"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.e-pdf e-exportTypesIcon").attr({ "title": this._getLocalizedLabels("Pdf"), "aria-label": this._getLocalizedLabels("Pdf"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.e-png e-exportTypesIcon").attr({ "title": this._getLocalizedLabels("PNG"), "aria-label": this._getLocalizedLabels("PNG"), tabindex: 0 })[0].outerHTML)[0].outerHTML)[0].outerHTML +
                    ej.buildTag("tr", ej.buildTag("td", ej.buildTag("div.e-emf e-exportTypesIcon").attr({ "title": this._getLocalizedLabels("EMF"), "aria-label": this._getLocalizedLabels("EMF"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.e-gif e-exportTypesIcon").attr({ "title": this._getLocalizedLabels("GIF"), "aria-label": this._getLocalizedLabels("GIF"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.e-jpg e-exportTypesIcon").attr({ "title": this._getLocalizedLabels("JPG"), "aria-label": this._getLocalizedLabels("JPG"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.e-bmp e-exportTypesIcon").attr({ "title": this._getLocalizedLabels("BMF"), "aria-label": this._getLocalizedLabels("BMF"), tabindex: 0 })[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML);
            if (this.element.find('div.e-exportTypesDialog').length == 0) {
                    $(exportTypesDlg).appendTo(this.element);
                    $(exportTypesDlg).css("left", evt.target.offsetLeft + 20 + "px").css("top", (evt.target.offsetTop + 15)+ "px");
                    if (this.model.enableRTL)
                        $(exportTypesDlg).addClass("e-rtl");
                }
            }
            else if ($(evt.target).hasClass("e-chart3DImg")) {
                var chart3DTypesDialog = ej.buildTag("div.e-chart3DTypesDialog", ej.buildTag("table", ej.buildTag("tbody", ej.buildTag("tr",
                        ej.buildTag("td", ej.buildTag("div.e-column3D e-chart3DTypesIcon").attr({ "title": this._getLocalizedLabels("ColumnTD"), "aria-label": this._getLocalizedLabels("ColumnTD"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                        ej.buildTag("td", ej.buildTag("div.e-pie3D e-chart3DTypesIcon").attr({ "title": this._getLocalizedLabels("PieTD"), "aria-label": this._getLocalizedLabels("PieTD"), tabindex: 0 })[0].outerHTML)[0].outerHTML)[0].outerHTML +
                        ej.buildTag("tr", ej.buildTag("td", ej.buildTag("div.e-bar3D e-chart3DTypesIcon").attr({ "title": this._getLocalizedLabels("BarTD"), "aria-label": this._getLocalizedLabels("BarTD"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                        ej.buildTag("td", ej.buildTag("div.e-stackingbar3D e-chart3DTypesIcon").attr({ "title": this._getLocalizedLabels("StackingBarTD"), "aria-label": this._getLocalizedLabels("StackingBarTD"), tabindex: 0 })[0].outerHTML)[0].outerHTML)[0].outerHTML +
                        ej.buildTag("tr", ej.buildTag("td", ej.buildTag("div.e-stackingcolumn3D e-chart3DTypesIcon").attr({ "title": this._getLocalizedLabels("StackingColumnTD"), "aria-label": this._getLocalizedLabels("StackingColumnTD"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                        ej.buildTag("td", ej.buildTag("div.e-disable3D e-chart3DTypesIcon").attr({ "title": this._getLocalizedLabels("DisableTD"), "aria-label": this._getLocalizedLabels("DisableTD"), tabindex: 0 })[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML);
                if (this.element.find('div.e-chart3DTypesDialog').length == 0) {
                    $(chart3DTypesDialog).appendTo(this.element);
                    $(chart3DTypesDialog).css("left", evt.target.offsetLeft + 20 + "px").css("top", (evt.target.offsetTop + 15) + "px");
                    if (pivotchrt.model.enable3D) {
                        $("." + this.model.type+"3D").addClass("e-enabled");
                    }
                    if (this.model.enableRTL)
                        $(chart3DTypesDialog).addClass("e-rtl");
                }
            }
            else if ($(evt.target).hasClass("e-smartLabels")) {
                var smartLabelsDialog = ej.buildTag("div.e-smartLabelsDialog", ej.buildTag("table", ej.buildTag("tbody", ej.buildTag("tr",
                        ej.buildTag("td", ej.buildTag("div.e-rotate45 e-smartLabelsIcon").attr({ "title": this._getLocalizedLabels("Rotate45"), "aria-label": this._getLocalizedLabels("Rotate45"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                        ej.buildTag("td", ej.buildTag("div.e-rotate90 e-smartLabelsIcon").attr({ "title": this._getLocalizedLabels("Rotate90"), "aria-label": this._getLocalizedLabels("Rotate90"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                        ej.buildTag("td", ej.buildTag("div.e-trim e-smartLabelsIcon").attr({ "title": this._getLocalizedLabels("Trim"), "aria-label": this._getLocalizedLabels("Trim"), tabindex: 0 })[0].outerHTML)[0].outerHTML)[0].outerHTML +
                        ej.buildTag("tr", ej.buildTag("td", ej.buildTag("div.e-multipleRows e-smartLabelsIcon").attr({ "title": this._getLocalizedLabels("MultipleRows"), "aria-label": this._getLocalizedLabels("MultipleRows"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                        ej.buildTag("td", ej.buildTag("div.e-wrap e-smartLabelsIcon").attr({ "title": this._getLocalizedLabels("Wrap"), "aria-label": this._getLocalizedLabels("Wrap"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                        ej.buildTag("td", ej.buildTag("div.e-hiding e-smartLabelsIcon").attr({ "title": this._getLocalizedLabels("Hide"), "aria-label": this._getLocalizedLabels("Hide"), tabindex: 0 })[0].outerHTML)[0].outerHTML)[0].outerHTML +
                        ej.buildTag("tr", ej.buildTag("td", ej.buildTag("div.e-wrapByWord smartLabelsIcon").attr({ "title": this._getLocalizedLabels("WrapByWord"), "aria-label": this._getLocalizedLabels("WrapByWord"), tabindex: 0 })[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML);
                if (this.element.find('div.e-smartLabelsDialog').length == 0) {
                    $(smartLabelsDialog).appendTo(this.element);
                    $(smartLabelsDialog).css("left", evt.target.offsetLeft + 20 + "px").css("top", (evt.target.offsetTop + 15) + "px");
                    if (pivotchrt.model.primaryXAxis.labelIntersectAction != "none" && pivotchrt.model.primaryXAxis.labelIntersectAction != "hide" && pivotchrt.model.primaryXAxis.labelIntersectAction != undefined)
                        $("." + pivotchrt.model.primaryXAxis.labelIntersectAction).addClass("e-enabled");
                    if (pivotchrt.model.primaryXAxis.labelIntersectAction == "hide")
                        $(".e-hiding").addClass("e-enabled");
                    if (this.model.enableRTL)
                        $(smartLabelsDialog).addClass("e-rtl");
                }
            }

            else if ($(evt.target).hasClass("e-interaction")) {
                var interactionsDialog = ej.buildTag("div.e-interactionsDialog", ej.buildTag("table", ej.buildTag("tbody", ej.buildTag("tr",
                        ej.buildTag("td", ej.buildTag("div.e-crossHair e-interactionsIcon").attr({ "title": this._getLocalizedLabels("CrossHair"), "aria-label": this._getLocalizedLabels("CrossHair"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                        ej.buildTag("td", ej.buildTag("div.e-trackBall e-interactionsIcon").attr({ "title": this._getLocalizedLabels("TrackBall"), "aria-label": this._getLocalizedLabels("TrackBall"), tabindex: 0 })[0].outerHTML)[0].outerHTML+
                        ej.buildTag("td", ej.buildTag("div.none e-interactionsIcon").attr({ "title": this._getLocalizedLabels("None"), "aria-label": this._getLocalizedLabels("None"), tabindex: 0 })[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML);
                if (this.element.find('div.e-interactionsDialog').length == 0) {
                    $(interactionsDialog).appendTo(this.element);
                    $(interactionsDialog).css("left", evt.target.offsetLeft + 20 + "px").css("top", (evt.target.offsetTop + 15) + "px");
                    if (this.model.crosshair.type == "crosshair" && this.model.crosshair.visible) {
                        this.element.find(".e-crossHair").addClass("e-enabled");
                    }
                    if (this.model.crosshair.type == "trackBall" && this.model.crosshair.visible) {
                       this.element.find(".e-trackBall").addClass("e-enabled");
                    }
                    if (!this.model.crosshair.visible) {
                        this.element.find(".none").addClass("e-enabled");
                    }
                    if (this.model.enableRTL)
                        $(interactionsDialog).addClass("e-rtl");
                }
            }

        },
        _contextMenuClick: function (evt) {
            chrtObj = $("#" + this._id).data("ejPivotChart");
            var selectedValue = $(this.element).parents(".e-pivotclient").length > 0 ? $(evt.target).attr("class").split(" ")[0] : $(evt.element).attr("class").split(" ")[0];
            if($(evt.element).parents().hasClass("chartTypes"))
            {
                chrtObj.model.enable3D = false;
                chrtObj.model.type = chrtObj.model.commonSeriesOptions.type = (!ej.isNullOrUndefined(selectedValue) && selectedValue.split("-").length > 1)  ?  selectedValue.split("-")[1] : selectedValue;
                if (chrtObj.model.type == "funnel") {
                    chrtObj.model.commonSeriesOptions.marker = {
                        dataLabel: {
                            visible: true,
                            shape: 'none',
                            font: { color: 'white', size: '12px', fontWeight: 'lighter' }
                        }
                    }
                }
                if (chrtObj.model.type == "pie" || chrtObj.model.type == "doughnut") {
                    chrtObj.model.commonSeriesOptions.explode = true;
                }
                chrtObj.renderControlSuccess({ "JsonRecords": JSON.stringify(chrtObj.getJSONRecords()), "OlapReport": chrtObj.getOlapReport() });
            }
            else if ($(evt.element).hasClass("e-toolTip"))
            {
                chrtObj.model.commonSeriesOptions.tooltip.visible = !chrtObj.model.commonSeriesOptions.tooltip.visible;
                chrtObj.renderControlSuccess({ "JsonRecords": JSON.stringify(chrtObj.getJSONRecords()), "OlapReport": chrtObj.getOlapReport() });
            }
           else if ($(evt.element).hasClass("e-legend") || $(evt.target).hasClass("e-legend")) {
                chrtObj.model.legend.visible = !chrtObj.model.legend.visible;
                chrtObj.renderControlSuccess({ "JsonRecords": JSON.stringify(chrtObj.getJSONRecords()), "OlapReport": chrtObj.getOlapReport() });
            }
            else if ($(evt.element).hasClass("e-zooming") || $(evt.target).hasClass("e-zooming")) {
                chrtObj.model.zooming.enable = !chrtObj.model.zooming.enable;
                chrtObj.renderControlSuccess({ "JsonRecords": JSON.stringify(chrtObj.getJSONRecords()), "OlapReport": chrtObj.getOlapReport() });
            }
            else if ($(evt.element).parents().hasClass("e-smartLabels") || $(evt.target).hasClass("e-smartLabelsIcon")) {
                if (selectedValue == "e-hiding")
                    chrtObj.model.primaryXAxis.labelIntersectAction = "hide";
                else
                    chrtObj.model.primaryXAxis.labelIntersectAction = (!ej.isNullOrUndefined(selectedValue) && selectedValue.split("-").length > 1)  ?  selectedValue.split("-")[1] : selectedValue;
                chrtObj.renderControlSuccess({ "JsonRecords": JSON.stringify(chrtObj.getJSONRecords()), "OlapReport": chrtObj.getOlapReport() });
            }
           else if ($(evt.element).parents().hasClass("e-interaction") || $(evt.target).hasClass("e-interactionsIcon")) {
               if (selectedValue == "e-crossHair") {
                   chrtObj.model.crosshair.type = ej.datavisualization.Chart.CrosshairType.Crosshair;
                   chrtObj.model.crosshair.visible = true;
                   }
               if (selectedValue == "e-trackBall") {
                   chrtObj.model.crosshair.type = ej.datavisualization.Chart.CrosshairType.TrackBall;
                   chrtObj.model.crosshair.visible = true;
                   }
               if (selectedValue == "none")
                   chrtObj.model.crosshair.visible = false;
               
              chrtObj.renderControlSuccess({ "JsonRecords": JSON.stringify(chrtObj.getJSONRecords()), "OlapReport": chrtObj.getOlapReport() });
            }
            else if ($(evt.element).parents().hasClass("chart3DTypes") || $(evt.target).hasClass("e-chart3DTypesIcon"))
            {
                chrtObj.model.enable3D = true;
                if (selectedValue != "e-disable3D")
                    selectedValue = selectedValue.split("3")[0];
                if (selectedValue == "e-disable3D") {
                    chrtObj.model.enable3D = false;
                    selectedValue = chrtObj.model.commonSeriesOptions.type;
                }
                chrtObj.model.type = chrtObj.model.commonSeriesOptions.type = (!ej.isNullOrUndefined(selectedValue) && selectedValue.split("-").length > 1)  ?  selectedValue.split("-")[1] : selectedValue;
                if (selectedValue == "e-pie") {
                    chrtObj.model.rotation = 24;
                }
                chrtObj.renderControlSuccess({ "JsonRecords": JSON.stringify(chrtObj.getJSONRecords()), "OlapReport": chrtObj.getOlapReport() });
            }
            else
            {
                if ($(this.element).parents(".e-pivotclient").length > 0 && !ej.isNullOrUndefined(this._pivotClientObj))
                    this.model.beforeExport = this._pivotClientObj.model.beforeExport;
                    selectedValue = (!ej.isNullOrUndefined(selectedValue) && selectedValue.split("-").length > 1)  ?  selectedValue.split("-")[1] : selectedValue;
                switch (selectedValue) {
                    case "excel":
                    case "word":
                    case "pdf":
                        chrtObj.exportPivotChart(selectedValue, "Sample");
                        break;
                    case "png":
                        chrtObj.exportPivotChart(selectedValue, "Sample", ej.PivotChart.ExportOptions.PNG);
                        break;
                    case "emf":
                        chrtObj.exportPivotChart(selectedValue, "Sample", ej.PivotChart.ExportOptions.EMF);
                        break;
                    case "gif":
                        chrtObj.exportPivotChart(selectedValue, "Sample", ej.PivotChart.ExportOptions.GIF);
                        break;
                    case "jpg":
                        chrtObj.exportPivotChart(selectedValue, "Sample", ej.PivotChart.ExportOptions.JPG);
                        break;
                    case "bmp":
                        chrtObj.exportPivotChart(selectedValue, "Sample", ej.PivotChart.ExportOptions.BMP);
                        break;
              }   
            }
        },

        generateJSON: function (baseObj, pivotEngine) {
            if ((!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers)) && this._labelCurrentTags.expandedMembers.length > 0 && !this.model.enableMultiLevelLabels) {
                var exceedIndex = 0;
                for (var i = 0; i < this._labelCurrentTags.expandedMembers.length; i++) {
                    if (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers[i]) && this._labelCurrentTags.expandedMembers[i].length > 0) {
                        if (i > 0 && !ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers[i - 1]) && this._labelCurrentTags.expandedMembers[i - 1].length > 0)
                            this._cropData(pivotEngine, this._selectedSeriesInfo[i - 1].split('::')[2], (i - 1) + exceedIndex, false);
                        for (var j = 0; j < this._labelCurrentTags.expandedMembers[i].length; j++) {
                            this._cropData(pivotEngine, this._labelCurrentTags.expandedMembers[i][j].split('::')[2], i + exceedIndex, true);
                            exceedIndex++;
                        }
                    }
                }
            }
            this._generateData(pivotEngine);
        },

        _jsonToEngine: function (item) {
            var tempEngine = JSON.parse(item);
            var pivotEngine = [];
            for (var i = 0; i < tempEngine.length; i++) {
                var colIndex = parseInt(tempEngine[i].Index.split(',')[0]);
                if (ej.isNullOrUndefined(pivotEngine[colIndex])) {
                    pivotEngine[colIndex] = [];
                    pivotEngine[colIndex].push(tempEngine[i]);
                }
                else {
                    pivotEngine[colIndex].push(tempEngine[i]);
                }
            }
            return pivotEngine;
        },

        _generateData: function (pivotEngine) {
            var savedObj = {};
            if (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj._isExporting)
                savedObj = $.extend(true, {}, { pivotEngine: this._pivotEngine, labelCurrentTags: this._labelCurrentTags, drillParams: this._drillParams });
            var isOlapServerMode = false;
            if (pivotEngine[2] != undefined)
                isOlapServerMode = (pivotEngine[2].Value == "Olap" || pivotEngine[2] == "Olap") ? true : false;
            else if (pivotEngine.d != undefined)
                isOlapServerMode = !ej.isNullOrUndefined(pivotEngine.d[2]) && (pivotEngine.d[2].Value == "Olap") ? true : false;
            else
                isOlapServerMode = pivotEngine.AnalysisMode == "Olap" ? true : false;
            if (!isOlapServerMode) {
                var chartData = {
                    seriesNames: [],
                    chartLables: [],
                    labelTags: [],
                    multiLevelLabels: [],
                    multiLevelLabelTags: [],
                    seriesTags: [],
                    points_Y: [],
                    labelFormat: [],
                    measureNames: ""
                };
                var pivotReport = "", values = [];
                if (this.model.enableMultiLevelLabels && this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {
                    var tempEngine = {};
                    if (pivotEngine[0] != undefined) {
                        if ($(this.element).parents(".e-pivotclient").length > 0) {
                            tempEngine["JsonRecords"] = ej.isNullOrUndefined(pivotEngine[0].Value) ? pivotEngine[0] : pivotEngine[0].Value;
                        }
                        else {
                            tempEngine["JsonRecords"] = {};
                            (tempEngine["JsonRecords"])["ChartJSON"] = ej.isNullOrUndefined(pivotEngine[0].Value) ? pivotEngine[0] : pivotEngine[0].Value;
                            (tempEngine["JsonRecords"])["GridJSON"] = ej.isNullOrUndefined(pivotEngine[3].Value) ? pivotEngine[3] : pivotEngine[3].Value;
                        }
                        tempEngine["PivotReport"] = ej.isNullOrUndefined(pivotEngine[1].Value) ? pivotEngine[1] : pivotEngine[1].Value;
                        pivotEngine = tempEngine;
                    }
                    else if (pivotEngine.d != undefined) {
                        if ($(this.element).parents(".e-pivotclient").length > 0) {
                            tempEngine["JsonRecords"] = !ej.isNullOrUndefined(pivotEngine.d[0]) && (pivotEngine.d[0].Key == "JsonRecords") ? pivotEngine.d[0].Value : [];
                        }
                        else {
                            tempEngine["JsonRecords"] = {};
                            (tempEngine["JsonRecords"])["ChartJSON"] = !ej.isNullOrUndefined(pivotEngine.d[0]) && (pivotEngine.d[0].Key == "JsonRecords") ? pivotEngine.d[0].Value : [];
                            (tempEngine["JsonRecords"])["GridJSON"] = !ej.isNullOrUndefined(pivotEngine.d[3]) && (pivotEngine.d[3].Key == "GridJSON") ? pivotEngine.d[3].Value : [];
                        }                        
                        tempEngine["PivotReport"] = !ej.isNullOrUndefined(pivotEngine.d[1]) && ((pivotEngine.d[1].Key == "PivotReport") || (pivotEngine.d[1].Key == "OlapReport")) ? pivotEngine.d[1].Value : [];
                        pivotEngine = tempEngine;
                    }
                    pivotReport = pivotEngine.PivotReport || pivotEngine.OlapReport;
                    if (!ej.isNullOrUndefined(pivotEngine.JsonRecords.GridJSON)) {
                        pivotEngine = this._jsonToEngine(pivotEngine.JsonRecords.GridJSON);
                    }
                    else if (ej.isNullOrUndefined(pivotEngine.GridJSON))
                        pivotEngine = pivotEngine.JsonRecords;
                    else
                        pivotEngine = this._jsonToEngine(pivotEngine.GridJSON);
                    this._pivotEngine = pivotEngine;
                    values = ej.isNullOrUndefined(JSON.parse(pivotReport).values) ? JSON.parse(pivotReport).PivotCalculations : JSON.parse(JSON.parse(pivotReport).values);
                    chartData.labelFormat = $.map(values, function (items) { return items.Format.toLowerCase() });
                }
                var columnCount = pivotEngine.length;
                if (columnCount > 0 && pivotEngine[0].length > 0) {
                    var rowCount = pivotEngine[0].length;
                    var summaryColumns = new Array();
                    var summaryRows = new Array();

                    if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot)
                        var rowHeaderWidth = (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers) && !this.model.enableMultiLevelLabels) ? this.model.dataSource.rows.length - this._labelCurrentTags.expandedMembers.length : (this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode ? (pivotEngine[0])[0].ColSpan : this.model.dataSource.rows.length);
                    else
                        var rowHeaderWidth = pivotEngine[0][0].ColSpan;

                    if (this.model.enableMultiLevelLabels && ((this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) || this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap)) {
                        var columnHeaderHeight = (pivotEngine[0])[0].RowSpan;
                    }
                    else {
                        var columnHeaderHeight = this.model.dataSource.columns.length;
                        if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot)
                            columnHeaderHeight += this.model.dataSource.values.length > 0 ? 1 : 0;
                        else
                            columnHeaderHeight = (pivotEngine[0])[0].RowSpan;
                    }

                    //Getting Series Labels
                    var measure = "";
                    for (var i = rowHeaderWidth; i < columnCount; i++) {
                        var seriesName = "";
                        var isSummary = false;
                        for (var j = 0; j < columnHeaderHeight; j++) {
                            if (!ej.isNullOrUndefined(pivotEngine[i][j])) {
                                if (pivotEngine[i][j].CSS.indexOf("summary") >= 0) {
                                    isSummary = true;
                                    summaryColumns.push(i);
                                    break;
                                }
                                if (pivotEngine[i][j].Info.indexOf("Measure") >= 0 && measure.indexOf(pivotEngine[i][j].Value) < 0) {
                                    measure += measure == "" ? pivotEngine[i][j].Value : "~~" + pivotEngine[i][j].Value;
                                }
                                seriesName += (seriesName == "" ? "" : (pivotEngine[i][j].Value == "" ? "" : "~~")) + pivotEngine[i][j].Value;
                            }
                        }
                        if (!isSummary && seriesName != "") chartData.seriesNames.push(seriesName);
                    }

                    //Getting Chart Labels
                    for (var i = columnHeaderHeight; i < rowCount; i++) {
                        if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                            if (this.model.enableMultiLevelLabels && rowHeaderWidth > 1) {
                                this._drillParams = this._drillAction != "" ? this._drillParams : [];
                                var drillParams = $.extend(true, [], this._drillParams.sort());
                                var lockedColumn = drillParams.length > 0 ? -1 : 0, lockedSeries = "";
                                for (var i = columnHeaderHeight; i < rowCount; i++) {
                                    var drilledRowSeries = drillParams[0];
                                    var engineSeries = "";
                                    for (j = 0; j < rowHeaderWidth; j++) {
                                        engineSeries += engineSeries == "" ? pivotEngine[j][i].Value : ">#>" + pivotEngine[j][i].Value;
                                        if (lockedColumn == -1 || lockedSeries == "" || engineSeries == drillParams[1]) {
                                            if (engineSeries == drilledRowSeries || engineSeries == drillParams[1]) {
                                                if (engineSeries == drillParams[1]) {
                                                    drilledRowSeries = drillParams[1];
                                                    drillParams.splice(0, 1);
                                                }
                                                lockedColumn = j + 1;
                                                lockedSeries = engineSeries;
                                            }
                                        }
                                        if (!ej.isNullOrUndefined(drilledRowSeries) && lockedColumn > 0 && lockedColumn == rowHeaderWidth - 1 && j == rowHeaderWidth - 1) {
                                            summaryRows.push(i);
                                            chartData.chartLables.push(drilledRowSeries.split('>#>').join('~~') + "~~" + pivotEngine[j][i].Value);
                                        }
                                        else if (!ej.isNullOrUndefined(drilledRowSeries) && lockedColumn > 0 && lockedColumn == j && pivotEngine[j][i].CSS.indexOf("summary") > -1) {
                                            summaryRows.push(i);
                                            chartData.chartLables.push(drilledRowSeries.split('>#>').join('~~') + "~~" + pivotEngine[j][i].Value.split(" Total")[0]);
                                        }
                                        else if (lockedColumn - 1 == j && pivotEngine[j][i].CSS.indexOf("summary") > -1) {
                                            if (lockedSeries != "") {
                                                drillParams[0] = drillParams[0].split('>#>').slice(0, drillParams[0].split('>#>').length - 1).join('>#>');
                                                if (drillParams[0] == "") {
                                                    drillParams.splice(0, 1);
                                                    lockedSeries = "";
                                                }
                                            }
                                            lockedColumn = lockedColumn - 1;
                                        }
                                        else if ((lockedColumn == 0 || lockedSeries == "") && j == 0 && pivotEngine[0][i].CSS.indexOf("summary") > -1 && (!ej.isNullOrUndefined(drilledRowSeries) ? (drilledRowSeries.split('>#>')[0] != pivotEngine[0][i].Value.split(" Total")[0]) : true) && pivotEngine[j][i].Value != "Grand Total") {
                                            summaryRows.push(i);
                                            chartData.chartLables.push(pivotEngine[j][i].Value.split(" Total")[0]);
                                        }
                                    }
                                }
                            }
                            else {
                                if (rowHeaderWidth > 1) {
                                    if (pivotEngine[0][i].CSS == "summary rstot" && pivotEngine[0][i].Value != "Grand Total")
                                        chartData.chartLables.push(pivotEngine[0][i].Value.replace(" Total", ""));
                                }
                                else if (pivotEngine[0][i].CSS == "rowheader")
                                    chartData.chartLables.push(pivotEngine[0][i].Value);
                            }
                            if (this.model.enableMultiLevelLabels)
                                chartData.multiLevelLabels = $.extend(true, [], chartData.chartLables);
                        }
                        else {
                            if (ej.isNullOrUndefined(this._labelCurrentTags.collapsedMembers)) this._labelCurrentTags["collapsedMembers"] = new Array();
                            if (rowHeaderWidth > 1) {
                                var chartLabel = "", isSummary = false, labelTag = "";
                                for (var j = 0; j < rowHeaderWidth; j++) {
                                    if (pivotEngine[j][i].CSS == "rowheader") {
                                        chartLabel += chartLabel == "" ? pivotEngine[j][i].Value : ((pivotEngine[j][i].Info != "" && pivotEngine[j - 1][i].Info != "" && pivotEngine[j][i].Info.split('::')[3] == pivotEngine[j - 1][i].Info.split('::')[0]) ? "#" : "~~") + pivotEngine[j][i].Value;
                                        if (pivotEngine[j][i].Info.indexOf("[Measures]") == -1) labelTag += labelTag == "" ? pivotEngine[j][i].Info : ((pivotEngine[j][i].Info != "" && pivotEngine[j - 1][i].Info != "" && pivotEngine[j][i].Info.split('::')[3] == pivotEngine[j - 1][i].Info.split('::')[0]) ? "#" : "~~") + pivotEngine[j][i].Info;
                                        if ($.inArray(pivotEngine[j][i].Value, this._labelCurrentTags.collapsedMembers) < 0 && pivotEngine[j][i].State == 2) this._labelCurrentTags.collapsedMembers.push(pivotEngine[j][i].Value);
                                        if ($.inArray(pivotEngine[j][i].Info, chartData.seriesTags) < 0 && pivotEngine[j][i].Info.indexOf("[Measures]") == -1) chartData.seriesTags.push(pivotEngine[j][i].Info);
                                    }
                                    else {
                                        if ((!this.model.enableMultiLevelLabels || chartLabel == "" || pivotEngine[j][i].CSS.indexOf("summary") >= 0) && (!this.model.enableMultiLevelLabels ? (pivotEngine[j][i].CSS.indexOf("none") == -1 && pivotEngine[j][i].CSS.indexOf("value") == -1) : true)) {
                                            isSummary = true;
                                            summaryRows.push(i);
                                            break;
                                        }
                                    }
                                }
                                if (!isSummary) {
                                    chartData.chartLables.push(chartLabel);
                                    chartData.labelTags.push(labelTag);
                                }
                            }
                            else {
                                if (pivotEngine[0][i].CSS == "rowheader") {
                                    chartData.chartLables.push(pivotEngine[0][i].Value);
                                    chartData.labelTags.push(pivotEngine[0][i].Info);
                                    chartData.seriesTags.push(pivotEngine[0][i].Info);
                                }
                                if (pivotEngine[0][i].State == 2) this._labelCurrentTags.collapsedMembers.push(pivotEngine[0][i].Value);
                            }
                        }
                    }


                    //Getting Multilevel Labels
                    if (this.model.enableMultiLevelLabels) {
                        if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                            var maxLength = 0;
                            for (var j = 0; j < chartData.multiLevelLabels.length; j++) {
                                chartData.multiLevelLabels[j] = $.map(chartData.multiLevelLabels[j].split('~~'), function (item) {
                                    return item + "#1";
                                }).join('~~');
                                maxLength = chartData.multiLevelLabels[j].split('~~').length > maxLength ? chartData.multiLevelLabels[j].split('~~').length : maxLength;
                            }
                            for (var k = 0; k < chartData.multiLevelLabels.length; k++) {
                                if (maxLength > 1 && chartData.multiLevelLabels[k].split('~~').length < maxLength) {
                                    var childMember = chartData.multiLevelLabels[k].split('~~')[chartData.multiLevelLabels[k].split('~~').length - 1].split('#1')[0];
                                    do {
                                        chartData.multiLevelLabels[k] += "~~" + childMember + "#0";
                                    } while (chartData.multiLevelLabels[k].split('~~').length < maxLength);;
                                }
                            }
                        }
                        else {
                            for (var i = columnHeaderHeight; i < rowCount; i++) {
                                if (rowHeaderWidth > 1) {
                                    var chartLabel = "", labelTag = "", isSummary = false;
                                    for (var j = 0; j < rowHeaderWidth; j++) {
                                        if (pivotEngine[j][i].CSS == "rowheader") {
                                            chartLabel += chartLabel == "" ? (pivotEngine[j][i].Value + "#" + pivotEngine[j][i].Expander) : "~~" + (pivotEngine[j][i].Value + "#" + pivotEngine[j][i].Expander);
                                            labelTag += labelTag == "" ? (pivotEngine[j][i].Info + "::" + pivotEngine[j][i].State) : "~~" + (pivotEngine[j][i].Info + "::" + pivotEngine[j][i].State);
                                        }
                                        else if (pivotEngine[j][i].CSS.indexOf("none") >= 0 && chartLabel != "") {
                                            chartLabel += "~~" + chartLabel.split("~~")[chartLabel.split("~~").length - 1].split('#')[0] + "#" + pivotEngine[j][i].Expander;
                                            labelTag += "~~" + labelTag.split("~~")[labelTag.split("~~").length - 1];
                                        }
                                        else if (chartLabel == "" || pivotEngine[j][i].CSS.indexOf("summary") >= 0 || pivotEngine[j][i].CSS.indexOf("value") >= 0) {
                                            isSummary = pivotEngine[j][i].CSS.indexOf("summary") >= 0 ? true : false;
                                            break;
                                        }
                                    }
                                    if (!isSummary && chartLabel != "") {
                                        chartData.multiLevelLabels.push(chartLabel);
                                        chartData.multiLevelLabelTags.push(labelTag);
                                    }
                                }
                                else {
                                    if (pivotEngine[0][i].CSS == "rowheader") {
                                        chartData.multiLevelLabels.push((pivotEngine[0][i].Value + "#" + pivotEngine[0][i].Expander));
                                        chartData.multiLevelLabelTags.push(pivotEngine[0][i].Info + "::" + pivotEngine[0][i].State);
                                    }
                                }
                            }
                        }
                    }

                    //Forming Data Points
                    for (var i = columnHeaderHeight; i < rowCount; i++) {
                        var pointsArray = new Array();
                        if (rowHeaderWidth > 1) {
                            if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                                if (this.model.enableMultiLevelLabels) {
                                    if ($.inArray(i, summaryRows) > -1) {
                                        for (var j = rowHeaderWidth; j < columnCount; j++) {
                                            if ($.inArray(j, summaryColumns) < 0)
                                                pointsArray.push(pivotEngine[j][i].Value);
                                        }
                                        chartData.points_Y.push(pointsArray);
                                    }
                                }
                                else {
                                    if (pivotEngine[0][i].CSS == "summary rstot" && pivotEngine[0][i].Value != "Grand Total") {
                                        for (var j = rowHeaderWidth; j < columnCount; j++) {
                                            if ($.inArray(j, summaryColumns) < 0)
                                                pointsArray.push(pivotEngine[j][i].Value);
                                        }
                                        chartData.points_Y.push(pointsArray);
                                    }
                                }
                            }
                            else {
                                if ($.inArray(i, summaryRows) < 0) {
                                    for (var j = rowHeaderWidth; j < columnCount; j++) {
                                        if ($.inArray(j, summaryColumns) < 0 && pivotEngine[j][i].CSS.indexOf("value") > -1) {
                                            pointsArray.push(pivotEngine[j][i].Value == "" ? 0 : ej.parseFloat(pivotEngine[j][i].ActualValue));
                                            if ((!ej.isNullOrUndefined(pivotEngine[j][i].Format)))
                                                chartData.labelFormat = (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap ? (chartData.labelFormat.length > 0) ? chartData.labelFormat == pivotEngine[j][i].Format ? pivotEngine[j][i].Format : chartData.labelFormat + "_" + pivotEngine[j][i].Format : pivotEngine[j][i].Format : "Number");
                                        }
                                    }
                                    chartData.points_Y.push(pointsArray);
                                }
                            }
                        }
                        else if (pivotEngine[0][i].CSS == "rowheader") {
                            for (var j = pivotEngine[0][0].ColSpan; j < columnCount; j++) {
                                if ($.inArray(j, summaryColumns) < 0) {
                                    pointsArray.push(this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap ? (pivotEngine[j][i].Value == "" ? 0 : ej.parseFloat(pivotEngine[j][i].ActualValue)) : pivotEngine[j][i].Value);
                                    if ((!ej.isNullOrUndefined(pivotEngine[j][i].Format)))
                                        chartData.labelFormat = (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap ? (chartData.labelFormat.length > 0) ? chartData.labelFormat == pivotEngine[j][i].Format ? pivotEngine[j][i].Format : chartData.labelFormat + "_" + pivotEngine[j][i].Format : pivotEngine[j][i].Format : "Number");
                                }
                            }
                            chartData.points_Y.push(pointsArray);
                        }
                    }
                }

                //Getting Value Names
                if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap) {
                    chartData.measureNames = measure;
                }
                else {
                    var measureNames = (this.model.enableMultiLevelLabels && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) ? $(values).map(function (index, item) { return item.FieldHeader }) : $(this.model.dataSource.values).map(function (index, item) { return item.fieldCaption });
                    for (var i = 0; i < measureNames.length; i++)
                        chartData.measureNames += chartData.measureNames == "" ? measureNames[i] : "~" + measureNames[i];
                }
                if (this.model.enableMultiLevelLabels && this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode)
                    this.renderControlSuccess({ JsonRecords: JSON.stringify(chartData), OlapReport: pivotReport });
                else if (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj._isExporting) {
                    savedObj = $.extend(true, {}, { pivotEngine: this._pivotEngine, labelCurrentTags: this._labelCurrentTags, drillParams: this._drillParams });
                    this._pivotEngine = savedObj.pivotEngine;
                    this._labelCurrentTags = savedObj.labelCurrentTags;
                    this._drillParams = savedObj.drillParams;
                    return this._getChartSeries(chartData);
                }
                else
                    this.renderControlSuccess({ JsonRecords: JSON.stringify(chartData), OlapReport: JSON.stringify(this.model.dataSource) });
                chartData = {};
            }
            else {
                this.renderControlSuccess(pivotEngine);
            }
        },

        _cloneEngine: function (pivotEngine) {
            var clonedEngine = $.extend(true, [], pivotEngine);
            for (var i = 0; i < pivotEngine.length; i++)
                clonedEngine[i] = $.extend(true, [], pivotEngine[i]);
            return clonedEngine;
        },

        _cropData: function (pivotEngine, selectedMember, drilledDimensionIndex, isRemoved) {            
            var j = this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap ? pivotEngine[0][0].RowSpan : (this.model.dataSource.columns.length + (this.model.dataSource.values.length ==  0 || this.model.dataSource.values[0].axis == "rows" ? 0 : 1));

            if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap) {
                var tmpIndex = drilledDimensionIndex;
                do {
                    var isMemberAvl = false, i = 0;
                    while (i < pivotEngine[drilledDimensionIndex].length) {
                        if (pivotEngine[drilledDimensionIndex][i].Value == selectedMember) {
                            isMemberAvl = true;
                            break;
                        }
                        else
                            i++;
                    }
                    if (isMemberAvl)
                        break;
                    else {
                        drilledDimensionIndex = drilledDimensionIndex == tmpIndex ? pivotEngine[0][0].ColSpan : drilledDimensionIndex;
                        tmpIndex = "";
                        drilledDimensionIndex--;
                    }
                } while (!isMemberAvl && drilledDimensionIndex > -1);
            }
            drilledDimensionIndex = drilledDimensionIndex == -1 ? 0 : drilledDimensionIndex;
            while (j < pivotEngine[drilledDimensionIndex].length) {
                if (pivotEngine[drilledDimensionIndex][j].Value != selectedMember) {
                    for (var i = 0; i < pivotEngine.length; i++)
                        pivotEngine[i].splice(j, 1);
                }
                else
                    j += pivotEngine[drilledDimensionIndex][j].RowSpan;
            }
            if (this.model.analysisMode != ej.PivotChart.AnalysisMode.Olap && isRemoved) pivotEngine.splice(drilledDimensionIndex, 1);
        },

        refreshPagedPivotChart: function (axis, pageNo) {
            if (typeof ochartWaitingPopup != 'undefined' && ochartWaitingPopup != null)
                ochartWaitingPopup.show();
            axis = axis.indexOf('categ') != -1 ? "categorical" : "series";
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.dataSource.providerName == ej.olap.Providers.Mondrian) {
                if (axis == "categorical")
                    this._categCurrentPage = parseInt(pageNo);
                else
                    this._seriesCurrentPage = parseInt(pageNo);
                ej.olap.base.getJSONData({ action: "navPaging" }, this.model.dataSource, this);
            }
            else {
                var report;
                try {
                    report = JSON.parse(this.getOlapReport());
                }
                catch (err) {
                    report = this.getOlapReport();
                }
                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.paging, JSON.stringify({ "action": "paging", "pagingInfo": axis + ":" + pageNo, "currentReport": report, "customObject": JSON.stringify(this.model.customObject) }), this.renderControlSuccess);
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

        _setTitleText: function (title, clientObj) {
            this._xTitle = ej.isNullOrUndefined(this._xTitle) ? ((!ej.isNullOrUndefined(this.model.primaryXAxis.title.text) && !this.model.primaryXAxis.title.enable) ? this.model.primaryXAxis.title.text : this._xTitle) : this._xTitle;
            this._yTitle = ej.isNullOrUndefined(this._yTitle) ? ((!ej.isNullOrUndefined(this.model.primaryYAxis.title.text) && !this.model.primaryYAxis.title.enable) ? this.model.primaryYAxis.title.text : this._yTitle) : this._yTitle;
            var xCaption = "", yCaption = "", mCaption = "", field;

            if (this.model.operationalMode == ej.PivotChart.OperationalMode.ClientMode || this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                var rows = this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? JSON.parse(this.getOlapReport()).PivotRows : this.model.dataSource.rows;
                var columns = this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? JSON.parse(this.getOlapReport()).PivotColumns : this.model.dataSource.columns;

                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {
                    rows = JSON.parse(this.getOlapReport()).PivotRows;
                    columns = JSON.parse(this.getOlapReport()).PivotColumns;
                    field = "FieldName";
                }
                else {
                    rows = this.model.dataSource.rows;
                    columns = this.model.dataSource.columns;
                    field = "fieldCaption";
                }
                if(!ej.isNullOrUndefined(rows))
                    for (var x = 0; x < rows.length; x++) {
                        xCaption += (xCaption == "" ? "" : "~") + rows[x][field];
                    }
                if (!ej.isNullOrUndefined(columns))
                    for (var y = 0; y < columns.length; y++) {
                        yCaption += (yCaption == "" ? "" : "~") + columns[y][field];
                    }
                if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap) {
                    for (var z = 0; z < this.model.dataSource.values[0].measures.length; z++) {
                        if (this.model.dataSource.values[0].axis == "rows")
                            xCaption += (xCaption == "" ? "" : "~") + this.model.dataSource.values[0].measures[z].fieldCaption;
                        else
                            yCaption += (yCaption == "" ? "" : "~") + this.model.dataSource.values[0].measures[z].fieldCaption;
                    }
                }
            }
            else {
                var xAxis = title.split("><")[0].split("||"), yAxis = title.split("><")[1].split("||");
                for (var x = 0; x < xAxis.length; x++) {
                    xCaption += (xCaption == "" ? "" : "~") + clientObj.element.find(".e-cubeTreeView").find("li[data-tag='" + xAxis[x] + "'] a:eq(0)").text();
                }
                for (var y = 0; y < yAxis.length; y++) {
                    yCaption += (yCaption == "" ? "" : "~") + clientObj.element.find(".e-cubeTreeView").find("li[data-tag='" + yAxis[y] + "'] a:eq(0)").text();
                }
            }

            if (this.model.primaryXAxis.title.enable)
                this.model.primaryXAxis.title = $.extend({}, { enable: true, enableTrim: true, text: xCaption });
            else
                this.model.primaryXAxis.title = $.extend({}, { enable: false, enableTrim: true, text: xCaption });
            if (this.model.primaryYAxis.title.enable)
                this.model.primaryYAxis.title = $.extend({}, { enable: true, enableTrim: true, text: yCaption });
            else
                this.model.primaryYAxis.title = $.extend({}, { enable: false, enableTrim: true, text: yCaption });
        },

        renderControlSuccess: function (msg) {
            if (!ej.isNullOrUndefined(this._pivotClientObj) && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode)
                ej.Pivot._updateValueSortingIndex(msg, this._pivotClientObj);
            if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null)
                if ($("#" + this._pivotClientObj._id + "_maxView")[0])
                    $("#" + this._pivotClientObj._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                else
                    oclientWaitingPopup.show();
            try {
                if (msg[0] != undefined) {
                    this.setJSONRecords(msg[0].Value); this.setOlapReport(msg[1].Value);
                    if (!ej.isNullOrUndefined(msg[2]) && msg[2].Key == "AnalysisMode" && msg[2].Value == "Olap") this.model.analysisMode = ej.PivotChart.AnalysisMode.Olap;
                    if (!ej.isNullOrUndefined(this._pivotClientObj)) {
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                            this._pivotClientObj.currentReport = JSON.parse(this.getOlapReport()).Report;
                        else {
                            try {
                                this._pivotClientObj.currentReport = JSON.parse(msg[1].Value).Report;
                            }
                            catch (err) { this._pivotClientObj.currentReport = msg[1].Value; }
                        }
						if (msg[2] != null && msg[2] != undefined && msg[2].Key == "ClientReports")
                            this._pivotClientObj.reports = msg[2].Value;
                        if (msg[3] && msg[3].Key == "Title" && msg.d[3].Value != "")
                            this._setTitleText(msg[3].Value, this._pivotClientObj);
                        this._updatePageSettings(msg, this._pivotClientObj);
                    }
                    if (msg[2] != null && msg[2] != undefined && !msg[2].Key == "ClientReports" && msg[2].Key != "AnalysisMode")
                        this.model.customObject = msg[2].Value;
                    if ($(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined) {
                        if (this._pagerObj != null && msg[2] != null && msg.d[2] != undefined)
                            this._pagerObj.initPagerProperties(JSON.parse(msg.d[3].Value), JSON.parse(msg.d[2].Value));
                    }
                }
                else if (msg.d != undefined) {
                    this.setJSONRecords(msg.d[0].Value); this.setOlapReport(msg.d[1].Value);
                    if (msg.d[2].Key == "AnalysisMode" && msg.d[2].Value == "Olap") this.model.analysisMode = ej.PivotChart.AnalysisMode.Olap;
                    if (!ej.isNullOrUndefined(this._pivotClientObj)) {
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                            this._pivotClientObj.currentReport = JSON.parse(this.getOlapReport()).Report;
                        else {
                            try {
                                this._pivotClientObj.currentReport = JSON.parse(msg.d[1].Value).Report;
                            }
                            catch (err) { this._pivotClientObj.currentReport = msg.d[1].Value; }
                        }
						if (msg.d[2] != null && msg.d[2] != undefined && msg.d[2].Key == "ClientReports")
                            this._pivotClientObj.reports = msg.d[2].Value;
                        if (msg.d[3] && msg.d[3].Key == "Title" && msg.d[3].Value !="")
                            this._setTitleText(msg.d[3].Value, this._pivotClientObj);
                        this._updatePageSettings(msg.d, this._pivotClientObj);
                    }
                    if (msg.d[2] != null && msg.d[2] != undefined && !(msg.d[2].Key == "ClientReports"))
                        this.model.customObject = msg.d[2].Value;
                    if (this._pagerObj != null && $(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined) {
                        if (msg.d[2] != null && msg.d[2] != undefined && msg.d[2].Key == "PageSettings")
                            this._pagerObj.initPagerProperties(JSON.parse(msg.d[3].Value), JSON.parse(msg.d[2].Value));
                        if (msg.d[3] != null && msg.d[3] != undefined && msg.d[3].Key == "PageSettings")
                            this._pagerObj.initPagerProperties(JSON.parse(msg.d[4].Value), JSON.parse(msg.d[3].Value));
                    }
                }
                else {
                    this.setJSONRecords(msg.JsonRecords); this.setOlapReport(msg.OlapReport);
                    if (msg.AnalysisMode == "Olap") this.model.analysisMode = ej.PivotChart.AnalysisMode.Olap;
                    if (msg.customObject != null && msg.customObject != null)
                        this.model.customObject = msg.customObject;
                    if (!ej.isNullOrUndefined(this._pivotClientObj)) {
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                            this._pivotClientObj.currentReport = JSON.parse(this.getOlapReport()).Report;
                        else {
                            try {
                                this._pivotClientObj.currentReport = JSON.parse(msg.OlapReport).Report;
                            }
                            catch (err) { this._pivotClientObj.currentReport = msg.OlapReport; }
                        }
                        if (typeof (this._pivotClientObj.reports) != "undefined" && msg.reports != undefined && msg.reports != "undefined")
                            this._pivotClientObj.reports = msg.reports;
                        if (msg && msg.Title)
                            this._setTitleText(msg.Title, this._pivotClientObj);
                    }
                }
                if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {
                    var eventArgs;
                    if (this._drillAction != "")
                        eventArgs = { action: this._drillAction, element: this.element, customObject: this.model.customObject };
                    else
                        eventArgs = { action: this._currentAction, element: this.element, customObject: this.model.customObject };
                    this._trigger("afterServiceInvoke", eventArgs);
                }               
                var controlHeight, controlWidth;
                var chartHeight = this.model.size.height;
                var chartWidth = this.model.size.width;
                controlHeight = !ej.isNullOrUndefined(chartHeight) ? ((typeof (chartHeight) == "string" && chartHeight.indexOf("%") != -1) ? ((this.element.height() / 100) * parseInt(chartHeight)) : chartHeight) : (this.element.height() > 0 ? this.element.height() : 450);
                controlWidth = !ej.isNullOrUndefined(chartWidth) ? ((typeof (chartWidth) == "string" && chartWidth.indexOf("%") != -1) ? ((this.element.width() / 100) * parseInt(chartWidth)) : chartWidth) : (this.element.width() > 0 ? this.element.width() : 600);
                if (!($(this.element).parents(".e-pivotclient").length > 0)) {
                    this.model.size.height = controlHeight + "px"; this.model.size.width = controlWidth + "px";
                    if (!this.model.isResponsive)
                        this.element.width(controlWidth);
                }
                var htmlTag = ej.buildTag("div#" + this._id + "Container", "", { "height": (!ej.isNullOrUndefined(this._pivotClientObj)) ? this._pivotClientObj._chartHeight : controlHeight, "width": (!ej.isNullOrUndefined(this._pivotClientObj)) ? (this._pivotClientObj.model.enableSplitter ? this._pivotClientObj.element.find(".controlPanelTD").width() : (this._pivotClientObj._toggleExpand ? (this._pivotClientObj.element.find(".controlPanelTD").width() - 15) : (($("#" + this._pivotClientObj._id + "_maxView").length > 0 && this._pivotClientObj._pivotChart) ? $("#" + this._pivotClientObj._pivotChart._id + "Container").width() : this._pivotClientObj._chartWidth))) : controlWidth })[0].outerHTML;
                if ($(this.element).parents(".e-pivotclient").length > 0 && this._pivotClientObj.model.enableToolBar&& !this._pivotClientObj.model.displaySettings.enableFullScreen) {
                    var toolBar = this._pivotClientObj.model.enableSplitter?$("<div id="+this._id+"toolBar style='width:" + this._pivotClientObj._chartWidth + ";height:" + this._pivotClientObj._chartHeight + ";margin-top:35px;margin-left:5px'></div>"):$("<div id="+this._id+"toolBar style='width:" + this._pivotClientObj._chartWidth + ";height:" + this._pivotClientObj._chartHeight + ";overflow:auto;margin-top:35px;margin-left:5px'></div>");
                    $(toolBar).html(htmlTag);
                    this.element.html(toolBar);
                }
                else
                    this.element.html(htmlTag);
                if (this.model.commonSeriesOptions.type == ej.PivotChart.ChartTypes.Funnel || this.model.commonSeriesOptions.type == ej.PivotChart.ChartTypes.Pyramid) {
                    this.model.legend.toggleSeriesVisibility = false;
                    this.model.commonSeriesOptions.marker = {
                        dataLabel: {
                            visible: true,
                            shape: 'none',
                            font: { color: this.element.css("color"), size: '12px', fontWeight: 'lighter' }
                        }
                    }
                }
                else {
                    this.model.legend.toggleSeriesVisibility = true;
                }
                if ((this.model.operationalMode == ej.PivotChart.OperationalMode.ClientMode || this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) && !ej.isNullOrUndefined(this._pivotClientObj))
                    this._setTitleText("Title", this._pivotClientObj);
                this.renderChartFromJSON(this.getJSONRecords());
                if ($(this.element).parents(".e-pivotclient").length > 0 && this._pivotClientObj.model.enableToolBar && !this._pivotClientObj.model.displaySettings.enableFullScreen) {
                    $("#" + this._id).prepend("<div class='e-chartToolBar' style='height:40px;width:" + this._pivotClientObj.element.find(".chartContainer").width() + "px'></div>");
                    var listTool = ej.buildTag("ul", ej.buildTag("li.e-chart3DImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("TDCharts")).attr({ "title": this._getLocalizedLabels("TDCharts"), tabindex: 0 })[0].outerHTML +
                     ej.buildTag("li.e-exportImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("Exporting")).attr({ "title": this._getLocalizedLabels("Exporting"), tabindex: 0 })[0].outerHTML +
                     (!this.model.enable3D ? ej.buildTag("li.e-smartLabels e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("SmartLabels")).attr({ "title": this._getLocalizedLabels("SmartLabels"), tabindex: 0 })[0].outerHTML : "") +
                     (!this.model.enable3D ? ej.buildTag("li.e-interaction e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("Interactions")).attr({ "title": this._getLocalizedLabels("Interactions"), tabindex: 0 })[0].outerHTML : ""))[0].outerHTML +
                     ej.buildTag("ul", ej.buildTag("li#" + this._id + "_toolTipImg.e-toolTipImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("Tooltip")).attr({ "title": this._getLocalizedLabels("Tooltip"), tabindex: 0 })[0].outerHTML +
                        ej.buildTag("li.e-legend e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("Legend")).attr({ "title": this._getLocalizedLabels("Legend"), tabindex: 0 })[0].outerHTML +
                        (!this.model.enable3D ? ej.buildTag("li.e-zooming e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("Zooming")).attr({ "title": this._getLocalizedLabels("Zooming"), tabindex: 0 })[0].outerHTML : "") +
                        (ej.buildTag("li.e-icon-xAxis-title e-icon", "", {}).attr("aria-label", "X-Axis title").attr({ "title": "X-Axis title", tabindex: 0 })[0].outerHTML) +
                        (ej.buildTag("li.e-icon-yAxis-title e-icon", "", {}).attr("aria-label", "Y-Axis title").attr({ "title": "Y-Axis title", tabindex: 0 })[0].outerHTML))[0].outerHTML;
                    $(".e-chartToolBar").append($(listTool));
                    $(".e-chartToolBar").ejToolbar({ enableRTL: this.model.enableRTL, enableSeparator: true, height: "35px" });
                    if (this.model.enable3D)
                        this.element.find(".e-chart3DImg").addClass("e-enabled");
                    if (this.model.zooming.enable)
                        this.element.find(".e-zooming").addClass("e-enabled");
                    if (this.model.legend.visible)
                        this.element.find(".e-legend").addClass("e-enabled");
                    if (!ej.isNullOrUndefined(this.model.primaryXAxis.labelIntersectAction))
                        this.element.find(".e-smartLabels").addClass("e-enabled");
                    if (this.model.primaryXAxis.title.enable)
                        this.element.find(".e-icon-xAxis-title").addClass("e-enabled");
                    if (this.model.primaryYAxis.title.enable)
                        this.element.find(".e-icon-yAxis-title").addClass("e-enabled");
                    if (this.model.commonSeriesOptions.tooltip.visible)
                        this.element.find(".e-toolTipImg").addClass("e-enabled");
                    if (this.model.crosshair.visible)
                        this.element.find(".e-interaction").addClass("e-enabled");
                    if (this.model.crosshair.type == "trackball")
                        this.element.find(".e-trackBall").addClass("e-enabled");
                    if (this.model.crosshair.type == "crosshair") 
                        this.element.find(".e-crossHair").addClass("e-enabled");
                    if (!this.model.crosshair.visible)
                        this.element.find(".none").addClass("e-enabled");

                    this._pivotClientObj._unWireEvents();
                    this._pivotClientObj._wireEvents();
                }
                this._unWireEvents();
                this._wireEvents();
                if (this._drillAction != "") {
                    this.model.currentReport = this.getOlapReport();
                    if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot && !this.model.enableMultiLevelLabels) {
                        if (this.model.operationalMode == ej.PivotChart.OperationalMode.ClientMode) {
                            var chartData = this.getJSONRecords();
                            if (this.model.dataSource.rows.length - this._labelCurrentTags.expandedMembers.length > 1) {
                                this._labelCurrentTags["collapsedMembers"] = new Array();
                                for (var i = 0; i < chartData.chartLables.length; i++)
                                    this._labelCurrentTags["collapsedMembers"].push(chartData.chartLables[i]);
                            }
                        }
                        else {
                            var chartData = this.getJSONRecords();
                            var rows =  !(ej.isNullOrUndefined(JSON.parse(this.getOlapReport()).rows)) ?  JSON.parse(JSON.parse(this.getOlapReport()).rows) : (JSON.parse(this.getOlapReport()).PivotRows);
                            this._labelCurrentTags["collapsedMembers"] = new Array();
                            if (rows.length - this._labelCurrentTags.expandedMembers.length > 1) {
                                for (var i = 0; i < chartData.chartLables.length; i++)
                                    this._labelCurrentTags["collapsedMembers"].push(chartData.chartLables[i]);
                            }
                        }
                    }
                    if (!ej.isNullOrUndefined(this._pivotClientObj))
                        this._pivotClientObj._trigger("chartDrillSuccess", this.element);
                        this._trigger("drillSuccess", this.element);
                }
                else {
                    if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                        if (this.model.operationalMode == ej.PivotChart.OperationalMode.ClientMode) {
                            var chartData = this.getJSONRecords();
                            this._labelCurrentTags = { collapsedMembers: [] };
                            if (this.model.dataSource.rows.length > 1) {
                                for (var i = 0; i < chartData.chartLables.length; i++)
                                    this._labelCurrentTags["collapsedMembers"].push(chartData.chartLables[i]);
                            }
                        }
                        else {
                            var chartData = this.getJSONRecords();
                            this.model.currentReport = JSON.parse(this.getOlapReport());
                            this._labelCurrentTags = { collapsedMembers: [] };
                            if ($(this.element).parents(".e-pivotclient").length > 0 ? this.model.currentReport.PivotRows.length > 1 : JSON.parse(this.model.currentReport.rows).length > 1) {
                                for (var i = 0; i < chartData.chartLables.length; i++) {
                                    this._labelCurrentTags["collapsedMembers"].push(chartData.chartLables[i]);
                                }
                            }
                        }
                    }
                }
                var pivotClientObj = ($(this.element).parents(".e-pivotclient").length > 0) ? $(this.element).parents(".e-pivotclient").data("ejPivotClient") : null;
                if (!ej.isNullOrUndefined(pivotClientObj)) pivotClientObj._isTimeOut = false;
                if (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj._waitingPopup != null) {
                    if ($("#" + this._pivotClientObj._id + "_maxView")[0]) {
                        $("#" + this._pivotClientObj._id + "_maxView").ejWaitingPopup({ showOnInit: false });
                        this._pivotClientObj._waitingPopup.hide();
                    }
                    else if (!ej.isNullOrUndefined(this._pivotClientObj._pivotGrid)) {
                        if (this._pivotClientObj && (this._pivotClientObj._pivotGrid._drillAction && !this._pivotClientObj._pivotGrid._startDrilldown) || this._pivotClientObj._pivotChart._drillAction && !this._pivotClientObj._pivotChart._startDrilldown)
                            this._pivotClientObj._waitingPopup.hide();
                        else if (this._pivotClientObj && this._pivotClientObj._pivotGrid._drillAction == "" && this._pivotClientObj._pivotChart._drillAction == "" && !this._pivotClientObj._pivotGrid._startDrilldown && !this._pivotClientObj._pivotChart._startDrilldown && (this._pivotClientObj._pivotGrid._JSONRecords != null || this._pivotClientObj._pivotChart._JSONRecords == null))
                            this._pivotClientObj._waitingPopup.hide();
                        else if (this._pivotClientObj._pivotChart._startDrilldown && !this._pivotClientObj._pivotGrid._startDrilldown && !$("#" + this._pivotClientObj._id + "_maxView")[0])
                            this._pivotClientObj._waitingPopup.show();
                        else if (!this._pivotClientObj._pivotChart._startDrilldown && !this._pivotClientObj._pivotGrid._startDrilldown && this._pivotClientObj._pivotChart._drillAction == "" && this._pivotClientObj._pivotGrid._drillAction == "" && (this._pivotClientObj._pivotGrid._JSONRecords != null || this._pivotClientObj._pivotChart._JSONRecords == null))
                            this._pivotClientObj._waitingPopup.hide();
                    }
                    if (this._pivotClientObj.model.displaySettings.mode == "chartonly")
                        this._pivotClientObj._waitingPopup.hide();
                }
                else
                    this._waitingPopup.hide();
                if (!ej.isNullOrUndefined(this._pivotClientObj))
                    this._pivotClientObj._pivotChart._startDrilldown = false;
            }
            catch (err) {
            }
            if (!ej.isNullOrUndefined(msg.Exception)) {
                ej.Pivot._createErrorDialog(msg, "Exception", this);
            }
            //var eventArgs = { "action": this._currentAction, "customObject": this.model.customObject, "element": this.element };
            this._trigger("renderSuccess", this);
        },

        _getChartSeries: function (jsonData) {
            var pivotChartObj = this, chartSeries = new Array();
            if (this.model.enableRTL) {
                jsonData.chartLables = $.map(jsonData.chartLables, function (x) { return x.split("~~").map(function (val) { return val.split('#').reverse().join('#') }).reverse().join("~~"); });
                jsonData.seriesNames = $.map(jsonData.seriesNames, function (x) { return x.split("~~").map(function (val) { return val.split('#').reverse().join('#') }).reverse().join("~~"); });
            }
            var chartLabels = [];
            if (pivotChartObj.model.analysisMode == ej.PivotChart.AnalysisMode.Olap) {
                chartLabels = $.map($.extend([], jsonData.chartLables, true), function (val) { return val.split('#').join("~~") });
            }
            else {
                chartLabels = $.map($.extend([], jsonData.chartLables, true), function (val) { return (!ej.isNullOrUndefined(pivotChartObj._labelCurrentTags.expandedMembers) && pivotChartObj._labelCurrentTags.expandedMembers.length > 0) ? (pivotChartObj._labelCurrentTags.expandedMembers.join("~~") + "~~" + val) : val; });
            }
                
            var seriesPoints = new Array(); var XValues = chartLabels; var tempArray = new Array();
            var YValues = new Array(); var pointsCount = 0, pCnt = 0; var count = 0; var seriesName = new Array(); var points, measureRCnt = 0;
            var trendlines = this.model.series[0].trendlines[0];
            measureRCnt = jsonData.measureInfo != "" ? parseInt(jsonData.measureInfo) : 0;
            jQuery.each(chartLabels, function (index, value) {
                var YPoints = new Array();
                if (measureRCnt > 1 && jsonData.addInfo.action != "DrillChart" || (measureRCnt > 1 && jsonData.addInfo.levelHash == "1")) {
                    var lblVal = (((index + 1) * measureRCnt) - measureRCnt);
                    for (var mCnt = 0; mCnt < measureRCnt; mCnt++) {
                        if (jsonData.points_Y[(lblVal + mCnt)] != undefined && chartLabels[index].split("~~")[0] == jsonData.points_Y[(lblVal + mCnt)][0].Item1)
                            for (var i = 0; i < jsonData.points_Y[index].length; i++) {
                                points = { "xValues": chartLabels[index], "yValues": (jsonData.points_Y[lblVal + mCnt][i].Item2).indexOf(",") > -1 ? ej.globalize.parseFloat(ej.globalize.format((jsonData.points_Y[lblVal + mCnt][i].Item2), "c", pivotChartObj.locale()), pivotChartObj.locale()) : (jsonData.points_Y[lblVal + mCnt][i].Item2) == "" ? 0 : ej.globalize.parseFloat((jsonData.points_Y[lblVal + mCnt][i].Item2)), "text": (jsonData.points_Y[lblVal + mCnt][i].Item2) == "" ? 0 : (jsonData.points_Y[lblVal + mCnt][i].Item2) };
                                points.yValues = ej.isNullOrUndefined(points.yValues) ? points.yValues : (jQuery.isNumeric(points.yValues) ? points.yValues : ej.globalize.parseFloat((jsonData.points_Y[lblVal + mCnt])[i].Item2.toString().replace(/[^\d.,-]/g, '')));
                                YPoints.push(points);
                            }
                    }
                }
                else
                    for (var i = 0; i < jsonData.points_Y[index].length; i++) {
                        if (pivotChartObj.model.analysisMode == ej.PivotChart.AnalysisMode.Olap && pivotChartObj.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {
                            if (pivotChartObj.seriesType() == "bubble")
                                points = { "xValues": chartLabels[index], "yValues": (jsonData.points_Y[index])[i].Item2 == "" ? 0 : (jsonData.points_Y[index])[i].Item2, "size": (jsonData.points_Y[index])[i].Item2 == "" ? 0 : (jsonData.points_Y[index])[i].Item2 };
                            else
                                points = {
                                    "xValues": chartLabels[index], "yValues":
                                        //(jsonData.points_Y[index])[i].Item2.indexOf(",") > -1 ? ej.globalize.parseFloat(ej.globalize.format((jsonData.points_Y[index])[i].Item2, "c", pivotChartObj.model.locale), pivotChartObj.model.locale) : 
                                        (jsonData.points_Y[index])[i].Item2 == "" ? 0 : ej.globalize.parseFloat((jsonData.points_Y[index])[i].Item2), "text": (jsonData.points_Y[index])[i].Item2 == "" ? "0" : ((jsonData.points_Y[index])[i].Item2).toString()
                                };
                            points.yValues = ej.isNullOrUndefined(points.yValues) ? points.yValues : (jQuery.isNumeric(points.yValues) ? points.yValues : ej.globalize.parseFloat((jsonData.points_Y[index])[i].Item2.toString().replace(/[^\d.,-]/g, '')));
                        }
                        else {
                            if (pivotChartObj.seriesType() == "bubble")
                                points = { "xValues": chartLabels[index].toString().split('#')[chartLabels[index].toString().split('#').length - 1], "yValues": (jsonData.points_Y[index])[i] == "" ? 0 : (jsonData.points_Y[index])[i], "size": (jsonData.points_Y[index])[i] == "" ? 0 : (jsonData.points_Y[index])[i] };
                            else
                                points = { "xValues": chartLabels[index].toString().split('#')[chartLabels[index].toString().split('#').length - 1], "yValues": (jsonData.points_Y[index])[i] == "" ? 0 : (jsonData.points_Y[index])[i], "text": (jsonData.points_Y[index])[i] == "" ? "0" : ((jsonData.points_Y[index])[i]).toString() };
                            points.yValues = ej.isNullOrUndefined(points.yValues) ? points.yValues : (jQuery.isNumeric(points.yValues) ? points.yValues : ej.globalize.parseFloat((jsonData.points_Y[index])[i].toString().replace(/[^\d.,-]/g, '')));
                        }
                        YPoints.push(points);
                    }
                seriesPoints.push(YPoints);
            });

            if (measureRCnt > 1 && jsonData.addInfo.action != "DrillChart" || (measureRCnt > 1 && jsonData.addInfo.levelHash == "1"))
                for (var mCnt = 0; mCnt < (measureRCnt * jsonData.seriesNames.length) ; mCnt++)
                    tempArray.push(new Array());
            else {
                jQuery.each(jsonData.seriesNames, function (index, value) {
                    tempArray.push(new Array());
                });
            }
            jQuery.each(chartLabels, function (index, value) {
                for (var i = 0; i < seriesPoints[index].length; i++) {
                        if(ej.isNullOrUndefined(tempArray[i]))
                            tempArray[i]=[];
                    tempArray[i].push((seriesPoints[index])[i]);
                }
            });
            if (measureRCnt > 1 && jsonData.addInfo.action != "DrillChart" || (measureRCnt > 1 && jsonData.addInfo.levelHash == "1")) {
                for (var index = 0; index < (measureRCnt * jsonData.seriesNames.length) ; index++) {
                    chartSeries[pCnt] = { dataSource: tempArray[index], xName: "xValues", yName: "yValues", name: jsonData.seriesNames[pointsCount], trendlines: [trendlines] };
                    pointsCount++; pCnt++;
                    if (pointsCount == jsonData.seriesNames.length)
                        pointsCount = 0;
                }
            }
            else {
                if (this.seriesType() == "bubble") {
                    jQuery.each(jsonData.seriesNames, function (index, value) {
                        chartSeries[pointsCount] = { dataSource: tempArray[index], xName: "xValues", yName: "yValues", size: "size", name: jsonData.seriesNames[pointsCount], trendlines: [trendlines] };
                        pointsCount++;
                    });
                }
                else {
                    jQuery.each(jsonData.seriesNames, function (index, value) {
                        chartSeries[pointsCount] = { dataSource: tempArray[index], xName: "xValues", yName: "yValues", name: jsonData.seriesNames[pointsCount], marker: { dataLabel: { textMappingName: "text" } }, trendlines: [trendlines] };
                        pointsCount++;
                    });
                }
            }
            return chartSeries;
        },

        renderChartFromJSON: function (jsonData) {
            if (!this.model.enableDefaultValue && (!ej.isNullOrUndefined(jsonData) && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && jsonData.measureNames == "" && !ej.isNullOrUndefined(jsonData.points_Y) && jsonData.points_Y.length > 0))
                jsonData.points_Y = $.map(jsonData.points_Y, function (itm) { return $.map(itm, function (i) { ej.isNullOrUndefined(i.Item2) ? i = 0 : i.Item2 = ""; return i; }); });
            this.setJSONRecords(JSON.stringify(jsonData));
            var chartSeries = new Array();
            if (jsonData == null || jsonData == "") {
                if (jsonData == "") {
                    var htmlTag = ej.buildTag("div#" + this._id + "Container")[0].outerHTML;
                    this.element.html(htmlTag);
                }
                chartSeries = [];
                this.model.primaryXAxis.multiLevelLabels = [];
            }
            else if (jsonData != null && jsonData.chartLables.length > 0 && jsonData.points_Y.length > 0) {
                chartSeries = this._getChartSeries(jsonData);
                var chartSetting = { series: $.extend(true, [], chartSeries), axes: this.model.axes };
                if (this.model.axes.length <= chartSeries.length) {
                    for (var i = 0; i < this.model.axes.length; i++) {
                        if (this.model.axes[i].name.indexOf(":") > -1) {
                            var axis = this.model.axes[i].name.split(":").length > 0 ? this.model.axes[i].name.split(":")[0] : "y";
                            var seriesIndex = this.model.axes[i].name.split(":")[1].split(',');
                            for (var a = 0; a < seriesIndex.length; a++) {
                           if(!ej.isNullOrUndefined(axis)){
                             if(axis.toLowerCase().indexOf("x")==-1)
                                 chartSeries[parseInt(seriesIndex[a])].yAxisName = this.model.axes[i].name;
                               else
                                  chartSeries[parseInt(seriesIndex[a])].xAxisName = this.model.axes[i].name;                                                                
                              }
                            }
                        }
                    }
                }
                this._trigger("beforeSeriesRender", chartSetting);
                if (!ej.isNullOrUndefined(this.model.beforeSeriesRender))
                    chartSeries = chartSetting.series;
                if (this.model.enableMultiLevelLabels && !ej.isNullOrUndefined(jsonData.multiLevelLabels)) {
                    this.model.primaryXAxis["majorTickLines"] = { size: 0 };
                    var groupLabels = [], arrayLabels = [];
                    for (var i = 0; i < jsonData.multiLevelLabels.length; i++) {
                        arrayLabels.push(jsonData.multiLevelLabels[i].split("~~"));
                    }
                    for (var i = jsonData.multiLevelLabels[0].split('~~').length - 1; i >= 0; i--) {
                        var groupRowLabels = [];
                        for (var j = 0; j < jsonData.multiLevelLabels.length; j++) {
                            var rowLabels = {};
                            rowLabels["name"] = jsonData.multiLevelLabels[j].split('~~')[i].split('#')[0];                            
                            if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {
                                rowLabels["rowSpan"] = parseInt(jsonData.multiLevelLabels[j].split('~~')[i].split('#')[1]);
                                rowLabels["colSpan"] = parseInt(jsonData.multiLevelLabels[j].split('~~')[i].split('#')[2]);
                                rowLabels["tag"] = jsonData.multiLevelLabelTags[j].split('~~')[i];
                            }
                            else
                            {
                                if (i == jsonData.multiLevelLabels[0].split('~~').length - 1)
                                    rowLabels["colSpan"] = 1;
                                else {
                                    var parentCompare = "", colSpan = 0;
                                    for (var k = j; k < arrayLabels.length; k++) {
                                        var parentLabels = "";
                                        for (var l = i; l >= 0; l--) {
                                            parentLabels += parentLabels == "" ? (arrayLabels[k])[l] : "$" + (arrayLabels[k])[l];
                                        }
                                        colSpan += parentCompare == "" || parentCompare == parentLabels ? 1 : 0;
                                        if (parentCompare != parentLabels && parentCompare != "")
                                            break;
                                        else
                                            parentCompare = parentLabels;
                                    }
                                    rowLabels["colSpan"] = colSpan;
                                }
                                if (parseInt(jsonData.multiLevelLabels[j].split('~~')[i].split('#')[1]) == 0) {
                                    var rowSpan = 0;
                                    for (var m = i; m >= 0; m--) {
                                        rowSpan++;
                                        if (parseInt((arrayLabels[j])[m].split('#')[1]) > 0)
                                            break;
                                    }
                                    rowLabels["rowSpan"] = rowSpan;
                                }
                                else
                                    rowLabels["rowSpan"] = 1;
                                rowLabels["tag"] = !ej.isNullOrUndefined(jsonData.multiLevelLabelTags[j]) ? jsonData.multiLevelLabelTags[j].split('~~')[i] : "";
                            }
                            groupRowLabels.push(rowLabels);
                        }
                        groupLabels.push(groupRowLabels);
                    }
                    var parentIndices = [];
                    if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {
                        for (var j = 0; j < groupLabels[0].length; j++) {
                            for (var i = groupLabels.length - 1; i >= 0; i--) {
                                if (!ej.isNullOrUndefined((groupLabels[i])[j])) {
                                    if ((groupLabels[i])[j].rowSpan > 1 && parentIndices.indexOf(i + "-" + j) == -1) {
                                        var rowSpan = (groupLabels[i])[j].rowSpan;
                                        var count = 1;
                                        do {
                                            delete (groupLabels[i - count])[j];
                                            count++;
                                        } while (rowSpan > count);
                                        parentIndices.push(i + "-" + j);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        for (var j = 0; j < groupLabels[0].length; j++) {
                            for (var i = 0; i < groupLabels.length; i++) {
                                if (!ej.isNullOrUndefined((groupLabels[i])[j])) {
                                    if ((groupLabels[i])[j].rowSpan > 1 && parentIndices.indexOf(i + "-" + j) == -1) {
                                        var rowSpan = (groupLabels[i])[j].rowSpan;
                                        var count = 0;
                                        do {
                                            delete (groupLabels[i + count])[j];
                                            count++;
                                        } while (rowSpan > count + 1);
                                        (groupLabels[i + count])[j].rowSpan = rowSpan;
                                        parentIndices.push((i + count) + "-" + j);
                                    }
                                }
                            }
                        }
                    }

                    var finalMultiLvlLabels = [];
                    var rowFieldsLength = (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) ? (ej.isNullOrUndefined(JSON.parse(this.getOlapReport()).PivotRows) ? JSON.parse(JSON.parse(this.getOlapReport()).rows).length : JSON.parse(this.getOlapReport()).PivotRows.length) : ((this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot && this.model.operationalMode == ej.PivotChart.OperationalMode.ClientMode) ? this.model.dataSource.rows.length : 0);
                    for (var i = 0; i < groupLabels.length; i++) {
                        for (var j = 0; j < groupLabels[i].length; j++) {
                            if (!ej.isNullOrUndefined((groupLabels[i])[j])) {
                                var range = j - 0.5;
                                var obj = {};
                                obj["visible"] = true;
                                obj["text"] = this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap ? ((groupLabels[i])[j].tag.endsWith("2") ? ("+ " + (groupLabels[i])[j].name) : ((groupLabels[i])[j].tag.endsWith("1") ? "- " + (groupLabels[i])[j].name : (groupLabels[i])[j].name)) : (rowFieldsLength == groupLabels.length && i == 0 ? (groupLabels[i])[j].name : (i == 0 || (groupLabels[i])[j].rowSpan > 1 ? ("+ " + (groupLabels[i])[j].name) : ("- " + (groupLabels[i])[j].name)));
                                obj["tag"] = this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap ? (groupLabels[i])[j].tag : (rowFieldsLength == groupLabels.length && i == 0 ? ((groupLabels[i])[j].name + "#" + 0) : (i == 0 || (groupLabels[i])[j].rowSpan > 1 ? ((groupLabels[i])[j].name) + "#" + 1 : ((groupLabels[i])[j].name) + "#" + 2));
                                obj["start"] = range;
                                obj["end"] = range + (groupLabels[i])[j].colSpan;
                                obj["level"] = i;
                                obj["span"] = (groupLabels[i])[j].rowSpan > 1 ? true : false;
                                finalMultiLvlLabels.push(obj);                                
                                j += (groupLabels[i])[j].colSpan - 1;
                            }
                        }
                    }
                    this.model.primaryXAxis.multiLevelLabels = finalMultiLvlLabels;
                    this.model.zooming.enableScrollbar = true;
                }
                else if (jsonData.chartLables.length > 10 && this.model.zooming == "")
                    this.model.zooming = { enable: true, type: 'x,y', enableMouseWheel: true };
                else if (jsonData.chartLables.length < 10 && this._initZooming == "")
                    this.model.zooming = this._initZooming;
                if (this.model.crosshair.visible) {
                    this.model.commonSeriesOptions.tooltip.format = "#point.x# : #point.y#";
                }
                else {
                    if (this.model.enableRTL) {
                        this.model.commonSeriesOptions.tooltip = { visible: true, template: 'toolTipTemplate' };
                    }
                    else {
                        this.model.commonSeriesOptions.tooltip.format = (this._getLocalizedLabels("Measure")) + " : " + jsonData.measureNames + " <br/>" +
                                      (this._getLocalizedLabels("Column")) + " : #series.name# <br/>" +
                                      (this._getLocalizedLabels("Row")) + " : #point.x# <br/>" +
                                      (this._getLocalizedLabels("Value")) + " : #point.y#";
                    }
                }

                if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap)
                    if(this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {                        
                        var lformat = "";                        
                        if ((this.model.primaryYAxis.labelFormat != null || this.model.primaryYAxis.labelFormat != "") && (this.model.primaryYAxis.labelFormat))
                            lformat = this.model.primaryYAxis.labelFormat;
                        else if (jsonData.labelFormat.indexOf("#") > -1 && jsonData.measureNames.indexOf("~") < 0 && !(jsonData.labelFormat.indexOf("$") > -1)) {
                            if (jsonData.labelFormat == "#,#")
                                lformat = "Number";
                            else if (jsonData.labelFormat.indexOf("#,#") > -1 && jsonData.labelFormat.split('#')[jsonData.labelFormat.split('#').length - 1].indexOf(")") > -1) {
                                if (jsonData.labelFormat.indexOf(";") > -1) {
                                    var format = jsonData.labelFormat.split(";")[0];
                                    lformat = ("n" + (format.split('#')[format.split('#').length - 1] == "0" ? 0 : format.split('#')[format.split('#').length - 1].split('.')[1].split('0').length - 1))
                                }
                                else
                                    lformat = "";
                            }
                            else if (($.isNumeric(jsonData.labelFormat.split('#')[jsonData.labelFormat.split('#').length - 1])))
                                lformat = ("n" + (jsonData.labelFormat.split('#')[jsonData.labelFormat.split('#').length - 1] == "0" ? 0 : jsonData.labelFormat.split('#')[jsonData.labelFormat.split('#').length - 1].split('.')[1].split('0').length - 1))
                            else
                                lformat = ("{value}" + jsonData.labelFormat.split('##')[jsonData.labelFormat.split('##').length - 1]);
                        }
                        else if (jsonData.labelFormat.toLowerCase().indexOf("percent") > -1 && jsonData.measureNames.indexOf("~") < 0)
                            lformat = "{value}%"
                        else if ((jsonData.labelFormat.toLowerCase().indexOf("currency") > -1 || jsonData.labelFormat.indexOf("$") > -1) && jsonData.measureNames.indexOf("~") < 0)
                            lformat = "Currency";
                        else
                            lformat = "";
                        this.model.primaryYAxis.labelFormat = lformat; 
                    }
                    else {
                        if (this.model.dataSource.values[0].measures.length == 1)
                            if (!ej.isNullOrUndefined(this.model.dataSource.values[0].measures[0].format))
                                this.model.primaryYAxis.labelFormat = (this.model.primaryYAxis.labelFormat != null || this.model.primaryYAxis.labelFormat != "") && (this.model.primaryYAxis.labelFormat) ? this.model.primaryYAxis.labelFormat : (this.model.dataSource.values[0].measures[0].format.toLowerCase() == "decimal") ? "n2" : (this.model.dataSource.values[0].measures[0].format.toLowerCase() == "number") ? "Number" : (this.model.dataSource.values[0].measures[0].format.toLowerCase() == "percent") ? "p2" : (this.model.dataSource.values[0].measures[0].format.toLowerCase() == "currency") ? "Currency" : (this.model.dataSource.values[0].measures[0].format.toLowerCase() == "date") ? "MM/dd/yyyy" : (this.model.dataSource.values[0].measures[0].format.toLowerCase() == "time") ? "hh:mm:ss" : "";
                    }
                else if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot)
                    if (this.model.operationalMode == ej.PivotChart.OperationalMode.ClientMode) {
                        if (this.model.dataSource.values.length == 1)
                            if (!ej.isNullOrUndefined(this.model.dataSource.values[0].format))
                                this.model.primaryYAxis.labelFormat = (this.model.primaryYAxis.labelFormat != null || this.model.primaryYAxis.labelFormat != "") && (this.model.primaryYAxis.labelFormat) ? this.model.primaryYAxis.labelFormat : (this.model.dataSource.values[0].format.toLowerCase() == "decimal") ? "n2" : (this.model.dataSource.values[0].format.toLowerCase() == "number") ? "Number" : (this.model.dataSource.values[0].format.toLowerCase() == "percentage") ? "p2" : (this.model.dataSource.values[0].format.toLowerCase() == "currency") ? "Currency" : (this.model.dataSource.values[0].format.toLowerCase() == "date") ? (!ej.isNullOrUndefined(this.model.dataSource.values[0].formatString) ? this.model.dataSource.values[0].formatString : "dd/MMMM/yyyy") : (this.model.dataSource.values[0].format.toLowerCase() == "time") ? "hh:mm:ss" : "";
                    }
                    else {
                        var pivotCalculations = (ej.isNullOrUndefined(JSON.parse(this.getOlapReport()).PivotCalculations) ? JSON.parse(JSON.parse(this.getOlapReport()).values) : JSON.parse(this.getOlapReport()).PivotCalculations);
                        if (jsonData.labelFormat.length == 1 && pivotCalculations.length == 1)
                            this.model.primaryYAxis.labelFormat = (this.model.primaryYAxis.labelFormat != null || this.model.primaryYAxis.labelFormat != "") && (this.model.primaryYAxis.labelFormat) ? this.model.primaryYAxis.labelFormat : (jsonData.labelFormat[0].toLowerCase() == "#.##") ? "n2" : (jsonData.labelFormat[0].toLowerCase() == "###") ? "Number" : (jsonData.labelFormat[0].toLowerCase() == "p") ? "p2" : (jsonData.labelFormat[0].toLowerCase() == "c") ? "Currency" : "";
                    }

                if (this.model.zooming.enableScrollbar) {
                    if (ej.isNullOrUndefined(this.model.size.width)) this.model.size.width = "800px";
                    if (ej.isNullOrUndefined(this.model.size.height)) this.model.size.height = "400px";
                    var chartWidthPixel = this.model.size.width.indexOf("%") > -1 ? (this.element.width() * this.model.size.width.split("%")[0]) / 100 : this.model.size.width.split("px")[0];
                    var chartHeightPixel = this.model.size.height.indexOf("%") > -1 ? (this.element.height() * this.model.size.height.split("%")[0]) / 100 : this.model.size.height.split("px")[0];
                    var pointsPerFrame = (this.seriesType() == "bar" || this.seriesType() == "stackingbar") ? (chartHeightPixel / 100) * 6 : (chartWidthPixel / 100) * 3;
                    this.model.primaryXAxis.zoomFactor = pointsPerFrame / (jsonData.chartLables.length * jsonData.seriesNames.length);
                }
                else
                    this.model.primaryXAxis.zoomFactor = 1;
                this.model.primaryXAxis.labelRotation = ej.isNullOrUndefined(this.model.primaryXAxis.labelRotation) ? 270 : this.model.primaryXAxis.labelRotation;                
            }
            else
                this.model.primaryXAxis.multiLevelLabels = [];
            var curChartObj = this;
            var primaryX = jQuery.extend(true, {}, this.model.primaryXAxis);
            var primaryY = jQuery.extend(true, {}, this.model.primaryYAxis);
            if (!ej.isNullOrUndefined(this._pivotClientObj))
                if (!ej.isNullOrUndefined(this._xTitle))
                    primaryX.title.text = this._xTitle;
                else if (!this.model.primaryXAxis.title.enable)
                    primaryX.title.text = "";
            if (!ej.isNullOrUndefined(this._pivotClientObj))
                if (!ej.isNullOrUndefined(this._yTitle))
                    primaryY.title.text = this._yTitle;
                else if (!this.model.primaryYAxis.title.enable)
                    primaryY.title.text = "";
            $("#" + this._id + "Container").ejChart({
				axes: this.model.axes,
                border: this.model.border,
                backGroundImageUrl: this.model.backGroundImageUrl,
                palette: this.model.palette,
                chartArea: this.model.chartArea,
                primaryXAxis: primaryX,
                primaryYAxis: primaryY,
                secondaryX: this.model.secondaryX,
                secondaryY: this.model.secondaryY,
                striplineDefault: this.model.striplineDefault,
                title: {
                    text: this.titleText(),
                    textAlignment: this.model.title.textAlignment,
                    font: {
                        color: this.model.title.color,
                        fontFamily: this.model.title.fontFamily,
                        fontWeight: this.model.title.fontWeight,
                        opacity: this.model.title.opacity,
                        size: this.model.title.size,
                        fontStyle: this.model.title.fontStyle
                    }
                },
                locale : this.locale(),
                lineCap: this.model.lineCap,
                lineJoin: this.model.lineJoin,
                legendAlignment: this.model.legendAlignment,
                legendPosition: this.model.legendPosition,
                legend: this.model.legend,
                animation: this.model.animation,
                crosshair: this.model.crosshair,
                commonSeriesOptions: {
                    doughnutCoefficient: this.model.commonSeriesOptions.doughnutCoefficient,
                    explodeOffset: this.model.commonSeriesOptions.explodeOffset,
                    pyramidMode: this.model.commonSeriesOptions.pyramidMode,
                    gapRatio: this.model.commonSeriesOptions.gapRatio,
                    pieCoefficient: this.model.commonSeriesOptions.pieCoefficient,
                    doughnutSize: this.model.commonSeriesOptions.doughnutSize,
                    startAngle: this.model.commonSeriesOptions.startAngle,
                    xAxisName: this.model.commonSeriesOptions.xAxisName,
                    yAxisName: this.model.commonSeriesOptions.yAxisName,
                    explodeAll: this.model.commonSeriesOptions.explodeAll,
                    explodeIndex: this.model.commonSeriesOptions.explodeIndex,
                    tooltipOptions: this.model.commonSeriesOptions.tooltipOptions,
                    marker: this.model.commonSeriesOptions.marker || this.model.marker,
                    font: this.model.commonSeriesOptions.font,
                    type: this.seriesType(),
                    enableAnimation: this.model.commonSeriesOptions.enableAnimation,
                    style: this.model.commonSeriesOptions.style,
                    explode: this.model.commonSeriesOptions.explode,
                    labelPosition: this.model.commonSeriesOptions.labelPosition,
                    tooltip: this.model.commonSeriesOptions.tooltip,
                    zOrder: this.model.commonSeriesOptions.zOrder,
                    drawType: this.model.commonSeriesOptions.drawType,
                    isStacking: this.model.commonSeriesOptions.isStacking,
                    enableSmartLabels: this.model.commonSeriesOptions.enableSmartLabels
                },
                seriesStyle: this.model.seriesStyle,
                pointStyle: this.model.pointStyle,
                textStyle: this.model.textStyle,
                initSeriesRender: this.model.initSeriesRender,
                theme: this.model.theme,
                canResize: this.model.isResponsive,
                rotation: this.model.rotation,
                enable3D: this.model.enable3D,
                zooming: this.model.zooming,
                margin: this.model.margin,
                elementSpacing: this.model.elementSpacing,
                seriesColors: this.model.seriesColors,
                seriesBorderColors: this.model.seriesBorderColors,
                pointColors: this.model.pointColors,
                pointBorderColors: this.model.pointBorderColors,
                series: chartSeries,
                size: this.model.size,
                load: this.model.enableMultiLevelLabels ? this._onChartLoad : this.model.load,
                loaded: this.model.enableMultiLevelLabels ? ej.proxy(this._onChartLoaded, this) : null,
                axesRangeCalculate: this.model.axesRangeCalculate,
                axesTitleRendering: this.model.axesTitleRendering,
                chartAreaBoundsCalculate: this.model.chartAreaBoundsCalculate,
                legendItemRendering: this.model.legendItemRendering,
                lengendBoundsCalculate: this.model.lengendBoundsCalculate,
                preRender: this.model.preRender,
                seriesRendering: this.model.seriesRendering,
                symbolRendering: this.model.symbolRendering,
                titleRendering: this.model.titleRendering,
                axesLabelsInitialize: this.model.axesLabelsInitialize,
                pointRegionMouseMove: this.model.pointRegionMouseMove,
                legendItemClick: this.model.legendItemClick,
                legendItemMouseMove: this.model.legendItemMouseMove,
                displayTextRendering: this.model.displayTextRendering,
                toolTipInitialize: this.model.toolTipInitialize,
                trackAxisToolTip: this.model.trackAxisToolTip,
                trackToolTip: this.model.trackToolTip,
                animationComplete: this.model.animationComplete,
                destroy: this.model.destroy,
                create: this.model.create,
                axesLabelRendering: ej.proxy(this._labelRenders, this),
                multiLevelLabelClick: (!ej.isNullOrUndefined(this._pivotClientObj) ? (!this._pivotClientObj.model.enableDeferUpdate ? ej.proxy(this._multiLevelLabelClick, this) : null) : ej.proxy(this._multiLevelLabelClick, this)),
                pointRegionClick: !ej.isNullOrUndefined(this._pivotClientObj) ? (!this._pivotClientObj.model.enableDeferUpdate ? ej.proxy(this._seriesClick, this) : null) : ej.proxy(this._seriesClick, this)
            });
            if (this.model.enableRTL && jsonData != null) {
                var toolTipInfo = ej.buildTag("div#toolTipTemplate.e-toolTip",
                   ej.buildTag("div.toolTipInfo",
                    ej.buildTag("div", jsonData.measureNames + " : " + (this._getLocalizedLabels("Measure")) + " <br/>")[0].outerHTML +
                    ej.buildTag("div", "#series.name#: " + (this._getLocalizedLabels("Row")) + " <br/>")[0].outerHTML +
                    ej.buildTag("div", "#point.x# : " + (this._getLocalizedLabels("Column")) + " <br/>")[0].outerHTML +
                    ej.buildTag("div", "#point.y# : " + (this._getLocalizedLabels("Value")))[0].outerHTML//,
                    ).addClass("e-rtl")[0].outerHTML, {
                        "display": "none", "width": "auto", "min-width": "200px",
                        "font-size": "12px", "padding": "2px 5px",
                        "background-color": "rgb(255, 255, 255)",
                        "border": "1px solid rgb(0, 0, 0)"
                    }
                 )[0].outerHTML
                $("#" + this._id).append(toolTipInfo);
            }
            $("#" + this._id + "progressContainer").hide();
            if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {
                if (jsonData != null && jsonData != "") {
                    this._labelCurrentTags.splice(0, this._labelCurrentTags.length);
                    var pivotChartObj = this;
                    jQuery.each(jsonData.labelTags, function (index, value) {
                        var currentTag = new Object();
                        var splitData = value.split("::");
                        currentTag = { "name": splitData[2], "state": splitData[splitData.length - 1], "tag": value };
                        pivotChartObj._labelCurrentTags.push(currentTag);
                    });
                    if (!ej.isNullOrUndefined(pivotChartObj._selectedTagInfo)) {
                    jQuery.each(this._labelCurrentTags, function (index, value) {
                            if (value.tag.split("::")[0] == pivotChartObj._selectedTagInfo.split("::")[0] && pivotChartObj._drillAction == "drillup") {
                            pivotChartObj._selectedTagInfo = pivotChartObj._labelCurrentTags[index].tag;
                            return false;
                        }
                    });
                }
            }
            }
            var pivotClientObj = ($(this.element).parents(".e-pivotclient").length > 0) ? $(this.element).parents(".e-pivotclient").data("ejPivotClient") : null;
            if (!ej.isNullOrUndefined(pivotClientObj)) pivotClientObj._isTimeOut = false;
            if (this._waitingPopup != null)
                this._waitingPopup.hide();
            if ($(this.element).parents(".e-pivotclient").length > 0 && this._pivotClientObj.model.enableToolBar && !this._pivotClientObj.model.displaySettings.enableFullScreen) {
                if (this.model.commonSeriesOptions.tooltip.visible)
                    this.element.find(".e-toolTipImg").addClass("e-enabled");
            }
            if (!ej.isNullOrUndefined(this._pivotClientObj) && !ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj.model.isResponsive)
                $("#" + this._id + "Container").width('100%');           
        },

        _onChartLoad: function (args) {
            var labels = ej.isNullOrUndefined(args.model.primaryXAxis.multiLevelLabels) ? [] : args.model.primaryXAxis.multiLevelLabels;
            for (var i = 0; i < labels.length; i++) {
                if (labels[i].span) {
                    labels[i].border = { type: "withouttopborder" };
                    for (var j = 0; j < labels[i].level; j++) {
                        labels.push({ start: labels[i].start, end: labels[i].end, visible: true, text: " ", tag: labels[i].tag, level: j, border: { type: "withouttopandbottomborder" } })
                    }
                }
            }            
            return this.model.load;
        },

        _onChartLoaded:function(args) {
            this.element.find("#" + this._id + "Container_svg_XAxisMultiLevelLabels_0").attr("cursor", "pointer");            
        },

        _setDrillParams: function (drilledMember, memberInfo) {
            var selectedSeries = this.getJSONRecords().chartLables[memberInfo.start + 0.5].split('~~');
            var drillParams = "";
            for (var i = 0; i < selectedSeries.length; i++) {
                drillParams += drillParams == "" ? selectedSeries[i] : ">#>" + selectedSeries[i];
                if (drilledMember == selectedSeries[i])
                    break;
            }
            var drillInfo = drillParams;
            if (this._drillAction == "drilldown")
                this._drillParams.push(drillParams);
            else
                this._drillParams = $.map(this._drillParams, function (value, index) { if (value.indexOf(drillParams) == -1) return value; });
            if ($(this.element).parents(".e-pivotclient").length > 0) {
                var pivotClientObj = $(this.element).parents(".e-pivotclient").data("ejPivotClient");
                pivotClientObj._drillParams = this._drillParams;
            }
            return drillInfo;
        },

        _getChartDrillDown: function (memberInfo, drilledMember, evt) {
            var isMondrian = this.model.dataSource.providerName == ej.olap.Providers.Mondrian;
            if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap) {
                if (this._drillAction == "drillup") {
                    var selectedItem = $.map(this.model.dataSource.rows, function (itm, idx) { if (itm.fieldName == drilledMember.hierarchyUniqueName) return { index: idx, item: itm } });
                    if (selectedItem.length > 0 && !ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers) && !ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers[selectedItem[0].index])) {
                        var availCnt = 0;
                        $.each(this._labelCurrentTags.expandedMembers[selectedItem[0].index], function (index, item) { if (memberInfo == item) availCnt++; });
                        if (availCnt == 0) this._labelCurrentTags.expandedMembers[selectedItem[0].index].push(memberInfo.split("&").join("&amp;"));
                    }                    
                }
                var tempArray = new Array();
                for (var i = 0; i < this.model.dataSource.rows.length; i++) {
                    if (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers)) {
                        for (var j = 0; j < this._labelCurrentTags.expandedMembers.length; j++) {
                            if (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers[j])) {
                                for (var k = 0; k < this._labelCurrentTags.expandedMembers[j].length; k++) {
                                    if (this._labelCurrentTags.expandedMembers[j][k].indexOf(this.model.dataSource.rows[i].fieldName) >= 0 && tempArray.indexOf(this._labelCurrentTags.expandedMembers[j][k].replace("&amp;", "&")) < 0 && tempArray.indexOf(this._labelCurrentTags.expandedMembers[j][k]) < 0) {
                                        tempArray.push(this._labelCurrentTags.expandedMembers[j][k]);
                                    }
                                }
                            }
                        }
                    }
                    for (var j = 0; j < this._selectedSeriesInfo.length; j++) {
                        if (this._selectedSeriesInfo[j].indexOf(this.model.dataSource.rows[i].fieldName) >= 0 && tempArray.indexOf(this._selectedSeriesInfo[j]) < 0 && tempArray.indexOf(this._selectedSeriesInfo[j].replace(/&/g, "&amp;")) < 0)
                            tempArray.push(this._selectedSeriesInfo[j].replace(/&/g, "&amp;"));
                    }
                }
                for (var i = 0; i < this._selectedSeriesInfo.length; i++)
                    this._selectedSeriesInfo[i] = this._selectedSeriesInfo[i].replace(/&/g, "&amp;");
                var uniqueNameArray = tempArray;
                if (this._drillAction == "drillup") {
                    for (var i = 0; i < this._labelCurrentTags.expandedMembers.length; i++) {
                        if (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers[i])) {
                            for (var j = 0; j < this._labelCurrentTags.expandedMembers[i].length; j++) {
                                if (this.model.enableMultiLevelLabels && memberInfo != "") {
                                    if (this._labelCurrentTags.expandedMembers[i][j] == memberInfo) {
                                        var tempArray = new Array();
                                        jQuery.map(this._labelCurrentTags.expandedMembers[i], function (member) {
                                            if (member == memberInfo) flag = true;
                                            if (!flag) tempArray.push(member);
                                        });
                                        this._labelCurrentTags.expandedMembers[i] = tempArray;
                                    }
                                }
                                else {
                                    if (this._labelCurrentTags.expandedMembers[i][j].split('::')[2] == drilledMember) {
                                        memberInfo = this._labelCurrentTags.expandedMembers[i][j];
                                        var tempArray = new Array();
                                        jQuery.map(this._labelCurrentTags.expandedMembers[i], function (member) {
                                            if (member.split('::')[2] == drilledMember) flag = true;
                                            if (!flag) tempArray.push(member);
                                        });
                                        this._labelCurrentTags.expandedMembers[i] = tempArray;
                                    }
                                }
                            }
                        }
                    }
                    drilledMember = ej.olap._mdxParser._splitCellInfo(memberInfo);
                }
                else
                    memberInfo = memberInfo.indexOf("&amp") == -1 ? memberInfo.replace(/&/g, "&amp;") : memberInfo;
                var dimensionIndex = -1;
                for (var i = 0; i < this.model.dataSource.rows.length; i++) {
                    if (this.model.dataSource.rows[i].fieldName == drilledMember.hierarchyUniqueName) {
                        dimensionIndex = i;
                        break;
                    }
                }
                if (isMondrian && this._drillAction == "drillup" && !ej.isNullOrUndefined(this._selectedSeriesInfo[dimensionIndex]))
                    this._selectedSeriesInfo[dimensionIndex] = memberInfo;
                var index = $.inArray(memberInfo, this._selectedSeriesInfo);
                var tempArray = new Array();
                for (var i = 0; i <= index; i++)
                    tempArray.push(this._selectedSeriesInfo[i]);
                var selectedSeriesInfo = tempArray;
                var index = $.inArray(memberInfo, uniqueNameArray);
                var tempArray = new Array();
                for (var i = 0; i <= index; i++)
                    tempArray.push(uniqueNameArray[i]);
                uniqueNameArray = tempArray;
                var currentObj = $(this.element).parents(".e-pivotclient").length > 0 ? this.element.parents(".e-pivotclient").data("ejPivotClient") : (ej.isNullOrUndefined(this._pivotClientObj) ? this : this._pivotClientObj);
                if (this._drillAction == "drilldown") {
                    if (ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers)) this._labelCurrentTags["expandedMembers"] = new Array();
                    if (ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers[dimensionIndex])) this._labelCurrentTags.expandedMembers[dimensionIndex] = new Array();
                    this._labelCurrentTags.expandedMembers[dimensionIndex].push(memberInfo);
                    if (this.element.parents(".e-pivotclient").length > 0) {
                        currentObj = this.element.parents(".e-pivotclient").data("ejPivotClient");
                        currentObj._drillParams.push($.map(uniqueNameArray, function (item) { return item.split("&amp;").join("&") }).join(">#>"));
                    }
                }
                else {
                    if (this.element.parents(".e-pivotclient").length > 0) {
                        currentObj = this.element.parents(".e-pivotclient").data("ejPivotClient");
                        var parentArray = [], parent = "", expandedMembers = [];
                        $.each(uniqueNameArray, function (index, item) {
                            if (parent == "" || parent.split("::")[0] != item.split("::")[3])
                                parentArray.push(item);
                            parent = item;
                        });
                        $.each(parentArray, function (index, item) {
                            if (index < dimensionIndex && item.length > 0)
                                expandedMembers.push(item.split("&amp;").join("&"));
                        });
                        currentObj._drillParams = $.grep(currentObj._drillParams, function (item) { return dimensionIndex < 1 ? item.indexOf(memberInfo.split("&amp;").join("&")) == -1 : !(item.indexOf(memberInfo.split("&amp;").join("&")) > -1 && $.map(item.split(">#>"), function (itm) { if (expandedMembers.indexOf(itm) > -1) return itm }).length == expandedMembers.length); });
                        var flag = false;
                        for (var i = 0; i < this._labelCurrentTags.expandedMembers.length; i++) {
                            if (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers[i]) && this._labelCurrentTags.expandedMembers[i].length > 0) { flag = true; break; }
                        }
                        if (currentObj._drillParams.length > 0 && this._drilledCellSet.length > 0 && !flag && !ej.isNullOrUndefined(currentObj._drillParams[currentObj._drillParams.length - 1])) {
                            var index = 0, prevMember = "", member = "", lock = false;
                            for (var i = 0; i < currentObj._drillParams[currentObj._drillParams.length - 1].split(">#>").length; i++) {
                                member = currentObj._drillParams[currentObj._drillParams.length - 1].split(">#>")[i];
                                if (member.indexOf("undefined") == -1) {                                    
                                    index = prevMember == "" ? 0 : (member.split("::")[0].split('.')[0] + '.' + member.split("::")[0].split('.')[1] == prevMember.split("::")[0].split('.')[0] + '.' + prevMember.split("::")[0].split('.')[1]) ? index : index + 1;
                                    $.each(this._drilledCellSet, function (index, item) {
                                        if ($.map(item[0].key.split("][").join("]>#>[").split(">#>"), function (itm) { if (expandedMembers.indexOf(itm) > -1) return itm }).length != expandedMembers.length || expandedMembers.length == 0) {
                                            $.each(item[0].key.split("][").join("]>#>[").split(">#>"), function (idx, itm) {
                                                if ((member.split("::")[0] + " !#rowheader") == itm) {
                                                    lock = true;
                                                }
                                            });
                                        }
                                    });
                                    if (lock) {
                                        member = member.split("&").join("&amp;");
                                        if (ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers[index]))
                                            this._labelCurrentTags.expandedMembers[index] = member;
                                        else
                                            this._labelCurrentTags.expandedMembers[index].push(member);
                                        lock = false;
                                    }
                                    prevMember = member;
                                }
                            }                           
                        }
                    }
                }
                if (this._drillAction == "drilldown")
                    ej.olap._mdxParser.updateDrilledReport({ uniqueName: memberInfo, seriesInfo: selectedSeriesInfo, uniqueNameArray: uniqueNameArray }, "rowheader", currentObj);
                else
                    ej.olap._mdxParser.updateDrilledReport({ uniqueName: memberInfo, seriesInfo: selectedSeriesInfo, uniqueNameArray: uniqueNameArray, action: "collapse" }, "rowheader", currentObj);
            }
            else
            {
                var drillInfo = "";
                if (this._drillAction == "" && this.model.enableMultiLevelLabels) {
                    this._waitingPopup.hide();
                    return false;
                }
                else if (this._drillAction == "drilldown") {
                    if (this.model.enableMultiLevelLabels) {
                        drillInfo = this._setDrillParams(drilledMember, memberInfo);
                        if (this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {
                            this._selectedItem = drilledMember;
                            this._generateData({ "JsonRecords": this._pivotEngine, "PivotReport": this.getOlapReport() });
                        }
                        else
                            this._generateData(this._pivotEngine);
                    }
                    else {
                        if (ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers)) this._labelCurrentTags["expandedMembers"] = new Array();
                        this._labelCurrentTags.expandedMembers.push(drilledMember);
                        var clonedEngine = this._cloneEngine(this._pivotEngine);
                        for (var i = 0; i < this._labelCurrentTags.expandedMembers.length; i++)
                            this._cropData(clonedEngine, this._labelCurrentTags.expandedMembers[i], 0, true);
                        this._generateData(clonedEngine);
                    }
                    if (!ej.isNullOrUndefined(this._pivotClientObj))
                        this._pivotClientObj._trigger("chartDrillSuccess", { chartObj: this, drillAction: "drilldown", drilledMember: this.model.enableMultiLevelLabels ? drillInfo : this._labelCurrentTags.expandedMembers.join(">#>"), event: evt });
                    this._trigger("drillSuccess", { chartObj: this, drillAction: "drilldown", drilledMember: this.model.enableMultiLevelLabels ? drillInfo : this._labelCurrentTags.expandedMembers.join(">#>"), event: evt });
                }
                else {
                    if (this.model.enableMultiLevelLabels) {
                        drillInfo = this._setDrillParams(drilledMember, memberInfo);
                        if (this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {
                            this._selectedItem = drilledMember;
                            this._generateData({ "JsonRecords": this._pivotEngine, "PivotReport": this.getOlapReport() });
                        }
                        else
                            this._generateData(this._pivotEngine);
                    }
                    else {
                        var flag = false, tempArray = new Array();
                        jQuery.map(this._labelCurrentTags.expandedMembers, function (member) {
                            if (member == drilledMember) flag = true;
                            if (!flag) tempArray.push(member);
                        });
                        this._labelCurrentTags.expandedMembers = tempArray;
                        drillInfo = this._labelCurrentTags.expandedMembers.length == 0 ? drilledMember : this._labelCurrentTags.expandedMembers.join(">#>") + ">#>" + drilledMember;
                        var isClientMode=this.model.operationalMode == ej.PivotChart.OperationalMode.ClientMode;
                        if ((this._labelCurrentTags.expandedMembers.length == 0 || isClientMode) && $(this.element).parents(".e-pivotclient").length > 0) {
                            var pivotClientObj = $(this.element).parents(".e-pivotclient").data("ejPivotClient");
                            if (pivotClientObj._drillParams.length > 0) {
                                pivotClientObj._drillParams = $.grep(pivotClientObj._drillParams, function (item) { return item.indexOf(isClientMode ? drillInfo : drilledMember) < 0; });
                                pivotClientObj._getDrilledMember();
                            }
                        }
                        var clonedEngine = this._cloneEngine(this._pivotEngine);
                        for (var i = 0; i < this._labelCurrentTags.expandedMembers.length; i++)
                            this._cropData(clonedEngine, this._labelCurrentTags.expandedMembers[i], 0, true);
                        this._generateData(clonedEngine);
                    }
                    if (!ej.isNullOrUndefined(this._pivotClientObj))
                        this._pivotClientObj._trigger("chartDrillSuccess", { chartObj: this, drillAction: "drillup", drilledMember: drillInfo, event: evt });
                    this._trigger("drillSuccess", { chartObj: this, drillAction: "drillup", drilledMember: drillInfo, event: evt });
                }
            }
        },

        _multiLevelLabelClick: function (args) {
            if ($(this.element).parents(".e-pivotclient").length > 0)
                $(this.element).parents(".e-pivotclient").data("ejWaitingPopup").show();
            else if (!ej.isNullOrUndefined(this._waitingPopup))
                this._waitingPopup.show();
            if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap) {
                if (this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {
                    var expandableState = parseInt(args.data.multiLevelLabel.tag.split("::")[args.data.multiLevelLabel.tag.split("::").length - 1]);
                    if (args.data.multiLevelLabel.tag.startsWith("[Measures]") || expandableState == 0) {
                        if ($(this.element).parents(".e-pivotclient").length > 0)
                            $(this.element).parents(".e-pivotclient").data("ejWaitingPopup").hide();
                        else if (!ej.isNullOrUndefined(this._waitingPopup))
                            this._waitingPopup.hide();
                        return false;
                    }
                    this._selectedTagInfo = args.data.multiLevelLabel.tag;
                    this._drillAction = expandableState == 2 ? "drilldown" : "drillup";
                    this._startDrilldown = true;
                    var serializedCustomObject = JSON.stringify(this.model.customObject);
                    var report = this.getOlapReport();
                    if (this.model.beforeServiceInvoke != null)
                        this._trigger("beforeServiceInvoke", { action: this._drillAction, element: this.element, customObject: this.model.customObject });
                    if (this.model.customObject != "" && this.model.customObject != null && this.model.customObject != undefined) {
                        if (!ej.isNullOrUndefined(this._pivotClientObj))
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": this._drillAction + "#fullchart", "drilledSeries": this._selectedTagInfo, "olapReport": report, "clientReports": this._pivotClientObj.reports, "customObject": serializedCustomObject }), this.renderControlSuccess);
                        else
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": this._drillAction + "#fullchart", "drilledSeries": this._selectedTagInfo, "olapReport": report, "customObject": serializedCustomObject }), this.renderControlSuccess);
                    }
                    else {
                        if (!ej.isNullOrUndefined(this._pivotClientObj))
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": this._drillAction + "#fullchart", "drilledSeries": this._selectedTagInfo, "olapReport": report }), this.renderControlSuccess);
                        else
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": this._drillAction + "#fullchart", "drilledSeries": this._selectedTagInfo, "olapReport": report, "clientReports": this._pivotClientObj.reports }), this.renderControlSuccess);
                    }
                }
                else {
                    if (args.data.multiLevelLabel.tag.endsWith("0")) {
                        if (!ej.isNullOrUndefined(this._waitingPopup))
                            this._waitingPopup.hide();
                        return false;
                    }
                    var memberInfo = args.data.multiLevelLabel.tag.split("::").splice(0, args.data.multiLevelLabel.tag.split("::").length - 1).join("::");
                    var drilledMember = ej.olap._mdxParser._splitCellInfo(memberInfo);
                    var selectedTag = this.getJSONRecords().labelTags[args.data.multiLevelLabel.start + 0.5].split("~~");
                    this._selectedSeriesInfo = [];
                    for (var i = 0; i < selectedTag.length; i++) {
                        this._selectedSeriesInfo.push(selectedTag[i].split("#")[selectedTag[i].split("#").length - 1]);
                    }
                    this._labelCurrentTags.collapsedMembers = $.grep(this._labelCurrentTags.collapsedMembers, function (item) { return item != args.data.multiLevelLabel.text.slice(2, args.data.multiLevelLabel.text.length); });
                    this._drillAction = args.data.multiLevelLabel.tag.split("::")[args.data.multiLevelLabel.tag.split("::").length - 1] == "2" ? "drilldown" : (args.data.multiLevelLabel.tag.split("::")[args.data.multiLevelLabel.tag.split("::").length - 1] == "1" ? "drillup" : "");
                    if (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers)) {
                        for (var j = 0; j < this._labelCurrentTags.expandedMembers.length; j++) {
                            if (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers[j])) {
                                for (var k = 0; k < this._labelCurrentTags.expandedMembers[j].length; k++) {
                                    if (this._labelCurrentTags.expandedMembers[j][k].indexOf(memberInfo.replace(/&/g, "&amp;")) >= 0 || this._labelCurrentTags.expandedMembers[j][k].indexOf(memberInfo) >= 0) {
                                        memberInfo = memberInfo.replace(/&/g, "&amp;");
                                        break;
                                    }
                                }
                            }
                        }
                    }                    
                    this._getChartDrillDown(memberInfo, drilledMember, args);
                }
            }
            else {
                var drilledMember = args.data.multiLevelLabel.tag.split("#")[0];
                this._drillAction = args.data.multiLevelLabel.tag.endsWith("1") ? "drilldown" : (args.data.multiLevelLabel.tag.endsWith("2") ? "drillup" : "");
                this._getChartDrillDown(args.data.multiLevelLabel, drilledMember, args);
            }
        },

        _labelRenders: function (args) {
            if (!ej.isNullOrUndefined(this.model) && this.model.enableMultiLevelLabels && ((this.seriesType() == "bar" || this.seriesType() == "stackingbar") ? (args.data.axis.orientation.toLowerCase() == "vertical") : (args.data.axis.orientation.toLowerCase() == "horizontal"))) {
                args.data.label.Text = "";
            }
            else {
                if (!ej.isNullOrUndefined(this._pivotClientObj) ? !this._pivotClientObj._isExporting : true) {
                    if (!ej.isNullOrUndefined(this._pivotClientObj))
                        this._pivotClientObj._trigger("axesLabelRendering", args);
                    else
                        this._trigger("axesLabelRendering", args);
                    if (((args.data.axis.orientation.toLowerCase() == "horizontal" && args.data.label.Text != undefined) || ((this.seriesType() == "bar" || this.seriesType() == "stackingbar") && args.data.axis.orientation.toLowerCase() == "vertical" && args.data.label.Text != undefined)) && this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap) {
                        var splitName = this.model.enableRTL ? args.data.label.Text.toString().split("~~").reverse() : args.data.label.Text.toString().split("~~");
                        var pivotChartObj = this;
                        if (!ej.isNullOrUndefined(pivotChartObj.getJSONRecords())) {
                            $.each($.extend([], pivotChartObj.getJSONRecords().chartLables, true), function (index, val) {
                                if (val.toString().split('#').join("~~") == splitName.join("~~")) {
                                    args.data.label.Text = val.toString().split("~~").map(function (itm) {
                                        return itm.split("#")[itm.split("#").length - 1]
                                    }).join("~~");
                                    return false;
                                }
                            });
                        }
                    }
                }
            }
        },

        _reSizeHandler: function (args) {
            if (!ej.isNullOrUndefined(this.element)) {
                var chart_resize = this.element.find("#" + this._id + "Container").height(this.element.height()).width(this.element.width()).data("ejChart");
                if (!ej.isNullOrUndefined(chart_resize)) {
                    chart_resize.redraw();
                }
            }
        },

        _getLocalizedLabels: function (property) {
            return (ej.isNullOrUndefined(ej.PivotChart.Locale[this.locale()]) || ej.PivotChart.Locale[this.locale()][property] == undefined) ? ej.PivotChart.Locale["en-US"][property] : ej.PivotChart.Locale[this.locale()][property];
        },

        _onPreventPanelClose: function (e) {
            $('body').find("#preventDiv").remove();
            if ($(".e-pivotgrid").data("ejWaitingPopup") && !(!ej.isNullOrUndefined(e) && ($(e.target).hasClass("pivotTree") || $(e.target).hasClass("pivotTreeContext") || $(e.target).hasClass("pivotTreeContextMenu"))))
                $(".e-pivotgrid").data("ejWaitingPopup").hide()
        },

        _seriesClick: function (sender) {
            if (!this.model.enableMultiLevelLabels) {
                this.element.find("#" + this._id + "ExpandMenu, .e-expandMenu, .e-dialog").remove();
                var selectedLabel, menuList = new Array(), chartOffset = this.element.position(), me = this;
                var pivotChartObj = this;
                if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {
                    var tempLabel; var pointIndex;
                    this._selectedTags = [];
                    if (sender.data.region != null && sender.data.region != undefined) {
                        var labels = this.model.enableRTL ? $.map(sender.model.primaryXAxis.labels, function (x) { return x.split("~~").reverse().join("~~"); }) : sender.model.primaryXAxis.labels;
                        selectedLabel = labels[sender.data.region.Region.PointIndex];
                        pointIndex = sender.data.region.Region.PointIndex;
                    }
                    else if (sender.data.point.x != null && sender.data.point.x != undefined && sender.data.point.x != "") {
                        var labels = this.model.enableRTL ? $.map(sender.data.series.xAxis.labels, function (x) { return x.split("~~").reverse().join("~~"); }) : sender.data.series.xAxis.labels;
                        selectedLabel = labels[sender.data.point.X];
                        pointIndex = sender.data.point.X;
                    }
                    if (!this.model.enableMultiLevelLabels) {
                        if ($($("#" + this._id + "Container_vml_XAxisLabels_0")[0]).children()[pointIndex] != undefined)
                            tempLabel = $($("#" + this._id + "Container_vml_XAxisLabels_0")[0]).children()[pointIndex].innerHTML;
                        else if ($("#" + this._id + "Container_svg_XAxisLabels_0").children()[pointIndex])
                            tempLabel = $("#" + this._id + "Container_svg_XAxisLabels_0").children()[pointIndex].textContent;
                        else if (this.seriesType() == "bar" || this.seriesType() == "stackingbar") {
                            if ($($("#" + this._id + "Container_vml_YAxisLabels_0")[0]).children()[pointIndex] != undefined)
                                tempLabel = $($("#" + this._id + "Container_vml_YAxisLabels_0")[0]).children()[pointIndex].innerHTML;
                            else if ($("#" + this._id + "Container_svg_YAxisLabels_0").children()[pointIndex])
                                tempLabel = $("#" + this._id + "Container_svg_YAxisLabels_0").children()[pointIndex].textContent;
                            else {
                                var temp = sender.model.primaryXAxis.labels[pointIndex].split("~~");
                                tempLabel = temp[temp.length - 1];
                            }
                        }
                        else {
                            var temp = sender.model.primaryXAxis.labels[pointIndex].split("~~");
                            tempLabel = temp[temp.length - 1];
                        }
                    }
                    else {
                        tempLabel = sender.model.primaryXAxis.labels[pointIndex].split("~~")[sender.model.primaryXAxis.labels[pointIndex].split("~~").length - 1];
                    }
                    if (tempLabel) {
                        $("#" + this._id).find("#" + this._id + "ExpandMenu, .e-expandMenu, .e-dialog").remove();
                        var splitLabel = selectedLabel.split("~~");

                        jQuery.each(splitLabel, function (index, value) {
                            jQuery.each(pivotChartObj._labelCurrentTags, function (key, val) {
                                if ($.trim(value) == val.name) {
                                    pivotChartObj._selectedTags.push(val);
                                    return false;
                                }
                            });
                        });

                        jQuery.each(this._selectedTags, function (index, value) {
                            if (value.state > 1)
                                if (me.model.enableRTL)
                                    menuList.push($(ej.buildTag("li.e-menuList exp", value.name + " - " + (pivotChartObj._getLocalizedLabels("Expand")))[0]).attr("role", "presentation")[0].outerHTML);
                                else
                                    menuList.push($(ej.buildTag("li.e-menuList exp", (pivotChartObj._getLocalizedLabels("Expand")) + " - " + value.name)[0]).attr("role", "presentation")[0].outerHTML);
                        });
                        jQuery.each(this._selectedTags, function (index, value) {
                            for (var label = 0; label < selectedLabel.split("~~").length - 1; label++) {
                                if ((selectedLabel.split("~~")[label] == value.name) && value.state == 1)
                                    if (me.model.enableRTL)
                                        menuList.push($(ej.buildTag("li.e-menuList clp", value.name + " - " + (pivotChartObj._getLocalizedLabels("Collapse")))[0]).attr("role", "presentation")[0].outerHTML);
                                    else
                                        menuList.push($(ej.buildTag("li.e-menuList clp", (pivotChartObj._getLocalizedLabels("Collapse")) + " - " + selectedLabel.split("~~")[label])[0]).attr("role", "presentation")[0].outerHTML);
                            }
                        });
                    }
                }
                else {
                    selectedLabel = (sender.data.region != null && sender.data.region != undefined) ? this.getJSONRecords().chartLables[sender.data.region.Region.PointIndex] : sender.data.series.xAxis.labels[sender.data.point.X];
                    if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap)
                        selectedLabel = selectedLabel.split("~~").map(function (itm) { return itm.split("#")[itm.split("#").length - 1] }).join("~~");
                    if (!ej.isNullOrUndefined(this._labelCurrentTags.collapsedMembers)) {
                        if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap) {
                            var memberNames = selectedLabel.split("~~");
                            if (this.model.dataSource.values[0].axis == ej.olap.AxisName.Row) {
                                var measureNames = $.map(this.model.dataSource.values[0].measures, function (item) { return item.fieldName });
                                if ($.inArray(memberNames[memberNames.length - 1], measureNames) >= 0)
                                    memberNames.splice(memberNames.length - 1, 1);
                            }
                            this._selectedSeriesInfo = new Array();
                            for (var i = 0; i < memberNames.length; i++) {
                                var memberName = memberNames[i].split('#')[memberNames[i].split('#').length - 1];
                                if ($(this.getJSONRecords().seriesTags).filter(function (index, item) { return item.split('::')[2] == memberName }).length > 0) this._selectedSeriesInfo.push($(this.getJSONRecords().seriesTags).filter(function (index, item) { return item.split('::')[2] == memberName })[0]);
                                if ($.inArray(memberName, this._labelCurrentTags.collapsedMembers) >= 0) {
                                    if (me.model.enableRTL)
                                        menuList.push($(ej.buildTag("li.e-menuList exp", memberName + " - " + (this._getLocalizedLabels("Expand")))[0]).attr("role", "presentation")[0].outerHTML);
                                    else
                                        menuList.push($(ej.buildTag("li.e-menuList exp", (this._getLocalizedLabels("Expand")) + " - " + memberName)[0]).attr("role", "presentation")[0].outerHTML);
                                }
                            }
                        }
                        else {
                            if ($.inArray(selectedLabel, this._labelCurrentTags.collapsedMembers) >= 0)
                                if (me.model.enableRTL)
                                    menuList.push($(ej.buildTag("li.e-menuList exp", selectedLabel + " - " + (this._getLocalizedLabels("Expand")))[0]).attr("role", "presentation")[0].outerHTML);
                                else
                                    menuList.push($(ej.buildTag("li.e-menuList exp", (this._getLocalizedLabels("Expand")) + " - " + selectedLabel)[0]).attr("role", "presentation")[0].outerHTML);
                        }
                    }
                    if (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers)) {
                        if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap) {
                            for (var j = 0; j < this._labelCurrentTags.expandedMembers.length; j++) {
                                if (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers[j])) {
                                    for (var i = 0; i < this._labelCurrentTags.expandedMembers[j].length; i++) {
                                        if (me.model.enableRTL)
                                            menuList.push($(ej.buildTag("li.e-menuList clp", this._labelCurrentTags.expandedMembers[j][i].split('::')[2] + " - " + (this._getLocalizedLabels("Collapse")))[0]).attr("role", "presentation")[0].outerHTML);
                                        else
                                            menuList.push($(ej.buildTag("li.e-menuList clp", (this._getLocalizedLabels("Collapse")) + " - " + this._labelCurrentTags.expandedMembers[j][i].split('::')[2])[0]).attr("role", "presentation")[0].outerHTML);
                                    }
                                }
                            }
                        }
                        else {
                            for (var i = 0; i < this._labelCurrentTags.expandedMembers.length; i++) {
                                if (me.model.enableRTL)
                                    menuList.push($(ej.buildTag("li.e-menuList clp", this._labelCurrentTags.expandedMembers[i] + " - " + (this._getLocalizedLabels("Collapse")))[0]).attr("role", "presentation")[0].outerHTML);
                                else
                                    menuList.push($(ej.buildTag("li.e-menuList clp", (this._getLocalizedLabels("Collapse")) + " - " + this._labelCurrentTags.expandedMembers[i])[0]).attr("role", "presentation")[0].outerHTML);
                            }
                        }
                    }
                }
                if (menuList.length > 0) {
                    menuList.push($(ej.buildTag("li.e-menuList exit", this._getLocalizedLabels("Exit"))[0]).attr("role", "presentation")[0].outerHTML);
                    var expandMenu = $(ej.buildTag("div#" + this._id + "ExpandMenu.e-expandMenu", menuList)[0]).attr("role", "presentation")[0].outerHTML;
                    $(expandMenu).ejDialog({ width: "auto", target: "#" + this._id, enableResize: false, enableRTL: this.model.enableRTL });
                    $("#" + this._id + "ExpandMenu_wrapper").appendTo(this.element).css({ "left": sender.data.location.x + 8 + chartOffset.left, "top": sender.data.location.y + 8 + chartOffset.top, "min-height": navigator.userAgent.toLowerCase().indexOf('webkit') > 0 ? "initial" : "auto" });
                    $("#" + this._id + "ExpandMenu").css({ "min-height": navigator.userAgent.toLowerCase().indexOf('webkit') > 0 ? "initial" : "auto" });
                }
                this.element.find(".e-titlebar, .e-header").remove();
            }
            if (!ej.isNullOrUndefined(this._pivotClientObj))
                this._pivotClientObj._trigger("pointRegionClick", sender);
            else
                this._trigger("pointRegionClick", sender);
        },

        _getExportModel: function (modelClone) {
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version <= 8) return;
            var chartObj = $("#" + this._id + "Container").data("ejChart");
            var zoomFactor = chartObj.model.primaryXAxis.zoomFactor;
            chartObj.model.primaryXAxis.zoomFactor = 1;
            chartObj.model.enableCanvasRendering = true;
            chartObj.redraw();
            var canvasElement = chartObj["export"]();
            var chartString = canvasElement.toDataURL("image/png");
            chartObj.model.primaryXAxis.zoomFactor = zoomFactor;
            chartObj.model.enableCanvasRendering = false;
            chartObj.redraw();
            var bgColor = $(this.element).css('background-color') != "" ? $(this.element).css('background-color') : "rgb(255, 255, 255)";
            var chartExportInfo = { args: JSON.stringify({ "fileName": "Export", "chartdata": (chartString.split(',')[1]), "bgColor": (bgColor), "exportFormat": "xls", "title": "", "description": "PivotChart" }) };
            var params = chartExportInfo;
            return params;
        },
        exportPivotChart: function (exportOption, fileName, exportFormat) {
            var exportSetting = {}, chartExpObj = {}, exportSize = null;
            if (!ej.isNullOrUndefined(exportFormat) && exportFormat.toLowerCase() == "excel")
                exportSetting = { url: "", fileName: "PivotChart", exportMode: ej.PivotChart.ExportMode.ClientMode, title: "", description: "", exportType: exportOption, controlName: this, exportChartAsImage: true };
            else
                exportSetting = { url: "", fileName: "PivotChart", exportMode: ej.PivotChart.ExportMode.ClientMode, title: "", description: "", exportType: exportOption, controlName: this };
            this._trigger("beforeExport", exportSetting);

            if (ej.browserInfo().name == "msie" && ej.browserInfo().version <= 8) return;
            if (ej.isNullOrUndefined(fileName) || fileName == "") fileName = "Sample";
            var chartObj = $("#" + this._id + "Container").data("ejChart");
            var chartSize = { height: chartObj.model.size.height, width: chartObj.model.size.width };
            var zoomFactor = chartObj.model.primaryXAxis.zoomFactor;
            chartObj.model.primaryXAxis.zoomFactor = 1;
            chartObj.model.enableCanvasRendering = true;
            chartObj.model.size = exportSize = { height: (!ej.isNullOrUndefined(exportSetting.height) ? exportSetting.height : chartObj.model.size.height), width: (!ej.isNullOrUndefined(exportSetting.width) ? exportSetting.width : chartObj.model.size.width) };
            chartObj.redraw();
            var canvasElement = chartObj["export"]();
            var chartString = canvasElement.toDataURL("image/png");
            chartObj.model.primaryXAxis.zoomFactor = zoomFactor;
            chartObj.model.enableCanvasRendering = false;
            chartObj.model.size = { height: chartSize.height, width: chartSize.width };
            chartObj.redraw();
            var bgColor = $(this.element).css('background-color') != "" ? $(this.element).css('background-color') : "rgb(255, 255, 255)";

            if (!ej.isNullOrUndefined(exportSetting.exportChartAsImage) && !exportSetting.exportChartAsImage) {
                chartObj.model.size = exportSize;
                chartExpObj = this._excelExport(chartObj, chartSize.height, chartSize.width);
                chartExpObj = chartExpObj.replace(new RegExp('<br/>', 'g'), '');
            }
            //if (ej.isNullOrUndefined(exportFormat))
            //    exportFormat = exportOption;
            if (exportSetting.exportMode == ej.PivotChart.ExportMode.ClientMode) {
                var chartExportInfo = {
                    fileName: ej.isNullOrUndefined(fileName) ? (ej.isNullOrUndefined(exportSetting.fileName) ? "PivotChart" : exportSetting.fileName) : fileName,
                    chartdata: chartString.split(',')[1],
                    bgColor: bgColor,
                    exportFormat: exportFormat,
                    title: exportSetting.title,
                    description: exportSetting.description,
                }
                if (!ej.isNullOrUndefined(exportSetting.exportChartAsImage) && !exportSetting.exportChartAsImage)
                    chartExportInfo.chartModel = chartExpObj;
                var params = { args: JSON.stringify(chartExportInfo) };
                if (ej.raiseWebFormsServerEvents && ((exportOption == "excelExport" || exportOption == "pdfExport" || exportOption == "wordExport" || exportOption == "imageExport") && exportSetting.exportMode == ej.PivotChart.ExportMode.ClientMode && $.trim(exportSetting.url) == "")) {
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
                var chartExportInfo = {
                    exportOption: exportOption,
                    chartdata: chartString.split(',')[1],
                    bgColor: bgColor,
                    title: exportSetting.title,
                    description: exportSetting.description,
                };
                if (!ej.isNullOrUndefined(exportSetting.exportChartAsImage) && !exportSetting.exportChartAsImage)
                    chartExportInfo.chartModel = chartExpObj;
                var params = { args: JSON.stringify(chartExportInfo) };
                this.doPostBack($.trim(exportSetting.url) != "" ? exportSetting.url : this.model.url + "/" + this.model.serviceMethodSettings.exportPivotChart, params);
            }
        },

        _excelExport: function (chartObj, height, width) {
            var modelClone = $.extend(true, {}, chartObj.model),
			svgHeight = chartObj.svgHeight, svgWidth = chartObj.svgWidth,
            actualHeight = height, actualWidth = width,
            series, chartobj = chartObj;
            modelClone.event = null;
            modelClone.primaryXAxis.range = modelClone.primaryXAxis.actualRange;
            modelClone.primaryYAxis.range = modelClone.primaryYAxis.actualRange;
            if (chartObj._ignoreOnExport) {
                series = modelClone.series;
                for (var j = 0; j < series.length; j++) {
                    delete series[j].dataSource;
                    delete series[j].query;
                    series[j].fill = jQuery.type(series[j].fill) == "array" ? series[j].fill[0].color : series[j].fill;
                }
            }
            {
                if (modelClone.size.height && modelClone.size.height.indexOf("%") != -1)
                    modelClone.size.height = $(chartObj.svgObject).height().toString();
                if (modelClone.size.width && modelClone.size.width.indexOf("%") != -1)
                    modelClone.size.width = $(chartObj.svgObject).width().toString();
            }
            var chartModel = JSON.stringify(modelClone);
            modelClone.size = { width: actualWidth, height: actualHeight };
            return chartModel;
        },
        doAjaxPost: function (type, url, data, onSuccess, onComplete, customArgs) {
            var contentType, dataType, successEvt, isAsync = true, withCred = (this.model.enableXHRCredentials || (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj.model.enableXHRCredentials));
            if ((data["XMLA"] == undefined))
                contentType = 'application/json; charset=utf-8', dataType = 'json', successEvt = $.proxy(onSuccess, this);
            else
                contentType = 'text/xml', dataType = 'xml', data = data["XMLA"], successEvt = $.proxy(onSuccess, ej.olap.base, customArgs), isAsync = (ej.browserInfo().name == "msie" && ej.browserInfo().version <= 9) ? false : true;
            var post = {
                type: type,
                url: url,
                data: data,
                async: isAsync,
                contentType: contentType,
                dataType: dataType,
                success: successEvt,
                xhrFields: {
                    withCredentials: withCred
                },
                complete: ej.proxy(function () {
                    var eventArgs = { "action": !ej.isNullOrUndefined(customArgs) && !ej.isNullOrUndefined(customArgs.action) ? customArgs.action : JSON.parse(data)["action"], "customObject": this.model.customObject, "element": this.element };
                    this._trigger("renderComplete", eventArgs);
                }, this),
                error: ej.proxy(function (msg, textStatus, errorThrown) {
                    if (typeof this._waitingPopup != 'undefined' && this._waitingPopup != null)
                        this._waitingPopup.hide();
                    if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null)
                        oclientWaitingPopup.hide();
                    var eventArgs = { "action": this._currentAction, "customObject": this.model.customObject, "element": this.element, "Message": msg };
                    this._trigger("renderFailure", eventArgs);
                    this.renderChartFromJSON("");
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

    ej.PivotChart.Locale = ej.PivotChart.Locale || {};

    ej.PivotChart.Locale["en-US"] = {
        Measure: "Measure",
        Row: "Row",
        Column: "Column",
        Value: "Value",
        Expand: "Expand",
        Collapse: "Collapse",
        Exit: "Exit",
        ChartTypes: "Chart Types",
        TDCharts: "3D Charts",
        Tooltip: "Tooltip",
        Exporting: "Exporting",
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
        TreeMap: "TreeMap",
        ColumnTD: "Column 3D",
        PieTD: "Pie 3D",
        BarTD: "Bar 3D",
        StackingBarTD: "StackingBar 3D",
        StackingColumnTD: "StackingColumn 3D",
        Excel: "Excel",
        Word: "Word",
        Pdf: "PDF",
        PNG: "PNG",
        EMF: "EMF",
        GIF: "GIF",
        JPG: "JPG",
        BMP: "BMP",
        ZoomIn: "Zoom In",
        ZoomOut: "Zoom Out",
        Legend: "Legend",
        SmartLabels: "Smart Labels",
        Interactions: "Interactions",
        Zooming: "Zooming",
        Rotate45: "Rotate45",
        Rotate90: "Rotate90",
        Trim: "Trim",
        MultipleRows: "Multiple Rows",
        Wrap: "Wrap",
        Hide: "Hide",
        WrapByWord: "Wrap By word",
        CrossHair: "Cross Hair",
        TrackBall: "Track Ball",
        DisableTD: "Disable 3D Charts",
        None:"None",
        Exception: "Exception",
        OK: "OK"
    };

    ej.PivotChart.ChartTypes = {
        Line: 'line', Spline: 'spline', Column: 'column', Area: 'area', SplineArea: 'splinearea', StepLine: 'stepline', StepArea: 'steparea', Pie: 'pie', Bar: 'bar', StackingArea: 'stackingarea', StackingColumn: 'stackingcolumn', StackingBar: 'stackingbar', Pyramid: 'pyramid', Funnel: 'funnel', Doughnut: 'doughnut', Scatter: 'scatter', Bubble: 'bubble', WaterFall: 'waterfall'
    };

    ej.PivotChart.ExportOptions = {
        Excel: 'excel',
        Word: 'word',
        PDF: 'pdf',
        CSV: 'csv',
        PNG: 'png',
        JPG: 'jpg',
        EMF: 'emf',
        GIF: 'gif',
        BMP: 'bmp'
    };

    ej.PivotChart.SymbolShapes = {
        None: "none",
        LeftArrow: "leftarrow",
        RightArrow: "rightarrow",
        Circle: "circle",
        Cross: "cross",
        HorizLine: "horizline",
        VertLine: "vertline",
        Diamond: "diamond",
        Rectangle: "rectangle",
        Triangle: "triangle",
        InvertedTriangle: "invertedtriangle",
        Hexagon: "hexagon",
        Pentagon: "pentagon",
        Star: "star",
        Ellipse: "ellipse",
        Wedge: "wedge",
        Trapezoid: "trapezoid",
        UpArrow: "uparrow",
        DownArrow: "downarrow",
        Image: "image"
    };

    ej.PivotChart.AnalysisMode = {
        Olap: "olap",
        Pivot: "pivot"
    };

    ej.PivotChart.OperationalMode = {
        ClientMode: "clientmode",
        ServerMode: "servermode"
    };
    ej.PivotChart.ExportMode = {
        ClientMode: "clientmode",
        ServerMode: "servermode"
    };
})(jQuery, Syncfusion);