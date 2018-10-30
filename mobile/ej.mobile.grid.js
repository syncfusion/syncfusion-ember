/**
* @fileOverview Plugin to style the Html Grid elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {
    // ejmGrid is the plugin name 
    // "ej.mobile.Grid" is "namespace.className" will hold functions and properties    

    ej.widget("ejmGrid", "ej.mobile.Grid", {
        _setFirst: true,
        _rootCSS: "e-m-grid-core",
        validTags: ["div"],
        _tags: [{
            tag: "columns",
            attr: ["field", "headerText", "allowFiltering", "allowSorting", "width", "textAlign", "format", "type"]
        }],
        _ignoreOnPersist: ["query", "dataSource", "allowScrolling", "cssClass"],

        defaults: {
            allowPaging: false,
            allowSorting: false,
            allowFiltering: false,
            allowScrolling: false,
            allowSelection: true,
            dataSource: null,
            caption: "",
            cssClass: "",
            locale: "en-US",
            enablePersistence: false,
            selectedRowIndex: -1,
            rowSelecting: null,
            rowSelected: null,
            actionBegin: null,
            actionComplete: null,
            actionSuccess: null,
            actionFailure: null,
            load: null,
            queryCellInfo: null,
            rowDataBound: null,
            dataBound: null,
            modelChange: null,
            pageSettings: {
                pageSize: 5,
                currentPage: 1,
                display: "normal",
                type: "scrollable",
                totalRecordsCount: null
            },
            scrollSettings: {
                enableColumnScrolling: false,
                height: "auto",
                enableRowScrolling: true,
                enableNativeScrolling: (ej.isAndroid() || ej.isIOS()) ? false : ej.isDevice() ? true : false
            },
            sortSettings: {
                allowMultiSorting: false,
                sortedColumns: []
            },
            filterSettings: {
                filterBarMode: "onenter",
                interval: 1500,
                filteredColumns: []
            },
            showCaption: false,
            allowColumnSelector: false,
            transition: ej.isAndroid() ? "pop" : ej.isWindows() ? "slide" : "slide",
            renderMode: "auto",
            query: ej.Query(),
            columns: []
        },
        dataTypes: {
            allowPaging: "boolean",
            allowSorting: "boolean",
            allowFiltering: "boolean",
            allowSelection: "boolean",
            allowScrolling: "boolean",
            locale: "string",
            sortSettings: {
                allowMultiSorting: "boolean",
                sortedColumns: "array"
            },
            filterSettings: {
                filteredColumns: "array",
            },
            dataSource: "data",
            query: "data",
            columns: "array",
            pageSettings: {
                pageSize: "number",
                display: "enum",
                type: "enum",
            },
            scrollSettings: {
                enableRowScrolling: "boolean",
                enableColumnScrolling: "boolean",
            },
            renderMode: "enum",
            allowColumnSelector: "boolean",
            showCaption: "boolean",
            transition: "string"
        },

        observables: ["dataSource", "selectedRowIndex", "pageSettings.currentPage"],
        dataSource: ej.util.valueFunction("dataSource"),
        selectedRowIndex: ej.util.valueFunction("selectedRowIndex"),
        currentPage: ej.util.valueFunction("pageSettings.currentPage"),

        _columns: function (index, property, value, old) {
            $('.e-m-grid-hbar th .e-m-title')[index.columns].innerHTML = value;
        },
        _init: function () {
            this._getLocalizedLabels();
            this._trigger("load");
            this._page = ej.getCurrentPage();
            this._hiddenColumns = [];
            this._visibleColumns = [];
            this._dataColumns = [];
            this._rowSelect = true;
            this._colInit = false;
            this._touchMove = false;
            this._controlInit = true;
            this._initialRender = true;
            if (this.model.renderMode == "auto")
                ej.setRenderMode(this);
            if (this.model.allowSorting) {
                this._curSort = "clearsorting";
                this._sortedColumns = [];
                this._sortDirection = [];
                this._handleInitialSorting();
            }
            this._id = this.element[0].id;
            this._render();
            this._createDelegates();
            this._wireEvents(false);
        },

        _handleInitialSorting: function () {
            var proxy = this;
            var length = this.model.sortSettings.sortedColumns.length;
            $.each(this.model.sortSettings.sortedColumns, function (index, value) {
                if (proxy.model.sortSettings.allowMultiSorting || index == length - 1) {
                    proxy._sortedColumns.push(value.columnName);
                    proxy._sortDirection.push(value.sortDirection);
                }

            });
        },

        _getLocalizedLabels: function () {
            this._localizedLabels = ej.getLocalizedConstants(this.sfType, this.model.locale)
        },

        _setLocale: function () {
            this._getLocalizedLabels();            
        },

        _render: function () {
            this._renderClientgrid();
            this._content = this.element.find(".e-m-grid-content");
            if (this.model.allowPaging)
                this._createPagerObject();
            if (this.model.allowFiltering) {
                this._createFilterObject();
                this._filters = this._filteringMgr.model.filterConditions = this.model.filterSettings.filteredColumns;
            }
            if (this.model.allowColumnSelector)
                this._createColumnListContainer();
            this._load();
        },

        _createColumnListContainer: function () {
            this.element.wrap(ej.buildTag("div.e-m-grid-parent-container"));
            this._parentElement = this.element.parent();
            var container = ej.buildTag("div.e-m-grid-colnavcontainer e-m-" + this.model.renderMode + " subpage e-m-state-hide e-m-grid-core#" + this._id + "colnav", {}, {}, { "data-url": this._id + "colnav" });
            var header = ej.buildTag("div.e-m-grid-colnavhdr", {}, {}, {
                "data-role": "ejmnavigationbar", "data-ej-title": this._localizedLabels["columnSelectorText"],
                "data-ej-rendermode": this.model.renderMode, "data-ej-position": "normal"
            });
            container.append(header);
            this._subPagelistDiv = ej.buildTag("div", {}, {}, {});
            var ul = ej.buildTag("ul");
            $.each(this.model.columns, function (indx, col) {
                var li = ej.buildTag("li", {}, {}, { "data-ej-text": col.headerText });
                ul.append(li);
            });
            this._subPagelistDiv.append(ul);
            container.append(this._subPagelistDiv);
            var doneBtn, cancelBtn;
            if (this.model.renderMode == "android" || this.model.renderMode == "windows") {
                doneBtn = ej.buildTag("input", {}, {}, {
                    "data-role": "ejmbutton",
                    "data-ej-rendermode": this.model.renderMode, "data-ej-text": this._localizedLabels["columnSelectorDone"], "type": "button"
                });
                cancelBtn = ej.buildTag("input", {}, {}, {
                    "data-role": "ejmbutton",
                    "data-ej-rendermode": this.model.renderMode, "data-ej-text": this._localizedLabels["columnSelectorCancel"], "type": "button"
                });
                container.append(doneBtn).append(cancelBtn);
            }
            this._warningDialog = ej.buildTag("div#" + this._id + "_warningDlg", {}, {}, {
                "data-role": "ejmdialog",
                "data-ej-rendermode": this.model.renderMode, "data-ej-title": this._localizedLabels["columnSelectorWarning"],
                "data-ej-mode": "alert", "data-ej-enablemodal": true, "data-ej-enableautoopen": false
            }).append(ej.buildTag("div").html(this._localizedLabels["HideColumnAlert"]));
            container.append(this._warningDialog);
            if (ej.isMobile())
                $("body").append(container);
            else
                this._parentElement.append(container);
            this._subPagelistDiv.ejmListView({
                "touchEnd": ej.proxy(this._onColumnSelectHandler, this),
                "renderMode": this.model.renderMode,
                "enableChecklist": true
            });
            ej.widget.init(container);
            if (this.model.renderMode == "android" || this.model.renderMode == "windows") {
                doneBtn.ejmButton({ "touchEnd": ej.proxy(this._columnSelectionDoneHandler, this) });
                cancelBtn.ejmButton({ "touchEnd": ej.proxy(this._columnSelectionCancelHandler, this) });
            }
            else
                header.ejmNavigationBar({ "rightButtonTap": ej.proxy(this._columnSelectionDoneHandler, this), "leftButtonTap": ej.proxy(this._columnSelectionCancelHandler, this) });
            this._warningDialog.ejmDialog({ "buttonTap": ej.proxy(this._dialogButtonClick, this) });

        },

        _dialogButtonClick: function (e) {
            this._warningDialog.ejmDialog("close");
        },

        _columnSelectionCancelHandler: function (e) {
            if (this._colHideList != this._prevColHideList) {
                this._subPagelistDiv.ejmListView("uncheckAll");
                if (this._prevColHideList) {
                    for (var i = 0; i < this._prevColHideList.length; i++)
                        this._subPagelistDiv.ejmListView("checkItemsByIndex", this._dataColumns.indexOf(this._prevColHideList[i]));
                }
                this._colHideList = this._prevColHideList;
            }
            history.back();
        },

        _columnSelectionDoneHandler: function (e) {
            if (this._colHideList && this._colHideList.length == this.model.columns.length) {
                this._warningDialog.ejmDialog("open");
            }
            else {
                if (this._colHideList) {
                    if (this._colHideList && this._hiddenColumns != this._colHideList)
                        this.hideColumns(this._colHideList);
                    var proxy = this;
                    this._colShowList = [];
                    $.each(this.model.columns, function (indx, col) {
                        if (proxy._colHideList.indexOf(col.headerText) == -1)
                            proxy._colShowList.push(col.headerText);
                    });
                    if (this._colShowList && this._visibleColumns.toString() != this._colShowList.toString())
                        this.showColumns(this._colShowList);
                }
                else
                    this.showColumns(this._prevColHideList);
                history.back();
            }
            this._prevColHideList = this._colHideList;
        },

        _onColumnSelectHandler: function (args) {
            this._colHideList = args.checkedItemsText;
        },

        _createPagerObject: function () {
            var pSettings = this.model.pageSettings;
            pSettings["id"] = this._id;
            var element = $("#" + this._id + "_pager");
            element.ejmGridPager(pSettings);
            this._pager = element.ejmGridPager("instance");
            this._pager.model.currentPage = parseInt(this.currentPage());
        },

        _createFilterObject: function () {
            var element = this.element.find(".e-m-grid-header");
            var fSettings = this.model.filterSettings;
            fSettings["id"] = this._id;
            element.ejmGridFilter(fSettings);
            this._filteringMgr = element.ejmGridFilter("instance");
        },


        _renderClientgrid: function () {
            this.element.addClass("e-m-grid-core e-m-core subpage");
            if (this.model.cssClass != "" && this.model.cssClass != undefined) {
                this.element.addClass(this.model.cssClass);
                this._cssClass = this.model.cssClass;
            }
            this._mainContainer = ej.buildTag("div.e-m-grid-container#" + this._id + "container");
            if (this.model.allowFiltering)
                this._mainContainer.addClass("e-m-filter");
            if (this.model.allowFiltering)
                this._renderFilterBar();
            if (this.model.showCaption || this.model.allowColumnSelector)
                this._renderCaption();
            if (this.model.allowColumnSelector) {
                this._colNavigator = ej.buildTag("div.e-m-grid-colnav e-m-fontimage");
                this.element.find(".e-m-caption-row").append(this._colNavigator);
            }
            this.element.append(this._mainContainer);
            if (this.model.allowScrolling && this.model.scrollSettings.enableColumnScrolling) {
                this._innerContainer = ej.buildTag("div.e-m-grid-innercontainer")
                .appendTo(this._mainContainer);
            }
            this._renderHeader();
            this._renderContent();

            this._setRenderMode();
        },

        _setRenderMode: function () {
            var modes = "e-m-android e-m-ios7 e-m-windows e-m-flat";
            this.element.removeClass(modes).addClass("e-m-" + this.model.renderMode);
            $("#" + this._id + "_pager").removeClass(modes).addClass("e-m-" + this.model.renderMode);
        },

        _renderContent: function () {
            var content = ej.buildTag("div#" + this._id + "_content.e-m-grid-content");
            this._renderInnerContent(content);
            if (this._innerContainer)
                this._innerContainer.append(content);
            else
                this._mainContainer.append(content);
            if (this.model.allowPaging)
                this._renderPager();
        },

        _renderPager: function () {
            var pgr = ej.buildTag("div#" + this._id + "_pager.e-m-grid-core e-m-grid-pager e-m-pager-" + this.model.pageSettings.display + " e-m-pagertype-" + this.model.pageSettings.type + " e-m-" + this.model.renderMode);
            var wrapper = ej.buildTag("div.e-m-grid-pwrapper e-m-state-default");
            var ipgr = ej.buildTag("div.e-m-grid-inrpgr e-m-state-default");
            if (this.model.pageSettings.type == "normal") {
                ej.buildTag("div.e-m-grid-first  e-m-fontimage").append(ej.buildTag("div.e-m-grid-hfirst  e-m-fontimage")).appendTo(ipgr);
                ej.buildTag("div.e-m-grid-prev  e-m-fontimage").append(ej.buildTag("div.e-m-grid-hprev  e-m-fontimage")).appendTo(ipgr);
            }
            ej.buildTag("div#" + this._id + "_pgrtxt.e-m-grid-ptxt").html("1").appendTo(ipgr);
            if (this.model.pageSettings.type == "normal") {
                ej.buildTag("div.e-m-grid-next  e-m-fontimage").append(ej.buildTag("div.e-m-grid-hnext  e-m-fontimage")).appendTo(ipgr);
                ej.buildTag("div.e-m-grid-last  e-m-fontimage").append(ej.buildTag("div.e-m-grid-hlast  e-m-fontimage")).appendTo(ipgr);
            }
            ipgr.appendTo(wrapper);
            wrapper.appendTo(pgr);
            if (this.model.pageSettings.display == ej.mobile.Grid.PagerDisplay.Fixed)
                pgr.appendTo(ej.getCurrentPage());
            else
                pgr.appendTo(this.element);
        },

        _renderInnerContent: function (content) {
            var tab = ej.buildTag("table.e-m-grid-table", {}, {}, { "cellspacing": "0.25px", "data-role": this.element[0].id + "_Table" });
            this._renderColGrp(tab, false);
            var tbody = ej.buildTag("tbody").append(ej.buildTag("tr"));
            tbody.append(ej.buildTag("td.e-m-grid-emptycell", {}, {}, { "colspan": this.model.columns.length }).html(this._localizedLabels["spinnerText"]));
            tab.append(tbody);
            content.append(tab);
            this._setGridContentTable(tab[0]);
        },

        _renderCaption: function () {
            var caption = ej.buildTag("div.e-m-state-default e-m-caption-row").append(ej.buildTag("span").html(this.model.caption + ": " + this.model.dataSource.length + " " + this._localizedLabels["captionText"]));
            this.element.prepend(caption);
        },

        _renderFilterBar: function () {
            var fbar = ej.buildTag("div.e-m-grid-fbardiv");
            var search = ej.buildTag("span.e-m-icon-grid-search  e-m-fontimage");
            var ispan = ej.buildTag("div.e-m-grid-finput");
            var clr = ej.buildTag("span.e-m-icon-grid-clear  e-m-fontimage");
            var finput = ej.buildTag("input.e-m-text-input", {}, {}, { "data-role": "none" });
            if (ej.isDevice() && ej.isAndroid()) finput.addClass("e-m-placeholder-css");
            ej.buildTag("form").append(finput).append(search).append(clr).appendTo(ispan);
            fbar.append(ispan);//.appendTo(ihdr);
            (this.model.renderMode == "windows" && !ej.isMobile()) ? clr.css("display", "none") : "";
            this.element.append(fbar);
        },

        _renderHeader: function () {
            var hdr = ej.buildTag("div.e-m-state-default e-m-grid-header");
            var ihdr = ej.buildTag("div.e-m-grid-inrhdr");
            var hset = ej.buildTag("div.e-m-grid-hdrsettings");
            var htable = ej.buildTag("table.e-m-grid-table", {}, {}, { "cellspacing": "0.25px" });
            this._renderColGrp(htable, true);
            this._renderTHead(htable);
            hset.append(htable);
            ihdr.append(hset);
            hdr.append(ihdr);
            if (this._innerContainer)
                this._innerContainer.append(hdr);
            else
                this._mainContainer.append(hdr);
        },

        _renderColGrp: function (table, hiddenColInit) {
            var proxy = this;
            var colgrp = ej.buildTag("colgroup");
            this._colWidth = 0;
            this._setHorScrWidth = true;
            this._hiddenColumns = [];
            this._visibleColumns = [];
            $.each(proxy.model.columns, function (indx, val) {
                var col = ej.buildTag("col");
                if (val.width && val.width > 0) {
                    col.css("width", val.width + "px");
                    proxy._colWidth = proxy._colWidth + val.width;
                }
                else
                    proxy._setHorScrWidth = false;
                colgrp.append(col);
                if (!val.headerText)
                    val.headerText = val.field;
                if (val.visible == false) {
                    hiddenColInit ? proxy._hiddenColumns.push(val.headerText) : {};
                    col.addClass("e-hide");
                }
                else {
                    hiddenColInit ? proxy._visibleColumns.push(val.headerText) : {};
                    proxy.model.columns[indx]["visible"] = true;
                }
                proxy._dataColumns.push(val.headerText);
            });
            setTimeout(function () {
                if (proxy.element.width() > proxy._colWidth && proxy._setHorScrWidth && proxy._colWidth > 0 && !ej.isMobile() && proxy.model.allowScrolling && proxy.model.scrollSettings.enableColumnScrolling)
                    proxy.element.width(proxy._colWidth);
            }, 100);
            table.append(colgrp);
        },

        _renderTHead: function (htable) {
            var proxy = this;
            var thead = ej.buildTag("thead");
            var tr = ej.buildTag("tr.e-m-grid-hbar");
            if (this.model.columns.length > 0 && typeof (this.model.columns[0]) == "string") {
                var columns = $.extend({}, this.model.columns);
                this.model.columns = [];
                $.each(columns, function (indx, column) {
                    proxy.model.columns.push({ "field": column, "headerText": column });
                });
            }
            $.each(proxy.model.columns, function (indx, column) {
                var th = ej.buildTag("th.e-m-grid-hdrcell e-m-state-default");
                column.visible == false && th.addClass("e-hide");
                if (column.textAlign != undefined)
                    th.css("text-align", column.textAlign);
                if (indx == proxy.model.columns.length - 1)
                    th.addClass("e-m-grid-lastth");
                var div = ej.buildTag("div.e-m-grid-col-elem e-m-grid-coldesc e-m-grid-hcell");
                $.each(proxy.model.sortSettings.sortedColumns, function (i, sortCol) {
                    if (sortCol.columnName == column.field)
                        div.addClass("e-m-grid-" + sortCol.sortDirection);
                });
                var hcellClasses = "e-m-grid-hcelldiv";
                if (proxy.model.allowSorting && (column.allowSorting == undefined || column.allowSorting))
                    hcellClasses = hcellClasses + " e-m-sort";
                if (proxy.model.allowFiltering)
                    hcellClasses = hcellClasses + " e-m-filter";
                var idiv = ej.buildTag("div." + hcellClasses);
                var textSpan = ej.buildTag("span.e-m-title").html(column.headerText);
                idiv.append(textSpan);
                if (proxy.model.allowSorting && (column.allowSorting == undefined || column.allowSorting)) {
                    var sdiv = ej.buildTag("span.e-m-icon-grid-sort e-m-fontimage");
                    textSpan.append(sdiv);
                }
                div.append(idiv);
                if (proxy.model.allowFiltering && (column.allowFiltering == undefined || column.allowFiltering)) {
                    var fdiv = ej.buildTag("span.e-m-icon-grid-fltr e-m-fontimage");
                    div.append(fdiv);
                }
                th.append(div);
                tr.append(th);
            });
            thead.append(tr);
            htable.append(thead);
            var tbody = ej.buildTag("tbody", {}, { "display": "none" }).append(ej.buildTag("tr").append(ej.buildTag("td")));
            htable.append(tbody);
        },

        _renderColElements: function (action) {
            return ej.buildTag("div.e-m-grid-col-child e-m-grid-col-" + action).append(ej.buildTag("span.e-m-grid-" + action + "  e-m-fontimage"));
        },
        /* --------------------end region grid rendering-------------------------------------------*/

        /*----------------------- Region internal functions---------------------------------------------*/

        _load: function () {
            if (this.model.allowSelection && !this._selectionManager) {
                this.element.ejmGridSelectionManager(this.model.pageSettings);
                this._selectionManager = this.element.ejmGridSelectionManager("instance");
            }
            if (this._checkWaitingPopup())
                this.element.ejWaitingPopup({ autoDisplay: false });
            this.refreshContent("refresh");

        },

        _addInitialTemplate: function () {
            this._colInit = true;
            if (this.model.pageSettings.totalRecordsCount) {
                this._initColumns(this.model.currentViewData[0] != undefined ? this.model.currentViewData[0] : this.model.currentViewData.value);
                this.element.find(".e-m-grid-header").remove();
                this._renderHeader();
                var hdrElement = this.element.find(".e-m-grid-header");
                hdrElement.insertBefore(this.element.find(".e-m-grid-content"));

            }
            var id = this.element[0].id;
            var template = this._page.find("#" + id + "_JSONTemplate");
            $.views.helpers({ _gridFormatting: this._formatting });
            var TBODY = ej.buildTag("tbody");
            var trTemplate = ej.buildTag("tr");
            $(TBODY).attr('id', id + "_JSONTemplate").css('display', 'none');
            $.each(this.model.columns, function (index, column) {
                var tdCell = ej.buildTag("td.e-m-grid-rowcell");
                column.visible == false && tdCell.addClass("e-hide");
                tdCell.html("{{:" + "#data['" + column.field + "']" + "}}");
                if (column.textAlign != undefined)
                    tdCell.css("text-align", column.textAlign);
                if (column.format != undefined && column.format != "" || (column.type && column.type.toLowerCase() == "datetime" || column.type && column.type.toLowerCase() == "date")) {
                    if (column.format == "" || !column.format)
                        column.format = "{0:" + ej.preferredCulture().calendar.patterns.d + "}";
                    tdCell.html("{{:~_gridFormatting('" + column.format + "'," + "#data['" + column.field + "']" + "," + "#data['" + column.field + "']" + ")}}");
                }
                if (!ej.isNullOrUndefined(column["cssClass"])) {
                    tdCell.addClass(column["cssClass"]);
                }
                $(trTemplate).append(tdCell);
            });
            $(TBODY).append(trTemplate);
            $(this._page).append(TBODY);
        },

        _handleQueryCell: function (data) {
            if (data && data.length != 0) {
                this._gridRows = this._getGridContentTable().rows;
                if (this.model.queryCellInfo != null || this.model.rowDataBound != null) {
                    for (var row = 0; row < this._gridRows.length; row++)
                        this._rowEventtrigger(this._gridRows[row], data[row]);
                }
            }
        },

        _rowEventtrigger: function (row, data) {
            this._trigger("rowDataBound", { element: row, data: data });
            var tdCells = row.cells;
            for (cellIndex = 0; cellIndex < tdCells.length; cellIndex++) {
                var args = { element: tdCells[cellIndex], data: data, text: tdCells[cellIndex].innerHTML };
                this._trigger("queryCellInfo", args);
            }

        },
        _checkWaitingPopup: function () {
            return $.isFunction($.fn.ejWaitingPopup);
        },
        _renderScrollPager: function () {
            this._controlInit = false;
            this._pgrTxtContainer = $("#" + this._id + "_pgrtxt");
            this._updateScrollPager();
            this._pageScroller = this._createScroller({ enableHrScroll: true, enableVrScroll: false, showScrollbars: false, target: this._id + "_pgrtxt", rendermode: this.model.renderMode });
        },
        _updateScrollPager: function () {
            var template = {}, pageNumbers = [];
            if (!$.templates["pager"]) {
                template["pager"] = "{{if pageNumber < 100 }}<div class='e-m-page-num'>{{:pageNumber}}</div>{{else}}<div class='e-m-page-num e-m-page-large'>{{:pageNumber}}</div>{{/if}}";
                $.templates(template);
            }
            for (i = 1 ; i <= this._getPageCount() ; i++)
                pageNumbers.push({ "pageNumber": i });
            if (this._pgrTxtContainer.find(".e-m-pscroll").length > 0) {
                var div = $.render["pager"](pageNumbers);
                this._pgrTxtContainer.find(".e-m-pscroll").html(div);
            }
            else {
                var div = "<div class='e-m-pscroll'>" + $.render["pager"](pageNumbers) + "</div>";
                this._pgrTxtContainer.html(div);
            }
            $(this._pgrTxtContainer.find(".e-m-page-num")[parseInt(this.currentPage()) - 1]).addClass("e-m-state-active");
            if (this._pageScroller)
                this._pageScroller.ejmScrollPanel('refresh');
        },

        _findPredicate: function () {
            var predicate, prevColumn;
            $.each(this._filters, function (indx, obj) {
                var ignoreCase = false;
                if (typeof (obj.value) == "string")
                    ignoreCase = !obj.isCaseSensitive;
                if (prevColumn && prevColumn != obj.columnName)
                    obj.predicate = "and";
                if (obj.value != "") {
                    if (!predicate)
                        predicate = ej.Predicate(obj.columnName, obj.operator, obj.value, ignoreCase);
                    else
                        predicate = predicate[obj.predicate](obj.columnName, obj.operator, obj.value, ignoreCase);
                }
                prevColumn = obj.columnName;
            });
            return predicate;
        },

        _createQuery: function (requestType) {
            var predicate, sortedColumnInfo = [], query = [];
            query = this.model.query.clone().requiresCount();
            if (this.model.allowFiltering) {
                predicate = this._findPredicate();
                if (predicate) {
                    if (requestType == "filtering") {
                        this.currentPage(1);
                        if (this._pager)
                            this._pager.model.currentPage = 1;
                    }
                    query = query.where(predicate);
                }
            }
            if (this._sortedColumns && this.model.allowSorting) {
                var proxy = this;
                $.each(this._sortedColumns, function (index, value) {
                    if (proxy._sortDirection[index] == "descending")
                        value = value + " desc";
                    if (proxy._sortDirection[index] != "clearsorting")
                        sortedColumnInfo.push(value);
                });
                if (sortedColumnInfo.length > 0)
                    query.sortBy(sortedColumnInfo);
            }
            if (this.model.allowPaging) {
                if (this._getPageCount() < parseInt(this.currentPage()) && this.model.pageSettings.totalRecordsCount)
                    this.currentPage(1);
                query.page(parseInt(this.currentPage()), this.model.pageSettings.pageSize);
            }
            return query;
        },

        _getPageCount: function () {
            return Math.ceil(this.model.pageSettings.totalRecordsCount / this._pager.model.pageSize);
        },

        _afterDataProcess: function (requestType, data) {
            if (this.model.allowFiltering && this.model.allowPaging) {
                if (this.model.pageSettings.totalRecordsCount <= this._pager.model.pageSize)
                    this._pager.model.currentPage = 1;
                else {
                    var pages = this._getPageCount();
                    this._pager.model.currentPage = this._pager.model.currentPage < pages ? this._pager.model.currentPage : pages;
                }
                this.currentPage(this._pager.model.currentPage);
            }
            this._commonSuccessAction(this.model.pageSettings.totalRecordsCount, requestType);
            this._jsonSuccessAction(data, requestType);
            if (this.model.allowScrolling) {
                if (this.model.scrollSettings.height == "auto") {
                    var container = this.element.find(".e-m-grid-content");
                    var height = window.innerHeight - container.offset().top - (ej.isNullOrUndefined(this.element.nextAll().outerHeight()) ? 0 : this.element.nextAll().outerHeight());
                    if (!this.model.allowPaging)
                        height = height;
                    else
                        height = height - this.element.find(".e-m-grid-pager").height();
                    if (height > container.height())
                        height = container.height();
                }
                if (this.model.scrollSettings.enableRowScrolling && !this._verScroller)
                    this._verScroller = this._createScroller({ showScrollbars: false, targetHeight: this.model.scrollSettings.height == "auto" ? height : this.model.scrollSettings.height, rendermode: this.model.renderMode, target: this._id + "_content" });
                if (this.model.scrollSettings.enableColumnScrolling && !this._horScroller) {
                    var scrObj = { enableHrScroll: true, enableVrScroll: false, showScrollbars: false, target: this._id + "container", rendermode: this.model.renderMode };
                    var proxy = this;
                    setTimeout(function () {
                        if (proxy._setHorScrWidth || proxy.element.width() < proxy._colWidth)
                            scrObj["scrollWidth"] = proxy._colWidth;
                        proxy._horScroller = proxy._createScroller(scrObj);
                    }, 0);
                }
                if (this._controlInit)
                    this._resize();
            }
        },
        _createScroller: function (sObject) {
            var scroller = ej.buildTag("div");
            scroller.appendTo(this._page);
            sObject["enableNativeScrolling"] = this.model.scrollSettings.enableNativeScrolling;
			sObject["isRelative"] = true;
            scroller.ejmScrollPanel(sObject);
            return scroller;
        },
        _sendSortingRequest: function (columnName, sortDirection) {
            var currentIndx = 0;
            var avail = false;
            sortDirection = sortDirection.toLowerCase();
            if (columnName != null && columnName != "") {
                if (this.model.sortSettings.allowMultiSorting) {
                    for (i = 0; i < this._sortedColumns.length; i++) {
                        if (this._sortedColumns[i] == columnName) {
                            avail = true;
                            this._sortDirection[i] = sortDirection;
                        }
                    }
                    if (avail == false) {
                        this._sortedColumns.push(columnName);
                        this._sortDirection.push(sortDirection);
                    }
                }
                else {
                    this._sortedColumns[0] = columnName;
                    this._sortDirection[0] = sortDirection;
                }
            }
            this.refreshContent("sorting");

        },

        _setDateFilters: function (filterObject) {
            var prevDate = new Date(filterObject.value.setSeconds(filterObject.value.getSeconds() - 1));
            var nextDate = new Date(filterObject.value.setDate(filterObject.value.getDate() + 1));
            var prevObj = $.extend({}, filterObject);
            var nextObj = $.extend({}, filterObject);
            prevObj.value = prevDate;
            prevObj.operator = ">";
            prevObj.predicate = "and";
            nextObj.value = nextDate;
            nextObj.operator = "<";
            nextObj.predicate = "and";
            this._filters.push(prevObj);
            this._filters.push(nextObj);
        },

        _sendFilteringRequest: function (operators, values, predicate) {
            var firstLoop = false;
            if (operators != null) {
                for (var index = 0; index < operators.length; index++) {
                    if (values[index] != null) {
                        var filterObject = {
                            columnName: this._filteringMgr._currentFilterColumn.field,
                            operator: operators[index],
                            value: values[index],
                            predicate: predicate,
                            isCaseSensitive: this._filteringMgr._currentFilterColumn.isCaseSensitive == undefined ? false : this._filteringMgr._currentFilterColumn.isCaseSensitive
                        };
                        if (this._filters.length == 0) {
                            if ((this._filteringMgr._currentFilterColumn.type.toLowerCase() == "datetime" || this._filteringMgr._currentFilterColumn.type.toLowerCase() == "date") && operators == "equal")
                                this._setDateFilters(filterObject);
                            else
                                this._filters.push(filterObject);
                        }
                        else {
                            var proxy = this;
                            if (!firstLoop) {
                                var clearObj = new Array();
                                $.each(this._filters, function (key, value) {
                                    if (value.columnName == filterObject.columnName) {
                                        clearObj.push(value);
                                    }
                                });
                                $.each(clearObj, function () {
                                    proxy._filters.splice($.inArray(this, proxy._filters), 1);
                                });
                            }
                            if ((this._filteringMgr._currentFilterColumn.type.toLowerCase() == "datetime" || this._filteringMgr._currentFilterColumn.type.toLowerCase() == "date") && values[0] != "" && operators == "equal")
                                this._setDateFilters(filterObject);
                            else
                                this._filters.push(filterObject);
                        }
                    }
                    firstLoop = true;
                }
            }
            this._filteringMgr.model.filterConditions = this._filters;
            this.refreshContent("filtering");
        },

        _commonSuccessAction: function (totalRecordsCount, requestType) {
            if (requestType == "refresh" || requestType == "filtering") {
                this.model.pageSettings.totalRecordsCount = totalRecordsCount;
                var caption = this.model.caption == "" ? "" : this.model.caption + " :";
                this.element.find('.e-m-caption-row span').html(caption + totalRecordsCount + " " + this._localizedLabels["captionText"]);
            }
            if (this._pager != null) {
                if (this._pager.model.currentPage == 0 || this.model.pageSettings.totalRecordsCount <= this.model.pageSettings.pageSize)
                    this._pager._currentPageNo = 1;
                this._pager.model.totalRecordsCount = totalRecordsCount;
                this._pager._findLastPageNo();
                this._pager._refreshPager();
            }
            if (requestType == "filtering") {
                this._mainContainer.css("margin-top", -this.element.find(".e-m-grid-fbardiv").height() - 1 + "px");
            }
            else if (requestType == "sorting") {
                var hdrcell = $(this.element.find(".e-m-grid-hcell"));
                if (this.model.sortSettings.allowMultiSorting) {
                    $(hdrcell[this._currentColIdx])
                        .removeClass("e-m-grid-ascending e-m-grid-descending e-m-clearsorting")
                        .addClass("e-m-grid-" + this._currentSortDirection);
                }
                else {
                    hdrcell.removeClass("e-m-grid-ascending e-m-grid-descending e-m-clearsorting");
                    $(hdrcell[this._currentColIdx])
                       .addClass("e-m-grid-" + this._currentSortDirection);
                }

            }
        },

        _jsonSuccessAction: function (JSONdata, requestType) {
            var proxy = this;
            var records = JSONdata;
            var tbody = null;
            this._curTable = this.element.find(".e-m-grid-content table");
            if (requestType == "paging") {
                //hide pager
                var proxy = this;
                this._pager._refreshPager();
                this._selectionManager._parent = this._curTable;
            }
            tbody = $(this._curTable).find("tbody:first")[0];
            $(tbody).empty();
            if (records && records.length > 0) {
                $(tbody).html($("#" + this.element[0].id + "_JSONTemplate").render(records));
            }
            else {
                var tr = document.createElement('tr');
                var td = document.createElement('td');
                $(td).addClass("e-m-grid-emptycell").attr("colspan", "7").html(this._localizedLabels["emptyResult"]);
                $(tr).append(td);
                $(tbody).append(tr);
            }

            if (this._hiddenColumns.length > 0)
                this.hideColumns(this._colHideList);
            this._handleQueryCell(records);
            this._onRequestSuccess(requestType);
        },

        _formatting: function (formatstring, str, Member) {
            if (typeof (str) == "string" && str.indexOf("Date(") != -1) {
                str = new Date(parseInt(str.replace(/[^0-9 +]/g, '')));
                this.data[Member] = str;
            }
            formatstring = formatstring.replace(/%280/g, "\"").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
            var s = formatstring;
            var frontHtmlidx, FrontHtml, RearHtml, lastidxval;
            frontHtmlidx = formatstring.split("{0:");
            lastidxval = formatstring.split("}");
            FrontHtml = frontHtmlidx[0];
            RearHtml = lastidxval[1];
            if (formatstring.indexOf("{0:") != -1) {
                var toformat = new RegExp("\\{0(:([^\\}]+))?\\}", "gm");
                var formatVal = toformat.exec(formatstring);
                if (formatVal != null && str != null) {
                    if (FrontHtml != null && RearHtml != null)
                        str = FrontHtml + ej.format(str, formatVal[2], ej.preferredCulture().name) + RearHtml;
                    else
                        str = ej.format(str, formatVal[2], ej.preferredCulture().name);
                }
                else if (str != null)
                    str = str;
                else
                    str = "";
                return str;
            }
            else if (this.data != null && this.data.Value == null) {
                $.each(this.data, function (dataIndex, dataValue) {
                    s = s.replace(new RegExp('\\{' + dataIndex + '\\}', 'gm'), dataValue);
                });
                return s;
            }
            else {
                return this.data.Value;
            }
        },

        _onRequestSuccess: function (requestType) {
            if (this.model.allowSorting && requestType == 'sorting') {
                if (!this.model.sortSettings.allowMultiSorting && this._prevSortedCell)
                    $(this._prevSortedCell).removeClass(this._prevSortDirection.toLowerCase());
                var proxy = this;
                proxy.model.sortSettings.sortedColumns = [];
                $.each(this._sortedColumns, function (index, value) {
                    proxy.model.sortSettings.sortedColumns.push({ columnName: value, sortDirection: proxy._sortDirection[index] });
                });
            }
            var args = { requestType: requestType };
            this._trigger("actionSuccess", args);
            this._prevSortDirection = this._currentSortDirection;
            this._prevSortedCell = this._currentClickedCell;
        },

        _colNavigationHandler: function (e) {
            if (ej.isMobile())
                App.transferPage(ej.getCurrentPage, "#" + this._id + "colnav", { transition: this.model.transition, parentSubPage: true });
            else
                App.transferPage(this.element, "#" + this._id + "colnav", { transition: this.model.transition, parentSubPage: true });
        },

        _touchStartHandler: function (e) {
            var target = this._findColTarget($(e.target));
            if (ej.isWindows())
                ej._touchStartPoints(e, this);
            if (target.hasClass("e-m-grid-col-elem") || (target.hasClass("e-m-icon-grid-clear"))
                 || (this.model.allowColumnSelector && target.hasClass("e-m-grid-colnav"))) {
                $(target).addClass("e-m-state-active");
            }
            ej.listenEvents([this.element], [ej.moveEvent()], [this._touchMoveDelegate], false);
        },

        _touchMoveHandler: function (e) {
            $(e.target.parentElement).hasClass("e-m-state-active") ? $(e.target.parentElement).removeClass("e-m-state-active").addClass("e-m-state-default") : $(e.target).hasClass("e-m-icon-grid-clear e-m-fontimage e-m-state-active") ? $(e.target).removeClass("e-m-state-active") : null;
            if (!ej.isWindows() || (ej.isWindows() && ej._isTouchMoved(e, this)))
                this._touchMove = true;
        },

        _findColTarget: function (target) {
            if (target.hasClass("e-m-grid-hcell") || target.hasClass("e-m-grid-hcelldiv")
                || target.hasClass("e-m-icon-grid-sort") || target.hasClass("e-m-icon-grid-fltr") || target.hasClass("e-m-title"))
                target = target.parent();
            if (target.hasClass("e-m-grid-hcelldiv") || target.hasClass("e-m-title"))
                target = target.parent();
            if (target.hasClass("e-m-grid-hcelldiv"))
                target = target.parent();
            return target;
        },

        _touchEndHandler: function (e) {
            this.element.find(".e-m-grid-col-elem").removeClass("e-m-state-active");
            if (!this._touchMove) {
                if (this.model.allowSelection && this._selectionManager != null)
                    this._selectionManager._selectHandler(e);

                if (this.model.allowColumnSelector && $(e.target).hasClass("e-m-grid-colnav")) {
                    this._colNavigationHandler(e);
                    $(e.target).removeClass("e-m-state-active");
                }
                if ($(e.target).hasClass("e-m-icon-grid-clear"))
                    $(e.target).removeClass("e-m-state-active");
                var target = e.target;
                if (!$(target).hasClass("e-m-text-input")) {
                    e.preventDefault();
                    e.returnValue = false;
                }
                var parent = $(target).parents('table:first');
                if (this._currentColIdx)
                    this._currentClickedCell = $(this.element.find('.e-m-grid-hbar').first().find('th')[this._currentColIdx]).find('div:first').first();
                if (target != null && target.parentNode != null) {
                    if (this._processSortDirection(e, target) && this._currentSortColumn != null) {
                        if (!this.model.sortSettings.allowMultiSorting) {
                            this._sortedColumns = [];
                            this._sortDirection = [];
                        }
                        this._sendSortingRequest(this._currentSortColumn, this._currentSortDirection);
                    }
                    if (this.model.allowFiltering && $(target).hasClass('e-m-icon-grid-fltr')) {
                        this._currentColIdx = $(target).parents('th.e-m-grid-hdrcell')[0].cellIndex;
                        this._filteringMgr._currentFilterColumn = this.model.columns[this._currentColIdx];
                        this._filteringMgr._displayFilterbar();
                    }
                }
                if (!$(e.target).hasClass("e-m-text-input") && !$(e.target).hasClass("e-m-icon-grid-clear") && !$(e.target).hasClass("e-m-icon-grid-fltr") && this.model.allowFiltering) {
                    this._filteringMgr._fDiv.css("visibility", "hidden");
                    $(this.element).find(".e-m-grid-container").css("margin-top", -this._filteringMgr._fDiv.height() - 1 + "px");
                    this._filteringMgr._fBarVisible = false;
                    this._filteringMgr._fInput.blur();
                }
            }
            this._touchMove = false;
            ej.listenEvents([this.element], [ej.moveEvent()], [this._touchMoveDelegate], true);
        },

        _processSortDirection: function (e, target) {
            if (this.model.allowSorting && ($(target).hasClass("e-m-grid-hcelldiv") || $(target).hasClass("e-m-icon-grid-sort") || $(target).hasClass("e-m-title"))) {
                var parNode = $(e.target).parents('th.e-m-grid-hdrcell')[0];
                if ($(parNode).find(".e-m-sort").length > 0) {
                    this._currentColIdx = parNode.cellIndex;
                    var headerDiv = $(parNode).find('div.e-m-grid-col-elem')[0];
                    if (this._currentColIdx >= 0) {
                        this._currentSortColumn = this.getColumnMemberByIndex(this._currentColIdx);
                        if (this._currentSortColumn == null)
                            return false;
                        this._currentSortDirection = $(headerDiv).hasClass("e-m-grid-ascending") ? "descending" :
                                                     ($(headerDiv).hasClass("e-m-grid-descending") ? "clearsorting" : "ascending");
                    }
                    return true;
                }
                else
                    return false;
            } else {
                return false;
            }
        },

        /* ---------------------region Event handling----------------------------------------------*/

        _wireEvents: function (remove) {
            ej.listenEvents([this.element, this.element, this.element], [ej.startEvent(), ej.endEvent()],
                [this._touchStartDelegate, this._touchEndDelegate], remove);
            if (this._filteringMgr && this.model.allowFiltering)
                this._filteringMgr._wireEvents(remove);
            if (this._pager && this.model.allowPaging)
                this._pager._wireEvents(remove);
            var evt = "onorientationchange" in window ? "orientationchange" : "resize";
            ej.listenEvents([window], [evt], [this._orientationChangeDelegate], remove);
        },

        _createDelegates: function () {
            this._touchStartDelegate = $.proxy(this._touchStartHandler, this);
            this._touchEndDelegate = $.proxy(this._touchEndHandler, this);
            this._touchMoveDelegate = $.proxy(this._touchMoveHandler, this);
            this._orientationChangeDelegate = $.proxy(this._orientationChangeHandler, this);
        },
        /* --------------------- end region Event handling----------------------------------------------*/

        _getGridContentTable: function () {
            return this._gridContentTable;
        },

        _orientationChangeHandler: function () {
            if (this.model.scrollSettings.height == "auto") {
                var proxy = this;
                if (!ej.isAndroid())
                    this._resize();
                else {
                    setTimeout(function () {
                        proxy._resize();
                    }, 400);
                }
            }
        },

        _resize: function () {
            var height;
            var container = this.element.find(".e-m-grid-content");
            var winHeihgt = window.innerHeight;
            height = this.element.parent().height() > winHeihgt ? winHeihgt : this.element.parent().height();
            height -= this.element.find('.e-m-grid-header').outerHeight() + (ej.isNullOrUndefined(this.element.nextAll(":not(script,style)").outerHeight()) ? 0 : this.element.nextAll(":not(script,style)").outerHeight());
            if (!this.model.allowPaging)
                height = height;
            else {
                height = height - this.element.find(".e-m-grid-pager").height();
            }
            var scrollObj = this._verScroller.ejmScrollPanel("instance");
            scrollObj.model.targetHeight = height;
            scrollObj.refresh();
        },

        _setGridContentTable: function (value) {
            this._gridContentTable = value;
        },

        _hideHeaderColumn: function (hiddenColumns, field) {
            var $table = this.element.find(".e-m-grid-header .e-m-grid-table");
            var $head = $table.find("thead");
            var $headerCell = $head.find(".e-m-grid-hdrcell");
            var $col = $table.find("colgroup").find("col");
			var colHeaderText=[];
			 $.map(this.model.columns, function (val, i) {
                colHeaderText.push(val.headerText)
            });
			var duparr = this._isDuplicate(colHeaderText);
            for (var i = 0; i < hiddenColumns.length; i++) {
                if(duparr)
                var column = this.getColumnByField(hiddenColumns[i]);
			else
				var column = this.getColumnByHeaderText(hiddenColumns[i]);
                var index = $.inArray(column, this.model.columns);
                var thIndex = $headerCell.eq(index).addClass("e-hide").index();
                if ($col.length > this.model.columns.length)
                    $col = $col.slice($col.length - this.model.columns.length);
                $col.eq(index).addClass("e-hide");
                $(this._curTable).find("col").eq(index).addClass("e-hide");
            }

        },

        _showHeaderColumn: function (showColumns, field) {
            var $table = this.element.find(".e-m-grid-header .e-m-grid-table");
            var $head = $table.find("thead");
            var $headerCell = $head.find(".e-m-grid-hdrcell");
            var $col = $table.find("colgroup").find("col");
			var colHeaderText=[];
			 $.map(this.model.columns, function (val, i) {
                colHeaderText.push(val.headerText)
            });
			var duparr = this._isDuplicate(colHeaderText);
            for (var i = 0; i < showColumns.length; i++) {
                if(duparr)
                var column = this.getColumnByField(showColumns[i]);
			else
				var column = this.getColumnByHeaderText(showColumns[i]);
                var index = $.inArray(column, this.model.columns);
                var thIndex = $headerCell.eq(index).removeClass("e-hide").index();
                $col.eq(index).removeClass("e-hide");
                $(this._curTable).find("col").eq(index).removeClass("e-hide");
            }
        },

        _showHideColumns: function (action, col, colCollection1, colCollection2) {
            var i, count = 0, args = {}, index, column,colHeaderText=[];
			 $.map(this.model.columns, function (val, i) {
                colHeaderText.push(val.headerText)
            });
			var duparr = this._isDuplicate(colHeaderText);
            if ($.isArray(col)) {
                for (i = 0; i < col.length; i++) {
                    index = $.inArray(col[i], colCollection2);
                    if (index != -1) {
                        colCollection1.push(col[i]);
                        colCollection2.splice(index, 1);
                    }
                }
            } else {
                index = $.inArray(col, colCollection2);
                if (index != -1) {
                    colCollection1.push(col);
                    colCollection2.splice(index, 1);
                }
            }
            for (i = 0; i < this.model.columns.length; i++) {
				if(duparr)
				column = this.model.columns[i].field;
				else
					column = this.model.columns[i].headerText;
                if ($.inArray(column, colCollection1) != -1) {
                    var visible = false, classAction = "addClass";
                    if (action == "show") {
                        visible = true;
                        classAction = "removeClass";
                    }
                    this.model.columns[i].visible = visible;
                    $(this._curTable).find("tr td:nth-child(" + (i + 1) + ")")[classAction]("e-hide");
                    count++;
                }
                if (colCollection1.length == count)
                    break;
            }
            var func = action == "hide" ? "_hideHeaderColumn" : "_showHeaderColumn";
            this[func](colCollection1);
        },
		_isDuplicate: function (arr) {
            var temp, count = [], duplicate = [];
            for (var i = 0; i < arr.length; i++) {
                temp = arr[i];
                if (count[temp] >= 1)
                    count[temp] = count[temp] + 1;
                else
                    count[temp] = 1;
            }
            for (temp in count) {
                if (count[temp] > 1)
                    return true;
            }
            return false;
        },
        _initColumns: function (object) {
            while (object.items != undefined)
                object = object.items[0];
            if (this.model.columns.length == 0 && object) {
                for (var field in object) {
                    if (object.hasOwnProperty(field) && (typeof (object[field]) != "object" || object[field] instanceof Date)) {
                        var value = object[field];
                        this.model.columns.push({
                            field: field,
                            type: value != null ? (value.getDay ? "date" : typeof (value)) : null
                        });
                    }
                }
            }
            else {
                for (var index = 0; index < this.model.columns.length; index++) {
                    if (ej.isNullOrUndefined(this.model.columns[index].type)) {
                        var $field = object[this.model.columns[index].field];
                        this.model.columns[index].type = $field != null ? ($field.getDay ? "date" : typeof ($field)) : null;
                    }
                }
            }
        },

        _refresh: function () {
            this._destroy();
            this.element.addClass("m-grid");
            this._render();
            this._wireEvents(false);
        },

        _destroy: function () {
            this._wireEvents(true);
            if (this.model.allowColumnSelector) {
                this.element.unwrap();
                $(ej.getCurrentPage().find("#" + this._id + "colnav")).remove();
            }
            if ($(ej.getCurrentPage().find("#" + this._id + "_validationDlg")).length)
                $(ej.getCurrentPage().find("#" + this._id + "_validationDlg")).ejmDialog("destroy").remove();
            if ($(ej.getCurrentPage().find("#" + this._id + "_warningDlg")).length)
                $(ej.getCurrentPage().find("#" + this._id + "_warningDlg")).ejmDialog("destroy").remove();
            if ($(ej.getCurrentPage().find("#" + this._id + "_JSONTemplate")).length) {
                $(ej.getCurrentPage().find("#" + this._id + "_JSONTemplate")).remove();
                this._colInit = false;
            }
            this._verScroller = undefined;
            this._horScroller = undefined;
            this._pageScroller = undefined;
            this.element.empty().removeAttr("class");
            $("#" + this._id + "_pager").remove();
        },
		_setFormat: function () {
            var column = [];
            for (var i = 0 ; i < this.model.columns.length ; i++) {
                if (this.model.columns[i].type == "date" || this.model.columns[i].type == "datetime") {
                    column.push(this.model.columns[i]);
                }
            }
            if (column.length > 0 && !ej.isNullOrUndefined(this.model.currentViewData)) {
                for (var i = 0, len = this.model.currentViewData.length; i < len ; i++) {
                    for (var j = 0 ; j < column.length ; j++) {
                        var data = ej.getObject(column[j].field, this.model.currentViewData[i]);
                        if (/^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))?$/.test(data))
                            ej.createObject(column[j].field, new Date(data), this.model.currentViewData[i]);
                    }
                }
            }
        },

        _processDataSource: function (query, dataManager, requestType) {
            var proxy = this;
            if (this._checkWaitingPopup())
                this.element.ejWaitingPopup("show");
            var process = dataManager.executeQuery(query);
            process.done(function (e) {
                query.queries = [];
                proxy.model.pageSettings.totalRecordsCount = e.count;
                proxy.model.currentViewData = e.result;
				proxy._setFormat();
                if (!proxy._colInit)
                    proxy._addInitialTemplate();
                if (proxy.model.pageSettings.type == "scrollable" && proxy.model.allowPaging && proxy._controlInit)
                    proxy._renderScrollPager();
                if (!proxy.model.totalRecorsCount && proxy.model.allowPaging)
                    proxy._pager._findLastPageNo();
                proxy._afterDataProcess(requestType, e.result);
                if (proxy._verScroller)
                    proxy._verScroller.ejmScrollPanel("refresh");
                if (proxy.model.allowPaging && proxy._pager._lastPNo > 1)
                    proxy._pageScroller.ejmScrollPanel("scrollToElement", proxy._pager.element.find(".e-m-page-num")[parseInt(proxy.currentPage()) - 1], 100, true, true);
                if (proxy._checkWaitingPopup())
                    proxy.element.ejWaitingPopup("hide");
                if (proxy.selectedRowIndex() != -1 && proxy.model.allowSelection && proxy._rowSelect) {
                    proxy._selectionManager._selectRow(proxy.selectedRowIndex());
                    proxy._rowSelect = false;
                }
                proxy._initialRender && proxy._trigger("dataBound", { model: proxy.model });
                proxy._initialRender = false;
            });
            process.always(function (e) {
                var args = { requestType: requestType };
                proxy._trigger("actionComplete", args);
            });
            process.fail(function (e) {
                if (proxy._checkWaitingPopup())
                    proxy.element.ejWaitingPopup("hide");
                var args = { requestType: requestType };
                proxy._trigger("actionFailure", args);
            });
        },
        /* Public Functions*/

        refreshContent: function (requestType) {
            if (!requestType)
                requestType = "refresh";
            var args = { requestType: requestType };
            this._trigger("actionBegin", args);
            var proxy = this, dataManager, query;
            if (proxy.model.pageSettings.type == "scrollable" && proxy.model.allowPaging && proxy._pgrTxtContainer) {
                this._pgrTxtContainer.find(".e-m-page-num").removeClass("e-m-state-active");
                $(this._pgrTxtContainer.find(".e-m-page-num")[parseInt(proxy.currentPage()) - 1]).addClass("e-m-state-active");
            }
            if (proxy.selectedRowIndex() != -1)
                proxy._rowSelect = true;
            if (this.dataSource() instanceof ej.DataManager) {
                dataManager = this.dataSource();
                if (dataManager.dataSource.table != null)
                    dataManager.dataSource.table.css("display", "none");
                query = this._createQuery(requestType), columnNames = [];
                $.each(this.model.columns, function (index, object) {
                    columnNames.push(object.field);
                });
                query = query.select(columnNames);
                if (this.dataSource().ready != undefined) {
                    var proxy = this;
                    this.dataSource().ready.done(function (args) {
                        dataManager = ej.DataManager(args.result);
                        proxy._processDataSource(query, dataManager, requestType);
                    });
                }
                else
                    this._processDataSource(query, dataManager, requestType);

            }
            else {
                dataManager = ej.DataManager(this.dataSource());
                query = this._createQuery(requestType);
                this._processDataSource(query, dataManager, requestType);
            }

        },

        scrollRefresh: function () {
            if (this._verScroller)
                this._verScroller.ejmScrollPanel('refresh');
            if (this._horScroller)
                this._horScroller.ejmScrollPanel('refresh');
            if (this._pageScroller)
                this._pageScroller.ejmScrollPanel('refresh');
        },

        getColumnByHeaderText: function (headerText) {
            for (var column = 0; column < this.model.columns.length; column++) {
                if (this.model.columns[column]["headerText"] == headerText)
                    break;
            }
            return column == this.model.columns.length ? null : this.model.columns[column];
        },

        getColumnByField: function (field) {
            for (var column = 0; column < this.model.columns.length; column++) {
                if (this.model.columns[column]["field"] == field)
                    break;
            }
            return column == this.model.columns.length ? null : this.model.columns[column];
        },

        getColumnByIndex: function (index) {
            if (index < this.model.columns.length)
                return this.model.columns[index];
            return null;
        },

        getColumnIndexByField: function (field) {
            for (var column = 0; column < this.model.columns.length; column++) {
                if (this.model.columns[column]["field"] == field)
                    break;
            }
            return column;
        },

        getColumnMemberByIndex: function (colIdx) {
            if (colIdx < 0)
                return null;
            else if (this.model.columns.length > colIdx)
                return this.model.columns[colIdx].field;
            else
                return null;
        },

        getColumnFieldNames: function () {
            var columnNames = [];
            for (var column = 0; column < this.model.columns.length; column++) {
                if (this.model.columns[column]["field"])
                    columnNames.push(this.model.columns[column]["field"]);
            }
            return columnNames;
        },

        hideColumns: function (col) {
            this._showHideColumns("hide", col, this._hiddenColumns, this._visibleColumns);
        },

        showColumns: function (col) {
            this._showHideColumns("show", col, this._visibleColumns, this._hiddenColumns);
        },

        /* End Public function */

        _setModel: function (options) {
            var refresh = false;
            var updateDB = false;
            var refreshPage = false;            
            for (var prop in options) {
                if (typeof (options[prop]) == "object" && prop != "dataSource" && prop != "columns")
                    $.each(options[prop], function (propName) {
                        prop = propName;
                    });
                switch (prop) {
                    case "locale":
                        this._setLocale(options.locale);
                        refresh = true;
                        break;
                    case "renderMode":
                        this.model.renderMode = options.renderMode;
                        this._setRenderMode();
                        break;
                    case "pageSize":
                        this._pager.model.pageSize = this.model.pageSettings.pageSize;
                        refreshPage = true;
                        break;
                    case "currentPage":
                        if (this.model.allowPaging) {
                            if (ej.isNullOrUndefined(options[prop]) || this._pager.model.currentPage != parseInt(this.currentPage())) {
                                this._pager.model.currentPage = parseInt(this.currentPage());
                            }
                            refreshPage = true;
                        }
                        break;
                    case "display":
                    case "type":
                        if (this.model.allowPaging) {
                            $.extend(this.model.pageSettings, options[prop]);
                            this._pager.model.display = this.model.pageSettings.display;
                            this._pager.model.type = this.model.pageSettings.type;
                            refresh = true;
                        }
                        break;
                    case "dataSource":
                        updateDB = true;
                        this._initialRender = true;
                        break;
                    case "allowPaging":
                    case "allowFiltering":
                    case "allowSorting":
                    case "allowScrolling":
                    case "allowColumnSelector":
                    case "height":
                    case "columns":
                        refresh = true;
                        break;
                    case "sortedColumns":
                        if (this.model.allowSorting) {
                            this._sortedColumns = [];
                            this._sortDirection = [];
                            this._handleInitialSorting();
                            this.refreshContent("sorting");
                        }
                        break;
                    case "filteredColumns":
                        if (this.model.allowFiltering) {
                            this._filters = options.filterSettings.filteredColumns;
                            this.refreshContent("filtering");
                        }
                        break;
                    case "showCaption":
                        if (this.model.showCaption)
                            this._renderCaption();
                        else
                            this.element.find(".e-m-caption-row").remove();
                        break;
                    case "caption":
                        this.element.find(".e-m-caption-row span").html(this.model.caption + ": " + this.dataSource().length + " " + this._localizedLabels["captionText"]);
                        break;
                    case "cssClass":
                        this.element.addClass(this.model.cssClass).removeClass(this._cssClass);
                        this._cssClass = this.model.cssClass;
                        break;
                    case "selectedRowIndex":
                        if (this.model.allowSelection) {
                            this._selectionManager._selectRow(this.selectedRowIndex());
                            this._rowSelect = false;
                        }
                        break;
                }

            }
            if (refresh) {
                this._controlInit = true;
                if (this._verScroller) {
                    this._verScroller.remove();
                    this._verScroller = null;
                }
                if (this._horScroller) {
                    this._horScroller.remove();
                    this._horScroller = null;
                }
                if (this._pageScroller) {
                    this._pageScroller.remove();
                    this._pageScroller = null;
                }
                this._refresh();
            }
            else if (updateDB)
                this.refreshContent("refresh");
            else if (refreshPage)
                this.refreshContent("paging");
            //this._trigger("modelChange", { "changes": options });
        },
        /* End Set Model */

    });

})(jQuery, Syncfusion);




(function ($, ej, undefined) {
    // ejmGridFilter is the plugin name 
    // "ej.mobile.GridFilter" is "namespace.className" will hold functions and properties

    ej.widget("ejmGridFilter", "ej.mobile.GridFilter", {
        _rootCSS: "e-m-filter",

        _init: function () {
            this.page = ej.getCurrentPage();
            this._fDiv = this.page.find("#" + this.model.id + ' .e-m-grid-fbardiv');
            this._fInput = $(this._fDiv).find('input');
            this._currentFilterColumn = null;
            this.predicate = "or";
            this._filterValue = "";
            this._oldFilterValue = "";
            this._operatorValue = new Array();
            this._filterValueOldLenth = 0;
            this._filterValueCurrentLenth = 0;
            this._currentFilterbarValue = null;
            this._alreadyFilterProcessed = false;
            this._oldFilterColumn = null;
            this._skipFilterProcess = false;
            this._tokens = new Array("%", "<", "<=", ">", ">=", "!", "=", "*");
            this._tokenNames = new Array("startswith", "lessthan", "lessthanorequal", "greaterthan", "greaterthanorequal", "notequal", "equal", "contains");
            this._tokenType = null;
            this._fltrValCollection = new Array();
            this._colFltrValues = [];            
        },

        _wireEvents: function (remove) {
            var event = remove ? "off" : "on";
            var clear = $(this._fDiv).find('.e-m-icon-grid-clear');
            var form = $(this._fDiv).find('form');
            ej.listenEvents([clear, form], [ej.endEvent(), "submit"], [$.proxy(this._clearHandler, this), $.proxy(this._filterBarValueHandler, this)], remove);
            if (this.model.filterBarMode == "immediate")
                ej.listenEvents([this._fInput], ["keyup"], [$.proxy(this._filterBarValueHandler, this)], remove);
        },

        _clearHandler: function (e) {
            this._fInput.val("");
            this._fInput.focus();
        },

        _displayFilterbar: function () {
            if (!this._fBarVisible) {
                this._fInput.val("");
                if (this._colFltrValues[this._currentFilterColumn.field] != null)
                    this._fInput.val(this._colFltrValues[this._currentFilterColumn.field]);
                else if (this.model.filterConditions) {
                    var predicate, value = "", proxy = this;
                    $.each(this.model.filterConditions, function (index, val) {
                        if (val.columnName == proxy._currentFilterColumn.field) {
                            if (predicate)
                                value = value + " " + (predicate == "or" ? "||" : "&&") + " ";
                            if (val.operator == "startswith" || val.operator == "endswith")
                                value = value + (val.operator == "startswith" ? val.value + "%" : "%" + val.value);
                            else {
                                var index = $.inArray(val.operator, proxy._tokenNames);
                                index = index == -1 ? 1 : index;
                                value = value + proxy._tokens[index] + val.value;
                            }
                            predicate = val.predicate;
                        }
                    });

                }
                var proxy = this;
                var value = proxy._fInput.val();
                this._fInput.attr("placeholder", this._currentFilterColumn.headerText);
                this._fDiv.css("visibility", "visible");
                $("#" + this.model.id).find(".e-m-grid-container").css("margin-top", "0px");
                this._fBarVisible = true;
            }
            else {
                $("#" + this.model.id).find(".e-m-grid-container").css("margin-top", -this._fDiv.height() - 1 + "px");
                this._fBarVisible = false;
                this._fInput.blur();
            }
        },

        _filterBarValueHandler: function (e) {
            e.preventDefault();
            if (!(e.type == "submit" && this.model.filterBarMode == "immediate")) {
                var keycode = e.keyCode;
                if (keycode != 9) {
                    if (this._currentFilterColumn == null)
                        return;
                    if (this._currentFilterColumn != this._oldFilterColumn)
                        this._filterValueOldLenth = 0;

                    this._currentFilterbarValue = $(this.page.find("#" + this.model.id + " input")).val();
                    this._colFltrValues[this._currentFilterColumn.field] = this._currentFilterbarValue;
                    this._filterValueCurrentLenth = this._currentFilterbarValue.length;
                    if (((this._filterValueCurrentLenth == 0 && this._filterValueOldLenth == 0) || this._currentFilterbarValue == this._oldFilterValue) && this._currentFilterColumn == this._oldFilterColumn)
                        return false;
                    this._skipFilterProcess = this._checkForSkipInput();
                    if (!this._skipFilterProcess) {
                        this._checkFilterProcess();
                    }
                    else {
                        this._skipFilterProcess = false;
                        return false;
                    }
                }
            }
            return false;
        },

        _createValidationDialog: function () {
            this._validationDlg = ej.buildTag("div")
                .append(ej.buildTag("div.e-m-filter-validate").html(this._gridObj._localizedLabels["filterValidation"]));
            this._validationDlg.attr("id", this.model.id + "_validationDlg");
            this.element.append(this._validationDlg);
            this._validationDlg.ejmDialog({ leftButtonCaption: this._gridObj._localizedLabels["filterOk"], renderMode: this._gridObj.model.renderMode, title: this._gridObj._localizedLabels["filterWarning"], mode: "alert", enableAutoOpen: false, enableModal: true });
            this._validationDlg.ejmDialog({ "buttonTap": ej.proxy(this._OkBtnHandler, this) });
        },

        _OkBtnHandler: function (e) {
            this._validationDlg.ejmDialog("close");
        },

        _checkFilterProcess: function () {
            if (this.model.filterBarMode == "immediate") {
                if (!this._alreadyFilterProcessed) {
                    this._alreadyFilterProcessed = true;
                    this._startTimer();
                } else {
                    this._stopTimer();
                    this._startTimer();
                }
            }
            else
                this._processFilter();
        },

        _startTimer: function () {
            var proxy = this;
            this._timer = window.setTimeout(
                function () {
                    proxy._processFilter();
                },
                proxy.model.interval);
        },

        _stopTimer: function () {
            this._oldFilterColumn = this._currentFilterColumn;
            this._filterValueOldLenth = this._filterValueCurrentLenth;
            if (this._timer != null)
                window.clearTimeout(this._timer);
        },

        _processFilter: function () {
            this._findPredicate();
            this._fInput.blur();
            if (!this._gridObj)
                this._gridObj = $("#" + this.model.id).ejmGrid("instance");
            if (!this._skipFilterProcess && this._fltrValCollection.length > 0) {
                this._gridObj._sendFilteringRequest(this._operatorValue, this._fltrValCollection, this.predicate);
                this._fBarVisible = (this._fBarVisible) ? false : true;
            }
            else {
                if (!this._validationDlg)
                    this._createValidationDialog();
                this._validationDlg.find(".e-m-filter-validate").html(this._gridObj._localizedLabels["filterTypeValidation"] + " \ " + this._currentFilterColumn.type + "\ ");
                this._validationDlg.ejmDialog("open");
            }
            this._oldFilterValue = this._filterValue;
            this._filterValue = "";
            //clearing the array collection
            this._fltrValCollection = new Array();
            this._operatorValue = new Array();
            this._tokenType = null;
        },

        _findPredicate: function () {
            var _value = this._currentFilterbarValue.replace(/ and /i, " AND ").replace(/ or /i, " OR ").replace(/ && /i, " AND ").replace(" || ", " OR ");
            var _predicateFinder = _value.split(' ');
            if (_predicateFinder.length != 0) {
                if (_predicateFinder[1] == "AND") {
                    this._skipFilterProcess = false;
                    this.predicate = "and";
                    var valuesArray = _value.split(" AND ");
                    this._validator(valuesArray);
                }
                else if (_predicateFinder[1] == "OR") {
                    this._skipFilterProcess = false;
                    this.predicate = "or";
                    var valuesArray = _value.split(" OR ");
                    this._validator(valuesArray);
                }
                else
                    this._validateFilterValue(this._currentFilterbarValue.trim());
            }
            else
                this._validateFilterValue(this._currentFilterbarValue.trim());
        },

        _validator: function (valuesArray) {
            var context = this;
            $.each(valuesArray, function (indx, val) {
                //to check whether the expressions has some values
                if (val != "") {
                    context._validateFilterValue(val, context._currentFilterColumn.type);
                    context._filterValue = "";
                }
                else {
                    context._skipFilterProcess = true;
                    //clearing the array collection
                    context.filterValueCollection = new Array();
                    context._operatorValue = new Array();
                    context.TokenType = null;
                }
            });
        },

        _checkNumericDataType: function () {
            if (this._currentFilterColumn.type && (this._currentFilterColumn.type.toLowerCase() == "number" || this._currentFilterColumn.type.toLowerCase() == "double" || this._currentFilterColumn.type.toLowerCase() == "decimal" || this._currentFilterColumn.type.toLowerCase() == "datetime" || this._currentFilterColumn.type.toLowerCase() == "date")) {
                return true;
            }
        },

        _checkForSkipInput: function () {
            var IsSkip = false;
            var skipInput = new Array(">", "<", "=", "!", " ");
            var context = this;
            if (this._checkNumericDataType()) {
                $.each(skipInput, function (index, value) {
                    if (value == context._currentFilterbarValue)
                        IsSkip = true;
                });
            }
            if (this._currentFilterColumn.type && this._currentFilterColumn.type.toLowerCase() == "string") {
                var stringSkipInput = new Array(">", "<", "=", "!");
                for (var str = 0; str < this._currentFilterbarValue.length ; str++) {
                    if (jQuery.inArray(this._currentFilterbarValue[str], stringSkipInput) != -1)
                        IsSkip = true;
                }
            }
            return IsSkip;
        },

        _validateFilterValue: function (_value) {
            this._findFilterValue(_value);
            if ((this._tokenType == null || this._tokenType == undefined) && (this._currentFilterColumn.type && this._currentFilterColumn.type.toLowerCase() == "string"))
                this._operatorValue.push(ej.FilterOperators.startsWith);
            else if ((this._tokenType == null || this._tokenType == undefined) && (this._checkNumericDataType()))
                this._operatorValue.push(ej.FilterOperators.equal);
            if (this._currentFilterColumn.type && (this._currentFilterColumn.type.toLowerCase() == "datetime" || this._currentFilterColumn.type.toLowerCase() == "date")) {
                var _cArr;
                if (this._currentFilterColumn.format == "")
                    _cArr = ej.preferredCulture().calendar.patterns.d; //System Date format
                else
                    _cArr = this._currentFilterColumn.format.split(':')[1].replace('}', "");
                if (this._filterValue != "")
                    this._filterValue = ej.parseDate(this._filterValue, _cArr);

            }

            //to validate for spaces, <,<=,etc in between the values
            if (this._checkNumericDataType()) {
                var numericSkip = new Array(">", "<", "=", "!", " ");
                for (var i = 0; i < this._filterValue.length; i++) {
                    char = this._filterValue.charAt(i);
                    if (jQuery.inArray(char, numericSkip) != -1)
                        this._skipFilterProcess = true;
                }
                if (this._currentFilterColumn.type && this._currentFilterColumn.type.toLowerCase() != "datetime" && this._currentFilterColumn.type.toLowerCase() != "date" && this._filterValue != "")
                    this._filterValue = parseFloat(this._filterValue);
            }
            if ((this.model.filterConditions.length > 0 && this._filterValue == "") || (this.model.filterConditions.length >= 0 && this._filterValue != ""))
                this._fltrValCollection.push(this._filterValue);
            //if operator not mentioned in second expression, set it to '=' operator
            if (this._operatorValue.length != this._fltrValCollection.length)
                this._operatorValue.push(ej.FilterOperators.equal);
        },

        _findOperators: function (isEmptyText, _value) {
            switch (_value) {
                case "%":
                    if (isEmptyText) {
                        this._tokenType = "startsWith";
                        this._operatorValue.push(ej.FilterOperators.startsWith);
                    }
                    else {
                        this._tokenType = "endsWith";
                        this._operatorValue.push(ej.FilterOperators.endsWith);
                    }
                    break;
                case "*":
                    this._tokenType = "contains";
                    this._operatorValue.push(ej.FilterOperators.contains);
                    break;
                case "<":
                    this._tokenType = "lessThan";
                    this._operatorValue.push(ej.FilterOperators.lessThan);
                    break;
                case "<=":
                    this._tokenType = "lessThanOrEqual";
                    this._operatorValue.push(ej.FilterOperators.lessThanOrEqual);
                    break;
                case "=":
                    this._tokenType = "equal";
                    this._operatorValue.push(ej.FilterOperators.equal);
                    break;
                case "!":
                    this._tokenType = "notEqual";
                    this._operatorValue.push(ej.FilterOperators.notEqual);
                    break;
                case ">=":
                    this._tokenType = "greaterThanOrEqual";
                    this._operatorValue.push(ej.FilterOperators.greaterThanOrEqual);
                    break;
                case ">":
                    this._tokenType = "greaterThan";
                    this._operatorValue.push(ej.FilterOperators.greaterThan);
                    break;
            }
        },

        _checkNumeric: function (value) {
            var ValidChars = "0123456789.<>=!";
            var isNumeric = true;
            if (this._currentFilterColumn.type && (this._currentFilterColumn.type.toLowerCase() == "datetime" || this._currentFilterColumn.type.toLowerCase() == "date"))
                ValidChars = "0123456789.AMP<>=!/: ";
            for (var i = 0; i < value.length; i++) {
                char = value.charAt(i);
                if (jQuery.inArray(char, ValidChars) == -1) {
                    isNumeric = false;
                }
            }
            return isNumeric;
        },

        _findFilterValue: function (_value) {
            if (_value != "") {
                if (this._currentFilterColumn.type && this._currentFilterColumn.type.toLowerCase() == "string")
                    this._getToken(_value);
                else if (this._currentFilterColumn.type && this._currentFilterColumn.type.toLowerCase() == "boolean" && _value.length == 1) {
                    var boolSkipInPut = "01";
                    if (jQuery.inArray(_value, boolSkipInPut) != -1) {
                        if (_value == "1")
                            this._filterValue = "True";
                        else if (_value == "0")
                            this._filterValue = "False";
                        this._operatorValue.push(ej.FilterOperators.equal);
                    }
                    else
                        this._skipFilterProcess = true;
                }
                else if (this._checkNumericDataType()) {
                    var hasNumeric = this._checkNumeric(_value);
                    if (hasNumeric)
                        this._getToken(_value);
                    else
                        this._skipFilterProcess = true;
                }
                else
                    this._skipFilterProcess = true;
            }
        },

        _getToken: function (filterStr) {
            if (filterStr == null || filterStr == undefined)
                this._filterValue = "";
            var firstBlock = filterStr.split('');
            this._getTokens(firstBlock, firstBlock[0]);
        },

        _getTokens: function (remainingChars, filterFirstChar) {
            if (this._isToken(filterFirstChar)) {
                this._findOperators(this._filterValue != "", filterFirstChar);

                if (this._tokenType == "lessThan" || this._tokenType == "greaterThan") {
                    if (remainingChars.length > 1) {
                        remainingChars.splice(0, 1);
                        var nextBlock = remainingChars;
                        var nextChar = nextBlock[0];
                        if (this._isToken(nextChar)) {
                            var tokenType = this._tokenType;
                            this._findOperators(false, nextChar);
                            if (this._tokenType == "equal") {
                                if (tokenType == "lessThan") {
                                    this._tokenType = "lessThanOrEqual";
                                    var operatorlength = this._operatorValue.length;
                                    for (var i = this._operatorValue.length; i > operatorlength - 2; i--)
                                        this._operatorValue.splice(i - 1, 1);
                                    this._operatorValue.push(ej.FilterOperators.lessThanOrEqual);
                                }
                                else if (tokenType == "greaterThan") {
                                    this._tokenType = "greaterThanOrEqual";
                                    var operatorlength = this._operatorValue.length;
                                    for (var i = this._operatorValue.length; i > operatorlength - 2; i--)
                                        this._operatorValue.splice(i - 1, 1);
                                    this._operatorValue.push(ej.FilterOperators.greaterThanOrEqual);
                                }
                            }
                            this._skipAndTokenizeBlock(nextBlock);
                        }
                        else {
                            this._getFilterValue(nextBlock, nextChar);
                        }
                    }

                }
                else {
                    if (remainingChars.length > 1) {
                        remainingChars.splice(0, 1);
                        var nextBlock = remainingChars;
                        var nextChar = nextBlock[0];
                        this._getFilterValue(nextBlock, nextChar);
                    }
                }
            }
            else {
                this._getFilterValue(remainingChars, filterFirstChar);
            }

        },

        _getFilterValue: function (nextBlock, nextChar) {
            this._filterValue += nextChar;
            this._skipAndTokenizeBlock(nextBlock);
        },
        _skipAndTokenizeBlock: function (remainingChars) {
            if (remainingChars.length > 1) {
                remainingChars.splice(0, 1);
                var nextBlock = remainingChars;
                var nextChar = nextBlock[0];
                this._getTokens(nextBlock, nextChar);
            }
        },

        _isToken: function (filterchar) {
            if (jQuery.inArray(filterchar, this._tokens) == -1)
                return false;
            else
                return true;
        },
    });

})(jQuery, Syncfusion);


(function ($, ej, undefined) {
    // ejmGridPager is the plugin name 
    // "ej.mobile.GridPager" is "namespace.className" will hold functions and properties

    ej.widget("ejmGridPager", "ej.mobile.GridPager", {
        _rootCSS: "e-m-grid-core",
        _init: function () {
            this._page = ej.getCurrentPage();
            this._findLastPageNo();
            this._pElement = this._page.find("#" + this.model.id + "_pager");
            this._pLast = this._pElement.find(".e-m-grid-last");
            this._pFirst = this._pElement.find(".e-m-grid-first");
            this._pPrev = this._pElement.find(".e-m-grid-prev");
            this._pNext = this._pElement.find(".e-m-grid-next");
            this._pTxt = this._pElement.find(".e-m-grid-ptxt");
        },
        /* ---------------------region event binding----------------------------------------------*/

        _wireEvents: function (remove) {
            var elements = this._pElement.find(".e-m-grid-inrpgr >div");
            ej.listenEvents([elements, elements], [ej.endEvent(), ej.startEvent()],
                [$.proxy(this._pageHandler, this), $.proxy(this._tStartHandler, this)], remove);
            if (this.model.type == ej.mobile.Grid.PagerType.Scrollable) {
                ej.listenEvents([this._pElement.find(".e-m-grid-ptxt")], [ej.endEvent()],
               [$.proxy(this._scrollPageHandler, this)], remove);
            }
        },

        /*----------------------- End Region event binding---------------------------------------------*/

        _findLastPageNo: function () {
            if (this.model.totalRecordsCount % this.model.pageSize > 0)
                this._lastPNo = parseInt(this.model.totalRecordsCount / this.model.pageSize) + 1;
            else
                this._lastPNo = parseInt(this.model.totalRecordsCount / this.model.pageSize);
        },

        _isPageBtn: function (target) {
            var canhlight = (target.hasClass("e-m-grid-next") || target.hasClass("e-m-grid-prev") || target.hasClass("e-m-grid-last") || target.hasClass("e-m-grid-first")) ? true : false;
            var isdisabled = (target.hasClass("e-m-grid-dnext") || target.hasClass("e-m-grid-dprev") || target.hasClass("e-m-grid-dlast") || target.hasClass("e-m-grid-dfirst")) ? true : false;
            return canhlight && !isdisabled;
        },

        _tStartHandler: function (e) {
            var target = $(e.target);
            var className = "";
            if (target.hasClass("e-m-grid-next") && !target.hasClass("e-m-grid-dnext"))
                className = "hnext";
            else if (target.hasClass("e-m-grid-prev") && !target.hasClass("e-m-grid-dprev"))
                className = "hprev";
            else if (target.hasClass("e-m-grid-last") && !target.hasClass("e-m-grid-dlast"))
                className = "hlast";
            else if (target.hasClass("e-m-grid-first") && !target.hasClass("e-m-grid-dfirst"))
                className = "hfirst";
            var element = this._pElement.find(".e-m-grid-" + className);
            if (element.length > 0)
                element.css("display", "block").addClass("e-m-state-active");
        },

        _pageHandler: function (e) {
            if (!this._tMove)
                this._sendPageRequest($(e.target));
        },

        _scrollPageHandler: function (e) {
            this._gridObj = !this._gridObj ? $("#" + this.model.id).ejmGrid("instance") : this._gridObj;
            if (!this._gridObj._touchMove) {
                if ($(e.target).hasClass("e-m-page-num")) {
                    var page = parseInt(this.model.currentPage);
                    this.model.currentPage = parseInt($(e.target).html());
                    if (page != this.model.currentPage) {
                        this._gridObj.currentPage(this.model.currentPage);
                        this._gridObj.refreshContent("paging");
                    }
                }
            }
        },

        _sendPageRequest: function (target) {
            var page = this.model.currentPage, className = "";
            if ((target.hasClass("e-m-grid-hnext") || target.hasClass("e-m-grid-next")) && !target.hasClass("e-m-grid-dnext")) {
                this.model.currentPage = this.model.currentPage + 1;
                className = "hnext";
            }
            else if ((target.hasClass("e-m-grid-hprev") || target.hasClass("e-m-grid-prev")) && !target.hasClass("e-m-grid-dprev")) {
                this.model.currentPage = this.model.currentPage - 1;
                className = "hprev";
            }
            else if ((target.hasClass("e-m-grid-hlast") || target.hasClass("e-m-grid-last"))) {
                this.model.currentPage = this._lastPNo;
                className = "hlast";
            }
            else if ((target.hasClass("e-m-grid-hfirst") || target.hasClass("e-m-grid-first"))) {
                this.model.currentPage = 1;
                className = "hfirst";
            }
            var element = this._pElement.find(".e-m-grid-" + className);
            if (element.length > 0)
                element.css("display", "none").removeClass("e-m-state-active");
            if (!this._gridObj)
                this._gridObj = $("#" + this.model.id).ejmGrid("instance");
            if (page != this.model.currentPage) {
                this._gridObj.currentPage(this.model.currentPage);
                this._gridObj.refreshContent("paging");
            }
            this._tMove = false;
        },

        _refreshPager: function () {
            if (this.model.type == ej.mobile.Grid.PagerType.Normal) {
                this._pLast.removeClass("e-m-grid-dlast");
                this._pNext.removeClass("e-m-grid-dnext");
                this._pFirst.removeClass("e-m-grid-dfirst");
                this._pPrev.removeClass("e-m-grid-dprev");
                if (this.model.currentPage == this._lastPNo) {
                    this._pLast.addClass("e-m-grid-dlast");
                    this._pNext.addClass("e-m-grid-dnext");
                }
                if (this.model.currentPage == 1) {
                    this._pFirst.addClass("e-m-grid-dfirst");
                    this._pPrev.addClass("e-m-grid-dprev");
                }
                this._pTxt.html(this.model.currentPage);
            }
            else if (this.model.type == ej.mobile.Grid.PagerType.Scrollable) {
                if (!this._gridObj)
                    this._gridObj = $("#" + this.model.id).ejmGrid("instance");
                this._gridObj._updateScrollPager();
            }
        },

    });

})(jQuery, Syncfusion);

(function ($, ej, undefined) {
    // ejmGridSelectionManager is the plugin name 
    // "ej.mobile.GridSelectionManager" is "namespace.className" will hold functions and properties

    ej.widget("ejmGridSelectionManager", "ej.mobile.GridSelectionManager", {
        _rootCSS: "e-m-grid-core",

        _init: function () {
            this._record = {};
        },

        _selectRow: function (index, target) {
            var targetRow = this.element.find(".e-m-grid-content tr")[index];
            this._cleanUp();
            this._selectedRowIndex = targetRow;
            if (targetRow) {
                this._setCurrentRecord(targetRow.rowIndex);
                this._gridObj.selectedRowIndex(index);
                var args = { rowIndex: targetRow.rowIndex, row: targetRow, cell: target, data: this._record };
                this._gridObj._trigger("rowSelecting", args);
                $(targetRow).find("td.e-m-grid-rowcell").addClass("e-m-state-active");
                this._gridObj._trigger("rowSelected", args);
            }
        },

        _setCurrentRecord: function (index) {
            if (!this._gridObj)
                this._gridObj = this.element.ejmGrid("instance");
            this._record = this._gridObj.model.currentViewData[index];
        },

        _getRow: function (target) {
            return $(target).parents('tr:first')[0];
        },

        _getRowCell: function (target) {
            if (target.tagName == 'TD' && $(target).hasClass('e-m-grid-rowcell')) {
                target = $(target);
            }
            else if ($(target).parents('td.e-m-grid-rowcell:first').length > 0) {
                target = $(target).parents('td.e-m-grid-rowcell:first');
            }
            else {
                target = $($(target).parents('tr:first')[0]).find('.e-m-grid-rowcell');
            }
            return target;
        },

        _getAllRowCells: function (target) {
            return $(target.parentNode).children('td:[class*=e-m-grid-rowcell]');
        },

        _deSelectRow: function () {
            if (this._selectedRowIndex != null) {
                this._setCurrentRecord(this._selectedRowIndex);
                var args = { row: this._selectedRowIndex, record: this._record };
                //single cell deselection 
                $(this._selectedCell).removeClass("e-m-grid-current-cell");
                //e-m-grid-rowcell deselection 
                $(this._selectedRowIndex).find("td.e-m-grid-rowcell").removeClass("e-m-state-active");
            }
        },

        _cleanUp: function () {
            if (this._selectedRowIndex)
                this._deSelectRow();
        },

        /*----------------------- End Region internal functions---------------------------------------------*/
        _selectHandler: function (e) {
            var target = this._getRowCell(e.target);
            var targetRow = this._getRow(e.target);
            var parent = this.element.find(".e-m-grid-content table:first")[0];
            // Used to select Only One Cell When MultiSelection Property is true
            if (target == null || target.length < 1 || !$(target).hasClass('e-m-grid-rowcell') || $(target).parents("table:first")[0] != parent) {
                return;
            }
            this._selectRow(targetRow.rowIndex, target[0]);
        },
        /* ---------------------EndRegion handlers----------------------------------------------*/

    });

    ej.mobile.Grid.PagerDisplay = {
        Normal: "normal",
        Fixed: "fixed"
    };

    ej.mobile.Grid.PagerType = {
        Normal: "normal",
        Scrollable: "scrollable"
    };
    ej.mobile.Grid.Actions = {
        Paging: "paging",
        Sorting: "sorting",
        Filtering: "filtering",
        Refresh: "refresh"
    };

    ej.mobile.Grid.FilterBarMode = {
        Immediate: "immediate",
        OnEnter: "onenter"
    };
    ej.mobile.Grid.Locale = ej.mobile.Grid.Locale || {};
    ej.mobile.Grid.Locale["default"] = ej.mobile.Grid.Locale["en-US"] = {
        emptyResult: "No records to display",
        filterValidation: "Enter valid filter data",
        filterTypeValidation: "Enter valid filter data. The current filter column is of type",
        captionText: "Items",
        spinnerText: "loading...",
        HideColumnAlert: "Atleast one column must be displayed in grid",
        columnSelectorText: "Hide Column",
        columnSelectorDone: "OK",
        columnSelectorCancel: "Cancel",
        columnSelectorWarning: "Warning",
        filterOk: "Ok",
        filterWarning: "Warning"
    }
})(jQuery, Syncfusion);