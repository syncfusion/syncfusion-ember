var InternalContext = (function () {
    function InternalContext(element) {
        this.kanbanObj = null;
        this.kanbanObj = element;
    }
    ;
    InternalContext.prototype._renderContext = function () {
        var kObj = this.kanbanObj, menuitems, submenu, submenuitem, data, menuItem1, item, menu, i, j, k, l, custom, custom2, ul, disableitem, customitems, subMenuItems, subul;
        menuitems = kObj.model.contextMenuSettings.menuItems;
        ul = ej.buildTag('ul', "", {}, { id: kObj._id + '_Context' });
        disableitem = kObj.model.contextMenuSettings.disableDefaultItems;
        for (var m = 0; m < menuitems.length; m++) {
            if (menuitems[m] == "" || menuitems[m] == " ")
                menuitems.splice(m, 1);
        }
        for (i = 0; i < menuitems.length; i++) {
            item = menuitems[i];
            if ($.inArray(item, disableitem) == -1)
                menu = this._items(item, "menuItem");
            ul.append(menu);
        }
        customitems = kObj.model.contextMenuSettings.customMenuItems;
        for (j = 0; j < customitems.length; j++) {
            custom = customitems[j].text;
            custom2 = this._items(custom, "custom");
            if (customitems[j].template)
                custom2.append($(customitems[j].template));
            ul.append(custom2);
        }
        subul = ej.buildTag('ul', "", {}, { id: kObj._id + '_SubContext_VisibleColumns' });
        for (i = 0; i < kObj.model.columns.length; i++) {
            item = kObj.model.columns[i].headerText;
            submenuitem = ej.buildTag('input', "", {}, { type: "checkbox", name: item });
            menu = this._items(item, "subMenuItem");
            menu.find("span").append(submenuitem);
            menu.find("span").addClass("e-checkbox e-visiblecolumns");
            subul.append(menu);
            submenuitem.ejCheckBox({
                checked: kObj.model.columns[i].visible,
            });
        }
        $(ul).find("li.e-column.e-visiblecolumn").append(subul);
        if (kObj.model.fields.swimlaneKey) {
            subul = ej.buildTag('ul', "", {}, { id: kObj._id + '_SubContext_Swimlane' });
            if (this.kanbanObj.model.swimlaneSettings.headers.length > 0) {
                data = kObj._slText;
            }
            else {
                var query = new ej.Query().select([kObj.model.fields.swimlaneKey]);
                if (kObj._dataManager.dataSource.offline)
                    data = kObj._dataManager.executeLocal(query);
                else
                    data = kObj._contextSwimlane.executeLocal(query);
                data = ej.dataUtil.mergeSort(ej.dataUtil.distinct(data));
            }
            if (data.length == 0)
                kObj.model.initiallyEmptyDataSource = true;
            for (i = 0; i < data.length; i++) {
                item = data[i];
                menu = this._items(item, "subMenuItem");
                subul.append(menu);
            }
            $(ul).find("li.e-move.e-swimlane").append(subul);
        }
        $(ul).ejMenu({
            menuType: ej.MenuType.ContextMenu,
            openOnClick: false,
            contextMenuTarget: "#" + kObj._id,
            click: $.proxy(kObj._clickevent, kObj),
            width: "auto",
            cssClass: "e-kanban-context",
            beforeOpen: $.proxy(kObj._menu, kObj),
            open: $.proxy(this._contextopen, kObj)
        });
        kObj._conmenu = ul.data("ejMenu");
    };
    InternalContext.prototype._contextopen = function () {
        var context = this["_conmenu"].element;
        if (context.length > 0) {
            if (!context.find("li").is(":visible")) {
                context.css("visibility", "hidden");
            }
        }
    };
    InternalContext.prototype._kanbanContextClick = function (sender, kObj) {
        var args, c, card, cardlen;
        if (sender.parentText != null)
            args = sender.parentText;
        else
            args = sender.events.text;
        c = $(kObj._contexttarget);
        sender.targetelement = kObj._contexttarget;
        card = c.closest(".e-kanbancard");
        cardlen = card.length;
        if (card.length > 0) {
            sender.card = card;
            sender.index = card.parent('.e-rowcell').find('.e-kanbancard').index(card);
            sender.cellIndex = card.parent('.e-rowcell').index();
            sender.rowIndex = kObj.getIndexByRow(card.parents('.e-columnrow'));
            sender.cardData = kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, card.attr('id'))[0];
        }
        if (kObj._trigger("contextClick", sender))
            return;
        switch (args) {
            case kObj.localizedLabels.AddCard:
                kObj._isAddNewClick = true;
                kObj._newCard = $(kObj._contexttarget);
                if (kObj.KanbanEdit)
                    kObj.KanbanEdit.addCard();
                break;
            case kObj.localizedLabels.EditCard:
                if (cardlen > 0 && !ej.isNullOrUndefined(kObj.model.fields.primaryKey) && kObj.KanbanEdit)
                    kObj.KanbanEdit.startEdit(card);
                break;
            case kObj.localizedLabels.HideColumn:
                if (c.closest(".e-headercell").find(".e-headercelldiv").length > 0)
                    kObj.hideColumns($.trim(c.closest(".e-headercell").find(".e-headercelldiv .e-headerdiv").text()).split("[")[0]);
                break;
            case kObj.localizedLabels.DeleteCard:
                if (!ej.isNullOrUndefined(kObj.model.fields.primaryKey) && card.length > 0 && kObj.KanbanEdit) {
                    kObj.KanbanEdit.deleteCard(card.attr("id"));
                    kObj.KanbanCommon._showhide(kObj._hiddenColumns, "hide");
                    if (kObj.model.enableTotalCount)
                        kObj.KanbanCommon._totalCount();
                }
                break;
            case kObj.localizedLabels.MoveRight:
                if (cardlen > 0 && kObj.KanbanDragAndDrop) {
                    kObj._bulkUpdateData = [];
                    kObj.KanbanDragAndDrop._dropToColumn($(kObj._contexttarget).closest("td.e-rowcell").next(), card);
                    if (kObj.model.enableTotalCount)
                        kObj.KanbanCommon._totalCount();
                }
                break;
            case kObj.localizedLabels.MoveLeft:
                if (cardlen > 0 && kObj.KanbanDragAndDrop) {
                    kObj._bulkUpdateData = [];
                    kObj.KanbanDragAndDrop._dropToColumn($(kObj._contexttarget).closest("td.e-rowcell").prev(), card);
                    if (kObj.model.enableTotalCount)
                        kObj.KanbanCommon._totalCount();
                }
                break;
            case kObj.localizedLabels.MoveUp:
                if (cardlen > 0 && kObj.KanbanDragAndDrop) {
                    kObj._bulkUpdateData = [];
                    kObj.KanbanDragAndDrop._dropAsSibling(card.prev(), card, false);
                }
                break;
            case kObj.localizedLabels.MoveDown:
                if (cardlen > 0 && kObj.KanbanDragAndDrop) {
                    kObj._bulkUpdateData = [];
                    kObj.KanbanDragAndDrop._dropAsSibling(card.next(), card, true);
                }
                break;
            case kObj.localizedLabels.TopofRow:
                if (cardlen > 0 && kObj.KanbanDragAndDrop) {
                    kObj._bulkUpdateData = [];
                    kObj.KanbanDragAndDrop._dropAsSibling(c.closest("td.e-rowcell").find(".e-kanbancard").first(), card, false);
                }
                break;
            case kObj.localizedLabels.BottomofRow:
                if (cardlen > 0 && kObj.KanbanDragAndDrop) {
                    kObj._bulkUpdateData = [];
                    kObj.KanbanDragAndDrop._dropAsSibling(c.closest("td.e-rowcell").find(".e-kanbancard").last(), card, true);
                }
                break;
            case kObj.localizedLabels.MovetoSwimlane:
                if (args != sender.text && cardlen > 0) {
                    var id = c.closest(".e-kanbancard").attr("id");
                    kObj._hiddenColumns = [];
                    var data = new ej.DataManager(kObj._currentJsonData).executeLocal(new ej.Query().where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, id))[0];
                    var swimKey = kObj.model.fields.swimlaneKey;
                    if (!ej.isNullOrUndefined(swimKey) && kObj.model.swimlaneSettings.headers.length > 0) {
                        var slKey = new ej.DataManager(kObj.currentViewData).executeLocal(new ej.Query().where('slHeader', ej.FilterOperators.equal, sender.text))[0];
                        data[swimKey] = slKey.key;
                    }
                    else
                        data[swimKey] = sender.text;
                    var args = { data: data, requestType: "save", primaryKeyValue: data[kObj.model.fields.primaryKey] };
                    kObj._saveArgs = args;
                    kObj.updateCard(id, data);
                    kObj.KanbanCommon._showhide(kObj._hiddenColumns, "hide");
                    if (kObj._dataManager.dataSource.offline)
                        kObj._saveArgs = null;
                }
                break;
            case kObj.localizedLabels.PrintCard:
                if (cardlen > 0)
                    kObj.print(card);
                break;
            case kObj.localizedLabels.VisibleColumns:
                if (args != sender.text) {
                    var index = $(sender.element.parentElement).find("li").index(sender.element);
                    if (kObj.model.columns[index].visible) {
                        kObj.hideColumns(sender.text);
                        $($(sender.element).find("input.e-checkbox")).ejCheckBox({ "checked": false });
                    }
                    else {
                        kObj.showColumns(sender.text);
                        $($(sender.element).find("input.e-checkbox")).ejCheckBox({ "checked": true });
                    }
                }
                break;
        }
        if (kObj.model.isResponsive)
            kObj.kanbanWindowResize();
        if (kObj.model.allowScrolling && !kObj.element.hasClass("e-responsive"))
            kObj.kanbanContent.data('ejScroller').refresh();
        if (kObj.element.hasClass('e-responsive') && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey) && kObj._kbnAdaptDdlIndex > 0) {
            var scroller = kObj.kanbanContent.data('ejScroller'), rows, sTop = kObj._freezeScrollTop;
            ;
            rows = kObj.element[0].getElementsByClassName('e-columnrow');
            scroller.scrollY(0, true);
            kObj._freezeScrollTop = sTop;
            scroller.scrollY(kObj._freezeScrollTop, true);
        }
    };
    InternalContext.prototype._kanbanSubMenu = function () {
        var kObj = this.kanbanObj;
        if (kObj.model.fields.swimlaneKey) {
            ul = kObj._conmenu.element.get(0);
            subul = kObj._conmenu.element.find("#" + kObj._id + "_SubContext_Swimlane").get(0);
            $(subul).find("li").remove();
            data = ej.dataUtil.mergeSort(ej.dataUtil.distinct(kObj._kbnSwimLaneData));
            for (i = 0; i < data.length; i++) {
                var item = data[i];
                menu = this._items(item, "subMenuItem").get(0);
                $(subul).append(menu);
            }
            $(ul).find("li.e-move.e-swimlane").append(subul);
        }
    };
    InternalContext.prototype._kanbanMenu = function (sender, kObj) {
        var context, targetelement, td, tr, rowCell, card, contextmenu, custommenuitems, customitems, i, j, count, index, menuItems;
        context = kObj._conmenu.element;
        kObj._contexttarget = sender.target;
        targetelement = $(sender.target);
        td = $(kObj._contexttarget).closest("td.e-rowcell");
        tr = $(kObj._contexttarget).closest("tr.e-columnrow");
        rowCell = targetelement.closest(".e-rowcell");
        card = $(targetelement).closest(".e-kanbancard");
        var cardData = kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, card.attr('id'))[0];
        contextmenu = kObj.model.contextMenuSettings.menuItems;
        context.css("visibility", "visible");
        context.find("li").hide();
        if (targetelement.closest(".e-kanban").attr("id") !== kObj._id) {
            context.css("visibility", "hidden");
            return;
        }
        if (context.find(".e-customitem").length > 0) {
            custommenuitems = kObj.model.contextMenuSettings.customMenuItems;
            customitems = context.find(".e-customitem");
            for (j = 0; j < customitems.length; j++) {
                if (!custommenuitems[j].target)
                    custommenuitems[j].target = "all";
                if (custommenuitems[j].target && custommenuitems[j].text == context.find(".e-customitem").children("a").eq(j).text())
                    switch (custommenuitems[j].target) {
                        case "content":
                            if (kObj.getContentTable().find(targetelement).length > 0) {
                                $(customitems[j]).show();
                                if ($(customitems[j]).find("li").length > 0)
                                    $(customitems[j]).find("li").show();
                            }
                            else
                                $(customitems[j]).hide();
                            break;
                        case "header":
                            if (kObj.getHeaderContent().find(targetelement).length > 0) {
                                $(customitems[j]).show();
                                if ($(customitems[j]).find("li").length > 0)
                                    $(customitems[j]).find("li").show();
                            }
                            else
                                $(customitems[j]).hide();
                            break;
                        case "card":
                            if (kObj.element.find(".e-kanbancard").find(targetelement).length > 0) {
                                $(customitems[j]).show();
                                if ($(customitems[j]).find("li").length > 0)
                                    $(customitems[j]).find("li").show();
                            }
                            else
                                $(customitems[j]).hide();
                            break;
                        case "all":
                            $(customitems[j]).show();
                            if ($(customitems[j]).find("li").length > 0)
                                $(customitems[j]).find("li").show();
                            break;
                    }
            }
        }
        if (kObj.getContentTable().find(targetelement).length > 0) {
            if (rowCell.length == 0 || targetelement.filter(".e-targetclone,.e-targetdragclone").length > 0) {
                context.css("visibility", "hidden");
                return;
            }
            else if ($(targetelement).closest(".e-swimlanerow").length > 0) {
                context.css("visibility", "hidden");
                return;
            }
            else if (card.length > 0) {
                var closecard = $(targetelement).closest("td.e-rowcell").find(".e-kanbancard");
                index = closecard.index(card);
                count = closecard.length;
                $(context.find("li").not(".e-customitem")).hide();
                $(context.find(".e-customitem li")).show();
                if (!ej.isNullOrUndefined(kObj.model.fields.primaryKey) && kObj.model.editSettings.allowEditing)
                    context.find(".e-content.e-cardedit").show();
                if (td.hasClass("e-drag")) {
                    if (index > 1)
                        context.find(".e-move.e-up").show();
                    if (index != count - 1 && td.hasClass("e-drop"))
                        context.find(".e-row.e-bottom").show();
                    if (index != 0 && td.hasClass("e-drop"))
                        context.find(".e-row.e-top").show();
                    if (((count - 1) - index) > 1)
                        context.find(".e-move.e-down").show();
                    if (td.next().length > 0 && td.next().hasClass("e-drop") && !kObj._checkMultikey(td.next()) && kObj.KanbanCommon._preventCardMove(cardData[kObj.model.keyField], kObj.model.columns[td.next().index()]["key"]))
                        context.find(".e-move.e-right").show();
                    if (td.prev().length > 0 && td.prev().hasClass("e-drop") && !kObj._checkMultikey(td.prev()) && kObj.KanbanCommon._preventCardMove(cardData[kObj.model.keyField], kObj.model.columns[td.prev().index()]["key"]))
                        context.find(".e-move.e-left").show();
                    if (kObj.model.fields.swimlaneKey && kObj.model.fields.primaryKey && context.find(".e-move.e-swimlane").length > 0) {
                        context.find(".e-move.e-swimlane").show();
                        context.find(".e-move.e-swimlane").find("li").show();
                        if (kObj.model.showColumnWhenEmpty && kObj.model.initiallyEmptyDataSource) {
                            data = ej.dataUtil.mergeSort(ej.dataUtil.distinct(kObj._kbnSwimLaneData));
                            for (i = 0; i < data.length; i++) {
                                if (data[i] == cardData[kObj.model.fields.swimlaneKey])
                                    context.find(".e-move.e-swimlane").find("li").eq(i).hide();
                            }
                        }
                        else
                            context.find(".e-move.e-swimlane").find("li").eq(kObj._columnRows.index(tr)).hide();
                    }
                }
                if (!ej.isNullOrUndefined(kObj.model.fields.primaryKey))
                    context.find(".e-content.delete").show();
                if (kObj.model.allowPrinting)
                    context.find(".e-print").show();
            }
            else if (rowCell.length > 0) {
                $(context.find("li").not(".e-customitem")).hide();
                $(context.find(".e-customitem li")).show();
                if (kObj.model.editSettings.allowAdding)
                    context.find(".e-add").show();
            }
        }
        else if (kObj.getHeaderContent().find(targetelement).length > 0) {
            var concolumnmenu = context.find(".e-column");
            if ($(targetelement).closest(".e-headercell").not(".e-stackedHeaderCell").length > 0) {
                $(context.find("li").not(".e-customitem")).hide();
                $(context.find(".e-customitem li")).show();
                $(context.find("li.e-haschild").find("li")).show();
                concolumnmenu.show();
                for (i = 0; i < context.find(".e-column.e-visiblecolumn").find("li").length; i++) {
                    if (kObj.element.find(".e-headercell").not(".e-stackedHeaderCell").eq(i).hasClass("e-hide"))
                        concolumnmenu.find("li input.e-checkbox").eq(i).ejCheckBox({ checked: false });
                    else
                        concolumnmenu.find("li input.e-checkbox").eq(i).ejCheckBox({ checked: true });
                }
                concolumnmenu.find("li").show();
            }
            else {
                context.css("visibility", "hidden");
                return;
            }
        }
        else {
            context.css("visibility", "hidden");
            return;
        }
        if (kObj.model.contextOpen) {
            sender.card = card;
            sender.index = card.parent('.e-rowcell').find('.e-kanbancard').index(card);
            sender.cellIndex = card.parent('.e-rowcell').index();
            sender.rowIndex = kObj.getIndexByRow(card.parents('.e-columnrow'));
            sender.cardData = kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, card.attr('id'))[0];
            kObj._trigger("contextOpen", sender);
        }
    };
    InternalContext.prototype._items = function (item, type) {
        if (item == "" || ej.isNullOrUndefined(item))
            return false;
        var li, localization;
        if (type == "menuItem") {
            if (item.indexOf("Card") != -1) {
                li = ej.buildTag('li', "", {}, { "class": "e-content" });
                li.css("display", "none");
                if (item.indexOf("Add") != -1) {
                    li.addClass("e-add");
                    localization = this.kanbanObj.localizedLabels.AddCard;
                }
                if (item.indexOf("Edit") != -1) {
                    li.addClass("e-cardedit");
                    localization = this.kanbanObj.localizedLabels.EditCard;
                }
                if (item.indexOf("Delete") != -1) {
                    li.addClass("delete");
                    localization = this.kanbanObj.localizedLabels.DeleteCard;
                }
                if (item.indexOf("Print") != -1) {
                    li.addClass("e-print");
                    localization = this.kanbanObj.localizedLabels.PrintCard;
                }
                li.css("display", "none");
            }
            else if (item.indexOf("Column") != -1 || item.indexOf("Columns") != -1) {
                li = ej.buildTag('li', "", {}, { "class": "e-column" });
                if (item.indexOf("Hide") != -1) {
                    li.addClass("e-hidecolumn");
                    localization = this.kanbanObj.localizedLabels.HideColumn;
                }
                if (item.indexOf("Visible") != -1) {
                    li.addClass("e-visiblecolumn");
                    localization = this.kanbanObj.localizedLabels.VisibleColumns;
                }
                li.css("display", "none");
            }
            else if (item.indexOf("Row") != -1) {
                li = ej.buildTag('li', "", {}, { "class": "e-row" });
                if (item.indexOf("Top") != -1) {
                    li.addClass("e-top");
                    localization = this.kanbanObj.localizedLabels.TopofRow;
                }
                else {
                    li.addClass("e-bottom");
                    localization = this.kanbanObj.localizedLabels.BottomofRow;
                }
                li.css("display", "none");
            }
            else if (item.indexOf("Move") != -1) {
                li = ej.buildTag('li', "", {}, { "class": "e-move" });
                if (item.indexOf("Left") != -1) {
                    li.addClass("e-left");
                    localization = this.kanbanObj.localizedLabels.MoveLeft;
                }
                else if (item.indexOf("Right") != -1) {
                    li.addClass("e-right");
                    localization = this.kanbanObj.localizedLabels.MoveRight;
                }
                else if (item.indexOf("Up") != -1) {
                    li.addClass("e-up");
                    localization = this.kanbanObj.localizedLabels.MoveUp;
                }
                else if (item.indexOf("Down") != -1) {
                    li.addClass("e-down");
                    localization = this.kanbanObj.localizedLabels.MoveDown;
                }
                else if (item.indexOf("Swimlane") != -1) {
                    li.addClass("e-swimlane");
                    localization = this.kanbanObj.localizedLabels.MovetoSwimlane;
                }
                li.css("display", "none");
            }
        }
        else if (type == "subMenuItem") {
            li = ej.buildTag('li', "", {}, {});
            if (this.kanbanObj.model.showColumnWhenEmpty && this.kanbanObj.model.initiallyEmptyDataSource) {
                $(li).addClass("e-list");
                $(li).attr('role', 'menuitem');
            }
        }
        else if (type == "custom") {
            li = ej.buildTag('li', "", {}, { "class": "e-customitem" });
            li.css("display", "block");
        }
        var a = document.createElement("a"), classElement = "";
        if (typeof item == "string") {
            if (item.indexOf("Move to") != -1)
                classElement = item.split(" ")[2].toLowerCase();
            else if (item.indexOf("Move") != -1)
                classElement = item.split(" ")[1].toLowerCase();
            else
                classElement = item.split(" ")[0].toLowerCase();
        }
        else
            classElement = item;
        if (ej.isNullOrUndefined(localization))
            a.innerHTML = item;
        else
            a.innerHTML = localization;
        if (this.kanbanObj.model.showColumnWhenEmpty && this.kanbanObj.model.initiallyEmptyDataSource)
            $(a).addClass("e-menulink");
        $(a).append(ej.buildTag('span', "", {}, { "class": "e-kanbancontext e-icon e-context" + classElement }));
        li.append(a);
        return li;
    };
    InternalContext.prototype._kbnBrowserContextMenu = function (e) {
        if (this["_kbnBrowserContext"] == "contextmenu" && this["model"].enableTouch)
            e.preventDefault();
        this["_kbnBrowserContext"] = "null";
    };
    return InternalContext;
}());
window.ej.createObject("ej.KanbanFeatures.Context", InternalContext, window);
