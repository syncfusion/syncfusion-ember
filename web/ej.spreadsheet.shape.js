(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.shape = function (obj) {
        this.XLObj = obj;
        this._imgX = 0;
        this._imgY = 0;
        this._imgOffsetleft = 0;
        this._imgOffsetTop = 0;
        this._shapeType = "img";
        this._shapeROStart = false;
        this._shapeRSStart = false;
        this._imgRSWStart = false;
        this._imgRSEStart = false;
        this._imgRSNStart = false;
        this._imgRSSStart = false;
        this._changePicture = false;
        this._picCellIdx = {};
        this._insertShape = false;
    };

    ej.spreadsheetFeatures.shape.prototype = {
        _insertPicture: function (e) {
            var xlObj = this.XLObj, imgData = xlObj._browserDetails.name === "msie" && parseInt(xlObj._browserDetails.version) < 10 ? e.responseText : e.xhr.response;
            if (imgData.startsWith("Invalid"))
                xlObj._showAlertDlg("Alert", "ImageValAlert");
            else {
                var sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), left, top, imgElem, cellIdx;
                if (this._changePicture) 
                    this.changePicture(null, imgData);
                else {
                    var activeCell = xlObj.getActiveCell(), picSettings = xlObj.model.pictureSettings;
                    var height = picSettings.height, width = picSettings.width;
                    if (ej.isNullOrUndefined(activeCell)) {
                        imgElem = xlObj.element.find(".e-ss-activeimg").get(0);
                        cellIdx = this._getCellIndexFromOffset(imgElem.offsetTop, imgElem.offsetLeft);
                    }
                    left = sheet._colWidthCollection[activeCell.colIndex];
                    top = sheet._rowHeightCollection[activeCell.rowIndex];
                    this._insertShape = true;
                    this._createPicture(sheetIdx, activeCell, imgData, top, left, width, height);
                }
            }
        },
        changePicture: function (pictureId, url) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), imgElem, left, top, cellIdx, shapeMngr, shapeObj, details;
            imgElem = pictureId ? $('#' + pictureId).get(0) : xlObj.getSheetElement(sheetIdx).find(".e-ss-activeimg").get(0);
            left = imgElem.offsetLeft;
            top = imgElem.offsetTop;
            cellIdx = this._getCellIndexFromOffset(top, left);
            shapeMngr = sheet.shapeMngr;
            $(imgElem).css('background-image', "url('" + url + "')");
            shapeObj = shapeMngr.picture[imgElem.id];
            details = { sheetIndex: sheetIdx, reqType: "shape", shapeType: "picture", action: "changepicture", id: $(imgElem).attr("id"), cell: cellIdx, prev: { img: shapeMngr.sharedPics[shapeObj.data], data: shapeObj.data, pcIdx: imgElem.id }, cur: { img: url, pcIdx: imgElem.id } };
            if (shapeMngr.sharedPics.indexOf(url) === -1)
                shapeMngr.sharedPics.push(url);
            shapeObj.data = shapeMngr.sharedPics.indexOf(url);
            details.cur.data = shapeObj.data;
            this._changePicture = false;
            xlObj.setSheetFocus();
            xlObj._completeAction(details);
            xlObj._trigActionComplete(details);
        },
        setPicture: function (range, url, width, height, top, left) {
            var xlObj = this.XLObj, rowIdx, colIdx, rng, id;
            if (!xlObj.model.pictureSettings.allowPictures || xlObj.model.isReadOnly)
                return;
            range = xlObj._getRangeArgs(range, "object");
            rowIdx = range[0];
            colIdx = range[1];
			if (xlObj.model.allowLockCell && xlObj._isCellProtected(rowIdx, colIdx, false))
                return;
            var sheetIdx = xlObj.getActiveSheetIndex(), activeCell, picSettings = xlObj.model.pictureSettings;
            height = height ? height : picSettings.height;
            width = width ? width : picSettings.width;
            if(xlObj._isRowViewable(sheetIdx, rowIdx)){
                activeCell = xlObj.getCell(rowIdx, colIdx)[0];
                top = top ? top : activeCell.offsetTop;
                left = left ? left : activeCell.offsetLeft;
            }
            else {
                top = top ? top : 0;
                left = left ? left : 0;
            }
            return this._createPicture(sheetIdx, { rowIndex: rowIdx, colIndex: colIdx }, url, top, left, width, height);
        },

        resetPicture: function (pictureId, action) {
            var xlObj = this.XLObj, elem, regx, details, imgStyle
            elem = pictureId ? $('#' + pictureId) : xlObj.element.find(".e-ss-activeimg"), regx = new RegExp("\\b" + "e-shapebdr" + ".*?\\b", "g");
            details = { sheetIndex: xlObj.getActiveSheetIndex(), reqType: "shape", shapeType: "picture", action: "resetpicture", id: $(elem).attr("id"), actionType: action };
            xlObj._dupDetails = true;
            if (!ej.isNullOrUndefined(elem[0].className.match(regx))) {
                imgStyle = xlObj.XLShape._getImgStyleFromHashCode(elem[0].className.match(regx)[0]);
            }
            details.prev = imgStyle ? { bcolor: imgStyle["border-color"], bstyle: imgStyle["border-style"], bwidth: imgStyle["border-width"] } : {};
            elem[0].className = elem[0].className.replace(regx, "");
            details.cur = { bcolor: elem.css("border-color"), bstyle: elem.css("border-style"), bwidth: elem.css("border-width") };
            if (action != "resetpicture") {
                details.prev.width = elem.css("width");
                details.prev.height = elem.css("height");
                elem.css({ width: xlObj.model.pictureSettings.width, height: xlObj.model.pictureSettings.height });
                details.cur.width = elem.css("width");
                details.cur.height = elem.css("height");
                xlObj.XLShape._updateShapeObj(elem[0]);
                xlObj._hasClass(elem[0], 'e-ss-activeimg') && xlObj.XLRibbon._formatTabUpdate();
            }
            xlObj._dupDetails = false;
            xlObj._completeAction(details);
            xlObj._trigActionComplete(details);
        },

        _createPicture: function (sheetIdx, activeCell, imgData, top, left, width, height, cnt, bcolor, bstyle, bwidth, pic) {
            bcolor = bcolor ? bcolor : "transparent";
            bstyle = bstyle ? bstyle : "solid";
            bwidth = bwidth ? bwidth : "1px";
            var xlObj = this.XLObj, evtArgs, sheet = xlObj.getSheet(sheetIdx), args = { sheetIndex: sheetIdx, targetCell: activeCell, top: top, left: left,
                width: width, height: height, bcolor: bcolor, bstyle: bstyle, bwidth: bwidth, reqType: "picture", add: "add" }, id;
            evtArgs = { sheetIndex: args.sheetIndex, targetCell: args.targetCell, top: args.top, left: args.left, width: args.width, height: args.height, bcolor: args.bcolor, bstyle: args.bstyle, bwidth: args.bwidth, reqType: "picture", action: "add" };
            if (xlObj._trigActionBegin(evtArgs))
                return;
            !sheet._isImported && ( this._insertShape = true );
			top = args.top;
            left = args.left;
            width = args.width;
            height = args.height;
            cnt = ej.isNullOrUndefined(cnt) ? (xlObj.model.allowCharts && xlObj.XLChart._shapeCnt) : cnt;
            xlObj._isExport && (pic.cnt = cnt);
            id = xlObj._id + "_picture" + cnt;
            var $elem, details;
                activeCell = this._getCellIndexFromOffset(top, left, sheetIdx);            
            var rowIdx = activeCell.rowIndex, colIdx = activeCell.colIndex;
            if(!xlObj._isUndoRedo && xlObj.model.allowCharts)
				xlObj.XLChart._shapeCnt++;
            this._updateShapeMngr(activeCell, { "picture": { data: imgData, id: id, height: height, width: width, left: left, top: top, rowIndex: rowIdx, colIndex: colIdx, bwidth: bwidth, bcolor: bcolor, bstyle: bstyle } }, "picture");
            if (!xlObj._isExport)
                this._refreshPictureElement({top: top, left: left, width: width, height: height, bcolor: bcolor, bstyle: bstyle, bwidth: bwidth, imgData: imgData, cnt: cnt, sheetIdx: sheetIdx});
            xlObj.setSheetFocus();
            if ((!sheet._isImported || sheet._isLoaded) && !xlObj._isUndoRedo && !xlObj._isPaste && !xlObj.XLClipboard._isShape && !xlObj._isExport) {
                details = { sheetIndex: sheetIdx, reqType: "shape", shapeType: "picture", action: "create", id: id, actCell: activeCell, img: imgData, cnt: cnt };
                details.position = { top: top, left: left, height: height, width: width };
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details)
            }
            xlObj.model.showRibbon && xlObj.XLRibbon._formatTabUpdate();
            return id;
        },

        _refreshPictureElement: function (cellObj) {
            var xlObj = this.XLObj, $elem;
            xlObj._getJSSheetContent(cellObj.sheetIdx).find(".e-spreadsheetcontentcontainer > .e-content").append(ej.buildTag("div.e-ss-object", "", "", { id: xlObj._id + "_picture" + cellObj.cnt }));
            $elem = $("#" + xlObj._id + "_picture" + cellObj.cnt);
            $elem.data("parentID", xlObj._id);
            $elem.css({ 'background-image': "url('" + cellObj.imgData + "')", height: cellObj.height, width: cellObj.width, left: cellObj.left, top: cellObj.top });
            var borderCss = cellObj.bwidth + " " + cellObj.bstyle + " " + cellObj.bcolor;
            var hashCode = this._getImgBorderHashCode({ "border-color": cellObj.bcolor, "border-style": cellObj.bstyle, "border-width": cellObj.bwidth });
            if (xlObj.model.allowCellFormatting)
                xlObj.XLFormat._writeCssRules(hashCode, xlObj.XLFormat._getCssPropertyAsString({ "border": { "left": borderCss, "right": borderCss, "top": borderCss, "bottom": borderCss } }));
            $elem.addClass(hashCode);
            this._selectImg($elem);
        },

        _shapeMouseDown: function (e) {
            e.preventDefault();
            var xlObj = this.XLObj, actElemId = document.activeElement.id;
            if (xlObj._isTouchEvt)
                this._imgMouseMove(e);
            if (actElemId.indexOf("PictureHeight") > -1 || actElemId.indexOf("PictureWidth") > -1)
                xlObj.setSheetFocus();
            var prop, id = e.target.id, $trgt = $(e.target), imgElem = $trgt.get(0), left = imgElem.offsetLeft, top = imgElem.offsetTop, xy = xlObj._setXY(e);
            this._selectImg($trgt);
            this._picCellIdx = this._getCellIndexFromOffset(top, left);
            this._imgOffsetleft = left;
            this._imgOffsetTop = top;
            this._imgX = xy[0];
            this._imgY = xy[1];
            this._shapeType = id.indexOf("chart") > -1 ? "chart" : "img";           
            this._shapeROStart = true;
            if ($trgt.css("cursor") === "move")
                this._shapeROStart = true;
            else if ($trgt.css("cursor") === "col-resize" || $trgt.css("cursor") === "row-resize") {
                this._shapeRSStart = true;
                xlObj._getContent(xlObj.getActiveSheetIndex()).find(".e-ss-imgvisual").css({ left: left, top: top, height: $trgt.height(), width: $trgt.width() });
            }
            if (this._shapeType === "chart") {
                prop = xlObj.XLChart._getShapeObj(id, this._shapeType);
                if (xlObj.getActiveSheetIndex() === prop.dataSheetIdx && !prop.isChartSeries)
                    xlObj.XLChart._focusChartRange(prop.xAxis.range, prop.yAxis.range, prop.legend.range);
            }            
			if(xlObj.model.enableContextMenu && xlObj.XLCMenu._isMenuOpened)
				xlObj.XLCMenu.hideCMenu();
        },

        _imgKeyDown: function (e) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), $trgt = xlObj._getContent(sheetIdx).find(".e-ss-activeimg"), imgElem = $trgt.get(0);
            var left = imgElem.offsetLeft, top = imgElem.offsetTop, height, width;
            this._shapeType = $trgt[0].id.indexOf("chart") > -1 ? "chart" : "img";
            if($trgt[0].id.indexOf("_S") )
                this._shapeType = "sparkline";
            this._picCellIdx = this._getCellIndexFromOffset(top, left);
            if (!e.shiftKey && !e.ctrlKey) {
                switch (e.keyCode) {
                    case 39:
                        //right
                        e.preventDefault();
                        $trgt.css({ left: left + 2 });
                        this._updateShapeObj(imgElem);
                        break;
                    case 37:
                        //left
                        e.preventDefault();
                        if (left > 1)
                            $trgt.css({ left: left - 2 });
                        this._updateShapeObj(imgElem);
                        break;
                    case 38:
                        //up
                        e.preventDefault();
                        if (top > 1)
                            $trgt.css({ top: top - 2 });
                        this._updateShapeObj(imgElem);
                        break;
                    case 40:
                        //down
                        e.preventDefault();
                        $trgt.css({ top: top + 2 });
                        this._updateShapeObj(imgElem);
                        break;
                }
                this._onKeyscrollShape(sheetIdx, $trgt, e);
            } else if (e.shiftKey && !e.ctrlKey) {
                if (e.keyCode === 39 || e.keyCode === 38) { //right or up
                    e.preventDefault();
                    height = $trgt.height() + 2;
                    width = $trgt.width() + 2;
                    if (height < 400 && width < 600)
                        $trgt.css({ width: width, height: height });
                    this._updateShapeObj(imgElem);
                    xlObj.XLRibbon._formatTabUpdate();
                } else if (e.keyCode === 37 || e.keyCode === 40) { //left or down
                    e.preventDefault();
                    height = $trgt.height() - 2;
                    width = $trgt.width() - 2;
                    if (height > 40 && width > 60)
                        $trgt.css({ width: width, height: height });
                    this._updateShapeObj(imgElem);
                    xlObj.XLRibbon._formatTabUpdate();
                }
            }
            if (e.keyCode === 46) { //delete
                e.preventDefault();
                var changed = false;
                if (xlObj.XLClipboard._isShape) {
                    xlObj.XLClipboard._isShape = false;
                    changed = true;
                }
                this._deleteShape(sheetIdx, $trgt);
                (changed) && (xlObj.XLClipboard._isShape = true);
            }
        },

        _shapeMouseUp: function (e) {
            var xlObj = this.XLObj, args = {};
            if (xlObj._isExport)
                return;
            var cellIdx, touchend, chart = "chart", details, sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), $content = xlObj._getContent(sheetIdx), $actImg = $content.find(".e-ss-activeimg"), $visualImg = $content.find(".e-ss-imgvisual");
            var $trgt = $(e.target), imgElem = $trgt.get(0);
            if ($trgt.hasClass("e-ss-picture") || $trgt[0].id.indexOf(xlObj._id + "_picture") > -1)
                if(xlObj.model.showRibbon)
                xlObj.XLRibbon._formatTabUpdate();
			if(((imgElem.localName === "svg" || imgElem.localName === "rect") && imgElem && imgElem.id.indexOf("chart") < 0 ) || imgElem.localName === "path" || imgElem.localName === "circle")
				imgElem = $(imgElem).closest("div.e-sparkline")[0];
			else if($(imgElem).hasClass("e-sparkline"))
				imgElem = imgElem;
            if (imgElem && imgElem.id.indexOf(chart) > -1 && imgElem.id.indexOf("Ribbon") < 0)
                imgElem = (imgElem.id.indexOf('_svg') > -1) ? ($(imgElem).parents(".e-ss-object").get(0)) : imgElem;
            ($actImg.length < 1) && (this._shapeROStart = false);
            if (!(imgElem.id.indexOf("sparkline") >-1) && !(imgElem.className.indexOf('e-ss-imgvisual') > -1) && !(imgElem.className.indexOf('e-ss-object') > -1)) {
                if (this._shapeROStart)
                    imgElem = $actImg[0];
                if (this._shapeRSStart)
                    imgElem = $visualImg[0];
            }
            if (this._shapeROStart) {
                if (xlObj._isTouchEvt) {
                    touchend = xlObj._getOriginalEvt(e);
                    imgElem = document.elementFromPoint(touchend.clientX, touchend.clientY);
                }
                if (!xlObj._isUndoRedo) {
					if (parseInt($actImg.css("top")) !== imgElem.offsetTop || parseInt($actImg.css("left")) !== imgElem.offsetLeft) {
							details = { sheetIndex: sheetIdx, reqType: "shape", shapeType: "chart", action: "edit", actionType: "reorder", id: $($actImg).attr("id"), visualImg: $visualImg, trgt: $trgt };
							details.prev = { top: parseInt($actImg.css("top")), left: parseInt($actImg.css("left")), height: parseInt($actImg.css("height")), width: parseInt($actImg.css("width")) };
							details.cur = { top: imgElem.offsetTop, left: imgElem.offsetLeft, height: $trgt.height(), width: $trgt.width() };
							if ($actImg[0].id.indexOf(chart) > -1) {
								cellIdx = xlObj._getIdxWithOffset(details.cur.top, details.cur.left, true);
								sheet.shapeMngr[chart][$actImg[0].id]["rowIndex"] = cellIdx.rowIdx;
								sheet.shapeMngr[chart][$actImg[0].id]["colIndex"] = cellIdx.colIdx;
							}
							if(xlObj._checkIndicesInContainer(sheetIdx, this._picCellIdx.rowIndex, this._picCellIdx.colIndex)){
								details.obj = $.extend(true, {}, xlObj._dataContainer.sheets[sheetIdx][this._picCellIdx.rowIndex][this._picCellIdx.colIndex]);
								xlObj._completeAction(details);
								xlObj._trigActionComplete(details);
							}
						}
					}
					$actImg.css({ left: imgElem.offsetLeft, top: imgElem.offsetTop });
					this._updateShapeObj(imgElem);
					$visualImg.removeClass("e-ss-picture").hide();						
            } else if (this._shapeRSStart) {
                if (!xlObj._isUndoRedo) {
                    if (xlObj._isTouchEvt)
                        imgElem = $visualImg[0];
                    if (imgElem.className.indexOf("e-ss-imgvisual") < 0 && $visualImg.length > 0)
                        (this._shapeROStart) && (imgElem = $visualImg[0]);
                    $trgt = $(imgElem);
                    if ((parseInt($actImg.css("height")) !== $trgt.height() || parseInt($actImg.css("width")) !== $trgt.width()) && xlObj._checkIndicesInContainer(sheetIdx, this._picCellIdx.rowIndex, this._picCellIdx.colIndex)) {
                        details = { sheetIndex: sheetIdx, reqType: "shape", shapeType: "chart", action: "edit", actionType: "resize", id: $($actImg).attr("id"), visualImg: $visualImg, trgt: $trgt };
                        details.prev = { top: parseInt($actImg.css("top")), left: parseInt($actImg.css("left")), height: parseInt($actImg.css("height")), width: parseInt($actImg.css("width")) };
                        details.cur = { top: imgElem.offsetTop, left: imgElem.offsetLeft, height: $trgt.height(), width: $trgt.width() };
                        details.obj = $.extend(true, {}, xlObj._dataContainer.sheets[sheetIdx][this._picCellIdx.rowIndex][this._picCellIdx.colIndex]);
                        xlObj._completeAction(details);
                        xlObj._trigActionComplete(details);
                    }
                }
                if (details)
                    $actImg.css({ left: imgElem.offsetLeft, top: imgElem.offsetTop, height: $trgt.height(), width: $trgt.width() });
                this._updateShapeObj(imgElem);
                $visualImg.removeClass("e-ss-picture").hide();
                if (this._shapeType === "img" && xlObj.model.showRibbon)
                    xlObj.XLRibbon._formatTabUpdate();
                if (this._shapeType === chart) {
                    xlObj.XLChart.resizeChart($actImg.attr("id"), $trgt.height(), $trgt.width());
                    if (xlObj.model.showRibbon)
                        xlObj.XLRibbon._chartDesignTabUpdate($("#" + $actImg.attr("id")));
                }
                args.event = e;
                args.target = e.target;
                if (details && details.cur && details.prev) {
                    args.newHeight = details.cur.height;
                    args.newWidth = details.cur.width;
                    args.oldHeight = details.prev.height;
                    args.oldWidth = details.prev.width;
                }
                args.reqType = imgElem.id.indexOf(chart) > -1 ? "chart-resize" : "picture-resize";
                if (this.XLObj._trigger("resizeEnd", args)) {
                    this._refreshImgResizing();
                    this._shapeRSStart = false;
                    return;
                }
            }
            this._refreshImgResizing();
            this._shapeROStart = this._shapeRSStart = false;
        },

        _imgMouseMove: function (e) {
            var xlObj = this.XLObj, args = {};
            if (xlObj._getContent(xlObj.getActiveSheetIndex()).find(".e-ss-activeimg").length) {
                e.preventDefault();
                var sheetIdx = xlObj.getActiveSheetIndex(), $content = xlObj._getContent(sheetIdx), $actImg = $content.find(".e-ss-activeimg"), $visualImg = $content.find(".e-ss-imgvisual");
                var imgElem = $actImg.get(0), location = imgElem.getBoundingClientRect(), xy = xlObj._setXY(e), x = xy[0], y = xy[1], extra, left, top;
                if (this._shapeROStart) {
                    if (this.XLObj._trigger("dragShape", e))
                        return;
                    $visualImg.show();
                    if (imgElem.id.indexOf("picture") > -1)
                        $visualImg.addClass("e-ss-picture");
                    left = x - (this._imgX - this._imgOffsetleft);
                    top = y - (this._imgY - this._imgOffsetTop);
                    if (left > -1 && top > -1)
                        $visualImg.css({ left: left, top: top, height: $actImg.height(), width: $actImg.width() });
                    //this._scrollShape(sheetIdx, $visualImg, x, y); // shape resize in scrolling - consider it later
                } else {
                    var width = $visualImg.width(), height = $visualImg.height(), offsetWidth = imgElem.offsetWidth, offsetHeight = imgElem.offsetHeight,
                        vCont = xlObj._getJSSheetContent(sheetIdx).find(".e-spreadsheetcontentcontainer > .e-content"), hScroll = $content.find(".e-hscrollbar").data("ejScrollBar"), vScroll = $content.find(".e-vscrollbar").data("ejScrollBar");
                    if (this._shapeRSStart) {
                        args.event = e;
                        args.target = e.target;
                        args.height = $actImg.height();
                        args.width = $actImg.width();
                        args.reqType = imgElem.id.indexOf("chart") > -1 ? "chart-resize" : "picture-resize";
                        if (this.XLObj._trigger("resizeStart", args)) {
                            this._shapeRSStart = false;
                            return;
                        }
                        $visualImg.show();
                        if (imgElem.id.indexOf("picture") > -1)
                            $visualImg.addClass("e-ss-picture");
                        if ($actImg.css("cursor") === "col-resize" || $actImg.css("cursor") === "row-resize") {
                            switch (true) {
                                case this._imgRSWStart:
                                    extra = this._imgX - x;
                                    left = $visualImg[0].offsetLeft - extra;
                                    if (left > -1) {
                                        $visualImg.css({ width: width + extra, left: left });
                                        this._imgX = x;
                                    }
                                    break;
                                case this._imgRSEStart:
                                    extra = this._imgX - x;
                                    if (xlObj.model.scrollSettings.allowScrolling && (width - extra + $visualImg[0].offsetLeft + 5) < (vCont.width() + hScroll.value())) {
                                        $visualImg.css({ width: width - extra });
                                        this._imgX = x;
                                    }
                                    break;
                                case this._imgRSNStart:
                                    extra = this._imgY - y;
                                    top = $visualImg[0].offsetTop - extra;
                                    if (top > -1) {
                                        $visualImg.css({ height: height + extra, top: top });
                                        this._imgY = y;
                                    }
                                    break;
                                case this._imgRSSStart:
                                    extra = this._imgY - y;
                                    if (xlObj.model.scrollSettings.allowScrolling && (height - extra + $visualImg[0].offsetTop + 5) < (vCont.height() + vScroll.value())) {
                                        $visualImg.css({ height: height - extra });
                                        this._imgY = y;
                                    }
                                    break;
                            }
                        }
                        // this._scrollShape(sheetIdx, $visualImg, x, y); // shape resize in scrolling - consider it later
                    } else {
                        this._refreshImgResizing();
                        if ((x <= (location.left + (xlObj._isTouchEvt ? 20 : 4))) && (x >= location.left)) {
                            $actImg.addClass("e-ss-imgcresize");
                            this._imgRSWStart = true;
                        } else if ((x <= (location.left + offsetWidth)) && (x >= location.left + offsetWidth - (xlObj._isTouchEvt ? 20 : 4))) {
                            $actImg.addClass("e-ss-imgcresize");
                            this._imgRSEStart = true;
                        } else {
                            $content.find(".e-ss-imgcresize").removeClass("e-ss-imgcresize");
                        }

                        if ((y <= (location.top + (xlObj._isTouchEvt ? 20 : 4))) && (y >= location.top)) {
                            $actImg.addClass("e-ss-imgrresize");
                            this._imgRSNStart = true;
                        } else if ((y <= (location.top + offsetHeight)) && (y >= location.top + offsetHeight - (xlObj._isTouchEvt ? 20 : 4))) {
                            $actImg.addClass("e-ss-imgrresize");
                            this._imgRSSStart = true;
                        } else {
                            $content.find(".e-ss-imgrresize").removeClass("e-ss-imgrresize");
                        }
                    }
                }
            }
        },

        _deleteShape: function (sheetIdx, $trgt) {
            var selCell, xlObj = this.XLObj, cellIdx = $trgt[0].id.indexOf("_S") > -1 ? {rowIndex: $trgt[0].id.replace(xlObj._id, "").split("_")[3], colIndex: $trgt[0].id.replace(xlObj._id, "").split("_")[4]} : this._picCellIdx, container = xlObj._dataContainer, sheet = xlObj.getSheet(sheetIdx), shapeMngr = sheet.shapeMngr, cellObj = container.sheets[sheetIdx][cellIdx.rowIndex][cellIdx.colIndex], details;
            var xlId = $trgt.data("parentID"), shapeId = $trgt[0].id.indexOf("_S") > -1 ? $trgt[0].id : $trgt.get(0).id.replace(xlId + "_", ""), shapeType =  $trgt[0].id.indexOf("_S") > -1 ?  'sparkline' : shapeId.replace(/[0-9]/g, ''), imgElem = $trgt.get(0), objIdx, picIdx, shapeObj , shapeObj = $trgt[0].id.indexOf("_S") > -1 ? shapeMngr[shapeType][$trgt[0].id] : shapeMngr[shapeType][cellObj[shapeType][0]];
           	if (!xlObj._isUndoRedo)
                if (!xlObj._isPaste && !xlObj.XLClipboard._isShape) {
                    details = { sheetIndex: sheetIdx, id: imgElem.id, picIndex: imgElem.id, reqType: "shape", shapeType: shapeType, action: "remove", options: shapeObj, range: shapeObj.range, img: shapeMngr.sharedPics[shapeObj.data], bcolor: shapeObj.bcolor, bstyle: shapeObj.bstyle, bwidth :shapeObj.bwidth };
                    details.actCell = {rowIndex: cellIdx.rowIndex, colIndex: cellIdx.colIndex};
                    details.position = { height: shapeObj.height, width: shapeObj.width, top: shapeObj.top, left: shapeObj.left };
                    details.cnt = shapeId.replace(/[a-z]/g, '');
                    xlObj._completeAction(details);
                    xlObj._trigActionComplete(details);
                }
            cellObj[shapeType].some(function (obj, i) {
                if (imgElem.id === shapeMngr[shapeType][cellObj[shapeType][i]].id) {
                    objIdx = i;
                    return true;
                }
                return false;
            });
            if (Object.keys(cellObj).length < 2 && cellObj[shapeType].length < 2){
               delete container.sheets[sheetIdx][cellIdx.rowIndex][cellIdx.colIndex];
                if(xlObj.getObjectLength(container.sheets[sheetIdx][cellIdx.rowIndex]) < 1)
                    delete container.sheets[sheetIdx][cellIdx.rowIndex]
                } 
            else if (cellObj[shapeType].length < 2)
                delete cellObj[shapeType];
            else
                cellObj[shapeType].splice(objIdx, 1);
            delete shapeMngr[shapeType][imgElem.id];
            selCell = { rowIndex: cellIdx.rowIndex, colIndex: cellIdx.colIndex };
            if (sheetIdx === xlObj._getSheetIndex()) { // check for cut paste sheet to sheet
                xlObj.setActiveCell(cellIdx.rowIndex, cellIdx.colIndex);
                xlObj.performSelection(selCell, selCell);
            }
            $trgt.remove();
            if(xlObj.model.allowFormulaBar)
            xlObj.updateFormulaBar();
            if (xlObj.model.showRibbon) {
                if (shapeType === "picture")
                    xlObj.XLRibbon._toggleFormatTab();
                else
                    xlObj.XLRibbon._toggleChartDesignTab();
            }
            if (sheet._isChartBorderDrawn)
                xlObj.XLChart._clearChartRange(xlObj._arrayAsString(xlObj._chartBorder));
        },

        _selectImg: function (elem) {
            this.XLObj._getContent(this.XLObj.getActiveSheetIndex()).find(".e-ss-activeimg").removeClass("e-ss-activeimg");
            elem.addClass("e-ss-activeimg");
            this.XLObj.XLSelection._cleanUp(true);
			if(this.XLObj.model.allowFormulaBar)
               this.XLObj.updateFormulaBar();
        },

        _refreshImgResizing: function () {
            this._imgRSEStart = false;
            this._imgRSWStart = false;
            this._imgRSNStart = false;
            this._imgRSSStart = false;
        },

        _getShapePropeties: function (cellIdx, id, type) {
            var i, data = this.XLObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, type);
            while (i in data) {
                if (data[i].id === id)
                    return data[i];
                else
                    return;
            }
        },

        _updateShapeMngr: function (cell, shapeObj, type, shtIdx) {
            var shapeIdx, obj = {}, xlObj = this.XLObj, sheetIdx = shtIdx || xlObj.getActiveSheetIndex(),
                shapeMngr = xlObj.getSheet(sheetIdx).shapeMngr, shape = shapeMngr[type];
			shape[shapeObj[type].id] = ($.extend(true, {}, shapeObj[type]));
            if (type === "picture") {
                if(shapeMngr.sharedPics.indexOf(shapeObj[type].data) < 0)
                     shapeMngr.sharedPics.push(shapeObj[type].data);
                shapeIdx = shapeMngr.sharedPics.indexOf(shapeObj[type].data);
                shape[shapeObj[type].id].data = shapeIdx;
            }
            if (xlObj._isPaste || this._insertShape || xlObj.XLClipboard._isShape || xlObj.isImport || !xlObj.getSheet(sheetIdx)._isUpdated) {
				obj[type] = shapeObj[type].id;
                xlObj.XLEdit._updateDataContainer(cell, { dataObj: obj, sheetIdx: sheetIdx });
                this._insertShape = false;
            }
        },

        _updateShapeObj: function (imgElem) {
            var oldElem, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), container = xlObj._dataContainer, shapeObj, cellObj, picIdx;
            var chart = "chart", type = this._shapeType === "img" ? "picture" : chart, cellIdx, imgElemId;
            var sheet = xlObj.getSheet(sheetIdx), shapeMngr = sheet.shapeMngr, cellPicIdx, cObj = {}, actImg = xlObj._getContent(sheetIdx).find(".e-ss-activeimg");
            if ((imgElem.id.indexOf("Column") > -1) || (imgElem.id.indexOf("Line") > -1) || (imgElem.id.indexOf("Winloss") > -1)) {
				imgElemId = imgElem.id.replace(xlObj._id, "");
                cellIdx = { rowIndex: parseInt(imgElemId.split("_")[3]), colIndex: parseInt(imgElemId.split("_")[4]) };
                type = "sparkline";
            }
            else
                cellIdx = this._picCellIdx;
            if (!xlObj.getObjectLength(this._picCellIdx))
                cellIdx = this._picCellIdx = this._getCellIndexFromOffset(imgElem.offsetTop, imgElem.offsetLeft);
            oldElem = actImg.length ? actImg: xlObj._getContent(sheetIdx).find('#' + imgElem.id);
            cellObj =  container.sheets[sheetIdx][cellIdx.rowIndex][cellIdx.colIndex];
            if (!cellObj || !cellObj[type])
                return;
            shapeObj = shapeMngr[type][oldElem[0].id];
			cellObj[type].some(function (obj, i) {
                if (oldElem[0].id === shapeMngr[type][cellObj[type][i]].id) {
                    cellPicIdx = i;
                    return true;
                }
                return false;
            });
			if(ej.isNullOrUndefined(cellPicIdx))
				return;
            cObj[type] = cellObj[type][cellPicIdx];
            if (xlObj.getObjectLength(cellObj) < 2 && cellObj[type].length < 2)
                delete container.sheets[sheetIdx][cellIdx.rowIndex][cellIdx.colIndex];
            else if (cellObj[type].length < 2)
                delete container.sheets[sheetIdx][cellIdx.rowIndex][cellIdx.colIndex][type];
            else
                container.sheets[sheetIdx][cellIdx.rowIndex][cellIdx.colIndex][type].splice(cellPicIdx, 1);
            if((imgElem.id.indexOf("Column") > -1) || (imgElem.id.indexOf("Line") > -1) || (imgElem.id.indexOf("Winloss") > -1)) {
				imgElemId = imgElem.id.replace(xlObj._id, "");
				this._picCellIdx = cellIdx =  {rowIndex: parseInt(imgElemId.split("_")[3]), colIndex: parseInt(imgElemId.split("_")[4])};
			}
            else 
				this._picCellIdx = cellIdx = this._getCellIndexFromOffset(imgElem.offsetTop, imgElem.offsetLeft);
			if(shapeObj.shapeType != "sparkline") {
				shapeObj.height = oldElem.height();
				shapeObj.width = oldElem.width();
			}
            shapeObj.left = (sheet._isFreezed && xlObj._isFrozen(xlObj.getFrozenColumns())) ? xlObj.XLFreeze._getFreezeHidenDim() + oldElem[0].offsetLeft : oldElem[0].offsetLeft;
            shapeObj.top = (sheet._isFreezed && xlObj._isFrozen(xlObj.getFrozenRows())) ? xlObj.XLFreeze._getFreezeHidenDim(true) + oldElem[0].offsetTop : oldElem[0].offsetTop;
            shapeObj.rowIndex = cellIdx.rowIndex;
            shapeObj.colIndex = cellIdx.colIndex;
            xlObj.XLEdit._updateDataContainer({ rowIndex: cellIdx.rowIndex, colIndex: cellIdx.colIndex }, { dataObj: cObj });
        },

        changePictureBorder: function (pictureId, width, style, color) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), imgElem = $('#' + pictureId)[0], left = imgElem.offsetLeft, top = imgElem.offsetTop, details;
            var cellIdx = this._getCellIndexFromOffset(top, left), shapeMngr = xlObj.getSheet(sheetIdx).shapeMngr, shapeObj, picIdx, regx = new RegExp("\\b" + "e-shapebdr" + ".*?\\b", "g");
            shapeObj = shapeMngr.picture[imgElem.id];
            details = { sheetIndex: sheetIdx, reqType: "shape", shapeType: "picture", action: "border", id: $(xlObj.getSheetElement(sheetIdx).find(".e-ss-activeimg")).attr("id"), prevClass: ej.isNullOrUndefined(imgElem.className.match(regx)) ? imgElem.className : imgElem.className.match(regx)[0], picIdx: picIdx, cellIdx: cellIdx };
            var borderCss = width + " " + style + " " + color;
            var hashCode = this._getImgBorderHashCode({ "border-color": color, "border-style": style, "border-width": width });
            if(xlObj.model.allowCellFormatting)
				xlObj.XLFormat._writeCssRules(hashCode, xlObj.XLFormat._getCssPropertyAsString({ "border": { "left": borderCss, "right": borderCss, "top": borderCss, "bottom": borderCss } }));
            shapeObj.bcolor = color;
            shapeObj.bstyle = style;
            shapeObj.bwidth = width;
            if(imgElem.className.match(regx))
                imgElem.className = imgElem.className.replace(regx, "");
            $(imgElem).addClass(hashCode);
            details.curClass = hashCode;
            details.borderProp = this._getImgStyleFromHashCode(hashCode);
            if (!xlObj._dupDetails && !xlObj._isUndoRedo) {
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
        },

        _getCellIndexFromOffset: function (top, left, sheetIdx, isOverflow) {
            var i, len, value = 0, obj = {}, rHght, xlObj = this.XLObj, sheet = xlObj.getSheet(xlObj._getSheetIndex(sheetIdx));
            if (!ej.isNullOrUndefined(top)) {
                obj.rowIndex = xlObj._getMinRowIdx(sheet);
                for (i = 0, len = sheet._rowHeightCollection.length; i < len; i++) {
                    rHght = sheet._rowHeightCollection[i];
                    value = xlObj.isUndefined(rHght) ? (value + xlObj.model.rowHeight) : rHght;
                    if (value > top) {
						obj.rowIndex = i - 1;
                        break;
                    }
                    if (i == (len - 1))
                        len++;
                }
            }
            if (!ej.isNullOrUndefined(left)) {
                obj.colIndex = 0;
                for (i = 0, value = 0, len = sheet.columnsWidthCollection.length; i < len; i++) {
					value += (sheet.columnsWidthCollection[i] === 0 && isOverflow) ? sheet.hideColsCollection[i] : sheet.columnsWidthCollection[i];
                    if (value > left) {
                        obj.colIndex = i;
                        break;
                    }
                }
            }
            return obj;
        },

        _getImgBorderHashCode: function (style) {
            var xlObj = this.XLObj, code = "";
            "border-width" in style && (code = parseInt(style["border-width"]) + "N");
            if(xlObj.model.allowCellFormatting && "border-style" in style) 
				code = (code + xlObj.XLFormat._getStyleCode("BorderStyle", style["border-style"]) +"N");
            "border-color" in style && (code = code + style["border-color"].replace("#", ""));
            return "e-shapebdr" + code;
        },

        _getImgStyleFromHashCode: function (code) {
            var xlObj = this.XLObj;
            var style = {}, bStyle = ["", "solid", "dashed", "dotted"];
            code = code || "";
            code = code.replace("e-shapebdr", "").split("N");
            if (code.length > 1) {
                style["border-width"] = code[0] + "px";
                style["border-style"] = bStyle[code[1]];
                style["border-color"] = "#" + code[2];
            }
            return style;
        },

        _scrollShape: function (sheetIdx, $visualImg, x, y) {
            var status = { position: "none", action: "none" }, xlObj = this.XLObj, $content = xlObj._getJSSheetContent(sheetIdx).find(".e-spreadsheetcontentcontainer > .e-content");
            if (((parseInt($visualImg.css('width')) + ($visualImg.offset().left - xlObj._getContent(sheetIdx).find(".e-content").offset().left)) > xlObj._getContent(sheetIdx).find(".e-content").width()) && (this._imgX <= x))
                status = { position: "horizontal", action: "Increment" };
            else if (($visualImg.offset().left - $content.offset().left) <= 0)
                status = { position: "horizontal", action: "Decrement" };
            else if (((parseInt($visualImg.css('height')) + ($visualImg.offset().top - xlObj._getContent(sheetIdx).find(".e-content").offset().top)) > xlObj._getContent(sheetIdx).find(".e-content").height()) && (this._imgY <= y))
                status = { position: "vertical", action: "Increment" };
            else if (($visualImg.offset().top - $content.offset().top) <= 0)
                status = { position: "vertical", action: "Decrement" };
            xlObj.XLSelection._scrollCalculation(sheetIdx, $visualImg.get(0), status);
        },

        _onKeyscrollShape: function (sheetIdx, $trgt, key) {
            var xlObj = this.XLObj, content = xlObj._getJSSheetContent(sheetIdx).find(".e-spreadsheetcontentcontainer > .e-content"), hScroll = xlObj._getContent(sheetIdx).find("#hscrollBar").ejScrollBar("instance"), vScroll = xlObj._getContent(sheetIdx).find("#vscrollBar").ejScrollBar("instance");
            if (content.offset().top + content[0].offsetHeight <= ($trgt.offset().top + $trgt[0].offsetHeight) && (key.keyCode === 40 || (key.keyCode === 13 && !key.shiftKey)))
                vScroll.scroll(vScroll.value() + 2, true);
            else if ((($trgt.offset().top - xlObj.model.sheets[sheetIdx]._frozenHeight) <= content.offset().top) && (key.keyCode === 38 || (key.keyCode === 13 && key.shiftKey))) {
                if (vScroll.value() - 2 >= 0)
                    vScroll.scroll(vScroll.value() - 2, true);
            }
            if (content[0].offsetWidth <= ($trgt.offset().left + $trgt[0].offsetWidth) && (key.keyCode === 39 || (key.keyCode === 9 && !key.shiftKey)))
                hScroll.scroll(hScroll.value() + 2, true);
            else if ((($trgt.offset().left - xlObj.model.sheets[sheetIdx]._frozenWidth) <= content.offset().left) && (key.keyCode === 37 || (key.keyCode === 9 && key.shiftKey))) {
                if (hScroll.value() - 2 >= 0)
                    hScroll.scroll(hScroll.value() - 2, true);
            }
        },

        _refreshShapePosOnResize: function (changeIdx, newVal, isColResize, sheetIdx) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx), chartMngr = sheet.shapeMngr.chart, picMngr = sheet.shapeMngr.picture, diff, shapeElem, shapeObj;

            if (!xlObj.getObjectLength(picMngr) && !xlObj.getObjectLength(chartMngr))
                return false;

            diff = newVal - (isColResize ? sheet.columnsWidthCollection[changeIdx] : sheet.rowsHeightCollection[changeIdx]);
            //Picture update
            for (key in picMngr) {
                shapeObj = picMngr[key];
                if (isColResize) {
                    if (changeIdx < shapeObj.colIndex) {
                        shapeObj.left += diff;
                        shapeElem = xlObj.getSheetElement(sheetIdx).find("#" + shapeObj.id);
                        if (shapeElem.length)
                            shapeElem.css({ left: shapeObj.left });
                    }
                }
                else {
                    if (changeIdx < shapeObj.rowIndex) {
                        shapeObj.top += diff;
                        shapeElem = xlObj.getSheetElement(sheetIdx).find("#" + shapeObj.id);
                        if (shapeElem.length)
                            shapeElem.css({ top: shapeObj.top });
                    }
                }
            }
            //Chart update
            for (key in chartMngr) {
                shapeObj = chartMngr[key];
                if (isColResize) {
                    if (changeIdx < shapeObj.colIndex) {
                        shapeObj.left += diff;
                        shapeElem = xlObj.getSheetElement(sheetIdx).find("#" + shapeObj.id);
                        if (shapeElem.length)
                            shapeElem.css({ left: shapeObj.left });
                    }
                }
                else {
                    if (changeIdx < shapeObj.rowIndex) {
                        shapeObj.top += diff;
                        shapeElem = xlObj.getSheetElement(sheetIdx).find("#" + shapeObj.id);
                        if (shapeElem.length)
                            shapeElem.css({ top: shapeObj.top });
                    }
                }
            }
        },

        _refreshChartdataInsDel: function (action, count, startIdx, sIdx, canChartRefresh) {
            var i, xlObj = this.XLObj, sheet = xlObj.getSheet(sIdx), chartMngr = sheet.shapeMngr.chart, key, cObj, cRange, diff;

            if (!canChartRefresh) {
                for (i = 0; i < count; i++) {
                    diff = action.indexOf("insert") > -1 ? (action.indexOf("Column") > -1 ? sheet.columnsWidthCollection[startIdx + i] : sheet.rowsHeightCollection[startIdx + i]) * 2 : 0;
                    this._refreshShapePosOnResize(startIdx + i, diff, action.indexOf("Column") > -1, sIdx);
                }
                if (xlObj.isUndefined(canChartRefresh))
                    canChartRefresh = true;
            }

            if (canChartRefresh) {
                for (key in chartMngr) {
                    cObj = chartMngr[key];
                    cRange = cObj.range;
                    if (!cRange)
                        continue;
                    switch (action) {
                        case "insertColumn":
                        case "deleteColumn":
                            if (startIdx <= cRange[1]) {
                                if (action == "insertColumn") {
                                    cRange[1] += count;
                                    cRange[3] += count;
                                }
                                else {
                                    cRange[1] -= count;
                                    cRange[3] -= count;
                                }
                                xlObj.XLChart.refreshChart(cObj.id, { range: cRange });
                            }
                            else if (xlObj._inColumn(cObj.range, startIdx))
                                xlObj.XLChart.refreshChart(cObj.id, { range: cRange });
                            break;
                        case "insertRow":
                        case "deleteRow":
                            if (startIdx <= cRange[0]) {
                                if (action == "insertRow") {
                                    cRange[0] += count;
                                    cRange[2] += count;
                                }
                                else {
                                    cRange[0] -= count;
                                    cRange[2] -= count;
                                }
                                xlObj.XLChart.refreshChart(cObj.id, { range: cRange });
                            }
                            else if (xlObj._inRow(cObj.range, startIdx))
                                xlObj.XLChart.refreshChart(cObj.id, { range: cRange });
                            break;
                    }
                }
            }
        }
    };

})(jQuery, Syncfusion);