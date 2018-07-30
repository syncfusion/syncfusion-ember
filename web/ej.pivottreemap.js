/**
* @fileOverview Plugin to style the Html Pivot TreeMap elements
* @copyright Copyright Syncfusion Inc. 2001 - 2013. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {

    ej.widget("ejPivotTreeMap", "ej.PivotTreeMap", {

        _rootCSS: "e-pivottreemap",
        element: null,
        model: null,
        validTags: ["div", "span"],
        defaults: $.extend(ej.datavisualization.TreeMap.prototype.defaults, {
            url: "",
            cssClass: "",
            currentReport: "",
            operationalMode: "clientmode",
            customObject: {},
            isResponsive: false,
            enableXHRCredentials: false,
            dataSource: {
                data: null,
                isFormattedValues: false,
                columns: [],
                cube: "",
                catalog: "",
                rows: [],
                values: [],
                filters: []
            },
            serviceMethodSettings: {
                initialize: "InitializeTreeMap",
                drillDown: "DrillTreeMap",
            },
            locale: "en-US",
            drillSuccess: null,
            beforeServiceInvoke: null,
            afterServiceInvoke: null,
            load: null,
            renderComplete: null,
            renderFailure: null,
            renderSuccess: null,
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
            serviceMethodSettings: {
                initialize: "enum",
                drillDown: "enum",
            },
            customObject: "data"
        },

        locale: ej.util.valueFunction("locale"),

        getOlapReport: function () {
            return this._olapReport;
        },

        setOlapReport: function (value) {
            this._olapReport = value;
        },

        getJsonRecords: function () {
            return this._JSONRecords;
        },

        setJsonRecords: function (value) {
            this._JSONRecords = JSON.parse(value);
        },

        _init: function () {
            this._initPrivateProperties();
            this._load();
        },

        _destroy: function () {
            this.element.empty().removeClass("e-pivottreemap" + this.model.cssClass);
            if (this._waitingPopup != undefined) this._waitingPopup.destroy();
            if (this.element.attr("class") == "") this.element.removeAttr("class");
        },

        _initPrivateProperties: function () {
            this._id = this.element.attr("id");
            this._olapReport = "";
            this._JSONRecords = null;
            this._treeMapDatasource = [];
            this._currentAction = "initialize";
            this._selectedItem = "";
            this._selectedTagInfo = null;
            this._tagCollection = new Array();
            this._drilledMembers = new Array();
            this._startDrilldown = false;
            this._isDrilled = false;
            this._treeMap = null;
            this._pivotClientObj = null;
            this._waitingPopup = null;
            this._drillText = "";
            this._showDrillText = "";
            this._isOnlyMeasureElement = false;
        },

        _load: function () {
            this.element.addClass(this.model.cssClass);
            if ($(this.element).parents(".e-pivotclient").length > 0) {
                this._pivotClientObj = $(this.element).parents(".e-pivotclient").data("ejPivotClient");
                this.model.customObject = this._pivotClientObj.model.customObject;
                if ($("#" + this._pivotClientObj._id + "_maxView")[0])
                    $("#" + this._pivotClientObj._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                else if (!ej.isNullOrUndefined(this._pivotClientObj._waitingPopup))
                    this._pivotClientObj._waitingPopup.show();
            }
            else {
                this.element.ejWaitingPopup({ showOnInit: true });
                this._waitingPopup = this.element.data("ejWaitingPopup");
                this._waitingPopup.show();
            }
            var serializedCustomObject = JSON.stringify(this.model.customObject);
            if (this.model.dataSource.data == null && this.model.url == "" && this.model.dataSource.cube == "") {
                this.renderTreeMapFromJSON(null);
                this._waitingPopup.hide();
                return
            };
            if ((this.model.dataSource.data == null && this.model.url != "") || (this.model.dataSource.data != null && this.model.url != "" && this.model.operationalMode == ej.PivotTreeMap.OperationalMode.ServerMode)) {
                this.model.operationalMode = ej.PivotTreeMap.OperationalMode.ServerMode;
                if (this.model.beforeServiceInvoke != null)
                    this._trigger("beforeServiceInvoke", { action: this._currentAction, element: this.element, customObject: serializedCustomObject});
                if (this.model.customObject != "" && this.model.customObject != null && this.model.customObject != undefined)
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.initialize, JSON.stringify({ "action": "initialize", "currentReport": this.model.currentReport, "customObject": serializedCustomObject }), this.renderControlSuccess);
                else
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.initialize, JSON.stringify({ "action": "initialize" }), this.renderControlSuccess);
            }
            else {
                this.model.operationalMode = ej.PivotTreeMap.OperationalMode.ClientMode;
                if (this.model.dataSource.rows.length > 1)
                    this.model.dataSource.rows = [this.model.dataSource.rows[this.model.dataSource.rows.length - 1]];
                if (this.model.dataSource.cube != "") {
                    this._trigger("beforePivotEnginePopulate", { treeMapObject: this });
                    this._dataTrans(this.model.dataSource);
                    ej.olap.base.getJSONData({ action: "initialLoad" }, this.model.dataSource, this);
                }
            }
        },
		_setFirst: false,
        _setModel: function (options) {
            for (var key in options) {
                switch (key) {
                    case "operationalMode": this.model.operationalMode = options[key]; break;
                    case "analysisMode": this.model.analysisMode = options[key]; break;
                    case "customObject": this.model.customObject = options[key]; break;
                    case "isResponsive": {
                        this.model.isResponsive = options[key];
                        this._load(); break;
                    }
                    case "locale": {
                        this.model.locale = options[key];
                        this._load(); break;
                    }
                }
            }
        },
        generateJSON: function (dataObj, pivotengine) {
           var ptreemapProxy = this;
            var labelTags = [], drillTags = [], measureNames = "", points_Y = [], seriesNames = [], treemapLabels = [], valuePoints = [], jsonData = {};

            for (var i = 0; i < this.model.dataSource.values[0].measures.length; i++) {
                measureNames += measureNames == "" ? this.model.dataSource.values[0].measures[i].fieldCaption : "~" + this.model.dataSource.values[0].measures[i].fieldCaption;
            }
            var axis = this.model.dataSource.values[0].axis;
            var rowCount = this.model.dataSource.rows.length;
            var rowHeaderWidth = pivotengine[0][0].ColSpan;
            var elementCount = 0;
            if (rowHeaderWidth - rowCount <= 0) {
                rowHeaderWidth = 0;
                elementCount = rowCount;
            }
            else {
                if (axis == "rows")
                    elementCount = rowHeaderWidth - 1;
                else
                elementCount = rowHeaderWidth;
                rowHeaderWidth = elementCount - 1;
            }

            ///  for treemapLabels

            var tempArray = new Array();
            for (var i = 0; i < pivotengine.length; i++) {
                for (var j = 0; j < pivotengine[i].length; j++) {
                    var tag = null;
                    if (pivotengine[i][j].CSS == " value")
                        valuePoints.push(pivotengine[i][j].Value);
                    if (pivotengine[i][j].CSS == "rowheader" && pivotengine[i][j].Value != "") {
                        var obj = {};
                        tag = pivotengine[i][j].Info + "::" + pivotengine[i][j].State;
                        drillTags.push((pivotengine[i][j].Info).replace(/&/g, "&amp;"))
                        labelTags.push(tag);
                        if (tempArray.length == 0 && pivotengine[i][j].Info.split(".")[0].indexOf("Measures") < 0) {
                            obj["level"] = i;
                            obj["index"] = j;
                            obj["label"] = pivotengine[i][j].Value;
                            tempArray.push(obj);
                        }
                        if (tempArray.length != 0 && pivotengine[i][j].Info.split(".")[0].indexOf("Measures") < 0) {
                            for (var k = 0; k < tempArray.length; k++) {
                                if (!ej.isNullOrUndefined(tempArray[k])) {
                                    if (tempArray[k].index == j && tempArray[k].level != i) {
                                        tempArray[k].level = i;
                                        tempArray[k].label = tempArray[k].label + "~~" + pivotengine[i][j].Value;
                                        break;
                                    }
                                    else if (tempArray[k].level == i) {
                                        var islevel = false;
                                        for (var m = 0; m < tempArray.length; m++) {
                                            if (!ej.isNullOrUndefined(tempArray[m]))
                                                if (tempArray[m].index == j) {
                                                    islevel = true;
                                                    break;
                                                }
                                        }
                                        if (!islevel && pivotengine[i][j].Info.split(".")[0].indexOf("Measures") < 0) {
                                            obj["level"] = i;
                                            obj["index"] = j;
                                            obj["label"] = pivotengine[i][j].Value;
                                            tempArray.push(obj);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (pivotengine[i][j].CSS == "summary") {
                        if (tempArray.length != 0) {
                            for (var k = 0; k < tempArray.length; k++) {
                                if (!ej.isNullOrUndefined(tempArray[k]))
                                    if (tempArray[k].index == j) {
                                        delete tempArray[k];
                                        break;
                                    }
                            }
                        }
                    }
                }
            }
            for (var k = 0; k < tempArray.length; k++) {
                if (!ej.isNullOrUndefined(tempArray[k]))
                    if (elementCount == tempArray[k].label.split("~~").length)
                        treemapLabels.push(tempArray[k].label);
            }

            /// for seriesNames

            var tempArray = new Array();
            for (var i = 0; i < pivotengine.length; i++) {
                for (var j = 0; j < pivotengine[i].length; j++) {
                    if (pivotengine[i][j].CSS == "colheader" && pivotengine[i][j].Value != "") {
                        var obj = {};
                        if (tempArray.length == 0) {
                            obj["level"] = j;
                            obj["index"] = i;
                            obj["label"] = (this._isOnlyMeasureElement ? "Total" : pivotengine[i][j].Value);
                            tempArray.push(obj);
                        }
                        if (tempArray.length != 0) {
                            for (var k = 0; k < tempArray.length; k++) {
                                if (!ej.isNullOrUndefined(tempArray[k])) {
                                    if (tempArray[k].index == i && tempArray[k].level != j && pivotengine[i][j].Info.split(".")[0].indexOf("Measures") < 0) {
                                        tempArray[k].index = i;
                                        tempArray[k].label = tempArray[k].label + "~~" + pivotengine[i][j].Value;
                                        break;
                                    }
                                    else if (tempArray[k].level == j && pivotengine[i][j].Info.split(".")[0].indexOf("Measures") < 0 || this._isOnlyMeasureElement) {
                                        var islevel = true;
                                        for (var m = 0; m < tempArray.length; m++) {
                                            if (!ej.isNullOrUndefined(tempArray[m])) {
                                                islevel = false;
                                                if (tempArray[m].index == i) {
                                                    islevel = true;
                                                    break;
                                                }
                                            }
                                        }
                                        if (!islevel && (pivotengine[i][j].Info.split(".")[0].indexOf("Measures") < 0 || this._isOnlyMeasureElement)) {
                                            obj["level"] = j;
                                            obj["index"] = i;
                                            obj["label"] = (this._isOnlyMeasureElement ? "Total" : pivotengine[i][j].Value);
                                            tempArray.push(obj);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (pivotengine[i][j].CSS == "summary") {
                        if (tempArray.length != 0) {
                            for (var k = 0; k < tempArray.length; k++) {
                                if (!ej.isNullOrUndefined(tempArray[k]))
                                    if (tempArray[k].index == i) {
                                        delete tempArray[k];
                                        break;
                                    }
                            }
                        }
                    }
                }
            }

            for (var k = 0; k < tempArray.length; k++) {
                if (!ej.isNullOrUndefined(tempArray[k]))
                    seriesNames.push(tempArray[k].label);
            }

            //// Add MeasureName with Dimension

            if (measureNames != "" && axis == ej.olap.AxisName.Column) {
                for (var i = 0; i < seriesNames.length; i++) {
                    seriesNames[i] = seriesNames[i] + "~" + measureNames;
                }
            }

            ///  for points_Y

            if (rowHeaderWidth == 0) {
                var valueCount = (valuePoints.length / seriesNames.length);
                for (var i = 0; i < treemapLabels.length; i++) {
                    var tempArray = new Array();
                    for (var j = i; j < valuePoints.length; j = j + valueCount) {
                        var obj = {};
                        obj["Item1"] = (treemapLabels[i].indexOf("~~") >= 0 ? treemapLabels[i].split("~~")[0] : treemapLabels[i]);
                        obj["Item2"] = valuePoints[j];
                        tempArray.push(obj);
                    }
                    points_Y.push(tempArray);
                }
            }
            else {
                var cellCount = [];
                var index = null;
                for (var i = 0; i < treemapLabels.length; i++) {
                    var tempArray = new Array();
                    for (var j = 0; j < pivotengine[rowHeaderWidth].length; j++) {
                        if (pivotengine[rowHeaderWidth][j].CSS == "rowheader" && pivotengine[rowHeaderWidth][j].Value != "")
                            if (treemapLabels[i].split("~~")[treemapLabels[i].split("~~").length - 1] == pivotengine[rowHeaderWidth][j].Value) {
                                index = j;
                                tempArray.push(index);
                                tempArray.push(treemapLabels[i]);
                                cellCount.push(tempArray);
                                break;
                            }
                    }
                }
                for (var k = 0; k < cellCount.length; k++) {
                    var tempArray = new Array();
                    for (var i = 0; i < pivotengine.length; i++) {
                        for (var j = cellCount[k][0]; j < pivotengine[i].length; j++) {
                            if (pivotengine[i][j].CSS == " value") {
                                var obj = {};
                                obj["Item1"] = (cellCount[k][1].indexOf("~~") >= 0 ? cellCount[k][1].split("~~")[0] : cellCount[k][1]);
                                obj["Item2"] = pivotengine[i][j].Value;
                                tempArray.push(obj);
                            }
                            break;
                        }
                    }
                    if (tempArray.length != 0)
                        points_Y.push(tempArray);
                }
            }

            //// for jsonData

            jsonData["labelTags"] = labelTags;
            jsonData["drillTags"] = drillTags;
            jsonData["measureNames"] = measureNames;
            jsonData["points_Y"] = points_Y;
            jsonData["seriesNames"] = seriesNames;
            jsonData["treemapLabels"] = treemapLabels;
            ptreemapProxy._JSONRecords = jsonData;
            this.renderTreeMapFromJSON(jsonData);
            this._unWireEvents();
            this._wireEvents();
        },

        _dataTrans: function (dataSource) {
            if (dataSource.columns.length == 0 && dataSource.rows.length > 0) {
                var isMeasureElement = false;
                var newList = [];
                if (dataSource.values.length > 0)
                    if (dataSource.values[0].measures.length > 0) {
                        if (dataSource.values[0].axis == ej.olap.AxisName.Row)
                            dataSource.values[0].axis = ej.olap.AxisName.Column;
                        isMeasureElement = this._isOnlyMeasureElement = true;
                    }
            }
        },

        _wireEvents: function () {
            if (!ej.isNullOrUndefined(this._pivotClientObj))
                $(window).on('resize', $.proxy(this._reSizeHandler, this));
            this._on(this.element, "click", ".drillItem", this._drillTreeMap);
        },

        _drillTreeMap: function (event) {
            var ptreemapProxy = ej.isNullOrUndefined(this.model.ptreemapProxy) ? this : this.model.ptreemapProxy;
            var memberInfo = null;
            if (event.type == "treeMapGroupSelected") {
                ptreemapProxy._treemapWaitingPopup({ show: true });
                if (event.selectedGroups.length == 0) {
                    ptreemapProxy._treemapWaitingPopup({ show: false });
                    return;
                }
                ptreemapProxy._currentAction = "drilldown";                
                ptreemapProxy._selectedItem = event.selectedGroups[0].header;
                for (var j = 0; j < ptreemapProxy._treeMapDatasource.length; j++) {
                    if (ptreemapProxy._treeMapDatasource[j].Tag.split("::")[2] == ptreemapProxy._selectedItem) {
                        ptreemapProxy._selectedTagInfo = ptreemapProxy._treeMapDatasource[j].Tag;
                        if (ptreemapProxy.model.operationalMode == ej.PivotTreeMap.OperationalMode.ClientMode)
                            memberInfo = ptreemapProxy._treeMapDatasource[j].drillTag;
                        if (ptreemapProxy._selectedTagInfo.split("::")[ptreemapProxy._selectedTagInfo.split("::").length - 1] != 2) {
                            ptreemapProxy._treeMap.refresh();
                            ptreemapProxy._treemapWaitingPopup({ show: false });
                            return;
                        }
                        else
                            break;
                    }
                }
                ptreemapProxy._startDrilldown = true;
                if (ptreemapProxy.model.operationalMode == ej.PivotTreeMap.OperationalMode.ServerMode) {
                    if (ptreemapProxy.model.beforeServiceInvoke != null)
                        ptreemapProxy._trigger("beforeServiceInvoke", { action: ptreemapProxy._currentAction, element: ptreemapProxy.element, customObject: ptreemapProxy.model.customObject });
                    var serializedCustomObject = JSON.stringify(ptreemapProxy.model.customObject);
                    if (ptreemapProxy.model.customObject != "" && ptreemapProxy.model.customObject != null && ptreemapProxy.model.customObject != undefined) {
                        if (!ej.isNullOrUndefined(ptreemapProxy._pivotClientObj))
                            ptreemapProxy.doAjaxPost("POST", ptreemapProxy.model.url + "/" + ptreemapProxy.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drillInfo": ptreemapProxy._selectedTagInfo, "olapReport": ptreemapProxy.getOlapReport(), "clientReports": ptreemapProxy._pivotClientObj.reports, "customObject": serializedCustomObject }), ptreemapProxy.renderControlSuccess);
                        else
                            ptreemapProxy.doAjaxPost("POST", ptreemapProxy.model.url + "/" + ptreemapProxy.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drillInfo": ptreemapProxy._selectedTagInfo, "olapReport": ptreemapProxy.getOlapReport(), "customObject": serializedCustomObject }), ptreemapProxy.renderControlSuccess);
                    }
                    else {
                        if (!ej.isNullOrUndefined(ptreemapProxy._pivotClientObj))
                            ptreemapProxy.doAjaxPost("POST", ptreemapProxy.model.url + "/" + ptreemapProxy.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drillInfo": ptreemapProxy._selectedTagInfo, "olapReport": ptreemapProxy.getOlapReport() }), ptreemapProxy.renderControlSuccess);
                        else
                            ptreemapProxy.doAjaxPost("POST", ptreemapProxy.model.url + "/" + ptreemapProxy.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drillInfo": ptreemapProxy._selectedTagInfo, "olapReport": ptreemapProxy.getOlapReport(), "clientReports": ptreemapProxy._pivotClientObj.reports }), ptreemapProxy.renderControlSuccess);
                    }
                }
                else {
                    ptreemapProxy._drilledMembers.push(memberInfo);
                    ej.olap._mdxParser.updateDrilledReport({ uniqueName: memberInfo, seriesInfo: [memberInfo], uniqueNameArray: ptreemapProxy._drilledMembers }, "rowheader", ptreemapProxy);
                }
            }
            else {
                ptreemapProxy._treemapWaitingPopup({ show: true });
                ptreemapProxy._currentAction = "drillup";
                if ($(event.target).hasClass("drillItem")) {
                    if (ptreemapProxy.getJsonRecords().treemapLabels[0].indexOf("~~") >= 0) {
                        ptreemapProxy._selectedItem = $(event.target).text();
                        for (var i = 0; i < ptreemapProxy.getJsonRecords().labelTags.length; i++) {
                            if (ptreemapProxy.getJsonRecords().labelTags[i].split("::")[2] == ptreemapProxy._selectedItem && ptreemapProxy.getJsonRecords().labelTags[i].split("::")[ptreemapProxy.getJsonRecords().labelTags[i].split("::").length - 1] == 1) {
                                ptreemapProxy._selectedTagInfo = ptreemapProxy.getJsonRecords().labelTags[i];
                                if (ptreemapProxy.model.operationalMode == ej.PivotTreeMap.OperationalMode.ClientMode)
                                    memberInfo = ptreemapProxy.getJsonRecords().drillTags[i];
                                if (ptreemapProxy._selectedTagInfo.split("::")[ptreemapProxy._selectedTagInfo.split("::").length - 1] != 1) {
                                    ptreemapProxy._treemapWaitingPopup({ show: false });
                                    return;
                                }
                                else
                                    break;
                            }
                        }
                    }
                    else {
                        ptreemapProxy._treemapWaitingPopup({ show: false });
                        return;
                    }
                }
                if (ptreemapProxy._tagCollection.length == 0)
                    ptreemapProxy._isDrilled = false;
                ptreemapProxy._startDrilldown = true;
                if (ptreemapProxy.model.operationalMode == ej.PivotTreeMap.OperationalMode.ServerMode) {
                    if (ptreemapProxy.model.beforeServiceInvoke != null)
                        ptreemapProxy._trigger("beforeServiceInvoke", { action: ptreemapProxy._currentAction, element: ptreemapProxy.element, customObject: ptreemapProxy.model.customObject });
                    var serializedCustomObject = JSON.stringify(ptreemapProxy.model.customObject);
                    if (ptreemapProxy.model.customObject != "" && ptreemapProxy.model.customObject != null && ptreemapProxy.model.customObject != undefined) {
                        if (!ej.isNullOrUndefined(ptreemapProxy._pivotClientObj))
                            ptreemapProxy.doAjaxPost("POST", ptreemapProxy.model.url + "/" + ptreemapProxy.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillup", "drillInfo": ptreemapProxy._selectedTagInfo, "olapReport": ptreemapProxy.getOlapReport(), "clientReports": ptreemapProxy._pivotClientObj.reports, "customObject": serializedCustomObject }), ptreemapProxy.renderControlSuccess);
                        else
                            ptreemapProxy.doAjaxPost("POST", ptreemapProxy.model.url + "/" + ptreemapProxy.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillup", "drillInfo": ptreemapProxy._selectedTagInfo, "olapReport": ptreemapProxy.getOlapReport(), "customObject": serializedCustomObject }), ptreemapProxy.renderControlSuccess);
                    }
                    else {
                        if (!ej.isNullOrUndefined(ptreemapProxy._pivotClientObj))
                            ptreemapProxy.doAjaxPost("POST", ptreemapProxy.model.url + "/" + ptreemapProxy.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillup", "drillInfo": ptreemapProxy._selectedTagInfo, "olapReport": ptreemapProxy.getOlapReport() }), ptreemapProxy.renderControlSuccess);
                        else
                            ptreemapProxy.doAjaxPost("POST", ptreemapProxy.model.url + "/" + ptreemapProxy.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillup", "drillInfo": ptreemapProxy._selectedTagInfo, "olapReport": ptreemapProxy.getOlapReport(), "clientReports": ptreemapProxy._pivotClientObj.reports }), ptreemapProxy.renderControlSuccess);
                    }
                }
                else {
                    var uniqueNameArray = ptreemapProxy._drilledMembers.slice(0, $.inArray(memberInfo, ptreemapProxy._drilledMembers) + 1);
                    ptreemapProxy._drilledMembers = ptreemapProxy._drilledMembers.slice(0, $.inArray(memberInfo, ptreemapProxy._drilledMembers));
                    ej.olap._mdxParser.updateDrilledReport({ uniqueName: memberInfo, seriesInfo: [memberInfo], uniqueNameArray: uniqueNameArray, action: "collapse" }, "rowheader", ptreemapProxy);
                }
            }
        },

        _unWireEvents: function () {
            $(window).off('resize', $.proxy(this._reSizeHandler, this));
            this._off(this.element, "click", ".drillItem", this._drillTreeMap);
        },

        renderControlSuccess: function (msg) {
            var ptreemapProxy = this;
            ptreemapProxy._treemapWaitingPopup({ show: true });
            try {
                if (msg[0] != undefined) {
                    this.setJsonRecords(msg[0].Value); this.setOlapReport(msg[1].Value);
                    if (!ej.isNullOrUndefined(this._pivotClientObj)) {
                        this._pivotClientObj.currentReport = msg[1].Value;
                        if (msg[2] != null && msg[2] != undefined && msg[2].Key == "ClientReports")
                            this._pivotClientObj.reports = msg[2].Value;
                    }
                    if (msg[2] != null && msg[2] != undefined && !msg[2].Key == "ClientReports")
                        this.model.customObject = msg[2].Value;
                }
                else if (msg.d != undefined) {
                    this.setJsonRecords(msg.d[0].Value); this.setOlapReport(msg.d[1].Value);
                    if (!ej.isNullOrUndefined(this._pivotClientObj)) {
                        this._pivotClientObj.currentReport = msg.d[1].Value;
                        if (msg.d[2] != null && msg.d[2] != undefined && msg.d[2].Key == "ClientReports")
                            this._pivotClientObj.reports = msg.d[2].Value;
                    }
                    if (msg.d[2] != null && msg.d[2] != undefined && !(msg.d[2].Key == "ClientReports"))
                        this.model.customObject = msg.d[2].Value;
                }
                else {
                    this.setJsonRecords(msg.JsonRecords); this.setOlapReport(msg.OlapReport);
                    if (msg.customObject != null && msg.customObject != null)
                        this.model.customObject = msg.customObject;
                    if (!ej.isNullOrUndefined(this._pivotClientObj)) {
                        if (typeof (this._pivotClientObj.currentReport) != "undefined")
                            this._pivotClientObj.currentReport = msg.OlapReport;
                        if (typeof (this._pivotClientObj.reports) != "undefined" && msg.reports != undefined && msg.reports != "undefined")
                            this._pivotClientObj.reports = msg.reports;
                    }
                }
                if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotTreeMap.OperationalMode.ServerMode) {
                    var eventArgs;
                    if (this._currentAction != "initialize")
                        eventArgs = { action: this._currentAction, element: this.element, customObject: this.model.customObject };
                    else
                        eventArgs = { action: this._currentAction, element: this.element, customObject: this.model.customObject };
                    this._trigger("afterServiceInvoke", eventArgs);
                }
                this.renderTreeMapFromJSON(this.getJsonRecords())
                this._unWireEvents();
                this._wireEvents();
                if (this._currentAction != "initialize") {
                    this.model.currentReport = this.getOlapReport();
                    if (!ej.isNullOrUndefined(this._pivotClientObj))
                        this._pivotClientObj._trigger("treeMapDrillSuccess", this.element);
                    else
                        this._trigger("drillSuccess", this.element);
                }
                if (!ej.isNullOrUndefined(this._pivotClientObj)) this._pivotClientObj._isTimeOut = false;
                if (typeof this._pivotClientObj != 'undefined' && this._pivotClientObj._waitingPopup != null) {
                    if ($("#" + this._pivotClientObj._id + "_maxView")[0])
                        $("#" + this._pivotClientObj._id + "_maxView").ejWaitingPopup({ showOnInit: false });
                    else if (typeof this._pivotClientObj._pivotGrid != "undefined") {
                        if (this._pivotClientObj && (this._pivotClientObj._pivotGrid._drillAction && !this._pivotClientObj._pivotGrid._startDrilldown) || this._pivotClientObj.otreemapObj._currentAction && !this._pivotClientObj.otreemapObj._startDrilldown)
                            this._pivotClientObj._waitingPopup.hide();
                        else if (this._pivotClientObj && this._pivotClientObj._pivotGrid._drillAction == "" && this._pivotClientObj.otreemapObj._currentAction == "" && !this._pivotClientObj._pivotGrid._startDrilldown && !this._pivotClientObj.otreemapObj._startDrilldown && (this._pivotClientObj._pivotGrid._JSONRecords != null || this._pivotClientObj.otreemapObj._JSONRecords == null))
                            this._pivotClientObj._waitingPopup.hide();
                        else if (this._pivotClientObj.otreemapObj._startDrilldown && !this._pivotClientObj._pivotGrid._startDrilldown && !$("#" + this._pivotClientObj._id + "_maxView")[0])
                            this._pivotClientObj._waitingPopup.hide();
                        else if (!this._pivotClientObj.otreemapObj._startDrilldown && !this._pivotClientObj._pivotGrid._startDrilldown && this._pivotClientObj.otreemapObj._currentAction == "" && this._pivotClientObj._pivotGrid._drillAction == "" && (this._pivotClientObj._pivotGrid._JSONRecords != null || this._pivotClientObj.otreemapObj._JSONRecords == null))
                            this._pivotClientObj._waitingPopup.hide();
                    }
                    if (this._pivotClientObj.model.displaySettings.mode == "chartonly")
                        this._pivotClientObj._waitingPopup.hide();
                }
                else
                    this._waitingPopup.hide();
                if (typeof this._pivotClientObj != 'undefined')
                    this._pivotClientObj.otreemapObj._startDrilldown = false;
            }
            catch (err) {
            }
            if (!ej.isNullOrUndefined(msg.Exception)) {
                ej.Pivot._createErrorDialog(msg, "Exception", this);
            }
        },

        renderTreeMapFromJSON: function (jsonData) {
            var ptreemapProxy = this;
            this._treeMapDatasource = [];
            var rowElement = "";
            if ((ej.isNullOrUndefined(jsonData)) || jsonData.length <= 0 || jsonData.labelTags.length == 0 || jsonData.points_Y.length == 0) {
                ptreemapProxy._treemapWaitingPopup({ show: false });
                return;
            }
            (!ej.isNullOrUndefined(jsonData.chartLables)) ? jsonData.treemapLabels = jsonData.chartLables : jsonData.treemapLabels;
            if (jsonData.points_Y.length != jsonData.treemapLabels.length) {
                this._pivotClientObj._onFiltered = false
                var treeMapData = [];
                for (var i = 0; i < JSON.parse(JSON.stringify(ptreemapProxy.getJsonRecords().points_Y)).length - 1; i++) {
                    treeMapData.push(JSON.parse(JSON.stringify(ptreemapProxy.getJsonRecords().points_Y))[i]);
                }
            }
            else
                var treeMapData = JSON.parse(JSON.stringify(ptreemapProxy.getJsonRecords().points_Y));
            if (!ej.isNullOrUndefined(this._pivotClientObj))
                if (this._pivotClientObj.model.enableDeferUpdate && this._pivotClientObj._ischartTypesChanged)
                    this._pivotClientObj._ischartTypesChanged = false;

            for (var i = 0; i < treeMapData.length; i++) {
                var rowName = ptreemapProxy.getJsonRecords().treemapLabels[i].split("~~")[ptreemapProxy.getJsonRecords().treemapLabels[i].split("~~").length - 1];
                for (var j = 0; j < treeMapData[i].length; j++) {
                    treeMapData[i][j]['Item1'] = treeMapData[i][j]['Item1'].replace(treeMapData[i][j]['Item1'], rowName);
                    treeMapData[i][j]['Column'] = ptreemapProxy.getJsonRecords().seriesNames[j].split("~")[0];
                    treeMapData[i][j]['Measures'] = ptreemapProxy.getJsonRecords().measureNames;
                    treeMapData[i][j]['Tag'] = $.grep(ptreemapProxy.getJsonRecords().labelTags, function (tag) { return tag.split("::")[2] == treeMapData[i][j]['Item1']; })[0];
                    if (this.model.operationalMode == ej.PivotTreeMap.OperationalMode.ClientMode)
                        treeMapData[i][j]['drillTag'] = $.grep(ptreemapProxy.getJsonRecords().drillTags, function (drilltag) { return drilltag.split("::")[2] == treeMapData[i][j]['Item1']; })[0];
                    treeMapData[i][j][treeMapData[i][j].Tag.split("::")[1].split('.')[0].replace("[", "").replace("]", "")] = treeMapData[i][j].Item1;
                    treeMapData[i][j]['RowItem'] = treeMapData[i][j].Item1;
                    treeMapData[i][j]['Value'] = (treeMapData[i][j].Item2 != "" ? treeMapData[i][j].Item2 : "0");
                    treeMapData[i][j]['Index'] = j;
                    delete treeMapData[i][j]['Item1'];
                    delete treeMapData[i][j]['Item2'];
                    rowElement += (rowElement == "" ? "" : ";") + treeMapData[i][j].Tag.split("::")[1].split('.')[0].replace("[", "").replace("]", "");
                }
            }
            if (!ej.isNullOrUndefined(ptreemapProxy.getJsonRecords().measureNames))
                var measureCount = ptreemapProxy.getJsonRecords().measureNames.split("~");
            var minValue, maxValue;
            if (measureCount.length != 2) {
                for (var i = 0; i < treeMapData.length; i++) {
                    for (var j = 0; j < treeMapData[i].length; j++) {
                        treeMapData[i][j].Value = ej.isNullOrUndefined(treeMapData[i][j].Value) ? 0 : ((treeMapData[i][j].Value.indexOf(",") || treeMapData[i][j].Value.indexOf(".") || treeMapData[i][j].Value.indexOf(" ")) > -1 ? ej.globalize.parseFloat(ej.globalize.format(treeMapData[i][j].Value, "c", this.model.locale), this.model.locale) : ej.globalize.parseFloat(treeMapData[i][j].Value));
                        this._treeMapDatasource.push(treeMapData[i][j]);
                        if (ej.isNullOrUndefined(minValue) || minValue >= treeMapData[i][j].Value)
                            minValue = treeMapData[i][j].Value;
                        if (ej.isNullOrUndefined(maxValue) || maxValue <= treeMapData[i][j].Value)
                            maxValue = treeMapData[i][j].Value;
                    }
                }
            }
            else if (measureCount.length == 2) {
                var tempAarry = [];
                $.each(treeMapData, function (i, treeMapObjData) {
                    for (var j = 0; j < treeMapObjData.length; j++) {
                        if (!ej.isNullOrUndefined(treeMapObjData[j].Value)) {
                            treeMapObjData[j].Value = ej.isNullOrUndefined(treeMapObjData[j].Value) ? 0 : ((treeMapObjData[j].Value.indexOf(",") || treeMapObjData[j].Value.indexOf(".") || treeMapObjData[j].Value.indexOf(" ")) > -1 ? ej.globalize.parseFloat(ej.globalize.format(treeMapObjData[j].Value, "c", ptreemapProxy.model.locale), ptreemapProxy.model.locale) : ej.globalize.parseFloat(treeMapObjData[j].Value));
                            treeMapObjData[j]['Color'] = treeMapObjData[j].Value;
                            if (!ej.isNullOrUndefined(treeMapObjData[j + 1])) {
                                if (treeMapObjData[j].Column == treeMapObjData[j + 1].Column) {
                                    treeMapObjData[j].Value = ej.isNullOrUndefined(treeMapObjData[j + 1].Value) ? 0 : ((treeMapObjData[j + 1].Value.indexOf(",") || treeMapObjData[j + 1].Value.indexOf(".") || treeMapObjData[j + 1].Value.indexOf(" ")) > -1 ? ej.globalize.parseFloat(ej.globalize.format(treeMapObjData[j + 1].Value, "c", ptreemapProxy.model.locale), ptreemapProxy.model.locale) : ej.globalize.parseFloat(treeMapObjData[j + 1].Value)); //treeMapObjData[j + 1].Value;
                                    j = j + 1;
                                }
                            }
                            else
                                treeMapObjData[j].Value = 0;
                        }
                    }
                    $.each(treeMapObjData, function (j, item) {
                        if (!ej.isNullOrUndefined(item) && !ej.isNullOrUndefined(item.Value) && ej.isNullOrUndefined(item.Color))
                            treeMapObjData.splice(j, 1);
                    });
                    $.each(treeMapObjData, function (j, item) {
                        if (!ej.isNullOrUndefined(item)) {
                            item.Index = j;
                            tempAarry.push(item);
                        }
                    });
                });
                this._treeMapDatasource = tempAarry;
                $.each(this._treeMapDatasource, function (k, item) {
                    if (!ej.isNullOrUndefined(item.Color)) {
                        if (ej.isNullOrUndefined(minValue) || minValue >= item.Color)
                            minValue = item.Color;
                        if (ej.isNullOrUndefined(maxValue) || maxValue <= item.Color)
                            maxValue = item.Color;
                    }
                });
            }
            if (ptreemapProxy.getJsonRecords().treemapLabels.length > 0) {
                ptreemapProxy._drillText = "";
                var temp = [];
                for (var i = 0; i < ptreemapProxy.getJsonRecords().treemapLabels.length; i++) {
                    if (ptreemapProxy.getJsonRecords().treemapLabels[i].split("~~").length > 1) {
                        for (var j = 0; j < ptreemapProxy.getJsonRecords().treemapLabels[i].split("~~").length - 1; j++) {
                            var drillstate = 0;
                            for (var k = 0; k < ptreemapProxy.getJsonRecords().labelTags.length; k++) {
                                if (ptreemapProxy.getJsonRecords().labelTags[k].split("::")[2] == ptreemapProxy.getJsonRecords().treemapLabels[i].split("~~")[j] && ptreemapProxy.getJsonRecords().labelTags[k].split("::")[ptreemapProxy.getJsonRecords().labelTags[k].split("::").length - 1] == 1) {
                                    drillstate = 1;
                                    break;
                                }
                            }
                            if (temp.length == 0 && drillstate == 1)
                                temp.push(ptreemapProxy.getJsonRecords().treemapLabels[i].split("~~")[j]);
                            else {
                                if (temp.length > 0) {
                                    var index = jQuery.inArray(ptreemapProxy.getJsonRecords().treemapLabels[i].split("~~")[j], temp);
                                    if (index == -1 && drillstate == 1)
                                        temp.push(ptreemapProxy.getJsonRecords().treemapLabels[i].split("~~")[j]);
                                }
                            }
                        }
                    }
                }
                for (var i = 0; i < temp.length; i++) {
                    ptreemapProxy._drillText += ptreemapProxy._drillText == "" ? ej.buildTag("a.drillItem", temp[i])[0].outerHTML : " > " + ej.buildTag("a.drillItem", temp[i])[0].outerHTML;
                }
            }
            this._showDrillText = ptreemapProxy._drillText == "" ? ej.buildTag("span.drillup", rowElement.split(";")[0], { "margin-left": "5px" })[0].outerHTML : ej.buildTag("span.drillup", rowElement.split(";")[0], { "margin-left": "5px" })[0].outerHTML + ": " + ptreemapProxy._drillText;
            var htmlTag = ej.buildTag("div#" + this._id + "TreeMapContainer", "", { "height": (!ej.isNullOrUndefined(this._pivotClientObj)) ? (parseInt(this._pivotClientObj._chartHeight) - 50).toString() + "px" : this.element.height(), "width": (!ej.isNullOrUndefined(this._pivotClientObj)) ? this._pivotClientObj._chartWidth : this.element.width(), "margin-top": "50px" })[0].outerHTML;
            this.element.html(htmlTag);
            minValue = minValue - 1;
            maxValue = maxValue + 1;
            rowElement = rowElement.split(";")[0];
            $("#" + this._id + "TreeMapContainer").ejTreeMap({
                ptreemapProxy:this,
                dataSource: this._treeMapDatasource,
                showTooltip: true,
                colorValuePath: (measureCount.length == 2 ? "Color" : "Value"),
                tooltipTemplate: "tooltipTemplate",
                enableDrillDown: false,
                enableGradient: true,
                highlightGroupOnSelection: (!ej.isNullOrUndefined(this._pivotClientObj) ? (!this._pivotClientObj.model.enableDeferUpdate ? true : false) : true),
                treeMapGroupSelected: this._drillTreeMap,
                refreshed: this._treeMapRenderSuccess,
                showLegend: true,
                legendSettings: {
                    leftLabel: minValue.toString(),
                    width: 150,
                    height: 20,
                    title: this._treeMapDatasource[0].Measures,
                    rightLabel: maxValue.toString(),
                    mode: "interactive",
                    dockPosition: "bottom",
                    alignment: "center"
                },
                rangeColorMapping: [{
                    from: minValue,
                    to: maxValue,
                    gradientColors: ["#fde6cc", "#fab665"]
                }],
                weightValuePath: "Value",
                leafItemSettings: { showLabels: true, labelPath: "Column", labelVisibilityMode: "hideonexceededlength" },
                levels: [{ groupPath: rowElement, groupGap: 2, showHeader: true, headerHeight: 25, labelPosition: "topleft", headerVisibilityMode: "hideonexceededlength" }]
            });

            this._treeMap = this.element.find("#" + this._id + "TreeMapContainer").data("ejTreeMap");
            this._treeMap["rowItem"] = rowElement;
            
            $.views.helpers({
                Measures: function (data) {
                    var measures = null;
                    measures = data.Measures;
                    return measures;
                },
                Column: function (data) {
                    var column = null;
                    column = data.Column;
                    return column;
                },
                Row: function (data) {
                    var row = null;
                    row = data.RowItem;
                    return row;
                },
                Value: function (data) {
                    var value = 0;
                        value = data.Value;
                    return value;
                },
                Color: function (data) {
                    var color = 0;
                    color = ej.isNullOrUndefined(data.Color) ? data.Value : data.Color;
                    return color;
                },
            });
            var eventArgs = { "action": this._currentAction, "customObject": this.model.customObject, "element": this.element };
            this._trigger("renderSuccess", eventArgs);
            if (!ej.isNullOrUndefined(this._pivotClientObj))
                $("#" + this._id + "TreeMapContainer").css({ width: "100%" });
            this._treeMap.refresh();
            ptreemapProxy = this;
	        ptreemapProxy._JSONRecords = jsonData;
                ptreemapProxy._treemapWaitingPopup({ show: false });
        },

        _treemapWaitingPopup: function (args) {
            var ptreemapProxy = $(this.element).hasClass("e-pivottreemap") ? $(this.element).data("ejPivotTreeMap") : $(this.element).parents(".e-pivottreemap").data("ejPivotTreeMap");
            if ($(ptreemapProxy.element).parents(".e-pivotclient").length > 0) {
                if (!ej.isNullOrUndefined(ptreemapProxy._pivotClientObj) && !(args.show)) ptreemapProxy._pivotClientObj._isTimeOut = false;
                if ($("#" + ptreemapProxy._pivotClientObj._id + "_maxView")[0])
                    $("#" + ptreemapProxy._pivotClientObj._id + "_maxView").ejWaitingPopup({ showOnInit: args.show });
                else if (!ej.isNullOrUndefined(ptreemapProxy._pivotClientObj._waitingPopup)) {
                    if (args.show)
                        ptreemapProxy._pivotClientObj._waitingPopup.show();
                    else
                        ptreemapProxy._pivotClientObj._waitingPopup.hide();
                }
            }
            else {
                if (!ej.isNullOrUndefined(ptreemapProxy._waitingPopup) && args.show)
                    ptreemapProxy._waitingPopup.show();
                else
                    ptreemapProxy._waitingPopup.hide();
            }
        },
        _treeMapRenderSuccess: function (args) {
            var ptreemapProxy = this.model.ptreemapProxy;
            ptreemapProxy._treeMap = $("#" + ptreemapProxy._id + "TreeMapContainer").data("ejTreeMap");
            if (!ej.isNullOrUndefined(ptreemapProxy._treeMap)) {
                if (ptreemapProxy._treeMap.model.legendSettings.dockPosition == "top") {
                    if (!ptreemapProxy.element.find("#" + ptreemapProxy._id + "TreeMapContainer").children().hasClass("e-drillupAction"))
                        $(ej.buildTag("div#drillHeader .e-drillupAction", ptreemapProxy._showDrillText, { "height": "25px", "width": "99.8%", "z-index": "10", "position": "absolute", "margin-top": "33px" })[0].outerHTML).insertAfter($("#" + ptreemapProxy._id + "TreeMapContainer").find(".LegendDiv").css("margin-top", "-50px").css("font-size", "12px"));
                }
                else {
                    $("#" + ptreemapProxy._id + "TreeMapContainer").find(".LegendDiv").css("font-size", "12px").insertAfter($("#" + ptreemapProxy._id + "TreeMapContainer").find("._templateDiv"));
                    $(ej.buildTag("div#drillHeader .e-drillupAction", ptreemapProxy._showDrillText, { "height": "25px", "width": "99.8%", "position": "absolute", "margin-top": "-32px" })[0].outerHTML).insertBefore($("#" + ptreemapProxy._id + "TreeMapContainer").find("#backgroundTile"));
                }
            }
        },

        _reSizeHandler: function (args) {
            var ptreemapProxy = this;
            var resize = ptreemapProxy.element.find("#" + ptreemapProxy._id + "TreeMapContainer").width(ptreemapProxy.element.width()).data("ejTreeMap");
            if (!ej.isNullOrUndefined(resize))
                resize.refresh();
        },

        doAjaxPost: function (type, url, data, onSuccess, onComplete, customArgs) {
            var contentType, dataType, successEvt, isAsync = true, ptreemapProxy = this, withCred = (this.model.enableXHRCredentials || (!ej.isNullOrUndefined(this._pivotClientObj) && this._pivotClientObj.model.enableXHRCredentials));
            if ((data["XMLA"] == undefined))
                contentType = 'application/json; charset=utf-8', dataType = 'json', successEvt = $.proxy(onSuccess, this);
            else
                contentType = 'text/xml', dataType = 'xml', data = data["XMLA"], successEvt = $.proxy(onSuccess, ej.olap.base, customArgs), isAsync = (ej.browserInfo().name == "msie" && ej.browserInfo().version <= 9) ? false : ((!ej.isNullOrUndefined(customArgs) && customArgs["action"] != "loadFieldElements") ? true : false);
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
                    var eventArgs = { "action": this._currentAction, "customObject": this.model.customObject, element: this.element };
                    this._trigger("renderComplete", eventArgs);
                }, this),
                error: ej.proxy(function (msg, textStatus, errorThrown) {
                    if (typeof this._waitingPopup != 'undefined' && this._waitingPopup != null)
                        this._waitingPopup.hide();
                    ptreemapProxy._treemapWaitingPopup({ show: false });
                    var eventArgs = { "action": this._currentAction, "customObject": this.model.customObject, "element": this.element, "Message": msg };
                    this._trigger("renderFailure", eventArgs);
                    this.renderTreeMapFromJSON("");
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

    ej.PivotTreeMap.OperationalMode = {
        ClientMode: "clientmode",
        ServerMode: "servermode"
    };
})(jQuery, Syncfusion);