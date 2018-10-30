(function ($, ej, undefined) {
    ej.gridFeatures = ej.gridFeatures || {};
    ej.gridFeatures.group = {
        _renderGroupDropArea: function () {
            if(!ej.isNullOrUndefined(this.model.groupSettings.enableDropAreaAnimation))
                this.model.groupSettings.enableDropAreaAutoSizing = this.model.groupSettings.enableDropAreaAnimation;
            var dragLabel = this.model.groupSettings.enableDropAreaAutoSizing ? "" : this.localizedLabels.GroupDropArea;
            if (this.model.groupSettings.showDropArea) {
                var $div = ej.buildTag("div.e-groupdroparea", dragLabel);
				$div.addClass("e-default");
                this.model.groupSettings.enableDropAreaAutoSizing && $div.append(ej.buildTag("div.e-animatebutton e-icon").addClass(this.model.groupSettings.enableDropAreaAutoSizing ? "e-animatebuttondown e-gdownarrow" : "e-animatebuttonup e-guparrow"));
                return $div;
            }
        },
        _getColGroup: function (gridObjectId) {
            var gridObject = this.getRsc("helpers", gridObjectId);
            if (gridObject.model.groupSettings.groupedColumns.length == 1)
                var level = this.data.items.level === undefined ? 0 : this.data.items.level - 1;
            else
                var level = this.data.items.level === undefined ? gridObject.model.groupSettings.groupedColumns.length : this.data.items.level - 1;
            var $div = $(document.createElement("div"));
            var $colGroup;
            if (gridObject._isCaptionSummary)
                $colGroup = gridObject._getCaptionColGroup(level);
            else {
                $colGroup = gridObject._getMetaColGroup();
                if (level != gridObject.model.groupSettings.groupedColumns.length && gridObject.model.groupSettings.groupedColumns.length > 1)
                    $colGroup.prepend(gridObject._getIndentCol());
            }
            $div.html($colGroup);
            return $div.html();
        },
        _colSpanAdjust: function (gridObjectId, type, captionDetails) {
            var gridObject, groupData;
            if (ej.isNullOrUndefined(gridObjectId)) {
                gridObject = this;
                groupData = captionDetails;
            }
            else {
                gridObject = this.getRsc("helpers", gridObjectId);
                groupData = this;
            }
            if (gridObject.model.groupSettings.groupedColumns.length == 1) {
                var level = groupData.data.items.level === undefined ? 1 : groupData.data.items.level - 1;
                if (type == "groupcaption")
                    gridObject._currentJsonData = gridObject._currentJsonData.concat(groupData.data.items);
            } else {
                var level = groupData.data.items.level === undefined ? gridObject.model.groupSettings.groupedColumns.length : groupData.data.items.level - 1;
                if (type == "groupcaption" && groupData.data.items.level === undefined)
                    gridObject._currentJsonData = gridObject._currentJsonData.concat(groupData.data.items);
            }            
            gridObject._isGrouping = true;
            var hideGroupColumnCount = !gridObject.model.groupSettings.showGroupedColumn ? gridObject.model.groupSettings.groupedColumns.length : 0;
            var count = 0;
            $.each(gridObject._hiddenColumnsField, function (indx, col) {
                var tempIndex = $.inArray(col, gridObject.model.groupSettings.groupedColumns);
                if (tempIndex != -1) {
                    count = count + 1;
                    if (gridObject.model.groupSettings.showGroupedColumn)
                        hideGroupColumnCount = hideGroupColumnCount + 1;
                }
            })
            var colHeaderText = [];
            $.map(gridObject.model.columns, function (val, i) {
                colHeaderText.push(val.headerText)
            });
            var duparr = gridObject._isDuplicate(colHeaderText), colspan;
            if(!duparr)
                colspan = gridObject.model.columns.length + gridObject.model.groupSettings.groupedColumns.length - level - gridObject._hiddenColumns.length - hideGroupColumnCount + count;
            else
                colspan = gridObject.model.columns.length + gridObject.model.groupSettings.groupedColumns.length - level - gridObject._hiddenColumnsField.length - hideGroupColumnCount + count;
            colspan = (gridObject.model.detailsTemplate != null || gridObject.model.childGrid != null) ? colspan + 1 : colspan;

            if (gridObject._isCaptionSummary && type == "groupcaption") {
                var index = [], cIndex = 0;
                var row = gridObject._captionSummary();
                var hiddenIndexCount = 0, summaryColIndexes = [];
                $.each(row[0].summaryColumns, function (cindx, col) {
                    if ($.inArray(col.displayColumn, gridObject._hiddenColumnsField) != -1)
                        cIndex++;
                    summaryColIndexes.push(gridObject.getColumnIndexByField(col.displayColumn));
                    index.push(gridObject.getColumnIndexByField(col.displayColumn) + gridObject.model.groupSettings.groupedColumns.length - level);
                });
                var sumColIndex = ej.min(summaryColIndexes)
                var hiddenCol = duparr ? gridObject._hiddenColumnsField : gridObject._hiddenColumns;
                for (var i = 0 ; i < hiddenCol.length; i++) {
                    if (duparr)
                        var colIndex = ej.isNullOrUndefined(gridObject.getColumnByField(gridObject._hiddenColumnsField[i])) ? gridObject.getColumnIndexByHeaderText(gridObject._hiddenColumnsField[i], ej.isNullOrUndefined(gridObject.getColumnByField(gridObject._hiddenColumnsField[i]))) : gridObject.getColumnIndexByField(gridObject._hiddenColumnsField[i]);
                    else
                        var colIndex = ej.isNullOrUndefined(gridObject.getColumnByHeaderText(gridObject._hiddenColumns[i])) ? gridObject.getColumnIndexByHeaderText(gridObject._hiddenColumns[i], ej.isNullOrUndefined(gridObject.getColumnByHeaderText(gridObject._hiddenColumns[i]))) : gridObject.getColumnIndexByHeaderText(gridObject._hiddenColumns[i]);
                    if (sumColIndex > colIndex)
                        hiddenIndexCount++;
                }
                if (index.length > 0)
                    colspan = ej.min(index);
                colspan = colspan - hiddenIndexCount;
                colspan = (gridObject.model.detailsTemplate != null || gridObject.model.childGrid != null) ? colspan + 1 : colspan;
            }
            return colspan;
        },
        _captionEncode: function (gridObjectId) {
            var gridObject = this.getRsc("helpers", gridObjectId);
            var column = gridObject.getColumnByField(this.data.field);
            return column.disableHtmlEncode;
        },
        _captionFormat: function (gridObjectId) {
            var gridObject = this.getRsc("helpers", gridObjectId);
            var keyValue, captionData = $.extend({}, this.data);
			var capationFormat = !ej.isNullOrUndefined(gridObject.model.groupSettings.captionFormat)? gridObject.model.groupSettings.captionFormat: gridObject.localizedLabels.GroupCaptionFormat;
            var column = gridObject.getColumnByField(captionData.field);
            if (column.foreignKeyValue && column.dataSource)
                keyValue = gridObject._foreignKeyBinding(gridObject.getColumnIndexByField(captionData.field), captionData.key, gridObject._id);
            else
                keyValue = captionData.key;
			if(!ej.isNullOrUndefined(column.format) && column.format.indexOf("{0:") == -1){
				captionData[captionData.field] = captionData.key;
				gridObject.data = captionData;
			}
            captionData.key = column.format ? gridObject.formatting(column.format, keyValue, gridObject.model.locale) : keyValue;
            captionData.headerText = column.headerText;
            gridObject._groupContextIndex = gridObject._groupContextIndex + 1;
            if (capationFormat.startsWith("#") || capationFormat.startsWith(".") || typeof capationFormat === "object")
                return gridObject._renderEjTemplate(capationFormat, captionData, gridObject._groupContextIndex, null, !ej.isNullOrUndefined(gridObject.model.ngTemplateId) ? gridObject.model.ngTemplateId + "gridgroupcaptiontemplate" : null);
            else
                return $.render[gridObject._id + "_CaptionTemplate"](captionData);
        },
        _getCaptionColGroup: function (level) {
            var cloneColGroup = this.getHeaderTable().find("colgroup").clone();
            var colColl = cloneColGroup.find("col");
            var indentCol = colColl.length - this.model.columns.length;
            if (this.model.detailsTemplate != null || this.model.childGrid != null)
                indentCol = indentCol - 1;
            cloneColGroup.find("col:lt(" + indentCol + ")").remove();
            if (level > 0 && level != this.model.groupSettings.groupedColumns.length) {
                if (this.model.groupSettings.groupedColumns.length > 2 && level != this.model.groupSettings.groupedColumns.length - 1) {
                    for (var i = 0; i < this.model.groupSettings.groupedColumns.length - level; i++) {
                        cloneColGroup.prepend(this._getIndentCol());
                    }
                }
                else
                    cloneColGroup.prepend(this._getIndentCol());
            }
            return cloneColGroup;
        },
        _groupSummaryRow: function (item, aggregates, gridObjectId, showGroup) {
            var gridObject = this.getRsc("helpers", gridObjectId), showGroup = !ej.isNullOrUndefined(showGroup), colIndex;
            if (gridObject.model.showSummary) {
                if (gridObject.getFooterTable() == null)
                    gridObject._renderGridFooter();
                gridObject._createSummaryRows(gridObject.getFooterTable(), item.records == null ? item : item.records, aggregates, item, showGroup);
                if (gridObject._isCaptionSummary && !showGroup) {
                    var index = [];
                    var row = gridObject._captionSummary();
                    $.each(row[0].summaryColumns, function (cindx, col) {
                        index.push(gridObject.getColumnIndexByField(col.displayColumn));
                    });
                    if (index.length > 0)
                        colIndex = ej.min(index);
                    var colLength = gridObject.model.columns.length;
                    gridObject.getFooterTable().find("tbody td").slice(-(colLength - colIndex)).removeClass("e-summaryrow").addClass("e-groupcaptionsummary");
                }
                if (!gridObject.model.groupSettings.showGroupedColumn) {
                    var groupedcolumns = gridObject.model.groupSettings.groupedColumns;
                    var count = 0;
                    var gridfooterrow = gridObject.getFooterTable().children('tbody').find('tr');
                    for (var j = 0; j < gridObject.model.summaryRows.length; j++) {
                        for (var k = 0; k < gridObject.model.summaryRows[j].summaryColumns.length; k++) {
                            for (var i = 0; i < groupedcolumns.length; i++) {
                                if (groupedcolumns[i] == gridObject.model.summaryRows[j].summaryColumns[k].displayColumn) {
                                    count++;
                                    if (gridObject.model.summaryRows[j].summaryColumns.length == count) {
                                        $(gridfooterrow[j]).addClass("e-hide")
                                    }
                                }
                            }
                        }
                        count = 0;
                    }
                }
                return !showGroup ? gridObject.getFooterTable().find("tbody").find("tr").html() : gridObject.getFooterTable().find("tbody").html();
            }
        },
        addGroupingTemplate: function () {
            var tbody = document.createElement('tbody');
            var expandTd = "<td class='e-recordplusexpand' data-ej-mappingname='{{:field}}' data-ej-mappingvalue='{{:key}}'><div class='e-icon e-gdiagonalnext'></div></td>";
            var proxy = this;
            var helpers = {};
            helpers["_" + proxy._id + "ColSpanAdjust"] = this._colSpanAdjust;
            helpers["_" + proxy._id + "Colgroup"] = this._getColGroup;
            if (ej.isNullOrUndefined(this.model.groupSettings.captionFormat))
                $.templates(proxy._id + "_CaptionTemplate", this.localizedLabels.GroupCaptionFormat);
            else
                $.templates(proxy._id + "_CaptionTemplate", this.model.groupSettings.captionFormat);
            helpers["_" + proxy._id + "CaptionFormat"] = this._captionFormat;
            helpers["_" + proxy._id + "GroupSummaryRow"] = this._groupSummaryRow;
            helpers["_" + proxy._id + "CaptionEncode"] = this._captionEncode;
            helpers[proxy._id + "Object"] = this;
            $.views.helpers(helpers);
            var caption = " ~_" + proxy._id + "CaptionFormat('" + proxy._id + "Object')";
            var cpationTd = expandTd + "<td class='e-groupcaption' colspan='{{:~_" + proxy._id + "ColSpanAdjust('" + proxy._id + "Object" + "','groupcaption') }}'>{{if ~_" + proxy._id + "CaptionEncode('" + proxy._id + "Object')}}{{html:" + caption + "}}{{else}}{{:" + caption + "}}{{/if}}</td>";
            if (this._isCaptionSummary && this.model.showSummary)
                cpationTd = cpationTd + "{{:~_" + proxy._id + "GroupSummaryRow(items, aggregates,'" + proxy._id + "Object')}}";
            var captionTr = "<tr class='e-groupcaptionrow'>" + cpationTd + "</tr>";
            var $tbody = ej.buildTag("tbody");
            $tbody.html("{{if items.GROUPGUID}}" +
                "{{for items tmpl='" + proxy._id + "_GroupingTemplate'/}}" +
                "{{else}}" +
                "{{for items tmpl='" + proxy._id + "_JSONTemplate'/}}" +
                "{{/if}}");
            var indentTd = "<td class='e-indentcell'></td>";
            var table = "<table class='e-table {{if items.GROUPGUID}}{{else}}e-recordtable{{/if}}'>" +
                "{{:~_" + proxy._id + "Colgroup('" + proxy._id + "Object')}}" +
                $tbody.html() + "{{:~_" + proxy._id + "GroupSummaryRow(items, aggregates,'" + proxy._id + "Object', '" + proxy._id + "showGroupCaption')}}" +
            "</table>";
            var tableTd = "<td class='e-tabletd' colspan='{{:~_" + proxy._id + "ColSpanAdjust('" + proxy._id + "Object" + "','table')}}'>" + table + "</td>";
            var tr = "<tr>" + indentTd + tableTd + "</tr>";
            $.templates(proxy._id + "_GroupingTemplate", captionTr + tr);
        },
        addSummaryTemplate: function () {
            var proxy = this;
            $.each(proxy.model.summaryRows, function (cindx, row) {
                $.each(row.summaryColumns, function (cindx, cols) {
                    if (!ej.isNullOrUndefined(cols.template))
                        $.templates(proxy._id + "_summaryTemplate" + cols.template, cols.template)
                });
            });
        },
        _getGroupTopLeftCell: function () {
            var $th = ej.buildTag("th.e-grouptopleftcell");
            $th.append(ej.buildTag("div.e-headercelldiv e-emptyCell", "&#160;"));
            return $th;
        },
        _getEmptyFilterBarCell: function () {
            var $th = ej.buildTag("th.e-filterbarcell e-grouptopleftcell");
            return $th;
        },
        _groupingAction: function (refWidth) {
            var $groupTopCell = this.getHeaderTable().find("thead").find(".e-columnheader:not(.e-stackedHeaderRow)").find(".e-grouptopleftcell"), $col = this.getHeaderTable().find("colgroup").find("col");
            var groupColumn = $groupTopCell.length;
            if (groupColumn) {
                this.getHeaderTable().find("colgroup").replaceWith(this._getMetaColGroup());
                (this.model.detailsTemplate != null || this.model.childGrid != null) && this.getHeaderTable().find("colgroup").prepend(this._getIndentCol());
                $groupTopCell.remove();
                this.getHeaderTable().find("thead").find(".e-filterbar").find(".e-filterbarcell:lt(" + groupColumn + ")").remove();
            }
            if (!this.model.allowResizeToFit || refWidth)
                this.setWidthToColumns();
            for (var i = 0; i < this.model.groupSettings.groupedColumns.length; i++) {
                this.getHeaderTable().find("colgroup").prepend(this._getIndentCol());
                this.getHeaderTable().find("thead").find(".e-columnheader").prepend(this._getGroupTopLeftCell());
                this.getHeaderTable().find("thead").find(".e-filterbar").prepend(this._getEmptyFilterBarCell());
            }
            this.getHeaderTable().find(".e-columnheader").find("th.e-grouptopleftcell").last().addClass("e-lastgrouptopleftcell");
        },
        
        groupColumn: function (columnName) {
            if (this._$fDlgIsOpen && this.model.allowFiltering && (this.model.filterSettings.filterType == "menu" || this.model.filterSettings.filterType == "excel"))
                this._closeFDialog();
            if (!this.model.allowGrouping || $.inArray(columnName, this._disabledGroupableColumns) != -1)
                return;
            if (ej.isNullOrUndefined(this.getColumnByField(columnName)) || $.inArray(columnName, this.model.groupSettings.groupedColumns) != -1)
                return;
            this.model.groupSettings.groupedColumns.push(columnName);
            for (var i = 0; i < this.model.sortSettings.sortedColumns.length; i++) {
                if (this.model.sortSettings.sortedColumns[i].field == columnName) {
                    break;
                }
            }
            this.model.sortSettings.sortedColumns.length == i && this.model.sortSettings.sortedColumns.push({ field: columnName, direction: ej.sortOrder.Ascending });
            var args = {};
            args.columnName = columnName;
            args.requestType = ej.Grid.Actions.Grouping;
            var returnValue = this._processBindings(args);
            if (returnValue) {
                if (!($.inArray(columnName, this._scolumns) != -1 || this._gridSort == columnName))
                    this.model.sortSettings.sortedColumns.pop();
                this.model.groupSettings.groupedColumns.pop();
            }
            this._primaryKeyValues = [];
        },
        
        ungroupColumn: function (columnName) {
            if (this._$fDlgIsOpen && this.model.allowFiltering && (this.model.filterSettings.filterType == "menu" || this.model.filterSettings.filterType == "excel"))
                this._closeFDialog();
            if (!this.model.allowGrouping &&this.model.groupSettings.groupedColumns.length == 0)
                return;
            if ($.inArray(columnName, this.model.groupSettings.groupedColumns) != -1)
                this.model.groupSettings.groupedColumns.splice($.inArray(columnName, this.model.groupSettings.groupedColumns), 1);
            else
                return null;
            if (this.model.groupSettings.groupedColumns.length == 0)
                this._LastColumnUnGroup = true;
            var column = this.getColumnByField(columnName)
            if (!this.model.groupSettings.showGroupedColumn && !column["visible"]) {
                var index = this._hiddenColumnsField.indexOf(columnName), hTxt = this.getColumnByField(columnName).headerText;
                this._hiddenColumnsField.splice(index, 1);
                this._hiddenColumns.splice(this._hiddenColumns.indexOf(hTxt), 1);
                this._visibleColumns.push(hTxt);
                this._visibleColumnsField.push(columnName);
                column["visible"] = true;
            }
            var args = {};
            for (var i = 0; i < this.model.sortSettings.sortedColumns.length; i++) {
                if (this.model.sortSettings.sortedColumns[i].field == columnName) {
                    if (this._scolumns.indexOf(columnName) != -1 && this.model.allowSorting && this.model.allowMultiSorting || this._gridSort == columnName)
                        if (this.model.allowSorting && this.model.allowMultiSorting) {
                            var no = $.inArray(columnName, this._scolumns);
                            this._scolumns.splice(no, 1);
                            break;
                        }
                        else {
                            this._gridSort = null;
                            break;
                        }
                    else
                        this.model.sortSettings.sortedColumns.splice(i, 1);
                    break;
                }
            }
            args.columnName = columnName;
            args.requestType = ej.Grid.Actions.Ungrouping;
			this._isUngrouping = true;
            var returnValue = this._processBindings(args);
            if (returnValue)
                this.model.groupSettings.groupedColumns.push(columnName);
            this._primaryKeyValues = [];
        },
        
        collapseGroupDropArea: function () {
            var $groupDropArea = this.element.find(".e-groupdroparea").first(), proxy = this;
            this.model.groupSettings.groupedColumns.length == 0 && this.model.groupSettings.enableDropAreaAutoSizing && $groupDropArea.animate({ height: "10px" }, 200, function () {
                if (proxy.model != null && proxy.model.groupSettings.groupedColumns.length == 0) {
                    $(this).html("").append(ej.buildTag("div.e-animatebutton e-animatebuttondown e-icon e-gdownarrow"));
                    $(this).dequeue().css("height", "auto");
                }
            });
            
        },
        
        expandGroupDropArea: function () {
            var $groupDropArea = this.element.find(".e-groupdroparea").first(), proxy = this;
            this.model.groupSettings.groupedColumns.length == 0 && proxy.model.groupSettings.enableDropAreaAutoSizing && $groupDropArea.animate({ height: "30px" }, 150, function () {
                proxy.model.groupSettings.groupedColumns.length == 0 && $groupDropArea.html(proxy.localizedLabels.GroupDropArea).append(ej.buildTag("div.e-animatebutton e-animatebuttonup e-icon e-guparrow"));
                $groupDropArea.dequeue().css("height", "30px");
            });
        },
        _enableGroupingEvents: function () {
            if (this.model.allowGrouping) {
                this._on(this.element, ($.isFunction($.fn.tap) && this.model.enableTouch) ? "tap" : "click", ".e-groupdroparea", this._groupHeaderCellClick);
            }
        },
        _recalculateIndentWidth: function () {
            var proxy = this;
            var browserDetails = !ej.isIOSWebView() && this.getBrowserDetails();
            var indentWidth = this.getHeaderTable().find(".e-lastgrouptopleftcell").width(), newWidth = indentWidth, perPixel = indentWidth / 30, $col;
            if (perPixel >= 1)
                newWidth = (30 / perPixel);
            this.getHeaderTable().find("colgroup").find("col").slice(0, this.model.groupSettings.groupedColumns.length).css("width", newWidth + "px");
            var $conCol = this.getContentTable().find("table").filter(":not(.e-recordtable)");
            indentWidth = this.getHeaderTable().find(".e-lastgrouptopleftcell").width();
            if (indentWidth > 30 || (this._isCaptionSummary && (indentWidth >= 30 || (indentWidth > newWidth)))) {
                if (this._isCaptionSummary) {
                    var colgroup = this.model.isEdit ? $conCol.parent(":not(.gridform)").children("colgroup") : $conCol.children("colgroup");
                    $.each(colgroup, function (index, item) {
                        var indentCol = $(item).find("col").length - proxy.model.columns.length;
                        if (proxy.model.detailsTemplate != null || proxy.model.childGrid != null) {
                            if (indentCol > 0)
                                indentCol = indentCol - 1;
                        }
                        $(item).find("col").slice(0, indentCol).css("width", newWidth + "px");
                    });
                }
                else {
                    if (this.model.isEdit) {
                        var colgroup = $conCol.parent(".gridform").find("colgroup");
                        this._setEditColGroup(colgroup, proxy, newWidth);
                    }
                    else
                        $conCol.children("colgroup").find("col:first-child").css("width", indentWidth + "px");
                }$col = this.getContentTable().find("colgroup").first().find("col").slice(0, this.model.groupSettings.groupedColumns.length);
                if (browserDetails && browserDetails.browser != "msie")
                    $col.css("width", newWidth + "px");
                else{
                    if (this._isCaptionSummary) 
						$col.css("width", newWidth + "px");
					else
						$col.first().css("width", ((indentWidth / this.element.width()) * 100) + "%");
				}
            } else {
                this.getContentTable().find("colgroup").first().find("col").slice(0, this.model.groupSettings.groupedColumns.length).css("width", newWidth + "px");
                if (this.model.isEdit) {
                    var colgroup = this.getContentTable().find(".gridform table").find("colgroup");
                    this._setEditColGroup(colgroup, proxy, newWidth);
                }
                this.getContentTable().find("table").filter(":not(.e-recordtable)").parent(":not(.gridform)").children("colgroup").find("col:first-child").css("width", indentWidth + "px");
            }
            if (this.model.showSummary) {
                var sumCols = this.getContentTable().find("table").filter(".e-groupsummary").find(".e-summary");
                sumCols.css("width", newWidth + "px");
            }
        },
        _setEditColGroup: function (colgroup, proxy, newWidth) {
            $.each(colgroup, function (index, item) {
                var indentCol = $(item).find("col").length - proxy.model.columns.length;
                if (proxy.model.detailsTemplate != null || proxy.model.childGrid != null) {
                    if (indentCol > 0)
                        indentCol = indentCol - 1;
                }
                $(item).find("col").slice(0, indentCol).css("width", newWidth + "px");
            });
        },
        getFieldNameByHeaderText: function (headerText) {
            if (ej.isNullOrUndefined(this._fieldColumnNames[headerText]))
                return null;
            return this._fieldColumnNames[headerText];
        },
        
        getHeaderTextByFieldName: function (field) {
            if (ej.isNullOrUndefined(this._headerColumnNames[field]))
                return null;
            return this._headerColumnNames[field];
        },
        
        expandAll: function () {
            var recordPlus = this.element.find(".e-recordpluscollapse");
            var detailRow = this._excludeDetailRows().find(".e-detailrowcollapse");
            if (recordPlus.length != 0) {
                for (var i = 0; i < recordPlus.length; i++)
                    this.expandCollapse($(recordPlus[i]));
            }
            if (detailRow.length != 0) {
                for (var i = 0; i < detailRow.length; i++)
                    this.expandCollapse($(detailRow[i]));
            }
        },
        
        collapseAll: function () {
            var recordPlus = this.element.find(".e-recordplusexpand");
            var detailRow = this.element.find(".e-detailrowexpand");
            if (recordPlus.length != 0) {
                for (var i = 0; i < recordPlus.length; i++)
                    this.expandCollapse($(recordPlus[i]));
            }
            if (detailRow.length != 0) {
                for (var i = 0; i < detailRow.length; i++)
                    this.expandCollapse($(detailRow[i]));
            }
        },
        _group: function (args) {
            if (this.model.groupSettings.groupedColumns.length && this.model.currentViewData) {
                this._currentJsonData = [];
                this._groupContextIndex = -1;
                this._summaryContextIndex = -1;
                var temp = document.createElement('div');
                if (!this.model.groupSettings.showGroupedColumn) {
                    if (!this.initialRender && !ej.isNullOrUndefined(args.columnName) && args.requestType == "grouping") {
                        var col = this.getColumnByField(args.columnName);
                        if ($.inArray(args.columnName, this._hiddenColumnsField) == -1) {
                            var hTxt = this.getColumnByField(args.columnName).headerText;
                            this._hiddenColumnsField.push(args.columnName)
                            this._hiddenColumns.push(hTxt);
                            this._visibleColumns.splice(this._visibleColumns.indexOf(hTxt), 1);
                            this._visibleColumnsField.splice(this._visibleColumnsField.indexOf(args.columnName), 1);
                            col.visible = false;
                        }
                    }
                    else {
                        for (var i = 0; i < this.model.groupSettings.groupedColumns.length; i++) {
                            if ($.inArray(this.model.groupSettings.groupedColumns[i], this._hiddenColumnsField) == -1) {
                                this._hiddenColumnsField.push(this.model.groupSettings.groupedColumns[i]);
								this._hiddenColumns.push(this.getColumnByField(this.model.groupSettings.groupedColumns[i]).headerText);
                                this.getColumnByField(this.model.groupSettings.groupedColumns[i]).visible = false;
                            }
                        }
                    }
                    this._hideHeaderColumn(this.model.groupSettings.groupedColumns, true);
                    this.getContentTable().children("colgroup").replaceWith(this.getHeaderTable().find('colgroup').clone());
                }
                if (args.requestType == "reorder")
                    this._isReorder = true;
                else
                    this._isReorder = false;
                var $col = this.getContentTable().children("colgroup").find('col');
                var length = $col.length - this.model.columns.length;
                if (this.model.detailsTemplate != null || this.model.childGrid != null)
                    length--;
                if ($col.length > this.model.columns.length)
                    this.getContentTable().children("colgroup").find('col:lt(' + length + ')').remove();
                if (!this.initialRender) {
                    this.addInitTemplate();
                    this.addGroupingTemplate();
                }
                this.getContentTable().find("colgroup").first().replaceWith(this._getMetaColGroup());
                var dlen;
                if (this.model.detailsTemplate != null || this.model.childGrid != null) {
                    dlen = this.model.groupSettings.groupedColumns.length + 1;
                }
                else
                    dlen = this.model.groupSettings.groupedColumns.length;
                for (var i = 0; i < dlen; i++)
                    this.getContentTable().children("colgroup").prepend(this._getIndentCol());
                if (this.model.currentViewData.length) {
                    var $tbody = this.getContentTable().children('tbody');
                    $tbody.empty();
                    temp.innerHTML = ['<table><tbody>', $.render[this._id + "_GroupingTemplate"](this.model.currentViewData, { groupedColumns: this.model.groupSettings.groupedColumns }), '</tbody></table>'].join("");
                    this.getContentTable().get(0).replaceChild(temp.firstChild.firstChild, this.getContentTable().get(0).lastChild);
                    this._hideCaptionSummaryColumn();
                }
				else if (this.model.isEdit)
                    this.cancelEdit();
                this._groupingAction();
                this._gridRows = this.getContentTable().find(".e-recordtable").find("tbody").find("tr.e-row,tr.e-alt_row").not(".e-gridSummaryRows");
                this._eventBindings();
            }
        },
        _ungroup: function () {
            this._isGrouping = false;
            if (!ej.isNullOrUndefined(this.model.detailsTemplate))
                this._detailsOuterWidth = null;
            var $header = this.element.children(".e-gridheader");
            var $filterInput = $header.find(".e-filterbar").find("th").find("input");
            $header.find("div").first().empty().append(this._renderGridHeader().find("table"));
            this.setGridHeaderContent($header);
            if (this.model.allowFiltering && this.model.filterSettings.filterType == "filterbar") {
                this._renderFiltering();
                this._renderFilterBarTemplate();

                var filterThNew = this.element.children(".e-gridheader").find(".e-filterbar").find("th").find("input");
                for (var i = 0; i < $filterInput.length; i++)
                    filterThNew.eq(i).val($filterInput.eq(i).val());
            }
            if (!this.model.groupSettings.showGroupedColumn)
                this._hideHeaderColumn(this.model.groupSettings.groupedColumns, true);
            this.addInitTemplate();
            this.addGroupingTemplate();
            this._initiateTemplateRendering();
            this.element.find(".e-gridcontent").children("div").first().empty().append(this._renderGridContent().find("table").first());
            this.setGridContent(this.element.find(".e-gridcontent"));
            if (this.model.groupSettings.groupedColumns.length != 0)
                this._gridRows = this.getContentTable().find(".e-recordtable").find("tbody").find("tr").toArray();
            else
                this._gridRows = this.getContentTable().get(0).rows;
           if(this.element.find('.e-groupdroparea').first().hasClass('e-allowDrop'))
				this.element.find('.e-groupdroparea').first().removeClass('e-allowDrop');
        },
        _groupHeaderCellClick: function (e) {
            var $target = $(e.target);
            if ($target.hasClass('e-groupdroparea'))
                return;
            if ($target.hasClass("e-ungroupbutton")) {
                var field = $target.parent().attr("data-ej-mappingname");
                this.ungroupColumn(field);
            } else if ($target.hasClass("e-togglegroupbutton")) {
                var field = $target.parent().attr("data-ej-mappingname");
                $target.hasClass("e-toggleungroup") && this.ungroupColumn(field);
            } else if ($target.hasClass("e-animatebutton")) {
                if (!$(e.target).hasClass("e-animatebuttondown")) {
                    this.collapseGroupDropArea();
                } else {
                    this.expandGroupDropArea();
                }
            }
            else {
                $target.addClass("e-headercelldiv");
                this._mouseClickHandler(e);
                $target.removeClass("e-headercelldiv");
            }           
        },
        _captionSummary: function (nocaption) {
            var summary = null, cols = this.model.summaryRows, k, len = cols.length;
            for (k = 0; k < len; k++) {
                if (cols[k].showCaptionSummary == true) {
                    summary = $(cols[k]);
                    break;
                }
            }
            
            if (nocaption) {
                var left = cols.slice(0, k), right = cols.slice(k + 1, len);
                ej.merge(summary = left, right);
            }

            return summary;
        },
        _dropAreaHover: function (e) {
            var $target = $(e.target), proxy = this;
            if (e.type == "mouseenter") {
                if (this._dragActive) {
                    if ($target.hasClass("e-groupdroparea"))
                        $target.addClass("e-hover");
                } else
                    $target.removeClass("e-hover");
                if ($(e.target).is(".e-icon.e-ascending, .e-descending") || $target.closest(".e-groupheadercell").length) {
                    $target = $(e.target).closest(".e-groupheadercell")
                }
                $target.hasClass("e-groupheadercell") && this.model.groupSettings.showUngroupButton && $target.find(".e-ungroupbutton").show(150);
            } else if (e.type == "mouseleave") {
                if ($target.hasClass("e-groupdroparea")) {
                    $target.find(".e-ungroupbutton").hide(150);
                    $target.removeClass("e-hover");
                }
                if ($(e.target).is(".e-icon.e-ascending, .e-descending") || $target.closest(".e-groupheadercell").length) {
                    $target = $(e.target).closest(".e-groupheadercell")
                }
                $target.hasClass("e-groupheadercell") && this.model.groupSettings.showUngroupButton && $target.find(".e-ungroupbutton").hide(150);
            }
            return false;
        },
        _groupingCompleteAction: function (args) {
            var $groupDrop = this.element.children(".e-groupdroparea");
            if (this.model.groupSettings.groupedColumns.length && $groupDrop.find(".e-grid-icon").length == 0 || ej.Grid.Actions.Refresh == args.requestType)
                $groupDrop.empty();
            if (this.initialRender || ej.Grid.Actions.Refresh == args.requestType) {
                for (var i = 0; i < this.model.groupSettings.groupedColumns.length; i++)
                    this._addColumnToGroupDrop(this.model.groupSettings.groupedColumns[i]);
                this._refreshGridPager();
            } else
                this._addColumnToGroupDrop(args.columnName);
            this.getHeaderTable().find(".e-columnheader").find(".e-headercelldiv").find(".e-number").remove();
            this.getHeaderTable().find(".e-columnheader").find(".e-ascending,.e-descending").remove();
            for (var i = 0; i < this.model.sortSettings.sortedColumns.length; i++)
                this._addSortElementToColumn(this.model.sortSettings.sortedColumns[i].field, this.model.sortSettings.sortedColumns[i].direction);
            if (!this.initialRender && ej.gridFeatures.dragAndDrop)
                this._groupHeaderCelldrag();
            this.model.allowScrolling && this.getContentTable().parent().scrollLeft(this.getHeaderTable().parent().scrollLeft() - 1);
            this.element.children(".e-cloneproperties").remove();
            if (ej.gridFeatures.filter && ["menu", "excel"].indexOf(this.model.filterSettings.filterType))
                this._refreshFilterIcon();
        },
        _ungroupingCompleteAction: function (args) {
            var $groupDrop = this.element.children(".e-groupdroparea");
            if (args.requestType != ej.Grid.Actions.Refresh)
               this._removeColumnFromDrop(args.columnName);
            this.getHeaderTable().find(".e-columnheader").find(".e-headercelldiv").find(".e-number").remove();
            this.getHeaderTable().find(".e-columnheader").find(".e-ascending,.e-descending").remove();
            for (var i = 0; i < this.model.sortSettings.sortedColumns.length; i++)
                this._addSortElementToColumn(this.model.sortSettings.sortedColumns[i].field, this.model.sortSettings.sortedColumns[i].direction);
            if (this.model.groupSettings.groupedColumns.length == 0) {
                $groupDrop.html(this.model.groupSettings.enableDropAreaAutoSizing ? "" : this.localizedLabels.GroupDropArea);
                this.model.groupSettings.enableDropAreaAutoSizing && $groupDrop.append(ej.buildTag("div.e-animatebutton e-icon").addClass(this.model.groupSettings.enableDropAreaAutoSizing ? "e-animatebuttondown e-gdownarrow" : "e-animatebuttonup e-guparrow"));
                $groupDrop.css("height", "auto");
            }
            if (ej.gridFeatures.dragAndDrop)
                this._headerCellgDragDrop();
            if (this.model.allowReordering && ej.gridFeatures.dragAndDrop)
                this._headerCellreorderDragDrop();
            this.model.allowScrolling && this.getContentTable().parent().scrollLeft(this.getHeaderTable().parent().scrollLeft() -1);
            this.element.children(".e-cloneproperties").remove();
            if (ej.gridFeatures.filter && ["menu", "excel"].indexOf(this.model.filterSettings.filterType))
                this._refreshFilterIcon();
        },
        _getToggleButton: function () {
            return ej.buildTag("span.e-togglegroupbutton e-icon e-gridgroupbutton", "&#160;");
        },
        _checkEinHeader: function (field) {
            var $headerCell = this.element.children(".e-gridheader").find("thead").find(".e-columnheader").find(".e-headercell");
            for (var i = 0; i < $headerCell.length; i++) {
                if ($.trim($headerCell.eq(i).find("div").attr("data-ej-mappingname")) == field)
                    return $headerCell.eq(i);
                else if (this.model.allowSorting && this.model.allowMultiSorting) {
                    var header = $($headerCell.eq(i)).clone();
                    header.find(".e-number").remove();
                    if ($.trim(header.find("div").attr("data-ej-mappingname")) == field)
                        return header;
                }
            }
            return null;

        },

        _checkEinGroupDrop: function (field) {
            var $groupHeaderCell = this.element.children(".e-groupdroparea").find(".e-grid-icon");
            for (var i = 0; i < $groupHeaderCell.length; i++) {
                if ($.trim($groupHeaderCell.eq(i).find("div").attr("data-ej-mappingname")) == field)
                    return $groupHeaderCell.eq(i);
            }
            return null;
        },

        _addColumnToGroupDrop: function (field) {
            var $groupedColumn = ej.buildTag("div.e-grid-icon e-groupheadercell"), $groupDropArea = this.element.find(".e-groupdroparea").first();
            var $childDiv = ej.buildTag("div", {}, {}, { "data-ej-mappingname": field }), imageDirection = "e-rarrowup-2x";
            var column = this.getColumnByField(field)
            if (column.disableHtmlEncode)
                $groupedColumn.append($childDiv.text(column.headerText));
            else if (column.headerTemplateID)
                $groupedColumn.append($childDiv.html($(column.headerTemplateID).html()))
            else
                $groupedColumn.append($childDiv.html(column.headerText));
            var $headerCell = this._checkEinHeader(field);
            if (this.model.groupSettings.showToggleButton) {
                $childDiv.append(this._getToggleButton().addClass("e-toggleungroup"));
                $headerCell.find(".e-togglegroupbutton").remove().end().append(this._getToggleButton().addClass("e-toggleungroup"));
            }
            var direction = "ascending";
            if ($headerCell.find(".e-ascending,.e-descending").length) {
                direction = $headerCell.find(".e-ascending,.e-descending").hasClass("e-ascending") ? "ascending" : "descending";
                imageDirection = direction == "ascending" ? "e-rarrowup-2x" : "e-rarrowdown-2x";
            }
            $childDiv.append(this._createSortElement().addClass("e-" + direction + " " + imageDirection));
            this.model.groupSettings.showUngroupButton && $childDiv.append(ej.buildTag("span.e-ungroupbutton e-icon e-cancel", " ", {}, { title: this.localizedLabels.UnGroup }));
            $groupDropArea.append($groupedColumn).css("height", "auto");
            var left = $groupedColumn.offset().left, $cloned = $groupedColumn.clone().css("position", "absolute"), proxy = this;
            $groupedColumn.css("visibility", "hidden")
            $groupDropArea.append($cloned).dequeue();
            $cloned.css({ "left": left + 150 }).animate({ left: left }, 150, function (e) {
                $groupedColumn.css("visibility", "visible");
                $cloned.remove();
            });
        },
        _removeColumnFromDrop: function (field) {
            var headerText = this.getHeaderTextByFieldName(field), proxy = this, $groupDropArea = this.element.children(".e-groupdroparea");
            var $groupHeaderCell = $groupDropArea.css("height", "30px").find(".e-grid-icon");
            for (var i = 0; i < $groupHeaderCell.length; i++) {
                if ($.trim($groupHeaderCell.eq(i).find("div").attr("data-ej-mappingname")) == field) {
                    if (this.model.groupSettings.groupedColumns.length == 0) {
                        this.collapseGroupDropArea();
                    } else
                        $groupHeaderCell.eq(i).remove();
                }
            }
        },
        _setAggreatedCollection: function (clonedQuery) {
            if ((this._dataSource() instanceof ej.DataManager && this._dataManager.dataSource.url != undefined && !this._isRemoteSaveAdaptor && !this._dataManager.dataSource.offline) || this.model.enableLoadOnDemand)
                return;
            var data;
            data = this._dataManager.executeLocal(clonedQuery).result;
            this._aggregatedCollection = data;
        },
        _setAggregates: function (data, collection) {
            var indx, pred, query = new ej.Query();
            data = data || this.model.currentViewData, collection = collection || this._aggregatedCollection;
            var dLen = data.length, cLen;
            if (dLen != 0){
                var fieldPred = ej.Predicate("field", "equal", data[0].field), keyPred = ej.Predicate("key", "equal", data[0].key);
                if(data[0].key instanceof Date) {
                    var dateObject = { value: data[0].key, operator : "equal", field : "key" };
                    keyPred = this._setDateFilters(dateObject,true);
                }
                pred = (fieldPred["and"](keyPred));
            }
            for (indx = 1; indx < dLen; indx++) {
                var fieldPred = ej.Predicate("field", "equal", data[indx].field), keyPred = ej.Predicate("key", "equal", data[indx].key);
                if(data[indx].key instanceof Date) {
                    var dateObject = { value: data[indx].key, operator : "equal", field : "key" };
                    keyPred = this._setDateFilters(dateObject,true);
                }
                pred = pred["or"](fieldPred["and"](keyPred));
            }
            collection = pred ? new ej.DataManager(collection).executeLocal(query.where(pred)) : collection;
            if(!ej.isNullOrUndefined(collection))
			cLen = collection.length;
            if (data.length > 0) {
                for (indx = 0; indx < cLen; indx++) {
                    if (indx > 0 && indx < cLen - 1) continue;
                    data[indx].count = collection[indx].count; 
                    if (data[indx].items.GROUPGUID)
                        this._setAggregates(data[indx].items, collection[indx].items);
                    if (this.model.showSummary) { 
                        var agg = data[indx]["aggregates"] = [];
                        var rows = this.model.summaryRows, scolumns, summaryData;
                        for (var row = 0, rlen = rows.length; row < rlen; row++) {
                            scolumns = rows[row].summaryColumns;
                            for (var col = 0, clen = scolumns.length; col < clen; col++) {
                                summaryData = collection[indx].items.level ? collection[indx].items.records : collection[indx].items;
                                agg[scolumns[col].dataMember + " - " + scolumns[col].summaryType] = this.getSummaryValues(scolumns[col], summaryData);
                            }
                        }
                    }
                }
            }
        },
    };
})(jQuery, Syncfusion);