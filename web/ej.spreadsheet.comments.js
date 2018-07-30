(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.comments = function (obj) {
        this.XLObj = obj;
        this._isCommentEdit = false;
        this._isShowAllComments = false;
        this._curCommentHCell = null;
    };

    ej.spreadsheetFeatures.comments.prototype = {

        setComment: function (range, data, showEditPanel, showUserName) {
            var xlObj = this.XLObj, args; 
            if (!xlObj.model.allowComments || xlObj.model.isReadOnly)
                return;
            var prevCmnt, rng, isViewed = false, activeCell, cellIdx, trgtCell, rowIdx, colIdx, cmntData, activeCmnt, userName,
                sheetIdx, sheet, cmnt, selCell = [], details = { sheetIndex: xlObj.getActiveSheetIndex(), reqType: "comment" };
            sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx);
            if (xlObj.model.allowLockCell && sheet.isSheetProtected)
                return false;
            if (range) {
                rng = xlObj._getRangeArgs(range, "object");;
                rowIdx =  rng[0];
                colIdx = rng[1];
                cellIdx = {rowIndex: rowIdx, colIndex: colIdx};
            }
            else {
                if (!xlObj.model.allowSelection)
                    return;
                cellIdx = xlObj.getActiveCell(sheetIdx);
                rowIdx = cellIdx.rowIndex, colIdx = cellIdx.colIndex;
            }
            args = { reqType: "beforeEditComment", cellIndex: cellIdx,value:data, sheetIdx: sheetIdx, disable:false};
            if (xlObj._trigger("beforeEditComment",args ))
                args.disable = true;
            data = args.value;
            if (xlObj._isCellProtected(rowIdx, colIdx, false))
                return;
            if (!xlObj.isUndefined(xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, 'cellType'))) {
                xlObj._showAlertDlg("Alert", "CellTypeAlert", "CellTypeAlert", 372);
                return;
            }
            if (xlObj.model.showRibbon && (xlObj._isPaste ? !xlObj.XLClipboard._cutCells.length: true))
                xlObj._commentCount++;
            if(!xlObj._isRibbonClick){
                details.action = "add";
                selCell.push(cellIdx);
                details.selectedCell = selCell;
                details.selectedCell[0].prevComment = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment");
            }
            if (!xlObj._isAutoWHMode && !xlObj.XLClipboard._copyCells.length && !sheet._isFreezed)
                xlObj.XLScroll._scrollSelectedPosition(sheetIdx, cellIdx);
            if (!(rowIdx in sheet._commentColl))
                sheet._commentColl[rowIdx] = {};
            sheet._commentColl[rowIdx][colIdx] = { isComment: true };
            showEditPanel = ej.isNullOrUndefined(showEditPanel) ? true : showEditPanel;
            showUserName = ej.isNullOrUndefined(showUserName) ? true : showUserName;
            userName = (xlObj.model.userName.length > 0 ? xlObj.model.userName : xlObj._getLocStr("UserName")) + ":\n";
            prevCmnt = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment", sheetIdx);
            if (!ej.isNullOrUndefined(data)){
				if (showUserName)
				    data = userName + data;
				xlObj.XLEdit._updateDataContainer(cellIdx, { dataObj: { comment: { value: data, isVisible: ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment", sheetIdx)) ? showEditPanel : xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment", sheetIdx).isVisible } } });
            }
            else if (args.disable)
                xlObj.XLEdit._updateDataContainer(cellIdx, { dataObj: { comment: { value: userName, isVisible: ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment", sheetIdx)) ? showEditPanel : xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment", sheetIdx).isVisible } } });
			cmntData = ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment", sheetIdx)) ? (xlObj.model.userName.length > 0 ? xlObj.model.userName : xlObj._getLocStr("UserName")) + ":\n" : xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment", sheetIdx).value;
			if (xlObj.model.allowComments  && !xlObj.XLEdit._isEdit && !xlObj._isSheetRename) {
			    if (xlObj._isRowViewable(sheetIdx, rowIdx)) {
			        activeCell = xlObj.getCell(rowIdx, colIdx);
			        activeCell.prepend(ej.buildTag("span.e-comment", ej.buildTag("span.e-celltoparrow")).append(ej.buildTag("textarea.e-comment-txtarea", cmntData, { "z-index": 10, "text-align": "left" }))).addClass("e-commentcell");
			        this._updateCmntArrowPos(activeCell);
			        activeCmnt = activeCell.find(".e-comment-txtarea");
			        this._updateCmtAreaPos(activeCell, activeCmnt);
			        activeCmnt.focus().setInputPos(activeCmnt.val().length);
			        isViewed = true;
			        if(args.disable)
			           activeCmnt[0].disabled = true;
			    }
			    if (!sheet._isImported || sheet._isLoaded) {
			        cmnt = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment", sheetIdx);
			        if (!ej.isNullOrUndefined(cmnt))
			            cmnt.value = cmntData;
			    }
			    if (showEditPanel && isViewed) {
			        activeCmnt.focus();
			        if (this._curCommentHCell && !ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValueByElem(this._curCommentHCell, "comment")) && !xlObj.XLEdit.getPropertyValueByElem(this._curCommentHCell, "comment").isVisible) {
			            this._curCommentHCell.find(".e-comment-txtarea").hide();
			            this._curCommentHCell = null;
			        }
			        if (xlObj.model.allowDragAndDrop && !xlObj.XLDragDrop._isDragAndDropped)
			            this._updateCurrentCell(rowIdx, colIdx);
			        if (!args.disable) {
			            this._isCommentEdit = true;
			            if (xlObj.model.showRibbon)
			                xlObj.XLRibbon._disableRibbonIcons();
			        }
			        else
			            this._updateCmntRibIcons();
			    }
			    else if (isViewed) {
			        if (!this._isShowAllComments && !xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment", sheetIdx).isVisible)
			            activeCmnt.hide();
			        if (xlObj.model.showRibbon && (!sheet._isImported || sheet._isLoaded) && xlObj.model.allowDragAndDrop && !xlObj.XLDragDrop._isDragAndDropped)
			            this._updateCmntRibIcons(xlObj.XLClipboard._isSpecial ? xlObj.getActiveCell() : { rowIndex: rowIdx, colIndex: colIdx });
			    }
			    if (!xlObj._isRibbonClick && !xlObj._isUndoRedo && !xlObj._hasComment && !xlObj._isExport && !xlObj._dupDetails) {
                    details.selectedCell[0].curComment = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment");
                    details.showUserName = showUserName;
                    details.showEditPanel = showEditPanel;
                    xlObj._completeAction(details);
                    xlObj._trigActionComplete(details);
                }
            }
        },

        _updateCmtAreaPos: function (activeCell, cmtTxtArea) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), hScroll = xlObj._getContent(sheetIdx).find("#hscrollBar").offset(), vScroll = xlObj._getContent(sheetIdx).find("#vscrollBar").offset(), hdrOffset = xlObj._getJSSheetHeader(sheetIdx).offset(),
                txtOffset = cmtTxtArea.offset(), cHeight = cmtTxtArea.height(), cWidth = cmtTxtArea.width();
            if (xlObj.model.scrollSettings.allowScrolling) {
                if ((txtOffset.top + cHeight + 5) > hScroll.top && (txtOffset.left + cWidth) < vScroll.left)
                    cmtTxtArea.css({ top: -77 });
                else if ((txtOffset.left + cWidth) > vScroll.left && (txtOffset.top + cHeight + 5) > hScroll.top)
                    cmtTxtArea.css({ left: -136, top: -81 });
                else if ((txtOffset.top + cHeight) > hdrOffset.top && (txtOffset.left + cWidth) > vScroll.left)
                    cmtTxtArea.css({ left: -137, top: activeCell.height() + 8 });
            }
        },

        deleteComment: function (range, sheetIdx, skipHiddenRow,  status) {
            var xlObj = this.XLObj;
            if (!xlObj.model.allowComments || xlObj.model.isReadOnly)
                return;
            var actCell, rowIdx, colIdx, cmnt, cmntCells = [], selCell = [], activeShtIdx = sheetIdx || xlObj.getActiveSheetIndex(), activeCells, details = { sheetIndex: activeShtIdx, reqType: "comment", action: "delete", range: range };
            range = xlObj._getRangeArgs(range, "object");
            activeCells = xlObj._getSelectedCells(sheetIdx, range).selCells;
            for (var i = 0; i < activeCells.length; i++) {
                if (xlObj.XLEdit.getPropertyValue(activeCells[i].rowIndex, activeCells[i].colIndex, "comment", sheetIdx))
                    cmntCells.push(activeCells[i]);
            }
            if (xlObj.model.allowComments) {
                for (var i = 0; i < activeCells.length; i++) {
                    rowIdx = activeCells[i].rowIndex;
                    colIdx = activeCells[i].colIndex;
                    cmnt = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment", sheetIdx);
                    if (!ej.isNullOrUndefined(cmnt)) {
                        actCell = $(activeCells[i]);
                        if (skipHiddenRow && xlObj._isHiddenRow(rowIdx)) {
                            activeCells.splice(i, 1);
                            continue;
                        }
                        if (xlObj.model.showRibbon && xlObj._commentCount)
                            xlObj._commentCount--;
                        selCell.push({ rowIndex: rowIdx, colIndex: colIdx, prevComment: cmnt, currComment: {} });
                        if (xlObj._isRowViewable(activeShtIdx, rowIdx))
                            xlObj.getCell(rowIdx, colIdx, activeShtIdx).removeClass("e-commentcell").find('.e-comment').remove();
                        if (xlObj.getSheet(activeShtIdx)._commentColl[rowIdx])
                            delete xlObj.getSheet(activeShtIdx)._commentColl[rowIdx][colIdx];
                        delete xlObj._dataContainer.sheets[activeShtIdx][rowIdx][colIdx]["comment"];
                    }                   
                }
                details.selectedCell = selCell;
                //Delete action
                if (xlObj.model.showRibbon && cmntCells.length && xlObj.model.allowDragAndDrop && !xlObj.XLDragDrop._isDragAndDropped)
                    xlObj.XLComment._updateCmntRibIcons();
                details.reqType = ej.isNullOrUndefined(status) ? "comment" : "clear-comment";
                if (!xlObj._isUndoRedo && !xlObj._dupDetails) {
                    xlObj._completeAction(details);
                    xlObj._trigActionComplete(details);
                }
            }
        },

        editComment: function (target) {
            var xlObj = this.XLObj, args, cmntData;
			if (!xlObj.model.allowComments || xlObj.model.isReadOnly)
                return;
            var sheetIdx = xlObj.getActiveSheetIndex(), txtArea;
			if (xlObj.model.allowLockCell && xlObj.getSheet(sheetIdx).isSheetProtected)
			    return false;
            ej.isNullOrUndefined(target) && (target = xlObj.getActiveCell());
            cmntData = xlObj.XLEdit.getPropertyValue(target.rowIndex, target.colIndex, "comment", sheetIdx);
            args = { reqType: "beforeEditComment", cellIndex: target, value: cmntData.value, sheetIndex: sheetIdx, isDisable: false };
            if (xlObj._trigger("beforeEditComment", args))
                args.disable = true;
            cmntData.value = args.value;
            xlObj.XLEdit._updateDataContainer(target, { dataObj: { comment: { value: cmntData.value, isVisible: cmntData.isVisible } } });
            if (!xlObj.XLEdit._isEdit && !xlObj._isSheetRename) {
                if (xlObj.model.allowComments) {
                    if (!ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(target.rowIndex, target.colIndex, "comment"))) {
                        !xlObj._isAutoWHMode && xlObj.XLScroll._scrollSelectedPosition(sheetIdx, target);
                        if (xlObj._isRowViewable(sheetIdx, target.rowIndex)) {
                            txtArea = xlObj.getCell(target.rowIndex, target.colIndex).find(".e-comment-txtarea");
                            txtArea.text(args.data);
                            txtArea.css("display", "inline-table").focus().setInputPos(txtArea.text().length);
                        }
                        if(!args.disable)
                           this._isCommentEdit = true;
                    }
                }
                if (xlObj.model.showRibbon && !args.disable)
                    xlObj.XLRibbon._disableRibbonIcons();
            }
        },

        showHideComment: function (trgtCell) {
            var xlObj = this.XLObj;
            if (!xlObj.model.allowComments || xlObj.model.isReadOnly)
                return;
            var sheetIdx = xlObj.getActiveSheetIndex(), activeCell, cmnt, $target, isViewed = false, visibility = false;
            if(ej.isNullOrUndefined(trgtCell))
				activeCell = xlObj.getActiveCell();
			else
				activeCell = xlObj._getCellIdx(trgtCell[0]);
            cmnt = xlObj.XLEdit.getPropertyValue(activeCell.rowIndex, activeCell.colIndex, "comment");
            if (!ej.isNullOrUndefined(cmnt)) {
                if (xlObj._isRowViewable(sheetIdx, activeCell.rowIndex)) {
                    $target = xlObj.getCell(activeCell.rowIndex, activeCell.colIndex).find(".e-comment-txtarea");
                    isViewed = true;
                }
                if (cmnt.isVisible) {
                    isViewed && $target.hide();
                    visibility = false;
                }
                else {
                    isViewed && $target.css("display", "inline-table");
                    this._curCommentHCell = null;
                    visibility = true;
                }
            }
            if (!xlObj.isUndefined(visibility))
                cmnt.isVisible = visibility;
        },

        showAllComments: function () {
            var xlObj = this.XLObj; 
            if (!xlObj.model.allowComments)
                return;
            var rowKeys, colKeys, j, sheetIdx = xlObj.getActiveSheetIndex(), allComments, $getAllComments, isAvble, showToglBtObj = $("#" + xlObj._id + "_Ribbon_Review_Comments_ShowAllComments").data("ejToggleButton"), ribIconsIds = ["Review_Comments_PreviousComment", "Review_Comments_NextComment"], i, len, visibleStatus;
            if (this._isShowAllComments)
                visibleStatus = false;
            else 
                visibleStatus = true;
            for (i = 1; i <= xlObj.model.sheetCount; i++) {
                allComments = xlObj.getSheet(i)._commentColl;
                rowKeys = xlObj.getObjectKeys(allComments);
                for (j = 0; j < rowKeys.length; j++) {
                    colKeys = xlObj.getObjectKeys(allComments[rowKeys[j]]);
                    for (var k = 0; k < colKeys.length; k++) {
                        if (xlObj._isRowViewable(sheetIdx, parseInt(rowKeys[j]))) {
                            $getAllComments = xlObj.getCell(parseInt(rowKeys[j]), parseInt(colKeys[k]),i).find(".e-comment-txtarea");
                            if(this._isShowAllComments)
                                $getAllComments.hide();
                            else
                                $getAllComments.css("display", "inline-table");
                        }
                        xlObj.XLEdit.getPropertyValue(rowKeys[j], colKeys[k], "comment", i).isVisible = !this._isShowAllComments;
                    }
                    if (j == 0)
                        isAvble = true;
                }
            }
            this._isShowAllComments = !this._isShowAllComments;
            if (xlObj.model.showRibbon && showToglBtObj && showToglBtObj.model.toggleState)
                xlObj.XLRibbon._disableButtons(ribIconsIds, "ejButton");
            else if (xlObj.model.showRibbon && isAvble)
                xlObj.XLRibbon._enableButtons(ribIconsIds, "ejButton");
        },

        findPrevComment: function () {
            var xlObj = this.XLObj; 
            if (!xlObj.model.allowComments || xlObj.model.isReadOnly)
                return;
            var sheetIdx = xlObj.getActiveSheetIndex(), sheet, rowCount, colCount, rowIndex, colIndex, i, j, k, cell, insCmtEle = $("#" + xlObj._id + "_Ribbon_Review_Comments_NewComment"), commentPanel, tabIdx;
            for (i = sheetIdx; i > 0; i--) {
                sheet = xlObj.getSheet(i);
                if (!xlObj.getObjectLength(sheet._commentColl))
                    continue;
                if (i !== sheetIdx)
                    xlObj.gotoPage(i, false);
                if (xlObj.model.showRibbon) {
                    tabIdx = xlObj.XLRibbon._getTabIndex("review");
                    tabIdx && $("#" + xlObj._id + "_Ribbon").ejRibbon("option", "selectedItemIndex", tabIdx);
                }
                rowCount = sheet.rowCount - 1;
                colCount = sheet.colCount - 1;
                if (i !== sheetIdx)
                    this._updateCurrentCell(rowCount - 1, colCount - 1);
                rowIndex = sheet._activeCell.rowIndex;
                colIndex = sheet._activeCell.colIndex;
                for (j = rowIndex; j >= 0; j--) {
                    if (j !== rowIndex)
                        colIndex = colCount - 1;
                    for (k = colIndex; k >= 0; k--) {
                        if (xlObj.XLEdit.getPropertyValue(j, k, "comment", sheetIdx)) {
                            if (sheet._hiddenFreezeRows.indexOf(j) > -1 && sheet._isFreezed)
                                xlObj.XLSearch._freezeScroll(j, k, sheet);
                            else if (!xlObj._isRowViewable(sheetIdx, j))
                                xlObj._scrollContent({ y: xlObj._getRowOffsetTop(sheet, j) }, true);
                        }
                        if (xlObj._isRowViewable(sheetIdx, j)) {
                            cell = $(xlObj.getCell(j, k));
                            commentPanel = $(cell.find(".e-comment-txtarea"));
                            if (sheet._activeCell.rowIndex !== j && sheet._activeCell.colIndex !== k && !ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValueByElem(cell, "comment")) && xlObj.XLEdit.getPropertyValueByElem(cell, "comment").isVisible)
                                commentPanel.hide();
                            if (cell.hasClass("e-commentcell") && !commentPanel.is(":visible")) {
                                if (commentPanel.css("display", "inline-table").focus())
                                    this._updateCurrentCell(j, k);
                                this._updateCommentsBtns(insCmtEle);
                                xlObj.setSheetFocus();
                                return true;
                            }
                            if (!this._isShowAllComments && !this._isCommentEdit && cell.hasClass("e-commentcell") && !xlObj.XLEdit.getPropertyValueByElem(cell, "comment").isVisible)
                                commentPanel.hide();
                        }                        
                    }
                }
            }
            if (i === 0)
                xlObj._showAlertDlg("", "CommentFindEndAlert", "findPrevComment", 630);
        },

		_updateCommentsBtns: function(insCmtEle) {
			var xlObj = this.XLObj;
			if (xlObj.model.showRibbon) {
                xlObj.XLRibbon._enableButtons(["Review_Comments_DeleteComment", "Review_Comments_ShowHideComment"], "ejButton");
                insCmtEle.find(".e-icon").removeClass("e-ssr-newcmnt").addClass("e-ssr-editcmnt");
                insCmtEle.find(".e-btntxt").text(xlObj._getLocStr("EditComment"));
            }
		},
		
        findNextComment: function () {
            var xlObj = this.XLObj; 
            if (!xlObj.model.allowComments || xlObj.model.isReadOnly)
                return;
            var sheet, rowIndex, colIndex, rowCount, colCount, i, j, k, cell, commentPanel, tabIdx, isScrolled = false, sheetIdx = xlObj.getActiveSheetIndex(), insCmtEle = $("#" + xlObj._id + "_Ribbon_Review_Comments_NewComment");
            for (i = sheetIdx; i <= xlObj.model.sheetCount; i++) {
                sheet = xlObj.getSheet(i);
                if (!xlObj.getObjectLength(sheet._commentColl))
                    continue;
                if (i !== sheetIdx)
                    xlObj.gotoPage(i, false);
                if (xlObj.model.showRibbon) {
                    tabIdx = xlObj.XLRibbon._getTabIndex("review");
                    tabIdx && $("#" + xlObj._id + "_Ribbon").ejRibbon("option", "selectedItemIndex", tabIdx);
                }
                if (i !== sheetIdx)
                    this._updateCurrentCell(0, 0);
                rowIndex = sheet._activeCell.rowIndex;
                colIndex = sheet._activeCell.colIndex;
                rowCount = sheet.rowCount - 1;
                colCount = sheet.colCount - 1;
                for (j = rowIndex; j < rowCount; j++) {
                    if (j !== rowIndex)
                        colIndex = 0;
                    for (k = colIndex; k < colCount; k++) {
                        if (xlObj.XLEdit.getPropertyValue(j, k, "comment", sheetIdx)) {
                            if (sheet._isFreezed)
                                xlObj.XLSearch._freezeScroll(j, k, sheet);
                            else if (!xlObj._isRowViewable(sheetIdx, j))
                                xlObj._scrollContent({ y: xlObj._getRowOffsetTop(sheet, j) }, true);
                            isScrolled = !xlObj.getActiveCellElem();
                        }
                        if (xlObj._isRowViewable(sheetIdx, j)) {
                            cell = $(xlObj.getCell(j, k));
                            commentPanel = $(cell.find(".e-comment-txtarea"));
                            if (!isScrolled && xlObj.getActiveCellElem()[0] !== cell[0] && !ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValueByElem(cell, "comment")) && xlObj.XLEdit.getPropertyValueByElem(cell, "comment").isVisible)
                                commentPanel.hide();
                            if (cell.hasClass("e-commentcell") && !commentPanel.is(":visible")) {
                                commentPanel.css("display", "inline-table").focus();
                                this._updateCurrentCell(j, k);
                                this._updateCommentsBtns(insCmtEle);
                                xlObj.setSheetFocus();
                                return true;
                            }
                        }
                        if (!this._isShowAllComments && !this._isCommentEdit && cell.hasClass("e-commentcell") && !xlObj.XLEdit.getPropertyValueByElem(cell, "comment").isVisible)
                            commentPanel.hide();
                    }
                }
            }
            if (i === xlObj.model.sheetCount + 1)
                xlObj._showAlertDlg("", "CommentFindEndAlert", "findNextComment", 630);
        },

        _commentMouseMove: function (e) {
            var xlObj = this.XLObj, $target, commentPanel;
            $target = (e.target.tagName === "TD") ? $(e.target) : $(e.target).parent("td");
            if (!$target.length)
                return;
            commentPanel = $target.find(".e-comment-txtarea");
            if (!this._isCommentEdit) {
                if (!ej.isNullOrUndefined(this._curCommentHCell)) {
                    if ($target !== this._curCommentHCell) {
                        var cellData = xlObj.XLEdit.getPropertyValueByElem(this._curCommentHCell, "comment");
                        if (!ej.isNullOrUndefined(cellData) && !cellData.isVisible) {
                            this._curCommentHCell.find(".e-comment-txtarea").hide();
                            this._curCommentHCell = null;
                        }
                    }
                }
                if ($target[0].tagName === "TD" && $target.hasClass("e-commentcell")) {
                    commentPanel.css("display", "inline-table");
                    this._curCommentHCell = $target;
                }
            }
        },

        _commentMouseDownHandler: function (e) {
            var xlObj = this.XLObj, cellIdx = xlObj.getActiveCell(), sheetIdx = xlObj.getActiveSheetIndex();
            if (xlObj._isRowViewable(sheetIdx, cellIdx.rowIndex)) {
                var activeCell = xlObj.getCell(cellIdx.rowIndex, cellIdx.colIndex, sheetIdx), cellData, commentPanel = $(activeCell.find(".e-comment-txtarea"));
                if (activeCell.hasClass("e-commentcell") && commentPanel.get()[0] !== e.target) {
                    cellData = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "comment");
                    if (this._isCommentEdit)
                        this._updateCurCmntVal(cellIdx);
                    if (!this._isShowAllComments && !xlObj.isUndefined(cellData) && !cellData.isVisible)
                        commentPanel.hide();
                }
            }

            if (xlObj._hasClass(e.target,"e-comment-txtarea") && !e.target.disabled) {
                if ($(e.target).focus().css("z-index", 10))
                    this._isCommentEdit = true;
                this._updateCurrentCell($(e.target).parents("td").parent().index(), $(e.target).parents("td").index());
                if (xlObj.model.showRibbon)
                    xlObj.XLRibbon._disableRibbonIcons();
            }
        },

        _updateCmntRibIcons: function (trgtCell) {
            var comment, xlObj = this.XLObj, ribIconsIds = ["Review_Comments_ShowHideComment", "Review_Comments_DeleteComment"], activeSheet = xlObj.getActiveSheetIndex(),
                sheetElement = xlObj.getSheetElement(activeSheet), insCmtEle = $('#' + xlObj._id + '_Ribbon_Review_Comments_NewComment'),
                actCell = xlObj.getActiveCell(), sheet = xlObj.getSheet(activeSheet), selectedCells = sheet._selectedCells, selRange = sheet.selectedRange;
            trgtCell = (xlObj.model.allowDragAndDrop && !xlObj.XLDragDrop._isDragAndDropped) ? (trgtCell ? trgtCell : actCell) : { rowIndex: xlObj._dStartCell.rowIndex, colIndex: xlObj._dStartCell.colIndex };
            xlObj.XLRibbon._enableButtons(["Review_Comments_NewComment"], "ejButton");
            xlObj.XLRibbon._enableButtons(xlObj.XLRibbon._cmntTglBtnIds, "ejToggleButton");
            comment = xlObj.XLEdit.getPropertyValue(trgtCell.rowIndex, trgtCell.colIndex, "comment", activeSheet);
            if (comment) {
                xlObj.XLRibbon._enableButtons(ribIconsIds, "ejButton");
                insCmtEle.find(".e-icon").removeClass("e-ssr-newcmnt").addClass("e-ssr-editcmnt");
                insCmtEle.find(".e-btntxt").text(xlObj._getLocStr("EditComment"));
            }
            else {
                insCmtEle.find(".e-icon").removeClass("e-ssr-editcmnt").addClass("e-ssr-newcmnt");
                insCmtEle.find(".e-btntxt").text(xlObj._getLocStr("NewComment"));
                xlObj.XLRibbon._disableButtons(ribIconsIds, "ejButton");
            }
            if (this._isShowAllComments || xlObj._commentCount === 0)
                xlObj.XLRibbon._disableButtons(["Review_Comments_PreviousComment", "Review_Comments_NextComment"], "ejButton");
            else
                xlObj.XLRibbon._enableButtons(["Review_Comments_PreviousComment", "Review_Comments_NextComment"], "ejButton");
            if (selectedCells.length && xlObj.inRange(selRange, trgtCell.rowIndex, trgtCell.colIndex)) {
                if (xlObj.XLEdit._rangeHasProperty(selRange, "comment"))
                    xlObj.XLRibbon._enableButtons(["Review_Comments_DeleteComment"], "ejButton");
            }
        },

        _updateCurCmntVal: function (trgtCell, status) {
            status = ej.isNullOrUndefined(status) ? "" : status;
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), activeCell = ej.isNullOrUndefined(trgtCell) ? xlObj.getActiveCell() : trgtCell, commentPanel, cmntVal, selCell = [], cmntVal = "User Name:", isViewed = false;;
            var details = { sheetIndex: sheetIdx, reqType: "comment" }, rowIdx = activeCell.rowIndex, colIdx = activeCell.colIndex;
            if(xlObj._isRowViewable(details.sheetIndex, rowIdx)){
                commentPanel = xlObj.getCell(rowIdx, colIdx, sheetIdx).find(".e-comment-txtarea");
                isViewed = true;
                commentPanel.scrollTop(0);
            }
            selCell.push({ rowIndex: rowIdx, colIndex: colIdx });
            details.action = (ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment"))) ? "add" : "edit";
            details.selectedCell = selCell;
            details.selectedCell[0].prevComment = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment");
            isViewed && (cmntVal = commentPanel.css("z-index", 9).val());
            xlObj.XLEdit._updateDataContainer({ rowIndex: rowIdx, colIndex: colIdx }, { dataObj: { comment: { value: cmntVal, isVisible: xlObj.isUndefined(xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment")) ? this._isShowAllComments : xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment").isVisible } } });
            if (isViewed && !this._isShowAllComments && !xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment").isVisible)
                commentPanel.hide();
            xlObj.setSheetFocus();
            this._isCommentEdit = false;
            xlObj.XLCellNav._isNavigate = true;
            if (xlObj.model.showRibbon)
                xlObj.XLRibbon._enableRibbonIcons();
            xlObj.XLEdit._updateUsedRange(rowIdx, colIdx, sheetIdx);
            details.selectedCell[0].curComment = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment");
            if (!xlObj._isUndoRedo && status !== "paste") {
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
        },

        _updateCurrentCell: function (rIndex, cIndex, sheetIdx) {
            var xlObj = this.XLObj, cellObj = { rowIndex: rIndex, colIndex: cIndex };
            sheetIdx = sheetIdx ? sheetIdx : xlObj.model.activeSheetIndex;
            var shtModel = xlObj.getSheet(sheetIdx);
            shtModel._activeCell = cellObj;
            xlObj.model.allowSelection && xlObj.XLSelection.selectRange(cellObj, cellObj, sheetIdx);
            shtModel._startCell = shtModel._endCell = cellObj;
            if(xlObj.model.allowAutoFill)
				xlObj.XLDragFill.positionAutoFillElement();
        },

        _visibleCmntCnt: function (cell, isVisible) {
            cell.find(".e-comment")[isVisible ? "show" : "hide"]();
        },

        _updateCmntArrowPos: function (cells, sheetIdx, startCell) {
            var i, len, cell, cellInfo, cmntElem, activeCell, xlObj = this.XLObj, sheetIdx = xlObj._getSheetIndex(sheetIdx), sheet = xlObj.getSheet(sheetIdx), commentCells = cells || xlObj._getContent(sheetIdx).find(".e-commentcell");
            startCell = startCell || {};
            if (xlObj.model.allowComments) {
                for (i = 0, len = commentCells.length; i < len; i++) {
                    activeCell = $(commentCells[i]);
                    cell = xlObj._getCellIdx(activeCell[0]);
                    if ((cell.rowIndex < startCell.rowIndex) || (cell.colIndex < startCell.colIndex))
                        continue;
                    cmntElem = activeCell.find(".e-comment");
                    if (xlObj._isInsdel) {
                        if (!(cell.rowIndex in sheet._commentColl))
                            sheet._commentColl[cell.rowIndex] = {};
                        sheet._commentColl[cell.rowIndex][cell.colIndex] = { isComment: true };
                    }
                    if (cmntElem.length) {
                        cellInfo = xlObj._getCellInfo(cell, sheetIdx);
                        if (sheet.columnsWidthCollection[cell.colIndex] < 5) { // 5 - comment arrow indicator width
                            cmntElem.hide();
                            continue;
                        }
                        if (cmntElem.is(":hidden"))
                            cmntElem.show();
                        cmntElem.css({ "top": cellInfo.top + "px", "left": (cellInfo.left + activeCell.width()) + "px" });
                    }
                }
            }
        },

        _updateCmntFrmCntnr: function (rowIdx, colIdx) {
            var xlObj = this.XLObj;
            if (xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "comment")) {
                if (xlObj._isRowViewable(null, colIdx))
                    if (xlObj.getCell(rowIdx, colIdx).hasClass("e-commentcell"))
                        this.deleteComment([rowIdx, colIdx, rowIdx, colIdx]);
				xlObj._dupDetails = true;
                this.setComment([rowIdx, colIdx, rowIdx, colIdx], null, false);
				xlObj._dupDetails = false;
            }
        }
    };
})(jQuery, Syncfusion);