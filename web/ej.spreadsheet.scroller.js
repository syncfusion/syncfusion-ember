(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.scroller = function (obj) {
        this.XLObj = obj;
        this._isIntrnlScroll = false;
    };

    ej.spreadsheetFeatures.scroller.prototype = {
        
        _getColWidths: function (sheetIdx, colIdx) {
            var i, len, xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx), colWidthColl = sheet.columnsWidthCollection,
                colWidth = sheet._colWidthCollection, val, ofColWidth = sheet._ofColWidthColl;
            if(!colIdx)
                colIdx = 1;
            for (i = colIdx, len = colWidthColl.length; i < len ; i++){
                colWidth[i] = colWidth[i - 1] + colWidthColl[i - 1];
				val = (colWidthColl[i - 1] === 0) ? sheet.hideColsCollection[i - 1] : colWidthColl[i - 1];
				ofColWidth[i] = ofColWidth[i - 1] + val;
			}
        },

        _getRowHeights: function (sheetIdx, rowIdx, cellHgt) { // no need this logic
            var i, blkIdx, len, xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx), rowHtColl = sheet.rowsHeightCollection, rowHeight = sheet._rowHeightCollection, hideRowsColl = sheet.hideRowsCollection;
            if (!rowIdx)
                rowIdx = 1;
            for (i = rowIdx, len = rowHtColl.length; i < len ; i++)
                rowHeight[i] = rowHeight[i - 1] + (hideRowsColl.indexOf(i - 1) > -1 ? 0 : rowHtColl[i - 1]);            
            if (!cellHgt && xlObj.model.scrollSettings.allowScrolling) {
                if (xlObj.model.scrollSettings.allowVirtualScrolling)
                    xlObj._refreshVrtlBlocks(sheetIdx);
                this._refreshScroller(sheetIdx, "refresh", "vertical");
            }
        },
		
        _createScroller: function (sheetIdx, settings, action) {
            var xlObj = this.XLObj, isHScroll = true, isVScroll = true, $content = xlObj._getContent(sheetIdx), vscroll = ej.buildTag("div#vscrollBar"),
                hscroll = ej.buildTag("div#hscrollBar"), sheet = xlObj.getSheet(sheetIdx), width = xlObj.model.scrollSettings.isResponsive ? settings.width - 2 : settings.width;
            sheet._contWidth = width;
            sheet._contHeight = settings.height;
            if (xlObj.model.scrollSettings.scrollMode === ej.Spreadsheet.scrollMode.Normal) {
                if (sheet._contWidth > xlObj._getEntireColWidth(sheetIdx))
                    isHScroll = false;
                if (sheet._contHeight > xlObj._getEntireRowHeight(sheetIdx))
                    isVScroll = false;
                hscroll[0].style.display = isHScroll ? "block" : "none";
                vscroll[0].style.display = isVScroll ? "block" : "none";
            }
            $content.append(vscroll).append(hscroll);
            xlObj._getJSSheetContent(sheetIdx).find(".e-spreadsheetcontentcontainer > .e-content").width(width - (isVScroll ? 18 : 0)).height(settings.height - (isHScroll ? 18 : 0));
            vscroll.ejScrollBar({
                orientation: "vertical",
                height: settings.height - (isHScroll ? 18 : 0),
                minimum: 0,
                viewportsize: settings.height,
                infiniteScrolling: true,
                scroll: $.proxy(this._scrollSpreadY, this)
            });
            hscroll.ejScrollBar({
                orientation: "horizontal",
                width: width - (isVScroll ? 17 : 0),
                minimum: 0,
                infiniteScrolling: true,
                viewportsize: settings.width,
                scroll: $.proxy(this._scrollSpreadX, this)
            });
            (action != "initial") && this._refreshScroller(sheetIdx, "initial", "all");
        },
        
        _hScroller: function (sheetIdx) {
            return this.XLObj._getContent(this.XLObj._getSheetIndex(sheetIdx)).find("#hscrollBar").data("ejScrollBar");
        },

        _vScroller: function (sheetIdx) {
            return this.XLObj._getContent(this.XLObj._getSheetIndex(sheetIdx)).find("#vscrollBar").data("ejScrollBar");
        },
		
        _refreshScroller: function (sheetIdx, status, type) {
            var modelWt, scrollWt, modelHt, scrollHt, noOfCol, noOfRow, fdiff = 0, xlObj = this.XLObj, sheetIdx = xlObj._getSheetIndex(sheetIdx), sheet = xlObj.getSheet(sheetIdx), hScroll = this._hScroller(sheetIdx),
                colWt = sheet.columnWidth, rowHt = sheet.rowHeight, vScroll = this._vScroller(sheetIdx), isScrlNrml = (xlObj.model.scrollSettings.scrollMode === ej.Spreadsheet.scrollMode.Normal),
                content = xlObj._getContent(sheetIdx), cont = content.find(".e-content")[0];
            if (isScrlNrml && hScroll && vScroll && content.find("table").length) {
                this._refreshContHgt(sheetIdx);
                type = (type === "horizontal") ? "all" : type;
            }
            /* ----------- Horizontal Scrollbar--------- */
            if (hScroll && (type === "all" || type === "horizontal")) {
                modelWt = cont.offsetWidth;
                scrollWt = xlObj._getWidth(0, sheet.colCount - 1, sheetIdx) - sheet._frozenWidth;
                if ((scrollWt < modelWt + 2 * colWt) && !isScrlNrml) {
                    noOfCol = Math.floor(((modelWt + (colWt * 5)) - scrollWt) / colWt);
                    for (var i = 0; i < noOfCol; i++) {
                        this._createNewColumn(sheetIdx, { rowIndex: -1, colIndex: -1 }, { rowIndex: -1, colIndex: -1 }, "insert");
                        scrollWt = scrollWt + colWt;
                    }
                }
                hScroll._scrollData.handleSpace = modelWt - (2 * hScroll.model.buttonSize);
                fdiff = xlObj._isFrozen(xlObj.getFrozenColumns()) ? xlObj._getColOffsetLeft(sheet, (xlObj.getFrozenColumns())) - sheet._contScrollLeft : 0;
                hScroll._scrollData.handle = Math.floor((modelWt - fdiff) / scrollWt * hScroll._scrollData.handleSpace);
                if (hScroll._scrollData.handle < 15)
                    hScroll._scrollData.handle = 15;
                hScroll._scrollData.scrollable = hScroll.model.maximum = scrollWt - (modelWt - fdiff);
                hScroll._scrollData.onePx = hScroll._scrollData.scrollable / (hScroll._scrollData.handleSpace - hScroll._scrollData.handle) || 1;
                hScroll["e-hhandle"].width(hScroll._scrollData.handle);
                hScroll.model.scrollLeft = hScroll._scrollData.handleSpace - hScroll._scrollData.handle;
            }
            if (vScroll && (type === "all" || type === "vertical")) {
                /* ----------- Vertical Scrollbar--------- */
                modelHt = cont.offsetHeight;
                scrollHt = xlObj._getMaxHgt(sheetIdx, true, true) - sheet._frozenHeight;
                if (!isScrlNrml && scrollHt < modelHt + (2 * rowHt)) {
                    noOfRow = Math.floor(((modelHt + (rowHt * 5)) - scrollHt) / rowHt);
                    for (var i = 0; i < noOfRow; i++) {
                        this._createNewRow(sheetIdx, -1, -1, "insert");
                        scrollHt = scrollHt + rowHt;
                    }
                }
                vScroll._scrollData.handleSpace = modelHt - (2 * vScroll.model.buttonSize);
                fdiff = xlObj._isFrozen(xlObj.getFrozenRows()) ? xlObj._getRowOffsetTop(sheet, (xlObj.getFrozenRows())) - sheet._contScrollTop : 0;
                vScroll._scrollData.handle = Math.floor((modelHt - fdiff) / scrollHt * vScroll._scrollData.handleSpace);
                if (vScroll._scrollData.handle < 15)
                    vScroll._scrollData.handle = 15;
                if (vScroll._scrollData.handle > vScroll._scrollData.handleSpace && xlObj.model.scrollSettings.scrollMode === ej.Spreadsheet.scrollMode.Normal)
                    vScroll._scrollData.handle = vScroll._scrollData.handleSpace;
                vScroll._scrollData.scrollable = vScroll.model.maximum = scrollHt - (modelHt - fdiff);
                vScroll._scrollData.onePx = vScroll._scrollData.scrollable / (vScroll._scrollData.handleSpace - vScroll._scrollData.handle);
                vScroll["e-vhandle"].height(vScroll._scrollData.handle);
                vScroll.model.scrollTop = vScroll._scrollData.handleSpace - vScroll._scrollData.handle;
            }
        },

        _refreshContHgt: function (sheetIdx) {
            var hgt, cWidth, isHScrl, isVScrl, vScroll, hdlSpceHgt, hdlSpceWdth, hScroll, px = "px", none = "none", blk = "block", width = "width", height = "height", xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx),
                colWidth = xlObj._getEntireColWidth(sheetIdx), rowHeight = xlObj._getEntireRowHeight(sheetIdx), content = xlObj._getContent(sheetIdx), cont = content.find(".e-content"), hScrlStyle = content.find("#hscrollBar")[0].style, vScrlStyle = content.find("#vscrollBar")[0].style;
            hgt = cont[0].offsetHeight;
            cWidth = cont[0].offsetWidth;
            isHScrl = (hScrlStyle.display === none && sheet._contWidth < colWidth);
            isVScrl = (vScrlStyle.display === none && sheet._contHeight < rowHeight);
            if (isHScrl || (hScrlStyle.display === blk && sheet._contWidth > colWidth)) {
                hScrlStyle.display = isHScrl ? blk : none;
                hgt = isHScrl ? (hgt - 18) : (hgt + 19);
                isHScrl = true;
            }
            if (isVScrl || (vScrlStyle.display === blk && sheet._contHeight > rowHeight)) {
                vScrlStyle.display = isVScrl ? blk : none;
                cWidth = isVScrl ? (cWidth - 19) : (cWidth + 19);
                isVScrl = true;
            }
            if (isHScrl || isVScrl) {
                hdlSpceHgt = hgt - (2 * 18) + px;
                hgt += px;
                vScroll = content.find("#vscrollBar");
                cont[0].style[height] = hgt;
                xlObj._getJSSheetRowHeaderContent(sheetIdx)[0].style[height] = hgt;
                vScroll[0].style[height] = hgt;
                vScroll.find(".e-vscroll")[0].style[height] = hgt;
                vScroll.find(".e-vhandlespace")[0].style[height] = hdlSpceHgt;
                hScroll = content.find("#hscrollBar");
                cont[0].style[width] = cWidth + px;
                if (vScrlStyle.display === blk)
                    cWidth++;
                hdlSpceWdth = cWidth - (2 * 18) + px;
                cWidth += px;
                hScroll[0].style[width] = cWidth;
                hScroll.find(".e-hscroll")[0].style[width] = cWidth;
                hScroll.find(".e-hhandlespace")[0].style[width] = hdlSpceWdth;
            }
            colWidth += px;
            cont.find("table")[0].style[width] = colWidth;
            xlObj._getJSSheetHeader(sheetIdx).find("table")[0].style[width] = colWidth;
        },

        _changeTopSpread: function (vScroll, d, step, source) {
            var start = vScroll.value(), t = start + step;
            d.step = step;
            (!d.enableRTL ? t > d.scrollable : t < d.scrollable) && (t = d.scrollable);
            (!d.enableRTL ? t < 0 : t > 0) && (t = 0);
            vScroll["scroll"](t, source);
        },

        _spreadMouseWheel: function (e) {
            var xlObj = this.XLObj, activeCell, vScroll = this._vScroller(xlObj.getActiveSheetIndex());           
            if (ej.isNullOrUndefined(vScroll)|| !vScroll.element.is(":visible"))
                return;
			xlObj._filterClose(e.target);
            e.stopImmediatePropagation();
            e.preventDefault();
            if (xlObj.element.find(".e-excelfilter.e-dlgcontainer").is(":visible") || xlObj._isSubMenuOpen() || xlObj._isSheetRename)
                return;
			if (xlObj.model.allowComments && xlObj.XLComment._isCommentEdit){
				activeCell = xlObj.getActiveCell();
				if(!ej.isNullOrUndefined(activeCell))
				xlObj.XLComment._updateCurCmntVal({ rowIndex: activeCell.rowIndex, colIndex: activeCell.colIndex });	
			}
			if (xlObj.model.allowDataValidation)
			    $("#" + xlObj._id + "ddl").ejDropDownList("hidePopup");
            var delta = 0, ori = e;
            e = e.originalEvent;
            if (e.wheelDelta) {
                delta = -e.wheelDelta / 120;
                if (window.opera) {
                    if (parseFloat(window.opera.version, 10) < 10)
                        delta = -delta;
                }
            } else if (e.detail) delta = e.detail / 3;
            if (!delta) return;
            if (this._changeTopSpread(vScroll, vScroll._scrollData, (delta * vScroll._scrollData.scrollOneStepBy), "wheel"))
                e.preventDefault ? e.preventDefault() : ori.preventDefault();
            $.data(this, 'timer', setTimeout(function () {
                xlObj._trigger("scrollStop", { originalEvent: e, scrollData: vScroll._scrollData, reqType: "vertical", position: vScroll.model.value });
            }, 250));
        },

        _scrollSpreadX: function (args) {
            var xlObj = this.XLObj;
			xlObj._isScrolling = true; 
            if (xlObj.getSheet()._isFreezed && xlObj._isFrozen(xlObj.getFrozenColumns())) {
                xlObj.XLFreeze._frozenScrollHandler(args)
                this._getFirstColumn(xlObj.getActiveSheetIndex());
            }
            else
                this._spreadHS(args);
			
			xlObj._isScrolling = false; 
		},

		_scrollDirection: function(scroller, pix){
            var xlObj = this.XLObj, scroller = xlObj._getContent(xlObj.getActiveSheetIndex()).find('#' + scroller).ejScrollBar('instance');
            if(scroller.value() < pix)
                scroller._scrollData.step = 1;
            else if(scroller.value() > pix)
                scroller._scrollData.step = -1;
            scroller.scroll(pix);
        },

		_spreadHS: function(args) {
		    var pix, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), hScroll = this._hScroller(sheetIdx), content = xlObj._getContent(sheetIdx),
                cont = content.find(".e-content"), colgrp = content.find('col'), sheet = xlObj.getSheet(sheetIdx), count = ((args.scrollLeft - sheet._scrollLeft) / sheet.columnWidth);
            args["reachedEnd"] = Math.ceil(parseFloat(hScroll.element.find(".e-hhandle").css('left'))) + Math.ceil(parseFloat(hScroll.element.find(".e-hhandle").width())) >= xlObj.element.find(".e-hhandlespace").width() - 2;
            pix = args.scrollLeft;
            if (xlObj.model.enableContextMenu)
                xlObj.XLCMenu.hideCMenu();
            if (xlObj.model.scrollSettings.scrollMode === ej.Spreadsheet.scrollMode.Infinite && args.scrollData.step > -1 && !xlObj._scrollReverse) {
                if (args.reachedEnd && sheet._leftCol.idx + count <= sheet.colCount) {
                    args.cancel = true;
                    this._scrollRight(sheetIdx);
                    pix = (hScroll._scrollData.handleSpace - hScroll._scrollData.handle) * hScroll._scrollData.onePx;
                    this._refreshScroller(sheetIdx, "refresh", "horizontal");
                    hScroll.element.find(".e-hhandle").css("left", (hScroll._scrollData.handleSpace - (hScroll._scrollData.handle + 1)));
                    hScroll.value(pix);
                }
                else if (sheet._leftCol.idx + count > sheet.colCount && args.scrollLeft >= sheet._scrollLeft && args.scrollLeft > 0 && sheet.colCount < xlObj._maxColCnt) {
                    while (args.scrollLeft > sheet._colWidthCollection[sheet._colWidthCollection.length - 1])
                        this._scrollRight(sheetIdx);
                    this._refreshScroller(sheetIdx, "refresh", "horizontal");
                }
            }
            sheet._scrollLeft = args.scrollLeft = pix;
		    xlObj._scrollReverse = false;
            cont.scrollLeft(args.scrollLeft);
            sheet._scrollLeft = cont.scrollLeft();
            hScroll.value(args.scrollLeft);
            this._getFirstColumn(sheetIdx);
            xlObj._refreshViewVar(null, args.scrollLeft, sheetIdx);
        },

		_scrollSpreadY: function (args) {
		    var newCnt, ndiff, diff, oldCnt, activeCell, wdiff = 0, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), vScroll = xlObj.getSheetElement(sheetIdx).find("#vscrollBar");
		    xlObj._isScrolling = true;
			if (sheet._isFreezed && xlObj._isFrozen(xlObj.getFrozenRows())) {
                xlObj.XLFreeze._frozenScrollHandler(args);
                this._getFirstRow(xlObj.getActiveSheetIndex());
            }
            else {
                oldCnt = xlObj.getDigits(sheet._bottomRow.idx);
                this.XLObj.model.scrollSettings.allowVirtualScrolling ? this._scrollHandler(args) : this._spreadVS(args);
                if (this.XLObj.model.allowComments && this.XLObj.XLComment._isCommentEdit) {
                    activeCell = this.XLObj.getActiveCell();
                    if (!ej.isNullOrUndefined(activeCell))
                        this.XLObj.XLComment._updateCurCmntVal({ rowIndex: activeCell.rowIndex, colIndex: activeCell.colIndex });
                }
                newCnt = xlObj.getDigits(sheet._bottomRow.idx);
                diff = newCnt - oldCnt;
                if (diff) {
                    if (newCnt > 3)
                        wdiff = ((newCnt - 3) * 10);
                    ndiff = xlObj._rowHeaderWidth + wdiff;
                    xlObj._getJSSheetRowHeaderContent(sheetIdx).find("col").width(ndiff);
                    xlObj._getJSSheetRowHeader(sheetIdx).width(ndiff);
                    xlObj._getJSSheetHeader(sheetIdx).find(".e-spreadsheetcolumnheader").width(ndiff - 1);
                    xlObj._getJSSheetContent(sheetIdx).find(".e-spreadsheetcontentcontainer > .e-content").width(sheet._contWidth - wdiff - (vScroll[0].style.display === "none" ? 0 : 18));//18 scroll bar width
                }
            }
			xlObj._isScrolling = false;
		},

		_scrollHandler: function (args) {
		    var j, key, rIdx, rowIdx, contTBody, cellTypes, rowHdrTBody, rangeData, clKeys, nstartRIdx, nendRIdx, pstartRIdx, pendRIdx, rowIdxs, currentTopRow, offset, i, hgt, height, canRefresh, isRefreshed, prop, len, fitWidth,
                xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), aCell = xlObj.getActiveCell(sheetIdx), isScrollDown = args.scrollTop >= sheet._scrollTop, vScroll = this._vScroller(sheetIdx),
                count = ((args.scrollTop - sheet._scrollTop) / sheet.rowHeight) + 1, cont = xlObj._getContent(sheetIdx).find(".e-content"), contHt; // +1 for adding one extra row for creating a new block
		    offset = i = hgt = height = 0;
		    canRefresh = isRefreshed = false;
		    if ((args.scrollTop === sheet._scrollTop || (sheet._bottomRow.idx + count > sheet.rowCount)) && xlObj.model.scrollSettings.scrollMode === ej.Spreadsheet.scrollMode.Infinite ) {
		        if (isScrollDown && args.scrollTop > 0 && sheet.rowCount < xlObj._maxRowCnt) {
		            rowIdx = sheet.rowCount;
		            do {
		                sheet._virtualBlockCnt++;
		                sheet.rowCount += sheet._virtualBlockRowCnt;
		                for (key in sheet._columnStyles) {
		                    rIdx = sheet._virtualBlockRowCnt;
		                    while (rIdx < sheet.rowCount) {
		                        xlObj.XLEdit._updateDataContainer({ rowIndex: rIdx, colIndex: parseInt(key) }, { dataObj: sheet._columnStyles[key] });
		                        rIdx++;
		                    }
		                }
		                while (i < sheet._virtualBlockRowCnt) {
		                    sheet.rowsHeightCollection.push(sheet.rowHeight);
		                    if (sheet.hideRowsCollection.indexOf(rowIdx) === -1 && sheet._hiddenFreezeRows.indexOf(rowIdx) === -1) {
		                        sheet._rowIdxColl.push(rowIdx);
		                        hgt = sheet._rowHeightCollection[sheet._rowHeightCollection.length - 1] + sheet.rowHeight;
		                        sheet._virtualTBodyHgt += sheet.rowHeight;
		                    }
		                    else
		                        hgt = sheet._rowHeightCollection[sheet._rowHeightCollection.length - 1];
		                    sheet._rowHeightCollection.push(hgt);
		                    rowIdx++;
		                    i++;
		                }
		                i = 0;
		            } while ((args.scrollTop + (sheet._virtualBlockRowCnt * sheet.rowHeight)) > sheet._rowHeightCollection[sheet._rowHeightCollection.length - 1]);
		            this._refreshScroller(sheetIdx, "refresh", "vertical");
		            sheet._scrollTop = args.scrollTop;
                    xlObj._refreshViewport(args.scrollTop, sheetIdx);
                    cont.scrollTop(args.scrollTop);
                    sheet._scrollTop = cont.scrollTop();
		            canRefresh = true;
		        }
		    }
		    else {
		        prop = ["value", "value2", "comment", "hyperlink", "format", "border", "type", "isFilterHide", "filterState", "isMHide", "isFHide", "merge", "isFilterHeader", "isFilterVisible", "text", "general", "cFormatRule", "wrap", "wrapRow", "rule", "align", "isOverflow", "isOfBrdr", "altTxt"];
		        rowHdrTBody = xlObj._getRowHdrTBody(sheetIdx);
		        contTBody = xlObj._getContTBody(sheetIdx);
		        if (isScrollDown) {
		            if (args.scrollTop >= sheet._virtualContTBodyOffset.bottom && args.scrollTop <= sheet._virtualBottomTBodyOffset.bottom) {
		                height = sheet._virtualTopTBodyOffset.bottom - sheet._virtualTopTBodyOffset.top;
		                sheet._virtualTopTBodyOffset.top = sheet._virtualContTBodyOffset.top;
		                sheet._virtualTopTBodyOffset.bottom = sheet._virtualContTBodyOffset.bottom;
		                sheet._virtualContTBodyOffset.top = sheet._virtualBottomTBodyOffset.top;
		                sheet._virtualContTBodyOffset.bottom = sheet._virtualBottomTBodyOffset.bottom;
		                sheet._virtualContBlockIdx++;
		                if (sheet._virtualContBlockIdx === sheet._virtualBlockCnt) {
		                    sheet._virtualBottomTBodyOffset.top = sheet._virtualBottomTBodyOffset.bottom = 0;
		                    sheet._isVirtualEndReached = true;
		                }
		                else {
		                    sheet._virtualBottomTBodyOffset.top = sheet._virtualBottomTBodyOffset.bottom;
		                    nstartRIdx = xlObj._getRowIdx(sheet._virtualContBlockIdx * sheet._virtualBlockRowCnt, sheetIdx, true);
		                    nendRIdx = xlObj._getRowIdx((sheet._virtualContBlockIdx * sheet._virtualBlockRowCnt) + (sheet._virtualBlockRowCnt - 1), sheetIdx, true);
		                    sheet._virtualBottomTBodyOffset.bottom = xlObj._getRowOffsetBottom(nendRIdx, sheetIdx);
		                    rowIdxs = sheet._rowIdxColl.slice(sheet._rowIdxColl.indexOf(nstartRIdx), sheet._rowIdxColl.indexOf(nendRIdx) + 1);
		                    rangeData = xlObj.getRangeData({ property: prop, sheetIdx: sheetIdx, rowIdxs: rowIdxs, withRowIdx: true });
		                    rowHdrTBody.append(xlObj._renderRowHdr(rangeData.rowIdx, sheetIdx));
		                    contTBody.append(xlObj._renderData(rangeData, sheetIdx));
                            sheet._virtualRowIdx = sheet._virtualRowIdx.concat(rangeData.rowIdx);
		                    canRefresh = true;
		                }
		                if (!sheet._isVirtualTopReached) {
		                    xlObj._removeRange(0, sheet._virtualBlockRowCnt);
		                    sheet._virtualRowIdx.splice(0, sheet._virtualBlockRowCnt);
		                    sheet._virtualTopTBodyHgt += height;
		                }
						contHt = (xlObj._browserDetails.name === "msie" || xlObj._browserDetails.name === "edge") ? contTBody[0].getBoundingClientRect().height : window.getComputedStyle(contTBody[0],null).height;
		                sheet._virtualBottomTBodyHgt = sheet._virtualTBodyHgt - (sheet._virtualTopTBodyHgt + Math.floor(parseFloat(contHt)));
		                xlObj._refreshTBodiesHgt();
		                sheet._isVirtualTopReached = false;
		            }
		            else if (!sheet._isVirtualEndReached && args.scrollTop >= sheet._virtualBottomTBodyOffset.bottom) {
                        xlObj._refreshViewport(args.scrollTop, sheetIdx);
                        canRefresh = isRefreshed = true;
		            }
					if (xlObj.model.allowCellType)
						xlObj.XLCellType._rangeCellTypes(sheet.cellTypes, sheetIdx);
					if (xlObj.model.allowSparkline)
							xlObj.XLSparkline._refreshContentWithSparkline(sheetIdx);
		        }
		        else {
		            if ((args.scrollTop + args.model.viewportsize) < sheet._virtualContTBodyOffset.top && (args.scrollTop + args.model.viewportsize) >= sheet._virtualTopTBodyOffset.top) {
		                height = sheet._virtualBottomTBodyOffset.bottom - sheet._virtualBottomTBodyOffset.top;
		                sheet._virtualBottomTBodyOffset.top = sheet._virtualContTBodyOffset.top;
		                sheet._virtualBottomTBodyOffset.bottom = sheet._virtualContTBodyOffset.bottom;
		                sheet._virtualContTBodyOffset.top = sheet._virtualTopTBodyOffset.top;
		                sheet._virtualContTBodyOffset.bottom = sheet._virtualTopTBodyOffset.bottom;
		                sheet._virtualContBlockIdx--;
		                sheet._virtualTopTBodyOffset.bottom = sheet._virtualContTBodyOffset.top;
		                if (sheet._virtualContBlockIdx === 1) {
		                    sheet._virtualTopTBodyOffset.top = 0;
		                    sheet._isVirtualTopReached = true;
		                }
		                else {
		                    pstartRIdx = xlObj._getRowIdx((sheet._virtualContBlockIdx - 2) * sheet._virtualBlockRowCnt, sheetIdx, true);
		                    pendRIdx = xlObj._getRowIdx((((sheet._virtualContBlockIdx - 2) * sheet._virtualBlockRowCnt) + (sheet._virtualBlockRowCnt - 1)), sheetIdx, true);
		                    sheet._virtualTopTBodyOffset.top = xlObj._getRowOffsetTop(sheet, pstartRIdx);
		                    rowIdxs = sheet._rowIdxColl.slice(sheet._rowIdxColl.indexOf(pstartRIdx), sheet._rowIdxColl.indexOf(pendRIdx) + 1);
		                    rangeData = xlObj.getRangeData({ property: prop, sheetIdx: sheetIdx, rowIdxs: rowIdxs, withRowIdx: true });
		                    rowHdrTBody.prepend(xlObj._renderRowHdr(rangeData.rowIdx, sheetIdx));
		                    contTBody.prepend(xlObj._renderData(rangeData, sheetIdx));
                            sheet._virtualRowIdx = rangeData.rowIdx.concat(sheet._virtualRowIdx);
		                    canRefresh = true;
		                }
		                if (!sheet._isVirtualEndReached) {
		                    xlObj._removeRange(sheet._virtualContBlockIdx === 1 ? 2 * sheet._virtualBlockRowCnt : 3 * sheet._virtualBlockRowCnt, sheet._virtualBlockRowCnt);
		                    sheet._virtualRowIdx.splice(sheet._virtualContBlockIdx === 1 ? 2 * sheet._virtualBlockRowCnt : 3 * sheet._virtualBlockRowCnt, sheet._virtualBlockRowCnt);
		                    sheet._virtualBottomTBodyHgt += height;
                            pstartRIdx = xlObj._getRowIdx((sheet._virtualContBlockIdx - 2) * sheet._virtualBlockRowCnt, sheetIdx, true);
                            pendRIdx = xlObj._getRowIdx((((sheet._virtualContBlockIdx - 2) * sheet._virtualBlockRowCnt) + (sheet._virtualBlockRowCnt - 1)), sheetIdx, true);
                            sheet._virtualTopTBodyOffset.top = xlObj._getRowOffsetTop(sheet, pstartRIdx);
		                }
						contHt = (xlObj._browserDetails.name === "msie" || xlObj._browserDetails.name === "edge") ? contTBody[0].getBoundingClientRect().height : window.getComputedStyle(contTBody[0],null).height;
		                sheet._virtualTopTBodyHgt = sheet._virtualTBodyHgt - (sheet._virtualBottomTBodyHgt + Math.floor(parseFloat(contHt)));
		                xlObj._refreshTBodiesHgt();
		                sheet._isVirtualEndReached = false;
		                if (xlObj.model.allowCellType)
							xlObj.XLCellType._rangeCellTypes(sheet.cellTypes, sheetIdx);
						if (xlObj.model.allowSparkline)
							xlObj.XLSparkline._refreshContentWithSparkline(sheetIdx);
		            }
		            else if (!sheet._isVirtualTopReached && (args.scrollTop + args.model.viewportsize) <= sheet._virtualTopTBodyOffset.top) {
		                xlObj._refreshViewport(args.scrollTop, sheetIdx);
		                canRefresh = isRefreshed = true;
		            }
		        }
		        if (!isRefreshed)
		            xlObj._refreshViewVar(args.scrollTop, null, sheetIdx);
		        sheet._scrollTop = args.scrollTop;
		    }
		    cont.scrollTop(args.scrollTop);
		    sheet._scrollTop = cont.scrollTop();
		    this._getFirstRow(sheetIdx);
		    if (xlObj.model.allowSelection && (sheet._isRowSelected || sheet._isColSelected || sheet._isSheetSelected)) {
		        xlObj.XLSelection.refreshSelection();
		        xlObj.XLDragFill.positionAutoFillElement();
		    }
		    if (canRefresh) {
		        if (xlObj.XLComment)
		            xlObj.XLComment._updateCmntArrowPos(xlObj._getContent(sheetIdx).find('.e-commentcell'));
		        clKeys = xlObj.getObjectKeys(xlObj._dataContainer.sheets[sheetIdx][0]);
		        xlObj._dupDetails = true;
		        for (i = 0, len = clKeys.length; i < len; i++) {
		            fitWidth = xlObj.XLEdit.getPropertyValue(0, clKeys[i], "isFitWidth");
		            if (!ej.isNullOrUndefined(fitWidth))
		                xlObj.XLResize._fitWidth(clKeys[i]);
		        }
		        xlObj._dupDetails = false;
		    }
		},
		
		_spreadVS: function(args) {
		    var pix, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), vScroll = this._vScroller(sheetIdx),
                content = xlObj._getJSSheetContent(sheetIdx).find(".e-spreadsheetcontentcontainer > .e-content"), count = ((args.scrollTop - sheet._scrollTop) / sheet.rowHeight);
            args["reachedEnd"] = Math.ceil(parseFloat(vScroll.element.find(".e-vhandle").css('top'))) + Math.ceil(parseFloat(vScroll.element.find(".e-vhandle").height())) >= vScroll.element.find(".e-vhandlespace").height() - 2;
            pix = args.scrollTop;
            if (xlObj.model.enableContextMenu)
                xlObj.XLCMenu.hideCMenu();
            if (xlObj.model.scrollSettings.scrollMode === ej.Spreadsheet.scrollMode.Infinite && args.scrollData.step > -1 && !xlObj._scrollReverse) {
                if (args.reachedEnd && sheet._bottomRow.idx + count <= sheet.rowCount) {
                    var hold = false, btnClk = false, proxy = this, interval;
                    if (!xlObj.isUndefined(args.scrollData.target) && xlObj._hasClass(args.scrollData.target, "e-vdown")) {
                        interval = setInterval(function (e) {
                            hold = true;
                            for (var i = 0; i < 20; i++)
                                proxy._scrollBottom(sheetIdx);
                            pix = (vScroll._scrollData.handleSpace - vScroll._scrollData.handle) * vScroll._scrollData.onePx;
                            proxy._refreshScroller(sheetIdx, "refresh", "vertical");
                            vScroll.element.find(".e-vhandle").css("top", (vScroll._scrollData.handleSpace - (vScroll._scrollData.handle)));
                            vScroll.scroll(pix);
                            clearInterval(interval);
                            return;
                        }, 1000);
                        if (xlObj._browserDetails.name === "msie" && xlObj._browserDetails.version === "8.0") {
                            vScroll.element.find(".e-vdown")[0].attachEvent("onmouseup", function (e) {
                                clearInterval(interval);
                                return;
                            });
                            document.attachEvent("onmouseup", function (e) {
                                clearInterval(interval);
                                return;
                            });
                        }
                        else {
                            vScroll.element.find(".e-vdown")[0].addEventListener("mouseup", function (e) {
                                clearInterval(interval);
                                return;
                            });
                            document.addEventListener("mouseup", function (e) {
                                clearInterval(interval);
                                return;
                            });
                        }
                        btnClk = true;
                    }
                    args.cancel = true;
                    if (!hold || !btnClk) {
                        this._scrollBottom(sheetIdx, (args.scrollTop - sheet._scrollTop)/20 + 1);
                        pix = (vScroll._scrollData.handleSpace - vScroll._scrollData.handle) * vScroll._scrollData.onePx;
                        proxy._refreshScroller(sheetIdx, "refresh", "vertical");
                        vScroll.element.find(".e-vhandle").css("top", (vScroll._scrollData.handleSpace - (vScroll._scrollData.handle)));
                        vScroll.value(pix);
                    }
                }
                else if (sheet._bottomRow.idx + count > sheet.rowCount - 1 && args.scrollTop >= sheet._scrollTop && args.scrollTop > 0 && sheet.rowCount < xlObj._maxRowCnt) {
                    this._scrollBottom(sheetIdx, (args.scrollTop - sheet._scrollTop)/20 + 1);
                    this._refreshScroller(sheetIdx, "refresh", "vertical");
                }
            }
            args.scrollTop = sheet._scrollTop = pix;
			xlObj._scrollReverse = false;
            content.scrollTop(args.scrollTop);
            sheet._scrollTop = content.scrollTop();
            this._getFirstRow(sheetIdx);
        },

        _scrollX: function (sheetIdx) {
            var i, len, xlObj = this.XLObj, hScroll = this._hScroller(sheetIdx), pix, colWtColl = [1], colgroup = xlObj._getContent(sheetIdx).find("colgroup"), sheet=xlObj.getSheet(sheetIdx);
            if (xlObj.model.scrollSettings.scrollMode === ej.Spreadsheet.scrollMode.Infinite)
                this._scrollRight(sheetIdx);
            hScroll.model.maximum = hScroll.model.maximum + sheet.columnWidth;
            hScroll._scrollData.scrollable = hScroll._scrollData.scrollable + sheet.columnWidth;
            this._refreshScroller(sheetIdx, "refresh", "horizontal");
            hScroll.element.find(".e-hhandle").css("left", (hScroll._scrollData.handleSpace - (hScroll._scrollData.handle + 1)));
            pix = (hScroll._scrollData.handleSpace - hScroll._scrollData.handle) * hScroll._scrollData.onePx;
            hScroll.value(pix);
            for (i = 0, len = xlObj.model.sheets[sheetIdx]._fCol; i < len; i++)
                colWtColl.push(colWtColl[colWtColl.length - 1] + $(colgroup.find('col')[i]).width());
            if (sheet._isFreezed && xlObj._isFrozen(xlObj.getFrozenColumns())) 
                hScroll.scroll(hScroll.value() + xlObj._getColWidth(sheet._fleftColIdx, sheetIdx), true);
            else
                xlObj._getJSSheetContent(sheetIdx).find(".e-spreadsheetcontentcontainer > .e-content").scrollLeft(pix, hScroll._scrollData.onePx);
            sheet._scrollLeft = pix;
            this._getFirstColumn(sheetIdx);
        },

        _scrollY: function (sheetIdx) {
            var i, xlObj = this.XLObj, vScroll = this._vScroller(sheetIdx), pix, rowHtColl = [1], rows = xlObj.getRows(sheetIdx)[1];
            if (xlObj.model.scrollSettings.scrollMode === ej.Spreadsheet.scrollMode.Infinite)
                this._scrollBottom(sheetIdx);
            vScroll.model.maximum = vScroll.model.maximum + xlObj.model.rowHeight;
            vScroll._scrollData.scrollable = vScroll._scrollData.scrollable + xlObj.model.rowHeight;
            this._refreshScroller(sheetIdx, "refresh", "vertical");
            vScroll.element.find(".e-vhandle").css("top", (vScroll._scrollData.handleSpace - (vScroll._scrollData.handle + 1)));
            pix = (vScroll._scrollData.handleSpace - vScroll._scrollData.handle) * vScroll._scrollData.onePx;
            vScroll.value(pix);
            for (i = 0, len = xlObj.model.sheets[sheetIdx]._fRow; i < len; i++)
                rowHtColl.push(rowHtColl[rowHtColl.length - 1] + $(rows[i]).height());
            xlObj._getJSSheetContent(sheetIdx).find(".e-spreadsheetcontentcontainer > .e-content").scrollTop(pix, vScroll._scrollData.onePx);
            this._getFirstRow(sheetIdx);
        },

        _getFirstRow: function (sheetIdx) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx), top, topIdx, bottomIdx, rowHtColl = sheet._rowHeightCollection;
            top = xlObj._getContent(sheetIdx).find(".e-content").scrollTop();
            topIdx = xlObj._getIdxWithOffset(top, null, true, null, sheetIdx).rowIdx;
            sheet._topRow = { idx: topIdx, value: rowHtColl[topIdx] };
            bottomIdx = xlObj._getIdxWithOffset(top + sheet._vPortHgt, null, true, null, sheetIdx).rowIdx || sheet.rowCount - 1;
            sheet._bottomRow = { idx: bottomIdx, value: rowHtColl[bottomIdx] };
            sheet.topLeftCell = xlObj.getAlphaRange(sheet._topRow.idx, sheet._leftCol.idx);
        },

        _getFirstColumn: function (sheetIdx) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx), left, leftIdx, rightIdx, colWtColl = sheet._colWidthCollection;
            left = xlObj._getContent(sheetIdx).find(".e-content").scrollLeft();
            leftIdx = xlObj._getIdxWithOffset(null, left, true, null, sheetIdx).colIdx;
            sheet._leftCol = { idx: leftIdx, value: colWtColl[leftIdx] };
            rightIdx = xlObj._getIdxWithOffset(null, left + sheet._vPortWth, true, null, sheetIdx).colIdx || sheet.colCount - 1;
            sheet._rightCol = { idx: rightIdx, value: colWtColl[rightIdx] };
            sheet.topLeftCell = xlObj.getAlphaRange(sheet._topRow.idx, sheet._leftCol.idx);
        },

        scrollToCell: function (addr) {
            var rowhgt, colWdth, frowDiff = 0, fcolDiff = 0, xlObj = this.XLObj, range = xlObj.getRangeIndices(addr), sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx);

            if (range[0] > sheet.rowCount)
                rowhgt = xlObj._getRowOffsetBottom(sheet.rowCount - 1, sheetIdx) + ((range[0] - sheet.rowCount) * sheet.rowHeight);
            else
                rowhgt = xlObj._getRowOffsetBottom(range[0] - 1, sheetIdx);

            if (range[1] > sheet.colCount)
                colWdth = xlObj._getWidth(0, sheet.colCount - 1) + ((range[1] - sheet.colCount) * sheet.columnWidth);
            else
                colWdth = xlObj._getWidth(0, range[1] - 1);

            if (xlObj._isFrozen(sheet.frozenRows))
                frowDiff = xlObj._getRowOffsetTop(sheet, sheet._frozenRows - 1);

            if (xlObj._isFrozen(sheet.frozenColumns))
                fcolDiff = xlObj._getColOffsetLeft(sheet, sheet._frozenColumns - 1);

            xlObj._scrollContent({ x: (colWdth ? colWdth : 0) - sheet._scrollLeft - fcolDiff, y: (rowhgt ? rowhgt : 0) - sheet._scrollTop - frowDiff });
        },

        _scrollSelectedPosition: function (sheetIdx, aCell) {
            if (this.XLObj._isExport)
                return;
            var leftPx, topPx, buffHeight = 0, xlObj = this.XLObj, hScroll = this._hScroller(sheetIdx), vScroll = this._vScroller(sheetIdx), actCellInfo = xlObj._getCellInfo(aCell), sheet = xlObj.getSheet(sheetIdx), content = xlObj._getJSSheetContent(sheetIdx).find(".e-spreadsheetcontentcontainer > .e-content"),
            dupDetails = xlObj._dupDetails, vReachedEnd = (Math.ceil(parseFloat(vScroll.element.find(".e-vhandle").css('top'))) + vScroll._scrollData.handle) >= (vScroll._scrollData.handleSpace), hReachedEnd = (Math.ceil(parseFloat(hScroll.element.find(".e-hhandle").css('left'))) + hScroll._scrollData.handle) >= (hScroll._scrollData.handleSpace);
            if (!xlObj.isUndefined(hScroll)) {
                if ((parseInt(actCellInfo.width) + (actCellInfo.left - content.offset().left)) > content.width())
                {
                    leftPx = actCellInfo.left - (hScroll._scrollData.handleSpace + hScroll.model.buttonSize);
                    if (leftPx < 0)
                        hScroll.scroll(0);
                    else {
                        hReachedEnd && (xlObj._scrollReverse = true);
                        if ((((parseInt(actCellInfo.width) + actCellInfo.left) > (hScroll._scrollData.handleSpace + (hScroll.model.buttonSize * 2))) || (actCellInfo.left - content.offset().left) <= 0) && leftPx != 0)
                            hScroll.scroll((actCellInfo.left + actCellInfo.width + 1) - (hScroll._scrollData.handleSpace + (hScroll.model.buttonSize * 2)));
                        xlObj._scrollReverse = false;
                    }
                } 
            }
            if (!xlObj.isUndefined(vScroll)) {
                if ((((parseInt(actCellInfo.height) + (actCellInfo.top - content.offset().top)) > content.height()) || ((actCellInfo.top - content.offset().top) <= 0)) && (aCell.rowIndex < sheet._topRow.idx || aCell.rowIndex > sheet._bottomRow.idx)) {
                    if (!aCell.rowIndex < sheet._bottomRow.idx && aCell.rowIndex < sheet.rowCount - 1)
                        buffHeight = actCellInfo.height;
                    topPx = actCellInfo.top + buffHeight - (vScroll._scrollData.handleSpace + vScroll.model.buttonSize);
                    if (topPx < 0)
                        vScroll.scroll(0);
                    else {
                        vReachedEnd && (xlObj._scrollReverse = true);
                        vScroll.scroll((actCellInfo.top + actCellInfo.height + 1) - (vScroll._scrollData.handleSpace + (vScroll.model.buttonSize * 2)));
                        xlObj._scrollReverse = false;
                    }
                }
            }
            xlObj._dupDetails = dupDetails;
        },

        //Infinite Scrolling JS	
        _rowTemplate: function (sheetIdx, value) {
            var i, len, rowCls, trRData, tdCell = "", xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx);
            for (i = 0, len = xlObj.model.sheets[sheetIdx].colCount; i < len; i++) {
                rowCls = "e-rowcell";
                !sheet.showGridlines && (rowCls = rowCls.concat(" e-hborder"));
                if (sheet._hiddenFreezeCols.indexOf(i) > -1)
                    rowCls += " e-fcol-hide";
                tdCell += String.format("<td class=\"{0}\" style=\"{2}\"  >{1}</td>", rowCls, "");
            }
            trRData = String.format("<tr style='{0}' idx=\"{1}\">" + tdCell + "</tr>", "height:" + xlObj.model.rowHeight + "px;", value - 1);
            return trRData;
        },

        _rowHeaderTemplate: function (value, height) {
            var tdRHdrCData, trRHdrData, height = height ? height : this.XLObj.model.rowHeight;
            tdRHdrCData = String.format("<td class=\"{0}\"  >{1}</td>", "e-rowheader", value);
            trRHdrData = String.format("<tr style='{0}' idx=\"{1}\">" + tdRHdrCData + "</tr>", "height:" + height + "px;", value - 1);
            return trRHdrData;
        },

        _columnTemplate: function (rowIndex) {
            var rowCls = "e-rowcell e-wrapword", tdCData, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex();
            !xlObj.getSheet(sheetIdx).showGridlines && (rowCls = rowCls.concat(" e-hborder"));
            tdCData = String.format("<td class=\"{0}\" style=\"{2}\" >{1}</td>", rowCls, "");
            return tdCData;
        },

        _colGroupTemplate: function (sheetIdx, width) {
            var width = width ? width : this.XLObj.getSheet(sheetIdx).columnWidth;
            var tdCData = String.format("<col style = '{0}'></col>", "width:" + width + "px;");
            return tdCData;
        },

        _columnHeaderTemplate: function (colCnt, sheetIdx) {
            var divcell, divCData, tdCData;
            divcell = this.XLObj._generateHeaderText(colCnt);
            divCData = String.format("<div class = \"{0}\" > {1}</div>", "e-headercelldiv", divcell);
            tdCData = String.format("<th class=\"{0}\"  >{1}</th>", "e-headercell", divCData);
            return tdCData;
        },

        _createNewRow: function (sheetIdx, rowIdx, colIdx, status) {
            var tbody, trow, trRData, tbodyRHdr, thdr, xlObj = this.XLObj, isVirtualScroll = xlObj.model.scrollSettings.allowVirtualScrolling, xlSelc = xlObj.XLSelection, sheet = xlObj.getSheet(sheetIdx), rowElemIdx;
            if (!isVirtualScroll) {
                tbody = xlObj._getContent(sheetIdx).find("tbody")[0];
                tbodyRHdr = xlObj._getJSSheetRowHeaderContent(sheetIdx).find("tbody")[0];
            }
            else {
                tbody = xlObj._getContent(sheetIdx).find("tbody")[1];
                tbodyRHdr = xlObj._getJSSheetRowHeaderContent(sheetIdx).find("tbody")[1];
            }
            trRData = this._rowTemplate(sheetIdx, parseInt(tbodyRHdr.lastChild.textContent) + 1);
            if (rowIdx === -1 || (colIdx > -1 && rowIdx > -1 && status === "shift")) {
                $(tbodyRHdr).append(this._rowHeaderTemplate(parseInt(tbodyRHdr.lastChild.textContent) + 1));
                $(tbody).append(trRData);
                if (status == "shift") {
                    $(tbody).find("tr:last td:last").remove();
                    rowElemIdx = xlObj._getRowIdx(rowIdx)
                    $(tbody).find("tr: eq(' + rowElemIdx + ') td:eq(' + (colIdx - 1) + ')").after(this._columnTemplate());
                }
            }
            else {
                trow = tbody.insertRow(rowIdx);
                $(trow).height(xlObj.model.rowHeight);
                $(trow).append($(trRData)[0].innerHTML);
                trow = tbodyRHdr.insertRow(rowIdx);
                $(trow).height(xlObj.model.rowHeight);
                $(trow).append("<td class='e-rowheader'></td>");
            }
            sheet.rowCount = xlObj.model.sheets[sheetIdx].rowCount + 1;
            sheet.rowsHeightCollection.push(xlObj.model.rowHeight);
            if (rowIdx > -1) {
				thdr = $(tbodyRHdr).find('td');
				for (var i = 0, len = thdr.length; i < len; i++)
					$(thdr[i]).text(i + 1);
				xlObj.XLScroll._getRowHeights(sheetIdx, rowIdx + 1 );
			}
            sheet._rowHeightCollection.push(sheet._rowHeightCollection[sheet._rowHeightCollection.length - 1] + xlObj.model.rowHeight);
			if (xlObj.model.allowSelection && (sheet._isColSelected || sheet._isSheetSelected))
			    xlSelc.refreshSelection();
			xlObj._refreshRows(sheetIdx);
        },

        _createNewColumn: function (sheetIdx, startCell, endCell, status) {
            var i, j, len, xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx), xlSelc = xlObj.XLSelection, tbody, tbodyCHdr, colgrp, hdrcolgrp, colCnt, tdColgrp, tdRData, tdCHdrData, value,
            thdr, field, $outerDiv, $innerDiv, fIndex, fApplied = false, fRow, tabRange, colWtColl = sheet.columnsWidthCollection, isVScroll = xlObj.model.scrollSettings.allowVirtualScrolling, rowElemIdx;
            tbody = xlObj._getContTBody(sheetIdx)[0],
            tbodyCHdr = xlObj._getJSSheetHeader(sheetIdx).find("tr")[0];
            colgrp = xlObj._getJSSheetContent(sheetIdx).find(".e-spreadsheetcontentcontainer colgroup");
            hdrcolgrp = xlObj._getJSSheetHeader(sheetIdx).find("colgroup");
            colCnt = sheet.colCount;
            tabRange = sheet.filterSettings.tableRange;
            for (i = 0, len = tabRange.length; i < len; i++) {
                fIndex = tabRange[i].multifilterIdx;
                if ((startCell.colIndex > fIndex[0]) && (endCell.colIndex < fIndex[fIndex.length - 1])) {
                    fApplied = true;
                    fRow = tabRange[i].startRow - 1;
                    tabRange = tabRange[i];
                    break;
                }
            }
            if (startCell.colIndex === -1 || (startCell.colIndex > -1 && startCell.rowIndex > -1 && status === "shift")) {
                if (startCell.colIndex === -1 && status === "insert") {
                    tdCHdrData = this._columnHeaderTemplate(colCnt + 1, sheetIdx);
                    $(tbodyCHdr).append(tdCHdrData);
                    tdColgrp = this._colGroupTemplate(sheetIdx);
                    hdrcolgrp.append(tdColgrp);
                    for (i = 0, len = tbody.rows.length; i < len; i++) {
                        tdRData = this._columnTemplate(i);
                        $(tbody.rows[xlObj._getRowIdx(i, sheetIdx, false, true)]).append(tdRData);
                    }
                    colgrp.append(tdColgrp);
                }
                if (status === "shift") {
                    var x = colCnt;
                    for (i = startCell.colIndex; i <= endCell.colIndex; i++) {
                        tdCHdrData = this._columnHeaderTemplate(x + 1, sheetIdx);
                        $(tbodyCHdr).append(tdCHdrData);
                        tdColgrp = this._colGroupTemplate(sheetIdx);
                        hdrcolgrp.append(tdColgrp);
                        colgrp.append(tdColgrp);
                        x = x + 1;
                    }
                    for (i = 0, len = tbody.rows.length; i < len ; i++) 
                        for (j = startCell.colIndex; j <= endCell.colIndex; j++) {
                            tdRData = this._columnTemplate(i);
                            $(tbody.rows[xlObj._getRowIdx(i)]).append(tdRData);
                        }
                    if (xlObj._insDelStatus.indexOf("insert") > -1)
                        for (i = startCell.rowIndex; i <= endCell.rowIndex; i++) {
                            for (j = startCell.colIndex; j <= endCell.colIndex; j++) {
                                $(tbody).find('tr:eq(' + xlObj._getRowIdx(i) + ') td:last').remove();
                                tdRData = this._columnTemplate(i);
                                $(tbody).find("tr").eq(xlObj._getRowIdx(i)).find('td:eq(' + j + ')').before(tdRData);
                                if (fApplied && i === fRow)
                                    xlObj.model.allowFiltering && xlObj.XLFilter._insertFilterIcon(i, j, tabRange, fRow, fApplied);
                            }
                        }
                    else
                        for (i = startCell.rowIndex; i <= endCell.rowIndex; i++) {
                            for (j = endCell.colIndex; j >= startCell.colIndex; j--) {
                                $(tbody).find('tr:eq(' + xlObj._getRowIdx(i) + ') td:eq(' + j + ')').remove();
                                tdRData = this._columnTemplate(i);
                                $(tbody).find('tr:eq(' + xlObj._getRowIdx(i) + ')').append(tdRData);
                                if (fApplied && i === fRow)
                                    xlObj.model.allowFiltering && xlObj.XLFilter._insertFilterIcon(i, j, tabRange, fRow, fApplied);
                            }
                        }
                }
                sheet.colCount = sheet.colCount + 1;
                sheet.columnsWidthCollection.push(sheet.columnWidth);
            }
            else {
                if (sheet._isTemplate && (startCell.colIndex < sheet._templateColCount || endCell.colIndex < sheet._templateColCount))
                    return;
                //insert a column in particular position
                var fiCol, colWidthColl = $.extend(true, [], xlObj.getSheet(sheetIdx).columnsWidthCollection);
                if (xlObj._insDelStatus.indexOf("insert") > -1) {
                    fiCol = colWidthColl.splice(0, startCell.colIndex);
                    for (i = startCell.colIndex; i <= endCell.colIndex; i++) {
                        tdCHdrData = this._columnHeaderTemplate(i + 1, sheetIdx);
                        $(tbodyCHdr).find('th:eq(' + i + ')').before(tdCHdrData);
                        tdColgrp = this._colGroupTemplate(sheetIdx);
                        fiCol.push(sheet.columnWidth);
                        hdrcolgrp.find('col:eq(' + i + ')').before(tdColgrp);
                        colgrp.find('col:eq(' + i + ')').before(tdColgrp);      
						sheet.colCount = sheet.colCount + 1;
                    }
                    ej.merge(fiCol, colWidthColl);
                    sheet.columnsWidthCollection = fiCol;
                    for (i = 0, len = tbody.rows.length; i < len  ; i++) {
                        for (j = startCell.colIndex; j <= endCell.colIndex; j++) {
                            tdRData = this._columnTemplate(i);
                            $(tbody.rows[xlObj._getRowIdx(i)]).find('td:eq(' + j + ')').before(tdRData);
                            if(fApplied && (i === fRow))
                                xlObj.model.allowFiltering && xlObj.XLFilter._insertFilterIcon(i, j, tabRange, fRow, fApplied);
                        }
                    }
                }
                else {
                    fiCol = colWidthColl.splice(0, startCell.colIndex);
                    for (i = endCell.colIndex; i >= startCell.colIndex; i--) {
                        $(tbodyCHdr).find('th:eq(' + i + ')').remove();
                        hdrcolgrp.find('col:eq(' + i + ')').remove();
                        colgrp.find('col:eq(' + i + ')').remove();
						sheet.colCount = sheet.colCount - 1;
                    }
                    colWidthColl.splice(0, (endCell.colIndex - startCell.colIndex) + 1);
                    ej.merge(fiCol, colWidthColl);
                    sheet.columnsWidthCollection = fiCol;
                    for (i = 0, len = tbody.rows.length; i < len; i++)
                        for (j = endCell.colIndex; j >= startCell.colIndex; j--)
                            $(tbody.rows[xlObj._getRowIdx(i)]).find('td:eq(' + j + ')').remove();
                }
                thdr = $(tbodyCHdr).find('th>.e-headercelldiv');
                for (i = 0, len = thdr.length; i < len ; i++)
                    $(thdr[i]).text(xlObj._generateHeaderText(i + 1));
            }
            field = $.trim($(tdCHdrData).text());
            value = $(tdRData).text();
            sheet.columns.push({
                field: field,
                type: value != null ? (value.getDay ? "date" : typeof (value)) : null,
                width: $(tdRData).width()
            });           
            xlObj.XLScroll._getColWidths(sheetIdx, (startCell.colIndex > -1) ? startCell.colIndex : sheet.colCount - 2); // 2 for delete or insert
			if (xlObj.model.allowSelection && (sheet._isRowSelected || sheet._isSheetSelected))
			    xlSelc.refreshSelection();
			xlObj._refreshTemplates(sheetIdx, true);
        },

        _insertColHeaders: function (sheetIdx, colCnt, tbodyCHdr) {
            var tdCHdrData = this._columnHeaderTemplate(colCnt + 1, sheetIdx), tdColgrp;
            $(tbodyCHdr).append(tdCHdrData);
            tdColgrp = this._colGroupTemplate(sheetIdx);
            $(tbodyCHdr.parentNode.previousSibling).append(tdColgrp);
        },

        _scrollBottom: function (sheetIdx, count) {
            var sheet = this.XLObj.getSheet(sheetIdx), key, cIdx;
			if(!count){
				this._createNewRow(sheetIdx, -1, -1, "insert");
				for (key in sheet._columnStyles) {
					cIdx = parseInt(key);
					this.XLObj.XLEdit._updateDataContainer({ rowIndex: sheet.rowCount - 1, colIndex: cIdx }, { dataObj: sheet._columnStyles[key] });
				}
			}
			else
				this._createRows(sheet.rowCount - 1, sheet.rowCount + count, sheetIdx);
        },
		
		_createRows: function (stRowIdx, rowCount, sheetIdx) {
            var xlObj = this.XLObj, sheetIdx = sheetIdx || xlObj.getActiveSheetIndex(), rhTdCellData, rhTrRow, sheet = xlObj.getSheet(sheetIdx), contTab, hdrTab, newContColl, newHdrColl, rhTrRow = "", data = [], sheetElem = xlObj.getSheetElement(sheetIdx);
            for (var i = stRowIdx, len = rowCount; i < len; i++)
                this._createNewRow(sheetIdx, -1, -1, "insert");

        },

        _scrollRight: function (sheetIdx) {
            var startCell = { rowIndex: -1, colIndex: -1 }, sheet, rIdx, key;
            this._createNewColumn(sheetIdx, startCell, startCell, "insert");

            sheet = this.XLObj.getSheet(sheetIdx);
            for (key in sheet._rowStyles) {
                rIdx = parseInt(key);
                this.XLObj.XLEdit._updateDataContainer({ rowIndex: rIdx, colIndex: sheet.colCount - 1 }, { dataObj: sheet._rowStyles[key] });
            }
        },

        _refreshRowCol: function (range, sheetIdx) {
            sheetIdx = this.XLObj._getSheetIndex(sheetIdx);
            var i, sheet = this.XLObj.getSheet(sheetIdx), refreshScroll = false;
            if (sheet.colCount < (range[3] + 1)) {
                i = range[3] - (sheet.colCount - 1);
                while (i--)
                    this._scrollRight(sheetIdx);
                refreshScroll = true;
            }
            if (sheet.rowCount < (range[2] + 1)) {
                i = range[2] - (sheet.rowCount - 1);
                while (i--)
                    this._scrollBottom(sheetIdx);
                refreshScroll = true;
            }
            refreshScroll && this._refreshScroller(sheetIdx, "refresh", "all");
        }
    };

})(jQuery, Syncfusion);