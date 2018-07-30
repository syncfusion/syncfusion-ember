(function ($, ej, undefined) {
    ej.gridFeatures = ej.gridFeatures || {};
    ej.gridFeatures.sort = {
        _addSortElementToColumn: function (field, direction) {
            var duplicateColumn = ej.DataManager(this.model.columns).executeLocal(ej.Query().where("field", "equal", field)), imageDirection;
            if (duplicateColumn.length > 1)
                var column = this.getColumnByHeaderText(this._$curSElementTarget.text());
            else
                var column = this.getColumnByField(field);
            if (ej.isNullOrUndefined(column))
                return;
            var index = $.inArray(column, this.model.columns);
            var sortcolumn = this.getsortColumnByField(field);
            var sortindex = $.inArray(sortcolumn, this.model.sortSettings.sortedColumns);
            var $headerCell = this.getHeaderTable().find("thead tr:not('.e-stackedHeaderRow')").find(".e-headercell").not(".e-detailheadercell").eq(index);
            var $headerCellDiv = $headerCell.find(".e-headercelldiv");
            var $filterset = $headerCell.find(".e-filterset");
            var $togglegroup = $headerCell.find(".e-gridgroupbutton");
            if($filterset.length && $togglegroup.length) {
              if(!this.model.enableRTL) {
                $headerCell.addClass("e-headercellsortgroupfilter");
                $filterset.addClass("e-sortfiltergroupicon");
                $togglegroup.addClass("e-togglesortgroupfilter");
              }
              else 
                $headerCellDiv.addClass("e-headercelldivsortgroupfilter");
            }
            else if($filterset.length) {
                if(!this.model.enableRTL) {
                    $headerCell.addClass("e-headercellsortfilter");
                    $filterset.addClass("e-sortfiltericon");
                }
                else
                    $headerCellDiv.addClass("e-headercellsortfilter");
            }
            else if($togglegroup.length) {
                if(!this.model.enableRTL) {
                    $headerCell.addClass("e-headercellsortfilter");
                    $togglegroup.addClass("e-sortgroupicon");
                }
                else
                    $headerCellDiv.addClass("e-headercellsortfilter");
                if(this.model.enableRTL && !$filterset.length) 
                    $togglegroup.addClass("e-rtltoggle");
            }
            else
                $headerCell.addClass("e-headercellsort");
            direction = ej.isNullOrUndefined(direction) ? "ascending" : direction.toLowerCase();
            $headerCell.find(".e-ascending,.e-descending").remove();
            if (this.model.allowGrouping && this.model.groupSettings.groupedColumns.length != 0)
                this.element.find(".e-groupdroparea").find("div[data-ej-mappingname='" + field + "']").find(".e-ascending,.e-descending").not(".e-ungroupbutton").remove();
            imageDirection = direction != "descending" ? "e-rarrowup-2x" : "e-rarrowdown-2x";
            var opacity = 1;
            if (this.model.allowSorting && this.model.allowMultiSorting && this.model.sortSettings.sortedColumns.length > 1) {
                for (var i = 1; i <= sortindex; i++) {
                    opacity = opacity + 1;
                }
                if ($headerCellDiv.css("text-align") == "right") {
                    $headerCellDiv.prepend(this._createSortNumber(opacity, $headerCellDiv).addClass("e-sortnumber"));
                    $headerCell.append(this._createSortElement().addClass("e-" + (direction || "ascending") + " " + imageDirection));
                }
                else {
                    $headerCellDiv.prepend(this._createSortNumber(opacity, $headerCellDiv).addClass("e-sortnumber"));
                    $headerCell.append(this._createSortElement().addClass("e-" + (direction || "ascending") + " " + imageDirection));
                }
            }
            else
                $headerCell.append(this._createSortElement().addClass("e-" + (direction || "ascending") + " " + imageDirection));
           if(this.model.enableRTL) {
               if($filterset.length && $togglegroup.length)
                    $headerCell.find(".e-ascending,.e-descending").addClass("e-rtlsortfiltertoggle");
               else if($filterset.length || $togglegroup.length)
                    $headerCell.find(".e-ascending,.e-descending").addClass("e-rtlgrouporfilter");
               else
                    $headerCell.find(".e-ascending,.e-descending").addClass("e-rtlsortadjust");
            }
            else if(!this.model.enableRTL && !$filterset.length && !$togglegroup.length)
                $headerCell.find(".e-ascending,.e-descending").addClass("e-sortadjust");
            if (this.model.allowGrouping && this.model.groupSettings.groupedColumns.length != 0)
                this.element.find(".e-groupdroparea").find("div[data-ej-mappingname='" + field + "']").append(this._createSortElement().addClass("e-" + (direction || "ascending") + " " + imageDirection));
            $headerCellDiv.parent().attr("aria-sort", direction);
        },
        _removeSortElementFromColumn: function (field) {
            var column = this.getColumnByField(field);
            var index = $.inArray(column, this.model.columns);
            var $headerCellDiv = this.getHeaderTable().find("thead").find(".e-headercell").not(".e-detailheadercell").eq(index).find(".e-headercelldiv");
            $headerCellDiv.find(".e-ascending,.e-descending").remove();
            $headerCellDiv.parent().prop("aria-sort",false);
        },
        _sortCompleteAction: function (args) {
            var imageDirection, prevCol;
            var $columnheader = this.getHeaderTable().find(".e-columnheader");
            prevCol = this.getHeaderTable().find(".e-columnheader").find(".e-headercelldiv").find(".e-ascending,.e-descending,.e-number").parent().attr('data-ej-mappingname');
            $columnheader.find(".e-headercell")
                    .find(".e-ascending,.e-descending,.e-number").remove();
            var $filterset = $columnheader.find(".e-filterset");
            var $togglegroup = $columnheader.find(".e-gridgroupbutton");
            if($filterset.length || $togglegroup.length)  {
                $columnheader.find(".e-sortfiltericon").removeClass("e-sortfiltericon");
                $columnheader.find(".e-headercellsortfilter").removeClass("e-headercellsortfilter");
                $columnheader.find(".e-sortgroupicon").removeClass("e-sortgroupicon");
                $columnheader.find(".e-headercellsortgroupfilter").removeClass("e-headercellsortgroupfilter");
                $columnheader.find(".e-headercelldivsortgroupfilter").removeClass("e-headercelldivsortgroupfilter");
                $columnheader.find(".e-sortfiltergroupicon").removeClass("e-sortfiltergroupicon");
                $columnheader.find(".e-togglesortgroupfilter").removeClass("e-togglesortgroupfilter");
            }
            else
                $columnheader.find(".e-headercellsort").removeClass("e-headercellsort");
            $(this.getHeaderTable().find(".e-columnheader").find(".e-headercell:not(.e-stackedHeaderCell,.e-detailheadercell,.e-hide)")[this.getColumnIndexByField(prevCol)]).removeAttr("aria-sort");
            if (this.model.allowGrouping && this.model.groupSettings.groupedColumns.length != 0)
                this.element.find(".e-groupdroparea").find("div[data-ej-mappingname='" + args.columnName + "']").find(".e-ascending,.e-descending,.e-number").not(".e-ungroupbutton").remove();
            this.getHeaderTable().find("[aria-sort]").prop("aria-sort",false);
            for (var i = 0; i < this.model.sortSettings.sortedColumns.length; i++)
                this._addSortElementToColumn(this.model.sortSettings.sortedColumns[i].field, this.model.sortSettings.sortedColumns[i].direction);
            if (this.model.groupSettings.groupedColumns.length && this._$curSElementTarget != null) {
                var $element = this._checkEinGroupDrop($.trim(this._$curSElementTarget.attr("data-ej-mappingname")));
                if (!ej.isNullOrUndefined($element)) {
                    imageDirection = (ej.isNullOrUndefined(args.columnSortDirection) || args.columnSortDirection == "" ? this.getsortColumnByField(this._$curSElementTarget.attr("data-ej-mappingname")).direction.toLowerCase() : args.columnSortDirection) == "ascending" ? "e-rarrowup-2x" : "e-rarrowdown-2x"
                    $element.find(".e-ascending,.e-descending").removeClass().addClass("e-icon e-" + (ej.isNullOrUndefined(args.columnSortDirection) || args.columnSortDirection == "" ? this.getsortColumnByField(this._$curSElementTarget.attr("data-ej-mappingname")).direction.toLowerCase() : args.columnSortDirection) + " " + imageDirection);
                }
            }
            this.multiSortRequest = false;
            if ((!this.model.allowScrolling && !this.model.allowResizeToFit) || !this.initialRender || this.model.scrollSettings.frozenRows > 0 || this.model.scrollSettings.frozenColumns > 0)
                this.setWidthToColumns();
        },
        
        removeSortedColumns: function (fieldName) {
            if ($.isArray(fieldName)) {
                for (var i = 0; i < fieldName.length; i++) {
                    this._removeSortedColumnFromCollection(fieldName[i]);
                }
            }
            else
                this._removeSortedColumnFromCollection(fieldName);
            this.multiSortRequest = true;
            this.sortColumn(null, null);
        },
        _removeSortedColumnFromCollection: function (fieldName) {
            for (var i = 0; i < this.model.sortSettings.sortedColumns.length; i++) {
                if (this.model.sortSettings.sortedColumns[i].field == fieldName) {
                    this.model.sortSettings.sortedColumns.splice(i, 1);
                    break;
                }
            }
        },
        
        clearSorting: function () {
            var proxy = this;
            this.model.sortSettings.sortedColumns = $.grep(this.model.sortSettings.sortedColumns, function (value, index) {
                if ($.inArray(value.field, proxy.model.groupSettings.groupedColumns) != -1)
                    return true;
                return false;
            });
            this._$prevSElementTarget = null;
            this._$curSElementTarget = null;
            this.refreshContent();
        },
        
        sortColumn: function (columnName, columnSortDirection) {
            if (!this.model.allowSorting || $.inArray(columnName, this._disabledSortableColumns) != -1 || (columnName != null && columnName.length == 0))
                return;
            var args = {};
            if (!this.multiSortRequest) {
                var proxy = this;
                this.model.sortSettings.sortedColumns = $.grep(this.model.sortSettings.sortedColumns, function (value, index) {
                    if ($.inArray(value.field, proxy.model.groupSettings.groupedColumns) != -1)
                        return true;
                    return false;
                });
            }
            args.requestType = ej.Grid.Actions.Sorting;
            this._cSortedColumn = args.columnName = columnName;
            this._cSortedDirection = args.columnSortDirection = ej.isNullOrUndefined(columnSortDirection) ? ej.sortOrder.Ascending : columnSortDirection.toLowerCase();
            if (this._cSortedColumn !== null) {
                this._removeSortedColumnFromCollection(columnName);
                this.model.sortSettings.sortedColumns.push({ field: this._cSortedColumn, direction: this._cSortedDirection });
            }
            var returnValue = this._processBindings(args);
            if (returnValue)
                this._cSortedDirection = this._cSortedColumn = null;
            this._primaryKeyValues = [];
        },
        _createSortElement: function () {
            return ej.buildTag('span.e-icon', "&#160;");
        },
        _renderMultiTouchDialog: function () {
            this._customPop = ej.buildTag("div.e-gridpopup", "", { display: "none" });
            var $content = ej.buildTag("div.e-content"), $downTail = ej.buildTag("div.e-downtail e-tail");
            if (this.model.allowMultiSorting) {
                var $selElement = ej.buildTag("span.e-sortdirect e-icon");
                $content.append($selElement);
            }
            if (this.model.selectionType == "multiple") {
                var $selElement = ej.buildTag("span.e-rowselect e-icon");
                $content.append($selElement);
            }
            this._customPop.append($content);
            this._customPop.append($downTail);
            this.element.append(this._customPop);
        },

    };
})(jQuery, Syncfusion);