"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function ($) {
    var Kanban = (function (_super) {
        __extends(Kanban, _super);
        function Kanban(element, options) {
            _super.call(this);
            this.element = null;
            this.PluginName = "ejKanban";
            this.id = "null";
            this.validTags = ["div"];
            this.observables = ["dataSource"];
            this._tags = [
                {
                    tag: "columns",
                    attr: ["headerTemplate", "headerText", "key", "isCollapsed", "showAddButton", "visible", "constraints.type", "constraints.min", "constraints.max", "allowDrag", "allowDrop", "totalCount.text"]
                },
                {
                    tag: "workflows",
                    attr: ["key", "allowedTransitions"]
                },
                {
                    tag: "stackedHeaderRows",
                    attr: [
                        [
                            {
                                tag: "stackedHeaderColumns",
                                attr: ["headerText", "column"]
                            }
                        ]
                    ]
                }, {
                    tag: "contextMenuSettings",
                    attr: [
                        "customMenuItems", "menuItems", "disableDefaultItems"
                    ]
                },
                {
                    tag: "filterSettings",
                    attr: ["text", "query", "description"]
                },
                { tag: "editSettings.editItems", attr: ["field", "editType", "validationRules", "editParams", "defaultValue"] }
            ];
            this.localizedLabels = null;
            this.currentViewData = null;
            this.keyConfigs = {
                focus: "e",
                insertCard: "45",
                deleteCard: "46",
                editCard: "113",
                saveRequest: "13",
                cancelRequest: "27",
                firstCardSelection: "36",
                lastCardSelection: "35",
                upArrow: "38",
                downArrow: "40",
                rightArrow: "39",
                leftArrow: "37",
                swimlaneExpandAll: "ctrl+40",
                swimlaneCollapseAll: "ctrl+38",
                selectedSwimlaneExpand: "alt+40",
                selectedSwimlaneCollapse: "alt+38",
                selectedColumnCollapse: "ctrl+37",
                selectedColumnExpand: "ctrl+39",
                multiSelectionByUpArrow: "shift+38",
                multiSelectionByDownArrow: "shift+40",
                multiSelectionByLeftArrow: "shift+37",
                multiSelectionByRightArrow: "shift+39",
            };
            this.dataTypes = {
                dataSource: "data",
                query: "data",
                columns: "array",
                stackedHeaderRows: "array",
                contextMenuSettings: {
                    disableDefaultItems: "array",
                    menuItems: "array",
                    customMenuItems: "array"
                },
                filterSettings: "array",
                editSettings: {
                    editMode: "enum",
                    editItems: "array"
                },
                searchSettings: {
                    fields: "array"
                }
            };
            this.defaults = {
                dataSource: null,
                keyField: null,
                keySettings: null,
                allowTitle: false,
                cssClass: "",
                allowSelection: true,
                allowSearching: false,
                allowToggleColumn: false,
                enableTotalCount: false,
                enableTouch: true,
                selectionType: "single",
                allowKeyboardNavigation: false,
                allowDragAndDrop: true,
                allowExternalDragAndDrop: false,
                allowHover: true,
                allowScrolling: false,
                allowPrinting: false,
                enableRTL: false,
                showColumnWhenEmpty: false,
                stackedHeaderRows: [],
                filterSettings: [],
                scrollSettings: {
                    width: "auto",
                    height: 0,
                    allowFreezeSwimlane: false
                },
                swimlaneSettings: {
                    showCount: true,
                    allowDragAndDrop: false,
                    unassignedGroup: {
                        enable: true,
                        keys: ["null", "undefined", ""]
                    }
                },
                fields: {
                    content: null,
                    tag: null,
                    color: null,
                    imageUrl: null,
                    swimlaneKey: null,
                    primaryKey: null,
                    priority: null
                },
                cardSettings: {
                    colorMapping: {},
                    template: null,
                    externalDropTarget: null
                },
                columns: [],
                contextMenuSettings: {
                    enable: false,
                    menuItems: [
                        "Add Card", "Edit Card", "Delete Card", "Top of Row", "Bottom of Row", "Move Up", "Move Down", "Move Left", "Move Right", "Move to Swimlane", "Hide Column", "Visible Columns", "Print Card"], customMenuItems: []
                },
                customToolbarItems: [],
                editSettings: {
                    editItems: [],
                    allowEditing: false,
                    allowAdding: false,
                    dialogTemplate: null,
                    externalFormTemplate: null,
                    formPosition: "bottom",
                    editMode: "dialog"
                },
                searchSettings: {
                    fields: [],
                    key: "",
                    operator: "contains",
                    ignoreCase: true
                },
                tooltipSettings: {
                    enable: false,
                    template: null
                },
                minWidth: 0,
                isResponsive: false,
                locale: "en-US",
                query: null,
                create: null,
                actionBegin: null,
                actionComplete: null,
                actionFailure: null,
                load: null,
                destroy: null,
                beginEdit: null,
                endEdit: null,
                endAdd: null,
                endDelete: null,
                beforeCardSelect: null,
                cardSelect: null,
                toolbarClick: null,
                cardDoubleClick: null,
                cardDragStart: null,
                cardDrag: null,
                cardDragStop: null,
                cardDrop: null,
                contextClick: null,
                contextOpen: null,
                cardClick: null,
                beforePrint: null,
                cellClick: null,
                headerClick: null,
                dataBound: null,
                queryCellInfo: null,
            };
            this._dataSource = ej.util.valueFunction("dataSource");
            this._rootCSS = "e-kanban";
            this._requiresID = true;
            this._id = null;
            this.KanbanDragAndDrop = null;
            this.KanbanEdit = null;
            this.KanbanCommon = null;
            this.KanbanAdaptive = null;
            this.KanbanScroll = null;
            this.KanbanContext = null;
            this.KanbanSwimlane = null;
            this.KanbanSelection = null;
            this.KanbanFilter = null;
            this._currentJsonData = null;
            this._kanbanRows = null;
            this._columnRows = null;
            this._swimlaneRows = null;
            this._filterToolBar = null;
            this._filteredRecordsCount = 0;
            this._filteredRecords = null;
            this._contexttarget = null;
            this._editForm = null;
            this._newData = null;
            this._isAddNew = false;
            this._isRemoteSaveAdaptor = false;
            this._queryPromise = null;
            this._kanbanWidth = null;
            this.keyPredicates = null;
            this._cloneQuery = null;
            this._isLocalData = true;
            this._previousRowCellIndex = [];
            this.selectedRowCellIndexes = [];
            this._bulkUpdateData = [];
            this._bulkPriorityData = [];
            this._kbnFilterObject = [];
            this._kbnAdaptFilterObject = [];
            this._kbnFilterCollection = [];
            this._kbnAdaptDdlData = [];
            this._kbnSwimLaneData = [];
            this._kbnAdaptDdlIndex = 0;
            this._kbnSwipeWidth = 0;
            this._kbnSwipeCount = 0;
            this._extraWidth = 0;
            this._searchTout = null;
            this._cardSelect = null;
            this._kbnBrowserContext = null;
            this._kbnMouseX = null;
            this._kbnAutoFilterCheck = false;
            this._autoKbnSwipeLeft = false;
            this._autoKbnSwipeRight = false;
            this._kbnTransitionEnd = true;
            this._kbnDdlWindowResize = false;
            this._conmenu = null;
            this._rowIndexesColl = [];
            this.templates = {};
            this.initialRender = false;
            this._columnsWidthCollection = [];
            this._slTemplate = "";
            this._cardTemplate = "";
            this._tdsOffsetWidth = [];
            this._scrollObject = null;
            this._templateRefresh = false;
            this._action = "";
            this._hiddenColumns = [];
            this._visibleColumns = [];
            this._filterCollection = [];
            this.collapsedColumns = null;
            this._expandedColumns = null;
            this._headerColumnNames = null;
            this._isWatermark = null;
            this._searchInput = null;
            this._hiddenSpan = null;
            this._currentRowCellIndex = [];
            this._recordsCount = 0;
            this._dropinside = false;
            this._selectedCards = [];
            this._selectedCardData = [];
            this._tableBEle = null;
            this._saveArgs = null;
            this._cModifiedData = null;
            this._dropped = null;
            this._cAddedRecord = null;
            this._externalObj = null;
            this._externalDrop = false;
            this._externalData = [];
            this._cDeleteData = null;
            this._isAddNewClick = false;
            this._isEdit = false;
            this._currentData = null;
            this._newCard = null;
            this._cardEditClick = null;
            this._collapsedCards = [];
            this._collapsedSwimlane = [];
            this._keyValue = [];
            this._dblArgs = null;
            this._freezeSwimlaneRow = {};
            this._freezeScrollTop = 0;
            this._freezeSlOrder = 0;
            this._originalWidth = null;
            this._originalScrollWidth = 0;
            this._collapsedColumns = [];
            this._enableMultiTouch = false;
            this._enableSwimlaneCount = true;
            this._kTouchBar = null;
            this._contextSwimlane = null;
            this._initialData = null;
            this._searchBar = null;
            this._originalScrollHeight = null;
            this._dataManager = null;
            this._priorityCollection = [];
            this._initialKanbanModel = [];
            this._kbnAdaptEditClickHandler = function (e) {
                if (this.element.hasClass('e-responsive')) {
                    var $target = $(e.target);
                    if ($target.attr('id') == this._id + "_Cancel" || $target.parent().attr("id") == this._id + "_closebutton")
                        this.KanbanEdit.cancelEdit();
                    if ($target.attr('id') == this._id + "_Save")
                        this.KanbanEdit.endEdit();
                }
            };
            this._keyPressed = function (action, target, e, event) {
                var value = this.KanbanCommon._kanbanKeyPressed(action, target, e, event);
                return value;
            };
            this._freezeSwimlane = function (e) {
                if (!ej.isNullOrUndefined(e.scrollLeft)) {
                    this.getHeaderContent().find("div").first().scrollLeft(e.scrollLeft);
                    this.getContent().find(".e-content").first().scrollLeft(e.scrollLeft);
                }
                this.KanbanSwimlane && this.KanbanSwimlane._freezeRow(e, this);
            };
            this.getCurrentJsonData = function () {
                return this._currentJsonData;
            };
            if (element) {
                this._id = element[0].id;
                if (!element["jquery"])
                    element = $('#' + element);
                if (element.length) {
                    return $(element).ejKanban(options).data(this.PluginName);
                }
            }
        }
        Kanban.prototype.getHeaderTable = function () {
            return this.headerTable;
        };
        Kanban.prototype.setHeaderTable = function (value) {
            this.headerTable = value;
        };
        Kanban.prototype.getColumnByHeaderText = function (headerText) {
            if (ej.isNullOrUndefined(headerText))
                return;
            var columns = this.model.columns;
            for (var i = 0; i < columns.length; i++) {
                if (columns[i]["headerText"] == headerText)
                    break;
            }
            return i == columns.length ? null : columns[i];
        };
        Kanban.prototype._getColumnKeyIndex = function (key) {
            var columns = this.model.columns, columnKey;
            for (var i = 0; i < columns.length; i++) {
                columnKey = typeof (columns[i]["key"]) == "object" ? columns[i]["key"] : columns[i]["key"].split(",");
                for (var j = 0; j < columnKey.length; j++)
                    if (columnKey[j] == key)
                        return i;
            }
            return i == columns.length ? null : columns[i];
        };
        Kanban.prototype._checkMultikey = function (columnTd) {
            var index = columnTd.index(), key;
            key = this.model.columns[index]["key"];
            key = typeof (key) == "object" ? key : key.split(",");
            if (key.length > 1)
                return true;
            else
                return false;
        };
        Kanban.prototype._destroy = function () {
            this.element.off();
            this.element.find(".e-kanbanheader").find(".e-headercontent")
                .add(this.getContent().find(".e-content")).off('scroll');
            if (!ej.isNullOrUndefined(this._filterToolBar))
                this._filterToolBar.ejToolbar("destroy");
            if (!ej.isNullOrUndefined(this._editForm)) {
                var formElement = this._editForm.find('.e-field'), $editElement, rteElement;
                for (var i = 0; i < formElement.length; i++) {
                    $editElement = $(formElement[i]);
                    if ($editElement.hasClass('e-ejinputtext'))
                        this.element.find('.e-ejinputtext').remove();
                    if ($editElement.hasClass('e-kanbantextarea'))
                        this.element.find('.e-kanbantextarea').remove();
                    if ($editElement.hasClass('e-dropdownlist'))
                        $editElement.ejDropDownList("destroy");
                    if ($editElement.hasClass("e-numerictextbox"))
                        $editElement.ejNumericTextbox("destroy");
                    rteElement = $editElement.parent('div').find("textarea.e-rte");
                    if (rteElement.length) {
                        rteElement.ejRTE("destroy");
                        $editElement.parent().find('textarea').remove();
                    }
                }
                $("#" + this._id + "_dialogEdit").ejDialog("destroy");
            }
            this.element.ejWaitingPopup("destroy");
            if (this.model.contextMenuSettings.enable) {
                $("#" + this._id + "_Context").ejMenu('destroy');
                $("#" + this._id + "_Context").remove();
            }
            this.element.children().remove();
            if (this.model.isResponsive)
                $(window).off("resize", $.proxy(this.kanbanWindowResize, this));
        };
        Kanban.prototype._menu = function (sender) {
            this.KanbanContext && this.KanbanContext._kanbanMenu(sender, this);
        };
        Kanban.prototype._setModel = function (options) {
            this.KanbanCommon._kanbanSetModel(options, this);
        };
        Kanban.prototype._onToolbarClick = function (sender) {
            var $kanbanEle = $(this["itemsContainer"]).closest(".e-kanban"), kObj = sender.type == "keyup" ? this : $kanbanEle.data("ejKanban");
            kObj["KanbanCommon"]._kanbanToolbarClick(sender, kObj);
        };
        Kanban.prototype._showToolTip = function (event) {
            var kObj = this;
            if (kObj.model.tooltipSettings.enable) {
                if ($(event.target).hasClass('e-kanbantooltip'))
                    return;
                var data, queryManager, kTooltip = kObj.element.find('.e-kanbantooltip'), template = ej.isNullOrUndefined(kObj.model.tooltipSettings.template);
                if (template && !($(event.target).hasClass('e-tag') || $(event.target).hasClass('e-text') || $(event.target).closest('.e-primarykey').length > 0))
                    return;
                if (template)
                    kTooltip.html($(event.target).text()).removeClass("e-tooltiptemplate");
                else {
                    kTooltip.addClass("e-tooltiptemplate");
                    queryManager = new ej.DataManager(kObj._currentJsonData);
                    data = queryManager.executeLocal(new ej.Query().where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, $(event.currentTarget).attr("id")));
                    kTooltip.html($(kObj.model.tooltipSettings.template).render(data[0]));
                }
                var xPos = !ej.isNullOrUndefined(event.originalEvent) ? event.pageX : event.originalEvent.clientX;
                var yPos = !ej.isNullOrUndefined(event.originalEvent) ? event.pageY : event.originalEvent.clientY;
                var tooltipdivelmt = $(kObj.element).find('.e-kanbantooltip');
                xPos = ((xPos + tooltipdivelmt.width()) < $(kObj.element).width()) ? (xPos) : (xPos - tooltipdivelmt.width());
                yPos = ((yPos + tooltipdivelmt.height()) < $(kObj.element).height()) ? (yPos) : (yPos - tooltipdivelmt.height());
                tooltipdivelmt.css("left", xPos);
                tooltipdivelmt.css("top", yPos);
                if (kObj.model.enableRTL == true)
                    tooltipdivelmt.addClass("e-rtl");
                $(kObj.element).find('.e-kanbantooltip').show();
            }
        };
        Kanban.prototype._hideToolTip = function () {
            if (this.model.tooltipSettings.enable)
                this.element.find('.e-kanbantooltip').hide();
        };
        Kanban.prototype.showColumns = function (c) {
            var args = {}, key, hidden = "_hiddenColumns", visible = "_visibleColumns";
            key = typeof (c) == "string" ? this.getColumnByHeaderText(c) : this.getColumnByHeaderText(c[0]);
            this.KanbanCommon._showExpandColumns(key, c, hidden, visible);
            this.KanbanCommon._showhide(this[visible], "show");
            this.KanbanCommon._renderLimit();
            this.KanbanCommon._totalCount();
            if (this.model.stackedHeaderRows.length > 0) {
                this.KanbanCommon._refreshStackedHeader();
            }
        };
        Kanban.prototype.print = function (singleCard) {
            var args = {}, elementClone;
            args["requestType"] = "print";
            this._trigger("actionBegin", args);
            if (!ej.isNullOrUndefined(this.element.find("#" + this._id + "_externalEdit")))
                this.element.find("#" + this._id + "_externalEdit").css("display", "none");
            var elementClone = this.element.clone();
            elementClone.find(".e-kanbantouchbar").remove();
            if (this.model.allowScrolling) {
                var scrollWidth = this.model.scrollSettings.width, scrollHeight = this.model.scrollSettings.height;
                if (this.getScrollObject().isVScroll() || this.getScrollObject().isHScroll()) {
                    var scrollContent = this.getContent().find('.e-content')[0];
                    elementClone.find('.e-kanbancontent').height(scrollContent.scrollHeight);
                    elementClone.find('.e-kanbancontent').ejScroller({ width: scrollContent.scrollWidth, height: scrollContent.scrollHeight });
                    elementClone.width(scrollContent.scrollWidth);
                }
            }
            if (!ej.isNullOrUndefined(this.model.filterSettings) || this.model.allowSearching || this.model.allowPrinting || !ej.isNullOrUndefined(this.model.customToolbarItems))
                elementClone.find(".e-kanbantoolbar").remove();
            elementClone.find(".e-kanbancontent div:first").nextAll().remove();
            if (singleCard) {
                var singleCard, column, card;
                if (typeof singleCard == "string" || typeof singleCard == "number")
                    singleCard = this.element.find('div.e-kanbancard[id=' + singleCard + ']');
                elementClone.find(".e-kanbanheader").remove();
                column = singleCard.parent().clone(), card = singleCard.clone();
                column.children().remove();
                elementClone.find('table[data-role="kanban"]').remove();
                elementClone.find(".e-kanbancontent").children().append(column.append(card));
                elementClone.css("border-style", "none");
                if (this.model.allowScrolling) {
                    elementClone.css({ "width": "auto", "height": "auto" });
                    elementClone.find(".e-kanbancontent").css({ "width": "auto", "height": "auto" });
                }
                else
                    elementClone.find(".e-kanbancard").css("width", "30%");
            }
            var printWin = window.open('', 'print', "height=452,width=1024,tabbar=no");
            args = { requestType: "print", element: elementClone };
            this._trigger("beforePrint", args);
            if (!ej.isNullOrUndefined(args["element"]))
                elementClone = args["element"];
            ej.print(elementClone, printWin);
            this._trigger("actionComplete", args);
        };
        Kanban.prototype._kbnAdaptClickHandler = function (e) {
            if (this.KanbanAdaptive)
                this.KanbanAdaptive._adaptiveKbnClick(e);
        };
        Kanban.prototype._kbnTouchEndHandler = function (e) {
            var clone = this.element.find('.e-draggedcard');
            if (clone.length > 0)
                clone.remove();
            this._cardSelect = 'null';
        };
        ;
        Kanban.prototype._kbnTouchClick = function (e) {
            if (this.model.selectionType == "multiple") {
                if (this._kTouchBar.is(':visible') && (!$(e.target).hasClass('e-cardselection') && $(e.target).parents('.e-cardselection').length <= 0 && !$(e.target).hasClass('e-cardtouch') && $(e.target).parents('.e-cardtouch').length <= 0) && !this._kTouchBar.find(".e-cardtouch").hasClass("e-spanclicked"))
                    this._kTouchBar.hide();
            }
            if (e.type == 'touchstart')
                this._cardSelect = 'touch';
            if (this.model.allowSearching && !this.element.hasClass('e-responsive')) {
                var searchBar = this.element.find('.e-searchbar.e-ul');
                if (($(e.target).hasClass('e-searchitem') && $(e.target).hasClass('e-cancel')) || ($(e.target).parents('.e-searchdiv').length > 0 && $(e.target).parents('.e-searchbar').find('.e-cancel').length > 0))
                    searchBar.addClass('e-highliht-kbnsearchbar');
                else if ($(e.target).hasClass('e-searchitem') && $(e.target).hasClass('e-searchfind'))
                    searchBar.removeClass('e-highliht-kbnsearchbar');
            }
        };
        Kanban.prototype._kbnHoldHandler = function (e) {
            if (this.model.enableTouch && ($(e.target).hasClass('e-kanbancard') || $(e.target).parents('.e-kanbancard').length > 0) && (e.type == "taphold" && e.pointerType == "touch")) {
                this._cardSelect = 'hold';
                var target = $(e.target), clonedElement = null;
                if ($(e.target).parents('.e-kanbancard').length > 0)
                    target = $(e.target).parents('.e-kanbancard');
                if (this.KanbanDragAndDrop) {
                    clonedElement = this.KanbanDragAndDrop._createCardClone(clonedElement, target);
                    clonedElement.css({ 'position': 'absolute', 'top': e.originalEvent.changedTouches[0].pageY, 'left': e.originalEvent.changedTouches[0].pageX });
                    clonedElement.addClass('e-left-rotatecard');
                }
            }
        };
        Kanban.prototype._swipeKanban = function (e) {
            if (this.element.hasClass('e-responsive') && this._kbnTransitionEnd && this.element.find('.e-targetclone').length == 0) {
                switch (e.type) {
                    case "swipeleft":
                        this.KanbanAdaptive._kbnLeftSwipe();
                        break;
                    case "swiperight":
                        this.KanbanAdaptive._kbnRightSwipe();
                        break;
                }
            }
        };
        Kanban.prototype._wireEvents = function () {
            this._on(this.element, ($.isFunction($.fn.tap) && this.model.enableTouch) ? "tap" : "click", "", this._clickHandler);
            this._on($("#" + this._id + "_searchbar"), "keyup", "", this._onToolbarClick);
            this._on($(document), 'click touchstart', "", this._kbnTouchClick);
            this._on(this.element, "taphold", "", this._kbnHoldHandler);
            this._on(this.element, "touchend", "", this._kbnTouchEndHandler);
            this._on(this.element, ($.isFunction($.fn.doubletap) && this.model.enableTouch) ? "doubletap" : "dblclick", ".e-kanbancard", this._cardDblClickHandler);
            if (this.KanbanAdaptive) {
                this._on(this.element, "swipeleft swiperight", ".e-kanbancontent", $.proxy(this._swipeKanban, this));
            }
            if (this.KanbanContext)
                this._on(this.element, "contextmenu", "", this.KanbanContext._kbnBrowserContextMenu);
            if (this.KanbanFilter)
                this._on($("#" + this._id + "_searchbar"), "keypress", "", this.KanbanFilter._onToolbarKeypress);
            if (this.KanbanEdit) {
                if (ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version, 10) == 8)
                    $(window).on("resize", $.proxy(this.kanbanWindowResize, this));
                this._enableEditingEvents();
            }
            this._enableCardHover();
            if (this.model.tooltipSettings.enable) {
                this._on(this.element, "mouseover", ".e-kanbancard", this._showToolTip);
                this._on(this.element, "mouseout", ".e-kanbancard", this._hideToolTip);
            }
            if (this.model.allowKeyboardNavigation) {
                this.element[0].tabIndex = this.element[0].tabIndex == -1 ? 0 : this.element[0].tabIndex;
                this.element[0].accessKey = (!ej.isNullOrUndefined(this.element[0].accessKey) && this.element[0].accessKey != "") ? this.element[0].accessKey : "e";
                this._on(this.element, "keyup", "", undefined);
            }
        };
        Kanban.prototype._enableEditingEvents = function () {
            if (this.model.editSettings.allowAdding)
                this._on(this.element, "dblclick doubletap", ".e-kanbancontent .e-columnrow .e-rowcell", this._cellDblClickHandler);
            else
                this._off(this.element, "dblclick doubletap", ".e-kanbancontent .e-columnrow .e-rowcell");
            if (this.model.editSettings.allowEditing || this.model.editSettings.allowAdding)
                this._on($("#" + this._id + "_dialogEdit"), "click keypress", "#EditDialog_" + this._id + "_Save ,#EditDialog_" + this._id + "_Cancel", this._clickHandler);
            else
                this._off($("#" + this._id + "_dialogEdit"), "click", "#EditDialog_" + this._id + "_Save ,#EditDialog_" + this._id + "_Cancel");
        };
        Kanban.prototype._cardDblClickHandler = function (args) {
            this._dblArgs = args;
            var cardDiv, pKey = this.model.fields.primaryKey, primaryKey, editingManager, queryManager = new ej.Query();
            cardDiv = ($(args.target).closest('.e-kanbancard'));
            primaryKey = cardDiv.attr('id');
            editingManager = new ej.DataManager(this._currentJsonData);
            queryManager = queryManager.where(pKey, ej.FilterOperators.equal, primaryKey);
            this._currentData = editingManager.executeLocal(queryManager);
            this._dblArgs.data = this._currentData[0];
            this._trigger("cardDoubleClick", this._dblArgs);
            if (!this._isEdit) {
                this._cardEditClick = true;
                if (!ej.isNullOrUndefined(this._cardEditClick) && this._cardEditClick) {
                    if (this._dblArgs.cancel) {
                        this._cardEditClick = null;
                        return;
                    }
                }
                if (this.model.editSettings.allowEditing)
                    this.KanbanEdit.startEdit($(args.target).closest('.e-kanbancard'));
            }
        };
        Kanban.prototype._cellDblClickHandler = function (args) {
            if ($(args.target).hasClass('e-rowcell')) {
                this._isAddNewClick = true;
                this._newCard = $(args.target);
                this.KanbanEdit.addCard();
            }
        };
        Kanban.prototype._enableCardHover = function () {
            if (this.model.allowHover)
                this._on(this.element, "mouseenter mouseleave", ".e-columnrow .e-kanbancard", this._cardHover);
            else
                this._off(this.element, "mouseenter mouseleave", ".e-columnrow .e-kanbancard");
        };
        Kanban.prototype.refreshColumnConstraints = function () {
            this.KanbanCommon._renderLimit();
            if (this.KanbanSwimlane && this._enableSwimlaneCount)
                this.KanbanSwimlane._swimlaneLimit();
            this._enableSwimlaneCount = false;
        };
        Kanban.prototype.hideColumns = function (c) {
            var i, index, count = 0, args = {}, key, hidden = "_hiddenColumns", visible = "_visibleColumns";
            for (i = 0; i < this._visibleColumns.length; i++) {
                index = $.inArray(this._collapsedColumns[i], this._visibleColumns);
                if (index != -1)
                    count++;
            }
            if (this._visibleColumns.length - 1 > count) {
                key = typeof (c) == "string" ? this.getColumnByHeaderText(c) : this.getColumnByHeaderText(c[0]);
                this.KanbanCommon._hideCollapseColumns(key, c, hidden, visible);
                this.KanbanCommon._showhide(this[hidden], "hide");
                if (this.model.stackedHeaderRows.length > 0)
                    this.KanbanCommon._refreshStackedHeader();
            }
            else {
                if (this._visibleColumns.length == 1)
                    return;
                else if (this._visibleColumns[0] == c)
                    this.KanbanCommon._expandColumns(this._visibleColumns[1]);
                else
                    this.KanbanCommon._expandColumns(this._visibleColumns[0]);
                this.hideColumns(c);
            }
            this.KanbanCommon._renderLimit();
            this.KanbanCommon._totalCount();
            this.KanbanCommon._stackedHeadervisible();
        };
        Kanban.prototype._cardHover = function (e) {
            var $target = $(e.target), $kanbanRows = $(this._kanbanRows), parentDiv = $($target).closest(".e-kanbancard");
            if (parentDiv.length <= 0)
                return false;
            if (this.model.allowHover) {
                if (e.type == "mouseenter") {
                    if (!ej.isNullOrUndefined($kanbanRows))
                        parentDiv.index() != -1 && parentDiv.addClass("e-hover");
                }
                else
                    $kanbanRows.find(".e-kanbancard").removeClass("e-hover");
            }
            return false;
        };
        Kanban.prototype.toggleCard = function ($target) {
            var $curCard;
            if (typeof $target == "string" || typeof $target == "number") {
                $curCard = this.element.find('div.e-kanbancard[id=' + $target + ']');
                this.KanbanCommon._toggleCardByTarget($($curCard).find(".e-cardheader .e-icon"));
            }
            else if (typeof $target == "object" && $target[0].nodeName != "DIV") {
                for (var i = 0; i < $target.length; i++) {
                    $curCard = this.element.find('div.e-kanbancard[id=' + $target[i] + ']');
                    this.KanbanCommon._toggleCardByTarget($($curCard).find(".e-cardheader .e-icon"));
                }
            }
            else
                this.KanbanCommon._toggleCardByTarget($target);
        };
        Kanban.prototype.toggleColumn = function ($target) {
            if (typeof $target === "string" || "object" && ($target[0].nodeName != "DIV" && $target[0].nodeName != "TD"))
                this.KanbanCommon._toggleField($target);
            else if ($target[0].nodeName == "TD")
                this.KanbanCommon._toggleField($target.closest(".e-shrink").find(".e-shrinkheader").text().split("[")[0]);
            else {
                var stackedHeaderCel, colHeader, headerCell, i, stackedHeaderColumns, cols = this.model.columns, cText;
                if (this.model.stackedHeaderRows.length)
                    stackedHeaderColumns = this.model.stackedHeaderRows[0].stackedHeaderColumns;
                headerCell = $target.closest(".e-headercell").not(".e-stackedHeaderCell");
                colHeader = this.element.find(".e-columnheader").not(".e-stackedHeaderRow").find(".e-hide");
                if (headerCell.length > 0)
                    this.KanbanCommon._toggleField(cols[headerCell.index()].headerText);
                else if ($target.closest(".e-shrink").find(".e-shrinkheader").length > 0) {
                    for (i = 0; i < colHeader.length; i++) {
                        cText = $(colHeader[i]).find(".e-headerdiv").text().split('[')[0];
                        if (cText == $target.closest(".e-shrink").find(".e-shrinkheader").text().split("[")[0]) {
                            $(colHeader[i]).next().find(".e-clcollapse").addClass("e-clexpand");
                            $(colHeader[i]).next().find(".e-clexpand").removeClass("e-clcollapse");
                            this.KanbanCommon._toggleField(cText);
                        }
                    }
                }
                else if ($target.closest(".e-stackedHeaderRow").length > 0) {
                    stackedHeaderCel = $target.closest(".e-stackedHeaderCell");
                    for (i = 0; i < stackedHeaderColumns.length; i++)
                        if (stackedHeaderColumns[i].headerText == $(stackedHeaderCel).text()) {
                            if (stackedHeaderCel.hasClass("e-collapse"))
                                this.element.find(".e-stackedHeaderCell").eq(i).removeClass("e-collapse");
                            else
                                this.element.find(".e-stackedHeaderCell").eq(i).addClass("e-collapse");
                            this.KanbanCommon._toggleField(stackedHeaderColumns[i].column.split(","));
                        }
                }
            }
            if (this.element.find(".e-targetdragclone").is(":visible")) {
                var nextEle = this.element.find(".e-targetdragclone").next(".e-kanbancard").eq(0);
                if (nextEle.length > 0)
                    this.element.find(".e-targetdragclone").width(nextEle.width());
                else
                    this.element.find(".e-targetdragclone").width("");
            }
            if (this.model.allowScrolling && this.model.allowToggleColumn)
                this.KanbanCommon._setWidthToColumns();
        };
        Kanban.prototype._toggleKey = function ($target) {
            var $tgrow = $target.parents(".e-rowcell"), $key = $tgrow.find(".e-toggle-cards"), $tgkey = $tgrow.find(".e-toggle-icon").children(), $tlkey = $tgrow.find(".e-toggle-key"), $tgtl = $tgrow.find(".e-toggle-cards .e-togglekey");
            if ($tgkey.hasClass("e-icon e-toggle-expand")) {
                $key.removeClass("e-hide");
                $tlkey.html(this.localizedLabels.Hide);
                $tgkey.removeClass("e-toggle-expand").addClass("e-toggle-collapse");
                var tgcount = $tgtl.length;
                for (var i = 0; i < tgcount; i++)
                    if (!$tgtl.eq(i).children().hasClass("e-kanbancard"))
                        $tgtl.eq(i).hide();
            }
            else {
                $key.addClass("e-hide");
                $tlkey.html(this.localizedLabels.Show);
                $tgkey.removeClass("e-toggle-collapse").addClass("e-toggle-expand");
            }
            if (this.KanbanScroll)
                this.KanbanScroll._refreshScroller({ requestType: "refresh" });
        };
        Kanban.prototype._clickevent = function (sender) {
            this.KanbanContext && this.KanbanContext._kanbanContextClick(sender, this);
        };
        Kanban.prototype._clickHandler = function (e) {
            var $target = $(e.target), parentDiv;
            var columnIndex = $target.hasClass("e-rowcell") ? $target.index() : $target.closest(".e-rowcell").index();
            var rowIndex = this.getIndexByRow($target.closest("tr.e-columnrow"));
            parentDiv = $target.closest('.e-kanbancard');
            if ($(e.target).hasClass("e-customaddbutton") || $(e.target).parents(".e-customaddbutton").length > 0) {
                this._isAddNewClick = true;
                this._newCard = $(e.target).parents('.e-rowcell');
                if (this.KanbanEdit)
                    this.KanbanEdit.addCard();
            }
            if ($target.hasClass("e-cardexpand") || $target.hasClass("e-cardcollapse") || $target.hasClass("e-expandcollapse"))
                this.toggleCard($target);
            if (($target.closest(".e-clexpand").length || $target.closest(".e-clcollapse").length || $target.closest(".e-shrink").length || $target.closest(".e-stackedHeaderRow").length) && this.model.allowToggleColumn)
                this.toggleColumn($target);
            if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey) && ($target.hasClass("e-slexpandcollapse") || $target.hasClass("e-slexpand") || $target.hasClass("e-slcollapse")))
                this.KanbanSwimlane.toggle($target);
            if ($target.hasClass("e-toggle-header") || $target.parents(".e-toggle-header").length > 0)
                this._toggleKey($target);
            if (this.model.allowSelection && this.KanbanSelection && parentDiv.length > 0 && $target.closest(".e-expandcollapse").length <= 0) {
                var parentIndex = $(parentDiv.parent()).children().eq(0).hasClass("e-limits") ? parentDiv.index() - 1 : parentDiv.index();
                if (this.model.selectionType == "single")
                    this.KanbanSelection._cardSelection([[rowIndex, [columnIndex], [parentIndex]]], parentDiv, e);
                else if (this.model.selectionType == "multiple") {
                    if (e.shiftKey || e.ctrlKey || this._enableMultiTouch) {
                        if (this._currentRowCellIndex.length == 0 || rowIndex == this._currentRowCellIndex[0][0])
                            this.KanbanSelection._cardSelection([[rowIndex, [columnIndex], [parentIndex]]], parentDiv, e);
                    }
                    else
                        this.KanbanSelection._cardSelection([[rowIndex, [columnIndex], [parentIndex]]], parentDiv, e);
                }
            }
            if (parentDiv.length > 0)
                this.KanbanCommon._cardClick($target, parentDiv);
            if ($target.attr('id') == this._id + "_Cancel" || $target.parent().attr("id") == this._id + "_closebutton")
                this.KanbanEdit.cancelEdit();
            if ($target.attr('id') == this._id + "_Save")
                this.KanbanEdit.endEdit();
            if ($target.hasClass("e-cardtouch")) {
                if (!$target.hasClass("e-spanclicked")) {
                    $target.addClass("e-spanclicked");
                    this._enableMultiTouch = true;
                }
                else {
                    $target.removeClass("e-spanclicked");
                    this._enableMultiTouch = false;
                    this._kTouchBar.hide();
                }
            }
            this.KanbanCommon._kbnHeaderAndCellEvents($target);
        };
        Kanban.prototype.getRowByIndex = function (index) {
            if (!ej.isNullOrUndefined(index))
                return $((this._columnRows)[index]);
            return;
        };
        Kanban.prototype.getScrollObject = function () {
            if (this._scrollObject == null || ej.isNullOrUndefined(this._scrollObject.model))
                this._scrollObject = this.getContent().ejScroller("instance");
            return this._scrollObject;
        };
        Kanban.prototype.getIndexByRow = function ($tr) {
            return $(this._columnRows).index($tr);
        };
        Kanban.prototype._initialize = function () {
        };
        Kanban.prototype._initPrivateProperties = function () {
            this.currentViewData = null;
            this._filterCollection = [];
            this._collapsedColumns = [];
            this._expandedColumns = [];
            this._hiddenColumns = [];
            this._visibleColumns = [];
            this._columnsWidthCollection = [];
            this._dataManager = this._dataSource() instanceof ej.DataManager ? this._dataSource() : this._dataSource() != null ? new ej.DataManager(this._dataSource()) : null;
            this._originalWidth = this.element.width();
            this._recordsCount = this._dataSource() !== null ? this._dataSource().length : 0;
            ej.Kanban.Locale["default"] = ej.Kanban.Locale["en-US"] = {
                EmptyCard: "No cards to display",
                SaveButton: "Save",
                CancelButton: "Cancel",
                EditFormTitle: "Details of ",
                AddFormTitle: "Add New Card",
                SwimlaneCaptionFormat: "- {{:count}}{{if count == 1 }} item {{else}} items {{/if}}",
                FilterSettings: "Filters:",
                FilterOfText: "of",
                Max: "Max",
                Min: "Min",
                Cards: "  Cards",
                ItemsCount: "Items Count :",
                Unassigned: "Unassigned",
                AddCard: "Add Card",
                EditCard: "Edit Card",
                DeleteCard: "Delete Card",
                TopofRow: "Top of Row",
                BottomofRow: "Bottom of Row",
                MoveUp: "Move Up",
                MoveDown: "Move Down",
                MoveLeft: "Move Left",
                MoveRight: "Move Right",
                MovetoSwimlane: "Move to Swimlane",
                HideColumn: "Hide Column",
                VisibleColumns: "Visible Columns",
                PrintCard: "Print Card",
                Show: "Show",
                Hide: "Hide",
                Search: "Search"
            };
            this.localizedLabels = this._getLocalizedLabels();
        };
        Kanban.prototype._init = function () {
            this._initPrivateProperties();
            this._initialKanbanModel = $.extend(true, {}, this.model);
            var args = { keyFiltering: true };
            this._trigger("load", args);
            this._keyFiltering = args.keyFiltering;
            if (ej.isNullOrUndefined(this.model.query) || !(this.model.query instanceof ej.Query))
                this.model.query = new ej.Query();
            this._initSubModules();
            this._initialize();
            if (this.model.columns.length == 0)
                return false;
            if (this.KanbanAdaptive)
                this.KanbanAdaptive._kbnAdaptSwimlaneData();
            this.element.removeClass("e-kanbanscroll");
            if (this.KanbanScroll)
                this.KanbanScroll._initScrolling();
            this._checkDataBinding();
        };
        Kanban.prototype._initSubModules = function () {
            var model = this.model;
            this.KanbanCommon = new ej.KanbanFeatures.Common(this);
            if (model.allowDragAndDrop)
                this.KanbanDragAndDrop = new ej.KanbanFeatures.DragAndDrop(this);
            if (model.editSettings.allowEditing || model.editSettings.allowAdding)
                this.KanbanEdit = new ej.KanbanFeatures.Edit(this);
            if (model.isResponsive)
                this.KanbanAdaptive = new ej.KanbanFeatures.Adaptive(this);
            if (model.isResponsive && model.minWidth > 0)
                model.allowScrolling = true;
            if (model.allowScrolling)
                this.KanbanScroll = new ej.KanbanFeatures.Scroller(this);
            if (model.contextMenuSettings.enable)
                this.KanbanContext = new ej.KanbanFeatures.Context(this);
            if (model.fields && !ej.isNullOrUndefined(model.fields.swimlaneKey))
                this.KanbanSwimlane = new ej.KanbanFeatures.Swimlane(this);
            if (model.allowSelection)
                this.KanbanSelection = new ej.KanbanFeatures.Selection(this);
            if (model.filterSettings.length > 0 || model.allowFiltering || model.customToolbarItems.length > 0 || model.allowPrinting || model.allowSearching)
                this.KanbanFilter = new ej.KanbanFeatures.Filter(this);
        };
        Kanban.prototype.kanbanWindowResize = function (e) {
            if (!this.KanbanAdaptive)
                return;
            if (this._kbnDdlWindowResize && ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version, 10) == 8)
                e.stopImmediatePropagation();
            var toolbar = this.element.find('.e-kanbantoolbar'), curItem = this.model.fields.swimlaneKey, searchBar;
            if (this.model.isResponsive && (ej.isNullOrUndefined(this.model.minWidth) || this.model.minWidth == 0)) {
                var $filterWin = $('.e-kanbanfilter-window'), browResponsive = true;
                if (ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version, 10) <= 9)
                    browResponsive = false;
                if (browResponsive) {
                    if (window.matchMedia("(max-width: 801px)").matches || window.matchMedia("(max-device-width: 1200px)").matches) {
                        if (this.model.isResponsive && this.kanbanContent.hasClass('e-scroller'))
                            this.kanbanContent.data('ejScroller').destroy();
                        if (!this.element.hasClass('e-responsive')) {
                            this.element.addClass('e-responsive');
                            toolbar.css('display', 'table');
                            toolbar.find('.e-searchdiv').hide();
                            toolbar.find('.e-search').css({ 'border': 'none' });
                            if (!ej.isNullOrUndefined(curItem))
                                this.KanbanAdaptive._kbnAdaptSwimlaneDdl();
                            if (this.model.filterSettings.length > 0) {
                                this.KanbanAdaptive._kbnAdaptFilterWindow();
                                this._kbnFilterCollection = this._filterCollection.slice();
                            }
                            this._on($('.e-swimlane-window,.e-kanbanfilter-window,.e-kanbantoolbar'), ($.isFunction($.fn.tap) && this.model.enableTouch) ? "tap" : "click", "", this._kbnAdaptClickHandler);
                        }
                        this.KanbanAdaptive._columnTimeoutAdapt();
                        if (!this.element.hasClass('e-swimlane-responsive')) {
                            var rowCell = this.element.find('.e-rowcell:visible');
                            for (var i = 0; i < rowCell.length; i++) {
                                if (rowCell.eq(i).height() + rowCell.eq(i).offset().top > $(window).height()) {
                                    var cellScrollContent = rowCell.eq(i).find('.e-cell-scrollcontent');
                                    if (cellScrollContent.length > 0) {
                                        cellScrollContent.ejScroller({ height: $(window).height() - (this.kanbanContent.offset().top + 2), buttonSize: 0, scrollerSize: 9, enableTouchScroll: true, autoHide: true });
                                        rowCell.eq(i).find('.e-shrinkheader').prependTo(rowCell.eq(i));
                                    }
                                    else {
                                        cellScrollContent = ej.buildTag("div.e-cell-scrollcontent", "<div></div>");
                                        rowCell.eq(i).append(cellScrollContent);
                                        cellScrollContent.children().append(rowCell.eq(i).children(":not('.e-cell-scrollcontent')"));
                                        cellScrollContent.ejScroller({
                                            height: $(window).height() - (this.kanbanContent.offset().top + 2),
                                            thumbStart: $.proxy(this._kbnThumbStart, this),
                                            buttonSize: 0,
                                            scrollerSize: 9,
                                            enableTouchScroll: true,
                                            autoHide: true
                                        });
                                        rowCell.eq(i).find('.e-shrinkheader').prependTo(rowCell.eq(i));
                                    }
                                }
                            }
                        }
                        searchBar = this.element.find('.e-searchbar');
                        if (searchBar.length > 0) {
                            if (searchBar.find('.e-ejinputtext').val().length > 0) {
                                var $target = searchBar.find('.e-searchitem');
                                $target.addClass('e-searchfind');
                                $target.prev().show();
                                searchBar.siblings().hide();
                                if (searchBar.find('.e-adapt-search').length == 0) {
                                    var searchDiv = ej.buildTag('div.e-icon e-adapt-search e-searchfind', "", {}), cancelDiv;
                                    cancelDiv = ej.buildTag('div.e-icon e-adapt-cancel e-cancel', "", {});
                                    $target.siblings('.e-searchdiv').append(cancelDiv).prepend(searchDiv);
                                }
                                $target.parents('.e-search').css({ 'border': '' });
                                $target.parents('body').removeClass('e-kbnwindow-modal');
                                $target.parents('.e-kanbantoolbar').addClass('e-adaptive-search');
                                searchBar.find('.e-adapt-cancel').show();
                                $target.hide();
                            }
                        }
                        if (this.model.filterSettings.length > 0) {
                            var filters = this.element.find('.e-quickfilter').nextAll('.e-tooltxt');
                            for (var i = 0; i < filters.length; i++) {
                                if (filters.eq(i).hasClass('e-select')) {
                                    var index = filters.index(filters.eq(i)), flIcon = this.element.find('.e-kanbanfilter-icon');
                                    this._kbnAutoFilterCheck = true;
                                    $filterWin.find('.e-filter-content span.e-chkbox-wrap').eq(index).click();
                                    this._kbnAutoFilterCheck = false;
                                    if (!flIcon.hasClass('e-kbnclearfl-icon'))
                                        flIcon.addClass('e-kbnclearfl-icon');
                                    filters.eq(i).removeClass('e-select');
                                }
                            }
                        }
                        if (!ej.isNullOrUndefined(curItem))
                            this.kanbanContent.ejScroller({
                                height: $(window).height() - (this.headerContent.offset().top + this.headerContent.height() + 5),
                                scroll: $.proxy(this._freezeSwimlane, this),
                                thumbStart: $.proxy(this._kbnThumbStart, this),
                                buttonSize: 0,
                                scrollerSize: 9,
                                enableTouchScroll: true,
                                autoHide: true
                            });
                        if (!this.element.hasClass('e-swimlane-responsive')) {
                            var scrollEle = this.element.find('.e-rowcell .e-cell-scrollcontent:visible');
                            for (var i = 0; i < scrollEle.length; i++) {
                                var scrollObj = $(scrollEle[i]).data('ejScroller');
                                if (!ej.isNullOrUndefined(scrollObj))
                                    scrollObj.refresh();
                            }
                        }
                        var kbnDialog = this.element.find('.e-kanbandialog'), slWindow = this.element.find('.e-swimlane-window');
                        if (kbnDialog.is(':visible') && this.KanbanAdaptive)
                            this.KanbanAdaptive._setAdaptEditWindowHeight();
                        if (!ej.isNullOrUndefined(curItem) && slWindow.is(':visible')) {
                            var slScroller = this.element.find('.e-slwindow-scrollcontent'), top = this.headerContent.offset().top;
                            slScroller.ejScroller({ height: $(window).height() - slScroller.offset().top, buttonSize: 0, scrollerSize: 9, enableTouchScroll: true, autoHide: true });
                            slScroller.data('ejScroller').refresh();
                            slWindow.css({ height: $(window).height() - top });
                        }
                        if (this.KanbanSwimlane)
                            this.KanbanSwimlane._removeFreezeRow();
                        if (this.model.allowSearching && ej.browserInfo().name == "webkit")
                            this.element.find('.e-searchitem').addClass('e-webkitadapt-search');
                    }
                    else {
                        if (this.KanbanAdaptive) {
                            var toolBar = $('#' + this._id + "_toolbarItems");
                            if (toolBar.parents('.e-kanban').length == 0) {
                                toolBar.removeClass('e-kbntoolbar-body').prependTo(this.element);
                                $('#' + this._id + "_slWindow").removeClass('e-kbnslwindow-body').appendTo(this.element);
                            }
                            this.KanbanAdaptive._removeKbnAdaptItems();
                            this.element.find('.e-webkitadapt-search').removeClass('e-webkitadapt-search');
                            if (this.model.allowScrolling) {
                                this.KanbanCommon._setWidthToColumns();
                                this.KanbanScroll._renderScroller();
                            }
                        }
                    }
                }
                if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey) && this.kanbanContent.hasClass('e-scroller'))
                    this.kanbanContent.data('ejScroller').refresh();
                this.KanbanAdaptive._setAdaptiveSwimlaneTop();
            }
            else {
                var width, height, winWidth, winHeight, elemHeight;
                this.model.scrollSettings.width = this._originalScrollWidth;
                this.element.outerWidth('100%');
                this.getContentTable().width('100%');
                this.getHeaderTable().width('100%');
                width = this.element.outerWidth();
                winWidth = $(window).width() - this.element.offset()['left'];
                winHeight = $(window).height() - this.element.offset()['top'];
                if (toolbar.length > 0)
                    winHeight = winHeight - (toolbar.outerHeight() + 25);
                elemHeight = this.headerContent.outerHeight() + this.getContentTable().height();
                var isScroller = this.model.minWidth > width || winWidth <= width || winHeight <= elemHeight;
                if (this.KanbanAdaptive)
                    this.KanbanAdaptive._renderResponsiveKanban(isScroller, elemHeight, width, winHeight, winWidth);
            }
        };
        Kanban.prototype._initKanbanRender = function () {
            var proxy = this;
            this._addInitTemplate();
            if (this.model.keySettings)
                $.extend(this.model.keyConfigs, this.model.keySettings);
            this._render();
            this._trigger("dataBound", {});
            if (this.model.contextMenuSettings.enable) {
                if (!this._dataManager.dataSource.offline) {
                    var queryPromise = proxy._dataSource().executeQuery(this.model.query);
                    queryPromise.done(ej.proxy(function (e) {
                        proxy._contextSwimlane = new ej.DataManager(e.result);
                        proxy.KanbanContext._renderContext();
                    }));
                }
                else
                    this.KanbanContext._renderContext();
            }
            if (this.KanbanEdit) {
                this.KanbanEdit._processEditing();
                if (this.model.editSettings.editMode == "dialog" || this.model.editSettings.editMode == "dialogtemplate")
                    this.element.append(this.KanbanEdit._renderDialog());
                else if (this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate")
                    this.element.append(this.KanbanEdit._renderExternalForm());
            }
            if (this.KanbanAdaptive)
                this.KanbanAdaptive._setResponsiveHeightWidth();
            if (this.KanbanSelection)
                this.KanbanSelection._renderKanbanTouchBar();
            this._wireEvents();
            if (this.model.tooltipSettings.enable) {
                this.element.append($("<div class='e-kanbantooltip'></div>"));
                this.element.find('.e-kanbantooltip').hide();
            }
            this.initialRender = false;
        };
        Kanban.prototype._render = function () {
            this.element.addClass(this.model.cssClass + "e-widget");
            this._renderContent().insertAfter(this.element.children(".e-kanbanheader"));
            if (this.model.enableTotalCount)
                this.KanbanCommon._totalCount();
            this.KanbanCommon._renderLimit();
            this.KanbanCommon._setWidthToColumns();
            this._enableDragandScroll();
            if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey))
                this._swimlaneRows = this.element.find('.e-swimlanerow');
            if (this.initialRender)
                this.KanbanCommon._addLastRow();
        };
        Kanban.prototype._renderHeader = function () {
            var $div = ej.buildTag('div.e-kanbanheader', "", {}, {}), $innerDiv = ej.buildTag('div', "", {}, {}), $colGroup = $(document.createElement('colgroup'));
            if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey))
                $div.addClass("e-slheader");
            if (this.model.allowScrolling)
                $innerDiv.addClass("e-headercontent");
            $div.append($innerDiv);
            var $table = ej.buildTag("table.e-table", "", {}, { "data-role": "kanban" });
            var $thead = ej.buildTag("thead", "", {}, {}), $tbody = ej.buildTag("tbody.e-hide", "", {}, {});
            for (var index = 0; index < this.model.stackedHeaderRows.length; index++) {
                var $tr = this.KanbanCommon._createStackedRow(this.model.stackedHeaderRows[index]);
                $thead.append($tr);
            }
            var $columnHeader = ej.buildTag('tr.e-columnheader', "", {}, {}), $rowBody = $(document.createElement('tr'));
            var columns = this.model.columns;
            this._visibleColumns = [];
            this._expandedColumns = [];
            this._headerColumnNames = {};
            for (var columnCount = 0; columnCount < columns.length; columnCount++) {
                var column = columns[columnCount];
                var $headerCell = ej.buildTag('th.e-headercell', "", {}, { "data-role": "columnheader" });
                var col = document.createElement('col'), bodyCell = document.createElement('td');
                var $headerCellDiv = ej.buildTag('div.e-headercelldiv', "", {}, {});
                var $headerDiv = ej.buildTag('div.e-headerdiv', column["headerText"] != null ? column["headerText"] : column["key"], {}, {});
                if (!ej.isNullOrUndefined(column["headerTemplate"]))
                    $headerDiv.html($(column["headerTemplate"]).hide().html());
                var $totalCard, $totalCount, $limit = null;
                if (this.model.enableTotalCount) {
                    $totalCard = ej.buildTag("div.e-totalcard", "", {}, {});
                    $totalCount = ej.buildTag("span.e-totalcount", "", {}, {});
                    if (!ej.isNullOrUndefined(column.totalCount) && !ej.isNullOrUndefined(column.totalCount.text))
                        $totalCard.append(column.totalCount.text + " : ").append($totalCount);
                    else
                        $totalCard.append(this.localizedLabels.ItemsCount).append($totalCount);
                    $headerCell.append($totalCard);
                }
                if (!ej.isNullOrUndefined(column.constraints)) {
                    var isMin = !ej.isNullOrUndefined(column.constraints['min']), isMax = !ej.isNullOrUndefined(column.constraints['max']);
                    $limit = ej.buildTag('div.e-limits', "", {}, {});
                    if (isMin) {
                        var $min = ej.buildTag("div.e-min", this.localizedLabels.Min, "", {});
                        var $minLimit = ej.buildTag("span.e-minlimit", " " + column.constraints['min'].toString(), "", {});
                        $min.append($minLimit);
                        $limit.append($min);
                    }
                    if (isMax) {
                        var $max = ej.buildTag("div.e-max", this.localizedLabels.Max, "", {});
                        var $maxLimit = ej.buildTag("span.e-maxlimit", " " + column.constraints['max'].toString(), "", {});
                        $max.append($maxLimit);
                        if (isMin)
                            $limit.append("/");
                        $limit.append($max);
                    }
                    if (this.model.enableTotalCount && $limit.children().length > 0)
                        $limit.prepend("|");
                }
                $headerCellDiv.append($headerDiv);
                $headerCell.prepend($headerCellDiv);
                $headerCell.append($limit);
                if (this.model.allowToggleColumn) {
                    if (columns[columnCount]["isCollapsed"] === true)
                        $headerCell.append(ej.buildTag('div.e-icon e-clcollapse', "", {}, {})).addClass("e-shrinkcol");
                    else
                        $headerCell.append(ej.buildTag('div.e-icon e-clexpand', "", {}, {}));
                }
                if (columns[columnCount]["isCollapsed"] === true && this.model.allowToggleColumn) {
                    $headerCell.find(".e-headercelldiv,.e-totalcard,.e-limits").addClass("e-hide") && $(col).addClass("e-shrinkcol");
                    if ($.inArray(columns[columnCount].headerText, this._collapsedColumns) == -1)
                        this._collapsedColumns.push(columns[columnCount].headerText);
                }
                else {
                    $headerCell.find(".e-headercelldiv,.e-totalcard").removeClass("e-hide") && $(col).removeClass("e-shrinkcol");
                    if (!ej.isNullOrUndefined(columns[columnCount].constraints) && columns[columnCount].constraints.type == "column")
                        $headerCell.find(".e-limits").removeClass("e-hide");
                    else
                        $headerCell.find(".e-limits").addClass("e-hide");
                    this._expandedColumns.push(columns[columnCount].headerText);
                    columns[columnCount]["isCollapsed"] = false;
                }
                $colGroup.append(col);
                $columnHeader.append($headerCell);
                $rowBody.append(bodyCell);
                if (column["visible"] === false) {
                    $headerCell.addClass("e-hide") && $(col).css("display", "none");
                    if ($.inArray(column.headerText, this._hiddenColumns) == -1)
                        this._hiddenColumns.push(column.headerText);
                }
                else {
                    this._visibleColumns.push(column.headerText);
                    column["visible"] = true;
                }
                var curLimits = $headerCell.find('.e-limits'), curTotal = $headerCell.find('.e-totalcard');
                if ($headerCell.find('.e-clexpand').length > 0 || columns[columnCount]["isCollapsed"]) {
                    if (curTotal.length == 0 && curLimits.length == 0)
                        $headerCell.addClass('e-toggleonly');
                    else if (curTotal.length == 0 && curLimits.children().length == 0)
                        $headerCell.addClass('e-toggleonly');
                }
                var curColumn;
                if ($headerCell.hasClass('e-toggleonly')) {
                    for (var l = 0; l < this.model.columns.length; l++) {
                        curColumn = this.model.columns[l];
                        if (!ej.isNullOrUndefined(curColumn.constraints) && (!ej.isNullOrUndefined(curColumn.constraints['min']) || !ej.isNullOrUndefined(curColumn.constraints['max'])))
                            $headerCell.addClass('e-toggle-withoutcount');
                    }
                }
                curColumn = this.model.columns[columnCount];
                if (this.model.enableTotalCount || (!ej.isNullOrUndefined(curColumn.constraints) && (!ej.isNullOrUndefined(curColumn.constraints['min']) || !ej.isNullOrUndefined(curColumn.constraints['max'])))) {
                    $headerCell.addClass('e-toggle-withcount');
                    $columnHeader.addClass('e-header-withcount');
                }
                if (ej.isNullOrUndefined(column["allowDrag"]) || column["allowDrag"] != false)
                    column["allowDrag"] = true;
                if (ej.isNullOrUndefined(column["allowDrop"]) || column["allowDrop"] != false)
                    column["allowDrop"] = true;
                if (!ej.isNullOrUndefined(column["headerTemplate"]))
                    $headerCellDiv.parent().addClass("e-headertemplate");
                if (this.initialRender) {
                    if (typeof (column.width) == "string" && column.width.indexOf("%") != -1)
                        this._columnsWidthCollection.push(parseInt(column["width"]) / 100 * this.element.width());
                    else {
                        this._columnsWidthCollection.push(column["width"]);
                    }
                }
            }
            $thead.append($columnHeader);
            $table.append($colGroup).append($thead);
            $tbody.append($rowBody);
            $table.append($tbody);
            $innerDiv.append($table);
            this.setHeaderContent($div);
            this.setHeaderTable($table);
            return $div;
        };
        Kanban.prototype._renderContent = function () {
            var $div = ej.buildTag('div.e-kanbancontent', "", {}, {}), $innderDiv = ej.buildTag('div', "", {}, {}), $tbody = ej.buildTag("tbody", "", {}, {});
            var $table = ej.buildTag('table.e-table', "", {}, { "data-role": "kanban" });
            $table.append(this.getHeaderTable().find('colgroup').clone()).append($tbody);
            $innderDiv.append($table);
            $div.append($innderDiv);
            this.setContent($div);
            this.setContentTable($table);
            $table.attr("data-role", "kanban");
            var args = { requestType: "refresh" };
            this.sendDataRenderingRequest(args);
            return $div;
        };
        Kanban.prototype.refreshTemplate = function () {
            this._addInitTemplate();
            if (this.model.editSettings.allowEditing || this.model.editSettings.allowAdding)
                this.KanbanEdit._addDialogEditingTemplate();
        };
        Kanban.prototype.getContentTable = function () {
            return this.contentTable;
        };
        Kanban.prototype.setContentTable = function (value) {
            this.contentTable = value;
        };
        Kanban.prototype.getVisibleColumnNames = function () {
            return this._visibleColumns;
        };
        Kanban.prototype.getHeaderContent = function () {
            return this.headerContent;
        };
        Kanban.prototype.setHeaderContent = function (value) {
            this.headerContent = value;
        };
        Kanban.prototype.getContent = function () {
            return this.kanbanContent;
        };
        Kanban.prototype.setContent = function (value) {
            this.kanbanContent = value;
        };
        Kanban.prototype._initDataSource = function () {
            var proxy = this;
            this._isLocalData = (!(this._dataSource() instanceof ej.DataManager) || (this._dataSource().dataSource.offline));
            this._ensureDataSource();
            this._trigger("actionBegin");
            var queryPromise = this._dataSource().executeQuery(this.model.query);
            if (!this.element.is(":visible"))
                this.element.ejWaitingPopup("hide");
            queryPromise.done(ej.proxy(function (e) {
                proxy.element.ejWaitingPopup("hide");
                proxy._currentJsonData = proxy.currentViewData = e.result;
                if (e.count == 0 && e.result.length)
                    proxy._recordsCount = e.result.length;
                else
                    proxy._recordsCount = e.count;
                proxy._initKanbanRender();
            }));
        };
        Kanban.prototype.columns = function (details, keyValue, action) {
            if (ej.isNullOrUndefined(details))
                return;
            var isString = false;
            if (typeof details === "string") {
                details = [details];
                isString = true;
            }
            else if (details instanceof Array && details.length && typeof details[0] === "string")
                isString = true;
            for (var i = 0; i < details.length; i++) {
                var index = $.inArray(this.getColumnByHeaderText(isString ? details[i] : details[i]["headerText"]), this.model.columns);
                if (action == "add" || ej.isNullOrUndefined(action)) {
                    if (index == -1) {
                        this.model.columns.push(isString ? { headerText: details[i], key: keyValue } : details[i]);
                        this._initialKanbanModel.columns.push(isString ? { headerText: details[i], key: keyValue } : details[i]);
                    }
                    else {
                        this.model.columns[index] = isString ? { headerText: details[i], key: keyValue } : details[i];
                        this._initialKanbanModel.columns[index] = isString ? { headerText: details[i], key: keyValue } : details[i];
                    }
                }
                else {
                    if (index != -1) {
                        this.model.columns.splice(index, 1);
                        this._initialKanbanModel.columns.splice(index, 1);
                    }
                }
            }
            var $header = this.element.find(".e-kanbanheader");
            this._columnsWidthCollection = [];
            for (var columnCount = 0; columnCount < this.model.columns.length; columnCount++)
                if (!ej.isNullOrUndefined(this.model.columns[columnCount]["width"])) {
                    this._columnsWidthCollection.push(this.model.columns[columnCount]["width"]);
                }
            if ($header.length == 0 && this.model.columns.length != 0)
                this._checkDataBinding();
            else if ($header.length != 0 && this.model.columns.length != 0) {
                this.element[0].replaceChild(this._renderHeader()[0], $header[0]);
                if (isString) {
                    this._keyValue.push(keyValue);
                    this.keyPredicates.push(new ej.Predicate(this.model.keyField, ej.FilterOperators.equal, keyValue, true));
                }
                else
                    this._addColumnFilters();
                if (this.model.searchSettings.key.length == 0 && this._filterCollection.length == 0) {
                    queryManagar = this.model.query;
                    queryManagar.queries = [];
                    queryManagar.where(ej.Predicate["or"](this.keyPredicates));
                }
                var args = { requestType: 'addcolumn' };
                this.refresh(true);
                this.KanbanCommon._totalCount();
            }
            else if (this.model.columns.length == 0) {
                this.model.query.queries = [];
                this.element.children().remove();
            }
        };
        Kanban.prototype._checkDataBinding = function () {
            if (!this.model.columns.length && (((this._dataSource() == null || !this._dataSource().length) && !(this._dataSource() instanceof ej.DataManager)) || ((this._dataSource() instanceof ej.DataManager) && this._dataManager.dataSource.url == undefined && !this._dataSource().dataSource.json.length))) {
                return;
            }
            if (!ej.isNullOrUndefined(this.model.keyField))
                this._addColumnFilters();
            this.initialRender = true;
            if (this.model.cssClass != null)
                this.element.addClass(this.model.cssClass);
            if (this.model.filterSettings.length > 0 || this.model.allowSearching || this.model.customToolbarItems.length > 0 || this.model.allowPrinting)
                this.element.append(this._renderToolBar());
            var columns = this.model.columns;
            if (columns && columns.length) {
                this.element.append(this._renderHeader());
                this.KanbanCommon._stackedHeadervisible();
            }
            if ($.isFunction($.fn.ejWaitingPopup)) {
                this.element.ejWaitingPopup({ showOnInit: false });
                $("#" + this._id + "_WaitingPopup").addClass("e-kanbanwaitingpopup");
            }
            if (this._dataSource() instanceof ej.DataManager) {
                this.element.ejWaitingPopup("show");
                if (this._dataSource().ready != undefined) {
                    var proxy = this;
                    this._dataSource().ready.done(function (args) {
                        proxy._initDataSource();
                        proxy.model.dataSource = new ej.DataManager(args.result);
                    });
                }
                else {
                    this.element.ejWaitingPopup("show");
                    this._initDataSource();
                }
            }
            else {
                this._trigger("actionBegin");
                this._ensureDataSource();
                this._initKanbanRender();
                this.KanbanCommon._enableKanbanRTL();
            }
        };
        Kanban.prototype._renderToolBar = function () {
            var $div = ej.buildTag('div.e-kanbantoolbar', "", {}, { id: this._id + "_toolbarItems" });
            if (this.model.allowSearching) {
                this._isWatermark = 'placeholder' in document.createElement('input');
                var $searchUl = ej.buildTag("ul.e-searchbar", "", {}, {});
                var $li = ej.buildTag("li.e-search", "", {}, { id: this._id + "_toolbarItems_search" });
                var $a = ej.buildTag("a.e-searchitem e-toolbaricons e-disabletool e-icon e-searchfind", "", { 'float': 'right' }, {});
                if (ej.browserInfo().name == "msie")
                    $a.css("position", "absolute");
                var $input = ej.buildTag("input.e-ejinputtext e-input", "", {}, { type: "text", id: this._id + "_searchbar", placeholder: this.localizedLabels.Search });
                var $searchDiv = ej.buildTag('div.e-searchdiv', "", { 'display': 'inline-table', 'width': '83%' }, {});
                $searchDiv.append($input);
                $li.append($searchDiv);
                $li.append($a);
                $searchUl.append($li);
                this._searchInput = $input;
                if (!ej.isNullOrUndefined(this.model.searchSettings.key))
                    this._searchInput.val(this.model.searchSettings.key);
                this._searchBar = $li;
                if (!this._isWatermark)
                    this._hiddenSpan = ej.buildTag("span.e-input e-placeholder", "Search", { display: "block" }, {}).insertAfter(this._searchInput);
            }
            if (!ej.isNullOrUndefined(this.model.customToolbarItems)) {
                var $customUl = ej.buildTag("ul.e-customtoolbar");
                if (this.model.filterSettings.length > 0) {
                    $customUl.addClass("e-customtoolbarseparator");
                }
                (!ej.isNullOrUndefined(this.model.customToolbarItems) && this.model.customToolbarItems.length) && this._renderCustomLi($customUl);
                $div.append($customUl);
            }
            if (this.model.filterSettings.length > 0) {
                var $filterUl = ej.buildTag("ul", "", {}, {});
                var li = ej.buildTag("li", "", {}, { "class": "e-quickfilter", "tabindex": "0" });
                li.append("<label class='e-toolbartext e-text'>" + this.localizedLabels.FilterSettings + "</label>");
                $filterUl.append(li);
            }
            for (var i = 0; i < this.model.filterSettings.length; i++) {
                var desc = this.model.filterSettings[i].description;
                var $li = ej.buildTag("li", "", {}, { id: this._id + "_" + this.model.filterSettings[i].text.replace(/[-\s']/g, '_'), title: ej.isNullOrUndefined(desc) ? this.model.filterSettings[i].text : desc, "tabindex": "0", "class": "e-kbnfilter-tbtn" });
                var $item = ej.buildTag("a.e-toolbartext e-text", this.model.filterSettings[i].text, {}, {});
                $li.append($item);
                $filterUl.append($li);
            }
            if (this.model.allowPrinting) {
                var $printUl = ej.buildTag("ul.e-print", "", {}, {});
                var li = ej.buildTag("li", "", {}, { "class": "e-printlist", title: "Print", "tabindex": "0" });
                var $item = ej.buildTag("a.e-printicon e-icon", "", {});
                li.append($item);
                $printUl.append(li);
            }
            if (!ej.isNullOrUndefined($filterUl))
                $div.append($filterUl);
            if (!ej.isNullOrUndefined($printUl))
                $div.append($printUl);
            if (!ej.isNullOrUndefined($searchUl))
                $div.append($searchUl);
            var model = { click: this._onToolbarClick };
            $div.ejToolbar(model);
            this._filterToolBar = $div;
            return $div;
        };
        Kanban.prototype._renderCustomLi = function ($ul) {
            var $li, cusTb, $item;
            for (var i = 0; i < this.model.customToolbarItems.length; i++) {
                cusTb = this.model.customToolbarItems[i]["template"] ? this.model.customToolbarItems[i].template.replace("#", "") : this.model.customToolbarItems[i];
                $li = ej.buildTag("li", "", {}, { id: this._id + "_" + cusTb, title: cusTb });
                switch (typeof this.model.customToolbarItems[i]) {
                    case "string":
                        $item = ej.buildTag("a.e-toolbaricons e-icon", "", {}).addClass(this.model.customToolbarItems[i].text);
                        break;
                    case "object":
                        $li.attr("title", this.model.customToolbarItems[i].template.replace("#", ""));
                        $item = $(this.model.customToolbarItems[i].template).hide().html();
                        break;
                }
                $li.html($item);
                $ul.append($li);
            }
        };
        Kanban.prototype.dataSource = function (dataSource, templateRefresh) {
            if (templateRefresh)
                this._templateRefresh = true;
            this._dataSource(dataSource);
            this.KanbanCommon._refreshDataSource(dataSource);
            if (this.model.enableTotalCount)
                this.KanbanCommon._totalCount();
            this.KanbanCommon._addLastRow();
        };
        Kanban.prototype._ensureDataSource = function (args) {
            if (this._dataSource() == null && !(this._dataSource() instanceof ej.DataManager)) {
                if (!ej.isNullOrUndefined(args) && args.requestType == "add")
                    this.dataSource([], false);
                else
                    return;
            }
            this.model.query.requiresCount();
            var queryManagar = this.model.query, cloned = queryManagar.clone(), predicate;
            if (!(this._dataSource() instanceof ej.DataManager))
                this._currentJsonData = this.currentViewData = this._dataSource();
            if (((this.model.filterSettings.length || this.model.allowFiltering) && !ej.isNullOrUndefined(args) && args.requestType == "filtering") || (!ej.isNullOrUndefined(args) && args.requestType == "search" || this.model.searchSettings.key.length)) {
                queryManagar["queries"] = queryManagar["queries"].slice(queryManagar["queries"].length);
                if (this.model.allowSearching) {
                    var $searchIcon = this._searchBar.find(".e-toolbaricons");
                    if (this.model.searchSettings.key.length != 0) {
                        var searchDetails = this.model.searchSettings;
                        $searchIcon.removeClass("e-searchfind").addClass("e-cancel");
                        if (searchDetails.fields.length == 0) {
                            if (!ej.isNullOrUndefined(this.model.fields.content))
                                searchDetails.fields.push(this.model.fields.content);
                            if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey))
                                searchDetails.fields.push(this.model.fields.swimlaneKey);
                            if (!ej.isNullOrUndefined(this.model.fields.primaryKey))
                                searchDetails.fields.push(this.model.fields.primaryKey);
                            if (!ej.isNullOrUndefined(this.model.fields.title))
                                searchDetails.fields.push(this.model.fields.title);
                            if (!ej.isNullOrUndefined(this.model.fields.tag))
                                searchDetails.fields.push(this.model.fields.tag);
                            if (!ej.isNullOrUndefined(this.model.fields.imageUrl))
                                searchDetails.fields.push(this.model.fields.imageUrl);
                            if (!ej.isNullOrUndefined(this.model.fields.priority))
                                searchDetails.fields.push(this.model.fields.priority);
                            if (!ej.isNullOrUndefined(this.model.fields.color))
                                searchDetails.fields.push(this.model.fields.color);
                        }
                        queryManagar.search(searchDetails.key, searchDetails.fields, searchDetails.operator || "contains", searchDetails.ignoreCase);
                    }
                    else
                        $searchIcon.removeClass("e-cancel").addClass("e-searchfind");
                }
                if (this.element.hasClass('e-responsive'))
                    this._filterCollection = this._kbnFilterCollection.slice();
                for (var i = 0; i < this._filterCollection.length; i++)
                    predicate = predicate != undefined ? predicate["and"](this._filterCollection[i]) : this._filterCollection[i];
                if (this._keyFiltering) {
                    queryManagar.where(ej.Predicate["or"](this.keyPredicates));
                    for (var i = 0; i < queryManagar["queries"].length; i++) {
                        if (queryManagar["queries"][i].fn == "onWhere") {
                            predicate && (queryManagar["queries"][i].e = queryManagar["queries"][i].e.and(predicate));
                        }
                    }
                }
                else if (this._filterCollection.length)
                    queryManagar.where(predicate);
                if (this._isLocalData) {
                    this._filteredRecords = this._dataManager.executeLocal(queryManagar).result;
                    this._filteredRecordsCount = this._filteredRecords.length;
                }
                if (this._isLocalData && this.model.filterSettings.length == 0) {
                    if (!ej.isNullOrUndefined(this._filteredRecordsCount) || this._filteredRecordsCount > 0) {
                        this._filteredRecordsCount = null;
                        this._filteredRecords = [];
                    }
                }
            }
            if (this._isLocalData && (this.model.editSettings.allowEditing || this.model.editSettings.allowAdding) && (!ej.isNullOrUndefined(this._cModifiedData) || !ej.isNullOrUndefined(this._cAddedRecord)))
                queryManagar["queries"] = cloned["queries"];
            if (args && args.requestType == "delete" && !ej.isNullOrUndefined(this._cDeleteData) && this._isLocalData) {
                var index;
                if (!(this._dataSource() instanceof ej.DataManager)) {
                    index = $.inArray(this._cDeleteData[0], this._dataSource());
                    this._dataSource(undefined, true).splice(index, 1);
                }
                else {
                    index = $.inArray(this._cDeleteData[0], this._dataSource().dataSource.json);
                    this._dataSource().dataSource.json.splice(index, 1);
                }
            }
            this._cloneQuery = queryManagar.clone();
            if (this._isLocalData) {
                var qManagar;
                if (!ej.isNullOrUndefined(args) && args.requestType == "refresh" && this._filterCollection.length <= 0 && (ej.isNullOrUndefined(this._searchInput) || this._searchInput.val().length <= 0)) {
                    var cloned = queryManagar.clone();
                    cloned["queries"] = [];
                    cloned.where(ej.Predicate["or"](this.keyPredicates));
                    qManagar = cloned;
                }
                else
                    qManagar = queryManagar;
                var dataMgrJson = this._dataManager.dataSource.json;
                var dataSource = this._dataSource().dataSource;
                if (!ej.isNullOrUndefined(dataSource) && this._dataSource() instanceof ej.DataManager)
                    this._dataManager.dataSource.json = dataMgrJson != dataSource.json ? dataSource.json : dataMgrJson;
                var result = this._dataManager.executeLocal(qManagar);
                this.currentViewData = this._currentJsonData = result.result;
                this._recordsCount = result.count;
            }
        };
        Kanban.prototype._addColumnFilters = function () {
            var colms = this.model.columns, predicates = [], fPred;
            var qManager = this.model.query;
            for (var i = 0; i < colms.length; i++) {
                var key = colms[i].key;
                if (!ej.isNullOrUndefined(key))
                    key = typeof (key) == "object" ? key : key.split(",");
                for (var j = 0; j < key.length; j++) {
                    predicates.push(new ej.Predicate(this.model.keyField, ej.FilterOperators.equal, key[j], false));
                    this._keyValue.push(key[j]);
                }
            }
            if (this._keyFiltering)
                predicates.length > 0 && (qManager.where(ej.Predicate["or"](predicates)));
            this.keyPredicates = predicates;
        };
        Kanban.prototype.refresh = function (refreshTemplate) {
            refreshTemplate && this.refreshTemplate();
            var args = { requestType: "refresh" };
            this.KanbanCommon._processBindings(args);
        };
        Kanban.prototype.sendDataRenderingRequest = function (args) {
            if (this._templateRefresh) {
                this.refreshTemplate();
                this._templateRefresh = false;
            }
            var queryManagar = this.model.query, cloned = queryManagar.clone();
            if (this.currentViewData != null && (this.currentViewData.length || this.model.showColumnWhenEmpty)) {
                switch (args.requestType) {
                    case "save":
                    case "drop":
                    case "delete":
                    case "refresh":
                    case "search":
                    case "filtering":
                        if (this.element.hasClass('e-responsive') && !ej.isNullOrUndefined(args.currentFilterObject))
                            this._kbnAdaptFilterObject = args.currentFilterObject.slice();
                    case "cancel":
                        if (this.element.find('.e-kbnadapt-editdlg').length == 0 && this.element.hasClass('e-responsive') && (this.model.editSettings.allowAdding || this.model.editSettings.allowEditing))
                            $("#" + this._id + "_dialogEdit_wrapper").appendTo(this.element);
                        this.getContentTable().find("colgroup").first().replaceWith(this.KanbanCommon._getMetaColGroup());
                        if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey)) {
                            var proxy = this, swimlaneKey = this.model.fields.swimlaneKey, unassignedGroup = this.model.swimlaneSettings.unassignedGroup;
                            queryManagar = queryManagar.group(swimlaneKey);
                            if (!this.currentViewData.GROUPGUID) {
                                if (unassignedGroup.enable && unassignedGroup.keys.length > 0) {
                                    $.map(proxy.currentViewData, function (obj, index) {
                                        proxy.currentViewData[index] = proxy._checkKbnUnassigned(obj);
                                    });
                                }
                                if (!this.currentViewData.GROUPGUID)
                                    this.currentViewData = new ej.DataManager(this.currentViewData).executeLocal(queryManagar)["result"];
                            }
                        }
                        this._renderAllCard();
                        if (!this._keyFiltering && !ej.isNullOrUndefined(this.model.fields.swimlaneKey) && this.model.swimlaneSettings.showCount)
                            this._getSwimlaneCount();
                        if (this.element.hasClass('e-responsive')) {
                            if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey)) {
                                this.element.find('.e-swimlanerow').hide();
                                if (this.KanbanAdaptive)
                                    this.KanbanAdaptive._addSwimlaneName();
                            }
                        }
                        this._enableSwimlaneCount = true;
                        this._eventBindings();
                        this._enableDragandScroll();
                        break;
                    case "beginedit":
                    case "add":
                        if (this.KanbanEdit) {
                            this.KanbanEdit._editAdd(args);
                            this._enableSwimlaneCount = false;
                        }
                        break;
                }
                queryManagar["queries"] = cloned["queries"];
            }
            else {
                this.getContentTable().find('tbody').empty().first().append(this.KanbanCommon._getEmptyTbody());
            }
            if (this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate") {
                this._editForm = this.element.find(".e-externalform");
                this.KanbanEdit._formFocus();
            }
            if ("beginedit" == args.requestType || "add" == args.requestType)
                (this.model.editSettings.editMode == "dialog" || this.model.editSettings.editMode == "externalform") && this.KanbanEdit._refreshEditForm(args);
            this._renderComplete(args);
            if (this.KanbanSwimlane && this._enableSwimlaneCount) {
                this.KanbanSwimlane._swimlaneLimit();
                this._swimlaneRows = this.element.find('.e-swimlanerow');
            }
            this.KanbanCommon._renderLimit();
            if (this._filterCollection.length == 0 && this.model.searchSettings.key.length == 0)
                this.KanbanCommon._totalCount();
            if (this._filterCollection.length > 0 || this.model.searchSettings.key.length > 0)
                this.KanbanFilter._filterLimitCard(args);
            this._newData = null;
            if (this.element.hasClass('e-responsive')) {
                this.kanbanWindowResize();
                if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey))
                    this.KanbanAdaptive._setAdaptiveSwimlaneTop();
            }
        };
        Kanban.prototype._checkKbnUnassigned = function (obj) {
            var unassignedGroup = this.model.swimlaneSettings.unassignedGroup, type = obj[this.model.fields.swimlaneKey], swimlaneKey = this.model.fields.swimlaneKey;
            for (var i = 0; i < unassignedGroup.keys.length; i++) {
                if (typeof unassignedGroup.keys[i] == "string") {
                    if (unassignedGroup.keys[i].replace(/^\s+|\s+$/g, '') == "" && $.inArray("", unassignedGroup.keys) >= 0 && i < $.inArray("", unassignedGroup.keys))
                        unassignedGroup.keys.splice(i, 1);
                    else if (unassignedGroup.keys[i].replace(/^\s+|\s+$/g, '') == "")
                        unassignedGroup.keys[i] = unassignedGroup.keys[i].replace(/^\s+|\s+$/g, '');
                }
            }
            if (type != undefined && type != null && typeof type == "string")
                type = type.replace(/^\s+|\s+$/g, '');
            if (type == null || type == undefined) {
                for (var i = 0; i < unassignedGroup.keys.length; i++) {
                    if ((typeof unassignedGroup.keys[i] == "string") && (unassignedGroup.keys[i].toLowerCase() == "null" || unassignedGroup.keys[i].toLowerCase() == "undefined"))
                        obj[swimlaneKey] = this.localizedLabels.Unassigned;
                    else if (unassignedGroup.keys[i] == null || unassignedGroup.keys[i] == undefined)
                        obj[swimlaneKey] = this.localizedLabels.Unassigned;
                }
            }
            else {
                for (var i = 0; i < unassignedGroup.keys.length; i++) {
                    var key = unassignedGroup.keys[i];
                    if (typeof type == "number" && key.startsWith("'") && key.endsWith("'"))
                        key = key.split("'")[1];
                    if (key == type)
                        obj[swimlaneKey] = this.localizedLabels.Unassigned;
                }
            }
            return obj;
        };
        Kanban.prototype._renderAllCard = function () {
            var temp = document.createElement('div');
            temp.innerHTML = ['<table>', $.render[this._id + "_JSONTemplate"]({ columns: this.model.columns, dataSource: this.currentViewData }), '</table>'].join("");
            if (!ej.isNullOrUndefined(temp.firstChild) && !ej.isNullOrUndefined(temp.firstChild.lastChild))
                this.getContentTable().get(0).replaceChild(temp.firstChild.lastChild, this.getContentTable().get(0).lastChild);
            if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey))
                this._swimlaneRows = this.element.find('.e-swimlanerow');
            this._cardCollapse();
            this._swimlaneCollapse();
            if (this.KanbanSelection)
                this.KanbanSelection._selectionOnRerender();
        };
        Kanban.prototype._editEventTrigger = function (args) {
            if (args.requestType == "save" || args.requestType == "delete") {
                var params = {
                    data: args.data,
                    action: args.action !== undefined ? args.action : args.requestType,
                };
                this._trigger("end" + params.action.charAt(0).toUpperCase() + params.action.slice(1), params);
            }
        };
        Kanban.prototype._renderComplete = function (args) {
            if (args.requestType != 'beginedit' && !this.initialRender)
                this.KanbanCommon._setWidthToColumns();
            if (args.requestType == "save" || args.requestType == "cancel") {
                this._isAddNew = false;
                this._isEdit = false;
            }
            if (args.requestType == 'beginedit')
                this._isEdit = true;
            if ("delete" == args.requestType || "save" == args.requestType)
                this._editEventTrigger(args);
            this._tableBEle = this.getContentTable().get(0);
            this._kanbanRows = this._tableBEle.rows;
            this._columnRows = $(this._kanbanRows).not(".e-swimlanerow");
            if (this.model.allowScrolling && !this.initialRender)
                this.getContentTable().find("tr:last").find("td").addClass("e-lastrowcell");
            this._trigger("actionComplete", args);
            if (!this.initialRender && this.model.allowScrolling && (args.requestType == "add" || args.requestType == "cancel" || args.requestType == "save" || args.requestType == "delete" || args.requestType == "filtering" || args.requestType == "search" || args.requestType == "refresh" || args.requestType == "drop"))
                this.KanbanScroll._refreshScroller(args);
            if (this.model.allowDragAndDrop && this.KanbanDragAndDrop)
                this.KanbanDragAndDrop._addDragableClass();
        };
        Kanban.prototype._createTemplate = function (elt, templateId) {
            var scriptElt = document.createElement("script");
            scriptElt.id = (this._id + templateId + "_Template");
            var $script = this.element.parents("body").find("#" + scriptElt.id);
            scriptElt.type = "text/x-jsrender";
            scriptElt.text = elt;
            if ($script)
                $script.remove();
            $("body").append(scriptElt);
            return scriptElt;
        };
        Kanban.prototype._addInitTemplate = function () {
            var proxy = this, helpers = {}, isKey = !ej.isNullOrUndefined(proxy.model.keyField), isIe8 = ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version, 10) == 8, toggle = this.model.allowToggleColumn, isSwimlane = !ej.isNullOrUndefined(proxy.model.fields.swimlaneKey), istoggleKey = !ej.isNullOrUndefined(proxy.model.fields.collapsibleCards), isEmptyDataSource = !ej.isNullOrUndefined(proxy.model.showColumnWhenEmpty);
            this._slTemplate = "";
            helpers[proxy._id + "Object"] = this;
            helpers["_" + proxy._id + "columnKeys"] = this._getColumnKeyItems;
            helpers["_" + proxy._id + "tagItems"] = this._gettagItems;
            helpers["_" + proxy._id + "colorMaps"] = this._getColorMaps;
            helpers["_" + proxy._id + "getId"] = this.KanbanCommon._removeIdSymbols;
            helpers["_" + proxy._id + "getData"] = this._columnData;
            helpers["_" + proxy._id + "getCardCount"] = this._columnCardcount;
            helpers["_" + proxy._id + "getStatus"] = this._columnStatus;
            helpers["_" + proxy._id + "getKey"] = this._columnKey;
            $.views.helpers(helpers);
            if (isSwimlane && (!isEmptyDataSource || proxy.currentViewData.length != 0)) {
                this._slTemplate += "{{for dataSource ~columns=columns ~ds=dataSource}}";
                this._slTemplate += "<tr id='{{: ~_" + proxy._id + "getId(key)}}' class='e-swimlanerow' data-role='kanbanrow'>" +
                    "<td class='e-rowcell' data-role='kanbancell'  colspan='" + (proxy.getVisibleColumnNames().length) + "'>" +
                    "<div class='e-slexpandcollapse'><div class='e-icon e-slexpand'></div></div>" +
                    "<div class='e-slkey'>{{:key}}</div>" +
                    "{{if " + this.model.swimlaneSettings.showCount + "}}" +
                    "<div class='e-slcount'>" + proxy.localizedLabels.SwimlaneCaptionFormat + "</div>" +
                    "{{/if}}" +
                    "</td>" +
                    "</tr>";
            }
            this._slTemplate += "<tr class='e-columnrow' data-role='kanbanrow'>";
            if (isSwimlane && (!isEmptyDataSource || proxy.currentViewData.length != 0))
                this._slTemplate += "{{for ~columns ~items=#data.items}}";
            else
                this._slTemplate += "{{for columns}}";
            this._slTemplate += "<td data-ej-mappingkey='{{:key}}' class='e-rowcell " + "{{if !#data.visible}}  e-hide {{/if}}" + "{{if #data.allowDrag}}  e-drag {{/if}}" + "{{if #data.allowDrop}}  e-drop {{/if}}" + "{{if (#data.isCollapsed && " + toggle + ")}} e-shrink{{/if}}" + "{{if (#data.key && " + istoggleKey + ")}} e-toggle{{/if}}" + "'data-role='kanbancell'>" +
                "{{if " + isKey + "}}" +
                "{{for ~_" + proxy._id + "columnKeys('" + proxy._id + "Object')}}";
            this._slTemplate += this._cardCustomization() +
                "{{/for}}" +
                "{{/if}}" +
                "{{if " + istoggleKey + "}}" +
                "{{if ~_" + proxy._id + "getKey(#parent.parent.data,'" + proxy._id + "Object')}}" +
                "<div class = 'e-toggle-area" +
                "{{if " + istoggleKey + " && #data.isCollapsed}}  e-hide {{/if}}" + "'>" +
                "<div class = 'e-toggle-header'>" +
                "<div class='e-toggle-icon'><div class='e-icon e-toggle-expand'></div></div>" +
                "<div class='e-toggle-key'>" + proxy.localizedLabels.Show + "</div>" +
                "<div class='e-toggle-count'>" +
                "{{:~_" + proxy._id + "columnKeys('" + proxy._id + "Object'," + istoggleKey + ",true,false)}}" +
                "</div>" +
                "</div>" +
                "<div class = 'e-toggle-cards e-hide'>" +
                "{{for ~_" + proxy._id + "columnKeys('" + proxy._id + "Object'," + istoggleKey + ",false,false)}}" +
                "<div class='e-togglekey'>" +
                "{{if  ~_" + proxy._id + "getKey(#data,'" + proxy._id + "Object')}}" +
                "{{:#data}}{{/if}}" +
                "{{for ~_" + proxy._id + "columnKeys('" + proxy._id + "Object'," + istoggleKey + ",true,true)}}" +
                this._cardCustomization() +
                "{{/for}}" +
                "</div>" +
                "{{/for}}" +
                "</div>" +
                "</div>" +
                "{{/if}}" +
                "{{/if}}" +
                "{{if " + this.model.allowToggleColumn + "}}" +
                "<div class='e-shrinkheader" +
                "{{if " + isIe8 + "}} IE{{/if}}" +
                "{{if !#data.isCollapsed}}  e-hide {{/if}}" + "'>" +
                "{{:headerText}}<div class='e-shrinklabel'>[<div class='e-shrinkcount'>" +
                "{{:~_" + proxy._id + "getCardCount(" + "~root.dataSource" + ",key,#parent.parent.getIndex(),'" + proxy._id + "Object') }}" +
                "</div>]</div></div>" +
                "{{/if}}" +
                "{{if " + this.model.editSettings.allowAdding + "}}" +
                "{{if #data.showAddButton}} " +
                "<div class='e-customaddbutton" +
                "{{if #data.isCollapsed}}  e-hide {{/if}}" + "'>" +
                "<div class='e-columnadd e-icon'>" +
                "</div>" +
                "</div>" +
                "{{/if}}" +
                "{{/if}}" +
                "</td>{{/for}}</tr>";
            if (isSwimlane && (!isEmptyDataSource || proxy.currentViewData.length != 0))
                this._slTemplate += "{{/for}}";
            this.templates[this._id + "_JSONTemplate"] = $.templates(this._createTemplate(this._slTemplate, "_swinlaneContent"));
            this.templates[this._id + "_cardTemplate"] = $.templates(this._createTemplate(this._cardTemplate, "_cardTemplate"));
            $.templates(this.templates);
        };
        Kanban.prototype._cardCustomization = function () {
            var proxy = this, toggle = this.model.allowToggleColumn, userAppTemplId = (this.model.cardSettings.template) ? true : false, userImage = (this.model.fields.imageUrl) ? true : false, cardSets = this.model.fields, isTitle = !ej.isNullOrUndefined(cardSets.title), titleFld = cardSets.title ? cardSets.title : (cardSets.primaryKey ? cardSets.primaryKey : null), innerDiv = (!ej.isNullOrUndefined(cardSets.tag) || !ej.isNullOrUndefined(cardSets.content));
            if (!userImage)
                this.element.addClass('e-onlycontent');
            this._cardTemplate =
                "<div id='{{:" + proxy.model.fields.primaryKey + "}}' class='e-kanbancard " + "{{if ~_" + proxy._id + "getData(" + "#parent" + ")  && " + toggle + " }}e-hide{{/if}} " + "{{if " + userAppTemplId + "}}e-templatecell{{/if}}'>" +
                    "{{if " + userAppTemplId + "}}" +
                    $(proxy.model.cardSettings.template).html() +
                    "{{else}}" +
                    "{{if " + proxy.model.allowTitle + "}}" +
                    "<div class='e-cardheader'>" +
                    "<div class='e-primarykey'>" +
                    "{{:" + titleFld + "}}" +
                    "</div>" +
                    "<div class='e-expandcollapse'><div class='e-icon e-cardexpand'></div></div>" +
                    "</div>" +
                    "{{/if}}" +
                    "<div class='e-cardcontent'>" +
                    "<table class='e-cardtable'><tbody><tr>" +
                    "<td class='e-contentcell'>" +
                    "{{if " + innerDiv + "}}" +
                    "<div class='e-text'>{{:" + cardSets.content + "}}</div>" +
                    "</td>" +
                    "{{if " + !userImage + " }} " +
                    "<td></td>" +
                    "{{/if}}" +
                    "{{if " + userImage + " }} " +
                    "<td class='e-imagecell'>" +
                    "<div class='e-card_image'>" +
                    "{{if " + cardSets.imageUrl + "}}" +
                    "<img class='e-image' src='{{:" + cardSets.imageUrl + "}}' alt=''></img>" +
                    "{{else}}" +
                    "<div class='e-image e-no-user'></div>" +
                    "{{/if}}</div></td>" +
                    "{{/if}}" +
                    "</tr>" +
                    "<tr>" +
                    "<td>" +
                    "{{if " + cardSets.tag + "}}" +
                    "{{for ~_" + proxy._id + "tagItems(" + cardSets.tag + ")}}" +
                    "{{:#data}}" +
                    "{{/for}}" +
                    "{{/if}}" +
                    "</div>" +
                    "{{/if}}" +
                    "</td>" +
                    "<td class='e-trainglecell'>" +
                    "<div class='e-bottom-triangle'" +
                    "{{if " + cardSets.color + " }} " +
                    "style='border-bottom-color" +
                    ":{{for  ~_" + proxy._id + "colorMaps('" + proxy._id + "Object'," + cardSets.color + ")}}" +
                    "{{:#data}}{{/for}}'" +
                    "{{/if}}></div>" +
                    "</td>" +
                    "</tr>" +
                    "</tbody></table>" +
                    "</div>" +
                    "{{/if}}" +
                    "</div>";
            return this._cardTemplate;
        };
        Kanban.prototype._columnKey = function (togglekey, objectId) {
            var keyStatus = false, kanbanObject = this["getRsc"]("helpers", objectId), ds = this["ctx"].root.dataSource, showhide = kanbanObject.model.fields.collapsibleCards;
            var skey = kanbanObject.model.fields.collapsibleCards.key;
            if (typeof (togglekey) == "string") {
                if (typeof (skey) == "object")
                    skey = skey[0];
                if (!ej.isNullOrUndefined(skey)) {
                    var predicate = [], keys;
                    var queryManagar = kanbanObject.model.query;
                    var cloned = queryManagar.clone();
                    cloned.queries = [];
                    var keys = this.parent.parent.parent.parent.fkey;
                    predicate = this.parent.parent.parent.parent.key;
                    cloned = cloned.where(ej.Predicate["or"](predicate));
                    var skeys = new ej.DataManager(keys).executeLocal(cloned)["result"];
                    if (skeys.length > 0)
                        return skey;
                }
            }
            else if (!ej.isNullOrUndefined(showhide)) {
                var keys = this.parent.parent.fkey;
                if (typeof (skey) == "object")
                    skey = skey[0];
                for (var i = 0; i < keys.length; i++)
                    if (skey.indexOf(keys[i][showhide.field]) != -1)
                        keyStatus = true;
            }
            return keyStatus;
        };
        Kanban.prototype._columnStatus = function (objectId) {
            var kanbanObject = this["getRsc"]("helpers", objectId);
            var browserDetails = kanbanObject.getBrowserDetails();
            if (browserDetails.browser == "msie")
                return true;
            else
                return false;
        };
        Kanban.prototype._columnCardcount = function (id, key, index, proxy) {
            var kanbanObject = proxy;
            if (typeof proxy === "string")
                kanbanObject = this["getRsc"]("helpers", proxy);
            var co = 0;
            var j, k;
            key = typeof (key) == "object" ? key : key.split(",");
            if (ej.isNullOrUndefined(index)) {
                for (j = 0; j < id.length; j++)
                    for (k = 0; k < key.length; k++) {
                        var type = typeof (id[j][kanbanObject.model.keyField]), curKey = key[k];
                        if (type != typeof (curKey) && type == "number")
                            curKey = parseInt(curKey);
                        if (id[j][kanbanObject.model.keyField] === curKey)
                            co++;
                    }
                return co;
            }
            else {
                for (j = 0; j < id[index].items.length; j++) {
                    for (k = 0; k < key.length; k++) {
                        var type = typeof (id[index].items[j][kanbanObject.model.keyField]), curKey = key[k];
                        if (type != typeof (curKey) && type == "number")
                            curKey = parseInt(curKey);
                        if (id[index].items[j][kanbanObject.model.keyField] === curKey)
                            co++;
                    }
                }
                return co;
            }
        };
        Kanban.prototype._columnData = function (id) {
            if (ej.isNullOrUndefined(id))
                return false;
            else
                return id.parent.data.isCollapsed;
        };
        Kanban.prototype._getColorMaps = function (objectId, items) {
            var kanbanObject = this["getRsc"]("helpers", objectId), colors, colorMaps = kanbanObject.model.cardSettings.colorMapping;
            for (var val in colorMaps) {
                if (colorMaps[val].indexOf(',') == -1 && colorMaps[val] == items)
                    return val;
                else {
                    colors = colorMaps[val].split(",");
                    for (var i = 0; i < colors.length; i++) {
                        if (colors[i] == items)
                            return val;
                    }
                }
            }
        };
        Kanban.prototype._gettagItems = function (tag) {
            var tags = "<div class='e-tags'>", i;
            tag = tag.split(",");
            for (i = 0; i < tag.length; i++)
                tags = tags.concat("<div class='e-tag'>" + tag[i] + "</div>");
            return tags.concat("</div>");
        };
        Kanban.prototype._getColumnKeyItems = function (objectId, togglekey, count, cards) {
            var kanbanObject = this["getRsc"]("helpers", objectId), key, keys, ds = this["ctx"].root.dataSource, dropKey, kfield = kanbanObject.model.keyField, showhide = kanbanObject.model.fields.collapsibleCards;
            var queryManagar = kanbanObject.model.query;
            var cloned = queryManagar.clone();
            if (kanbanObject._filterCollection.length <= 0 && kanbanObject.model.allowSearching && kanbanObject._searchInput.val().length <= 0) {
                cloned.queries = [];
                cloned.where(ej.Predicate["or"](kanbanObject.keyPredicates));
            }
            else
                cloned.queries = cloned.queries.slice(0, cloned.queries.length - 1);
            if (!togglekey)
                key = typeof (this["data"].key) == "object" ? this["data"].key : this["data"].key.split(",");
            var predicate = [];
            if (togglekey) {
                if (count == false && cards == false) {
                    key = kanbanObject.model.fields.collapsibleCards.key;
                    if (typeof (key) == "object")
                        key = key[0];
                    keys = key;
                    return keys;
                }
                else if (count == true && cards == false) {
                    predicate = this.parent.parent.parent.key;
                    keys = this.parent.parent.parent.fkey;
                    cloned.queries = [];
                    cloned = cloned.where(ej.Predicate["or"](predicate));
                    var tcards = new ej.DataManager(keys).executeLocal(cloned)["result"];
                    this.parent.parent.parent.cards = tcards;
                    if (!ej.isNullOrUndefined(tcards))
                        var count = tcards.length;
                    else
                        var count = 0;
                    return count;
                }
                else if (count == true && cards == true) {
                    var fcards = this.parent.parent.parent.parent.cards;
                    return fcards;
                }
            }
            else
                for (var i = 0; i < key.length; i++)
                    predicate.push(new ej.Predicate(kfield, ej.FilterOperators.equal, key[i], true));
            cloned = cloned.where(ej.Predicate["or"](predicate));
            if (ds.GROUPGUID)
                keys = new ej.DataManager(this["ctx"].items).executeLocal(cloned)["result"];
            else if (predicate.length != 0)
                keys = new ej.DataManager(ds).executeLocal(cloned)["result"];
            dropKey = kanbanObject.model.fields.priority;
            if (dropKey)
                keys.sort(function (val1, val2) {
                    return val1[dropKey] - val2[dropKey];
                });
            if (!ej.isNullOrUndefined(showhide) && ej.isNullOrUndefined(togglekey)) {
                var predicates = [], fkey;
                cloned.queries = [];
                var sfield = kanbanObject.model.fields.collapsibleCards.field;
                if (typeof (sfield) == "object")
                    sfield = sfield[0];
                var skey = kanbanObject.model.fields.collapsibleCards.key;
                if (typeof (skey) == "object")
                    skey = skey[0];
                if (sfield != kfield || sfield == kfield) {
                    predicate = [];
                    predicate.push(new ej.Predicate(sfield, ej.FilterOperators.notEqual, skey, true));
                    predicates.push(new ej.Predicate(sfield, ej.FilterOperators.equal, skey, true));
                    cloned = cloned.where(ej.Predicate["or"](predicate));
                    var scards = new ej.DataManager(keys).executeLocal(cloned)["result"];
                    this.parent.parent.fkey = keys;
                    this.parent.parent.key = predicates;
                    return scards;
                }
            }
            return keys;
        };
        Kanban.prototype._kbnThumbStart = function (e) {
            var target = $(e.originalEvent.target);
            if ((target.hasClass("e-kanbancard") || target.parents(".e-kanbancard").hasClass("e-kanbancard")) && !ej.isDevice())
                return false;
            return true;
        };
        Kanban.prototype._enableDragandScroll = function () {
            if (this.model.allowDragAndDrop && this.KanbanDragAndDrop)
                this.KanbanDragAndDrop._addDragableClass();
            if (this.model.allowScrolling) {
                if (this.initialRender && this.element.find('.e-kanbancontent').length > 0) {
                    if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey))
                        this._swimlaneRows = this.element.find('.e-swimlanerow');
                    this.KanbanScroll._renderScroller();
                }
                else
                    this.KanbanScroll._refreshScroller({ requestType: "refresh" });
            }
        };
        Kanban.prototype._cardCollapse = function () {
            if (this._collapsedCards.length > 0)
                this.toggleCard(this._collapsedCards);
        };
        Kanban.prototype._getSwimlaneCount = function () {
            var swimRow = this.getContentTable().find('.e-swimlanerow .e-slcount');
            var data = [], proxy = this;
            $.map(proxy.currentViewData, function (obj, index) {
                data.push(obj.key);
            });
            for (var i = 0; i < swimRow.length; i++) {
                var swimkey = this.getContentTable().find('.e-swimlanerow .e-slkey').eq(i).html();
                var index = data.indexOf(swimkey);
                var object = new ej.DataManager(this.currentViewData[index].items).executeLocal(new ej.Query().where(ej.Predicate["or"](this.keyPredicates)));
                if (object.length != this.currentViewData[index].count) {
                    swimRow.eq(i).html(swimRow.eq(i).html().replace(this.currentViewData[index].count, object.length));
                    if (object.length == 1) {
                        var swimCaption = this.localizedLabels.SwimlaneCaptionFormat;
                        var index1 = swimCaption.search("{{else}}");
                        var index2 = swimCaption.search("count == 1");
                        if (index1 != -1 && index2 != -1) {
                            var localizedText = swimCaption.slice(index2 + 13, index1);
                            var curText = swimRow.eq(i).html().slice(4);
                            swimRow.eq(i).html(swimRow.eq(i).html().replace(curText, localizedText));
                        }
                    }
                }
            }
        };
        Kanban.prototype._swimlaneCollapse = function () {
            if (this._collapsedSwimlane.length > 0) {
                var $swimRow = this.element.find(".e-swimlanerow");
                for (var i = 0; i < $swimRow.length; i++) {
                    if ($.inArray($swimRow.eq(i).attr("id"), this._collapsedSwimlane) != -1)
                        this.KanbanSwimlane._toggleSwimlaneRow($($swimRow.eq(i)).find(".e-rowcell .e-slexpandcollapse"));
                }
            }
        };
        Kanban.prototype.updateCard = function (primaryKey, data) {
            this.KanbanCommon._kanbanUpdateCard(primaryKey, data);
        };
        Kanban.prototype._eventBindings = function () {
            this._kanbanRows = this.getContentTable().get(0)["rows"];
            var columnRows = $(this._kanbanRows).not(".e-swimlanerow");
            if (this._currentJsonData.length != 0 && this.model.queryCellInfo != null) {
                for (var row = 0; row < columnRows.length; row++) {
                    var trRows = columnRows[row];
                    var columns = this.model.columns;
                    for (var i = 0; i < columns.length; i++) {
                        var cell = $(trRows).find(".e-rowcell")[i];
                        this._cellEventTrigger(cell, columns[i]);
                    }
                }
            }
        };
        Kanban.prototype._cellEventTrigger = function (rowCell, curColumn) {
            var $kanbanCard = $(rowCell).find(".e-kanbancard");
            for (var i = 0; i < $kanbanCard.length; i++) {
                var cardId = $kanbanCard[i].id;
                var data = this.KanbanCommon._getKanbanCardData(this._currentJsonData, cardId);
                var args = { card: $kanbanCard[i], cell: rowCell, column: curColumn, data: data[0] };
                this._trigger("queryCellInfo", args);
            }
        };
        Kanban.prototype._getLocalizedLabels = function () {
            return ej.getLocalizedConstants(this["sfType"], this.model.locale);
        };
        return Kanban;
    }(ej.WidgetBase));
    window.ej.widget("ejKanban", "ej.Kanban", new Kanban());
})(jQuery);
ej.Kanban.Actions = {
    Filtering: "filtering",
    BeginEdit: "beginedit",
    Edit: "edit",
    Save: "save",
    Add: "add",
    Delete: "delete",
    Cancel: "cancel",
    Refresh: "refresh",
    Search: "searching",
    Print: "print"
};
ej.Kanban.EditingType = {
    String: "stringedit",
    Numeric: "numericedit",
    Dropdown: "dropdownedit",
    DatePicker: "datepicker",
    DateTimePicker: "datetimepicker",
    TextArea: "textarea",
    RTE: "rteedit",
};
ej.Kanban.EditMode = {
    Dialog: "dialog",
    DialogTemplate: "dialogtemplate",
    ExternalForm: "externalform",
    ExternalFormTemplate: "externalformtemplate",
};
ej.Kanban.FormPosition = {
    Bottom: "bottom",
    Right: "right"
};
ej.Kanban.Type = {
    Column: "column",
    Swimlane: "swimlane",
};
ej.Kanban.SelectionType = {
    Multiple: "multiple",
    Single: "single",
};
ej.Kanban.MenuItem = {
    AddCard: "Add Card",
    EditCard: "Edit Card",
    DeleteCard: "Delete Card",
    TopofRow: "Top of Row",
    BottomofRow: "Bottom of Row",
    MoveUp: "Move Up",
    MoveDown: "Move Down",
    MoveLeft: "Move Left",
    MoveRight: "Move Right",
    MovetoSwimlane: "Move to Swimlane",
    HideColumn: "Hide Column",
    VisibleColumns: "Visible Columns",
    PrintCard: "Print Card",
};
ej.Kanban.Target = {
    Header: "header",
    Content: "content",
    Card: "card",
    All: "all",
};
ej.Kanban.Locale = ej.Kanban.Locale || {};
