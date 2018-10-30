ej.Pivot = ej.Pivot || {};

(function ($, ej, undefined) {

    ej.Pivot = {

        //Report Manipulations
        addReportItem: function (dataSource, args) {
            if (!args.isMeasuresDropped) {
                var reportItem = this.removeReportItem(dataSource, args.droppedFieldName, args.isMeasuresDropped);
                if (ej.isNullOrUndefined(reportItem)) reportItem = { fieldName: args.droppedFieldName, fieldCaption: args.droppedFieldCaption, format: args.droppedFieldFormat, formatString: args.droppedFieldFormatString, showSubTotal: args.droppedFieldShowSubTotal, expression: args.droppedExpression, hierarchyUniqueName: args.droppedHierarchyUniqueName};
                for (var itm in reportItem) { if ((itm == "format" || itm == "formatString") && (ej.isNullOrUndefined(reportItem[itm]) || reportItem[itm] == "")) delete reportItem[itm]; }
                switch (args.droppedClass) {
                    case "row":
                        args.droppedPosition.toString() != "" ? dataSource.rows.splice(args.droppedPosition, 0, reportItem) : dataSource.rows.push(reportItem);
                        break;
                    case "column":
                        args.droppedPosition.toString() != "" ? dataSource.columns.splice(args.droppedPosition, 0, reportItem) : dataSource.columns.push(reportItem);
                        break;
                    case "value":
                        if (dataSource.cube == "")
                            args.droppedPosition.toString() != "" ? dataSource.values.splice(args.droppedPosition, 0, reportItem) : dataSource.values.push(reportItem);
                        else
                            args.droppedPosition.toString() != "" ? dataSource.values[0].measures.splice(args.droppedPosition, 0, reportItem) : dataSource.values[0].measures.push(reportItem);
                        break;
                    case "filter":
                        args.droppedPosition.toString() != "" ? dataSource.filters.splice(args.droppedPosition, 0, reportItem) : dataSource.filters.push(reportItem);
                        break;
                }
            }
            else {
                if (args.droppedClass != "")
                    dataSource.values[0].axis = args.droppedClass == "row" ? "rows" : args.droppedClass == "column" ? "columns" : dataSource.values[0].axis;
                else
                    dataSource.values[0].measures = [];
            }
        },

        removeReportItem: function (dataSource, droppedFieldName, isMeasuresDropped) {
            var analysisMode = dataSource.cube == "" ? ej.Pivot.AnalysisMode.Pivot : ej.Pivot.AnalysisMode.Olap;
            var reportItem = $.grep(dataSource.columns, function (value) { return value.fieldName == droppedFieldName; });
            if (!isMeasuresDropped) {
                if (reportItem.length > 0) dataSource.columns = $.grep(dataSource.columns, function (value) { return value.fieldName != droppedFieldName; });
                else {
                    reportItem = $.grep(dataSource.rows, function (value) { return value.fieldName == droppedFieldName; });
                    if (reportItem.length > 0) dataSource.rows = $.grep(dataSource.rows, function (value) { return value.fieldName != droppedFieldName; });
                    else {
                        var valueItems = (analysisMode == ej.Pivot.AnalysisMode.Olap ? dataSource.values[0]["measures"] : dataSource.values);
                        reportItem = $.grep(valueItems, function (value) { return value.fieldName == droppedFieldName; });
                        if (reportItem.length > 0)
                            dataSource.values = analysisMode == ej.Pivot.AnalysisMode.Olap ? [{ measures: $.grep(valueItems, function (value) { return value.fieldName != droppedFieldName; }), axis: dataSource.values[0].axis }] : $.grep(valueItems, function (value) { return value.fieldName != droppedFieldName; });
                        else {
                            reportItem = $.grep(dataSource.filters, function (value) { return value.fieldName == droppedFieldName; });
                            if (reportItem.length > 0) dataSource.filters = $.grep(dataSource.filters, function (value) { return value.fieldName != droppedFieldName; });
                        }
                    }
                }
            }
            else
                dataSource.values[0].measures = [];
            return reportItem[0];
        },

        getReportItemByFieldName: function (fieldName, dataSource) {
            var axis = "columns";
            var reportItem = $.grep(dataSource.columns, function (value) { return value.fieldName.toLowerCase() == fieldName.toLowerCase(); });
            if (reportItem.length == 0) {
                reportItem = $.grep(dataSource.rows, function (value) { return value.fieldName.toLowerCase() == fieldName.toLowerCase() });
                axis = "rows";
            }
            if (reportItem.length == 0) {
                var valuesItems = dataSource.cube == "" ? dataSource.values : (dataSource.values.length > 0 && !ej.isNullOrUndefined(dataSource.values[0].measures)) ? dataSource.values[0].measures : [];
                reportItem = $.grep(valuesItems, function (value) { return value.fieldName.toLowerCase() == fieldName.toLowerCase(); });
                axis = "values"
            }
            if (reportItem.length == 0) {
                reportItem = $.grep(dataSource.filters, function (value) { return (value.fieldName.toLowerCase() == fieldName.toLowerCase()); });
                axis = "filters"
            }
            return { item: reportItem[0], axis: axis };
        },

        getReportItemByFieldCaption: function (fieldCaption, dataSource) {
            var axis = "columns";
            var reportItem = $.grep(dataSource.columns, function (value) { return value.fieldCaption.toLowerCase() == fieldCaption.toLowerCase(); });
            if (reportItem.length == 0) {
                reportItem = $.grep(dataSource.rows, function (value) { return value.fieldCaption.toLowerCase() == fieldCaption.toLowerCase() });
                axis = "rows";
            }
            if (reportItem.length == 0) {
                var valuesItems = dataSource.cube == "" ? dataSource.values : (dataSource.values.length > 0 && !ej.isNullOrUndefined(dataSource.values[0].measures)) ? dataSource.values[0].measures : [];
                reportItem = $.grep(valuesItems, function (value) { return value.fieldCaption.toLowerCase() == fieldCaption.toLowerCase(); });
                axis = "values"
            }
            if (reportItem.length == 0) {
                reportItem = $.grep(dataSource.filters, function (value) { return (value.fieldCaption.toLowerCase() == fieldCaption.toLowerCase()); });
                axis = "filters"
            }
            return { item: reportItem[0], axis: axis };
        },

        //Common functionalities

        closePreventPanel: function (args) {
            var ctrlObj = args.type != 'close' ? args : this;
            ctrlObj.element.find("[id^='preventDiv']").remove();
            if (!ej.isNullOrUndefined(ctrlObj.model.pivotControl)) {
                ctrlObj.model.pivotControl.element.find("[id^='preventDiv']").remove();
                ctrlObj.model.pivotControl._currentReportItems = $.extend(true, [], ctrlObj.model.pivotControl._savedReportItems);
            }
            else
                ctrlObj._currentReportItems = $.extend(true, [], ctrlObj._savedReportItems);
            if (!ej.isNullOrUndefined(ctrlObj._waitingPopup))
                ctrlObj._waitingPopup.hide();
            if (!ej.isNullOrUndefined(ctrlObj.model.pivotControl) && !ej.isNullOrUndefined(ctrlObj.model.pivotControl._waitingPopup))
                ctrlObj.model.pivotControl._waitingPopup.hide();
        },

        openPreventPanel: function(controlObj){
            var backgroundDiv = ej.buildTag("div#preventDiv.errorDlg").css({ "width": $('body').width() + "px", "height": $('body').height() + "px", "position": "absolute", "top": $('body').offset().top + "px", "left": $('body').offset().left + "px", "z-index": 10 })[0].outerHTML;
            $('#' + controlObj._id).append(backgroundDiv);
        },

        _createErrorDialog: function (args, action, obj) {
            ej.Pivot.closePreventPanel(obj);
            obj._errorDialog = action;
            ej.Pivot.openPreventPanel(obj);
            if (obj.element.find(".e-errorDialog:visible").length == 0) {
                if (!ej.isNullOrUndefined(args.Exception))
                    var dialogElem = ej.buildTag("div.e-errorDialog#ErrorDialog", ej.buildTag("div.warningImg")[0].outerHTML + ej.buildTag("div.warningContent action:", (args.Exception.Message))[0].outerHTML + ej.buildTag("br")[0].outerHTML + ej.buildTag("div." + obj._id + "stackTraceContent", "Stack Trace :" + args.Exception.StackTraceString)[0].outerHTML + ej.buildTag("div", ej.buildTag("button#ErrOKBtn.errOKBtn", obj._getLocalizedLabels("OK"), { "margin": "20px 0 10px 165px" }).attr("title", obj._getLocalizedLabels("OK").replace(/(<([^>]+)>)/ig, ""))[0].outerHTML)[0].outerHTML).attr("title", action)[0].outerHTML;
                else
                    var dialogElem = ej.buildTag("div.e-errorDialog#ErrorDialog", ej.buildTag("div.warningImg")[0].outerHTML + ej.buildTag("div.warningContent action:", (args))[0].outerHTML + ej.buildTag("div", ej.buildTag("button#ErrOKBtn.errOKBtn", obj._getLocalizedLabels("OK") , { "margin": "20px 0 10px 165px" }).attr("title", obj._getLocalizedLabels("OK").replace(/(<([^>]+)>)/ig, ""))[0].outerHTML)[0].outerHTML).attr("title", action)[0].outerHTML;
                obj.element.append(dialogElem);
                obj.element.find(".e-errorDialog").ejDialog({ target: "#" + obj._id, enableResize: false, enableRTL: obj.model.enableRTL, width: "400px", close: ej.proxy(ej.Pivot.closePreventPanel, obj) });
                var _errorDialog = obj.element.find(".e-errorDialog").data("ejDialog");
                $("#" + _errorDialog._id + "_wrapper").css({ left: "50%", top: "50%" });
                obj.element.find(".errOKBtn").ejButton({ type: ej.ButtonType.Button, width: "50px" }).on(ej.eventType.click, function (e) {
                    if (obj._errorDialog == "nodeCheck" && !ej.isNullOrUndefined(obj._schemaData) && !ej.isNullOrUndefined(obj._schemaData._selectedTreeNode))
                        obj._schemaData._tableTreeObj.uncheckNode(obj._schemaData._selectedTreeNode);
                    obj.element.find("#preventDiv").remove();
                    if (obj._errorDialog == obj._getLocalizedLabels("Success") || obj._errorDialog == obj._getLocalizedLabels("Warning") || obj._errorDialog == obj._getLocalizedLabels("Exception") || obj._errorDialog == obj._getLocalizedLabels("Error"))
                        obj.element.children("#ErrorDialog_wrapper").remove();
                });
                obj.element.find(".e-dialog .e-close").attr("title", "Close");
                if (!ej.isNullOrUndefined($("#" + obj._id).data("ejWaitingPopup"))) {
                    $("#" + obj._id).data("ejWaitingPopup").hide();
                }
                if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null)
                    oclientWaitingPopup.hide();

                if (!ej.isNullOrUndefined(args.Exception)) {
                    var showChar = 50;
                    var ellipsestext = "...";
                    var moretext = "Show more";
                    var lesstext = "Show less";
                    $('.' + obj._id + 'stackTraceContent').each(function () {
                        var content = $(this).html();
                        if (content.length > showChar) {
                            obj._id
                            var c = content.substr(0, showChar);
                            var h = content.substr(showChar, content.length - showChar);
                            var html = c + ej.buildTag("span." + obj._id + "moreellipses", ellipsestext)[0].outerHTML + ej.buildTag("span." + obj._id + "morecontent", ej.buildTag("span", h).css("display", "none")[0].outerHTML + ej.buildTag("a." + obj._id + "morelink", moretext).css("display", "block")[0].outerHTML)[0].outerHTML;
                            $(this).html(html);
                        }
                    });
                    $("." + obj._id + "morelink").click(function () {
                        if ($(this).hasClass("less")) {
                            $(this).removeClass("less");
                            $(this).html(moretext);
                        } else {
                            $(this).addClass("less");
                            $(this).html(lesstext);
                        }
                        $(this).parent().prev().toggle("slow", function () { });
                        $(this).prev().toggle("slow", function () { });
                        return false;
                    });
                }
            }
        },  
        
        _updateValueSortingIndex: function(msg,ctrlObj){
            if (msg.SortColIndex != undefined) {
                ej.PivotAnalysis._valueSorting = JSON.parse(msg.SortColIndex)[0];
                ej.PivotAnalysis._sort = ctrlObj.model.valueSortSettings.sortOrder;
            }
            else {
                msg = msg[0] != undefined ? msg : msg.d != undefined ? msg.d : msg;
                var valueSorting = $.map(msg, function (obj, index) { if (obj != null && obj.Key == "SortColIndex") return obj; });
                if (valueSorting.length > 0) {
                    msg.splice($.map(msg, function (obj, index) { if (obj.Key == "SortColIndex") return index; }), 1);
                    ej.PivotAnalysis._valueSorting = JSON.parse(valueSorting[0].Value);
                    ej.PivotAnalysis._sort = ctrlObj.model.valueSortSettings.sortOrder;
                }
                else {
                    ej.PivotAnalysis._valueSorting = null;
                }
            }
        },

        
            _memberSortBtnClick: function (args) {
                var isClientServer = (this.element.hasClass("e-pivotclient") && this.model.operationalMode == "servermode" && this.model.analysisMode == "olap");
                var modelObject = this.pluginName == "ejPivotSchemaDesigner" ? this.model.pivotControl : this;
                var isGridServer = this.pluginName == "ejPivotGrid" && modelObject.model.analysisMode == ej.Pivot.AnalysisMode.Olap && modelObject.model.operationalMode == ej.Pivot.OperationalMode.ServerMode;
                var treeView = $(args.target).parents(".e-memberEditorDiv").find(".e-editorTreeView");
                var sortType = this._sortType = $(args.target).hasClass("e-memberAscendingIcon") ? "ascending" : "descending";
                var drilledData = [];
                var drillDatasource = jQuery.extend(true, [], this._memberTreeObj._dataSource);
                if (this.element.find(".e-memberDrillPager").is(":visible")) {
                    var memberPageSize = this.model.memberEditorPageSize == undefined ? this.model.pivotControl.model.memberEditorPageSize : this.model.memberEditorPageSize;
                    drilledData = ej.Pivot._getParentsTreeList(this, this._drilledNode, this._editorTreeData).concat(ej.DataManager(this._editorDrillTreeData[this._drilledNode]).executeLocal(ej.Query().sortBy("name", this._sortType).page(this._memberDrillPageSettings.currentMemberDrillPage, memberPageSize)));
                }
                if (!ej.isNullOrUndefined(treeView) && treeView.length > 0) {
                    ej.Pivot.updateTreeView(this);
                    var dataSource = ((this.model.enableMemberEditorPaging || (!ej.isNullOrUndefined(this.model.pivotControl) && this.model.pivotControl.model.enableMemberEditorPaging)) && !this._isSearchApplied) ? this._editorTreeData : treeView.data("ejTreeView").model.fields.dataSource;// 
                    var newDataSource = (!isClientServer && (dataSource[0].id == "All" || dataSource[0].id == "(All)_0")) ? dataSource.slice(1) : dataSource;
                    if (drilledData.length > 0) {
                        newDataSource = drilledData;
                    }
                    if (newDataSource.length > 1 && newDataSource[0].id == "SearchFilterSelection")
                        newDataSource = newDataSource.slice(1);
                    var allMember = isClientServer ? [] : ((dataSource.length > 1 && (dataSource[0].id == "All" || dataSource[0].id == "(All)_0")) ? dataSource.splice(0, 1) : []);
                    var sortAll = ej.DataManager(newDataSource).executeLocal(ej.Query().sortBy("name", sortType));
                    if (!ej.isNullOrUndefined(allMember) && allMember.length > 0) {
                        sortAll.splice(0, 0, allMember[0]);
                        dataSource.splice(0, 0, allMember[0]);
                    }
                    if ((this.model.enableMemberEditorPaging || (!ej.isNullOrUndefined(this.model.pivotControl) && this.model.pivotControl.model.enableMemberEditorPaging))) {
                        if (drilledData.length == 0)
                            sortAll = ej.DataManager(sortAll).executeLocal(ej.Query().page(this._memberPageSettings.currentMemeberPage, (this.model.memberEditorPageSize || this.model.pivotControl.model.memberEditorPageSize)));
                    }
                   
                    if (modelObject.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && sortAll.length > 0 && (sortAll[0].id != "All" && sortAll[0].id != "(All)_0") && !ej.isNullOrUndefined(allMember) && allMember.length > 0)
                        sortAll.splice(0, 0, allMember[0]);
                    allMember = {};
                    if ((treeView.data("ejTreeView").model.fields.dataSource.length > 1 && treeView.data("ejTreeView").model.fields.dataSource[1].id == "SearchFilterSelection" && sortAll[1].id != "SearchFilterSelection"))
                        sortAll.splice(1, 0, { id: "SearchFilterSelection", name: this._getLocalizedLabels("AddCurrentSelectionToFilter"), checkedStatus: this._isSelectSearchFilter, tag: "SearchFilterSelection", spriteCssClass: "e-searchfilterselection", uniqueName: "Add current selection to filter" });
                    if (isClientServer && this._isSearchApplied)
                        sortAll.splice(0, 0, { id: "SearchFilterSelection", name: this._getLocalizedLabels("AddCurrentSelectionToFilter"), checkedStatus: this._isSelectSearchFilter, tag: "SearchFilterSelection", spriteCssClass: "e-searchfilterselection", uniqueName: "Add current selection to filter" });
                    if (!ej.isNullOrUndefined(treeView))
                        treeView.ejTreeView({
                            fields: {
                                dataSource: jQuery.extend(true, [], sortAll)
                            },
                     });

                    if (drilledData.length > 0 && !ej.isNullOrUndefined(drillDatasource)) {
                        this._memberTreeObj._dataSource = drillDatasource;
                    }
                    if (isGridServer) {
                        var treeViewElements = this.element.find(".e-editorTreeView").find("li");
                        for (var i = 0; i < treeViewElements.length; i++) {
                            if (!ej.isNullOrUndefined($(treeViewElements[i]).attr("id")))
                                $(treeViewElements[i]).attr("data-tag", ej.DataManager(treeView.data("ejTreeView").model.fields.dataSource).executeLocal(ej.Query().where("id", "equal", $(treeViewElements[i]).attr("id")))[0].tag);
                        }
                    }
                    ej.Pivot._separateAllMember(this);
                }
           },

        _contextMenuOpen: function (args, ctrlObj) {
            ej.Pivot.openPreventPanel(ctrlObj);
            ctrlObj._selectedMember = $(args.target);
            var mode;
            var menuObj;
            if(ctrlObj.pluginName == "ejPivotGrid"){
                mode = ctrlObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? "olap" : "pivot";
                menuObj = $("#pivotTree").data('ejMenu');
            }
            else {
                if (!ej.isNullOrUndefined(ctrlObj.model.pivotControl))
                mode = ctrlObj.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? "olap" : "pivot";
                menuObj = $("#" + ctrlObj._id + "_pivotTreeContextMenu").data('ejMenu');
            }
            if (mode == ej.Pivot.AnalysisMode.Olap) {
                if (ej.isNullOrUndefined($(args.target).parent().attr('data-tag'))) {
                    if ($(args.target).hasClass("e-pivotButton") && $(args.target).children(".e-pvtBtn:eq(0)").length > 0) {
                        menuObj.disable();
                        ctrlObj._selectedMember = $(args.target).children(".e-pvtBtn:eq(0)");
                        return false;
                    }
                }
                if (!ej.isNullOrUndefined($(args.target).parent().attr('data-tag')) && $(args.target).parent().attr('data-tag').split(":")[1].toLowerCase().startsWith("[measures]")) {          
                    menuObj.disable();
                }
                else if (!ej.isNullOrUndefined(ctrlObj._selectedMember.parent().attr('data-tag')) && ctrlObj._selectedMember.parent().attr('data-tag').split(":")[1].toLowerCase() == "measures") {
                    menuObj.disableItem(ctrlObj._getLocalizedLabels("AddToValues"));
                    menuObj.disableItem(ctrlObj._getLocalizedLabels("AddToFilter"));
                    menuObj.enableItem(ctrlObj._getLocalizedLabels("AddToRow"));
                    menuObj.enableItem(ctrlObj._getLocalizedLabels("AddToColumn"));
                }
                else if (!ej.isNullOrUndefined($(args.target).parent().attr('data-tag'))) {
                    menuObj.disableItem(ctrlObj._getLocalizedLabels("AddToValues"));
                    $(args.target.parentElement).find(".e-namedSetCDB").length > 0 ? menuObj.disableItem(ctrlObj._getLocalizedLabels("AddToFilter")) : menuObj.enableItem(ctrlObj._getLocalizedLabels("AddToFilter"));
                    menuObj.enableItem(ctrlObj._getLocalizedLabels("AddToRow"));
                    menuObj.enableItem(ctrlObj._getLocalizedLabels("AddToColumn"));
                }
                else
                    menuObj.disable();
            }
            else if (mode == ej.Pivot.AnalysisMode.Pivot) {
                var targetText = args.target.textContent;
                if ($(args.target).hasClass("e-btn")) {
                    menuObj.enable();
                    if (ctrlObj.pluginName == "ejPivotGrid") {
                        menuObj.disableItem(ctrlObj._getLocalizedLabels("CalculatedField"));
                        if (($(args.target).parents(".e-pivotButton").attr('data-tag').split(":")[0]).toLowerCase() == "values")
                        {
                            if (ctrlObj.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && $.grep(ctrlObj.model.dataSource.values, function (value) { return value.fieldCaption == targetText && value.isCalculatedField == true; }).length > 0)
                                menuObj.disable();
                            else if (ctrlObj.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && $.grep(JSON.parse(ctrlObj.getOlapReport()).PivotCalculations, function (value) { return value.FieldHeader == targetText && value.CalculationType == 8; }).length > 0)
                                menuObj.disable();
                            menuObj.enableItem(ctrlObj._getLocalizedLabels("CalculatedField"));
                        }
    			    }
                }
                else {
                    if ($("#pivotTree").length > 0) {
                        var menuObj = $("#pivotTree").data('ejMenu');
                        menuObj.disable();
                    }
                    else
                        menuObj.disable();
                }
            }
        },		

        _searchTreeNodes: function (args) {
            var inputObj = $(args.target).hasClass("searchTreeView") ? this.element.find(".searchTreeView").data("ejMaskEdit") : this.element.find(".searchEditorTreeView").data("ejMaskEdit");
            var treeobj = $(args.target).hasClass("searchTreeView") ? (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode || (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) ? this.element.find(".e-schemaFieldTree").data("ejTreeView") : this.element.find(".e-cubeTreeView").data("ejTreeView")) : this.element.find(".e-editorTreeView").data("ejTreeView");
            var searchSelectNode = { id: "SearchFilterSelection", name: this._getLocalizedLabels("AddCurrentSelectionToFilter"), hasChildren: false, checkedStatus: true, tag: "SearchFilterSelection", spriteCssClass: "e-searchfilterselection", uniqueName: "Add current selection to filter" };
            var treeElement = treeobj.element;
            var searchElement = treeElement.find("li[data-isItemSearch='true']");
            var searchVal = !ej.isNullOrUndefined(inputObj.get_StrippedValue()) ? inputObj.get_StrippedValue().toLowerCase() : "";

            if (searchElement.length > 0) {
                $(searchElement).each(function (index, item) { item.removeAttribute("data-isItemSearch"); });
            }
            if (searchVal.length > 0) {
                var matchedNode = [], otherNodes = [];
                var linkNodes = treeElement.find('ul>li>div>a');
                for (var p = 0; p < linkNodes.length; p++) {
                    if ($(linkNodes[p]).text().toLowerCase().indexOf(searchVal) != -1 || ($($(linkNodes[p]).closest("li")).attr("id") == "(All)_0" || $($(linkNodes[p]).closest("li")).attr("id") == "All") || $($(linkNodes[p]).closest("li")).attr("id") == "SearchFilterSelection")
                        matchedNode.push(linkNodes[p]);
                    else
                        otherNodes.push(linkNodes[p]);
                }
                var resultNodes = treeElement.find(matchedNode).closest("li").css("display", "block");
                if (resultNodes.length > 0) {
                    this._isOptionSearch = true;
                    $(resultNodes).each(function (index, item) { if ($(item).attr("id") != "SearchFilterSelection") item.setAttribute("data-isItemSearch", true); });
                    if (treeElement.hasClass("e-editorTreeView"))
                        if (!treeElement.find("li span.e-searchfilterselection").length > 0) {
                            if ((treeElement.find("li:first").attr("id") == "(All)_0" || treeElement.find("li:first").attr("id") == "All")) {
                                if (resultNodes.length > 1) treeobj.insertAfter(searchSelectNode, treeElement.find("li:first"));
                                if ((this.element.hasClass("e-pivotschemadesigner") ? this.model.pivotControl.model.analysisMode : this.model.analysisMode) == ej.Pivot.AnalysisMode.Pivot) treeElement.find("li span.e-searchfilterselection").closest("li").css("padding", "0");
                            }
                            else
                                treeobj.insertBefore(searchSelectNode, treeElement.find("li:first"));
                            //treeobj.checkNode(treeElement.find("li span.e-searchfilterselection").closest("li"));
                            treeElement.find("li span.e-searchfilterselection").closest("li").attr("data-tag", searchSelectNode.tag);
                        }
                        else if (treeElement.find("li span.e-searchfilterselection").length > 0 && !this._isSelectSearchFilter)
                            treeobj.uncheckNode(treeElement.find("li span.e-searchfilterselection").closest("li"));
                }
                treeElement.find(otherNodes).closest("li").css("display", "none");
                for (var i = 0; i < resultNodes.length; i++) {
                    var currentNode = $(resultNodes[i]);
                    var parentNode = currentNode.parents('ul').closest('li').css("display", "block");
                    if (parentNode.length > 0) {
                        treeobj.expandNode(parentNode);
                        if (treeobj.model.expandedNodes.indexOf($(treeobj._liList).index(parentNode)) == -1 && !ej.isNullOrUndefined(window._temp))
                            window._temp.push(parentNode);
                    }
                    var childrenUl = currentNode.children('ul');
                    if (childrenUl.length > 0 && childrenUl.children('li:visible').length == 0) {
                        currentNode.children('ul').children('li').css("display", "block");
                        treeobj.expandNode(resultNodes[i]);
                        if (treeobj.model.expandedNodes.indexOf($(treeobj._liList).index(resultNodes[i])) == -1 && !ej.isNullOrUndefined(window._temp))
                            window._temp.push(resultNodes[i]);
                    }
                }
            }
            else {
                treeElement.find('ul>li').css("display", "block");
                if (treeElement.find("li span.e-searchfilterselection").closest("li").length > 0)
                    treeobj.removeNode(treeElement.find("#SearchFilterSelection"));
                $(treeElement.find('ul>li')).each(function (index, item) { item.removeAttribute("data-isItemSearch"); });
                this._isOptionSearch = false;
                var itemMembers = $(treeElement).find('ul>li');
                var selectedItem = 0; var unselectedItem = 0;
                if ($($(itemMembers)[0]).attr("id") == "(All)_0" || $($(itemMembers)[0]).attr("id") == "All") {
                    for (var i = 1; i < $(itemMembers).length; i++) {
                        if ($($(itemMembers)[i]).find("span.e-checkmark").length > 0)
                            selectedItem++;
                        else
                            unselectedItem++;
                    }
                    if (selectedItem > 0 && unselectedItem > 0) $(treeElement.find('ul>li')[0]).find("div .e-chkbox-small > span > span:eq(0)").removeClass("e-checkmark").addClass("e-stop");
                    else if (selectedItem > 0 && unselectedItem == 0) $(treeElement.find('ul>li')[0]).find("div .e-chkbox-small > span > span:eq(0)").removeClass("e-stop").addClass("e-checkmark");
                    else $(treeElement.find('ul>li')[0]).find("div .e-chkbox-small > span > span:eq(0)").removeClass("e-checkmark").removeClass("e-stop");
                }
                if (!ej.isNullOrUndefined(window._temp))
                    for (var i = 0; i < window._temp.length; i++) {
                        treeobj._collpaseNode(window._temp[i]);
                    }
                window._temp = [];
                if ($(args.target).hasClass("searchTreeView"))
                  treeobj.collapseAll();
            }
        },

        _updateSearchFilterSelection: function (args, treeElement, ctrlObj) {
            if ($(args.currentElement).attr("id") == "SearchFilterSelection") {
                var searchElement = $(treeElement).find("li:not([data-isItemSearch='true'])");
                if (args.type == "nodeCheck") {
                    ctrlObj._isSelectSearchFilter = true;
                    if (ctrlObj._isOptionSearch) {
                        if (searchElement.length > 0) {
                            $(searchElement).each(function (index, item) {
                                if ($(item).attr("id") != "SearchFilterSelection")
                                    if (!ej.isNullOrUndefined(ctrlObj._currentFilterList[$(item).attr("id")]) && ctrlObj._currentFilterList[$(item).attr("id")].checkedStatus)
                                        $(treeElement).ejTreeView("checkNode", $(item));
                            });
                        }
                    }
                    else if (searchElement.length > 0) {
                        $(ctrlObj._editorTreeData).each(function (index, item) {
                            for (var i = 0; i < searchElement.length; i++) {
                                if (searchElement[i].id != item.id) {
                                    if (!ej.isNullOrUndefined(ctrlObj._currentFilterList)) item.checkedStatus = ctrlObj._currentFilterList[$(item).attr("id")].checkedStatus;
                                }
                                else {
                                    item.checkedStatus = $(searchElement[i]).find('.checked').length > 0 ? true : false;
                                    break;
                                }
                            }
                        });
                        var isAllFiltered = true;
                        $(ctrlObj._editorTreeData).each(function (index, item) {
                            if (item.checkedStatus) { isAllFiltered = false; return false; }
                        });
                        if (isAllFiltered && ctrlObj._editorTreeData.length > 0) {
                            ctrlObj._dialogOKBtnObj.disable();
                            ctrlObj.element.find(".e-dialogOKBtn").attr('disabled', 'disabled');
                        }
                        else {
                            ctrlObj._dialogOKBtnObj.enable();
                            ctrlObj.element.find(".e-dialogOKBtn").removeAttr("disabled");
                        }
                    }
                }
                else if (args.type == "nodeUncheck") {
                    ctrlObj._isSelectSearchFilter = false;
                    if (ctrlObj._isOptionSearch) {
                        if (searchElement.length > 0) {
                            $(searchElement).each(function (index, item) {
                                if ($(item).attr("id") != "SearchFilterSelection") $(treeElement).ejTreeView("uncheckNode", $(item));
                            });
                        }
                    }
                    else if (searchElement.length > 0) {                                                
                        $(ctrlObj._editorTreeData).each(function (index, item) {
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
                        var isAllFiltered = true;
                        $(ctrlObj._editorTreeData).each(function (index, item) {
                            if (item.checkedStatus) { isAllFiltered = false; return false; }
                        });
                        if (isAllFiltered && ctrlObj._editorTreeData.length > 0) {
                            ctrlObj._dialogOKBtnObj.disable();
                            ctrlObj.element.find(".e-dialogOKBtn").attr('disabled', 'disabled');
                        }
                        else {
                            ctrlObj._dialogOKBtnObj.enable();
                            ctrlObj.element.find(".e-dialogOKBtn").removeAttr("disabled");
                        }
                    }
                }
            }
        },
        editorTreeNavigatee: function (args, me) {
            if ($(args.target).parents(".e-memberPager").length > 0) {
                var currentPage = me._memberPageSettings.currentMemeberPage;
                if (!$(args.target).hasClass("e-pageDisabled")) {
                    if ($(args.target).hasClass("e-nextPage")) {
                        me._memberPageSettings.startPage += me.model.memberEditorPageSize;
                        me._memberPageSettings.currentMemeberPage += 1;
                        me._memberPageSettings.endPage += me.model.memberEditorPageSize;
                    }
                    else if ($(args.target).hasClass("e-prevPage")) {
                        me._memberPageSettings.currentMemeberPage -= 1;
                        me._memberPageSettings.startPage = Math.abs(me._memberPageSettings.startPage - (me._memberPageSettings.currentMemeberPage == 1 ? me.model.memberEditorPageSize : me.model.memberEditorPageSize));
                        me._memberPageSettings.endPage -= me.model.memberEditorPageSize;
                    }
                    else if ($(args.target).hasClass("e-firstPage")) {
                        me._memberPageSettings.currentMemeberPage = 1;
                        me._memberPageSettings.endPage = me.model.memberEditorPageSize;
                        me._memberPageSettings.startPage = 0;
                    }
                    else if ($(args.target).hasClass("e-lastPage")) {
                        me._memberPageSettings.currentMemeberPage = parseInt($.trim(me.element.find(".e-memberPageCount").text().split("/")[1]));
                        me._memberPageSettings.endPage = (me._memberPageSettings.currentMemeberPage * me.model.memberEditorPageSize);
                        me._memberPageSettings.startPage = (me._memberPageSettings.endPage - me.model.memberEditorPageSize);
                    }
                    else {
                        if (parseInt($(args.target).val()) > $.trim(me.element.find(".e-memberPageCount").text().split("/")[1]) || parseInt($(args.target).val()) == 0) {
                            me.element.find(".e-memberCurrentPage").val(currentPage);
                            return false;
                        }
                        else {
                            me._memberPageSettings.currentMemeberPage = parseInt($(args.target).val());
                            me._memberPageSettings.endPage = me._memberPageSettings.currentMemeberPage * me.model.memberEditorPageSize;
                            me._memberPageSettings.startPage = me._memberPageSettings.currentMemeberPage == 1 || me._memberPageSettings.currentMemeberPage == 0 ? 0 : (me._memberPageSettings.endPage - me.model.memberEditorPageSize);
                        }
                    }
                    me._waitingPopup.show();
                    if (me.element.hasClass("e-pivotclient") && me.model.analysisMode == ej.Pivot.AnalysisMode.Olap && me.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                        if (me.model.enableMemberEditorSorting)
                            me._editorTreeData = ej.DataManager(me._editorTreeData).executeLocal(ej.Query().sortBy("name", me._sortType));
                        this.editorTreePageInfoSuccess(me._editorTreeData, me);
                    }
                    else {
                        if (me.pluginName != "ejPivotSchemaDesigner")
                            me._isMemberPageFilter = true;
                        else
                            me.model.pivotControl._isMemberPageFilter = true;
                        var memberTreeObj = ej.Pivot.updateTreeView(me);
                        
                        var treeData = ej.DataManager(me._editorTreeData).executeLocal(ej.Query().sortBy("name", !ej.isNullOrUndefined(me._sortType) ? me._sortType : "").where(ej.Predicate("pid", "equal", null).and("id", "notequal", "All").and("id", "notequal", "(All)_0")).page(me._memberPageSettings.currentMemeberPage, me.pluginName == "ejPivotSchemaDesigner" ? me.model.pivotControl.model.memberEditorPageSize : me.model.memberEditorPageSize));
                        me._memberPageSettings.currentMemeberPage > 1 ? me.element.find(".e-prevPage, .e-firstPage").removeClass("e-pageDisabled").addClass("e-pageEnabled") : me.element.find(".e-prevPage, .e-firstPage").removeClass("e-pageEnabled").addClass("e-pageDisabled");
                        me._memberPageSettings.currentMemeberPage == parseInt($.trim(me.element.find(".e-memberPageCount").text().split("/")[1])) ? me.element.find(".e-nextPage, .e-lastPage").removeClass("e-pageEnabled").addClass("e-pageDisabled") : me.element.find(".e-nextPage, .e-lastPage").removeClass("e-pageDisabled").addClass("e-pageEnabled");
                        me.element.find(".e-memberCurrentPage").val(me._memberPageSettings.currentMemeberPage);
                        me.element.find(".e-nextPageDiv .e-pageDisabled").css("opacity", "0.5");
                        me.element.find(".e-nextPageDiv .e-pageEnabled").css("opacity", "1");
                        ej.Pivot._createSearchTreeview(treeData, me);
                        me._waitingPopup.hide();
                    }
                }
            }
            else if ($(args.target).parents(".e-memberSearchPager").length > 0)
            {
                var currentPage = me._memberSearchPageSettings.currentMemberSearchPage;
                if (!$(args.target).hasClass("e-pageDisabled")) {
                    if ($(args.target).hasClass("e-nextPage")) {
                        me._memberSearchPageSettings.startSearchPage += me.model.memberEditorPageSize;
                        me._memberSearchPageSettings.currentMemberSearchPage += 1;
                        me._memberSearchPageSettings.endSearchPage += me.model.memberEditorPageSize;
                    }
                    else if ($(args.target).hasClass("e-prevPage")) {
                        me._memberSearchPageSettings.currentMemberSearchPage -= 1;
                        me._memberSearchPageSettings.startSearchPage = Math.abs(me._memberSearchPageSettings.startSearchPage - (me._memberSearchPageSettings.currentMemberSearchPage == 1 ? me.model.memberEditorPageSize : me.model.memberEditorPageSize));
                        me._memberSearchPageSettings.endSearchPage -= me.model.memberEditorPageSize;
                    }
                    else if ($(args.target).hasClass("e-firstPage")) {
                        me._memberSearchPageSettings.currentMemberSearchPage = 1;
                        me._memberSearchPageSettings.endSearchPage = me.model.memberEditorPageSize;
                        me._memberSearchPageSettings.startSearchPage = 0;
                    }
                    else if ($(args.target).hasClass("e-lastPage")) {
                        me._memberSearchPageSettings.currentMemberSearchPage = parseInt($.trim(me.element.find(".e-memberSearchPageCount").text().split("/")[1]));
                        me._memberSearchPageSettings.endSearchPage = (me._memberSearchPageSettings.currentMemberSearchPage * me.model.memberEditorPageSize);
                        me._memberSearchPageSettings.startSearchPage = (me._memberSearchPageSettings.endSearchPage - me.model.memberEditorPageSize);
                    }
                    else {
                        if (parseInt($(args.target).val()) > $.trim(me.element.find(".e-memberSearchPageCount").text().split("/")[1]) || parseInt($(args.target).val()) == 0) {
                            me.element.find(".e-memberCurrentSearchPage").val(currentPage);
                            return false;
                        }
                        else {
                            me._memberSearchPageSettings.currentMemberSearchPage = parseInt($(args.target).val());
                            me._memberSearchPageSettings.endSearchPage = me._memberSearchPageSettings.currentMemberSearchPage * me.model.memberEditorPageSize;
                            me._memberSearchPageSettings.startSearchPage = me._memberSearchPageSettings.currentMemberSearchPage == 1 || me._memberSearchPageSettings.currentMemberSearchPage == 0 ? 0 : (me._memberSearchPageSettings.endSearchPage - me.model.memberEditorPageSize);
                        }
                    }
                    me._waitingPopup.show();
                    if (me.element.hasClass("e-pivotclient") && me.model.analysisMode == ej.Pivot.AnalysisMode.Olap && me.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                        this._editorTreeSearchPageInfoSuccess(me._editorSearchTreeData, me);
                    }
                    else {
                        if (me.pluginName != "ejPivotSchemaDesigner")
                            me._isMemberPageFilter = true;
                        else
                            me.model.pivotControl._isMemberPageFilter = true;
                        this._editorTreeSearchPageInfoSuccess(me._editorSearchTreeData, me);
                    }
                }
            }
            else if ($(args.target).parents(".e-memberDrillPager").length > 0) {
                var currentPage = me._memberDrillPageSettings.currentMemberDrillPage;
                if (!$(args.target).hasClass("e-pageDisabled")) {
                    if ($(args.target).hasClass("e-nextPage")) {
                        me._memberDrillPageSettings.startDrillPage += me.model.memberEditorPageSize;
                        me._memberDrillPageSettings.currentMemberDrillPage += 1;
                        me._memberDrillPageSettings.endDrillPage += me.model.memberEditorPageSize;
                    }
                    else if ($(args.target).hasClass("e-prevPage")) {
                        me._memberDrillPageSettings.currentMemberDrillPage -= 1;
                        me._memberDrillPageSettings.startDrillPage = Math.abs(me._memberDrillPageSettings.startDrillPage - (me._memberDrillPageSettings.currentMemberDrillPage == 1 ? me.model.memberEditorPageSize : me.model.memberEditorPageSize));
                        me._memberDrillPageSettings.endDrillPage -= me.model.memberEditorPageSize;
                    }
                    else if ($(args.target).hasClass("e-firstPage")) {
                        me._memberDrillPageSettings.currentMemberDrillPage = 1;
                        me._memberDrillPageSettings.endDrillPage = me.model.memberEditorPageSize;
                        me._memberDrillPageSettings.startDrillPage = 0;
                    }
                    else if ($(args.target).hasClass("e-lastPage")) {
                        me._memberDrillPageSettings.currentMemberDrillPage = parseInt($.trim(me.element.find(".e-memberDrillPageCount").text().split("/")[1]));
                        me._memberDrillPageSettings.endDrillPage = (me._memberDrillPageSettings.currentMemberDrillPage * me.model.memberEditorPageSize);
                        me._memberDrillPageSettings.startDrillPage = (me._memberDrillPageSettings.endDrillPage - me.model.memberEditorPageSize);
                    }
                    else {
                        if (parseInt($(args.target).val()) > $.trim(me.element.find(".e-memberDrillPageCount").text().split("/")[1]) || parseInt($(args.target).val()) == 0) {
                            me.element.find(".e-memberCurrentDrillPage").val(currentPage);
                            return false;
                        }
                        else {
                            me._memberDrillPageSettings.currentMemberDrillPage = parseInt($(args.target).val());
                            me._memberDrillPageSettings.endDrillPage = me._memberDrillPageSettings.currentMemberDrillPage * me.model.memberEditorPageSize;
                            me._memberDrillPageSettings.startDrillPage = me._memberDrillPageSettings.currentMemberDrillPage == 1 || me._memberDrillPageSettings.currentMemberDrillPage == 0 ? 0 : (me._memberDrillPageSettings.endDrillPage - me.model.memberEditorPageSize);
                        }
                    }
                    me._waitingPopup.show();                  
                    this._editorTreeDrillPageInfoSuccess(me._memberTreeObj._dataSource.slice(), me);
                }
            }
        },

        editorTreePageInfoSuccess: function (editorTree, me) {
            setTimeout(function () {
                me._memberPageSettings.currentMemeberPage > 1 ? me.element.find(".e-prevPage, .e-firstPage").removeClass("e-pageDisabled").addClass("e-pageEnabled") : me.element.find(".e-prevPage, .e-firstPage").removeClass("e-pageEnabled").addClass("e-pageDisabled");
                me._memberPageSettings.currentMemeberPage == parseInt($.trim(me.element.find(".e-memberPageCount").text().split("/")[1])) ? me.element.find(".e-nextPage, .e-lastPage").removeClass("e-pageEnabled").addClass("e-pageDisabled") : me.element.find(".e-nextPage, .e-lastPage").removeClass("e-pageDisabled").addClass("e-pageEnabled");
                var editorTreeInfo, treeViewData;
                if (me.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                    if (editorTree[0] != undefined)
                        editorTreeInfo = editorTree[0].Value;
                    else if (editorTree.d != undefined)
                        editorTreeInfo = editorTree.d[0].Value;
                    else
                        editorTreeInfo = editorTree.EditorTreeInfo;
                    treeViewData = $.parseJSON(editorTreeInfo);
                    treeViewData.splice(-1, 1);
                }
                me.element.find(".e-memberCurrentPage").val(me._memberPageSettings.currentMemeberPage);                
                me._appendTreeViewData(me.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? treeViewData : ej.DataManager(me._editorTreeData).executeLocal(ej.Query().where("pid", "equal", null || undefined).page(me._memberPageSettings.currentMemeberPage, me.pluginName == "ejPivotSchemaDesigner" ? me.model.pivotControl.model.memberEditorPageSize : me.model.memberEditorPageSize)), me.element.find(".pvtBtn").parent("[data-tag='Slicers:" + me._selectedFieldName.replace(/\[/g, "").replace(/\]/g, "") + "']").length > 0);
                me._waitingPopup.hide();
            }, 0);
        },
        _editorTreeDrillPageInfoSuccess: function (editorTree, me) {
            setTimeout(function () {
                me._memberDrillPageSettings.currentMemberDrillPage > 1 ? me.element.find(".e-memberDrillPager").find(".e-prevPage, .e-firstPage").removeClass("e-pageDisabled").addClass("e-pageEnabled") : me.element.find(".e-memberDrillPager").find(".e-prevPage, .e-firstPage").removeClass("e-pageEnabled").addClass("e-pageDisabled");
                me._memberDrillPageSettings.currentMemberDrillPage == parseInt($.trim(me.element.find(".e-memberDrillPageCount").text().split("/")[1])) ? me.element.find(".e-memberDrillPager").find(".e-nextPage, .e-lastPage").removeClass("e-pageEnabled").addClass("e-pageDisabled") : me.element.find(".e-memberDrillPager").find(".e-nextPage, .e-lastPage").removeClass("e-pageDisabled").addClass("e-pageEnabled");
                var editorTreeInfo, treeViewData;
                me.element.find(".e-memberCurrentDrillPage").val(me._memberDrillPageSettings.currentMemberDrillPage);                
                var lastParentIndex = 0;
                if (editorTree.length > 0 && editorTree[0].length > 0 && editorTree[0][0].id == "All") editorTree[0].splice(0, 1);
                $.each(editorTree, function (index, value) { if (value.length == 1 && value[0].expanded) lastParentIndex = index; else return false; });
                var DrillResultNodes = [];
                if (me.model.enableMemberEditorSorting && me._sortType) {
                    //me._editorTreeData = ej.DataManager(me._editorTreeData).executeLocal(ej.Query().sortBy("name", me._sortType));
                    DrillResultNodes = ej.DataManager(ej.DataManager(me._editorTreeData).executeLocal(ej.Query().where("pid", "equal", editorTree[lastParentIndex][0].id).sortBy("name", me._sortType))).executeLocal(ej.Query().where("pid", "notequal", null || undefined).page(me._memberDrillPageSettings.currentMemberDrillPage, me.pluginName == "ejPivotSchemaDesigner" ? me.model.pivotControl.model.memberEditorPageSize : me.model.memberEditorPageSize));
                }
                else
                    DrillResultNodes = ej.DataManager(ej.DataManager(me._editorTreeData).executeLocal(ej.Query().where("pid", "equal", editorTree[lastParentIndex][0].id))).executeLocal(ej.Query().where("pid", "notequal", null || undefined).page(me._memberDrillPageSettings.currentMemberDrillPage, me.pluginName == "ejPivotSchemaDesigner" ? me.model.pivotControl.model.memberEditorPageSize : me.model.memberEditorPageSize));
                //if (me.model.enableMemberEditorSorting)
                //    DrillResultNodes = ej.DataManager(DrillResultNodes).executeLocal(ej.Query().sortBy("name", me._sortType));
                me._editorDrillTreePageSettings[editorTree[lastParentIndex][0].id] = $.extend(true, {}, me._memberDrillPageSettings);
                if (me.element.find(".e-memberDrillPager").find(".e-nextPageDiv").length > 0) {
                    treeViewData = ej.Pivot._getParentsTreeList(me, editorTree[lastParentIndex][0].id, me._editorTreeData).concat(DrillResultNodes);
                    me.pluginName != "ejPivotClient" ? ej.Pivot._createSearchTreeview(treeViewData, me) : me._appendTreeViewData(treeViewData, me.element.find(".pvtBtn").parent("[data-tag='Slicers:" + me._selectedFieldName.replace(/\[/g, "").replace(/\]/g, "") + "']").length > 0);
                }
                else
                    me.pluginName != "ejPivotClient" ? ej.Pivot._createSearchTreeview(DrillResultNodes, me) : me._appendTreeViewData(DrillResultNodes, me.element.find(".pvtBtn").parent("[data-tag='Slicers:" + me._selectedFieldName.replace(/\[/g, "").replace(/\]/g, "") + "']").length > 0);
                me._waitingPopup.hide();
            }, 0);
        },
        _editorTreeSearchPageInfoSuccess: function (editorTree, me) {
            setTimeout(function () {
                var memberEditorPageSize = me.pluginName == "ejPivotSchemaDesigner" ? me.model.pivotControl.model.memberEditorPageSize : me.model.memberEditorPageSize;
                me._memberSearchPageSettings.currentMemberSearchPage > 1 ? me.element.find(".e-memberSearchPager").find(".e-prevPage, .e-firstPage").removeClass("e-pageDisabled").addClass("e-pageEnabled") : me.element.find(".e-memberSearchPager").find(".e-prevPage, .e-firstPage").removeClass("e-pageEnabled").addClass("e-pageDisabled");
                me._memberSearchPageSettings.currentMemberSearchPage == parseInt($.trim(me.element.find(".e-memberSearchPageCount").text().split("/")[1])) ? me.element.find(".e-memberSearchPager").find(".e-nextPage, .e-lastPage").removeClass("e-pageEnabled").addClass("e-pageDisabled") : me.element.find(".e-memberSearchPager").find(".e-nextPage, .e-lastPage").removeClass("e-pageDisabled").addClass("e-pageEnabled");
                var editorTreeInfo, treeViewData;
                editorTree = ej.DataManager(editorTree).executeLocal(ej.Query().where(ej.Predicate("id", "notequal", "(All)_0").and("id", "notequal", "All"))).slice((me._memberSearchPageSettings.currentMemberSearchPage - 1) * memberEditorPageSize, (((me._memberSearchPageSettings.currentMemberSearchPage - 1) * memberEditorPageSize) + memberEditorPageSize));
                for (var i = 0; i < editorTree.length; i++) {
                    if (!ej.isNullOrUndefined(editorTree[i].pid))
                        editorTree[i].parentId = editorTree[i].pid;
                }
                for (var i = 0; i < editorTree.length; i++) {
                    ej.Pivot._appendParentNodes(editorTree, editorTree[i], me);
                }
                me.element.find(".e-memberCurrentSearchPage").val(me._memberSearchPageSettings.currentMemberSearchPage);
                editorTree.splice(0, 0, { id: "SearchFilterSelection", name: me._getLocalizedLabels("AddCurrentSelectionToFilter"), checkedStatus: me._isSelectSearchFilter, tag: "SearchFilterSelection", spriteCssClass: "e-searchfilterselection", uniqueName: "Add current selection to filter" });
                if (me.pluginName == "ejPivotClient" && me.model.analysisMode == ej.Pivot.AnalysisMode.Olap && me.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                    me._appendTreeViewData(editorTree, me.element.find(".pvtBtn").parent("[data-tag='Slicers:" + me._selectedFieldName.replace(/\[/g, "").replace(/\]/g, "") + "']").length > 0);
                else
                    ej.Pivot._createSearchTreeview(editorTree, me);
                me._waitingPopup.hide();
                me._parentNodeCollection = {};
                me._parentSearchNodeCollection = {};
            }, 0);
        },
        _drillEditorTreeNode: function (editorDrillParams, ctrlObj, memberEditorPageSize) {
            ctrlObj._waitingPopup.show();
            var treeData = editorDrillParams.childNodes;
            if (ctrlObj._isEditorDrillPaging && !ctrlObj._isEditorCollapseDrillPaging) {
                if (ctrlObj.element.find(".e-memberDrillPager").find(".e-nextPageDiv").length > 0) {
                    ctrlObj._memberDrillPageSettings = { currentMemberDrillPage: 1, startDrillPage: 0, endDrillPage: 0 };
                    if (!ej.isNullOrUndefined(editorDrillParams['parentNode'].id)) {
                        ctrlObj._editorDrillTreeData[editorDrillParams['parentNode'].id] = treeData.slice();
                        ctrlObj._editorDrillTreePageSettings[editorDrillParams['parentNode'].id] = $.extend(true, {}, ctrlObj._memberDrillPageSettings);
                    }
                    this._refreshDrillEditorPager(editorDrillParams, ctrlObj, memberEditorPageSize);
                }
            }
            else if (ctrlObj._isEditorCollapseDrillPaging) {
                if (ctrlObj.element.find(".e-memberDrillPager").find(".e-nextPageDiv").length > 0) {
                    ctrlObj._isEditorCollapseDrillPaging = false;
                    ctrlObj._memberDrillPageSettings = !ej.isNullOrUndefined(editorDrillParams['parentNode'].id) ? editorDrillParams.drillPageSettings[editorDrillParams['parentNode'].id] : editorDrillParams.drillPageSettings;
                }
                this._refreshDrillEditorPager(editorDrillParams, ctrlObj, memberEditorPageSize);
            }
            var treeViewData = [];;
            ctrlObj._drilledNode = (editorDrillParams['parentNode'].id);
            treeViewData = !ej.isNullOrUndefined(editorDrillParams['parentNode'].id) ? this._getParentsTreeList(ctrlObj, editorDrillParams.parentNode.id, ctrlObj._editorTreeData).concat(ej.DataManager(treeData).executeLocal(ej.Query().where("pid", "notequal", null || undefined).page(ctrlObj._memberDrillPageSettings.currentMemberDrillPage, memberEditorPageSize))) : editorDrillParams.parentNode.concat(editorDrillParams.childNodes);;
            if (ctrlObj.pluginName == "ejPivotClient" && ctrlObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap && ctrlObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                ctrlObj._appendTreeViewData(treeViewData, ctrlObj.element.find(".pvtBtn").parent("[data-tag='Slicers:" + ctrlObj._selectedFieldName.replace(/\[/g, "").replace(/\]/g, "") + "']").length > 0);
            else
                ej.Pivot._createSearchTreeview(treeViewData, ctrlObj);
            
            ctrlObj._waitingPopup.hide();
        },
        _refreshDrillEditorPager: function (editorDrillParams, ctrlObj, memberEditorPageSize) {
            ctrlObj.element.find(".e-memberPager,.e-memberSearchPager").css("display", "none");
            ctrlObj.element.find(".e-memberDrillPager").css("display", "block");
            var memberCount = editorDrillParams.childNodes.length;
            var pageCount = (memberCount / memberEditorPageSize);
            if (pageCount != Math.round(pageCount))
                pageCount = parseInt(pageCount) + 1;
            if (ctrlObj._memberDrillPageSettings.currentMemberDrillPage == pageCount)
                ctrlObj.element.find(".e-memberDrillPager").find(".e-nextPage, .e-lastPage").addClass("disabled");
            ctrlObj.element.find(".e-memberDrillPageCount").html("/ " + pageCount);
            ctrlObj.element.find(".e-memberCurrentDrillPage").val(ctrlObj._memberDrillPageSettings.currentMemberDrillPage);
            ctrlObj._memberDrillPageSettings.currentMemberDrillPage > 1 ? ctrlObj.element.find(".e-memberDrillPager").find(".e-prevPage, .e-firstPage").removeClass("e-pageDisabled").addClass("e-pageEnabled") : ctrlObj.element.find(".e-memberDrillPager").find(".e-prevPage, .e-firstPage").removeClass("e-pageEnabled").addClass("e-pageDisabled");
            ctrlObj._memberDrillPageSettings.currentMemberDrillPage == parseInt($.trim(ctrlObj.element.find(".e-memberDrillPageCount").text().split("/")[1])) ? ctrlObj.element.find(".e-memberDrillPager").find(".e-nextPage, .e-lastPage").removeClass("e-pageEnabled").addClass("e-pageDisabled") : ctrlObj.element.find(".e-memberDrillPager").find(".e-nextPage, .e-lastPage").removeClass("e-pageDisabled").addClass("e-pageEnabled");
            editorDrillParams.childNodes = editorDrillParams.childNodes.slice((ctrlObj._memberDrillPageSettings.currentMemberDrillPage - 1) * memberEditorPageSize, ctrlObj._memberDrillPageSettings.currentMemberDrillPage * memberEditorPageSize);
        },
        _getParentsTreeList: function (ctrlObj, parentId, editorTreeData) {
            var ancestors = [];
            do {
                parentNodes = ej.DataManager(editorTreeData).executeLocal(ej.Query().where("id", "equal", parentId));
                var isChildNodes = !ej.isNullOrUndefined(parentNodes) && parentNodes.length > 0 && !ej.isNullOrUndefined(parentNodes[0].pid);
                ancestors.push(new ej.Predicate("id", 'equal', parentId));
                parentId = isChildNodes ? parentNodes[0].pid : null;
            } while (!ej.isNullOrUndefined(parentId));
            return ej.DataManager(editorTreeData).executeLocal(ej.Query().where(ej.Predicate.or(ancestors)));
        },
        _onNodeCollapse: function (args) {
            var controlObj = ej.isNullOrUndefined(args.olapCtrlObj) ? this : args.olapCtrlObj, isChildHasPaging = false;
            var pageSettings = {                
                memberEditorPageSize: controlObj.pluginName == "ejPivotSchemaDesigner" ? controlObj.model.pivotControl.model.memberEditorPageSize : controlObj.model.memberEditorPageSize,
                enableMemberEditorPaging: controlObj.pluginName == "ejPivotSchemaDesigner" ? controlObj.model.pivotControl.model.enableMemberEditorPaging : controlObj.model.enableMemberEditorPaging
            };
            jQuery.each(controlObj._editorTreeData, function (index, value) { if (value.id == args.id) { if (!ej.isNullOrUndefined(value.pid)) args.parentId = value.pid; value.expanded = false; } else if (value.pid == args.id) { if (!ej.isNullOrUndefined(controlObj._editorDrillTreeData[value.id])) isChildHasPaging = true; } });
            if (pageSettings.enableMemberEditorPaging && (isChildHasPaging || !ej.isNullOrUndefined(controlObj._editorDrillTreeData[args.id]) || args.parentId == "")) {
                controlObj.element.find(".searchEditorTreeView").data("ejMaskEdit").clear();
                controlObj._lastSavedTree = [];
                controlObj._isEditorDrillPaging = false;                
                if (controlObj.element.find(".e-memberPager").length > 0) {
                    controlObj.element.find(".e-memberPager").css("display", "block");
                    controlObj.element.find(".e-memberDrillPager,.e-memberSearchPager").css("display", "none");
                }
                else {
                    controlObj.element.find(".e-memberDrillPager, .e-memberSearchPager").css("display", "none");
                }
                var ancestors = [], parentId = args.parentId, childCountFlows = false, locked = false, lockedParentId = "";
                if (!ej.isNullOrUndefined(parentId) && parentId != "") {
                    do {
                        parentNodes = ej.DataManager(controlObj._editorTreeData).executeLocal(ej.Query().where("id", "equal", parentId));
                        childCountFlows = (childCountFlows || (pageSettings.memberEditorPageSize <= ej.DataManager(controlObj._editorTreeData).executeLocal(ej.Query().where("pid", "equal", parentId)).length)) ? true : false;
                        ancestors.push(new ej.Predicate((childCountFlows ? "id" : "pid"), 'equal', parentId));
                        if (!locked && childCountFlows && pageSettings.memberEditorPageSize < ej.DataManager(controlObj._editorTreeData).executeLocal(ej.Query().where("pid", "equal", parentId)).length) {
                            locked = true; lockedParentId = parentId;
                        }
                        parentId = parentNodes[0].pid;
                    } while (!ej.isNullOrUndefined(parentId));
                    childCountFlows ? ancestors.push(new ej.Predicate("id", 'equal', args.parentId)) : ancestors.push(new ej.Predicate("pid", 'equal', null || undefined));
                }
                if (childCountFlows) {
                    ej.Pivot._makeAncestorsExpandable(controlObj, args.parentId);
                    controlObj._isEditorCollapseDrillPaging = true;
                    var editorDrillParams = { drillPageSettings: (ej.isNullOrUndefined(controlObj._editorDrillTreePageSettings[lockedParentId]) && controlObj.pluginName == "ejPivotSchemaDesigner") ? controlObj.model.pivotControl._editorDrillTreePageSettings[lockedParentId] : controlObj._editorDrillTreePageSettings[lockedParentId], parentNode: ej.DataManager($.extend(true, [], controlObj._editorTreeData)).executeLocal(ej.Query().where(ej.Predicate.or(ancestors))), childNodes: ej.DataManager($.extend(true, [], controlObj._editorTreeData)).executeLocal(ej.Query().where("pid", "equal", lockedParentId)) };
                    editorDrillParams.parentNode = $.grep(editorDrillParams.parentNode, function (pNodes) {
                        var isDuplicate = false;
                        $.each(editorDrillParams.childNodes, function (idx, cNodes) {
                            if (cNodes.id == pNodes.id) {
                                cNodes.expanded = true; isDuplicate = true;
                            }
                        });
                        return !isDuplicate;
                    });
                    ej.Pivot._drillEditorTreeNode(editorDrillParams, controlObj, pageSettings.memberEditorPageSize);
                }
                else {
                    if (controlObj.model.enableMemberEditorSorting)
                        controlObj._editorTreeData = ej.DataManager(controlObj._editorTreeData).executeLocal(ej.Query().sortBy("name", controlObj._sortType));
                    if (ancestors.length == 0)
                        ancestors.push(new ej.Predicate("pid", 'equal', null || undefined));
                    if (controlObj.element.find(".e-memberPager").length > 0)
                        controlObj.pluginName != "ejPivotClient" ? ej.Pivot._createSearchTreeview(ej.DataManager(controlObj._editorTreeData).executeLocal(ej.Query().where(ej.Predicate.or(ancestors)).page(controlObj._memberPageSettings.currentMemeberPage, pageSettings.memberEditorPageSize)), controlObj) : controlObj._appendTreeViewData(ej.DataManager(controlObj._editorTreeData).executeLocal(ej.Query().where(ej.Predicate.or(ancestors)).page(controlObj._memberPageSettings.currentMemeberPage, pageSettings.memberEditorPageSize)), controlObj.element.find(".pvtBtn").parent("[data-tag='Slicers:" + controlObj._selectedFieldName.replace(/\[/g, "").replace(/\]/g, "") + "']").length > 0);
                    else
                        controlObj.pluginName != "ejPivotClient" ? ej.Pivot._createSearchTreeview(ej.DataManager(controlObj._editorTreeData).executeLocal(ej.Query().where(ej.Predicate.or(ancestors))), controlObj) : controlObj._appendTreeViewData(ej.DataManager(controlObj._editorTreeData).executeLocal(ej.Query().where(ej.Predicate.or(ancestors))), controlObj.element.find(".pvtBtn").parent("[data-tag='Slicers:" + controlObj._selectedFieldName.replace(/\[/g, "").replace(/\]/g, "") + "']").length > 0);
                }
            }
        },
        _searchEditorTreeNodes: function (args, ctrlObj) {
            if (ej.isNullOrUndefined(window.event) ? (args.which == 0 || args.which == 13) : (window.event.which == 0 || window.event.which == 13))
                return;
            if (!ej.isNullOrUndefined(ctrlObj._waitingPopup.element)) ctrlObj._waitingPopup.show();
            var _this = this;
            setTimeout(function () {
                var pageSettings = {
                    memberEditorPageSize: ctrlObj.pluginName == "ejPivotSchemaDesigner" ? ctrlObj.model.pivotControl.model.memberEditorPageSize : ctrlObj.model.memberEditorPageSize,
                    enableMemberEditorPaging: ctrlObj.pluginName == "ejPivotSchemaDesigner" ? ctrlObj.model.pivotControl.model.enableMemberEditorPaging : ctrlObj.model.enableMemberEditorPaging
                };
                var searchVal = "";
                if (ctrlObj.pluginName == "ejPivotClient" && !ej.isNullOrUndefined(ctrlObj._pivotSchemaDesigner)) {
                    if (ej.isNullOrUndefined(ctrlObj._pivotSchemaDesigner.element.find(".searchEditorTreeView")) || ctrlObj._pivotSchemaDesigner.element.find(".searchEditorTreeView").length == 0) return false;
                    searchVal = !ej.isNullOrUndefined($.trim(ctrlObj._pivotSchemaDesigner.element.find(".searchEditorTreeView").val())) ? $.trim(ctrlObj._pivotSchemaDesigner.element.find(".searchEditorTreeView").val()).toLowerCase() : "";
                }
                else {
                    if (ej.isNullOrUndefined(ctrlObj.element.find(".searchEditorTreeView")) || ctrlObj.element.find(".searchEditorTreeView").length == 0) return false;
                    searchVal = !ej.isNullOrUndefined($.trim(ctrlObj.element.find(".searchEditorTreeView").val())) ? $.trim(ctrlObj.element.find(".searchEditorTreeView").val()).toLowerCase() : "";
                }

                if (searchVal != "") {
                    var searchTreeNodes = jQuery.extend(true, [], ej.DataManager(ctrlObj._editorTreeData).executeLocal(ej.Query().where("name", "contains", searchVal, true).sortBy("name", !ej.isNullOrUndefined(ctrlObj._sortType) ? ctrlObj._sortType :"")));
                    var searchPagedTreeNodes = $.extend(true, [], searchTreeNodes.slice(0, pageSettings.memberEditorPageSize + 1));
                    var searchTreeSlicedItems = pageSettings.enableMemberEditorPaging ? searchPagedTreeNodes : searchTreeNodes;
                    //searchTreeNodes = [];
                    for (var i = 0; i < searchTreeSlicedItems.length; i++) {
                        if (!ej.isNullOrUndefined(searchTreeSlicedItems[i].pid))
                            searchTreeSlicedItems[i].parentId = searchTreeSlicedItems[i].pid;
                    }
                    for (var i = 0; i < searchTreeSlicedItems.length; i++) {
                        //childNodes[i].expanded = false;
                        _this._appendParentNodes(searchTreeSlicedItems, searchTreeSlicedItems[i], ctrlObj);
                    }
                    ctrlObj._isSearchApplied = true;
                    if (searchTreeNodes.length > 0) {
                        ctrlObj._isSelectSearchFilter = true;
                        if (pageSettings.enableMemberEditorPaging && (ctrlObj.element.find(".e-memberSearchPager").find(".e-nextPageDiv").length > 0 || ctrlObj.element.find(".e-memberDrillPager").find(".e-nextPageDiv").length > 0)) {
                            ctrlObj._memberSearchPageSettings.currentMemberSearchPage = 1;
                            ctrlObj._memberSearchPageSettings.startSearchPage = 0;
                            ctrlObj._memberSearchPageSettings.endSearchPage = 0;
                            ctrlObj.element.find(".e-memberPager,.e-memberDrillPager").css("display", "none");
                            ctrlObj._editorSearchTreeData = searchTreeNodes.slice();
                            var memberCount = ej.DataManager(searchTreeNodes).executeLocal(ej.Query().where(ej.Predicate("id", "notequal", "(All)_0").and("id", "notequal", "All"))).length;
                            var pageCount = (memberCount / pageSettings.memberEditorPageSize);
                            if (pageCount != Math.round(pageCount))
                                pageCount = parseInt(pageCount) + 1;
                            if (pageCount > 1)
                                ctrlObj.element.find(".e-memberSearchPager").css("display", "block");
                            if (ctrlObj._memberSearchPageSettings.currentMemberSearchPage == pageCount)
                                ctrlObj.element.find(".e-memberSearchPager").find(".e-nextPage, .e-lastPage").addClass("disabled");
                            ctrlObj.element.find(".e-memberSearchPageCount").html("/ " + pageCount);
                            ctrlObj.element.find(".e-memberCurrentSearchPage").val(ctrlObj._memberSearchPageSettings.currentMemberSearchPage);
                            ctrlObj._memberSearchPageSettings.currentMemberSearchPage > 1 ? ctrlObj.element.find(".e-memberSearchPager").find(".e-prevPage, .e-firstPage").removeClass("e-pageDisabled").addClass("e-pageEnabled") : ctrlObj.element.find(".e-memberSearchPager").find(".e-prevPage, .e-firstPage").removeClass("e-pageEnabled").addClass("e-pageDisabled");
                            ctrlObj._memberSearchPageSettings.currentMemberSearchPage == parseInt($.trim(ctrlObj.element.find(".e-memberSearchPageCount").text().split("/")[1])) ? ctrlObj.element.find(".e-memberSearchPager").find(".e-nextPage, .e-lastPage").removeClass("e-pageEnabled").addClass("e-pageDisabled") : ctrlObj.element.find(".e-memberSearchPager").find(".e-nextPage, .e-lastPage").removeClass("e-pageDisabled").addClass("e-pageEnabled");                            
                        }
                    }
                    else {
                        ctrlObj.element.find(".e-memberPager,.e-memberSearchPager,.e-memberDrillPager").css("display", "none");
                        ctrlObj.element.find(".e-dialogFooter").css("margin-top", "5px");
                    }
                    if (searchTreeSlicedItems.length > 0) {
                        if (searchTreeSlicedItems[0].id == "All")
                            searchTreeSlicedItems.splice(0, 1);
                        searchTreeSlicedItems.splice(0, 0, { id: "SearchFilterSelection", name: ctrlObj._getLocalizedLabels("AddCurrentSelectionToFilter"), checkedStatus: ctrlObj._isSelectSearchFilter, tag: "SearchFilterSelection", spriteCssClass: "e-searchfilterselection", uniqueName: "Add current selection to filter" });
                    }
                    if (ctrlObj.pluginName == "ejPivotClient" && ctrlObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap && ctrlObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                        ctrlObj._appendTreeViewData(searchTreeSlicedItems, ctrlObj.element.find(".pvtBtn").parent("[data-tag='Slicers:" + ctrlObj._selectedFieldName.replace(/\[/g, "").replace(/\]/g, "") + "']").length > 0)                    
                    else
                        _this._createSearchTreeview(searchTreeSlicedItems, ctrlObj);
                    //ctrlObj._memberTreeObj.expandAll(null, true);
                    //me._appendTreeViewData(ej.DataManager(me._editorTreeData).executeLocal(ej.Query().where("name", "contains", searchVal, true)), false);
                }
                else {
                    ctrlObj._isSearchApplied = false;
                    ctrlObj._isSelectSearchFilter = true;
                    var isExpanded = (!ej.isNullOrUndefined(ctrlObj._lastSavedTree) && $.grep(ctrlObj._lastSavedTree, function (item) { return item.pid }).length > 0) ? true : false;
                    if (pageSettings.enableMemberEditorPaging && ctrlObj.element.find(".e-memberSearchPager").find(".e-nextPageDiv").length > 0) {
                        ctrlObj._editorSearchTreeData = [];
                        if (ctrlObj.element.find(".e-memberPageCount").text() != "")
                            ctrlObj.element.find(".e-memberPager").css("display", "block");                        
                        ctrlObj.element.find(".e-memberSearchPager").css("display", "none");
                    }
                    if (isExpanded && ctrlObj.element.find(".e-memberDrillPageCount").text() != "") { ctrlObj.element.find(".e-memberDrillPager").css("display", "block"); ctrlObj.element.find(".e-memberPager").css("display", "none") };
                    if (ctrlObj.pluginName == "ejPivotClient" && ctrlObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap && ctrlObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                        ctrlObj._appendTreeViewData(pageSettings.enableMemberEditorPaging ? (isExpanded ? ej.DataManager(ctrlObj._lastSavedTree).executeLocal(ej.Query().sortBy("name", !ej.isNullOrUndefined(ctrlObj._sortType) ? ctrlObj._sortType : "")) : ej.DataManager(ctrlObj._editorTreeData).executeLocal(ej.Query().where("pid", "equal", null || undefined).page(ctrlObj._memberPageSettings.currentMemeberPage, pageSettings.memberEditorPageSize).sortBy("name", !ej.isNullOrUndefined(ctrlObj._sortType) ? ctrlObj._sortType : ""))) : ctrlObj._editorTreeData, ctrlObj.element.find(".pvtBtn").parent("[data-tag='Slicers:" + ctrlObj._selectedFieldName.replace(/\[/g, "").replace(/\]/g, "") + "']").length > 0);
                    else
                        _this._createSearchTreeview(pageSettings.enableMemberEditorPaging ? (isExpanded ? ej.DataManager(ctrlObj._lastSavedTree).executeLocal(ej.Query().sortBy("name", !ej.isNullOrUndefined(ctrlObj._sortType) ? ctrlObj._sortType : "")) : ej.DataManager(ctrlObj._editorTreeData).executeLocal(ej.Query().where(ej.Predicate("pid", "equal", null).and("id", "notequal", "All").and("id", "notequal", "(All)_0")).page(ctrlObj._memberPageSettings.currentMemeberPage, pageSettings.memberEditorPageSize).sortBy("name", !ej.isNullOrUndefined(ctrlObj._sortType) ? ctrlObj._sortType : ""))) : ctrlObj._editorTreeData, ctrlObj);
                }
                ctrlObj._waitingPopup.hide();
                ctrlObj._parentNodeCollection = {};
                ctrlObj._parentSearchNodeCollection = {};
            }, 0);
        },
        _createSearchTreeview: function (searchTreeNodes, ctrlObj) {
            var isMemEditPaging = ctrlObj.pluginName == "ejPivotSchemaDesigner" ? ctrlObj.model.pivotControl.model.enableMemberEditorPaging : ctrlObj.model.enableMemberEditorPaging;
            var isAdvancedFilter = ctrlObj.pluginName == "ejPivotSchemaDesigner" ? ctrlObj.model.pivotControl.model.enableAdvancedFilter : ctrlObj.model.enableAdvancedFilter;
            var isMemberSorting = ctrlObj.pluginName == "ejPivotSchemaDesigner" ? ctrlObj.model.pivotControl.model.enableMemberEditorSorting : ctrlObj.model.enableMemberEditorSorting;
            var isSlicer = ctrlObj.element.find(".e-pvtBtn").parent("[data-tag='Slicers:" + (ctrlObj._selectedFieldName || ctrlObj._dialogHead) + "']").length > 0;
            var mode = {
                analysisMode: ctrlObj.pluginName == "ejPivotSchemaDesigner" ? ctrlObj.model.pivotControl.model.analysisMode : ctrlObj.model.analysisMode,
                operationalMode: ctrlObj.pluginName == "ejPivotSchemaDesigner" ? ctrlObj.model.pivotControl.model.operationalMode : ctrlObj.model.operationalMode
            };
            if (!ctrlObj._isSearchApplied && ctrlObj._editorSearchTreeData.length == 0 && searchTreeNodes.length > 0)
                ctrlObj._lastSavedTree = searchTreeNodes;
            if (searchTreeNodes.length > 0) {
                searchTreeNodes = ej.DataManager(searchTreeNodes).executeLocal(ej.Query().where(ej.Predicate("id", "notequal", "All").and("id", "notequal", "(All)_0")));                
                searchTreeNodes.splice(0, 0, { id: "All", name: (isAdvancedFilter && !isSlicer) ? "(Select All)" : (mode.operationalMode == ej.Pivot.OperationalMode.ServerMode ? "(All)" : "All"), checkedStatus: ctrlObj._isAllMemberChecked, _isAllMemberChecked: ctrlObj._isAllMemberChecked });
            }
            ctrlObj.element.find(".e-editorTreeView").ejTreeView({
                showCheckbox: true,
                loadOnDemand: true,
                enableRTL: ctrlObj.model.enableRTL,
                beforeDelete: function (args) {
                    if (!ej.isNullOrUndefined(args.event))
                        if (args.event.type == "keydown" && args.event.originalEvent.key.toLowerCase() == "delete") return false;
                },
                height: isMemberSorting ? "200px" : "245px",
                fields: { id: "id", text: "name", isChecked: "checkedStatus", parentId: "pid", expanded: "expanded", hasChild: "hasChildren", dataSource: ej.Pivot._showEditorLinkPanel(searchTreeNodes, ctrlObj, ctrlObj.pluginName == "ejPivotSchemaDesigner" ? ctrlObj.model.pivotControl : ctrlObj) },
            });
            var treeViewElements = ctrlObj.element.find(".e-editorTreeView").find("li");
            for (var i = 0; i < treeViewElements.length; i++) {
                if (!ej.isNullOrUndefined($(treeViewElements[i]).attr("id")))
                    $(treeViewElements[i]).attr("data-tag", ej.DataManager(searchTreeNodes).executeLocal(ej.Query().where("id", "equal", $(treeViewElements[i]).attr("id")))[0].tag);
            }
            ctrlObj._memberTreeObj = ctrlObj.element.find(".e-editorTreeView").data("ejTreeView");
            ctrlObj._memberTreeObj.model.nodeCheck = ej.proxy(ctrlObj._nodeCheckChanges, ctrlObj);
            ctrlObj._memberTreeObj.model.nodeUncheck = ej.proxy(ctrlObj._nodeCheckChanges, ctrlObj);
            if (ctrlObj.pluginName == "ejPivotGrid")
                (ctrlObj.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) ? ctrlObj._memberTreeObj.model.beforeExpand = ej.proxy(ctrlObj._beforeNodeExpand, ctrlObj) : ctrlObj._memberTreeObj.model.nodeClick = ej.proxy(ctrlObj._nodeExpand, ctrlObj);
            else {
                (ctrlObj.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) ? ctrlObj._memberTreeObj.model.beforeExpand = ej.proxy(ctrlObj._beforeNodeExpand, ctrlObj) : ctrlObj._memberTreeObj.model.nodeClick = ej.proxy(ctrlObj._nodeExpand, ctrlObj);
                ctrlObj._memberTreeObj.model.beforeCollapse = ej.proxy(ej.Pivot._onNodeCollapse, ctrlObj);
            }
//            ctrlObj._memberTreeObj.model.beforeExpand = ej.proxy(ctrlObj._beforeNodeExpand, ctrlObj);
            if (!ej.isNullOrUndefined(ctrlObj.element.find(".e-dialog .e-text:visible").first())) {
                if (ctrlObj.element.find(".e-dialog .e-text:visible").length > 0) {
                    ctrlObj.element.find(".e-dialog .e-text:visible").first().attr("tabindex", "-1").addClass("e-hoverCell");
                    ctrlObj.element.find(".e-dialog button").removeClass("e-hoverCell");
                }
                else
                    ctrlObj.element.find(".e-dialog button:visible").first().attr("tabindex", "-1").addClass("e-hoverCell");
            }
            if (ctrlObj._memberTreeObj.element.find(".e-plus").length == 0 && ctrlObj._memberTreeObj.element.find(".e-minus").length == 0) {
                ctrlObj._memberTreeObj.element.find(".e-item").css("padding", "0px");
            }
            if (ctrlObj.model.enableMemberEditorSorting) {
                this._separateAllMember(ctrlObj);
            }
        },

        _separateAllMember: function (ctrlObj) {
            var isClientServer = (ctrlObj.element.hasClass("e-pivotclient") && ctrlObj.model.operationalMode == "servermode" && ctrlObj.model.analysisMode == "olap");
            var isAdvancedFilter = ctrlObj.pluginName == "ejPivotSchemaDesigner" ? ctrlObj.model.pivotControl.model.enableAdvancedFilter : ctrlObj.model.enableAdvancedFilter;
            var isRTL = ctrlObj.pluginName == "ejPivotSchemaDesigner" ? ctrlObj.model.pivotControl.model.enableRTL : ctrlObj.model.enableRTL;
            var isPivot = ctrlObj.pluginName == "ejPivotSchemaDesigner" ? ctrlObj.model.pivotControl.model.analysisMode : ctrlObj.model.analysisMode;
            var allMember = !isClientServer ? ej.buildTag("div.e-checkAllBox", ej.buildTag("input#allElement.allMember", "", { "float": isRTL ? "right" : "left" }, { name: 'row', type: 'checkbox', tabindex: 0 })[0].outerHTML + " " + ej.buildTag("label.e-allElementLabel", (isAdvancedFilter) ? "(Select All)" : "All", { "margin-left": "5px" })[0].outerHTML, { width: "100px", float: isRTL ? "right" : "left" })[0].outerHTML : "";
            var memberSortDiv = ej.buildTag("div.memberSortDiv", ej.buildTag("div.e-icon e-memberAscendingIcon", { margin: "5px" })[0].outerHTML + ej.buildTag("div.e-icon e-memberDescendingIcon")[0].outerHTML, { height: "35px", "margin-left": "5px", float: isRTL ? "left" : "right" })[0].outerHTML;
            var memberSortingDiv = ej.buildTag("div.memberSortingDiv", allMember + memberSortDiv, { "height": "20px", margin: ctrlObj.pluginName == "ejPivotSchemaDesigner" ? (isRTL ? (isPivot == ej.Pivot.AnalysisMode.Pivot ? "10px 15px 0px 21px" : "10px 31px 0px 12px") : (isPivot == ej.Pivot.AnalysisMode.Pivot ? "10px 0px 0px 8px" : "10px 0px 0px 20px")) : (isRTL ? (isPivot == ej.Pivot.AnalysisMode.Pivot ? "10px 15px 0px 20px" : "10px 28px 0px 20px") : (isPivot == ej.Pivot.AnalysisMode.Pivot ? "10px 0px 0px 20px" : "10px 0px 0px 29px")) });
            if (isAdvancedFilter)
                ctrlObj.element.find(".e-editorTreeView").css("margin-top", "10px");
            ctrlObj.element.find(".memberSortingDiv, .e-separateDiv").remove();

            if (isPivot == ej.Pivot.AnalysisMode.Pivot)
                ctrlObj.element.find(".e-editorTreeView").addClass("e-treeViewUl")
            if (!isClientServer)
                ctrlObj.element.find(".e-editorTreeView").before(memberSortingDiv);

            if (ctrlObj.element.find(".e-editorTreeView li:first").attr("id") == "All" || ctrlObj.element.find(".e-editorTreeView li:first").attr("id") == "(All)_0")
                ctrlObj.element.find(".e-editorTreeView li:first").css("display", "none");

            if (isClientServer) {
                ctrlObj.element.find(".memberSortDiv, .e-separateDiv").remove();
                ctrlObj.element.find(".e-checkOptions").after(ej.buildTag("div.e-separateDiv", { margin: "0px 5px" })[0].outerHTML);
                ctrlObj.element.find(".e-checkOptions").append(memberSortDiv);
                if (isAdvancedFilter)
                    ctrlObj.element.find(".e-editorTreeView").height(235);
            }
            else {
                ctrlObj.element.find(".memberSortingDiv").after(ej.buildTag("div.e-separateDiv", {})[0].outerHTML);
                ctrlObj.element.find(".allMember").ejCheckBox({ size: "small", width: "40px", checked: true, change: ej.proxy(ctrlObj._nodeCheckChanges, ctrlObj) });
            }

            if (ctrlObj._sortType == "ascending")
                ctrlObj.element.find(".e-memberAscendingIcon").addClass("e-selectedSort");
            else if (ctrlObj._sortType == "descending")
                ctrlObj.element.find(".e-memberDescendingIcon").addClass("e-selectedSort");

        },

        _checkChanges: function (args) {
            var controlObj = this.pluginName == "ejPivotSchemaDesigner" ? this.model.pivotControl : this;
            if (args.isChecked)
                controlObj._nodeCheckChanges(args);
            else if(!args.isChecked)
                controlObj._nodeUnCheckChanges(args);
        },

        _fetchMemberPageSuccess: function (msg) {
            var currentMembers, controlObj = this.pluginName == "ejPivotSchemaDesigner" ? this.model.pivotControl : this;
            if (msg[0] != undefined && msg.length > 0) {
                currentMembers = msg[0].Value;
                if (msg[1] != null && msg[1] != undefined)
                    this.model.customObject = msg[1].Value;
            }
            else if (msg.d != undefined && msg.d.length > 0) {
                currentMembers = msg.d[0].Value;
                if (msg.d[1] != null && msg.d[1] != undefined)
                    this.model.customObject = msg.d[1].Value;
            }
            else if (msg != undefined && msg.length > 0) {
                currentMembers = msg.EditorTreeInfo;
                if (msg != null && msg.customObject != undefined)
                    this.model.customObject = msg.customObject;
            }
            else if (msg != undefined) {
                currentMembers = msg.EditorTreeInfo;
                if (msg != null && msg.customObject != undefined)
                    this.model.customObject = msg.customObject;
            }
            this._memberPageSettings.endPage = this.pluginName == "ejPivotSchemaDesigner" ? this.model.pivotControl.model.memberEditorPageSize : this.model.memberEditorPageSize;
            this._memberPageSettings.startPage = 0;
            this._memberPageSettings.currentMemeberPage = 1;
            filteredData = JSON.parse(currentMembers);
            this._editorTreeData = $.extend(true, [], filteredData);
            if (controlObj.model.enableAdvancedFilter)
                this._editorTreeData = $.map(this._editorTreeData, function (val) { if (ej.isNullOrUndefined(val.levels)) return val; });
            if ((this.pluginName == "ejPivotSchemaDesigner" && this.model.pivotControl && this.model.pivotControl.model.enableAdvancedFilter && this.model.pivotControl.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) || (this.pluginName == "ejPivotGrid" && this.model.enableAdvancedFilter && this.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode))
                this._memberPagingAvdData = filteredData.splice(filteredData.length - 1, 1);
            this._memberCount = ej.DataManager(this._editorTreeData).executeLocal(ej.Query().where(ej.Predicate("pid", "equal", null).and("id", "notequal", "All").and("id", "notequal", "(All)_0"))).length;
            filteredData = ej.DataManager(this._editorTreeData).executeLocal(ej.Query().where("pid", "equal", null || undefined).page(this._memberPageSettings.currentMemeberPage, this.pluginName == "ejPivotSchemaDesigner" ? this.model.pivotControl.model.memberEditorPageSize + 1 : this.model.memberEditorPageSize + 1));
            this._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(filteredData) });
        },
        _memberPageNodeUncheck: function (e, pivotControlObj) {
            var temp = ""; var searchNode = null; var isMemEditPaging = pivotControlObj.pluginName == "ejPivotSchemaDesigner" ? pivotControlObj.model.pivotControl.model.enableMemberEditorPaging : pivotControlObj.model.enableMemberEditorPaging;
            if ($(e.currentElement).parent().parent().hasClass("e-editorTreeView") && !pivotControlObj._isSearchApplied && isMemEditPaging) {
                temp = ej.DataManager(pivotControlObj._editorTreeData).executeLocal(ej.Query().page(pivotControlObj._memberPageSettings.currentMemeberPage, pivotControlObj.pluginName == "ejPivotSchemaDesigner" ? pivotControlObj.model.pivotControl.model.memberEditorPageSize : pivotControlObj.model.memberEditorPageSize).where("id", "equal", e.currentElement.attr("id")))[0];
                if (!ej.isNullOrUndefined(pivotControlObj._editorSearchTreeData)) searchNode = ej.DataManager(pivotControlObj._editorSearchTreeData).executeLocal(ej.Query().page(pivotControlObj._memberPageSettings.currentMemeberPage, pivotControlObj.pluginName == "ejPivotSchemaDesigner" ? pivotControlObj.model.pivotControl.model.memberEditorPageSize : pivotControlObj.model.memberEditorPageSize).where("id", "equal", e.currentElement.attr("id")))[0];
            }
            else {
                temp = ej.DataManager(pivotControlObj._editorTreeData).executeLocal(ej.Query().where("id", "equal", e.currentElement.attr("id")))[0];
                if (!ej.isNullOrUndefined(pivotControlObj._editorSearchTreeData)) searchNode = ej.DataManager(pivotControlObj._editorSearchTreeData).executeLocal(ej.Query().where("id", "equal", e.currentElement.attr("id")))[0];
            }
            if (!ej.isNullOrUndefined(temp)) {
                temp.checkedStatus = false;
                if (!ej.isNullOrUndefined(temp.pid)) {
                    var nodeItem = ej.DataManager(pivotControlObj._editorTreeData).executeLocal(ej.Query().where("pid", "equal", temp.pid).where("checkedStatus", "equal", true));
                    if (!ej.isNullOrUndefined(nodeItem) && nodeItem.length == 0)
                        ej.Pivot._unSelectParentTreeNode(temp, pivotControlObj);
                }
                var nodeItem = ej.DataManager(pivotControlObj._editorTreeData).executeLocal(ej.Query().where("pid", "equal", temp.id));
                if (!ej.isNullOrUndefined(nodeItem) && nodeItem.length > 0)
                    ej.Pivot._unSelectChildTreeNode(temp, pivotControlObj);
            }
            if (!ej.isNullOrUndefined(searchNode)) {
                searchNode.checkedStatus = false;
                if (!ej.isNullOrUndefined(searchNode.pid)) {
                    var nodeItem = ej.DataManager(pivotControlObj._editorSearchTreeData).executeLocal(ej.Query().where("pid", "equal", searchNode.pid).where("checkedStatus", "equal", true));
                    if (!ej.isNullOrUndefined(nodeItem) && nodeItem.length == 0)
                        ej.Pivot._unSelectParentTreeNode(searchNode, pivotControlObj);
                }
                var nodeItem = ej.DataManager(pivotControlObj._editorSearchTreeData).executeLocal(ej.Query().where("pid", "equal", temp.id));
                if (!ej.isNullOrUndefined(nodeItem) && nodeItem.length > 0)
                    ej.Pivot._unSelectChildTreeNode(searchNode, pivotControlObj);
            }
        },

        _memberPageNodeCheck: function (e, pivotControlObj) {
            var temp = ""; var searchNode = null; var isMemEditPaging = pivotControlObj.pluginName == "ejPivotSchemaDesigner" ? pivotControlObj.model.pivotControl.model.enableMemberEditorPaging : pivotControlObj.model.enableMemberEditorPaging;
            if ($(e.currentElement).parent().parent().hasClass("e-editorTreeView") && !pivotControlObj._isSearchApplied && isMemEditPaging) {
                temp = ej.DataManager(pivotControlObj._editorTreeData).executeLocal(ej.Query().page(pivotControlObj._memberPageSettings.currentMemeberPage, pivotControlObj.pluginName == "ejPivotSchemaDesigner" ? pivotControlObj.model.pivotControl.model.memberEditorPageSize : pivotControlObj.model.memberEditorPageSize).where("id", "equal", e.currentElement.attr("id")))[0];
                if (!ej.isNullOrUndefined(pivotControlObj._editorSearchTreeData)) searchNode = ej.DataManager(pivotControlObj._editorSearchTreeData).executeLocal(ej.Query().page(pivotControlObj._memberPageSettings.currentMemeberPage, pivotControlObj.pluginName == "ejPivotSchemaDesigner" ? pivotControlObj.model.pivotControl.model.memberEditorPageSize : pivotControlObj.model.memberEditorPageSize).where("id", "equal", e.currentElement.attr("id")))[0];
            }
            else {
                temp = ej.DataManager(pivotControlObj._editorTreeData).executeLocal(ej.Query().where("id", "equal", e.currentElement.attr("id")))[0];
                if (!ej.isNullOrUndefined(pivotControlObj._editorSearchTreeData)) searchNode = ej.DataManager(pivotControlObj._editorSearchTreeData).executeLocal(ej.Query().where("id", "equal", e.currentElement.attr("id")))[0];
            }
            if (!ej.isNullOrUndefined(temp)) {
                temp.checkedStatus = true;
                if (!ej.isNullOrUndefined(temp.pid)) {
                    //var nodeItem = ej.DataManager(pivotControlObj._editorTreeData).executeLocal(ej.Query().where("pid", "equal", temp.pid).where("checkedStatus", "equal", true));
                    //if (!ej.isNullOrUndefined(nodeItem) && nodeItem.length > 0)
                    ej.Pivot._selectParentTreeNode(temp, pivotControlObj);
                }
                if (!ej.isNullOrUndefined(temp.id)) {
                    var childNodeItem = ej.DataManager(pivotControlObj._editorTreeData).executeLocal(ej.Query().where("pid", "equal", temp.id));
                    if (!ej.isNullOrUndefined(childNodeItem) && childNodeItem.length > 0) {
                        for (var i = 0; i < childNodeItem.length; i++) {
                            childNodeItem[i].checkedStatus = true;
                            if (childNodeItem[i].expanded || childNodeItem[i].isChildMerged)
                                ej.Pivot._selectChildTreeNode(childNodeItem[i], pivotControlObj);
                        }
                    }
                }
            }
            if (!ej.isNullOrUndefined(searchNode)) {
                searchNode.checkedStatus = true;
                if (!ej.isNullOrUndefined(searchNode.pid)) {
                    ej.Pivot._selectParentTreeNode(searchNode, pivotControlObj);
                }
                if (!ej.isNullOrUndefined(searchNode.id)) {
                    var childNodeItem = ej.DataManager(pivotControlObj._editorSearchTreeData).executeLocal(ej.Query().where("pid", "equal", searchNode.id));
                    if (!ej.isNullOrUndefined(childNodeItem) && childNodeItem.length > 0) {
                        for (var i = 0; i < childNodeItem.length; i++) {
                            childNodeItem[i].checkedStatus = true;
                            ej.Pivot._selectChildTreeNode(childNodeItem[i], pivotControlObj);
                        }
                    }
                }
            }
        },
        _appendParentNodes: function (searchTreeNodes, childNode, ctrlObj) {
            if (!ej.isNullOrUndefined(childNode.pid)) {
                var parentNode, pAvailNode;
                if (!ej.isNullOrUndefined(ctrlObj._parentNodeCollection[childNode.pid]))
                    parentNode = ctrlObj._parentNodeCollection[childNode.pid];
                else {
                    parentNode = jQuery.extend(true, [], ej.DataManager(ctrlObj._editorTreeData).executeLocal(ej.Query().where("id", "equal", childNode.pid)));
                    ctrlObj._parentNodeCollection[childNode.pid] = parentNode;
                }
                if ((!ej.isNullOrUndefined(parentNode) && parentNode.length > 0))
                {
                    if (!ej.isNullOrUndefined(ctrlObj._parentSearchNodeCollection[parentNode[0].id]))
                        pAvailNode = ctrlObj._parentSearchNodeCollection[parentNode[0].id];
                    else {
                        pAvailNode = jQuery.extend(true, [], ej.DataManager(searchTreeNodes).executeLocal(ej.Query().where("id", "equal", parentNode[0].id)));
                        ctrlObj._parentSearchNodeCollection[parentNode[0].id] = parentNode;
                    }
                }                
                if (!ej.isNullOrUndefined(pAvailNode)) {
                    if (pAvailNode.length == 0) {
                        parentNode[0].expanded = true;
                        searchTreeNodes.push(parentNode[0]);
                        if (!ej.isNullOrUndefined(parentNode[0].pid))
                            this._appendParentNodes(searchTreeNodes, parentNode[0], ctrlObj);
                    }
                    else
                        pAvailNode[0].expanded = true;
                }
            }
        },
        _selectParentTreeNode: function (node, ctrlObj) {
            var parentItem = ej.DataManager(ctrlObj._editorTreeData).executeLocal(ej.Query().where("id", "equal", node.pid));
            if (!ej.isNullOrUndefined(parentItem) && parentItem.length > 0) {
                parentItem[0].checkedStatus = true;
                this._selectParentTreeNode(parentItem[0], ctrlObj);
            }
        },
        _selectChildTreeNode: function (node, ctrlObj) {
            var childNodeItem = ej.DataManager(ctrlObj._editorTreeData).executeLocal(ej.Query().where("pid", "equal", node.id));
            if (!ej.isNullOrUndefined(childNodeItem) && childNodeItem.length > 0) {
                for (var i = 0; i < childNodeItem.length; i++) {
                    childNodeItem[i].checkedStatus = true;
                    if (childNodeItem[i].expanded || childNodeItem[i].isChildMerged)
                        this._selectChildTreeNode(childNodeItem[i], ctrlObj);
                }
            }
        },
        _unSelectChildTreeNode: function (node, ctrlObj) {
            var childNodeItem = ej.DataManager(ctrlObj._editorTreeData).executeLocal(ej.Query().where("pid", "equal", node.id));
            if (!ej.isNullOrUndefined(childNodeItem) && childNodeItem.length > 0) {
                for (var i = 0; i < childNodeItem.length; i++) {
                    childNodeItem[i].checkedStatus = false;
                    if (childNodeItem[i].expanded || childNodeItem[i].isChildMerged)
                        this._unSelectChildTreeNode(childNodeItem[i], ctrlObj);
                }
            }
        },
        _unSelectParentTreeNode: function (node, ctrlObj) {
            var parentItem = ej.DataManager(ctrlObj._editorTreeData).executeLocal(ej.Query().where("id", "equal", node.pid));
            if (!ej.isNullOrUndefined(parentItem) && parentItem.length > 0) {
                parentItem[0].checkedStatus = false;
                if (ej.DataManager(ctrlObj._editorTreeData).executeLocal(ej.Query().where("pid", "equal", parentItem[0].pid).where("checkedStatus", "equal", true)).length == 0)
                    this._unSelectParentTreeNode(parentItem[0], ctrlObj);
            }
        },
        _getSelectedTreeState: function (isSlicer, ctrlObj) {
            if (isSlicer) {
                var selectedNodes = new Array();
                var firstLevelNodes = ej.DataManager(ctrlObj._editorTreeData).executeLocal(ej.Query().where("pid", "equal", null || undefined));
                for (var i = 0; i < firstLevelNodes.length; i++) {
                    var nodeExpanded = ej.DataManager(ctrlObj._editorTreeData).executeLocal(ej.Query().where("pid", "equal", firstLevelNodes[i].id));
                    var nodeInfo = { caption: firstLevelNodes[i].name, parentId: ej.isNullOrUndefined(firstLevelNodes[i].pid) ? "None" : firstLevelNodes[i].pid, id: firstLevelNodes[i].id, checked: firstLevelNodes[i].checkedStatus, expanded: nodeExpanded.length > 0 ? true : false, childNodes: new Array(), tag: firstLevelNodes[i].tag };
                    if (nodeExpanded.length > 0) {
                        for (var j = 0; j < nodeExpanded.length; j++) {
                            nodeInfo.childNodes.push(this._getEditorSlicerInfo(nodeExpanded[j], ctrlObj));
                        }
                    }
                    selectedNodes.push(nodeInfo);
                }
                return JSON.stringify(selectedNodes);
            }
            else {
                var selectedNodes = "";
                for (var i = 0; i < ctrlObj._editorTreeData.length; i++) {
                    if (ctrlObj._editorTreeData[i].checkedStatus == true)
                        selectedNodes += "::" + ctrlObj._editorTreeData[i].id + "||" + ctrlObj._editorTreeData[i].tag;
                }
                return selectedNodes;
            }
        },
        _getUnSelectedTreeState: function (ctrlObj) {
            var unSelectedNodes = "";
            for (var i = 0; i < ctrlObj._editorTreeData.length; i++) {
                if (ctrlObj._editorTreeData[i].checkedStatus == false)
                    unSelectedNodes += "::" + ctrlObj._editorTreeData[i].id + "||" + ctrlObj._editorTreeData[i].tag;
            }
            return unSelectedNodes;
        },
        _getEditorSlicerInfo: function (node, ctrlObj) {
            var nodeExpanded = ej.DataManager(ctrlObj._editorTreeData).executeLocal(ej.Query().where("pid", "equal", node.id));
            var childNode = { caption: node.name, parentId: ej.isNullOrUndefined(node.pid) ? "None" : node.pid, id: node.id, checked: node.checkedStatus, expanded: nodeExpanded.length > 0 ? true : false, childNodes: new Array(), tag: node.tag };
            if (nodeExpanded.length > 0) {
                for (var j = 0; j < nodeExpanded.length; j++) {
                    childNode.childNodes.push(this._getEditorSlicerInfo(nodeExpanded[j], ctrlObj));
                }
            }
            return childNode;
        },
        _editorLinkPanelClick: function (args) {
            this.element.find(".e-dialog").hide();
            ej.Pivot._createErrorDialog(this._getLocalizedLabels("EditorLinkPanelAlert").split("1000").join(this.model.maxNodeLimitInMemberEditor), this._getLocalizedLabels("Warning"), this);
        },
        _showEditorLinkPanel: function (data, controlObj, parentControlObj) {            
            if (!parentControlObj.model.enableMemberEditorPaging) {
                if (parentControlObj.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && !controlObj._isSearchApplied)
                    controlObj._editorTreeData = data;
                if (data.length > (parentControlObj.model.maxNodeLimitInMemberEditor + (controlObj._isSearchApplied ? 1 : 0))) {
                    var dumData = [], parColl = {}, parCollExp = {}, islmtExceeds = false;
                    for (var cnt = 0; cnt < data.length; cnt++) {
                        if (ej.isNullOrUndefined(parColl[data[cnt].pid])) {
                            if (!ej.isNullOrUndefined(data[cnt].pid)) {
                                var parEle = $.grep(data, function (itm) { if (itm.id == data[cnt].pid) return itm; });
                                if (parEle.length > 0)
                                    parCollExp[data[cnt].pid] = parEle[0].expanded ? true : false;
                            }
                            parColl[data[cnt].pid] = 1;
                        }
                        else
                            parColl[data[cnt].pid]++;                        
                        if (parColl[data[cnt].pid] <= (parentControlObj.model.maxNodeLimitInMemberEditor + ((controlObj._isSearchApplied && ej.isNullOrUndefined(data[cnt].pid)) ? 1 : 0)))
                            dumData.push(data[cnt]);
                        else if (ej.isNullOrUndefined(parCollExp[data[cnt].pid]) || parCollExp[data[cnt].pid])
                            islmtExceeds = true;
                    }
                    data = dumData;
                    if (islmtExceeds) controlObj.element.find("div.e-linkOuterPanel").css("display", "block");
                }
            }
            return data;
        },
        createErrorDialog: function (controlObj) {
            ej.Pivot.openPreventPanel(controlObj);
            var dialogObj;
            if (controlObj.element.find(".e-errorDialog").length == 0) {
                var dialogElem = ej.buildTag("div.e-errorDialog#ErrorDialog", ej.buildTag("div.warningImg")[0].outerHTML + ej.buildTag("div.warningContent", controlObj._getLocalizedLabels("AlertMsg"))[0].outerHTML + ej.buildTag("div", ej.buildTag("button#ErrOKBtn.errOKBtn", "OK")[0].outerHTML)[0].outerHTML).attr("title", controlObj._getLocalizedLabels("Warning"))[0].outerHTML;
                controlObj.element.append(dialogElem);
                controlObj.element.find(".e-errorDialog").ejDialog({ target: "#" + controlObj._id, enableResize: false, enableRTL: controlObj.model.enableRTL, width: "400px" });
                dialogObj = controlObj.element.find(".e-errorDialog").data("ejDialog");
                $("#" + dialogObj._id + "_wrapper").css({ left: "50%", top: "50%" });
                controlObj.element.find(".errOKBtn").ejButton({ type: ej.ButtonType.Button, click: ej.proxy(ej.Pivot.errOKBtnClick, controlObj) });
                controlObj.element.find(".e-dialog .e-close").attr("title", controlObj._getLocalizedLabels("Close"));
            }
            else {
                dialogObj = controlObj.element.find(".e-errorDialog").data("ejDialog");
                dialogObj.open();
            }
        },

        errOKBtnClick: function (args) {
            this.element.find("#preventDiv").remove();
            var dialogObj = this.element.find(".e-errorDialog").data("ejDialog");
            dialogObj._ejDialog.find("div.e-dialog-icon").trigger("click");
        },

        //OLAP functionalities
        doAjaxPost: function (type, url, data, onSuccess, onComplete, customArgs) {
            var contentType, dataType, successEvt, isAsync = true;
            if ((data["XMLA"] == undefined))
                contentType = 'application/json; charset=utf-8', dataType = 'json', successEvt = $.proxy(onSuccess, this);
            else
                contentType = 'text/xml', dataType = 'xml', data = data["XMLA"], successEvt = $.proxy(onSuccess, ej.olap.base, customArgs), isAsync = ((ej.browserInfo().name == "msie" && ej.browserInfo().version <= 9) ? false : (!ej.isNullOrUndefined(customArgs) && customArgs["action"] != "loadFieldElements") ? true : false);
            $.ajax({
                type: type,
                url: url,
                contentType: contentType,
                async: isAsync,
                dataType: dataType,
                data: data,
                success: successEvt,
                complete: ej.proxy(function (onComplete) {
                    $.proxy(onComplete, this);
                    var eventArgs = { "action": this._currentAction, "customObject": "", element: this.element };
                }, this),
                error: ej.proxy(function (msg, textStatus, errorThrown) {
                    if (typeof this._ogridWaitingPopup != 'undefined' && this._ogridWaitingPopup != null)
                        this._ogridWaitingPopup.hide();
                    if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null)
                        oclientWaitingPopup.hide();
                    var eventArgs = { "action": this._drillAction != "" ? this._drillAction : "initialize", "customObject": "", "element": this.element, "Message": msg };
                    this._trigger("renderFailure", eventArgs);
                    this.renderControlFromJSON("");
                    if (this._dataModel == "XMLA")
                        this._createErrorDialog(msg.statusText, this._getLocalizedLabels("Error")); msg.statusText
                }, this)
            });
        },        

        getCubeList: function (customArgs, e) {
            var cubeList = [];
            for (var i = 0; i < $(e).find("row").length; i++) {
                var element = $($(e).find("row")[i]);
                cubeList.push({ name: $(element).children("CUBE_NAME").text() });
            }
            customArgs.pvtCtrldObj.setCubeList(cubeList);
        },

        generateTreeViewData: function (schemaObj) {
            var args = { catalog: schemaObj.model.pivotControl.model.dataSource.catalog, cube: schemaObj.model.pivotControl.model.dataSource.cube, url: schemaObj.model.pivotControl.model.dataSource.data, request: "MDSCHEMA_DIMENSIONS" }
            this._getTreeData(args, this.loadDimensionElements, { schemaData: schemaObj, action: "loadFieldElements" });
        },

        loadDimensionElements: function (customArgs, data) {
            var dimensionName, contObj = customArgs.schemaData.model.pivotControl, measures = {}, conStr = ej.olap.base._getConnectionInfo(contObj.model.dataSource.data), args = {}, isMon = contObj.model.dataSource.providerName == ej.olap.Providers.Mondrian;
            args = { catalog: contObj.model.dataSource.catalog, cube: contObj.model.dataSource.cube, url: contObj.model.dataSource.data, request: "MDSCHEMA_DIMENSIONS" };
            contObj["schemaTreeView"] = []; contObj["reportItemNames"] = [];

            for (var i = 0; i < $(data).find("row").length; i++) {
                var element = $($(data).find("row")[i]), dimensionUniqueName = element.find("DIMENSION_UNIQUE_NAME").text(), dimensionName = element.find("DIMENSION_CAPTION").text();
                if (dimensionUniqueName.toLowerCase().indexOf("[measure") >= 0)
                    measures = { hasChildren: true, isSelected: false, id: dimensionUniqueName, name: dimensionName, spriteCssClass: dimensionUniqueName.toLowerCase() == "[measures]" ? "e-folderCDB e-icon" : "e-dimensionCDB e-icon", tag: dimensionUniqueName }
                else if (!$($(data).find("row")[0]).find("HIERARCHY_CAPTION").length > 0) {
                    contObj.schemaTreeView.push({ hasChildren: true, isSelected: false, id: (isMon ? dimensionUniqueName + "~#^Dim" : dimensionUniqueName), name: dimensionName, spriteCssClass: "e-dimensionCDB e-icon", tag: dimensionUniqueName, defaultHierarchy: $($(data).find("row")[i]).children("DEFAULT_HIERARCHY").text() });
                }
            }
            contObj.schemaTreeView.splice(0, 0, measures);
            if (!contObj.model.enableDrillThrough || (customArgs.schemaData != undefined && customArgs.schemaData.model.olap.showNamedSets)) {
                args.request = "MDSCHEMA_SETS";
                ej.Pivot._getTreeData(args, ej.Pivot.loadNamedSetElements, customArgs);
            }
            else {
                args.request = "MDSCHEMA_HIERARCHIES";
                if (ej.isNullOrUndefined(contObj._fieldData) || (!ej.isNullOrUndefined(contObj._fieldData) && ej.isNullOrUndefined(contObj._fieldData.hierarchy)))
                    this._getFieldItemsInfo(contObj);
                if (contObj._fieldData.hierarchySuccess == undefined)
                    ej.Pivot._getTreeData(args, contObj.loadHierarchyElements, customArgs);
                else
                    ej.Pivot.loadHierarchyElements(customArgs, contObj._fieldData.hierarchySuccess);
            }
        },

        loadNamedSetElements: function (customArgs, data) {
            var contObj = customArgs.schemaData.model.pivotControl, args = { catalog: contObj.model.dataSource.catalog, cube: contObj.model.dataSource.cube, url: contObj.model.dataSource.data, request: "MDSCHEMA_HIERARCHIES" }
            var data = contObj.model.dataSource, treeNodeElement = {}, measureGroupItems = [], reportElement;

            reportElement = $.map(data.rows, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName });
            $.merge(reportElement, ($.map(data.columns, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName })));
            $.merge(reportElement, ($.map(data.filters, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName })));

            for (var i = 0; i < $(data).find("row").length; i++) {
                var element = $($(data).find("row")[i]);
                if ((!($.inArray(element.find("DIMENSIONS").text().split(".")[0], measureGroupItems) >= 0))) {
                    contObj.schemaTreeView.push({ hasChildren: true, isSelected: false, pid: element.find("DIMENSIONS").text().split(".")[0], id: element.find("SET_DISPLAY_FOLDER").text() + "_" + element.find("DIMENSIONS").text().split(".")[0], name: element.find("SET_DISPLAY_FOLDER").text(), spriteCssClass: "e-folderCDB e-icon namedSets" });
                    measureGroupItems.push(element.find("DIMENSIONS").text().split(".")[0]);
                }
                contObj.schemaTreeView.push({
                    hasChildren: true, isSelected: ($.inArray("[" + $.trim(element.children("SET_NAME").text()) + "]", reportElement) >= 0),
                    pid: element.find("SET_DISPLAY_FOLDER").text() + "_" + element.find("DIMENSIONS").text().split(".")[0],
                    id: "[" + $.trim(element.children("SET_NAME").text()).replace(/\&/g, "&amp;") + "]",
                    name: element.children("SET_CAPTION").text(), spriteCssClass: "e-namedSetCDB e-icon", tag: element.find("EXPRESSION").text()
                });
            }

            if (ej.isNullOrUndefined(contObj._fieldData) || contObj._fieldData.hierarchySuccess == undefined)
                ej.Pivot._getTreeData(args, ej.Pivot.loadHierarchyElements, customArgs);
            else
                ej.Pivot.loadHierarchyElements(customArgs, contObj._fieldData.hierarchySuccess);
        },

        loadHierarchyElements: function (customArgs, data) {
            var contObj = customArgs.schemaData.model.pivotControl, args = { catalog: contObj.model.dataSource.catalog, cube: contObj.model.dataSource.cube, url: contObj.model.dataSource.data, request: "MDSCHEMA_LEVELS" };
            var reportInfo = contObj.model.dataSource, displayFolder = "", reportElement, isMon = contObj.model.dataSource.providerName == ej.olap.Providers.Mondrian;

            reportElement = $.map(reportInfo.rows, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName });
            $.merge(reportElement, ($.map(reportInfo.columns, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName })));
            $.merge(reportElement, ($.map(reportInfo.filters, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName })));

            for (var i = 0; i < $(data).find("row").length; i++) {
                var element = $($(data).find("row")[i]), dimensionUniqueName = element.find("DIMENSION_UNIQUE_NAME").text(), hierarchyUniqueName = element.find("HIERARCHY_UNIQUE_NAME").text();
                var currElement = $(contObj.schemaTreeView).filter(function (i, x) {
                    return (x.tag == dimensionUniqueName);
                }).map(function (i, x) { return x });
                if (currElement.length > 0 && (dimensionUniqueName != hierarchyUniqueName || isMon))
                contObj.schemaTreeView.push({ hasChildren: true, isSelected: ($.inArray(hierarchyUniqueName, reportElement) >= 0), pid: dimensionUniqueName +(isMon? "~#^Dim":""), id: hierarchyUniqueName, name: element.find("HIERARCHY_CAPTION").text(), spriteCssClass: ((element.find("HIERARCHY_ORIGIN").text() != "2") && element.find("HIERARCHY_ORIGIN").text() != "6") ? "e-hierarchyCDB e-icon" : "e-attributeCDB e-icon", tag: hierarchyUniqueName, });
            }
            ej.Pivot._getTreeData(args, ej.Pivot.loadLevelElements, customArgs);
        },

        loadLevelElements: function (customArgs, data) {
            var contObj = customArgs.schemaData.model.pivotControl,  newDataSource = $.map($(data).find("row"), function (obj, index) {
                if (parseInt($(obj).children("LEVEL_TYPE").text()) != "1" && $(obj).children("HIERARCHY_UNIQUE_NAME").text().toLowerCase() != "[measures]")
                    return { hasChildren: false, isChecked: false, id: $(obj).find("LEVEL_UNIQUE_NAME").text(), pid: $(obj).find("HIERARCHY_UNIQUE_NAME").text(), name: $(obj).find("LEVEL_CAPTION").text(), tag: $(obj).find("LEVEL_UNIQUE_NAME").text(), spriteCssClass: "e-level" + parseInt($(obj).children("LEVEL_NUMBER").text()) + " e-icon" };
            });
            $.merge(contObj.schemaTreeView, newDataSource);
            if (!contObj.model.enableDrillThrough || contObj._fieldData.measureSuccess) {
                if (ej.isNullOrUndefined(contObj._fieldData) || !contObj._fieldData.measureSuccess) {
                    var args = { catalog: contObj.model.dataSource.catalog, cube: contObj.model.dataSource.cube, url: contObj.model.dataSource.data, request: "MDSCHEMA_MEASURES" }
                    ej.Pivot._getTreeData(args, ej.Pivot.loadMeasureElements, customArgs);
                }
                else
                    ej.Pivot.loadMeasureElements(customArgs, contObj._fieldData.measureSuccess);
            }
        },

        loadMeasureGroups: function (customArgs, data) {
            if (ej.isNullOrUndefined(customArgs.pivotControl._fieldData))
                customArgs.pivotControl._fieldData = {};
            customArgs.pivotControl._fieldData["measuresGroups"] = $(data).find("row");
        },

        loadMeasureElements: function (customArgs, data) {
            var contObj= customArgs.schemaData.model.pivotControl,args = { catalog: contObj.model.dataSource.catalog, cube: contObj.model.dataSource.cube, url: contObj.model.dataSource.data, request: "MDSCHEMA_DIMENSIONS" }
            var elements = [], measureGroupItems = [], measureGroup = "", caption;

            elements = $.map(contObj.model.dataSource.values, function (obj, index) { if (obj["measures"] != undefined) return obj["measures"] });
            contObj.reportItemNames = $.map(elements, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName });

            if (contObj.model.locale != "en-US") {
                var args = { catalog: contObj.model.dataSource.catalog, cube: contObj.model.dataSource.cube, url: contObj.model.dataSource.data, request: "MDSCHEMA_MEASUREGROUPS" }
                ej.Pivot._getTreeData(args, ej.Pivot.loadMeasureGroups, { pivotControl: contObj, action: "loadFieldElements" });
            }

            for (var i = 0; i < $(data).find("row").length; i++) {
                var element = $($(data).find("row")[i]), measureGRPName = element.children("MEASUREGROUP_NAME").text(), measureUQName = element.find("MEASURE_UNIQUE_NAME").text();
                if ((!($.inArray(measureGRPName, measureGroupItems) >= 0))) {
                    if (contObj.model.locale != "en-US") {
                        var measureInfo = $.map(contObj._fieldData["measuresGroups"], function (item) { if ($(item).children("MEASUREGROUP_NAME").text() == measureGRPName) return $(item).children("MEASUREGROUP_CAPTION").text() });
                        caption = measureInfo.length > 0 ? measureInfo[0] : measureGRPName
                    }
                    else
                        caption = measureGRPName;
                    if (measureGRPName != "")
                        contObj.schemaTreeView.push({ hasChildren: true, isChecked: false, pid: "[Measures]", id: measureGRPName, name: caption, spriteCssClass: "e-measureGroupCDB e-icon", tag: measureGRPName });
                    measureGroupItems.push(measureGRPName);
                }
                contObj.schemaTreeView.push({ hasChildren: true, isSelected: ($.inArray(measureUQName, contObj.reportItemNames) >= 0), id: measureUQName, pid: measureGRPName == "" ? "[Measures]" : measureGRPName, name: element.children("MEASURE_CAPTION").text(), spriteCssClass: "measure", tag: measureUQName });
                if (($.inArray(measureUQName, contObj.reportItemNames) >= 0))
                    contObj.reportItemNames.splice(contObj.reportItemNames.indexOf(measureUQName), 1);
            }

            if (!ej.isNullOrUndefined(customArgs.schemaData) && (customArgs.schemaData.model.olap.showKpi || contObj.model.enableKPI)) {
                treeNodeElement = { hasChildren: true, isChecked: false, id: "folderStruct", name: "KPI", spriteCssClass: "kpiCDB e-folderCDB e-icon", tag: "" }
                contObj.schemaTreeView.splice(1, 0, treeNodeElement);
                args.request = "MDSCHEMA_KPIS";
                ej.Pivot._getTreeData(args, ej.Pivot.loadKPIElements, customArgs);
            }
            else if (!ej.isNullOrUndefined(customArgs.schemaData))
                customArgs.schemaData._createTreeView(this, contObj.schemaTreeView);
        },

        loadKPIElements: function (customArgs, data) {
            var contObj= customArgs.schemaData.model.pivotControl, reportElement = this.reportItemNames, measureGroupItems = [], measureGroup = "";
            for (var i = 0; i < $(data).find("row").length; i++) {
                var element = $($(data).find("row")[i]), kpiName = element.children("KPI_CAPTION").text(),
                    kpiGoal = element.children("KPI_goal").text(), kpiStatus = element.children("KPI_STATUS").text(),
                    kpiTrend = element.children("KPI_TREND").text(), kpiValue = element.find("KPI_VALUE").text();
                if ((!($.inArray(element.children("KPI_NAME").text(), measureGroupItems) >= 0))) {
                    treeNodeElement = { hasChildren: true, isChecked: false, pid: "folderStruct", id: kpiName, name: kpiName, spriteCssClass: "e-measureGroupCDB e-icon", tag: kpiName }
                    contObj.schemaTreeView.push(treeNodeElement);
                    measureGroupItems.push(kpiName);
                }
                treeNodeElement = { hasChildren: true, isSelected: ($.inArray(kpiGoal, reportElement) >= 0), id: kpiGoal, pid: kpiName, name: contObj.model.enableKPI ? "Goal" : contObj._getLocalizedLabels("Goal"), spriteCssClass: "kpiGoal e-icon", tag: kpiGoal };
                contObj.schemaTreeView.push(treeNodeElement);
                treeNodeElement = { hasChildren: true, isSelected: ($.inArray(kpiStatus, reportElement) >= 0), id: kpiStatus, pid: kpiName, name: contObj.model.enableKPI ? "Status" : contObj._getLocalizedLabels("Status"), spriteCssClass: "kpiStatus e-icon", tag: kpiStatus };
                contObj.schemaTreeView.push(treeNodeElement);
                treeNodeElement = { hasChildren: true, isSelected: ($.inArray(kpiTrend, reportElement) >= 0), id: kpiTrend, pid: kpiName, name: contObj.model.enableKPI ? "Trend" : contObj._getLocalizedLabels("Trend"), spriteCssClass: "kpiTrend e-icon", tag: kpiTrend };
                contObj.schemaTreeView.push(treeNodeElement);
                treeNodeElement = { hasChildren: true, isSelected: ($.inArray(kpiValue, reportElement) >= 0), id: kpiValue, pid: kpiName, name: contObj.model.enableKPI ? "Value" : contObj._getLocalizedLabels("Value"), spriteCssClass: "kpiValue e-icon", tag: kpiValue };
                contObj.schemaTreeView.push(treeNodeElement);
            }
            customArgs.schemaData._createTreeView(this, contObj.schemaTreeView);
            delete contObj.reportItemNames;
            delete contObj.schemaTreeView;
        },
        _createCalcMemberDialog: function (calcMemberTree, pivotObj) {
            var pivotObj = (!ej.isNullOrUndefined(pivotObj.model)) ? pivotObj : this;
            var calcMemberTreeData = "";
            if (calcMemberTree.length > 1 && calcMemberTree[0] != undefined)
                calcMemberTreeData = JSON.parse(calcMemberTree[0].Value);
            else if (calcMemberTree.d != undefined)
                calcMemberTreeData = JSON.parse(calcMemberTree.d[0].Value);
            else
                calcMemberTreeData = JSON.parse(calcMemberTree.CubeTreeInfo);
            if (pivotObj.model.afterServiceInvoke != null)
                pivotObj._trigger("afterServiceInvoke", { action: "fetchCalcMemberTreeView", element: pivotObj.element, customObject: pivotObj.model.customObject });

            ej.Pivot.openPreventPanel(pivotObj);
            pivotObj.element.find(".e-calcMemberDialog", ".e-clientDialog", ".e-dialog").remove();
            var treeviewPanel = ej.buildTag("div.e-cubeBrowserCalcMember", ej.buildTag("div#" + pivotObj._id + "_cubeTreeViewCalcMember.e-cubeTreeViewCalcMember")[0].outerHTML, {})[0].outerHTML;
            var captionFields = ej.buildTag("label.lblCaption", pivotObj._getLocalizedLabels("Caption"), {})[0].outerHTML + ej.buildTag("input#" + pivotObj._id + "_captionFieldCM.captionFieldCM", "", {}).attr("aria-label", pivotObj._getLocalizedLabels("Caption"))[0].outerHTML;
            var expressionFields = ej.buildTag("label.lblexpression", pivotObj._getLocalizedLabels("Expression"), {})[0].outerHTML + ej.buildTag("textarea#" + pivotObj._id + "_expressionFieldCM.e-textarea e-droppable expressionFieldCM" + (pivotObj.model.enableRTL ? " e-rtl" : ""), "", {}).attr("aria-label", pivotObj._getLocalizedLabels("Expression"))[0].outerHTML;
            var memberFields = ej.buildTag("label.lblmemberType", pivotObj._getLocalizedLabels("MemberType"), {})[0].outerHTML + ej.buildTag("input#" + pivotObj._id + "_memberTypeFieldCM.memberTypeFieldCM", "", {}).attr("aria-label", pivotObj._getLocalizedLabels("MemberType"))[0].outerHTML + ej.buildTag("input#" + pivotObj._id + "_dimensionFieldCM.dimensionFieldCM", "", {}).attr("aria-label", "dimension")[0].outerHTML;
            var formatFields = ej.buildTag("label.lblformat", pivotObj._getLocalizedLabels("FormatString"), {})[0].outerHTML + ej.buildTag("input#" + pivotObj._id + "_formatFieldCM.formatFieldCM", "", {}).attr("aria-label", pivotObj._getLocalizedLabels("FormatString"))[0].outerHTML + ej.buildTag("input#" + pivotObj._id + "_customFormatFieldCM.customFormatFieldCM", "", {}).attr("aria-label", "custom format")[0].outerHTML;

            var fieldPanel = ej.buildTag("div.e-calcMemberFieldPanel", captionFields + expressionFields + memberFields + formatFields, {})[0].outerHTML;

            var okBtn = ej.buildTag("button#" + pivotObj._id + "_btnOk.e-btnCalcMemberOk", pivotObj._getLocalizedLabels("OK"), {}, { name: pivotObj._getLocalizedLabels("OK") }).attr("aria-label", pivotObj._getLocalizedLabels("OK")).attr("title", pivotObj._getLocalizedLabels("OK").replace(/(<([^>]+)>)/ig, ""))[0].outerHTML;
            var cancelBtn = ej.buildTag("button#" + pivotObj._id + "_btnCancel.btnCalcMemberCancel", pivotObj._getLocalizedLabels("Cancel"), {}, { name: pivotObj._getLocalizedLabels("Cancel") }).attr("aria-label", pivotObj._getLocalizedLabels("Cancel")).attr("title", pivotObj._getLocalizedLabels("Cancel").replace(/(<([^>]+)>)/ig, ""))[0].outerHTML;
            var dialogFooter = ej.buildTag("div.e-calcMemberFooter", okBtn + cancelBtn, {})[0].outerHTML;

            pivotObj._calcMemberDialog = ej.buildTag("div#" + pivotObj._id + "_calcMemberDialog", treeviewPanel + fieldPanel + dialogFooter, {})[0].outerHTML;
            $(pivotObj._calcMemberDialog).appendTo("#" + pivotObj._id);
            $("#" + pivotObj._id + "_calcMemberDialog").ejDialog({
                width: "auto",
                title: pivotObj._getLocalizedLabels("CalculatedMember"),
                cssClass: pivotObj.model.cssClass + " e-calcMemberDialog",
                enableModal: false,
                target: "#" + pivotObj._id,
                enableRTL: pivotObj.model.enableRTL,
                enableResize: false,
                close: ej.proxy(function () { ej.Pivot.closePreventPanel(pivotObj) }, pivotObj),
                beforeOpen: ej.proxy(function () {
                    pivotObj.element.find(".e-calcMemberDialog .e-dialog").css("display", "block");
                }, pivotObj)
            });
            pivotObj._calcMemberDialog = pivotObj.element.find("#" + pivotObj._id + "_calcMemberDialog").data("ejDialog");
            $("#" + pivotObj._id + "_btnCancel").ejButton({
                type: ej.ButtonType.Button, width: "80px", enableRTL: pivotObj.model.enableRTL, click: ej.proxy(function () {
                    pivotObj._calcMemberDialog.close();
                    pivotObj._selectedCalcMember = null;
                    ej.Pivot.closePreventPanel(pivotObj);
                },pivotObj)
            });
            $("#" + pivotObj._id + "_btnOk").ejButton({
                type: ej.ButtonType.Button, width: "80px", enableRTL: pivotObj.model.enableRTL, click: ej.proxy(function () {
                    if ($.trim(pivotObj.element.find("#" + pivotObj._id + "_captionFieldCM").val()) == "" || $.trim(pivotObj.element.find("#" + pivotObj._id + "_expressionFieldCM").val()) == "") {
                        ej.Pivot._createErrorDialog(pivotObj._getLocalizedLabels("EmptyField"), pivotObj._getLocalizedLabels("Warning"), pivotObj);
                        return;
                    }
                    else if (pivotObj.element.find("#" + pivotObj._id + "_formatFieldCM").val() == "Custom" && $.trim(pivotObj.element.find("#" + pivotObj._id + "_customFormatFieldCM").val()) == "") {
                        ej.Pivot._createErrorDialog(pivotObj._getLocalizedLabels("EmptyFormat"), pivotObj._getLocalizedLabels("Warning"), pivotObj);
                        return;
                    }
                    if (ej.isNullOrUndefined(pivotObj._selectedCalcMember)) {
                        for (var i = 0; i < pivotObj._calcMembers.length; i++) {
                            if ($.trim(pivotObj.element.find("#" + pivotObj._id + "_captionFieldCM").val()).toLowerCase() == pivotObj._calcMembers[i].name.toLowerCase()) {
                                if (confirm(pivotObj._getLocalizedLabels("Confirm")))
                                    pivotObj._selectedCalcMember = $.trim(pivotObj.element.find("#" + pivotObj._id + "_captionFieldCM").val());
                                else
                                    return;
                                //ej.Pivot._createErrorDialog(pivotObj._getLocalizedLabels("DuplicateCalcMeasure"), pivotObj._getLocalizedLabels("Warning"), pivotObj);
                            }
                        }
                    }
                    //pivotObj._calcMembers.push({ name: $.trim(pivotObj.element.find("#" + pivotObj._id + "_captionFieldCM").val()), expression: $.trim(pivotObj.element.find("#" + pivotObj._id + "_expressionFieldCM").val()) });
                    pivotObj._calcMemberDialog.close();
                    ej.Pivot.closePreventPanel(pivotObj);
                    //if (!ej.isNullOrUndefined(pivotObj._selectedCalcMember)) {
                    //    var liElement = pivotObj.element.find(".e-cubeTreeView .calcMemberCDB").parents("li").find("li");
                    //    for (var i = 0; i < liElement.length; i++) {
                    //        if ($(liElement[i]).text().toLowerCase() == pivotObj._selectedCalcMember.toLowerCase()) {
                    //            pivotObj._calcMemberTreeObj.updateText($(liElement[i]).attr("id"), $.trim(pivotObj.element.find("#" + pivotObj._id + "_captionFieldCM").val()));
                    //            if ($(liElement[i]).children("div").find("> .e-text")[0] != null)
                    //                $(liElement[i]).children("div").find("> .e-text")[0].lastChild.nodeValue = $.trim(pivotObj.element.find("#" + pivotObj._id + "_captionFieldCM").val());
                    //            liElement[i].setAttribute("expression", $.trim(pivotObj.element.find("#" + pivotObj._id + "_expressionFieldCM").val()));
                    //            liElement[i].setAttribute("formatString", pivotObj.element.find("#" + pivotObj._id + "_formatFieldCM").val() == "Custom" ? $.trim(pivotObj.element.find("#" + pivotObj._id + "_customFormatFieldCM").val()) : pivotObj.element.find("#" + pivotObj._id + "_formatFieldCM").val());
                    //            liElement[i].setAttribute("nodeType", pivotObj.element.find("#" + pivotObj._id + "_memberTypeFieldCM").val() == "Measure" ? 0 : 1);
                    //        }
                    //    }
                    //    for (var i = 0; i < pivotObj._calcMembers.length; i++) {
                    //        if (pivotObj._calcMembers[i].name.toLowerCase() == pivotObj._selectedCalcMember.toLowerCase()) {
                    //            pivotObj._calcMembers[i].name = $.trim(pivotObj.element.find("#" + pivotObj._id + "_captionFieldCM").val());
                    //            pivotObj._calcMembers[i].expression = $.trim(pivotObj.element.find("#" + pivotObj._id + "_expressionFieldCM").val());
                    //            pivotObj._calcMembers[i].formatString = pivotObj.element.find("#" + pivotObj._id + "_formatFieldCM").val() == "Custom" ? $.trim(pivotObj.element.find("#" + pivotObj._id + "_customFormatFieldCM").val()) : pivotObj.element.find("#" + pivotObj._id + "_formatFieldCM").val();
                    //            pivotObj._calcMembers[i].nodeType = pivotObj.element.find("#" + pivotObj._id + "_memberTypeFieldCM").val() == "Measure" ? 0 : 1;
                    //        }
                    //    }
                    //}
                    var calcMemberTag = "";
                    if (!ej.isNullOrUndefined(pivotObj._selectedCalcMember)) {
                        var calcMember = ej.DataManager(pivotObj._calcMembers).executeLocal(ej.Query().where("name", "equal", pivotObj._selectedCalcMember, true));
                        if (!ej.isNullOrUndefined(calcMember) && calcMember.length > 0)
                            calcMemberTag = calcMember[0].tag;
                    }
                    
                    pivotObj._waitingPopup.show();
                    var eventArgs = ({ "action": "calculatedMember", "olapReport": pivotObj.currentReport, "clientReports": pivotObj.reports, "caption": pivotObj.currentCubeName + "%" + $.trim(pivotObj.element.find("#" + pivotObj._id + "_captionFieldCM").val()), expression: $.trim(pivotObj.element.find("#" + pivotObj._id + "_expressionFieldCM").val()), memberType: pivotObj.element.find("#" + pivotObj._id + "_memberTypeFieldCM").val(), dimension: pivotObj.element.find("#" + pivotObj._id + "_dimensionFieldCM").val(), formatString: pivotObj.element.find("#" + pivotObj._id + "_formatFieldCM").val() == "Custom" ? $.trim(pivotObj.element.find("#" + pivotObj._id + "_customFormatFieldCM").val()) : pivotObj.element.find("#" + pivotObj._id + "_formatFieldCM").val(), "uniqueName": calcMemberTag, "customObject": pivotObj.model.customObject });
                    if (pivotObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                        pivotObj.doAjaxPost("POST", pivotObj.model.url + "/" + pivotObj.model.serviceMethodSettings.calculatedMember, JSON.stringify(eventArgs), pivotObj._calcMemberDroppedSuccess);
                    }
                    else {
                        eventArgs.caption = eventArgs.caption.replace("%", "");
                        var uniqName = "";
                        if (eventArgs.memberType.toLowerCase().indexOf("measure") > -1)
                            uniqName = "[Measures].[" + $.trim(eventArgs.caption) + "]";
                        else
                            uniqName = $(jQuery("[id*='[" + eventArgs.dimension + "]']")[0]).attr("data-defaulthierarchy") + ".[" + $.trim(eventArgs.caption) + "]";
                        var calcMember = {
                            caption: eventArgs.caption, expression: eventArgs.expression, tag: uniqName,
                            hierarchyUniqueName: "[" + $.trim(eventArgs.dimension) + "]." + "[" + $.trim(eventArgs.dimension) + "]", // $(jQuery("[id*='[" + eventArgs.dimension + "]']")[0]).attr("data-defaulthierarchy"),
                            memberType: (eventArgs).memberType,
                            formatString: (eventArgs.formatString ? eventArgs.formatString : (eventArgs.format ? eventArgs.format : null))
                        };
                        if ((eventArgs).memberType.toLowerCase().indexOf("measure") == -1 && pivotObj._selectedCalcMember != null)
                            ej.Pivot.getReportItemByFieldName(this._schemaData._selectedFieldName, this.model.dataSource).item.hierarchyUniqueName = calcMember.hierarchyUniqueName;
                        pivotObj._selectedCalcMember = null;
                        var newItem = { "id": eventArgs.caption, "pid": "_0", "name": eventArgs.caption, "hasChildren": false, "spriteCssClass": "e-calcMemberCDB e-icon", "tag": uniqName, "expression": eventArgs.expression, "formatString": null, "nodeType": 0, "hierarchyUniqueName": (eventArgs).memberType == "Measure" ? "" : calcMember.hierarchyUniqueName }
                        var isExist = false;
                        var calcTreeItems = [{ id: "_0", name: "Calculated Members", hasChildren: true, spriteCssClass: "e-calcMemberGroupCDB e-icon", tag: "" }];
                        var calcElement = calcMember.caption;
                        pivotObj.model.calculatedMembers = $.grep(pivotObj.model.calculatedMembers, function (item, index) {
                            if (item.caption == calcElement) {
                                isExist = true;
                                item.caption = calcMember.caption; item.expression = calcMember.expression;
                                item.hierarchyUniqueName = calcMember.hierarchyUniqueName; item.memberType = eventArgs.memberType;
                                item.formatString = eventArgs.formatString;
                            }
                            return item;
                        });

                        var fields = pivotObj.element.find(".e-schemaFieldTree").data("ejTreeView").model.fields;
                        if (fields.dataSource[0].id != "_0")
                            fields.dataSource.splice(0, 0, calcTreeItems[0]);

                        if (!isExist)
                            pivotObj.model.calculatedMembers.push(calcMember);
                        else {
                            var fName = this._schemaData._selectedFieldName;
                            fields.dataSource =  $.grep(fields.dataSource, function (item, idx) {
                                if (item.id == fName)
                                {
                                    item.expression = calcMember.expression;
                                    item.hierarchyUniqueName = calcMember.hierarchyUniqueName;
                                    item.expression = calcMember.expression;
                                    item.memberType = calcMember.memberType;
                                    item.formatString = calcMember.formatString;
                                }
                                return item;
                            });
                        }
                        //pivotObj.element.find(".e-schemaFieldTree").data("ejTreeView").model.fields = fields;
                        if (!isExist) 
                            fields.dataSource.push(newItem);
                        else
                            pivotObj.refreshControl();

                        ej.Pivot._refreshFieldList(pivotObj);
                    }
                }, pivotObj)
            });
          
            pivotObj.element.find("#" + pivotObj._id + "_cubeTreeViewCalcMember").ejTreeView({
                fields: { id: "id", parentId: "pid", text: "name", spriteCssClass: "spriteCssClass", dataSource: calcMemberTreeData },
                allowDragAndDrop: true,
                enableRTL: pivotObj.model.enableRTL,
                allowDropChild: false,
                allowDropSibling: false,
                dragAndDropAcrossControl: true,
                cssClass: 'calcMemberTreeViewDragedNode',
                nodeDropped: ej.proxy(function (args) {
                    if (args.target != null && args.target.attr("id") == "" + pivotObj._id + "_expressionFieldCM")
                        pivotObj.element.find("#" + pivotObj._id + "_expressionFieldCM").val(pivotObj.element.find("#" + pivotObj._id + "_expressionFieldCM").val() + $(args.droppedElement).attr('data-tag'));
                }, pivotObj),
                beforeExpand: ej.proxy(ej.Pivot._getMemberChildNodes, pivotObj),
            });
            pivotObj.element.find("#" + pivotObj._id + "_captionFieldCM").ejMaskEdit({
                name: "inputbox",
                inputMode: ej.InputMode.Text,
                watermarkText: "",
                maskFormat: "",
                textAlign: pivotObj.model.enableRTL ? "right" : "left",
                width: "100%"
            });
            pivotObj.element.find("#" + pivotObj._id + "_customFormatFieldCM").ejMaskEdit({
                name: "inputbox",
                inputMode: ej.InputMode.Text,
                watermarkText: "",
                maskFormat: "",
                textAlign: pivotObj.model.enableRTL ? "right" : "left",
                width: "100%",
                cssClass: "e-calcMemberCustomFormat"
            });
            pivotObj.element.find(".e-calcMemberCustomFormat").css("visibility", "hidden");
            pivotObj.element.find("#" + pivotObj._id + "_memberTypeFieldCM").ejDropDownList({
                dataSource: [{ text: "Measure", value: "Measure" }, { text: "Dimension", value: "Dimension" }], enableRTL: pivotObj.model.enableRTL,
                width: "100%", selectedIndex: 0, change: ej.proxy(function (args) {
                    if (args.text == "Dimension")
                        pivotObj.element.find(".e-calcMemberDimensionField").css("visibility", "visible");
                    else
                        pivotObj.element.find(".e-calcMemberDimensionField").css("visibility", "hidden");
                }, pivotObj)
            });

            var dimensions = ej.DataManager(calcMemberTreeData).executeLocal(ej.Query().where("spriteCssClass", "contains", "e-dimensionCDB"));
            var dimensionNames = [];
            for (var i = 0; i < dimensions.length; i++) {
                dimensionNames.push({ text: dimensions[i].name, value: dimensions[i].name })
            }
            pivotObj.element.find("#" + pivotObj._id + "_dimensionFieldCM").ejDropDownList({
                dataSource: dimensionNames,selectedIndex: 0,
                width: "100%", enableRTL: pivotObj.model.enableRTL, cssClass: "e-calcMemberDimensionField"
            });
            pivotObj.element.find(".e-calcMemberDimensionField").css("visibility", "hidden");
            pivotObj.element.find("#" + pivotObj._id + "_formatFieldCM").ejDropDownList({
                dataSource: [{ text: "Standard", value: "Standard" }, { text: "Currency", value: "Currency" }, { text: "Percent", value: "Percent" }, { text: "Custom", value: "Custom" }],
                enableRTL: pivotObj.model.enableRTL, selectedIndex: 0,
                width: "100%", enableRTL: pivotObj.model.enableRTL, change: ej.proxy(function (args) {
                    if (args.text == "Custom")
                        pivotObj.element.find(".e-calcMemberCustomFormat").css("visibility", "visible");
                    else
                        pivotObj.element.find(".e-calcMemberCustomFormat").css("visibility", "hidden");
                }, pivotObj)
            });
            var treeViewElements = pivotObj.element.find(".e-cubeTreeViewCalcMember").find("li");
            for (var i = 0; i < treeViewElements.length; i++) {
                if (!ej.isNullOrUndefined($(treeViewElements[i]).attr("id")))
                    $(treeViewElements[i]).attr("data-tag", ej.DataManager(calcMemberTreeData).executeLocal(ej.Query().where("id", "equal", $(treeViewElements[i]).attr("id")))[0].tag);
            }
            var folders = pivotObj.element.find(".e-cubeTreeViewCalcMember .e-folderCDB");
            for (var i = 0; i < folders.length; i++) {
                $(folders[i].parentElement).removeClass("e-draggable");
            }
            if (pivotObj.element.find(".e-cubeTreeViewCalcMember .calcMemberGroupCDB").length > 0)
                pivotObj.element.find(".e-cubeTreeViewCalcMember .calcMemberGroupCDB").parent().removeClass("e-draggable");
            pivotObj._calcMemberTreeObj = pivotObj.element.find('.e-cubeTreeViewCalcMember').data("ejTreeView");
            if (!ej.isNullOrUndefined(pivotObj._selectedCalcMember)) {
                var calcMember = {};
                if (pivotObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                    calcMember  = ej.DataManager(pivotObj._calcMembers).executeLocal(ej.Query().where("name", "equal", pivotObj._selectedCalcMember));
                else
                    calcMember = ej.DataManager(pivotObj.model.calculatedMembers).executeLocal(ej.Query().where("caption", "equal", pivotObj._selectedCalcMember));
                if (calcMember.length > 0) {

                    var nodeType = 0;
                    if (pivotObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                        nodeType = calcMember[0].nodeType;
                    else {
                        nodeType = (calcMember.length > 0 && calcMember[0].memberType && (calcMember[0].memberType == "dimension" || calcMember[0].memberType == "Dimension")) ? 1 : 0;
                    }
                    pivotObj.element.find("#" + pivotObj._id + "_captionFieldCM").val((calcMember[0].caption || calcMember[0].name));
                    pivotObj.element.find("#" + pivotObj._id + "_expressionFieldCM").val(calcMember[0].expression);
                    pivotObj.element.find("#" + pivotObj._id + "_memberTypeFieldCM").data("ejDropDownList").selectItemsByIndices(nodeType);
                    if (nodeType == 1) {
                        var tag =(pivotObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) ? calcMember[0].tag : calcMember[0].hierarchyUniqueName;
                        var dimensionName = tag.split(".")[0].replace(/\[/g, "").replace(/\]/g, "");
                        var dimensionFieldLen = pivotObj.element.find("#" + pivotObj._id + "_dimensionFieldCM").data("ejDropDownList").model.dataSource;
                        for (var i = 0; i < dimensionFieldLen.length; i++) {
                            if (dimensionFieldLen[i].value == dimensionName)
                                pivotObj.element.find("#" + pivotObj._id + "_dimensionFieldCM").data("ejDropDownList").selectItemsByIndices(i);
                        }
                    }
                    if (!ej.isNullOrUndefined(calcMember[0].formatString)) {
                        if (calcMember[0].formatString == "Standard")
                            pivotObj.element.find("#" + pivotObj._id + "_formatFieldCM").data("ejDropDownList").selectItemsByIndices(0);
                        else if (calcMember[0].formatString == "Currency")
                            pivotObj.element.find("#" + pivotObj._id + "_formatFieldCM").data("ejDropDownList").selectItemsByIndices(1);
                        else if (calcMember[0].formatString == "Percent")
                            pivotObj.element.find("#" + pivotObj._id + "_formatFieldCM").data("ejDropDownList").selectItemsByIndices(2);
                        else {
                            pivotObj.element.find("#" + pivotObj._id + "_formatFieldCM").data("ejDropDownList").selectItemsByIndices(3);
                            pivotObj.element.find("#" + pivotObj._id + "_customFormatFieldCM").val(calcMember[0].formatString);
                        }
                    }
                }
            }
            //$(".cubeBrowserHierarchy").ejScroller({ height: "300px", width: "300px" });
            //$("#calcMemberDialog").addClass("e-scheduledialog").find(".e-titlebar").addClass("e-dialogheader");
            pivotObj._waitingPopup.hide();
        },

        _refreshFieldList:function(pivotObj){
            var schemObj = pivotObj.element.find(".e-schemaFieldTree").data("ejTreeView");
            schemObj.refresh();
            var treeDataSource = schemObj.model.fields.dataSource;
            var liElements = pivotObj.element.find(".e-schemaFieldTree li");
            for (var i = 0; i < $(liElements).length; i++) {
                var eleID = $($(liElements)[i]).attr("id");
                var temp = $.map(treeDataSource, function (item, index) {
                    if (item.id == eleID) {
                        return { tag: item.tag, expression: item.expression, defaultHierarchy: item.defaultHierarchy };
                    };
                });
                if (temp.length > 0 && temp[0] != "") {
                    $($(liElements)[i]).attr("data-tag", temp[0].tag);
                    if (!ej.isNullOrUndefined(temp[0].expression))
                        $($(liElements)[i]).attr("expression", temp[0].expression)
                    if (!ej.isNullOrUndefined(temp[0].defaultHierarchy))
                        $($(liElements)[i]).attr("data-defaultHierarchy", temp[0].defaultHierarchy)
                }
            }
        },
        _getMemberChildNodes: function (args) {
            if ($(args.currentElement).find("a > span")[0].className.indexOf("level") > -1 || $(args.currentElement).find("a > span")[0].className.indexOf("member") > -1) {
                var blankNode = ej.DataManager(this._calcMemberTreeObj.dataSource()).executeLocal(ej.Query().where("pid", "equal", $(args.currentElement).attr("id")).where("name", "equal", "(Blank)"));
                if (!ej.isNullOrUndefined(blankNode) && blankNode.length > 0) {
                    this._calcMemberTreeObj.hideNode(blankNode[0].id);
                    this.pNode = args.currentElement;
                    this._waitingPopup.show();
                    var nodeType = $(args.currentElement).find("a > span")[0].className.indexOf("level") > -1 ? "level" : "member";
                    if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                        var dimProp = "dimension properties CHILDREN_CARDINALITY, MEMBER_TYPE";
                        var dataSource = this.model.dataSource;
                        var calcMemberTreeObj = this.element.find(".e-cubeTreeViewCalcMember").data("ejTreeView");
                        var selectedMember = $.map(calcMemberTreeObj.model.fields.dataSource, function (item, index) {
                            if (item.id == $(args.currentElement).attr("id")) { return item; }
                        });
                        if (!($(args.currentElement).children("ul").children().length > 1)) {
                            if (selectedMember.length > 0)
                                this._calcExpanded = selectedMember[0];
                            var mdxQuery = "select {" + $(args.currentElement).attr("data-tag") + ".members" + "}" + dimProp + " on 0 from [" + $.trim(dataSource.cube) + "]";
                            var xmla = ej.olap._mdxParser.getSoapMsg(mdxQuery, dataSource.data, dataSource.catalog);
                            var conStr = ej.olap.base._getConnectionInfo(dataSource.data);
                            this.doAjaxPost("POST", conStr.url, { XMLA: xmla }, ej.proxy(this._generateCalculatedMember, this), null, { action: "fetchMembers" });
                        }
                        else if (this._waitingPopup)
                            this._waitingPopup.hide();
                    }
                    else {
                        if (this.model.beforeServiceInvoke != null)
                            this._trigger("beforeServiceInvoke", { action: "fetchMemberChildNodes", element: this.element, customObject: this.model.customObject });
                        var serializedCustomObject = JSON.stringify(this.model.customObject);
                        this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.fetchMemberTreeNodes, JSON.stringify({ "action": "fetchMemberChildNodes", "dimensionName": $(args.currentElement).attr('data-tag') + ":" + nodeType + ":" + $(args.currentElement).attr("id"), "olapReport": this.currentReport, "customObject": serializedCustomObject }), ej.proxy(ej.Pivot._fetchMemberSuccess, this));
                    }
                }
            }
        },
        _fetchMemberSuccess: function (data) {
            var childNodes = [];
            if (data.length > 1 && data[0] != undefined)
                childNodes = JSON.parse(data[0].Value);
            else if (data.d != undefined)
                childNodes = JSON.parse(data.d[0].Value);
            else
                childNodes = JSON.parse(data.MemberChildNodes);
            if (this.model.afterServiceInvoke != null)
                this._trigger("afterServiceInvoke", { action: "fetchMemberChildNodes", element: this.element, customObject: this.model.customObject });
            this._calcMemberTreeObj.model.beforeExpand = null;
            this._calcMemberTreeObj.addNode(childNodes, $(this.pNode));
           // this._calcMemberTreeObj.addNode()
            var blankNode = ej.DataManager(this._calcMemberTreeObj.dataSource()).executeLocal(ej.Query().where("pid", "equal", $(this.pNode).attr("id")).where("name", "equal", "(Blank)"));
            if (!ej.isNullOrUndefined(blankNode) && blankNode.length > 0) {
                this._calcMemberTreeObj.removeNode(blankNode[0].id);
            }
            $.each($(this.pNode).children().find("li"), function (index, value) {
                value.setAttribute("data-tag", childNodes[index].tag);
            });
            var elements = $(this.pNode).children().find("li");
            for (i = 0; i < elements.length; i++) {
                if (childNodes[i].hasChildren == true) {
                    this._calcMemberTreeObj.addNode({ id: childNodes[i].id + "_Blank_" + i, name: "(Blank)", parentId: childNodes[i].id }, elements[i]);
                    this.element.find("#" + childNodes[i].id).find('> div > div:first').removeClass("e-process");
                    this._calcMemberTreeObj.collapseNode(this.element.find("#" + childNodes[i].id));
                }
            }
            this._calcMemberTreeObj.model.beforeExpand = ej.proxy(ej.Pivot._getMemberChildNodes, this);
            this._waitingPopup.hide();
        },
        _drillThroughCellClick: function (args, gridObj) {
            gridObj._waitingPopup.show();
            var measures, measureGrp, controlObj;
            var cellPos = $(args.currentTarget.parentElement).attr('data-p');
            if (gridObj.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                controlObj = ($(gridObj.element).parents(".e-pivotclient").length > 0 || $(gridObj.element).parents(".e-maximumView").length > 0) ? gridObj._pivotClientObj : gridObj;
                controlObj.doAjaxPost("POST", controlObj.model.url + "/" + controlObj.model.serviceMethodSettings.drillThroughDataTable, JSON.stringify({ "currentReport": JSON.parse(gridObj.getOlapReport()).Report, "layout": gridObj.model.layout, "cellPos": cellPos, "selector": "", "customObject": JSON.stringify(controlObj.model.customObject) }), function (args) {
                    controlObj._trigger("drillThrough", { element: gridObj.element, data: args });
                });
            }
            else {
                var rowSpan = $("#" + gridObj._id).find("tbody").find('tr:first').find('th').length;
                for (i = 0; i < rowSpan; i++) {
                    var rowInfo = (gridObj.getJSONRecords()[parseInt((i * gridObj._rowCount) + parseInt(cellPos.split(",")[1]))].Info.indexOf("Measures") != -1 || gridObj.getJSONRecords()[parseInt((i * gridObj._rowCount) + parseInt(cellPos.split(",")[1]))].RowSpan <= 1) ? gridObj.getJSONRecords()[parseInt((i * gridObj._rowCount) + parseInt(cellPos.split(",")[1]))].Info.split("::")[0] : "";
                    if (rowInfo.indexOf("Measures") != -1)
                        measures = rowInfo;
                    if (rowInfo != "")
                        gridObj._rowHeader[i] = rowInfo;
                }
                var columnHeaderCount = $("#" + gridObj._id).find("tbody").find('[p="' + parseInt(cellPos.split(",")[0]) + "," + parseInt(cellPos.split(",")[1]) + '"]').closest('tbody').prev().children('tr').length;
                for (i = 0; i < columnHeaderCount; i++) {
                    var colInfo = (gridObj.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * gridObj._rowCount) + i)].Info.indexOf("Measures") != -1 || gridObj.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * gridObj._rowCount) + i)].ColSpan <= 1) ? gridObj.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * gridObj._rowCount) + i)].Info.split("::")[0] : "";
                    if (colInfo.indexOf("Measures") != -1)
                        measures = colInfo;
                    if (colInfo != "")
                        gridObj._colHeader[i] = colInfo;
                }
                if (ej.isNullOrUndefined(gridObj._fieldData) || (!ej.isNullOrUndefined(gridObj._fieldData) && ej.isNullOrUndefined(gridObj._fieldData.hierarchy)))
                    gridObj._getFieldItemsInfo(gridObj);
                for (j = 0; j < gridObj._fieldData.measures.length; j++) {
                    if (measures == gridObj._fieldData.measures[j].id)
                        gridObj.measureGrp = gridObj._fieldData.measures[j].pid
                }
                gridObj._rowHeader = $.grep(gridObj._rowHeader, function (n) { return n == 0 || n });
                gridObj._colHeader = $.grep(gridObj._colHeader, function (n) { return n == 0 || n });
                gridObj._createDrillThroughQuery("", gridObj);
            }
        },
        openHierarchySelector: function (e, data) {
            if (e.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                this._createDrillThroughDialog(e, data);
            else {
                var controlObj;
                e._waitingPopup.show();
                if (e.target.className.indexOf("e-pivotclient") >= 0)
                    controlObj = e._pivotGrid;
                else controlObj = e;
                var conStr = controlObj._getConnectionInfo(e.model.dataSource.data);
                var pData = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"><Header/><Body><Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><RequestType>MDSCHEMA_MEASUREGROUP_DIMENSIONS</RequestType><Restrictions><RestrictionList><CATALOG_NAME>" + e.model.dataSource.catalog + "</CATALOG_NAME><CUBE_NAME>" + e.model.dataSource.cube + "</CUBE_NAME><MEASUREGROUP_NAME>" + controlObj.measureGrp + "</MEASUREGROUP_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>" + e.model.dataSource.catalog + "</Catalog> <LocaleIdentifier>" + conStr.LCID + "</LocaleIdentifier></PropertyList></Properties></Discover></Body></Envelope>";
                this.doAjaxPost("POST", conStr.url, { XMLA: pData }, controlObj._loadDimensionElements, null, { pvtGridObj: controlObj, action: "loadMeasureElements" });
            }
        },
        
        _createDrillThroughDialog: function (args, dataSourceInfo) {
            if (args.model.operationalMode != ej.PivotGrid.OperationalMode.ServerMode)
                dataSourceInfo.shift();
            args.element.find(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog), .e-clientDialog").remove();
            var textTitle = ej.buildTag("label#", args._getLocalizedLabels("SelectHierarchy"))[0].outerHTML;
            var textArea = "<br><textarea id='hrSel' style='width:270px; height:300px; resize:none; margin:0px 5px 0 5px'></textarea></br><br>",
            browserPanel = "<div class=e-cubeTable style='width:200px; overflow:auto'><div valign=\"bottom\">" + this._createHierarchyBrowser() + "</div></div>";
            var dialogContent = ej.buildTag("div#dropDlg.dropDlg", "<table class=\"e-outerTable\"><tr><td>" + browserPanel + "</td><td>" + textTitle + textArea + "</td></tr></table>")[0].outerHTML + "</br>",
            dialogFooter = ej.buildTag("div", ej.buildTag("button#btnOK.dialogBtnOK", args._getLocalizedLabels("OK")).attr("title", args._getLocalizedLabels("OK").replace(/(<([^>]+)>)/ig, ""))[0].outerHTML + ej.buildTag("button#btnCancel.dialogBtnCancel", args._getLocalizedLabels("Cancel")).attr("title", args._getLocalizedLabels("OK").replace(/(<([^>]+)>)/ig, ""))[0].outerHTML, { "float": "right", "margin": "-5px 0 6px" })[0].outerHTML,
            ejDialog = ej.buildTag("div#clientDialog.e-clientDialog", dialogContent + dialogFooter, { "opacity": "1" }).attr("title", "Hierarchy Selector")[0].outerHTML;
            $(ejDialog).appendTo("#" + args._id);
            $("#btnOK, #btnCancel").ejButton();
            $("#btnOK, #btnCancel").css({ margin: "0 20px 20px 0", width: "50px" });
            args.element.find(".e-clientDialog").ejDialog({ width: 550, target: "#" + args._id, enableResize: false, enableRTL: args.model.enableRTL, close: ej.proxy(ej.Pivot.closePreventPanel, args) });
            args.element.find(".cubeTreeViewHierarchy").ejTreeView({
                showCheckbox: true,
                fields: { id: "id", parentId: "pid", text: "name", isChecked: "isSelected", spriteCssClass: "spriteCssClass", dataSource: args.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ?ej.isNullOrUndefined(dataSourceInfo.d) ? $.parseJSON(dataSourceInfo) : $.parseJSON(dataSourceInfo.d) : dataSourceInfo },
                allowDragAndDrop: true,
                allowDropChild: false,
                allowDropSibling: false,
                enableRTL: args.model.enableRTL ? true : false,
                beforeDelete: function () {
                    return false;
                },
                dragAndDropAcrossControl: true,
                nodeDropped: ej.proxy(this._hierarchyNodeDropped, args),
            });
            args._tableTreeObj = args.element.find(".cubeTreeViewHierarchy").data("ejTreeView");
            args._tableTreeObj.element.find(".e-ul").css({ "width": "100%", "height": "100%" });
            args._tableTreeObj.element.find(".e-chkbox-wrap").remove();
            var treeViewElements = args._tableTreeObj.element.find("li");
            for (var i = 0; i < treeViewElements.length; i++) {
                var tagValue = args.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? ej.isNullOrUndefined(dataSourceInfo.d) ? $.parseJSON(dataSourceInfo)[i].tag : $.parseJSON(dataSourceInfo.d)[i].tag : dataSourceInfo[i].tag
                treeViewElements[i].setAttribute("data-tag", tagValue);
            }
            if (args._tableTreeObj) {
                args._tableTreeObj.element.find("li").mouseover(ej.proxy(function (evt) {
                    if ($(evt.target).parent().find(".e-measureGroupCDB, .e-dimensionCDB, .e-folderCDB").length > 0)
                        $(evt.target).css("cursor", "default");
                }, args));
            }
            var grid = args;
            $("#btnOK").click(function () {
                var text = $("#hrSel").val();
                $(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog), .e-clientDialog, .drilltableDialog").remove();
                grid._waitingPopup.show();
                ej.olap._mdxParser._createDrillThroughQuery(text, grid);
                grid._waitingPopup.hide();
            });
            $("#btnCancel").click(function () {
                $(".e-dialog:not(.e-calcMemberDialog, .e-calcMemberDialog .e-dialog), .e-clientDialog").remove();
                grid._waitingPopup.hide()
            });
            if (args.model.enableRTL) {
                $('.e-dialog').addClass("e-rtl");
                $('.dialogBtnCancel').css("margin", "0 -70px 0 0");
            }
        },

        _createHierarchyBrowser: function (cubeTreeInfo) {
            return ej.buildTag("div.cubeBrowserHierarchy", ej.buildTag("div.cubeTreeViewHierarchy")[0].outerHTML, { width: "200px", height: "300px", overflow: "auto" })[0].outerHTML;
        },

        _hierarchyNodeDropped: function (sender) {
            if (sender.dropTarget[0].id == "hrSel") {
                var target;
                if ($($(sender.droppedElement).children()[0]).find(".e-dimensionCDB").length > 0)
                    target = this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? $(sender.droppedElement).find("li:first").attr('data-tag') : $(sender.droppedElement).find("li:first")[0].id;
                else if ($(sender.droppedElement).find("li:first").length == 0)
                    target = this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? $(sender.droppedElement.parent().parent()).attr('data-tag') : $(sender.droppedElement.parent().parent())[0].id;
                else
                    target = this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? $(sender.droppedElement).attr('data-tag') : sender.droppedElementData.id;
                if (!ej.isNullOrUndefined(target)) {
                target = target.replace("[", "[$");
                for (var i = 0; i < $("#hrSel").val().split(",").length; i++) {
                    if (target == $("#hrSel").val().split(",")[i])
                        return false;
                }
                var tex = this.element.find('#hrSel').val();
                if (tex.length != 0) {
                    tex = tex + ',' + target;
                    this.element.find('#hrSel').val(tex);
                }
                else
                    this.element.find('#hrSel').val(target);
            }
            }
        },

        _generateDrillData: function (customArgs, args) {
            var tag = $(args).find("row").children();
            var json = $.map(tag, function (a) {
                var num = parseFloat(a.textContent);
                var text = a.tagName.replace(/_x005B_/g, "[").replace(/_x0020_/g, " ").replace(/_x005D_/g, "]").replace(/_x0024_/g, "$").replace("].[", "]-[");
                return '"' + text + '"' + ":" + num;
            })
            var value = json[0], gridJSON = "";
            for (var i = 0; i < json.length; i++) {
                if (json[i] == value) {
                    gridJSON += gridJSON == "" ? "[{" + json[i] : "}, {" + json[i];
                    continue;
                }
                gridJSON += "," + json[i];
            }
            gridJSON += "}]";
            if ($(customArgs.pvtGridObj.element).parents(".e-pivotclient").length > 0){
                $(customArgs.pvtGridObj.element).parents(".e-pivotclient").data("ejPivotClient")._trigger("drillThrough", { element: customArgs.pvtGridObj.element, data: gridJSON });
            }
            else
                customArgs.pvtGridObj._trigger("drillThrough", { element: customArgs.pvtGridObj.element, data: gridJSON });
        },

        _getFilterState: function (olapClientMode, members, item, controlObj) {
            var filterState = "";
            if (controlObj.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                if (olapClientMode) {
                    if (ej.isNullOrUndefined(ej.olap.base.olapCtrlObj))
                        ej.olap.base.olapCtrlObj = controlObj;
                    if (controlObj._fieldSelectedMembers[item.fieldName.toLowerCase()] == "All" || ej.isNullOrUndefined(controlObj._fieldSelectedMembers[item.fieldName.toLowerCase()]))
                        ej.olap._mdxParser.getAllMember(controlObj.model.dataSource, item.fieldName, controlObj);
                    filterState = (controlObj._fieldSelectedMembers[item.fieldName.toLowerCase()] == "All" || ej.isNullOrUndefined(controlObj._fieldSelectedMembers[item.fieldName.toLowerCase()]) ? controlObj._allMember : controlObj._fieldSelectedMembers[item.fieldName.toLowerCase()]);
                }
                else {
                    if (item.filterItems.filterType == "include") {
                        if (item.filterItems.values.length == 1)
                            filterState = item.filterItems.values[0];
                        else
                            filterState = controlObj._getLocalizedLabels("MultipleItems");
                    }
                    else {
                        if (members.length - (item.filterItems.values.indexOf("All") == -1 ? item.filterItems.values.length : item.filterItems.values.length - 1) == 1)
                            filterState = members.filter(function (itm) { if (item.filterItems.values.indexOf(itm) == -1) return itm });
                        else
                            filterState = controlObj._getLocalizedLabels("MultipleItems");
                    }
                }
            }
            else
            {
                if (controlObj.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    var excludeMem = !ej.isNullOrUndefined(controlObj._tempFilterData) ? $.map(controlObj._tempFilterData, function (itm) { return itm[item.DimensionName] }) : [];
                    if (excludeMem.length > 0 && controlObj._fieldMembers[item.DimensionName])
                        filterState = controlObj._fieldMembers[item.DimensionName].length - excludeMem.length == 1 ? (controlObj._fieldMembers[item.DimensionName]).filter(function (itm) { if (excludeMem.indexOf(itm) == -1) return itm }) : controlObj._getLocalizedLabels("MultipleItems");
                    else
                        filterState = controlObj._getLocalizedLabels("All");
                }
                else {
                    filterState = (controlObj._fieldSelectedMembers[item.Tag] == "All" ? item.AllMember : controlObj._fieldSelectedMembers[item.Tag]) || item.AllMember;
                }
            }
            return filterState;
        },

        _getTreeViewItems: function (controlObj, editorTreeData) {
            var treeElement = controlObj.element.find(".e-editorTreeView");
            var treeItems = [];
            var data = $(treeElement).find(':input.nodecheckbox');
            for (var i = 0; i < data.length; i++) {
                var parentNode = $(data[i]).parents('li:eq(0)');
                treeItems.push({ Id: parentNode[0].id, name: $(parentNode[0]).find('a:eq(0)').text() });
            }
            return treeItems;
        },

        _getEditorMember: function (data, controlObj, isSchema) {
            var editorTreeData = isSchema ? controlObj._schemaData._editorTreeData : controlObj._editorTreeData, nodes = [];
            if (controlObj.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {                
                if (editorTreeData.length == 0) {
                    var tmpItems = this._getTreeViewItems(isSchema ? controlObj._schemaData : controlObj, editorTreeData);
                    var ds = $.extend(true, [], isSchema ? controlObj._schemaData._memberTreeObj.dataSource() : controlObj._memberTreeObj.dataSource());
                    var treeItems = $.map(tmpItems, function (item1) {
                        if (item1.Id != "All") {
                            $.map(ds, function (item2) {
                                if (item1.Id == item2.id) {
                                    item1 = item2;
                                    item1.name = ej.isNullOrUndefined(item1.parentId) ? item1.name + "_" + 1 : item1.name;
                                }
                            });
                            return item1;
                        }
                    });
                    var items = $.map(treeItems, function (item1) {
                        $.map(treeItems, function (item2) {
                            if (item1.parentId == item2.id) {
                                item1.name = item1.name + "_" + (Number(item2.name.split('_')[item2.name.split('_').length - 1]) + 1);
                            }
                        });
                        return item1;
                    });
                    $.map(items, function (item) {
                        var val = item.name.split('_')[item.name.split('_').length - 2];
                        var lvl = Number(item.name.split('_')[item.name.split('_').length - 1]);
                        var chkState = item.checkedStatus;
                        nodes.push({ name: val, checked: chkState, level: Number(lvl) });
                    });
                } else {
                    $.map(editorTreeData, function (item) {
                        nodes.push({ name: item.name, id: item.id, pid: item.pid, checked: item.checkedStatus, level: item.level });
                    });
                }
                return this._updateEditorMembers(data, nodes, controlObj, editorTreeData);
            }
            else {
                if (controlObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    var treeElement = isSchema ? controlObj._schemaData.element.find('.e-editorTreeView') : controlObj.element.find(".e-editorTreeView");
                    var items = editorTreeData.length > 0 ? editorTreeData : $(treeElement).find(':input.nodecheckbox');
                    if (editorTreeData.length > 0) {
                        $.map(items, function (item) {
                            nodes.push({ name: item.name, id: item.id, pid: item.pid, checked: item.checkedStatus, level: Number(item.id.split('_')[item.id.split('_').length - 1]) });
                        });
                    }
                    else {
                        $.map(items, function (item) {
                            if ($(item).parents('li:eq(0)').attr("id") != "All") {
                                var val = $(item).parent().siblings('a').text();
                                var lvl = item.value.split('_')[item.value.split('_').length - 1];
                                var chkState = item.checked || $(item.parentElement).attr('aria-checked') == 'mixed' ? true : false;
                                nodes.push({ name: val, checked: chkState, level: Number(lvl) });
                            }
                        });
                    }
                    return this._updateEditorMembers(data, nodes, controlObj, editorTreeData);
                }
                else {
                    var textArr = [];
                    for (var i = 1; i < data.length; i++)
                        textArr.push($(data[i].parentElement).siblings("a").text());
                    return textArr;
                }
            }
        },

        _updateEditorMembers: function (data, nodes, controlObj, editorTreeData) {
            if (nodes.length > 0 && nodes[0].name == "All")
                nodes.splice(0, 1);
            if (!ej.isNullOrUndefined(controlObj._fieldMembers[data])) {
                if (editorTreeData.length == 0) {
                    var tmpArray = [], buffer = 0, member = "";
                    var savedFields = controlObj._fieldMembers[data];
                    for (var i = 0; i < nodes.length; i++) {
                        if (ej.isNullOrUndefined(savedFields[i + buffer]) || nodes[i].level == savedFields[i + buffer].level) {
                            tmpArray.push(nodes[i]);
                        }
                        else if (ej.isNullOrUndefined(savedFields[i + buffer]) || nodes[i].level < savedFields[i + buffer].level) {
                            var count = i;
                            do {
                                if (nodes[i - 1].checked)
                                    tmpArray.push(savedFields[count]);
                                buffer++;
                                count++;
                            } while (nodes[i].level < savedFields[count].level);
                            i--;
                        }
                        else if (ej.isNullOrUndefined(savedFields[i + buffer]) || nodes[i].level > savedFields[i + buffer].level) {
                            var svdlvl = savedFields[i + buffer].level;
                            var count = i;
                            do {
                                tmpArray.push(nodes[count]);
                                buffer--;
                                count++;
                                i = count - 1;
                            } while (nodes[count].level > svdlvl);
                        }
                    }
                    controlObj._fieldMembers[data] = tmpArray;
                }
                else {
                    var tmpItems = $.extend(true, [], controlObj._fieldMembers[data]), newItems = [];
                    $.each(nodes, function (idx, itm) {
                        var isItemAdded = false;
                        for (var i = 0; i < tmpItems.length; i++) {
                            if (itm.id == tmpItems[i].id) {
                                tmpItems.splice(i, 1, itm);
                                isItemAdded = true;
                                break;
                            }                            
                        }
                        if (!isItemAdded)
                            newItems.push(itm);
                    });
                    controlObj._fieldMembers[data] = tmpItems.concat(newItems);
                }
            }

            controlObj._fieldMembers[data] = ej.isNullOrUndefined(controlObj._fieldMembers[data]) ? nodes : controlObj._fieldMembers[data];

            var lvl = 1, parent = "", state = "", checkedMembers = [];
            do {
                var lvlMembers = $.map(controlObj._fieldMembers[data], function (item) {
                  if (item.level == lvl)
                        return item;
                });
                checkedMembers = $.map(lvlMembers, function (item) {
                    if (item.checked)
                        return item;
                });
                if (lvlMembers.length == checkedMembers.length) {
                    member = lvl == 1 ? "All" : parent;
                    if (lvlMembers.length > 1)
                    state = "All";
                    lvl++;
                }
                else if (checkedMembers.length == 1) {
                    parent = member = state == "All" ? "multiple" : checkedMembers[0].name;
                    lvl++;
                }
                else if (checkedMembers.length > 1 && lvlMembers.length > checkedMembers.length) {
                    member = "multiple";
                    break;
                }
            } while (checkedMembers.length > 0 && member != "All" && member != "multiple" && $.map(controlObj._fieldMembers[data], function (item) { if (item.level == lvl) return item; }).length > 0);

            return member;
        },

        _getTreeData: function (args, successMethod, customArgs) {
            var conStr = ej.olap.base._getConnectionInfo(args.url);
            var xmlMsg = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"><Header/><Body><Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><RequestType>" + args.request + "</RequestType><Restrictions><RestrictionList><CATALOG_NAME>" + args.catalog + "</CATALOG_NAME>" +
           (customArgs.action == "loadcubelist" ? "" : "<CUBE_NAME>" + args.cube + "</CUBE_NAME>") + "</RestrictionList></Restrictions><Properties><PropertyList><Catalog>" + args.catalog + "</Catalog><LocaleIdentifier>" + conStr.LCID + "</LocaleIdentifier> </PropertyList></Properties></Discover></Body></Envelope>";
            customArgs.action = "loadFieldElements";
            this.doAjaxPost("POST", conStr.url, { XMLA: xmlMsg }, successMethod, null, customArgs);
        },        

        updateTreeView: function (controlObj) {
            var treeViewElements = controlObj.element.find(".e-editorTreeView").find("li"),treeViewLength = treeViewElements.length, dataSource = controlObj._memberTreeObj.dataSource(),dSourceLen = dataSource.length;
            if (controlObj.element.find(".e-editorTreeView").parents("#" + controlObj._id + "_ClientDialog").find(".e-editorPara").text() == controlObj._getLocalizedLabels("KPIs")) {
                for (var i = 0; i < treeViewLength; i++) {
                    var isAreaChecked = $(treeViewElements[i]).find("span:first").attr('aria-checked');
                    for (var j = 0; j < dSourceLen; j++) {
                        if (treeViewElements[i]["id"] == dataSource[j]["id"] && (isAreaChecked == "mixed" || isAreaChecked == "true")) {
                            {
                                if (ej.isNullOrUndefined(dataSource[j]["parentId"]))
                                    dataSource[j]["checkedStatus"] = true;
                                else if ($(treeViewElements[i]["parentElement"]).parent().attr("id") == dataSource[j]["parentId"])
                                    dataSource[j]["checkedStatus"] = true;
                            }
                        }
                        else if (treeViewElements[i]["id"] == dataSource[j]["id"] && isAreaChecked == "false") {
                            {
                                if (ej.isNullOrUndefined(dataSource[j]["parentId"]))
                                    dataSource[j]["checkedStatus"] = false;
                                else if ($(treeViewElements[i]["parentElement"]).parent().attr("id") == dataSource[j]["parentId"])
                                    dataSource[j]["checkedStatus"] = false;
                            }
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < treeViewLength; i++) {
                    var isAreaChecked = $(treeViewElements[i]).find("span:first").attr('aria-checked');
                    for (var j = 0; j < dSourceLen; j++) {
                        if (treeViewElements[i]["id"] == dataSource[j]["id"] && (isAreaChecked == "mixed" || isAreaChecked == "true")) {
                            dataSource[j]["checkedStatus"] = true;
                            break;
                        }
                        else if (treeViewElements[i]["id"] == dataSource[j]["id"] && isAreaChecked == "false") {
                            dataSource[j]["checkedStatus"] = false;
                            break;
                        }
                    }
                }
            }
            for (var i = 0; i < dataSource.length; i++) {
                var memberStatus = false;
                if (dataSource[i]["checkedStatus"] == true) {
                    for (var j = 0; j < dataSource.length; j++) {
                        if (dataSource[j].hasOwnProperty("parentId") && dataSource[j]["parentId"] == dataSource[i]["id"] && dataSource[j]["checkedStatus"] == true) {
                            memberStatus = true;
                            break;
                        }
                    }
                    if (!memberStatus) {
                        for (var m = 0; m < dataSource.length; m++) {
                            if (dataSource[m].hasOwnProperty("parentId") && dataSource[m]["parentId"] == dataSource[i]["id"])
                                dataSource[m]["checkedStatus"] = true;
                        }
                    }
                }
                else if (dataSource[i]["checkedStatus"] == false) {
                    for (var k = 0; k < dataSource.length; k++) {
                        if (dataSource[k].hasOwnProperty("parentId") && dataSource[k]["parentId"] == dataSource[i]["id"])
                            dataSource[k]["checkedStatus"] = false;
                    }
                }
            }
            for (var i = 0; i < treeViewLength; i++) {
                if ($(treeViewElements[i]).attr('data-tag') == null || undefined) {
                    for (var j = 0; j < dSourceLen; j++) {
                        if ($(treeViewElements[i]).attr("id") == dataSource[j]["id"]) {
                            $(treeViewElements[i]).attr("data-tag", dataSource[j]["tag"]);
                            break;
                        }
                    }
                }
            }
            return controlObj._memberTreeObj;
        },

        getNodesState: function (treeViewObj) {
            var selectedNodes = "", unSelectedNodes = "", dataSource = [];;
            if (treeViewObj.pluginName == "ejTreeView")
                dataSource = treeViewObj.dataSource();
            else
                dataSource = treeViewObj
            for (var i = 0; i < dataSource.length; i++) {
                if (dataSource[i].checkedStatus == true)
                    selectedNodes += "::" + dataSource[i].id + "||" + dataSource[i].tag + "||" + (dataSource[i].parentId || dataSource[i].pid) + "||" + dataSource[i].name;
                else
                    unSelectedNodes += "::" + (dataSource[i].parentId || dataSource[i].pid) + "||" + dataSource[i].tag + "||" + dataSource[i].name;
            }
            return { selectedNodes: selectedNodes, unSelectedNodes: unSelectedNodes };
        },

        removeParentSelectedNodes: function (selectedNodes) {
            var selectedElements = $.extend([], selectedNodes);
            for (var i = 0; i < selectedNodes.length; i++) {
                for (var j = 0; j < selectedElements.length; j++) {
                    if (selectedElements[j].Id == selectedNodes[i].parentId)
                        selectedElements.splice(j, 1);
                }
            }
            return $.map(selectedElements, function (element, index) { if (element.tag != "" && element.tag != undefined) return element.tag.replace(/\&/g, "&amp;") });
        },

        getChildNodes: function (args, currentHierarchy, treeViewCollection, dataSource, ctrlObj) {
            var selectedItem = args.targetElement, tagInfo, cubeName = dataSource.cube, catloagName = dataSource.catalog, url = dataSource.data, successMethod = ctrlObj._generateChildMembers, childCount = $(args.currentElement).find("li").length, isLoadOnDemand = false;
            var pageSettings = {
                memberEditorPageSize: ctrlObj.pluginName == "ejPivotSchemaDesigner" ? ctrlObj.model.pivotControl.model.memberEditorPageSize : ctrlObj.model.memberEditorPageSize,
                enableMemberEditorPaging: ctrlObj.pluginName == "ejPivotSchemaDesigner" ? ctrlObj.model.pivotControl.model.enableMemberEditorPaging : ctrlObj.model.enableMemberEditorPaging
            };
            if (pageSettings.enableMemberEditorPaging) {
                for (var i = 0; i < ctrlObj._memberTreeObj.dataSource().length; i++) {
                    if (ctrlObj._memberTreeObj.dataSource()[i].parentId == args.id || ctrlObj._memberTreeObj.dataSource()[i].pid == args.id) {
                        args.isChildLoaded = true;
                        ej.Pivot.closePreventPanel(ctrlObj);
                        return;
                    }
                }
            }
            else
                ctrlObj._isSearchApplied = false;
            jQuery.each(ctrlObj._editorTreeData, function (index, value) { if (value.id == args.id) { value.expanded = true; value.isChildMerged = true; return false; } });
            if (childCount == 0) {
                var onLoad = ej.buildTag("span.nodeExpand e-load e-icon")[0].outerHTML;
                var currMember = $(selectedItem).parents("li:eq(0)").attr("id");
                var reportItem = $.map(treeViewCollection, function (obj, index) {
                    if (obj["fieldName"] == currentHierarchy && !ej.isNullOrUndefined(obj["filterItems"])) {
                        var filterItems = obj["filterItems"];
                        if (ej.isNullOrUndefined(ctrlObj.model.pivotControl) ? ctrlObj.model.enableMemberEditorPaging : ctrlObj.model.pivotControl.model.enableMemberEditorPaging) {
                            filterItems = $.map(filterItems, function (obj, index) {
                                if (obj["pid"] != undefined && obj["pid"] == currMember.replace(/\]*\]/g, '-').replace(/\[*\[/g, '-')) {
                                    isLoadOnDemand = true;
                                    return obj;
                                }
                            });
                            if (filterItems.length > 0 && isLoadOnDemand == true) {
                                var collObj = ej.Pivot._generateChildWithAncestors(ctrlObj, $(selectedItem).parents("li:eq(0)"), pageSettings.enableMemberEditorPaging, pageSettings.memberEditorPageSize);
                                if (pageSettings.enableMemberEditorPaging && (filterItems.length >= pageSettings.memberEditorPageSize || collObj.lstChildren.length >= pageSettings.memberEditorPageSize)) {
                                    ctrlObj._isEditorDrillPaging = true;
                                    ctrlObj.element.find(".searchEditorTreeView").data("ejMaskEdit").clear();
                                    ctrlObj._lastSavedTree = [];
                                    ej.Pivot._makeAncestorsExpandable(ctrlObj, $(selectedItem).parents("li:eq(0)")[0].id);
                                    var parentNodeObj = collObj.allLvlLst.length > 1 && collObj.lstChildren.length >= pageSettings.memberEditorPageSize ? ej.Pivot._getParentsTreeList(ctrlObj, collObj.lstParents[0].id, ctrlObj._editorTreeData) : $.grep(ctrlObj._editorTreeData, function (value) { return value.id == $(selectedItem).parents("li:eq(0)")["0"].id; return false; })[0];
                                    var editorDrillParams = { childNodes: collObj.allLvlLst.length > 1 && collObj.lstChildren.length >= pageSettings.memberEditorPageSize ? collObj.lstChildren : filterItems, parentNode: parentNodeObj };
                                    ej.Pivot._drillEditorTreeNode(editorDrillParams, ctrlObj, pageSettings.memberEditorPageSize);
                                }
                                else {
                                    $(selectedItem).parents("li:eq(0)").find(".nodeExpand").remove();
                                    $(selectedItem).parents("li:eq(0)").removeClass("e-load");
                                    $.each(filterItems, function (index, value) { delete value.parentId });
                                    ctrlObj._onDemandNodeExpand = false;
                                    ctrlObj._memberTreeObj.addNode(ej.Pivot._showEditorLinkPanel(filterItems, ctrlObj, ctrlObj.pluginName == "ejPivotSchemaDesigner" ? ctrlObj.model.pivotControl : ctrlObj), $(selectedItem).parents("li:eq(0)"));
                                    ctrlObj._onDemandNodeExpand = false;
                                    ctrlObj._memberTreeObj.model.nodeCheck = ej.proxy(ctrlObj._nodeCheckChanges, ctrlObj);
                                    ctrlObj._memberTreeObj.model.nodeUncheck = ej.proxy(ctrlObj._nodeCheckChanges, ctrlObj);
                                    $.each($(selectedItem).parents("li:eq(0)").find("li"), function (index, value) { if (!ej.isNullOrUndefined(filterItems[index])) value.setAttribute("data-tag", filterItems[index].tag); });
                                }
                            }
                        }
                        else {
                            $.map(filterItems, function (obj, index) {
                                if (obj["parentId"] != undefined && obj["parentId"] == currMember.replace(/\]*\]/g, '-').replace(/\[*\[/g, '-') || obj["pid"] != undefined && obj["pid"] == currMember.replace(/\]*\]/g, '-').replace(/\[*\[/g, '-'))
                                    isLoadOnDemand = true;
                            });
                        }
                    }
                });
                isLoadOnDemand ? args.isChildLoaded = true : args.isChildLoaded = false
                if (!isLoadOnDemand) {
                    $(selectedItem).parents("li:eq(0)").prepend(onLoad);
                    if ($(selectedItem).parents("li:eq(0)").attr('data-tag') == undefined) {
                        var filterItem = $.map(treeViewCollection, function (obj, index) { if (obj["fieldName"] == currentHierarchy) return obj; })[0]
                        if (filterItem)
                            $.map(filterItem["filterItems"], function (obj, index) { if (obj["id"] == $(selectedItem).parents("li:eq(0)").attr("id")) $(selectedItem).parents("li:eq(0)").attr("data-tag", obj["tag"]); });
                    }
                    var uniqueName = $(selectedItem).parents("li:eq(0)").attr('data-tag').replace(/\&/g, "&amp;");
                    ej.olap._mdxParser.getChildren(dataSource, uniqueName, ctrlObj);
                }
                else
                    if (jQuery.grep(ctrlObj._editorTreeData, function (value) { if (value.pid == args.id) { return value; } }).length > 10)
                        ctrlObj.element.find("a.e-linkPanel").css("display", "block");
            }
        },
        _getFilterParams: function (droppedClass, tempFilterData, headerText) {
            var filterParams = "";
            if (droppedClass != "schemaValue") {
                var filterData = "";
                if (!ej.isNullOrUndefined(tempFilterData)) {
                    for (var i = 0; i < tempFilterData.length; i++) {
                        if (!ej.isNullOrUndefined(tempFilterData[i][headerText])) {
                            for (var j = 0; j < tempFilterData[i][headerText].length; j++) {
                                filterData += "##" + tempFilterData[i][headerText][j];
                            }
                        }
                    }
                }
                if (filterData != "")
                    filterParams = droppedClass + "::" + headerText + "::FILTERED" + filterData;
            }
            return filterParams;
        },
        generateChildMembers: function (customArgs, args) {
            var data = $(args).find("Axis:eq(0) Tuple"), treeViewData = [], parentNode;
            var controlObj = this;
            if (!ej.isNullOrUndefined(controlObj.olapCtrlObj))
                controlObj = controlObj.olapCtrlObj;
            var pageSettings = {
                memberEditorPageSize: controlObj.pluginName == "ejPivotSchemaDesigner" ? controlObj.model.pivotControl.model.memberEditorPageSize : controlObj.model.memberEditorPageSize,
                enableMemberEditorPaging: controlObj.pluginName == "ejPivotSchemaDesigner" ? controlObj.model.pivotControl.model.enableMemberEditorPaging : controlObj.model.enableMemberEditorPaging
            };
            var reportItems = {
                currentReportItems: controlObj.pluginName == "ejPivotSchemaDesigner" ? controlObj.model.pivotControl._currentReportItems : controlObj._currentReportItems,
                savedReportItems: controlObj.pluginName == "ejPivotSchemaDesigner" ? controlObj.model.pivotControl._savedReportItems : controlObj._savedReportItems
            };
           
            var pNode = controlObj.element.find("[data-tag='" + customArgs.currentNode.replace(/&amp;/g, "&") + "']");
            for (var i = 0; i < data.length; i++) {
                var memberUqName = $($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children().children()[0]).text();
                var memberName = $($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children()).find("Caption").text() == "" ? "(Blank)" : $($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children()).find("Caption").text();
                var treeNodeInfo = { hasChildren: $(data[i]).find("CHILDREN_CARDINALITY").text() != "0", checkedStatus: $($(pNode).find('input.nodecheckbox')[0]).parent().attr("aria-checked") == "true" ? true : false, id: memberUqName.replace(/\]*\]/g, '-').replace(/\[*\[/g, '-').replace(/ /g, "_"), name: memberName, tag: memberUqName, level: parseInt($(data[i]).find("LNum").text()) }
                treeViewData.push(treeNodeInfo);
            }
            if (treeViewData.length > 0 && controlObj.model.enableMemberEditorSorting && controlObj._sortType != null)
                treeViewData = ej.DataManager(treeViewData).executeLocal(ej.Query().sortBy("name", controlObj._sortType));
            if ($(pNode).parents("li").length > 1)
                parentNode = $(pNode).parents("li").first();
            else
                parentNode = $(pNode).parents("li");
            $($(parentNode).find('input.nodecheckbox')[0]).ejCheckBox({ checked: false })
            controlObj._memberTreeObj = controlObj.element.find(".e-editorTreeView").data("ejTreeView");
            if (treeViewData.length > 0) {
                var hierarchyName = controlObj.pluginName == "ejPivotGrid" ? controlObj._selectedField : controlObj._selectedFieldName;
                $.map(reportItems.currentReportItems, function (obj, index) {
                    if (obj["fieldName"] == hierarchyName && !ej.isNullOrUndefined(obj["filterItems"])) {
                        $.each(treeViewData, function (index, value) { value.pid = $(pNode).attr("id"); });
                        $.merge(obj["filterItems"], treeViewData);
                        controlObj._editorTreeData = obj["filterItems"];
                    }
                });
                if (reportItems.currentReportItems.length == 0)
                    controlObj._editorTreeData.concat(treeViewData);
            }
            pNode.find(".nodeExpand").remove();
            pNode.find(".e-load").removeClass("e-load");

            jQuery.each(controlObj._editorTreeData, function (index, value) { if (value.id == pNode["0"].id) { value.expanded = true; return false; } });
            if (pageSettings.enableMemberEditorPaging) {
                var collObj = ej.Pivot._generateChildWithAncestors(controlObj, pNode, pageSettings.enableMemberEditorPaging, pageSettings.memberEditorPageSize);
                if ((treeViewData.length >= pageSettings.memberEditorPageSize || collObj.lstChildren.length >= pageSettings.memberEditorPageSize)) {
                    controlObj._isEditorDrillPaging = true;
                    controlObj.element.find(".searchEditorTreeView").data("ejMaskEdit").clear();
                    controlObj._lastSavedTree = [];
                    ej.Pivot._makeAncestorsExpandable(controlObj, pNode[0].id);
                    var parentNodeObj = collObj.allLvlLst.length > 1 && collObj.lstChildren.length >= pageSettings.memberEditorPageSize ? ej.Pivot._getParentsTreeList(controlObj, collObj.lstParents[0].id, controlObj._editorTreeData) : $.grep(controlObj._editorTreeData, function (value) { return value.id == pNode["0"].id; return false; })[0];
                    var editorDrillParams = { childNodes: collObj.allLvlLst.length > 1 && collObj.lstChildren.length >= pageSettings.memberEditorPageSize ? collObj.lstChildren : treeViewData, parentNode: parentNodeObj };
                    ej.Pivot._drillEditorTreeNode(editorDrillParams, controlObj, pageSettings.memberEditorPageSize);
                }
                else
                    controlObj._memberTreeObj.addNode(ej.Pivot._showEditorLinkPanel(treeViewData, controlObj, controlObj.pluginName == "ejPivotSchemaDesigner" ? controlObj.model.pivotControl : controlObj), $(pNode));
            }
            else
                controlObj._memberTreeObj.addNode(ej.Pivot._showEditorLinkPanel(treeViewData, controlObj, controlObj.pluginName == "ejPivotSchemaDesigner" ? controlObj.model.pivotControl : controlObj), $(pNode));

            $.each(pNode.find("li"), function (index, value) { if (!ej.isNullOrUndefined(treeViewData[index])) value.setAttribute("data-tag", treeViewData[index].tag); });
            reportItems.savedReportItems = $.extend(true, [], reportItems.currentReportItems);
        },

        _generateChildWithAncestors: function (controlObj, parentNode, enableMemberEditorPaging, memberEditorPageSize) {
            var allLvlLst = [], lstParents = [$.grep(controlObj._editorTreeData, function (value) { return value.id == parentNode["0"].id; return false; })[0]], lstChildren = [];
            if (enableMemberEditorPaging) {
                jQuery.each(controlObj._editorTreeData, function (index, value) { if (value.id == parentNode["0"].id) { value.expanded = true; return false; } });
                allLvlLst.push(lstParents[0]);
                do {
                    var childList = [], lstChildren = [];
                    for (var cnt = 0; cnt < lstParents.length; cnt++) {
                        $.each(controlObj._editorTreeData, function (index, value) {
                            if (!ej.isNullOrUndefined(value.pid) && value.pid == lstParents[cnt].id) { if (value.expanded) { childList.push(value); allLvlLst.push(value) }; lstChildren.push(value); };
                        });
                        if (lstChildren.length >= memberEditorPageSize)
                            break;
                        else
                            lstChildren = [];
                    }
                    lstParents = (childList.length > 0 && lstChildren.length < memberEditorPageSize) ? childList : lstParents;
                    if (lstChildren.length >= memberEditorPageSize)
                        break;
                } while (childList.length > 0);
            }
            return { allLvlLst: allLvlLst, lstParents: lstParents, lstChildren: lstChildren };
        },
        _makeAncestorsExpandable: function (controlObj, parentId) {
            var parentNode = ej.DataManager(controlObj._editorTreeData).executeLocal(ej.Query().where("id", "equal", parentId));
            if (parentNode.length > 0) {
                parentNode[0].expanded = true;
                parentId = parentNode[0].pid;
            }            
            if (!ej.isNullOrUndefined(parentId) && parentNode.length > 0)
                this._makeAncestorsExpandable(controlObj, parentId);
        },

        _jsonToEngine: function (item) {
            var tempEngine = item;
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

        _cropJson: function (controlObj, data) {
            var i = 0, j = 0, removeHdr = 1, pivotReport = {};
            if (controlObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                pivotReport = {
                    columns: JSON.parse(controlObj.getOlapReport()).PivotColumns,
                    rows: JSON.parse(controlObj.getOlapReport()).PivotRows,
                    values: JSON.parse(controlObj.getOlapReport()).PivotCalculations
                };
            }
            else {
                pivotReport = {
                    columns: controlObj.model.dataSource.columns,
                    rows: controlObj.model.dataSource.rows,
                    values: controlObj.model.dataSource.values
                };
            }

            var rowSpan = pivotReport.columns.length + (pivotReport.values.length > 0 && pivotReport.values[0].axis != "rows" ? 1 : 0);
            var colSpan = pivotReport.rows.length + (pivotReport.values.length > 0 && pivotReport.values[0].axis == "rows" ? 1 : 0);
            rowSpan = rowSpan == 0 ? 1 : rowSpan;
            colSpan = colSpan == 0 ? 1 : colSpan;
            if (controlObj._drillAction == "" && controlObj.model.enableCollapseByDefault) {
                var pivotEngine = $.extend(true, [], ej.Pivot._jsonToEngine(data));
                if (rowSpan + colSpan > 2) {
                    while (j < pivotEngine[0].length) {
                        if ((pivotReport.rows.length > 1 && pivotEngine[0][j].CSS.indexOf("summary") == -1 && j + removeHdr > rowSpan) || (pivotReport.columns.length == 0 && pivotReport.values.length == 0 && pivotEngine[0][j].CSS.indexOf("summary") == -1) || (j > 0 && removeHdr < pivotReport.columns.length)) {
                            for (var k = 0; k < pivotEngine.length; k++)
                                pivotEngine[k].splice(j, 1);
                            removeHdr++;
                        }
                        else
                            j++;
                    }

                    removeHdr = 1;
                    while (i < pivotEngine.length) {
                        if ((pivotReport.columns.length > 1 && pivotEngine[i][0].CSS.indexOf("summary") == -1 && i + removeHdr > colSpan) || (pivotReport.rows.length == 0 && pivotReport.values.length == 0 && pivotEngine[i][0].CSS.indexOf("summary") == -1) || (i > 0 && removeHdr < pivotReport.rows.length)) {
                            pivotEngine.splice(i, 1);
                            removeHdr++;
                        }
                        else
                            i += pivotEngine[i][0].CSS.indexOf("summary") > -1 ? pivotEngine[i][0].ColSpan : 1;
                    }
                }

                pivotEngine = $.map(pivotEngine, function (itm) { return [$.map(itm, function (i) { if (i.CSS == "summary rstot" || i.CSS == "summary cstot" || i.CSS == "summary stot") { i.State = 2; i.Value = i.Value.replace("Total", ""); } return i })] });
                pivotEngine[0][0].ColSpan = pivotEngine[0][0].CSS == "none" && pivotReport.values.length > 0 && pivotReport.values[0].axis == "rows" && pivotReport.rows.length > 0 ? 2 : 1;
                pivotEngine[0][0].RowSpan = pivotEngine[0][0].CSS == "none" && pivotReport.values.length > 0 && pivotReport.values[0].axis != "rows" && pivotReport.columns.length > 0 ? 2 : 1;

                rowSpan = pivotReport.values.length > 0 && pivotReport.values[0].axis == "rows" ? pivotReport.values.length : 1;
                colSpan = pivotReport.values.length > 0 && pivotReport.values[0].axis != "rows" ? pivotReport.values.length : 1;
                for (var i = 0; i < pivotEngine[0].length; i++) {
                    if (pivotEngine[0][i].CSS.indexOf("summary") > -1) {
                        pivotEngine[0][i].RowSpan = rowSpan;
                        pivotEngine[0][i].ColSpan = 1;
                    }
                }
                for (var i = 0; i < pivotEngine.length; i++) {
                    if (pivotEngine[i][0].CSS.indexOf("summary") > -1) {
                        pivotEngine[i][0].ColSpan = colSpan;
                        pivotEngine[i][0].RowSpan = 1;
                    }
                }
                return $.map(pivotEngine, function (itm) { return itm });
            }
            else if (controlObj.model.enableCollapseByDefault || controlObj._drillAction != "") {
                var comRowCount = 0, pivotEngine = $.extend(true, [], ej.Pivot._jsonToEngine(controlObj._croppedJson)), compEngine = $.extend(true, [], ej.Pivot._jsonToEngine(controlObj._compJson));
                var compJson = $.extend(true, [], controlObj._compJson);
                var drillHeader = controlObj._drillParams.currRow == "" ? "column" : "row";
                for (var index = 0; index < controlObj._compJson.length; index++) {
                    if (parseInt(controlObj._compJson[index].Index.split(',')[0]) == 0)
                        comRowCount++;
                    else
                        break;
                }
                var posRange = ej.Pivot._getDrillRange(pivotReport, drillHeader, controlObj, comRowCount, compJson);
                var expandEngine = ej.Pivot._sliceJson(pivotReport, drillHeader, rowSpan, colSpan, controlObj, compJson, posRange.startPos, posRange.endPos, comRowCount, pivotEngine);
                if (controlObj._drillAction == "drilldown")
                    var mergedEngine = ej.Pivot._mergeJson(pivotReport, controlObj, drillHeader, rowSpan, colSpan, compJson, compEngine, pivotEngine, expandEngine, posRange.startPos, posRange.endPos, comRowCount);
                return $.map(controlObj._drillAction == "drilldown" ? mergedEngine : expandEngine, function (itm) { return itm });
            }
            else
                return data;
        },

        _getEnginePos: function (startPos,endPos,pivotEngine) {
            var rowPos = $.map(ej.isNullOrUndefined(pivotEngine[parseInt(startPos.split(',')[0])]) ? pivotEngine[parseInt(endPos.split(',')[0])] : pivotEngine[parseInt(startPos.split(',')[0])], function (item, index) {
                if (item.Index == item.Index.split(',')[0] + "," + endPos.split(',')[1])
                    return index;
            })[0];
            var colPos = $.map(pivotEngine, function (item, index) {
                var lock = false;
                $.each(item, function (idx, itm) {
                    if (itm.Index == endPos)
                        lock = true;
                })
                if (lock)
                    return index;
            })[0];
            return { "colPos": colPos, "rowPos": rowPos };
        },

        _mergeJson: function (pivotReport,controlObj, drillHeader, rowSpan, colSpan, json, compEngine, pivotEngine, expandEngine, startPos, endPos, rowCount) {
            var indexObj = ej.Pivot._getIndices(drillHeader, json, controlObj, pivotEngine,startPos, endPos, rowCount);
            var columnIndices = indexObj.columnIndices;
            var rowIndices = indexObj.rowIndices;
            var rSpan = indexObj.rowSpan;
            var cSpan = indexObj.colSpan;

            var posObj = ej.Pivot._getEnginePos(startPos, endPos, pivotEngine);
            var colPos = posObj.colPos, rowPos = posObj.rowPos;

            var tmpEngine = [];
            if (drillHeader == "row") {
                if (ej.isNullOrUndefined(pivotEngine[parseInt(startPos.split(',')[0]) + 1])) {
                    var sPos = parseInt(startPos.split(',')[0]) + 1;
                    do {
                        tmpEngine = $.map(compEngine[sPos], function (item) {
                            if (rowIndices.indexOf(parseInt(item.Index.split(',')[1])) > -1) {
                                item.Span = "Block";
                                return item;
                            }
                        })
                        pivotEngine[sPos] = tmpEngine;
                        sPos++;
                    } while (sPos < cSpan && !controlObj.model.enableCollapseByDefault);
                }
            }
            else {
                if (parseInt(pivotEngine[0][parseInt(startPos.split(',')[1]) + 1].Index.split(',')[1]) != (parseInt(startPos.split(',')[1]) + 1)) {
                    for (var i = 0; i < compEngine.length; i++) {
                        var sPos = parseInt(startPos.split(',')[1]) + 1;
                        do {
                            var item = compEngine[i][sPos];
                            if (columnIndices.indexOf(parseInt(item.Index.split(',')[0])) > -1) {
                                item.Span = "Block";
                                pivotEngine[i].splice(sPos, 0, item);
                            }
                            sPos++;
                        } while (sPos < rSpan && !controlObj.model.enableCollapseByDefault);
                    }
                }
            }
            if (drillHeader == "row") {
                var j = 0;
                for (var i = 0; i < pivotEngine.length; i++) {
                    if (!ej.isNullOrUndefined(pivotEngine[i])) {
                        var cnt = rowPos, expCnt = 0;
                        do {
                            if (cnt == rowPos)
                                pivotEngine[i].splice(cnt, 1, expandEngine[j][expCnt]);
                            cnt++;
                            expCnt++;
                            pivotEngine[i].splice(cnt, 0, expandEngine[j][expCnt]);
                        } while (ej.isNullOrUndefined(expandEngine[j][expCnt]) || parseInt(expandEngine[j][expCnt].Index.split(',')[1]) < parseInt(endPos.split(',')[1]));
                        j++;
                    }
                }
            }
            else {
                var j = expandEngine.length - 1;
                for (var i = colPos; i >= colSpan; i--) {
                    if (!ej.isNullOrUndefined(expandEngine[j])) {
                        pivotEngine.splice(i, 1, expandEngine[j]);
                    }
                    j--;
                }
            }
            return ej.Pivot._drillSpanCalculation(pivotEngine, controlObj);
        },

        _getIndices: function (drillHeader, json, controlObj, pivotEngine, startPos, endPos, rowCount) {
            var columnIndices = $.map(pivotEngine, function (item) { if (!ej.isNullOrUndefined(item)) { return parseInt(item[0].Index.split(',')[0]) } });
            var rowIndices = $.map(pivotEngine[0], function (item) { if (!ej.isNullOrUndefined(item)) { return parseInt(item.Index.split(',')[1]) } });
            if (controlObj.model.enableCollapseByDefault)
                drillHeader == "row" ? columnIndices.push(parseInt(startPos.split(',')[0]) + 1) : rowIndices.push(parseInt(startPos.split(',')[1]) + 1);
            else {
                var cell = json[(parseInt(endPos.split(',')[0]) * rowCount) + parseInt(endPos.split(',')[1])];
                var cps = parseInt(cell.Index.split(',')[0]), rps = parseInt(cell.Index.split(',')[1]), cSpan = cell.ColSpan, rSpan = cell.RowSpan;
                if (drillHeader == "row") {
                    for (var i = cps + 1; i < cSpan; i++) {
                        if (columnIndices.indexOf(i) == -1)
                            columnIndices.push(i);
                    }
                } else {
                    for (var i = rps + 1; i < rSpan; i++) {
                        if (rowIndices.indexOf(i) == -1)
                            rowIndices.push(i);
                    }
                }
            }
            return { "columnIndices": columnIndices, "rowIndices": rowIndices, "colSpan": cSpan, "rowSpan": rSpan };
        },

        _sliceJson: function (pivotReport,drillHeader, rowSpan, colSpan, controlObj, json, startPos, endPos, rowCount, pivotEngine) {
            var slicedJson = [], valCnt = (pivotReport.values.length > 0 && pivotReport.values[0].axis != "rows") ? 1 : 0;
            if (controlObj._drillAction == "drilldown") {
                var tmpStartPos = drillHeader == "row" ? (0 + "," + (parseInt(startPos.split(',')[1]))) : ((parseInt(startPos.split(',')[0])) + "," + 0);
                var tmpEndPos = drillHeader == "row" ? (0 + "," + (parseInt(endPos.split(',')[1]))) : ((parseInt(endPos.split(',')[0])) + "," + 0);
                var indexObj = ej.Pivot._getIndices(drillHeader, json, controlObj, pivotEngine, startPos, endPos, rowCount);
                var columnIndices = indexObj.columnIndices;
                var rowIndices = indexObj.rowIndices;

                var tmpCnt = (parseInt(tmpStartPos.split(',')[0]) * rowCount) + rowCount, enginePos = 0;;
                tmpStartPos = drillHeader == "row" ? tmpStartPos : ((parseInt(tmpStartPos.split(',')[0]) * rowCount) + "," + 0);
                do {
                    var jsonPos = drillHeader == "row" ? parseInt(tmpStartPos.split(',')[1]) : parseInt(tmpStartPos.split(',')[0]), enginePos = drillHeader == "row" ? 0 : enginePos;
                    while (!ej.isNullOrUndefined(json[jsonPos]) && (drillHeader == "column" ? (tmpCnt > jsonPos) : true)) {
                        if (drillHeader == "row" ? (columnIndices.indexOf(parseInt(json[jsonPos].Index.split(',')[0])) > -1) : (rowIndices.indexOf(parseInt(json[jsonPos].Index.split(',')[1])) > -1)) {
                            if (ej.isNullOrUndefined(slicedJson[enginePos]))
                                slicedJson[enginePos] = [];
                            slicedJson[enginePos].push(json[jsonPos]);
                            if (drillHeader == "row")
                                enginePos++;
                        }
                        jsonPos = jsonPos + (drillHeader == "row" ? rowCount : 1);
                    }
                    if (drillHeader == "column") {
                        tmpCnt = tmpCnt + rowCount;
                        enginePos++;
                    }
                    tmpStartPos = drillHeader == "row" ? (0 + "," + (parseInt(tmpStartPos.split(',')[1]) + 1)) : ((parseInt(tmpStartPos.split(',')[0]) + rowCount) + "," + 0);
                } while (tmpStartPos != (drillHeader == "row" ? (0 + "," + (parseInt(tmpEndPos.split(',')[1]) + 1)) : (((parseInt(tmpEndPos.split(',')[0]) + 1) * rowCount) + "," + 0)));

                if ((drillHeader == "row" ? (colSpan - 1 > parseInt(controlObj._drillParams.currPos.split(',')[0]) + 1) : (rowSpan - valCnt - 1 > parseInt(controlObj._drillParams.currPos.split(',')[1]) + 1)) && controlObj.model.enableCollapseByDefault) {
                    var rowPos = drillHeader == "row" ? 0 : parseInt(controlObj._drillParams.currPos.split(',')[1]) + 1;
                    var colPos = drillHeader == "row" ? parseInt(controlObj._drillParams.currPos.split(',')[0]) + 1 : 0;
                    do {                        
                        var isCropped = false;
                        if (!ej.isNullOrUndefined(slicedJson[colPos]) && !ej.isNullOrUndefined(slicedJson[colPos][rowPos]) && slicedJson[drillHeader == "row" ? colPos - 1 : colPos][drillHeader == "row" ? rowPos : rowPos - 1].CSS.indexOf("summary") == -1 && (slicedJson[colPos][rowPos].CSS == "rowheader" || slicedJson[colPos][rowPos].CSS == "colheader" || slicedJson[colPos][rowPos].CSS == "none" || slicedJson[colPos][rowPos].Value == "")) {
                            if (drillHeader == "row") {
                                for (var i = 0; i < slicedJson.length; i++) {
                                    if (!ej.isNullOrUndefined(slicedJson[i])) {
                                        slicedJson[i].splice(rowPos, 1);
                                        isCropped = true;
                                    }
                                }
                            }
                            else {
                                delete slicedJson[colPos];
                                isCropped = true;
                            }
                        }
                        if (drillHeader == "row") rowPos = isCropped ? rowPos : rowPos + 1; else colPos = colPos + 1;
                    } while (drillHeader == "row" ? (rowPos < slicedJson[0].length) : (colPos < slicedJson.length));
                }

                var colPos = parseInt(controlObj._drillParams.currPos.split(',')[0]) + (drillHeader == "row" ? 1 : 0), lock = "", rSpan = 0, cSpan = 0;
                var rowPos = parseInt(controlObj._drillParams.currPos.split(',')[1]) + 1;
                if (controlObj.model.enableCollapseByDefault) {
                    do {
                        if (drillHeader == "row" ? (colPos == parseInt(controlObj._drillParams.currPos.split(',')[0]) + 1) : (rowPos == parseInt(controlObj._drillParams.currPos.split(',')[1]) + 1)) {
                            for (var i = drillHeader == "row" ? (slicedJson[colPos].length - 1) : (slicedJson.length - 1) ; i >= 0; i--) {
                                if (drillHeader == "column" && ej.isNullOrUndefined(slicedJson[i]))
                                    continue;
                                var item = drillHeader == "row" ? slicedJson[colPos][i] : slicedJson[i][rowPos];
                                if (item.CSS.indexOf("summary") > -1) {
                                    item.State = 2;
                                    item.Expander = 1;
                                    var cPos = colPos, rPos = rowPos, span = 0;
                                    if (drillHeader == "row") {
                                        do { span++; cPos++; } while (!ej.isNullOrUndefined(pivotEngine[cPos]) && (pivotEngine[cPos][0].CSS == "none" || pivotEngine[cPos][0].Value == ""));
                                        item.ColSpan = span;
                                    }
                                    else {
                                        do { span++; rPos++; } while (!ej.isNullOrUndefined(pivotEngine[0][rPos]) && (pivotEngine[0][rPos].CSS == "none" || pivotEngine[0][rPos].Value == ""));
                                        item.RowSpan = span;
                                    }
                                    item.Value = item.Value.replace(" Total", "")
                                }
                            }
                        }
                        else {
                            var startCol = "";
                            if (drillHeader == "column")
                                startCol = $.map(slicedJson, function (item, index) { if (!ej.isNullOrUndefined(item)) return index; })[0];
                            for (var i = drillHeader == "row" ? (slicedJson[colPos].length - 1) : (slicedJson.length - 1) ; i >= 0; i--) {
                                if (drillHeader == "column" && ej.isNullOrUndefined(slicedJson[i]))
                                    continue;
                                var item = drillHeader == "row" ? slicedJson[colPos][i] : slicedJson[i][rowPos];
                                var currValue = item.Value.replace(" Total", "");
                                lock = lock == "" && item.Value.replace(" Total", "") != "" ? item.Value.replace(" Total", "") : (item.Value.replace(" Total", "") != "" && lock != item.Value.replace(" Total", "") ? item.Value.replace(" Total", "") : lock);

                                if (((currValue != "" && currValue != lock) || i == 0 || startCol == i)) {
                                    item.CSS = drillHeader == "row" ? "rowheader" : "colheader";
                                    item.State = 1;
                                    item.Expander = 1;
                                    item.Value = lock;
                                    if (drillHeader == "row")
                                        item.RowSpan = colPos > parseInt(controlObj._drillParams.currPos.split(',')[0]) - 1 ? rSpan : item.RowSpan;
                                    else
                                        item.ColSpan = rowPos > parseInt(controlObj._drillParams.currPos.split(',')[1]) - 1 ? cSpan : item.ColSpan;
                                    rSpan = 1;
                                    cSpan = 1;
                                }
                                else {
                                    if (item.CSS.indexOf("summary") > -1) {
                                        if (drillHeader == "row")
                                            item.ColSpan = parseInt(controlObj._drillParams.currPos.split(',')[0]) + 2 - colPos;
                                        else
                                            item.RowSpan = parseInt(controlObj._drillParams.currPos.split(',')[1]) + 2 - rowPos;
                                    }
                                    rSpan++;
                                    cSpan++;
                                }
                            }
                        }
                        drillHeader == "row" ? colPos-- : rowPos--;
                    } while (drillHeader == "row" ? (colPos >= 0) : (rowPos >= 0));
                }
            }
            else {
                var rowIndex = "";
                var posObj = ej.Pivot._getEnginePos(startPos, endPos, pivotEngine);
                var colPos = posObj.colPos, rowPos = posObj.rowPos;
                if (drillHeader == "row") {
                    var rowStartPos = 0;
                    $.each(pivotEngine[0], function (idx, itm) {
                        if (parseInt(itm.Index.split(',')[1]) == parseInt(startPos.split(',')[1])) {
                            rowStartPos = idx;
                            return false;
                        }
                    });
                    for (var i = parseInt(startPos.split(',')[1]) ; i < parseInt(endPos.split(',')[1]) ; i++) {                        
                        for (var j = 0; j < pivotEngine.length; j++) {
                            if (!ej.isNullOrUndefined(pivotEngine[j])) {
                                var index = "", item = "";
                                for (var rPos = rowStartPos; rPos < pivotEngine[j].length; rPos++) {
                                    if (parseInt(pivotEngine[j][rPos].Index.split(',')[1]) == i) {
                                        item = pivotEngine[j][rPos]; index = rPos;
                                        pivotEngine[j].splice(rPos, 1);
                                        break;
                                    }
                                }
                                if (!ej.isNullOrUndefined(pivotEngine[j][index]) && (pivotEngine[j][index].CSS == "none" || pivotEngine[j][index].Value == "" || (pivotEngine[j][index].CSS == "rowheader" && pivotEngine[j][index].Expander == 0)) && item.CSS == "rowheader") {
                                    pivotEngine[j][index].CSS = "rowheader";
                                    pivotEngine[j][index].Value = item.Value;
                                    pivotEngine[j][index].State = item.State;
                                    pivotEngine[j][index].Expander = item.Expander;
                                }
                            }
                        }
                    }
                }
                else {
                    var tmpEng = [];
                    for (var i = parseInt(startPos.split(',')[0]) ; i < parseInt(endPos.split(',')[0]) ; i++) {
                        tmpEng = tmpEng.length == 0 && !ej.isNullOrUndefined(pivotEngine[i]) ? pivotEngine[i] : tmpEng;
                        delete pivotEngine[i];
                        if (parseInt(endPos.split(',')[0]) - i == 1) {
                            var cnt = 0;
                            do {
                                if ((pivotEngine[i + 1][cnt].CSS == "none" || pivotEngine[i + 1][cnt].Value == "" || (pivotEngine[i + 1][cnt].CSS == "colheader" && pivotEngine[i + 1][cnt].Expander == 0))) {
                                    pivotEngine[i + 1][cnt].CSS = tmpEng[cnt].CSS;
                                    pivotEngine[i + 1][cnt].Value = tmpEng[cnt].Value;
                                    pivotEngine[i + 1][cnt].State = tmpEng[cnt].State;
                                    pivotEngine[i + 1][cnt].Expander = tmpEng[cnt].Expander;
                                }
                                cnt++;
                            } while (cnt <= parseInt(endPos.split(',')[1]));
                        }
                    }
                }
                var expSameColLen = drillHeader == "row" ? $.map(pivotEngine[parseInt(endPos.split(',')[0]) + 1], function (item) {
                    if (item.CSS == "rowheader" || item.CSS.indexOf("summary") > -1)
                        return item;
                }).length : $.map(pivotEngine, function (item) {
                    if (!ej.isNullOrUndefined(item) && !ej.isNullOrUndefined(item[rowPos + 1]) && (item[rowPos + 1].CSS == "colheader" || item[rowPos + 1].CSS.indexOf("summary") > -1))
                        return item;
                }).length;
                if (expSameColLen == 0) {
                    if (drillHeader == "row") {
                        var colPos = parseInt(endPos.split(',')[0]) + 1;
                        do {
                            delete pivotEngine[colPos];
                            colPos++;
                        } while (!ej.isNullOrUndefined(pivotEngine[colPos]) && (pivotEngine[colPos][0].CSS == "none" || pivotEngine[colPos][0].Value == ""));
                    } else {
                        var rowPos = parseInt(endPos.split(',')[1]) + 1;
                        do {
                            for (var i = 0; i < pivotEngine.length; i++) {
                                if (!ej.isNullOrUndefined(pivotEngine[i]))
                                    pivotEngine[i] = $.map(pivotEngine[i], function (item) { if (parseInt(item.Index.split(',')[1]) != rowPos) return item });;
                            }
                            rowPos++;
                        } while (rowPos < (pivotEngine[0][0].RowSpan - (pivotReport.values.length > 0 && pivotReport.values[0].axis != "rows" ? 1 : 0)));
                    }
                }
                posObj = ej.Pivot._getEnginePos(startPos, endPos, pivotEngine);
                colPos = posObj.colPos, rowPos = posObj.rowPos;
                if (drillHeader == "row") {
                    for (var i = 0; i < pivotEngine[parseInt(endPos.split(',')[0])].length; i++) {
                        if (pivotEngine[parseInt(endPos.split(',')[0])][i].Index == endPos) {
                            pivotEngine[parseInt(endPos.split(',')[0])][i].Value = pivotEngine[parseInt(endPos.split(',')[0])][i].Value.replace(" Total", "");
                            pivotEngine[parseInt(endPos.split(',')[0])][i].State = 2;
                            pivotEngine[parseInt(endPos.split(',')[0])][i].ColSpan = expSameColLen == 0 ? pivotEngine[parseInt(endPos.split(',')[0])][i].ColSpan - 1 : pivotEngine[parseInt(endPos.split(',')[0])][i].ColSpan;
                            break;
                        }
                    }
                } else {
                    pivotEngine[colPos][rowPos].Value = pivotEngine[colPos][rowPos].Value.replace(" Total", "");
                    pivotEngine[colPos][rowPos].State = 2;
                    pivotEngine[colPos][rowPos].RowSpan = expSameColLen == 0 ? pivotEngine[colPos][rowPos].RowSpan - 1 : pivotEngine[colPos][rowPos].RowSpan;
                }
                slicedJson = ej.Pivot._drillSpanCalculation(pivotEngine, controlObj);
            }
            return slicedJson;
        },

        _getDrillRange: function (pivotReport,drillHeader, controlObj, rowCount, json) {
            var i = 0,rowPos=0, startPos = "", endPos = "", clm = rowCount, drillParams = drillHeader == "row" ? controlObj._drillParams.currRow.split(">#>") : controlObj._drillParams.currCol.split(">#>");
            do {
                var calc = drillHeader == "row" ? parseInt((i - 1) / rowCount) : rowPos;
                if (calc + 1 == drillParams.length) {                    
                    if ((((json[i].CSS == "none" || json[i].Value == "") && !ej.isNullOrUndefined(json[drillHeader == "row" ? (i - rowCount) : (i - 1)]) && typeof (json[drillHeader == "row" ? (i - rowCount) : (i - 1)].Value) == "string" && json[drillHeader == "row" ? (i - rowCount) : (i - 1)].Value.replace(" Total", "") == $.trim(drillParams[calc < 1 ? 0 : (calc - 1)])) || (typeof (json[i].Value) == "string" && json[i].Value != "" && json[i].Value.replace(" Total", "") != $.trim(drillParams[calc]))) && startPos != "") {
                        var tIndex = drillHeader == "row" ? i - 1 : i - rowCount;
                        while (!ej.isNullOrUndefined(json[tIndex]) && json[tIndex].CSS != "summary rstot" && json[tIndex].CSS != "summary cstot" && json[tIndex].CSS != "summary stot") {
                            tIndex = drillHeader == "row" ? tIndex - 1 : tIndex - rowCount;
                        }
                        if (!ej.isNullOrUndefined(json[tIndex]))
                            endPos = json[tIndex].Index;
                        break;
                    }
                    else if (typeof (json[i].Value) == "string" && json[i].Value.replace(" Total", "") == $.trim(drillParams[calc]))
                        startPos = startPos == "" ? json[i].Index : startPos;
                }
                else {
                    if (json[i].Value.replace(" Total", "") == $.trim(drillParams[calc]))
                        i = drillHeader == "row" ? ((clm * (calc + 1)) + (i - 1)) : ((i - clm) + 1);
                }
                i = drillHeader == "row" ? i + 1 : i + rowCount;
                rowPos = i % rowCount;
                if (drillHeader == "column" && i > json.length) {
                    rowPos++;
                    i = rowPos;
                }
            } while (json.length > i && endPos == "");
            if (controlObj._drillAction == "drillup" && controlObj.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                if (drillHeader == "column" && pivotReport.values.length > 0 && pivotReport.values[0].axis != "row")
                    endPos = (parseInt(endPos.split(',')[0]) - (pivotReport.values.length - 1)) + "," + endPos.split(',')[1];
                else if (drillHeader == "row" && pivotReport.values.length > 0 && pivotReport.values[0].axis == "row")
                    endPos = endPos.split(',')[0] + "," + (parseInt(endPos.split(',')[1]) - (pivotReport.values.length - 1));
            }
            return { "startPos": startPos, "endPos": endPos };
        },

        _drillSpanCalculation: function (pivotEngine, controlObj) {
            var pivotValues = controlObj.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? JSON.parse(controlObj.getOlapReport()).PivotCalculations : controlObj.getOlapReport().values;
            var pivotColumns = controlObj.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? JSON.parse(controlObj.getOlapReport()).PivotColumns : controlObj.getOlapReport().columns;
            var pivotRows = controlObj.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? JSON.parse(controlObj.getOlapReport()).PivotRows : controlObj.getOlapReport().rows;
            var emptyRows = [], tmpEngine = [];
            var availLength = $.map(pivotEngine, function (item) { if (!ej.isNullOrUndefined(item)) return item[0] }).length;
            for (var i = 0; i < pivotEngine[0].length; i++) {
                var cnt = 0, hdrCellsCnt = 0;
                for (var j = 0; j < pivotEngine.length; j++) {
                    if (!ej.isNullOrUndefined(pivotEngine[j]) && !ej.isNullOrUndefined(pivotEngine[j][i])) {
                        cnt++;
                        if (pivotEngine[j][i].ColSpan > ((availLength - cnt) + 1))
                            pivotEngine[j][i].ColSpan = (availLength - cnt) + 1;
                        if (pivotEngine[j][i].CSS != "none" && pivotEngine[j][i].Value != "")
                            hdrCellsCnt++;
                    }
                }
                if (hdrCellsCnt == 0) emptyRows.push(i);
            }
            for (var i = 0; i < pivotEngine.length; i++) {
                if (!ej.isNullOrUndefined(pivotEngine[i])) {
                    var colEngine = $.map(pivotEngine[i], function (item, index) {
                        if (emptyRows.indexOf(index) == -1) {
                            if (item.RowSpan >= pivotEngine[i].length - index)
                                item.RowSpan = pivotEngine[i].length - index;
                            if (item.CSS == "summary value") {
                                item.RowSpan = 1;
                                item.ColSpan = 1;
                            }
                            return item
                        }
                    });
                    tmpEngine[i] = colEngine;
                }
            }
            pivotEngine = tmpEngine;
            var colFieldCnt = pivotColumns.length + ((pivotValues.length > 0 && pivotValues[0].axis != "rows") ? pivotValues.length : 0);
            var rowFieldCnt = pivotRows.length + ((pivotValues.length > 0 && pivotValues[0].axis == "rows") ? pivotValues.length : 0);
            var rowPos = -1;
            do { rowPos++; } while (!ej.isNullOrUndefined(pivotEngine[0]) && !(ej.isNullOrUndefined(pivotEngine[0][rowPos])) && (pivotEngine[0][rowPos].CSS == "none" || pivotEngine[0][rowPos].Value == ""));
            pivotEngine[0][0].RowSpan = rowPos > colFieldCnt ? colFieldCnt : rowPos;
            rowPos = pivotValues.length > 0 && pivotValues[0].axis != "rows" ? rowPos - 1 : rowPos;
            var colPos = -1, tmpPos = 0;
            do { colPos++; } while (!ej.isNullOrUndefined(pivotEngine[colPos]) && (pivotEngine[colPos][0].CSS == "none" || pivotEngine[colPos][0].Value == ""));
            pivotEngine[0][0].ColSpan = colPos > rowFieldCnt ? rowFieldCnt : colPos;

            for (var i = 0; i < pivotEngine[0].length; i++) {
                var cnt = pivotValues.length > 0 && pivotValues[0].axis == "rows" ? 1 : 0;
                for (var j = 0; j < pivotEngine[0][0].ColSpan; j++) {
                    if (!ej.isNullOrUndefined(pivotEngine[j][i])) {
                        cnt++;
                        if (!(i == 0 && j == 0) && (pivotEngine[j][i].ColSpan > ((pivotEngine[0][0].ColSpan - cnt) + 1)) && ((pivotEngine[0][0].ColSpan - cnt) + 1) > 0)
                            pivotEngine[j][i].ColSpan = (pivotEngine[0][0].ColSpan - cnt) + 1;
                    }
                }
            }

            for (var i = pivotEngine[0][0].ColSpan - 1; i < pivotEngine.length; i++) {
                var cnt = pivotValues.length > 0 && pivotValues[0].axis != "rows" ? 1 : 0;
                if (!ej.isNullOrUndefined(pivotEngine[i])) {
                    for (var j = 0; j < pivotEngine[0][0].RowSpan; j++) {
                        cnt++;
                        if (!(i == 0 && j == 0) && (pivotEngine[i][j].RowSpan > ((pivotEngine[0][0].RowSpan - cnt) + 1)) && ((pivotEngine[0][0].RowSpan - cnt) + 1) > 0)
                            pivotEngine[i][j].RowSpan = (pivotEngine[0][0].RowSpan - cnt) + 1;
                    }
                }
            }

            //Span recalculations for row headers

            if (!ej.isNullOrUndefined(pivotRows) && pivotRows.length > 1) {
                colPos = pivotValues.length > 0 && pivotValues[0].axis == "rows" ? colPos - 1 : colPos;
                do {
                    pivotEngine[tmpPos] = $.map(pivotEngine[tmpPos], function (item) { if (item.CSS.indexOf("summary") > -1) item.ColSpan = (colPos - tmpPos); return item; });
                    var rSpan = 0, hasSummary = false, lockName = "";
                    for (var i = pivotEngine[tmpPos].length - 1 ; i >= pivotEngine[0][0].RowSpan; i--) {
                        if (pivotEngine[tmpPos][i].CSS == "summary rstot" || pivotEngine[tmpPos][i].CSS == "summary stot") {
                            if (!ej.isNullOrUndefined(pivotEngine[tmpPos][i + 1]) && pivotEngine[tmpPos][i + 1].CSS == "rowheader") {
                                pivotEngine[tmpPos][i + 1].RowSpan = rSpan;
                            }
                            rSpan = 0;
                            hasSummary = true;
                            lockName = "";
                        }
                        else if (pivotEngine[0][0].RowSpan - i == 0) {
                            pivotEngine[tmpPos][i].RowSpan = (hasSummary || lockName == pivotEngine[tmpPos][i].Value) ? (rSpan + 1) : pivotEngine[tmpPos][i].RowSpan;
                        }
                        else {
                            lockName = pivotEngine[tmpPos][i].Value;
                            rSpan++;
                        }
                    }
                    tmpPos++;
                } while (colPos > tmpPos + (pivotValues.length > 0 && pivotValues[0].axis == "rows" ? 1 : 0));
            }

            //Span recalculations for column headers

            if (!ej.isNullOrUndefined(pivotColumns) && pivotColumns.length > 1) {
                tmpPos = 0;
                do {
                    for (var i = 0; i < pivotEngine.length; i++) {
                        if (!ej.isNullOrUndefined(pivotEngine[i]) && pivotEngine[i][tmpPos].CSS.indexOf("summary") > -1)
                            pivotEngine[i][tmpPos].RowSpan = (rowPos - tmpPos);
                    }
                    var cSpan = 0, hasSummary = false, firstCol = "", lockName = "";
                    var cnt = $.grep(pivotEngine, function (item, index) { if (!ej.isNullOrUndefined(item) && item[0].CSS != "none" && item[0].Value != "") { firstCol = firstCol == "" ? index : firstCol; return item } }).length;
                    for (var i = pivotEngine.length - 1; i >= firstCol; i--) {
                        cnt -= (!ej.isNullOrUndefined(pivotEngine[i]) && pivotEngine[i][0].CSS != "none" && pivotEngine[i][0].Value != "") ? 1 : 0;
                        if (!ej.isNullOrUndefined(pivotEngine[i]) && (pivotEngine[i][tmpPos].CSS == "summary cstot" || pivotEngine[i][tmpPos].CSS == "summary stot")) {
                            if (!ej.isNullOrUndefined(pivotEngine[i + 1]) && !ej.isNullOrUndefined(pivotEngine[i + 1][tmpPos]) && (pivotEngine[i + 1][tmpPos].CSS == "rowheader" || pivotEngine[i + 1][tmpPos].CSS == "colheader")) {
                                pivotEngine[i + 1][tmpPos].ColSpan = cSpan;
                            }
                            cSpan = 0;
                            hasSummary = true;
                            lockName = "";
                        }
                        else if (cnt == 0 && !ej.isNullOrUndefined(pivotEngine[i])) {
                            pivotEngine[i][tmpPos].ColSpan = (hasSummary || lockName == pivotEngine[i][tmpPos].Value) ? (cSpan + 1) : pivotEngine[i][tmpPos].ColSpan;
                        }
                        else if (!ej.isNullOrUndefined(pivotEngine[i])) {
                            lockName = pivotEngine[i][tmpPos].Value;
                            cSpan++;
                        }
                    }
                    tmpPos++;
                } while (rowPos > (tmpPos + (pivotValues.length > 0 && pivotValues[0].axis != "rows" ? 1 : 0)));
            }
            return pivotEngine;
        },
        
        _calculatePagingSpan: function (jsonObj,controlObj) {
            if (jsonObj != null && jsonObj != "" && jsonObj.length > 0) {
                controlObj._rowCount = 0;
                var copiedObject = jQuery.extend(true, [], jsonObj);
                controlObj._compJson = controlObj._drillAction == "" ? jQuery.extend(true, [], copiedObject) : controlObj._compJson;
                controlObj._croppedJson = ej.Pivot._cropJson(controlObj, copiedObject);
                copiedObject = $.extend(true, [], controlObj._croppedJson);
                for (var index = 0; index < copiedObject.length; index++) {
                    if (parseInt(copiedObject[index].Index.split(',')[0]) == 0)
                        controlObj._rowCount++;
                    else
                        break;
                }
                var rowLen = controlObj.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? JSON.parse(controlObj.getOlapReport()).PivotRows.length : controlObj.getOlapReport().rows.length;
                var colLen = controlObj.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? JSON.parse(controlObj.getOlapReport()).PivotColumns.length : controlObj.getOlapReport().columns.length;
                var valLen = controlObj.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? JSON.parse(controlObj.getOlapReport()).PivotCalculations.length : controlObj.getOlapReport().values.length;
                var columnCount = copiedObject.length / controlObj._rowCount;
 
                var topLeftCellRowSpan = copiedObject[0].RowSpan == 0 ? 0 : copiedObject[0].RowSpan - 1;
                //Row JSONRecord Spanning Formation
                for (var index = topLeftCellRowSpan + controlObj.model.dataSource.pagerOptions.seriesPageSize; index < copiedObject.length && index < controlObj._rowCount; index = index + controlObj.model.dataSource.pagerOptions.seriesPageSize) {
                    if (copiedObject[index].CSS.indexOf("summary") > -1 || (copiedObject[index].CSS.indexOf("rowheader") > -1 && copiedObject[index].Expander == 0 && copiedObject[index + controlObj._rowCount] != null && copiedObject[index + controlObj._rowCount].CSS.indexOf("value") > -1))
                        continue;
                    else if (rowLen > 1)
                        ej.Pivot._calculateRowPagingSpan(index, copiedObject, 1, rowLen, controlObj);
                }
  
                var topLeftCellColumnSpan = copiedObject[0].ColSpan == 0 ? 0 : copiedObject[0].ColSpan - 1;
                //Column JSONRecord Spanning Formation
                for (var index = (topLeftCellColumnSpan + controlObj.model.dataSource.pagerOptions.categoricalPageSize) * controlObj._rowCount; index < copiedObject.length; index = index + (controlObj.model.dataSource.pagerOptions.categoricalPageSize * controlObj._rowCount)) {
                    if (copiedObject[index].CSS.indexOf("summary") > -1 && valLen <= 1)
                        continue;
                    else if (controlObj.model.dataSource.pagerOptions.categoricalPageSize == 1 && ((copiedObject[index].CSS.indexOf("stot") > -1 && copiedObject[index + controlObj._rowCount] != null && copiedObject[index + controlObj._rowCount].CSS.indexOf("gtot") > -1) || (copiedObject[index].CSS.indexOf("gtot") > -1 && copiedObject[index + controlObj._rowCount] == null)))
                        continue;
                    else
                        ej.Pivot._calculateColumnPagingSpan(index, copiedObject, 1, colLen, valLen, controlObj);
                }
                controlObj._relPagingRecords = jQuery.extend(true, [], copiedObject);
                controlObj._rowCount = 0;
            }
        },
        _generatePagingRecords: function (controlObj) {
            if (controlObj._relPagingRecords != null && controlObj._relPagingRecords.length > 0) {
                var savedPagingRecords = $.extend(true, [], controlObj._relPagingRecords);
                controlObj._rowCount = 0;
                for (var index = 0; index < savedPagingRecords.length; index++) {
                    if (parseInt(savedPagingRecords[index].Index.split(',')[0]) == 0)
                        controlObj._rowCount++;
                    else
                        break;
                }
                var columnCount = savedPagingRecords.length / controlObj._rowCount;

                var topLeftCellRowSpan = savedPagingRecords[0].RowSpan == 0 ? 0 : savedPagingRecords[0].RowSpan - 1;
                var topLeftCellColumnSpan = savedPagingRecords[0].ColSpan == 0 ? 0 : savedPagingRecords[0].ColSpan - 1;

                var categoricalPageLength = Math.ceil((columnCount - (topLeftCellColumnSpan + 1)) / controlObj.model.dataSource.pagerOptions.categoricalPageSize);
                var seriesPageLength = Math.ceil((controlObj._rowCount - (topLeftCellRowSpan + 1)) / controlObj.model.dataSource.pagerOptions.seriesPageSize);
                controlObj.model.dataSource.pagerOptions.categoricalCurrentPage = controlObj.model.dataSource.pagerOptions.categoricalCurrentPage > categoricalPageLength ? categoricalPageLength : controlObj.model.dataSource.pagerOptions.categoricalCurrentPage;
                controlObj.model.dataSource.pagerOptions.seriesCurrentPage = controlObj.model.dataSource.pagerOptions.seriesCurrentPage > seriesPageLength ? seriesPageLength : controlObj.model.dataSource.pagerOptions.seriesCurrentPage;
                controlObj._seriesPageCount = controlObj.model.enablePaging ? controlObj._rowCount - (topLeftCellRowSpan + 1) : seriesPageLength;
                controlObj._categPageCount = controlObj.model.enablePaging ? (columnCount - (topLeftCellColumnSpan + 1)) : categoricalPageLength;
                controlObj._categCurrentPage = controlObj.model.dataSource.pagerOptions.categoricalCurrentPage;
                controlObj._seriesCurrentPage = controlObj.model.dataSource.pagerOptions.seriesCurrentPage;
                //Paging JSONRecord Formation
                var pagingJSONRecords = [];
                var pagingRowCount = topLeftCellRowSpan + 1 + controlObj.model.dataSource.pagerOptions.seriesPageSize;
                var pagingColumnCount = topLeftCellColumnSpan + 1 + controlObj.model.dataSource.pagerOptions.categoricalPageSize;
                var cIndex, index, cPagingIndex, pagingIndex, rowIndex, rowPagingIndex, colIndex, colPagingIndex, valIndex, valPagingIndex;
                cIndex = index = cPagingIndex = pagingIndex = rowIndex = rowPagingIndex = colIndex = colPagingIndex = valIndex = valPagingIndex = 0;

                //TopLeftCell Formation
                for (var i = 0; i < topLeftCellRowSpan + 1 ; i++) {
                    for (var j = 0; j < topLeftCellColumnSpan + 1 ; j++) {
                        if (savedPagingRecords[index] != null) {
                            pagingJSONRecords[pagingIndex] = savedPagingRecords[index];
                            index = index + controlObj._rowCount;
                            pagingIndex = pagingIndex + pagingRowCount;
                        }
                    }
                    index = ++cIndex
                    pagingIndex = ++cPagingIndex;
                }

                //RowHeaders Formation
                rowIndex = index = topLeftCellRowSpan + ((controlObj.model.dataSource.pagerOptions.seriesCurrentPage == 0 || controlObj.model.dataSource.pagerOptions.seriesCurrentPage == 1) ? 0 : ((controlObj.model.dataSource.pagerOptions.seriesCurrentPage - 1) * controlObj.model.dataSource.pagerOptions.seriesPageSize)) + 1;
                rowPagingIndex = pagingIndex = topLeftCellRowSpan + 1;
                for (var i = 0; i < controlObj.model.dataSource.pagerOptions.seriesPageSize; i++) {
                    for (var j = 0; j < topLeftCellColumnSpan + 1 ; j++) {
                        if (savedPagingRecords[index] != null) {
                            pagingJSONRecords[pagingIndex] = savedPagingRecords[index];
                            index = index + controlObj._rowCount;
                            pagingIndex = pagingIndex + pagingRowCount;
                        }
                    }
                    index = ++rowIndex;
                    pagingIndex = ++rowPagingIndex;
                    if (index > controlObj._rowCount - 1)
                        break;
                }

                //ColumnHeaders Formation
                colIndex = index = (topLeftCellColumnSpan + 1) * controlObj._rowCount + ((controlObj.model.dataSource.pagerOptions.categoricalCurrentPage == 0 || controlObj.model.dataSource.pagerOptions.categoricalCurrentPage == 1) ? 0 : ((controlObj.model.dataSource.pagerOptions.categoricalCurrentPage - 1) * controlObj.model.dataSource.pagerOptions.categoricalPageSize) * controlObj._rowCount);
                colPagingIndex = pagingIndex = (topLeftCellColumnSpan + 1) * pagingRowCount;
                for (var i = 0; i < topLeftCellRowSpan + 1; i++) {
                    for (var j = 0; j < controlObj.model.dataSource.pagerOptions.categoricalPageSize ; j++) {
                        if (savedPagingRecords[index] != null) {
                            pagingJSONRecords[pagingIndex] = savedPagingRecords[index];
                            index = index + controlObj._rowCount;
                            pagingIndex = pagingIndex + pagingRowCount;
                        }
                    }
                    index = ++colIndex;
                    pagingIndex = ++colPagingIndex;
                    if (savedPagingRecords[index] == null)
                        break;
                }

                //ValueCell Formation
                valIndex = index = (topLeftCellColumnSpan + 1) * controlObj._rowCount + ((controlObj.model.dataSource.pagerOptions.categoricalCurrentPage == 0 || controlObj.model.dataSource.pagerOptions.categoricalCurrentPage == 1) ? 0 : ((controlObj.model.dataSource.pagerOptions.categoricalCurrentPage - 1) * controlObj.model.dataSource.pagerOptions.categoricalPageSize) * controlObj._rowCount) + topLeftCellRowSpan + ((controlObj.model.dataSource.pagerOptions.seriesCurrentPage == 0 || controlObj.model.dataSource.pagerOptions.seriesCurrentPage == 1) ? 0 : ((controlObj.model.dataSource.pagerOptions.seriesCurrentPage - 1) * controlObj.model.dataSource.pagerOptions.seriesPageSize)) + 1;
                valPagingIndex = pagingIndex = (topLeftCellColumnSpan + 1) * pagingRowCount + topLeftCellRowSpan + 1;
                var lastJson = 0;
                for (var i = 0; i < controlObj.model.dataSource.pagerOptions.seriesPageSize; i++) {
                    for (var j = 0; j < controlObj.model.dataSource.pagerOptions.categoricalPageSize ; j++) {
                        if (savedPagingRecords[index] != null) {
                            pagingJSONRecords[pagingIndex] = savedPagingRecords[index];
                            lastJson = parseInt(savedPagingRecords[index].Index.split(',')[1]);
                            index = index + controlObj._rowCount;
                            pagingIndex = pagingIndex + pagingRowCount;
                        }
                    }
                    index = ++valIndex;
                    pagingIndex = ++valPagingIndex;
                    if (savedPagingRecords[index] == null || lastJson > parseInt(savedPagingRecords[index].Index.split(',')[1]))
                        break;
                }
                //controlObj._pagingJSONRecords = savedPagingRecords;
                controlObj._rowCount = 0;

                pagingJSONRecords = pagingJSONRecords.filter(function (n) { return n != null });
                pagingRowCount = 0;
                for (var index = 0; index < pagingJSONRecords.length; index++) {
                    if (parseInt(pagingJSONRecords[index].Index.split(',')[0]) == 0)
                        pagingRowCount++;
                    else
                        break;
                }
                var pagingColumnCount = pagingJSONRecords.length / pagingRowCount;
                for (var i = 0; i < pagingColumnCount ; i++) {
                    for (var j = 0; j < pagingRowCount ; j++) {
                        if (!ej.isNullOrUndefined(pagingJSONRecords[i * pagingRowCount + j]))
                            pagingJSONRecords[i * pagingRowCount + j].Index = "" + i + "," + j + "";
                    }
                }
                var pivotEngine = ej.Pivot._drillSpanCalculation(ej.Pivot._jsonToEngine(pagingJSONRecords), controlObj);
                for (var i = 0; i < pivotEngine.length; i++) {
                    for (var j = 0; j < pivotEngine[i].length; j++) {
                        pivotEngine[i][j].Index = i + "," + j;
                    }
                }
                pagingJSONRecords = $.map(pivotEngine, function (item) { return item });

                //return controlObj._pagingJSONRecords;
                return pagingJSONRecords;
            }
        },
        _calculateRowPagingSpan: function (index, copiedObject, level, rowLen, controlObj) {
            if (copiedObject[index].CSS.indexOf("summary") > -1 || (copiedObject[index].CSS.indexOf("rowheader") > -1 && copiedObject[index].Expander == 0 && level < rowLen && copiedObject[index + controlObj._rowCount] != null && copiedObject[index + controlObj._rowCount].CSS.indexOf("value") > -1))
                return false;
            else if (copiedObject[index].Expander == 1 && copiedObject[index].RowSpan > 1) {
                copiedObject[index + 1].RowSpan = copiedObject[index].RowSpan - 1;
                copiedObject[index].RowSpan = 1;
                copiedObject[index + 1].Expander = copiedObject[index].Expander;
                copiedObject[index + 1].State = copiedObject[index].State;
                copiedObject[index + 1].Value = copiedObject[index].Value;
                copiedObject[index + 1].CSS = copiedObject[index].CSS;
                if (copiedObject[index + controlObj._rowCount].CSS.indexOf("value") == -1 && level < rowLen - 1)
                    ej.Pivot._calculateRowPagingSpan(index + controlObj._rowCount, copiedObject, level + 1, rowLen, controlObj);
            }
            else if (copiedObject[index].Expander == 0 && copiedObject[index + controlObj._rowCount] != null && level < rowLen && copiedObject[index + controlObj._rowCount].CSS.indexOf("value") == -1) {
                var spanCount = 1;
                //Setting span count
                for (var j = index - 1; j >= 0; j--) {
                    spanCount++;
                    if (copiedObject[j].Expander == 1) {
                        if (copiedObject[j].RowSpan != spanCount) {
                            copiedObject[index + 1].RowSpan = copiedObject[j].RowSpan - spanCount;
                            copiedObject[j].RowSpan = spanCount;
                            copiedObject[index + 1].Expander = copiedObject[j].Expander;
                            copiedObject[index + 1].State = copiedObject[j].State;
                            copiedObject[index + 1].Value = copiedObject[j].Value;
                            copiedObject[index + 1].CSS = copiedObject[j].CSS;
                            if (copiedObject[index + controlObj._rowCount].CSS.indexOf("value") == -1 && level < rowLen - 1)
                                ej.Pivot._calculateRowPagingSpan(index + controlObj._rowCount, copiedObject, level + 1, rowLen, controlObj);
                        }
                        break;
                    }
                }
            }
        },
        _calculateColumnPagingSpan: function (index, copiedObject, level, colLen, valLen, controlObj) {
            if (copiedObject[index].CSS.indexOf("summary") > -1 && valLen <= 1)
                return false;
            else if (copiedObject[index + controlObj._rowCount] != null && ((copiedObject[index].Expander == 1 && copiedObject[index].ColSpan > 1) || (copiedObject[index].CSS.indexOf("summary") > -1 && copiedObject[index].ColSpan > 1) || (level == colLen && valLen > 1 && copiedObject[index].ColSpan > 1))) {
                copiedObject[index + controlObj._rowCount].ColSpan = copiedObject[index].ColSpan - 1;
                copiedObject[index].ColSpan = 1;
                copiedObject[index + controlObj._rowCount].Expander = copiedObject[index].Expander;
                copiedObject[index + controlObj._rowCount].RowSpan = copiedObject[index].RowSpan;
                copiedObject[index + controlObj._rowCount].State = copiedObject[index].State;
                copiedObject[index + controlObj._rowCount].Value = copiedObject[index].Value;
                copiedObject[index + controlObj._rowCount].CSS = copiedObject[index].CSS;
                if (level < colLen && copiedObject[index].CSS.indexOf("summary") == -1)
                    ej.Pivot._calculateColumnPagingSpan(index + 1, copiedObject, level + 1, colLen, valLen, controlObj);
            }
            else if (copiedObject[index].Expander == 0 && copiedObject[index + controlObj._rowCount] != null && copiedObject[index + controlObj._rowCount].Expander != 1) {
                var spanCount = 1;
                for (var j = index - controlObj._rowCount; j >= 0; j = j - controlObj._rowCount) {
                    spanCount++;
                    //Setting span count
                    //if (copiedObject[j].Expander == 1 || copiedObject[j].CSS.indexOf("stot") > -1 && copiedObject[j].ColSpan > 1) {
                    if (copiedObject[j].Expander == 1 || (copiedObject[j].CSS.indexOf("summary") > -1 && copiedObject[j].ColSpan > 1) || (level == colLen && valLen > 1 && copiedObject[j].ColSpan > 1)) {
                        if (copiedObject[j].ColSpan != spanCount) {
                            copiedObject[index + controlObj._rowCount].ColSpan = copiedObject[j].ColSpan - spanCount;
                            copiedObject[j].ColSpan = spanCount;
                            copiedObject[index + controlObj._rowCount].RowSpan = copiedObject[j].RowSpan;
                            copiedObject[index + controlObj._rowCount].Expander = copiedObject[j].Expander;
                            copiedObject[index + controlObj._rowCount].State = copiedObject[j].State;
                            copiedObject[index + controlObj._rowCount].Value = copiedObject[j].Value;
                            copiedObject[index + controlObj._rowCount].CSS = copiedObject[j].CSS;
                            if (level < colLen && copiedObject[j].CSS.indexOf("summary") == -1)
                                ej.Pivot._calculateColumnPagingSpan(index + 1, copiedObject, level + 1, colLen, valLen, controlObj);
                        }
                        break;
                    }
                }
            }
        },

        createAdvanceFilterTag: function (args, ctrlObj) {
            var filterTag = "", seperator = ej.buildTag("li.e-separator").css("margin-left", "29px")[0].outerHTML, opMode = ctrlObj.element.hasClass("e-pivotschemadesigner") ? ctrlObj.model.pivotControl.model.operationalMode : ctrlObj.model.operationalMode, analysisMode = ctrlObj.element.hasClass("e-pivotschemadesigner") ? ctrlObj.model.pivotControl.model.analysisMode : ctrlObj.model.analysisMode;
            if (args.action == "filterTag") {
                filterTag = [{ id: "ascOrder", text: ctrlObj._getLocalizedLabels("SortAtoZ"), parentId: null, spriteCssClass: "e-ascImage e-icon" },
                         { id: "descOrder", text: ctrlObj._getLocalizedLabels("SortZtoA"), parentId: null, spriteCssClass: "e-descImage e-icon" },
                         { id: "clearSorting", text: ctrlObj._getLocalizedLabels("ClearSorting"), parentId: null, spriteCssClass: "e-clrSort e-icon" },
                         { id: "sep1", parentId: null, text: "", spriteCssClass: "e-seperator" },
                         { id: "clearAllFilters", text: ctrlObj._getLocalizedLabels("ClearFilterFrom"), parentId: null, spriteCssClass: "e-clrFilter e-icon" },
                         { id: "labelFilterBtn", text: ctrlObj._getLocalizedLabels("LabelFilters"), parentId: null },
                         { id: "valueFilterBtn", text: ctrlObj._getLocalizedLabels("ValueFilters"), parentId: null },
                         { id: "labelClearFilter", parentId: "labelFilterBtn", text: ctrlObj._getLocalizedLabels("ClearFilter"), spriteCssClass: "e-clrFilter e-icon" },
                         { id: "sep2", parentId: "labelFilterBtn", text: "", spriteCssClass: "e-seperator" },
                         { id: "equals_labelFilter", parentId: "labelFilterBtn", text: ctrlObj._getLocalizedLabels("Equals"), spriteCssClass: "sprite" },
                         { id: "notequals_labelFilter", parentId: "labelFilterBtn", text: ctrlObj._getLocalizedLabels("DoesNotEquals") + "...", spriteCssClass: "sprite" },
                         { id: "sep3", parentId: "labelFilterBtn", text: "", spriteCssClass: "e-seperator" },
                         { id: "beginswith", parentId: "labelFilterBtn", text: ctrlObj._getLocalizedLabels("BeginsWith") + "...", spriteCssClass: "sprite" },
                         { id: "notbeginswith", parentId: "labelFilterBtn", text: ctrlObj._getLocalizedLabels("DoesNotBeginsWith") + "...", spriteCssClass: "sprite" },
                         { id: "endswith", parentId: "labelFilterBtn", text: ctrlObj._getLocalizedLabels("EndsWith") + "...", spriteCssClass: "sprite" },
                         { id: "notendswith", parentId: "labelFilterBtn", text: ctrlObj._getLocalizedLabels("DoesNotEndsWith") + "...", spriteCssClass: "sprite" },
                         { id: "sep4", parentId: "labelFilterBtn", text: "", spriteCssClass: "e-seperator" },
                         { id: "contains", parentId: "labelFilterBtn", text: ctrlObj._getLocalizedLabels("Contains") + "...", spriteCssClass: "sprite" },
                         { id: "notcontains", parentId: "labelFilterBtn", text: ctrlObj._getLocalizedLabels("DoesNotContains") + "...", spriteCssClass: "sprite" },
                         { id: "sep5", parentId: "labelFilterBtn", text: "", spriteCssClass: "e-seperator" },
                         { id: "greaterthan_labelFilter", parentId: "labelFilterBtn", text: ctrlObj._getLocalizedLabels("GreaterThan") + "...", spriteCssClass: "sprite" },
                         { id: "greaterthanorequalto_labelFilter", parentId: "labelFilterBtn", text: ctrlObj._getLocalizedLabels("GreaterThanOrEqualTo") + "...", spriteCssClass: "sprite" },
                         { id: "lessthan_labelFilter", parentId: "labelFilterBtn", text: ctrlObj._getLocalizedLabels("LessThan") + "...", spriteCssClass: "sprite" },
                         { id: "lessthanorequalto_labelFilter", parentId: "labelFilterBtn", text: ctrlObj._getLocalizedLabels("LessThanOrEqualTo") + "...", spriteCssClass: "sprite" },
                         { id: "valueClearFilter", parentId: "valueFilterBtn", text: ctrlObj._getLocalizedLabels("ClearFilter"), spriteCssClass: "e-clrFilter e-icon" },
                         { id: "sep6", parentId: "valueFilterBtn", text: "", spriteCssClass: "e-seperator" },
                         { id: "equals_valueFilter", parentId: "valueFilterBtn", text: ctrlObj._getLocalizedLabels("Equals"), spriteCssClass: "equals" },
                         { id: "notequals_valueFilter", parentId: "valueFilterBtn", text: ctrlObj._getLocalizedLabels("DoesNotEquals") + "...", spriteCssClass: "sprite" },
                         { id: "sep7", parentId: "valueFilterBtn", text: "", spriteCssClass: "e-seperator" },
                         { id: "greaterthan_valueFilter", parentId: "valueFilterBtn", text: ctrlObj._getLocalizedLabels("GreaterThan") + "...", spriteCssClass: "sprite" },
                         { id: "greaterthanorequalto_valueFilter", parentId: "valueFilterBtn", text: ctrlObj._getLocalizedLabels("GreaterThanOrEqualTo") + "...", spriteCssClass: "sprite" },
                         { id: "lessthan_valueFilter", parentId: "valueFilterBtn", text: ctrlObj._getLocalizedLabels("LessThan") + "...", spriteCssClass: "sprite" },
                         { id: "lessthanorequalto_valueFilter", parentId: "valueFilterBtn", text: ctrlObj._getLocalizedLabels("LessThanOrEqualTo") + "...", spriteCssClass: "sprite" },
                         { id: "sep8", parentId: "valueFilterBtn", text: "", spriteCssClass: "e-seperator" },
                         { id: "between", parentId: "valueFilterBtn", text: ctrlObj._getLocalizedLabels("Between") + "...", spriteCssClass: "sprite" },
                         { id: "notbetween", parentId: "valueFilterBtn", text: ctrlObj._getLocalizedLabels("NotBetween") + "...", spriteCssClass: "sprite" },
                         { id: "topCount", parentId: "valueFilterBtn", text: ctrlObj._getLocalizedLabels("Top10") + "...", spriteCssClass: "sprite" }
                ];

                if (opMode == ej.Pivot.OperationalMode.ClientMode || (opMode == ej.Pivot.OperationalMode.ServerMode && analysisMode == ej.Pivot.AnalysisMode.Pivot)) 
                    filterTag.splice(filterTag.length - 1, 2);


            }
            else if (args.action == "clearFilter") {
                filterTag = ej.buildTag("div.clearSorting", ej.buildTag("span.e-clrSort", "", { "padding": "0px 10px 0px 4px" }).addClass("e-icon").attr("aria-label", "clear sort")[0].outerHTML + ej.buildTag("span.clearSortText", "Clear Sorting", { "padding": "5px 0px" })[0].outerHTML)[0].outerHTML + ej.buildTag("div.separator", { "padding": "5px 0px" })[0].outerHTML +
                           ej.buildTag("div.clearAllFilters", ej.buildTag("span.e-clrFilter", "", { "padding": "0px 10px 0px 4px" }).addClass("e-icon").attr("aria-label", " clear filter")[0].outerHTML + ej.buildTag("span.clearFltrText", "Clear Filter From\"" + args.selectedLevel.text + "\"", { "padding": "5px 0px" })[0].outerHTML)[0].outerHTML;
            }
            else if (args.action == "sort") {
                filterTag = ej.buildTag("div#sortDiv.sortDiv",
                            ej.buildTag("li#ascOrder.e-ascOrder", ej.buildTag("span.e-ascImage").addClass("e-icon").attr("aria-label", "ascending")[0].outerHTML + ctrlObj._getLocalizedLabels("Sort") + " A to Z")[0].outerHTML +
                            ej.buildTag("li#descOrder.e-descOrder", ej.buildTag("span.e-descImage").addClass("e-icon").attr("aria-label", "descending")[0].outerHTML + ctrlObj._getLocalizedLabels("Sort") + " Z to A")[0].outerHTML)[0].outerHTML;
            }
            else if (args.action == "labelFilterDlg" || args.action == "valueFilterDlg") {

                var dialogContent = "", dropdownValues = [];
                if (args.action == "labelFilterDlg") {
                    dialogContent = ej.buildTag("table.labelfilter",
                                            ej.buildTag("tr", ej.buildTag("td", ctrlObj._getLocalizedLabels("LabelFilterLabel")).attr("colspan", "2")[0].outerHTML)[0].outerHTML +
                                            ej.buildTag("tr", ej.buildTag("td", "<input type='text' id='filterOptions' class='filterOptions'  style='width:220px'/>")[0].outerHTML +
                                            ej.buildTag("td.filterValuesTd", "<input type='text' id='filterValue1'  value='" + (args.filterInfo.length > 0 ? (opMode == ej.Pivot.OperationalMode.ClientMode ? args.filterInfo[0].values[0] : args.filterInfo[0].value1) : "") + "' style='display:inline; width:160px; height:19px; margin-left:7px;' class='e-filterValues'/></br>")[0].outerHTML)[0].outerHTML)[0].outerHTML;

                    dropdownValues = [{ value: "equals", option: ctrlObj._getLocalizedLabels("Equals").toLowerCase() },
                                          { value: "not equals", option: ctrlObj._getLocalizedLabels("DoesNotEquals").toLowerCase() },
                                          { value: "begins with", option: ctrlObj._getLocalizedLabels("BeginsWith").toLowerCase() },
                                          { value: "not begins with", option: ctrlObj._getLocalizedLabels("DoesNotBeginsWith").toLowerCase() },
                                          { value: "ends with", option: ctrlObj._getLocalizedLabels("EndsWith").toLowerCase() },
                                          { value: "not ends with", option: ctrlObj._getLocalizedLabels("DoesNotEndsWith").toLowerCase() },
                                          { value: "contains", option: ctrlObj._getLocalizedLabels("Contains").toLowerCase() },
                                          { value: "not contains", option: ctrlObj._getLocalizedLabels("DoesNotContains").toLowerCase() },
                                          { value: "greater than", option: ctrlObj._getLocalizedLabels("IsGreaterThan").toLowerCase() },
                                          { value: "greater than or equal to", option: ctrlObj._getLocalizedLabels("IsGreaterThanOrEqualTo").toLowerCase() },
                                          { value: "less than", option: ctrlObj._getLocalizedLabels("IsLessThan").toLowerCase() },
                                          { value: "less than or equal to", option: ctrlObj._getLocalizedLabels("IsLessThanOrEqualTo").toLowerCase() },
                    ];
                }
                else {
                    var measureNames = new Array(), innerContent, colSpan = ($(args["selectedArgs"].element).attr("id") == ("between") || $(args["selectedArgs"].element).attr("id") == ("notbetween") || (args["selectedArgs"].value == "between" || args["selectedArgs"].value == "not between")) ? "4" : "3";
                    if (ctrlObj.element.find(".e-cubeTreeView ").length > 0) {                        
                       measureNames = $.map(ctrlObj.element.find(".e-cubeTreeView [data-tag*='[Measures]'] "), function (currentElement, index) { return { option: $(currentElement).text(), value: $(currentElement).attr('data-tag') } });
                    }
                    else {
                        var pvtBtns = ctrlObj.element.hasClass("e-pivotschemadesigner") ? ctrlObj.element.find(".e-schemaValue .e-pivotButton") : ctrlObj.element.find(".groupingBarPivot .values .e-pivotButton");
                        pvtBtns = (ctrlObj._schemaData && pvtBtns.length == 0) ? $(ctrlObj._schemaData.element.find(".e-schemaValue .e-pivotButton")) : pvtBtns;
                        for (var i = 0; i < pvtBtns.length; i++) {
                            measureNames.push({ "option": $(pvtBtns[i]).text(), "value": $(pvtBtns[i]).attr('data-tag').split(":")[1] });
                        }
                    }
                    innerContent = !($(args["selectedArgs"].element).hasClass("topCount")) ?
                                     (ej.buildTag("td", "<input type='text' id='filterMeasures' class='filterMeasures' />").attr("width", "180px")[0].outerHTML +
                                     ej.buildTag("td", "<input type='text' id='filterOptions' class='filterOptions'/>").attr("width", "180px")[0].outerHTML +
                                     ej.buildTag("td.filterValuesTd", "<input type='text' id='filterValue1' value='" + (args.filterInfo.length > 0 ? (opMode == ej.Pivot.OperationalMode.ClientMode ? args.filterInfo[0].values[0] : args.filterInfo[0].value1) : "") + "' style='display:inline; width:190px; height:19px;' class='e-filterValues'/>" + (colSpan == "4" ? "<span>"+ ctrlObj._getLocalizedLabels("and")+" </span><input type='text' id='filterValue2' value='" + (args.filterInfo.length > 0 ? (opMode == ej.Pivot.OperationalMode.ClientMode && !ej.isNullOrUndefined(args.filterInfo[0].values[1])) ? args.filterInfo[0].values[1] : ((opMode == ej.Pivot.OperationalMode.ServerMode && !ej.isNullOrUndefined(args.filterInfo[0].value2)) ? args.filterInfo[0].value2 : "") : "") + "' style='display:inline; width:190px; height:19px;' class='e-filterValues'/> </br>" : "</br>"))[0].outerHTML) :

                                     ej.buildTag("td", "<input type='text' id='filterOptions' class='filterOptions' />").attr("width", "80px")[0].outerHTML +
                                     ej.buildTag("td", "<input type='text' id='filterValue1' class='e-filterValues' />").attr("width", "50px")[0].outerHTML +
                                     ej.buildTag("td", "<input type='text' id='filterMeasures' class='filterMeasures' />").attr("width", "180px")[0].outerHTML;

                    dialogContent = ej.buildTag("table.valuefilter",
                                     ej.buildTag("tr", ej.buildTag("td", (ctrlObj._getLocalizedLabels("ValueFilterLabel"))).attr("colspan", (args.text == "Between" ? "4" : "3"))[0].outerHTML)[0].outerHTML +
                                     ej.buildTag("tr", innerContent)[0].outerHTML)[0].outerHTML;

                    dropdownValues = [{ value: "equals", option: ctrlObj._getLocalizedLabels("Equals").toLowerCase() },
                                      { value: "not equals", option: ctrlObj._getLocalizedLabels("DoesNotEquals").toLowerCase() },
                                      { value: "greater than", option: ctrlObj._getLocalizedLabels("IsGreaterThan").toLowerCase() },
                                      { value: "greater than or equal to", option: ctrlObj._getLocalizedLabels("IsGreaterThanOrEqualTo").toLowerCase() },
                                      { value: "less than", option: ctrlObj._getLocalizedLabels("IsLessThan").toLowerCase() },
                                      { value: "less than or equal to", option: ctrlObj._getLocalizedLabels("IsLessThanOrEqualTo").toLowerCase() },
                                      { value: "between", option: ctrlObj._getLocalizedLabels("Between").toLowerCase() },
                                      { value: "not between", option: ctrlObj._getLocalizedLabels("NotBetween").toLowerCase() }];
                }
                var dialogFooter = ej.buildTag("div", ej.buildTag("button#filterDlgOKBtn.e-dialogOKBtn", ctrlObj._getLocalizedLabels("OK")).attr("title", ctrlObj._getLocalizedLabels("OK").replace(/(<([^>]+)>)/ig, ""))[0].outerHTML + ej.buildTag("button#filterDlgCancelBtn.e-dialogCancelBtn", ctrlObj._getLocalizedLabels("Cancel")).attr("title", ctrlObj._getLocalizedLabels("Cancel").replace(/(<([^>]+)>)/ig, ""))[0].outerHTML, { "float": ctrlObj.model.enableRTL ? "left" : "right", "margin": "8px 0 6px" })[0].outerHTML;
                ctrlObj.element.find(".e-dialog").remove();
                $(ej.buildTag("div#filterDialog.filterDialog", dialogContent + dialogFooter, { "opacity": "1" })).appendTo("#" + ctrlObj._id);
                ctrlObj.element.find(".filterDialog").ejDialog({ enableRTL: ctrlObj.model.enableRTL, enableResize: false, cssClass: "e-labelValueFilterDlg", width: "auto", content: "#" + ctrlObj._id, close: ej.proxy(ej.Pivot.closePreventPanel, ctrlObj) });
                if (args.action == "valueFilterDlg") {
                    ctrlObj.element.find(".filterMeasures").ejDropDownList({ dataSource: measureNames, width: "180px", height: "25px", fields: { text: "option", value: "value" }, create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) } });
                    ctrlObj._measureDDL = ctrlObj.element.find(".filterMeasures").data("ejDropDownList");

                    var selectedMeasure = (args.filterInfo.length > 0 && !ej.isNullOrUndefined(args.filterInfo[0].measure)) ? args.filterInfo[0].measure : measureNames.length > 0 ? measureNames[0].value : "";
                    if (selectedMeasure != "")
                        ctrlObj._measureDDL.selectItemByValue(selectedMeasure);
                }

                if ($(args["selectedArgs"].element).attr("id") == "topCount") {
                    ctrlObj.element.find("#filterOptions").ejDropDownList({
                        dataSource: [{ option: "Top", value: "topCount" }, { option: "Bottom", value: "BottomCount" }],
                        fields: { text: "option", value: "value" },
                        value: (args.filterInfo.length > 0) ? args.filterInfo[0]["operator"] : "topCount",
                        create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
                    });
                    ctrlObj.element.find("#filterValue1").ejNumericTextbox({ value: (args.filterInfo.length > 0) ? parseInt(args.filterInfo[0].value1) : 5, minValue: 1 });
                }
                else {
                    var selectedIndex = $(args.selectedArgs.element).parent().children('li:not([id^="sep"])').index(args.selectedArgs.element)
                    ctrlObj.element.find(".filterOptions").ejDropDownList({
                        dataSource: dropdownValues, width: "180px",
                        height: "25px", fields: { value: "value", text: "option", },
                        selectedIndices: [selectedIndex - 1],
                        change: ej.proxy(ctrlObj._filterOptionChanged, ctrlObj),
                        create: function () { $(this.wrapper.find('.e-input')).focus(function () { $(this).blur(); }) }
                    });
                    if ($(args.selectedArgs.element).length == 0)
                    {
                        var filterDDL = ctrlObj.element.find(".filterOptions").data("ejDropDownList");
                        filterDDL.selectItemByValue(args.selectedArgs.selectedValue);
                    }
                }
                ctrlObj.element.find("#filterDlgOKBtn").ejButton({
                    type: ej.ButtonType.Button,
                    click: ej.proxy(ctrlObj._filterElementOkBtnClick, ctrlObj)
                });
                ctrlObj.element.find("#filterDlgCancelBtn").ejButton({
                    type: ej.ButtonType.Button, click: function () {
                        $(".e-dialog").hide();
                        ej.Pivot.closePreventPanel(ctrlObj);
                    }
                });
                ctrlObj.element.find(".e-titlebar").prepend(ej.buildTag("div", (args.action == "valueFilterDlg" ? (ctrlObj._getLocalizedLabels("ValueFilters") + "(") : (ctrlObj._getLocalizedLabels("LabelFilters") + "(") )+(ctrlObj._selectedLevelUniqueName.indexOf(".") == -1 ? ctrlObj._selectedLevelUniqueName : (ctrlObj._selectedLevelUniqueName.indexOf(".") < 0 ? ctrlObj._selectedLevelUniqueName : ctrlObj._selectedLevelUniqueName.split('.')[2].replace(/\[/g, '').replace(/\]/g, ''))) + ")", { "display": "inline" }));
            }
            return filterTag;
        }
    }
    ej.Pivot.SortOrder = {
        None: "none",
        Ascending: "ascending",
        Descending: "descending"
    }

    ej.Pivot.AdvancedFilterType = {
        LabelFilter: "label",
        ValueFilter: "value"
    }

    ej.Pivot.ValueFilterOptions = {
        None: "none",
        Equals: "equals",
        NotEquals: "notequals",
        GreaterThan: "greaterthan",
        GreaterThanOrEqualTo: "greaterthanorequalto",
        LessThan: "lessthan",
        LessThanOrEqualTo: "lessthanorequalto",
        Between: "between",
        NotBetween: "notbetween"
    }

    ej.Pivot.LabelFilterOptions = {
        None: "none",
        BeginsWith: "beginswith",
        NotBeginsWith: "notbeginswith",
        EndsWith: "endswith",
        NotEndsWith: "notendswith",
        Contains: "contains",
        NotContains: "notcontains",
        Equals: "equals",
        NotEquals: "notequals",
        GreaterThan: "greaterthan",
        GreaterThanOrEqualTo: "greaterthanorequalto",
        LessThan: "lessthan",
        LessThanOrEqualTo: "lessthanorequalto",
        Between: "between",
        NotBetween: "notbetween"

    }
    ej.Pivot.AnalysisMode = {
        Olap: "olap",
        Pivot: "pivot"
    };
    ej.Pivot.OperationalMode = {
        ClientMode: "clientmode",
        ServerMode: "servermode"
    };
})(jQuery, Syncfusion);