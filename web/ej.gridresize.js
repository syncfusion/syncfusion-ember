(function ($, ej, undefined) {
    ej.gridFeatures = ej.gridFeatures || {};
    ej.gridFeatures.gridResize = function (instance) {
        this.$headerTable = instance.getHeaderTable();
        this.gridInstance = instance;
        this._colMinWidth = 15;
        this._$visualElement = $();
        this._currentCell = -1;
        this._allowStart = false;
        this._oldWidth = null;
        this._orgX = null;
        this._orgY = null;
        this._extra = null;
        this._expand = false;
        this._target = null;
        this._cellIndex = -1;
    }

    ej.gridFeatures.gridResize.prototype = {
        _mouseHover: function (e) {
            if (this._$visualElement.is(":visible"))
                return;
            this._allowStart = false;
            if ($(e.target).is(".e-headercelldiv"))
                e.target = e.target.parentNode;
            var $target = $(e.target);
			if ($(e.target).hasClass("e-filtericon") && ($(e.target).css("cursor") == "col-resize" || $(e.target).closest("tr").css("cursor") == "col-resize")) {
                $(e.target).css("cursor", "pointer");
                $(e.target).closest("tr").css("cursor", "pointer");
            }
            if ($target.hasClass("e-headercell")) {
                var _resizableCell = e.target;
                var location = _resizableCell.getBoundingClientRect(), _x = 0, _y = 0;
                if (e.type = "mousemove") {
                    _x = e.clientX;
                    _y = e.clientY;
                }
                else if (e.type = "touchmove") {
                    _x = evt.originalEvent.changedTouches[0].clientX;
                    _y = evt.originalEvent.changedTouches[0].clientY;
                }
                else if (e.type = "MSPointerMove") {
                    _x = e.originalEvent.clientX;
                    _y = e.originalEvent.clientY;
                }
                if (this.gridInstance.model.scrollSettings && this.gridInstance.model.scrollSettings.frozenColumns)
                    var _nlx = this.gridInstance.getHeaderContent().width() + this.gridInstance.element.children(".e-gridheader").find(".e-columnheader").offset().left;
                else
                    var _nlx = this.gridInstance.getHeaderTable().width() + this.gridInstance.element.children(".e-gridheader").find(".e-columnheader").offset().left;
                if (((_x >= (location.left + document.documentElement.scrollLeft + _resizableCell.offsetWidth - 5)) || ((_x <= (location.left + 3)))) && (_x < _nlx) && (_x >= location.left) && (_y <= location.top + document.documentElement.scrollTop + e.target.offsetHeight)) {
                    if (_x > location.left + 3)
                        var tempTarget = $(e.target).find(".e-headercelldiv");
                    else
                        var tempTarget = $(e.target).prevAll("th:visible:first").find(".e-headercelldiv");
                    var windowScrollX = window.pageXOffset || document.documentElement.scrollTop || document.body.scrollTop;
                    var _lx = (this.gridInstance.element.find(".e-headercell").not('.e-detailheadercell').offset().left + 10) - windowScrollX;
                    if ((this.gridInstance.model.enableRTL && (_x <= _lx)) || (!this.gridInstance.model.enableRTL && (_x >= _lx))) {
                        if ((this.gridInstance.model.showStackedHeader || tempTarget.length) && $.inArray($(tempTarget).attr("data-ej-mappingname"), this.gridInstance._disabledResizingColumns) == -1) {
                            this.gridInstance.model.showStackedHeader && $($target.parents('thead')).find('tr').css("cursor", "col-resize");
                            !this.gridInstance.model.showStackedHeader && $target.parent().css("cursor", "col-resize");
                            if ($(e.target).hasClass('e-stackedHeaderCell'))
                                this._currentCell = this.gridInstance.getHeaderContent().find(".e-headercell:visible").index(_resizableCell);
                            else
                                this._currentCell = this.gridInstance.getHeaderContent().find(".e-headercell:visible").not(".e-stackedHeaderCell,.e-detailheadercell").index(_resizableCell);
                            if (this.gridInstance.model.enableRTL)
                                this._currentCell = this._currentCell - 1;
                            this._allowStart = true;
                        }
                        else {
                            $target.parent().css("cursor", "pointer");
                            this._currentCell = -1;
                        }
                    }
                }
                else {
                    this.gridInstance.element.find(".e-columnheader").css("cursor", "pointer");
                    this._currentCell = -1;
                }
            }
        },
        _start: function (_x, _y) {
            var _myrow = this.gridInstance.getHeaderTable().find(".e-columnheader"), _top;
            var _cells, _mycel;
            if ($(this._target).hasClass('e-stackedHeaderCell'))
                _cells = _myrow.find(".e-headercell").not(".e-hide");
            else
                _cells = _myrow.find(".e-headercell").not(".e-stackedHeaderCell,.e-hide");
            if (this._currentCell != -1 && this._currentCell < _cells.length)
                _mycel = _cells[this._currentCell];
            if (typeof (_mycel) == 'undefined')
                return;
            var _j = _mycel.getBoundingClientRect();
            _top = this._tableY = _j.top + parseInt(navigator.userAgent.indexOf("WebKit") != -1 ? document.body.scrollTop : document.documentElement.scrollTop);
            if (this._allowStart) {
                var vElement = this._$visualElement = $(document.createElement('div')),
                _height = this.gridInstance.element.find(".e-gridcontent").first().height() + this.gridInstance.element.find(".e-gridheader").height();
                if (this.gridInstance.model.showStackedHeader && this.gridInstance.model.stackedHeaderRows.length > 0) {
                    var headerRow = this.gridInstance.getHeaderTable().find('tr.e-columnheader')
                    var lenght = headerRow.length;
                    var currentIndex = $(this._target).parent('tr')[0].rowIndex;
                    for (var i = 0; i < currentIndex; i++) {
                        _height = _height - $(headerRow[i]).height();
                    }
                    // _height = _height - $(".e-stackedHeaderRow").height();
                }
                vElement.addClass("e-reSizeColbg").appendTo(this.gridInstance.element).attr("unselectable", "on").css("visibility", "hidden");
                this.gridInstance._resizeTimeOut = setTimeout(function() {
                    vElement.css({ visibility: "visible", height: _height + 'px', cursor: 'col-resize', left: _x, top: _top, position: 'fixed' });
                }, 100);
                this._oldWidth = _mycel.offsetWidth;
                this._orgX = _x;
                this._orgY = _y;
                this._extra = _x - this._orgX;
                this._expand = true;
            }
            else {
                this._currentCell = -1;
            }
        },
        _mouseMove: function (e) {
            if (this._expand) {
                var _x = 0, _y = 0;
                if (e.type == "mousemove") {
                    _x = e.clientX;
                    _y = e.clientY;
                }                
                else if (e.type == "MSPointerMove") {
                    _x = e.originalEvent.clientX;
                    _y = e.originalEvent.clientY;
                }
                else if (e.type == "touchmove") {
                    _x = e.originalEvent.changedTouches[0].clientX;
                    _y = e.originalEvent.changedTouches[0].clientY;
                }
                if ((_x == 0 && _y == 0) && navigator.userAgent.indexOf("WebKit") != -1) {
                    _x = e.pageX;
                    _y = e.pageY;
                }
                _x += document.documentElement.scrollLeft;
                e.preventDefault();
                this._moveVisual(_x);
            }
            else
                this._mouseHover(e);
        },
        _touchStart: function (e) {
            if (this._$visualElement.is(":visible"))
                return;
            this._allowStart = false;
            if ($(e.target).is(".e-headercelldiv"))
                e.target = e.target.parentNode;
            var $target = $(e.target);            
            if ($target.hasClass("e-headercell")) {
                var _resizableCell = e.target;
                var location = _resizableCell.getBoundingClientRect(), _x = 0, _y = 0;
                if (e.type == "touchstart") {
                    _x = e.originalEvent.changedTouches[0].clientX;
                    _y = e.originalEvent.changedTouches[0].clientY;
                }
                var gridInstChildren = this.gridInstance.element.children(".e-gridheader");
                if (this.gridInstance.model.scrollSettings && this.gridInstance.model.scrollSettings.frozenColumns)
                    var _nlx = this.gridInstance.getHeaderContent().width() + gridInstChildren.find(".e-columnheader").offset().left;
                else
                    var _nlx = this.gridInstance.getHeaderTable().width() + gridInstChildren.find(".e-columnheader").offset().left;
                if (((_x >= (location.left + document.documentElement.scrollLeft + _resizableCell.offsetWidth - 10)) || ((_x <= (location.left + 8)))) && (_x < _nlx) && (_x >= location.left) && (_y <= location.top + document.documentElement.scrollTop + e.target.offsetHeight)) {
                    if (_x > location.left + 8)
                        var tempTarget = $(e.target).find(".e-headercelldiv");
                    else
                        var tempTarget = $(e.target).prevAll("th:visible:first").find(".e-headercelldiv");
                    var windowScrollX = window.pageXOffset || document.documentElement.scrollTop || document.body.scrollTop;
                    var _lx = (this.gridInstance.element.find(".e-headercell").not('.e-detailheadercell').offset().left + 10) - windowScrollX;
                    if ((this.gridInstance.model.enableRTL && (_x <= _lx)) || (!this.gridInstance.model.enableRTL && (_x >= _lx))) {
                        if ((this.gridInstance.model.showStackedHeader || tempTarget.length) && $.inArray($(tempTarget).attr("data-ej-mappingname"), this.gridInstance._disabledResizingColumns) == -1) {                            
                            if ($(e.target).hasClass('e-stackedHeaderCell'))
                                this._currentCell = this.gridInstance.getHeaderContent().find(".e-headercell:visible").index(_resizableCell);
                            else
                                this._currentCell = this.gridInstance.getHeaderContent().find(".e-headercell:visible").not(".e-stackedHeaderCell,.e-detailheadercell").index(_resizableCell);
                            if (this.gridInstance.model.enableRTL)
                                this._currentCell = this._currentCell - 1;
                            this._allowStart = true;
                        }
                        else {                            
                            this._currentCell = -1;
                        }
                    }
                }
                else {                    
                    this._currentCell = -1;
                }
            }
            if (this._allowStart) {
                this._target = $target;
                if (this.gridInstance.pluginName == "ejGrid" && this.gridInstance.model.allowResizing) {                    
                    if (this._triggerResizeEvents("resizeStart", _x))
                        return;
                } else if (this.gridInstance.pluginName == "ejTreeGrid" && this.gridInstance.model.allowColumnResize) {
                    if (this.gridInstance._triggerColumnResize("columnResizeStart", _x, e))
                        return;
                }
                var gridobj = this;
                _x += document.documentElement.scrollLeft;
                if (e.button != 2)
                    this._start(_x, _y);
                return false;
            }
            return true;
        },
        _getCellIndex: function (e) {
            var $target = $(e._target);
            var targetCell = e._target;
            var location = targetCell.getBoundingClientRect();
            var scrollLeft = navigator.userAgent.indexOf("WebKit") != -1 ? document.body.scrollLeft : document.documentElement.scrollLeft;
            if (this._orgX < location.left + 5 + scrollLeft)
                targetCell = $(targetCell).prevAll(":visible:first")[0];
            var hCellIndex = targetCell.cellIndex;
            var cellIndex = hCellIndex;
            if (e.gridInstance.model.groupSettings.groupedColumns.length) {
                cellIndex = hCellIndex - e.gridInstance.model.groupSettings.groupedColumns.length;
            }
            return cellIndex;
        },
        _reSize: function (_x, _y) {
            // Function used for Resizing the column
            var proxy = this;
            var resized = false, $content;
            if (this.gridInstance.model.scrollSettings && this.gridInstance.model.scrollSettings.frozenColumns)
                this._initialTableWidth = this.gridInstance.getHeaderTable().first().parent().width() + this.gridInstance.getHeaderTable().last().parent().width();
            else
                this._initialTableWidth = this.gridInstance.getHeaderTable().parent().width();
            if (this.gridInstance.model.enableRTL && (this.gridInstance.model.detailsTemplate || this.gridInstance.model.childGrid))
                this._currentCell = this._currentCell - 1;
            else
                !this.gridInstance.model.enableRTL && this._getResizableCell();
            if (this.gridInstance.model.scrollSettings && this.gridInstance.model.scrollSettings.frozenColumns > 0)
                var _rowobj = this.gridInstance.getHeaderTable().find('thead');
            else
                var _rowobj = $(this._target).parents('thead');
            if (this._currentCell != -1 && this._expand) {
                this._expand = false;
                var _childTH = $(this._target).hasClass('e-stackedHeaderCell') ? _rowobj.find(".e-headercell:not(.e-detailheadercell)").filter(":visible") : _rowobj.find(".e-headercell:not(.e-detailheadercell,.e-stackedHeaderCell)").filter(":visible");
                var _outerCell = _childTH[this._currentCell];
                var _oldWidth = _outerCell.offsetWidth;
                var _extra = _x - this._orgX;
                if (this.gridInstance.model.enableRTL)
                    _extra = -_extra;
                //Check whether the column minimum width reached
                if (parseInt(_extra) + parseInt(_oldWidth) > this._colMinWidth) {
                    if (_extra != 0)
                        _rowobj.css("cursor", 'default');
                     var $prevheaderCol, oldColWidth;
                    if (ej.getObject("resizeSettings.resizeMode", this.gridInstance.model) == 'nextcolumn') {
                     var $prevheaderCols = this.gridInstance.getHeaderTable().find('colgroup').find("col");
                     if (!ej.isNullOrUndefined(this.gridInstance.model.detailsTemplate || this.gridInstance.model.childGrid)) {
                     this.gridInstance._detailColsRefresh();
                    $prevheaderCols = this.gridInstance._$headerCols;
                   }
                    var $prevheaderCol = $prevheaderCols.filter(this._diaplayFinder).eq(!this.gridInstance.model.allowGrouping || !ej.isNullOrUndefined(this.gridInstance.model.detailsTemplate || this.gridInstance.model.childGrid) ? this._currentCell : this._currentCell + this.gridInstance.model.groupSettings.groupedColumns.length)
                    var oldColWidth = $prevheaderCol.width();
                   }
                    this._resizeColumnUsingDiff(_oldWidth, _extra);
                    $content = this.gridInstance.element.find(".e-gridcontent").first();
                    var scrollContent = $content.find("div").hasClass("e-content");                    
                    var browser = !ej.isIOSWebView() && this.gridInstance.getBrowserDetails();
                    if (browser && browser.browser == "msie" && this.gridInstance.model.allowScrolling) {
                        var oldWidth = this.gridInstance.getContentTable().width(), newwidth = this.gridInstance._calculateWidth();
                        if (this.gridInstance.model.scrollSettings && this.gridInstance.model.scrollSettings.frozenColumns > 0) {
                            if (this.gridInstance.model.showSummary && !ej.isNullOrUndefined(this.gridInstance.getFooterContent()))
                                this.gridInstance.getFooterTable().last().width(newwidth - this.gridInstance.getFooterContent().find(".e-frozenfootertdiv").width());
                        }
                        else {
                            if (newwidth > oldWidth) {
                                this.gridInstance.model.showSummary && this.gridInstance.getFooterTable().width(newwidth);
                            }
                        }
                        if (parseInt(browser.version, 10) > 8 && this.gridInstance.model.groupSettings && this.gridInstance.model.groupSettings.groupedColumns.length) {
                            if (newwidth > oldWidth) {
                                this.gridInstance.getContentTable().children("colgroup").find("col").first().css("width", (20 / $content.find("table").first().width()) * 100 + "%");
                            }
                            else {
                                this.gridInstance.getContentTable().css("width", "100%");
                                this.gridInstance._groupingAction(true);
                                this.gridInstance.getContentTable().children("colgroup").find("col").first().css("width", ((this.gridInstance.getHeaderTable().find("colgroup").find("col").first().width() / $content.find("table").first().width()) * 100).toFixed(2) + "%");
                            }
                        }
                        this.gridInstance.getHeaderTable().parent().scrollLeft($content.find(".e-content").scrollLeft() - 1);
                    }
                    this.gridInstance._colgroupRefresh();
                    if (this.gridInstance.model.allowTextWrap)
                        this.gridInstance.rowHeightRefresh();
                    if (this.gridInstance.model.groupSettings.groupedColumns.length && !this.gridInstance.model.isEdit)
                        this.gridInstance._recalculateIndentWidth();
                    if (ej.getObject("resizeSettings.resizeMode", this.gridInstance.model) != 'normal') {
                        if (ej.getObject("resizeSettings.resizeMode", this.gridInstance.model) == 'nextcolumn') {
                            var $headerCols = this.gridInstance.getHeaderTable().find('colgroup').find("col");
                            var $ContentCols = this.gridInstance.getContentTable().find('colgroup').find("col");
                            if (!ej.isNullOrUndefined(this.gridInstance.model.detailsTemplate || this.gridInstance.model.childGrid)) {
                                this.gridInstance._detailColsRefresh();
                                $headerCols = this.gridInstance._$headerCols;
                                $ContentCols = this.gridInstance._$contentCols;
                            }
                            var nextCell = this._currentCell + 1;
                            var $headerCol = $headerCols.filter(this._diaplayFinder).eq(!this.gridInstance.model.allowGrouping || !ej.isNullOrUndefined(this.gridInstance.model.detailsTemplate) ? nextCell : nextCell + this.gridInstance.model.groupSettings.groupedColumns.length)
                            var newWidth = $headerCol.width() + (oldColWidth - $prevheaderCol.width()), $ContentCol;
                            if (newWidth < this._colMinWidth)
                                newWidth = this._colMinWidth;
                            $headerCol.width(newWidth);
                            if (this.gridInstance.model.groupSettings && this.gridInstance.model.groupSettings.groupedColumns.length) {
                                var $tables = this.gridInstance.getContentTable().find(".e-recordtable");
                                var $colGroup = $tables.find("colgroup");
                                var colCount = this.gridInstance.getVisibleColumnNames().length;
                                if (this.gridInstance.getContentTable().find('.e-detailrow').length)
                                    $colGroup = $colGroup.not($tables.find(".e-detailrow").find("colgroup")).get();
                                for (var i = 0 ; i < $colGroup.length; i++) {
                                    var cols = $($colGroup[i]).find("col").filter(this._diaplayFinder);
                                    if (cols.length > colCount) cols.splice(0, (cols.length - colCount));
                                    $(cols[nextCell]).width(newWidth);
                                }
                            }
                            if (this.gridInstance.model.scrollSettings && this.gridInstance.model.scrollSettings.frozenColumns) {
                                if (nextCell >= 0 && nextCell < this.gridInstance.model.scrollSettings.frozenColumns && this._getFrozenResizeWidth() + _extra > this.gridInstance.element.find(".e-headercontent").first().width())
                                    return;
                                $ContentCol = $ContentCols.filter(this._diaplayFinder).eq(nextCell);
                            }
                            else
                                $ContentCol = $ContentCols.filter(this._diaplayFinder).eq(!this.gridInstance.model.allowGrouping || !ej.isNullOrUndefined(this.gridInstance.model.detailsTemplate) ? nextCell : nextCell + this.gridInstance.model.groupSettings.groupedColumns.length);
                            $ContentCol.width(newWidth);
                            this.gridInstance._findColumnsWidth();
                            if (this.gridInstance.model.scrollSettings.frozenColumns > 0 && $(_outerCell).is(":last-child") && this.gridInstance.pluginName == "ejGrid") {
                                var val = $prevheaderCol.width() - oldColWidth;
                                var frozenWidth = this.gridInstance.getHeaderContent().find('.e-frozenheaderdiv').width() + val;
                                var movableWidth = this.gridInstance.getHeaderContent().find('.e-movableheaderdiv').width() - val;
                                var marginLeft = parseInt(this.gridInstance.getHeaderContent().find('.e-movableheader')[0].style["margin-left"]) + val;
                                this.gridInstance.getHeaderContent().find('.e-frozenheaderdiv').width(frozenWidth);
                                this.gridInstance.getContent().find('.e-frozencontentdiv').width(frozenWidth);
                                if(this.gridInstance.model.showSummary && !ej.isNullOrUndefined(this.gridInstance.getFooterContent()))
                                    this.gridInstance.getFooterContent().find('.e-frozenfooterdiv').width(frozenWidth);
                                this.gridInstance.getHeaderContent().find('.e-movableheaderdiv').width(movableWidth);
                                this.gridInstance.getContent().find('.e-movablecontentdiv').width(movableWidth);
                                if(this.gridInstance.model.showSummary && !ej.isNullOrUndefined(this.gridInstance.getFooterContent()))
                                    this.gridInstance.getFooterContent().find('.e-movablefooterdiv').width(movableWidth);
                                this.gridInstance.getHeaderContent().find('.e-movableheader').css("margin-left", marginLeft);
                                this.gridInstance.getContent().find('.e-movablecontent').css("margin-left", marginLeft);
                                if(this.gridInstance.model.showSummary && !ej.isNullOrUndefined(this.gridInstance.getFooterContent()))
                                    this.gridInstance.getFooterContent().find('.e-movablefooter').css("margin-left", marginLeft);
                            }
                            if (this.gridInstance.model.scrollSettings.frozenColumns > 0 && $(_outerCell).is(":last-child") && this.gridInstance.pluginName == "ejTreeGrid") {
                                var val = $prevheaderCol.width() - oldColWidth;
                                var frozenWidth = this.gridInstance.getHeaderContent().find('.e-frozenheaderdiv').width() + val;
                                var movableWidth = this.gridInstance.getHeaderContent().find('.e-movableheaderdiv').width() - val;
                                var marginLeft = parseInt(this.gridInstance.getHeaderContent().find('.e-movableheader')[0].style["margin-left"]) + val;
                                this.gridInstance.getHeaderContent().find('.e-frozenheaderdiv').width(frozenWidth);
                                this.gridInstance.getHeaderContent().find('.e-movableheader').css("margin-left", marginLeft);
                                this.gridInstance.getHeaderContent().find('.e-movableheaderdiv').width(movableWidth);
                                this.gridInstance.getContent().find(".e-frozencontainer").width(frozenWidth).next().css("margin-left", marginLeft + "px");
                                this.gridInstance.getContent().find('.e-movablecontent').width(movableWidth);
                                if (this.gridInstance.model.showTotalSummary) {
                                    this.gridInstance._$totalSummaryRowContainer.find(".e-frozenfooterdiv").width(frozenWidth);
                                    this.gridInstance._$totalSummaryRowContainer.find(".e-movablefooter").css("margin-left", marginLeft + "px");
                                }
                                this.gridInstance._renderScroller(true);                             
                            }

                            if (this.gridInstance.model.scrollSettings.frozenColumns > 0 && $(this._target).parent('tr').parents('div:first').hasClass('e-frozenheaderdiv') && this.gridInstance.pluginName == "ejGrid") {
                                this.gridInstance.getHeaderContent().find('.e-frozenheaderdiv').width(this._newWidth);
                                this.gridInstance.getContent().find('.e-frozencontentdiv').width(this._newWidth);
                                if(this.gridInstance.model.showSummary && !ej.isNullOrUndefined(this.gridInstance.getFooterContent()))
                                    this.gridInstance.getFooterContent().find('.e-frozenfooterdiv').width(this._newWidth);
                            }
                        }
                        else if (!this.gridInstance.model.scrollSettings.frozenColumns) {
                            var oldTableWidth = this.gridInstance.getHeaderTable().width();
                            if (this.gridInstance.pluginName != "ejTreeGrid" && (!this.gridInstance.model.allowScrolling || !this.gridInstance.model.isResponsive))
                                $("#" + this.gridInstance._id).css("width", oldTableWidth + parseInt(_extra));
                            else {
                                // this.gridInstance.getHeaderTable().css("width", oldTableWidth + parseInt(_extra));
                                if(this.gridInstance.model.showSummary && !ej.isNullOrUndefined(this.gridInstance.getFooterTable()))
                                    this.gridInstance.getFooterTable().css("width", oldTableWidth + parseInt(_extra));
                            }
                            this.gridInstance.model.scrollSettings.width += parseInt(_extra);
                            if (this.gridInstance.getContent().width() > this.gridInstance.getContentTable().width()) {
                                this.gridInstance.getContentTable().addClass('e-tableLastCell');
                                this.gridInstance.getHeaderTable().addClass('e-tableLastCell');
                            }
                            else {
                                this.gridInstance.getContentTable().removeClass('e-tableLastCell');
                                this.gridInstance.getHeaderTable().removeClass('e-tableLastCell');
                            }
                        }
                    }
                    if (!(browser.browser == "msie") && browser && this.gridInstance.model.allowScrolling && this.gridInstance.model.scrollSettings.frozenColumns == 0) {
                        this.gridInstance.getHeaderTable().width("100%");
                        this.gridInstance.getContentTable().width("100%");
                        if(this.gridInstance.model.showSummary && !ej.isNullOrUndefined(this.gridInstance.getFooterTable()))
                            this.gridInstance.getFooterTable().width("100%");
                        var tableWidth = this.gridInstance._calculateWidth();
                        if (tableWidth <= this.gridInstance.getContentTable().width() || this.gridInstance.getHeaderTable().width() > this.gridInstance.getContentTable().width()) {
                            if (this.gridInstance.model.showSummary && !ej.isNullOrUndefined(this.gridInstance.getFooterTable()))
                                this.gridInstance.getFooterTable().width(tableWidth);
						}
                    }
                    if (this.gridInstance.model.allowResizing && this.gridInstance.getHeaderTable().find(".e-columnheader").css('cursor') == 'default') {
                        var cellIndex = this._currentCell;
                        var target = $(this._target), columnIndex = [], col = [];
                        var newWidth = _oldWidth + _extra;
                        var args = {};
                        if (this.gridInstance.model.showStackedHeader && target.hasClass("e-stackedHeaderCell")) {
                            var rowindex = target.parent(".e-stackedHeaderRow").index(),
                            stackedHeaderText = target.text(),
                            stackedHeaderCol = this.gridInstance.model.stackedHeaderRows[rowindex].stackedHeaderColumns,stackedHeaderColumns;
                            for(i=0;i<stackedHeaderCol.length;i++){
                                if(stackedHeaderCol[i].headerText == stackedHeaderText)
                                    stackedHeaderColumns = stackedHeaderCol[i].column;
                            }
                            var columns = stackedHeaderColumns;
                            if (!(stackedHeaderColumns instanceof Array))
                                columns = stackedHeaderColumns.split(",");
                            for (var i = 0 ; i < columns.length; i++) {
                                var index = this.gridInstance.getColumnIndexByField(columns[i]);
                                columnIndex.push(index)
                                col.push(this.gridInstance.model.columns[index]);
                            }
                            args = { columnIndex: columnIndex, column: col, oldWidth: _oldWidth, newWidth: newWidth };
                        }
                        else
                        args = { columnIndex: cellIndex, column: this.gridInstance.model.columns[cellIndex], oldWidth: _oldWidth, newWidth: newWidth };
                        this.gridInstance._trigger("resized", args);
                    }
                    if (this.gridInstance.model.allowScrolling) {
                        this.gridInstance.getScrollObject().refresh(this.gridInstance.model.scrollSettings.frozenColumns > 0);
                        if (this.gridInstance.model.isResponsive && this.gridInstance.model.minWidth)
                            this.gridInstance.windowonresize();
                        if (!scrollContent && $content.find("div").hasClass("e-content"))
                            this.gridInstance.refreshScrollerEvent();
                        this.gridInstance._isHscrollcss();
                    }
                }

            }

            this._target = null;
            this._$visualElement.remove();
            this._expand = false;
            this._currentCell = -1;
            this._allowStart = false;

        },
        _getFrozenResizeWidth: function () {
            var $frozenColumnsCol = this.gridInstance.getHeaderTable().find('colgroup').find("col").slice(0, this.gridInstance.model.scrollSettings ? this.gridInstance.model.scrollSettings.frozenColumns : 0), width = 0;
            for (var i = 0; i < $frozenColumnsCol.length; i++) {
                if ($frozenColumnsCol.eq(i).css("display") != "none")
                    width += parseInt($frozenColumnsCol[i].style.width.replace("px", ""));
            }
            return width;
        },
        _diaplayFinder: function () {
            return $(this).css('display') != 'none';
        },
        _resizeColumnUsingDiff: function (_oldWidth, _extra) {
            var proxy = this, _extraVal;			
            this._currntCe = this._currentCell;
            var $headerCols = this.gridInstance.getHeaderTable().find('colgroup').find("col");
            var $ContentCols = this.gridInstance.getContentTable().find('colgroup').find("col");
            if (!ej.isNullOrUndefined(this.gridInstance.model.detailsTemplate || this.gridInstance.model.childGrid)) {
                this.gridInstance._detailColsRefresh();
                $headerCols = this.gridInstance._$headerCols;
                $ContentCols = this.gridInstance._$contentCols;
            }
            var $headerCol = $headerCols.filter(this._diaplayFinder).eq(!this.gridInstance.model.allowGrouping || !ej.isNullOrUndefined(this.gridInstance.model.detailsTemplate || this.gridInstance.model.childGrid) ? this._currentCell : this._currentCell + this.gridInstance.model.groupSettings.groupedColumns.length)
                    , $ContentCol, $footerCol, $frozenCols = $headerCols.slice(0, this.gridInstance.model.scrollSettings ? this.gridInstance.model.scrollSettings.frozenColumns : 0);
            var colWidth = $headerCol[0].style.width, isPercent = colWidth.indexOf("%") != -1;
            var _inlineWidth = (!colWidth || isPercent)? $(this._target).outerWidth() : colWidth;
            var indent = !isPercent ? _oldWidth / parseInt(_inlineWidth) : 1;
            _extraVal = _extra = _extra / indent
            var _newWidth = this._newWidth = parseInt(_extra) + parseInt(_inlineWidth);
            if (this.gridInstance.pluginName == "ejTreeGrid" && _extra > 0 && !ej.isNullOrUndefined(this.gridInstance._currentCell) && this.gridInstance.model.columns[this.gridInstance._currentCell].isFrozen == true) {
                var width = this.gridInstance._frozenWidth();
                //if resizing exceeds the grid width
                if (width > this.gridInstance._gridWidth - 18 - 50) {//container width-scrollerwidth- minimum width of unfrozen column
                    return
                }
            }
            if (_newWidth > 0 && _extra != 0) {
                if (_newWidth < this._colMinWidth)
                    _newWidth = this._colMinWidth;
                if (ej.getObject("resizeSettings.resizeMode", this.gridInstance.model) == 'nextcolumn') {
                    var nextCol = $headerCol.next();
                    var isFrozenLastCell = this.gridInstance.model.scrollSettings.frozenColumns && this._currentCell == this.gridInstance.model.scrollSettings.frozenColumns - 1 ? true : false;
                    if (isFrozenLastCell)
                        nextCol = $headerCols.eq(this.gridInstance.model.scrollSettings.frozenColumns);
                    if ((isFrozenLastCell || !$headerCol.is(":last-child")) && (nextCol.width() + ($headerCol.width() - _newWidth) <= this._colMinWidth))
                        _newWidth = $headerCol.width() + (nextCol.width() - this._colMinWidth);
                }
                var _extra = _newWidth - _oldWidth;
                if (this.gridInstance.model.scrollSettings && this.gridInstance.model.scrollSettings.frozenColumns) {
                    if (this._currentCell >= 0 && this._currentCell < this.gridInstance.model.scrollSettings.frozenColumns && this._getFrozenResizeWidth() + _extra > this.gridInstance.element.find(".e-headercontent").first().width())
                        return;
                    $ContentCol = $ContentCols.filter(this._diaplayFinder).eq(this._currentCell);
                }
                else
                    $ContentCol = $ContentCols.filter(this._diaplayFinder).eq(!this.gridInstance.model.allowGrouping || !ej.isNullOrUndefined(this.gridInstance.model.detailsTemplate || this.gridInstance.model.childGrid) ? this._currentCell : this._currentCell + this.gridInstance.model.groupSettings.groupedColumns.length);
                if (this.gridInstance.model.showSummary && !ej.isNullOrUndefined(this.gridInstance.getFooterTable())) {
                    this._$footerCols = this.gridInstance.getFooterTable().find('colgroup').find("col");
                    var colCount = this.gridInstance.model.columns.length;
                    if (this._$footerCols.length > colCount) this._$footerCols.splice(0, (this._$footerCols.length - colCount));
                    var $footerCols = this._$footerCols,
                    $footerCol = $footerCols.filter(this._diaplayFinder).eq(this._currentCell);
                    $footerCol.outerWidth(_newWidth);
                }
                if ($(this._target).parent('tr').hasClass('e-stackedHeaderRow')) {
                    this._resizeStackedHeaderColumn($(this._target).parent('tr'), _extraVal, this._currntCe);
                }
                else
                    $headerCol.outerWidth(_newWidth);
                if ($(this._target).parent('tr').hasClass('e-stackedHeaderRow')) {
                    if (this.gridInstance.model.groupSettings.groupedColumns.length) {
                        var $tables = this.gridInstance.getContentTable().find(".e-recordtable");
                        var $colGroup = $tables.find("colgroup");
                        for (var i = 0; i < this._changedcell.length; i++) {
                            var cellIndex = this._changedcell[i];
                            for (var j = 0 ; j < $colGroup.length; j++) {
                                var visibleCols = $($colGroup[j]).children().filter(this._diaplayFinder);
                                var width = parseInt((_extraVal)) + parseInt(visibleCols[cellIndex].style.width);
                                if (width < this._colMinWidth)
                                    width = this._colMinWidth
                                $(visibleCols[cellIndex]).width(width);
                            }
                        }
                    }
                    var length = this.gridInstance.getContentTable().find('colgroup').find("col").filter(this._diaplayFinder).length;
                    for (var i = 0; i < this._changedcell.length; i++) {
                        var $conCol = this.gridInstance.getContentTable().find('colgroup').find("col").filter(this._diaplayFinder)[this._changedcell[i]]
                        var width = parseInt((_extraVal)) + parseInt($conCol.style.width);
                        if (width < this._colMinWidth)
                            width = this._colMinWidth
                        $($conCol).outerWidth(width);
                        if (this.gridInstance.model.isEdit && (this.gridInstance.model.allowGrouping && this.gridInstance.model.groupSettings.groupedColumns.length == 0)) {
                            var $sEditCol = this.gridInstance.getContentTable().find(".gridform").find("colgroup col").filter(this._diaplayFinder)[this._changedcell[i]];
                            $($sEditCol).outerWidth(width);
                        }
                    }
                }
                else {
                    if (this.gridInstance.model.groupSettings && this.gridInstance.model.groupSettings.groupedColumns.length) {
                        var $tables = this.gridInstance.getContentTable().find(".e-recordtable");
                        var $colGroup = $tables.find("colgroup");
                        var cellIndex = this._currentCell;
                        var colCount = this.gridInstance.getVisibleColumnNames().length;
                        if (this.gridInstance.getContentTable().find('.e-detailrow').length)
                            $colGroup = $colGroup.not($tables.find(".e-detailrow").find("colgroup")).get();
                        for (var i = 0 ; i < $colGroup.length; i++) {
                            var cols = $($colGroup[i]).find("col").filter(this._diaplayFinder);
                            if (cols.length > colCount) cols.splice(0, (cols.length - colCount));
                            $(cols[cellIndex]).width(_newWidth);
                        }
                    }
                    $ContentCol.outerWidth(_newWidth);
                    if (this.gridInstance.model.isEdit) {
                        var $editableRow = this.gridInstance.getContentTable().find(".e-editedrow,.e-addedrow");
                        var $editCols = $editableRow.find("table").find("colgroup col");
                        var addCol;
                        if ($editableRow.hasClass("e-addedrow") && this.gridInstance.model.groupSettings.groupedColumns.length)
                            addCol = this._currentCell + this.gridInstance.model.groupSettings.groupedColumns.length - 1;
                        else
                            addCol = this._currentCell;
                        var $editCol = $editCols.filter(this._diaplayFinder).eq(addCol);
                        $editCol.outerWidth(_newWidth);
                    }
                }
                this.gridInstance._findColumnsWidth();
                if (this.gridInstance.model.scrollSettings && this.gridInstance.model.scrollSettings.frozenColumns && ej.getObject("resizeSettings.resizeMode", this.gridInstance.model) != 'nextcolumn' && this.gridInstance.pluginName == "ejGrid") {
                    var frozenColumns = this.gridInstance.getContentTable().find('colgroup').find("col").slice(0, this.gridInstance.model.scrollSettings.frozenColumns)
                        , width = 0, direction;
                    for (i = 0; i < frozenColumns.length; i++)
                        width += frozenColumns[i].style.display == 'none' ? 0 : parseInt(frozenColumns[i].style.width.replace("px", ""));
                    this.gridInstance.getHeaderContent().find(".e-frozenheaderdiv").width(width);
                    direction = this.gridInstance.model.enableRTL ? "margin-right" : "margin-left";
                    this.gridInstance.getContent().find(".e-frozencontentdiv").width(width).next().css(direction, width + "px");
                    this.gridInstance.getHeaderContent().find(".e-frozenheaderdiv").width(width).next().css(direction, width + "px");
                    (this.gridInstance.model.showSummary && !ej.isNullOrUndefined(this.gridInstance.getFooterContent())) && this.gridInstance.getFooterContent().find(".e-frozenfooterdiv").width(width);
                }
                if (this.gridInstance.pluginName == "ejTreeGrid" && ((!ej.isNullOrUndefined(this.gridInstance._currentCell) && this.gridInstance.model.columns[this.gridInstance._currentCell].isFrozen == true && ej.getObject("resizeSettings.resizeMode", this.gridInstance.model) != 'nextcolumn') || (!this.gridInstance._isFrozenStackedResize && this.gridInstance._isStackedResize && this.gridInstance._frozenColumnsLength > 0))) {
                    var width = this.gridInstance._frozenWidth();                    
                    this.gridInstance.getHeaderContent().find(".e-frozenheaderdiv").width(width);
                    this.gridInstance.getContent().find(".e-frozencontainer").width(width).next().css("margin-left", width + "px");
                        this.gridInstance.getHeaderContent().find(".e-frozenheaderdiv").width(width).next().css("margin-left", width + "px");
                        if (this.gridInstance.model.showTotalSummary) {
                            this.gridInstance._$totalSummaryRowContainer.find(".e-frozenfooterdiv").width(width);
                            this.gridInstance._$totalSummaryRowContainer.find(".e-movablefooter").css("margin-left", width + "px");
                        }
                        this.gridInstance._findColumnsWidth();
                        this.gridInstance._renderScroller(true);
                     }
                this.gridInstance.getHeaderTable().find(".e-columnheader").css("cursor", "default");
            }
        },
        _resizeStackedHeaderColumn: function (currentTr, extra, currentCell) {
            // var currentIndex = this._currntCe;
            this._changedcell = [];
            var headerCells = this.gridInstance.getHeaderContent().find(".e-headercell").not(".e-detailheadercell");
            var preCol = 0, limit = 0, currentTh = headerCells[currentCell], currentSpan = $(currentTh).attr('colspan'), commonExtra = extra / currentSpan, tr = $(currentTh).parent('tr');
            var nextTr = tr.next();
            var currentIndex = currentTh.cellIndex;
            if (this.gridInstance.model.groupSettings.showGroupedColumn) {
                limit = this.gridInstance.model.groupSettings.groupedColumns.length;
                preCol += limit
            }
            while (currentIndex > limit) {
                currentIndex--;
                var th = $(tr).children('th').not(".e-detailheadercell")[currentIndex];
                preCol += parseInt($(th).attr('colspan'));
            }
            this._currentCell = preCol;
            var length = preCol + parseInt(currentSpan);
            for (var i = preCol; i < length; i++) {
                var $colG = this.gridInstance.getHeaderTable().find('col').filter(this._diaplayFinder)[i];
                this._changedcell.push(i - limit)
                var width = parseInt(extra) + parseInt($colG.style.width);
                if (width < this._colMinWidth)
                    width = this._colMinWidth;
                $($colG).outerWidth(width);
             }
        },
        _triggerResizeEvents: function (event, _x) {
            var _rowobj = this.gridInstance.getHeaderTable().find(".e-columnheader");
            var _childTH = _rowobj.find(".e-headercell").filter(":visible");
            var cellIndex = this._cellIndex;
            var target = $(this._target), columnIndex = [], col = [];
            if (event == "resizeStart") {
                this._orgX = _x;
                cellIndex = this._cellIndex = this._getCellIndex(this, _x);
            }
            var _outerCell = _childTH[this._currentCell];
            var _oldWidth = _outerCell.offsetWidth;
            if (this.gridInstance.model.showStackedHeader && target.hasClass("e-stackedHeaderCell")) {
                var rowindex = target.parent(".e-stackedHeaderRow").index(),
                stackedHeaderText = target.text(),
                stackedHeaderCol = this.gridInstance.model.stackedHeaderRows[rowindex].stackedHeaderColumns,stackedHeaderColumns;
                for(i=0;i<stackedHeaderCol.length;i++){
                    if(stackedHeaderCol[i].headerText == stackedHeaderText)
                        stackedHeaderColumns = stackedHeaderCol[i].column;
                }
                var columns = stackedHeaderColumns;
                if (!(stackedHeaderColumns instanceof Array))
                    columns = stackedHeaderColumns.split(",");
                for (var i = 0 ; i < columns.length; i++) {
                    var index = this.gridInstance.getColumnIndexByField(columns[i]);
                    columnIndex.push(index)
                    col.push(this.gridInstance.model.columns[index]);
                }
            }
            if (event == "resizeStart") {
                var args = {};
                if (this.gridInstance.model.showStackedHeader && target.hasClass("e-stackedHeaderCell")) {
                    args = { columnIndex: columnIndex, column: col, target: target, oldWidth: _oldWidth };
                }
                else
                    args = { columnIndex: cellIndex, column: this.gridInstance.model.columns[cellIndex], target: $(_outerCell), oldWidth: _oldWidth };
                return this.gridInstance._trigger("resizeStart", args);
            }
            else {
                var _childth = _rowobj.find(".e-headercell").not(".e-detailheadercell").filter(":visible");
                var _extra = _x - this._orgX;
                var newWidth = _oldWidth + _extra;
                this.gridInstance._colgroupRefresh();
                var args = {};
                if (this.gridInstance.model.showStackedHeader && target.hasClass("e-stackedHeaderCell")) {
                    args = { columnIndex: columnIndex, column: col, target: $(_outerCell), oldWidth: _oldWidth, newWidth: newWidth, extra: _extra };
                }
                else
                    args = { columnIndex: cellIndex, column: this.gridInstance.model.columns[cellIndex], target: $(_outerCell), oldWidth: _oldWidth, newWidth: newWidth, extra: _extra };
                return this.gridInstance._trigger("resizeEnd", args);
            }
        },
        _mouseUp: function (e) {
            if (this.gridInstance._resizeTimeOut){
                clearTimeout(this.gridInstance._resizeTimeOut);
                this.gridInstance._resizeTimeOut = 0;
            }
            if (this._expand) {
                var _x = e.clientX, _y = e.clientY;
                if (navigator.userAgent.indexOf("WebKit") != -1) {
                    _x = e.pageX;
                    _y = e.pageY;
                }
                if (e.type == "touchend") {
                    _x = e.originalEvent.changedTouches[0].clientX;
                    _y = e.originalEvent.changedTouches[0].clientY;
                }
                if (this.gridInstance.model.allowResizing && (this.gridInstance.getHeaderTable().find(".e-columnheader").css('cursor') == 'col-resize' || e.type == "touchend")) {
                    if (this._triggerResizeEvents("resizeEnd", _x)) {
                        this.gridInstance.element.find(".e-reSizeColbg").remove();
                        return;
                    }
                }
                _x += document.documentElement.scrollLeft;
                this._reSize(_x, _y);
                if (!ej.isNullOrUndefined(this._currntCe) && this._currntCe >= 0)
                    this.gridInstance.model.columns[this._currntCe].width = this.gridInstance.columnsWidthCollection[this._currntCe];
            }
        },
        _getResizableCell: function () {
            var row, frozenColumns = this.gridInstance.model.scrollSettings.frozenColumns;
            if ($(this._target).hasClass('e-stackedHeaderCell'))
                row = this.gridInstance.getHeaderTable().find(".e-columnheader");
            else
                row = this.gridInstance.getHeaderTable().find(".e-columnheader").not('.e-stackedHeaderRow');
            var cell = row.find(".e-headercell").not(".e-hide,.e-detailheadercell");
            var scrollLeft = navigator.userAgent.indexOf("WebKit") != -1 ? document.body.scrollLeft : document.documentElement.scrollLeft;
            //To identify whether it is previous cell to final frozen cell
            if (frozenColumns && this._currentCell != -1 && this._currentCell == frozenColumns - 1) {
                var cellPoint = cell[this._currentCell].getBoundingClientRect().left + scrollLeft + 5,
                    isFrozenPreviousCell = cellPoint > this._orgX ? true : false;
            }
            if (!frozenColumns || this._currentCell != frozenColumns - 1 || isFrozenPreviousCell)
                for (var i = 0; i < cell.length; i++) {
                    var point = cell[i].getBoundingClientRect();
                    var xlimit = point.left + scrollLeft + 5;
                    if (xlimit > this._orgX && cell[i].offsetHeight + point.top >= this._orgY) {
                        this._currentCell = i - 1;
                        return;
                    }
                    if (i == cell.length - 1 || (this.gridInstance.model.showStackedHeader && $(this._target).get(0) === cell[i])) {
                        this._currentCell = i;
                        return;
                    }
                }
        },
        _moveVisual: function (_x) {
            /// Used to move the visual element in mouse move
            var _bounds = this.gridInstance.getHeaderContent().find("div").first()[0].getBoundingClientRect();
            if ((_bounds.left + document.documentElement.scrollLeft + _bounds.width < _x) || (_x < _bounds.left + document.documentElement.scrollLeft))
                this._$visualElement.remove();
            else if (this._currentCell != -1)
                this._$visualElement.css({ left: _x, top: this._tableY });
        },
        _mouseDown: function (e) {
            if (this._allowStart && ($(e.target).closest("tr").css("cursor") == 'col-resize')) {
                this._target = e.target;
                var _x = e.clientX, _y = e.clientY;
                if (navigator.userAgent.indexOf("WebKit") != -1) {
                    _x = e.pageX;
                    _y = e.pageY - (window.pageYOffset || document.body.scrollTop || 0);
                }
                if (this.gridInstance.model.allowResizing && this.gridInstance.getHeaderTable().find(".e-columnheader").css('cursor') == 'col-resize') {
                    if ($(e.target).is(".e-headercelldiv"))
                        e.target = e.target.parentNode;
                    this._target = e.target;
                    if (this._triggerResizeEvents("resizeStart", _x))
                        return;
                }
                var gridobj = this;
                _x += document.documentElement.scrollLeft;
                if (e.button != 2)
                    this._start(_x, _y);
                return false;
            }
            return true;
        },
        _columnResizeToFit: function (e) {
            var resize = this.gridInstance.getHeaderTable().find(".e-columnheader").filter(function (e) {
                return $(this).css("cursor") == "col-resize";
            });
            if (this.gridInstance.model.allowResizeToFit && resize.length) {
                if ($(e.target).is(".e-headercelldiv"))
                    e.target = e.target.parentNode;
                var $target = $(e.target);
                var headerCells, preCol = 0, indent = 0;
                if ($target.hasClass('e-stackedHeaderCell'))
                    headerCells = this.gridInstance.getHeaderContent().find(".e-headercell").not(".e-detailheadercell");
                else
                    headerCells = this.gridInstance.getHeaderContent().find(".e-headercell").not(".e-stackedHeaderCell,.e-detailheadercell");
                this._target = $target;
                if ($target.hasClass("e-headercell")) {
                    var targetCell = e.target;
                    var hCellIndex = $.inArray(targetCell, headerCells);
                    var cellIndex = hCellIndex;
                    this._orgX = e.pageX;
                    if(!this.gridInstance.model.enableRTL) 
						this._getResizableCell();
					else
						this._currentCell = hCellIndex;
                    if (hCellIndex != this._currentCell) {
                        hCellIndex = cellIndex = this._currentCell;
                        targetCell = e.target.previousSibling;
                    }
                    var currentTh = headerCells.filter(":visible")[cellIndex], changesCellIndex = [], changesFinalWdith = [], changesOldWidth = [];
                    indent = this.gridInstance.model.groupSettings.groupedColumns.length;
                    if (!ej.isNullOrUndefined(this.gridInstance.model.detailsTemplate) || !ej.isNullOrUndefined(this.gridInstance.model.childGrid))
                        indent += 1;
                    if ($(targetCell).parent("tr").hasClass('e-stackedHeaderRow')) {
                        var currentSpan = $(currentTh).attr('colspan'), tr = $(currentTh).parent('tr'), tHeadIndex = currentTh.cellIndex;
                        var nextTr = tr.next();
                        while (tHeadIndex > indent) {
                            tHeadIndex--
                            var th = $(tr).children('th')[tHeadIndex];
                            preCol += parseInt($(th).attr('colspan'))
                        };
                        var length = preCol + parseInt(currentSpan);
                    }
                    else {

                        preCol = cellIndex; length = cellIndex + 1;
                    }
                    var finalWidth = 0, headerWidth = 0, contentWidth = 0, argCols = [], argExtra = [];
                    if (preCol != -1) {
                        var hiddenLen = headerCells.slice(0, preCol + 1).filter(".e-hide").length;
                        var args = { columnIndex: preCol + hiddenLen, column: this.gridInstance.model.columns[preCol + hiddenLen], target: $target, oldWidth: oldWidth };
                        this.gridInstance._trigger("resizeStart", args);
                        for (var i = preCol; i < length; i++) {
                            hiddenLen = headerCells.slice(0, i + 1).filter(".e-hide").length;
                            contentWidth = this._getContentWidth(i + hiddenLen);
                            var $cellDiv = this.gridInstance.getHeaderTable().find('.e-headercell:not(.e-hide, .e-stackedHeaderCell)').children(".e-headercelldiv").eq(i);
                            headerWidth = this._getHeaderContentWidth($cellDiv);
                            finalWidth = headerWidth > contentWidth ? headerWidth : contentWidth;
                            finalWidth += parseInt(($cellDiv.css("padding-left"), 10) + ($cellDiv.css("padding-right"), 10));
                            var oldWidth = this.gridInstance.getHeaderTable().find('col').filter(this._diaplayFinder).eq(i + indent).width();
                            finalWidth = oldWidth > finalWidth ? finalWidth : (this._colMinWidth < finalWidth ? finalWidth : this._colMinWidth);

                            var headerCols = this.gridInstance.getHeaderTable().find('col').filter(this._diaplayFinder);
                            if(this.gridInstance.model.detailsTemplate || this.gridInstance.model.childGrid)
                                headerCols.splice(0, 1);
                            headerCols.eq(i + indent).width(finalWidth);
                            if (this.gridInstance.model.groupSettings.groupedColumns.length) {
                                var $colGroups = this.gridInstance.getContentTable().find('.e-recordtable').find('colgroup');
                                var proxy = this;
                                $.each($colGroups, function (indx, colgroup) {
                                    $(colgroup).find('col').filter(proxy._diaplayFinder).eq(i).width(finalWidth);
                                });
                            }
                            var contentCols = this.gridInstance.getContentTable().find('col').filter(this._diaplayFinder);
                            if(this.gridInstance.model.detailsTemplate || this.gridInstance.model.childGrid)
                                contentCols.splice(0, 1);
                            contentCols.eq(i + indent).width(finalWidth);
                            if (this.gridInstance.model.isEdit) {
                                var $editableCol = this.gridInstance.getContentTable().find(".e-editedrow").find("col");
                                var $form = this.gridInstance.element.find(".gridform");
                                for (var j = 0; j < $form.length; j++) {
                                   var $editableCol = $($form[j]).find("col")
                                   $editableCol.eq(i + indent).width(finalWidth);
                               }
                            }
                            argCols.push(this.gridInstance.model.columns[i + hiddenLen]);
                            argExtra.push(Math.abs(finalWidth - oldWidth))
                            changesCellIndex.push(i + hiddenLen); changesFinalWdith.push(finalWidth); changesOldWidth.push(oldWidth);
                            if (this.gridInstance.model.scrollSettings.frozenColumns > 0 || (this.gridInstance.model.groupSettings.groupedColumns.length && this.gridInstance.model.isEdit)) {
                                var colIndex = i + hiddenLen;
                                this.gridInstance.columnsWidthCollection[colIndex] = finalWidth;
                                this.gridInstance.setWidthToColumns();
                                if (this.gridInstance.model.scrollSettings.frozenColumns <= colIndex + 1) {
                                    this.gridInstance.getHeaderContent().find(".e-movableheader").css("margin-left", finalWidth);
                                    this.gridInstance.getContent().find(".e-movablecontent").css("margin-left", finalWidth);
                                    if(this.gridInstance.model.showSummary && !ej.isNullOrUndefined(this.gridInstance.getFooterContent()))
                                        this.gridInstance.getFooterContent().find(".e-movablefooter").css("margin-left", finalWidth);
                                }
                            }
                        }

                    }
                    this.gridInstance._colgroupRefresh();
                    this.gridInstance._recalculateIndentWidth();
                    args = { columnIndex: changesCellIndex, column: argCols, target: currentTh, oldWidth: changesOldWidth, newWidth: changesFinalWdith, extra: argExtra };
                    this.gridInstance._trigger("resizeEnd", args);
                    for (var i = 0; i < changesCellIndex.length; i++) {
                        this.gridInstance.columnsWidthCollection[changesCellIndex[i]] = changesFinalWdith[i];
                        this.gridInstance.model.columns[changesCellIndex[i]]["width"] = changesFinalWdith[i];
                    }
                    args = { columnIndex: changesCellIndex, column: argCols, target: currentTh, oldWidth: changesOldWidth, newWidth: changesFinalWdith, extra: argExtra };
                    this.gridInstance._trigger("resized", args);
                    if (this.gridInstance.model.summaryRows.length > 0)
                        this.gridInstance._summaryColRrefresh();
					this.gridInstance._findColumnsWidth();
                }				
            }
        },
        _getContentWidth: function (cellindx) {
            var contentWidth = 0;
            var $span = ej.buildTag('span', {}, {}), proxy = this.gridInstance, tdWidth;
            if (!ej.isNullOrUndefined(proxy._gridRows)) {
                var rows = proxy._gridRows;
                if (this.gridInstance.model.scrollSettings.frozenColumns && cellindx >= this.gridInstance.model.scrollSettings.frozenColumns) {
                    rows = rows[1];
                    cellindx = cellindx - this.gridInstance.model.scrollSettings.frozenColumns;
                }
                $.each(rows, function (indx, row) {
                    if ($(row).is('.e-row,.e-alt_row') && !$(row).is('.e-editedrow')) {
					    var td = $(row).find('td.e-rowcell').eq(cellindx);
					    var content = $(td).html();
					    if (proxy.model.columns[cellindx]["commands"])
					        $span.html($(content).children());
					    else if (td.hasClass("e-validError"))
					        $span.html($(content).attr("value"));
					    else
						    $span.html(content);
					    $(td).html($span);
						tdWidth = td.find('span:first').width() > 0 ? td.find('span:first').width() + parseInt(td.css("padding-left")) + parseInt(td.css("padding-right")) : td.find('span:first').width();
					    if (tdWidth > contentWidth)
						    contentWidth = tdWidth;
					    $(td).html(content);
                    }
				});
			}
            proxy._refreshUnboundTemplate(this.gridInstance.getContentTable());
            return contentWidth;
        },
        _getHeaderContentWidth: function ($cellDiv) {
            var headerWidth = 0, $span = ej.buildTag('span', {}, {});
			var IE = this.gridInstance.getBrowserDetails().browser == "msie" ;
			if(IE)
			    $span.css("position","absolute");
            var content = $cellDiv.html();
            $span.html(content);
            $cellDiv.html($span);
            headerWidth = $cellDiv.find('span:first').width() + parseInt($cellDiv.css("padding-left"))+parseInt($cellDiv.css("padding-right"));
			if(IE)
                headerWidth += 2;
            if(this.gridInstance.model.allowFiltering && (this.gridInstance.model.filterSettings.filterType == "menu" || this.gridInstance.model.filterSettings.filterType == "excel")){
                var filter = $cellDiv.parent().find(".e-filtericon");
                headerWidth = headerWidth + filter.width() + 10;
				if(filter.length)
				headerWidth += parseInt(filter.css("margin-left"));
			}
            $cellDiv.html(content);
            return headerWidth;
        },
    };
})(jQuery, Syncfusion);