(function ($, ej, undefined) {
    ej.gridFeatures = ej.gridFeatures || {};
    ej.gridFeatures.common = {
        
        refreshContent: function (refreshTemplate) {
            if (refreshTemplate) {
                this.refreshTemplate();
                if(this._isLocalData) this.refreshHeader();
            }
            if (this.model.allowFiltering && this.model.filterSettings.filterType == "filterbar")
                this._renderFilterBarTemplate();
            var args = {};
            this._initialRenderings();
            args.requestType = ej.Grid.Actions.Refresh;
            args.templateRefresh  = ej.isNullOrUndefined(refreshTemplate) ? false : refreshTemplate;
            if (this.model.scrollSettings.enableVirtualization) {
                this._refreshVirtualViewData();
                this._virtualDataRefresh = true;
            }
            this._processBindings(args);
        },

        refreshData: function (param) {
            if (this._isRemoteSaveAdaptor && this._dataManager.dataSource.url != undefined) {
                var proxy = this;
                $.ajax({
                    url: proxy.model.dataSource.dataSource.url,
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({ value: param }),
                    dataType: "json",
                    cache: false,
                    success: function (data) {
                        proxy._dataManager.dataSource.json = data;
                        proxy.dataSource(proxy._dataManager);
                    }
                });
            }
            else
                this.refreshContent();
        },
        
        rowHeightRefresh: function () {
            if (this.model.scrollSettings.frozenColumns > 0 && !ej.isNullOrUndefined(this.model.currentViewData) && this.model.currentViewData.length) {
                var frozenRows = this.getContentTable().get(0).rows;
                var movableRows = this.getContentTable().get(1).rows, height = 0;
                if (this.getContent().find(".e-frozencontentdiv").is(":visible")){
                    for (var i = 0; i < frozenRows.length; i++) {
                        if ($(frozenRows[i]).css("display") == "none")
                            continue;
						if(this._isResized){
							frozenRows[i].style.height = "";movableRows[i].style.height = "";							
						}
                        var frozenHeight = frozenRows[i].getClientRects()[0].height;
                        var movableHeight = movableRows[i].getClientRects()[0].height;
                        if (ej.isNullOrUndefined(frozenHeight) || ej.isNullOrUndefined(movableHeight))
                            height = ej.max([frozenRows[i].offsetHeight, movableRows[i].offsetHeight]);
                        else
                            height = ej.max([frozenHeight, movableHeight]);
                        $(frozenRows[i]).height(height); $(movableRows[i]).height(height);
                        if (i && (i == this.model.scrollSettings.frozenRows - 1 || i == frozenRows.length - 1))
                            height = height + 1;
                        if (!this.model.allowTextWrap) {
                            if (!i || i == this.model.scrollSettings.frozenRows - 1)
                                height = height - 1;
                        }
                        if (this.model.isEdit && $(frozenRows[i]).find("#" + this._id + "EditForm").length && i){
                            $(frozenRows[i]).find("#" + this._id + "EditForm td").css("height", height); 
							$(movableRows[i]).find("#" + this._id + "EditForm td").css("height", height);
						}
                    }
					this._isResized = false;
				}
                if (this.model.showSummary && this.model.summaryRows.length > 0) {
                    var frozenFooterRows = this.getFooterTable().get(0).rows;
                    var movableFooterRows = this.getFooterTable().get(1).rows, footerHeight = 0;
                    for (var j = 0; j < frozenFooterRows.length ; j++) {
                        footerHeight = ej.max([frozenFooterRows[j].getClientRects()[0].height, movableFooterRows[j].getClientRects()[0].height]);
                        $(frozenFooterRows[j]).height(footerHeight); $(movableFooterRows[j]).height(footerHeight);
                    }
                }
                this._getRowHeights()
                if (!ej.isNullOrUndefined(this.getContent().data("ejScroller")) && (this.getScrollObject()._vScrollbar != null || this.getScrollObject().isVScroll())) {
                    var scroller = this.getScrollObject()._vScrollbar;
                    if (ej.isNullOrUndefined(scroller) || scroller.value() != scroller.model.maximum)
						this._scrollObject.refresh(this.model.scrollSettings.frozenColumns > 0);                        
                }

            }
        },
                
        dataSource: function (dataSource, templateRefresh) {
            if (templateRefresh)
                this._templateRefresh = true;
            this._dataSource(dataSource);
			this._currentPage(1);
			if(this.model.scrollSettings.enableVirtualization){
				this.model.pageSettings.totalPages = null;
				this._currentVirtualIndex = 1;
				if (this.getContent().ejScroller("isVScroll"))
					this.getContent().ejScroller("scrollY", 0, true);
			}
			this._updateDataSource = true;
			this._refreshDataSource(dataSource, templateRefresh);			
			if (this.model.allowPaging || this.model.scrollSettings.allowVirtualScrolling) {
			    var model = this._refreshVirtualPagerInfo();
			    this._showPagerInformation(model);
			}
            if (this.model.scrollSettings.allowVirtualScrolling) {
				if(this.model.scrollSettings.enableVirtualization && this._isLocalData)
					this._refreshVirtualView(); 
				else
					this._refreshVirtualContent(); 
                if (this.getContent().ejScroller("isHScroll"))
                    this.getContent().ejScroller("scrollX", 0, true);
                if (this.getContent().ejScroller("isVScroll")) {
					if(!this.model.scrollSettings.enableVirtualization)
						this.getContent().ejScroller("scrollY", 0, true);
                    this.element.find(".e-gridheader").addClass("e-scrollcss");
                }
                else
                    this.element.find(".e-gridheader").removeClass("e-scrollcss");
            }
			if(!this.model.scrollSettings.enableVirtualization || this._gridRows.length < this._virtualRowCount)
				this._addLastRow();
			this._trigger("dataBound", {});
        },
        _refreshDataSource: function (dataSource, refreshTemplate) {
            if (dataSource instanceof ej.DataManager)
                this._dataManager = dataSource;
            else
                this._dataManager = ej.DataManager(dataSource);
			this._isRemoteSaveAdaptor = (this._dataSource() instanceof ej.DataManager && this._dataSource().adaptor instanceof ej.remoteSaveAdaptor);
            this._isLocalData = (!(this._dataSource() instanceof ej.DataManager) || (this._dataManager.dataSource.offline || this._isRemoteSaveAdaptor || this._dataSource().adaptor instanceof ej.ForeignKeyAdaptor));
			if(this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization){
				this._refreshVirtualViewData();
				this._virtualDataRefresh = true;
				this._isLocalData && this._refreshVirtualViewDetails(true);
			}
			this.refreshContent(ej.isNullOrUndefined(refreshTemplate) ? true : refreshTemplate);
        },
        _hideRowTemplateColumns: function (column, state) {
            var index = $.inArray(column, this.model.columns);
            this.getContentTable().find("tbody:first > tr").find('> td:nth-child(' + (index + 1) + ')')[state == "hide" ? "addClass" : "removeClass"]("e-hide");
        },
        hideColumns: function (c) {
            var i, count = 0, args = {}, index, colIndex, newHideCol = []; var htext, field, hiddenFrozenCount = 0;
            htext = typeof (c) == "string" ? this.getColumnByHeaderText(c) : this.getColumnByHeaderText(c[0]);
			colIndex = typeof (c) == "number"? this.getColumnByIndex(c) : this.getColumnByIndex(c[0]);
            field = typeof (c) == "string" ? this.getColumnByField(c) : this.getColumnByField(c[0]);
            this._showHideColumns = true;
            var colHeaderText = [];
            $.map(this.model.columns, function (val, i) {
                colHeaderText.push(val.headerText)
            });
            var duparr = this._isDuplicate(colHeaderText);
            var hidden = !duparr ? "_hiddenColumns" : "_hiddenColumnsField";
            var visible = !duparr ? "_visibleColumns" : "_visibleColumnsField";
			if (!duparr && (field != null || colIndex != null)){
                if ($.isArray(c)) {
                    for (var i = 0; i < c.length; i++) {
                      var cfield = (colIndex != null) ? this.getColumnByIndex(c[i]):this.getColumnByField(c[i]); 
                        c[i] = cfield != null ? cfield.headerText : c[i];
                    }
                }
                else
                    c = (colIndex != null) ? colIndex.headerText: field.headerText;
            }
		    var getColumnMethod = (colIndex != null) ? "getColumnByIndex": "getColumnByHeaderText";
            if ($.isArray(c)) {
                for (i = 0; i < c.length; i++) {
                    index = $.inArray(c[i], this[visible]);
                    
                    if (index != -1) {
                        this[hidden].push(c[i]);
                        this[visible].splice(index, 1);
                    }
					else if(index==-1 && visible=="_visibleColumnsField" && $.inArray(c[i],this[hidden])==-1 && ej.isNullOrUndefined(this.getColumnByField(c[i]))){
					    this[hidden].push(this[getColumnMethod](c[i]).field) && this["_hiddenColumns"].push(this[getColumnMethod](c[i]).field);
					    this[visible].splice($.inArray(this[getColumnMethod](c[i]).field, this[visible]), 1) && this["_visibleColumns"].splice($.inArray(c[i], this["_visibleColumns"]), 1);
					}
                    if (this.model.rowTemplate != null) {
                        var templateColumn = index != -1 ? this.getColumnByHeaderText(c[i]) : this[getColumnMethod](c[i]);
                        this._hideRowTemplateColumns(templateColumn, "hide");
                    }
				}
            } else {
                index = $.inArray(c, this[visible]);
                if (index != -1) {
                    this[hidden].push(c);
                    this[visible].splice(index, 1);
                }
				else if(index==-1 && visible=="_visibleColumnsField" && $.inArray(c,this[hidden])==-1 && ej.isNullOrUndefined(this.getColumnByField(c))){
				    this[hidden].push(this[getColumnMethod](c).field) && this["_hiddenColumns"].push(this[getColumnMethod](c).field);
				    this[visible].splice($.inArray(this[getColumnMethod](c).field, this[visible]), 1) && this["_visibleColumns"].splice($.inArray(c, this["_visibleColumns"]), 1);
				}
                if (this.model.rowTemplate != null) {
                    var templateColumn = index != -1 ? this.getColumnByHeaderText(c) : this[getColumnMethod](c);
                    this._hideRowTemplateColumns(templateColumn, "hide");
                }
            }
            for (i = 0; i < this.model.columns.length; i++) {
                var com = !duparr ? "headerText" : "field";
                if ($.inArray(ej.isNullOrUndefined(this.model.columns[i][com]) || this.model.columns[i][com] == "" ? this.model.columns[i]["headerText"] : this.model.columns[i][com], this[hidden]) != -1) {
                    this.model.columns[i].visible && newHideCol.push(this.model.columns[i]);
                    this.model.columns[i].visible = false;
                    if (this.model.allowScrolling && this.model.scrollSettings.frozenColumns > 0 && this.model.columns.indexOf(this.model.columns[i]) < this.model.scrollSettings.frozenColumns)
                        hiddenFrozenCount++;
                    count++;
                }
                if (this[hidden].length == count)
                    break;
            }
            args.requestType = "refresh"; args.action = "hideColumn";
            this._hideHeaderColumn(this[hidden], duparr);
            if (this.model.allowScrolling && this.model.scrollSettings.frozenColumns > 0) {
                var $table = this._renderGridHeader();
                this.element.find('.e-gridheader').replaceWith($table[0])
                if (this.model.allowFiltering && this.model.filterSettings.filterType == "filterbar") this._renderFiltering();
                if (this.model.allowReordering)
                   this._headerCellreorderDragDrop();
            }
            this.refreshTemplate();
            if (this.model.scrollSettings.allowVirtualScrolling)
                this._virtualShowHide(args);
            if(this._isAddNew && this.model.isEdit){
                this.model.query = this.commonQuery.clone();
                this._ensureDataSource(args);
                this._isAddNew = false;
            }
            this.sendDataRenderingRequest(args);
            this.rowHeightRefresh();
            if (this.model.allowScrolling) {
                if (this.model.scrollSettings.frozenColumns == 0 && !ej.isIOSWebView() && this.getBrowserDetails().browser == "msie") {
                    var tableWidth = this._calculateWidth();
                    this.getHeaderTable().width(tableWidth);
                    if (!ej.isNullOrUndefined(this.getFooterTable()))
                        this.getFooterTable().width(tableWidth);
                }
                if (!ej.isNullOrUndefined(this._scrollObject))
                this.getScrollObject().refresh();
            }
            if (this.model.showColumnChooser)
                this._refreshColumnChooserList();
             if (this.model.allowScrolling && this.model.scrollSettings.frozenColumns > 0) {
				if(hiddenFrozenCount == this.model.scrollSettings.frozenColumns){
				    this._frozenPaneRefresh();
				}				
                 this.getScrollObject().refresh();
             }
			this._showHideColumns = false;
        },
        
        showColumns: function (c) {
            var i, count = 0, args = {}, index, colIndex, column, newVisColumns = []; var htext, field;
            htext = typeof (c) == "string" ? this.getColumnByHeaderText(c) : this.getColumnByHeaderText(c[0]);
			colIndex = typeof (c) == "number"? this.getColumnByIndex(c) : this.getColumnByIndex(c[0]);
            field = typeof (c) == "string" ? this.getColumnByField(c) : this.getColumnByField(c[0]);
            
			this._showHideColumns = true;
            var colHeaderText = [];
            $.map(this.model.columns, function (val, i) {
                colHeaderText.push(val.headerText)
            });
            var duparr = this._isDuplicate(colHeaderText);
            var hidden = !duparr ? "_hiddenColumns" : "_hiddenColumnsField";
            var visible = !duparr ? "_visibleColumns" : "_visibleColumnsField";
			if (!duparr && (field != null || colIndex != null)){
                if ($.isArray(c)) {
                    for (var i = 0; i < c.length; i++) {
                      var cfield = (colIndex != null) ? this.getColumnByIndex(c[i]):this.getColumnByField(c[i]); 
                        c[i] = cfield != null ? cfield.headerText : c[i];
                    }
                }
                else
                    c = (colIndex != null) ? colIndex.headerText: field.headerText;
             }
		    var getColumnMethod = (colIndex != null) ? "getColumnByIndex": "getColumnByHeaderText";
            if ($.isArray(c)) {
                for (i = 0; i < c.length; i++) {
                    index = $.inArray(c[i], this[hidden]);
                    
                    if (index != -1) {
                        this[hidden].splice(index, 1);
                        this[visible].push(c[i]);
                    }
					else if(index==-1 && hidden=="_hiddenColumnsField" && $.inArray(c[i],this[visible])==-1 && ej.isNullOrUndefined(this.getColumnByField(c[i]))){
					    this[visible].push(this[getColumnMethod](c[i]).field) && this["_visibleColumns"].push(c[i]);
					    this[hidden].splice($.inArray(this[getColumnMethod](c[i]).field, this[hidden]), 1) && this["_hiddenColumns"].splice($.inArray(c[i], this["_hiddenColumns"]), 1);
					}
                    if (this.model.rowTemplate != null) {
                        var templateColumn = index != -1 ? this.getColumnByHeaderText(c[i]) : this[getColumnMethod](c[i]);
                        this._hideRowTemplateColumns(templateColumn, "show");
                    }
                }
            } else {
                index = $.inArray(c, this[hidden]);
                if (index != -1) {
                    this[hidden].splice(index, 1);
                    this[visible].push(c);
                }
				else if(index==-1 && hidden=="_hiddenColumnsField" && $.inArray(c,this[visible])==-1 && ej.isNullOrUndefined(this.getColumnByField(c))){
				    this[visible].push(this[getColumnMethod](c).field) && this["_visibleColumns"].push(c);
				    this[hidden].splice($.inArray(this[getColumnMethod](c).field, this[hidden]), 1) && this["_hiddenColumns"].splice($.inArray(c, this["_hiddenColumns"]), 1);
				}
                if (this.model.rowTemplate != null) {
                    var templateColumn = index != -1 ? this.getColumnByHeaderText(c) : this[getColumnMethod](c);
                    this._hideRowTemplateColumns(templateColumn, "show");
                }
            }
            for (i = 0; i < this.model.columns.length; i++) {
                var com = !duparr ? "headerText" : "field";
                if ($.inArray(ej.isNullOrUndefined(this.model.columns[i][com]) || this.model.columns[i][com] == "" ? this.model.columns[i]["headerText"] : this.model.columns[i][com], this[visible]) != -1) {
                    !this.model.columns[i].visible && newVisColumns.push(this.model.columns[i])
                    this.model.columns[i].visible = true;
                    count++;
                }
                if (this[visible].length == count)
                    break;
            }


            if (this.model.allowScrolling && this.model.scrollSettings.frozenColumns > 0) {
                var frozenHide = false;
                for (var i = 0; i < newVisColumns.length; i++) {
                    var index = this.model.columns.indexOf(newVisColumns[i]);
                    if (index < this.model.scrollSettings.frozenColumns)
                        frozenHide = true;
                }
                if (frozenHide) {
					for(var i = 0; i < this.model.columns.length; i++){
						if($.inArray(this.model.columns[i].headerText, this["_hiddenColumns"]) != -1)
							this.model.columns[i].visible = false;
						else if($.inArray(this.model.columns[i].headerText, this["_visibleColumns"]) != -1)
							this.model.columns[i].visible = true;
					}
                    var $table = this._renderGridHeader();
                    this.element.find('.e-gridheader').replaceWith($table[0])
                    if (this.model.allowFiltering && this.model.filterSettings.filterType == "filterbar") this._renderFiltering();
                    if (this.model.allowReordering)
                        this._headerCellreorderDragDrop();
                }
            }

            args.requestType = "refresh"; args.action = "showColumn";
            this._showHeaderColumn(this[visible], duparr);

            this.refreshTemplate();
            if (this.model.scrollSettings.allowVirtualScrolling)
                this._virtualShowHide(args);
            if (this._isAddNew && this.model.isEdit) {
                this.model.query = this.commonQuery.clone();
                this._ensureDataSource(args);
                this._isAddNew = false;
            }
            this.sendDataRenderingRequest(args);
            this.rowHeightRefresh();
            if (this.model.allowScrolling && !ej.isNullOrUndefined(this._scrollObject)) {
                this.getScrollObject().refresh();
            }
            if (this.model.showColumnChooser)
                this._refreshColumnChooserList();
			this._showHideColumns = false;
        },
        _virtualShowHide: function (args) {
            this._currentPage(1);
            this.model.query = this.commonQuery.clone();
            this._ensureDataSource(args);
            this._loadedJsonData = [];
            this._prevPage = this._currentPage();
        },
        
        resizeColumns: function (column, width) {
            if (column instanceof Array) {
                for (var i = 0; i < column.length; i++) {
                    var colWidth = width instanceof Array ? width[i] : width;
                    this._setWidthColumnCollection(column[i], colWidth);
                }
            }
            else
                this._setWidthColumnCollection(column, width);
            this.setWidthToColumns();
            if (this.model.scrollSettings.frozenColumns){
                this._frozenAlign();
                this.rowHeightRefresh();
            }
			if(!ej.isNullOrUndefined(this.getFooterContent()))
				this._scrollFooterColgroup();
			this._refreshScroller({requestType: "refresh"})
        },
        _setWidthColumnCollection: function (column, width) {
            var col = this.getColumnByHeaderText(column) || this.getColumnByField(column);
            col.width = width;
            if ($.inArray(col.field, this._disabledResizingColumns) == -1)
                this.columnsWidthCollection[$.inArray(col, this.model.columns)] = width;
        },
        
        refreshTemplate: function () {
            this.addInitTemplate();
            if (this.model.editSettings.allowEditing || this.model.editSettings.allowAdding) {
				this._processEditing();
            }
            if (this.model.allowGrouping) this.addGroupingTemplate();
        },
        refreshHeader: function () {
            var $header = this.element.find(".e-gridheader");
            this.element[0].replaceChild(this._renderGridHeader()[0], $header[0]);           
            if (this.model.allowFiltering && this.model.filterSettings.filterType == "filterbar")
                this._renderFiltering();
            this.model.allowGrouping && this.model.groupSettings.showDropArea && this._headerCellgDragDrop(); 
            this.model.allowReordering && this._headerCellreorderDragDrop();
            this.model.showColumnChooser && this._renderColumnChooserData(true);
			if(this.model.gridLines != "both")
			    this._showHeaderGridLines();
			if (this.model.mergeHeaderCellInfo != null) {
			    this.setWidthToColumns();
			    var args = { columnHeaders: this.getHeaderContent().find(".e-columnheader"), model: this.model }, proxy = this;
			    this._headerCellMerge(args);
			    this._trigger("mergeHeaderCellInfo", args);
			}
            this.refreshScrollerEvent();
        },        
        set_dropColumn: function (from, to) {
            if (this.model.allowReordering && from != to) {
                this.model.columns.splice(to, 0, this.model.columns.splice(from, 1)[0]);
                var columns = this.model.columns;
                var $header = this.getHeaderTable().find(".e-columnheader:last .e-headercell").not(".e-stackedHeaderCell");
                var $headerCell = $header.find(".e-headercelldiv");
                var scrollLeft = this.getHeaderContent().find("div").first().scrollLeft();
                if (this.model.allowSorting && this.model.sortSettings.sortedColumns.length || this.model.groupSettings.showToggleButton) {
                    $header.find("span.e-ascending").remove();
                    $header.find("span.e-descending").remove();
                    $header.find("span.e-gridgroupbutton").remove();
                }
                if (this.model.allowSorting && this.model.sortSettings.sortedColumns.length) 
                    $header.eq(from).find("span").remove();
                if (!this.model.scrollSettings.frozenColumns)
                    this.getHeaderTable().find("colgroup").replaceWith(this._getMetaColGroup());
                (this.model.detailsTemplate != null || this.model.childGrid != null) && this.getHeaderTable().find("colgroup").prepend(this._getIndentCol());

                //Remove and Returns name/value pair of element attributes
                var removeAttr = function (ele) {
                    var names = []; if (ele == undefined) return;
                    if (["", undefined].indexOf(ele.value) == -1) {
                        names.push({ name: "value", value: ele.value }); ele.value = "";
                    }
                    for (var e = 0, eAttr = ele.attributes, eLen = eAttr.length; e < eLen; e++) {
                        var regex = /^jQuery[0-9]+$/;
                        !eAttr[e].name.match(regex) && names.push({ name: eAttr[e].name, value: eAttr[e].value });
                    }
                    for (var a = 0, aLen = names.length; a < aLen; a++) {
                        $(ele).removeAttr(names[a].name);
                    }
                    return names;
                };
                //Add attributes to the ele
                var addAttr = function (coll, ele) {
                    if (ele == undefined) return;
                    for (var e = 0, eLen = coll.length; e < eLen; e++) {
                        if (coll[e].name == "value") ele.value = coll[e].value;
                        $(ele).attr(coll[e].name, coll[e].value);
                    }
                };

                if (this.getHeaderTable().find(".e-fltrtempdiv").length == 0 && this.getHeaderTable().find(".e-filterdiv").length > 0)
                    var $filterCell = this.getHeaderTable().find(".e-filterdiv input");
                var $fState = ej.isNullOrUndefined($filterCell);
                var $attributeCollection = { "cellattributes": [], "headerattributes": [], "filtercellattributes": [], "filterThattributes": [] };
                var fromIndex = from < to ? from : to;
                var toIndex = from < to ? to : from;
                
                for (var i = fromIndex, j = 0; i <= toIndex; i++) {
                    var hIndx = (this.model.detailsTemplate != null || this.model.childGrid != null) ? i + 1 : i;
                    $attributeCollection.headerattributes[j] = removeAttr($header[hIndx]);
                    $attributeCollection.cellattributes[j] = removeAttr($headerCell[i]);
                    $attributeCollection.filtercellattributes[j] = !$fState ? removeAttr($filterCell[i]) : [];
                    $attributeCollection.filterThattributes[j] = !$fState ? removeAttr($($filterCell[i]).closest("th")[0]) : [];
                    j++;
                }

                var spliceFrom = from < to ? $attributeCollection.cellattributes.length - 1 : 0;
                var spliceTo = from < to ? 0 : $attributeCollection.cellattributes.length - 1;

                for (var prop in $attributeCollection)
                    $attributeCollection[prop].splice(spliceFrom, 0, $attributeCollection[prop].splice(spliceTo, 1)[0]);

                
                for (var i = fromIndex, j = 0; i <= toIndex; i++) {
                    var indx = (this.model.detailsTemplate != null || this.model.childGrid != null) ? i + 1 : i;
                    addAttr($attributeCollection.headerattributes[j], $header[indx]);
                    addAttr($attributeCollection.cellattributes[j], $headerCell[i]);
                    !$fState && addAttr($attributeCollection.filtercellattributes[j], $filterCell[i]);
                    !$fState && addAttr($attributeCollection.filterThattributes[j], $($filterCell[i]).closest("th")[0]);
                    j++;
                }
                if (this.model.allowFiltering && ["menu", "excel"].indexOf(this.model.filterSettings.filterType) != -1) {
                    if (this._$fDlgIsOpen)
                        this._closeFDialog();
                    var col = this.model.columns;
                    $header.find(".e-filtericon").remove();
                    for (var i = 0; i < col.length; i++) {
                        if (col[i]["allowFiltering"] || ej.isNullOrUndefined(col[i]["allowFiltering"])) {
                            var filterHeader = $header.find(".e-headercelldiv[data-ej-mappingname=\"" + col[i].field + "\"]").closest(".e-headercell")
                            filterHeader.append(ej.buildTag('div.e-filtericon e-icon e-filterset'));
                        }
                    }
                    this._refreshFilterIcon();
                }

                this.columnsWidthCollection.splice(to, 0, this.columnsWidthCollection.splice(from, 1)[0]);
                var headerCell;
                this._fieldColumnNames = this._headerColumnNames = [];
                for (var count = 0; count < columns.length; count++) {
                    this._fieldColumnNames[columns[count].headerText] = columns[count].field;
                    this._headerColumnNames[columns[count].field] = columns[count].headerText;
                    headerCell = $($headerCell[count]);
                    header = $($header[count]);
                    if (!ej.isNullOrUndefined(columns[count].headerTemplateID))
                        headerCell.html($(columns[count]["headerTemplateID"]).html());
                    else if (columns[count].type == "checkbox" && ej.isNullOrUndefined(columns[count]["headerText"]))
                        headerCell.html("<input type = 'checkbox' class = 'e-checkselectall'></input>");
                    else
                    columns[count].disableHtmlEncode ? headerCell.text(columns[count].headerText) : headerCell.html(columns[count].headerText);
                    if (this.model.groupSettings.showToggleButton && (ej.isNullOrUndefined(columns[count].allowGrouping) || columns[count].allowGrouping)) {
                        if ($.inArray(columns[count].field, this.model.groupSettings.groupedColumns) != -1)
                            header.append(this._getToggleButton().addClass("e-toggleungroup"));
                        else
                            header.append(this._getToggleButton().addClass("e-togglegroup"));
                        var $filterset = this.getHeaderTable().find("thead tr:not('.e-stackedHeaderRow')").find(".e-headercell").not(".e-detailheadercell").find(".e-filterset");
                        $filterset.addClass("e-groupfiltericon");
                        if(this.model.enableRTL && !$filterset.length)
                            header.find(".e-togglegroupbutton").addClass("e-rtltoggle");
                    }
                }
                if (this.model.allowGrouping && this.model.allowSorting != true) {
                    for (var i = 0; i < this.model.sortSettings.sortedColumns.length; i++)
                        this._addSortElementToColumn(this.model.sortSettings.sortedColumns[i].field, this.model.sortSettings.sortedColumns[i].direction);
                }
                if (this.model.allowSorting) {
                    for (var i = 0; i < this.model.sortSettings.sortedColumns.length; i++) {
                        var opacity = 1;
                        var $sCol = this.model.sortSettings.sortedColumns[i];
                        var sortcolumn = this.getsortColumnByField($sCol.field);
                        var index = this.getColumnIndexByField($sCol.field);
                        var sortindex = $.inArray(sortcolumn, this.model.sortSettings.sortedColumns),
                        imageDirection = $sCol.direction != "descending" ? "e-rarrowup-2x" : "e-rarrowdown-2x";
                        if (this.model.allowMultiSorting) {
                            for (var j = 1; j <= sortindex; j++) {
                                opacity = opacity + 1;
                            }
                            if ($headerCell.eq(index).css("text-align") == "right") {
                                if(this.model.sortSettings.sortedColumns.length > 1)
                                    $headerCell.eq(index).prepend(this._createSortNumber(opacity, $headerCell.eq(index)).addClass("e-sortnumber"));
                                $header.eq(index).append(this._createSortElement().addClass("e-" + ($sCol.direction || "ascending") + " " + imageDirection));
                            }
                            else {
                                $header.eq(index).append(this._createSortElement().addClass("e-" + ($sCol.direction || "ascending") + " " + imageDirection));
                                if (this.model.sortSettings.sortedColumns.length > 1)
                                    $headerCell.eq(index).append(this._createSortNumber(opacity, $headerCell.eq(index)).addClass("e-sortnumber"));
                            }
                        }
                        else {
                            imageDirection = $sCol.direction != "descending" ? "e-rarrowup-2x" : "e-rarrowdown-2x";
                            $header.eq(index).append(this._createSortElement().addClass("e-" + ($sCol.direction || "ascending") + " " + imageDirection));
                        }
                        var $headertraversal = this.getHeaderTable().find("thead tr:not('.e-stackedHeaderRow')").find(".e-headercell").not(".e-detailheadercell").eq(index);
                        var $filterset = $headertraversal.find(".e-filterset");
                        var $togglegroup = $headertraversal.find(".e-gridgroupbutton");
                        $filterset.addClass("e-sortfiltericon");
                        if(this.model.groupSettings.showToggleButton){
                            $filterset.addClass("e-sortfiltergroupicon");
                            $togglegroup.addClass("e-togglesortgroupfilter");
                            if(this.model.enableRTL && $filterset.length)
                                $headertraversal.find(".e-ascending,.e-descending").addClass("e-rtlsortfiltertoggle");
                        }
                        if(this.model.enableRTL) {
                            if((!$filterset.length || !$togglegroup.length) && (!$filterset.length && !$togglegroup.length))
                                $headertraversal.find(".e-ascending,.e-descending").addClass("e-rtlsortadjust");
                            else if(!$filterset.length || !$togglegroup.length)
                                $headertraversal.find(".e-ascending,.e-descending").addClass("e-rtlgrouporfilter");
                        }
                        else if(!this.model.enableRTL && !$filterset.length && !$togglegroup.length)
                            $headertraversal.find(".e-ascending,.e-descending").addClass("e-sortadjust");
                    }
                }
                if(this.getHeaderTable().find(".e-fltrtempdiv").length > 0 ){
                    this.getHeaderTable().find(".e-filterbar").first().remove();
					this._renderFiltering();
					this._renderFilterBarTemplate();
				}
                var args = {};
                args.requestType = ej.Grid.Actions.Reorder;
                this._isReorder = true;
                this.refreshTemplate();
				if(this._isAddNew && this.model.isEdit){
					this.model.query = this.commonQuery.clone();
					this._ensureDataSource(args);
					this._isAddNew = false;
				}
				this.setWidthToColumns();
				if (!this.model.scrollSettings.frozenColumns)
				    this.getHeaderContent().find("div").first().scrollLeft(scrollLeft);
                this.sendDataRenderingRequest(args);
                this._isReorder = false;
            }
        },
        
        getPager: function () {
            return this._gridPager;
        },
        
        getFooterTable: function () {
            return this._gridFooterTable;
        },

        setGridFooterTable: function (value) {
            this._gridFooterTable = value;
        },
        
        getFooterContent: function () {
            return this._gridFooterContent;
        },

        setGridFooterContent: function (value) {
            this._gridFooterContent = value;
        },
        
        getScrollObject: function () {
            if (this._scrollObject == null || ej.isNullOrUndefined(this._scrollObject.model))
                this._scrollObject = this.getContent().ejScroller("instance");
            return this._scrollObject;
        },
        setGridPager: function (value) {
            this._gridPager = value;
        },
        
        getRowHeight: function () {
            var rowHeight = -1;
			if (this.getContentTable() != null) {
				var trColl = this.getContentTable().find('tr:not(.e-virtualrow)'), index = trColl.length > 2 ? 1 : 0;
				if(trColl.length)
					var $trBound = trColl[index].getBoundingClientRect();
				if (trColl.length > 1) {
					if ($trBound && $trBound.height) {
						rowHeight = $trBound.height;
					} else
						rowHeight = trColl[index].offsetHeight;
				}
			}
			else if (!ej.isNullOrUndefined(this.model.rowTemplate) && !ej.isNullOrUndefined(this._dataSource()) && this._dataSource().length > 0) {
			    var temp = document.createElement('div');
			    var myTemplate = $.templates(this.model.rowTemplate);
			    var data = this._dataSource()[0];
			    temp.innerHTML = ['<table class="e-template-table">', myTemplate.render(data), '</table>'].join("");
			    $("body").append(temp.firstChild);
			    var tr = $("body").find(".e-template-table").find("tr")[0];
			    rowHeight = tr.offsetHeight;
			    $("body").find(".e-template-table").remove();
			}
            return rowHeight == -1 ? 32 : rowHeight;
        },
        
        getCurrentIndex: function () {
            return ((this._currentPage() - 1) * (this.model.pageSettings.pageSize));
        },
        
        getColumnByIndex: function (index) {
            if (index < this.model.columns.length)
                return this.model.columns[index];
            return null;
        },
        set_currentPageIndex: function (val) {
            var pageSetting = this.model.pageSettings;
            var recordCount = this.model.filterSettings.filteredColumns.length == 0 ? this._searchCount == null ? this._gridRecordsCount : this._searchCount : this._filteredRecordsCount;
            if (pageSetting.totalPages == null)
                pageSetting.totalPages = Math.ceil(recordCount / pageSetting.pageSize);
            if (val > pageSetting.totalPages || val < 1 || val == this._currentPage())
                return false;
            if (ej.isNullOrUndefined(this._prevPageNo))
                this._prevPageNo = this._currentPage();
            this._currentPage(val);
            if (this._currentPage() != this._prevPageNo) {
                var args = {};
                args.requestType = "paging";
                this.gotoPage(this._currentPage(), args);
                return true;
            }
            else
                return false;
        },
        set_currentVirtualIndex: function (currentViewIndex) {                          
            if (currentViewIndex < 1 || (currentViewIndex != 1 && currentViewIndex != this._totalVirtualViews && currentViewIndex == this._currentVirtualIndex && this._checkCurrentVirtualView(this._virtualLoadedRows, currentViewIndex)))
                return false;                      
            this._prevVirtualIndex = this._currentVirtualIndex;							
            this._currentVirtualIndex = currentViewIndex;
			var currentPage = this._calculateCurrentViewPage();
			if(currentPage <= this.model.pageSettings.totalPages && !this._checkCurrentVirtualView(this._virtualLoadedRecords, this._currentVirtualIndex)){				
				if(this._prevVirtualIndex < currentViewIndex && currentViewIndex != 1){
					var setPage = this._isThumbScroll && currentPage != 1 ? currentPage : currentPage + 1;
                    if(!this._virtualPageRecords[setPage] && setPage <= this.model.pageSettings.totalPages)
                        this._setCurrentViewPage(setPage); 
					else	
						this._renderVirtulViewContent(currentPage);	
				}
				else if(this._prevVirtualIndex > currentViewIndex){
					var setPage = this._isThumbScroll ? currentPage : currentPage - 1;
                    if(this._virtualPageRecords[setPage] && !this._virtualLoadedRecords[currentViewIndex - 1])
                        setPage = currentPage - 1;
                    if(!this._virtualPageRecords[setPage] && setPage >= 1)
                        this._setCurrentViewPage(setPage);                                                     
				}                                                
                else 
                    this._renderVirtulViewContent(currentPage);
            }
            else 
                this._renderVirtulViewContent(currentPage);
            return true;            
        },
		_setCurrentViewPage: function(currentPage){
			this._needPaging = true;                
			this._prevPageNo = this._currentPage();             
            this.gotoPage(currentPage);
		},
		_renderVirtulViewContent: function(currentPage){
            this._needPaging = false;                      
            this._refreshVirtualView(this._currentVirtualIndex);
            this.element.ejWaitingPopup("hide");
        },
        _checkCurrentVirtualView: function(virtualContent, viewIndex){
            var virtualRowCount = this._virtualRowCount;            
            var prevView = viewIndex - 1, nextView = viewIndex + 1;
			if(virtualContent instanceof Array){
				if(virtualContent.length){
					if(((prevView == 0 || nextView == this._totalVirtualViews + 1) && $.inArray(viewIndex, virtualContent) != -1) || ($.inArray(prevView, virtualContent) != -1 && 
					$.inArray(viewIndex, virtualContent) != -1 && $.inArray(nextView, virtualContent) != -1))
						return true;					
				}				
			}
			else{
				var nextViewData = nextView == this._totalVirtualViews ? this._lastViewData : virtualRowCount;
				if((!this.initialRender && (viewIndex == 1 && this._virtualLoadedRows[viewIndex]) || viewIndex == this._totalVirtualViews && virtualContent == this._virtualLoadedRows && virtualContent[viewIndex]) ||
					((prevView == 0  && virtualContent[viewIndex] && virtualContent[viewIndex].length == virtualRowCount) || (nextView == this._totalVirtualViews + 1 && virtualContent[viewIndex] && virtualContent[viewIndex].length == this._lastViewData)) ||
					(virtualContent[prevView] && virtualContent[prevView].length == virtualRowCount && virtualContent[viewIndex] && virtualContent[viewIndex].length == virtualRowCount && virtualContent[nextView] && virtualContent[nextView].length == nextViewData))
						return true;								
			}
			return false;
        },
        expandCollapse: function ($target) {
            if ($target.prop("tagName") == "DIV" && ($target.parent().hasClass("e-recordplusexpand") || $target.parent().hasClass("e-recordpluscollapse") || $target.parent().hasClass("e-detailrowcollapse") || $target.parent().hasClass("e-detailrowexpand")))
                $target = $target.parent();
            var index = -1, fieldName, fieldvalue, parentGroup, collapsed;
            if (this.model.allowGrouping && (ej.isOnWebForms || this.initialRender)) {
                fieldName = $target.attr("data-ej-mappingname");
                fieldValue = $target.attr("data-ej-mappingvalue");
                if ($target.parents(".e-tabletd").length)
                    parentGroup = $target.parents(".e-tabletd").parent("tr").prev("tr").find(".e-recordplusexpand").attr("data-ej-mappingvalue");
                collapsed = this.model._groupingCollapsed;
                for (var i = 0; i < collapsed.length; i++) {
                    if (collapsed[i].key == fieldName && collapsed[i].value == fieldValue && (collapsed[i].parent == undefined || collapsed[i].parent == parentGroup)) {
                        index = i;
                        break;
                    }
                }
            }
            if (!($target.hasClass("e-recordplusexpand") || $target.hasClass("e-recordpluscollapse") || $target.hasClass("e-detailrowcollapse") || $target.hasClass("e-detailrowexpand")))
                return;
            if ($target.hasClass("e-recordplusexpand") && this.model.groupSettings.groupedColumns.length) {
                var cellIndex = $target.index();
                var $rows = $target.closest('tr').next();
                $rows.hide();
                $target.removeClass("e-recordplusexpand").addClass("e-recordpluscollapse").find("div").removeClass("e-gdiagonalnext").addClass("e-gnextforward");
                if ((ej.isOnWebForms || this.initialRender) && index == -1)
                    this.model._groupingCollapsed.push({ key: fieldName, value: fieldValue, parent: parentGroup })
            } else if ($target.hasClass("e-recordpluscollapse") && this.model.groupSettings.groupedColumns.length) {
                var cellIndex = $target.index();
                var $rows = $target.closest('tr').next();
                var toExpandRows = [];
                var $row = $rows;
                if ($($row[0].cells[cellIndex]).hasClass("e-indentcell")) {
                    if ($row.children(".e-indentcell").length == ($target.parent().children('.e-indentcell').length) + 1) {
                        $row.show();
                        var $expand = $row.children(".e-recordplusexpand");
                        if ($expand != null && $expand.length > 0) {
                            toExpandRows.push($expand);
                        }
                    }
                }
                $target.removeClass("e-recordpluscollapse").addClass("e-recordplusexpand").find("div").removeClass("e-gnextforward").addClass("e-gdiagonalnext");
                for (var i = 0; i < toExpandRows.length; i++) {
                    toExpandRows[i].removeClass("e-recordplusexpand").addClass("e-recordpluscollapse").find("div").removeClass("e-gdiagonalnext").addClass("e-gnextforward");
                    this.expandCollapse(toExpandRows[i]);
                }
                if ((ej.isOnWebForms || this.initialRender) && index != -1)
                    this.model._groupingCollapsed.splice(index, 1);
            } else if ($target.hasClass("e-detailrowexpand")) {
                var cellIndex = $target.index(), proxy = this;
                var rowIndexValue = this.getIndexByRow($target.closest('tr'));
                var $rows = $target.closest('tr').next();
                $rows.hide(0, function () {
                    var args = { masterRow: $target.closest('tr'), detailsRow: $rows, masterData: proxy._currentJsonData[rowIndexValue] };
                    var foreignKeyData = proxy._getForeignKeyData(args.masterData);
                    if (!ej.isNullOrUndefined(foreignKeyData))
                        args.foreignKeyData = foreignKeyData;
                    proxy._trigger("detailsCollapse", args);
                });
                (proxy.model.childGrid != null || proxy.model.detailsTemplate != null) && proxy.model.allowScrolling && proxy._refreshScroller({ requestType: "refresh" });
                $target.removeClass("e-detailrowexpand").addClass("e-detailrowcollapse").find("div").addClass("e-gnextforward").removeClass("e-gdiagonalnext");
            } else if ($target.hasClass("e-detailrowcollapse")) {
                var cellIndex = $target.index(), proxy = this;
                var rowIndexValue = this.getIndexByRow($target.closest('tr'));
                var detailrow = $target.closest('tr').next();
                if (detailrow.hasClass("e-detailrow"))
                    $rows = detailrow;
                else {
                    var detailtr = ej.buildTag("tr.e-detailrow", "", { 'display': 'none' }, {});
                    var indenttd = ej.buildTag("td.e-detailindentcell");
                    var detailstd = ej.buildTag("td.e-detailcell", "", {}, { colspan: this._visibleColumns.length });
                    var detaildiv = ej.buildTag("div");
                    var count = $($target.closest('tr')).parents('.e-grid').length;
                    detaildiv.attr("id", "child" + count + "_grid" + rowIndexValue + Math.round(Math.random() * 1000));
                    $(detailtr).append(indenttd);
                    $(detailtr).append(detailstd);
                    var rowData = this._currentJsonData[rowIndexValue];
                    if (this.model.detailsTemplate) {
                        var detailTemplate = this.model.detailsTemplate,
                        ngType = !ej.isNullOrUndefined(this.model.ngTemplateId) && (detailTemplate.startsWith("#") || detailTemplate.startsWith(".") || typeof detailTemplate === "object") ? this.model.ngTemplateId + "griddetailstemplate" : null;
                        $(detailtr).append(detailstd.append(this._renderEjTemplate(this.model.detailsTemplate, rowData, rowIndexValue, null, ngType)));
                    }
                        
                    $($target.closest('tr')).after(detailtr);
                    if (this.model.childGrid) {
                        this.model.childGrid["parentDetails"] = {
                            parentID: this._id,
                            parentPrimaryKeys: this.getPrimaryKeyFieldNames(),
                            parentKeyField: this.model.childGrid.queryString,
                            parentKeyFieldValue: rowData[this.model.childGrid.queryString],
                            parentRowData: rowData
                        }
                        $(detailtr).append(detailstd.append(detaildiv));
                    }
                    $rows = detailtr;
                }
                this._showGridLines();
                var toExpandRows = [];
                var $row = $rows;
                if ($($row[0].cells[cellIndex]).hasClass("e-detailindentcell")) {
                    $row.show(0, function () {
                        var args = { masterRow: $target.closest('tr'), detailsRow: $rows, masterData: proxy._currentJsonData[rowIndexValue] };
                        var foreignKeyData = proxy._getForeignKeyData(args.masterData);
                        if (!ej.isNullOrUndefined(foreignKeyData))
                            args.foreignKeyData = foreignKeyData;
                        proxy._trigger("detailsExpand", args);
                    });
                    if (!detailrow.hasClass("e-detailrow")) {
                        this._trigger("detailsDataBound", { detailsElement: detailtr, data: rowData, rowData: rowData }); // $(tbody).append(trchild);
                       this._trigger("refresh");
                    }
                    this.model.childGrid && !ej.isNullOrUndefined(detaildiv) && detaildiv.ejGrid(this.model.childGrid);
                    (proxy.model.childGrid != null || proxy.model.detailsTemplate != null) && proxy.model.allowScrolling && proxy._refreshScroller({ requestType: "refresh" });
                    var $expand = $row.children(".e-detailrowexpand");
                    if ($expand != null && $expand.length > 0) {
                        toExpandRows.push($expand);
                    }
                }
                $target.removeClass("e-detailrowcollapse").addClass("e-detailrowexpand").find("div").addClass("e-gdiagonalnext").removeClass("e-gnextforward");
                for (var i = 0; i < toExpandRows.length; i++) {
                    toExpandRows[i].removeClass("e-detailrowexpand").addClass("e-detailrowcollapse").find("div").removeClass("e-gdiagonalnext").addClass("e-gnextforward");
                    this.expandCollapse(toExpandRows[i]);
                }
            }
            if (this.model.allowScrolling && !ej.isNullOrUndefined(this._scrollObject && this._scrollObject.model) && !$target.closest(".e-hscroll").length)
                this.getScrollObject().refresh();
            if (this.model.isResponsive)
                this.windowonresize();

        },
        _refreshGridPager: function () {
            if (this.getPager() != null) {
                var pagerModel = this.getPager().ejPager("model"), model = {};
                model.currentPage = this._currentPage();
                if ((ej.isNullOrUndefined(this._filteredRecordsCount) || this._filteredRecordsCount == 0) && (this.model.currentViewData != null && this.model.currentViewData.length == 0) && (ej.isNullOrUndefined(this._prevPageNo) || this._prevPageNo)) {
                    model.currentPage = 0;
                    this._prevPageNo = pagerModel.currentPage;
                    this.model.pageSettings.currentPage = 0;
                } else if (pagerModel.currentPage == 0 && (ej.isNullOrUndefined(this._prevPageNo) || this._prevPageNo))
                    model.currentPage = this._prevPageNo;
                 var excludeTr = this.model.editSettings.showAddNewRow  && this.model.groupSettings.groupedColumns.length ==  0 ? 1 : 0;
                model.totalRecordsCount = this.model.filterSettings.filteredColumns.length == 0 ? this._searchCount == null ? this._gridRecordsCount - excludeTr : this._searchCount : this._filteredRecordsCount;
                if (model.totalRecordsCount == 0 && model.currentPage != 0) {
                    model.currentPage = 0;
                    this.model.pageSettings.currentPage = 0;
                }
                if (ej.util.isNullOrUndefined(model.currentPage))
                    model.currentPage = this._currentPage();
                this.getPager().ejPager("option", model).ejPager("refreshPager");
                this.model.pageSettings.totalPages = pagerModel.totalPages || null;
				this.model.pageSettings.totalRecordsCount = pagerModel.totalRecordsCount || null;
            }
        },
        _showHeaderColumn: function (showColumns, field) {
            var $head = this.getHeaderTable().find("thead");
            var $headerCell = $head.find("tr").not(".e-stackedHeaderRow").find(".e-headercell");
            var $filterBarCell = $head.find(".e-filterbar").find(".e-filterbarcell");
            var $col = this.getHeaderTable().find("colgroup").find("col"), column;
            for (var i = 0; i < showColumns.length; i++) {
                if (field)
                    column = ej.isNullOrUndefined(this.getColumnByField(showColumns[i])) ? this.getColumnByHeaderText(showColumns[i], ej.isNullOrUndefined(this.getColumnByField(showColumns[i]))) : this.getColumnByField(showColumns[i]);
                else
                    column = this.getColumnByHeaderText(showColumns[i]);
                var index = $.inArray(column, this.model.columns);
                index = (this.model.detailsTemplate != null || this.model.childGrid) ? index + 1 : index;
                var frznCol = this.model.scrollSettings.frozenColumns;
                if (frznCol != 0 && index >= frznCol)
                    var thIndex = $headerCell.eq(index).removeClass("e-hide").index() + frznCol;
                else
                    var thIndex = $headerCell.eq(index).removeClass("e-hide").index();
                $filterBarCell.eq(thIndex).removeClass("e-hide");
				 if ($col.length > this.model.columns.length && this.model.groupSettings.groupedColumns.length){
					var len = $col.length - this.model.columns.length;
					$col = $col.slice((this.model.detailsTemplate || this.model.childGrid) ? len + 1 : len);				
				}
                $col.eq(index).css("display", "");
            }
            if (this.model.showStackedHeader)
                this._refreshStackedHeader();
        },
        _hideHeaderColumn: function (hiddenColumns, field) {
            var $head = this.getHeaderTable().find("thead");
            var $headerCell = $head.find("tr").not(".e-stackedHeaderRow").find(".e-headercell");
            var $filterBarCell = $head.find(".e-filterbar").find(".e-filterbarcell");
            var $col = this.getHeaderTable().find("colgroup").find("col"), column;
            for (var i = 0; i < hiddenColumns.length; i++) {
                if (field)
                    column = ej.isNullOrUndefined(this.getColumnByField(hiddenColumns[i])) ? this.getColumnByHeaderText(hiddenColumns[i], ej.isNullOrUndefined(this.getColumnByField(hiddenColumns[i]))) : this.getColumnByField(hiddenColumns[i]);
                else
                    column = this.getColumnByHeaderText(hiddenColumns[i]);
                var index = $.inArray(column, this.model.columns);
                var dindex = (this.model.detailsTemplate != null || this.model.childGrid) ? index + 1 : index;
                var frznCol = this.model.scrollSettings.frozenColumns;
                if (frznCol != 0 && index >= frznCol)
                    var thIndex = $headerCell.eq(dindex).addClass("e-hide").index() + frznCol;
                else
                    var thIndex = $headerCell.eq(dindex).addClass("e-hide").index();
                $filterBarCell.eq(thIndex).addClass("e-hide");
                if ($col.length > this.model.columns.length)
                    $col = $col.slice($col.length - this.model.columns.length);
                $col.eq(index).css("display", "none");
            }
            if (this.model.showStackedHeader) {
                this._refreshStackedHeader();
                this._colgroupRefresh();
            }
        },
        _refreshStackedHeader: function () {
			if(this.model.showStackedHeader){
            var stackedRows = this.model.stackedHeaderRows;
            for (var i = 0; i < stackedRows.length; i++) {
                if (this.model.scrollSettings.frozenColumns != 0) {
                    var frznHeader = $(this.getHeaderContent().find(".e-frozenheaderdiv"));
                    var movHeader = $(this.getHeaderContent().find(".e-movableheader"));
                    var newFrzn = this._createStackedRow(stackedRows[i], true);
                    var newMov = this._createStackedRow(stackedRows[i], false);
                    $(frznHeader.find("tr.e-stackedHeaderRow")[i]).replaceWith(newFrzn);
                    $(movHeader.find("tr.e-stackedHeaderRow")[i]).replaceWith(newMov);
                }
                else {
                    var stackedTR = this._createStackedRow(stackedRows[i], false);
                    if (this.getHeaderTable().find("tr.e-stackedHeaderRow")[i])
                        $(this.getHeaderTable().find("tr.e-stackedHeaderRow")[i]).replaceWith(stackedTR);
                    else
                        stackedTR.insertBefore(this.getHeaderTable().find("tr.e-columnheader:last"));
                }
            }
            var args = {};
            args.requestType = "refresh";
            if (this.model.allowGrouping && this.model.groupSettings.groupedColumns.length > 0) {
                for (var i = 0; i < this.model.groupSettings.groupedColumns.length; i++)
                    this.getHeaderTable().find(".e-stackedHeaderRow").prepend(this._getGroupTopLeftCell());
            }
            this.model.allowScrolling && this._refreshScroller(args);
			}

        },
        _getStackedColumnByTarget: function (target) {
            var cls = (target.get(0) || {}).className, match = /e-row([0-9])-column([0-9])/.exec(cls),
                rIndx = match[1], cIndx = match[2], key = [rIndx, "stackedHeaderColumns", cIndx].join(".");

            return ej.getObject(key, this.model.stackedHeaderRows);
        },
        _checkSkipAction: function (args) {
            switch (args.requestType) {
                case ej.Grid.Actions.Save:
                case ej.Grid.Actions.Delete:
                    return true;
            }
            return false;
        },
        _unboundTemplateRendering: function (unboundTemplateId) {
            return $("#" + unboundTemplateId).html();
        },
        _processBindings: function (args) {
            this._requestType = args.requestType;
            this.model.query = this.commonQuery.clone();
            if (!this._checkSkipAction(args) && this._trigger("actionBegin", args))
                return true;
            if (this.model.editSettings.editMode == "batch" && args.requestType != "batchsave" && args.requestType != "cancel" && !this._confirmedValue && this._bulkChangesAcquired() && this.model.editSettings.showConfirmDialog) {
                this._confirmDialog.find(".e-content").html(this.localizedLabels.BatchSaveLostChanges);
                this._confirmDialog.ejDialog("open");
                this._requestArgs = args;
                return false;
            }
            if (!ej.isNullOrUndefined(this.model.dataSource) && args.requestType == "refresh" && this.model.scrollSettings.allowVirtualScrolling) {
                this._currentPage(1);
                this._scrollValue = 0;
                this._loadedJsonData = [];
                this._prevPage = this._currentPage();
            }
            this._ensureDataSource(args);
            if (this.model.scrollSettings.allowVirtualScrolling) {
                if (args.requestType == "virtualscroll") {
                    this._loadedJsonData.push({ pageIndex: this._prevPage, data: this._currentJsonData });
                    this._prevPage = this._currentPage();
                }
                else if (!this.model.scrollSettings.enableVirtualization) {
                    this._virtualLoadedRecords[this._currentPage()] = !ej.isNullOrUndefined(this._currentPageData) ? this._currentPageData : this.model.currentViewData;
                    this._currentPageData = null;
                }
                if (args.requestType == "filtering") {
                    this._loadedJsonData = [];
                    this._prevPage = this._currentPage(); $("#" + this._id + "_externalEdit").remove();
                }
                if (args.requestType == ej.Grid.Actions.Delete || args.requestType == ej.Grid.Actions.Add)
                    this._refreshVirtualViewDetails();
            }
            if (this.model.scrollSettings.allowVirtualScrolling && args.requestType == "filtering" && this.model.filterSettings.filteredColumns.length >0) 
                this.getScrollObject().scrollY(0);
            if (this.model.enableRTL) {
                !this.element.hasClass("e-rtl") && this.element.addClass("e-rtl");
            } else {
                this.element.hasClass("e-rtl") && this.element.removeClass("e-rtl")
            }
            if (args.requestType == ej.Grid.Actions.Delete && this.model.groupSettings.groupedColumns.length == 0) {
                if (this.model.editSettings.showAddNewRow)
                    this.getContentTable().find(".e-addedrow").remove();
                args.tr.remove();
            }
            this._editForm = this.model.scrollSettings.frozenColumns > 0 || this.model.editSettings.showAddNewRow ? this.element.find(".gridform") : $("#" + this._id + "EditForm");
			if (!(this.model.editSettings.showAddNewRow && args.requestType == "beginedit") && this._editForm.length != 0) {
                for(var i=0;i<this._editForm.length;i++){
					$(this._editForm[i]).find("select.e-dropdownlist").ejDropDownList("destroy");
					$(this._editForm[i]).find(".e-datepicker").ejDatePicker("destroy");
					$(this._editForm[i]).find(".e-datetimepicker").ejDateTimePicker("destroy");
					$(this._editForm[i]).find(".e-numerictextbox").ejNumericTextbox("destroy");
				}
            }
			if ((this._dataSource() instanceof ej.DataManager && !this._isRemoteSaveAdaptor && args.requestType != ej.Grid.Actions.BeginEdit && args.requestType != ej.Grid.Actions.Cancel && args.requestType != ej.Grid.Actions.Add) && (!(this._dataSource().adaptor instanceof ej.SqlDataSourceAdaptor) || (args.requestType != ej.Grid.Actions.Save && args.requestType != ej.Grid.Actions.Delete))) {
			    if (this.model.scrollSettings.allowVirtualScrolling && !this.model.scrollSettings.enableVirtualization && this.model.pageSettings.totalPages == this.model.pageSettings.currentPage && this.virtualLoadedPages.indexOf(((this.model.pageSettings.currentPage - 2) * (this.model.pageSettings.pageSize))) == -1) {
                    var pageQuery = ej.pvt.filterQueries(this.model.query.queries, "onPage");
                    this.model.query.queries.splice($.inArray(pageQuery[0], this.model.query.queries), 1);
                    this.model.query.page(this._currentPage() - 1, this.model.pageSettings.pageSize);
                    var lastQueryPromise = this._dataSource().executeQuery(this.model.query);
                    this.model.query.queries.splice($.inArray(pageQuery[0], this.model.query.queries), 1);
                    this.model.query.page(this._currentPage(), this.model.pageSettings.pageSize);
                }
                if (this._virtualSelectedRows && this._virtualSelectedRows.length > 0) {
                    this.model.query.addParams('virtualSelectRecords', this._virtualSelectedRows)
                }
                var queryPromise = this._queryPromise = this._dataSource().executeQuery(this.model.query);
                var waitingPopup = this.element.ejWaitingPopup("instance");
                var proxy = this;
                this.element.ejWaitingPopup("show");
                if (proxy._dataSource().ready) {
                    proxy._dataSource().ready.done(function () {
                        proxy._processDataRequest(proxy, args, queryPromise, lastQueryPromise)
                    });
                }
                else {
                    proxy._processDataRequest(proxy, args, queryPromise, lastQueryPromise)
                }
            } else {
                if (this._isRelationalRendering(args))
                    this._setForeignKeyData(args);
                else
                    this.sendDataRenderingRequest(args);
            }
        },
        _processDataRequest: function (proxy, args, queryPromise, lastQueryPromise) {
            queryPromise.done(ej.proxy(function (e) {
                if(e.count > 0 && !proxy._currentPage()){
                    proxy._currentPage(1);
                }
                if (ej.isNullOrUndefined(proxy.element) || proxy._dataSource().adaptor instanceof ej.SqlDataSourceAdaptor)
                    return;
                if (lastQueryPromise && !proxy._previousPageRendered)
                    proxy._processLastPageData(proxy, args, e, lastQueryPromise);
                else if (proxy._remoteLastPageRendered && proxy.model.pageSettings.currentPage == proxy.model.pageSettings.totalPages - 1 && !proxy.model.scrollSettings.enableVirtualization) {
                    var count = proxy.model.pageSettings.pageSize - proxy._previousPageLength;
                    for (var dupRow = 0; dupRow < count; dupRow++) {
                        var removeEle = proxy.getRows()[proxy.getRows().length - (proxy.model.pageSettings.pageSize - dupRow)];
                        removeEle.remove();
                    }
                    proxy._tempPageRendered = true;
                    proxy.model.currentViewData = e.result;
                    proxy._relationalColumns.length == 0 && proxy.element.ejWaitingPopup("hide");
                }
                else {
                    if (proxy._identityKeys.length && args.action == "add" && this.adaptor instanceof ej.ODataAdaptor)
                        proxy._processIdentityField(e.result, args);
                    if (proxy.model.pageSettings.currentPage == proxy.model.pageSettings.totalPages - 1 && !proxy._remoteLastPageRendered)
                        proxy._previousPageRendered = true;
                    proxy.model.currentViewData = e.result == null ? [] : e.result;
                    if (proxy._$fkColumn && proxy.model.filterSettings.filterType == "excel" && proxy.model.filterSettings.filteredColumns.length > 0)
                        proxy._fkParentTblData = e.result;
                    proxy._relationalColumns.length == 0 && proxy.element.ejWaitingPopup("hide");
                }
				if(proxy.model.allowScrolling && proxy.model.scrollSettings.allowVirtualScrolling && proxy.model.scrollSettings.enableVirtualization){
					if(args.requestType == "filtering"){
						proxy._gridRecordsCount = proxy._filteredRecordsCount = e.count;
						proxy._refreshVirtualViewDetails();
					}
					if(e.result.length){
					    if (proxy._isInitNextPage || proxy._isLastVirtualpage) {
							proxy._gridRecordsCount = e.count;
                            proxy._refreshVirtualViewDetails();
					        proxy._setInitialCurrentIndexRecords(e.result, proxy._currentPage());
					        proxy._isInitNextPage = proxy._isLastVirtualpage = false;
					    }
					    else {
					        proxy._gridRecordsCount = e.count;
                            proxy._refreshVirtualViewDetails();
					        proxy._setVirtualLoadedRecords(e.result, proxy._currentPage());
					    }
						if(proxy._isThumbScroll && !proxy._checkCurrentVirtualView(proxy._virtualLoadedRecords, proxy._currentVirtualIndex))
							proxy._checkPrevNextViews();																										
						proxy._remoteRefresh = true;
					}
					else
						proxy.getContent().find(".e-virtualtop, .e-virtualbottom").remove();					
				}
                if (!ej.isNullOrUndefined(e.aggregates))
                    proxy._remoteSummaryData = e.aggregates;
                if (args.templateRefresh) {
                   proxy.refreshHeader(); 
                }
                if (ej.isNullOrUndefined(lastQueryPromise) || (ej.isNullOrUndefined(proxy._previousPageRendered) || proxy._previousPageRendered))
                    proxy._processData(e, args);
				if (!ej.isNullOrUndefined(proxy._unboundRow) && args.selectedRow != proxy._unboundRow && args.requestType == "save") {
                    proxy._unboundRow.find(".e-editbutton").trigger("click");
                    proxy._unboundRow = null;
                }
            }));
            queryPromise.fail(ej.proxy(function (e) {
                if (ej.isNullOrUndefined(proxy.element))
                    return;
                proxy.element.ejWaitingPopup("hide");
                args.error = e.error;
                e = [];
                proxy.model.currentViewData = [];
                proxy._processData(e, args);
                if (!ej.isNullOrUndefined(proxy.getPager())) {
                    proxy.getPager().ejPager({ currentPage: 0, totalRecordsCount: 0 });
                }
                proxy._trigger("actionFailure", args);
            }));
        },
        _processIdentityField: function (result, args) {
            var _pKey = this._primaryKeys[0];
            var resultPK = ej.distinct(result, _pKey);
            var curPK = ej.distinct(this.model.currentViewData, _pKey);
            var addPK = $.grep(resultPK, function (value) {
                if ($.inArray(value, curPK) == -1)
                    return true;
                return false;
            });
            var data = ej.DataManager(result).executeLocal(new ej.Query().where(_pKey, "equal", addPK))[0]
            args.data = ej.isNullOrUndefined(data) ? args.data : data;
        },
        _processLastPageData: function (proxy, args, currentData, lastQueryPromise) {
            lastQueryPromise.done(ej.proxy(function (e) {
                proxy.element.ejWaitingPopup("hide");
                proxy.model.previousViewData = e.result;
                if (proxy.model.previousViewData && proxy.model.previousViewData.length != 0) {
                    proxy._previousPageLength = currentData.result.length;
                    proxy._currentPageData = currentData.result;
                    ej.merge(proxy.model.previousViewData, currentData.result);
                    proxy.model.currentViewData = proxy.model.previousViewData;
                    proxy._remoteLastPageRendered = true;
                }
                proxy._processData(currentData, args);
            }));
            lastQueryPromise.fail(ej.proxy(function (e) {
                proxy.element.ejWaitingPopup("hide");
                args.error = e.error;
                e = [];
                proxy.model.previousViewData = [];
                proxy._processData(e, args);
                proxy._trigger("actionFailure", args);
            }));
        },
        _createUnboundElement: function (column,count) {
            var divElement = document.createElement("div");
            column.headerText = !ej.isNullOrUndefined(column.headerText) ? column.headerText : ej.isNullOrUndefined(column.field) ? "" : column.field;
            if (!ej.isNullOrUndefined(column.headerText))
                divElement.id = this._id + column.headerText.replace(/[^a-z0-9|s_]/gi, '') + count + "_UnboundTemplate";
            var $div = ej.buildTag("div.e-unboundcelldiv"), commands = column["commands"];
            for (var unbounType = 0; unbounType < commands.length; unbounType++) {
                var $button = ej.buildTag("button.e-flat e-" + commands[unbounType].type.replace(/\s+/g, "") + "button", "", {}, { type: "button" });
                $button.val(commands[unbounType].type);
                if (commands[unbounType].type == "save" || commands[unbounType].type == "edit")
                    $button.addClass("e-btnsub")
                if (commands[unbounType].type == "cancel" || commands[unbounType].type == "delete")
                    $button.addClass("e-btncan")
                $div.append($button);
            }
            $("body").append($(divElement).html($div).hide());
            return divElement;
        },
        _refreshUnboundTemplate: function ($target) {
            if (this._isUnboundColumn) {
                var index = 0;
                for (var column = 0; column < this.model.columns.length; column++) {
                    if (this.model.columns[column]["commands"]) {
                        var $unboundDivs = $target.find(".e-unboundcell.e-" + this.model.columns[column]["headerText"].replace(/[^a-z0-9|s_]/gi, '')+column).find(".e-unboundcelldiv");
                        var commands = $.extend(true, [], this.model.columns[column].commands);
                        for (var j = 0; j < commands.length; j++) {
                            if (ej.isNullOrUndefined(commands[j].buttonOptions))
                            commands[j].buttonOptions = {};
                            commands[j].buttonOptions.width = ej.isNullOrUndefined(commands[j].buttonOptions.width) ? "52" : commands[j].buttonOptions.width;
                            commands[j].buttonOptions.height = ej.isNullOrUndefined(commands[j].buttonOptions.height) ? "28" : commands[j].buttonOptions.height;
                            commands[j].buttonOptions.cssClass = ej.isNullOrUndefined(commands[j].buttonOptions.cssClass) ? this.model.cssClass : commands[j].buttonOptions.cssClass;
                            commands[j].buttonOptions.enableRTL = this.model.enableRTL;
                            var $buttons = $unboundDivs.find(".e-" + commands[j].type.replace(/\s+/g, "") + "button");
                            if (!this.model.isEdit || this._requestType == "cancel" || this._requestType == "sorting" || this._requestType == "grouping" || this._requestType == "filtering" || this._requestType == "paging") {
								if ($target.closest(".e-editcell").length) {
									if (commands[j].type == "save" || commands[j].type == "cancel")
										$buttons.show();
									else {
										$buttons.hasClass("e-deletebutton") && $buttons.hide();
										$buttons.hasClass("e-editbutton") && $buttons.hide();
									}
								} else {
									if (commands[j].type == "save" || commands[j].type == "cancel")
										$buttons.hide();
									else {
										$buttons.hasClass("e-deletebutton") && $buttons.show();
										$buttons.hasClass("e-editbutton") && $buttons.show();
									}
								}
                            }
                            for (var i = 0; i < $buttons.length; i++) {
                                if ($($buttons[i]).data("ejButton"))
                                    $($buttons[i]).ejButton("destroy");
                            }
                            $buttons.ejButton(commands[j].buttonOptions);
                        }
                    } else
                        continue;
                }
            }
        },
        _gridTemplate: function (self, templateId, index) {
            var $column = self.model.columns[index];
            if (self.model.scrollSettings.enableVirtualization)
                this.index += self._currentVirtualRowIndex;
            if ((!ej.isNullOrUndefined(self.model.ngTemplateId) && self._isAddNew) || !ej.isNullOrUndefined(self._isGrouping))
                this.index = self._isAddNew ? 0 : self._currentJsonData.indexOf(this.data);
            return self._renderEjTemplate("#" + templateId, this.data, this.index, $column);
        },
        _createTemplateElement: function (column, appendTo /* container to append */, text) {
            var tmpl = column["templateID" in column ? "templateID" : "template"], quickReg = /^#([\w-]*)/,
                match = quickReg.exec(tmpl), scriptReg = /^<script/i, appendTo = appendTo || $("body"), scripEle,
                idText = text ? "Pager" : (column.headerText + $.inArray(column, this.model.columns) + "_") + "Template";

            var options = {
                name: "SCRIPT",
                type: "text/x-template",
                text: tmpl,
                id: (this._id + idText).replace(/(\\|[^0-9A-z-_])/g, "")
            };

            if ( match && match[1] )
                scripEle = document.getElementById(match[1]);
            else {
                if (scriptReg.test(tmpl)) // branch here to handle tmpl string with SCRIPT. 
                    scripEle = $(tmpl).get(0);
                else
                    scripEle = ej.buildTag(options.name, options.text).get(0);
            }

            scripEle.id = scripEle.id || options.id; // Update Id and type if not in scriptElement template string.
            scripEle.type = scripEle.type || options.type;

            appendTo.append(text ? scripEle.innerHTML : scripEle); //if `text` then append innerHTML instead of element.

            return scripEle;
        },
        _renderGridPager: function () {
            var $div = $(document.createElement('div'));
            var pagerModel = {};
            this.model.pageSettings.change = this._gPagerClickHandler;
            this.model.pageSettings.pageSizeSelected = this._gPageSize;
            this.model.pageSettings.totalRecordsCount = this._gridRecordsCount || null;
            this.model.pageSettings.enableRTL = this.model.enableRTL;
            this.model.pageSettings.locale = this.model.locale;
            this.model.pageSettings.enableQueryString = this.model.pageSettings.enableQueryString;
            if (this.model.allowFiltering && this.model.filterSettings.filterType == "filterbar")
                pagerModel.enableExternalMessage = this.model.filterSettings.showFilterBarStatus;
            $.extend(pagerModel, this.model.pageSettings);
            pagerModel.currentPage = this._currentPage();
            pagerModel.masterObject = this;
            this.setGridPager($div);
            if(pagerModel.template != undefined)
                pagerModel.template = null;
            $div.ejPager(pagerModel);
            $div.ejPager("refreshPager");
            pagerModel = $div.ejPager("model");
            this.model.pageSettings.totalPages = pagerModel.totalPages || null;
            if (this._currentPage() !== pagerModel.currentPage)
                this._currentPage(pagerModel.currentPage);
            this._renderPagerTemplate($div);
            return $div;
        },
        _renderPagerTemplate: function (pager, showDefaults) {
            var model = this.model.pageSettings, defaults = pager.find(".e-pagercontainer").not(".e-template").length == 0;            
            pager.find(".e-pagercontainer.e-template").remove();

            if ((showDefaults || !model.enableTemplates) && defaults) //Used to enable default pager from disabled
                pager.ejPager("renderPager");

            if (model.enableTemplates) {                

                if (!model.showDefaults)
                    pager.children().remove();               

                var $customDiv = ej.buildTag('div', null, null, { "class": "e-pagercontainer e-template", "style": "width: auto;" });                
                this._createTemplateElement(this.model.pageSettings, $customDiv, true);                
                pager.append($customDiv)
            }          
           
        },
        _renderContext: function (e) {
            var menuitems = this.model.contextMenuSettings.contextMenuItems;
            var item, item2, i = 0;
            var ul = ej.buildTag('ul', "", {}, { id: this._id + '_Context' });
            if (!this.model.contextMenuSettings.disableDefaultItems) {
                for (i; i < menuitems.length; i++) {
                    item = menuitems[i];
                    item2 = this._items(item, "contextMenuItem");
                    ul.append(item2);
                }
            }
            var customitems = this.model.contextMenuSettings.customContextMenuItems;
            var subMenuItems = this.model.contextMenuSettings.subContextMenu;
            var custom, custom2, j = 0, template;
            for (j; j < customitems.length; j++) {
                custom = customitems[j];
                custom2 = this._items(custom, "customContextMenuItem");                
                for (var k = 0 ; k < subMenuItems.length; k++)
                    if ((typeof custom == "string" && custom ==  subMenuItems[k].contextMenuItem) || (typeof custom == "object" && custom.id ==  subMenuItems[k].contextMenuItem )) {
                        template = subMenuItems[k].template;
                        var ul1 = ej.buildTag('ul', "", {}, { id: this._id + '_subMenuContext' + k }), menuItem, menuItem1;
                        if(!ej.isNullOrUndefined(template))
                            ul1 = this._renderEjTemplate(template);
                        else{
                            for (var l = 0; l < subMenuItems[k].subMenu.length; l++) {
                                menuItem = subMenuItems[k].subMenu[l];
                                menuItem1 = this._items(menuItem, "subMenuItems");
                                ul1.append(menuItem1);
                            }
                        }
                        custom2.append(ul1);
                    }
                ul.append(custom2);
            }
            if (ul.find("li").length > 0) {
                this.element.append(ul);
                var parentControl = this.element.parents("div.e-grid");
                var native = ej.Menu.prototype._showContextMenu;
                ej.Menu.prototype._showContextMenu = function (locationX, locationY, target, evt) {
                    $(this.model.contextMenuTarget).hasClass("e-grid") && (++locationX, ++locationY)
                    native.apply(this, [locationX, locationY, target, evt]);
                };
                $(ul).ejMenu({
                    menuType: ej.MenuType.ContextMenu,
                    openOnClick: false,
                    contextMenuTarget: "#" + this._id,
                    click: $.proxy(this._clickevent, this),
                    width: "auto",
                    beforeOpen: $.proxy(this._menu, this)
                });
                if (parentControl.length) {
                    var parentElement = $("#" + parentControl[0].id + '_Context');
                    var target = parentElement.ejMenu("model.excludeTarget");
                    parentElement.ejMenu({ excludeTarget: !ej.isNullOrUndefined(target) && target.length != 0 ? target.concat(",#" + this._id) : "#" + this._id });
                }
                this._conmenu = ul.data("ejMenu");
            }
        },
        _clickevent: function (sender) {
            var args = sender.events.text;
            var tr = $(this._contexttarget.parentNode);
            var c = $(this._contexttarget);
            if (c.hasClass("e-filterset"))
                c = c.siblings();
            else if (c.hasClass("e-icon") || c.hasClass("e-number"))
                c = c.parent();
            var columnName = c.attr("data-ej-mappingname")|| c.find(".e-headercelldiv").attr("data-ej-mappingname");
            if (this._trigger("contextClick", sender))
                return;
            switch (args) {
                case this.localizedLabels.AddRecord: this._startAdd();
                    break;
                case this.localizedLabels.EditRecord:
                    if (this.model.editSettings.editMode == "batch") {
                        var colindex = $(this._contexttarget.parentNode).find(".e-rowcell").index(c), index = this._excludeDetailRows().index(tr), fieldName = this.model.columns[colindex]["field"];
                        this.editCell(index, fieldName);
                    }
                    else
                        this.startEdit(tr);
                    break;
                case this.localizedLabels.DeleteRecord:
                    if (this.model.editSettings.showDeleteConfirmDialog)
                        this._confirmDialog.find(".e-content").html(this.localizedLabels.ConfirmDelete).end().ejDialog("open");
					else if (this.multiDeleteMode && this.selectedRowsIndexes.length > 1)
                       this._multiRowDelete();
                    else
                       this.deleteRow(tr);
                    break;
                case this.localizedLabels.Save:
                    if (this.model.editSettings.editMode == "batch")
                        this.batchSave();
                    else
                        this.endEdit();
                    break;
                case this.localizedLabels.Cancel: this.cancelEdit();
                    break;
                case this.localizedLabels.SortInDescendingOrder: var columnSortDirection = ej.sortOrder.Descending;
                    this.sortColumn(columnName, columnSortDirection);
                    break;
                case this.localizedLabels.SortInAscendingOrder: var columnSortDirection = ej.sortOrder.Ascending;
                    this.sortColumn(columnName, columnSortDirection);
                    break;
                case this.localizedLabels.Grouping: this.groupColumn(columnName);
                    break;
                case this.localizedLabels.Ungrouping: this.ungroupColumn(columnName);
                    break;
                case this.localizedLabels.NextPage:
                case this.localizedLabels.PreviousPage:
                case this.localizedLabels.LastPage:
                case this.localizedLabels.FirstPage: this._page(sender);
                    break;
            }

        },

        _menu: function (sender) {
            var context = this._conmenu.element;
            this._contexttarget = sender.target;
            var targetelement = $(sender.target), element, value;
            var td = $(this._contexttarget);
            if (this.model.allowSelection && (td.hasClass("e-rowcell") || td.closest(".e-rowcell").length)  && !targetelement.hasClass("e-selectionbackground")) {
                var tr = td.hasClass("e-rowcell") ? td.parent() : td.closest(".e-rowcell").parent();
                if (!this.model.isEdit)
                    this.selectRows(this.getIndexByRow(tr), null, td);
            }
            if ((targetelement.hasClass("e-ascending") || targetelement.hasClass("e-descending")) && !targetelement.parent().hasClass("e-headercelldiv"))
                return false;
            if (targetelement.hasClass("e-filtericon") || targetelement.hasClass("e-headercelldiv"))
                element = sender.target.parentNode.getAttribute("aria-sort");
			else if (targetelement.hasClass("e-headercell"))
				element = sender.target.getAttribute("aria-sort");
            else
                element = targetelement.parent().parent().attr("aria-sort");
            var target = sender.target.className;
            var sorting = $(context);
            if (targetelement.hasClass("e-filterset"))
                value = targetelement.siblings().attr("data-ej-mappingname");
            else if (targetelement.hasClass("e-icon") || targetelement.hasClass("e-number"))
                value = targetelement.parent().attr("data-ej-mappingname");
            else if(targetelement.hasClass("e-headercell"))
				value=targetelement.find(".e-headercelldiv").attr("data-ej-mappingname");
			else
                value = targetelement.attr("data-ej-mappingname");            
            context.css("visibility", "visible");            
            var index = targetelement.closest("tr").hasClass("e-insertedrow") ? this.model.groupSettings.groupedColumns.length : 0;
            var rowCell = targetelement.closest(".e-rowcell");
            var headerCell = targetelement.closest(".e-headercell");
            var tempIndex = rowCell.index() != -1 ? rowCell.index() : headerCell.index() - this.model.groupSettings.groupedColumns.length;
            var columnIndex = targetelement.hasClass("e-rowcell") ? targetelement.index() - index : tempIndex - index;
            columnIndex = (this.model.detailsTemplate != null || this.model.childGrid != null) ? columnIndex - 1 : columnIndex;
            var col = this.model.columns[columnIndex];
            var mapObj = {
                "allowGrouping": ".e-contextgrouping",
                "allowSorting": ".e-contextascending, .e-contextdescending",
                "editSettings.allowAdding": ".e-contextadd",
                "editSettings.allowEditing": ".e-contextedit",
                "editSettings.allowDeleting": ".e-contextdelete",
            };         
            for (var prop in mapObj) {
                var ele = context.find(mapObj[prop]).parent();
                if (ej.getObject(prop, this.model) == false || (ej.getObject(prop, col) === false))
                    ele.css("display", "none");
                else if (ele.css("display") == "none")
                    ele.css("display", "block");
           }
            if (targetelement.closest(".e-grid").attr("id") !== this._id || targetelement.is("input")) {
                context.css("visibility", "hidden");
                return;
            }
            else if (this.getHeaderTable().find(targetelement).length > 0) {
                if (!(headerCell.length != 0 && headerCell.children().hasClass("e-headercelldiv"))) {
                    context.css("visibility", "hidden");
                    return;
                }
                var a = $(context.find(".e-head"));
                context.find(".e-page").css("display", "none");
                context.find(".e-content").css("display", "none");
                context.find(".e-savcan").css("display", "none");
                a.css("display", "block");                
                if(ej.isNullOrUndefined(col.field) || col.field == "") {
                     a.css("display","none");
                     if (context.find(".e-customitem").length == 0)
                        context.css("visibility", "hidden")
               }
			   var exarg = { columnIndex: columnIndex, headerText: col.headerText }
			   $.extend(sender,exarg);
             }
            else if (this.getContentTable().find(targetelement).length > 0) {
			    var rowIndex = this.getIndexByRow($(sender.target.parentElement));
               var rowData = this.model.editSettings.editMode == "batch"?this.getDataByIndex(rowIndex):this.getSelectedRecords();
                if (rowCell.length == 0) {
                    context.css("visibility", "hidden");
                    return;
                }
                var a = $(context.find(".e-content"));
                context.find(".e-head").css("display", "none");
                context.find(".e-page").css("display", "none");
                context.find(".e-savcan").css("display", "none");
                a.css("display", "block");                
                if ((ej.isNullOrUndefined(col.field) || col.field == "") && this.model.editSettings.editMode == "batch") {
                    a.css("display","none");
                    if (context.find(".e-customitem").length == 0)
                       context.css("visibility", "hidden")
               }
		    if(this.model.editSettings.editMode =="batch")
			   {
			     var exarg = { columnIndex: columnIndex, rowIndex: rowIndex, rowData:rowData , headerText: col.headerText,cellValue:ej.getObject(ej.isNullOrUndefined(col.field) ? "" : col.field, rowData) }
			   }
		     else
			     var exarg = { columnIndex: columnIndex, rowIndex: rowIndex, rowData:rowData, headerText: col.headerText, }
				 $.extend(sender,exarg);
             }
            else if (!ej.isNullOrUndefined(this.getPager()) && this.getPager().find(targetelement).length > 0 || targetelement.hasClass("e-pager")) {
                var a = $(context.find(".e-page"));
                context.find(".e-head").css("display", "none");
                context.find(".e-content").css("display", "none");
                context.find(".e-savcan").css("display", "none");
                a.css("display", "block");
            }
            else {
                var a = $(context);
                context.css("visibility", "hidden");
                return false;
            }
            switch (element) {
                case "ascending": sorting.find(".ascending").parent().css("display", "none");
                    break;
                case "descending": sorting.find(".descending").parent().css("display", "none");
                    break;
            }
            if (targetelement.hasClass("e-rowcell") && this.model.editSettings.showAddNewRow) {
                var a = $(context.find(".e-savcan"));
                context.find(".e-contextadd").parent().css("display", "none");
                a.css("display", "block");
            }
            if (this.model.editSettings.editMode == "batch" && (this.batchChanges.changed.length || this.batchChanges.deleted.length || this.batchChanges.added.length)) {
                var a = $(context.find(".e-savcan"));
                context.find(".e-head").css("display", "none");
                context.find(".e-page").css("display", "none");
                a.css("display", "block");
            }
            if (this.model.isEdit && targetelement.closest(".e-rowcell").length && (!this.model.editSettings.showAddNewRow || $(".e-editedrow").length > 0)) {
                var a = $(context.find(".e-savcan"));
                context.find(".e-head").css("display", "none");
                context.find(".e-content").css("display", "none");
                context.find(".e-page").css("display", "none");
                a.css("display", "block");
            }
            if (this.model.pageSettings.totalPages == 1 && a.hasClass("e-page")) {
                if (context.find(".e-customitem").length == 0)
                    context.css("visibility", "hidden");
                else
                    context.find(".e-page").css("display", "none");
            }            
            else if (this.model.pageSettings.currentPage == 1) {
                sorting.find(".previous").parent().css("display", "none");
                sorting.find(".first").parent().css("display", "none");
            }
            else if (this.model.pageSettings.currentPage == this.model.pageSettings.totalPages) {
                sorting.find(".last").parent().css("display", "none");
                sorting.find(".nextpage").parent().css("display", "none");
            }
            if (this.model.groupSettings.groupedColumns.indexOf(value) != -1)
                a.find(".group").parent().css("display", "none");
            else if (this.model.groupSettings.groupedColumns.indexOf(value) == -1)
                a.find(".ungroup").parent().css("display", "none");
			if (this.model.contextOpen)
                this._trigger("contextOpen", sender);
        },

        _items: function (item, type) {
            if (item == "")
                return false;
            if (type == "contextMenuItem") {
                if (item.indexOf("Record") != -1) {
                    var li = ej.buildTag('li', "", {}, { "class": "e-content" });
                    li.css("display", "none");
                }
                else if (item.indexOf("Page") != -1) {
                    var li = ej.buildTag('li', "", {}, { "class": "e-page" });
                    if (item.indexOf("Next") != -1)
                        var div = ej.buildTag('div', "", {}, { "class": "nextpage" });
                    else if (item.indexOf("Previous") != -1)
                        var div = ej.buildTag('div', "", {}, { "class": "previous" });
                    else if (item.indexOf("Last") != -1)
                        var div = ej.buildTag('div', "", {}, { "class": "last" });
                    else if (item.indexOf("First") != -1)
                        var div = ej.buildTag('div', "", {}, { "class": "first" });
                    li.css("display", "none");
                }
                else if (item == "Save" || item == "Cancel") {
                    var li = ej.buildTag('li', "", {}, { "class": "e-savcan" });
                    li.css("display", "none");
                }
                else if (item.indexOf("Order") != -1 || item == "Grouping" || item == "Ungrouping") {
                    var li = ej.buildTag('li', "", {}, { "class": "e-head" });
                    if (item.indexOf("Ascending") != -1)
                        var div = ej.buildTag('div', "", {}, { "class": "ascending" });
                    else if (item.indexOf("Descending") != -1)
                        var div = ej.buildTag('div', "", {}, { "class": "descending" });
                    else if (item == "Grouping")
                        var div = ej.buildTag('div', "", {}, { "class": "group" });
                    else if (item == "Ungrouping")
                        var div = ej.buildTag('div', "", {}, { "class": "ungroup" });
                    li.css("display", "none");
                }
            }
            if (ej.isNullOrUndefined(li)) {
                var li = ej.buildTag('li', "", {}, { "class": "e-customitem" });
                li.css("display", "block");
            }
            li.append(div);
            var a = document.createElement("a"), classElement = "";
            if (typeof item == "string") {
                if (item.indexOf("Ascending") != -1)
                    classElement = "ascending";
                else if (item.indexOf("Descending") != -1)
                    classElement = "descending";
                else
                    classElement = item.split(" ")[0].toLowerCase();
                a.innerHTML = !ej.isNullOrUndefined(this.localizedLabels[item.replace(/\s+/g, '')]) ? this.localizedLabels[item.replace(/\s+/g, '')] : item;
            }
            if (typeof item == "object") {
                if (item.id == "Ascending")
                    classElement = "ascending";
                else if (item.id == "Descending")
                    classElement = "descending";
                else
                    classElement = item.id.split(" ")[0].toLowerCase();
                a.innerHTML = !ej.isNullOrUndefined(this.localizedLabels[item.text.replace(/\s+/g, '')]) ? this.localizedLabels[item.text.replace(/\s+/g, '')] : item.text;
                li.attr('id', item.id);
            }
            if (type == "contextMenuItem")
                $(a).append(ej.buildTag('span', "", {}, { "class": "e-gridcontext e-icon e-context" + classElement }));
            else
                $(a).append(ej.buildTag('span', "", {}, { "class": "e-gridcontext e-icon e-custommenu" + classElement }));
            li.append(a);
            return li;
        },

        _page: function (send) {
            if (send.events.text == this.localizedLabels.NextPage) {
                var b = this.model.pageSettings.currentPage;
                ++b;
                this.gotoPage(b);
            }
            else if (send.events.text == this.localizedLabels.PreviousPage) {
                var b = this.model.pageSettings.currentPage;
                if (b > 1) {
                    --b;
                    this.gotoPage(b);
                }
                else
                    this.gotoPage(b);
            }
            else if (send.events.text == this.localizedLabels.LastPage) {
                var b = this.model.pageSettings.totalPages
                this.gotoPage(b);
            }
            else
                this.gotoPage(1);


        },
        changePageSize: function (pageSize) {
            var args = {}, returnValue;
            var pageModel = this.getPager().ejPager("instance");
            this.model.pageSettings.pageSize = pageSize;
            this.model.pageSettings.currentPage = pageModel.model.currentPage;
            this.getPager().ejPager({pageSize: pageSize});
            args.requestType = ej.Grid.Actions.Refresh;
            returnValue = this._processBindings(args);
        },
        gotoPage: function (pageIndex) {
            if (!pageIndex || (pageIndex == this._currentPage() && !this.model.scrollSettings.allowVirtualScrolling) || (!this.model.allowPaging && (!this.model.allowScrolling && !this.model.scrollSettings.allowVirtualScrolling)))
                return;
            var args = {}, returnValue;
            args.previousPage = this._currentPage();
            this._currentPage(pageIndex);
            args.endIndex = ((this._currentPage() * this.model.pageSettings.pageSize) > this._gridRecordsCount) ? (this._gridRecordsCount) : (this._currentPage() * this.model.pageSettings.pageSize);
            args.startIndex = (this._currentPage() * this.model.pageSettings.pageSize) - this.model.pageSettings.pageSize;
            args.currentPage = pageIndex;
            if (this.model.allowPaging) {
                //this.model.pageSettings.currentPage = pageIndex;
                //this. getPager().ejPager("refreshPager");
                args.requestType = ej.Grid.Actions.Paging;
            }
            if (this.model.scrollSettings.allowVirtualScrolling && this.model.allowScrolling) {
                this._isVirtualRecordsLoaded = false;
                var model = this._refreshVirtualPagerInfo();
                this._showPagerInformation(model);
                args.requestType = ej.Grid.Actions.VirtualScroll;
            }
            returnValue = this._processBindings(args);
            if (returnValue)
                this._currentPage(args.previousPage);
            this._primaryKeyValues = [];
        },
        _gPagerClickHandler: function (sender) {
            if (this._prevPageNo == sender.currentPage)
                return;
            this.model.masterObject.gotoPage(sender.currentPage);
            return false;
        },
        _gPageSize: function (sender) {
            this.model.masterObject.changePageSize(sender.pageSize);
        },
        _processData: function (e, args) {
            if (this.initialRender) {
                this._initDataProcessed = true;
                this._initDataProcess(e, args);
            }
            else {
                if (e.count == 0 && this.model.currentViewData.length)
                    this._gridRecordsCount = e.result.length;
                else
                    this._gridRecordsCount = e.count;
                if (this.getPager() != null)
                    this.model.pageSettings.totalRecordsCount = this._gridRecordsCount;
                if ((args.requestType == ej.Grid.Actions.Filtering || ej.Grid.Actions.Save || (this.model.filterSettings.filteredColumns.length > 0 && args.requestType == ej.Grid.Actions.Refresh)))
                    this._filteredRecordsCount = e.count;
                if (this.model.allowScrolling && this.model.scrollSettings.enableVirtualization) {
                    this.model.currentViewData = [];
                    for (var i = 0; i < this._currentLoadedIndexes.length; i++) {
                        var currentView = this._currentLoadedIndexes[i];
                        $.merge(this.model.currentViewData, this._virtualLoadedRecords[currentView] || []);
                    }
                }
                this._setForeignKeyData(args);
				this.model.groupSettings.groupedColumns.length && !this.initialRender && this._setAggregates();
                this._relationalColumns.length == 0 && this.sendDataRenderingRequest(args);
            }
        },

        _frozenCell: function (rowIndex, cellIndex) {
            var currentIndex = cellIndex, frozenDiv = 0, row = this.getRowByIndex(rowIndex), cell;
            if (cellIndex >= this.model.scrollSettings.frozenColumns) {
                frozenDiv = 1;
                currentIndex = currentIndex - this.model.scrollSettings.frozenColumns;
            }
            cell = $(row.eq(frozenDiv).find(".e-rowcell:eq(" + currentIndex + ")"));
            return cell;
        },
        _frozenColumnSelection: function (gridRows, columnIndex, endIndex) {
            var currentIndex = columnIndex, frozenDiv = 0;
            if (endIndex) {
                for (var i = columnIndex; i < endIndex; i++) {
                    currentIndex = i;
                    if (i >= this.model.scrollSettings.frozenColumns) {
                        frozenDiv = 1;
                        currentIndex = i - this.model.scrollSettings.frozenColumns;
                    }
                    for (var j = 0; j < gridRows[frozenDiv].length; j++) {
                        $(gridRows[frozenDiv][j].cells[currentIndex]).addClass("e-columnselection");
                    }
                    $(this.getHeaderTable().find("th.e-headercell")[i]).addClass("e-columnselection");
                    this.selectedColumnIndexes.push(i);
                }
            }
            else {
                if (columnIndex >= this.model.scrollSettings.frozenColumns) {
                    frozenDiv = 1;
                    currentIndex = columnIndex - this.model.scrollSettings.frozenColumns;
                }
                for (var i = 0; i < gridRows[frozenDiv].length; i++) {
                    $(gridRows[frozenDiv][i].cells[currentIndex]).addClass("e-columnselection");
                }
            }

        },
        _renderGridFooter: function () {
            if (this.model.summaryRows.length > 0) {
                var showTotalSummaryItems = ej.DataManager(this.model.summaryRows).executeLocal(ej.Query().where("showTotalSummary", ej.FilterOperators.equal, false));
                var _$gridFooter = ej.buildTag("div.e-gridfooter");
                var $innerDiv = ej.buildTag('div');
                if (this.model.allowScrolling)
                    $innerDiv.addClass("e-footercontent");
                var $table = ej.buildTag("table.e-gridsummary");
                this.setGridFooterContent(_$gridFooter);
                if (this.model.scrollSettings.frozenColumns > 0) {
                    var $frozenFooterDiv = ej.buildTag("div.e-frozenfooterdiv"), $movableFooter = ej.buildTag("div.e-movablefooter")
                        , $tableClone = $table.clone(), $movableFooterDiv = ej.buildTag("div.e-movablefooterdiv");
                    $movableFooter.append($movableFooterDiv);
                    $table.append(this.getHeaderTable().first().find('colgroup').clone());
                    $tableClone.append(this.getHeaderTable().last().find('colgroup').clone());
                    $frozenFooterDiv.append($table);
                    $movableFooterDiv.append($tableClone);
                    this.setGridFooterTable($table.add($tableClone));
                    this._createSummaryRows(this.getFooterTable());
                    _$gridFooter.append($frozenFooterDiv.add($movableFooter));
                    _$gridFooter.find(".e-frozenfooterdiv").outerWidth(this.getHeaderContent().find(".e-frozenheaderdiv").width())
                          .end().find(".e-movablefooterdiv").outerWidth(this.getContent().find(".e-movablecontentdiv").width());
                }
                else {
                    $table.append(this.getHeaderTable().find('colgroup').clone());
                    this.setGridFooterTable($table);
                    this._createSummaryRows(this.getFooterTable());
                    $innerDiv.append($table);
                    _$gridFooter.html($innerDiv);
                }
                if (this.model.summaryRows.length == showTotalSummaryItems.length)
                    return;
                return _$gridFooter;
            } else
                throw "summary row collection is missing";
        },
        _setSummaryAggregate: function (queryManager) {
            var rows = this.model.summaryRows, scolumns, sCol = [];
            for (var row = 0, rlen = rows.length; row < rlen; row++) {
                scolumns = rows[row].summaryColumns;
                for (var col = 0, clen = scolumns.length; col < clen; col++) {
                    queryManager.aggregate(scolumns[col].summaryType, scolumns[col].dataMember);
                }
            }
        },
        _createSummaryRows: function (table, summaryData, aggregates, item, showGroup) {
            var col = table.find("col");
            if (table.find("tbody").length > 0)
                table.find("tbody").remove();
            var $tBody = ej.buildTag('tbody'), proxy = this, $tBodyClone = $tBody.clone();
            var summaryCol = this.model.summaryRows;
            if (!ej.isNullOrUndefined(summaryData) && this._isCaptionSummary)
                summaryCol = this._captionSummary(showGroup);
            $.each(summaryCol, function (indx, row) {
                if (row.showTotalSummary === false && ej.isNullOrUndefined(summaryData)) return true;
                if (row.showGroupSummary === false && showGroup && !ej.isNullOrUndefined(summaryData)) return true;
                var $tr = ej.buildTag('tr.e-gridSummaryRows');
                if (ej.isNullOrUndefined(item && item.level)) {
                    for (var i = 0; i < proxy.model.groupSettings.groupedColumns.length; i++) {
                        $tr.prepend(ej.buildTag('td').addClass("e-indentcell"));
                    }
                }
                var gc = showGroup ? " e-gcsummary" : "";
                if (proxy.model.detailsTemplate != null || proxy.model.childGrid != null) {
                    if (proxy.model.groupSettings.groupedColumns.length != 0)
                        $tr.children("td.e-indentcell").last().after("<td class='e-summaryrow" + gc + "'></td>");
                    else
                        $tr.prepend("<td class='e-summaryrow'></td>");
                }
                var $cells = proxy.getHeaderTable().find('td').slice(0, proxy.model.columns.length ).clone().addClass("e-summaryrow" + gc + ""), count = 0;
                var index = 0;
                if (!ej.isNullOrUndefined(row.titleColumn)) {
                    var index = proxy.getColumnIndexByField(row.titleColumn);
                    if (index == -1)
                        index = proxy.getColumnIndexByHeaderText(row.titleColumn);
                }
				if(index != -1)
					$cells = proxy._assignTitleColumn(index, row.title, $cells, count);
                proxy._hideSummaryColumn($cells, col);
                if (proxy.model.scrollSettings.frozenColumns > 0) {
                    var $trClone = $tr.clone();
                    $tBody.append($tr.append($cells.slice(0, proxy.model.scrollSettings.frozenColumns)));
                    $tBodyClone.append($trClone.append($cells.slice(proxy.model.scrollSettings.frozenColumns)));
                }
                else {
                    if ((!proxy._isCaptionSummary || showGroup) && !ej.isNullOrUndefined(item && item.level)) {
                        var level = proxy.model.groupSettings.groupedColumns.length - item.level + 1, tableClone = table.clone().addClass("e-groupsummary"), captionData = {};
                        captionData["data"] = { items: item };
                        $tr.prepend("<td class='e-summaryrow" + gc + "' colspan=" + proxy._colSpanAdjust(null, null, captionData) + " style = 'padding:0;' ></td>");
                        $($tr[0].cells).filter(".e-summaryrow").html(tableClone.append(ej.buildTag("tr", $cells)));
                        var len = tableClone.find("col").length - (proxy.model.columns.length + level);
                        if (proxy.model.detailsTemplate != null || proxy.model.childGrid != null)
                            $tr.find("tr").prepend("<td class='e-summaryrow'></td>");
                        for (var i = 0; i < len; i++) {
                            tableClone.find("col").first().remove();
                        }
                        for (var i = 0; i < level; i++) {
                            $(tableClone[0].rows).prepend("<td class='e-indentcell'></td>");
                            $(tableClone.find("col")[i]).addClass("e-summary");
                        }
                        $tBody.append($tr);
                    }
                    else
                        $tBody.append($tr.append($cells));
                }
                $.each(row.summaryColumns, function (cindx, col) {
                    var value;
                    if (col.summaryType != "custom")
                        value = aggregates ? aggregates[col.dataMember + " - " + col.summaryType] : proxy._remoteSummaryData[col.dataMember + " - " + col.summaryType];
                    else
                        value = proxy.getSummaryValues(col, summaryData);
                    var prefix = col.prefix ? col.prefix : "",
                    index = proxy.getColumnIndexByField(col.displayColumn), suffix = col.suffix ? col.suffix : "";
                    if (proxy.model.allowScrolling)
                        $($cells[index]).addClass("e-scroller");
                    if ($($cells[index]).html() != "" && prefix == "")
                        prefix = $($cells[index]).html();
                    if (!ej.isNullOrUndefined(col.template)) {
                        var obj = {
                            summaryValue: col.format ? proxy.formatting(col.format, value, proxy.model.locale) : value,
							summaryColumn: col
                        },
                        sTemplate = obj.summaryColumn.template,
                        ngType = !ej.isNullOrUndefined(proxy.model.ngTemplateId) && (sTemplate.startsWith("#") || sTemplate.startsWith(".") || typeof sTemplate === "object") ? proxy.model.ngTemplateId + "gridsummarytemplate" : null;
                        proxy._summaryContextIndex = proxy._summaryContextIndex + 1;
                        $($cells[index]).html(proxy._renderEjTemplate(obj.summaryColumn.template, obj, proxy._summaryContextIndex, null, ngType)).css("text-align", proxy.model.columns[index].textAlign)
                        $($cells[index]).addClass("e-summarytemplate")
                    }
                    else if (index != -1)
                        $($cells[index]).html(prefix + (col.format ? proxy.formatting(col.format, value, proxy.model.locale) : value) + suffix).css("text-align", proxy.model.columns[index].textAlign);
                });
            });
            if (this.model.scrollSettings.frozenColumns > 0) {
                table.first().append($tBody);
                table.last().append($tBodyClone);
            }
            else
                table.append($tBody);
        },
        _assignTitleColumn: function (index, title, $cells, count) {
            for (var i = index; i < this.model.columns.length; i++) {
                var colindex = this.model.columns[i];
                if (count == 0 && colindex.visible != false) {
                    $cells.eq(i).html(title);
                    break;
                }
            }
            return $cells;
        },
        getSummaryValues: function (summaryCol, summaryData) {
            var $value, jsonData;
            if (!ej.isNullOrUndefined(summaryData))
                jsonData = summaryData;
            else if (this.model.filterSettings.filteredColumns.length > 0)
                jsonData = this._filteredRecords;
            else
                jsonData = this._dataSource();

            var dbMgr;
            if (jsonData instanceof ej.DataManager) {
                dbMgr = jsonData;
                jsonData = jsonData.dataSource.json;
            } else
                dbMgr = ej.DataManager(jsonData);

            switch (summaryCol.summaryType) {
                case ej.Grid.SummaryType.Maximum:
                    var obj = ej.max(jsonData, summaryCol.dataMember);
                    $value = ej.getObject(summaryCol.dataMember, obj);
                    break;
                case ej.Grid.SummaryType.Minimum:
                    var obj = ej.min(jsonData, summaryCol.dataMember);
                    $value = ej.getObject(summaryCol.dataMember, obj);
                    break;
                case ej.Grid.SummaryType.Average:
                    $value = ej.avg(jsonData, summaryCol.dataMember);
                    break;
                case ej.Grid.SummaryType.Sum:
                    $value = ej.sum(jsonData, summaryCol.dataMember);
                    break;
                case ej.Grid.SummaryType.Count:
                    $value = jsonData.length;
                    break;
                case ej.Grid.SummaryType.TrueCount:
                    var predicate = ej.Predicate(summaryCol.dataMember, "equal", true);
                    $value = dbMgr.executeLocal(ej.Query().where(predicate)).length;
                    break;
                case ej.Grid.SummaryType.FalseCount:
                    var predicate = ej.Predicate(summaryCol.dataMember, "equal", false);
                    $value = dbMgr.executeLocal(ej.Query().where(predicate)).length;
                    break;
                case ej.Grid.SummaryType.Custom:
                    var fn = summaryCol.customSummaryValue;
                    if (fn) {
                        if (typeof fn === "string")
                            fn = ej.util.getObject(fn, window);
                        if ($.isFunction(fn))
                            $value = fn.call(this, summaryCol, jsonData);
                    }
                    break;
            }
            return $value;
        },
        _hideCaptionSummaryColumn: function () {
            var headerColumn = this.getHeaderTable().find('.e-headercelldiv[data-ej-mappingname]').first();
            var captionTd = this.getContentTable().find('.e-groupcaption').clone();
            var groupCaptionParent = this.getContentTable().find('.e-groupcaption').parent();
            var colLength = this.model.columns.length - 1;
            if (this._isCaptionSummary) {
                this.getContentTable().find('.e-summaryrow:not(.e-gcsummary)').remove();
                this.getFooterTable().find("tbody td").slice(-colLength).removeClass("e-groupcaptionsummary").addClass("e-summaryrow");
                if (this.getFooterTable() != null) {
                    this.getContentTable().find('.e-recordplusexpand').parent().children('.e-indentcell').remove();
                }
                if (!this.model.groupSettings.showGroupedColumn && this.getContentTable().find(".e-groupcaptionsummary").not(".e-hide").length) {
                    var sumColumn = +this.getContentTable().find(".e-recordtable:first").parents("tbody:first").find(".e-groupcaption").attr("colspan");
                    if (this._hiddenColumnsField.length == this.model.columns.length - 1 && headerColumn.parent().hasClass("e-hide") || !sumColumn) {
                        for (var i = 0; i < captionTd.length; i++) {
                            groupCaptionParent.eq(i).children().not('.e-hide,.e-recordplusexpand').filter('td.e-groupcaptionsummary:first').addClass("e-hide");
                            var caption = groupCaptionParent.eq(i).find(".e-groupcaption");
                            var colspan = parseInt(caption.attr("colspan"));
                            caption.attr("colspan", ++colspan)
                        }
                    }
                }
            }
            this.getContentTable().find('.e-recordtable').find('.e-indentcell').remove();
        },
        _hideSummaryColumn: function (td, col) {
            var i,j;
            if (col.length > this.model.columns.length)
                col = col.slice(col.length - this.model.columns.length);
            if (!this.model.groupSettings.showGroupedColumn && this.model.showSummary) {
                for (i = 0; i < this.model.columns.length; i++) {
                    for (j = 0; j < this.model.groupSettings.groupedColumns.length || j < this._hiddenColumnsField.length; j++) {
                        var headerColumn = this.getHeaderTable().find('.e-headercelldiv:not(.e-emptyCell)');
                        if (headerColumn.eq(i).parent().hasClass('e-hide')) {
                            col.eq(i).css("display", "none");
                            $(td[i]).addClass("e-hide");
                            break;
                        }
                        else {
                            if (col.eq(i).css("display") == "none")
                                col.eq(i).css("display", "");
                        }
                    }
                }
            }
            else {
                for (i = 0; i < this.model.columns.length; i++) {
                    if (!this.model.columns[i]["visible"]) {
                        col.eq(i).css("display", "none");
                        $(td[i]).addClass("e-hide");
                    }
                    else {
                        if (col.eq(i).css("display") == "none")
                            col.eq(i).css("display", "");
                    }
                }
            }
        },

        _initScrolling: function () {
            var frozen = [], unfrozen = [], hideColumns = 0;
            if (this.model.scrollSettings.enableVirtualization)
                this.model.scrollSettings.allowVirtualScrolling = true;
            for (var columnCount = 0; columnCount < this.model.columns.length; columnCount++) {
                if (this.model.columns[columnCount].visible === false && columnCount < this.model.scrollSettings.frozenColumns)
                    hideColumns++;
                if (this.model.columns[columnCount]["isFrozen"] === true)
                    frozen.push(this.model.columns[columnCount]);
                else
                    unfrozen.push(this.model.columns[columnCount]);
            }            
            if (frozen.length > 0) {
                var freeze = this.model.scrollSettings.frozenColumns;
                this.model.columns = $.merge($.merge([], frozen), unfrozen);
                this.model.scrollSettings.frozenColumns = frozen.length;
                if (frozen.length != freeze && freeze != 0)
                    this.model.scrollSettings.frozenColumns = freeze;
            }
            if ((this.model.scrollSettings.frozenColumns > 0 || this.model.scrollSettings.frozenRows > 0) && (this.model.allowGrouping || this.model.rowTemplate != null || this.model.detailsTemplate != null || this.model.childGrid != null || this.model.scrollSettings.allowVirtualScrolling || this.model.editSettings.editMode == "batch")) {
                this._renderAlertDialog();
                this._alertDialog.find(".e-content").text(this._getLocalizedLabels()["FrozenNotSupportedException"]);
                this._alertDialog.ejDialog("open");
                return;
            }
            if (this.model.scrollSettings.allowVirtualScrolling && this.model.allowScrolling) {
				if(!this.model.scrollSettings.enableVirtualization){
					this.model.pageSettings.pageSize = this.model.pageSettings.pageSize == 12 ? Math.round(this.model.scrollSettings.height / 32) + 1 : this.model.pageSettings.pageSize;
					this.model.pageSettings.totalPages = Math.ceil(this._gridRecordsCount / this.model.pageSettings.pageSize);
				}
				else{					
					this._vRowHeight = Math.floor(this.getRowHeight() + 1);
					this._virtualRowCount = Math.round(this.model.scrollSettings.height / this._vRowHeight) + 1; 					
					this.model.pageSettings.pageSize = this.model.pageSettings.pageSize <= this._virtualRowCount * 5 ? this._virtualRowCount * 5 : this.model.pageSettings.pageSize;
                }
            }
            if (this.model.width || this.model.height) {
                this.model.allowScrolling = true;
                if (this.model.width) this.model.scrollSettings.width = this.model.width;
                if (this.model.height) this.model.scrollSettings.height = this.model.height;
            }
            this._originalScrollWidth = ej.isNullOrUndefined(this.model.scrollSettings.previousStateWidth) ? this.model.scrollSettings.width : this.model.scrollSettings.previousStateWidth;
        },
        _checkScrollActions: function (requestType) {
            if ((!this.model.scrollSettings.allowVirtualScrolling && (requestType == ej.Grid.Actions.Sorting || requestType == ej.Grid.Actions.Reorder)) || requestType == ej.Grid.Actions.Grouping || requestType == ej.Grid.Actions.Ungrouping || requestType == ej.Grid.Actions.Add || requestType == ej.Grid.Actions.Cancel
                || requestType == ej.Grid.Actions.Save || requestType == ej.Grid.Actions.BatchSave || requestType == ej.Grid.Actions.Delete || requestType == ej.Grid.Actions.Filtering || requestType == ej.Grid.Actions.Paging || requestType == ej.Grid.Actions.Refresh || requestType == ej.Grid.Actions.Search)
                return true;
            else if(this.model.scrollSettings.allowVirtualScrolling && requestType == ej.Grid.Actions.Sorting)
                return true;
            return false;
        },
        _frozenAlign: function () {
             var gridContent = this.getContent().first(), browserDetails = !ej.isIOSWebView() && this.getBrowserDetails(), direction;
             direction = this.model.enableRTL ? "margin-right" : "margin-left";
             gridContent.find(".e-movablecontent").css(direction, browserDetails && browserDetails.browser === "safari" ? "auto" : gridContent.find(".e-frozencontentdiv").width() + "px");
             this.getHeaderContent().find(".e-movableheader").removeAttr("style").css(direction,browserDetails && browserDetails.browser === "safari" ? "auto" : this.getHeaderContent().find(".e-frozenheaderdiv").width() + "px");
			 if(this.getFooterContent())
				 this.getFooterContent().find(".e-movablefooter").removeAttr("style").css(direction,browserDetails && browserDetails.browser === "safari" ? "auto" : this.getFooterContent().find(".e-frozenfooterdiv").width() + "px")
			         
		 },
        _refreshScroller: function (args) {
            var gridContent = this.getContent().first(), temp;
            if (ej.isNullOrUndefined(gridContent.data("ejScroller")))
                return;
            if (this.model.scrollSettings.frozenColumns > 0) {
                if (this._gridRecordsCount || this._isAddNew)
                    this.model.scrollSettings["targetPane"] = ".e-movablecontent";
                else
                    this.model.scrollSettings["targetPane"] = null;
                this.getScrollObject().option({ targetPane: this.model.scrollSettings["targetPane"] });
                if (!this._isFrozenColumnVisible()) {
                    gridContent.find(".e-movablecontentdiv").removeAttr("style");
                    this.getHeaderContent().find(".e-movableheaderdiv").removeAttr("style");
					if(this.getFooterContent())
						this.getFooterContent().find(".e-movablefooter").removeAttr("style");                 
                    gridContent.find(".e-frozencontent").width(0);
                    gridContent.find(".e-frozencontentdiv").width(0);
                    gridContent.find(".e-frozencontent").height(0);
                    gridContent.find("e-frozencontentdiv").height(0);
                }
                else if (this._visibleColumns.length <= this.model.scrollSettings.frozenColumns) {
                    var isMovableCol = false;
                    for (var i = this.model.scrollSettings.frozenColumns; i < this.model.columns.length; i++) {
                        if (this._visibleColumns.indexOf(this.model.columns[i].headerText) != -1) {
                            isMovableCol = true;
                            break;
                        }
                    }
                    if (!isMovableCol) {
                        gridContent.find(".e-frozencontentdiv").removeAttr("style");
                        this.getHeaderContent().find(".e-frozenheaderdiv").removeAttr("style");
                        gridContent.find(".e-movablecontent").width(0);
                        gridContent.find(".e-movablecontentdiv").width(0);
                        gridContent.find(".e-movablecontent").height(0);
                        gridContent.find(".e-movablecontentdiv").height(0);
                    }
                }
                else {
                    this._frozenAlign();
                    gridContent.find(".e-movablecontent").scrollLeft(this.getHeaderContent().find(".e-movableheader").scrollLeft());
                    if (!ej.isNullOrUndefined(this.getScrollObject()._vScrollbar) && this.getScrollObject()._vScrollbar.value() > this.getScrollObject()._vScrollbar.model.maximum)
                        temp = this.getScrollObject()._vScrollbar.model.maximum;
                }
                this.refreshScrollerEvent();
            }
            if (this.model.scrollSettings.frozenRows > 0) {
                this._initFrozenRows();
                for (var i = 0 ; i < this.getRows().length ; i++) {
                                       $(this.getRows()[i]).filter(":hidden").css("display", "table-row");
                                    }
                if (!this.initialRender && ej.isNullOrUndefined(this.getScrollObject()._vScrollbar) && (this.element.height() > this.model.scrollSettings.height))
                    this.getContent().attr("tabindex", "0").ejScroller(this.model.scrollSettings);
                var temp = this.getScrollObject().model.scrollTop;
                var tempLeft = this.getScrollObject().model.scrollLeft;
                if (!ej.isNullOrUndefined(this.getScrollObject()._vScrollbar) && temp > this.getScrollObject()._vScrollbar.model.maximum)
                    temp = this.getScrollObject()._vScrollbar.model.maximum;
                if ((args.requestType == "cancel" || args.requestType == "save") && temp > this._editFormHeight && this.model.editSettings.editMode.indexOf("inlineform") != -1)
                    temp = temp - this._editFormHeight;
                if (args.requestType == ej.Grid.Actions.Add)
                    this.getScrollObject().scrollY(0, true);
                if (!ej.isNullOrUndefined(this.getScrollObject()._vScrollbar) && !ej.isNullOrUndefined(this.getScrollObject()._vScrollbar._scrollData))
                    this.getScrollObject()._vScrollbar._scrollData.skipChange = true;
            }
            if ((args.requestType == "beginedit" || args.requestType == "save") && !this.model.editSettings.editMode == "inlineformtemplate" && !this.model.editSettings.editMode == "inlineform") {
                var temp = this.getScrollObject().model.scrollTop;
                this.getScrollObject().scrollY(0, true);
            }
            if (!ej.isNullOrUndefined(this.model.dataSource) && (args.requestType == "refresh" || args.requestType=="searching") && this.model.scrollSettings.allowVirtualScrolling) {
                if (this.model.scrollSettings.enableVirtualization && (this._isLocalData || this._virtualDataRefresh) && this._gridRecordsCount > 0)
					this._refreshVirtualView(this._currentVirtualIndex);
				else
					this._refreshVirtualContent(1);
				if(this._currentVirtualIndex == 1)
					this.getScrollObject().scrollY(0);
            }            
            if (this.model.scrollSettings.frozenColumns > 0)
				this.rowHeightRefresh();
			this.getScrollObject().refresh();
            gridContent.ejScroller("model.enableRTL", this.model.enableRTL);
            if (this.model.isResponsive && (args.requestType == 'searching' || args.requestType == "filtering")) {
                var scrollObj = this.getScrollObject();
                var height = scrollObj.isHScroll() ? this.getContentTable().height() + scrollObj.model.buttonSize : this.getContentTable().height();
                height = typeof (this.model.scrollSettings.height) == "string" || height > this.model.scrollSettings.height ? this.model.scrollSettings.height : height
                var scrollWidth= typeof (this.model.scrollSettings.width) == "string" ? this.element.width():this.model.scrollSettings.width;
                var width = scrollWidth;
                this.getContent().ejScroller({ height: height, width: width });
            }
            if (this.getScrollObject().isVScroll() && !this.getScrollObject().model.autoHide) {
                this.getHeaderContent().addClass("e-scrollcss");                
                !this.getHeaderContent().find(".e-headercontent").hasClass("e-hscrollcss") && this.getHeaderContent().find(".e-headercontent").addClass("e-hscrollcss");
                if (this.model.showSummary && this.getScrollObject().isHScroll() && !ej.isNullOrUndefined(this.getFooterContent()))
                    this.getFooterContent().find("div table").first().width(this.getContentTable().width() + this.model.scrollSettings.scrollerSize);
                else if(!this.getScrollObject().isHScroll() && !ej.isNullOrUndefined(this.getFooterContent()))
                    this.getFooterContent().find("div table").first().width(this.getFooterContent().find("div").width());
            }
            else
                this._showHideScroller();
            if (!this.model.scrollSettings.frozenColumns && this.model.allowPaging && !this.getScrollObject().isVScroll() && !this.getScrollObject().isHScroll() && this.getContentTable().width() != this.getContent().width()) {
                if (!ej.isNullOrUndefined(this.getFooterTable()))
                    this.getFooterTable().width(this.getContentTable().width());
			}
            this._getRowHeights();
            if (temp && !ej.isNullOrUndefined(this.getScrollObject()._vScrollbar) && args.requestType != ej.Grid.Actions.Add && this.model.editSettings.editMode != "inlineformtemplate" && this.model.editSettings.editMode != "inlineform") {
                this._currentTopFrozenRow = 0;
                if (temp > this.getScrollObject()._vScrollbar.model.maximum)
                    temp = this.getScrollObject()._vScrollbar.model.maximum;
                this.getScrollObject()._vScrollbar.scroll(temp);
            }
            if (args.requestType == "beginedit" && !ej.isNullOrUndefined(this.getScrollObject()._vScrollbar) && (this.model.editSettings.editMode == "inlineformtemplate" || this.model.editSettings.editMode == "inlineform")) {
                var editedFormHeight = $("#" + this._id + "EditForm").parents('tr.e-editedrow')[0].offsetTop + $("#" + this._id + "EditForm").parents('tr.e-editedrow')[0].offsetHeight;
                var content = this.getContent().find(".e-content"), cntHeight = content.height(), scrollerTop = this.getScrollObject().scrollTop(), contentHeight = scrollerTop + cntHeight;
                if (Math.round(editedFormHeight) > Math.round(contentHeight)) {
                    var value = this.getScrollObject()._vScrollbar.model.value + (editedFormHeight - contentHeight);
                    this.getScrollObject()._vScrollbar.scroll(value);
                    this.model.scrollSettings.scrollTop = value;
                }
                else {
                    this.getScrollObject()._vScrollbar.scroll(scrollerTop);
                    this.model.scrollSettings.scrollTop = scrollerTop;
                }
            }
            if(tempLeft && this.model.scrollSettings.frozenColumns > 0 && args.requestType == ej.Grid.Actions.BeginEdit)
            {
                this.getScrollObject()._hScrollbar.scroll(tempLeft);
            }
            if (args.requestType == "virtualscroll") {
                var top = this.getScrollObject().model.scrollTop + this.getScrollObject().model.height - (this.getScrollObject().model.height * .3);
                this.getScrollObject().scrollY(top, true);
            }
            if (args.requestType == "sorting" && this.model.scrollSettings.virtualScrollMode == "continuous") {
                this.getScrollObject().scrollY(0, true);
            }
        },
        _isFrozenColumnVisible: function () {
            for (var i = 0; i < this.model.scrollSettings.frozenColumns; i++) {
                if (this.model.columns[i].visible)
                    return true;
            }
            return false;
        },
        _frozenPaneRefresh: function () {
            this.getContent().find(".e-frozencontentdiv").css("display", "none");
            this.getHeaderContent().find(".e-frozenheaderdiv").css("display", "none");
            this.getHeaderContent().find(".e-movableheader")[0].style["margin-left"] = "";
            this.getContent().find(".e-movablecontent")[0].style["margin-left"] = "";
            var scrollWidth = ej.isNullOrUndefined(this._scrollObject._vScrollbar) ? 0 : this._scrollObject._vScrollbar["e-vscroll"].width();
            var movableWidth = this.model.scrollSettings.width - scrollWidth - 1;
            if (this.model.scrollSettings.width > this.getContent().find(".e-movablecontentdiv").width()) {
                this.getContent().find(".e-movablecontentdiv").width(movableWidth);
                this.getHeaderContent().find(".e-movableheaderdiv").width(movableWidth);
                if(!ej.isNullOrUndefined(this.getFooterContent()))
                    this.getFooterContent().find(".e-movablefooterdiv").width(movableWidth);
            }
            this._scrollObject.option("scrollLeft", 0);
        },
        _renderScroller: function () {
            if (!this.model.scrollSettings)
                this.model.scrollSettings = {};
            if (this.model.enablePersistence && (ej.isNullOrUndefined(this.model.scrollSettings.previousStateWidth) || !this.model.scrollSettings.previousStateWidth) && this.model.isResponsive)
                this.model.scrollSettings.previousStateWidth = this.model.scrollSettings.width;
            if (typeof (this._originalScrollWidth) == "string" && !this.model.isResponsive) {
                this.element.css("width", "auto");
                var width = this.element.width();
                if (this.model.scrollSettings.width == "auto" || this._originalScrollWidth == "auto")
                    this._originalScrollWidth = "100%";
                this.model.scrollSettings.width = width * (parseFloat(this._originalScrollWidth) / 100)
            }

            if (typeof (this.model.scrollSettings.height) == "string" && !this.model.isResponsive) {
                var height = this.element.height();
                if (this.model.scrollSettings.height == "auto")
                    this.model.scrollSettings.height = "100%";
                this.model.scrollSettings.height = height * (parseFloat(this.model.scrollSettings.height) / 100)
            }

            if ((this.model.scrollSettings.width || this.model.width) && !this._mediaQuery) {
                var width = this.model.scrollSettings.width || this.model.width;
                if (typeof width == "string")
                    this.element.css("width", this.model.scrollSettings.width || this.model.width);
                else
                    this.element.width(this.model.scrollSettings.width || this.model.width);
            }

            var $content = this.getContent().attr("tabindex", "0"), staticWidth, direction, gridRows = this.getRows();

            if (this.model.scrollSettings.frozenColumns > 0) {
                for (var i = 0 ; i < this.getRows().length ; i++) {
                                       $(this.getRows()[i]).filter(":hidden").css("display", "table-row");
                                   }
                var scrollWidth = this.getContent().find(".e-frozencontentdiv").width() + 20;
                if (scrollWidth > this.model.scrollSettings.width) {
                    this.getContent().remove();
                    this.getHeaderTable().eq(1).remove();
                    this._alertDialog.find(".e-content").text(this.localizedLabels.FrozenColumnsViewAlert);
                    this._alertDialog.ejDialog("open");
                    return;
                }
                staticWidth = this.getContent().find(".e-frozencontentdiv").width();
                direction = this.model.enableRTL ? "margin-right" : "margin-left";
                this.getContent().find(".e-movablecontent").css(direction, staticWidth + "px");
                this.getHeaderContent().find(".e-movableheader").css(direction, staticWidth + "px");
                if(!ej.isNullOrUndefined(this.getFooterContent()))
                    this.getFooterContent().find(".e-movablefooter").css(direction, staticWidth + "px");
                this.model.scrollSettings["targetPane"] = ".e-movablecontent";
            }
			else
				this.model.scrollSettings["targetPane"] = null;
            this._initFrozenRows();
            if (this.model.scrollSettings.autoHide)
                this.model.scrollSettings["show"] = $.proxy(this._showHideScroller, this);
			if(!this.model.scrollSettings.allowVirtualScrolling && this.model.currentIndex > 0 && !this.model.scrollSettings.scrollTop && ej.isNullOrUndefined(this.getContent().data("ejScroller"))){
				var sTop = this.model.currentIndex * this.getRowHeight();
				this.model.scrollSettings["scrollTop"] = sTop;
			}
			$content.ejScroller(this.model.scrollSettings);
			if (this.model.allowRowDragAndDrop && this.model.allowScrolling && ej.gridFeatures.dragAndDrop)
			    $content.ejScroller({ thumbStart: function () { return false } });
            if (this.model.rowTemplate != null && ((!ej.isIOSWebView()) && (this.getBrowserDetails().browser == "msie" || this.getBrowserDetails().browser == "safari")))
                this.getScrollObject().refresh();            
            if (this.model.scrollSettings.frozenColumns > 0 && this.model.scrollSettings.frozenRows == 0 && this.getScrollObject()._vScrollbar && this.getScrollObject()._hScrollbar)
                this.getScrollObject()._vScrollbar._scrollData.skipChange = this.getScrollObject()._hScrollbar._scrollData.skipChange = true;
            if (!this.model.scrollSettings.autoHide)
                this._showHideScroller();
            if ((!ej.isIOSWebView() && this.getBrowserDetails().browser == "safari") && this.model.scrollSettings.frozenColumns > 0)
                this.getHeaderContent().find(".e-movableheader").add(this.getContent().find(".e-movablecontent")).css(direction, "auto");
            this.refreshScrollerEvent();
            if (this.model.scrollSettings.frozenColumns > 0 && !this._isFrozenColumnVisible())
                this._frozenPaneRefresh();
            if (this.model.scrollSettings.allowVirtualScrolling) {
                var model = this._refreshVirtualPagerInfo();
                this._showPagerInformation(model);
                this.refreshScrollerEvent();
            }
        },
		_checkScroller: function(e, scrollObj){
			var scrollLeft = e.scrollLeft > 0 ? e.scrollLeft : Math.abs(e.scrollLeft);
			if(e.source == "thumb" && (scrollObj.content()[0].scrollWidth - scrollLeft == scrollObj.content()[0].clientWidth || scrollLeft == 0)){
				if(this.model.enableRTL){
					var hLeft = scrollLeft == 0 ? e.scrollData.scrollable: 0;
					e.scrollData.sTop = e.model.scrollLeft = hLeft;
					scrollObj.content().scrollLeft(hLeft);	
				}
				scrollObj._hScrollbar.refresh();
			}
		},
        _showHideScroller: function () {
            if (this.getScrollObject().isVScroll()) {
                this.getHeaderContent().find("div").first().addClass("e-headercontent");
                if (this.model.showSummary && !ej.isNullOrUndefined(this.getFooterContent()))
                    this.getFooterContent().find("div").first().addClass("e-footercontent");
                !this.model.scrollSettings.autoHide && this.getHeaderContent().addClass("e-scrollcss")
            } else
                this.element.find(".e-gridheader").removeClass("e-scrollcss");
             if (this.model.scrollSettings.frozenColumns == 0 && !this._mediaQuery) {
                if (!this.element.find(".e-gridheader").hasClass("e-scrollcss") && (this.model.filterSettings.filteredColumns.length || (this._hiddenColumns.length&&!this.model.minWidth))) {
                    this.getHeaderTable().removeAttr('style');
                    this.getContentTable().removeAttr('style');
                    if (this.model.showSummary && !ej.isNullOrUndefined(this.getFooterTable()))
                    this.getFooterTable().removeAttr('style');
                }
                else {
                        if (this.model.showSummary && !ej.isNullOrUndefined(this.getFooterContent())) {
                        if(this.getScrollObject().isVScroll() && this.getScrollObject().isHScroll()){
                            if(this.model.minWidth && this.model.isResponsive)
                                this.getFooterContent().find("div table").first().width(this.getContentTable().width() + this.model.scrollSettings.scrollerSize);
                            else
                                this.getFooterContent().find("div table").first().width(this.getContentTable().width());
                            this.getFooterContent().find("div").width(this.getHeaderContent().width() + this.model.scrollSettings.scrollerSize);
                        }
                    }
                }
            }
            this._isHscrollcss();
        },
        _isHscrollcss: function () {
            var scroller = this.getContent().data("ejScroller"), css = (scroller && scroller.isVScroll()) ? "addClass" : "removeClass";
            this.getHeaderContent().find(".e-headercontent")[css]("e-hscrollcss")
			this.getHeaderContent()[css]("e-scrollcss");
		},
        _initFrozenRows: function () {
            var gridRows = this.getRows();
            if (!this.model.currentViewData || this.model.currentViewData.length == 0)
                return;
            if (this.model.scrollSettings.frozenRows > 0 && gridRows != null) {
                this.getContent().find(".e-frozeny").removeClass("e-frozeny")
                    .end().find(".e-frozenrow").removeClass("e-frozenrow");
                if (!ej.isNullOrUndefined(gridRows[0][this.model.scrollSettings.frozenRows - 1]) && !ej.isNullOrUndefined(gridRows[1][this.model.scrollSettings.frozenRows - 1]) && this.model.scrollSettings.frozenColumns > 0)
                    $(gridRows[0][this.model.scrollSettings.frozenRows - 1].cells).add(gridRows[1][this.model.scrollSettings.frozenRows - 1].cells).addClass("e-frozeny").parent().addClass("e-frozenrow");
                else if (!ej.isNullOrUndefined(this.getRowByIndex(this.model.scrollSettings.frozenRows - 1)[0]))
                    $(gridRows[this.model.scrollSettings.frozenRows - 1].cells).addClass("e-frozeny").parent().addClass("e-frozenrow");
                if (this.getContent().height() > this.model.scrollSettings.height) {
					 var scrollObj = !ej.isNullOrUndefined(this.getContent().data("ejScroller")) ? this.getScrollObject() : null;
                    if (!this.initialRender && !ej.isNullOrUndefined(scrollObj) && ej.isNullOrUndefined(scrollObj._vScrollbar))
                        this._getRowHeights();
                    this.model.scrollSettings.height = this._rowHeightCollection[Math.floor(this.model.scrollSettings.height / this._rowHeightCollection[1])] + 18;
                }
            }           
        },
        refreshScrollerEvent: function () {
            var proxy = this;
            var $content = this.getContent().attr("tabindex", "0");
            var scroller = $content.data("ejScroller");
            if (!ej.isNullOrUndefined(scroller) && scroller.model.scroll == null) {
                $content.ejScroller({
                    scroll: function (e) {
                        if (!ej.isNullOrUndefined(e.scrollData) && e.scrollData.scrollVal == "scrollLeft") {
                            if (proxy.model.scrollSettings.targetPane || (!ej.isNullOrUndefined(proxy.getHeaderContent()) && proxy.getHeaderContent().find(".e-movableheader").length)) {
                                proxy.getHeaderContent().find(".e-movableheader").scrollLeft(e.scrollLeft);
                            }
                            else
                                proxy.getHeaderContent().find("div").first().scrollLeft(e.scrollLeft);
                            if (proxy.model.scrollSettings.frozenRows > 0 && proxy.model.editSettings.editMode.indexOf("inlineform") != -1 && proxy.model.isEdit) {
                                var scrollTop = e.scrollTop;
                                proxy.getContent().find(".e-content").scrollTop(0);
                                this.scrollY(this.model.scrollTop + scrollTop, true);
                            }
                        };
                        if (proxy.model.scrollSettings.frozenRows > 0 && proxy.getRows() != null) {
                            if (e.scrollData != null && e.scrollData.dimension != "width") {
                                e.cancel = true;
                                var rows = proxy.getRows(), indexes = proxy._getTopRow(e.scrollTop), currentTopRow = indexes.imaginaryIndex, frozenRows;
                                if (currentTopRow > proxy._currentTopFrozenRow)
                                    proxy._showHideRow(proxy.model.scrollSettings.frozenRows, currentTopRow, "hide", e.scrollTop);
                                else if (currentTopRow < proxy._currentTopFrozenRow)
                                    proxy._showHideRow(currentTopRow, proxy._currentTopFrozenRow + 1, "show", e.scrollTop);
                                var movableContent = proxy.getContentTable().last().find("tr");
                                var border = (parseInt(movableContent.last().find("td:first").css("border-top-width")) * 2) + 1;
                                if (e.scrollTop == this._vScrollbar.model.maximum && ((movableContent.last()[0].offsetTop + movableContent.last().height() - border) > proxy.element.find(".e-content").height())) {
                                    var totalHeight = movableContent.last().prev()[0].offsetTop + movableContent.last().prev().height();
                                    var count = 1;
                                    for (var i = (movableContent.length - 2) ; totalHeight - border > proxy.element.find(".e-content").height() ; i++) {
                                        totalHeight = movableContent[i].offsetTop + movableContent.eq(i).height();
                                        count++;
                                        break;
                                    }
                                    proxy._showHideRow(proxy.model.scrollSettings.frozenRows, currentTopRow + count, "hide", e.scrollTop);
                                }
                                e.model.scrollTop = e.scrollTop;
                            }
                            else {
                                if (!ej.isNullOrUndefined(this._vScrollbar) && !ej.isNullOrUndefined(this._vScrollbar._scrollData))
                                    this._vScrollbar._scrollData.skipChange = true;
                            }
                        }
                        if (proxy.model.scrollSettings.allowVirtualScrolling) {
                            if (proxy.model.scrollSettings.enableVirtualization && e.scrollData != null && e.scrollData.handler != "e-hhandle") {
                                e["reachedEnd"] = e.scrollData.scrollable - e.scrollTop == 0;
                                if (e.source == "thumb") {
                                    var keys = ej._getObjectKeys(proxy._virtualLoadedRows);
                                    var index = (proxy._currentVirtualIndex + 2).toString();
                                    if (proxy.model.scrollSettings.virtualScrollMode == "continuous" && $.inArray(index, keys) == -1 && index < proxy._totalVirtualViews)
                                        proxy._isContinuous = true;
                                    else {
                                        e.model.scrollTop = e.scrollTop;
                                        proxy._isContinuous = false;
                                        e.cancel = true;
                                    }
                                }
                                if (e.source == "button" || e.source == "key" || e.source == "wheel" || (e.source == "custom" && e.model.keyConfigs.down == "") || e.source == "thumb") {
                                    if ($("#" + proxy._id + "_WaitingPopup").is(":visible"))
                                        e.cancel = true;
                                    else {
                                        proxy._isThumbScroll = false;
                                        proxy._virtualViewScroll(e);
                                    }
                                    if (proxy.model.scrollSettings.virtualScrollMode == "continuous" && e["reachedEnd"])
                                        this.refresh();
                                }
                                proxy.model.currentIndex = e.scrollTop == 0 ? e.scrollTop : Math.floor(e.scrollTop / proxy._vRowHeight);
                            }
                            else {
                                if (!ej.isNullOrUndefined(e.scrollData) && e.scrollData.handler == "e-hhandle" && proxy.model.allowFiltering && (proxy.model.filterSettings.filterType == "menu" || proxy._isExcelFilter))
                                    !proxy._isExcelFilter ? proxy._closeFilterDlg() : proxy._excelFilter.closeXFDialog();
                                e["reachedEnd"] = this.content()[0].scrollHeight - e.scrollTop == this.content()[0].clientHeight;
                                if ((e.source == "button" || e.source == "key" || e.source == "wheel") && proxy.model != null) {
									if ($("#" + proxy._id + "_WaitingPopup").is(":visible")) 
                                        e.cancel = true;    
									else
										proxy._virtualScroll(e);
								}
                                if (e.source == "wheel" && e.scrollTop != proxy._scrollValue)
                                    e.scrollTop = proxy._scrollValue;
                                proxy._checkScroller(e, this);
                            }
                        }
                        if (!proxy.model.scrollSettings.frozenRows && !proxy.model.scrollSettings.frozenColumns)
                            if (!ej.isNullOrUndefined(e.scrollData) && e.scrollData.handler == "e-hhandle") {
                                if (proxy.model.allowFiltering && (proxy.model.filterSettings.filterType == "menu" || proxy._isExcelFilter))
                                    !proxy._isExcelFilter ? proxy._closeFilterDlg() : proxy._excelFilter.closeXFDialog();
                                proxy._checkScroller(e, this);
                            }
                            else {
                                proxy._scrollValue = e.scrollTop;
                                proxy.model.currentIndex = e.scrollTop == 0 ? e.scrollTop : Math.floor(e.scrollTop / proxy._vRowHeight);
                            }
                    },
					scrollStop: function (e) {
                        if (proxy.model.scrollSettings.allowVirtualScrolling) {
                            if (proxy.model.scrollSettings.enableVirtualization && proxy.model.scrollSettings.virtualScrollMode == "continuous")
                                e["reachedEnd"] = e.scrollData.scrollable - e.model.scrollTop == 0;
                            else if (e.originalEvent && !$(e.originalEvent.target).hasClass("e-rowcell"))
                                e["reachedEnd"] = this.content()[0].scrollHeight - e.scrollData.sTop == this.content()[0].clientHeight;
                            if (e.scrollData.handler == "e-hhandle")
                                return;
                            if (proxy.model != null && e.originalEvent) {
                                if (proxy.model.scrollSettings.enableVirtualization) {
                                    proxy._isThumbScroll = true;
								proxy._virtualViewScroll(e);
								if(proxy.model.scrollSettings.virtualScrollMode == "continuous" && e["reachedEnd"])
									this.refresh();
							}
							else
								proxy._virtualScroll(e);
                            }
                        }
                    },
                    thumbEnd: function (e) {
                        if (proxy.model.scrollSettings.allowVirtualScrolling) {
                            if (proxy.model.scrollSettings.enableVirtualization && proxy.model.scrollSettings.virtualScrollMode == "continuous")
                                e["reachedEnd"] = e.scrollData.scrollable - e.model.scrollTop == 0;
                            else if (e.originalEvent && !$(e.originalEvent.target).hasClass("e-rowcell"))
                                e["reachedEnd"] = this.content()[0].scrollHeight - e.scrollData.sTop == this.content()[0].clientHeight;
                            if (e.scrollData.handler == "e-hhandle")
                                return;
                            if (proxy.model != null && e.originalEvent) {
                                if (proxy.model.scrollSettings.enableVirtualization) {
                                    proxy._isThumbScroll = true;
								proxy._virtualViewScroll(e);
								if(proxy.model.scrollSettings.virtualScrollMode == "continuous" && e["reachedEnd"])
									this.refresh();
							}
							else
								proxy._virtualScroll(e);
                            }
                        }
                    },
                    scrollEnd: function (e) {
                        if (proxy.model.scrollSettings.allowVirtualScrolling) {
                            if (e.scrollData.type == "mousewheel" || (e.scrollData.model != null && e.scrollData.model.orientation == "horizontal")) return;
                            var currentViewIndex = proxy._calculateCurrentVirtualIndex(e);
							if(!proxy._checkCurrentVirtualView(proxy._virtualLoadedRows, currentViewIndex))	return;	
						    if (proxy.model.scrollSettings.enableVirtualization && !proxy._isContinuous) {
                                var currentPage = proxy._calculateCurrentViewPage(e.model);
                                var isVirtualPage = $.inArray(currentPage, proxy._virtualLoadedPages) != -1;
                                if (isVirtualPage) {
                                    proxy._isThumbScroll = true;
                                    proxy._virtualViewScroll(e);
                                    proxy.element.ejWaitingPopup("hide");
								if(proxy._totalVirtualViews <= proxy._maxViews * 3)
									this._content[0].scrollTop = e.scrollData.scrollTop;															
							}
							else {                             						
								e.cancel = true;
							}
						}						
                        }
                    }
                });
            }
            this.element.find(".e-gridheader").find(".e-headercontent,.e-movableheader").scroll(ej.proxy(function (e) {
                var $currentTarget = $(e.currentTarget);
                if (this.model.scrollSettings.targetPane) {
                    this.getContent().find(".e-movablecontent").scrollLeft($currentTarget.scrollLeft());
                    (this.model.showSummary && !ej.isNullOrUndefined(this.getFooterContent())) && this.getFooterContent().find(".e-movablefooter").scrollLeft($currentTarget.scrollLeft());;
                }
                else {
                    (this.model.showSummary && !ej.isNullOrUndefined(this.getFooterContent())) && this.getFooterContent().find("div").first().scrollLeft($currentTarget.scrollLeft());
                    this.getContent().find(".e-content").first().scrollLeft($currentTarget.scrollLeft());
                }
            }, this));
        },
        clearFiltering: function (field) {
            if (this.model.filterSettings.filterType == "filterbar")
                this.OldfilterValue = null;
		    if (field) {
		        this._clearFilter(field);
		        if (this.model.filterSettings.filterType != "filterbar")
		            for (var i = 0; i < this.filterColumnCollection.length; i++) {
		                if (this.filterColumnCollection[i].field == field)
		                    this.filterColumnCollection.splice(i, 1);
		            }
		    }
		    else {
		        var fltrCols = this.model.filterSettings.filteredColumns, i = 0;
		        while (i < fltrCols.length) {
		            this._clearFilter(fltrCols[i].field);
		        }
		        this.filterColumnCollection = [];
		        if (this.model.filterSettings.filterType == "menu" || this.model.filterSettings.filterType == "excel")
		            this.getHeaderTable().find(".e-filtericon").removeClass("e-filteredicon e-filternone");
		    }
		},
		_clearFilter: function (field) {
		    var filterType = this.model.filterSettings.filterType;
		    if (!ej.isNullOrUndefined(this.getColumnByField(field).filterType))
		        filterType = this.getColumnByField(field).filterType;
		    switch (filterType) {
		        case ej.Grid.FilterType.FilterBar:
		            if ($.inArray(this.getColumnByField(field), this.filterColumnCollection) != -1) {
		                var index = this.getColumnIndexByField(field);
		                this.getHeaderTable().find(".e-filtertext").eq(index).val("");
		                this._currentFilterbarValue = "";
		                var index = $.inArray(field, this.filterColumnCollection);
		                this._currentFilterColumn = this.getColumnByField(field);
		                this._showFilterMsg();
		            }
		            break;
		        case ej.Grid.FilterType.Menu:
					var id = "#" + this._id + "_" + this._$colType + "Dlg";
					if (this._$colType == "boolean")
						$(id).find('.e-value .e-js').ejCheckBox("model.checked", false);
					else
						if (this._$colType == "number")
							$(id).find('.e-numerictextbox').ejNumericTextbox("model.value", "");
						else
							$(id).find(".e-value input").val("");					
					        $(id).find(".e-value1 input").val("");
					if ((this._excelFilterRendered || this._isExcelFilter) && this._excelFilter._predicates.length)
					    delete this._excelFilter._predicates[0][field];
					this._$curFieldName = field;						
					break;
		        case ej.Grid.FilterType.Excel:
		            if (this._excelFilter._predicates.length)
		                delete this._excelFilter._predicates[0][field];
					this._excelFilter.closeXFDialog();
					this._$curFieldName = field;
					break;
			}
			this.filterColumn(field, "", "", "or");							
		},
		clearSearching: function(){
			this.element.find(".e-gridtoolbar #" + this._id + "_search").val("");
			this.search("");
			$.extend(this.model.searchSettings, this.defaults.searchSettings);
		},
        _renderByFrozenDesign: function () {
            var $div = $(document.createElement('div')), col = this._getMetaColGroup().find("col"), colgroups = {};
            colgroups["colgroup1"] = $div.append(ej.buildTag("colgroup").append(col.splice(0, this.model.scrollSettings.frozenColumns))).html();
            colgroups["colgroup2"] = $div.html(ej.buildTag("colgroup").append(col)).html();
            this.getContent().find("div").first().get(0).innerHTML = $.render[this._id + "_FrozenTemplate"]({ datas: this.model.currentViewData }, colgroups);
            this.setGridContentTable(this.getContent().find(".e-table").attr("data-role", "grid"));
        },
        addFrozenTemplate: function () {
            var template = "<div class='e-frozencontentdiv'>"
            + "<table class='e-table'>{{:~colgroup1}}<tbody>"
            + "{{for datas tmpl='" + this._id + "_JSONFrozenTemplate'/}}"
            + "</tbody></table></div>"
            + "<div class='e-movablecontent'><div class='e-movablecontentdiv'><table class='e-table'>{{:~colgroup2}}<tbody>"
            + "{{for datas tmpl='" + this._id + "_JSONTemplate'/}}"
            + "</tbody></table></div></div>", templates = {};
            templates[this._id + "_FrozenTemplate"] = template;
            $.templates(templates);
        },
        _getTopRow: function (offsetTop) {
            var currentTopRow = this.model.scrollSettings.frozenRows, i = 0;
            if (offsetTop > 10) {
                for (var i = 0; i < this._rowHeightCollection.length; i++) {
                    if (this._rowHeightCollection[i] > offsetTop) {
                        currentTopRow = this.model.scrollSettings.frozenRows + i - 1;
                        break;
                    }
                }
            }
            return { imaginaryIndex: currentTopRow, actualIndex: i };
        },
        _showHideRow: function (from, to, action, scrollPosition) {
            var rows = this.getRows();
            if (this.model.scrollSettings.frozenColumns > 0)
                $(rows[0]).slice(from, to).add($(rows[1]).slice(from, to).toArray())[action]();
            else
                $(rows).slice(from, to)[action]();
            this._currentTopFrozenRow = action == "show" ? from : to;
            this.getScrollObject()._changevHandlerPosition(scrollPosition);
        },
        _renderAlertDialog: function () {
            var $contentDiv = ej.buildTag('div.e-content', this._getLocalizedLabels()["frozenColumnsMessage"])
                , $buttons = ej.buildTag('span.e-buttons', "<input type='button' class='e-flat' id=" + this._id + 'ConfirmDialogOK' + " value='" + this._getDeprecatedLocalizedLabel("OKButton") + "'/>");
            this._alertDialog = ej.buildTag('div#' + this._id + 'AlertDialog');
            this._alertDialog.append($contentDiv).append($buttons);
            this.element.append(this._alertDialog);
            $buttons.find("input").ejButton({
                cssClass: this.model.cssClass,
                showRoundedCorner: true,
                size: "mini",
                click: $.proxy(function (args) {
                    this._alertDialog.ejDialog("close");
                }, this)
            });
            this._renderFDialog(this._id + 'AlertDialog');
            this._alertDialog.ejDialog({ width: "auto", enableModal: true });
        },
        _renderFDialog: function (id) {
            $("#" + id).ejDialog({ showOnInit: false, "enableRTL": this.model.enableRTL, "cssClass": this.model.cssClass, "showHeader": false, width: 260, enableResize: false, allowKeyboardNavigation: false, content: "#" + this._id });
        },
        _virtualScroll: function (e) {
			if (this.selectedRowsIndexes.length == this._gridRecordsCount)
                this.getHeaderTable().find(".e-headercelldiv .e-checkselectall").prop("checked", "checked");
            if (e != null) {
                var flag = 0;
                var recordCount = this.model.filterSettings.filteredColumns.length == 0 ? this._searchCount == null ? this._gridRecordsCount : this._searchCount : this._filteredRecordsCount;
                var pageInfo = this.model.pageSettings;
                var tbody = this.getContentTable()[0].tBodies[0];
                var virtualRows = $(tbody).find('tr.e-virtualrow');
                pageInfo.totalPages = Math.ceil(recordCount / pageInfo.pageSize);
                if (e.scrollTop !== undefined)
                    e.model.scrollTop = e.scrollTop;
                if (e.reachedEnd != undefined) e.model.reachedEnd = e.reachedEnd;
                var currentPageNo = this._calculateCurrenPage(virtualRows, this.getContentTable(), e.model);
                if (currentPageNo > pageInfo.totalPages)
                    currentPageNo = pageInfo.totalPages;
                if (pageInfo.currentPage != currentPageNo && $.inArray((currentPageNo - 1) * pageInfo.pageSize, this.virtualLoadedPages) == -1 && this.element.find(".gridform:visible").length == 0) {
                    this._isVirtualRecordsLoaded = false;
                }
                if (!this._isVirtualRecordsLoaded) {
                    if ($.inArray((currentPageNo - 1) * pageInfo.pageSize, this.virtualLoadedPages) == -1) {
                        if (this.model.scrollSettings.virtualScrollMode == "continuous" && !e.reachedEnd)
                            return
                        if (currentPageNo == pageInfo.totalPages && $.inArray((currentPageNo - 2) * pageInfo.pageSize, this.virtualLoadedPages) == -1) {
                            flag++;
                            this.set_currentPageIndex(currentPageNo);
                        }
                        if (flag == 1) this._lastRow = true;
                        this.set_currentPageIndex(currentPageNo);
                    }
                    pageInfo.currentPage = currentPageNo;
                }
                else
                    pageInfo.currentPage = currentPageNo;
                var model = this._refreshVirtualPagerInfo();
                this._showPagerInformation(model);
            }
        },
		_virtualViewScroll: function (e) {
            if (e != null) {                
                if (e.scrollTop !== undefined)
                    e.model.scrollTop = e.scrollTop;
                if (e.reachedEnd != undefined) e.model.reachedEnd = e.reachedEnd;
                var currentVirtualIndex = this._calculateCurrentVirtualIndex(e);
                if (this.model.isEdit)
                    this.cancelEdit();
                if ($.inArray(currentVirtualIndex, this._currentLoadedIndexes) == -1)
                    this._isVirtualRecordsLoaded = false;                               
                if (!this._isVirtualRecordsLoaded)                     
                    this.set_currentVirtualIndex(currentVirtualIndex);                							
            }
		},
        _createPagerStatusBar: function () {
            var $statusBar = this.element.find(".e-pagerstatusbar");
            if ($statusBar.length)
                $statusBar.remove();
            var $pagermsgDiv = ej.buildTag('div.e-pagermsgdiv');
            this.$pagerStatusBarDiv = ej.buildTag('div.e-pagerstatusbar').append($pagermsgDiv);
            if (this.model.scrollSettings.allowVirtualScrolling && this.model.allowFiltering && this.model.filterSettings.filterType == "filterbar") {
                var $messageDiv = ej.buildTag('div.e-pagerfiltermsg').css("display", "none");;
                this.$pagerStatusBarDiv.append($messageDiv);
            }
            this.$pagerStatusBarDiv.appendTo(this.element);
            this.$pagerStatusBarDiv.css("display", "none");
        },
        _refreshVirtualContent: function (currentPage) {
            var rowHeight = this.getRowHeight();
            var recordsCount = this.model.filterSettings.filteredColumns.length == 0 ? this._searchCount == null ? this._gridRecordsCount : this._searchCount : this._filteredRecordsCount;
            if (currentPage != null) {
                this._currentPage(currentPage);
                var model = this._refreshVirtualPagerInfo();
                this._showPagerInformation(model);
            }
            var currentData = this.model.currentViewData;
            if (!this.model.scrollSettings.enableVirtualization)
                this._virtualLoadedRecords[currentPage] = currentData;
            var isVirtualization = 0;
            if (this.model.scrollSettings.enableVirtualization)
                isVirtualization = 1;
            var currentIndex = isVirtualization == 1 ? this.getCurrentIndex() + 1 : this.getCurrentIndex();
            var tbody = this.getContentTable()[0].tBodies[0];
            if (currentIndex > 1) {
                var virtualTRTop = document.createElement("tr");
                $(virtualTRTop).addClass("e-virtualrow").css("height", rowHeight * currentIndex).prependTo(tbody);
            } if (currentIndex + this.model.pageSettings.pageSize <= recordsCount && this.getContentTable().find("tr").last().hasClass("e-virtualrow") != true && this.model.scrollSettings.frozenColumns == 0) {
                var virtualTRBottom = document.createElement("tr");
                var virtualHeight = this.model.scrollSettings.virtualScrollMode == "normal" ? rowHeight * (recordsCount - (currentIndex + this.model.pageSettings.pageSize)) : 1;
                $(virtualTRBottom).addClass("e-virtualrow").css("height", virtualHeight).appendTo($(tbody));
            }
            this.virtualLoadedPages = new Array();
            this.orderedVirtualLoadedPage = [];
            this.virtualLoadedPages.push(currentIndex >= isVirtualization ? currentIndex : isVirtualization);
            this.orderedVirtualLoadedPage.push(currentIndex >= isVirtualization ? currentIndex : isVirtualization);
            var focusTR = $(tbody).find('tr:not(.e-virtualrow)').attr('name', currentIndex >= isVirtualization ? currentIndex : isVirtualization)[0];
            if (focusTR && focusTR.previousSibling && ($(focusTR.previousSibling).hasClass("e-virtualrow") || focusTR.previousSibling.offsetTop > (currentIndex * this.getContent().height()))) {
                this.getContent().children("div").first().scrollTop(this.getContent().find(".content").scrollTop() - (this.getContent().find(".content").scrollTop() - focusTR.offsetTop));
                this._isVirtualRecordsLoaded = true;
            }
        },
        isIntermediate: function(){
            if (this.model.currentIndex < this.model.pageSettings.pageSize * (this.model.pageSettings.currentPage - 1))
                return true;
            else
                return false;
        },
        _refreshVirtualView: function (currentIndex, isSelection, rowIndex) {
			if(!this._singleView){			
				var virtualRowCount = this._virtualRowCount;				
				if(currentIndex){     
					var scrollRefresh, currentPage;
					if(currentIndex > this._totalVirtualViews){						
						currentIndex = 1;					
						scrollRefresh = true;						
					}
					if (isSelection == "selectRows") {
					    scrollRefresh = true;
					}
					this._currentVirtualIndex = currentIndex;
					if (!this._virtualLoadedRecords[currentIndex]) {
					    if (!this._virtualDataRefresh && this._currentVirtualIndex != this._totalVirtualViews) scrollRefresh = true;
					    currentPage = Math.ceil(currentIndex * this._virtualRowCount / this.model.pageSettings.pageSize);
					}
					else {
					    var scrollObj = this.getScrollObject();
					    currentPage = Math.ceil((scrollObj.scrollTop() + this.model.scrollSettings.height) / this._vRowHeight / this.model.pageSettings.pageSize);
					}
					this._refreshVirtualViewScroller(scrollRefresh, isSelection, rowIndex);
					if(currentPage > this.model.pageSettings.totalPages) currentPage = this.model.pageSettings.totalPages;
					if(currentPage <= 0) currentPage = 1;
					if($.inArray(currentPage, this._virtualLoadedPages) == -1)
						this.gotoPage(currentPage);
					else{
						this._currentPage(currentPage);
						if(!this._checkCurrentVirtualView(this._virtualLoadedRecords, currentIndex))
							this._needPaging = true;
						else
							this._needPaging = false;
						this._getVirtualLoadedRecords(this.model.query);
						this._replacingVirtualContent();				
					}
				}
				else{               					
					this._refreshVirtualViewDetails();					
					var rows = $(this.getContentTable()[0].rows);
					this._setVirtualTopBottom();
					if (this.initialRender){
						for (var i = 0; i < this._currentLoadedIndexes.length; i++) {
							var currentLoadedIndex = this._currentLoadedIndexes[i], viewIndex = (i + 1) * virtualRowCount, viewCount = i * virtualRowCount;
							$(rows[viewIndex - 1]).addClass("e-virtualview" + currentLoadedIndex);
							var hex = currentLoadedIndex.toString(32);
							var vRows = rows.slice(viewCount, viewCount + virtualRowCount).attr('name', hex).detach();
							this._virtualLoadedRows[currentLoadedIndex] = vRows;
							vRows.appendTo(this.getContentTable());
						}
						if(this._currentVirtualIndex > 1) 
							this._refreshVirtualViewScroller();											
					}			
					this._eventBindings();
				}
				if($.inArray(this._currentPage(), this._virtualLoadedPages) == -1)
					this._virtualLoadedPages.push(this._currentPage());				
			}
			else {
				this._singleView = false;				
				this._addLastRow();	
				this.getContent().find(".e-virtualtop, .e-virtualbottom").remove();
				var hex = this._currentVirtualIndex.toString(32);				
				$(this._gridRows).attr('name', hex);
				this._virtualLoadedRows[this._currentVirtualIndex] = this._gridRows;				
				this._eventBindings();
			}
			if(!currentIndex && (this.model.queryCellInfo || this.model.rowDataBound)){
				for(var i = 0; i < this._currentLoadedIndexes.length; i++){					
					if($.inArray(this._currentLoadedIndexes[i], this._queryCellView) == -1)
						this._queryCellView.push(this._currentLoadedIndexes[i]);						
				}
			}
			this._isThumbScroll = false;
			this._virtualDataRefresh = false;
        },
		_refreshVirtualViewData: function(){
			this._virtualLoadedRecords = {};
			this._virtualLoadedRows = {};	
			this._virtualLoadedPages = [];	
			this._virtualPageRecords = {};
			this._queryCellView	= [];									
			if(this.model.pageSettings.totalPages != null && (this._currentPage() > this.model.pageSettings.totalPages || !this.model.pageSettings.totalPages)){
				this._currentPage(1);
				this._currentVirtualIndex = 1;
			}			
		},
		setCurrentPageData: function(currentData){
			if(this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization){
				this._refreshVirtualViewData();
				this._refreshVirtualViewDetails();										
				this._setVirtualLoadedRecords(currentData, this._currentPage());
				this._refreshVirtualView(this._currentVirtualIndex);
			}
		},
		_refreshVirtualViewScroller: function (needRefresh, isSelection, rowIndex) {
			var scrollValue;
			if ((this.initialRender && !this.model.scrollSettings.scrollTop) || needRefresh) {
			    var rowHeight = this._vRowHeight;
			    scrollValue = this.model.currentIndex * this._vRowHeight;
			}
			if (isSelection == "selectRows") {
			    scrollValue = rowIndex * this._vRowHeight;
			}
			else
				scrollValue = this._scrollObject.model.scrollTop;
			this.getContent().ejScroller("model.scrollTop", scrollValue);           
            this._scrollValue = scrollValue;
        },
		_calculateCurrentViewPage: function (args) {
			if(!args) args = this._scrollObject.model;
            var pageSize = this.model.pageSettings.pageSize;                                
            var currentPage =  Math.ceil((args.scrollTop + this.model.scrollSettings.height) / this._vRowHeight / pageSize);
			// if(this.model.scrollSettings.virtualScrollMode == "continuous")
				// currentPage = Math.ceil(this._currentVirtualIndex * this._virtualRowCount / this.model.pageSettings.pageSize);
            if(this.model.pageSettings.totalPages == null)
                this.model.pageSettings.totalPages = Math.ceil(this._getVirtualTotalRecord() / pageSize);                         
            if(currentPage > this.model.pageSettings.totalPages)
                currentPage = this.model.pageSettings.totalPages;
            this.model.pageSettings.currentPage = currentPage;
            return currentPage;
        },
		_calculateCurrentVirtualIndex: function (e) {
            var args = e.model, recordCount = this._getVirtualTotalRecord();
            var currentIndex, trEle, isLast, viewTr = [], cur, oTop, len, sTop = args.scrollTop;
            var index = sTop + this.model.scrollSettings.height;
            currentIndex = (sTop + this._vRowHeight) / this._vRowHeight / this._virtualRowCount;
            currentIndex = Math.ceil(currentIndex);
            if (sTop >= this._scrollValue && args.virtualScrollMode == "continuous" && args.reachedEnd) 
                currentIndex = currentIndex + 1;                      
            if(currentIndex > this._totalVirtualViews) currentIndex = this._totalVirtualViews;
            if(currentIndex <= 0) currentIndex = 1;                
            if ($.inArray(currentIndex, this._currentLoadedIndexes) !== -1 && this._virtualLoadedRows[currentIndex] && sTop != e.scrollData.scrollable) {
                var viewTrs = this.getContentTable()[0].rows; len = viewTrs.length;
                var virtualTopHeight = this.getContent().find(".e-virtualtop").height();
                isLast = sTop >= this._scrollValue;
                for (var i = 0; i < len; i++) {
                    cur = viewTrs[i];
                    oTop = cur.offsetHeight + cur.offsetTop + virtualTopHeight;
                    if (oTop > sTop + this.model.scrollSettings.height) {
                        if (viewTr.length === 0 && i !== 0)
                            viewTr = [viewTrs[cur.offsetTop <= sTop + this.model.scrollSettings.height ? i : i - 1]];
                        break;
                    }
                    if (oTop >= sTop && oTop <= sTop + this.model.scrollSettings.height) {
                        viewTr.push(cur);
                        if (isLast === false && viewTr.length > 1)
                            break;
                    }
                }
                trEle = $(sTop >= this._scrollValue ? viewTr[viewTr.length - 1] : viewTr[0]);
                if(trEle.length)
                    currentIndex = parseInt(trEle.attr("name"), 32);
            }						
            this._scrollValue = sTop;           
            return currentIndex;
        },
        _calculateCurrenPage: function (virtualRows, target, args) {
            var pageSize = this.model.pageSettings.pageSize;
            var currentPage, tempCPage, diff, proxy = this, trEle, isLast, viewTr = [], cur, oTop, len,currentRowValue,$currentRow;
            var rowHeight = this.getRowHeight();
            currentPage = (args.scrollTop + this.model.scrollSettings.height) / rowHeight / pageSize;            
            currentRowValue = (this.model.pageSettings.pageSize * (this.model.pageSettings.currentPage -1 ));
			 $currentRow = this.getContentTable().find("tr[name="+currentRowValue+"]").eq(0);
			if ($currentRow.length && $currentRow.offset().top > 0 && currentPage >= 1 &&  args.scrollTop < this._scrollValue && this.virtualLoadedPages.indexOf(Math.ceil(currentPage - 1) * pageSize) !== -1)
                currentPage = Math.floor(currentPage);
            else
                currentPage = Math.ceil(currentPage);

            if (args.scrollTop >= this._scrollValue && args.virtualScrollMode == "continuous" && args.reachedEnd) {
                currentPage = this.virtualLoadedPages[this.virtualLoadedPages.length - 1] / pageSize + 2;
            }

            if ($.inArray((currentPage - 1) * pageSize, this.virtualLoadedPages) !== -1) {
                var viewTrs = this.getContentTable().children("tbody").children("tr"); len = viewTrs.length;
                isLast = args.scrollTop >= this._scrollValue;
                for (var i = 0; i < len; i++) {
                    cur = viewTrs[i];
                    oTop = cur.offsetHeight + cur.offsetTop;
                    if (oTop > args.scrollTop + proxy.model.scrollSettings.height) {
                        if (viewTr.length === 0 && i !== 0)
                            viewTr = [viewTrs[cur.offsetTop <= args.scrollTop + proxy.model.scrollSettings.height ? i : i - 1]];
                        break;
                    }
                    if (oTop >= args.scrollTop && oTop <= args.scrollTop + proxy.model.scrollSettings.height) {
                        viewTr.push(cur);
                        if (isLast === false && viewTr.length > 1)
                            break;
                    }
                }
                trEle = $(args.scrollTop >= this._scrollValue ? viewTr[viewTr.length - 1] : viewTr[0]);
                if (trEle.hasClass('e-virtualrow')) {
                    if (viewTr.length === 1) {
                        currentPage++;
                    }
                }
                else
                    currentPage = parseInt(trEle.attr("name"), 10) / pageSize + 1;
            }
            this._scrollValue = args.scrollTop;
            for (var index = 0; index < virtualRows.length; index++) {
                var val = virtualRows[index];
                if (val.offsetTop + val.offsetHeight >= args.scrollTop) {
                    var prevVirtualPage = this._calculatePrevPage(virtualRows, target, args);
                    this._prevPageNo = prevVirtualPage;
                    if (currentPage == 0)
                        currentPage = 1;
                    currentPage = currentPage > this.model.pageSettings.totalPages ? this.model.pageSettings.totalPages : currentPage;
                    return currentPage;
                }
            }
            return currentPage;
        },
        _calculatePrevPage: function (virtualRows, target, args) {
            for (var i = 0; i < virtualRows.length; i++) {
                var val = virtualRows[i];
                if (val.offsetTop + val.offsetHeight >= args.scrollTop) {
                    var trElement = $(val).prevAll('tr[name]')[0];
                    if (trElement != null) {
                        return Math.ceil(parseInt($(trElement).attr('name'), 10) / this.model.pageSettings.pageSize) + 1;
                    }
                }
            }
            return -1;
        },
        _refreshVirtualPagerInfo: function () {
            var model = {};
            model.pageSize = this.model.pageSettings.pageSize;            
            model.totalRecordsCount = this.model.filterSettings.filteredColumns.length == 0 ? this._searchCount == null ? this._gridRecordsCount : this._searchCount : this._filteredRecordsCount;
            if (model.totalRecordsCount == 0)
                this._currentPage(0);
            model.currentPage = this._currentPage();
            model.totalPages = Math.ceil(model.totalRecordsCount / model.pageSize);

            return model;
        },
        _showPagerInformation: function (model) {
            var from = (model.currentPage - 1) * model.pageSize;
            $(this.$pagerStatusBarDiv).find("div:first").html(String.format(this.localizedLabels.PagerInfo, model.currentPage, model.totalPages, model.totalRecordsCount), from, from + model.pageSize);
            $(this.$pagerStatusBarDiv).css('display', 'block');
        },
        _headerCellMerge: function(args){
            args.headerCellMerge = function(index, colspan){
                var thead = this.model.showStackedHeader && this.model.stackedHeaderRows.length ? this.columnHeaders.parent().find("tr:not('.e-stackedHeaderRow')") : this.columnHeaders;
                thead.find("th").eq(index).attr("colspan", colspan);
                for (var i = 1; i < colspan; i++) {
                    if (!ej.isNullOrUndefined(thead[0].children[index + i]))
                        thead[0].children[index + i].className += " e-hide";
                }
            };
        },
        _cellMerging: function (args) {
            args.colMerge = function (range) {
                if (this.cell.className.indexOf("e-colmerge") == -1) {
                    this.cell.className += " e-colmerge";
                    if (this.model.columns.length - this.cell.cellIndex < range)
                        range = this.model.columns.length - this.cell.cellIndex;
                    this.cell.colSpan = range;
                    for (var i = 1; i < range; i++) {
                        if (!ej.isNullOrUndefined(this.cell.parentElement.children[this.cell.cellIndex + i]))
                            this.cell.parentElement.children[this.cell.cellIndex + i].className += " e-hide";
                    }
                }
            };
            args.rowMerge = function (range) {
                if (this.cell.className.indexOf("e-rowmerge") == -1) {
                    this.cell.className += " e-rowmerge";
                    var ele = this.cell.parentNode.parentNode;
                    if (ele.rows.length - this.cell.parentElement.rowIndex < range)
                        range = ele.rows.length - this.cell.parentElement.rowIndex;
                    this.cell.rowSpan = range;
                    for (var i = 0; i < range - 1; i++) {
                        if (!ej.isNullOrUndefined(ele.children[this.cell.parentElement.rowIndex + i].nextSibling)) {
                            if (!($(".e-grid").children().is('.e-dialog')) || ($(".e-grid").find('.e-dialog').attr("style").indexOf("display: none")) != -1 || this.model.allowFiltering)
                                ele.children[this.cell.parentElement.rowIndex + i].nextSibling.children[this.cell.cellIndex].className += " e-merged e-hide";
                        }
                        else
                            break;
                    }
                }
            };
            args.merge = function (col, row) {
                if (col > 1 && row > 1) {
                    if (this.cell.className.indexOf("e-colmerge") == -1) {
                        this.cell.className += " e-colmerge";
                        var ele = this.cell.parentNode.parentNode;
                        if (ele.rows.length - this.cell.parentElement.rowIndex < row)
                            row = ele.rows.length - this.cell.parentElement.rowIndex;
                        if (!($(".e-grid").children().is('.e-dialog')) || ($(".e-grid").find('.e-dialog').attr("style").indexOf("display: none")) != -1 || this.model.allowFiltering) {
                            for (var i = 0; i < row ; i++) {
                                if (!ej.isNullOrUndefined(ele.children[this.cell.parentElement.rowIndex + i])) {
                                    var selectCell = ele.children[this.cell.parentElement.rowIndex + i].children[this.cell.cellIndex];
                                    if (this.model.columns.length - selectCell.cellIndex < col)
                                        col = this.model.columns.length - selectCell.cellIndex;
                                    selectCell.colSpan = col;
                                    for (var j = 1; j < col; j++) {
                                        if (!ej.isNullOrUndefined(selectCell.parentElement.children[this.cell.cellIndex + j]))
                                            selectCell.parentElement.children[this.cell.cellIndex + j].className += " e-hide";
                                    }
                                }
                                else
                                    break;
                            }
                        }
                        else {
                            this.cell.colSpan = col;
                            for (var j = 1; j < col; j++) {
                                if (!ej.isNullOrUndefined(this.cell.nextSibling))
                                    this.cell.parentElement.children[this.cell.cellIndex + j].className += " e-hide";
                            }
                        }
                        args.rowMerge(row);
                    }
                }
                else {
                    if (col > 1)
                        args.colMerge(col);
                    if (row > 1)
                        args.rowMerge(row);
                }
            };
        },
        _replacingContent: function () {
            var temp = document.createElement('div');
            var isVirtualization = 0;
            if (this.model.scrollSettings.enableVirtualization)
                isVirtualization = 1;
            var currentIndex = isVirtualization == 1 ? this.getCurrentIndex() + 1 : this.getCurrentIndex();
            var contentTable = this.getContentTable()[0];
            var colGroup = $(contentTable).find("colgroup").first();
            var rowHeight = this.getRowHeight();
            colGroup.replaceWith(this._getMetaColGroup());
           (this.model.detailsTemplate != null || this.model.childGrid!=null)&& colGroup.prepend(this._getIndentCol());
            var tbody = contentTable.tBodies[0];
            var currentData = this.model.currentViewData;
            if (!ej.isNullOrUndefined(this._currentPageData)) {
                this._virtualLoadedRecords[this._currentPage()] = this._currentPageData;
                this._currentPageData = null;
            }
            else
                this._virtualLoadedRecords[this._currentPage()] = currentData;
            var elementTbody = $("<tbody></tbody>").append($.render[this._id + "_JSONTemplate"](currentData));
            var proxy = this;
            var $elementTbody = elementTbody.children("tr");
            if (this._allowcolumnSelection && this.selectedColumnIndexes.length > 0) {
                for (var index = 0; index < this.selectedColumnIndexes.length; index++) {
                    var ind = this.selectedColumnIndexes[index] + 1;
                    $elementTbody.find('td:nth-of-type(' + ind + ')').addClass("e-columnselection");
                }
            }
            this.virtualLoadedPages.push(currentIndex >= isVirtualization ? currentIndex : isVirtualization);
            if (this._lastRow) {
                var currElementsLength = this._virtualLoadedRecords[this._currentPage()].length;
                $elementTbody.slice(-currElementsLength).attr('name', currentIndex);
                var prevPageElements = $elementTbody.slice(0, $elementTbody.length - currElementsLength);
                if (prevPageElements.length) {
                    var prevPage = ((this._currentPage() - 2) * (this.model.pageSettings.pageSize));
                    prevPageElements.attr('name', prevPage);
                    this.virtualLoadedPages[this.virtualLoadedPages.length - 1] = (prevPage >= isVirtualization) ? prevPage : isVirtualization;
                    this.virtualLoadedPages.push((currentIndex >= isVirtualization) ? currentIndex : isVirtualization);
                }
            }
            else
                $($elementTbody).attr('name', currentIndex);
            var orderedVirtualPages = ej.dataUtil.mergeSort(ej.distinct(this.virtualLoadedPages));
            var minValue = ej.dataUtil.min(orderedVirtualPages);
            var maxValue = ej.dataUtil.max(orderedVirtualPages);
            $(tbody).children(".e-virtualrow").remove();
            for (var i = 0; i < orderedVirtualPages.length; i++) {
                var val = orderedVirtualPages[i];
                var pVal = orderedVirtualPages[i - 1];
                if (val != this.orderedVirtualLoadedPage[i] || this.orderedVirtualLoadedPage[i] == undefined) {
                    if (pVal != undefined)
                        $elementTbody.insertAfter($(tbody).children('[name=' + pVal + ']:last'));
                    else
                        $elementTbody.insertBefore($(tbody).children('[name=' + this.orderedVirtualLoadedPage[i] + ']:first'));
                    this.orderedVirtualLoadedPage = orderedVirtualPages;
                }
                if (val != 0) {
                    var prevValue = val == minValue ? minValue : pVal;
                    var middleRows = val - prevValue - proxy.model.pageSettings.pageSize;
                    if (middleRows > 0) {
                        var virtualTRMiddle = document.createElement("tr");
                        $(virtualTRMiddle).addClass("e-virtualrow").css("height", rowHeight * middleRows).insertBefore($(tbody).children('[name=' + val + ']:first'));
                    }
                }
                if (val == maxValue) {
                    var bottomRows = proxy._gridRecordsCount - maxValue - proxy.model.pageSettings.pageSize;
                    if (bottomRows > 0) {
                        var virtualTRBottom = document.createElement("tr");
                        $(virtualTRBottom).addClass("e-virtualrow").css("height", rowHeight * bottomRows).appendTo(tbody);
                    }
                }
            }
            if (minValue > 0) {
                var virtualTRTop = document.createElement("tr");
                $(virtualTRTop).addClass("e-virtualrow").css("height", rowHeight * minValue).prependTo(tbody);
            }
            var $content = this.getContent();
            var focusTR = $(tbody).children("tr[name=" + currentIndex + "]")[0];
            var focusPrev = focusTR.previousSibling;
            var con = $content.height();
            var focus = focusTR.offsetTop
            if (this._virtaulUnSel) {
                var virtualClone = $.extend(true, [], this._virtaulUnSel);
                for (var i = 0; i < virtualClone.length; i++) {
                    var row = virtualClone[i];
                    var page = this.model.pageSettings.currentPage;
                    var corresPage = row % this.model.pageSettings.pageSize == 0 ? parseInt(row / this.model.pageSettings.pageSize) : parseInt(row / this.model.pageSettings.pageSize) + 1;
                    if (corresPage == page) {
                        var index = row % this.model.pageSettings.pageSize;
                        var $row = $(tbody).find("tr[name=" + currentIndex + "]").eq(index);
                        $row.attr("aria-selected", "true").find('.e-rowcell, .e-detailrowcollapse, .e-detailrowexpand').addClass("e-selectionbackground e-active");
                        var removeIndex = this._virtaulUnSel.indexOf(row);
                        if (removeIndex != -1)
                            this._virtaulUnSel.splice(removeIndex, 1);
                    }
                }
            }
            if ((focusTR && focusPrev && ((this._virIndex || $(focusPrev).hasClass("e-virtualrow")) || focusPrev.offsetTop > (currentIndex * con))
            && (this._gridRecordsCount - currentIndex >= this.model.pageSettings.pageSize || focusTR.offsetParent.offsetHeight - focus < con)) || this._lastRow) {
                if (this._lastRow) this._lastRow = false;
                if (this._virIndex) this._virIndex = false;
                this._isVirtualRecordsLoaded = true;
                //this.getContent().children("div").first().scrollTop(this.getContent().find(".content").scrollTop() - (this.getContent().find(".content").scrollTop() - focusTR.offsetTop));
                $content.find(".e-content").scrollTop(focus);
                this._scrollValue = this.getContent()[0].firstChild.scrollTop;
            }
            var $contentTableTr = $(contentTable).get(0);
            var tFirst = temp.firstChild;
            this._currentJsonData = currentData;
            this._gridRows = $(contentTable).get(0).rows;
            var lastVirtualRow = $(contentTable).find(".e-virtualrow").last();
            var lastVirtualRowHeight = this.model.scrollSettings.virtualScrollMode == "normal" ? (lastVirtualRow.height() - ($(contentTable).height() - (this._gridRecordsCount * rowHeight))) : 1;
            lastVirtualRow.css("height", lastVirtualRowHeight);
			if(this._enableCheckSelect && this.element.find(".e-checkselectall").prop("checked"))
				this._virtualCheckSelection(currentIndex);
            this._eventBindings();
        },
		_virtualCheckSelection:function(index){
			var tbody = this.getContentTable()[0].tBodies[0];
		    $(tbody).find("tr[name=" + index + "]").find('.e-checkcelldiv input').prop("checked","checked")
			$(tbody).find("tr[name=" + index + "]").attr("aria-selected", "true").find("td").addClass("e-selectionbackground e-active");
		},
		_replacingVirtualContent: function () {                  
            var contentTable = this.getContentTable()[0];                            
            var currentLoadedIndexes = this._currentLoadedIndexes;            
            var tempTbody = $("<tbody></tbody>");		                   
            if (this._checkCurrentVirtualView(this._virtualLoadedRows, this._currentVirtualIndex)) {
				var currentRows = [];
                for (var i = 0; i < currentLoadedIndexes.length; i++) {
					$.merge(currentRows, this._virtualLoadedRows[currentLoadedIndexes[i]]);                    					
                }
				$(tempTbody).append(currentRows);
            }
            else {
				var elementTbody = $("<tbody></tbody>"); 				
                for (var i = 0; i < currentLoadedIndexes.length; i++) {					
                    var currentIndex = currentLoadedIndexes[i], virtualRow = this._virtualLoadedRows[currentIndex];                  
                    if (!virtualRow) {
                        this._currentVirtualRowIndex = currentIndex > 0 ? (currentIndex - 1) * (this._virtualRowCount) : 0;
                        var elementTbody = $("<tbody></tbody>").append($.render[this._id + "_JSONTemplate"](this._virtualLoadedRecords[currentIndex]));                        
                        var $elementTbody = elementTbody[0].rows, length = $elementTbody.length - 1;                        
                        $($elementTbody[length]).addClass("e-virtualview" + currentIndex);
						var hex = currentIndex.toString(32);
                        var vRows = $($elementTbody).attr('name', hex);                        
                        if (vRows.length == this._virtualRowCount || currentIndex == this._totalVirtualViews){
                            this._virtualLoadedRows[currentIndex] = vRows;
                            tempTbody.append($elementTbody);
                        }
                    }
                    else {
                        if (currentIndex < this._currentVirtualIndex) {
                            var vRow = tempTbody.find(".e-virtualview" + currentIndex);
                            if (vRow.length)
                                $(virtualRow).insertBefore(vRow);
                            else
                                tempTbody.prepend(virtualRow);
                        }
                        else
                            $(virtualRow).insertAfter(tempTbody.find(".e-virtualview" + (currentIndex - 1)));
                    }					
                }				
            }						   						
            contentTable.replaceChild(tempTbody[0], contentTable.lastChild);
			var ind;
            if (this.selectedRowsIndexes.length && !this._enableCheckSelect) {
                var loadedIndex = $.inArray(this._prevVirtualIndex, this._currentLoadedIndexes);
                var prevLoadedIndex = $.inArray(this._prevVirtualIndex, this._prevLoadedIndexes);
                if (loadedIndex != -1 && loadedIndex != prevLoadedIndex) {
                    var changes = this._prevVirtualIndex > this._currentVirtualIndex ? this._virtualRowCount : -this._virtualRowCount;
                    this.selectedRowsIndexes = this.selectedRowsIndexes.map(function (val) { return val + changes; });
                    var selectIndex = this._selectedRow() + changes;
                    selectIndex = selectIndex >= 0 ? selectIndex : -1;
                    this._selectedRow(selectIndex);
					ind = selectIndex;
                }
            }
            $(contentTable.rows).removeClass("e-hover");
			this._setVirtualTopBottom();
			if(this._isThumbScroll || this._remoteRefresh){				
				//this._scrollObject.refresh();				
				this._scrollObject._content[0].scrollTop = this._scrollObject.scrollTop();
                this._isThumbScroll = this._remoteRefresh = false;
            }
			if(this.model.allowSelection)							
				this._checkVirtualSelection();																						
			this._gridRows = contentTable.rows;
			this._currentJsonData = this.model.currentViewData;
			if(!this._checkCurrentVirtualView(this._queryCellView, this._currentVirtualIndex))            
				this._eventBindings();			
			if(this.model.queryCellInfo || this.model.rowDataBound){
				for(var i = 0; i < this._currentLoadedIndexes.length; i++){
					if($.inArray(this._currentLoadedIndexes[i], this._queryCellView) == -1)
						this._queryCellView.push(this._currentLoadedIndexes[i]);						
				}
			}
			this._trigger("refresh");
			if(this._scrollObject.model.keyConfigs.down == "" && !ej.isNullOrUndefined(ind))
				this.selectRows(selectIndex, null , this.getRowByIndex(selectIndex))
        },
		_setVirtualTopBottom: function(){
			var contentTable = this.getContentTable()[0];
			var rowHeight = this._vRowHeight;
			var orderedVirtualNames = ej.dataUtil.mergeSort(ej.distinct(this._currentLoadedIndexes));				
			var minValue = ej.dataUtil.min(orderedVirtualNames);
			if(!this.initialRender && !this._virtualLoadedRows[minValue])
				minValue = minValue + 1;
			var maxValue = ej.dataUtil.max(orderedVirtualNames);
			var recordsCount = this._getVirtualTotalRecord(), botHeight, maxViewValue;
			if(this.model.scrollSettings.virtualScrollMode == "continuous" && this._virtualLoadedRows[maxValue + 1]	){
				var keys = Object.keys(this._virtualLoadedRows);
				maxViewValue =  parseInt(ej.dataUtil.max(keys), 10);
				maxValue = maxViewValue - maxValue;
			}			
			botHeight = (maxValue * this._virtualRowCount * rowHeight);
			if($.inArray(this._totalVirtualViews, this._currentLoadedIndexes) != -1 && this._currentVirtualIndex != this._totalVirtualViews)
				botHeight = (recordsCount - (this._virtualRowCount - this._lastViewData)) * rowHeight;										
			var vBot = (recordsCount * rowHeight) - botHeight;	
			if(this.model.scrollSettings.virtualScrollMode == "continuous" && !this._virtualLoadedRows[maxValue + 1]){				
				vBot = maxViewValue && maxViewValue <=  maxValue + 1 ? vBot : 1;			 				
			}
			this.getContent().find(".e-virtualtop, .e-virtualbottom").remove();
			var max = 1000000;							
			if (vBot > 0 && this._getVirtualTotalRecord() > this._virtualRowCount * 2){ 
				if(Math.round(vBot).toString().length < 7)
					ej.buildTag("div.e-virtualbottom", "", { height: vBot }).insertAfter(contentTable);
				else {					
					ej.buildTag("div.e-virtualbottom").insertAfter(contentTable);
					var length = Math.ceil(vBot / max);
					for(var i = 0; i < length; i++){
						var divHeight = max;
						if(i == length - 1) divHeight = vBot % max;
						$(contentTable).next().append(ej.buildTag("div", "", { height: divHeight }));
					}
				}							
			}
			if (minValue > 1) {				
				var vTop =  (minValue - 1) * this._virtualRowCount * rowHeight;																	
				if(Math.round(vTop).toString().length < 7)
					ej.buildTag("div.e-virtualtop", "", { height: vTop }).insertBefore(contentTable);			
				else {					
					ej.buildTag("div.e-virtualtop").insertBefore(contentTable);
					var length = Math.ceil(vTop / max);
					for(var i = 0; i < length; i++){
						var divHeight = max;
						if(i == length - 1) divHeight = vTop % max;
						$(contentTable).prev().append(ej.buildTag("div", "", { height: divHeight }));
					}
				}								
			}      				
			if(this._scrollObject.model.scrollTop != this._scrollValue)
				this.getContent().ejScroller("model.scrollTop", this._scrollValue);				
        },
		_checkVirtualSelection: function(){
			var contentTable = this.getContentTable()[0];
			var selectedIndexes, rowIndex;
			if (this._enableCheckSelect) {
			    this.selectedRowsIndexes = [];
			    this._virtualSelectedRecords = [];
			    this.model.selectedRecords = [];
			    var count = this.model.pageSettings.pageSize;
			    selectedIndexes = [].concat.apply([], this.checkSelectedRowsIndexes.map(function (n, i) {
			        return n.map(function (x) { return x + (i * count) });
			    }));
			}
			else
			    selectedIndexes = this.selectedRowsIndexes;
			if (selectedIndexes)
			    for (var i = 0; i < selectedIndexes.length; i++) {
			        var selectedIndex = selectedIndexes[i];
			        var selectedData = this._getSelectedViewData(selectedIndex);
			        var viewIndex = selectedData.viewIndex
			        if ($.inArray(viewIndex, this._currentLoadedIndexes) != -1) {
			            var selIndex = selectedIndex % this._virtualRowCount + this._currentLoadedIndexes.indexOf(viewIndex) * this._virtualRowCount;
			            if (!ej.isNullOrUndefined(contentTable.rows[selIndex])) {
			                if (!$(contentTable.rows[selIndex].cells).hasClass("e-selectionbackground"))
			                    $($(contentTable.rows[selIndex]).attr("aria-selected", "true")[0].cells).addClass("e-selectionbackground e-active");
			                if (this._enableCheckSelect || !$(contentTable.rows[selIndex].cells).hasClass("e-selectionbackground")) {
			                    rowIndex = $(contentTable.rows[selIndex]).index();
			                    this.selectedRowsIndexes.push(rowIndex);
			                    this._virtualSelectedRecords[rowIndex] = selectedData.data;
			                    this._virtualCheckSelectedRecords[((viewIndex - 1) * this._virtualRowCount) + rowIndex] = selectedData.data;
			                    this.model.selectedRecords.push(selectedData.data);
			                    $(contentTable.rows[selIndex]).find(".e-checkcelldiv [type=checkbox]").prop("checked", true);
			                }
			            }
			        }
			    }
			for(var i = 0; i < this._rowIndexesColl.length; i++){
				var selectedIndex = this._rowIndexesColl[i];
				var viewIndex = this._getSelectedViewData(selectedIndex).viewIndex;
				if(($.inArray(viewIndex, this._currentLoadedIndexes) != -1 && $.inArray(selectedIndex, this._virtualRowCellSelIndex) == -1) || this._virtualDataRefresh){
					var curIndex = $.inArray(selectedIndex, this._rowIndexesColl);
					var cellIndexes = this.selectedRowCellIndexes[curIndex].cellIndex;
					for(var j = 0; j < cellIndexes.length; j++)
						this._selectMultipleCells(selectedIndex, cellIndexes[j]);						
				}
			}
			var selectedRows = $(contentTable.rows).find(".e-active, .e-cellselectionbackground").closest("tr");
			for(var i = 0; i < selectedRows.length; i++){
				var limit = parseInt($(selectedRows[i]).attr("name"), 32) * this._virtualRowCount;
				var remain = this._virtualRowCount - $(selectedRows[i]).index() % this._virtualRowCount;	
				var current = limit - remain;
				    rowIndex = $(selectedRows[i]).index();
				if (this.selectedRowsIndexes.length && $.inArray(rowIndex, this.selectedRowsIndexes) == -1) {
					this._clearVirtualSelection = true;
					this.clearSelection(rowIndex);					
				}				
				if(this._rowIndexesColl.length && $.inArray(current, this._rowIndexesColl) == - 1)											
					$(this.getRowByIndex(rowIndex)[0].cells).removeClass("e-cellselectionbackground e-activecell");											
			}	
			$(contentTable.rows).find('.e-columnselection').removeClass('e-columnselection');
            for (var index = 0; index < this.selectedColumnIndexes.length; index++) {
				var ind = this.selectedColumnIndexes[index] + 1;
                $(contentTable.rows).find('td:nth-of-type(' + ind + ')').addClass("e-columnselection");
            }  				
			this._clearVirtualSelection = false;
		},
        _refreshPagerTotalRecordsCount: function () {
            if (this.model.filterSettings.filteredColumns.length)
                this.getPager().ejPager({ totalRecordsCount: this._searchCount == null ? this._filteredRecordsCount : this._searchCount, currentPage: this._currentPage() });
            else
                this.getPager().ejPager({ totalRecordsCount: this._searchCount == null ? this._gridRecordsCount : this._searchCount, currentPage: this._currentPage() });
        },
        _maxZindex: function () {
            var maxZ = 1;
            maxZ = Math.max.apply(null, $.map($('body *'), function (e, n) {
                if ($(e).css('position') == 'absolute')
                    return parseInt($(e).css('z-index')) || 1;
            }));
            if (maxZ == undefined || maxZ == null)
                maxZ = 1;
            return maxZ;
        },
        _keyPressed: function (action, target, e, event) {
            var $target = $(target), toolbarId;
            if ($target.hasClass('e-tooltxt') && e.code == 13) {
                var args = { currentTarget: target, target: target.firstChild }, $toolbar = $(target).closest(".e-gridtoolbar");
                $toolbar.ejToolbar("instance")._trigger("click", args);
                return false;
            }
            if (this._allowcellSelection && !(this._previousRowCellIndex && this._previousRowCellIndex.length != 0) && !(this._lastSelectedCellIndex && this._lastSelectedCellIndex.length != 0)) {
                this._previousRowCellIndex = [];
                this._previousRowCellIndex.push([0, [0]]);
                this._lastSelectedCellIndex.push([0, [0]]);
            }
            if ($target.hasClass('e-ddl') && e.code == 13 && $(document.activeElement).parents('td').hasClass("e-templatecell") )
            return true;
            if (!this.model.allowKeyboardNavigation || ((target.tagName == 'INPUT' || target.tagName == 'TEXTAREA') && this.model.keyConfigs[action].indexOf(",") == -1 && e.code != 13 && e.code != 27 && e.code != 9) || String.fromCharCode(e.code).toLowerCase() == this.element[0].accessKey.toLowerCase())
                return true;
            if ($(target).prop("type") == "checkbox" && (e.code != 13 && e.code != 9 && e.code!=27))
                return true;
            if (this.model.editSettings.editMode == "batch" && ((target.tagName == 'INPUT' || target.tagName == 'TEXTAREA') && e.code != 13 && e.code != 9 && e.code!=27) && ((target.selectionStart != 0 && action != "moveCellRight") || (target.selectionEnd != target.value.length && action != "moveCellLeft")))
				return true;
            if (this.model.allowFiltering && ($target.hasClass('e-filtertext') && e.code == 13) || ($target.hasClass('e-fltrbtn') && e.code == 13))
                return true;
            if ((this.model.editSettings.editMode == "dialog" || this.model.editSettings.editMode == "dialogtemplate") && $(target).closest("#" + this._id + "EditForm").length)
                return true;
            else if ($(target).parent().siblings("#" + this._id + "EditForm").length)
                return true;
            if (e.code == 13 && $target.parent().hasClass("e-unboundcelldiv"))
                return true;
            if (e.code == 13 && target.tagName == 'INPUT' && $target.closest("#" + this._id + "_search").length)
                action = "searchRequest";
            if (e.code == 13 && this._excelFilter != null && !ej.isNullOrUndefined(this._excelFilter._openedFltr) && this._excelFilter._openedFltr.length && this._excelFilter._openedFltr.is(":visible"))
                action = "excelfilter";
            if (e.code == 13 && $(target).hasClass("e-gridtoolbar")) {
                toolbarId = $target.find(".e-hover").attr("Id");
                action = "toolbarOperationRequest";
            }
            if ((action == "multiSelectionByRightArrow" && e.code == 39 && e.shift == true) || (action == "multiSelectionByLeftArrow" && e.code == 37 && e.shift == true)) {
                action = "multiSelectionByRLArrow";
            }
            if (!this.model.isEdit && action == "cancelRequest") {
                this.clearSelection();
                this.clearCellSelection();
				this.clearColumnSelection();
                return true;
            }
            if ($(target).find("input.e-dropdownlist").attr("aria-expanded") == "true" && this.model.isEdit && action == "saveRequest")
                return true;
            if (this.getPager() != null)
                var pager = this.getPager().ejPager("model"), pageIndex = pager.currentPage;
            var returnValue = false, curEl, $target = $(target);
            if ($target.closest(".e-grid").attr("Id") !== this._id)
                return;
            switch (action) {
                case "insertRecord":
                    if (ej.gridFeatures.edit && (!this.model.isEdit && (!this.model.editSettings.showAddNewRow && this.model.editSettings.editMode == "normal")))
                        this._toolbarOperation(this._id + "_add");
                    if(pageIndex == 0) pageIndex = 1;
                    break;
                case "toolbarOperationRequest":
                    this._toolbarOperation(toolbarId);
                    this.element.focus();
                    break;
                case "searchRequest":
                    this.search($target.val());
                    break;
                case "excelfilter":
                    var dlgID = this._id + this._excelFilter._$colType;
                    if (this._excelFilter._openedFltr.hasClass("e-dlgcustom"))
                        dlgID += "Custom";
                    this._excelFilter._openedFltr.find("#" + dlgID + "_OkBtn").trigger("click");
                    break;
                case "saveRequest":
                    if (ej.gridFeatures.edit) {
                        if (this.model.editSettings.editMode == "batch") {
                            var tr = $(this.getRowByIndex(this._bulkEditCellDetails.rowIndex))
                            ej.copyObject(this._copyBulkEditCellDetails, this._bulkEditCellDetails, true);
                            if(this.model.isEdit && tr.hasClass('e-insertedrow'))
                                this._batchCellValidation(this._bulkEditCellDetails.rowIndex);
                            this._moveCurrentCell("down");
                        }
                        else
                            this._toolbarOperation(this._id + "_update");
                            event.stopPropagation();
                    }
                    break;
                case "cancelRequest":
                    if (ej.gridFeatures.edit)
                        this._toolbarOperation(this._id + "_cancel");
                    break;
                case "deleteRecord":
                    if (ej.gridFeatures.edit)
                        this._toolbarOperation(this._id + "_delete");
                    break;
                case "editRecord":
                    if (ej.gridFeatures.edit && (!this.model.isEdit || (this.model.editSettings.showAddNewRow && this.model.editSettings.editMode == "normal")))
                        this._toolbarOperation(this._id + "_edit");
                    break;
                case "totalGroupCollapse":
                    if (ej.gridFeatures.group) {
                        this.collapseAll();
                        this.element.focus();
                    }
                    break;
                case "totalGroupExpand":
                    if (ej.gridFeatures.group) {
                        this.expandAll();
                        this.element.focus();
                    }
                    break;
                case "selectedGroupExpand":
                    if (ej.gridFeatures.group) {
                        this._$currentTr = $(this.getRows()).eq(this._selectedRow());
                        curEl = this._$currentTr.parents("tr").first().prev().find(".e-recordpluscollapse");
                        this.expandCollapse(curEl);
                    }
                    break;
                case "selectedGroupCollapse":
                    if (ej.gridFeatures.group) {
                        this._$currentTr = $(this.getRows()).eq(this._selectedRow());
                        curEl = this._$currentTr.parents("tr").first().prev().find(".e-recordplusexpand");
                        this.expandCollapse(curEl);
                    }
                    break;
                case "firstRowSelection":
                    if (ej.gridFeatures.selection)
                        this.selectRows(0);
                    break;
                case "lastRowSelection":
                    var lastRow;
                    if (ej.gridFeatures.selection)
                        if (this.model.scrollSettings.frozenColumns > 0 && !ej.isNullOrUndefined(this.getRows()[0]))
                            lastRow = $(this.getRows()[0]).length - 1;
                        else
                            lastRow = $(this._excludeDetailRows()).length - 1;
                        this.selectRows(lastRow);
                    break;
                case "rowUpSelection":
                    this.element.find(".e-row.e-hover,.e-alt_row.e-hover").removeClass("e-hover");
                    var index = this._traverseRow != null ? this._traverseRow : this._selectedRow();
                    if (index > 0) {
                        this._nextRow = index;
                        this._prevRow = index - 1;
                        var $removeHover = $(this.getContent().find("tr.e-traverse")[0]);
                        $removeHover.removeClass("e-traverse");
                        this.getRowByIndex(this._prevRow).addClass("e-traverse");
                        var selectedRows = this.getContent().find("tr.e-traverse");
                        this._traverseRow = this.getIndexByRow(selectedRows);
                    }
                    break;
                case "rowDownSelection":
                    this.element.find(".e-row.e-hover,.e-alt_row.e-hover").removeClass("e-hover");
                    var index = this._traverseRow != null ? this._traverseRow : this._selectedRow();
                    if ((index + 1 < this.model.currentViewData.length) || (this.model.scrollSettings.allowVirtualScrolling)) {
                        this._prevRow = index;
                        this._nextRow = index + 1;
                        var $removeHover = $(this.getContent().find("tr.e-traverse")[0]);
                        $removeHover.removeClass("e-traverse");
                        this.getRowByIndex(this._nextRow).addClass("e-traverse");
                        var selectedRows = this.getContent().find("tr.e-traverse");
                        this._traverseRow = this.getIndexByRow(selectedRows);
                    }
                    break;
                case "randomSelection":
                    this.element.find(".e-row.e-hover,.e-alt_row.e-hover").removeClass("e-hover");
                    if (this.model.selectionType == "multiple")
                        this.multiSelectCtrlRequest = true;
                    var selectedRows = this.getContent().find("tr.e-traverse");
                    this._traverseRow = this.getIndexByRow(selectedRows);
                    if (this._traverseRow != -1) {
                        if (this.model.selectionSettings.enableToggle && this.getSelectedRecords().length == 1 && $.inArray(this._traverseRow, this.selectedRowsIndexes) != -1)
                            this.clearSelection(selectedIndex);
                        else
                            this.selectRows(this._traverseRow);
                    }
                    this.getRowByIndex(index).removeClass("e-traverse");
                    this.multiSelectCtrlRequest = false;
                    break;
                case "upArrow":
                    this.multiSelectCtrlRequest = false;
                    this._traverseRow = null;
					if( this.model.isEdit && $target.hasClass('e-ddl'))
						break;
					if (ej.gridFeatures.selection && (this._selectedRow() != -1 || this._previousRowCellIndex != undefined) && (this.element.is(document.activeElement)|| this.element.find(document.activeElement).not(".e-gridtoolbar").length)) {
                        if ((target["type"] == "text" || target["type"] == "textarea" || target["type"] == "checkbox") && this.model.isEdit && this.model.editSettings.editMode != "batch")
                            return true;
                        if (this._selectedRow() > 0) {
                            var row = this.getRowByIndex(this._selectedRow() - 1);
                            !this._enableCheckSelect && this.selectRows(this._selectedRow() - 1, null, row);
                            if (this.model.editSettings.editMode == "batch" && !this.model.scrollSettings.enableVirtualization && $.inArray("cell", this.model.selectionSettings.selectionMode) == -1)
                                this._moveCurrentCell("up");
                        }
                        if (this._previousRowCellIndex && this._previousRowCellIndex.length != 0 && this._lastSelectedCellIndex[0][0] > 0 && this._allowcellSelection) {
                            this.selectCells([[this._lastSelectedCellIndex[0][0] - 1, this._lastSelectedCellIndex[0][1]]]);
                        }
                    }
                    break;
                case "downArrow":
                    this.multiSelectCtrlRequest = false;
                    this._traverseRow = null;
					if( this.model.isEdit && $target.hasClass('e-ddl'))
						break;
					if (ej.gridFeatures.selection && (this.element.is(document.activeElement)|| this.element.find(document.activeElement).not(".e-gridtoolbar").length)) {
                        if ((target["type"] == "text" || target["type"] == "textarea" || target["type"] == "checkbox") && this.model.isEdit && this.model.editSettings.editMode != "batch")
                            return true;
                        if(this._selectedRow() == -1)
							this.model.selectedRowIndex=0;
                        var lastRow = this._excludeDetailRows().length - 1;
                        if (this.model.scrollSettings.frozenColumns > 0 && !ej.isNullOrUndefined(this.getRows()[0]))
                            lastRow = this.getRows()[0].length - 1;
                        if (this._selectedRow() != lastRow && this._selectedRow() != -1) {
							var row = this._selectedRow() == 0 ? this.getRowByIndex(this._selectedRow()):this.getRowByIndex(this._selectedRow() - 1);
                            !this._enableCheckSelect && this.selectRows(this._selectedRow() + 1, null, row);
                            if (this.model.editSettings.editMode == "batch" && !this.model.scrollSettings.enableVirtualization && $.inArray("cell", this.model.selectionSettings.selectionMode) == -1) {
                                ej.copyObject(this._copyBulkEditCellDetails, this._bulkEditCellDetails, true);
                                this._moveCurrentCell("down");
                            }
                        }
                        if (this._previousRowCellIndex && this._previousRowCellIndex.length != 0 && this._lastSelectedCellIndex[0][0] < lastRow && this._allowcellSelection) {
                            this.selectCells([[this._lastSelectedCellIndex[0][0] + 1, this._lastSelectedCellIndex[0][1]]]);
                        }
                    }
                    break;
                case "rightArrow":
                    if (ej.gridFeatures.selection && this._allowcellSelection && (this.element.is(document.activeElement)|| this.element.find(document.activeElement).not(".e-gridtoolbar").length)) {
                        if ((target["type"] == "text" || target["type"] == "textarea" || target["type"] == "checkbox") && this.model.isEdit && this.model.editSettings.editMode != "batch")
                            return true;
                        var row, rowIndex, columnIndex;
                        rowIndex = this._lastSelectedCellIndex[0][0];
                        row = this.getRowByIndex(rowIndex);
                        columnIndex = this._lastSelectedCellIndex[0][1][0];
                        if (ej.isNullOrUndefined(columnIndex))
                            columnIndex = this._lastSelectedCellIndex[0][1];
                        cellIndex = $(row.find("td:gt(" + columnIndex + ")").not(".e-hide")[0]).index();
                        if (cellIndex == -1) {
                            rowIndex = rowIndex + 1;
                            row = this.getRowByIndex(rowIndex);
                            cellIndex = $(row.find("td").not(".e-hide")[0]).index();
                        }
                        if (rowIndex != -1 && cellIndex != -1)
                            this.selectCells([[rowIndex, [cellIndex]]]);
                    }
                    break;
                case "leftArrow":
                    if (ej.gridFeatures.selection && this._allowcellSelection && (this.element.is(document.activeElement)|| this.element.find(document.activeElement).not(".e-gridtoolbar").length)) {
                        if ((target["type"] == "text" || target["type"] == "textarea" || target["type"] == "checkbox") && this.model.isEdit && this.model.editSettings.editMode != "batch")
                            return true;
                        var row, rowIndex, columnIndex, cellIndex, Index;
                        rowIndex = this._lastSelectedCellIndex[0][0];
                        row = this.getRowByIndex(rowIndex);
                        var columnIndex = this._lastSelectedCellIndex[0][1];
                        Index = row.find("td:lt(" + columnIndex + ")").not(".e-hide").length - 1;
                        cellIndex = $(row.find("td:lt(" + columnIndex + ")").not(".e-hide")[Index]).index();
                        if (cellIndex == -1) {
                            rowIndex = rowIndex - 1;
                            row = this.getRowByIndex(rowIndex);
                            Index = row.find("td:lt(" + this.model.columns.length + ")").not(".e-hide").length - 1;
                            cellIndex = $(row.find("td:lt(" + this.model.columns.length + ")").not(".e-hide")[Index]).index();
                        }
                        if (rowIndex != -1 && cellIndex != -1)
                            this.selectCells([[rowIndex, [cellIndex]]]);
                    }
                    break;
                case "firstCellSelection":
                    if (ej.gridFeatures.selection && this._allowcellSelection) {
                        if ((target["type"] == "text" || target["type"] == "textarea" || target["type"] == "checkbox") && this.model.isEdit && this.model.editSettings.editMode != "batch")
                            return true;
                        var lastRow = $(this.getRows()).length - 1;
                        lastRow > -1 && this.selectCells([[0, [0]]]);
                    }
                    break;
                case "lastCellSelection":
                    var lastRow;
                    if (ej.gridFeatures.selection && this._allowcellSelection) {
                        if ((target["type"] == "text" || target["type"] == "textarea" || target["type"] == "checkbox") && this.model.isEdit && this.model.editSettings.editMode != "batch")
                            return true;
                        if (this.model.scrollSettings.frozenColumns > 0 && !ej.isNullOrUndefined(this.getRows()[0]))
                            lastRow = this.getRows()[0].length - 1;
                        else
                            lastRow = $(this._excludeDetailRows()).length - 1;
                        lastRow > -1 && this.selectCells([[lastRow, [this.model.columns.length - 1]]]);
                    }
                    break;
                case "nextPage":
                    if (this.getPager() != null)
                        pageIndex = pageIndex + 1;
                    if (!ej.isIOSWebView() && this.getBrowserDetails().browser == "msie")
                        this.element.focus();
                    break;
                case "previousPage":
                    if (this.getPager() != null)
                        pageIndex = pageIndex - 1;
                    if (!ej.isIOSWebView() && this.getBrowserDetails().browser == "msie")
                        this.element.focus();
                    break;
                case "lastPage":
                    if (this.getPager() != null)
                        pageIndex = pager.totalPages;
                    break;
                case "firstPage":
                    if (this.getPager() != null)
                        pageIndex = 1;
                    break;
                case "nextPager":
                    if (this.getPager() != null)
                        pageIndex = Math.ceil(pager.currentPage / pager.pageCount) * pager.pageCount + 1;
                    break;
                case "previousPager":
                    if (this.getPager() != null)
                        pageIndex = (Math.floor(pager.currentPage / pager.pageCount) - 1) * pager.pageCount + 1;
                    break;
                case "moveCellLeft":
                    if (this.model.editSettings.editMode == "batch"){
						this._tabKey = true;
						returnValue = this._moveCurrentCell("left", event);
					}
                    else
                        returnValue = true;
                    if (e.code == 9 && $.inArray("cell", this.model.selectionSettings.selectionMode) != -1)
                        this.selectCells([[this._bulkEditCellDetails.rowIndex, this._bulkEditCellDetails.columnIndex]]);
                    break;
                case "moveCellRight":
                    if (this.model.editSettings.editMode == "batch" && $target){
						this._tabKey = true;
						returnValue = this._moveCurrentCell("right", event);
					}
                    else
                        returnValue = true;
                    if (e.code == 9 && $.inArray("cell", this.model.selectionSettings.selectionMode) != -1)
                        this.selectCells([[this._bulkEditCellDetails.rowIndex, this._bulkEditCellDetails.columnIndex]]);
                    break;
                case "multiSelectionByDownArrow":
                    if (ej.gridFeatures.selection && (this._selectedRow() != -1 || this._previousRowCellIndex != undefined)) {
                        var lastRow = this._excludeDetailRows().length - 1, $target = this.element.find('.e-gridcontent').find('.e-rowcell');
                        if (this.model.scrollSettings.frozenColumns > 0 && !ej.isNullOrUndefined(this.getRows()[0]))
                            lastRow = this.getRows()[0].length - 1;
                        this.multiSelectShiftRequest = true;
                        if (this._allowcellSelection && this._lastSelectedCellIndex[0][0] <= lastRow && this._lastSelectedCellIndex[0][0] != -1) {
                            var rowIndex, columnIndex;
                            rowIndex = this._lastSelectedCellIndex[0][0] + 1;
                            columnIndex = parseInt(this._lastSelectedCellIndex[0][1]);
                            if (rowIndex <= lastRow)
                                this.selectCells([[rowIndex, [columnIndex]]])
                        }
                        this.multiSelectShiftRequest = false;
                        if (this._selectedRow() <= lastRow && this._selectedRow() != -1) {
                            var selectedRow = this._selectedRow() + 1, fromIndex = this._previousIndex;
                            this.multiSelectShiftRequest = true;
                            this.selectRows(fromIndex, selectedRow, $target);
                            this.multiSelectShiftRequest = false;
                            if ((selectedRow - 1) == lastRow) {
                                this.selectRows(fromIndex, lastRow);
                                selectedRow = lastRow;
                            }
                        }
                        this._selectedRow(selectedRow);
                        this._previousIndex = fromIndex;
                    }
                    this.model.editSettings.editMode == "batch" && this.element.focus();
                    break;
                case "multiSelectionByUpArrow":
                    var firstRow = 0;
                    if (ej.gridFeatures.selection && (this._selectedRow() != -1 || this._previousRowCellIndex != undefined)) {
                        var lastRow = this._excludeDetailRows().length - 1, $target = this.element.find('.e-gridcontent').find('.e-rowcell');
                        this.multiSelectShiftRequest = true;
                        if (this._allowcellSelection && this._lastSelectedCellIndex[0][0] <= lastRow && this._lastSelectedCellIndex[0][0] != -1) {
                            var rowIndex, columnIndex;
                            rowIndex = this._lastSelectedCellIndex[0][0] - 1;
                            columnIndex = parseInt(this._lastSelectedCellIndex[0][1]);
                            if (rowIndex != -1)
                                this.selectCells([[rowIndex, [columnIndex]]])
                        }
                        this.multiSelectShiftRequest = false;
                        if (this._selectedRow() >= 0 && this._selectedRow() >= -1) {
                            var selectedRow = this._selectedRow() - 1, fromIndex = this._previousIndex;
                            this.multiSelectShiftRequest = true;
                            this.selectRows(fromIndex, selectedRow, $target);
                            this.multiSelectShiftRequest = false;
                            if (selectedRow < 0) {
                                this.selectRows(fromIndex, firstRow);
                                selectedRow = firstRow;
                            }
                        }
                        this._selectedRow(selectedRow);
                        this._previousIndex = fromIndex;
                    }
                    this.model.editSettings.editMode == "batch" && this.element.focus();
                    break;
                case "multiSelectionByRLArrow":
                    if (ej.gridFeatures.selection && this._allowcellSelection && (this.element.is(document.activeElement) || this.element.find(document.activeElement).not(".e-gridtoolbar").length)) {
                        if ((target["type"] == "text" || target["type"] == "textarea" || target["type"] == "checkbox") && this.model.isEdit && this.model.editSettings.editMode != "batch")
                            return true;
                        var row, rowIndex, columnIndex, cellIndex, Index;;
                        this.multiSelectShiftRequest = true;
                        rowIndex = this._lastSelectedCellIndex[0][0];
                        row = this.getRowByIndex(rowIndex);
                        if (e.code == 37 && e.shift == true) {
                            columnIndex = this._lastSelectedCellIndex[0][1];
                            Index = row.find("td:lt(" + columnIndex + ")").not(".e-hide").length - 1;
                            cellIndex = $(row.find("td:lt(" + columnIndex + ")").not(".e-hide")[Index]).index();
                            if (cellIndex == -1) {
                                rowIndex = rowIndex - 1;
                                row = this.getRowByIndex(rowIndex);
                                Index = row.find("td:lt(" + this.model.columns.length + ")").not(".e-hide").length - 1;
                                cellIndex = $(row.find("td:lt(" + this.model.columns.length + ")").not(".e-hide")[Index]).index();
                            }
                        }
                        else {
                            columnIndex = this._lastSelectedCellIndex[0][1][0];
                            if (ej.isNullOrUndefined(columnIndex))
                                columnIndex = this._lastSelectedCellIndex[0][1];
                            cellIndex = $(row.find("td:gt(" + columnIndex + ")").not(".e-hide")[0]).index();
                            if (cellIndex == -1) {
                                rowIndex = rowIndex + 1;
                                row = this.getRowByIndex(rowIndex);
                                cellIndex = $(row.find("td").not(".e-hide")[0]).index();
                            }
                        }
                        if (rowIndex != -1 && cellIndex != -1)
                            this.selectCells([[rowIndex, [cellIndex]]]);
                        this.multiSelectShiftRequest = false;
                    }
                    break;
                default:
                    returnValue = true;
            }
            if (this.getPager() != null && pageIndex <= pager.totalPages && pager.currentPage !== pageIndex && action != "searchRequest" && action !== "deleteRecord")
                this.getPager().ejPager("goToPage", pageIndex);
            return returnValue;
        },
        _findColumnsWidth: function () {
            var j = this.getHeaderTable().find(".e-headercell").not(".e-stackedHeaderCell, .e-detailheadercell"), index = 0;           
            for (var i = 0; i < this.model.columns.length; i++) {
                if (this.model.columns[i]["visible"])
                    this.columnsWidthCollection[i] = j.eq(i + index).outerWidth();
            }
        },
        _calculateWidth: function () {
            var j = this.getHeaderTable().find(".e-columnheader").last().find("th:visible"), width = 0;
            for (var i = 0; i < j.length; i++)
                width += j.eq(i).outerWidth();
            return width;

        },
        _initIndicators: function () {
            var indicatorId = this._id + "_ColumnDropIndicator";
            if ($("#" + indicatorId).length)
                $("#" + indicatorId).remove();
            this._Indicator = document.createElement("DIV");
            $(this._Indicator).attr('id', indicatorId).addClass("e-columndropindicator").addClass("e-dropAcceptor").appendTo(document.body);
            $(this._Indicator).css({ "display": "none" });

        },
        _refreshGridFooterColGroup: function () {
            this.getFooterTable().find("colgroup").remove();
            this._scrollFooterColgroup();
        },
        _refreshGroupSummary: function () {
            var headerCols = this.getHeaderContent().find("colgroup col").clone();
            headerCols.splice(0, this.model.groupSettings.groupedColumns.length);
            var $gsColgroup = this.getContentTable().find(".e-groupsummary colgroup");
            for (var i = 0; i < $gsColgroup.length; i++) {
                if (!$($gsColgroup[i]).find(".e-summary").is("visible"))
                    $($gsColgroup[i]).find(".e-summary").show();
                $($gsColgroup[i]).find("col:not('.e-summary')").remove();
                $($gsColgroup[i]).append(headerCols.clone());
            }
        },
        
        reorderColumns: function (fromfname, tofname) {
            var fromindex, toindex;
            if (typeof (fromfname) == "string" && typeof (tofname) == "string") {
                fromindex = this.getColumnIndexByField(fromfname);
                toindex = this.getColumnIndexByField(tofname);
            }
            else {
                fromindex = fromfname;
                toindex = tofname;
            }
            if (fromindex == -1 || toindex == -1 || typeof (fromindex) == "string" || typeof (toindex) == "string") return;
            this.set_dropColumn(fromindex, toindex);
            if (this.model.showStackedHeader)
                this._refreshStackedHeader();
            if (this.model.scrollSettings.allowVirtualScrolling){
				if(this.model.scrollSettings.enableVirtualization){
					this._virtualDataRefresh = true;
					this._queryCellView = [];
					this._virtualLoadedRows = {};
					this._refreshVirtualView(this._currentVirtualIndex);								
				}
				else
					this._refreshVirtualContent(); 
			}
        },
        
        columns: function (details, action) {
            if (ej.isNullOrUndefined(details)) return;
            var isString = false;
            if (typeof details === "string") {
                details = [details];
                isString = true;
            }
            else if (details instanceof Array && details.length && typeof details[0] === "string")
                isString = true;
            for (var i = 0; i < details.length; i++) {
                var field = isString ? details[i] : details[i].field, headerText = isString ? details[i] : details[i].headerText, index;
                if ((ej.isNullOrUndefined(field) || field == "") && (ej.isNullOrUndefined(headerText) || headerText == ""))
                    index = -1;
                else if (ej.isNullOrUndefined(field) || field == "")
                    index = $.inArray(this.getColumnByHeaderText(headerText), this.model.columns);
                else
                    index = $.inArray(this.getColumnByField(field), this.model.columns);
                if (action == "add" || ej.isNullOrUndefined(action)) {
                    if (index == -1)
                        this.model.columns.push(isString ? { field: details[i] } : details[i]);
                    else
                        this.model.columns[index] = isString ? { field: details[i] } : details[i];
                }
                else {
                    if (index != -1)
                        this.model.columns.splice(index, 1);
                }
            }            
            this.columnsWidthCollection = []; var tooltip = false;
            for (var columnCount = 0; columnCount < this.model.columns.length; columnCount++) {
                this.columnsWidthCollection.push(this.model.columns[columnCount]["width"]);
                if (!ej.isNullOrUndefined(tooltip))
                    tooltip = true;
            }
            this._enableRowHover(tooltip);
            this.refreshHeader();
			if (this.model.editSettings.allowEditing || this.model.editSettings.allowAdding) 
				this._processEditing();
            this.refreshContent(true);
            if (this.model.allowScrolling) {
                this.refreshScrollerEvent();
                if (this.model.allowResizeToFit && this.getContent().ejScroller("isVScroll"))
                    this._showHideScroller();
            }
        },
        _resetDisabledCollections: function(){
            this._disabledResizingColumns = [];
			this._disabledSortableColumns = [];
			this._disabledGroupableColumns = [];
			this._disabledEditableColumns = [];
        },
        _enableRowHover: function (isTooltip) {
            var tooltip = true;
            if (ej.isNullOrUndefined(isTooltip)) {
                for (var i = 0 ; i < this.model.columns.length; i++) {
                    if (!ej.isNullOrUndefined(this.model.columns[i]['tooltip'])) {
                        tooltip = true;
                        break;
                    }
                }
            }
            else
                tooltip = isTooltip;
            if (this.model.enableRowHover || tooltip)
                this._on(this.element, "mouseenter mouseleave", ".e-gridcontent tr td", this._rowHover);
            else
                this._off(this.element, "mouseenter mouseleave", ".e-gridcontent tr td");
        },
        _rowHover: function (e) {
            var $target = $(e.target);
            if (!$target.hasClass("e-rowcell"))
                $target = $target.closest(".e-rowcell");
            if (this.model.scrollSettings.frozenColumns)
                var $gridRows = $(this.getRows());
            else
                var $gridRows = this.element.find(".e-row.e-hover,.e-alt_row.e-hover");
            if (($target.closest("#" + this._id + "EditForm").length && $target.hasClass("e-rowcell")) || !$target.hasClass("e-rowcell"))
                return;
            if (e.type == "mouseenter" && $target.hasClass("e-gridtooltip"))
                this._showTooltip($target);
            if (this.model.enableRowHover) {
                this.element.find(".e-traverse").removeClass("e-traverse");
                this._traverseRow=null;
                if (e.type == "mouseenter" && !this._dragActive) {
                     if (this.model.scrollSettings.frozenColumns > 0 && !ej.isNullOrUndefined($gridRows[0]) && !ej.isNullOrUndefined($gridRows[1]))	
					 {
						$gridRows = $($gridRows[0]).add($gridRows[1]);
						$gridRows.removeClass("e-hover");
						var index = this.getIndexByRow($target.parent());
						index != -1 && this.getRowByIndex(index).addClass("e-hover");
					}
                 else {
                     $gridRows.removeClass("e-hover");
                     if( $target.parent().hasClass('e-row') ||$target.parent().hasClass ('e-alt_row'))
                         $target.parent().addClass("e-hover");
					}
                } else {
                    if (this.model.scrollSettings.frozenColumns > 0 && !ej.isNullOrUndefined($gridRows[0]) && !ej.isNullOrUndefined($gridRows[1]))
                        $gridRows = $($gridRows[0]).add($gridRows[1]);
                    $gridRows.removeClass("e-hover");
                }
                var gridRows = $target.parent();
                var index = this.getIndexByRow(gridRows);
                var data = this._currentJsonData[index];
                if (this.model.scrollSettings.allowVirtualScrolling && !this.model.scrollSettings.enableVirtualization) {
                    index = (index % this.model.pageSettings.pageSize);
                    data = this._currentJsonData[index];
                }
                else if (this.model.scrollSettings.enableVirtualization) {
                    var viewDetails = this._getSelectedViewData(index, $target);
                    data = viewDetails.data;
                    index = viewDetails.rowIndex;
                }
                var args = { row: gridRows, rowIndex: index, rowData: data, cell: $target };
                this._trigger("rowHover", args);
            }
            return false;
        },
        _showTooltip: function ($target, isHeaderTooltip) {
            var index = $target.index(), isStack = $target.hasClass("e-stackedHeaderCell"), data = {};
            if ($target.hasClass("e-headercelldiv"))
                index = $target.parent(".e-headercell").index() - this.model.groupSettings.groupedColumns.length;
            if (!isStack && (this.model.childGrid || this.model.detailsTemplate))
                index--;
            if (this.model.scrollSettings.frozenColumns > 0 && ($target.closest(".e-movableheaderdiv").length || $target.closest(".e-movablecontentdiv").length))
                index = index + this.model.scrollSettings.frozenColumns;
            var col =  !isStack ? this.getColumnByIndex(index) : this._getStackedColumnByTarget($target);            
            if (col["clipMode"] != ej.Grid.ClipMode.Ellipsis) {
                if (col["clipMode"] == ej.Grid.ClipMode.EllipsisWithTooltip) {
                    var td = $target;
                    if (!$target.find("span").hasClass("e-ellipsistooltip")) {
                        var $span = ej.buildTag('span.e-ellipsistooltip', {}, {})
                        $span.html($target.html());
                        td.append($span);
                    }
                    td.find('span.e-ellipsistooltip').css('display', 'inline-block')
                    var width = td.find('span:first')[0].getBoundingClientRect().width;
                    td.find('span.e-ellipsistooltip').remove();
                    if ($target.width() > (width)) {
                        $target.removeAttr('title');
                        return;
                    }
                }

                var scriptElement = document.createElement("script");
                if (ej.isNullOrUndefined(col["tooltip"]) && ej.isNullOrUndefined(col["headerTooltip"]))
                    return;
                else {
                    var t;
                    scriptElement.id = (this._id + col.headerText + $.inArray(col, this.model.columns) + "_TemplateToolTip").split(" ").join("");
                    scriptElement.type = "text/x-template";
                    var tooltipType = !isHeaderTooltip ? "tooltip" : "headerTooltip";
                    if (!ej.isNullOrUndefined(col[tooltipType]) && col[tooltipType].slice(0, 1) !== "#")
                        scriptElement.text = col[tooltipType];
                    else
                        t = $(col[tooltipType]);
                    if (t) {
                        scriptElement.text = t.html();
                        scriptElement.type = t.attr("type") || scriptElement.type;
                    }
                   if(!ej.isNullOrUndefined(t) && col[tooltipType].slice(0, 1) !== "#")
                    $("body").append(scriptElement);
                }
                var rowElement = $target.closest("tr");
                if (!$(rowElement).hasClass("e-columnheader") && !$target.hasClass("e-gridheader")) {
                    var index = this.getIndexByRow(rowElement);//get the target rowIndex
                    if (this.model.allowScrolling && this.model.scrollSettings.allowVirtualScrolling) {
                        if (!this.model.scrollSettings.enableVirtualization)
                            index = index % this.model.pageSettings.pageSize;
                        else {
                            var nameAttr = rowElement.attr("name");
                            index = index % this._virtualRowCount;
                            var virtualIndex = parseInt(nameAttr, 32);
                            data = this._virtualLoadedRecords[virtualIndex][index];
                        }
                    }
                    else
                        data = this.getCurrentViewData()[index];//get the data corresponding to row hovered
                }
                data.value = !$target.hasClass("e-headercell") || isStack ? $target.text() : $target.find("e-gridheadertooltip").text();
                var str = $(scriptElement).render(data);
                $target.attr('title', str);
                if (!ej.isNullOrUndefined(data.value))
                    delete data.value;
            }
            else
                $target.removeAttr('title');

        },
        _rightClickHandler: function (e) {
            e.preventDefault(); var browser = ej.browserInfo();
            if (e.which == 3 || (browser.name == "msie" && browser.version == "8.0")) {
                var args = {},
                $target = $(e.target),
                $gridRow = $(this.getRows());
                if (this.getContentTable().has($target).length) {
                    var index = $gridRow.index($target.parent());					
					var $row = this.getRowByIndex(index);
					var $data = this._currentJsonData[index];
					if(this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization){	
						var viewDetails = this._getSelectedViewData(index, $target);					
						$data = viewDetails.data;				
						index = viewDetails.rowIndex;					
					}
                    if (index == -1)
                        return;
                    args = { rowIndex: index, row: $row, data: $data, rowData: $data, cellIndex: $target.index(), cellValue: $target.html(), cell: $target };
                }
                else if (this.getHeaderTable().has($target).length) {
                    var index = 0,
                    $th = this.getHeaderTable().find('th').not('.e-detailheadercell,.e-grouptopleftcell,.e-filterbarcell');
                    if ($target.is('.e-headercelldiv'))
                        index = $th.index($target.closest('.e-headercell'));
                    else
                        index = $th.index($target);
                    if (index == -1)
                        return;
                    args = { headerIndex: index, headerText: this.getColumnFieldNames()[index], headerCell: $th.eq(index), column: this.getColumnByIndex(index) }
                }
                else if ($target.is('.e-pager') || (this.getPager() != null && this.getPager().has($target).length)) {
                    args = { pager: this.model.pageSettings }
                }
                this._trigger("rightClick", args);
            }
        },
        _touchGrid: function (e) {
            var curPage = this._currentPage(), doPage = true;
            if (this.model.allowScrolling || (this.model.isResponsive && this.model.minWidth != 0)) {
                var d = !ej.isNullOrUndefined(this.getContent().data("ejScroller")) ? (this.getScrollObject() || {})._scrollXdata : null;
                if (d)
                    doPage = e.type == "swipeleft" ? d.scrollable - d.sTop == 0 : d.sTop == 0;
            }
            switch (e.type) {
                case "swipeleft":
                    if (this.model.allowPaging && curPage != this.model.pageSettings.totalPages && !this.model.isEdit)
                        doPage && this.element.ejGrid("gotoPage", curPage + 1);
                    break;
                case "swiperight":
                    if (this.model.allowPaging && curPage > 1 && !this.model.isEdit)
                        doPage && this.element.ejGrid("gotoPage", curPage - 1);
                    break;
            }
        },
        _recorddblClickHandler: function (e) {
             if(!ej.isNullOrUndefined(this._previousTr)){
                var isFrozenEnabled, $target = (isFrozenEnabled = this._previousTr.length > 1) ? this.getRowByIndex($(e.target).closest("tr").index()) :  $(e.target).closest("tr");
                if( isFrozenEnabled && $target[0] != this._previousTr[0] && $target[1] != this._previousTr[1])
                    return;
                else if($target[0] != this._previousTr[0])
                        return;
            }
            this._recordClickProcess(e, this, "recordDoubleClick");
        },
        _recordClickProcess: function (e, proxy, eventName) {
            var args = {}, $target = $(e.target).is(".e-rowcell") ? $(e.target) : $(e.target).closest("td");
            if ($target.closest(".e-grid").attr("id") !== proxy._id || (!$target.is('.e-rowcell') && !$target.closest("td").is(".e-rowcell")) || ($target.closest('.e-editcell,.e-insertedrow')).length > 0)
                return;
            var cellIndx = (proxy.model.detailsTemplate != null || proxy.model.childGrid != null) ? $target.index() - 1 : $target.index();
            var column = proxy.getColumnByIndex(cellIndx);
            if (proxy.model.editSettings.editMode == "batch" && !(column.allowEditing == false) && !(column.isPrimaryKey == true))
                return;
            var index = proxy.getIndexByRow($target.closest('tr'));
            var $row = proxy.getRowByIndex(index);
            var $data = proxy._currentJsonData[index];
            if (proxy.model.scrollSettings.allowVirtualScrolling) {
                if (proxy.model.scrollSettings.enableVirtualization) {
                    var viewDetails = proxy._getSelectedViewData(index, $target);
                    $data = viewDetails.data;
                    index = viewDetails.rowIndex;
                }
                else {
                    var trIndex = index % proxy.model.pageSettings.pageSize;
                    var virtualIndex = (parseFloat($row.attr("name")) - (this.model.scrollSettings.enableVirtualization ? 1 : 0)) / proxy.model.pageSettings.pageSize + 1;
                    var vs = ej.isNullOrUndefined(ej.getObject(virtualIndex,this._virtualLoadedRecords)) ? this.model.previousViewData : ej.getObject(virtualIndex,this._virtualLoadedRecords);
					$data =(!ej.isNullOrUndefined(vs) ? vs[trIndex] : this._currentJsonData[trIndex]);
                }
            }
            args = { rowIndex: index, row: $row, data: $data, rowData: $data, cell: $target, cellIndex: cellIndx, columnName: column["headerText"], cellValue: $target.text(),event:e };
            proxy._previousTr = args.row;
            proxy._trigger(eventName, args);
        },
        _invokeRecordClick: function (e, proxy) {
            this._recordClickProcess(e, proxy, "recordClick");
        },
        _recordClick: function (e) {
            this._click++;
            var proxy = this, singleClickTimer = null;
            if (proxy._click == 1) {
                if ($.inArray("recordClick", this.model.serverEvents) !== -1 && $.inArray("recordDoubleClick", this.model.serverEvents) !== -1) {
                    singleClickTimer = setTimeout(function () {
                        proxy._click = 0;
                        proxy._invokeRecordClick(e, proxy);
                    }, 400);
                }
                else {
					proxy._click = 0;
                    !ej.isNullOrUndefined(singleClickTimer) && clearTimeout(singleClickTimer);
                    proxy._invokeRecordClick(e, proxy);
                }
            }
            else if (proxy._click == 2) {
                !ej.isNullOrUndefined(singleClickTimer) && clearTimeout(singleClickTimer);
                proxy._click = 0;
            }
        },
        _headerMouseDown: function (e) {
            if (($(e.target).hasClass("e-headercelldiv") && !$(e.target).parent().hasClass("e-grouptopleftcell")) || $(e.target).hasClass("e-headercell")) {
                var $headercell = $(e.target).hasClass("e-headercelldiv") ? $(e.target).parent() : $(e.target);
                this.model.enableHeaderHover && $headercell.removeClass("e-hover e-headercell-hover").addClass("e-headercellactive e-active");
            }
            if (this.model.allowResizing)
                return this._resizer._mouseDown(e);
        },
        _contentMouseDown: function (e) {
            if ($(e.target).closest("td").hasClass("e-selectionbackground"))
                return;
            if ($(e.target).closest("tr").length) {
                var xPos = e.type == "touchstart" ? e.originalEvent.touches[0].pageX : e.pageX;
                var yPos = e.type == "touchstart" ? e.originalEvent.touches[0].pageY : e.pageY;
                this._dragDiv = ej.buildTag("div.e-griddragarea", "", { "position": "absolute", "width": "0px", "height": "0px" })
                this.getContent().append(this._dragDiv);
                var tr = $(e.target).closest("tr.e-row");
                if (!tr.length)
                    tr = $(e.target).closest("tr.e-alt_row");
                this._startIndex = tr.length ? this.getIndexByRow(tr) : null;
                this._previousRowCellIndex = [[this._startIndex, [e.target.cellIndex]]];
                this._on($(document), "touchmove mousemove", this._mouseMoveDragHandler);
                if (!ej.isIOSWebView() && this.getBrowserDetails().browser == "safari") {
                    if (!this.model.contextMenuSettings.enableContextMenu)
                        this._on(this.element, "contextmenu", function (e) { e.preventDefault() });
                }
                this._on($(document), "touchend mouseup", this._mouseUpDragHandler);
                this._startDrag = { _x: xPos, _y: yPos };
            }
        },
        _mouseMoveDragHandler: function (e) {
            if (e.pageY != this._startDrag._y) {
                var xPos = e.type == "touchmove" ? e.originalEvent.touches[0].pageX : e.pageX;
                var yPos = e.type == "touchmove" ? e.originalEvent.touches[0].pageY : e.pageY;
                this._selectDrag = true;
                var left = this._dragDiv[0].offsetLeft;
                var top = this._dragDiv[0].offsetTop;

                var x1 = this._startDrag._x,
                y1 = this._startDrag._y,
                x2 = xPos,
                y2 = yPos, tmp, eleLocation = yPos + 2;

                if (x1 > x2) { tmp = x2; x2 = x1; x1 = tmp; }
                if (y1 > y2) { tmp = y2; y2 = y1; y1 = tmp; eleLocation = yPos - 2 }
                var height = this._dragDiv.height();
                this._dragDiv.css({ left: x1, top: y1, width: x2 - x1, height: y2 - y1 });
                var element = $(document.elementFromPoint(xPos, eleLocation));
                var tr = element.closest("tr.e-row");
                if (!tr.length)
                    tr = element.closest("tr.e-alt_row");
                if (tr.length) {
                    this._endIndex = this.getIndexByRow(tr);
                    if (ej.isNullOrUndefined(this._startIndex))
                        this._startIndex = this._endIndex;
                    this.selectRows(this._startIndex, this._endIndex);
                    this.selectCells([[this._endIndex, [element.index()]]]);
                }
            }
        },
        _mouseUpDragHandler: function (e) {
            this._off($(document), "touchend mouseup", this._mouseUpDragHandler);
            this._off($(document), "touchmove mousemove", this._mouseMoveDragHandler);
            if (!ej.isIOSWebView() && this.getBrowserDetails().browser == "safari") {
                if (!this.model.contextMenuSettings.enableContextMenu)
                    this._off(this.element, "contextmenu", function (e) { e.preventDefault() })
            }
            e.stopPropagation();
            this._selectDrag = false;
            this._dragDiv.remove();
        },
        _headerHover: function (e) {
            var $target = $(e.target);
            if (e.type == "mouseover" || e.type == "mousemove" || e.type == "touchmove" || e.type == "MSPointerMove") {
                if (this.model.allowResizing || this.model.allowResizeToFit)
                    this._resizer._mouseHover(e);

                if (this.model.enableHeaderHover && !this._dragActive && (($target.hasClass("e-headercelldiv") && !$target.parent().hasClass("e-grouptopleftcell")) || $target.hasClass("e-headercell"))) {
                    if ($target.hasClass("e-headercelldiv"))
                        $target = $target.parent();
                    this.getHeaderTable().find(".e-columnheader").find(".e-headercell-hover").removeClass("e-headercell-hover").removeClass("e-hover");
                    $target.addClass("e-headercell-hover e-hover");
                }
                if ($target.hasClass("e-gridtooltip"))
                    this._showTooltip($target);
                if ($target.hasClass("e-gridheadertooltip") || $target.find(".e-gridheadertooltip").length)
                    this._showTooltip($target, true);
                if (e.type == "mouseover")
                    this._addCursor();
            } else
                this.model.enableHeaderHover && this.getHeaderTable().find(".e-columnheader").find(".e-headercell-hover").removeClass("e-headercell-hover").removeClass("e-hover");
        },
        _addCursor: function () {
            var flag = (this.model.allowResizing || this.model.allowResizeToFit || this.model.allowGrouping || this.model.allowFiltering || this.model.allowSorting || this.model.allowReordering || this.model.contextMenuSettings.enableContextMenu || this._allowcolumnSelection), isTempCol;
            if (!flag) {
                this.getHeaderTable().find(".e-columnheader").addClass("e-defaultcursor");
                this.getHeaderTable().find(".e-headercell").removeClass("e-defaultcursor");
            }
            else {
                this.getHeaderTable().find(".e-columnheader").removeClass("e-defaultcursor");
                if (!(this.model.contextMenuSettings.enableContextMenu || this.model.selectionSettings.selectionMode == "column")) {
                    var propArray = [{ val: this.model.allowSorting, str: "sort" }, { val: this.model.allowGrouping, str: "group" }, { val: this.model.allowReordering, str: "reorder" }, { val: this.model.allowFiltering, str: "filter" },{ val: this.model.allowResizing, str: "resize" }];
                    var colpropcount = 0;
                    for (var i = 0; i < propArray.length; i++) {
                        if (propArray[i].val == false) {
                            propArray.splice(i, 1);
                            i--;
                        }
                    }

                    for (i = 0; i < this.model.columns.length && propArray.length > 0 ; i++) {
                        for (var j = 0; j < propArray.length; j++) {
                            switch (propArray[j].str) {
                                case "sort":
                                    if (!ej.isNullOrUndefined(this.model.columns[i].allowSorting) && !this.model.columns[i].allowSorting)
                                        colpropcount++;
                                    break;
                                case "group":
                                    if (!ej.isNullOrUndefined(this.model.columns[i].allowGrouping) && !this.model.columns[i].allowGrouping)
                                        colpropcount++
                                    break;
                                case "reorder":
                                    if (!ej.isNullOrUndefined(this.model.columns[i].allowReordering) && !this.model.columns[i].allowReordering)
                                        colpropcount++
                                    break;
                                case "filter":
                                    if (!ej.isNullOrUndefined(this.model.columns[i].allowFiltering) && !this.model.columns[i].allowFiltering)
                                        colpropcount++;
                                    break;
								case "resize":
								    if (!ej.isNullOrUndefined(this.model.columns[i].allowResizing) && !this.model.columns[i].allowResizing)
                                        colpropcount++;
									break;
                            }
                        }
						if(!ej.isNullOrUndefined(this.model.columns[i].template) || !ej.isNullOrUndefined(this.model.columns[i].templateID))
							isTempCol = true;
						else 
							isTempCol = false;
						if (colpropcount == propArray.length && !(isTempCol))
                            this.getHeaderTable().find(".e-headercell").eq(i).addClass("e-defaultcursor");
                        colpropcount = 0;
                    }
                }
            }
        },
        _colgroupRefresh: function () {
            if ((this.model.allowResizing || this.model.allowResizeToFit) && this.model.scrollSettings.frozenColumns > 0) {
                var gridheaderCol = $(this.getHeaderTable()).find('colgroup');
                var gridcontentCol = $(this.getContentTable()).find('colgroup');
            }
            else {
                var gridheaderCol = $(this.getHeaderTable()).find('colgroup')[0];
                var gridcontentCol = $(this.getContentTable()).find('colgroup')[0];
            }
            var headerColClone = $(gridheaderCol).clone();
            var contentColClone = $(gridcontentCol).clone();
            $(gridcontentCol).remove();
            $(gridheaderCol).remove();
            if ((this.model.allowResizing || this.model.allowResizeToFit) && this.model.scrollSettings.frozenColumns > 0) {
                $(headerColClone[0]).prependTo(this.getHeaderTable()[0]);
                $(headerColClone[1]).prependTo(this.getHeaderTable()[1]);
                $(contentColClone[0]).prependTo(this.getContentTable()[0]);
                $(contentColClone[1]).prependTo(this.getContentTable()[1]);
            }
            else {
                $(headerColClone).prependTo(this.getHeaderTable());
                $(contentColClone).prependTo(this.getContentTable());
            }
        },
        _detailColsRefresh: function () {
            this._$headerCols = this.getHeaderTable().children("colgroup").find("col");
            this._$contentCols = this.getContentTable().children("colgroup").find("col");
            var colCount = this.model.columns.length;
            if (this._$headerCols.length > colCount) this._$headerCols.splice(0, (this._$headerCols.length - colCount));
            if (this._$contentCols.length > colCount) this._$contentCols.splice(0, (this._$contentCols.length - colCount));
        },
        _summaryColRrefresh: function () {
            var table = this.getFooterContent().find('.e-gridsummary');
            for (var i = 0; i < this.columnsWidthCollection.length; i++) 
                table.find('col').eq(i).width(this.columnsWidthCollection[i]);
        },
        _headerdblClickHandler: function (e) {
            if (this.model.allowResizeToFit)
                this._resizer._columnResizeToFit(e);
            if (this.model.allowScrolling)	{		
                this.getScrollObject().refresh(this.model.scrollSettings.frozenColumns > 0);
					if (this.getScrollObject().isVScroll()) {
                        this.getHeaderContent().addClass("e-scrollcss");
						this.getHeaderContent().find(".e-headercontent").addClass("e-hscrollcss");
                    }
			}
        },

        _mouseUp: function (e) {
            if (this.model.allowResizing)
                this._resizer._mouseUp(e);
        },

        _mouseMove: function (e) {
            if (this.model.allowResizing)
                this._resizer._mouseMove(e);
        },
        _setModel: function (options) {
            for (var prop in options) {
                switch (prop) {
                    case "enableResponsiveRow":
                        if (options[prop]) {
                            this.element.addClass("e-responsive");
                            if (this.model.minWidth) {
                                this._removeMedia();
                                this._scrollerAddedOnMedia = false;
                            }
                            if (this.model.allowFiltering) {
                                this.element.find('.e-filterDialog').remove();
                                this._renderFilterDialogs();
                                this._renderResponsiveFilter();
                                this.element.find('.e-gridtoolbar').remove();
                            }
                        } else {
                            if (this.model.allowFiltering) {
                                $('body').find('.e-filterDialog').remove();
                                this._renderFilterDialogs();
                            }
                            if (this.element.css("display") == "none")
                                this.element.css("display", "block");
                            this.element.removeClass("e-responsive");
                            if (this.model.minWidth)
                                this._addMedia();
                            if (this.model.allowScrolling) {
                                this.getScrollObject().refresh();
                                if (!this.getScrollObject().isVScroll()) {
                                    this.getHeaderContent().removeClass("e-scrollcss");
                                    this.getHeaderContent().find(".e-headercontent").removeClass("e-hscrollcss");
                                }
                                else if (this.getScrollObject().isVScroll()) {
                                    this.getHeaderContent().addClass("e-scrollcss");
                                    this.getHeaderContent().find(".e-headercontent").addClass("e-hscrollcss");
                                }
                            }
                        }
                        this._tdsOffsetWidth = [];
                        if (this.model.allowFiltering || this.model.allowSorting) {
                            var index = this.model.toolbarSettings.toolbarItems.indexOf('responsiveFilter');
                            index != -1 && this.model.toolbarSettings.toolbarItems.splice(index, 1);
                            var sortIndex = this.model.toolbarSettings.toolbarItems.indexOf('responsiveSorting');
                            sortIndex != -1 && this.model.toolbarSettings.toolbarItems.splice(sortIndex, 1);
                            this.element.find('.e-gridtoolbar').remove();
                            this._renderToolBar().insertBefore(this.element.find(".e-gridheader").first());
                        }
                        break;
                    case "showColumnChooser":
                        if (options[prop]) {
                            this._visibleColumns = [];
                            this._hiddenColumns = [];
                            this._visibleColumnsField = [];
                            this._hiddenColumnsField = [];
                            this._renderGridHeaderInternalDesign(this.model.columns);
                            this._renderColumnChooser();
                        }
                        else {
                            var dlgObj = $("#" + this._id + "ccDiv").data("ejDialog");
                            if (dlgObj.isOpened())
                                $("#" + this._id + "_ccTail").remove();
                            var ccBtnHeight = 0;
                            if (!ej.isNullOrUndefined(this.element.find(".e-ccButton").outerHeight()))
                                ccBtnHeight += this.element.find(".e-ccButton").outerHeight();
                            this.element.find(".e-ccButton").remove();
                            $("#" + this._id + 'ccDiv_wrapper').remove();
                            this.element.css('margin-top', (parseInt(this.element.css('margin-top'), 10) - ccBtnHeight));
                        }
                        break;
                    case "gridLines":
                        this.getContent().removeClass("e-horizontallines e-verticallines e-hidelines");
						this.getHeaderContent().removeClass("e-horizontallines e-verticallines e-hidelines");
						this._showHeaderGridLines();
                        this._showGridLines();
                        break;
                    case "showDeleteConfirmDialog":
                        this.model.editSettings.showDeleteConfirmDialog = options[prop];
                        if (options[prop])
                            this._renderConfirmDialog();
                        else
                            this.element.find("#" + this._id + 'ConfirmDialog_wrapper').remove()
                        break;
                    case "showConfirmDialog":
                        this.model.editSettings.showConfirmDialog = options[prop];
                        if (options[prop])
                            this._renderConfirmDialog();
                        else
                            this.element.find("#" + this._id + 'ConfirmDialog_wrapper').remove()
                        break;
                    case "pageSettings":
                        var pageModel = this.getPager().ejPager("model");
                        if (ej.isNullOrUndefined(options[prop]["currentPage"]) || pageModel.currentPage != this._currentPage()) {
                            for (var pageProp in options[prop]) {
                                if (pageProp != "currentPage" && options[prop][pageProp] === pageModel[pageProp])
                                    delete options[prop][pageProp];
                            }
                            if ($.isEmptyObject(options[prop]))
                                break;
                            options[prop]["currentPage"] = this._currentPage();
							var pagerObj = {};
							$.extend(pagerObj,options[prop]);
                            if(pagerObj["template"] != undefined && pagerObj["template"] != pageModel.template)
                                pagerObj["template"] = null;
                            this.getPager().ejPager("option", pagerObj);
                            this._renderPagerTemplate(this.getPager(), pagerObj["showDefaults"]);
                            this._currentPage(this._currentPage() > pageModel.totalPages ? pageModel.totalPages : this._currentPage());
                            this.refreshContent();
                        }
                        break;
                    case "columns":
                        var columns = options.columns;
                        this.model.columns = [];
                        this.columns(columns, "add");
                        break;
                    case "allowPaging":
                        this.model.allowPaging = options[prop];
                        if (options[prop] && this.element.children(".e-pager").length == 0) {
						  if(this.model.isResponsive)
                                this.model.pageSettings.isResponsive = true;
                            this.element.append(this._renderGridPager());
                            this.refreshContent();
                            this.getPager().ejPager("refreshPager");
                        } else {
                            this.getPager().remove();
                            this.setGridPager(null);
                            this.refreshContent();
                            if (this.model.filterSettings.filterType == "filterbar" && this.model.allowFiltering)
                                this._createPagerStatusBar();
                        }
                        break;
					case "selectionType":
                            this.multiDeleteMode =  this.model.editSettings.allowDeleting && (this.model.selectionType=="multiple");
                        break;
                    case "allowSearching":
                        this.model.allowSearching = options[prop];
                        break;
                    case "searchSettings":
                        $.extend(this.model.searchSetings, options[prop]);
                        this.refreshContent();
                        break;
                    case "allowGrouping":
                        if (options[prop] && this.element.children(".e-groupdroparea").length == 0) {
                            this.model.allowGrouping = options[prop];
                            this.addGroupingTemplate();
							this.model.showColumnChooser && this.element.find(".e-ccButton").length > 0 ? this.element.find(".e-ccButton").after(this._renderGroupDropArea()) : this.element.prepend(this._renderGroupDropArea());
                            this._enableGroupingEvents();
                            this.model.groupSettings.showDropArea && this._headerCellgDragDrop();
                            this._off(this.element, "mouseenter mouseleave", ".e-groupdroparea,.e-groupheadercell", this._dropAreaHover);
                            this._on(this.element, "mouseenter mouseleave", ".e-groupdroparea,.e-groupheadercell", this._dropAreaHover);
                        } else
						{
							this.element.children(".e-groupdroparea").remove();
							if(this.model.groupSettings.groupedColumns.length > 0){
								   for(var i=this.model.groupSettings.groupedColumns.length ; i >0 ;i--){
										this.ungroupColumn(this.model.groupSettings.groupedColumns[0]);
								}
							}
						  if(!this.model.allowReordering){
							this.element.find('.e-draggable, .e-droppable').ejDraggable();
							this.element.find('.e-draggable, .e-droppable').ejDraggable("destroy");
							}
						
						}
                        if (this.model.allowGrouping) {
                            !ej.isNullOrUndefined(options["groupSettings"]) && $.extend(this.model.groupSettings, options["groupSettings"]);
                            this._enableGrouping();
                        }
                        
                        break;
                    case "groupSettings":
                        $.extend(this.model.groupSettings, options[prop]);
                        if(this.model.allowGrouping && ej.isNullOrUndefined(options["allowGrouping"]))
                            this._enableGrouping();
                        if(!ej.isNullOrUndefined(this.model.groupSettings.enableDropAreaAnimation))
                            this.model.groupSettings.enableDropAreaAutoSizing = this.model.groupSettings.enableDropAreaAnimation;
						if(!this.model.allowReordering && !this.model.groupSettings.showDropArea){
							this.element.find('.e-draggable, .e-droppable').ejDraggable();
							this.element.find('.e-draggable, .e-droppable').ejDraggable("destroy");
							}
                        break;
                    case "cssClass":
                        this.element.removeClass(this.model.cssClass).addClass(options[prop]);
                        break;
                    case "allowFiltering":
                    case "filterSettings":
                        if (prop == "filterSettings")
                            $.extend(this.model.filterSettings, options[prop]);
                        else
                            this.model.allowFiltering = options[prop];
                        this.filterColumnCollection = [];
						this._excelColTypes = [];
                        if (this._$fDlgIsOpen)
                            this._closeFDialog();
                        if (!this.model.allowFiltering) {
                            if (this.model.filterSettings.filterType == ej.Grid.FilterType.FilterBar)
                                this.getHeaderTable().find(".e-filterbar").remove();
                            else if (this.model.filterSettings.filterType == ej.Grid.FilterType.Menu || this.model.filterSettings.filterType == ej.Grid.FilterType.Excel) {
                                this.getHeaderTable().find(".e-columnheader").find(".e-filtericon").remove()
                                    .end().find(".e-headercellfilter").removeClass("e-headercellfilter");
                                this.getHeaderTable().find(".e-columnheader").find(".e-headercellsortfilter").removeClass("e-headercellsortfilter");
                                this.getHeaderTable().find(".e-columnheader").find(".e-headercellsort").removeClass("e-headercellsort");
                                var $columheader = this.getHeaderTable().find(".e-columnheader");
                                if(this.model.groupSettings.showToggleButton){
                                    this.getHeaderTable().find("thead tr:not('.e-stackedHeaderRow')").find(".e-headercell").not(".e-detailheadercell").addClass("e-headercellgroup");
                                    $columheader.find(".e-headercellgroupfilter").removeClass("e-headercellgroupfilter");
                                    if(this.model.enableRTL) {
                                        $columheader.find(".e-gridgroupbutton").addClass("e-rtltoggle");
                                        $columheader.find(".e-headercelldivgroup").removeClass("e-headercelldivgroup");
                                    }
                                }
                            }
                            if (this._isExcelFilter || this._excelFilterRendered) {
                                this._isExcelFilter = this._excelFilterRendered = false;
                                this._excelFilter.resetExcelFilter();
                                this._excelFilter = null;
                            }
                            this.model.filterSettings.filteredColumns = [];
                            this.refreshContent();
                        } else {
                            if (this.model.filterSettings.filterType == ej.Grid.FilterType.FilterBar) {
                                this.getHeaderTable().find(".e-filterbar").remove();
                                this.getHeaderTable().find(".e-columnheader").find(".e-filtericon").remove()
                                    .end().find(".e-headercellfilter").removeClass("e-headercellfilter");
                                this._renderFiltering();
                                this._renderFilterBarTemplate();
                                if (this.model.filterSettings.showFilterBarStatus && !this.model.allowPaging)
                                    this._createPagerStatusBar();
                                else if (this.model.allowPaging)
                                    this.getPager().ejPager({ enableExternalMessage: this.model.filterSettings.showFilterBarStatus });
                                var $filterbar = this.getHeaderTable().find(".e-filterbar");
                                for (var i = 0; i < this.model.groupSettings.groupedColumns.length; i++)
                                    $filterbar.prepend(this._getEmptyFilterBarCell());
                            } else if (!_filter && (this.model.filterSettings.filterType == ej.Grid.FilterType.Menu || this.model.filterSettings.filterType == ej.Grid.FilterType.Excel)) {
                                var _filter = 1;
                                this.getHeaderTable().find(".e-columnheader").find(".e-filtericon").remove()
                                    .end().find(".e-headercellfilter").removeClass("e-headercellfilter");
                                this.getHeaderTable().find(".e-columnheader").find(".e-headercellsort").removeClass("e-headercellsort");
                                this.getHeaderTable().find(".e-filterbar").remove();
                                var columnHeader = this.getHeaderTable().find(".e-columnheader").find(".e-headercell").not(".e-detailheadercell");
                                for (var i = 0; i < columnHeader.length; i++) {
                                    var columnName = columnHeader.eq(i).find(".e-headercelldiv").attr("data-ej-mappingname");
									if(!ej.isNullOrUndefined(columnName)){
										var column = this.getColumnByField(columnName);
										if (!ej.isNullOrUndefined(column) && (ej.isNullOrUndefined(column.allowFiltering) || column.allowFiltering))
											columnHeader.eq(i).addClass("e-headercellfilter").append(ej.buildTag('div.e-filtericon e-icon e-filterset'));
									}
								}                           
                                if(this.model.groupSettings.showToggleButton){
                                    this.getHeaderTable().find(".e-columnheader").find(".e-headercellgroup").removeClass("e-headercellgroup");
                                    var $headertraversal = this.getHeaderTable().find("thead tr:not('.e-stackedHeaderRow')").find(".e-headercell").not(".e-detailheadercell");
                                    $headertraversal.addClass("e-headercellgroupfilter");
                                    $headertraversal.find(".e-filterset").addClass("e-groupfiltericon");
                                    $headertraversal.find(".e-gridgroupbutton").addClass("e-togglegroup");
                                    if(this.model.enableRTL) {
                                        $headertraversal.find(".e-gridgroupbutton").removeClass("e-rtltoggle");
                                        $headertraversal.find(".e-headercelldiv").addClass("e-headercelldivgroup");
                                    }
                                }                                 
							   if (this.model.filterSettings.filterType == ej.Grid.FilterType.Excel) {
                                    this._isExcelFilter = true;
                                    this._renderExcelFilter();
                                } else if (this._isExcelFilter) {
                                    this._isExcelFilter = false;
                                    this._excelFilter.resetExcelFilter();
                                    this._excelFilter = null;
                                }
							   if (this.model.filterSettings.filterType == ej.Grid.FilterType.Menu)
							       this._renderFilterDialogs();
                                this.model.filterSettings.filteredColumns = [];
                                this.refreshContent();
                            }
                            this._enableFilterEvents();
                        }
                        if (this.model.isResponsive && this.model.allowScrolling) {
                            var args = {};
                            args.requestType = "filtering"
                            this._refreshScroller(args);
                        }
                        break;
                    case "enableRowHover":
                        this.model.enableRowHover = options[prop];
                        this._enableRowHover();
                        break;
                    case "allowScrolling":
                    case "scrollSettings":
                        var isDestroy = false;
                        var $content = this.getContent();
						if (prop != "allowScrolling") {
                            if (!ej.util.isNullOrUndefined(options["scrollSettings"])) {
                                if ($.isEmptyObject(options["scrollSettings"])) break;
                                if (!ej.util.isNullOrUndefined(options["scrollSettings"]["enableVirtualization"]) && !ej.util.isNullOrUndefined(options["scrollSettings"]["allowVirtualScrolling"]))
                                    options["scrollSettings"]["allowVirtualScrolling"] = options["scrollSettings"]["enableVirtualization"];
                                $.extend(this.model.scrollSettings, options["scrollSettings"]);
                            }
                            this._initHeight = this.model.scrollSettings.height;
                            this._isHeightResponsive = this.model._isHeightResponsive = this.model.scrollSettings.height == "100%" ? true : false;                           
                            if (!ej.util.isNullOrUndefined(options["allowScrolling"]))
                                this.model.allowScrolling = options["allowScrolling"];
                            this._columnsPixelConvert();
							if(this.model.scrollSettings.allowVirtualScrolling){
								this._currentPage(1);
								this.model.currentIndex = 1;
								if(this.model.scrollSettings.enableVirtualization){								
									this._virtualRowCount = Math.round(this.model.scrollSettings.height / this.getRowHeight()) + 1; 
									this._refreshVirtualViewDetails();
									this._refreshVirtualViewData();
								}
								else {
									this._createPagerStatusBar();
									this._showPagerInformation(this.model.pageSettings);
								}
							}
                            if (options["scrollSettings"]["frozenColumns"] !== undefined || options["scrollSettings"]["frozenRows"] !== undefined ||
                                options["scrollSettings"]["allowVirtualScrolling"] !== undefined || options["scrollSettings"]["virtualScrollMode"] !== undefined ||
								options["scrollSettings"]["enableVirtualization"] != undefined) {
                                var model = this.model;
                                model.query = this.commonQuery.clone();
                                if (this._selectedRow() != -1){
                                    this.clearSelection(this._selectedRow());
									this._selectedRow(-1);
									if(!this._selectAllCheck)
									this._selectedMultipleRows([]);
									}
                                if (options["scrollSettings"]["virtualScrollMode"] != undefined)
                                    model.pageSettings.currentPage = 1;
                                isDestroy = true;
                                this.element.ejGrid("destroy").ejGrid(model);
                            }
                            else {
							    !ej.util.isNullOrUndefined($content.data("ejScroller")) && $content.ejScroller("destroy");
								this.getContentTable().css("width", "100%");
								this.getHeaderTable().css("width", "100%");
                                if (this.model.allowScrolling) {
                                    this.getHeaderContent().find("div").first().addClass("e-headercontent");
									 this._originalScrollWidth = this.model.scrollSettings.width;
									 this._renderScroller();
									 this.setWidthToColumns();
									 !ej.util.isNullOrUndefined($content.data("ejScroller")) && this.getScrollObject().refresh();
									 this.refreshScrollerEvent();
                                } else {
                                    this.element.children(".e-gridheader").removeClass("e-scrollcss");
                                    this.element.get(0).style.width.length == 0 && this.element.css("width", "auto");
                                    this.setWidthToColumns();
                                }
                                this._addLastRow();
                            }
						}
                            if (!isDestroy && !ej.isNullOrUndefined(this.model)) {
                                ej.util.isNullOrUndefined(options["scrollSettings"]) && this._columnsPixelConvert();
                                if (this.model.allowGrouping && this.model.groupSettings.groupedColumns.length > 0) {
                                    this._groupingAction(true);
                                    this._recalculateIndentWidth();
                                }
                                if (!ej.isNullOrUndefined(this.getContent().data("ejScroller")) && this.model.allowScrolling)
                                    var scroller = this.getScrollObject();
                                var css = this.model.enableRTL ? "e-summaryscroll e-rtl" : "e-summaryscroll";
                                if (this.model.allowScrolling && this.model.showSummary) {
                                    if (scroller._vScroll)
                                        this.element.find(".e-summaryrow.e-scroller").addClass(css);
                                    this._scrollFooterColgroup();
                                }
                            }
                        break;
					case "currentIndex":
						if(this.model.allowScrolling &&  this.model.scrollSettings.allowVirtualScrolling && this.model.scrollSettings.enableVirtualization){
							var currentView = Math.ceil(options["currentIndex"] / this._virtualRowCount);
							this._isThumbScroll = true;
							this._refreshVirtualView(currentView);
							this._refreshVirtualViewScroller(true);
						}
						else
							this._scrollObject.option("scrollTop", options["currentIndex"] * this.getRowHeight());						
						break;
                    case "locale":
                        this.model.locale = options[prop];
                        this.model.query = this.commonQuery.clone();                       
                        this._destroy();
                        this.element.css("margin-top", "0px").addClass("e-grid" + this.model.cssClass);
                        this._init();
                        break;
                    case "dataSource":
                        var $content = this.element.find(".e-gridcontent").first();
                        if (!$.isFunction(options["dataSource"]))
                            this.resetModelCollections();
						if(this._gridRecordsCount == 1 && !ej.isNullOrUndefined(this._cDeleteData) && $.inArray(this._cDeleteData[0], this._dataSource()) == -1 && this.model.editSettings.allowDeleting)
						    this._gridRecordsCount = this._dataSource().length;
						for (var i = 0; i < this.model.columns.length; i++) {
						    if (this.model.columns[i].template !== undefined)
						        this._columntemplaterefresh = true;
						}
                        this._updateDataSource = true;
						this._refreshDataSource(this._dataSource());
						this.element.children(".e-gridfooter").remove();
						if (this.model.showSummary && this.model.currentViewData.length > 0) {
						    var footer = this._renderGridFooter();
						    if (!ej.isNullOrUndefined(footer)) footer.insertAfter($content);
						}
						if(!this.model.scrollSettings.enableVirtualization || this._gridRows.length < this._virtualRowCount)
							this._addLastRow();
                        break;
                    case "selectedRowIndex":
                        if (this._selectedRow() != -1 && $.inArray(this._selectedRow(), this.selectedRowsIndexes) == -1){
							this.model.currentIndex = this._selectedRow();
                            this.selectRows(this._selectedRow());
						}
                        else if (this._selectedRow() == -1) {
                            this.clearSelection();
                            this.selectedRowsIndexes = [];
                        }
                        break;
                    case "selectedRowIndices":
                        if (this.model.allowSelection == true && this.model.selectionType == "multiple" && this._selectedMultipleRows().length > 0) {
							var val = typeof options[prop] === 'function' ? options[prop]() : options[prop];
                           this.clearSelection();							
							this.selectedRowsIndexes = val;
							this.selectRows(val);
							this.model.selectedRecords = this.getSelectedRecords();
                        }
                        else if (this._selectedMultipleRows().length == 0) {
                            this.clearSelection();
                        }
                        break;
                    case "editType":
                        if (this._selectedRow() != -1 && $.inArray(this._selectedRow(), this.selectedRowsIndexes) == -1)
                            this.selectRows(this._selectedRow());
                        break;
                    case "editSettings":
                        $.extend(this.model.editSettings, options[prop]);
                        this.refreshToolbar();
                        this.refreshContent(true);
                        this.refreshBatchEditMode();
                        this._tdsOffsetWidth = [];
                        $("#" + this._id + "_dialogEdit").data("ejDialog") && $("#" + this._id + "_dialogEdit").ejDialog("destroy");
                        $("#" + this._id + "_dialogEdit_wrapper,#" + this._id + "_dialogEdit").remove();
                        $("#" + this._id + "_externalEdit").remove();
                        this.getContentTable().find(".e-insertedrow").remove();
                        this.model.isEdit = false;
                        if (this.model.editSettings.editMode != 'normal')
                            this.model.editSettings.showAddNewRow = false;
                        if (!this.model.editSettings.showAddNewRow) 
                            this.getContentTable().find(".e-addedrow").length && this.cancelEdit();
                        if (this.model.editSettings.allowEditing || this.model.editSettings.allowAdding) {
                            if (this.model.editSettings.editMode == "dialog" || this.model.editSettings.editMode == "dialogtemplate")
                                this.element.append(this._renderDialog());
                            else if (this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate")
                                this.element.append(this._renderExternalForm());
                       }
                        if ((this.model.editSettings.allowDeleting && this.model.editSettings.showDeleteConfirmDialog) ||
                            this.model.editSettings.editMode == "batch" && this.model.editSettings.showConfirmDialog)
                            ej.isNullOrUndefined(this._confirmDialog) && this._renderConfirmDialog();
                        this._enableEditingEvents();
						this.refreshToolbar();
                        break;
                    case "allowResizing":
                        this.model.allowResizing = options[prop];
                        if (this.model.allowResizing) {
                            this._on(this.element, ej.eventType.mouseMove, this._mouseMove);
                            this._on(this.element, "mouseup", this._mouseUp);
                            this._resizer = this._resizer || new ej.gridFeatures.gridResize(this);
                        }
                        else {
                            this._off(this.element, ej.eventType.mouseMove, this._mouseMove);
                            this._off(this.element, "mouseup", this._mouseUp);
                            if (!this.model.allowResizeToFit)
                                this._resizer = null;
                        }
                        break;
                    case "allowResizeToFit":
                        if (this.model.allowResizeToFit) {
                            this._on(this.element, "dblclick", ".e-gridheader", this._headerdblClickHandler);
                            this._resizer = this._resizer || new ej.gridFeatures.gridResize(this);
                            this.setWidthToColumns();
                        }
                        else {
                            this._off(this.element, "dblclick", ".e-gridheader", this._headerdblClickHandler);
                            if (!this.model.allowResizing)
                                this._resizer = null;
                        }
                        break;
                    case "allowReordering":
                        this.model.allowReordering = options[prop];
                        if (this.model.allowReordering)
                            this._headerCellreorderDragDrop();
						else if(!this.model.allowGrouping)
							this.element.find('.e-draggable, .e-droppable').ejDraggable("destroy");
                        break;
                    case "allowRowDragAndDrop":
                        if (this.model.allowRowDragAndDrop) {
                            this._rowsDragAndDrop();
                            if (this.model.selectionType == "multiple")
                                this._on(this.element, "touchstart mousedown", ".e-gridcontent", this._contentMouseDown)
                            this.model.allowScrolling && this.getContent().ejScroller({ thumbStart: function () { return false } });
                        } else {
                            this._off(this.element, "touchstart mousedown", ".e-gridcontent", this._contentMouseDown)
                            this.getContent().ejDroppable("destroy");
                            $(this.getRows()).ejDraggable("destroy");
                            this.getContent().ejScroller({ thumbStart: null });
                        }
                        break;
                    case "showSummary":
                    case "summaryRows":
                        if (prop == "showSummary" && options[prop]) this.addSummaryTemplate();
                        if (prop == "showSummary" && !options[prop])
                            this.element.children(".e-gridfooter").remove();
                        else if (prop == "summaryRows" && this.model.showSummary || prop == "showSummary") {
                            this.element.children(".e-gridfooter").remove();
                            this.element.children(".e-gridfooter").remove();
                            var $content = this.element.find(".e-gridcontent").first();
                            var query = this.model.query.queries;
                            var pageQuery = [];
                            for (var i = 0; i < query.length; i++) {
                                if (query[i].fn === "onPage") {
                                    pageQuery = query.splice(i, 1);
                                }
                            }
                            var queryManager = this.model.query;
                            this._setSummaryAggregate(queryManager);
                            if(pageQuery.length)
                                queryManager.queries.push(pageQuery[0]);
                            if (this.model.currentViewData.length) {
                                if (this._isLocalData) {
                                    this._remoteSummaryData = this._dataManager.executeLocal(queryManager).aggregates;
                                    var footer = this._renderGridFooter();
                                    if (!ej.isNullOrUndefined(footer)) footer.insertAfter($content);
                                }
                                else {
                                    var proxy = this;
                                    var promise = this._dataManager.executeQuery(queryManager);
                                    promise.done(function (e) {
                                        proxy.element.children(".e-gridfooter").remove();
                                        proxy._remoteSummaryData = e.aggregates
                                        var footer = proxy._renderGridFooter();
                                        if (!ej.isNullOrUndefined(footer)) footer.insertAfter($content);
                                    });
                                }
                            }
                            if (this.model.allowGrouping) {
                                this._rowCol = this._captionSummary();
                                this._isCaptionSummary = (this._rowCol != null && this._rowCol.length) > 0 ? true : false;
                                this.refreshContent(true);
                            }
                        }
                        break;
                    case "enableAltRow":
                        this.model.enableAltRow = options[prop];
                        this.addInitTemplate();
                        this.refreshContent();
                        break;
                    case "toolbarSettings":
                        $.extend(this.model.toolbarSettings, options[prop]);
                        this.element.children(".e-gridtoolbar").remove();
                        if (this.model.toolbarSettings.showToolbar)
                            this._renderToolBar().insertBefore(this.element.find(".e-gridheader").first());
                        break;
                    case "allowSorting":
                        this.model.allowSorting = options[prop];
                        if (!this.model.allowSorting) 
                            this.clearSorting();
                        break;
                    case "selectionSettings":
                        $.extend(this.model.selectionSettings, options[prop]);
                        this.clearSelection();
                        this.clearCellSelection();
                        this.clearColumnSelection();
                        this._allowrowSelection = this._allowcellSelection = this._allowcolumnSelection = false;
						if(this.model.selectionSettings.selectionMode.length > 0 && this.model.allowSelection)
							this._initSelection();
                        break;
                    case "sortSettings":
                        $.extend(this.model.sortSettings, options[prop]);
                        this.refreshContent();
                        break;
                    case "contextMenuSettings":
                        $.extend(this.model.contextMenuSettings, options[prop]);
                        !ej.isNullOrUndefined($("#" + this._id + "_Context").data("ejMenu")) && $("#" + this._id + "_Context").ejMenu("destroy") && $("#" + this._id + "_Context").remove();
                        if (this.model.contextMenuSettings.enableContextMenu)
                            this._renderContext()
                        break;
                    case "enableRTL":
                        this.model.enableRTL = options[prop];
                        var model = this.model;
                        model.query = this.commonQuery.clone();
                        this.element.ejGrid("destroy");
                        model.enableRTL ? $("#" + this._id).addClass("e-rtl") : $("#" + this._id).removeClass("e-rtl");
                        $("#" + this._id).ejGrid(model);
                        break;
                    case "enableTouch":
                        this.model.enableTouch = options[prop];
                        if (!this.model.enableTouch) {
                            this.element.addClass("e-touch");
                            this._off(this.element, "swipeleft swiperight", ".e-gridcontent .e-table");
                        }
                        else {
                            this._on(this.element, "swipeleft swiperight", ".e-gridcontent .e-table", $.proxy(this._touchGrid, this));
                            this.element.removeClass("e-touch");
                        }
                        break;
                    case "allowSelection":
                        if (options[prop]) {
                            this._off(this.element, ($.isFunction($.fn.tap) && this.model.enableTouch) ? "tap" : "click", this._clickHandler);
                            this._on(this.element, "click", this._clickHandler);
							this._initSelection();
                        }
                        else {
                            this.clearSelection();
                            this.clearCellSelection();
                            this.clearColumnSelection();
                            this._allowrowSelection = this._allowcellSelection = this._allowcolumnSelection = false;
                        }
                        break;
                    case "query":
                        this.commonQuery = $.extend(true, {}, options[prop]);
                        break;
                    case "showStackedHeader":
                    case "stackedHeaderRows":
                        if (this.model.showStackedHeader && options["stackedHeaderRows"] && options.stackedHeaderRows.length > 0) {
                            if (ej.getObject("stackedHeaderRows.length", options))
                                this.model.stackedHeaderRows = options["stackedHeaderRows"];                            
                            this._refreshStackedHeader();
                         }
                          else
                            this.getHeaderTable().find(".e-stackedHeaderRow").remove();
                        break;
                    case "allowTextWrap":
                    case "textWrapSettings":
                        $.extend(this.model.textWrapSettings, options[prop]);
                            this._setTextWrap();
                        break;
                    case "rowTemplate":
                        this.refreshContent(true);
                        break;
                    case "keySettings":
                        if(this.model.keySettings)
                            $.extend(this.model.keyConfigs, this.model.keySettings);
                        break;
                    case "detailsTemplate":
                        if (this.model.scrollSettings.frozenColumns > 0 || this.model.scrollSettings.frozenRows > 0) {
                            this._renderAlertDialog();
                            this._alertDialog.find(".e-content").text(this._getLocalizedLabels("FrozenNotSupportedException"));
                            this._alertDialog.ejDialog("open");
                        }
                        else {
                            var $header = this.element.children(".e-gridheader");
                            $header.find("div").first().empty().append(this._renderGridHeader().find("table"));
                            if (this.model.allowFiltering && this.model.filterSettings.filterType == "filterbar")
                                this._renderFiltering();
                            this.setGridHeaderContent($header);
                            this.refreshContent(true);
                            if (this.model.allowReordering)
                                this._headerCellreorderDragDrop();
                            if (this.model.allowGrouping && this.model.groupSettings.showDropArea)
                                this._headerCellgDragDrop();
                        }
                        break;
                }
            }

        },
        
        resetModelCollections: function () {
            this.model.groupSettings.groupedColumns = [];
            this.model.filterSettings.filteredColumns = [];
            this.filterColumnCollection = [];
            this.model.sortSettings.sortedColumns = [];
            this.model.pageSettings.currentPage = this.defaults.pageSettings.currentPage;
        },
        _enableGrouping: function(){
			this.refreshTemplate();
			if (this.model.groupSettings.showToggleButton) {
			    var isFiltering = this.model.allowFiltering && (this.model.filterSettings.filterType == "menu" || this.model.filterSettings.filterType == "excel");
			    var columns = this.model.columns;
			    for (var columnCount = 0; columnCount < columns.length; columnCount++) {
			        var headercell = this.getHeaderTable().find(".e-columnheader").find(".e-headercell").not(".e-stackedHeaderCell, .e-detailheadercell").eq(columnCount);
			        var field = columns[columnCount].field;
			        if ($.inArray(field, this._disabledGroupableColumns) == -1 && !ej.isNullOrUndefined(field) && field != "") {
			            if (!headercell.find(".e-gridgroupbutton").length) {
			                if ($.inArray(field, this.model.groupSettings.groupedColumns) != -1)
			                    headercell.append(this._getToggleButton().addClass("e-toggleungroup"));
			                else
			                    headercell.append(this._getToggleButton().addClass("e-togglegroup"));
			                if (isFiltering && (columns[columnCount]["allowFiltering"] == undefined || columns[columnCount]["allowFiltering"] === true) && (!ej.isNullOrUndefined(columns[columnCount].field) || columns[columnCount].field == "") && (columns[columnCount]["type"] != "checkbox")) {
			                    headercell.addClass("e-headercellgroupfilter");
			                    headercell.find(".e-filtericon").addClass("e-groupfiltericon");
			                }
			                headercell.addClass("e-headercellgroup");
			            }
			        }
			    }
			}
			if (!this.model.groupSettings.showToggleButton)
			    this.getHeaderTable().find(".e-gridgroupbutton").remove();
			this.element.find(".e-groupdroparea").remove();
			if (this.model.groupSettings.showDropArea) {
			    this.model.showColumnChooser && this.element.find(".e-ccButton").length > 0 ? this.element.find(".e-ccButton").after(this._renderGroupDropArea()) : this.element.prepend(this._renderGroupDropArea());
			    if (ej.gridFeatures.dragAndDrop) {
			        this._groupHeaderCelldrag();
			        this._headerCellgDragDrop();
			    }
			}
			if (!ej.isNullOrUndefined(this.model.groupSettings.groupedColumns.length) && this.model.groupSettings.groupedColumns.length) {
				var args = {};
			    args.columnName = this.model.groupSettings.groupedColumns[this.model.groupSettings.groupedColumns.length - 1];
			    args.requestType = ej.Grid.Actions.Grouping;
			    this.element.find(".e-groupdroparea").empty();
				for (var i = 0; i < this.model.groupSettings.groupedColumns.length - 1; i++)
					this._addColumnToGroupDrop(this.model.groupSettings.groupedColumns[i]);
				for (var i = 0; i < this.model.groupSettings.groupedColumns.length; i++) {
					if (ej.isNullOrUndefined(this.getsortColumnByField(this.model.groupSettings.groupedColumns[i])))
						this.model.sortSettings.sortedColumns.push({ field: this.model.groupSettings.groupedColumns[i], direction: ej.sortOrder.Ascending});
				}
				this._processBindings(args);
			}
        },
        
        addIgnoreOnExport: function (args) {
            if (typeof (args) == 'string')
                this.ignoreOnExport.push(args);
            else
                this.ignoreOnExport = this.ignoreOnExport.concat(args);
        },
        addIgnoreOnToolbarServerClick: function (args) {
            if (typeof (args) == 'string')
                this.ignoreOnToolbarServerClick.push(args);
            else
                this.ignoreOnToolbarServerClick = this.ignoreOnToolbarServerClick.concat(args);
        },
        _decode: function (value) {
            return $('<div/>').html(value).text();
        },
        _htmlEscape: function (str) {
            var regx = /[&<>"']/g, charEntities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&#34;",
                "'": "&#39;"
            };
            return str.replace(regx, function (c) {
                return charEntities[c];
            });
        },
        _mappingSelection: function () {
            if (ej.gridFeatures.selection && this._enableCheckSelect) {
                this.multiSelectCtrlRequest = true;
                var rowIndexes = [];
                for (var i = 0; i < this._currentJsonData.length; i++) {
                    if (ej.pvt.getObject(this._selectionMapColumn, this._currentJsonData[i]) == true)
                        rowIndexes.push(i)
                }
                this.selectedRowsIndexes = [];
                this.checkSelectedRowsIndexes = [];
                this._selectedRow(-1);
                this._selectionByGrid = true;
                rowIndexes.length && this.selectRows(rowIndexes);
                this._selectionByGrid = false;
            }
        },
        _headerCheckUpdateAll: function (val) {
            var data = [];
            if (this._isLocalData) {
                if (this.model.searchSettings.key != "" || this.model.filterSettings.filteredColumns.length)
                    data = this.getFilteredRecords();
                else
                    data = this._dataSource() instanceof ej.DataManager ? this._dataSource().dataSource.json : this._dataSource();
            }
            else
                data = this._currentJsonData;
            for (var i = 0; i < data.length; i++) {
                data[i][this._selectionMapColumn] = val;
                this.batchChanges.changed.push(data[i]);
            }
            this.clearSelection();
            this.batchSave();
            return;
        },
        _getForeignKeyData: function (data) {
            var proxy = this;
            var column = {},i;
            for (i = 0; i < this.model.columns.length; i++) {
                if (this.model.columns[i].foreignKeyValue && this.model.columns[i].dataSource) {
                    var fieldName = ej.isNullOrUndefined(proxy.model.columns[i]["foreignKeyField"]) ? proxy.model.columns[i]["field"] : proxy.model.columns[i]["foreignKeyField"];
                    var dataSource = this.model.columns[i].dataSource instanceof ej.DataManager ? this.model.columns[i].foreignKeyData : this.model.columns[i].dataSource;
                    dataSource.filter(function (col) {
                        var value = ej.getObject(proxy.model.columns[i]["field"], data);
                        var fValue = !isNaN(parseFloat(value)) && isFinite(value) ? parseFloat(value) : value;
                        if (col[fieldName] == fValue) {
                            column[fieldName] = col;
                        }
                    });
                }
            }
            return column;
        },
        _foreignKeyBinding: function (curColumn, cellValue, gridId) {
            var cellData, val;
            var gridObj = $("#" + gridId).ejGrid('instance');
            curColumn = gridObj.model.columns[curColumn];
            var dataSource = curColumn.dataSource instanceof ej.DataManager ? curColumn.foreignKeyData : curColumn.dataSource;
            dataSource.filter(function (col) {
                if (ej.getObject(curColumn.foreignKeyField, col) == cellValue) {
                    val = ej.getObject(curColumn.foreignKeyValue, col);
                    return cellData = curColumn.type == "date" ? new Date(val) : val;
                }
            });
            if (curColumn.format) {
                cellData = gridObj.formatting(curColumn.format, cellData, gridObj.model.locale);
            }
            return cellData;
        },
        _checkForeignKeyBinding: function () {
            if (!this.model.columns.length)
                return;
            var c, _cols, _len, _col;
            for (c = 0, _cols = this.model.columns, _len = _cols.length; c < _len; c++) {
                _col = _cols[c];
                if (_col.hasOwnProperty("foreignKeyField") && _col["dataSource"] instanceof ej.DataManager)
                    this._relationalColumns.push({ field: _col["field"], key: _col["foreignKeyField"], value: _col["foreignKeyValue"], dataSource: _col["dataSource"] });
            }
            this._$fkColumn = true;
        },  
        _setForeignKeyData: function (args) {
            if (!this._relationalColumns.length)
                return;
            var arr = this._relationalColumns, len = this._relationalColumns.length,
                promises = [], viewData = this.model.currentViewData, e = {};
            var obj, qry, pred, dist, qPromise, proxy = this;
            if (viewData.length == 0) {
                for (var c = 0, clen = this.model.columns.length; c < clen; c++) {
                    var column = this.model.columns[c];
                    if (!ej.isNullOrUndefined(column["foreignKeyField"]) && column.dataSource instanceof ej.DataManager)
                        column["foreignKeyData"] = [];
                }
            }
            var failFn = ej.proxy(function (e) { /*Separate fail handler to get more control over request*/
                this._trigger("actionFailure", { requestType: "fetchingforeigndata", error: e.error });
            }, this);
            if (!this.element.ejWaitingPopup("model.showOnInit"))
                this.element.ejWaitingPopup("show");
                
            for (var i = 0; i < len; i++) {
                if (!(0 in viewData)) continue;
                obj = arr[i], e.field = obj["field"], e.keyField = obj["key"], e.valueField = obj["value"], e.dataSource = obj["dataSource"],
                            e.query = new ej.Query().select([e.valueField, e.keyField]),
                            dist = ej.distinct(viewData.level ? viewData.records : viewData, e.field, true);
                       
                var predicate = [];
                for (var j = 0; j < dist.length; j++)
                    predicate.push(new ej.Predicate(e.keyField, "equal", dist[j][e.field], true));
                predicate = ej.Predicate.or(predicate);
                e.query.where(predicate);
                        
                if (this._trigger("actionBegin", $.extend(e, { requestType: "fetchingforeigndata", column: this.getColumnByField(e.field) })))
                    return;
                qPromise = e.dataSource.ready === undefined ? e.dataSource.executeQuery(e.query, null, failFn) : e.dataSource.ready.fail(failFn);
                promises.push(qPromise);
            }
                
            $.when.apply(this, promises).then(function () {
                proxy.element.ejWaitingPopup("hide");
                var arg = [].slice.call(arguments, 0, arguments.length), column;
                for (var i = 0, plen = promises.length; i < plen; i++) {
                    obj = arr[i];
                    for (var c = 0, clen = proxy.model.columns.length; c < clen; c++) {
                        column = proxy.model.columns[c];
                        if (column["foreignKeyField"] == obj["key"] && column["foreignKeyValue"] == obj["value"] && column["field"] == obj["field"])
                            column["foreignKeyData"] = arg[i].result;
                    }
                }
                proxy.initialRender ? proxy._initGridRender() : proxy.sendDataRenderingRequest(args);
            });
                
        },
        _isRelationalRendering: function (args) {
            return (0 in this._relationalColumns) && ["add", "beginedit", "cancel"].indexOf(args.requestType) == -1;
        }        
    };
})(jQuery, Syncfusion);