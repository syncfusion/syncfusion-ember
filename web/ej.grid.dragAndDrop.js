(function ($, ej, undefined) {
    ej.gridFeatures = ej.gridFeatures || {};
    ej.gridFeatures.dragAndDrop = {
        _headerCellgDragDrop: function () {
            var proxy = this;
            this.dragHeaderElement();
            var $droppableElements = this.element.children("div.e-groupdroparea");
            $droppableElements.ejDroppable({
                accept: $droppableElements,
                drop: function (event, ui) {
                    if (ej.isNullOrUndefined(ui.helper) || !ui.helper.is(":visible"))
                        return;
                    var column = proxy.getColumnByField($.trim($(ui.draggable[0]).find("div").attr("data-ej-mappingname")));
                    ui.helper.remove();
                    if (proxy._disabledGroupableColumns.length && $.inArray(column["field"], proxy._disabledGroupableColumns) != -1)
                        return;
                    if (!(ej.isNullOrUndefined(column)) && (!(ej.isNullOrUndefined(column.field) || column.field == "")))
                        proxy.groupColumn(column.field);
                    if (proxy.model.allowGrouping)
                        proxy.collapseGroupDropArea();
                }
            });
        },
        _headerCellreorderDragDrop: function () {
            var proxy = this;
            this.dragHeaderElement();
            var $droppableElements = this.element.find(".e-headercell").not(".e-detailheadercell,.e-stackedHeaderCell");
            $droppableElements.ejDroppable({
                accept: $droppableElements,
                drop: function (event, ui) {
                    if (ej.isNullOrUndefined(ui.helper) || !ui.helper.is(":visible") || $(ui.draggable[0]).closest('.e-grid').attr("id") != proxy._id)
                        return;
                    if (ui.draggable.attr("aria-sort") == "ascending" || ui.draggable.attr("aria-sort") == "descending") {
                        var scolumn = proxy.getColumnByField($.trim($(ui.draggable[0]).find("div").attr("data-ej-mappingname")));
                        if (proxy.model.allowSorting && proxy.model.allowMultiSorting)
                            proxy._scolumns.push(scolumn.field);
                        else
                            proxy._gridSort = scolumn.field;
                    }
                    var column, dropcolumn, fromindex, toindex, droppedIndex;
                    var draggedIndex = ui.draggable.index();
                    if (event.dropTarget.hasClass("e-headercelldiv"))
                        droppedIndex = event.dropTarget.parent().index();
                    else if (event.dropTarget.parent().hasClass("e-headercell") || event.dropTarget.hasClass("e-headercell"))
                        droppedIndex = event.dropTarget.index();
                    if ($(event.dropTarget).hasClass("e-number") || $(event.dropTarget).hasClass("e-icon") || event.dropTarget.closest(".e-headercelldiv"))
                        droppedIndex = event.dropTarget.closest(".e-headercell").index();
                    if (proxy.model.scrollSettings.frozenColumns > 0) {
                        fromindex = ui.draggable.closest('.e-frozenheaderdiv').length > 0 ? draggedIndex : draggedIndex + proxy.model.scrollSettings.frozenColumns;
                        toindex = event.dropTarget.closest('.e-frozenheaderdiv').length > 0 ? droppedIndex : droppedIndex + proxy.model.scrollSettings.frozenColumns;
                    }
                    else {
                        fromindex = draggedIndex;
                        toindex = droppedIndex;
                    }
                    if (proxy.model.allowGrouping && proxy.model.groupSettings.groupedColumns.length > 0) {
                        fromindex = fromindex - proxy.model.groupSettings.groupedColumns.length;
                        toindex = toindex - proxy.model.groupSettings.groupedColumns.length;
                    }
                    if (proxy.model.detailsTemplate != null || proxy.model.childGrid != null) {
                        fromindex = fromindex - 1;
                        toindex = toindex - 1;
                    }
                    column = proxy.getColumnByIndex(fromindex);
                    dropcolumn = proxy.getColumnByIndex(toindex);
                    var field = !ej.isNullOrUndefined(column) && !ej.isNullOrUndefined(column.field) && column.field != "" ? column.field : null;
                    var field2 = !ej.isNullOrUndefined(dropcolumn.field) && dropcolumn.field != "" ? dropcolumn.field : null;
                    ui.helper.remove();
                    var header = $(event.dropTarget).clone();
                    header.find(".e-number").remove();
                    if (!ej.isNullOrUndefined(field) && !ej.isNullOrUndefined(field2)) {
                        if ($(event.dropTarget).hasClass("e-droppable")) {
                            header = header.children(".e-headercelldiv");
                            var eDropTarget = $(event.dropTarget).children(".e-headercelldiv");
                        }
                        else {
                            header = $(event.dropTarget).siblings(".e-headercelldiv");
                            var eDropTarget = $(event.dropTarget);
                            if ($(eDropTarget).hasClass("e-filtericon"))
                                eDropTarget = header = $(eDropTarget).siblings(".e-headercelldiv");
                        }
                        if (proxy.model.allowSorting && proxy.model.allowMultiSorting){
                            if (event.dropTarget.hasClass("e-number") || event.dropTarget.hasClass("e-icon")) 
                                var toColumn = proxy.getColumnByField($.trim(header.attr("data-ej-mappingname")));							                            
                            else 
                                var toColumn = proxy.getColumnByField($.trim(eDropTarget.attr("data-ej-mappingname")));
                            }
                        else {
                            if (event.dropTarget.hasClass("e-icon") && !event.dropTarget.hasClass("e-filtericon"))
                                var toColumn = proxy.getColumnByField($.trim(header.attr("data-ej-mappingname")));
                            else
                                var toColumn = proxy.getColumnByField($.trim(eDropTarget.attr("data-ej-mappingname")));
                        }
						if(ej.isNullOrUndefined(toColumn) && event.dropTarget.closest(".e-headercelldiv"))
							 var toColumn = proxy.getColumnByField($.trim(eDropTarget.closest(".e-headercelldiv").attr("data-ej-mappingname")));							
                        proxy.reorderColumns(column.field, toColumn.field);
                    }
                    else {
                        proxy.reorderColumns(fromindex, toindex);
                    }
                    if (proxy.model.allowGrouping)
                        proxy.collapseGroupDropArea();
                }
            });
        },

        dragHeaderElement: function () {
            var proxy = this;
            var $dragableElements = this.element.children("div.e-gridheader").find("th.e-headercell").not(".e-detailheadercell,.e-stackedHeaderCell");
            var $visualElement = ej.buildTag('div.e-cloneproperties', "", { 'height': '20px', 'z-index': 2 }), column;
            //header element columnDrag
            $dragableElements.ejDraggable({
                cursorAt: { top: 0, left: 0 },
                helper: function (event, ui) {
                    if (proxy.element.find(".e-dragclone").length > 0) proxy.element.find(".e-dragclone").remove();
                    var $th, hcell;
                    if ($(event.element).hasClass("e-headercell"))
                        $th = $(event.element);
                    else
                        $th = $(event.element).closest("th");
                    hcell = $th.find(".e-headercelldiv");
                    var columnIndex = $(event.element).index();
                    if (proxy.model.allowGrouping && proxy.model.groupSettings.groupedColumns.length > 0)
                        columnIndex = columnIndex - proxy.model.groupSettings.groupedColumns.length;
                    else if (proxy.model.detailsTemplate != null || proxy.model.childGrid != null)
                        columnIndex = columnIndex - 1;
                    column = proxy.getColumnByIndex(columnIndex);
                    proxy._$curSElementTarget = hcell; 
                    if (proxy.model.allowSorting && proxy.model.allowMultiSorting) {
                        var header = $($th).clone();
                        header.find(".e-number").remove();
                        return $visualElement.text(header.text()).clone().width($th.outerWidth() + 2).height($th.height() + 2).css({ "font-size": parseInt(($th.height() + 3) / 2) }).addClass("e-dragclone").appendTo(proxy.element);
                    }
                    else
                        return $visualElement.text($th.text()).clone().width($th.outerWidth() + 2).height($th.height() + 2).css({ "font-size": parseInt(($th.height() + 3) / 2) }).addClass("e-dragclone").appendTo(proxy.element);
                },
                dragStart: function (args) {
                    var target = args.target , $target = $(target);
                    var data = { target: target, draggableType: "headercell", column: column }, isGrouped, toggleClass, dragOnToggle = false;
                    if (proxy.model.groupSettings.showToggleButton && column && column.allowGrouping) {
                        isGrouped = $.inArray(column.field, proxy.model.groupSettings.groupedColumns);
                        toggleClass = $(args.element).find(".e-togglegroupbutton").hasClass("e-togglegroup");
                        if ((isGrouped != -1 && toggleClass) || (isGrouped == -1 && !toggleClass))
                            dragOnToggle = true;
                    }
                    if ((proxy._resizer != null && proxy._resizer._expand) || dragOnToggle || $target.eq(0).hasClass("e-filtericon") || (column && column.allowGrouping == false && column.allowReordering == false)) {
                        $(".e-dragclone").remove();
                        return false;
                    }
                    proxy._dragActive = true; 
                    if (proxy.model.allowGrouping)
                        proxy.expandGroupDropArea();
                    if (proxy._trigger("columnDragStart", data))
                        return false;
                },
                drag: function (args) {
                    var $target = $(args.target);
                    var data = { target: $target, draggableType: "headercell", column: column };
                    if (proxy._trigger("columnDrag", data))
                        return false;
                    if ($target.closest(".e-grid").attr("id") !== proxy._id)
                        return;
                    proxy.getHeaderTable().find(".e-headercell").removeClass("e-reorderindicate");
                    if (proxy.model.allowReordering && ($target.hasClass('e-headercelldiv') || $target.hasClass('e-headercell')) && !$target.hasClass('e-detailheadercell') && !$target.hasClass('e-stackedHeaderCell') && !$target.parent().hasClass("e-grouptopleftcell")) {
                        document.body.style.cursor = '';
                        $target.addClass("e-allowDrop");
                        proxy.getHeaderTable().find(".e-reorderindicate").removeClass("e-reorderindicate");
                        if ($target.hasClass('e-headercell')) $target.addClass("e-reorderindicate");
                        else $target.parent().addClass("e-reorderindicate");
                    }
                    if (proxy.model.allowScrolling) {
                        var pos = args.event.type == "touchmove" ? args.event.originalEvent.touches[0].pageX : args.event.pageX;
                        proxy._dragAutoScrollX(pos, args);
                    }
                    if ($target.hasClass('e-groupdroparea') || $target.closest('.e-groupdroparea').length) {
                        document.body.style.cursor = 'default';
                        $target.addClass("e-allowDrop");
                    }
                    else if ($target.hasClass('e-headercelldiv') || $target.hasClass('e-headercell')) {
                        document.body.style.cursor = 'pointer';
                    } else if ($target.hasClass("e-rowcell"))
                        document.body.style.cursor = 'not-allowed';
                },
                dragStop: function (args) {
                    if (!args.element.dropped) {
                        var $target = $(args.target);
                        var data = { target: $target, draggableType: "headercell", column: column };
                        proxy._trigger("columnDrop", data);
                        proxy.element.find(".e-groupdroparea").removeClass("e-hover");
                        proxy.getHeaderTable().find(".e-columnheader").find(".e-headercellactive").removeClass("e-headercellactive").removeClass("e-active");
                        if (!($(args.target).closest(".e-groupdroparea").length || ($(args.target).closest(".e-columnheader").length && proxy.model.allowReordering && !$(args.target).hasClass("e-stackedHeaderCell"))))
                            $(".e-dragclone").remove();
                        if ($(args.target).hasClass("e-rowcell") || $(args.target).hasClass("e-stackedHeaderCell"))
                            proxy.collapseGroupDropArea();
                        proxy._dragActive = false;
                        proxy.getHeaderTable().find(".e-reorderindicate").removeClass("e-reorderindicate");
                        document.body.style.cursor = '';
                        $(proxy._Indicator).css('display', 'none');
                    }
                }
            });
        },
        _groupHeaderCelldrag: function () {
            //grouped header cell drag.
            var $visualElement = ej.buildTag('div.e-cloneproperties e-grid', "", { 'height': '20px', 'z-index': 2 }), proxy;
            proxy = this;
            var $groupedHeaderCells = this.element.children(".e-groupdroparea").find(".e-groupheadercell");
            $groupedHeaderCells.ejDraggable({
                cursorAt: { top: 0, left: 0 },
                helper: function (event, ui) {
                    var $div = $(event.sender.target).closest(".e-grid-icon");
                    return $visualElement.text($(event.sender.target).closest(".e-groupheadercell").text()).clone().width($div.width() + 2).height($div.height() + 2).addClass("e-dragclone").appendTo(proxy.element);
                },
                dragStart: function (args) {
                    var target = args.target;
                    args.model.cursorAt = { top: 0, left: 0 };
                    var data = { target: target, draggableType: "groupheadercell" };
                    if (proxy._trigger("columnDragStart", data))
                        return false;
                },
                drag: function (args) {
                    $(".Sibling").remove();
                    var $target = $(args.target);
                    var data = { target: $target, draggableType: "groupheadercell" };
                    if (proxy._trigger("columnDrag", data))
                        return false;
                    if ($target.closest('div.e-gridcontent').length) {
                        document.body.style.cursor = '';
                        $target.addClass("e-allowDrop");
                    }
                    else if ($(args.target).closest(".e-columnheader").length > 0) {
                        document.body.style.cursor = 'pointer';
                    }
                    else
                        document.body.style.cursor = 'not-allowed';
                },
                dragStop: function (args) {
                    $(args.element).data("targetInstance", proxy);
                    if (!args.element.dropped) {
                        var $target = $(args.target);
                        var data = { target: $target, draggableType: "groupheadercell" };
                        if (!($(args.target).closest(".e-rowcell").length || $(args.target).closest(".e-groupcaption").length || $(args.target).closest(".e-columnheader").length ))
                            $(".e-dragclone").remove();
                        document.body.style.cursor = '';
                    }
                }
            });

            //grid content drop
            var $contentDroppableElements = this.element.children(".e-gridcontent, .e-gridheader");
            $contentDroppableElements.ejDroppable({
                accept: proxy.element.children("div.e-groupdroparea").find(".e-groupheadercell"),
                drop: function (event, ui) {
                    if (ej.isNullOrUndefined(ui.helper) || !ui.helper.is(":visible") || !ui.draggable.hasClass("e-groupheadercell"))
                        return;
                    var field = $(ui.draggable[0]).find("div").attr("data-ej-mappingname");
                    ui.helper.remove();
                    if (!ej.isNullOrUndefined(field)) {
                        var childProxy = $(ui.draggable).data("targetInstance");
                        childProxy.ungroupColumn(field);
                    }
                }
            });
        },

        //Rows DragAndDrop
        _rowsDragAndDrop: function () {
            this.dragRowElement();
            var $droppableElements = this.getContent();
            var proxy = this;
            $droppableElements.ejDroppable({
                accept: $droppableElements,
                drop: function (event, ui) {
                    var targetRow = $(event.dropTarget).closest("tr"), srcControl, currentPageIndex;
                    if (!ui.helper.find("tr.e-srcgridinfo").length)
                        return false;
                    proxy._draggedGridID = ui.helper.find("tr.e-srcgridinfo").children("td").text();
                    if (proxy._draggedGridID != proxy._id)
                        srcControl = $("#" + proxy._draggedGridID).ejGrid("instance");
                    else
                        srcControl = proxy;
                    if (srcControl._id != proxy._id && srcControl.model.rowDropSettings.dropTargetID != "#" + proxy._id)
                        return false;
                    var records =srcControl.selectedRowsIndexes.length >0 ? srcControl.getSelectedRecords():$(srcControl._currentJsonData[srcControl._dragIndex]);
                    if(!ej.isNullOrUndefined(srcControl._dragIndex))
					  srcControl._dragIndex = null;
					var targetIndex = currentPageIndex = proxy.getIndexByRow(targetRow), count = 0;
                    if (targetIndex == -1){
                        targetIndex = currentPageIndex = 0;
                        if(proxy.getRows().length != 0)
                            targetIndex = proxy.getRows().length;
                    }
                    var currentPage = proxy._currentPage() || 1;
                    targetIndex = targetIndex + (currentPage * proxy.model.pageSettings.pageSize) - proxy.model.pageSettings.pageSize;
                    var dropDetails = { sourceID: srcControl._id, destinationID: proxy._id, destinationRowIndex: targetIndex };
                    var args = { target: targetRow, targetIndex: targetIndex, draggedRecords: records, dropDetails: dropDetails };
                    if (proxy._trigger("beforeRowDrop", args)){
                        $(".e-dragclone").remove();
                        return;
                    }                   
                    var dataSource = proxy._dataSource() instanceof ej.DataManager ? proxy._dataSource().dataSource : proxy._dataSource();
                    if (!ej.isNullOrUndefined(proxy.model.rowDropSettings.dropMapper)) {
                        if (ej.isNullOrUndefined(dataSource.headers))
                            dataSource.headers = [];
                        dataSource.headers.push({ rowDropDetails: JSON.stringify(dropDetails) });
                    }
                    if (proxy._id != srcControl._id) {
                        var dm = proxy._dataManager, adaptor = proxy._dataSource().adaptor;
                        var srcBatch = srcControl.getBatchChanges();
                        if(srcControl.model.rowDropSettings.dragBehavior == "move")
                        srcBatch["deleted"] = records;
                        var args = { dropDetails: dropDetails, records: records, requestType: ej.Grid.Actions.Refresh, targetIndex: targetIndex, action: "rowDragged" };
                        proxy._processDropRequest(srcControl, srcBatch, "drag", args);

                        var batch = proxy.getBatchChanges(); batch["added"] = records;
                        args.action = "rowDropped";
                        proxy._processDropRequest(proxy, batch, "drop", args);
                    }
                    else {
                        if (proxy._draggedGridID == proxy._id) {
                            proxy.reorderRows(srcControl.selectedRowsIndexes, currentPageIndex);
                            $(".e-dragclone").remove();
                        }
                    }
                }
            });
        },
        _dragAutoScrollX: function (pos, args) {
            var Position = pos - this.element.offset().left;
            var contentwidth = this.element.width() - this.model.scrollSettings.scrollerSize;
            var scrollObj = this.getScrollObject();
            var proxy = this;
            if (scrollObj && scrollObj._hScrollbar) {
                if (Position < 5) {
                    this._dragLeftInterval = setInterval(function () {
                        if (proxy._dragLeftInterval) {
                            var scrolLeft = scrollObj.scrollLeft();
                            var AvgWidth = ej.sum(proxy.columnsWidthCollection) / proxy.model.columns.length;
                            if (scrolLeft > scrollObj._hScrollbar.model.minimum) {
                                if (scrolLeft > AvgWidth)
                                    scrollObj.scrollX(scrollObj.scrollLeft() - AvgWidth, true);
                                else
                                    scrollObj.scrollX(scrollObj._hScrollbar.model.minimum, true);
                            }
                            else
                                proxy._dragLeftInterval && (proxy._dragLeftInterval = clearInterval(proxy._dragLeftInterval));
                        }
                    }, 500);
                }
                else if (Position > (contentwidth - 5)) {
                    this._dragRightInterval = setInterval(function () {
                        if (proxy._dragRightInterval) {
                            var scrollLeft = scrollObj.scrollLeft();
                            var AvgWidth = ej.sum(proxy.columnsWidthCollection) / proxy.model.columns.length;
                            if (Math.round(scrollLeft) < scrollObj._hScrollbar.model.maximum)
                                scrollObj.scrollX(scrollObj.scrollLeft() + AvgWidth, true);
                            else
                                proxy._dragRightInterval && (proxy._dragRightInterval = clearInterval(proxy._dragRightInterval));
                        }
                    }, 500);
                }
                else {
                    this._dragLeftInterval && (this._dragLeftInterval = clearInterval(this._dragLeftInterval));
                    this._dragRightInterval && (this._dragRightInterval = clearInterval(this._dragRightInterval));
                }
            }
        },
        _dragAutoScroll: function (proxy, args) {
            var scrollObj = proxy.getContent().data("ejScroller");
            var contentOffset = proxy.getContent()[0].getBoundingClientRect();
            if (!contentOffset)
                contentOffset = proxy.getContent().offset();
            if (scrollObj && scrollObj._vScrollbar) {
                if (contentOffset.top >= args.event.clientY) {
                    proxy._dragUpInterval = setInterval(function () {
                        if (proxy._dragUpInterval) {
                            var scrollPixel = -proxy.getRowHeight();
                            var scrolTop = scrollObj.scrollTop();
                            if (scrolTop != 0)
                                scrollObj.scrollY(scrollObj.scrollTop() + scrollPixel, true);
                            else
                                proxy._dragUpInterval && (proxy._dragUpInterval = clearInterval(proxy._dragUpInterval));

                        }
                    }, 500);

                }
                else if (contentOffset.top + proxy.getContent().height() <= args.event.clientY) {
                    proxy._dragDownInterval = setInterval(function () {
                        if (proxy._dragDownInterval) {
                            var scrollPixel = proxy.getRowHeight();
                            var scrolTop = scrollObj.scrollTop();
                            if (Math.round(scrolTop) <= scrollObj._vScrollbar.model.maximum)
                                scrollObj.scrollY(scrollObj.scrollTop() + scrollPixel, true);
                            else
                                proxy._dragDownInterval && (proxy._dragDownInterval = clearInterval(proxy._dragDownInterval));

                        }
                    }, 500);

                }
                else {
                    proxy._dragUpInterval && (proxy._dragUpInterval = clearInterval(proxy._dragUpInterval));
                    proxy._dragDownInterval && (proxy._dragDownInterval = clearInterval(proxy._dragDownInterval));
                }
            }
        },
        dragRowElement: function () {
            var proxy = this;
            var $dragableElements = $(this.getRows());
            var column;
            //header element columnDrag
            $dragableElements.ejDraggable({
                cursorAt: { top: -8, left: -8 },
                helper: function (event, ui) {
                    this.clone = true;
                    var tr = $(event.element).closest("tr"),$tr;
                    if (proxy._selectDrag || !tr.length || ($.inArray(proxy.getIndexByRow(tr), proxy.selectedRowsIndexes) == -1 && proxy.model.selectionType != "single") )
                        return false;
                    var $visualElement = ej.buildTag('div.e-cloneproperties e-draganddrop e-grid e-js', "", { 'height': 'auto', 'z-index': 2, 'position': 'absolute', 'width': proxy.element.width() }), $tr;
                    $visualElement.append(ej.buildTag("table", "", { 'width': proxy.element.width() }));
                    var rows = $(proxy.getRows()).clone().removeClass();
                    var height = 0;
					if(proxy.model.selectionType != "single" && proxy.selectedRowsIndexes.length >0){
						$tr = $.map(rows, function (ele, idx) {
						if ($.inArray(idx, proxy.selectedRowsIndexes) != -1) {
                            return ele
                        }
						$($tr).find("td").removeClass("e-selectionbackground e-active");
						if (!tr.find("td.e-selectionbackground").length)
							$visualElement.css("display", "none");
						});
					}
					else
						$tr = tr.clone();
                    var infoTr = ej.buildTag('tr.e-srcgridinfo e-grid', "", { 'display': 'none', 'height': 'auto' }).append("<td>" + proxy._id + "</td>");
                    $tr.push(infoTr[0]);
                    $visualElement.find("table").append($tr);
                      return $visualElement.addClass("e-dragclone").appendTo($('body'));
                },
                dragStart: function (args) {
                    var tr = $(args.target).closest("tr");
                    if (proxy._selectDrag ||($.inArray(proxy.getIndexByRow(tr), proxy.selectedRowsIndexes) == -1 && proxy.model.selectionType != "single"))
                        return false;
                    var target = args.target;
                    var rows = proxy.selectedRowsIndexes.length >0  ?proxy.getRowByIndex(proxy.selectedRowsIndexes[0], proxy.selectedRowsIndexes[proxy.selectedRowsIndexes.length]):tr;
                    if(proxy.model.selectionType != "single" && proxy.selectedRowsIndexes.length >0)
					{
						var records = proxy.getSelectedRecords();	
					}
					 else{
						proxy._dragIndex=proxy.getIndexByRow(tr);
						var records = proxy._currentJsonData[proxy._dragIndex];				
					}	
                    var data = { target: rows, currentTarget: target, draggableType: "rows", data: records, draggedRecords: records };
                    if (proxy._trigger("rowDragStart", data)){
                        $(".e-dragclone").remove();
                        return false;
                    }
                },
                drag: function (args) {
                    var $target = $(args.target), isGrid = $target.closest(".e-grid");
                    if (args.event.type == 'touchmove' && isGrid.length) {
                        isGrid.find(".e-row.e-hover,.e-alt_row.e-hover").removeClass("e-hover");
                        $target.closest(".e-rowcell").parent().addClass("e-hover");
                    }
                    var rows = proxy.selectedRowsIndexes.length >0?proxy.getRowByIndex(proxy.selectedRowsIndexes[0], proxy.selectedRowsIndexes[proxy.selectedRowsIndexes.length]):proxy.getRowByIndex(proxy._dragIndex);
                    var records = proxy.selectedRowsIndexes.length >0?proxy.getSelectedRecords():proxy._currentJsonData[proxy._dragIndex];
					var data = { target: rows, currentTarget: $target, draggableType: "rows", data: records, draggedRecords: records};
                    proxy._dragAutoScroll(proxy, args);
                    if (proxy._trigger("rowDrag", data)){
                        $(".e-dragclone").remove();
                        return false;
                    }
                    document.body.style.cursor = 'not-allowed';
                    var dropEle = $(proxy.model.rowDropSettings.dropTargetID);
                    if ($target.closest(proxy.model.rowDropSettings.dropTargetID).length || $target.closest("#" + proxy._id).length) {
                        if ($target.closest(".e-grid").length && ($target.closest(".e-rowcell").length || $target.closest(".emptyrecord").length))
                            $target.closest("table").addClass("e-allowRowDrop")
                        else if (!dropEle.hasClass("e-grid"))
                            dropEle.addClass("e-allowRowDrop");
                    }
                },
                dragStop: function (args) {
                    var $target = $(args.target), isGrid = $target.closest(".e-grid");
                    if (args.event.type == 'touchend' && isGrid.length)
                        isGrid.find(".e-row.e-hover,.e-alt_row.e-hover").removeClass("e-hover");
                    if (!args.element.dropped) {
                        proxy._dragUpInterval && (proxy._dragUpInterval = clearInterval(proxy._dragUpInterval));
                        proxy._dragDownInterval && (proxy._dragDownInterval = clearInterval(proxy._dragDownInterval));
                        var rows = proxy.selectedRowsIndexes.length >0?proxy.getRowByIndex(proxy.selectedRowsIndexes[0], proxy.selectedRowsIndexes[proxy.selectedRowsIndexes.length]):proxy.getRowByIndex(proxy._dragIndex);
                        var records = proxy.selectedRowsIndexes.length >0?proxy.getSelectedRecords():proxy._currentJsonData[proxy._dragIndex];
						document.body.style.cursor = '';
                        var dropEle = $(proxy.model.rowDropSettings.dropTargetID);
                        dropEle.hasClass("e-grid") ? dropEle.find(".e-gridcontent").find("table").removeClass("e-allowRowDrop") : dropEle.removeClass("e-allowRowDrop");
                        proxy.getContent().find("table").removeClass("e-allowRowDrop");
                        var data = { rows: rows, target: $target, draggableType: "rows", data: records, droppedRecords: records };
						if(ej.isNullOrUndefined(this._checkTargetElement(args.event)))
						  $(".e-dragclone").remove();
                        if (proxy._trigger("rowDrop", data))
                            return false;
                    }
                }
            });
        },
        _processDropRequest: function (cntrl, batch, action, args) {
			if(args.action == "rowDragged")
				$(".e-dragclone").remove();
            var mapper = cntrl._dataManager.dataSource.batchUrl;
            cntrl._dataManager.dataSource.batchUrl = cntrl.model.rowDropSettings[action + "Mapper"];
            if (cntrl._isRemoteSaveAdaptor && cntrl._dataManager.dataSource.batchUrl == null) {
                if (action == "drop")
                    for (i = 0; i < batch.added.length; i++)
                        ej.JsonAdaptor.prototype.insert(cntrl._dataManager, batch.added[i]);
                else
                    for (i = 0; i < batch.deleted.length; i++)
                        ej.JsonAdaptor.prototype.remove(cntrl._dataManager, cntrl._primaryKeys[0], batch.deleted[i]);
            }
            var dragPromise = cntrl._dataManager.saveChanges(batch, cntrl._primaryKeys[0], cntrl.model.query._fromTable);
            if ($.isFunction(dragPromise.promise) && cntrl._dataManager.dataSource.batchUrl != null) {
                $("#" + cntrl._id).data("ejWaitingPopup").show();
                dragPromise.done(function (e) {
                    if (cntrl._isLocalData && (action == "drop")) {
                        if (args.dropDetails.sourceID == args.dropDetails.destinationID)
                            cntrl._moveDroppedRowIndex(args.targetIndex, args.records, args.draggedRowIndexes);
                        else
                            cntrl._moveDroppedRowIndex(args.targetIndex, args.records);
                    }
                    if (action == "drop")
                        cntrl._dataSource() instanceof ej.DataManager ? cntrl._dataSource().dataSource.headers.pop() : cntrl._dataSource().headers.pop();
                    cntrl._dataManager.dataSource.batchUrl = mapper;
                    cntrl.refreshBatchEditChanges();
                    $("#" + cntrl._id).data("ejWaitingPopup").hide();
                    cntrl._processBindings(args);
                });
                dragPromise.fail(function (e) {
                    cntrl._dataManager.dataSource.batchUrl = mapper;
                    $("#" + cntrl._id).data("ejWaitingPopup").hide();
                    args.error = (e && e.error) ? e.error : e;
                    cntrl._trigger("actionFailure", args)
                });
            }
            else {
                cntrl.refreshBatchEditChanges();
                cntrl._dataManager.dataSource.batchUrl = mapper;
                if (action == "drop")
                    cntrl._moveDroppedRowIndex(args.targetIndex, args.records);
                if (!(args.dropDetails.sourceID == args.dropDetails.destinationID && action == "drag"))
                    cntrl._processBindings(args);
            }
        },
        reorderRows: function (indexes, toIndex) {
            if (!this.model.sortSettings.sortedColumns.length) {
                var records = this.getSelectedRecords();
                this.selectedRowsIndexes = [];
                var args = { requestType: ej.Grid.Actions.Refresh, action: "rowReordering", draggedRowIndexes: indexes, targetIndex: toIndex, dropDetails: { sourceID: this._id, destinationID: this._id, DestinationRowIndex: toIndex }, records: records };
                if (ej.isNullOrUndefined(this.model.rowDropSettings.dropMapper)) {
                    if (this._trigger("actionBegin", args))
                        return false;
                    this._moveDroppedRowIndex(toIndex, records, indexes);
                    this._trigger("actionComplete", args)
                } else {
                    var batch = this.getBatchChanges();
                    batch["changed"] = records;
                    this._processDropRequest(this, batch, "drop", args);
                }
            }
        },
        _moveDroppedRowIndex: function (targetIndex, records, reorderFrom) {
            if (!ej.isNullOrUndefined(reorderFrom)) {
                var reorderFrom = reorderFrom.sort(function (a, b) { return a - b });
                var currentargetIndex = targetIndex, skip, index, count = 0;
                var currentRecords = this.model.currentViewData.slice();
                var targetRow = this.getRowByIndex(targetIndex);
                targetIndex += (this._currentPage() * this.model.pageSettings.pageSize) - this.model.pageSettings.pageSize;
                for (var i = 0; i < reorderFrom.length; i++) {
                    var data = currentRecords[reorderFrom[i]];
                    index = reorderFrom[i] - count;
                    skip = 0;
                    var rows = this._excludeDetailRows();
                    var srcRow = $(rows[index]);
                    if (currentargetIndex > index)
                        count++;
                    if (this.model.allowPaging)
                        skip = (this._currentPage() * this.model.pageSettings.pageSize) - this.model.pageSettings.pageSize;
                    index = skip + index;
                    this.selectedRowsIndexes.push(currentargetIndex - count);
                    if (i == reorderFrom.length - 1)
                        this.model.selectedRowIndex = this.selectedRowsIndexes[0];
                    if ((this.model.detailsTemplate != null || this.model.childGrid != null) && srcRow.next().hasClass("e-detailrow"))
                        srcRow = srcRow.add(srcRow.next()[0]);
                    targetRow.before(srcRow);
                    if (currentargetIndex < reorderFrom[i] - count)
                        currentargetIndex++
                    else
                        targetIndex--;
                    if (!(this._dataSource() instanceof ej.DataManager))
                        this._dataSource().splice(targetIndex + i, 0, this._dataSource().splice(index, 1)[0])
                    else
                        this._dataSource().dataSource.json.splice(targetIndex + i, 0, this._dataSource().dataSource.json.splice(index, 1)[0])
                    this.model.currentViewData.splice(targetIndex + i - skip, 0, this.model.currentViewData.splice(index - skip, 1)[0])
                }
            }
            else if (targetIndex > -1) {
                var data = this._dataSource() instanceof ej.DataManager ? this._dataSource().dataSource.json : this._dataSource();
                var currentIndex = targetIndex + (this._currentPage() * this.model.pageSettings.pageSize) - this.model.pageSettings.pageSize;
                for (var i = 0; i < records.length; i++) {
                    data.splice(targetIndex++, 0, data.splice(data.length - records.length + i, 1)[0]);
                }
            }
        },
    };
})(jQuery, Syncfusion);