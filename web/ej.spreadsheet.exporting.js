(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.exporting = function (obj) {
        this.XLObj = obj;
		this._exportType = "";
    };

    ej.spreadsheetFeatures.exporting.prototype = {
        //Exporting        
        "export": function (type, fileName) {
            var xlObj = this.XLObj;
            if (!xlObj.model.exportSettings.allowExporting || xlObj.model.isReadOnly)
                return;
            xlObj._isExport = true;
			if(ej.isNullOrUndefined(fileName))
			fileName = "Sample";
            this._renderAll();
            xlObj._isExport = false;
            var expSettings = xlObj.model.exportSettings, attr, form, inputAttr, input, url, expObj, serverEvent, args, clientArgs, evtArgs, param;
            if (type === ej.Spreadsheet.exportType.Excel) 
                url = expSettings.excelUrl;
            else if (type === ej.Spreadsheet.exportType.Csv) 
                url = expSettings.csvUrl;
            else 
                url = expSettings.pdfUrl;
            expObj = this.getExportProps();
            evtArgs = { exportType: type, url: url, customParams: {} };
            serverEvent = ej.raiseWebFormsServerEvents ? type.toLowerCase() + "Exporting" : "";
            if (ej.raiseWebFormsServerEvents && xlObj.model.serverEvents && xlObj.model.serverEvents.indexOf(serverEvent) > -1) {
                args = { model: $.extend(true, {}, xlObj.model), originalEventType: serverEvent };
                clientArgs = { sheetModel: expObj.model, sheetData: expObj.data, fileName: fileName, password: expSettings.password ? expSettings.password : "" };
                if (xlObj._trigger("onExport", evtArgs))
                    return;
                if (xlObj.getObjectLength(evtArgs.customParams))
                    $.extend(clientArgs, evtArgs.customParams)
                ej.raiseWebFormsServerEvents(serverEvent, args, clientArgs);
                setTimeout(function () {
                    ej.isOnWebForms = true;
                }, 1000);
            }
            else {
                if (ej.isNullOrUndefined(url)) {
                    xlObj._showAlertDlg("Alert", "ImportExportUrl", "", 266);
                    return;
                }
                if (!expSettings.allowExporting || xlObj.isUndefined(url))
                    return;
                if (xlObj._trigger("onExport", evtArgs))
                    return;
                url = evtArgs.url;
                attr = { action: url, method: "post" };
                form = ej.buildTag("form", "", null, attr);
                inputAttr = { name: "sheetData", type: "hidden", value: expObj.data };
                input = ej.buildTag("input", "", null, inputAttr);
                form.append(input);
                inputAttr = { name: "sheetModel", type: "hidden", value: expObj.model };
                input = ej.buildTag("input", "", null, inputAttr);
                form.append(input);
				inputAttr = { name: "fileName", type: "hidden", value: fileName };
                input = ej.buildTag("input", "", null, inputAttr);
                form.append(input);
                inputAttr = { name: "Password", type: "hidden", value: expSettings.password };
                input = ej.buildTag("input", "", null, inputAttr);
                form.append(input);
                for (param in evtArgs.customParams) {
                    inputAttr = { name: param, type: "hidden", value: evtArgs.customParams[param] };
                    input = ej.buildTag("input", "", null, inputAttr);
                    form.append(input);
                }  
                $("body").append(form);
                form.submit();
            }
        },
       
        _dropElements: function (model) {
            var actSheet = model.sheets, arr = ["_spreadSheetPager", "dataSource", "rangeSettings"], i, j, content;
            model.undoCollection = [];
            for (i in actSheet) {
                content = actSheet[i];
                for (j in content) {
                    if (arr.indexOf(j) > -1)
                        content[j] = null;
                }
            }
            return model;
        },
         
         _getRequriedProp: function (model) {
            var xlObj = this.XLObj, modelClone = {}, i, j, len, arr = ["sheetCount", "activeSheetIndex", "nameManager"], content, actSheet, cloneSheet;
            for (i = 0, len = arr.length; i < len; i++) {
                modelClone[arr[i]] = model[arr[i]];
            }         
            if (xlObj.model.allowCellFormatting && xlObj.getObjectLength(xlObj.XLFormat._customFontFamily) > 0)
                modelClone["customFontFamily"] = xlObj.XLFormat._customFontFamily;
            if (xlObj._isDefaultLocked)
                modelClone["ExcelLikeLockedCells"] = true;
            actSheet = model.sheets;
            modelClone["sheets"] = [];
			if(xlObj._calcEngine.getCalculatingSuspended())
				modelClone["IsManualCalculation"] = true;
            arr = ["_activeCell", "_endCell", "_startCell", "colCount", "columnsWidthCollection", "rowsHeightCollection", "rowCount", "frozenColumns", "frozenRows", "usedRange", "dataAttribute", "filterSettings", "tableManager", "sheetInfo", "hideColsCollection", "hideRowsCollection", "showGridlines", "showHeadings", "isSheetProtected", "shapeMngr", "chart", "pivotMngr", "topLeftCell", "paneTopLeftCell"];
            for (i in actSheet) {
                modelClone["sheets"][i] = {};
                cloneSheet = modelClone["sheets"][i];
                content = actSheet[i];
                for (j = 0, len = arr.length; j < len; j++) {
                    cloneSheet[arr[j]] = content[arr[j]];
                }
            }           
            return modelClone;
        },
        getExportProps: function () {
            var xlObj = this.XLObj, i, j, k, len, slen, chartObj, modelClone, series, contClone = $.extend(true, {}, xlObj._dataContainer), model = {}, objKeys=[];		
            var key, pivot, chart = {}, range, seriesRange, sRange;
            xlObj._refreshHashCode(contClone.hashCode);
            model = JSON.parse(JSON.stringify(xlObj.model));    
            for (i = 1; i < model.sheets.length; i++) { 
                chart = {};
                pivot = {};
                $.extend(true, chart, model.sheets[i].shapeMngr.chart);
                objKeys = xlObj.getObjectKeys(chart);
                model.sheets[i].shapeMngr.chart = {};           
                for (j = 0, len = objKeys.length; j < len; j++) {
					key = chart[objKeys[j]].id;
                    chartObj = $("#" + key).data("ejChart");
                    if (chartObj) {						
                        chartObj.model.event = null;
                        modelClone = JSON.parse(JSON.stringify(chartObj.model));                      
                        series = modelClone.series;
                        for (k = 0, slen = series.length; k < slen; k++) {
                            delete series[k].dataSource;
                            delete series[k].query;
                            series[k].fill = jQuery.type(series[k].fill) == "array" ? series[k].fill[0].color : series[k].fill;
                        } 
						modelClone.dataSheetIdx = chart[key].dataSheetIdx;
                        model.sheets[i].shapeMngr.chart[key]=modelClone;
                        if (!chart[key].isChartSeries) {
                            range = chart[key]["range"];
                            model.sheets[i].shapeMngr.chart[key]["range"] = xlObj._generateHeaderText(range[1] + 1) + (range[0] + 1) + ":" + xlObj._generateHeaderText(range[3] + 1) + (range[2] + 1);
                        } 
                        else {
                            seriesRange = chart[key]["seriesRange"];
                            model.sheets[i].shapeMngr.chart[key]["seriesRange"] = seriesRange;
                            for(var n = 0; n < seriesRange.length; n++){
                                sRange = model.sheets[i].shapeMngr.chart[key]["seriesRange"][n];
                                sRange["xRange"]= seriesRange[n]["xRange"];
                                sRange["yRange"]= seriesRange[n]["yRange"];
                                sRange["lRange"]= seriesRange[n]["lRange"];
                            }
                        }
                        model.sheets[i].shapeMngr.chart[key]["top"]=chart[key]["top"];
						model.sheets[i].shapeMngr.chart[key]["left"]=chart[key]["left"];
						model.sheets[i].shapeMngr.chart[key]["height"]=chart[key]["height"];
						model.sheets[i].shapeMngr.chart[key]["width"]=chart[key]["width"];
                        model.sheets[i].shapeMngr.chart[key]["isRowColSwitched"]=chart[key]["isRowColSwitched"];
                    }
                }               
                objKeys = xlObj.getObjectKeys(model.sheets[i].pivotMngr.pivot);
                for (j = 0, len = objKeys.length; j < len; j++) {
                    key = objKeys[j];
                    pivotObj = $("#" + key).data("ejPivotGrid");
                    if (pivotObj) {
                        model.sheets[i].pivotMngr.pivot[key]["rows"] = pivotObj.getOlapReport().rows;
                        model.sheets[i].pivotMngr.pivot[key]["columns"] = pivotObj.getOlapReport().columns;
                        model.sheets[i].pivotMngr.pivot[key]["filters"] = pivotObj.getOlapReport().filters;
                        model.sheets[i].pivotMngr.pivot[key]["values"] = pivotObj.getOlapReport().values;
                    }
                }
            }
            model.sheets.shift();  		
            return { model: JSON.stringify(this._getRequriedProp(model)), data: JSON.stringify(contClone) };
        },

        _renderAll: function () {
            var i, j, sheet, range, xlObj = this.XLObj, sheets = xlObj.getSheets(), actSheetIdx = xlObj.getActiveSheetIndex();
            for (i = 1; i < sheets.length; i++) {
                sheet = sheets[i];
                if (xlObj.model.importSettings.allowSheetOnDemand && sheet._isImported && !sheet._isRequested)
                    xlObj._importSheet(i, false);
                if (!sheet._isLoaded)
                    xlObj.gotoPage(i);
                if (xlObj.model.scrollSettings.allowVirtualScrolling && !sheet._isImported && sheet._hasDataSrc) {
                    for (j = 1; j <= sheet._virtualBlockCnt; j++) {
                        if (sheet._virtualDataLoadedBlks.indexOf(j) === -1) {
                            sheet._virtualDataLoadedBlks.push(j);
                            range = this._getRange(j, i);
                            xlObj._refreshDataSrc(range, i);
                            xlObj._refreshCellData(range, i);
                        }
                    }
                }
            }
            xlObj.hideWaitingPopUp();
            xlObj.gotoPage(actSheetIdx);
        },

        _getRange: function (i, sheetIdx) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx), range = [0, 0, 0, sheet.colCount - 1];
            range[0] = (sheet._virtualBlockRowCnt * (i - 1));
            range[2] = (sheet._virtualBlockRowCnt * i) - 1;
            return range;
        },
		
		_exportFileNameDlg: function () {
            var xlObj = this.XLObj,$dlg, $label, $saveBtn, $canBtn, $btndiv, $div;
            $dlg = ej.buildTag("div", "", "", { id: xlObj._id + "_ExportFileNameDialog" });
            $btndiv = ej.buildTag("div.e-dlg-btnfields");
            $div = ej.buildTag("div.e-dlg-btnctnr");
            $label = "<div class= 'e-dlgctndiv'><table><tr class= 'e-dlgtd-fields'><td><label>" + xlObj._getLocStr("FileName") + ":</label></td><td><form id='" + xlObj._id + "_Form_xlFileName' onsubmit='return false'><input id ='" + xlObj._id + "_xlFileName' type ='text' value = 'Sample' class = 'ejinputtext'/></form></td></tr></table></div>";
            $dlg.append($label);
            $saveBtn = ej.buildTag("input", "", "", { type: "submit" });
            $canBtn = ej.buildTag("input");
            $saveBtn.ejButton({ text: xlObj._getLocStr("Save"), showRoundedCorner: true, width: 60, click: ej.proxy(this._dlgSave, this), enabled: true, cssClass:"e-ss-okbtn" });
            $canBtn.ejButton({ text: xlObj._getLocStr("Cancel"), click: ej.proxy(this._dlgCancel, xlObj), showRoundedCorner: true, width: 60 });
            $btndiv.append($div.append($saveBtn, $canBtn));
            $dlg.append($btndiv);
            $dlg.ejDialog({ enableModal: true, showOnInit: false, enableResize: false, allowKeyboardNavigation: false, title: xlObj._getLocStr("SaveFile"), width: "auto", height: "auto", cssClass: "e-ss-dialog e-" + xlObj._id + "-dlg", close: ej.proxy(this._dlgCancel, xlObj) , open: ej.proxy(function (e) {
                var fileNameElm = $("#" + xlObj._id + "_xlFileName");
                fileNameElm.focus().setInputPos(fileNameElm.val().length).select();
            }) });
            xlObj.XLRibbon._dialogValidate("_xlFileName");
        },
		
        _dlgSave: function (args) {
            var xlObj = this.XLObj, id = xlObj._id;
            if($("#" + id + "_Form_xlFileName").valid()){
                this["export"](ej.Spreadsheet.exportType[this._exportType], $("#" + id + "_xlFileName").val());
                $("#" + id + "_ExportFileNameDialog").ejDialog("close");
            }
        },
       
        _dlgCancel: function (args) {
            $("#" + this._id + "_ExportFileNameDialog").ejDialog("close");
        }
        
    };
})(jQuery, Syncfusion);