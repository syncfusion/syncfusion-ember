/**
* @fileOverview Plugin to style the Html div elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejFileExplorer", "ej.FileExplorer", {

        element: null,

        model: null,
        validTags: ["div"],
        _addToPersist: ["layout", "selectedFolder", "selectedItems", "height", "width"],
        _rootCSS: "e-fileexplorer",
        _requiresID: true,
        defaults: {

            fileTypes: "*.*",

            filterSettings: {

                caseSensitiveSearch: false,

                filterType: "contains",

                allowSearchOnTyping : true

            },

            showToolbar: true,

            showCheckbox: true,

            showNavigationPane: true,

            allowDragAndDrop: true,

            showContextMenu: true,

            showFooter: true,

            layout: "grid",

            locale: "en-US",

            selectedFolder: "",

            selectedItems: "",

			
			virtualItemCount:0,
			
            gridSettings: {
                allowSorting: true,
                columns: [
                    { field: "name", headerText: "Name", width: "30%" },
                    { field: "dateModified", headerText: "Date Modified", width: "30%" },
                    { field: "type", headerText: "Type", width: "15%" },
                    { field: "size", headerText: "Size", width: "12%", textAlign: "right", headerTextAlign: "left" }],
                allowResizing:true
            },

            tools: {
                creation: ["NewFolder"],
                navigation: ["Back", "Forward", "Upward"],
                addressBar: ["Addressbar"],
                editing: ["Refresh", "Upload", "Delete", "Rename", "Download"],
                copyPaste: ["Cut", "Copy", "Paste"],
                getProperties: ["Details"],
                searchBar: ["Searchbar"],
                layout: ["Layout"],
                sortBy: ["SortBy"]
            },

            toolsList: ["layout", "creation", "navigation", "addressBar", "editing", "copyPaste", "sortBy", "getProperties", "searchBar"],

            path: "",

            rootFolderName: "",

            height: "400px",

            width: "850px",

            minWidth: "400px",

            maxWidth: null,

            minHeight: "250px",

            maxHeight: null,

            isResponsive: false,

            uploadSettings: {

                allowMultipleFile: true,

                maxFileSize: 31457280,

                autoUpload: false,

                showFileDetails: true,

                dialogPosition: { X: "", Y: "" },

                dialogAction: {

                    modal: false,

                    closeOnComplete: false,

                    drag: true,

                    content: null

                }

            },

            enableResize: false,

            cssClass: "",

            enableRTL: false,

            allowKeyboardNavigation: true,

            showThumbnail: true,

            enableThumbnailCompress: false,

            showRoundedCorner: false,

            ajaxAction: "",

            ajaxDataType: "json",

            ajaxSettings: {
                read: {},
                createFolder: {},
                remove: {},
                rename: {},
                paste: {},
                getDetails: {},
                download: {},
                upload: {},
                getImage: {},
                search:{}
            },

            allowMultiSelection: true,

            contextMenuSettings: {
                items: {
                    navbar: ["NewFolder", "Upload", "|", "Delete", "Rename", "|", "Cut", "Copy", "Paste", "|", "Getinfo"],
                    cwd: ["Refresh", "Paste", "|", "SortBy", "|", "NewFolder", "Upload", "|", "Getinfo"],
                    files: ["Open", "Download", "|", "Upload", "|", "Delete", "Rename", "|", "Cut", "Copy", "Paste", "|", "OpenFolderLocation", "Getinfo"]
                },
                customMenuFields: []
            },

            enablePersistence: false,

            layoutChange: null,

            getImage: null,

            select: null,

            unselect: null,

            createFolder: null,

            remove: null,

            cut: null,

            copy: null,

            paste: null,

            open: null,

            beforeOpen: null,

            beforeUploadDialogOpen: null,

            beforeUpload: null,

            beforeUploadSend: null,

            uploadSuccess: null,

            uploadError: null,

            uploadComplete: null,

            beforeDownload: null,

            beforeGetImage: null,

            beforeAjaxRequest: null,

            resizeStart: null,

            resize: null,

            resizeStop: null,

            templateRefresh: null,

            dragStart: null,

            drag: null,

            dragStop: null,

            drop: null,

            menuClick: null,

            menuBeforeOpen: null,

            menuOpen: null,

            create: null,

            destroy: null

        },
        dataTypes: {
            filterSettings: "data",
            showToolbar: "boolean",
            showNavigationPane: "boolean",
            showContextMenu: "boolean",
            allowDragAndDrop: "boolean",
            allowKeyboardNavigation: "boolean",
            showRoundedCorner: "boolean",
            showFooter: "boolean",
            layout: "enum",
            tools: {
                creation: "array",
                navigation: "array",
                addressBar: "array",
                editing: "array",
                layout: "array",
                copyPaste: "array",
                getProperties: "array",
                searchBar: "array"
            },
            contextMenuSettings: {
                items: {
                    navbar: "array",
                    cwd: "array",
                    files: "array"
                },
                customMenuFields: "array"
            },
            gridSettings: {
                allowSorting: "boolean",
                columns: "array",
                allowResizing: "boolean"
            },
            toolsList: "array",
            uploadSettings: "data",
            ajaxSettings: "data",
        },
        _setModel: function (options) {
            var proxy = this;
            for (var prop in options) {
                switch (prop) {
                    case "showToolbar":
                        options[prop] ? ej.isNullOrUndefined(this._toolBarItems) ? this._updateToolbar() : this._toolBarItems.show() : this._toolBarItems.hide();
                        this.adjustSize();
                        break;
                    case "showNavigationPane":
                    case "showTreeview":
                        this.model.showNavigationPane = this.model.showTreeview = options[prop];
                        this._showHideSplitBar(this.model.showNavigationPane);
                        break;
                    case "showContextMenu":
                        this._showHideContextMenu();
                        break;
                    case "height":
                        this.element.css("height", this._getProperValue(this.model.height));
                        this.adjustSize();
                        break;
                    case "width":
                        this.element.css("width", this._getProperValue(this.model.width));
                        this.adjustSize();
                        break;
                    case "layout":
                        this._switchLayoutView(true);
                        break;
                    case "allowDragAndDrop":
                        this.model.allowDragAndDrop = options[prop];
                        this._draggableOption(options[prop] ? "_on" : "_off");
                        options[prop] ? this._allowDrag() : this._preventDrag();
                        break;
                    case "showThumbnail":
                        this.model.showThumbnail = options[prop];
                        this._switchLayoutView();
                        break;
                    case "enableThumbnailCompress":
                        this.model.enableThumbnailCompress = options[prop];
                        this.model.showThumbnail && this.model.layout != "grid" && this._renderTileView(this._fileExplorer[this._originalPath]);
                        break;
                    case "path":
                        options[prop] ? this._setPath(options[prop]) : this._getPath();
                        break;
                    case "enableRTL": this._enableRTL(options[prop]); break;
                    case "allowKeyboardNavigation":
                        this._subControlsSetModel("allowKeyboardNavigation", options[prop]);
                        this._gridObj && this._gridObj.setModel({ "allowKeyboardNavigation": options[prop] });
                        break;
                    case "showFooter":
                        if (options[prop]) {
                            if (this._statusbar.hasClass("e-statusbar")) {
                                var setHeight = this._splittag.find(".e-cont2").outerHeight() - this._statusbar.outerHeight();
                                this._tileView.height(setHeight);
                                this._gridtag.height(setHeight);
                                this._statusbar.show();
                            }
                            else {
                                this._createStatusBar();
                                this._updateData();
                                if (this.model.enableResize)
                                    this._resizeFileExplorer();
                                this._on($('#' + this._ExplorerId + '_switchGridView'), "click", this._switchView);
                                this._on($('#' + this._ExplorerId + '_swithListView'), "click", this._switchView);
                            }
                            var height = this._splittag.height() - this._gridtag.find(".e-gridheader").outerHeight();
                            this._tileContent.parent(".e-tile-wrapper").ejScroller({ height: this._splittag.outerHeight() - this._statusbar.outerHeight(), scrollerSize: this._scrollerSize, thumbStart: function (e) { proxy._onThumbStart(e); } });
                        } else {
                            this._tileView.height("auto");
                            this._gridtag.height("auto");
                            this._statusbar.hide();
                            var height = this._splittag.height() - this._gridtag.find(".e-gridheader").outerHeight();
                            this._tileContent.parent(".e-tile-wrapper").ejScroller({ height: this._splittag.outerHeight(), scrollerSize: this._scrollerSize, thumbStart: function (e) { proxy._onThumbStart(e); } });
                        }
                        break;
                    case "gridSettings":
                        var gridSettings = JSON.parse(JSON.stringify(options[prop]));
                        if (gridSettings.columns) {
                            gridSettings.columns.unshift({ field: "cssClass", headerText: "", cssClass: "e-grid-image", width: 22, template: "<script type='text/x-jsrender'><span class='e-fe-icon {{:cssClass}}' unselectable='on'></span></script>", textAlign: ej.TextAlign.Center, allowResizing: false });
                            if (this.model.showCheckbox)
                                gridSettings.columns.unshift({ field: "", headerText: "check", cssClass: "e-col-check", width: 18, template: "<script type='text/x-jsrender'><input type='checkbox' class='e-grid-row-checkbox'/></script>", textAlign: ej.TextAlign.Center, headerTextAlign: ej.TextAlign.Center, allowResizing: false, allowSorting: false });
                        }
                        this._gridObj && this._gridtag.ejGrid(gridSettings);
                        this._showHideContextMenu();
                        this._renderSortbyDrpdwn();
                        break;
                    case "locale":                        
                        this.model.locale = options[prop];                        
                        this._destroy();
                        this._init();
                        break;
                    case "cssClass": this._changeSkin(options[prop]); break;
                    case "fileTypes":
                        $.each(proxy._fileExplorer, function (itemPath, value) {
                            proxy._fileExplorer[itemPath] = "";
                        });
                        this._removeOldSelectionDetails();
                        this._refreshItems(this._selectedNode, this._currentPath);
                        this._uploadtag.ejUploadbox("option", { extensionsAllow: this.model.fileTypes == "*.*" ? "" : this.model.fileTypes.replace(/\*/g, "") });
                        break;
                    case "selectedFolder":
                        this._selectedFolder(this.model.selectedFolder);
                        break;
                    case "selectedItems":
                        this._selectedItems = options[prop];
                        this._setSelectedItems(options[prop]);
                        break;
                    case "allowMultiSelection":
                        !options[prop] && this._setSelectedItems([]);
                        this._gridtag.find(".e-gridheader").length && this._gridtag.ejGrid("option", { selectionType: (options[prop] ? "multiple" : "single") });
                        if (!ej.isNullOrUndefined(this._gridObj)) {
                            if (this.model.allowMultiSelection) this._gridtag.find('.e-headercelldiv>span.e-chkbox-wrap').show();
                            else this._gridtag.find('.e-headercelldiv>span.e-chkbox-wrap').hide();
                        }
                            break;
                    case "isResponsive": {
                        this.model.isResponsive = options[prop];
                        if (this._toolBarObj) {
                            this._toolBarObj.option("isResponsive", this.model.isResponsive);
                            this.model.showToolbar ? this._toolBarItems.show() : this._toolBarItems.hide();
                            this.adjustSize();
                        }
                        this._wireResizing();
                        break;
                    }
                    case "tools":
                    case "toolsList":
                        if (prop == "tools")
                            $.extend(this.model.tools, options[prop]);
                        else
                            this.model.toolsList = options[prop];
                        if (this._toolBarObj) {
                            this._toolBarObj.destroy();
                            this.element.find("#" + this._ExplorerId + "_toolbar").remove();
                            this._updateToolbar();
                            this.model.showToolbar ? this._toolBarItems.show() : this._toolBarItems.hide();
                            this.adjustSize();
                        }
                        break;
                    case "enableResize":
                        if (!options[prop])
                            this._resizeItem && this._resizeItem.remove();
                        else if (options[prop] && this.model.showFooter) {
                            this._resizeItem = ej.buildTag("div.e-icon e-fe-resize e-resize-handle");
                            this._resizeItem.insertBefore(this.element.find(".e-switchView"));
                            this._resizeFileExplorer();
                        }
                        break;
                    case "minHeight":
                        this.element.css("min-height", this._getProperValue(this.model.minHeight));
                        this._refreshResizeHandler();
                        break;
                    case "maxHeight":
                        this.element.css("max-height", this._getProperValue(this.model.maxHeight));
                        this._refreshResizeHandler();
                        break;
                    case "minWidth":
                        this.element.css("min-width", this._getProperValue(this.model.minWidth));
                        this._refreshResizeHandler();
                        break;
                    case "maxWidth":
                        this.element.css("max-width", this._getProperValue(this.model.maxWidth));
                        this._refreshResizeHandler();
                        break;
                    case "showCheckbox":
                        this._changeCheckState = this.model.showCheckbox;
                        this.model.layout == "grid" ? this._renderGridView(this._fileExplorer[this._originalPath]) : this._renderTileView(this._fileExplorer[this._originalPath], true);
                        this._setSelectedItems(this.model.selectedItems);
                        break;
                    case "showRoundedCorner":
                        this._roundedCorner(options[prop]);
                        break;
                    case "contextMenuSettings":
                        $.extend(this.model[prop], options[prop]);
                        this._showHideContextMenu();
                        break;
                    case "uploadSettings":
                        this._uploadObj.option(options[prop]);
                        break;
                    case "rootFolderName":
                        this._changeRootFolderName();
                        this._updateAddressBar();
                        if (this._treeObj.element.find('li:first > div > .e-text').hasClass("e-active"))
                            this._treeObj.selectNode(this._treeObj.element.find('li:first > div > .e-text'));
                        break;
					case "virtualItemCount":
                        this.model.virtualItemCount = options[prop];
                        this._switchLayoutView();
                        break;
                }
            }
        },

        _init: function () {
            this._cloneElement = this.element.clone();
            (!ej.isNullOrUndefined(this.model.uploadBoxSettings)) && (this.model.uploadSettings = this.model.uploadBoxSettings);
            (!ej.isNullOrUndefined(this.model.showTreeview)) && (this.model.showNavigationPane = this.model.showTreeview);
            (!ej.isNullOrUndefined(this.model.move)) && (this.model.cut = this.model.move);
            this._initialize();
            this._render();            
            this._changeLayoutActive(this.model.layout);
        },
        _postInit: function () {
            this._enablePostInit = false;
            this._enableRTL(this.model.enableRTL);
            this._wireEvents();
            this._wireResizing();
            this._setMinMaxSizeInInteger();
            if (this.model.enableResize && this.model.showFooter)
                this._resizeFileExplorer();
            this._isClicked = false;
            if (this._selectedTreeFolder && this._currentPath != this._selectedTreeFolder)
                this._selectedFolder(this._selectedTreeFolder);
            if (this._selectedNodes.length) {
                this._setSelectedItems(this._selectedNodes);
            }
            this._isClicked = true;
        },

        _initialize: function () {
            this._ExplorerId = this.element[0].id;
            this._fileExplorer = {};
            this._feParent = {};
            this._updateImages = {};
            this._selectedStates = [];
            this._updateOnNodeSelection = false;
            this._isClicked = true;
            this._toolBarObj = null;
            this._tileView = null;
            this._tileScroll = null;
            this._originalPath = null;            
            this._initPath = "";
            this._initUpdate = false;
            this._scrollerSize = 8;
            this._editingToolsState = true;
            this._renderMultiTouchDialog();
            this._ensureResolution();
            this._isDevice = this._checkDevice();
            this.element.css({ "height": this._getProperValue(this.model.height), "width": this._getProperValue(this.model.width), "min-width": this._getProperValue(this.model.minWidth), "max-width": this._getProperValue(this.model.maxWidth), "min-height": this._getProperValue(this.model.minHeight), "max-height": this._getProperValue(this.model.maxHeight) });
            this._customCssClass = this.model.cssClass;
            this.element.addClass(this.model.cssClass);            
            this._isTreeNode = false;
            this._selectedItems = [];
            this._selectedTileItems = [];
            this._downloadDialog = null;
            this._newFolderDialog = null;
            this._renameDialog = null;
            this._openDialog = null;
            this._detailsDialog = null;
            this._alertDialog = null;
            this._enablePostInit = true;
            this._initialTime = new Date().getTime();
            this._currentPath = this.model.path.replace(/\\/g, "/");
            this._rootPath = this._currentPath = this._currentPath.endsWith("/") ? this._currentPath : this._currentPath + "/";
            this._gridObj = null;
            this._setUploadLocalization();
            this._restrictedToolbarOptions = [];
            this._restrictedMenuOption = [];
            this._changeCheckState = this.model.showCheckbox;
            this._perRow = 1;
            this._suggestionItems = [];
            this._highlightedNodes = "";
            this._prevsorting = true;
            this._FilteredFiles = [];
			this._scrollListCount = 0;
            this._previousFolder="";
            this._count=0;
            this._priviousScrollListCount=0;			
            this._vScrollTop = 0;
            this._renamedStatus = false;
            this._virtualScrollRenamedItem="";
        },

        _renderMultiTouchDialog: function () {
            this._customPop = ej.buildTag("div.e-fe-popup", "", { display: "none" });
            var $content = ej.buildTag("div.e-content"), $downTail = ej.buildTag("div.e-downtail e-tail");
            if (this.model.allowMultiSelection) {
                var $selElement = ej.buildTag("span.e-rowselect e-icon");
                $content.append($selElement);
            }
            this._customPop.append($content);
            this._customPop.append($downTail);
            this.element.append(this._customPop);
            this._on(this._customPop, "mousedown", this._popupClick);
        },

        _mouseSelection: function (event) {

            this._target = $(event.target);
            if ((this.model.allowDragAndDrop && (this._target.closest('li').hasClass('e-tilenode') || this._target.is('li.e-tilenode') || this._target.closest('.e-rowcell').is('td')
                || this._target.closest('.e-row').is('tr') || this._target.is('tr'))) || this._target.closest('.e-scrollbar').length > 0 || !this.model.allowMultiSelection || event.button == 2) return;

            proxy = this;
            this._currentTarget = $(event.currentTarget);
            this._initialx = event.pageX; this._initialy = event.pageY;

            this._selectionContainer = ej.buildTag('div.e-fe-selection-rect');
            this._currentTarget.append(this._selectionContainer);

            if (this.element.hasClass("e-ie8")) this._selectionContainer.addClass("e-active");
            event.preventDefault();

            this._containerleftpos = this._currentTarget.offset().left;
            this._containerrightpos = this._currentTarget.width() + this._containerleftpos;
            this._containertoppos = this._currentTarget.offset().top;
            this._containerbottompos = this._currentTarget.height() + this._containertoppos;
            if (this._currentTarget.hasClass('e-gridcontent')) {
                this._gridheader = this._gridObj.element.find('.e-headercontent').offset().top;
                this._gridcontent = this._containertoppos;
            }
            else {
                this._gridheader = null;
                this._gridcontent = null;
            }

            this._prevGridItems = [], this._prevTileItems = [], this._prevScrollTop = null;
            
            if (!event.ctrlKey && !event.shiftKey) this._selectedRows = [];
            if ((event.ctrlKey || event.shiftKey)) {
                if (this._currentTarget.hasClass('e-gridcontent') && !ej.isNullOrUndefined(this._selectedRows)) 
                    this._prevGridItems = this._selectedRows;
                else this._prevTileItems = this._currentTarget.find('li.e-tilenode.e-active');
            }
            
            this._on($(document), "mousemove", this._createSelectionRectangle);
            this._on($(document), "mouseup", this._removeSelectionRectangle);
        },

        _createSelectionRectangle: function (event) {
            event.preventDefault(); this._selectedRows = [];
            this._scroller(event);
            var container = this._selectionContainer;
            if (this._gridObj) var headerContent = this._gridObj.element.find('.e-headercontent').height();
            if (ej.isNullOrUndefined(headerContent)) headerContent = null;

            if (event.pageX < this._initialx) {
                if (event.pageX < this._containerleftpos) { container.css({ "width": this._initialx - this._containerleftpos, "left": 0 }); }
                else container.css({ "width": this._initialx - event.pageX, "left": event.pageX - this._containerleftpos });
            }
            else {
                if (event.pageX > this._containerrightpos) container.css({ "width": this._containerrightpos - this._initialx, "left": this._initialx - this._containerleftpos });
                else container.css({ "width": event.pageX - this._initialx, "left": this._initialx - this._containerleftpos });
            }
            if (event.pageY < this._initialy) {
                if (event.pageY < this._containertoppos) container.css({ "height": this._initialy - this._containertoppos, top: 0 + (this._gridcontent - this._gridheader) });
                else container.css({ "height": this._initialy - event.pageY, "top": event.pageY - (this._containertoppos - headerContent) });
            }
            else {
                if (event.pageY > this._containerbottompos) container.css({ "height": this._containerbottompos - this._initialy, "top": this._initialy - (this._containertoppos - headerContent) });
                else container.css({ "height": event.pageY - this._initialy, "top": this._initialy - (this._containertoppos - headerContent) });
            }
            
            this._changeItemState(container, event);
        },

        _removeSelectionRectangle: function () {
            this._firstSelectedElement = null;
            this._selectionContainer.remove();
            this._off($(document), "mousemove", this._createSelectionRectangle);
            this._off($(document), "mouseup", this._removeSelectionRectangle);
            this._currentTarget.css("pointer-events", "initial");
        },

        _scroller: function (event) {
            var vpos, hpos;
            this._scrollObj = this._currentTarget.data("ejScroller");
            var scrollTop = scrollLeft = 20;
            if (this._currentTarget.hasClass("e-scroller") && !ej.isNullOrUndefined(this._firstSelectedElement)) {
                if (this._currentTarget.find('.e-vscrollbar').length > 0) vpos = this._firstSelectedElement.offset().top - this._initialy;
                if (this._currentTarget.find('.e-hscrollbar').length > 0) hpos = this._firstSelectedElement.offset().left - this._initialx;
                if (event.pageY > this._containerbottompos) { this._scrollObj.option({ "scrollTop": scrollTop + this._scrollObj.option("scrollTop") }); }
                else if (event.pageY < this._containertoppos) { this._scrollObj.option({ "scrollTop": this._scrollObj.option("scrollTop") - scrollTop }); }
                else if (event.pageX > this._containerrightpos) { this._scrollObj.option({ "scrollLeft": this._scrollObj.option("scrollLeft") + scrollLeft }); }
                else if (event.pageX < this._containerleftpos) { this._scrollObj.option({ "scrollLeft": this._scrollObj.option("scrollLeft") - scrollLeft }); }
                if (this._currentTarget.find('.e-vscrollbar').length > 0) this._initialy = this._firstSelectedElement.offset().top - vpos;
                if (this._currentTarget.find('.e-hscrollbar').length > 0) this._initialx = this._firstSelectedElement.offset().left - hpos;
                this._prevScrollTop = this._scrollObj.option("scrollTop");
            }
        },

        _changeItemState: function (container, event) {
            var rowStart, rowEnd,rect = $(this._currentTarget).find('.e-fe-selection-rect');
            var itemHeight, rectStartX, rectStartY, rectEndX, rectEndY;

            if (this._currentTarget.hasClass('e-gridcontent')) {
                if (this._currentTarget.find('.e-vscrollbar').length > 0)
                    var totHeight = this._currentTarget.find('.e-content')[0].scrollHeight;
                else var totHeight = this._currentTarget.children().outerHeight();
                rectStartY = (parseInt(rect.css("top")) - this._gridObj.element.find('.e-gridheader').outerHeight()) + this._scrollObj.model.scrollTop;
                var rectEndY = rectStartY + parseInt(rect.css("height"));
                itemHeight = proxy._currentTarget.find('tr:first').outerHeight();
                rowStart = parseInt(rectStartY / itemHeight);
                rowEnd = parseInt(rectEndY / itemHeight);
                var totRows = totHeight / itemHeight;
                
                if ((event.ctrlKey || event.shiftKey) && !ej.isNullOrUndefined(this._prevGridItems)) {
                    for (var i = 0; i < this._prevGridItems.length; i++) {
                        this._selectedRows.push(this._prevGridItems[i]);
                    }
                }
                
                this._selectGridRecords(event, container, rowStart, rowEnd);

                if (!ej.isNullOrUndefined(this._prevScrollTop)) {
                    if (this._scrollObj) this._scrollObj.scrollY(this._prevScrollTop);
                }
            }
            else {
                var itemWidth;
                this._tileNodes = $(this._currentTarget).find('li.e-tilenode');
                itemWidth = parseInt(this._tileNodes.first().outerWidth()) + 2 * (parseInt(this._tileNodes.first().css("margin-left")));
                itemHeight = parseInt(this._tileNodes.first().outerHeight()) + parseInt(this._tileNodes.first().css("margin-top")) + parseInt(this._tileNodes.first().css("margin-bottom"));
                rectStartX = parseInt(rect.css("left"));
                rectStartY = parseInt(rect.css("top")) + this._scrollObj.model.scrollTop;
                rectEndX = parseInt(rect.css("left")) + parseInt(rect.css("width"));
                rectEndY = rectStartY + parseInt(rect.css("height"));
                this._columnStart = parseInt(rectStartX / itemWidth) + 1;
                rowStart = parseInt(rectStartY / itemHeight) + 1;
                this._columnEnd = parseInt(rectEndX / itemWidth) + 1;
                rowEnd = parseInt(rectEndY / itemHeight) + 1;
                this._totColumn = parseInt(proxy._currentTarget.find('.e-tile-content').outerWidth() / itemWidth);
                this._selectTileItems(container, event, rowStart, rowEnd);
            }
        },

        _selectGridRecords: function (event, container, rowStart, rowEnd) {
            var currentItem;
            for (var i = rowStart; i <= rowEnd; i++) {
                currentItem = $(this._currentTarget.find('tr')[i]);
                if (!ej.isNullOrUndefined(currentItem)) {
                    if (currentItem.length == 0) continue;
                    var offset = currentItem.offset();
                    if (ej.isNullOrUndefined(this._firstSelectedElement)) this._firstSelectedElement = currentItem;
                    
                    var itemleftpos = offset.left, itemtoppos = offset.top, itemrightpos = offset.left + currentItem.width(), itembottompos = offset.top + currentItem.height();

                    //To check whether the items are present inside the rectangle 
                    if (!((itembottompos < container.offset().top) || (itemtoppos > container.offset().top + container.height()) || (itemrightpos < container.offset().left) || (itemleftpos > container.offset().left + container.width()))) {
                        this._currentTarget.css("pointer-events", "none");
                        if ((event.ctrlKey) && $.inArray(i, this._prevGridItems) > -1) {
                            this._selectedRows.splice(this._selectedRows.indexOf(i), 1);
                        }
                        else if (event.shiftKey && $.inArray(i, this._prevGridItems) > -1) {
                            this._prevGridItems.splice(this._prevGridItems.indexOf(i), 1);
                        }
                        else this._selectedRows.push(i);
                    }
                }
            }

            this.option("selectedItems", []);

            if (this._selectedRows.length > 0) {
                if (this._currentTarget.find('table tr').hasClass('e-hover')) this._currentTarget.find('table tr').removeClass('e-hover');
                this._gridObj.selectRows(this._selectedRows);
            }
        },

        _selectTileItems: function (container,event,rowStart, rowEnd) {

            this.option("selectedItems", []);

            if ((event.ctrlKey || event.shiftKey) && !ej.isNullOrUndefined(this._prevTileItems)) {
                for (var i = 0; i < this._prevTileItems.length; i++) {
                    this._prevTileItems[i].click();
                }
            }

            for (var i = rowStart; i <= rowEnd; i++) {
                for (var j = this._columnStart; j <= this._columnEnd; j++) {
                    if (j > this._totColumn) var column = this._totColumn;
                    else var column = j;
                    if (this.model.enableRTL) var currentColumn = (this._totColumn - column) + 1;
                    else var currentColumn = column;
                    var value = parseInt(((((i - 1) * this._totColumn) + currentColumn) - 1));
                    if (!$(this._tileNodes.eq(value)[0]).hasClass('e-active') || (event.ctrlKey || event.shiftKey)) {
                        var currentItem = this._tileNodes.eq(value);
                        if (currentItem.length == 0) continue;
                        offset = currentItem.offset();
                        var itemleftpos = offset.left, itemtoppos = offset.top, itemrightpos = offset.left + currentItem.width(), itembottompos = offset.top + currentItem.height();

                        if (!((itembottompos < container.offset().top) || (itemtoppos > container.offset().top + container.height()) || (itemrightpos < container.offset().left) || (itemleftpos > container.offset().left + container.width()))) {

                            this._currentTarget.css("pointer-events", "none"); currentItem.removeClass("e-hover");

                            if (ej.isNullOrUndefined(this._firstSelectedElement)) this._firstSelectedElement = currentItem;

                            if (event.shiftKey && $.inArray(currentItem[0], this._prevTileItems) > -1) {
                                for (var i = 0; i < this._prevTileItems.length; i++) {
                                    if (currentItem[0] == this._prevTileItems[i])
                                        this._prevTileItems.splice(i, 1);
                                }
                            }
                            else currentItem.click();
                        }
                    }
                }
            }
        },

        _popupClick: function () {
            var $selElement = this._customPop.find(".e-rowselect");
            if ($selElement.hasClass("e-spanclicked")) {
                this._hidePopup();
            }
            else {
                $selElement.addClass("e-spanclicked");
            }
        },

        _hidePopup: function () {
            if (this._customPop != null && this._customPop.is(":visible")) {
                this._customPop.find(".e-rowselect").removeClass("e-spanclicked");
                this._customPop.hide();
            }
        },

        _ensureResolution: function() {
            this._isMobileOrTab = $(window).width() <= 750 ? true : false;
            if (this._isMobileOrTab) {
                this.element.addClass("e-fe-mobile");
                this._toolBarObj && this._toolBarObj._liTemplte.css("max-width", this.element.width());
            }
            else {
                this.element.removeClass("e-fe-mobile");
                if (this._splitObj && this.model.showNavigationPane && this._splitObj.element.find(".e-cont1").hasClass("collapsed")) {
                    this.model.enableRTL ? this._splitObj.expand(1) : this._splitObj.expand(0);
                }
            }
            this._toolBarObj && this._toolBarObj.option("cssClass", this.model.cssClass + " e-fe-toolbar " + (this._isMobileOrTab ? "e-fe-mobile" : ""));
            ($(window).width() <= 350 || this.element.width() <= 350) ? this.element.addClass("e-fe-small") : this.element.removeClass("e-fe-small");
            ($(window).width() <= 295 || this.element.width() <= 295) ? this.element.addClass("e-fe-short") : this.element.removeClass("e-fe-short");
        },

        _showHideNavigation: function (event) {
            if (this._splitObj.element.find(".e-cont1").hasClass("collapsed")) {
                if (this.model.enableRTL)
                    this._splitObj.collapse(0)
                else
                    this._splitObj.collapse(1);
            }
            else {
                if(this.model.enableRTL)
                    this._splitObj.expand(0)
                else
                    this._splitObj.expand(1);
            }
        },

        _renderSplitIcon: function () {
            if (!this.model.showNavigationPane) return;
            this._splitIcon = ej.buildTag('div.e-fe-split-icon');
            this._splitIcon.append("<span class='e-icon e-arrow-sans-left'></span>");
            this._splitObj.element.find(".e-splitbar").append(this._splitIcon);
            this._on(this._splitIcon, "touchend click", this._showHideNavigation);
            if (this._isMobileOrTab && this._splitObj && this.model.showNavigationPane) {
                this.model.enableRTL ? this._splitObj.collapse(1) : this._splitObj.collapse(0);
            }
        },

        _checkDevice: function () {
            return (ej.isDevice() && ej.isTouchDevice());
        },

        _initContextMenuOptions: function (menu) {
            var menuOptions = [], items = this.model.contextMenuSettings.items[menu], customFields = this.model.contextMenuSettings.customMenuFields;
            for (var i = 0; i < items.length; i++) {
                if (items[i] != "|")
                {
                    var ele = this._getCustomItem(customFields, items[i]);
                    var attr = (items[i + 1] == "|") ? "e-fe-separator" : null;
                    this._addMenuItem(ele, items[i], attr, menuOptions, menu);
                    if (ele && ele.hasOwnProperty('child'))
                        this._getChildItems(ele['child'], menuOptions, menu, ele.id);
                }                
           }
           return menuOptions;  
        },

        _addMenuItem: function (ele, item, attr, menuOptions, menu, parentId) {
            var text = this._extendAttr(ele, "text");
            this["_menu" + item] = text ? text : this._getLocalizedLabels("ContextMenu" + item);
            var htmlAttr = this._extendAttr(ele, "htmlAttributes", attr);
            var css = this._extendAttr(ele, "spriteCssClass", "e-fileexplorer-toolbar-icon " + item);
            menuOptions.push({ id: ej.isNullOrUndefined(ele) ? (this._ExplorerId + "_" + menu + "_" + item) : item, text: this["_menu" + item], parentId: parentId, sprite: css, htmlAttr: htmlAttr });
        },

        _getChildItems: function (items, menuOptions, menu, parentId) {
            for (var i = 0, len = items.length; i < len && !ej.isNullOrUndefined(items[i]); i++) {
                var ele = items[i];
                this._addMenuItem(ele, items[i].id, null, menuOptions, menu, parentId);
                if (ele && ele.hasOwnProperty('child'))
                    this._getChildItems(ele['child'], menuOptions, menu, ele.id);
            }
        },

        _getCustomItem: function (items, id) {
            var ele;
            for (var i = 0, len = items.length; i < len && !ej.isNullOrUndefined(items[i]); i++) {
                if (items[i]["id"] == id) {
                    ele = items[i];
                    break;
                }
                if (items[i].hasOwnProperty('child')) {
                    ele = this._getCustomItem(items[i]['child'], id);
                    break;
                }
            }
            return ele;
        },

        _extendAttr: function (ele, attr, value) {
            if (!value)
                return ele ? (ele[attr] ? ele[attr] : null) : null;
            if (attr == "htmlAttributes")
                return { "class": (ele ? (ele[attr] ? (ele[attr]["class"] ? (ele[attr]["class"] + " " + value) : value) : value) : value) };
            else
                return ele ? (ele[attr] ? (ele[attr] + " " + value) : value) : value;
        },

        _render: function () {
            this._selectedTreeFolder = this.model.selectedFolder;
            this._selectedNodes = this.model.selectedItems;
            this.element.addClass('e-widget e-box').attr({ role: "fileexplorer", tabindex: 0 });
            this.model.showToolbar && this._renderToolBar();
            this._createSplitPane();
            this._read();
            this._roundedCorner(this.model.showRoundedCorner);
            this._isIE8 = (ej.browserInfo().name == 'msie' && ej.browserInfo().version == '8.0') ? true : false
            if (this._isIE8) this.element.addClass("e-ie8");
        },
        _read: function () {
            var proxy = this;
            var _ajaxOptions = {
                data: { ActionType: "Read", Path: this._currentPath, ExtensionsAllow: this.model.fileTypes, SelectedItems: this._getSelectedItemDetails(this._getFolderPath(), this._selectedContent) },
                url: this.model.ajaxAction,
                type: "POST",
                async: false,
                success: function (result) {
                    if (result === undefined || result === null) return;
                    if (result.hasOwnProperty("d"))
                        result = result.d;
                    if (!ej.isNullOrUndefined(result.error)) {
                        proxy._showErrorDialog(result.error);
                        return;
                    }
                    proxy._feParent[proxy._currentPath] = result.cwd;
                    proxy._readSuccess(result.files);
                    proxy._enablePostInit && proxy._postInit();
                },
                successAfter: this.model.ajaxSettings.read.success
            };
            this.model.ajaxSettings.read.success = undefined;
            $.extend(true, _ajaxOptions, this.model.ajaxSettings.read);
            this._sendAjaxRequest(_ajaxOptions);
        },

        _sendAjaxRequest: function (ajaxOptions, hideWaitingState) {
            if (!ajaxOptions.dataType && this.model.ajaxDataType)
                ajaxOptions.dataType = this.model.ajaxDataType;
            if (this.model.ajaxAction == "" || this._currentPath == "")
                return;
            if (ajaxOptions.data.ActionType != "Read")
                this._selectedItemDetails = ajaxOptions.data.SelectedItems;
            var defaultData = { Name: "", ActionType: "", Path: "", ExtensionsAllow: "", LocationFrom: "", LocationTo: "", Action: "", NewName: "", Names:[], CaseSensitive: false, SearchString: "", FileUpload: null, CommonFiles: null };
            if (!hideWaitingState) {
                this._waitingPopup.show();
            }
            $.extend(true, defaultData, ajaxOptions.data);
            var args = { data: defaultData, ajaxSettings: ajaxOptions };
            var proxy = this;
            if (args.data.ActionType == "Paste") {
                args.data.LocationFrom = this._pathCorrection(args.data.LocationFrom);
                args.data.LocationTo  = this._pathCorrection(args.data.LocationTo);
            }
            else {
                args.data.Path = this._pathCorrection(args.data.Path);
            }
            if (this._trigger("beforeAjaxRequest", args))
                return;
            ajaxOptions = args.ajaxSettings;
            $.ajax({
                data: (((ajaxOptions.dataType && ajaxOptions.dataType.toLowerCase() == "jsonp") || ajaxOptions.contentType == "application/x-www-form-urlencoded") ? { json: JSON.stringify(args.data) } : JSON.stringify(args.data)),
                url: ajaxOptions.url,
                type:((ajaxOptions.dataType && ajaxOptions.dataType.toLowerCase() == "jsonp") ?  "GET" : ajaxOptions.type),
                async: ajaxOptions.async,
                success: function(args) {
                    proxy._waitingPopup.hide();
                    ajaxOptions.success.call(this, args);
                    if(typeof ajaxOptions.successAfter == "function")
                        ajaxOptions.successAfter.apply(this, arguments);
                },
                contentType: (ajaxOptions.contentType ? ajaxOptions.contentType : "application/json"),
                dataType: ajaxOptions.dataType,
                jsonpCallback: ajaxOptions.jsonpCallback ? ajaxOptions.jsonpCallback : ((ajaxOptions.dataType && ajaxOptions.dataType.toLowerCase() == "jsonp") ? "MyCallbackFunction" : ""),
                error: ajaxOptions.error ? ajaxOptions.error : function (xhr, textStatus, errorThrown) {
                    proxy._waitingPopup.hide();
                    var text = xhr.responseJSON ? xhr.responseJSON.ExceptionType + ", " + xhr.responseJSON.ExceptionMessage : xhr.statusText;
                    proxy._alertDialog = proxy._createDialog(ej.buildTag('div.e-fe-dialog-label', text), { width: 400, height: "auto", title: proxy._getLocalizedLabels("Error") });
                    proxy._alertDialogObj = proxy._alertDialog.data("ejDialog");
                },
                beforeSend: ajaxOptions.beforeSend,
                complete: function () {
                    proxy._waitingPopup.hide();
                    ajaxOptions.complete;
                }
            });

        },

        _pathCorrection: function(path){
            if(this.model.path == "/") {
                if (path.indexOf(":") >= 0) {
                    path = path.replace("//", "");
                }
                else if(path != "/") {
                    path = path.replace("/", "");
                }
            }
            return path;
        },

        _onBeforeOpen: function () {
            var fileUrl, selectedNodes = [], args;
            fileUrl = this._nodeType == "File" ? this._currentPath.replace("~", "..") + this._selectedFile : this._currentPath;
            if (this._selectedFile)
                selectedNodes = this._getSelectedItemDetails(this._currentPath, this._selectedFile);
            else if (this._selectedContent)
                selectedNodes = this._getSelectedItemDetails(this._getFolderPath(), this._selectedContent);
            args = { path: fileUrl, itemType: this._nodeType, selectedItems: selectedNodes };
            return this._trigger("beforeOpen", args);
        },

        _readSuccess: function (result) {
            if (result === undefined || result === null) return;
            this._update = false;
            for (var i = 0; i < result.length; i++) {
                result[i].sizeInByte = result[i].size;
                result[i].size = result[i].isFile ? this._bytesToSize(result[i].size) : "";
                result[i].cssClass = this._getCssClass(result[i]);
            }
            var sortingoption = this.model.gridSettings.columns[0];
            var sortingtype = true;
            var initialsort = true;
            this._changeActiveSortedoption(sortingoption.headerText,initialsort);
            this._sorting(sortingoption.field, sortingtype, result);
            this._fileExplorer[this._currentPath] = result;
            this._itemStatus && this._itemStatus.html(this._sorteditems.length + " " + (this._sorteditems.length == 1 ? this._getLocalizedLabels("Item") : this._getLocalizedLabels("Items")));
            if (!this._treetag.hasClass("e-treeview")) {
                this._renderTreeView(this._sorteditems);
                this._updateOnNodeSelection = true;
            }
            this.model.layout == "grid" ? this._renderGridView(this._sorteditems) : this._renderTileView(this._sorteditems);
            this._usePreviousValues();
        },
        _getCssClass: function (list) {
            var extension = list.name.substr(list.name.lastIndexOf('.') + 1).toLowerCase();
            if (list.isFile) {
                if ((/\.(bmp|dib|jpg|jpeg|jpe|jfif|gif|tif|tiff|png|ico)$/i).test(list.name))
                    return 'e-fe-images';
                else if ((/\.(mp3|wav|aac|ogg|wma|aif|fla|m4a)$/i).test(list.name))
                    return 'e-fe-audio';
                else if ((/\.(webm|mkv|flv|vob|ogv|ogg|avi|wmv|mp4|3gp)$/i).test(list.name))
                    return 'e-fe-video';
                else if (!(/\.(css|exe|html|js|msi|pdf|pptx|ppt|rar|zip|txt|docx|doc|xlsx|xls|xml|rtf|php)$/i).test(list.name))
                    return 'e-fe-unknown e-fe-' + extension;
                else
                    return 'e-fe-' + extension;
            }
            else
                return (list.permission && !list.permission.Read) ? 'e-fe-folder e-fe-lock' : 'e-fe-folder';
        },
        _bytesToSize: function (bytes) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return '0 Byte';
            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            var value = (bytes / Math.pow(1024, i));
            return value.toFixed(2) + ' ' + sizes[i];
        },

        _setPath: function (path) {
            this.model.path = path;
            this._treetag.remove();
            this._treetag = ej.buildTag('div#' + this._ExplorerId + '_treeView');
            this._splittag.find(".e-cont1 > .e-tree-wrapper").append(this._treetag);
            this._fileExplorer = this._updateImages= {};             
            this._selectedStates = [];
            this._selectedItems = [];
            this._selectedTileItems = [];
            this._initUpdate = false;
            this._initPath = "";
            this._currentPath = this.model.path.replace(/\\/g, "/");
            this._originalPath = this._rootPath = this._currentPath = this._currentPath.endsWith("/") ? this._currentPath : this._currentPath + "/";
            this._read();            
        },

        _getPath: function () {
            return this.model.path;
        },
        _changeSkin: function (value) {
            this.element.removeClass(this._customCssClass).addClass(value);
            this._customCssClass = value;
            this._waitingPopup.option("cssClass", value);
            this._subControlsSetModel("cssClass", value);
        },
        _draggableOption: function (action) {
            this._treeDragEvents(action);
            this._tileDragEvents(action);
            this._gridDragEvents(action);
            if (action=="_off") this._previousPath = null;
            this._statusbar && this[action](this._statusbar, "dragover", this._preventDropOption);
            this._toolBarItems && this[action](this._toolBarItems, "dragover", this._preventDropOption);
        },
        _swapWith : function(from, to) {
            from = $(from); to = $(to);
            var tmp = $('<span>').hide();
            from.before(tmp);
            to.before(from);
            tmp.replaceWith(to);
        },
        _enableRTL: function (value) {
		    var element1 = this._splittag.find(".e-cont1");
            var element2 = this._splittag.find(".e-cont2");            
            this.model.enableRTL = value;
            if (value) {
			    element1.index() < element2.index() && this._swapWith(element1, element2);
			    var gridColumnSettings = JSON.parse(JSON.stringify(this.model.gridSettings.columns));
			    if (!this._oldFormat)
                    this._oldFormat = JSON.parse(JSON.stringify(gridColumnSettings));
                for (var i = 0; i < gridColumnSettings.length; i++) {
                    gridColumnSettings[i].textAlign = gridColumnSettings[i].headerTextAlign = "right";
                }
                this._gridObj && this._gridObj.columns(gridColumnSettings);                                   
                this.element.addClass("e-rtl");
                this.element.find(".e-scroller").addClass("e-rtl");
            }
            else {
                element1.index() > element2.index() && this._swapWith(element2, element1);                                
                if (this._gridObj && this._oldFormat) {
                    for (var i = 0; i < this._oldFormat.length; i++) {
                        if (!this._oldFormat[i].textAlign)
                            this._oldFormat[i].textAlign = "left";
                        if (!this._oldFormat[i].headerTextAlign)
                            this._oldFormat[i].headerTextAlign = "left";
                    }
                    this._gridObj.columns(this._oldFormat);
                }
                if (this._oldFormat) {
                    this.model.gridSettings.columns = JSON.parse(JSON.stringify(this._oldFormat));
                    this._oldFormat = null;
                }
                this.element.removeClass("e-rtl");
                this.element.find(".e-scroller").removeClass("e-rtl");
                (this._gridtag) && this._gridtag.removeClass('e-rtl');
            }
            this._splitterCorrection();
            this._subControlsSetModel("enableRTL", value);
        },
        _roundedCorner: function (value) {
            var operation = value ? "addClass" : "removeClass";
            this.element[operation]('e-corner-all');
            this._treeContextMenutag && this._treeContextMenutag[operation]("e-corner");
            this._tileContextMenutag && this._tileContextMenutag[operation]("e-corner");
            this._subControlsSetModel("showRoundedCorner", value);
        },
        _destroy: function () {
            this._toolBarObj && this._toolBarObj.destroy();
            this._treeContextMenutag && this._treeContextMenutag.parent().remove();
            this._tileContextMenutag && this._tileContextMenutag.parent().remove();
            if (this._newFolderDialogObj && this._newFolderDialogObj.isOpen()) this._removeDialog(this._newFolderDialogObj);
            if (this._renameDialogObj && this._renameDialogObj.isOpen()) this._removeDialog(this._renameDialogObj);
            if (this._openDialogObj && this._openDialogObj.isOpen()) this._removeDialog(this._openDialogObj);
            if (this._detailsDialogObj && this._detailsDialogObj.isOpen()) this._removeDialog(this._detailsDialogObj);
            if (this._alertDialogObj && this._alertDialogObj.isOpen()) this._removeDialog(this._alertDialogObj);
            if (this._alertWindowObj && this._alertWindowObj.isOpen()) this._removeDialog(this._alertWindowObj);
            if (this._splitButtonObj) this._splitButtonObj.destroy();
            if (this._splitButtonObj1) this._splitButtonObj1.destroy();
            this._waitingPopup && this._waitingPopup.destroy();
            this._gridObj && this._gridObj.element.ejWaitingPopup("destroy");
            this._unwireEvents();
            this.element.html("")
            
            $(this._cloneElement).attr("style") ? this.element.attr("style", $(this._cloneElement).attr("style")) : this.element.removeAttr("style");
            this.element.removeClass('e-widget e-box e-rtl e-ie8');      
            this.element.removeAttr('role');
            delete this._prevsortingoption, this._prevsorting;
        },
        _createFolder: function (_name) {
            var proxy = this;
            var _ajaxOptions = {
                data: { ActionType: "CreateFolder", Name: _name, Path: this._originalPath, SelectedItems: this._getSelectedItemDetails(this._getFolderPath(this._originalPath), this._treeObj.getText(this._selectedNode)) },
                url: this.model.ajaxAction,
                type: "POST",
                success: function (result) {
                    if (result === undefined || result === null) return;
                    if (result.hasOwnProperty("d"))
                        result = result.d;
                    if (!ej.isNullOrUndefined(result.error)) {
                        proxy._showErrorDialog(result.error);
                        return;
                    }
                    var selectedNode = proxy._selectedNode;
                    var nodeObj = [{ id: result.files[0].name, name: result.files[0].name, spriteCssClass: (result.files[0].permission && !result.files[0].permission.Read) ? "e-fe-icon e-fe-folder e-fe-lock" : "e-fe-icon e-fe-folder", hasChild: false }];
                    if (!proxy._treetag.ejTreeView("isExpanded", selectedNode))
                        proxy._treeObj && proxy._treeObj.expandNode(selectedNode);
                    proxy._nodeExpanded = true;
                    proxy._treeObj.addNode(nodeObj, selectedNode);
                    proxy._nodeExpanded = false;
                    proxy._update = true;
                    proxy._treeObj.selectNode(selectedNode);
                    proxy._refreshTreeScroller();
                    proxy._treetag.find("li").removeAttr("tabindex");
                    var items = proxy._treetag.find("li div a").not(".e-js");
                    if (proxy.model.allowDragAndDrop && items.length) {
                         proxy._drag(items);
                         items.addClass("e-file-draggable");
                    }
                    var args = { data: result, selectedItems: proxy._selectedItemDetails };
                    proxy._trigger("createFolder", args);
                    proxy._setSelectedItems([result.files[0].name]);
                },
                successAfter: this.model.ajaxSettings.createFolder.success
            };
            this.model.ajaxSettings.createFolder.success = undefined;
            $.extend(true, _ajaxOptions, this.model.ajaxSettings.createFolder);
            this._sendAjaxRequest(_ajaxOptions);
        },
        _needToScroll: function (element, area) {
            var wrapperHeight, nodeHeight = area=="Tree" ? element.find("a").eq(0).outerHeight() :(element.outerHeight() + ((this.model.layout== "grid") ? 0 : 10));
            var elementHeight = 0;
            elementHeight += element.position().top + nodeHeight;
            if (area == "Tree") {
                while (element.parent().hasClass("e-treeview-ul")) {
                    element = element.parent();
                    elementHeight += element.position().top;
                }
                wrapperHeight = this._splittag.find(".e-cont1").height();
            } else {
                if (this.model.layout == ej.FileExplorer.layoutType.Grid) {
                    wrapperHeight = this._gridtag.find(".e-gridcontent").height();
                    elementHeight = elementHeight - this._gridtag.find(".e-gridheader").outerHeight();
                }
                else {
                    wrapperHeight = this._tileViewWrapper.height();
                }
            }
            var scrollableElement = element.closest(".e-scroller .e-content", ".e-fileexplorer");
            if (wrapperHeight < elementHeight) {
                scrollableElement.animate({
                    scrollTop: scrollableElement.scrollTop() + (nodeHeight *2)
                }, 500, 'linear');
            } else if (elementHeight < element.outerHeight()) {
                scrollableElement.animate({
                    scrollTop: scrollableElement.scrollTop() - (nodeHeight * 2)
                }, 500, 'linear');
            }
        },
        
        _cut_copy: function (maintainSourceNode) {
            var proxy = this;
            if (this._sourcePath == this._currentPath && this._option == "move") {
                this.element.find(".e-blur").removeClass("e-blur");
                this.model.layout!= "grid" && this._clearTileCheckBoxSelection();
                this._setSelectedItems(this._fileName);
                if (maintainSourceNode)
                    this._activeSource = this.model.selectedItems;
                return;
            }
            var data = this._fileExplorer[this._currentPath], _selectedFiles = (typeof this._copiedNodes == "string") ? [this._copiedNodes] : this._copiedNodes;
            this._pastedFiles = _selectedFiles.slice();
            for (var i = 0; i < _selectedFiles.length; i++) {
                if (!this._isNameExist(this._suggestionItems.length ? this._suggestionItems : this._fileExplorer[this._sourcePath], _selectedFiles[i]))
                    return;
            }
            var previousPath = proxy._currentPath;
            var successCallback = function () {
                proxy._currentPath = previousPath;
                if (ej.isNullOrUndefined(data))
                    data = proxy._fileExplorer[previousPath];
                proxy._existingItems = [];
                if (proxy._sourcePath != previousPath && data.length) {
                    proxy._getDuplicateItems(proxy._sourcePath, previousPath, (typeof proxy._fileName == "string" ? [proxy._fileName] : proxy._fileName));
                    if (proxy._existingItems.length) {
                        proxy._createReplaceConformationDiaolg("_pasteOperation", "PasteReplaceAlert");
                    }
                    else
                        proxy._pasteOperation();
                }
                else {
                    for (var i = 0; i < _selectedFiles.length; i++) {
                        proxy._pastedFiles[i] = proxy._getDuplicateName(proxy._fileExplorer[previousPath], _selectedFiles[i]);
                    }
                    proxy._pasteOperation();
                }
            };
            if (ej.isNullOrUndefined(data)) {
                this._getFileDetails(this._currentPath, "", "", successCallback);
            }
            else {
                successCallback();
            }
        },
        _createReplaceConformationDiaolg: function (executableFunction, alert,e) {
            var proxy = this,title;
            var i = 0;
            if ((alert == "PasteReplaceAlert" || alert == "UploadReplaceAlert") && this._getLocalizedLabels("ReplaceAlert") != "ReplaceAlert") {
                alert = "ReplaceAlert";
            }
            else
                title = executableFunction == "_customUpload" ? "UploadError" : executableFunction == "pasteOperation" ? "PasteError" : executableFunction == "_rename" ? "RenameError" : "Error";
            if (this.model.rootFolderName.length > 0)
                var viewerData = String.format(this._getLocalizedLabels(alert), this._changeName(this._existingItems[i].Path), false);
            else
                var viewerData = String.format(this._getLocalizedLabels(alert), this._existingItems[i].Path);
            var dialogContent = ej.buildTag('div.e-get-name');
            var labeltag = ej.buildTag('div.e-fe-dialog-label', viewerData);
            var divtag = ej.buildTag('div.e-fe-dialog-btn e-replace');
            var yesButton = ej.buildTag('button.e-fe-btn-yes ', this._getLocalizedLabels("YesButton"));
            var yesToAllButton = ej.buildTag('button.e-fe-btn-yes e-all ', this._getLocalizedLabels("YesToAllButton"));
            var noButton = ej.buildTag('button.e-fe-btn-no ', this._getLocalizedLabels("NoButton"));
            var noToAllButton = ej.buildTag('button.e-fe-btn-no e-all ', this._getLocalizedLabels("NoToAllButton"));
            yesButton.ejButton({
                type: "button",
                cssClass: "e-flat",
                click: function () {
                    if ((/\.(gif|jpg|jpeg|tiff|png|bmp)$/i).test(proxy._existingItems[i].Name))
                        proxy._updateImages[proxy._existingItems[i].Path] = new Date().getTime();
                    proxy._existingItems[i].IsReplace = true;
                    i++;
                    if (i < proxy._existingItems.length)
                        proxy._alertDialog.find(".e-fe-dialog-label").text(String.format(proxy._getLocalizedLabels(alert), proxy._existingItems[i].Path));
                    else
                        proxy._destroyReplaceConformationDiaolg(executableFunction);
                    if (e)
                    proxy._trigger("beforeUploadDialogOpen", e);
                }
            });
            noButton.ejButton({
                type: "button",
                cssClass: "e-flat",
                click: function () {
                    proxy._existingItems[i].IsReplace = false;
                    i++;
                    if (i < proxy._existingItems.length)
                        proxy._alertDialog.find(".e-fe-dialog-label").text(String.format(proxy._getLocalizedLabels(alert), proxy._existingItems[i].Path));
                    else
                        proxy._destroyReplaceConformationDiaolg(executableFunction);
                }
            });
            yesToAllButton.ejButton({
                type: "button",
                cssClass: "e-flat",
                click: function () {
                    for (var j = i; j < proxy._existingItems.length; j++) {
                        if ((/\.(gif|jpg|jpeg|tiff|png|bmp)$/i).test(proxy._existingItems[j].Name))
                            proxy._updateImages[proxy._existingItems[j].Path] = new Date().getTime();
                        proxy._existingItems[j].IsReplace = true;
                    }
                    proxy._destroyReplaceConformationDiaolg(executableFunction);
                    if (e)
                    proxy._trigger("beforeUploadDialogOpen", e);
                }
            });
            noToAllButton.ejButton({
                cssClass: "e-flat",
                type: "button",
                click: function () {
                    for (var j = i; j < proxy._existingItems.length; j++) {
                        proxy._existingItems[j].IsReplace = false;
                    }
                    proxy._destroyReplaceConformationDiaolg(executableFunction);
                }
            });
            divtag.append(yesButton, yesToAllButton, noButton, noToAllButton);
            $(dialogContent).append(labeltag, divtag);
            var open = function () {
                yesButton.focus();
            };
            this._alertDialog = this._createDialog(dialogContent, { width: 500, height: "auto", title: this._getLocalizedLabels(title), open: open });
            this._alertDialogObj = this._alertDialog.data("ejDialog");
        },
        _destroyReplaceConformationDiaolg: function (executableFunction) {
            this._removeDialog(this._alertDialogObj);
            this[executableFunction]();
        },
        _pasteOperation: function () {
            this._removeBlurEffect();
            var proxy = this;
            var itemIndex = -1;
            if (typeof this._fileName == "string")
                this._fileName = [this._fileName];
            for (var i = 0; i < this._fileName.length; i++) {
                var tempPath = this._sourcePath + this._fileName[i] + "/";
                if (this._currentPath.indexOf(tempPath) >= 0 ) {
                    itemIndex = i;
                    break;
                }
            }
            if (itemIndex != -1) {
                var viewerData = this._getLocalizedLabels("CancelPasteAction");
                var dialogContent = ej.buildTag('div');
                var labeltag = ej.buildTag('div.e-fe-dialog-label', viewerData);
                var divtag = ej.buildTag('div.e-fe-dialog-centerbtn');
                var cancelButton = ej.buildTag('button.e-fe-btn-cancel ', this._getLocalizedLabels("CancelButton"));
                cancelButton.ejButton({
                    cssClass: "e-flat",
                    type: "button",
                    click: function () {
                        proxy._removeDialog(proxy._alertDialogObj);
                    }
                });
                var skipButton = ej.buildTag('button.e-fe-btn-skip ', this._getLocalizedLabels("SkipButton"));
                skipButton.ejButton({
                    cssClass: "e-flat",
                    type: "button",
                    click: function () {
                        proxy._fileName.splice(itemIndex, 1);
                        proxy._removeDialog(proxy._alertDialogObj);
                        proxy._performPasteOperation();
                    }
                });
                divtag.append(skipButton, cancelButton);
                $(dialogContent).append(labeltag, divtag);
                var open = function () {
                    cancelButton.focus();
                };
                this._alertDialog = this._createDialog(dialogContent, { width: 400, height: "auto", title: this._getLocalizedLabels("Error"), open: open });
                this._alertDialogObj = this._alertDialog.data("ejDialog");
            }
            else
                this._performPasteOperation();
        },
        _performPasteOperation: function () {
            var proxy = this;
            var nodes = this._currentPath.split('/')
            var _ajaxOptions = {
                data: { ActionType: "Paste", LocationFrom: this._sourcePath, LocationTo: this._currentPath, Names: (typeof this._fileName == "string") ? [this._fileName] : this._fileName, Action: this._option, CommonFiles: this._existingItems, SelectedItems: this._getSelectedItemDetails(this._sourcePath, this._fileName), TargetFolder: this._getSelectedItemDetails(this._getFolderPath(), nodes[nodes.length - 2]) },
                url: this.model.ajaxAction,
                type: "POST",
                success: function (result) {
                    if (!ej.isNullOrUndefined(result)) {
                        if (result.hasOwnProperty("d"))
                            result = result.d;
                        if (!ej.isNullOrUndefined(result.error)) {
                            proxy._showErrorDialog(result.error);
                            return;
                        }
                    }
                    if (typeof proxy._fileName == "string")
                        proxy._fileName = [proxy._fileName];
                    for (var i = 0; i < proxy._pastedFiles.length; i++) {
                        if ((/\.(bmp|dib|jpg|jpeg|jpe|jfif|gif|tif|tiff|png|ico)$/i).test(proxy._pastedFiles[i]))
                            proxy._updateImages[proxy._currentPath + proxy._pastedFiles[i]] = new Date().getTime();
                    }
                    proxy._existingItems && proxy._existingItems.filter(function (item) {
                        if (item.IsReplace == false)
                        {
                            var index = $.inArray(item.Name, proxy._pastedFiles);
                            if (index > -1)
                                proxy._pastedFiles.splice(index, 1);
                        }
                    })
                    proxy._existingItems = [];
                    var oldPath = proxy._originalPath;
                    var oldNode = proxy._selectedNode;
                    if (proxy._option == "move") {
                        for (var i = 0; i < proxy._fileName.length; i++) {
                            proxy._modifySelectedStates(proxy._sourcePath + proxy._fileName[i], "");
                        }
                        if (proxy._fileName.length > 0) {
                            if (proxy._fileName.length == 1)
                                proxy._sourceType == "Directory" && proxy._treeObj.removeNode(proxy._refreshNode);
                            else {
                                nodes = proxy._refreshNode.siblings();
                                proxy._sourceType == "Directory" && proxy._treeObj.removeNode(proxy._refreshNode);
                                for (var i = 0; i < proxy._fileName.length; i++) {
                                    for (var j = 0; j < nodes.length; j++) {
                                        if (proxy._fileName[i] == $(nodes[j]).text())
                                            proxy._treeObj.removeNode(nodes[j]);
                                    }
                                }
                            }
                        }
                    }
                    $.each(proxy._fileExplorer, function (path, value) {
                        //display the key and value pair
                        if (path.startsWith(oldPath))
                            proxy._fileExplorer[path] = "";
                    });
                    proxy._currentPath = proxy._originalPath;
                    proxy._highlightedNodes = proxy._pastedFiles;
                    if (proxy._option == "move") {
                        proxy._refreshItems(oldNode, oldPath,
                        function () {
                            proxy._fileExplorer[proxy._sourcePath] = "";
                            proxy._getFileDetails(proxy._sourcePath);
                        });
                    }
                    else{
                        proxy._refreshItems(oldNode, oldPath);
                    }
                    var folderPath = proxy._getFolderPath();
                    if (proxy._option == "move") {
                        proxy._fileName = "";
                        proxy._option = null;
                        proxy._toolBarItems && proxy._toolBarItems.ejToolbar("disableItemByID", proxy._ExplorerId + "Paste");
                        if (proxy.model.showContextMenu) {
                            proxy._viewMenuObj.disableItem(proxy._menuPaste);
                            proxy._treeMenuObj.disableItem(proxy._menuPaste);
                        }
                        }
                        var args = { name: proxy._fileName, targetPath: proxy.model.path, selectedItems: proxy._selectedItemDetails, targetFolder: proxy._getSelectedItemDetails(folderPath, proxy._selectedContent) };
                        proxy._trigger("paste", args);
                    },
                    successAfter: this.model.ajaxSettings.paste.success
                };
                this.model.ajaxSettings.paste.success = undefined;
                $.extend(true, _ajaxOptions, this.model.ajaxSettings.paste);
                this._sendAjaxRequest(_ajaxOptions);
        },
        _deletion: function (names, path) {
            var proxy = this;
            var selectedNode = this._treeObj.getSelectedNode();
            if (!this._treeObj.isExpanded(selectedNode))
                this._treeObj && this._treeObj.expandNode(selectedNode);
            var _ajaxOptions = {
                data: { ActionType: "Remove", Names: (typeof names=="string")? [names]: names , Path: path, SelectedItems: this._getSelectedItemDetails(path, names) },
                traditional: true,
                url: this.model.ajaxAction,
                type: "POST",
                success: function (result) {
                    if (!ej.isNullOrUndefined(result)) {
                        if (result.hasOwnProperty("d"))
                            result = result.d;
                        if (!ej.isNullOrUndefined(result.error)) {
                            proxy._showErrorDialog(result.error);
                            return;
                        }
                    }
                    proxy._selectedItemsTag && proxy._selectedItemsTag.html("");
                    proxy._fileExplorer[proxy._ajax_folderPath] = "";
                    $.each(proxy._fileExplorer, function (path, value) {
                        //display the key and value pair
                        if (path.startsWith(proxy._ajax_folderPath))
                            proxy._fileExplorer[path] = "";
                    });
                    for (var i = 0; i < _ajaxOptions.data.SelectedItems.length; i++) {
                        _ajaxOptions.data.SelectedItems[i].isFile == false && proxy._modifySelectedStates(path + _ajaxOptions.data.SelectedItems[i].name, "");
                    }                    
                    proxy._currentPath = proxy._ajax_folderPath;
                    var node = (proxy._selectedContent == proxy._selectedTreeText) ? proxy._parentNode : proxy._selectedNode;
                    proxy._refreshItems(node, proxy._ajax_folderPath);
                    if (proxy._treeObj.getSelectedNode().length == 0)
                        proxy._treeObj.selectNode(proxy._parentNode);
                    else  (proxy.model.layout == "grid") ? proxy._gridtag.find(".e-gridcontent").click() : proxy._tileViewWrapper.click();
                    var args = { data: result, path: proxy._ajax_folderPath, name: names, selectedItems: proxy._selectedItemDetails };
                    proxy._trigger("remove", args);
                },
                successAfter: this.model.ajaxSettings.remove.success
            };
            this.model.ajaxSettings.remove.success = undefined;
            $.extend(true, _ajaxOptions, this.model.ajaxSettings.remove);
            this._sendAjaxRequest(_ajaxOptions);
        },
        _rename: function () {
            var proxy = this;
            var _ajaxOptions = {
                data: { ActionType: "Rename", Path: proxy._currentPath, Name: proxy._selectedContent, NewName: proxy._ajax_person, CommonFiles: proxy._existingItems, SelectedItems: this._getSelectedItemDetails(proxy._currentPath, this._selectedContent) },
                url: this.model.ajaxAction,
                type: "POST",
                success: function (result) {
                    if (!ej.isNullOrUndefined(result)) {
                        if (result.hasOwnProperty("d"))
                            result = result.d;
                        if (!ej.isNullOrUndefined(result.error)) {
                            proxy._showErrorDialog(result.error);
                            return;
                        }
                    }
                    proxy._existingItems = [];
                    proxy._fileExplorer[proxy._currentPath] = "";
                    proxy._nodeType != "File" && proxy._modifySelectedStates(proxy._currentPath + proxy._selectedContent, proxy._currentPath + proxy._ajax_person);
                    if (proxy._splittag.find(".e-cont2 .e-active").length <= 0) {
                        $.each(proxy._fileExplorer, function (itemPath, value) {
                            if (itemPath.startsWith(proxy._currentPath + proxy._selectedContent + "/"))
                                proxy._fileExplorer[itemPath] = "";
                        });
                        proxy._selectedNode.find("> div > .e-text")[0].lastChild.nodeValue = proxy._selectedContent = proxy._ajax_person;
                        proxy._originalPath = proxy._currentPath += proxy._ajax_person + "/";
                        proxy._updateAddressBar();
                    }
                    else {
                        if (proxy.model.selectedItems.length > 0) {
                            proxy.model.selectedItems[proxy.model.selectedItems.length - 1] = proxy._getOriginalName(proxy._ajax_person);
                            proxy._selectedItems[0] = proxy._ajax_person;
                            proxy._highlightedNodes = proxy.model.selectedItems;
                            proxy._refreshItems(proxy._selectedNode, proxy._currentPath);
                        }
                        else
                            proxy._refreshItems(proxy._parentNode, proxy._currentPath);
                        if (proxy._treeObj.getSelectedNode().length == 0) {
                            $(proxy._parentNode).find('li a').each(function () {
                                if ($(this).text() == proxy._ajax_person) {
                                    proxy._treeObj.selectNode($(this).closest('li.e-item'));
                                    return false;
                                }
                            });
                        }
                    }
                },
                successAfter: this.model.ajaxSettings.rename.success
            };
            this.model.ajaxSettings.rename.success = undefined;
            $.extend(true, _ajaxOptions, this.model.ajaxSettings.rename);
            this._sendAjaxRequest(_ajaxOptions);
        },
        _downloadFile: function () {
            var selectedItems = this._getSelectedItemDetails(this._currentPath, this._selectedItems);
            var dataObj = {
                Path: this._pathCorrection(this._currentPath),
                ActionType: "Download",
                SelectedItems: JSON.stringify(selectedItems),
                Names: this._selectedItems
            };            
            var url = this.model.ajaxAction + "?" + ($.param(dataObj, true));            
            if (this.model.ajaxSettings.download.url) {
                if (this.model.ajaxSettings.download.url.indexOf("{") >= 0)
                    url = String.format(this.model.ajaxSettings.download.url, "?" + ($.param(dataObj, true)));
                else
                    url = this.model.ajaxSettings.download.url;
            }
            var args = { path: this._pathCorrection(this._currentPath), files: this._selectedItems, selectedItems: selectedItems, url: url };
            if (this._trigger("beforeDownload", args))
                return false;
            window.location = args.url;
        },
        _removeBlurEffect: function () {
            if (this._currntNode) {
                this._currntNode.hasClass("e-active") && this._currntNode.removeClass("e-blur");
                this._currntNode.find(".e-active").length && this._currntNode.find(".e-active").removeClass("e-blur");
            }
        },
        _renderTreeView: function (result) {
            var rootDIRID = 1, _hasChild = result.length > 0 ? true : false;
            this._collapse = false;
            var proxy = this;
            var nodes = this._currentPath.split("/");
            for (var i = 0; i < nodes.length - 2; i++) {
                this._initPath += nodes[i] + "/";
            }
            var startNode = nodes[nodes.length - 2];
            this._localData = [{ id: rootDIRID, name: (startNode ? startNode : this._currentPath), spriteCssClass: this._hasReadPermission(this._currentPath) ? "e-fe-icon e-fe-folder" : "e-fe-icon e-fe-folder e-fe-lock", hasChild: _hasChild }];
            this._treetag._collapse = false;
            this._treetag.ejTreeView(
               {
                   loadOnDemand: true,
                   cssClass: proxy.model.cssClass,
                   enableRTL: proxy.model.enableRTL,
                   allowKeyboardNavigation: proxy.model.allowKeyboardNavigation,
                   fields: { dataSource: proxy._localData, id: "id", parentId: "pid", text: "name", hasChild: "hasChild", spriteCssClass: "spriteCssClass" },
                   nodeCollapse: function (e) { proxy._refreshTreeScroller(e); },
                   nodeExpand: function (e) { proxy._refreshTreeScroller(e); },
                   nodeClick: function (e) { proxy._treenodeClicked(e); },
                   beforeExpand: function (e) { proxy._treeNodeBeforeExpand(e); },
                   nodeSelect: function (e) { proxy._updateTreePath(e); },
                   beforeCollapse: function (e) { proxy._onBeforeCollapse(e); },
                   beforeDelete: function (e) { proxy._treeBeforeDelete(e); },
               }
           );
            this._treeObj = this._treetag.data("ejTreeView");
            this._rootFolderName = this._treeObj.element.find('li:first > div > .e-text').text();
            this._changeRootFolderName();
            this._treeViewEvents("_off");
            this._treeViewEvents("_on");
            this._isClicked = false;
            this._treetag.ejTreeView("selectNode", $(this._treetag).find("li")[0]);
            this._isClicked = true;
            this._treeScroll = this._treetag.parent(".e-tree-wrapper").ejScroller({ height: this._splittag.height(), width: parseInt(this._splittag.find(".e-cont1").width()), buttonSize: 0, scrollerSize: this._scrollerSize, thumbStart: function (e) { proxy._onThumbStart(e); } }).data("ejScroller");
            this._addChild(result);
        },
        _treeViewEvents: function (action) {
            this[action](this._treetag, "focus", this._focusTreeView);
            this[action](this._treetag, "blur", this._blurTreeView);
            this.model.allowDragAndDrop && this._treeDragEvents(action);
        },
        _treeDragEvents: function (action) {
            var treeWraper = this._treetag.parent(".e-tree-wrapper");
            if (treeWraper) {
                this[action](treeWraper, "dragover", this._onDragOverHandler);
                this[action](treeWraper, "drop", this._onDropHandler);
                this[action](treeWraper, "dragleave", this._onDragLeave);
            }
        },
        _focusTreeView: function (e) {
            if (!this._treetag.hasClass("e-focus")) {
                this._treetag.addClass("e-focus");
                this._itemList = [];
                this._on(this._treetag, "keydown", this._OnKeyUp);
                this._hidePopup();
            }
        },
        _blurTreeView: function (e) {
            this._treetag.removeClass("e-focus");
            this._off(this._treetag, "keydown", this._OnKeyUp);
        },
        _treeBeforeDelete: function (args) {
            if (ej.isNullOrUndefined(args.event)) return;
            var code = this._getKeyCode(args.event);
            if (code == 46) // Prevent the treeview Delete action
                args.cancel = true;
        },
        _treeNodeBeforeExpand: function (args) {
            if (!this._nodeExpanded) {
                var path = this._updatePath(args.currentElement, args.value);
                !this._fileExplorer[path] && this._getFileDetails(path, args.currentElement);
                if (!this._treetag.ejTreeView("hasChildNode", args.currentElement)) {
                    this._fileExplorer[path] && this._addChild(this._fileExplorer[path], args.currentElement);
                }
            }
        },
        _treenodeClicked: function (args) {
            args.event.currentTarget && args.event.currentTarget.focus();
            if ($(args.currentElement).hasClass("e-text") && args.currentElement != this._selectedNode.find('> div > .e-text')[0]) {
                this._selectedContent = args.currentElement.text;
                this._selectedNode = $(args.currentElement).closest('li.e-item');
                var node = $(this._selectedNode.parents('li.e-item')[0]);
                this._parentNode = node.length != 0 ? node : this._selectedNode;
                this._nodeType = "Directory";
                this._isTreeNode = true;
            }
        },
        _showHideContextMenu: function () {
            if (this.model.showContextMenu) {
                var events = { beforeOpen: "", click: "" }, menuDetails = { id: "", targetId: "" };
                this._treeMenuOptions = this._initContextMenuOptions("navbar");
                menuDetails.id = this._ExplorerId + "_treeView";
                menuDetails.targetId = "#" + this._ExplorerId + "_treeView";
                events.beforeOpen = $.proxy(this._beforeOpenContextMenu, this);
                events.open = $.proxy(this._contextMenuOpen, this);
                events.close = $.proxy(this._onHideContextMenu, this);
                events.click = $.proxy(this._contextMenuClick, this);
                this._treeContextMenutag = this._createContextMenuTag(this._treeMenuOptions, menuDetails, events);
                this._treeMenuObj = this._treeContextMenutag.ejMenu('instance');
                this._cwdMenuOptions = this._initContextMenuOptions("cwd");
                this._addSortbyoptions();
                menuDetails.id = this._ExplorerId + "_tileView";
                menuDetails.targetId = "#" + this._ExplorerId + "_tileWrapper,#" + this._ExplorerId + "_grid";
                events.beforeOpen = $.proxy(this._beforeOpenTileContextMenu, this);
                events.open = $.proxy(this._contextMenuOpen, this);
                events.click = $.proxy(this._fileContextMenuClick, this);
                this._tileContextMenutag = this._createContextMenuTag(this._cwdMenuOptions, menuDetails, events);
                this._viewMenuObj = this._tileContextMenutag.ejMenu('instance');
                if (ej.isNullOrUndefined(this._fileName) || this._fileName == "") {
                    this._treeMenuObj.disableItem(this._menuPaste);                    
                }
                this._fileMenuOptions = this._initContextMenuOptions("files");                
            }
            else {
                if (this._treeContextMenutag && this._tileContextMenutag) {
                    this._treeMenuObj.destroy();
                    this._viewMenuObj.destroy();
                    $("#" + this._ExplorerId + "_treeViewContextMenu").remove();
                    $("#" + this._ExplorerId + "_tileViewContextMenu").remove();
                    this._viewMenuObj= this._treeMenuObj = null;                     
                }
            }
        },
        _addSortbyoptions: function () {
            var length = this.model.contextMenuSettings.items.cwd.length;
            var items = this.model.contextMenuSettings.items.cwd;
            if (items.indexOf('SortBy') > -1) {
                    var itemslength = this.model.gridSettings.columns.length;
                    for (var j = 0; j < itemslength; j++) {
                        var css = "e-fileexplorer-toolbar-icon " + this.model.gridSettings.columns[j].field;
                        this._cwdMenuOptions.push({ id: this._ExplorerId + "_cwd_" + this.model.gridSettings.columns[j].field, text: this.model.gridSettings.columns[j].headerText, parentId: this._ExplorerId + "_cwd_" + "SortBy", sprite: css});
                    }
                }
        },
        enableMenuItem: function (operation) {            
            operation = this._findCommand(operation, this.model.contextMenuSettings.items, true);
            for(var i=0; i < this._restrictedMenuOption.length; i++){
                if (this._restrictedMenuOption[i] == operation) {
                    this._restrictedMenuOption.splice(i, 1);
                    break;
                }                    
            }                        
            this._treeMenuObj && this._treeMenuObj.enableItem(operation);
            this._viewMenuObj && this._viewMenuObj.enableItem(operation);
        },
        disableMenuItem: function (operation) {
            operation = this._findCommand(operation, this.model.contextMenuSettings.items, true);
            if ($.inArray(operation, this._restrictedMenuOption) == -1)
                this._restrictedMenuOption.push(operation);
            this._treeMenuObj && this._treeMenuObj.disableItem(operation);
            this._viewMenuObj && this._viewMenuObj.disableItem(operation);
        },
        _renderGridView: function (result) {
            var columnSettings = JSON.parse(JSON.stringify(this.model.gridSettings.columns));
            var sortSettings = null;
            for (var i = 0; i < columnSettings.length; i++) {
                if (!columnSettings[i]["template"]) {
                    columnSettings[i]["template"] = "<script type='text/x-jsrender'><span title= '{{:" + columnSettings[i]["field"] + "}}'>{{:" + columnSettings[i]["field"] + "}}</span></script>";
                }
            }
            if (this._suggestionItems.length) 
                columnSettings.push({ field: "filterPath", headerText: this._getLocalizedLabels("Folder"), width: "20%" });
            columnSettings.unshift({ field: "cssClass", headerText: "", cssClass: "e-grid-image", width: 22, template: "<script type='text/x-jsrender'><span class='e-fe-icon {{:cssClass}}' unselectable='on'></span></script>", textAlign: ej.TextAlign.Center, allowResizing: false });
            if (this.model.showCheckbox)
                columnSettings.unshift({ field: "", headerText: "check", cssClass: "e-col-check", width: 22, template: "<script type='text/x-jsrender'><input type='checkbox' class='e-grid-row-checkbox'/></script>", textAlign: ej.TextAlign.Center, headerTextAlign: ej.TextAlign.Center, allowResizing: false, allowSorting: false });
            var proxy = this;
            var lastcolumn = columnSettings[columnSettings.length - 1];
            if (lastcolumn) {
                if (lastcolumn["customAttributes"]) {
                    if (lastcolumn["customAttributes"]["class"]) {
                        if (lastcolumn["customAttributes"]["class"].search("e-rowcell e-last-rowcell") == -1)
                            lastcolumn["customAttributes"]["class"] = lastcolumn["customAttributes"]["class"] + " e-rowcell e-last-rowcell";
                    }
                    else
                        lastcolumn["customAttributes"]["class"] = " e-rowcell e-last-rowcell";
                }
                else {
                    lastcolumn["customAttributes"] = { 'class': "e-rowcell e-last-rowcell" };
                }
            }
			if(this.model.virtualItemCount > 0){
				this._enableVirtualization = true;
				this._allowVirtualScrolling = true;
				this._virtualScrollMode = "normal";
				
			}else{
				this._enableVirtualization = false;
				this._allowVirtualScrolling = false;
			}
            if (this._gridObj) {
                if (columnSettings.length != this._gridObj.model.columns.length) {
                    this._gridObj.model.columns = columnSettings;
                    this._gridObj.columns(this._gridObj.model.columns);
                }
                sortSettings = JSON.parse(JSON.stringify(this._gridObj.model.sortSettings));
                this._gridObj.option({ 'dataSource': result ,'enableRTL':this.model.enableRTL,'sortSettings': sortSettings});
            } else {
                this._gridtag.ejGrid({
                       cssClass: proxy.model.cssClass,
                       enableRTL: proxy.model.enableRTL,
                       allowKeyboardNavigation: this.model.allowKeyboardNavigation,
                       dataSource: result,
                       selectionType: (proxy.model.allowMultiSelection ? "multiple" : "single"),
                       allowSorting: proxy.model.gridSettings.allowSorting,
                       columns: columnSettings,
                       isResponsive: true,
                       scrollSettings: { width: 186, height: 200, buttonSize: 0, scrollerSize: proxy._scrollerSize, allowVirtualScrolling: this._allowVirtualScrolling, enableVirtualization: this._enableVirtualization, virtualScrollMode: this._virtualScrollMode},
                       allowScrolling: true,
                       enableResponsiveRow: false,
                       rowSelected: function (e) { proxy._updatePathFromGrid(e); },
                       recordDoubleClick: function (e) { proxy._openAction(e); },
                       create: (this.model.showCheckbox ? function (e) { proxy._gridCheckboxState(e); } : null),
                       actionBegin: function (e) { proxy._gridActionBegin(e); },
                       actionComplete: function (e) { proxy._gridActionComplete(e); },
                       allowResizing:proxy.model.gridSettings.allowResizing
                  }
               );
                if(!this.model.allowMultiSelection)
                this._gridtag.find('.e-headercelldiv>span.e-chkbox-wrap').hide();
            }
            if (result.length && result[0].filterPath) {
                this._setFilteredContent();
            }
            if (this.model.templateRefresh){
                this._gridtag.ejGrid({
                    templateRefresh: function (e) { proxy._templateRefresh(e) }
                });
            }
            this._gridObj = this._gridtag.ejGrid("instance");
            var permission = this._getFilePermission(this._currentPath);
            if ((permission) && !(permission.Read)) this._gridObj.getContentTable().find(".emptyrecord").html(this._getLocalizedLabels("ProtectedFolder")).addClass("e-fe-center");
            else if (this._gridObj.model.dataSource.length == 0 && (this._searchbar && $.trim(this._searchbar.val()))) this._gridObj.getContentTable().find(".emptyrecord").html(this._getLocalizedLabels("EmptyResult")).addClass("e-fe-center");
            else if(this._gridObj.model.dataSource.length == 0) this._gridObj.getContentTable().find(".emptyrecord").html(this._getLocalizedLabels("EmptyFolder")).addClass("e-fe-center");
            this.gridItems = this._gridObj.getRows();
            if (this.model.allowDragAndDrop) {
                this._gridtag.children(".e-gridcontent").addClass("e-droppable");
                this._drag($(this.gridItems));
                $(this.gridItems).addClass("e-file-draggable");
            }
            this._reSizeHandler();
            var gridScrollObj = this._gridObj.getScrollObject();
            if (gridScrollObj && (gridScrollObj.isVScroll() || gridScrollObj.isVScroll())) {
                gridScrollObj.element.ejScroller({ thumbStart: function (e) { proxy._onThumbStart(e); } });
            }
			if(this.model.virtualItemCount > 0){
			    gridScrollObj.element.ejScroller({ thumbStart: function (e) { proxy._onCheckThumbStart(e); }, wheelStart: function (e) { proxy._onCheckThumbStart(e); } });
			}
            this._gridtag.attr("tabindex", -1);
            this._gridViewEvents("_off");
            this._gridViewEvents("_on");
            this._gridupdate(this._prevsortingoption);
        },
		_onCheckThumbStart: function (e) {
		    this._gridCheckboxState(e);
		},
        _setFilteredContent: function(){
            var rows = this._gridtag.find(".e-gridcontent tr");
            for (var i = 0; i < rows.length; i++) {
                var node = $(rows[i]).find("td:last");
                $(rows[i]).attr("data-parent-path", node.text());
                if (this.model.rootFolderName.length > 0)
                    node.attr("title", this._changeName(node.text(), false));
                else
                    node.attr("title", node.text());
                node.text("/" + node.text().replace(this._rootPath, ""));
            }
        },
        _templateRefresh: function (args) {
            this._trigger("templateRefresh", args);
        },
        _gridActionBegin: function (args) {
            if (args.requestType == "sorting") {
                args.cancel = true;
                    var length = this.model.gridSettings.columns.length;
                    for (i = 0; i < length; i++) {
                        if (args.columnName == this.model.gridSettings.columns[i].field) {
                            this._changeActiveSortedoption(this.model.gridSettings.columns[i].headerText);
                            this._sorting(this._prevsortingoption, this._prevsorting);
                            this._sortingActioncomplete();
                            break;
                        }
                    }
                    if (this._suggestionItems.length && args.columnName == "filterPath") {
                        this.removeSortingIcons();
                        this._suggestionitemsSorting("filterPath", this._prevsorting);
                        this._sortingActioncomplete(); 
                    }
                    this._suggestionItems.length && this._setFilteredContent();
                }
        },
        _gridActionComplete: function (args) {
            this.model.showCheckbox && this._gridCheckboxState(args);
            if (!ej.isNullOrUndefined(this._gridObj)) {
                this._gridupdate(this._prevsortingoption);
            }
        },

        _gridCheckboxState: function (args) {
            var proxy = this;
            this._gridtag.find(".e-headercelldiv:first").html(" <input type='checkbox' id='headchk' />").addClass("e-col-check");
            this._headCheckObj = this._gridtag.find("#headchk").ejCheckBox({showRoundedCorner: proxy.model.showRoundedCorner, change: function (e) { proxy._headCheckChange(e); } }).data("ejCheckBox");
            this._gridtag.find(".e-grid-row-checkbox").ejCheckBox({ showRoundedCorner: proxy.model.showRoundedCorner });
            this._gridtag.find(".e-chkbox-wrap").removeAttr("tabindex");
        },
        _checkChange: function (target) {
            if (!target.isInteraction && target.isInteraction != undefined) return;
            var rows = this._gridtag.find(".e-grid-row-checkbox");
            var checkedElements = this._gridtag.find(" .e-gridcontent .e-checkbox:checked");
            var rowCheck = [];
            for (var i = 0 ; i < checkedElements.length; i++) {
                rowCheck.push($(checkedElements[i]).closest("tr").index());
            }
            if (target && !target.type) {
                var index = $.inArray(target.index(), rowCheck);
                target.find(".e-chk-act").length == 1 ? rowCheck.splice(index, 1) : rowCheck.push(target.index());
            }
            this._changeCheckState = false;
            this._gridObj.clearSelection();
            if (rowCheck.length == rows.length)//check if all checkboxes in the current page are checked
                this._gridtag.find("#headchk").ejCheckBox({ "checked": true });
            else
                this._gridtag.find("#headchk").ejCheckBox({ "checked": false });
            this._isClicked = false;
            for (i = 0; i < rowCheck.length; i++) {
                if (true) {
                    this._gridObj.multiSelectCtrlRequest = true;
                    this._gridObj.selectRows(rowCheck[i]);// To prevent unselection of other rows when a checkbox is unchecked after selectAll rows
                }
            }
            this._isClicked = true;
            if (this.model.checked == false) {
                this._gridtag.find("#headchk").ejCheckBox({ "checked": false });
            }
            this._changeCheckState = true;
        },
        _recordClick: function () {
            var rows = this._gridtag.find(".e-grid-row-checkbox");
            for (var i = 0; i < rows.length; i++) {
                if ($.inArray(i, this._gridObj.selectedRowsIndexes) < 0) {
                    $(rows[i]).ejCheckBox({ "checked": false })  //To clear checkbox when we select row by recordclick rather than checkbox
                    this._gridtag.find("#headchk").ejCheckBox({ "checked": false });
                    !this._gridObj.multiSelectCtrlRequest && this._unselectEvent();
                }
                else {
                    $(rows[i]).ejCheckBox({ "checked": true });
                    var rowCheck = this._gridtag.find(".e-grid-row-checkbox:checked");
                    if (rowCheck.length == rows.length)
                        this._gridtag.find("#headchk").ejCheckBox({ "checked": true });
                }
            }
        },
        _headCheckChange: function (args) {
            if (!args.isInteraction) return;
            var proxy = this;
            var rows = this._gridtag.find(".e-grid-row-checkbox");
            rows.ejCheckBox({ "change": function (e) { proxy._checkChange(e); } });
            if (this._gridtag.find("#headchk").is(':checked')) {
                rows.ejCheckBox({ "checked": true });
                this._gridObj.selectRows(0, rows.length);  // To Select all rows in Grid Content
            }
            else {
                rows.ejCheckBox({ "checked": false });
                this._setSelectedItems([]); // To remove selection for all rows
                this._unselectEvent();
            }
        },

        _unselectEvent : function(){
            var prevSelecteditems = this._getSelectedItemDetails(this.model.selectedFolder, this._filteredItemsName);
            this._filteredItemsName = [];
            if (this._gridObj && this._gridObj.multiSelectCtrlRequest)
                return;
            if (prevSelecteditems.length > 0 ) {
                this._unselectedItems = [];
                for (var record = 0; record < prevSelecteditems.length; record++) {
                    name = prevSelecteditems[record].name;
                    this._unselectedItems.push(name);
                }

                var index = $.inArray(undefined, this.model.selectedItems), _nodeType;
                $.each(this._fileExplorer[this._originalPath], function (index, value) {
                    if (!value.isFile) _nodeType = "Directory";
                    else _nodeType = "File";
                });
                var data = { name: this._unselectedItems[this._unselectedItems.length - 1], names: this._unselectedItems, path: this.model.selectedFolder, nodeType: _nodeType, unselectedItem: prevSelecteditems[prevSelecteditems.length-1], unselectedItems: prevSelecteditems };
                this._trigger("unselect", data);
            }
        },

        _gridViewEvents: function (action) {
            this[action](this._gridtag.find(".e-gridcontent"), "focusin", this._focusGridView);
            this[action](this._gridtag.find(".e-gridcontent"), "focusout", this._blurGridView);
            this[action](this._gridtag.find(".e-gridcontent"), "mousedown", this._mouseSelection);
            this.model.allowDragAndDrop && this._gridDragEvents(action);
        },
        _gridDragEvents: function (action) {
            var gridContent = this._gridtag.children(".e-gridcontent")
            if (gridContent) {
                this[action](gridContent, "dragover", this._onDragOverHandler);
                this[action](gridContent, "drop", this._onDropHandler);
                this[action](gridContent, "dragleave", this._onDragLeave);
                this[action](this._gridtag.find(".e-gridheader"), "dragover", this._preventDropOption);
            }
        },
        _focusGridView: function (e) {
            if (!this._gridtag.find(".e-gridcontent").hasClass("e-focus")) {
                this._gridtag.find(".e-gridcontent").addClass("e-focus");
                this._itemList = [];
                this._on(this._gridtag.find(".e-gridcontent"), "keydown", this._OnKeyUp);
                this._hidePopup();
            }
        },
        _blurGridView: function (e) {
            this._gridtag.find(".e-gridcontent").removeClass("e-focus");
            this._off(this._gridtag.find(".e-gridcontent"), "keydown", this._OnKeyUp);
        },
        _setThumbImageHeight: function () {
            var perRow = this._perRow = 1;
            if (this.items) {
                for (var i = 0; i < this.items.length - 1; i++) {
                    if (this.items[i].getBoundingClientRect().top == this.items[i + 1].getBoundingClientRect().top)
                        perRow++;
                    else
                        break;
                }
                if (!(perRow == null || perRow < 2)) {
                    for (var i = 0, j = this.items.length; i < j; i += perRow) {
                        var maxHeight = 0,
                        row = this.items.slice(i, i + perRow);
                        row.each(function () {
                            var itemHeight = parseInt($(this).find(".e-thumb-image").outerHeight());
                            if (itemHeight > maxHeight) maxHeight = itemHeight;
                        });
                        row.find(".e-thumb-image.e-image").css('height', maxHeight);
                    }
                }
                this._tileScroll && this._tileScroll.refresh();
            }            
            this._perRow = perRow;
        },
        _renderTileView: function (result, path, addExisiting) {
            var tempResult = [];
            var proxy = this;
            var pathdetail = path;
            var spantag = null;
            var permission = this._getFilePermission(this._currentPath);
            if ((permission) && !(permission.Read)) this._tileView.html(this._getLocalizedLabels("ProtectedFolder")).addClass("e-fe-center");
            else if ((this._searchbar && $.trim(this._searchbar.val())) && result.length == 0) this._tileView.html(this._getLocalizedLabels("EmptyResult")).addClass("e-fe-center");
            else if (result.length == 0) this._tileView.html(this._getLocalizedLabels("EmptyFolder")).addClass("e-fe-center");
            else this._tileView.html("").removeClass("e-fe-center");
            // Virtual Scrolling for Tile,Large Icons Layout
            if (this.model.virtualItemCount > 0) {
                if (!this._renamedStatus) {
                    this._diffFolder = false;
                    if (addExisiting != true) {
                        this._tileView.children() && this._tileView.children().remove() && this._tileView.removeClass("e-tileview");
                        this._tileView.addClass("e-tileview").attr("role", "tileview");
                        this._scrollListCount = 0;
                        this._priviousScrollListCount = 0;
                        this._count = 0;
                    }

                    if (this._previousFolder == "") {
                        this._previousFolder = this._currentPath;
                        this._diffFolder = true;
                    }
                    else if (this._previousFolder != this._currentPath) {
                        this._tileView.html("").removeClass("e-fe-center");
                        this._previousFolder = this._currentPath;
                        this._diffFolder = true;
                        this._scrollListCount = 0;
                        this._priviousScrollListCount = 0;
                        this._count = 0;
                    }
                    if (this._virtualCount) {
                        var tempCount = result.length - this.model.virtualItemCount;
                        this._count = (this._virtualCount > tempCount) ? (this._virtualCount - this.model.virtualItemCount) : this._virtualCount;
                        this._scrollListCount = this._count + this.model.virtualItemCount;
                        this._virtualCount = 0;
                    }
                    else if (this._scrollListCount == this.model.virtualItemCount) {
                        this._count = 0;
                    } else {
                        this._count = this._priviousScrollListCount;
                    }
                    if (this._scrollListCount == 0) {
                        this._scrollListCount = this.model.virtualItemCount;
                    };
                    if (result.length > this.model.virtualItemCount) {
                        var num = 0;
                        for (this._count; this._count < this._scrollListCount; this._count++) {
                            tempResult[num] = result[this._count];
                            num++;
                        }
                    } else { tempResult = result; }
                } else {
                    tempResult =  this._virtualScrollRename(result);
                }
            } else {
                this._tileView.children() && this._tileView.children().remove() && this._tileView.removeClass("e-tileview");
                this._tileView.addClass("e-tileview").attr("role", "tileview");
                tempResult = result;
            }

			$.each(tempResult, function (index, value) {
				if(!value) return;
                var liTag = document.createElement("li"), imageWrapper, imageWrapperinnerDiv, spantag, divtag1, divtag, fname, filenameSpan, fninfo,fTypeSpan,fSizeDiv,fSizeSpan;
                liTag.className += "e-tilenode";
                if (value.filterPath)
                    liTag.setAttribute("data-parent-path", value.filterPath);
                imageWrapper = document.createElement("div");
                imageWrapper.className += "e-align";
                imageWrapperinnerDiv = document.createElement("div");
                imageWrapperinnerDiv.className += "e-thumb-image";
                imageWrapperinnerDiv.className += " e-image";
                imageWrapperinnerDiv.setAttribute("unselectable", "on");
                imageWrapper.appendChild(imageWrapperinnerDiv);
                spantag = document.createElement("span");
                spantag.className += "e-thumbImage";
                spantag.className += " e-fe-icon";
                spantag.setAttribute("unselectable", "on");
                if (value.isFile) {
                    liTag.appendChild(imageWrapper);
                    var extension = value.name.substr(value.name.lastIndexOf('.') + 1).toLowerCase() , extensionClass;                   
                   extensionClass = "e-fe-" + extension;
                   if ((/\.(bmp|dib|jpg|jpeg|jpe|jfif|gif|tif|tiff|png|ico)$/i).test(value.name)) {
                       if (proxy.model.showThumbnail) {
                           var path = value.filterPath ? value.filterPath.replace("~", "..") + value.name : (pathdetail ? proxy._originalPath.replace("~", "..") + value.name : proxy._currentPath.replace("~", "..") + value.name);
                           var url = proxy._getImage(path, value.name, proxy.model.enableThumbnailCompress);
                           spantag = document.createElement("img");
                           spantag.className += "e-thumbImage";
                           spantag.setAttribute("unselectable", "on");
                           spantag.setAttribute("src", (url ? url : (path + "?" + (proxy._updateImages[path] ? proxy._updateImages[path] : proxy._initialTime))));
                       } else spantag.className += " e-fe-images";
                   }
                   else if ((/\.(mp3|wav|aac|ogg|wma|aif|fla|m4a)$/i).test(value.name)) spantag.className += " e-fe-audio";
                   else if ((/\.(webm|mkv|flv|vob|ogv|ogg|avi|wmv|mp4|3gp)$/i).test(value.name)) spantag.className += " e-fe-video";
                   else if (!(/\.(css|exe|html|js|msi|pdf|pptx|ppt|rar|zip|txt|docx|doc|xlsx|xls|xml|rtf|php)$/i).test(value.name)) {
                       spantag.className += " e-fe-unknown";
                       spantag.className += " " + extensionClass;
                   }
                   else spantag.className += " " + extensionClass;
                }
                else {
                    liTag.appendChild(imageWrapper);
                    liTag.className += " e-folder";
                    spantag.className += " e-fe-folder";
                    if (value.permission && !value.permission.Read)
                        spantag.className += " e-fe-lock";
                }
                imageWrapperinnerDiv.appendChild(spantag);

                divtag1 = document.createElement("div");
                divtag1.className += "e-name-wrap";
                divtag1.setAttribute("unselectable", "on");

                divtag = document.createElement("div");
                divtag.className += "e-name";
                divtag.className += " e-name-in-wrap";
                divtag.setAttribute("unselectable", "on");

                filenameSpan = document.createElement("span");
                filenameSpan.className += "e-file-info";
                filenameSpan.setAttribute("title", value.name);
                filenameSpan.innerHTML = value.name;

                fname = document.createElement("div");
                fname.className += "e-file-name";
                fname.setAttribute("unselectable", "on");

                
                fname.appendChild(filenameSpan);

                divtag.appendChild(fname);

                if (value.isFile && proxy.model.layout == "tile") {

                    fninfo = document.createElement("div");
                    fninfo.className += "e-file-type";
                    fninfo.setAttribute("unselectable", "on");

                    fTypeSpan = document.createElement("span");
                    fTypeSpan.className += "e-file-info";
                    fTypeSpan.setAttribute("unselectable", "on");
                    fTypeSpan.innerHTML = value.type;

                    fninfo.appendChild(fTypeSpan);

                    fSizeDiv = document.createElement("div");
                    fSizeDiv.className += "e-file-size";
                    fSizeDiv.setAttribute("unselectable", "on");

                    fSizeSpan = document.createElement("span");
                    fSizeSpan.className +="e-file-info";
                    fSizeSpan.setAttribute("unselectable", "on");
                    fSizeSpan.innerHTML = value.size;

                    fSizeDiv.appendChild(fSizeSpan);

                    divtag.appendChild(fninfo);
                    divtag.appendChild(fSizeDiv);
                }
                divtag1.appendChild(divtag);
                liTag.setAttribute("aria-selected", false);
                liTag.setAttribute("title", value.isFile ? value.dateModified + " (" + value.size + ")" : value.dateModified);
                liTag.setAttribute("role", "tileitem");
                if(proxy.model.showCheckbox){
                    var checkBox = document.createElement("input");
                    checkBox.className += "e-tile-checkbox";
                    checkBox.setAttribute("type", "checkbox");
                    $(checkBox).ejCheckBox({ size: "mini", showRoundedCorner: proxy.model.showRoundedCorner });
                    liTag.insertBefore(checkBox.parentNode, liTag.firstChild);
                }
                liTag.appendChild(divtag1);
                proxy._tileView[0].appendChild(liTag);
                proxy._tileView.find(".e-chkbox-wrap").removeAttr("tabindex");
			});

		    if (this._diffFolder) { this._addVirtualHeight(this,result); }
            proxy._scrollEvent(result,proxy);
            if (!proxy._tileView.find(".e-image > img").length)
                proxy._setThumbImageHeight();
            else {
                var images = proxy._tileView.find(".e-image > img");
                var increament = 0;
                for (var i = 0; i < images.length; i++) {
                    var img = new Image();
                    img.onload = img.onabort = img.onerror = function (args) {
						if(args){
							++increament == images.length && proxy._setThumbImageHeight();
							var myargs = { path: args.target.src, element: args.target, originalArgs: args, action: "thumbnailPreview" };
							proxy._trigger("getImage", myargs);
						}
                        
                    };
                    img.src = $(images[i]).attr('src');
                }
            }
        },
        _virtualScrollRename:function(result){
            var renameFileName  = this._virtualScrollRenamedItem[0];
            var temp1Result=[];
            var renamePos;
            for(var i=0; i < result.length; i++){
                if(result[i].name == renameFileName){   
                    if(this.model.layout == "tile"){
                        renamePos = i;
                        this._count = renamePos;
                        var countPos = result.length - renamePos;
                        if(countPos >= 10){
                            this._count = renamePos;
                            this._scrollListCount = this._count + 10;
                        }
                        else{
                            var subCount = 10 - countPos;
                            this._count = this._count - subCount;
                            this._scrollListCount = this._count + 10;
                        }   
                    }
                }
            }
            var num = 0;
            for (this._count ; this._count <= this._scrollListCount; this._count++) {
                temp1Result[num] = result[this._count];
               num++;
            }
            this._tileView.children().remove();
            this._renamedStatus = false;
            return  temp1Result;
        },
        _scrollEvent:function(result, proxy) {
			this._activeItem = 0;
            this.items = this._tileView.children("li.e-tilenode");
            if (this.model.allowDragAndDrop) {
                this._tileViewWrapper.addClass("e-droppable");
                this._drag(this.items);
                this.items.addClass("e-file-draggable");
            }
            this._tileViewEvents("_off");
            this._tileViewEvents("_on");
            this._tileContent.addClass("e-content");
            var _tileHeight = this.model.showFooter ? this._splittag.outerHeight() - this._statusbar.outerHeight() : this._splittag.outerHeight();
            var _tileWidth = parseInt(this._splittag.find(".e-cont2").width());
			if(!this.model.virtualItemCount > 0){	
            if (ej.isNullOrUndefined(this._tileScroll))
                this._tileScroll = this._tileContent.parent(".e-tile-wrapper").ejScroller({ height: _tileHeight, width: _tileWidth, buttonSize: 0, scrollerSize: this._scrollerSize, thumbStart: function (e) { proxy._onThumbStart(e); } }).data("ejScroller");
            else {
                this._tileScroll.option({ "height": _tileHeight, "width": _tileWidth });
                this._tileScroll && this._tileScroll.refresh();
            }
			}else{
			this._tileScroll = this._tileContent.parent(".e-tile-wrapper").ejScroller({ height: _tileHeight, width: _tileWidth, buttonSize: 0, scrollerSize: this._scrollerSize, scroll	: function (e) { proxy._onScroll(result,e);}, thumbStart: function (e) { proxy._onThumbStart(e); }, thumbEnd: function (e) { proxy._onMaxScroll(result,e); } }).data("ejScroller");	
			}
			
		},
		_addVirtualHeight:function(proxy,result){
		    if(proxy._tileView[0].parentElement.getElementsByClassName("virtualBottom")[0] || proxy._tileView[0].parentElement.getElementsByClassName("virtualTop")[0]){
		        proxy._tileView[0].parentElement.getElementsByClassName("virtualBottom")[0].remove();
		        proxy._tileView[0].parentElement.getElementsByClassName("virtualTop")[0].remove();
		        proxy._tileScroll.model.scrollTop = "0";
			}
		    var contentHeight = proxy._calculateLiElement(proxy, result);
			var spanVirtualBottom = document.createElement("div");
			spanVirtualBottom.className = "virtualBottom";
			$(spanVirtualBottom).css({"height" : contentHeight + "px", "display": "block" });
			$(spanVirtualBottom).insertAfter(proxy._tileView[0]);
			var spanVirtualTop = document.createElement("div");
			spanVirtualTop.className = "virtualTop";
			$(spanVirtualTop).css({"height" : 0 + "px", "display": "block" });
			$(spanVirtualTop).insertBefore(proxy._tileView[0]);
		},
		_calculateLiElement:function(proxy,result){
			var li;
			var liHeight;
			var contentHeight
			var toolbarMenu = this._toolBarItems[0].getElementsByClassName('e-fe-split-context')[0];
			var largeIconLiElement = toolbarMenu.getElementsByTagName('li')[2];
			if (proxy.model.layout == "tile") {
			    li = proxy._tileView[0].getElementsByTagName("li");
			    if(li[0]) liHeight = li[0].offsetHeight;
			 contentHeight = result.length/2;
			 proxy._totalHeight = contentHeight * liHeight;
			} else if(proxy.model.layout == "largeicons"){
			    li = proxy._tileView[0].getElementsByTagName("li");
			    if(li[0]) liHeight = li[0].offsetHeight;
			 contentHeight = result.length/5;
			 proxy._totalHeight = contentHeight * liHeight;
			}
			return proxy._totalHeight;
		},
		_updateVirtualContentHeight: function (e, updateTopHeight) {
		    var totHeight = this._totalHeight - e.scrollTop;
		    if (updateTopHeight) {
		        if (totHeight < 0) {
		            this._tileView[0].parentElement.getElementsByClassName("virtualTop")[0].style.height = e.scrollTop + totHeight + "px";
		        } else { 
		            this._tileView[0].parentElement.getElementsByClassName("virtualTop")[0].style.height = e.scrollTop + "px";
		        }
		    }
		    totHeight = totHeight < 0 ? 0 : totHeight;
            if(this._tileView[0].parentElement.getElementsByClassName("virtualBottom")[0] ){
                this._tileView[0].parentElement.getElementsByClassName("virtualBottom")[0].style.height = totHeight + "px";
            }
        },
        _onMaxScroll: function (result, e) {
            this._updateVirtualContentHeight(e.model, true);
            this._priviousScrollListCount = this._scrollListCount;
            this._scrollListCount += this.model.virtualItemCount;
            this._vScrollTop = e.scrollData.sTop;
            this._virtualCount = Math.ceil((result.length / e.scrollData.scrollable) * e.scrollData.sTop);
            this._renderTileView(result, null);
        },
		_onScroll: function (result, e) {
            if (e.source == "thumb") { return; }
            var proxy = this;
            proxy._scrollLoad = false;
            window.setTimeout(function () {
                if (!proxy._scrollLoad) {
                    proxy._scrollLoad = true;
					if(e.source == "key" && e.source){
						proxy._onMaxScroll(result, e);
					}else {
                    proxy._updateVirtualContentHeight(e,true);
                    proxy._priviousScrollListCount = proxy._scrollListCount;
                    proxy._scrollListCount += proxy.model.virtualItemCount;
					if(e.scrollData) {
						proxy._vScrollTop = e.scrollData.sTop;
                        proxy._virtualCount = Math.ceil((result.length / e.scrollData.scrollable) * e.scrollData.sTop);
					}
                    proxy._renderTileView(result,null);
                    proxy._vScrollTop = e.scrollTop;
					}
                }
            },0)
		},
        _getImage: function (path, name, canCompress) {
            path = path.replace("..", "~");
            var selectedItems = this._getSelectedItemDetails(this._currentPath, name);
            var args = { path: path, canCompress: canCompress, size: (canCompress ? { Height: 104, Width: 116 } : null), selectedItems: selectedItems };
            args.path = this._pathCorrection(args.path);
            if (this._trigger("beforeGetImage", args))
                return "";
            if (this._currentPath.indexOf(":") == 1 || this.model.ajaxSettings.getImage.url || (this._currentPath.startsWith("//") && this.model.path == "/") ) {
                var url = this.model.ajaxAction + "?Path=" + args.path + "&ActionType=GetImage&CanCompress=" + args.canCompress + "&Size=" + JSON.stringify(args.size) + "&SelectedItems=" + JSON.stringify(args.selectedItems);
                if (this.model.ajaxSettings.getImage.url) {
                    if (this.model.ajaxSettings.getImage.url.indexOf("{") >= 0)
                        url = String.format(this.model.ajaxSettings.getImage.url, "?CanCompress=" + args.canCompress + "&Size=" + JSON.stringify(args.size) + "&Path=" + args.path + "&SelectedItems=" + JSON.stringify(args.selectedItems));
                    else
                        url = this.model.ajaxSettings.getImage.url;
                }
            }
            return url ? url : (canCompress ? this.model.ajaxAction + "?ActionType=GetImage&CanCompress=" + args.canCompress + "&Size=" + JSON.stringify(args.size) + "&Path=" + args.path + "&SelectedItems=" + JSON.stringify(args.selectedItems): "");
        },
        _gridtagClick: function (event) {
            event.stopPropagation();
            if (($(event.target).hasClass("e-gridcontent") || $(event.target).hasClass("e-content") || $(event.target).hasClass("e-table")) && this._selectedRows && this._selectedRows.length == 0) {
                this._addFocus(this._gridtag.find(".e-gridcontent"));
                if (this.model.showCheckbox) {
                    this._gridtag.find(".e-grid-row-checkbox").ejCheckBox({ "checked": false });
                    this._gridtag.find("#headchk").ejCheckBox({ "checked": false });
                }
                this._gridObj.clearSelection();
                this._unselectEvent();
                this._updateCurrentPathPermission();
                this._activeSource && this._activeSource.length && this._setSelectedItems(this._activeSource);
            }
            this._activeSource = null;
        },

        _updateGridSelection: function (args) {
            if (args.events && !args.events.ctrlKey && $(args.target)[0] != null) {
                this._gridObj.selectRows($(args.target).closest('td').parent().index(), null, $(args.target).closest('td'));
            }
        },

        _updateTileSelection: function (args) {
            if (args.events && !args.events.ctrlKey && $(args.target)[0] != null) {
                this._triggerClick(args.target);
            }
        },

        _tileViewEvents: function (action) {
            this[action](this.items, "mousedown", this._preventDefaultSelection);
            this[action](this._tileViewWrapper, "mousedown", this._mouseSelection);
            this[action](this.items, (this._isDevice && $.isFunction($.fn.tap)) ? "tap" : "click", this._upDatePathFromTileView);
            this[action](this.items, (this._isDevice && $.isFunction($.fn.tap)) ? "doubletap" : "dblclick", this._openAction);
            this[action](this.items, "mouseenter", this._onItemHover);
            this[action](this.items, "mouseleave", this._onItemLeave);
            this[action](this._tileViewWrapper, "focusin", this._focusTileView);
            this[action](this._tileViewWrapper, "focusout", this._blurTileView);
            this.model.allowDragAndDrop && this._tileDragEvents(action);
        },
        _tileDragEvents: function (action) {
            if (this._tileViewWrapper) {
                this[action](this._tileViewWrapper, "dragover", this._onDragOverHandler);
                this[action](this._tileViewWrapper, "drop", this._onDropHandler);
                this[action](this._tileViewWrapper, "dragleave", this._onDragLeave);
            }
        },
        _preventDefaultSelection: function(event){
            event.shiftKey && event.preventDefault();
        },
        _tileViewWrapperClick: function (event) {
            if ($(event.target).hasClass("e-tile-wrapper") || $(event.target).hasClass("e-tile-content") || $(event.target).hasClass("e-tileview")) {
                this._lastItemIndex = this._lastItemIndex ? this._lastItemIndex : (this._itemList && this._itemList.length > 0 ? this._itemList.filter(".e-active").index() : -1);
                this._addFocus(this._tileViewWrapper);
                if (this.items.hasClass("e-active"))
                    this.items.removeClass("e-active").attr("aria-selected", false);
                this._updateCurrentPathPermission();
                this.model.showCheckbox && this._clearTileCheckBoxSelection();
                this._hidePopup();
                this._activeSource && this._activeSource.length && this._setSelectedItems(this._activeSource);
                this._unselectEvent();
            }
            this._activeSource = null;
        },
        _onItemHover: function (e) {
            var currentItem = e.currentTarget, targetItem = e.target;
            if (!$(currentItem).hasClass("e-disable")) {
                this.items.removeClass("e-hover");
                $(currentItem).addClass("e-hover");
            }
        },
        _onItemLeave: function (e) {
            var currentItem = e.currentTarget, targetItem = e.target;
            if (!$(currentItem).hasClass("e-disable")) {
                $(currentItem).removeClass("e-hover");
            }
        },
        _focusTileView: function (e) {
            if (!this._tileViewWrapper.hasClass("e-focus")) {
                this._tileViewWrapper.addClass("e-focus");
                this._itemList = this.items;
                this._on(this._tileViewWrapper, "keydown", this._OnKeyUp);
                this._on(this._tileViewWrapper, "keydown", this._OnKeyDown);
            }
        },
        _blurTileView: function (e) {
            this._tileViewWrapper.removeClass("e-focus");
            this._off(this._tileViewWrapper, "keydown", this._OnKeyUp);
            this._off(this._tileViewWrapper, "keydown", this._OnKeyDown);
        },
        _OnKeyDown: function (e) {
            var itemsLength = this._itemList.length - 1, activeItem;
            this._activeItem = this._lastItemIndex ? this._lastItemIndex : (this._itemList ? this._itemList.filter(".e-active").index() : -1);
            var code = this._getKeyCode(e);
            if (!this.model.allowKeyboardNavigation) return;
            switch (code) {
                case 38:
                    e.preventDefault();
                    if ($(e.target).hasClass("e-statusbar")) {
                        this._focusLayout(this.model.layout);
                        return;
                    }
                    if (this._activeItem < this._perRow-1)
                        return;
                    this._activeItem -= this._perRow;
                    this._beforeListHover(e);
                    break;
                case 37:
                    e.preventDefault();
                    if (this._activeItem == 0)
                        return;
                    if ((this._activeItem < 0) || (this._activeItem == null) || (this._activeItem > itemsLength))
                        this._activeItem = 0;
                    else if (this._activeItem == 0)
                        this._activeItem = itemsLength;
                    else
                        this._activeItem -= 1;
                    this._beforeListHover(e);
                    break;
                case 40:
                    e.preventDefault();
                    if (this._activeItem + this._perRow >= this._itemList.length)
                        return;
                    this._activeItem += this._perRow;
                    this._beforeListHover(e);
                    break;
                case 39:
                    e.preventDefault();
                    if (this._activeItem == itemsLength)
                        return;                    
                    if ((this._activeItem > itemsLength) || (this._activeItem == null) || (this._activeItem < 0))
                        this._activeItem = itemsLength;
                    else if (this._activeItem == itemsLength)
                        this._activeItem = 0;
                    else
                        this._activeItem += 1;
                    this._beforeListHover(e);
                    break;
                case 33:
                case 36:
                    e.preventDefault();
                    this._activeItem = 0;
                    this._beforeListHover(e);
                    break;
                case 34:
                case 35:
                    e.preventDefault();
                    this._activeItem = itemsLength;
                    this._beforeListHover(e);
                    break;
            }
            this._lastItemIndex= e.shiftKey ? this._activeItem : null;
        },
        _OnKeyUp: function (e) {
            var activeItem;
            var code = this._getKeyCode(e);
            if (!this.model.allowKeyboardNavigation) return;
            if (this._KeydownEventHandler(e)) return;
            switch (code) {
                case 13:
                    e.preventDefault();
                    if (e.altKey) {
                        this._lastFocusedElement = e.currentTarget;
                        this._getDetails();
                    }
                    else {
                        e.preventDefault();
                        this._lastFocusedElement = e.currentTarget;
                        if (!$(e.currentTarget).hasClass("e-treeview")) {
                            var isPresent = false;
                            if ($(e.currentTarget).hasClass("e-tile-wrapper"))
                                isPresent = this.items.hasClass("e-active");
                            else if ($(e.currentTarget).hasClass("e-gridcontent"))
                                isPresent = $(this.gridItems).find("td").hasClass("e-active");
                            if (isPresent && this._selectedContent)
                                this._openAction();
                        }
                    }
                    break;
                case 86:
                    if (e.ctrlKey) {
                        e.preventDefault();
                        if (!ej.isNullOrUndefined(this._option) && this._selectedContent) {
                            if (this._currentPath != this._originalPath) {
                                this._currentPath = this._originalPath;
                            }
                            this._lastFocusedElement = e.currentTarget;
                            this._cut_copy();
                        }
                    }
                    break;
                case 46:
                case 67:
                case 68:
                case 88:
                case 113:
                    e.preventDefault();
                    this._lastFocusedElement = e.currentTarget;
                    var isPresent = false;
                    if ($(e.currentTarget).hasClass("e-treeview")) {
                        if (this._rootPath != this._currentPath)
                            isPresent = (this._treetag.find(".e-active").length > 0) ? true : false;
                    }
                    else {
                        if ($(e.currentTarget).hasClass("e-tile-wrapper"))
                            isPresent = this.items.hasClass("e-active");
                        else if ($(e.currentTarget).hasClass("e-gridcontent"))
                            isPresent = $(this.gridItems).find("td").hasClass("e-active");
                    }
                    if (isPresent && this._selectedContent && this._toRead) {
                        if (code == 67 && this._toCopy) {
                            if (e.ctrlKey)
                                this._copyMoveNode("copy");
                        }
                        if (this._toEdit) {
                            switch (code) {
                                case 46:
                                    this._deleteFolder();
                                    break;
                                case 68:
                                    if (e.ctrlKey)
                                        this._deleteFolder();
                                    break;
                                case 88:
                                    if (e.ctrlKey)
                                        this._copyMoveNode("move");
                                    break;
                                case 113:
                                    this._renameFolder();
                                    break;
                            }
                        }
                    }
                    break;
                case 93:
                case 121:
                    if ((e.shiftKey || code == 93) && this.model.showContextMenu) {
                        e.preventDefault();
                        this._lastFocusedElement = e.currentTarget;
                        var pos = null, _target, _element;
                        if ($(e.currentTarget).hasClass("e-treeview")) {
                            _element = this._treeObj.getSelectedNode().find(".e-active");
                            pos = this._getMenuPosition(_element);
                            this._treeMenuObj.show(pos.left, pos.top, _element, e, true);
                        }
                        else {
                            if ($(e.currentTarget).hasClass("e-tile-wrapper")) {
                                for (var i = 0; i < this.items.length; i++) {
                                    _element = $(this.items[i]);
                                    if (_element.text() == this._selectedContent) {
                                        pos = this._getMenuPosition(_element);
                                        _target = _element;
                                        break;
                                    }
                                }
                            } else if ($(e.currentTarget).hasClass("e-gridcontent")) {
                                for (var i = 0; i < this.gridItems.length; i++) {
                                    _element = $(this.gridItems[i]).find("td.e-grid-image").next();
                                    if (_element.text() == this._selectedContent) {
                                        pos = this._getMenuPosition(_element);
                                        _target = _element;
                                        break;
                                    }
                                }
                            }
                            if (pos == null) {
                                pos = $(e.currentTarget).offset();
                                _target = $(e.currentTarget);
                            }
                            this._viewMenuObj.show(pos.left, pos.top, _target, e, true);
                        }
                    }
                    break;
            }
        },
        _KeydownEventHandler: function (e) {
            data = { keyCode: e.keyCode, altKey: e.altKey, shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, originalArgs: e };
            return this._trigger('keydown', data);
        },
        _getMenuPosition: function (element) {
            var height = element.outerHeight() / 2;
            var width = element.outerWidth() / 2;
            var pos = element.offset();
            pos = { top: pos.top + height, left: pos.left + width };
            return pos;
        },

        _beforeListHover: function (args) {
            var activeItem = this._getActiveItem();
            if (!activeItem.hasClass("e-disable")) {
                if ($(args.target).hasClass("e-statusbar")) {
                    this.model.layout = activeItem.hasClass("e-switchGridView") ? ej.FileExplorer.layoutType.Grid : ej.FileExplorer.layoutType.LargeIcons;
                    this._switchLayoutView(this.model.layout);
                    this._addFocus(this._statusbar);
                }
                else {
                    var e = { keyCode: 91, shiftKey: args.shiftKey, innerEvent: true, currentTarget: activeItem[0], target: activeItem[0] };
                    this._upDatePathFromTileView(e);
                }
            }
        },
        _getActiveItem: function () {
            return $($(this._itemList)[this._activeItem]);
        },
        _getURL: function () {
            var url = this.model.ajaxAction + "?Path=" + this._pathCorrection(this._currentPath) + "&ActionType=Upload" + (this._selectedContent ? "&SelectedItems=" + JSON.stringify(this._getSelectedItemDetails(this._getFolderPath(), [this._selectedContent])) : "");
            if (this.model.ajaxSettings.upload.url) {
                if (this.model.ajaxSettings.upload.url.indexOf("{") >= 0)
                    url = String.format(this.model.ajaxSettings.upload.url, "?Path=" + this._pathCorrection(this._currentPath) + (this._selectedContent ? "&SelectedItems=" + JSON.stringify(this._getSelectedItemDetails(this._getFolderPath(), [this._selectedContent])) : ""));
                else
                    url = this.model.ajaxSettings.upload.url;
            }
            return url;
        },

        _renderUploadBox: function () {
            var proxy = this;
            var url = this._getURL();
            var contentArea = (proxy.model.uploadSettings.dialogAction.content == null) ? proxy.element : proxy.model.uploadSettings.dialogAction.content;
            this._uploadtag.ejUploadbox({
                cssClass: this.model.cssClass,
                enableRTL: this.model.enableRTL,
                height: "0px",
                width: "0px",
                uploadName: "FileUpload",
                /* For Automatic Upload */
                autoUpload: this.model.uploadSettings.autoUpload,
                showFileDetails: this.model.uploadSettings.showFileDetails,
                dialogText: { title: proxy._getLocalizedLabels("Upload") },
                dialogAction: {
                    modal: this.model.uploadSettings.dialogAction.modal, content: contentArea, closeOnComplete: this.model.uploadSettings.dialogAction.closeOnComplete,
                    drag: this.model.uploadSettings.dialogAction.drag
                },
                dialogPosition: this.model.uploadSettings.dialogPosition,
                showRoundedCorner: this.model.showRoundedCorner,
                extensionsAllow: this.model.fileTypes == "*.*" ? "" : this.model.fileTypes.replace(/\*/g, ""),
                multipleFilesSelection: this.model.uploadSettings.allowMultipleFile,
                fileSize: this.model.uploadSettings.maxFileSize,
                buttonText: { browse: "Upload file" },
                saveUrl: url,
                removeUrl: this.model.ajaxAction + "?Path=" + this._currentPath + "&ActionType=Remove",
                locale: ej.Uploadbox.Locale[this.model.locale] ? this.model.locale : "en-US",
                success: function (e) { proxy._trigger("uploadSuccess", e); },
                beforeSend: function (e) { proxy._trigger("beforeUploadSend", e); },
                complete: function (e) { proxy._uploadSuccess(e); },
                remove: function (e) { proxy._uploadSuccess(e); },
                fileSelect: function (e) {
                    !proxy._fileExplorer[proxy._currentPath] && proxy._getFileDetails(proxy._currentPath);
                    var targetFiles = proxy._fileExplorer[proxy._currentPath];
                    proxy._existingItems = [];
                    var files = proxy._files = e.files;
                    for (var j = 0; j < files.length; j++) {
                        for (var i = 0; i < targetFiles.length; i++) {
                            if (files[j].name == targetFiles[i].name) {
                                proxy._existingItems.push({ Name: files[j].name, Path: proxy._currentPath + files[j].name, IsReplace: true });
                                break;
                            }
                        }
                    }
                    if (proxy._existingItems.length) {
                        proxy._createReplaceConformationDiaolg("_customUpload", "UploadReplaceAlert",e);
                        e.cancel = true;
                    } else {
                        proxy._trigger("beforeUploadDialogOpen", e);
                    }
                },
                error: function (e) {
                    if (!proxy._alertDialog || !proxy._alertDialog.is(":visible")) {
                        proxy._alertDialog = proxy._createDialog(ej.buildTag('div.e-fe-dialog-label', (e.error ? e.error : e.responseText)), { width: 400, height: "auto", title: proxy._getLocalizedLabels("Error") });
                        proxy._alertDialogObj = proxy._alertDialog.data("ejDialog");
                    }
                   proxy._trigger("uploadError", e);
                },
                begin: function (e) {
                    var nodes = proxy._currentPath.split('/');
                    var args = { path: proxy._currentPath, selectedItems: proxy._getSelectedItemDetails(proxy._getFolderPath(), nodes[nodes.length - 2]), uploadItemDetails: e.files, url: proxy._getURL() };
                    if (proxy._trigger("beforeUpload", args))
                        e.cancel = true;
                    proxy._uploadtag.ejUploadbox({ saveUrl: args.url });
                },
                cancel: function (e) { proxy._usePreviousValues(); }
            });
            this._uploadObj = this._uploadtag.ejUploadbox("instance");
        },
        _usePreviousValues: function(){
            if (this._previousPath) {
                this._currentPath = this._previousPath;
                this._selectedContent = this._previousSelectedContent;
                this._previousPath = null;
            }
        },
        _isRestrictedUpload: function (element, text, hoverPath) {
            var path = null;
            if(element.find(".e-fe-lock").length){
                path = hoverPath ? hoverPath : this._getFolderPath(this._updatePath(element, text));
                if (this._fileExplorer[path] && this._fileExplorer[path].length) {
                    for (var i = 0; i < this._fileExplorer[path].length; i++) {
                        if (this._fileExplorer[path][i].name == text && this._fileExplorer[path][i].permission)
                            return !this._fileExplorer[path][i].permission.Upload;
                    }
                }
                return false;
            }
            return false;
        },
        _onDragOverHandler: function (args) {
            var highlightedElement = "";
            var hoverPath = "";
            var element = $(args.target);
            var hoverElementName = element.hasClass("e-js") || element.hasClass("e-tileview") ? "" : element.text();
            args.originalEvent.dataTransfer.dropEffect = "copy";
            args.stopPropagation();
            args.preventDefault();
            if (!element.hasClass("e-file-droppable")) {
                highlightedElement = this._splittag.find(".e-file-droppable");
                highlightedElement && highlightedElement.removeClass("e-file-droppable");                
                if ($(args.currentTarget).hasClass("e-tree-wrapper")) {
                    if (!ej.isNullOrUndefined(element) && element.is('A')) {
                        this._droppableElement = element;
                        this._droppableElement.length && this._droppableElement.addClass("e-file-droppable");
                        var nodeItem = element.closest("li.e-item");
                        if (nodeItem.find(".e-icon").length && !this._treeObj.isExpanded(nodeItem)) {
                            this._expandTimer = window.setTimeout(function () {
                                this._treeObj && this._treeObj.expandNode(nodeItem);
                            }, 800);
                        }
                    }
                    else {
                        args.originalEvent.dataTransfer.dropEffect = "none";
                    }
                }
                else {
                    if (this.model.layout == "grid") {
                        this._droppableElement = element.closest("tr", "table.e-table");
                        if (this._droppableElement.length) {
                            this._droppableElementData = this._gridObj.model.currentViewData[this._gridObj.getIndexByRow(this._droppableElement)];
                            if (this._droppableElementData.isFile) {
                                this._gridtag.find(".e-gridcontent").addClass("e-file-droppable");
                                this._droppableElement = null;
                            }
                        }
                        else
                            this._gridtag.find(".e-gridcontent").addClass("e-file-droppable");
                    }
                    else {
                        this._droppableElement = element.closest("li", ".e-tileview").has(".e-fe-folder");
                        !this._droppableElement.length && this._tileViewWrapper.addClass("e-file-droppable");
                    }
                    this._droppableElement && this._droppableElement.length && this._droppableElement.addClass("e-file-droppable");
                    hoverPath = this._getHoverTreeElementPath(element);
                    if (this._droppableElement && this._droppableElement.length)
                        hoverElementName = (this.model.layout == "grid" ? this._droppableElementData.name : this._droppableElement.find(".e-file-name").text());
                }
            }
            if (this._droppableElement && this._droppableElement.length && this._isRestrictedUpload(this._droppableElement, hoverElementName? hoverElementName: args.target.textContent, hoverPath)) {
                args.originalEvent.dataTransfer.dropEffect = "none";
            }
            var eventArgs = { target: (this._droppableElement && this._droppableElement.length ? this._droppableElement : element), targetElementName: hoverElementName, targetPath: this._getHoverTreeElementPath(element) + hoverElementName };
            this._trigger("drag", eventArgs);
        },

        _getHoverTreeElementPath: function (element) {
            if (element.hasClass("e-text")) {
                return this._updatePath(element, element.text());
            }
            else
            {
                return this._originalPath;
            }
        },

        _onDropHandler: function (args) {
            if ( !args.originalEvent.dataTransfer.files || !args.originalEvent.dataTransfer.files.length)
                return;
            args.stopPropagation();
            args.preventDefault();
            if (this._expandTimer != null) {
                window.clearTimeout(this._expandTimer);
                this._expandTimer = null;
            }
            this.element.find(".e-file-droppable").removeClass("e-file-droppable");
            var uploadObj = this._uploadtag.ejUploadbox("instance");
            if (this._droppableElement && this._droppableElement.length) {
                this._previousPath = this._currentPath;
                this._previousSelectedContent = this._selectedContent;
                if ($(args.currentTarget).hasClass("e-tree-wrapper")) {
                    this._selectedContent = args.target.text;
                    this._currentPath = this._updatePath($(args.target), this._selectedContent);
                }
                else {
                    this._selectedContent = this.model.layout == "grid" ? this._droppableElementData.name : $(args.target).closest("li", "e-tileview").find(".e-file-name").text();
                    this._currentPath = this._originalPath + this._selectedContent + "/";
                }
            }
            else {
                if (this._droppableElement && !this._droppableElement.length) {
                    if (this._isRestrictedUpload(this._selectedNode, this._selectedTreeText, this._getFolderPath(this._originalPath))) {
                        args.originalEvent.dataTransfer.dropEffect = "none";
                        return null;
                    }
                }
                this._currentPath = this._originalPath;
                this._selectedContent = this._selectedTreeText;
            }
            var eventArgs = { dropAction: "upload", fileInfo: args.originalEvent.dataTransfer.files, target: this._droppableElement && this._droppableElement.length ? this._droppableElement : $(args.currentTarget), targetPath: this._currentPath, targetElementName: this._selectedContent };
            if (this._trigger("dragStop", eventArgs))
                return;
            uploadObj._onDropHandler(args);
            var eventArgs = { dropAction: "upload", fileInfo: args.originalEvent.dataTransfer.files, target: this._droppableElement && this._droppableElement.length ? this._droppableElement : $(args.currentTarget), targetPath: this._currentPath, targetFolder: this._selectedContent };
            this._trigger("drop", eventArgs);
        },
        _onDragLeave: function (args) {
            if (this._expandTimer!= null) {
                window.clearTimeout(this._expandTimer);
                this._expandTimer = null;
            }
            if (this._gridtag.find(".e-gridcontent").hasClass("e-file-droppable")||$(args.target).hasClass("e-tile-wrapper") || $(args.target).hasClass("e-gridcontent") || ($(args.target).closest(".e-fileexplorer .e-tile-wrapper") || $(args.target).closest(".e-fileexplorer .e-gridcontent")))
                this.model.layout == "grid" ? this._gridtag.find(".e-gridcontent").removeClass("e-file-droppable") : this._tileViewWrapper.removeClass("e-file-droppable");
        },
        _customUpload: function () {
            for (var i = 0; i < this._existingItems.length; i++) {
                if (!this._existingItems[i].IsReplace) {
                    for (var k = 0; k < this._files.length; k++) {
                        if (this._files[k].name == this._existingItems[i].Name) {
                            this._files.splice(k, 1);
                            break;
                        }
                    }
                }
            }
            this._uploadtag.ejUploadbox({ pushFile: this._files });
        },
        _uploadSuccess: function (args) {
            var oldPath = this._currentPath;
            var uploadedItems = [];
            for (var i = 0; i < args.success; i++) {
                uploadedItems.push(args.success[i].name);
            }
            this.element.find(".e-dialog.e-js .e-action-perform").remove();
            this._fileExplorer[this._currentPath] = "";
            this._treeObj.selectNode(this._selectedNode);
            (oldPath == this._currentPath) && this._setSelectedItems(uploadedItems);
            this._trigger("uploadComplete", args);
        },
        _preventDrag: function () {
            var items = this._treetag.find("li div a");
            items.removeClass("e-file-draggable");
            if (this.gridItems && this.gridItems.length) {
                $(this.gridItems).removeClass("e-file-draggable");
            }
            if (this.items && this.items.length) {
                this.items.removeClass("e-file-draggable");
            }
        },
        _allowDrag: function () {
            this._gridtag.children(".e-gridcontent").addClass("e-droppable");
            this._tileViewWrapper.addClass("e-droppable");
            var unbindedTreeItems = this._treetag.find("li div a").not(".e-js");
            unbindedTreeItems.length && this._drag(unbindedTreeItems);
            var unbindedGridItems = $(this.gridItems).not(".e-js");
            unbindedGridItems.length && this._drag($(this.gridItems));
            var unbindedTileItems = this.items.not(".e-js");
            unbindedTileItems.length && this._drag(unbindedTileItems);
            var items = this._treetag.find("li div a");
            items.addClass("e-file-draggable");
            if (this.gridItems && this.gridItems.length) {
                $(this.gridItems).addClass("e-file-draggable");
            }
            if (this.items && this.items.length) {
                this.items.addClass("e-file-draggable");
            }
        },
        _drag: function (nodes, area) {
            var _clonedElement, _previousDroppable, hoverElementName, _defaultCursor, _targetNode, _preventDrop, _oldElement, hoverPath, proxy = this;
            nodes.ejDraggable(
           {
               dragOnTaphold: true,
               clone: true,
               dragStart: function (args) {
                   var preventMoveFunction = false;
                   proxy._previousElement = proxy._selectedNode;
                   if ($(args.target).hasClass("e-text")) {
                       preventMoveFunction = true;
                       proxy._copiedNodes = [$(args.target).text()];
                       proxy._option = "move";
                       proxy._sourcePath = proxy._getFolderPath(proxy._getHoverTreeElementPath($(args.target)));
                       proxy._sourceType = "Directory";
                       proxy._fileName = $(args.target).text();
                       proxy._refreshNode = $(args.target).closest("li");
                   }
                   else {
                       if (proxy.model.selectedItems.length <= 1) {
                           if (proxy.model.layout == "grid") {
                               proxy._gridObj.selectRows($(args.target).closest("tr").index());
                           }
                           else {
                               proxy._triggerClick(args.target);
                           }
                       }
                   }
                   if (!proxy.model.selectedItems.length) {
                       if ($(args.target).hasClass("e-text")) {
                           hoverElementName = args.target.textContent;
                       }
                       if (args.target && hoverElementName && proxy._isRestrictedMove(args.element, hoverElementName, "")) {
                           _clonedElement.remove();
                           args.cancel = true;
                           return null;
                       }
                   }
                   else {
                       for (var i = 0; i < proxy.model.selectedItems.length ; i++) {
                           if (args.target && proxy._isRestrictedMove(args.element, proxy.model.selectedItems[i], proxy.model.selectedFolder)) {
                               _clonedElement.remove();
                               args.cancel = true;
                               return null;
                           }
                       }
                   }
                   !preventMoveFunction && proxy._copyMoveNode("move");
                   proxy._previousElement.find("a").eq(0).click();
                   var eventArgs = { target: args.element, targetPath: proxy._currentPath, selectedItems: proxy._getSelectedItemDetails(proxy._sourcePath, proxy._fileName) };
                   proxy._trigger("dragStart", eventArgs);
               },
               drag: function (args) {
                   var timeDelay, _oldElement = _targetNode;
                   if (!args.target)
                       return;
                   var target =  $(args.target).closest(".e-droppable", ".e-fileexplorer");
                   if ($(args.target).hasClass("e-droppable")) {
                       _targetNode = $(args.target);
                   }
                   else if (target.length) {
                       _targetNode = target;
                   }
                   else if ($(args.target).hasClass("e-text"))
                       _targetNode = $(args.target).find(".e-droppable");
                   else
                       proxy._clearExpand($(args.target).closest("li.e-item"));
                   document.body.style.cursor = 'no-drop';
                   if (_previousDroppable)
                       _previousDroppable.style.cursor = _defaultCursor;
                   _previousDroppable = args.target;
                   _defaultCursor = args.target.style.cursor;
                   $(_clonedElement).css({ "margin-left": "10px" });
                   if (_targetNode && _oldElement && _targetNode.hasClass("e-draggable")) {
                       if (_targetNode.text() != _oldElement.text()) {
                           var nodeItem = $(args.target).closest("li.e-item");
                           proxy._clearExpand(nodeItem);
                           if (nodeItem && nodeItem.find(".e-icon").length && !proxy._treeObj.isExpanded(nodeItem)) {
                               proxy._expandTimer = window.setTimeout(function () {
                                   proxy._treeObj && proxy._treeObj.expandNode(nodeItem);
                               }, 800);
                           }
                           clearTimeout(timeDelay);
                           timeDelay = setTimeout(function () {
                               if ($(_previousDroppable).hasClass("e-text")) {
                                   proxy._needToScroll($(_previousDroppable).closest("li"), "Tree");
                               }
                               else {
                                   _targetNode && proxy._needToScroll($(_targetNode), "");
                               }
                           }, 100);
                       }
                       args.target.style.cursor = "pointer";
                   }
                   else {
                       args.target.style.cursor = "no-drop";
                   }
                   if ($(_previousDroppable).hasClass("e-text")) {
                       hoverElementName = _previousDroppable.textContent;
                       hoverPath = "";
                   }
                   else {
                       hoverElementName = proxy.model.layout == "grid" ? (_targetNode ? _targetNode.find("[data-cell='" + proxy._gridObj.getColumnByField("name").headerText + "']").text() :"") : (_targetNode ? (_targetNode.hasClass("e-tile-wrapper") ? "" : _targetNode.text()) : "");
                       hoverPath = proxy._getHoverTreeElementPath($(_previousDroppable));
                   }
                   if (_previousDroppable && proxy._isRestrictedMove(_targetNode, hoverElementName, hoverPath)) {
                       args.target.style.cursor = "no-drop";
                       _preventDrop = true;
                   }
                   else
                       _preventDrop = false;
                   if (hoverPath + (hoverElementName ? (hoverElementName + "/") : "") != proxy._sourcePath)
                       args.target.style.cursor = "pointer";
                   var eventArgs = { target: (_targetNode && _targetNode.length ? _targetNode : $(args.target)), targetElementName: hoverElementName, targetPath: (hoverPath ? hoverPath : proxy._originalPath ) + hoverElementName };
                   proxy._trigger("drag", eventArgs);
               },
               dragStop: function (args) {
                   var isWrapper= false;
                   if(proxy.model.layout == "grid"){
                       isWrapper = ($(args.target).hasClass("e-gridcontent") || ($(args.target).find("table").length && $(args.target).closest(".e-gridcontent", ".e-fileexplorer").length));
                   }
                   else{
                       isWrapper = ($(args.target).hasClass("e-tileview") || ($(args.target).find(".e-tileview").length && $(args.target).closest(".e-fileexplorer").length));
                   }
                   if (isWrapper && proxy._sourcePath == proxy._originalPath)
                       proxy._activeSource = proxy.model.selectedItems;
                   if (isWrapper) {
                       proxy._setSelectedItems([]);
                       if (ej.isNullOrUndefined(proxy._copiedNodes) || !args.element.hasClass("e-file-draggable"))
                           return;
                       _clonedElement.hide();
                       proxy.element.find(".e-blur").removeClass("e-blur");
                       if (proxy._currentPath == proxy._sourcePath + proxy._fileName + "/")
                           return;
                       proxy._cut_copy();
                       _clonedElement && _clonedElement.remove();
                   }
                   if (proxy._expandTimer != null) {
                       window.clearTimeout(proxy._expandTimer);
                       proxy._expandTimer = null;
                   }
                   if (_previousDroppable)
                    _previousDroppable.style.cursor = _defaultCursor;
                   document.body.style.cursor = '';
                   proxy.element.find(".e-blur").removeClass("e-blur");
                  if (!args.element.dropped && ((($(args.target).hasClass('e-tree-wrapper') || $(args.target).parents('.e-tree-wrapper').length > 0) && !$(args.target).is('a'))
                       || (!$(args.target).hasClass("e-tile-wrapper") && !$(args.target).parents(".e-tile-wrapper").length > 0 && !$(args.target).hasClass("e-gridcontent") &&
                       !$(args.target).parents(".e-gridcontent").length > 0 && !$(args.target).hasClass('e-tree-wrapper') && !$(args.target).parents('.e-tree-wrapper').length > 0))) {
                       _clonedElement && _clonedElement.remove();
                   }
                   var eventArgs = { dropAction: "move", fileInfo: proxy._getSelectedItemDetails(proxy._sourcePath, proxy._copiedNodes), target: (_targetNode && _targetNode.length ? _targetNode : $(args.target)), targetElementName: proxy._selectedContent, targetPath: proxy._currentPath };
                   proxy._trigger("dragStop", eventArgs);
               },
               helper: function (event, ui) {
                   var _draggedElement, imgTag, innerEle, itemCount;
                   if (!ej.isNullOrUndefined(event.element)) {
                       if (!event.element.hasClass("e-file-draggable")) {
                           event.cancel = true;
                           return null;
                       }
                       if (proxy) {
                           _clonedElement = ej.buildTag('div.e-dragedNode e-fe');
                           var maxZ = ej.util.getZindexPartial(proxy.element);
                           _clonedElement.css({ "z-index": maxZ });
                           _clonedElement.addClass(proxy.model.cssClass + (proxy.model.enableRTL ? ' e-rtl' : ''));
                           _draggedElement = $(event.element).clone().addClass("dragClone");
                           imgTag = _draggedElement.find("img")
                           if (imgTag.length) {
                               innerEle = ej.buildTag('img.e-thumbImage', "", "", { src: imgTag.attr("src") });
                           } else {
                               innerEle = ej.buildTag('span', "", "", { "class": _draggedElement.find(".e-fe-icon").attr("class") });
                           }
                           if (proxy.model.selectedItems.length > 1) {
                               itemCount = ej.buildTag('div.e-count');
                               itemCount.text(proxy.model.selectedItems.length);
                               _clonedElement.append(itemCount);
                           }
                           _clonedElement.append(innerEle);
                           return _clonedElement.appendTo($("body"));
                       }
                   }
               }
           });
            nodes.ejDroppable({
                accept: nodes,
                drop: function (args, ui) {
                    if (_preventDrop || ej.isNullOrUndefined(proxy._copiedNodes) || !ui.draggable.hasClass("e-file-draggable"))
                        return;
                    $(ui.helper).hide();
                    var successCallback = function (preventClick) {
                        !preventClick && proxy._clickTarget(args);
                        if (proxy._currentPath == proxy._sourcePath + proxy._fileName + "/")
                            return;
                        var selectedFileDetails = proxy._getSelectedItemDetails(proxy._sourcePath, proxy._fileName);
                        proxy._cut_copy(true);
                        var eventArgs = { dropAction: "move", fileInfo: selectedFileDetails, target: $(args.dropTarget), targetPath: proxy._currentPath, targetFolder: proxy._selectedContent };
                        proxy._trigger("drop", eventArgs);
                    }
                    if (proxy.model.layout == "grid" && !$(args.dropTarget).hasClass("e-text")) {
                        proxy._gridObj.selectRows($(args.dropTarget).closest("tr").index());
                        successCallback(true);
                    }
                    else {
                        var treePath = proxy._getHoverTreeElementPath($(args.dropTarget));
                        !proxy._fileExplorer[treePath] ? proxy._getFileDetails(treePath, "", "", successCallback) : successCallback();
                    }
                    if ($("body").find('.e-dragedNode').length > 0) $("body").find('.e-dragedNode').remove();
                }
            });
        },

        _clickTarget: function (args) {
            if (!$(args.dropTarget).hasClass("e-text")) {
                if (this.model.layout == "grid") {
                    var index = $(args.dropTarget).closest("tr").index();
                    (index >= 0) ? this._gridObj.selectRows($(args.dropTarget).closest("tr").index()) : $(args.dropTarget).click();
                }
                else
                    this._triggerClick(args.dropTarget);
            }
            else
                this._treeObj && this._treeObj.selectNode(args.dropTarget);
        },

        _triggerClick: function (ele) {
            var tnode = $(ele).closest(".e-tilenode");
            (tnode.length > 0 && this._isDevice && $.isFunction($.fn.tap)) ? $(ele).trigger("tap") : $(ele).click();
        },

        _clearExpand: function (node) {
            if (this._expandTimer != null) {
                window.clearTimeout(this._expandTimer);
                this._expandTimer = null;
            }
        },
        
        _isRestrictedMove: function (element, text, hoverPath) {
            var path = null;
            if (element && element.find(".e-fe-lock").length) {
                path = hoverPath ? hoverPath : this._getFolderPath(this._updatePath(element, text));
                if (this._fileExplorer[path] && this._fileExplorer[path].length) {
                    for (var i = 0; i < this._fileExplorer[path].length; i++) {
                        if (this._fileExplorer[path][i].name == text && this._fileExplorer[path][i].permission)
                            return !this._fileExplorer[path][i].permission.Copy;
                    }
                }
                return false;
            }
            return false;
        },
        _createAddressBar: function () {
            this._addresstag = ej.buildTag('input.e-addressBar e-tool-input', "", {}, { id: this._ExplorerId + '_addressbar', type: "text" });
            this._addresstag.appendTo(this._toolBarItems.find("#" + this._ExplorerId + "Addressbar").html(""));
            var spanTag = $("<span class='e-fe-icon e-fe-folder'></span>");
            spanTag.insertBefore(this._addresstag);
            ej.browserInfo().name == "msie" && ej.ieClearRemover(this._addresstag[0]);
            this._addressBarEvents("_on");
        },
        _addressBarEvents: function (action) {
            this[action]($('#' + this._ExplorerId + '_addressbar'), "focus", this._inputFocusin);
            this[action]($('#' + this._ExplorerId + '_addressbar'), "keydown", this._searchPath);
            this[action]($('#' + this._ExplorerId + '_addressbar'), "blur", this._addressbarFocusout);
        },
        _inputFocusin: function (e) {
            $(e.target).select();
        },
        _updateAddressBar: function () {
            if (this._addresstag) {
                var temp = this._currentPath;
                if (this.model.rootFolderName.length > 0)
                    this._addresstag.val(temp.replace(this._initPath, "").replace(this._rootFolderName, this.model.rootFolderName));
                else
                    this._addresstag.val(temp.replace(this._initPath, ""));
            }
        },
        _onEpand: function (args) {
            if (this._splitObj.element.find(".e-cont1").hasClass("collapsed")) {
                if (this._splitIcon && this._splitIcon.find('.e-icon').hasClass("e-arrow-sans-left"))
                    this._splitIcon.find('.e-icon').addClass('e-arrow-sans-right').removeClass("e-arrow-sans-left");
            }
            else {
                if (this._splitIcon && this._splitIcon.find('.e-icon').hasClass("e-arrow-sans-right"))
                    this._splitIcon.find('.e-icon').addClass('e-arrow-sans-left').removeClass("e-arrow-sans-right");
            }
            this._reSizeHandler(args);
        },
        _createSplitPane: function () {
            var proxy = this;
            var pane1 = ej.buildTag('div');
            var pane2 = ej.buildTag('div');
            this._splittag = ej.buildTag('div#' + this._ExplorerId + '_splitter');
            pane1.addClass('e-cont1');
            pane2.addClass('e-cont2');
            this.model.enableRTL ? this._splittag.append(pane2, pane1) : this._splittag.append(pane1, pane2);
            var panesize = this.model.enableRTL ? [{}, { paneSize: this._isMobileOrTab ? "150px" : "25%" }] : [{ paneSize: this._isMobileOrTab ? "150px" : "25%" }, {}];
            this.element.append(this._splittag);
            this._splitObj = this._splittag.ejSplitter({
                enableAutoResize: true,
                animationSpeed: 50,
                width: "100%",
                cssClass: this.model.cssClass,
                enableRTL: this.model.enableRTL,
                allowKeyboardNavigation: this.model.allowKeyboardNavigation,
                height: this.element.height() - (this._toolBarItems ? this._toolBarItems.outerHeight() : 0),
                properties: panesize,
                expandCollapse: function (e) { proxy._onEpand(e); },
                resize: function (e) { proxy._reSizeHandler(e); }
            }).data('ejSplitter');
            var splitbar = this._splitObj.element.find(".e-splitbar");
            var borderWidth = splitbar.css("border-width");
            var splitterWidth = splitbar.css("width");
            splitbar.css({"width" : "0px", "border-width": "0px" });
            this._splitObj.refresh();
            splitbar.css({ "width": splitterWidth, "border-width": borderWidth });
            this._renderSplitIcon();
            var treeWrapper = ej.buildTag('div.e-tree-wrapper');
            pane1.append(treeWrapper);
            this._treetag = ej.buildTag('div#' + this._ExplorerId + '_treeView');
            treeWrapper.append(this._treetag);
            this._gridtag = ej.buildTag('div#' + this._ExplorerId + '_grid');
            pane2.append(this._gridtag);
            this._tileViewWrapper = ej.buildTag('div.e-tile-wrapper' + "#" + this._ExplorerId + '_tileWrapper', "", "", { tabindex: 0 });
            if (this.model.layout == "tile")
                this._tileViewWrapper.addClass("e-tileInfo-view");
            pane2.append(this._tileViewWrapper);
            this._tileViewWrapper.append("<div class='e-tile-content' > </div>");
            this._tileContent = this._tileViewWrapper.find(".e-tile-content");
            this._tileView = ej.buildTag('ul#' + this._ExplorerId + '_tileView');
            this._tileContent.append(this._tileView);

            this._statusbar = ej.buildTag('div', "", "", { tabindex: 0 });
            this._statusbar.insertAfter(this._tileView);
            pane2.append(this._statusbar);
            this.model.showFooter && this._createStatusBar();
            this._waitingPopup = this._splittag.find(".e-cont2").ejWaitingPopup({ showOnInit: false, cssClass: this.model.cssClass }).data("ejWaitingPopup");
            this._showHideSplitBar(false);
            this._showHideContextMenu();
            if (this.model.layout == "grid") {
                this._tileContent.parent().hide();
            }
            else {
                this._gridtag.hide();
            }
            this._createUploadBox();

        },
        _selectedFolder: function (targetNavigationPath) {
            var navigationPath = targetNavigationPath.replace(this._initPath, "");
            var selectedNode = this._treeObj.getSelectedNode();          
            var folders = navigationPath.split("/");
            var newFolders = folders.filter(function (val) { return val != ""; });
            if (newFolders.length > 1) this._isClicked = false;
            navigationPath && this._treeObj.selectNode(this._treeObj.element.find("li:first"));
            for (var j = 0; j < folders.length; j++) {
                if (folders[j] != "") {
                    selectedNode = this._treeObj.getSelectedNode();
                    if (!this._treeObj.isExpanded(selectedNode))
                        this._treeObj && this._treeObj.expandNode(selectedNode);
                    var childItems = selectedNode.find('ul:first>li').find('div:first .e-text');
                    for (var i = 0; i < childItems.length; i++) {
                        if ($(childItems[i]).text() == folders[j]) {
                            if (newFolders[newFolders.length - 1] == $(childItems[i]).text())
                                this._isClicked = true;
                            this._treeObj.selectNode(childItems[i].parentNode.parentNode);
                        }
                    }
                }
            }
            this._isClicked = true;
        },
        _setSelectedItems: function (selectedItems) {
            var realName;
            if (this._suggestionItems.length) {
                realName = selectedItems;
                selectedItems = this._selectedItems;
            }
            if (typeof selectedItems == "string")
                selectedItems = [selectedItems];
            this._removeOldSelectionDetails();
            if (this.model.layout == "grid") {
                this._gridObj.clearSelection();
                var _ctrlKey = this._gridObj.multiSelectCtrlRequest;
                this._gridObj.multiSelectCtrlRequest = true;
                var nodes = this._gridtag.find(".e-gridcontent tr");
                for (var j = 0; j < selectedItems.length; j++) {
                    var nodes = $("#" + this._ExplorerId + " .e-gridcontent td:contains(" + (realName ? realName[j] : selectedItems[j]) + ")");
                    for (var i = 0; i < nodes.length; i++) {
                        if (this._suggestionItems.length ? this._originalPath + selectedItems[j] == $(nodes[i]).closest("tr").attr("data-parent-path") + $(nodes[i]).text()  : selectedItems[j] == $(nodes[i]).text()) {
                            this._gridObj.selectRows($(nodes[i]).closest("tr").index());
                            break;
                        }
                    }
                }
                this._recordClick();
                this._gridObj.multiSelectCtrlRequest = _ctrlKey;
            }
            else {
                this.items.removeClass("e-active").attr("aria-selected", false);
                var nodes = this._tileView.find(".e-tilenode");
                for (var j = 0; j < selectedItems.length; j++) {
                    for (var i = 0; i < nodes.length; i++) {
                        var name = this.model.layout == "tile" ? $(nodes[i]).find(".e-file-name").text() : $(nodes[i]).text();
                        if (this._suggestionItems.length ? this._originalPath + selectedItems[j] == $(nodes[i]).attr("data-parent-path") + name : selectedItems[j] == name) {
                            var e = { keyCode: 91, ctrlKey: true, currentTarget: nodes[i], target: nodes[i] };
                            this._upDatePathFromTileView(e);
                            break;
                        }
                    }
                }
            }
        },
        _refreshTreeScroller: function (args) {
            if (ej.isNullOrUndefined(this.element)) return;
            if (this.model.enableRTL) {
                this._treeScroll.model.scrollLeft = 0;
            }
            this._treeScroll && this._treeScroll.refresh();
        },
        _createStatusBar: function () {
            this._statusbar.addClass("e-statusbar");
            this._itemStatus = ej.buildTag('div.e-itemStaus');
            this._selectedItemsTag = ej.buildTag('div.e-itemStaus e-selected-items');
            this._switchBtn = ej.buildTag('div.e-switchView');
            this._statusbar.append(this._switchBtn, this._itemStatus, this._selectedItemsTag);
            if (this.model.enableResize) {
                this._resizeItem = ej.buildTag("div.e-icon e-fe-resize e-resize-handle");
                this._resizeItem.insertBefore(this._switchBtn);
            }
            var setHeight = this._splittag.find(".e-cont2").outerHeight() - this._statusbar.outerHeight();
            this._gridtag.height(setHeight);
            var button = ej.buildTag('button.e-switchGridView#' + this._ExplorerId + '_switchGridView', "", {}, { title: this._getLocalizedLabels("Grid"), tabindex: 0 });
            this._switchBtn.append(button);
            button.ejButton({ type: "button",  size: "normal", contentType: "imageonly", prefixIcon: "e-icon e-fe-grid" });
            button = ej.buildTag('button.e-swithListView#' + this._ExplorerId + '_swithListView', "", {}, { title: this._getLocalizedLabels("LargeIcons"), tabindex: 0 });
            this._switchBtn.append(button);
            button.ejButton({ type: "button",  size: "normal", contentType: "imageonly", prefixIcon: "e-icon e-fe-largeicons" });
            this.model.layout == "grid" && this._statusbar.find(".e-switchGridView").addClass("e-active");
            this.model.layout == "largeicons" && this._statusbar.find(".e-swithListView").addClass("e-active");
            this._statusBarEvents("_off");
            this._statusBarEvents("_on");
        },
        _statusBarEvents: function (action) {
            this[action](this._statusbar, "focus", this._focusStatusBar);
            this[action](this._statusbar.find("button"), "focus", this._focusStatusBarButton);
            this[action](this._statusbar.find("button"), "blur", this._blurStatusBarButton);
            this[action](this._statusbar, "blur", this._blurStatusBar);
            this.model.allowDragAndDrop && this[action](this._statusbar, "dragover", this._preventDropOption);
        },
        _focusStatusBar: function (e) {
            if (!this._statusbar.hasClass("e-focus")) {
                this._statusbar.addClass("e-focus");
                this._itemList = this._switchBtn.find("button");
                this._on(this._statusbar, "keydown", this._OnKeyDown);
                this._hidePopup();
            }
        },
        _focusStatusBarButton: function(args){
            this._on(this._statusbar.find("button"), "keydown", this._check);
        },
        _blurStatusBarButton: function (args) {
            this._off(this._statusbar.find("button"), "keydown", this._check);
        },
        _blurStatusBar: function (e) {
            this._statusbar.removeClass("e-focus");
            this._off(this._statusbar, "keydown", this._OnKeyDown);
        },
        _check: function (args) {
			var changed;
			if (this.model.layout == ej.FileExplorer.layoutType.Grid) {
                this.model.layout = ej.FileExplorer.layoutType.LargeIcons;
                changed = true;
            }
			else if (this.model.layout == ej.FileExplorer.layoutType.LargeIcons) {
                this.model.layout = ej.FileExplorer.layoutType.Grid;
                changed = true;
			}
			if (changed) {
                this._switchLayoutView();
            }
        },
        _refreshResizeHandler: function () {
            this._setMinMaxSizeInInteger();
            this.adjustSize();
            if (this.model.showFooter && this.model.enableResize)
                this._resizeFileExplorer();
        },
        _refreshResizeEventHandler: function (event) {
            var reElement = $(event.element).parents("div.e-fileexplorer");
            this.model.height = $(reElement).outerHeight();
            this.model.width = $(reElement).outerWidth();
            this.element.css({ "height": this.model.height, "width": this.model.width });
            this.adjustSize();
        },
        _convertPercentageToPixel: function (parent, child) {
            return Math.round((child * parent) / 100);
        },
        _getProperValue: function (value) {
            if (value == null) return null;
            else return !isNaN(value) ? value : value;
        },
        _setMinMaxSizeInInteger: function () {
            var parentObj;
            this._minWidth = parseInt(this.model.minWidth);
            this._minHeight = parseInt(this.model.minHeight);
            this._maxWidth = parseInt(this.model.maxWidth);
            this._maxHeight = parseInt(this.model.maxHeight);
            parentObj = this.element.parent()[0].nodeName == "BODY" ? $(window) : $(this.element.parent()[0]);
            if (isNaN(this.model.minWidth) && (this.model.minWidth.indexOf("%") > 0))
                this._minWidth = this._convertPercentageToPixel(parentObj.outerWidth(), this._minWidth);
            if (isNaN(this.model.minHeight) && (this.model.minHeight.indexOf("%") > 0))
                this._minHeight = this._convertPercentageToPixel(parentObj.outerHeight(), this._minHeight);
            if (isNaN(this.model.maxWidth) && (this.model.maxWidth.indexOf("%") > 0))
                this._maxWidth = this._convertPercentageToPixel(parentObj.innerWidth(), this._maxWidth);
            if (isNaN(this.model.maxHeight) && (this.model.maxHeight.indexOf("%") > 0))
                this._maxHeight = this._convertPercentageToPixel(parentObj.innerHeight(), this._maxHeight);
        },
        _resizeFileExplorer: function () {
            var proxy = this;
            this.element.find("div.e-fe-resize").ejResizable(
                {
                    minHeight: proxy._minHeight,
                    minWidth: proxy._minWidth,
                    maxHeight: proxy._maxHeight,
                    maxWidth: proxy._maxWidth,
                    resizeStart: function (event) {
                        proxy._trigger("resizeStart", { event: event });
                    },
                    resize: function (event) {
                        proxy._refreshResizeEventHandler(event);
                        proxy._trigger("resize", { event: event });                       
                    },
                    resizeStop: function (event) {
                        proxy._refreshResizeEventHandler(event);
                        proxy._trigger("resizeStop", { event: event });
                    },
                    helper: function (event) {
                        return $(proxy.element);
                    }
                });
        },
        _showHideSplitBar: function (option) {
            this._splittag.show();
            if (this._splitObj.model.properties[1].paneSize == 0) {
                this.element.find(".e-splitbar").show();
                this._splitObj.expand(1);
                if (!this._gridtag.hasClass("e-grid") && option) {
                    this._updateData();
                }
            }
            else if (this._splitObj.model.properties[0].paneSize == 0) {
                this.element.find(".e-splitbar").show();
                this._splitObj.expand(0);
                this._treetag.parent(".e-tree-wrapper").css("display", "block");
            }
            if (!this.model.showNavigationPane) {
                this.model.enableRTL?this._splitObj.collapse(1):this._splitObj.collapse(0);
                this.element.find(".e-splitbar").hide();
                if (!this._gridtag.hasClass("e-grid") && option) {
                    this._updateData();
                }
            }
        },
        _updateTreePath: function (args) {
            this._suggestionItems = [];
            this._toDownload = false; this._toUpload = this._toEdit = this._toEditContents = this._toRead = this._toCopy = true;
            this._removeBlurEffect();
            this._searchbar && this._searchbar.val("");
            if (this.model.rootFolderName.length > 0 && args.value == this.model.rootFolderName && this._treeObj.element.find('li:first > div > .e-text').hasClass("e-active"))
                this._selectedTreeText = this._selectedContent = this._rootFolderName;
            else
                this._selectedTreeText = this._selectedContent = args.value;
            this._selectedNode = args.currentElement;
            var node = $(this._selectedNode.parents('li.e-item')[0]);
            this._parentNode = node.length != 0 ? node : this._selectedNode;
            this._nodeType = "Directory";
            if (this._initUpdate) {
                this._currentPath = this._updatePath(args.currentElement, args.value);
            } else
                this._initUpdate = true;            
            this._updateOnNodeSelection && this._updateData();
            this._originalPath = this._currentPath;
            if (!this._isStateNavigation) {
                if (!ej.isNullOrUndefined(this._currentState)) {
                    for (var i = this._selectedStates.length - 1; i > this._currentState; i--)
                        this._selectedStates.pop();
                    this._toolBarItems && this._disableToolbarItem("Forward");
                }
                if (this._selectedStates[this._selectedStates.length - 1] != this._originalPath) {
                    this._currentState = this._selectedStates.length;
                    this._selectedStates.push(this._originalPath);
                    this._selectedStates.length == 2 && this._toolBarItems && this._enableToolbarItem("Back");
                }
            }
            this._updateAccessRules(this._originalPath);
            this._updateToolbarItems();
            this._updateNewFolderTool(this._toRead && this._toEditContents);
            if (!node.length) {
                this._disableEditingTools();
                this._toolBarItems && this._disableToolbarItem("Copy");
            }
            this.model.selectedFolder = this._currentPath;
            this._updateAddressBar();
            this._currntNode = this._selectedNode.find("> div > .e-text");
            this.model.selectedItems = [];
            this._filteredItemsName = [];
            this._selectedItems = [];
            this._selectedTileItems = [];
            var parentPath = this._getFolderPath();
            if (this._isClicked && !this._isTileViewClick && !this._isGridViewClick) {
                var args = { name: [args.value], names: [args.value], path: parentPath, nodeType: this._nodeType, selectedItems: this._getSelectedItemDetails(parentPath, this._selectedContent) };
                this._trigger("select", args);
            }
            if (this._isTileViewClick) this._isTileViewClick = false;
            if (this._isGridViewClick) this._isGridViewClick = false;
        },
        _modifySelectedStates: function (startsWith, replace) {
            var proxy = this;            
            $.each(proxy._selectedStates, function (index, path) {
                if (path && path.startsWith(startsWith))
                    proxy._selectedStates[index]= (replace ? proxy._selectedStates[index].replace(startsWith, replace): replace);                                                            
            });            
        },
        _onBeforeCollapse: function (args) {           
           this._collapse = true;
        },
        _updatePath: function (node, val) {
            var parentPath = "";
            var unnecesaryULtags = 1;
            for (var i = 0; i < node.parents("ul").length - unnecesaryULtags; i++) {
                if ($(node.parents("ul")[i]).siblings("div").find("a").text())
                    parentPath = $(node.parents("ul")[i]).siblings("div").find("a").text() + "/" + parentPath;
            }
            if (this.model.rootFolderName.length > 0)
                return this._changeName(this._initPath + parentPath + val + "/", true);
            else
                return this._initPath + parentPath + val + "/";
        },
        _updatePathFromGrid: function (args) {
            if (!(this._searchbar && $.trim(this._searchbar.val())))
                this._suggestionItems = [];
            if (this.model.showCheckbox && this._changeCheckState) {
                if (!this.model.allowMultiSelection) {
                    this._gridtag.find(".e-grid-row-checkbox").ejCheckBox({ "checked": false });
                }
                $(args.target).closest(".e-chkbox-wrap").length && this._checkChange(args.row);
                if ((args.target && $(args.target).closest(".e-chkbox-wrap").length == 0) || ej.isNullOrUndefined(args.target))
                    this._recordClick();
            }
            this._FilteredFiles = [];
            var proxy = this, target = $(args.target).closest("td.e-rowcell");
            this._addFocus(this._gridtag.find(".e-gridcontent"));
            var isFolder, _isUpdate = true;
            this._toDownload = this._toUpload = this._toEdit = this._toEditContents = this._toRead = this._toCopy = true;
            this._isTreeNode = false;
            var _childItems;
            this._selectedItems = [];
            var sizeInByte = 0;
            this._selectedRecords = this._gridtag.ejGrid("getSelectedRecords");
            var index = $.inArray(undefined, this._selectedRecords);
            if (index > -1)
                this._selectedRecords.splice(index, 1);
            for (var record = 0; record < this._selectedRecords.length; record++) {
                if (!this._selectedRecords[record]) return;
                if (this._suggestionItems && this._suggestionItems.length) {
                    name = this._selectedRecords[record].filterPath.replace(this._originalPath, "") + this._selectedRecords[record].name;
                    this._selectedItems.push(name);
                    var filename = this._selectedRecords[record].filterPath + this._selectedRecords[record].name;
                    if ($.inArray(filename, this._FilteredFiles) < 0) this._FilteredFiles.push(this._selectedRecords[record].filterPath + this._selectedRecords[record].name);
                }
                else {
                    if (this._selectedRecords[record])
                    { this._selectedItems.push(this._selectedRecords[record].name); }
                }
                if (this._selectedRecords[record]) {
                    sizeInByte += this._selectedRecords[record].sizeInByte;
                }
                if (this._selectedRecords[record]) {
                    if (!this._selectedRecords[record].isFile) {
                        _isUpdate = false;
                        this._toDownload = false;
                    }
                }
                this._updateAccessValue(this._selectedRecords[record]);
            }
            if (this._currentPath != this._originalPath) {
                this._currentPath = this._originalPath;
            }
            $.each((proxy._suggestionItems.length > 0 ? proxy._suggestionItems : proxy._fileExplorer[proxy._originalPath]), function (index, value) {
				if(!value) return;
				if(!args.data) return;
                if (value.name == args.data.name && !value.isFile)
                    isFolder = true;
            });
            if (isFolder) {
                this._nodeType = "Directory";
                if (target.hasClass('e-active'))
                    this._updateNode(args.data.name);
            }
            else {
                this._nodeType = "File";
            }
            var _nodeType = this._nodeType;
            this._currntNode = target[0] != null && target.parent("tr");
            this._selectedContent = this._selectedItems[this._selectedItems.length - 1];
            if (!target.hasClass('e-active') && this._selectedRecords.length > 0) {
                this._selectedContent = this._selectedItems[this._selectedItems.length - 1];
                this._nodeType = this._selectedRecords[this._selectedRecords.length - 1].isFile ? "File" : "Directory";
                if (this._nodeType == "Directory")
                    this._updateNode(this._selectedContent);
            }
            this._selectedItemsTag && this._selectedItemsTag.html((this._selectedItems.length > 0 ? (this._selectedItems.length + " " + (this._selectedItems.length > 1 ? this._getLocalizedLabels("Items") : this._getLocalizedLabels("Item")) + " " + this._getLocalizedLabels("Selected")) : "") + (sizeInByte ? (_isUpdate ? "  " + this._bytesToSize(sizeInByte) : "") : ""));
            this._setFilteredItemsName();
            this.model.selectedItems = this._filteredItemsName;
            var data = { name: this._selectedItems, names: this._selectedItems, path: this.model.selectedFolder, nodeType: this._nodeType, selectedItems: this._getSelectedItemDetails(this.model.selectedFolder, this._filteredItemsName) };
            this._urlTag && this._urlTag.find("input").val(data.path);
            this._nameTag && this._nameTag.find("input").val(data.name);
            this._updateSelectionDetails(this._nodeType);
            if (this._isClicked)
                if (!args.target || (target && target.hasClass("e-active")))
                    this._trigger("select", data);
                else {
                    var name = (this._suggestionItems && this._suggestionItems.length) ? (args.data.filterPath.replace(this._originalPath, "") + args.data.name) : args.data.name;
                    var data = { name: name, names: [name], path: this.model.selectedFolder, nodeType: _nodeType, unselectedItem: args.data, unselectedItems: [args.data] };
                    this._trigger("unselect", data);
                }
        },
        _enableEditingTools: function () {
            if (!this._editingToolsState && this._toolBarItems) {
                var items = ["Rename", "Delete", "Cut"];
                for (var i = 0; i < items.length; i++) {
                    this._enableToolbarItem(items[i]);
                }
                this._editingToolsState = true;
            }
        },
        _enableToolbarItem: function (suffixID) {
            if (this._restrictedToolbarOptions.indexOf(suffixID) < 0)
            {
                var id = this._ExplorerId + suffixID.replace(/ /g, '');
                if (this._toolBarObj && this._toolBarObj.itemsContainer.find("li#" + id).hasClass("e-disable"))
                    this._toolBarObj.enableItemByID(id);
            }            
        },
        _disableToolbarItem: function (suffixID) {
            var id = this._ExplorerId + suffixID.replace(/ /g, '');
            if (this._toolBarObj && !this._toolBarObj.itemsContainer.find("li#" + id).hasClass("e-disable"))
                this._toolBarObj.disableItemByID(id);
        },

        _disableEditingTools: function () {
            if (this._toolBarItems) {
                var items = ["Rename", "Delete", "Cut"];
                for (var i = 0; i < items.length; i++) {
                    this._disableToolbarItem(items[i]);
                }
                this._editingToolsState = false;
            }
        },
        _clearTileCheckBoxSelection: function () {
            if (this.model.showCheckbox) {
                this._tileView.find(".e-tile-checkbox ").ejCheckBox({ "checked": false });
            }
        },
        _upDatePathFromTileView: function (event) {
            var $target = $(event.target);
            if (event["pointerType"] == "touch" && this._customPop != null && this.model.allowMultiSelection) {
                if (!this._customPop.is(":visible"))
                    this._customPop.show();
                if (this._customPop.is(":visible") && !this._customPop.find(".e-rowselect").hasClass("e-spanclicked")) {
                    var offset = $target.offset();
                    this._customPop.offset({ left: offset.left - 40, top: offset.top - 40 });
                }
                else
                    event.ctrlKey = true;
            }
            else
                this._hidePopup();
            if (!(this._searchbar && $.trim(this._searchbar.val())))
                this._suggestionItems = [];
            if (!event.innerEvent)
                this._lastItemIndex = $(event.currentTarget).index();
            this._addFocus(this._tileViewWrapper);
            this._isTreeNode = false;
            var proxy = this;
            var checkboxObj;
            if(this.model.showCheckbox){
                checkboxObj = $(event.target).closest(".e-tilenode").find(".e-tile-checkbox").data("ejCheckBox");
                if ($(event.target).hasClass("e-chk-image"))
                    event.ctrlKey = this.model.showCheckbox;
            }
            if (!event.shiftKey) {
                var _unselectedItem = [];
                if ((!event.ctrlKey || !this.model.allowMultiSelection) && this.element.find(".e-fe-selection-rect").length <= 0) {
                    this._sizeInByte = 0;
                    this._selectedItems = [];
                    this._selectedTileItems = [];
                    $(event.currentTarget).siblings().removeClass("e-active").attr("aria-selected", false);
                    $(event.currentTarget).removeClass("e-active").attr("aria-selected", false);
                    this._clearTileCheckBoxSelection();
                    this._unselectEvent();
                }
                if ($(event.currentTarget).hasClass("e-active")) {
                    $(event.currentTarget).removeClass("e-active").attr("aria-selected", false);
                    checkboxObj && checkboxObj.option("checked", false);
                }
                else {
                    $(event.currentTarget).addClass("e-active").attr("aria-selected", true);
                    checkboxObj && checkboxObj.option("checked", true);
                }
                var nodeType = "File", _childItems, _isUpdate = true;
                this._toDownload = this._toUpload = this._toEdit = this._toEditContents = this._toRead = this._toCopy = true;
                var name = $(event.currentTarget).find(".e-file-name").text();
                if (this._currentPath != this._originalPath) {
                    this._currentPath = this._originalPath;
                }
                var items = this._suggestionItems.length ? this._suggestionItems : this._fileExplorer[this._originalPath];
                if (items) {
                    for (var i = 0; i < items.length; i++) {
                        if ((this._suggestionItems < 1 && items[i].name == name) || (this._suggestionItems.length > 0 && items[i].filterPath == $(event.currentTarget).attr('data-parent-path') && items[i].name == name)) {
                            if ($(event.currentTarget).hasClass("e-active")) {
                                this._sizeInByte += items[i].sizeInByte;
                                this._selectedTileItems.push(items[i]);
                            } else if (event.ctrlKey) {
                                this._sizeInByte -= items[i].sizeInByte;
                                var index = $.inArray(items[i], this._selectedTileItems);
                                if (index > -1) {
                                    _unselectedItem.push(this._selectedTileItems[index]);
                                    this._selectedTileItems.splice(index, 1);
                                }
                            }
                            break;
                        }
                    }
                }
                $.each(this._selectedTileItems, function (index, value) {
                    if (!value.isFile) {
                        proxy._update = false;
                        _isUpdate = false;
                        proxy._toDownload = false;
                    }
                    proxy._updateAccessValue(value);
                });

                this._FilteredFiles = [];
                for (var i = 0; i < this._selectedTileItems.length; i++) {
                    this._FilteredFiles.push(this._selectedTileItems[i].filterPath + this._selectedTileItems[i].name)
                }

                if ($(event.currentTarget).find(".e-fe-folder").length) {
                    nodeType = "Directory";
                    if ($(event.currentTarget).hasClass("e-active"))
                        this._updateNode(name);
                }
                this._currntNode = $(event.currentTarget);
                if (this._currntNode.attr("data-parent-path")) {                    
                    name = this._currntNode.attr("data-parent-path").replace(this._originalPath, "") + name;
                }                
                this._selectedContent = name;
                if ($(event.currentTarget).hasClass("e-active"))
                    this._selectedItems.push(this._selectedContent);
                else {
                    var index = $.inArray(this._selectedContent, this._selectedItems), _unselectedContent = this._selectedContent, _nodeType = nodeType;
                    if (index > -1)
                        this._selectedItems.splice(index, 1);
                    if (this._selectedTileItems.length > 0) {
                        this._selectedContent = this._selectedItems[this._selectedItems.length - 1];
                        nodeType = this._selectedTileItems[this._selectedTileItems.length - 1].type;
                        if (nodeType == "Directory")
                            this._updateNode(this._selectedContent);
                    }
                }                
                if ((!this._startNode) || this._selectItems.length == 0 || this._selectItems.length == this._selectedItems.length) {
                    if (!this._selectItems || this._selectItems.length <= 0)
                        this._startNode = null;
                    this._selectedItemsTag && this._selectedItemsTag.html((this._selectedItems.length > 0 ? (this._selectedItems.length + " " + (this._selectedItems.length > 1 ? this._getLocalizedLabels("Items") : this._getLocalizedLabels("Item")) + " " + this._getLocalizedLabels("Selected")) : "") + (this._sizeInByte ? (_isUpdate ? "  " + this._bytesToSize(this._sizeInByte) : "") : ""));
                    this._nodeType = nodeType;
                    this._setFilteredItemsName();
                    this.model.selectedItems = this._filteredItemsName;
                    var args = { name: this._selectedItems, names: this._selectedItems, path: this.model.selectedFolder, nodeType: this._nodeType, selectedItems: this._getSelectedItemDetails(this.model.selectedFolder, this._filteredItemsName) };
                    this._urlTag && this._urlTag.find("input").val(args.url);
                    this._nameTag && this._nameTag.find("input").val(args.name);
                    this._updateSelectionDetails(this._nodeType);
                    if (this._isClicked)
                        if ($(event.currentTarget).hasClass("e-active"))
                            this._trigger("select", args);
                        else {
                            var args = { name: _unselectedContent, names: [_unselectedContent], path: this.model.selectedFolder, nodeType: _nodeType, unselectedItem: _unselectedItem[0], unselectedItems: _unselectedItem };
                            this._trigger("unselect", args);
                        }
                    this._selectItems = [];
                }                
            } else {
                this._selectItems = [];
                if (!this._startNode)
                    this._startNode = this._currntNode;
                var startIndex = $(event.currentTarget).index();
                var endIndex = this._startNode.index();
                if (startIndex > endIndex) {
                    var temp = startIndex;
                    startIndex = endIndex;
                    endIndex = temp;
                }
                var items = this._tileContent.find(".e-tilenode");
                items.removeClass("e-active").attr("aria-selected", false);
                for (var i = startIndex ; i <= endIndex; i++) {
                    this._selectItems.push($(items.get(i)).find(".e-file-name").text());
                }
                this._setSelectedItems(this._selectItems);
            }
        },
        _setFilteredItemsName: function () {
            this._filteredItemsName = [];
            for (var i = 0; i < this._selectedItems.length; i++) {
                var names = this._selectedItems[i].split('/');
                this._filteredItemsName.push(names[names.length - 1] ? names[names.length - 1] : names[names.length - 2]);
            }
        },
        _getOriginalName: function(path){
            var names = path.split('/');
             return (names[names.length - 1] ? names[names.length - 1] : names[names.length - 2]);
        },
        _updateNode: function (name) {
            this._currentPath += name + "/";
        },
        _getFileURL: function () {
            if (this._nodeType == "File") {
                if ((/\.(gif|jpg|jpeg|tiff|png|bmp)$/i).test(this._selectedContent)) {
                    this._widthTag && this._widthTag.show().removeClass("e-hide");
                    this._heightTag && this._heightTag.show().removeClass("e-hide");
                } else {
                    this._widthTag && this._widthTag.hide().addClass("e-hide");
                    this._heightTag && this._heightTag.hide().addClass("e-hide");
                }
                return (this._currentPath.replace("~", "..") + this._selectedContent);
            }
            else
                return "";
        },
        _updateData: function () {
            var data = this._fileExplorer[this._currentPath];
            this._selectedItemsTag && this._selectedItemsTag.html("");
            if (data && !this._update) {
                this._itemStatus && this._itemStatus.html(data.length + " " + (data.length == 1 ? this._getLocalizedLabels("Item") : this._getLocalizedLabels("Items")));
                var sortingoption = this.model.gridSettings.columns[0];
                var sortingtype = true;
                var initialsort = true;
                this._changeActiveSortedoption(sortingoption.headerText, initialsort);
                this._sorting(sortingoption.field, sortingtype, data);
                var details = this._sorteditems;
                this.model.layout == "grid" ? this._renderGridView(details) : this._renderTileView(details);
            }
            else {
                this._read();
            }
        },

        _addChild: function (result, targetNode) {
            var directories = [];
            if (result) {
                for (var i = 0; i < result.length; i++) {
                    if (!result[i].isFile) {
                        result[i].id = result[i].name;
                        result[i].spriteCssClass = (result[i].permission && !result[i].permission.Read) ? "e-fe-icon e-fe-folder e-fe-lock" : "e-fe-icon e-fe-folder";
                        directories.push(result[i]);
                    }
                }
            }
            this._nodeExpanded = true;
            var selectedNode = targetNode ? $(targetNode).closest('li.e-item') : this._treeObj.getSelectedNode();
            directories.length && this._treeObj.addNode(directories, selectedNode);
            var ele = selectedNode.find(".e-load");
            ele && ((ele.hasClass('e-plus') || ele.hasClass('e-minus')) ? ele.removeClass('e-load') : ele.removeClass('e-icon e-load'));
            this._nodeExpanded = false;
            this._treetag.find("li").removeAttr("tabindex");
            var items = this._treetag.find("li div a").not(".e-js");
            if (items.length && this.model.allowDragAndDrop) {
                this._drag(items);
                items.addClass("e-file-draggable");
            }
        },

        _createContextMenuTag: function (menuOptions, menuDetails, events) {
            var contextMenu = $("body").find('#' + menuDetails.id + 'ContextMenu');
            var ContextMenutag = contextMenu.length ? contextMenu : ej.buildTag('ul.fe-context-menu #' + menuDetails.id + 'ContextMenu');
            ContextMenutag.ejMenu({
                menuType: ej.MenuType.ContextMenu,
                enableSeparator: true,
                enableRTL: this.model.enableRTL,
                cssClass: this.model.cssClass,
                contextMenuTarget: menuDetails.targetId,
                beforeOpen: events.beforeOpen,
                open: events.open,
                close: events.close,
                click: events.click,
                fields: { dataSource: menuOptions, id: "id", text: "text", htmlAttribute: "htmlAttr", spriteCssClass: "sprite" },
            });
            ContextMenutag.hide();
            return ContextMenutag;
        },

        _beforeOpenContextMenu: function (args) {
            if (!$(args.target).hasClass("e-text"))
                args.cancel = true;
            else {
                this._menuNode = $(args.target).closest('li.e-item');
                (this._treeObj) && this._treeObj.element.find('.e-node-focus').removeClass('e-node-focus');
                this._menuNode.find('> div > .e-text:first').addClass('e-node-focus');
                args.dataSource = this._treeMenuOptions.slice();
                args.contextMenu = "navbar";
                args.element = this._treeMenuObj.element;
                if (this._trigger("menuBeforeOpen", args)) return false;
                (JSON.stringify(this._treeMenuObj.model.fields.dataSource) != JSON.stringify(this._treeMenuOptions)) && this._treeMenuObj.option("fields", { dataSource: args.dataSource });
                for (var i = 0; i < this._restrictedMenuOption.length; i++) {
                    this._treeMenuObj && this._treeMenuObj.disableItem(this._restrictedMenuOption[i]);
                }
                (this._toRead && this._toEdit) ? this._enableEditingMenus() : this._disableEditingMenus();
                (this._toRead && this._toCopy) ? (this._restrictedMenuOption.indexOf(this._menuCopy) < 0 && this._treeMenuObj.enableItem(this._menuCopy)) : this._treeMenuObj.disableItem(this._menuCopy);
                this._toRead ? (this._restrictedMenuOption.indexOf(this._menuOpen) < 0 && this._treeMenuObj.enableItem(this._menuOpen)) : this._treeMenuObj.disableItem(this._menuOpen);
                (this._toRead && this._toEditContents) ? (this._restrictedMenuOption.indexOf(this._menuNewFolder) < 0 && this._treeMenuObj.enableItem(this._menuNewFolder)) : this._treeMenuObj.disableItem(this._menuNewFolder);
                (this._toRead && this._toUpload) ? (this._restrictedMenuOption.indexOf(this._menuUpload) < 0 && this._treeMenuObj.enableItem(this._menuUpload)) : this._treeMenuObj.disableItem(this._menuUpload);
                if ($(args.target).parents("li.e-item:first").attr("id") == 1) {
                    this._disableEditingMenus();
                }
            }
        },

        _beforeOpenTileContextMenu: function (args) {
            if ($(args.target).closest('th.e-headercell').hasClass('e-col-check'))
                this._headCheckObj.wrapper.click();
            if ($(args.target).hasClass("e-scrollbar") || $(args.target).parents().hasClass("e-scrollbar") || $(args.target).closest('th.e-headercell').hasClass('e-col-check')) {
                args.cancel = true;
                return;
            }
            if (!$(args.target).hasClass('e-rowcell') && !$(args.target).closest('td.e-rowcell').hasClass('e-col-check') && $(args.target).closest('td.e-rowcell').length > 0 && !$(args.target).closest('td.e-rowcell').hasClass('e-active') && args.events && (args.events.button == 2 || args.events.which == 3))
                this._updateGridSelection(args);
            else if (($(args.target).hasClass("e-file-info") || $(args.target).hasClass("e-thumb-image") || $(args.target).closest(".e-thumb-image").length > 0 || $(args.target).closest(".e-tilenode").length > 0) && $(args.target).closest('.e-chkbox-wrap').length == 0 && !$(args.target).closest(".e-tilenode").hasClass("e-active"))
                this._updateTileSelection(args);
            if ($(args.target).is(".e-tilenode.e-active") || $(args.target).closest(".e-tilenode").hasClass("e-active") || $(args.target).closest('td.e-rowcell').is(".e-active") || ((args.events.ctrlKey || args.events.shiftKey || $(args.target).closest('td.e-rowcell').hasClass('e-col-check') || $(args.target).closest('.e-chkbox-wrap').length > 0) && ($(this.items).hasClass('e-active') || $(this.gridItems).find('td').hasClass('e-active')))) {
                args.dataSource = this._fileMenuOptions.slice();
                args.contextMenu = "files";
                args.element = this._viewMenuObj.element;
            }
            else {
                if ($(args.events.currentTarget).hasClass("e-grid") && ($(args.target).hasClass("e-gridcontent") || $(args.target).hasClass("e-content") || $(args.target).hasClass("e-table") || !$(args.target).is(".e-rowcell.e-active"))) {
                    this._gridObj.clearSelection();
                    if (this.model.showCheckbox) {
                        this._gridtag.find(".e-grid-row-checkbox").ejCheckBox({ "checked": false });
                        this._gridtag.find("#headchk").ejCheckBox({ "checked": false });
                    }
                }
                if ($(args.events.currentTarget).hasClass("e-tile-wrapper") && ($(args.target).hasClass("e-tile-wrapper") || $(args.target).hasClass("e-tile-content") || $(args.target).hasClass("e-tileview") || !($(args.target).is(".e-tilenode.e-active") || $(args.target).parent(".e-tilenode").hasClass("e-active")))) {
                    this.model.showCheckbox && this._clearTileCheckBoxSelection();
                    if (this.items.hasClass("e-active"))
                        this.items.removeClass("e-active").attr("aria-selected", false);
                }
                this._updateCurrentPathPermission();
                args.dataSource = this._cwdMenuOptions.slice();
                args.contextMenu = "cwd";
                args.element = this._viewMenuObj.element;
            }
            if (this._trigger("menuBeforeOpen", args)) return false;
            (JSON.stringify(this._viewMenuObj.model.fields.dataSource) != JSON.stringify(args.dataSource)) && this._viewMenuObj.option("fields", { dataSource: args.dataSource });
            for (var i = 0; i < this._restrictedMenuOption.length; i++) {
                this._viewMenuObj && this._viewMenuObj.disableItem(this._restrictedMenuOption[i]);
            }
            if (!this._toRead || (!(/\.(bmp|dib|jpg|jpeg|jpe|jfif|gif|tif|tiff|png|ico)$/i).test(this.model.selectedItems) && this._nodeType == "File"))
                this._viewMenuObj && this._viewMenuObj.disableItem("Open");            
            else
                (this._restrictedMenuOption.indexOf(this._menuOpen) < 0) && this._viewMenuObj.enableItem("Open");
            if (!this._option || !this._toRead)
                this._viewMenuObj.disableItem(this._menuPaste);
            this._isupdate ? (this._restrictedMenuOption.indexOf(this._menuDownload) < 0 && this._viewMenuObj.enableItem(this._menuDownload)) : this._viewMenuObj.disableItem(this._menuDownload);
            (this._searchbar && $.trim(this._searchbar.val())) ? (this._restrictedMenuOption.indexOf(this._menuOpenFolderLocation) < 0 && this._viewMenuObj.enableItem(this._menuOpenFolderLocation)) : this._viewMenuObj.disableItem(this._menuOpenFolderLocation);
            (this._toRead && this._toDownload) ? (this._restrictedMenuOption.indexOf(this._menuDownload) < 0 && this._viewMenuObj.enableItem(this._menuDownload)) : this._viewMenuObj.disableItem(this._menuDownload);
            (this._toRead && this._toUpload) ? (this._restrictedMenuOption.indexOf(this._menuUpload) < 0 && this._viewMenuObj.enableItem(this._menuUpload)) : this._viewMenuObj.disableItem(this._menuUpload);
            (this._toRead && this._toEdit) ? this._enableEditingMenus() : this._disableEditingMenus();
            (this._toRead && this._toCopy) ? (this._restrictedMenuOption.indexOf(this._menuCopy) < 0 && this._viewMenuObj.enableItem(this._menuCopy)) : this._viewMenuObj.disableItem(this._menuCopy);
            this._hasEditContentsPermission(this._originalPath) ? (this._restrictedMenuOption.indexOf(this._menuNewFolder) < 0 && this._viewMenuObj.enableItem(this._menuNewFolder)) : this._viewMenuObj.disableItem(this._menuNewFolder);
        },

        _contextMenuOpen: function (args) {
            args.contextMenu = (args.model.contextMenuTarget == this._ExplorerId + "_treeView") ? "navbar" : (this.model.selectedItems.length > 0 ? "files" : "cwd");
            args.element = args.contextMenu == "navbar" ? this._treeMenuObj.element : this._viewMenuObj.element;
            if (args.contextMenu == "cwd")
                var length=this.model.gridSettings.columns.length;
                for (var i = 0; i < length; i++) {
                    if (this._prevsortingoption == this.model.gridSettings.columns[i].field) {
                        this._changeActiveSortedoption(this.model.gridSettings.columns[i].headerText,false,true);
                    }
                }
            this._trigger("menuOpen", args);
        },

        _removeOldSelectionDetails: function (nodeType) {
            if (this._currentPath != this._originalPath) {
                this._currentPath = this._originalPath;
            }
            this._sizeInByte = 0;
            this._selectedItems = [];
            this._selectedTileItems = [];
            this.model.selectedItems = [];
            this._selectedContent = this._selectedTreeText;
            if (nodeType) this._nodeType = nodeType;
            else this._nodeType = "Directory";
            this._selectedItemsTag && this._selectedItemsTag.html("");
            this._toolBarItems && this._disableToolbarItem("Download");            
            this._viewMenuObj && this._viewMenuObj.disableItem(this._menuDownload);
            this._disableEditingTools();
        },
        _contextMenuClick: function (args) {
            this._treeObj.selectNode(this._menuNode);
            this._fileContextMenuClick(args);
        },
        _fileContextMenuClick: function (args) {
            if (this.model.ajaxAction == "" || this._currentPath == "")
                return;
            args.contextMenu = (args.model.contextMenuTarget == this._ExplorerId + "_treeView") ? "navbar" : (this.model.selectedItems.length > 0 ? "files" : "cwd");
            if ((!ej.isNullOrUndefined(args.selectedItem) && args.selectedItem.attr('id') == this._ExplorerId + "_cwd_" + "SortBy") || (!ej.isNullOrUndefined(args.element) && args.element.parentElement.parentElement.id == this._ExplorerId + "_cwd_" + "SortBy")) {
                this._changeActiveSortedoption(args.text);
                this._sorting(this._prevsortingoption, this._prevsorting);
                this._sortingActioncomplete();
            }
            else {
                switch (args.text) {
                    case this._menuOpen:
                        this._openAction();
                        break;
                    case this._menuNewFolder:
                        this._createNewFolder();
                        break;
                    case this._menuDelete:
                        this._deleteFolder();
                        break;
                    case this._menuRefresh:
                        this.refresh();
                        break;
                    case this._menuRename:
                        this._renameFolder();
                        break;
                    case this._menuUpload:
                        this.element.find(".e-uploadinput").click();
                        break;
                    case this._menuDownload:
                        this._downloadFile();
                        break;
                    case this._menuCut:
                        this._copyMoveNode("move");
                        break;
                    case this._menuCopy:
                        this._copyMoveNode("copy");
                        break;
                    case this._menuPaste:
                        this._cut_copy();
                        break;
                    case this._menuGetinfo:
                        this._getDetails();
                        break;
                    case this._menuOpenFolderLocation:
                        this._setFilteredItemsName();
                        var selectedItems = this.model.selectedItems;
                        this._selectedFolder(this._originalPath + this._selectedContent.replace(this._filteredItemsName, ""));
                        this._setSelectedItems(selectedItems);
                        break;
                    case args.text:
                        var customFields = this.model.contextMenuSettings.customMenuFields
                        var fn, customItem = this._getCustomItem(customFields, args.ID);
                        if (customItem) fn = customItem.action;
                        if (typeof fn === "string") {
                            fn = ej.util.getObject(fn, window);
                        }
                        fn && fn(args);
                        break;
                }
            }
                this._trigger("menuClick", args);
        },


        _createNewFolder: function () {
            var proxy = this;
            var name = "";
            var viewerData = this._getLocalizedLabels("NewFolderAlert");
            var dialogContent = ej.buildTag('div.e-get-name');
            var labeltag = ej.buildTag('div.e-fe-dialog-label', viewerData);
            var inputtag = ej.buildTag('input.e-fe-dialog-text e-ejinputtext e-textbox', "", "", { type: "text" });
            var errDiv= ej.buildTag('div.e-fe-dialog-label e-error-msg');
            inputtag.val("New folder");
            var divtag = ej.buildTag('div.e-fe-dialog-btn');
            var okButton = ej.buildTag('button.e-fe-btn-ok ', this._getLocalizedLabels("OkButton"));
            var cancelButton = ej.buildTag('button.e-fe-btn-cancel ', this._getLocalizedLabels("CancelButton"));
            okButton.ejButton({
                type: "button",
                cssClass: "e-flat",
                click: function () {
                    proxy._removeDialog(proxy._newFolderDialogObj);
                    name = inputtag.val();
                    if (!$.trim(name)) {
                        name = "New folder";
                    }
                    !proxy._fileExplorer[proxy._currentPath] && proxy._getFileDetails(proxy._currentPath);
                    var data = proxy._fileExplorer[proxy._currentPath];
                    if (!data.length)
                        name && proxy._createFolder(name);
                    else {
                        for (var i = 0; i < data.length; i++) {
                            if (!data[i].isFile && data[i].name == name) {
                                var dialogContent = ej.buildTag('div.e-get-name');
                                var labeltag = ej.buildTag('div.e-fe-dialog-label', String.format(proxy._getLocalizedLabels("ErrorOnFolderCreation"), name));
                                var divtag = ej.buildTag('div.e-fe-dialog-btn');
                                var okButton = ej.buildTag('button.e-fe-btn-ok ', proxy._getLocalizedLabels("YesButton"));
                                var cancelButton = ej.buildTag('button.e-fe-btn-cancel ', proxy._getLocalizedLabels("NoButton"));
                                okButton.ejButton({
                                    cssClass: "e-flat",
                                    type: "button",
                                    click: function () {
                                        proxy._removeDialog(proxy._alertDialogObj);
                                    }
                                });
                                cancelButton.ejButton({
                                    cssClass: "e-flat",
                                    type: "button",
                                    click: function () {
                                        proxy._removeDialog(proxy._alertDialogObj);
                                        proxy._createFolder(proxy._getDuplicateName(data, "New folder"));
                                    }
                                });
                                divtag.append(okButton, cancelButton);
                                $(dialogContent).append(labeltag, divtag);
                                var open = function () {
                                    okButton.focus();
                                };
                                proxy._alertDialog = proxy._createDialog(dialogContent, { width: 400, height: "auto", title: proxy._getLocalizedLabels("Error"), open: open });
                                proxy._alertDialogObj = proxy._alertDialog.data("ejDialog");
                                break;
                            }
                            else if (i == data.length - 1) {
                                name && proxy._createFolder(name);
                            }
                        }
                    }
                }
            });
            cancelButton.ejButton({
                cssClass: "e-flat",
                type: "button",
                click: function () {
                    proxy._removeDialog(proxy._newFolderDialogObj);
                }
            });
            divtag.append(okButton, cancelButton);
            $(dialogContent).append(labeltag, inputtag, errDiv, divtag);
            this._newFolderDialog = this._createDialog(dialogContent, { width: 350, height: "auto", open: function (e) { proxy._openInputDialog(inputtag, okButton, errDiv, this); }, title: this._getLocalizedLabels("NewFolder") });
            this._newFolderDialogObj = this._newFolderDialog.data("ejDialog");
        },
        _openInputDialog: function (inputtag, okButton, errDiv, obj) {
            var proxy = this;
            inputtag.focus();
            !this._isDevice && inputtag.select();
            if (this._isMobileOrTab || this._isDevice) obj.option("position", { Y: "20%" });
            inputtag.keyup(function (e) {
                var code = proxy._getKeyCode(e);
                if (code == 13)
                    okButton.click();
            });
            inputtag.keypress(function (e) {
                var code = proxy._getKeyCode(e);
                if (/[/\\|*?"<>:]/.test(String.fromCharCode(code))) {
                    errDiv.html(proxy._getLocalizedLabels("InvalidFileName"));
                    return false;
                }
                return true;
            });
            inputtag.keydown(function (e) {
                errDiv.html("");
            });
        },

        _deleteFolder: function () {
            this._alertWindow = ej.buildTag("div#" + "e-fe_deleteAlert");
            var viewerData;
            if (this._selectedItems.length > 1)
                viewerData = String.format(this._getLocalizedLabels("DeleteMultipleFolder"), this._selectedItems.length);
            else
                viewerData = this._getLocalizedLabels("DeleteFolder") + this._selectedContent + "?";
            var labeltag = ej.buildTag('div.e-fe-dialog-label', viewerData);
            var divTag = ej.buildTag('div.e-fe-dialog-btn');
            var okButton = ej.buildTag('button.e-fe-btn-ok', this._getLocalizedLabels("OkButton"));
            var cancelButton = ej.buildTag('button.e-fe-btn-cancel', this._getLocalizedLabels("CancelButton"));
            divTag.append(okButton, cancelButton);
            this._alertWindow.append(labeltag, divTag);
            proxy = this;
            okButton.ejButton({
                type: "button",
                cssClass: "e-flat",
                click: function () {
                    proxy._removeDialog(proxy._alertWindowObj);
                    proxy._ajax_folderPath = proxy._nodeType == "Directory" ? proxy._getFolderPath() : proxy._currentPath;
                    proxy._deletion(proxy._selectedItems.length > 1 ? proxy._selectedItems : proxy._selectedContent, proxy._ajax_folderPath);
                    proxy._disableEditingTools();
                    proxy._disableToolbarItem("Copy");
                }
            });
            cancelButton.ejButton({
                cssClass: "e-flat",
                type: "button",
                click: function () {
                    proxy._removeDialog(proxy._alertWindowObj);
                }
            });
            var open = function () {
                okButton.focus();
            };
            this._alertWindow = this._createDialog(this._alertWindow, { width: 350, height: "auto", title: this._getLocalizedLabels("Delete"), open: open });
            this._alertWindowObj = this._alertWindow.data("ejDialog");
        },
        _getFileDetails: function (path, updateTreeNode, updateLayoutContent, successCallback) {
            var proxy = this;
            var _ajaxOptions = {
                data: { ActionType: "Read", Path: path, ExtensionsAllow: this.model.fileTypes, SelectedItems: this._getSelectedItemDetails(this._getFolderPath(path), (updateTreeNode ? updateTreeNode.text() : (this.model.selectedItems.length ? this.model.selectedItems : this._selectedContent))) },
                url: this.model.ajaxAction,
                type: "POST",
                async: false,
                success: function (result) {
                    result = (result.hasOwnProperty("d")) ? result.d : result;
                    if (!ej.isNullOrUndefined(result.error)) {
                        proxy._showErrorDialog(result.error);
                        return;
                    }
                    for (var i = 0; i < result.files.length; i++) {
                        result.files[i].sizeInByte = result.files[i].size;
                        result.files[i].size = result.files[i].size ? proxy._bytesToSize(result.files[i].size) : "";
                        result.files[i].cssClass = proxy._getCssClass(result.files[i]);
                    }
                    proxy._feParent[path] = result.cwd;
                    proxy._fileExplorer[path] = result.files;
                    updateTreeNode && proxy._addChild(proxy._fileExplorer[path], $(updateTreeNode));
                    if (updateLayoutContent) {
                        if(proxy.model.virtualItemCount > 0){proxy._virtualScrollRenamedItem = proxy._highlightedNodes;}
                        proxy._sorting(proxy._prevsortingoption, proxy._prevsorting, result.files);
                        (proxy.model.layout == "grid" ? proxy._renderGridView(proxy._sorteditems) : proxy._renderTileView(proxy._sorteditems));
                        proxy._updateItemStatus(proxy._sorteditems);
                    }                    
                    if (proxy._highlightedNodes && (!proxy._suggestionItems.length)) {
                        proxy._setSelectedItems(proxy._highlightedNodes);                        
                        proxy._highlightedNodes = "";
                    }
                    proxy._searchbar && $.trim(proxy._searchbar.val()) && proxy._searchFiles(proxy._originalPath);
                    successCallback && typeof successCallback === "function" && successCallback();
                },
                successAfter: this.model.ajaxSettings.read.success
            };
            this.model.ajaxSettings.read.success = undefined;
            $.extend(true, _ajaxOptions, this.model.ajaxSettings.read);
            this._sendAjaxRequest(_ajaxOptions);
        },
        _searchFiles: function (path) {
            var proxy = this;
            var _ajaxOptions = {
                data: { ActionType: "Search", SearchString: this._queryString, Path: path, CaseSensitive: this.model.filterSettings.caseSensitiveSearch, ExtensionsAllow: this.model.fileTypes, SelectedItems: this._getSelectedItemDetails(this._getFolderPath(path), (this.model.selectedItems.length ? this.model.selectedItems : this._selectedContent)) },
                url: this.model.ajaxAction,
                type: "POST",
                async: false,
                success: function (result) {
                    result = (result.hasOwnProperty("d")) ? result.d : result;
                    if (!ej.isNullOrUndefined(result.error)) {
                        proxy._showErrorDialog(result.error);
                        return;
                    }
                    for (var i = 0; i < result.files.length; i++) {
                        result.files[i].sizeInByte = result.files[i].size;
                        result.files[i].size = result.files[i].size ? proxy._bytesToSize(result.files[i].size) : "";
                        result.files[i].cssClass = proxy._getCssClass(result.files[i]);                        
                        result.files[i].filterPath = proxy._originalPath + result.files[i].filterPath.replace(/\\/g, "/");                        
                    }
					proxy._sorting(proxy._prevsortingoption, proxy._prevsorting, result.files);
					proxy._suggestionItems = result.files = proxy._sorteditems;
                    proxy._suggestionItems = result.files;                                                                                   
                    proxy.model.layout == "grid" ? proxy._renderGridView(result.files) : proxy._renderTileView(result.files);
                    proxy._updateItemStatus(result.files);                                       
                    proxy._setSelectedItems(proxy._highlightedNodes);
                    proxy._highlightedNodes = "";                                        
                },
                successAfter: this.model.ajaxSettings.search.success
            };
            this.model.ajaxSettings.search.success = undefined;
            $.extend(true, _ajaxOptions, this.model.ajaxSettings.search);
            this._sendAjaxRequest(_ajaxOptions);
        },
        _getDuplicateName: function (fileDetails, name) {
            var directoryCount = 0;
            var initialName = name;
            while (this._isNameExist(fileDetails, name)) {
                directoryCount++;
                name = initialName.split(".")[0] + (directoryCount > 0 ? "(" + directoryCount + ")" : "") + (name.split(".")[1] ? "." + name.split(".")[1] : "");
            }
            return name;
        },
        _isNameExist: function (fileDetails, name) {
            for (var i = 0; fileDetails && i < fileDetails.length; i++) {
                if (name == fileDetails[i].name)
                    return true;
            }
            return false;
        },

        _renameFolder: function () {
            var proxy = this;
            var viewerData = this._getLocalizedLabels("RenameAlert");
            var dialogContent = ej.buildTag('div.e-rename');
            var labeltag = ej.buildTag('div.e-fe-dialog-label', viewerData);
            var selectedFilename;
            if (proxy.model.virtualItemCount > 0) { proxy._renamedStatus = true; }
            if (proxy._nodeType == "Directory")
                selectedFilename = this._selectedContent
            else
                selectedFilename = this._selectedContent.substr(0, this._selectedContent.lastIndexOf('.'));
            var inputtag = ej.buildTag('input.e-fe-dialog-text e-ejinputtext e-textbox', "", "", { type: "text", value: selectedFilename });
            var errDiv = ej.buildTag('div.e-fe-dialog-label e-error-msg');
            var divtag = ej.buildTag('div.e-fe-dialog-btn');
            var okButton = ej.buildTag('button.e-fe-btn-ok', this._getLocalizedLabels("OkButton"));
            var cancelButton = ej.buildTag('button.e-fe-btn-cancel', this._getLocalizedLabels("CancelButton"));
            okButton.ejButton({
                cssClass: "e-flat",
                type: "button",
                click: function () {
                    var person = inputtag.val(), _oldName = selectedFilename;
                    proxy._removeDialog(proxy._renameDialogObj);
                    if ($.trim(person) && person != _oldName) {
                        proxy._currentPath = proxy._nodeType == "Directory" ? proxy._getFolderPath() : proxy._currentPath;
                        !proxy._fileExplorer[proxy._currentPath] && proxy._getFileDetails(proxy._currentPath);
                        var data = proxy._fileExplorer[proxy._currentPath];
                        proxy._ajax_person = proxy._selectedContent.replace(_oldName, person);
                        if (proxy._nodeType == "File" && (/\.(bmp|dib|jpg|jpeg|jpe|jfif|gif|tif|tiff|png|ico)$/i).test(proxy._ajax_person))
                            proxy._updateImages[proxy._currentPath + proxy._ajax_person] = new Date().getTime();
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].name == person) {
                                if (proxy._nodeType == "File") {
                                    person = proxy._getDuplicateName(proxy._fileExplorer[proxy._currentPath], person);
                                    proxy._ajax_person = proxy._selectedContent.replace(_oldName, person);
                                }
                                var dialogContent = ej.buildTag('div.e-get-name');
                                var labeltag = ej.buildTag('div.e-fe-dialog-label', String.format(proxy._getLocalizedLabels(proxy._nodeType == "File" ? "DuplicateFileCreation" : "ErrorOnFolderCreation"), person));
                                var divtag = ej.buildTag('div.e-fe-dialog-btn');
                                var okButton = ej.buildTag('button.e-fe-btn-ok ', proxy._getLocalizedLabels("OkButton"));
                                var cancelButton = ej.buildTag('button.e-fe-btn-cancel ', proxy._getLocalizedLabels("CancelButton"));
                                okButton.ejButton({
                                    cssClass: "e-flat",
                                    type: "button",
                                    click: function () {
                                        proxy._removeDialog(proxy._alertDialogObj);
                                        if (proxy._nodeType == "File")
                                            proxy._rename();
                                        else {
                                            proxy._existingItems = [];
                                            proxy._getDuplicateItems(proxy._currentPath + proxy._selectedContent + "/", proxy._currentPath + person + "/", true);
                                            if (proxy._existingItems.length) {
                                                proxy._createReplaceConformationDiaolg("_rename", "DuplicateAlert");
                                            }
                                            else
                                                proxy._rename();
                                        }
                                    }
                                });
                                cancelButton.ejButton({
                                    cssClass: "e-flat",
                                    type: "button",
                                    click: function () {
                                        proxy._removeDialog(proxy._alertDialogObj);
                                    }
                                });
                                divtag.append(okButton, cancelButton);
                                $(dialogContent).append(labeltag, divtag);
                                var open = function () {
                                    okButton.focus();
                                };
                                proxy._alertDialog = proxy._createDialog(dialogContent, { width: 400, height: "auto", title: proxy._getLocalizedLabels("Error"), open: open });
                                proxy._alertDialogObj = proxy._alertDialog.data("ejDialog");
                                break;
                            }
                            else if (i == data.length - 1) {
                                proxy._rename();
                            }
                        }
                    }
                }
            });
            cancelButton.ejButton({
                cssClass: "e-flat",
                type: "button",
                click: function () {
                    proxy._removeDialog(proxy._renameDialogObj);
                }
            });

            divtag.append(okButton, cancelButton);
            $(dialogContent).append(labeltag, inputtag, errDiv, divtag);
            this._renameDialog = this._createDialog(dialogContent, { width: 350, height: "auto", open: function (e) { proxy._openInputDialog(inputtag, okButton, errDiv, this); }, title: this._getLocalizedLabels("Rename") });
            this._renameDialogObj = this._renameDialog.data("ejDialog");
        },

        _isSelectedFile: function (files, name) {
            for (var i = 0; i < files.length; i++) {
                if (name == files[i])
                    return true;
            }
            return false;
        },
        _refreshItems: function (node, path, successCallback) {
            if (!this._treeObj) {
                this._currentPath = this.model.path;
                this._read();
            }
            else {
                node = $(node);
                !this._treeObj.isExpanded(node) && this._treeObj.hasChildNode(node) && this._treeObj.expandNode(node);
                this._fileExplorer[path] = "";
                var proxy = this;
                $.each(proxy._fileExplorer, function (itemPath, value) {
                    //display the key and value pair
                    if (itemPath.startsWith(path))
                        proxy._fileExplorer[itemPath] = "";
                });
                var childNodes = node.find('ul:first > li');
                for (var i = 0; i < childNodes.length; i++) {
                    node.find(childNodes[i]).length && this._treeObj.removeNode($(childNodes[i]));
                }
                var processNode = node.find(".e-process");
                processNode.length && processNode.removeClass("e-process");
                this._getFileDetails(path, node.find('> div > .e-text'), true, successCallback);
            }
        },
        _getDuplicateItems: function (source, target, files) {
            !this._fileExplorer[target] && this._getFileDetails(target);
            var targetFiles = this._fileExplorer[target];
            !this._fileExplorer[source] && this._getFileDetails(source);
            var sourceFiles = this._fileExplorer[source];
            if (sourceFiles && targetFiles) {
                for (var s = 0; s < sourceFiles.length; s++) {
                    for (var t = 0; t < targetFiles.length; t++) {
                        if (sourceFiles[s].name == targetFiles[t].name) {
                            if (files == true || this._isSelectedFile(files, targetFiles[t].name)) {
                                this._existingItems[this._existingItems.length] = { Name: targetFiles[t].name, Path: target + targetFiles[t].name + (!targetFiles[t].isFile ? "/" : ""), IsReplace: true };
                                if (!targetFiles[t].isFile)
                                    this._getDuplicateItems(source + sourceFiles[s].name + "/", target + targetFiles[t].name + "/", true);
                            }
                        }
                    }
                }
            }
        },
        _backward: function () {
            if (this._currentState > 0) {
                //minimum number of states to show forward icon
                var minState = 2;
                var update = true;
                var disableBackwardPosition = 0;
                this._isStateNavigation = true;
                var oldIndex = this._currentState;
                --this._currentState;
                while (this._selectedStates[this._currentState] == "" || this._selectedStates[this._currentState] == this._selectedStates[oldIndex]) {
                    if (this._currentState)
                        --this._currentState;
                    else
                        update = false;                        
                }
                update && this._selectedFolder(this._selectedStates[this._currentState]);
                this._isStateNavigation = false;                
                (this._currentState == disableBackwardPosition || this._selectedStates.length - minState == this._currentState) && this._toolBarItems && this._enableToolbarItem("Forward");
                this._currentState == disableBackwardPosition && this._toolBarItems && this._disableToolbarItem("Back");
            }
        },
        _forward: function () {
            if (this._currentState + 1 < this._selectedStates.length) {
                //used to get index from array length
                var update = true;
                var reduceIndex = 1;
                var disableState = 0;
                var enableState = 1;
                this._isStateNavigation = true;
                var oldIndex = this._currentState;
                ++this._currentState;
                while (this._selectedStates[this._currentState] == "" || this._selectedStates[this._currentState] == this._selectedStates[oldIndex]) {
                    if (this._currentState < this._selectedStates.length - 1)
                        ++this._currentState;
                    else
                        update = false;                        
                }
                update && this._selectedFolder(this._selectedStates[this._currentState]);
                this._isStateNavigation = false;
                this._selectedStates.length - reduceIndex == this._currentState && this._toolBarItems && this._disableToolbarItem("Forward");
                this._currentState == 0 && this._toolBarItems && this._disableToolbarItem("Back");
                this._currentState == 1 && this._toolBarItems && this._enableToolbarItem("Back");
            }
        },
        _copyMoveNode: function (action) {
            if (action == "move") {
                this.element.find(".e-blur").removeClass("e-blur");
                var activeElement = this.element.find(".e-splitter .e-active");
                activeElement.length && activeElement.length == 1 ? activeElement.addClass("e-blur") : this.element.find(".e-cont2 .e-active").addClass("e-blur");
            }
            this._copiedNodes = this._filteredItemsName;
            this._option = action;
            this._sourcePath = this._nodeType == "Directory" ? this._getFolderPath() : this._currentPath;
            this._sourceType = this._nodeType;
            this._fileName = this._selectedItems.length > 1 ? this._selectedItems : this._selectedContent;
            this._refreshNode = this._originalPath != this._currentPath ? this._findMatchingElement(this._selectedNode.find("ul:first"), this._selectedContent) : this._selectedNode;
            this._toolBarItems && this._enableToolbarItem("Paste");
            if (this.model.showContextMenu) {
                this._restrictedMenuOption.indexOf(this._menuPaste) < 0 && this._viewMenuObj.enableItem(this._menuPaste);
                this._restrictedMenuOption.indexOf(this._menuPaste) < 0 && this._treeMenuObj.enableItem(this._menuPaste);
            }
            var args = { name: this._fileName, sourcePath: this._sourcePath, selectedItems: this._getSelectedItemDetails(this._sourcePath, this._fileName) };
            if (action == "move")
                this._trigger("cut", args);
            else
                this._trigger("copy", args);
        },
        _openAction: function (e) {
            if (!ej.isNullOrUndefined(e)) {
                if ($(e.currentTarget).is("li.e-tilenode"))
                    this._isTileViewClick = true;
                if (e.type == "recordDoubleClick") this._isGridViewClick = true;
            }
            if (!this._toRead) return;
            var proxy = this;
            var selectedNodes;
            if (this._nodeType == "File")
                this._selectedFile = this._selectedContent;
            if (this._onBeforeOpen()) return;
            if (this._nodeType == "Directory") {
                if (this._suggestionItems.length) {                    
                    this._selectedFolder(this._originalPath + this._selectedContent);                    
                }
                else {
                    var selectedNode = this._treeObj.getSelectedNode(), _selectedContent = this._selectedContent;
                    if (!this._treeObj.isExpanded(selectedNode))
                        this._treeObj && this._treeObj.expandNode(selectedNode);
                    var _childItems = selectedNode.find('ul:first>li').find('div:first .e-text');
                    if (!this._treeObj.hasChildNode(selectedNode)) {
                        var path = (this._isTreeNode == true ? this._currentPath : this._currentPath.replace(this._selectedContent + "/", ""));
                        this._isTreeNode = false;
                        this._addChild(this._fileExplorer[path]);
                    }
                    for (var i = 0; i < _childItems.length; i++) {
                        if ($(_childItems[i]).text() == _selectedContent) {
                            this._treeObj.selectNode(_childItems[i].parentNode.parentNode);
                            break;
                        }
                    }
                    selectedNodes = this._getSelectedItemDetails(this._getFolderPath(), _selectedContent);
                    this._selectedItems = [];
                    this._selectedTileItems = [];
                }
            }
            else if (this._nodeType == "File") {
                if ((/\.(bmp|dib|jpg|jpeg|jpe|jfif|gif|tif|tiff|png|ico)$/i).test(this._selectedFile)) {
                    proxy._openDialog = ej.buildTag('div.e-imageViewer', "", "", { id: proxy._ExplorerId + '_basicDialog', title: proxy._selectedFile });
                    var path = proxy._currentPath.replace("~", "..") + this._selectedFile;
                    var url = this._getImage(path, this._selectedFile, false);
                    var imagetag = ej.buildTag('img', "", "", { src: (url ? url : path) });
                    $(proxy._openDialog).append(imagetag);
                    $(proxy.element).append(proxy._openDialog);
                    var img = new Image();
                    img.onload = img.onabort = img.onerror = function (args) {
						if(args){
							var myargs = { path: args.target.src, element: args.target, originalArgs: args, action: "open" };
							proxy._trigger("getImage", myargs);
						}
                        
                    };
                    img.src = imagetag.attr('src');
                    proxy._openDialog.ejDialog({
                        width: 450,
                        height: 350,
                        minHeight: 200,
                        minWidth: 300,
                        maxWidth: "100%",
                        isResponsive: proxy.model.isResponsive,
                        target: proxy.element,
                        closeIconTooltip: proxy._getLocalizedLabels("DialogCloseToolTip"),
                        enableRTL: proxy.model.enableRTL,
                        showRoundedCorner: proxy.model.showRoundedCorner,
                        cssClass: proxy.model.cssClass,
                        drag: function (e) { proxy._dialogDragEvent(e); },
                        close: function (e) { proxy._onDialogClose(e); }
                    }).parents(".e-dialog-wrap").addClass("e-imageViewer-wrap");
                    proxy._openDialog.css("height", "90%");
                    proxy._openDialogObj = proxy._openDialog.data("ejDialog");
                }
                selectedNodes = proxy._getSelectedItemDetails(proxy._currentPath, proxy._selectedContent);
            }
            var fileUrl;
            fileUrl = this._nodeType == "File" ? path : this._currentPath;
            var args = { path: fileUrl, itemType: this._nodeType, selectedItems: selectedNodes };
            this._trigger("open", args);
        },
        _dialogDragEvent : function (arg) {
            this._splitObj && this._splitObj._windowResized();
        },
        _getSelectedItemDetails: function (path, names) {
            if (typeof names == "string")
                names = [names];
            var itemDetails = [], items, file;
            if (this.model.layout == 'grid') items = this._selectedRecords;
            else items = this._suggestionItems;
            var data = this._suggestionItems && this._suggestionItems.length ? items : this._fileExplorer[path];
            if (data) {
                for (var j = 0; j < names.length; j++) {
                    for (var i = 0; i < data.length; i++) {
                        if (this._suggestionItems.length > 0) file = data[i].filterPath + data[i].name;
                        else file = names[j];
                        if ((this._suggestionItems.length < 1 && data[i].name == this._getOriginalName(names[j])) || (this._suggestionItems.length > 0 && file == this._FilteredFiles[j] && data[i].name == this._getOriginalName(names[j]))) {
                            itemDetails.push(data[i]);
                            break;
                        }
                    }
                }
            }
            return itemDetails;
        },
        _getDetails: function () {
            var _path = (this._nodeType == "Directory" && this._currentPath != "/" && this._currentPath != "~/") ? this._getFolderPath() : this._currentPath;
            var proxy = this;
            if (this.model.rootFolderName.length > 0 && this._selectedContent == this.model.rootFolderName && this._treeObj.element.find('li:first > div > .e-text').hasClass("e-active") && this._selectedItems.length == 0)
                names = [this._rootFolderName];
            else
                names = (typeof this._selectedContent == "string") ? [this._selectedContent] : this._selectedContent;
            if (names[0].endsWith('/') && names[0] != "/")
                names[0] = names[0].substring(0, names[0].length - 1);
            var _ajaxOptions = {

                data: { ActionType: "GetDetails", Path: _path, Names: names, SelectedItems: this._getSelectedItemDetails(_path, (this.model.selectedItems.length ? this.model.selectedItems : this._selectedContent)), RootFolderPath: this._initPath, OldRootFolderName: this._rootFolderName, NewRootFolderName: this.model.rootFolderName },
                url: this.model.ajaxAction,
                type: "POST",
                async: false,
                success: function (result) {
                    if (result.hasOwnProperty("d"))
                        result = result.d;
                    if (!ej.isNullOrUndefined(result.error)) {
                        proxy._showErrorDialog(result.error);
                        return;
                    }
                    var dialogContent = ej.buildTag('div.e-fe-table');
                    var tabletag = ej.buildTag('table'), trtag, tdtag1, tdtag2, wrapDiv, inputtag, kbsize, tdata;
                    var rootName = proxy._feParent[Object.keys(proxy._feParent)[0]].name;
                    $.each(result.details[0], function (name, value) {
                        name = name[0].toUpperCase() + name.substr(1);   // For Asp.Net Core get details issue
					    trtag = ej.buildTag('tr');
                        tdtag1 = ej.buildTag('td', ej.isNullOrUndefined(proxy._getLocalizedLabels(name)) ? name : proxy._getLocalizedLabels(name));
                        tdtag2 = ej.buildTag('td');
                        if (name == "Name" || name == "Location") {
                            wrapDiv = ej.buildTag('div');
                            inputtag = ej.buildTag('input.e-readonly', "", "", { style: "border:none;", type: 'text', value: value, title: value, readonly: true });
                            inputtag.focus(function () {
                                $(this).blur();
                            });
                            wrapDiv.append(inputtag);
                        } else if (name == "Size") {
                            kbsize = proxy._bytesToSize(value);
                            wrapDiv = ej.buildTag('span', kbsize + " (" + value + " Bytes)");
                        } else if (name == "Permission") {
                            wrapDiv = (value != undefined) ? ej.buildTag('span', proxy._objToString(value), "", { style: "word-break: break-word;" }) : null;
                        } else {
                            wrapDiv = ej.buildTag('span', value);
                        }
                        if (wrapDiv != undefined) {
                            (name == "Permission") && $(tabletag).find("tr:last").addClass('e-border');
                            tdtag2.append(wrapDiv);
                            $(tabletag).append(trtag);
                            $(trtag).append(tdtag1, tdtag2);
                            (name == "Name" || name == "Size") && trtag.addClass('e-border');
                        }
                    });
                    $(dialogContent).append(tabletag);
                    proxy._detailsDialog = proxy._createDialog(dialogContent, { width: 500, height: "auto", title: proxy._getLocalizedLabels("Details") });
                    proxy._detailsDialogObj = proxy._detailsDialog.data("ejDialog");
                    proxy._detailsDialogObj.focus();
                },
                successAfter: this.model.ajaxSettings.getDetails.success
            };
            this.model.ajaxSettings.getDetails.success = undefined;
            $.extend(true, _ajaxOptions, this.model.ajaxSettings.getDetails);
            this._sendAjaxRequest(_ajaxOptions, true);
        },
        _objToString: function (obj) {
            var str = '';
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    str += prop + ': ' + obj[prop] + ', ';
                }
            }
            return str;
        },
        _uploadFile: function () {
            proxy = this.element.find(".e-uploadbox");
            proxy = proxy.ejUploadbox("instance");
        },

        _getFolderPath: function (path) {
            var str_array = path? path.split('/'):this._currentPath.split('/');            
            var editedPath = "";
            for (var i = 0; i < str_array.length - 2; i++) {
                editedPath += str_array[i] + "/";
            }
            return editedPath;
        },
        _renderToolBar: function () {
            this._crateToolbarTemplate();
            this._initToolbarItems();
            var model = {};
            model.click = $.proxy(this._toolBarClick, this);
            model.cssClass = this.model.cssClass;
            model.enableRTL = this.model.enableRTL;
            model.enableSeparator = true;
            model.isResponsive = this.model.isResponsive;
            model.height = model.isResponsive ? "" : "auto";
            model.cssClass = this.model.cssClass + " e-fe-toolbar " + (this._isMobileOrTab ? "e-fe-mobile" : "");
            model.enableRTL = this.model.enableRTL;
            this._toolBarItems.ejToolbar(model);
            this._toolBarObj = this._toolBarItems.ejToolbar("instance");
            if (this._isMobileOrTab && this._toolBarObj.model.isResponsive) this._toolBarObj._liTemplte.css("max-width", this.element.width());
            this._disableToolbarItem("Paste");
            this._disableToolbarItem("Download");
            this._disableToolbarItem("Back");
            this._disableToolbarItem("Forward");
            this._disableEditingTools();
        },
        _initToolbarItems: function () {
            this._toolBarItems.find("#" + this._ExplorerId + "Addressbar").length > 0 && this._createAddressBar();
            this._toolBarItems.find("#" + this._ExplorerId + "Searchbar").length > 0 && this._searchDetails();
            this._toolBarItems.find("#" + this._ExplorerId + "Layout").length > 0 && this._renderLayoutDrpdwn();
            this._toolBarItems.find("#" + this._ExplorerId + "SortBy").length > 0 && this._renderSortbyDrpdwn();
        },
        _renderSortbyDrpdwn: function () {
            this._showSortbyDDL = ej.buildTag("button#" + this._ExplorerId + "_sortby", "", "", { "data-role": "none", "type": "button" });
            var ultag = $("<ul id=" + this._ExplorerId + "_splitMenu1 class='e-fe-split-context'>");
            var itemslength = this.model.gridSettings.columns.length;
            for (var i = 0; i < itemslength; i++) {
                ultag.append($("<li><a class=' e-arrow-space'><span class='e-icon'></span>" + this.model.gridSettings.columns[i].headerText + "</a></li>"));
            }
            ultag.appendTo(this._toolBarItems.find("#" + this._ExplorerId + "SortBy").html(""));
            var model = {};
            var proxy = this;
            var selectedoption;
            model.height = "24px",
            model.enableRTL = this.model.enableRTL;
            model.showRoundedCorner = this.model.showRoundedCorner;
            model.targetID = this._ExplorerId + "_splitMenu1";
            model.contentType = "imageonly";
            model.buttonMode = "dropdown";
            model.itemSelected = function (args) {
                proxy._changeActiveSortedoption(args.text);
                proxy._sorting(proxy._prevsortingoption, proxy._prevsorting)
                proxy._sortingActioncomplete();
            }
            model.prefixIcon = 'e-icon e-fe-sortby';
            this._showSortbyDDL.appendTo(this._toolBarItems.find("#" + this._ExplorerId + "SortBy").addClass("e-fe-split-button"));
            this._showSortbyDDL.ejSplitButton(model);
            this._splitButtonObj1 = this._showSortbyDDL.data("ejSplitButton");
        },
        _gridupdate: function (type) {
            var option;
            this._prevsorting ? option = "ascending" : option = "descending";
            if (!ej.isNullOrUndefined(this._gridObj) && this.model.gridSettings.allowSorting) {
                this._gridObj.getHeaderTable().find("[ej-mappingname=" + type + "]").parent().attr('aria-sort', option);
                this._gridObj._addSortElementToColumn(type, option);
            }
        },
        removeSortingIcons:function(){
            $("#" + this._ExplorerId + "_tileViewContextMenu").find("li span").removeClass("e-fe-ascending e-fe-descending");
            $("#" + this._ExplorerId + "_splitMenu1").find("li span").removeClass("e-fe-ascending e-fe-descending");
            var gridSoringCol=this._gridObj.getHeaderTable().find("[ej-mappingname=" + "filterPath" + "]").parent();
            if (this._prevsortingoption == "filterPath") {
                if (this._prevsorting) {
                    gridSoringCol.attr('aria-sort', "descending");
                    this._gridObj._addSortElementToColumn("filterPath", "descending");
                }
                else {
                    gridSoringCol.attr('aria-sort', "ascending");
                    this._gridObj._addSortElementToColumn("filterPath", "ascending");
                }
            }
            else
            {
                if (this._prevsorting) {
                    gridSoringCol.attr('aria-sort', "ascending");
                    this._gridObj._addSortElementToColumn("filterPath", "ascending");
                }
                else {
                    gridSoringCol.attr('aria-sort', "descending");
                    this._gridObj._addSortElementToColumn("filterPath", "descending");
                }
            }
            this._prevsorting = this._gridObj.getHeaderContent().find('span').hasClass("e-icon e-ascending") ? true : false;
        },
        _changeActiveSortedoption: function (args, initialsort, menuopen) {
            if (menuopen == true)
                this._prevsorting = !this._prevsorting
            var sortedoptionlength = this.model.gridSettings.columns.length, tilecontextelement;
            var menulength=$("#" + this._ExplorerId + "_tileViewContextMenu").find("li").length;
            for (var j = 0; j < menulength; j++)
            {
                var liElement=$("#" + this._ExplorerId + "_tileViewContextMenu").find("li")[j];
                if (liElement.id == this._ExplorerId + "_cwd_" + "SortBy")
                    tilecontextelement = $(liElement).find("ul li");
            }
            var splitmenuelement = $("#" + this._ExplorerId + "_splitMenu1").find("li");
            $(tilecontextelement).find('span').removeClass("e-fe-ascending e-fe-descending");
            $(splitmenuelement).find('span').removeClass("e-fe-ascending e-fe-descending");
            var tilemenuli, contextmenuliElement, toolbarliElement, contextactiveElement, toolbaractiveElement;
            for (var i = 0; i < sortedoptionlength; i++) {
                contextmenuliElement = !ej.isNullOrUndefined(tilecontextelement) && tilecontextelement[i];
                toolbarliElement = !ej.isNullOrUndefined(splitmenuelement) && splitmenuelement[i];
                contextactiveElement = $(contextmenuliElement).find('span');
                toolbaractiveElement = $(toolbarliElement).find('span');
                if ((!ej.isNullOrUndefined(contextmenuliElement) && $(contextmenuliElement).text() == args ) || (!ej.isNullOrUndefined(toolbarliElement) && $(toolbarliElement).find('a').text() == args)) {
                    if (initialsort) {
                        contextactiveElement.addClass("e-fe-ascending");
                        toolbaractiveElement.addClass("e-fe-ascending");
                    }
                    else if (this._prevsortingoption == this.model.gridSettings.columns[i].field) {
                        if (this._prevsorting) {
                            contextactiveElement.addClass("e-fe-descending");
                            toolbaractiveElement.addClass("e-fe-descending");
                        }
                        else {
                            contextactiveElement.addClass("e-fe-ascending");
                            toolbaractiveElement.addClass("e-fe-ascending");
                        }
                    }
                    else {
                        if (this._prevsorting) {
                            contextactiveElement.addClass("e-fe-ascending");
                            toolbaractiveElement.addClass("e-fe-ascending");
                        }
                        else {
                            contextactiveElement.addClass("e-fe-descending");
                            toolbaractiveElement.addClass("e-fe-descending");
                        }
                    }
                    this._prevsortingoption = this.model.gridSettings.columns[i].field;
                    this._prevsorting = contextactiveElement.hasClass("e-fe-ascending") || toolbaractiveElement.hasClass("e-fe-ascending") ? true : false;
                    break;
                }
            }
        },
        _suggestionitemsSorting: function (sortingType,sortingOption) {
            var items = this._suggestionItems;
            var dataMgr = ej.DataManager(items);
            this._prevsortingoption = sortingType;
            this._sorteditems = sortingOption ? (dataMgr.executeLocal(ej.Query().sortBy(sortingType))) : (dataMgr.executeLocal(ej.Query().sortByDesc(sortingType)));
        },
        _sorting: function (type, option,data) {
            var items,sortingoption;
            if (ej.isNullOrUndefined(data))
                items = (this._searchbar && this._searchbar.val() != "") ? (this._suggestionItems.length >= 0 ? this._suggestionItems : this._fileExplorer[this._originalPath]) : this._fileExplorer[this._originalPath];
            else
                items = data;
            type == "type" ? sortingoption = "name" : type == "size" ? sortingoption = 'sizeInByte' : sortingoption = type;
            var dataMgr=ej.DataManager(items);
            switch (type) {
                case "type":
                case "dateModified":
                    var itemsList = [],dateFormat = [];
                    for (var i = 0; i < items.length; i++) {
                        itemsList[i] = items[i].dateModified;
                        dateFormat[i] = items[i].dateModified = new Date(items[i].dateModified);
                    }
                    dataMgr = ej.DataManager(items);
                    if (option) {
                        var ascendingdir = (dataMgr.executeLocal(ej.Query().where("isFile", ej.FilterOperators.equal, false).sortBy(sortingoption)));
                        var ascendingfile = (dataMgr.executeLocal(ej.Query().where("isFile", ej.FilterOperators.equal, true).sortBy(sortingoption)));
                        this._sorteditems = ascendingdir.concat(ascendingfile);
                    }
                    else {
                        var descendingdir = (dataMgr.executeLocal(ej.Query().where("isFile", ej.FilterOperators.equal, false).sortByDesc(sortingoption)));
                        var descendingfile = (dataMgr.executeLocal(ej.Query().where("isFile", ej.FilterOperators.equal, true).sortByDesc(sortingoption)));
                        this._sorteditems = descendingfile.concat(descendingdir);
                    }
                    for (var i = 0; i < this._sorteditems.length; i++) {
                        var itemIndex = $.inArray(this._sorteditems[i].dateModified, dateFormat);
                        this._sorteditems[i].dateModified = $(itemsList).eq(itemIndex)[0];
                    }
                    break;
                case "name":
                case "size":
                default:
                    if (option) {
                        var ascendingdir = (dataMgr.executeLocal(ej.Query().where("isFile", ej.FilterOperators.equal, false).sortBy(sortingoption)));
                        var ascendingfile = (dataMgr.executeLocal(ej.Query().where("isFile", ej.FilterOperators.equal, true).sortBy(sortingoption)));
                        this._sorteditems = ascendingdir.concat(ascendingfile);
                    }
                    else {
                        var descendingdir = (dataMgr.executeLocal(ej.Query().where("isFile", ej.FilterOperators.equal, false).sortByDesc(sortingoption)));
                        var descendingfile = (dataMgr.executeLocal(ej.Query().where("isFile", ej.FilterOperators.equal, true).sortByDesc(sortingoption)));
                        this._sorteditems = descendingfile.concat(descendingdir);
                    }
                    break;
            }
        },
        _sortingActioncomplete: function () {
            switch (this.model.layout) {
                case ej.FileExplorer.layoutType.Grid:
                    this._gridObj.option('dataSource', this._sorteditems);
                    break;
                case ej.FileExplorer.layoutType.LargeIcons:
                case ej.FileExplorer.layoutType.Tile:
                default:
                    this._renderTileView(this._sorteditems,true);
            }
            if (!ej.isNullOrUndefined(this._selectedItems) && this._selectedItems.length == 1)
                this._setSelectedItems(this._selectedContent);
        },
        _renderLayoutDrpdwn: function () {
            this._showLayoutDDL = ej.buildTag("button#" + this._ExplorerId + "_layout", "", "", { "data-role": "none","type":"button" });
            var ultag = $("<ul id="+this._ExplorerId+"_splitMenu class='e-fe-split-context'>");
            this._layoutList = ["Tile","Grid","LargeIcons"];
            for (var i = 0; i < this._layoutList.length; i++) {
                ultag.append($("<li><a class=' e-arrow-space'><span class='e-icon e-fe-activeicon'></span>" + this._getLocalizedLabels(this._layoutList[i]) + "</a></li>"));
            }
            ultag.appendTo(this._toolBarItems.find("#" + this._ExplorerId + "Layout").html(""));
          
            var model = {};
            var proxy = this;
            model.height = "24px",
            model.enableRTL = this.model.enableRTL;
            model.showRoundedCorner = this.model.showRoundedCorner;
            model.targetID = this._ExplorerId+"_splitMenu";
            model.contentType = "imageonly";
            model.buttonMode = "dropdown";
            model.itemSelected = function (args) {
                switch (args.text) {
                    case proxy._getLocalizedLabels("LargeIcons"):
                        proxy.model.layout = "largeicons";
                        break;
                    case proxy._getLocalizedLabels("Tile"):
                        proxy.model.layout = "tile";
                        break;
                    case proxy._getLocalizedLabels("Grid"):
                    default:
                        proxy.model.layout = "grid";
                        break;
                }
                proxy._switchLayoutView();
            }
            model.prefixIcon = 'e-icon e-fe-' + this.model.layout;
            this._showLayoutDDL.appendTo(this._toolBarItems.find("#" + this._ExplorerId + "Layout").addClass("e-fe-split-button"));
            this._showLayoutDDL.ejSplitButton(model);
            this._splitButtonObj = this._showLayoutDDL.data("ejSplitButton");
        },
        _changeLayoutActive: function (layout) {
            this._splitButtonObj && this._splitButtonObj.option('prefixIcon', 'e-icon e-fe-' + layout);
            if (this._toolBarItems && this._toolBarItems.find("#" + this._ExplorerId + "Layout").length > 0) {
                $($("#" + this._ExplorerId + "_splitMenu").find("li span").removeClass('e-fe-activeicon'));
                switch (layout) {
                    case ej.FileExplorer.layoutType.LargeIcons:
                        $($("#" + this._ExplorerId + "_splitMenu").find("li")[2]).find("span").addClass('e-fe-activeicon'); break;
                    case ej.FileExplorer.layoutType.Tile:
                        $($("#" + this._ExplorerId + "_splitMenu").find("li")[0]).find("span").addClass('e-fe-activeicon'); break;
                    case ej.FileExplorer.layoutType.Grid:
                    default:
                        $($("#" + this._ExplorerId + "_splitMenu").find("li")[1]).find("span").addClass('e-fe-activeicon'); break;
                }
            }
        },
        _createUploadBox: function () {
            this._uploadtag = ej.buildTag('div#' + this._ExplorerId + 'FileUpload', "", { padding: "0px", height: "0px", width: "0px" });
            this.element.prepend(this._uploadtag);
            this._renderUploadBox();
            this._uploadtag.find(".e-inputbtn").hide();
            this._uploadtag.find(".e-uploadinput").attr("tabindex", -1);
        },
        _searchDetails: function () {
            this._isWatermark = 'placeholder' in document.createElement('input');
            var waterMark = this._getLocalizedLabels("Search");
            this._searchbar = ej.buildTag('input.e-searchBar e-tool-input', "", {}, { id: this._ExplorerId + '_searchbar', type: "text", placeholder: waterMark });
            this._searchbar.appendTo(this._toolBarItems.find("#" + this._ExplorerId + "Searchbar").html(""));
            ej.browserInfo().name == "msie" && ej.ieClearRemover(this._searchbar[0]);
            if (!this._isWatermark)
                this._hiddenSpan = ej.buildTag("span.e-input e-placeholder ", waterMark, {display: "block"}).insertAfter(this._searchbar);
            this._on($('#' + this._ExplorerId + '_searchbar'), "focus", this._inputFocusin);
            this._on($('#' + this._ExplorerId + '_searchbar'), "keyup", this._onSearchKeyup);
        },
        _setUploadLocalization: function () {
            $.each(ej.FileExplorer.Locale, function (locale, value) {
                if (value.UploadSettings) {
                    ej.Uploadbox.Locale[locale] = value.UploadSettings;
                }                
            });            
        },
        _getLocalizedLabels: function (property) {
            return ej.FileExplorer.Locale[this.model.locale] === undefined || ej.FileExplorer.Locale[this.model.locale][property] === undefined ? (ej.FileExplorer.Locale["en-US"][property] ? ej.FileExplorer.Locale["en-US"][property] : property) : ej.FileExplorer.Locale[this.model.locale][property];
        },
        _crateToolbarTemplate: function () {
            this._toolBarItems = ej.buildTag("div#" + this._ExplorerId + "_toolbar").prependTo(this.element);
            for (var item = 0; item < this.model.toolsList.length; item++) {
                var items = this.model.toolsList[item];
                if (!ej.isNullOrUndefined(this.model.tools[items])) {
                    if (items == "customTool")
                        !ej.isNullOrUndefined(this.model.tools[items]) && this._customTools(this.model.tools[items]);
                    else
                        this.model.tools[items].length > 0 && this._createToolsItems(this.model.tools[items], items);
                }
            }
        },

        _createToolsItems: function (items, itemName) {
            var ulTag = ej.buildTag("ul#" + (this._ExplorerId + itemName)), liTag;
            ulTag.addClass("e-ul-" + itemName);
            for (var i = 0; i < items.length; i++) {
                liTag = $("<li id='" + (this._ExplorerId + items[i].replace(/ /g, '')) + "' class='e-feItem-" + items[i] + "' title='" + this._getLocalizedLabels(items[i].replace(/ /g, '')) + "' ><div class='e-fileexplorer-toolbar-icon " + items[i] + "'></div></li>");
                liTag.appendTo(ulTag);
            }
            ulTag.appendTo(this._toolBarItems);
        },
        _customTools: function (toolbarItems) {
            for (var item = 0; item < toolbarItems.length; item++) {
                var ulTag = ej.buildTag("ul"), liTag;
                liTag = $("<li id='" + (this._ExplorerId + toolbarItems[item].name.replace(/ /g, '')) + "' title='" + toolbarItems[item].tooltip + "' ><div class='" + (ej.isNullOrUndefined(toolbarItems[item].css) ? "" : toolbarItems[item].css) + "'></div></li>");
                var fn = toolbarItems[item].action;
                if (typeof fn === "string") {
                    fn = ej.util.getObject(fn, window);
                }
                !ej.isNullOrUndefined(toolbarItems[item].action) && this._on(liTag, "click", fn);
                $(toolbarItems[item].template).appendTo(liTag.find("div"));
                liTag.appendTo(ulTag);
                ulTag.appendTo(this._toolBarItems);
            }
        },
        _toolBarClick: function (args) {
            this._hidePopup();
            var proxy = this;
            if ((args.event.which && (args.event.which == 3 || args.event.which == 2)) || (args.event.button && args.event.button == 2))
                return false;
            if (this.model.ajaxAction == "" || this._currentPath == "")
                return;
            this._lastFocusedElement = $(args.currentTarget);
            var currrentElement = $(args.currentTarget);
            var selected = currrentElement.attr("id");
            switch (selected) {
                case this._ExplorerId + "Addressbar":
                case this._ExplorerId + "Searchbar":
                    if (this._searchbar && !this._isWatermark) {
                        this._searchbar.blur(function () {
                            !proxy._searchbar.val() && proxy._hiddenSpan.css("display", "block");
                        });
                        this._hiddenSpan.css("display", "none");
                    }
                    if (args.event.type == "keyup")
                        currrentElement.find("input").focus();
                    break;
                case this._ExplorerId + "Download":
                    this._downloadFile();
                    break;
                case this._ExplorerId + "Upward":
                    this._upward();
                    break;
                case this._ExplorerId + "NewFolder":
                    this._createNewFolder();
                    break;
                case this._ExplorerId + "Delete":
                    this._deleteFolder();
                    break;
                case this._ExplorerId + "Rename":
                    this._renameFolder();
                    break;
                case this._ExplorerId + "Refresh":
                    this._currentPath = this._originalPath;
                    this._highlightedNodes = this.model.selectedItems;
                    this._refreshItems((this._treeObj ? this._treeObj.getSelectedNode(): ""), this._originalPath);
                    break;
                case this._ExplorerId + "Back":
                    this._backward();
                    break;
                case this._ExplorerId + "Forward":
                    this._forward();
                    break;
                case this._ExplorerId + "Cut":
                    this._copyMoveNode("move");
                    break;
                case this._ExplorerId + "Copy":
                    this._copyMoveNode("copy");
                    break;
                case this._ExplorerId + "Paste":
                    this._currentPath = this._originalPath;
                    this._cut_copy();
                    break;
                case this._ExplorerId + "Open":
                    this._openAction();
                    break;
                case this._ExplorerId + "Details":
                    this._getDetails();
                    break;
                case this._ExplorerId + "Upload":
                    this.element.find(".e-uploadinput").click();
                    break;
            }
        },
        _upward: function () {            
            this._treeObj && this._treeObj.selectNode(this._treeObj.getSelectedNode().parent().closest('li.e-item'));            
        },
        _getFilteredList: function (list) {
            var w_char;
            var searchItems = [];
            this._suggestionItems = [];                       
            if ($.trim(this._queryString)) {
                switch (this.model.filterSettings.filterType) {
                    case ej.FileExplorer.filterType.StartsWith:
                        this._queryString = this._queryString + "*";
                        break;
                    case ej.FileExplorer.filterType.EndsWith:
                        this._queryString = "*" + this._queryString;
                        break;
                    case ej.FileExplorer.filterType.Contains:
                        this._queryString =  "*" + this._queryString + "*";
                        break;
                }
                this._searchFiles(this._originalPath);
            }                
            else {
                this._suggestionItems = [];
                this._sorting(this._prevsortingoption, this._prevsorting, this._fileExplorer[this._originalPath]);
                this.model.layout == "grid" ? this._renderGridView(this._sorteditems) : this._renderTileView(this._sorteditems);
                this._updateItemStatus(this._fileExplorer[this._originalPath]);
            }
            this._gridupdate(this._prevsortingoption);
        },
        
        _updateItemStatus: function (items) {
            if (items) {
                this._itemStatus && this._itemStatus.html(items.length + " " + (items.length == 1 ? this._getLocalizedLabels("Item") : this._getLocalizedLabels("Items")));
            }            
        },
        _onSearchKeyup: function (event) {
            var proxy = this;
            var event = event;
            clearTimeout(this._searchTimer);
            this._searchTimer = setTimeout(function () {
                proxy._validateKeyCode(event);
            }, 300);
        },
        _validateKeyCode: function (event) {
            switch (event.which) {
                case 38:
                case 40:
                case 37:
                case 39:
                case 20:
                case 16:
                case 17:
                case 18:
                case 35:
                case 36:
                case 144: break;
                case 27:
                    this._searchbar && this._searchbar.val("");
                    this._queryString = "";
                    var address = this._addresstag.val();
                    if (this.model.rootFolderName.length > 0)
                        address = address.replace(this.model.rootFolderName, this._rootFolderName);
                    this._removeOldSelectionDetails();
                    this._currentPath = this._currentPath.split(address)[0] + address;
                    this._getFilteredList(this._fileExplorer[this._currentPath]);
                    this.model.layout == 'grid' ? this._addFocus(this._gridtag.find(".e-gridcontent")) : this._addFocus(this._tileViewWrapper);
                    break;
                case 9:
                case 46:
                case 8:
                case 13: 
                default:
                    if ((!this.model.filterSettings.allowSearchOnTyping && event.which == (13 || 46 || 9 || 8)) || (this.model.filterSettings.allowSearchOnTyping)) {
                    this._queryString = event.currentTarget.value;
                    var address = this._addresstag.val();
                    if (this.model.rootFolderName.length > 0)
                        address = address.replace(this.model.rootFolderName, this._rootFolderName);
                    this._removeOldSelectionDetails();
                    this._currentPath = this._currentPath.split(address)[0] + address;
                    this._getFilteredList(this._fileExplorer[this._currentPath]);
                    break;
                  }
            }
        },
        _onDialogClose: function (args) {
            $("body").find("#" + this._ExplorerId + "_basicDialog_wrapper").remove();
            this._lastFocusedElement && this._lastFocusedElement.focus();
        },
        _switchView: function (event) {
            var changed = false;
            if (event.currentTarget.getAttribute("id") == this._ExplorerId + '_swithListView') {
                if (this.model.layout != ej.FileExplorer.layoutType.LargeIcons) {
                    this.model.layout = ej.FileExplorer.layoutType.LargeIcons;
                    changed = true;
                }
            } else {
                if (this.model.layout != ej.FileExplorer.layoutType.Grid) {
                    this.model.layout = ej.FileExplorer.layoutType.Grid;
                    changed = true;
                }
            }
            if (changed) {
                this._switchLayoutView();
            }
        },
        _switchLayoutView: function (isCode) {
            var changed = false;
            var items = this._sorteditems;
            this._currentPath = this._originalPath;
            switch (this.model.layout) {
                case ej.FileExplorer.layoutType.LargeIcons:
                case ej.FileExplorer.layoutType.Tile:
                    this._gridtag.hide();
                    this._tileContent.parent().show();
                    this._tileViewWrapper.removeClass("e-tileInfo-view");
                    if (this._statusbar) {
                        this._statusbar.find(".e-swithListView").removeClass("e-active");
                        this._statusbar.find(".e-switchGridView").removeClass("e-active");
                    }
                    if (this.model.layout == ej.FileExplorer.layoutType.LargeIcons)
                        this._statusbar && this._statusbar.find(".e-swithListView").addClass("e-active");
                    else {
                        this._tileViewWrapper.addClass("e-tileInfo-view");
                        this.items = this._tileView.find("li.e-tilenode");
                        this._setThumbImageHeight();
                    }                        
                    this._renderTileView(items);
                    changed = true;
                    break;
                case ej.FileExplorer.layoutType.Grid:
                default:
                    this._tileView && this._tileContent.parent().hide();
                    this._gridtag.show();
                    this._renderGridView(items);
                    if (this._statusbar) {
                        this._statusbar.find(".e-swithListView").removeClass("e-active");
                        this._statusbar.find(".e-switchGridView").addClass("e-active");
                    }
                    changed = true;
                    break;
            }
            this._changeLayoutActive(this.model.layout);
            if (changed) {
                this._updateItemStatus(items);
                this._setSelectedItems(this.model.selectedItems);
                var args = { layoutType: this.model.layout, isInteraction: !isCode };
                this._trigger("layoutChange", args);
            }
        },
        _wireEvents: function () {
            this._on($('#' + this._ExplorerId + '_newFolder'), "click", this._createNewFolder);
            this._on($('#' + this._ExplorerId + '_switchGridView'), "click", this._switchView);
            this._on($('#' + this._ExplorerId + '_swithListView'), "click", this._switchView);
            this._on(this.element, "keydown", this._keyDownOnInput);
            this._on(this._gridtag, "click", this._gridtagClick);
            this._on(this._tileViewWrapper, "click", this._tileViewWrapperClick);
            this.model.allowDragAndDrop && this._toolBarItems && this._on(this._toolBarItems, "dragover", this._preventDropOption);
        },
        _preventDropOption: function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.originalEvent.dataTransfer.dropEffect = "none";
        },
        _onHideContextMenu: function() {
            (this._treeObj) && this._treeObj.element.find('.e-node-focus').removeClass('e-node-focus');
        },

        _adjustSize: function(args){
            this._isWindowResized = args ? true : false;
            this.adjustSize();
        },
        _closeDialog: function (event) {
            this._unwireDialogEvent(event);
            $(event.target).closest("div.e-dialog").find(".e-dialog").ejDialog("close");
        },

        _searchPath: function (event) {
            var code = this._getKeyCode(event);
            switch (code) {
                case 13:
                    this._searchbar && this._searchbar.val("");
                    var text = this._addresstag.val(), Items = text.split("/"), element = this._treetag;
                    if(this.model.path == "/")
                        Items[0] = "/";
                    for (var i = 0; i < Items.length; i++) {
                        if (Items[i]) {
                            element = this._findMatchingElement($(element).children("ul"), Items[i]);
                            if(element.length)
                                this._treetag.ejTreeView("selectNode", element) 
                            else {
                                this._setSelectedItems([Items[i]]);
                                if (this.model.selectedItems.length) {
                                    this._openAction();
                                }
                                else {
                                    this._alertDialog = this._createDialog(ej.buildTag('div.e-fe-dialog-label', String.format(this._getLocalizedLabels("ErrorPath"), text)), { width: 400, height: "auto", title: this._getLocalizedLabels("Error") });
                                    this._alertDialogObj = this._alertDialog.data("ejDialog");
                                }
                            }
                        }
                    }
                    break;
                case 27:
                    event.preventDefault();
                    this._updateAddressBar();
                    this._toolBarItems.focus();
                    break;
            }
        },

        _addressbarFocusout: function (event) {
            this._updateAddressBar();
        },

        _createDialog: function (contentTag, model) {
            var proxy = this;
            var dialog = ej.buildTag('div#' + this._ExplorerId + '_basicDialog.e-fe-dialog');
            $(contentTag).css("overflow", "hidden");
            $(dialog).append(contentTag);
            dialog.ejDialog({
                title: (model.title) ? model.title : "",
                width: model.width,
                maxWidth: "100%",
                isResponsive: proxy.model.isResponsive,
                target: proxy.element,
                closeIconTooltip: proxy._getLocalizedLabels("DialogCloseToolTip"),
                height: model.height,
                enableModal: true,
                showHeader: true,
                enableResize: false,
                enableAnimation: false,
                allowKeyboardNavigation: proxy.model.allowKeyboardNavigation,
                enableRTL: proxy.model.enableRTL,
                showRoundedCorner: proxy.model.showRoundedCorner,
                cssClass: this.model.cssClass + " e-fe-dialog",
                open: model.open,
                drag: function (e) { proxy._dialogDragEvent(e); },
                close: function (e) {  proxy._onDialogClose(e); }
            });
            return dialog;
        },
        _showErrorDialog: function (error) {
            this._alertDialog = this._createDialog(ej.buildTag('div.e-fe-dialog-label', error), { width: 400, height: "auto", title: this._getLocalizedLabels("Error") });
            this._alertDialogObj = this._alertDialog.data("ejDialog");
        },
        _findMatchingElement: function (element, text) {
            return $(element).children("li").filter(function (index) {
                if ($(this).find(".e-text:first").text() == text)
                    return $(this)
            });
        },
        _getKeyCode: function (e) {
            var code;
            if (e.keyCode) code = e.keyCode; // ie and mozilla/gecko
            else if (e.which) code = e.which; // ns4 and opera
            else code = e.charCode;
            return code
        },


        _keyDownOnInput: function (e) {
            if ($(e.target).hasClass("e-tool-input"))
                return;
            var code = this._getKeyCode(e);
            if (!this.model.allowKeyboardNavigation) return;
            if (this._KeydownEventHandler(e)) return;
            switch (code) {
                case 49: // Ctrl + Shift + 1 for toolbar focus
                    if (e.shiftKey && e.ctrlKey && this.model.showToolbar) {
                        e.preventDefault();
                        this._addFocus(this._toolBarItems);
                    }
                    break;
                case 50: // Ctrl + Shift + 2 for treeview focus
                    if (e.shiftKey && e.ctrlKey && this.model.showNavigationPane) {
                        e.preventDefault();
                        this._addFocus(this._treetag);
                    }
                    break;
                case 51: // Ctrl + Shift + 3 for splitter focus
                    if (e.shiftKey && e.ctrlKey) {
                        e.preventDefault();
                        this._addFocus($(this._splittag.find(".e-splitbar")[0]));
                    }
                    break;
                case 52: // Ctrl + Shift + 4 for gridview focus
                    if (e.shiftKey && e.ctrlKey) {
                        e.preventDefault();
                        this._changeLayout(ej.FileExplorer.layoutType.Grid);
                    }
                    break;
                case 53: // Ctrl + Shift + 5 for tileview focus
                    if (e.shiftKey && e.ctrlKey) {
                        e.preventDefault();
                        this._changeLayout(ej.FileExplorer.layoutType.Tile);
                    }
                    break;
                case 54: // Ctrl + Shift + 6 for largeicons view
                    if (e.shiftKey && e.ctrlKey) {
                        e.preventDefault();
                        this._changeLayout(ej.FileExplorer.layoutType.LargeIcons);
                    }
                    break;
                case 55: // Ctrl + Shift + 7 for Statusbar focus
                    if (e.shiftKey && e.ctrlKey && this.model.showFooter) {
                        e.preventDefault();
                        this._addFocus(this._statusbar);
                    }
                    break;
                case 65: // Ctrl + A for select all file
                    if (e.ctrlKey) {
                        e.preventDefault();
                        var _items;
                        if (this.model.layout == "grid") {
                            _items = this.gridItems;
                            this._gridObj.clearSelection();
                            this._removeOldSelectionDetails();
                            this._addFocus(this._gridtag.find(".e-gridcontent"));
                            this._gridObj.selectRows(0, _items.length - 1, $(_items[_items.length - 1]).find("td:first"));
                        } else {
                            _items = this.items;
                            if (this.items.hasClass("e-active"))
                                this.items.removeClass("e-active").attr("aria-selected", false);
                            this._removeOldSelectionDetails();
                            this._addFocus(this._tileViewWrapper);
                            for (var i = 0; i < _items.length; i++) {
                                var e = { keyCode: 91, ctrlKey: true, currentTarget: _items[i], target: _items[i] };
                                this._upDatePathFromTileView(e);
                            }
                        }
                    }
                    break;
                case 78: // Alt + N for Create newfolder
                    if (e.altKey && this._hasEditContentsPermission(this._originalPath)) {
                        e.preventDefault();
                        this._createNewFolder();
                    }
                    break;
                case 85: // Ctrl + U for upload
                    if (e.ctrlKey && this._toUpload) {
                        e.preventDefault();
                        this.element.find(".e-uploadinput").click();
                    }
                    break;
                case 116: // F5 for refresh
                    e.preventDefault();
                    this._currentPath = this._originalPath;
                    this._highlightedNodes = this.model.selectedItems;
                    this._refreshItems((this._treeObj ? this._treeObj.getSelectedNode(): ""), this._originalPath);
                    break;
            }
        },
        _changeLayout: function (layout) {
            if (this.model.layout != layout) {
                this.model.layout = layout;
                this._removeFocus();
                this._switchLayoutView(layout);
            }
            this._focusLayout(layout);
        },
        _focusLayout: function (layout) {
            switch (layout) {
                case ej.FileExplorer.layoutType.Grid:
                    this._addFocus(this._gridtag.find(".e-gridcontent"));
                    break;
                case ej.FileExplorer.layoutType.Tile:
                case ej.FileExplorer.layoutType.LargeIcons:
                default:
                    this._addFocus(this._tileViewWrapper);
                    break;
            }
        },
        _getFocusedElement: function () {
            var focusedElement = this.element.find(".e-focus");
            return focusedElement = focusedElement ? focusedElement : $(':focus');
        },

        _addFocus: function (target) {
            if (!target.hasClass("e-focus")) {
                this._removeFocus();
                target.focus();
            }
        },
        _removeFocus: function () {
            var target = this._getFocusedElement();
            if (target.length > 0) {
                target.blur();
            }
        },

        _subControlsSetModel: function (prop, value) {
            var propObj = {};
            propObj[prop] = value;
            this._treeObj && this._treeObj.option(prop, value);
            if (this._downloadDialogObj && this._downloadDialogObj.isOpen()) this._downloadDialogObj.option(prop, value);
            if (this._newFolderDialogObj && this._newFolderDialogObj.isOpen()) this._newFolderDialogObj.option(prop, value);
            if (this._renameDialogObj && this._renameDialogObj.isOpen()) this._renameDialogObj.option(prop, value);
            if (this._openDialogObj && this._openDialogObj.isOpen()) this._openDialogObj.option(prop, value);
            if (this._detailsDialogObj && this._detailsDialogObj.isOpen()) this._detailsDialogObj.option(prop, value);
            if (this._alertDialogObj && this._alertDialogObj.isOpen()) this._alertDialogObj.option(prop, value);
            if (this._alertWindowObj && this._alertWindowObj.isOpen()) this._alertWindowObj.option(prop, value);
            this._treeContextMenutag && this._treeMenuObj.option(prop, value);
            this._tileContextMenutag && this._viewMenuObj.option(prop, value);
            this._toolBarObj && this._toolBarObj.option(prop, value);
            this._uploadtag && this._uploadtag.data("ejUploadbox").option(prop, value);
            this._splitObj && this._splitObj.option(prop, value);
            this._splitButtonObj && this._splitButtonObj.option(prop, value);
            this._splitButtonObj1 && this._splitButtonObj1.option(prop, value);
            this._statusbar.find("button").length && this._statusbar.find("button").ejButton(propObj);
            this._headCheckObj && this._headCheckObj.option(prop, value);
            this._tileView.find(".e-tile-checkbox").length && this._tileView.find(".e-tile-checkbox").ejCheckBox(propObj);
            this._gridtag.find(".e-grid-row-checkbox").length && this._gridtag.find(".e-grid-row-checkbox").ejCheckBox(propObj);
        },
        _removeDialog: function (obj) {
            obj.close();
            var isOverLay = obj._overLay;
            isOverLay && isOverLay.remove();
            obj._ejDialog.remove();
        },
        _reSizeHandler: function (args) {
            this._splitterCorrection();
            if (this.model.ajaxAction == "" || this._currentPath == "")
                return;
            if (this.model.layout == "grid") {
                var height = this._splittag.outerHeight() - this._gridtag.find(".e-gridheader").outerHeight();
                this._gridObj && this._gridObj.option("scrollSettings", { height: this.model.showFooter ? height - this._statusbar.outerHeight() : height, width: this._splittag.find(".e-cont2").width() });
            }
            else {
                this._tileScroll && this._tileScroll.option("width", parseInt(this._splittag.find(".e-cont2").width()));
                this._setThumbImageHeight();
            }
            this._treeScroll && this._treeScroll.option("width", parseInt(this._splittag.find(".e-cont1").width()));
            this._waitingPopup && this._waitingPopup.refresh();
        },
        _splitterCorrection: function () {
            var left = this._splittag.find(this.model.enableRTL ? ".e-cont2" : ".e-cont1").width() - 1;
            this._splittag.find(".e-split-divider").css("left", left).css("z-index", 1);
        },
        _findCommand: function (command, obj, isMenu) {
            var proxy = this;
            $.each(obj, function(key, val) {
                for(var j = 0, leng = val.length; j < leng; j++) {
                    if(val[j].toLowerCase() == command.toLowerCase()) {
                        command = isMenu ? proxy["_menu" + val[j]] : val[j];
                        return false;
                    }
                }
            });
            return command;
        },
        _getElement: function (node) {
            typeof node == "string" && (node = this._findCommand(node, this.model.tools));
            (typeof node != "object") && (node = (typeof node == "string") ? (this._toolBarObj.itemsContainer.find("li#" + node).length > 0 ? this._toolBarObj.itemsContainer.find("li#" + node) : this._toolBarObj.itemsContainer.find("li#" + this._ExplorerId + node.replace(/ /g, ''))) : this._toolBarObj.itemsContainer.find('li').eq(node));
            node = $(node);
            return $(node[0]);
        },
        _updateToolbar: function () {
            this._renderToolBar();
            this._selectedStates.length >= 2 && this._enableToolbarItem("Back");
            this._updateAddressBar();
            if (this._selectedItems.length > 0) {
                if (this._toRead) {
                    this._toDownload && this._enableToolbarItem("Download");
                    this._enableEditingTools();
                    this._toCopy && this._enableToolbarItem("Copy");
                }
            }
            if (!ej.isNullOrUndefined(this._fileName) && this._fileName != "")
                this._toRead && this._enableToolbarItem("Paste");
        },
        _enableEditingMenus: function () {
            var items = [this._menuRename, this._menuDelete, this._menuCut];
            for (var i = 0; i < items.length; i++) {
                if (this._restrictedMenuOption.indexOf(items[i]) < 0) {
                    this._viewMenuObj && this._viewMenuObj.enableItem(items[i]);
                    this._treeMenuObj && this._treeMenuObj.enableItem(items[i]);
                }
            }
        },
        _disableEditingMenus: function () {
            var items = [this._menuRename, this._menuDelete, this._menuCut];
            for (var i = 0; i < items.length; i++) {
                this._viewMenuObj && this._viewMenuObj.disableItem(items[i]);
                this._treeMenuObj && this._treeMenuObj.disableItem(items[i]);
            }
        },
        _updateSelectionDetails: function (nodeType) {
            if (this._selectedItems.length == 0)
                this._removeOldSelectionDetails(nodeType);
            else {
                this._updateToolbarItems();
                this._updateNewFolderTool(this._hasEditContentsPermission(this._originalPath));
            }
        },
        _updatePasteTool: function () {
            this._toolBarItems && ((this._option && this._toRead) ? this._enableToolbarItem("Paste") : this._disableToolbarItem("Paste"));
        },
        _updateAccessRules: function (path) {
            var _value = this._feParent[path];
            this._updateAccessValue(_value);
        },
        _updateAccessValue: function (_value) {
            if (!ej.isNullOrUndefined(_value) && !ej.isNullOrUndefined(_value.permission)) {
                if (!_value.permission.Copy) this._toCopy = false;
                if (!_value.permission.Download) this._toDownload = false;
                if (!_value.permission.Edit) this._toEdit = false;
                if (!_value.permission.EditContents) this._toEditContents = false;
                if (!_value.permission.Read) this._toRead = false;
                if (!_value.permission.Upload) this._toUpload = false;
            }
        },
        _updateToolbarItems: function () {
            if (this._toolBarItems) {
                (this._toRead && this._toDownload) ? this._enableToolbarItem("Download") : this._disableToolbarItem("Download");
                (this._toRead && this._toUpload) ? this._enableToolbarItem("Upload") : this._disableToolbarItem("Upload");
                (this._toRead && this._toEdit) ? this._enableEditingTools() : this._disableEditingTools();
                (this._toRead && this._toCopy) ? this._enableToolbarItem("Copy") : this._disableToolbarItem("Copy");
                this._updatePasteTool();
            }
        },
        _getFilePermission: function (path) {
            return this._feParent[path] ? this._feParent[path].permission : null;
        },
        _updateCurrentPathPermission: function () {
            this._removeOldSelectionDetails();
            this._toDownload = false; this._toUpload = this._toEdit = this._toEditContents = this._toRead = this._toCopy = true;
            this._updateAccessRules(this._originalPath);
            this._toolBarItems && (this._toUpload ? this._enableToolbarItem("Upload") : this._disableToolbarItem("Upload"));
            this._updateNewFolderTool(this._hasEditContentsPermission(this._originalPath));
            this._disableToolbarItem("Copy");
            this._updatePasteTool();
        },
        _updateNewFolderTool: function (value) {
            this._toolBarItems && (value ? this._enableToolbarItem("NewFolder") : this._disableToolbarItem("NewFolder"));
        },
        _hasEditContentsPermission: function (path) {
            var permission = this._getFilePermission(path);
            return permission ? ((permission.Read && permission.EditContents) ? true : false) : true;
        },
        _hasReadPermission: function (path) {
            var permission = this._getFilePermission(path);
            return (permission && !permission.Read) ? false : true;
        },
        _changeRootFolderName: function () {
            if (this.model.rootFolderName.length == 0) return;
            var element = this._treeObj.element.find('li:first > div > .e-text');
            this._treeObj.updateText(element, this.model.rootFolderName);
        },
        _changeName: function (path, changeRoot) {
            if (changeRoot)
                var newPath = path.replace(this._initPath, "").replace(this.model.rootFolderName, this._rootFolderName);
            else
                var newPath = path.replace(this._initPath, "").replace(this._rootFolderName, this.model.rootFolderName);
            return this._initPath + newPath;
        },
        _unwireEvents: function () {
            this._off($('#' + this._ExplorerId + '_newFolder'), "click", this._createNewFolder);
            this._off($('#' + this._ExplorerId + '_switchGridView'), "click", this._switchView);
            this._off($('#' + this._ExplorerId + '_swithListView'), "click", this._switchView);
            this._addressBarEvents("_off");
            this._off($('#' + this._ExplorerId + '_searchbar'), "focus", this._inputFocusin);
            this._off($('#' + this._ExplorerId + '_searchbar'), "keyup", this._onSearchKeyup);
            this._off(this.element, "keydown", this._keyDownOnInput);
            this._off(this._gridtag, "click");
            this._off(this._tileViewWrapper, "click");
            this.model.isResponsive &&this._off($(window),'resize',this._adjustSize);
            this._toolBarItems && this._off(this._toolBarItems, "dragover", this._preventDropOption);
        },

        _wireResizing: function () {
            this.model.isResponsive ? this._on($(window),'resize',this._adjustSize) :this._off($(window),'resize',this._adjustSize);
        },
        adjustSize: function () {
            this._ensureResolution();
            (!this._isWindowResized) && this.model.showToolbar && this.model.isResponsive && this._toolBarObj._reSizeHandler();
            this._isWindowResized = false;
            this._splittag.css('height', (this.element.height() - ((this.model.showToolbar && this._toolBarItems) ? this._toolBarItems.outerHeight() : 0)));
            var layoutHeight = this._splittag.outerHeight() - (this.model.showFooter ? this._statusbar.outerHeight() : 0);
            this._tileContent && this._tileContent.parent(".e-tile-wrapper").height(layoutHeight);
            this._tileScroll && this._tileScroll.option("height", layoutHeight);
            this._gridtag && this._gridtag.height(layoutHeight);
            this._splitObj && this._splitObj._windowResized();
            this._treeScroll && this._treeScroll.option("height", this._splittag.height());
            this._reSizeHandler();
        },
        refresh: function () {
            this._refreshItems(this._selectedNode, this._currentPath);
        },
        enableToolbarItem: function (liElement) {
            this._removeRestrictedToolItem(liElement);
            liElement = this._getElement(liElement);
            (liElement[0] != null && this._toolBarObj) && this._toolBarObj.enableItem(liElement);
        },
        disableToolbarItem: function (liElement) {
            liElement = this._getElement(liElement);
            if(liElement[0] != null && this._toolBarObj) {
                var operation = liElement.attr("id").replace(this._ExplorerId, "");
                this._restrictedToolbarOptions.push(operation);
                this._toolBarObj.disableItem(liElement);
            }
        },
        removeToolbarItem: function (liElement) {
            this._removeRestrictedToolItem(liElement);
            liElement = this._getElement(liElement);
            (liElement[0] != null && this._toolBarObj) && this._toolBarObj.removeItem(liElement);
        },
        _removeRestrictedToolItem: function (item) {
            var operation = typeof item == "string" ? item : item.attr("id").replace(this._ExplorerId, "");
            for (var i = 0; i < this._restrictedToolbarOptions.length; i++) {
                if (this._restrictedToolbarOptions[i] == operation) {
                    this._restrictedToolbarOptions.splice(i, 1);
                    break;
                }
            }
        },
        _onThumbStart: function (args) {
            if (this.model.allowMultiSelection && (args.originalEvent.type != "touchstart"))
                args.cancel = true;
            var dragElement = $(args.originalEvent.target);
            if (dragElement.hasClass("e-draggable") || dragElement.closest(".e-draggable").length) {
                args.cancel = true;
                return false;
            }
        }
    });
    ej.FileExplorer.Locale = {};

    ej.FileExplorer.Locale["en-US"] = {
        Folder: "Folder",
        EmptyFolder: "This folder is empty",
        ProtectedFolder:"You don't currently have permission to access this folder",
        EmptyResult:"No items match your search",
        Back: "Backward",
        Forward: "Forward",
        Upward:"Upward",
        Refresh: "Refresh",
        Addressbar: "Address bar",
        Upload: "Upload",
        Rename: "Rename",
        Delete: "Delete",
        Download: "Download",
        Error: "Error",
        PasteError: "Error",
        UploadError: "Error",
        RenameError: "Error",
        Cut: "Cut",
        Copy: "Copy",
        Paste: "Paste",
        Details: "Details",
        Searchbar: "Search bar",
        Open: "Open",
        Search: "Search",
        NewFolder: "New folder",
        SortBy: "Sort by",
        Size: "Size",
        RenameAlert: "Please enter new name",
        NewFolderAlert: "Please enter new folder name",        
        ContextMenuOpen: "Open",
        ContextMenuNewFolder: "New folder",
        ContextMenuDelete: "Delete",
        ContextMenuRename: "Rename",
        ContextMenuUpload: "Upload",
        ContextMenuDownload: "Download",
        ContextMenuCut: "Cut",
        ContextMenuCopy: "Copy",
        ContextMenuPaste: "Paste",
        ContextMenuGetinfo: "Get info",
        ContextMenuRefresh: "Refresh",
        ContextMenuOpenFolderLocation: "Open folder location",
        Item: "item",
        Items: "items",
        Selected: "selected",
        ErrorOnFolderCreation: "This destination already contains a folder named '{0}'. Do you want to merge this folder content with already existing folder '{0}'?",
        InvalidFileName: "A file name can't contain any of the following characters: \\/:*?\"<>|",
        GeneralError: "Please see browser console window for more information",
        ErrorPath: "FileExplorer can't find '{0}'. Check the spelling and try again.",
        PasteReplaceAlert: "File named '{0}' already exists. Replace old file with new one?",
        UploadReplaceAlert: "File named '{0}' already exists. Replace old file with new one?",
        DuplicateAlert: "There is already a file with the same name '{0}'. Do you want to create file with duplicate name",
        DuplicateFileCreation: "There is already a file with the same name in this location. Do you want to rename '{0}' to '{1}'?",
        DeleteFolder: " Are you sure you want to delete ",
        DeleteMultipleFolder: "Are you sure you want to delete these {0} items?",
        CancelPasteAction: "The destination folder is a subfolder of source folder.",
        OkButton: "OK",
        ContextMenuSortBy: "Sort by",
        CancelButton: "Cancel",
        YesToAllButton: "Yes to all",
        NoToAllButton: "No to all",
        YesButton: "Yes",
        NoButton: "No",
        SkipButton:"Skip",
        Grid: "Grid view",
        Tile: "Tile view",
        LargeIcons: "Large icons",
        Name: "Name",
        Location: "Location",
        Type: "Item type",
        Layout:"Layout",
        Created: "Created",
        Accessed: "Accessed",
        Modified: "Modified",
        Permission: "Permission",
        DialogCloseToolTip: "Close",
        UploadSettings: {
            buttonText: {
                upload: "Upload",
                browse: "Browse",
                cancel: "Cancel",
                close: "Close"
            },
            dialogText: {
                title: "Upload Box",
                name: "Name",
                size: "Size",
                status: "Status"
            },
            dropAreaText: "Drop files or click to upload",
            filedetail: "The selected file size is too large. Please select a file within the valid size.",
            denyError: "Files with #Extension extensions are not allowed.",
            allowError: "Only files with #Extension extensions are allowed.",
            cancelToolTip: "Cancel",
            removeToolTip: "Remove",
            retryToolTip: "Retry",
            completedToolTip: "Completed",
            failedToolTip: "Failed",
            closeToolTip: "Close"
        }
    };


    ej.FileExplorer.filterType = {
        /**  Supports to search text with startswith  */
        StartsWith: "startswith",
        /**  Supports to search text with contains */
        Contains: "contains",
        /**  Supports to search text with endswith */
        EndsWith: "endswith"        
    };
    ej.FileExplorer.layoutType = {
        Tile: "tile",
        Grid: "grid",
        LargeIcons: "largeicons"
    };
})(jQuery, Syncfusion);
