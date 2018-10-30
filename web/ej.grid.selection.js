(function ($, ej, undefined) {
    ej.gridFeatures = ej.gridFeatures || {};
    ej.gridFeatures.selection = {
        
        selectRows: function (rowIndex, toIndex, target) {
            if (!this._allowrowSelection)
                return false;
            if (this._traverseRow != rowIndex)
                $(".e-traverse").removeClass("e-traverse");
            this._traverseRow = null;
            var rowIndexCollection = [];
			if(this.initialRender)
				this.model.currentIndex = rowIndex;
			if(this.model.scrollSettings.enableVirtualization){
				if ($.isArray(rowIndex))
					this.model.currentIndex = rowIndex[0];
				else if(toIndex){
					this.model.currentIndex = rowIndex > toIndex ? toIndex : rowIndex;
				}							
			}
            var scrollObj = null;
			if(this.model.allowScrolling && !ej.isNullOrUndefined(this.getContent().data("ejScroller")))
			  scrollObj = this.getScrollObject();
            if (!this.multiSelectCtrlRequest && this.model.scrollSettings.allowVirtualScrolling) {
                if (!this._virtuaOtherPage) {
                    if (!(scrollObj !=null && scrollObj.model.keyConfigs.down == "" && target)) this.clearSelection();
                    this._virtualScrollingSelection = false;
                }
                else
                    this._virtualScrollingSelection = true;
            }
            if ($.isArray(rowIndex)) {
                rowIndexCollection = rowIndex;
				rowIndex = rowIndexCollection[0];
				this._virtaulSel = [];
				if(this.model.scrollSettings.allowVirtualScrolling && !this.model.scrollSettings.enableVirtualization){										
					this._virtualScrollingSelection = true;
					this._virtualSelectedRows = rowIndexCollection;
					var from = (parseInt(rowIndex / this.model.pageSettings.pageSize)) * this.model.pageSettings.pageSize;
					var to = (parseInt((rowIndex / this.model.pageSettings.pageSize)) + 1) * this.model.pageSettings.pageSize;
					this._virtaulSel.push(rowIndex);
					if (!this._virtuaOtherPage)
						this._virtaulUnSel = []
					for (var i = 1; i < rowIndexCollection.length; i++) {
						if (from < rowIndexCollection[i] && rowIndexCollection[i] < to)
							this._virtaulSel.push(rowIndexCollection[i]);
						else
							this._virtaulUnSel.push(rowIndexCollection[i]);
					}										
				}
            }

            var $gridRows = $(this.getRows()),Data;
            if (this.model.allowScrolling && !this.multiSelectShiftRequest && (this.model.scrollSettings.frozenColumns == 0 && this.model.scrollSettings.frozenRows ==0 )) {
                var selectedRow = $gridRows.eq(rowIndex)[0];
                if (!ej.isNullOrUndefined(selectedRow) && this.model.groupSettings.groupedColumns.length == 0 && !ej.isNullOrUndefined(this.getContent().data("ejScroller"))) {
                    var scrollTop = scrollObj.scrollTop();
                    var ContentViewHeight = scrollTop + scrollObj.content()[0].clientHeight;
                    var selectedRowPos = selectedRow.offsetTop + selectedRow.offsetHeight;
                    var pixel = selectedRow.offsetTop, currentIndex = !target ? Math.ceil((rowIndex + 1) / this._virtualRowCount) : parseInt($(this._gridRows[rowIndex]).attr("name"), 32);
                    if (this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization) {
                        selectedRowPos += (ej.min(this._currentLoadedIndexes) - 1) * this._virtualRowCount * this._vRowHeight;
                        pixel = (this.model.currentIndex * this._vRowHeight) + rowIndex + selectedRow.offsetHeight;
                    }
                    var scrollBottom = ((selectedRowPos - this._vRowHeight) <= scrollTop && selectedRowPos < ContentViewHeight) && (rowIndex || scrollTop) ;
                    if (!ej.isNullOrUndefined(selectedRow) && ContentViewHeight < selectedRowPos || scrollBottom) {
                        if (scrollBottom) pixel = selectedRowPos - selectedRow.offsetHeight;
						if(scrollObj.model.keyConfigs.down == "") 
							pixel = this.model.selectedRowIndex < rowIndex ?  scrollObj.model.scrollTop + selectedRow.offsetHeight :  scrollObj.model.scrollTop - selectedRow.offsetHeight;
						var loadedIndex = this._currentLoadedIndexes;
                        (!this.model.scrollSettings.enableVirtualization || $.inArray(currentIndex, this._currentLoadedIndexes) != -1) && scrollObj.scrollY(pixel,true);
						if(scrollObj.model.keyConfigs.down == "" &&  JSON.stringify(this._currentLoadedIndexes)!= JSON.stringify(loadedIndex)) return;
                    }
                }
            }
            var args = {}, ascend, res, currentPage = this._currentPage() - 1, pageSize = this.model.pageSettings.pageSize;
            if (!this.model.scrollSettings.enableVirtualization) {
                var nameIndx = this.getRowByIndex(rowIndex).attr("name");
                var pageIndex = !ej.isNullOrUndefined(nameIndx) ? (parseInt(nameIndx) / pageSize) + 1 : rowIndex;
            }
            if (!ej.isNullOrUndefined(rowIndex)) {
                if (this.model.editSettings.editMode == "batch" && $($gridRows[rowIndex]).hasClass("e-insertedrow")) {
                    var addedrows = this.batchChanges.added.reverse();
					if(this.model.editSettings.rowPosition == "bottom"){
						if(rowIndex >= this.model.currentViewData.length){
							var Index = rowIndex - this.model.currentViewData.length;
						 var currentData = addedrows.slice(0);
						 Data = currentData.reverse()[Index];
						}
					}					
					else				
						Data = addedrows[rowIndex];
                    this.batchChanges.added.reverse();
                }
                else
                    Data = this.model.editSettings.editMode == "batch"?(this.model.editSettings.rowPosition == "bottom" ? this._currentJsonData[rowIndex]:this._currentJsonData[rowIndex - this.batchChanges.added.length]):this._currentJsonData[ej.isNullOrUndefined(rowIndex) ? toIndex : rowIndex];
            }
            var $rowIndex = rowIndex, $prevIndex = this._previousIndex, $prevRow = this.getRowByIndex(this._previousIndex), isSelection = "selectRows";
            args = { rowIndex: $rowIndex, row: $gridRows.eq(rowIndex), data: Data, selectedData: Data, target: target, prevRow: $prevRow, prevRowIndex: $prevIndex };
            if (this.model.scrollSettings.allowVirtualScrolling) {
				this._virtualDataRefresh = true;
                args = this._getVirtualRows(rowIndex, target, isSelection, rowIndexCollection);
                if(args == false)
                    return;
                if (!this.model.scrollSettings.enableVirtualization)
                    $rowIndex = rowIndex = args.rowIndex;
                else if (this._enableCheckSelect && ej.isNullOrUndefined(target) && args.row.length)
                    $rowIndex = rowIndex = args.row.index();
                Data = args.data;
                $prevIndex = args.prevRowIndex;
                $prevRow = args.prevRow;
            }
			if (target && target.hasClass("e-checkselectall")){
				if(this._isLocalData)
					args.data = this._dataSource() instanceof ej.DataManager ? this._dataSource().dataSource.json : this._dataSource();
				else
					args.data = this.model.currentViewData;
			}
            if (this._trigger("rowSelecting", args)) {
                if (this._enableCheckSelect && !ej.isNullOrUndefined(target) && (args.target.parent(".e-checkcelldiv").length || target.hasClass("e-checkselectall") ))
                    target.prop("checked", this.model.enableTouch);
                return;
            }
            if (target && target.hasClass("e-checkselectall") && this._isLocalData && this._isMapSelection)
                return this._headerCheckUpdateAll(!target[0].checked);
            var $gridRows = $(this.getRows());
            if (this._isMapSelection && !this._selectionByGrid && ej.isNullOrUndefined(toIndex) && !this.initialRender) {
                if (!rowIndexCollection.length) {
                    if (this.model.scrollSettings.frozenColumns) {
                        var index=this.model.columns.indexOf(ej.DataManager(this.model.columns).executeLocal(new ej.Query().where("type","equal","checkbox"))[0]);
                        $gridRows=$(this.getContent).find(index >= this.model.scrollSettings.frozenColumns ? ".e-movablecontent" : ".e-frozencontentdiv").find('tr')
                        Data[this._selectionMapColumn] = !$gridRows.eq(rowIndex).find($(".e-checkcelldiv input")).prop("checked");                                         
                    }
                    else
                    Data[this._selectionMapColumn] = !args.row.find(".e-checkcelldiv input").prop("checked");
                    this.updateRecord(this._primaryKeys[0], Data, "update");
                    return;
                }
            }
            if ((this.model.editSettings.allowEditing || this.model.editSettings.allowAdding) && this.model.isEdit && this.model.enableAutoSaveOnSelectionChange) {
                if (!(this.model.editSettings.showAddNewRow && this.model.editSettings.editMode == "normal") || this.getContentTable().find(".e-editedrow").length != 0) {
                    if (this.endEdit())
                        return; 
                    else if (this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate")
                        $("#" + this._id + "_externalEdit").css("display", "none");
                }
            }
            if (this.checkSelectedRowsIndexes[currentPage] == undefined && !this._isMapSelection)
                this.checkSelectedRowsIndexes[currentPage] = [];
            if (rowIndexCollection.length > 0) {
                for (var i = 0; i < rowIndexCollection.length; i++) {
                    this.selectedRowsIndexes.indexOf(rowIndexCollection[i]) == -1 && this.selectedRowsIndexes.push(rowIndexCollection[i]);
                    this._selectedMultipleRows(this.selectedRowsIndexes);
                    if (this._isMapSelection && !this._selectionByGrid) {
                        var cData = this._currentJsonData[rowIndexCollection[i]];
                        cData[this._selectionMapColumn] = true;
                        this.batchChanges.changed.push(cData);
                    }
                }
				if( !this.model.scrollSettings.enableVirtualization){
					var diff = this._virtaulSel[0] - rowIndex;
					for (var i = 0; i < this._virtaulSel.length; i++) {
						this._virtaulSel[i] -= diff;
					}
				}
                var rows = this.getRowByIndex(this.model.scrollSettings.allowVirtualScrolling ? this._virtaulSel : rowIndexCollection);
				for(var i = 0;i < rows.length;i++){
					if(ej.isNullOrUndefined(rows[i]))
						rows.splice(i,1);
				}
                $(rows).attr("aria-selected", "true").find('.e-rowcell, .e-detailrowcollapse, .e-detailrowexpand').addClass("e-selectionbackground e-active");
                if (this._enableCheckSelect && !this._isMapSelection) {
                    $(rows).find(".e-checkcelldiv input").prop("checked", "checked");
                }
                Array.prototype.push.apply(this.model.selectedRecords, this.getSelectedRecords());
                if (this._isMapSelection && !this._selectionByGrid && !this.initialRender) {
                    this.batchSave();
                    return;
                }
            }
            else if (ej.isNullOrUndefined(toIndex) || ej.isNullOrUndefined(rowIndex)) {
                rowIndex = ej.isNullOrUndefined(rowIndex) ? toIndex : rowIndex;
                $rowIndex = rowIndex;
                switch (this.model.selectionType) {
                    case ej.Grid.SelectionType.Multiple:
                        if (this.multiSelectCtrlRequest) {
                            this.model.selectedRecords = [];
                            var virtualIndex = $rowIndex;
                            if (this.model.scrollSettings.enableVirtualization && this._enableCheckSelect)
                                virtualIndex = args.rowIndex;
                            var selectedRowIndex = $.inArray($rowIndex, this.selectedRowsIndexes);
                            selectedRowIndex != -1 && !this._isMapSelection && this.clearSelection($rowIndex, target) && this.selectedRowsIndexes.splice(selectedRowIndex, 0);
                            if (selectedRowIndex == -1) {
                                this.selectedRowsIndexes.push($rowIndex);
								this._selectedMultipleRows(this.selectedRowsIndexes);
								var tr = this.getRowByIndex(rowIndex);
								if (this.model.scrollSettings.enableVirtualization && this._enableCheckSelect) {
								    var curRowIndex = parseInt(tr.attr("name"), 32);
								    var rowPage = curRowIndex % (this.model.pageSettings.pageSize / this._virtualRowCount);
								    if (rowPage == 0)
								        rowPage = (this.model.pageSettings.pageSize / this._virtualRowCount);
								    var curPage = Math.ceil((curRowIndex * this._virtualRowCount) / this.model.pageSettings.pageSize) - 1
								    var checkIndex = (args.rowIndex % this._virtualRowCount) + ((rowPage * this._virtualRowCount) - this._virtualRowCount);
								    if (this.checkSelectedRowsIndexes[curPage] == undefined && !this._isMapSelection)
								        this.checkSelectedRowsIndexes[curPage] = [];
								    this.checkSelectedRowsIndexes[curPage].push(checkIndex);
								}
                                tr.attr("aria-selected", "true").find('.e-rowcell, .e-detailrowcollapse, .e-detailrowexpand').addClass("e-selectionbackground e-active");
                                if (!this.model.scrollSettings.enableVirtualization)
                                    this._virtualSelectAction(pageIndex, rowIndex, pageSize);
                                else {
                                    this._virtualSelectedRecords[$rowIndex] = this._getSelectedViewData(rowIndex, target).data;
                                    this._virtualCheckSelectedRecords[args.rowIndex] = this._getSelectedViewData(rowIndex, target).data;
                                }
                                if ((this._enableCheckSelect && target && !target.parent().hasClass("e-checkcelldiv")) || (ej.isNullOrUndefined(target) && this._enableCheckSelect))
                                    tr.find(".e-checkcelldiv input").prop("checked", "checked");
                            }
                            Array.prototype.push.apply(this.model.selectedRecords, this.getSelectedRecords());
                            break;
                        }
                    case ej.Grid.SelectionType.Single:
                        this.clearSelection();
                        this.clearColumnSelection();
                        this.selectedRowsIndexes = [];
                        this.model.selectedRecords = [];
                        this._virtualSelectedRecords = {};
                        this._virtualCheckSelectedRecords = {};
                        this.selectedRowsIndexes.push($rowIndex);
						this._selectedMultipleRows(this.selectedRowsIndexes);
						if(this.model.scrollSettings.enableVirtualization&& (rowIndex > this.getRows().length)){
							var Index = rowIndex % this._virtualRowCount;
							$(this._virtualLoadedRows[this._currentVirtualIndex][Index]).attr("aria-selected", "true").find('.e-rowcell, .e-detailrowcollapse, .e-detailrowexpand').addClass("e-selectionbackground e-active");
						}
						else
							this.getRowByIndex(rowIndex).attr("aria-selected", "true").find('.e-rowcell, .e-detailrowcollapse, .e-detailrowexpand').addClass("e-selectionbackground e-active");
						if (!this.model.scrollSettings.enableVirtualization)
						    this._virtualSelectAction(pageIndex, rowIndex, pageSize);
						else {
						    this._virtualSelectedRecords[$rowIndex] = Data;
						    this._virtualCheckSelectedRecords[args.rowIndex] = Data;
						}
                        Array.prototype.push.apply(this.model.selectedRecords, this.getSelectedRecords());
                        this._enableCheckSelect && this.getRowByIndex(rowIndex).find(".e-checkcelldiv [type=checkbox]").prop("checked", true);
                        break;
                }
            } else {
                if (this.model.selectionType == ej.Grid.SelectionType.Multiple) {
                    !this._isMapSelection && this.clearSelection();
                    this.clearColumnSelection();
                    this.selectedRowsIndexes = [];
                    this.model.selectedRecords = [];                  
                    this._virtualSelectedRecords = {};
                    this._virtualCheckSelectedRecords = {};
                    this._selectedMultipleRows([]);
					var $toIndex = toIndex;					
					this._virtualUnSel = [];
					this._virtualUnSelIndexes = [];
					if (this._isMapSelection || !(target && target.hasClass("e-checkselectall") && target[0].checked) && !this._isCheckboxUnchecked || this._isCheckboxChecked) {
					    if (this.model.scrollSettings.enableVirtualization && (target && !target.hasClass("e-checkselectall"))) {
					        var viewIndex = this._getSelectedViewData(toIndex, target).viewIndex;
					        var remain = toIndex % this._virtualRowCount;
					        $toIndex = (viewIndex * this._virtualRowCount) - (this._virtualRowCount - remain);
					        if ($rowIndex != this._prevSelIndex) $rowIndex = this._prevSelIndex;
					    }
					    ascend = $rowIndex - $toIndex < 0;
                        var rows;
					    if (!this.model.scrollSettings.enableVirtualization)
					        rows = ascend ? this.getRowByIndex(rowIndex, toIndex + 1) : this.getRowByIndex(toIndex, rowIndex + 1);
					    if (this.model.scrollSettings.frozenColumns)
					        rows = $(rows[0]).add(rows[1]);
					    var rowIndexes = [];
					    for (var i = ascend ? $rowIndex : $toIndex, to = ascend ? $toIndex : $rowIndex; i <= to; i++) {
					        if (this.model.scrollSettings.allowVirtualScrolling) {
					            if (!this.model.scrollSettings.enableVirtualization) {
					                var nameIndx = this.getRowByIndex(i).attr("name");
					                var pageIndex = !ej.isNullOrUndefined(nameIndx) ? (parseInt(nameIndx) / pageSize) + 1 : rowIndex;
					                this._virtualSelectedRecords[selIndex] = this._getSelectedViewData(i).data;
					                this._virtualSelectAction(pageIndex, i, pageSize);
					            }
					            else {
					                var viewIndex = this._getSelectedViewData(i).viewIndex;
					                if ($.inArray(viewIndex, this._currentLoadedIndexes) != -1) {
					                    var indx = this._currentLoadedIndexes.indexOf(viewIndex);
					                    var selIndex = i % this._virtualRowCount + indx * this._virtualRowCount;
					                    if (selIndex == 0) indx * this._virtualRowCount;
					                    rowIndexes.push(selIndex);
					                }
					                else {
					                    this._virtualUnSel.push(i);
					                    if ($.inArray(viewIndex, this._virtualUnSelIndexes) == -1)
					                        this._virtualUnSelIndexes.push(viewIndex);
					                }
					            }
					        }
					        if (!(this.model.scrollSettings.enableVirtualization && this._enableCheckSelect) || this.getRowByIndex(i).length)
					                this.selectedRowsIndexes.push(i);
					            this._selectedMultipleRows(this.selectedRowsIndexes);

					        if (this._isMapSelection && !this._selectionByGrid) {
					            var cData = this._currentJsonData[i];
					            cData[this._selectionMapColumn] = !target[0].checked;
					            this.batchChanges.changed.push(cData);
					        }
					    }
						if(this.model.scrollSettings.enableVirtualization && this._enableCheckSelect){
							var cloneQuery = this.model.query.clone(), data = null;               
							this._virtualCheckSelectedRecords = {};
							cloneQuery.queries = cloneQuery.queries.filter(function(e,i){ return e.fn!="onPage" });
							if(this._isLocalData) 
								data = !(this._dataSource() instanceof ej.DataManager) ? ej.DataManager(this._dataSource()).executeLocal(cloneQuery).result : this._dataSource().executeLocal(cloneQuery).result;
							ej.copyObject(true,this._virtualCheckSelectedRecords, ej.isNullOrUndefined(data) ? this._currentJsonData : data);
						}
					    if (this._isMapSelection) {
					        this.batchSave();
					        return;
					    }
					    if (this.model.scrollSettings.enableVirtualization)
					        rows = this.getRowByIndex(rowIndexes[0], rowIndexes[rowIndexes.length - 1] + 1);
					    $(rows).attr("aria-selected", "true").find('.e-rowcell, .e-detailrowcollapse, .e-detailrowexpand').addClass("e-selectionbackground e-active");
					    Array.prototype.push.apply(this.model.selectedRecords, this.getSelectedRecords());
					    if (this._enableCheckSelect)
					        $(rows).find(".e-checkcelldiv input").prop("checked", "checked");
						    if(this.multiSelectShiftRequest)
								target.prop("checked",false);
							this._isCheckboxChecked = false;
							this._isCheckboxUnchecked = false;
					}
                }
            }
            if (this._enableCheckSelect) {
                if (!this.model.scrollSettings.enableVirtualization)
                    this.checkSelectedRowsIndexes[currentPage] = this.selectedRowsIndexes;
                if (!this._selectAllCheck) {
                    if (this.selectedRowsIndexes.length == this._currentJsonData.length || this.model.allowScrolling && this.model.scrollSettings.allowVirtualScrolling && [].concat.apply([], this.checkSelectedRowsIndexes).length >= this._gridRecordsCount)
                        this.getHeaderTable().find(".e-headercelldiv .e-checkselectall").prop("checked", "checked");
                    else if (this._selectionByGrid)
                        this.getHeaderTable().find(".e-headercelldiv .e-checkselectall").prop("checked", false);
                }
            }
            if (this._selectedRow() !== $rowIndex && $(this.getRowByIndex($rowIndex)).attr("aria-selected") == "true")
                this._selectedRow($rowIndex);
            if (target && target.hasClass("e-checkselectall") && !this._isMapSelection) {
                var gridInstance = this;
				var totalPage = this._dataSource() instanceof ej.DataManager && this.model.scrollSettings.allowVirtualScrolling && this.model.allowScrolling && !this.model.scrollSettings.enableVirtualization ? Math.ceil(this._gridRecordsCount / this.model.pageSettings.pageSize) :this.model.pageSettings.totalPages;
				var sel = this.model.enableTouch ? !target.is(":checked") : target.is(":checked");
				this.checkSelectedRowsIndexes = sel ? $.map(Array(totalPage), function (x, i) { x = Array($.map(Array(gridInstance.model.pageSettings.pageSize), function (x2, i2) { return i2 })); return x; }) : [];
				var totalcount = [].concat.apply([], this.checkSelectedRowsIndexes).length;
				if (!target.is(":checked") && totalcount > this._gridRecordsCount) this.checkSelectedRowsIndexes[this.checkSelectedRowsIndexes.length - 1].splice(this._gridRecordsCount - totalcount);
            }
            Data = this._virtualScrollingSelection ? this._virtualSelRecords : Data;
			var selectedIndex = this.model.scrollSettings.enableVirtualization ? $rowIndex : this._selectedRow();
            var args = { rowIndex: selectedIndex, row: this.getRowByIndex(this._selectedRow()), data: Data, selectedData: Data, target: target, prevRow: $prevRow, prevRowIndex : $prevIndex };
            this._previousIndex = this.selectedRowsIndexes.length ? rowIndex :this._previousIndex;
			if(this.model.scrollSettings.enableVirtualization){
				this._prevSelIndex = $rowIndex; 
				this._prevSelRow = this.getRowByIndex(rowIndex);
			}
			for (var i = 0; i < this.checkSelectedRowsIndexes.length; i++) {
			    if (ej.isNullOrUndefined(this.checkSelectedRowsIndexes[i]))
			        this.checkSelectedRowsIndexes[i] = [];
			}
			this.model._checkSelectedRowsIndexes = this.checkSelectedRowsIndexes;
			if (target && target.hasClass("e-checkselectall")){
				if(this._isLocalData)
					args.data = this._dataSource() instanceof ej.DataManager ? this._dataSource().dataSource.json : this._dataSource();
				else
					args.data = this.model.currentViewData;
			}
			if ($(this.getRowByIndex(rowIndex)).is('[data-role="row"]') && $(this.getRowByIndex($rowIndex)).attr("aria-selected") == "true")
                this._trigger("rowSelected", args);            
        },
        _getVirtualRows: function (rowIndex, target, isSelection, rowIndexCollection) {
		    var $rowIndex = rowIndex,$prevIndex = this._previousIndex, $prevRow = this.getRowByIndex(this._previousIndex),res,Data,args = {};
		    var $gridRows = $(this.getRows()), preventDynamicSelection=false;
		     if(this.model.scrollSettings.enableVirtualization){					
					var virtualRowCount = this._virtualRowCount;
					var currentIndex = !target ? Math.ceil((rowIndex + 1) / virtualRowCount) : parseInt($(this._gridRows[rowIndex]).attr("name"), 32);
					var rowCount = currentIndex > 1 ? this._virtualRowCount: 0;					
					if (this.initialRender || (currentIndex != this._currentVirtualIndex && !target)) {
					    this._isThumbScroll = true;
                        if(ej.isNullOrUndefined(this._virtualLoadedRecords[currentIndex]) && !this._isLocalData){
                            this._dynamicSelectedRowIndex = rowIndex;
                            preventDynamicSelection = true;
                        }
					    if ($.inArray(currentIndex, this._currentLoadedIndexes) == -1 && isSelection != "clearSelection")
						    this._refreshVirtualView(currentIndex, isSelection, rowIndex);
                            if(preventDynamicSelection)
                                return false;
						rowIndex = rowIndex != 0 ? rowIndex % this._virtualRowCount + rowCount : rowIndex;			
						}					
					else {						
					    if (rowIndex > this._virtualRowCount * 3 || !ej.isNullOrUndefined(target) && !$(target).parent().hasClass("e-headercelldiv") && !ej.isNullOrUndefined(target[0]) && !target[0].checked) {
							var viewIndex = this._getSelectedViewData(rowIndex, target).viewIndex;
							var remain = rowIndex % this._virtualRowCount;
							$rowIndex = (viewIndex * this._virtualRowCount) - (this._virtualRowCount - remain);
                        }
					    else {
					        var nameAttr = $(this._gridRows[rowIndex]).attr("name");
					        var trIndex = parseInt(nameAttr, 32);
					        var trSiblings = $(this._gridRows[rowIndex]).prevAll("tr[name=" + nameAttr + "]").length;
					        $rowIndex = ((trIndex - 1) * this._virtualRowCount) + trSiblings;
                        }
                    }
					if(rowIndexCollection.length){												
						for(var i = 0; i < rowIndexCollection.length; i++){
							var viewIndex = this._getSelectedViewData(rowIndexCollection[i]).viewIndex;
							if($.inArray(viewIndex, this._currentLoadedIndexes) != -1)
								this._virtaulSel.push(rowIndexCollection[i]);
							if (!this._virtualSelectedRecords[rowIndexCollection[i]]) {
							    this._virtualSelectedRecords[rowIndexCollection[i]] = this._getSelectedViewData(rowIndexCollection[i]).data;
							    this._virtualCheckSelectedRecords[rowIndexCollection[i]] = this._getSelectedViewData(rowIndexCollection[i]).data;
							}
						}					
					}
					Data = this._getSelectedViewData(rowIndex, target, currentIndex).data;
					$prevIndex = this._prevSelIndex;
					$prevRow = this._prevSelRow;
				}
				else{
					var pageSize = this.model.pageSettings.pageSize;
					var nameIndx = this.getRowByIndex(rowIndex).attr("name");
					var pageIndex = !ej.isNullOrUndefined(nameIndx) ? (parseInt(nameIndx) / pageSize) + 1 : rowIndex;
					var trIndex = (rowIndex) % (pageSize);
					var pageto = parseInt(rowIndex / pageSize);
					var nameattr = pageto * pageSize;
					if ((!ej.isNullOrUndefined(pageto) && pageto > 0 && $.inArray(nameattr, this.virtualLoadedPages) == -1) && ej.isNullOrUndefined(target) && !(this._requestType =="save" || this._requestType == "cancel")) {
						trIndex--; this._virIndex = true;
						this._virtualTrIndex=trIndex;
						this.gotoPage(pageto + 1);
						var proxy = this;
						if (this._dataSource() instanceof ej.DataManager) {
							this._queryPromise.done(function (e) {
								proxy._virtuaOtherPage=true;
								proxy._virtualdata = proxy._currentJsonData;
								proxy._pageTo = pageto;
								if(proxy._virtualScrollingSelection)
									proxy._virtualSelRecords = e.virtualSelectRecords;
								var from = (parseInt(rowIndex / proxy.model.pageSettings.pageSize)) * proxy.model.pageSettings.pageSize;
								var to = (parseInt((rowIndex / proxy.model.pageSettings.pageSize)) + 1) * proxy.model.pageSettings.pageSize;
								var _selctRow = []
								_selctRow.push(rowIndex);
								for (var i = 1; i < rowIndexCollection.length; i++)
									if (from < rowIndexCollection[i] && rowIndexCollection[i] < to)
										_selctRow.push(rowIndexCollection[i]);
								proxy.selectRows(_selctRow);
								return false;
							});
							if(proxy._virtualScrollingSelection)
								return;
						}
						else {
							proxy._virtualdata = proxy._currentJsonData;
							if (rowIndexCollection.length > 0) {
								proxy._virtualSelRecords = [];
								for (var i = 0; i < rowIndexCollection.length; i++) {
									proxy._virtualSelRecords.push(this.model.dataSource[rowIndexCollection[i]]);
								}
							}
							proxy._pageTo = pageto;
						}
					}
					if (this._virtuaOtherPage) {
						this._virtuaOtherPage=false;
					}
					res = !ej.isNullOrUndefined(ej.getObject(pageIndex, this._virtualLoadedRecords)) ? this._virtualLoadedRecords[pageIndex] : this.model.previousViewData;
					Data = ej.isNullOrUndefined(res) ? this._currentJsonData[trIndex] : res[trIndex];
					Data = this._virtualScrollingSelection ? this._virtualSelRecords : Data;
					var nameattr = this._pageTo * pageSize;
					if (!ej.isNullOrUndefined(this._virtualdata) && this._virtualdata.length > 0) {
						rowIndex = $(document.getElementsByName(nameattr)[trIndex]).index();
						Data = this._virtualdata[trIndex];
						this._virtualdata = [];
					}
					else if ($(document.getElementsByName(pageto * pageSize)).length > 0 && !ej.isNullOrUndefined(this._pageTo))
						rowIndex = $(document.getElementsByName(pageto * pageSize)[rowIndex % pageSize]).index();
				}
		     args = { rowIndex: !this.model.scrollSettings.enableVirtualization ? (!(this._requestType == "save" || this._requestType == "cancel") ? rowIndex : rowIndex % pageSize) : $rowIndex, row: $gridRows.eq(rowIndex), data: Data, selectedData: Data };
			   if (isSelection == "selectRows") {
			       args.prevRow = $prevRow;
			       args.prevRowIndex = $prevIndex;
			   }
		       return args; 
          },
        _selectingMultipleRows: function (selectedIndexes) {
            this._modelMultiSelectedIndexes = selectedIndexes;
            this.clearSelection();
            this.multiSelectCtrlRequest = true;
            for (var index = 0; index < selectedIndexes.length; index++)
                this.selectRows(selectedIndexes[index])
            this.multiSelectCtrlRequest = false;
            this._modelMultiSelectedIndexes = [];
        },
        _virtualSelectAction: function (pageIndex, rowIndex, pageSize) {
            if (this.model.scrollSettings.allowVirtualScrolling && !ej.isNullOrUndefined(rowIndex)) {
                if (!ej.isNullOrUndefined(this._virtualLoadedRecords[pageIndex])) {
                    this._virtualSelectedRecords[rowIndex] = this._virtualLoadedRecords[pageIndex][rowIndex % pageSize];
                    this._virtualCheckSelectedRecords[((pageIndex - 1) * pageSize) + rowIndex] = this._virtualLoadedRecords[pageIndex][rowIndex % pageSize];
                }
                else {
                    this._virtualSelectedRecords[rowIndex] = this._currentJsonData[rowIndex % pageSize];
                    this._virtualCheckSelectedRecords[((pageIndex - 1) * pageSize) + rowIndex] = this._currentJsonData[rowIndex % pageSize];
                }
            }
        },
		_getSelectedViewData: function(rowIndex, target, currentViewIndex){
			var index = rowIndex % this._virtualRowCount, viewIndex, result = {};
			if(target)
				viewIndex = parseInt($(target).closest("tr").attr("name"), 32);
			else if(currentViewIndex)
				viewIndex = currentViewIndex;
			else
				viewIndex = rowIndex > 1 ? Math.ceil((rowIndex + 1) / this._virtualRowCount) : 1;
			result["viewIndex"] = viewIndex;
			if(this._virtualLoadedRecords[viewIndex])
				result["data"] = this._virtualLoadedRecords[viewIndex][index];
			var remain = rowIndex % this._virtualRowCount;	
			result["rowIndex"] = (viewIndex * this._virtualRowCount) - (this._virtualRowCount - remain);
			return result;
		},
        selectCells: function (rowCellIndexes) {
            if (!this._allowcellSelection)
                return false;
            this._lastSelectedCellIndex = rowCellIndexes;
            var $cell = null, previousRowCell, prevRowCellIndex;
            var gridRows = this._excludeDetailRows();
            if (this.model.scrollSettings.frozenColumns)
                $cell = this._frozenCell(rowCellIndexes[0][0], rowCellIndexes[0][1][0]);
            else
                $cell = gridRows.eq(rowCellIndexes[0][0]).find(".e-rowcell:eq(" + rowCellIndexes[0][1] + ")");				
            if(!ej.isNullOrUndefined(this._previousRowCellIndex) && this._previousRowCellIndex.length != 0 ){
				if(this.model.scrollSettings.enableVirtualization){
					previousRowCell = this._prevRowCell;
					prevRowCellIndex = this._preVirRowCellIndex;
				}
				else{
					previousRowCell = $(this.getRowByIndex(this._previousRowCellIndex[0][0]).find(".e-rowcell:eq("+this._previousRowCellIndex[0][1]+")"));
					prevRowCellIndex = this._previousRowCellIndex;
				}
			}			
			var $data = this._currentJsonData[rowCellIndexes[0][0]], $rowIndex = rowCellIndexes[0][0], viewDetails;
			if(this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization){
				viewDetails = this._getSelectedViewData(rowCellIndexes[0][0], $cell);
				$data = viewDetails.data;
				$rowIndex = viewDetails.rowIndex;
			}				
            var args = { currentCell: $cell, cellIndex: rowCellIndexes[0][1], data: $data, selectedData: $data, previousRowCellIndex: prevRowCellIndex, previousRowCell: previousRowCell };
            if (this.model.selectionType == "multiple") {
                args["isCtrlPressed"] = this.multiSelectCtrlRequest;
                args["isShiftPressed"] = this.multiSelectShiftRequest;
            }
            if (this._trigger("cellSelecting", args))
                return;
            switch (this.model.selectionType) {
                case ej.Grid.SelectionType.Multiple:
                    if (this.multiSelectCtrlRequest) {
                        var selectedCellIndex = $.inArray($rowIndex, this._rowIndexesColl);
                        if (selectedCellIndex != -1)
                            this.selectedRowCellIndexes[selectedCellIndex].cellIndex.push(parseInt(rowCellIndexes[0][1].toString()));
                        else {
                            if ($.inArray($rowIndex, this._rowIndexesColl) == -1)
                                this._rowIndexesColl.push($rowIndex);
                            this.selectedRowCellIndexes.push({ rowIndex: $rowIndex, cellIndex: rowCellIndexes[0][1] });
                        }
                        $cell.addClass("e-cellselectionbackground e-activecell");
                        break;
                    }
                    else if (this._selectDrag || (this.multiSelectShiftRequest && this._previousRowCellIndex != undefined)) {
                        this.clearCellSelection();
                        this.clearColumnSelection();
                        this.selectedRowCellIndexes = [];
                        var previousRowIndex = this._previousRowCellIndex[0][0];
                        var previousCellIndex = parseInt(this._previousRowCellIndex[0][1]);
                        var currentRowIndex = rowCellIndexes[0][0];
                        var currentCellIndex = parseInt(rowCellIndexes[0][1]);
						if(this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization){
							previousRowIndex = this._preVirRowCellIndex[0][0];
							currentRowIndex = this._getSelectedViewData(currentRowIndex, this.getRowByIndex(currentRowIndex).find(".e-rowcell")).rowIndex;
						}
                        var newCellColl = [];
                        var min, max;
                        if(this.model.selectionSettings.cellSelectionMode == "box"){
							var $rowCount =  this.model.scrollSettings.frozenColumns ? this.getRows()[0].length - 1 : this.getRows().length - 1;
							var pCellIndex = previousCellIndex < currentCellIndex ? previousCellIndex : currentCellIndex;
							var cCellIndex = pCellIndex == currentCellIndex ? previousCellIndex : currentCellIndex;	
							var newRowColl = [], newCellColl = [];							
							for (var i = pCellIndex; i <= cCellIndex; i++) {								
								min = previousRowIndex;									
								max = currentRowIndex;
								if( min < max ){
									for (var j = min; j <= max; j++) {
										$.inArray(j, newRowColl) == -1 && newRowColl.push(j);											
										this._selectMultipleCells(j, i, currentCellIndex, previousCellIndex);										
									}
								}
								else{
									for (var j = max; j <= min; j++) {
										$.inArray(j, newRowColl) == -1 && newRowColl.push(j);											
										this._selectMultipleCells(j, i, currentCellIndex, previousCellIndex);										
									}
								}
								newCellColl.push(i);								
							}							
							for(var i = 0; i < newRowColl.length; i++){								
								this.selectedRowCellIndexes.push({ rowIndex: newRowColl[i], cellIndex: newCellColl });										
							}
							this._rowIndexesColl = ej.distinct(newRowColl);
						}
                        else if (currentRowIndex > previousRowIndex) {
                            for (var i = previousRowIndex; i <= currentRowIndex; i++) {
                                newCellColl = [];
                                min = i == previousRowIndex ? previousCellIndex : 0;
                                max = i == currentRowIndex ? currentCellIndex : this.model.columns.length - 1;
                                for (var j = min; j <= max; j++) {
                                    newCellColl.push(j);
                                    this._selectMultipleCells(i, j, currentCellIndex, previousCellIndex);
                                }								
                                this.selectedRowCellIndexes.push({ rowIndex: i, cellIndex: newCellColl });
                                this._rowIndexesColl.push(i);
                            }
                        } 						 						
						else {
                            for (var i = previousRowIndex; i >= currentRowIndex; i--) {
                                newCellColl = [];
                                min = i == previousRowIndex ? previousCellIndex : this.model.columns.length - 1;
                                max = i == currentRowIndex ? currentCellIndex : 0;
								if( min > max ){
									for (var j = min; j >= max; j--) {
										newCellColl.push(j);
										this._selectMultipleCells(i, j, currentCellIndex, previousCellIndex);
									}
								}
								else{
									for (var j = max; j >= min; j--) {
										newCellColl.push(j);
										this._selectMultipleCells(i, j, currentCellIndex, previousCellIndex);
									}
								}                                
                                this.selectedRowCellIndexes.push({ rowIndex: i, cellIndex: newCellColl });
                                this._rowIndexesColl.push(i);
                            }
                        }
                        break;
                    }
                    else {
                        this.clearCellSelection();
						this._virtualRowCellSelIndex = [];
                        for (var i = 0; i < rowCellIndexes.length; i++) {
                            if (rowCellIndexes[i][1].length > 1) {
                                var td = gridRows.eq(rowCellIndexes[i][0]).find(".e-rowcell");
                                if (this.model.scrollSettings.frozenColumns)
                                    td = $(gridRows[0]).eq(rowCellIndexes[i][0]).find(".e-rowcell").add($(gridRows[1]).eq(rowCellIndexes[i][0]).find(".e-rowcell"));
                                for (var j = 0; j < td.length; j++) {
                                    var index = (this.model.detailsTemplate != null || this.model.childGrid != null) ? td[j].cellIndex - 1 : j;
                                    if ($.inArray(index, rowCellIndexes[i][1]) != -1) {
                                        $(td[j]).addClass("e-cellselectionbackground e-activecell");
                                        var selectedCellIndex = $.inArray(rowCellIndexes[i][0], this._rowIndexesColl);
                                        if (selectedCellIndex != -1)
                                            this.selectedRowCellIndexes[selectedCellIndex].cellIndex.push(td[j].cellIndex);
                                        else {
											$rowIndex = rowCellIndexes[i][0];
											if(this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization){
												viewDetails = this._getSelectedViewData($rowIndex, td);
												$data = viewDetails.data;
												$rowIndex = viewDetails.rowIndex;
											}
                                            this.selectedRowCellIndexes.push({ rowIndex: $rowIndex, cellIndex: [td[j].cellIndex] });
                                            this._rowIndexesColl.push(rowCellIndexes[i][0]);
                                        }
                                    }
                                }
                            }
                            else {
                                if (this.model.scrollSettings.frozenColumns)
                                    this._frozenCell(rowCellIndexes[i][0], rowCellIndexes[i][1][0]).addClass("e-cellselectionbackground e-activecell");
                                else
                                    $(this.getRowByIndex(rowCellIndexes[i][0]).find(".e-rowcell:eq(" + rowCellIndexes[i][1] + ")")).addClass("e-cellselectionbackground e-activecell");
                                this.selectedRowCellIndexes.push({ rowIndex: $rowIndex, cellIndex: rowCellIndexes[i][1] });
                                this._rowIndexesColl.push($rowIndex);
                            }
                        }
                        break;

                    }
                case ej.Grid.SelectionType.Single:
                    this.clearCellSelection();
                    this.clearColumnSelection();
                    this.selectedRowCellIndexes = [];
					this._virtualRowCellSelIndex = [];
                    if ($.inArray($rowIndex, this._rowIndexesColl) == -1)
                       this._rowIndexesColl.push($rowIndex);
                    this.selectedRowCellIndexes.push({ rowIndex: $rowIndex, cellIndex: rowCellIndexes[0][1] });
                    if (this.model.scrollSettings.frozenColumns)
                        this._frozenCell(rowCellIndexes[0][0], rowCellIndexes[0][1][0]).addClass("e-cellselectionbackground e-activecell");
                    else
						$(this.getRowByIndex(rowCellIndexes[0][0]).find(".e-rowcell:eq(" + rowCellIndexes[0][1] + ")")).addClass("e-cellselectionbackground e-activecell");
                    break;
            }
            var args = { currentCell: $cell, cellIndex: rowCellIndexes[0][1], data: $data, selectedData: $data, selectedRowCellIndex: this.selectedRowCellIndexes, previousRowCellIndex: prevRowCellIndex, previousRowCell: previousRowCell};
            if (!this._selectDrag && (!this.multiSelectShiftRequest || ej.isNullOrUndefined(this._previousRowCellIndex))){
				this._previousRowCellIndex = rowCellIndexes;
				if(this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization){					
					this._preVirRowCellIndex = $.extend(true, [], rowCellIndexes);
					this._preVirRowCellIndex[0][0] = $rowIndex;
				}											
				this._prevRowCell = $cell;
            }
            if (!ej.isNullOrUndefined(rowCellIndexes[0][1][0])) {
                $.extend(this._bulkEditCellDetails, {
                    rowIndex: rowCellIndexes[0][0],
                    columnIndex: rowCellIndexes[0][1][0],
                });
            }
            else {
                $.extend(this._bulkEditCellDetails, {
                    rowIndex: rowCellIndexes[0][0],
                    columnIndex: rowCellIndexes[0][1],
                });
            }
            if (this._trigger("cellSelected", args))
                return;			
        },
		_selectMultipleCells: function(i, j, currentCellIndex, previousCellIndex){			
			if (this.model.scrollSettings.frozenColumns)
				this._frozenCell(i, j).addClass("e-cellselectionbackground e-activecell");
			else{				
				if(this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization){
					var viewIndex = this._getSelectedViewData(i).viewIndex;
					if($.inArray(viewIndex, this._currentLoadedIndexes) != -1){
						var indx = this._currentLoadedIndexes.indexOf(viewIndex);
						var selIndex = i % this._virtualRowCount + indx * this._virtualRowCount;						
						$(this.getRowByIndex(selIndex).find(".e-rowcell:eq(" + j + ")")).addClass("e-cellselectionbackground e-activecell");
						if($.inArray(i, this._virtualRowCellSelIndex) == -1 && $.inArray(i, this._rowIndexesColl) != -1 && i != this._preVirRowCellIndex[0][0])
							this._virtualRowCellSelIndex.push(i);
					}					
				}
				else
					$(this.getRowByIndex(i).find(".e-rowcell:eq(" + j + ")")).addClass("e-cellselectionbackground e-activecell");
			}
		},

        
        selectColumns: function (columnIndex, toIndex) {
            if (!this._allowcolumnSelection)
                return false;
            this._allowcolumnSelection = true;
            var gridRows = this.getRows();            
            var prevColumnHeaderCell = this.getHeaderTable().find('.e-columnheader').last().find('th.e-headercell').not('.e-detailheadercell')[this._previousColumnIndex];
            var args = { columnIndex: columnIndex == undefined ? toIndex : columnIndex, headerCell: $(this.getHeaderTable().find('.e-columnheader').last().find('th.e-headercell').not('.e-detailheadercell')[columnIndex]), column: this.model.columns[columnIndex], previousColumnIndex: this._previousColumnIndex, prevColumnHeaderCell: prevColumnHeaderCell };
            var $precolIndex = this._previousColumnIndex;
            if ((args["isShiftPressed"] = this.multiSelectShiftRequest) == true)
                this._previousColumnIndex = columnIndex == undefined ? toIndex : columnIndex;
            else
                this._previousColumnIndex = toIndex;
            if (this.model.selectionType == "multiple") {
                args["isCtrlPressed"] = this.multiSelectCtrlRequest;
                args["isShiftPressed"] = this.multiSelectShiftRequest;
            }
            if (this._trigger("columnSelecting", args))
                return;
            if (ej.isNullOrUndefined(toIndex) || ej.isNullOrUndefined(columnIndex)) {
                columnIndex = ej.isNullOrUndefined(columnIndex) ? toIndex : columnIndex;
                switch (this.model.selectionType) {
                    case ej.Grid.SelectionType.Multiple:
                        if (this.multiSelectCtrlRequest) {
                            var selectedColumnIndex = $.inArray(columnIndex, this.selectedColumnIndexes);
                            selectedColumnIndex != -1 && this.clearColumnSelection(columnIndex) && this.selectedColumnIndexes.splice(selectedColumnIndex, 0);
                            if (selectedColumnIndex == -1) {
                                this.selectedColumnIndexes.push(columnIndex);
                                this._previousColumnIndex = this.selectedColumnIndexes.length ? columnIndex : undefined;
                                if (this.model.scrollSettings.frozenColumns)
                                    this._frozenColumnSelection(gridRows, columnIndex);
                                else
                                    for (var i = 0; i < gridRows.length; i++) {
                                        $(this._excludeDetailCells(gridRows[i])[columnIndex]).addClass("e-columnselection");
                                    }
                                $(this.getHeaderTable().find("th.e-headercell:not(.e-stackedHeaderCell,.e-detailheadercell)")[columnIndex]).addClass("e-columnselection");
                            }
                            break;
                        }
                    case ej.Grid.SelectionType.Single:
                        this.clearSelection();
                        this.clearCellSelection();
                        this.clearColumnSelection();
                        this.selectedColumnIndexes = [];
                        this.selectedColumnIndexes.push(columnIndex);
                        this._previousColumnIndex = this.selectedColumnIndexes.length ? columnIndex : undefined;
                        if (this.model.scrollSettings.frozenColumns)
                            this._frozenColumnSelection(gridRows, columnIndex);
                        else
                        for (var i = 0; i < gridRows.length; i++) {
                            $(this._excludeDetailCells(gridRows[i])[columnIndex]).addClass("e-columnselection");
                        }
                        $(this.getHeaderTable().find("th.e-headercell:not(.e-stackedHeaderCell,.e-detailheadercell)")[columnIndex]).addClass("e-columnselection");
                        break;
                }
            } else {
                if (this.model.selectionType == ej.Grid.SelectionType.Multiple) {
                    this.clearColumnSelection();
                    this.selectedColumnIndexes = [];
                    var indent = 0;
                    if (this.model.detailsTemplate != null || this.model.childGrid != null) {
                        indent = 1;
                    }
                    var startIndex = columnIndex > toIndex ? toIndex : columnIndex;
                    var endIndex = columnIndex > toIndex ? columnIndex + 1 : toIndex + 1;
                    if (this.model.scrollSettings.frozenColumns)
                        this._frozenColumnSelection(gridRows, startIndex, endIndex);
                    else
                    for (var i = startIndex; i < endIndex; i++) {
                        for (var j = 0; j < gridRows.length; j++) {
                            $(this._excludeDetailCells(gridRows[j])[i]).addClass("e-columnselection");
                        }
                        $(this.getHeaderTable().find("th.e-headercell:not(.e-stackedHeaderCell,.e-detailheadercell)")[i]).addClass("e-columnselection");
                        this.selectedColumnIndexes.push(i);
                    }
                }
            }
            var args = { columnIndex: columnIndex == undefined ? toIndex : columnIndex, headerCell: $(this.getHeaderTable().find('.e-columnheader').last().find('th').not('.e-detailheadercell')[columnIndex]), column: this.model.columns[columnIndex], selectedColumnIndex: this.selectedColumnIndexes, previousColumnIndex: $precolIndex, prevColumnHeaderCell: prevColumnHeaderCell };
            if (this._trigger("columnSelected", args))
                return;
        },
        
        clearSelection: function (index, $target) {
            var rIndex = index, cSelection = "clearSelection", gridRows = $(this.getRows()), Data, args = {};
            var $gridRows = $(this.getRows()), index;
            if (this._selectedRow() >= -1) {
                if (this.model.scrollSettings.frozenColumns || !ej.isNullOrUndefined(this.model.detailsTemplate || this.model.childGrid))
                    $gridRows = this._excludeDetailRows();
                else
                    $gridRows = $(this.element.find("tr[aria-selected='true']"));
                var isSelected = $gridRows.find("td").hasClass("e-selectionbackground e-active");
                if (isSelected) {
                    $gRows = $(this.getContent().find("tr[aria-selected='true']"));
                    if (!this.model.scrollSettings.allowVirtualScrolling) {
                        if (!ej.isNullOrUndefined(index)) {
                            if (this.model.editSettings.editMode == "batch" && $($gridRows[index]).hasClass("e-insertedrow")) {
                                var addedrows = this.batchChanges.added.reverse();
                                Data = addedrows[index];
                                this.batchChanges.added.reverse();
                            }
                            else
                                Data = this.model.editSettings.editMode == "batch" ? this._currentJsonData[index - this.batchChanges.added.length] : this._currentJsonData[ej.isNullOrUndefined(index) ? toIndex : index];
                        }
                        var srow = [];
                        for (var j = 0; j < this.selectedRowsIndexes.length; j++) {
                            srow.push(this._currentJsonData[this.selectedRowsIndexes[j]]);
                        }
                        args = { rowIndex: index == undefined ? this.selectedRowsIndexes : index, row: index == undefined ? $gRows : gridRows.eq(index), data: index == undefined ? srow : Data, selectedData: index == undefined ? srow : Data };
                    }
                    else{
                     var vIndex, $target;
                     if (ej.isNullOrUndefined(index)) {
                        vIndex = this.selectedRowsIndexes[0];
                        $target = this.getSelectedRecords().length && this._enableCheckSelect && this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization?this.element.find('.e-headercheckcelldiv .e-checkselectall') :$gRows[0];
                    }
                    else
                        vIndex = index;
                    var vrowIndexCollection = this.selectedRowsIndexes;
                    args = this._getVirtualRows(vIndex, $target, cSelection, vrowIndexCollection);
                    }
                    if (this._trigger("rowDeselecting", args))
                        return;
                }
                if (!ej.isNullOrUndefined(index)) {
                    this.getRowByIndex(index).removeAttr("aria-selected").find(".e-selectionbackground").removeClass("e-selectionbackground").removeClass("e-active");
					var row = this.getRowByIndex(index);
					if (this.model.scrollSettings.enableVirtualization && this.multiSelectCtrlRequest && !this._enableCheckSelect) {
						var limit = parseInt(row.attr("name"), 32) * this._virtualRowCount;
						var remain = this._virtualRowCount - row.index() % this._virtualRowCount;	
						index = limit - remain;
					}
                    index = $.inArray(index, this.selectedRowsIndexes);
                    if (index != -1) {
                        this.selectedRowsIndexes.splice(index, 1);
                        this._selectedMultipleRows(this.selectedRowsIndexes);
                        this.model.selectedRecords.splice(index, 1);
                    }
                    if (this._enableCheckSelect && !$target)
                        row.find(".e-checkcelldiv [type=checkbox]").prop("checked", false);
                    if (this._isMapSelection) {
                        if (!this._selectionByGrid && !ej.isNullOrUndefined(index) && index != -1) {
                            var Data = this._currentJsonData[rIndex];
                            Data[this._selectionMapColumn] = false;
                            this.updateRecord(this._primaryKeys[0], Data, "update");
                        }
						this._trigger("rowDeselected", args);
                        Array.prototype.push.apply(this.model.selectedRecords, this.getSelectedRecords());
                    }
                } else {
                    var rows = $gridRows;
                    if (this.model.scrollSettings.enableVirtualization) {
                        for (var i in this._virtualLoadedRows) {
                            $.merge(rows, this._virtualLoadedRows[i]);
                        }
                    }
                    $gridRows.removeAttr("aria-selected").find(".e-rowcell, .e-detailrowcollapse, .e-detailrowexpand").removeClass("e-selectionbackground").removeClass("e-active");
                    if(!this._clearVirtualSelection){
						this.selectedRowsIndexes = [];
						this.model.selectedRecords = [];
						this._selectedMultipleRows().length && this._selectedMultipleRows([]);	
                    }
                    if (!this._selectionByGrid && (!this.initialRender || !this._isMapSelection)) {
                        $gridRows.find(".e-checkcelldiv [type=checkbox]").prop("checked", false);
                        var data = null;
                        if (this._isMapSelection && isSelected && this._trigger("rowDeselected", args));
                        Array.prototype.push.apply(this.model.selectedRecords, this.getSelectedRecords());
                    }
                }
                if (this._enableCheckSelect) {
                    if (!this._selectAllCheck && (this.selectedRowsIndexes.length != this._currentJsonData.length || this.model.allowScrolling && this.model.scrollSettings.allowVirtualScrolling && [].concat.apply([], this.checkSelectedRowsIndexes).length >= this._gridRecordsCount))
                        this.getHeaderTable().find(".e-headercheckcelldiv .e-checkselectall").prop("checked", false);
                    var i, curPage = this._currentPage() - 1;
                    if (this.model.scrollSettings.enableVirtualization && args.row) {
                        var curRowIndex = parseInt(args.row.attr("name"), 32);
                        var rowPage = curRowIndex % (this.model.pageSettings.pageSize / this._virtualRowCount);
                        if (rowPage == 0)
                            rowPage = (this.model.pageSettings.pageSize / this._virtualRowCount);
                        curPage = Math.ceil((curRowIndex * this._virtualRowCount) / this.model.pageSettings.pageSize) - 1
                        rIndex = (args.rowIndex % this._virtualRowCount) + ((rowPage * this._virtualRowCount) - this._virtualRowCount);

                    }
                    checkBoxIndex = $.inArray(rIndex, this.checkSelectedRowsIndexes[curPage]);
                    if (checkBoxIndex != -1) {
                        this.checkSelectedRowsIndexes[curPage].splice(checkBoxIndex, 1);
                    }
                    if (!this.selectedRowsIndexes.length && !this._isMapSelection && !$target) {
                        this.checkSelectedRowsIndexes[curPage] = [];
                        $gridRows.find(".e-checkcelldiv [type=checkbox]").prop("checked", false);
                    }
                }
                if (!this.selectedRowsIndexes.length)
                    this._selectedRow(-1);
            }
            this.model._checkSelectedRowsIndexes = this.checkSelectedRowsIndexes;
            if (isSelected && !this._isMapSelection && this._trigger("rowDeselected", args))
                return true;
        },

        _excludeDetailRows:function()
		{
			var $gridRows;
			if (!ej.isNullOrUndefined(this.model.detailsTemplate || this.model.childGrid || this.model.showSummary) && !this.model.scrollSettings.frozenColumns)
			    $gridRows = $(this.getRows()).not(".e-detailrow,.e-gridSummaryRows");
			else if (this.model.scrollSettings.frozenColumns > 0 && this.getRows() != null && this.getRows().length > 1)
			    $gridRows = $(this.getRows()[0]).not(".e-detailrow,.e-gridSummaryRows").add($(this.getRows()[1]).not(".e-detailrow,.e-gridSummaryRows"));
			else
			    $gridRows = $(this.getRows());
            return $gridRows;
		},
        
        clearCellSelection: function (rowIndex, columnIndex) {
            var $gridRows,$cell, cellIndex;
            if (this._allowcellSelection) {
                if (!ej.isNullOrUndefined(rowIndex) || !ej.isNullOrUndefined(this.model.detailsTemplate || this.model.childGrid))
                    $gridRows = this._excludeDetailRows();
                else
                    $gridRows = $(this.element.find(".e-cellselectionbackground")).parent();
                var isCellSelected = $gridRows.find("td").hasClass("e-cellselectionbackground e-activecell");
                if (isCellSelected) {
                    if (this.model.scrollSettings.frozenColumns && !ej.isNullOrUndefined(rowIndex))
                        $cell = this._frozenCell(rowIndex, columnIndex);
                    else
                        $cell = this.getContent().find(".e-cellselectionbackground");
                    var $data = [], cIndex = [columnIndex], vCell = [];
                    for (var j = 0; j < this.selectedRowCellIndexes.length; j++) {
                        $data.push(this._currentJsonData[this.selectedRowCellIndexes[j].rowIndex]);
                        for (var i = 0; i < this.selectedRowCellIndexes[j].cellIndex.length; i++) {
                            vCell.push(this.selectedRowCellIndexes[j].cellIndex[i]);
                        }
                    }
                    var args = { currentCell: (rowIndex || columnIndex) == undefined ? $cell : $gridRows.eq(rowIndex).find(".e-rowcell").eq(columnIndex), cellIndex: (rowIndex || columnIndex) == undefined ? vCell : cIndex, data: (rowIndex || columnIndex) == undefined ? $data : this._currentJsonData[rowIndex], selectedData: (rowIndex || columnIndex) == undefined ? $data : this._currentJsonData[rowIndex] };
                    if (this.model.selectionType == "multiple") {
                        args["isCtrlPressed"] = this.multiSelectCtrlRequest;
                        args["isShiftPressed"] = this.multiSelectShiftRequest;
                    }
                    if (this._trigger("cellDeselecting", args))
                        return true;
                }
                if (ej.isNullOrUndefined(rowIndex)) {
                    if (this.model.scrollSettings.frozenColumns)
                        $gridRows = $($gridRows[0]).add($gridRows[1]);
                    $gridRows.find(".e-rowcell, .e-detailrowcollapse, .e-detailrowexpand").removeClass("e-cellselectionbackground").removeClass("e-activecell");
                    this.selectedRowCellIndexes = [];
                    this._rowIndexesColl = [];
                }
                else {
                    for (var i = 0; i < this.selectedRowCellIndexes.length ; i++) {
                        if (this.selectedRowCellIndexes[i].rowIndex == rowIndex) {
                            cellIndex = $.inArray(columnIndex, this.selectedRowCellIndexes[i].cellIndex);
                            if (this.model.scrollSettings.frozenColumns)
                                this._frozenCell(rowIndex, columnIndex).removeClass("e-cellselectionbackground").removeClass("e-activecell");
                            else
                            $gridRows.eq(rowIndex).find(".e-rowcell").eq(columnIndex).removeClass("e-cellselectionbackground").removeClass("e-activecell");
                            break;
                        }
                    }
                    if (i != this.selectedRowCellIndexes.length) {
                        this.selectedRowCellIndexes[i].cellIndex.splice(cellIndex, 1);
                        if (this.selectedRowCellIndexes[i].cellIndex.length == 0) {
                            this.selectedRowCellIndexes.splice(i, 1);
                            this._rowIndexesColl.splice($.inArray(rowIndex, this._rowIndexesColl), 1);
                        }
                    }
                }
            }
            if (isCellSelected && this._trigger("cellDeselected", args))
                return true;
        },

        
        clearColumnSelection: function (index) {
             if (this._allowcolumnSelection) {
                var $gridRows = $(this._excludeDetailRows());
				var cIndex = $(this.getHeaderTable().find("th.e-headercell:not(.e-stackedHeaderCell)"));
				var isColumnSelected = cIndex.hasClass("e-columnselection");
                if(isColumnSelected){
                var scol = [],hcell = [];
                for (var j = 0; j < this.selectedColumnIndexes.length; j++) {
                    scol.push(this.model.columns[this.selectedColumnIndexes[j]]);
                    hcell.push($(this.getHeaderTable().find('.e-columnheader').last().find('th.e-headercell').not('.e-detailheadercell')[this.selectedColumnIndexes[j]]));
                }
                var args = { columnIndex: index == undefined ? this.selectedColumnIndexes : index, headerCell: index == undefined ? hcell : $(this.getHeaderTable().find('.e-columnheader').last().find('th.e-headercell').not('.e-detailheadercell')[index]), column: index == undefined ? scol : this.model.columns[index] };
                if (this.model.selectionType == "multiple") {
                   args["isCtrlPressed"] = this.multiSelectCtrlRequest;
                   args["isShiftPressed"] = this.multiSelectShiftRequest;
                 }
               if (this._trigger("columnDeselecting", args))
                   return;
                }
                if (!ej.isNullOrUndefined(index)) {
                    var indent = 0;
                    if (this.model.detailsTemplate != null || this.model.childGrid != null) {
                        ++index; indent = 1;
                    }
                    if (this.model.scrollSettings.frozenColumns) {
                        var currentIndex = index;
                        if (index >= this.model.scrollSettings.frozenColumns) {
                            currentIndex = index - this.model.scrollSettings.frozenColumns;
							 $gridRows=$(this.getContent).find(".e-movablecontent").find('tr');
                        }
                        else
                            $gridRows=$(this.getContent).find(".e-frozencontentdiv").find('tr');
                        for (var j = 0; j < $gridRows.length; j++) {
                            $($gridRows[j].cells[currentIndex]).removeClass("e-columnselection");
                        }
                    }
                    else
                        for (var i = 0; i < $gridRows.length; i++) {
                            $($gridRows[i].cells[index]).removeClass("e-columnselection");
                        }
                    $(this.getHeaderTable().find("th.e-headercell:not(.e-stackedHeaderCell)")[index]).removeClass("e-columnselection");
                    this.selectedColumnIndexes.splice(0, index - indent);

                } else {
                    $gridRows.find(".e-rowcell").removeClass("e-columnselection");
                    $(this.getHeaderTable().find("th.e-headercell:not(.e-stackedHeaderCell)")).removeClass("e-columnselection");
                    this.selectedColumnIndexes = [];
                }
            }
            if (isColumnSelected && this._trigger("columnDeselected", args))
                return true;
        },
        getSelectedRows:function(){
            var $rows = $();
            for (var i = 0; i < this.selectedRowsIndexes.length; i++) {
                if (this.model.scrollSettings.frozenColumns > 0) {
                    $rows.push(this.getRowByIndex(this.selectedRowsIndexes[i])[0]);
                    $rows.push(this.getRowByIndex(this.selectedRowsIndexes[i])[1]);
                }
                else
                    $rows.push(this.getRowByIndex(this.selectedRowsIndexes[i])[0]);
            }
            return $rows;
        },
        getSelectedRecords: function () {
            var records = [], $gridRows = this.getRows();
            if (this._virtualScrollingSelection)
                return this._virtualSelRecords;
			var loopDone = false;
            if (this.model.scrollSettings.allowVirtualScrolling && this._enableCheckSelect) {
                for (var i = 0 ; i < this.checkSelectedRowsIndexes.length; i++) {
                    if (!ej.isNullOrUndefined(this.checkSelectedRowsIndexes[i])) {
                        for (var j = 0; j < this.checkSelectedRowsIndexes[i].length ; j++) {
							if(this._currentJsonData.length <= j && !this._isLocalData) {
								loopDone = true;
								break;
							}
                            var checkIndex = (i * this.model.pageSettings.pageSize) + this.checkSelectedRowsIndexes[i][j];
                            records.push(this._virtualCheckSelectedRecords[checkIndex]);
                        }
                    }
					if(loopDone) break;
                }
            }
            else {
                for (var i = 0; i < this.selectedRowsIndexes.length; i++) {
                    if (this.selectedRowsIndexes[i] != -1) {
                        if (this.model.editSettings.editMode == "batch" && $($gridRows[this.selectedRowsIndexes[i]]).hasClass("e-insertedrow")) {
                            var addedrecords = this.batchChanges.added.reverse();
                            records.push(addedrecords[this.selectedRowsIndexes[i]])
                            this.batchChanges.added.reverse();
                        }
                        else if (this.model.scrollSettings.allowVirtualScrolling && !this._enableCheckSelect)
                            records.push(this._virtualSelectedRecords[this.selectedRowsIndexes[i]]);
                        else
                            this.model.editSettings.editMode == "batch" ? records.push(this._currentJsonData[this.selectedRowsIndexes[i] - this.batchChanges.added.length]) : records.push(this._currentJsonData[this.selectedRowsIndexes[i]]);

                    }
                }
            }
            return records;
        },
        _setCurrentRow: function (requestType) {
            if (requestType == ej.Grid.Actions.Refresh || requestType == ej.Grid.Actions.Ungrouping || requestType == ej.Grid.Actions.Grouping || requestType == ej.Grid.Actions.Filtering || requestType == ej.Grid.Actions.Sorting || requestType == ej.Grid.Actions.Paging || requestType == ej.Grid.Actions.Search || ((requestType == ej.Grid.Actions.Delete || requestType == ej.Grid.Actions.Cancel) && this.model.currentViewData != null && this.model.currentViewData.length == 0)) {
                this._selectedRow(-1);
                this._selectedMultipleRows([]);
				if(!this._virtualDataRefresh || requestType == ej.Grid.Actions.Refresh )
					this.selectedRowsIndexes = [];
            }
            if (!this._isMapSelection && this._currentJsonData.length && requestType == ej.Grid.Actions.Delete && this._selectedRow() >= this._currentJsonData.length) {
                var lastIndex = this._currentJsonData.length - 1;
                this._selectedRow(lastIndex);
                this._selectedMultipleRows([lastIndex]);
                if (!this._virtualDataRefresh || requestType == ej.Grid.Actions.Refresh)
                    this.selectedRowsIndexes = lastIndex;
            }
            if (!this._isMapSelection && (requestType == ej.Grid.Actions.Delete || (requestType == ej.Grid.Actions.Save && !this._isMapSelection)) && this.model.selectedRowIndex != -1){
                var target = this.getRowByIndex(this.model.selectedRowIndex);
                this.selectRows(this.model.selectedRowIndex,null,target);
			}
            if (requestType == ej.Grid.Actions.Save || requestType == ej.Grid.Actions.Cancel)
                this.element.focus();
        },
        _renderMultiTouchDialog: function () {
            this._customPop = ej.buildTag("div.e-gridpopup", "", { display: "none" });
            var $content = ej.buildTag("div.e-content"), $downTail = ej.buildTag("div.e-downtail e-tail");
            if (this.model.allowMultiSorting) {
                var $selElement = ej.buildTag("span.e-sortdirect e-icon");
                $content.append($selElement);
            }
            if (this.model.selectionType == ej.Grid.SelectionType.Multiple) {
                var $selElement = ej.buildTag("span.e-rowselect e-icon");
                $content.append($selElement);
            }
            this._customPop.append($content);
            this._customPop.append($downTail);
            this.element.append(this._customPop);
        },
    };
})(jQuery, Syncfusion);