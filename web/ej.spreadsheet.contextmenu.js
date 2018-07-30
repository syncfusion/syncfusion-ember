(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.contextmenu = function (obj) {
        this.XLObj = obj;
        this._clrFltrEnable = false;
        this._isMenuOpened = false;
        this._uniqueClass = obj._id + "-cmenu";
        this._selColor = "";
        this._changedDataSource = false;
        this._modifyClick = false;
        this._oldCustomName = "";
        this._target = "";
        this._rowCellMenuDataMobile = [
            { id: "Cut", text: obj._getLocStr("Cut"), parentId: null, spriteCssClass: "e-icon e-ss-cut" },
			{ id: "Copy", text: obj._getLocStr("Copy"), parentId: null, spriteCssClass: "e-icon e-ss-copy" },
			{ id: "PasteSpecial", text: obj._getLocStr("Paste"), parentId: null, spriteCssClass: "e-icon e-ss-paste" },
            { id: "FormatCells", text: obj._getLocStr("FormatCells") + "...", parentId: null, spriteCssClass: "e-icon e-ss-formatcells" },
            { id: "BackgroundColor", text: obj._getLocStr("BackgroundColor"), parentId: null, spriteCssClass: "e-icon e-ss-backgroundcolor" },
            { id: "FontColor", text: obj._getLocStr("FontColor"), parentId: null, spriteCssClass: "e-icon e-ss-fontcolor" },
        ];
        this._headerMenuDataMobile = [
            { id: "Cut", text: obj._getLocStr("Cut"), parentId: null, spriteCssClass: "e-icon e-ss-cut" },
			{ id: "Copy", text: obj._getLocStr("Copy"), parentId: null, spriteCssClass: "e-icon e-ss-copy" },
			{ id: "PasteSpecial", text: obj._getLocStr("Paste"), parentId: null, spriteCssClass: "e-icon e-ss-paste" },
            { id: "Insert", text: obj._getLocStr("Insert"), parentId: null },
            { id: "Delete", text: obj._getLocStr("Delete"), parentId: null },
            { id: "Hide", text: obj._getLocStr("Hide"), parentId: null },
            { id: "Unhide", text: obj._getLocStr("Unhide"), parentId: null },
        ],

        this._rowCellMenuData = [
				{ id: "Cut", text: obj._getLocStr("Cut"), parentId: null, spriteCssClass: "e-icon e-ss-cut" },
				{ id: "Copy", text: obj._getLocStr("Copy"), parentId: null, spriteCssClass: "e-icon e-ss-copy" },
				{ id: "Paste", text: obj._getLocStr("Paste"), parentId: null, spriteCssClass: "e-icon e-ss-paste" },
                { id: "PasteSpecial", text: obj._getLocStr("PasteSpecial"), parentId: "Paste" },
                { id: "PasteValues", text: obj._getLocStr("PasteValues"), parentId: "Paste" },
                { id: "Insert", text: obj._getLocStr("Insert") + "...", parentId: null },
                { id: "Delete", text: obj._getLocStr("Delete") + "...", parentId: null },
				{ id: "Filter", text: obj._getLocStr("Filter"), parentId: null, spriteCssClass: "e-icon e-ss-filter" },
                { id: "ClearFilter", parentId: "Filter", text: obj._getLocStr("ClearFilter"), spriteCssClass: "e-icon e-ss-filternone" },
				{ id: "FilterSelected", parentId: "Filter", text: obj._getLocStr("FilterSelected"), spriteCssClass: "e-icon e-ss-filter" },
				{ id: "Sort", text: obj._getLocStr("Sort"), parentId: null, spriteCssClass: "e-icon e-ss-sortatoz" },
                { id: "SortAtoZ", parentId: "Sort", text: obj._getLocStr("SortAtoZ"), spriteCssClass: "e-icon e-ss-sortatoz" },
				{ id: "SortZtoA", parentId: "Sort", text: obj._getLocStr("SortZtoA"), spriteCssClass: "e-icon e-ss-sortztoa" },
                { id: "PutCellColor", parentId: "Sort", text: obj._getLocStr("PutCellColor"), spriteCssClass: "" },
				{ id: "PutFontColor", parentId: "Sort", text: obj._getLocStr("PutFontColor"), spriteCssClass: "" },
				{ id: "ctxComment", parentId: null, text: obj._getLocStr("Comment") },
                { id: "ctxInsrtCmnt", text: obj._getLocStr("InsertComment"), parentId: "ctxComment", spriteCssClass: "e-icon e-ss-newcmnt" },
                { id: "ctxEditCmnt", text: obj._getLocStr("EditComment"), parentId: "ctxComment", spriteCssClass: "e-icon e-ss-editcmnt" },
                { id: "ctxDeleteCmnt", text: obj._getLocStr("DeleteComment"), parentId: "ctxComment", spriteCssClass: "e-icon e-ss-deletecmnt" },
                { id: "ctxShwHdCmnt", text: obj._getLocStr("ShowHide"), parentId: "ctxComment", spriteCssClass: "e-icon" },
                { id: "FormatCells", text: obj._getLocStr("FormatCells") + "...", parentId: null, spriteCssClass: "e-icon e-ss-formatcells" },
                { id: "CmHyperLink", text: obj._getLocStr("HyperLink"), parentId: null, spriteCssClass: "e-icon e-ss-hyperlink" },
                { id: "HyperLink", text: obj._getLocStr("HyperLink") + "...", parentId: "CmHyperLink", spriteCssClass: "e-icon e-ss-hyperlink" },
                { id: "EditLink", text: obj._getLocStr("EditLink") + "...", parentId: "CmHyperLink" },
                { id: "OpenLink", text: obj._getLocStr("OpenLink"), parentId: "CmHyperLink" },
                { id: "RemoveLink", text: obj._getLocStr("RemoveLink"), parentId: "CmHyperLink", spriteCssClass: "e-icon e-ss-removelink" },
                { id: "ClearContents", text: obj._getLocStr("ClearContents"), parentId: null, spriteCssClass: "e-icon e-ss-clear" }
        ];
		
        this._rowHeaderMenuData = this._columnHeaderMenuData = [
				{ id: "Cut", text: obj._getLocStr("Cut"), parentId: null, spriteCssClass: "e-icon e-ss-cut" },
				{ id: "Copy", text: obj._getLocStr("Copy"), parentId: null, spriteCssClass: "e-icon e-ss-copy" },
				{ id: "Paste", text: obj._getLocStr("Paste"), parentId: null, spriteCssClass: "e-icon e-ss-paste" },
                { id: "PasteSpecial", text: obj._getLocStr("PasteSpecial"), parentId: "Paste" },
                { id: "PasteValues", text: obj._getLocStr("PasteValues"), parentId: "Paste" },
                { id: "Insert", text: obj._getLocStr("Insert"), parentId: null },
                { id: "Delete", text: obj._getLocStr("Delete"), parentId: null },
                { id: "ClearContents", text: obj._getLocStr("ClearContents"), parentId: null, spriteCssClass: "e-icon e-ss-clear" },
                { id: "Hide", text: obj._getLocStr("Hide"), parentId: null },
                { id: "Unhide", text: obj._getLocStr("Unhide"), parentId: null }
        ];

        this._footerMenuData = [
            { id: "InsertSheet", text: obj._getLocStr("InsertSheet"), parentId: null },
            { id: "DeleteSheet", text: obj._getLocStr("DeleteSheet"), parentId: null, spriteCssClass: "e-icon e-ss-delete" },
            { id: "RenameSheet", text: obj._getLocStr("RenameSheet"), parentId: null, spriteCssClass: "e-icon " },
            { id: "MoveorCopy", text: obj._getLocStr("MoveorCopy") + "...", parentId: null, spriteCssClass: "e-icon " },
            { id: "HideSheet", text: obj._getLocStr("HideSheet"), parentId: null, spriteCssClass: "e-icon " },
            { id: "UnhideSheet", text: obj._getLocStr("UnhideSheet"), parentId: null, spriteCssClass: "e-icon " },
            { id: "ProtectSheet", text: obj._getLocStr("Protectsheet"), parentId: null, spriteCssClass: "e-icon e-ss-cmenuprotect" }
        ];
        this._chartMenuData = [
            { id: "Cut", text: obj._getLocStr("Cut"), parentId: null, spriteCssClass: "e-icon e-ss-cut" },
            { id: "Copy", text: obj._getLocStr("Copy"), parentId: null, spriteCssClass: "e-icon e-ss-copy" },
            { id: "ChartType", text: obj._getLocStr("ChangeChartType") + "...", parentId: null },
            { id: "SelectData", text: obj._getLocStr("SelectData") + "...", parentId: null }
        ];
        this._imgMenuData = [
            { id: "Cut", text: obj._getLocStr("Cut"), parentId: null, spriteCssClass: "e-icon e-ss-cut" },
            { id: "Copy", text: obj._getLocStr("Copy"), parentId: null, spriteCssClass: "e-icon e-ss-copy" },
            { id: "ChangePicture", text: obj._getLocStr("ChangePicture"), parentId: null }
        ];
        this._pivotMenuData = [
           { id: "Refresh", text: obj._getLocStr("Refresh"), parentId: null, spriteCssClass: "e-icon e-ss-pivotrefresh" }        
        ];
        this._cellStylesMenuData = [
           { id: "Modify", text: obj._getLocStr("Modify"), parentId: null },
           { id: "DeleteStyle", text: obj._getLocStr("Delete"), parentId: null },
           { id: "Apply", text: obj._getLocStr("Apply"), parentId: null }
        ];
        this._protectRowMenuIds = ["Insert", "Delete", "Filter", "ctxComment", "Sort", "LockCells", "CmHyperLink", "FormatCells", "ClearContents"];
        this._prtctHeaderIds = ["Insert", "Delete", "Hide", "Unhide", "ClearContents"];
        this._footerIds = ["InsertSheet", "DeleteSheet", "RenameSheet", "MoveorCopy", "HideSheet", "UnhideSheet"];
    };

    ej.Menu.prototype._calculateContextMenuPosition = function (e) {
        var menuId = this.element.get(0).id, spreadId = this.element.data("id"), xlObj = $("#" + spreadId).data('ejSpreadsheet'), locationX, locationY, totHeight;
        this.element.css({ "top": "", "left": "" });
        locationX = (e.clientX + this.element.width() < $(window).width()) ? e.pageX : e.pageX - this.element.width();
        totHeight = (xlObj && menuId.indexOf(spreadId + '_contextMenuFooter') > -1) ? xlObj.element.height() : $(window).height();
        locationY = (e.clientY + this.element.height() < totHeight) ? e.pageY : (e.clientY > this.element.height()) ? e.pageY - this.element.height() : totHeight - this.element.outerHeight();
        var bodyPos = $("body").css("position") != "static" ? $("body").offset() : { left: 0, top: 0 };
        locationX -= bodyPos.left, locationY -= bodyPos.top;
        return {
            X: locationX,
            Y: locationY
        };
    };

    ej.spreadsheetFeatures.contextmenu.prototype = {
        //Contextmenu
        _initContextMenu: function () {
            var createMenu = ej.buildTag("ul .e-spreadsheet e-" + this._uniqueClass, " ", { display: "none", width: "auto" }, { id: this.XLObj._id + "_contextMenuCell" });
            this._createMenu(createMenu, (this.XLObj._phoneMode || this.XLObj._tabMode) ? this._rowCellMenuDataMobile : this._rowCellMenuData, "#" + this.XLObj._id + " .e-spreadsheetcontentcontainer");
            createMenu = ej.buildTag("ul .e-spreadsheet e-" + this._uniqueClass, " ", { display: "none" }, { id: this.XLObj._id + "_contextMenuColumnHeader" });
            this._createMenu(createMenu, this._columnHeaderMenuData, "#" + this.XLObj._id + " .e-spreadsheetheader .e-headercontent");
            createMenu = ej.buildTag("ul .e-spreadsheet e-" + this._uniqueClass, " ", { display: "none" }, { id: this.XLObj._id + "_contextMenuRowHeader" });
            this._createMenu(createMenu, this._rowHeaderMenuData, "#" + this.XLObj._id + " .e-rowheadercontent");
            if(this.XLObj.getObjectLength(this.XLObj._dataContainer.customCellStyle) >=1)
                this._createMenu(ej.buildTag("ul .e-spreadsheet e-" + this._uniqueClass, " ", { display: "none" }, { id: this.XLObj._id + "_contextMenuCellStyles" }), this._cellStylesMenuData, "  .e-cellstylecontent");
        },

        _initCMenuFooter: function () {
            var createMenu = ej.buildTag("ul .e-spreadsheet e-" + this._uniqueClass, " ", { display: "none" }, { id: this.XLObj._id + "_contextMenuFooter" });
            createMenu.data("id", this.XLObj._id);
            this._createMenu(createMenu, this._footerMenuData, "#" + this.XLObj._id + " .e-pagercontainer");
        },

        _createMenu: function (createMenu, data, target) {
            createMenu.ejMenu(
            {
                fields: { dataSource: data, id: "id", parentId: "parentId", text: "text", spriteCssClass: "spriteCssClass" },
                menuType: ej.MenuType.ContextMenu,
                openOnClick: false,
                beforeOpen: $.proxy(this._beforeOpen, this),
                close: $.proxy(this._menuClose, this),
                click: $.proxy(this._menuClick, this),
                contextMenuTarget: target
            });
        },
        
        hideCMenu: function () {
            var xlObj = this.XLObj;
            if (!xlObj.model.enableContextMenu)
                return;
            $("#" + xlObj._id + "_contextMenuCell").data("ejMenu").element.hide();
            $("#" + xlObj._id + "_contextMenuColumnHeader").data("ejMenu").element.hide();
            $("#" + xlObj._id + "_contextMenuRowHeader").data("ejMenu").element.hide();
            $("#" + xlObj._id + "_contextMenuFooter").data("ejMenu").element.hide();
        },
		
		_getCMenuObj: function(target){
			var xlObj = this.XLObj;
			switch(target){
				case ej.Spreadsheet.ContextMenu.Cell:
					return $("#" + xlObj._id + "_contextMenuCell").data("ejMenu");
				case ej.Spreadsheet.ContextMenu.RowHeader:
					return $("#" + xlObj._id + "_contextMenuRowHeader").data("ejMenu");
				case ej.Spreadsheet.ContextMenu.ColumnHeader:
					return $("#" + xlObj._id + "_contextMenuColumnHeader").data("ejMenu");
				case ej.Spreadsheet.ContextMenu.Footer:
					return $("#" + xlObj._id + "_contextMenuFooter").data("ejMenu");
			}
		},
		
		addItem: function(target, itemColl, operation, itemIdx){
			if(!target || this.XLObj.model.isReadOnly)
				return;
		    var menuObj = this._getCMenuObj(target), isChangedDtSrc = false, dataSource, len, i, spliceIdx;
		    dataSource = $.extend(true, [], menuObj.model.fields.dataSource);
		    switch (operation) {
		        case "insert":
		            $.merge(dataSource, itemColl);
		            isChangedDtSrc = true;
		            break;
		        case "insertbefore":
		            len = itemColl.length, spliceIdx = (itemIdx - 1) || 0;
		            while (len > 0) {
		                dataSource.splice(spliceIdx, 0, itemColl[len - 1]);
		                len--;
		            }
		            isChangedDtSrc = true;
		            break;
		        case "insertafter":
		            len = itemColl.length, i = 0, spliceIdx = itemIdx || dataSource.length;
		            while (i < len) {
		                dataSource.splice(spliceIdx, 0, itemColl[i]);
		                i++;
		                spliceIdx++;
		            }
		            isChangedDtSrc = true;
		            break;
		    }

		    if (isChangedDtSrc)
		        this.changeDataSource(target, dataSource);
		},
		
		removeItem: function(target, idxColl){
		    if (!target || this.XLObj.model.isReadOnly)
				return;
		    var menuObj = this._getCMenuObj(target), itemColl = [], i, dataSource, newDataSource = [];
		    dataSource = $.extend(true, [], menuObj.model.fields.dataSource);
		    for (i = 0, length = dataSource.length; i < length; i++) {
		        if (idxColl.indexOf(i + 1) == -1)
		            newDataSource.push(dataSource[i]);
		    }
		    this.changeDataSource(target, newDataSource);
		},
		
		enableItem: function(target, idxColl){
		    if (!target || this.XLObj.model.isReadOnly)
				return;
			var menuObj = this._getCMenuObj(target), i;
			if(idxColl && idxColl.length > 0)
				for(i = 0, length = idxColl.length; i < length; i++)
					menuObj.enableItemByID(menuObj.element.find('li:eq(' + (idxColl[i] - 1) + ')')[0].id);
			else
				menuObj.enable();
		},
		
		disableItem: function(target, idxColl){
		    if (!target || this.XLObj.model.isReadOnly)
				return;
			var menuObj = this._getCMenuObj(target), i;
			if(idxColl && idxColl.length > 0)
				for(i = 0, length = idxColl.length; i < length; i++)
					menuObj.disableItemByID(menuObj.element.find('li:eq(' + (idxColl[i] - 1) + ')')[0].id);
			else
				menuObj.disable();
		},

		hideItem: function (cMenuType, idxColl) {
		    this._showHideItem(cMenuType, idxColl, "hide");
		},
		
		showItem: function (cMenuType, idxColl) {
		    this._showHideItem(cMenuType, idxColl, "show");
		},

		_showHideItem: function(cMenuType, idxColl, option){
		    if (!cMenuType || this.XLObj.model.isReadOnly)
		        return;
		    var menuObj = this._getCMenuObj(cMenuType), i, elemId, len;
		    if (idxColl && idxColl.length > 0)
		        for (i = 0, len = idxColl.length; i < len; i++) {
		            elemId = menuObj.element.find('li:eq(' + (idxColl[i] - 1) + ')')[0].id;
                    if(option =="hide")
                        menuObj.hideItems(["#" + elemId]);
                    else
                        menuObj.showItems(["#" + elemId]);
		        }
		},

		changeDataSource: function(target, data){
		    if (!target || this.XLObj.model.isReadOnly)
				return;
			if(data){
				var menuObj = this._getCMenuObj(target);
				this._changedDataSource = true;
				switch(target){
					case ej.Spreadsheet.ContextMenu.Cell:
						this._rowCellMenuDataMobile = this._rowCellMenuData = data;
						break;
					case ej.Spreadsheet.ContextMenu.RowHeader:
						this._headerMenuDataMobile = this._rowHeaderMenuData = data;
						break;
					case ej.Spreadsheet.ContextMenu.ColumnHeader:
						this._headerMenuDataMobile = this._columnHeaderMenuData = data;
						break;
					case ej.Spreadsheet.ContextMenu.Footer:
						this._footerMenuData = data;
						break;
				}
				menuObj && menuObj.option("fields", { dataSource: data });
			}
		},

        _updateContextMenuItems: function($trgt){
			var xlObj = this.XLObj, fltrIcon, dataSource;
			var colMenuObj = $("#" + xlObj._id + "_contextMenuColumnHeader").data("ejMenu"), rowMenuObj = $("#" + xlObj._id + "_contextMenuRowHeader").data("ejMenu"), text, Locked, trgt = $trgt[0], sheetIdx = xlObj.getActiveSheetIndex(), actSheet = xlObj.getSheet(sheetIdx), actCell = (!ej.isNullOrUndefined(xlObj.getActiveCellElem()) && xlObj.getActiveCellElem().length > 0) ? xlObj.getActiveCellElem() : $trgt, menuData = (xlObj._phoneMode || xlObj._tabMode) ? this._rowCellMenuDataMobile : this._rowCellMenuData, menuObj = $("#" + xlObj._id + "_contextMenuCell").data("ejMenu"), footMenuObj = $("#" + xlObj._id + "_contextMenuFooter").data("ejMenu"), actElem = xlObj.getActiveCell(sheetIdx), tabIdx, tabRange;
            if ($trgt.hasClass("e-rowcell") || $trgt.hasClass("e-hyperlinks")) {
                var insrtDt, sortData = [], colHdr = xlObj._getJSSheetHeader(sheetIdx).find('th'), rowHdr = xlObj._getJSSheetRowHeader(sheetIdx).find('td');
                var value = xlObj.XLEdit.getPropertyValue(actSheet._activeCell.rowIndex, actSheet._activeCell.colIndex), cellIndex = xlObj._getCellIdx(!xlObj._hasClass($trgt, "e-hyperlinks") ? trgt : $trgt.parents("td")[0]);
                this._isMenuOpened = true;
                if (xlObj.model.allowLockCell && actSheet.isSheetProtected && xlObj.XLEdit.getPropertyValue(cellIndex.rowIndex, cellIndex.colIndex, "isLocked", sheetIdx))
                    this._disableMenuOpt(this._protectRowMenuIds);
                else {
                    if ($trgt.hasClass("e-hyperlinks")) {
                        $trgt = $trgt.parents("td");
                        trgt = $trgt[0];
                    }
                    if (xlObj.model.allowHyperlink) {
                        this._enableMenuOpt(["CmHyperLink"]);
                        var data = xlObj.XLEdit.getPropertyValue(cellIndex.rowIndex, cellIndex.colIndex, "hyperlink", sheetIdx), hlItem = ["EditLink", "OpenLink", "RemoveLink"];
                        if (ej.isNullOrUndefined(data)) {
                            this._disableMenuOpt(hlItem);
                            this._enableMenuOpt(["HyperLink"]);
                        }
                        else {
                            this._enableMenuOpt(hlItem);
                            this._disableMenuOpt(["HyperLink"]);
                        }
                    }
                    else
                        this._disableMenuOpt(["CmHyperLink"]);
                    if (!xlObj.model.allowFiltering)
                        menuObj.disableItemByID("Filter");
                    else {
                        menuObj.enableItemByID("Filter");
                        tabRange = xlObj.model.sheets[sheetIdx].filterSettings.tableRange;
                        var isTable = xlObj.XLEdit.getPropertyValue(actElem.rowIndex, actElem.colIndex, "tableName"), tableId = (!ej.isNullOrUndefined(isTable)) ? parseInt(isTable.replace("e-table","")) : -1;
                        if (tabRange.length > 0) {
                            for (var i = 0, n = tabRange.length; i < n; i++) {
								if(tabRange[i].tableID === tableId) {
                                    tabIdx = i;
                                    break;
                                }
							}
                            if (!ej.isNullOrUndefined(tabIdx) && actElem.rowIndex < tabRange[tabIdx].selectedRange.endRow + 1 && actElem.rowIndex > tabRange[tabIdx].selectedRange.startRow - 2)
                                if (actElem.colIndex < tabRange[tabIdx].multifilterIdx[tabRange[tabIdx].multifilterIdx.length - 1] + 1 && actElem.colIndex > tabRange[tabIdx].multifilterIdx[0] - 1) {
									fltrIcon = xlObj.getCell(tabRange[tabIdx].selectedRange.startRow - 1, actElem.colIndex, sheetIdx).find("span");
									if (fltrIcon.length && fltrIcon[0].className.indexOf("e-ssfiltered") > -1) {
										menuObj.enableItemByID("ClearFilter");
										this._clrFltrEnable = true;
									}
                                }
                        }
                        if (!this._clrFltrEnable)
                            menuObj.disableItemByID("ClearFilter");
                    }
                    if (xlObj.model.allowInsert)
                       menuObj.enableItemByID("Insert");
                    else 
                       menuObj.disableItemByID("Insert");
                    if (xlObj.model.allowDelete)
                       menuObj.enableItemByID("Delete");
                    else
                        menuObj.disableItemByID("Delete");
                    if ((xlObj.XLClipboard._copyBackup.cells || xlObj.XLClipboard._copyBackup.elem) && !xlObj.model.isReadOnly){
                        this._enableMenuOpt(["Paste"]);
                        if (xlObj.isPasteValuesOnly)
                            menuObj.disableItemByID("PasteSpecial");
                    }
                    else
                        this._disableMenuOpt(["Paste"]);
                    if (xlObj.model.allowSorting)
                        this._enableMenuOpt(["Sort"]);
                    else
                        this._disableMenuOpt(["Sort"]);
					if (xlObj.model.allowClear)
                        this._enableMenuOpt(["ClearContents"]);
                    else
                        this._disableMenuOpt(["ClearContents"]);
                    if (xlObj.model.allowCellFormatting) 
                        this._enableMenuOpt(["FormatCells"]);
                    else
                        this._disableMenuOpt(["FormatCells"]);
                    if (!xlObj._phoneMode && !xlObj._tabMode) {
                        sortData = !ej.isNullOrUndefined(value) && $.isNumeric(value) ? [xlObj._getLocStr("SortSmallesttoLargest"), xlObj._getLocStr("SortLargesttoSmallest")] : (!ej.isNullOrUndefined(ej.parseDate(value)) ? [xlObj._getLocStr("SortOldesttoNewest"), xlObj._getLocStr("SortNewesttoOldest")] : [xlObj._getLocStr("SortAtoZ"), xlObj._getLocStr("SortZtoA")]);
                        //Comments
                        if (xlObj.model.allowComments) {
                            if (menuObj.element.find("#ctxComment").hasClass("e-disable-item"))
                                this._enableMenuOpt(["ctxComment"]);
                            var selectedCells = xlObj.getSheetElement(xlObj.getActiveSheetIndex()).find(".e-selected"), trgtCell = selectedCells.length > 1 ? actCell : $trgt;
                            if (trgtCell.hasClass("e-commentcell")) {
                                this._disableMenuOpt(["ctxInsrtCmnt"]);
                                if (xlObj.XLEdit.getPropertyValueByElem(trgtCell, "comment").isVisible) {
                                    insrtDt = $.extend(menuData[19], { text: xlObj._getLocStr("HideComment") });
                                    menuObj.remove(["#" + menuData[19].id]);
                                    menuObj.insert([insrtDt], "#" + menuData[15].id);
                                }
                                else {
                                    insrtDt = $.extend(menuData[19], { text: xlObj._getLocStr("ShowHide") });
                                    menuObj.remove(["#" + menuData[19].id]);
                                    menuObj.insert([insrtDt], "#" + menuData[15].id);
                                }
                                this._enableMenuOpt(["ctxEditCmnt", "ctxDeleteCmnt", "ctxShwHdCmnt"]);
                            }
                            else {
                                this._enableMenuOpt(["ctxInsrtCmnt"]);
                                this._disableMenuOpt(["ctxEditCmnt", "ctxDeleteCmnt", "ctxShwHdCmnt"]);
                            }
                            if (selectedCells.filter(trgt).length > 0 && selectedCells.filter(".e-commentcell").length > 0)
                                this._enableMenuOpt(["ctxDeleteCmnt"]);
                        }
                        else
                            this._disableMenuOpt(["ctxComment"]);
                        if (menuData[11].text !== sortData[0]) {
                            insrtDt = $.extend(menuData[11], { text: sortData[0], spriteCssClass: menuData[11].sprite });
                            menuObj.remove(["#" + menuData[11].id]);
                            menuObj.insertBefore([insrtDt], "#" + menuData[13].id);
                        }
                        if (menuData[12].text !== sortData[1]) {
                            insrtDt = $.extend(menuData[12], { text: sortData[1], spriteCssClass: menuData[12].sprite });
                            menuObj.remove(["#" + menuData[12].id]);
                            menuObj.insertBefore([insrtDt], "#" + menuData[13].id);
                        }
                    }
                    
                    if (xlObj.model.showRibbon)
                        xlObj.XLRibbon._dirtySelect(xlObj._getContent(xlObj.getActiveSheetIndex()).find(".e-selected"));
                }
                if (xlObj.model.allowInsert)
                    footMenuObj.enableItemByID("InsertSheet");
                else
                    footMenuObj.disableItemByID("InsertSheet");
                if (xlObj.model.allowDelete)
                    footMenuObj.enableItemByID("DeleteSheet");
                else
                    footMenuObj.disableItemByID("DeleteSheet");
                if (xlObj.model.allowClipboard)
                    this._enableMenuOpt(["Cut", "Copy"]);
                else
                    this._disableMenuOpt(["Cut", "Copy"]);
                if ((xlObj.XLClipboard._copyBackup.cells || xlObj.XLClipboard._copyBackup.elem) && !xlObj.model.isReadOnly)
                    this._enableMenuOpt(["Paste"], cmenuId);
                else
                    this._disableMenuOpt(["Paste"], cmenuId);
            }
            else if ($trgt.hasClass("e-link")) {
                dataSource = footMenuObj.model.fields.dataSource.slice(0);
                if (xlObj._isSheetRename && !xlObj._updateSheetNames()) {
                    args.cancel = true;
                    return;
                }
                if (xlObj.model.allowLockCell && actSheet.isSheetProtected)
                    text = xlObj._getLocStr("Unprotect");
                else
                    text = xlObj._getLocStr("Protectsheet");
                dataSource[6].text = text;                 
                footMenuObj.option("fields", { id: "id", dataSource: dataSource, parentId: "parentId" });
                this._isMenuOpened = true;
                if (xlObj._isCommentEdit)
                    xlObj.XLComment._updateCurCmntVal();
                if ($trgt.not("a.e-currentitem, a.e-PP, a.e-NP").hasClass("e-numericitem"))
                    xlObj.gotoPage($trgt.data("index"));
                if (!xlObj.model.exportSettings.password) {
                    if (xlObj._getSheetNames(false).length > 0)
                        footMenuObj.enableItemByID("UnhideSheet");
                    else
                        footMenuObj.disableItemByID("UnhideSheet");
                    if (xlObj._getSheetNames(true).length > 1) {
                        footMenuObj.enableItemByID("DeleteSheet");
                        footMenuObj.enableItemByID("HideSheet");
                        footMenuObj.enableItemByID("MoveorCopy");
                    }
                    else {
                        footMenuObj.disableItemByID("DeleteSheet");
                        footMenuObj.disableItemByID("HideSheet");
                        footMenuObj.disableItemByID("MoveorCopy");
                    }
                }
                else 
                    this._disableMenuOpt(this._footerIds, "contextMenuFooter");
                if (xlObj.model.allowLockCell)
                    footMenuObj.enableItemByID("ProtectSheet");
                else
                    footMenuObj.disableItemByID("ProtectSheet");
            }
            else if ($trgt.hasClass("e-headercelldiv") || $trgt.hasClass("e-headercell") || $trgt.hasClass("e-rowheader")) {
                var cmenuId = $trgt.hasClass("e-rowheader") ? "contextMenuRowHeader" : "contextMenuColumnHeader";
                
                if (xlObj.model.allowClipboard)
                    this._enableMenuOpt(["Cut", "Copy"], cmenuId);
                else
                    this._disableMenuOpt(["Cut", "Copy"], cmenuId);
                if ((xlObj.XLClipboard._copyBackup.cells || xlObj.XLClipboard._copyBackup.elem) && !xlObj.model.isReadOnly)
                    this._enableMenuOpt(["Paste"], cmenuId);
                else
                    this._disableMenuOpt(["Paste"], cmenuId);
				if (xlObj.model.allowLockCell && actSheet.isSheetProtected)
                    this._disableMenuOpt(this._prtctHeaderIds, cmenuId);
                else {
					if (xlObj.model.allowClear)
						this._enableMenuOpt(["ClearContents"], cmenuId);
					else
						this._disableMenuOpt(["ClearContents"], cmenuId);
					if (xlObj.model.allowInsert)
						this._enableMenuOpt(["Insert"], cmenuId);
					else
						this._disableMenuOpt(["Insert"], cmenuId);
					if (xlObj.model.allowDelete)
						this._enableMenuOpt(["Delete"], cmenuId);
					else
						this._disableMenuOpt(["Delete"], cmenuId);
					this._enableMenuOpt(["Hide", "Unhide"], cmenuId);
				 }
                if(xlObj.model.showRibbon)
					xlObj.XLRibbon._dirtySelect(xlObj._getContent(xlObj.getActiveSheetIndex()).find(".e-selected"));
           }
           if (xlObj.model.allowInsert && ej.isNullOrUndefined(xlObj.model.exportSettings.password))
               this._enableMenuOpt(["InsertSheet", "MoveorCopy"], "contextMenuFooter");
           else
               this._disableMenuOpt(["InsertSheet", "MoveorCopy"], "contextMenuFooter");
		   xlObj.model.exportSettings.password ? this._disableMenuOpt(["RenameSheet"]) : this._enableMenuOpt(["RenameSheet"])
           if (xlObj.model.allowDelete && xlObj._getSheetNames(true).length > 1)
               this._enableMenuOpt(["DeleteSheet"], "contextMenuFooter");
           else
               this._disableMenuOpt(["DeleteSheet"], "contextMenuFooter");
           if (xlObj.model.allowEditing)
               this._enableMenuOpt(["RenameSheet"], "contextMenuFooter");
           else
               this._disableMenuOpt(["RenameSheet"], "contextMenuFooter");
			if (xlObj.model.isReadOnly) {
               this._disableMenuOpt(["Cut", "Insert", "Delete", "ClearContents"], "contextMenuColumnHeader");
               this._disableMenuOpt(["Cut", "Insert", "Delete", "ClearContents"], "contextMenuRowHeader");
               this._disableMenuOpt(["Cut", "Insert", "Delete", "Filter", "Sort", "ctxComment", "FormatCells", "CmHyperLink", "ClearContents"], "contextMenuCell");
			}
		},

        _beforeOpen: function (args) {
            var xlObj = this.XLObj, xlResize = xlObj.XLResize;
            if (!xlObj.model.enableContextMenu || (args.events.type == "mousedown" && args.target.id.indexOf("_picture") > -1)) {
                args.cancel = true;
                return false;
            }
			if ($(args.target).hasClass("e-numericitem") && xlObj.model.isReadOnly) {
                args.cancel = true;
                return false;
			}
			if ($(args.target).hasClass("e-cellstylecell")) {
			    if (!$(args.target).hasClass("e-customcellstyle")) {
			        args.cancel = true;
			        return false;
			    }
			    this._target = args.target.innerText;
			}
			if ($(args.target).hasClass("e-cellstylecontent")) {
			        args.cancel = true;
			        return false;
			}
            this._clrFltrEnable = false;
            this.hideCMenu();
            var colMenuObj = $("#" + xlObj._id + "_contextMenuColumnHeader").data("ejMenu"), rowMenuObj = $("#" + xlObj._id + "_contextMenuRowHeader").data("ejMenu"), trgt = args.target, text, Locked, evnt = { target: trgt }, $trgt = $(trgt), sheetIdx = xlObj.getActiveSheetIndex(), actSheet = xlObj.getSheet(sheetIdx), actCell = (!ej.isNullOrUndefined(xlObj.getActiveCellElem()) && xlObj.getActiveCellElem().length > 0) ? xlObj.getActiveCellElem() : $trgt,
                menuData = (xlObj._phoneMode || xlObj._tabMode) ? this._rowCellMenuDataMobile : this._rowCellMenuData, menuObj = $("#" + xlObj._id + "_contextMenuCell").data("ejMenu"), footMenuObj = $("#" + xlObj._id + "_contextMenuFooter").data("ejMenu"), actElem = xlObj.getActiveCell(sheetIdx), tabId, tabIdx, tabRange, customMenuObj = $("#" + xlObj._id + "_contextMenuCellStyles").data("ejMenu");
            if (xlObj._trigger("beforeOpen", evnt))
                return;
            if (xlObj.XLEdit._isEdit || (xlObj.model.allowComments && xlObj.XLComment._isCommentEdit) || $trgt.hasClass("e-filterspan") || (args.events.which === 1 && $trgt.hasClass("e-hyperlinks")) || $trgt.parents("div").hasClass("e-vscroll") || $trgt.parents("div").hasClass("e-hscroll") || ($(trgt.parentNode).hasClass("e-pagercontainer") && !$trgt.hasClass("e-link")) || (!ej.isNullOrUndefined(xlObj.XLResize) && xlObj.XLResize._resizeStart) || args.target.id.indexOf("Sheet_RenamePanel") > -1 || $trgt.parents().hasClass("e-grid") || $trgt.hasClass("e-autofill"))
                args.cancel = true;
            if (xlResize && xlResize._preventColResize($trgt.parent()[0].cellIndex, true) && $trgt.hasClass('e-headercelldiv'))
                args.cancel = true;
            if (xlResize && xlResize._preventRowResize(parseInt($trgt.parent().attr('idx')), true) && $trgt.hasClass('e-rowheader'))
                args.cancel = true;
            if ($trgt.hasClass("e-rowcell") || $trgt.hasClass("e-hyperlinks")) {
				var colHdr = xlObj._getJSSheetHeader(sheetIdx).find('th'), rowHdr = xlObj._getJSSheetRowHeader(sheetIdx).find('td');
				if (!ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValueByElem(xlObj.getCell(actSheet._activeCell.rowIndex, actSheet._activeCell.colIndex), "range"))) {
				    var rangeInfo = xlObj.model.sheets[sheetIdx].rangeSettings[xlObj.XLEdit.getPropertyValueByElem(xlObj.getCell(actSheet._activeCell.rowIndex, actSheet._activeCell.colIndex), "range")];
                    menuObj.option("fields", { dataSource: rangeInfo.contextMenuSettings.dataSource, id: "id", parentId: "parentId", text: "text", spriteCssClass: "spriteCssClass" });
                    menuObj.option("width", rangeInfo.contextMenuSettings.width);
                    menuObj.option("height", rangeInfo.contextMenuSettings.height);
                }
				else if ($(colHdr[$trgt.index()]).hasClass('e-colselected') || $(rowHdr[$trgt.parent().index()]).hasClass("e-rowselected")) {
                    menuData = $(colHdr[$trgt.index()]).hasClass('e-colselected') ? this._columnHeaderMenuData : this._rowHeaderMenuData;
                    if (JSON.stringify(menuData) !== JSON.stringify(args.model.fields.dataSource) && this._changedDataSource)
                       menuObj.option("fields", { dataSource: menuData, id: "id", parentId: "parentId", text: "text", spriteCssClass: "spriteCssClass" });
                }
                else {
                    if (JSON.stringify(menuData) !== JSON.stringify(args.model.fields.dataSource))
                        menuObj.option("fields", { dataSource: menuData, id: "id", parentId: "parentId", text: "text", spriteCssClass: "spriteCssClass" });
				}
			}
			else if ($trgt.hasClass("e-ss-imgvisual") || $trgt.hasClass("e-ss-object") || $trgt.closest("div").hasClass("e-ss-object")) {
                this._isMenuOpened = true;
				if(xlObj.XLShape._shapeType === "chart") {
				   var chartMenuData = $.extend(true, [], this._chartMenuData), cid = document.getElementById(xlObj._id + "_chart").value, dataVal = xlObj.XLChart._getShapeObj(cid, "chart");
					menuData = this.XLObj.model.showRibbon ? (dataVal.isChartSeries ? chartMenuData.splice(0,3) : this._chartMenuData) : chartMenuData.splice(0, 2);
					}
                else
					menuData = this._imgMenuData;              
                if (JSON.stringify(menuData) !== JSON.stringify(args.model.fields.dataSource))
                    menuObj.option("fields", { dataSource: menuData, id: "id", parentId: "parentId", text: "text", spriteCssClass: "spriteCssClass" });
            }
			else if ($trgt.hasClass("e-ss-pivot") || $trgt.closest("div").hasClass("e-ss-pivot")) {
                menuData = this._pivotMenuData;
                if (JSON.stringify(menuData) !== JSON.stringify(args.model.fields.dataSource))
                    menuObj.option("fields", { dataSource: menuData, id: "id", parentId: "parentId", text: "text", spriteCssClass: "spriteCssClass" });
            }
			else if ($trgt.hasClass("e-headercelldiv") || $trgt.hasClass("e-headercell") || $trgt.hasClass("e-rowheader")){
				if (xlObj._phoneMode || xlObj._tabMode) {
                    colMenuObj.option("fields", { dataSource: this._headerMenuDataMobile });
                    rowMenuObj.option("fields", { dataSource: this._headerMenuDataMobile });
                }
                else if(this._changedDataSource){
                    colMenuObj.option("fields", { dataSource: this._columnHeaderMenuData });
                    rowMenuObj.option("fields", { dataSource: this._rowHeaderMenuData });
                }
			}
			if(!this._changedDataSource)
				this._updateContextMenuItems($trgt);
           if (args.cancel)
               this._isMenuOpened = false;
        },

        _menuClick: function (args) {
            if (this.XLObj._trigger("contextMenuClick", args))
                return;
            this._processCMenu(args.ID, args.events.element);
        },

        _menuClose: function () {
            this._isMenuOpened = false;
        },

        _processCMenu: function (key, elem) {
            var cid, dataVal, selCells, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), stCellIdx, enCellIdx,
                sheet = xlObj.getSheet(sheetIdx), actElem, columnName, selCols, selRows, selCells = sheet._selectedCells;;
            switch (key) {
                case "Cut":
                    xlObj.XLClipboard.cut();
                    break;
                case "Copy":
                    xlObj.XLClipboard.copy();
                    break;
                case "PasteSpecial":
                case "PasteValues":
                    xlObj.XLClipboard._isSpecial = !(key === "PasteValues");
                    xlObj.XLClipboard.paste();
                    break;
                case "Insert":
                    xlObj._insDelStatus = "insert";
                    if (sheet._isColSelected) {
                        selCols = xlObj._getJSSheetHeader(sheetIdx).find(".e-colhighlight");
                        xlObj.insertEntireColumn(selCols[0].cellIndex, selCols[selCols.length - 1].cellIndex);
                    }
                    else if (sheet._isRowSelected) {
                        selRows = xlObj._getJSSheetRowHeader(sheetIdx).find(".e-rowhighlight");
                        stCellIdx = xlObj._getCellIdx(selRows[0]);
                        enCellIdx = xlObj._getCellIdx(selRows[selRows.length - 1]);
                        xlObj.insertEntireRow(stCellIdx.rowIndex, enCellIdx. rowIndex);
                    }
                    else
                        xlObj._showDialog(xlObj._id + "_Ribbon_Others_Cells_InsertCellOptions");
                    break;
                case "Delete":
                    selCols = $(xlObj._getJSSheetHeader(sheetIdx).find("tr")[0]).find(".e-colselected");
                    selRows = $(xlObj.getRows(sheetIdx)[0]).find(".e-rowselected");
                    if (elem.parentElement.id.indexOf("ColumnHeader") > -1 || sheet._isColSelected) {
                        selCols = xlObj._getJSSheetHeader(sheetIdx).find(".e-colhighlight");
                        xlObj.deleteEntireColumn(selCols[0].cellIndex, selCols[selCols.length - 1].cellIndex, []);
                    }
                    else if (elem.parentElement.id.indexOf("RowHeader") > -1 || sheet._isRowSelected) {
                        selRows = xlObj._getJSSheetRowHeader(sheetIdx).find(".e-rowhighlight");
                        stCellIdx = xlObj._getCellIdx(selRows[0]);
                        enCellIdx = xlObj._getCellIdx(selRows[selRows.length - 1]);
                        xlObj.deleteEntireRow(stCellIdx.rowIndex, enCellIdx.rowIndex, []);
                    }
                    else
                        xlObj._showDialog(xlObj._id + "_Ribbon_Others_Cells_DeleteCellOptions");
                    break;
                case "FilterSelected":
                    xlObj._showDialog(xlObj._id + "_Ribbon_Data_SortFilter_Filter");
                    xlObj.XLFilter.filterByActiveCell();
                    this._clrFltrEnable = false;
                    break;
                case "ClearFilter":
                    actElem = xlObj.getActiveCell(sheetIdx);
                    var tabName = xlObj.XLEdit.getPropertyValue(actElem.rowIndex, actElem.colIndex, "tableName"), tabId;
                    tabId = (!ej.isNullOrUndefined(tabName)) ? parseInt(tabName.replace("e-table", "")) : -1;
                    if (tabId > -1) {
                        columnName = xlObj.model.sheets[sheetIdx].columns[actElem.colIndex].field;
                        xlObj.XLFilter._clearFilterColumn(columnName, "", "", "", "", "", tabId);
                        delete xlObj._excelFilter._predicates[sheetIdx][columnName];
                    }
                    else
                        xlObj.XLFilter.clearFilter("apply");
                    this._clrFltrEnable = false;
                    break;
                case "SortAtoZ":
                case "SortZtoA":
                case "SortSmallesttoLargest":
                case "SortLargesttoSmallest":
                case "SortOldesttoNewest":
                case "SortNewesttoOldest":
                case "PutCellColor":
                case "PutFontColor":
                    if (xlObj.model.allowSorting)
                        xlObj.XLSort._sortHandler(key);
                    break;
                case "ClearContents":
                    var range = xlObj.model.sheets[sheetIdx].selectedRange;
                    xlObj.clearContents(xlObj._getAlphaRange(sheetIdx, range[0], range[1], range[2], range[3]));
                    break;
                case "InsertSheet":
                    xlObj.insertSheet();
                    break;
                case "DeleteSheet":
                    xlObj.deleteSheet(sheetIdx, true);
                    break;
                case "RenameSheet":
                    xlObj._renameSheet();
                    break;
                case "MoveorCopy":
                    xlObj._showDialog(xlObj._id + "_MoveorCopy");
                    break;
                case "Hide":
                    sheet._isColSelected && xlObj._hideColumn(selCells[0].colIndex, selCells[selCells.length - 1].colIndex);
                    sheet._isRowSelected && xlObj._hideRow(selCells[0].rowIndex, selCells[selCells.length - 1].rowIndex, "isRHide");
                    break;
                case "Unhide":
                    sheet._isColSelected && xlObj._showColumn(selCells[0].colIndex, selCells[selCells.length - 1].colIndex);
                    sheet._isRowSelected && xlObj._showRow(selCells[0].rowIndex, selCells[selCells.length - 1].rowIndex, "isRHide");
                    break;
                case "HyperLink":
                case "EditLink":
                    xlObj._showDialog(xlObj._id + "_Ribbon_Insert_Links_Hyperlink");
                    break;
                case "RemoveLink":
                    xlObj._removeHyperlink();
                    break;
                case "OpenLink":
                    xlObj._openLink();
                    break;
                case "ctxInsrtCmnt":
                    xlObj._dupDetails = true;
                    xlObj.XLComment.setComment();
                    xlObj._dupDetails = false;
                    break;
                case "ctxEditCmnt":
                    xlObj.XLComment.editComment();
                    break;
                case "ctxDeleteCmnt":
                    xlObj.XLComment.deleteComment();
                    break;
                case "ctxShwHdCmnt":
                    xlObj.XLComment.showHideComment();
                    break;
                case "ChangePicture":
                    xlObj._uploadImage = true;
                    xlObj.XLShape._changePicture = true;
                    xlObj.element.find("#" + xlObj._id + "_file .e-uploadinput").click();
                    break;
                case "ChartType":
                    xlObj._showDialog(xlObj._id + "_Ribbon_ChartDesign_Type_ChangeChartType");
					xlObj.XLRibbon._refreshChartTypeDlg();
                    break;
                case "SelectData":
                    xlObj._showDialog(xlObj._id + "_Ribbon_ChartDesign_Data_SelectData");
                    cid = document.getElementById(xlObj._id + "_chart").value;
                    dataVal = xlObj.XLChart._getShapeObj(cid, "chart");
                    if (!dataVal.isChartSeries) {
                        $("#" + xlObj._id + "_crxaxis").val(dataVal.xRange ? xlObj._getAlphaRange(sheetIdx, dataVal.xRange[0], dataVal.xRange[1], dataVal.xRange[2], dataVal.xRange[3]) : "");
                        $("#" + xlObj._id + "_cryaxis").val(dataVal.yRange ? xlObj._getAlphaRange(sheetIdx, dataVal.yRange[0], dataVal.yRange[1], dataVal.yRange[2], dataVal.yRange[3]) : "");
                        $("#" + xlObj._id + "_crlaxis").val(dataVal.lRange ? xlObj._getAlphaRange(sheetIdx, dataVal.lRange[0], dataVal.lRange[1], dataVal.lRange[2], dataVal.lRange[3]) : "");
                        xlObj._selectDataval = { xRange: $("#" + xlObj._id + "_crxaxis").val(), yRange: $("#" + xlObj._id + "_cryaxis").val(), lRange: $("#" + xlObj._id + "_crlaxis").val() };
                        $("#" + xlObj._id + "_chartrangedlg").ejDialog("open");
                    }
                    break;
                case "HideSheet":
                    xlObj.hideSheet();
                    break;
                case "UnhideSheet":
                    xlObj._showDialog(xlObj._id + "_UnhideSheet");
                    break;
                case "ProtectSheet":
                    xlObj.protectSheet(!sheet.isSheetProtected);
                    break;
                case "FormatCells":
                    xlObj._showDialog(xlObj._id + "_FormatCells");
                    break;
                case "Refresh":
                    xlObj.XLPivot.refreshDataSource();
                    break;
                case "BackgroundColor":
                    $("#" + this.XLObj._id + "_colordlg").ejDialog("open");
                    this._selColor = {action: "bg-color", color: ""};
                    break;
                case "FontColor":
                    $("#" + this.XLObj._id + "_colordlg").ejDialog("open");
                    this._selColor = { action: "color", color: "" };
                    break;
                case "Modify":
                    this._modifyClick = true;
                    xlObj._showDialog(this.XLObj._id + "_CustomCellDialog");
                    this._oldCustomName = $("#" + this.XLObj._id + "_StyleName").val();
                    break;
                case "DeleteStyle":
                    xlObj.XLFormat.deleteCustomStyle(this._target);
                    break;
                case "Apply":
                    xlObj.XLFormat.applyCustomCellStyle(this._target);
                    break;
            }
        },

        _disableMenuOpt: function (idCollection, cMenuId) {
            var cName = cMenuId || "contextMenuCell", menuObj = $("#" + this.XLObj._id + "_" + cName).data("ejMenu");
            if (menuObj)
                for (var i = 0, len = idCollection.length; i < len; i++)
                    menuObj.disableItemByID(idCollection[i]);
        },

        _enableMenuOpt: function (idCollection, cMenuId) {
            var cName = cMenuId || "contextMenuCell", menuObj = $("#" + this.XLObj._id + "_" + cName).data("ejMenu");
            if (menuObj)
                for (var i = 0, len = idCollection.length; i < len; i++)
                    menuObj.enableItemByID(idCollection[i]);
        },

        _initColorDialog: function () {
            var xlObj = this.XLObj, dlgId = xlObj._id + "_colordlg";
            if ($("#" + dlgId).length)
                return;
            var $dlg = ej.buildTag("div#" + dlgId + ".e-colordlg e-" + xlObj._id + "-dlg " , "", { display: "none" }), contentdiv = ej.buildTag("div#" + dlgId + "_dlgcontent .e-colordlgcontent"), cpinput = ej.buildTag("input#" + dlgId + "_cpicker"), confirmbtndiv = ej.buildTag("div#" + dlgId + "_condiv .e-dlg-btnctnr"),
                okButton = ej.buildTag("input#" + this._id + "_dialog_Ok"), canButton = ej.buildTag("input#" + this._id + "_dialog_Can", "", { "margin-left": 10 }), btncontentdiv = ej.buildTag("div#" + dlgId + "_dlgbtncontent .e-dlg-btnfields");
            contentdiv.append(cpinput);
            $dlg.append(contentdiv);
            xlObj.element.append($dlg);
            $dlg.ejDialog({ showOnInit: false, enableModal: true, enableResize: false, allowKeyboardNavigation: false, title: xlObj._getLocStr("ColorPicker"), width: "240", height: "auto", minHeight: 0, cssClass: "e-ss-dialog e-" + xlObj._id + "-dlg" });
            $("#" + dlgId + "_cpicker").ejColorPicker({ value: "#278787", modelType: "palette", presetType: "basic", cssClass: "e-ss-colorpicker e-ss-menuclrpkr", select: $.proxy(this._cpClickHandler, this), showApplyCancel: false });
            $("#" + dlgId + "_cpickerWrapper").hide();
            contentdiv.append($("#" + dlgId + "_cpicker_popup").css("display", "block"));
            okButton.ejButton({ text: xlObj._getLocStr("Ok"), showRoundedCorner: true, width: 60, click: ej.proxy(this._colorOkClick, this), enabled: true });
            canButton.ejButton({ text: xlObj._getLocStr("Cancel"), showRoundedCorner: true, width: 60, click: ej.proxy(this._colorCanClick, this) });
            btncontentdiv.append(confirmbtndiv.append(okButton, canButton));
            $dlg.append(btncontentdiv);
        },

        _cpClickHandler: function (args) {
            this._selColor.color = args.value;
        },

        _colorOkClick: function (args) {
            var xlObj = this.XLObj;
            xlObj.XLFormat.format({ "style": (this._selColor.action === "bg-color") ? { "background-color": this._selColor.color } : { "color": this._selColor.color } });
            xlObj.setSheetFocus();
            $("#" + xlObj._id + "_colordlg").ejDialog("close");
        },

        _colorCanClick: function (args) {
            $("#" + this.XLObj._id + "_colordlg").ejDialog("close");
        }
    };

})(jQuery, Syncfusion);