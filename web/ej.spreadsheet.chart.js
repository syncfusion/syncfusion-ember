(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.chart = function (obj) {
        this.XLObj = obj;
        this._shapeCnt = 1;
    };

    ej.spreadsheetFeatures.chart.prototype = {
        createChart: function (range, options) {
            var xlObj = this.XLObj;
            if (!xlObj.model.allowCharts || (xlObj.getSheet()._isLoaded && xlObj.model.isReadOnly))
                return;
            options = options || {};
            var cnt, chartElem, chartOptions, details, cellIdx, cellInfo, chartModel, chartRange, type = "chart",
                sheetIdx = xlObj._getSheetIndex(options.sheetIdx), sheet = xlObj.getSheet(sheetIdx), sId, formulaBar, formulaWt, isRowLesser = false;
            if (xlObj._isUndoRedo) {
                sId = options.id.split("_");
                cnt = sId[sId.length - 1].replace(/[a-z]/g, '');
            }
            if(!options.isChartSeries)
                options.isChartSeries = (options.series && range == null);
            if (!options.isChartSeries)
                range = xlObj._getRangeArgs(range, "object");
            if (!ej.isNullOrUndefined(options.top) && !ej.isNullOrUndefined(options.left))
                options.activeCell = xlObj.XLShape._getCellIndexFromOffset(options.top, options.left);
            if (!options.activeCell)
                options.activeCell = sheet._activeCell;
            if ((!xlObj.isRange(range) || !options.activeCell) && !options.isChartSeries)
                return;
            cellInfo = xlObj._getCellInfo(options.activeCell);
            options.id = cnt ? xlObj._id + "_" + type + cnt : xlObj._id + "_" + type + this._shapeCnt;
            options.type = options.type ? options.type : "column";
            options.animation = options.animation ? options.animation : false;
            if (!options.isChartSeries)
                options.range = range;
            options.dataSheetIdx = options.dataSheetIdx ? options.dataSheetIdx : sheetIdx;
            options.height = options.height ? options.height : xlObj.model.chartSettings.height;
            options.width = options.width ? options.width : xlObj.model.chartSettings.width;
            options.top = options.top ? options.top : cellInfo.top + 2;
            options.left = options.left ? options.left : cellInfo.left + 2;
            if (options.range) {
                rDiff = options.range[2] - options.range[0];
                cDiff = options.range[3] - options.range[1];
                if (rDiff < cDiff) {
                    isRowLesser = true;
                }
            }
            options.isRowColSwitched = isRowLesser ? true : options.isRowColSwitched ? options.isRowColSwitched : false;
            cellIdx = xlObj._getIdxWithOffset(options.top, options.left, true);
            options.rowIndex = cellIdx.rowIdx;
            options.colIndex = cellIdx.colIdx;
            options.isResponsive = false;
            options.canResize = false;
            if (!options.isChartSeries) {
                if (xlObj.isUndefined(options.xRange)) {
                    chartRange = this._processChartRange(range, options.dataSheetIdx, options);
                    options.xRange = chartRange.xRange;
                    options.yRange = chartRange.yRange;
                    options.lRange = chartRange.lRange;
                }
                chartOptions = this._processChartSeries(options);
                if (options.series && (xlObj.XLClipboard._copyCells.length || xlObj.XLClipboard._cutCells.length))
                    chartOptions["series"] = options.series;
            }
			if(options.isChartSeries && xlObj.isUndefined(options.series)){
				chartOptions = this._processChartSeries(options);
				options.series = chartOptions.series;
			}
             if (!options.isChartSeries) {
                if ((xlObj.getActiveSheetIndex() === options.dataSheetIdx))
                    this._focusChartRange(chartOptions.xRange, chartOptions.yRange, chartOptions.lRange);
             }
            chartElem = this._renderBaseElem(type, options.top, options.left, cnt);
            chartElem.ejChart(this._processChartOptions(options, options.isChartSeries ? null : chartOptions.series ));
            this._afterChartRefresh();
            chartModel = chartElem.ejChart("model");
            options.series = chartModel.series;
            options.theme = chartModel.theme;
			chartModel.primaryXAxis.range = chartModel.primaryXAxis.actualRange;
            chartModel.primaryYAxis.range = chartModel.primaryYAxis.actualRange; 
            options.title = { text: chartModel.title.text.length ? chartModel.title.text : "", align: chartModel.title.textAlignment, font: chartModel.title.font };
            options.xAxis = { min: chartModel.primaryXAxis.range.min, max: chartModel.primaryXAxis.range.max, interval: chartModel.primaryXAxis.range.interval, title: { text: chartModel.primaryXAxis.title.text.length ? chartModel.primaryXAxis.title.text : "" }, range: !options.isChartSeries ? chartOptions.xRange : null};
            options.yAxis = { min: chartModel.primaryYAxis.range.min, max: chartModel.primaryYAxis.range.max, interval: chartModel.primaryYAxis.range.interval, title: { text: chartModel.primaryYAxis.title.text.length ? chartModel.primaryYAxis.title.text : "" }, range: !options.isChartSeries ?chartOptions.yRange : null };
            options.legend = { visible: chartModel.legend.visible, range: !options.isChartSeries ? chartOptions.lRange : null, position: chartModel.legend.position };
            !sheet._isImported && (xlObj.XLShape._insertShape = true);
            xlObj.XLShape._updateShapeMngr(options.activeCell, { chart: options }, "chart");
            xlObj.element.append('<input id=' + xlObj._id + '_chart type="text" style="display:none;"/>');
            if (options.theme.indexOf("dark") > -1)
                chartElem.addClass('e-ss-charttheme');
            if (xlObj.model.showRibbon && !options.hideTab)
                xlObj.XLRibbon._chartDesignTabUpdate(chartElem);
            xlObj._on(chartElem, ej.eventType.mouseDown, xlObj._mouseDownHandler);
            xlObj._on(chartElem, ej.eventType.mouseMove, xlObj._mouseMove);
            chartElem.height(chartElem.height() - 5); // SVG parent div increases height of 5px.
            xlObj._setSheetFocus();
            if (!xlObj._isSheetNavigate && (!sheet._isImported || sheet._isLoaded) && !xlObj._isUndoRedo && !xlObj._isPaste && !xlObj.XLClipboard._isShape) {
                details = { sheetIndex: sheetIdx, reqType: "shape", shapeType: "chart", action: "create", options: options, range: options.range, id: options.id, position: { top: options.top, left: options.left }, operation: "create", seriesRange: options.seriesRange, isChartSeries: options.isChartSeries };
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);

            }
            return options.id;
        },
        resizeChart: function (id, height, width) {
            var obj = {}, elem = $("#" + id), cModel = elem.ejChart("model"), xlObj = this.XLObj, formulaBar;
            if (xlObj.model.isReadOnly)
                return;
            if (elem.length) {
                (!ej.isNullOrUndefined(height) && height > 180) ? obj.height = height.toString() : obj.height = "180";
                (!ej.isNullOrUndefined(width) && width > 180) ? obj.width = width.toString() : obj.width = "180";
				if (xlObj.model.allowFormulaBar)
					formulaBar = xlObj.element.find('.e-formulabar')[0];
				formulaBar && (formulaBar.style.display = "none");
                elem.ejChart("option", { size: obj });
   				formulaBar && (formulaBar.style.display = "block");
                xlObj.XLRibbon._setShapeWidthHeight({ height: cModel.size.height, width: cModel.size.width, shapeType: "chart" });
            }
        },

        refreshChart: function (id, options) {// can update type, enable3D, marker, range and theme in chart           
            var xlObj = this.XLObj;
            if (!xlObj.model.allowCharts || xlObj.model.isReadOnly)
                return;
            var i, marker = "marker", cProp = this._getShapeObj(id, "chart"), cOptions, cElem = xlObj.element.find("#" + id), cObj = cElem.data("ejChart"), chartRange, range;
            if (cProp) {
                for (i in options)
                    cProp[i] = options[i];
                if (options.type) {
                    options.commonSeriesOptions = { type: options.type };
                    delete options.type;
                }
                if (marker in options) {
                    if (options.commonSeriesOptions)
                        options.commonSeriesOptions.marker = { visible: options.marker.visible };
                    else
                        options.commonSeriesOptions = { marker: options.marker };
                    delete options[marker];
                }
                if (options.range) {
                    cObj.model.series.length = 0;
                    if ((options.range[0].xRange || options.range[0].yRange || options.range[0].lRange)) {
                        options.range[0].lRange = ej.isNullOrUndefined(options.range[0].lRange) ? "" : options.range[0].lRange;
                        cProp.isChartSeries = true;
                        cProp.seriesRange = options.range;
                        cOptions = this._processSeriesValues(cProp);
                    }
                    else {
                        cObj.model.series.length = 0;
                        range = xlObj._getRangeArgs(options.range, "object");
                        chartRange = this._processChartRange(range, cProp.dataSheetIdx, cProp);
                        cProp.isChartSeries = false;
                        cProp.xRange = chartRange.xRange;
                        cProp.yRange = chartRange.yRange;
                        cProp.lRange = chartRange.lRange;
                        cProp.legend.range = chartRange.lRange;
                        cOptions = this._processChartSeries(cProp);
                        options.xRange = chartRange.xRange;
                        options.yRange = chartRange.yRange;
                        options.lRange = chartRange.lRange;
                        this._focusChartRange(chartRange.xRange, chartRange.yRange, chartRange.lRange);
                    }
                    cProp.xAxis.range = (cProp.isChartSeries) ? null : chartRange.xRange;
                    cProp.yAxis.range = (cProp.isChartSeries) ? null : chartRange.yRange;
                    options.series = cOptions.series;
                } else if (options.seriesRange) {
                    cProp.seriesRange = options.seriesRange;
                    cOptions = this._processSeriesValues(cProp);
                }
                $("#" + id).ejChart("option", options);
                if ("left" in options || "top" in options) {
                    xlObj.XLShape._shapeType = "chart";
                    cElem.css({ left: cProp.left, top: cProp.top });
                    xlObj.XLShape._picCellIdx = { rowIndex: cProp.rowIndex, colIndex: cProp.colIndex };
                    xlObj.XLShape._selectImg(cElem);
                    xlObj.XLShape._updateShapeObj(cElem[0]);
                    xlObj.XLShape._shapeType = "img";
                }
            }
        },

        _processChartOptions: function (options, chartOptions) {
            var xVisiblity, yVisiblity, opt = { commonSeriesOptions: { type: options.type, enableAnimation: options.animation }, series: chartOptions == null ? options.series : chartOptions , canResize: options.canResize, size: { height: options.height.toString(), width: options.width.toString() }, enableRotation: false, depth: 100, wallSize: 2, tilt: 0, rotation: 34, perspectiveAngle: 90, sideBySideSeriesPlacement: true };
            xVisiblity = yVisiblity = false;
			if (options.enable3D)
                opt.enable3D = true;
            if (options.marker)
                opt.commonSeriesOptions.marker = options.marker;
            if (options.theme)
                opt.theme = options.theme;
            opt.title = options.title || {};
            if (this.XLObj.getObjectLength(opt.title) > 0) {
                opt.title.textAlignment = options.title.align;
                delete opt.title.align;
            }
            opt.legend = options.legend || {};
            if (options.xAxis && options.xAxis.minorGridLines)
                xVisiblity = options.xAxis.minorGridLines.visible;
            if (options.yAxis && options.yAxis.minorGridLines)
                yVisiblity = options.yAxis.minorGridLines.visible;
           opt.primaryYAxis = options.primaryYAxis || { labelFormat: this._chartYAxisFormat(options.yRange), minorTicksPerInterval: 5, minorGridLines: { visible: yVisiblity }, minorTickLines: { visible: false } };
           opt.primaryXAxis = options.primaryXAxis || { labelFormat: this._chartYAxisFormat(options.xRange), minorTicksPerInterval: 5, minorGridLines: { visible: xVisiblity }, minorTickLines: { visible: false }, labelIntersectAction: 'wrapByWord'};
           opt.primaryXAxis.valueType = "category";
            return opt;
        },

         _chartYAxisFormat: function (range) {
           if (ej.isNullOrUndefined(range))
                return;
             var xlObj = this.XLObj, type, currencySymbol = ej.globalize.preferredCulture().numberFormat.currency.symbol;
             type = xlObj.XLEdit.getPropertyValue(range[0], range[1], "type");
           if (type === "accounting")
               return currencySymbol + " {value}";
           else if(type === "currency")
               return currencySymbol + "{value}";
           else if (type === "percentage")
               return "{value}%";
           else 
               return "{value}";
       },

        _processChartRange: function (range, dataSheetIdx, opt) {
            var xlObj = this.XLObj, xRange, yRange, lRange, trVal, blVal, tlVal, minr = range[0], minc = range[1], isStringSeries = false,
                maxr = range[2], maxc = range[3], isSingleRow = minr === maxr, isSingleCol = minc === maxc;           
            trVal = xlObj.XLEdit.getPropertyValue(minr, maxc, "value2", dataSheetIdx);
            trVal = xlObj.XLEdit._parseValue(trVal).value;
            blVal = xlObj.XLEdit.getPropertyValue(maxr, minc, "value2", dataSheetIdx);
            blVal = xlObj.XLEdit._parseValue(blVal).value;
            tlVal = xlObj.XLEdit.getPropertyValue(minr, minc, "value2", dataSheetIdx);
            tlVal = xlObj.XLEdit._parseValue(tlVal).value;
			if(!xlObj.isNumber(blVal) || !tlVal)
				isStringSeries = true;
            if (xlObj.isUndefined(tlVal) && !isSingleRow && !isSingleCol || (opt.type == "scatter" && range[3] - range[1] == 1)) {
                xRange = [minr + 1, minc, maxr, minc];
                yRange = [minr + 1, minc + 1, maxr, maxc];
                lRange = [minr, minc + 1, minr, maxc];
            }
            else if ((!ej.isNullOrUndefined(blVal) && isStringSeries && !isSingleRow && !isSingleCol)) {
                if (!ej.isNullOrUndefined(trVal) && (!xlObj.isNumber(trVal) || !tlVal)) {
                    xRange = [minr + 1, minc, maxr, minc];
                    yRange = [minr + 1, minc + 1, maxr, maxc];
                    lRange = [minr, minc + 1, minr, maxc];
                }
                else {
                    xRange = [minr, minc, maxr, minc];
                    yRange = [minr, minc + 1, maxr, maxc];
                }
            }
            else {
                yRange = [minr, minc, maxr, maxc];
                if ((!ej.isNullOrUndefined(trVal) && !xlObj.isNumber(trVal) && !xlObj._isDateTime(trVal))) {
                    lRange = [minr, minc, minr, maxc];
                    yRange[0] = yRange[0] + 1;
                }
                else if (ej.isNullOrUndefined(tlVal) && (isSingleRow || isSingleCol)) {
                    lRange = [minr, minc, minr, maxc];
                    if (isSingleRow) {
                        yRange[1] = yRange[1] + 1;
                        lRange[3] = lRange[1];
                    }
                    else
                        yRange[0] = yRange[0] + 1;
                }
            }
            return { xRange: xRange, yRange: yRange, lRange: lRange };
        },

        _processChartSeries: function (options) {
            options = options || {};
            var xlObj = this.XLObj, val, len, xRange = options.xRange, yRange = options.yRange, lRange = options.lRange, xValue, yValue,
                lValue, diff, rDiff, cDiff, pArr, pObj, j, inc, i = 0, yInc = 0, sArr = [], tArr = ["value2"], dtVal;
            if(options.isChartSeries)
                sArr = this._processSeriesValues(options).series;
            else {
                yValue = xlObj.getRangeData({ range: yRange, valueOnly: true, sheetIdx: options.dataSheetIdx, skipFormula: true });
                rDiff = (yRange[2] - yRange[0]) + 1;
                cDiff = (yRange[3] - yRange[1]) + 1;
                if (options.isRowColSwitched) {
                    xValue = lRange ? xlObj._toArrayData(xlObj.getRangeData({ range: lRange, property: tArr, sheetIdx: options.dataSheetIdx })) : this._getVirtualXValues(cDiff + 1);
                    if (xRange)
                        lValue = xlObj._toArrayData(xlObj.getRangeData({ range: xRange, property: tArr, sheetIdx: options.dataSheetIdx }));
                    diff = rDiff;
                }
                else {
                    xValue = xRange ? xlObj._toArrayData(xlObj.getRangeData({ range: xRange, property: tArr, sheetIdx: options.dataSheetIdx })) : this._getVirtualXValues(rDiff + 1);
                    if (lRange)
                        lValue = xlObj._toArrayData(xlObj.getRangeData({ range: lRange, property: tArr, sheetIdx: options.dataSheetIdx }));
                    diff = cDiff;
                }
                len = xValue.length;
                inc = options.isRowColSwitched ? 1 : diff;
                while (i < diff) {
                    j = 0;
                    pArr = [];
                    yInc = options.isRowColSwitched ? yInc : i;
                    while (j < len) {
                        val = yValue[yInc];
						if(xlObj.isNumber(val))
							val = Number(val);
						else {
							dtVal = xlObj._dateToInt(val);
							val = isNaN(dtVal) ? 0: dtVal;
						}
                        pArr.push({ x: xValue[j], y: val }); // Number(val) - numbers returned as string while import  
                        yInc += inc;
                        j++;
                    }
                    pObj = { points: pArr };
                    if (options.type === "doughnut") {
                        pObj.explode = options.explode;
                        pObj.enableAnimation = options.enableAnimation;
                    }
                    if (lValue)
                        pObj.name = lValue[i];
                    sArr.push(pObj);
                    i++;
                }
            }
            return { series: sArr, xRange: options.isChartSeries ? null : options.isRowColSwitched ? lRange : xRange, yRange: options.isChartSeries ? null : yRange, lRange: options.isChartSeries ? null : options.isRowColSwitched ? xRange : lRange };
        },
          _processSeriesValues: function (options) {
            var i, h, k, n, l, plen, points, xrange, xValues, yrange, yValues, lrange, lValues, pArr, xlObj = this.XLObj, chartrange = options.seriesRange, len = chartrange.length, sArr = [], chartProp = [], pObj = {}, yVal, dtVal;
            for (i = 0; i < len; i++) {
                chartProp[i] = { xValues: [], yValues: [], lValues: [] };
                xrange = chartrange[i].xRange;
                if (!ej.isNullOrUndefined(xrange)) {
                    xValues = this._processRangeValues(xrange, options.dataSheetIdx);
                    for (var p = 0; p < xValues.length; p++) {
						if(xValues[p] instanceof Date)
						   xValues[p] = xValues[p].toLocaleDateString(ej.cultureObject.name);
                        chartProp[i].xValues[p] = xValues[p];
					}
                } else {
                    plen = !ej.isNullOrUndefined(chartrange[i].points) ? chartrange[i].points.length : options.series[i].points.length;
                    points = !ej.isNullOrUndefined(chartrange[i].points) ? chartrange[i].points : options.series[i].points;
                    for (l = 0; l < plen; l++) {
                        chartProp[i].xValues[l] = points[l].x;
                    }
                }
                yrange = chartrange[i].yRange;
                if (!ej.isNullOrUndefined(yrange)) {
                    yValues = this._processRangeValues(yrange, options.dataSheetIdx);
                    for (var s = 0; s < yValues.length; s++){
						yVal = yValues[s];
						if(xlObj.isNumber(yVal))
							yVal = Number(yVal);
						else {
							dtVal = xlObj._dateToInt(yVal);
							yVal = isNaN(dtVal) ? 0: dtVal;
						}
                        chartProp[i].yValues[s] = yVal;
					}
                } else {
                    plen = !ej.isNullOrUndefined(chartrange[i].points) ? chartrange[i].points.length : options.series[i].points.length;
                    points = !ej.isNullOrUndefined(chartrange[i].points) ? chartrange[i].points : options.series[i].points;
                    for (n = 0; n < plen; n++) {
                        chartProp[i].yValues[n] = points[n].y;
                    }
                }
                lrange = chartrange[i].lRange;
                if (!ej.isNullOrUndefined(lrange)) {
                    lValues = this._processRangeValues(lrange, options.dataSheetIdx);
                    for (var r = 0; r < lValues.length; r++){
						if(lValues[r] instanceof Date)
						   lValues[r] = lValues[r].toLocaleDateString(ej.cultureObject.name);
                        chartProp[i].lValues[r] = lValues[r];
					}
                }
                else
                    chartProp[i].lValues[0] = !ej.isNullOrUndefined(chartrange[i].name) ? chartrange[i].name : options.series[i].name;
            }
            m = 0;
            while (m < len) {
                k = 0;
                pArr = [];
                while (k < chartProp[m].xValues.length) {
                    pArr.push({ x: chartProp[m].xValues[k], y: xlObj.isNumber(chartProp[m].yValues[k]) ? Number(chartProp[m].yValues[k]) : 0 });
                    k++;
                }
                pObj = { points: pArr };
                h = 0;
                while (h < chartProp[m].lValues.length) {
                    pObj.name = chartProp[m].lValues[h];
                    h++;
                }
                sArr.push(pObj);
                m++;
            }
            return { series: sArr };
        },

        _processRangeValues: function (range, dataSheetIdx) {
            var xlObj = this.XLObj, values, ranges, value;
            if (range.indexOf(":") >= 0)
                values = xlObj.getRangeData({ range: range, property: ["value"], sheetIdx: dataSheetIdx, valueOnly: true, skipFormula: true });
            else if (range.indexOf(",") >= 0) {
                ranges = range.split(",");
                values = [];
                for (var x = 0; x < ranges.length; x++) {
                    value = xlObj.getRangeData({ range: ranges[x], property: ["value"], sheetIdx: dataSheetIdx, valueOnly: true, skipFormula: true });
                    values.push(value);
                }
            }
            else
                values = xlObj.getRangeData({ range: range, property: ["value"], sheetIdx: dataSheetIdx, valueOnly: true, skipFormula: true });
            return values;
        },
     
        _getVirtualXValues: function (limit) {
            var i = 1, arr = [];
            while (i < limit) {
                arr.push(i.toString());
                i++;
            }
            return arr;
        },

        _focusChartRange: function (xRange, yRange, lRange) {
            var xlObj = this.XLObj, border = xlObj._chartBorder;
            this._clearChartRange(xlObj._arrayAsString(border));
            if (lRange)
                xlObj.XLSelection._focusBorder({ rowIndex: lRange[0], colIndex: lRange[1] }, { rowIndex: lRange[2], colIndex: lRange[3] }, border[0]);
            if (xRange)
                xlObj.XLSelection._focusBorder({ rowIndex: xRange[0], colIndex: xRange[1] }, { rowIndex: xRange[2], colIndex: xRange[3] }, border[1]);
            xlObj.XLSelection._focusBorder({ rowIndex: yRange[0], colIndex: yRange[1] }, { rowIndex: yRange[2], colIndex: yRange[3] }, border[2]);
            xlObj.getSheet(xlObj.getActiveSheetIndex())._isChartBorderDrawn = true;
        },

        _clearChartRange: function (classes) {
            var xlObj = this.XLObj;
            xlObj.XLSelection._clearBorder(classes);
            xlObj.getSheet(xlObj.getActiveSheetIndex())._isChartBorderDrawn = false;
        },

        _renderBaseElem: function (type, top, left, cnt) {
            cnt = ej.isNullOrUndefined(cnt) ? this._shapeCnt : cnt;
            var xlObj = this.XLObj, div = $("<div id='" + xlObj._id + "_" + type + cnt + "' class='e-ss-object' style='top:" + top + "px;left:" + left + "px; min-height:180px; min-width:180px' ></div>");
            div.data("parentID", xlObj._id);
            xlObj._getContent(xlObj.getActiveSheetIndex()).find(".e-content").first().append(div);
            xlObj.XLShape._selectImg(div);
            if (!xlObj._isUndoRedo)
                this._shapeCnt++;
            return div;
        },

        _refreshChartElements: function (rowIdx, colIdx, sheetIdx) { // if rowIdx not passed then whole column consider and viceversa for colIdx
            var charts, i, chartProp, xlObj = this.XLObj, j = 1, cnt = xlObj.model.sheetCount + 1;
            while (j < cnt) {
                charts = xlObj.getSheet(j).shapeMngr.chart;
                i = xlObj.getObjectLength(charts);
                if (i) {
                    while (i--) {
                        chartProp = charts[xlObj.getObjectKeys(charts)[i]];
                        if (chartProp.dataSheetIdx === sheetIdx && (this.XLObj.inRange(chartProp.range, rowIdx, colIdx) || this.XLObj._inRow(chartProp.range, rowIdx) || this.XLObj._inColumn(chartProp.range, colIdx) || this.XLObj.XLChart._isSeriesRange(chartProp, rowIdx, colIdx)))
                            this._refreshChart(chartProp);
                    }
                }
                j++;
            }
        },
        _isSeriesRange: function (chartProp, rowIdx, colIdx) {
            var xrange, yrange, lrange, seriesRange, isSeriesRange, isSeries, isXRange, isYRange, isZRange;
            if (chartProp.seriesRange) {
                for (var k = 0; k < chartProp.seriesRange.length; k++) {
                    seriesRange = chartProp.seriesRange[k];
                    if (seriesRange.xRange)
                        isXRange = this._isChartSeriesRange(seriesRange.xRange, rowIdx, colIdx);
                    if (seriesRange.yRange)
                        isYRange = this._isChartSeriesRange(seriesRange.yRange, rowIdx, colIdx);
                    if (seriesRange.lRange)
                        isZRange = this._isChartSeriesRange(seriesRange.lRange, rowIdx, colIdx);
                    isSeriesRange = isXRange || isYRange || isZRange;
                    if (isSeriesRange)
                        return isSeriesRange;
                }
            }
            return false;
        },
        
        _isChartSeriesRange: function (seriesRange, rowIdx, colIdx) {
            var xlObj = this.XLObj, range, ranges, splitRange;
            if (seriesRange.indexOf(":") >= 0) {
                range = xlObj._getRangeArgs(seriesRange);
                if (xlObj.inRange(range, rowIdx, colIdx))
                    return true;
            }
            else if (seriesRange.indexOf(",") >= 0) {
                ranges = seriesRange.split(",");
                for (var x = 0; x < ranges.length; x++) {
                    splitRange = xlObj._getRangeArgs(ranges[x]);
                    if (xlObj.inRange(splitRange, rowIdx, colIdx))
                        return true;
                }
            }
            else {
                range = xlObj._getRangeArgs(seriesRange);
                if (xlObj.inRange(range, rowIdx, colIdx))
                    return true;
            }
            return false;
        },
        _refreshChart: function (chartProp) {
			if($("#" + chartProp.id).length !== 0){
				var xlObj = this.XLObj, formulaBar, cObj = $("#" + chartProp.id).data("ejChart"), obj = { xRange: chartProp.xRange, yRange: chartProp.yRange, lRange: chartProp.lRange, isRowColSwitched: chartProp.isRowColSwitched, dataSheetIdx: chartProp.dataSheetIdx, seriesRange: chartProp.seriesRange, isChartSeries: chartProp.isChartSeries, series: chartProp.series }, cOptions;
				cObj.model.series.length = 0;
				cOptions = this._processChartSeries(obj);
				if (xlObj.model.allowFormulaBar)
					formulaBar = xlObj.element.find('.e-formulabar')[0];
				formulaBar && (formulaBar.style.display = "none");
				cObj.model.primaryXAxis.range.min = cObj.model.primaryXAxis.range.max = cObj.model.primaryXAxis.range.interval = null;
				cObj.model.primaryYAxis.range.min = cObj.model.primaryYAxis.range.max = cObj.model.primaryYAxis.range.interval = null;
				cObj.option({ series: cOptions.series, primaryXAxis: { labelFormat: this._chartYAxisFormat(chartProp.xRange) }, primaryYAxis: { labelFormat: this._chartYAxisFormat(chartProp.yRange) } });
			    cObj.model.primaryXAxis.range = cObj.model.primaryXAxis.actualRange;
			    cObj.model.primaryYAxis.range = cObj.model.primaryYAxis.actualRange;
				formulaBar && (formulaBar.style.display = "block");
			}
        },

        switchRowColumn: function (chartId) {
			var xlObj = this.XLObj;
            if (xlObj.model.isReadOnly)
                return;
            var chOptions, obj, cid = chartId || document.getElementById(xlObj._id + "_chart").value, cObj = $("#" + cid).ejChart("instance"), dataVal = xlObj.XLChart._getShapeObj(cid, "chart"), details = { sheetIndex: xlObj.getActiveSheetIndex(), reqType: "shape", shapeType: "chart", action: "srcolumn", cid: cid, rowIndex: xlObj.XLShape._picCellIdx.rowIndex, colIndex: xlObj.XLShape._picCellIdx.colIndex };
            if(dataVal.isChartSeries)
				return;
			cObj.model.series.length = 0;
            dataVal.isRowColSwitched = !dataVal.isRowColSwitched;
            obj = { xRange: dataVal.xRange, yRange: dataVal.yRange, lRange: dataVal.lRange, isRowColSwitched: dataVal.isRowColSwitched, dataSheetIdx: dataVal.dataSheetIdx };
            chOptions = xlObj.XLChart._processChartSeries(obj);
            cObj.option({ series: chOptions.series });
            xlObj.getActiveSheetIndex() === dataVal.dataSheetIdx && xlObj.XLChart._focusChartRange(chOptions.xRange, chOptions.yRange, chOptions.lRange);
            dataVal.xAxis.range = chOptions.xRange;
            dataVal.yAxis.range = chOptions.yRange;
            dataVal.legend.range = chOptions.lRange;
            xlObj._completeAction(details);
            xlObj._trigActionComplete(details);
        },

        updateChartElement: function (chartId, value, title) {
            var xlObj = this.XLObj;
            if (xlObj.model.isReadOnly)
                return;
            xlObj._showDialog(xlObj._id + "_chartname");
            var formulaBar, cid = chartId || document.getElementById(xlObj._id + "_chart").value, args, series, cObj = $("#" + cid).ejChart("instance"), sheetIdx = xlObj.getActiveSheetIndex(), i,
            details = { sheetIndex: sheetIdx, reqType: "shape", shapeType: "chart", cid: cid, rowIndex: xlObj.XLShape._picCellIdx.rowIndex, colIndex: xlObj.XLShape._picCellIdx.colIndex }, dataVal = xlObj.getSheet(sheetIdx).shapeMngr.chart[xlObj.XLEdit.getPropertyValue(xlObj.XLShape._picCellIdx.rowIndex, xlObj.XLShape._picCellIdx.colIndex, 'chart')[0]];
            title ? (args = { model: { text: xlObj._getLocStr('Ok') } }) : (title = "");
            if (xlObj.model.allowFormulaBar)
				formulaBar = xlObj.element.find('.e-formulabar')[0];
			formulaBar && (formulaBar.style.display = "none");
			switch (value) {
                case "PHAxis":
                    details.visibility = !(cObj.model.primaryXAxis.visible);
                    cObj.option("primaryXAxis", { visible: details.visibility });
                    dataVal.xAxis.visible = details.visibility;
                    details.action = details.operation = value;
                    break;
                case "PVAxis":
                    details.visibility = !(cObj.model.primaryYAxis.visible);
                    cObj.option("primaryYAxis", { visible: details.visibility });
                    dataVal.yAxis.visible = details.visibility;
                    details.action = details.operation = value;
                    break;
                case "PHAxisTitle":
                    xlObj._cOpt.prev = { text: dataVal.xAxis.title.text };
                    if (cObj.model.primaryXAxis.title.text.length != 0) {
                        cObj.option("primaryXAxis", { title: { text: "" } });
                        dataVal.xAxis.title.text = "";
                        details = { sheetIndex: sheetIdx, reqType: "shape", shapeType: "chart", operation: "PHAxisTitle", action: "PX", cid: cid, rowIndex: xlObj.XLShape._picCellIdx.rowIndex, colIndex: xlObj.XLShape._picCellIdx.colIndex, prev: { text: xlObj._cOpt.prev.text }, cur: { text: "" } };
                        xlObj._completeAction(details);
                        xlObj._trigActionComplete(details);
                    }
                    else {
                        xlObj._hasTitle = "PX";
                        document.getElementById(xlObj._id + '_chartname').value = dataVal.xAxis.title.text;
                        if (title.length < 1) {
                            $('#' + xlObj._id + '_chartnamedlg').ejDialog("open");
                            $("#" + xlObj._id + '_chartname').focus().setInputPos(dataVal.xAxis.title.text.length);
                        }
                        else
                            xlObj.XLRibbon._chartNameDlgBtnClick(args, title, "PHAxisTitle");
                        xlObj._cOpt = { prevText: dataVal.title.text, prevAlign: cObj.model.title.textAlignment, curAlign: cObj.model.title.textAlignment };
                    }
                    break;
                case "PVAxisTitle":
                    xlObj._cOpt.prev = { text: dataVal.yAxis.title.text };
                    if (cObj.model.primaryYAxis.title.text.length != 0) {
                        cObj.option("primaryYAxis", { title: { text: "" } });
                        dataVal.yAxis.title.text = "";
                        details = { sheetIndex: sheetIdx, reqType: "shape", shapeType: "chart", operation: "PVAxisTitle", action: "PY", cid: cid, rowIndex: xlObj.XLShape._picCellIdx.rowIndex, colIndex: xlObj.XLShape._picCellIdx.colIndex, prev: { text: xlObj._cOpt.prev.text }, cur: { text: "" } };
                        xlObj._completeAction(details);
                        xlObj._trigActionComplete(details);
                    }
                    else {
                        xlObj._hasTitle = "PY";
                        document.getElementById(xlObj._id + '_chartname').value = dataVal.yAxis.title.text;
                        if (title.length < 1) {
                            $('#' + xlObj._id + '_chartnamedlg').ejDialog("open");
                            $("#" + xlObj._id + '_chartname').focus().setInputPos(dataVal.yAxis.title.text.length);
                        }
                        else
                            xlObj.XLRibbon._chartNameDlgBtnClick(args, title, "PVAxisTitle");
                        xlObj._cOpt = { prevText: dataVal.title.text, prevAlign: cObj.model.title.textAlignment, curAlign: cObj.model.title.textAlignment };
                    }
                    break;
			    case "CTNone":
                case "CTnone":
                    xlObj._cOpt.prev = { text: dataVal.title.text };
                    if (cObj.model.title.text.length) {
                        cObj.option("title", { text: "" });
                        dataVal.title.text = "";
                        details = { sheetIndex: sheetIdx, reqType: "shape", shapeType: "chart", action: "CT", operation: "CTNone", cid: cid, rowIndex: xlObj.XLShape._picCellIdx.rowIndex, colIndex: xlObj.XLShape._picCellIdx.colIndex, prev: { text: xlObj._cOpt.prev.text }, cur: { text: "" } };
                        xlObj._completeAction(details);
                        xlObj._trigActionComplete(details);
                    }
                    break;
			    case "CTCenter":
			    case "CTcenter":
                    xlObj._hasTitle = "CT";
                    xlObj._cOpt = { prevText: cObj.model.title.text, prevAlign: cObj.model.title.textAlignment };
                    document.getElementById(xlObj._id + '_chartname').value = dataVal.title.text;
                    if (title.length < 1) {
                        $('#' + xlObj._id + '_chartnamedlg').ejDialog("open");
                        $("#" + xlObj._id + '_chartname').focus().setInputPos(dataVal.title.text.length);
                    }
                    else
                        xlObj.XLRibbon._chartNameDlgBtnClick(args, title, "CTCenter");
                    cObj.option("title", { textAlignment: "center" });
                    xlObj._cOpt.curAlign = cObj.model.title.textAlignment;
                    dataVal.title.align = "center";
                    break;
			    case "CTFar":
			    case "CTfar":
                    xlObj._hasTitle = "CT";
                    xlObj._cOpt = { prevText: cObj.model.title.text, prevAlign: cObj.model.title.textAlignment };
                    document.getElementById(xlObj._id + '_chartname').value = dataVal.title.text;
                    if (title.length < 1) {
                        $('#' + xlObj._id + '_chartnamedlg').ejDialog("open");
                        $("#" + xlObj._id + '_chartname').focus().setInputPos(dataVal.title.text.length);
                    }
                    else
                        xlObj.XLRibbon._chartNameDlgBtnClick(args, title, "CTFar");
                    cObj.option("title", { textAlignment: "far" });
                    xlObj._cOpt.curAlign = cObj.model.title.textAlignment;
                    dataVal.title.align = "far";
                    break;
			    case "CTNear":
			    case "CTnear":
                    xlObj._hasTitle = "CT";
                    xlObj._cOpt = { prevText: cObj.model.title.text, prevAlign: cObj.model.title.textAlignment };
                    document.getElementById(xlObj._id + '_chartname').value = dataVal.title.text;
                    if (title.length < 1) {
                        $('#' + xlObj._id + '_chartnamedlg').ejDialog("open");
                        $("#" + xlObj._id + '_chartname').focus().setInputPos(dataVal.title.text.length);
                    }
                    else
                        xlObj.XLRibbon._chartNameDlgBtnClick(args, title, "CTNear");
                    cObj.option("title", { textAlignment: "near" });
                    xlObj._cOpt.curAlign = cObj.model.title.textAlignment;
                    dataVal.title.align = "near";
                    break;
                case "DLNone":
                    series = [];
                    details.action = "DL";
                    details.operation = "DLNone";
                    details.prev = { series: $.extend(true, [], cObj.model.series) };
                    for (i = 0; i < cObj.model.series.length; i++)
                        series.push({ marker: { dataLabel: { visible: false, verticalTextAlignment: "far", textPosition: "top" } } });
                    cObj.option({ series: series });
                    details.cur = { series: $.extend(true, [], cObj.model.series) };
                    dataVal.dataLabel = { visible: false };
                    dataVal.series = cObj.model.series;
                    break;
                case "DLCenter":
                    series = [];
                    details.action = "DL";
                    details.operation = "DLCenter";
                    details.prev = { series: $.extend(true, [], cObj.model.series) };
                    for (i = 0; i < cObj.model.series.length; i++)
                        series.push({ marker: { dataLabel: { visible: true, verticalTextAlignment: "center", textPosition: "middle", offset: { y: 0 } } } });
                    cObj.option({ series: series });
                    details.cur = { series: $.extend(true, [], cObj.model.series) };
                    dataVal.dataLabel = { visible: true, vAlign: "center", tPosn: "middle" }; 
                    dataVal.series = cObj.model.series;
                    break;
                case "DLIBase":
                    series = [];
                    details.action = "DL";
                    details.operation = "DLIBase";
                    details.prev = { series: $.extend(true, [], cObj.model.series) };
                    for (i = 0; i < cObj.model.series.length; i++)
                        series.push({ marker: { dataLabel: { visible: true, verticalTextAlignment: "far", textPosition: "bottom", offset: { y: 0 } } } });
                    cObj.option({ series: series });
                    details.cur = { series: $.extend(true, [], cObj.model.series) };
                    dataVal.dataLabel = { visible: true, vAlign: "far", tPosn: "bottom" };
                    dataVal.series = cObj.model.series;
                    break;
                case "DLIEnd":
                    series = [];
                    details.action = "DL";
                    details.operation = "DLIEnd";
                    details.prev = { series: $.extend(true, [], cObj.model.series) };
                    for (i = 0; i < cObj.model.series.length; i++)
                        series.push({ marker: { dataLabel: { visible: true, verticalTextAlignment: "near", textPosition: "top", offset: { y: -10 } } } });
                    cObj.option({ series: series });
                    details.cur = { series: $.extend(true, [], cObj.model.series) };
                    dataVal.dataLabel = { visible: true, vAlign: "near", tPosn: "top" };
                    dataVal.series = cObj.model.series;
                    break;
                case "DLOEnd":
                    series = [];
                    details.action = "DL";
                    details.operation = "DLOEnd";
                    details.prev = { series: $.extend(true, [], cObj.model.series) };
                    for (i = 0; i < cObj.model.series.length; i++)
                        series.push({ marker: { dataLabel: { visible: true, verticalTextAlignment: "near", textPosition: "top", offset: { y: 0 } } } });
                    cObj.option({ series: series });
                    details.cur = { series: $.extend(true, [], cObj.model.series) };
                    dataVal.dataLabel = { visible: true, vAlign: "near", tPosn: "top" };
                    dataVal.series = cObj.model.series;
                    break;
                case "PMajorH":
                    details.visibility = !(cObj.model.primaryYAxis.majorGridLines.visible);
                    cObj.option("primaryYAxis", { majorGridLines: { visible: details.visibility } });
                    dataVal.yAxis.majorGridLines = { visible: details.visibility };
                    details.action = details.operation = value;
                    break;
                case "PMajorV":
                    details.visibility = !(cObj.model.primaryXAxis.majorGridLines.visible);
                    cObj.option("primaryXAxis", { majorGridLines: { visible: details.visibility } });
                    dataVal.xAxis.majorGridLines = { visible: details.visibility };
                    details.action = details.operation = value;
                    break;
                case "PMinorH":
                    details.visibility = !(cObj.model.primaryYAxis.minorGridLines.visible);
                    cObj.option("primaryYAxis", { minorGridLines: { visible: details.visibility }, minorTicksPerInterval: 5, minorTickLines: { visible: details.visibility } });
                    dataVal.yAxis.minorGridLines = { visible: details.visibility };
                    details.action = details.operation = value;
                    break;
                case "PMinorV":
                    details.visibility = !(cObj.model.primaryXAxis.minorGridLines.visible);
                    cObj.option("primaryXAxis", { minorGridLines: { visible: details.visibility }, minorTicksPerInterval: 5, minorTickLines: { visible: details.visibility } });
                    dataVal.xAxis.minorGridLines = { visible: details.visibility };
                    details.action = details.operation = value;
                    break;
                case "LNone":
                    details.visibility = false;
                    cObj.option("legend", { visible: details.visibility });
                    dataVal.legend.visible = details.visibility;
                    details.action = value;
                    details.operation = "LNone";
                    break;
                case "LLeft":
                    details.prev = { position: cObj.model.legend.position };
                    cObj.option("legend", { position: "left", visible: true });
                    dataVal.legend.position = "left";
                    details.cur = { position: cObj.model.legend.position };
                    details.action = "Legend";
                    details.operation = "LLeft";
                    break;
                case "LRight":
                    details.prev = { position: cObj.model.legend.position };
                    cObj.option("legend", { position: "right", visible: true });
                    dataVal.legend.position = "right";
                    details.cur = { position: cObj.model.legend.position };
                    details.action = "Legend";
                    details.operation = "LRight";
                    break;
                case "LBottom":
                    details.prev = { position: cObj.model.legend.position };
                    cObj.option("legend", { position: "bottom", visible: true });
                    dataVal.legend.position = "bottom";
                    details.cur = { position: cObj.model.legend.position };
                    details.action = "Legend";
                    details.operation = "LBottom";
                    break;
                case "LTop":
                    details.prev = { position: cObj.model.legend.position };
                    cObj.option("legend", { position: "top" });
                    dataVal.legend.position = "top";
                    details.cur = { position: cObj.model.legend.position };
                    details.action = "Legend";
                    details.operation = "LTop";
                    break;
            }
			formulaBar && (formulaBar.style.display = "block");
            if (!ej.isNullOrUndefined(details.action)) {
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
        },

        changeTheme: function (chartId, theme) {
            var xlObj = this.XLObj, chartId = chartId || xlObj.element.find("#" + xlObj._id + "_chart").val(), details;
            details = { sheetIndex: xlObj.getActiveSheetIndex(), reqType: "shape", action: "chartTheme", chartId: chartId };
            details.prev = { theme: $("#" + chartId).data("ejChart").model.theme };
            theme && (theme.indexOf("dark") > -1) ? ($("#" + chartId).addClass('e-ss-charttheme')) : ($("#" + chartId).removeClass('e-ss-charttheme'));
            xlObj.XLChart.refreshChart(chartId, { theme: theme });
            details.cur = { theme: theme };
            xlObj._completeAction(details);
            xlObj._trigActionComplete(details);
        },

        changeType: function (chartId, option) {
            var xlObj = this.XLObj, chartObj = $('#' + chartId).data('ejChart'), details = { sheetIndex: xlObj.getActiveSheetIndex(), reqType: "shape", shapeType: "chart", action: "chartType", chartId: chartId };
            details.prev = { chartType: chartObj.model.series[0].type, enable3D: chartObj.model.enable3D, marker: chartObj.model.series[0].marker.visible };
            xlObj.XLChart.refreshChart(chartId, option);
            details.cur = { chartType: chartObj.model.series[0].type, enable3D: chartObj.model.enable3D, marker: chartObj.model.series[0].marker.visible };
            $("#" + xlObj._id + "_charttypedlg").ejDialog("close");
            xlObj._completeAction(details);
            xlObj._trigActionComplete(details);
        },

        _getShapeObj: function (id, type) {
            var shape, xlObj = this.XLObj, shapeMngr = xlObj.getSheet(xlObj.getActiveSheetIndex()).shapeMngr[type], i = xlObj.getObjectLength(shapeMngr);
            if (i)
                 return shapeMngr[id];
        },

        _validateChartRange: function (range, xRange, yRange, lRange) {
            var xlObj = this.XLObj;
            if (!yRange)
                return { msg: xlObj._getLocStr("YAxisMissing") };
            if (!(xlObj.inRange(range, yRange[0], yRange[1]) || xlObj.inRange(range, yRange[2], yRange[3])))
                return { msg: xlObj._getLocStr("InvalidYAxis") };
            if (xRange) {
                if (!(xlObj.inRange(range, xRange[0], xRange[1]) || xlObj.inRange(range, range[2], range[3])))
                    return { msg: xlObj._getLocStr("InvalidXAxis") };
                else if (xRange[3] - xRange[1] !== 0)
                    return { msg: xlObj._getLocStr("InvalidXAxisColumns") };
            }
            if (lRange && !(xlObj.inRange(range, lRange[0], lRange[1]) || xlObj.inRange(range, lRange[2], lRange[3])))
                return { msg: xlObj._getLocStr("InvalidLegend") };
            return { status: true };
        },

        _renderChartRangeDialog: function () {
            var xlObj = this.XLObj, opt = { width: "25%", showRoundedCorner: true, click: $.proxy(this._chartRangeDlgBtnClick, this) }, htmlElem = $("<div id='" + xlObj._id + "_chartrangedlg'><div class='e-dlgctndiv e-dlg-fields'><table cellpadding='0' cellspacing='0'><tr class='e-dlgtd-fields'><td>" + xlObj._getLocStr("XAxisRange") + "</td><td><input type='text' class='ejinputtext' id='" + xlObj._id + "_crxaxis'/></td></tr><tr class='e-dlgtd-fields'><td>" + xlObj._getLocStr("YAxisRange") + "</td><td><input type='text' class='ejinputtext' id='" + xlObj._id + "_cryaxis' /></td></tr><tr class='e-dlgtd-fields'><td>" + xlObj._getLocStr("LegendRange") + "</td><td><input type='text' class='ejinputtext' id='" + xlObj._id + "_crlaxis'/></td></tr></table></div><div class='e-dlg-btnfields' ><div class='e-dlg-btnctnr'><button id='" + xlObj._id + "_crok' >" + xlObj._getLocStr("Ok") + "</button><button id='" + xlObj._id + "_crcancel'>" + xlObj._getLocStr("Cancel") + "</button></div></div></div>");
            xlObj.element.append(htmlElem);
            htmlElem.ejDialog({
                width: 310,
                height: "auto",
                enableResize: false,
                showOnInit: false,
                enableModal: true,
                cssClass: "e-ss-dialog e-"+xlObj._id+"-dlg e-ss-chartrange",
                title: xlObj._getLocStr("ChartRange")
            });
            $("#" + xlObj._id + "_crok").ejButton(opt);
			$("#" + xlObj._id + "_crok").ejButton("option", "cssClass", "e-ss-okbtn");
            $("#" + xlObj._id + "_crcancel").ejButton(opt);
        },

        _chartRangeDlgBtnClick: function (args) {
            var cid, xRange, yRange, lRange, canDlgClose = true, xlObj = this.XLObj;
            if (args.model.text === xlObj._getLocStr("Ok")) {
                cid = document.getElementById(xlObj._id + "_chart").value;
                xRange = $("#" + xlObj._id + "_crxaxis").val();
                yRange = $("#" + xlObj._id + "_cryaxis").val();
                lRange = $("#" + xlObj._id + "_crlaxis").val();
                this.changeDataRange(cid, xRange, yRange, lRange);
            }
            if (canDlgClose)
                $("#" + xlObj._id + "_chartrangedlg").ejDialog("close");
            
        },

        changeDataRange: function (cid, xRange, yRange, lRange) {
            var resp, chartData, xlObj = this.XLObj, canDlgClose, xIdx, yIdx, lIdx, sheetIdx = xlObj._getSheetIndex(xlObj.getActiveSheetIndex()), sheet = xlObj.getSheet(sheetIdx), details, selectData;
            chartData = this._getShapeObj(cid, "chart");
            if (xRange.length)
                xIdx = xlObj.getRangeIndices(xRange);
            if (yRange.length)
                yIdx = xlObj.getRangeIndices(yRange);
            if (lRange.length)
                lIdx = xlObj.getRangeIndices(lRange);
            selectData = { xRange: xRange, yRange: yRange, lRange: lRange };
            resp = this._validateChartRange(chartData.range, xIdx, yIdx, lIdx);
            if (resp.status) {
                chartData.xRange = xIdx;
                chartData.yRange = yIdx;
                chartData.lRange = lIdx;
                this._refreshChart(chartData);
                var cModel = $("#" + cid).ejChart("model");
                chartData.xAxis = { min: cModel.primaryXAxis.range.min, max: cModel.primaryXAxis.range.max, interval: cModel.primaryXAxis.range.interval, title: { text: cModel.primaryXAxis.title.text.length ? cModel.primaryXAxis.title.text : "" }, range: xIdx };
                chartData.yAxis = { min: cModel.primaryYAxis.range.min, max: cModel.primaryYAxis.range.max, interval: cModel.primaryYAxis.range.interval, title: { text: cModel.primaryYAxis.title.text.length ? cModel.primaryYAxis.title.text : "" }, range: yIdx };
                chartData.legend = { visible: cModel.legend.visible, range: lIdx };
                if (xlObj.getActiveSheetIndex() === chartData.dataSheetIdx)
                    this._focusChartRange(xIdx, yIdx, lIdx);
            }
            else {
                canDlgClose = false;
                xlObj._showAlertDlg("Alert", "T-" + resp.msg, "", 400);
            }
            if ((!sheet._isImported || sheet._isLoaded) && !xlObj._isUndoRedo && !xlObj._isExport) {
                details = { sheetIndex: sheetIdx, reqType: "shape", shapeType: "chart", action: "selectData", id: cid, prev: xlObj._selectDataval, cur: selectData };
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
        },
		
		_afterChartRefresh: function() {
			var xlObj = this.XLObj, formulaBar, formulaWt, settings = xlObj.model.scrollSettings;
			if (xlObj.model.allowFormulaBar) {
			    formulaBar = xlObj.element.find('.e-formulabar')[0];
				formulaBar.style.display = "none";
				formulaBar.style.display = "";
            }
		}
    };
})(jQuery, Syncfusion);