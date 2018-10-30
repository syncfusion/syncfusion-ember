(function ($, ej, undefined) {
    
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.pivot = function (obj) {
        this.XLObj = obj;
        this._pivotCnt = 1;
        this._hasPvtField = false;
        this._displayActPanel = true;
        this.names = {};
        this._valueFieldName = "";
    };

    ej.spreadsheetFeatures.pivot.prototype = {
       
        createPivotTable: function (range, location, name, settings, pvt) {
            var xlObj = this.XLObj, id, tableName, regx = new RegExp("[^a-z0-9\\s]", 'gi');
			if(name && ((name.indexOf(" ")> -1) || name.match(regx))) {
			   tableName = name;
			   name = name.replace(regx, '').replace(/ /g, "_");
			   }
            if (!xlObj.model.enablePivotTable || (xlObj.getSheet()._isLoaded && xlObj.model.isReadOnly))
                return;
            var xlRibbon = xlObj.XLRibbon, sheetIdx = xlObj.getActiveSheetIndex(), pvtRange = [], dataSheetName, datasource, details;
            var temp, left = 0, top = 0, pvtObj;
            xlObj._showDialog(xlObj._id + "_Ribbon_Insert_Tables_PivotTable");
            temp = xlRibbon._getAddrFromDollarAddr(range);
            dataSheetName = xlObj.model.sheets[temp[0]].sheetInfo.text;
            range = xlObj.getRangeIndices(temp[1]);
            datasource = xlObj.getRangeDataAsJSON({ rowIndex: range[0], colIndex: range[1] }, { rowIndex: range[2], colIndex: range[3] }, false, temp[0]);
            if ($("#" + xlObj._id + "_dlg_existsheet").data("ejRadioButton").model.checked || xlObj.isImport || xlObj.model.isImport || !xlObj.getSheet(sheetIdx)._isLoaded) {
                temp = xlRibbon._getAddrFromDollarAddr(location);
                pvtRange = xlObj.getRangeIndices(temp[1]);
                if (!xlObj._isExport && (sheetIdx !== temp[0])) {
                    xlObj.gotoPage(temp[0], false);
                    sheetIdx = temp[0];
                }
            }
            else {
                xlObj.insertSheet();
                sheetIdx = xlObj.getActiveSheetIndex();
                pvtRange = [2, 0];
            }
            if (xlObj.isUndefined(pvt))
                pvt = {};
            top = xlObj.model.sheets[temp[0]]._rowHeightCollection[pvtRange[0]];
            left = xlObj.model.sheets[temp[0]]._colWidthCollection[pvtRange[1]];
            xlObj.hideActivationPanel();         
            if (name && name.length) {
                if (xlObj.getObjectKeys(this.names).indexOf(name) > -1) {
                    do {
                        name = name + this._pivotCnt;
                        this._pivotCnt++;
                    }
                    while (xlObj.getObjectKeys(this.names).indexOf(name) > -1);
                }
            }
            else {
                do {
                    name = "PivotTable" + this._pivotCnt;
                    this._pivotCnt++;
                }
                while (xlObj.getObjectKeys(this.names).indexOf(name) > -1);
            }
            id = xlObj._id + "_" + name;
		    this.names[id] = tableName ? tableName : name;
            pvt.pvtRange = pvtRange;
            pvt.sheetIdx = sheetIdx;
            pvt.temp = temp[0];
            pvt.datasource = datasource;
            !xlObj.getSheet(sheetIdx)._isUpdated && this._updatePivotMngr({}, { pivot: { id: id, top: top, left: left, rowIndex: pvtRange[0], colIndex: pvtRange[1], dataRange: range, dataSheetName: dataSheetName, sheetIdx: sheetIdx, tableName: this.names[id] } });            
            this._refreshPivotElement(range, location, name, settings, pvt);
            pvtObj = xlObj.element.find("#" + id).data("ejPivotGrid");
            this._refreshRowColumn(pvtRange, pvtObj);
            xlObj.showActivationPanel();
            details = { sheetIndex: pvt.sheetIdx, reqType: "shape", shapeType: "pivot", range: pvt.pvtRange, ID: id, dataSource: pvt.datasource };
            xlObj._trigActionComplete(details);
            return id;
        },
            
        _refreshRowColumn: function (pvtRange, pvtObj) {
            var colCount, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), width = [], rowCount, pvtObj, i, rowHeight;
            rowCount = pvtObj._rowCount, rowHeight = pvtObj.calculateCellWidths().rowHeight, width = pvtObj.calculateCellWidths().columnWidths, colCount = width.length;
            if (!xlObj._focusTopElem)
                xlObj._createFocusElement();
            if (!rowCount) {
                rowCount = 4;
            }
            for (i = pvtRange[0]; i < rowCount + pvtRange[0]; i++)
                xlObj.XLResize.setRowHeight(i, rowHeight);
            if (colCount > 0) {
                for (i = 0; i < colCount + pvtRange[1]; i++)
                    xlObj.XLResize.setColWidth(i + pvtRange[1], width[i]);
            }
            else {
                for (i = 0; i < 3 + pvtRange[1]; i++)       //  default colcount 3, default column width 81px
                    xlObj.XLResize.setColWidth(i + pvtRange[1], 81);
            }
            if (sheet._isFreezed) {
                xlObj.XLFreeze._refreshFreezeRowDiv();
                xlObj.XLFreeze._refreshFreezeColDiv();
            }
        },

        _refreshPivotElement: function (range, location, name, settings, pvt) {
            var xlObj = this.XLObj, $pvtBase, $pvtSchema, pvtSettings, top, left;
            top = xlObj.model.sheets[pvt.sheetIdx]._rowHeightCollection[pvt.pvtRange[0]];
            left = xlObj.model.sheets[pvt.sheetIdx]._colWidthCollection[pvt.pvtRange[1]];
            pvtSettings = {
                dataSource: {
                    data: pvt.datasource,
                },
				enableToolTipAnimation: false,
                cellDoubleClick: $.proxy(this._cellDblClick, this),
                enableCellDoubleClick: true,
                renderSuccess: $.proxy(this._renderSuccess, this),
                drillSuccess: $.proxy(this._renderSuccess, this),
            };
            if (!ej.isNullOrUndefined(settings))
                pvtSettings.dataSource = {
                    data: pvt.datasource,
                    rows: settings.rows,
                    columns: settings.columns,
                    values: settings.values,
                    filters: settings.filters,
                };
            xlObj.getSheetElement(xlObj.getActiveSheetIndex()).find(".e-ss-activepivot").removeClass("e-ss-activepivot");
            $pvtBase = ej.buildTag("div.e-ss-pivot", "", "", { id: xlObj._id + "_" + name });
            $pvtBase.css({ left: left - 2, top: top -2 }).addClass("e-ss-activepivot");
                xlObj._getContent(pvt.sheetIdx).find(".e-content").append($pvtBase);
                if (!this._hasPvtField)
                    xlObj.getActivationPanel().append(ej.buildTag("div", "", { overflow: "hidden" }, { id: xlObj._id + "_PivotField" }));
                xlObj.element.find("#" + xlObj._id + "_PivotField").append(ej.buildTag("div.e-ss-pivotfield", "", "", { id: xlObj._id + "_PivotTableSchema_" + xlObj._id + "_" + name }));
                $pvtSchema = xlObj.element.find("#" + xlObj._id + "_PivotTableSchema_" + xlObj._id + "_" + name);
                xlObj.getActivationPanel().find("#" + $pvtSchema[0].id).show();
                $pvtBase.ejPivotGrid(pvtSettings);                                             
                $pvtSchema.find("#" + xlObj._id + "_PivotTableSchema_" + xlObj._id + "_" + name + "_schemaFieldTree").data("ejTreeView").option("allowDragAndDrop", false);
                $pvtSchema.css({ "float": "left", "width": xlObj.model.activationPanelWidth - 20 });
                $pvtSchema.find(".schemaFieldList").css({ "height": 150 });
                if (!this._hasPvtField) {
                    xlObj.getActivationPanel().ejScroller({ width: xlObj.model.activationPanelWidth, height: xlObj._getContent(pvt.sheetIdx).height(), scroll: $.proxy(this._pivotScroll, this) });
                    this._hasPvtField = true;
                }
                this._clearBackgroundData($pvtBase.data("ejPivotGrid"), xlObj.getSheet(pvt.sheetIdx).pivotMngr.pivot[$pvtBase[0].id], pvt.sheetIdx, "update");                               
                xlObj.XLRibbon && xlObj.XLRibbon._analyzeTabUpdate();
                xlObj.XLSelection._cleanUp(true);   
                xlObj.getActivationPanel().data("ejScroller").refresh();
           
        },

        deletePivotTable: function (pivotName) {
            var len, pvtID = this._getPivotIDFromName(pivotName), xlObj = this.XLObj, cellObj, container = xlObj._dataContainer, pvtObj, i;
            if (!xlObj.model.enablePivotTable || xlObj.model.isReadOnly)
				return;
            for (i = 1, len = xlObj.model.sheetCount; i <= len; i++) {
                if (xlObj._getContent(i).find("#" + pvtID).length) {
                    pvtObj = xlObj.getSheet(i).pivotMngr.pivot[pvtID];
                    cellObj = container.sheets[i][pvtObj.rowIndex][pvtObj.colIndex];
                    if (xlObj.getObjectLength(cellObj) < 2 && cellObj.pivot.length < 2)
                        delete container.sheets[i][pvtObj.rowIndex][pvtObj.colIndex];
                    else if (cellObj.pivot.length < 2)
                        delete container.sheets[i][pvtObj.rowIndex][pvtObj.colIndex].pivot;
                    delete xlObj.getSheet(i).pivotMngr.pivot[pvtID];
                    xlObj._getContent(i).find("#" + pvtID).remove();
                    xlObj.hideActivationPanel();
                    xlObj.getActivationPanel().find("#" + xlObj._id + "_PivotTableSchema_" + pvtID).remove();
                    xlObj.XLRibbon._toggleAnalyzeTab();
                    xlObj._trigActionComplete({ ID: pvtID, rowIndex: pvtObj.rowIndex, colIndex: pvtObj.colIndex, reqType: "shape", shapeType: "pivot", sheetIndex: i });
                }
            }
        },

        refreshDataSource: function (name, sheetIdx) {
            var xlObj = this.XLObj, elem, id, pivObj, range, datasource;
            if(!xlObj.model.enablePivotTable || xlObj.model.isReadOnly)
				return;
            if (name && sheetIdx) {
                elem = xlObj.element.find("#" + xlObj._id + "_" + name);
                if (elem)
                    id = elem[0].id;
            }
            else {
                sheetIdx = xlObj.getActiveSheetIndex();
                elem = xlObj._getContent(sheetIdx).find(".e-ss-activepivot");
                id = elem[0].id;
            }
            pivObj = elem.data("ejPivotGrid");
            if (pivObj) {
                range = xlObj.getSheet(sheetIdx).pivotMngr.pivot[id].dataRange;
                datasource = xlObj.getRangeDataAsJSON({ rowIndex: range[0], colIndex: range[1] }, { rowIndex: range[2], colIndex: range[3] }, false, xlObj._getSheetIndexByName(xlObj.getSheet(sheetIdx).pivotMngr.pivot[id].dataSheetName));
                pivObj.model.dataSource.data = datasource;
                pivObj.refreshPivotGrid();
            }
        },

        clearPivotFieldList: function (pivotName) {
            var xlObj = this.XLObj, pvtID = this._getPivotIDFromName(pivotName);
            if (!xlObj.model.enablePivotTable || xlObj.model.isReadOnly)
				return;
            this._clearFilters(xlObj.element.find("#" + pvtID).data("ejPivotGrid"), xlObj.getActivationPanel().find("#" + xlObj._id + "_PivotTableSchema_" + pvtID).data("ejPivotSchemaDesigner"));
        },
               
        _cellDblClick: function (args) {
            if (args.selectedData.length) {
                var xlObj = this.XLObj, xlFormat = xlObj.XLFormat, sheetIdx;
                xlObj.insertSheet();
                sheetIdx = xlObj.getActiveSheetIndex();
                xlObj._updateRangeValue(sheetIdx, { dataSource: args.selectedData, startCell: "A1", showHeader: true }, false);
                xlFormat.createTable({ "header": true, name: "Table" + xlObj._tableCnt, "format": xlFormat._getTableLayoutFromName("TableStyleMedium9").format, "formatName": "TableStyleMedium9" }, "A1:" + xlObj._generateHeaderText(xlObj.getObjectLength(args.selectedData[0])) + (args.selectedData.length + 1));
            }
        },

        _dragMove: function (ars) {
            var xlObj = this.XLObj, interval, scrollObj = xlObj.getActivationPanel().data("ejScroller"), actPanel = xlObj.element.find(".e-spreadsheetactpanel"), top =  actPanel.offset().top;
            if (actPanel.height() + top - 45 < $(".e-dragedNode").offset().top) {
                interval = setInterval(function (e) {
                    if(actPanel.height() + top - 45 < $(".e-dragedNode").offset().top)
                    scrollObj.scrollY(scrollObj.model.scrollTop + 25);
                }, 300);
            }          
            else if (top + 45 > $(".e-dragedNode").offset().top) {
                interval = setInterval(function (e) {
                    if (top + 45 > $(".e-dragedNode").offset().top)
                        scrollObj.scrollY(scrollObj.model.scrollTop - 25);
                }, 300);
            }
            if (xlObj._browserDetails.name === "msie" && xlObj._browserDetails.version === "8.0") {
                $(".e-dragedNode")[0].attachEvent("onmouseup", function (e) {
                    clearInterval(interval);
                });
                document.attachEvent("onmouseup", function (e) {
                    clearInterval(interval);
                });
            }
            else {
                $(".e-dragedNode")[0].addEventListener("mouseup", function (e) {
                    clearInterval(interval);
                });
                document.addEventListener("mouseup", function (e) {
                    clearInterval(interval);
                });
            }
        },

        _renderSuccess: function (args) {
            if (args.type === 'drillSuccess')
                args = args.gridObj;
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), colCount, rowCount, rowIndex, pvtDataObj, colIndex, pvtObj = args, pvtRange = [];
            (!xlObj._isExport) && this._clearBackgroundData(args, xlObj.getSheet(sheetIdx).pivotMngr.pivot[args._id], sheetIdx, "update");
            xlObj.element.find("#" + xlObj._id + "_PivotTableSchema_" + args._id).ejPivotSchemaDesigner({
                pivotControl: args, layout: ej.PivotSchemaDesigner.Layouts.Excel, dragMove: $.proxy(this._dragMove, this), fieldItemDropped: $.proxy(this._fieldItemDropped, this),
            });
            pvtDataObj = xlObj.getSheet(sheetIdx).pivotMngr.pivot[args._id];
            rowCount = pvtObj._rowCount;
            colCount = pvtObj.getJSONRecords().length / pvtObj._rowCount;
            pvtRange = [pvtDataObj.rowIndex, pvtDataObj.colIndex, pvtDataObj.rowIndex + rowCount, pvtDataObj.colIndex + colCount];
            this._refreshRowColumn(pvtRange, pvtObj);
            $(".e-spreadsheet .e-pivotgrid th[role='columnheader'").addClass("e-ss-pivottableheader");
            $(".e-spreadsheet .e-pivotgrid tr:last th.rgtot").addClass("e-ss-pivottableheader");
            xlObj.XLDragFill.hideAutoFillElement();
        },

        _clearBackgroundData: function (pvtObj, pvtDataObj, sheetIdx, type) {        
            var xlObj = this.XLObj;
            var colCount, rowCount, rowIndex, colIndex;
            colCount = pvtObj.getJSONRecords().length / pvtObj._rowCount;
            rowCount = pvtObj._rowCount;
            rowIndex = (!rowCount || isNaN(rowCount)) ? pvtDataObj.rowIndex + 17 : pvtDataObj.rowIndex + rowCount; // 17 is excel default pivot row count
            colIndex = (!colCount || isNaN(colCount)) ? pvtDataObj.colIndex + 2 : pvtDataObj.colIndex + colCount - 1;  // 2 is excel default pivot col count
            if (!type || type === "update")
                xlObj.getRange([pvtDataObj.rowIndex, pvtDataObj.colIndex, rowIndex, colIndex], sheetIdx).removeClass("e-readOnly").addClass("e-readonly");
            else
                xlObj.getRange([pvtDataObj.rowIndex, pvtDataObj.colIndex, rowIndex, colIndex], sheetIdx).removeClass("e-readOnly");                  
            xlObj._dupDetails = true;
            xlObj.clearRangeData([pvtDataObj.rowIndex, pvtDataObj.colIndex, rowIndex, colIndex], ["value", "value2", "hyperlink", "cFormatRule", "comment", "format", "formats"], "", false);
            xlObj._dupDetails = false;
        },

        _fieldItemDropped: function (args) {          
            if (args.axis === "filter") {
                var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), cell, pvtObj;
                pvtObj = xlObj._getContent(sheetIdx).find(".e-ss-activepivot").data("ejPivotGrid"), pivot = xlObj.getSheet(sheetIdx).pivotMngr.pivot[pvtObj._id];              
                while(pivot.rowIndex <= pvtObj.getOlapReport().filters.length) {
                    pivot.rowIndex = pivot.rowIndex + 1;
                    cell = xlObj.getCell(pivot.rowIndex, pivot.colIndex)[0];
                    pvtObj.element.css({ left: cell.offsetLeft - 2, top: cell.offsetTop - 2 });
                }
            }
        },    
       
        _updatePivotMngr: function (cell, pivotObj) {
            var xlObj = this.XLObj, pivotMngr = xlObj.getSheet(xlObj.getActiveSheetIndex()).pivotMngr, pivot = pivotMngr["pivot"];
            pivot[pivotObj["pivot"].id] = $.extend(true, {}, pivotObj["pivot"]);
            xlObj.XLEdit._updateDataContainer({ rowIndex: pivotObj.pivot.rowIndex, colIndex: pivotObj.pivot.colIndex }, { dataObj: { pivot: pivotObj["pivot"].id } });
        },

        _pivotMouseDown: function (e) {
            var xlObj = this.XLObj;
            e.preventDefault();                     
            xlObj.getActivationPanel().find("#" + xlObj._id + "_PivotTableSchema_" + e.target.id).show();
            xlObj._getContent(xlObj.getActiveSheetIndex()).find(".e-ss-activepivot").removeClass("e-ss-activepivot");
            if ($(e.target).hasClass("e-ss-pivot"))             
                $(e.target).addClass("e-ss-activepivot");            
            else
                $(e.target).parents("e-ss-object").addClass("e-ss-activepivot");
            xlObj.XLSelection._cleanUp(true);
            xlObj.showActivationPanel();
        },

        _pivotScroll: function (args) {
            var xlObj = this.XLObj, desObj = xlObj.getActivationPanel().find("#" + xlObj._id + "_PivotTableSchema_" + xlObj._getContent(xlObj.getActiveSheetIndex()).find(".e-ss-activepivot")[0].id).data("ejPivotSchemaDesigner");
            if (args.source === "thumb" && ($(".e-dragedNode").length || desObj._isDragging || this.XLObj.XLResize._allowStart))
                args.cancel = true;                         
        },

        _pivotMouseUp: function (e) {
            var xlObj = this.XLObj, $trgt = $(e.target), robj = $('#' + xlObj._id + '_Ribbon').data("ejRibbon"), menuObj, actPvt = xlObj._getContent(xlObj.getActiveSheetIndex()).find(".e-ss-activepivot"),
                menuElem = actPvt.length == 1 ? $("#" + xlObj._id + "_PivotTableSchema_" + actPvt[0].id + "_pivotTreeContextMenu") : null,
                elem = ej.isNullOrUndefined(menuElem) ? null : menuElem.find("#" + xlObj._id + "_fieldSettings")[0];
            if (xlObj.model.showRibbon) {              
                if (xlObj._getContent(xlObj.getActiveSheetIndex()).find(".e-ss-activepivot").length && ($trgt.hasClass("e-ss-pivot") || $trgt.parents(".e-ss-pivot").length))
                    xlObj.XLRibbon._analyzeTabUpdate();
                else if (!xlObj._getContent(xlObj.getActiveSheetIndex()).find(".e-ss-activepivot").length && (robj.model.selectedItemIndex === xlObj.XLRibbon._getTabIndex("analyze") || robj.isVisible("Analyze")))
                    xlObj.XLRibbon._toggleAnalyzeTab();
            }
            this._valueFieldName = e.target.textContent;
            menuObj = ej.isNullOrUndefined(menuElem) ? null : menuElem.data("ejMenu")
            if (menuObj && $(e.target).parents().eq(2).hasClass("e-schemaValue") && $(e.target).hasClass("e-pvtBtn")) {
                if (!elem) {
                    menuObj.insert([{ id: xlObj._id + "_fieldSettings", parentId: null, text: "Value Field Settings " }], "#" + menuElem[0].id);
                    elem = menuElem.find("#" + xlObj._id + "_fieldSettings")[0];
                    if (xlObj._browserDetails.name == "msie" && xlObj._browserDetails.version == "8.0")
                        $(elem)[0].attachEvent("onclick", this._cmenuclick, true);
                    else
                        $(elem)[0].addEventListener("click", this._cmenuclick, true);
                }
                else 
                    menuObj.showItems(["#" + elem.id]);
            }
            else if (!ej.isNullOrUndefined(elem) && !$(e.target).parents().eq(2).hasClass("e-schemaValue"))
                menuObj.hideItems(["#" + elem.id]);
        },

        _cmenuclick: function(event)
        {
            var xlObj = $("#" + event.currentTarget.id.split("_fieldSettings")[0]).data("ejSpreadsheet"),
                xlId = xlObj._id, dlgId = xlId + "_fielddlg", $dlg = $("#" + xlId + "_fielddlg");
            if ($dlg.hasClass("e-dialog")) {
                $dlg.ejDialog("open");
                xlObj.XLPivot._refreshSummaryList();
            }
            else
                xlObj.XLPivot._renderFieldSettingDlg();
        },

        _renderFieldSettingDlg: function()
        {
            var xlObj = this.XLObj, xlId = xlObj._id, dlgId = xlId + "_fielddlg", $dlg, $tab, $ctnr, $ul, $summaryTag, $contentdiv, $li,
            $maindiv, $fieldValueLabel, $fieldNameValueLabel, $topdiv1, $fieldNameLabel, $bottomdiv, $btndiv, $btnctnr, $okBtn, $canBtn, $listSummary,
            summarySrc = [{ value: "sum", text: "Sum" }, { value: "count", text: "Count" }, { value: "average", text: "Average" }, { value: "max", text: "Max" }, { value: "min", text: "Min" }];
                $dlg = ej.buildTag("div#" + dlgId);
                $tab = ej.buildTag("div#" + dlgId + "_fieldtab");
                $ctnr = ej.buildTag("div.e-dlg-fields e-dlgctndiv");
                $maindiv = ej.buildTag("div.e-ss-maindiv");
                $topdiv1 = ej.buildTag("div.e-ss-topmaindiv");
                $fieldNameLabel = ej.buildTag("label", xlObj._getLocStr("FieldValue"), "", { id: dlgId + "_fieldnamelabel" });
                $fieldNameValueLabel = ej.buildTag("label#" + dlgId + "_fieldnamevaluelabel.e-dlg-fieldlabel");
                $fieldNameValueLabel.text(this._valueFieldName);
                $topdiv1.append($fieldNameLabel, $fieldNameValueLabel);
                $dlg.append($topdiv1);
                $bottomdiv = ej.buildTag("div");
                $fieldValueLabel = ej.buildTag("label#" + dlgId + "_fieldvallabel.e-dlg-fieldvaluelabel", xlObj._getLocStr("SummarizeChooseType"));
                $listSummary = ej.buildTag("ul#" + dlgId + "_summarylist","", { width: "150px", height:"150px" })
                $bottomdiv.append($fieldValueLabel, $listSummary);
                $maindiv.append($bottomdiv);
                $ul = ej.buildTag("ul .e-ul");
                $summaryTag = ej.buildTag("a", xlObj._getLocStr("SummarizeValue"), {}, { href: "#" + dlgId + "_summary" });
                $li = ej.buildTag("li", $summaryTag);
                $listSummary.ejListBox({
                    selectedItemIndex: "0", width: "150px", height: "150px", dataSource: summarySrc,
                    fields: { text: "text", value: "value" },
                    allowMultiSelection: false
                });
                $ul.append($li);
                $tab.append($ul);
                $ctnr.append($tab);
                //create button content
                $btndiv = ej.buildTag("div.e-dlg-btnfields");
                $btnctnr = ej.buildTag("div.e-dlg-btnctnr");
                $okBtn = ej.buildTag("input#" + dlgId + "_okbtn");
                $canBtn = ej.buildTag("input#" + dlgId + "_cantn");
                $okBtn.ejButton({ text: xlObj._getLocStr("Ok"), showRoundedCorner: true, width: 60, click: ej.proxy(this._fielddlgOk, this) , cssClass: "e-ss-okbtn"});
                $canBtn.ejButton({ text: xlObj._getLocStr("Cancel"), showRoundedCorner: true, width: 60, click: ej.proxy(this._fielddlgCancel, this) });
                $btndiv.append($btnctnr.append($okBtn, $canBtn));
                xlObj.element.append($dlg.append($ctnr, $btndiv));
                $tab.ejTab({ width: "100%", height: "auto", cssClass: "e-ss-dlgtab", allowKeyboardNavigation: false });
                $contentdiv = $("#" + dlgId + "_summary");
                $contentdiv.append($maindiv);
                $dlg.ejDialog({ enableModal: true, showOnInit: false, enableResize: false, allowKeyboardNavigation: false, title: xlObj._getLocStr("ValueFieldSettings"), width: "auto", height: "auto", cssClass: "e-ss-dialog e-ss-mattab e-ss-fcdlg e-" + xlObj._id + "-dlg", open: function () { $("#" + xlObj._id + "_formatdlg_okbtn").focus(); } });
                $dlg.ejDialog("open");
                this._refreshSummaryList();
        },

        _refreshSummaryList: function () {
            var xlObj = this.XLObj, xlId = xlObj._id, dlgId = xlId + "_fielddlg", $fieldNameValueLabel, listObj, tabObj, i, sheetIdx = xlObj.getActiveSheetIndex(),
            pvtID = xlObj._getContent(sheetIdx).find(".e-ss-activepivot")[0].id, pivotGrid = $("#" + pvtID).data("ejPivotGrid"), len = pivotGrid.model.dataSource.values.length,
                dataSrc = pivotGrid.model.dataSource, summarytype;
            for (i = 0; i < len; i++)
                if (dataSrc.values[i].fieldName == this._valueFieldName)
                    summarytype = ej.isNullOrUndefined(dataSrc.values[i].summaryType) ? "sum" : dataSrc.values[i].summaryType;
            $fieldNameValueLabel = $("#"+ dlgId + "_fieldnamevaluelabel");
            $fieldNameValueLabel.text(this._valueFieldName);
            listObj = $("#" + dlgId + "_summarylist").data("ejListBox");
            listObj.selectItemByValue(summarytype);
            tabObj = $("#" + xlId + "_fielddlg_fieldtab").data("ejTab");
            tabObj && tabObj._refresh();
        },

        _fielddlgOk: function () {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), xlId = xlObj._id, dlgId = xlId + "_fielddlg", listObj = $("#" + dlgId + "_summarylist").data("ejListBox"),
                pvtID = xlObj._getContent(sheetIdx).find(".e-ss-activepivot")[0].id, pivotGrid = $("#" + pvtID).data("ejPivotGrid"), i, dataSrc = pivotGrid.model.dataSource, 
                len = dataSrc.values.length, selValue = listObj.getSelectedItems()[0].text;
            for (i = 0; i < len; i++)
                if (dataSrc.values[i].fieldName == this._valueFieldName)
                    dataSrc.values[i].summaryType = ej.PivotAnalysis.SummaryType[selValue];
                pivotGrid.refreshControl();
            $("#" + dlgId).ejDialog("close");
        },

        _fielddlgCancel: function(){
            $("#" + this.XLObj._id + "_fielddlg").ejDialog("close");
        },

        _changePvtName: function () {
            var xlObj = this.XLObj, newName = xlObj.element.find("#" + xlObj._id + "_Ribbon_Analyze_PivotTable_PivotTableName").val(), sheetIdx = xlObj.getActiveSheetIndex(), id = xlObj._getContent(sheetIdx).find(".e-ss-activepivot")[0].id;
            xlObj.getSheet(sheetIdx).pivotMngr.pivot[id].tableName = this.names[id] = newName;
            xlObj._trigActionComplete({ pvtName: newName, reqType: "shape", shapeType: "pivot", sheetIndex: sheetIdx, ID: id });
        },

       
        _checkRange: function (dataAddr, tblAddr) {          
            var xlObj = this.XLObj, activeCell = xlObj.getActiveCell(), sheetIdx, rowIdx = activeCell.rowIndex, colIdx = activeCell.colIndex, value, range = [];
            var selected = xlObj._getContent(xlObj.getActiveSheetIndex()).find(".e-ss-activepivot");
            var temp, i, len, isError = {isHeader: false, isRows: false};
            temp = xlObj.XLRibbon._getAddrFromDollarAddr(dataAddr);
            sheetIdx = temp[0];
            range = xlObj.getRangeIndices(temp[1]);
            rowIdx = range[0];
            colIdx = range[1];
            if(dataAddr.length)
            for (i = 0, len = range[3] - colIdx + 1; i < len; i++) {
                value = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx + i, "value", sheetIdx);
                if ((xlObj.isUndefined(value) || value == ""))
                    isError["isHeader"] = true;
            }
            if (rowIdx === range[2])
                isError["isRows"] = true;
            if (tblAddr.length) {
                var pvtMngr, keys, j, keyLen, pvtObj, columnCount, colCount, rowCount, rowIndex, colIndex, pivot;
                temp = xlObj.XLRibbon._getAddrFromDollarAddr(tblAddr);
                sheetIdx = temp[0];
                range = xlObj.getRangeIndices(temp[1]);
                for (i = 1, len = xlObj.model.sheetCount; i <= len; i++) {
                    pvtMngr=xlObj.model.sheets[i].pivotMngr.pivot;
                    keys=xlObj.getObjectKeys(pvtMngr);
                    for (j = 0, keyLen = keys.length; j < keyLen; j++) {
                        if (!selected.length || (selected.length && keys[j] !== selected[0].id)) {
                            pvtObj = xlObj.element.find("#" + keys[j]).data("ejPivotGrid");
                            pivot = pvtMngr[keys[j]];
                            colCount = pvtObj.getJSONRecords().length / pvtObj.rowCount;
                            rowCount = pvtObj.rowCount;
                            rowIndex = (!rowCount || isNaN(rowCount)) ? pivot.rowIndex + 17 : pivot.rowIndex + rowCount - 1; // 18 is excel default pivot row count
                            colIndex = (!colCount || isNaN(colCount)) ? pivot.colIndex + 2 : pivot.colIndex + colCount - 1;  // 2 is excel default pivot col count
                            if (range[0] >= pivot.rowIndex && range[0] <= rowIndex && range[1] >= pivot.colIndex && range[1] <= colIndex) {
                                isError["isOverlap"] = true;
                                break;
                            }
                        }
                }
                }
            }
            return isError;
        },

        _updateSheetName: function (updatedValue) {
            var xlObj = this.XLObj, i, j, len, pvt, keys, kLen, oldValue = xlObj.getSheet(xlObj.getActiveSheetIndex()).sheetInfo.text;
            for (i = 1, len = xlObj.model.sheetCount; i <= len; i++) {
                pvt = xlObj.getSheet(i).pivotMngr.pivot;
                keys = xlObj.getObjectKeys(pvt);
                for (j = 0, kLen = keys.length; j < kLen; j++) {
                    if (pvt[keys[j]].dataSheetName === oldValue)
                        pvt[keys[j]].dataSheetName = updatedValue;
                }
            }
        },

        _getSheetIdxFromName: function (name) {
            var xlObj = this.XLObj, i, len;
            for (i = 1, len = xlObj.model.sheetCount; i <= len; i++)
                if(xlObj.model.sheets[i].sheetInfo.text == name)
                    return i;            
        },
        
        _changeDataSource: function () {
            var range, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), pvtID = xlObj._getContent(sheetIdx).find(".e-ss-activepivot")[0].id, pivotGrid = $("#" + pvtID).data("ejPivotGrid");
            var pivotSchema, temp, dataSheetName, pivotData, pvtObj, olapReport = pivotGrid.getOlapReport();
            temp = xlObj.XLRibbon._getAddrFromDollarAddr($("#" + xlObj._id + "_Ribbon_PvtRange").val());
            dataSheetName = xlObj.model.sheets[temp[0]].sheetInfo.text;
            range = xlObj.getRangeIndices(temp[1]);
            pvtObj = xlObj.getSheet(xlObj.getActiveSheetIndex()).pivotMngr.pivot[pvtID];
            pvtObj.dataRange = range;
            pvtObj.dataSheetName = dataSheetName;
            pivotData = xlObj.getRangeDataAsJSON({ rowIndex: range[0], colIndex: range[1] }, { rowIndex: range[2], colIndex: range[3] }, false, temp[0]);
			if(xlObj.getObjectKeys(pivotGrid.model.dataSource.data[0]).length !==  xlObj.getObjectKeys(pivotData[0]).length){
			   olapReport.rows = [];
               olapReport.columns = [];
               olapReport.values = [];
               olapReport.filters = [];
			}
			olapReport.data = pivotData;
			pivotSchema = $("#" + xlObj._id + "_PivotTableSchema_" + pvtID).data("ejPivotSchemaDesigner");
			pivotGrid.model.dataSource.data = pivotData;
			this._refreshFieldList(pivotGrid, pivotSchema, pivotData);
            xlObj._trigActionComplete({ sheetIndex: sheetIdx, dataRange: pvtObj.dataRange, ID: pvtID, pvtData: pivotData, reqType: "shape", shapeType: "pivot" });
        },
         
		_refreshFieldList:function(pivotGrid, pivotSchema, pivotData) {
			var xlObj = this.XLObj, dropArgs, i, len, objKeys = xlObj.getObjectKeys(pivotData[0]);
			for(i=0, len = objKeys.length; i<len;i++){
			   dropArgs = { droppedFieldName: objKeys[i], droppedFieldCaption: objKeys[i], droppedClass: "row", droppedPosition: "", isMeasuresDropped: (objKeys[i].toLocaleLowerCase().indexOf("measures") == 0) };
			   ej.Pivot.addReportItem(pivotGrid.model.dataSource, dropArgs);
			}
			pivotGrid.refreshPivotGrid();
			pivotSchema.model.pivotControl = pivotGrid;
            $(pivotSchema.element).html("");
            pivotSchema._load();           
			xlObj._refreshActivationPanel();
		},
		
        _getPivotIDFromName: function(name){
            for (var key in this.names) {
                if (name === this.names[key])                   
                    return key;                
            }
        },        

        _clearFilters: function (pivotGrid, pivotSchema) {
            var xlObj = this.XLObj, olapReport = pivotGrid.getOlapReport();
            olapReport.rows = [];
            olapReport.columns = [];
            olapReport.values = [];
            olapReport.filters = [];
            pivotGrid.refreshPivotGrid();
            pivotSchema.model.pivotControl = pivotGrid;
            $(pivotSchema.element).html("");
            pivotSchema._load();           
			xlObj._refreshActivationPanel();
        },

        _movePivotTable: function () {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), pvtElem = xlObj._getContent(sheetIdx).find(".e-ss-activepivot"), pvtID = pvtElem[0].id, pivot, pvtObj = pvtElem.data("ejPivotGrid");;
            var splitStr, tblSheetIdx, cell, $cell, pvtRange, newSheetIdx, isUpdate = true, moveRange, colCount, rowCount;
            pivot = xlObj.getSheet(sheetIdx).pivotMngr.pivot[pvtID];          
            if ($("#" + xlObj._id + "_dlg_existsheet").data("ejRadioButton").model.checked) {
                isUpdate = false;
                splitStr = $("#" + xlObj._id + "_Ribbon_PvtLocation").val().split("!");
                tblSheetIdx = this._getSheetIdxFromName(splitStr[0]);
                pvtRange = xlObj.getRangeIndices(xlObj.XLRibbon._getAddrFromDollarAddr(splitStr[1])[1]);
                if (sheetIdx !== tblSheetIdx) {
                    xlObj._getContent(tblSheetIdx).find(".e-content").append(pvtElem);
                    xlObj.gotoPage(tblSheetIdx, false);
                    xlObj.XLSelection._cleanUp(true);
                    isUpdate = true;                   
                }               
                pivot.rowIndex = pvtRange[0];
                pivot.colIndex = pvtRange[1];
            }
            else {
                xlObj.insertSheet();
                sheetIdx=xlObj.getActiveSheetIndex();
                xlObj._getContent(sheetIdx).find(".e-content").append(pvtElem);
                pvtRange = [2, 0];               
            }
            if (isUpdate) {
                newSheetIdx = xlObj.getActiveSheetIndex();
                xlObj.getSheet(newSheetIdx).pivotMngr.pivot[pvtID] = {};                
                $.extend(true, xlObj.getSheet(newSheetIdx).pivotMngr.pivot[pvtID], pivot);
                if(newSheetIdx !== sheetIdx)
                delete xlObj.getSheet(sheetIdx).pivotMngr.pivot[pvtID];
            }
            $cell = xlObj.getCell(pvtRange[0], pvtRange[1]);
			if(!$cell && xlObj.model.scrollSettings.allowVirtualScrolling){ 
				var sheet =xlObj.getSheet(xlObj.getActiveSheetIndex());									
				xlObj._scrollContent({y: sheet._rowHeightCollection[pvtRange[0]+1] - sheet._scrollTop});
				$cell = xlObj.getCell(pvtRange[0], pvtRange[1]);
			}
		    cell=$cell[0];
            pvtElem.css({ left: cell.offsetLeft - 2, top: cell.offsetTop -2 });
            if(pvtObj.getOlapReport().filters.length)
            while (pivot.rowIndex <= pvtObj.getOlapReport().filters.length) {
                pivot.rowIndex = pivot.rowIndex + 1;
                cell = xlObj.getCell(pivot.rowIndex, pivot.colIndex)[0];
                pvtElem.css({ left: cell.offsetLeft -2, top: cell.offsetTop -2});
            }
            rowCount = pvtObj._rowCount;
            colCount = (pvtObj.calculateCellWidths().columnWidths).length;
            moveRange = [pvtRange[0], pvtRange[1], pvtRange[0] + rowCount, pvtRange[1] + colCount];
            this._refreshRowColumn(moveRange, pvtObj);
            xlObj._trigActionComplete({ sheetIndex: sheetIdx, newRange: moveRange, ID: pvtID, reqType: "shape", shapeType: "pivot" });
        },
    
    };

})(jQuery, Syncfusion);