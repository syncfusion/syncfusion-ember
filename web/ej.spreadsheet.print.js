/// <reference path="ej.spreadsheet.print.js" />
(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.print = function (obj) {
        this.XLObj = obj;
        this._printHeight = 950;
        this._pageHeight = 970;
        this._pageWidth = 750;
        this._marginTop = 30;
        this._marginBottom = 150;
        this._printRowLabels = false;
        this._isPrintSelection = false;
        this._stRow = 0;
        this._stColumn = 0;
        this.shpIndex = [];
        this.shpObj = [];
        this.shpPicObj = [];
    };
    ej.spreadsheetFeatures.print.prototype = {
        //Printing Feature
        _printSetting: function (value) {
            this.XLObj.model.pageSize = value;
            switch (value) {
                case ej.Spreadsheet.pageSize.A4:
                    this._printHeight = 950;
                    this._pageHeight = 970;
                    this._pageWidth = 750;
                    this._marginTop = 30;
                    this._marginBottom = 150;
                    break;
                case ej.Spreadsheet.pageSize.A3:
                    this._printHeight = 1350;
                    this._pageHeight = 1330;
                    this._pageWidth = 860;
                    this._marginTop = 30;
                    this._marginBottom = 150;
                    break;
                case ej.Spreadsheet.pageSize.Letter:
                    this._printHeight = 1040;
                    this._pageHeight = 920;
                    this._pageWidth = 860;
                    this._marginTop = 30;
                    this._marginBottom = 60;
                    break;
            }
        },

        printSelection: function () {
            var xlObj = this.XLObj;
            if (!xlObj.model.printSettings.allowPrinting || xlObj.model.isReadOnly)
                return;
            if (xlObj.model.printSettings.allowPageSize) {
                var j, len, rangeData, sheetIdx = xlObj.getActiveSheetIndex(), selectedCells = xlObj.getSheet(sheetIdx)._selectedCells, startCell = selectedCells[0], endCell = selectedCells[selectedCells.length - 1],
                    cellCount = endCell.colIndex - startCell.colIndex, selTable = ej.buildTag("table.e-table"), colgroup = ej.buildTag("colgroup"), col = xlObj._getContent(sheetIdx).find("col"), printDiv = ej.buildTag("div#printDiv.e-spreadsheet e-js", null, { border: "none" });
                xlObj._refreshTemplates(sheetIdx, true, startCell.colIndex, (startCell.colIndex + cellCount + 1));
                xlObj._isPrint = true;
                for (j = startCell.colIndex; j < endCell.colIndex; j++)
                    $(col[j].outerHTML).attr("id", "cc").appendTo(colgroup);
                rangeData = xlObj.getRangeData({ range: [startCell.rowIndex, startCell.colIndex, endCell.rowIndex, endCell.colIndex], property: ["value", "value2", "format", "border", "type", "isFilterHide", "isRHide", "isFHide", "isMHide", "merge", "hRow", "wrap", "overflow", "align", "hyperlink", "cFormatRule", "rule"], sheetIdx: sheetIdx, withRowIdx: true });
                selTable.html(xlObj._renderData(rangeData, sheetIdx, startCell.colIndex, cellCount + 1, true));
                colgroup.insertBefore(selTable.find('tbody'));
                this._stRow = startCell.rowIndex;
                this._stCol = startCell.colIndex;
                this._isPrintSelection = true;
                xlObj._isPrint = false;
                if (this._printRowLabels)
                    this._calculateTabCount(printDiv, sheetIdx, selTable);
                else
                    this._constructSheet(printDiv, sheetIdx, selTable, selTable[0].rows);
                xlObj._refreshTemplates(sheetIdx, true);
            }
            else {
                var i, links, link, stylesLink = [], selectedCells = xlObj.getSheet(sheetIdx)._selectedCells, startCell = selectedCells[0], endCell = selectedCells[selectedCells.length - 1], chartPicElem = xlObj.element.find(".e-ss-activeimg").clone();
                if (selectedCells.length)
                    this._flatPrint([startCell.rowIndex, startCell.colIndex, endCell.rowIndex, endCell.colIndex]);
                else if (chartPicElem.length) {
                    links = $("head").find("link").add("style");
                    for (i = 0, len = links.length; i < len; i++) {
                        link = links[i].href || "";
                        if ((links[i].tagName === "STYLE" && (links[i].id.indexOf(xlObj._id + "_sshide") > -1 || links[i].id.indexOf(xlObj._id + "_sscustomformat") > -1)) || link.indexOf("ej.pivotintegration.css") > -1 || link.indexOf("ej.widgets.core") > -1 || link.indexOf("ej.web.all") > -1 || link.indexOf("ej.theme") > -1) {
                            stylesLink.push(links[i]);
                        }
                    }
                    this.print(ej.buildTag("div#printDiv.e-spreadsheet e-js", chartPicElem.css({ top: 0, left: 0 }), { border: "none" }), stylesLink);
                }
            }
        },

        printSheet: function () {
            var xlObj = this.XLObj;
            if(!xlObj.model.printSettings.allowPrinting || xlObj.model.isReadOnly)
                return;
            if (xlObj.model.printSettings.allowPageSize) {
                var j, jLen, rangeData, printDiv = ej.buildTag("div#printDiv"), sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), colWtColl = sheet.columnsWidthCollection,
                    col = xlObj._getContent(sheetIdx).find("col"), selTable = ej.buildTag("table"), colgroup = ej.buildTag("colgroup");
                xlObj._refreshTemplates(sheetIdx, true, 0, sheet.usedRange.colIndex + 1);
                xlObj._isPrint = true;
                for (j = 0, jLen = colWtColl.length; j < jLen; j++)
                    $(col[j].outerHTML).attr("id", "cc").appendTo(colgroup);
                rangeData = xlObj.getRangeData({ range: [0, 0, sheet.usedRange.rowIndex, sheet.usedRange.colIndex], property: ["value", "value2", "format", "border", "type", "isFilterHide", "isRHide", "isFHide", "isMHide", "merge", "hRow", "wrap", "overflow", "align", "hyperlink", "cFormatRule", "rule"], sheetIdx: sheetIdx, withRowIdx: true });
                selTable.html(xlObj._renderData(rangeData, sheetIdx, 0, sheet.usedRange.colIndex + 1, true));
                colgroup.insertBefore(selTable.find('tbody'));
                if (this._printRowLabels)
                    this._calculateTabCount(printDiv, sheetIdx, selTable);
                else
                    this._constructSheet(printDiv, sheetIdx, selTable, selTable[0].rows);
                xlObj._isPrint = false;
                xlObj._refreshTemplates(sheetIdx, true);
            }
            else
                this._flatPrint();
        },

        _flatPrint: function (range) {
            var len, xlObj = this.XLObj, i, j, sIdx = 0, printCntElem, totWidth = 0, diffLeft, top, left, diffTop, rangeData, printDiv = ej.buildTag("div#printDiv.e-spreadsheet e-js", null, { border: "none" }), sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), colWtColl = sheet.columnsWidthCollection,
                jLen = sheet.usedRange.colIndex, col = xlObj._getContent(sheetIdx).find("col"), selTable = ej.buildTag("table.e-table"), colgroup = ej.buildTag("colgroup"), links = $("head").find("link").add("style"), stylesLink = [], chartPicElems = xlObj.element.find(".e-ss-object, .e-ss-pivot").clone(), link, inlineStyle = "", hRowCol = sheet.hideRowsCollection;
            xlObj._refreshTemplates(sheetIdx, true, 0, sheet.usedRange.colIndex + 1);
            xlObj._isPrint = true;
            if (range) { //for print selection
                sIdx = range[1];
                jLen = range[3];
            }
            for (j = sIdx; j <= jLen; j++) {
                $(col[j].outerHTML).attr("id", "cc").appendTo(colgroup);
                totWidth += colWtColl[j];
                if (colWtColl[j] === 0)
                    inlineStyle += "td.e-rowcell:nth-of-type(" + (j + 1) + "){display: none}";
            }
            printDiv.width(totWidth);
            rangeData = xlObj.getRangeData({ range: range ? range : [0, 0, sheet.usedRange.rowIndex, sheet.usedRange.colIndex], property: ["value", "value2", "format", "border", "type", "isFilterHide", "isRHide", "isFHide", "isMHide", "merge", "hRow", "wrap", "overflow", "align", "hyperlink", "cFormatRule", "rule", "isOverflow", "isOfBrdr"], sheetIdx: sheetIdx, withRowIdx: true });
            selTable.append(colgroup, xlObj._renderData(rangeData, sheetIdx, range ? range[1] : 0, (range ? range[3] - range[1] : sheet.usedRange.colIndex) + 1, true));
            selTable.width(totWidth);
            range && selTable.find('td[class=""]').remove(); //remove unwanted td in print selection
            for (j = 0; j < hRowCol.length; j++) { //hide row update
                if (range && !xlObj.inRange(range, j, range[1]))
                    continue;
                selTable.find("tr:eq(" + hRowCol[j] + ")").addClass("e-r-hide");
            }
            if (range) {
                printDiv.css({ overflow: "hidden" }); //Chart picture position update
                diffLeft = sheet._colWidthCollection[range[1]], diffTop = sheet._rowHeightCollection[range[0]];
                for (j = 0; j < chartPicElems.length; j++) {
                    top = parseInt(chartPicElems[j].style.top), left = parseInt(chartPicElems[j].style.left);
                    $(chartPicElems[j]).css({ top: (top - diffTop), left: (left - diffLeft) });
                }
            }
            printCntElem = ej.buildTag("div.e-content e-ss-cursor", selTable);
            printCntElem.append(chartPicElems);
            printCntElem = ej.buildTag("div.e-spreadsheetcontentcontainer", printCntElem);
            printCntElem = ej.buildTag("div.e-spreadsheetmainpanel", printCntElem, { width: totWidth, float: "none" });
            inlineStyle += ".e-spreadsheet .e-spreadsheetmainpanel .e-content .e-table tr td:first-child{ border-left-width: 1px; }.e-spreadsheet .e-spreadsheetmainpanel .e-content .e-table tr:first-child td{border-top-width: 1px;}table{page-break-inside: auto !important;}table tr{page-break-inside: avoid !important;}html,body{margin: 0; padding: 0; }";
            printDiv.append(printCntElem, ej.buildTag("style", inlineStyle, {}, { type: 'text/css' }));
            for (i = 0, len = links.length; i < len; i++) {
                link = links[i].href || "";
                if ((links[i].tagName === "STYLE" && (links[i].id.indexOf(xlObj._id + "_sshide") > -1 || links[i].id.indexOf(xlObj._id + "_sscustomformat") > -1)) || link.indexOf("ej.pivotintegration.css") > -1 || link.indexOf("ej.widgets.core") > -1 || link.indexOf("ej.web.all") > -1 || link.indexOf("ej.theme") > -1) {
                    stylesLink.push(links[i]);
                }
            }
            this.print(printDiv, stylesLink);
            xlObj._isPrint = false;
            xlObj._refreshTemplates(sheetIdx, true);
        },

        _calculateTabCount: function (printDiv, sheetIdx, table) {
            var xlObj = this.XLObj, cColl = [], tCount = 0, actualWidth = 0, colWtColl = xlObj.getSheet(xlObj.getActiveSheetIndex()).columnsWidthCollection;
            for (var i = 0, len = colWtColl.length; i < len; i++) {
                actualWidth += colWtColl[i];
                if (actualWidth >= this._pageWidth) {
                    cColl.push({ tCount: tCount + 1, cellCount: i });
                    actualWidth = 0;
                }
            }
        },

        _calculateCellRowCount: function (rows, startCell, startRow) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), colWtColl = sheet.columnsWidthCollection, rowHtColl = sheet.rowsHeightCollection, extra, actualWidth = 0, actualHeight = 0, cellCount = 12, rowCount = 40, endRow = 0, endCell = 0, len, i, j;
            for (i = startCell, len = colWtColl.length; i < len; i++) {
                actualWidth += colWtColl[i];
                if (actualWidth >= this._pageWidth) {
                    endCell = cellCount = i;
                    break;
                }
                else {
                    extra = Math.floor((this._pageWidth - actualWidth) / sheet.columnWidth);
                    endCell = cellCount = colWtColl.length + extra;
                }
            }

            for (j = startRow, len = rowHtColl.length; j < len; j++) {
                actualHeight += rowHtColl[j];
                if (actualHeight >= this._pageHeight) {
                    endRow = rowCount = j;
                    break;
                }
                else {
                    extra = Math.floor((this._pageHeight - actualHeight) / xlObj.model.rowHeight);
                    endRow = rowCount = rowHtColl.length + extra;
                }
            }
            var cells = { startCell: startCell, endCell: endCell, startRow: startRow, endRow: endRow, cellCount: cellCount, rowCount: rowCount };
            return cells;
        },

        _constructSheet: function (printDiv, sheetIdx, table, rows) {
            var maindiv = ej.buildTag("div .e-spreadsheet", "", {}), subdiv = ej.buildTag("div .e-spreadsheetmainpanel", "", {}), pageCount = 0, cells = this._calculateCellRowCount(rows, 0, 0);
            var totCellCount = rows[0].cells.length, totRowCount = rows.length;
            pageCount = Math.ceil(totCellCount / cells.cellCount);
            pageCount = pageCount * (Math.ceil(totRowCount / cells.rowCount));
            if(pageCount == 1)
                cells.rowCount = rows.length;
            maindiv.append(subdiv);
            this._constructPrintableElement(sheetIdx, printDiv, maindiv.find(".e-spreadsheetmainpanel"), table, rows, totRowCount, totCellCount, pageCount, cells.cellCount, cells.rowCount, cells.startRow, cells.startCell, cells.endRow, cells.endCell);
        },

        _constructPrintableElement: function (sheetIdx, printDiv, maindiv, maintable, rows, totRowCount, totCellCount, pageCount, cellCount, rowCount, startRow, startCell, endRow, endCell) {
            var trRow, tdTemplate, isFirst = false, table, xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx), duplicateDiv = ej.buildTag("div"), pageTable, rIdx,
                isEmpty = false, rowHt, isavbleRow = true, isRHide = false, isCHide = false, emptyTr = 0, currTable, i, j, cell, len, dupTab, cols = xlObj._getContent(sheetIdx).find('col'),
                colWtColl = sheet.columnsWidthCollection, rowHtColl = sheet.rowsHeightCollection, chartPicElems, link;
            for (var h = pageCount; h > 0; h--) {
                pageTable = this._calculateCellRowCount(rows, startCell, startRow);
                startCell = pageTable.startCell; endCell = pageTable.endCell; startRow = pageTable.startRow; endRow = pageTable.endRow; cellCount = pageTable.cellCount; rowCount = pageTable.rowCount;
                table = this._constructTable(sheetIdx, startCell, endCell);
                if (sheet.showHeadings)
                    this._constructHeaders(startCell, endCell, endRow, table);
				if (this._isPrintSelection)
				    rIdx = (startRow < this._stRow) ? this._stRow : startRow;
                else
                    rIdx = startRow;
				for (i = startRow; i < endRow; i++) {
                    if (!ej.isNullOrUndefined(maintable[0].rows[i])) {
                        rowHt = rowHtColl[i];
                        isavbleRow = true;
                        trRow = (rowHt > 0) ? ej.buildTag("tr", "", { height: rowHt }) : ej.buildTag("tr", "", { height: xlObj.model.rowHeight });
                    }
                    else {
                        isavbleRow = false;
                        trRow = ej.buildTag("tr", "", { height: xlObj.model.rowHeight });
                    }
                    if (isavbleRow) {
                        isRHide = xlObj.XLEdit.getPropertyValue(i, 0, "isRHide");
                        if(!ej.isNullOrUndefined(isRHide))
                            xlObj.addClass(trRow[0], "e-r-hide");
                    }                       
                    for (j = startCell; j < endCell; j++) {
                        if (sheet.showHeadings && !isFirst) {
                            tdTemplate = "<td class=\"{0}\">{1}</td>";
                            $(String.format(tdTemplate, "e-rowcell e-header", (i + 1))).appendTo(trRow);
                            isFirst = true;
                        }
                        if ($(rows[i]).length > 0 && $(rows[i].cells[j]).length > 0) {
                            cell = $(rows[i].cells[j].outerHTML).attr("id", "ss");
                            cell.appendTo(trRow);
                        }
                        else {
                            cell = ej.buildTag("td.e-rowcell");
                            cell.appendTo(trRow);
                        }
                        isCHide = xlObj.XLEdit.getPropertyValue(0, j, "isCHide");
                        if (!ej.isNullOrUndefined(isCHide))
                            xlObj.addClass(cell[0], "e-col-hide");
                    }
                    isFirst = false;
                    table.append(trRow);
				 }
                printDiv.append(table);
                if (endRow < totRowCount) {
                    startRow = endRow;
                    endRow = endRow + rowCount;
                }
                else if (endRow >= totRowCount) {
                    if (endCell >= totCellCount)
                        break;
                    startRow = 0;
                    endRow = rowCount;
                    startCell = endCell;
                    endCell = endCell + cellCount;
                }
            }
            for (i = printDiv.find("table").length - 1; i >= 0 ; --i) {
                currTable = $(printDiv.find("table")[i]);
                if (!isEmpty)
                    this._checkEmptyRow(sheetIdx, currTable, "first");
                emptyTr = sheet.showHeadings ? currTable.find("tr.empty").length + 1 : currTable.find("tr.empty").length;
                if ((currTable.find("tr").length !== emptyTr) || isEmpty) {
                    $(currTable.get(0).outerHTML).attr("id", "cc").appendTo(duplicateDiv);
                    isEmpty = true;
                }

            }
            dupTab = duplicateDiv.find("table");
            for (i = dupTab.length - 1 ; i >= 0 ; --i) {
                if (dupTab.length - 1 !== i) {
                    if (xlObj.model.pageSize === ej.Spreadsheet.pageSize.A4)
                        dupTab.eq(i).css({ 'margin-top': 300, 'margin-bottom': 300 });
                    if (xlObj.model.pageSize === ej.Spreadsheet.pageSize.A3)
                        dupTab.eq(i).css({ 'margin-top': 120, 'margin-bottom': 110 });
                    if (xlObj.model.pageSize === ej.Spreadsheet.pageSize.Letter)
                        if(sheet.showHeadings)
                            dupTab.eq(i).css({ 'margin-top': 70, 'margin-bottom': 50 });
                        else
                            dupTab.eq(i).css({ 'margin-top': 0, 'margin-bottom': 50 });
                }
                else if (dupTab.length - 1 === i)
                    dupTab.eq(i).css({ 'margin-top': 30, 'margin-bottom': sheet.showHeadings ? 20 : 0 });
                if (!i) {
                    if (dupTab.length > 1)
                        dupTab.eq(i).css({ 'margin-top': 120, 'margin-bottom': 0 });
                    this._checkEmptyRow(sheetIdx, dupTab.eq(i), "last");
                }
                $(dupTab[i].outerHTML).attr("id", "cc").appendTo(maindiv);
            }
            var links = $("head").find("link"), stylesLink = [];
            for (i = 0, len = links.length; i < len; i++) {
                link = links[i].href || "";
                if (links[i].href.indexOf("ej.pivotintegration.css") > -1 || link.indexOf("ej.theme") > -1 ) {
                    stylesLink.push(links[i]);
                    break;
                }
            }
            chartPicElems = this._constructChartPicElement(maindiv);
            maindiv.append(chartPicElems);
            maindiv = maindiv.parent();
            xlObj._trigger("_pivotPrint", { element: maindiv });
            this.print(maindiv, stylesLink, sheetIdx);
        },

        _hideShapeElement: function (element) {
            if (this._isPrintSelection) {
                var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), selectedCells = xlObj.getSheet(sheetIdx)._selectedCells, shapemngr = xlObj.getSheet(sheetIdx).shapeMngr, chartLen = xlObj.getObjectLength(shapemngr.chart), picLen = xlObj.getObjectLength(shapemngr.picture);
                element.find(".e-ss-object").hide();
                if (chartLen >= 1) {
                    for (var j = 0; j < chartLen ; j++) {
                        for (var i = 0, len = selectedCells.length; i < len; i++) {
                            if (shapemngr.chart[xlObj.getObjectKeys(shapemngr.chart)[j]].rowIndex == selectedCells[i].rowIndex && shapemngr.chart[xlObj.getObjectKeys(shapemngr.chart)[j]].colIndex == selectedCells[i].colIndex)
                                element.find("#" + shapemngr.chart[xlObj.getObjectKeys(shapemngr.chart)[j]].id).show();
                        }
                    }
                }
                if (picLen >= 1) {
                    for (var j = 0; j < picLen ; j++) {
                        for (var i = 0, len = selectedCells.length; i < len; i++) {
                            if (shapemngr.picture[xlObj.getObjectKeys(shapemngr.picture)[j]].rowIndex == selectedCells[i].rowIndex && shapemngr.picture[xlObj.getObjectKeys(shapemngr.picture)[j]].colIndex == selectedCells[i].colIndex)
                                element.find("#" + shapemngr.picture[xlObj.getObjectKeys(shapemngr.picture)[j]].id).show();
                        }
                    }
                }
            }
        },

        _constructChartPicElement: function (maindiv) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), chartPicElems = xlObj.element.find(".e-ss-object").clone(),
                shapemngr = xlObj.getSheet(sheetIdx).shapeMngr, chartLen = xlObj.getObjectLength(shapemngr.chart), picLen = xlObj.getObjectLength(shapemngr.picture), tables = maindiv.find("table"),
                tableLen = tables.length, table, sRowIdx, sColIdx, eRowIdx, eColIdx, rowIdx, colIdx, tabrw;
            this.shpIndex = []; this.shpObj = [], this.shpPicObj = [];
            for (var k = 0; k < tableLen; k++) {
                table = tables[k];
                tabrw = $(table).find("tr");
                sRowIdx = parseInt(tabrw.eq(1).find("td").eq(0).text()) - 1;
                sColIdx = xlObj.XLEdit.getColumnIndexByField(tabrw.eq(0).find("td").eq(1).children().text().trim());
                eRowIdx = sRowIdx + (tabrw.length - 1);
                eColIdx = sColIdx + tabrw.eq(0).children().length - 1;
                this.shpIndex.push({ pageNumber: k, startColIdx: sColIdx, startRowIdx: sRowIdx, endRowIdx: eRowIdx, endColIdx: eColIdx, top: table.style.marginTop, bottom: table.style.marginBottom, height: table.style.height });
            }
            if (chartLen >= 1) {
                for (var j = 0; j < chartLen ; j++) {
                    rowIdx = shapemngr.chart[chartPicElems[j].id].rowIndex;
                    colIdx = shapemngr.chart[chartPicElems[j].id].colIndex;
                    for (var i = 0, leng = this.shpIndex.length; i < leng; i++) {
                        if (rowIdx >= this.shpIndex[i].startRowIdx && rowIdx < this.shpIndex[i].endRowIdx && colIdx >= this.shpIndex[i].startColIdx && colIdx < this.shpIndex[i].endColIdx) {
                            this.shpObj.push({ ID: chartPicElems[j].id, rowIndex: rowIdx, colIndex: colIdx, tableNumber: i })
                            this.shpObj[j].colIndex = this.shpObj[j].colIndex - this.shpIndex[i].startColIdx;
                            this.shpObj[j].rowIndex = this.shpObj[j].rowIndex - this.shpIndex[i].startRowIdx;
                        }
                    }
                    $(chartPicElems[j]).addClass(".e-spreadsheet .e-ss-object .e-datavisualization-chart .e-js");
                    $(chartPicElems[j]).css({ border: '1px solid gray', position: "absolute" });
                }
            }
            if (picLen >= 1) {
                for (var j = 0; j < picLen ; j++) {
                    rowIdx = shapemngr.picture[chartPicElems[chartLen + j].id].rowIndex;
                    colIdx = shapemngr.picture[chartPicElems[chartLen + j].id].colIndex;
                    for (var i = 0, leng = this.shpIndex.length; i < leng; i++) {
                        if (rowIdx >= this.shpIndex[i].startRowIdx && rowIdx < this.shpIndex[i].endRowIdx && colIdx >= this.shpIndex[i].startColIdx && colIdx < this.shpIndex[i].endColIdx) {  //this.shpObj.push({ tableNumber: i });
                            this.shpPicObj.push({ ID: chartPicElems[chartLen + j].id, rowIndex: rowIdx, colIndex: colIdx, tableNumber: i });
                            this.shpPicObj[j].colIndex = this.shpPicObj[j].colIndex - this.shpIndex[i].startColIdx;
                            this.shpPicObj[j].rowIndex = this.shpPicObj[j].rowIndex - this.shpIndex[i].startRowIdx;
                        }
                    }
                    $(chartPicElems[chartLen + j]).addClass(".e-spreadsheet .e-ss-object");
                    $(chartPicElems[chartLen + j]).css({ position: 'absolute', "background-size": '100% 100%' });
                }
            }
            return chartPicElems;
        },

        _calculateTopForShapes: function (element) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx),
                top, table, style, bottom, mtop, obj = this.shpObj.concat(this.shpPicObj), len = obj.length, diffLeft, diffTop;
            //Chart picture position update
            for (var j = 0; j < len; j++) {
                if (obj[j].tableNumber == 0) {
                    diffLeft = sheet._colWidthCollection[obj[j].colIndex], diffTop = sheet._rowHeightCollection[obj[j].rowIndex];
                    element.find("#" + obj[j].ID).css({ top: (diffTop + 60), left: (diffLeft + 20 + 8) });
                }
                else {
                    // top calcuation
                    top = 0
                    for (var t = 0; t < obj[j].tableNumber; t++) {
                        table = element.find('.e-table')[t];
                        style = table.getBoundingClientRect();
                        bottom = parseInt(table.style.marginBottom);
                        mtop = parseInt(table.style.marginTop);
                        top = top + (style.height + bottom + mtop);
                    }
                    diffLeft = sheet._colWidthCollection[obj[j].colIndex], diffTop = sheet._rowHeightCollection[obj[j].rowIndex];
                    element.find("#" + obj[j].ID).css({ top: (diffTop + top + 30 + parseInt(this.shpIndex[obj[j].tableNumber].top)), left: (diffLeft + 20 + 18) });// 18 for left
                }
            }
        },

        _checkEmptyRow: function (sheetIdx, currTable, tablePosn) {
            var emptyTd, emptyCnt, curTr = currTable.find("tr"), unformatted, unBordered, isMHide;
            for (var j = curTr.length - 1; j >= 0 ; --j) {
				emptyTd = $(curTr[j]).find(".e-rowcell").length;
                emptyCnt = $(curTr[j]).find(".e-rowcell:empty").length;
                emptyCnt = this.XLObj.getSheet(sheetIdx).showHeadings ? emptyCnt + 1 : emptyCnt;
				unformatted = $(curTr[j]).find('td[class *= "e-format"]').length;
				unBordered = $(curTr[j]).find('td[class *= "e-border"]').length;
				isMHide = $(curTr[j]).find('td[class *= "e-mc-hide"]').length;
				if ((emptyCnt === emptyTd) && unformatted < 1 && unBordered < 1 && isMHide < 1)
                    $(curTr[j]).addClass("empty");
                else {
                    $(curTr[j]).addClass("nonempty");
                    break;
                }
            }
            if (tablePosn === "last") {
                currTable.find("tr.empty").find("td").removeClass("e-rowcell");
                currTable.find("tr.empty").find("td.e-header").text("");
            }
        },

        _constructTable: function (sheetIdx, startCell, endCell) {
            var colgroup = ej.buildTag("colgroup"), xlObj = this.XLObj, pDiv =  ej.buildTag("div", "", { height: this._printHeight, 'margin-top': this._marginTop, 'margin-bottom': this._marginBottom}),  table = ej.buildTag("table.e-table", "", { height: this._printHeight, 'margin-top': this._marginTop, 'margin-bottom': this._marginBottom}),
                col = xlObj._getContent(xlObj.getActiveSheetIndex()).find("col"), newcol;
            if (xlObj.getSheet(sheetIdx).showHeadings) {
                newcol = "<col class=\"{0}\" style= \"width: 30px;\" >{1}</col>";
                $(newcol).appendTo(colgroup);
            }
            for (var j = startCell; j < endCell; j++)
                if ($(col[j]).length > 0)
                    $(col[j].outerHTML).attr("id", "cc").appendTo(colgroup);
                else {
                    newcol = "<col style= \"width: 64px;\" ></col>";
                    $(newcol).appendTo(colgroup);
                }
            table.append(colgroup);
            pDiv.append(table);
            return table;
        },

        _constructHeaders: function (startCell, endCell, endRow, table) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), trRow = ej.buildTag("tr", "", { height: 30 }), tdTemplate, divTemplate, divcell, divCellData, tdCellData, isFirst = false,
                cols = xlObj._getContent(sheetIdx).find('col'), rClass = "e-rowcell";
            if (this._isPrintSelection) {
                if (startCell < this._stCol) {
                    endCell = endCell + (this._stCol - startCell);
                    startCell = this._stCol;
                }
            }
            tdTemplate = "<td class=\"{0}\">{1}</td>";
            divTemplate = "<div class = \"{0}\" > {1}</div>";
            for (var i = startCell; i <= endCell; i++) {
                if (!isFirst) {
                    divcell = "";
                    isFirst = true;
                }
                else {
                    divcell = xlObj._generateHeaderText(i);
                    rClass = !ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(0, i - 1, "isCHide")) ? "e-rowcell e-col-hide" : "e-rowcell e-headercell";
                }
                divCellData = String.format(divTemplate, "e-headercelldiv", divcell);
                tdCellData = String.format(tdTemplate, rClass, divCellData);
                $(trRow[0]).append(tdCellData);
            }
            table.append(trRow);
        },

        print: function (element, links, sheetIdx) {
            var xlObj = this.XLObj;
            if (!xlObj.model.printSettings.allowPrinting || xlObj.model.isReadOnly)
				return;
            var printWin = window.open('', 'print', "height=" + screen.height + ",width=" + screen.width + ",tabbar=no");
			if(xlObj.isUndefined(printWin))
				return;
			var styletext, sty, a, $div = ej.buildTag("div"), elementClone = element.clone();
			$div.append(elementClone);
			printWin.document.write("<!DOCTYPE html>");
			if (xlObj._browserDetails.name === "msie") {
                a = "";
                if (links.length > 0)
                    $(links).each(function (index, obj) {
                        $(obj).attr("href", obj.href);
                        if (obj.tagName == "STYLE" && obj.styleSheet) //IE < 11, inline CSS not loaded
                            a += ("<style>" + obj.styleSheet.cssText + "</style>");
                        else
                            a += obj.outerHTML;
                    });
                printWin.document.write('<html><head></head><body>' + a + $div[0].innerHTML + '</body></html>');
            }
            else {
                a = "";
                printWin.document.write("<html><head>");
                if (links.length > 0)
                    $(links).each(function (index, obj) {
                        $(obj).attr("href", obj.href);
                        a += obj.outerHTML;
                    });
                printWin.document.writeln(a + "</head><body>");
                printWin.document.writeln($div[0].innerHTML + "</body></html>");
                if (xlObj.model.printSettings.allowPageSize) {
                    $(printWin.document.head).append('<style></style>');
                    if (xlObj.model.sheets[sheetIdx].showGridlines)
                        styletext = ".e-spreadsheet .e-table{table-layout: fixed; width: 100%;}.e-spreadsheet .e-rowcell {border: 1px solid #000000;line-height: 14px;overflow: hidden;white-space: pre;vertical-align: bottom;}.e-spreadsheet .e-table{border-collapse: collapse}";
                    else
                        styletext = ".e-spreadsheet .e-table{table-layout: fixed; width: 100%;}.e-spreadsheet .e-rowcell {line-height: 14px;overflow: hidden;white-space: pre;vertical-align: bottom;}.e-spreadsheet .e-table{border-collapse: collapse}";
                    styletext = styletext.concat($(document).find("style#" + this.XLObj._id + "_sscustomformat").text());
                    sty = $(printWin.document.head).find("style");
                    styletext = styletext.concat(".e-spreadsheet .e-fr-hide { display: none !important;}.e-spreadsheet .e-fc-hide { display: none !important;}.e-spreadsheet .e-sswraptext {word-break: break-all; white-space: normal;}.e-spreadsheet .e-headercell{text-align:center;}.e-spreadsheet .e-ralign{text-align:right;}.e-spreadsheet .e-calign{text-align:center;}");
                    styletext = styletext.concat(".e-spreadsheet .e-hyperlinks { text-decoration: underline;}")
                    sty.append(styletext);
                }
			}
			if (xlObj.model.printSettings.allowPageSize && $(printWin.document).find(".e-ss-object").clone().length) {
			    this._calculateTopForShapes($(printWin.document).find('.e-spreadsheetmainpanel'));
			    this._hideShapeElement($(printWin.document).find('.e-spreadsheetmainpanel'));
			}
			this._isPrintSelection = false;
			printWin.document.close();
            printWin.focus();
            setTimeout(function () {
                if ((xlObj._browserDetails.name === "msie") ? (xlObj.getObjectLength(printWin) && !ej.isNullOrUndefined(printWin.window) && !ej.isNullOrUndefined(printWin.location)) : (!ej.isNullOrUndefined(printWin.window) && !ej.isNullOrUndefined(printWin.location)))
                    printWin.print();                    
                setTimeout(function () { printWin.close(); }, 2000);
            }, 2000);
        }
    };
})(jQuery, Syncfusion);